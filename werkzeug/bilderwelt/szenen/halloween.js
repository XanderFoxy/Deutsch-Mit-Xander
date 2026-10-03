#!/usr/bin/env node
/* =====================================================================
   HALLOWEEN (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar.

   RECHERCHE (Apotheken Umschau „Süßes oder Saures! Der Halloween-
   Ratgeber“, selbst.de „Schmücken zu Halloween“, web.de „Wie feiern die
   Deutschen Halloween“) — so sieht ein Hauseingang am 31. Oktober aus:
   - Am Abend ziehen Kinder im KOSTÜM (Hexe, Gespenst, Vampir) von Haus zu
     Haus, klingeln und rufen „Süßes oder Saures!“. An der Tür steht die
     MUTTER mit einer Schale SÜSSIGKEITEN.
   - Auf den Stufen: ausgehöhlte, geschnitzte KÜRBISLATERNEN mit
     Teelicht, ganze KÜRBISSE, KERZEN im Windlicht; Herbstlaub.
   - An der Tür: SPINNENNETZ mit SPINNE, eine FLEDERMAUS-GIRLANDE am
     Vordach, ein GESPENST aus Stoff. Briefkasten, Klingel, Außenlampe.
   - Ende Oktober: kahle Bäume, Vollmond, Fledermäuse.
   Alles kindgerecht: freundliche Gesichter, nichts Blutiges.
   Maßstab: Hauswand ≈ 40 Einheiten je Meter (Tür 2,1 m), Kind vorne
   ≈ 46 je Meter. Augenhöhe y ≈ 95.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "halloween", titel: "Halloween", emoji: "🎃", thema: "Feste", kuerzel: "hw", fassung: 852 });
const rnd = zufall(3110);
const r = B.r;

/* Figuren schlanker: ganze Zentimeter (bei k ≈ 0,4 unter einem Bildpunkt) */
const h2 = (n) => String(Math.round(parseFloat(n)));
const schlank = (svg) => svg.replace(/( d=")([^"]*)"/g, (a, b, c) => b + c.replace(/-?\d*\.\d+/g, h2) + '"')
  .replace(/ (cx|cy|x1|y1|x2|y2|x|y)="(-?\d*\.\d+)"/g, (a, b, c) => ` ${b}="${h2(c)}"`)
  .replace(/ (r|rx|ry|width|height)="(\d*\.\d+)"/g, (a, b, c) => ` ${b}="${parseFloat(c) < 1.5 ? c : h2(c)}"`);
const figur = (spec, hoehe) => { const m = B.mensch(spec, hoehe); return { svg: `<g transform="scale(${m.k.toFixed(4)})">${schlank(m.z.svg)}</g>`, k: m.k, z: m.z }; };
const haende = (m) => [m.z.handL, m.z.handR].filter(Boolean).map((h) => [(h.x != null ? h.x : h[0]) * m.k, (h.y != null ? h.y : h[1]) * m.k]).sort((a, b) => a[1] - b[1]);

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const KUERBIS = S.rg("kuerbis", [[0, "#ffb04a"], [0.6, "#e8741a"], [1, "#a8460a"]], 0.4, 0.35, 0.75);
const GLUT = S.rg("glut", [[0, "#ffe9a0", 0.85], [1, "#ffb040", 0]]);
const INNENGLUT = S.rg("innenglut", [[0, "#fff6b0"], [0.6, "#ffc23a"], [1, "#e8741a"]]);
const STEIN = S.lg("stein", [[0, "#a9a39a"], [1, "#7e786f"]]);

/* =====================================================================
   KULISSE — Abendhimmel, kahler Baum, Vorgarten, Hauswand mit Fenster
   ===================================================================== */
const SOCKEL = 140;          // Oberkante Podest vor der Tür = Fuß der Hauswand
S.hinten(`<rect x="0" y="0" width="320" height="170" fill="${S.lg("himmel", [[0, "#0e0f2e"], [0.55, "#2c2458"], [0.85, "#6a3a6a"], [1, "#b8603a"]])}"/>`);
{
  let g = "";
  for (let i = 0; i < 40; i++) g += `<circle cx="${r(rnd() * 150)}" cy="${r(rnd() * 70)}" r="${r(0.2 + rnd() * 0.3)}" fill="#fff" opacity="${r(0.4 + rnd() * 0.5)}"/>`;
  /* ferne Dächer mit hellen Fenstern */
  g += `<path d="M0 132 L0 112 L14 102 L28 112 L28 104 L44 94 L60 104 L60 114 L74 106 L90 116 L106 108 L120 116 L140 116 L140 140 L0 140 Z" fill="#1a1630"/>`;
  for (const [x, y] of [[6, 118], [18, 118], [36, 110], [50, 112], [80, 120], [98, 118]]) g += `<rect x="${x}" y="${y}" width="3.6" height="4" fill="#ffc86a" opacity=".85"/>`;
  /* kahler Baum */
  const ast = (x, y, a, l, d) => {
    const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l;
    g += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x2)}" y2="${r(y2)}" stroke="#120e1e" stroke-width="${r(0.5 + d * 0.9)}" stroke-linecap="round"/>`;
    if (d > 0) { ast(x2, y2, a - 0.35 - rnd() * 0.3, l * 0.72, d - 1); ast(x2, y2, a + 0.3 + rnd() * 0.3, l * 0.7, d - 1); }
  };
  ast(104, 150, -Math.PI / 2 - 0.05, 30, 5);
  S.hinten(g);
}
/* Vorgarten: Rasen, Gehwegplatten zur Treppe */
S.hinten(`<rect x="0" y="140" width="320" height="60" fill="${S.lg("garten", [[0, "#1e2a22"], [1, "#2c3a2a"]])}"/>`);
S.hinten(`<path d="M120 200 L150 168 L238 168 L262 200 Z" fill="${S.lg("weg", [[0, "#6e665e"], [1, "#8a8278"]])}"/><path d="M134 184 L250 184 M127 192 L256 192 M142 176 L244 176" stroke="#4e4840" stroke-width=".5"/><path d="M180 168 L176 200 M210 168 L216 200" stroke="#4e4840" stroke-width=".5"/>`);
/* Hauswand: Putz, Sockel, Lichtschein der Außenlampe */
{
  let g = `<rect x="138" y="0" width="182" height="${SOCKEL}" fill="${S.lg("putz", [[0, "#7a6e66"], [1, "#5e544e"]], 0, 0, 1, 0)}"/>`;
  g += `<rect x="138" y="${SOCKEL - 10}" width="182" height="10" fill="${STEIN}"/><rect x="138" y="${SOCKEL - 10}" width="182" height="1" fill="#c8c2b8" opacity=".5"/>`;
  g += `<rect x="134" y="0" width="5" height="${SOCKEL}" fill="#4a423e"/>`;
  g += `<circle cx="238" cy="72" r="60" fill="${S.rg("lampenschein", [[0, "#ffd890", 0.45], [1, "#ffd890", 0]])}"/>`;
  /* Fenster rechts: warm erleuchtet, Gardine, ein Fensterbild (Kürbis) */
  g += `<rect x="270" y="58" width="40" height="50" fill="#e9e2d6"/><rect x="273" y="61" width="34" height="44" fill="${S.lg("fenster", [[0, "#ffe2a0"], [1, "#e8a050"]])}"/>`;
  g += `<path d="M273 61 L281 61 Q279 84 282 105 L273 105 Z M307 61 L299 61 Q301 84 298 105 L307 105 Z" fill="#c86a3a" opacity=".55"/><rect x="288.6" y="61" width="2.8" height="44" fill="#e9e2d6"/><rect x="273" y="81" width="34" height="2" fill="#e9e2d6"/>`;
  g += `<ellipse cx="282" cy="96" rx="4" ry="3.4" fill="#2a1a10" opacity=".75"/><path d="M280.4 95 l.8 -1 l.8 1 Z M282.8 95 l.8 -1 l.8 1 Z M280 97.4 q2 1.4 4 0" fill="#ffd27a" stroke="#ffd27a" stroke-width=".3"/>`;
  g += `<rect x="268" y="108" width="44" height="2.4" fill="#cfc8bc"/>`;
  S.hinten(g);
}

/* =====================================================================
   1 — DER MOND und 2 — DIE FLEDERMAUS
   ===================================================================== */
{
  let k = `<circle r="26" fill="${S.rg("mondhof", [[0, "#fff6d0", 0.35], [1, "#fff6d0", 0]])}"/><circle r="14" fill="${S.rg("mond", [[0, "#fffbe6"], [0.7, "#f2e6b6"], [1, "#d8c88a"]], 0.4, 0.35, 0.8)}"/>`;
  for (const [x, y, rr] of [[-4, -3, 2.6], [3.6, 2, 1.8], [-1, 6, 1.4], [5, -6, 1.2], [-7, 3, 1]]) k += `<circle cx="${x}" cy="${y}" r="${rr}" fill="#d9c98e" opacity=".55"/>`;
  S.teil({ id: "mond", de: "der Mond", syl: "MOND", it: "la luna", itSyl: "LU-na", en: "moon", x: 52, y: 40, kunst: k,
    tipp: "Heute ist Vollmond – der Mond ist ganz rund." });
}
{
  const fl = (s) => `<path d="M0 0 Q-2 -2.4 -4.6 -2.2 Q-6 -3.6 -8.6 -3 Q-8 -1.6 -9 -.4 Q-7 -.8 -6 .6 Q-4.6 -.2 -3.4 1.2 Q-1.6 .4 0 1.4 Q1.6 .4 3.4 1.2 Q4.6 -.2 6 .6 Q7 -.8 9 -.4 Q8 -1.6 8.6 -3 Q6 -3.6 4.6 -2.2 Q2 -2.4 0 0 Z" fill="#141018" transform="scale(${s})"/><path d="M-.9 -.6 L-1.1 -2 L-.3 -1 L.3 -1 L1.1 -2 L.9 -.6 Z" fill="#141018" transform="scale(${s})"/>`;
  S.teil({ oben: true, id: "fledermaus", de: "die Fledermaus", syl: "FLE-der-maus", it: "il pipistrello", itSyl: "pi-pi-STREL-lo", en: "bat", x: 62, y: 34, kunst: fl(1.1),
    tipp: "Fledermäuse fliegen in der Nacht und schlafen am Tag." });
}

/* =====================================================================
   3 — DIE HAUSTÜR mit Vordach (offen, im Flur brennt Licht)
   ===================================================================== */
const TUER = { x0: 180, x1: 220, y0: 56, y1: SOCKEL };
{
  const W = TUER.x1 - TUER.x0, H = TUER.y1 - TUER.y0, cx = (TUER.x0 + TUER.x1) / 2;
  let k = `<g transform="translate(${-cx} ${-TUER.y1})">`;
  /* Laibung und Rahmen, Oberlicht */
  k += `<rect x="${TUER.x0 - 5}" y="${TUER.y0 - 12}" width="${W + 10}" height="${H + 12}" fill="#3e3632"/>`;
  k += `<rect x="${TUER.x0}" y="${TUER.y0 - 9}" width="${W}" height="7" fill="${S.lg("oberlicht", [[0, "#ffe6a8"], [1, "#e8b060"]])}"/><path d="M${cx} ${TUER.y0 - 9} L${cx} ${TUER.y0 - 2} M${TUER.x0} ${TUER.y0 - 5.5} L${TUER.x1} ${TUER.y0 - 5.5}" stroke="#3e3632" stroke-width=".8"/>`;
  k += `<rect x="${TUER.x0}" y="${TUER.y0}" width="${W}" height="${H}" fill="${S.lg("flur", [[0, "#ffe2a0"], [1, "#c8864a"]])}"/>`;
  k += `<rect x="${TUER.x0 + 22}" y="${TUER.y0 + 14}" width="10" height="16" fill="#e8d2a8" stroke="#b08a5a" stroke-width=".5"/><rect x="${TUER.x0}" y="${TUER.y1 - 10}" width="${W}" height="10" fill="#a8743e"/>`;
  /* Türblatt (dunkelgrün, Kassetten, Messing), nach innen geöffnet */
  k += `<path d="M${TUER.x0} ${TUER.y0} L${TUER.x0 + 12} ${TUER.y0 + 5} L${TUER.x0 + 12} ${TUER.y1 + 3} L${TUER.x0} ${TUER.y1} Z" fill="${S.lg("blatt", [[0, "#2a4a3a"], [1, "#1a3026"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${TUER.x0 + 2} ${TUER.y0 + 8} L${TUER.x0 + 10} ${TUER.y0 + 11.4} L${TUER.x0 + 10} ${TUER.y0 + 40} L${TUER.x0 + 2} ${TUER.y0 + 37} Z M${TUER.x0 + 2} ${TUER.y0 + 44} L${TUER.x0 + 10} ${TUER.y0 + 47} L${TUER.x0 + 10} ${TUER.y1 - 6} L${TUER.x0 + 2} ${TUER.y1 - 8} Z" fill="none" stroke="#3e6a52" stroke-width=".6"/>`;
  k += `<rect x="${TUER.x0 + 9}" y="${TUER.y0 + 42}" width="1.6" height="4" rx=".6" fill="#d8b24a"/>`;
  /* Vordach aus Glas auf Konsolen */
  k += `<path d="M${TUER.x0 - 18} ${TUER.y0 - 22} L${TUER.x1 + 18} ${TUER.y0 - 22} L${TUER.x1 + 22} ${TUER.y0 - 17} L${TUER.x0 - 22} ${TUER.y0 - 17} Z" fill="#cfd8de" opacity=".7"/><rect x="${TUER.x0 - 22}" y="${TUER.y0 - 17}" width="${W + 44}" height="1.6" fill="#3a3a3e"/>`;
  for (const x of [TUER.x0 - 16, TUER.x1 + 16]) k += `<path d="M${x} ${TUER.y0 - 15.4} L${x} ${TUER.y0 - 5} L${x + (x < cx ? 6 : -6)} ${TUER.y0 - 15.4}" stroke="#3a3a3e" stroke-width=".8" fill="none"/>`;
  k += `</g>`;
  S.teil({ id: "haustuer", de: "die Haustür", syl: "HAUS-tür", it: "la porta di casa", itSyl: "POR-ta di CA-sa", en: "front door", x: cx, y: TUER.y1, kunst: k });
}
/* DIE LAMPE (Außenleuchte) rechts neben der Tür */
{
  let k = `<circle r="12" fill="${GLUT}" opacity=".6"/><rect x="-1" y="-8" width="2" height="4" fill="#1e1e22"/><path d="M-3.4 -4 L3.4 -4 L2.6 4 L-2.6 4 Z" fill="${S.lg("lglas", [[0, "#fff6c8"], [1, "#ffc860"]])}" stroke="#1e1e22" stroke-width=".7"/><path d="M-4.4 -4.4 L4.4 -4.4 L0 -7 Z" fill="#1e1e22"/><rect x="-3" y="4" width="6" height="1" fill="#1e1e22"/>`;
  S.teil({ id: "lampe", de: "die Lampe", syl: "LAM-pe", it: "la lampada", itSyl: "LAM-pa-da", en: "lamp", x: 236, y: 74, kunst: k });
}
/* DIE KLINGEL mit Hausnummer */
{
  let k = `<rect x="-3" y="-5" width="6" height="10" rx=".8" fill="${S.lg("klingel", [[0, "#d8dde0"], [1, "#9aa3aa"]], 0, 0, 1, 0)}"/><circle cx="0" cy="1.6" r="1.4" fill="#f6efe0" stroke="#7d868d" stroke-width=".3"/><rect x="-2.2" y="-3.8" width="4.4" height="2" fill="#fff"/><text x="0" y="-2.3" font-size="1.4" text-anchor="middle" fill="#222" font-family="Arial">Weber</text>`;
  k += `<rect x="-3.4" y="-13" width="6.8" height="6" rx=".6" fill="#2a4a6a"/><text x="0" y="-8.6" font-size="4.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">12</text>`;
  S.teil({ id: "klingel", de: "die Klingel", syl: "KLIN-gel", it: "il campanello", itSyl: "cam-pa-NEL-lo", en: "doorbell", x: 228, y: 98, kunst: k,
    tipp: "Die Kinder klingeln und rufen: „Süßes oder Saures!“" });
}
/* DER BRIEFKASTEN */
{
  let k = `<rect x="-7" y="-8" width="14" height="16" rx="1" fill="${S.lg("bk", [[0, "#4a4e54"], [1, "#2a2e33"]], 0, 0, 1, 0)}"/><rect x="-5" y="-5" width="10" height="1.4" rx=".6" fill="#1a1c20"/><rect x="-3" y="1" width="6" height="2.4" fill="#e8e2d4"/><text x="0" y="2.9" font-size="1.6" text-anchor="middle" fill="#222" font-family="Arial">Weber</text>`;
  S.teil({ id: "briefkasten", de: "der Briefkasten", syl: "BRIEF-kas-ten", it: "la cassetta delle lettere", itSyl: "cas-SET-ta del-le LET-te-re", en: "letterbox", x: 252, y: 104, kunst: k });
}

/* =====================================================================
   4 — DIE MUTTER in der Tür mit der Schale SÜSSIGKEITEN
   ===================================================================== */
let schale = [0, 0];
{
  const m = figur({ id: "hw_mutter", geschlecht: "w", pose: "halten", blick: -30, frisur: "locken", haarfarbe: "rot", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#2f3035" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 66);
  const X = 205, Y = SOCKEL;
  const [hx, hy] = haende(m)[0];
  schale = [X + hx - 1, Y + hy + 1];
  S.teil({ id: "mutter", de: "die Mutter", syl: "MUT-ter", it: "la mamma", itSyl: "MAM-ma", en: "mother", x: X, y: Y, kunst: m.svg,
    tipp: "Sie macht die Tür auf und verteilt Süßigkeiten." });
}
{
  let k = `<path d="M-6 -3 Q-6 2 0 2.4 Q6 2 6 -3 Z" fill="${S.lg("schale", [[0, "#ff9a3a"], [1, "#c85a10"]], 0, 0, 1, 0)}"/><path d="M-6 -3 Q0 -1.4 6 -3" stroke="#a8460a" stroke-width=".4" fill="none"/>`;
  for (const [dx, f] of [[-4, "#e2405a"], [-2, "#f2d23a"], [0, "#3a8ad8"], [2, "#55b04a"], [4, "#a25ad0"], [-1, "#f07a2a"], [1.6, "#fff"]]) k += `<ellipse cx="${dx}" cy="${dx === -1 || dx === 1.6 ? -4.6 : -3.6}" rx="1.2" ry=".8" fill="${f}"/><path d="M${dx - 1.2} ${dx === -1 || dx === 1.6 ? -4.6 : -3.6} l-.7 -.5 l0 1 Z M${dx + 1.2} ${dx === -1 || dx === 1.6 ? -4.6 : -3.6} l.7 -.5 l0 1 Z" fill="${f}"/>`;
  k += `<line x1="3" y1="-4" x2="5" y2="-9" stroke="#fff" stroke-width=".4"/><circle cx="5.2" cy="-9.6" r="1.4" fill="#e2405a"/><path d="M4.4 -10 q.8 .8 1.6 0" stroke="#fff" stroke-width=".3" fill="none"/>`;
  S.teil({ oben: true, id: "suessigkeiten", de: "die Süßigkeiten", syl: "SÜS-sig-kei-ten", it: "i dolci", itSyl: "DOL-ci", en: "sweets", x: schale[0], y: schale[1], kunst: k,
    tipp: "Bonbons, Lutscher und Schokolade – für jedes Kind eine Handvoll." });
}

/* =====================================================================
   5 — GIRLANDE, SPINNENNETZ, SPINNE, GESPENST
   ===================================================================== */
{
  let k = `<path d="M-38 0 Q-19 8 0 0 Q19 8 38 0" stroke="#1a1a1e" stroke-width=".4" fill="none"/>`;
  const fled = (x, y, s) => `<g transform="translate(${r(x)} ${r(y)}) scale(${s})"><path d="M0 0 Q-2 -2.4 -4.6 -2.2 Q-6 -3.6 -8.6 -3 Q-8 -1.6 -9 -.4 Q-7 -.8 -6 .6 Q-4.6 -.2 -3.4 1.2 Q-1.6 .4 0 1.4 Q1.6 .4 3.4 1.2 Q4.6 -.2 6 .6 Q7 -.8 9 -.4 Q8 -1.6 8.6 -3 Q6 -3.6 4.6 -2.2 Q2 -2.4 0 0 Z" fill="#141018"/><circle cx="-.5" cy="-.6" r=".25" fill="#ffd27a"/><circle cx=".5" cy="-.6" r=".25" fill="#ffd27a"/></g>`;
  for (const t of [-0.84, -0.5, -0.16, 0.16, 0.5, 0.84]) {
    const x = t * 38, y = 4 * (1 - Math.pow((Math.abs(x) % 19) / 9.5 - 1, 2)) + 3;
    k += `<line x1="${r(x)}" y1="${r(y - 3)}" x2="${r(x)}" y2="${r(y - 0.6)}" stroke="#1a1a1e" stroke-width=".25"/>` + fled(x, y, 0.62);
  }
  S.teil({ id: "girlande", de: "die Girlande", syl: "gir-LAN-de", it: "la ghirlanda", itSyl: "ghir-LAN-da", en: "garland", x: 200, y: TUER.y0 - 15, kunst: k,
    tipp: "Eine Girlande mit Fledermäusen aus Papier." });
}
{
  let k = "";
  const cx = 0, cy = 0;
  for (let i = 0; i <= 6; i++) { const a = Math.PI / 2 + i * Math.PI / 12; k += `<line x1="${cx}" y1="${cy}" x2="${r(cx - Math.cos(a) * 20)}" y2="${r(cy + Math.sin(a) * 20)}" stroke="#e8e8f0" stroke-width=".25" opacity=".8"/>`; }
  for (let ring = 3; ring <= 19; ring += 3.2) {
    let d = "";
    for (let i = 0; i <= 6; i++) { const a = Math.PI / 2 + i * Math.PI / 12, rr = ring * (i % 2 ? 0.92 : 1); d += `${i ? " L" : "M"}${r(cx - Math.cos(a) * rr)} ${r(cy + Math.sin(a) * rr)}`; }
    k += `<path d="${d}" stroke="#e8e8f0" stroke-width=".22" fill="none" opacity=".75"/>`;
  }
  k += flaeche(-20, 0, 20, 20);
  S.teil({ oben: true, id: "spinnennetz", de: "das Spinnennetz", syl: "SPIN-nen-netz", it: "la ragnatela", itSyl: "ra-gna-TE-la", en: "spider web", x: TUER.x1 + 5, y: TUER.y0 - 12, kunst: k });
}
{
  let k = `<line x1="0" y1="-12" x2="0" y2="-2.4" stroke="#ddd" stroke-width=".2"/>`;
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) k += `<path d="M0 0 q${s * (2 + i * 0.4)} ${-2 + i * 1.2} ${s * (3.6 + i * 0.3)} ${-0.4 + i * 1.6}" stroke="#141018" stroke-width=".45" fill="none"/>`;
  k += `<ellipse cx="0" cy=".6" rx="2" ry="2.4" fill="#1a141e"/><circle cx="0" cy="-1.6" r="1.3" fill="#1a141e"/><circle cx="-.5" cy="-1.8" r=".35" fill="#fff"/><circle cx=".5" cy="-1.8" r=".35" fill="#fff"/><circle cx="-.45" cy="-1.75" r=".15" fill="#000"/><circle cx=".55" cy="-1.75" r=".15" fill="#000"/>`;
  S.teil({ oben: true, id: "spinne", de: "die Spinne", syl: "SPIN-ne", it: "il ragno", itSyl: "RA-gno", en: "spider", x: TUER.x1 - 2, y: TUER.y0 + 4, kunst: k,
    tipp: "Eine Spinne aus Plüsch – sie hat acht Beine." });
}
{
  /* DAS GESPENST: Stoffgespenst hängt am Vordach, freundliches Gesicht */
  let k = `<line x1="0" y1="-6" x2="0" y2="0" stroke="#ccc" stroke-width=".25"/>`;
  k += `<path d="M-6 8 Q-6.6 -1 0 -1 Q6.6 -1 6 8 Q7 14 8 19 Q5.6 17.6 4.4 19.6 Q2.6 17.6 1 19.8 Q-.6 17.6 -2.4 19.6 Q-4 17.4 -5.8 19.4 Q-6 14 -6 8 Z" fill="${S.lg("geist", [[0, "#ffffff"], [1, "#d6dae8"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="-2.2" cy="5" rx="1" ry="1.5" fill="#1a1a22"/><ellipse cx="2.2" cy="5" rx="1" ry="1.5" fill="#1a1a22"/><ellipse cx="0" cy="9" rx="1.4" ry="1.6" fill="#1a1a22"/><circle cx="-1.9" cy="4.4" r=".3" fill="#fff"/><circle cx="2.5" cy="4.4" r=".3" fill="#fff"/>`;
  k += `<path d="M-5 11 q-4 2 -5 0 M5 11 q4 2 5 0" stroke="#f2f2f8" stroke-width="2" stroke-linecap="round" fill="none"/>`;
  S.teil({ oben: true, id: "geist", de: "das Gespenst", syl: "Ge-SPENST", it: "il fantasma", itSyl: "fan-TA-sma", en: "ghost", x: TUER.x0 - 12, y: TUER.y0 - 15, kunst: k,
    tipp: "Ein Gespenst aus einem weißen Tuch – es sagt „Huuuh!“" });
}

/* =====================================================================
   6 — DIE TREPPE mit Fußmatte, Kürbissen, Kürbislaterne, Kerze
   ===================================================================== */
const STUFEN = [[SOCKEL, 148, 168, 232], [148, 157, 162, 238], [157, 168, 156, 244]];   // [oben, unten, x0, x1]
{
  let k = "";
  for (const [y0, y1, x0, x1] of STUFEN) {
    k += `<rect x="${x0 - 200}" y="${y0 - 168}" width="${x1 - x0}" height="2.4" fill="#b8b2a8"/><rect x="${x0 - 200}" y="${y0 + 2.4 - 168}" width="${x1 - x0}" height="${y1 - y0 - 2.4}" fill="${STEIN}"/>`;
    k += `<rect x="${x0 - 200}" y="${y0 - 168}" width="${x1 - x0}" height=".6" fill="#e2ddd4" opacity=".6"/>`;
  }
  k += `<rect x="-38" y="${SOCKEL - 168}" width="76" height="${168 - SOCKEL}" fill="#000" opacity=".08"/>`;
  S.teil({ id: "treppe", de: "die Treppe", syl: "TREP-pe", it: "la scala", itSyl: "SCA-la", en: "steps", x: 200, y: 168, kunst: k });
}
{
  let k = `<path d="M-11 0 L11 0 L12 2.4 L-12 2.4 Z" fill="#5a4630"/>`;
  for (let x = -10; x < 11; x += 1.2) k += `<line x1="${x}" y1=".2" x2="${r(x * 1.08)}" y2="2.2" stroke="#3e2e1c" stroke-width=".3"/>`;
  k += `<text x="0" y="1.9" font-size="1.6" text-anchor="middle" fill="#e8c27a" font-family="Georgia,serif" font-weight="bold">HALLO</text>`;
  S.teil({ oben: true, id: "fussmatte", de: "die Fußmatte", syl: "FUSS-mat-te", it: "lo zerbino", itSyl: "zer-BI-no", en: "doormat", x: 200, y: SOCKEL, kunst: k });
}
const kuerbis = (w, h, gedreht = 0) => {
  let g = "";
  const rippen = 5;
  for (let i = 0; i < rippen; i++) {
    const t = (i - (rippen - 1) / 2) / ((rippen - 1) / 2), rx = w / 2 * (1 - Math.abs(t) * 0.45);
    g += `<ellipse cx="${r(t * w * 0.3)}" cy="${r(-h / 2)}" rx="${r(rx * 0.62)}" ry="${r(h / 2)}" fill="${KUERBIS}" stroke="#a8460a" stroke-width=".25"/>`;
  }
  g += `<path d="M0 ${r(-h + 0.6)} q.4 -2.4 ${r(1.6 + gedreht)} -3" stroke="#4a5a22" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  g += `<ellipse cx="${r(-w * 0.2)}" cy="${r(-h * 0.7)}" rx="${r(w * 0.1)}" ry="${r(h * 0.12)}" fill="#fff" opacity=".22"/>`;
  return g;
};
{
  /* DER KÜRBIS: zwei ganze Kürbisse links auf den Stufen, dazu ein heller Zierkürbis */
  let k = schatten(0, 0.3, 12, 1.2, .35) + `<g transform="translate(-4 0)">${kuerbis(14, 10)}</g><g transform="translate(6 -9)">${kuerbis(10, 8, 0.6)}</g>`;
  k += `<g transform="translate(7.4 0)"><ellipse cx="0" cy="-2.6" rx="3.4" ry="2.6" fill="${S.rg("zier", [[0, "#fffbe8"], [1, "#d8cfa8"]], 0.4, 0.35, 0.8)}"/><path d="M0 -5 q.3 -1.2 1 -1.4" stroke="#4a5a22" stroke-width=".7" fill="none"/></g>`;
  S.teil({ id: "kuerbis", de: "der Kürbis", syl: "KÜR-bis", it: "la zucca", itSyl: "ZUC-ca", en: "pumpkin", x: 172, y: 157, kunst: k,
    tipp: "Im Herbst gibt es Kürbisse in allen Größen." });
}
{
  /* DIE KÜRBISLATERNE: geschnitzt, mit Teelicht, freundliches Gesicht */
  let k = `<circle cx="0" cy="-8" r="18" fill="${GLUT}" opacity=".55"/>` + schatten(0, 0.3, 10, 1.2, .35) + kuerbis(20, 15);
  /* geschnitzt: dunkler Schnittrand, dahinter das Licht des Teelichts */
  const loch = (d) => `<path d="${d}" fill="#4a1800"/><path d="${d}" fill="${INNENGLUT}" transform="translate(.25 .35) scale(.94)"/>`;
  k += loch("M-6.4 -10.4 L-2.4 -10.4 L-4.4 -14 Z") + loch("M2.4 -10.4 L6.4 -10.4 L4.4 -14 Z") + loch("M-1 -8.6 L1 -8.6 L0 -7 Z");
  k += loch("M-7 -5.8 Q0 .2 7 -5.8 L5.4 -4.6 L4.8 -5.8 L3.4 -3.6 L2.2 -4.6 L1.1 -3 L0 -4.2 L-1.1 -3 L-2.2 -4.6 L-3.4 -3.6 L-4.8 -5.8 L-5.4 -4.6 Z");
  S.teil({ id: "laterne", de: "die Kürbislaterne", syl: "KÜR-bis-la-ter-ne", it: "la lanterna di zucca", itSyl: "lan-TER-na di ZUC-ca", en: "jack-o'-lantern", x: 230, y: 157, kunst: k,
    tipp: "Der Kürbis wird ausgehöhlt, ein Gesicht hineingeschnitzt und ein Teelicht hineingestellt." });
}
{
  /* DIE KERZE im Windlicht (unterste Stufe rechts) */
  let k = `<circle cx="0" cy="-6" r="9" fill="${GLUT}" opacity=".5"/>` + schatten(0, 0.2, 4, .7, .3);
  k += `<rect x="-3" y="-1" width="6" height="1" fill="#1e1e22"/><rect x="-2.6" y="-10" width="5.2" height="9" fill="#e8f0f4" opacity=".35"/><path d="M-2.6 -10 L-2.6 -1 M2.6 -10 L2.6 -1" stroke="#1e1e22" stroke-width=".5"/><path d="M-3.2 -10 L3.2 -10 L0 -12.6 Z" fill="#1e1e22"/><path d="M0 -12.6 v-1.4" stroke="#1e1e22" stroke-width=".4"/>`;
  k += `<rect x="-1.2" y="-5.6" width="2.4" height="4.6" fill="#f6efe0"/><path d="M0 -8.6 q.9 1.4 0 2.6 q-.9 -1.2 0 -2.6 Z" fill="#ffd56a"/>`;
  S.teil({ id: "kerze", de: "die Kerze", syl: "KER-ze", it: "la candela", itSyl: "can-DE-la", en: "candle", x: 242, y: 168, kunst: k });
}
{
  /* DAS LAUB: Haufen Herbstblätter am Wegrand */
  let k = schatten(0, 0.3, 16, 1.6, .3) + `<path d="M-16 0 Q-10 -9 0 -9.6 Q10 -9 16 0 Z" fill="#6a3a1a"/>`;
  const farben = ["#d8641a", "#b83a1a", "#e8a02a", "#8a4a1a", "#c87a2a"];
  for (let i = 0; i < 46; i++) {
    const t = rnd() * 2 - 1, x = t * 15, y = -rnd() * 8.4 * (1 - t * t) - 0.4;
    k += `<path d="M${r(x)} ${r(y)} q1.2 -1.4 2.4 0 q-1.2 1.4 -2.4 0 Z" fill="${farben[i % 5]}" transform="rotate(${Math.round(rnd() * 360)} ${r(x + 1.2)} ${r(y)})"/>`;
  }
  S.teil({ id: "laub", de: "das Laub", syl: "LAUB", it: "le foglie secche", itSyl: "FO-glie SEC-che", en: "fallen leaves", x: 60, y: 186, kunst: k,
    tipp: "Im Herbst fallen die Blätter von den Bäumen." });
}

/* =====================================================================
   7 — DAS KIND IM KOSTÜM (kleine Hexe) mit HEXENHUT und BESEN
   ===================================================================== */
{
  const X = 146, Y = 184;
  const m = figur({ id: "hw_kind", geschlecht: "w", alter: "kind", pose: "halten", blick: 45, frisur: "lang", haarfarbe: "schwarz", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#5a2a7a" }, unterteil: { stueck: "rock", farbe: "#2a2a30" }, jacke: { stueck: "mantel", farbe: "#1e1a24" }, schuhe: { stueck: "stiefel", farbe: "schwarz" } } }, 58);
  const [oben, unten] = haende(m);
  /* Beutel für die Süßigkeiten in der erhobenen Hand */
  const beutel = `<g transform="translate(${r(oben[0])} ${r(oben[1])})"><path d="M-2.6 0 L2.6 0 L3.4 7 Q0 8.4 -3.4 7 Z" fill="#e8741a"/><path d="M-1.2 0 q1.2 -2.4 2.4 0" stroke="#e8741a" stroke-width=".5" fill="none"/><path d="M-1.6 3 l.8 -.8 l.8 .8 M.6 3 l.8 -.8 l.8 .8 M-1.4 5 q1.4 1 2.8 0" stroke="#2a1a10" stroke-width=".4" fill="none"/></g>`;
  S.teil({ id: "kind", de: "das Kind im Kostüm", syl: "KIND im Kos-TÜM", it: "il bambino in costume", itSyl: "bam-BI-no in co-STU-me", en: "child in costume", x: X, y: Y, kunst: schatten(0, 0, 9, 1.3, .35) + m.svg + beutel,
    tipp: "Sie ist als kleine Hexe verkleidet und ruft: „Süßes oder Saures!“" });
  /* DER HEXENHUT auf dem Kopf */
  const kopf = m.z.kopf || {};
  const kx = (kopf.x != null ? kopf.x : (kopf[0] || 0)) * m.k, ky = (kopf.y != null ? kopf.y : (kopf[1] || -150)) * m.k;
  const ko = m.z.box ? (m.z.box.y0 + 6) * m.k : ky - 6;
  let h = `<ellipse cx="0" cy="0" rx="8" ry="1.8" fill="#1e1a24"/><path d="M-4.4 -.6 L-1 -12 Q.6 -15 3.4 -14.6 Q1.6 -13.4 1.4 -11 L4.4 -.6 Z" fill="${S.lg("hut", [[0, "#3a2a4a"], [1, "#1a1424"]], 0, 0, 1, 0)}"/>`;
  h += `<path d="M-4.3 -1.4 L4.3 -1.4 L4 -3 L-4 -3 Z" fill="#e8741a"/><rect x="-1" y="-3.2" width="2" height="2" fill="none" stroke="#f2d23a" stroke-width=".5"/>`;
  S.teil({ oben: true, id: "hexenhut", de: "der Hexenhut", syl: "HE-xen-hut", it: "il cappello da strega", itSyl: "cap-PEL-lo da STRE-ga", en: "witch's hat", x: X + kx, y: Y + ko, kunst: h });
  /* DER BESEN in der anderen Hand, schräg auf dem Boden */
  const bx = X + unten[0], by = Y + unten[1];
  const fx = X + unten[0] + 9, fy = Y - 0.6;
  let b = `<line x1="${r(bx - fx - 3)}" y1="${r(by - fy - 10)}" x2="0" y2="-3" stroke="#8b6a43" stroke-width="1"/>`;
  b += `<path d="M-1.6 -3.6 L1.6 -2.4 L5 1 L-4 1 Z" fill="${S.lg("reisig", [[0, "#c9a45a"], [1, "#8b6a33"]])}"/><path d="M-1.6 -3 L1.4 -2" stroke="#7a1d20" stroke-width=".7"/>`;
  for (let i = 0; i < 6; i++) b += `<line x1="${r(-0.6 + i * 0.4)}" y1="-2.6" x2="${r(-3.6 + i * 1.6)}" y2=".9" stroke="#7a5a2a" stroke-width=".2"/>`;
  S.teil({ oben: true, id: "besen", de: "der Besen", syl: "BE-sen", it: "la scopa", itSyl: "SCO-pa", en: "broom", x: fx, y: fy, kunst: b,
    tipp: "Auf dem Besen fliegt die Hexe – im Märchen." });
}

/* Abendlicht: Kälte vom Himmel, Wärme an der Tür (fängt keinen Tipp) */
S.davor(`<g pointer-events="none"><rect width="320" height="200" fill="${S.rg("vignette", [[0.6, "#000", 0], [1, "#05030f", 0.45]], 0.55, 0.5, 0.75)}"/></g>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/halloween.js"));
console.log(aus);
