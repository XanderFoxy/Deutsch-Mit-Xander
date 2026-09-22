#!/usr/bin/env node
/* =====================================================================
   WANN IST EIN TON WIRKLICH ZU HOEREN?
   ---------------------------------------------------------------------
   XANDER, immer wieder und ueber verschiedene Effekte:
   „Man hoert das Ei auch vorher, bevor man es aufschlaegt … der
   Katapult, den hoert man auch schon vorher, den Bumerang hoert man
   auch schon vorher — nicht in dem Moment, wo die Animation
   aufschlaegt oder trifft."

   Im Quelltext steht immer nur, WANN ein Ton gestartet wird
   (`lcTonSpaeter("holzklopf", 860, ...)`). Zu hoeren ist er aber erst,
   wenn in der DATEI etwas Lautes kommt. Hat die Datei 300 ms stillen
   Vorlauf, klingt derselbe Ton in Wirklichkeit bei 1160 ms — und keine
   Zahl im Programm verraet das.

   Dieses Werkzeug rechnet beides zusammen:

       geplant  +  Vorlauf der Datei  =  wirklich zu hoeren

   Aufruf:
       node werkzeug/ton-zeitpunkte.js            (alle)
       node werkzeug/ton-zeitpunkte.js bumerang   (nur Zeilen, die passen)

   Gemessen wird der Vorlauf als der Zeitpunkt, an dem die Welle zum
   ersten Mal ueber 20 Prozent ihrer eigenen Spitze geht — das ist der
   Moment, den ein Ohr als „jetzt" hoert.

   Was dieses Werkzeug NICHT weiss: wann die Animation an derselben
   Stelle den Aufschlag ZEIGT. Das steht in den Stuetzstellen des
   jeweiligen Effekts und gehoert daneben gelegt. Die Sonde
   werkzeug/pruefe-runde90-aufschlagtoene.js prueft deshalb nur das,
   was ohne diesen Vergleich sicher ist: ein Aufschlagton darf keinen
   Vorlauf haben.
   ===================================================================== */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const WURZEL = path.join(__dirname, "..");
const FFMPEG = process.env.FFMPEG || "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const RATE = 48000;
const filter = (process.argv[2] || "").toLowerCase();

const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");

/* Alle festen Einplanungen: lcTonSpaeter("name", 860, ...).
   Zeilen mit gerechneter Zeit (Math.round(hin * 0.29)) stehen mit
   „gerechnet" da — dort haengt der Zeitpunkt an der Strecke. */
const stellen = [];
const re = /lcTonSpaeter\("([a-z0-9]+)",\s*([^,]+),/g;
let m;
while ((m = re.exec(js))) {
  const zeile = js.slice(0, m.index).split("\n").length;
  stellen.push({ ton: m[1], wann: m[2].trim(), zeile: zeile });
}

const gemessen = {};
function vorlauf(name) {
  if (gemessen[name] !== undefined) return gemessen[name];
  const datei = path.join(WURZEL, "ton", name + ".opus");
  if (!fs.existsSync(datei)) return (gemessen[name] = null);
  const roh = execFileSync(FFMPEG,
    ["-v", "error", "-i", datei, "-f", "f32le", "-ac", "1", "-ar", String(RATE), "-"],
    { maxBuffer: 1 << 28 });
  const x = new Float32Array(roh.buffer, roh.byteOffset, Math.floor(roh.length / 4));
  let spitze = 0;
  for (let i = 0; i < x.length; i++) {
    const b = Math.abs(x[i]);
    if (b > spitze) spitze = b;
  }
  let vor = 0;
  for (let i = 0; i < x.length; i++) {
    if (Math.abs(x[i]) > spitze * 0.05) { vor = i; break; }
  }
  return (gemessen[name] = { vor: vor / RATE * 1000, laenge: x.length / RATE * 1000 });
}

console.log("\nTon              geplant   Vorlauf   zu hoeren   Datei   app.js");
console.log("--------------------------------------------------------------------");
stellen
  .filter((s) => !filter || s.ton.indexOf(filter) >= 0
                 || String(s.wann).toLowerCase().indexOf(filter) >= 0)
  .sort((a, b) => a.ton.localeCompare(b.ton))
  .forEach((s) => {
    const v = vorlauf(s.ton);
    const zahl = /^\d+$/.test(s.wann) ? Number(s.wann) : null;
    const wann = zahl === null ? "gerechnet" : zahl + " ms";
    const hoerbar = (zahl === null || !v) ? "—"
      : Math.round(zahl + v.vor) + " ms";
    console.log(s.ton.padEnd(16)
      + wann.padStart(9) + "  "
      + (v ? (Math.round(v.vor) + " ms").padStart(8) : "  FEHLT ") + "  "
      + hoerbar.padStart(9) + "  "
      + (v ? (Math.round(v.laenge) + " ms").padStart(6) : "      ") + "   :" + s.zeile);
  });
console.log("");
