#!/usr/bin/env node
/* =========================================================
   RUNDE 68 — BILLARD-PRALLPHYSIK
   ---------------------------------------------------------
   GEWUENSCHT, woertlich: „wenn mehr als zwei Leute
   teilnehmen, soll die eine Kugel, die man anstoesst, die
   anderen beeinflussen und einer von denen soll zufaellig in
   ein leerstehendes Loch fallen."

   Die RICHTUNG stimmte laengst — jede Kugel wich vom Aufprall
   weg. Was fehlte, war die WUCHT: jede sprang gleich weit,
   die hinterste genauso wie die daneben. Und wer zwischen
   Kugel und Ziel sass, wurde gar nicht getroffen: die Kugel
   rollte durch ihn hindurch.
   ========================================================= */
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
const ohneK = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "");
const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
const jsK = ohneK(js), cssK = ohneK(css);

console.log("\nWIE VIEL STOSS ANKOMMT, WIRD GERECHNET");
pruefe("der Stoss faellt mit dem Abstand ab",
  /const naehe = 1 \/ \(1 \+ Math\.pow\(l \/ einheit, 2\)\);/.test(jsK));
pruefe("und haengt am Winkel: voll von vorn, schwaecher von hinten",
  /const gerichtet = 0\.35 \+ 0\.65 \* Math\.max\(0, mit\);/.test(jsK));
pruefe("nicht null nach hinten — sonst ruehrt sich gar nichts mehr",
  !/wucht = Math\.max\(0, mit\) \* naehe;/.test(jsK));
pruefe("unter 8 Prozent bleibt die Kugel liegen",
  /if \(wucht < 0\.08\) return 0;/.test(jsK));
pruefe("der Platzabstand wird GEMESSEN, nicht angenommen",
  /function lcPlatzAbstand\(gitter\)/.test(jsK)
  && /lcPlatzAbstand\(gitter\)/.test(jsK));

console.log("\nUND DIE ZEICHNUNG WENDET IHN AN");
pruefe("die Wucht faehrt als --wucht an den Kreis",
  /setProperty\("--wucht"/.test(jsK));
pruefe("der Weg haengt daran, nicht mehr an festen 11 Prozent",
  /var\(--ax, 0\) \* var\(--wucht, 1\) \* 13%/.test(cssK)
  && !/var\(--ax, 0\) \* 11%/.test(cssK));
pruefe("die Drehung auch — wer kaum etwas abbekommt, dreht sich kaum",
  /rotate\(calc\(var\(--wucht, 1\) \* 8deg\)\)/.test(cssK));
pruefe("und sie wird hinterher wieder abgeraeumt",
  /removeProperty\("--wucht"\)/.test(jsK));

console.log("\nWER IM WEG LIEGT, WIRD UNTERWEGS GETROFFEN");
pruefe("der senkrechte Abstand zur Bahn wird gerechnet",
  /const quer = Math\.hypot\(p\.x - fx, p\.y - fy\);/.test(jsK));
pruefe("nur wer wirklich nah an der Bahn liegt", /quer > einheit \* 0\.62/.test(jsK));
pruefe("und nur zwischen den beiden, nicht davor oder dahinter",
  /if \(t <= 0\.05 \|\| t >= 0\.95\) return;/.test(jsK));
pruefe("getroffen wird er DANN, wenn die Kugel vorbeikommt",
  /hin\.ankunft \* t \+ 40/.test(jsK));
pruefe("und quer zur Bahn weggedrueckt, wie bei einem Streifschuss",
  /const sx2 = \(p\.x - fx\) \/ seite, sy2 = \(p\.y - fy\) \/ seite;/.test(jsK));

console.log("\nDAS LOCH LIEGT IN DER FLUGRICHTUNG — AUCH FUER DEN GEFALLENEN");
pruefe("nicht mehr einfach das naechste ueberhaupt",
  /const vorwaerts = freie\.filter\(\(k\) => k\.mit > 0\.35\)/.test(jsK));
pruefe("aber wenn vorn keins frei ist, nimmt sie eben das naechste",
  /opferLoch = vorwaerts\.length \? vorwaerts\[0\]\.p/.test(jsK));

console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 68 sitzt.\n");
process.exit(fehler ? 1 : 0);
