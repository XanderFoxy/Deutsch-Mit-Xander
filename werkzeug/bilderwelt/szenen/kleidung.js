#!/usr/bin/env node
/* =====================================================================
   DIE KLEIDUNG (FASSUNG 852) — Bilderwelt neu: ein Bekleidungsgeschäft.
   ---------------------------------------------------------------------
   RECHERCHE (Ladenbau für Modegeschäfte: Wandsysteme mit Schienen, an
   die Kleiderstangen, Tablare und Schuhkonsolen gehängt werden;
   Präsentationstische, Umkleidekabinen mit Vorhang, Kassentresen):
   - An der Wand ein WANDSYSTEM: oben Tablare mit gefalteten Pullovern
     und T-Shirts, darunter schräge Schuhkonsolen; daneben die
     KLEIDERSTANGE mit Ware auf Bügeln, frontal gehängt (Hemd, Jacke,
     Mantel, Kleid, Rock am Klammerbügel).
   - Die UMKLEIDEKABINEN mit Vorhang, innen Spiegel, Hocker und Haken;
     daneben ein großer SPIEGEL an der Wand.
   - In der Mitte ein PRÄSENTATIONSTISCH mit gefalteten Jeans und
     Accessoires (Mützen, Schals, Handschuhe, Gürtel, Sonnenbrillen
     auf einem Brillenständer).
   - Ein Drehständer mit SOCKEN an Haken.
   - Der KASSENTRESEN: Kasse, Kartenterminal, Papiertragetaschen; die
     Bügel werden an der Kasse abgenommen und gesammelt.
   Maßstab: Rückwand ≈ 40 Einheiten je Meter, Kassentresen (y 156)
   ≈ 48 je Meter, vorne (y 194) ≈ 57 je Meter; Verkäuferin 1,68 m.
   Keine Personen in Unterwäsche — die Verkäuferin ist normal gekleidet.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "kleidung", titel: "Die Kleidung", emoji: "👕", thema: "Einkaufen", kuerzel: "b05e", fassung: 852 });
const rnd = zufall(1960);
const r = B.r;
{ const lg = S.lg, rg = S.rg, c = {}; S.lg = (n, ...a) => c[n] || (c[n] = lg(n, ...a)); S.rg = (n, ...a) => c["r" + n] || (c["r" + n] = rg(n, ...a)); }

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const HOLZ = S.lg("holz", [[0, "#d9b98a"], [1, "#bf9a66"]]);
const HOLZ_H = S.lg("holzh", [[0, "#e6cfa6"], [1, "#cfae7c"]]);
const CHROM = S.lg("chrom", [[0, "#f6f8f9"], [0.45, "#c9cfd4"], [0.55, "#9aa3aa"], [1, "#e6eaec"]], 0, 0, 1, 0);
const SCHWARZ = S.lg("schwarz", [[0, "#3a3d42"], [1, "#1f2125"]]);
const VPY = -60, WAND_UNTEN = 118;
const mass = (y) => 40 * (y - VPY) / (WAND_UNTEN - VPY);
const dunkler = (hex, f) => "#" + [1, 3, 5].map((i) => Math.max(0, Math.round(parseInt(hex.slice(i, i + 2), 16) * f)).toString(16).padStart(2, "0")).join("");
const stoff = (n, hex) => S.lg("st_" + n, [[0, dunkler(hex, 0.82)], [0.35, hex], [0.7, hex], [1, dunkler(hex, 0.72)]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Decke mit Spots, weiße Wand, Eichendielen
   ===================================================================== */
{
  let k = `<rect x="0" y="0" width="320" height="14" fill="${S.lg("decke", [[0, "#f2f0ec"], [1, "#e4e0d8"]])}"/>`;
  for (const x of [30, 90, 150, 210, 270]) k += `<circle cx="${x}" cy="7" r="2.4" fill="#d8d4cc"/><circle cx="${x}" cy="7" r="1.6" fill="#fffbe9"/>`;
  k += `<rect x="0" y="14" width="320" height="${WAND_UNTEN - 14}" fill="${S.lg("wand", [[0, "#f7f4ee"], [1, "#ebe5da"]])}"/>`;
  for (const x of [30, 90, 150, 210, 270]) k += `<path d="M${x - 3} 14 L${x - 22} 60 L${x + 22} 60 L${x + 3} 14 Z" fill="${S.lg("spot", [[0, "#fff6dc", 0.5], [1, "#fff6dc", 0]])}"/>`;
  k += `<rect x="0" y="${WAND_UNTEN - 3}" width="320" height="3" fill="#cfc6b6"/>`;
  /* Dielenboden */
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#b98a58"], [1, "#d2a676"]])}"/>`;
  for (let i = -18; i <= 18; i++) k += `<line x1="${160 + i * 10}" y1="${WAND_UNTEN}" x2="${r(160 + i * 10 * 260 / 178)}" y2="200" stroke="#8a6238" stroke-width=".3" opacity=".7"/>`;
  for (let i = 0; i < 44; i++) {
    const s = Math.floor(rnd() * 36) - 18, y = WAND_UNTEN + 3 + rnd() * 78, t = (y + 60) / 178;
    k += `<line x1="${r(160 + s * 10 * t)}" y1="${r(y)}" x2="${r(160 + (s + 1) * 10 * t)}" y2="${r(y)}" stroke="#8a6238" stroke-width=".3" opacity=".6"/>`;
  }
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.16], [0.5, "#000", 0], [1, "#fff", 0.1]])}"/>`;
  /* Ladenname über der Kasse */
  k += `<text x="276" y="40" font-size="9" text-anchor="middle" fill="#2a2a2a" font-family="Georgia,serif" letter-spacing="1.5">MODE WEBER</text><rect x="246" y="43" width="60" height=".5" fill="#b08a4a"/>`;
  S.hinten(k);
}

/* ---------- Kleidung zeichnen ---------------------------------------- */
function buegel(x, y, s = 1) {
  return `<path d="M${r(x)} ${r(y)} q0 ${r(-2 * s)} ${r(1.2 * s)} ${r(-2 * s)} q${r(1 * s)} 0 ${r(1 * s)} ${r(0.9 * s)}" stroke="${CHROM}" stroke-width="${r(0.45 * s)}" fill="none"/><path d="M${r(x - 5 * s)} ${r(y + 2.6 * s)} L${r(x)} ${r(y)} L${r(x + 5 * s)} ${r(y + 2.6 * s)}" stroke="#6e4a2a" stroke-width="${r(0.8 * s)}" fill="none" stroke-linecap="round"/>`;
}
const G = {
  hemd: (x, y, f) => `<path d="M${x - 4.6} ${y + 2} L${x - 7} ${y + 4} L${x - 7.4} ${y + 24} L${x - 5.4} ${y + 24} L${x - 5} ${y + 8} L${x - 4.6} ${y + 26} L${x + 4.6} ${y + 26} L${x + 5} ${y + 8} L${x + 5.4} ${y + 24} L${x + 7.4} ${y + 24} L${x + 7} ${y + 4} L${x + 4.6} ${y + 2} L${x + 1.4} ${y + 1.4} L${x} ${y + 3} L${x - 1.4} ${y + 1.4} Z" fill="${stoff("hemd", f)}"/><path d="M${x - 1.6} ${y + 1.4} L${x} ${y + 4.4} L${x + 1.6} ${y + 1.4} L${x + 0.6} ${y + 1} L${x} ${y + 2.4} L${x - 0.6} ${y + 1} Z" fill="#fff"/><line x1="${x}" y1="${y + 4}" x2="${x}" y2="${y + 26}" stroke="${dunkler(f, 0.8)}" stroke-width=".3"/>` + [8, 12, 16, 20, 24].map((d) => `<circle cx="${x + 0.6}" cy="${y + d}" r=".3" fill="#fff"/>`).join("") + `<rect x="${x - 4}" y="${y + 7}" width="2.6" height="2.4" fill="none" stroke="${dunkler(f, 0.8)}" stroke-width=".25"/>`,
  jacke: (x, y, f) => `<path d="M${x - 5} ${y + 2} L${x - 7.6} ${y + 4} L${x - 8} ${y + 23} L${x - 6} ${y + 23} L${x - 5.6} ${y + 9} L${x - 5.2} ${y + 24} L${x + 5.2} ${y + 24} L${x + 5.6} ${y + 9} L${x + 6} ${y + 23} L${x + 8} ${y + 23} L${x + 7.6} ${y + 4} L${x + 5} ${y + 2} Q${x} ${y + 0.4} ${x - 5} ${y + 2} Z" fill="${stoff("jacke", f)}"/><path d="M${x - 3.6} ${y + 1.4} Q${x} ${y - 1.2} ${x + 3.6} ${y + 1.4} L${x + 2.4} ${y + 3.6} Q${x} ${y + 2.4} ${x - 2.4} ${y + 3.6} Z" fill="${dunkler(f, 0.7)}"/><line x1="${x}" y1="${y + 3}" x2="${x}" y2="${y + 24}" stroke="#c9cfd4" stroke-width=".5"/><rect x="${x - 0.5}" y="${y + 4}" width="1" height="1.8" fill="#d8dde0"/><path d="M${x - 4.4} ${y + 16} l2.6 0 M${x + 1.8} ${y + 16} l2.6 0" stroke="${dunkler(f, 0.6)}" stroke-width=".4"/><rect x="${x - 5.2}" y="${y + 22.4}" width="10.4" height="1.6" fill="${dunkler(f, 0.75)}"/>`,
  mantel: (x, y, f) => `<path d="M${x - 5.2} ${y + 2} L${x - 7.8} ${y + 4} L${x - 8.2} ${y + 26} L${x - 6.2} ${y + 26} L${x - 5.8} ${y + 10} L${x - 6.4} ${y + 42} L${x + 6.4} ${y + 42} L${x + 5.8} ${y + 10} L${x + 6.2} ${y + 26} L${x + 8.2} ${y + 26} L${x + 7.8} ${y + 4} L${x + 5.2} ${y + 2} Z" fill="${stoff("mantel", f)}"/><path d="M${x - 3.4} ${y + 1.4} L${x} ${y + 14} L${x + 3.4} ${y + 1.4} L${x + 2} ${y + 1.2} L${x} ${y + 9} L${x - 2} ${y + 1.2} Z" fill="${dunkler(f, 0.82)}"/><path d="M${x - 3.6} ${y + 1.4} L${x - 4.8} ${y + 5} L${x - 1.6} ${y + 7}" stroke="${dunkler(f, 0.65)}" stroke-width=".35" fill="none"/><path d="M${x + 3.6} ${y + 1.4} L${x + 4.8} ${y + 5} L${x + 1.6} ${y + 7}" stroke="${dunkler(f, 0.65)}" stroke-width=".35" fill="none"/>` + [[-1.6, 17], [1.6, 17], [-1.6, 22], [1.6, 22], [-1.6, 27], [1.6, 27]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r=".55" fill="#3a2a1a"/>`).join("") + `<line x1="${x + 0.4}" y1="${y + 14}" x2="${x + 0.6}" y2="${y + 42}" stroke="${dunkler(f, 0.7)}" stroke-width=".35"/>`,
  kleid: (x, y, f) => `<path d="M${x - 3.6} ${y + 1.6} L${x - 2} ${y + 1.2} Q${x} ${y + 3.6} ${x + 2} ${y + 1.2} L${x + 3.6} ${y + 1.6} L${x + 4.4} ${y + 12} L${x + 3.2} ${y + 14} L${x + 8.6} ${y + 36} Q${x} ${y + 38} ${x - 8.6} ${y + 36} L${x - 3.2} ${y + 14} L${x - 4.4} ${y + 12} Z" fill="${stoff("kleid", f)}"/><path d="M${x - 3.6} ${y + 13.2} Q${x} ${y + 14.4} ${x + 3.6} ${y + 13.2}" stroke="${dunkler(f, 0.6)}" stroke-width=".7" fill="none"/>` + [-5, -2, 1, 4].map((a) => `<path d="M${x + a * 0.5} ${y + 15} L${x + a * 1.4} ${y + 36}" stroke="${dunkler(f, 0.78)}" stroke-width=".3"/>`).join(""),
  rock: (x, y, f) => `<rect x="${x - 5.6}" y="${y + 1}" width="11.2" height="1.6" fill="${CHROM}"/><path d="M${x - 4.6} ${y + 2.6} L${x + 4.6} ${y + 2.6} L${x + 7.6} ${y + 21} Q${x} ${y + 22.4} ${x - 7.6} ${y + 21} Z" fill="${stoff("rock", f)}"/><rect x="${x - 4.6}" y="${y + 2.6}" width="9.2" height="2" fill="${dunkler(f, 0.8)}"/>` + [-6, -3, 0, 3, 6].map((a) => `<path d="M${x + a * 0.7} ${y + 4.6} L${x + a * 1.2} ${y + 21.6}" stroke="${dunkler(f, 0.75)}" stroke-width=".35"/>`).join(""),
};
/* Gefaltete Ware: Stapel von n Teilen, Fuß bei (x,y), Breite w, je Lage h */
function gefaltet(x, y, w, h, n, f, art) {
  let g = "";
  for (let i = 0; i < n; i++) {
    const yy = y - (i + 1) * h, ww = w - (i % 2) * 0.4;
    g += `<rect x="${r(x - ww / 2)}" y="${r(yy)}" width="${r(ww)}" height="${r(h - 0.15)}" rx="${r(h * 0.4)}" fill="${stoff("gef" + f, f)}"/>`;
    g += `<line x1="${r(x - ww / 2 + 0.6)}" y1="${r(yy + h * 0.5)}" x2="${r(x + ww / 2 - 0.6)}" y2="${r(yy + h * 0.5)}" stroke="${dunkler(f, 0.75)}" stroke-width=".2"/>`;
  }
  const top = y - n * h;
  if (art === "pullover") for (let i = -2; i <= 2; i++) g += `<line x1="${r(x + i * w / 6)}" y1="${r(top + 0.2)}" x2="${r(x + i * w / 6)}" y2="${r(top + h - 0.2)}" stroke="${dunkler(f, 0.8)}" stroke-width=".25"/>`;
  if (art === "tshirt") g += `<path d="M${r(x - w * 0.14)} ${r(top + 0.1)} Q${x} ${r(top + h * 0.9)} ${r(x + w * 0.14)} ${r(top + 0.1)}" stroke="${dunkler(f, 0.7)}" stroke-width=".35" fill="none"/>`;
  if (art === "jeans") g += `<line x1="${r(x - w / 2 + 1)}" y1="${r(top + h * 0.35)}" x2="${r(x + w / 2 - 1)}" y2="${r(top + h * 0.35)}" stroke="#c9953f" stroke-width=".25" stroke-dasharray=".6 .4"/><rect x="${r(x + w / 2 - 3)}" y="${r(top + 0.3)}" width="2" height="${r(h * 0.5)}" fill="#7a4a2a"/>`;
  return g;
}

/* =====================================================================
   1 — DIE UMKLEIDEKABINE (links hinten, zwei Kabinen) und DER VORHANG
   ===================================================================== */
const UK = { x0: 4, x1: 78, y0: 34 };
{
  const W = UK.x1 - UK.x0, H = WAND_UNTEN - UK.y0, cw = W / 2;
  let k = "";
  /* rechte Kabine offen: Rückwand, Spiegel, Hocker, Haken mit Bügel */
  const ox = 0;
  k += `<rect x="${ox}" y="${-H + 4}" width="${cw}" height="${H - 4}" fill="${S.lg("kabine", [[0, "#efe7da"], [1, "#ddd2c0"]])}"/>`;
  k += `<rect x="${ox + 8}" y="${-H + 10}" width="${cw - 16}" height="${H - 24}" rx="1" fill="${S.lg("kabspiegel", [[0, "#c9d6da"], [0.5, "#eef4f6"], [1, "#b9c8cd"]], 0, 0, 1, 1)}" stroke="#b08a4a" stroke-width=".8"/>`;
  k += `<path d="M${ox + 12} ${-16} L${ox + 18} ${-H + 12} L${ox + 21} ${-H + 12} L${ox + 15} -16 Z" fill="#fff" opacity=".35"/>`;
  k += `<rect x="${ox + 9}" y="-14" width="${cw - 18}" height="2" rx=".8" fill="${HOLZ}"/><rect x="${ox + 11}" y="-12" width="1.4" height="12" fill="${HOLZ}"/><rect x="${ox + cw - 12.4}" y="-12" width="1.4" height="12" fill="${HOLZ}"/>`;
  k += `<circle cx="${ox + cw - 5}" cy="${-H + 14}" r=".9" fill="${CHROM}"/>`;
  /* Trennwand und Rahmen */
  k += `<rect x="${-cw}" y="${-H}" width="${W}" height="5" fill="${HOLZ}"/>`;
  k += `<rect x="-1.4" y="${-H}" width="2.8" height="${H}" fill="${HOLZ}"/><rect x="${-cw}" y="${-H}" width="2.8" height="${H}" fill="${HOLZ}"/><rect x="${cw - 2.8}" y="${-H}" width="2.8" height="${H}" fill="${HOLZ}"/>`;
  k += `<rect x="${-cw + 1}" y="${-H + 5.6}" width="${W - 2}" height="1" fill="${CHROM}"/>`;
  /* geöffneter Vorhang der rechten Kabine, zur Seite geschoben */
  k += `<path d="M${cw - 9} ${-H + 6} L${cw - 3} ${-H + 6} L${cw - 3} -2 Q${cw - 6} 0 ${cw - 9.4} -2 Z" fill="${S.lg("vorhang", [[0, "#5a6a5a"], [0.25, "#7a8c7a"], [0.5, "#5a6a5a"], [0.75, "#7a8c7a"], [1, "#4e5c4e"]], 0, 0, 1, 0)}"/>`;
  k += `<text x="${cw / 2}" y="${-H + 3.6}" font-size="2.4" text-anchor="middle" fill="#6e4a2a" font-family="Arial">2</text><text x="${-cw / 2}" y="${-H + 3.6}" font-size="2.4" text-anchor="middle" fill="#6e4a2a" font-family="Arial">1</text>`;
  S.teil({ id: "umkleidekabine", de: "die Umkleidekabine", syl: "UM-klei-de-ka-bi-ne", it: "il camerino", itSyl: "ca-me-RI-no", en: "changing room", x: (UK.x0 + UK.x1) / 2, y: WAND_UNTEN, steht: true, kunst: k,
    tipp: "In der Umkleidekabine probiert man die Kleidung an." });
}
{
  /* DER VORHANG der linken Kabine (geschlossen) */
  const W = (UK.x1 - UK.x0) / 2 - 3.6, H = WAND_UNTEN - UK.y0 - 6.6;
  let k = "";
  for (let i = 0; i < 9; i++) k += `<circle cx="${r(-W / 2 + 1 + i * (W - 2) / 8)}" cy="${-H}" r=".6" fill="none" stroke="${CHROM}" stroke-width=".3"/>`;
  k += `<path d="M${r(-W / 2)} ${-H + 0.6} L${r(W / 2)} ${-H + 0.6} L${r(W / 2)} -3.6 Q${r(W / 4)} -2.6 0 -3.6 Q${r(-W / 4)} -2.6 ${r(-W / 2)} -3.6 Z" fill="${S.lg("vorhang", [[0, "#5a6a5a"], [0.25, "#7a8c7a"], [0.5, "#5a6a5a"], [0.75, "#7a8c7a"], [1, "#4e5c4e"]], 0, 0, 1, 0)}"/>`;
  for (let i = 1; i < 6; i++) k += `<line x1="${r(-W / 2 + i * W / 6)}" y1="${-H + 1}" x2="${r(-W / 2 + i * W / 6 + (i % 2 ? 0.6 : -0.4))}" y2="-3.4" stroke="#4a584a" stroke-width=".35" opacity=".6"/>`;
  S.teil({ oben: true, id: "vorhang", de: "der Vorhang", syl: "VOR-hang", it: "la tenda", itSyl: "TEN-da", en: "curtain", x: UK.x0 + (UK.x1 - UK.x0) / 4 + 0.4, y: WAND_UNTEN, kunst: k,
    tipp: "Den Vorhang zieht man zu, wenn man sich umzieht." });
}

/* =====================================================================
   2 — DER SPIEGEL (Wandspiegel, ganze Figur)
   ===================================================================== */
{
  let k = schatten(0, 0, 9, 1, 0.25);
  k += `<rect x="-9" y="-80" width="18" height="78" rx="1.4" fill="${S.lg("spiegelrahmen", [[0, "#c9a25a"], [1, "#8a6a2a"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-7.6" y="-78.6" width="15.2" height="75.2" rx=".8" fill="${S.lg("spiegelglas", [[0, "#b9c8cd"], [0.45, "#eef4f6"], [1, "#a9bcc2"]], 0, 0, 1, 1)}"/>`;
  /* Spiegelbild: Dielen und ein Stück Wand */
  k += `<rect x="-7.6" y="-18" width="15.2" height="14.6" fill="#c9a072" opacity=".55"/>`;
  k += `<path d="M-6 -6 L0 -78 L3 -78 L-3 -6 Z" fill="#fff" opacity=".35"/><path d="M2 -6 L6 -50 L7.4 -50 L3.4 -6 Z" fill="#fff" opacity=".25"/>`;
  S.teil({ id: "spiegel", de: "der Spiegel", syl: "SPIE-gel", it: "lo specchio", itSyl: "SPEC-chio", en: "mirror", x: 91, y: WAND_UNTEN, steht: true, kunst: k,
    tipp: "Im großen Spiegel sieht man sich von Kopf bis Fuß." });
}

/* =====================================================================
   3 — DAS REGAL (Wandsystem: Tablare mit Pullovern und T-Shirts,
       unten Schuhkonsolen) — Lupe
   ===================================================================== */
const RE = { x0: 104, x1: 158 };
{
  const W = RE.x1 - RE.x0, cx = (RE.x0 + RE.x1) / 2, H = 86;
  let k = `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${S.lg("wandpaneel", [[0, "#ece6da"], [1, "#ddd4c4"]])}"/>`;
  for (const x of [-W / 2 + 1.2, W / 2 - 1.2]) k += `<rect x="${x - 0.8}" y="${-H}" width="1.6" height="${H}" fill="#8a8f94"/>`;
  const T = [-62, -40];       // Tablare (Oberkante)
  for (const t of T) k += `<rect x="${-W / 2}" y="${t}" width="${W}" height="2" fill="${HOLZ_H}"/><rect x="${-W / 2}" y="${t + 2}" width="${W}" height=".6" fill="#9a7a4a"/>`;
  /* oben: Pullover in drei Farben */
  ["#b8473a", "#2f5f95", "#d8c7a6"].forEach((f, i) => { k += gefaltet(-W / 2 + 9 + i * 18, T[0], 15, 3.4, 5, f, "pullover"); });
  /* Mitte: T-Shirts */
  ["#eeefec", "#2f3035", "#4f8a46"].forEach((f, i) => { k += gefaltet(-W / 2 + 9 + i * 18, T[1], 15, 2.6, 6, f, "tshirt"); });
  /* unten: drei schräge Schuhkonsolen */
  const SK = [-24, -12];
  for (const sy of SK) k += `<path d="M${-W / 2 + 2} ${sy} L${W / 2 - 2} ${sy} L${W / 2 - 2} ${sy + 1.4} L${-W / 2 + 2} ${sy + 1.4} Z" fill="${CHROM}"/>`;
  const schuh = (x, y, f, art) => {
    if (art === "stiefel") return `<path d="M${x - 2.6} ${y} L${x - 2.6} ${y - 8} L${x + 0.6} ${y - 8} L${x + 0.8} ${y - 2.4} Q${x + 4} ${y - 2} ${x + 4.2} ${y} Z" fill="${f}"/><rect x="${x - 2.6}" y="${y - 0.6}" width="6.8" height=".6" fill="#1a1a1a"/>`;
    return `<path d="M${x - 3.6} ${y} L${x - 3.6} ${y - 2.6} Q${x - 1.6} ${y - 3.4} ${x} ${y - 2.2} Q${x + 2.4} ${y - 2.2} ${x + 3.6} ${y - 0.8} L${x + 3.6} ${y} Z" fill="${f}"/><rect x="${x - 3.6}" y="${y - 0.7}" width="7.2" height=".7" fill="${art === "sneaker" ? "#f4f2ec" : "#2a1a12"}"/>` + (art === "sneaker" ? `<path d="M${x - 1.6} ${y - 2.8} l2.4 .6 M${x - 1.2} ${y - 2.2} l2.4 .6" stroke="#fff" stroke-width=".3"/>` : "");
  };
  [[-18, "#f4f2ec", "sneaker"], [-6, "#2f5f95", "sneaker"], [6, "#4a3326", "halb"], [18, "#1f1f22", "halb"]].forEach(([x, f, a]) => { k += schuh(x - 1.6, SK[0], f, a) + schuh(x + 2, SK[0] + 0.4, f, a); });
  [[-16, "#4a3326", "stiefel"], [-4, "#1f1f22", "stiefel"], [8, "#8a5a3a", "stiefel"], [19, "#b8473a", "sneaker"]].forEach(([x, f, a]) => { k += schuh(x - 1.6, SK[1], f, a) + schuh(x + 2.4, SK[1] + 0.4, f, a); });
  k += `<rect x="${-W / 2}" y="-3" width="${W}" height="3" fill="#cfc6b6"/>`;
  const unter = [
    { id: "pullover", de: "der Pullover", syl: "Pull-O-ver", it: "il maglione", itSyl: "ma-GLIO-ne", en: "sweater", x: cx, y: WAND_UNTEN + T[0] + 1, kunst: flaeche(-W / 2 + 1, -20, W - 2, 20.6), tipp: "Pullover liegen gefaltet im Regal, damit sie nicht ausleiern." },
    { id: "tshirt", de: "das T-Shirt", syl: "T-Shirt", it: "la maglietta", itSyl: "ma-GLIET-ta", en: "T-shirt", x: cx, y: WAND_UNTEN + T[1] + 1, kunst: flaeche(-W / 2 + 1, -19.4, W - 2, 20) },
    { id: "schuhe", de: "die Schuhe", syl: "SCHU-he", it: "le scarpe", itSyl: "SCAR-pe", en: "shoes", x: cx, y: WAND_UNTEN - 10, kunst: flaeche(-W / 2 + 1, -24, W - 2, 23), tipp: "Von jedem Schuh steht ein Paar im Regal — die Größe holt die Verkäuferin aus dem Lager." },
  ];
  S.teil({ id: "regal", de: "das Regal", syl: "re-GAL", it: "lo scaffale", itSyl: "scaf-FA-le", en: "shelf", x: cx, y: WAND_UNTEN, steht: true, kunst: k,
    zoom: { x: RE.x0 - 34, y: 30, w: 124, h: 84 }, unter });
}

/* =====================================================================
   4 — DIE KLEIDERSTANGE (Wandschiene, Ware frontal auf Bügeln) — Lupe
   ===================================================================== */
const KS = { x0: 162, x1: 236, y: 46 };
{
  const W = KS.x1 - KS.x0, cx = (KS.x0 + KS.x1) / 2;
  let k = "";
  /* Wandschienen und Stange */
  for (const x of [-W / 2 + 2, W / 2 - 2]) k += `<rect x="${x - 0.8}" y="-12" width="1.6" height="66" fill="#8a8f94"/><path d="M${x} -2 l0 2" stroke="#666" stroke-width=".8"/>`;
  k += `<rect x="${-W / 2}" y="-1" width="${W}" height="2" rx="1" fill="${CHROM}"/>`;
  const ware = [["hemd", -27, "#9fc0dc"], ["jacke", -13, "#2f5a35"], ["mantel", 1, "#b08a5a"], ["kleid", 15.5, "#b8273a"], ["rock", 29, "#2a2c44"]];
  for (const [art, x, f] of ware) k += buegel(x, -0.4, 1) + G[art](x, 0.6, f);
  /* ein leerer Bügel am Ende der Stange */
  k += buegel(-34.6, -0.4, 0.9);
  const T = {
    hemd: ["das Hemd", "HEMD", "la camicia", "ca-MI-cia", "shirt", "Ein Hemd hat einen Kragen und eine Knopfleiste."],
    jacke: ["die Jacke", "JA-cke", "la giacca", "GIAC-ca", "jacket", "Die Jacke hat einen Reißverschluss und eine Kapuze."],
    mantel: ["der Mantel", "MAN-tel", "il cappotto", "cap-POT-to", "coat", "Der Mantel ist lang und warm — für den Winter."],
    kleid: ["das Kleid", "KLEID", "il vestito", "ve-STI-to", "dress", null],
    rock: ["der Rock", "ROCK", "la gonna", "GON-na", "skirt", "Röcke hängen an einem Bügel mit Klammern."],
  };
  const unter = ware.map(([id, x]) => { const [de, syl, it, itSyl, en, tipp] = T[id], h = id === "mantel" ? 43 : id === "kleid" ? 38 : id === "rock" ? 23 : 27; return { id, de, syl, it, itSyl, en, tipp, x: cx + x, y: KS.y + h, kunst: flaeche(-6.6, -h - 2, 13.2, h + 1) }; });
  unter.push({ id: "kleiderbuegel_stange", de: "der Kleiderbügel", syl: "KLEI-der-bü-gel", it: "la gruccia", itSyl: "GRUC-cia", en: "coat hanger", x: cx - 34.6, y: KS.y + 3, kunst: flaeche(-3.4, -6, 6.8, 7) });
  S.teil({ id: "kleiderstange", de: "die Kleiderstange", syl: "KLEI-der-stan-ge", it: "l'appendiabiti", itSyl: "ap-pen-di-A-bi-ti", en: "clothes rail", x: cx, y: KS.y, kunst: k,
    zoom: { x: KS.x0 - 4, y: KS.y - 6, w: W + 8, h: r((W + 8) / 1.5) }, unter: unter.filter((u) => u.id !== "kleiderbuegel_stange"),
    tipp: "An der Kleiderstange hängt die Kleidung auf Bügeln." });
}

/* =====================================================================
   5 — DIE VERKÄUFERIN hinter dem Kassentresen, 6 — DIE KASSE
   ===================================================================== */
const KT = { x0: 242, x1: 316, y: 158 };
{
  const m = B.mensch({ id: "b05e_verk", geschlecht: "w", pose: "stehen", blick: -18, frisur: "pony", haarfarbe: "schwarz", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "creme" }, jacke: { stueck: "weste", farbe: "schwarz" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 1.68 * mass(146));
  S.teil({ id: "verkaeuferin", de: "die Verkäuferin", syl: "ver-KÄU-fe-rin", it: "la commessa", itSyl: "com-MES-sa", en: "shop assistant", x: 296, y: 146, kunst: m.svg,
    tipp: "Die Verkäuferin fragt: „Kann ich Ihnen helfen? Welche Größe brauchen Sie?“" });
}
{
  const W = KT.x1 - KT.x0, M = mass(KT.y), h = 0.95 * M;
  let k = schatten(0, 0, W / 2 + 2, 1.6, 0.3);
  k += `<path d="M${-W / 2 - 1} ${r(-h)} L${W / 2 + 1} ${r(-h)} L${W / 2 - 1} ${r(-h - 4)} L${-W / 2 + 1} ${r(-h - 4)} Z" fill="${S.lg("tresenplatte", [[0, "#f4f1ea"], [1, "#d9d3c6"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${r(-h)}" width="${W}" height="${r(h)}" fill="${HOLZ}"/>`;
  for (let x = -W / 2 + 2; x < W / 2; x += 2.6) k += `<rect x="${x}" y="${r(-h + 2)}" width=".5" height="${r(h - 5)}" fill="#a07a4a" opacity=".5"/>`;
  k += `<rect x="${-W / 2}" y="-3" width="${W}" height="3" fill="#6e4a2a"/><rect x="${-W / 2}" y="${r(-h)}" width="${W}" height="1.4" fill="#fff" opacity=".4"/>`;
  /* Kasse: Bildschirm, Kartenterminal */
  const yP = -h - 2;
  k += `<rect x="6" y="${r(yP - 3)}" width="2" height="3" fill="#3a3f44"/><path d="M-1 ${r(yP - 17)} L15 ${r(yP - 17)} L15.6 ${r(yP - 3)} L-1.6 ${r(yP - 3)} Z" fill="#1d2125"/>`;
  k += `<rect x=".2" y="${r(yP - 15.8)}" width="13.6" height="11.4" fill="${S.lg("kbild", [[0, "#2c4e6b"], [1, "#1b3247"]])}"/><text x="7" y="${r(yP - 10.4)}" font-size="1.6" text-anchor="middle" fill="#cfe" font-family="Arial">Pullover 49,95</text><text x="7" y="${r(yP - 7)}" font-size="2.2" text-anchor="middle" fill="#9fe39a" font-family="Arial" font-weight="bold">49,95 €</text>`;
  k += `<path d="M20 ${r(yP)} L24 ${r(yP)} L24.4 ${r(yP - 8)} L19.6 ${r(yP - 8)} Z" fill="#2a2e33"/><rect x="20.2" y="${r(yP - 7.4)}" width="3.6" height="2.4" fill="#9cd3e8"/>`;
  S.teil({ id: "kasse", de: "die Kasse", syl: "KAS-se", it: "la cassa", itSyl: "CAS-sa", en: "till", x: (KT.x0 + KT.x1) / 2, y: KT.y, steht: true, kunst: k,
    tipp: "An der Kasse nimmt die Verkäuferin die Bügel ab und packt alles ein." });
}
{
  /* DIE TRAGETASCHE (Papier, Kordelgriffe) auf dem Tresen */
  const M = mass(KT.y), y = -0.95 * M - 2 + KT.y;
  let k = schatten(0, 0.2, 6, 0.6, 0.25);
  k += `<path d="M-5.6 0 L5.6 0 L5.2 -13 L-5.2 -13 Z" fill="${S.lg("tasche", [[0, "#efe7d6"], [1, "#d9ccb2"]], 0, 0, 1, 0)}"/><path d="M-5.2 -13 L-4 -14.4 L4 -14.4 L5.2 -13 Z" fill="#cbbd9e"/>`;
  k += `<path d="M-2.6 -13.6 Q-2.6 -18 0 -18 Q2.6 -18 2.6 -13.6" stroke="#2a2a2a" stroke-width=".5" fill="none"/>`;
  k += `<text x="0" y="-7" font-size="1.9" text-anchor="middle" fill="#2a2a2a" font-family="Georgia" letter-spacing=".3">MODE</text><text x="0" y="-4.6" font-size="1.9" text-anchor="middle" fill="#2a2a2a" font-family="Georgia" letter-spacing=".3">WEBER</text>`;
  S.teil({ oben: true, id: "tragetasche", de: "die Tragetasche", syl: "TRA-ge-ta-sche", it: "la borsa", itSyl: "BOR-sa", en: "shopping bag", x: KT.x0 + 10, y, kunst: k });
}
{
  /* DER KLEIDERBÜGEL — ein Stapel abgenommener Bügel auf dem Tresen */
  const M = mass(KT.y), y = -0.95 * M - 2 + KT.y;
  let k = "";
  for (let i = 0; i < 4; i++) k += `<path d="M-6 ${r(-0.6 - i * 1)} L0 ${r(-3.4 - i * 1)} L6 ${r(-0.6 - i * 1)}" stroke="${i % 2 ? "#6e4a2a" : "#2a2a2a"}" stroke-width=".8" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M0 -6.4 q0 -2 1.2 -2 q1 0 1 .9" stroke="${CHROM}" stroke-width=".45" fill="none"/>`;
  S.teil({ oben: true, id: "kleiderbuegel", de: "der Kleiderbügel", syl: "KLEI-der-bü-gel", it: "la gruccia", itSyl: "GRUC-cia", en: "coat hanger", x: KT.x1 - 9, y, kunst: k + flaeche(-6.4, -9, 12.8, 9.2) });
}

/* =====================================================================
   7 — DER PRÄSENTATIONSTISCH mit Jeans und Accessoires — Lupe
   ===================================================================== */
const TI = { x0: 96, x1: 214, y: 192 };
{
  const W = TI.x1 - TI.x0, cx = (TI.x0 + TI.x1) / 2, M = mass(TI.y), h = 0.75 * M;
  let k = schatten(0, 0, W / 2 + 3, 2, 0.35);
  k += `<path d="M${-W / 2 - 2} ${r(-h)} L${W / 2 + 2} ${r(-h)} L${W / 2 - 2} ${r(-h - 9)} L${-W / 2 + 2} ${r(-h - 9)} Z" fill="${S.lg("tischplatte", [[0, "#e2c99e"], [1, "#caa874"]])}"/>`;
  k += `<rect x="${-W / 2 - 2}" y="${r(-h)}" width="${W + 4}" height="3" fill="${HOLZ}"/>`;
  k += `<rect x="${-W / 2}" y="${r(-h + 3)}" width="${W}" height="${r(h - 3)}" fill="${S.lg("tischfront", [[0, "#3a3d42"], [1, "#25272b"]])}"/>`;
  k += `<rect x="${-W / 2 + 4}" y="${r(-h + 7)}" width="${W - 8}" height="${r(h - 12)}" rx="1" fill="none" stroke="#4a4e54" stroke-width=".6"/>`;
  k += `<text x="0" y="${r(-h / 2 + 3)}" font-size="4" text-anchor="middle" fill="#d8c7a6" font-family="Georgia" letter-spacing="1.2">NEUE KOLLEKTION</text>`;
  const yT = -h - 3;      // Standfläche (Mitte der Platte)
  /* Jeans-Stapel (zwei) */
  k += gefaltet(-46, yT, 16, 2.4, 6, "#3d5f8c", "jeans") + gefaltet(-28, yT, 16, 2.4, 5, "#2a3f60", "jeans");
  /* Mützen mit Bommel */
  for (const [x, f, dy] of [[-12, "#b8473a", 0], [-6, "#d8c7a6", 0], [-9, "#2f5f95", -3.6]]) k += `<path d="M${x - 3} ${yT + dy} Q${x - 3.2} ${yT + dy - 5} ${x} ${yT + dy - 5.2} Q${x + 3.2} ${yT + dy - 5} ${x + 3} ${yT + dy} Z" fill="${stoff("muetze" + f, f)}"/><rect x="${x - 3}" y="${yT + dy - 1.4}" width="6" height="1.4" fill="${dunkler(f, 0.75)}"/><circle cx="${x}" cy="${yT + dy - 5.6}" r="1.3" fill="#f4f1ea"/>`;
  /* Schals, gefaltet, einer hängt über die Kante mit Fransen */
  k += gefaltet(8, yT, 13, 1.8, 4, "#7a3b3b", "schal") + gefaltet(8, yT - 7.2, 12, 1.6, 2, "#c9a25a", "schal");
  k += `<path d="M12 ${r(yT - 0.2)} L16 ${r(yT - 0.2)} L16.4 ${r(yT + 9)} L12.4 ${r(yT + 9)} Z" fill="${stoff("schalb", "#7a3b3b")}"/>` + [0, 1, 2, 3, 4].map((i) => `<line x1="${12.6 + i * 0.85}" y1="${r(yT + 9)}" x2="${12.7 + i * 0.85}" y2="${r(yT + 10.6)}" stroke="#7a3b3b" stroke-width=".3"/>`).join("");
  /* Handschuhe (Leder), ein Paar überkreuz */
  const hand = (x, y, rot, f) => `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-1.6 0 L-1.8 -3.4 L-1.4 -5.6 L-.8 -3.8 L-.6 -6.2 L0 -3.8 L.4 -6 L.8 -3.6 L1.2 -5.2 L1.6 -3.2 L2.6 -4 L2 -1.6 L1.8 0 Z" fill="${f}"/><rect x="-1.8" y="-.6" width="3.6" height="1.2" fill="${dunkler(f, 0.7)}"/></g>`;
  k += hand(24, yT, -10, "#4a3326") + hand(27, yT, 14, "#5a3f2e");
  /* Gürtel, aufgerollt, mit Schnalle */
  for (const [x, f] of [[37, "#3a2a1a"], [43, "#7a4a2a"]]) k += `<circle cx="${x}" cy="${yT - 2.6}" r="2.6" fill="${f}"/><circle cx="${x}" cy="${yT - 2.6}" r="1.7" fill="none" stroke="${dunkler(f, 0.6)}" stroke-width=".3"/><circle cx="${x}" cy="${yT - 2.6}" r=".9" fill="${dunkler(f, 0.8)}"/><rect x="${x + 1.4}" y="${yT - 5.6}" width="1.8" height="2.4" rx=".3" fill="none" stroke="#d8c06a" stroke-width=".45"/>`;
  /* Brillenständer mit Sonnenbrillen */
  k += `<rect x="51.4" y="${yT - 15}" width="1.2" height="15" fill="${CHROM}"/><ellipse cx="52" cy="${yT - 0.4}" rx="3" ry=".7" fill="#2a2a2a"/>`;
  for (let i = 0; i < 3; i++) { const yy = yT - 13.4 + i * 4.4; k += `<rect x="48" y="${yy - 0.4}" width="8" height=".5" fill="#2a2a2a"/><ellipse cx="49.8" cy="${yy + 0.8}" rx="1.7" ry="1.3" fill="${["#1d1d1f", "#5a3a1a", "#1f3a5a"][i]}"/><ellipse cx="54.2" cy="${yy + 0.8}" rx="1.7" ry="1.3" fill="${["#1d1d1f", "#5a3a1a", "#1f3a5a"][i]}"/><path d="M48.6 ${yy + 0.4} l.8 -.4" stroke="#fff" stroke-width=".25" opacity=".7"/>`; }
  const unter = [
    { id: "hose", de: "die Hose", syl: "HO-se", it: "i pantaloni", itSyl: "pan-ta-LO-ni", en: "trousers", x: cx - 37, y: TI.y + yT, kunst: flaeche(-18, -16, 36, 16.4), tipp: "Jeans sind Hosen aus festem blauem Baumwollstoff." },
    { id: "muetze", de: "die Mütze", syl: "MÜT-ze", it: "il cappello", itSyl: "cap-PEL-lo", en: "hat", x: cx - 9, y: TI.y + yT, kunst: flaeche(-6, -10.6, 12, 11) },
    { id: "schal", de: "der Schal", syl: "SCHAL", it: "la sciarpa", itSyl: "SCIAR-pa", en: "scarf", x: cx + 9, y: TI.y + yT, kunst: flaeche(-7.6, -11, 15, 21.6) },
    { id: "handschuhe", de: "die Handschuhe", syl: "HAND-schu-he", it: "i guanti", itSyl: "GUAN-ti", en: "gloves", x: cx + 25.6, y: TI.y + yT, kunst: flaeche(-4.4, -7.4, 8.8, 8) },
    { id: "guertel", de: "der Gürtel", syl: "GÜR-tel", it: "la cintura", itSyl: "cin-TU-ra", en: "belt", x: cx + 40.4, y: TI.y + yT, kunst: flaeche(-5.6, -6.4, 11.4, 6.8) },
    { id: "brille", de: "die Brille", syl: "BRIL-le", it: "gli occhiali", itSyl: "oc-CHIA-li", en: "glasses", x: cx + 52, y: TI.y + yT, kunst: flaeche(-4.8, -15.6, 9.6, 16), tipp: "Am Brillenständer hängen Sonnenbrillen." },
  ];
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: cx, y: TI.y, steht: true, kunst: k,
    zoom: { x: TI.x0 - 2, y: r(TI.y + yT - 30), w: W + 4, h: r((W + 4) / 2) }, unter,
    tipp: "Auf dem Präsentationstisch liegt die neue Ware." });
}

/* =====================================================================
   8 — DIE SOCKEN am Drehständer (vorne links)
   ===================================================================== */
{
  const M = mass(194);
  let k = schatten(0, 0, 12, 1.6, 0.35);
  k += `<ellipse cx="0" cy="-1.2" rx="10" ry="2" fill="#2a2a2a"/><rect x="-1" y="${r(-1.35 * M)}" width="2" height="${r(1.35 * M)}" fill="${CHROM}"/>`;
  k += `<rect x="-9" y="${r(-1.35 * M - 9)}" width="18" height="8" rx=".8" fill="#2a2a2a"/><text x="0" y="${r(-1.35 * M - 4.2)}" font-size="2.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">3 Paar 9,99 €</text>`;
  /* Haken mit Sockenpackungen in drei Reihen */
  for (let j = 0; j < 3; j++) for (let i = -2; i <= 2; i++) {
    const x = i * 6.4, y = -1.35 * M + 4 + j * 17, f = ["#2f3035", "#eeefec", "#b8473a", "#2f5f95", "#86898e"][(i + 2 + j) % 5];
    k += `<line x1="${x}" y1="${r(y)}" x2="${x}" y2="${r(y + 2.4)}" stroke="#9aa3aa" stroke-width=".4"/>`;
    k += `<rect x="${x - 2.6}" y="${r(y + 2)}" width="5.2" height="3" rx=".4" fill="#f4f1ea"/>`;
    /* zwei Socken (Fersen sichtbar) */
    for (const dx of [-1.2, 1.2]) k += `<path d="M${r(x + dx - 0.9)} ${r(y + 5)} L${r(x + dx - 0.9)} ${r(y + 11)} Q${r(x + dx - 0.9)} ${r(y + 13)} ${r(x + dx + 0.9)} ${r(y + 13)} L${r(x + dx + 1.4)} ${r(y + 13)} L${r(x + dx + 1.4)} ${r(y + 11.6)} L${r(x + dx + 0.9)} ${r(y + 11)} L${r(x + dx + 0.9)} ${r(y + 5)} Z" fill="${stoff("socke" + f, f)}"/>`;
    k += `<rect x="${x - 2.1}" y="${r(y + 5)}" width="4.2" height=".8" fill="${dunkler(f, 0.7)}"/>`;
  }
  S.teil({ id: "socken", de: "die Socken", syl: "SO-cken", it: "i calzini", itSyl: "cal-ZI-ni", en: "socks", x: 34, y: 194, steht: true, kunst: k,
    tipp: "Socken gibt es oft im Dreierpack." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/kleidung.js"));
console.log(aus);
