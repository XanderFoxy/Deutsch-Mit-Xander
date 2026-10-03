#!/usr/bin/env node
/* =====================================================================
   RIO DE JANEIRO — COPACABANA (FASSUNG 854) — Bilderwelt neu
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekanntesten Städte in anderen Ländern, die
   berühmt für irgendetwas sind … als Profi-Grafikdesigner auf
   Hollywood-Niveau … mit größter Sorgfalt und Präzision“.

   RECHERCHE (Lagepläne der Zona Sul, Koordinaten der Gipfel, Fotos vom
   Calçadão bei Posto 5, Daten zum Cristo Redentor, Orla-Rio-Kioske):
   - STANDORT: Copacabana, Höhe Posto 5, auf dem Sand direkt vor dem
     Calçadão. Blick nach NORDOSTEN den Strand entlang. Am Ende der
     Bucht der Hügel LEME (Morro do Leme, oben das alte Fort Duque de
     Caxias), links davon der Morro da BABILÔNIA mit den Favelas
     Babilônia und Chapéu Mangueira. Vom Posto 5 aus liegt der ZUCKER-
     HUT fast genau hinter Leme (Peilung ≈ 39°, 5,3 km): nur seine
     obere Kuppe schaut hinter den Hügeln hervor. Die Seilbahn fährt auf
     der Buchtseite (Praia Vermelha – Urca – Gipfel) und ist von hier
     verdeckt – darum ist sie nicht gezeichnet.
   - Der CORCOVADO (710 m) mit dem CRISTO REDENTOR liegt in Wirklichkeit
     links (Nordnordwest, Peilung ≈ −30°, 4,4 km) hinter den Häusern der
     Avenida Atlântica. Das Bild ist ein Panorama nach Himmelsrichtungen:
     Corcovado links, Leme/Zuckerhut rechts; die fernen Berge sind wie
     mit einem Teleobjektiv etwas größer gezeichnet.
   - Cristo Redentor: 30 m hoch auf 8 m Sockel (im Sockel eine Kapelle),
     Armspanne 28 m, Stahlbeton, außen ein Mosaik aus Tausenden kleiner
     dreieckiger Specksteinplättchen, Art déco (Paul Landowski, Heitor da
     Silva Costa, Gesicht Gheorghe Leonida), eingeweiht am 12.10.1931.
     Die Statue schaut nach OSTEN (zur Bucht): von der Copacabana (Süd-
     südost) sieht man sie schräg von vorn rechts – die Arme wirken
     darum etwas kürzer. Glatte Gewandfalten, Kordel um die Taille, ein
     Herz auf der Brust, weite Ärmel, die unter den Armen herabhängen.
   - Der Zuckerhut (Pão de Açúcar, 396 m): kahler Granit-Monolith mit
     dunklen Regenstreifen, oben bewachsen. Vormittags steht die Sonne im
     Nordosten über dem Meer (Südhalbkugel: Mittagssonne im Norden) – der
     Zuckerhut steht darum etwas im Gegenlicht, die Häuserfronten und der
     Cristo (schaut nach Osten) sind hell beleuchtet. Schatten fallen
     nach links vorn.
   - CALÇADÃO: portugiesisches Pflaster aus schwarzem Basalt und weißem
     Kalkstein; seit Burle Marx (1970) laufen die großen Wellen PARALLEL
     zum Meer. 4 km lang. Daneben die Avenida Atlântica (zwei Fahrbahnen,
     Mittelstreifen) und die Reihe der 10–14-stöckigen Wohnhäuser.
   - KIOSK (Orla Rio): runder Glaspavillon mit weißem Flachdach auf dem
     Calçadão am Sandrand; es gibt „coco gelado“ (eiskalte grüne Kokos-
     nuss mit Strohhalm), Açaí (gefrorenes lila Beerenmus mit Müsli und
     Banane) und „Mate gelado com limão“ (kalter Mate-Tee mit Zitrone).
   - TAXIS in Rio sind gelb mit einem blauen Streifen an der Seite.
   - Am Strand: Klappstühle und Sonnenschirme der Strandbuden, Havaianas
     (Flipflops), Kinder spielen „Altinha“ (den Ball in der Luft halten),
     Samba mit dem Pandeiro (Tamburin). Brasiliens Flagge: grün, gelbe
     Raute, blaue Himmelskugel mit 27 Sternen, Band „ORDEM E PROGRESSO“.
   BLICK: Augenhöhe 1,6 m, Horizont y = 100, Fluchtpunkt des Calçadão
   (212 | 100). Einheiten je Meter am Boden: s(y) = (y − 100) / 1,6
   (Kiosk y 134: 21 → 2,6 m breit = 55; Junge y 186: 54 → 1,34 m = 72).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "rio", titel: "Rio de Janeiro", emoji: "🌴", thema: "Länder", kuerzel: "rio", fassung: 854 });
const rnd = zufall(1565);
const r = B.r;
const HY = 100, VX = 212;
const sy = (y) => (y - HY) / 1.6;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const knapp = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);
const pts = (a) => a.map(([x, y]) => `${r(x)} ${r(y)}`).join(" L");
B.mensch({}, 10);

/* Bodenpunkt (seitlich X Meter, Tiefe Z Meter) → Bild (f = 175) */
const F = 175;
const boden = (X, Z) => [VX + F * X / Z, HY + F * 1.6 / Z];

/* ---------- Stoffe ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="1.6"/></filter>`);
S.def(`<pattern id="${S.id("wald")}" width="4" height="3" patternUnits="userSpaceOnUse"><rect width="4" height="3" fill="#356b45"/><circle cx="1" cy="1" r="1.1" fill="#3f7a4e"/><circle cx="3" cy="2.2" r="1.2" fill="#2e5f3c"/><circle cx="3.2" cy=".4" r=".7" fill="#4a8758"/><circle cx=".6" cy="2.6" r=".6" fill="#2a5636"/></pattern>`);
S.def(`<pattern id="${S.id("mosaik")}" width=".5" height=".44" patternUnits="userSpaceOnUse"><rect width=".5" height=".44" fill="#ece8dc"/><path d="M0 .44 L.25 0 L.5 .44 Z" fill="#dcd6c6"/><path d="M0 .44 L.25 0" stroke="#bdb5a2" stroke-width=".03"/></pattern>`);
const WALD = `url(#${S.id("wald")})`;
const MOSAIK = `url(#${S.id("mosaik")})`;
const DUNST = `url(#${S.id("dunst")})`;

/* =====================================================================
   KULISSE — Himmel, Sonne (vorn rechts, über dem Meer), Wolken, Vögel
   ===================================================================== */
{
  let k = `<rect width="320" height="101" fill="${S.lg("himmel", [[0, "#2a6fbd"], [0.45, "#5aa0d8"], [0.82, "#a6d3ec"], [1, "#d9eef3"]])}"/>`;
  k += `<rect width="320" height="101" fill="${S.rg("sonne", [[0, "#fff9dc", 0.95], [0.18, "#fff3c4", 0.55], [0.55, "#fff3c4", 0.12], [1, "#fff3c4", 0]], 0.98, 0.02, 0.75)}"/>`;
  /* Haufenwolken über den Bergen, weich */
  for (const [x, y, w] of [[150, 40, 18], [172, 34, 12], [192, 44, 14], [128, 30, 9], [262, 22, 16], [284, 30, 10]]) {
    k += `<ellipse cx="${x}" cy="${y + 2}" rx="${w * 1.3}" ry="${r(w * 0.22)}" fill="#c9d7e2" opacity=".55" filter="${DUNST}"/>`;
    for (let i = 0; i < 4; i++) k += `<circle cx="${r(x - w * 0.7 + i * w * 0.46)}" cy="${r(y - Math.sin((i + 0.5) / 4 * Math.PI) * w * 0.32)}" r="${r(w * (0.3 + 0.12 * Math.sin((i + 0.5) / 4 * Math.PI)))}" fill="#fbfdff" opacity=".85" filter="${DUNST}"/>`;
  }
  /* Fregattvögel (lange, abgewinkelte Flügel, gegabelter Schwanz) */
  for (const [x, y, s] of [[146, 16, 1], [168, 24, 0.75], [250, 12, 0.6]]) {
    k += `<path d="M${x - 6 * s} ${r(y - 1.2 * s)} L${r(x - 2.6 * s)} ${r(y + 0.4 * s)} L${x} ${y} L${r(x + 2.6 * s)} ${r(y + 0.4 * s)} L${x + 6 * s} ${r(y - 1.2 * s)} M${x} ${y} l${r(-0.5 * s)} ${r(2 * s)} M${x} ${y} l${r(0.5 * s)} ${r(2 * s)}" stroke="#2a2a33" stroke-width="${r(0.55 * s)}" fill="none" stroke-linejoin="round"/>`;
  }
  /* ferner Horizontdunst über dem Meer */
  k += `<rect x="150" y="96" width="170" height="4.4" fill="#e9f3f2" opacity=".5"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DER REGENWALD (Tijuca-Massiv hinter der Copacabana)
   ===================================================================== */
{
  const umriss = [[18, 104], [24, 70], [34, 58], [46, 50], [60, 44], [72, 40], [86, 33], [96, 36], [108, 44], [118, 48], [130, 47], [142, 52], [152, 60], [160, 68], [168, 76], [174, 86], [178, 104]];
  let k = `<path d="M${pts(umriss)} Z" fill="${WALD}"/>`;
  /* Luftperspektive: oben bläulicher, Licht von rechts */
  k += `<path d="M${pts(umriss)} Z" fill="${S.lg("waldluft", [[0, "#9cc0c8", 0.45], [0.5, "#7fa8a6", 0.22], [1, "#3c6a4a", 0.05]])}"/>`;
  k += `<path d="M${pts(umriss)} Z" fill="${S.lg("waldlicht", [[0, "#000", 0.12], [0.6, "#000", 0], [1, "#f6f0c8", 0.12]], 0, 0, 1, 0)}"/>`;
  /* Baumkronen am Grat */
  for (let i = 0; i < umriss.length - 1; i++) {
    const [x1, y1] = umriss[i], [x2, y2] = umriss[i + 1];
    for (let t = 0; t < 1; t += 0.34) k += `<circle cx="${r(x1 + (x2 - x1) * t)}" cy="${r(y1 + (y2 - y1) * t + 0.5)}" r="${r(0.9 + rnd() * 0.7)}" fill="${rnd() < 0.5 ? "#4d8059" : "#3d7049"}"/>`;
  }
  /* Granitplatten an steilen Stellen */
  for (const [x, y, w, h] of [[120, 54, 5, 7], [138, 58, 4, 5], [40, 60, 3, 6]]) k += `<path d="M${x} ${y} q${w / 2} -1 ${w} 0 l-.6 ${h} q-${w / 2} 1 -${w - 1} 0 Z" fill="#8f938f" opacity=".7"/>`;
  S.teil({ id: "regenwald", de: "der Regenwald", syl: "RE-gen-wald", it: "la foresta pluviale", itSyl: "fo-RE-sta plu-VIA-le", en: "rainforest", x: 98, y: 104, kunst: um(98, 104, k),
    tipp: "Mitten in Rio wächst der Tijuca-Wald. Er ist einer der größten Stadtwälder der Welt." });
}

/* =====================================================================
   2 — DER BERG (Corcovado: links bewaldet, rechts die Granitwand)
   ===================================================================== */
const CX = 88, CY = 26.5;   /* Gipfelplattform */
{
  const um1 = [[50, 76], [58, 64], [66, 52], [74, 41], [80, 32], [84, 27.4], [92, 27.4], [95, 31], [98, 40], [100, 52], [102, 62], [106, 70], [114, 76]];
  let k = `<path d="M${pts(um1)} Z" fill="${WALD}"/>`;
  k += `<path d="M${pts(um1)} Z" fill="${S.lg("corcluft", [[0, "#a9c9cf", 0.38], [1, "#3c6a4a", 0.05]])}"/>`;
  /* die Felswand nach Osten (rechts), von der Morgensonne beschienen */
  const wand = [[86, 28], [92, 27.6], [95, 31], [98, 40], [100, 52], [102, 62], [100, 66], [97, 56], [94, 44], [90, 34]];
  k += `<path d="M${pts(wand)} Z" fill="${S.lg("granit", [[0, "#8d8a84"], [0.55, "#b9b3a6"], [1, "#d8d0bf"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 9; i++) { const x = 89.5 + i * 1.2, y = 31 + i * 1.6; k += `<path d="M${r(x)} ${r(y)} q.6 ${r(6 + rnd() * 6)} ${r(0.4 + rnd())} ${r(12 + rnd() * 8)}" stroke="#6d6a64" stroke-width="${r(0.25 + rnd() * 0.3)}" fill="none" opacity=".55"/>`; }
  /* Wald an der linken Flanke etwas dunkler (Schatten) */
  k += `<path d="M50 76 L58 64 L66 52 L74 41 L80 32 L84 27.4 L86 28 L90 34 L88 50 L84 76 Z" fill="#1f3f2a" opacity=".22"/>`;
  for (let i = 0; i < 16; i++) { const t = rnd(), x = 52 + t * 34, y = 75 - t * 46 + rnd() * 5; k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.8 + rnd() * 0.6)}" fill="#4a7d55" opacity=".8"/>`; }
  S.teil({ id: "berg", de: "der Berg", syl: "BERG", it: "la montagna", itSyl: "mon-TA-gna", en: "mountain", x: CX, y: 76, kunst: um(CX, 76, k),
    tipp: "Der Berg heißt Corcovado – „der Bucklige“. Er ist 710 Meter hoch." });
}

/* =====================================================================
   3 — DIE CHRISTUSSTATUE (Cristo Redentor) — Lupe: Arm, Sockel,
       Mosaik, Aussichtsplattform
   ===================================================================== */
{
  const L = S.lg("cristoL", [[0, "#cfc9ba"], [0.45, "#ebe7dc"], [1, "#fbf9f2"]], 0, 0, 1, 0);
  let k = "";
  /* Aussichtsplattform auf dem Gipfel: Terrassenmauer, Geländer, Besucher */
  k += `<path d="M-6 1.6 L-5.4 0 L5.6 0 L6.4 1.6 Z" fill="${S.lg("terrasse", [[0, "#d8d2c4"], [1, "#a8a294"]])}"/>`;
  k += `<rect x="-5.4" y="-.5" width="11" height=".5" fill="#efece3"/>`;
  for (let x = -5.2; x <= 5.4; x += 0.7) k += `<rect x="${r(x)}" y="-.5" width=".12" height=".5" fill="#9a958a"/>`;
  for (const [x, c] of [[-4.4, "#d24a3c"], [-3.6, "#2f6fb0"], [3.4, "#f0c040"], [4.2, "#3a8a4a"], [-2.6, "#ffffff"]]) k += `<rect x="${x}" y="-.95" width=".32" height=".75" rx=".1" fill="${c}"/><circle cx="${r(x + 0.16)}" cy="-1.1" r=".16" fill="#6b4a32"/>`;
  /* Sockel: Art-déco-Block, oben gestuft, senkrechte Rillen, Kapellentür */
  k += `<path d="M-1.4 0 L-1.2 -2.7 L1.2 -2.7 L1.4 0 Z" fill="${L}"/>`;
  k += `<rect x="-1.45" y="-3.2" width="2.9" height=".55" fill="#f4f1e8"/><rect x="-1.25" y="-3.5" width="2.5" height=".32" fill="#e3ded1"/>`;
  for (const x of [-0.8, -0.4, 0.4, 0.8]) k += `<line x1="${x}" y1="-2.5" x2="${r(x * 1.08)}" y2="-.2" stroke="#b4ad9d" stroke-width=".07"/>`;
  k += `<path d="M-.25 0 L-.25 -.9 Q0 -1.15 .25 -.9 L.25 0 Z" fill="#5a5144"/>`;
  /* Gewand: schmal, unten etwas weiter, senkrechte Falten (leicht nach rechts gedreht) */
  const robe = `M-1.05 -3.5 L-1.2 -7.6 Q-1.25 -10.4 -1.05 -11.2 L1.25 -11.2 Q1.35 -10.4 1.3 -7.6 L1.15 -3.5 Z`;
  k += `<path d="${robe}" fill="${L}"/><path d="${robe}" fill="${MOSAIK}" opacity=".55"/>`;
  for (const x of [-0.6, -0.15, 0.35, 0.8]) k += `<path d="M${x} -3.6 Q${r(x + 0.08)} -7 ${r(x * 0.9)} -10.6" stroke="#c4bdac" stroke-width=".09" fill="none"/>`;
  /* Kordel um die Taille, Enden hängen herab */
  k += `<path d="M-1.18 -7.9 Q0 -7.6 1.28 -7.9" stroke="#bdb6a4" stroke-width=".14" fill="none"/><path d="M.1 -7.75 L.05 -5.6 M.32 -7.75 L.36 -5.9" stroke="#bdb6a4" stroke-width=".1"/>`;
  /* Arme waagrecht (der linke im Bild ist näher, darum etwas länger), weite Ärmel hängen darunter */
  const armL = -4.5, armR = 3.8;
  k += `<path d="M-1.1 -11.3 L${armL + 0.3} -11.55 Q${armL} -11.2 ${armL + 0.3} -10.85 L-1.1 -10.4 Z" fill="${S.lg("armL", [[0, "#e6e2d6"], [1, "#d3cdbf"]])}"/>`;
  k += `<path d="M-1.1 -10.6 L${armL + 1.2} -10.9 L${armL + 1.6} -9.9 Q-2.4 -8.8 -1.15 -8.4 Z" fill="#d5cfc1"/>`;
  k += `<path d="M1.25 -11.3 L${armR - 0.3} -11.5 Q${armR} -11.2 ${armR - 0.3} -10.85 L1.25 -10.4 Z" fill="#faf8f1"/>`;
  k += `<path d="M1.25 -10.6 L${armR - 1.1} -10.9 L${armR - 1.4} -10 Q2.4 -9 1.3 -8.5 Z" fill="#efebe1"/>`;
  /* Hände (offen, Handflächen zur Bucht) */
  k += `<ellipse cx="${armL - 0.1}" cy="-11.15" rx=".32" ry=".42" fill="#e2ddd0"/><ellipse cx="${armR + 0.08}" cy="-11.15" rx=".28" ry=".4" fill="#fbf9f3"/>`;
  /* Kopf (leicht geneigt), Haar bis auf die Schultern, Bart; Herz auf der Brust */
  k += `<path d="M-.55 -11.25 Q-.75 -12.4 -.4 -13.15 Q.1 -13.6 .62 -13.1 Q.9 -12.4 .72 -11.25 Z" fill="#ddd7c9"/>`;
  k += `<ellipse cx=".12" cy="-12.25" rx=".5" ry=".72" fill="${S.lg("gesicht", [[0, "#e4dfd2"], [1, "#fbf9f2"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-.22 -11.8 Q.14 -11.45 .5 -11.8" stroke="#c3bcab" stroke-width=".08" fill="none"/>`;
  k += `<path d="M-.15 -9.85 q-.18 -.3 0 -.42 q.12 -.06 .17 .07 q.05 -.13 .17 -.07 q.18 .12 0 .42 l-.17 .2 Z" fill="none" stroke="#b9b1a0" stroke-width=".07"/>`;
  /* Lichtkante rechts (Morgensonne von Osten) */
  k += `<path d="M1.2 -11 Q1.32 -7.6 1.12 -3.6" stroke="#ffffff" stroke-width=".18" fill="none" opacity=".8"/>`;
  const unterC = [
    { id: "arm", de: "der Arm", syl: "ARM", it: "il braccio", itSyl: "BRAC-cio", en: "arm", x: CX - 3, y: CY - 9.6, kunst: flaeche(-1.9, -2.2, 3.8, 2.6, 0.4),
      tipp: "Von einer Hand bis zur anderen sind es 28 Meter." },
    { id: "sockel", de: "der Sockel", syl: "SO-ckel", it: "il piedistallo", itSyl: "pie-di-STAL-lo", en: "pedestal", x: CX, y: CY, kunst: flaeche(-1.5, -3.5, 3, 3.5, 0.3),
      tipp: "Der Sockel ist 8 Meter hoch. Innen ist eine kleine Kapelle." },
    { id: "mosaik", de: "das Mosaik", syl: "Mo-sa-IK", it: "il mosaico", itSyl: "mo-SAI-co", en: "mosaic", x: CX, y: CY - 3.6, kunst: flaeche(-1.15, -4.2, 2.35, 4.2, 0.3),
      tipp: "Die Statue ist mit Tausenden kleiner Dreiecke aus Speckstein beklebt." },
    { id: "aussichtsplattform", de: "die Aussichtsplattform", syl: "AUS-sichts-platt-form", it: "la terrazza panoramica", itSyl: "ter-RAZ-za pa-no-RA-mi-ca", en: "viewing platform", x: CX, y: CY + 1.6, kunst: flaeche(-6, -2.8, 12, 2.8, 0.3) + flaeche(2, -2.8, 4, 2.8, 0.3),
      tipp: "Von der Plattform sieht man ganz Rio." },
  ];
  S.teil({ oben: true, id: "christusstatue", de: "die Christusstatue", syl: "CHRIS-tus-sta-tu-e", it: "il Cristo Redentore", itSyl: "CRI-sto re-den-TO-re", en: "Christ the Redeemer", x: CX, y: CY, kunst: k,
    zoom: { x: CX - 12, y: CY - 15, w: 24, h: 16 },
    unter: unterC,
    tipp: "Die Christusstatue ist 30 Meter hoch. Sie steht seit 1931 auf dem Corcovado." });
}

/* =====================================================================
   4 — DER ZUCKERHUT (nur die Kuppe über Babilônia und Leme)
   ===================================================================== */
const HUEGEL = [[140, 104], [146, 96], [152, 89], [160, 82], [170, 77], [181, 74], [192, 74.6], [200, 78], [205, 82], [209, 83.4], [214, 82], [221, 79.2], [229, 77.6], [236, 78.4], [242, 81.4], [246, 86], [249, 92], [252.5, 100.6], [140, 100.6]];
{
  const X = 212;
  const um1 = [[196, 100], [197.5, 78], [200.5, 64], [204.5, 55], [209, 50], [213, 48.6], [217.5, 49.6], [221.5, 54], [225, 62], [227.5, 74], [229, 100]];
  let k = `<path d="M${pts(um1)} Z" fill="${S.lg("zh", [[0, "#6f6f71"], [0.5, "#8d8a84"], [0.85, "#b9b2a4"], [1, "#d6ccb8"]], 0, 0, 1, 0)}"/>`;
  /* dunkle Regenstreifen im Granit */
  for (let i = 0; i < 12; i++) { const x = 201 + i * 2.1 + rnd(); const y0 = 52 + Math.abs(i - 5.5) * 1.6; k += `<path d="M${r(x)} ${r(y0)} q${r(-0.3 + rnd() * 0.6)} 9 ${r(-0.4 + rnd() * 0.8)} ${r(18 + rnd() * 10)}" stroke="#4f4e4c" stroke-width="${r(0.3 + rnd() * 0.4)}" opacity=".45" fill="none"/>`; }
  /* bewachsene Kuppe und Bänder */
  k += `<path d="M206.5 52.6 Q213 46.6 219.6 51.6 Q216 50.4 213 51 Q209.6 51 206.5 52.6 Z" fill="#4a6f4c"/>`;
  k += `<path d="M199 70 q4 -2 7 1 q-3 1 -7 2 Z M222 66 q2.4 1 3.6 4 q-2.4 -.6 -3.6 -1.6 Z" fill="#4a6f4c" opacity=".8"/>`;
  /* Gegenlicht: Lichtsaum rechts, Dunst der Ferne */
  k += `<path d="M217.5 49.6 Q221.5 54 225 62 Q227 70 227.6 76" stroke="#fff3d8" stroke-width=".6" fill="none" opacity=".75"/>`;
  k += `<path d="M${pts(um1)} Z" fill="#cfe2ea" opacity=".2"/>`;
  /* sichtbar nur über den Hügeln */
  const cid = S.id("zhclip");
  S.def(`<clipPath id="${cid}"><path d="M0 0 L320 0 L320 ${HUEGEL[17][1]} L${pts(HUEGEL.slice(0, 18).reverse())} L0 104 Z"/></clipPath>`);
  S.teil({ id: "zuckerhut", de: "der Zuckerhut", syl: "ZU-cker-hut", it: "il Pan di Zucchero", itSyl: "PAN di ZUC-che-ro", en: "Sugarloaf Mountain", x: X, y: 84, kunst: um(X, 84, `<g clip-path="url(#${cid})">${k}</g>`),
    tipp: "Der Zuckerhut ist ein Felsen aus Granit, 396 Meter hoch. Eine Seilbahn fährt hinauf." });
}

/* =====================================================================
   5 — DAS MEER (Atlantik) — vom Horizont bis zur Brandung
   ===================================================================== */
const WASSER_R = 107.4;   /* Wasserlinie am rechten Bildrand */
const wy = (x, yr) => HY + (yr - HY) * (x - VX) / (320 - VX);   /* Linie zum Fluchtpunkt */
{
  let k = `<path d="M196 100 L320 100 L320 ${WASSER_R} L${VX} 100.3 Z" fill="${S.lg("meer", [[0, "#1c5a8e"], [0.45, "#2878a6"], [0.8, "#3d9fb4"], [1, "#77c8c2"]])}"/>`;
  /* Sonnenglitzern Richtung Sonne (rechts) */
  for (let i = 0; i < 46; i++) { const x = 238 + rnd() * 82, y = 100.2 + rnd() * (wy(x, WASSER_R) - 100.6) * 0.7; k += `<rect x="${r(x)}" y="${r(y)}" width="${r(0.8 + rnd() * 2.2 * (x - 230) / 90)}" height=".22" fill="#fffbe8" opacity="${r(0.35 + 0.5 * (x - 230) / 90)}"/>`; }
  /* Wellenkämme und die weiße Brandung vor dem Sand */
  for (const yr of [102.4, 103.8, 105.2]) k += `<path d="M${VX + 8} ${r(wy(VX + 8, yr))} L320 ${yr}" stroke="#ecf8f6" stroke-width="${r((yr - 101) * 0.18)}" opacity=".7" stroke-dasharray="${r((yr - 101) * 3)} ${r((yr - 101) * 1.6)}"/>`;
  k += `<path d="M${VX + 2} 100.5 L320 ${WASSER_R - 1.2} L320 ${WASSER_R} L${VX} 100.4 Z" fill="#f4fbf8" opacity=".9"/>`;
  /* Insel Cotunduba vor Leme und ein Frachter auf dem Weg in die Bucht */
  k += `<path d="M262 100.2 Q264 97.6 267 97.4 Q270 97.6 272.4 100.2 Z" fill="#5b7a5c"/><path d="M262 100.2 L272.4 100.2" stroke="#e8f4f2" stroke-width=".3"/>`;
  k += `<path d="M291 99.7 L301 99.7 L300 100.4 L292 100.4 Z" fill="#40454c"/><rect x="298" y="98.5" width="1.6" height="1.2" fill="#e8e6e0"/><rect x="293" y="99.1" width="4.4" height=".6" fill="#b34a3a"/>`;
  S.teil({ id: "meer", de: "das Meer", syl: "MEER", it: "il mare", itSyl: "MA-re", en: "sea", x: 266, y: 104, kunst: um(266, 104, k),
    tipp: "Das ist der Atlantische Ozean. Das Wasser ist oft kühler, als man denkt." });
}

/* =====================================================================
   6 — DER HÜGEL (Morro da Babilônia und Morro do Leme mit dem Fort)
   ===================================================================== */
{
  let k = `<path d="M${pts(HUEGEL)} Z" fill="${WALD}"/>`;
  k += `<path d="M${pts(HUEGEL)} Z" fill="${S.lg("huegelluft", [[0, "#9fc3c6", 0.4], [1, "#2f5a3c", 0.08]])}"/>`;
  /* kahle Felswand von Leme zum Meer (rechts, besonnt) und Felsplatten */
  k += `<path d="M242 81.4 L246 86 L249 92 L252.5 100.6 L246.6 100.6 L245 93 L242.6 86 Z" fill="${S.lg("lemefels", [[0, "#8f8a80"], [1, "#c9c0ae"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M186 76 q3 3 2 8 q-2 -3 -4 -4 Z M226 80 q3 2 4 7 q-3 -2 -5 -3 Z" fill="#8e918b" opacity=".7"/>`;
  /* das Fort Duque de Caxias oben auf Leme */
  k += `<path d="M226.5 77.9 L227 75.6 L233.6 75.4 L234 77.8 Z" fill="#c9c4b6"/><rect x="228.4" y="74.4" width="3.6" height="1.2" fill="#d9d4c6"/><line x1="232.8" y1="75.4" x2="232.8" y2="71.8" stroke="#555" stroke-width=".15"/><rect x="232.85" y="71.8" width="1.6" height="1" fill="#2f8a4a"/>`;
  k += `<path d="M${pts(HUEGEL.slice(0, 18))}" stroke="#5e8f66" stroke-width=".5" fill="none" opacity=".6"/>`;
  S.teil({ id: "huegel", de: "der Hügel", syl: "HÜ-gel", it: "la collina", itSyl: "col-LI-na", en: "hill", x: 196, y: 100, kunst: um(196, 100, k),
    tipp: "Am Ende der Copacabana liegt der Hügel Leme. Oben steht ein altes Fort." });
}

/* =====================================================================
   7 — DIE FAVELA (Babilônia und Chapéu Mangueira am Hang)
   ===================================================================== */
{
  const farben = ["#c9653f", "#dca56b", "#ece4d2", "#b44c3b", "#86a9b9", "#e4c35c", "#a06e50", "#da8a72", "#f1ede2", "#c97f4a"];
  const hang = (x) => { /* Oberkante des Hügels bei x */
    for (let i = 0; i < HUEGEL.length - 2; i++) { const [x1, y1] = HUEGEL[i], [x2, y2] = HUEGEL[i + 1]; if (x >= x1 && x <= x2) return y1 + (y2 - y1) * (x - x1) / (x2 - x1); }
    return 100;
  };
  let k = "";
  const haeuser = [];
  for (let row = 0; row < 7; row++) {
    for (let x = 151 + (row % 2) * 1.6; x < 214; x += 2.7 + rnd() * 1.4) {
      const top = hang(x) + 3 + row * 2.1 + rnd() * 1.2;
      if (top > 97 || (x > 199 && row < 2) || (x > 206 && row < 3)) continue;
      if (rnd() < 0.18) continue;
      haeuser.push([x, top, 2.2 + rnd() * 1.6, 1.8 + rnd() * 1.2, farben[Math.floor(rnd() * farben.length)]]);
    }
  }
  haeuser.sort((a, b) => a[1] - b[1]);
  for (const [x, y, w, h, c] of haeuser) {
    k += `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${c}"/>`;
    k += `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height=".35" fill="#fff" opacity=".35"/><rect x="${r(x + w - 0.5)}" y="${r(y)}" width=".5" height="${r(h)}" fill="#000" opacity=".12"/>`;
    k += `<rect x="${r(x + 0.4)}" y="${r(y + 0.7)}" width=".5" height=".6" fill="#3a2f2a"/>`;
    if (w > 3) k += `<rect x="${r(x + 1.6)}" y="${r(y + 0.7)}" width=".5" height=".6" fill="#3a2f2a"/>`;
    if (rnd() < 0.35) k += `<rect x="${r(x + w * 0.5)}" y="${r(y - 0.7)}" width=".9" height=".7" rx=".2" fill="#2f6fb5"/>`;
  }
  /* Bäume zwischen den Häusern */
  for (let i = 0; i < 10; i++) { const x = 152 + rnd() * 58, y = hang(x) + 4 + rnd() * 10; if (y < 96) k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.9 + rnd() * 0.7)}" fill="#3f7148"/>`; }
  S.teil({ id: "favela", de: "die Favela", syl: "Fa-VE-la", it: "la favela", itSyl: "fa-VE-la", en: "favela", x: 182, y: 96, kunst: um(182, 96, k),
    tipp: "In der Favela wohnen viele Familien. Ihre Häuser am Hang haben sie oft selbst gebaut." });
}

/* =====================================================================
   8 — DAS HOCHHAUS (die Häuserreihe der Avenida Atlântica)
   Fassaden an der Linie X = −84,8 m; Tiefe Z; Fuß y = 100 + 280/Z.
   ===================================================================== */
const XF = -84.8;
{
  const fx = (Z, dx = 0) => VX + F * (XF - dx) / Z;
  const fy = (Z, H) => HY + F * (1.6 - H) / Z;
  const farben = [["#f2eee4", "#d9d2c2"], ["#efe2cf", "#d3c1a6"], ["#f4e9e6", "#d9c6c0"], ["#e4e9ec", "#c5cdd2"], ["#f6f2e8", "#ddd5c4"], ["#ead9bf", "#cdb895"], ["#f0ebe0", "#d6cfbf"]];
  const bauten = [];
  let Z = 58;
  const hoehen = [41, 36, 30, 24, 27, 35, 22, 30, 38, 26, 33, 28, 36, 24, 31, 35, 27, 30, 33, 25, 30, 28, 32, 26, 30, 28, 30, 26];
  for (let i = 0; Z < 2600; i++) {
    const w = 18 + rnd() * 14, H = hoehen[i % hoehen.length];
    bauten.push({ z0: Z, z1: Z + w, H, c: farben[i % farben.length], tief: 16 + rnd() * 8 });
    Z += w + (rnd() < 0.25 ? 6 + rnd() * 6 : 0.5);
  }
  let k = "";
  /* von hinten nach vorn zeichnen */
  for (const b of bauten.slice().reverse()) {
    const xa = fx(b.z0), xb = fx(b.z1), ya = fy(b.z0, 0), yb = fy(b.z1, 0), ta = fy(b.z0, b.H), tb = fy(b.z1, b.H);
    if (xb < -2) continue;
    /* Seitenwand (Südwest, im Schatten) */
    const xs = fx(b.z0, b.tief);
    k += `<path d="M${r(xs)} ${r(ya)} L${r(xa)} ${r(ya)} L${r(xa)} ${r(ta)} L${r(xs)} ${r(ta)} Z" fill="${b.c[1]}"/>`;
    k += `<path d="M${r(xs)} ${r(ya)} L${r(xa)} ${r(ya)} L${r(xa)} ${r(ta)} L${r(xs)} ${r(ta)} Z" fill="#3d4a5a" opacity=".22"/>`;
    /* Front zum Meer (Morgensonne) */
    k += `<path d="M${r(xa)} ${r(ya)} L${r(xb)} ${r(yb)} L${r(xb)} ${r(tb)} L${r(xa)} ${r(ta)} Z" fill="${b.c[0]}"/>`;
    const breit = xb - xa;
    if (breit > 2.2) {
      /* Stockwerke: dunkles Fensterband, helle Balkonbrüstung */
      const n = Math.round(b.H / 3);
      for (let s = 1; s < n; s++) {
        const h0 = s * 3 + 0.9, h1 = s * 3 + 2.3;
        const p = [[xa, fy(b.z0, h1)], [xb, fy(b.z1, h1)], [xb, fy(b.z1, h0)], [xa, fy(b.z0, h0)]];
        k += `<path d="M${pts(p)} Z" fill="${s % 4 === 0 ? "#4e6478" : "#5f7487"}" opacity="${breit > 8 ? 0.7 : 0.5}"/>`;
      }
      /* Erdgeschoss: Läden mit Markisen */
      k += `<path d="M${r(xa)} ${r(fy(b.z0, 0))} L${r(xb)} ${r(fy(b.z1, 0))} L${r(xb)} ${r(fy(b.z1, 3))} L${r(xa)} ${r(fy(b.z0, 3))} Z" fill="#3b3a3a" opacity=".55"/>`;
      if (breit > 8) for (let j = 0; j < 3; j++) { const za = b.z0 + (j + 0.2) * (b.z1 - b.z0) / 3, zb = za + (b.z1 - b.z0) / 4; k += `<path d="M${r(fx(za))} ${r(fy(za, 3.4))} L${r(fx(zb))} ${r(fy(zb, 3.4))} L${r(fx(zb, -1.4))} ${r(fy(zb, 2.6))} L${r(fx(za, -1.4))} ${r(fy(za, 2.6))} Z" fill="${["#c0392b", "#2e7d5b", "#e0a83a"][j]}"/>`; }
      /* Dachaufbauten: Maschinenraum, Wassertank */
      const zm = b.z0 + (b.z1 - b.z0) * 0.35;
      k += `<rect x="${r(fx(zm))}" y="${r(fy(zm, b.H + 2.4))}" width="${r(Math.max(0.6, breit * 0.18))}" height="${r(fy(zm, b.H) - fy(zm, b.H + 2.4))}" fill="${b.c[1]}"/>`;
    }
    /* Lichtkante an der vorderen Ecke */
    k += `<line x1="${r(xa)}" y1="${r(ta)}" x2="${r(xa)}" y2="${r(ya)}" stroke="#ffffff" stroke-width="${r(Math.min(0.6, breit * 0.05))}" opacity=".6"/>`;
  }
  /* Luftperspektive zum Fluchtpunkt hin */
  k += `<rect x="0" y="0" width="${VX}" height="108" fill="${S.lg("hausdunst", [[0, "#d9eef3", 0], [0.55, "#d9eef3", 0.04], [1, "#d9eef3", 0.4]], 0, 0, 1, 0)}"/>`;
  const cid = S.id("hausclip");
  S.def(`<clipPath id="${cid}"><path d="M0 0 L${VX} 0 L${VX} 100.2 L0 104.2 Z"/></clipPath>`);
  S.teil({ id: "hochhaus", de: "das Hochhaus", syl: "HOCH-haus", it: "il palazzo", itSyl: "pa-LAZ-zo", en: "high-rise", x: 60, y: 104, kunst: um(60, 104, `<g clip-path="url(#${cid})">${k}</g>`),
    tipp: "An der Avenida Atlântica stehen die Hochhäuser dicht an dicht – alle mit Blick aufs Meer." });
}

/* =====================================================================
   KULISSE vorn: die Avenida Atlântica (zwei Fahrbahnen, Mittelstreifen)
   ===================================================================== */
const linie = (y0) => (x) => HY + (y0 - HY) * (VX - x) / VX;   /* Gerade von (0|y0) zum Fluchtpunkt */
const BORD = linie(120), STRANDKANTE = linie(177.9), HAUSFUSS = linie(104.2);
{
  let k = `<path d="M0 104.2 L${VX} 100 L0 120 Z" fill="${S.lg("asphalt", [[0, "#8a8c8f"], [1, "#55585c"]])}"/>`;
  /* Gehweg an den Häusern, Mittelstreifen mit Mosaik und Bäumen */
  k += `<path d="M0 104.2 L${VX} 100 L0 105.6 Z" fill="#cfcabd"/>`;
  const mitte = linie(111.6), mitte2 = linie(112.5);
  k += `<path d="M0 111.6 L${VX} 100 L0 112.5 Z" fill="#e8e4da"/>`;
  for (let x = 2; x < 190; x += 6 + x * 0.05) k += `<rect x="${r(x)}" y="${r(mitte(x) + 0.1)}" width="${r(1.6 - x * 0.007)}" height="${r(Math.max(0.15, (mitte2(x) - mitte(x)) * 0.6))}" fill="${x % 3 < 1.5 ? "#2b2b2b" : "#a5452e"}"/>`;
  /* Fahrbahnmarkierung (weiß gestrichelt) */
  for (const y0 of [108.3, 116.2]) { const l = linie(y0); for (let x = 0; x < 196; x += 9 - x * 0.035) k += `<line x1="${r(x)}" y1="${r(l(x))}" x2="${r(x + 4 - x * 0.016)}" y2="${r(l(x + 4 - x * 0.016))}" stroke="#f2f2ea" stroke-width="${r(0.35 - x * 0.0013)}"/>`; }
  /* Bordstein zum Calçadão */
  k += `<path d="M0 119.3 L${VX} 100 L0 120.6 Z" fill="#d9d4c8"/>`;
  S.hinten(k);
}

/* =====================================================================
   9 — DAS TAXI (gelb mit blauem Streifen) auf der Avenida Atlântica
   ===================================================================== */
{
  /* fährt vom Betrachter weg Richtung Leme: man sieht Heck und rechte Seite */
  const X0 = 26, Y0 = 117.2;                 /* hinteres rechtes Rad auf dem Boden */
  const s = sy(Y0);                            /* ≈ 10,75 Einheiten je Meter am Heck */
  const lang = 4.5, br = 1.75, ho = 1.5;
  const zum = (x, y, t) => [x + (VX - x) * t, y + (HY - y) * t];   /* Richtung Fluchtpunkt */
  const t = 1 - 1 / (1 + lang * s / (VX - X0) * 1.2);
  const heckL = X0 - br * s * 0.95, heckR = X0;
  const [vx, vy] = zum(X0, Y0, t);
  const kk = (VX - vx) / (VX - X0);           /* Maßstab vorn */
  const GELB = S.lg("taxigelb", [[0, "#ffd54a"], [0.6, "#f2bd1d"], [1, "#d99d10"]]);
  let k = schatten(-3, 0.6, 12, 1.4, 0.35);
  /* rechte Seite (fluchtend) */
  k += `<path d="M0 -1 L${r(vx - X0)} ${r(vy - Y0 - 0.6 * kk)} L${r(vx - X0)} ${r(vy - Y0 - ho * 0.62 * s * kk)} L0 ${r(-ho * 0.62 * s)} Z" fill="${GELB}"/>`;
  k += `<path d="M0 ${r(-0.42 * s)} L${r(vx - X0)} ${r(vy - Y0 - 0.42 * s * kk)} L${r(vx - X0)} ${r(vy - Y0 - 0.55 * s * kk)} L0 ${r(-0.55 * s)} Z" fill="#1f5fae"/>`;
  /* Fenster der Seite und Dach */
  const dachH = -ho * s, schulter = -ho * 0.62 * s;
  k += `<path d="M-1 ${r(schulter)} L${r((vx - X0) * 0.82)} ${r((vy - Y0) * 0.82 + schulter * (1 - 0.18 * (1 - kk)))} L${r((vx - X0) * 0.7)} ${r((vy - Y0) * 0.7 + dachH * (1 - 0.3 * (1 - kk)))} L1.4 ${r(dachH)} Z" fill="#2b3a48"/>`;
  k += `<path d="M${r((vx - X0) * 0.38)} ${r((vy - Y0) * 0.38 + schulter * 0.98)} L${r((vx - X0) * 0.36)} ${r((vy - Y0) * 0.36 + dachH * 0.96)}" stroke="${GELB}" stroke-width=".8"/>`;
  /* Heck (frontal) */
  const hw = heckR - heckL;
  k += `<path d="M${r(-hw)} -1 L0 -1 L0 ${r(schulter)} L${r(-hw)} ${r(schulter)} Z" fill="#e8b318"/>`;
  k += `<path d="M${r(-hw + 1.4)} ${r(schulter)} L-1 ${r(schulter)} L-.4 ${r(dachH)} L${r(-hw + 2)} ${r(dachH)} Z" fill="#2b3a48"/>`;
  k += `<path d="M${r(-hw)} ${r(dachH)} L1.4 ${r(dachH)} L${r((vx - X0) * 0.7)} ${r((vy - Y0) * 0.7 + dachH * (1 - 0.3 * (1 - kk)))} L${r((vx - X0) * 0.7 - hw * 0.8)} ${r((vy - Y0) * 0.7 + dachH * (1 - 0.3 * (1 - kk)))} Z" fill="#f6c935"/>`;
  /* Rücklichter, Kennzeichen (Mercosul: weiß mit blauem Band), Stoßstange */
  k += `<rect x="${r(-hw + 0.4)}" y="${r(schulter + 1.2)}" width="2.6" height="1.6" rx=".4" fill="#c4161c"/><rect x="-3" y="${r(schulter + 1.2)}" width="2.6" height="1.6" rx=".4" fill="#c4161c"/>`;
  k += `<rect x="${r(-hw / 2 - 2.6)}" y="${r(schulter + 3.4)}" width="5.2" height="2" fill="#f4f4f0"/><rect x="${r(-hw / 2 - 2.6)}" y="${r(schulter + 3.4)}" width="5.2" height=".55" fill="#1f4f9e"/>`;
  k += `<rect x="${r(-hw - 0.3)}" y="-2.4" width="${r(hw + 0.6)}" height="1.5" rx=".5" fill="#2f2f33"/>`;
  /* Taxischild auf dem Dach */
  k += `<rect x="${r(-hw / 2 - 2)}" y="${r(dachH - 1.6)}" width="4.4" height="1.6" rx=".4" fill="#f4f1e6"/><text x="${r(-hw / 2 + 0.2)}" y="${r(dachH - 0.4)}" font-size="1.3" text-anchor="middle" fill="#1f4f9e" font-family="Arial" font-weight="bold">TAXI</text>`;
  /* Räder */
  k += `<ellipse cx="${r(-hw + 1.6)}" cy="-.4" rx="1.5" ry="1.2" fill="#1b1b1d"/><ellipse cx="-1.3" cy="-.4" rx="1.4" ry="1.2" fill="#1b1b1d"/>`;
  k += `<ellipse cx="${r((vx - X0) * 0.78)}" cy="${r((vy - Y0) * 0.78 - 0.8)}" rx="1.1" ry="1.6" fill="#1b1b1d"/><ellipse cx="${r((vx - X0) * 0.78 + 0.3)}" cy="${r((vy - Y0) * 0.78 - 0.8)}" rx=".5" ry=".9" fill="#9aa0a6"/>`;
  k += `<path d="M1 ${r(schulter + 0.5)} L${r((vx - X0) * 0.9)} ${r((vy - Y0) * 0.9 + schulter * 0.95)}" stroke="#fff6cc" stroke-width=".35" opacity=".7"/>`;
  S.teil({ id: "taxi", de: "das Taxi", syl: "TA-xi", it: "il taxi", itSyl: "TA-xi", en: "taxi", x: X0, y: Y0, kunst: k,
    tipp: "Die Taxis in Rio sind gelb und haben einen blauen Streifen." });
}

/* =====================================================================
   10 — DIE PROMENADE (Calçadão) — schwarze Wellen auf Weiß,
        parallel zum Meer
   ===================================================================== */
{
  const XB = -16.96, XS = -4.354;            /* Bordstein und Strandkante (Meter) */
  let k = `<path d="M0 120.6 L${VX} 100 L0 ${r(STRANDKANTE(0))} Z" fill="${S.lg("calc", [[0, "#e7e1d3"], [1, "#f6f2e8"]])}"/>`;
  /* Wellenbänder: Mitte X_k, Breite 0,5 m, Ausschlag 0,4 m, Wellenlänge 3,4 m */
  const cid = S.id("calcclip");
  S.def(`<clipPath id="${cid}"><path d="M0 120.6 L${VX} 100 L0 ${r(STRANDKANTE(0))} Z"/></clipPath>`);
  let w = "";
  for (let i = 0; i < 12; i++) {
    const Xk = XB + 0.75 + i * 1.03;
    const zs = [];
    for (let Z = 3.2; Z < 26; Z *= 1.045) zs.push(Z);
    zs.push(40, 70, 140, 400);
    const kante = (d) => zs.map((Z) => { const a = Z < 26 ? 0.4 * Math.sin(2 * Math.PI * Z / 3.4 + i * 0.2) : 0; return boden(Xk + d + a, Z); });
    const l = kante(-0.26), rr = kante(0.26).reverse();
    w += `<path d="M${pts(l)} L${pts(rr)} Z" fill="#262626"/>`;
  }
  k += `<g clip-path="url(#${cid})">${w}</g>`;
  /* Fugen- und Steinstruktur: feiner Glanz, Verschmutzung zum Rand */
  k += `<path d="M0 120.6 L${VX} 100 L0 ${r(STRANDKANTE(0))} Z" fill="${S.lg("calclicht", [[0, "#ffffff", 0], [0.6, "#ffffff", 0.06], [1, "#ffffff", 0.18]], 0, 0, 1, 0)}"/>`;
  /* Sand weht auf den Rand */
  for (let i = 0; i < 26; i++) { const x = rnd() * 196, y = STRANDKANTE(x) - rnd() * 2.4 * (STRANDKANTE(x) - 100) / 78; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.6 + (y - 100) * 0.05)}" ry="${r(0.2 + (y - 100) * 0.012)}" fill="#e9d6ab" opacity=".7"/>`; }
  S.teil({ id: "promenade", de: "die Promenade", syl: "Pro-me-NA-de", it: "il lungomare", itSyl: "lun-go-MA-re", en: "promenade", x: 40, y: 150, kunst: um(40, 150, k),
    tipp: "Das Wellenmuster aus schwarzen und weißen Steinen ist 4 Kilometer lang." });
}

/* =====================================================================
   11 — DER STRAND (feiner heller Sand, in der Ferne viele Schirme)
   ===================================================================== */
{
  let k = `<path d="M-1 ${r(STRANDKANTE(-1))} L${VX} 100 L${VX} 100.3 L320 ${WASSER_R} L320 200 L-1 200 Z" fill="${S.lg("sand", [[0, "#f4e7c9"], [0.25, "#efdcb3"], [1, "#e6c993"]])}"/>`;
  /* nasser Sand an der Wasserlinie */
  k += `<path d="M${VX} 100.35 L320 ${WASSER_R} L320 ${WASSER_R + 1.8} L${VX} 100.5 Z" fill="#cdb58a" opacity=".7"/>`;
  /* Kante zum Calçadão: niedrige Stufe */
  k += `<path d="M-1 ${r(STRANDKANTE(-1))} L${VX} 100 L-1 ${r(STRANDKANTE(-1) + 2.2)} Z" fill="#cbb489" opacity=".7"/>`;
  /* Fußspuren und Sandkörnung (perspektivisch kleiner) */
  for (let i = 0; i < 70; i++) {
    const y = 104 + Math.pow(rnd(), 1.6) * 94, xmin = Math.max(-1, (VX - (VX * (y - HY) / (177.9 - HY))) + 2), x = xmin + rnd() * (320 - xmin);
    if (y < wy(x, WASSER_R) + 2) continue;
    const s = sy(y);
    k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.07 * s)}" ry="${r(0.03 * s)}" fill="#c9a970" opacity=".5"/>`;
  }
  /* ferne Sonnenschirme und Badegäste am Strand Richtung Leme */
  const schirmF = ["#e84a3c", "#f2c230", "#2f8fd0", "#3aa35a", "#f08a2c", "#ffffff", "#c43a8a"];
  for (let i = 0; i < 34; i++) {
    const Z = 30 + Math.pow(rnd(), 1.4) * 700, X = -2 + rnd() * 24;
    const [x, y] = boden(X, Z);
    if (x > 318 || y < 100.3 || y < wy(x, WASSER_R) + 0.6) continue;
    const s = F / Z;
    k += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x)}" y2="${r(y - 2.1 * s)}" stroke="#777" stroke-width="${r(Math.max(0.08, 0.04 * s))}"/>`;
    k += `<path d="M${r(x - 1 * s)} ${r(y - 1.9 * s)} Q${r(x)} ${r(y - 2.5 * s)} ${r(x + 1 * s)} ${r(y - 1.9 * s)} Z" fill="${schirmF[i % schirmF.length]}"/>`;
    if (rnd() < 0.5) k += `<rect x="${r(x + 0.4 * s)}" y="${r(y - 1.6 * s)}" width="${r(0.4 * s)}" height="${r(1.6 * s)}" rx="${r(0.15 * s)}" fill="${["#8d5a3b", "#d7a179", "#5e3a26"][i % 3]}"/>`;
  }
  S.teil({ id: "strand", de: "der Strand", syl: "STRAND", it: "la spiaggia", itSyl: "SPIAG-gia", en: "beach", x: 250, y: 160, kunst: um(250, 160, k),
    tipp: "Die Copacabana ist vier Kilometer lang – einer der berühmtesten Strände der Welt." });
}

/* =====================================================================
   12 — DER KIOSK (runder Glaspavillon mit weißem Dach) — Lupe:
        Kokosnuss, Açaí, Mate; 13 — DIE FLAGGE auf dem Dach
   ===================================================================== */
const KI = { x: 104, y: 134 };
const KS = sy(KI.y);                           /* 21,25 Einheiten je Meter */
const KR = 1.3 * KS, KH = 2.5 * KS, THEKE = KI.y - 1.05 * KS;
const kioskUnter = [];
{
  const ry = KR * 0.16;                        /* Ellipse der Grundfläche (Blick fast waagrecht) */
  let k = schatten(-6, 1, KR * 1.25, ry * 1.6, 0.35);
  /* Sockel und Thekenwand (weiß, rund) */
  k += `<path d="M${r(-KR)} ${r(-1.05 * KS)} L${r(-KR)} 0 A${r(KR)} ${r(ry)} 0 0 0 ${r(KR)} 0 L${r(KR)} ${r(-1.05 * KS)} Z" fill="${S.lg("kwand", [[0, "#b9bdbf"], [0.3, "#eef0ee"], [0.7, "#ffffff"], [1, "#d7dbdc"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-KR)} -1.2 A${r(KR)} ${r(ry)} 0 0 0 ${r(KR)} -1.2" stroke="#2e7d5b" stroke-width="1.6" fill="none"/>`;
  k += `<text x="0" y="${r(-0.5 * KS)}" font-size="4.2" text-anchor="middle" fill="#2e7d5b" font-family="Arial" font-weight="bold" letter-spacing=".4">COCO GELADO</text>`;
  k += `<text x="0" y="${r(-0.3 * KS)}" font-size="2.1" text-anchor="middle" fill="#6b7377" font-family="Arial" letter-spacing=".3">AÇAÍ · MATE · SUCOS</text>`;
  /* Glasaufsatz: Innenraum dunkel, Rückwand mit Regal, Pfosten */
  const yT = -1.05 * KS, yD = -KH;
  k += `<path d="M${r(-KR)} ${r(yT)} L${r(-KR)} ${r(yD)} L${r(KR)} ${r(yD)} L${r(KR)} ${r(yT)} Z" fill="${S.lg("kinnen", [[0, "#3b4a52"], [1, "#56656b"]])}"/>`;
  k += `<rect x="${r(-KR * 0.8)}" y="${r(yD + 6)}" width="${r(KR * 1.6)}" height="1" fill="#8a7a62"/>`;
  for (let i = 0; i < 9; i++) k += `<rect x="${r(-KR * 0.78 + i * KR * 0.18)}" y="${r(yD + 3.2)}" width="1.6" height="2.8" rx=".3" fill="${["#e8c23a", "#2f8a4a", "#c0392b", "#f2f2ea", "#7a3fa0"][i % 5]}"/>`;
  k += `<rect x="${r(-KR * 0.8)}" y="${r(yD + 12)}" width="${r(KR * 0.7)}" height="7" rx=".8" fill="#d5dadc"/><rect x="${r(-KR * 0.78)}" y="${r(yD + 13)}" width="${r(KR * 0.66)}" height="5" fill="#9cc6d4"/>`;
  /* Thekenplatte (Edelstahl) */
  k += `<path d="M${r(-KR - 1)} ${r(yT)} A${r(KR + 1)} ${r(ry + 0.8)} 0 0 0 ${r(KR + 1)} ${r(yT)} L${r(KR + 1)} ${r(yT - 1.2)} A${r(KR + 1)} ${r(ry + 0.8)} 0 0 1 ${r(-KR - 1)} ${r(yT - 1.2)} Z" fill="${S.lg("kplatte", [[0, "#c8cdd0"], [0.5, "#f4f6f6"], [1, "#aeb5b9"]], 0, 0, 1, 0)}"/>`;
  /* Glasfront-Pfosten (die rechte Scheibe ist zum Verkaufen hochgeschoben) */
  for (const t of [-0.92, -0.62, -0.25, 0.12, 0.5, 0.86]) k += `<rect x="${r(t * KR - 0.4)}" y="${r(yD)}" width=".8" height="${r(yT - yD - 1.2)}" fill="#cfd5d8"/>`;
  /* Dach: weiße Scheibe mit Überstand */
  const DR = KR * 1.38, dry = DR * 0.16;
  k += `<path d="M${r(-DR)} ${r(yD)} A${r(DR)} ${r(dry)} 0 0 0 ${r(DR)} ${r(yD)} L${r(DR)} ${r(yD - 3.4)} A${r(DR)} ${r(dry)} 0 0 1 ${r(-DR)} ${r(yD - 3.4)} Z" fill="${S.lg("kdach", [[0, "#cdd2d4"], [0.35, "#ffffff"], [1, "#e0e4e5"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-DR)} ${r(yD)} A${r(DR)} ${r(dry)} 0 0 0 ${r(DR)} ${r(yD)}" stroke="#9aa3a8" stroke-width=".5" fill="none"/>`;
  k += `<path d="M${r(-DR + 2)} ${r(yD + 0.6)} A${r(DR - 2)} ${r(dry * 0.7)} 0 0 0 ${r(DR - 2)} ${r(yD + 0.6)}" stroke="#000" stroke-width="1.6" opacity=".12" fill="none"/>`;
  k += `<text x="0" y="${r(yD - 0.9)}" font-size="2.3" text-anchor="middle" fill="#2e7d5b" font-family="Arial" font-weight="bold" letter-spacing=".5">QUIOSQUE POSTO 5</text>`;

  /* --- auf der Theke (Lupe) --- */
  const kx = (x) => x, T = yT - 1.2;
  /* DIE KOKOSNUSS — drei grüne Nüsse, eine aufgeschlagen mit Strohhalm */
  {
    let g = "";
    const nuss = (x, y, s, offen) => {
      let h = `<ellipse cx="${r(x)}" cy="${r(y - 2.6 * s)}" rx="${r(2.5 * s)}" ry="${r(2.8 * s)}" fill="${S.rg("kokos", [[0, "#a9d46a"], [0.6, "#6aa83c"], [1, "#3f7a25"]], 0.38, 0.32, 0.75)}"/>`;
      h += `<path d="M${r(x - 0.6 * s)} ${r(y - 5.3 * s)} L${r(x)} ${r(y - 5.9 * s)} L${r(x + 0.6 * s)} ${r(y - 5.3 * s)}" fill="#5c8a33"/>`;
      if (offen) h += `<ellipse cx="${r(x)}" cy="${r(y - 5.1 * s)}" rx="${r(0.9 * s)}" ry="${r(0.35 * s)}" fill="#f4f1de"/><path d="M${r(x + 0.2)} ${r(y - 5.1 * s)} L${r(x + 1.6 * s)} ${r(y - 9.4 * s)} L${r(x + 2.6 * s)} ${r(y - 9.8 * s)}" stroke="#e8433a" stroke-width="${r(0.42 * s)}" fill="none" stroke-linecap="round"/><path d="M${r(x + 0.5)} ${r(y - 6 * s)} L${r(x + 1.1 * s)} ${r(y - 7.8 * s)}" stroke="#fff" stroke-width="${r(0.15 * s)}"/>`;
      h += `<ellipse cx="${r(x - 0.9 * s)}" cy="${r(y - 3.6 * s)}" rx="${r(0.6 * s)}" ry="${r(1 * s)}" fill="#fff" opacity=".25"/>`;
      return h;
    };
    g += nuss(-20.6, T, 0.9, false) + nuss(-15.6, T, 0.95, false) + nuss(-10.4, T + 0.2, 1, true);
    k += g;
    kioskUnter.push({ id: "kokosnuss", de: "die Kokosnuss", syl: "KO-kos-nuss", it: "la noce di cocco", itSyl: "NO-ce di COC-co", en: "coconut", x: KI.x - 15.4, y: KI.y + T, kunst: flaeche(-7.8, -10.2, 15.6, 10.4, 0.6),
      tipp: "Das Kokoswasser trinkt man mit einem Strohhalm direkt aus der grünen Nuss." });
  }
  /* DIE AÇAÍ-SCHALE — lila Açaí mit Müsli und Bananenscheiben */
  {
    const x = -2.4, y = T;
    let g = `<path d="M${x - 3.2} ${y - 2.6} Q${x} ${y + 0.6} ${x + 3.2} ${y - 2.6} Z" fill="${S.lg("schale", [[0, "#f2efe6"], [1, "#c9c4b6"]])}"/>`;
    g += `<ellipse cx="${x}" cy="${y - 2.7}" rx="3.2" ry=".9" fill="#4b1d4f"/><path d="M${x - 2.8} ${y - 2.9} Q${x} ${y - 4.4} ${x + 2.8} ${y - 2.9} Q${x} ${y - 2} ${x - 2.8} ${y - 2.9} Z" fill="${S.rg("acai", [[0, "#7a3a86"], [1, "#3e1442"]])}"/>`;
    for (let i = 0; i < 9; i++) g += `<circle cx="${r(x - 2 + rnd() * 2.4)}" cy="${r(y - 3.4 + rnd() * 0.8)}" r=".22" fill="#c9954c"/>`;
    for (const [dx, dy] of [[1, -3.6], [1.9, -3.1], [0.4, -3]]) g += `<ellipse cx="${x + dx}" cy="${y + dy}" rx=".55" ry=".32" fill="#f6eab0" stroke="#e2cf7a" stroke-width=".08"/>`;
    k += g;
    kioskUnter.push({ id: "acai", de: "die Açaí-Schale", syl: "a-ça-Í-scha-le", it: "la ciotola di açaí", itSyl: "CIO-to-la di a-ça-Ì", en: "açaí bowl", x: KI.x + x, y: KI.y + y, kunst: flaeche(-3.6, -4.8, 7.2, 5, 0.6),
      tipp: "Açaí sind lila Beeren aus dem Amazonas. Man isst sie gefroren, mit Müsli und Banane." });
  }
  /* DER MATE — kalter Mate-Tee mit Zitrone im Becher */
  {
    const x = 5.4, y = T;
    let g = `<path d="M${x - 1.5} ${y - 5.6} L${x + 1.5} ${y - 5.6} L${x + 1.2} ${y} L${x - 1.2} ${y} Z" fill="#e8f2f2" opacity=".55" stroke="#b9cdd1" stroke-width=".15"/>`;
    g += `<path d="M${x - 1.42} ${y - 4.6} L${x + 1.42} ${y - 4.6} L${x + 1.22} ${y - 0.2} L${x - 1.22} ${y - 0.2} Z" fill="${S.lg("mate", [[0, "#d99a3a"], [1, "#a8621c"]])}" opacity=".9"/>`;
    g += `<rect x="${x - 1.1}" y="${y - 4.4}" width=".9" height=".9" rx=".15" fill="#eaf6f8" opacity=".8"/><rect x="${x + 0.1}" y="${y - 3.8}" width=".9" height=".9" rx=".15" fill="#eaf6f8" opacity=".7"/>`;
    g += `<path d="M${x + 0.9} ${y - 5.8} A1.2 1.2 0 0 1 ${x + 2.4} ${y - 4.6} L${x + 0.9} ${y - 4.6} Z" fill="#c9d94a"/><path d="M${x - 0.4} ${y - 5.5} L${x - 0.9} ${y - 8}" stroke="#2e7d5b" stroke-width=".35"/>`;
    k += g;
    kioskUnter.push({ id: "mate", de: "der Mate", syl: "MA-te", it: "il mate", itSyl: "MA-te", en: "mate tea", x: KI.x + x, y: KI.y + y, kunst: flaeche(-2, -8.2, 4.4, 8.4, 0.5),
      tipp: "Am Strand trinkt man kalten Mate-Tee mit Zitrone." });
  }
  /* Tafel mit den Preisen neben dem Kiosk */
  k += `<path d="M${r(-KR - 9)} 2 L${r(-KR - 7.6)} -16 L${r(-KR - 1.4)} -16 L${r(-KR)} 2" fill="none" stroke="#5a3b22" stroke-width=".7"/>`;
  k += `<rect x="${r(-KR - 8.4)}" y="-16" width="7.4" height="10" rx=".4" fill="#253128"/>`;
  for (const [i, t] of ["Coco 10", "Açaí 18", "Mate 8"].entries()) k += `<text x="${r(-KR - 4.7)}" y="${r(-13.2 + i * 2.8)}" font-size="1.7" text-anchor="middle" fill="#f4efdc" font-family="'Comic Sans MS',cursive">${t}</text>`;
  S.teil({ id: "kiosk", de: "der Kiosk", syl: "KI-osk", it: "il chiosco", itSyl: "CHIO-sco", en: "kiosk", x: KI.x, y: KI.y, steht: true, kunst: k,
    zoom: { x: KI.x - 34, y: THEKE - 22, w: 60, h: 40 },
    unter: kioskUnter,
    tipp: "Am Kiosk gibt es eiskalte Kokosnüsse, Açaí und Mate." });
}
{
  /* DIE FLAGGE Brasiliens am Mast auf dem Kioskdach */
  const X = KI.x + KR * 1.05, Y = KI.y - KH - 3.4;
  let k = `<rect x="-.35" y="-27" width=".7" height="27" fill="#c9ced2"/><circle cx="0" cy="-27.4" r=".7" fill="#d9b23a"/>`;
  const fw = 16, fh = 11.2, y0 = -26.4;
  const wel = (dy) => `M.4 ${r(y0 + dy)} Q${r(fw * 0.3)} ${r(y0 + dy - 1.2)} ${r(fw * 0.55)} ${r(y0 + dy)} T${fw} ${r(y0 + dy - 0.4)}`;
  k += `<path d="${wel(0)} L${fw} ${r(y0 + fh - 0.4)} Q${r(fw * 0.8)} ${r(y0 + fh - 1.6)} ${r(fw * 0.55)} ${r(y0 + fh)} T.4 ${r(y0 + fh)} Z" fill="#009b3a"/>`;
  const cx = fw * 0.5, cy = y0 + fh / 2 - 0.3;
  k += `<path d="M${r(cx - 6.6)} ${r(cy)} L${r(cx)} ${r(cy - 4.3)} L${r(cx + 6.6)} ${r(cy - 0.2)} L${r(cx)} ${r(cy + 4.3)} Z" fill="#fedf00"/>`;
  k += `<circle cx="${r(cx)}" cy="${r(cy)}" r="2.75" fill="#002776"/>`;
  k += `<path d="M${r(cx - 2.7)} ${r(cy - 0.3)} Q${r(cx)} ${r(cy - 1.3)} ${r(cx + 2.7)} ${r(cy + 0.5)}" stroke="#ffffff" stroke-width=".55" fill="none"/>`;
  for (let i = 0; i < 12; i++) k += `<circle cx="${r(cx - 1.8 + rnd() * 3.6)}" cy="${r(cy + 0.4 + rnd() * 1.8)}" r=".12" fill="#fff"/>`;
  k += `<path d="M.4 ${y0} Q${r(fw * 0.3)} ${r(y0 - 1.2)} ${r(fw * 0.55)} ${y0} L${r(fw * 0.55)} ${r(y0 + fh)} Q${r(fw * 0.3)} ${r(y0 + fh - 1.2)} .4 ${r(y0 + fh)} Z" fill="#fff" opacity=".1"/>`;
  S.teil({ oben: true, id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: X, y: Y, kunst: k,
    tipp: "Auf der Flagge Brasiliens steht „Ordem e Progresso“ – „Ordnung und Fortschritt“." });
}

/* =====================================================================
   14 — DER VERKÄUFER im Kiosk (hinter der Theke, man sieht den Oberkörper)
   ===================================================================== */
{
  const m = B.mensch({ id: "rio_verk", geschlecht: "m", alter: "erwachsen", pose: "servieren", blick: -18, frisur: "kurz", haarfarbe: "schwarz", haut: "dunkel", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#2e7d5b" }, unterteil: { stueck: "shorts", farbe: "beige" }, kopf: { stueck: "kappe", farbe: "#f2f2ea" } } }, 1.76 * sy(KI.y - 3));
  const X = KI.x + 14, Y = KI.y - 3;
  const cid = S.id("verkclip");
  /* nur der Teil über der Theke ist zu sehen */
  S.def(`<clipPath id="${cid}" clipPathUnits="userSpaceOnUse"><rect x="-30" y="-80" width="60" height="${r(80 - (Y - (THEKE - 1.2)))}"/></clipPath>`);
  S.teil({ id: "verkaeufer", de: "der Verkäufer", syl: "ver-KÄU-fer", it: "il venditore", itSyl: "ven-di-TO-re", en: "vendor", x: X, y: Y, kunst: `<g clip-path="url(#${cid})">${knapp(m.svg)}</g>`,
    tipp: "Der Verkäufer sagt: „Bom dia!“ – das heißt „Guten Morgen!“" });
}
/* Glas vor dem Kiosk: Spiegelstreifen (fangen keinen Tipp ab) */
S.davor(`<g opacity=".85"><path d="M${r(KI.x - KR + 3)} ${r(THEKE - 1.2)} L${r(KI.x - KR + 9)} ${r(KI.y - KH)} L${r(KI.x - KR + 13)} ${r(KI.y - KH)} L${r(KI.x - KR + 7)} ${r(THEKE - 1.2)} Z" fill="#fff" opacity=".18"/><path d="M${r(KI.x - 6)} ${r(THEKE - 1.2)} L${r(KI.x - 2)} ${r(KI.y - KH)} L${r(KI.x)} ${r(KI.y - KH)} L${r(KI.x - 4)} ${r(THEKE - 1.2)} Z" fill="#fff" opacity=".12"/></g>`);

/* =====================================================================
   15 — DER SONNENSCHIRM und 16 — DER LIEGESTUHL (mit 17 — TAMBURIN)
   ===================================================================== */
const SCH = { x: 296, y: 166 };
{
  const s = sy(SCH.y);                         /* ≈ 41 Einheiten je Meter */
  const top = -2.25 * s, rand = -1.95 * s, R = 0.92 * s;
  let k = `<ellipse cx="${r(-1.1 * s)}" cy="${r(0.25 * s)}" rx="${r(1.05 * s)}" ry="${r(0.22 * s)}" fill="#7a5a2a" opacity=".22" filter="url(#bw_weich)"/>`;
  k += `<line x1="0" y1="0" x2="${r(-0.08 * s)}" y2="${r(top)}" stroke="${S.lg("mast", [[0, "#d8dcde"], [1, "#9aa1a6"]], 0, 0, 1, 0)}" stroke-width="1.2"/>`;
  /* Dach von schräg unten: Kuppel (8 Bahnen) und sichtbare Unterseite */
  const farben = ["#f3c623", "#1e8a4c", "#2f6fc0", "#ffffff"];
  const ry = R * 0.26;
  for (let i = 0; i < 8; i++) {
    const a1 = Math.PI + i * Math.PI / 8, a2 = a1 + Math.PI / 8;
    const p1 = [Math.cos(a1) * R, rand - Math.sin(a1) * -ry], p2 = [Math.cos(a2) * R, rand - Math.sin(a2) * -ry];
    k += `<path d="M${r(-0.08 * s)} ${r(top)} L${r(p1[0])} ${r(p1[1])} Q${r((p1[0] + p2[0]) / 2)} ${r((p1[1] + p2[1]) / 2 + 1.6)} ${r(p2[0])} ${r(p2[1])} Z" fill="${farben[i % 4]}"/>`;
  }
  k += `<path d="M${r(-R)} ${r(rand)} Q${r(-R * 0.5)} ${r(top + 1)} ${r(-0.08 * s)} ${r(top)} Q${r(R * 0.5)} ${r(top + 1)} ${r(R)} ${r(rand)}" fill="none" stroke="#fff" stroke-width=".5" opacity=".5"/>`;
  /* Unterseite (Rand vorn) mit Speichen */
  k += `<path d="M${r(-R)} ${r(rand)} A${r(R)} ${r(ry)} 0 0 0 ${r(R)} ${r(rand)} A${r(R)} ${r(ry * 0.5)} 0 0 1 ${r(-R)} ${r(rand)} Z" fill="#2a2a24" opacity=".28"/>`;
  for (let i = 1; i < 8; i++) { const a = Math.PI * i / 8; k += `<line x1="${r(-0.08 * s)}" y1="${r(rand + ry * 0.3)}" x2="${r(-Math.cos(a) * R * 0.98)}" y2="${r(rand + Math.sin(a) * ry * 0.95)}" stroke="#6d6d66" stroke-width=".25"/>`; }
  /* Volant am Rand */
  for (let i = 0; i < 16; i++) { const a = Math.PI * i / 16, a2 = Math.PI * (i + 1) / 16; k += `<path d="M${r(-Math.cos(a) * R)} ${r(rand + Math.sin(a) * ry)} Q${r(-Math.cos((a + a2) / 2) * R)} ${r(rand + Math.sin((a + a2) / 2) * ry + 1.6)} ${r(-Math.cos(a2) * R)} ${r(rand + Math.sin(a2) * ry)}" fill="${farben[Math.floor(i / 2) % 4]}"/>`; }
  S.teil({ id: "sonnenschirm", de: "der Sonnenschirm", syl: "SON-nen-schirm", it: "l'ombrellone", itSyl: "om-brel-LO-ne", en: "beach umbrella", x: SCH.x, y: SCH.y, steht: true, kunst: k,
    tipp: "Sonnenschirme und Stühle leiht man an den Strandbuden aus." });
}
const ST = { x: 258, y: 176 };
{
  const s = sy(ST.y);                          /* ≈ 47,5 Einheiten je Meter */
  const AL = S.lg("alu", [[0, "#eef1f2"], [0.5, "#b9c0c4"], [1, "#dfe3e5"]], 0, 0, 1, 0);
  let k = schatten(-0.3 * s, 0, 0.42 * s, 0.07 * s, 0.3);
  /* Klappstuhl aus Aluminium, Sitz 0,25 m, Lehne schräg nach hinten (vom Betrachter weg = nach oben) */
  const w = 0.56 * s, sitz = -0.26 * s, tief = 0.09 * s, lehne = -0.88 * s;
  k += `<line x1="${r(-w / 2)}" y1="0" x2="${r(-w / 2 + 2)}" y2="${r(sitz - tief)}" stroke="${AL}" stroke-width="1"/><line x1="${r(w / 2)}" y1="0" x2="${r(w / 2 - 2)}" y2="${r(sitz - tief)}" stroke="${AL}" stroke-width="1"/>`;
  k += `<line x1="${r(-w / 2 + 1)}" y1="${r(-0.5)}" x2="${r(-w / 2 + 3)}" y2="${r(sitz + 2)}" stroke="#9aa1a6" stroke-width=".8"/><line x1="${r(w / 2 - 1)}" y1="${r(-0.5)}" x2="${r(w / 2 - 3)}" y2="${r(sitz + 2)}" stroke="#9aa1a6" stroke-width=".8"/>`;
  /* Lehne (gestreifter Stoff) */
  const lehneP = `M${r(-w / 2 + 2.6)} ${r(sitz - tief)} L${r(-w / 2 + 4.2)} ${r(lehne)} L${r(w / 2 - 4.2)} ${r(lehne)} L${r(w / 2 - 2.6)} ${r(sitz - tief)} Z`;
  const cid = S.id("stuhlclip");
  S.def(`<clipPath id="${cid}"><path d="${lehneP}"/></clipPath>`);
  let streifen = "";
  for (let i = 0; i < 8; i++) streifen += `<rect x="${r(-w / 2 + i * w / 8)}" y="${r(lehne)}" width="${r(w / 8 + 0.1)}" height="${r(-lehne)}" fill="${["#e84a3c", "#ffffff", "#2f6fc0", "#ffffff"][i % 4]}"/>`;
  k += `<g clip-path="url(#${cid})">${streifen}<rect x="${r(-w / 2)}" y="${r(lehne)}" width="${r(w)}" height="${r(-lehne)}" fill="${S.lg("lehneschatten", [[0, "#000", 0.05], [1, "#000", 0.22]])}"/></g>`;
  k += `<path d="M${r(-w / 2 + 4.2)} ${r(lehne)} L${r(w / 2 - 4.2)} ${r(lehne)}" stroke="${AL}" stroke-width="1"/>`;
  k += `<path d="M${r(-w / 2 + 2.6)} ${r(sitz - tief)} L${r(-w / 2 + 4.2)} ${r(lehne)} M${r(w / 2 - 2.6)} ${r(sitz - tief)} L${r(w / 2 - 4.2)} ${r(lehne)}" stroke="${AL}" stroke-width=".9"/>`;
  /* Sitzfläche (Stoff, von oben schräg) */
  k += `<path d="M${r(-w / 2 + 1.4)} ${r(sitz)} L${r(w / 2 - 1.4)} ${r(sitz)} L${r(w / 2 - 2.6)} ${r(sitz - tief)} L${r(-w / 2 + 2.6)} ${r(sitz - tief)} Z" fill="#d23f33"/>`;
  k += `<path d="M${r(-w / 2 + 1.4)} ${r(sitz)} L${r(w / 2 - 1.4)} ${r(sitz)}" stroke="${AL}" stroke-width="1.1"/>`;
  /* Armlehnen */
  k += `<path d="M${r(-w / 2 + 0.6)} ${r(sitz - 0.18 * s)} L${r(-w / 2 + 3.4)} ${r(sitz - 0.2 * s - tief)} M${r(w / 2 - 0.6)} ${r(sitz - 0.18 * s)} L${r(w / 2 - 3.4)} ${r(sitz - 0.2 * s - tief)}" stroke="#e9ecee" stroke-width="1.1" stroke-linecap="round"/>`;
  k += `<line x1="${r(-w / 2 + 0.6)}" y1="${r(sitz - 0.18 * s)}" x2="${r(-w / 2 + 1)}" y2="${r(sitz)}" stroke="#c3c9cc" stroke-width=".7"/><line x1="${r(w / 2 - 0.6)}" y1="${r(sitz - 0.18 * s)}" x2="${r(w / 2 - 1)}" y2="${r(sitz)}" stroke="#c3c9cc" stroke-width=".7"/>`;
  S.teil({ id: "liegestuhl", de: "der Liegestuhl", syl: "LIE-ge-stuhl", it: "la sdraio", itSyl: "SDRA-io", en: "beach chair", x: ST.x, y: ST.y, steht: true, kunst: k });
  /* DAS TAMBURIN (Pandeiro) liegt auf dem Sitz */
  {
    const d = 0.26 * s;
    let g = `<ellipse cx="0" cy="0" rx="${r(d / 2)}" ry="${r(d * 0.16)}" fill="#8a5a2a"/>`;
    g += `<path d="M${r(-d / 2)} 0 L${r(-d / 2)} -1.4 A${r(d / 2)} ${r(d * 0.16)} 0 0 1 ${r(d / 2)} -1.4 L${r(d / 2)} 0 A${r(d / 2)} ${r(d * 0.16)} 0 0 1 ${r(-d / 2)} 0 Z" fill="${S.lg("holzring", [[0, "#c98a4a"], [1, "#8a5626"]])}"/>`;
    g += `<ellipse cx="0" cy="-1.4" rx="${r(d / 2 - 0.4)}" ry="${r(d * 0.16 - 0.15)}" fill="#f1e6cf"/>`;
    for (let i = 0; i < 5; i++) { const a = Math.PI * (0.15 + i * 0.175); g += `<ellipse cx="${r(-Math.cos(a) * d / 2)}" cy="${r(-0.7 + Math.sin(a) * d * 0.16)}" rx=".75" ry=".55" fill="#d8dcdf" stroke="#8b9196" stroke-width=".12"/>`; }
    S.teil({ oben: true, id: "tamburin", de: "das Tamburin", syl: "TAM-bu-rin", it: "il tamburello", itSyl: "tam-bu-REL-lo", en: "tambourine", x: ST.x + 0.6, y: ST.y + r(sitz - tief * 0.5), kunst: g,
      tipp: "In Brasilien heißt es Pandeiro. Ohne Pandeiro gibt es keinen Samba." });
  }
}

/* =====================================================================
   18 — DER JUNGE (Brasilien-Trikot) und 19 — DER FUSSBALL
   ===================================================================== */
const JU = { x: 168, y: 186 };
{
  const s = sy(JU.y);
  const m = B.mensch({ id: "rio_junge", geschlecht: "m", alter: "kind", pose: "laufen", blick: 32, frisur: "locken", haarfarbe: "schwarz", haut: "dunkel", laecheln: true,
    kleidung: { oberteil: { stueck: "badeshirt", farbe: "#f6d21e" }, unterteil: { stueck: "badehose", farbe: "#1d4fa0" } } }, 1.34 * s);
  /* Schatten fällt nach links vorn (Sonne vorn rechts) */
  const sch = `<ellipse cx="-9" cy="2.4" rx="13" ry="2.2" fill="#6b4a1e" opacity=".22" filter="url(#bw_weich)" transform="rotate(10 -9 2.4)"/>`;
  /* grüner Kragen und Ärmelsaum wie beim Trikot der Seleção */
  const [hx, hy] = m.z.punkte.hals;
  const kragen = `<path d="M${r(hx * m.k - 2.6)} ${r(hy * m.k + 1.6)} Q${r(hx * m.k)} ${r(hy * m.k + 3.6)} ${r(hx * m.k + 2.6)} ${r(hy * m.k + 1.6)}" stroke="#139a43" stroke-width=".9" fill="none"/>`;
  S.teil({ id: "junge", de: "der Junge", syl: "JUN-ge", it: "il ragazzo", itSyl: "ra-GAZ-zo", en: "boy", x: JU.x, y: JU.y, kunst: sch + knapp(m.svg) + kragen,
    tipp: "Der Junge trägt das gelbe Trikot der brasilianischen Fußballmannschaft." });
}
{
  const s = sy(JU.y + 1);
  const d = 0.22 * s;
  let g = `<ellipse cx="-3" cy=".6" rx="${r(d * 0.75)}" ry="${r(d * 0.14)}" fill="#6b4a1e" opacity=".3" filter="url(#bw_weich)"/>`;
  g += `<circle cx="0" cy="${r(-d / 2)}" r="${r(d / 2)}" fill="${S.rg("ball", [[0, "#ffffff"], [0.7, "#e9e9e6"], [1, "#b9bab6"]], 0.65, 0.3, 0.8)}"/>`;
  const fuenf = (cx, cy, rr) => `<path d="M${[0, 1, 2, 3, 4].map((i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return `${r(cx + Math.cos(a) * rr)} ${r(cy + Math.sin(a) * rr)}`; }).join(" L")} Z" fill="#1d1d1f"/>`;
  g += fuenf(0.4, -d / 2 - 0.3, d * 0.16) + fuenf(-d * 0.34, -d * 0.62, d * 0.1) + fuenf(d * 0.32, -d * 0.26, d * 0.1) + fuenf(-d * 0.1, -d * 0.12, d * 0.08) + fuenf(d * 0.2, -d * 0.86, d * 0.08);
  g += `<path d="M${r(0.4)} ${r(-d / 2 - 0.3)} L${r(-d * 0.34)} ${r(-d * 0.62)} M${r(0.4)} ${r(-d / 2 - 0.3)} L${r(d * 0.32)} ${r(-d * 0.26)} M${r(0.4)} ${r(-d / 2 - 0.3)} L${r(d * 0.2)} ${r(-d * 0.86)}" stroke="#8d8e8a" stroke-width=".18"/>`;
  S.teil({ oben: true, id: "fussball", de: "der Fußball", syl: "FUSS-ball", it: "il pallone", itSyl: "pal-LO-ne", en: "football", x: JU.x + 24, y: JU.y + 1, kunst: g,
    tipp: "Am Strand spielen die Kinder „Altinha“: Der Ball soll nicht auf den Sand fallen." });
}

/* =====================================================================
   20 — DIE FLIPFLOPS (Havaianas) im Sand vorn
   ===================================================================== */
{
  const s = sy(192);
  const L = 0.26 * s, B2 = 0.1 * s;
  const sohle = (dx, rot, gruen) => {
    let g = `<g transform="translate(${dx} 0) rotate(${rot})">`;
    g += `<path d="M0 ${r(-L * 0.28)} Q${r(B2 * 0.55)} ${r(-L * 0.28)} ${r(B2 * 0.5)} 0 Q${r(B2 * 0.42)} ${r(L * 0.22)} 0 ${r(L * 0.24)} Q${r(-B2 * 0.42)} ${r(L * 0.22)} ${r(-B2 * 0.5)} 0 Q${r(-B2 * 0.55)} ${r(-L * 0.28)} 0 ${r(-L * 0.28)} Z" fill="${gruen ? "#1e8a4c" : "#f6d21e"}"/>`;
    g += `<path d="M0 ${r(-L * 0.25)} Q${r(B2 * 0.45)} ${r(-L * 0.24)} ${r(B2 * 0.42)} 0 Q${r(B2 * 0.36)} ${r(L * 0.19)} 0 ${r(L * 0.2)} Q${r(-B2 * 0.36)} ${r(L * 0.19)} ${r(-B2 * 0.42)} 0 Q${r(-B2 * 0.45)} ${r(-L * 0.24)} 0 ${r(-L * 0.25)} Z" fill="${gruen ? "#f6d21e" : "#1e8a4c"}"/>`;
    /* Riemen (Y-Form), kleine Flagge am Riemen */
    g += `<path d="M0 ${r(-L * 0.17)} Q${r(-B2 * 0.3)} ${r(-L * 0.04)} ${r(-B2 * 0.44)} ${r(L * 0.04)} M0 ${r(-L * 0.17)} Q${r(B2 * 0.3)} ${r(-L * 0.04)} ${r(B2 * 0.44)} ${r(L * 0.04)}" stroke="${gruen ? "#f6d21e" : "#1e8a4c"}" stroke-width="${r(B2 * 0.16)}" fill="none" stroke-linecap="round"/>`;
    g += `<rect x="${r(B2 * 0.12)}" y="${r(-L * 0.06)}" width="${r(B2 * 0.22)}" height="${r(B2 * 0.15)}" fill="#009b3a"/><path d="M${r(B2 * 0.14)} ${r(-L * 0.06 + B2 * 0.075)} L${r(B2 * 0.23)} ${r(-L * 0.06 + 0.1)} L${r(B2 * 0.32)} ${r(-L * 0.06 + B2 * 0.075)} L${r(B2 * 0.23)} ${r(-L * 0.06 + B2 * 0.15 - 0.1)} Z" fill="#fedf00"/>`;
    g += `</g>`;
    return g;
  };
  /* von oben gesehen in der Tiefe verkürzt */
  let k = schatten(-1.6, 0.6, L * 0.5, 1.2, 0.2);
  k += `<g transform="scale(1 .62)">${sohle(-4.4, -12, false)}${sohle(4.4, 24, true)}</g>`;
  S.teil({ oben: true, id: "flipflops", de: "die Flipflops", syl: "FLIP-flops", it: "le infradito", itSyl: "in-fra-DI-to", en: "flip-flops", x: 62, y: 192, kunst: k,
    tipp: "Die bunten Flipflops aus Brasilien heißen Havaianas." });
}

/* Licht: warmer Schein der Morgensonne von rechts oben (fängt nichts ab) */
S.davor(`<rect width="320" height="200" fill="${S.rg("morgenlicht", [[0, "#fff4cf", 0.22], [0.45, "#fff4cf", 0.05], [1, "#fff4cf", 0]], 1, 0, 0.9)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/rio.js"));
console.log(aus);
