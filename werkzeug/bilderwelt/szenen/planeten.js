#!/usr/bin/env node
/* =====================================================================
   DER NACHTHIMMEL (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Zeiss-Großplanetarium Berlin, Planetarium Hamburg,
   NASA/ESA Planetendaten):
   - Im PLANETARIUM sitzt man in Liegesesseln unter einer weißen KUPPEL;
     in der Mitte steht der STERNPROJEKTOR (bei Zeiss früher die
     „Hantel“ mit zwei Sternkugeln). Am Kuppelrand die Silhouette der
     Stadt (in Berlin mit dem Fernsehturm).
   - Bei Vorträgen erzählen ESA-ASTRONAUTEN im blauen Fluganzug von der
     Raumstation; im Saal steht ein RAKETENMODELL.
   - Die Show zeigt das SONNENSYSTEM in der richtigen Reihenfolge:
     Merkur, Venus, Erde (mit Mond), Mars, Asteroidengürtel, Jupiter,
     Saturn, Uranus, Neptun. GRÖSSEN maßstäblich (Erde = 1): Merkur 0,38,
     Venus 0,95, Mars 0,53, Jupiter 11,2, Saturn 9,4 (Ringe 2,3-mal so
     breit), Uranus 4,0, Neptun 3,9, Sonne 109. Die Abstände passen
     nicht ins Bild — sie sind gestaucht, die Reihenfolge stimmt.
   - Licht kommt von der Sonne (links): Tagseite links, Nachtseite
     rechts; der Kometenschweif zeigt immer von der Sonne weg.
   MASSSTAB der Projektion: Erdradius = 2 Einheiten. Saal: vordere
   Sesselreihe ≈ 40 Einheiten je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "planeten", titel: "Der Nachthimmel", emoji: "🪐", thema: "Natur", kuerzel: "b20d", fassung: 852 });
const rnd = zufall(1609);
const r = B.r;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const knapp = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);
const mensch = (spec, h) => { const m = B.mensch(spec, h); m.svg = knapp(m.svg); return m; };
const SONNE = [-198, 84], ER = 2;                 // Sonnenmitte (links außerhalb), Erdradius
const RAND = (x) => 128 + Math.pow((x - 160) / 160, 2) * -8 + 12;   // Kuppelrand (Mitte y 140, Seiten 132)

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("glut")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter>`);
/* Planetenkugel: Licht von links (Sonne), Nachtseite rechts */
const kugel = (name, stops) => S.rg(name, stops, 0.3, 0.42, 0.85);
const nacht = S.lg("nacht", [[0, "#000", 0], [0.52, "#000", 0.05], [0.8, "#000", 0.55], [1, "#000", 0.85]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Saal: Sesselreihen unter der Kuppel
   ===================================================================== */
{
  let k = `<rect width="320" height="200" fill="#07090f"/>`;
  /* Boden/Saal unten */
  k += `<path d="M0 132 Q160 148 320 132 L320 200 L0 200 Z" fill="${S.lg("saal", [[0, "#141826"], [1, "#0b0d14"]])}"/>`;
  /* Sesselreihen (Rückenlehnen von hinten, schwach vom Kuppellicht beschienen) */
  const reihe = (y, sk, n, off) => {
    let g = "";
    for (let i = 0; i < n; i++) {
      const x = off + i * 15 * sk, w = 11 * sk, h = 10 * sk;
      g += `<path d="M${r(x - w / 2)} ${r(y)} L${r(x - w / 2)} ${r(y - h * 0.7)} Q${r(x - w / 2)} ${r(y - h)} ${r(x)} ${r(y - h)} Q${r(x + w / 2)} ${r(y - h)} ${r(x + w / 2)} ${r(y - h * 0.7)} L${r(x + w / 2)} ${r(y)} Z" fill="${S.lg("lehne", [[0, "#2b3a6a"], [1, "#151d3a"]])}"/>`;
      g += `<path d="M${r(x - w / 2 + 0.8)} ${r(y - h * 0.75)} Q${r(x)} ${r(y - h * 1.02)} ${r(x + w / 2 - 0.8)} ${r(y - h * 0.75)}" stroke="#5a6fb0" stroke-width=".4" fill="none" opacity=".6"/>`;
    }
    return g;
  };
  k += reihe(152, 0.7, 26, -6) + reihe(162, 0.85, 22, -10);
  k += `<path d="M0 174 Q160 186 320 174 L320 200 L0 200 Z" fill="#0d1018"/>`;
  k += reihe(186, 1.15, 16, 6);
  /* Leselicht am Boden der Gänge */
  for (let x = 20; x < 320; x += 60) k += `<circle cx="${x}" cy="197" r=".7" fill="#7fa0ff" opacity=".7"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE KUPPEL (mit projiziertem Sternenhimmel und Stadtrand)
   ===================================================================== */
{
  let d = `M0 0 L320 0 L320 ${r(RAND(320))}`;
  for (let x = 320; x >= 0; x -= 20) d += ` L${x} ${r(RAND(x))}`;
  d += " Z";
  let k = `<path d="${d}" fill="${S.rg("kuppel", [[0, "#0d1530"], [0.6, "#070b1c"], [1, "#04060f"]], 0.55, 0.15, 0.9)}"/>`;
  /* Sterne verschiedener Helligkeit und Farbe */
  for (let i = 0; i < 230; i++) {
    const x = rnd() * 320, y = rnd() * (RAND(x) - 8), h = rnd();
    k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.18 + h * h * 0.6)}" fill="${h > 0.9 ? "#ffe2c0" : h > 0.8 ? "#cfe0ff" : "#ffffff"}" opacity="${r(0.4 + h * 0.6)}"/>`;
  }
  /* Kuppelrand: Silhouette von Bäumen, Häusern und dem Fernsehturm */
  let sil = `M0 ${r(RAND(0))}`;
  for (let x = 0; x <= 320; x += 4) {
    const base = RAND(x), h = (x > 196 && x < 206) ? 0 : 2 + Math.abs(Math.sin(x * 0.37)) * 3 + (x % 28 < 8 ? 3 : 0);
    sil += ` L${x} ${r(base - h)}`;
  }
  sil += ` L320 ${r(RAND(320) + 4)} L0 ${r(RAND(0) + 4)} Z`;
  k += `<path d="${sil}" fill="#020306"/>`;
  const tx = 201, ty = RAND(201);
  k += `<path d="M${tx - 0.9} ${r(ty)} L${tx - 0.5} ${r(ty - 20)} L${tx + 0.5} ${r(ty - 20)} L${tx + 0.9} ${r(ty)} Z" fill="#020306"/><circle cx="${tx}" cy="${r(ty - 15)}" r="1.8" fill="#020306"/><rect x="${tx - 0.2}" y="${r(ty - 25)}" width=".4" height="6" fill="#020306"/><circle cx="${tx}" cy="${r(ty - 25)}" r=".4" fill="#ff4a3a"/>`;
  k += `<path d="M0 ${r(RAND(0) + 1)} Q160 ${RAND(160) + 9} 320 ${r(RAND(320) + 1)}" stroke="#1b2133" stroke-width="2" fill="none"/>`;
  S.teil({ id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: 160, y: 142, kunst: um(160, 142, k),
    tipp: "Die Kuppel ist eine große Leinwand. Der Projektor malt den Himmel darauf." });
}

/* =====================================================================
   2 — DIE MILCHSTRASSE, 3 — DIE GALAXIE, 4 — DER STERN, 5 — DER KOMET
   ===================================================================== */
{
  const x = 210, y = 30;
  let k = `<g filter="url(#${S.id("dunst")})" opacity=".55">`;
  k += `<path d="M150 0 Q200 20 240 34 Q280 48 320 52 L320 30 Q282 24 248 12 Q222 2 196 0 Z" fill="${S.lg("milch", [[0, "#9fb0d8", 0.2], [0.5, "#dde4f4", 0.55], [1, "#9fb0d8", 0.2]], 0, 0, 0, 1)}"/>`;
  k += `<path d="M178 2 Q220 18 262 30 Q292 38 320 42" stroke="#0a0e1e" stroke-width="2.2" fill="none" opacity=".7"/></g>`;
  for (let i = 0; i < 70; i++) { const t = rnd(), px = 160 + t * 160, py = t * 44 + (rnd() - 0.5) * 18; k += `<circle cx="${r(px)}" cy="${r(py)}" r="${r(0.15 + rnd() * 0.25)}" fill="#ffffff" opacity=".8"/>`; }
  S.teil({ id: "milchstrasse", de: "die Milchstraße", syl: "MILCH-stra-ße", it: "la Via Lattea", itSyl: "VI-a LAT-te-a", en: "Milky Way", x, y, kunst: um(x, y, k),
    tipp: "Die Milchstraße ist unsere Galaxie — Milliarden Sterne, von der Seite gesehen." });
}
{
  /* Andromeda: schräge Spirale mit hellem Kern */
  const x = 286, y = 18;
  let k = `<g transform="rotate(-32 ${x} ${y})">`;
  k += `<ellipse cx="${x}" cy="${y}" rx="17" ry="5" fill="${S.rg("andro", [[0, "#fff3d6", 0.95], [0.25, "#e8dcc4", 0.55], [0.7, "#8ea0c8", 0.25], [1, "#8ea0c8", 0]])}"/>`;
  k += `<ellipse cx="${x}" cy="${y}" rx="11" ry="3.1" fill="none" stroke="#3a3048" stroke-width=".5" opacity=".6"/><ellipse cx="${x}" cy="${y}" rx="14" ry="4" fill="none" stroke="#c8d4f0" stroke-width=".3" opacity=".4"/>`;
  k += `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.4" fill="#fffaf0"/></g>`;
  k += `<ellipse cx="${x + 9}" cy="${y + 6}" rx="1.4" ry="1" fill="#e6dcc8" opacity=".6"/>`;
  S.teil({ id: "galaxie", de: "die Galaxie", syl: "Ga-la-XIE", it: "la galassia", itSyl: "ga-LAS-sia", en: "galaxy", x, y: y + 10, kunst: um(x, y + 10, k),
    tipp: "Die Andromeda-Galaxie ist 2,5 Millionen Lichtjahre weit weg — und trotzdem mit bloßem Auge zu sehen." });
}
{
  /* ein heller Stern mit Strahlenkreuz (Sirius, weißblau) */
  const x = 112, y = 22;
  let k = `<circle cx="${x}" cy="${y}" r="5" fill="${S.rg("sternhof", [[0, "#ffffff", 0.7], [0.3, "#cfe0ff", 0.25], [1, "#cfe0ff", 0]])}"/>`;
  k += `<path d="M${x - 6} ${y} L${x + 6} ${y} M${x} ${y - 6} L${x} ${y + 6}" stroke="#e8f0ff" stroke-width=".35"/><path d="M${x - 2.6} ${y - 2.6} L${x + 2.6} ${y + 2.6} M${x + 2.6} ${y - 2.6} L${x - 2.6} ${y + 2.6}" stroke="#e8f0ff" stroke-width=".2" opacity=".6"/>`;
  k += `<circle cx="${x}" cy="${y}" r="1.1" fill="#ffffff"/>`;
  S.teil({ id: "stern", de: "der Stern", syl: "STERN", it: "la stella", itSyl: "STEL-la", en: "star", x, y: y + 4, kunst: um(x, y + 4, k) + flaeche(-5, -9, 10, 10),
    tipp: "Sirius ist der hellste Stern am Nachthimmel. Jeder Stern ist eine Sonne — nur sehr weit weg." });
}
{
  /* Komet: Kern, Koma, gebogener Staubschweif und gerader Ionenschweif — von der Sonne weg */
  const x = 168, y = 26;
  let k = `<path d="M${x} ${y} Q${x + 30} ${y - 8} ${x + 58} ${y - 6} L${x + 56} ${y - 1} Q${x + 30} ${y - 2} ${x} ${y + 1.6} Z" fill="${S.lg("staub", [[0, "#fff6dc", 0.85], [1, "#fff6dc", 0]], 0, 0, 1, 0)}" filter="url(#${S.id("dunst")})"/>`;
  k += `<path d="M${x} ${y - 0.4} L${x + 64} ${y - 14} L${x + 64} ${y - 11.6} Z" fill="${S.lg("ionen", [[0, "#9cc8ff", 0.8], [1, "#9cc8ff", 0]], 0, 0, 1, 0)}"/>`;
  k += `<circle cx="${x}" cy="${y}" r="2.4" fill="${S.rg("koma", [[0, "#ffffff"], [0.4, "#dff0ff", 0.8], [1, "#9cc8ff", 0]])}"/>`;
  k += `<circle cx="${x}" cy="${y}" r=".7" fill="#ffffff"/>`;
  S.teil({ id: "komet", de: "der Komet", syl: "Ko-MET", it: "la cometa", itSyl: "co-ME-ta", en: "comet", x: x + 20, y: y + 3, kunst: um(x + 20, y + 3, k),
    tipp: "Ein Komet ist ein schmutziger Schneeball. Nahe der Sonne bekommt er einen Schweif — der zeigt immer von der Sonne weg." });
}

/* =====================================================================
   6 — DIE SONNE (riesig: 109-mal die Erde — nur ihr Rand passt ins Bild)
   ===================================================================== */
{
  const R = 109 * ER, [cx, cy] = SONNE;
  /* nur der sichtbare Teil: Kreissegment rechts von x = 0, oben/unten am Kuppelrand gekappt */
  const seg = (RR, y0, y1) => { const xa = cx + Math.sqrt(RR * RR - (y0 - cy) ** 2), xb = cx + Math.sqrt(RR * RR - (y1 - cy) ** 2); return `M0 ${y0} L${r(xa)} ${y0} A${RR} ${RR} 0 0 1 ${r(xb)} ${y1} L0 ${y1} Z`; };
  const us = ' gradientUnits="userSpaceOnUse"';
  let k = `<path d="${seg(R + 16, 0, 138)}" fill="${S.rg("korona", [[0, "#ffb347", 0], [0.9, "#ffb347", 0], [0.94, "#ffcf6a", 0.45], [1, "#ffcf6a", 0]], cx, cy, R + 16, us)}"/>`;
  k += `<path d="${seg(R, 0, 138)}" fill="${S.rg("sonne", [[0, "#fff8d6"], [0.86, "#ffe07a"], [0.95, "#ffb02a"], [1, "#e86a10"]], cx, cy, R, us)}"/>`;
  /* Granulation und Sonnenflecken nahe dem Rand */
  for (let i = 0; i < 40; i++) { const a = (rnd() - 0.5) * 0.55, d = R - 2 - rnd() * 14; k += `<circle cx="${r(SONNE[0] + Math.cos(a) * d)}" cy="${r(SONNE[1] + Math.sin(a) * d)}" r="${r(0.4 + rnd() * 0.7)}" fill="#fff4c0" opacity=".18"/>`; }
  k += `<ellipse cx="${r(SONNE[0] + R - 8)}" cy="${SONNE[1] - 20}" rx="1.4" ry="2.2" fill="#8a3a0c" opacity=".8"/><ellipse cx="${r(SONNE[0] + R - 6)}" cy="${SONNE[1] + 30}" rx="1" ry="1.6" fill="#8a3a0c" opacity=".7"/>`;
  /* Protuberanz */
  k += `<path d="M${r(SONNE[0] + Math.sqrt(R * R - 36))} ${SONNE[1] + 6} q2.6 -1.4 2.4 -4.4 q-.4 -2 -1.6 -1.6" stroke="#ff6a1a" stroke-width=".9" fill="none" opacity=".7" filter="url(#${S.id("dunst")})"/>`;
  S.teil({ id: "sonne", de: "die Sonne", syl: "SON-ne", it: "il sole", itSyl: "SO-le", en: "sun", x: 4, y: 140, kunst: um(4, 140, k) + flaeche(-4, -120, 18, 100),
    tipp: "Die Sonne ist so groß, dass 109 Erden nebeneinander in sie hineinpassen." });
}

const bahn = (x) => x - SONNE[0];

/* =====================================================================
   7 — DIE UMLAUFBAHN der inneren Planeten (Lupe: Merkur, Venus, Erde, Mond, Mars)
   ===================================================================== */
{
  const Y = SONNE[1];
  const unter = [];
  let k = "";
  const inn = [
    { id: "merkur", x: 26, R: 0.38 * ER, de: "der Merkur", syl: "MER-kur", it: "Mercurio", itSyl: "mer-CU-rio", en: "Mercury", f: [[0, "#d6d0c8"], [0.6, "#9a948c"], [1, "#5e5a55"]], tipp: "Der Merkur ist der kleinste Planet und der Sonne am nächsten." },
    { id: "venus", x: 34, R: 0.95 * ER, de: "die Venus", syl: "VE-nus", it: "Venere", itSyl: "VE-ne-re", en: "Venus", f: [[0, "#fff6dc"], [0.6, "#e9d3a0"], [1, "#a88a52"]], tipp: "Die Venus ist fast so groß wie die Erde, aber unter ihren Wolken ist es 460 Grad heiß." },
    { id: "erde", x: 44, R: ER, de: "die Erde", syl: "ER-de", it: "la Terra", itSyl: "TER-ra", en: "Earth", f: [[0, "#9fd0ff"], [0.6, "#2f6fc0"], [1, "#163a72"]], tipp: "Die Erde: der einzige Planet, auf dem wir Leben kennen." },
    { id: "mars", x: 56, R: 0.53 * ER, de: "der Mars", syl: "MARS", it: "Marte", itSyl: "MAR-te", en: "Mars", f: [[0, "#f4b07a"], [0.6, "#c8562a"], [1, "#7a2a12"]], tipp: "Der Mars ist rot, weil sein Boden rostiges Eisen enthält." },
  ];
  for (const p of inn) {
    const R0 = bahn(p.x);
    k += `<path d="M${r(SONNE[0] + Math.sqrt(R0 * R0 - 30 * 30))} ${Y - 30} A${R0} ${R0} 0 0 1 ${r(SONNE[0] + Math.sqrt(R0 * R0 - 30 * 30))} ${Y + 30}" stroke="#7d8fc0" stroke-width=".18" fill="none" opacity=".45"/>`;
    let g = `<circle cx="${p.x}" cy="${Y}" r="${r(p.R)}" fill="${kugel(p.id, p.f)}"/>`;
    if (p.id === "erde") {
      g += `<path d="M${p.x - 1.2} ${Y - 1.2} q.8 -.4 1.2 .2 q.2 .8 -.4 1.2 q-.8 .2 -.8 -.6 Z M${p.x + 0.2} ${Y + 0.4} q.8 -.2 1 .6 q-.4 .6 -1 .2 Z" fill="#5f9a4a"/>`;
      g += `<path d="M${p.x - 1.6} ${Y - 0.2} q1 -.4 2 0 M${p.x - 1} ${Y + 1.2} q1 -.3 1.8 .1" stroke="#ffffff" stroke-width=".25" fill="none" opacity=".85"/><path d="M${p.x - 0.6} ${Y - 1.9} q.6 -.1 1.2 0" stroke="#ffffff" stroke-width=".3"/>`;
    }
    if (p.id === "mars") g += `<path d="M${p.x - 0.4} ${Y - 0.95} q.4 -.2 .8 0" stroke="#fff" stroke-width=".25"/><circle cx="${p.x + 0.1}" cy="${Y + 0.2}" r=".3" fill="#7a2a12" opacity=".6"/>`;
    if (p.id === "merkur") g += `<circle cx="${p.x - 0.2}" cy="${Y - 0.2}" r=".12" fill="#6e6a64"/><circle cx="${p.x + 0.2}" cy="${Y + 0.3}" r=".1" fill="#6e6a64"/>`;
    g += `<circle cx="${p.x}" cy="${Y}" r="${r(p.R)}" fill="${nacht}"/>`;
    k += g;
    unter.push({ id: p.id, de: p.de, syl: p.syl, it: p.it, itSyl: p.itSyl, en: p.en, tipp: p.tipp, x: p.x, y: Y + p.R + 1, kunst: flaeche(-Math.max(2.2, p.R + 1), -2 * p.R - 2, 2 * Math.max(2.2, p.R + 1), 2 * p.R + 3) });
  }
  /* Mond neben der Erde */
  const mx = 48.6, my = Y - 2.6, mr = 0.27 * ER;
  k += `<circle cx="${mx}" cy="${my}" r="${r(mr)}" fill="${kugel("mond", [[0, "#f2f2ee"], [0.6, "#b8b8b2"], [1, "#6e6e6a"]])}"/><circle cx="${mx}" cy="${my}" r="${r(mr)}" fill="${nacht}"/>`;
  unter.push({ id: "mond", de: "der Mond", syl: "MOND", it: "la Luna", itSyl: "LU-na", en: "moon", x: mx, y: my + mr + 0.6, kunst: flaeche(-1.6, -2.8, 3.2, 3), tipp: "Der Mond kreist um die Erde. Er ist ein Viertel so groß wie sie." });
  /* Beschriftung der Show */
  k += `<text x="41" y="${Y + 10}" font-size="2.4" fill="#9fb2e6" text-anchor="middle" font-family="Arial" opacity=".8">innere Planeten</text>`;
  S.teil({ id: "umlaufbahn", de: "die Umlaufbahn", syl: "UM-lauf-bahn", it: "l'orbita", itSyl: "OR-bi-ta", en: "orbit", x: 41, y: Y + 11, kunst: um(41, Y + 11, k),
    zoom: { x: 20, y: Y - 13, w: 42, h: 28 }, unter,
    tipp: "Jeder Planet läuft auf seiner Umlaufbahn um die Sonne. Die vier inneren Planeten sind klein und aus Gestein." });
}

/* =====================================================================
   8 — DER ASTEROIDENGÜRTEL, 9 — JUPITER, 10 — SATURN, 11 — URANUS, 12 — NEPTUN
   ===================================================================== */
{
  const x0 = 66, Y = SONNE[1];
  let k = "";
  for (let i = 0; i < 90; i++) { const R0 = bahn(x0) + (rnd() - 0.5) * 6, a = (rnd() - 0.5) * 0.22; k += `<circle cx="${r(SONNE[0] + Math.cos(a) * R0)}" cy="${r(Y + Math.sin(a) * R0)}" r="${r(0.15 + rnd() * 0.35)}" fill="${rnd() < 0.5 ? "#a59a8a" : "#7d7468"}"/>`; }
  S.teil({ id: "asteroidenguertel", de: "der Asteroidengürtel", syl: "As-te-ro-I-den-gür-tel", it: "la fascia degli asteroidi", itSyl: "FA-scia de-gli a-ste-RO-i-di", en: "asteroid belt", x: x0, y: Y + 34, kunst: um(x0, Y + 34, k) + flaeche(-4, -68, 8, 68),
    tipp: "Zwischen Mars und Jupiter kreisen Millionen Felsbrocken." });
}
{
  const x = 94, Y = SONNE[1], R = 11.2 * ER;
  S.def(`<clipPath id="${S.id("jup")}"><circle cx="${x}" cy="${Y}" r="${R}"/></clipPath>`);
  let k = `<circle cx="${x}" cy="${Y}" r="${R}" fill="#d9c3a0"/>`;
  let b = "";
  const baender = [[-0.62, 0.1, "#b89a74"], [-0.4, 0.08, "#c9a983"], [-0.22, 0.12, "#a8784e"], [-0.02, 0.1, "#efe2c8"], [0.14, 0.14, "#9c6a44"], [0.34, 0.08, "#c7a27a"], [0.52, 0.1, "#b8916a"], [0.7, 0.12, "#a8906e"]];
  for (const [t, h, f] of baender) b += `<path d="M${x - R} ${r(Y + t * R)} Q${x} ${r(Y + t * R - R * 0.04)} ${x + R} ${r(Y + t * R)} L${x + R} ${r(Y + (t + h) * R)} Q${x} ${r(Y + (t + h) * R - R * 0.03)} ${x - R} ${r(Y + (t + h) * R)} Z" fill="${f}"/>`;
  for (let i = 0; i < 16; i++) { const yy = Y + (rnd() - 0.5) * R * 1.4; b += `<path d="M${r(x - R + rnd() * R)} ${r(yy)} q4 -.8 8 0" stroke="#f3e6cc" stroke-width=".35" fill="none" opacity=".5"/>`; }
  b += `<ellipse cx="${r(x + R * 0.18)}" cy="${r(Y + R * 0.3)}" rx="${r(R * 0.2)}" ry="${r(R * 0.1)}" fill="#c4552e"/><ellipse cx="${r(x + R * 0.18)}" cy="${r(Y + R * 0.3)}" rx="${r(R * 0.14)}" ry="${r(R * 0.06)}" fill="#d9744a"/>`;
  k += `<g clip-path="url(#${S.id("jup")})">${b}</g>`;
  k += `<circle cx="${x}" cy="${Y}" r="${R}" fill="${S.rg("kugellicht", [[0, "#fff", 0.18], [0.5, "#fff", 0], [1, "#000", 0]], 0.3, 0.4, 0.8)}"/><circle cx="${x}" cy="${Y}" r="${R}" fill="${nacht}"/>`;
  /* zwei Galileische Monde */
  k += `<circle cx="${x - R - 5}" cy="${Y + 1}" r=".55" fill="#e8dcc0"/><circle cx="${x + R + 7}" cy="${Y - 1}" r=".5" fill="#cfc9be"/>`;
  S.teil({ id: "jupiter", de: "der Jupiter", syl: "JU-pi-ter", it: "Giove", itSyl: "GIO-ve", en: "Jupiter", x, y: Y + R, kunst: um(x, Y + R, k),
    tipp: "Der Jupiter ist der größte Planet. Der rote Fleck ist ein Sturm, größer als die Erde." });
}
{
  const x = 160, Y = SONNE[1] + 2, R = 9.4 * ER, tilt = -14;
  const ring = (rx1, rx0, f, halb) => {
    const ry1 = rx1 * 0.22, ry0 = rx0 * 0.22, sw = halb === "hinten" ? 1 : 0;
    return `<path d="M${r(x - rx1)} ${Y} A${r(rx1)} ${r(ry1)} 0 0 ${sw} ${r(x + rx1)} ${Y} L${r(x + rx0)} ${Y} A${r(rx0)} ${r(ry0)} 0 0 ${1 - sw} ${r(x - rx0)} ${Y} Z" fill="${f}" stroke="${f}" stroke-width=".3"/>`;
  };
  const RINGE = S.lg("ringe", [[0, "#c9b48a"], [0.5, "#efe0bc"], [1, "#b8a07a"]], 0, 0, 1, 0);
  let k = `<g transform="rotate(${tilt} ${x} ${Y})">`;
  k += ring(R * 2.3, R * 1.95, RINGE, "hinten") + ring(R * 1.9, R * 1.25, RINGE, "hinten");
  k += `</g>`;
  k += `<circle cx="${x}" cy="${Y}" r="${R}" fill="${kugel("saturn", [[0, "#f6e6c0"], [0.55, "#e2c890"], [1, "#a8884e"]])}"/>`;
  S.def(`<clipPath id="${S.id("sat")}"><circle cx="${x}" cy="${Y}" r="${R}"/></clipPath>`);
  let b = "";
  for (const [t, f] of [[-0.6, "#d8bd88"], [-0.3, "#eedcae"], [0.1, "#d2b47e"], [0.4, "#e6cf9e"]]) b += `<rect x="${x - R}" y="${r(Y + t * R)}" width="${2 * R}" height="${r(R * 0.14)}" fill="${f}" opacity=".7"/>`;
  k += `<g clip-path="url(#${S.id("sat")})" transform="rotate(${tilt} ${x} ${Y})">${b}</g>`;
  k += `<circle cx="${x}" cy="${Y}" r="${R}" fill="${nacht}"/>`;
  /* vorderer Ringteil über der Kugel, Cassini-Teilung, Schatten der Kugel auf dem Ring */
  k += `<g transform="rotate(${tilt} ${x} ${Y})">` + ring(R * 2.3, R * 1.95, RINGE, "vorn") + ring(R * 1.9, R * 1.25, RINGE, "vorn");
  k += `</g>`;
  /* Titan */
  k += `<circle cx="${x + 2.6 * R}" cy="${Y + 8}" r=".8" fill="#e0b060"/>`;
  S.teil({ id: "saturn", de: "der Saturn", syl: "SA-turn", it: "Saturno", itSyl: "sa-TUR-no", en: "Saturn", x, y: Y + R + 2, kunst: um(x, Y + R + 2, k),
    tipp: "Die Ringe des Saturns sind aus Eis und Gestein — breit, aber nur so dick wie ein Haus hoch." });
}
{
  const x = 218, Y = SONNE[1], R = 4.0 * ER;
  let k = `<ellipse cx="${x}" cy="${Y}" rx="${r(R * 0.35)}" ry="${r(R * 1.9)}" fill="none" stroke="#9fb8c8" stroke-width=".3" opacity=".5"/>`;
  k += `<circle cx="${x}" cy="${Y}" r="${R}" fill="${kugel("uranus", [[0, "#dff7f7"], [0.6, "#9fd8dc"], [1, "#5a9aa4"]])}"/><circle cx="${x}" cy="${Y}" r="${R}" fill="${nacht}"/>`;
  k += `<path d="M${r(x + R * 0.35 * Math.cos(1))} ${r(Y - R * 1.9)} A${r(R * 0.35)} ${r(R * 1.9)} 0 0 1 ${r(x + R * 0.35)} ${Y}" stroke="#bcd4e0" stroke-width=".3" fill="none" opacity=".55"/>`;
  S.teil({ id: "uranus", de: "der Uranus", syl: "U-ra-nus", it: "Urano", itSyl: "U-ra-no", en: "Uranus", x, y: Y + R + 1, kunst: um(x, Y + R + 1, k) + flaeche(-R, -2 * R - 1, 2 * R, 2 * R + 1),
    tipp: "Der Uranus liegt auf der Seite: Er rollt wie eine Kugel um die Sonne." });
}
{
  const x = 248, Y = SONNE[1] + 1, R = 3.9 * ER;
  let k = `<circle cx="${x}" cy="${Y}" r="${R}" fill="${kugel("neptun", [[0, "#8fb6ff"], [0.6, "#3a62d4"], [1, "#1c2f7a"]])}"/>`;
  k += `<ellipse cx="${x - 1.4}" cy="${Y + 2}" rx="1.6" ry=".8" fill="#1c2f7a" opacity=".8"/><path d="M${x - 3} ${Y - 2.6} q2 -.6 4 0" stroke="#e8f0ff" stroke-width=".4" fill="none"/>`;
  k += `<circle cx="${x}" cy="${Y}" r="${R}" fill="${nacht}"/>`;
  S.teil({ id: "neptun", de: "der Neptun", syl: "NEP-tun", it: "Nettuno", itSyl: "net-TU-no", en: "Neptune", x, y: Y + R + 1, kunst: um(x, Y + R + 1, k) + flaeche(-R, -2 * R - 1, 2 * R, 2 * R + 1),
    tipp: "Der Neptun ist der äußerste Planet. Dort wehen die schnellsten Winde im Sonnensystem." });
}

/* =====================================================================
   13 — DER STERNPROJEKTOR (Zeiss-„Hantel“ in der Saalmitte)
   ===================================================================== */
{
  const x = 150, y = 184;
  let k = schatten(x, y + 1, 26, 2.6, 0.5);
  /* Sockel und Gabel */
  k += `<path d="M${x - 12} ${y} L${x - 8} ${y - 10} L${x + 8} ${y - 10} L${x + 12} ${y} Z" fill="${S.lg("sockel", [[0, "#3a3f4a"], [1, "#1c1f26"]])}"/>`;
  k += `<path d="M${x - 3} ${y - 10} L${x - 3} ${y - 22} M${x + 3} ${y - 10} L${x + 3} ${y - 22}" stroke="#4a505c" stroke-width="2.2"/>`;
  /* schräger Hantelarm mit Planetenkäfigen */
  const ax = x - 30, ay = y - 38, bx = x + 30, by = y - 18;
  k += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${S.lg("arm", [[0, "#5a6170"], [1, "#2c313b"]])}" stroke-width="4"/>`;
  for (let i = 1; i < 6; i++) { const t = i / 6, px = ax + (bx - ax) * t, py = ay + (by - ay) * t; k += `<rect x="${r(px - 2.6)}" y="${r(py - 3.4)}" width="5.2" height="6.8" rx=".6" fill="#3a404c" stroke="#6a7282" stroke-width=".3" transform="rotate(18 ${r(px)} ${r(py)})"/><circle cx="${r(px)}" cy="${r(py)}" r=".7" fill="#9fb4ff" opacity=".8"/>`; }
  /* zwei Sternkugeln mit vielen Linsen */
  const kug = (cx, cy, R) => {
    let g = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${S.rg("sternkugel", [[0, "#7a8292"], [0.6, "#3a404c"], [1, "#1a1d24"]], 0.35, 0.3, 0.8)}"/>`;
    for (let i = 0; i < 44; i++) { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * R * 0.88; g += `<circle cx="${r(cx + Math.cos(a) * d)}" cy="${r(cy + Math.sin(a) * d)}" r="${r(0.35 + rnd() * 0.3)}" fill="#0c0e13" stroke="#9aa3b6" stroke-width=".15"/>`; }
    g += `<circle cx="${r(cx - R * 0.3)}" cy="${r(cy - R * 0.35)}" r="${r(R * 0.25)}" fill="#fff" opacity=".1"/>`;
    return g;
  };
  k += kug(ax, ay, 9) + kug(bx, by, 9);
  S.teil({ id: "sternprojektor", de: "der Sternprojektor", syl: "STERN-pro-jek-tor", it: "il proiettore stellare", itSyl: "pro-iet-TO-re stel-LA-re", en: "star projector", x, y, steht: true, kunst: um(x, y, k),
    tipp: "Der Sternprojektor wirft Tausende Lichtpunkte an die Kuppel — wie ein echter Sternenhimmel." });
}

/* =====================================================================
   14 — DER SESSEL (vorderste Reihe links, zurückgeneigt)
   ===================================================================== */
{
  const x = 46, y = 198;
  let k = schatten(x, y, 16, 1.4, 0.4);
  k += `<path d="M${x - 14} ${y - 2} L${x - 14} ${y - 26} Q${x - 14} ${y - 33} ${x - 6} ${y - 34} L${x + 6} ${y - 34} Q${x + 14} ${y - 33} ${x + 14} ${y - 26} L${x + 14} ${y - 2} Z" fill="${S.lg("sessel", [[0, "#3a4f92"], [0.5, "#2a3b74"], [1, "#1a2650"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${x - 12} ${y - 26} Q${x} ${y - 30} ${x + 12} ${y - 26}" stroke="#6f86d0" stroke-width=".5" fill="none" opacity=".7"/>`;
  for (const dx of [-7, 0, 7]) k += `<line x1="${x + dx}" y1="${y - 30}" x2="${x + dx}" y2="${y - 6}" stroke="#1a2348" stroke-width=".4"/>`;
  k += `<rect x="${x - 16}" y="${y - 16}" width="3" height="14" rx="1" fill="#222838"/><rect x="${x + 13}" y="${y - 16}" width="3" height="14" rx="1" fill="#222838"/>`;
  k += `<rect x="${x - 5}" y="${y - 9}" width="10" height="3" rx=".6" fill="#d9dde6"/><text x="${x}" y="${y - 6.8}" font-size="2" text-anchor="middle" fill="#333" font-family="Arial">Reihe 9 · 14</text>`;
  S.teil({ id: "sessel", de: "der Sessel", syl: "SES-sel", it: "la poltrona", itSyl: "pol-TRO-na", en: "seat", x, y, steht: true, kunst: um(x, y, k),
    tipp: "Die Sessel lassen sich nach hinten kippen — so schaut man bequem nach oben." });
}

/* =====================================================================
   15 — DIE RAKETE (Modell auf einem Sockel) und 16 — DER ASTRONAUT
   ===================================================================== */
{
  const x = 268, y = 196;
  let k = schatten(x, y, 12, 1.4, 0.45);
  /* Sockel mit Schild */
  k += `<rect x="${x - 9}" y="${y - 8}" width="18" height="8" fill="${S.lg("podest", [[0, "#2e3340"], [1, "#1a1d24"]])}"/><rect x="${x - 6}" y="${y - 6.4}" width="12" height="3.4" fill="#c9ced8"/><text x="${x}" y="${y - 4}" font-size="1.7" text-anchor="middle" fill="#1d2230" font-family="Arial" font-weight="bold">Modell 1 : 30</text>`;
  /* Rakete: Hauptstufe mit zwei Boostern, Oberstufe, Nutzlastverkleidung */
  const ry = y - 8, H = 84;
  const WEISSR = S.lg("raketenweiss", [[0, "#9aa0aa"], [0.35, "#f4f5f6"], [0.6, "#e2e4e8"], [1, "#8a909a"]], 0, 0, 1, 0);
  for (const dx of [-5.4, 5.4]) {
    k += `<path d="M${x + dx - 2} ${ry} L${x + dx - 2} ${ry - 34} Q${x + dx} ${ry - 40} ${x + dx + 2} ${ry - 34} L${x + dx + 2} ${ry} Z" fill="${WEISSR}"/>`;
    k += `<path d="M${x + dx - 2.2} ${ry} L${x + dx - 1.6} ${ry + 1.6} L${x + dx + 1.6} ${ry + 1.6} L${x + dx + 2.2} ${ry} Z" fill="#3a3f48"/>`;
  }
  k += `<rect x="${x - 3.4}" y="${ry - H * 0.62}" width="6.8" height="${r(H * 0.62)}" fill="${S.lg("kernstufe", [[0, "#8a909a"], [0.35, "#fafbfc"], [1, "#7a808a"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${x - 3.4}" y="${ry - 20}" width="6.8" height="1.2" fill="#2b3a6a"/><text x="${x + 0.4}" y="${ry - 34}" font-size="2.6" fill="#2b3a6a" font-family="Arial" font-weight="bold" transform="rotate(-90 ${x + 0.4} ${ry - 34})">ARIANE</text>`;
  k += `<rect x="${x - 3}" y="${ry - H * 0.78}" width="6" height="${r(H * 0.16)}" fill="${WEISSR}"/><rect x="${x - 3}" y="${r(ry - H * 0.78)}" width="6" height="1" fill="#bfc4cc"/>`;
  k += `<path d="M${x - 3.6} ${r(ry - H * 0.78)} L${x - 3.6} ${r(ry - H * 0.92)} Q${x} ${r(ry - H - 2)} ${x + 3.6} ${r(ry - H * 0.92)} L${x + 3.6} ${r(ry - H * 0.78)} Z" fill="${WEISSR}"/>`;
  k += `<rect x="${x - 2}" y="${r(ry - H * 0.86)}" width="1.6" height="1" fill="#d7262b"/><rect x="${x - 2}" y="${r(ry - H * 0.86 + 1)}" width="1.6" height="1" fill="#f2f2f2"/>`;
  k += `<path d="M${x - 3.4} ${ry} L${x - 2.4} ${ry + 2.6} L${x + 2.4} ${ry + 2.6} L${x + 3.4} ${ry} Z" fill="#2b2f36"/>`;
  /* Spot von oben */
  k += `<path d="M${x - 2} ${ry - H - 6} L${x - 16} ${y} L${x + 16} ${y} L${x + 2} ${ry - H - 6} Z" fill="${S.lg("spot", [[0, "#fff6d8", 0.1], [1, "#fff6d8", 0.02]])}"/>`;
  S.teil({ id: "rakete", de: "die Rakete", syl: "Ra-KE-te", it: "il razzo", itSyl: "RAZ-zo", en: "rocket", x, y, steht: true, kunst: um(x, y, k),
    tipp: "Ein Modell der europäischen Rakete Ariane. Die echte ist über 60 Meter hoch." });
}
{
  const x = 300, y = 198;
  const m = mensch({ id: "b20d_astro", geschlecht: "m", pose: "zeigen", blick: -40, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel", laecheln: true,
    kleidung: { jacke: { stueck: "jacke", farbe: "blau" }, oberteil: { stueck: "tshirt", farbe: "blau" }, unterteil: { stueck: "hose", farbe: "blau" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 70);
  const K = m.k, hs = m.z.mass.schulterH * K;
  /* Abzeichen auf dem Fluganzug: Missionsabzeichen, Fahne am Ärmel */
  let ab = `<circle cx="${r(-3)}" cy="${r(-hs + 8)}" r="1.6" fill="#f2f2f2" stroke="#c9a227" stroke-width=".3"/><circle cx="${r(-3)}" cy="${r(-hs + 8)}" r=".8" fill="#2b5aa8"/>`;
  ab += `<rect x="${r(3)}" y="${r(-hs + 6.6)}" width="3" height=".6" fill="#111"/><rect x="${r(3)}" y="${r(-hs + 7.2)}" width="3" height=".6" fill="#d7262b"/><rect x="${r(3)}" y="${r(-hs + 7.8)}" width="3" height=".6" fill="#f2c024"/>`;
  S.teil({ id: "astronaut", de: "der Astronaut", syl: "As-tro-NAUT", it: "l'astronauta", itSyl: "a-stro-NAU-ta", en: "astronaut", x, y, kunst: schatten(0, 0, 8, 1, 0.4) + m.svg + ab,
    tipp: "Er war ein halbes Jahr auf der Raumstation ISS. Im Planetarium erklärt er das Raketenmodell." });
}

/* zarte Lichtkante über allem: Kuppelrand leuchtet blau */
S.davor(`<path d="M0 ${r(RAND(0) + 2)} Q160 ${RAND(160) + 10} 320 ${r(RAND(320) + 2)}" stroke="#4a6cff" stroke-width=".5" fill="none" opacity=".35"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/planeten.js"));
console.log(aus);
