#!/usr/bin/env node
/* =========================================================
   RUNDE 64 — LOECHER FARBIG FUELLEN, COWBOYRUF ZURUECK,
   DER BALL RATTERT IM RING
   ---------------------------------------------------------
   GEWUENSCHT:
   · „Ist es moeglich, dass du die Silhouette am Umriss
     berechnest und da, wo die Loecher im Koerper sind, dass
     du sie fuellen kannst — vielleicht mit einem weichen
     Verlauf, der zu den Pixeln in dieser Umgebung passt?"
   · „und auch den Cowboyhut wieder ein bisschen besser
     gestaltest und das urspruengliche Geraeusch vom Cowboy
     zurueckholst"
   · „und endlich den perfekten Basketballkorb-Sound machst,
     inklusive der realistischen Animation in dem Korb, dass
     der Ball so im Metallgeruest herumrattert, bevor er
     runterfaellt"
   ========================================================= */
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
const werk = fs.readFileSync(path.join(WURZEL, "werkzeug", "tutorfilm-saeubern.py"), "utf8");
const bauen = fs.readFileSync(path.join(WURZEL, "werkzeug", "tutorvideo-bauen.sh"), "utf8");

console.log("\nDIE LOECHER BEKOMMEN FARBE AUS DER UMGEBUNG\n");
pruefe("es gibt das Nachwachsen", /def farbe_nachwachsen\(/.test(werk));
pruefe("und es laeuft VOR dem Alphakanal",
  werk.indexOf("bild = farbe_nachwachsen(") > 0
  && werk.indexOf("bild = farbe_nachwachsen(") < werk.indexOf("neu[:, :, 3] = (alpha"));
/* DIE WICHTIGSTE ZEILE: die schwarzen Comiclinien duerfen NICHT
   mitgefuellt werden, sonst ist die Zeichnung weg. Linien sind
   duenn — jeder Linienpunkt liegt hoechstens zwei Pixel von echter
   Farbe weg. Genau daran wird unterschieden. */
pruefe("die Comiclinien bleiben verschont (Abstand groesser als 2 px)",
  /abstand > 2\.0/.test(werk));
pruefe("und die Fuellung bekommt einen weichen Rand",
  /gaussian_filter\(werte\[:, :, k\], 1\.6\)/.test(werk));
pruefe("unten wird staerker geschlossen als oben (Schuhe sind schwarz)",
  /unten_r=6/.test(werk) && /zu\[grenze:, :\] \|= tief\[grenze:, :\]/.test(werk));

console.log("\nGREENSCREEN IST DER NORMALFALL\n");
pruefe("das Werkzeug schluesselt auf Gruen", /chromakey=0x00b140/.test(bauen));
pruefe("mit Despill gegen den gruenen Saum", /despill=type=green/.test(bauen));
pruefe("Schwarz bleibt nur als Rueckfall", /GRUND=schwarz|schwarz\|black/.test(bauen));
pruefe("und die Nachbehandlung laeuft gleich mit",
  /tutorfilm-saeubern\.py/.test(bauen));

console.log("\nDER COWBOY RUFT WIEDER\n");
pruefe("der Hut klingt wieder nach cowboy.opus",
  /hut:\s*\{ ton: "cowboy",/.test(js));
pruefe("die Datei liegt auch wirklich da",
  fs.existsSync(path.join(WURZEL, "ton", "cowboy.opus"))
  && fs.existsSync(path.join(WURZEL, "ton", "cowboy.m4a")));
pruefe("der Hut hat jetzt eine Steppnaht", /stroke-dasharray="3 3\.2"/.test(js));
pruefe("ein Licht auf der Krone", /rgba\(255,240,206,\.34\)/.test(js));
pruefe("und einen Schatten unter der Krempe", /rgba\(40,24,6,\.35\)/.test(js));

console.log("\nDER BALL RATTERT IM RING\n");
pruefe("es gibt die Ratterphase", /const flug = 620, rattern = 760, fall = 420;/.test(js));
/* Vier Ausschlaege, jeder kleiner als der vorige — ein Ball, der
   gleichmaessig hin und her geht, ist ein Pendel. */
const ausschlag = [...js.matchAll(/dx \+ 18|dx - 12|dx \+ 7|dx - 4/g)].length;
pruefe("mit vier abnehmenden Ausschlaegen", ausschlag === 4, ausschlag + " gefunden");
pruefe("der Ring bebt dabei mit", /lc-korb-rattert/.test(js) && /lcKorbBebenR64/.test(css));
pruefe("Bild und Ton haengen an derselben Millisekunde",
  /ring\.style\.setProperty\("--anschlag", \(ab \+ flug\) \+ "ms"\);/.test(js)
  && /lcTonSpaeter\("korbrattern", ab \+ flug, 0\.7\);/.test(js));
pruefe("der alte Ton auf festen 3600 ms ist weg",
  !/lcTonSpaeter\("korbscheppern", 3600/.test(js));
pruefe("das neue Geraeusch liegt als .opus und .m4a da",
  fs.existsSync(path.join(WURZEL, "ton", "korbrattern.opus"))
  && fs.existsSync(path.join(WURZEL, "ton", "korbrattern.m4a")));
pruefe("und steht in der Geraeuschliste",
  /korbrattern/.test(fs.readFileSync(path.join(WURZEL, "data-geraeusche.js"), "utf8")));

console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nRunde 64 sitzt.\n");
process.exit(fehler ? 1 : 0);
