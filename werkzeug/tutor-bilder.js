#!/usr/bin/env node
/* SCHNEIDET DIE TUTOR-FIGUREN ZU.
   ---------------------------------------------------------------
   GEWUENSCHT: „Ich moechte einen kleinen Tutor haben, von meinem Foto
   ausgehend … vielleicht kannst du das erst mal so machen, dass ich
   da in Position sitze, ohne Gitarre, und ohne Hintergrund. Wenn du
   das transparent machen kannst, dann waere das cool."

   Die beiden Figuren sind aus seinem Profilfoto entstanden
   (ElevenLabs, gpt-image-2): einmal fotorealistisch, einmal als
   Comic. Beide liegen auf durchsichtigem Grund in einem 1280x720
   grossen Bild — und stehen darin klein in der Mitte.

   Hier wird der leere Rand weggeschnitten, und zwar GEMESSEN: die
   Leinwand wird Punkt fuer Punkt nach Farbe abgesucht, genau wie bei
   den grossen Geschenken. Ein geschaetzter Zuschnitt haette beim
   einen die Fuesse und beim anderen die Muetze gekappt.

   Aufruf:  node werkzeug/tutor-bilder.js <quelle.png> <ziel.png>
*/
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const fs = require("fs");
const path = require("path");

const quelle = process.argv[2];
const ziel = process.argv[3];
if (!quelle || !ziel) { console.error("Aufruf: node werkzeug/tutor-bilder.js <quelle> <ziel>"); process.exit(2); }

(async () => {
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage();
  const daten = "data:image/png;base64," + fs.readFileSync(quelle).toString("base64");
  const ergebnis = await pg.evaluate(async (daten) => {
    const bild = new Image();
    bild.src = daten;
    await new Promise((f, s) => { bild.onload = f; bild.onerror = s; });
    const c = document.createElement("canvas");
    c.width = bild.width; c.height = bild.height;
    const k = c.getContext("2d");
    k.drawImage(bild, 0, 0);
    const d = k.getImageData(0, 0, c.width, c.height).data;
    let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        if (d[(y * c.width + x) * 4 + 3] > 16) {
          if (x < x0) x0 = x; if (x > x1) x1 = x;
          if (y < y0) y0 = y; if (y > y1) y1 = y;
        }
      }
    }
    if (x1 < 0) return null;
    /* Etwas Luft, damit keine Kontur am Rand klebt. */
    const luft = 6;
    x0 = Math.max(0, x0 - luft); y0 = Math.max(0, y0 - luft);
    x1 = Math.min(c.width - 1, x1 + luft); y1 = Math.min(c.height - 1, y1 + luft);
    const b = x1 - x0 + 1, h = y1 - y0 + 1;
    /* Auf 520 Pixel Hoehe bringen — das reicht fuer jedes Telefon und
       kostet unter 200 KB. */
    const zielH = 520, zielB = Math.round(b * zielH / h);
    const z = document.createElement("canvas");
    z.width = zielB; z.height = zielH;
    const zk = z.getContext("2d");
    zk.imageSmoothingQuality = "high";
    zk.drawImage(c, x0, y0, b, h, 0, 0, zielB, zielH);
    return { png: z.toDataURL("image/png"), b: zielB, h: zielH, vorher: c.width + "x" + c.height,
             ausschnitt: b + "x" + h };
  }, daten);
  await br.close();
  if (!ergebnis) { console.error("Nichts Sichtbares gefunden."); process.exit(1); }
  fs.mkdirSync(path.dirname(ziel), { recursive: true });
  fs.writeFileSync(ziel, Buffer.from(ergebnis.png.split(",")[1], "base64"));
  const kb = (fs.statSync(ziel).size / 1024).toFixed(0);
  console.log(path.basename(ziel) + ": " + ergebnis.vorher + " → Ausschnitt "
    + ergebnis.ausschnitt + " → " + ergebnis.b + "x" + ergebnis.h + ", " + kb + " KB");
})();
