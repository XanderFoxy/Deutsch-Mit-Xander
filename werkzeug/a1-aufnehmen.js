#!/usr/bin/env node
/* NIMMT DIE A1-WOERTER MIT ALEX' STIMME AUF.
   ---------------------------------------------------------------
   Aufruf:
     ELEVENLABS_API_KEY=… node werkzeug/a1-aufnehmen.js [anzahl]

   Drei Dinge, die hier wichtiger sind als Geschwindigkeit:

   1. WIEDERAUFNEHMBAR. Wer eine Datei schon hat, bekommt sie nicht
      noch einmal — jede Aufnahme kostet Geld. Bricht der Lauf ab,
      macht der naechste dort weiter, wo er aufgehoert hat.
   2. JEDE DATEI WIRD GEPRUEFT, bevor sie gilt. Ein leerer oder
      abgeschnittener Download ist schlimmer als gar keiner: er sieht
      aus wie Erfolg und fehlt dann still im Trainer.
   3. NACHBEARBEITET wird sofort (ton-nachbearbeiten.js): Stille weg,
      entrauschen, Lautheit angleichen, kleiner machen.
   4. DIE ROHDATEI BLEIBT LIEGEN, ausserhalb des Repos (/tmp/roh-a1).
      Beim ersten Durchgang habe ich sie weggeworfen — und als
      auffiel, dass der Abschneider die Woerter ankratzt, musste
      alles noch einmal heruntergeladen werden. 68 MB Platz sind
      billiger als 2239 Aufnahmen zum zweiten Mal. Mit neu-schleifen.js
      laesst sich damit jede Feineinstellung kostenlos wiederholen.
*/
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const WURZEL = path.dirname(__dirname);
const ZIEL = path.join(WURZEL, "aussprache", "a1");
const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const STIMME = "2L5tbH2o3nYxHrdksjgA";           // „Alex", der Studio-Klon
const MODELL = "eleven_multilingual_v2";
const SCHLUESSEL = process.env.ELEVENLABS_API_KEY || "";
const HOECHSTENS = Number(process.argv[2] || 0) || Infinity;
const GLEICHZEITIG = 4;

if (!SCHLUESSEL) { console.error("ELEVENLABS_API_KEY fehlt."); process.exit(2); }
const ROH = "/tmp/roh-a1";
fs.mkdirSync(ZIEL, { recursive: true });
fs.mkdirSync(ROH, { recursive: true });

/* Die Liste kommt aus demselben Werkzeug, das auch die Dateinamen
   festlegt — zwei getrennte Regeln waeren zwei Fehlerquellen. */
const liste = JSON.parse(execFileSync("node",
  [path.join(WURZEL, "werkzeug", "a1-wortliste.js")],
  { maxBuffer: 64 * 1024 * 1024 }).toString("utf8"));

const offen = liste.filter((w) => !fs.existsSync(path.join(ZIEL, w.datei)));
console.log(liste.length + " Aufnahmen insgesamt, " + (liste.length - offen.length)
  + " schon da, " + Math.min(offen.length, HOECHSTENS) + " werden jetzt geholt.");

let fertig = 0, schiefgegangen = [];

async function holen(wort) {
  const antwort = await fetch(
    "https://api.elevenlabs.io/v1/text-to-speech/" + STIMME, {
      method: "POST",
      headers: { "xi-api-key": SCHLUESSEL, "Content-Type": "application/json" },
      body: JSON.stringify({ text: wort.text, model_id: MODELL }),
    });
  if (!antwort.ok) throw new Error("HTTP " + antwort.status + " " + (await antwort.text()).slice(0, 120));
  const bytes = Buffer.from(await antwort.arrayBuffer());
  /* Geprueft, nicht gehofft: unter 2 KB ist keine gesprochene Silbe,
     und wer nicht mit einem MP3-Kopf anfaengt, ist kein MP3. */
  if (bytes.length < 2000) throw new Error("nur " + bytes.length + " Byte");
  const kopf = bytes.slice(0, 3).toString("latin1");
  if (kopf !== "ID3" && !(bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0)) {
    throw new Error("kein MP3 (" + kopf + ")");
  }
  const roh = path.join(ROH, wort.datei);
  fs.writeFileSync(roh, bytes);
  execFileSync("node", [path.join(WURZEL, "werkzeug", "ton-nachbearbeiten.js"),
                        roh, path.join(ZIEL, wort.datei)], { stdio: ["ignore", "ignore", "pipe"] });
  const gross = fs.statSync(path.join(ZIEL, wort.datei)).size;
  if (gross < 400) { fs.unlinkSync(path.join(ZIEL, wort.datei)); throw new Error("nachher leer"); }
}

(async () => {
  const warteschlange = offen.slice(0, HOECHSTENS);
  const arbeiter = Array.from({ length: GLEICHZEITIG }, async () => {
    for (;;) {
      const w = warteschlange.shift();
      if (!w) return;
      let versuch = 0;
      for (;;) {
        try { await holen(w); fertig++; break; }
        catch (e) {
          versuch++;
          /* Zweimal nachfassen: ein einzelner Netzhaenger soll nicht
             ein Wort fuer immer fehlen lassen. */
          if (versuch >= 3) { schiefgegangen.push(w.text + ": " + e.message); break; }
          await new Promise((f) => setTimeout(f, 700 * versuch));
        }
      }
      if (fertig % 100 === 0 && fertig) console.log("   " + fertig + " aufgenommen …");
    }
  });
  await Promise.all(arbeiter);
  console.log("\n" + fertig + " neu aufgenommen, " + schiefgegangen.length + " schiefgegangen.");
  schiefgegangen.slice(0, 20).forEach((z) => console.log("   " + z));
})();
