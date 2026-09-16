/* =========================================================
   AUSSPRACHE — die Edge-Function
   ---------------------------------------------------------
   DER AUFTRAG
   „Ich möchte, dass der Aussprache-Trainer für jeden, der auf
    der Seite angemeldet ist, benutzbar ist. Der Schlüssel wird
    einmal eingetragen und jeder kann ihn benutzen. Ich kann von
    den Leuten nicht verlangen, dass sie dieses technische
    Know-how haben."

   WARUM DAS NICHT OHNE DIESE DATEI GEHT
   Ein Azure-Schlüssel, den die Webseite kennt, ist ein
   öffentlicher Schlüssel — die Webseite läuft im Browser jedes
   Besuchers. Man kann ihn dort weder verstecken noch verschlüsseln:
   was der Browser entschlüsseln kann, kann auch der Besucher
   entschlüsseln. Wer ihn findet, kann ihn abrechnen lassen.

   Darum kennt die Webseite den Schlüssel gar nicht mehr. Sie
   schickt die Aufnahme hierher, und DIESE Datei — die auf dem
   Server läuft, wo niemand hineinsehen kann — spricht mit Azure.

   WAS HIER GEPRÜFT WIRD, BEVOR ETWAS PASSIERT
     1. Ist der Anfragende angemeldet? (verify_jwt, und dann noch
        einmal hier, weil man sich auf eine Prüfung allein nicht
        verlassen sollte.)
     2. Hat er heute schon zu viel verbraucht? Azure F0 ist
        kostenlos, aber gedeckelt — ein Einzelner darf die
        Monatsmenge nicht für alle aufbrauchen.
     3. Beim Ändern des Schlüssels: ist er wirklich der Betreiber?
        Das wird an der Datenbank geprüft (profiles.is_owner),
        nicht an etwas, das der Browser mitschickt. Was der
        Browser sagt, kann der Browser auch lügen.

   WAS HIER NICHT PASSIERT
   Es wird nichts gespeichert. Keine Aufnahme, kein Text, kein
   Ergebnis. Die Aufnahme geht durch und ist danach weg.
   ========================================================= */
import { createClient } from "jsr:@supabase/supabase-js@2";

/* Wie viele Azure-Anfragen darf eine Person am Tag?
   Eine Runde im Trainer sind 10 Wörter, und jedes Wort darf man
   mehrmals versuchen. 300 ist also grosszügig für einen Menschen
   und eng für ein Schadprogramm. */
const TAGESGRENZE = 300;

/* Die Stimmen. Gewählt nach EINEM Kriterium: deutliche
   Aussprache. In einem Aussprache-Trainer ist die klarste Stimme
   die richtige, nicht die ausdrucksstärkste — man soll die Laute
   hören, nicht die Stimmung. */
const STIMMEN: Record<string, string> = {
  "de-DE": "de-DE-KatjaNeural",
  "it-IT": "it-IT-ElsaNeural",
};

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

/* Den hinterlegten Schlüssel holen. Er verlässt diese Funktion
   nie — auch nicht in einer Fehlermeldung. */
async function geheimnisse() {
  const { data } = await dienst()
    .from("betreiber_geheimnisse")
    .select("schluessel, wert")
    .in("schluessel", ["azure_schluessel", "azure_region"]);
  const m: Record<string, string> = {};
  (data || []).forEach((z: { schluessel: string; wert: string }) => { m[z.schluessel] = z.wert; });
  return { schluessel: m["azure_schluessel"] || "", region: m["azure_region"] || "" };
}

Deno.serve(async (anfrage: Request) => {
  if (anfrage.method === "OPTIONS") return new Response("ok", { headers: KOPF });
  if (anfrage.method !== "POST") return json({ fehler: "nur-post" }, 405);

  /* --- Wer fragt? --- */
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
     A) STAND — was kann die Seite gerade anbieten?
     Gibt NIE den Schlüssel zurück, nur ob einer da ist.
     ======================================================= */
  if (aktion === "stand") {
    const { schluessel, region } = await geheimnisse();
    const { data: profil } = await sb.from("profiles").select("is_owner").eq("id", nutzer.id).maybeSingle();
    const { data: heute } = await sb.from("azure_nutzung")
      .select("anfragen").eq("user_id", nutzer.id).eq("tag", new Date().toISOString().slice(0, 10)).maybeSingle();
    return json({
      zentralDa: Boolean(schluessel && region),
      region: region,                       // die Region ist kein Geheimnis
      betreiber: Boolean(profil?.is_owner),
      heuteVerbraucht: heute?.anfragen || 0,
      tagesgrenze: TAGESGRENZE,
    });
  }

  /* =======================================================
     B) SCHLÜSSEL EINTRAGEN ODER LÖSCHEN — nur der Betreiber
     ======================================================= */
  if (aktion === "schluessel-setzen" || aktion === "schluessel-loeschen") {
    const { data: profil } = await sb.from("profiles").select("is_owner").eq("id", nutzer.id).maybeSingle();
    if (!profil?.is_owner) return json({ fehler: "nicht-erlaubt" }, 403);

    if (aktion === "schluessel-loeschen") {
      await sb.from("betreiber_geheimnisse").delete().in("schluessel", ["azure_schluessel", "azure_region"]);
      return json({ ok: true, zentralDa: false });
    }

    const neu = String(koerper.schluessel || "").trim();
    const region = String(koerper.region || "").trim().toLowerCase();
    if (!neu || !region) return json({ fehler: "unvollstaendig" }, 400);

    /* Vor dem Speichern einmal bei Azure anklopfen. Ein falscher
       Schlüssel, der still gespeichert wird, fällt sonst erst dem
       nächsten Lernenden auf — und der hält es für seinen Fehler. */
    const probe = await fetch(
      `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      { method: "POST", headers: { "Ocp-Apim-Subscription-Key": neu, "Content-Length": "0" } },
    ).catch(() => null);
    if (!probe) return json({ fehler: "region-unbekannt" }, 400);
    if (probe.status === 401 || probe.status === 403) return json({ fehler: "schluessel-falsch" }, 400);
    if (!probe.ok) return json({ fehler: "azure-antwortet-nicht", status: probe.status }, 400);

    await sb.from("betreiber_geheimnisse").upsert([
      { schluessel: "azure_schluessel", wert: neu, geaendert_am: new Date().toISOString(), geaendert_von: nutzer.id },
      { schluessel: "azure_region", wert: region, geaendert_am: new Date().toISOString(), geaendert_von: nutzer.id },
    ], { onConflict: "schluessel" });
    return json({ ok: true, zentralDa: true, region });
  }

  /* =======================================================
     C) BEWERTEN UND VORLESEN — für alle Angemeldeten
     ======================================================= */
  if (aktion !== "bewerten" && aktion !== "vorlesen") return json({ fehler: "unbekannte-aktion" }, 400);

  const { schluessel, region } = await geheimnisse();
  if (!schluessel || !region) return json({ fehler: "kein-zentraler-schluessel" }, 503);

  const { data: stand } = await sb.rpc("azure_zaehlen", { p_user: nutzer.id });
  if (typeof stand === "number" && stand > TAGESGRENZE) {
    return json({ fehler: "tagesgrenze", grenze: TAGESGRENZE }, 429);
  }

  const sprache = String(koerper.sprache || "de-DE");

  /* --- Vorlesen: Azures Neuronale Stimme --- */
  if (aktion === "vorlesen") {
    const text = String(koerper.text || "").slice(0, 300);
    if (!text) return json({ fehler: "kein-text" }, 400);
    const stimme = STIMMEN[sprache] || STIMMEN["de-DE"];
    /* Der Text wird in SSML gepackt. Dabei MUSS er maskiert
       werden — ein „&" oder „<" im Wort würde das SSML sonst
       zerbrechen, und Azure antwortet mit einem Fehler, den
       niemand versteht. */
    const sicher = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const ssml =
      `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${sprache}">` +
      `<voice name="${stimme}"><prosody rate="${koerper.langsam ? "-25%" : "0%"}">${sicher}</prosody></voice></speak>`;

    const antwort = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": schluessel,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "deutsch-mit-alex",
      },
      body: ssml,
    });
    if (antwort.status === 429) return json({ fehler: "kontingent" }, 429);
    if (!antwort.ok) return json({ fehler: "dienst", status: antwort.status }, 502);
    return new Response(await antwort.arrayBuffer(), {
      headers: { ...KOPF, "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=604800" },
    });
  }

  /* --- Bewerten: die Aussprachebewertung Laut für Laut --- */
  const text = String(koerper.text || "").slice(0, 300);
  const wavBase64 = String(koerper.wav || "");
  if (!text || !wavBase64) return json({ fehler: "unvollstaendig" }, 400);

  let wav: Uint8Array;
  try {
    const roh = atob(wavBase64);
    wav = new Uint8Array(roh.length);
    for (let i = 0; i < roh.length; i++) wav[i] = roh.charCodeAt(i);
  } catch { return json({ fehler: "aufnahme-unlesbar" }, 400); }
  if (wav.length < 1000) return json({ fehler: "aufnahme-zu-kurz" }, 400);
  if (wav.length > 2_000_000) return json({ fehler: "aufnahme-zu-lang" }, 413);

  const bewertung = {
    referenceText: text,
    gradingSystem: "HundredMark",
    granularity: "Phoneme",
    phonemeAlphabet: "IPA",
    nBestPhonemeCount: 3,
    dimension: "Comprehensive",
    enableMiscue: false,
  };
  const kopfWert = btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(bewertung))));

  const antwort = await fetch(
    `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1` +
    `?language=${encodeURIComponent(sprache)}&format=detailed`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": schluessel,
        "Pronunciation-Assessment": kopfWert,
        "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
        "Accept": "application/json",
      },
      body: wav,
    },
  ).catch(() => null);

  if (!antwort) return json({ fehler: "netz" }, 502);
  if (antwort.status === 429) return json({ fehler: "kontingent" }, 429);
  if (antwort.status === 401 || antwort.status === 403) return json({ fehler: "schluessel-falsch" }, 502);
  if (!antwort.ok) return json({ fehler: "dienst", status: antwort.status }, 502);

  /* Azures Antwort wird UNVERÄNDERT durchgereicht. Ausgewertet
     wird sie im Browser — dieselbe Auswertung, die auch für einen
     eigenen Schlüssel gilt. So gibt es nur EINE Stelle, an der
     die Antwort gelesen wird, und nicht zwei, die auseinander
     laufen können. */
  return json(await antwort.json());
});
