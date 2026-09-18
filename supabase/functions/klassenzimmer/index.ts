/* =========================================================
   KLASSENZIMMER — die Edge-Function fuer den Livestream
   ---------------------------------------------------------
   DER AUFTRAG
   „Bereite schon alles vor fuer den Livestream auf dem
    Medienserver. Ich soll nur noch den API-Schluessel
    eintragen muessen, und das Framework ist schon vorhanden
    und funktioniert, dass wir heute den Livestream starten
    koennen."

   WARUM ES DIESE DATEI BRAUCHT
   Das Klassenzimmer verbindet die Teilnehmer direkt
   miteinander (WebRTC). Das klappt, solange beide Seiten
   erreichbar sind. Hinter einem strengen Firmennetz, einem
   Mobilfunk-NAT oder einer restriktiven Fritzbox klappt es
   nicht — dann braucht es ein RELAIS (TURN), ueber das der
   Ton laeuft. Die oeffentlichen Gratis-Relais, die bisher
   eingetragen sind, sind ueberlastet und unzuverlaessig.

   Cloudflare Realtime gibt ein Relais heraus, das im
   kostenlosen Rahmen liegt (Stand September 2026: 1.000 GB
   im Monat frei, danach 0,05 $ je GB). Dafuer braucht es
   ZWEI Werte: eine TURN-Token-ID und einen API-Token.

   Der API-Token darf NIEMALS in die Webseite. Alles, was der
   Browser kennt, kennt auch jeder Besucher — und wer ihn
   findet, laesst auf Alex' Rechnung Daten laufen. Deshalb
   liegt er hier, in der Datenbank, hinter dem Service-Key,
   und diese Funktion gibt nach aussen nur noch KURZLEBIGE
   Zugangsdaten heraus (zwei Stunden), die an nichts anderes
   heranreichen.

   WAS HIER GEPRUEFT WIRD
     1. Ist der Anfragende angemeldet? Ein Relais ist nichts,
        was Fremde benutzen sollen.
     2. Hat er heute schon zu viel geholt? 60 Ausgaben am Tag
        sind fuer einen Menschen reichlich und fuer ein
        Schadprogramm zu wenig, um etwas anzurichten.
     3. Beim Eintragen des Schluessels: ist er wirklich der
        Betreiber? Das wird an der Datenbank geprueft
        (profiles.is_owner), nicht an dem, was der Browser
        behauptet.

   WAS HIER NICHT PASSIERT
   Es geht kein Ton und kein Bild durch diese Funktion. Sie
   sagt nur, WOHIN der Ton gehen darf. Aufgezeichnet wird
   nichts.
   ========================================================= */
import { createClient } from "jsr:@supabase/supabase-js@2";

/* Wie oft darf sich eine Person am Tag Zugangsdaten holen?
   Einmal je Betreten des Klassenzimmers reicht — 60 ist also
   grosszuegig fuer einen Menschen. */
const TAGESGRENZE = 60;

/* Wie lange gelten die ausgegebenen Zugangsdaten? Zwei Stunden:
   lang genug fuer eine Stunde Unterricht mit Pause, kurz genug,
   dass ein abgefangener Wert schnell wertlos ist. */
const GUELTIG_SEKUNDEN = 2 * 60 * 60;

const KOPF = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(koerper: unknown, status = 200) {
  return new Response(JSON.stringify(koerper), {
    status,
    headers: { ...KOPF, "Content-Type": "application/json" },
  });
}

function dienst() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

/* Die hinterlegten Werte holen. Der API-Token verlaesst diese
   Funktion nie — auch nicht in einer Fehlermeldung. */
async function geheimnisse() {
  const { data } = await dienst()
    .from("betreiber_geheimnisse")
    .select("schluessel, wert")
    .in("schluessel", ["cf_turn_id", "cf_turn_token"]);
  const m: Record<string, string> = {};
  (data || []).forEach((z: { schluessel: string; wert: string }) => { m[z.schluessel] = z.wert; });
  return { kennung: m["cf_turn_id"] || "", token: m["cf_turn_token"] || "" };
}

/* Bei Cloudflare kurzlebige Zugangsdaten holen.
   -----------------------------------------------------------
   Cloudflare hat zwei Endpunkte, die unterschiedlich antworten:
   „/generate" gibt ein einzelnes iceServers-Objekt zurueck,
   „/generate-ice-servers" eine Liste, in der der STUN-Eintrag
   eigenstaendig steht. Welcher von beiden gerade bedient wird,
   haengt am Konto — deshalb wird HIER BEIDES angenommen und in
   die Form gebracht, die der Browser braucht (immer eine
   Liste). Geraten wird nichts: was nicht kommt, wird auch
   nicht erfunden, dann gibt es eine ehrliche Fehlermeldung. */
async function vonCloudflare(kennung: string, token: string) {
  const antwort = await fetch(
    "https://rtc.live.cloudflare.com/v1/turn/keys/" + encodeURIComponent(kennung)
      + "/credentials/generate-ice-servers",
    {
      method: "POST",
      headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ ttl: GUELTIG_SEKUNDEN }),
    },
  ).catch(() => null);
  if (!antwort) return { fehler: "cloudflare-nicht-erreichbar" };
  if (antwort.status === 401 || antwort.status === 403) return { fehler: "schluessel-falsch" };
  if (!antwort.ok) return { fehler: "cloudflare-antwortet-nicht", status: antwort.status };

  let daten: Record<string, unknown> = {};
  try { daten = await antwort.json(); } catch { return { fehler: "cloudflare-kein-json" }; }

  const roh = (daten as { iceServers?: unknown }).iceServers;
  const liste = Array.isArray(roh) ? roh : (roh ? [roh] : []);
  const server = liste.filter((e) => e && typeof e === "object" && (e as { urls?: unknown }).urls);
  if (!server.length) return { fehler: "cloudflare-ohne-server" };
  return { server };
}

Deno.serve(async (anfrage: Request) => {
  if (anfrage.method === "OPTIONS") return new Response("ok", { headers: KOPF });
  if (anfrage.method !== "POST") return json({ fehler: "nur-post" }, 405);

  const kopfzeile = anfrage.headers.get("Authorization") || "";
  const token = kopfzeile.replace(/^Bearer\s+/i, "");
  if (!token) return json({ fehler: "nicht-angemeldet" }, 401);

  const sb = dienst();
  const { data: nutzerDaten, error: nutzerFehler } = await sb.auth.getUser(token);
  const nutzer = nutzerDaten?.user;
  if (nutzerFehler || !nutzer) return json({ fehler: "nicht-angemeldet" }, 401);

  let koerper: Record<string, unknown> = {};
  try { koerper = await anfrage.json(); } catch { return json({ fehler: "kein-json" }, 400); }
  const aktion = String(koerper.aktion || "");

  /* =======================================================
     A) STAND — ist das Relais eingerichtet?
     Gibt NIE einen Schluessel zurueck, nur ob einer da ist.
     ======================================================= */
  if (aktion === "stand") {
    const { kennung, token: tok } = await geheimnisse();
    const { data: profil } = await sb.from("profiles").select("is_owner").eq("id", nutzer.id).maybeSingle();
    return json({
      relaisDa: Boolean(kennung && tok),
      /* Die Kennung ist kein Geheimnis — sie steht in jedem
         ausgegebenen Benutzernamen. Trotzdem nur der Anfang,
         damit der Betreiber sie WIEDERERKENNT, ohne dass sie
         irgendwo vollstaendig herumliegt. */
      kennungAnfang: kennung ? kennung.slice(0, 8) : "",
      betreiber: Boolean(profil?.is_owner),
      gueltigSekunden: GUELTIG_SEKUNDEN,
      tagesgrenze: TAGESGRENZE,
    });
  }

  /* =======================================================
     B) SCHLUESSEL EINTRAGEN ODER LOESCHEN — nur der Betreiber
     ======================================================= */
  if (aktion === "schluessel-setzen" || aktion === "schluessel-loeschen") {
    const { data: profil } = await sb.from("profiles").select("is_owner").eq("id", nutzer.id).maybeSingle();
    if (!profil?.is_owner) return json({ fehler: "nicht-erlaubt" }, 403);

    if (aktion === "schluessel-loeschen") {
      await sb.from("betreiber_geheimnisse").delete().in("schluessel", ["cf_turn_id", "cf_turn_token"]);
      return json({ ok: true, relaisDa: false });
    }

    const kennung = String(koerper.kennung || "").trim();
    const tok = String(koerper.token || "").trim();
    if (!kennung || !tok) return json({ fehler: "unvollstaendig" }, 400);

    /* Vor dem Speichern einmal anklopfen. Ein falscher Schluessel,
       der still gespeichert wird, faellt sonst erst mitten im
       Livestream auf — vor Publikum. */
    const probe = await vonCloudflare(kennung, tok);
    if ("fehler" in probe) return json(probe, 400);

    await sb.from("betreiber_geheimnisse").upsert([
      { schluessel: "cf_turn_id", wert: kennung, geaendert_am: new Date().toISOString(), geaendert_von: nutzer.id },
      { schluessel: "cf_turn_token", wert: tok, geaendert_am: new Date().toISOString(), geaendert_von: nutzer.id },
    ], { onConflict: "schluessel" });
    return json({ ok: true, relaisDa: true, server: probe.server });
  }

  /* =======================================================
     C) ZUGANG — kurzlebige Relais-Daten fuer Angemeldete
     ======================================================= */
  if (aktion !== "zugang") return json({ fehler: "unbekannte-aktion" }, 400);

  const { kennung, token: tok } = await geheimnisse();
  if (!kennung || !tok) return json({ fehler: "kein-relais" }, 503);

  /* Tagesgrenze — eine eigene Zeile je Tag und Person. */
  const tag = new Date().toISOString().slice(0, 10);
  const { data: heute } = await sb.from("turn_nutzung")
    .select("anfragen").eq("user_id", nutzer.id).eq("tag", tag).maybeSingle();
  const bisher = heute?.anfragen || 0;
  if (bisher >= TAGESGRENZE) return json({ fehler: "tagesgrenze" }, 429);

  const ergebnis = await vonCloudflare(kennung, tok);
  if ("fehler" in ergebnis) return json(ergebnis, 502);

  await sb.from("turn_nutzung").upsert(
    { user_id: nutzer.id, tag, anfragen: bisher + 1 },
    { onConflict: "user_id,tag" },
  );

  return json({ server: ergebnis.server, gueltigSekunden: GUELTIG_SEKUNDEN });
});
