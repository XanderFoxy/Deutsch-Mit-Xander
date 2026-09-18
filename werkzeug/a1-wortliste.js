#!/usr/bin/env node
/* ZIEHT DIE WOERTER EINES NIVEAUS FUER DIE AUFNAHME HERAUS.
   ---------------------------------------------------------------
   Gesprochen wird genau das, was der Aussprache-Trainer abspielt:
   das Wort OHNE Artikel (aussprSprechtext in app.js macht dasselbe).
   „die Tasse" wird also zu „Tasse" — man uebt das Wort, nicht den
   Artikel.

   Draussen bleiben:
     * Eintraege ohne Silbentrennung oder ohne Bedeutung — die sind im
       Trainer ohnehin gesperrt (wortZumUeben)
     * maschinell erzeugte Formen („Mehrzahl von …", „Praeteritum …")
     * blosse Artikel
     * Doppelungen: dasselbe gesprochene Wort nur einmal aufnehmen

   Der Dateiname ist der kleingeschriebene Wortstamm: „Tasse" wird zu
   tasse.mp3. Nachgezaehlt: von 2277 Woertern fallen 38 Paare auf
   denselben Namen — und zwar ausnahmslos HOMOPHONE:
     Fluss/Flu\u00df, besser/be\u00dfer, drau\u00dfen/draussen  (alte/neue Schreibung)
     ei/Ei, boxen/Boxen, fernsehen/Fernsehen  (Verb und Nomen)
   Die klingen gleich, also teilen sie sich EINE Aufnahme. Das ist
   kein Zusammenstoss, den man wegrechnen muesste, sondern eine
   Ersparnis: 2239 Aufnahmen statt 2277.
   Und weil der Name allein aus dem Wort folgt, kann die Website ihn
   selbst ausrechnen und braucht keine Zuordnungstabelle.

   Aufruf:  node werkzeug/a1-wortliste.js  > /tmp/a1.json
*/
const fs = require("fs");
const path = require("path");

const WURZEL = path.dirname(__dirname);
const NIVEAU = (process.argv[2] || "A1").toUpperCase();
global.window = {};
for (const f of fs.readdirSync(path.join(WURZEL, "vokabeln"))) {
  if (!f.endsWith(".js")) continue;
  try { eval(fs.readFileSync(path.join(WURZEL, "vokabeln", f), "utf8")); }
  catch (e) { console.error("Datei nicht lesbar:", f, e.message); }
}

const ERZEUGER = new RegExp(
  "^zusammengesetzt aus |mit der Vorsilbe .+ gebildet|^Mehrzahl (von|im) "
  + "|^(Präteritum|Partizip|Konjunktiv|Imperativ|Genitiv|Dativ|Akkusativ"
  + "|Infinitiv mit|Steigerung|großgeschriebenes|[123]\\. Person)\\b");
const NUR_ARTIKEL = new Set(["der", "die", "das", "den", "dem", "des",
  "ein", "eine", "einen", "einem", "einer", "eines"]);

function sprechtext(wort) {
  const roh = String(wort || "").trim();
  return roh.replace(/^(der|die|das)\s+/i, "").trim() || roh;
}
function stamm(t) {
  return t.toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 34) || "wort";
}
function dateiname(t) { return stamm(t) + ".mp3"; }

const alle = [];
const sammeln = (o) => {
  for (const k of Object.keys(o || {})) {
    const v = o[k];
    if (Array.isArray(v) && v.length && v[0] && v[0].word) alle.push(...v);
  }
};
sammeln(global.window.DMA_VOKABELN);
sammeln(global.window.DMA_VOKABELN_ZUSATZ);

const gesehen = new Map();
let weg = { stufe: 0, ohneSilben: 0, ohneBedeutung: 0, erzeugt: 0, artikel: 0, doppelt: 0 };
for (const e of alle) {
  /* GEWUENSCHT: „Wenn du mit A1 komplett fertig bist, kannst du schon
     B1 weitermachen. So weit wie du kommst — je mehr Wortschatz, desto
     besser." Deshalb ist das Niveau jetzt ein Aufrufwert:
         node werkzeug/a1-wortliste.js A2  > /tmp/a2.json
     Ohne Angabe bleibt es bei A1. */
  if (e.level !== NIVEAU) { weg.stufe++; continue; }
  if (!e.syl) { weg.ohneSilben++; continue; }
  const bedeutung = e.de || e.meaning || "";
  if (!bedeutung) { weg.ohneBedeutung++; continue; }
  if (ERZEUGER.test(String(bedeutung))) { weg.erzeugt++; continue; }
  const t = sprechtext(e.word);
  if (!t || NUR_ARTIKEL.has(t.toLowerCase())) { weg.artikel++; continue; }
  /* Nach dem DATEINAMEN zusammenfassen, nicht nach der Schreibung —
     sonst nimmt man „Fluss" und „Flu\u00df" zweimal auf. */
  const d = dateiname(t);
  if (gesehen.has(d)) { gesehen.get(d).auch.push(t); weg.doppelt++; continue; }
  gesehen.set(d, { text: t, wort: e.word, datei: d, auch: [] });
}

const liste = [...gesehen.values()].sort((a, b) => a.text.localeCompare(b.text, "de"));
const zeichen = liste.reduce((s, w) => s + w.text.length, 0);
console.error("A1-Aufnahmen: " + liste.length
  + "  (" + zeichen + " Zeichen, im Schnitt "
  + (zeichen / liste.length).toFixed(1) + " je Wort)");
console.error("aussortiert: " + JSON.stringify(weg)
  + "  („doppelt“ sind gleich klingende Schreibweisen, die sich eine Aufnahme teilen)");
process.stdout.write(JSON.stringify(liste, null, 1));
