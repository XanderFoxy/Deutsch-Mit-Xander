#!/usr/bin/env node
/* =====================================================================
   BEIDE HÄNDE AUS EINEM GUSS — WINKEN UND KLATSCHEN
   ---------------------------------------------------------------------
   GEMELDET: „Der Daumen von der winkenden Hand ist noch nicht
   realistisch, und die klatschenden Hände sehen somit auch nicht
   natürlich aus — die sind immer noch verschachtelt. Da ist unten
   immer noch so eine Box. Bei der winkenden Hand geht es
   einigermassen, aber unten soll nicht eine abgetrennte Box und dann
   die aufgestellten Dinger sein. Das sind kleine Holzhände. Das sind
   natürliche Hände. Die haben zwar auch in der Natur ihre Konturen,
   aber nicht so auffällig, dass sie aussehen wie Roboter oder hölzern."

   ER HAT DEN BAUFEHLER BESCHRIEBEN, NICHT NUR DEN EINDRUCK.
   Bisher war jede Hand aus EINZELTEILEN zusammengesetzt: eine Fläche
   („die Box"), darauf vier Finger („die aufgestellten Dinger"), daneben
   ein Daumen — jedes Teil mit eigener, voll deckender Umrisslinie. Zwei
   Umrisse, die aneinanderstossen, ergeben eine sichtbare Fuge. Fugen
   zwischen Körperteilen gibt es an einer Holzpuppe, nicht an einer Hand.

   Deshalb wird jede Hand jetzt als EIN EINZIGER UMRISS gezeichnet:
   ein Pfad, der am Handgelenk anfängt, an der Daumenseite hinaufläuft,
   um den Daumen herum, durch die Schwimmhaut, um jeden Finger herum,
   in jede Fingerfurche hinein und an der Kleinfingerseite wieder
   hinunter. Es gibt keine Fuge mehr, weil es keine zweite Kante gibt.

   Was INNEN liegt — Gelenkfalten, Handlinien, Ballen — ist nur noch
   angedeutet: dünne Striche mit 25 bis 45 Prozent Deckung. „Die haben
   in der Natur ihre Konturen, aber nicht so auffällig."

   Aufruf:  node werkzeug/haende-zeichnen.js
   ===================================================================== */
const fs = require("fs");
const path = require("path");

const r = (n) => Math.round(n * 100) / 100;
const HAUT_HELL = "#f6c79a";
const HAUT = "#f0b077";
const HAUT_TIEF = "#d89a63";
const KANTE = "rgba(150,95,50,.42)";   // weich, nicht schwarz
const FALTE = "rgba(150,95,50,.30)";

/* --- Ein Finger als Umriss-Stück ---------------------------------
   Geliefert werden nur die beiden Seiten und die Kuppe; die Stücke
   werden nachher zu EINEM Pfad zusammengesetzt. */
function fingerSeiten(basis, winkel, laenge, breiteUnten, breiteOben) {
  const a = (winkel * Math.PI) / 180;
  const dx = Math.sin(a), dy = -Math.cos(a);     // Richtung zur Kuppe
  const nx = Math.cos(a), ny = Math.sin(a);      // quer dazu
  const wu = breiteUnten / 2, wo = breiteOben / 2;
  const spitze = { x: basis.x + dx * (laenge - wo), y: basis.y + dy * (laenge - wo) };
  return {
    linksUnten:  { x: basis.x - nx * wu, y: basis.y - ny * wu },
    linksOben:   { x: spitze.x - nx * wo, y: spitze.y - ny * wo },
    rechtsOben:  { x: spitze.x + nx * wo, y: spitze.y + ny * wo },
    rechtsUnten: { x: basis.x + nx * wu, y: basis.y + ny * wu },
    spitze: spitze, wo: wo, dx: dx, dy: dy, nx: nx, ny: ny
  };
}

/* --- Eine ganze Hand als EIN Pfad --------------------------------
   Reihenfolge: Handgelenk (Daumenseite) → Daumen → Schwimmhaut →
   Zeigefinger → Furche → Mittelfinger → Furche → Ringfinger →
   Furche → kleiner Finger → Kleinfingerseite → zurück zum Gelenk. */
function handUmriss(f) {
  const finger = f.finger.map((x) =>
    fingerSeiten({ x: x.x, y: f.knoechel + (x.tiefer || 0) }, x.w, x.l, x.b, x.b * 0.82));
  const daumen = fingerSeiten({ x: f.daumen.x, y: f.daumen.y }, f.daumen.w,
    f.daumen.l, f.daumen.b, f.daumen.b * 0.86);

  const p = [];
  const M = (q) => p.push("M" + r(q.x) + " " + r(q.y));
  const L = (q) => p.push("L" + r(q.x) + " " + r(q.y));
  const Q = (c, q) => p.push("Q" + r(c.x) + " " + r(c.y) + " " + r(q.x) + " " + r(q.y));
  const A = (rad, q) => p.push("A" + r(rad) + " " + r(rad) + " 0 0 1 " + r(q.x) + " " + r(q.y));

  /* Handgelenk, Daumenseite unten */
  M({ x: f.gelenk.links, y: f.gelenk.y });
  /* Ballen der Daumenseite hinauf zum Daumen */
  Q({ x: f.gelenk.links - 3, y: f.gelenk.y - 14 }, daumen.linksUnten);
  /* Um den Daumen herum */
  L(daumen.linksOben);
  A(daumen.wo, daumen.rechtsOben);
  L(daumen.rechtsUnten);
  /* Die Schwimmhaut: eine tiefe, weiche Bucht zum Zeigefinger.
     Genau hier sah es bisher angeklebt aus. */
  Q({ x: (daumen.rechtsUnten.x + finger[0].linksUnten.x) / 2 + f.haut.dx,
      y: (daumen.rechtsUnten.y + finger[0].linksUnten.y) / 2 + f.haut.dy },
    finger[0].linksUnten);
  /* Die vier Finger mit ihren Furchen */
  finger.forEach((fi, i) => {
    L(fi.linksOben);
    A(fi.wo, fi.rechtsOben);
    L(fi.rechtsUnten);
    const naechster = finger[i + 1];
    if (naechster) {
      /* Die Furche geht ein Stück IN die Hand hinein — sonst stossen
         zwei gerade Kanten aneinander, und das sieht aus wie Bretter. */
      const mx = (fi.rechtsUnten.x + naechster.linksUnten.x) / 2;
      const my = Math.max(fi.rechtsUnten.y, naechster.linksUnten.y) + f.furche;
      Q({ x: mx, y: my }, naechster.linksUnten);
    }
  });
  /* Kleinfingerseite hinunter und um den Handballen herum */
  const letzter = finger[finger.length - 1];
  Q({ x: letzter.rechtsUnten.x + 6, y: letzter.rechtsUnten.y + 16 },
    { x: f.gelenk.rechts + 2, y: f.gelenk.y - 16 });
  Q({ x: f.gelenk.rechts + 1, y: f.gelenk.y - 4 }, { x: f.gelenk.rechts, y: f.gelenk.y });
  p.push("Z");
  return { d: p.join(" "), finger: finger, daumen: daumen };
}

/* --- Angedeutete Falten, keine Umrisse --------------------------- */
function falten(u, f) {
  const s = [];
  u.finger.forEach((fi, i) => {
    const b = f.finger[i];
    [0.42, 0.72].forEach((t, k) => {
      const mx = fi.linksUnten.x + fi.dx * b.l * t;
      const my = fi.linksUnten.y + fi.dy * b.l * t;
      const w = (b.b / 2) * (0.76 - k * 0.1);
      s.push('<path d="M' + r(mx - fi.nx * w) + " " + r(my - fi.ny * w)
        + " Q" + r(mx + fi.dx * 1.6) + " " + r(my + fi.dy * 1.6) + " "
        + r(mx + fi.nx * w) + " " + r(my + fi.ny * w)
        + '" stroke="' + FALTE + '" stroke-width="1" fill="none" stroke-linecap="round"/>');
    });
  });
  /* Handlinien — nur drei, dünn, und keine schliesst sich. */
  f.linien.forEach((d) => {
    s.push('<path d="' + d + '" stroke="' + FALTE + '" stroke-width="1.1" fill="none"'
      + ' opacity=".8" stroke-linecap="round"/>');
  });
  return s.join("\n  ");
}

function handSvg(f, id) {
  const u = handUmriss(f);
  return ''
    + '<defs>'
    + '<radialGradient id="haut' + id + '" cx="38%" cy="30%" r="78%">'
    + '<stop offset="0" stop-color="' + HAUT_HELL + '"/>'
    + '<stop offset="0.62" stop-color="' + HAUT + '"/>'
    + '<stop offset="1" stop-color="' + HAUT_TIEF + '"/>'
    + "</radialGradient></defs>"
    /* EIN Pfad. Keine Fuge. */
    + '<path d="' + u.d + '" fill="url(#haut' + id + ')" stroke="' + KANTE
    + '" stroke-width="1.6" stroke-linejoin="round"/>'
    /* Der Daumenballen als weiche Woelbung — ohne eigene Kante. */
    + '<path d="' + f.ballen + '" fill="' + HAUT_TIEF + '" opacity=".28"/>'
    + "\n  " + falten(u, f);
}

/* --- Die winkende Hand ------------------------------------------- */
const WINKEN = {
  knoechel: 70,
  furche: 7,
  gelenk: { links: 34, rechts: 74, y: 112 },
  haut: { dx: -2, dy: 9 },
  daumen: { x: 33, y: 78, w: -68, l: 27, b: 14 },
  finger: [
    { x: 41, l: 31, b: 11.6, w: -15 },
    { x: 52, l: 35, b: 12.0, w: -4 },
    { x: 63, l: 32, b: 11.4, w: 6 },
    { x: 73, l: 25, b: 10.0, w: 17, tiefer: 3 }
  ],
  ballen: "M38 80 Q32 92 37 106 Q43 110 49 107 Q42 94 44 82 Z",
  linien: [
    "M40 84 Q50 94 54 108",
    "M38 88 Q54 92 72 87",
    "M44 96 Q56 99 70 96"
  ]
};

/* --- Die klatschenden Hände --------------------------------------
   Zwei Spiegelbilder, die sich in der Mitte treffen. Sie sind etwas
   kürzer und die Finger stehen enger — eine klatschende Hand ist
   geschlossen, eine winkende gespreizt. */
const KLATSCHEN = {
  knoechel: 62,
  furche: 6,
  gelenk: { links: 32, rechts: 70, y: 104 },
  haut: { dx: -1, dy: 8 },
  daumen: { x: 32, y: 72, w: -74, l: 24, b: 13 },
  finger: [
    { x: 40, l: 30, b: 11.2, w: -7 },
    { x: 50, l: 33, b: 11.6, w: -2 },
    { x: 60, l: 30, b: 11.0, w: 3 },
    { x: 69, l: 23, b: 9.6, w: 10, tiefer: 3 }
  ],
  ballen: "M37 72 Q31 84 36 98 Q42 102 48 99 Q41 86 43 74 Z",
  linien: [
    "M39 76 Q49 86 53 100",
    "M37 80 Q53 84 68 79",
    "M43 88 Q55 91 66 88"
  ]
};

const winken = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">'
  + "\n<style>"
  + "\n  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }"
  + "\n  .hand { animation: winken 0.9s ease-in-out infinite; transform-box: view-box; transform-origin: 54% 92%; }"
  + "\n  .str  { animation: strich 0.9s ease-in-out infinite; transform-box: view-box; transform-origin: 50% 50%; }"
  + "\n  @keyframes winken { 0%,100%{transform:rotate(-15deg)} 50%{transform:rotate(15deg)} }"
  + "\n  @keyframes strich { 0%,100%{opacity:.15; transform:translateX(-4px)} 50%{opacity:.85; transform:translateX(3px)} }"
  + "\n</style>"
  /* Der Ärmel liegt UNTER der Hand und ragt nicht in sie hinein —
     sonst wäre er die nächste sichtbare Fuge. */
  + '\n<path d="M36 104 L72 104 Q75 114 74 120 L34 120 Q33 112 36 104 Z"'
  + ' fill="#6aa6ee" stroke="rgba(40,70,110,.35)" stroke-width="1.6" stroke-linejoin="round"/>'
  + '\n<g class="hand">\n  ' + handSvg(WINKEN, "w") + "\n</g>"
  + '\n<g class="str">'
  + '\n  <path d="M14 30 Q20 24 26 30 M94 30 Q100 24 106 30" stroke="#f2b84b" stroke-width="3.4"'
  + ' fill="none" stroke-linecap="round"/>'
  + '\n  <path d="M10 44 Q17 37 24 44 M96 44 Q103 37 110 44" stroke="#f2b84b" stroke-width="3"'
  + ' fill="none" stroke-linecap="round" opacity=".7"/>'
  + "\n</g>\n</svg>";

/* ZWEI HAENDE MUESSEN ZWEI HAENDE BLEIBEN.
   Der erste Entwurf legte sie so dicht uebereinander, dass die
   hintere fast verschwand — fotografiert sah es aus wie EINE Hand
   mit einem Daumen an der falschen Seite. Jetzt stehen sie weiter
   auseinander, sind gegeneinander geneigt und treffen sich erst in
   der Bewegung; ausserdem sitzt die hintere ein Stueck tiefer, so
   wie beim wirklichen Klatschen. */
const klatschen = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 130" width="220" height="130">'
  + "\n<style>"
  + "\n  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }"
  /* ZWEI GRUPPEN JE HAND — UND DAS IST KEIN SCHMUCK.
     Der Fehler, der drei Anlaeufe gekostet hat: eine CSS-Animation,
     die „transform" setzt, ERSETZT das transform-Attribut desselben
     Elements. Standen Stellung und Bewegung an derselben Gruppe,
     sprang die Hand in dem Augenblick, in dem die Animation anlief,
     auf ihre unverschobene Stelle zurueck — und dort lagen beide
     Haende uebereinander. Fotografiert sah das aus wie EINE Hand mit
     einem Daumen an der falschen Seite.
     Aussen steht deshalb die STELLUNG (Attribut), innen die BEWEGUNG
     (CSS). Zwei Gruppen, kein Streit. */
  + "\n  .l { animation: klatschL 0.62s ease-in-out infinite; transform-box: view-box; transform-origin: 26% 92%; }"
  + "\n  .r { animation: klatschR 0.62s ease-in-out infinite; transform-box: view-box; transform-origin: 74% 92%; }"
  + "\n  .funk { animation: funk 0.62s ease-out infinite; transform-box: view-box; transform-origin: 50% 44%; }"
  /* WIE WEIT SIE SICH TREFFEN.
     Fotografiert: gingen sie bis auf null zusammen, lagen zwei
     Handflaechen exakt uebereinander und es sah aus wie EINE Hand.
     Zwei Handflaechen koennen einander aber nicht durchdringen. Der
     Die Ruhelage liegt deshalb elf Pixel auseinander, und im
     Anschlag beruehren sie sich genau: die Grundstellung ist so
     gesetzt (gemessen am getBBox der Zeichnung), dass sich die
     beiden Handflaechen dort gerade treffen und nicht ineinander
     verschwinden. */
  + "\n  @keyframes klatschL { 0%,100%{transform:translateX(-11px) rotate(-6deg)} 46%{transform:translateX(0) rotate(0)} 54%{transform:translateX(-2px) rotate(-1deg)} }"
  + "\n  @keyframes klatschR { 0%,100%{transform:translateX(11px) rotate(6deg)} 46%{transform:translateX(0) rotate(0)} 54%{transform:translateX(2px) rotate(1deg)} }"
  + "\n  @keyframes funk { 0%,42%{opacity:0; transform:scale(.4)} 52%{opacity:.95; transform:scale(1)} 100%{opacity:0; transform:scale(1.5)} }"
  + "\n</style>"
  + '\n<g transform="translate(26 10) rotate(-24 43 66)"><g class="l">\n  '
  + handSvg(KLATSCHEN, "a") + "\n</g></g>"
  /* Die zweite Hand ist das Spiegelbild der ersten — dieselbe
     Zeichnung, nicht eine zweite, die „ungefähr gleich" aussieht. */
  + '\n<g transform="translate(108 10) rotate(24 43 66) translate(86 0) scale(-1 1)"><g class="r">\n  '
  + handSvg(KLATSCHEN, "b") + "\n</g></g>"
  + '\n<g class="funk">'
  + '\n  <path d="M110 26 L110 12 M93 32 L84 22 M127 32 L136 22 M88 46 L74 42 M132 46 L146 42"'
  + ' stroke="#f2b84b" stroke-width="3.2" stroke-linecap="round" fill="none"/>'
  + "\n</g>\n</svg>";

fs.writeFileSync(path.join(__dirname, "..", "sticker", "winken.svg"), winken);
fs.writeFileSync(path.join(__dirname, "..", "sticker", "klatschen.svg"), klatschen);
console.log("winken.svg   ", winken.length, "Zeichen");
console.log("klatschen.svg", klatschen.length, "Zeichen");
