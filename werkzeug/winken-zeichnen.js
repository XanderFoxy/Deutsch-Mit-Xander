#!/usr/bin/env node
/* ÜBERHOLT — NICHT MEHR AUSFÜHREN.
   Beide Hände entstehen seit Fassung 340 aus EINEM Werkzeug:
   werkzeug/haende-zeichnen.js. Dort wird jede Hand als ein
   einziger Umriss gezeichnet, statt aus Fläche, Fingern und
   Daumen zusammengesetzt zu werden — das war der Grund, warum
   sie „wie Holzhände" aussahen. Diese Datei steht nur noch da,
   damit man nachlesen kann, wie es vorher gebaut war. Würde man
   sie laufen lassen, überschriebe sie die neuen Zeichnungen. */
if (require.main === module) {
  console.error("Überholt. Nimm werkzeug/haende-zeichnen.js.");
  process.exit(1);
}
/* ZEICHNET DIE WINKENDE HAND NEU.
   GEMELDET: „Die klatschenden Hände und die winkenden sehen immer noch
   nicht nach richtigen Händen aus. Da sieht der Daumen noch unmöglich
   aus, da ist keine Verbindung."

   Beim Klatschen ist das behoben; hier stand derselbe Fehler noch:
   vier gleich breite Rechtecke mit runden Enden als Finger, eine
   glatte Fläche als Handteller, und ein Daumen, der als eigene Form
   danebenlag. Das ergibt einen Fäustling, keine Hand.

   Dieselbe Bauweise wie bei werkzeug/hand-zeichnen.js:
     * jeder Finger eigene Länge und Breite, zur Kuppe hin schmaler,
       mit zwei Gelenkfalten;
     * beim Winken sind die Finger leicht gespreizt und die Hand ist
       etwas nach hinten geneigt — so hält man sie wirklich;
     * der Daumen wächst AUS der Fläche heraus, mit der Falte zum
       Zeigefinger;
     * dazu ein Handgelenk und ein Ärmel, damit die Hand nicht im
       Nichts endet.
*/
const fs = require("fs");
const r1 = (n) => Math.round(n * 10) / 10;
const KANTE = "rgba(120,70,30,.5)";
const HAUT = "#f3b57b";

function finger(x, y, laenge, breite, winkel) {
  const b = breite / 2, s = b * 0.78;
  const spitze = y - laenge;
  const d = [
    `M${r1(x - b)} ${r1(y)}`,
    `L${r1(x - s)} ${r1(spitze + s)}`,
    `A${r1(s)} ${r1(s)} 0 0 1 ${r1(x + s)} ${r1(spitze + s)}`,
    `L${r1(x + b)} ${r1(y)}`,
    "Z",
  ].join(" ");
  const falte = (yy, w) =>
    `<path d="M${r1(x - w)} ${r1(yy)} Q${r1(x)} ${r1(yy + 1.4)} ${r1(x + w)} ${r1(yy)}"`
    + ` stroke="${KANTE}" stroke-width="1" fill="none" opacity=".5" stroke-linecap="round"/>`;
  return `<g transform="rotate(${winkel} ${r1(x)} ${r1(y)})">`
    + `<path d="${d}" fill="${HAUT}" stroke="${KANTE}" stroke-width="2" stroke-linejoin="round"/>`
    + falte(y - laenge * 0.4, b * 0.7) + falte(y - laenge * 0.7, b * 0.58)
    + "</g>";
}

/* Die Finger stehen beim Winken deutlicher auseinander als beim
   Klatschen — eine gespreizte Hand winkt, eine geschlossene wischt. */
const FINGER = [
  { x: 34, l: 30, b: 10.4, w: -14 },
  { x: 46, l: 34, b: 10.8, w: -5 },
  { x: 58, l: 31, b: 10.2, w: 4 },
  { x: 69, l: 24, b: 8.8, w: 14 },
];
const KNOECHEL = 70;

const flaeche = `<path d="
    M28 ${KNOECHEL + 2}
    Q27 ${KNOECHEL - 5} 33 ${KNOECHEL - 5}
    L72 ${KNOECHEL - 5}
    Q77 ${KNOECHEL - 4} 76 ${KNOECHEL + 5}
    Q75 86 70 96
    Q65 104 53 104
    L46 104
    Q35 104 32 96
    Q27 85 28 ${KNOECHEL + 2} Z"
  fill="${HAUT}" stroke="${KANTE}" stroke-width="2.2" stroke-linejoin="round"/>`;

/* Der Daumen beginnt INNEN in der Fläche und schwingt nach aussen —
   dadurch gibt es keine gemeinsame Kante und nichts sieht angeklebt
   aus. Beim Winken zeigt er nach links oben, nicht nach unten. */
const daumen = `<path d="M34 72
      Q25 68 18 72
      Q11 77 13 84
      Q16 91 24 89
      Q32 86 36 79 Z"
    fill="${HAUT}" stroke="${KANTE}" stroke-width="2" stroke-linejoin="round"/>`;
const daumenFalte = `<path d="M33 71 Q30 75 29 80" stroke="${KANTE}" stroke-width="1.2"
    fill="none" opacity=".5" stroke-linecap="round"/>
  <path d="M17 80 Q22 78 27 79" stroke="${KANTE}" stroke-width="1" fill="none"
    opacity=".45" stroke-linecap="round"/>`;
const ballen = `<path d="M33 76 Q29 86 33 99 Q37 103 42 102 Q37 90 38 78 Z"
    fill="#d89a63" opacity=".45"/>`;
const linien = `
  <path d="M35 78 Q43 88 46 101" stroke="${KANTE}" stroke-width="1.2" fill="none" opacity=".35" stroke-linecap="round"/>
  <path d="M33 80 Q48 84 72 80" stroke="${KANTE}" stroke-width="1.1" fill="none" opacity=".28" stroke-linecap="round"/>`;
const gelenk = `<path d="M40 96 L62 96 Q64 108 63 120 L39 120 Q38 108 40 96 Z"
    fill="${HAUT}" stroke="${KANTE}" stroke-width="2" stroke-linejoin="round"/>`;
/* Ein Ärmel, damit die Hand nicht im Nichts endet. */
const aermel = `<path d="M36 110 L66 110 Q69 118 68 120 L34 120 Q33 116 36 110 Z"
    fill="#6aa6ee" stroke="rgba(40,70,110,.45)" stroke-width="2" stroke-linejoin="round"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
<style>
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
  .hand { animation: winken 0.9s ease-in-out infinite; transform-box: view-box; transform-origin: 50% 88%; }
  .str  { animation: strich 0.9s ease-in-out infinite; transform-box: view-box; transform-origin: 50% 50%; }
  @keyframes winken { 0%,100%{transform:rotate(-16deg)} 50%{transform:rotate(16deg)} }
  @keyframes strich { 0%,100%{opacity:.15; transform:translateX(-4px)} 50%{opacity:.85; transform:translateX(3px)} }
</style>
${aermel}
<g class="hand">
  ${gelenk}
  ${daumen}
  ${flaeche}
  ${ballen}
  ${daumenFalte}
  ${FINGER.map((f) => finger(f.x, KNOECHEL, f.l, f.b, f.w)).join("\n  ")}
  ${linien}
</g>
<g class="str">
  <path d="M14 30 Q20 24 26 30 M94 30 Q100 24 106 30" stroke="#f2b84b" stroke-width="3.4"
    fill="none" stroke-linecap="round"/>
  <path d="M10 44 Q17 37 24 44 M96 44 Q103 37 110 44" stroke="#f2b84b" stroke-width="3"
    fill="none" stroke-linecap="round" opacity=".7"/>
</g>
</svg>`;
fs.writeFileSync(__dirname + "/../sticker/winken.svg", svg);
console.log("geschrieben:", svg.length, "Zeichen");
