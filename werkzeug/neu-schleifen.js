#!/usr/bin/env node
/* SCHLEIFT ALLE AUFNAHMEN NEU — ohne sie noch einmal zu bezahlen.
   ---------------------------------------------------------------
   Die Rohdateien liegen unter /tmp/roh-a1 (siehe a1-aufnehmen.js).
   Wer an ton-nachbearbeiten.js etwas aendert — an der Entrauschung,
   am Abschneiden, an der Lautheit — kann hier alles neu durchlaufen
   lassen. Das kostet nur Rechenzeit.

   Genau dafuer ist es gebaut worden: beim ersten Durchgang wurden
   die Rohdateien weggeworfen, und als auffiel, dass der Abschneider
   „Fluss" auf die Haelfte kuerzt, mussten alle 2239 noch einmal
   heruntergeladen werden.

   Aufruf:  node werkzeug/neu-schleifen.js
*/
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const WURZEL = path.dirname(__dirname);
const ROH = "/tmp/roh-a1";
const ZIEL = path.join(WURZEL, "aussprache", "a1");

if (!fs.existsSync(ROH)) { console.error("Keine Rohdateien unter " + ROH); process.exit(2); }
const dateien = fs.readdirSync(ROH).filter((f) => f.endsWith(".mp3"));
let n = 0, schief = 0;
for (const f of dateien) {
  try {
    execFileSync("node", [path.join(WURZEL, "werkzeug", "ton-nachbearbeiten.js"),
      path.join(ROH, f), path.join(ZIEL, f)], { stdio: ["ignore", "ignore", "pipe"] });
    n++;
  } catch (e) { schief++; console.error("   " + f + ": " + String(e.message).slice(0, 80)); }
}
console.log(n + " neu geschliffen, " + schief + " schiefgegangen.");
