#!/usr/bin/env node
/* =====================================================================
   BERÜHMTE STÄDTE DER WELT (FASSUNG 852) — Bilderwelt neu
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar.

   Der echte Ort: die ABFLUGHALLE eines großen deutschen Flughafens
   (Vorbild Frankfurt, Terminal 1, Ebene 3: Abflug).
   RECHERCHE (Fraport-Hinweise zu Terminal 1, Hallen A–C; Check-in-
   Schalter der Lufthansa-Gruppe; Bauweise moderner Terminals):
   - Oben die große ANZEIGETAFEL „Abflug / Departures“ mit Zeit, Flug,
     Ziel, Flugsteig (Gate) und Bemerkung; daneben die Bahnhofs-UHR.
   - Darunter die CHECK-IN-SCHALTER mit Bildschirmen, Waage und Band.
   - Durch die Glasfassade sieht man das FLUGZEUG an der Fluggastbrücke.
   - An den Wänden hinterleuchtete Werbe-Leuchtkästen der Reiseziele –
     jedes mit seinem Wahrzeichen, genau geformt: Eiffelturm (Gitter-
     turm, zwei Plattformen), Big Ben (Elizabeth Tower, Uhr, Spitzhelm),
     Schiefer Turm von Pisa (Marmor, sechs Arkadengeschosse, Glocken-
     stube, Neigung ≈ 4°), Brandenburger Tor (sechs dorische Säulen,
     Quadriga), Sagrada Família (Türme wie Spindeln, Mittelturm mit
     Kreuz, Baukran), Kreml (rote Mauer mit Schwalbenschwanz-Zinnen,
     Spasski-Turm mit Stern), Freiheitsstatue (Fackel, Strahlenkrone,
     Tafel, grüne Kupferhaut), Golden Gate Bridge (zwei Art-déco-Pylone,
     Hängeseile, Orange), Christusstatue (Arme ausgebreitet auf dem
     Corcovado, Zuckerhut), Taj Mahal (Zwiebelkuppel, vier Minarette,
     Wasserbecken), Chinesische Mauer (Wachtürme auf Bergkämmen),
     Opernhaus von Sydney (Segelschalen, Harbour Bridge).
   - Reisende mit Rollkoffer, ein Gepäckwagen.
   Maßstab: Augenhöhe y = 108 (1,6 m); Rückwand ≈ 20 Einheiten je
   Meter; Reisende vorn (y ≈ 194) ≈ 52 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "weltstaedte", titel: "Berühmte Städte der Welt", emoji: "🗺️", thema: "Landeskunde", kuerzel: "b23e", fassung: 852 });
const rnd = zufall(1972);
const r = B.r;
const abs = (x, y, svg) => `<g transform="translate(${r(-x)} ${r(-y)})">${svg}</g>`;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const ALU = S.lg("alu", [[0, "#e9edf0"], [0.5, "#b9c1c7"], [1, "#d9dee2"]], 0, 0, 1, 0);
const VP = { x: 160, y: 108 }, WU = 130;

/* =====================================================================
   KULISSE — Hallendach mit Fachwerkträgern, Rückwand, Steinboden
   ===================================================================== */
{
  let g = `<rect x="0" y="0" width="320" height="28" fill="${S.lg("dach", [[0, "#dfe6ec"], [1, "#f4f6f8"]])}"/>`;
  for (let x = 0; x <= 320; x += 40) g += `<rect x="${x + 6}" y="0" width="28" height="12" fill="#eef6fc"/><rect x="${x + 6}" y="0" width="28" height="12" fill="none" stroke="#b9c4cc" stroke-width=".5"/>`;
  g += `<path d="M0 14 L320 14 M0 22 L320 22" stroke="#9aa6ae" stroke-width="1.2"/>`;
  for (let x = 0; x < 320; x += 8) g += `<path d="M${x} 22 L${x + 4} 14 L${x + 8} 22" stroke="#aab4bb" stroke-width=".5" fill="none"/>`;
  g += `<rect x="0" y="26" width="320" height="${WU - 26}" fill="${S.lg("wand", [[0, "#e6e3dc"], [1, "#d3cfc6"]])}"/>`;
  g += `<rect x="0" y="26" width="320" height="2" fill="#c4c0b6"/>`;
  /* Steinboden, poliert, in Flucht */
  g += `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("boden", [[0, "#cfcac0"], [1, "#b2ab9e"]])}"/>`;
  for (let i = -10; i <= 10; i++) {
    const xb = 160 + i * 18; let x2 = VP.x + (xb - VP.x) * (200 - VP.y) / (WU - VP.y), y2 = 200;
    if (x2 < 0 || x2 > 320) { const xr = x2 < 0 ? 0 : 320; y2 = VP.y + (WU - VP.y) * (xr - VP.x) / (xb - VP.x); x2 = xr; }
    g += `<line x1="${r(xb)}" y1="${WU}" x2="${r(x2)}" y2="${r(y2)}" stroke="#9b9488" stroke-width=".35"/>`;
  }
  for (const y of [134, 140, 149, 162, 182]) g += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#9b9488" stroke-width=".35"/>`;
  g += `<rect x="0" y="${WU}" width="320" height="70" fill="${S.lg("glanz", [[0, "#fff", 0.25], [0.4, "#fff", 0.05], [1, "#000", 0.08]])}"/>`;
  S.hinten(g);
}

/* =====================================================================
   LEUCHTKÄSTEN — Rahmen, Hintergrund, Wahrzeichen, Stadtname
   ===================================================================== */
const PW = 28, PH = 28, BH = 23;   /* Bildfläche 28 × 23, darunter das Namensband */
const POS = {
  paris: [10, 32], london: [41, 32], pisa: [72, 32], berlin: [10, 64], barcelona: [41, 64], moskau: [72, 64],
  newyork: [220, 32], sanfrancisco: [251, 32], rio: [282, 32], agra: [220, 64], peking: [251, 64], sydney: [282, 64],
};
function plakat(key, himmel, bild, name, band) {
  const [x, y] = POS[key];
  let g = `<rect x="${x - 1.6}" y="${y - 1.6}" width="${PW + 3.2}" height="${PH + 3.2}" rx=".8" fill="${ALU}"/>`;
  g += `<rect x="${x - 1.6}" y="${y + PH + 1.6}" width="${PW + 3.2}" height=".8" fill="#000" opacity=".12"/>`;
  g += `<g transform="translate(${x} ${y})"><rect width="${PW}" height="${BH}" fill="${himmel}"/>${bild}`;
  g += `<rect y="${BH}" width="${PW}" height="${PH - BH}" fill="${band}"/><text x="${PW / 2}" y="${BH + 3.6}" font-size="${name.length > 9 ? 2.2 : 3}" text-anchor="middle" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-weight="bold" letter-spacing="${name.length > 9 ? 0.1 : 0.4}">${name}</text>`;
  g += `<rect width="${PW}" height="${BH}" fill="${S.lg("leucht", [[0, "#fff", 0.18], [0.5, "#fff", 0], [1, "#fff", 0.06]], 0, 0, 1, 1)}"/></g>`;
  return { x: x + PW / 2, y: y + PH + 1.6, kunst: abs(x + PW / 2, y + PH + 1.6, g) };
}
const H = (n, stops, a, b, c, d) => S.lg(n, stops, a, b, c, d);

/* --- Eiffelturm (Paris) --- */
{
  const E = "#6b4a30";
  let b = `<rect y="19" width="28" height="4" fill="#5e7a4a"/><path d="M0 19 Q14 17.6 28 19" fill="#7a9a5a"/>`;
  b += `<path d="M2 19 L4 15 L7 15 L8 19 Z M20 19 L21 14 L25 14.6 L26 19 Z" fill="#c9b08a" opacity=".7"/>`;
  b += `<path d="M5.4 21 Q9 16.6 9.4 14.2 L18.6 14.2 Q19 16.6 22.6 21 L20.2 21 Q16.6 16.8 14 16.6 Q11.4 16.8 7.8 21 Z" fill="${E}"/>`;
  b += `<rect x="8.6" y="13.4" width="10.8" height="1.2" fill="#5a3c24"/>`;
  b += `<path d="M9.8 13.4 L11.7 8.6 L16.3 8.6 L18.2 13.4 Z" fill="${E}"/><rect x="11.2" y="8" width="5.6" height=".9" fill="#5a3c24"/>`;
  b += `<path d="M11.9 8 L13.7 1.8 L14.3 1.8 L16.1 8 Z" fill="${E}"/><rect x="13.6" y="1.2" width=".8" height="1" fill="#5a3c24"/><line x1="14" y1="1.2" x2="14" y2="-.2" stroke="#5a3c24" stroke-width=".3"/>`;
  b += `<path d="M7 20 L13 14.6 M21 20 L15 14.6 M10.4 13 L16.6 9.2 M17.6 13 L11.4 9.2 M12.4 7.6 L15.2 3.4 M15.6 7.6 L12.8 3.4" stroke="#a8845a" stroke-width=".25"/>`;
  b += `<path d="M5.4 21 Q9 16.6 9.4 14.2" stroke="#c9a070" stroke-width=".3" fill="none"/>`;
  const p = plakat("paris", H("hp", [[0, "#f2b6a0"], [0.6, "#f7dcc4"], [1, "#fbeedc"]]), b, "PARIS", "#2a4a8a");
  S.teil(Object.assign({ id: "eiffelturm", de: "der Eiffelturm", syl: "EIF-fel-turm", it: "la Torre Eiffel", itSyl: "TOR-re EIF-fel", en: "Eiffel Tower",
    tipp: "Der Eiffelturm in Paris ist 330 Meter hoch und wurde 1889 eröffnet." }, p));
}
/* --- Big Ben (London) --- */
{
  const ST = H("sandstein", [[0, "#e6cf98"], [0.5, "#cdb176"], [1, "#9e8450"]], 0, 0, 1, 0);
  let b = `<rect y="20" width="28" height="3" fill="#6e8296"/><path d="M0 20.4 h28" stroke="#9fb2c2" stroke-width=".4"/>`;
  b += `<rect x="0" y="14" width="12" height="6" fill="${ST}"/>`;
  for (let x = 0.6; x < 12; x += 1.6) b += `<rect x="${x}" y="12.6" width=".5" height="1.6" fill="#cdb176"/><rect x="${x}" y="15.4" width=".6" height="2.6" fill="#7e6a44"/>`;
  b += `<rect x="12" y="10" width="5" height="10" fill="${ST}"/>`;
  for (let y = 11; y < 20; y += 1.5) b += `<rect x="12.8" y="${y}" width=".6" height="1" fill="#7e6a44"/><rect x="15.6" y="${y}" width=".6" height="1" fill="#7e6a44"/>`;
  b += `<rect x="11.4" y="6" width="6.2" height="4.4" fill="${ST}"/><circle cx="14.5" cy="8.2" r="1.8" fill="#f6f0dc" stroke="#c9a33a" stroke-width=".4"/><path d="M14.5 8.2 L14.5 7 M14.5 8.2 L15.4 8.6" stroke="#222" stroke-width=".25"/>`;
  b += `<rect x="11.8" y="4.6" width="5.4" height="1.6" fill="#cdb176"/><path d="M12.2 4.6 L12.2 3.4 M16.8 4.6 L16.8 3.4" stroke="#cdb176" stroke-width=".5"/>`;
  b += `<path d="M12.2 4.6 L14.5 .2 L16.8 4.6 Z" fill="#3a3e48"/><path d="M14.5 .2 L14.5 -.6" stroke="#c9a33a" stroke-width=".3"/><path d="M13.4 2.8 h2.2" stroke="#c9a33a" stroke-width=".3"/>`;
  const p = plakat("london", H("hl", [[0, "#9fb4c8"], [1, "#dfe6ea"]]), b, "LONDON", "#8a1a26");
  S.teil(Object.assign({ id: "bigben", de: "der Big Ben", syl: "BIG BEN", it: "il Big Ben", itSyl: "big BEN", en: "Big Ben",
    tipp: "„Big Ben“ heißt eigentlich die große Glocke im Uhrturm am Parlament in London." }, p));
}
/* --- Schiefer Turm von Pisa --- */
{
  const M = H("pmarmor", [[0, "#fbf8f0"], [0.6, "#e6e0d2"], [1, "#b8b0a0"]], 0, 0, 1, 0);
  let b = `<rect y="19" width="28" height="4" fill="#6e9a4a"/>`;
  b += `<path d="M0 12 L6 9 L10 12 L10 19 L0 19 Z" fill="#efe8da"/><path d="M0 12 L6 9 L10 12" stroke="#b8b0a0" stroke-width=".3" fill="none"/>`;
  for (let x = 1; x < 9; x += 2) b += `<rect x="${x}" y="13.4" width=".8" height="4" fill="#9a9284"/>`;
  let t = `<rect x="11" y="4.6" width="7" height="15" fill="${M}"/>`;
  for (let i = 0; i < 6; i++) { const y = 6.6 + i * 2.2; t += `<rect x="10.8" y="${y - 0.4}" width="7.4" height=".4" fill="#d6cfc0"/>`; for (let j = 0; j < 4; j++) t += `<path d="M${11.5 + j * 1.6} ${y + 1.6} L${11.5 + j * 1.6} ${y + 0.5} Q${12.1 + j * 1.6} ${y - 0.1} ${12.7 + j * 1.6} ${y + 0.5} L${12.7 + j * 1.6} ${y + 1.6} Z" fill="#8e8678"/>`; }
  t += `<rect x="12.2" y="2.6" width="4.6" height="2.4" fill="${M}"/>`;
  for (let j = 0; j < 3; j++) t += `<path d="M${12.6 + j * 1.4} 4.6 L${12.6 + j * 1.4} 3.6 Q${13.1 + j * 1.4} 3 ${13.6 + j * 1.4} 3.6 L${13.6 + j * 1.4} 4.6 Z" fill="#8e8678"/>`;
  t += `<rect x="12" y="2.2" width="5" height=".5" fill="#d6cfc0"/>`;
  b += `<g transform="rotate(4 14.5 19.6)">${t}</g><rect x="10.6" y="19" width="8" height="1" fill="#c9c2b2"/>`;
  const p = plakat("pisa", H("hpi", [[0, "#6fa8dc"], [1, "#cfe4f2"]]), b, "PISA", "#2f6a3a");
  S.teil(Object.assign({ id: "schieferturm", de: "der Schiefe Turm von Pisa", syl: "SCHIE-fe TURM von PI-sa", it: "la Torre di Pisa", itSyl: "TOR-re di PI-sa", en: "Leaning Tower of Pisa",
    tipp: "Der Glockenturm neigt sich, weil der Boden darunter weich ist." }, p));
}
/* --- Brandenburger Tor (Berlin) --- */
{
  const ST = H("tor", [[0, "#efe2c0"], [1, "#cdb88a"]]);
  let b = `<rect y="20" width="28" height="3" fill="#9a958a"/>`;
  b += `<rect x="2.6" y="19" width="22.8" height="1.4" fill="#d8c8a0"/>`;
  for (let i = 0; i < 6; i++) b += `<rect x="${3.4 + i * 4.06}" y="11.4" width="1.6" height="7.8" fill="${ST}"/><rect x="${3.2 + i * 4.06}" y="11" width="2" height=".6" fill="#e2d2a8"/>`;
  b += `<rect x="2.4" y="9" width="23.2" height="2.2" fill="${ST}"/>`;
  for (let i = 0; i < 12; i++) b += `<rect x="${3 + i * 1.94}" y="9.4" width=".6" height="1.2" fill="#b9a678"/>`;
  b += `<path d="M5 9 L5 7.2 L11 7.2 L11 6 L17 6 L17 7.2 L23 7.2 L23 9 Z" fill="${ST}"/>`;
  /* Quadriga: vier Pferde, Wagen, Victoria mit Stab */
  const Q = "#4e6a5a";
  for (let i = 0; i < 4; i++) b += `<path d="M${10.4 + i * 1.9} 6 L${10.4 + i * 1.9} 4.2 Q${10.8 + i * 1.9} 2.8 ${11.4 + i * 1.9} 3.4 L${11.6 + i * 1.9} 4.6 L${11.4 + i * 1.9} 6 Z" fill="${Q}"/>`;
  b += `<path d="M13.4 3.8 L13.6 1.4 Q14 .8 14.4 1.4 L14.6 3.8 Z" fill="${Q}"/><path d="M14.6 1.6 L15.6 -.4" stroke="${Q}" stroke-width=".35"/><circle cx="15.7" cy="-.6" r=".5" fill="none" stroke="${Q}" stroke-width=".25"/>`;
  b += `<path d="M13.2 2 Q12 1 11.6 2.2 M14.8 2 Q16 1 16.4 2.2" stroke="${Q}" stroke-width=".35" fill="none"/>`;
  const p = plakat("berlin", H("hb", [[0, "#8ab0d6"], [1, "#e0e9f0"]]), b, "BERLIN", "#1d1d1f");
  S.teil(Object.assign({ id: "brandenburgertor", de: "das Brandenburger Tor", syl: "BRAN-den-bur-ger TOR", it: "la Porta di Brandeburgo", itSyl: "POR-ta di bran-de-BUR-go", en: "Brandenburg Gate",
    tipp: "Oben steht die Quadriga: die Siegesgöttin auf einem Wagen mit vier Pferden." }, p));
}
/* --- Sagrada Família (Barcelona) --- */
{
  const ST = H("sagr", [[0, "#d8c4a0"], [0.5, "#bfa47a"], [1, "#8e744e"]], 0, 0, 1, 0);
  let b = `<rect y="20" width="28" height="3" fill="#c9b08a"/>`;
  b += `<path d="M4 20 L4 13 Q8 11 14 11.4 Q20 11 24 13 L24 20 Z" fill="${ST}"/>`;
  b += `<path d="M10 20 L10 15.4 Q12 13.2 14 13.2 Q16 13.2 18 15.4 L18 20 Z" fill="#5e4a32"/>`;
  const spindel = (x, top, w) => `<path d="M${x - w} 13 L${x - w} ${top + 6} Q${x - w} ${top + 2} ${x} ${top} Q${x + w} ${top + 2} ${x + w} ${top + 6} L${x + w} 13 Z" fill="${ST}"/>` +
    `<path d="M${x} ${top + 7} v4 M${x - w * 0.5} ${top + 8} v3" stroke="#6e5a3e" stroke-width=".35" stroke-dasharray=".5 .5"/><circle cx="${x}" cy="${top - 0.4}" r=".55" fill="${["#d8443a", "#e8c24a", "#4a8ad8"][Math.floor(rnd() * 3)]}"/>`;
  b += spindel(6.4, 5, 1.3) + spindel(10.2, 2.6, 1.4) + spindel(17.8, 2.6, 1.4) + spindel(21.6, 5, 1.3);
  b += `<path d="M12.4 13 L12.4 3 Q12.6 .4 14 -.2 Q15.4 .4 15.6 3 L15.6 13 Z" fill="${ST}"/><path d="M14 -.2 L14 -1.8 M13.2 -1.2 L14.8 -1.2" stroke="#f2f2ee" stroke-width=".45"/>`;
  b += `<path d="M24.6 20 L24.6 3 M22 3 L28 3 M24.6 3 L27.4 5" stroke="#e8b43a" stroke-width=".45"/>`;
  const p = plakat("barcelona", H("hba", [[0, "#5fa8e0"], [1, "#f4dcb0"]]), b, "BARCELONA", "#b8282a");
  S.teil(Object.assign({ id: "sagrada", de: "die Sagrada Família", syl: "Sa-GRA-da Fa-MI-lia", it: "la Sagrada Família", itSyl: "sa-GRA-da fa-MI-lia", en: "Sagrada Família",
    tipp: "Antoni Gaudí begann die Kirche 1882 – gebaut wird bis heute." }, p));
}
/* --- Kreml (Moskau) --- */
{
  const ROT = H("ziegel", [[0, "#c2463a"], [1, "#8e2a22"]]);
  let b = `<rect y="20" width="28" height="3" fill="#e8ecf0"/>`;
  b += `<rect x="17.6" y="8" width="4" height="8" fill="#f2efe6"/><path d="M17.4 8 Q19.6 3 21.8 8 Z" fill="#e8c24a"/><path d="M19.6 3.6 L19.6 2" stroke="#e8c24a" stroke-width=".35"/>`;
  b += `<path d="M22 12 Q23.6 9 25.2 12 Z M14.6 12.6 Q16 10 17.4 12.6 Z" fill="#e8c24a"/><rect x="22" y="12" width="3.2" height="4" fill="#f2efe6"/><rect x="14.6" y="12.6" width="2.8" height="3.4" fill="#f2efe6"/>`;
  b += `<rect x="0" y="15" width="28" height="5" fill="${ROT}"/>`;
  for (let x = 0.4; x < 28; x += 1.9) b += `<path d="M${x} 15 L${x} 13.8 L${x + 0.6} 14.4 L${x + 1.2} 13.8 L${x + 1.2} 15 Z" fill="#a8362c"/>`;
  b += `<rect x="6" y="7" width="5" height="13" fill="${ROT}"/><rect x="5.6" y="9.6" width="5.8" height="1" fill="#f2efe6"/>`;
  b += `<circle cx="8.5" cy="12" r="1.3" fill="#1d2a3a" stroke="#e8c24a" stroke-width=".3"/>`;
  b += `<rect x="6.6" y="4.6" width="3.8" height="2.6" fill="${ROT}"/><path d="M6.4 4.8 L8.5 -.4 L10.6 4.8 Z" fill="#3e7a4a"/>`;
  b += `<path d="M8.5 -1.8 L8.9 -.8 L9.9 -.8 L9.1 -.2 L9.4 .8 L8.5 .2 L7.6 .8 L7.9 -.2 L7.1 -.8 L8.1 -.8 Z" fill="#e8343a"/>`;
  b += `<path d="M8 20 L8 17.6 Q8.5 16.8 9 17.6 L9 20 Z" fill="#3a1a14"/>`;
  const p = plakat("moskau", H("hm", [[0, "#9fb0c4"], [1, "#e9eef2"]]), b, "MOSKAU", "#5a1a1e");
  S.teil(Object.assign({ id: "kreml", de: "der Kreml", syl: "KREML", it: "il Cremlino", itSyl: "crem-LI-no", en: "Kremlin",
    tipp: "Der Kreml ist eine Burg mitten in Moskau; der Spasski-Turm trägt einen roten Stern." }, p));
}
/* --- Freiheitsstatue (New York) --- */
{
  const K = H("kupfer", [[0, "#9fd0bc"], [0.5, "#6fae98"], [1, "#3e7a68"]], 0, 0, 1, 0);
  let b = `<path d="M0 15 L2 15 L2 11 L4 11 L4 13 L6 9 L7 13 L9 12 L9 15 L19 15 L19 10 L21 10 L21 7 L23 7 L23 12 L25 12 L25 15 L28 15 L28 20 L0 20 Z" fill="#9fb2c2" opacity=".7"/>`;
  b += `<rect y="18" width="28" height="5" fill="${H("wasserny", [[0, "#4f7aa0"], [1, "#2e5a80"]])}"/>`;
  b += `<path d="M8 19 L20 19 L18.6 17 L9.4 17 Z" fill="#c9b89a"/><rect x="11" y="11.6" width="6" height="5.6" fill="${H("sockelny", [[0, "#e2d6bc"], [1, "#b8a888"]], 0, 0, 1, 0)}"/><rect x="10.6" y="11.2" width="6.8" height=".8" fill="#efe4cc"/>`;
  b += `<path d="M12.4 11.4 L12.8 7 Q12.6 5 13.6 4.4 L15 4.4 Q16 5 15.6 7 L16 11.4 Z" fill="${K}"/>`;
  b += `<path d="M12.9 8 Q14.2 9 15.6 7.6 M13 10 Q14.4 10.8 15.8 9.6" stroke="#3e7a68" stroke-width=".3" fill="none"/>`;
  b += `<path d="M15.2 5.2 L16.4 2.2 L17 2.4 L16 5.6 Z" fill="${K}"/><path d="M16.2 2.2 L16.8 1.2 L17.4 2.4 Z" fill="#3e7a68"/><ellipse cx="16.8" cy=".6" rx=".6" ry=".9" fill="#f2c040"/>`;
  b += `<rect x="12" y="6.2" width="1.5" height="2" rx=".2" fill="${K}" transform="rotate(-12 12.7 7.2)"/>`;
  b += `<circle cx="14.2" cy="3.7" r=".9" fill="${K}"/>`;
  for (let i = 0; i < 7; i++) { const a = (-150 + i * 20) * Math.PI / 180; b += `<path d="M${r(14.2 + Math.cos(a) * 0.9)} ${r(3.5 + Math.sin(a) * 0.9)} L${r(14.2 + Math.cos(a) * 1.9)} ${r(3.5 + Math.sin(a) * 1.9)}" stroke="#6fae98" stroke-width=".3"/>`; }
  const p = plakat("newyork", H("hny", [[0, "#4f8ed0"], [1, "#d8e8f4"]]), b, "NEW YORK", "#1d3a6a");
  S.teil(Object.assign({ id: "freiheitsstatue", de: "die Freiheitsstatue", syl: "FREI-heits-sta-tu-e", it: "la Statua della Libertà", itSyl: "STA-tua del-la li-ber-TÀ", en: "Statue of Liberty",
    tipp: "Ein Geschenk Frankreichs an die USA (1886); die Kupferhaut ist grün geworden." }, p));
}
/* --- Golden Gate Bridge (San Francisco) --- */
{
  const OR = "#c4402c";
  let b = `<path d="M0 12 Q6 8 12 12 L12 23 L0 23 Z M20 13 Q25 9 28 11 L28 23 L20 23 Z" fill="#7a8f6a"/>`;
  b += `<rect y="17" width="28" height="6" fill="${H("bucht", [[0, "#5f8aa8"], [1, "#2e5a7a"]])}"/>`;
  b += `<ellipse cx="14" cy="16" rx="14" ry="1.6" fill="#fff" opacity=".55"/>`;
  b += `<path d="M0 14.6 L28 14.6" stroke="${OR}" stroke-width="1"/>`;
  for (const x of [7, 21]) b += `<rect x="${x - 0.9}" y="3" width=".6" height="14" fill="${OR}"/><rect x="${x + 0.3}" y="3" width=".6" height="14" fill="${OR}"/><path d="M${x - 0.9} 5 h1.8 M${x - 0.9} 8 h1.8 M${x - 0.9} 11 h1.8" stroke="${OR}" stroke-width=".5"/>`;
  b += `<path d="M0 10.6 Q3.6 13 6.4 3.2 Q14 14.4 21.6 3.2 Q24.4 13 28 10.6" stroke="${OR}" stroke-width=".45" fill="none"/>`;
  for (let x = 1; x < 28; x += 1.2) { const tt = x < 7 ? 1 : x < 21 ? 0 : 2; let y = tt === 1 ? 10.6 + (3.2 - 10.6) * (x / 7) ** 1.6 : tt === 2 ? 10.6 + (3.2 - 10.6) * ((28 - x) / 7) ** 1.6 : 3.2 + 10.4 * (1 - ((x - 14) / 7.4) ** 2); if (Math.abs(x - 7) < 0.6 || Math.abs(x - 21) < 0.6) continue; b += `<line x1="${r(x)}" y1="${r(Math.max(3.4, y))}" x2="${r(x)}" y2="14.2" stroke="${OR}" stroke-width=".15"/>`; }
  const p = plakat("sanfrancisco", H("hsf", [[0, "#b8cde0"], [1, "#eef2f4"]]), b, "SAN FRANCISCO", "#c4402c");
  S.teil(Object.assign({ id: "goldengate", de: "die Golden Gate Bridge", syl: "GOL-den GATE BRIDGE", it: "il Golden Gate", itSyl: "GOL-den GATE", en: "Golden Gate Bridge",
    tipp: "Die Brücke ist nicht golden, sondern „International Orange“ – gut sichtbar im Nebel." }, p));
}
/* --- Christusstatue (Rio de Janeiro) --- */
{
  let b = `<rect y="17" width="28" height="6" fill="#3e86a8"/>`;
  b += `<path d="M20 18 Q21 11 23.6 10 Q26 11 26.4 18 Z" fill="#5e7a4a"/>`;
  b += `<path d="M2 23 Q6 16 10 13.6 Q12.4 12 14 11.4 Q16 12 18 13.6 Q21 17 24 23 Z" fill="${H("corcovado", [[0, "#4e7a3e"], [1, "#2e4a26"]])}"/>`;
  b += `<rect x="13.2" y="10" width="1.6" height="1.6" fill="#e2e0da"/>`;
  b += `<path d="M13.3 10 L13.6 5.2 L14.4 5.2 L14.7 10 Z" fill="${H("speck", [[0, "#f6f4ee"], [1, "#b9b6ae"]], 0, 0, 1, 0)}"/>`;
  b += `<path d="M9 4.8 L19 4.8 L19 5.6 L14.4 5.8 L13.6 5.8 L9 5.6 Z" fill="#ecebe6"/><circle cx="14" cy="4" r=".75" fill="#ecebe6"/>`;
  b += `<path d="M13.7 6 L13.8 9.6" stroke="#c9c6be" stroke-width=".25"/>`;
  const p = plakat("rio", H("hr", [[0, "#5fb0e8"], [1, "#e0f0f8"]]), b, "RIO DE JANEIRO", "#2f8a4a");
  S.teil(Object.assign({ id: "christusstatue", de: "die Christusstatue", syl: "CHRIS-tus-sta-tu-e", it: "il Cristo Redentore", itSyl: "CRI-sto re-den-TO-re", en: "Christ the Redeemer",
    tipp: "Sie steht auf dem Berg Corcovado und breitet die Arme über Rio aus." }, p));
}
/* --- Taj Mahal (Agra) --- */
{
  const W = H("tajw", [[0, "#fbf8f2"], [0.6, "#ece6da"], [1, "#c9c0b0"]], 0, 0, 1, 0);
  let b = `<rect y="18.6" width="28" height="4.4" fill="#7a9a5a"/><rect x="11" y="19" width="6" height="4" fill="#7ab4d0"/><path d="M13.6 19.4 L14 22 L14.4 19.4 Z" fill="#fbf8f2" opacity=".6"/>`;
  b += `<rect x="3" y="17" width="22" height="1.8" fill="#efe8da"/>`;
  for (const x of [4.4, 23.6]) b += `<rect x="${x - 0.5}" y="7" width="1" height="10" fill="${W}"/><path d="M${x - 0.8} 7 Q${x} 5.4 ${x + 0.8} 7 Z" fill="${W}"/><path d="M${x - 0.7} 10 h1.4 M${x - 0.7} 13 h1.4" stroke="#c9c0b0" stroke-width=".25"/>`;
  b += `<rect x="8" y="10.6" width="12" height="6.4" fill="${W}"/>`;
  b += `<path d="M12.2 17 L12.2 13 Q14 10.6 15.8 13 L15.8 17 Z" fill="#c9c0b0"/><path d="M12.8 17 L12.8 13.4 Q14 11.8 15.2 13.4 L15.2 17 Z" fill="#8e8678"/>`;
  for (const x of [9.4, 18.6]) b += `<path d="M${x - 0.7} 16 L${x - 0.7} 13.4 Q${x} 12.4 ${x + 0.7} 13.4 L${x + 0.7} 16 Z" fill="#a8a090"/>`;
  for (const x of [9, 19]) b += `<rect x="${x - 1}" y="9.4" width="2" height="1.4" fill="${W}"/><path d="M${x - 1.1} 9.6 Q${x} 7.8 ${x + 1.1} 9.6 Z" fill="${W}"/>`;
  b += `<rect x="12" y="9.4" width="4" height="1.4" fill="${W}"/>`;
  b += `<path d="M11.4 9.6 Q10.8 6.4 12.6 4.6 Q14 3.4 14 2.2 Q14 3.4 15.4 4.6 Q17.2 6.4 16.6 9.6 Z" fill="${W}"/>`;
  b += `<path d="M14 2.2 L14 .4" stroke="#d6b04a" stroke-width=".35"/><circle cx="14" cy="1.4" r=".3" fill="#d6b04a"/>`;
  const p = plakat("agra", H("ha", [[0, "#f2b490"], [0.6, "#f8dcc0"], [1, "#fbeedc"]]), b, "AGRA", "#d8842a");
  S.teil(Object.assign({ id: "tajmahal", de: "das Taj Mahal", syl: "TADSCH ma-HAL", it: "il Taj Mahal", itSyl: "taj ma-HAL", en: "Taj Mahal",
    tipp: "Ein Grabmal aus weißem Marmor, gebaut für die Frau eines Großmoguls." }, p));
}
/* --- Chinesische Mauer (bei Peking) --- */
{
  let b = `<path d="M0 10 L5 6 L10 9 L16 4 L22 8 L28 5 L28 23 L0 23 Z" fill="#8aa0a8" opacity=".7"/>`;
  b += `<path d="M0 16 Q5 10 10 13 Q14 8 19 11 Q23 7 28 9 L28 23 L0 23 Z" fill="${H("berg", [[0, "#5e8a4a"], [1, "#3a5e2e"]])}"/>`;
  b += `<path d="M0 21 Q4 17 8 18 Q11 13 14.6 13.4 Q18 10 21 11 Q24 8 28 9.4" stroke="#b8a88a" stroke-width="1.6" fill="none"/>`;
  b += `<path d="M0 20 Q4 16 8 17 Q11 12 14.6 12.4 Q18 9 21 10 Q24 7 28 8.4" stroke="#9a8a6c" stroke-width=".6" fill="none" stroke-dasharray=".5 .5"/>`;
  for (const [x, y] of [[8, 16.4], [21, 9.6]]) b += `<rect x="${x - 1.4}" y="${y - 2.4}" width="2.8" height="2.6" fill="#c9b89a"/><path d="M${x - 1.6} ${y - 2.4} L${x + 1.6} ${y - 2.4}" stroke="#8a7a5c" stroke-width=".5" stroke-dasharray=".5 .4"/><rect x="${x - 0.4}" y="${y - 1.4}" width=".8" height=".9" fill="#5e4e3a"/>`;
  const p = plakat("peking", H("hpk", [[0, "#c8d6e0"], [1, "#eef2f0"]]), b, "PEKING", "#c4302a");
  S.teil(Object.assign({ id: "chinesischemauer", de: "die Chinesische Mauer", syl: "Chi-NE-si-sche MAU-er", it: "la Grande Muraglia", itSyl: "GRAN-de mu-RA-glia", en: "Great Wall of China",
    tipp: "Die Mauer zieht sich über Tausende Kilometer durch Berge und Wüsten." }, p));
}
/* --- Opernhaus von Sydney --- */
{
  let b = `<path d="M0 14 Q4 4 10 14" stroke="#8a949c" stroke-width=".8" fill="none"/><path d="M0 14 L10 14" stroke="#8a949c" stroke-width=".6"/>`;
  for (let x = 1; x < 10; x += 1.4) b += `<line x1="${x}" y1="14" x2="${x}" y2="${r(14 - 9 * Math.sin(Math.PI * x / 10) * 0.95)}" stroke="#8a949c" stroke-width=".15"/>`;
  b += `<rect y="17" width="28" height="6" fill="${H("hafen", [[0, "#3e86b8"], [1, "#1e5a8a"]])}"/>`;
  b += `<rect x="6" y="15.4" width="20" height="1.8" fill="#d8ccb4"/>`;
  const schale = (x, w, h, f) => `<path d="M${x} 15.4 Q${x + w * 0.1} ${15.4 - h} ${x + w} ${15.4 - h * 1.05} Q${x + w * 0.7} ${15.4 - h * 0.6} ${x + w * 0.85} 15.4 Z" fill="${f}"/><path d="M${x + w * 0.2} 15.4 Q${x + w * 0.3} ${15.4 - h * 0.7} ${x + w * 0.9} ${15.4 - h}" stroke="#d6d2c8" stroke-width=".2" fill="none"/>`;
  b += schale(8, 5, 6, "#ecebe4") + schale(11, 6, 8, "#f6f5f0") + schale(14.6, 6.4, 9.4, "#fbfaf6") + schale(19, 5, 6.4, "#ecebe4") + schale(21.6, 4, 4.6, "#f2f1ec");
  const p = plakat("sydney", H("hsy", [[0, "#3f9ad8"], [1, "#d8ecf6"]]), b, "SYDNEY", "#1e5a8a");
  S.teil(Object.assign({ id: "opernhaus", de: "das Opernhaus von Sydney", syl: "O-pern-haus von SYD-ney", it: "l'Opera di Sydney", itSyl: "O-pe-ra di SYD-ney", en: "Sydney Opera House",
    tipp: "Die Dächer sehen aus wie Segel im Hafen von Sydney." }, p));
}

/* =====================================================================
   DIE UHR (Bahnhofsuhr am Träger) und DIE ANZEIGETAFEL
   ===================================================================== */
{
  let k = `<rect x="-.5" y="-14" width="1" height="6" fill="#6e767c"/><circle r="8" fill="#3a3e42"/><circle r="7" fill="#fbfbf8"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(Math.sin(a) * 6.2)}" y1="${r(-Math.cos(a) * 6.2)}" x2="${r(Math.sin(a) * 5)}" y2="${r(-Math.cos(a) * 5)}" stroke="#1d1d1f" stroke-width="${i % 3 ? 0.6 : 1}"/>`; }
  k += `<line x1="0" y1="0" x2="${r(Math.sin(9.6 * Math.PI / 6) * 3.6)}" y2="${r(-Math.cos(9.6 * Math.PI / 6) * 3.6)}" stroke="#1d1d1f" stroke-width="1"/><line x1="0" y1="0" x2="${r(Math.sin(7.2 * Math.PI / 30) * 5.4)}" y2="${r(-Math.cos(7.2 * Math.PI / 30) * 5.4)}" stroke="#1d1d1f" stroke-width=".7"/>`;
  k += `<line x1="0" y1="0" x2="${r(Math.sin(40 * Math.PI / 30) * 5.6)}" y2="${r(-Math.cos(40 * Math.PI / 30) * 5.6)}" stroke="#d23b30" stroke-width=".35"/><circle cx="${r(Math.sin(40 * Math.PI / 30) * 4.6)}" cy="${r(-Math.cos(40 * Math.PI / 30) * 4.6)}" r=".9" fill="#d23b30"/>`;
  S.teil({ id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: 160, y: 22, kunst: k });
}
{
  const X0 = 106, X1 = 214, Y0 = 32, Y1 = 84, cx = (X0 + X1) / 2;
  let k = `<rect x="${X0 - 2}" y="${Y0 - 2}" width="${X1 - X0 + 4}" height="${Y1 - Y0 + 4}" rx="1" fill="#3a3e42"/><rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" fill="#14181e"/>`;
  k += `<rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="6" fill="#1e2a3a"/>`;
  k += `<path d="M${X0 + 3} ${Y0 + 3.2} l2.2 -.5 l1.6 -2 l.8 0 l-.8 2 l1.6 -.4 l.6 -.8 l.6 0 l-.4 1.2 l.4 1.2 l-.6 0 l-.6 -.8 l-1.6 -.4 l.8 2 l-.8 0 l-1.6 -2 Z" fill="#ffd23a"/><text x="${X0 + 10}" y="${Y0 + 4.4}" font-size="3.6" fill="#ffd23a" font-family="Arial,Helvetica,sans-serif" font-weight="bold">Abflug</text><text x="${X1 - 3}" y="${Y0 + 4.4}" font-size="3" text-anchor="end" fill="#c9d4de" font-family="Arial,Helvetica,sans-serif">Departures</text>`;
  const sp = [X0 + 3, X0 + 15, X0 + 32, X0 + 72, X0 + 84];
  ["Zeit", "Flug", "Ziel", "Gate", "Bemerkung"].forEach((t, i) => { k += `<text x="${sp[i]}" y="${Y0 + 9}" font-size="2.2" fill="#8a96a2" font-family="Arial,Helvetica,sans-serif">${t}</text>`; });
  const fluege = [["09:05", "DA 101", "PARIS", "A15", "Boarding", "#7cff8a"], ["09:20", "DA 207", "LONDON", "A22", "Gate offen", "#7cff8a"], ["09:35", "DA 314", "PISA", "A18", "pünktlich", "#e8eef2"],
    ["09:50", "DA 422", "BERLIN", "A12", "pünktlich", "#e8eef2"], ["10:10", "DA 530", "BARCELONA", "A26", "pünktlich", "#e8eef2"], ["10:25", "DA 640", "NEW YORK", "Z50", "pünktlich", "#e8eef2"],
    ["10:40", "DA 745", "SAN FRANCISCO", "Z52", "verspätet", "#ffb03a"], ["11:00", "DA 850", "RIO DE JANEIRO", "Z55", "pünktlich", "#e8eef2"], ["11:15", "DA 912", "DELHI", "Z58", "pünktlich", "#e8eef2"],
    ["11:30", "DA 960", "PEKING", "Z60", "pünktlich", "#e8eef2"], ["11:45", "DA 999", "SYDNEY", "Z62", "über Singapur", "#e8eef2"]];
  fluege.forEach((f, i) => {
    const y = Y0 + 12.8 + i * 3.6;
    if (i % 2) k += `<rect x="${X0}" y="${r(y - 2.7)}" width="${X1 - X0}" height="3.6" fill="#fff" opacity=".05"/>`;
    f.slice(0, 5).forEach((t, j) => { k += `<text x="${sp[j]}" y="${r(y)}" font-size="2.6" fill="${j === 4 ? f[5] : j === 0 ? "#ffd23a" : "#e8eef2"}" font-family="Arial,Helvetica,sans-serif"${j === 2 ? ' font-weight="bold"' : ""}>${t}</text>`; });
  });
  k += `<path d="M${X0} ${Y0} L${X0 + 40} ${Y0} L${X0 + 20} ${Y1} L${X0} ${Y1} Z" fill="#fff" opacity=".04"/>`;
  k += `<rect x="${cx - 30}" y="${Y0 - 8}" width="1" height="6" fill="#6e767c"/><rect x="${cx + 29}" y="${Y0 - 8}" width="1" height="6" fill="#6e767c"/>`;
  S.teil({ id: "anzeigetafel", de: "die Anzeigetafel", syl: "AN-zei-ge-ta-fel", it: "il tabellone delle partenze", itSyl: "ta-bel-LO-ne del-le par-TEN-ze", en: "departure board", x: cx, y: Y1 + 2, kunst: abs(cx, Y1 + 2, k),
    tipp: "Auf der Anzeigetafel stehen Abflugzeit, Ziel und Flugsteig (Gate)." });
}

/* =====================================================================
   DAS FLUGZEUG (durch die Glasfassade) und DER SCHALTER (Check-in)
   ===================================================================== */
{
  const X0 = 116, X1 = 204, Y0 = 90, Y1 = WU;
  let k = `<rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" fill="${S.lg("vorfeld", [[0, "#a9cbe6"], [0.55, "#e6eef2"], [0.56, "#9a9c98"], [1, "#7e807c"]])}"/>`;
  k += `<path d="M${X0} 112 L${X1} 112" stroke="#f2e04a" stroke-width=".5"/>`;
  /* Flugzeug: Rumpf, Fenster, Tragfläche, Triebwerk, Leitwerk; Fluggastbrücke */
  k += `<path d="M126 114 Q124 108 134 107 L188 107 Q198 107.4 200 104 L202 97 L205 97 L204 107.4 Q204 113 196 114 Z" fill="${S.lg("rumpf", [[0, "#ffffff"], [0.6, "#e9edf0"], [1, "#b9c1c7"]])}"/>`;
  k += `<path d="M196 104 L201 92 L205 92 L204 104 Z" fill="#2a4a7a"/><path d="M200 98 L203.6 98" stroke="#ffd23a" stroke-width=".8"/>`;
  for (let x = 134; x < 192; x += 2.6) k += `<rect x="${x}" y="108.6" width="1.2" height="1.2" rx=".4" fill="#3a4a5a"/>`;
  k += `<path d="M126.6 112 Q126 109 129 108.6 L131 108.6 L131 111 Z" fill="#2a3a4a"/>`;
  k += `<path d="M150 112 L178 116 L182 116 L166 112 Z" fill="#c9cfd4"/><rect x="160" y="113.4" width="8" height="3.6" rx="1.6" fill="#9aa3aa"/><ellipse cx="160.2" cy="115.2" rx=".9" ry="1.6" fill="#3a3e42"/>`;
  k += `<path d="M126 114 L196 114" stroke="#2a4a7a" stroke-width=".9"/>`;
  k += `<rect x="128" y="114" width="1.2" height="3.6" fill="#3a3e42"/><circle cx="128.6" cy="118" r="1" fill="#1d1d1f"/><circle cx="170" cy="118" r="1.2" fill="#1d1d1f"/>`;
  k += `<path d="M${X0} 104 L132 106 L132 113 L${X0} 113 Z" fill="${S.lg("bruecke", [[0, "#c9cfd4"], [1, "#8a9298"]])}"/><rect x="122" y="113" width="1.6" height="${Y1 - 113}" fill="#6e767c"/>`;
  /* Glasfassade: Pfosten und Riegel, Spiegelung */
  for (let x = X0; x <= X1; x += 22) k += `<rect x="${x - 0.8}" y="${Y0}" width="1.6" height="${Y1 - Y0}" fill="#5e676e"/>`;
  k += `<rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="1.6" fill="#5e676e"/><rect x="${X0}" y="120" width="${X1 - X0}" height="1" fill="#5e676e"/>`;
  k += `<path d="M${X0 + 4} ${Y1} L${X0 + 20} ${Y0} L${X0 + 28} ${Y0} L${X0 + 12} ${Y1} Z" fill="#fff" opacity=".14"/>`;
  S.teil({ id: "flugzeug", de: "das Flugzeug", syl: "FLUG-zeug", it: "l'aereo", itSyl: "a-E-re-o", en: "airplane", x: 160, y: Y1, kunst: abs(160, Y1, k) });
}
{
  /* Check-in-Schalter links und rechts der Glasfassade */
  let k = "";
  for (const [a, b, n0] of [[4, 112, 101], [208, 316, 109]]) {
    k += `<rect x="${a}" y="96" width="${b - a}" height="5" rx=".6" fill="#1e3a6a"/>`;
    k += `<text x="${(a + b) / 2}" y="99.6" font-size="2.6" text-anchor="middle" fill="#fff" font-family="Arial,Helvetica,sans-serif">Check-in ${n0}–${n0 + 3}</text>`;
    for (let i = 0; i < 4; i++) {
      const x = a + 2 + i * ((b - a - 4) / 4), w = (b - a - 4) / 4 - 2;
      k += `<rect x="${r(x)}" y="114" width="${r(w * 0.62)}" height="16" fill="${S.lg("theke" + a, [[0, "#f2f2f0"], [1, "#c9cbcc"]])}"/><rect x="${r(x)}" y="113" width="${r(w * 0.62)}" height="1.6" fill="#8a9298"/>`;
      k += `<rect x="${r(x + w * 0.62)}" y="124" width="${r(w * 0.38)}" height="6" fill="#5e676e"/><rect x="${r(x + w * 0.62)}" y="123.4" width="${r(w * 0.38)}" height="1" fill="#2a2e32"/>`;
      k += `<rect x="${r(x + w * 0.1)}" y="106" width="${r(w * 0.4)}" height="5" rx=".4" fill="#2a2e32"/><rect x="${r(x + w * 0.13)}" y="106.6" width="${r(w * 0.34)}" height="3.6" fill="#3a6aa8"/><rect x="${r(x + w * 0.28)}" y="111" width=".8" height="2" fill="#2a2e32"/>`;
      k += `<text x="${r(x + w * 0.31)}" y="108.8" font-size="1.6" text-anchor="middle" fill="#fff" font-family="Arial">${n0 + i}</text>`;
    }
  }
  S.teil({ id: "schalter", de: "der Schalter", syl: "SCHAL-ter", it: "il banco del check-in", itSyl: "BAN-co del check-IN", en: "check-in counter", x: 160, y: WU, kunst: abs(160, WU, k),
    tipp: "Am Check-in-Schalter gibt man den Koffer ab und bekommt die Bordkarte." });
}

/* =====================================================================
   DER GEPÄCKWAGEN, DIE REISENDE, DER KOFFER
   ===================================================================== */
{
  let k = schatten(0, 0.4, 18, 1.6, 0.3);
  k += `<path d="M-14 -4 L12 -4 L16 -30 M12 -4 L14 -1" stroke="#9aa3aa" stroke-width="1.2" fill="none"/>`;
  k += `<path d="M14 -30 L20 -31" stroke="#3a3e42" stroke-width="1.6" stroke-linecap="round"/>`;
  k += `<rect x="-14" y="-6" width="26" height="2" fill="#b9c1c7"/>`;
  for (const x of [-11, 9]) k += `<circle cx="${x}" cy="-1.6" r="1.6" fill="#2a2e32"/>`;
  k += `<rect x="-12" y="-18" width="20" height="12" rx="1.4" fill="${S.lg("koffer2", [[0, "#2a3a5a"], [1, "#1a2a44"]], 0, 0, 1, 0)}"/><path d="M-6 -18 L-6 -20 L2 -20 L2 -18" stroke="#1a1a1a" stroke-width=".6" fill="none"/>`;
  k += `<rect x="-10" y="-26" width="15" height="8" rx="2" fill="${S.lg("tasche", [[0, "#8a5a34"], [1, "#5e3a1e"]])}"/><path d="M-6 -26 Q-2.6 -30 1 -26" stroke="#3a2412" stroke-width=".6" fill="none"/>`;
  k += `<rect x="-12" y="-14" width="20" height=".6" fill="#3a4a6a"/>`;
  S.teil({ id: "gepaeckwagen", de: "der Gepäckwagen", syl: "ge-PÄCK-wa-gen", it: "il carrello portabagagli", itSyl: "car-REL-lo por-ta-ba-GA-gli", en: "luggage trolley", x: 262, y: 194, steht: true, kunst: k });
}
let HAND = null;
{
  const m = B.mensch({ id: "b23e_reisende", geschlecht: "w", pose: "stehen", blick: 30, frisur: "lang", haarfarbe: "braun", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "creme" }, jacke: { stueck: "mantel", farbe: "#7a3a2a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "schal", farbe: "#2f5f95" } } }, 86);
  const hs = [m.z.handL, m.z.handR].map((h) => ({ x: h.x * m.k, y: h.y * m.k })).sort((a, b) => a.x - b.x);
  HAND = { x: 62 + hs[0].x, y: 194 + hs[0].y };
  S.teil({ id: "reisende", de: "die Reisende", syl: "REI-sen-de", it: "la viaggiatrice", itSyl: "viag-gia-TRI-ce", en: "traveller", x: 62, y: 194, kunst: m.svg,
    tipp: "Die Reisende sucht ihren Flug auf der Anzeigetafel." });
}
{
  /* Rollkoffer mit ausgezogenem Teleskopgriff in ihrer Hand */
  const fx = HAND.x - 8, fy = 196;
  let k = schatten(0, 0.3, 9, 1.2, 0.3);
  k += `<rect x="-7" y="-30" width="14" height="28" rx="2.4" fill="${S.lg("koffer", [[0, "#3aa0a8"], [0.5, "#2a8a92"], [1, "#1e6a72"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-3.4, 0, 3.4]) k += `<line x1="${x}" y1="-29" x2="${x}" y2="-3" stroke="#1e6a72" stroke-width=".5"/>`;
  k += `<path d="M-6 -28 L-6 -6" stroke="#fff" stroke-width=".8" opacity=".25"/>`;
  for (const x of [-5, 5]) k += `<circle cx="${x}" cy="-1.2" r="1.2" fill="#1d1d1f"/>`;
  const gx = HAND.x - fx, gy = HAND.y - fy;
  k += `<path d="M-2.4 -30 L${r(gx - 2.4)} ${r(gy + 1.2)} M2.4 -30 L${r(gx + 2.4)} ${r(gy + 1.2)}" stroke="#9aa3aa" stroke-width=".7"/>`;
  k += `<rect x="${r(gx - 3.4)}" y="${r(gy - 0.4)}" width="6.8" height="1.8" rx=".8" fill="#2a2e32"/>`;
  k += `<rect x="-3" y="-33" width="6" height="1.6" rx=".8" fill="#1e6a72"/><rect x="-5" y="-22" width="4" height="2.6" rx=".4" fill="#f2f2ee"/>`;
  S.teil({ oben: true, id: "koffer", de: "der Koffer", syl: "KOF-fer", it: "la valigia", itSyl: "va-LI-gia", en: "suitcase", x: fx, y: fy, steht: true, kunst: k,
    tipp: "Ein Rollkoffer: Der Griff lässt sich herausziehen." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/weltstaedte.js"));
console.log(aus);
