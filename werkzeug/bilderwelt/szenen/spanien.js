#!/usr/bin/env node
/* =====================================================================
   SPANIEN (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Plaça de Gaudí in Barcelona, Baustand der Sagrada Família
   2026, Tapas-Bars, Azulejos, Osborne-Stier, Panot-Pflaster):
   - Von der PLAÇA DE GAUDÍ schaut man über einen Teich auf die
     Geburtsfassade der SAGRADA FAMÍLIA: vier spindelförmige Glocken-
     türme (unten mit schrägen Lamellen, oben bunte Mosaikspitzen), über
     dem Mittelportal die grüne Zypresse (Lebensbaum). Dahinter die sechs
     Mitteltürme: der Jesus-Turm (172,5 m, Kreuz seit Februar 2026, im
     Juni 2026 eingeweiht), der Marien-Turm mit dem leuchtenden Stern
     (138 m) und die vier Evangelisten-Türme (135 m). Kräne stehen noch.
   - Rund um den Platz Terrassen mit TAPAS und PAELLA (flache Pfanne mit
     zwei Griffen: gelber Safranreis, Garnelen, Muscheln, Zitrone), frisch
     gepresster ORANGEN-Saft. In der Bar hängen Schinken (Jamón).
   - Die Bars schmücken sich mit AZULEJOS (blau-weiße Fliesenbilder),
     beliebt ist Don Quijote mit den WINDMÜHLEN von Consuegra auf der
     weiten EBENE von La Mancha und der Burg auf dem Hügel.
   - Der STIER als schwarze Silhouette ist seit 1956 das Zeichen von
     Osborne – hier als Wirtshausschild „Bar El Toro“.
   - Der Gehweg: „Panot“ – graue Platten mit der vierblättrigen Blume
     (Barcelona, seit 1906). OLIVENBÄUME in runden Pflanzkübeln.
   - Straßenkünstler: ein GITARRIST, eine Tänzerin im Flamenco-Kleid mit
     FÄCHER und KASTAGNETTEN.
   BLICK: Augenhöhe 1,6 m, Horizont y = 108. Einheiten je Meter am Boden:
   s(y) = (y − 108) / 1,6 (Bar y 150: 26; Tänzerin y 172: 40 → 1,65 m =
   66; Tisch y 188: 50).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "spanien", titel: "Spanien", emoji: "🇪🇸", thema: "Länder", kuerzel: "b24d", fassung: 852 });
const rnd = zufall(1882);
const r = B.r;
const HY = 108;
const sy = (y) => (y - HY) / 1.6;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const knapp = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);
B.mensch({}, 10);

/* ---------- Stoffe ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="1.3"/></filter>`);
S.def(`<pattern id="${S.id("panot")}" width="5" height="3.2" patternUnits="userSpaceOnUse"><rect width="5" height="3.2" fill="#b9b6ae"/><rect x=".1" y=".1" width="4.8" height="3" fill="#c4c1b8"/><ellipse cx="2.5" cy=".9" rx=".55" ry=".4" fill="#aeaba2"/><ellipse cx="2.5" cy="2.3" rx=".55" ry=".4" fill="#aeaba2"/><ellipse cx="1.6" cy="1.6" rx=".55" ry=".4" fill="#aeaba2"/><ellipse cx="3.4" cy="1.6" rx=".55" ry=".4" fill="#aeaba2"/><circle cx="2.5" cy="1.6" r=".22" fill="#d0cdc4"/></pattern>`);
S.def(`<pattern id="${S.id("fliese")}" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#f4f1e8"/><rect width="5" height="5" fill="none" stroke="#c9c4b4" stroke-width=".25"/></pattern>`);
const STEIN = S.lg("stein", [[0, "#b8a283"], [0.5, "#a68e6c"], [1, "#8f7758"]], 0, 0, 1, 0);
const STEIN_NEU = S.lg("steinneu", [[0, "#e6e0d2"], [0.5, "#d2cab8"], [1, "#b9b09c"]], 0, 0, 1, 0);
const ALU = S.lg("alu", [[0, "#e9ecee"], [0.5, "#b9c0c5"], [1, "#8d959b"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Himmel, Bäume der Plaça, Panot-Pflaster
   ===================================================================== */
{
  let k = `<rect width="320" height="${HY + 8}" fill="${S.lg("himmel", [[0, "#3f86d0"], [0.6, "#8cbde8"], [1, "#e3eef2"]])}"/>`;
  for (const [x, y, w] of [[150, 18, 22], [300, 40, 16]]) k += `<g filter="url(#${S.id("dunst")})" opacity=".8"><ellipse cx="${x}" cy="${y}" rx="${w}" ry="${r(w * 0.13)}" fill="#fff"/><ellipse cx="${x - w * 0.3}" cy="${r(y - w * 0.1)}" rx="${r(w * 0.4)}" ry="${r(w * 0.14)}" fill="#fff"/></g>`;
  /* Häuser des Eixample hinter der Kirche (hell, Balkone) */
  k += `<path d="M120 116 L120 94 L150 94 L150 98 L172 98 L172 116 Z M288 116 L288 92 L320 92 L320 116 Z" fill="#d8cdb8"/>`;
  for (let x = 124; x < 170; x += 6) k += `<rect x="${x}" y="100" width="2.4" height="3.4" fill="#8f8270"/><rect x="${x}" y="107" width="2.4" height="3.4" fill="#8f8270"/>`;
  for (let x = 292; x < 320; x += 6) k += `<rect x="${x}" y="97" width="2.4" height="3.4" fill="#8f8270"/><rect x="${x}" y="104" width="2.4" height="3.4" fill="#8f8270"/>`;
  /* Pflaster: Panot-Platten, Fugen in Fluchtperspektive */
  k += `<rect x="0" y="${HY + 6}" width="320" height="${200 - HY - 6}" fill="url(#${S.id("panot")})"/>`;
  for (let i = -44; i <= 44; i++) k += `<line x1="${r(200 + i * 0.4 * sy(124))}" y1="124" x2="${r(200 + i * 0.4 * sy(200))}" y2="200" stroke="#9a978e" stroke-width=".3" opacity=".55"/>`;
  for (let y = 125, d = 1.4; y < 200; y += d, d *= 1.14) k += `<line x1="0" y1="${r(y)}" x2="320" y2="${r(y)}" stroke="#9a978e" stroke-width=".3" opacity=".5"/>`;
  k += `<rect x="0" y="${HY + 6}" width="320" height="${200 - HY - 6}" fill="${S.lg("bodenlicht", [[0, "#fff", 0.2], [0.3, "#fff", 0], [1, "#000", 0.1]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DER KRAN (die Kirche wird weitergebaut)
   ===================================================================== */
{
  let k = `<rect x="-1.4" y="-110" width="2.8" height="110" fill="url(#${S.id("kranmast")})"/>`;
  S.def(`<pattern id="${S.id("kranmast")}" width="2.8" height="3" patternUnits="userSpaceOnUse"><rect width="2.8" height="3" fill="none"/><path d="M0 0 L2.8 3 M2.8 0 L0 3 M0 0 V3 M2.8 0 V3" stroke="#d9b21e" stroke-width=".35"/></pattern>`);
  k += `<path d="M-24 -108 L66 -108 L66 -106 L-24 -106 Z" fill="none" stroke="#d9b21e" stroke-width=".5"/>`;
  for (let x = -24; x < 66; x += 3) k += `<line x1="${x}" y1="-108" x2="${x + 3}" y2="-106" stroke="#d9b21e" stroke-width=".3"/>`;
  k += `<path d="M0 -118 L-22 -108 M0 -118 L40 -108 M0 -118 L0 -110" stroke="#9a9a9a" stroke-width=".25"/><rect x="-1.6" y="-119" width="3.2" height="2" fill="#d9b21e"/>`;
  k += `<rect x="-24" y="-109" width="8" height="5" fill="#8a8a8a"/><rect x="3" y="-106" width="4" height="3.4" fill="#e8e2c8"/>`;
  k += `<line x1="52" y1="-106" x2="52" y2="-84" stroke="#3a3a3a" stroke-width=".25"/><path d="M50.6 -84 h2.8 v1.4 h-2.8 Z" fill="#3a3a3a"/>`;
  S.teil({ id: "kran", de: "der Kran", syl: "KRAN", it: "la gru", itSyl: "GRU", en: "crane", x: 176, y: 114, kunst: k,
    tipp: "An der Sagrada Família wird seit 1882 gebaut. Die Kräne stehen noch immer da." });
}

/* =====================================================================
   2 — DIE SAGRADA FAMÍLIA (Geburtsfassade, sechs Mitteltürme)
   ===================================================================== */
{
  const X = 232, Y = 116;
  let k = "";
  /* Spindelturm: unten breiter, oben spitz */
  const spindel = (cx, fuss, h, w, farbe, spitze) => {
    let g = `<path d="M${r(cx - w / 2)} ${fuss} Q${r(cx - w * 0.56)} ${r(fuss - h * 0.55)} ${r(cx - w * 0.2)} ${r(fuss - h * 0.92)} L${cx} ${r(fuss - h)} L${r(cx + w * 0.2)} ${r(fuss - h * 0.92)} Q${r(cx + w * 0.56)} ${r(fuss - h * 0.55)} ${r(cx + w / 2)} ${fuss} Z" fill="${farbe}"/>`;
    /* schräge Lamellen */
    for (let i = 1; i < 14; i++) { const t = i / 15, y = fuss - h * t * 0.85, ww = w * (0.5 - t * 0.28); g += `<path d="M${r(cx - ww)} ${r(y + 0.6)} L${r(cx + ww)} ${r(y - 0.6)}" stroke="#6e5a40" stroke-width=".35" opacity=".55"/>`; }
    g += `<path d="M${r(cx - w * 0.15)} ${fuss} Q${r(cx - w * 0.2)} ${r(fuss - h * 0.5)} ${r(cx - w * 0.06)} ${r(fuss - h * 0.9)}" stroke="#fff" stroke-width=".5" opacity=".25" fill="none"/>`;
    if (spitze) g += spitze(cx, fuss - h);
    return g;
  };
  const mosaik = (cx, y) => `<path d="M${cx - 2.4} ${y + 2} Q${cx - 2.6} ${y - 3} ${cx} ${y - 6} Q${cx + 2.6} ${y - 3} ${cx + 2.4} ${y + 2} Z" fill="${S.lg("mosaik", [[0, "#c9283e"], [0.5, "#e8b93c"], [1, "#f4f1e8"]])}"/><circle cx="${cx}" cy="${y - 1}" r="1" fill="#f4f1e8"/><circle cx="${cx}" cy="${y - 6.6}" r=".9" fill="#e8b93c"/>`;
  /* hintere Mitteltürme: Marien-Turm (Stern), Evangelisten, Jesus-Turm (Kreuz) */
  k += spindel(X + 24, Y - 40, 42, 11, STEIN_NEU, (cx, y) => {
    let s = `<g transform="translate(${cx} ${y - 2})">`;
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; s += `<path d="M0 0 L${r(Math.cos(a) * 3.4)} ${r(Math.sin(a) * 3.4)}" stroke="#f6f2e2" stroke-width=".8"/>`; }
    return s + `<circle r="1.4" fill="#fffbe6"/><circle r="5" fill="#fff8d0" opacity=".25"/></g>`;
  });
  for (const dx of [-16, 14]) k += spindel(X + dx, Y - 40, 40, 10, STEIN_NEU, (cx, y) => `<circle cx="${cx}" cy="${y - 1.4}" r="2" fill="#f4f1e8"/><circle cx="${cx}" cy="${y - 1.4}" r="1" fill="#d9a93a"/>`);
  k += spindel(X, Y - 46, 52, 16, STEIN_NEU, (cx, y) => `<path d="M${cx - 0.9} ${y - 12} h1.8 v4.2 h4.2 v1.8 h-4.2 v4.2 h-1.8 v-4.2 h-4.2 v-1.8 h4.2 Z" fill="#f6f8fa" stroke="#9fb6c8" stroke-width=".3"/><rect x="${cx - 0.9}" y="${y - 4}" width="1.8" height="4" fill="#e6eef4"/>`);
  /* Kirchenschiff und Apsis (hell, Fenster) */
  k += `<path d="M${X - 40} ${Y} L${X - 40} ${Y - 44} Q${X} ${Y - 54} ${X + 40} ${Y - 44} L${X + 40} ${Y} Z" fill="${S.lg("schiff", [[0, "#ddd5c4"], [1, "#c3b8a2"]])}"/>`;
  for (let i = 0; i < 7; i++) k += `<path d="M${X - 34 + i * 11} ${Y - 18} L${X - 34 + i * 11} ${Y - 34} Q${X - 31 + i * 11} ${Y - 38} ${X - 28 + i * 11} ${Y - 34} L${X - 28 + i * 11} ${Y - 18} Z" fill="#7d8fa0" opacity=".7"/>`;
  /* Geburtsfassade: vier Glockentürme (älter, dunkler Stein) */
  const BRAUN = S.lg("braun", [[0, "#a8916e"], [0.5, "#937a58"], [1, "#7a6346"]], 0, 0, 1, 0);
  for (const [dx, h] of [[-30, 60], [30, 60], [-15, 66], [15, 66]]) k += spindel(X + dx, Y - 6, h, 11, BRAUN, mosaik);
  /* Fassade mit drei Portalen, Mittelportal mit grüner Zypresse */
  k += `<path d="M${X - 36} ${Y} L${X - 36} ${Y - 18} Q${X - 30} ${Y - 26} ${X - 22} ${Y - 22} Q${X - 10} ${Y - 34} ${X} ${Y - 44} Q${X + 10} ${Y - 34} ${X + 22} ${Y - 22} Q${X + 30} ${Y - 26} ${X + 36} ${Y - 18} L${X + 36} ${Y} Z" fill="${BRAUN}"/>`;
  /* Skulpturen als Tropfstein-Struktur */
  for (let i = 0; i < 60; i++) { const x = X - 34 + rnd() * 68, y = Y - 4 - rnd() * 22; k += `<path d="M${r(x)} ${r(y)} q.6 2 0 3.6" stroke="${rnd() < 0.5 ? "#6e5a40" : "#c2ac88"}" stroke-width=".6" fill="none" opacity=".7"/>`; }
  k += `<path d="M${X - 5} ${Y} L${X - 5} ${Y - 12} Q${X} ${Y - 20} ${X + 5} ${Y - 12} L${X + 5} ${Y} Z" fill="#3e3226"/>`;
  for (const dx of [-24, 24]) k += `<path d="M${X + dx - 3.4} ${Y} L${X + dx - 3.4} ${Y - 8} Q${X + dx} ${Y - 13} ${X + dx + 3.4} ${Y - 8} L${X + dx + 3.4} ${Y} Z" fill="#3e3226"/>`;
  k += `<path d="M${X} ${Y - 46} Q${X + 3.6} ${Y - 38} ${X + 2.4} ${Y - 30} L${X - 2.4} ${Y - 30} Q${X - 3.6} ${Y - 38} ${X} ${Y - 46} Z" fill="${S.lg("lebensbaum", [[0, "#6fae5a"], [1, "#2f7a3a"]])}"/>`;
  for (const [dx, dy] of [[-1.6, -40], [1.4, -36], [-0.6, -33], [1.8, -42]]) k += `<circle cx="${X + dx}" cy="${Y + dy}" r=".55" fill="#fff"/>`;
  S.teil({ id: "sagrada", de: "die Sagrada Família", syl: "Sa-GRA-da Fa-MI-lia", it: "la Sagrada Família", itSyl: "sa-GRA-da fa-MI-lia", en: "Sagrada Família", x: X, y: Y, kunst: um(X, Y, k),
    tipp: "Die Kirche von Antoni Gaudí in Barcelona. Der höchste Turm ist 172 Meter hoch." });
}

/* =====================================================================
   3 — DER TEICH der Plaça de Gaudí (mit Spiegelbild)
   ===================================================================== */
{
  let k = `<path d="M124 114 L320 114 L320 124 L118 124 Z" fill="${S.lg("teich", [[0, "#6d8f9a"], [1, "#4b7482"]])}"/>`;
  for (const [x, w] of [[202, 3], [217, 3.4], [232, 5], [247, 3.4], [262, 3]]) k += `<rect x="${x - w / 2}" y="114.6" width="${w}" height="${r(4 + w)}" fill="#b8a283" opacity=".35"/>`;
  for (let i = 0; i < 30; i++) { const x = 122 + rnd() * 196, y = 115 + rnd() * 8.4; k += `<path d="M${r(x)} ${r(y)} h${r(3 + rnd() * 6)}" stroke="#d6e6ea" stroke-width=".3" opacity=".7"/>`; }
  k += `<path d="M118 124 L320 124 L320 126 L117 126 Z" fill="#c9c2b0"/><path d="M124 114 L320 114" stroke="#d8d2c2" stroke-width=".8"/>`;
  S.teil({ id: "teich", de: "der Teich", syl: "TEICH", it: "lo stagno", itSyl: "STA-gno", en: "pond", x: 220, y: 126, kunst: um(220, 126, k),
    tipp: "Im Teich der Plaça de Gaudí spiegelt sich die Kirche." });
}

/* =====================================================================
   4 — DIE BAR (Hausfront mit Tür, Theke im Halbdunkel)
   ===================================================================== */
const BAR = { x1: 120, boden: 150 };
{
  let k = `<rect x="0" y="0" width="${BAR.x1}" height="${BAR.boden}" fill="${S.lg("fassade", [[0, "#e2c9a0"], [1, "#d3b588"]], 0, 0, 1, 0)}"/>`;
  for (let y = 6; y < 54; y += 6) k += `<line x1="0" y1="${y}" x2="${BAR.x1}" y2="${y}" stroke="#c4a679" stroke-width=".3"/>`;
  /* oberes Fenster mit Balkontür */
  k += `<rect x="30" y="0" width="34" height="40" fill="#cdb38a"/><rect x="33" y="0" width="28" height="38" fill="${S.lg("glas", [[0, "#7f9ab0"], [1, "#4a6478"]])}"/><line x1="47" y1="0" x2="47" y2="38" stroke="#efe6d2" stroke-width="1"/><path d="M34 1 L42 1 L34 16 Z" fill="#fff" opacity=".2"/>`;
  k += `<rect x="28" y="22" width="2.6" height="17" fill="#3f6a8a"/><rect x="63.4" y="22" width="2.6" height="17" fill="#3f6a8a"/>`;
  /* Balkon aus Schmiedeeisen */
  k += `<path d="M22 40 L72 40 L74 43 L20 43 Z" fill="#b8a283"/>`;
  k += `<rect x="22" y="30" width="50" height=".9" fill="#1d1d1f"/>`;
  for (let x = 23; x < 72; x += 2.4) k += `<line x1="${x}" y1="30" x2="${x}" y2="40" stroke="#1d1d1f" stroke-width=".35"/>`;
  k += `<path d="M30 35 q4 -4 8 0 q4 4 8 0 q4 -4 8 0 q4 4 8 0" stroke="#1d1d1f" stroke-width=".4" fill="none"/>`;
  /* Blumentöpfe auf dem Balkon */
  for (const x of [26, 68]) k += `<path d="M${x - 2.4} 40 L${x + 2.4} 40 L${x + 2} 36 L${x - 2} 36 Z" fill="#c8693c"/><circle cx="${x - 1}" cy="34.6" r="1.6" fill="#3f7f34"/><circle cx="${x + 1}" cy="34" r="1.4" fill="#c9283e"/>`;
  /* Ladenschild */
  k += `<rect x="0" y="56" width="${BAR.x1}" height="12" fill="${S.lg("schild", [[0, "#7a1e18"], [1, "#561410"]])}"/><rect x="1" y="57" width="${BAR.x1 - 2}" height="10" fill="none" stroke="#e8b93c" stroke-width=".4"/>`;
  k += `<text x="${BAR.x1 / 2 - 6}" y="64.6" font-size="6.4" text-anchor="middle" fill="#f6dc8a" font-family="Georgia,serif" font-weight="bold" letter-spacing="1">BAR EL TORO</text>`;
  k += `<text x="${BAR.x1 / 2 - 6}" y="74" font-size="3.2" text-anchor="middle" fill="#7a1e18" font-family="Georgia,serif" letter-spacing="1.4">TAPAS · PAELLA · VINOS</text>`;
  /* offene Doppeltür: Inneres mit Theke */
  const T = { x0: 8, x1: 54, o: 82 };
  k += `<rect x="${T.x0 - 2}" y="${T.o - 2}" width="${T.x1 - T.x0 + 4}" height="${BAR.boden - T.o + 2}" fill="#5a3a20"/>`;
  k += `<rect x="${T.x0}" y="${T.o}" width="${T.x1 - T.x0}" height="${BAR.boden - T.o}" fill="${S.lg("innen", [[0, "#3a2414"], [0.6, "#6b4424"], [1, "#2a180c"]])}"/>`;
  k += `<rect x="${T.x0}" y="${T.o}" width="${T.x1 - T.x0}" height="8" fill="#f2c870" opacity=".18"/>`;
  for (let x = T.x0 + 4; x < T.x1; x += 9) k += `<circle cx="${x}" cy="${T.o + 3}" r="1.2" fill="#fff0c0"/>`;
  /* Flaschenregal und Theke mit Tapas-Vitrine */
  for (let i = 0; i < 12; i++) k += `<rect x="${T.x0 + 2 + i * 3.6}" y="${T.o + 22}" width="1.6" height="6" rx=".6" fill="${["#2f6b4a", "#7a2a1e", "#c9a23a", "#2a2a2a"][i % 4]}" opacity=".8"/>`;
  k += `<rect x="${T.x0}" y="${T.o + 28}" width="${T.x1 - T.x0}" height="1.6" fill="#8a5a32"/>`;
  k += `<rect x="${T.x0}" y="${T.o + 40}" width="${T.x1 - T.x0}" height="3" fill="#a87a4a"/><rect x="${T.x0 + 2}" y="${T.o + 35}" width="${T.x1 - T.x0 - 4}" height="5" fill="#dfeef2" opacity=".35"/>`;
  for (let i = 0; i < 8; i++) k += `<ellipse cx="${T.x0 + 5 + i * 5.4}" cy="${T.o + 39}" rx="2" ry=".9" fill="${["#e8b93c", "#c9341f", "#f2e2b0", "#7a8f3a"][i % 4]}"/>`;
  k += `<rect x="${T.x0}" y="${T.o + 43}" width="${T.x1 - T.x0}" height="${BAR.boden - T.o - 43}" fill="#5a3418"/>`;
  /* Türflügel aufgeklappt */
  k += `<path d="M${T.x0 - 2} ${T.o - 2} L${T.x0 - 7} ${T.o + 2} L${T.x0 - 7} ${BAR.boden + 2} L${T.x0 - 2} ${BAR.boden} Z" fill="#7a4a24"/><path d="M${T.x1 + 2} ${T.o - 2} L${T.x1 + 7} ${T.o + 2} L${T.x1 + 7} ${BAR.boden + 2} L${T.x1 + 2} ${BAR.boden} Z" fill="#6b4020"/>`;
  /* Sockel aus Fliesen */
  k += `<rect x="${T.x1 + 7}" y="${BAR.boden - 12}" width="${BAR.x1 - T.x1 - 7}" height="12" fill="#2a5a8a"/>`;
  for (let x = T.x1 + 7; x < BAR.x1; x += 4) k += `<rect x="${x + 0.3}" y="${BAR.boden - 11.6}" width="3.4" height="5.4" fill="none" stroke="#e8e2d0" stroke-width=".3"/><circle cx="${x + 2}" cy="${BAR.boden - 9}" r=".8" fill="#e8b93c"/>`;
  S.teil({ id: "bar", de: "die Bar", syl: "BAR", it: "il bar", itSyl: "BAR", en: "bar", x: BAR.x1 / 2, y: BAR.boden, steht: true, kunst: um(BAR.x1 / 2, BAR.boden, k),
    tipp: "In der Bar bestellt man Tapas – kleine Häppchen – und isst sie oft im Stehen." });
}

/* =====================================================================
   5 — DER SCHINKEN (Jamón, hängt hinter der Theke)
   ===================================================================== */
{
  let k = "";
  for (const [dx, s] of [[-7, 1], [0, 1.08], [7, 0.94]]) {
    k += `<line x1="${dx}" y1="-20" x2="${dx}" y2="-16" stroke="#d8c8a0" stroke-width=".35"/>`;
    k += `<path d="M${dx - 0.6} ${r(-16)} L${dx + 0.6} -16 L${r(dx + 3.4 * s)} ${r(-16 + 9 * s)} Q${r(dx + 3 * s)} ${r(-16 + 13 * s)} ${dx} ${r(-16 + 13.4 * s)} Q${r(dx - 3 * s)} ${r(-16 + 13 * s)} ${r(dx - 3 * s)} ${r(-16 + 9 * s)} Z" fill="${S.lg("jamon", [[0, "#8a3a22"], [0.6, "#6a2814"], [1, "#4a1a0a"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${dx - 0.6} -16 L${dx + 0.6} -16 L${dx + 0.8} -13 L${dx - 0.8} -13 Z" fill="#e9dcc0"/><path d="M${r(dx - 2 * s)} ${r(-16 + 9 * s)} q1 2 .6 3.6" stroke="#f2e2c0" stroke-width=".5" fill="none" opacity=".6"/>`;
  }
  S.teil({ oben: true, id: "schinken", de: "der Schinken", syl: "SCHIN-ken", it: "il prosciutto", itSyl: "pro-SCIUT-to", en: "ham", x: 31, y: 104, kunst: k,
    tipp: "Der „Jamón“ hängt in jeder Bar. Er wird hauchdünn mit dem Messer geschnitten." });
}

/* =====================================================================
   6 — DAS FLIESENBILD (Azulejos) mit Lupe: Windmühle, Ebene, Burg
   ===================================================================== */
const fliesUnter = [];
{
  const F = { x: 64, y: 94, w: 46, h: 32 };
  let k = `<rect x="${F.x - 1.4}" y="${F.y - 1.4}" width="${F.w + 2.8}" height="${F.h + 2.8}" fill="#1f4a7a"/>`;
  k += `<rect x="${F.x}" y="${F.y}" width="${F.w}" height="${F.h}" fill="url(#${S.id("fliese")})"/>`;
  const BL = "#2a5aa0", BLH = "#7aa0d0", OC = "#d9a23a";
  /* Himmel (Pinselstriche) */
  for (let i = 0; i < 6; i++) k += `<path d="M${F.x + 2 + i * 7} ${F.y + 4 + (i % 2) * 2} q3 -1.4 6 0" stroke="${BLH}" stroke-width=".5" fill="none"/>`;
  /* DIE EBENE — weite Felder bis zum Horizont */
  const eb = F.y + 22;
  k += `<path d="M${F.x} ${eb} Q${F.x + 23} ${eb - 2} ${F.x + F.w} ${eb} L${F.x + F.w} ${F.y + F.h} L${F.x} ${F.y + F.h} Z" fill="${OC}" opacity=".55"/>`;
  for (let i = 0; i < 5; i++) k += `<path d="M${F.x} ${eb + 2 + i * 1.8} Q${F.x + 23} ${eb + i * 1.8} ${F.x + F.w} ${eb + 2 + i * 1.8}" stroke="${i % 2 ? OC : "#8a6a20"}" stroke-width=".4" fill="none"/>`;
  fliesUnter.push({ id: "wueste", de: "die Ebene", syl: "E-be-ne", it: "la pianura", itSyl: "pia-NU-ra", en: "plain", x: F.x + 8, y: F.y + F.h, kunst: flaeche(-8, -10, 16, 10),
    tipp: "Die Mancha ist eine weite, trockene Ebene mitten in Spanien." });
  /* Hügel mit Windmühlen und Burg (Consuegra) */
  k += `<path d="M${F.x + 6} ${eb + 0.4} Q${F.x + 22} ${F.y + 12} ${F.x + 44} ${eb - 0.4} Z" fill="${BLH}" opacity=".7"/>`;
  const muehle = (x, y, s) => {
    let g = `<path d="M${r(x - 2 * s)} ${y} L${r(x - 1.5 * s)} ${r(y - 6 * s)} L${r(x + 1.5 * s)} ${r(y - 6 * s)} L${r(x + 2 * s)} ${y} Z" fill="#fbf8f0" stroke="${BL}" stroke-width=".3"/>`;
    g += `<path d="M${r(x - 1.8 * s)} ${r(y - 6 * s)} L${x} ${r(y - 8 * s)} L${r(x + 1.8 * s)} ${r(y - 6 * s)} Z" fill="${BL}"/>`;
    g += `<rect x="${r(x - 0.4 * s)}" y="${r(y - 2 * s)}" width="${r(0.8 * s)}" height="${r(2 * s)}" fill="${BL}"/>`;
    for (const a of [20, 110, 200, 290]) { const ex = x + Math.cos(a * Math.PI / 180) * 5 * s, ey = y - 6.4 * s + Math.sin(a * Math.PI / 180) * 5 * s; g += `<line x1="${x}" y1="${r(y - 6.4 * s)}" x2="${r(ex)}" y2="${r(ey)}" stroke="${BL}" stroke-width=".4"/><path d="M${r(x + (ex - x) * 0.3)} ${r(y - 6.4 * s + (ey - y + 6.4 * s) * 0.3)} L${r(ex)} ${r(ey)}" stroke="${BL}" stroke-width="${r(1.1 * s)}" opacity=".45"/>`; }
    return g;
  };
  k += muehle(F.x + 14, F.y + 18.6, 1) + muehle(F.x + 34, F.y + 18.8, 0.8) + muehle(F.x + 41, F.y + 20, 0.6);
  fliesUnter.push({ id: "windmuehle", de: "die Windmühle", syl: "WIND-müh-le", it: "il mulino a vento", itSyl: "mu-LI-no a VEN-to", en: "windmill", x: F.x + 14, y: F.y + 19, kunst: flaeche(-6, -14, 12, 14),
    tipp: "Don Quijote hielt die Windmühlen für Riesen und kämpfte gegen sie." });
  /* DIE BURG auf dem Hügel */
  k += `<rect x="${F.x + 22}" y="${F.y + 11}" width="8" height="5" fill="#fbf8f0" stroke="${BL}" stroke-width=".3"/><rect x="${F.x + 24.4}" y="${F.y + 8}" width="3.2" height="3.4" fill="#fbf8f0" stroke="${BL}" stroke-width=".3"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${F.x + 22 + i * 2.2}" y="${F.y + 10.2}" width="1" height=".9" fill="${BL}"/>`;
  k += `<rect x="${F.x + 25.4}" y="${F.y + 13}" width="1.2" height="3" fill="${BL}"/>`;
  fliesUnter.push({ id: "burg", de: "die Burg", syl: "BURG", it: "il castello", itSyl: "ca-STEL-lo", en: "castle", x: F.x + 26, y: F.y + 16, kunst: flaeche(-5, -9, 10, 9.4) });
  /* Ritter auf dem Pferd, klein im Vordergrund */
  k += `<path d="M${F.x + 6} ${F.y + 29} l1 -3 h4 l1 3 M${F.x + 7} ${F.y + 26} l-.6 -1.6 M${F.x + 9} ${F.y + 26} l0 -3.4 l1.6 -.4 M${F.x + 10} ${F.y + 22} l3 -4" stroke="${BL}" stroke-width=".5" fill="none"/>`;
  /* Fliesenfugen über dem Bild */
  k += `<rect x="${F.x}" y="${F.y}" width="${F.w}" height="${F.h}" fill="url(#${S.id("fliese")})" opacity=".35"/>`;
  k += `<rect x="${F.x}" y="${F.y}" width="${F.w}" height="${F.h}" fill="none" stroke="${OC}" stroke-width=".5"/>`;
  S.teil({ id: "fliesenbild", de: "das Fliesenbild", syl: "FLIE-sen-bild", it: "gli azulejos", itSyl: "a-zu-LE-jos", en: "tile picture", x: F.x + F.w / 2, y: F.y + F.h, kunst: um(F.x + F.w / 2, F.y + F.h, k),
    zoom: { x: F.x - 2, y: F.y - 2, w: 50, h: 34 },
    unter: fliesUnter,
    tipp: "Bemalte Fliesen heißen in Spanien „Azulejos“. Dieses Bild zeigt Don Quijote in der Mancha." });
}

/* =====================================================================
   7 — DER STIER (Wirtshausschild, schwarze Silhouette)
   ===================================================================== */
{
  let k = `<path d="M0 0 L-20 0" stroke="#1d1d1f" stroke-width=".9"/><path d="M-2 0 Q-8 -5 -14 0" stroke="#1d1d1f" stroke-width=".5" fill="none"/><rect x="-1" y="-2" width="2" height="4" fill="#1d1d1f"/>`;
  k += `<line x1="-6" y1="0" x2="-6" y2="3" stroke="#1d1d1f" stroke-width=".35"/><line x1="-18" y1="0" x2="-18" y2="3" stroke="#1d1d1f" stroke-width=".35"/>`;
  /* Osborne-Stier im Halbprofil: massiger Nacken, kurze Hörner, Schwanz */
  k += `<g transform="translate(-12 3)"><path d="M-9 6 L-9.4 13 L-8 13 L-7.4 8 L-4 8.6 L-3.6 13 L-2.2 13 L-2 8.4 Q2 9 4 8 L4.4 13 L5.8 13 L6.2 7.6 L7.4 13 L8.8 13 L8.6 6 Q10.4 4.4 10.6 1.6 Q11 .2 12 0 L12.8 -1.4 L11.4 -.8 Q10.2 -1.4 9.4 -.4 L8.6 -1.8 L8.4 -.2 Q6 -2.4 2 -1.6 Q-4 -1 -7.4 .4 Q-9 1.6 -9.2 4 Q-11 5 -11.4 9 Q-10.4 6.4 -9 6 Z" fill="#141414"/>`;
  k += `<path d="M8.2 -.6 Q7.8 -3 6.4 -3.4 M9.6 -.6 Q10.6 -3 12 -3" stroke="#e8e2d0" stroke-width=".5" fill="none"/></g>`;
  S.teil({ id: "stier", de: "der Stier", syl: "STIER", it: "il toro", itSyl: "TO-ro", en: "bull", x: 120, y: 76, kunst: k,
    tipp: "Der schwarze Stier steht als großes Schild an vielen Straßen in Spanien." });
}

/* =====================================================================
   8 — DIE FLAGGE (am Balkon)
   ===================================================================== */
{
  let k = `<line x1="0" y1="0" x2="18" y2="-14" stroke="#3a3a3a" stroke-width=".9"/><circle cx="18.3" cy="-14.3" r=".9" fill="#c9a54a"/>`;
  const p = (a, b, c) => `<path d="M${r(4.4 + a)} ${r(-3.4 - a * 0.78)} L${r(4.4 + b)} ${r(-3.4 - b * 0.78)} Q${r(7 + b)} ${r(4 - b * 0.5)} ${r(5.6 + b)} ${r(13 - b * 0.55)} L${r(5.6 + a)} ${r(13 - a * 0.55)} Q${r(7 + a)} ${r(4 - a * 0.5)} ${r(4.4 + a)} ${r(-3.4 - a * 0.78)} Z" fill="${c}"/>`;
  k += p(0, 3, "#c60b1e") + p(3, 9, "#ffc400") + p(9, 12, "#c60b1e");
  k += `<rect x="${r(4.4 + 3.6)}" y="${r(-3.4 - 3.6 * 0.78 + 5)}" width="2.2" height="3" rx=".6" fill="#c60b1e" stroke="#8a5a20" stroke-width=".2"/>`;
  S.teil({ id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: 72, y: 34, kunst: k,
    tipp: "Die Flagge Spaniens ist rot-gelb-rot mit dem Wappen." });
}

/* =====================================================================
   9 — DER OLIVENBAUM im runden Pflanzkübel (rechts)
   ===================================================================== */
const KUEBEL = { x: 294, boden: 178, rand: 158 };
{
  const h = KUEBEL.rand - KUEBEL.boden;
  let k = schatten(0, 0.4, 24, 2.4, 0.3);
  k += `<path d="M-22 ${h} L-20 0 Q0 3 20 0 L22 ${h} Z" fill="${S.lg("kuebel", [[0, "#cfc8ba"], [0.5, "#b4ad9f"], [1, "#948d80"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="${h}" rx="22" ry="3.4" fill="#ded8cc"/><ellipse cx="0" cy="${h}" rx="19.6" ry="2.6" fill="#6b5236"/>`;
  /* knorriger Stamm */
  k += `<path d="M-3 ${h} Q-5 ${h - 10} -2 ${h - 18} Q-6 ${h - 26} -10 ${h - 34} M3 ${h} Q4 ${h - 12} 1 ${h - 20} Q6 ${h - 28} 10 ${h - 36} M0 ${h - 18} L0 ${h - 40}" stroke="${S.lg("oliv", [[0, "#7a6a54"], [1, "#5a4c3a"]], 0, 0, 1, 0)}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 170; i++) {
    const a = rnd() * Math.PI * 2, q = Math.sqrt(rnd()), x = Math.cos(a) * 22 * q, y = h - 46 + Math.sin(a) * 13 * q;
    k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(2.2 + rnd() * 1.4)}" ry="${r(1 + rnd() * 0.6)}" fill="${["#8a9a6a", "#a3b183", "#71865a", "#b8c39e"][i % 4]}" transform="rotate(${Math.round(rnd() * 60 - 30)} ${r(x)} ${r(y)})"/>`;
  }
  for (let i = 0; i < 10; i++) k += `<ellipse cx="${r((rnd() - 0.5) * 36)}" cy="${r(h - 46 + (rnd() - 0.2) * 16)}" rx=".7" ry=".9" fill="#3a3a2a"/>`;
  S.teil({ id: "olivenbaum", de: "der Olivenbaum", syl: "O-LI-ven-baum", it: "l'olivo", itSyl: "o-LI-vo", en: "olive tree", x: KUEBEL.x, y: KUEBEL.boden, steht: true, kunst: k,
    tipp: "Spanien erntet die meisten Oliven der Welt." });
}

/* =====================================================================
   10 — DER GITARRIST (sitzt auf dem Kübelrand) und 11 — DIE GITARRE
   ===================================================================== */
{
  const m = B.mensch({ id: "b24d_gitarrist", geschlecht: "m", alter: "erwachsen", pose: "sitzen", blick: -64, frisur: "locken", haarfarbe: "schwarz", haut: "oliv", laecheln: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "weste", farbe: "schwarz" }, unterteil: { stueck: "anzughose" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 70);
  const fx = KUEBEL.x - 8, fy = KUEBEL.rand - m.z.sitz.y * m.k + 0.6;
  S.teil({ id: "gitarrist", de: "der Gitarrist", syl: "gi-tar-RIST", it: "il chitarrista", itSyl: "chi-tar-RI-sta", en: "guitarist", x: fx, y: fy, kunst: knapp(m.svg),
    tipp: "Die spanische Gitarre klingt beim Flamenco schnell und kräftig." });
  /* Gitarre quer auf dem Schoß, Hals nach vorn links oben */
  const gx = fx + m.z.sitz.x * m.k - 6, gy = fy + m.z.sitz.y * m.k - 7;
  let g = `<g transform="rotate(-24)">`;
  g += `<path d="M-6 0 Q-6 -4.4 -2 -4 Q0 -2.6 2 -4.2 Q7.4 -5 7.4 0 Q7.4 5 2 4.2 Q0 2.6 -2 4 Q-6 4.4 -6 0 Z" fill="${S.lg("decke", [[0, "#f0c77e"], [1, "#c98d3a"]])}" stroke="#5a3418" stroke-width=".5"/>`;
  g += `<circle cx="-1" cy="0" r="1.5" fill="#2a180c"/><circle cx="-1" cy="0" r="2" fill="none" stroke="#8a5a28" stroke-width=".35"/><rect x="2.6" y="-1.6" width="1" height="3.2" fill="#5a3418"/>`;
  g += `<rect x="-19" y="-.8" width="13" height="1.6" fill="#4a2a14"/><path d="M-19 -1.2 L-23 -1.6 L-23 1.6 L-19 1.2 Z" fill="#5a3418"/>`;
  for (const y of [-0.5, 0, 0.5]) g += `<line x1="-22" y1="${y}" x2="3" y2="${y}" stroke="#e8e2d0" stroke-width=".12"/>`;
  g += `</g>`;
  S.teil({ oben: true, id: "gitarre", de: "die Gitarre", syl: "Gi-TAR-re", it: "la chitarra", itSyl: "chi-TAR-ra", en: "guitar", x: gx, y: gy, kunst: g,
    tipp: "Die Gitarre hat sechs Saiten. Sie kommt ursprünglich aus Spanien." });
}

/* =====================================================================
   12 — DIE TÄNZERIN, 13 — DER FÄCHER, 14 — DIE KASTAGNETTEN
   ===================================================================== */
{
  const X = 222, Y = 174;
  const m = B.mensch({ id: "b24d_taenzerin", geschlecht: "w", alter: "erwachsen", pose: "winken", blick: 28, frisur: "dutt", haarfarbe: "schwarz", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#c60b1e" }, kleid: { stueck: "abendkleid", farbe: "#c60b1e" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 64);
  /* Volants am Saum und weiße Tupfen auf dem Rock, Blume im Haar */
  let extra = "";
  const saumY = -1.5;
  for (let i = 0; i < 3; i++) extra += `<path d="M${-10 + i * 0.6} ${r(saumY - i * 3.4)} q2.2 2.4 4.4 0 q2.2 2.4 4.4 0 q2.2 2.4 4.4 0 q2.2 2.4 4.4 0" fill="none" stroke="${i % 2 ? "#f4f1e8" : "#8a0816"}" stroke-width="1.2"/>`;
  for (let i = 0; i < 26; i++) extra += `<circle cx="${r(-7 + rnd() * 14)}" cy="${r(-2 - rnd() * 22)}" r=".55" fill="#f4f1e8"/>`;
  const [sx, sy0] = m.z.punkte.scheitel;
  extra += `<g transform="translate(${r(sx * m.k - 2.6)} ${r(sy0 * m.k + 2.4)})"><circle r="1.6" fill="#e01a2a"/><circle cx="1" cy="-.8" r="1.1" fill="#c60b1e"/><circle cx="-.4" cy="-.4" r=".5" fill="#ffd0d0"/></g>`;
  S.teil({ id: "taenzerin", de: "die Tänzerin", syl: "TÄN-ze-rin", it: "la ballerina", itSyl: "bal-le-RI-na", en: "dancer", x: X, y: Y, kunst: knapp(m.svg) + extra,
    tipp: "Die Tänzerin tanzt Flamenco. Ihr Kleid hat viele Rüschen, die „Volantes“." });
  /* DER FÄCHER — offen in der erhobenen Hand */
  const hoch = [m.z.handL, m.z.handR].sort((a, b) => a.y - b.y)[0], tief = [m.z.handL, m.z.handR].sort((a, b) => b.y - a.y)[0];
  let f = "";
  for (let i = 0; i <= 10; i++) { const a = (-160 + i * 14) * Math.PI / 180; f += `<path d="M0 0 L${r(Math.cos(a) * 9)} ${r(Math.sin(a) * 9)} L${r(Math.cos(a + 0.24) * 9)} ${r(Math.sin(a + 0.24) * 9)} Z" fill="${i % 2 ? "#1d1d1f" : "#2a2a2e"}"/>`; }
  f += `<path d="M${r(Math.cos(-160 * Math.PI / 180) * 9)} ${r(Math.sin(-160 * Math.PI / 180) * 9)} A9 9 0 0 1 ${r(Math.cos(-6 * Math.PI / 180) * 9)} ${r(Math.sin(-6 * Math.PI / 180) * 9)}" stroke="#c60b1e" stroke-width=".9" fill="none"/>`;
  for (let i = 0; i < 5; i++) { const a = (-140 + i * 28) * Math.PI / 180; f += `<circle cx="${r(Math.cos(a) * 6.4)}" cy="${r(Math.sin(a) * 6.4)}" r=".9" fill="#c60b1e"/>`; }
  f += `<circle r=".7" fill="#c9a54a"/>`;
  S.teil({ oben: true, id: "faecher", de: "der Fächer", syl: "FÄ-cher", it: "il ventaglio", itSyl: "ven-TA-glio", en: "fan", x: X + hoch.x * m.k, y: Y + hoch.y * m.k, kunst: f,
    tipp: "Mit dem Fächer macht man sich Wind. Beim Flamenco gehört er zum Tanz." });
  /* DIE KASTAGNETTEN — zwei Holzschalen an der Kordel.
     Silben korrigiert: alt „Ka-sta-GNET-ten“ (Trennung vor 1996), Duden heute „Kas-ta-gnet-ten“. */
  const KAST = S.rg("kast", [[0, "#a8683a"], [1, "#5a2c10"]], 0.4, 0.3);
  let c = `<ellipse cx="-1.3" cy="1.6" rx="1.7" ry="2.2" fill="${KAST}"/><ellipse cx="1.3" cy="1.8" rx="1.7" ry="2.2" fill="${KAST}"/>`;
  c += `<path d="M-1.3 -.4 Q0 -1.6 1.3 -.4" stroke="#c60b1e" stroke-width=".5" fill="none"/><ellipse cx="-1.6" cy="1" rx=".5" ry=".8" fill="#fff" opacity=".35"/>`;
  S.teil({ oben: true, id: "kastagnetten", de: "die Kastagnetten", syl: "Kas-ta-GNET-ten", it: "le nacchere", itSyl: "NAC-che-re", en: "castanets", x: X + tief.x * m.k, y: Y + tief.y * m.k, kunst: c + flaeche(-3.4, -2.4, 6.8, 7),
    tipp: "Die Kastagnetten klappern im Rhythmus der Musik." });
}

/* =====================================================================
   15 — DER STUHL und 16 — DER TISCH (Lupe: Paella, Tapas, Orange,
        Sonnenblume)
   ===================================================================== */
const TI = { x: 166, boden: 190, vorn: 151, hinten: 143, bv: 36, bh: 29 };
{
  const sitz = -22;
  let k = schatten(0, 0.4, 11, 1.6, 0.3);
  k += `<path d="M-8 0 L-7 ${sitz} M8 0 L7 ${sitz} M-5.6 -2.4 L-5 ${sitz} M5.8 -2.4 L5.2 ${sitz}" stroke="${ALU}" stroke-width="1.3"/>`;
  k += `<path d="M-7 ${sitz} L-7.6 ${sitz - 22} M7 ${sitz} L7.6 ${sitz - 22}" stroke="${ALU}" stroke-width="1.3"/>`;
  const TEAK = S.lg("teak", [[0, "#c08a52"], [1, "#8a5a30"]]);
  for (const y of [sitz - 21, sitz - 16, sitz - 11]) k += `<rect x="-7.4" y="${y}" width="15" height="2.6" rx=".6" fill="${TEAK}"/>`;
  k += `<path d="M-9 ${sitz + 1} L9 ${sitz + 1} L7.6 ${sitz - 3} L-7.6 ${sitz - 3} Z" fill="${TEAK}"/>`;
  for (const t of [0.33, 0.66]) k += `<line x1="${r(-9 + 1.4 * t)}" y1="${r(sitz + 1 - 4 * t)}" x2="${r(9 - 1.4 * t)}" y2="${r(sitz + 1 - 4 * t)}" stroke="#6b4422" stroke-width=".4"/>`;
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: 138, y: TI.boden - 4, steht: true, kunst: k });
}
const tischUnter = [];
{
  const X = TI.x, hv = TI.vorn - TI.boden, hh = TI.hinten - TI.boden;
  let k = schatten(0, 0.4, 20, 2, 0.3);
  k += `<path d="M${-TI.bv / 2 + 2} 0 L${-TI.bv / 2 + 2} ${hv + 1} M${TI.bv / 2 - 2} 0 L${TI.bv / 2 - 2} ${hv + 1} M${-TI.bh / 2 + 2} -6 L${-TI.bh / 2 + 2} ${hh} M${TI.bh / 2 - 2} -6 L${TI.bh / 2 - 2} ${hh}" stroke="${ALU}" stroke-width="1.4"/>`;
  k += `<path d="M${-TI.bh / 2} ${hh} L${TI.bh / 2} ${hh} L${TI.bv / 2} ${hv} L${-TI.bv / 2} ${hv} Z" fill="${S.lg("platte", [[0, "#e9ecee"], [1, "#c9ced2"]])}"/>`;
  k += `<rect x="${-TI.bv / 2}" y="${hv}" width="${TI.bv}" height="1.6" fill="#9aa2a8"/>`;
  const top = (t) => hh + (hv - hh) * t;
  const it = [];
  /* DIE SONNENBLUME — zwei Blüten in einer Keramikvase, hinten */
  {
    const x = 10, y = top(0.15);
    let g = `<path d="M${x - 2} ${y} Q${x - 3} ${y - 3} ${x - 1.2} ${y - 5} L${x + 1.2} ${y - 5} Q${x + 3} ${y - 3} ${x + 2} ${y} Z" fill="${S.lg("vase", [[0, "#2a5aa0"], [1, "#1f3f78"]], 0, 0, 1, 0)}"/><path d="M${x - 2} ${y - 2.4} h4" stroke="#e8b93c" stroke-width=".4"/>`;
    for (const [dx, h, a] of [[-2.4, 13, -12], [2.6, 10, 10]]) {
      const bx = x + dx, by = y - 5 - h;
      g += `<path d="M${x} ${y - 5} Q${x + dx * 0.4} ${y - 5 - h * 0.5} ${bx} ${by}" stroke="#4f7d3a" stroke-width=".6" fill="none"/><ellipse cx="${r(x + dx * 0.5)}" cy="${r(y - 5 - h * 0.45)}" rx="1.4" ry=".6" fill="#4f7d3a" transform="rotate(${a} ${r(x + dx * 0.5)} ${r(y - 5 - h * 0.45)})"/>`;
      for (let i = 0; i < 14; i++) { const w = i * Math.PI / 7; g += `<ellipse cx="${r(bx + Math.cos(w) * 2.6)}" cy="${r(by + Math.sin(w) * 2.6)}" rx="1.4" ry=".55" fill="${i % 2 ? "#f6c21a" : "#e8a90e"}" transform="rotate(${Math.round(w * 180 / Math.PI)} ${r(bx + Math.cos(w) * 2.6)} ${r(by + Math.sin(w) * 2.6)})"/>`; }
      g += `<circle cx="${bx}" cy="${by}" r="1.7" fill="${S.rg("korb", [[0, "#6a3a14"], [1, "#3a1e08"]])}"/>`;
    }
    k += g; it.push({ id: "sonnenblume", de: "die Sonnenblume", syl: "SON-nen-blu-me", it: "il girasole", itSyl: "gi-ra-SO-le", en: "sunflower", x, y, kunst: flaeche(-6.4, -22, 13.4, 22),
      tipp: "In Andalusien blühen im Sommer riesige Felder voller Sonnenblumen." });
  }
  /* DIE ORANGE — Glas frischer Orangensaft und eine halbe Orange */
  {
    const x = -10, y = top(0.3);
    let g = `<path d="M${x - 1.8} ${y - 6} L${x + 1.8} ${y - 6} L${x + 1.4} ${y} L${x - 1.4} ${y} Z" fill="#eaf3f5" opacity=".5"/><path d="M${x - 1.7} ${y - 4.6} L${x + 1.7} ${y - 4.6} L${x + 1.4} ${y - 0.2} L${x - 1.4} ${y - 0.2} Z" fill="#f29a1e"/>`;
    g += `<path d="M${x - 1.4} ${y - 5.6} L${x - 1.1} ${y - 0.6}" stroke="#fff" stroke-width=".35" opacity=".7"/>`;
    g += `<circle cx="${x + 5}" cy="${y - 2}" r="2.4" fill="${S.rg("orange", [[0, "#ffc060"], [0.7, "#f08a1e"], [1, "#c9640e"]], 0.35, 0.3)}"/><circle cx="${x + 5.6}" cy="${y - 3}" r=".25" fill="#5a7a2a"/>`;
    g += `<ellipse cx="${x + 9}" cy="${y - 0.6}" rx="2" ry="1" fill="#f6b04a" stroke="#f08a1e" stroke-width=".4"/>`;
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; g += `<line x1="${x + 9}" y1="${y - 0.6}" x2="${r(x + 9 + Math.cos(a) * 1.6)}" y2="${r(y - 0.6 + Math.sin(a) * 0.8)}" stroke="#fde2b0" stroke-width=".2"/>`; }
    k += g; it.push({ id: "orange", de: "die Orange", syl: "O-RAN-ge", it: "l'arancia", itSyl: "a-RAN-cia", en: "orange", x: x + 4, y, kunst: flaeche(-6.2, -6.4, 15.4, 7),
      tipp: "In Spanien presst die Bar die Orangen frisch für den Saft." });
  }
  /* DIE PAELLA — große flache Pfanne mit zwei Griffen */
  {
    const x = -4, y = top(0.86);
    let g = `<ellipse cx="${x}" cy="${y}" rx="11" ry="3.2" fill="#3a3a3c"/><path d="M${x - 11} ${y - 0.4} l-3 -.6 l0 1.4 Z M${x + 11} ${y - 0.4} l3 -.6 l0 1.4 Z" fill="#3a3a3c"/>`;
    g += `<ellipse cx="${x}" cy="${y - 0.6}" rx="10" ry="2.7" fill="${S.rg("reis", [[0, "#f6cf4a"], [0.7, "#e2a826"], [1, "#b8761a"]], 0.5, 0.45)}"/>`;
    for (const [dx, dy] of [[-6, -0.4], [-2, 0.6], [3, -0.8], [6.6, 0.2]]) g += `<path d="M${x + dx - 1.4} ${y - 0.6 + dy} q1.4 -1.8 2.8 0" stroke="#f06a3a" stroke-width="1" fill="none"/>`;
    for (const [dx, dy] of [[-4, -1.2], [1, -1.4], [5, 0.8], [-1, 0.9]]) g += `<ellipse cx="${x + dx}" cy="${y - 0.6 + dy}" rx="1.2" ry=".55" fill="#1d1d2a"/><ellipse cx="${x + dx + 0.3}" cy="${y - 0.7 + dy}" rx=".6" ry=".25" fill="#e8a070"/>`;
    for (const [dx, dy] of [[-7.4, 0.6], [8, -0.6]]) g += `<path d="M${x + dx - 1.4} ${y - 0.6 + dy} l2.8 -.6 l-.6 1.4 Z" fill="#f2e05a"/>`;
    for (let i = 0; i < 8; i++) g += `<circle cx="${r(x - 7 + rnd() * 14)}" cy="${r(y - 0.6 + (rnd() - 0.5) * 3)}" r=".35" fill="#5f9a3a"/>`;
    k += g; it.push({ id: "paella", de: "die Paella", syl: "Pa-EL-la", it: "la paella", itSyl: "pa-EL-la", en: "paella", x, y, kunst: flaeche(-14, -4, 28, 7.4),
      tipp: "Die Paella kommt aus Valencia: Reis mit Safran, Meeresfrüchten oder Huhn." });
  }
  /* DIE TAPAS — kleine Tonschalen und ein Teller mit Tortilla */
  {
    const x = 7, y = top(0.42);
    let g = "";
    for (const [dx, c, art] of [[-4, "#c9341f", "bravas"], [1.6, "#8a9a3a", "oliven"]]) {
      g += `<path d="M${x + dx - 2.6} ${y - 1.4} Q${x + dx} ${y + 0.6} ${x + dx + 2.6} ${y - 1.4} Z" fill="#a8542f"/><ellipse cx="${x + dx}" cy="${y - 1.4}" rx="2.6" ry=".8" fill="#c8693c"/>`;
      if (art === "bravas") for (let i = 0; i < 5; i++) g += `<rect x="${r(x + dx - 1.8 + i * 0.7)}" y="${r(y - 2.6 - (i % 2) * 0.6)}" width="1" height="1" fill="#f2d07a"/>` + `<circle cx="${r(x + dx - 1.2 + i * 0.6)}" cy="${r(y - 2.4)}" r=".3" fill="${c}"/>`;
      else for (let i = 0; i < 6; i++) g += `<ellipse cx="${r(x + dx - 1.6 + i * 0.64)}" cy="${r(y - 1.9 - (i % 2) * 0.4)}" rx=".45" ry=".35" fill="${c}"/>`;
    }
    g += `<ellipse cx="${x + 5.4}" cy="${y + 2}" rx="3.4" ry="1" fill="#f7f6f2" stroke="#d8d4c8" stroke-width=".2"/><path d="M${x + 3.6} ${y + 1.6} L${x + 6.6} ${y + 1.2} L${x + 6.8} ${y + 0.2} L${x + 3.8} ${y + 0.6} Z" fill="#f2c85a"/><path d="M${x + 3.8} ${y + 0.6} L${x + 6.8} ${y + 0.2}" stroke="#b8761a" stroke-width=".35"/>`;
    k += g; it.push({ id: "tapas", de: "die Tapas", syl: "TA-pas", it: "le tapas", itSyl: "TA-pas", en: "tapas", x, y, kunst: flaeche(-7, -3.4, 16, 6.6),
      tipp: "Tapas sind kleine Portionen: Patatas bravas, Oliven, Tortilla …" });
  }
  it.forEach((u) => tischUnter.push(Object.assign(u, { x: X + u.x, y: TI.boden + u.y })));
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: X, y: TI.boden, steht: true, kunst: k,
    zoom: { x: X - 24, y: TI.hinten - 26, w: 48, h: 32 },
    unter: tischUnter });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/spanien.js"));
console.log(aus);
