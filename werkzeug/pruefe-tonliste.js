#!/usr/bin/env node
/* =========================================================
   JEDER TON, DEN DER PLAN NENNT, MUSS AUCH KLINGEN
   ---------------------------------------------------------
   GEMELDET: „Der Strudel hat noch kein Geräusch, kein
   Geräusch."

   Nachgesehen, und es war nicht die Animation: „sogwasser"
   lag als Datei im Ordner und stand im Tonplan — aber NICHT
   in data-geraeusche.js. Diese Liste entscheidet, ob der
   Browser die Datei überhaupt sucht; was nicht darin steht,
   bleibt stumm. Die Liste wird von
   werkzeug/geraeusche-liste.js geschrieben, und sie war nach
   dem Dazulegen neuer Geräusche schlicht nicht neu
   geschrieben worden.

   Diese Sonde prüft deshalb drei Dinge auf einmal:
     1. Jeder Name aus LC_TON_PLAN und aus lcTonSpaeter(...)
        hat eine Datei in ton/ (.opus UND .m4a).
     2. Jeder dieser Namen steht in data-geraeusche.js.
     3. Die Liste nennt keine Datei, die es nicht gibt.
   Sie braucht keinen Browser — sie liest die Dateien.
   ========================================================= */
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

const app = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
const liste = fs.readFileSync(path.join(WURZEL, "data-geraeusche.js"), "utf8");

/* Die Namen aus dem Plan: ton: "…" */
const ausPlan = new Set();
(app.match(/\bton:\s*"([a-z0-9]+)"/g) || []).forEach((t) => {
  ausPlan.add(t.replace(/.*"([a-z0-9]+)".*/, "$1"));
});
/* Und die zweiten Toene: lcTonSpaeter("…", …) */
(app.match(/lcTonSpaeter\("([a-z0-9]+)"/g) || []).forEach((t) => {
  ausPlan.add(t.replace(/.*"([a-z0-9]+)".*/, "$1"));
});
/* Und die direkt gespielten: lcGeraeusch("…" */
(app.match(/lcGeraeusch\("([a-z0-9]+)"/g) || []).forEach((t) => {
  ausPlan.add(t.replace(/.*"([a-z0-9]+)".*/, "$1"));
});

const m = liste.match(/DMA_GERAEUSCHE\s*=\s*"([^"]*)"/);
const gemeldet = new Set((m ? m[1] : "").split("|").filter(Boolean));
const imOrdner = new Set(fs.readdirSync(path.join(WURZEL, "ton"))
  .filter((f) => f.endsWith(".opus")).map((f) => f.slice(0, -5)));

console.log("\nWAS DER PLAN NENNT — GIBT ES DAS AUCH?\n");
const ohneDatei = [...ausPlan].filter((n) => !imOrdner.has(n)).sort();
pruefe("jeder Ton aus dem Plan hat eine Datei",
  ohneDatei.length === 0, ohneDatei.length ? ohneDatei.join(", ") : ausPlan.size + " Namen");

const ohneListe = [...ausPlan].filter((n) => imOrdner.has(n) && !gemeldet.has(n)).sort();
pruefe("… und steht auch in data-geraeusche.js",
  ohneListe.length === 0,
  ohneListe.length ? "FEHLT: " + ohneListe.join(", ") + "  (werkzeug/geraeusche-liste.js laufen lassen)"
                   : gemeldet.size + " Namen in der Liste");

console.log("\nUND UMGEKEHRT\n");
const totInListe = [...gemeldet].filter((n) => !imOrdner.has(n)).sort();
pruefe("die Liste nennt keine Datei, die es nicht gibt",
  totInListe.length === 0, totInListe.length ? totInListe.join(", ") : "keine Leichen");

/* Jede Datei doppelt: .opus fuer alle, .m4a fuer Apple-Geraete. */
const ohneM4a = [...imOrdner].filter(
  (n) => !fs.existsSync(path.join(WURZEL, "ton", n + ".m4a"))).sort();
pruefe("jede Datei liegt als .opus UND .m4a vor",
  ohneM4a.length === 0, ohneM4a.length ? "ohne m4a: " + ohneM4a.join(", ") : imOrdner.size + " Paare");

console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                   : "\nJeder Ton, den der Plan nennt, klingt auch.\n");
process.exit(fehler ? 1 : 0);
