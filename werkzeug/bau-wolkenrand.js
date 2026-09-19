#!/usr/bin/env node
/* =========================================================
   DER WOLKIGE RAND — eine Maske, kein Rahmen
   ---------------------------------------------------------
   GEWÜNSCHT: „Spiel mal mit den transparenten Rändern, so dass
   der Chat durchguckt … so wie bei einer Vignette, aber mit ein
   bisschen mehr wolkenartiger Vignette, dass es aussen rum so
   ein bisschen natürlich und ungesprungen abgerundet ist,
   partielle Abrundungen — ohne dabei linear oder auffällig zu
   sein."

   Eine CSS-Vignette ist immer eine Ellipse, und eine Ellipse
   sieht man sofort als Ellipse. Was er beschreibt, ist ein Rand
   mit UNREGELMÄSSIGER Grenze — mal weiter innen, mal weiter
   aussen, wie eine Wolkenkante.

   Also wird die Maske gerechnet, nicht beschrieben:
   ein weicher elliptischer Verlauf, dessen RADIUS an jeder
   Stelle von einem Rauschen verschoben wird. Drei Lagen
   Wert-Rauschen mit halbierter Wellenlänge und halber Stärke
   („fraktal") — das ist dieselbe Rechnung, die Wolken und Berge
   natürlich aussehen lässt, und sie hat keine sichtbare
   Wiederholung.

   Heraus kommt filme/rand-wolke.png: eine Graustufenmaske, weiss
   innen, schwarz aussen. Die Seite legt sie als mask-image über
   einen Szenenfilm; wo sie schwarz ist, scheint der Chat durch.

   AUFRUF
     node werkzeug/bau-wolkenrand.js
     node werkzeug/bau-wolkenrand.js 512 910 7    (Breite Höhe Saat)
   ========================================================= */
const fs = require("fs");
const path = require("path");
const { PNG } = require("/tmp/claude-0/node_modules/pngjs");

const BREITE = Number(process.argv[2]) || 512;
const HOEHE = Number(process.argv[3]) || 910;
const SAAT = Number(process.argv[4]) || 7;

/* Ein eigener Zufall mit Saat — damit dieselbe Maske jedes Mal
   gleich herauskommt. Ein Rand, der sich bei jedem Bauen ändert,
   wäre in einer Versionsgeschichte nur Lärm. */
function zufall(n) {
  let x = Math.sin(n * 127.1 + SAAT * 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function gitter(x, y) { return zufall(x * 157 + y * 8121); }
function weich(t) { return t * t * (3 - 2 * t); }

/* Wert-Rauschen: zwischen vier Gitterpunkten weich überblenden. */
function rauschen(x, y) {
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const fx = weich(x - x0), fy = weich(y - y0);
  const a = gitter(x0, y0), b = gitter(x0 + 1, y0);
  const c = gitter(x0, y0 + 1), d = gitter(x0 + 1, y0 + 1);
  return (a + (b - a) * fx) + ((c + (d - c) * fx) - (a + (b - a) * fx)) * fy;
}
/* Fraktal: drei Lagen, jede doppelt so fein und halb so stark. */
function fraktal(x, y) {
  let s = 0, gewicht = 0, f = 1, g = 1;
  for (let i = 0; i < 3; i++) {
    s += rauschen(x * f, y * f) * g;
    gewicht += g;
    f *= 2; g *= 0.5;
  }
  return s / gewicht;
}

const bild = new PNG({ width: BREITE, height: HOEHE });
for (let y = 0; y < HOEHE; y++) {
  for (let x = 0; x < BREITE; x++) {
    /* Abstand von der Mitte, auf beiden Achsen auf 1 normiert —
       so bleibt die Form bei jedem Seitenverhältnis gleich. */
    const dx = (x / BREITE - 0.5) * 2;
    const dy = (y / HOEHE - 0.5) * 2;
    const r = Math.sqrt(dx * dx + dy * dy);

    /* WIE DAS RAUSCHEN GELESEN WIRD — zweimal nachgebessert.
       1. Entlang des WINKELS abgetastet: zog oben und unten
          sichtbare Strahlen, weil dort viele Winkel fast auf
          derselben Rauschstelle liegen.
       2. Winkel plus ein bisschen Ort: dieselben Strahlen, nur
          schwächer, und die Form wurde spitz wie eine Raute.
       Jetzt wird schlicht über die FLÄCHE abgetastet. Dass das
       Rauschen auch in der Mitte schwankt, sieht man nicht: dort
       ist die Deckung ohnehin auf 1 begrenzt. Es wirkt nur da, wo
       es soll — an der Kante. */
    const n = fraktal((x / BREITE) * 4.2 + 3,
                      (y / HOEHE) * 4.2 * (HOEHE / BREITE) + 3);

    /* Der Radius, ab dem es weich wird, schwankt um ±0,09 —
       genug, dass man keine Ellipse mehr erkennt, wenig genug,
       dass es nicht wie ein Riss aussieht. */
    const innen = 0.62 + (n - 0.5) * 0.18;
    const aussen = 0.99 + (n - 0.5) * 0.14;

    let a = 1 - (r - innen) / Math.max(0.001, aussen - innen);
    a = Math.max(0, Math.min(1, a));
    /* Weich statt linear: eine Gerade sieht man als Gerade. */
    a = weich(a);

    const i = (y * BREITE + x) << 2;
    const v = Math.round(a * 255);
    bild.data[i] = v; bild.data[i + 1] = v; bild.data[i + 2] = v; bild.data[i + 3] = 255;
  }
}

const ziel = path.join(__dirname, "..", "filme", "rand-wolke.png");
fs.writeFileSync(ziel, PNG.sync.write(bild, { colorType: 0 }));

/* Und gleich nachmessen, statt zu behaupten. */
let mitte = 0, ecke = 0, rand = 0;
const lies = (x, y) => bild.data[((y * BREITE + x) << 2)];
mitte = lies(BREITE >> 1, HOEHE >> 1);
ecke = Math.max(lies(1, 1), lies(BREITE - 2, 1), lies(1, HOEHE - 2), lies(BREITE - 2, HOEHE - 2));
/* Wie unruhig ist die Kante wirklich? Der Radius, bei dem die
   Maske auf halbe Deckung fällt, einmal rundherum gemessen. */
const radien = [];
for (let g = 0; g < 72; g++) {
  const w = (g / 72) * Math.PI * 2;
  for (let s = 0; s < 400; s++) {
    const r = s / 400;
    const x = Math.round((0.5 + Math.cos(w) * r * 0.5) * (BREITE - 1));
    const y = Math.round((0.5 + Math.sin(w) * r * 0.5) * (HOEHE - 1));
    if (x < 0 || y < 0 || x >= BREITE || y >= HOEHE) break;
    if (lies(x, y) < 128) { radien.push(r); break; }
  }
}
const min = Math.min.apply(null, radien), max = Math.max.apply(null, radien);
console.log("filme/rand-wolke.png  " + BREITE + "x" + HOEHE
  + "  " + Math.round(fs.statSync(ziel).size / 1024) + " kB");
console.log("  Mitte deckt   : " + mitte + " von 255");
console.log("  Ecken decken  : " + ecke + " von 255   (0 waere ideal)");
console.log("  Kante schwankt: Radius " + min.toFixed(3) + " bis " + max.toFixed(3)
  + "  (Spanne " + ((max - min) * 100).toFixed(1) + " %) — eine Ellipse haette 0 %");
