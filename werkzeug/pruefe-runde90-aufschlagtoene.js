#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 90 — EIN AUFSCHLAG MUSS KNALLEN, WENN ER GEPLANT IST
   ---------------------------------------------------------------------
   XANDER (20.09.2026, 13:53): „Man hoert das Ei auch vorher, bevor man
   es aufschlaegt … der Katapult, den hoert man auch schon vorher, den
   Bumerang hoert man auch schon vorher — nicht in dem Moment, wo die
   Animation aufschlaegt oder trifft. Und das ist auch beim Schneeball
   so, beim Geld so, und irgendwie bei vielen Animationen."

   ZWEI URSACHEN GIBT ES DAFUER, und nur eine sieht man im Quelltext:
     1. Der Ton wird zu frueh EINGEPLANT. Das steht als Zahl in app.js
        und ist dort nachzulesen.
     2. Die DATEI hat einen Vorlauf: sie faengt leise an und knallt
        erst 300 ms spaeter. Dann klingt ein richtig geplanter Ton
        trotzdem falsch — und im Quelltext sieht man davon nichts.

   Diese Sonde prueft die zweite Ursache, und zwar an der Wellenform:
   bei einem Aufschlagton muss der laute Teil GLEICH kommen. Alles
   ueber 60 Millisekunden hoert man als Verspaetung.

   WO DIE SCHWELLE LIEGT, UND WARUM SIE NACHGEZOGEN WURDE: zuerst galt
   „ueber 20 Prozent der eigenen Spitze". Das meldete „birneschrauben"
   mit 601 ms Vorlauf — nachgemessen war die Datei aber von der ersten
   Zehntelsekunde an zu hoeren (19 Prozent); nur ihr lautester Schraub
   liegt spaet, und daran wurden alle frueheren gemessen. Eine Sonde,
   die so etwas meldet, erzeugt Fehlalarm. Jetzt gilt 5 Prozent der
   Spitze (rund -26 dB) — das ist die Grenze, ab der ein Ohr etwas
   hoert, und sie trifft den echten Fall („aufsetzen", 68 ms stumm)
   weiterhin.

   Welche Toene Aufschlagtoene sind, steht nicht im Gefuehl, sondern
   in app.js: LC_ANKUNFT_TON nennt die Toene, die beim ANKOMMEN einer
   Reise gespielt werden — genau die muessen sitzen. Dazu kommen die
   Schlagtoene, die er einzeln genannt hat.
   ===================================================================== */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const WURZEL = path.join(__dirname, "..");
const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const RATE = 48000;
const GRENZE = 60;       /* Millisekunden, ab denen man es als „zu spaet" hoert */

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");

/* 1. Die Ankunftstoene — aus dem Programm gelesen, nicht aufgeschrieben. */
const ankunft = new Set();
const block = js.slice(js.indexOf("const LC_ANKUNFT_TON = {"),
                       js.indexOf("const LC_ANKUNFT_TON = {") + 2000);
let m, re = /:\s*"([a-z0-9]+)"/g;
while ((m = re.exec(block))) ankunft.add(m[1]);

/* 2. Die Schlagtoene, die er einzeln genannt hat (Ei, Bumerang,
      Schneeball, Ohrfeige, Glas, Platzen). */
["holzklopf", "eiknack", "knack", "splitter", "schneeklatsch", "ohrfeige",
 "platzen", "glasbruch"].forEach((n) => ankunft.add(n));

function vorlauf(name) {
  const datei = path.join(WURZEL, "ton", name + ".opus");
  if (!fs.existsSync(datei)) return null;
  const roh = execFileSync(FFMPEG,
    ["-v", "error", "-i", datei, "-f", "f32le", "-ac", "1", "-ar", String(RATE), "-"],
    { maxBuffer: 1 << 28 });
  const x = new Float32Array(roh.buffer, roh.byteOffset, Math.floor(roh.length / 4));
  let spitze = 0;
  for (let i = 0; i < x.length; i++) {
    const b = Math.abs(x[i]);
    if (b > spitze) spitze = b;
  }
  for (let i = 0; i < x.length; i++) {
    if (Math.abs(x[i]) > spitze * 0.05) {
      return { vor: i / RATE * 1000, laenge: x.length / RATE * 1000 };
    }
  }
  return { vor: 0, laenge: x.length / RATE * 1000 };
}

console.log("\nJEDER AUFSCHLAGTON, GEMESSEN AN SEINER WELLENFORM\n");
const namen = [...ankunft].sort();
sage(namen.length >= 8, "die Liste kommt aus dem Programm", namen.length + " Toene");
namen.forEach((n) => {
  const v = vorlauf(n);
  if (!v) { sage(false, "„" + n + "“ fehlt als Datei"); return; }
  sage(v.vor <= GRENZE,
    "„" + n + "“ knallt sofort",
    Math.round(v.vor) + " ms Vorlauf (" + Math.round(v.laenge) + " ms lang)");
});

console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
process.exit(fehler ? 1 : 0);
