#!/usr/bin/env node
/* =====================================================================
   ROM VON NAHEM (FASSUNG 852) — Bilderwelt neu, Detailszene zu Rom
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar.

   Kolosseum, Pantheon, Forum und Trevibrunnen liegen in Rom an vier
   verschiedenen Orten – von keinem Standort sieht man alle vier aus der
   Nähe. Diese Szene ist deshalb ein echter deutscher Ort, an dem man
   Rom „von Nahem“ studiert (und die „Antikensammlung“ des Museums):
   RECHERCHE (Schloss Johannisburg Aschaffenburg: weltgrößte Sammlung
   von KORKMODELLEN römischer Bauten, 54 Modelle, gebaut 1792–1854 vom
   Hofkonditor Carl May und seinem Sohn Georg; Antigone Journal „Cork
   Models of the Ruins of Rome“):
   - Vorn auf Sockeln das große Korkmodell des KOLOSSEUMS (vier
     Geschosse: drei Arkadenreihen mit Halbsäulen – tuskisch, ionisch,
     korinthisch – und das Attikageschoss; auf der Südseite die
     Bruchkante, dahinter der innere Ring und die Ränge) und das Modell
     des PANTHEONS (Vorhalle mit acht Säulen, Giebel, Inschrift
     M·AGRIPPA·L·F·COS·TERTIVM·FECIT, Rotunde, Kuppel mit Opaion).
   - An der pompejanisch-roten Wand zwei große Veduten in Goldrahmen:
     das FORUM ROMANUM (Septimius-Severus-Bogen mit Durchgängen und
     Inschrift, Tempel mit Giebel, die drei Säulen des Castor-Tempels,
     Via Sacra, Säulentrommeln, Zypressen, hinten das Kolosseum) und der
     TREVIBRUNNEN (Palastfassade, Attika mit Inschriftfeld, Mittelnische
     mit Oceanus, Säulen, Tritonen, Felsen, Becken, Wasser).
   - Oberlicht, Marmorboden, Messingschilder, Absperrkordel.
   Maßstab: Augenhöhe y = 95 (1,6 m); Rückwand ≈ 16 Einheiten je Meter,
   Sockel vorn (Boden y ≈ 182) ≈ 54 je Meter. Figuren sind bekleidet.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "rom_detail", titel: "Rom von Nahem", emoji: "🔍", thema: "Landeskunde", kuerzel: "b23d", fassung: 852 });
const rnd = zufall(1792);
const r = B.r;
const abs = (x, y, svg) => `<g transform="translate(${r(-x)} ${r(-y)})">${svg}</g>`;
const U = (w, x0, y0, x1, y1, tipp) => { const o = { id: w[0], de: w[1], syl: w[2], it: w[3], itSyl: w[4], en: w[5], x: r((x0 + x1) / 2), y: r(y1), kunst: flaeche(-(x1 - x0) / 2, -(y1 - y0), x1 - x0, y1 - y0) }; if (tipp) o.tipp = tipp; return o; };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const GOLD = S.lg("gold", [[0, "#9a7228"], [0.35, "#f4d57e"], [0.6, "#d6aa48"], [1, "#7e5a1c"]], 0, 0, 1, 1);
const KORK = S.lg("kork", [[0, "#d9b98c"], [0.5, "#c19a68"], [1, "#8e6a42"]], 0, 0, 1, 0);
const KORK_H = S.lg("korkh", [[0, "#e4c89c"], [1, "#b48c5c"]]);
const KORK_D = "#5e4228";

/* =====================================================================
   RAUM — Oberlicht, rote Wand, Durchgang, Marmorboden
   ===================================================================== */
const VP = { x: 160, y: 95 }, WU = 120;
{
  let g = `<rect x="0" y="0" width="320" height="14" fill="${S.lg("decke", [[0, "#e8e4dc"], [1, "#d6d0c4"]])}"/>`;
  g += `<rect x="60" y="0" width="200" height="10" fill="${S.lg("oberlicht", [[0, "#f6fbff"], [1, "#dfe9ef"]])}"/>`;
  for (let x = 60; x <= 260; x += 25) g += `<rect x="${x - 0.6}" y="0" width="1.2" height="10" fill="#9aa3aa"/>`;
  g += `<rect x="60" y="9" width="200" height="1.4" fill="#9aa3aa"/>`;
  g += `<rect x="0" y="13" width="320" height="4" fill="#f2ede2"/><rect x="0" y="16.4" width="320" height="1.2" fill="${GOLD}"/>`;
  g += `<rect x="0" y="17.6" width="320" height="${WU - 17.6}" fill="${S.lg("wand", [[0, "#9a3a30"], [0.6, "#8a2e26"], [1, "#74251e"]])}"/>`;
  g += `<rect x="0" y="17.6" width="320" height="60" fill="${S.rg("licht", [[0, "#ffe9c8", 0.25], [1, "#ffe9c8", 0]], 0.5, 0.1, 0.6)}"/>`;
  /* Sockelzone (dunkel), Profilleiste */
  g += `<rect x="0" y="100" width="320" height="20" fill="${S.lg("sockel", [[0, "#3e2c26"], [1, "#2e201c"]])}"/><rect x="0" y="99" width="320" height="1.6" fill="#e9dcc0"/>`;
  /* Durchgang in den nächsten Saal mit Marmorrahmen */
  g += `<rect x="142" y="58" width="36" height="62" fill="#efe8da"/><rect x="146" y="62" width="28" height="58" fill="${S.lg("nebensaal", [[0, "#c9a58a"], [1, "#a8826a"]])}"/>`;
  g += `<path d="M146 120 L174 120 L170 108 L150 108 Z" fill="#d8d2c6"/><rect x="146" y="62" width="28" height="3" fill="#8a6a56"/>`;
  g += `<rect x="156" y="88" width="8" height="20" fill="#e2dccf"/><path d="M158 88 Q158 80 160 79 Q162 80 162 88 Z" fill="#f2eee4"/><circle cx="160" cy="77.6" r="1.6" fill="#f2eee4"/>`;
  g += `<path d="M157.6 88 Q160 86 162.4 88 L162.6 96 Q160 97 157.4 96 Z" fill="#e8e2d4"/>`;
  g += `<rect x="141" y="56" width="38" height="3" fill="#f6f1e6"/>`;
  /* Marmorboden in Flucht */
  g += `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("boden", [[0, "#d8d4cc"], [1, "#bdb7ab"]])}"/>`;
  for (let i = -12; i <= 12; i++) {
    const xb = 160 + i * 16; let x2 = VP.x + (xb - VP.x) * (200 - VP.y) / (WU - VP.y), y2 = 200;
    if (x2 < 0 || x2 > 320) { const xr = x2 < 0 ? 0 : 320; y2 = VP.y + (WU - VP.y) * (xr - VP.x) / (xb - VP.x); x2 = xr; }
    g += `<line x1="${r(xb)}" y1="${WU}" x2="${r(x2)}" y2="${r(y2)}" stroke="#9e978a" stroke-width=".35"/>`;
  }
  for (const y of [124, 130, 139, 152, 172]) g += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#9e978a" stroke-width=".35"/>`;
  g += `<rect x="0" y="${WU}" width="320" height="80" fill="${S.lg("bodenglanz", [[0, "#000", 0.12], [0.3, "#fff", 0.1], [1, "#000", 0.1]])}"/>`;
  /* Lichtkegel der Bilderleuchten */
  for (const x of [86, 234]) g += `<path d="M${x - 4} 18 L${x + 4} 18 L${x + 46} 80 L${x - 46} 80 Z" fill="#fff4d8" opacity=".08"/><rect x="${x - 5}" y="18" width="10" height="2" rx=".8" fill="#3a3632"/>`;
  S.hinten(g);
}

/* Goldrahmen mit Profil und Messingschild */
function rahmen(x0, y0, w, h, schild) {
  let g = `<rect x="${x0 - 3}" y="${y0 - 3}" width="${w + 6}" height="${h + 6}" fill="${GOLD}"/>`;
  g += `<rect x="${x0 - 1.4}" y="${y0 - 1.4}" width="${w + 2.8}" height="${h + 2.8}" fill="none" stroke="#7e5a1c" stroke-width=".5"/>`;
  g += `<rect x="${x0 - 2.6}" y="${y0 - 2.6}" width="${w + 5.2}" height="${h + 5.2}" fill="none" stroke="#fff1b8" stroke-width=".3" opacity=".8"/>`;
  for (const [x, y] of [[x0 - 3, y0 - 3], [x0 + w + 3, y0 - 3], [x0 - 3, y0 + h + 3], [x0 + w + 3, y0 + h + 3]]) g += `<circle cx="${x}" cy="${y}" r="2" fill="${GOLD}"/>`;
  g += `<rect x="${x0 + w / 2 - 22}" y="${y0 + h + 6}" width="44" height="4" rx=".4" fill="${S.lg("messing", [[0, "#f0d890"], [1, "#a8843a"]])}"/>`;
  g += `<text x="${x0 + w / 2}" y="${y0 + h + 8.8}" font-size="1.9" text-anchor="middle" fill="#3a2a10" font-family="Georgia,serif">${schild}</text>`;
  return g;
}

/* =====================================================================
   1 — DAS FORUM ROMANUM (Vedute, links an der Wand) — Lupe
   ===================================================================== */
{
  const X = 44, Y = 26, W = 86, H = 56;
  const P = (x, y) => [X + x, Y + y];
  let k = rahmen(X, Y, W, H, "FORUM ROMANUM · Vedute um 1750");
  let b = `<rect width="${W}" height="${H}" fill="${S.lg("fhim", [[0, "#7fa8cf"], [0.55, "#e9dcc0"], [1, "#d8c49a"]])}"/>`;
  b += `<ellipse cx="62" cy="10" rx="14" ry="3" fill="#fff" opacity=".6"/>`;
  /* Hintergrund: Palatin, Kolosseum in der Ferne */
  b += `<path d="M0 34 Q20 26 42 30 Q60 24 86 28 L86 40 L0 40 Z" fill="#9aa87a"/>`;
  b += `<path d="M36 30 L36 24.6 Q42 23.4 48 24.6 L48 30 Z" fill="#d6c094"/>`;
  for (let i = 0; i < 6; i++) b += `<rect x="${36.8 + i * 1.9}" y="26" width=".9" height="1.4" fill="#8a7050"/><rect x="${36.8 + i * 1.9}" y="28.2" width=".9" height="1.4" fill="#8a7050"/>`;
  /* Ruine: Ziegelbögen der Maxentius-Basilika rechts hinten */
  b += `<path d="M64 36 L64 20 L84 18 L84 36 Z" fill="${S.lg("fziegel", [[0, "#c27a50"], [1, "#9a5a36"]])}"/>`;
  for (const x of [66, 74.6]) b += `<path d="M${x} 36 L${x} 26 Q${x + 3.6} 20 ${x + 7.2} 26 L${x + 7.2} 36 Z" fill="#6e3e26"/>`;
  b += `<path d="M64 20 L66 18.6 L68 20 L71 18 L74 19.6 L78 17.6 L84 18" fill="none" stroke="#8a4a2a" stroke-width=".6"/>`;
  /* Tempel mit Säulenvorhalle und Giebel (Antoninus und Faustina) */
  b += `<rect x="34" y="19" width="18" height="15" fill="#e2d2ae"/>`;
  b += `<path d="M32.6 19.4 L43 13 L53.4 19.4 Z" fill="#efe2c4" stroke="#b9a47a" stroke-width=".4"/><path d="M36 18.6 L43 14.4 L50 18.6 Z" fill="#d8c69c"/>`;
  b += `<rect x="33" y="19" width="20" height="2" fill="#d6c294"/>`;
  for (let i = 0; i < 6; i++) b += `<rect x="${34.4 + i * 3.2}" y="21" width="1.4" height="13" fill="#f4ead2"/><rect x="${34 + i * 3.2}" y="21" width="2.2" height=".8" fill="#e8d8b0"/>`;
  b += `<rect x="33" y="34" width="20" height="1.6" fill="#cbb688"/>`;
  /* Zypresse */
  b += `<path d="M57 38 Q55 26 57.6 12 Q60.4 26 58.6 38 Z" fill="${S.lg("zyp", [[0, "#3f5e34"], [1, "#22381e"]], 0, 0, 1, 0)}"/><rect x="57.4" y="37" width="1" height="2" fill="#5a4030"/>`;
  b += `<path d="M30 38 Q29 31 30.6 24 Q32.2 31 31.2 38 Z" fill="#2e4826"/>`;
  /* die drei Säulen des Castor-Tempels mit Gebälkstück */
  b += `<rect x="60.6" y="7.6" width="13" height="3.4" fill="#e9dcc0"/><rect x="60.6" y="7.6" width="13" height=".8" fill="#f6eedc"/>`;
  for (let i = 0; i < 3; i++) {
    const x = 61.6 + i * 4.4;
    b += `<rect x="${x}" y="13" width="2.4" height="28" fill="${S.lg("fsaeule", [[0, "#f6eedc"], [1, "#c9b68e"]], 0, 0, 1, 0)}"/>`;
    b += `<path d="M${x - 0.6} 13 L${x + 3} 13 L${x + 2.4} 11 L${x} 11 Z" fill="#e2d2ae"/><path d="M${x + 0.6} 14 L${x + 0.6} 40 M${x + 1.6} 14 L${x + 1.6} 40" stroke="#b9a47a" stroke-width=".2"/>`;
  }
  b += `<rect x="60" y="41" width="15" height="2.6" fill="#cbb688"/>`;
  /* der Triumphbogen (Septimius Severus): drei Durchgänge, Attika mit Inschrift */
  b += `<rect x="4" y="12" width="26" height="28" fill="${S.lg("bogenstein", [[0, "#efe2c4"], [1, "#c9b388"]], 0, 0, 1, 0)}"/>`;
  b += `<rect x="3.4" y="11" width="27.2" height="9" fill="#e6d6b0"/><rect x="3" y="19.6" width="28" height="1.2" fill="#d2be90"/>`;
  for (let i = 0; i < 4; i++) b += `<rect x="${7 - 0.4 + i * 6.6}" y="20.8" width="1.6" height="19" fill="#f6eedc"/>`;
  b += `<path d="M13 40 L13 30 Q17 24 21 30 L21 40 Z" fill="#4e3a28"/>`;
  b += `<path d="M5.2 40 L5.2 34 Q6.6 31.4 8 34 L8 40 Z M26 40 L26 34 Q27.4 31.4 28.8 34 L28.8 40 Z" fill="#4e3a28"/>`;
  for (let i = 0; i < 3; i++) b += `<rect x="${6}" y="${12.6 + i * 2.2}" width="22" height=".7" fill="#a8946a"/>`;
  /* Via Sacra: Basaltpflaster, das sich nach hinten zieht */
  b += `<path d="M22 ${H} L50 ${H} L42 38 L32 38 Z" fill="${S.lg("via", [[0, "#7a7468"], [1, "#4e4a44"]])}"/>`;
  for (let i = 0; i < 18; i++) { const t = rnd(), y = 38 + t * 18, half = 5 + t * 9, x = 37 + (rnd() - 0.5) * 2 * half; b += `<path d="M${r(x)} ${r(y)} l${r(1 + t)} ${r(-0.6)} l${r(0.8 + t)} ${r(0.8)} l${r(-1.2 - t)} ${r(0.7)} Z" fill="#8a8478"/>`; }
  /* Vordergrund: Erde, Gras, Säulentrommeln */
  b += `<path d="M0 40 L32 38 L22 ${H} L0 ${H} Z M42 38 L86 40 L86 ${H} L50 ${H} Z" fill="${S.lg("ferde", [[0, "#b8a27a"], [1, "#8a7652"]])}"/>`;
  b += `<path d="M0 46 q6 -2 12 0 M70 48 q6 -2 12 0" stroke="#7a8a52" stroke-width="1" fill="none"/>`;
  for (const [x, y, rr] of [[60, 50, 3.6], [69, 51.4, 3.2]]) b += `<rect x="${x - 6}" y="${y - rr}" width="10" height="${rr * 2}" fill="${S.lg("trommel", [[0, "#f0e4c8"], [1, "#b9a47a"]])}"/><ellipse cx="${x + 4}" cy="${y}" rx="1.4" ry="${rr}" fill="#e2d2ae" stroke="#a8946a" stroke-width=".3"/><path d="M${x - 6} ${y - rr * 0.4} h10 M${x - 6} ${y + rr * 0.4} h10" stroke="#b9a47a" stroke-width=".3"/>`;
  b += `<rect width="${W}" height="${H}" fill="${S.lg("firnis", [[0, "#fff4d0", 0.1], [1, "#3a2a10", 0.18]], 0, 0, 1, 1)}"/>`;
  k += `<g transform="translate(${X} ${Y})">${b}</g>`;
  const [ax, ay] = [X, Y];
  const unter = [
    U(["kastorsaeulen", "die drei Säulen", "DREI SÄU-len", "le tre colonne", "le TRE co-LON-ne", "the three columns"], ax + 60, ay + 7, ax + 75, ay + 44, "Sie gehörten zum Tempel von Castor und Pollux."),
    U(["triumphbogen", "der Triumphbogen", "Tri-UMPH-bo-gen", "l'arco di trionfo", "AR-co di tri-ON-fo", "triumphal arch"], ax + 3, ay + 21, ax + 12.6, ay + 40, "Kaiser Septimius Severus ließ ihn 203 n. Chr. für seine Siege bauen."),
    U(["durchgang", "der Durchgang", "DURCH-gang", "il passaggio", "pas-SAG-gio", "passageway"], ax + 13, ay + 26, ax + 21, ay + 40),
    U(["inschrift_f", "die Inschrift", "IN-schrift", "l'iscrizione", "i-scri-ZIO-ne", "inscription"], ax + 3.4, ay + 11, ax + 30.6, ay + 19.4),
    U(["tempel", "der Tempel", "TEM-pel", "il tempio", "TEM-pio", "temple"], ax + 33, ay + 20, ax + 53, ay + 36),
    U(["giebel_f", "der Giebel", "GIE-bel", "il frontone", "fron-TO-ne", "pediment"], ax + 33, ay + 12.6, ax + 53, ay + 19.6),
    U(["saeulentrommel", "die Säulentrommel", "SÄU-len-trom-mel", "il rocchio", "ROC-chio", "column drum"], ax + 53, ay + 46, ax + 75, ay + 55, "Säulen wurden aus einzelnen Trommeln aufeinandergesetzt."),
    U(["viasacra", "die Via Sacra", "VI-a SA-cra", "la Via Sacra", "VI-a SA-cra", "the Sacred Way"], ax + 26, ay + 42, ax + 48, ay + 56, "Die „Heilige Straße“: Hier zogen die siegreichen Feldherren durch das Forum."),
    U(["ruine_f", "die Ruine", "Ru-I-ne", "la rovina", "ro-VI-na", "ruin"], ax + 76, ay + 18, ax + 86, ay + 36),
    U(["zypresse", "die Zypresse", "Zy-PRES-se", "il cipresso", "ci-PRES-so", "cypress"], ax + 55, ay + 12, ax + 59.6, ay + 38),
  ];
  S.teil({ id: "d_forum", de: "das Forum Romanum", syl: "FO-rum Ro-MA-num", it: "il Foro Romano", itSyl: "FO-ro ro-MA-no", en: "Roman Forum", x: X + W / 2, y: Y + H + 10, kunst: abs(X + W / 2, Y + H + 10, k),
    zoom: { x: X - 4, y: Y - 4, w: W + 8, h: H + 8 }, unter,
    tipp: "Das Forum war Marktplatz, Gericht und Versammlungsort des antiken Rom." });
}

/* =====================================================================
   2 — DER TREVIBRUNNEN (Vedute, rechts an der Wand) — Lupe
   ===================================================================== */
{
  const X = 190, Y = 26, W = 86, H = 56;
  let k = rahmen(X, Y, W, H, "FONTANA DI TREVI · Vedute um 1760");
  let b = `<rect width="${W}" height="${H}" fill="${S.lg("thim", [[0, "#8ab4d8"], [1, "#e6e0cc"]])}"/>`;
  /* Palazzo Poli: Seitenflügel mit Fensterreihen */
  b += `<rect x="0" y="6" width="${W}" height="32" fill="${S.lg("palazzo", [[0, "#efe2c4"], [1, "#d6c294"]])}"/>`;
  for (const [x0, x1] of [[1, 20], [66, 85]]) for (let x = x0 + 1; x < x1 - 2; x += 4.4) for (const y of [9, 17, 25]) b += `<rect x="${x}" y="${y}" width="2.4" height="4.4" fill="#6e6250"/><rect x="${x - 0.5}" y="${y - 1}" width="3.4" height=".8" fill="#fbf3dc"/>`;
  /* Mittelteil als Triumphbogen: Attika mit Inschriftfeld, Statuen, Wappen */
  b += `<rect x="20" y="4" width="46" height="34" fill="${S.lg("mitte", [[0, "#f4e8cc"], [1, "#dccaa0"]])}"/>`;
  b += `<rect x="19" y="5" width="48" height="8" fill="#e8d8b0"/><rect x="19" y="12.6" width="48" height="1.4" fill="#cbb688"/>`;
  b += `<rect x="31" y="6" width="24" height="5.6" fill="#f6eedc" stroke="#b9a47a" stroke-width=".3"/>`;
  b += `<text x="43" y="8.6" font-size="1.7" text-anchor="middle" fill="#6e5a38" font-family="Georgia,serif" letter-spacing=".1">CLEMENS · XII · PONT · MAX</text><text x="43" y="10.8" font-size="1.4" text-anchor="middle" fill="#6e5a38" font-family="Georgia,serif">AQVAM VIRGINEM</text>`;
  for (const x of [22, 27, 59, 64]) b += `<rect x="${x - 0.8}" y="1.4" width="1.6" height="3.6" fill="#f2ece0"/><circle cx="${x}" cy="1" r=".8" fill="#f2ece0"/>`;
  b += `<path d="M39 4 Q43 -1 47 4 Z" fill="#e8d8b0"/><circle cx="43" cy="2.4" r="1.2" fill="#d6c294"/>`;
  /* korinthische Säulen (Paare) neben der Mittelnische */
  for (const x of [22, 26.4, 55.6, 60]) b += `<rect x="${x}" y="14" width="2.6" height="22" fill="${S.lg("tsaeule", [[0, "#fbf3dc"], [1, "#cdb98a"]], 0, 0, 1, 0)}"/><path d="M${x - 0.5} 14 L${x + 3.1} 14 L${x + 2.6} 15.6 L${x} 15.6 Z" fill="#e2cf9e"/>`;
  /* Seitennischen mit Statuen (Überfluss und Heilkraft, gewandet) */
  for (const x of [34, 49]) b += `<path d="M${x - 2} 32 L${x - 2} 24 Q${x} 21.6 ${x + 2} 24 L${x + 2} 32 Z" fill="#c9b68e"/><path d="M${x - 0.9} 31.6 Q${x - 1.2} 27 ${x} 25 Q${x + 1.2} 27 ${x + 0.9} 31.6 Z" fill="#f6f2e8"/><circle cx="${x}" cy="24.4" r=".6" fill="#f6f2e8"/>`;
  for (const x of [34, 49]) b += `<rect x="${x - 3}" y="16" width="6" height="4" fill="#e6d6ae" stroke="#c9b68e" stroke-width=".3"/>`;
  /* die Mittelnische mit Halbkuppel (Kassetten) und Oceanus */
  b += `<path d="M37 36 L37 22 Q43 14.6 49 22 L49 36 Z" fill="${S.lg("nische", [[0, "#b9a47a"], [1, "#d8c69c"]])}"/>`;
  for (let i = 0; i < 4; i++) b += `<path d="M${38.6 + i * 2.6} 21.4 L43 17" stroke="#a8946a" stroke-width=".3"/>`;
  const M = S.lg("marmor", [[0, "#fbf8f2"], [0.6, "#e2dccf"], [1, "#b5ad9e"]], 0, 0, 1, 0);
  b += `<path d="M41 35 L41.4 28 Q41 25.6 42 24.6 L44 24.6 Q45 25.6 44.6 28 L45 35 Z" fill="${M}"/>`;
  b += `<path d="M41.2 27 Q43 29.6 45 26.4 L45 31 Q43 32.6 41.2 31 Z" fill="#ebe5d8"/><path d="M41.6 29.4 q1.4 1 2.8 0" stroke="#b5ad9e" stroke-width=".25" fill="none"/>`;
  b += `<circle cx="43" cy="23.4" r="1.1" fill="${M}"/><path d="M42 23 q1 -1.4 2 0" stroke="#cfc8b8" stroke-width=".5" fill="none"/>`;
  b += `<path d="M44.6 26 L46.4 24.6" stroke="#e2dccf" stroke-width=".6" stroke-linecap="round"/>`;
  b += `<path d="M39.6 35 Q43 33.4 46.4 35 L46 36.6 L40 36.6 Z" fill="#ece6d8"/>`;
  /* Felsen (Travertin-Klippen) über die ganze Breite */
  b += `<path d="M8 44 Q10 38 16 39 Q20 35 26 37.6 Q30 34.6 36 36.6 Q43 34 50 36.6 Q56 34.6 60 37.6 Q66 35 70 39 Q76 38 78 44 Z" fill="${S.lg("fels", [[0, "#e4d6b4"], [1, "#b9a77e"]])}"/>`;
  b += `<path d="M16 39 q2 2 1 4 M26 37.6 q-1 2 1 4.4 M60 37.6 q1 2 -1 4.4 M70 39 q-2 2 -1 4" stroke="#a8946a" stroke-width=".4" fill="none"/>`;
  b += `<path d="M14 41 q2 -1 4 0 M64 41.6 q2 -1 3.4 .2" stroke="#7a9a5a" stroke-width=".7" fill="none"/>`;
  /* Tritonen mit Seepferden (gewandet), links und rechts */
  const triton = (x, s) => `<path d="M${x} 39.4 Q${x + s * 2} 36 ${x + s * 4.6} 37 Q${x + s * 6} 38.6 ${x + s * 5} 40.2 Q${x + s * 3} 41 ${x} 39.4 Z" fill="${M}"/>` +
    `<path d="M${x + s * 4.6} 37 Q${x + s * 6.4} 34.6 ${x + s * 6} 33.4 L${x + s * 7} 33.8 Q${x + s * 7} 35.6 ${x + s * 5.4} 37.6 Z" fill="${M}"/>` +
    `<path d="M${x + s * 1.4} 38.4 L${x + s * 1.6} 34.4 Q${x + s * 1.2} 33 ${x + s * 2} 32.6 Q${x + s * 2.8} 33 ${x + s * 2.6} 34.4 L${x + s * 2.8} 38.4 Z" fill="#ebe5d8"/><circle cx="${x + s * 2}" cy="32" r=".7" fill="${M}"/>` +
    `<path d="M${x + s * 2.4} 33.4 L${x + s * 3.8} 31.8" stroke="#d8d0c0" stroke-width=".55" stroke-linecap="round"/>`;
  b += triton(30, -1) + triton(56, 1);
  /* Wasser: Kaskaden und Becken */
  for (const x of [30, 38, 43, 48, 56]) b += `<path d="M${x - 1.2} 37 Q${x} 41 ${x - 0.6} 44 L${x + 1.4} 44 Q${x + 1} 41 ${x + 1.2} 37 Z" fill="#e8f6fa" opacity=".85"/>`;
  b += `<path d="M2 44 L84 44 L86 52 L0 52 Z" fill="${S.lg("wasser", [[0, "#5ec0d0"], [1, "#2e8ea6"]])}"/>`;
  b += `<path d="M10 46.6 h14 M40 48 h12 M62 46.4 h14" stroke="#c8f0f6" stroke-width=".4"/>`;
  b += `<path d="M0 52 L86 52 L86 ${H} L0 ${H} Z" fill="#d6c6a0"/><rect x="0" y="51.4" width="86" height="1.4" fill="#f0e6cc"/>`;
  b += `<path d="M0 ${H} L0 51 Q43 47 86 51 L86 ${H}" fill="none" stroke="#e2d2ae" stroke-width=".7"/>`;
  b += `<rect width="${W}" height="${H}" fill="${S.lg("firnis2", [[0, "#fff4d0", 0.1], [1, "#3a2a10", 0.16]], 0, 0, 1, 1)}"/>`;
  k += `<g transform="translate(${X} ${Y})">${b}</g>`;
  const ax = X, ay = Y;
  const unter = [
    U(["attika", "die Attika", "AT-ti-ka", "l'attico", "AT-ti-co", "attic"], ax + 19, ay + 0, ax + 30.6, ay + 13),
    U(["inschriftfeld", "das Inschriftfeld", "IN-schrift-feld", "l'iscrizione", "i-scri-ZIO-ne", "inscription panel"], ax + 31, ay + 5.6, ax + 55, ay + 12.4, "Papst Clemens XII. ließ den Brunnen ab 1732 bauen."),
    U(["trevisaeule", "die Säule", "SÄU-le", "la colonna", "co-LON-na", "column"], ax + 21.6, ay + 14, ax + 29.4, ay + 36),
    U(["mittelnische", "die Nische", "NI-sche", "la nicchia", "NIC-chia", "niche"], ax + 37, ay + 16, ax + 49, ay + 24),
    U(["oceanus", "die Figur", "Fi-GUR", "la statua", "STA-tua", "statue"], ax + 40, ay + 22.4, ax + 46, ay + 36, "In der Mitte steht Oceanus, der Gott aller Gewässer."),
    U(["triton", "der Triton", "Tri-TON", "il tritone", "tri-TO-ne", "triton"], ax + 55, ay + 31, ax + 64, ay + 41),
    U(["fels", "der Fels", "FELS", "la roccia", "ROC-cia", "rock"], ax + 8, ay + 37.6, ax + 24, ay + 44),
    U(["wasser", "das Wasser", "WAS-ser", "l'acqua", "AC-qua", "water"], ax + 36, ay + 36.6, ax + 52, ay + 44),
    U(["becken", "das Becken", "BE-cken", "la vasca", "VA-sca", "basin"], ax + 2, ay + 44.4, ax + 84, ay + 55, "Wer eine Münze ins Becken wirft, kommt nach Rom zurück."),
  ];
  S.teil({ id: "d_trevi", de: "der Trevibrunnen", syl: "TRE-vi-brun-nen", it: "la Fontana di Trevi", itSyl: "fon-TA-na di TRE-vi", en: "Trevi Fountain", x: X + W / 2, y: Y + H + 10, kunst: abs(X + W / 2, Y + H + 10, k),
    zoom: { x: X - 4, y: Y - 4, w: W + 8, h: H + 8 }, unter,
    tipp: "Der größte Barockbrunnen Roms, vollendet 1762." });
}

/* Sockel mit Absperrkordel und Messingschild */
function sockel(x0, x1, yTop, yFuss, schild, tiefe = 0) {
  const cx = (x0 + x1) / 2;
  let g = schatten(cx, yFuss + 0.4, (x1 - x0) / 2 + 4, 2.4, 0.35);
  if (tiefe) g += `<path d="M${x0 - 1.4} ${yTop - 1.4} L${x0 + 6} ${yTop - tiefe} L${x1 - 6} ${yTop - tiefe} L${x1 + 1.4} ${yTop - 1.4} Z" fill="${S.lg("sockeloben" + x0, [[0, "#4e3c2e"], [1, "#6a5240"]])}"/>`;
  g += `<rect x="${x0}" y="${yTop}" width="${x1 - x0}" height="${yFuss - yTop}" fill="${S.lg("sockelholz" + x0, [[0, "#3a2c24"], [0.5, "#54402f"], [1, "#2c201a"]], 0, 0, 1, 0)}"/>`;
  g += `<rect x="${x0 - 1.4}" y="${yTop - 2}" width="${x1 - x0 + 2.8}" height="2.6" fill="#6a5240"/><rect x="${x0 - 1}" y="${yFuss - 3}" width="${x1 - x0 + 2}" height="3" fill="#2a1e18"/>`;
  g += `<rect x="${cx - 26}" y="${yTop + 6}" width="52" height="5.4" rx=".5" fill="${S.lg("schild" + x0, [[0, "#f0d890"], [1, "#a8843a"]])}"/>`;
  g += `<text x="${cx}" y="${yTop + 9.4}" font-size="2.3" text-anchor="middle" fill="#3a2a10" font-family="Georgia,serif">${schild}</text>`;
  /* Kordel an Messingständern */
  for (const x of [x0 - 6, x1 + 6]) g += `<rect x="${x - 0.8}" y="${yFuss - 16}" width="1.6" height="16" fill="#c9a33a"/><circle cx="${x}" cy="${yFuss - 16.6}" r="1.4" fill="#e8c95a"/><ellipse cx="${x}" cy="${yFuss}" rx="3" ry=".8" fill="#a8843a"/>`;
  g += `<path d="M${x0 - 6} ${yFuss - 15} Q${cx} ${yFuss - 4} ${x1 + 6} ${yFuss - 15}" stroke="#8a1a22" stroke-width="1.2" fill="none"/>`;
  return g;
}

/* =====================================================================
   3 — DAS KOLOSSEUM (Korkmodell, links vorn) — Lupe
   ===================================================================== */
{
  const cx = 74, rx = 52, ry = 12, yT = 110, Hh = 30, yB = yT + Hh;
  const TB = 0.78;  /* ab hier (rechts) ist der Außenring eingestürzt */
  const pt = (t, h, a = rx, b = ry) => [r(cx + a * Math.cos(t)), r(yB + b * Math.sin(t) - h)];
  const kante = (t0, t1, h, a, b, n = 24) => { const o = []; for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; o.push(pt(t, h, a, b).join(" ")); } return o; };
  let k = sockel(cx - 58, cx + 58, 158, 186, "KOLOSSEUM · Korkmodell von Carl May", 30);
  /* Grundplatte */
  k += `<ellipse cx="${cx}" cy="${yB + 2}" rx="${rx + 6}" ry="${ry + 3.4}" fill="#8a7a62"/><ellipse cx="${cx}" cy="${yB + 1.4}" rx="${rx + 5}" ry="${ry + 2.6}" fill="${S.lg("platte", [[0, "#b9a888"], [1, "#9a8a6c"]])}"/>`;
  /* Innen: Ränge (Cavea) und Arena mit den Gängen des Hypogäums */
  k += `<ellipse cx="${cx}" cy="${yT}" rx="${rx}" ry="${ry}" fill="${KORK_D}"/>`;
  const raenge = [[49, 11.2, 0.6, "#c7a476"], [43, 9.8, 2.4, "#b38e60"], [37, 8.4, 4.2, "#c7a476"], [31, 7, 6, "#a8845a"]];
  for (const [a, b, d, f] of raenge) {
    k += `<ellipse cx="${cx}" cy="${yT + d}" rx="${a}" ry="${b}" fill="${f}"/>`;
    for (let i = 0; i < 14; i++) { const t = Math.PI + i * Math.PI / 13; k += `<rect x="${r(cx + a * Math.cos(t) - 0.5)}" y="${r(yT + d + b * Math.sin(t))}" width="1" height="1.1" fill="#4a3220"/>`; }
  }
  k += `<ellipse cx="${cx}" cy="${yT + 7.6}" rx="26" ry="5.6" fill="${S.lg("arena", [[0, "#d8bf94"], [1, "#b89c70"]])}"/>`;
  for (let i = -3; i <= 3; i++) k += `<line x1="${cx + i * 6}" y1="${r(yT + 3.4)}" x2="${cx + i * 6}" y2="${r(yT + 11.8)}" stroke="#7a5a38" stroke-width=".45"/>`;
  k += `<ellipse cx="${cx}" cy="${yT + 7.6}" rx="18" ry="3.6" fill="none" stroke="#7a5a38" stroke-width=".45"/><line x1="${cx - 24}" y1="${yT + 7.6}" x2="${cx + 24}" y2="${yT + 7.6}" stroke="#7a5a38" stroke-width=".45"/>`;
  /* Rechts: innerer Ring (zwei Geschosse) hinter dem eingestürzten Außenring */
  const ra = rx - 5, rb = ry - 1.2, hi = 19;
  k += `<path d="M${kante(TB, 0, hi, ra, rb).join(" L")} L${kante(0, TB, 0, ra, rb).join(" L")} Z" fill="${S.lg("innenring", [[0, "#b38e60"], [1, "#d1b182"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 6; i++) { const t = TB - (i + 0.5) * TB / 6, [x, y] = pt(t, 0, ra, rb), w = 2.6 * Math.sin(t) + 0.8; for (const h of [2, 11]) k += `<path d="M${r(x - w / 2)} ${r(y - h)} L${r(x - w / 2)} ${r(y - h - 5)} Q${r(x)} ${r(y - h - 6.6)} ${r(x + w / 2)} ${r(y - h - 5)} L${r(x + w / 2)} ${r(y - h)} Z" fill="#5e4228"/>`; }
  /* Außenring links: vier Geschosse */
  k += `<path d="M${kante(Math.PI, TB, Hh).join(" L")} L${kante(TB, Math.PI, 0).join(" L")} Z" fill="${KORK}"/>`;
  const geschosse = [[0, 8.6], [8.6, 16.8], [16.8, 25]];
  const N = 22;
  geschosse.forEach(([h0, h1]) => {
    for (let i = 0; i < N; i++) {
      const t = Math.PI - (i + 0.5) * Math.PI / N; if (t < TB + 0.04) continue;
      const [x, y] = pt(t, 0), w = 3.4 * Math.sin(t) + 0.5, top = y - h1 + 1.6, bot = y - h0 - 0.6;
      k += `<path d="M${r(x - w / 2)} ${r(bot)} L${r(x - w / 2)} ${r(top + w / 2)} Q${r(x)} ${r(top - 0.4)} ${r(x + w / 2)} ${r(top + w / 2)} L${r(x + w / 2)} ${r(bot)} Z" fill="#4a3220"/>`;
      const tc = Math.PI - (i + 1) * Math.PI / N; if (tc > TB) { const [xc, yc] = pt(tc, 0); k += `<rect x="${r(xc - 0.45)}" y="${r(yc - h1 + 0.6)}" width=".9" height="${r(h1 - h0 - 0.8)}" fill="#e9d2a8"/><rect x="${r(xc - 0.8)}" y="${r(yc - h1 + 0.4)}" width="1.6" height=".7" fill="#f2ddb4"/>`; }
    }
    k += `<path d="M${kante(Math.PI, TB, h1).join(" L")}" stroke="#ecd6ac" stroke-width=".9" fill="none"/>`;
  });
  /* Attikageschoss mit kleinen Fenstern und Pilastern */
  for (let i = 0; i < N; i++) { const t = Math.PI - (i + 0.5) * Math.PI / N; if (t < TB + 0.04 || i % 2) continue; const [x, y] = pt(t, 0); k += `<rect x="${r(x - 0.8)}" y="${r(y - 28.4)}" width="1.6" height="1.8" fill="#4a3220"/>`; }
  k += `<path d="M${kante(Math.PI, TB, Hh).join(" L")}" stroke="#f2ddb4" stroke-width=".8" fill="none"/>`;
  /* Bruchkante: der Außenring bricht treppenförmig ab */
  const [bx, by] = pt(TB, 0);
  k += `<path d="M${bx} ${r(by - Hh)} L${bx} ${r(by - 25)} L${r(bx + 2.4)} ${r(by - 25)} L${r(bx + 2.4)} ${r(by - 16.8)} L${r(bx + 5)} ${r(by - 16.8)} L${r(bx + 5)} ${r(by - 8.6)} L${r(bx + 8)} ${r(by - 8.6)} L${r(bx + 8)} ${r(by + 0.6)} L${bx} ${r(by + 0.6)} Z" fill="${S.lg("bruch", [[0, "#a8845a"], [1, "#d9b98c"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${bx} ${r(by - Hh)} L${bx} ${r(by - 25)} L${r(bx + 2.4)} ${r(by - 25)} L${r(bx + 2.4)} ${r(by - 16.8)} L${r(bx + 5)} ${r(by - 16.8)} L${r(bx + 5)} ${r(by - 8.6)} L${r(bx + 8)} ${r(by - 8.6)}" stroke="#5e4228" stroke-width=".5" fill="none"/>`;
  /* Reste des Außenrings rechts unten */
  k += `<path d="M${kante(TB - 0.12, 0, 6, rx, ry, 12).join(" L")} L${kante(0, TB - 0.12, 0, rx, ry, 12).join(" L")} Z" fill="${KORK}"/>`;
  for (let i = 0; i < 6; i++) { const t = (TB - 0.16) * (i + 0.5) / 6, [x, y] = pt(t, 0), w = 2.6 * Math.sin(t) + 0.5; k += `<rect x="${r(x - w / 2)}" y="${r(y - 5)}" width="${r(w)}" height="4.4" fill="#4a3220"/>`; }
  k += `<path d="M${kante(Math.PI, TB, Hh - 6).join(" L")}" stroke="#000" stroke-width=".25" opacity=".2" fill="none"/>`;
  /* Lichtkante links */
  k += `<path d="M${kante(Math.PI, 2.3, 15).join(" L")}" stroke="#fff" stroke-width="4" opacity=".08" fill="none"/>`;
  /* Lupe-Teile */
  const tA = Math.PI - 7.5 * Math.PI / N, [xa, ya] = pt(tA, 0), wa = 3.4 * Math.sin(tA) + 0.5;
  const tH = Math.PI - 5 * Math.PI / N, [xh, yh] = pt(tH, 0);
  const tK = Math.PI - 10 * Math.PI / N, [xk, yk] = pt(tK, 0);
  const tG = Math.PI - 13 * Math.PI / N, [xg, yg] = pt(tG, 0);
  const tS = Math.PI - 3 * Math.PI / N, [xs, ys] = pt(tS, 0);
  const tT = Math.PI - 9 * Math.PI / N, [xt, yt] = pt(tT, 0);
  const unter = [
    U(["kolosseumbogen", "der Bogen", "BO-gen", "l'arco", "AR-co", "arch"], xa - wa / 2 - 0.4, ya - 8.6, xa + wa / 2 + 0.4, ya - 0.4, "Unten hat das Kolosseum 80 Bögen – die Eingänge für die Zuschauer."),
    U(["halbsaeule", "die Halbsäule", "HALB-säu-le", "la semicolonna", "se-mi-co-LON-na", "half column"], xh - 1.4, yh - 16.4, xh + 1.4, yh - 9.4),
    U(["kapitell", "das Kapitell", "Ka-pi-TELL", "il capitello", "ca-pi-TEL-lo", "capital"], xk - 2, yk - 25.6, xk + 2, yk - 22.6, "Unten tuskisch, in der Mitte ionisch, oben korinthisch."),
    U(["gesims", "das Gesims", "Ge-SIMS", "il cornicione", "cor-ni-CIO-ne", "cornice"], xg - 4, yg - 18, xg + 4, yg - 16),
    U(["geschoss", "das Geschoss", "Ge-SCHOSS", "il piano", "PIA-no", "storey"], xs - 3, ys - 8.4, xs + 3, ys - 0.4),
    U(["attikageschoss", "das Attikageschoss", "AT-ti-ka-ge-schoss", "l'attico", "AT-ti-co", "attic storey"], xt - 5, yt - Hh - 0.4, xt + 5, yt - 25.4),
    U(["bruchkante", "die Bruchkante", "BRUCH-kan-te", "il fronte di rottura", "FRON-te di rot-TU-ra", "broken edge"], bx - 1, by - Hh, bx + 8.4, by - 9, "Erdbeben und Steinraub haben den Außenring auf der Südseite zerstört."),
    U(["innenrang", "der Innenrang", "IN-nen-rang", "la gradinata interna", "gra-di-NA-ta in-TER-na", "inner tier"], cx - 20, yT - 10, cx + 20, yT - 4, "Auf den Rängen saßen bis zu 50 000 Zuschauer."),
  ];
  S.teil({ id: "d_kolosseum", de: "das Kolosseum", syl: "Ko-los-SE-um", it: "il Colosseo", itSyl: "co-los-SE-o", en: "Colosseum", x: cx, y: 186, steht: true, kunst: abs(cx, 186, k),
    zoom: { x: cx - 58, y: yT - 18, w: 116, h: 74 }, unter,
    tipp: "Das Modell zeigt das Kolosseum, wie es um 1800 aussah – mit der eingestürzten Südseite." });
}

/* =====================================================================
   4 — DAS PANTHEON (Korkmodell, rechts vorn) — Lupe
   ===================================================================== */
{
  const cx = 262, yF = 186, yS = 150;
  let k = sockel(cx - 46, cx + 46, yS + 6, yF, "PANTHEON · Korkmodell von Carl May");
  k += `<rect x="${cx - 44}" y="${yS + 1}" width="88" height="5" fill="${S.lg("platte2", [[0, "#b9a888"], [1, "#8a7a62"]])}"/><path d="M${cx - 44} ${yS + 1} L${cx - 40} ${yS - 6} L${cx + 40} ${yS - 6} L${cx + 44} ${yS + 1} Z" fill="#c4b494"/>`;
  /* Rotunde (Zylinder) mit Gurtgesimsen, dahinter */
  const rr = 26, rc = yS - 12, rh = 22;
  k += `<path d="M${cx - rr} ${rc} L${cx - rr} ${rc - rh} A${rr} 6 0 0 1 ${cx + rr} ${rc - rh} L${cx + rr} ${rc} A${rr} 6 0 0 1 ${cx - rr} ${rc} Z" fill="${S.lg("rot", [[0, "#d9b98c"], [0.35, "#c9a676"], [1, "#7e5c3a"]], 0, 0, 1, 0)}"/>`;
  for (const h of [8, 15]) k += `<path d="M${cx - rr} ${rc - h} A${rr} 6 0 0 0 ${cx + rr} ${rc - h}" stroke="#a8845a" stroke-width=".6" fill="none"/>`;
  for (const x of [-20, -13, 13, 20]) k += `<rect x="${cx + x - 1}" y="${rc - 12}" width="2" height="3" fill="#5e4228" opacity=".7"/>`;
  /* Stufenringe und Kuppel mit Opaion */
  for (let i = 0; i < 3; i++) k += `<path d="M${cx - rr + 1 + i * 2.2} ${rc - rh - i * 1.6} A${rr - 1 - i * 2.2} ${5.6 - i * 0.4} 0 0 1 ${cx + rr - 1 - i * 2.2} ${rc - rh - i * 1.6}" stroke="#b08c5c" stroke-width="1.8" fill="none"/>`;
  k += `<path d="M${cx - rr + 5} ${rc - rh - 3} Q${cx - rr + 7} ${rc - rh - 22} ${cx} ${rc - rh - 24} Q${cx + rr - 7} ${rc - rh - 22} ${cx + rr - 5} ${rc - rh - 3} Z" fill="${S.lg("kup", [[0, "#cfd4d6"], [0.4, "#aab2b6"], [1, "#6e767a"]], 0, 0, 1, 0)}"/>`;
  for (let i = 1; i < 5; i++) k += `<path d="M${cx - rr + 5 + i * 1.6} ${rc - rh - 3 - i * 4.2} Q${cx} ${rc - rh - 3 - i * 4.2 - 2.4 + i * 0.4} ${cx + rr - 5 - i * 1.6} ${rc - rh - 3 - i * 4.2}" stroke="#8a9296" stroke-width=".35" fill="none"/>`;
  const oy = rc - rh - 21.6;
  k += `<ellipse cx="${cx}" cy="${oy}" rx="3.2" ry="1" fill="#2a2420"/><ellipse cx="${cx}" cy="${oy - 0.3}" rx="3.2" ry="1" fill="none" stroke="#e2e6e8" stroke-width=".4"/>`;
  /* Zwischenbau mit zweitem Giebel */
  k += `<rect x="${cx - 18}" y="${yS - 34}" width="36" height="24" fill="${KORK}"/><path d="M${cx - 19} ${yS - 34} L${cx} ${yS - 42} L${cx + 19} ${yS - 34} Z" fill="${KORK_H}" stroke="#8e6a42" stroke-width=".4"/>`;
  /* Vorhalle: Dach, Giebel, Gebälk mit Inschrift, acht Säulen */
  k += `<path d="M${cx - 21} ${yS - 26} L${cx} ${yS - 36} L${cx + 21} ${yS - 26} Z" fill="${S.lg("giebel", [[0, "#ecd4a8"], [1, "#c9a676"]])}" stroke="#8e6a42" stroke-width=".5"/>`;
  k += `<path d="M${cx - 16} ${yS - 26.6} L${cx} ${yS - 33.6} L${cx + 16} ${yS - 26.6} Z" fill="#b8956a"/>`;
  k += `<rect x="${cx - 21}" y="${yS - 26}" width="42" height="5" fill="#e4c89c"/><rect x="${cx - 21}" y="${yS - 26}" width="42" height=".9" fill="#f2ddb4"/>`;
  k += `<text x="${cx}" y="${yS - 22.6}" font-size="1.9" text-anchor="middle" fill="#5e4228" font-family="Georgia,serif" letter-spacing=".05">M·AGRIPPA·L·F·COS·TERTIVM·FECIT</text>`;
  k += `<rect x="${cx - 20}" y="${yS - 21}" width="40" height="17" fill="#3e2a1a"/>`;
  k += `<path d="M${cx - 12} ${yS - 4} L${cx - 12} ${yS - 15} Q${cx} ${yS - 19} ${cx + 12} ${yS - 15} L${cx + 12} ${yS - 4} Z" fill="#2a1c12"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${cx - 15 + i * 9.2}" y="${yS - 20}" width="1.6" height="15" fill="#8e6a42"/>`;
  for (let i = 0; i < 8; i++) {
    const x = cx - 19 + i * 5.3;
    k += `<rect x="${r(x)}" y="${yS - 19.6}" width="2.8" height="15.4" fill="${S.lg("psaeule", [[0, "#f2ddb4"], [0.5, "#d9b98c"], [1, "#9a7448"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${r(x - 0.8)} ${yS - 21} L${r(x + 3.6)} ${yS - 21} L${r(x + 2.8)} ${yS - 19.4} L${r(x)} ${yS - 19.4} Z" fill="#ecd4a8"/><path d="M${r(x - 0.4)} ${yS - 20.6} q.6 -.6 1.2 0 M${r(x + 2)} ${yS - 20.6} q.6 -.6 1.2 0" stroke="#9a7448" stroke-width=".25" fill="none"/>`;
    k += `<rect x="${r(x - 0.4)}" y="${yS - 4.4}" width="3.6" height="1" fill="#c9a676"/>`;
  }
  k += `<rect x="${cx - 22}" y="${yS - 3.4}" width="44" height="1.8" fill="#d9b98c"/><rect x="${cx - 23}" y="${yS - 1.6}" width="46" height="2" fill="#c4a476"/>`;
  const unter = [
    U(["kuppel", "die Kuppel", "KUP-pel", "la cupola", "CU-po-la", "dome"], cx - 20, rc - rh - 19, cx - 6, rc - rh - 4, "Die Kuppel ist 43 Meter weit – bis heute die größte aus unbewehrtem Beton."),
    U(["opaion", "das Opaion", "O-pai-on", "l'oculo", "O-cu-lo", "oculus"], cx - 4.4, oy - 2, cx + 4.4, oy + 1.6, "Die runde Öffnung oben ist 9 Meter breit; es regnet hinein."),
    U(["rotunde", "die Rotunde", "Ro-TUN-de", "la rotonda", "ro-TON-da", "rotunda"], cx + 19.4, rc - rh, cx + rr, rc + 2),
    U(["giebel", "der Giebel", "GIE-bel", "il frontone", "fron-TO-ne", "pediment"], cx - 12, yS - 34, cx + 12, yS - 26.4),
    U(["inschrift", "die Inschrift", "IN-schrift", "l'iscrizione", "i-scri-ZIO-ne", "inscription"], cx - 20.6, yS - 25, cx + 20.6, yS - 21.4, "„Marcus Agrippa, Sohn des Lucius, dreimal Konsul, hat es gebaut.“"),
    U(["pantheonkapitell", "das Kapitell", "Ka-pi-TELL", "il capitello", "ca-pi-TEL-lo", "capital"], cx - 20, yS - 21.2, cx - 15.4, yS - 18.8),
    U(["pantheonsaeule", "die Säule", "SÄU-le", "la colonna", "co-LON-na", "column"], cx + 12, yS - 18.4, cx + 16, yS - 4.4, "Jede Säule der Vorhalle ist ein einziger Granitblock aus Ägypten."),
    U(["portikus", "der Portikus", "POR-ti-kus", "il portico", "POR-ti-co", "portico"], cx - 8, yS - 18.4, cx + 8, yS - 6),
  ];
  S.teil({ id: "d_pantheon", de: "das Pantheon", syl: "PAN-the-on", it: "il Pantheon", itSyl: "PAN-the-on", en: "Pantheon", x: cx, y: yF, steht: true, kunst: abs(cx, yF, k),
    zoom: { x: cx - 46, y: rc - rh - 30, w: 92, h: 62 }, unter,
    tipp: "Ein Tempel für alle Götter, heute eine Kirche." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/rom_detail.js"));
console.log(aus);
