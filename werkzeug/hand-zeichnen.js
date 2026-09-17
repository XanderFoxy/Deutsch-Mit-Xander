/* ZEICHNET DIE KLATSCHENDEN HÄNDE NEU.
   GEMELDET: „Auch das Hände klatschen … das sieht nicht aus wie Hände,
   das sieht aus wie Handschuhe."

   Er hat recht, und man kann genau sagen, warum:
     * alle vier Finger waren gleich breit (9,5) und fast gleich lang,
     * sie standen senkrecht und parallel — kein Finger spreizt,
     * die Fingerkuppen waren Halbkreise mit demselben Radius,
     * die Handfläche war ein einziger glatter Klumpen ohne Ballen,
     * und die Furchen ZWISCHEN den Fingern waren unsichtbar, weil da
       stroke="46" stand — das ist keine Farbe, also zeichnet der
       Browser nichts. Ohne Furchen aber ist es ein Fäustling.

   Jetzt: vier verschieden lange und verschieden dicke Finger, jeder
   leicht gespreizt und zur Kuppe hin schmaler, mit zwei Gelenkfalten;
   Daumenballen und kleinfingerseitiger Ballen als eigene Wölbungen;
   Handfläche mit Lebenslinie und Herzlinie. */
const fs = require("fs");

const rund = (n) => Math.round(n * 10) / 10;

/* Ein Finger als Umriss: unten am Knöchel breit, zur Kuppe schmaler,
   Kuppe als Halbkreis. wurzel = Punkt am Knöchel, laenge nach oben. */
function finger(x, y, laenge, breite, winkel, farbe, kante) {
  const b = breite / 2, s = b * 0.78;      /* Kuppe ist schmaler */
  const spitze = y - laenge;
  const d = [
    `M${rund(x - b)} ${rund(y)}`,
    `L${rund(x - s)} ${rund(spitze + s)}`,
    `A${rund(s)} ${rund(s)} 0 0 1 ${rund(x + s)} ${rund(spitze + s)}`,
    `L${rund(x + b)} ${rund(y)}`,
    "Z",
  ].join(" ");
  /* Zwei Gelenkfalten — daran erkennt das Auge einen Finger. */
  const f1 = y - laenge * 0.42, f2 = y - laenge * 0.72;
  const falte = (yy, w) => `<path d="M${rund(x - w)} ${rund(yy)} Q${rund(x)} ${rund(yy + 1.6)} ${rund(x + w)} ${rund(yy)}" stroke="${kante}" stroke-width="1.1" fill="none" opacity=".55" stroke-linecap="round"/>`;
  return `<g transform="rotate(${winkel} ${rund(x)} ${rund(y)})">`
    + `<path d="${d}" fill="${farbe}" stroke="${kante}" stroke-width="1.9" stroke-linejoin="round"/>`
    + falte(f1, b * 0.72) + falte(f2, b * 0.6)
    + `</g>`;
}

/* Eine ganze Hand, von der Seite gesehen wie beim Klatschen:
   Handfläche leicht schräg, Daumen nach vorn. */
function hand(farbe, kante, schatten) {
  const knoechel = 68;
  /* Vier Finger, dicht beieinander und leicht gespreizt. Der
     Mittelfinger ist der laengste, der kleine Finger deutlich kuerzer
     und duenner — genau daran erkennt das Auge eine Hand und keinen
     Faeustling. */
  const daten = [
    { x: 33.0, l: 27, b: 9.6, w: -8 },
    { x: 42.5, l: 31, b: 10.0, w: -3 },
    { x: 52.0, l: 28, b: 9.4, w:  3 },
    { x: 61.0, l: 22, b: 8.2, w:  9 },
  ];
  const finger4 = daten.map((f) => finger(f.x, knoechel, f.l, f.b, f.w, farbe, kante)).join("");

  /* Handgelenk zuerst und unter die Flaeche geschoben, sonst sieht es
     aus wie ein angeklebter Klotz. */
  const gelenk = `<path d="M38 92 L58 92 Q60 104 59 118 L37 118 Q36 104 38 92 Z"
      fill="${farbe}" stroke="${kante}" stroke-width="2" stroke-linejoin="round"/>`;

  /* Der Daumen liegt AUSSERHALB der Handflaeche, sonst sieht man ihn
     nicht — das war der Fehler im ersten Anlauf. */
  /* Der Daumen liegt eng am Ballen und zeigt nach unten — im ersten
     Anlauf stand er waagerecht ab, dann trafen sich beide Daumen in
     der Mitte zu einem Klumpen. */
  const daumen = `<path d="M32 74 Q23 77 19 85 Q16 93 21 97 Q26 100 30 94 Q33 87 34 79 Z"
      fill="${farbe}" stroke="${kante}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M21 88 Q25 86 29 87" stroke="${kante}" stroke-width="1.1" fill="none" opacity=".5" stroke-linecap="round"/>`;

  const flaeche = `<path d="
      M28 ${knoechel + 2}
      Q27 ${knoechel - 4} 32 ${knoechel - 4}
      L66 ${knoechel - 4}
      Q70 ${knoechel - 3} 69 ${knoechel + 5}
      Q68 84 64 93
      Q60 100 50 100
      L44 100
      Q34 100 31 93
      Q27 83 28 ${knoechel + 2} Z"
    fill="${farbe}" stroke="${kante}" stroke-width="2.1" stroke-linejoin="round"/>`;

  /* Die Woelbung unter dem Daumen — ohne sie ist die Flaeche ein Brett. */
  const ballen = `<path d="M32 74 Q28 84 32 96 Q36 100 41 99 Q36 87 37 76 Z"
      fill="${schatten}" opacity=".5"/>`;
  const linien = `
    <path d="M34 76 Q42 86 45 98" stroke="${kante}" stroke-width="1.2" fill="none" opacity=".38" stroke-linecap="round"/>
    <path d="M32 78 Q46 82 66 78" stroke="${kante}" stroke-width="1.1" fill="none" opacity=".3" stroke-linecap="round"/>
    <path d="M34 85 Q48 89 64 85" stroke="${kante}" stroke-width="1" fill="none" opacity=".26" stroke-linecap="round"/>`;
  return gelenk + daumen + flaeche + ballen + finger4 + linien;
}

const KANTE = "rgba(120,70,30,.55)";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
<style>
  .li, .re { transform-box: view-box; transform-origin: 50% 50%; }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
  .li { animation: kli 0.42s ease-in-out infinite; }
  .re { animation: kre 0.42s ease-in-out infinite; }
  .fz { animation: fz 0.42s ease-out infinite; }
  @keyframes kli { 0%,100%{transform:translateX(-20px) rotate(-11deg)} 48%{transform:translateX(-2px) rotate(2deg)} }
  @keyframes kre { 0%,100%{transform:translateX(20px) rotate(11deg)} 48%{transform:translateX(2px) rotate(-2deg)} }
  @keyframes fz { 0%,44%{opacity:0} 56%{opacity:.95} 100%{opacity:0} }
</style>
<g class="li"><g transform="translate(120 0) scale(-1 1)"><g transform="translate(60 62) scale(.8) translate(-46 -79.5)">${hand("#f3b57b", KANTE, "#d89a63")}</g></g></g>
<g class="re"><g transform="translate(60 62) scale(.8) translate(-46 -79.5)">${hand("#e8a768", KANTE, "#cf8d55")}</g></g>
<g class="fz" opacity="0"><path d="M60 22 L60 8 M40 28 L31 15 M80 28 L89 15 M24 48 L9 42 M96 48 L111 42" stroke="#f7c948" stroke-width="4" stroke-linecap="round"/></g>
</svg>`;
fs.writeFileSync("/home/user/Deutsch-Mit-Xander/sticker/klatschen.svg", svg);
console.log("geschrieben:", svg.length, "Zeichen");
