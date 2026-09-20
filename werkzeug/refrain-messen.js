#!/usr/bin/env node
/* =========================================================
   WO IST DER REFRAIN?
   ---------------------------------------------------------
   GEFRAGT: „in Zukunft soll man auch die Moeglichkeit haben,
   wenn man Noten spielt, dass man eins von meinen Liedern
   auswaehlen kann und dann kommt halt der Refrain von einem
   Lied. Kannst du vielleicht analysieren, wie die Refrains
   in meinen Liedern sind?"

   EHRLICH GESAGT: eine echte Refrain-Erkennung braucht
   Selbstaehnlichkeit (dieselbe Stelle kommt mehrfach vor).
   Dieses Werkzeug macht etwas Einfacheres, dafuer
   Nachvollziehbares: es misst die Lautheit Sekunde fuer
   Sekunde (ffmpeg, RMS) und sucht das LAUTESTE zusammen-
   haengende Fenster von 25 Sekunden, das fruehestens nach
   einem Fuenftel des Stueckes beginnt. Bei Popmusik liegt
   dort fast immer der Refrain — beim Intro und beim
   Ausklang ist es leiser.

   Was dabei herauskommt, steht in data-refrain.js und wird
   von /noten benutzt. Stimmt eine Stelle nicht, laesst sie
   sich dort von Hand ueberschreiben — die Datei wird nur
   neu geschrieben, wenn dieses Werkzeug wieder laeuft.

   Aufruf:  node werkzeug/refrain-messen.js
   ========================================================= */
const fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const WURZEL = path.join(__dirname, "..");
const ORDNER = path.join(WURZEL, "music");
const FENSTER = 25;            /* so lang spielt der Refrain */

function lautheitJeSekunde(datei) {
  /* astats mit einem Fenster von einer Sekunde: ffmpeg schreibt zu
     jedem Abschnitt die RMS-Lautheit in dB auf die Fehlerausgabe. */
  let aus = "";
  try {
    execFileSync(FFMPEG, ["-hide_banner", "-i", datei, "-af",
      "astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-",
      "-f", "null", "-"], { stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024 })
      .toString();
  } catch (e) { /* ffmpeg schreibt nach stdout, der Rest ist egal */ }
  try {
    aus = execFileSync(FFMPEG, ["-hide_banner", "-i", datei, "-af",
      "aresample=8000,asetnsamples=8000,astats=metadata=1:reset=1,"
      + "ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-",
      "-f", "null", "-"], { stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024 })
      .toString();
  } catch (e) { return []; }
  const werte = [];
  aus.split("\n").forEach((z) => {
    const m = z.match(/RMS_level=(-?[\d.]+|-inf)/);
    if (m) werte.push(m[1] === "-inf" ? -90 : Number(m[1]));
  });
  return werte;
}

const lieder = fs.readdirSync(ORDNER).filter((f) => /\.mp3$/i.test(f)).sort();
const ergebnis = {};
lieder.forEach((f) => {
  const werte = lautheitJeSekunde(path.join(ORDNER, f));
  if (werte.length < FENSTER + 4) { console.log("  (zu kurz gemessen: " + f + ")"); return; }
  const ab = Math.floor(werte.length / 5);          /* das Intro auslassen */
  let beste = ab, bestSumme = -1e9;
  for (let i = ab; i + FENSTER <= werte.length; i++) {
    let summe = 0;
    for (let k = 0; k < FENSTER; k++) summe += werte[i + k];
    if (summe > bestSumme) { bestSumme = summe; beste = i; }
  }
  ergebnis[f] = beste;
  console.log("  " + f + "  →  ab " + beste + " s"
    + "   (mittlere Lautheit dort " + (bestSumme / FENSTER).toFixed(1) + " dB,"
    + " Laenge " + werte.length + " s)");
});

const ziel = path.join(WURZEL, "data-refrain.js");
fs.writeFileSync(ziel,
  "/* =========================================================\n"
  + "   WO DER REFRAIN ANFAENGT — je Lied, in Sekunden\n"
  + "   ---------------------------------------------------------\n"
  + "   GESCHRIEBEN von werkzeug/refrain-messen.js, nicht von Hand.\n"
  + "   Gemessen wird die lauteste zusammenhaengende halbe Minute\n"
  + "   nach dem Intro — bei Popmusik ist das fast immer der\n"
  + "   Refrain. Eine Stelle, die nicht passt, darf hier von Hand\n"
  + "   stehen bleiben; das Werkzeug ueberschreibt sie erst beim\n"
  + "   naechsten Lauf.\n"
  + "   ========================================================= */\n"
  + "window.DMA_REFRAIN = " + JSON.stringify(ergebnis, null, 1) + ";\n");
console.log("\n" + Object.keys(ergebnis).length + " Lieder vermessen → data-refrain.js\n");
