#!/usr/bin/env node
/* =====================================================================
   SILVESTER (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar.

   RECHERCHE (Heidelberg24 „Silvesterbräuche in Deutschland“, Abendzeitung
   „Wachsgießen: die bleifreie Alternative“, daswetter.com
   „Silvester-Bräuche“) — Silvesternacht, kurz vor 0 Uhr, auf dem Balkon:
   - Am Himmel FEUERWERK und RAKETEN über den Dächern, die Kirchturm-UHR
     zeigt 23:59; drinnen läuft im Fernsehen der COUNTDOWN.
   - Auf dem Balkontisch: SEKT im Kühler und SEKTGLÄSER zum Anstoßen um
     Mitternacht, BERLINER (in Berlin „Pfannkuchen“, in Bayern „Krapfen“),
     Glücksbringer: SCHORNSTEINFEGER, GLÜCKSSCHWEIN (Marzipan), KLEEBLATT
     (Glücksklee im Topf); das BLEIGIESSEN – seit 2018 ist Blei verboten,
     heute gießt man Wachs: Löffel, Kerze, Schale mit kaltem Wasser.
   - WUNDERKERZEN, PARTYHÜTE, LUFTSCHLANGEN am Geländer. BÖLLER zündet
     man nur unten auf der Straße.
   Maßstab: Balkon vorne (y 192) ≈ 48 Einheiten je Meter, Geländer (y 150)
   ≈ 38. Augenhöhe y ≈ 100.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "silvester", titel: "Silvester", emoji: "🎆", thema: "Feste", kuerzel: "sv", fassung: 852 });
const rnd = zufall(3112);
const r = B.r;

/* Figuren schlanker: ganze Zentimeter (bei k ≈ 0,47 unter einem Bildpunkt) */
const h2 = (n) => String(Math.round(parseFloat(n)));
const schlank = (svg) => svg.replace(/( d=")([^"]*)"/g, (a, b, c) => b + c.replace(/-?\d*\.\d+/g, h2) + '"')
  .replace(/ (cx|cy|x1|y1|x2|y2|x|y)="(-?\d*\.\d+)"/g, (a, b, c) => ` ${b}="${h2(c)}"`)
  .replace(/ (r|rx|ry|width|height)="(\d*\.\d+)"/g, (a, b, c) => ` ${b}="${parseFloat(c) < 1.5 ? c : h2(c)}"`);
const figur = (spec, hoehe) => { const m = B.mensch(spec, hoehe); return { svg: `<g transform="scale(${m.k.toFixed(4)})">${schlank(m.z.svg)}</g>`, k: m.k, z: m.z }; };
const haende = (m) => [m.z.handL, m.z.handR].filter(Boolean).map((h) => [(h.x != null ? h.x : h[0]) * m.k, (h.y != null ? h.y : h[1]) * m.k]).sort((a, b) => a[1] - b[1]);

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const GLAS = S.lg("glas", [[0, "#e8f2f6", 0.55], [0.5, "#ffffff", 0.2], [1, "#cfe0e8", 0.5]], 0, 0, 1, 0);
const SEKT = S.lg("sekt", [[0, "#f6e08a"], [1, "#e0b84a"]]);
const GOLD = S.rg("gold", [[0, "#fff4c2"], [0.35, "#e9bf4a"], [1, "#8a5f12"]], 0.35, 0.3, 0.75);
const BERLINER = S.rg("berliner", [[0, "#f2c06a"], [0.6, "#d8913a"], [1, "#a8601a"]], 0.4, 0.35, 0.8);
const MARZIPAN = S.rg("marzipan", [[0, "#ffd8e2"], [0.7, "#f2a8bc"], [1, "#d07a94"]], 0.4, 0.35, 0.8);
const METALL = S.lg("metall", [[0, "#2a2e33"], [0.5, "#4a5058"], [1, "#22262a"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Nachthimmel mit Rauch, Dächer der Stadt, Kirchturm,
   Hauswand mit Balkontür, Balkonboden
   ===================================================================== */
const BODEN = 150;
S.hinten(`<rect x="0" y="0" width="320" height="${BODEN}" fill="${S.lg("nacht", [[0, "#05071a"], [0.6, "#121a3e"], [1, "#2a2448"]])}"/>`);
{
  let g = "";
  for (let i = 0; i < 50; i++) g += `<circle cx="${r(rnd() * 320)}" cy="${r(rnd() * 60)}" r="${r(0.2 + rnd() * 0.3)}" fill="#fff" opacity="${r(0.3 + rnd() * 0.5)}"/>`;
  /* Rauchschwaden vom Feuerwerk */
  for (const [x, y, rx] of [[70, 70, 50], [190, 60, 60], [290, 76, 40]]) g += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${r(rx * 0.22)}" fill="#8a8aa8" opacity=".12"/>`;
  /* Dächer der Stadt (Altbauten mit Gauben und Schornsteinen), helle Fenster */
  g += `<path d="M48 120 L48 100 L66 92 L84 100 L84 96 L104 86 L124 96 L124 102 L150 102 L150 94 L170 88 L190 94 L190 104 L214 104 L214 96 L232 90 L238 90 L238 104 L270 104 L270 98 L292 90 L320 98 L320 ${BODEN} L48 ${BODEN} Z" fill="#0e1024"/>`;
  for (const [x, y] of [[70, 92], [112, 86], [176, 88], [298, 90]]) g += `<rect x="${x}" y="${y - 6}" width="3" height="6" fill="#0e1024"/>`;
  for (let i = 0; i < 26; i++) { const x = 52 + rnd() * 264, y = 106 + rnd() * 30; g += `<rect x="${r(x)}" y="${r(y)}" width="2.6" height="3.4" fill="${rnd() < 0.7 ? "#ffcf7a" : "#9ab8ff"}" opacity=".85"/>`; }
  /* Kirchturm (die Uhr ist ein eigenes Teil) */
  g += `<rect x="244" y="52" width="16" height="52" fill="#1a1c34"/><path d="M242 52 L252 20 L262 52 Z" fill="#141630"/><path d="M252 20 L252 14 M250 16 L254 16" stroke="#6a6a8a" stroke-width=".6"/><path d="M248 98 L248 84 Q252 79 256 84 L256 98 Z" fill="#ffcf7a" opacity=".7"/>`;
  S.hinten(g);
}
/* Hauswand links mit der offenen Balkontür (Teil), Balkonboden mit Fliesen */
S.hinten(`<rect x="0" y="0" width="50" height="${BODEN}" fill="${S.lg("wand", [[0, "#c8b8a0"], [1, "#a8977e"]], 0, 0, 1, 0)}"/><rect x="48" y="0" width="3" height="${BODEN}" fill="#7e6e58"/>`);
{
  let g = `<path d="M0 ${BODEN} L320 ${BODEN} L320 200 L0 200 Z" fill="${S.lg("fliesen", [[0, "#6a5a52"], [1, "#8e7a6c"]])}"/>`;
  for (const y of [156, 164, 175, 189]) g += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#4e4038" stroke-width=".4"/>`;
  for (let i = -8; i <= 8; i++) g += `<line x1="${160 + i * 22}" y1="${BODEN}" x2="${160 + i * 40}" y2="200" stroke="#4e4038" stroke-width=".4"/>`;
  g += `<path d="M0 ${BODEN} L320 ${BODEN} L320 200 L0 200 Z" fill="${S.rg("feuerschein", [[0, "#ffd890", 0.18], [1, "#ffd890", 0]], 0.3, 0.1, 0.7)}"/>`;
  S.hinten(g);
}

/* =====================================================================
   1 — DAS FEUERWERK, 2 — DIE RAKETE, 3 — DIE UHR (Kirchturm)
   ===================================================================== */
const buendel = (cx, cy, R, farbe, hell, n) => {
  const id = "glow" + farbe.slice(1);
  let g = `<circle cx="${cx}" cy="${cy}" r="${r(R * 1.15)}" fill="${S.rg(id, [[0, hell, 0.45], [0.5, farbe, 0.12], [1, farbe, 0]])}"/>`;
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2 + rnd() * 0.1, l = R * (0.75 + rnd() * 0.25);
    const x1 = cx + Math.cos(a) * l * 0.25, y1 = cy + Math.sin(a) * l * 0.25, x2 = cx + Math.cos(a) * l, y2 = cy + Math.sin(a) * l + l * 0.08;
    g += `<path d="M${r(x1)} ${r(y1)} Q${r((x1 + x2) / 2)} ${r((y1 + y2) / 2 - 1)} ${r(x2)} ${r(y2)}" stroke="${farbe}" stroke-width=".55" fill="none" opacity=".85" stroke-linecap="round"/>`;
    g += `<circle cx="${r(x2)}" cy="${r(y2)}" r=".75" fill="${hell}"/>`;
  }
  return g + `<circle cx="${cx}" cy="${cy}" r="1.4" fill="#fff"/>`;
};
{
  let k = buendel(78, 30, 22, "#ffb83a", "#fff2b0", 30) + buendel(162, 20, 17, "#ff3a5a", "#ffd0da", 24) + buendel(206, 54, 12, "#3ad87a", "#c8ffd8", 18)
    + buendel(124, 60, 11, "#4a8aff", "#d0e0ff", 16) + buendel(296, 26, 16, "#c05aff", "#f0d0ff", 22);
  /* Goldregen: herabfallende Funken */
  for (let i = 0; i < 24; i++) { const x = 58 + rnd() * 40, y = 46 + rnd() * 22; k += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x + rnd() - 0.5)}" y2="${r(y + 2 + rnd() * 3)}" stroke="#ffd27a" stroke-width=".35" opacity=".7"/>`; }
  S.teil({ id: "si_feuerwerk", de: "das Feuerwerk", syl: "FEU-er-werk", it: "i fuochi d'artificio", itSyl: "FUO-chi d'ar-ti-FI-cio", en: "fireworks", x: 0, y: 0, kunst: k,
    tipp: "Um Mitternacht leuchtet der ganze Himmel bunt." });
}
{
  let k = `<path d="M0 0 Q-3 14 -5 32" stroke="${S.lg("spur", [[0, "#ffe6a0"], [1, "#ffe6a0", 0]])}" stroke-width="1.2" fill="none"/>`;
  for (let i = 0; i < 8; i++) k += `<circle cx="${r(-1 - i * 0.6 + rnd())}" cy="${r(4 + i * 3.4)}" r="${r(0.5 - i * 0.04)}" fill="#ffd27a" opacity="${r(0.9 - i * 0.1)}"/>`;
  k += `<path d="M-1 -1 L1.4 -7 L3 -1.6 Z" fill="#e8e2d4"/><rect x="-.8" y="-1.8" width="3" height="3" fill="#c4202a" transform="rotate(20)"/><circle cx="0" cy="1" r="1.6" fill="#fff6c8"/>`;
  S.teil({ oben: true, id: "si_rakete", de: "die Rakete", syl: "Ra-KE-te", it: "il razzo", itSyl: "RAZ-zo", en: "rocket", x: 236, y: 70, kunst: k,
    tipp: "Die Rakete zischt in den Himmel und explodiert in bunten Sternen." });
}
{
  let k = `<circle r="5.6" fill="${S.rg("ziffer", [[0, "#fff6d8"], [1, "#f0d898"]])}" stroke="#d4af37" stroke-width=".6"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(Math.sin(a) * 4.8)}" y1="${r(-Math.cos(a) * 4.8)}" x2="${r(Math.sin(a) * 4.1)}" y2="${r(-Math.cos(a) * 4.1)}" stroke="#2a2018" stroke-width="${i % 3 ? 0.25 : 0.5}"/>`; }
  /* 23:59 — eine Minute vor Mitternacht */
  const am = -6 / 360 * Math.PI * 2, ah = -0.5 / 12 * Math.PI * 2;
  k += `<line x1="0" y1="0" x2="${r(Math.sin(ah) * 2.8)}" y2="${r(-Math.cos(ah) * 2.8)}" stroke="#1d140c" stroke-width=".8" stroke-linecap="round"/><line x1="0" y1="0" x2="${r(Math.sin(am) * 4.2)}" y2="${r(-Math.cos(am) * 4.2)}" stroke="#1d140c" stroke-width=".45" stroke-linecap="round"/><circle r=".5" fill="#b3261e"/>`;
  S.teil({ id: "si_uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: 252, y: 64, kunst: k,
    tipp: "Es ist eine Minute vor zwölf. Gleich beginnt das neue Jahr!" });
}

/* =====================================================================
   4 — DIE BALKONTÜR (offen) und 5 — DER COUNTDOWN im Fernsehen drinnen
   ===================================================================== */
{
  let k = `<rect x="-20" y="-120" width="40" height="120" fill="#f4efe6"/><rect x="-16" y="-116" width="32" height="116" fill="${S.lg("zimmer", [[0, "#f6d89a"], [1, "#b8864a"]])}"/>`;
  /* drinnen: Girlande, Stehlampe, Anrichte */
  k += `<path d="M-16 -108 Q-8 -102 0 -108 Q8 -102 16 -108" stroke="#e2405a" stroke-width=".8" fill="none"/><path d="M-16 -106 Q-8 -100 0 -106 Q8 -100 16 -106" stroke="#f2d23a" stroke-width=".6" fill="none"/>`;
  k += `<rect x="-16" y="-24" width="32" height="24" fill="#8a5a32"/><rect x="-16" y="-24" width="32" height="1.4" fill="#b07a48"/>`;
  /* Türflügel (Glas), nach innen aufgeschlagen */
  k += `<path d="M16 -116 L6 -112 L6 2 L16 0 Z" fill="#f4efe6"/><path d="M14.4 -112 L7.6 -109.6 L7.6 -2 L14.4 -3 Z" fill="${GLAS}"/><rect x="6.6" y="-60" width="1" height="5" rx=".4" fill="#c9a640"/>`;
  k += `<rect x="-20" y="-120" width="40" height="3" fill="#e2dccf"/><rect x="-20" y="-2" width="40" height="2" fill="#cfc8b8"/>`;
  S.teil({ id: "balkontuer", de: "die Balkontür", syl: "bal-KON-tür", it: "la portafinestra", itSyl: "por-ta-fi-NE-stra", en: "balcony door", x: 24, y: BODEN, kunst: k });
}
{
  let k = `<rect x="-1.4" y="-1" width="2.8" height="2" fill="#222"/><rect x="-11" y="-16" width="22" height="15" rx=".8" fill="#141418"/><rect x="-10" y="-15" width="20" height="13" fill="${S.lg("bild", [[0, "#1a2a5a"], [1, "#3a1a4a"]])}"/>`;
  k += `<text x="0" y="-5.6" font-size="8.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">10</text><text x="0" y="-12" font-size="2.2" text-anchor="middle" fill="#ffd27a" font-family="Arial">COUNTDOWN</text>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${-8 + i * 3.2}" cy="-3.2" r=".5" fill="${["#ffd27a", "#ff5a7a", "#7aff9a"][i % 3]}"/>`;
  k += `<path d="M-10 -15 L-4 -15 L-10 -9 Z" fill="#fff" opacity=".12"/>`;
  S.teil({ id: "si_countdown", de: "der Countdown", syl: "COUNT-down", it: "il conto alla rovescia", itSyl: "CON-to al-la ro-VE-scia", en: "countdown", x: 21, y: BODEN - 24, kunst: k,
    tipp: "Alle zählen laut mit: „… drei, zwei, eins – Frohes neues Jahr!“" });
}

/* =====================================================================
   6 — DAS GELÄNDER mit 7 — LUFTSCHLANGEN
   ===================================================================== */
{
  let k = `<rect x="-136" y="-38" width="272" height="2.6" rx="1" fill="${METALL}"/><rect x="-136" y="-4" width="272" height="1.6" fill="${METALL}"/>`;
  for (let x = -134; x < 136; x += 4.4) k += `<rect x="${r(x)}" y="-36" width=".9" height="33" fill="#2a2e33"/>`;
  for (let x = -128; x < 130; x += 26.4) k += `<path d="M${r(x)} -20 q4.4 -6 8.8 0 q-4.4 6 -8.8 0 Z M${r(x + 8.8)} -20 q4.4 -6 8.8 0 q-4.4 6 -8.8 0 Z" fill="none" stroke="#3a4048" stroke-width=".8"/>`;
  k += `<rect x="-136" y="-38" width="272" height=".7" fill="#7a828a"/>`;
  S.teil({ id: "gelaender", de: "das Geländer", syl: "ge-LÄN-der", it: "la ringhiera", itSyl: "rin-GHIE-ra", en: "railing", x: 186, y: BODEN, kunst: k });
}
{
  let k = "";
  const farben = ["#e2405a", "#f2d23a", "#3a8ad8", "#55d07a", "#c05aff", "#ff8a2a"];
  for (let i = 0; i < 9; i++) {
    const x = -120 + i * 30 + rnd() * 6, f = farben[i % 6];
    let d = `M${r(x)} -38`;
    for (let j = 0; j < 7; j++) d += ` q${r(2.4 + rnd())} ${r(1.6 + j * 0.3)} ${r(rnd() * 1.2 - 0.6)} ${r(3.2 + rnd())}`;
    k += `<path d="${d}" stroke="${f}" stroke-width=".9" fill="none" stroke-linecap="round"/>`;
    k += `<path d="M${r(x)} -38 q-6 -2 -10 1" stroke="${farben[(i + 2) % 6]}" stroke-width=".8" fill="none"/>`;
  }
  S.teil({ oben: true, id: "si_luftschlange", de: "die Luftschlange", syl: "LUFT-schlan-ge", it: "la stella filante di carta", itSyl: "STEL-la fi-LAN-te di CAR-ta", en: "streamer", x: 186, y: BODEN, kunst: k });
}

/* =====================================================================
   8 — DIE NACHBARIN mit der WUNDERKERZE (links)
   ===================================================================== */
{
  const X = 82, Y = 192;
  const m = figur({ id: "sv_nachbarin", geschlecht: "w", pose: "halten", blick: 35, frisur: "lang", haarfarbe: "dunkelbraun", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#2a2c33" }, jacke: { stueck: "mantel", farbe: "#c4b08a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel", farbe: "schwarz" }, zubehoer: { stueck: "schal", farbe: "#c4202a" } } }, 78);
  const [h] = haende(m);
  S.teil({ id: "si_mensch_si2", de: "die Nachbarin", syl: "NACH-ba-rin", it: "la vicina", itSyl: "vi-CI-na", en: "neighbour", x: X, y: Y, kunst: schatten(0, 0, 12, 1.6, .35) + m.svg,
    tipp: "Sie sagt: „Ein frohes neues Jahr!“" });
  /* die Wunderkerze in ihrer erhobenen Hand: Draht, Funkenstern */
  let k = `<line x1="0" y1="0" x2="2.4" y2="-16" stroke="#7a7a80" stroke-width=".5"/><line x1="1.4" y1="-9" x2="2.4" y2="-16" stroke="#3a3a40" stroke-width=".9"/>`;
  k += `<circle cx="2.6" cy="-17" r="8" fill="${S.rg("funkenhof", [[0, "#fff8d0", 0.8], [1, "#ffd27a", 0]])}"/>`;
  for (let i = 0; i < 26; i++) { const a = rnd() * Math.PI * 2, l = 2 + rnd() * 6; k += `<path d="M2.6 -17 l${r(Math.cos(a) * l)} ${r(Math.sin(a) * l)}" stroke="${rnd() < 0.5 ? "#fff6c8" : "#ffd27a"}" stroke-width=".3"/><circle cx="${r(2.6 + Math.cos(a) * l)}" cy="${r(-17 + Math.sin(a) * l)}" r=".35" fill="#fffbe6"/>`; }
  S.teil({ oben: true, id: "si_wunderkerze", de: "die Wunderkerze", syl: "WUN-der-ker-ze",
    /* korrigiert: „la stella filante“ ist im Italienischen die Luftschlange; die Wunderkerze heißt „la stellina“ */
    it: "la stellina", itSyl: "stel-LI-na", en: "sparkler", x: X + h[0], y: Y + h[1], kunst: k,
    tipp: "Wunderkerzen sprühen Funken – man hält sie nur am Ende fest." });
}

/* =====================================================================
   9 — DER TISCH mit Sekt, Gläsern, Berlinern, Glücksbringern,
       Bleigießen und Böllern (Lupe)
   ===================================================================== */
{
  const TB = { yh: 146, yv: 156, xh0: 126, xh1: 210, xv0: 118, xv1: 218, fuss: 192 };
  const cx = (TB.xv0 + TB.xv1) / 2;
  const L = (x, y) => `${r(x - cx)} ${r(y - TB.fuss)}`;
  let k = schatten(0, 0.5, 52, 2, .4);
  for (const x of [TB.xv0 + 4, TB.xv1 - 6]) k += `<rect x="${r(x - cx)}" y="${TB.yv - TB.fuss}" width="2" height="${TB.fuss - TB.yv}" fill="${METALL}"/>`;
  for (const x of [TB.xh0 + 6, TB.xh1 - 8]) k += `<rect x="${r(x - cx)}" y="${TB.yh - TB.fuss}" width="1.6" height="${TB.fuss - 10 - TB.yh}" fill="#1e2226"/>`;
  /* Tischdecke dunkelblau mit goldenen Sternen */
  S.def(`<pattern id="${S.id("decke")}" width="7" height="5" patternUnits="userSpaceOnUse"><rect width="7" height="5" fill="#1c2a5a"/><circle cx="1.6" cy="1.2" r=".35" fill="#e8c86a"/><circle cx="5" cy="3.6" r=".3" fill="#e8c86a"/></pattern>`);
  k += `<path d="M${L(TB.xh0, TB.yh)} L${L(TB.xh1, TB.yh)} L${L(TB.xv1, TB.yv)} L${L(TB.xv0, TB.yv)} Z" fill="url(#${S.id("decke")})"/>`;
  k += `<path d="M${L(TB.xv0, TB.yv)} L${L(TB.xv1, TB.yv)} L${L(TB.xv1 + 1, TB.yv + 8)} L${L(TB.xv0 - 1, TB.yv + 8)} Z" fill="url(#${S.id("decke")})"/><path d="M${L(TB.xv0, TB.yv)} L${L(TB.xv1, TB.yv)} L${L(TB.xv1 + 1, TB.yv + 8)} L${L(TB.xv0 - 1, TB.yv + 8)} Z" fill="#000" opacity=".2"/>`;
  /* Konfetti auf der Decke */
  for (let i = 0; i < 30; i++) { const t = rnd(), u = rnd(); k += `<rect x="${r(TB.xh0 + t * (TB.xh1 - TB.xh0) - cx + (u - 0.5) * 8)}" y="${r(TB.yh + u * (TB.yv - TB.yh) - TB.fuss)}" width=".9" height=".6" fill="${["#e2405a", "#f2d23a", "#3a8ad8", "#55d07a"][i % 4]}"/>`; }
  const unter = [];
  const auf = (x, y) => [x - cx, y - TB.fuss];
  const U = (t, x, y, fx, fy, fw, fh) => unter.push(Object.assign(t, { x, y, kunst: flaeche(fx, fy, fw, fh) }));
  /* DER SEKT: Flasche im Sektkühler mit Eis */
  {
    const [x, y] = auf(132, 150);
    k += `<path d="M${x - 3.2} ${y - 3} L${x - 2.8} ${y - 16} Q${x - 2.8} ${y - 18.6} ${x - 1} ${y - 20} L${x - 0.9} ${y - 25} L${x + 0.9} ${y - 25} L${x + 1} ${y - 20} Q${x + 2.8} ${y - 18.6} ${x + 2.8} ${y - 16} L${x + 3.2} ${y - 3} Z" fill="${S.lg("flasche", [[0, "#0e2a1a"], [0.4, "#2f6a4a"], [1, "#0a1e12"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${x - 1.2} ${y - 25.6} L${x + 1.2} ${y - 25.6} L${x + 1} ${y - 20} L${x - 1} ${y - 20} Z" fill="${S.lg("folie", [[0, "#8a5f12"], [0.5, "#f6d77a"], [1, "#8a5f12"]], 0, 0, 1, 0)}"/><rect x="${x - 2.6}" y="${y - 15}" width="5.2" height="4" fill="#f4ecd8"/><text x="${x}" y="${y - 12.4}" font-size="1.6" text-anchor="middle" fill="#7a1d20" font-family="Georgia,serif">Sekt</text>`;
    k += `<path d="M${x - 5.4} ${y} L${x - 6} ${y - 10} L${x + 6} ${y - 10} L${x + 5.4} ${y} Z" fill="${S.lg("kuehler", [[0, "#8a939a"], [0.45, "#eef1f3"], [1, "#7d868d"]], 0, 0, 1, 0)}"/><ellipse cx="${x}" cy="${y - 10}" rx="6" ry="1.2" fill="#dfe8ee"/>`;
    for (const dx of [-4, -2.4, 2.6, 4.2]) k += `<rect x="${x + dx - 0.8}" y="${y - 11.4}" width="1.6" height="1.4" rx=".3" fill="#e8f4fa" stroke="#b8d0dc" stroke-width=".15"/>`;
    k += `<path d="M${x - 6.2} ${y - 8} q-1.4 1.6 0 3.2 M${x + 6.2} ${y - 8} q1.4 1.6 0 3.2" stroke="#9aa3aa" stroke-width=".5" fill="none"/>`;
    U({ id: "si_sekt", de: "der Sekt", syl: "SEKT", it: "lo spumante", itSyl: "spu-MAN-te", en: "sparkling wine",
      tipp: "Um Mitternacht knallt der Korken – dann stößt man an." }, 132, 150, -6.6, -26, 13.2, 26.4);
  }
  /* DAS SEKTGLAS: zwei Sektflöten, gefüllt, mit Perlen */
  {
    for (const [gx, gy] of [[145, 149], [151, 152]]) {
      const [x, y] = auf(gx, gy);
      k += `<ellipse cx="${x}" cy="${y}" rx="1.8" ry=".45" fill="${GLAS}" stroke="#cfe0e8" stroke-width=".2"/><line x1="${x}" y1="${y}" x2="${x}" y2="${y - 5}" stroke="#dfeef4" stroke-width=".4"/>`;
      k += `<path d="M${x - 1.5} ${y - 13.6} L${x - 1.2} ${y - 5.6} Q${x} ${y - 4.4} ${x + 1.2} ${y - 5.6} L${x + 1.5} ${y - 13.6} Z" fill="${GLAS}" stroke="#cfe0e8" stroke-width=".2"/><path d="M${x - 1.35} ${y - 11} L${x - 1.15} ${y - 5.8} Q${x} ${y - 4.8} ${x + 1.15} ${y - 5.8} L${x + 1.35} ${y - 11} Z" fill="${SEKT}" opacity=".85"/>`;
      for (let i = 0; i < 3; i++) k += `<circle cx="${r(x - 0.4 + i * 0.4)}" cy="${r(y - 7 - i * 1.2)}" r=".2" fill="#fff"/>`;
    }
    U({ id: "si_sektglas", de: "das Sektglas", syl: "SEKT-glas", it: "il calice da spumante", itSyl: "CA-li-ce da spu-MAN-te", en: "champagne flute" }, 148, 151, -4.4, -15.4, 9.6, 16.4);
  }
  /* DAS BLEIGIESSEN (heute mit Wachs): Schale mit Wasser, Löffel, Kerze, Figuren */
  {
    const [x, y] = auf(164, 147.4);
    k += `<ellipse cx="${x}" cy="${y}" rx="5" ry="1.6" fill="${S.lg("schuessel", [[0, "#f4f2ec"], [1, "#c8c2b4"]])}"/><ellipse cx="${x}" cy="${y - 0.5}" rx="4.2" ry="1.1" fill="#8ab8d0"/>`;
    k += `<path d="M${x - 1.6} ${y - 0.6} q.6 -.8 1.4 -.2 q.4 .6 1.2 0" stroke="#e8c86a" stroke-width=".6" fill="none"/>`;
    k += `<rect x="${x + 5.2}" y="${y - 5}" width="1.6" height="4.4" fill="#f6efe0"/><path d="M${x + 6} ${y - 7} q.7 1 0 2 q-.7 -1 0 -2 Z" fill="#ffd56a"/><circle cx="${x + 6}" cy="${y - 5.8}" r="2" fill="#ffe7a0" opacity=".35"/>`;
    k += `<path d="M${x - 8.6} ${y - 3} L${x - 4.6} ${y - 1.4}" stroke="#a9b1b8" stroke-width=".6"/><ellipse cx="${x - 3.8}" cy="${y - 1.2}" rx="1.2" ry=".6" fill="#bfc6cc"/>`;
    U({ id: "si_bleigiessen", de: "das Bleigießen", syl: "BLEI-gie-ßen", it: "la divinazione con la cera", itSyl: "di-vi-na-ZIO-ne con la CE-ra", en: "wax pouring",
      tipp: "Blei ist seit 2018 verboten – heute gießt man Wachs ins kalte Wasser und deutet die Figur." }, 162, 147.4, -9, -8, 17, 9.4);
  }
  /* DIE BERLINER (Pfannkuchen) auf dem Teller, mit Puderzucker */
  {
    const [x, y] = auf(168, 153.6);
    k += `<ellipse cx="${x}" cy="${y}" rx="7.4" ry="2" fill="#f7f4ee" stroke="#c9c0ae" stroke-width=".25"/>`;
    for (const [dx, dy] of [[-3.4, -0.4], [0.4, -0.2], [3.8, -0.4], [-1.4, -2.4], [2.2, -2.4]]) {
      k += `<ellipse cx="${x + dx}" cy="${y + dy - 1.4}" rx="2.4" ry="1.8" fill="${BERLINER}"/><path d="M${x + dx - 2.3} ${y + dy - 1.4} q2.3 1 4.6 0" stroke="#f6ead0" stroke-width=".7" fill="none"/>`;
      for (let i = 0; i < 4; i++) k += `<circle cx="${r(x + dx - 1.4 + rnd() * 2.8)}" cy="${r(y + dy - 2.6 + rnd())}" r=".22" fill="#fff"/>`;
    }
    k += `<circle cx="${x + 5.8}" cy="${y - 1.8}" r=".45" fill="#b5162b"/>`;
    U({ id: "si_berliner", de: "der Berliner", syl: "ber-LI-ner", it: "il bombolone", itSyl: "bom-bo-LO-ne", en: "doughnut",
      tipp: "In Berlin heißt er „Pfannkuchen“. Zu Silvester ist manchmal einer mit Senf gefüllt – als Scherz!" }, 168, 153.6, -7.6, -6, 15.2, 7.6);
  }
  /* DER BÖLLER: Packung Knallkörper (gezündet wird nur unten auf der Straße) */
  {
    const [x, y] = auf(186, 147);
    k += `<path d="M${x - 5} ${y} L${x - 5} ${y - 4} L${x + 5} ${y - 4} L${x + 5} ${y} Z" fill="#c4202a"/><path d="M${x - 5} ${y - 4} L${x - 3.6} ${y - 5} L${x + 6.4} ${y - 5} L${x + 5} ${y - 4} Z" fill="#e2405a"/><path d="M${x + 5} ${y} L${x + 6.4} ${y - 1} L${x + 6.4} ${y - 5} L${x + 5} ${y - 4} Z" fill="#8a1018"/>`;
    k += `<text x="${x}" y="${y - 1.2}" font-size="2" text-anchor="middle" fill="#f6dc8a" font-family="Arial" font-weight="bold">BÖLLER</text>`;
    for (const dx of [-3, -1, 1]) k += `<rect x="${x + dx}" y="${y - 7.6}" width="1.2" height="3.4" fill="#d8b24a" transform="rotate(${dx * 6} ${x + dx} ${y - 5})"/><line x1="${x + dx + 0.6}" y1="${y - 7.6}" x2="${x + dx + 0.9}" y2="${y - 8.8}" stroke="#2a2a2a" stroke-width=".25"/>`;
    U({ id: "si_boeller", de: "der Böller", syl: "BÖL-ler", it: "il petardo", itSyl: "pe-TAR-do", en: "firecracker",
      tipp: "Böller zündet man nur draußen auf der Straße – mit viel Abstand!" }, 186, 147, -5.6, -9.6, 12.4, 10);
  }
  /* DAS GLÜCKSSCHWEIN aus Marzipan */
  {
    const [x, y] = auf(188, 155);
    k += `<ellipse cx="${x}" cy="${y - 2.4}" rx="3.4" ry="2.4" fill="${MARZIPAN}"/><ellipse cx="${x + 3}" cy="${y - 3}" rx="1.9" ry="1.7" fill="${MARZIPAN}"/><ellipse cx="${x + 4.6}" cy="${y - 2.8}" rx=".8" ry=".7" fill="#f2a0b4"/><circle cx="${x + 4.4}" cy="${y - 2.9}" r=".15" fill="#a05068"/><circle cx="${x + 4.8}" cy="${y - 2.7}" r=".15" fill="#a05068"/>`;
    k += `<path d="M${x + 2.2} ${y - 4.4} l.4 -1.4 l.8 1" fill="#f2a8bc"/><circle cx="${x + 3.4}" cy="${y - 3.6}" r=".25" fill="#2a1a1a"/><path d="M${x - 3.4} ${y - 2.6} q-1 -.6 -.6 -1.4 q.4 -.4 .2 .4" stroke="#e890a8" stroke-width=".4" fill="none"/>`;
    k += `<path d="M${x - 2} ${y - 0.4} l0 .6 M${x - 0.6} ${y - 0.2} l0 .6 M${x + 1} ${y - 0.4} l0 .6 M${x + 2.2} ${y - 0.2} l0 .6" stroke="#d07a94" stroke-width=".6"/><path d="M${x - 1} ${y - 4.6} l.8 -.6 l.4 .9 Z" fill="#55b04a"/>`;
    U({ id: "si_gluecksschwein", de: "das Glücksschwein", syl: "GLÜCKS-schwein", it: "il maialino portafortuna", itSyl: "ma-ia-LI-no por-ta-for-TU-na", en: "lucky pig",
      tipp: "„Schwein gehabt!“ – das Glücksschwein aus Marzipan bringt Glück im neuen Jahr." }, 188, 155, -4.4, -6.4, 10.4, 7.2);
  }
  /* DER SCHORNSTEINFEGER: kleine Figur mit Zylinder und Leiter */
  {
    const [x, y] = auf(200, 148);
    k += `<ellipse cx="${x}" cy="${y}" rx="2.4" ry=".6" fill="#2a2a2e"/><rect x="${x - 1.2}" y="${y - 4}" width="1" height="4" fill="#141418"/><rect x="${x + 0.2}" y="${y - 4}" width="1" height="4" fill="#141418"/>`;
    k += `<path d="M${x - 1.8} ${y - 3.8} L${x - 1.6} ${y - 8.4} L${x + 1.6} ${y - 8.4} L${x + 1.8} ${y - 3.8} Z" fill="#1e1e24"/><circle cx="${x - 0.5}" cy="${y - 7.4}" r=".25" fill="#d8b24a"/><circle cx="${x + 0.5}" cy="${y - 7.4}" r=".25" fill="#d8b24a"/><circle cx="${x - 0.5}" cy="${y - 6}" r=".25" fill="#d8b24a"/><circle cx="${x + 0.5}" cy="${y - 6}" r=".25" fill="#d8b24a"/>`;
    k += `<circle cx="${x}" cy="${y - 9.6}" r="1.3" fill="#efc59a"/><rect x="${x - 1.2}" y="${y - 13.6}" width="2.4" height="3" fill="#141418"/><rect x="${x - 1.9}" y="${y - 10.8}" width="3.8" height=".6" fill="#141418"/><circle cx="${x - 0.4}" cy="${y - 9.8}" r=".18" fill="#222"/><circle cx="${x + 0.4}" cy="${y - 9.8}" r=".18" fill="#222"/>`;
    k += `<path d="M${x + 2.4} ${y} L${x + 3.6} ${y - 11} M${x + 4} ${y} L${x + 5.2} ${y - 11}" stroke="#b08a5a" stroke-width=".35"/>`;
    for (let i = 1; i < 6; i++) k += `<line x1="${r(x + 2.4 + i * 0.22)}" y1="${r(y - i * 1.9)}" x2="${r(x + 4 + i * 0.22)}" y2="${r(y - i * 1.9)}" stroke="#b08a5a" stroke-width=".3"/>`;
    k += `<path d="M${x - 1.8} ${y - 7.6} L${x - 3.4} ${y - 12} M${x - 3.4} ${y - 12} l-1 -.6 l2 0 Z" stroke="#141418" stroke-width=".4" fill="#141418"/>`;
    U({ id: "si_schornsteinfeger", de: "der Schornsteinfeger", syl: "SCHORN-stein-fe-ger", it: "lo spazzacamino", itSyl: "spaz-za-ca-MI-no", en: "chimney sweep",
      tipp: "Der Schornsteinfeger ist ein Glücksbringer. Wer ihn berührt, hat Glück." }, 200, 148, -4.2, -14.4, 10, 14.8);
  }
  /* DAS KLEEBLATT: Glücksklee im Topf mit Fliegenpilz-Stecker */
  {
    const [x, y] = auf(208, 155);
    k += `<path d="M${x - 3} ${y} L${x - 3.4} ${y - 4} L${x + 3.4} ${y - 4} L${x + 3} ${y} Z" fill="${S.lg("topf", [[0, "#a8542a"], [1, "#7a3a1a"]], 0, 0, 1, 0)}"/><rect x="${x - 3.6}" y="${y - 4.6}" width="7.2" height="1" fill="#b8643a"/>`;
    for (const [dx, dy] of [[-2, -6.4], [0, -7.8], [2.2, -6.6], [-0.8, -5.6], [1.2, -5.4]]) {
      k += `<line x1="${x + dx * 0.6}" y1="${y - 4.4}" x2="${x + dx}" y2="${y + dy + 0.6}" stroke="#4e8a2e" stroke-width=".25"/>`;
      for (let b = 0; b < 4; b++) { const a = b * Math.PI / 2 + 0.3; k += `<ellipse cx="${r(x + dx + Math.cos(a) * 0.7)}" cy="${r(y + dy + Math.sin(a) * 0.5)}" rx=".75" ry=".55" fill="${b % 2 ? "#4f9a3a" : "#5fb04a"}"/>`; }
    }
    k += `<line x1="${x + 2.6}" y1="${y - 4.4}" x2="${x + 3}" y2="${y - 9}" stroke="#e8e2d4" stroke-width=".3"/><path d="M${x + 1.8} ${y - 9} Q${x + 3} ${y - 11} ${x + 4.2} ${y - 9} Z" fill="#d4202e"/><circle cx="${x + 2.6}" cy="${y - 9.6}" r=".25" fill="#fff"/><circle cx="${x + 3.4}" cy="${y - 9.4}" r=".2" fill="#fff"/>`;
    U({ id: "si_kleeblatt", de: "das Kleeblatt", syl: "KLEE-blatt", it: "il quadrifoglio", itSyl: "qua-dri-FO-glio", en: "four-leaf clover",
      tipp: "Ein vierblättriges Kleeblatt bringt Glück. Zu Silvester verschenkt man Glücksklee im Topf." }, 208, 155, -4, -11, 9, 11.4);
  }
  S.teil({ id: "si_tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: cx, y: TB.fuss, steht: true, kunst: k,
    zoom: { x: 118, y: 118, w: 102, h: 68 }, unter });
}

/* =====================================================================
   10 — DER STUHL und 11 — DER NACHBAR mit PARTYHUT (rechts)
   ===================================================================== */
{
  let k = schatten(0, 0.3, 9, 1, .3);
  k += `<path d="M-6 0 L-5 -21 M6 0 L5 -21 M-5 -21 L-6 -42 M5 -21 L6 -42" stroke="${METALL}" stroke-width="1.2" stroke-linecap="round"/>`;
  k += `<path d="M-7 -22 L7 -22 L7.4 -19.6 L-7.4 -19.6 Z" fill="#3a4048"/><rect x="-6.4" y="-41" width="12.8" height="10" rx="1" fill="#3a4048"/>`;
  for (let i = 0; i < 3; i++) k += `<line x1="-5.6" y1="${-39 + i * 3}" x2="5.6" y2="${-39 + i * 3}" stroke="#22262a" stroke-width=".5"/>`;
  k += `<rect x="-6.6" y="-23.6" width="13.2" height="2.4" rx="1" fill="#c4202a"/>`;
  S.teil({ id: "si_stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: 300, y: 190, steht: true, kunst: k });
}
{
  const X = 248, Y = 194;
  const m = figur({ id: "sv_nachbar", geschlecht: "m", pose: "zeigen", blick: -40, frisur: "kurz", haarfarbe: "schwarz", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "#e8e4dc" }, jacke: { stueck: "jacke", farbe: "#2a3a5a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" }, zubehoer: { stueck: "schal", farbe: "#86898e" } } }, 84);
  S.teil({ id: "si_mensch_si", de: "der Nachbar", syl: "NACH-bar", it: "il vicino", itSyl: "vi-CI-no", en: "neighbour", x: X, y: Y, kunst: schatten(0, 0, 12, 1.6, .35) + m.svg,
    tipp: "Er zeigt auf das Feuerwerk: „Schau mal, wie schön!“" });
  const kopf = m.z.kopf || { x: 0 }, kx = (kopf.x || 0) * m.k * (1), ko = (m.z.box.y0 + 7) * m.k;
  let h = `<path d="M-4 0 L0 -12 L4 0 Z" fill="${S.lg("hut", [[0, "#f2d23a"], [1, "#e8a01a"]], 0, 0, 1, 0)}"/><path d="M-3 -3 L3 -3 M-2 -6 L2 -6 M-1 -9 L1 -9" stroke="#c4202a" stroke-width=".9"/><circle cx="0" cy="-12.4" r="1.4" fill="#3a8ad8"/><path d="M-4 0 Q0 1.4 4 0" stroke="#e8a01a" stroke-width=".6" fill="none"/>`;
  S.teil({ oben: true, id: "si_partyhut", de: "der Partyhut", syl: "PAR-ty-hut", it: "il cappellino di carta", itSyl: "cap-pel-LI-no di CAR-ta", en: "party hat", x: X + kx, y: Y + ko, kunst: h });
}

/* Licht über allem: Schein des Feuerwerks auf dem Balkon (fängt keinen Tipp) */
S.davor(`<g pointer-events="none"><rect width="320" height="200" fill="${S.rg("vignette", [[0.6, "#000", 0], [1, "#02030c", 0.42]], 0.5, 0.45, 0.75)}"/></g>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/silvester.js"));
console.log(aus);
