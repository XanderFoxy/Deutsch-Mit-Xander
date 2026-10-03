#!/usr/bin/env node
/* =====================================================================
   HAMBURG (FASSUNG 852) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (Baunetz Wissen „Elbphilharmonie“, elbphilharmonie.de,
   HHLA Containerterminal Tollerort, hamburg.de „Fischmarkt“):
   - STANDORT: Altonaer Fischmarkt am Sonntagmorgen, an der Kaikante,
     Blick elbaufwärts nach Osten. Echte Richtungen von hier: links über
     St. Pauli der Michel (Hauptkirche St. Michaelis, 132 m), davor die
     Landungsbrücken (grüne Kuppeln, Pegelturm), dahinter fast in
     Blickrichtung die Elbphilharmonie; rechts genau gegenüber am Südufer
     das Containerterminal Tollerort mit Containerbrücken (Kränen), ein
     Containerschiff liegt dort am Kai und wird be- und entladen.
   - ELBPHILHARMONIE: unten der dunkelrote Backstein-Kaispeicher (1966)
     mit kleinen Fensteröffnungen, darüber die „Plaza“-Fuge (37 m),
     darüber der Glasaufbau mit gebogenen, weiß bedruckten Scheiben und
     dem Wellendach — am höchsten (110 m) über der Westspitze.
   - MICHEL: Backsteinturm, oben grün patinierte Kupfergeschosse mit
     weißen Säulen, großer Uhr (größte Turmuhr Deutschlands) und Spitze.
   - HAFEN: Containerbrücken (Portalkran mit Ausleger über dem Schiff,
     Laufkatze mit Spreader, der einen Container hebt), Containerstapel,
     Hafenfähren der HADAG (weiß-grün) auf der Elbe, Möwen.
   - FISCHMARKT: Stände mit Fischbrötchen (Bismarck, Matjes, Krabben),
     Räucheraal, frischer Fisch auf Eis; an der Kaimauer Poller und
     Rettungsringe.
   Maßstab: Augenhöhe y = 110 (≈ 2,5 m). Vorne gilt:
   Einheiten je Meter = (y − 110) · 0,4.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "hamburg", titel: "Hamburg", emoji: "⚓", thema: "Deutschland", kuerzel: "b21d", fassung: 852 });
const rnd = zufall(1189);
const r = B.r;
const HOR = 110;
const km = (y) => (y - HOR) * 0.4;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.2 .5"/></filter>`);
const KUPFER = S.lg("kupfer", [[0, "#4f8a72"], [0.4, "#8cc3aa"], [0.7, "#6aa58b"], [1, "#3e6f5c"]], 0, 0, 1, 0);
const BACKSTEIN = S.lg("backstein", [[0, "#6e2f22"], [0.5, "#8f4430"], [1, "#5c261b"]], 0, 0, 1, 0);
const KRANBLAU = S.lg("kranblau", [[0, "#3f86c4"], [1, "#2a6aa3"]]);
const CFARBEN = ["#2f7fc4", "#e2722d", "#c0392b", "#3c8f5a", "#8a8f94", "#f2c62f", "#1f4f8f", "#d9d4c7", "#7a4f9a", "#b8442e"];

/* =====================================================================
   KULISSE — Himmel mit Wolken, ferne Stadt, ferne Kräne, Kai mit Pflaster
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 3}" fill="${S.lg("himmel", [[0, "#5d8fc4"], [0.55, "#a7c3dd"], [1, "#e7ecee"]])}"/>`);
{
  let w = "";
  for (const [x, y, s, g] of [[40, 18, 1.4, 0], [150, 30, 1.1, 1], [250, 14, 1.3, 0], [300, 44, 0.8, 1], [100, 52, 0.7, 0]]) {
    w += `<g filter="url(#${S.id("wolke")})">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 18, 6], [-12, 2, 12, 5], [12, 1.4, 13, 5.4], [-4, -4.4, 11, 6], [7, -5, 9, 5.4]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="${g ? "#f4f6f8" : "#ffffff"}"/>`;
    w += `<ellipse cx="${x}" cy="${r(y + 4 * s)}" rx="${r(20 * s)}" ry="${r(3 * s)}" fill="#c3ccd6"/></g>`;
  }
  /* zwei Möwen in der Ferne */
  w += `<path d="M120 26 q2 -1.6 4 0 q2 -1.6 4 0" stroke="#5a6068" stroke-width=".5" fill="none"/><path d="M196 58 q1.4 -1.1 2.8 0 q1.4 -1.1 2.8 0" stroke="#5a6068" stroke-width=".4" fill="none"/>`;
  S.hinten(w);
}
{
  let c = "";
  /* St. Pauli und Neustadt im Dunst (links), Südufer flach (rechts) */
  let x = -2;
  while (x < 178) {
    const w = 6 + rnd() * 9, h = 4 + rnd() * 9;
    c += `<rect x="${r(x)}" y="${r(HOR - h)}" width="${r(w + 0.3)}" height="${r(h)}" fill="${rnd() < 0.5 ? "#b9b0a8" : "#a9a6a6"}"/>`;
    for (let i = 1; i < h / 2.2; i++) c += `<rect x="${r(x + 0.8)}" y="${r(HOR - h + i * 2.2)}" width="${r(w - 1.6)}" height=".5" fill="#8a8584" opacity=".5"/>`;
    x += w;
  }
  c += `<rect x="0" y="${HOR - 14}" width="180" height="14" fill="#cdd6de" opacity=".35"/>`;
  /* ferne Containerbrücke rechts hinten */
  c += `<g opacity=".7"><path d="M302 ${HOR - 1} L304 ${HOR - 30} L306 ${HOR - 30} L308 ${HOR - 1} M316 ${HOR - 1} L314 ${HOR - 30} L312 ${HOR - 30}" stroke="#6a8fb3" stroke-width="1" fill="none"/><rect x="286" y="${HOR - 33}" width="40" height="2.2" fill="#6a8fb3"/><path d="M306 ${HOR - 33} L310 ${HOR - 42} L314 ${HOR - 33}" stroke="#6a8fb3" stroke-width=".8" fill="none"/></g>`;
  S.hinten(c);
}
/* Kaimauer und Pflaster des Fischmarkts */
{
  const Y0 = 150;
  let f = `<rect x="0" y="${Y0}" width="320" height="${200 - Y0}" fill="${S.lg("pflaster", [[0, "#9a948b"], [1, "#7f796f"]])}"/>`;
  let y = Y0 + 1, row = 0;
  while (y < 200) {
    const h = 0.9 + (y - HOR) * 0.035, w = h * 1.6;
    for (let x = (row % 2) * w / 2 - w; x < 320; x += w) f += `<rect x="${r(x + 0.2)}" y="${r(y)}" width="${r(w - 0.4)}" height="${r(h - 0.3)}" rx="${r(h * 0.35)}" fill="${["#a7a197", "#9c958b", "#b1aba1", "#928b81"][(row + Math.floor(x / w)) & 3]}"/>`;
    y += h; row++;
  }
  f += `<rect x="0" y="${Y0 - 1.6}" width="320" height="3" fill="${S.lg("kante", [[0, "#d6d0c4"], [1, "#8f897e"]])}"/>`;
  f += `<rect x="0" y="${Y0}" width="320" height="50" fill="${S.lg("pflasterlicht", [[0, "#000", 0.1], [0.4, "#000", 0], [1, "#000", 0.12]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DER MICHEL (Hauptkirche St. Michaelis, links hinten)
   ===================================================================== */
{
  let k = "";
  /* Backsteinschaft */
  k += `<rect x="-6" y="-46" width="12" height="46" fill="${BACKSTEIN}"/>`;
  for (const y of [-8, -20, -32]) k += `<path d="M-1.4 ${y} L-1.4 ${y - 7} Q0 ${y - 9} 1.4 ${y - 7} L1.4 ${y} Z" fill="#2f2a28"/>`;
  k += `<rect x="-6.6" y="-47.6" width="13.2" height="1.8" fill="#d9d1c3"/>`;
  /* Uhrgeschoss (Kupfer, große Uhr mit Gold) */
  k += `<rect x="-5.6" y="-58" width="11.2" height="10.4" fill="${KUPFER}"/>`;
  k += `<circle cx="0" cy="-52.8" r="3.8" fill="#1f2a27" stroke="#d8b04a" stroke-width=".5"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(Math.sin(a) * 3.1)}" y1="${r(-52.8 - Math.cos(a) * 3.1)}" x2="${r(Math.sin(a) * 3.6)}" y2="${r(-52.8 - Math.cos(a) * 3.6)}" stroke="#d8b04a" stroke-width=".3"/>`; }
  k += `<path d="M0 -52.8 L0 -55.6 M0 -52.8 L1.8 -52" stroke="#d8b04a" stroke-width=".45"/>`;
  /* achteckige Kupfergeschosse mit weißen Säulen, Laterne, Spitze, Kreuz */
  k += `<path d="M-5.6 -58 Q-4.6 -61 -4.4 -62 L4.4 -62 Q4.6 -61 5.6 -58 Z" fill="${KUPFER}"/>`;
  k += `<rect x="-4.4" y="-70" width="8.8" height="8" fill="${KUPFER}"/>`;
  for (const x of [-3.6, -1.2, 1.2, 3.6]) k += `<rect x="${x - 0.35}" y="-69.6" width=".7" height="7.4" fill="#f4f1ea"/>`;
  k += `<path d="M-4.6 -70 Q0 -74 4.6 -70 Z" fill="${KUPFER}"/>`;
  k += `<rect x="-2.6" y="-77.6" width="5.2" height="5.2" fill="${KUPFER}"/>`;
  for (const x of [-1.8, 0, 1.8]) k += `<rect x="${x - 0.3}" y="-77.2" width=".6" height="4.4" fill="#f4f1ea"/>`;
  k += `<path d="M-2.8 -77.6 Q0 -81 2.8 -77.6 Z" fill="${KUPFER}"/><rect x="-1.2" y="-82" width="2.4" height="3" fill="${KUPFER}"/>`;
  k += `<path d="M-1.4 -82 L0 -90 L1.4 -82 Z" fill="${KUPFER}"/><path d="M0 -90 L0 -94 M-1 -92.6 L1 -92.6" stroke="#d8b04a" stroke-width=".4"/>`;
  k += `<rect x="-6" y="-46" width="2.6" height="46" fill="#000" opacity=".12"/>`;
  S.teil({ id: "michel", de: "der Michel", syl: "MI-chel", it: "il campanile San Michele", itSyl: "cam-pa-NI-le san mi-CHE-le", en: "St Michael's",
    x: 36, y: HOR - 8, kunst: k, tipp: "Der Michel ist die bekannteste Kirche Hamburgs. Seine Turmuhr ist die größte in Deutschland." });
}

/* =====================================================================
   2 — DIE LANDUNGSBRÜCKEN (Kuppeln und Pegelturm)
   ===================================================================== */
{
  let k = "";
  const SAND = S.lg("tuffstein", [[0, "#d8ccb4"], [1, "#b3a588"]]);
  k += `<rect x="-34" y="-7" width="68" height="7" fill="${SAND}"/>`;
  for (let x = -32; x < 33; x += 3.2) k += `<path d="M${x} -1 L${x} -4.4 Q${x + 0.8} -5.6 ${x + 1.6} -4.4 L${x + 1.6} -1 Z" fill="#4e4a44"/>`;
  k += `<rect x="-35" y="-8.2" width="70" height="1.4" fill="#5c7f72"/>`;
  for (const x of [-16, 10]) {
    k += `<rect x="${x - 4}" y="-13" width="8" height="6" fill="${SAND}"/><path d="M${x - 4.4} -13 Q${x - 4.4} -19 ${x} -19.6 Q${x + 4.4} -19 ${x + 4.4} -13 Z" fill="${KUPFER}"/>`;
    k += `<rect x="${x - 0.5}" y="-21.6" width="1" height="2.2" fill="${KUPFER}"/>`;
  }
  /* Pegelturm mit Uhr (Ostende) */
  k += `<rect x="27" y="-20" width="6" height="13" fill="${SAND}"/><circle cx="30" cy="-16" r="1.8" fill="#f4efe4" stroke="#3a3d42" stroke-width=".25"/>`;
  k += `<path d="M26.4 -20 L30 -26 L33.6 -20 Z" fill="${KUPFER}"/>`;
  /* Pontons und Anleger am Wasser */
  k += `<rect x="-36" y="-.6" width="74" height="1.8" fill="#6a7a74"/>`;
  S.teil({ id: "landungsbruecken", de: "die Landungsbrücken", syl: "LAN-dungs-brü-cken", it: "i pontili di Landungsbrücken", itSyl: "pon-TI-li di LAN-dungs-brü-cken", en: "St Pauli Piers",
    x: 96, y: HOR, kunst: k, tipp: "An den Landungsbrücken fahren die Hafenfähren und Barkassen ab." });
}

/* =====================================================================
   3 — DIE ELBPHILHARMONIE (Backstein-Speicher, Glasaufbau, Wellendach)
   ===================================================================== */
{
  let k = "";
  /* Kaispeicher A: Backstein mit Fensterraster */
  k += `<path d="M-22 0 L-22 -15 L22 -15 L24 0 Z" fill="${BACKSTEIN}"/>`;
  for (let y = -13.6; y < -1; y += 1.7) for (let x = -20.6; x < 22; x += 2.1) k += `<rect x="${r(x)}" y="${r(y)}" width=".9" height=".7" fill="#3a1c14"/>`;
  /* Plaza-Fuge */
  k += `<rect x="-22.5" y="-17.2" width="45" height="2.2" fill="#1f2730"/><rect x="-22.5" y="-17.2" width="45" height=".5" fill="#d9e6ee" opacity=".6"/>`;
  /* Glasaufbau mit Wellendach: steigt nach rechts zur Westspitze (110 m) */
  const dach = `M-22.5 -17.2 L-22.5 -31 Q-18 -37 -13 -32.6 Q-8 -28.6 -3 -34.4 Q2 -40.4 7 -36 Q12 -32 16 -40 Q19 -46.4 22.5 -47.6 L22.5 -17.2 Z`;
  k += `<path d="${dach}" fill="${S.lg("glas", [[0, "#9fbdd3"], [0.35, "#5f86a6"], [0.6, "#8eb0c9"], [1, "#c9dceb"]], 0, 0, 1, 1)}"/>`;
  k += `<path d="${dach}" fill="${S.lg("glaslicht", [[0, "#fff", 0.35], [0.5, "#fff", 0], [1, "#fff", 0.2]], 0, 0, 0, 1)}"/>`;
  /* gebogene, bedruckte Scheiben als Raster mit Lichtpunkten */
  S.def(`<clipPath id="${S.id("glasform")}"><path d="${dach}"/></clipPath>`);
  k += `<g clip-path="url(#${S.id("glasform")})">`;
  for (let y = -19; y > -47; y -= 2.4) k += `<line x1="-22.5" y1="${r(y)}" x2="22.5" y2="${r(y)}" stroke="#e9f2f8" stroke-width=".22" opacity=".7"/>`;
  for (let x = -21; x < 22.5; x += 2.6) k += `<line x1="${r(x)}" y1="-17.2" x2="${r(x)}" y2="-48" stroke="#6f8da3" stroke-width=".15" opacity=".6"/>`;
  for (let i = 0; i < 14; i++) { const x = -19 + (i % 7) * 6 + (Math.floor(i / 7) ? 3 : 0), y = -22 - Math.floor(i / 7) * 6; k += `<path d="M${x - 1} ${y} Q${x} ${y - 2.4} ${x + 1} ${y}" stroke="#fff" stroke-width=".5" fill="none" opacity=".75"/>`; }
  k += `</g>`;
  k += `<path d="M-22.5 -31 Q-18 -37 -13 -32.6 Q-8 -28.6 -3 -34.4 Q2 -40.4 7 -36 Q12 -32 16 -40 Q19 -46.4 22.5 -47.6 L22.5 -45.4 Q19 -44.4 16 -38.2 Q12 -30.2 7 -34.2 Q2 -38.6 -3 -32.6 Q-8 -26.8 -13 -30.8 Q-18 -35 -22.5 -29.2 Z" fill="${S.lg("dachweiss", [[0, "#ffffff"], [1, "#d9e2e8"]])}"/>`;
  k += `<path d="M10 -20 L20 -44 L22.5 -44 L22.5 -20 Z" fill="#fff" opacity=".18"/>`;
  /* die Spitze vorne: Kante, Schatten auf der linken Seite */
  k += `<path d="M-22.5 -15 L-22.5 -31 L-18 -34 L-18 -15 Z" fill="#000" opacity=".1"/>`;
  S.teil({ id: "elbphilharmonie", de: "die Elbphilharmonie", syl: "ELB-phil-har-mo-nie", it: "l'Elbphilharmonie", itSyl: "elb-fil-ar-mo-NI-e", en: "Elbphilharmonie",
    x: 154, y: HOR - 1, kunst: k, tipp: "Die Elbphilharmonie ist ein Konzerthaus — unten ein alter Speicher, oben eine Welle aus Glas." });
}

/* =====================================================================
   4 — DER HAFEN (Containerterminal am Südufer, rechts)
   ===================================================================== */
{
  let k = `<rect x="178" y="${HOR - 4}" width="142" height="7" fill="${S.lg("kai", [[0, "#9b9790"], [1, "#77736c"]])}"/>`;
  for (let i = 0; i < 26; i++) {
    const x = 180 + (i % 13) * 10.6, y = HOR - 4 - Math.floor(i / 13) * 3;
    for (let j = 0; j < 2; j++) k += `<rect x="${r(x + j * 5)}" y="${r(y - 3)}" width="4.8" height="2.9" fill="${CFARBEN[(i * 3 + j) % 10]}" opacity=".9"/>`;
  }
  /* Van-Carrier (Portalhubwagen) */
  for (const x of [190, 236]) k += `<path d="M${x} ${HOR - 4} L${x} ${HOR - 13} L${x + 6} ${HOR - 13} L${x + 6} ${HOR - 4}" stroke="#d8443a" stroke-width=".8" fill="none"/><rect x="${x + 4}" y="${HOR - 15}" width="2.4" height="2" fill="#d8443a"/>`;
  k += `<rect x="178" y="${HOR + 2}" width="142" height="1.2" fill="#4b4740"/>`;
  S.teil({ id: "hafen", de: "der Hafen", syl: "HA-fen", it: "il porto", itSyl: "POR-to", en: "harbour", x: 0, y: 0, kunst: k,
    tipp: "Der Hamburger Hafen ist der größte Hafen in Deutschland." });
}

/* =====================================================================
   5 — DER KRAN (Containerbrücke) und 6 — DAS CONTAINERSCHIFF am Kai
       7 — DER CONTAINER am Spreader
   ===================================================================== */
const KRAN = { x: 262, y: HOR + 1 };
{
  let k = "";
  /* Portal mit zwei Beinpaaren, Ausleger weit über das Schiff nach links */
  k += `<path d="M-12 0 L-10 -36 L-7 -36 L-9 0 Z M12 0 L10 -36 L7 -36 L9 0 Z" fill="${KRANBLAU}"/>`;
  k += `<rect x="-12" y="-22" width="24" height="2" fill="${KRANBLAU}"/><rect x="-11" y="-8" width="22" height="1.4" fill="${KRANBLAU}"/>`;
  k += `<path d="M-10 -22 L10 -8 M10 -22 L-10 -8" stroke="#2a6aa3" stroke-width=".5"/>`;
  k += `<rect x="-66" y="-39.6" width="90" height="3.6" fill="${KRANBLAU}"/>`;
  for (let x = -64; x < 24; x += 3.4) k += `<path d="M${x} -36 L${r(x + 1.7)} -39.6 L${r(x + 3.4)} -36" stroke="#1f5a8f" stroke-width=".3" fill="none"/>`;
  /* A-Rahmen mit Abspannseilen */
  k += `<path d="M-8 -39.6 L0 -56 L8 -39.6" stroke="${KRANBLAU}" stroke-width="1.4" fill="none"/>`;
  k += `<path d="M0 -56 L-64 -39.6 M0 -56 L-36 -39.6 M0 -56 L22 -39.6" stroke="#4d6f8f" stroke-width=".3"/>`;
  /* Maschinenhaus und Fahrerkabine */
  k += `<rect x="8" y="-45" width="14" height="5.4" fill="#e9edf0"/><rect x="9" y="-44" width="12" height="1.2" fill="#2a6aa3"/>`;
  /* Laufkatze */
  k += `<rect x="-44" y="-36.4" width="6" height="2.4" fill="#e9edf0"/><rect x="-43" y="-34" width="4" height="2" fill="#2e4658"/>`;
  k += `<text x="-6" y="-37" font-size="2.2" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">HAFEN HAMBURG</text>`;
  S.teil({ id: "kran", de: "der Kran", syl: "KRAN", it: "la gru", itSyl: "GRU", en: "crane", x: KRAN.x, y: KRAN.y, kunst: k,
    tipp: "Die Containerbrücke hebt die Container vom Schiff — in zwei Minuten einen." });
}
{
  let k = schatten(0, 0.4, 70, 1.6, 0.25);
  /* Rumpf: dunkelblau, roter Unterwasseranstrich, Bug links */
  k += `<path d="M-70 -9 L66 -9 L68 -2 Q66 .4 62 .4 L-62 .4 Q-68 0 -70 -9 Z" fill="${S.lg("rumpf", [[0, "#26324a"], [0.75, "#1b2436"], [0.76, "#a3201f"], [1, "#7d1616"]])}"/>`;
  k += `<rect x="-68" y="-9.6" width="134" height=".7" fill="#e9e5da"/>`;
  k += `<text x="-58" y="-3.6" font-size="2.6" fill="#f4f1ea" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".3">ELBE STAR</text>`;
  /* Containerstapel in Reihen (Bays) */
  for (let b = 0; b < 16; b++) {
    const x = -64 + b * 7.4;
    if (b === 12) continue;
    const hoch = 4 + ((b * 5) % 3);
    for (let j = 0; j < hoch; j++) {
      const f = CFARBEN[(b * 7 + j * 3) % 10];
      k += `<rect x="${r(x)}" y="${r(-9.6 - (j + 1) * 2.6)}" width="7.1" height="2.5" fill="${f}"/>`;
      k += `<rect x="${r(x)}" y="${r(-9.6 - (j + 1) * 2.6)}" width="7.1" height=".5" fill="#fff" opacity=".18"/>`;
    }
    for (let j = 1; j < 5; j++) k += `<line x1="${r(x + j * 1.42)}" y1="-9.8" x2="${r(x + j * 1.42)}" y2="${r(-9.6 - hoch * 2.6)}" stroke="#000" stroke-width=".12" opacity=".25"/>`;
  }
  /* Brückenhaus (Deckshaus) mit Schornstein */
  const bx = -64 + 12 * 7.4;
  k += `<rect x="${r(bx)}" y="-30" width="7.4" height="20.4" fill="#f4f1ea"/>`;
  for (let y = -28; y < -11; y += 2.6) k += `<rect x="${r(bx + 0.8)}" y="${y}" width="5.8" height="1" fill="#3d4f5e"/>`;
  k += `<rect x="${r(bx - 3)}" y="-31.4" width="13.4" height="1.6" fill="#f4f1ea"/><rect x="${r(bx - 2.6)}" y="-31" width="12.6" height=".7" fill="#2e4658"/>`;
  k += `<rect x="${r(bx + 7.6)}" y="-27" width="3.4" height="9" fill="#e2722d"/><rect x="${r(bx + 7.6)}" y="-27" width="3.4" height="1.2" fill="#1d1d1d"/>`;
  k += `<line x1="${r(bx + 3.7)}" y1="-31.4" x2="${r(bx + 3.7)}" y2="-35" stroke="#8a8f94" stroke-width=".3"/>`;
  S.teil({ id: "containerschiff", de: "das Containerschiff", syl: "Con-TAI-ner-schiff", it: "la nave portacontainer", itSyl: "NA-ve por-ta-con-TAI-ner", en: "container ship",
    x: 250, y: HOR + 7, kunst: k, tipp: "Große Containerschiffe sind fast 400 Meter lang." });
}
{
  /* der Container hängt am Spreader unter der Laufkatze */
  const cx = KRAN.x - 41, cy = HOR - 13;
  let k = `<line x1="-1.6" y1="${r(KRAN.y - 34 - cy)}" x2="-1.6" y2="-3.4" stroke="#2a2d31" stroke-width=".25"/><line x1="1.6" y1="${r(KRAN.y - 34 - cy)}" x2="1.6" y2="-3.4" stroke="#2a2d31" stroke-width=".25"/>`;
  k += `<rect x="-4.2" y="-3.6" width="8.4" height="1" fill="#f2c62f"/>`;
  k += `<rect x="-3.8" y="-2.6" width="7.6" height="3" fill="${S.lg("box", [[0, "#e2722d"], [1, "#b8541c"]])}"/>`;
  for (let i = 1; i < 6; i++) k += `<line x1="${r(-3.8 + i * 1.27)}" y1="-2.4" x2="${r(-3.8 + i * 1.27)}" y2=".2" stroke="#8a3c10" stroke-width=".18"/>`;
  S.teil({ oben: true, id: "container", de: "der Container", syl: "Con-TAI-ner", it: "il container", itSyl: "con-TAI-ner", en: "container", x: cx, y: cy, kunst: k,
    tipp: "Ein Container ist eine große Kiste aus Stahl — 6 oder 12 Meter lang." });
}

/* =====================================================================
   8 — DIE ELBE
   ===================================================================== */
{
  const Y0 = HOR + 3, Y1 = 150;
  let k = `<rect x="0" y="${Y0}" width="320" height="${Y1 - Y0}" fill="${S.lg("wasser", [[0, "#9fb1b8"], [0.4, "#73878f"], [1, "#4b5d63"]])}"/>`;
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".28"><rect x="182" y="${Y0}" width="134" height="12" fill="#1b2436"/><rect x="132" y="${Y0}" width="46" height="8" fill="#8fb2cc"/><rect x="30" y="${Y0}" width="12" height="14" fill="#5a3a2a"/></g>`;
  for (let i = 0; i < 150; i++) {
    const y = Y0 + 1 + Math.pow(rnd(), 0.75) * (Y1 - Y0 - 2), w = 1.2 + (y - Y0) * 0.22 * rnd() + 1;
    k += `<path d="M${r(rnd() * 320)} ${r(y)} q${r(w / 2)} -.5 ${r(w)} 0" stroke="${rnd() < 0.55 ? "#e9eff1" : "#33434a"}" stroke-width="${r(0.15 + (y - Y0) * 0.009)}" fill="none" opacity="${r(0.3 + rnd() * 0.4)}"/>`;
  }
  S.teil({ id: "elbe", de: "die Elbe", syl: "EL-be", it: "l'Elba", itSyl: "EL-ba", en: "the Elbe", x: 0, y: 0, kunst: k,
    tipp: "Über die Elbe fahren die Schiffe von der Nordsee bis in den Hamburger Hafen." });
}

/* =====================================================================
   9 — DIE FÄHRE (HADAG-Hafenfähre, weiß-grün)
   ===================================================================== */
{
  let k = schatten(0, 0, 20, 1, 0.25);
  k += `<path d="M-24 .2 q-5 .6 -10 0 M22 .4 q6 .6 12 0" stroke="#eef3f4" stroke-width=".5" fill="none" opacity=".8"/>`;
  k += `<path d="M-22 -4 L21 -4 L22 -1 Q21 .4 19 .4 L-18 .4 Q-21 .2 -22 -4 Z" fill="${S.lg("faehrrumpf", [[0, "#2f6b4a"], [1, "#1f4a33"]])}"/>`;
  k += `<rect x="-20" y="-4.6" width="40" height=".8" fill="#f2f4f2"/>`;
  k += `<path d="M-17 -4.6 L-15 -9.6 L17 -9.6 L18 -4.6 Z" fill="#f6f8f6"/>`;
  for (let x = -14; x < 16; x += 3) k += `<rect x="${x}" y="-8.8" width="2.4" height="2.6" rx=".3" fill="#3d5566"/>`;
  k += `<rect x="-6" y="-12.8" width="9" height="3.2" fill="#f6f8f6"/><rect x="-5.4" y="-12.2" width="7.8" height="1.4" fill="#2e4658"/>`;
  k += `<rect x="4" y="-12.4" width="2" height="2.8" fill="#f2c62f"/><rect x="4" y="-12.4" width="2" height=".8" fill="#1d1d1d"/>`;
  k += `<text x="0" y="-1.2" font-size="1.9" text-anchor="middle" fill="#f2f4f2" font-family="Arial,sans-serif" font-weight="bold">HADAG 62</text>`;
  S.teil({ id: "faehre", de: "die Fähre", syl: "FÄH-re", it: "il traghetto", itSyl: "tra-GHET-to", en: "ferry", x: 150, y: 133, kunst: k,
    tipp: "Mit der Hafenfähre fährt man in Hamburg wie mit dem Bus — nur auf dem Wasser." });
}

/* =====================================================================
   10 — DER RETTUNGSRING und 11 — DER POLLER mit 12 — DER MÖWE
   ===================================================================== */
{
  const Y = 160, s = km(Y);
  let k = schatten(0, 0.3, 4, 1, 0.3);
  k += `<rect x="-1" y="${r(-1.6 * s)}" width="2" height="${r(1.6 * s)}" fill="${S.lg("pfosten", [[0, "#4f565b"], [0.4, "#9aa2a8"], [1, "#454b50"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-1.6" y="${r(-1.5 * s - 0.6)}" width="3.2" height="1.4" rx=".4" fill="#3d4347"/>`;
  const R = 0.36 * s, cy = -1.5 * s + 5.8;
  k += `<circle cx="0" cy="${r(cy)}" r="${r(R)}" fill="none" stroke="#f04a2a" stroke-width="${r(R * 0.5)}"/>`;
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; k += `<path d="M${r(Math.cos(a - 0.22) * R)} ${r(cy + Math.sin(a - 0.22) * R)} A${r(R)} ${r(R)} 0 0 1 ${r(Math.cos(a + 0.22) * R)} ${r(cy + Math.sin(a + 0.22) * R)}" stroke="#fff" stroke-width="${r(R * 0.52)}" fill="none"/>`; }
  k += `<circle cx="0" cy="${r(cy)}" r="${r(R * 1.26)}" fill="none" stroke="#fff" stroke-width=".25" stroke-dasharray="1 1" opacity=".8"/>`;
  S.teil({ id: "rettungsring", de: "der Rettungsring", syl: "RET-tungs-ring", it: "il salvagente", itSyl: "sal-va-GEN-te", en: "lifebuoy", x: 206, y: Y, steht: true, kunst: k });
}
const POLLER = { x: 268, y: 164 };
{
  const s = km(POLLER.y);
  let k = schatten(0, 0.4, 0.4 * s + 2, 1.4, 0.4);
  const W = 0.36 * s, H = 0.55 * s;
  k += `<path d="M${r(-W / 2)} 0 L${r(-W / 2)} ${r(-H * 0.7)} Q${r(-W / 2)} ${r(-H)} ${r(-W * 0.62)} ${r(-H)} L${r(W * 0.62)} ${r(-H)} Q${r(W / 2)} ${r(-H)} ${r(W / 2)} ${r(-H * 0.7)} L${r(W / 2)} 0 Z" fill="${S.lg("poller", [[0, "#2a2d31"], [0.4, "#5c636a"], [1, "#1d2023"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="${r(-H)}" rx="${r(W * 0.62)}" ry="${r(W * 0.2)}" fill="#3a3f44"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-H * 0.36)}" width="${r(W)}" height="1" fill="#14161a" opacity=".6"/>`;
  /* dickes Tau um den Poller (eine Barkasse liegt hier fest) */
  k += `<path d="M${r(-W / 2 - 0.4)} ${r(-H * 0.5)} Q0 ${r(-H * 0.36)} ${r(W / 2 + 0.4)} ${r(-H * 0.5)} Q${r(-W * 1.4)} ${r(-H * 0.2)} -22 -13.4" stroke="#d8c08a" stroke-width="1.1" fill="none"/>`;
  S.teil({ id: "poller", de: "der Poller", syl: "POL-ler", it: "la bitta", itSyl: "BIT-ta", en: "bollard", x: POLLER.x, y: POLLER.y, steht: true, kunst: k,
    tipp: "Am Poller macht man die Schiffe mit einem Tau fest." });
}
{
  /* Möwe sitzt oben auf dem Poller */
  const s = km(POLLER.y) / 18;
  let k = `<path d="M${r(-5 * s)} ${r(-3 * s)} Q${r(-2 * s)} ${r(-6 * s)} ${r(3 * s)} ${r(-5 * s)} L${r(6.4 * s)} ${r(-6 * s)} Q${r(4.4 * s)} ${r(-3 * s)} ${r(1.6 * s)} ${r(-1.6 * s)} Q${r(-2 * s)} ${r(-0.6 * s)} ${r(-5 * s)} ${r(-3 * s)} Z" fill="#fbfbf8" stroke="#b9bec4" stroke-width=".2"/>`;
  k += `<path d="M${r(-5.4 * s)} ${r(-3.1 * s)} Q${r(-1 * s)} ${r(-5 * s)} ${r(3.4 * s)} ${r(-3.4 * s)} Q${r(-1 * s)} ${r(-2.6 * s)} ${r(-5.4 * s)} ${r(-3.1 * s)} Z" fill="#a9b0b8"/>`;
  k += `<path d="M${r(-6.6 * s)} ${r(-3.4 * s)} L${r(-5 * s)} ${r(-3.2 * s)} L${r(-5.2 * s)} ${r(-2.5 * s)} Z" fill="#1d1d1d"/>`;
  k += `<circle cx="${r(3.6 * s)}" cy="${r(-6.6 * s)}" r="${r(1.6 * s)}" fill="#fbfbf8"/><circle cx="${r(4.1 * s)}" cy="${r(-6.9 * s)}" r="${r(0.25 * s)}" fill="#1d1d1d"/>`;
  k += `<path d="M${r(5 * s)} ${r(-6.6 * s)} l${r(1.8 * s)} ${r(0.3 * s)} l${r(-1.8 * s)} ${r(0.5 * s)} Z" fill="#f2c62f"/><circle cx="${r(6.3 * s)}" cy="${r(-6.2 * s)}" r="${r(0.2 * s)}" fill="#d8443a"/>`;
  k += `<path d="M${r(-0.4 * s)} ${r(-1.2 * s)} L${r(-0.6 * s)} 0 M${r(1.2 * s)} ${r(-1.4 * s)} L${r(1.2 * s)} 0" stroke="#e8b06a" stroke-width="${r(0.35 * s)}"/>`;
  S.teil({ oben: true, id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: POLLER.x, y: POLLER.y - 0.55 * km(POLLER.y) - 0.6, kunst: k,
    tipp: "Am Fischmarkt warten die Möwen auf ein Stück Fischbrötchen." });
}

/* =====================================================================
   13 — DER FISCHMARKT (Fischbrötchen-Stand) — Lupe: Fischbrötchen,
        Aal, Krabben, Fisch;  14 — DER FISCHHÄNDLER
   ===================================================================== */
const STAND = { x: 54, y: 192 };
const SS = km(STAND.y), THEKE = STAND.y - 1.0 * SS;
const fischUnter = [];
{
  const W = 3 * SS, oy = -2.45 * SS, ty = THEKE - STAND.y;
  let k = schatten(0, 0.6, W / 2 + 4, 2.4, 0.4);
  /* Rückwand und Pfosten */
  k += `<rect x="${r(-W / 2 + 2)}" y="${r(oy + 6)}" width="${r(W - 4)}" height="${r(ty - oy - 6)}" fill="${S.lg("rueck", [[0, "#e6eef2"], [1, "#c7d3da"]])}"/>`;
  for (let y = oy + 8; y < ty; y += 2.6) k += `<line x1="${r(-W / 2 + 2)}" y1="${r(y)}" x2="${r(W / 2 - 2)}" y2="${r(y)}" stroke="#b7c4cc" stroke-width=".2"/>`;
  for (const x of [-W / 2 + 1, W / 2 - 1]) k += `<rect x="${r(x - 1)}" y="${r(oy)}" width="2" height="${r(-oy)}" fill="#e9ecee"/>`;
  /* Markise blau-weiß mit Volant und Schild */
  for (let i = 0; i < 12; i++) { const x0 = -W / 2 - 2 + i * (W + 4) / 12; k += `<path d="M${r(x0)} ${r(oy)} L${r(x0 + (W + 4) / 12)} ${r(oy)} L${r(x0 + (W + 4) / 12 + (x0 + (W + 4) / 24) * 0.05)} ${r(oy + 7)} L${r(x0 + x0 * 0.05)} ${r(oy + 7)} Z" fill="${i % 2 ? "#f4f6f8" : "#1f5a9f"}"/>`; }
  for (let i = 0; i < 12; i++) { const w = (W + 4) * 1.05 / 12, x = -(W + 4) * 1.05 / 2 + i * w; k += `<path d="M${r(x)} ${r(oy + 7)} q${r(w / 2)} 2.2 ${r(w)} 0" fill="${i % 2 ? "#f4f6f8" : "#1f5a9f"}"/>`; }
  k += `<rect x="${r(-W / 2 - 2)}" y="${r(oy - 8)}" width="${r(W + 4)}" height="8" rx="1" fill="${S.lg("schild", [[0, "#1f5a9f"], [1, "#163f70"]])}"/>`;
  k += `<text x="0" y="${r(oy - 2.4)}" font-size="5" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-weight="bold" letter-spacing=".4">FISCHBRÖTCHEN</text>`;
  /* Räucheraale hängen an der Stange */
  k += `<line x1="${r(-W / 2 + 4)}" y1="${r(oy + 10)}" x2="${r(-W / 2 + 26)}" y2="${r(oy + 10)}" stroke="#7a7f86" stroke-width=".6"/>`;
  for (let i = 0; i < 6; i++) { const x = -W / 2 + 6 + i * 3.6; k += `<path d="M${r(x)} ${r(oy + 10)} q-1.2 6 .4 12 q.6 2.4 -.4 4" stroke="${S.lg("aal", [[0, "#c88a3a"], [1, "#7a4a1a"]], 0, 0, 1, 0)}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`; }
  /* Preistafel */
  k += `<rect x="${r(W / 2 - 30)}" y="${r(oy + 9)}" width="26" height="15" rx=".6" fill="#22302a"/>`;
  for (const [i, t] of ["Bismarck … 3,50", "Matjes … 4,00", "Krabben … 7,50", "Aal 100 g … 6,00"].entries()) k += `<text x="${r(W / 2 - 28.6)}" y="${r(oy + 13 + i * 3)}" font-size="2" fill="#f4f0e6" font-family="Arial,sans-serif">${t}</text>`;
  /* Theke: gekühlte Auslage mit Eis */
  k += `<rect x="${r(-W / 2)}" y="${r(ty - 7)}" width="${r(W)}" height="7" fill="${S.lg("eis", [[0, "#f4f8fa"], [1, "#d6e2e8"]])}"/>`;
  for (let i = 0; i < 40; i++) k += `<circle cx="${r(-W / 2 + 1 + rnd() * (W - 2))}" cy="${r(ty - 1 - rnd() * 5)}" r="${r(0.3 + rnd() * 0.5)}" fill="#fff" opacity=".9"/>`;
  /* Ware in der Auslage */
  const ware = (x, art) => {
    let g = "";
    if (art === "broetchen") {
      for (let i = 0; i < 3; i++) {
        const bx = x - 7 + i * 7;
        g += `<ellipse cx="${bx}" cy="${r(ty - 2)}" rx="3.2" ry="1.4" fill="#e3b064"/>`;
        g += `<path d="M${bx - 3.2} ${r(ty - 3)} q3.2 -1 6.4 0" stroke="${i === 0 ? "#c9d6dc" : i === 1 ? "#b84a3a" : "#f0a58a"}" stroke-width="1.2" fill="none"/>`;
        g += `<path d="M${bx - 2.8} ${r(ty - 3.8)} q2.8 -.6 5.6 0" stroke="#7fb04a" stroke-width=".6" fill="none"/>`;
        g += `<ellipse cx="${bx}" cy="${r(ty - 4.8)}" rx="3.2" ry="1.4" fill="#e9b96e"/><ellipse cx="${bx - 0.8}" cy="${r(ty - 5.2)}" rx="1.2" ry=".4" fill="#fff" opacity=".35"/>`;
      }
    } else if (art === "krabben") {
      g += `<ellipse cx="${x}" cy="${r(ty - 1.6)}" rx="7" ry="1.6" fill="#f6f6f2"/>`;
      for (let i = 0; i < 26; i++) g += `<path d="M${r(x - 5.6 + rnd() * 11)} ${r(ty - 2 - rnd() * 1.8)} q.6 -.7 1.1 0" stroke="#f08a6a" stroke-width=".55" fill="none"/>`;
    } else if (art === "fisch") {
      for (let i = 0; i < 3; i++) {
        const fx = x - 4 + i * 4, fy = ty - 2 - i * 0.6;
        g += `<path d="M${r(fx - 6)} ${r(fy)} Q${r(fx)} ${r(fy - 2.4)} ${r(fx + 5)} ${r(fy)} L${r(fx + 7)} ${r(fy - 1.4)} L${r(fx + 7)} ${r(fy + 1.4)} L${r(fx + 5)} ${r(fy)} Q${r(fx)} ${r(fy + 2)} ${r(fx - 6)} ${r(fy)} Z" fill="${S.lg("fisch", [[0, "#5d6f7d"], [0.5, "#c9d3da"], [1, "#eef2f4"]])}"/>`;
        g += `<circle cx="${r(fx - 4.4)}" cy="${r(fy - 0.4)}" r=".45" fill="#1d1d1d"/><path d="M${r(fx - 3)} ${r(fy - 1)} q.6 1 0 2" stroke="#7d8a94" stroke-width=".25" fill="none"/>`;
      }
    } else if (art === "aal") {
      for (let i = 0; i < 3; i++) g += `<path d="M${r(x - 8)} ${r(ty - 1.6 - i * 1.4)} q8 -2.2 16 0" stroke="${S.lg("aal2", [[0, "#d29a4a"], [1, "#8a5a24"]])}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    }
    return g;
  };
  const posten = [
    { id: "fischbroetchen", de: "das Fischbrötchen", syl: "FISCH-bröt-chen", it: "il panino col pesce", itSyl: "pa-NI-no col PE-sce", en: "fish sandwich", art: "broetchen", x: -28, tipp: "Ein Brötchen mit Hering und Zwiebeln heißt „Bismarck“." },
    { id: "krabben", de: "die Krabben", syl: "KRAB-ben", it: "i gamberetti", itSyl: "gam-be-RET-ti", en: "shrimps", art: "krabben", x: -9, tipp: "Nordseekrabben sind klein und rosa." },
    { id: "aal", de: "der Aal", syl: "AAL", it: "l'anguilla", itSyl: "an-GUIL-la", en: "eel", art: "aal", x: 10, tipp: "Der Aal wird geräuchert und dann gegessen." },
    { id: "fisch", de: "der Fisch", syl: "FISCH", it: "il pesce", itSyl: "PE-sce", en: "fish", art: "fisch", x: 32 },
  ];
  for (const p of posten) {
    k += ware(p.x, p.art);
    k += `<rect x="${p.x - 3}" y="${r(ty - 0.4)}" width="6" height="2.4" rx=".3" fill="#fffdf4" stroke="#9e8a62" stroke-width=".15"/>`;
    fischUnter.push({ id: p.id, de: p.de, syl: p.syl, it: p.it, itSyl: p.itSyl, en: p.en, tipp: p.tipp, x: STAND.x + p.x, y: THEKE, kunst: flaeche(-9, -7.4, 18, 7.6) });
  }
  /* Glasschutz und Front */
  k += `<rect x="${r(-W / 2)}" y="${r(ty - 9)}" width="${r(W)}" height="1" fill="#dfe9ee" opacity=".7"/>`;
  k += `<rect x="${r(-W / 2 - 1)}" y="${r(ty)}" width="${r(W + 2)}" height="1.6" fill="#c9cfd4"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(ty + 1.6)}" width="${r(W)}" height="${r(-ty - 1.6)}" fill="${S.lg("standfront", [[0, "#c79a62"], [1, "#9c6e3a"]])}"/>`;
  for (let x = -W / 2 + 3; x < W / 2; x += 3.4) k += `<line x1="${r(x)}" y1="${r(ty + 1.8)}" x2="${r(x)}" y2="-1" stroke="#7d552b" stroke-width=".35"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(ty + 6)}" width="${r(W)}" height="5" fill="#1f5a9f"/>`;
  k += `<text x="0" y="${r(ty + 9.8)}" font-size="3.2" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".4">FRISCH VOM KUTTER</text>`;
  /* Fischkisten mit Eis vor dem Stand */
  for (const [x, y, n] of [[-W / 2 + 4, 0, 0], [-W / 2 + 4, -6.2, 1], [-W / 2 + 22, 0, 2]]) {
    k += `<rect x="${r(x)}" y="${r(y - 6)}" width="16" height="6" rx=".4" fill="${S.lg("kiste", [[0, "#f6f8f9"], [1, "#d0d8dd"]])}" stroke="#aab4ba" stroke-width=".25"/>`;
    k += `<text x="${r(x + 8)}" y="${r(y - 2.2)}" font-size="2" text-anchor="middle" fill="#1f5a9f" font-family="Arial,sans-serif" font-weight="bold">${["SCHOLLE", "HERING", "DORSCH"][n]}</text>`;
  }
  k += `<path d="M${r(W / 2 - 22)} ${r(ty + 20)} l4 -2.4 l0 4.8 Z M${r(W / 2 - 18)} ${r(ty + 20)} q6 -4 12 0 q-6 4 -12 0 Z" fill="#1f5a9f"/><circle cx="${r(W / 2 - 9)}" cy="${r(ty + 19.6)}" r=".6" fill="#fff"/>`;
  S.teil({ id: "fischmarkt", de: "der Fischmarkt", syl: "FISCH-markt", it: "il mercato del pesce", itSyl: "mer-CA-to del PE-sce", en: "fish market", x: STAND.x, y: STAND.y, steht: true, kunst: k,
    tipp: "Der Fischmarkt ist jeden Sonntag ganz früh am Morgen.",
    zoom: { x: STAND.x - W / 2 - 2, y: THEKE - 22, w: W + 4, h: 30 },
    unter: fischUnter });
  S.davor(`<path d="M${r(STAND.x - W / 2 + 4)} ${r(THEKE - 1)} L${r(STAND.x - W / 2 + 10)} ${r(THEKE - 9)} L${r(STAND.x - W / 2 + 14)} ${r(THEKE - 9)} L${r(STAND.x - W / 2 + 8)} ${r(THEKE - 1)} Z" fill="#fff" opacity=".18"/>`);
}
{
  /* Der Fischhändler hinter der Auslage (nur oberhalb der Theke gezeichnet) */
  const Y = STAND.y - 5;
  const m = B.mensch({ id: "b21d_haendler", geschlecht: "m", pose: "zeigen", blick: 20, frisur: "kurz", haarfarbe: "grau", haut: "hell", bart: "voll", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "blau" }, schuerze: { stueck: "schuerze", farbe: "weiss" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "gummistiefel", farbe: "gelb" }, kopf: { stueck: "muetze", farbe: "blau" } } }, 1.8 * km(Y));
  S.def(`<clipPath id="${S.id("hinterTheke")}"><rect x="-50" y="-90" width="100" height="${r(THEKE - 9 - Y + 90)}"/></clipPath>`);
  S.teil({ id: "fischhaendler", de: "der Fischhändler", syl: "FISCH-händ-ler", it: "il pescivendolo", itSyl: "pe-sci-VEN-do-lo", en: "fishmonger", x: STAND.x + 2, y: Y,
    kunst: `<g clip-path="url(#${S.id("hinterTheke")})">${m.svg}</g>`, tipp: "Der Fischhändler ruft laut seine Angebote — das gehört zum Fischmarkt." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/hamburg.js"));
console.log(aus);
