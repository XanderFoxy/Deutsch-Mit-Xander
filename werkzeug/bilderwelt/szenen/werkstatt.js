#!/usr/bin/env node
/* =====================================================================
   DIE WERKSTATT (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Tischlerei- und Heimwerkerwerkstatt: Hobelbank-Hersteller,
   Ratgeber „Werkstatt einrichten“, Arbeitsschutz an der
   Tischkreissäge) — so sieht eine kleine Holzwerkstatt aus:
   - An der Wand die HOBELBANK aus Buche (Vorderzange links, Löcher für
     die Bankhaken), darüber die WERKZEUGWAND aus OSB-Platten: Säge,
     Hammer, Zangen, Schraubendreher, Stechbeitel, Wasserwaage — jedes
     Werkzeug an seinem Haken.
   - Daneben ein SORTIMENTSKASTEN mit kleinen Schubladen: Nägel,
     Schrauben, Dübel, Muttern.
   - Mitten im Raum die TISCHKREISSÄGE mit Schutzhaube, Spaltkeil und
     Parallelanschlag; der Tischler schiebt das Brett mit Schutzbrille.
   - Ein KRAGARMREGAL mit Brettern und Bohlen, eine angelehnte LEITER,
     Helm und Gehörschutz am Haken, Arbeitshandschuhe.
   - Ein Werkstück wird verleimt: SCHRAUBZWINGEN halten es fest.
   - Sägespäne auf dem Betonboden, Tageslicht durchs Fenster.
   Maßstab (eine Augenhöhe, Fluchtpunkt 160/−4):
   Rückwand ≈ 32 Einheiten je Meter, Säge ≈ 43, vorne ≈ 49.
   Tischler 1,80 m, Hobelbank 0,85 m, Kreissägentisch 0,87 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "werkstatt", titel: "Die Werkstatt", emoji: "🔧", thema: "Arbeit", kuerzel: "b07c", fassung: 852 });
const rnd = zufall(1517);
const r = B.r;

const VP = { x: 160, y: -4 };
const M = (y) => 0.25 * (y - VP.y);
const fx = (X, y) => VP.x + X * M(y);
const WAND_UNTEN = 124;

/* ---------- Grundfarben und Stoffe ---------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b2b9bf"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const BUCHE = S.lg("buche", [[0, "#e3b98a"], [1, "#c99a66"]]);
const BUCHE_V = S.lg("buchev", [[0, "#c99a66"], [0.5, "#dcb07e"], [1, "#bf8f5b"]], 0, 0, 1, 0);
const FICHTE = S.lg("fichte", [[0, "#f0d7a6"], [1, "#d9b77c"]]);
const GRIFF = S.lg("griff", [[0, "#d7a868"], [1, "#a8743a"]]);

/* =====================================================================
   KULISSE — Putzwand, Fenster mit Tageslicht, Betonboden mit Spänen
   ===================================================================== */
const FEN = { x0: 154, x1: 222, y0: 28, y1: 82 };
{
  let k = `<rect x="0" y="0" width="320" height="${WAND_UNTEN}" fill="${S.lg("wand", [[0, "#efe9de"], [1, "#e2d9c9"]])}"/>`;
  for (let i = 0; i < 120; i++) { const x = rnd() * 320, y = rnd() * WAND_UNTEN; k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.3 + rnd() * 0.5)}" fill="${rnd() < 0.5 ? "#d4c9b5" : "#f8f3ea"}" opacity=".5"/>`; }
  /* Fenster: Holzrahmen, Sprosse, draußen Bäume und Himmel */
  k += `<rect x="${FEN.x0 - 3}" y="${FEN.y0 - 3}" width="${FEN.x1 - FEN.x0 + 6}" height="${FEN.y1 - FEN.y0 + 6}" fill="#f6f2ea"/>`;
  k += `<rect x="${FEN.x0}" y="${FEN.y0}" width="${FEN.x1 - FEN.x0}" height="${FEN.y1 - FEN.y0}" fill="${S.lg("himmel", [[0, "#9fcbe8"], [1, "#dcecf5"]])}"/>`;
  for (let i = 0; i < 30; i++) k += `<circle cx="${r(FEN.x0 + rnd() * (FEN.x1 - FEN.x0))}" cy="${r(FEN.y1 - 4 - rnd() * 22)}" r="${r(3 + rnd() * 4)}" fill="${rnd() < 0.5 ? "#7fae5e" : "#5f8f45"}" opacity=".9"/>`;
  k += `<rect x="${FEN.x0}" y="${FEN.y1 - 6}" width="${FEN.x1 - FEN.x0}" height="6" fill="#8a7a62"/>`;
  k += `<path d="M${FEN.x0 + 6} ${FEN.y1} L${FEN.x0 + 26} ${FEN.y0} L${FEN.x0 + 36} ${FEN.y0} L${FEN.x0 + 16} ${FEN.y1} Z" fill="#fff" opacity=".25"/>`;
  k += `<rect x="${FEN.x0}" y="${FEN.y0}" width="${FEN.x1 - FEN.x0}" height="${FEN.y1 - FEN.y0}" fill="none" stroke="#e9e4da" stroke-width="2.2"/>`;
  k += `<rect x="${(FEN.x0 + FEN.x1) / 2 - 1}" y="${FEN.y0}" width="2" height="${FEN.y1 - FEN.y0}" fill="#e9e4da"/><rect x="${FEN.x0}" y="${(FEN.y0 + FEN.y1) / 2 - 1}" width="${FEN.x1 - FEN.x0}" height="2" fill="#e9e4da"/>`;
  k += `<rect x="${FEN.x0 - 5}" y="${FEN.y1 + 2}" width="${FEN.x1 - FEN.x0 + 10}" height="2.4" fill="#d9d2c4"/>`;
  /* Lichtfall vom Fenster auf Wand und Boden */
  k += `<path d="M${FEN.x0} ${FEN.y1 + 4} L${FEN.x0 - 30} ${WAND_UNTEN} L${FEN.x1 + 10} ${WAND_UNTEN} L${FEN.x1} ${FEN.y1 + 4} Z" fill="#fff8e0" opacity=".18"/>`;
  /* Sockelleiste */
  k += `<rect x="0" y="${WAND_UNTEN - 2.6}" width="320" height="2.6" fill="#8b7b64"/>`;
  /* Steckdosenleiste über der Werkbank, Kabelkanal */
  k += `<rect x="4" y="99.5" width="100" height="2.6" rx=".4" fill="#f4f2ee" stroke="#c9c2b4" stroke-width=".25"/>`;
  for (const x of [20, 30, 40]) k += `<circle cx="${x}" cy="100.8" r=".9" fill="#d9d2c4"/>`;
  S.hinten(k);
}
{
  let f = `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("beton", [[0, "#a8a296"], [1, "#beb8ab"]])}"/>`;
  for (let i = 0; i < 160; i++) { const y = WAND_UNTEN + rnd() * 76, x = rnd() * 320; f += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.2 + rnd() * 0.5)}" fill="${rnd() < 0.5 ? "#958f83" : "#cbc5b8"}" opacity=".55"/>`; }
  for (const y of [146, 176]) f += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#8d877b" stroke-width=".3" opacity=".6"/>`;
  for (let X = -9; X <= 9; X += 3) f += `<line x1="${r(fx(X, WAND_UNTEN))}" y1="${WAND_UNTEN}" x2="${r(fx(X, 200))}" y2="200" stroke="#8d877b" stroke-width=".3" opacity=".55"/>`;
  /* Sägespäne unter der Kreissäge und vor der Hobelbank */
  for (const [cx, cy, rx, n] of [[182, 172, 26, 140], [56, 128, 30, 70]]) {
    f += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${r(rx / 6)}" fill="#e2c48d" opacity=".55" filter="url(#bw_weich)"/>`;
    for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()); f += `<ellipse cx="${r(cx + Math.cos(a) * d * rx)}" cy="${r(cy + Math.sin(a) * d * rx / 6)}" rx="${r(0.3 + rnd() * 0.5)}" ry=".25" fill="${rnd() < 0.5 ? "#f0d8a8" : "#d4ae6e"}"/>`; }
  }
  f += `<path d="M${FEN.x0 - 30} ${WAND_UNTEN} L${FEN.x1 + 10} ${WAND_UNTEN} L${FEN.x1 + 40} 160 L${FEN.x0 - 60} 160 Z" fill="#fff8e0" opacity=".1"/>`;
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="1" fill="#7d776b"/>`;
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.14], [0.4, "#000", 0], [1, "#fff", 0.05]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DIE WERKZEUGWAND (OSB-Platte) — Lupe mit dem Handwerkzeug
   ===================================================================== */
const WW = { x0: 8, x1: 100, y0: 38, y1: 90 };
{
  S.def(`<pattern id="${S.id("osb")}" width="9" height="7" patternUnits="userSpaceOnUse"><rect width="9" height="7" fill="#d8b77e"/><path d="M1 1 l3 .6 M5 2.4 l3 -.8 M2 4 l2.6 1 M6 5.4 l2 -.4 M.4 6 l1.8 -.6 M3.6 2.6 l1 1.6" stroke="#b58f55" stroke-width=".6" stroke-linecap="round"/><path d="M7 .6 l1.4 1.2 M1.6 2.6 l-.8 1 M4.6 6.4 l1.6 -.2" stroke="#ecd3a4" stroke-width=".6" stroke-linecap="round"/></pattern>`);
  const W = WW.x1 - WW.x0, H = WW.y1 - WW.y0, cx = (WW.x0 + WW.x1) / 2;
  const X = (x) => x - cx, Y = (y) => y - WW.y1;
  let k = `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="url(#${S.id("osb")})"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${S.lg("osblicht", [[0, "#fff", 0.12], [1, "#000", 0.08]])}"/>`;
  k += `<line x1="${X(54)}" y1="${-H}" x2="${X(54)}" y2="0" stroke="#a88650" stroke-width=".4"/>`;
  const nagelK = (x, y) => `<circle cx="${r(X(x))}" cy="${r(Y(y))}" r=".45" fill="#7d868d"/>`;
  const unter = [];
  /* a) Säge (Fuchsschwanz), waagerecht an zwei Nägeln */
  let g = nagelK(16, 44.4) + nagelK(28, 44.4);
  g += `<path d="M${r(X(12))} ${r(Y(45))} L${r(X(30))} ${r(Y(45))} L${r(X(30))} ${r(Y(49.4))} L${r(X(12))} ${r(Y(47.2))} Z" fill="${S.lg("blatt", [[0, "#eef1f3"], [1, "#aeb6bd"]])}"/>`;
  g += `<path d="M${r(X(12))} ${r(Y(47.2))} ${Array.from({ length: 18 }, (_, i) => `L${r(X(12 + i + 0.5))} ${r(Y(47.5 + i * 0.12))} L${r(X(13 + i))} ${r(Y(47.3 + i * 0.12))}`).join(" ")}" stroke="#8d969c" stroke-width=".25" fill="none"/>`;
  g += `<path d="M${r(X(29.4))} ${r(Y(44))} L${r(X(35))} ${r(Y(44))} Q${r(X(36))} ${r(Y(47))} ${r(X(35))} ${r(Y(50.4))} L${r(X(30.6))} ${r(Y(50.4))} Q${r(X(29.4))} ${r(Y(47.4))} ${r(X(29.4))} ${r(Y(44))} Z" fill="${GRIFF}"/><ellipse cx="${r(X(32.4))}" cy="${r(Y(47.2))}" rx="1.4" ry="1.8" fill="#e9e1d2"/>`;
  k += g;
  unter.push({ id: "saege", de: "die Säge", syl: "SÄ-ge", it: "la sega", itSyl: "SE-ga", en: "saw", x: 24, y: 51.5, kunst: flaeche(-13, -9, 26, 9.5),
    tipp: "Mit dem Fuchsschwanz sägt man Bretter und Latten." });
  /* b) Hammer (Schlosser- und Klauenhammer), Kopf oben */
  g = "";
  for (const [x, kl] of [[41, false], [47, true]]) {
    g += nagelK(x - 1.6, 43.6) + nagelK(x + 1.6, 43.6);
    g += `<rect x="${r(X(x - 0.7))}" y="${r(Y(45))}" width="1.4" height="10" rx=".6" fill="${GRIFF}"/>`;
    g += kl ? `<path d="M${r(X(x - 3.4))} ${r(Y(44.2))} L${r(X(x + 1.8))} ${r(Y(44.2))} L${r(X(x + 1.8))} ${r(Y(46.4))} L${r(X(x - 1))} ${r(Y(46.4))} Q${r(X(x - 2.6))} ${r(Y(47.6))} ${r(X(x - 3.8))} ${r(Y(46.8))} Z" fill="#4a5258"/>`
      : `<rect x="${r(X(x - 3))}" y="${r(Y(44.2))}" width="6" height="2.4" rx=".3" fill="#4a5258"/><rect x="${r(X(x - 3))}" y="${r(Y(44.2))}" width="6" height=".7" fill="#9aa3aa"/>`;
  }
  k += g;
  unter.push({ id: "hammer", de: "der Hammer", syl: "HAM-mer", it: "il martello", itSyl: "mar-TEL-lo", en: "hammer", x: 44, y: 56, kunst: flaeche(-6, -13, 12, 13.5),
    tipp: "Mit dem Hammer schlägt man Nägel ins Holz." });
  /* c) Zangen: Kombizange, Kneifzange, Wasserpumpenzange */
  g = "";
  for (const [x, f, typ] of [[55, "#c0392b", 0], [59.4, "#2a6db3", 1], [64, "#e5b912", 2]]) {
    g += nagelK(x, 43.4);
    g += typ === 1 ? `<path d="M${r(X(x - 1.2))} ${r(Y(44.2))} Q${r(X(x))} ${r(Y(43.4))} ${r(X(x + 1.2))} ${r(Y(44.2))} L${r(X(x + 0.6))} ${r(Y(46.6))} L${r(X(x - 0.6))} ${r(Y(46.6))} Z" fill="#59616a"/>`
      : `<path d="M${r(X(x - 0.8))} ${r(Y(44))} L${r(X(x + 0.8))} ${r(Y(44))} L${r(X(x + 0.5))} ${r(Y(47))} L${r(X(x - 0.5))} ${r(Y(47))} Z" fill="#59616a"/>`;
    g += `<circle cx="${r(X(x))}" cy="${r(Y(47.4))}" r=".6" fill="#7d868d"/>`;
    g += `<path d="M${r(X(x - 0.4))} ${r(Y(47.8))} L${r(X(x - 1.6))} ${r(Y(55))} L${r(X(x - 0.7))} ${r(Y(55.2))} L${r(X(x))} ${r(Y(48.2))} Z M${r(X(x + 0.4))} ${r(Y(47.8))} L${r(X(x + 1.6))} ${r(Y(55))} L${r(X(x + 0.7))} ${r(Y(55.2))} L${r(X(x))} ${r(Y(48.2))} Z" fill="${f}"/>`;
  }
  k += g;
  unter.push({ id: "zange", de: "die Zange", syl: "ZAN-ge", it: "la pinza", itSyl: "PIN-za", en: "pliers", x: 59.5, y: 56, kunst: flaeche(-7, -13.4, 14, 13.8),
    tipp: "Mit der Kneifzange zieht man krumme Nägel wieder heraus." });
  /* d) Schraubendreher in einer Halteleiste */
  g = `<rect x="${r(X(68))}" y="${r(Y(44))}" width="14" height="1.6" rx=".4" fill="#8a6a3e"/>`;
  for (let i = 0; i < 5; i++) {
    const x = 69.6 + i * 2.7;
    g += `<rect x="${r(X(x - 0.8))}" y="${r(Y(42.2))}" width="1.6" height="4" rx=".7" fill="${i % 2 ? "#e5b912" : "#c0392b"}"/><rect x="${r(X(x - 0.22))}" y="${r(Y(45.6))}" width=".44" height="${r(5 + (i % 3))}" fill="#d9dee2"/>`;
  }
  k += g;
  unter.push({ id: "schraubendreher", de: "der Schraubendreher", syl: "SCHRAU-ben-dre-her", it: "il cacciavite", itSyl: "cac-cia-VI-te", en: "screwdriver", x: 75, y: 53.5, kunst: flaeche(-7.6, -12, 15.2, 12.4),
    tipp: "Man sagt auch „Schraubenzieher“ — richtig heißt er Schraubendreher." });
  /* e) Stechbeitel (Satz mit Holzgriffen) */
  g = `<rect x="${r(X(84))}" y="${r(Y(44))}" width="14" height="1.6" rx=".4" fill="#8a6a3e"/>`;
  for (let i = 0; i < 4; i++) {
    const x = 86 + i * 3.4, b = 0.5 + i * 0.25;
    g += `<rect x="${r(X(x - 0.8))}" y="${r(Y(41.6))}" width="1.6" height="4.4" rx=".6" fill="${GRIFF}"/><rect x="${r(X(x - 0.9))}" y="${r(Y(45.4))}" width="1.8" height=".6" fill="#b08d57"/>`;
    g += `<path d="M${r(X(x - b / 2))} ${r(Y(46))} L${r(X(x + b / 2))} ${r(Y(46))} L${r(X(x + b / 2 + 0.2))} ${r(Y(51.6))} L${r(X(x - b / 2 - 0.2))} ${r(Y(51.6))} Z" fill="#c9cfd4"/>`;
  }
  k += g;
  unter.push({ id: "stechbeitel", de: "der Stechbeitel", syl: "STECH-bei-tel", it: "lo scalpello", itSyl: "scal-PEL-lo", en: "chisel", x: 91, y: 52.6, kunst: flaeche(-7.4, -11.6, 14.8, 12) });
  /* f) Wasserwaage (waagerecht an zwei Haken) */
  g = nagelK(14, 61.6) + nagelK(30, 61.6);
  g += `<rect x="${r(X(12))}" y="${r(Y(62))}" width="20" height="3" rx=".4" fill="${S.lg("waage", [[0, "#f2d03a"], [1, "#d1a816"]])}"/><rect x="${r(X(12))}" y="${r(Y(62))}" width="1.4" height="3" fill="#c0392b"/><rect x="${r(X(30.6))}" y="${r(Y(62))}" width="1.4" height="3" fill="#c0392b"/>`;
  g += `<rect x="${r(X(20))}" y="${r(Y(62.6))}" width="4" height="1.8" rx=".8" fill="#9ee07a" stroke="#4a5258" stroke-width=".2"/><circle cx="${r(X(22))}" cy="${r(Y(63.5))}" r=".5" fill="#e9ffd9"/><line x1="${r(X(21.2))}" y1="${r(Y(62.6))}" x2="${r(X(21.2))}" y2="${r(Y(64.4))}" stroke="#2a2d31" stroke-width=".15"/><line x1="${r(X(22.8))}" y1="${r(Y(62.6))}" x2="${r(X(22.8))}" y2="${r(Y(64.4))}" stroke="#2a2d31" stroke-width=".15"/>`;
  k += g;
  unter.push({ id: "wasserwaage", de: "die Wasserwaage", syl: "WAS-ser-waa-ge", it: "la livella", itSyl: "li-VEL-la", en: "spirit level", x: 22, y: 66, kunst: flaeche(-11, -5, 22, 5.4),
    tipp: "Steht die Luftblase genau in der Mitte, ist das Brett waagerecht." });
  /* g) weitere Werkzeuge (nur Bild): Anschlagwinkel, Feilen, Bohrerkassette, Maßband */
  k += nagelK(40, 60.6) + `<path d="M${r(X(38))} ${r(Y(61))} L${r(X(39.4))} ${r(Y(61))} L${r(X(39.4))} ${r(Y(70))} L${r(X(46))} ${r(Y(70))} L${r(X(46))} ${r(Y(71.4))} L${r(X(38))} ${r(Y(71.4))} Z" fill="#c9cfd4"/><rect x="${r(X(37.6))}" y="${r(Y(61))}" width="2.4" height="6" fill="#59616a"/>`;
  for (let i = 0; i < 3; i++) k += nagelK(52 + i * 2.6, 60) + `<rect x="${r(X(51.6 + i * 2.6))}" y="${r(Y(60.6))}" width=".8" height="3" fill="#7a5a36"/><rect x="${r(X(51.7 + i * 2.6))}" y="${r(Y(63.6))}" width=".6" height="${7 + i}" fill="#7d868d"/>`;
  k += `<rect x="${r(X(62))}" y="${r(Y(61))}" width="16" height="7" rx=".8" fill="#2a6db3"/><rect x="${r(X(63))}" y="${r(Y(62.2))}" width="14" height="4.6" fill="#173d70"/>`;
  for (let i = 0; i < 10; i++) k += `<rect x="${r(X(63.6 + i * 1.35))}" y="${r(Y(62.6 + (i % 3) * 0.4))}" width=".5" height="${r(3.6 - (i % 3) * 0.4)}" fill="#c9cfd4"/>`;
  k += nagelK(86, 60) + `<rect x="${r(X(82.6))}" y="${r(Y(61))}" width="7" height="7" rx="1.6" fill="#e5b912"/><circle cx="${r(X(86.1))}" cy="${r(Y(64.5))}" r="1.8" fill="#2a2d31"/><rect x="${r(X(88))}" y="${r(Y(66.4))}" width="3" height=".8" fill="#f2d03a"/>`;
  /* Schleifpapier, Schutzbrille (unten) */
  k += nagelK(30, 74) + `<rect x="${r(X(24))}" y="${r(Y(74.4))}" width="12" height="8" rx=".3" fill="#c4935c"/><rect x="${r(X(25))}" y="${r(Y(75.6))}" width="10" height="5.6" fill="#a87a48"/><text x="${r(X(30))}" y="${r(Y(79))}" font-size="1.8" text-anchor="middle" fill="#3a2a18" font-family="Arial" font-weight="bold">K 120</text>`;
  S.teil({ id: "ws_werkzeugwand", de: "die Werkzeugwand", syl: "WERK-zeug-wand", it: "la parete portautensili", itSyl: "pa-RE-te por-ta-u-TEN-si-li", en: "tool wall", x: cx, y: WW.y1, kunst: k,
    zoom: { x: WW.x0 - 2, y: WW.y0 - 2, w: W + 4, h: 64 },
    unter,
    tipp: "Ordnung ist alles: Jedes Werkzeug hängt an seinem Platz." });
}

/* =====================================================================
   2 — DER SORTIMENTSKASTEN — Lupe mit Nägeln, Schrauben, Dübeln, Muttern
   ===================================================================== */
const SK = { x0: 106, x1: 146, y0: 40, y1: 72 };
{
  const W = SK.x1 - SK.x0, H = SK.y1 - SK.y0, cx = (SK.x0 + SK.x1) / 2;
  let k = schatten(0, 1, W / 2, 1, .2);
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" rx="1" fill="${S.lg("kasten", [[0, "#3f6fa8"], [1, "#2b5687"]])}"/>`;
  const reihen = [
    ["nagel", "der Nagel", "NA-gel", "il chiodo", "CHIO-do", "nail", "Nägel"],
    ["schraube", "die Schraube", "SCHRAU-be", "la vite", "VI-te", "screw", "Schrauben"],
    ["duebel", "der Dübel", "DÜ-bel", "il tassello", "tas-SEL-lo", "wall plug", "Dübel"],
    ["mutter", "die Mutter", "MUT-ter", "il dado", "DA-do", "nut", "Muttern"],
  ];
  const unter = [];
  const zh = (H - 2) / 4, zw = (W - 2) / 4;
  reihen.forEach(([id, de, syl, it, itSyl, en, etikett], ri) => {
    const y = -H + 1 + ri * zh;
    for (let s = 0; s < 4; s++) {
      const x = -W / 2 + 1 + s * zw;
      k += `<rect x="${r(x + 0.4)}" y="${r(y + 0.4)}" width="${r(zw - 0.8)}" height="${r(zh - 0.8)}" rx=".4" fill="#e9f2f5" opacity=".85"/>`;
      /* Inhalt sichtbar durch die durchsichtige Front */
      for (let i = 0; i < 6; i++) {
        const px = x + 1.4 + rnd() * (zw - 3), py = y + zh - 2.4 - rnd() * 1.6;
        if (ri === 0) k += `<line x1="${r(px)}" y1="${r(py)}" x2="${r(px + 2.4)}" y2="${r(py - 0.6)}" stroke="#8d969c" stroke-width=".35"/><circle cx="${r(px)}" cy="${r(py)}" r=".4" fill="#6c757c"/>`;
        else if (ri === 1) k += `<path d="M${r(px)} ${r(py)} l2.2 -.4" stroke="#c9a74a" stroke-width=".5" stroke-dasharray=".3 .2"/><circle cx="${r(px)}" cy="${r(py)}" r=".5" fill="#b8963a"/>`;
        else if (ri === 2) k += `<rect x="${r(px)}" y="${r(py - 0.5)}" width="2" height=".9" rx=".3" fill="${s % 2 ? "#9a9a9a" : "#e7e2d6"}"/>`;
        else k += `<path d="M${r(px)} ${r(py - 0.6)} l.6 -.4 l.7 0 l.6 .4 l0 .8 l-.6 .4 l-.7 0 l-.6 -.4 Z" fill="#9aa3aa"/><circle cx="${r(px + 0.95)}" cy="${r(py - 0.2)}" r=".25" fill="#2b5687"/>`;
      }
      k += `<rect x="${r(x + zw / 2 - 2.6)}" y="${r(y + 0.8)}" width="5.2" height="1.6" fill="#fff"/><text x="${r(x + zw / 2)}" y="${r(y + 2.05)}" font-size="1.1" text-anchor="middle" fill="#1d1f22" font-family="Arial">${etikett}</text>`;
      k += `<rect x="${r(x + zw / 2 - 1)}" y="${r(y + zh - 1.4)}" width="2" height=".6" rx=".3" fill="#2a2d31" opacity=".5"/>`;
    }
    unter.push({ id, de, syl, it, itSyl, en, x: cx, y: SK.y1 + y + zh, kunst: flaeche(-W / 2 + 1, -zh, W - 2, zh) });
  });
  unter[0].tipp = "Ein Nagel wird eingeschlagen, eine Schraube wird eingedreht.";
  unter[2].tipp = "In die Wand kommt zuerst ein Dübel — dann hält die Schraube.";
  S.teil({ id: "ws_sortimentskasten", de: "der Sortimentskasten", syl: "sor-ti-MENTS-kas-ten", it: "la cassettiera per minuterie", itSyl: "cas-set-TIE-ra per mi-nu-te-RI-e", en: "parts organiser", x: cx, y: SK.y1, kunst: k,
    zoom: { x: SK.x0 - 2, y: SK.y0 - 1, w: W + 4, h: 30 },
    unter,
    tipp: "Kleine Teile in kleinen Schubladen — so findet man alles schnell." });
}

/* =====================================================================
   3 — DER HELM und DIE ARBEITSHANDSCHUHE (an Haken)
   ===================================================================== */
{
  let k = `<rect x="-.8" y="-17" width="1.6" height="2.4" fill="#59616a"/>`;
  k += `<path d="M-7.4 -4 Q-7.6 -15.6 0 -15.8 Q7.6 -15.6 7.4 -4 Z" fill="${S.lg("helm", [[0, "#ffffff"], [1, "#d6d9db"]])}"/><path d="M-9.4 -3.6 L9.4 -3.6 L9 -2.2 L-9 -2.2 Z" fill="#c9cdd0"/><path d="M-1 -15.6 L1 -15.6 L1.2 -4 L-1.2 -4 Z" fill="#e9ecee"/>`;
  k += `<path d="M-5 -12.6 Q-3 -15 0 -15" stroke="#fff" stroke-width=".8" opacity=".8" fill="none"/>`;
  /* Gehörschutz-Kapsel am Helm */
  k += `<path d="M6.6 -7 Q10.4 -7.6 10.4 -3.6 Q10.4 0 7.4 .2" stroke="#c0392b" stroke-width=".8" fill="none"/><ellipse cx="8.6" cy="-.6" rx="2.2" ry="2.8" fill="${S.lg("kapsel", [[0, "#e04b3e"], [1, "#9a2119"]])}"/>`;
  S.teil({ id: "helm", de: "der Helm", syl: "HELM", it: "il casco", itSyl: "CA-sco", en: "helmet", x: 116, y: 98, kunst: k,
    tipp: "Den Helm mit Gehörschutz nimmt der Tischler mit auf die Baustelle." });
}
{
  let k = `<rect x="-.8" y="-17" width="1.6" height="2.4" fill="#59616a"/>`;
  for (const [dx, rot, f] of [[-1.6, -6, "#e5b912"], [1.8, 6, "#d1a816"]]) {
    k += `<g transform="rotate(${rot} ${dx} -15)"><path d="M${dx - 2.4} -15 L${dx + 2.4} -15 L${dx + 2.6} -9 L${dx + 3.4} -4 Q${dx + 3} -2.4 ${dx + 2} -3 L${dx + 1.6} -1.4 Q${dx + 0.4} -.6 ${dx - 0.4} -1.4 L${dx - 1.2} -1 Q${dx - 2.4} -1 ${dx - 2.6} -2.4 L${dx - 2.6} -9 Z" fill="${f}"/>`;
    k += `<rect x="${dx - 2.4}" y="-15" width="4.8" height="3" fill="#2f6266"/></g>`;
  }
  S.teil({ id: "handschuhe", de: "die Arbeitshandschuhe", syl: "AR-beits-hand-schu-he", it: "i guanti da lavoro", itSyl: "GUAN-ti da la-VO-ro", en: "work gloves", x: 136, y: 98, kunst: k,
    tipp: "Arbeitshandschuhe schützen vor Splittern. An der Kreissäge trägt man aber keine!" });
}

/* =====================================================================
   4 — DIE HOBELBANK (Werkbank aus Buche) mit Vorderzange
   ===================================================================== */
const BANK = { x0: 10, x1: 102, oben: 97 };
{
  const W = BANK.x1 - BANK.x0, h = WAND_UNTEN - BANK.oben;
  let k = schatten(0, 0, W / 2 + 2, 1.6, .3);
  /* Platte von leicht oben, mit Bankhaken-Löchern */
  k += `<path d="M${-W / 2 + 1} ${-h - 4.6} L${W / 2 - 1} ${-h - 4.6} L${W / 2} ${-h} L${-W / 2} ${-h} Z" fill="${BUCHE}"/>`;
  for (let i = 0; i < 9; i++) k += `<rect x="${r(-W / 2 + 18 + i * 8)}" y="${r(-h - 1.6)}" width="1.2" height=".7" fill="#7a5230"/>`;
  k += `<rect x="${-W / 2}" y="${-h}" width="${W}" height="3.4" fill="${BUCHE_V}"/><rect x="${-W / 2}" y="${-h}" width="${W}" height=".5" fill="#f2d3a8"/>`;
  /* Gestell: zwei Fußwangen, Traverse, Ablage */
  for (const x of [-W / 2 + 8, W / 2 - 8]) {
    k += `<rect x="${x - 2.4}" y="${-h + 3.4}" width="4.8" height="${h - 5}" fill="${BUCHE_V}"/>`;
    k += `<rect x="${x - 6}" y="-2.6" width="12" height="2.6" rx=".6" fill="#b4834f"/>`;
  }
  k += `<rect x="${-W / 2 + 8}" y="-12" width="${W - 16}" height="3" fill="#b4834f"/>`;
  k += `<rect x="${-W / 2 + 8}" y="${-h + 6}" width="${W - 16}" height="1.6" fill="#a8743a"/>`;
  /* auf der Ablage: Holzkiste mit Resten */
  k += `<rect x="-14" y="-18" width="20" height="6" fill="${FICHTE}" stroke="#a8823f" stroke-width=".3"/><rect x="-12" y="-21" width="2" height="3.4" fill="#d9b77c"/><rect x="-8" y="-20" width="9" height="2" fill="#c9a26a"/>`;
  /* Vorderzange links: Backe, Spindel, Knebel */
  k += `<rect x="${-W / 2 - 3}" y="${-h - 2}" width="5" height="12" rx=".6" fill="${BUCHE_V}"/>`;
  k += `<rect x="${-W / 2 - 1.2}" y="${-h + 3}" width="1.6" height="1.6" fill="#59616a"/><rect x="${-W / 2 - 6}" y="${-h + 3.2}" width="7" height="1.2" rx=".6" fill="#c99a66"/>`;
  S.teil({ id: "werkbank", de: "die Werkbank", syl: "WERK-bank", it: "il banco da lavoro", itSyl: "BAN-co da la-VO-ro", en: "workbench", x: (BANK.x0 + BANK.x1) / 2, y: WAND_UNTEN, steht: true, kunst: k,
    tipp: "Eine Werkbank aus Holz heißt beim Tischler „Hobelbank“." });
}
/* Auf der Werkbank: Bohrmaschine, Hobel, Zollstock, Schraubstock */
{
  let k = schatten(0, 0, 7, .8, .3);
  /* Akku-Bohrmaschine, aufrecht auf dem Akku */
  k += `<rect x="-3.6" y="-2.6" width="7.4" height="2.6" rx=".6" fill="#2a2d31"/><rect x="-3.2" y="-2.4" width="6.6" height=".8" fill="#3ca35a"/>`;
  k += `<path d="M-1.6 -2.6 L1.6 -2.6 L2 -8 L-1.2 -8 Z" fill="${S.lg("bmgriff", [[0, "#3a7fd0"], [1, "#1f5294"]])}"/>`;
  k += `<path d="M-2.6 -8 L4.4 -8 Q5.6 -8 5.6 -9.6 L5.6 -10.6 Q5.6 -12.2 4 -12.2 L-1.6 -12.2 Q-3 -12.2 -3 -10.6 Z" fill="${S.lg("bmkopf", [[0, "#3a7fd0"], [1, "#1f5294"]])}"/>`;
  k += `<rect x="5.6" y="-11.2" width="2.2" height="2.2" rx=".4" fill="#2a2d31"/><rect x="7.8" y="-10.4" width="3.6" height=".7" fill="#c9cfd4"/>`;
  k += `<rect x="1" y="-7.2" width=".9" height="1.6" rx=".3" fill="#2a2d31"/><path d="M-2 -11.6 L3 -11.6" stroke="#fff" stroke-width=".4" opacity=".4"/>`;
  S.teil({ oben: true, id: "bohrmaschine", de: "die Bohrmaschine", syl: "BOHR-ma-schi-ne", it: "il trapano", itSyl: "TRA-pa-no", en: "drill", x: 30, y: BANK.oben, steht: true, kunst: k,
    tipp: "Mit der Akku-Bohrmaschine bohrt man Löcher und dreht Schrauben ein." });
}
{
  let k = schatten(0, 0, 6, .6, .25);
  /* Hobel aus Holz mit Eisen und Hornknauf */
  k += `<path d="M-6 0 L6 0 L6.4 -3 Q6.4 -3.6 5.8 -3.6 L-5.6 -3.6 Q-6.2 -3.6 -6.2 -3 Z" fill="${BUCHE_V}"/><rect x="-6" y="-1" width="12" height="1" fill="#2a2d31"/>`;
  k += `<path d="M-1 -3.6 L.4 -3.6 L1.8 -7.6 L.6 -7.8 Z" fill="#9aa3aa"/><path d="M-3.6 -3.6 Q-4.4 -6.4 -2.6 -6.8 Q-1.6 -6.2 -2 -3.6 Z" fill="#2a2420"/><path d="M2.6 -3.6 L3.6 -6 Q5 -6.4 5.4 -5 L4.6 -3.6 Z" fill="#7a5230"/>`;
  k += `<path d="M7 -.2 q2 -1.2 3.4 -.2 q-1 .8 -2.2 .4" fill="#f0d8a8"/>`;
  S.teil({ oben: true, id: "ws_hobel", de: "der Hobel", syl: "HO-bel", it: "la pialla", itSyl: "PIAL-la", en: "plane", x: 54, y: BANK.oben, steht: true, kunst: k,
    tipp: "Der Hobel nimmt dünne Späne ab — so wird das Holz glatt." });
}
{
  /* Zollstock, halb aufgeklappt */
  let k = `<path d="M-9 0 L1 0 L1 -1.2 L-9 -1.2 Z" fill="#f2d03a" stroke="#b8901a" stroke-width=".15"/>`;
  k += `<path d="M1 -1.2 L1 0 L8.4 -4 L7.8 -5 Z" fill="#f2d03a" stroke="#b8901a" stroke-width=".15"/>`;
  for (let i = 0; i < 10; i++) k += `<line x1="${-8.4 + i}" y1="-1.2" x2="${-8.4 + i}" y2="${i % 5 ? -.7 : -.3}" stroke="#1d1f22" stroke-width=".15"/>`;
  k += `<circle cx="1" cy="-.6" r=".4" fill="#9aa3aa"/><text x="-6" y="-.25" font-size=".9" fill="#c0392b" font-family="Arial">1 2 3</text>`;
  S.teil({ oben: true, id: "zollstock", de: "der Zollstock", syl: "ZOLL-stock", it: "il metro", itSyl: "ME-tro", en: "folding ruler", x: 72, y: BANK.oben, steht: true, kunst: k + flaeche(-9.4, -5.6, 18.4, 6),
    tipp: "Der Zollstock ist zwei Meter lang und wird zusammengeklappt." });
}
{
  /* Schraubstock (Parallel-Schraubstock) am rechten Ende */
  let k = schatten(0, 0, 6, .7, .3);
  k += `<rect x="-5" y="-2" width="9" height="2" rx=".4" fill="#3d4a55"/>`;
  k += `<path d="M-4 -2 L-4 -8 L-1.2 -8 L-1.2 -5 L1.4 -5 L1.4 -2 Z" fill="${S.lg("vise", [[0, "#4fb07a"], [1, "#2b7a50"]])}"/>`;
  k += `<rect x="1" y="-8" width="3.6" height="6" rx=".4" fill="${S.lg("vise2", [[0, "#4fb07a"], [1, "#2b7a50"]])}"/>`;
  k += `<rect x="-1.4" y="-8.8" width="2.8" height="1.8" fill="#9aa3aa"/><rect x="-1.6" y="-11.6" width="3.2" height="3" fill="${FICHTE}"/>`;
  k += `<rect x="4.6" y="-5.6" width="4" height="1" rx=".4" fill="${STAHL}"/><rect x="8.2" y="-7.6" width=".9" height="5" rx=".4" fill="${STAHL}"/>`;
  S.teil({ oben: true, id: "schraubstock", de: "der Schraubstock", syl: "SCHRAUB-stock", it: "la morsa", itSyl: "MOR-sa", en: "vice", x: 92, y: BANK.oben, steht: true, kunst: k + flaeche(-5.4, -12, 15, 12),
    tipp: "Der Schraubstock hält ein Stück Holz fest — so hat man beide Hände frei." });
}

/* =====================================================================
   5 — DIE LEITER (angelehnt) und DAS HOLZ (Kragarmregal mit Brettern)
   ===================================================================== */
{
  /* Stehleiter, zusammengeklappt an die Wand gelehnt */
  let k = schatten(0, 0, 7, .8, .25);
  k += `<path d="M-5.6 0 L-1.2 -94 L1 -94 L-3.4 0 Z" fill="${S.lg("holm", [[0, "#e4e8eb"], [1, "#a9b1b7"]], 0, 0, 1, 0)}"/><path d="M4 0 L5.2 -94 L7.4 -94 L6.2 0 Z" fill="${S.lg("holm2", [[0, "#e4e8eb"], [1, "#a9b1b7"]], 0, 0, 1, 0)}"/>`;
  for (let i = 1; i < 12; i++) { const t = i / 12; k += `<path d="M${r(-4.5 + t * 4.4)} ${r(-t * 94)} L${r(5.1 + t * 1.2)} ${r(-t * 94)}" stroke="#9aa3aa" stroke-width="1.6"/>`; }
  k += `<rect x="-6.2" y="-1.6" width="3.4" height="1.6" rx=".4" fill="#2a2d31"/><rect x="3.6" y="-1.6" width="3.4" height="1.6" rx=".4" fill="#2a2d31"/>`;
  k += `<rect x="-1.6" y="-97" width="9.4" height="3.4" rx=".6" fill="#c0392b"/>`;
  S.teil({ id: "leiter", de: "die Leiter", syl: "LEI-ter", it: "la scala", itSyl: "SCA-la", en: "ladder", x: 236, y: WAND_UNTEN + 1, steht: true, kunst: k,
    tipp: "Eine Stehleiter: Man klappt sie auf, dann steht sie allein." });
}
{
  const x0 = 252, x1 = 318, cx = (x0 + x1) / 2;
  let k = schatten(0, 0, 34, 1.6, .25);
  /* zwei Ständer mit Kragarmen */
  for (const x of [x0 + 6 - cx, x1 - 6 - cx]) {
    k += `<rect x="${x - 2}" y="-96" width="4" height="96" fill="${S.lg("staender", [[0, "#4f6f8f"], [1, "#2f4a66"]], 0, 0, 1, 0)}"/>`;
    k += `<rect x="${x - 5}" y="-2" width="10" height="2" fill="#2f4a66"/>`;
  }
  const brett = (y, d, f, l0, l1) => `<rect x="${l0}" y="${r(y - d)}" width="${l1 - l0}" height="${d}" fill="${f}"/><rect x="${l0}" y="${r(y - d)}" width="${l1 - l0}" height=".4" fill="#fff" opacity=".35"/><line x1="${l0}" y1="${r(y - d / 2)}" x2="${l1}" y2="${r(y - d / 2)}" stroke="#a8823f" stroke-width=".15" opacity=".6"/>`;
  const ebenen = [-8, -32, -56, -80];
  const sorten = [[FICHTE, 2.4], [S.lg("eiche", [[0, "#c9a06a"], [1, "#a87e4a"]]), 2.6], [FICHTE, 1.8], [S.lg("multiplex", [[0, "#efd9b0"], [1, "#d9bd8a"]]), 1.4]];
  ebenen.forEach((y, i) => {
    for (const x of [x0 + 6 - cx, x1 - 6 - cx]) k += `<rect x="${x - 1}" y="${y}" width="${i === 0 ? 4 : 6}" height="1.6" fill="#2f4a66"/>`;
    let yy = y;
    const [f, d] = sorten[i];
    for (let j = 0; j < (i === 3 ? 3 : 4); j++) { const off = (j % 2) * 2; k += brett(yy, d, f, -cx + x0 - 2 + off, x1 - cx + 1 - off); yy -= d + 0.2; }
  });
  /* Stirnholz-Andeutung (Jahresringe) an den linken Enden */
  for (let i = 0; i < 4; i++) k += `<ellipse cx="${-cx + x0 - 1}" cy="${-9.2 - i * 2.6}" rx=".6" ry="1" fill="#e2c48d" stroke="#a8823f" stroke-width=".15"/>`;
  S.teil({ id: "ws_holz", de: "das Holz", syl: "HOLZ", it: "il legno", itSyl: "LE-gno", en: "timber", x: cx, y: WAND_UNTEN, steht: true, kunst: k,
    tipp: "Im Regal liegt das Holz: Fichte ist hell und weich, Eiche ist hart." });
}

/* =====================================================================
   6 — DER TISCHLER an der TISCHKREISSÄGE, mit dem BRETT
   ===================================================================== */
const SAEGE = { x: 186, y: 172 };
let haende = null;
{
  const m = B.mensch({ id: "ws_tischler", geschlecht: "m", pose: "halten", blick: 8, frisur: "kurz", haarfarbe: "braun", haut: "hell", bart: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "#8a3a33" }, schuerze: { stueck: "schuerze", farbe: "#3f4a3a" }, unterteil: { stueck: "arbeitshose", farbe: "#2f3a2f" }, schuhe: { stueck: "stiefel", farbe: "braun" }, zubehoer: { stueck: "brille" } } }, 0.25 * (148 + 4) * 1.8);
  const hs = [m.z.handL, m.z.handR].filter(Boolean);
  haende = { x: hs.reduce((s, h) => s + h.x, 0) / hs.length * m.k, y: Math.max(...hs.map((h) => h.y)) * m.k };
  S.teil({ id: "tischler", de: "der Tischler", syl: "TISCH-ler", it: "il falegname", itSyl: "fa-le-GNA-me", en: "carpenter", x: SAEGE.x, y: 148, kunst: m.svg,
    tipp: "In Süddeutschland sagt man „Schreiner“, im Norden „Tischler“." });
}
{
  /* Tischkreissäge: Gestell, Gusstisch, Sägeblatt mit Schutzhaube, Anschlag */
  const s = M(SAEGE.y);
  const T = 0.87 * s, w = 0.95 * s;
  let k = schatten(0, 0, w / 2 + 6, 2, .35);
  /* Beine (gespreizt) und Unterbau */
  k += `<path d="M${r(-w / 2 + 2)} ${r(-T + 12)} L${r(-w / 2 - 2)} 0 M${r(w / 2 - 2)} ${r(-T + 12)} L${r(w / 2 + 2)} 0" stroke="#2f3a40" stroke-width="2.2" stroke-linecap="round"/>`;
  k += `<path d="M${r(-w / 2 + 6)} ${r(-T + 12)} L${r(-w / 2 + 3)} -1 M${r(w / 2 - 6)} ${r(-T + 12)} L${r(w / 2 - 3)} -1" stroke="#1f272b" stroke-width="1.8" stroke-linecap="round"/>`;
  k += `<rect x="${r(-w / 2 + 2)}" y="${r(-T + 3)}" width="${r(w - 4)}" height="12" rx="1" fill="${S.lg("korpus", [[0, "#5a8a6a"], [1, "#3c6a4c"]])}"/>`;
  k += `<rect x="${r(-w / 2 - 2)}" y="-14" width="${r(w + 4)}" height="1.6" fill="#2f3a40"/>`;
  /* Schalter (grün/rot) und Kurbel für die Schnitthöhe */
  k += `<rect x="${r(-w / 2 + 4)}" y="${r(-T + 5)}" width="7" height="6" rx=".6" fill="#e9eaea"/><circle cx="${r(-w / 2 + 6)}" cy="${r(-T + 8)}" r="1.2" fill="#3ca35a"/><rect x="${r(-w / 2 + 8)}" y="${r(-T + 6.4)}" width="2.2" height="3.4" rx=".4" fill="#c0392b"/>`;
  k += `<circle cx="0" cy="${r(-T + 9)}" r="2.6" fill="#2f3a40"/><path d="M0 ${r(-T + 9)} L3.4 ${r(-T + 7)}" stroke="${STAHL}" stroke-width=".9"/><circle cx="3.6" cy="${r(-T + 6.8)}" r=".8" fill="#2a2d31"/>`;
  /* Tisch: Vorderkante und Oberseite in die Tiefe */
  k += `<path d="M${r(-w / 2 - 6)} ${r(-T)} L${r(w / 2 + 6)} ${r(-T)} L${r(w / 2 + 3)} ${r(-T - 11)} L${r(-w / 2 - 3)} ${r(-T - 11)} Z" fill="${S.lg("tisch", [[0, "#aab2b8"], [1, "#d6dbde"]])}"/>`;
  k += `<rect x="${r(-w / 2 - 6)}" y="${r(-T)}" width="${r(w + 12)}" height="3" fill="${STAHL}"/>`;
  /* Parallelanschlag rechts */
  k += `<path d="M${r(w / 2 - 2)} ${r(-T)} L${r(w / 2 - 4)} ${r(-T - 11)} L${r(w / 2 - 2)} ${r(-T - 11)} L${r(w / 2)} ${r(-T)} Z" fill="#c0392b"/><rect x="${r(w / 2 - 3)}" y="${r(-T)}" width="5" height="3.4" rx=".4" fill="#c0392b"/>`;
  /* Sägeblatt ragt durch den Tisch; Spaltkeil; Schutzhaube darüber */
  k += `<path d="M-1.2 ${r(-T - 4)} A6 3 0 0 1 1.6 ${r(-T - 9)} L1.6 ${r(-T - 4)} Z" fill="#c9cfd4" opacity=".9"/>`;
  k += `<rect x="-.8" y="${r(-T - 14)}" width="1.6" height="6" fill="#59616a"/>`;
  k += `<path d="M-3.4 ${r(-T - 9)} L3.4 ${r(-T - 9)} L3 ${r(-T - 15)} L-3 ${r(-T - 15)} Z" fill="${S.lg("haube", [[0, "#f4f6f6", 0.85], [1, "#c9cfd4", 0.75]])}" stroke="#7d868d" stroke-width=".3"/>`;
  k += `<rect x="-.6" y="${r(-T - 22)}" width="1.2" height="7" fill="#7d868d"/><path d="M-.6 ${r(-T - 22)} L-14 ${r(-T - 22)} L-14 ${r(-T - 24)}" stroke="#7d868d" stroke-width="1.2" fill="none"/>`;
  /* Absaugschlauch hinten */
  k += `<path d="M${r(-w / 2 + 3)} ${r(-T + 14)} Q${r(-w / 2 - 14)} ${r(-T + 20)} ${r(-w / 2 - 18)} -2" stroke="#2a2d31" stroke-width="2.4" fill="none"/>`;
  k += `<rect x="${r(-w / 2 + 4)}" y="${r(-T - 1)}" width="${r(w - 8)}" height=".6" fill="#fff" opacity=".4"/>`;
  S.teil({ id: "ws_kreissaege", de: "die Kreissäge", syl: "KREIS-sä-ge", it: "la sega circolare", itSyl: "SE-ga cir-co-LA-re", en: "circular saw", x: SAEGE.x, y: SAEGE.y, steht: true, kunst: k,
    tipp: "Das runde Sägeblatt der Tischkreissäge dreht sich sehr schnell — die Schutzhaube schützt die Hände." });
}
{
  /* DAS BRETT: liegt auf dem Sägetisch, reicht nach hinten bis in die Hände des Tischlers */
  const s = M(SAEGE.y), T = 0.87 * s;
  const yv = SAEGE.y - T - 0.6, yh = 148 + haende.y + 1.4;
  const xh = haende.x;
  let k = `<path d="M${r(-6.4)} ${r(yv - SAEGE.y)} L${r(4.6)} ${r(yv - SAEGE.y)} L${r(xh + 3.6)} ${r(yh - SAEGE.y)} L${r(xh - 4.6)} ${r(yh - SAEGE.y)} Z" fill="${FICHTE}"/>`;
  k += `<rect x="-6.4" y="${r(yv - SAEGE.y)}" width="11" height="1.4" fill="#c9a26a"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${r(-5 + i * 2.6)} ${r(yv - SAEGE.y)} L${r(xh - 3.4 + i * 1.9)} ${r(yh - SAEGE.y)}" stroke="#c9a26a" stroke-width=".25" opacity=".8"/>`;
  k += `<path d="M-2 ${r(yv - SAEGE.y - 2)} q1 -2 2.6 -1.2 M1 ${r(yv - SAEGE.y - 3)} q.6 -1.6 2 -1" stroke="#e2c48d" stroke-width=".6" fill="none"/>`;
  S.teil({ oben: true, id: "brett", de: "das Brett", syl: "BRETT", it: "l'asse", itSyl: "AS-se", en: "board", x: SAEGE.x, y: SAEGE.y, kunst: k,
    tipp: "Das Brett wird der Länge nach gesägt — man sagt: Es wird „aufgetrennt“." });
}

/* =====================================================================
   7 — VORNE LINKS: DER HOCKER wird verleimt — SCHRAUBZWINGEN und LEIM
   ===================================================================== */
const HK = { x: 50, y: 190 };
{
  const s = M(HK.y);
  const H = 0.46 * s, w = 0.38 * s;
  let k = schatten(0, 0, w / 2 + 4, 1.6, .3);
  /* vier Beine (die hinteren etwas höher), Zargen, Sitz */
  for (const [x, y0, f] of [[-w / 2 + 3.4, -2.4, "#b98a52"], [w / 2 - 3.4, -2.4, "#b98a52"]]) k += `<rect x="${r(x - 1.3)}" y="${r(-H + 2)}" width="2.6" height="${r(H - 2 + y0)}" fill="${f}"/>`;
  for (const x of [-w / 2 + 1.4, w / 2 - 1.4]) k += `<path d="M${r(x - 1.5)} ${r(-H + 2)} L${r(x + 1.5)} ${r(-H + 2)} L${r(x + 1.5 + (x < 0 ? -1.2 : 1.2))} 0 L${r(x - 1.5 + (x < 0 ? -1.2 : 1.2))} 0 Z" fill="${BUCHE_V}"/>`;
  k += `<rect x="${r(-w / 2 + 1)}" y="${r(-H + 4)}" width="${r(w - 2)}" height="3" fill="#c99a66"/><rect x="${r(-w / 2 + 2)}" y="${r(-H * 0.4)}" width="${r(w - 4)}" height="1.6" fill="#c99a66"/>`;
  k += `<path d="M${r(-w / 2 - 1)} ${r(-H + 2)} L${r(w / 2 + 1)} ${r(-H + 2)} L${r(w / 2 - 1)} ${r(-H - 2.6)} L${r(-w / 2 + 1)} ${r(-H - 2.6)} Z" fill="${S.lg("sitz", [[0, "#ecc596"], [1, "#d3a571"]])}"/><rect x="${r(-w / 2 - 1)}" y="${r(-H + 2)}" width="${r(w + 2)}" height="1.6" fill="#b98a52"/>`;
  /* Leimtropfen an der Fuge */
  k += `<circle cx="${r(-w / 2 + 3)}" cy="${r(-H + 7.4)}" r=".5" fill="#fffdf0"/>`;
  S.teil({ id: "ws_hocker", de: "der Hocker", syl: "HO-cker", it: "lo sgabello", itSyl: "sga-BEL-lo", en: "stool", x: HK.x, y: HK.y, steht: true, kunst: k,
    tipp: "Der Tischler hat einen Hocker gebaut. Jetzt trocknet der Leim." });
}
{
  /* zwei Schraubzwingen spannen die Zarge */
  const s = M(HK.y), H = 0.46 * s, w = 0.38 * s;
  let k = "";
  for (const [y, f] of [[-H + 5.5, "#c0392b"], [-H * 0.4 + 0.8, "#2a6db3"]]) {
    const y0 = r(y);
    k += `<rect x="${r(-w / 2 - 4)}" y="${y0 - 0.6}" width="${r(w + 8)}" height="1.2" fill="${STAHL}"/>`;
    k += `<rect x="${r(-w / 2 - 4)}" y="${y0 - 2.6}" width="2" height="5.2" rx=".3" fill="#59616a"/><rect x="${r(w / 2 + 1.6)}" y="${y0 - 2.6}" width="2" height="5.2" rx=".3" fill="#59616a"/>`;
    k += `<rect x="${r(w / 2 + 3.6)}" y="${y0 - 0.4}" width="2.4" height=".8" fill="#9aa3aa"/><rect x="${r(w / 2 + 6)}" y="${y0 - 1.3}" width="5" height="2.6" rx="1.2" fill="${f}"/>`;
  }
  S.teil({ oben: true, id: "ws_schraubzwinge", de: "die Schraubzwinge", syl: "SCHRAUB-zwin-ge", it: "il morsetto", itSyl: "mor-SET-to", en: "clamp", x: HK.x, y: HK.y, kunst: k,
    tipp: "Die Schraubzwinge drückt zwei Holzteile fest zusammen, bis der Leim trocken ist." });
}
{
  let k = schatten(0, 0, 3, .6, .25);
  k += `<path d="M-2.4 0 L-2.4 -7.6 Q-2.4 -8.6 -1.4 -8.6 L1.4 -8.6 Q2.4 -8.6 2.4 -7.6 L2.4 0 Z" fill="${S.lg("leim", [[0, "#ffffff"], [1, "#d9dcd6"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-2.4" y="-6.4" width="4.8" height="3.6" fill="#e5b912"/><text x="0" y="-4" font-size="1.5" text-anchor="middle" fill="#1d1f22" font-family="Arial" font-weight="bold">LEIM</text>`;
  k += `<path d="M-.8 -8.6 L-.4 -11.6 L.4 -11.6 L.8 -8.6 Z" fill="#e05a2e"/>`;
  S.teil({ oben: true, id: "ws_leim", de: "der Leim", syl: "LEIM", it: "la colla", itSyl: "COL-la", en: "wood glue", x: 76, y: 192, steht: true, kunst: k });
}

/* =====================================================================
   8 — VORNE RECHTS: DER FARBEIMER mit DEM PINSEL
   ===================================================================== */
{
  let k = schatten(0, 0, 10, 1.4, .3);
  k += `<path d="M-7.4 -15 L7.4 -15 L6.8 0 L-6.8 0 Z" fill="${S.lg("eimer", [[0, "#f4f6f6"], [0.5, "#dfe3e5"], [1, "#b9c0c4"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="-15" rx="7.4" ry="2" fill="#c9cfd4"/><ellipse cx="0" cy="-15" rx="6.8" ry="1.6" fill="${S.rg("farbe", [[0, "#5aa2d8"], [1, "#2a6db3"]])}"/>`;
  k += `<rect x="-6" y="-11" width="12" height="7" fill="#2a6db3"/><text x="0" y="-6.6" font-size="2.2" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">LACK</text>`;
  k += `<path d="M-7 -14 Q0 -26 7 -14" stroke="#7d868d" stroke-width=".5" fill="none"/>`;
  k += `<path d="M-6.4 -13.6 L-6 -1" stroke="#fff" stroke-width=".7" opacity=".5"/><path d="M3 -14.6 q.4 3 0 5" stroke="#2a6db3" stroke-width=".9" fill="none"/>`;
  S.teil({ id: "farbeimer", de: "der Farbeimer", syl: "FARB-ei-mer", it: "il barattolo", itSyl: "ba-RAT-to-lo", en: "paint can", x: 294, y: 190, steht: true, kunst: k });
}
{
  /* Pinsel quer über dem Eimer */
  let k = `<g transform="rotate(-12)"><rect x="-11" y="-1" width="11" height="2" rx="1" fill="${GRIFF}"/><rect x="0" y="-1.6" width="2.4" height="3.2" fill="#c9cfd4"/><path d="M2.4 -1.8 L6.6 -2 L7 2 L2.4 1.8 Z" fill="#3a2a1a"/><path d="M5.6 -1.9 L7 -2 L7.2 2 L5.6 1.9 Z" fill="#2a6db3"/></g>`;
  S.teil({ oben: true, id: "pinsel", de: "der Pinsel", syl: "PIN-sel", it: "il pennello", itSyl: "pen-NEL-lo", en: "brush", x: 292, y: 175, kunst: k,
    tipp: "Nach dem Streichen wird der Pinsel gründlich ausgewaschen." });
}

S.davor(`<rect x="0" y="0" width="320" height="200" fill="${S.rg("fensterlicht", [[0, "#fff6dc", 0.1], [1, "#fff6dc", 0]], 0.58, 0.3, 0.7)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/werkstatt.js"));
console.log(aus);
