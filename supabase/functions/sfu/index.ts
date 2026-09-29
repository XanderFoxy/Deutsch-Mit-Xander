/* =========================================================
   SFU — die Edge-Function fuer den Tonserver (Cloudflare Realtime SFU)
   ---------------------------------------------------------
   FASSUNG 827 — XANDER (Funk 209): „Die App … haengt total erst recht.
   Wenn andere Leute mit dazu kommen … das funktioniert auch bei
   HelloTalk … was muessen wir denn machen damit das endlich leicht und
   stabil laeuft?"
   Und im Walkie 311: „Ja: Cloudflare Realtime SFU aufbauen" — „Erst
   nur Ton ueber den Server, Bild bleibt wie jetzt".

   WARUM ES DIESE DATEI BRAUCHT
   Im Klassenzimmer schickt bisher jedes Handy seinen Ton an JEDEN
   anderen einzeln (ein „Netz"). Bei fuenf Leuten sind das vier
   Tonstroeme hinaus und vier herein, je Geraet, und jede Leitung will
   ausgehandelt, bewacht und neu gestartet werden. Ein Tonserver (SFU)
   macht daraus einen Stern: jedes Geraet schickt seinen Ton EINMAL zu
   Cloudflare und holt sich dort die Stimmen der anderen ab.

   Der Browser darf den Cloudflare-Schluessel NIE sehen. Er liegt als
   Geheimnis dieser Funktion in Supabase (CF_SFU_APP_ID,
   CF_SFU_APP_TOKEN) und verlaesst sie nie — nicht in einer Antwort,
   nicht in einer Fehlermeldung, nicht im Log. Diese Funktion reicht
   nur die Verbindungsbeschreibungen (SDP) zwischen Browser und
   Cloudflare hin und her.

   WAS HIER GEPRUEFT WIRD
     1. Ist der Anfragende angemeldet?
     2. Darf er schon? Zuerst nur der Betreiber und Beta-Tester
        (profiles.is_owner / is_beta_tester, oder in feature_flags
        „beta:sfu" eingetragen, oder feature_flags „sfu" fuer alle an).
        Geprueft an der Datenbank, nicht an dem, was der Browser sagt.
     3. DIE BREMSE (siehe unten): ist das Monatsbudget frei?

   WAS DIE SEITE BEI „aus" TUT
   Jede Antwort mit {aus:true} heisst fuer die Seite: zurueck aufs
   Netz, sofort und ohne Haenger. Das Klassenzimmer faellt nie aus,
   weil der Tonserver fehlt — es wird nur wieder schwerer.

   Aktionen (POST, JSON, Feld „aktion"):
     pruefen        — sagt nur, OB App-ID und Token gesetzt sind und ob
                      das Budget frei ist. NIE die Werte.
     sitzung        — neue Sitzung (sessions/new, ohne Koerper, so steht
                      es in der Cloudflare-Doku vom 22.09.2026) und, wenn
                      ein Angebot dabei ist, gleich die eigene Tonspur
                      veroeffentlichen (tracks/new, location „local").
     spuren         — Spuren anderer Sitzungen abholen (tracks/new,
                      location „remote") oder weitere eigene senden.
     neu_verhandeln — die Antwort des Browsers auf ein Angebot des
                      Servers abgeben (renegotiate).
     schliessen     — Spuren schliessen (tracks/close).
     puls           — alle 60 s: bucht den geschaetzten Verbrauch.
   ========================================================= */
/* STAND DER VEROEFFENTLICHUNG
   Diese Datei ist am 29.09.2026 mit dem Supabase-MCP als Fassung 3 der
   Funktion „sfu" hochgeladen worden (Projekt rolcktiryrvjzbwuvobb,
   verify_jwt aus wie bei „klassenzimmer" — die Anmeldung prueft die
   Funktion selbst). Wer hier etwas aendert, laedt danach neu hoch:
   supabase functions deploy sfu --no-verify-jwt
   Die Tabellen und die Buchungsfunktion: supabase/sfu-verbrauch.sql. */
import { createClient } from "jsr:@supabase/supabase-js@2";

const CF_BASIS = "https://rtc.live.cloudflare.com/v1/apps/";
const CF_WARTEN_MS = 7000;

/* =========================================================
   DIE BREMSE — ES DARF NIE ETWAS KOSTEN
   ---------------------------------------------------------
   Zugesagt: „bei geschaetzt 1000 GB im Monat schaltet die SFU ab und
   alle reden wieder direkt (Mesh) — so kostet es ihn nie etwas."

   Cloudflare rechnet nach Daten, die VOM Server ZUM Geraet gehen
   (Doku „Pricing", 22.09.2026: „Traffic published into Cloudflare is
   free"). Beim Ton heisst das: jede Stimme, die jemand HOERT, kostet
   — die eigene Stimme hinzuschicken kostet nichts.

   Diese Funktion sieht den echten Verbrauch nicht. Also wird im
   SCHLIMMSTEN Fall gerechnet:
     - Eine Opus-Stimme braucht mit allen Kopfdaten rund 50 kbit/s.
       Gebucht werden 64 kbit/s je gehoerter Spur — aufgerundet.
     - Gezaehlt wird die Zeit zwischen zwei Pulsen des Geraets
       (alle 60 s). Schweigt ein Geraet laenger als drei Minuten, wird
       seine Sitzung hier zwangsweise geschlossen (aufraeumen).
     - Gerechnet wird ueber die letzten 31 TAGE, nicht ueber den
       Kalendermonat. So liegt jeder Abrechnungsmonat, egal an welchem
       Tag er beginnt, ganz in einem gezaehlten Fenster.
     - TURN (das Relais, Funktion „klassenzimmer") und SFU teilen sich
       die 1000 GB. Das Relais hat seine eigene Bremse (turn_budget_gb,
       voreingestellt 25 GB). Dieser Teil wird hier von den 1000 GB
       ABGEZOGEN — beide zusammen koennen so nie ueber 1000 GB kommen.

   Ist die Grenze erreicht, schliesst diese Funktion ALLE offenen
   Hoer-Spuren bei Cloudflare zwangsweise (force) und antwortet jedem
   mit {aus:true, grund:"budget"}. Dann reden alle wieder direkt.
   ========================================================= */
const TON_KBIT = 64;
const HARTE_GRENZE_GB = 1000;
const TURN_BUDGET_STANDARD_GB = 25;
const STILL_SEKUNDEN = 180;
/* Mehr als 16 gehoerte Stimmen je Geraet gibt das Klassenzimmer nicht
   her (acht Plaetze plus Zuhoerer) — eine Grenze gegen eine Schleife. */
const HOECHSTENS_EMPFANG = 16;
/* Sitzungen je Stunde und Person: auch das nur gegen eine Schleife. */
const SITZUNGEN_JE_STUNDE = 60;

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
/* Ein „aus" ist kein Fehler der Seite, sondern eine Ansage: zurueck
   aufs Netz. Deshalb Status 200 — die Seite liest es in jedem Fall. */
function aus(grund: string, mehr: Record<string, unknown> = {}) {
  return json({ aus: true, grund, ...mehr });
}

function dienst() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}
type Dienst = ReturnType<typeof dienst>;

/* Die beiden Geheimnisse. Sie werden hier gelesen und NUR im
   Authorization-Kopf an Cloudflare benutzt. */
function geheim() {
  return {
    app: (Deno.env.get("CF_SFU_APP_ID") || "").trim(),
    token: (Deno.env.get("CF_SFU_APP_TOKEN") || "").trim(),
  };
}

/* „art" ist nur der NAME eines Fehlers (z. B. „TimeoutError"), nie seine
   Meldung — in der koennte die Adresse mit der App-ID stehen. */
type CfAntwort = { status: number; daten: Record<string, unknown>; art?: string };
async function cf(methode: string, pfad: string, koerper?: unknown): Promise<CfAntwort> {
  const { app, token } = geheim();
  /* Eigene Uhr statt AbortSignal.timeout — genau wie in „klassenzimmer",
     das auf dieser Laufzeit nachweislich laeuft. */
  const abbruch = new AbortController();
  const uhr = setTimeout(() => abbruch.abort(), CF_WARTEN_MS);
  try {
    const kopf: Record<string, string> = { "Authorization": "Bearer " + token };
    if (koerper !== undefined) kopf["Content-Type"] = "application/json";
    const antwort = await fetch(CF_BASIS + encodeURIComponent(app) + pfad, {
      method: methode,
      headers: kopf,
      body: koerper === undefined ? undefined : JSON.stringify(koerper),
      signal: abbruch.signal,
    });
    let daten: Record<string, unknown> = {};
    try { daten = await antwort.json(); } catch { daten = {}; }
    return { status: antwort.status, daten };
  } catch (e) {
    return { status: 0, daten: {}, art: e instanceof Error ? e.name : "unbekannt" };
  } finally {
    clearTimeout(uhr);
  }
}
/* Aus einer Cloudflare-Absage wird ein „aus" — ohne je etwas
   Geheimes zu wiederholen. */
function cfAus(a: CfAntwort) {
  if (a.status === 0) return aus("cloudflare-nicht-erreichbar");
  if (a.status === 401 || a.status === 403) return aus("schluessel-falsch");
  return aus("cloudflare", {
    status: a.status,
    errorCode: typeof a.daten.errorCode === "string" ? a.daten.errorCode : undefined,
  });
}

/* Wie viel darf der Tonserver in 31 Tagen? */
async function grenzeGb(sb: Dienst) {
  const { data } = await sb.from("betreiber_geheimnisse")
    .select("schluessel, wert").in("schluessel", ["sfu_budget_gb", "turn_budget_gb"]);
  const m: Record<string, string> = {};
  (data || []).forEach((z: { schluessel: string; wert: string }) => { m[z.schluessel] = z.wert; });
  const eigen = Number(m["sfu_budget_gb"]);
  const turn = Number(m["turn_budget_gb"]);
  const sfu = Number.isFinite(eigen) && eigen > 0 ? Math.min(eigen, HARTE_GRENZE_GB) : HARTE_GRENZE_GB;
  const relais = Number.isFinite(turn) && turn > 0 ? turn : TURN_BUDGET_STANDARD_GB;
  return Math.max(0, Math.min(sfu, HARTE_GRENZE_GB - relais));
}

function tagVor(tage: number) {
  const d = new Date(Date.now() - tage * 86400000);
  return d.toISOString().slice(0, 10);
}
async function verbrauchGb(sb: Dienst) {
  const { data } = await sb.from("sfu_verbrauch").select("geschaetzt_gb").gt("tag", tagVor(31));
  return (data || []).reduce((s: number, z: { geschaetzt_gb: number | string }) => s + Number(z.geschaetzt_gb || 0), 0);
}

/* Darf diese Person schon? Betreiber, Beta-Tester, „beta:sfu" oder
   „sfu" fuer alle — dieselben Schalter wie im Rest der Seite. */
async function darf(sb: Dienst, nutzerId: string) {
  const { data: profil } = await sb.from("profiles")
    .select("is_owner, is_beta_tester").eq("id", nutzerId).maybeSingle();
  if (profil?.is_owner || profil?.is_beta_tester) return true;
  const { data: flaggen } = await sb.from("site_content")
    .select("value").eq("key", "feature_flags").maybeSingle();
  const v = (flaggen?.value || {}) as Record<string, unknown>;
  if (v["sfu"] === true) return true;
  const liste = v["beta:sfu"];
  return Array.isArray(liste) && liste.includes(nutzerId);
}

type Zeile = { sitzung: string; user_id: string; empfang: string[]; geschlossen: boolean };

/* Eine Sitzung bei Cloudflare zwangsweise stumm machen: alle Spuren,
   die sie HOERT, werden ohne Aushandlung geschlossen (force). Vorher
   wird die Zeit bis jetzt noch gebucht. */
async function zwangsSchliessen(sb: Dienst, z: Zeile) {
  try { await sb.rpc("sfu_puls_buchen", { p_sitzung: z.sitzung, p_kbit: TON_KBIT }); } catch { /* weiter */ }
  const mids = Array.isArray(z.empfang) ? z.empfang : [];
  if (mids.length) {
    await cf("PUT", "/sessions/" + encodeURIComponent(z.sitzung) + "/tracks/close", {
      tracks: mids.map((mid) => ({ mid: String(mid) })),
      force: true,
    });
  }
  await sb.from("sfu_sitzungen").update({ geschlossen: true, empfang: [] }).eq("sitzung", z.sitzung);
}

/* Wer drei Minuten keinen Puls geschickt hat, wird geschlossen — so
   kann keine vergessene Sitzung heimlich weiterlaufen. */
async function aufraeumen(sb: Dienst) {
  try {
    const grenze = new Date(Date.now() - STILL_SEKUNDEN * 1000).toISOString();
    const { data } = await sb.from("sfu_sitzungen")
      .select("sitzung, user_id, empfang, geschlossen")
      .eq("geschlossen", false).lt("letzter_puls", grenze).limit(10);
    for (const z of (data || []) as Zeile[]) await zwangsSchliessen(sb, z);
  } catch { /* Aufraeumen darf nie eine Anfrage scheitern lassen */ }
}

/* Budget erschoepft: ALLE offenen Sitzungen stumm machen. */
async function allesSchliessen(sb: Dienst) {
  try {
    const { data } = await sb.from("sfu_sitzungen")
      .select("sitzung, user_id, empfang, geschlossen").eq("geschlossen", false).limit(200);
    for (const z of (data || []) as Zeile[]) await zwangsSchliessen(sb, z);
  } catch { /* weiter */ }
}

async function eigeneSitzung(sb: Dienst, sitzung: string, nutzerId: string): Promise<Zeile | null> {
  if (!/^[A-Za-z0-9_-]{6,128}$/.test(sitzung)) return null;
  const { data } = await sb.from("sfu_sitzungen")
    .select("sitzung, user_id, empfang, geschlossen").eq("sitzung", sitzung).maybeSingle();
  if (!data || data.user_id !== nutzerId || data.geschlossen) return null;
  return data as Zeile;
}

function sdpGut(b: unknown, art: string) {
  const s = b as { type?: unknown; sdp?: unknown } | null;
  return Boolean(s && s.type === art && typeof s.sdp === "string" && s.sdp.length > 10 && s.sdp.length < 60000);
}
const NAME = /^[A-Za-z0-9_-]{1,64}$/;

Deno.serve(async (anfrage: Request) => {
  if (anfrage.method === "OPTIONS") return new Response("ok", { headers: KOPF });
  if (anfrage.method !== "POST") return json({ fehler: "nur-post" }, 405);

  const kopfzeile = anfrage.headers.get("Authorization") || "";
  const marke = kopfzeile.replace(/^Bearer\s+/i, "");
  if (!marke) return json({ fehler: "nicht-angemeldet", aus: true, grund: "nicht-angemeldet" }, 401);

  const sb = dienst();
  const { data: nutzerDaten, error: nutzerFehler } = await sb.auth.getUser(marke);
  const nutzer = nutzerDaten?.user;
  if (nutzerFehler || !nutzer) return json({ fehler: "nicht-angemeldet", aus: true, grund: "nicht-angemeldet" }, 401);

  let koerper: Record<string, unknown> = {};
  try { koerper = await anfrage.json(); } catch { return json({ fehler: "kein-json", aus: true, grund: "kein-json" }, 400); }
  const aktion = String(koerper.aktion || "");
  const { app, token } = geheim();

  /* =======================================================
     A) PRUEFEN — nur ja/nein, NIE ein Wert
     ======================================================= */
  if (aktion === "pruefen") {
    const grenze = await grenzeGb(sb);
    const verbraucht = await verbrauchGb(sb);
    /* Anklopfen, ob der Token stimmt: eine leere Sitzung anlegen
       (sessions/new). Sie wird nie verbunden, verfaellt von selbst und
       kostet nichts — bezahlt wird nur, was zum Geraet fliesst.
       401/403 heisst „Token falsch".
       (Erster Versuch war GET auf eine Sitzung, die es nicht gibt — die
       Anfrage kam in 7 s nicht zurueck. Deshalb dieser Weg.)
       Nur fuer Freigeschaltete, damit niemand damit Sitzungen stapelt. */
    const frei = await darf(sb, nutzer.id);
    let tokenStimmt = "nicht-geprueft";
    let probeStatus = 0, probeArt = "";
    if (app && token && frei) {
      const probe = await cf("POST", "/sessions/new");
      tokenStimmt = probe.status === 0 ? "nicht-erreichbar"
        : (probe.status === 401 || probe.status === 403) ? "nein" : "ja";
      probeStatus = probe.status;
      probeArt = probe.art || "";
    }
    return json({
      appIdGesetzt: Boolean(app),
      tokenGesetzt: Boolean(token),
      tokenStimmt,
      /* nur die Zahl und der Fehlername der Probe — zum Nachsehen */
      probeStatus,
      probeArt,
      freigeschaltet: frei,
      budgetFrei: verbraucht < grenze,
      verbrauchtGb: Math.round(verbraucht * 1000) / 1000,
      grenzeGb: grenze,
      tonKbit: TON_KBIT,
    });
  }

  if (!["sitzung", "spuren", "neu_verhandeln", "schliessen", "puls"].includes(aktion)) {
    return json({ fehler: "unbekannte-aktion", aus: true, grund: "unbekannte-aktion" }, 400);
  }
  if (!app || !token) return aus("nicht-eingerichtet");
  if (!(await darf(sb, nutzer.id))) return aus("nicht-freigeschaltet");

  /* DIE BREMSE steht vor allem anderen. */
  const grenze = await grenzeGb(sb);
  if ((await verbrauchGb(sb)) >= grenze) {
    await allesSchliessen(sb);
    return aus("budget", { grenzeGb: grenze });
  }

  /* =======================================================
     B) SITZUNG — neu anlegen, eigene Tonspur veroeffentlichen
     ======================================================= */
  if (aktion === "sitzung") {
    await aufraeumen(sb);
    const vorEinerStunde = new Date(Date.now() - 3600000).toISOString();
    const { count } = await sb.from("sfu_sitzungen").select("sitzung", { count: "exact", head: true })
      .eq("user_id", nutzer.id).gt("erstellt", vorEinerStunde);
    if ((count || 0) >= SITZUNGEN_JE_STUNDE) return aus("zu-viele-sitzungen");

    const neu = await cf("POST", "/sessions/new");
    const sitzung = typeof neu.daten.sessionId === "string" ? neu.daten.sessionId : "";
    if (neu.status < 200 || neu.status >= 300 || !sitzung) return cfAus(neu);
    await sb.from("sfu_sitzungen").insert({ sitzung, user_id: nutzer.id });

    if (!koerper.angebot) return json({ ok: true, sitzung });
    if (!sdpGut(koerper.angebot, "offer")) return aus("angebot-unbrauchbar");
    const spuren = (Array.isArray(koerper.spuren) ? koerper.spuren : []).slice(0, 4)
      .map((s) => s as { mid?: unknown; trackName?: unknown })
      .filter((s) => s && s.mid != null && NAME.test(String(s.trackName || "")))
      .map((s) => ({ location: "local", mid: String(s.mid), trackName: String(s.trackName) }));
    if (!spuren.length) return aus("keine-spuren");
    const pub = await cf("POST", "/sessions/" + encodeURIComponent(sitzung) + "/tracks/new", {
      sessionDescription: koerper.angebot, tracks: spuren,
    });
    if (pub.status < 200 || pub.status >= 300 || !pub.daten.sessionDescription) return cfAus(pub);
    return json({
      ok: true, sitzung,
      antwort: pub.daten.sessionDescription,
      spuren: pub.daten.tracks || [],
    });
  }

  /* Alle weiteren Aktionen gehen nur auf eine EIGENE, offene Sitzung. */
  const zeile = await eigeneSitzung(sb, String(koerper.sitzung || ""), nutzer.id);
  if (!zeile) return aus("sitzung-unbekannt");
  const pfad = "/sessions/" + encodeURIComponent(zeile.sitzung);

  /* =======================================================
     C) PULS — Verbrauch buchen, Bremse pruefen
     ======================================================= */
  if (aktion === "puls") {
    const { data: summe } = await sb.rpc("sfu_puls_buchen", { p_sitzung: zeile.sitzung, p_kbit: TON_KBIT });
    await aufraeumen(sb);
    const gb = Number(summe || 0);
    if (gb >= grenze) {
      await allesSchliessen(sb);
      return aus("budget", { grenzeGb: grenze });
    }
    return json({ ok: true, verbrauchtGb: Math.round(gb * 1000) / 1000, grenzeGb: grenze });
  }

  /* =======================================================
     D) SPUREN — andere hoeren (remote) oder weitere eigene senden
     ======================================================= */
  if (aktion === "spuren") {
    if (koerper.angebot) {
      if (!sdpGut(koerper.angebot, "offer")) return aus("angebot-unbrauchbar");
      const lokal = (Array.isArray(koerper.spuren) ? koerper.spuren : []).slice(0, 4)
        .map((s) => s as { mid?: unknown; trackName?: unknown })
        .filter((s) => s && s.mid != null && NAME.test(String(s.trackName || "")))
        .map((s) => ({ location: "local", mid: String(s.mid), trackName: String(s.trackName) }));
      const a = await cf("POST", pfad + "/tracks/new", { sessionDescription: koerper.angebot, tracks: lokal });
      if (a.status < 200 || a.status >= 300) return cfAus(a);
      return json({ ok: true, ...a.daten });
    }
    const vorhanden = Array.isArray(zeile.empfang) ? zeile.empfang : [];
    const fern = (Array.isArray(koerper.spuren) ? koerper.spuren : [])
      .map((s) => s as { sessionId?: unknown; trackName?: unknown })
      .filter((s) => s && /^[A-Za-z0-9_-]{6,128}$/.test(String(s.sessionId || ""))
        && NAME.test(String(s.trackName || "")))
      .slice(0, Math.max(0, HOECHSTENS_EMPFANG - vorhanden.length))
      .map((s) => ({ location: "remote", sessionId: String(s.sessionId), trackName: String(s.trackName) }));
    if (!fern.length) return aus("zu-viele-spuren");
    /* Erst die Zeit bis jetzt mit der ALTEN Zahl buchen, dann die neuen
       Spuren eintragen — sonst wird zu wenig gezaehlt. */
    await sb.rpc("sfu_puls_buchen", { p_sitzung: zeile.sitzung, p_kbit: TON_KBIT });
    const a = await cf("POST", pfad + "/tracks/new", { tracks: fern });
    if (a.status < 200 || a.status >= 300) return cfAus(a);
    const neueMids = (Array.isArray(a.daten.tracks) ? a.daten.tracks : [])
      .map((t) => t as { mid?: unknown; errorCode?: unknown })
      .filter((t) => t && t.mid != null && !t.errorCode).map((t) => String(t.mid));
    if (neueMids.length) {
      await sb.from("sfu_sitzungen")
        .update({ empfang: Array.from(new Set(vorhanden.concat(neueMids))) })
        .eq("sitzung", zeile.sitzung);
    }
    return json({ ok: true, ...a.daten });
  }

  /* =======================================================
     E) NEU VERHANDELN — die Antwort des Browsers abgeben
     ======================================================= */
  if (aktion === "neu_verhandeln") {
    if (!sdpGut(koerper.antwort, "answer")) return aus("antwort-unbrauchbar");
    const a = await cf("PUT", pfad + "/renegotiate", { sessionDescription: koerper.antwort });
    if (a.status < 200 || a.status >= 300) return cfAus(a);
    return json({ ok: true, ...a.daten });
  }

  /* =======================================================
     F) SCHLIESSEN — Spuren zu (mit Angebot: ausgehandelt; ohne: force)
        „alles": die ganze Sitzung ist fertig (Raum verlassen).
     ======================================================= */
  const vorhanden = Array.isArray(zeile.empfang) ? zeile.empfang : [];
  await sb.rpc("sfu_puls_buchen", { p_sitzung: zeile.sitzung, p_kbit: TON_KBIT });
  const wunsch = koerper.alles === true ? vorhanden
    : (Array.isArray(koerper.mids) ? koerper.mids : []).map(String).slice(0, 64);
  let daten: Record<string, unknown> = { tracks: [] };
  if (wunsch.length) {
    const mitAngebot = sdpGut(koerper.angebot, "offer");
    const a = await cf("PUT", pfad + "/tracks/close", mitAngebot
      ? { tracks: wunsch.map((mid) => ({ mid })), sessionDescription: koerper.angebot, force: false }
      : { tracks: wunsch.map((mid) => ({ mid })), force: true });
    if (a.status < 200 || a.status >= 300) {
      if (koerper.alles === true) await sb.from("sfu_sitzungen").update({ geschlossen: true }).eq("sitzung", zeile.sitzung);
      return cfAus(a);
    }
    daten = a.daten;
  }
  /* Was zu ist (oder laut Cloudflare schon zu war), zaehlt nicht mehr. */
  const zu = new Set((Array.isArray(daten.tracks) ? daten.tracks : [])
    .map((t) => t as { mid?: unknown; errorCode?: unknown })
    .filter((t) => t && t.mid != null && (!t.errorCode || t.errorCode === "close_track_error"))
    .map((t) => String(t.mid)));
  const rest = koerper.alles === true ? [] : vorhanden.filter((m) => !zu.has(String(m)));
  await sb.from("sfu_sitzungen").update({ empfang: rest, geschlossen: koerper.alles === true })
    .eq("sitzung", zeile.sitzung);
  return json({ ok: true, ...daten });
});
