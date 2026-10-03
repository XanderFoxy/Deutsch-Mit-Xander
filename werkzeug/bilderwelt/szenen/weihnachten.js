#!/usr/bin/env node
/* =====================================================================
   WEIHNACHTEN (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar.

   RECHERCHE (Goethe-Institut „Weihnachten in Deutschland“, Erzgebirgische
   Volkskunst, Brauchtum zum Heiligabend) — so sieht ein deutsches
   Wohnzimmer am Heiligabend (24. Dezember, abends) aus:
   - Der TANNENBAUM (meist Nordmanntanne) steht im Christbaumständer,
     geschmückt mit roten, goldenen und silbernen KUGELN, LAMETTA,
     STROHSTERNEN, einer warmweißen LICHTERKETTE und oben der gläsernen
     CHRISTBAUMSPITZE. Die GESCHENKE liegen unter dem Baum („Bescherung“).
   - Aus dem ERZGEBIRGE: der SCHWIBBOGEN (Lichterbogen) im Fenster, die
     WEIHNACHTSPYRAMIDE, NUSSKNACKER und RÄUCHERMÄNNCHEN auf der Anrichte;
     dazu die KRIPPE mit Stall, Maria, Josef und dem Kind.
   - Im Fenster hängt ein leuchtender HERRNHUTER STERN.
   - Auf dem Couchtisch: der ADVENTSKRANZ (an Heiligabend brennen alle vier
     Kerzen), der PLÄTZCHENTELLER (Vanillekipferl, Zimtsterne,
     Butterplätzchen), der STOLLEN mit Puderzucker, LEBKUCHEN, ein
     SCHOKOLADEN-WEIHNACHTSMANN und Glühwein.
   - Der ADVENTSKALENDER an der Wand: alle 24 Türchen sind offen.
   Maßstab: Rückwand ≈ 40 Einheiten je Meter (Raumhöhe 2,6 m), Sofa ≈ 46,
   Couchtisch vorne ≈ 60 je Meter. Augenhöhe y ≈ 40.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "weihnachten", titel: "Weihnachten", emoji: "🎄", thema: "Feste", kuerzel: "wn", fassung: 852 });
const rnd = zufall(2412);
const r = B.r;

/* Figuren schlanker (wie Elternabend): Koordinaten auf halbe Zentimeter */
const h2 = (n) => String(Math.round(parseFloat(n)));   /* ganze Zentimeter: bei k ≈ 0,4–0,5 unter einem Bildpunkt */
const schlank = (svg) => svg.replace(/( d=")([^"]*)"/g, (a, b, c) => b + c.replace(/-?\d*\.\d+/g, h2) + '"')
  .replace(/ (cx|cy|x1|y1|x2|y2|x|y)="(-?\d*\.\d+)"/g, (a, b, c) => ` ${b}="${h2(c)}"`)
  .replace(/ (r|rx|ry|width|height)="(\d*\.\d+)"/g, (a, b, c) => ` ${b}="${parseFloat(c) < 1.5 ? c : h2(c)}"`);
const figur = (spec, hoehe) => { const m = B.mensch(spec, hoehe); return { svg: `<g transform="scale(${m.k.toFixed(4)})">${schlank(m.z.svg)}</g>`, k: m.k, z: m.z }; };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const HOLZ = S.lg("holz", [[0, "#9a6538"], [0.5, "#83532c"], [1, "#6a4121"]]);
const HOLZ_V = S.lg("holzv", [[0, "#7a4b27"], [0.5, "#99643a"], [1, "#734624"]], 0, 0, 1, 0);
const HELLHOLZ = S.lg("hellholz", [[0, "#e2c79a"], [1, "#c29a62"]]);
const NADEL = S.lg("nadel", [[0, "#0d2a1a"], [0.45, "#1b4a2c"], [1, "#2f6e3e"]]);
const GOLD = S.rg("gold", [[0, "#fff4c2"], [0.35, "#e9bf4a"], [1, "#8a5f12"]], 0.35, 0.3, 0.75);
const ROT = S.rg("rot", [[0, "#ff9a8a"], [0.35, "#d0202a"], [1, "#5e0a10"]], 0.35, 0.3, 0.75);
const SILBER = S.rg("silber", [[0, "#ffffff"], [0.4, "#c9d0d6"], [1, "#56606a"]], 0.35, 0.3, 0.75);
const FLAMME = S.rg("flamme", [[0, "#fffbe0"], [0.5, "#ffd56a"], [1, "#ff8a1e", 0]], 0.5, 0.65, 0.6);
const GLUT = S.rg("glut", [[0, "#ffe7a0", 0.75], [1, "#ffc860", 0]]);
const KERZE = S.lg("kerze", [[0, "#8e1018"], [0.45, "#d32a2f"], [1, "#7c0d14"]], 0, 0, 1, 0);
const KUPPE = S.rg("kuppe", [[0, "#fff"], [1, "#fff", 0]]);

/* kleine Flamme mit Lichthof (Kerzen, Schwibbogen) */
const flamme = (x, y, s = 1) => `<circle cx="${r(x)}" cy="${r(y - 1 * s)}" r="${r(3.2 * s)}" fill="${GLUT}"/><path d="M${r(x)} ${r(y - 2.6 * s)} q${r(0.9 * s)} ${r(1.4 * s)} 0 ${r(2.6 * s)} q${r(-0.9 * s)} ${r(-1.2 * s)} 0 ${r(-2.6 * s)} Z" fill="${FLAMME}"/>`;

/* =====================================================================
   KULISSE — Decke mit Stuck, Tapete, Dielenboden, Teppich
   ===================================================================== */
const WAND_UNTEN = 123;
S.hinten(`<rect x="0" y="0" width="320" height="16" fill="${S.lg("decke", [[0, "#d9cbb4"], [1, "#efe3cd"]])}"/>`);
S.hinten(`<rect x="0" y="14" width="320" height="4" fill="${S.lg("stuck", [[0, "#fbf4e6"], [0.5, "#e6d8bf"], [1, "#cdbb9c"]])}"/><rect x="0" y="18" width="320" height=".8" fill="#b9a585"/>`);
S.def(`<pattern id="${S.id("tapete")}" width="12" height="16" patternUnits="userSpaceOnUse"><rect width="12" height="16" fill="#e7d3ad"/><rect x="0" width="5" height="16" fill="#ead8b5"/><path d="M8.5 3 q1.2 1.6 0 3.2 q-1.2 -1.6 0 -3.2 Z M8.5 11 q1.2 1.6 0 3.2 q-1.2 -1.6 0 -3.2 Z" fill="#d7bf93" opacity=".7"/></pattern>`);
S.hinten(`<rect x="0" y="18.8" width="320" height="${WAND_UNTEN - 18.8}" fill="url(#${S.id("tapete")})"/>`);
/* warmes Abendlicht: die Wand ist um den Baum hell, an den Rändern dunkler */
S.hinten(`<rect x="0" y="18.8" width="320" height="${WAND_UNTEN - 18.8}" fill="${S.rg("wandlicht", [[0, "#fff1c8", 0.4], [0.6, "#fff1c8", 0], [1, "#2a1606", 0.35]], 0.45, 0.55, 0.75)}"/>`);
/* Bild über dem Sofa (Winterlandschaft in Goldrahmen) */
S.hinten(`<rect x="254" y="34" width="46" height="32" rx=".8" fill="${S.lg("rahmen", [[0, "#e8c870"], [0.5, "#b88a2e"], [1, "#7e5a18"]], 0, 0, 1, 1)}"/><rect x="257" y="37" width="40" height="26" fill="${S.lg("bildhim", [[0, "#9db7cc"], [1, "#e9eef0"]])}"/><path d="M257 55 L268 46 L276 52 L285 43 L297 53 L297 63 L257 63 Z" fill="#f5f7f8"/><path d="M262 63 l3 -9 l3 9 Z M286 63 l2.6 -8 l2.6 8 Z" fill="#2f5a3d"/><rect x="274" y="56" width="7" height="5" fill="#8b4a2c"/><path d="M273 56 l4.5 -3.4 l4.5 3.4 Z" fill="#f5f7f8"/>`);
S.hinten(`<line x1="268" y1="34" x2="277" y2="24" stroke="#8a7350" stroke-width=".3"/><line x1="286" y1="34" x2="277" y2="24" stroke="#8a7350" stroke-width=".3"/>`);
/* Sockelleiste */
S.hinten(`<rect x="0" y="${WAND_UNTEN - 4}" width="320" height="4" fill="#f4eee2"/><rect x="0" y="${WAND_UNTEN - 4}" width="320" height=".7" fill="#fff"/>`);
/* Dielenboden (Eiche) in Flucht zum Punkt (160, 30) */
{
  let f = `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#7b5232"], [0.5, "#946640"], [1, "#a8774b"]])}"/>`;
  const VY = 30, flucht = (x0, y) => 160 + (x0 - 160) * (y - VY) / (WAND_UNTEN - VY);
  for (let x0 = -140; x0 <= 460; x0 += 7.5) {
    f += `<line x1="${r(x0)}" y1="${WAND_UNTEN}" x2="${r(flucht(x0, 200))}" y2="200" stroke="#5a3a22" stroke-width=".35" opacity=".7"/>`;
    /* Stoßfugen der Dielen */
    const y = WAND_UNTEN + 6 + rnd() * 70, a = flucht(x0, y), b = flucht(x0 + 7.5, y);
    f += `<line x1="${r(a)}" y1="${r(y)}" x2="${r(b)}" y2="${r(y)}" stroke="#5a3a22" stroke-width=".3" opacity=".6"/>`;
  }
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.rg("bodenlicht", [[0, "#ffd890", 0.35], [1, "#000", 0.25]], 0.42, 0.25, 0.8)}"/>`;
  /* Teppich unter dem Couchtisch (Orientteppich in Flucht) */
  const T = [[200, 150], [314, 150], [326, 198], [182, 198]];
  f += `<path d="M${T.map((p) => p.join(" ")).join(" L")} Z" fill="${S.lg("teppich", [[0, "#6e1d1f"], [1, "#8c2a26"]])}"/>`;
  f += `<path d="M204 153 L310 153 L320 195 L188 195 Z" fill="none" stroke="#d7b26a" stroke-width=".9"/><path d="M209 157 L305 157 L313 191 L195 191 Z" fill="none" stroke="#24305a" stroke-width="1.6"/>`;
  f += `<path d="M257 162 l16 10 l-16 10 l-16 -10 Z" fill="none" stroke="#d7b26a" stroke-width=".8"/><path d="M257 167 l8 5 l-8 5 l-8 -5 Z" fill="#24305a"/>`;
  for (let x = 184; x < 326; x += 2.4) f += `<line x1="${r(x)}" y1="198" x2="${r(x)}" y2="200" stroke="#e8dcc0" stroke-width=".5"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DIE TÜR (offen, im Flur brennt Licht) und 2 — DIE MUTTER
   ===================================================================== */
{
  let k = `<rect x="-20" y="-84" width="40" height="84" fill="#f4efe4"/>`;
  k += `<rect x="-17" y="-81" width="34" height="81" fill="${S.lg("flur", [[0, "#f6d99a"], [1, "#c69a5c"]])}"/>`;
  k += `<path d="M-17 -10 L17 -10 L17 0 L-17 0 Z" fill="#a0784c"/><rect x="6" y="-62" width="9" height="16" fill="#e9dcc0" stroke="#b89e72" stroke-width=".4"/>`;
  /* Türblatt nach innen aufgeschlagen, mit Kassetten und Klinke */
  k += `<path d="M-17 -81 L-6 -77 L-6 3 L-17 0 Z" fill="${S.lg("blatt", [[0, "#fbf8f1"], [1, "#d9d1c1"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-15.4 -75 L-8 -72.4 L-8 -45 L-15.4 -47 Z M-15.4 -40 L-8 -38.4 L-8 -6 L-15.4 -7.4 Z" fill="none" stroke="#c9bfab" stroke-width=".5"/>`;
  k += `<rect x="-8.6" y="-42" width="1.2" height="3.6" rx=".4" fill="#b9a06a"/>`;
  k += `<rect x="-20" y="-84" width="40" height="3" fill="#e4dccb"/><rect x="-20" y="-84" width="3" height="84" fill="#ebe4d6"/><rect x="17" y="-84" width="3" height="84" fill="#ebe4d6"/>`;
  S.teil({ id: "tuer", de: "die Tür", syl: "TÜR", it: "la porta", itSyl: "POR-ta", en: "door", x: 24, y: WAND_UNTEN, kunst: k });
}
{
  const m = figur({ id: "wn_mutter", geschlecht: "w", pose: "halten", blick: 30, frisur: "lang", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#8e1b24" }, unterteil: { stueck: "rock", farbe: "#2a2c33" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 68);
  const hand = [m.z.handL, m.z.handR].filter(Boolean).sort((a, b) => a.y - b.y)[0];
  const hx = (hand.x != null ? hand.x : hand[0]) * m.k, hy = (hand.y != null ? hand.y : hand[1]) * m.k;
  /* sie bringt noch einen Teller Plätzchen herein */
  let t = `<g transform="translate(${r(hx + 1)} ${r(hy - 0.6)})"><ellipse cx="0" cy="0" rx="5.4" ry="1.5" fill="#f7f4ee" stroke="#c9c0ae" stroke-width=".25"/>`;
  for (const [dx, f] of [[-2.6, "#e3b46a"], [0, "#f1e6c8"], [2.6, "#c98a45"], [-1.2, "#e9c27e"], [1.4, "#f1e6c8"]]) t += `<ellipse cx="${dx}" cy="${dx === -1.2 || dx === 1.4 ? -1.4 : -0.7}" rx="1.4" ry=".7" fill="${f}"/>`;
  t += `</g>`;
  S.teil({ id: "mutter", de: "die Mutter", syl: "MUT-ter", it: "la madre", itSyl: "MA-dre", en: "mother", x: 26, y: WAND_UNTEN + 0.5, kunst: m.svg + t,
    tipp: "Sie bringt die Plätzchen herein." });
}

/* =====================================================================
   3 — DAS FENSTER (Nacht, Schnee, Häuser gegenüber) mit Gardine
   ===================================================================== */
const FEN = { x0: 52, x1: 104, y0: 30, y1: 86 };
{
  const W = FEN.x1 - FEN.x0, H = FEN.y1 - FEN.y0, cx = (FEN.x0 + FEN.x1) / 2;
  let k = `<g transform="translate(${-cx} ${-FEN.y1})">`;
  k += `<rect x="${FEN.x0 - 3}" y="${FEN.y0 - 3}" width="${W + 6}" height="${H + 3}" fill="#f2ede3"/>`;
  k += `<rect x="${FEN.x0}" y="${FEN.y0}" width="${W}" height="${H}" fill="${S.lg("nacht", [[0, "#0b1530"], [0.7, "#1d2e55"], [1, "#2c3d64"]])}"/>`;
  /* Häuser gegenüber mit Schneedächern und hellen Fenstern */
  k += `<path d="M${FEN.x0} 70 L${FEN.x0 + 10} 60 L${FEN.x0 + 22} 70 L${FEN.x0 + 22} ${FEN.y1} L${FEN.x0} ${FEN.y1} Z" fill="#2a2f45"/><path d="M${FEN.x0} 70 L${FEN.x0 + 10} 60 L${FEN.x0 + 22} 70 L${FEN.x0 + 20} 71 L${FEN.x0 + 10} 62.6 L${FEN.x0} 71.4 Z" fill="#eef3fa"/>`;
  k += `<path d="M${FEN.x0 + 24} 66 L${FEN.x0 + 37} 56 L${FEN.x1} 64 L${FEN.x1} ${FEN.y1} L${FEN.x0 + 24} ${FEN.y1} Z" fill="#323a52"/><path d="M${FEN.x0 + 24} 66 L${FEN.x0 + 37} 56 L${FEN.x1} 64 L${FEN.x1} 66 L${FEN.x0 + 37} 58.6 L${FEN.x0 + 24} 67.6 Z" fill="#eef3fa"/>`;
  for (const [x, y] of [[FEN.x0 + 5, 74], [FEN.x0 + 13, 74], [FEN.x0 + 29, 71], [FEN.x0 + 41, 71], [FEN.x0 + 29, 79]]) k += `<rect x="${x}" y="${y}" width="4" height="4.4" fill="#ffd27a"/>`;
  k += `<rect x="${FEN.x0}" y="${FEN.y1 - 4}" width="${W}" height="4" fill="#e9eef6"/>`;
  for (let i = 0; i < 46; i++) k += `<circle cx="${r(FEN.x0 + rnd() * W)}" cy="${r(FEN.y0 + rnd() * (H - 4))}" r="${r(0.25 + rnd() * 0.35)}" fill="#fff" opacity="${r(0.5 + rnd() * 0.5)}"/>`;
  /* Glasspiegelung, Fensterflügel und Sprossen */
  k += `<path d="M${FEN.x0 + 2} ${FEN.y0 + 2} L${FEN.x0 + 14} ${FEN.y0 + 2} L${FEN.x0 + 2} ${FEN.y0 + 22} Z" fill="#fff" opacity=".09"/>`;
  k += `<rect x="${FEN.x0}" y="${FEN.y0}" width="${W}" height="${H}" fill="none" stroke="#f7f3ea" stroke-width="2.4"/>`;
  k += `<rect x="${cx - 1.4}" y="${FEN.y0}" width="2.8" height="${H}" fill="#f7f3ea"/><rect x="${FEN.x0}" y="${FEN.y0 + 16}" width="${W}" height="1.8" fill="#f7f3ea"/>`;
  k += `<rect x="${cx - 4}" y="${FEN.y0 + 34}" width="1.2" height="5" rx=".5" fill="#d8d2c4"/>`;
  /* Gardinen: zarter Store oben, schwere Schals links und rechts */
  k += `<path d="M${FEN.x0 - 2} ${FEN.y0 - 2} L${FEN.x1 + 2} ${FEN.y0 - 2} L${FEN.x1 + 2} ${FEN.y0 + 7} Q${cx} ${FEN.y0 + 12} ${FEN.x0 - 2} ${FEN.y0 + 7} Z" fill="#fffaf0" opacity=".55"/>`;
  for (const [a, b, s] of [[FEN.x0 - 9, FEN.x0 + 4, 1], [FEN.x1 - 4, FEN.x1 + 9, -1]]) {
    k += `<path d="M${a} ${FEN.y0 - 5} L${b} ${FEN.y0 - 5} Q${s > 0 ? b - 2 : a + 2} ${FEN.y0 + 30} ${s > 0 ? b - 4 : a + 4} ${FEN.y1 + 26} L${s > 0 ? a : b} ${FEN.y1 + 26} Z" fill="${S.lg("schal" + s, [[0, "#6b1a1e"], [0.5, "#9a2b2b"], [1, "#5c1518"]], 0, 0, 1, 0)}"/>`;
    for (let i = 1; i < 4; i++) k += `<path d="M${r(a + i * (b - a) / 4)} ${FEN.y0 - 4} q${s * 1} 30 ${s * -1} ${r(FEN.y1 - FEN.y0 + 28)}" stroke="#4a1013" stroke-width=".4" fill="none" opacity=".6"/>`;
  }
  k += `<rect x="${FEN.x0 - 12}" y="${FEN.y0 - 6.5}" width="${W + 24}" height="2" rx="1" fill="#b38b3e"/>`;
  /* Fensterbank */
  k += `<rect x="${FEN.x0 - 5}" y="${FEN.y1}" width="${W + 10}" height="2.2" fill="${S.lg("bank", [[0, "#fbf8f2"], [1, "#d4ccbc"]])}"/>`;
  k += `</g>`;
  S.teil({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: cx, y: FEN.y1, kunst: k });
}
/* Der Heizkörper unter dem Fenster */
{
  let k = `<rect x="-20" y="-24" width="40" height="22" rx="1" fill="${S.lg("heiz", [[0, "#fbfaf6"], [1, "#d8d3c8"]])}"/>`;
  for (let x = -18; x < 19; x += 2.6) k += `<rect x="${r(x)}" y="-23" width="1.2" height="20" rx=".5" fill="#e3ddd0"/>`;
  k += `<rect x="16" y="-26" width="2.4" height="3" rx=".6" fill="#dedad0"/><rect x="-17" y="-2" width="1.6" height="2" fill="#cfc8b8"/><rect x="15" y="-2" width="1.6" height="2" fill="#cfc8b8"/>`;
  S.teil({ id: "heizkoerper", de: "der Heizkörper", syl: "HEIZ-kör-per", it: "il termosifone", itSyl: "ter-mo-si-FO-ne", en: "radiator", x: 78, y: WAND_UNTEN - 3, kunst: k });
}
/* DER STERN — Herrnhuter Stern hängt leuchtend im Fenster */
{
  let k = `<line x1="0" y1="-18" x2="0" y2="-8" stroke="#ddd" stroke-width=".3"/>`;
  k += `<circle r="10" fill="${S.rg("sternlicht", [[0, "#fff4c8", 0.75], [1, "#ffd27a", 0]])}"/>`;
  const zacke = (a, l, f) => { const c = Math.cos(a), s = Math.sin(a), q = 1.6; return `<path d="M${r(-s * q)} ${r(c * q)} L${r(c * l)} ${r(s * l)} L${r(s * q)} ${r(-c * q)} Z" fill="${f}"/>`; };
  for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 + 0.2; k += zacke(a, 6.2, i % 2 ? "#fde9b8" : "#c8202a"); }
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + 0.5; k += zacke(a, 4.4, i % 2 ? "#fff7dc" : "#e23a3a"); }
  k += `<circle r="1.8" fill="#fff8de"/>`;
  S.teil({ oben: true, id: "stern", de: "der Stern", syl: "STERN", it: "la stella", itSyl: "STEL-la", en: "star", x: 78, y: 48, kunst: k,
    tipp: "Der Herrnhuter Stern kommt aus Sachsen. Er leuchtet im Advent in vielen Fenstern." });
}
/* DER SCHWIBBOGEN auf der Fensterbank */
{
  let k = schatten(0, 0.2, 13, .8, .3);
  k += `<rect x="-13" y="-2.4" width="26" height="2.4" rx=".4" fill="#3b2516"/>`;
  k += `<path d="M-12 -2.4 L-12 -6 A12 11 0 0 1 12 -6 L12 -2.4 Z" fill="none" stroke="#3b2516" stroke-width="1.6"/>`;
  /* Scherenschnitt: Bergleute mit Lampen, Kirche, Tannen */
  k += `<path d="M-9 -2.4 L-9 -7 L-7.6 -9 L-6.2 -7 L-6.2 -2.4 Z M-3.4 -2.4 L-3.4 -6.6 Q-2.6 -8.4 -1.8 -6.6 L-1.8 -2.4 Z M1 -2.4 L1 -7.6 L2.2 -7.6 L2.2 -10.6 L3 -12 L3.8 -10.6 L3.8 -7.6 L6 -7.6 L6 -2.4 Z M7.8 -2.4 L9.4 -7 L11 -2.4 Z" fill="#3b2516"/>`;
  k += `<circle cx="-2.6" cy="-8.4" r=".6" fill="#3b2516"/><circle cx="-7.6" cy="-9.6" r=".5" fill="#ffd56a"/>`;
  for (let i = 0; i < 7; i++) {
    const a = Math.PI * (1 - i / 6), x = Math.cos(a) * 12, y = -6 - Math.sin(a) * 11;
    k += `<rect x="${r(x - 0.5)}" y="${r(y - 2.8)}" width="1" height="2.8" fill="#f7f1e4"/>` + flamme(x, y - 2.8, 0.55);
  }
  S.teil({ oben: true, id: "schwibbogen", de: "der Schwibbogen", syl: "SCHWIB-bo-gen", it: "l'arco di candele", itSyl: "AR-co di can-DE-le", en: "candle arch", x: 78, y: FEN.y1, kunst: k,
    tipp: "Der Schwibbogen kommt aus dem Erzgebirge. Seine Lichter erinnern an die Bergleute." });
}
/* DER STIEFEL neben der Tür */
{
  let k = schatten(1, 0.2, 6, .9, .3);
  k += `<path d="M-3 0 L-3 -11 L2 -11 L2 -4 L6.4 -2.6 Q7.6 -1.6 7 0 Z" fill="${S.lg("leder", [[0, "#8a4b26"], [1, "#4f2812"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-3.4" y="-12" width="5.8" height="2" rx=".6" fill="#f2ece0"/><path d="M-3 -.8 L7 -.8" stroke="#2a160a" stroke-width=".8"/>`;
  k += `<circle cx="-1.2" cy="-13.4" r="1.9" fill="${S.rg("orange", [[0, "#ffc06a"], [1, "#d26a12"]], 0.35, 0.3, 0.8)}"/><path d="M.6 -12.6 l2 -4.4 l1 .3 l-2 4.4 Z" fill="#c12a2a"/><ellipse cx="1.6" cy="-12.2" rx="1.1" ry=".8" fill="#9a6a3c"/>`;
  S.teil({ id: "stiefel", de: "der Stiefel", syl: "STIE-fel", it: "lo stivale", itSyl: "sti-VA-le", en: "boot", x: 48, y: 128, kunst: k,
    tipp: "Am 6. Dezember stellen Kinder ihren Stiefel vor die Tür – der Nikolaus füllt ihn." });
}

/* =====================================================================
   4 — DER ADVENTSKALENDER an der Wand
   ===================================================================== */
{
  let k = `<line x1="0" y1="-25" x2="-8" y2="-20.6" stroke="#8a7350" stroke-width=".3"/><line x1="0" y1="-25" x2="8" y2="-20.6" stroke="#8a7350" stroke-width=".3"/><circle cy="-25" r=".6" fill="#777"/>`;
  k += `<rect x="-9" y="-21" width="18" height="24" rx=".6" fill="${S.lg("kalhim", [[0, "#183766"], [1, "#3c5f93"]])}"/>`;
  k += `<path d="M-9 -2 L-5 -6 L-1 -3 L3 -8 L9 -4 L9 3 L-9 3 Z" fill="#f2f5f8"/><path d="M-3 -8 l3.4 -3 l3.4 3 Z" fill="#a3322a"/><rect x="-2.6" y="-8" width="6" height="4" fill="#e9d4a8"/>`;
  k += `<text x="0" y="-16.6" font-size="2.6" text-anchor="middle" fill="#f6d77a" font-family="Georgia,serif" font-style="italic">Advent</text>`;
  for (let i = 0; i < 24; i++) {
    const x = -7.6 + (i % 6) * 2.6, y = -14 + Math.floor(i / 6) * 3.6;
    k += `<rect x="${r(x)}" y="${r(y)}" width="1.9" height="2.4" fill="#fbecc7" opacity=".9"/><rect x="${r(x - 0.9)}" y="${r(y)}" width=".9" height="2.4" fill="#c9a24b"/>`;
    k += `<text x="${r(x + 0.95)}" y="${r(y + 1.8)}" font-size="1.3" text-anchor="middle" fill="#7a2a20" font-family="Arial">${i + 1}</text>`;
  }
  k += `<path d="M-8.6 -20.6 L-3 -20.6 L-8.6 -12 Z" fill="#fff" opacity=".12"/>`;
  S.teil({ id: "adventskalender", de: "der Adventskalender", syl: "Ad-VENTS-ka-len-der", it: "il calendario dell'Avvento", itSyl: "ca-len-DA-rio dell'av-VEN-to", en: "Advent calendar", x: 204, y: 56, kunst: k,
    tipp: "Vom 1. bis 24. Dezember öffnet man jeden Tag ein Türchen." });
}

/* =====================================================================
   5 — DIE ANRICHTE mit Krippe, Pyramide, Nussknacker, Räuchermännchen
   ===================================================================== */
const AN = { x: 204, y: WAND_UNTEN + 1, w: 60, h: 36 };
{
  const W = AN.w, H = AN.h, O = -H;
  let k = schatten(0, 0.3, W / 2 + 2, 1.4, .35);
  k += `<rect x="${-W / 2 + 2}" y="-3" width="2.4" height="3" fill="#3b2414"/><rect x="${W / 2 - 4.4}" y="-3" width="2.4" height="3" fill="#3b2414"/>`;
  k += `<rect x="${-W / 2}" y="${O + 1.6}" width="${W}" height="${H - 4.6}" fill="${HOLZ_V}"/>`;
  k += `<rect x="${-W / 2 - 1.2}" y="${O}" width="${W + 2.4}" height="2.4" rx=".6" fill="${S.lg("anplatte", [[0, "#b07a48"], [1, "#6e4424"]])}"/>`;
  /* oben zwei Schubladen, unten zwei Türen mit Füllung und Messingknöpfen */
  for (const s of [-1, 1]) {
    const x = s < 0 ? -W / 2 + 2 : 1;
    k += `<rect x="${x}" y="${O + 4}" width="${W / 2 - 3}" height="7" rx=".5" fill="${HOLZ}" stroke="#4a2c16" stroke-width=".35"/><ellipse cx="${r(x + W / 4 - 1.5)}" cy="${O + 7.5}" rx="1.4" ry=".9" fill="${GOLD}"/>`;
    k += `<rect x="${x}" y="${O + 12.6}" width="${W / 2 - 3}" height="${H - 18}" rx=".5" fill="${HOLZ}" stroke="#4a2c16" stroke-width=".35"/><rect x="${x + 2}" y="${O + 14.6}" width="${W / 2 - 7}" height="${H - 22}" rx=".8" fill="none" stroke="#5a361a" stroke-width=".5"/>`;
    k += `<circle cx="${s < 0 ? -2.4 : 2.4}" cy="${O + 21}" r=".8" fill="${GOLD}"/>`;
  }
  k += `<rect x="${-W / 2}" y="${O + 2.4}" width="${W}" height="1" fill="#2c1a0c" opacity=".35"/>`;
  /* Tischläufer mit Goldborte */
  k += `<path d="M-24 ${O + 0.2} L24 ${O + 0.2} L24 ${O + 6} L22 ${O + 8} L20 ${O + 6} L20 ${O + 2.4} L-20 ${O + 2.4} L-20 ${O + 6} L-22 ${O + 8} L-24 ${O + 6} Z" fill="#9a1f25"/><path d="M-24 ${O + 1.6} L24 ${O + 1.6}" stroke="#e1b95a" stroke-width=".3"/>`;

  const unter = [];
  const aufAnrichte = (lx) => [AN.x + lx, AN.y + O];
  /* DIE WEIHNACHTSKRIPPE: Holzstall mit Moos, Maria, Josef, Kind, Ochs und Esel */
  {
    const x = -17, y = O;
    let g = `<path d="M${x - 10} ${y} L${x + 10} ${y} L${x + 10} ${y - 1.2} L${x - 10} ${y - 1.2} Z" fill="#5e7a34"/>`;
    g += `<rect x="${x - 8.6}" y="${y - 11}" width="1.2" height="10" fill="#6b4422"/><rect x="${x + 7.4}" y="${y - 11}" width="1.2" height="10" fill="#6b4422"/>`;
    g += `<rect x="${x - 8}" y="${y - 10.6}" width="16" height="9.6" fill="#3a2414"/>`;
    for (let i = 0; i < 6; i++) g += `<rect x="${r(x - 8 + i * 2.7)}" y="${y - 10.6}" width="2.4" height="9.6" fill="${i % 2 ? "#4a2e18" : "#553520"}"/>`;
    g += `<path d="M${x - 11} ${y - 10} L${x} ${y - 15.4} L${x + 11} ${y - 10} L${x + 10} ${y - 9} L${x} ${y - 14} L${x - 10} ${y - 9} Z" fill="#8a5a2e"/>`;
    g += `<path d="M${x - 0.8} ${y - 18} l.8 -2 l.8 2 l2 .1 l-1.6 1.2 l.6 2 l-1.8 -1.2 l-1.8 1.2 l.6 -2 l-1.6 -1.2 Z" fill="#f2c94c"/>`;
    g += `<circle cx="${x}" cy="${y - 7}" r="5" fill="#ffd98a" opacity=".22"/>`;
    /* Maria (blau), Josef (braun mit Stab), Krippe mit Kind */
    g += `<path d="M${x - 5.4} ${y - 1.2} L${x - 4.4} ${y - 6} Q${x - 3.6} ${y - 7.8} ${x - 2.8} ${y - 6} L${x - 1.8} ${y - 1.2} Z" fill="#2f5fa8"/><circle cx="${x - 3.6}" cy="${y - 7.4}" r="1" fill="#f0c9a0"/><path d="M${x - 4.8} ${y - 7.2} q1.2 -2.2 2.4 0 l0 2 l-2.4 0 Z" fill="#2f5fa8" opacity=".9"/>`;
    g += `<path d="M${x + 2} ${y - 1.2} L${x + 2.8} ${y - 7} Q${x + 3.8} ${y - 8.6} ${x + 4.8} ${y - 7} L${x + 5.6} ${y - 1.2} Z" fill="#7a4a26"/><circle cx="${x + 3.8}" cy="${y - 8}" r="1" fill="#e9bf92"/><path d="M${x + 3.2} ${y - 7.4} q.6 1.2 1.2 0" fill="#ddd" /><line x1="${x + 6.4}" y1="${y - 10}" x2="${x + 6.4}" y2="${y - 1.2}" stroke="#a87a44" stroke-width=".4"/>`;
    g += `<path d="M${x - 1.8} ${y - 3.4} L${x + 1.8} ${y - 3.4} L${x + 1.2} ${y - 1.2} L${x - 1.2} ${y - 1.2} Z" fill="#a8783e"/><path d="M${x - 1.8} ${y - 3.4} q1.8 -.9 3.6 0" fill="#e8cf7a"/><circle cx="${x - 0.2}" cy="${y - 3.8}" r=".6" fill="#f3d0a6"/>`;
    g += `<path d="M${x - 8} ${y - 1.2} q.6 -2.6 2 -2.4 l.4 2.4 Z" fill="#8a8580"/><path d="M${x + 6.4} ${y - 1.2} q.4 -2.8 2 -2.6 l-.2 2.6 Z" fill="#6d5641"/>`;
    k += g;
    const [ax, ay] = aufAnrichte(x);
    unter.push({ id: "krippe", de: "die Weihnachtskrippe", syl: "WEIH-nachts-krip-pe", it: "il presepe", itSyl: "pre-SE-pe", en: "nativity scene", x: ax, y: ay, kunst: flaeche(-10.5, -16, 21, 16),
      tipp: "In der Krippe liegt das Jesuskind, daneben Maria und Josef." });
  }
  /* DIE WEIHNACHTSPYRAMIDE: zwei Etagen, Flügelrad, vier Kerzen */
  {
    const x = 1, y = O;
    let g = `<rect x="${x - 6}" y="${y - 1.4}" width="12" height="1.4" fill="#5a3418"/>`;
    g += `<rect x="${x - 5.4}" y="${y - 2}" width="10.8" height=".7" fill="#7b4a22"/><rect x="${x - 4}" y="${y - 9.6}" width="8" height=".7" fill="#7b4a22"/>`;
    for (const dx of [-5, 5]) g += `<line x1="${x + dx}" y1="${y - 1.4}" x2="${x + dx * 0.4}" y2="${y - 16}" stroke="#7b4a22" stroke-width=".55"/>`;
    g += `<line x1="${x}" y1="${y - 1.4}" x2="${x}" y2="${y - 17}" stroke="#b9925a" stroke-width=".4"/>`;
    /* Figuren: Engel, Hirten, Schafe */
    for (const [dx, f] of [[-3.4, "#f3efe4"], [-1, "#2f6a3e"], [1.6, "#9c3a26"], [3.8, "#f3efe4"]]) g += `<path d="M${x + dx - 0.7} ${y - 2} L${x + dx - 0.5} ${y - 4.8} L${x + dx + 0.5} ${y - 4.8} L${x + dx + 0.7} ${y - 2} Z" fill="${f}"/><circle cx="${x + dx}" cy="${y - 5.3}" r=".55" fill="#efc9a0"/>`;
    for (const [dx, f] of [[-2.4, "#f8f5ee"], [0, "#ead9b0"], [2.4, "#f8f5ee"]]) g += `<ellipse cx="${x + dx}" cy="${y - 11.2}" rx=".9" ry=".7" fill="${f}"/><circle cx="${x + dx + 0.8}" cy="${y - 11.7}" r=".35" fill="#333"/>`;
    /* Flügelrad oben */
    g += `<ellipse cx="${x}" cy="${y - 17}" rx="7" ry="1.1" fill="none" stroke="#d6b06a" stroke-width=".25"/>`;
    for (const dx of [-6, -3, 3, 6]) g += `<path d="M${x} ${y - 17} L${x + dx} ${y - 17.8} L${x + dx} ${y - 16.4} Z" fill="#c99a52"/>`;
    g += `<circle cx="${x}" cy="${y - 17.4}" r=".6" fill="${GOLD}"/>`;
    for (const dx of [-5.4, 5.4]) g += `<rect x="${x + dx - 0.4}" y="${y - 4.6}" width=".8" height="2.6" fill="#f7f1e4"/>` + flamme(x + dx, y - 4.6, 0.45);
    k += g;
    const [ax, ay] = aufAnrichte(x);
    unter.push({ id: "pyramide", de: "die Weihnachtspyramide", syl: "WEIH-nachts-py-ra-mi-de", it: "la piramide di Natale", itSyl: "pi-RA-mi-de di na-TA-le", en: "Christmas pyramid", x: ax, y: ay, kunst: flaeche(-6.6, -19, 13.2, 19),
      tipp: "Die warme Luft der Kerzen dreht das Flügelrad – und die Figuren drehen sich mit." });
  }
  /* DER NUSSKNACKER: König mit Krone, weißer Bart, roter Rock */
  {
    const x = 14, y = O;
    let g = `<rect x="${x - 2.6}" y="${y - 1.2}" width="5.2" height="1.2" fill="#2c1b10"/>`;
    g += `<rect x="${x - 1.7}" y="${y - 4.4}" width="1.4" height="3.2" fill="#f3efe4"/><rect x="${x + 0.3}" y="${y - 4.4}" width="1.4" height="3.2" fill="#f3efe4"/><rect x="${x - 1.9}" y="${y - 2}" width="1.8" height="1" fill="#111"/><rect x="${x + 0.1}" y="${y - 2}" width="1.8" height="1" fill="#111"/>`;
    g += `<path d="M${x - 2.2} ${y - 4.2} L${x - 1.8} ${y - 8.6} L${x + 1.8} ${y - 8.6} L${x + 2.2} ${y - 4.2} Z" fill="#c4202a"/><rect x="${x - 2.2}" y="${y - 5}" width="4.4" height=".7" fill="#111"/><circle cx="${x}" cy="${y - 6.4}" r=".3" fill="#f2c94c"/><circle cx="${x}" cy="${y - 7.6}" r=".3" fill="#f2c94c"/>`;
    g += `<rect x="${x - 2.9}" y="${y - 8.4}" width=".9" height="3.4" rx=".4" fill="#c4202a"/><rect x="${x + 2}" y="${y - 8.4}" width=".9" height="3.4" rx=".4" fill="#c4202a"/>`;
    g += `<rect x="${x - 1.5}" y="${y - 11.4}" width="3" height="2.8" rx=".5" fill="#f0c9a0"/><path d="M${x - 1.6} ${y - 10} Q${x} ${y - 7.2} ${x + 1.6} ${y - 10} L${x + 1.6} ${y - 9.2} L${x - 1.6} ${y - 9.2} Z" fill="#f8f6f0"/><rect x="${x - 1}" y="${y - 9.6}" width="2" height=".5" fill="#fff"/>`;
    g += `<circle cx="${x - 0.6}" cy="${y - 10.6}" r=".22" fill="#111"/><circle cx="${x + 0.6}" cy="${y - 10.6}" r=".22" fill="#111"/>`;
    g += `<rect x="${x - 1.7}" y="${y - 14.4}" width="3.4" height="3.2" fill="#1c1c22"/><path d="M${x - 1.7} ${y - 14.4} l.6 -1 l.6 .8 l.5 -1 l.5 1 l.6 -.8 l.6 1 Z" fill="#e2b94e"/><rect x="${x - 1.7}" y="${y - 12}" width="3.4" height=".5" fill="#e2b94e"/>`;
    g += `<path d="M${x + 1.6} ${y - 8} l2.4 4.4" stroke="#8a5a2e" stroke-width=".6"/>`;
    k += g;
    const [ax, ay] = aufAnrichte(x);
    unter.push({ id: "nussknacker", de: "der Nussknacker", syl: "NUSS-kna-cker", it: "lo schiaccianoci", itSyl: "schiac-cia-NO-ci", en: "nutcracker", x: ax, y: ay, kunst: flaeche(-3.4, -15.6, 7, 15.6),
      tipp: "Drückt man den Hebel am Rücken, knackt er mit dem Mund eine Nuss." });
  }
  /* DAS RÄUCHERMÄNNCHEN: Pfeife, aus dem Mund steigt Rauch */
  {
    const x = 23, y = O;
    let g = `<ellipse cx="${x}" cy="${y - 0.5}" rx="2.4" ry=".6" fill="#3b2516"/>`;
    g += `<path d="M${x - 1.9} ${y - 0.6} L${x - 1.6} ${y - 5.6} L${x + 1.6} ${y - 5.6} L${x + 1.9} ${y - 0.6} Z" fill="#2f5d3a"/><rect x="${x - 1.6}" y="${y - 3.4}" width="3.2" height=".5" fill="#1d2a1f"/>`;
    g += `<circle cx="${x}" cy="${y - 6.6}" r="1.3" fill="#efc59a"/><circle cx="${x + 0.9}" cy="${y - 6.3}" r=".35" fill="#c75d4a"/>`;
    g += `<path d="M${x - 1.5} ${y - 7.3} L${x} ${y - 10} L${x + 1.5} ${y - 7.3} Z" fill="#8b1d24"/><circle cx="${x}" cy="${y - 10}" r=".4" fill="#f2efe6"/>`;
    g += `<path d="M${x + 0.8} ${y - 6} l1.6 .5 l0 -1.2 l.8 0 l0 1.6" stroke="#5a3418" stroke-width=".35" fill="none"/>`;
    g += `<path d="M${x + 0.6} ${y - 6.6} q1.6 -1.6 .4 -3.2 q-1.2 -1.6 .6 -3.4" stroke="#e8e4dc" stroke-width=".45" fill="none" opacity=".55"/>`;
    k += g;
    const [ax, ay] = aufAnrichte(x);
    unter.push({ id: "raeuchermaennchen", de: "das Räuchermännchen", syl: "RÄU-cher-männ-chen", it: "l'omino dell'incenso", itSyl: "o-MI-no dell'in-CEN-so", en: "incense smoker", x: ax, y: ay, kunst: flaeche(-2.8, -13, 5.6, 13),
      tipp: "Im Inneren glimmt eine Räucherkerze. Der Rauch kommt aus dem Mund." });
  }
  S.teil({ id: "anrichte", de: "die Anrichte", syl: "AN-rich-te", it: "la credenza", itSyl: "cre-DEN-za", en: "sideboard", x: AN.x, y: AN.y, steht: true, kunst: k,
    zoom: { x: AN.x - 34, y: AN.y + O - 26, w: 68, h: 45 }, unter,
    tipp: "Auf der Anrichte steht der Schmuck aus dem Erzgebirge." });
}

/* =====================================================================
   6 — DAS SOFA mit OPA und OMA
   ===================================================================== */
const SOFA = { x0: 236, x1: 320, rueckenO: 88, sitz: 121, vorne: 139 };
{
  const cx = (SOFA.x0 + SOFA.x1) / 2, W = SOFA.x1 - SOFA.x0;
  const STOFF = S.lg("stoff", [[0, "#3f5a4a"], [1, "#2a3f33"]]);
  let k = `<g transform="translate(${-cx} ${-SOFA.vorne})">`;
  k += schatten(cx, SOFA.vorne + 0.5, W / 2 + 2, 1.6, .4);
  /* Rückenlehne mit zwei Kissen */
  k += `<path d="M${SOFA.x0 + 4} ${SOFA.sitz - 4} L${SOFA.x0 + 4} ${SOFA.rueckenO + 3} Q${SOFA.x0 + 4} ${SOFA.rueckenO} ${SOFA.x0 + 8} ${SOFA.rueckenO} L${SOFA.x1 - 2} ${SOFA.rueckenO} L${SOFA.x1 - 2} ${SOFA.sitz - 4} Z" fill="${STOFF}"/>`;
  for (const x of [SOFA.x0 + 9, SOFA.x0 + 47]) k += `<rect x="${x}" y="${SOFA.rueckenO + 3}" width="36" height="${SOFA.sitz - SOFA.rueckenO - 7}" rx="3.6" fill="${S.lg("kissen", [[0, "#58786a"], [1, "#3a5446"]])}"/>`;
  /* Zierkissen: rot mit Stern */
  k += `<rect x="${SOFA.x1 - 18}" y="${SOFA.sitz - 15}" width="11" height="11" rx="2.4" fill="#a3262b" transform="rotate(-8 ${SOFA.x1 - 12} ${SOFA.sitz - 9})"/><path d="M${SOFA.x1 - 12.5} ${SOFA.sitz - 12.4} l.9 2 l2.2 .2 l-1.7 1.4 l.6 2.1 l-2 -1.2 l-1.9 1.2 l.5 -2.1 l-1.6 -1.4 l2.2 -.2 Z" fill="#f2d27a"/>`;
  /* Sitzpolster und Front */
  k += `<rect x="${SOFA.x0 + 6}" y="${SOFA.sitz - 5}" width="${W - 8}" height="7" rx="2.4" fill="${S.lg("polster", [[0, "#6a8b7c"], [1, "#46624f"]])}"/>`;
  k += `<line x1="${SOFA.x0 + 45}" y1="${SOFA.sitz - 4.6}" x2="${SOFA.x0 + 45}" y2="${SOFA.sitz + 2}" stroke="#2c4034" stroke-width=".5"/>`;
  k += `<rect x="${SOFA.x0 + 4}" y="${SOFA.sitz + 2}" width="${W - 6}" height="${SOFA.vorne - SOFA.sitz - 4}" fill="${STOFF}"/>`;
  /* Armlehne links (rechte liegt außerhalb) */
  k += `<path d="M${SOFA.x0} ${SOFA.vorne - 2} L${SOFA.x0} ${SOFA.rueckenO + 16} Q${SOFA.x0} ${SOFA.rueckenO + 11} ${SOFA.x0 + 5} ${SOFA.rueckenO + 11} Q${SOFA.x0 + 10} ${SOFA.rueckenO + 11} ${SOFA.x0 + 10} ${SOFA.rueckenO + 16} L${SOFA.x0 + 10} ${SOFA.vorne - 2} Z" fill="${S.lg("arm", [[0, "#5d7d6e"], [1, "#2c4235"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${SOFA.x0 + 1}" y="${SOFA.vorne - 2}" width="2" height="2" fill="#2a1a0e"/><rect x="${SOFA.x1 - 6}" y="${SOFA.vorne - 2}" width="2" height="2" fill="#2a1a0e"/>`;
  /* Wolldecke über der Lehne */
  k += `<path d="M${SOFA.x0 + 1} ${SOFA.rueckenO + 12} L${SOFA.x0 + 11} ${SOFA.rueckenO + 13} L${SOFA.x0 + 10} ${SOFA.rueckenO + 30} L${SOFA.x0 + 2} ${SOFA.rueckenO + 28} Z" fill="#c9b48a"/>`;
  for (let i = 0; i < 4; i++) k += `<line x1="${SOFA.x0 + 1 + i * 0.1}" y1="${SOFA.rueckenO + 15 + i * 4}" x2="${SOFA.x0 + 10.6}" y2="${SOFA.rueckenO + 16 + i * 4}" stroke="#9e2a2a" stroke-width=".6"/>`;
  k += `</g>`;
  S.teil({ id: "sofa", de: "das Sofa", syl: "SO-fa", it: "il divano", itSyl: "di-VA-no", en: "sofa", x: cx, y: SOFA.vorne, steht: true, kunst: k });
}
/* sitzend: der Sitzpunkt der Figur kommt genau auf das Polster */
const sitzend = (spec, hoehe, sx, sy) => {
  const f = figur(spec, hoehe);
  return { x: sx - f.z.sitz.x * f.k, y: sy - f.z.sitz.y * f.k, svg: f.svg };
};
{
  const f = sitzend({ id: "wn_opa", geschlecht: "m", alter: "alt", pose: "sitzen", blick: -22, frisur: "glatze", haarfarbe: "grau", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "#e8e2d4" }, jacke: { stueck: "weste", farbe: "#6b4a2e" }, unterteil: { stueck: "anzughose", farbe: "#4a4a50" }, schuhe: { stueck: "halbschuh", farbe: "braun" }, zubehoer: { stueck: "brille" } } }, 80, 262, SOFA.sitz - 2);
  S.teil({ id: "opa", de: "der Opa", syl: "O-pa", it: "il nonno", itSyl: "NON-no", en: "grandfather", x: f.x, y: f.y, kunst: f.svg });
}
{
  const f = sitzend({ id: "wn_oma", geschlecht: "w", alter: "alt", pose: "sitzen", blick: -30, frisur: "locken", haarfarbe: "grau", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#d9c6e0" }, jacke: { stueck: "weste", farbe: "#7a2e3a" }, unterteil: { stueck: "rock", farbe: "#3a3550" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 74, 297, SOFA.sitz - 2);
  S.teil({ id: "oma", de: "die Oma", syl: "O-ma", it: "la nonna", itSyl: "NON-na", en: "grandmother", x: f.x, y: f.y, kunst: f.svg });
}

/* =====================================================================
   7 — DER TANNENBAUM (Nordmanntanne) — Lupe mit dem Baumschmuck
   ===================================================================== */
const BAUM = { x: 140, y: 152 };
{
  const unter = [];
  const u = (t, lx, ly, w, h) => unter.push(Object.assign(t, { x: BAUM.x + lx, y: BAUM.y + ly, kunst: flaeche(-w / 2, -h / 2, w, h) }));
  let k = schatten(0, 0.6, 26, 2.4, .45);
  /* Christbaumständer aus Gusseisen, Stamm */
  k += `<rect x="-1.8" y="-18" width="3.6" height="10" fill="#5a3a1e"/>`;
  k += `<path d="M-9 0 L-7 -8 Q0 -10.6 7 -8 L9 0 Q0 1.6 -9 0 Z" fill="${S.lg("staender", [[0, "#2f6a3a"], [0.5, "#1f4a28"], [1, "#12301a"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="-8" rx="7" ry="1.4" fill="#2a5a33"/><path d="M-6 -6 L6 -6" stroke="#d4af37" stroke-width=".4"/><circle cx="-6.6" cy="-3.4" r=".7" fill="#d4af37"/><circle cx="6.6" cy="-3.4" r=".7" fill="#d4af37"/>`;
  /* Äste in acht Etagen, unten zuerst; jede Etage hängt mit Spitzen nach unten */
  const N = 8, yTop = -100, yBot = -15;
  const breite = (y) => 3 + (y - yTop) / (yBot - yTop) * 29;
  for (let i = N - 1; i >= 0; i--) {
    const yb = yTop + 12 + i * (yBot - yTop - 12) / (N - 1), yt = yb - 20 - i * 0.6, w = breite(yb);
    let p = `M0 ${r(yt)} Q${r(-w * 0.45)} ${r(yt + (yb - yt) * 0.45)} ${r(-w)} ${r(yb - 1)}`;
    const zacken = 5 + i;
    for (let j = 0; j <= zacken * 2; j++) {
      const t = j / (zacken * 2), x = -w + t * 2 * w, tief = j % 2 ? 2.4 + rnd() * 1.4 : -0.6 + rnd();
      p += ` L${r(x)} ${r(yb + tief - Math.sin(t * Math.PI) * 1.4)}`;
    }
    p += ` Q${r(w * 0.45)} ${r(yt + (yb - yt) * 0.45)} 0 ${r(yt)} Z`;
    k += `<path d="${p}" fill="${NADEL}"/>`;
    /* Zweigspitzen heller (Licht), Schattenfuge oben */
    for (let j = 0; j < zacken + 3; j++) {
      const x = -w * 0.92 + rnd() * w * 1.84, y = yb - 1 - rnd() * 4;
      k += `<path d="M${r(x)} ${r(y - 2.6)} q${r(rnd() * 1.6 - 0.8)} 1.6 ${r(rnd() * 2 - 1)} 3.4" stroke="${rnd() < 0.5 ? "#4a8a52" : "#3b7a46"}" stroke-width=".7" fill="none" stroke-linecap="round"/>`;
    }
  }
  /* warmes Licht der Kette auf den Nadeln */
  k += `<path d="M0 ${yTop} L-32 ${yBot + 2} L32 ${yBot + 2} Z" fill="${S.rg("baumlicht", [[0, "#ffd77a", 0.22], [1, "#ffd77a", 0]], 0.42, 0.55, 0.6)}"/>`;

  /* LICHTERKETTE: drei Bögen mit warmweißen Lämpchen */
  const lichter = [];
  for (const [ya, yb2, n] of [[-84, -78, 6], [-62, -54, 9], [-40, -31, 12]]) {
    const wa = breite(ya) * 0.86, wb = breite(yb2) * 0.86;
    let d = `M${r(-wa)} ${ya}`;
    d += ` Q0 ${r(yb2 + 6)} ${r(wb)} ${yb2}`;
    k += `<path d="${d}" stroke="#2d3a2a" stroke-width=".35" fill="none"/>`;
    for (let i = 0; i <= n; i++) {
      const t = i / n, x = (1 - t) * (1 - t) * -wa + 2 * t * (1 - t) * 0 + t * t * wb, y = (1 - t) * (1 - t) * ya + 2 * t * (1 - t) * (yb2 + 6) + t * t * yb2;
      lichter.push([x, y]);
      k += `<circle cx="${r(x)}" cy="${r(y)}" r="1.9" fill="${GLUT}"/><circle cx="${r(x)}" cy="${r(y)}" r=".6" fill="#fff6d0"/>`;
    }
  }
  /* LAMETTA: silberne Fäden an den Zweigspitzen */
  const lametta = (x, y, n, l) => {
    let g = "";
    for (let i = 0; i < n; i++) { const dx = x + i * 0.55 - n * 0.27; g += `<line x1="${r(dx)}" y1="${r(y)}" x2="${r(dx + (rnd() - 0.5) * 0.6)}" y2="${r(y + l * (0.7 + rnd() * 0.3))}" stroke="${i % 3 ? "#dfe5ea" : "#ffffff"}" stroke-width=".22" opacity=".9"/>`; }
    return g;
  };
  for (const [x, y] of [[-24, -36], [-12, -44], [4, -37], [18, -46], [26, -29], [-28, -24], [10, -25], [-6, -27], [-16, -61], [14, -66], [-9, -78], [21, -21], [-19, -52]]) k += lametta(x, y, 6, 7);
  /* KUGELN, STROHSTERNE und eine GLOCKE */
  const kugel = (x, y, rr, f) => `<circle cx="${r(x)}" cy="${r(y)}" r="${rr}" fill="${f}"/><rect x="${r(x - 0.6)}" y="${r(y - rr - 0.8)}" width="1.2" height=".9" fill="#d9b44a"/><line x1="${r(x)}" y1="${r(y - rr - 0.8)}" x2="${r(x)}" y2="${r(y - rr - 2.4)}" stroke="#c9a640" stroke-width=".2"/><ellipse cx="${r(x - rr * 0.35)}" cy="${r(y - rr * 0.4)}" rx="${r(rr * 0.3)}" ry="${r(rr * 0.2)}" fill="#fff" opacity=".7"/>`;
  const stroh = (x, y, s) => {
    let g = "";
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, l = (i % 2 ? 2.2 : 3.2) * s; g += `<line x1="${r(x - Math.cos(a) * l)}" y1="${r(y - Math.sin(a) * l)}" x2="${r(x + Math.cos(a) * l)}" y2="${r(y + Math.sin(a) * l)}" stroke="#f0d48a" stroke-width="${r(0.55 * s)}" stroke-linecap="round"/>`; }
    return g + `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.7 * s)}" fill="none" stroke="#c0282d" stroke-width="${r(0.35 * s)}"/>`;
  };
  const deko = [
    ["k", -11, -70, 2.9, ROT], ["k", 7, -88, 2.2, GOLD], ["k", -16, -48, 2.6, SILBER], ["k", 12, -54, 2.8, ROT], ["k", -3, -58, 2.4, GOLD], ["k", 20, -36, 2.8, GOLD],
    ["k", -21, -32, 2.8, ROT], ["k", 3, -44, 2.6, SILBER], ["k", -7, -34, 2.7, ROT], ["k", 13, -26, 2.6, ROT], ["k", -14, -21, 2.8, GOLD], ["k", 27, -20, 2.5, SILBER],
    ["k", 1, -24, 2.9, GOLD], ["k", -26, -18, 2.4, SILBER], ["k", 16, -77, 2.2, SILBER], ["k", -4, -96, 1.8, ROT],
    ["s", 9, -79, 1.05], ["s", -18, -40, 1.1], ["s", 22, -48, 1], ["s", -9, -50, 0.9], ["s", 7, -33, 1.1], ["s", -24, -26, 1], ["s", 18, -20, 1.1], ["s", -12, -86, 0.8],
  ];
  for (const d of deko) k += d[0] === "k" ? kugel(d[1], d[2], d[3], d[4]) : stroh(d[1], d[2], d[3]);
  /* gläserne Glocke */
  k += `<line x1="-6" y1="-90" x2="-6" y2="-87" stroke="#c9a640" stroke-width=".2"/><path d="M-8.4 -81.8 Q-8.2 -86.6 -6 -87 Q-3.8 -86.6 -3.6 -81.8 Z" fill="${GOLD}"/><circle cx="-6" cy="-81.4" r=".6" fill="#8a5f12"/><path d="M-7.6 -83 q.3 -2.6 1.2 -3" stroke="#fff" stroke-width=".35" opacity=".7" fill="none"/>`;
  /* CHRISTBAUMSPITZE aus Glas */
  k += `<path d="M0 -120 Q1.3 -112 1.8 -106 Q2.6 -103 2.4 -101 L-2.4 -101 Q-2.6 -103 -1.8 -106 Q-1.3 -112 0 -120 Z" fill="${S.lg("spitze", [[0, "#ff8a8a"], [0.4, "#c4141f"], [1, "#6e0810"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="-104.6" rx="2.6" ry="2.4" fill="${ROT}"/><path d="M-.5 -116 L-.5 -106" stroke="#fff" stroke-width=".4" opacity=".6"/><rect x="-1.2" y="-101.4" width="2.4" height="1.2" fill="#d9b44a"/>`;

  u({ id: "christbaumspitze", de: "die Christbaumspitze", syl: "CHRIST-baum-spit-ze", it: "il puntale", itSyl: "pun-TA-le", en: "tree topper" }, 0, -110, 7, 18);
  u({ id: "glocke", de: "die Glocke", syl: "GLO-cke", it: "la campana", itSyl: "cam-PA-na", en: "bell" }, -6, -84, 6, 7);
  u({ id: "strohstern", de: "der Strohstern", syl: "STROH-stern", it: "la stella di paglia", itSyl: "STEL-la di PA-glia", en: "straw star",
    tipp: "Strohsterne bastelt man aus Strohhalmen und rotem Faden." }, 9, -79, 7, 7);
  u({ id: "christbaumkugel", de: "die Christbaumkugel", syl: "CHRIST-baum-ku-gel", it: "la pallina di Natale", itSyl: "pal-LI-na di na-TA-le", en: "bauble",
    tipp: "Die ersten gläsernen Christbaumkugeln kamen aus Lauscha in Thüringen." }, -11, -70, 7, 7);
  u({ id: "lichterkette", de: "die Lichterkette", syl: "LICH-ter-ket-te", it: "le luci di Natale", itSyl: "LU-ci di na-TA-le", en: "fairy lights" }, lichter[4][0], lichter[4][1], 6, 6);
  u({ id: "lametta", de: "das Lametta", syl: "la-MET-ta", it: "i fili argentati", itSyl: "FI-li ar-gen-TA-ti", en: "tinsel" }, -18, -63, 6, 8);
  /* Lametta-Büschel, das die Lupenfläche markiert */
  k += lametta(-18, -67, 7, 7);
  S.teil({ id: "tannenbaum", de: "der Tannenbaum", syl: "TAN-nen-baum", it: "l'albero di Natale", itSyl: "AL-be-ro di na-TA-le", en: "Christmas tree", x: BAUM.x, y: BAUM.y, steht: true, kunst: k,
    zoom: { x: BAUM.x - 40, y: BAUM.y - 122, w: 80, h: 54 }, unter,
    tipp: "An Heiligabend ist Bescherung: Dann liegen die Geschenke unter dem Baum." });
}
/* DAS PÄCKCHEN und DAS GESCHENK unter dem Baum */
const paket = (w, h, t, papier, band, name) => {
  /* Quader leicht von oben: Front, Deckel, Schleife */
  let g = schatten(0, 0.3, w / 2 + 2, 1.2, .35);
  g += `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx=".4" fill="${papier}"/>`;
  g += `<path d="M${-w / 2} ${-h} L${-w / 2 + t} ${-h - t} L${w / 2 + t} ${-h - t} L${w / 2} ${-h} Z" fill="${papier}"/><path d="M${-w / 2} ${-h} L${-w / 2 + t} ${-h - t} L${w / 2 + t} ${-h - t} L${w / 2} ${-h} Z" fill="#fff" opacity=".22"/>`;
  g += `<path d="M${w / 2} 0 L${w / 2 + t} ${-t} L${w / 2 + t} ${-h - t} L${w / 2} ${-h} Z" fill="${papier}"/><path d="M${w / 2} 0 L${w / 2 + t} ${-t} L${w / 2 + t} ${-h - t} L${w / 2} ${-h} Z" fill="#000" opacity=".25"/>`;
  g += `<rect x="${-0.8}" y="${-h}" width="1.6" height="${h}" fill="${band}"/><path d="M-.8 ${-h} L${t - 0.8} ${-h - t} L${t + 0.8} ${-h - t} L.8 ${-h} Z" fill="${band}"/>`;
  g += `<path d="M${-w / 2 + t / 2} ${r(-h - t / 2 - 0.5)} L${w / 2 + t / 2} ${r(-h - t / 2 - 0.5)}" stroke="${band}" stroke-width="1.4"/>`;
  const sx = t / 2, sy = -h - t / 2;
  g += `<path d="M${sx} ${sy} q-4 -4 -4.6 -.6 q.4 2 4.6 .6 q4 -4 4.6 -.6 q-.4 2 -4.6 .6 Z" fill="${band}" stroke="#00000033" stroke-width=".2"/><circle cx="${sx}" cy="${sy}" r=".9" fill="${band}"/>`;
  if (name) g += `<rect x="${-w / 2 + 1.6}" y="${-h + 2}" width="6" height="3.4" rx=".4" fill="#fbf6e8" transform="rotate(-8 ${-w / 2 + 4} ${-h + 3.6})"/><text x="${-w / 2 + 4.4}" y="${-h + 4.4}" font-size="1.7" text-anchor="middle" fill="#7a2a20" font-family="Georgia,serif" font-style="italic" transform="rotate(-8 ${-w / 2 + 4} ${-h + 3.6})">${name}</text>`;
  return g;
};
{
  /* Geschenkpapier: rot mit goldenen Sternen */
  S.def(`<pattern id="${S.id("papier1")}" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#b3202a"/><circle cx="1.2" cy="1.2" r=".5" fill="#f2cf6a"/><circle cx="3.7" cy="3.7" r=".4" fill="#f2cf6a"/></pattern>`);
  S.def(`<pattern id="${S.id("papier2")}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#1f5a8a"/><path d="M0 4 L4 0" stroke="#e9eef4" stroke-width=".6"/></pattern>`);
  S.teil({ id: "paeckchen", de: "das Päckchen", syl: "PÄCK-chen", it: "il pacchetto", itSyl: "pac-CHET-to", en: "parcel", x: 112, y: 157, kunst: paket(12, 8, 3, `url(#${S.id("papier2")})`, "#e9c25a") });
  S.teil({ id: "geschenk", de: "das Geschenk", syl: "Ge-SCHENK", it: "il regalo", itSyl: "re-GA-lo", en: "present", x: 160, y: 165, kunst: paket(20, 13, 4, `url(#${S.id("papier1")})`, "#e9c25a", "Lena"),
    tipp: "Geschenke packt man in buntes Geschenkpapier mit Schleife." });
}
/* DAS ENKELKIND kniet vor dem Baum */
{
  const m = figur({ id: "wn_kind", geschlecht: "w", alter: "kind", pose: "knien", blick: 55, frisur: "zopf", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#2f6a8a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 72);
  S.teil({ id: "enkelkind", de: "das Enkelkind", syl: "EN-kel-kind", it: "il nipote", itSyl: "ni-PO-te", en: "grandchild", x: 92, y: 173, kunst: schatten(0, 0, 12, 1.6, .3) + m.svg,
    tipp: "Lena ist das Enkelkind von Oma und Opa. Sie freut sich auf die Bescherung." });
}

/* =====================================================================
   8 — DER COUCHTISCH mit Adventskranz, Plätzchen, Stollen … (Lupe)
   ===================================================================== */
{
  const TB = { yh: 136, yv: 151, xh0: 226, xh1: 292, xv0: 214, xv1: 304, fuss: 183 };
  const cx = (TB.xv0 + TB.xv1) / 2;
  const L = (x, y) => `${r(x - cx)} ${r(y - TB.fuss)}`;
  let k = schatten(0, 0.5, 48, 2.2, .4);
  /* Beine */
  for (const x of [TB.xv0 + 4, TB.xv1 - 7]) k += `<rect x="${r(x - cx)}" y="${TB.yv + 3 - TB.fuss}" width="3" height="${TB.fuss - TB.yv - 3}" fill="${HOLZ_V}"/>`;
  for (const x of [TB.xh0 + 6, TB.xh1 - 8]) k += `<rect x="${r(x - cx)}" y="${TB.yh - TB.fuss}" width="2" height="${TB.fuss - 14 - TB.yh}" fill="#4a2c16"/>`;
  /* Platte (Nussbaum) mit Spiegelung, Zarge */
  k += `<path d="M${L(TB.xh0, TB.yh)} L${L(TB.xh1, TB.yh)} L${L(TB.xv1, TB.yv)} L${L(TB.xv0, TB.yv)} Z" fill="${S.lg("platte", [[0, "#6a3f20"], [1, "#a36a3a"]])}"/>`;
  k += `<path d="M${L(TB.xh0 + 10, TB.yh + 1)} L${L(TB.xh0 + 22, TB.yh + 1)} L${L(TB.xv0 + 20, TB.yv - 1)} L${L(TB.xv0 + 8, TB.yv - 1)} Z" fill="#fff" opacity=".07"/>`;
  k += `<rect x="${r(TB.xv0 - cx)}" y="${TB.yv - TB.fuss}" width="${TB.xv1 - TB.xv0}" height="3.4" fill="${HOLZ}"/><rect x="${r(TB.xv0 - cx)}" y="${TB.yv - TB.fuss}" width="${TB.xv1 - TB.xv0}" height=".6" fill="#c08a52"/>`;
  /* weiße Tischdecke als Läufer quer */
  k += `<path d="M${L(TB.xh0 + 18, TB.yh)} L${L(TB.xh1 - 18, TB.yh)} L${L(TB.xv1 - 22, TB.yv)} L${L(TB.xv0 + 22, TB.yv)} Z" fill="#f4efe4"/><path d="M${L(TB.xv0 + 22, TB.yv)} L${L(TB.xv1 - 22, TB.yv)} L${L(TB.xv1 - 22, TB.yv + 4)} L${L(TB.xv0 + 22, TB.yv + 4)} Z" fill="#ece5d6"/>`;
  for (let x = TB.xv0 + 23; x < TB.xv1 - 22; x += 2) k += `<line x1="${r(x - cx)}" y1="${TB.yv + 4 - TB.fuss}" x2="${r(x - cx)}" y2="${TB.yv + 5 - TB.fuss}" stroke="#d8cfbd" stroke-width=".4"/>`;

  const unter = [];
  const auf = (x, y) => [x - cx, y - TB.fuss];
  const U = (t, x, y, fx, fy, fw, fh) => unter.push(Object.assign(t, { x, y, kunst: flaeche(fx, fy, fw, fh) }));
  /* DER LEBKUCHEN: Elisenlebkuchen mit Schokolade und Mandeln auf einem Tellerchen */
  {
    const [x, y] = auf(224, 148);
    k += `<ellipse cx="${x}" cy="${y}" rx="6.4" ry="1.8" fill="#f2efe8" stroke="#c9c0ae" stroke-width=".2"/>`;
    for (const [dx, dy, f] of [[-2.4, -0.4, "#4a2414"], [2.2, -0.2, "#a8642c"], [0, -1.6, "#4a2414"]]) {
      k += `<ellipse cx="${r(x + dx)}" cy="${r(y + dy)}" rx="2.8" ry="1" fill="#6e3a1a"/><ellipse cx="${r(x + dx)}" cy="${r(y + dy - 0.6)}" rx="2.8" ry="1" fill="${f}"/>`;
      if (f !== "#4a2414") for (const ax of [-1, 0, 1]) k += `<ellipse cx="${r(x + dx + ax)}" cy="${r(y + dy - 0.7)}" rx=".5" ry=".25" fill="#f3e2c0"/>`;
    }
    U({ id: "lebkuchen", de: "der Lebkuchen", syl: "LEB-ku-chen", it: "il panpepato", itSyl: "pan-pe-PA-to", en: "gingerbread",
      tipp: "Die Nürnberger Lebkuchen sind die bekanntesten." }, 224, 148, -6.6, -4.6, 13.2, 6.6);
  }
  /* DER ADVENTSKRANZ: Tannengrün, vier rote Kerzen — an Heiligabend brennen alle */
  {
    const [x, y] = auf(244, 142.5);
    k += `<ellipse cx="${x}" cy="${y + 0.6}" rx="13" ry="4.4" fill="#0f2c18"/>`;
    let ring = "";
    for (let i = 0; i < 46; i++) {
      const a = i / 46 * Math.PI * 2, rx = 11 + rnd() * 1.6, ry = 3.6 + rnd() * 0.6;
      ring += `<path d="M${r(x + Math.cos(a) * rx)} ${r(y + Math.sin(a) * ry)} l${r(Math.cos(a + 1.4) * 2.6)} ${r(Math.sin(a + 1.4) * 1.2 - 0.6)}" stroke="${i % 3 ? "#2f6e3e" : "#4a8a52"}" stroke-width="1.1" stroke-linecap="round"/>`;
    }
    k += ring + `<ellipse cx="${x}" cy="${y}" rx="7.4" ry="2.2" fill="#a36a3a"/>`;
    for (const a of [0.6, 2.2, 3.9, 5.4]) k += `<circle cx="${r(x + Math.cos(a) * 10)}" cy="${r(y + Math.sin(a) * 3.4 + 0.4)}" r=".9" fill="${ROT}"/>`;
    for (const a of [1.2, 4.6]) k += `<path d="M${r(x + Math.cos(a) * 12)} ${r(y + Math.sin(a) * 4)} l-1.2 2.6 l1.2 -.8 l1.2 .8 Z" fill="#c4202a"/>`;
    /* Kerzen hinten zuerst */
    for (const a of [-2.4, -0.7, 2.4, 0.7].sort((p, q) => Math.sin(p) - Math.sin(q))) {
      const kx = x + Math.cos(a) * 10, ky = y + Math.sin(a) * 3.4;
      k += `<rect x="${r(kx - 1.4)}" y="${r(ky - 9)}" width="2.8" height="9" fill="${KERZE}"/><ellipse cx="${r(kx)}" cy="${r(ky - 9)}" rx="1.4" ry=".45" fill="#e65a5a"/><path d="M${r(kx)} ${r(ky - 9)} l0 -1" stroke="#222" stroke-width=".25"/>` + flamme(kx, ky - 10, 0.7);
    }
    U({ id: "adventskranz", de: "der Adventskranz", syl: "Ad-VENTS-kranz", it: "la corona d'Avvento", itSyl: "co-RO-na d'av-VEN-to", en: "Advent wreath",
      tipp: "An jedem Adventssonntag zündet man eine Kerze mehr an." }, 244, 142.5, -13, -12, 26, 16);
  }
  /* DER GLÜHWEIN: zwei Becher, dampfend */
  {
    for (const [mx, my] of [[260, 139], [266, 140.4]]) {
      const [x, y] = auf(mx, my);
      k += `<path d="M${x - 1.8} ${y - 4.6} L${x + 1.8} ${y - 4.6} L${x + 1.6} ${y} L${x - 1.6} ${y} Z" fill="${S.lg("becher", [[0, "#f6f2ea"], [1, "#c9c1b2"]], 0, 0, 1, 0)}"/><ellipse cx="${x}" cy="${y - 4.6}" rx="1.8" ry=".5" fill="#6e1020"/>`;
      k += `<path d="M${x + 1.7} ${y - 3.8} q1.4 .2 1.1 1.4 q-.3 .9 -1.3 .6" stroke="#ece6da" stroke-width=".55" fill="none"/><rect x="${x - 1.6}" y="${y - 3.2}" width="3.2" height="1.4" fill="#b8272a"/>`;
      k += `<path d="M${x - 0.4} ${y - 5.4} q-1 -1.6 0 -3 q1 -1.4 0 -2.8" stroke="#fff" stroke-width=".35" opacity=".45" fill="none"/>`;
    }
    U({ id: "gluehwein", de: "der Glühwein", syl: "GLÜH-wein", it: "il vin brulé", itSyl: "vin bru-LÉ", en: "mulled wine",
      tipp: "Glühwein ist heißer Rotwein mit Zimt, Nelken und Orange." }, 263, 140, -4.4, -8, 9.2, 9);
  }
  /* DER WEIHNACHTSMANN aus Schokolade, in bunter Folie */
  {
    const [x, y] = auf(263, 150.4);
    k += `<path d="M${x - 2.2} ${y} Q${x - 2.6} ${y - 4} ${x - 1.6} ${y - 6} L${x} ${y - 9.4} L${x + 1.6} ${y - 6} Q${x + 2.6} ${y - 4} ${x + 2.2} ${y} Z" fill="${S.lg("folie", [[0, "#7a0a12"], [0.35, "#e0303a"], [0.6, "#ff8a8a"], [1, "#8a0e16"]], 0, 0, 1, 0)}"/>`;
    k += `<ellipse cx="${x}" cy="${y - 5.6}" rx="1.3" ry="1" fill="#f3c9a8"/><path d="M${x - 1.5} ${y - 5.2} Q${x} ${y - 2} ${x + 1.5} ${y - 5.2} Z" fill="#fbfbf8"/><rect x="${x - 1.8}" y="${y - 7}" width="3.6" height=".8" rx=".4" fill="#fbfbf8"/><circle cx="${x}" cy="${y - 9.4}" r=".6" fill="#fbfbf8"/>`;
    k += `<rect x="${x - 2.2}" y="${y - 1.4}" width="4.4" height=".7" fill="#e2b94e"/><path d="M${x - 1.6} ${y - 4.6} l.4 3" stroke="#fff" stroke-width=".3" opacity=".6"/>`;
    U({ id: "weihnachtsmann", de: "der Weihnachtsmann", syl: "WEIH-nachts-mann", it: "Babbo Natale", itSyl: "BAB-bo na-TA-le", en: "Santa Claus",
      tipp: "Ein Weihnachtsmann aus Schokolade, in bunter Folie." }, 263, 150.4, -3, -10.6, 6, 11);
  }
  /* DIE PLÄTZCHEN: Teller mit Vanillekipferln, Zimtsternen, Butterplätzchen */
  {
    const [x, y] = auf(279, 145.6);
    k += `<ellipse cx="${x}" cy="${y + 0.4}" rx="8.6" ry="2.6" fill="#d9d2c4"/><ellipse cx="${x}" cy="${y}" rx="8.4" ry="2.4" fill="#fbf9f4"/><ellipse cx="${x}" cy="${y}" rx="5.6" ry="1.5" fill="none" stroke="#2f6a8a" stroke-width=".3"/>`;
    const zimtstern = (px, py) => `<path d="M${r(px)} ${r(py - 1.5)} l.5 1 l1.1 .1 l-.8 .7 l.3 1.1 l-1.1 -.6 l-1.1 .6 l.3 -1.1 l-.8 -.7 l1.1 -.1 Z" fill="#fbf7ec" stroke="#b9874f" stroke-width=".2"/>`;
    const kipferl = (px, py) => `<path d="M${r(px - 1.8)} ${r(py)} Q${r(px)} ${r(py - 2)} ${r(px + 1.8)} ${r(py)}" stroke="#f1dca6" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M${r(px - 1.6)} ${r(py - 0.2)} Q${r(px)} ${r(py - 1.8)} ${r(px + 1.6)} ${r(py - 0.2)}" stroke="#fffaf0" stroke-width=".35" fill="none" opacity=".8"/>`;
    const butter = (px, py, f) => `<circle cx="${r(px)}" cy="${r(py)}" r="1.3" fill="${f}"/><circle cx="${r(px)}" cy="${r(py)}" r=".45" fill="#c4202a"/>`;
    k += butter(x - 4.6, y - 0.2, "#e2b56c") + kipferl(x - 1.4, y + 0.6) + zimtstern(x + 3, y - 0.2) + kipferl(x + 5.4, y + 0.8) + butter(x + 0.6, y - 1.2, "#d9a55a") + zimtstern(x - 2.6, y - 1.6) + kipferl(x + 1.8, y - 2);
    U({ id: "plaetzchen", de: "die Plätzchen", syl: "PLÄTZ-chen", it: "i biscotti di Natale", itSyl: "bi-SCOT-ti di na-TA-le", en: "Christmas cookies",
      tipp: "Vanillekipferl, Zimtsterne, Butterplätzchen – in der Adventszeit backt man sie selbst." }, 279, 145.6, -8.8, -4, 17.6, 7);
  }
  /* DIE KERZE: hohe weiße Kerze im Messingleuchter (hinten rechts) */
  {
    const [x, y] = auf(296, 138.6);
    k += `<ellipse cx="${x}" cy="${y}" rx="2.6" ry=".8" fill="${GOLD}"/><rect x="${x - 0.5}" y="${y - 3}" width="1" height="3" fill="#c9a640"/><ellipse cx="${x}" cy="${y - 3}" rx="1.8" ry=".5" fill="${GOLD}"/>`;
    k += `<rect x="${x - 1.1}" y="${y - 13}" width="2.2" height="10" fill="${S.lg("weisskerze", [[0, "#e9e1cf"], [0.45, "#fffdf6"], [1, "#d8cdb6"]], 0, 0, 1, 0)}"/><path d="M${x + 0.5} ${y - 13} q.3 1.6 .1 3" stroke="#f3ecdc" stroke-width=".5" fill="none"/>` + flamme(x, y - 13.4, 0.75);
    U({ id: "kerze", de: "die Kerze", syl: "KER-ze", it: "la candela", itSyl: "can-DE-la", en: "candle" }, 296, 138.6, -3, -17, 6, 18);
  }
  /* DER STOLLEN: Christstollen mit Puderzucker auf dem Brett, angeschnitten */
  {
    const [x, y] = auf(291, 149.2);
    k += `<path d="M${x - 9} ${y} L${x + 9} ${y} L${x + 10.6} ${y - 1.4} L${x - 7.4} ${y - 1.4} Z" fill="${HELLHOLZ}"/><rect x="${x - 9}" y="${y}" width="18" height=".9" fill="#a37c4a"/>`;
    k += `<path d="M${x - 7.4} ${y - 1.2} Q${x - 7.6} ${y - 6} ${x - 2} ${y - 6.2} Q${x + 2} ${y - 7.6} ${x + 4} ${y - 5.4} L${x + 4} ${y - 1.2} Z" fill="${S.lg("zucker", [[0, "#ffffff"], [0.6, "#f4efe6"], [1, "#d9c9a8"]])}"/>`;
    k += `<path d="M${x - 5} ${y - 5.4} Q${x - 1} ${y - 3.6} ${x + 3} ${y - 5.4}" stroke="#e3d8c2" stroke-width=".4" fill="none"/>`;
    k += `<path d="M${x + 4} ${y - 1.2} L${x + 4} ${y - 5.4} Q${x + 5.6} ${y - 5.6} ${x + 5.6} ${y - 4} L${x + 5.6} ${y - 1.2} Z" fill="#f0d9a4"/>`;
    for (const [dx, dy, f] of [[4.6, -4, "#6b2a18"], [5, -2.4, "#c43a2a"], [4.4, -1.8, "#6b2a18"], [5.2, -3.2, "#2f6a2a"]]) k += `<circle cx="${r(x + dx)}" cy="${r(y + dy)}" r=".35" fill="${f}"/>`;
    k += `<path d="M${x + 7} ${y - 1.3} l3 -.4 l0 -.8 l-3 .3 Z" fill="#f0d9a4" stroke="#c8a870" stroke-width=".15"/>`;
    U({ id: "stollen", de: "der Stollen", syl: "STOL-len", it: "il dolce natalizio", itSyl: "DOL-ce na-ta-LI-zio", en: "Christmas stollen",
      tipp: "Der Dresdner Christstollen ist mit Rosinen, Zitronat und viel Puderzucker." }, 291, 149.2, -9.4, -8, 20, 9);
  }
  S.teil({ id: "couchtisch", de: "der Couchtisch", syl: "COUCH-tisch", it: "il tavolino", itSyl: "ta-vo-LI-no", en: "coffee table", x: cx, y: TB.fuss, steht: true, kunst: k,
    zoom: { x: 212, y: 116, w: 96, h: 64 }, unter });
}

/* Licht über allem: Lichthof um den Baum, Kerzenschein, Vignette (fängt keinen Tipp) */
S.davor(`<g pointer-events="none"><circle cx="140" cy="96" r="70" fill="${S.rg("hof", [[0, "#ffd890", 0.16], [1, "#ffd890", 0]])}"/><circle cx="262" cy="136" r="34" fill="${S.rg("hof2", [[0, "#ffcf7a", 0.14], [1, "#ffcf7a", 0]])}"/><rect width="320" height="200" fill="${S.rg("vignette", [[0.6, "#000", 0], [1, "#1a0c02", 0.32]], 0.5, 0.5, 0.75)}"/></g>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/weihnachten.js"));
console.log(aus);
