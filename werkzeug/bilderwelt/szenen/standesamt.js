#!/usr/bin/env node
/* =====================================================================
   DAS STANDESAMT (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Infoblätter für Brautpaare der Standesämter Freising,
   Dortmund, Rüsselsheim; Stadt Dassel „Trauzimmer“) — so sieht eine
   standesamtliche Trauung aus:
   - Das TRAUZIMMER ist klein (meist bis 20 Gäste), oft ein festlicher
     Raum im Rathaus: Holzvertäfelung, hohe Fenster mit Vorhängen,
     Kronleuchter, das Wappen der Stadt an der Stirnwand.
   - Vorne der TRAUTISCH mit weißer Decke und Blumenschmuck; dahinter
     steht die STANDESBEAMTIN. Das Brautpaar steht zum Ja-Wort vor dem
     Tisch auf, die Gäste sitzen in Stuhlreihen mit Mittelgang.
   - Ablauf: Ansprache, Frage nach dem freien Willen, Ja-Wort,
     RINGTAUSCH, dann wird die Niederschrift (EHEURKUNDE) vorgelesen und
     vom Paar und den TRAUZEUGEN (null bis zwei) unterschrieben — mit
     dem Füller. Das STAMMBUCH (Familienbuch) für die Urkunden kann man
     im Standesamt kaufen.
   Maßstab: Rückwand ≈ 32 Einheiten je Meter (Raumhöhe 3,1 m); Kamera
   2,06 m hoch (über die Köpfe der Gäste), Horizont y = 52 — darum gilt
   überall Einheiten je Meter = (y − 52) / 2,06. Braut 1,68 m, Bräutigam
   1,82 m. Blick: genau mittig, Fluchtpunkt (160 | 52), ruhig und symmetrisch —
   anders als die Ämter mit Schaltern. Farben: Eichenholz, Creme, Rot.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "standesamt", titel: "Das Standesamt", emoji: "💍", thema: "Behörden", kuerzel: "b08c", fassung: 852 });
const rnd = zufall(2512);
const r = B.r;
const VP = { x: 160, y: 52 };
const SK = (y) => (y - VP.y) / 2.06;         // Einheiten je Meter in der Tiefe y

function figur(spec, hoehe) {
  const m = B.mensch(spec, hoehe);
  const schritt = m.k < 0.42 ? 1 : 2;
  m.svg = m.svg.replace(/ data-teil="[^"]*"/g, "").replace(/ d="([^"]*)"/g, (q, d) => ` d="${d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n * schritt) / schritt))}"`);
  return m;
}
const T = (x, y, s, txt, f = "#222", extra = "") => `<text x="${r(x)}" y="${r(y)}" font-size="${s}" fill="${f}" font-family="Georgia,'Times New Roman',serif" text-anchor="middle"${extra}>${txt}</text>`;

/* ---------- Farben ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const EICHE = S.lg("eiche", [[0, "#9a6a3c"], [0.5, "#86592f"], [1, "#6e4824"]]);
const EICHE_V = S.lg("eichev", [[0, "#7a4f28"], [0.5, "#946436"], [1, "#74491f"]], 0, 0, 1, 0);
const CREME = S.lg("creme", [[0, "#f6eedd"], [1, "#eadcc1"]]);
const SAMT = S.lg("samt", [[0, "#a3263a"], [1, "#6d1424"]]);
const GOLD = S.lg("gold", [[0, "#f3dc8a"], [0.5, "#c9a03f"], [1, "#8f6a1f"]]);
const LEINEN = S.lg("leinen", [[0, "#ffffff"], [0.7, "#f3f1ec"], [1, "#dcd8cf"]]);

/* =====================================================================
   KULISSE — Stuckdecke, Seitenwände, Stirnwand mit Vertäfelung, Parkett
   ===================================================================== */
const WU = 118, WO = 18, XL = 44, XR = 276;
const auf = (x0, y0, y) => VP.x + (x0 - VP.x) * (y - VP.y) / (y0 - VP.y);   // Fluchtlinie durch (x0|y0) bei Höhe y
{
  let k = `<rect x="0" y="0" width="320" height="${WO}" fill="${S.lg("decke", [[0, "#efe6d4"], [1, "#e6dbc4"]])}"/>`;
  /* Stuckleiste rundum */
  k += `<rect x="${XL}" y="${WO - 3}" width="${XR - XL}" height="3" fill="#f7f0e0"/><rect x="${XL}" y="${WO - 0.8}" width="${XR - XL}" height=".8" fill="#d6c7a6"/>`;
  k += `<path d="M0 0 L${XL} ${WO - 3} L${XL} ${WO} L0 ${r(WO + (0 - XL) * (WO - VP.y) / (XL - VP.x))} Z" fill="#f2ead7"/>`;
  k += `<path d="M320 0 L${XR} ${WO - 3} L${XR} ${WO} L320 ${r(WO + (320 - XR) * (WO - VP.y) / (XR - VP.x))} Z" fill="#f2ead7"/>`;
  /* Rosette für den Kronleuchter */
  k += `<ellipse cx="160" cy="7" rx="14" ry="3.2" fill="#f7f0e0" stroke="#d9cba9" stroke-width=".4"/><ellipse cx="160" cy="7" rx="8" ry="1.8" fill="none" stroke="#d9cba9" stroke-width=".4"/>`;
  /* Stirnwand: Creme mit feinem Damastmuster, unten Eichenvertäfelung */
  k += `<rect x="${XL}" y="${WO}" width="${XR - XL}" height="${WU - WO}" fill="${CREME}"/>`;
  S.def(`<pattern id="b08c_damast" width="10" height="12" patternUnits="userSpaceOnUse"><path d="M5 1 Q8 4 5 6 Q2 4 5 1 Z M5 6 Q8 8 5 11 Q2 8 5 6 Z" fill="#e3d3b2" opacity=".55"/><circle cx="0" cy="6" r=".7" fill="#e3d3b2" opacity=".5"/><circle cx="10" cy="6" r=".7" fill="#e3d3b2" opacity=".5"/></pattern>`);
  k += `<rect x="${XL}" y="${WO}" width="${XR - XL}" height="${WU - WO - 32}" fill="url(#b08c_damast)"/>`;
  k += `<rect x="${XL}" y="${WO}" width="${XR - XL}" height="${WU - WO}" fill="${S.rg("licht", [[0, "#fff8e8", 0.5], [1, "#fff8e8", 0]], 0.5, 0.3, 0.6)}"/>`;
  const V0 = WU - 32;
  k += `<rect x="${XL}" y="${V0}" width="${XR - XL}" height="32" fill="${EICHE}"/><rect x="${XL}" y="${V0}" width="${XR - XL}" height="2" fill="#b98a55"/>`;
  for (let x = XL + 4; x < XR - 10; x += 24) k += `<rect x="${x}" y="${V0 + 5}" width="20" height="22" rx=".6" fill="none" stroke="#5e3c1c" stroke-width=".6"/><rect x="${x + 0.6}" y="${V0 + 5.6}" width="18.8" height="20.8" fill="none" stroke="#b98a55" stroke-width=".3" opacity=".6"/>`;
  k += `<rect x="${XL}" y="${WU - 3}" width="${XR - XL}" height="3" fill="#4e3218"/>`;
  /* Seitenwände */
  const wand = (xe, sx) => {
    const yo0 = WO + (sx < 0 ? -XL : 320 - XR) * 0 , yoE = r(WO + (xe - (sx < 0 ? XL : XR)) * (WO - VP.y) / ((sx < 0 ? XL : XR) - VP.x));
    const yuE = r(WU + (xe - (sx < 0 ? XL : XR)) * (WU - VP.y) / ((sx < 0 ? XL : XR) - VP.x));
    const xw = sx < 0 ? XL : XR;
    return `<path d="M${xe} ${yoE} L${xw} ${WO} L${xw} ${WU} L${xe} ${yuE} Z" fill="${S.lg("seite" + (sx < 0 ? "l" : "r"), [[0, sx < 0 ? "#e9dcc1" : "#f1e6cf"], [1, sx < 0 ? "#f1e6cf" : "#e3d4b6"]], 0, 0, 1, 0)}"/>`;
  };
  k += wand(0, -1) + wand(320, 1);
  /* Vertäfelung auch an den Seitenwänden */
  for (const [xe, xw] of [[0, XL], [320, XR]]) {
    const a = (x, y) => r(y + (x - xw) * (y - VP.y) / (xw - VP.x));
    k += `<path d="M${xe} ${a(xe, V0)} L${xw} ${V0} L${xw} ${WU} L${xe} ${a(xe, WU)} Z" fill="${EICHE}"/>`;
    k += `<path d="M${xe} ${a(xe, V0)} L${xw} ${V0}" stroke="#b98a55" stroke-width="1.4"/><path d="M${xe} ${a(xe, WU)} L${xw} ${WU}" stroke="#4e3218" stroke-width="2"/>`;
  }
  /* Parkett: Dielen zum Fluchtpunkt, Querstöße versetzt */
  const yuL = r(WU + (0 - XL) * (WU - VP.y) / (XL - VP.x)), yuR = r(WU + (320 - XR) * (WU - VP.y) / (XR - VP.x));
  k += `<path d="M0 ${yuL} L${XL} ${WU} L${XR} ${WU} L320 ${yuR} L320 200 L0 200 Z" fill="${S.lg("parkett", [[0, "#9b6638"], [1, "#b47d48"]])}"/>`;
  for (let i = -24; i <= 24; i++) {
    const xb = VP.x + i * 5.2;
    if (xb < XL - 0.1 || xb > XR + 0.1) continue;
    k += `<line x1="${r(xb)}" y1="${WU}" x2="${r(auf(xb, WU, 200))}" y2="200" stroke="#6e4422" stroke-width=".3" opacity=".7"/>`;
  }
  let stoss = "";
  for (let j = 0; j < 9; j++) {
    const y = WU + 4 + j * j * 1.05 + j * 2.2;
    for (let i = -24; i <= 24; i += 2) { const xb = VP.x + (i + (j % 2)) * 5.2; if (xb < XL || xb > XR - 5) continue; stoss += `<line x1="${r(auf(xb, WU, y))}" y1="${r(y)}" x2="${r(auf(xb + 5.2, WU, y))}" y2="${r(y)}" stroke="#6e4422" stroke-width=".3" opacity=".6"/>`; }
  }
  k += stoss;
  k += `<path d="M0 ${yuL} L${XL} ${WU} L${XR} ${WU} L320 ${yuR} L320 200 L0 200 Z" fill="${S.lg("parkettlicht", [[0, "#000", 0.16], [0.5, "#fff", 0.05], [1, "#000", 0.05]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DAS FENSTER (linke Seitenwand) und DER VORHANG
   ===================================================================== */
const seitenPunkt = (xw, x, h) => {
  /* Punkt auf der Seitenwand: x im Bild, h = Höhe in m über dem Boden */
  const yb = WU + (x - xw) * (WU - VP.y) / (xw - VP.x);
  return [x, yb - h * SK(yb)];
};
{
  const xa = 8, xb = 34;
  const P = (x, h) => seitenPunkt(XL, x, h).map(r).join(" ");
  let k = `<path d="M${P(xa - 1.6, 2.75)} L${P(xb + 1, 2.75)} L${P(xb + 1, 0.85)} L${P(xa - 1.6, 0.85)} Z" fill="#f8f2e4"/>`;
  k += `<path d="M${P(xa, 2.65)} L${P(xb, 2.65)} L${P(xb, 0.95)} L${P(xa, 0.95)} Z" fill="${S.lg("himmel", [[0, "#cfe6f5"], [0.65, "#eef6f8"], [1, "#cfe0b8"]])}"/>`;
  /* Baumkronen draußen */
  k += `<path d="M${P(xa, 1.25)} Q${P((xa + xb) / 2, 1.6)} ${P(xb, 1.3)} L${P(xb, 0.95)} L${P(xa, 0.95)} Z" fill="#8fb779" opacity=".8"/>`;
  /* Sprossen und Rahmen */
  k += `<path d="M${P((xa + xb) / 2, 2.65)} L${P((xa + xb) / 2, 0.95)} M${P(xa, 1.9)} L${P(xb, 1.9)}" stroke="#f8f2e4" stroke-width="1.1"/>`;
  k += `<path d="M${P(xa, 2.65)} L${P(xb, 2.65)} L${P(xb, 0.95)} L${P(xa, 0.95)} Z" fill="none" stroke="#ddd0b4" stroke-width=".6"/>`;
  k += `<path d="M${P(xa + 2, 2.6)} L${P(xa + 7, 2.6)} L${P(xa + 2, 1.5)} Z" fill="#fff" opacity=".35"/>`;
  /* Fensterbank */
  k += `<path d="M${P(xa - 2.4, 0.95)} L${P(xb + 2, 0.95)} L${P(xb + 2.6, 0.9)} L${P(xa - 3.2, 0.9)} Z" fill="#f2ead8" stroke="#cdbf9f" stroke-width=".3"/>`;
  const fb = seitenPunkt(XL, (xa + xb) / 2, 0);
  S.teil({ id: "sa_fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: fb[0], y: fb[1], kunst: `<g transform="translate(${r(-fb[0])} ${r(-fb[1])})">${k}</g>` });
  /* Vorhänge: schwere Samtschals links und rechts, mit Raffhalter */
  let v = "";
  for (const [x0, x1] of [[xa - 6, xa + 2], [xb - 2, xb + 5]]) {
    const o0 = seitenPunkt(XL, x0, 2.95), o1 = seitenPunkt(XL, x1, 2.95), u0 = seitenPunkt(XL, x0, 0.25), u1 = seitenPunkt(XL, x1, 0.25), m0 = seitenPunkt(XL, (x0 + x1) / 2 + 1, 1.25);
    v += `<path d="M${r(o0[0])} ${r(o0[1])} L${r(o1[0])} ${r(o1[1])} Q${r(m0[0] + 1.6)} ${r(m0[1])} ${r(u1[0])} ${r(u1[1])} L${r(u0[0])} ${r(u0[1])} Q${r(m0[0] - 2)} ${r(m0[1])} ${r(o0[0])} ${r(o0[1])} Z" fill="${SAMT}"/>`;
    for (const t of [0.3, 0.6]) { const a = seitenPunkt(XL, x0 + (x1 - x0) * t, 2.9), b = seitenPunkt(XL, x0 + (x1 - x0) * t, 0.3); v += `<path d="M${r(a[0])} ${r(a[1])} Q${r(m0[0] + (t - 0.45) * 3)} ${r(m0[1])} ${r(b[0])} ${r(b[1])}" stroke="#4d0d18" stroke-width=".8" fill="none" opacity=".6"/>`; }
    v += `<ellipse cx="${r(m0[0])}" cy="${r(m0[1])}" rx="2.4" ry="1" fill="${GOLD}"/>`;
  }
  const s0 = seitenPunkt(XL, xa - 7, 2.97), s1 = seitenPunkt(XL, xb + 6, 2.97);
  v += `<path d="M${r(s0[0])} ${r(s0[1])} L${r(s1[0])} ${r(s1[1])}" stroke="${GOLD}" stroke-width="1"/>`;
  S.teil({ id: "sa_vorhang", de: "der Vorhang", syl: "VOR-hang", it: "la tenda", itSyl: "TEN-da", en: "curtain", x: fb[0], y: fb[1], kunst: `<g transform="translate(${r(-fb[0])} ${r(-fb[1])})">${v}</g>` });
}

/* =====================================================================
   2 — DIE TÜR (Flügeltür in der rechten Seitenwand)
   ===================================================================== */
{
  const P = (x, h) => seitenPunkt(XR, x, h).map(r).join(" ");
  const xa = 284, xb = 312;
  let k = `<path d="M${P(xa - 1.8, 2.45)} L${P(xb + 2, 2.45)} L${P(xb + 2, 0)} L${P(xa - 1.8, 0)} Z" fill="#5e3c1c"/>`;
  k += `<path d="M${P(xa, 2.35)} L${P(xb, 2.35)} L${P(xb, 0)} L${P(xa, 0)} Z" fill="${EICHE_V}"/>`;
  const xm = (xa + xb) / 2;
  k += `<path d="M${P(xm, 2.35)} L${P(xm, 0)}" stroke="#4e3218" stroke-width=".8"/>`;
  for (const [a, b] of [[xa + 2, xm - 2], [xm + 2, xb - 2]]) for (const [h0, h1] of [[2.2, 1.25], [1.1, 0.2]]) k += `<path d="M${P(a, h0)} L${P(b, h0)} L${P(b, h1)} L${P(a, h1)} Z" fill="none" stroke="#5e3c1c" stroke-width=".7"/>`;
  for (const x of [xm - 1.6, xm + 1.6]) { const p = seitenPunkt(XR, x, 1.05); k += `<rect x="${r(p[0] - 0.4)}" y="${r(p[1] - 1.6)}" width=".8" height="3.2" rx=".4" fill="${GOLD}"/>`; }
  /* Türschild „Trauzimmer“ */
  const sp = seitenPunkt(XR, xm, 2.62);
  k += `<rect x="${r(sp[0] - 9)}" y="${r(sp[1] - 3.4)}" width="18" height="5.4" rx=".6" fill="#fbf6ea" stroke="${"#b8954a"}" stroke-width=".4"/>` + T(sp[0], sp[1] + 0.6, 2.8, "Trauzimmer", "#5a3d18", ' font-style="italic"');
  const fb = seitenPunkt(XR, xm, 0);
  S.teil({ id: "sa_tuer", de: "die Tür", syl: "TÜR", it: "la porta", itSyl: "POR-ta", en: "door", x: fb[0], y: fb[1], kunst: `<g transform="translate(${r(-fb[0])} ${r(-fb[1])})">${k}</g>` });
}

/* =====================================================================
   3 — DAS WAPPEN (Stadtwappen an der Stirnwand)
   ===================================================================== */
{
  let k = `<path d="M-15 -19 L15 -19 L15 1 Q15 13 0 19 Q-15 13 -15 1 Z" fill="${GOLD}"/>`;
  k += `<path d="M-13 -17 L13 -17 L13 1 Q13 11.6 0 16.8 Q-13 11.6 -13 1 Z" fill="${S.lg("schildrot", [[0, "#c8323d"], [1, "#8f1d27"]])}"/>`;
  /* silberne Burg mit drei Türmen — wie viele Stadtwappen */
  k += `<path d="M-9 8 L-9 -4 L-10 -4 L-10 -9 L-8 -9 L-8 -7 L-6.6 -7 L-6.6 -9 L-4.6 -9 L-4.6 -4 L-3 -4 L-3 -12 L-4 -12 L-4 -15 L-2 -15 L-2 -13.4 L-.6 -13.4 L-.6 -15 L.6 -15 L.6 -13.4 L2 -13.4 L2 -15 L4 -15 L4 -12 L3 -12 L3 -4 L4.6 -4 L4.6 -9 L6.6 -9 L6.6 -7 L8 -7 L8 -9 L10 -9 L10 -4 L9 -4 L9 8 Z" fill="${S.lg("silber", [[0, "#ffffff"], [1, "#c9ced3"]])}"/>`;
  k += `<path d="M-2.4 8 L-2.4 2 Q0 -.6 2.4 2 L2.4 8 Z" fill="#3a1d10"/><rect x="-6.6" y="-1" width="1.6" height="2.6" rx=".8" fill="#3a1d10"/><rect x="5" y="-1" width="1.6" height="2.6" rx=".8" fill="#3a1d10"/><rect x="-.8" y="-10" width="1.6" height="2.6" rx=".8" fill="#3a1d10"/>`;
  k += `<path d="M-13 -17 L-3 -17 L-13 -2 Z" fill="#fff" opacity=".1"/>`;
  /* Lorbeer links und rechts */
  for (const sx of [-1, 1]) for (let i = 0; i < 6; i++) k += `<ellipse cx="${sx * (17 + Math.sin(i / 5 * 2.6) * 2.6)}" cy="${-12 + i * 5}" rx="1.4" ry="2.6" fill="#6f8f3a" transform="rotate(${sx * (30 - i * 8)} ${sx * (17 + Math.sin(i / 5 * 2.6) * 2.6)} ${-12 + i * 5})"/>`;
  S.teil({ id: "sa_wappen", de: "das Wappen", syl: "WAP-pen", it: "lo stemma", itSyl: "STEM-ma", en: "coat of arms", x: 160, y: 43, kunst: k,
    tipp: "Das Wappen der Stadt: Das Standesamt gehört zum Rathaus." });
}

/* =====================================================================
   4 — DER KRONLEUCHTER (Mitte, von der Stuckrosette)
   ===================================================================== */
{
  let k = `<line x1="0" y1="-30" x2="0" y2="-17" stroke="${GOLD}" stroke-width=".7"/>`;
  k += `<ellipse cx="0" cy="-9" rx="3" ry="5" fill="${GOLD}"/>`;
  for (const [x, y, d] of [[-14, -6, 1], [14, -6, 1], [-7, -4, 0], [7, -4, 0]]) {
    k += `<path d="M0 -9 Q${x * 0.6} ${y + 6} ${x} ${y}" stroke="${GOLD}" stroke-width="${d ? 0.9 : 0.7}" fill="none"/>`;
    k += `<path d="M${x - 1.6} ${y} L${x + 1.6} ${y} L${x + 1} ${y + 1.2} L${x - 1} ${y + 1.2} Z" fill="${GOLD}"/><rect x="${x - 0.6}" y="${y - 3}" width="1.2" height="3" fill="#fbf8ef"/>`;
    k += `<ellipse cx="${x}" cy="${y - 4}" rx=".7" ry="1.2" fill="#ffe7a0"/><circle cx="${x}" cy="${y - 4}" r="3" fill="#fff2c4" opacity=".35" filter="url(#bw_weich)"/>`;
  }
  for (let i = 0; i < 7; i++) k += `<path d="M${-9 + i * 3} -4 l0 ${3 + (i % 2) * 2}" stroke="#e8f4fb" stroke-width=".4"/><path d="M${-9 + i * 3 - 0.6} ${-1 + (i % 2) * 2} l.6 1.4 l.6 -1.4 Z" fill="#f4fbff"/>`;
  S.teil({ id: "sa_kronleuchter", de: "der Kronleuchter", syl: "KRON-leuch-ter", it: "il lampadario", itSyl: "lam-pa-DA-rio", en: "chandelier", x: 160, y: 21, kunst: `<g transform="scale(.72)">${k}</g>` });
}

/* =====================================================================
   5 — DIE STANDESBEAMTIN (hinter dem Trautisch, mit der Mappe)
   ===================================================================== */
const TI = { y: 128, x0: 92, x1: 228, hB: 0.76 };   // Trautisch: Fußlinie vorn
{
  const m = figur({ id: "b08c_sb", geschlecht: "w", pose: "halten", blick: 6, frisur: "kurz", haarfarbe: "grau", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "weiss" }, jacke: { stueck: "jacke", farbe: "#23324f" }, unterteil: { stueck: "rock", farbe: "#23324f" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "buch", farbe: "#6d1424" } } }, SK(122) * 1.68);
  S.teil({ id: "sa_standesbeamtin", de: "die Standesbeamtin", syl: "STAN-des-be-am-tin", it: "l'ufficiale di stato civile", itSyl: "uf-fi-CIA-le di STA-to ci-VI-le", en: "registrar", x: 160, y: 122, kunst: m.svg,
    tipp: "Sie fragt: „Wollen Sie die Ehe miteinander eingehen?“ — beide antworten: „Ja.“" });
}

/* =====================================================================
   6 — DER TRAUTISCH (weiße Decke, Blumengirlande) — Lupe mit
       Eheurkunde, Füller, Stammbuch, Ringen
   ===================================================================== */
const tischUnter = [];
const TOP = { yv: TI.y - TI.hB * SK(TI.y), yh: 122 - TI.hB * SK(122) };   // Vorder- und Hinterkante der Platte
{
  const cx = (TI.x0 + TI.x1) / 2, W = TI.x1 - TI.x0;
  const xh0 = auf(TI.x0, TI.y, 122), xh1 = auf(TI.x1, TI.y, 122);
  let k = schatten(0, 0.5, W / 2 + 4, 2, 0.3);
  /* Platte mit Decke */
  k += `<path d="M${r(xh0 - cx)} ${r(TOP.yh - TI.y)} L${r(xh1 - cx)} ${r(TOP.yh - TI.y)} L${W / 2 + 1} ${r(TOP.yv - TI.y)} L${-W / 2 - 1} ${r(TOP.yv - TI.y)} Z" fill="${S.lg("decke2", [[0, "#f3f1ec"], [1, "#ffffff"]])}"/>`;
  /* herabfallende Tischdecke mit Falten */
  k += `<path d="M${-W / 2 - 1} ${r(TOP.yv - TI.y)} L${W / 2 + 1} ${r(TOP.yv - TI.y)} L${W / 2 + 2} 0 L${-W / 2 - 2} 0 Z" fill="${LEINEN}"/>`;
  for (let x = -W / 2 + 6; x < W / 2 - 2; x += 9) k += `<path d="M${x} ${r(TOP.yv - TI.y + 3)} Q${x + 1.4} ${r((TOP.yv - TI.y) / 2)} ${x + 0.4} -.5" stroke="#d6d1c6" stroke-width="1.2" fill="none" opacity=".7"/><path d="M${x + 2.2} ${r(TOP.yv - TI.y + 3)} Q${x + 3.4} ${r((TOP.yv - TI.y) / 2)} ${x + 2.6} -.5" stroke="#ffffff" stroke-width=".8" fill="none" opacity=".9"/>`;
  /* Blumengirlande an der Vorderkante: Rosen und Efeu */
  let gir = "";
  for (let i = 0; i <= 26; i++) {
    const t = i / 26, x = -W / 2 + 2 + t * (W - 4), y = TOP.yv - TI.y + 1.6 + Math.sin(t * Math.PI * 4) * -1.2 + Math.abs(Math.sin(t * Math.PI * 2)) * 2.4;
    gir += `<ellipse cx="${r(x)}" cy="${r(y + 1)}" rx="2.6" ry="1.2" fill="#5f8a3f" transform="rotate(${Math.round(rnd() * 60 - 30)} ${r(x)} ${r(y + 1)})"/>`;
    if (i % 2 === 0) gir += `<circle cx="${r(x)}" cy="${r(y)}" r="1.5" fill="${i % 4 ? "#f6eef0" : "#e7a3b0"}"/><circle cx="${r(x - 0.3)}" cy="${r(y - 0.3)}" r=".6" fill="${i % 4 ? "#e8dcdf" : "#c86d81"}"/>`;
  }
  k += gir;
  /* Namensschilder fürs Brautpaar */
  const dok = [];
  {  /* die Eheurkunde (Niederschrift) in der Unterschriftenmappe */
    const x = -46, y = TOP.yv - TI.y - 2.8;
    let g = `<path d="M${x - 8} ${y + 2.4} L${x + 8} ${y + 2.4} L${x + 7.2} ${y - 2.4} L${x - 7.2} ${y - 2.4} Z" fill="#6d1424"/>`;
    g += `<path d="M${x - 7.2} ${y + 1.9} L${x - 0.3} ${y + 1.9} L${x - 0.5} ${y - 2} L${x - 6.6} ${y - 2} Z" fill="#fffdf6"/><path d="M${x + 0.3} ${y + 1.9} L${x + 7.2} ${y + 1.9} L${x + 6.6} ${y - 2} L${x + 0.5} ${y - 2} Z" fill="#fffdf6"/>`;
    g += `<rect x="${x - 5.6}" y="${y - 1.5}" width="4.4" height=".5" fill="#8a6a2a"/>`;
    for (let i = 0; i < 3; i++) g += `<rect x="${x - 6}" y="${r(y - 0.5 + i * 0.7)}" width="${5 - i}" height=".22" fill="#9a9590"/><rect x="${x + 1.2}" y="${r(y - 0.5 + i * 0.7)}" width="${5 - i}" height=".22" fill="#9a9590"/>`;
    g += `<path d="M${x + 1.4} ${y + 1.4} q1 -1 2 0 t2 0" stroke="#1d3d8f" stroke-width=".2" fill="none"/>`;
    k += g;
    dok.push({ id: "sa_eheurkunde", de: "die Eheurkunde", syl: "E-he-ur-kun-de", it: "il certificato di matrimonio", itSyl: "cer-ti-fi-CA-to di ma-tri-MO-nio", en: "marriage certificate", x, y, w: 17, h: 7,
      tipp: "Das Brautpaar und die Trauzeugen unterschreiben — dann ist die Ehe geschlossen." });
  }
  {  /* der Füller */
    const x = -33, y = TOP.yv - TI.y - 1.8;
    let g = `<path d="M${x - 4} ${y + 0.8} L${x + 3} ${y - 0.6}" stroke="#141414" stroke-width="1" stroke-linecap="round"/><path d="M${x + 3} ${y - 0.6} l1.4 -.3" stroke="${GOLD}" stroke-width=".6"/><path d="M${x - 2.6} ${y + 0.5} l1 -.2" stroke="${GOLD}" stroke-width=".9"/>`;
    k += g;
    dok.push({ id: "sa_stift_sa", de: "der Füller", syl: "FÜL-ler", it: "la penna stilografica", itSyl: "PEN-na sti-lo-GRA-fi-ca", en: "fountain pen", x, y, w: 10, h: 4.4 });
  }
  {  /* das Stammbuch (Familienbuch, Leder mit Goldprägung) */
    const x = 44, y = TOP.yv - TI.y - 3;
    let g = `<path d="M${x - 5.4} ${y + 2.6} L${x + 5.4} ${y + 2.6} L${x + 4.8} ${y - 3} L${x - 4.8} ${y - 3} Z" fill="${S.lg("leder", [[0, "#3c5a3a"], [1, "#24381f"]])}"/>`;
    g += `<path d="M${x - 5.4} ${y + 2.6} L${x + 5.4} ${y + 2.6} L${x + 5.4} ${y + 3.4} L${x - 5.4} ${y + 3.4} Z" fill="#f2ecdc"/>`;
    g += `<path d="M${x - 4} ${y - 2.2} L${x + 4} ${y - 2.2} L${x + 4.4} ${y + 1.8} L${x - 4.4} ${y + 1.8} Z" fill="none" stroke="${GOLD}" stroke-width=".25"/>`;
    g += `<circle cx="${x - 0.8}" cy="${y - 0.4}" r="1.1" fill="none" stroke="${GOLD}" stroke-width=".3"/><circle cx="${x + 0.8}" cy="${y - 0.4}" r="1.1" fill="none" stroke="${GOLD}" stroke-width=".3"/>`;
    g += T(x, y + 1.4, 1.2, "Stammbuch", "#e8cf7a", ' font-style="italic"');
    k += g;
    dok.push({ id: "sa_stammbuch", de: "das Stammbuch", syl: "STAMM-buch", it: "il libretto di famiglia", itSyl: "li-BRET-to di fa-MI-glia", en: "family register book", x, y, w: 12, h: 7.6,
      tipp: "Ins Stammbuch kommen die Urkunden der Familie — Heirat, Geburt der Kinder." });
  }
  {  /* die Ringe auf dem Ringkissen */
    const x = 57, y = TOP.yv - TI.y - 2.4;
    let g = `<path d="M${x - 4.6} ${y + 1.8} Q${x - 5} ${y - 1.8} ${x} ${y - 2} Q${x + 5} ${y - 1.8} ${x + 4.6} ${y + 1.8} Q${x} ${y + 2.6} ${x - 4.6} ${y + 1.8} Z" fill="${S.lg("kissen", [[0, "#fbf7f2"], [1, "#e4d9cd"]])}"/>`;
    g += `<path d="M${x - 3} ${y - 0.4} q3 1 6 0" stroke="#d9b3bb" stroke-width=".5" fill="none"/>`;
    g += `<ellipse cx="${x - 1}" cy="${y - 0.7}" rx="1.3" ry=".8" fill="none" stroke="${GOLD}" stroke-width=".55"/><ellipse cx="${x + 1}" cy="${y - 0.4}" rx="1.15" ry=".7" fill="none" stroke="${GOLD}" stroke-width=".5"/><circle cx="${x - 1.9}" cy="${y - 1.4}" r=".3" fill="#fff"/>`;
    k += g;
    dok.push({ id: "sa_ringe", de: "die Ringe", syl: "RIN-ge", it: "gli anelli", itSyl: "a-NEL-li", en: "wedding rings", x, y, w: 10, h: 5,
      tipp: "Nach dem Ja-Wort stecken sich die beiden die Ringe an — in Deutschland meist rechts." });
  }
  dok.forEach((d) => tischUnter.push({ id: d.id, de: d.de, syl: d.syl, it: d.it, itSyl: d.itSyl, en: d.en, tipp: d.tipp, x: cx + d.x, y: TI.y + d.y + d.h / 2, kunst: flaeche(-d.w / 2, -d.h, d.w, d.h, 0.6) }));
  S.teil({ id: "sa_traustisch", de: "der Traustisch", syl: "TRAU-tisch", it: "il tavolo delle nozze", itSyl: "TA-vo-lo delle NOZ-ze", en: "registrar's table", x: cx, y: TI.y, steht: true, kunst: k,
    zoom: { x: 96, y: 76, w: 128, h: 66 }, unter: tischUnter });
}
{
  /* DIE KERZE — Traukerze im Messingleuchter (links auf dem Tisch) */
  let k = schatten(0, 0.2, 3, 0.6, 0.3);
  k += `<ellipse cx="0" cy="-.6" rx="3" ry=".9" fill="${GOLD}"/><rect x="-.6" y="-4" width="1.2" height="3.6" fill="${GOLD}"/><ellipse cx="0" cy="-4" rx="2" ry=".6" fill="${GOLD}"/>`;
  k += `<rect x="-1.6" y="-17" width="3.2" height="13" rx=".4" fill="${S.lg("wachs", [[0, "#fffdf6"], [0.6, "#f6efdf"], [1, "#d9cfba"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-1.2 -12 q1.2 1.6 2.4 0" stroke="#d8a7b2" stroke-width=".4" fill="none"/><circle cx="0" cy="-10.6" r=".7" fill="none" stroke="${GOLD}" stroke-width=".25"/><circle cx="-.5" cy="-10.6" r=".7" fill="none" stroke="${GOLD}" stroke-width=".25"/>`;
  k += `<line x1="0" y1="-17" x2="0" y2="-18" stroke="#333" stroke-width=".2"/><path d="M0 -21.6 Q1 -19.4 0 -18 Q-1 -19.4 0 -21.6 Z" fill="#ffcf5a"/><circle cx="0" cy="-19.4" r="3.2" fill="#fff0b8" opacity=".35" filter="url(#bw_weich)"/>`;
  S.teil({ oben: true, id: "sa_kerze_sa", de: "die Kerze", syl: "KER-ze", it: "la candela", itSyl: "can-DE-la", en: "candle", x: 100, y: TOP.yv + 1.2, steht: true, kunst: k + flaeche(-3.4, -22, 6.8, 22) });
}
{
  /* DER BLUMENSTRAUß — Tischgesteck in der Vase (rechts) */
  let k = schatten(0, 0.2, 5, 0.7, 0.3);
  k += `<path d="M-3 0 L3 0 L3.6 -6 Q3.8 -8 2.4 -8.6 L-2.4 -8.6 Q-3.8 -8 -3.6 -6 Z" fill="${S.lg("vase", [[0, "#ffffff", 0.75], [1, "#d6e6ec", 0.6]], 0, 0, 1, 0)}" stroke="#b9cbd1" stroke-width=".3"/>`;
  for (let i = 0; i < 9; i++) k += `<line x1="${r(-1.6 + i * 0.4)}" y1="-1" x2="${r(-6 + i * 1.5)}" y2="-11" stroke="#4d7a32" stroke-width=".35"/>`;
  for (let i = 0; i < 16; i++) { const a = rnd() * Math.PI * 2, d = rnd() * 6; k += `<ellipse cx="${r(Math.cos(a) * d * 1.2)}" cy="${r(-15 + Math.sin(a) * d * 0.7)}" rx="2.4" ry="1.2" fill="#5f8a3f" transform="rotate(${Math.round(a * 57)} ${r(Math.cos(a) * d * 1.2)} ${r(-15 + Math.sin(a) * d * 0.7)})"/>`; }
  const bl = [[-4, -16, "#ffffff"], [0, -18.4, "#f6c9d2"], [4, -16.4, "#ffffff"], [-2, -13, "#e7a3b0"], [2.6, -12.6, "#fdf5f7"], [-5.6, -12, "#f6c9d2"], [5.4, -12.4, "#e7a3b0"], [0.6, -15, "#ffffff"]];
  bl.forEach(([x, y, c]) => { k += `<circle cx="${x}" cy="${y}" r="2.1" fill="${c}"/><path d="M${x - 1.2} ${y} q1.2 -1.4 2.4 0 q-1.2 1 -2.4 0" stroke="#c98a97" stroke-width=".3" fill="none" opacity=".7"/>`; });
  for (let i = 0; i < 10; i++) k += `<circle cx="${r(-7 + rnd() * 14)}" cy="${r(-20 + rnd() * 10)}" r=".5" fill="#fbfbf6"/>`;
  S.teil({ oben: true, id: "sa_blumenstrauss", de: "der Blumenstrauß", syl: "BLU-men-strauß", it: "il bouquet", itSyl: "bou-QUET", en: "bouquet", x: 222, y: TOP.yv + 1, steht: true, kunst: k,
    tipp: "Weiße und rosa Rosen — die Lieblingsblumen bei Hochzeiten." });
}

/* =====================================================================
   7 — DER TRAUZEUGE (sitzt rechts neben dem Tisch, schaut zum Paar)
   ===================================================================== */
{
  const fy = 142, s = SK(fy);
  /* sein Stuhl: Eiche mit rotem Polster, Seitenansicht schräg */
  let st = schatten(0, 0.4, 9, 1.2, 0.3);
  const sh = 0.46 * s;
  st += `<path d="M5 0 L5 ${r(-sh)} M-6 0 L-6 ${r(-sh)} M7 -2 L7.4 ${r(-sh)} M-8 -2 L-7.6 ${r(-sh)}" stroke="#5e3c1c" stroke-width="1.3"/>`;
  st += `<path d="M-9 ${r(-sh - 1)} L8 ${r(-sh - 1)} L8.6 ${r(-sh + 1.6)} L-9.6 ${r(-sh + 1.6)} Z" fill="${SAMT}"/><rect x="-9.6" y="${r(-sh + 1.4)}" width="18.2" height="1.6" fill="${EICHE}"/>`;
  st += `<path d="M5 ${r(-sh - 1)} L6.6 ${r(-0.98 * s)} L9.6 ${r(-0.98 * s)} L8.4 ${r(-sh - 1)} Z" fill="${EICHE_V}"/>`;
  S.teil({ id: "sa_stuhl_zeuge", de: "der Polsterstuhl", syl: "POL-ster-stuhl", it: "la sedia imbottita", itSyl: "SE-dia im-bot-TI-ta", en: "upholstered chair", x: 254, y: fy, steht: true, kunst: st });
  const m = figur({ id: "b08c_tz", geschlecht: "m", pose: "sitzen", blick: -62, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "hemd", farbe: "#dbe6f1" }, jacke: { stueck: "jacke", farbe: "#4a4f58" }, unterteil: { stueck: "anzughose", farbe: "#4a4f58" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, s * 1.78);
  /* Gesäß auf das Polster: der Sitz der Figur liegt bei sitz.y·k über dem Boden */
  const oy = fy - sh - 0.4 + -m.z.sitz.y * m.k;
  S.teil({ id: "sa_trauzeuge", de: "der Trauzeuge", syl: "TRAU-zeu-ge", it: "il testimone di nozze", itSyl: "te-sti-MO-ne di NOZ-ze", en: "witness", x: 254 + 1, y: r(oy), kunst: m.svg,
    tipp: "Trauzeugen sind heute freiwillig — höchstens zwei." });
}

/* =====================================================================
   8 — DER LÄUFER (roter Teppich im Mittelgang)
   ===================================================================== */
{
  const y0 = 133, y1 = 200, b0 = 12, b1 = b0 * SK(y1) / SK(y0);
  let k = `<path d="M${-b0} ${y0 - y1} L${b0} ${y0 - y1} L${r(b1)} 0 L${r(-b1)} 0 Z" fill="${S.lg("teppich", [[0, "#7e1626"], [1, "#a8263a"]])}"/>`;
  k += `<path d="M${-b0 + 1.4} ${y0 - y1} L${r(-b1 + 3)} 0 M${b0 - 1.4} ${y0 - y1} L${r(b1 - 3)} 0" stroke="${GOLD}" stroke-width=".7"/>`;
  k += `<path d="M${-b0} ${y0 - y1} L${b0} ${y0 - y1}" stroke="#5e0f1b" stroke-width=".8"/>`;
  S.teil({ id: "sa_teppich", de: "der Teppich", syl: "TEP-pich", it: "il tappeto", itSyl: "tap-PE-to", en: "carpet", x: 160, y: 200, kunst: k });
}

/* =====================================================================
   9 — DIE BRAUT (weißes Kleid, Schleier) und DER BRÄUTIGAM (dunkler
       Anzug) — sie stehen vor dem Tisch, von hinten gesehen
   ===================================================================== */
{
  const fy = 140, s = SK(fy);
  const m = figur({ id: "b08c_br", geschlecht: "w", pose: "stehen", blick: 196, frisur: "dutt", haarfarbe: "braun", haut: "hell",
    kleidung: { kleid: { stueck: "abendkleid", farbe: "#fbf9f4" }, schuhe: { stueck: "halbschuh", farbe: "weiss" } } }, s * 1.68);
  /* Schleier: vom Dutt über den Rücken, zart durchscheinend */
  const sc = m.z.punkte.hinterkopf || m.z.punkte.scheitel, k = m.k;
  const hx = sc[0] * k, hy = sc[1] * k, L = s * 0.75;
  let sch = `<path d="M${r(hx - 2)} ${r(hy - 1)} Q${r(hx - 9)} ${r(hy + L * 0.5)} ${r(hx - 11)} ${r(hy + L)} Q${r(hx)} ${r(hy + L + 3)} ${r(hx + 11)} ${r(hy + L)} Q${r(hx + 9)} ${r(hy + L * 0.5)} ${r(hx + 2)} ${r(hy - 1)} Z" fill="#ffffff" opacity=".45"/>`;
  sch += `<path d="M${r(hx - 4)} ${r(hy + 6)} Q${r(hx - 6)} ${r(hy + L * 0.6)} ${r(hx - 5)} ${r(hy + L)} M${r(hx + 3)} ${r(hy + 6)} Q${r(hx + 5)} ${r(hy + L * 0.6)} ${r(hx + 4)} ${r(hy + L)}" stroke="#ffffff" stroke-width=".6" opacity=".55" fill="none"/>`;
  sch += `<ellipse cx="${r(hx)}" cy="${r(hy - 0.5)}" rx="2.4" ry="1.2" fill="#f6eef0"/><circle cx="${r(hx - 1)}" cy="${r(hy - 0.8)}" r=".6" fill="#e7a3b0"/><circle cx="${r(hx + 1)}" cy="${r(hy - 0.6)}" r=".6" fill="#ffffff"/>`;
  S.teil({ id: "sa_braut", de: "die Braut", syl: "BRAUT", it: "la sposa", itSyl: "SPO-sa", en: "bride", x: 139, y: fy, kunst: m.svg + sch,
    tipp: "Die Braut trägt ein weißes Kleid und einen Schleier." });
}
{
  const fy = 141, s = SK(fy);
  const m = figur({ id: "b08c_bg", geschlecht: "m", pose: "stehen", blick: 166, frisur: "kurz", haarfarbe: "schwarz", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "jacke", farbe: "#1f2229" }, unterteil: { stueck: "anzughose", farbe: "#1f2229" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, s * 1.82);
  S.teil({ id: "sa_braeutigam", de: "der Bräutigam", syl: "BRÄU-ti-gam", it: "lo sposo", itSyl: "SPO-so", en: "groom", x: 182, y: fy, kunst: m.svg,
    tipp: "Der Bräutigam trägt einen dunklen Anzug." });
}

/* =====================================================================
   10 — DIE STUHLREIHE (vorne links, Gäste-Stühle von hinten)
   ===================================================================== */
{
  const fy = 172, s = SK(fy);
  let k = schatten(-2, 0.5, 50, 2, 0.3);
  const stuhl = (x) => {
    const w = 0.46 * s, sh = 0.46 * s, lh = 0.98 * s;
    let g = `<path d="M${r(x - w / 2 + 1)} 0 L${r(x - w / 2 + 1.6)} ${r(-sh)} M${r(x + w / 2 - 1)} 0 L${r(x + w / 2 - 1.6)} ${r(-sh)}" stroke="#4e3218" stroke-width="1.8"/>`;
    g += `<path d="M${r(x - w / 2)} ${r(-sh - 1)} L${r(x + w / 2)} ${r(-sh - 1)} L${r(x + w / 2 + 1)} ${r(-sh + 2.4)} L${r(x - w / 2 - 1)} ${r(-sh + 2.4)} Z" fill="${SAMT}"/>`;
    g += `<path d="M${r(x - w / 2 + 0.6)} ${r(-sh)} L${r(x - w / 2 + 1.2)} ${r(-lh)} Q${r(x)} ${r(-lh - 3)} ${r(x + w / 2 - 1.2)} ${r(-lh)} L${r(x + w / 2 - 0.6)} ${r(-sh)} Z" fill="${EICHE_V}"/>`;
    g += `<path d="M${r(x - w / 2 + 3)} ${r(-sh - 4)} L${r(x - w / 2 + 3.4)} ${r(-lh + 3)} Q${r(x)} ${r(-lh)} ${r(x + w / 2 - 3.4)} ${r(-lh + 3)} L${r(x + w / 2 - 3)} ${r(-sh - 4)} Z" fill="${SAMT}"/>`;
    g += `<path d="M${r(x - w / 2 + 3.4)} ${r(-lh + 3)} Q${r(x)} ${r(-lh)} ${r(x + w / 2 - 3.4)} ${r(-lh + 3)}" stroke="#d0435a" stroke-width=".7" fill="none" opacity=".6"/>`;
    /* Schleife aus Organza an der Lehne */
    g += `<path d="M${r(x)} ${r(-lh + 6)} l-4 -2.4 l0 4.8 Z M${r(x)} ${r(-lh + 6)} l4 -2.4 l0 4.8 Z" fill="#fbf7f2" opacity=".9"/><path d="M${r(x)} ${r(-lh + 6)} l-2 7 M${r(x)} ${r(-lh + 6)} l2 7" stroke="#fbf7f2" stroke-width="1"/>`;
    return g;
  };
  for (const x of [-38, -6, 26]) k += stuhl(x);
  S.teil({ id: "sa_stuhlreihe_sa", de: "die Stuhlreihe", syl: "STUHL-rei-he", it: "la fila di sedie", itSyl: "FI-la di SE-die", en: "row of chairs", x: 54, y: fy, steht: true, kunst: k,
    tipp: "Hier sitzen die Gäste — im Trauzimmer ist meist Platz für etwa 20 Personen." });
}

/* =====================================================================
   11 — DIE BODENVASE (vorne rechts, große Lilien)
   ===================================================================== */
{
  const fy = 182, s = SK(fy);
  let k = schatten(0, 0.4, 10, 1.6, 0.3);
  k += `<path d="M-6 0 L6 0 Q10 -14 7 -28 Q6 -34 8 -40 L-8 -40 Q-6 -34 -7 -28 Q-10 -14 -6 0 Z" fill="${S.lg("bodenvase", [[0, "#e9e2d2"], [0.5, "#fbf7ee"], [1, "#c9bea8"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="-40" rx="8" ry="1.6" fill="#d9cfba"/><path d="M-5 -36 Q-3 -20 -4 -4" stroke="#fff" stroke-width="1.2" opacity=".6" fill="none"/>`;
  for (let i = 0; i < 9; i++) { const x = -12 + i * 3; k += `<path d="M${r(x * 0.25)} -40 Q${r(x * 0.6)} -52 ${r(x)} ${r(-62 - (i % 3) * 4)}" stroke="#4d7a32" stroke-width=".6" fill="none"/>`; }
  for (let i = 0; i < 7; i++) {
    const x = -11 + i * 3.6, y = -62 - ((i * 2) % 3) * 4;
    k += `<path d="M${r(x)} ${y} l-3 -3 l1.6 3.4 l-2.6 1 l4 -.4 Z M${r(x)} ${y} l3 -3 l-1.6 3.4 l2.6 1 l-4 -.4 Z M${r(x)} ${y} l0 -4.4" fill="#ffffff" stroke="#e6dfd2" stroke-width=".3"/><circle cx="${r(x)}" cy="${y - 0.6}" r=".5" fill="#e0a526"/>`;
    k += `<ellipse cx="${r(x + 2)}" cy="${y + 6}" rx="1" ry="3.4" fill="#5f8a3f" transform="rotate(30 ${r(x + 2)} ${y + 6})"/>`;
  }
  S.teil({ id: "sa_vase", de: "die Vase", syl: "VA-se", it: "il vaso", itSyl: "VA-so", en: "vase", x: 296, y: fy, steht: true, kunst: k });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/standesamt.js"));
console.log(aus);
