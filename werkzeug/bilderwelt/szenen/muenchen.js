#!/usr/bin/env node
/* =====================================================================
   MÜNCHEN (FASSUNG 852) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (muenchen.de „Theresienwiese“ und „Frauenkirche“,
   oktoberfest.de, Wetterdienst zum Föhn):
   - STANDORT: der Biergarten vor einem Festzelt auf der Wiesn
     (Theresienwiese), Blick nach Osten/Südosten, Vormittag bei Föhn.
     Echte Richtungen von hier: Frauenkirche und Rathausturm im
     Ost-Nordosten (links, gut 2 km) über den Dächern der Ludwigsvorstadt,
     daneben der Turm von St. Peter („Alter Peter“); das Festzelt an der
     Wirtsbudenstraße; das Riesenrad im Süden der Wiesn (rechts); bei Föhn
     die Alpen am Horizont im Süden/Südosten (Wendelstein, Mangfallgebirge).
   - FRAUENKIRCHE: spätgotischer Backsteinbau, zwei fast 99 m hohe Türme,
     unten viereckig, oben achteckig, mit grünen „Welschen Hauben“ und
     kleiner Laterne; dahinter das riesige, steile Dach des Langhauses.
     Kein Haus in der Altstadt darf höher sein.
   - NEUES RATHAUS: neugotisch, Turm 85 m, mit dem Glockenspiel im Erker
     (bunte Figuren, Schäfflertanz), darüber Uhr, Galerie mit Ecktürmchen,
     grüne Spitze mit dem Münchner Kindl.
   - WIESN: Festzelte mit Holz-/Stofffassade, Tortürmen, weiß-blauen
     Rautenfahnen, Girlanden, blau-weiß gestreiftem Zeltdach; im Biergarten
     davor Bierzeltgarnituren (Tisch und Bänke), Maßkrug (1 Liter),
     Wiesn-Brezn, Hendl, Radi (spiralig geschnitten, gesalzen),
     Lebkuchenherzen am Band („I mog di“); die Bedienung im Dirndl trägt
     mehrere Maßkrüge auf einmal; Fass als Stehtisch; Tracht: Lederhose
     mit Hosenträgern (H-Steg), Trachtenhut, Wadlstrümpfe, Haferlschuhe.
   - FÖHN: warmer Fallwind, sehr klare Luft, tiefblauer Himmel, linsen-
     förmige Föhnwolken; dann sieht man von München die Alpen.
   Maßstab: Augenhöhe y = 104 (≈ 2,5 m, man steht auf der Stufe am
   Zeltaufgang). Vorne gilt: Einheiten je Meter = (y − 104) · 0,4.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "muenchen", titel: "München", emoji: "🥨", thema: "Deutschland", kuerzel: "b21b", fassung: 852 });
const rnd = zufall(1158);
const r = B.r;
const HOR = 104;
const km = (y) => (y - HOR) * 0.4;

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".35"/></filter>`);
const BACKSTEIN = S.lg("backstein", [[0, "#8a3d29"], [0.45, "#a9553a"], [0.8, "#97472f"], [1, "#6e2f1f"]], 0, 0, 1, 0);
const KUPFER = S.lg("kupfer", [[0, "#4f8a72"], [0.4, "#8cc3aa"], [0.7, "#6aa58b"], [1, "#3e6f5c"]], 0, 0, 1, 0);
const STEIN = S.lg("rathausstein", [[0, "#6f6c66"], [0.45, "#a39f96"], [0.8, "#8c887f"], [1, "#5f5c56"]], 0, 0, 1, 0);
const HOLZ = S.lg("holz", [[0, "#c79a62"], [1, "#9c6e3a"]]);
const HOLZ_V = S.lg("holzv", [[0, "#8a5e30"], [0.5, "#b58550"], [1, "#7f552b"]], 0, 0, 1, 0);
const BLAU = "#2f7fd0";

/* =====================================================================
   KULISSE — Föhnhimmel, Dächer der Stadt, Wiesn, Biergarten
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 1}" fill="${S.lg("himmel", [[0, "#2f6dbf"], [0.6, "#7fb0e0"], [1, "#d6e7f3"]])}"/>`);
/* Dächer der Ludwigsvorstadt mit Kaminen, ganz hinten im Dunst */
{
  let c = "";
  let x = -2;
  while (x < 322) {
    const w = 7 + rnd() * 9, h = 3 + rnd() * 4, dach = 2 + rnd() * 2.5;
    c += `<rect x="${r(x)}" y="${r(HOR - h)}" width="${r(w + 0.3)}" height="${r(h)}" fill="${rnd() < 0.5 ? "#d9cfc0" : "#e5ddd0"}"/>`;
    c += `<path d="M${r(x - 0.4)} ${r(HOR - h)} L${r(x + 1.6)} ${r(HOR - h - dach)} L${r(x + w - 1.6)} ${r(HOR - h - dach)} L${r(x + w + 0.4)} ${r(HOR - h)} Z" fill="${rnd() < 0.6 ? "#b5674c" : "#9e5a44"}"/>`;
    for (let i = 0; i < w / 2.6 - 1; i++) c += `<rect x="${r(x + 1.2 + i * 2.6)}" y="${r(HOR - h + 1)}" width=".9" height="1.1" fill="#7d8a96" opacity=".7"/>`;
    if (rnd() < 0.4) c += `<rect x="${r(x + w * 0.7)}" y="${r(HOR - h - dach - 1.4)}" width=".9" height="1.8" fill="#8c5a46"/>`;
    x += w;
  }
  c += `<rect x="0" y="${HOR - 9}" width="320" height="9" fill="#c8d6e2" opacity=".28"/>`;
  /* Alter Peter: Turm mit grüner Laternenhaube (rechts neben dem Rathaus) */
  c += `<rect x="139" y="66" width="5.4" height="34" fill="${S.lg("peter", [[0, "#c9bba3"], [0.5, "#ece2d0"], [1, "#b6a78d"]], 0, 0, 1, 0)}"/>`;
  c += `<circle cx="141.7" cy="72" r="1.5" fill="#f4efe4" stroke="#6a5a3c" stroke-width=".2"/>`;
  c += `<path d="M138.6 66 Q141.7 61 144.8 66 Z" fill="${KUPFER}"/><rect x="140.4" y="58.6" width="2.6" height="3.2" fill="${KUPFER}"/><path d="M140 58.8 Q141.7 55.6 143.4 58.8 Z" fill="${KUPFER}"/><line x1="141.7" y1="55.6" x2="141.7" y2="53" stroke="#3e5f4f" stroke-width=".3"/>`;
  S.hinten(c);
}
/* Wiesn: Fahrweg, ferne Buden mit bunten Dächern */
{
  let c = `<rect x="0" y="${HOR}" width="320" height="24" fill="${S.lg("wiesnweg", [[0, "#c8c3b8"], [1, "#a9a397"]])}"/>`;
  const buden = [[4, "#d8443a"], [26, "#f2c62f"], [50, "#3c8fd8"], [74, "#e46aa0"], [98, "#59a85a"], [118, "#d8443a"], [262, "#f2c62f"], [298, "#3c8fd8"]];
  for (const [x, f] of buden) {
    c += `<rect x="${x}" y="${HOR - 1}" width="16" height="7" fill="#f3ead7"/><path d="M${x - 1} ${HOR - 1} L${x + 8} ${HOR - 5} L${x + 17} ${HOR - 1} Z" fill="${f}"/>`;
    c += `<rect x="${x + 2}" y="${HOR + 1.4}" width="12" height="2.2" fill="#4a3a2a" opacity=".6"/><rect x="${x + 2}" y="${HOR}" width="12" height="1.2" fill="#fff8e0"/>`;
  }
  for (let i = 0; i < 26; i++) { const x = 4 + rnd() * 120, y = HOR + 6 + rnd() * 3; c += `<rect x="${r(x)}" y="${r(y - 2.4)}" width=".9" height="2.4" rx=".4" fill="${["#3b4a6b", "#7a2f2f", "#2f5a3a", "#6b5a3b"][i % 4]}"/><circle cx="${r(x + 0.45)}" cy="${r(y - 2.8)}" r=".5" fill="#e0b896"/>`; }
  for (let i = 0; i < 14; i++) { const x = 250 + rnd() * 66, y = HOR + 6 + rnd() * 3; c += `<rect x="${r(x)}" y="${r(y - 2.4)}" width=".9" height="2.4" rx=".4" fill="${["#3b4a6b", "#7a2f2f", "#2f5a3a", "#6b5a3b"][i % 4]}"/><circle cx="${r(x + 0.45)}" cy="${r(y - 2.8)}" r=".5" fill="#e0b896"/>`; }
  /* Biergarten: Kies, niedriger Holzzaun mit Geranien, hinten weitere Tische */
  const ZAUN = 124;
  c += `<rect x="0" y="${ZAUN}" width="320" height="${200 - ZAUN}" fill="${S.lg("kies", [[0, "#d3c6a8"], [1, "#bfae8c"]])}"/>`;
  for (let i = 0; i < 460; i++) { const y = ZAUN + 1 + Math.pow(rnd(), 0.8) * (199 - ZAUN); c += `<circle cx="${r(rnd() * 320)}" cy="${r(y)}" r="${r(0.12 + (y - ZAUN) * 0.006 + rnd() * 0.2)}" fill="${["#efe6d2", "#a8977a", "#c9b994", "#8f7f63"][i % 4]}" opacity=".7"/>`; }
  c += `<rect x="0" y="${ZAUN - 6.4}" width="320" height="1.3" fill="${HOLZ}"/><rect x="0" y="${ZAUN - 3}" width="320" height="1.1" fill="${HOLZ}"/>`;
  for (let x = 2; x < 320; x += 4.4) c += `<rect x="${r(x)}" y="${ZAUN - 7.4}" width="1.1" height="7.6" fill="${HOLZ_V}"/>`;
  for (let x = 4; x < 320; x += 18) {
    c += `<rect x="${x}" y="${ZAUN - 10.4}" width="11" height="3.2" rx=".5" fill="#7a4f2a"/>`;
    for (let i = 0; i < 6; i++) c += `<circle cx="${r(x + 1.2 + i * 1.75)}" cy="${r(ZAUN - 10.8 - rnd() * 1)}" r="${r(0.7 + rnd() * 0.35)}" fill="${rnd() < 0.3 ? "#3f7a34" : "#d62b2b"}"/>`;
  }
  /* zwei Reihen Bierzeltgarnituren mit Gästen (klein, im Hintergrund) */
  const gast = (x, y, s, i) => {
    const farbe = ["#f4f1ea", "#3b4a6b", "#d8443a", "#2f5a3a", "#f2c62f", "#7a5a9a", "#e9e4da"][i % 7];
    return `<path d="M${r(x - 1.3 * s)} ${r(y)} L${r(x - 1.1 * s)} ${r(y - 3 * s)} Q${r(x)} ${r(y - 3.6 * s)} ${r(x + 1.1 * s)} ${r(y - 3 * s)} L${r(x + 1.3 * s)} ${r(y)} Z" fill="${farbe}"/>` +
      `<circle cx="${r(x)}" cy="${r(y - 4.3 * s)}" r="${r(0.95 * s)}" fill="${["#e8c39e", "#d9a882", "#c08a62"][i % 3]}"/>` +
      `<path d="M${r(x - 0.95 * s)} ${r(y - 4.5 * s)} Q${r(x)} ${r(y - 5.8 * s)} ${r(x + 0.95 * s)} ${r(y - 4.5 * s)} Z" fill="${["#3a2a1c", "#c9a24a", "#5a3a1f", "#8a8a8a"][i % 4]}"/>`;
  };
  for (const [y, s] of [[132, 1], [143, 1.4]]) {
    const tw = 70 * s, lst = y < 140 ? [12, 230] : [-30, 248];
    for (const x0 of lst) {
      for (let i = 0; i < 7; i++) c += gast(x0 + 6 * s + i * 9.2 * s, y - 2.6 * s, s, i + x0);
      c += `<rect x="${x0}" y="${r(y - 3.4 * s)}" width="${r(tw)}" height="${r(0.9 * s)}" fill="#b98a52"/><rect x="${x0}" y="${r(y - 2.5 * s)}" width="${r(tw)}" height="${r(0.5 * s)}" fill="#7a5530"/>`;
      for (let i = 0; i < 6; i++) c += `<rect x="${r(x0 + 4 * s + i * 11 * s)}" y="${r(y - 5.6 * s)}" width="${r(1.2 * s)}" height="${r(2.2 * s)}" fill="#7a3210" opacity=".9"/><rect x="${r(x0 + 4 * s + i * 11 * s)}" y="${r(y - 5.9 * s)}" width="${r(1.2 * s)}" height="${r(0.5 * s)}" fill="#e6c49c"/>`;
      c += `<path d="M${r(x0 + 6 * s)} ${y} L${r(x0 + 8 * s)} ${r(y - 2.5 * s)} L${r(x0 + 10 * s)} ${y} M${r(x0 + tw - 10 * s)} ${y} L${r(x0 + tw - 8 * s)} ${r(y - 2.5 * s)} L${r(x0 + tw - 6 * s)} ${y}" stroke="#4b5257" stroke-width="${r(0.4 * s)}" fill="none"/>`;
      c += `<ellipse cx="${r(x0 + tw / 2)}" cy="${r(y + 0.3)}" rx="${r(tw / 2)}" ry="${r(0.8 * s)}" fill="#000" opacity=".12"/>`;
    }
  }
  S.hinten(c);
}

/* =====================================================================
   1 — DIE WOLKE (Föhnwolke, linsenförmig)
   ===================================================================== */
{
  let k = "";
  for (const [dx, dy, w, h, o] of [[0, 0, 42, 4.2, 1], [8, -4, 28, 2.6, 0.9], [-6, 4.6, 30, 2.2, 0.85]]) {
    k += `<path d="M${-w / 2 + dx} ${dy} Q${dx} ${dy - h} ${w / 2 + dx} ${dy} Q${dx} ${dy + h * 0.55} ${-w / 2 + dx} ${dy} Z" fill="${S.lg("linse" + w, [[0, "#ffffff"], [0.7, "#eef3f8"], [1, "#b9c8d8"]])}" opacity="${o}"/>`;
  }
  S.teil({ id: "wolke", de: "die Wolke", syl: "WOL-ke", it: "la nuvola", itSyl: "NU-vo-la", en: "cloud", x: 214, y: 26, kunst: k,
    tipp: "Bei Föhn gibt es solche glatten Wolken. Dann ist die Luft so klar, dass man die Alpen sieht." });
}

/* =====================================================================
   2 — DIE ALPEN (bei Föhn am Horizont, rechts)
   ===================================================================== */
{
  let k = "";
  const kette = (spitzen, fuss, farbe, schnee, schatten2) => {
    let d = `M${spitzen[0][0]} ${fuss}`;
    for (const [x, y] of spitzen) d += ` L${x} ${y}`;
    d += ` L${spitzen[spitzen.length - 1][0]} ${fuss} Z`;
    let g = `<path d="${d}" fill="${farbe}"/>`;
    for (let i = 1; i < spitzen.length - 1; i++) {
      const [x, y] = spitzen[i], [xa, ya] = spitzen[i - 1], [xb, yb] = spitzen[i + 1];
      if (y > Math.min(ya, yb)) continue;
      const t = 0.42 + rnd() * 0.12;
      const lx = x + (xa - x) * t, ly = y + (ya - y) * t, rx2 = x + (xb - x) * t, ry2 = y + (yb - y) * t;
      g += `<path d="M${r(x)} ${r(y)} L${r(lx)} ${r(ly)} L${r(lx + (x - lx) * 0.3)} ${r(ly + 1)} L${r(x - 0.4)} ${r(y + (ly - y) * 1.3)} L${r(x + (rx2 - x) * 0.4)} ${r(ry2 + 1.2)} L${r(rx2)} ${r(ry2)} Z" fill="${schnee}"/>`;
      g += `<path d="M${r(x)} ${r(y)} L${r(lx)} ${r(ly)} L${r(lx + (x - lx) * 0.3)} ${r(ly + 1)} L${r(x - 0.4)} ${r(y + (ly - y) * 1.3)} Z" fill="${schatten2}"/>`;
    }
    return g;
  };
  /* hintere Kette (heller, mehr Schnee), vordere Kette (dunkler, Wald) */
  k += kette([[170, 100], [184, 90], [194, 84], [204, 88], [216, 74], [224, 80], [236, 68], [246, 76], [256, 71], [266, 80], [276, 73], [288, 82], [298, 74], [310, 80], [326, 76]], HOR, S.lg("alpenhinten", [[0, "#9db3cc"], [1, "#b9c9da"]]), "#f4f8fc", "#c9d7e8");
  k += kette([[170, 102], [186, 95], [200, 90], [212, 94], [226, 85], [238, 92], [252, 84], [264, 91], [278, 86], [292, 93], [306, 87], [326, 93]], HOR, S.lg("alpenvorn", [[0, "#6f86a3"], [1, "#8ea2b8"]]), "#e6eef6", "#b4c4d8");
  k += `<rect x="170" y="${HOR - 5}" width="156" height="5" fill="${S.lg("alpendunst", [[0, "#d6e7f3", 0], [1, "#d6e7f3", 0.9]])}"/>`;
  S.teil({ id: "alpen", de: "die Alpen", syl: "AL-pen", it: "le Alpi", itSyl: "AL-pi", en: "the Alps", x: 0, y: 0, kunst: `<g filter="url(#${S.id("dunst")})">${k}</g>`,
    tipp: "Die Alpen sind etwa 60 Kilometer von München entfernt." });
}

/* =====================================================================
   3 — DIE FRAUENKIRCHE (zwei Türme mit grünen Hauben)
   ===================================================================== */
{
  let k = "";
  /* Langhaus mit dem riesigen steilen Dach, nach rechts (Osten) */
  k += `<path d="M6 -8 L6 -20 L42 -20 L42 -8 Z" fill="${BACKSTEIN}"/>`;
  for (let x = 9; x < 41; x += 4.2) k += `<path d="M${x} -9 L${x} -17 Q${x + 0.8} -18.4 ${x + 1.6} -17 L${x + 1.6} -9 Z" fill="#4e3a33"/>`;
  k += `<path d="M2 -20 L13 -46 L40 -46 L46 -20 Z" fill="${S.lg("kirchdach", [[0, "#7d3b2a"], [1, "#5a281b"]])}"/>`;
  for (let i = 1; i < 9; i++) k += `<line x1="${r(2 + i * 0.3 * 4.1)}" y1="${r(-20 - i * 2.9)}" x2="${r(46 - i * 0.67)}" y2="${r(-20 - i * 2.9)}" stroke="#4a2116" stroke-width=".2"/>`;
  k += `<path d="M13 -46 L40 -46" stroke="#a0533a" stroke-width=".6"/>`;
  /* die beiden Türme: unten viereckig, oben achteckig, Uhr, Welsche Haube */
  for (const tx of [-7, 7]) {
    k += `<rect x="${tx - 5}" y="-58" width="10" height="58" fill="${BACKSTEIN}"/>`;
    k += `<rect x="${tx - 5}" y="-58" width="1" height="58" fill="#b9664a" opacity=".5"/><rect x="${tx + 4}" y="-58" width="1" height="58" fill="#5e2617" opacity=".5"/>`;
    for (const y of [-14, -26, -38, -50]) k += `<rect x="${tx - 5}" y="${y}" width="10" height=".5" fill="#6e2f1f"/>`;
    for (const y of [-20, -32, -44]) k += `<path d="M${tx - 0.6} ${y + 4} L${tx - 0.6} ${y - 1} Q${tx} ${y - 2} ${tx + 0.6} ${y - 1} L${tx + 0.6} ${y + 4} Z" fill="#3a2a24"/>`;
    k += `<circle cx="${tx}" cy="-54" r="2.2" fill="#f2ead8" stroke="#3a2a24" stroke-width=".3"/><path d="M${tx} -54 L${tx} -55.6 M${tx} -54 L${tx + 1.1} -53.6" stroke="#2a1d12" stroke-width=".3"/>`;
    /* achteckiges Obergeschoss mit Spitzbogen-Schallfenstern */
    k += `<path d="M${tx - 5} -58 L${tx - 4.3} -70 L${tx + 4.3} -70 L${tx + 5} -58 Z" fill="${BACKSTEIN}"/>`;
    k += `<line x1="${tx - 1.5}" y1="-58" x2="${tx - 1.4}" y2="-70" stroke="#6e2f1f" stroke-width=".35"/><line x1="${tx + 1.5}" y1="-58" x2="${tx + 1.4}" y2="-70" stroke="#6e2f1f" stroke-width=".35"/>`;
    for (const dx of [-3, 0, 3]) k += `<path d="M${tx + dx - 0.6} -60 L${tx + dx - 0.6} -66 Q${tx + dx} -67.4 ${tx + dx + 0.6} -66 L${tx + dx + 0.6} -60 Z" fill="#3a2a24"/>`;
    k += `<rect x="${tx - 4.6}" y="-71" width="9.2" height="1.1" fill="#a9553a"/>`;
    /* Welsche Haube: bauchig, grün patiniert, mit Laterne und Spitze */
    k += `<path d="M${tx - 4.6} -71 C${tx - 6.6} -74 ${tx - 5.4} -79.6 ${tx - 1.4} -80.4 L${tx - 0.9} -81.4 L${tx + 0.9} -81.4 L${tx + 1.4} -80.4 C${tx + 5.4} -79.6 ${tx + 6.6} -74 ${tx + 4.6} -71 Z" fill="${KUPFER}"/>`;
    k += `<path d="M${tx - 3} -73 Q${tx - 3.4} -77 ${tx - 1.4} -79.4" stroke="#b6e0cb" stroke-width=".5" fill="none" opacity=".7"/>`;
    k += `<rect x="${tx - 1}" y="-83.8" width="2" height="2.6" fill="${KUPFER}"/><rect x="${tx - 0.5}" y="-83.4" width="1" height="1.6" fill="#2f4a3e"/><path d="M${tx - 1.4} -83.8 Q${tx} -86.6 ${tx + 1.4} -83.8 Z" fill="${KUPFER}"/>`;
    k += `<line x1="${tx}" y1="-86.4" x2="${tx}" y2="-89" stroke="#3e5f4f" stroke-width=".35"/><circle cx="${tx}" cy="-88" r=".35" fill="#d8b04a"/>`;
  }
  /* Westfassade zwischen den Türmen mit Portal */
  k += `<rect x="-2" y="-40" width="4" height="40" fill="#8a3d29"/><path d="M-1.4 0 L-1.4 -5 Q0 -7.4 1.4 -5 L1.4 0 Z" fill="#3a2a24"/>`;
  k += `<rect x="-12" y="-6" width="58" height="6" fill="#d5cdbd" opacity=".0"/>`;
  S.teil({ id: "frauenkirche", de: "die Frauenkirche", syl: "FRAU-en-kir-che", it: "la Frauenkirche", itSyl: "FRAU-en-kir-che", en: "Church of Our Lady",
    x: 58, y: 99, kunst: `<g transform="scale(.8)">${k}</g>`, tipp: "Die zwei Türme der Frauenkirche sind fast 99 Meter hoch — das Wahrzeichen Münchens." });
}

/* =====================================================================
   4 — DAS RATHAUS (Neues Rathaus mit Turm und Glockenspiel)
   ===================================================================== */
{
  let k = "";
  /* Giebel des Rathauses über den Dächern */
  for (const [x, w, h] of [[-15, 8, 10], [9, 8, 9], [-23, 6, 6], [17, 7, 6]]) {
    k += `<path d="M${x} 0 L${x} ${-h + 2} L${x + w / 2} ${-h - 3} L${x + w} ${-h + 2} L${x + w} 0 Z" fill="${STEIN}"/>`;
    k += `<line x1="${x + w / 2}" y1="${-h - 3}" x2="${x + w / 2}" y2="${-h - 5}" stroke="#5f5c56" stroke-width=".4"/>`;
    for (let i = 0; i < Math.floor(w / 2.2); i++) k += `<rect x="${r(x + 1 + i * 2.2)}" y="${-h + 3}" width=".8" height="2.2" fill="#2f3439"/>`;
  }
  /* Turm */
  k += `<rect x="-3.6" y="-50" width="7.2" height="50" fill="${STEIN}"/>`;
  for (const y of [-6, -14, -22]) k += `<path d="M-1.4 ${y} L-1.4 ${y - 4} Q0 ${y - 5.4} 1.4 ${y - 4} L1.4 ${y} Z" fill="#2f3439"/>`;
  /* Glockenspiel-Erker mit zwei Etagen bunter Figuren */
  k += `<rect x="-4.8" y="-36" width="9.6" height="9" rx=".4" fill="#7c786f"/>`;
  for (const y of [-34.6, -30.2]) {
    k += `<rect x="-4.2" y="${y}" width="8.4" height="3" fill="#2a2e33"/>`;
    for (let i = 0; i < 6; i++) k += `<rect x="${r(-3.7 + i * 1.4)}" y="${r(y + 0.9)}" width=".8" height="1.8" rx=".3" fill="${["#c9302c", BLAU, "#f2c62f", "#3ca35a", "#f6f1e7", "#c9302c"][i]}"/><circle cx="${r(-3.3 + i * 1.4)}" cy="${r(y + 0.7)}" r=".38" fill="#e8c39e"/>`;
  }
  k += `<path d="M-4.8 -27 L0 -24 L4.8 -27 Z" fill="#6c6860"/>`;
  /* Uhr, Galerie mit Ecktürmchen, achteckiger Aufsatz, grüne Spitze, Kindl */
  k += `<circle cx="0" cy="-41" r="2.2" fill="#f4efe4" stroke="#3a3d42" stroke-width=".3"/><path d="M0 -41 L0 -42.6 M0 -41 L1 -40.4" stroke="#2a1d12" stroke-width=".3"/>`;
  k += `<rect x="-4.6" y="-51.4" width="9.2" height="1.6" fill="#7c786f"/>`;
  for (let x = -4.2; x < 4.4; x += 1.2) k += `<rect x="${r(x)}" y="-52.8" width=".4" height="1.4" fill="#5f5c56"/>`;
  for (const x of [-4.4, 4.4]) k += `<path d="M${x - 0.6} -51 L${x - 0.6} -54 L${x} -57.4 L${x + 0.6} -54 L${x + 0.6} -51 Z" fill="#7c786f"/>`;
  k += `<path d="M-2.6 -51.4 L-2.4 -57.4 L2.4 -57.4 L2.6 -51.4 Z" fill="${STEIN}"/><path d="M-1 -52 L-1 -55.6 L1 -55.6 L1 -52 Z" fill="#2f3439"/>`;
  k += `<path d="M-2.8 -57.4 Q-2 -61 0 -66 Q2 -61 2.8 -57.4 Z" fill="${KUPFER}"/>`;
  k += `<line x1="0" y1="-66" x2="0" y2="-67.6" stroke="#3e5f4f" stroke-width=".3"/>`;
  k += `<path d="M-.5 -67.4 L-.4 -69.6 Q0 -70.4 .4 -69.6 L.5 -67.4 Z" fill="#1d1d1d"/><circle cx="0" cy="-70.2" r=".4" fill="#e8c39e"/><path d="M-.4 -68.6 L-1.2 -69.6 M.4 -68.6 L1.1 -70" stroke="#d8b04a" stroke-width=".25"/>`;
  k += `<rect x="-3.6" y="-50" width="1.2" height="50" fill="#fff" opacity=".12"/>`;
  S.teil({ id: "rathaus", de: "das Rathaus", syl: "RAT-haus", it: "il municipio", itSyl: "mu-ni-CI-pio", en: "town hall",
    x: 116, y: 100, kunst: `<g transform="scale(.86)">${k}</g>`, tipp: "Am Rathausturm tanzen jeden Tag die Figuren vom Glockenspiel." });
}

/* =====================================================================
   5 — DAS RIESENRAD (Süden der Wiesn, rechts)
   ===================================================================== */
{
  const R = 21, HY = -27;
  let k = "";
  k += `<path d="M-12 0 L-1 ${HY} L1 ${HY} L12 0 M-9 0 L0 ${HY + 4} L9 0" stroke="#dfe3e6" stroke-width="1.1" fill="none"/>`;
  k += `<circle cx="0" cy="${HY}" r="${R}" fill="none" stroke="#f2f4f6" stroke-width=".9"/><circle cx="0" cy="${HY}" r="${R - 2}" fill="none" stroke="#e1e5e8" stroke-width=".45"/>`;
  for (let i = 0; i < 16; i++) {
    const a = i * Math.PI / 8, x = Math.cos(a) * R, y = HY + Math.sin(a) * R;
    k += `<line x1="0" y1="${HY}" x2="${r(x)}" y2="${r(y)}" stroke="#e8ebee" stroke-width=".3"/>`;
    k += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x)}" y2="${r(y + 1.6)}" stroke="#9aa3aa" stroke-width=".25"/>`;
    k += `<path d="M${r(x - 1.5)} ${r(y + 1.6)} L${r(x + 1.5)} ${r(y + 1.6)} L${r(x + 1.3)} ${r(y + 4)} L${r(x - 1.3)} ${r(y + 4)} Z" fill="${["#c9302c", BLAU, "#f2c62f", "#3ca35a"][i % 4]}"/><rect x="${r(x - 1.1)}" y="${r(y + 2.1)}" width="2.2" height="1" fill="#e8f1f6" opacity=".7"/>`;
  }
  k += `<circle cx="0" cy="${HY}" r="2" fill="#c9cfd4"/><circle cx="0" cy="${HY}" r=".8" fill="#7d868d"/>`;
  S.teil({ id: "riesenrad", de: "das Riesenrad", syl: "RIE-sen-rad", it: "la ruota panoramica", itSyl: "RUO-ta pa-no-RA-mi-ca", en: "Ferris wheel",
    x: 300, y: 106, kunst: `<g transform="scale(.8)">${k}</g>`, tipp: "Vom Riesenrad sieht man über die ganze Wiesn." });
}

/* =====================================================================
   6 — DAS FESTZELT (mit Tortürmen) — Lupe: Fahne, Eingang (FASSUNG 879: Wort „Festzelt“ statt „Bierzelt“)
   ===================================================================== */
{
  const ZX = 192, ZY = 110, ZS = 0.88;
  let k = schatten(0, 0.4, 56, 2, 0.3);
  /* Zeltdach: weiß-blau gestreift, weit nach hinten */
  for (let i = 0; i < 18; i++) {
    const x0 = -54 + i * 6;
    k += `<path d="M${x0} -18 L${x0 + 6} -18 L${x0 + 5.2} -30 L${x0 - 0.8 + (i === 0 ? 0.8 : 0)} -30 Z" fill="${i % 2 ? "#f6f7f8" : BLAU}"/>`;
  }
  k += `<path d="M-54 -30 L54 -30" stroke="#d9dde0" stroke-width=".5"/>`;
  /* Fassade: Holz, Fenster, drei Eingänge, Girlande */
  k += `<rect x="-50" y="-19" width="100" height="19" fill="${S.lg("fassade", [[0, "#f3ead7"], [1, "#dccbaa"]])}"/>`;
  for (let x = -48; x < 49; x += 2.4) k += `<line x1="${x}" y1="-18.6" x2="${x}" y2="0" stroke="#c9b48c" stroke-width=".2"/>`;
  for (const x of [-30, -20, 20, 30]) k += `<rect x="${x - 3}" y="-15" width="6" height="5" rx=".4" fill="#5a4630"/><rect x="${x - 2.6}" y="-14.6" width="5.2" height="1.6" fill="#f6dd96" opacity=".6"/>`;
  for (const x of [-25, 25]) k += `<path d="M${x - 4} 0 L${x - 4} -6 Q${x} -9 ${x + 4} -6 L${x + 4} 0 Z" fill="#3a2a1c"/>`;
  k += `<path d="M-50 -18.6 Q-44 -15.6 -38 -18.6 Q-32 -15.6 -26 -18.6 Q-20 -15.6 -14 -18.6 M14 -18.6 Q20 -15.6 26 -18.6 Q32 -15.6 38 -18.6 Q44 -15.6 50 -18.6" stroke="#3f7a34" stroke-width="1.4" fill="none"/>`;
  for (let x = -48; x < 49; x += 4) if (Math.abs(x) > 13) k += `<circle cx="${x}" cy="-16.6" r=".45" fill="${(x / 4) % 2 ? "#d62b2b" : "#f2c62f"}"/>`;
  /* Mittelbau: Giebel mit Schild, Balkon für die Blaskapelle, Hauptportal */
  k += `<path d="M-15 0 L-15 -30 L0 -44 L15 -30 L15 0 Z" fill="${S.lg("giebel", [[0, "#fbf6ea"], [1, "#e3d6b9"]])}"/>`;
  k += `<path d="M-15 -30 L0 -44 L15 -30" stroke="${BLAU}" stroke-width="1.4" fill="none"/>`;
  for (let i = 0; i < 7; i++) { const t = (i + 0.5) / 7; k += `<path d="M${r(-15 + 15 * t - 0.8)} ${r(-30 - 14 * t)} l.8 -1 .8 1 -.8 1 Z" fill="#fff"/><path d="M${r(15 - 15 * t - 0.8)} ${r(-30 - 14 * t)} l.8 -1 .8 1 -.8 1 Z" fill="#fff"/>`; }
  k += `<rect x="-12" y="-34" width="24" height="7" rx="1" fill="#1f4f8f"/><rect x="-11.4" y="-33.4" width="22.8" height="5.8" rx=".7" fill="none" stroke="#f2c62f" stroke-width=".3"/>`;
  k += `<text x="0" y="-29.2" font-size="3.6" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-weight="bold" letter-spacing=".3">FESTZELT</text>`;
  k += `<text x="0" y="-36.8" font-size="2.3" text-anchor="middle" fill="#8a5a1f" font-family="Georgia,serif" font-style="italic">Servus!</text>`;
  k += `<rect x="-12" y="-22" width="24" height="1.2" fill="#7a4f2a"/>`;
  for (let x = -11.5; x < 12; x += 1.6) k += `<rect x="${r(x)}" y="-25" width=".4" height="3" fill="#7a4f2a"/>`;
  k += `<rect x="-12" y="-25.4" width="24" height=".6" fill="#7a4f2a"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(-9 + i * 3.6)}" cy="-24.2" r=".7" fill="#e8c39e"/><rect x="${r(-9.6 + i * 3.6)}" y="-23.6" width="1.2" height="1.6" fill="${i % 2 ? "#2f5a3a" : "#3b4a6b"}"/>`;
  k += `<circle cx="-3" cy="-23.6" r=".9" fill="#d8b04a"/>`;
  /* Eingang mit Rundbogen */
  k += `<path d="M-7 0 L-7 -12 Q0 -19 7 -12 L7 0 Z" fill="${HOLZ_V}"/><path d="M-5.6 0 L-5.6 -11.4 Q0 -17 5.6 -11.4 L5.6 0 Z" fill="${S.lg("innen", [[0, "#6b4a2a"], [1, "#2a1d12"]])}"/>`;
  for (let i = 0; i < 5; i++) k += `<circle cx="${-3.6 + i * 1.8}" cy="-8" r=".5" fill="#ffd98a" opacity=".85"/>`;
  k += `<text x="0" y="-14.6" font-size="1.5" text-anchor="middle" fill="#fff" font-family="Arial">EINGANG</text>`;
  /* zwei Tortürme mit weiß-blauem Dach und Rautenfahne */
  for (const tx of [-21, 21]) {
    k += `<rect x="${tx - 4}" y="-40" width="8" height="40" fill="${S.lg("turm", [[0, "#efe4cc"], [0.5, "#fbf6ea"], [1, "#d9c9a6"]], 0, 0, 1, 0)}"/>`;
    k += `<rect x="${tx - 2}" y="-34" width="4" height="6" rx="2" fill="#3a2a1c"/>`;
    k += `<path d="M${tx - 5} -40 L${tx} -51 L${tx + 5} -40 Z" fill="${BLAU}"/>`;
    for (let i = 0; i < 4; i++) for (let j = 0; j <= i; j++) k += `<path d="M${r(tx - i * 1.1 + j * 2.2)} ${r(-49.2 + i * 2.4)} l.7 1 -.7 1 -.7 -1 Z" fill="#fff"/>`;
    k += `<line x1="${tx}" y1="-51" x2="${tx}" y2="-60" stroke="#c9cfd4" stroke-width=".35"/>`;
  }
  /* Rautenfahnen (Bayern) */
  const fahne = (x, y) => {
    let g = `<path d="M${x} ${y} q2.5 -.8 5 0 t5 0 l0 7 q-2.5 -.8 -5 0 t-5 0 Z" fill="#fff"/>`;
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) g += `<path d="M${r(x + 0.6 + i * 2.4 + (j % 2) * 1.2)} ${r(y + 1.4 + j * 2.2)} l1 -1 1 1 -1 1 Z" fill="#2f86d8"/>`;
    return g;
  };
  k += fahne(-21, -59.6) + fahne(21, -59.6);
  S.teil({ id: "festzelt", de: "das Festzelt", syl: "FEST-zelt", it: "il tendone della festa", itSyl: "ten-DO-ne del-la FE-sta", en: "festival tent",
    x: ZX, y: ZY, kunst: `<g transform="scale(${ZS})">${k}</g>`, tipp: "In einem Festzelt auf dem Oktoberfest haben Tausende Menschen Platz. Dort spielt eine Blaskapelle.",
    zoom: { x: ZX - 54, y: ZY - 60, w: 108, h: 66 },
    unter: [
      { id: "fahne", de: "die Fahne", syl: "FAH-ne", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: ZX - 21 * ZS, y: ZY - 52 * ZS, kunst: flaeche(-0.4, -7.6, 9.6, 7.6),
        tipp: "Die bayerische Fahne ist weiß-blau mit Rauten." },
      { id: "eingang", de: "der Eingang", syl: "EIN-gang", it: "l'ingresso", itSyl: "in-GRES-so", en: "entrance", x: ZX, y: ZY, kunst: flaeche(-6.2, -14, 12.4, 14) },
    ] });
}

/* =====================================================================
   7 — DAS FASS (als Stehtisch im Biergarten, rechts)
   ===================================================================== */
{
  const Y = 178, s = km(Y), H = 1.0 * s, W = 0.62 * s;
  let k = schatten(0, 0.4, W / 2 + 3, 1.8, 0.35);
  k += `<path d="M${r(-W / 2)} 0 Q${r(-W / 2 - 2.4)} ${r(-H / 2)} ${r(-W / 2)} ${r(-H)} L${r(W / 2)} ${r(-H)} Q${r(W / 2 + 2.4)} ${r(-H / 2)} ${r(W / 2)} 0 Z" fill="${S.lg("fass", [[0, "#5e3a1c"], [0.35, "#a8723c"], [0.6, "#8f5d2e"], [1, "#4a2c14"]], 0, 0, 1, 0)}"/>`;
  for (let i = 1; i < 6; i++) { const x = -W / 2 + i * W / 6; k += `<path d="M${r(x)} 0 Q${r(x * 1.12)} ${r(-H / 2)} ${r(x)} ${r(-H)}" stroke="#4a2c14" stroke-width=".3" fill="none"/>`; }
  for (const t of [0.12, 0.34, 0.66, 0.88]) { const bulge = Math.sin(t * Math.PI) * 2.3; k += `<rect x="${r(-W / 2 - bulge)}" y="${r(-H * t - 0.9)}" width="${r(W + 2 * bulge)}" height="1.8" rx=".5" fill="${S.lg("reif", [[0, "#3a3d42"], [0.5, "#8a9097"], [1, "#2d3034"]], 0, 0, 1, 0)}"/>`; }
  k += `<ellipse cx="0" cy="${r(-H)}" rx="${r(W / 2 + 0.6)}" ry="2.2" fill="${S.lg("fassdeckel", [[0, "#c79a62"], [1, "#8c5e30"]])}"/>`;
  k += `<ellipse cx="0" cy="${r(-H + 0.3)}" rx="2.4" ry=".7" fill="#4a2c14"/>`;
  k += `<ellipse cx="-4" cy="${r(-H * 0.5)}" rx="3" ry="3.4" fill="#f6efe0" opacity=".9"/><text x="-4" y="${r(-H * 0.5 + 1)}" font-size="2.6" text-anchor="middle" fill="${BLAU}" font-family="Georgia,serif" font-weight="bold">M</text>`;
  S.teil({ id: "fass", de: "das Fass", syl: "FASS", it: "la botte", itSyl: "BOT-te", en: "barrel", x: 290, y: Y, steht: true, kunst: k,
    tipp: "Das alte Holzfass hat Eisenreifen. Heute steht es hier als Stehtisch." });
}

/* Maßkrug: Glas, Henkel, Spezi (Cola mit Orangenlimo), heller Schaumrand — Fuß = Ursprung, h = Höhe.
   FASSUNG 879 — alkoholfrei wie alle Szenen (Funk 296 „Ja mach alles weiter"): vorher goldenes Bier. */
const MASS_GLAS = S.lg("massglas", [[0, "#cfe1e6", 0.85], [0.25, "#ffffff", 0.95], [0.6, "#d9e8ec", 0.7], [1, "#a9c2c9", 0.9]], 0, 0, 1, 0);
const MASS_BIER = S.lg("massspezi", [[0, "#8e3f14"], [0.5, "#6f2c0c"], [1, "#4f1d08"]], 0, 0, 1, 0);
const massKrug = (x, y, h, henkel = 1) => {
  const w = h * 0.62;
  let g = `<path d="M${r(x - w / 2)} ${r(y)} L${r(x - w / 2 + h * 0.03)} ${r(y - h)} L${r(x + w / 2 - h * 0.03)} ${r(y - h)} L${r(x + w / 2)} ${r(y)} Z" fill="${MASS_GLAS}"/>`;
  g += `<path d="M${r(x - w / 2 + h * 0.07)} ${r(y - h * 0.08)} L${r(x - w / 2 + h * 0.08)} ${r(y - h * 0.84)} L${r(x + w / 2 - h * 0.08)} ${r(y - h * 0.84)} L${r(x + w / 2 - h * 0.07)} ${r(y - h * 0.08)} Z" fill="${MASS_BIER}"/>`;
  g += `<rect x="${r(x - w / 2 + h * 0.06)}" y="${r(y - h * 0.9)}" width="${r(w - h * 0.12)}" height="${r(h * 0.08)}" rx="${r(h * 0.04)}" fill="#e6c49c"/>`;
  g += `<path d="M${r(x - w / 2 + h * 0.08)} ${r(y - h * 0.89)} q${r(w * 0.25)} ${r(-h * 0.04)} ${r(w * 0.5)} 0" fill="#f2dcc0"/>`;
  for (let i = 0; i < 5; i++) g += `<circle cx="${r(x - w * 0.25 + rnd() * w * 0.5)}" cy="${r(y - h * (0.2 + rnd() * 0.55))}" r="${r(h * 0.015 + 0.08)}" fill="#c9733a" opacity=".8"/>`;
  g += `<path d="M${r(x + henkel * w / 2 - henkel * h * 0.02)} ${r(y - h * 0.8)} q${r(henkel * h * 0.38)} 0 ${r(henkel * h * 0.38)} ${r(h * 0.32)} q0 ${r(h * 0.3)} ${r(-henkel * h * 0.38)} ${r(h * 0.3)}" stroke="#d9e8ec" stroke-width="${r(h * 0.1)}" fill="none" opacity=".9"/>`;
  g += `<rect x="${r(x - w * 0.36)}" y="${r(y - h * 0.82)}" width="${r(h * 0.07)}" height="${r(h * 0.7)}" fill="#fff" opacity=".55"/>`;
  g += `<ellipse cx="${r(x)}" cy="${r(y - h * 0.45)}" rx="${r(w * 0.2)}" ry="${r(h * 0.12)}" fill="${BLAU}" opacity=".75"/>`;
  return g;
};

/* =====================================================================
   8 — DIE KELLNERIN im Dirndl, hinter dem Tisch, trägt vier Maßkrüge
   ===================================================================== */
const TISCH = { x0: 96, x1: 204, y: 192 };
const TS = km(TISCH.y), PLATTE = TISCH.y - 0.77 * TS;
{
  const Y = 184, s = km(Y);
  const m = B.mensch({ id: "b21b_kell", geschlecht: "w", pose: "halten", blick: 0, frisur: "zopf", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "weiss" }, kleid: { stueck: "sommerkleid", farbe: "gruen_d" }, schuerze: { stueck: "schuerze", farbe: "rosa" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 1.68 * s);
  let krug = "";
  for (const hd of [m.z.handL, m.z.handR]) {
    const hx = hd.x * m.k, hy = hd.y * m.k, sg = hd.x > 0 ? 1 : -1, h = 0.24 * s;
    krug += massKrug(hx + sg * h * 0.55, hy + h * 0.45, h, -sg) + massKrug(hx + sg * h * 0.05, hy + h * 0.55, h, -sg);
  }
  S.teil({ id: "kellnerin", de: "die Kellnerin", syl: "KELL-ne-rin", it: "la cameriera", itSyl: "ca-me-RIE-ra", en: "waitress", x: 216, y: Y, kunst: m.svg + krug,
    tipp: "Die Kellnerin trägt ein Dirndl und viele Maßkrüge auf einmal." });
}

/* =====================================================================
   9 — DER TISCH und 10 — DIE BANK (Bierzeltgarnitur)
   ===================================================================== */
{
  const W = TISCH.x1 - TISCH.x0, s = TS;
  let k = schatten(0, 0.6, W / 2 + 4, 2, 0.35);
  /* Klappbeine aus Stahl */
  for (const sx of [-1, 1]) {
    const x = sx * (W / 2 - 10);
    k += `<path d="M${r(x - 5)} 0 L${r(x)} ${r(-0.74 * s)} L${r(x + 5)} 0" stroke="#4b5257" stroke-width="1.2" fill="none"/>`;
    k += `<line x1="${r(x - 2.6)}" y1="${r(-0.36 * s)}" x2="${r(x + 2.6)}" y2="${r(-0.36 * s)}" stroke="#4b5257" stroke-width=".6"/>`;
  }
  /* Tischplatte (Holz, von leicht oben) */
  k += `<path d="M${r(-W / 2 + 1)} ${r(-0.77 * s - 2.2)} L${r(W / 2 - 1)} ${r(-0.77 * s - 2.2)} L${r(W / 2)} ${r(-0.77 * s)} L${r(-W / 2)} ${r(-0.77 * s)} Z" fill="${S.lg("platte", [[0, "#c99c62"], [1, "#b2834a"]])}"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-0.77 * s)}" width="${r(W)}" height="2" fill="${HOLZ_V}"/>`;
  for (let x = -W / 2 + 6; x < W / 2; x += 9) k += `<line x1="${r(x)}" y1="${r(-0.77 * s - 2.1)}" x2="${r(x + 0.3)}" y2="${r(-0.77 * s)}" stroke="#9a6c38" stroke-width=".15"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-0.77 * s + 2)}" width="${r(W)}" height=".6" fill="#5e3c1e"/>`;
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: (TISCH.x0 + TISCH.x1) / 2, y: TISCH.y, steht: true, kunst: k });
}
{
  const Y = 199, s = km(Y), W = TISCH.x1 - TISCH.x0 + 4;
  let k = schatten(0, 0.4, W / 2 + 2, 1.4, 0.3);
  for (const sx of [-1, 1]) { const x = sx * (W / 2 - 10); k += `<path d="M${r(x - 4)} 0 L${r(x)} ${r(-0.45 * s)} L${r(x + 4)} 0" stroke="#4b5257" stroke-width="1.2" fill="none"/>`; }
  k += `<path d="M${r(-W / 2 + 1)} ${r(-0.47 * s - 2)} L${r(W / 2 - 1)} ${r(-0.47 * s - 2)} L${r(W / 2)} ${r(-0.47 * s)} L${r(-W / 2)} ${r(-0.47 * s)} Z" fill="${S.lg("bankplatte", [[0, "#cfa46a"], [1, "#b2834a"]])}"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-0.47 * s)}" width="${r(W)}" height="2.2" fill="${HOLZ_V}"/>`;
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panca", itSyl: "PAN-ca", en: "bench", x: (TISCH.x0 + TISCH.x1) / 2, y: Y, steht: true, kunst: k });
}

/* =====================================================================
   11 — AUF DEM TISCH: Maßkrug, Brezel, Hendl, Radi
   ===================================================================== */
{
  const h = 0.26 * TS;
  let k = schatten(0, 0.2, h * 0.45, h * 0.08, 0.3) + massKrug(0, 0, h, 1);
  S.teil({ oben: true, id: "bierkrug", de: "der Maßkrug", syl: "MASS-krug", it: "il boccale", itSyl: "boc-CA-le", en: "one-litre mug", x: 118, y: PLATTE - 1, steht: true, kunst: k,
    tipp: "In einen Maßkrug passt ein Liter. Hier ist Spezi drin: Cola mit Orangenlimo." });
}
{
  /* Wiesn-Brezn auf einem Holzbrett */
  const s = TS / 44;
  let k = `<path d="M-6 0 L6 0 L5.4 -1 L-5.4 -1 Z" fill="${HOLZ}" transform="scale(${r(s)})"/>`;
  const L = S.rg("lauge", [[0, "#b36a2c"], [0.6, "#8a4614"], [1, "#5e2c0a"]], 0.4, 0.35, 0.8);
  const p = (dx, dy) => `${r(dx * s)} ${r((dy - 6) * s)}`;
  const zug = `M${p(-5, 4)} C${p(-8, 1)} ${p(-6, -5)} ${p(-1, -4.6)} C${p(3, -4.2)} ${p(4, 0)} ${p(1.2, 2.6)} M${p(5, 4)} C${p(8, 1)} ${p(6, -5)} ${p(1, -4.6)} C${p(-3, -4.2)} ${p(-4, 0)} ${p(-1.2, 2.6)}`;
  k += `<path d="${zug}" stroke="${L}" stroke-width="${r(2.4 * s)}" fill="none" stroke-linecap="round"/>`;
  k += `<path d="${zug}" stroke="#d08a4a" stroke-width="${r(0.6 * s)}" opacity=".5" fill="none" stroke-linecap="round" transform="translate(-.3 -.4)"/>`;
  for (let i = 0; i < 10; i++) k += `<rect x="${r((-5 + rnd() * 10) * s)}" y="${r((-10 + rnd() * 6) * s)}" width="${r(0.35 * s)}" height="${r(0.3 * s)}" fill="#fffaf0"/>`;
  S.teil({ oben: true, id: "brezel", de: "die Brezel", syl: "BRE-zel", it: "il bretzel", itSyl: "BRET-zel", en: "pretzel", x: 140, y: PLATTE - 1, steht: true, kunst: k,
    tipp: "In Bayern sagt man „die Brezn“." });
}
{
  /* Das halbe Hendl auf dem Teller */
  const s = TS / 44;
  let k = `<ellipse cx="0" cy="${r(-0.6 * s)}" rx="${r(7 * s)}" ry="${r(1.4 * s)}" fill="#f6f6f2" stroke="#d6d4cc" stroke-width=".2"/>`;
  k += `<path d="M${r(-5 * s)} ${r(-1 * s)} Q${r(-5.4 * s)} ${r(-5.6 * s)} ${r(-1 * s)} ${r(-6 * s)} Q${r(3.6 * s)} ${r(-6 * s)} ${r(4 * s)} ${r(-2.6 * s)} L${r(5.4 * s)} ${r(-3.6 * s)} Q${r(6.4 * s)} ${r(-3 * s)} ${r(5.6 * s)} ${r(-1.8 * s)} L${r(3.6 * s)} ${r(-1 * s)} Z" fill="${S.rg("hendl", [[0, "#e6a457"], [0.6, "#b86a24"], [1, "#7e4214"]], 0.4, 0.3, 0.8)}"/>`;
  k += `<path d="M${r(-3 * s)} ${r(-4.4 * s)} Q${r(-1 * s)} ${r(-5.6 * s)} ${r(1.6 * s)} ${r(-4.6 * s)}" stroke="#ffd59a" stroke-width="${r(0.5 * s)}" opacity=".6" fill="none"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r((-3 + rnd() * 6) * s)}" cy="${r((-4.6 + rnd() * 2.6) * s)}" r="${r(0.2 * s)}" fill="#5a7a2a"/>`;
  k += `<path d="M${r(-6.4 * s)} ${r(-1.4 * s)} q${r(1 * s)} ${r(-1.6 * s)} ${r(2 * s)} 0" fill="#f2d54a"/>`;
  S.teil({ oben: true, id: "hendl", de: "das Hendl", syl: "HEN-dl", it: "il pollo arrosto", itSyl: "POL-lo ar-RO-sto", en: "roast chicken", x: 166, y: PLATTE - 1, steht: true, kunst: k,
    tipp: "„Hendl“ sagen die Bayern zum Brathähnchen." });
}
{
  /* Der Radi: spiralig geschnitten, gesalzen, auf dem Brettl */
  const s = TS / 44;
  let k = `<path d="M${r(-5 * s)} 0 L${r(5 * s)} 0 L${r(4.6 * s)} ${r(-0.8 * s)} L${r(-4.6 * s)} ${r(-0.8 * s)} Z" fill="${HOLZ}"/>`;
  for (let i = 0; i < 7; i++) {
    const x = (-3.6 + i * 1.2) * s, y = -0.8 * s - Math.sin(i / 6 * Math.PI) * 0.8 * s;
    k += `<ellipse cx="${r(x)}" cy="${r(y - 1.1 * s)}" rx="${r(0.75 * s)}" ry="${r(1.3 * s)}" fill="${S.lg("radi", [[0, "#ffffff"], [1, "#e9ede6"]])}" stroke="#d6dccf" stroke-width=".15"/>`;
  }
  k += `<path d="M${r(4.6 * s)} ${r(-2 * s)} q${r(1.2 * s)} ${r(-1.4 * s)} ${r(2.2 * s)} ${r(-2.6 * s)} M${r(4.6 * s)} ${r(-2 * s)} q${r(0.4 * s)} ${r(-1.8 * s)} ${r(0.2 * s)} ${r(-3.2 * s)}" stroke="#4f8a3a" stroke-width="${r(0.5 * s)}" fill="none"/>`;
  for (let i = 0; i < 12; i++) k += `<rect x="${r((-4 + rnd() * 8) * s)}" y="${r((-2.8 + rnd() * 1.6) * s)}" width=".3" height=".3" fill="#fff"/>`;
  S.teil({ oben: true, id: "radi", de: "der Radi", syl: "RA-di", it: "il ravanello", itSyl: "ra-va-NEL-lo", en: "radish", x: 188, y: PLATTE - 1, steht: true, kunst: k,
    tipp: "Der Radi ist ein großer weißer Rettich — dünn geschnitten und gesalzen." });
}

/* =====================================================================
   12 — DER MANN in Tracht (vorn links) mit 13 — DER LEDERHOSE und
        14 — DEM LEBKUCHENHERZ
   ===================================================================== */
const MANN = { x: 44, y: 197 };
const mann = B.mensch({ id: "b21b_mann", geschlecht: "m", pose: "haende_huefte", blick: 0, frisur: "kurz", haarfarbe: "braun", haut: "hell", bart: "voll",
  kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, unterteil: { stueck: "shorts", farbe: "braun" }, schuhe: { stueck: "halbschuh", farbe: "braun" }, kopf: { stueck: "hut", farbe: "gruen_d" } } }, 1.8 * km(MANN.y));
const P = (n) => { const q = mann.z.punkte[n]; return [q[0] * mann.k, q[1] * mann.k]; };
{
  /* Wadlstrümpfe aus grauer Wolle gehören zur Tracht — über die Waden gemalt */
  let k = mann.svg;
  for (const s of ["L", "R"]) {
    const [kx, ky] = P("knie" + s), [fx, fy] = P("knoechel" + s);
    const ux = kx + (fx - kx) * 0.3, uy = ky + (fy - ky) * 0.3, ox = kx + (fx - kx) * 0.82, oy = ky + (fy - ky) * 0.82;
    k += `<path d="M${r(ux - 2.6)} ${r(uy)} L${r(ux + 2.6)} ${r(uy)} L${r(ox + 1.7)} ${r(oy)} L${r(ox - 1.7)} ${r(oy)} Z" fill="${S.lg("strumpf", [[0, "#8f8a80"], [0.5, "#cfcac0"], [1, "#8a857b"]], 0, 0, 1, 0)}"/>`;
    k += `<rect x="${r(ux - 2.7)}" y="${r(uy - 0.6)}" width="5.4" height="1.4" rx=".5" fill="#3f6b3a"/>`;
    for (let i = 1; i < 4; i++) k += `<line x1="${r(ux - 2.2 + i * 1.1)}" y1="${r(uy + 1)}" x2="${r(ox - 1.4 + i * 0.7)}" y2="${r(oy)}" stroke="#a9a49a" stroke-width=".2"/>`;
  }
  /* Gamsbart am Hut */
  const [hx, hy] = P("scheitel");
  k += `<path d="M${r(hx + 3)} ${r(hy - 1.5)} q.4 -3 1.6 -4.4 q.2 2 -.4 4.4 Z" fill="#5a4a3a"/><path d="M${r(hx + 3.4)} ${r(hy - 2)} q.8 -2.6 2.2 -3.2" stroke="#d8cfc0" stroke-width=".3" fill="none"/>`;
  S.teil({ id: "mann", de: "der Mann", syl: "MANN", it: "l'uomo", itSyl: "UO-mo", en: "man", x: MANN.x, y: MANN.y, kunst: k,
    tipp: "Er trägt Tracht: Trachtenhut, Hemd, Lederhose und Wadlstrümpfe." });
}
{
  /* DIE LEDERHOSE: Hosenträger mit Steg, bestickter Latz, Hirschhornknöpfe */
  const [hlx, hly] = P("huefteL"), [hrx, hry] = P("huefteR"), [klx, kly] = P("knieL"), [krx, kry] = P("knieR");
  const [slx, sly] = P("schulterL"), [srx, sry] = P("schulterR");
  const by = (hly + hry) / 2;
  const sy = by + (kly - by) * 0.42;
  let k = "";
  const LEDER = S.lg("leder", [[0, "#5e3b1e"], [0.5, "#8a5a30"], [1, "#4f2f16"]], 0, 0, 1, 0);
  /* Hosenbeine bis knapp über das Knie, mit grüner Biese */
  k += `<path d="M${r(hrx - 0.8)} ${r(by - 1)} L${r(hlx + 0.8)} ${r(by - 1)} L${r(klx + 3.2)} ${r(sy)} L${r(klx - 3.8)} ${r(sy + 0.4)} L${r((hlx + hrx) / 2 + 0.6)} ${r(by + 4.6)} L${r((hlx + hrx) / 2 - 0.6)} ${r(by + 4.6)} L${r(krx + 3.8)} ${r(sy + 0.4)} L${r(krx - 3.2)} ${r(sy)} Z" fill="${LEDER}"/>`;
  k += `<path d="M${r(klx + 3.2)} ${r(sy)} L${r(klx - 3.8)} ${r(sy + 0.4)} M${r(krx + 3.8)} ${r(sy + 0.4)} L${r(krx - 3.2)} ${r(sy)}" stroke="#3f7a34" stroke-width=".6"/>`;
  /* Latz mit Stickerei (Edelweiß) und Knöpfen */
  const mx = (hlx + hrx) / 2;
  k += `<path d="M${r(mx - 3.4)} ${r(by - 0.6)} L${r(mx + 3.4)} ${r(by - 0.6)} L${r(mx + 3)} ${r(by + 4.2)} L${r(mx - 3)} ${r(by + 4.2)} Z" fill="#6b4422" stroke="#3f2611" stroke-width=".25"/>`;
  k += `<path d="M${r(mx - 2.4)} ${r(by + 1.8)} q1.2 -1.6 2.4 0 q1.2 -1.6 2.4 0" stroke="#e6dcc0" stroke-width=".3" fill="none"/>`;
  for (let i = 0; i < 5; i++) { const a = i * 72 * Math.PI / 180; k += `<ellipse cx="${r(mx + Math.cos(a) * 0.7)}" cy="${r(by + 2.6 + Math.sin(a) * 0.7)}" rx=".45" ry=".25" fill="#fbf8ee" transform="rotate(${i * 72} ${r(mx + Math.cos(a) * 0.7)} ${r(by + 2.6 + Math.sin(a) * 0.7)})"/>`; }
  for (const dx of [-2.6, 2.6]) k += `<circle cx="${r(mx + dx)}" cy="${r(by - 0.1)}" r=".45" fill="#e3d6b8" stroke="#6b5a3a" stroke-width=".15"/>`;
  /* Hosenträger mit H-Steg (Brustquersteg mit Hirsch) */
  const tl = [slx - 3.4, sly + 1.4], tr = [srx + 3.4, sry + 1.4];
  k += `<path d="M${r(tl[0])} ${r(tl[1])} L${r(mx + 3.2)} ${r(by - 0.8)}" stroke="${LEDER}" stroke-width="1.5"/><path d="M${r(tr[0])} ${r(tr[1])} L${r(mx - 3.2)} ${r(by - 0.8)}" stroke="${LEDER}" stroke-width="1.5"/>`;
  const qy = sly + (by - sly) * 0.32, qxl = tl[0] + (mx + 3.2 - tl[0]) * 0.32, qxr = tr[0] + (mx - 3.2 - tr[0]) * 0.32;
  k += `<rect x="${r(qxr - 0.6)}" y="${r(qy - 1.6)}" width="${r(qxl - qxr + 1.2)}" height="3.2" rx=".5" fill="#6b4422" stroke="#3f2611" stroke-width=".2"/>`;
  k += `<path d="M${r(mx - 1)} ${r(qy + 0.8)} l.4 -1.6 .6 .8 .6 -.8 .4 1.6 M${r(mx - 0.4)} ${r(qy - 0.8)} l-.6 -.8 M${r(mx + 0.4)} ${r(qy - 0.8)} l.6 -.8" stroke="#e6dcc0" stroke-width=".25" fill="none"/>`;
  S.teil({ id: "lederhose", de: "die Lederhose", syl: "LE-der-ho-se", it: "i pantaloni di pelle", itSyl: "pan-ta-LO-ni di PEL-le", en: "leather trousers",
    x: MANN.x, y: MANN.y, kunst: k, tipp: "Die Lederhose mit Hosenträgern gehört zur bayerischen Tracht." });
}
{
  /* DAS LEBKUCHENHERZ am Band um den Hals */
  const [nx, ny] = P("hals"), [bx, bly] = P("brust");
  const cy = bly + 3, cx = nx - 1;
  let k = `<path d="M${r(nx - 3)} ${r(ny + 1)} L${r(cx - 3.4)} ${r(cy - 3)} M${r(nx + 3)} ${r(ny + 1)} L${r(cx + 3.4)} ${r(cy - 3)}" stroke="#c9302c" stroke-width=".5"/>`;
  k += `<path d="M${r(cx)} ${r(cy + 5.4)} C${r(cx - 7)} ${r(cy + 0.4)} ${r(cx - 6)} ${r(cy - 5.4)} ${r(cx - 2.4)} ${r(cy - 4.6)} Q${r(cx - 0.6)} ${r(cy - 4.2)} ${r(cx)} ${r(cy - 2.6)} Q${r(cx + 0.6)} ${r(cy - 4.2)} ${r(cx + 2.4)} ${r(cy - 4.6)} C${r(cx + 6)} ${r(cy - 5.4)} ${r(cx + 7)} ${r(cy + 0.4)} ${r(cx)} ${r(cy + 5.4)} Z" fill="${S.rg("lebkuchen", [[0, "#b8733a"], [1, "#7e4519"]], 0.45, 0.4, 0.7)}"/>`;
  k += `<path d="M${r(cx)} ${r(cy + 4.4)} C${r(cx - 5.8)} ${r(cy + 0.2)} ${r(cx - 5)} ${r(cy - 4.4)} ${r(cx - 2.4)} ${r(cy - 3.8)} Q${r(cx - 0.6)} ${r(cy - 3.4)} ${r(cx)} ${r(cy - 2)} Q${r(cx + 0.6)} ${r(cy - 3.4)} ${r(cx + 2.4)} ${r(cy - 3.8)} C${r(cx + 5)} ${r(cy - 4.4)} ${r(cx + 5.8)} ${r(cy + 0.2)} ${r(cx)} ${r(cy + 4.4)} Z" fill="none" stroke="#f6f1e7" stroke-width=".5" stroke-dasharray=".7 .5"/>`;
  k += `<text x="${r(cx)}" y="${r(cy + 0.6)}" font-size="2.3" text-anchor="middle" fill="#c9302c" stroke="#fff" stroke-width=".25" paint-order="stroke" font-family="Georgia,serif" font-weight="bold" font-style="italic">I mog di</text>`;
  for (const [dx, f] of [[-3, "#3c8fd8"], [3, "#f2c62f"], [0, "#3ca35a"]]) k += `<circle cx="${r(cx + dx)}" cy="${r(cy + (dx ? -2.2 : 2.8))}" r=".6" fill="${f}"/>`;
  S.teil({ oben: true, id: "lebkuchenherz", de: "das Lebkuchenherz", syl: "LEB-ku-chen-herz", it: "il cuore di pan di zenzero", itSyl: "CUO-re di pan di ZEN-ze-ro", en: "gingerbread heart",
    x: MANN.x, y: MANN.y, kunst: k, tipp: "Auf dem Lebkuchenherz steht „I mog di“ — „Ich mag dich“." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/muenchen.js"));
console.log(aus);
