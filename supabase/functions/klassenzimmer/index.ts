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
     2. Hat er heute schon zu viel geholt? Die Tagesgrenze steht
        auf 1000 (einstellbar in betreiber_geheimnisse unter
        „turn_tagesgrenze"). Sie faengt eine Schleife ab, die sich
        festfrisst — kosten tut ein Abruf nichts, bezahlt wird
        nach Gigabyte. Dafuer steht das Monatsbudget davor.
     3. Beim Eintragen des Schluessels: ist er wirklich der
        Betreiber? Das wird an der Datenbank geprueft
        (profiles.is_owner), nicht an dem, was der Browser
        behauptet.

   WAS HIER NICHT PASSIERT
   Es geht kein Ton und kein Bild durch diese Funktion. Sie
   sagt nur, WOHIN der Ton gehen darf. Aufgezeichnet wird
   nichts.
   ========================================================= */
/* STAND DER VEROEFFENTLICHUNG
   Diese Datei ist am 20.09.2026 als Fassung 3 in Supabase
   hochgeladen worden (Projekt rolcktiryrvjzbwuvobb). Die dort
   liegende Fassung hat dieselbe Logik, Zeile fuer Zeile; nur die
   langen Begruendungen sind dort gekuerzt. Wer hier etwas aendert,
   laedt danach neu hoch:  supabase functions deploy klassenzimmer  */
import { createClient } from "jsr:@supabase/supabase-js@2";

/* Wie oft darf sich eine Person am Tag Zugangsdaten holen?
   -----------------------------------------------------------
   GEMELDET, woertlich: „Dieses Konto hat heute schon 60-mal
   Zugangsdaten geholt … kann man nicht 100.000-mal Request
   machen? … Ich moechte in Zukunft die Leute immer hoeren."

   Er hat recht, und die Rechnung war von Anfang an schief. Die
   Annahme „einmal je Betreten reicht" stimmt nur, solange
   niemand die Seite neu laedt: die Zugangsdaten lagen im
   Arbeitsspeicher und waren nach jedem Neuladen weg. Beim
   Entwickeln, Ausprobieren und Umschalten zwischen Raeumen sind
   60 an einem Nachmittag erreicht — und dann steht der Ton.

   WICHTIG ZUM VERSTAENDNIS: dieser Zaehler kostet NICHTS. Bezahlt
   wird bei Cloudflare nach uebertragenen Gigabyte, nicht nach
   abgeholten Zugangsdaten. Die Tagesgrenze ist nur eine Bremse
   gegen eine Schleife, die sich festfrisst. Die Bremse gegen die
   RECHNUNG ist das Monatsbudget (turn_budget_gb) — und die steht
   davor und bleibt.

   Deshalb jetzt: 1000 statt 60, und einstellbar in
   betreiber_geheimnisse unter „turn_tagesgrenze" — genau wie das
   Budget. Dazu holt die Seite die Daten nur noch, wenn sie
   wirklich abgelaufen sind (sie liegen zwei Stunden im Geraet,
   siehe livechat.js). Beides zusammen macht aus 60 Abrufen am Tag
   eine Handvoll. */
const TAGESGRENZE_STANDARD = 1000;

/* Wie lange gelten die ausgegebenen Zugangsdaten? Zwei Stunden:
   lang genug fuer eine Stunde Unterricht mit Pause, kurz genug,
   dass ein abgefangener Wert schnell wertlos ist. */
const GUELTIG_SEKUNDEN = 2 * 60 * 60;

/* =========================================================
   DIE BREMSE — ES DARF NIE ETWAS ABGERECHNET WERDEN
   ---------------------------------------------------------
   GEWUENSCHT: „Ich moechte es so haben, dass es niemals die
   Grenze ueberschreitet, dass mir niemals weitere Gigabyte
   angerechnet werden koennen. Ich moechte dafuer nichts
   bezahlen — das musst du so einstellen, dass dann wirklich
   Schluss ist."

   Ehrlich gesagt: diese Funktion SIEHT den echten Verbrauch
   nicht. Wie viele Bytes durch das Relais laufen, weiss
   Cloudflare, nicht wir. Was wir aber koennen — und was fuer
   „niemals ueberschreiten" auch das Richtige ist —, ist im
   SCHLIMMSTEN FALL zu rechnen:

     Jede ausgegebene Zugangsberechtigung gilt zwei Stunden.
     Liefe sie die ganze Zeit mit voller Sprachrate in beide
     Richtungen, waeren das
       40 kbit/s * 2 Richtungen * 7200 s = 72 MB.
     Mehr kann eine einzelne Ausgabe nicht verursachen.

   Also wird jede Ausgabe mit 72 MB gebucht. In Wirklichkeit
   ist es fast immer ein Bruchteil davon: die meisten
   Verbindungen kommen ohne Relais aus, und wer schweigt,
   sendet fast nichts (DTX). Die Bremse greift damit IMMER zu
   frueh und nie zu spaet — und genau so ist es gemeint.

   Ist das Monatsbudget aufgebraucht, gibt es keine Relais-
   Daten mehr. Das Klassenzimmer laeuft dann ohne Relais
   weiter (direkt, wie bei den meisten ohnehin) und notfalls
   im Fokus-Modus mit Sprachnachrichten — der kostet nichts,
   er laeuft ueber Supabase.
   ========================================================= */
const MB_JE_AUSGABE = 72;
/* Xander: "ich weiss nicht ob du das Budget hoch setzen musst haben
   wir wirklich 1000 GB wie viel brauchen wir denn im Monat?"
   Cloudflare rechnet beim Relais nach uebertragenen Gigabyte ab und
   gibt laut seiner eigenen Doku 1000 GB im Monat frei, bevor etwas
   kostet. Ein GB reicht fuer rund vier Stunden Sprache — fuer eine
   Runde mit 40 Mitgliedern viel zu knapp. 25 GB sind rund hundert
   Stunden Relais im Monat und liegen immer noch weit unter dem
   Freibetrag, kosten also nichts. */
const BUDGET_STANDARD_GB = 25;

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
    .in("schluessel", ["cf_turn_id", "cf_turn_token", "turn_budget_gb", "turn_tagesgrenze"]);
  const m: Record<string, string> = {};
  (data || []).forEach((z: { schluessel: string; wert: string }) => { m[z.schluessel] = z.wert; });
  const budget = Number(m["turn_budget_gb"]);
  const tagesgrenze = Number(m["turn_tagesgrenze"]);
  return {
    kennung: m["cf_turn_id"] || "",
    token: m["cf_turn_token"] || "",
    budgetGb: Number.isFinite(budget) && budget > 0 ? budget : BUDGET_STANDARD_GB,
    tagesgrenze: Number.isFinite(tagesgrenze) && tagesgrenze > 0
      ? tagesgrenze : TAGESGRENZE_STANDARD,
  };
}

/* Was im laufenden Monat schon gebucht wurde — im schlimmsten
   Fall gerechnet (siehe oben). Gezaehlt werden die Ausgaben
   ALLER Personen zusammen; es ist ja eine Rechnung. */
async function monatsverbrauch() {
  const jetzt = new Date();
  const ab = jetzt.getFullYear() + "-" + String(jetzt.getMonth() + 1).padStart(2, "0") + "-01";
  const { data } = await dienst()
    .from("turn_nutzung")
    .select("anfragen")
    .gte("tag", ab);
  const ausgaben = (data || []).reduce((a: number, z: { anfragen: number }) => a + (z.anfragen || 0), 0);
  return { ausgaben, mb: ausgaben * MB_JE_AUSGABE };
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
    const { kennung, token: tok, budgetGb, tagesgrenze } = await geheimnisse();
    const verbrauch = await monatsverbrauch();
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
      tagesgrenze: tagesgrenze,
      /* Damit der Betreiber SIEHT, wie weit die Bremse steht.
         „hoechstens" ist woertlich zu nehmen: mehr kann es nicht
         geworden sein, weniger fast sicher. */
      budgetGb: budgetGb,
      verbrauchtMbHoechstens: verbrauch.mb,
      ausgabenDiesenMonat: verbrauch.ausgaben,
      mbJeAusgabe: MB_JE_AUSGABE,
    });
  }

  /* =======================================================
     B) SCHLUESSEL EINTRAGEN ODER LOESCHEN — nur der Betreiber
     ======================================================= */
  if (aktion === "schluessel-setzen" || aktion === "schluessel-loeschen"
      || aktion === "budget-setzen") {
    const { data: profil } = await sb.from("profiles").select("is_owner").eq("id", nutzer.id).maybeSingle();
    if (!profil?.is_owner) return json({ fehler: "nicht-erlaubt" }, 403);

    /* Die Bremse enger oder weiter stellen. Sie steht bewusst in
       derselben Tuer wie die Schluessel: beides darf nur der
       Betreiber, und beides wird an der Datenbank geprueft, nicht
       an dem, was der Browser behauptet. */
    if (aktion === "budget-setzen") {
      const gb = Number(koerper.gb);
      if (!Number.isFinite(gb) || gb <= 0 || gb > 900) {
        return json({ fehler: "budget-unsinnig" }, 400);
      }
      await sb.from("betreiber_geheimnisse").upsert([
        { schluessel: "turn_budget_gb", wert: String(gb),
          geaendert_am: new Date().toISOString(), geaendert_von: nutzer.id },
      ], { onConflict: "schluessel" });
      return json({ ok: true, budgetGb: gb });
    }

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

  const { kennung, token: tok, budgetGb, tagesgrenze } = await geheimnisse();
  if (!kennung || !tok) return json({ fehler: "kein-relais" }, 503);

  /* DIE BREMSE. Sie steht VOR allem anderen: lieber kein Relais
     als eine Rechnung. Was danach passiert, entscheidet die Seite —
     sie verbindet dann direkt oder geht in den Fokus-Modus, und
     beides kostet nichts. */
  const verbrauch = await monatsverbrauch();
  if (verbrauch.mb + MB_JE_AUSGABE > budgetGb * 1024) {
    return json({
      fehler: "budget-erschoepft",
      budgetGb,
      verbrauchtMbHoechstens: verbrauch.mb,
    }, 429);
  }

  /* Tagesgrenze — eine eigene Zeile je Tag und Person. */
  const tag = new Date().toISOString().slice(0, 10);
  const { data: heute } = await sb.from("turn_nutzung")
    .select("anfragen").eq("user_id", nutzer.id).eq("tag", tag).maybeSingle();
  const bisher = heute?.anfragen || 0;
  /* Die Grenze steht jetzt in betreiber_geheimnisse und ist auf
     1000 voreingestellt — sie soll eine Schleife abfangen, nicht
     einen Unterrichtstag. Wie viele es schon waren, steht in der
     Absage: ohne diese Zahl raet man. */
  if (bisher >= tagesgrenze) {
    return json({ fehler: "tagesgrenze", grenze: tagesgrenze, heute: bisher }, 429);
  }

  const ergebnis = await vonCloudflare(kennung, tok);
  if ("fehler" in ergebnis) return json(ergebnis, 502);

  await sb.from("turn_nutzung").upsert(
    { user_id: nutzer.id, tag, anfragen: bisher + 1 },
    { onConflict: "user_id,tag" },
  );

  return json({ server: ergebnis.server, gueltigSekunden: GUELTIG_SEKUNDEN });
});
