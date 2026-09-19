#!/usr/bin/env node
/* =========================================================
   SIND ES HAENDE ODER HOLZTEILE?
   ---------------------------------------------------------
   GEMELDET: „Der Daumen von der winkenden Hand ist noch
   nicht realistisch, und die klatschenden Haende sehen somit
   auch nicht natuerlich aus — die sind immer noch
   verschachtelt. Unten ist immer noch so eine Box und dann
   die aufgestellten Dinger. Das sind kleine Holzhaende. Das
   sind natuerliche Haende. Die haben zwar auch in der Natur
   ihre Konturen, aber nicht so auffaellig, dass sie aussehen
   wie Roboter oder hoelzern."

   Zwei Dinge lassen sich daran wirklich messen:

   1. EIN UMRISS JE HAND. Eine Hand, die aus Flaeche + vier
      Fingern + Daumen zusammengesetzt ist, hat sichtbare
      Fugen — das ist die „Box mit den aufgestellten Dingern".
      Geprueft wird deshalb: genau EIN gefuellter Pfad mit
      Umrisslinie je Hand.
   2. DIE KONTUR DARF NICHT AUFFALLEN. Geprueft wird, dass
      jede Umrisslinie durchscheinend ist (Deckung unter 50
      Prozent) und duenn (hoechstens 2 Punkte).

   Dazu: beide Bilder werden wirklich gezeichnet und
   nachgezaehlt, damit nicht eine leere Datei durchgeht.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

const DATEIEN = [["winken.svg", 1], ["klatschen.svg", 2]];

(async () => {
  console.log("\nEIN UMRISS JE HAND\n");
  const texte = {};
  DATEIEN.forEach(([name, haende]) => {
    const t = fs.readFileSync(path.join(WURZEL, "sticker", name), "utf8");
    texte[name] = t;
    /* Ein gefuellter Umriss ist ein Pfad mit fill="url(#haut…)". */
    const umrisse = (t.match(/fill="url\(#haut/g) || []).length;
    pruefe(name + ": genau ein Umriss je Hand", umrisse === haende,
      umrisse + " Umrisse, " + haende + " Hand/Haende");
    /* Und KEIN zweiter gefuellter Hautkoerper daneben — genau das
       waren frueher Flaeche, Finger und Daumen als Einzelteile. */
    const hautteile = (t.match(/fill="#f0b077"|fill="#f3b57b"|fill="#f6c79a"/g) || []).length;
    pruefe(name + ": keine losen Hautteile mehr", hautteile === 0,
      hautteile + " Einzelteile");
  });

  console.log("\nDIE KONTUR FAELLT NICHT AUF\n");
  DATEIEN.forEach(([name]) => {
    const t = texte[name];
    const harte = [];
    const re = /stroke="(#[0-9a-f]{3,8}|rgba?\([^)]*\))"/gi;
    let m;
    while ((m = re.exec(t))) {
      const farbe = m[1];
      const rgba = /rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/.exec(farbe);
      const deckung = rgba ? parseFloat(rgba[1]) : 1;
      if (deckung > 0.5 && !/#f2b84b|#6aa6ee/i.test(farbe)) harte.push(farbe);
    }
    pruefe(name + ": keine deckende Umrisslinie", harte.length === 0,
      harte.length ? harte.slice(0, 3).join(", ") : "alle durchscheinend");
    const dick = (t.match(/stroke-width="([\d.]+)"/g) || [])
      .map((x) => parseFloat(x.replace(/\D*([\d.]+)\D*/, "$1")))
      .filter((w) => w > 2.2);
    /* Die gelben Striche (Schwung und Funken) duerfen dick sein —
       sie sind keine Kontur. Geprueft wird deshalb nur, dass es
       nicht MEHR als diese wenigen gibt. */
    pruefe(name + ": keine dicken Konturen", dick.length <= 4,
      dick.length + " Linien ueber 2,2 Punkte");
  });

  console.log("\nUND WIRD WIRKLICH ETWAS GEZEICHNET?\n");
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 520, height: 320 } });
  for (const [name] of DATEIEN) {
    await pg.setContent('<style>*{animation:none !important}</style>'
      + '<body style="margin:0;background:#000">' + texte[name] + "</body>");
    await pg.waitForTimeout(150);
    const haut = await pg.evaluate(async () => {
      const leinwand = document.createElement("canvas");
      leinwand.width = 220; leinwand.height = 140;
      const svg = document.querySelector("svg");
      const quelle = new XMLSerializer().serializeToString(svg);
      const bild = new Image();
      await new Promise((f, g) => {
        bild.onload = f; bild.onerror = g;
        bild.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(quelle)));
      });
      const c = leinwand.getContext("2d");
      c.drawImage(bild, 0, 0);
      const d = c.getImageData(0, 0, leinwand.width, leinwand.height).data;
      let hautPunkte = 0;
      for (let i = 0; i < d.length; i += 4) {
        /* Hautton: viel Rot, mittel Gruen, wenig Blau. */
        if (d[i + 3] > 40 && d[i] > 180 && d[i + 1] > 120 && d[i + 1] < 220 && d[i + 2] < 190
            && d[i] - d[i + 2] > 40) hautPunkte++;
      }
      return hautPunkte;
    });
    pruefe(name + " zeichnet eine Hand", haut > 1500, haut + " Hautpunkte");
  }
  await br.close();

  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Zwei Haende, ein Umriss, weiche Kontur.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
