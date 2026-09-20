#!/usr/bin/env node
/* =========================================================
   WELCHE TUTOR-FILME WIRKLICH DALIEGEN
   ---------------------------------------------------------
   Dasselbe Prinzip wie bei data-geraeusche.js: geschaut, nicht
   geglaubt. Dieses Werkzeug liest tutor/video/, nimmt jeden
   Namen, zu dem dort eine .webm liegt, und schreibt
   data-tutorvideo.js neu. Steht ein Name in der Datei, gibt es
   den Film auch — steht er nicht da, bleibt das Standbild
   stehen, und zwar ohne dass der Browser erst einen Fehlgriff
   ins Leere macht.

   Aufruf:  node werkzeug/tutorvideo-liste.js
   ========================================================= */
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const ORDNER = path.join(WURZEL, "tutor", "video");
let namen = [];
try {
  namen = fs.readdirSync(ORDNER).filter((f) => /\.webm$/i.test(f))
    .map((f) => f.replace(/\.webm$/i, ""))
    /* „-maske.mp4" gehoert zum selben Stueck und ist kein eigenes. */
    .filter((n) => !/-maske$/.test(n)).sort();
} catch (e) { namen = []; }
fs.writeFileSync(path.join(WURZEL, "data-tutorvideo.js"),
  "/* =========================================================\n"
  + "   WELCHE TUTOR-FILME ES GIBT\n"
  + "   ---------------------------------------------------------\n"
  + "   Geschrieben von werkzeug/tutorvideo-liste.js — nicht von\n"
  + "   Hand aendern. Zu jedem Namen hier liegt tutor/video/<name>.webm\n"
  + "   wirklich da. Fehlt ein Name, zeigt der Tutor sein Standbild;\n"
  + "   das ist kein Fehler, sondern der vorgesehene Rueckfall.\n"
  + "   ========================================================= */\n"
  + "window.DMA_TUTORVIDEO = \"" + namen.join("|") + "\";\n");
console.log(namen.length + " Tutor-Filme in data-tutorvideo.js");
