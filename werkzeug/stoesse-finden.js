#!/usr/bin/env node
/* =========================================================
   WIE HEFTIG IST DER FILM GERADE? — DIE KURVE MESSEN
   ---------------------------------------------------------
   GEWÜNSCHT: „dass der Chat durch das Trampeln von dem Dino
   vibriert, wenn er ran kommt … dass der Boden unter ihm bebt."

   ERSTER ANLAUF, UND WARUM ER NICHT GING
   Naheliegend war, die Tritte aus der TONSPUR zu lesen: jeder
   Auftritt müsste dort eine Spitze sein. Nachgemessen am ersten
   echten Film: der ganze Ton liegt zwischen -19,5 und -11 dB —
   acht Dezibel Umfang, durchgehend zusammengedrückt. Es gibt
   dort keine Tritte zu finden. Dasselbe am Bild: die Bewegungs-
   energie steigt gleichmässig an, weil das Tier grösser wird;
   einzelne Aufschläge sind nicht darin.

   Ein Beben nach erfundenem Takt wäre schlimmer als keines — es
   wackelt dann, wenn gerade nichts passiert, und das sieht jeder
   sofort. Also wird nicht so getan, als gäbe es Tritte.

   WAS SICH WIRKLICH MESSEN LÄSST
   Die Heftigkeit über die Zeit. Sie steigt, wenn das Tier näher
   kommt, und gipfelt beim Brüllen. Gemessen wird sie als
   Bildunterschied von Bild zu Bild (zwölfmal je Sekunde),
   geglättet und auf 0 bis 1 gebracht. Die Seite lässt den Chat
   danach beben: leise, wenn er weit weg ist, heftig im Gipfel.
   Das ist ehrlich aus dem Film gelesen — und es fühlt sich
   richtig an, weil es zum Bild passt.

   Aufruf:  node werkzeug/stoesse-finden.js <video> <filme/name.json>
   ========================================================= */
const { execFileSync } = require("child_process");
const fs = require("fs");
let FF = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
if (!fs.existsSync(FF)) FF = "ffmpeg";

const quelle = process.argv[2], ziel = process.argv[3];
if (!quelle || !ziel) { console.error("Aufruf: stoesse-finden.js <video> <json>"); process.exit(1); }

let aus = "";
try {
  aus = execFileSync(FF, ["-hide_banner", "-loglevel", "error", "-i", quelle,
    "-vf", "scale=160:-2,fps=12,tblend=all_mode=difference,signalstats,"
      + "metadata=print:key=lavfi.signalstats.YAVG:file=-",
    "-f", "null", "-"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
} catch (e) { aus = (e.stdout || "").toString(); }

const roh = [];
let zeit = 0;
aus.split("\n").forEach((z) => {
  const t = z.match(/pts_time:([0-9.]+)/);
  if (t) { zeit = parseFloat(t[1]); return; }
  const y = z.match(/YAVG=([0-9.]+)/);
  if (y) roh.push([zeit, parseFloat(y[1])]);
});

const d = JSON.parse(fs.readFileSync(ziel, "utf8"));
if (roh.length < 8) {
  d.staerke = []; d.hoehepunkt = 0;
  fs.writeFileSync(ziel, JSON.stringify(d));
  console.log("     kein Bildunterschied messbar — kein Beben.");
  process.exit(0);
}

/* Glätten über fünf Messpunkte: einzelne Ausreisser (ein
   Kompressionssprung) sollen nicht als Erdstoss durchgehen. */
const glatt = roh.map(function (p, i) {
  let s = 0, n = 0;
  for (let k = -2; k <= 2; k++) { const j = i + k; if (roh[j]) { s += roh[j][1]; n++; } }
  return [p[0], s / n];
});
const werte = glatt.map((p) => p[1]).slice().sort((a, b) => a - b);
const unten = werte[Math.floor(werte.length * 0.15)];
const oben = werte[Math.floor(werte.length * 0.98)];
const spanne = Math.max(0.2, oben - unten);

const kurve = glatt.map(function (p) {
  const v = Math.max(0, Math.min(1, (p[1] - unten) / spanne));
  /* Hoch drei: leise Stellen werden noch leiser, der Gipfel
     bleibt. Sonst zittert der Chat die ganze Zeit vor sich hin. */
  return [Math.round(p[0] * 100) / 100, Math.round(v * v * v * 100) / 100];
});
let gipfel = kurve[0];
kurve.forEach(function (p) { if (p[1] > gipfel[1]) gipfel = p; });

d.staerke = kurve;
d.hoehepunkt = gipfel[0];
fs.writeFileSync(ziel, JSON.stringify(d));

const balken = (v) => "█".repeat(Math.round(v * 12)) || "·";
console.log("     Heftigkeit gemessen — " + kurve.length + " Punkte, Gipfel bei " + gipfel[0] + " s");
for (let i = 0; i < kurve.length; i += Math.max(1, Math.floor(kurve.length / 14))) {
  console.log("       " + String(kurve[i][0]).padStart(5) + " s  " + balken(kurve[i][1]));
}
