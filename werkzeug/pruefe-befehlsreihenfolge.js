#!/usr/bin/env node
/* =====================================================================
   KEINE ABZWEIGUNG DARF HINTER IHRER TABELLE STEHEN
   ---------------------------------------------------------------------
   XANDER: „Ausserdem geht deine Luftballon-Animation nicht einfach so."
   Und: „Ich kann den Ausschnitt waehlen … ich kann mir das Lied noch
   nicht anhoeren."

   BEIDE MELDUNGEN HATTEN DIESELBE FORM VON FEHLER, und er ist von aussen
   unsichtbar: In befehlAusfuehren() gibt es grosse Tabellen (AM_PLATZ,
   AUCH_AM_PLATZ), die einen Befehl mit einem Standardsatz erledigen —
   und dahinter standen SPEZIALFAELLE fuer genau dieselben Woerter:

     /kopfhoerer Name Lied    (Lied und Ausschnitt)   470 Zeilen zu spaet
     /ballonpumpe Name helium (die zweite Variante)   380 Zeilen zu spaet

   Beide kamen nie dran, weil die Tabelle vorher zugreift. Im Quelltext
   stand sogar der Satz „Diese Abzweigung muss VOR AM_PLATZ stehen" —
   sie stand dahinter. Von aussen sieht man nur: der Befehl tut etwas,
   nur eben das Falsche („Alex setzt Kopfhoerer auf Bea 1").

   Diese Sonde liest livechat.js und vergleicht Zeilennummern:
   Steht eine Abzweigung „if (art === "x")" auf der obersten Ebene der
   Befehlsfunktion HINTER der Abfrage der Tabelle, in der „x" auch
   steht, ist sie tot. Sie braucht keinen Browser.
   ===================================================================== */
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const s = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
const z = s.split("\n");

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

/* Die Woerter einer Tabelle: alles, was auf vier Leerzeichen
   Einrueckung als Schluessel steht. */
const tabelle = (name) => {
  const i = s.indexOf("var " + name + " = {");
  if (i < 0) return new Set();
  const j = s.indexOf("\n  };", i);
  const teil = s.slice(i, j < 0 ? i + 4000 : j);
  return new Set((teil.match(/^ {4}([a-zA-Z]+):/gm) || [])
    .map((x) => x.trim().replace(":", "")));
};
const zeileMit = (text) => {
  const k = z.findIndex((l) => l.indexOf(text) >= 0);
  return k < 0 ? Infinity : k + 1;
};

const TABELLEN = [
  ["AM_PLATZ", tabelle("AM_PLATZ"), zeileMit("if (AM_PLATZ[art]) {")],
  ["AUCH_AM_PLATZ", tabelle("AUCH_AM_PLATZ"), zeileMit("if (AUCH_AM_PLATZ[art]")],
  ["WETTER", tabelle("WETTER"), zeileMit("if (WETTER[art]) {")]
];

console.log("DIE REIHENFOLGE IM BEFEHLSVERTEILER\n");
TABELLEN.forEach(([name, w, zeile]) => {
  console.log("  " + name + ": " + w.size + " Wörter, Abfrage in Zeile "
    + (zeile === Infinity ? "—" : zeile));
});
console.log("");

const tot = [];
z.forEach((l, k) => {
  /* Nur die oberste Ebene der Befehlsfunktion: genau vier Leerzeichen. */
  const m = /^ {4}if \(art === "([a-zA-Z]+)"/.exec(l);
  if (!m) return;
  const wort = m[1];
  TABELLEN.forEach(([name, w, zeile]) => {
    if (w.has(wort) && k + 1 > zeile) tot.push({ zeile: k + 1, wort, name, vor: zeile });
  });
});

sage(tot.length === 0,
  "keine Abzweigung steht hinter der Tabelle, die sie abfängt",
  tot.map((t) => "/" + t.wort + " in Zeile " + t.zeile + ", "
    + t.name + " greift schon in " + t.vor).join("; "));

/* Und die zwei, die es betraf, ausdruecklich beim Namen. */
const vorher = (wort, name) => {
  const k = zeileMit('    if (art === "' + wort + '"');
  const t = TABELLEN.find((x) => x[0] === name);
  return k < (t ? t[2] : Infinity);
};
sage(vorher("kopfhoerer", "AM_PLATZ"),
  "„/kopfhoerer Name Lied“ steht VOR AM_PLATZ — das Lied kommt an");
sage(vorher("ballonpumpe", "AM_PLATZ"),
  "„/ballonpumpe Name helium“ steht VOR AM_PLATZ — die zweite Variante ist erreichbar");

console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
process.exit(fehler ? 1 : 0);
