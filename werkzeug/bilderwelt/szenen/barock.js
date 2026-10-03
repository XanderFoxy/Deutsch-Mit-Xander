#!/usr/bin/env node
/* =====================================================================
   DER BAROCK (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar.

   RECHERCHE (Residenz Würzburg: Kaisersaal von Balthasar Neumann, Stuck
   von Antonio Bossi, Deckenfresken von Tiepolo, Gartensaal von Johann
   Zick; Dresdner Zwinger; Bayerische Schlösserverwaltung) — so sieht ein
   Festsaal im Barockschloss aus:
   - Hohe FENSTERTÜREN mit Rundbogen öffnen sich zum BAROCKGARTEN: streng
     symmetrische Broderie-Beete aus Buchs, Kegel-Eiben, Kieswege, in der
     Mittelachse der SPRINGBRUNNEN, auf Sockeln STATUEN antiker Götter.
     Gegenüber liegt der andere Flügel des SCHLOSSES: Mittelrisalit mit
     Giebel und Kuppel, gleiche Flügel rechts und links, Mansarddächer.
   - Wände weiß und gold, Pilaster aus rotem Stuckmarmor mit vergoldeten
     Kapitellen; über den Fenstern STUCK-Kartuschen aus Muscheln und
     C-Bögen (Rokoko). An der Decke ein DECKENFRESKO mit Göttern in
     Wolken, gerahmt von vergoldetem Stuck.
   - Ein KRONLEUCHTER aus Bergkristall mit Kerzen; zwischen den Fenstern
     ein hoher PFEILERSPIEGEL über einem KONSOLTISCH mit Porzellanvase
     (Dresden: Meissen und China-Porzellan), gegenüber ein Fürsten-
     GEMÄLDE über einer KOMMODE mit Pendule (Uhr).
   - VORHÄNGE aus Seidendamast mit Lambrequin und Quasten.
   - Musik bei Hof: das CEMBALO (Flügelform, Deckel innen bemalt, zwei
     Manuale mit schwarzen Untertasten), der Hofmusiker in Justaucorps
     mit weißer ALLONGEPERÜCKE, ein NOTENPULT, die VIOLINE auf dem
     vergoldeten SESSEL, das PARKETT im Versailler Muster.
   Maßstab: Augenhöhe y = 117 (1,6 m); Rückwand ≈ 14 Einheiten je Meter
   (Saalhöhe 7 m, Fenstertür 4,5 m), Cembalo (Boden y ≈ 172) ≈ 34 je
   Meter, Musiker 1,75 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "barock", titel: "Der Barock", emoji: "🎼", thema: "Geschichte", kuerzel: "b23b", fassung: 852 });
const rnd = zufall(1744);
const r = B.r;
const abs = (x, y, svg) => `<g transform="translate(${r(-x)} ${r(-y)})">${svg}</g>`;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("blur")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation=".8"/></filter>`);
const GOLD = S.lg("gold", [[0, "#fbe7a1"], [0.45, "#d9ae4a"], [1, "#8f6a22"]]);
const GOLD_V = S.lg("goldv", [[0, "#9a7228"], [0.4, "#f4d57e"], [0.6, "#e0b85a"], [1, "#8a6420"]], 0, 0, 1, 0);
const WAND = S.lg("wand", [[0, "#fbf6ea"], [1, "#efe4cc"]]);
const MARMOR = S.lg("marmor", [[0, "#9a4a3c"], [0.35, "#c47a64"], [0.6, "#a8574a"], [1, "#7a3428"]], 0, 0, 1, 0);
const DAMAST = S.lg("damast", [[0, "#7a1622"], [0.4, "#b02a36"], [0.7, "#8e1c28"], [1, "#5e0e18"]], 0, 0, 1, 0);
const HOLZ = S.lg("holz", [[0, "#7a4a24"], [0.5, "#9c6434"], [1, "#5e3618"]], 0, 0, 1, 0);

/* =====================================================================
   RAUM — Fluchtpunkt (160, 117). Rückwand x 36–284, y 40–140.
   ===================================================================== */
const VP = { x: 160, y: 117 };
const WL = 36, WR = 284, WO = 40, WU = 140;
const FENSTER = [82, 160, 238].map((c) => ({ c, x0: c - 13, x1: c + 13 }));
const F_KAEMPFER = 88, F_SCHEITEL = 75;
const fensterPfad = (f) => `M${f.x0} ${WU} L${f.x0} ${F_KAEMPFER} A13 13 0 0 1 ${f.x1} ${F_KAEMPFER} L${f.x1} ${WU} Z`;
FENSTER.forEach((f, i) => S.def(`<clipPath id="${S.id("fclip" + i)}"><path d="${fensterPfad(f)}"/></clipPath>`));

/* --- draußen: Himmel, ferner Schlossflügel, Parterre (hinter den Fenstern) --- */
{
  let g = `<rect x="${WL}" y="70" width="${WR - WL}" height="48" fill="${S.lg("himmel", [[0, "#8fb8de"], [1, "#e6eef2"]])}"/>`;
  g += `<ellipse cx="110" cy="84" rx="16" ry="2.4" fill="#fff" opacity=".7"/><ellipse cx="236" cy="80" rx="14" ry="2" fill="#fff" opacity=".6"/>`;
  /* Flügel des Schlosses gegenüber (Sandstein, Mansarddach) */
  g += `<rect x="${WL}" y="101" width="${WR - WL}" height="17" fill="${S.lg("fassade", [[0, "#efdcae"], [1, "#d8bf87"]])}"/>`;
  g += `<path d="M${WL} 101 L${WL} 96.4 L${WR} 96.4 L${WR} 101 Z" fill="#7b8794"/><rect x="${WL}" y="100.6" width="${WR - WL}" height=".9" fill="#f6ecd2"/>`;
  for (let x = WL + 3; x < WR; x += 6) {
    g += `<rect x="${x}" y="104" width="2.2" height="4.4" rx=".9" fill="#5d6f80"/><rect x="${x}" y="110.6" width="2.2" height="4.4" fill="#5d6f80"/>`;
    g += `<rect x="${x + 0.5}" y="97.6" width="1.2" height="2" fill="#5d6a75"/>`;
  }
  /* Balustrade mit kleinen Statuen auf der Attika */
  for (let x = WL + 6; x < WR; x += 18) g += `<rect x="${x}" y="93.4" width="1.2" height="3" rx=".5" fill="#efe6d0"/>`;
  /* Parterre: Rasen, Kieswege in Flucht, Buchsbeete, Kegel-Eiben */
  g += `<rect x="${WL}" y="117.4" width="${WR - WL}" height="${WU - 117.4}" fill="${S.lg("rasen", [[0, "#7f9c5a"], [1, "#5f8440"]])}"/>`;
  g += `<path d="M157 117.4 L163 117.4 L178 ${WU} L142 ${WU} Z" fill="#dccba0"/>`;
  g += `<path d="M${WL} 121.4 L${WR} 121.4 L${WR} 123.4 L${WL} 123.4 Z" fill="#d6c496"/><path d="M${WL} 129 L${WR} 129 L${WR} 132 L${WL} 132 Z" fill="#d6c496"/>`;
  for (let i = -6; i <= 6; i++) if (i) g += `<line x1="${160 + i * 7}" y1="117.4" x2="${160 + i * 26}" y2="${WU}" stroke="#d6c496" stroke-width=".8"/>`;
  for (const [x, y, s] of [[60, 121, 0.7], [104, 121, 0.7], [216, 121, 0.7], [260, 121, 0.7], [44, 129, 1], [120, 129, 1], [200, 129, 1], [276, 129, 1]]) g += `<path d="M${x - 1.6 * s} ${y} L${x} ${y - 6 * s} L${x + 1.6 * s} ${y} Z" fill="#2f4a26"/>`;
  S.hinten(g);
}

/* --- Rückwand mit Fensteröffnungen (Ausschnitte), Pilaster, Gesims --- */
{
  let g = `<path fill-rule="evenodd" d="M${WL} ${WO} L${WR} ${WO} L${WR} ${WU} L${WL} ${WU} Z ${FENSTER.map(fensterPfad).join(" ")}" fill="${WAND}"/>`;
  /* Fensterlaibungen (Tiefe) */
  for (const f of FENSTER) g += `<path d="M${f.x0 - 2.4} ${WU} L${f.x0 - 2.4} ${F_KAEMPFER} A15.4 15.4 0 0 1 ${f.x1 + 2.4} ${F_KAEMPFER} L${f.x1 + 2.4} ${WU}" fill="none" stroke="${GOLD}" stroke-width="1.2"/>`;
  /* Pilaster aus rotem Stuckmarmor mit vergoldeten Kapitellen */
  for (const f of FENSTER) for (const px of [f.x0 - 9, f.x1 + 3]) {
    g += `<rect x="${px}" y="49" width="6" height="${WU - 49}" fill="${MARMOR}"/>`;
    g += `<path d="M${px + 1.4} 60 q1.2 8 -.2 16 q1.4 10 .4 22 M${px + 4.2} 70 q-1 9 .4 18" stroke="#e7b3a2" stroke-width=".3" fill="none" opacity=".7"/>`;
    g += `<path d="M${px - 1} 49 L${px + 7} 49 L${px + 6.2} 53.4 L${px - 0.2} 53.4 Z" fill="${GOLD}"/><path d="M${px - 0.6} 49.6 q1.6 2.6 3.6 0 q2 2.6 3.6 0" stroke="#8a6420" stroke-width=".35" fill="none"/>`;
    g += `<rect x="${px - 0.8}" y="${WU - 5}" width="7.6" height="5" fill="${GOLD}"/><rect x="${px - 0.8}" y="${WU - 5}" width="7.6" height=".8" fill="#fff3c4"/>`;
  }
  /* Gesims (Hohlkehle) mit Goldleiste und Sockel */
  g += `<rect x="${WL}" y="${WO}" width="${WR - WL}" height="5" fill="${S.lg("kehle", [[0, "#d8ccb4"], [1, "#fbf6ea"]])}"/><rect x="${WL}" y="${WO + 5}" width="${WR - WL}" height="1.6" fill="${GOLD}"/>`;
  for (let x = WL + 2; x < WR; x += 4) g += `<rect x="${x}" y="${WO + 1.6}" width="1.6" height="2" fill="#e9dcc2"/>`;
  g += `<rect x="${WL}" y="${WU - 6}" width="${WR - WL}" height="6" fill="${S.lg("sockel", [[0, "#efe4cc"], [1, "#d8c9a8"]])}"/>`;
  for (const f of FENSTER) g += `<rect x="${f.x0}" y="${WU - 6}" width="26" height="6" fill="none"/>`;
  /* Kartuschen über Mittel- und rechtem Fenster (die linke ist ein Teil) */
  for (const c of [160, 238]) g += kartusche(c, 60, 0.9);
  /* Seitenwände in Flucht mit Stuckfeldern */
  g += `<path d="M0 17.6 L${WL} ${WO} L${WL} ${WU} L0 146.7 Z" fill="${S.lg("seitel", [[0, "#e4d6b8"], [1, "#f3ead6"]], 0, 0, 1, 0)}"/>`;
  g += `<path d="M320 17.6 L${WR} ${WO} L${WR} ${WU} L320 146.7 Z" fill="${S.lg("seiter", [[0, "#f3ead6"], [1, "#e0d1b1"]], 0, 0, 1, 0)}"/>`;
  for (const [a, b] of [[4, 30], [290, 316]]) {
    const ya = (x) => x < 160 ? 17.6 + (x / WL) * (WO - 17.6) : 17.6 + ((320 - x) / (320 - WR)) * (WO - 17.6);
    const yb = (x) => x < 160 ? 146.7 - (x / WL) * (146.7 - WU) : 146.7 - ((320 - x) / (320 - WR)) * (146.7 - WU);
    g += `<path d="M${a} ${r(ya(a) + 12)} L${b} ${r(ya(b) + 12)} L${b} ${r(yb(b) - 14)} L${a} ${r(yb(a) - 14)} Z" fill="none" stroke="${GOLD}" stroke-width=".9"/>`;
  }
  g += `<path d="M0 17.6 L${WL} ${WO} M320 17.6 L${WR} ${WO}" stroke="${GOLD}" stroke-width="1.4"/>`;
  /* Decke (hell, Stuckrahmen) */
  g += `<path d="M0 0 L320 0 L320 17.6 L${WR} ${WO} L${WL} ${WO} L0 17.6 Z" fill="${S.lg("decke", [[0, "#efe6d4"], [1, "#fbf7ee"]])}"/>`;
  g += `<path d="M78 0 L242 0 L216 36 L104 36 Z" fill="none" stroke="#e6d8ba" stroke-width="2"/>`;
  S.hinten(g);
}

/* Rocaille-Kartusche: Muschel, C-Bögen, Blattwerk (vergoldeter Stuck) */
function kartusche(cx, cy, s) {
  const p = (x, y) => `${r(cx + x * s)} ${r(cy + y * s)}`;
  let g = `<path d="M${p(-7, 6)} Q${p(-10, -2)} ${p(-4, -8)} Q${p(0, -12)} ${p(4, -8)} Q${p(10, -2)} ${p(7, 6)} Q${p(0, 9)} ${p(-7, 6)} Z" fill="#f7efdc" stroke="${GOLD}" stroke-width="${r(1.1 * s)}"/>`;
  for (let i = -3; i <= 3; i++) g += `<path d="M${p(0, 4)} L${p(i * 1.9, -6 + Math.abs(i) * 0.9)}" stroke="#c9a04a" stroke-width="${r(0.5 * s)}"/>`;
  g += `<path d="M${p(-7, 6)} q${r(-6 * s)} ${r(-2 * s)} ${r(-8 * s)} ${r(-7 * s)} q${r(3 * s)} ${r(1 * s)} ${r(2 * s)} ${r(4 * s)} M${p(7, 6)} q${r(6 * s)} ${r(-2 * s)} ${r(8 * s)} ${r(-7 * s)} q${r(-3 * s)} ${r(1 * s)} ${r(-2 * s)} ${r(4 * s)}" stroke="${GOLD}" stroke-width="${r(1 * s)}" fill="none"/>`;
  g += `<path d="M${p(-13, 2)} q${r(-4 * s)} ${r(5 * s)} ${r(-9 * s)} ${r(6 * s)} M${p(13, 2)} q${r(4 * s)} ${r(5 * s)} ${r(9 * s)} ${r(6 * s)}" stroke="${GOLD}" stroke-width="${r(0.7 * s)}" fill="none"/>`;
  for (const sx of [-1, 1]) for (let i = 0; i < 4; i++) g += `<ellipse cx="${r(cx + sx * (16 + i * 3) * s)}" cy="${r(cy + (6 + i * 1.6) * s)}" rx="${r(1.4 * s)}" ry="${r(0.8 * s)}" fill="${GOLD}"/>`;
  g += `<path d="M${p(-3, 7)} Q${p(0, 13)} ${p(3, 7)}" stroke="${GOLD}" stroke-width="${r(0.8 * s)}" fill="none"/><circle cx="${r(cx)}" cy="${r(cy + 12 * s)}" r="${r(1.1 * s)}" fill="${GOLD}"/>`;
  return g;
}

/* =====================================================================
   1 — DAS DECKENFRESKO (Götter in den Wolken, Stuckrahmen)
   ===================================================================== */
{
  const P = [[92, 4], [228, 4], [210, 34], [110, 34]];
  const pfad = `M${P.map((q) => q.join(" ")).join(" L")} Z`;
  let k = `<path d="${pfad}" fill="${S.lg("fhimmel", [[0, "#7fa6d2"], [0.6, "#c7d9ea"], [1, "#f4e2b8"]])}"/>`;
  k += `<ellipse cx="160" cy="26" rx="20" ry="6" fill="${S.rg("sonne", [[0, "#fff6d0"], [1, "#fff6d0", 0]])}"/>`;
  /* Wolken */
  for (const [x, y, rx, ry] of [[120, 28, 16, 4], [136, 30, 12, 3.4], [196, 27, 18, 4.4], [178, 31, 12, 3], [110, 12, 14, 3.6], [214, 12, 13, 3.4], [160, 9, 18, 3]]) {
    k += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#f7f1e6" opacity=".9"/><ellipse cx="${x - 2}" cy="${y + ry * 0.4}" rx="${rx * 0.8}" ry="${ry * 0.5}" fill="#d9cbb6" opacity=".55"/>`;
  }
  /* Götter in wallenden Gewändern auf den Wolken (bekleidet) */
  const figur = (x, y, kl, s, arm) => {
    let g = `<path d="M${x - 3 * s} ${y} Q${x - 4 * s} ${y - 5 * s} ${x - 1.2 * s} ${y - 7 * s} L${x + 1.6 * s} ${y - 7 * s} Q${x + 4.4 * s} ${y - 4 * s} ${x + 4 * s} ${y} Q${x + 1 * s} ${y + 1.4 * s} ${x - 3 * s} ${y} Z" fill="${kl}"/>`;
    g += `<path d="M${x - 2 * s} ${y - 2 * s} q${2 * s} ${-1 * s} ${4 * s} ${0.4 * s}" stroke="#fff" stroke-width="${0.4 * s}" opacity=".35" fill="none"/>`;
    g += `<circle cx="${x + 0.2 * s}" cy="${y - 8.4 * s}" r="${1.5 * s}" fill="#e8bf98"/><path d="M${x - 1.3 * s} ${y - 8.8 * s} q${1.4 * s} ${-2 * s} ${3 * s} 0" stroke="#6b4a2e" stroke-width="${0.6 * s}" fill="none"/>`;
    if (arm) g += `<path d="M${x + 1.4 * s} ${y - 6 * s} l${arm * 3 * s} ${-3 * s}" stroke="#e8bf98" stroke-width="${0.8 * s}" stroke-linecap="round"/>`;
    g += `<path d="M${x - 3 * s} ${y - 6 * s} Q${x - 8 * s} ${y - 9 * s} ${x - 10 * s} ${y - 4 * s}" stroke="${kl}" stroke-width="${0.9 * s}" fill="none" opacity=".8"/>`;
    return g;
  };
  k += figur(122, 27, "#b8423a", 1.1, 1) + figur(198, 26, "#3f6aa8", 1.1, -1) + figur(158, 22, "#e0b44a", 1.2, 1) + figur(140, 30, "#5e8a4a", 0.9, 0) + figur(180, 30, "#8a4a8a", 0.9, -1);
  /* Stuckrahmen, vergoldet, mit Eckmuscheln */
  k += `<path d="${pfad}" fill="none" stroke="${GOLD}" stroke-width="2.2"/><path d="${pfad}" fill="none" stroke="#fff4c8" stroke-width=".5" transform="translate(0 .6)"/>`;
  for (const [x, y] of P) k += `<circle cx="${x}" cy="${y}" r="2.2" fill="${GOLD}"/><circle cx="${x - 0.5}" cy="${y - 0.5}" r=".8" fill="#fff4c8"/>`;
  S.teil({ id: "deckenfresko", de: "das Deckenfresko", syl: "DE-cken-fres-ko", it: "l'affresco del soffitto", itSyl: "af-FRE-sco del sof-FIT-to", en: "ceiling fresco", x: 160, y: 34, kunst: abs(160, 34, k),
    tipp: "Ein Fresko wird auf den nassen Putz gemalt, so hält die Farbe Jahrhunderte." });
}

/* =====================================================================
   2 — DER STUCK (Rocaille-Kartusche über dem linken Fenster)
   ===================================================================== */
S.teil({ id: "stuck", de: "der Stuck", syl: "STUCK", it: "lo stucco", itSyl: "STUC-co", en: "stucco", x: 82, y: 72, kunst: abs(82, 72, kartusche(82, 60, 0.9)),
  tipp: "Stuck wird aus Gips, Kalk und Sand frei an Wand und Decke modelliert." });

/* =====================================================================
   3 — DAS PARKETT (Versailler Tafeln in Flucht)
   ===================================================================== */
{
  let k = `<path d="M0 146.7 L${WL} ${WU} L${WR} ${WU} L320 146.7 L320 200 L0 200 Z" fill="${S.lg("parkett", [[0, "#9a6a3e"], [1, "#b88452"]])}"/>`;
  /* Fugen in Flucht und Querfugen (perspektivisch dichter nach hinten) */
  for (let i = -14; i <= 14; i++) {
    const xb = 160 + i * 9; let x2 = VP.x + (xb - VP.x) * (200 - VP.y) / (WU - VP.y), y2 = 200;
    if (x2 < 0 || x2 > 320) { const xr = x2 < 0 ? 0 : 320; y2 = VP.y + (WU - VP.y) * (xr - VP.x) / (xb - VP.x); x2 = xr; }
    k += `<line x1="${r(xb)}" y1="${WU}" x2="${r(x2)}" y2="${r(y2)}" stroke="#6e4524" stroke-width=".35" opacity=".8"/>`;
  }
  const qs = [];
  for (let i = 1; i < 12; i++) { const n = 1 / (WU - VP.y) - i * 0.0042; if (n <= 0) break; const d = 1 / n; if (d + VP.y < 200) qs.push(VP.y + d); }
  qs.forEach((y, i) => {
    k += `<line x1="0" y1="${r(y)}" x2="320" y2="${r(y)}" stroke="#6e4524" stroke-width=".4" opacity=".8"/>`;
    /* Diagonalflechtwerk in jeder zweiten Reihe angedeutet */
    if (i % 2 === 0) k += `<rect x="0" y="${r(y)}" width="320" height="${r((qs[i + 1] || 200) - y)}" fill="#fff" opacity=".04"/>`;
  });
  /* Glanz der Fenster auf dem Boden */
  for (const f of FENSTER) k += `<path d="M${f.x0} ${WU} L${f.x1} ${WU} L${f.x1 + (f.c - VP.x) * 0.6 + 14} 200 L${f.x0 + (f.c - VP.x) * 0.6 - 14} 200 Z" fill="#fff6dc" opacity=".14"/>`;
  k += `<path d="M0 146.7 L${WL} ${WU} L${WR} ${WU} L320 146.7 L320 200 L0 200 Z" fill="${S.lg("bodenlicht", [[0, "#000", 0.15], [0.3, "#000", 0], [1, "#000", 0.12]])}"/>`;
  S.teil({ id: "parkett", de: "das Parkett", syl: "par-KETT", it: "il parquet", itSyl: "par-QUET", en: "parquet floor", x: 160, y: 200, kunst: abs(160, 200, k) });
}

/* =====================================================================
   4 — DAS SCHLOSS (Mittelrisalit gegenüber, durch das Mittelfenster)
   5 — DER SPRINGBRUNNEN, 6 — DIE STATUE, 7 — DER BAROCKGARTEN
   Jedes Ding ist auf sein Fenster zugeschnitten; der Fensterrahmen
   mit Sprossen gehört zum Ding hinter der Scheibe.
   ===================================================================== */
const sprossen = (f) => {
  let g = `<g pointer-events="none"><path d="${fensterPfad(f)}" fill="${S.lg("scheibe", [[0, "#fff", 0.12], [0.5, "#fff", 0], [1, "#fff", 0.08]], 0, 0, 1, 1)}"/>`;
  g += `<path d="M${f.x0 + 3} ${WU - 4} L${f.x0 + 9} ${F_KAEMPFER} L${f.x0 + 12} ${F_KAEMPFER} L${f.x0 + 6} ${WU - 4} Z" fill="#fff" opacity=".12"/>`;
  for (const y of [100, 112, 124]) g += `<rect x="${f.x0}" y="${y}" width="26" height=".7" fill="#f4ecd8"/>`;
  g += `<rect x="${f.c - 0.7}" y="${F_KAEMPFER - 13}" width="1.4" height="${WU - F_KAEMPFER + 13}" fill="#f4ecd8"/>`;
  g += `<rect x="${f.x0}" y="${F_KAEMPFER}" width="26" height="1.1" fill="#f4ecd8"/>`;
  g += `<path d="M${f.c} ${F_KAEMPFER} L${f.x0 + 3} ${F_KAEMPFER - 6} M${f.c} ${F_KAEMPFER} L${f.x1 - 3} ${F_KAEMPFER - 6}" stroke="#f4ecd8" stroke-width=".6"/>`;
  g += `<path d="${fensterPfad(f)}" fill="none" stroke="#f4ecd8" stroke-width="1.6"/>`;
  g += `<rect x="${f.c + 1.4}" y="114" width=".8" height="3" rx=".3" fill="${GOLD}"/><rect x="${f.c - 2.2}" y="114" width=".8" height="3" rx=".3" fill="${GOLD}"/></g>`;
  return g;
};
S.hinten(sprossen(FENSTER[0]));
const imFenster = (i, svg) => `<g clip-path="url(#${S.id("fclip" + i)})">${svg}</g>`;
{
  const f = FENSTER[1];
  let g = "";
  /* Mittelrisalit: Säulenordnung, Dreiecksgiebel, kupfergrüne Kuppel mit Laterne */
  g += `<path d="M150 82 Q160 70 170 82 Z" fill="${S.lg("kuppel", [[0, "#8fc2a6"], [0.5, "#5e9a7c"], [1, "#3e6e56"]], 0, 0, 1, 0)}"/>`;
  g += `<rect x="158.6" y="72" width="2.8" height="4" fill="#5e9a7c"/><path d="M158 72 L160 69 L162 72 Z" fill="#c9a33a"/>`;
  g += `<rect x="146" y="82" width="28" height="4" fill="#7b8794"/>`;
  g += `<rect x="145" y="91" width="30" height="27" fill="${S.lg("risalit", [[0, "#f4e4bc"], [1, "#dcc391"]])}"/>`;
  g += `<path d="M143.6 91.4 L160 84.4 L176.4 91.4 Z" fill="#efdfb6" stroke="#cdb27a" stroke-width=".5"/><circle cx="160" cy="89" r="1.4" fill="#c9a33a"/>`;
  for (let i = 0; i < 4; i++) g += `<rect x="${147.2 + i * 7.6}" y="93" width="1.4" height="25" fill="#fbf2da"/>`;
  for (let i = 0; i < 3; i++) { const x = 150.8 + i * 7.6; g += `<path d="M${x} 118 L${x} 109 Q${x + 1.6} 106.6 ${x + 3.2} 109 L${x + 3.2} 118 Z" fill="#4d5f70"/><rect x="${x}" y="96" width="3.2" height="7" rx=".6" fill="#5d6f80"/>`; }
  g += `<rect x="144" y="117" width="32" height="1.6" fill="#cdb27a"/>`;
  for (let x = 145; x < 175; x += 4) g += `<rect x="${x}" y="88.6" width=".9" height="2.2" rx=".4" fill="#f6ecd2"/>`;
  g += `<path d="M146 88 L146 86 L150 86 L150 88 M170 88 L170 86 L174 86 L174 88" stroke="#efe6d0" stroke-width=".9" fill="none"/>`;
  S.teil({ id: "schloss", de: "das Schloss", syl: "SCHLOSS", it: "il castello", itSyl: "ca-STEL-lo", en: "palace", x: 160, y: 118, kunst: abs(160, 118, imFenster(1, g)),
    tipp: "Symmetrisch gebaut: die Mitte betont, die Flügel rechts und links gleich." });
}
{
  /* Springbrunnen in der Mittelachse: Becken, hoher Strahl, Fächer */
  let g = `<ellipse cx="160" cy="129" rx="11" ry="2.8" fill="#e8dcc0"/><ellipse cx="160" cy="129" rx="9.4" ry="2" fill="${S.lg("wasser", [[0, "#6fa0c0"], [1, "#a9cde0"]])}"/>`;
  g += `<path d="M149 129 L149 130.6 Q160 133.6 171 130.6 L171 129" fill="#cfc2a4"/>`;
  g += `<path d="M159.4 128.6 Q159.6 112 160 100 Q160.4 112 160.6 128.6 Z" fill="#e8f4fa" opacity=".9"/>`;
  g += `<path d="M160 101 Q156 103 153.6 112 M160 101 Q164 103 166.4 112 M160 104 Q154 108 152 120 M160 104 Q166 108 168 120" stroke="#e8f4fa" stroke-width=".5" fill="none" opacity=".7"/>`;
  for (let i = 0; i < 16; i++) g += `<circle cx="${r(152 + rnd() * 16)}" cy="${r(104 + rnd() * 22)}" r=".35" fill="#fff" opacity=".8"/>`;
  g += `<ellipse cx="160" cy="128.4" rx="6" ry="1" fill="#fff" opacity=".5"/>`;
  g += sprossen(FENSTER[1]);
  S.teil({ id: "springbrunnen", de: "der Springbrunnen", syl: "SPRING-brun-nen", it: "la fontana", itSyl: "fon-TA-na", en: "fountain", x: 160, y: 132, kunst: abs(160, 132, imFenster(1, g)) });
}
{
  /* Broderie-Parterre mit Buchs-Ornament und Kegel-Eiben — rechtes Fenster */
  const f = FENSTER[2];
  let g = `<rect x="${f.x0}" y="117.4" width="26" height="${WU - 117.4}" fill="${S.lg("beet", [[0, "#8aa461"], [1, "#6a8c48"]])}"/>`;
  g += `<path d="M${f.x0} 121.4 H${f.x1} V123.4 H${f.x0} Z M${f.x0} 129 H${f.x1} V132 H${f.x0} Z" fill="#dccba0"/>`;
  for (const [y, s] of [[126.4, 0.7], [136, 1]]) {
    g += `<path d="M${f.x0 + 2} ${y} q${3 * s} ${-2.4 * s} ${6 * s} 0 q${3 * s} ${2.4 * s} ${6 * s} 0 q${3 * s} ${-2.4 * s} ${6 * s} 0 q${3 * s} ${2.4 * s} ${6 * s} 0" stroke="#2f4a26" stroke-width="${r(0.9 * s)}" fill="none"/>`;
    g += `<circle cx="${f.x0 + 5 * s + 2}" cy="${y - 1}" r="${r(0.9 * s)}" fill="none" stroke="#2f4a26" stroke-width=".5"/><circle cx="${f.x0 + 17 * s + 2}" cy="${y + 1}" r="${r(0.9 * s)}" fill="none" stroke="#2f4a26" stroke-width=".5"/>`;
  }
  for (const [x, y, s] of [[f.x0 + 3, 129, 1], [f.x1 - 3, 129, 1], [f.x0 + 6, 121.4, 0.7], [f.x1 - 6, 121.4, 0.7]]) {
    g += `<path d="M${x - 1.8 * s} ${y} L${x} ${y - 7 * s} L${x + 1.8 * s} ${y} Z" fill="${S.lg("eibe", [[0, "#4e7a3a"], [1, "#22381c"]], 0, 0, 1, 0)}"/>`;
  }
  g += `<ellipse cx="${f.c + 4}" cy="137.6" rx="2.6" ry="1.4" fill="#c84a5a"/><ellipse cx="${f.c - 7}" cy="138" rx="2" ry="1.2" fill="#e8d36a"/>`;
  S.teil({ id: "garten", de: "der Barockgarten", syl: "ba-ROCK-gar-ten", it: "il giardino barocco", itSyl: "giar-DI-no ba-ROC-co", en: "baroque garden", x: f.c, y: WU, kunst: abs(f.c, WU, imFenster(2, g)),
    tipp: "Streng geometrisch: der Mensch ordnet die Natur." });
}

{
  /* Statue auf Sockel (Flora mit Blumenkorb, im Faltengewand) — rechtes Fenster, vor dem Parterre */
  const f = FENSTER[2], dx = 156;
  let g = `<g transform="translate(${dx} 0)">`;
  g += `<rect x="78.6" y="126" width="6.8" height="7" fill="${S.lg("sockel2", [[0, "#f2ece0"], [1, "#bdb4a4"]], 0, 0, 1, 0)}"/><rect x="78" y="125.2" width="8" height="1.2" fill="#e8e1d2"/><rect x="78" y="132.2" width="8" height="1.2" fill="#d3cab8"/>`;
  const M = S.lg("stein", [[0, "#fbf8f2"], [0.6, "#e2dccf"], [1, "#b5ad9e"]], 0, 0, 1, 0);
  g += `<path d="M79.6 125.2 Q79 120 80.4 116.6 Q81 114.4 82 114 Q83.4 114.4 83.8 116.6 Q85 120 84.6 125.2 Z" fill="${M}"/>`;
  g += `<path d="M80.6 124.6 Q81.4 120 81 116.8 M82.4 125 Q83 120.6 82.6 116.4 M83.8 124.4 Q83.6 121 83.2 118" stroke="#a69e8e" stroke-width=".3" fill="none"/>`;
  g += `<circle cx="82" cy="112.6" r="1.3" fill="${M}"/><path d="M80.8 112.2 q1.2 -1.4 2.4 0" stroke="#cfc8b8" stroke-width=".5" fill="none"/>`;
  g += `<path d="M83.6 115.6 L85.4 113.8" stroke="#e2dccf" stroke-width=".7" stroke-linecap="round"/><path d="M84.6 113.6 q1 -1.6 2 0 Z" fill="${M}"/>`;
  g += `<path d="M80.4 116.6 Q78.8 119 80 121" stroke="#e2dccf" stroke-width=".7" fill="none" stroke-linecap="round"/>`;
  g += `</g>` + sprossen(f);
  S.teil({ id: "statue", de: "die Statue", syl: "STA-tu-e", it: "la statua", itSyl: "STA-tua", en: "statue", x: 238, y: 133, kunst: abs(238, 133, imFenster(2, g)),
    tipp: "Im Barockgarten stehen Statuen antiker Götter, hier Flora, die Göttin der Blumen." });
}
/* =====================================================================
   8 — DER VORHANG (Seidendamast mit Lambrequin am Mittelfenster)
   ===================================================================== */
{
  let k = "";
  for (const s of [-1, 1]) {
    const a = 160 + s * 19.5, b = 160 + s * 11;
    k += `<path d="M${a} 76 L${b} 76 Q${b + s * 1} 100 ${160 + s * 15.5} 116 Q${b - s * 0.6} 128 ${160 + s * 13.4} ${WU} L${160 + s * 21} ${WU} Q${a + s * 0.6} 110 ${a} 76 Z" fill="${DAMAST}"/>`;
    for (const t of [0.3, 0.6]) k += `<path d="M${r(a + (b - a) * t)} 77 Q${r(a + (b - a) * t + s * 1)} 100 ${r(160 + s * (15.5 + 2.6 * (1 - t)))} 116" stroke="#5e0e18" stroke-width=".45" fill="none"/>`;
    k += `<path d="M${160 + s * 14} 115 Q${160 + s * 16} 117.6 ${160 + s * 19} 115.6" stroke="${GOLD}" stroke-width="1" fill="none"/><path d="M${160 + s * 18.6} 115.6 l${s * 0.8} 4 l${-s * 1.6} 0 Z" fill="${GOLD}"/>`;
  }
  /* Lambrequin mit Bögen, Fransen und Quasten */
  let saum = `M140 76 L180 76 L180 80`;
  for (let i = 0; i < 4; i++) saum += ` Q${175 - i * 10} 85 ${170 - i * 10} 80`;
  k += `<path d="${saum} Z" fill="${DAMAST}"/><path d="${saum.replace("M140 76 L180 76 L180 80", "M180 80")}" stroke="${GOLD}" stroke-width=".9" fill="none"/>`;
  k += `<rect x="139" y="74.4" width="42" height="2.2" rx=".8" fill="${GOLD_V}"/>`;
  for (const x of [150, 160, 170]) k += `<path d="M${x} 81 l.8 3 l-1.6 0 Z" fill="${GOLD}"/>`;
  S.teil({ id: "vorhang", de: "der Vorhang", syl: "VOR-hang", it: "la tenda", itSyl: "TEN-da", en: "curtain", x: 160, y: WU, kunst: abs(160, WU, k) });
}

/* =====================================================================
   9 — DER SPIEGEL (Pfeilerspiegel), 10 — DER KONSOLTISCH, 11 — DIE VASE
   ===================================================================== */
{
  const x0 = 108, x1 = 134, y0 = 70, y1 = 125;
  let k = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${S.lg("spiegel", [[0, "#c9d3d6"], [0.45, "#8e9ea4"], [1, "#b7c2c4"]], 0, 0, 1, 1)}"/>`;
  /* Spiegelbild: gegenüberliegende Fenster und Lichter des Saals */
  k += `<g opacity=".45">${[113, 125].map((x) => `<path d="M${x} ${y1} L${x} 92 Q${x + 3} 87 ${x + 6} 92 L${x + 6} ${y1} Z" fill="#eef6f8"/>`).join("")}</g>`;
  k += `<g opacity=".7"><circle cx="121" cy="80" r="1.2" fill="#fff6c8"/><circle cx="117" cy="82" r=".8" fill="#fff6c8"/><circle cx="125" cy="82" r=".8" fill="#fff6c8"/></g>`;
  k += `<path d="M${x0 + 2} ${y1 - 2} L${x0 + 14} ${y0 + 2} L${x0 + 19} ${y0 + 2} L${x0 + 7} ${y1 - 2} Z" fill="#fff" opacity=".22"/>`;
  /* vergoldeter Rahmen mit Bekrönung (Muschel und Voluten) */
  k += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="none" stroke="${GOLD_V}" stroke-width="2.4"/>`;
  k += `<rect x="${x0 + 1.6}" y="${y0 + 1.6}" width="${x1 - x0 - 3.2}" height="${y1 - y0 - 3.2}" fill="none" stroke="#8a6420" stroke-width=".3"/>`;
  k += kartusche(121, 66, 0.55);
  k += `<path d="M${x0 - 1} ${y1 + 1} q-2 -4 0 -8 M${x1 + 1} ${y1 + 1} q2 -4 0 -8" stroke="${GOLD}" stroke-width="1" fill="none"/>`;
  S.teil({ id: "spiegel", de: "der Spiegel", syl: "SPIE-gel", it: "lo specchio", itSyl: "SPEC-chio", en: "mirror", x: 121, y: y1 + 1, kunst: abs(121, y1 + 1, k),
    tipp: "Große Spiegel waren teuer – sie zeigten den Reichtum des Fürsten." });
}
{
  /* Konsoltisch: Marmorplatte, geschwungene vergoldete Beine */
  let k = schatten(0, 0.2, 12, 1, 0.25);
  k += `<rect x="-12" y="-13" width="24" height="1.8" rx=".6" fill="${S.lg("platte", [[0, "#e9e4dc"], [1, "#b9b0a2"]])}"/>`;
  k += `<path d="M-11 -11.2 L11 -11.2 L10 -8.4 Q0 -6 -10 -8.4 Z" fill="${GOLD}"/><path d="M-2 -8.2 q2 1.8 4 0" stroke="#8a6420" stroke-width=".4" fill="none"/>`;
  k += `<path d="M-9.6 -9 Q-6.4 -5 -9 -1 Q-9.6 0 -8 0 M9.6 -9 Q6.4 -5 9 -1 Q9.6 0 8 0" stroke="${GOLD}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M-8 -3 Q0 -5 8 -3" stroke="${GOLD}" stroke-width=".7" fill="none"/>`;
  S.teil({ id: "konsoltisch", de: "der Konsoltisch", syl: "kon-SOL-tisch", it: "la consolle", itSyl: "con-SOL-le", en: "console table", x: 121, y: WU, steht: true, kunst: k });
}
{
  /* Porzellanvase, blau-weiß (China / Meissen), mit Deckel */
  let k = schatten(0, 0.1, 3.4, 0.6, 0.3);
  k += `<path d="M-1.6 0 L1.6 0 L2.2 -1.2 Q4 -3.6 3.2 -6 Q2.4 -7.4 1.4 -7.8 L1.4 -8.6 L-1.4 -8.6 L-1.4 -7.8 Q-2.4 -7.4 -3.2 -6 Q-4 -3.6 -2.2 -1.2 Z" fill="${S.lg("porz", [[0, "#ffffff"], [0.6, "#eef1f6"], [1, "#c3cad6"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-2.8 -4.6 q1 -1.4 2 0 q1 1.4 2 0 q.8 -1.2 1.4 -.2 M-2.4 -2.4 q1.4 .8 2.4 -.4 q1 -1 2.4 .2" stroke="#2c4f9a" stroke-width=".4" fill="none"/>`;
  k += `<circle cx="-.6" cy="-3.4" r=".6" fill="#2c4f9a"/><rect x="-1.6" y="-8.8" width="3.2" height=".5" fill="#2c4f9a"/>`;
  k += `<path d="M-1.4 -8.6 Q0 -10.6 1.4 -8.6 Z" fill="#eef1f6"/><circle cx="0" cy="-10.2" r=".5" fill="${GOLD}"/>`;
  S.teil({ oben: true, id: "vase", de: "die Vase", syl: "VA-se", it: "il vaso", itSyl: "VA-so", en: "vase", x: 121, y: WU - 13, steht: true, kunst: k,
    tipp: "August der Starke sammelte in Dresden Tausende Porzellanvasen." });
}

/* =====================================================================
   12 — DAS GEMÄLDE (Fürstenbildnis), 13 — DIE KOMMODE, 14 — DIE UHR
   ===================================================================== */
{
  const x0 = 186, x1 = 212, y0 = 70, y1 = 108;
  let k = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${S.lg("bildgrund", [[0, "#4a3a2c"], [1, "#2a2018"]])}"/>`;
  /* Fürst im Harnisch mit Hermelinmantel und Perücke, roter Vorhang */
  k += `<path d="M${x0} ${y0} L${x0 + 9} ${y0} Q${x0 + 5} ${y0 + 16} ${x0} ${y0 + 22} Z" fill="#7a1622" opacity=".9"/>`;
  k += `<path d="M190 108 Q190 96 194 92 L204 92 Q208 96 208 108 Z" fill="${S.lg("harnisch", [[0, "#9aa3ab"], [0.5, "#5e666e"], [1, "#3a4046"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M190 108 Q189 98 193 93 L196 96 Q194 102 196 108 Z M208 108 Q209 98 205 93 L202 96 Q204 102 202 108 Z" fill="#f4efe4"/>`;
  for (const [x, y] of [[191.6, 100], [193, 105], [206.4, 100], [205, 105]]) k += `<path d="M${x} ${y} l.4 1 l-.8 0 Z" fill="#1a1a1a"/>`;
  k += `<rect x="197" y="96" width="4" height="12" fill="#c9a33a" opacity=".55"/>`;
  k += `<path d="M196 92 Q199 94 202 92 L201 89 L197 89 Z" fill="#f4efe4"/>`;
  k += `<ellipse cx="199" cy="85.4" rx="2.6" ry="3.2" fill="#e2b48e"/><path d="M198 87.6 q1 .6 2 0" stroke="#9a5a44" stroke-width=".3" fill="none"/>`;
  k += `<path d="M195.6 92 Q194.6 86 195.6 82.4 Q199 79 202.4 82.4 Q203.4 86 202.4 92 L201.4 87 Q201.4 83.6 199 83.2 Q196.6 83.6 196.6 87 Z" fill="#6b4a2e"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${S.lg("firnis", [[0, "#fff1c8", 0.12], [1, "#000", 0.15]], 0, 0, 1, 1)}"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="none" stroke="${GOLD_V}" stroke-width="2.6"/>`;
  k += kartusche(199, 66, 0.45);
  S.teil({ id: "gemaelde", de: "das Gemälde", syl: "ge-MÄL-de", it: "il dipinto", itSyl: "di-PIN-to", en: "painting", x: 199, y: y1 + 1.4, kunst: abs(199, y1 + 1.4, k),
    tipp: "Ein Bildnis des Fürsten: im Harnisch, mit Hermelinmantel und Perücke." });
}
{
  /* Kommode mit geschwungener Front, Intarsien und Goldbronzen */
  let k = schatten(0, 0.2, 13, 1, 0.25);
  k += `<rect x="-12.6" y="-13.4" width="25.2" height="1.6" rx=".6" fill="${S.lg("kplatte", [[0, "#c9b9a8"], [1, "#8e7a6a"]])}"/>`;
  k += `<path d="M-12 -11.8 L12 -11.8 Q12.8 -7 11 -2.6 L-11 -2.6 Q-12.8 -7 -12 -11.8 Z" fill="${S.lg("furnier", [[0, "#6e3c1c"], [0.5, "#a0602e"], [1, "#5a2e14"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-11.4 -7.4 L11.4 -7.4" stroke="#3a1e0c" stroke-width=".4"/>`;
  for (const y of [-9.6, -5]) k += `<path d="M-4 ${y} q4 -1.2 8 0" stroke="${GOLD}" stroke-width=".55" fill="none"/><circle cx="-5.6" cy="${y}" r=".5" fill="${GOLD}"/><circle cx="5.6" cy="${y}" r=".5" fill="${GOLD}"/>`;
  k += `<path d="M-11 -2.6 Q-11.6 -1 -10 0 M11 -2.6 Q11.6 -1 10 0" stroke="${GOLD}" stroke-width="1" fill="none"/><path d="M-3 -2.6 Q0 -.8 3 -2.6" fill="${GOLD}"/>`;
  k += `<path d="M-11.6 -11.4 Q-12.6 -7 -11 -3 M11.6 -11.4 Q12.6 -7 11 -3" stroke="${GOLD}" stroke-width=".7" fill="none"/>`;
  S.teil({ id: "kommode", de: "die Kommode", syl: "kom-MO-de", it: "il cassettone", itSyl: "cas-set-TO-ne", en: "chest of drawers", x: 199, y: WU, steht: true, kunst: k });
}
{
  /* Pendule (Kaminuhr) mit vergoldetem Gehäuse */
  let k = schatten(0, 0.1, 3.4, 0.5, 0.3);
  k += `<path d="M-3 0 L3 0 L2.6 -1 Q3.4 -5 2 -7.6 Q0 -9.6 -2 -7.6 Q-3.4 -5 -2.6 -1 Z" fill="${GOLD_V}"/>`;
  k += `<circle cx="0" cy="-4.6" r="1.8" fill="#fbf8ef" stroke="#8a6420" stroke-width=".3"/><path d="M0 -4.6 L0 -5.9 M0 -4.6 L.9 -4.2" stroke="#222" stroke-width=".25"/>`;
  k += `<path d="M-.9 -8.6 Q0 -10.4 .9 -8.6 Z" fill="${GOLD}"/>`;
  S.teil({ oben: true, id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: 199, y: WU - 13.4, steht: true, kunst: k + flaeche(-3.6, -10.6, 7.2, 10.8) });
}

/* =====================================================================
   15 — DER KRONLEUCHTER (Bergkristall, Kerzen, mitten im Saal)
   ===================================================================== */
{
  let k = `<line x1="0" y1="-48.6" x2="0" y2="-34" stroke="${GOLD}" stroke-width=".9" stroke-dasharray="1.4 .5"/>`;
  /* Schaft mit Glasbalustern */
  k += `<path d="M-1.4 -34 Q-3.4 -30 -1.6 -26 Q-4.4 -21 -1.4 -16 Q-3 -11 0 -6 Q3 -11 1.4 -16 Q4.4 -21 1.6 -26 Q3.4 -30 1.4 -34 Z" fill="${S.lg("kristall", [[0, "#ffffff", 0.9], [0.5, "#cfe0ea", 0.7], [1, "#8fa8b8", 0.9]], 0, 0, 1, 0)}" stroke="${GOLD}" stroke-width=".35"/>`;
  /* zwei Kränze mit geschwungenen Armen, Tropfschalen und Kerzen */
  const kranz = (y, w, n, h) => {
    let g = `<ellipse cx="0" cy="${y}" rx="${w}" ry="${r(w * 0.22)}" fill="none" stroke="${GOLD}" stroke-width=".7"/>`;
    for (let i = 0; i < n; i++) {
      const a = (i / (n - 1)) * Math.PI, x = -Math.cos(a) * w, yy = y + Math.sin(a) * w * 0.22;
      g += `<path d="M0 ${y - 1} Q${r(x * 0.6)} ${r(y + 4)} ${r(x)} ${r(yy - 1)}" stroke="${GOLD}" stroke-width=".55" fill="none"/>`;
      g += `<ellipse cx="${r(x)}" cy="${r(yy - 1)}" rx="1.6" ry=".5" fill="${GOLD}"/><rect x="${r(x - 0.5)}" y="${r(yy - 1 - h)}" width="1" height="${h}" fill="#fbf8ef"/>`;
      g += `<ellipse cx="${r(x)}" cy="${r(yy - 2.2 - h)}" rx=".55" ry="1.1" fill="#ffd56a"/><ellipse cx="${r(x)}" cy="${r(yy - 2.2 - h)}" rx="2.2" ry="2.2" fill="#fff2b0" opacity=".25"/>`;
      g += `<path d="M${r(x)} ${r(yy - 0.6)} l0 2.4" stroke="#e8f2f8" stroke-width=".5"/><circle cx="${r(x)}" cy="${r(yy + 2.2)}" r=".55" fill="#f2f8fc"/>`;
    }
    /* Kristallketten (Behang) zwischen den Armen */
    for (let i = 0; i < n * 2; i++) { const t = i / (n * 2 - 1); g += `<circle cx="${r(-w + t * w * 2)}" cy="${r(y + 1.6 + Math.sin(t * Math.PI) * 1.4)}" r=".35" fill="#f2f8fc"/>`; }
    return g;
  };
  k += kranz(-14, 15, 7, 3) + kranz(-24, 9, 5, 2.6);
  k += `<path d="M-2 -6 L0 -1 L2 -6 Z" fill="#dfeef6"/><circle cx="0" cy="-.6" r=".9" fill="#f2f8fc" stroke="${GOLD}" stroke-width=".2"/>`;
  S.teil({ id: "kronleuchter", de: "der Kronleuchter", syl: "KRON-leuch-ter", it: "il lampadario", itSyl: "lam-pa-DA-rio", en: "chandelier", x: 160, y: 64, kunst: `<g transform="scale(1.3)">${k}</g>`,
    tipp: "Am Abend brannten Hunderte Kerzen; die Kristalle ließen das Licht funkeln." });
}

/* =====================================================================
   16 — DAS CEMBALO (Flügelform, Deckel offen und bemalt)
   ===================================================================== */
const CB = { ox: 60, oy: 169, s: 34 };
const proj = (x, y, z) => [r(CB.ox + (x * 0.86 - z * 0.28) * CB.s), r(CB.oy - y * CB.s + z * 0.3 * CB.s)];
const pp = (pts) => pts.map((p) => proj(...p).join(" ")).join(" L");
{
  const H = 0.95, U = 0.72, L = 2.15;
  /* Grundriss: Rücken (Spine) z = 0, Bentside vorne geschwungen */
  const bent = [[0, 0.9], [0.55, 0.9], [0.95, 0.82], [1.35, 0.6], [1.75, 0.4], [L, 0.26]];
  const umriss = (y) => [[0, y, 0], ...bent.map(([x, z]) => [x, y, z]), [L, y, 0]];
  let k = schatten(...proj(1.0, 0, 0.5), 40, 3, 0.32);
  /* Deckel, um 55° nach hinten geöffnet: innen bemalt (Landschaft) */
  const lid = (x, z) => [x, H + z * Math.sin(45 * Math.PI / 180), -z * Math.cos(45 * Math.PI / 180)];
  const lidPts = [[0.3, 0], ...bent.filter(([x]) => x >= 0.3).map(([x, z]) => [x, z]), [L, 0]].map(([x, z]) => lid(x, x < 0.31 ? 0.9 : z));
  k += `<path d="M${pp(lidPts)} Z" fill="#1f3a2c"/>`;
  const lidIn = lidPts.map(([x, y, z]) => [x + 0.04, y - 0.03, z]);
  k += `<path d="M${pp(lidIn)} Z" fill="${S.lg("lidbild", [[0, "#6f9cc0"], [0.45, "#d8d2b4"], [0.55, "#6f8e56"], [1, "#3e5e30"]])}"/>`;
  /* gemalte Landschaft: Hügel, Bäume, Tempelchen */
  const [la, lb] = [proj(...lid(0.5, 0.45)), proj(...lid(1.3, 0.3))];
  k += `<path d="M${la[0]} ${la[1]} Q${r((la[0] + lb[0]) / 2)} ${r(la[1] - 6)} ${lb[0]} ${lb[1]}" stroke="#4e6e3c" stroke-width="1.6" fill="none" opacity=".7"/>`;
  for (const t of [0.2, 0.45, 0.7]) { const p = proj(...lid(0.4 + t * 1.2, 0.5 - t * 0.2)); k += `<ellipse cx="${p[0]}" cy="${r(p[1] - 1.6)}" rx="1.4" ry="2" fill="#3f5e30"/>`; }
  k += `<path d="M${pp(lidPts)} Z" fill="none" stroke="#1f3a2c" stroke-width="1.8"/><path d="M${pp(lidIn)} Z" fill="none" stroke="${GOLD}" stroke-width=".6"/>`;
  /* Deckelstütze */
  k += `<path d="M${proj(1.05, H, 0.05).join(" ")} L${proj(...lid(1.05, 0.62)).join(" ")}" stroke="#2a1a10" stroke-width=".7"/>`;
  /* Beine (gedrechselt, vergoldet) und Zarge */
  for (const [x, z] of [[0.08, 0.1], [1.05, 0.08], [2.0, 0.08], [0.08, 0.84], [1.05, 0.72], [1.95, 0.28]]) {
    const [a, b] = [proj(x, U, z), proj(x, 0, z)];
    k += `<path d="M${a[0] - 1.2} ${a[1]} L${a[0] + 1.2} ${a[1]} Q${a[0] + 2} ${r((a[1] + b[1]) / 2)} ${b[0] + 0.7} ${b[1]} L${b[0] - 0.7} ${b[1]} Q${a[0] - 2} ${r((a[1] + b[1]) / 2)} ${a[0] - 1.2} ${a[1]} Z" fill="${z < 0.5 ? "#7a5a20" : GOLD_V}"/>`;
    k += `<ellipse cx="${r((a[0] + b[0]) / 2)}" cy="${r((a[1] + b[1]) / 2)}" rx="1.6" ry=".6" fill="${GOLD}"/>`;
  }
  const [s1, s2] = [proj(0.08, 0.2, 0.84), proj(1.05, 0.2, 0.72)];
  k += `<line x1="${s1[0]}" y1="${s1[1]}" x2="${s2[0]}" y2="${s2[1]}" stroke="${GOLD}" stroke-width=".8"/>`;
  /* Gehäuse: Bentside-Wand (grün gefasst mit Goldleisten) */
  const oben = umriss(H).slice(1, -1), unten = umriss(U).slice(1, -1).reverse();
  k += `<path d="M${pp([[0, H, 0.9], ...oben.slice(1), [L, H, 0], [L, U, 0], ...unten.slice(0, -1), [0, U, 0.9]])} Z" fill="${S.lg("zarge", [[0, "#2e5a44"], [0.5, "#3f7458"], [1, "#24483a"]])}"/>`;
  k += `<path d="M${pp(umriss(U + 0.04).slice(1, -1))}" stroke="${GOLD}" stroke-width=".7" fill="none"/>`;
  k += `<path d="M${pp(umriss(H - 0.03).slice(1, -1))}" stroke="${GOLD}" stroke-width=".7" fill="none"/>`;
  /* Stirnseite links (Tastenseite) */
  k += `<path d="M${pp([[0, H, 0], [0, H, 0.9], [0, U, 0.9], [0, U, 0]])} Z" fill="#24483a"/>`;
  /* Oberseite innen: Resonanzboden mit Rose und Blumenmalerei */
  k += `<path d="M${pp([[0.28, H, 0.05], ...bent.filter(([x]) => x > 0.3).map(([x, z]) => [x, H, z - 0.05]), [L - 0.05, H, 0.05]])} Z" fill="${S.lg("resonanz", [[0, "#e9d2a0"], [1, "#d2b47a"]])}"/>`;
  const rose = proj(1.0, H, 0.42);
  k += `<ellipse cx="${rose[0]}" cy="${rose[1]}" rx="2.2" ry=".8" fill="none" stroke="${GOLD}" stroke-width=".5"/><ellipse cx="${rose[0]}" cy="${rose[1]}" rx="1" ry=".35" fill="#7a5a30"/>`;
  for (const [x, z, f] of [[0.7, 0.6, "#c84a5a"], [1.4, 0.3, "#3f6aa8"], [1.75, 0.2, "#e8b84a"], [0.55, 0.25, "#c84a5a"]]) { const p = proj(x, H, z); k += `<circle cx="${p[0]}" cy="${p[1]}" r=".7" fill="${f}"/><path d="M${p[0] - 1.4} ${p[1] + 0.3} q1.4 -.8 2.8 0" stroke="#5e8044" stroke-width=".35" fill="none"/>`; }
  /* Saiten (fein) */
  for (let i = 0; i < 6; i++) { const z = 0.12 + i * 0.1, a = proj(0.32, H + 0.005, z), b = proj(Math.min(L - 0.1, 0.9 + (0.9 - z) * 1.6), H + 0.005, z * 0.5); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#8a7a5a" stroke-width=".18"/>`; }
  /* Klaviaturen: zwei Manuale, schwarze Untertasten, weiße Obertasten */
  for (const [y, z0] of [[0.8, 0.86], [0.86, 0.8]]) {
    const ecken = [[0.02, y, 0.06], [0.02, y, z0], [0.26, y, z0], [0.26, y, 0.06]];
    k += `<path d="M${pp(ecken)} Z" fill="#1d1a18"/>`;
    for (let i = 0; i < 12; i++) { const z = 0.1 + i * (z0 - 0.14) / 11, a = proj(0.04, y + 0.01, z), b = proj(0.2, y + 0.01, z); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${i % 3 === 1 ? "#f4efe4" : "#5a5450"}" stroke-width="${i % 3 === 1 ? 0.5 : 0.2}"/>`; }
  }
  /* Notenablage über den Tasten */
  k += `<path d="M${pp([[0.24, H + 0.02, 0.2], [0.24, H + 0.28, 0.12], [0.24, H + 0.28, 0.72], [0.24, H + 0.02, 0.8]])} Z" fill="#f4ecd8" stroke="#2e5a44" stroke-width=".4"/>`;
  for (let i = 0; i < 4; i++) { const a = proj(0.24, H + 0.08 + i * 0.05, 0.22), b = proj(0.24, H + 0.08 + i * 0.05, 0.7); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#7a6a50" stroke-width=".2"/>`; }
  const fuss = proj(1.0, 0, 0.9);
  S.teil({ id: "cembalo", de: "das Cembalo", syl: "CEM-ba-lo", it: "il clavicembalo", itSyl: "cla-vi-CEM-ba-lo", en: "harpsichord", x: fuss[0], y: fuss[1], steht: true, kunst: abs(fuss[0], fuss[1], k),
    tipp: "Beim Cembalo werden die Saiten gezupft, nicht angeschlagen wie beim Klavier." });
}

/* =====================================================================
   17 — DER HOCKER, 18 — DER MUSIKER, 19 — DIE PERÜCKE
   ===================================================================== */
const MU = { x: 40, y: 174, H: 60 };
{
  /* gepolsterter Hocker mit geschwungenen Goldbeinen */
  const sh = 13.8;
  let k = schatten(0, 0.3, 9, 1.2, 0.3);
  k += `<path d="M-7 ${-sh + 1.6} Q-8 ${-sh / 2} -6.4 0 M7 ${-sh + 1.6} Q8 ${-sh / 2} 6.4 0 M-2.6 ${-sh + 2} Q-3.2 ${-sh / 2} -2.2 -1 M2.6 ${-sh + 2} Q3.2 ${-sh / 2} 2.2 -1" stroke="${GOLD}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M-8.4 ${-sh + 2} L8.4 ${-sh + 2} L8 ${-sh + 0.2} Q0 ${-sh - 1.4} -8 ${-sh + 0.2} Z" fill="${DAMAST}"/><rect x="-8.4" y="${-sh + 1.6}" width="16.8" height="1" fill="${GOLD}"/>`;
  S.teil({ id: "hocker", de: "der Hocker", syl: "HO-cker", it: "lo sgabello", itSyl: "sga-BEL-lo", en: "stool", x: MU.x, y: MU.y, steht: true, kunst: k });
}
let PERUECKE = null;
{
  const m = B.mensch({ id: "b23b_musiker", geschlecht: "m", pose: "lesen", blick: 70, frisur: "kurz", haarfarbe: "weiss", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "mantel", farbe: "#2c4a86" }, unterteil: { stueck: "hose", farbe: "#efe9dc" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, MU.H);
  const k = m.k, kopf = { x: m.z.kopf.x * k, y: m.z.kopf.y * k };
  /* Spitzen-Jabot und goldene Knöpfe am Justaucorps */
  const hals = { x: m.z.punkte.hals[0] * k, y: m.z.punkte.hals[1] * k };
  let extra = `<path d="M${r(hals.x - 0.4)} ${r(hals.y + 1)} q1.2 2 .4 4.4 q-1 -1 -1.6 0 q-.4 -2.4 1.2 -4.4 Z" fill="#fbf8f0" stroke="#d8d2c4" stroke-width=".15"/>`;
  S.teil({ id: "musiker", de: "der Musiker", syl: "MU-si-ker", it: "il musicista", itSyl: "mu-si-CI-sta", en: "musician", x: MU.x, y: MU.y, kunst: m.svg + extra,
    tipp: "Bei Hof spielten Musiker zum Fest, zum Essen und zum Tanz." });
  PERUECKE = { x: MU.x + kopf.x, y: MU.y + kopf.y };
}
{
  /* Allongeperücke: weiße Lockenmassen über Kopf, Rücken und Schultern */
  const W = S.lg("perueckeW", [[0, "#fbf9f4"], [0.6, "#e9e4d8"], [1, "#c9c1b0"]], 0, 0, 1, 0);
  let k = `<path d="M2.8 -3.4 Q1 -5.8 -2 -5.2 Q-5.4 -4.2 -5.6 0 Q-6.4 5 -6 9 Q-5.6 12.4 -3.2 12.8 Q-1.2 12.4 -1 9 Q-1.6 5 -.8 2 Q-1.4 -1 .4 -2.4 Q1.6 -3 2.8 -3.4 Z" fill="${W}"/>`;
  k += `<path d="M1.2 3.4 Q3.6 3.8 3.6 7 Q3.6 10.2 2.1 11.2 Q.6 10.6 .8 7.6 Q.6 5 1.2 3.4 Z" fill="${W}"/>`;
  /* Locken als feine Bögen */
  let lo = "";
  for (let y = -3.6; y < 12; y += 1.5) for (let x = -5.6; x < 3.4; x += 1.5) {
    const inMasse = (x < -1.2 && y > -4.2 + Math.abs(x + 2) * 0.3) || (y < -2 && x < 2.4 && y > -5 + Math.abs(x) * 0.2) || (x > 0.9 && x < 3.4 && y > 4 && y < 10.6);
    if (inMasse) lo += `M${r(x - 0.6)} ${r(y + ((x * 7) % 2 ? 0.3 : 0))} q.6 -.9 1.2 0 `;
  }
  k += `<path d="${lo}" stroke="#b8af9c" stroke-width=".3" fill="none"/>`;
  k += `<path d="M-1.6 -4.6 Q.4 -5.2 2.2 -3.6" stroke="#fff" stroke-width=".5" fill="none" opacity=".9"/>`;
  S.teil({ oben: true, id: "peruecke", de: "die Perücke", syl: "Pe-RÜ-cke", it: "la parrucca", itSyl: "par-RUC-ca", en: "wig", x: PERUECKE.x, y: PERUECKE.y + 12.8, kunst: abs(0, 12.8, k),
    tipp: "Im Barock trugen Männer bei Hof eine lange weiße Allongeperücke." });
}

/* =====================================================================
   20 — DAS NOTENPULT, 21 — DIE NOTEN
   ===================================================================== */
const NP = { x: 172, y: 186 };
{
  let k = schatten(0, 0.3, 9, 1.2, 0.3);
  /* Dreifuß mit Voluten, gedrechselte Säule, schräges Pult */
  k += `<path d="M-8 0 Q-4 -2 -1 -5 M8 0 Q4 -2 1 -5 M0 0.6 L0 -5" stroke="#5e3618" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  k += `<rect x="-1" y="-34" width="2" height="30" fill="${HOLZ}"/>`;
  for (const y of [-8, -20, -30]) k += `<ellipse cx="0" cy="${y}" rx="1.8" ry=".7" fill="${GOLD}"/>`;
  k += `<path d="M-11 -34 L11 -34 L9 -46 L-9 -46 Z" fill="${S.lg("pult", [[0, "#5e3618"], [1, "#8a5428"]])}"/>`;
  k += `<path d="M-6 -42 q6 -4 12 0" stroke="${GOLD}" stroke-width=".5" fill="none"/>`;
  k += `<rect x="-11.6" y="-35" width="23.2" height="1.8" rx=".6" fill="#4a2a12"/>`;
  S.teil({ id: "notenpult", de: "das Notenpult", syl: "NO-ten-pult", it: "il leggio", itSyl: "leg-GIO", en: "music stand", x: NP.x, y: NP.y, steht: true, kunst: k });
}
{
  /* aufgeschlagene Noten auf dem Pult */
  let k = `<path d="M-9 0 L-.4 .6 L-.6 -10.4 L-8 -11 Z" fill="#f7f1e2"/><path d="M9 0 L.4 .6 L.6 -10.4 L8 -11 Z" fill="#efe7d2"/>`;
  for (let i = 0; i < 4; i++) for (const s of [-1, 1]) {
    const y = -8.8 + i * 2.3;
    k += `<path d="M${s * 1.4} ${y + 0.3} L${s * 7.6} ${y - 0.1}" stroke="#7a6a50" stroke-width=".18"/>`;
    for (let j = 0; j < 4; j++) k += `<circle cx="${r(s * (2.4 + j * 1.4))}" cy="${r(y - 0.4 + ((i + j) % 3) * 0.3)}" r=".28" fill="#2a2420"/>`;
  }
  S.teil({ oben: true, id: "noten", de: "die Noten", syl: "NO-ten", it: "lo spartito", itSyl: "spar-TI-to", en: "sheet music", x: NP.x, y: NP.y - 35, steht: true, kunst: k,
    tipp: "Johann Sebastian Bach und Georg Friedrich Händel komponierten im Barock." });
}

/* =====================================================================
   22 — DER SESSEL (vergoldeter Fauteuil), 23 — DIE VIOLINE darauf
   ===================================================================== */
const SE = { x: 250, y: 188 };
{
  let k = schatten(0, 0.4, 16, 1.6, 0.32);
  /* Rückenlehne (Medaillon), Polster, geschwungene Beine */
  k += `<path d="M-10 -20 Q-12 -36 -6 -42 Q0 -45 6 -42 Q12 -36 10 -20 Z" fill="${GOLD_V}"/>`;
  k += `<path d="M-8 -21.6 Q-9.6 -35 -5 -40 Q0 -42.4 5 -40 Q9.6 -35 8 -21.6 Z" fill="${DAMAST}"/>`;
  k += `<path d="M-3 -34 q3 -3 6 0 q-3 4 -6 0 Z M-1 -28 q1 -1.6 2 0" stroke="#d9a0a8" stroke-width=".35" fill="none"/>`;
  k += `<path d="M-2 -43.6 q2 -2.6 4 0" stroke="${GOLD}" stroke-width="1" fill="none"/>`;
  k += `<path d="M-14 -16 Q-15 -22 -11 -22 L11 -22 Q15 -22 14 -16 Q0 -12 -14 -16 Z" fill="${DAMAST}"/><path d="M-14 -16 Q0 -12 14 -16 L13.6 -13.6 Q0 -9.6 -13.6 -13.6 Z" fill="${GOLD}"/>`;
  k += `<path d="M-12 -24 Q-15 -26 -15 -21 M12 -24 Q15 -26 15 -21" stroke="${GOLD}" stroke-width="1.2" fill="none"/>`;
  for (const s of [-1, 1]) k += `<path d="M${s * 12.6} -13 Q${s * 15} -6 ${s * 12} 0 Q${s * 11.4} 1 ${s * 13} 1" stroke="${GOLD}" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M${s * 6} -12 Q${s * 7} -5 ${s * 5.4} -1" stroke="#9a7228" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
  S.teil({ id: "sessel", de: "der Sessel", syl: "SES-sel", it: "la poltrona", itSyl: "pol-TRO-na", en: "armchair", x: SE.x, y: SE.y, steht: true, kunst: k });
}
{
  /* Violine mit Bogen, schräg auf dem Polster */
  let k = `<g transform="rotate(-14)">`;
  k += `<path d="M-11 0 Q-11 -3.4 -8 -3.4 Q-6.6 -3.4 -6 -2.2 Q-5 -2.6 -4.4 -2 Q-3.4 -3.6 -1 -3.6 Q1.6 -3.6 1.6 0 Q1.6 3.6 -1 3.6 Q-3.4 3.6 -4.4 2 Q-5 2.6 -6 2.2 Q-6.6 3.4 -8 3.4 Q-11 3.4 -11 0 Z" fill="${S.lg("geige", [[0, "#d07a2a"], [0.5, "#a24c14"], [1, "#6e2c08"]])}"/>`;
  k += `<rect x="1.4" y="-.6" width="8" height="1.2" rx=".4" fill="#1d1a18"/><path d="M9.2 -1 q2 -.6 2 1 q0 1.6 -2 1" fill="#6e2c08"/>`;
  k += `<path d="M-6.4 -1.4 q.6 .8 0 1.4 M-6.4 1.4 q.6 -.8 0 -1.4" stroke="#2a1408" stroke-width=".3" fill="none"/><rect x="-5.2" y="-.8" width=".5" height="1.6" fill="#f0dfb8"/>`;
  for (const y of [-0.45, -0.15, 0.15, 0.45]) k += `<line x1="-8.6" y1="${y}" x2="9.4" y2="${y}" stroke="#e8e2d2" stroke-width=".08"/>`;
  k += `<path d="M-10.4 -1.6 Q-9 -2.6 -7.4 -2.6" stroke="#fff" stroke-width=".4" opacity=".5" fill="none"/></g>`;
  k += `<path d="M-12 3.4 L13 -3.6" stroke="#5a3418" stroke-width=".5"/><path d="M-11.6 3.6 L12.6 -3.2" stroke="#efe6d0" stroke-width=".25"/>`;
  S.teil({ oben: true, id: "violine", de: "die Violine", syl: "Vio-LI-ne", it: "il violino", itSyl: "vio-LI-no", en: "violin", x: SE.x, y: SE.y - 19, kunst: k + flaeche(-12, -5.4, 25, 9.6),
    tipp: "Die besten Geigen der Barockzeit baute Antonio Stradivari in Cremona." });
}

/* Glanz des Kronleuchters im Raum (fängt keinen Tipp ab) */
S.davor(`<ellipse cx="160" cy="44" rx="40" ry="22" fill="${S.rg("kerzenlicht", [[0, "#fff2c0", 0.22], [1, "#fff2c0", 0]])}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/barock.js"));
console.log(aus);
