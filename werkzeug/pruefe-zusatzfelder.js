#!/usr/bin/env node
/* =====================================================================
   JEDES FELD, DAS EIN EFFEKT LIEST, MUSS AUCH ANKOMMEN
   ---------------------------------------------------------------------
   XANDER, drei Meldungen, drei Runden lang, und alle drei hatten
   DIESELBE Ursache:
     · „Ich kann mich immer noch nicht anziehen und ausziehen."
     · „Ausserdem geht deine Luftballon-Animation nicht einfach so."
     · „Ich kann den Ausschnitt waehlen … ich kann mir das Lied noch
        nicht anhoeren."

   DIE URSACHE: in livechat.js entscheidet EINE Liste — ZUSATZ_FELDER —,
   welche Zusatzfelder eine Chatzeile behaelt. anAlle() schickt zwar
   ALLES ueber die Leitung, aber zusatzUebernehmen() laesst nur durch,
   was in dieser Liste steht — auf dem eigenen Geraet genauso wie beim
   Empfaenger. Fuenf Felder fehlten:

     stueck   welches Kleidungsstueck / Spraybild / welche Ballonart
     liedBis  das Ende des Songausschnitts
     ziel     auf welchen Platz jemand gehoben wird
     tausch   ob zwei Plaetze tauschen
     ab       ab welcher Sekunde die Musik einsetzt

   GEMESSEN vor der Korrektur: „/anziehen Bea krone" erzeugte eine
   Zeile mit stueck: „" — die Krone war weg, bevor sie irgendwo
   ankommen konnte. „/ballonpumpe helium" ebenso: stueck: „", also
   immer die normale Variante.

   Diese Sonde braucht keinen Browser. Sie liest aus app.js jedes
   „nachricht.<feld>" heraus — das ist die Liste dessen, was die
   Effekte WIRKLICH lesen — und vergleicht sie mit ZUSATZ_FELDER aus
   livechat.js. Fehlt eines, faellt sie um. Damit kann derselbe Fehler
   nicht noch einmal still passieren.
   ===================================================================== */
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

const app = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");

/* Was die Effekte lesen. */
const gelesen = new Set();
(app.match(/nachricht\s*(?:&&\s*nachricht)?\.[a-zA-Z]+/g) || []).forEach((t) => {
  const m = /\.([a-zA-Z]+)$/.exec(t);
  if (m) gelesen.add(m[1]);
});

/* Felder, die NICHT aus dem Zusatz kommen, sondern die Zeile selbst
   mitbringt (eigeneZeile/Empfang setzen sie) — sie gehoeren nicht in
   ZUSATZ_FELDER und werden hier ausgenommen. */
const EIGEN = new Set(["eigen", "name", "id", "von", "text", "zeit", "art",
  "bild", "farbe", "farbeName", "chatArt"]);

const m = /var ZUSATZ_FELDER = \[([\s\S]*?)\];/.exec(lc);
if (!m) {
  sage(false, "ZUSATZ_FELDER in livechat.js gefunden");
  process.exit(1);
}
const liste = new Set((m[1].match(/"([a-zA-Z]+)"/g) || []).map((x) => x.replace(/"/g, "")));

console.log("WAS DIE EFFEKTE LESEN — UND WAS ANKOMMT\n");
console.log("  app.js liest " + gelesen.size + " Felder aus der Nachricht,");
console.log("  ZUSATZ_FELDER laesst " + liste.size + " durch.\n");

const fehlend = [...gelesen].filter((f) => !EIGEN.has(f) && !liste.has(f)).sort();
sage(fehlend.length === 0,
  "jedes Feld, das ein Effekt liest, steht auch in ZUSATZ_FELDER",
  fehlend.length ? "es fehlen: " + fehlend.join(", ") : "");

/* Und umgekehrt: ein Feld in der Liste, das niemand liest, ist kein
   Fehler — es kann von der Oberflaeche gelesen werden (n.betonung,
   n.raten …). Deshalb wird nur GEMELDET, nicht gestraft. */
const ungenutzt = [...liste].filter((f) => !gelesen.has(f)
  && !new RegExp("n\\." + f + "\\b").test(app)).sort();
if (ungenutzt.length) {
  console.log("  --   in der Liste, aber nirgends gelesen: " + ungenutzt.join(", "));
}

/* Die fuenf, die gefehlt haben, ausdruecklich beim Namen. */
console.log("\nDIE FUENF, DIE GEFEHLT HABEN\n");
[["stueck", "welches Kleidungsstück, Spraybild, welche Ballonart"],
 ["liedBis", "das Ende des Songausschnitts"],
 ["ziel", "auf welchen Platz jemand gehoben wird"],
 ["tausch", "ob zwei Plätze tauschen"],
 ["ab", "ab welcher Sekunde die Musik einsetzt"]].forEach(([f, was]) => {
  sage(liste.has(f), "„" + f + "“ fährt mit — " + was);
});

console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
process.exit(fehler ? 1 : 0);
