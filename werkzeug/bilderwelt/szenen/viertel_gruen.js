#!/usr/bin/env node
/* =====================================================================
   AM WASSER UND IM GRÜNEN (FASSUNG 852) — Bilderwelt neu, Navigation
   ---------------------------------------------------------------------
   Jeder Ort hat „lupe“ und führt in seine Szene. Wörter und lupe-Verweise
   sind die der alten Szene (szenen/viertel_gruen.js).

   RECHERCHE (Reiseland Brandenburg „Freibad Luckau / Jüterbog“,
   urlaubspiraten „Die coolsten Freibäder Deutschlands“, eigene Kenntnis
   deutscher Stadtränder am Fluss):
   - Ein FLUSS mit Uferwiesen; am Ufer ein STADTSTRAND (Sand, Liegestühle,
     Sonnenschirme, Strandbar), daneben ein BIERGARTEN unter Kastanien
     (Biertischgarnituren, Ausschank, blau-weiße Wimpel).
   - FREIBAD: 50-m-Schwimmerbecken mit Bahnen, 1- und 3-m-Sprungturm,
     Rutsche ins Nichtschwimmerbecken, Liegewiese, Kasse und Umkleide.
   - SPORTPLATZ mit roter Laufbahn, Fußballfeld und Toren; daneben die
     SPORTHALLE mit Kletterwand außen; ein TEICH mit Enten, Schilf und Steg;
     das EISSTADION (Winter: Eislaufen, Eishockey).
   - KLEINGARTENANLAGE („Schrebergarten“): Parzellen mit Hecke, Laube,
     Beeten und Sonnenblumen, Vereinsschild „… e. V.“.
   - HUNDEWIESE (eingezäunt, Kotbeutel-Spender), INSEKTENHOTEL aus Holz,
     Bambus und Zapfen, TIERHEIM mit Zwingern, WETTERSTATION (weiße
     Wetterhütte auf Beinen, Windmesser, Regenmesser, Zaun).
   - Am anderen Ufer: FRIEDHOF mit Mauer und Kapelle, TIERPARK (Tor,
     Giraffen- und Elefantengehege, Tropenhaus), AQUARIUM („Welt der Meere“).
   - Auf den Hügeln: WALD, die STERNWARTE mit Kuppel, ein BAUERNHOF mit
     Scheune, Silo, Feldern und Kühen.
   Perspektive: Blick von einem Aussichtsturm (Augenhöhe y ≈ 40), alles
   gleichmäßig von leicht oben; je weiter hinten, desto kleiner.
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, schatten, zufall } = B;

const S = neueSzene({ id: "viertel_gruen", titel: "Am Wasser und im Grünen", emoji: "🌳", thema: "Stadt", kuerzel: "b29c", fassung: 852, breite: 400, hoehe: 300 });
const rnd = zufall(2933);
const r = B.r;

const WORT = {
  vn_teich: ["der Teich","TEICH","lo stagno","STA-gno","pond","teich"],
  vn_meer: ["das Meer","MEER","il mare","MA-re","sea","meer"],
  vn_strand: ["der Strand","STRAND","la spiaggia","SPIAG-gia","beach","strand"],
  vn_schwimmbad: ["das Schwimmbad","SCHWIMM-bad","la piscina","pi-SCI-na","swimming pool","schwimmbad"],
  vn_biergarten: ["der Biergarten","BIER-gar-ten","il giardino della birra","giar-DI-no della BIR-ra","beer garden","biergarten"],
  vn_sportplatz: ["der Sportplatz","SPORT-platz","il campo sportivo","CAM-po spor-TI-vo","sports ground","sportplatz"],
  vn_sport: ["der Sport","SPORT","lo sport","SPORT","sport","sport"],
  vn_wald: ["der Wald","WALD","il bosco","BO-sco","forest","wald"],
  vn_bauernhof: ["der Bauernhof","BAU-ern-hof","la fattoria","fat-to-RI-a","farm","bauernhof"],
  vn_zoo: ["der Zoo","ZOO","lo zoo","ZOO","zoo","zoo"],
  vn_zoo2: ["die großen Tiere","GRO-ßen TIE-re","gli animali grandi","a-ni-MA-li GRAN-di","big animals","zoo2"],
  vn_tiere_welt: ["die Tiere der Welt","TIE-re der WELT","gli animali del mondo","a-ni-MA-li del MON-do","animals of the world","tiere_welt"],
  vn_haustiere: ["die Haustiere","HAUS-tie-re","gli animali domestici","a-ni-MA-li do-ME-sti-ci","pets","haustiere"],
  vn_kleintiere: ["die kleinen Tiere","KLEI-nen TIE-re","i piccoli animali","PIC-co-li a-ni-MA-li","small animals","kleintiere"],
  vn_wetter: ["das Wetter","WET-ter","il tempo","TEM-po","weather","wetter"],
  vn_winter: ["der Winter","WIN-ter","l'inverno","in-VER-no","winter","winter"],
  vn_planeten: ["der Nachthimmel","NACHT-him-mel","il cielo notturno","CIE-lo not-TUR-no","night sky","planeten"],
  vn_schrebergarten: ["der Schrebergarten","SCHRE-ber-gar-ten","l'orto urbano","OR-to ur-BA-no","allotment garden","schrebergarten"],
  vn_friedhof: ["der Friedhof","FRIED-hof","il cimitero","ci-mi-TE-ro","cemetery","friedhof"],
  vn_tierheim: ["das Tierheim","TIER-heim","il canile","ca-NI-le","animal shelter","tierheim"],
};

/* ---------- Zeichenhelfer (absolute Koordinaten) -------------------- */
const memo = {};
const LG = (n, st, x1 = 0, y1 = 0, x2 = 0, y2 = 1) => memo[n] || (memo[n] = S.lg(n, st, x1, y1, x2, y2));
const RG = (n, st, cx = 0.5, cy = 0.5, rr = 0.5) => memo[n] || (memo[n] = S.rg(n, st, cx, cy, rr));
const re = (x, y, w, h, f, ex = "") => `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${f}"${ex}/>`;
const pl = (pts, f, ex = "") => `<path d="M${pts.map((p) => r(p[0]) + " " + r(p[1])).join("L")}Z" fill="${f}"${ex}/>`;
const li = (x1, y1, x2, y2, c, w, ex = "") => `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${c}" stroke-width="${w}"${ex}/>`;
const ci = (x, y, rr, f, ex = "") => `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rr)}" fill="${f}"${ex}/>`;
const el = (x, y, rx, ry, f, ex = "") => `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rx)}" ry="${r(ry)}" fill="${f}"${ex}/>`;
const tx = (x, y, s, t, f, ex = "") => `<text x="${r(x)}" y="${r(y)}" font-size="${s}" text-anchor="middle" fill="${f}" font-family="Arial,Helvetica,sans-serif"${ex}>${t}</text>`;
function teil(id, mx, my, kunst, extra = {}) {
  const w = WORT[id];
  const x = mx - 16, y = my + 16;
  S.teil(Object.assign({ id, de: w[0], syl: w[1], it: w[2], itSyl: w[3], en: w[4], lupe: w[5], x, y, steht: true,
    kunst: `<g transform="translate(${r(-x)} ${r(-y)})">${kunst}</g>` }, extra));
}
const KRONE = RG("krone", [[0, "#9cc56b"], [0.6, "#5f9140"], [1, "#42692f"]], 0.38, 0.32, 0.72);
const KRONE_D = RG("kroned", [[0, "#6f9f4f"], [0.7, "#3f6b2f"], [1, "#2c4d22"]], 0.38, 0.32, 0.72);
const baum = (x, fy, s, f = KRONE) => re(x - s * 0.12, fy - s * 1.1, s * 0.24, s * 1.1, "#6b4a2e") + ci(x, fy - s * 1.6, s * 0.75, f) + ci(x - s * 0.5, fy - s * 1.25, s * 0.5, f) + ci(x + s * 0.5, fy - s * 1.3, s * 0.52, f);
const tanne = (x, fy, h) => re(x - h * 0.04, fy - h * 0.2, h * 0.08, h * 0.2, "#5a3d24") + pl([[x - h * 0.24, fy - h * 0.15], [x, fy - h], [x + h * 0.24, fy - h * 0.15]], LG("tanne", [[0, "#3f6b3a"], [1, "#24432a"]], 0, 0, 1, 0));
const schild = (x, y, w, h, t, f, s = 2.4, farbe = "#fff") => re(x - w / 2, y, w, h, farbe) + re(x - w / 2, y, w, h, "none", ` stroke="${f}" stroke-width=".4"`) + tx(x, y + h / 2 + s * 0.36, s, t, f, ' font-weight="bold"');
const zaun = (x0, x1, y, h, c = "#8d5f33") => { let s = re(x0, y - h * 0.75, x1 - x0, 0.5, c) + re(x0, y - h * 0.3, x1 - x0, 0.5, c); for (let x = x0; x <= x1; x += 2.6) s += li(x, y, x, y - h, c, 0.5); return s; };

/* ---------- Grundfarben -------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
const WASSER = LG("wasser", [[0, "#5d9cc4"], [0.5, "#3f7fae"], [1, "#2f6a96"]]);
const BECKEN = LG("becken", [[0, "#6fd0e8"], [1, "#2aa3cc"]]);
const SAND = LG("sand", [[0, "#f0dfb2"], [1, "#e0c78c"]]);

/* =====================================================================
   KULISSE — Himmel, Hügel, Felder, Fluss, Wiesen, Wege
   ===================================================================== */
S.hinten(re(0, 0, 400, 90, LG("himmel", [[0, "#6b9ed3"], [0.7, "#b4d0e8"], [1, "#e6eff3"]])));
S.hinten(ci(330, 14, 60, RG("sonne", [[0, "#fff8dc", 0.65], [1, "#fff8dc", 0]])));
{
  let w = "";
  for (const [x, y, s] of [[80, 14, 0.8], [250, 10, 1], [380, 30, 0.7], [150, 30, 0.55]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".92">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 5], [-10, 1.5, 10, 4], [11, 1, 12, 4.5], [-3, -3.5, 9, 5], [6, -4, 7, 4.5]]) w += el(x + dx * s, y + dy * s, rx * s, ry * s, "#fff");
    w += `</g>`;
  }
  S.hinten(w);
}
{
  let h = `<path d="M0 60 Q40 44 90 50 T180 46 Q200 40 220 46 T320 58 T400 52 V100 H0 Z" fill="${LG("huegel2", [[0, "#a3bf86"], [1, "#86a66a"]])}"/>`;
  h += `<path d="M130 62 Q196 36 262 62 Z" fill="#94b278"/>`;
  /* Felder am rechten Hang */
  h += `<path d="M262 64 Q330 54 400 58 V84 H262 Z" fill="#c9bf7a"/>`;
  for (let i = 0; i < 8; i++) h += `<path d="M${262 + i * 18} ${64 - i * 0.6} L${250 + i * 24} 84" stroke="${i % 2 ? "#b3a862" : "#d9cf8c"}" stroke-width="2.4"/>`;
  h += re(0, 82, 400, 218, LG("wiese", [[0, "#8fb764"], [1, "#6c9c48"]]));
  /* Fluss */
  h += `<path d="M0 92 Q100 89 200 92 T400 91 V113 Q300 115 200 112 T0 114 Z" fill="${WASSER}"/>`;
  for (let i = 0; i < 50; i++) { const x = rnd() * 400, y = 95 + rnd() * 16; h += li(x, y, x + 3 + rnd() * 4, y, "#fff", 0.3, ' opacity=".45"'); }
  h += `<path d="M0 92 Q100 89 200 92 T400 91" stroke="#c2b38a" stroke-width="1.2" fill="none"/>`;
  /* Ausflugsboot */
  h += `<path d="M128 103 h26 l-3 4 h-21 Z" fill="#fff"/><rect x="133" y="99.6" width="15" height="3.4" fill="#e9eef1"/><rect x="134" y="100.4" width="13" height="1.4" fill="#4f7fa8"/>`;
  /* Wege (Kies) */
  h += `<path d="M0 148 Q100 146 180 150 T400 176 V181 Q300 172 180 155 T0 153 Z" fill="#d8cdb2"/>`;
  h += `<path d="M0 220 Q120 216 200 226 T400 228 V233 Q300 233 200 231 T0 225 Z" fill="#d8cdb2"/>`;
  h += `<path d="M146 300 Q150 260 152 230 L158 230 Q158 262 156 300 Z" fill="#d8cdb2"/>`;
  for (let i = 0; i < 260; i++) { const x = rnd() * 400, y = 116 + rnd() * 184; h += li(x, y, x + 0.4, y - 1.2, "#5c8a3c", 0.3, ' opacity=".6"'); }
  S.hinten(h);
}

/* =====================================================================
   HINTEN auf den Hügeln: Wald, Sternwarte, Bauernhof
   ===================================================================== */
{
  let k = `<path d="M0 84 V50 Q30 40 70 46 Q110 50 136 66 L136 84 Z" fill="${LG("waldboden", [[0, "#55803e"], [1, "#3f6a2e"]])}"/>`;
  const p = [];
  for (let i = 0; i < 46; i++) { const x = 2 + rnd() * 132, top = x < 70 ? 44 + (70 - x) * 0.05 : 46 + (x - 70) * 0.28; p.push([x, top + 4 + rnd() * (82 - top - 6)]); }
  p.sort((a, b) => a[1] - b[1]);
  for (const [x, y] of p) k += rnd() < 0.55 ? tanne(x, y, 9 + rnd() * 5) : ci(x, y - 4, 3.6 + rnd() * 1.6, rnd() < 0.5 ? KRONE : KRONE_D);
  teil("vn_wald", 66, 42, k, { tipp: "Im Wald wachsen Tannen, Fichten, Buchen und Eichen." });
}
{
  const X = 196, F = 48;
  let k = schatten(X, F, 15, 1.4, 0.3) + re(X - 12, F - 12, 24, 12, LG("stw", [[0, "#f3f1ec"], [1, "#d6d2c8"]], 0, 0, 1, 0));
  k += `<path d="M${X - 13} ${F - 12} A13 13 0 0 1 ${X + 13} ${F - 12} Z" fill="${RG("kuppel", [[0, "#ffffff"], [0.6, "#dfe5ea"], [1, "#a9b4bd"]], 0.35, 0.3, 0.8)}"/>`;
  k += pl([[X - 2, F - 24.6], [X + 2.4, F - 24.6], [X + 2.8, F - 12], [X - 2.4, F - 12]], "#1d2733");
  k += li(X, F - 16, X + 4, F - 24, "#9aa3aa", 1.2);
  k += re(X - 4, F - 8, 8, 8, "#5c6b78") + re(X - 9, F - 9, 4, 4, "#9fc3dc") + re(X + 5, F - 9, 4, 4, "#9fc3dc");
  k += schild(X, F + 1.4, 22, 4.4, "STERNWARTE", "#1d3557", 2.4);
  teil("vn_planeten", X + 20, 40, k, { tipp: "In der Sternwarte schaut man nachts durch das Fernrohr auf Mond, Planeten und Sterne." });
}
{
  let k = "";
  /* Wohnhaus, Scheune, Silo, Kühe auf der Weide, Traktor */
  k += schatten(330, 80, 34, 2, 0.25);
  k += re(298, 64, 24, 16, "#f3ecdc") + pl([[296, 64], [310, 54], [324, 64]], "#8c3a29");
  for (const x of [301, 309, 316]) k += re(x, 67, 4, 4.6, "#5d7f9c") + re(x - 0.4, 66.6, 4.8, 0.6, "#fff");
  k += re(308.5, 73, 4, 7, "#6d4a2a");
  k += re(326, 60, 34, 20, LG("scheune", [[0, "#b8432f"], [1, "#8f2f22"]])) + pl([[324, 60], [343, 48], [362, 60]], "#5a4636");
  k += re(336, 66, 14, 14, "#6d2a1e") + li(336, 66, 350, 80, "#f3ecdc", 0.6) + li(350, 66, 336, 80, "#f3ecdc", 0.6) + re(336, 66, 14, 14, "none", ' stroke="#f3ecdc" stroke-width=".6"');
  k += re(364, 46, 8, 34, LG("silo", [[0, "#cfd5da"], [0.5, "#f2f4f5"], [1, "#9ea7ae"]], 0, 0, 1, 0)) + el(368, 46, 4, 1.6, "#aeb6bd") + `<path d="M364 46 Q368 40 372 46" fill="#b5bcc2"/>`;
  k += zaun(374, 398, 84, 3, "#f3ecdc");
  for (const [x, y] of [[380, 80], [391, 82]]) k += el(x, y - 2.4, 4, 2.2, "#fff") + el(x - 1, y - 2.6, 1.4, 1, "#222") + el(x + 1.6, y - 2, 1, 0.8, "#222") + ci(x + 4.2, y - 3.4, 1.4, "#fff") + re(x - 3, y - 1, 0.6, 2, "#ddd") + re(x + 2.4, y - 1, 0.6, 2, "#ddd");
  k += re(282, 77, 9, 4, "#2e7d32") + re(287, 73, 4, 4, "#2e7d32") + re(287.6, 73.6, 2.8, 2.4, "#cfe6f5") + ci(284, 81.4, 1.8, "#222") + ci(289.6, 81, 2.6, "#222");
  teil("vn_bauernhof", 352, 30, `<g transform="translate(64 -14) scale(.84)">${k}</g>`, { tipp: "Auf dem Bauernhof gibt es Kühe, eine Scheune, ein Silo und Felder." });
}

/* =====================================================================
   ANDERES UFER: Friedhof, Tierpark (Tor, Gehege, Tropenhaus), Aquarium
   ===================================================================== */
{
  let k = pl([[2, 92], [96, 92], [96, 76], [2, 76]], "#7fa35c");
  /* Kapelle mit Glockenturm */
  k += re(58, 66, 22, 18, "#e9e2d2") + pl([[56, 66], [69, 57], [82, 66]], "#6e6a66") + re(53, 56, 8, 28, "#e2dac8") + pl([[52, 56], [57, 46], [62, 56]], "#5f5b57");
  k += li(57, 46, 57, 42, "#333", 0.5) + li(55.6, 43.6, 58.4, 43.6, "#333", 0.5) + `<path d="M66 84 v-7 q3 -3 6 0 v7 Z" fill="#6d4a2a"/>` + ci(57, 61, 1.6, "#8d6a3a");
  /* Grabsteine in Reihen, Grablichter, Bäume */
  for (let j = 0; j < 3; j++) for (let i = 0; i < 8; i++) {
    if (i > 5 && j < 2) continue;
    const x = 8 + i * 6 + (j % 2) * 2.6, y = 80 + j * 4;
    k += `<path d="M${x - 1.6} ${y} v-3 q1.6 -1.6 3.2 0 v3 Z" fill="${j === 1 ? "#a9a5a0" : "#8f8b86"}"/>` + re(x - 1.8, y, 3.6, 1.2, "#5f8a45") + ci(x + 0.9, y + 0.4, 0.35, "#e63946");
  }
  k += pl([[3, 72], [5, 60], [7, 72]], "#2f5a33") + pl([[42, 76], [44.5, 63], [47, 76]], "#2f5a33") + ci(88, 66, 8, KRONE_D) + re(87.4, 70, 1.2, 8, "#5a3d24");
  /* Friedhofsmauer mit Tor */
  k += re(2, 89, 94, 3.4, LG("mauer", [[0, "#c9c2b5"], [1, "#a39b8c"]])) + re(28, 86, 8, 6.4, "#4a4a4a") + li(32, 86, 32, 92, "#888", 0.4);
  teil("vn_friedhof", 20, 76, k, { tipp: "Auf dem Friedhof stehen Grabsteine; daneben die kleine Kapelle." });
}
{
  /* Tierpark-Tor */
  const X0 = 104, X1 = 146;
  let k = re(X0, 70, 6, 22, "#a7764a") + re(X1 - 6, 70, 6, 22, "#a7764a") + pl([[X0 - 1, 70], [X1 + 1, 70], [X1 - 2, 64], [X0 + 2, 64]], "#5a3d24");
  k += re(X0 + 4, 64.6, X1 - X0 - 8, 7, "#2e7d32") + tx((X0 + X1) / 2, 69.8, 4.2, "TIERPARK", "#fff", ' font-weight="bold"');
  k += pl([[X0 + 6, 92], [X1 - 6, 92], [X1 - 9, 78], [X0 + 9, 78]], "#d9c79a") + re(X0 + 6, 72, X1 - X0 - 12, 6, "#7fa35c", ' opacity=".6"');
  k += re(X0 + 13, 80, 7, 8, "#f2b632") + re(X0 + 13, 78.4, 7, 1.8, "#c0392b") + tx(X0 + 16.5, 85, 1.6, "Kasse", "#5a3d24");
  /* Elefant als Wahrzeichen über dem Tor */
  k += el(125, 61, 4.6, 2.8, "#9aa1a6") + ci(129.4, 59.6, 2, "#9aa1a6") + `<path d="M131 60 q1.6 2 .6 4.4" stroke="#9aa1a6" stroke-width="1" fill="none"/>` + re(121.6, 62.6, 1.4, 2, "#9aa1a6") + re(126.8, 62.6, 1.4, 2, "#9aa1a6");
  teil("vn_zoo", X0 + 4, 76, k, { tipp: "Durch dieses Tor geht man in den Tierpark (Zoo)." });
}
{
  /* Gehege mit Giraffen und Elefant */
  const X0 = 150, X1 = 234;
  let k = pl([[X0, 92], [X1, 92], [X1 - 2, 74], [X0 + 2, 74]], LG("savanne", [[0, "#e6cf8f"], [1, "#d3b56c"]]));
  k += ci(218, 66, 7, "#7a9c43") + `<path d="M210 66 q8 -3 16 0" fill="#6b8c3a"/>` + re(217.4, 66, 1.2, 10, "#6b4a2e");
  const giraffe = (x, fy, s, d) => {
    const G = LG("giraffe", [[0, "#e5b55a"], [1, "#c98f35"]]);
    let g = `<path d="M${x - 6 * s} ${fy - 9 * s} q6 * ${s} -2 ${12 * s} 0 Z" fill="none"/>`;
    g = el(x, fy - 10 * s, 6 * s, 3 * s, G);
    for (const [dx, dh] of [[-4.4, 0], [-2.6, 0], [3, 0], [4.6, 0]]) g += re(x + dx * s - 0.5 * s, fy - 9 * s, 1 * s, 9 * s, G);
    g += `<path d="M${x + d * 3.4 * s} ${fy - 11 * s} L${x + d * 6.4 * s} ${fy - 23 * s} L${x + d * 8.2 * s} ${fy - 22.4 * s} L${x + d * 5.6 * s} ${fy - 10 * s} Z" fill="${G}"/>`;
    g += el(x + d * 8 * s, fy - 23.4 * s, 2.4 * s, 1.3 * s, G) + ci(x + d * 7.4 * s, fy - 24.8 * s, 0.5 * s, "#6b4a2e") + li(x + d * 7 * s, fy - 24.6 * s, x + d * 6.8 * s, fy - 26 * s, "#6b4a2e", 0.5 * s);
    for (let i = 0; i < 9; i++) g += ci(x - 4.5 * s + (i % 5) * 2.2 * s, fy - 11 * s + Math.floor(i / 5) * 2 * s, 0.7 * s, "#8a5a22", ' opacity=".8"');
    return g;
  };
  k += giraffe(168, 88, 1, 1) + giraffe(184, 84, 0.85, -1);
  /* Elefant */
  k += el(206, 83, 9, 6, LG("ele", [[0, "#a7aeb3"], [1, "#7d858b"]])) + ci(196.6, 80, 4.6, "#959ca2") + `<path d="M194 82 q-2 4 0 8" stroke="#8a9197" stroke-width="2" fill="none" stroke-linecap="round"/>` + el(199.4, 79.6, 2.6, 3.6, "#8a9197");
  for (const x of [200, 204.6, 209.4, 213]) k += re(x - 1.2, 86, 2.4, 5, "#8a9197");
  /* Zaun und Schild */
  k += zaun(X0, X1, 92, 4, "#7a5530") + schild(X0 + 14, 74, 22, 4.6, "Savanne", "#7a5530", 2.4, "#f3ecdc");
  teil("vn_zoo2", X0 + 76, 82, k, { tipp: "Im Gehege leben die großen Tiere: Giraffen und Elefanten." });
}
{
  /* Tropenhaus (Tiere der Welt) */
  const X = 264, F = 92;
  let k = schatten(X, F, 26, 1.6, 0.25) + re(X - 26, F - 6, 52, 6, "#cfd5da");
  k += `<path d="M${X - 25} ${F - 6} A25 20 0 0 1 ${X + 25} ${F - 6} Z" fill="${LG("tropenglas", [[0, "#dff1ea"], [1, "#a9d3c4"]])}"/>`;
  for (let i = 1; i < 6; i++) k += `<path d="M${X - 25 + i * 8.3} ${F - 6} Q${X - 25 + i * 8.3} ${F - 22 + Math.abs(3 - i) * 3} ${X} ${F - 26}" stroke="#7d9a90" stroke-width=".35" fill="none"/>`;
  for (let j = 1; j < 4; j++) k += `<path d="M${X - 25 + j * 2} ${F - 6 - j * 5} Q${X} ${F - 6 - j * 6.6} ${X + 25 - j * 2} ${F - 6 - j * 5}" stroke="#7d9a90" stroke-width=".35" fill="none"/>`;
  /* Palmen und ein Papagei */
  for (const [px, ph] of [[X - 10, 16], [X + 8, 18]]) { k += li(px, F - 6, px + 1, F - 6 - ph, "#7a5530", 1); for (let i = 0; i < 5; i++) { const a = -2.6 + i * 0.55; k += `<path d="M${px + 1} ${F - 6 - ph} q${r(Math.cos(a) * 4)} ${r(Math.sin(a) * 4 - 1)} ${r(Math.cos(a) * 7)} ${r(Math.sin(a) * 4 + 3)}" stroke="#3f8a3c" stroke-width="1.1" fill="none"/>`; } }
  k += el(X - 1, F - 15, 1.4, 2.4, "#d62828") + ci(X - 1, F - 17.6, 1, "#d62828") + pl([[X - 0.2, F - 17.8], [X + 1, F - 17.4], [X - 0.2, F - 17]], "#ffd23f") + re(X - 2, F - 13, 2, 3, "#2a6fb4");
  k += re(X - 6, F - 9, 12, 3.4, "#fff") + tx(X, F - 6.6, 2.2, "Tropenhaus", "#2e7d32", ' font-weight="bold"');
  teil("vn_tiere_welt", X + 2, 70, k, { tipp: "Im Tropenhaus leben Tiere aus aller Welt: Papageien, Affen und Schlangen." });
}
{
  /* Aquarium „Welt der Meere“ */
  const X0 = 296, X1 = 362;
  let k = schatten((X0 + X1) / 2, 92, 34, 1.6, 0.25) + re(X0, 75, X1 - X0, 17, "#eef2f4");
  k += `<path d="M${X0 - 2} 76 Q${X0 + 10} 69 ${X0 + 22} 73 T${X0 + 46} 71.6 T${X1 + 2} 73 V77 H${X0 - 2} Z" fill="${LG("welle", [[0, "#3aa0d8"], [1, "#1d6fa8"]])}"/>`;
  k += re(X0 + 4, 80.4, X1 - X0 - 8, 10, LG("aqua", [[0, "#3fb6e0"], [1, "#145f93"]]));
  /* Fische, ein Delfin, Luftblasen */
  for (const [x, y, c] of [[X0 + 12, 82, "#ffd23f"], [X0 + 20, 86, "#f4a261"], [X0 + 40, 81, "#ffd23f"], [X0 + 50, 86, "#e63946"]]) k += el(x, y, 2, 1.1, c) + pl([[x + 1.6, y], [x + 3.2, y - 1.2], [x + 3.2, y + 1.2]], c);
  k += `<path d="M${X0 + 26} 84 q6 -5 12 -1 l2 -2 l-.4 3 q-6 4 -13.6 0 Z" fill="#9fb3c2"/>` + ci(X0 + 28, 83.6, 0.35, "#222");
  for (let i = 0; i < 6; i++) k += ci(X0 + 34 + (i % 2), 81 - i * 0.7, 0.35, "#e8f7ff");
  k += tx((X0 + X1) / 2, 79.6, 3, "AQUARIUM · Welt der Meere", "#1d6fa8", ' font-weight="bold"');
  teil("vn_meer", X1 - 8, 82, k, { tipp: "Im Aquarium sieht man Fische, Delfine und Quallen aus dem Meer." });
}

/* =====================================================================
   DIESSEITS DES FLUSSES: Stadtstrand, Biergarten, Freibad
   ===================================================================== */
{
  let k = `<path d="M0 112 Q40 110 84 113 L88 142 Q40 140 0 143 Z" fill="${SAND}"/>`;
  k += `<path d="M0 112 Q40 110 84 113 L84.6 117 Q40 114 0 116.6 Z" fill="#a8cde0" opacity=".6"/>`;
  /* Strandbar */
  k += re(56, 116, 24, 14, "#c79a5e") + pl([[54, 116], [82, 116], [79, 110], [57, 110]], "#e8d9a8");
  for (let i = 0; i < 9; i++) k += li(57 + i * 2.8, 110, 56 + i * 3, 116, "#c9b47a", 0.5);
  k += re(58, 118, 20, 5, "#fff") + tx(68, 121.8, 2.8, "STADTSTRAND", "#e76f51", ' font-weight="bold"') + re(56, 124, 24, 1.6, "#8a6a40");
  /* Liegestühle, Schirme, Volleyballnetz */
  const liege = (x, y, c) => `<path d="M${x} ${y} l3 -5 h6 l-3 5 Z" fill="${c}"/>` + li(x, y, x + 1, y + 2, "#8a6a40", 0.5) + li(x + 6, y, x + 7, y + 2, "#8a6a40", 0.5);
  k += liege(6, 132, "#2a9d8f") + liege(18, 133, "#e76f51") + liege(30, 134, "#2a9d8f") + liege(44, 135, "#ffd23f");
  for (const [x, y, c] of [[14, 128, "#e63946"], [38, 129, "#2a6fb4"]]) k += li(x, y, x, y + 7, "#666", 0.5) + `<path d="M${x - 8} ${y} q8 -6 16 0 Z" fill="${c}"/>` + `<path d="M${x - 4} ${y - 2.2} q4 -3.4 8 0 L${x + 4} ${y} h-8 Z" fill="#fff" opacity=".85"/>`;
  k += li(10, 122, 10, 116, "#555", 0.5) + li(36, 122, 36, 116, "#555", 0.5) + re(10, 116.6, 26, 2.6, "none", ' stroke="#fff" stroke-width=".3"') + ci(26, 113, 1.4, "#fff");
  teil("vn_strand", 50, 126, k, { tipp: "Am Stadtstrand liegt man im Sand – mitten in der Stadt, direkt am Fluss." });
}
{
  let k = pl([[88, 113], [176, 116], [178, 150], [90, 148]], "#d9c9a2");
  for (let i = 0; i < 60; i++) k += ci(90 + rnd() * 86, 116 + rnd() * 32, 0.3, "#b8a780");
  /* Ausschank mit Wimpeln */
  k += re(148, 118, 26, 14, "#a7764a") + pl([[146, 118], [176, 118], [172, 112], [150, 112]], "#6d4a2a") + re(150, 121, 22, 5, "#fff") + tx(161, 124.8, 2.8, "BIERGARTEN", "#1f4fa0", ' font-weight="bold"');
  k += re(150, 127, 22, 1.4, "#5a3d24");
  for (let i = 0; i < 10; i++) { const x = 92 + i * 5.4; k += pl([[x, 117], [x + 4.8, 117.3], [x + 2.4, 120]], i % 2 ? "#1f6fb2" : "#ffffff"); }
  k += `<path d="M90 116.6 Q120 119 146 117.4" stroke="#666" stroke-width=".25" fill="none"/>`;
  /* Kastanienbäume */
  k += baum(100, 128, 9, KRONE_D) + baum(130, 126, 10);
  /* Biertischgarnituren mit Maßkrügen */
  for (const [x, y] of [[96, 138], [118, 140], [140, 141], [106, 146], [130, 147]]) {
    k += re(x, y, 18, 1.8, "#c99a5a") + re(x, y + 2.6, 18, 0.9, "#a7764a") + re(x, y - 2.2, 18, 0.9, "#a7764a") + re(x + 1, y + 1.8, 0.8, 2.6, "#5a3d24") + re(x + 16, y + 1.8, 0.8, 2.6, "#5a3d24");
    for (const dx of [3, 9, 14]) k += re(x + dx, y - 1.6, 1.6, 2, "#f2c14e") + re(x + dx, y - 2, 1.6, 0.6, "#fff");
  }
  teil("vn_biergarten", 108, 116, k, { tipp: "Im Biergarten sitzt man unter Kastanien an langen Holztischen." });
}
{
  const X0 = 182, X1 = 398;
  let k = pl([[X0, 112], [X1, 112], [X1, 176], [X0, 160]], LG("liegewiese", [[0, "#9cc96b"], [1, "#7fb354"]]));
  /* Zaun */
  k += zaun(X0, X1, 116, 4, "#4a6b52");
  /* Kasse und Umkleide */
  k += re(X0 + 2, 120, 32, 18, "#f1ede4") + re(X0 + 2, 118, 32, 2.4, "#2a6fb4") + re(X0 + 4, 122, 28, 6, "#2a9fd6") + tx(X0 + 18, 126.6, 3.6, "FREIBAD", "#fff", ' font-weight="bold"');
  k += re(X0 + 5, 130, 6, 8, "#5d7f9c") + re(X0 + 14, 130, 6, 8, "#5d7f9c") + re(X0 + 24, 130, 6, 8, "#5d7f9c");
  /* Schwimmerbecken mit Bahnen */
  k += pl([[X0 + 40, 122], [X0 + 146, 122], [X0 + 152, 150], [X0 + 36, 150]], "#e9e4d6");
  k += pl([[X0 + 42, 124], [X0 + 144, 124], [X0 + 149, 148], [X0 + 39, 148]], BECKEN);
  for (let i = 1; i < 6; i++) { const y = 124 + i * 4; k += li(X0 + 42 - (y - 124) * 0.12, y, X0 + 144 + (y - 124) * 0.21, y, i % 2 ? "#e63946" : "#ffffff", 0.45, ' stroke-dasharray="1.6 1"'); }
  for (let i = 0; i < 10; i++) k += li(X0 + 46 + i * 9, 126 + (i % 3) * 7, X0 + 50 + i * 9, 126 + (i % 3) * 7, "#fff", 0.4, ' opacity=".7"');
  /* Sprungturm (1 m und 3 m) */
  k += re(X0 + 150, 126, 3, 24, "#d9dde0") + re(X0 + 160, 126, 3, 24, "#d9dde0") + re(X0 + 148, 126, 17, 2, "#c9cfd4") + re(X0 + 138, 125.4, 14, 1.2, "#2a6fb4") + re(X0 + 148, 138, 17, 2, "#c9cfd4") + re(X0 + 142, 137.4, 10, 1.2, "#2a6fb4");
  for (let y = 128; y < 150; y += 3) k += li(X0 + 163, y, X0 + 166, y + 1.5, "#9aa3aa", 0.5);
  /* Nichtschwimmerbecken mit Rutsche */
  k += el(X0 + 186, 160, 26, 9, "#e9e4d6") + el(X0 + 186, 160, 23.5, 7.4, BECKEN);
  k += re(X0 + 200, 128, 3, 26, "#c9cfd4") + re(X0 + 196, 126, 11, 3, "#e63946");
  k += `<path d="M${X0 + 200} 128 q-14 4 -6 12 q8 6 -6 14 q-4 3 -8 4" stroke="${LG("rutsche", [[0, "#ffd23f"], [1, "#f4a100"]])}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  /* Handtücher und Schirme auf der Liegewiese */
  for (const [x, y, c] of [[X0 + 8, 146, "#e63946"], [X0 + 20, 150, "#2a9d8f"], [X0 + 92, 156, "#ffd23f"], [X0 + 112, 158, "#9b5de5"], [X0 + 66, 155, "#f4a261"]]) k += pl([[x, y], [x + 7, y - 0.6], [x + 8, y + 2.4], [x + 1, y + 3]], c);
  k += li(X0 + 140, 154, X0 + 140, 160, "#666", 0.5) + `<path d="M${X0 + 133} 154 q7 -5 14 0 Z" fill="#2a6fb4"/>`;
  teil("vn_schwimmbad", X0 + 54, 160, k, { tipp: "Im Freibad gibt es ein großes Becken, einen Sprungturm und eine Rutsche." });
}

/* =====================================================================
   MITTE: Sportplatz, Sporthalle, Teich, Eisstadion
   ===================================================================== */
{
  let k = `<path d="M14 156 H128 Q140 156 141 186 Q142 216 128 216 H12 Q0 216 1 186 Q2 156 14 156 Z" fill="${LG("bahn", [[0, "#c8553d"], [1, "#b04532"]])}"/>`;
  k += pl([[16, 160], [126, 160], [132, 212], [10, 212]], LG("rasen", [[0, "#6fae4b"], [1, "#5a9a3c"]]));
  for (let i = 0; i < 6; i++) k += pl([[16 + i * 18.3, 160], [16 + (i + 1) * 18.3, 160], [10 + (i + 1) * 20.3, 212], [10 + i * 20.3, 212]], "#fff", ` opacity="${i % 2 ? 0.06 : 0}"`);
  k += pl([[16, 160], [126, 160], [132, 212], [10, 212]], "none", ' stroke="#fff" stroke-width=".7"') + li(71, 160, 71, 212, "#fff", 0.6) + el(71, 186, 11, 6, "none", ' stroke="#fff" stroke-width=".6"');
  k += pl([[48, 160], [94, 160], [95, 167], [47, 167]], "none", ' stroke="#fff" stroke-width=".5"') + pl([[44, 212], [98, 212], [97, 203], [45, 203]], "none", ' stroke="#fff" stroke-width=".5"');
  /* Tore */
  k += re(62, 154, 18, 6, "none", ' stroke="#fff" stroke-width=".9"') + re(58, 205, 26, 9, "none", ' stroke="#fff" stroke-width="1.1"');
  for (let x = 60; x < 84; x += 2) k += li(x, 205, x, 214, "#fff", 0.2, ' opacity=".6"');
  k += ci(80, 190, 1.6, "#fff") + `<path d="M79 189.4 l1 .8 l1 -.8" stroke="#222" stroke-width=".3" fill="none"/>`;
  /* Flutlichtmast und Schild */
  k += re(2, 140, 1.6, 50, "#9aa3aa") + re(-1, 138, 8, 4, "#c9cfd4") + schild(30, 148, 34, 6, "Sportplatz · SV Grün-Weiß", "#2e7d32", 2.6);
  teil("vn_sportplatz", 112, 178, k, { tipp: "Auf dem Sportplatz spielt der Verein Fußball; außen ist die Laufbahn." });
}
{
  const X0 = 146, X1 = 206, F = 214, T = 180;
  let k = schatten((X0 + X1) / 2, F, 32, 1.6, 0.3) + re(X0, T, X1 - X0, F - T, LG("halle", [[0, "#e6e3dc"], [1, "#c9c4b9"]]));
  k += pl([[X0 - 2, T], [X1 + 2, T], [X1, T - 3], [X0, T - 3]], "#8c9398");
  k += re(X0 + 18, T + 3, 40, 5.6, "#2a6fb4") + tx(X0 + 38, T + 7.4, 3.8, "SPORTHALLE", "#fff", ' font-weight="bold"');
  for (let i = 0; i < 5; i++) k += re(X0 + 20 + i * 7.6, T + 11, 6, 8, "#9fc3dc");
  k += re(X0 + 34, F - 11, 10, 11, "#3c4a56") + re(X0 + 35, F - 10, 8, 10, "#7fa6c2");
  /* Kletterwand an der Seite mit bunten Griffen */
  k += re(X0, T, 16, F - T, LG("kletter", [[0, "#9db3c4"], [1, "#7d93a6"]]));
  for (let i = 0; i < 26; i++) k += ci(X0 + 2 + rnd() * 12, T + 2 + rnd() * (F - T - 4), 0.7, ["#e63946", "#ffd23f", "#2a9d8f", "#f4a261", "#9b5de5"][i % 5]);
  /* Basketballkorb */
  k += re(X1 - 6, F - 22, 1, 22, "#666") + re(X1 - 10, F - 26, 9, 6, "#fff") + el(X1 - 5.5, F - 19.4, 2.4, 0.8, "none", ' stroke="#f4a100" stroke-width=".6"');
  teil("vn_sport", X0 + 8, 190, k, { tipp: "In der Sporthalle macht man Sport: Klettern, Basketball und Turnen." });
}
{
  let k = `<path d="M214 196 Q230 182 262 184 Q294 186 292 204 Q290 222 254 222 Q216 222 214 206 Z" fill="#6b8f4a"/>`;
  k += `<path d="M217 198 Q232 186 262 187 Q290 189 289 204 Q288 219 254 219 Q219 219 217 206 Z" fill="${LG("teich", [[0, "#6aa7c9"], [1, "#2f6f94"]])}"/>`;
  k += `<path d="M230 192 Q252 188 272 192" stroke="#fff" stroke-width=".5" opacity=".5" fill="none"/>`;
  /* Seerosen, Enten, Schilf, Steg */
  for (const [x, y] of [[232, 206], [240, 212], [276, 210]]) k += el(x, y, 3, 1.4, "#4f8a3c") + ci(x + 0.6, y - 0.4, 0.8, "#f8c8dc");
  const ente = (x, y, kopf) => el(x, y, 2.4, 1.3, "#8a6a40") + ci(x + 2, y - 1.4, 1.1, kopf) + pl([[x + 3, y - 1.4], [x + 4.2, y - 1.1], [x + 3, y - 0.9]], "#f4a100");
  k += ente(252, 200, "#2e7d32") + ente(262, 205, "#8a6a40") + ente(246, 196, "#2e7d32");
  for (let i = 0; i < 14; i++) { const x = 282 + rnd() * 9, y = 198 + rnd() * 16; k += li(x, y, x + rnd() * 2 - 1, y - 5, "#5c7a33", 0.5) + el(x, y - 5, 0.4, 1.2, "#6b4a2e"); }
  k += pl([[238, 220], [246, 220], [250, 206], [244, 206]], "#b98552") + li(240, 220, 245, 206, "#8d5f33", 0.3) + li(244, 220, 248, 206, "#8d5f33", 0.3);
  teil("vn_teich", 230, 200, k, { tipp: "Im Teich schwimmen Enten zwischen den Seerosen." });
}
{
  const X0 = 300, X1 = 398, F = 216, T = 186;
  let k = schatten((X0 + X1) / 2, F, 50, 1.8, 0.3) + re(X0, T, X1 - X0, F - T, "#e9eef2");
  k += `<path d="M${X0 - 2} ${T + 1} Q${(X0 + X1) / 2} ${T - 18} ${X1 + 2} ${T + 1} Z" fill="${LG("eisdach", [[0, "#cfe3ef"], [1, "#8fb3c9"]])}"/>`;
  for (let i = 1; i < 8; i++) k += li(X0 + i * 12.25, T + 1, X0 + i * 12.25 + (i - 4) * 1.4, T - 12 + Math.abs(i - 4) * 2.6, "#7d9fb4", 0.35);
  k += re(X0 + 4, T + 3, X1 - X0 - 8, 7, "#1d3557") + tx((X0 + X1) / 2 + 4, T + 8.4, 4.2, "EISSTADION", "#fff", ' font-weight="bold"');
  k += `<g transform="translate(${X0 + 13} ${T + 6.5})" stroke="#bfe3ff" stroke-width=".5">${[0, 60, 120].map((a) => `<line x1="-2.6" y1="0" x2="2.6" y2="0" transform="rotate(${a})"/>`).join("")}</g>`;
  /* Glasfront: Eisfläche mit Bande und Eishockeytor */
  k += re(X0 + 6, T + 12, X1 - X0 - 12, 16, LG("eisglas", [[0, "#cfe6f2"], [1, "#a9cde0"]]));
  k += re(X0 + 6, T + 22, X1 - X0 - 12, 6, "#f4fbff") + re(X0 + 6, T + 21, X1 - X0 - 12, 1.2, "#2a6fb4") + li(X0 + 49, T + 22, X0 + 49, T + 28, "#e63946", 0.6);
  k += re(X0 + 12, T + 18, 7, 4, "none", ' stroke="#e63946" stroke-width=".7"') + ci(X0 + 70, T + 25, 0.8, "#111");
  for (let x = X0 + 20; x < X1 - 6; x += 12) k += li(x, T + 12, x, T + 28, "#5f7a8c", 0.6);
  k += re(X0 + 74, T + 13, 16, 4.4, "#fff") + tx(X0 + 82, T + 16.2, 2, "Eislaufen", "#1d3557", ' font-weight="bold"');
  teil("vn_winter", X0 + 30, 196, k, { tipp: "Im Eisstadion ist immer Winter: Hier läuft man Schlittschuh und spielt Eishockey." });
}

/* =====================================================================
   VORNE: Kleingärten, Hundewiese, Insektenhotel, Tierheim, Wetterstation
   ===================================================================== */
{
  let k = pl([[0, 232], [142, 234], [144, 300], [0, 300]], "#7aa652");
  k += schild(30, 236, 52, 6, "Kleingartenverein Sonnenschein e. V.", "#2e7d32", 2.5);
  const parzelle = (x0, y0, w, h, laube) => {
    let g = pl([[x0, y0], [x0 + w, y0], [x0 + w + 1, y0 + h], [x0 - 1, y0 + h]], "#86b35c");
    /* Beete */
    for (let i = 0; i < 4; i++) { const yy = y0 + 4 + i * (h - 10) / 4; g += re(x0 + 3, yy, w * 0.45, 2.6, "#6b4a2e"); for (let j = 0; j < 6; j++) g += ci(x0 + 4.6 + j * (w * 0.45 - 3) / 5, yy + 0.8, 1, i % 2 ? "#4f8a3c" : "#7cb342"); }
    /* Laube */
    const lx = x0 + w * 0.58, ly = y0 + h - 6;
    g += schatten(lx + 11, ly, 12, 1, 0.3) + re(lx, ly - 13, 22, 13, laube) + pl([[lx - 2, ly - 13], [lx + 11, ly - 21], [lx + 24, ly - 13]], "#7a3b2a") + re(lx + 3, ly - 9, 5, 4.4, "#cfe6f5") + re(lx + 12, ly - 10, 6, 10, "#5a3d24");
    /* Sonnenblumen */
    for (let i = 0; i < 3; i++) { const sx = x0 + 4 + i * 4, sy = y0 + h - 2; g += li(sx, sy, sx, sy - 12, "#4f8a3c", 0.6) + ci(sx, sy - 12.6, 1.8, "#ffd23f") + ci(sx, sy - 12.6, 0.8, "#6b4a2e"); }
    /* Hecke */
    g += re(x0 - 1, y0 + h - 1.4, w + 2, 2.4, "#3f6b2f") + re(x0 - 1.4, y0, 1.6, h, "#3f6b2f");
    return g;
  };
  k += parzelle(4, 244, 64, 26, "#f2c14e") + parzelle(74, 244, 64, 26, "#6fa8d6") + parzelle(4, 274, 64, 26, "#e9e2d2") + parzelle(74, 274, 64, 26, "#d9826b");
  /* Gewächshaus und Gartenzwerg */
  k += re(40, 286, 12, 8, "#e6f3f6", ' opacity=".8"') + pl([[40, 286], [46, 282], [52, 286]], "#cfe6ee") + `<path d="M126 268 l1 -4 h3 l1 4 Z" fill="#2a6fb4"/>` + pl([[127, 264.4], [130, 264.4], [128.5, 260.6]], "#d62828") + ci(128.5, 265.6, 0.9, "#f1c27d");
  teil("vn_schrebergarten", 20, 258, k, { tipp: "Im Schrebergarten (Kleingarten) hat man eine Laube, Gemüsebeete und Blumen." });
}
{
  const X0 = 160, X1 = 224;
  let k = pl([[X0, 238], [X1, 238], [X1 + 1, 300], [X0 - 1, 300]], LG("hwiese", [[0, "#93c066"], [1, "#78a94e"]]));
  k += zaun(X0, X1, 242, 5, "#4a6b52") + li(X0, 242, X0 - 1, 300, "#4a6b52", 0.7) + li(X1, 242, X1 + 1, 300, "#4a6b52", 0.7);
  k += schild(X0 + 20, 244, 30, 6, "Hundewiese", "#7a5530", 3, "#f3ecdc");
  /* zwei Hunde, ein Ball, Kotbeutel-Spender, Katze auf dem Pfosten */
  const hund = (x, y, f, s, d = 1) => el(x, y - 4 * s, 5 * s, 2.4 * s, f) + ci(x + d * 5 * s, y - 6.4 * s, 2 * s, f) + el(x + d * 6.6 * s, y - 6 * s, 1.2 * s, 0.8 * s, f) + el(x + d * 4.4 * s, y - 7 * s, 0.8 * s, 1.6 * s, "#5a3d24") + ci(x + d * 7.6 * s, y - 6 * s, 0.4 * s, "#222") + re(x - 4 * s, y - 3 * s, 1.2 * s, 3 * s, f) + re(x - 1.6 * s, y - 3 * s, 1.2 * s, 3 * s, f) + re(x + 1.6 * s, y - 3 * s, 1.2 * s, 3 * s, f) + re(x + 3.6 * s, y - 3 * s, 1.2 * s, 3 * s, f) + `<path d="M${x - d * 5 * s} ${y - 5 * s} q${-d * 2 * s} ${-3 * s} ${-d * 1 * s} ${-5 * s}" stroke="${f}" stroke-width="${0.9 * s}" fill="none"/>`;
  k += hund(178, 272, "#c8893e", 1.4) + hund(204, 290, "#3b3b3b", 1.5, -1) + ci(192, 284, 1.4, "#e63946");
  k += re(X1 - 6, 256, 1, 14, "#555") + re(X1 - 9, 254, 7, 5, "#2e7d32") + tx(X1 - 5.5, 257.4, 1.4, "Beutel", "#fff");
  k += ci(X0 + 52, 236.4, 1.6, "#6b6b6b") + el(X0 + 52, 239.6, 2, 2.6, "#6b6b6b") + pl([[X0 + 50.6, 235.4], [X0 + 51.4, 233.4], [X0 + 52, 235]], "#6b6b6b") + pl([[X0 + 52.6, 235], [X0 + 53.2, 233.4], [X0 + 53.6, 235.4]], "#6b6b6b") + `<path d="M${X0 + 54} 241 q3 0 2.6 -3" stroke="#6b6b6b" stroke-width=".7" fill="none"/>`;
  teil("vn_haustiere", X0 + 50, 268, k, { tipp: "Auf der Hundewiese dürfen die Hunde ohne Leine rennen." });
}
{
  /* Insektenhotel */
  const X = 242, F = 294;
  let k = schatten(X, F, 12, 1.2, 0.3) + re(X - 1, F - 10, 2, 10, "#6b4a2e");
  k += re(X - 11, F - 40, 22, 30, "#a7764a") + pl([[X - 14, F - 40], [X, F - 50], [X + 14, F - 40]], "#5a3d24");
  /* Fächer: Bambus, Zapfen, gebohrtes Holz, Stroh */
  k += re(X - 9, F - 38, 8.6, 8, "#d9c79a"); for (let i = 0; i < 12; i++) k += ci(X - 7.8 + (i % 4) * 2, F - 36.4 + Math.floor(i / 4) * 2.4, 0.8, "#6b5a3a");
  k += re(X + 0.6, F - 38, 8.4, 8, "#6b4a2e"); for (let i = 0; i < 4; i++) k += el(X + 2.6 + (i % 2) * 4, F - 35.6 + Math.floor(i / 2) * 3.4, 1.8, 1.4, "#8a5a2c");
  k += re(X - 9, F - 28, 18, 7, "#c99a5a"); for (let i = 0; i < 14; i++) k += ci(X - 8 + (i % 7) * 2.6, F - 26.2 + Math.floor(i / 7) * 3, 0.45, "#3b2a1a");
  k += re(X - 9, F - 19.4, 18, 7, "#e6d28a"); for (let i = 0; i < 12; i++) k += li(X - 8.6 + i * 1.5, F - 19, X - 8 + i * 1.5, F - 12.8, "#c9b057", 0.4);
  /* Schmetterling und Biene */
  k += el(X + 15, F - 44, 1.6, 1.1, "#f4a261") + el(X + 17.6, F - 44, 1.6, 1.1, "#f4a261") + li(X + 16.3, F - 45, X + 16.3, F - 43, "#333", 0.4);
  k += el(X - 15, F - 30, 1.2, 0.8, "#ffd23f") + li(X - 15.6, F - 30, X - 15.6, F - 29.2, "#222", 0.4) + el(X - 15, F - 31, 0.9, 0.5, "#fff", ' opacity=".8"');
  k += re(X - 8, F - 9, 16, 4, "#fff") + tx(X, F - 6.2, 1.9, "Insektenhotel", "#7a5530", ' font-weight="bold"');
  teil("vn_kleintiere", X - 4, 244, k, { tipp: "Im Insektenhotel wohnen Wildbienen, Käfer und Marienkäfer." });
}
{
  const X0 = 262, X1 = 342, F = 292, T = 256;
  let k = schatten((X0 + X1) / 2, F, 42, 1.6, 0.3);
  k += re(X0 + 24, T, X1 - X0 - 24, F - T, LG("thputz", [[0, "#f5e8c8"], [1, "#e3cfa2"]])) + pl([[X0 + 22, T], [X1 + 2, T], [X1 - 4, T - 9], [X0 + 28, T - 9]], "#8c3a29");
  k += re(X0 + 28, T + 3, 48, 6.4, "#2e7d32") + tx(X0 + 52, T + 7.8, 3.8, "TIERHEIM", "#fff", ' font-weight="bold"') + tx(X0 + 52, T + 12, 1.8, "Tierschutzverein · Tiere suchen ein Zuhause", "#555");
  k += re(X0 + 30, T + 15, 9, 8, "#9fc3dc") + re(X0 + 64, T + 15, 9, 8, "#9fc3dc") + ci(X0 + 68, T + 21.4, 1.4, "#f4a261") + pl([[X0 + 66.8, T + 20.4], [X0 + 67.2, T + 19.2], [X0 + 67.8, T + 20.2]], "#f4a261");
  k += re(X0 + 46, T + 16, 10, F - T - 16, "#6d4a2a") + ci(X0 + 54, T + 27, 0.6, "#d8b46a");
  /* Hundezwinger links: Maschendraht, Hundehütte, Hund */
  k += re(X0, T + 10, 24, F - T - 10, "#d6dbc8");
  k += re(X0 + 4, F - 10, 10, 8, "#c0392b") + pl([[X0 + 3, F - 10], [X0 + 9, F - 15], [X0 + 15, F - 10]], "#8f2f22") + `<path d="M${X0 + 7} ${F - 2} v-4 q2 -2 4 0 v4 Z" fill="#3b2a1a"/>`;
  k += el(X0 + 19, F - 4, 3, 1.6, "#e9d6b0") + ci(X0 + 21.6, F - 6, 1.4, "#e9d6b0") + el(X0 + 21, F - 7, 0.6, 1.1, "#a7764a");
  for (let x = X0; x <= X0 + 24; x += 1.6) k += li(x, T + 10, x, F, "#8a9197", 0.18);
  for (let y = T + 10; y <= F; y += 1.6) k += li(X0, y, X0 + 24, y, "#8a9197", 0.18);
  k += re(X0, T + 9, 24, 1, "#6d7378") + re(X0, T + 9, 1, F - T - 9, "#6d7378");
  teil("vn_tierheim", X0 + 34, 276, k, { tipp: "Im Tierheim warten Hunde und Katzen auf eine neue Familie." });
}
{
  const X0 = 350, X1 = 398, F = 296;
  let k = pl([[X0, 262], [X1, 262], [X1 + 1, F], [X0 - 1, F]], "#9cc96b");
  k += zaun(X0, X1, 266, 4, "#9aa3aa");
  /* Wetterhütte (weiß, Lamellen) auf Beinen */
  k += schatten(366, F - 6, 10, 1, 0.3);
  for (const x of [359, 372]) k += re(x, F - 16, 1.2, 10, "#f3f3f0");
  k += re(357, F - 30, 18, 14, "#fbfbf8") + pl([[355, F - 30], [366, F - 34], [377, F - 30]], "#f3f3f0");
  for (let y = F - 28; y < F - 17; y += 1.6) k += li(358, y, 374, y + 0.6, "#c9cfd4", 0.4);
  /* Mast mit Windmesser und Fahne */
  k += re(388, 236, 1.2, F - 8 - 236, "#9aa3aa");
  for (let i = 0; i < 3; i++) { const a = i * 2.09 + 0.3; k += li(388.6, 236, 388.6 + Math.cos(a) * 4, 236 + Math.sin(a) * 1.4, "#666", 0.4) + ci(388.6 + Math.cos(a) * 4, 236 + Math.sin(a) * 1.4, 0.9, "#c0392b"); }
  k += pl([[389, 242], [396, 243.4], [389, 245]], "#f4a261");
  /* Regenmesser */
  k += re(380, F - 14, 3.2, 8, "#d9dde0") + el(381.6, F - 14, 1.8, 0.6, "#9aa3aa") + re(380.6, F - 6, 2, 2, "#666");
  k += schild(374, F - 4, 30, 4.6, "Wetterstation", "#1f6fb2", 2.4);
  teil("vn_wetter", 366, 248, k, { tipp: "Die Wetterstation misst Temperatur, Wind und Regen." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/viertel_gruen.js"));
console.log(aus);
