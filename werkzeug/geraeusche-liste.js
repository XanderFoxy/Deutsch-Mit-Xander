#!/usr/bin/env node
/* =========================================================
   WELCHE GERAEUSCHE WIRKLICH DALIEGEN
   ---------------------------------------------------------
   data-geraeusche.js wurde bisher von werkzeug/geraeusche-
   holen.js geschrieben — und zwar aus dessen eigener
   Wunschliste. Ein Geraeusch, das NICHT von dort kam (etwa
   ein gerechnetes wie der Schrei oder der Wecker), stand
   damit nie in der Datei: die Seite hat es nie gefunden,
   obwohl es dalag.

   Dieses Werkzeug schaut deshalb nach, statt zu glauben: es
   liest den Ordner ton/, nimmt jeden Namen, zu dem es eine
   .opus gibt, und schreibt die Liste neu. Wer ein Geraeusch
   dazulegt — gerechnet, aufgenommen oder geholt —, ruft es
   einmal auf und ist fertig.

   Aufruf:  node werkzeug/geraeusche-liste.js
   ========================================================= */
const fs = require("fs");
const path = require("path");
const WURZEL = path.dirname(__dirname);
const ORDNER = path.join(WURZEL, "ton");

const namen = fs.readdirSync(ORDNER)
  .filter((f) => f.endsWith(".opus"))
  .map((f) => f.slice(0, -5))
  .sort((a, b) => a.localeCompare(b, "de"));

/* Wer keine zweite Fassung hat, bleibt auf dem iPhone stumm —
   Safari spielt Opus je nach Fassung nicht. Das ist kein Fehler
   dieser Liste, aber es gehoert gesagt. */
const ohneM4a = namen.filter((n) => !fs.existsSync(path.join(ORDNER, n + ".m4a")));

fs.writeFileSync(path.join(WURZEL, "data-geraeusche.js"),
  "/* =========================================================\n"
  + "   WELCHE ECHTEN GERAEUSCHE ES GIBT\n"
  + "   ---------------------------------------------------------\n"
  + "   Geschrieben von werkzeug/geraeusche-liste.js — nicht von\n"
  + "   Hand aendern. Die Liste entsteht aus dem Ordner ton/\n"
  + "   selbst: steht ein Name hier, liegt dort wirklich eine\n"
  + "   Datei. Steht er nicht da, klingt wie bisher der\n"
  + "   synthetische Ton aus dem Browser.\n"
  + "   ========================================================= */\n"
  + "window.DMA_GERAEUSCHE = \"" + namen.join("|") + "\";\n");

console.log(namen.length + " Geraeusche stehen in data-geraeusche.js");
if (ohneM4a.length) {
  console.log("  ohne AAC-Fassung (auf dem iPhone stumm): " + ohneM4a.join(", "));
}
