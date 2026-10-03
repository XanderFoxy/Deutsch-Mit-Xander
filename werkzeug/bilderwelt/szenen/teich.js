#!/usr/bin/env node
/* =====================================================================
   DER TEICH (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Ratgeber Gartenteich/Teichpflanzen, BUND „Gartenteich und
   Bachlauf“, „Amphibien am Gartenteich“):
   - Ein Dorfteich hat Zonen: am Ufer die Sumpfzone mit SCHILF und
     ROHRKOLBEN (10–30 cm Wasser), weiter draußen die Tiefwasserzone mit
     SEEROSEN (50–150 cm), deren Stiele bis zum Grund reichen.
   - Grünfrösche (Teichfrosch) sitzen auf den Schwimmblättern und laichen
     dort; Kröten legen Laichschnüre an senkrechte Halme. Im Frühjahr
     wimmelt das flache Wasser von Kaulquappen.
   - Bewohner: Stockente mit Küken, Höckerschwan (orange Schnabel mit
     schwarzem Höcker), Graureiher im Flachwasser, Karpfen und Goldfische,
     Bergmolch (orange Bauch), Edelkrebs am Grund, Spitzschlammschnecke,
     Wasserläufer, Libellen, Schnaken; Biber am Ufer.
   - Ein Holzsteg führt vom Ufer aufs Wasser, hinten das Dorf mit Kirche
     und eine Trauerweide.
   Darstellung: Schnitt durch den Teich — oben die Wasseroberfläche von
   schräg oben (Augenhöhe 0,6 m über dem Wasser, Horizont y = 70), unten
   der Blick durch die Wasserkante in den Teich.
   Maßstab an der Wasserkante (y = 100): 50 Einheiten je Meter; Teich
   1,6 m tief (Grund bei y ≈ 180).
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, flaeche, schatten, zufall } = B;
const r = B.r;
const { tierKasten } = require("./bauernhof");

const S = neueSzene({ id: "teich", titel: "Der Teich", emoji: "🪷", thema: "Natur", kuerzel: "b18c", fassung: 852 });
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="b18c_wolke" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
const T = tierKasten(S, 4242);
const { glatt, koerper, form, linie, striche, auge } = T;
const rnd = zufall(1717);

const F = 300, HY = 70, E = 0.6, WL = 100;
const sZ = (Z) => F / Z;                       // Einheiten je Meter in der Tiefe Z
const yWasser = (Z) => HY + E * F / Z;          // Wasseroberfläche in der Tiefe Z
const skal = (k, dir, svg) => `<g transform="scale(${Math.round(dir * k * 10000) / 10000} ${Math.round(k * 10000) / 10000})">${svg}</g>`;
const um = (x, y, svg) => `<g transform="translate(${r(-x)} ${r(-y)})">${svg}</g>`;
/* Grund: links Uferböschung, Mitte flach, rechts Ufer */
const grund = (x) => x < 58 ? WL + (x < 52 ? -1 : 0) : x < 96 ? WL + (x - 58) / 38 * 78 : x < 250 ? 178 + Math.sin(x / 13) * 1.5 : x < 276 ? 178 - (x - 250) / 26 * 78 : WL;

/* =====================================================================
   KULISSE: Himmel, Dorf am anderen Ufer, Wasseroberfläche, Unterwasser
   ===================================================================== */
S.hinten(`<rect x="0" y="0" width="320" height="76" fill="${S.lg("himmel", [[0, "#86b8e2"], [0.75, "#c4def0"], [1, "#e8f2f6"]])}"/>`);
{
  let w = "";
  for (const [x, y, a, b] of [[60, 20, 26, 6], [90, 16, 16, 6], [230, 26, 30, 6], [262, 22, 18, 6]]) w += `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="#fff" opacity=".85" filter="url(#b18c_wolke)"/>`;
  S.hinten(w);
  /* Dorf: Kirche, Häuser, Bäume am anderen Ufer */
  let d = `<path d="M0 72 Q80 66 160 69 T320 68 L320 76 L0 76 Z" fill="#9ab884"/>`;
  d += `<g><rect x="196" y="40" width="9" height="32" fill="#e8e0d0"/><path d="M195 40 L200.5 22 L206 40 Z" fill="#4a5a6a"/><rect x="199" y="46" width="3" height="4" rx="1.5" fill="#5a4a3a"/><circle cx="200.5" cy="56" r="1.6" fill="#f2f0e8" stroke="#6a5a4a" stroke-width=".3"/><rect x="205" y="54" width="22" height="18" fill="#efe6d4"/><path d="M204 54 L216 46 L228 54 Z" fill="#9a4a32"/><path d="M200.5 22 v-3 M199.3 20 h2.4" stroke="#c9a23a" stroke-width=".5"/></g>`;
  for (const [x, w2, h, dach] of [[120, 14, 9, "#a4553a"], [138, 12, 8, "#8a4a32"], [236, 14, 9, "#9b4a32"], [254, 10, 7, "#a4553a"], [268, 13, 8, "#8a3a2a"]]) d += `<rect x="${x}" y="${72 - h}" width="${w2}" height="${h}" fill="#f2ead8"/><path d="M${x - 1} ${72 - h} L${x + w2 / 2} ${72 - h - 5} L${x + w2 + 1} ${72 - h} Z" fill="${dach}"/><rect x="${x + 3}" y="${72 - h + 3}" width="2" height="2" fill="#5a6a7a"/><rect x="${x + w2 - 5}" y="${72 - h + 3}" width="2" height="2" fill="#5a6a7a"/>`;
  for (let i = 0; i < 26; i++) { const x = rnd() * 320, y = 70 - rnd() * 4; if (x > 190 && x < 230) continue; d += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(4 + rnd() * 6)}" ry="${r(4 + rnd() * 4)}" fill="${["#4f7a3a", "#5e8a44", "#3f6a30"][Math.floor(rnd() * 3)]}"/>`; }
  d += `<rect x="0" y="72" width="320" height="4" fill="#7fa86a"/>`;
  S.hinten(d);
  /* Wasseroberfläche: Spiegelung des Himmels, dunkler nach vorn, Wellenlinien */
  let o = `<rect x="0" y="75" width="320" height="${WL - 75}" fill="${S.lg("oberflaeche", [[0, "#b9d4dc"], [0.3, "#8ab0b8"], [1, "#4f7e80"]])}"/>`;
  o += `<rect x="0" y="75" width="320" height="6" fill="#6a8a5a" opacity=".35"/>`;
  for (let i = 0; i < 70; i++) { const y = 76 + Math.pow(rnd(), 1.4) * 23, x = rnd() * 320, l = 2 + (y - 75) * 0.25; o += `<path d="M${r(x)} ${r(y)} q${r(l / 2)} ${r(-0.3 - (y - 75) * 0.02)} ${r(l)} 0" stroke="#e8f4f6" stroke-width="${r(0.2 + (y - 75) * 0.012)}" fill="none" opacity=".55"/>`; }
  S.hinten(o);
  /* Unterwasser: grüner Verlauf, Lichtfäden, Schwebeteilchen */
  let u = `<rect x="0" y="${WL}" width="320" height="${200 - WL}" fill="${S.lg("unterwasser", [[0, "#7aa894"], [0.45, "#4e7a64"], [1, "#2a4636"]])}"/>`;
  u += `<path d="M120 100 L150 100 L200 180 L150 180 Z M210 100 L226 100 L250 170 L222 170 Z" fill="${S.lg("licht", [[0, "#e8fff0", 0.25], [1, "#e8fff0", 0]])}"/>`;
  for (let i = 0; i < 60; i++) u += `<circle cx="${r(rnd() * 320)}" cy="${r(WL + 4 + rnd() * 76)}" r="${r(0.2 + rnd() * 0.3)}" fill="#d8ecd8" opacity=".5"/>`;
  /* Teichgrund: Schlamm, Steine, Wasserpflanzen */
  let gp = `M58 200`;
  for (let x = 58; x <= 276; x += 2) gp += `L${x} ${r(grund(x))}`;
  gp += `L276 200 Z`;
  u += `<path d="${gp}" fill="${S.lg("schlamm", [[0, "#5a4a32"], [1, "#2e2418"]])}"/>`;
  for (let i = 0; i < 40; i++) { const x = 96 + rnd() * 150, y = grund(x) + 1 + rnd() * 14; u += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.8 + rnd() * 2)}" ry="${r(0.5 + rnd() * 1)}" fill="${rnd() < 0.5 ? "#7a6a52" : "#4a3a28"}"/>`; }
  for (let i = 0; i < 9; i++) {
    const x = 100 + rnd() * 140, y = grund(x) + 1, h = 12 + rnd() * 18;
    let w2 = `M${r(x)} ${r(y)}`; for (let j = 1; j <= 6; j++) w2 += `L${r(x + Math.sin(j * 1.3 + i) * 1.6)} ${r(y - h * j / 6)}`;
    u += `<path d="${w2}" stroke="#4f8a3a" stroke-width=".6" fill="none"/>`;
    for (let j = 1; j < 6; j++) u += `<path d="M${r(x + Math.sin(j * 1.3 + i) * 1.6)} ${r(y - h * j / 6)} l-2 -1 M${r(x + Math.sin(j * 1.3 + i) * 1.6)} ${r(y - h * j / 6)} l2 -1" stroke="#5e9a44" stroke-width=".5"/>`;
  }
  S.hinten(u);
}

/* =====================================================================
   1 — DIE TRAUERWEIDE (am anderen Ufer)
   ===================================================================== */
{
  const x = 92, y = 74;
  let k = schatten(0, 0, 14, 1, 0.2);
  k += `<path d="M-2 0 L-1.4 -26 L1.4 -26 L2 0 Z" fill="#5a4a36"/>`;
  /* Krone: Kuppel mit Vorhang aus hängenden Zweigen, unten ausgefranst */
  let kr = "M-27 -8";
  for (let x = -27; x <= 27; x += 2.2) kr += `L${r(x)} ${r(-6 - rnd() * 5 + Math.abs(x) * 0.12)}`;
  kr += "L27 -12 Q30 -40 14 -54 Q0 -62 -14 -54 Q-30 -40 -27 -12 Z";
  k += `<path d="${kr}" fill="${S.lg("weide", [[0, "#b4cc62"], [0.5, "#8aac44"], [1, "#6a8a34"]])}"/>`;
  let h = "", h2 = "";
  for (let i = 0; i < 70; i++) { const x0 = -24 + rnd() * 48, y0 = -52 + Math.abs(x0) * 0.6 + rnd() * 8, l = 16 + rnd() * 28; const seg = `M${r(x0)} ${r(y0)}q${r(x0 * 0.06)} ${r(l * 0.5)} ${r(x0 * 0.1)} ${r(l)}`; if (i % 2) h += seg; else h2 += seg; }
  k += `<path d="${h}" stroke="#5a7a2a" stroke-width=".5" fill="none" opacity=".7"/><path d="${h2}" stroke="#d2e48a" stroke-width=".4" fill="none" opacity=".6"/>`;
  k += `<path d="M-6 -6 L-4 -14 M6 -6 L4 -16" stroke="#5a4a36" stroke-width="1" opacity=".7"/>`;
  S.teil({ id: "te_trauerweide", de: "die Trauerweide", syl: "TRAU-er-wei-de", it: "il salice piangente", itSyl: "SA-li-ce pian-GEN-te", en: "weeping willow", x, y, steht: true, kunst: k,
    tipp: "Die Zweige der Trauerweide hängen bis ins Wasser." });
}

/* =====================================================================
   2 — DAS UFER (links und rechts, mit Erde im Schnitt) — Lupe: Laich, Kaulquappen
   ===================================================================== */
const LAICH = { x: 64, y: 108 }, KQ = { x: 80, y: 132 };
{
  let k = "";
  const ERDE = S.lg("erde", [[0, "#6a5236"], [0.4, "#4e3a24"], [1, "#2e2216"]]);
  /* links: Wiese oben, Böschung ins Wasser, Erde im Schnitt */
  const li = [[0, 84, 1], [20, 86], [40, 92], [52, 99], [58, 101], [70, 120], [84, 150], [96, 178], [100, 200, 1], [0, 200, 1]];
  k += `<path d="${glatt(li)}" fill="${ERDE}"/>`;
  k += `<path d="M0 84 Q20 86 40 92 Q50 97 58 101 L58 104 Q46 99 38 96 Q20 91 0 89 Z" fill="${S.lg("wiese", [[0, "#7fae52"], [1, "#5a8a3a"]])}"/>`;
  for (let i = 0; i < 30; i++) { const x = rnd() * 56, y = 86 + x * 0.25 + rnd() * 2; k += `<path d="M${r(x)} ${r(y)} l${r(-0.4 + rnd() * 0.8)} -2.4" stroke="#4f7a30" stroke-width=".5"/>`; }
  for (let i = 0; i < 20; i++) { const y = 104 + rnd() * 90, x = rnd() * Math.min(90, 58 + (y - 100) / 78 * 38) * 0.95; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(1 + rnd() * 2.2)}" ry="${r(0.7 + rnd())}" fill="${rnd() < 0.5 ? "#7a6a56" : "#5a4a3a"}"/>`; }
  k += `<path d="M10 92 q-3 10 -1 22 M24 94 q2 12 -2 26 M36 98 q-4 8 0 18" stroke="#3a2a18" stroke-width=".6" fill="none"/>`;
  /* rechts */
  const re = [[320, 86, 1], [304, 89], [288, 94], [278, 99], [272, 101], [264, 124], [256, 156], [250, 180], [248, 200, 1], [320, 200, 1]];
  k += `<path d="${glatt(re)}" fill="${ERDE}"/>`;
  k += `<path d="M320 86 Q304 89 288 94 Q280 98 272 101 L272 104 Q282 101 290 98 Q304 93 320 91 Z" fill="${S.lg("wiese", [[0, "#7fae52"], [1, "#5a8a3a"]])}"/>`;
  for (let i = 0; i < 16; i++) { const y = 104 + rnd() * 90, x = 320 - rnd() * (320 - Math.max(250, 272 - (y - 100) / 80 * 22)) * 0.95; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(1 + rnd() * 2.2)}" ry="${r(0.7 + rnd())}" fill="${rnd() < 0.5 ? "#7a6a56" : "#5a4a3a"}"/>`; }
  /* Laich (Froschlaich-Ballen) und Kaulquappen im Flachwasser */
  let lc = "";
  for (let i = 0; i < 26; i++) { const a = rnd() * Math.PI * 2, d = rnd() * 3.4; const x = LAICH.x + Math.cos(a) * d * 1.3, y = LAICH.y + Math.sin(a) * d; lc += `<circle cx="${r(x)}" cy="${r(y)}" r=".95" fill="#dfeee4" opacity=".55" stroke="#bcd8c4" stroke-width=".15"/><circle cx="${r(x)}" cy="${r(y)}" r=".32" fill="#141814"/>`; }
  k += lc;
  let kq = "";
  for (const [dx, dy, w] of [[0, 0, 10], [-6, 4, -20], [5, 6, 30], [-3, -5, 0], [8, -2, 15], [-9, -1, -10], [2, 10, 40]]) kq += `<g transform="translate(${KQ.x + dx} ${KQ.y + dy}) rotate(${w})"><ellipse cx="0" cy="0" rx="1.3" ry="1" fill="#2a2a22"/><path d="M-1.1 0 q-1.6 -.8 -3.6 .2 q1.8 .4 3.6 .5" fill="#3a3a30" opacity=".85"/><circle cx=".5" cy="-.4" r=".2" fill="#c8c890"/></g>`;
  k += kq;
  S.teil({ id: "te_ufer", de: "das Ufer", syl: "U-fer", it: "la riva", itSyl: "RI-va", en: "bank", x: 50, y: 200, steht: true, kunst: um(50, 200, k),
    zoom: { x: 44, y: 98, w: 54, h: 36 },
    unter: [
      { id: "te_laich", de: "der Laich", syl: "LAICH", it: "le uova di rana", itSyl: "UO-va di RA-na", en: "frogspawn", x: LAICH.x, y: LAICH.y + 4.5, kunst: flaeche(-6, -9, 12, 9.5), tipp: "Aus jedem schwarzen Punkt im Laich wird eine Kaulquappe." },
      { id: "te_kaulquappe", de: "die Kaulquappe", syl: "KAUL-quap-pe", it: "il girino", itSyl: "gi-RI-no", en: "tadpole", x: KQ.x, y: KQ.y + 12, kunst: flaeche(-13, -18, 25, 19), tipp: "Aus der Kaulquappe wird ein Frosch: Erst wachsen die Beine, dann verschwindet der Schwanz." },
    ],
    tipp: "Am flachen Ufer ist das Wasser warm – hier leben die meisten Tiere." });
}

/* =====================================================================
   3 — DAS SCHILF (linkes Ufer) — Lupe: Libelle, Schnake
   ===================================================================== */
const LIB = { x: 46, y: 46 }, SCHN = { x: 22, y: 34 };
{
  let k = "";
  for (let i = 0; i < 20; i++) {
    const x0 = 4 + i * 2.6 + rnd() * 2, y0 = 88 + x0 * 0.2 + rnd() * 3, h = 70 + rnd() * 18, b = Math.max(-x0 + 4, (rnd() - 0.4) * 10);
    const top = [x0 + b, y0 - h];
    k += `<path d="M${r(x0)} ${r(y0)} Q${r(x0 + b * 0.2)} ${r(y0 - h * 0.6)} ${r(top[0])} ${r(top[1])}" stroke="${i % 3 ? "#8a9a52" : "#a8b062"}" stroke-width=".8" fill="none"/>`;
    for (let j = 0; j < 3; j++) { const t = 0.25 + j * 0.2, x = x0 + b * 0.2 * t * 2, y = y0 - h * t, sx = x0 < 16 ? 1 : (i + j) % 2 ? 1 : -1; k += `<path d="M${r(x)} ${r(y)} q${r(sx * 6)} -2 ${r(sx * 12)} ${r(4 + rnd() * 4)}" stroke="#7a9a4a" stroke-width="1" fill="none" stroke-linecap="round"/>`; }
    k += `<path d="M${r(top[0])} ${r(top[1] + 10)} q${r(-2 + b * 0.1)} -5 ${r(-3 + b * 0.2)} -12 q2 5 3 12 Z" fill="${S.lg("rispe", [[0, "#8a6a5a"], [1, "#b89a7a"]])}"/>`;
  }
  /* Libelle (Blaugrüne Mosaikjungfer) an einem Halm, Schnake an einem anderen */
  const libelle = (x, y, sk) => `<g transform="translate(${x} ${y}) scale(${sk}) rotate(-8)"><ellipse cx="-4" cy="-1.6" rx="4.4" ry="1.3" fill="#d8eef6" opacity=".7" stroke="#7aa0b0" stroke-width=".15"/><ellipse cx="-4" cy="1.6" rx="4.2" ry="1.2" fill="#d8eef6" opacity=".7" stroke="#7aa0b0" stroke-width=".15"/><ellipse cx="4" cy="-1.6" rx="4.4" ry="1.3" fill="#d8eef6" opacity=".7" stroke="#7aa0b0" stroke-width=".15"/><ellipse cx="4" cy="1.6" rx="4.2" ry="1.2" fill="#d8eef6" opacity=".7" stroke="#7aa0b0" stroke-width=".15"/><rect x="-.7" y="-1.6" width="1.4" height="9" rx=".6" fill="#2a5aa0"/><path d="M0 0 v7" stroke="#8ad0e8" stroke-width=".35" stroke-dasharray=".6 .6"/><ellipse cx="0" cy="-1.4" rx="1.1" ry="1.4" fill="#3a7a5a"/><circle cx="-.6" cy="-2.6" r=".7" fill="#4ab0a0"/><circle cx=".6" cy="-2.6" r=".7" fill="#4ab0a0"/></g>`;
  k += `<path d="M${LIB.x} ${LIB.y + 12} L${LIB.x + 1} ${LIB.y - 14}" stroke="#a8b062" stroke-width=".7"/>`;
  k += libelle(LIB.x + 0.6, LIB.y, 0.55);
  const schnake = (x, y, sk) => `<g transform="translate(${x} ${y}) scale(${sk})"><path d="M-1 0 l-5 4 l-1 3 M-.6 .4 l-3 5 l0 3 M.4 .4 l3 5 l1 3 M1 0 l5 3 l2 3 M-.6 -.2 l-4 -2 M.8 -.2 l4 -1.4" stroke="#5a4a3a" stroke-width=".2" fill="none"/><ellipse cx="-.4" cy="-1" rx="2.4" ry=".9" fill="#d8e4e8" opacity=".7" transform="rotate(-30)"/><ellipse cx="0" cy="0" rx="2.2" ry=".55" fill="#8a7a5a"/><circle cx="2.4" cy="-.2" r=".45" fill="#5a4a3a"/></g>`;
  k += schnake(SCHN.x, SCHN.y, 0.7);
  S.teil({ id: "te_schilf", de: "das Schilf", syl: "SCHILF", it: "la canna palustre", itSyl: "CAN-na pa-LU-stre", en: "reeds", x: 30, y: 96, steht: true, kunst: um(30, 96, k),
    zoom: { x: 8, y: 22, w: 57, h: 38 },
    unter: [
      { id: "te_libelle", de: "die Libelle", syl: "Li-BEL-le", it: "la libellula", itSyl: "li-BEL-lu-la", en: "dragonfly", x: LIB.x, y: LIB.y + 4, kunst: flaeche(-5, -6, 10, 7), tipp: "Sieben Zentimeter lang – sie fliegt vorwärts, rückwärts und bleibt in der Luft stehen." },
      { id: "te_schnake", de: "die Schnake", syl: "SCHNA-ke", it: "la zanzarone", itSyl: "zan-za-RO-ne", en: "crane fly", x: SCHN.x, y: SCHN.y + 5, kunst: flaeche(-5, -6, 10, 7), tipp: "Lange Beine, und sie sticht nicht – das tut nur die Mücke." },
    ],
    tipp: "Im Schilf bauen Vögel ihre Nester. Es wird bis zu vier Meter hoch." });
}

/* =====================================================================
   4 — DER STEG (Holz, auf Pfählen, mit Badeleiter)
   ===================================================================== */
{
  const Z0 = 6.5, Z1 = 7.4, x0 = 30, x1 = 124, H = 0.32;
  const yo0 = HY + (E - H) * sZ(Z0), yo1 = HY + (E - H) * sZ(Z1);
  const xP = (x, Z) => 160 + (x - 160) * sZ(Z) / sZ(Z0);
  let k = "";
  /* Pfähle (vorn), bis zum Grund */
  for (const x of [44, 72, 100, 122]) { const yb = grund(x); k += `<rect x="${x - 1.4}" y="${r(yo0)}" width="2.8" height="${r(yb - yo0)}" fill="${S.lg("pfahl", [[0, "#5a4430"], [0.5, "#7a5e42"], [1, "#4a3622"]], 0, 0, 1, 0)}"/><rect x="${x - 1.4}" y="${r(yWasser(Z0) + 2)}" width="2.8" height="${r(yb - yWasser(Z0) - 2)}" fill="#3a6a4a" opacity=".35"/>`; }
  /* Belag (Bretter quer) */
  const p = [[x0, yo0], [x1, yo0], [xP(x1, Z1), yo1], [xP(x0, Z1), yo1]];
  k += `<path d="M${p.map((q) => q.map(r).join(" ")).join("L")}Z" fill="${S.lg("belag", [[0, "#b8966a"], [1, "#9a7a52"]])}"/>`;
  for (let x = x0 + 3; x < x1; x += 3.4) k += `<path d="M${r(x)} ${r(yo0)} L${r(xP(x, Z1))} ${r(yo1)}" stroke="#6a5034" stroke-width=".35"/>`;
  k += `<rect x="${x0}" y="${r(yo0)}" width="${x1 - x0}" height="2.2" fill="#7a5c3c"/>`;
  /* Badeleiter am Ende */
  const lx = x1 - 4;
  k += `<path d="M${lx - 3} ${r(yo0 - 6)} Q${lx - 3} ${r(yo0 - 9)} ${lx} ${r(yo0 - 9)} Q${lx + 3} ${r(yo0 - 9)} ${lx + 3} ${r(yo0 - 4)} L${lx + 3} 116 M${lx - 3} ${r(yo0 - 6)} L${lx - 3} 116" stroke="${S.lg("chrom", [[0, "#e8ecee"], [1, "#9aa4aa"]], 0, 0, 1, 0)}" stroke-width=".9" fill="none"/>`;
  for (let y = yo0 + 6; y < 116; y += 5) k += `<path d="M${lx - 3} ${r(y)} h6" stroke="#c4ccd2" stroke-width=".8"/>`;
  S.teil({ id: "te_steg", de: "der Steg", syl: "STEG", it: "il pontile", itSyl: "pon-TI-le", en: "jetty", x: 77, y: r(yo0 + 2), steht: true, kunst: um(77, yo0 + 2, k),
    tipp: "Vom Steg aus kann man die Fische im Wasser beobachten." });
}

/* =====================================================================
   5 — DIE SEEROSE (Blätter, Blüten, Stiele bis zum Grund) — Lupe
   ===================================================================== */
const SR = {};
{
  let k = "";
  const blaetter = [[136, 7.6, 0.28], [152, 8.6, 0.24], [168, 7.2, 0.3], [146, 6.6, 0.32], [184, 8.2, 0.26], [160, 9.8, 0.22], [176, 6.5, 0.28]];
  /* Stiele unter Wasser (durch die Wasserkante gesehen) */
  for (const [x, Z] of blaetter) { const xb = 150 + (x - 160) * 0.2; k += `<path d="M${x} ${WL + 1} Q${r((x + xb) / 2 + 4)} ${r((WL + 175) / 2)} ${r(xb)} 176" stroke="#5a7a3a" stroke-width=".7" fill="none" opacity=".85"/>`; }
  k += `<ellipse cx="152" cy="177" rx="10" ry="2.6" fill="#5a4a2a"/><path d="M144 177 q8 -3 16 0" stroke="#7a6a3a" stroke-width="1.2" fill="none"/>`;
  /* Wasserschnecke am Stiel */
  SR.sn = [153, 118];
  k += `<g transform="translate(${SR.sn[0]} ${SR.sn[1]}) rotate(-60)"><path d="M0 0 L1.2 -3.8 L2.4 0 Z" fill="${S.lg("schnecke", [[0, "#a8865a"], [1, "#5a4428"]], 0, 0, 1, 0)}"/><path d="M.4 -1.2 l1.6 .4 M.7 -2.3 l1 .3" stroke="#3a2a18" stroke-width=".2"/><ellipse cx="1.2" cy=".3" rx="1.4" ry=".5" fill="#6a6a5a"/></g>`;
  /* Schwimmblätter auf der Oberfläche (perspektivisch flach) */
  blaetter.sort((a, b) => b[1] - a[1]).forEach(([x, Z, d], i) => {
    const s = sZ(Z), y = yWasser(Z), rx = d * s, ry = rx * 0.3, w0 = (i * 47) % 360 * Math.PI / 180, w1 = w0 + 0.32;
    k += `<path d="M${x} ${r(y)} L${r(x + rx * Math.cos(w0))} ${r(y + ry * Math.sin(w0))} A${r(rx)} ${r(ry)} 0 1 0 ${r(x + rx * Math.cos(w1))} ${r(y + ry * Math.sin(w1))} Z" fill="${S.lg("blatt", [[0, "#5e9a44"], [1, "#3a6a2a"]])}" stroke="#2e5a20" stroke-width=".25"/>`;
    k += `<path d="M${r(x - rx * 0.6)} ${r(y - ry * 0.3)} q${r(rx * 0.5)} ${r(-ry * 0.4)} ${r(rx)} 0" stroke="#8ac46a" stroke-width=".35" fill="none" opacity=".7"/>`;
    if (i === 3) SR.blatt = [x, y];
  });
  /* Blüten (weiß mit Rosa, gelbe Mitte) */
  const bluete = (x, y, sz) => {
    let g = "";
    for (let i = 0; i < 9; i++) { const a = -Math.PI * (0.08 + i * 0.105); g += `<path d="M${x} ${y} Q${r(x + Math.cos(a) * sz * 0.5 - 1)} ${r(y + Math.sin(a) * sz * 0.7)} ${r(x + Math.cos(a) * sz)} ${r(y + Math.sin(a) * sz * 0.8)} Q${r(x + Math.cos(a) * sz * 0.5 + 1)} ${r(y + Math.sin(a) * sz * 0.5)} ${x} ${y} Z" fill="${i % 2 ? "#fbf4f6" : "#f2d4dc"}" stroke="#d8b4c0" stroke-width=".15"/>`; }
    g += `<ellipse cx="${x}" cy="${r(y - sz * 0.25)}" rx="${r(sz * 0.28)}" ry="${r(sz * 0.18)}" fill="#f2c62e"/>`;
    return g;
  };
  SR.bl = [[162, yWasser(7.4) - 0.3], [181, yWasser(8.4) - 0.3]];
  k += bluete(SR.bl[0][0], r(SR.bl[0][1]), 5) + bluete(SR.bl[1][0], r(SR.bl[1][1]), 4.2);
  /* Wasserläufer zwischen den Blättern */
  SR.wl = [196, yWasser(7.0)];
  k += `<g transform="translate(${SR.wl[0]} ${r(SR.wl[1])})"><ellipse cx="0" cy="-.6" rx="1.6" ry=".35" fill="#3a3028"/><path d="M-.6 -.6 l-3 .6 M.4 -.6 l2.6 .4 M-.2 -.6 l-2 -.2 M.2 -.6 l3.4 -.2" stroke="#3a3028" stroke-width=".18"/><ellipse cx="-3.6" cy="0" rx=".6" ry=".15" fill="#fff" opacity=".7"/><ellipse cx="3.6" cy="-.2" rx=".6" ry=".15" fill="#fff" opacity=".7"/></g>`;
  S.teil({ id: "te_seerose", de: "die Seerose", syl: "SEE-ro-se", it: "la ninfea", itSyl: "nin-FE-a", en: "water lily", x: 160, y: WL, kunst: um(160, WL, k),
    zoom: { x: 126, y: 74, w: 81, h: 54 },
    unter: [
      { id: "te_bluete", de: "die Blüte", syl: "BLÜ-te", it: "il fiore", itSyl: "FIO-re", en: "blossom", x: SR.bl[0][0], y: SR.bl[0][1] + 0.6, kunst: flaeche(-5.5, -5, 11, 5.4), tipp: "Die Blüte öffnet sich am Morgen und schließt sich am Abend." },
      { id: "te_schwimmblatt", de: "das Schwimmblatt", syl: "SCHWIMM-blatt", it: "la foglia galleggiante", itSyl: "FO-glia gal-leg-GIAN-te", en: "lily pad", x: SR.blatt[0], y: SR.blatt[1] + 2, kunst: flaeche(-9, -4, 18, 4.4) },
      { id: "te_wasserlaeufer", de: "der Wasserläufer", syl: "WAS-ser-läu-fer", it: "il gerride", itSyl: "GER-ri-de", en: "pond skater", x: SR.wl[0], y: SR.wl[1] + 0.8, kunst: flaeche(-4.6, -2.4, 9.2, 3), tipp: "Er läuft über das Wasser, ohne einzusinken – anderthalb Zentimeter lang." },
      { id: "te_wasserschnecke", de: "die Wasserschnecke", syl: "WAS-ser-schne-cke", it: "la lumaca d'acqua", itSyl: "lu-MA-ca DAC-qua", en: "pond snail", x: SR.sn[0], y: SR.sn[1] + 2, kunst: flaeche(-3, -5, 6, 6), tipp: "Eine Spitzschlammschnecke. Sie weidet den Algenbelag ab und holt an der Oberfläche Luft." },
    ],
    tipp: "Die Seerose wurzelt im Schlamm am Grund – ihre Stiele sind über einen Meter lang." });
}
/* DER FROSCH auf dem vorderen Schwimmblatt (klein: 9 cm) */
function frosch() {
  let s = "";
  s += `<path d="M-3 -1 Q-6 -1 -7 0 L-2 0 Z" fill="#5a8a3a"/>`;
  const K = [[-3.6, -0.6], [-4.2, -2.6], [-2.6, -4.4], [0, -5.2], [2.4, -5.4], [4.2, -4.6], [5, -3.4], [4.6, -2.6], [3, -2.4], [2.6, -1], [3.4, -0.2], [0, 0]];
  let f = form([[-4, -1.4], [3, -1.6], [3, 0.4], [-4, 0.4]], "#e8e4b4", ` opacity=".7"`);
  for (const [x, y] of [[-2, -3.4], [0, -4.4], [-0.6, -2.4], [1.4, -3.6]]) f += `<ellipse cx="${x}" cy="${y}" rx=".5" ry=".35" fill="#2a4a1a"/>`;
  f += `<path d="M-3 -3.6 Q0 -5.4 3 -4.8" stroke="#c8d86a" stroke-width=".3" fill="none"/>`;
  s += koerper(K, S.lg("frosch", [[0, "#8ac44a"], [1, "#4a8a2a"]]), f, { rw: 0.12 });
  s += `<path d="M-2.4 -1.4 Q-1 -3 0 -1.8 Q.6 -.8 -1.2 0" fill="#5a9a34" stroke="#2a4a1a" stroke-width=".1"/>`;
  s += auge(2.8, -4.9, 0.55, "#c8a02a", { pupille: true, flach: 0.8 });
  s += `<circle cx="3.6" cy="-2.6" r=".6" fill="#f2f0e0" opacity=".8"/>`;
  return s;
}
{
  const Z = 6.6, y = yWasser(Z) - 0.1;
  S.teil({ oben: true, id: "te_frosch", de: "der Frosch", syl: "FROSCH", it: "la rana", itSyl: "RA-na", en: "frog", x: 145, y, kunst: skal(sZ(Z) / 100 * 1.15, 1, frosch()) + flaeche(-3.6, -4.6, 7.4, 5),
    tipp: "Ein Teichfrosch – neun Zentimeter. Er sitzt gern auf einem Seerosenblatt in der Sonne." });
}

/* =====================================================================
   6 — DER SCHWAN (Höckerschwan)
   ===================================================================== */
function schwan() {
  let s = "";
  /* Paddelfüße unter Wasser (durch die Wasserkante) */
  s += `<path d="M-6 10 l-5 6 l5 -1 Z M4 12 l-3 7 l5 -2 Z" fill="#2a2a2a" opacity=".55"/>`;
  const K = [[-62, -20], [-56, -32], [-44, -38], [-26, -40], [-10, -40], [6, -36], [16, -32], [22, -40], [24, -56], [22, -70], [24, -78], [30, -80], [36, -78], [44, -72], [46, -69], [40, -69], [34, -72], [30, -70], [30, -62], [32, -48], [30, -32], [24, -16], [10, -4], [-20, -2], [-48, -6]];
  let f = "";
  f += `<path d="M-50 -30 Q-30 -46 -6 -42 Q-18 -30 -40 -22 Z" fill="#fff"/>`;
  f += `<path d="M-48 -24 q14 -8 30 -10 M-44 -18 q14 -8 32 -8 M-40 -12 q16 -4 34 -4" stroke="#c8ccd0" stroke-width=".8" fill="none"/>`;
  f += `<path d="M24 -64 q-2 14 0 30" stroke="#d0d4d8" stroke-width="2" fill="none" opacity=".6"/>`;
  f += `<rect x="-70" y="-6" width="90" height="8" fill="#9aaab0" opacity=".35"/>`;
  s += koerper(K, S.lg("schwan", [[0, "#ffffff"], [0.7, "#eef0f0"], [1, "#c8d0d4"]]), f, { rw: 0.6, rand: "#5a6a70" });
  /* Schnabel orange mit schwarzem Höcker */
  s += `<path d="M36 -78 L44 -73 L47 -69.6 L40 -70 L35 -73 Z" fill="#e8742a"/><path d="M34 -79.4 Q36 -82 38.4 -78.4 L36 -76.6 Z" fill="#141414"/><path d="M36 -75 L39 -73.6" stroke="#141414" stroke-width="1.2"/>`;
  s += auge(34.6, -76, 0.8, "#141414");
  s += `<path d="M-60 -1 Q-20 4 26 -2" stroke="#e8f4f6" stroke-width=".6" fill="none" opacity=".7"/>`;
  return s;
}
{
  const Z = 9.5, y = yWasser(Z);
  S.teil({ id: "te_schwan", de: "der Schwan", syl: "SCHWAN", it: "il cigno", itSyl: "CI-gno", en: "swan", x: 214, y: r(y), kunst: skal(sZ(Z) / 100, 1, schwan()) + `<ellipse cx="0" cy=".6" rx="${r(0.62 * sZ(Z))}" ry="1.2" fill="#2a4a50" opacity=".25"/>`,
    tipp: "Ein Höckerschwan: weiß, mit orangem Schnabel und schwarzem Höcker." });
}

/* =====================================================================
   7 — DIE ENTE (Stockente) und DIE KÜKEN dahinter
   ===================================================================== */
{
  const Z = 7.1, y = yWasser(Z), k = sZ(Z) / 100;
  const fuss = `<path d="M${r(-1)} ${r(6)} l-3 3 l3 0 Z" fill="#e8902a" opacity=".55"/>`;
  S.teil({ id: "te_ente", de: "die Ente", syl: "EN-te", it: "l'anatra", itSyl: "A-na-tra", en: "duck", x: 226, y: r(y), kunst: T.ente(k * 1.1, -1, { art: "weibchen", schwimmt: true }) + fuss + `<ellipse cx="0" cy=".5" rx="${r(0.25 * sZ(Z))}" ry=".8" fill="#2a4a50" opacity=".25"/>`,
    tipp: "Die Entenmutter ist braun gefleckt – so sieht man sie im Schilf kaum." });
  let g = "";
  for (const [dx, dZ, sc] of [[14, 0.2, 1], [22, -0.1, 0.95], [29, 0.3, 1], [36, 0.05, 0.9]]) {
    const yy = yWasser(Z + dZ) - y, kk = sZ(Z + dZ) / 100 * sc;
    g += `<g transform="translate(${dx} ${r(yy)})">${skal(kk * 1.4, -1, `<path d="M-5 -2.6 Q-5 -7 0 -7.4 L3 -9 L3.6 -11.6 Q5 -13.4 6.6 -11.8 L8.4 -11 L6.8 -10.2 Q6.6 -8 4 -7 Q6 -5 5 -2.6 Z" fill="${S.lg("kueken2", [[0, "#e8cf7a"], [1, "#8a6a3a"]])}" stroke="#5a4a2a" stroke-width=".2"/><path d="M-4 -5 q3 -2 7 -1" stroke="#5a4428" stroke-width=".8" fill="none" opacity=".6"/><circle cx="5.6" cy="-11.4" r=".45" fill="#141008"/><path d="M4 -11.2 q1.4 .4 2.6 0" stroke="#5a4428" stroke-width=".3" fill="none"/>`)}</g>`;
  }
  S.teil({ id: "te_kueken", de: "das Küken", syl: "KÜ-ken", it: "l'anatroccolo", itSyl: "a-na-TROC-co-lo", en: "duckling", x: 226, y: r(y), kunst: g,
    tipp: "Die Entenküken schwimmen schon am ersten Tag hinter der Mutter her." });
}

/* =====================================================================
   8 — DER ROHRKOLBEN, DER GRAUREIHER, DER BIBER (rechtes Ufer)
   ===================================================================== */
{
  let k = "";
  for (let i = 0; i < 9; i++) {
    const x0 = 282 + i * 4.2 + rnd() * 2, y0 = 96 - (x0 - 282) * 0.18, h = 52 + rnd() * 16, b = (rnd() - 0.5) * 4;
    k += `<path d="M${r(x0)} ${r(y0)} Q${r(x0 + b * 0.3)} ${r(y0 - h * 0.5)} ${r(x0 + b)} ${r(y0 - h)}" stroke="#7a8a3a" stroke-width=".7" fill="none"/>`;
    k += `<path d="M${r(x0)} ${r(y0)} q${r(-6 + rnd() * 12)} ${r(-h * 0.5)} ${r(-4 + rnd() * 8)} ${r(-h * 0.95)}" stroke="#6a8a3a" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
    if (i % 2 === 0) k += `<rect x="${r(x0 + b * 0.9 - 1.3)}" y="${r(y0 - h * 0.85)}" width="2.6" height="${r(h * 0.17)}" rx="1.3" fill="${S.lg("kolben", [[0, "#6a4024"], [0.5, "#8a5430"], [1, "#5a3420"]], 0, 0, 1, 0)}"/>`;
  }
  S.teil({ id: "te_rohrkolben", de: "der Rohrkolben", syl: "ROHR-kol-ben", it: "la tifa", itSyl: "TI-fa", en: "bulrush", x: 300, y: 94, steht: true, kunst: um(300, 94, k),
    tipp: "Der braune Kolben sieht aus wie eine Zigarre – darin sind tausende Samen." });
}
function reiher() {
  let s = "";
  s += `<path d="M-1 -40 L-2 -14 L-3 6 M2 -40 L3 -14 L2 4" stroke="#b8a46a" stroke-width="1.3" fill="none"/>`;
  s += `<path d="M-3 6 l-4 2 M-3 6 l3 2 M2 4 l4 2" stroke="#9a8a5a" stroke-width=".6"/>`;
  const K = [[-22, -50], [-16, -60], [-6, -66], [4, -66], [10, -68], [14, -76], [12, -86], [16, -92], [22, -93], [26, -91], [24, -88], [19, -88], [18, -82], [21, -72], [18, -62], [10, -50], [2, -42], [-8, -40], [-16, -42]];
  let f = form([[-22, -52], [-6, -66], [6, -64], [-2, -50], [-18, -44]], "#6a7480");
  f += `<path d="M14 -74 q2 8 0 14" stroke="#2a2a2a" stroke-width="1" fill="none" stroke-dasharray="1 1"/>`;
  f += form([[-26, -48], [-14, -46], [-18, -40], [-28, -42]], "#4a525a");
  s += koerper(K, S.lg("reiher", [[0, "#c8d0d6"], [1, "#8a949c"]]), f, { rw: 0.4, rand: "#3a424a" });
  s += form([[16, -92], [24, -93.4], [26, -91.4], [20, -90], [14, -90.6]], "#f4f4f2");
  s += `<path d="M16 -92.6 Q8 -94 2 -92 Q8 -93 15 -91.2" fill="#141414"/>`;
  s += `<path d="M24 -92 L36 -90.6 L24 -89.4 Z" fill="#d8b43a"/>`;
  s += auge(21.4, -91.6, 0.7, "#d8c43a", { pupille: true });
  return s;
}
{
  const Z = 6.9, y = yWasser(Z);
  S.teil({ id: "te_graureiher", de: "der Graureiher", syl: "GRAU-rei-her", it: "l'airone cenerino", itSyl: "ai-RO-ne ce-ne-RI-no", en: "grey heron", x: 278, y: r(y), kunst: skal(sZ(Z) / 100, -1, reiher()),
    tipp: "Der Graureiher steht ganz still im Wasser und wartet auf Fische und Frösche." });
}
function biber() {
  let s = "";
  /* Kelle (flacher, geschuppter Schwanz) */
  s += `<path d="M-14 -2 Q-24 -4 -32 -2 Q-36 0 -32 2 Q-24 3 -14 1 Z" fill="${S.lg("kelle", [[0, "#3a3430"], [1, "#2a2420"]])}"/><path d="M-30 -1.6 l0 3 M-27 -2 l0 4 M-24 -2.2 l0 4 M-21 -2 l0 3.6" stroke="#5a5048" stroke-width=".3"/>`;
  const K = [[-16, -2], [-20, -12], [-16, -24], [-6, -32], [4, -34], [10, -32], [14, -34], [20, -32], [24, -27], [26, -24], [25, -21], [20, -20], [16, -16], [12, -8], [10, -2], [2, 0], [-10, 0]];
  let f = striche(60, -20, -34, 24, 0, 0.6, 1.8, "#2a1a0c", 0.4, 0.45) + striche(30, -20, -34, 24, 0, 0.6, 1.6, "#b8885a", 0.35, 0.4);
  s += koerper(K, S.lg("biber", [[0, "#8a5e3a"], [1, "#5a3a20"]]), f, { rw: 0.4 });
  s += `<ellipse cx="13" cy="-33" rx="1.6" ry="1.2" fill="#4a3020"/>`;
  s += auge(18.4, -28.6, 0.9, "#141008");
  s += `<ellipse cx="25.6" cy="-24.6" rx="1" ry=".8" fill="#141008"/>`;
  s += `<rect x="22.6" y="-21.6" width="1.6" height="2.2" rx=".3" fill="#d8742a"/>`;
  /* Vorderpfoten halten einen Zweig */
  s += `<path d="M14 -16 q4 0 6 -2" stroke="#3a2418" stroke-width="2" stroke-linecap="round" fill="none"/>`;
  s += `<path d="M10 -18 L34 -14" stroke="#9a8a6a" stroke-width="1.4" stroke-linecap="round"/><path d="M28 -15 l4 -4 M31 -14.6 l2 -5" stroke="#6a8a3a" stroke-width=".6"/><path d="M18 -17 l5 .8" stroke="#e8dcc0" stroke-width="1.4"/>`;
  return s;
}
{
  const x = 307, y = 91;
  const k = sZ(6.3) / 100;
  let g = `<path d="M10 2 L11 -8 L15 -8 L16 2 Z" fill="#8a7a5a"/><path d="M11 -8 L13 -12 L15 -8 Z" fill="#e8dcc0"/><ellipse cx="13" cy="2" rx="5" ry="1" fill="#e8dcc0" opacity=".8"/>`;
  S.teil({ id: "te_biber", de: "der Biber", syl: "BI-ber", it: "il castoro", itSyl: "ca-STO-ro", en: "beaver", x, y, kunst: schatten(0, 0.3, 14, 1.2, 0.3) + skal(k, -1, biber()),
    tipp: "Er fällt Bäume mit den Zähnen und staut damit das Wasser." });
}

/* =====================================================================
   9 — UNTER WASSER: Goldfisch, Karpfen, Molch, Krebs, Algen
   ===================================================================== */
function fisch(art) {
  /* Seitenansicht, Kopf rechts; Länge 100 Einheiten */
  const karpfen = art === "karpfen";
  const FB = karpfen ? S.lg("karpfen", [[0, "#6a5a32"], [0.45, "#b8963a"], [0.8, "#d8b45a"], [1, "#e8d8a0"]]) : S.lg("goldfisch", [[0, "#e85a1a"], [0.6, "#f08a2a"], [1, "#f8c46a"]]);
  let s = "";
  /* Schwanzflosse, Rücken-, Bauch-, Brustflosse */
  s += `<path d="M-44 0 L-62 -16 Q-58 0 -62 16 Z" fill="${karpfen ? "#8a6a3a" : "#f07a2a"}" opacity=".9"/>`;
  s += `<path d="M-14 -${karpfen ? 22 : 18} Q4 -${karpfen ? 34 : 30} 14 -${karpfen ? 22 : 18} Z" fill="${karpfen ? "#7a6034" : "#f08030"}" opacity=".9"/>`;
  s += `<path d="M-30 10 L-36 18 L-24 12 Z M6 14 L2 22 L12 14 Z" fill="${karpfen ? "#9a7a44" : "#f8a050"}" opacity=".85"/>`;
  const K = karpfen ? [[-46, 0], [-34, -14], [-12, -24], [12, -24], [30, -16], [44, -6], [48, 0], [44, 6], [30, 14], [6, 18], [-20, 14], [-36, 8]]
    : [[-46, 0], [-32, -12], [-10, -20], [12, -18], [30, -12], [44, -4], [47, 0], [44, 5], [30, 12], [6, 16], [-20, 12], [-36, 6]];
  let f = "";
  /* Schuppen */
  let sc = "";
  for (let x = -30; x < 32; x += 6) for (let y = -16; y < 14; y += 5) sc += `M${x + ((y / 5) % 2 ? 3 : 0)} ${y}q3 2.6 0 5`;
  f += `<path d="${sc}" stroke="${karpfen ? "#5a4420" : "#c8501a"}" stroke-width=".7" fill="none" opacity=".5"/>`;
  f += `<path d="M-40 -1 Q0 ${karpfen ? -4 : -3} 40 -1" stroke="${karpfen ? "#4a3818" : "#c8501a"}" stroke-width=".8" fill="none" opacity=".5"/>`;
  f += `<path d="M28 -14 Q34 0 28 14" stroke="#000" stroke-opacity=".25" stroke-width="1.2" fill="none"/>`;
  s += koerper(K, FB, f, { rw: 0.8, rand: karpfen ? "#3a2a10" : "#a03a10" });
  s += `<path d="M18 4 L12 10 L22 8 Z" fill="${karpfen ? "#b8963a" : "#f8b060"}" opacity=".9"/>`;
  s += auge(38, -4, 2.6, karpfen ? "#d8b43a" : "#1a0a04", { pupille: karpfen });
  if (karpfen) s += `<path d="M47 2 q2 4 -1 7 M46 4 q4 3 3 6" stroke="#6a5030" stroke-width=".7" fill="none"/>`;
  s += `<path d="M46 1.6 q1.6 .6 2 0" stroke="#3a2010" stroke-width=".6" fill="none"/>`;
  return s;
}
{
  S.teil({ id: "te_goldfisch", de: "der Goldfisch", syl: "GOLD-fisch", it: "il pesce rosso", itSyl: "PE-sce ROS-so", en: "goldfish", x: 112, y: 128, kunst: skal(0.15 * 50 / 100, 1, fisch("gold")) + skal(0.12 * 50 / 100, 1, `<g transform="translate(-90 70)">${fisch("gold")}</g>`),
    tipp: "Goldfische stammen aus China. Im Teich überleben sie sogar den Winter unter dem Eis." });
  S.teil({ id: "te_fisch", de: "der Fisch", syl: "FISCH", it: "il pesce", itSyl: "PE-sce", en: "fish", x: 196, y: 148, kunst: skal(0.45 * 50 / 100, -1, fisch("karpfen")),
    tipp: "Ein Karpfen – 45 Zentimeter lang. Mit den Barteln am Maul sucht er Futter im Schlamm." });
}
function molch() {
  let s = "";
  s += `<path d="M-6 1 l-2 3 M4 1 l2 3 M-5 -.6 l-3 -2 M4 -.6 l3 -2" stroke="#4a5a6a" stroke-width=".8" stroke-linecap="round"/>`;
  const K = [[-22, 0], [-16, -1.4], [-6, -2.2], [4, -2.4], [8, -2.6], [11, -2], [12.6, -.8], [12, .6], [9, 1.4], [4, 1.8], [-6, 1.8], [-16, 1.2]];
  let f = form([[-16, 0.4], [10, 0.2], [10, 2], [-16, 2]], "#e8762a");
  for (let i = 0; i < 10; i++) f += `<circle cx="${r(-16 + i * 2.8)}" cy="${r(-0.8 + (i % 2) * 0.6)}" r=".35" fill="#1a2430"/>`;
  s += koerper(K, S.lg("molch", [[0, "#4a6a8a"], [1, "#2a3a4a"]]), f, { rw: 0.15 });
  s += auge(9.6, -1.2, 0.5, "#c8a02a");
  return s;
}
S.teil({ id: "te_molch", de: "der Molch", syl: "MOLCH", it: "il tritone", itSyl: "tri-TO-ne", en: "newt", x: 236, y: 132, kunst: skal(0.5, -1, `<g transform="rotate(-10)">${molch()}</g>`),
  tipp: "Ein Bergmolch, zwölf Zentimeter lang. Im Frühjahr lebt er im Wasser, den Rest des Jahres an Land unter Steinen." });
function krebs() {
  let s = "";
  /* Edelkrebs von der Seite, Scheren nach vorn (rechts) */
  s += `<path d="M-2 0 l-2 3 M1 0 l0 3 M4 0 l1 3 M7 0 l2 3" stroke="#4a2a1a" stroke-width=".6"/>`;
  const K = [[-18, -1], [-16, -3], [-10, -4], [-4, -5], [2, -6], [8, -6], [12, -5], [14, -3], [12, -1], [4, 0], [-8, 0], [-16, 1]];
  let f = "";
  for (let x = -14; x < 0; x += 3) f += `<path d="M${x} -4.6 l0 4.6" stroke="#2a1408" stroke-width=".4" opacity=".6"/>`;
  s += koerper(K, S.lg("krebs", [[0, "#b06a3a"], [0.6, "#8a4a26"], [1, "#5a2e16"]]), f, { rw: 0.25 });
  s += `<path d="M-18 -1 l-4 -2 l1 3 l-1 3 l4 -2 Z" fill="#5a3a24"/>`;
  s += `<path d="M12 -4 Q18 -6 20 -4 M12 -2 Q18 -1 21 0" stroke="#4a2a1a" stroke-width="1" fill="none"/>`;
  s += `<path d="M20 -4 Q26 -9 30 -6 Q27 -5 24 -4 Q28 -3 30 -4 Q27 -1 20 -3 Z M21 0 Q27 -2 31 1 Q28 1 25 1 Q28 2 30 3 Q26 4 21 1 Z" fill="#9a5430" stroke="#3a1a08" stroke-width=".25"/>`;
  s += `<path d="M14 -5 Q24 -14 34 -12 M14 -5 Q22 -10 30 -16" stroke="#4a2a1a" stroke-width=".25" fill="none"/>`;
  s += `<circle cx="13" cy="-5.4" r=".6" fill="#141008"/>`;
  return s;
}
S.teil({ id: "te_krebs", de: "der Flusskrebs", syl: "FLUSS-krebs", it: "il gambero", itSyl: "GAM-be-ro", en: "crayfish", x: 214, y: 178, kunst: `<ellipse cx="2" cy="1.6" rx="10" ry="3.2" fill="#8a8a7a"/><ellipse cx="0" cy=".6" rx="6" ry="1.2" fill="#b4b4a4" opacity=".6"/>` + skal(0.16 * 50 / 30, 1, krebs()),
  tipp: "Er lebt auf dem Grund und geht rückwärts, wenn er erschrickt." });
{
  /* Algen: Fadenalgen auf Steinen am Grund */
  let k = `<ellipse cx="-6" cy="-2" rx="7" ry="3.6" fill="#7a7a6a"/><ellipse cx="5" cy="-1.4" rx="5" ry="2.8" fill="#6a6a5a"/><ellipse cx="-7" cy="-3.6" rx="3.6" ry="1.2" fill="#a4a494" opacity=".6"/>`;
  let d = "";
  for (let i = 0; i < 22; i++) { const x = -12 + rnd() * 22, y = -3 - rnd() * 2, l = 6 + rnd() * 10, b = (rnd() - 0.5) * 6; d += `M${r(x)} ${r(y)}q${r(b)} ${r(-l / 2)} ${r(b * 0.4 + 2)} ${r(-l)}`; }
  k += `<path d="${d}" stroke="#6aa83a" stroke-width=".7" fill="none" opacity=".9"/><path d="${d}" stroke="#a8d86a" stroke-width=".25" fill="none" transform="translate(.3 0)"/>`;
  S.teil({ id: "te_algen", de: "die Algen", syl: "AL-gen", it: "le alghe", itSyl: "AL-ghe", en: "algae", x: 128, y: 180, steht: true, kunst: k,
    tipp: "Algen sind winzige Pflanzen. Wenn es zu viele werden, wird der Teich grün." });
}

/* =====================================================================
   VORNE: Wasserkante (dünne, helle Linie) und grüner Schleier unter Wasser
   ===================================================================== */
{
  let w = `M0 ${WL}`;
  for (let x = 0; x <= 320; x += 4) w += `L${x} ${r(WL + Math.sin(x / 7) * 0.5)}`;
  S.davor(`<g pointer-events="none"><rect x="0" y="${WL}" width="320" height="${200 - WL}" fill="#3a7a5a" opacity=".12"/><path d="${w}" stroke="#f2fbfa" stroke-width=".8" fill="none" opacity=".85"/><rect x="0" y="${WL}" width="320" height="3" fill="${S.lg("kante", [[0, "#ffffff", 0.35], [1, "#ffffff", 0]])}"/></g>`);
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/teich.js"));
console.log(aus);
