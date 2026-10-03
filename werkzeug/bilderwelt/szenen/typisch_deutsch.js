#!/usr/bin/env node
/* =====================================================================
   KIRCHE & RATHAUS (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   (id typisch_deutsch: der Marktplatz einer deutschen Kleinstadt)
   ---------------------------------------------------------------------
   STANDORT: Marktplatz von Michelstadt im Odenwald (Hessen), Blick
   über den Platz auf das Rathaus; links dahinter die Stadtkirche.

   RECHERCHE (Deutsche Digitale Bibliothek, ADAC, Stadtführer):
   - Das RATHAUS von 1484 ist eines der wichtigsten spätgotischen
     Fachwerk-Rathäuser Deutschlands: unten eine offene Halle auf
     mächtigen Eichenpfosten (früher Markt und Gericht), darüber
     Fachwerk, ein sehr steiles Dach, an den vorderen Ecken zwei
     spitze ERKERTÜRMCHEN, auf dem First ein Dachreiter, eine Uhr.
   - Gegenüber steht der MARKTBRUNNEN (1575): achteckiges Becken aus
     rotem Sandstein, in der Mitte eine Säule mit dem Erzengel Michael.
   - Hinter dem Rathaus die STADTKIRCHE (1490) aus rotem
     Odenwald-Sandstein mit hohem Turm.
   - Rundherum FACHWERKHÄUSER mit Cafés und Gasthäusern: Sonnenschirme,
     Tische, Ausleger-Schilder, Geranien in Blumenkästen,
     Kopfsteinpflaster.
   - Typisch deutsch im Alltag: gelber Briefkasten, Fahrrad,
     Mülleimer mit Pfandflasche daneben („Pfand gehört daneben“),
     Klingelschild an der Haustür, Brezel und Bier im Café.
   Maßstab: Rathaus ≈ 9 Einheiten je Meter (Halle 3,5 m), Café vorne
   ≈ 30 je Meter (Tisch 0,75 m, Kellnerin 1,66 m). Augenhöhe y 136.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "typisch_deutsch", titel: "Kirche & Rathaus", emoji: "⛪", thema: "Deutschland", kuerzel: "tdx", fassung: 852 });
const rnd = zufall(1484);
const r = B.r;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const HORIZ = 136;
const PUTZ = S.lg("putz", [[0, "#fbf5e6"], [1, "#efe4cb"]]);
const BALKEN = "#7a3524";
const BALKEN_D = "#5e2718";
const SCHIEFER = S.lg("schiefer", [[0, "#5d6470"], [1, "#3e434c"]]);
const ZIEGEL = S.lg("ziegel", [[0, "#b4553a"], [1, "#8d3d28"]]);
const SANDSTEIN = S.lg("sandstein", [[0, "#c27b62"], [0.5, "#d18f75"], [1, "#a8624b"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#f5dc7a"], [1, "#b8892a"]]);
const GLAS = S.lg("glas", [[0, "#6c8396"], [1, "#3e5163"]]);

/* Fachwerkfeld: Putz, Ständer, Riegel, Streben, Fenster */
function fachwerk(x0, y0, w, h, felder, opt = {}) {
  let g = `<rect x="${r(x0)}" y="${r(y0)}" width="${r(w)}" height="${r(h)}" fill="${opt.putz || PUTZ}"/>`;
  const fw = w / felder, b = opt.b || 1.1, bc = opt.farbe || BALKEN;
  let p = `M${r(x0)} ${r(y0 + b / 2)} h${r(w)} M${r(x0)} ${r(y0 + h - b / 2)} h${r(w)} M${r(x0)} ${r(y0 + h * 0.62)} h${r(w)}`;
  for (let i = 0; i <= felder; i++) p += ` M${r(x0 + i * fw)} ${r(y0)} v${r(h)}`;
  g += `<path d="${p}" stroke="${bc}" stroke-width="${b}"/>`;
  let s = "";
  for (let i = 0; i < felder; i++) {
    const xa = x0 + i * fw, xb = xa + fw;
    if (opt.fenster && opt.fenster.includes(i)) {
      const fx = xa + fw * 0.2, fy = y0 + h * 0.18, fwid = fw * 0.6, fh = h * 0.4;
      g += `<rect x="${r(fx)}" y="${r(fy)}" width="${r(fwid)}" height="${r(fh)}" fill="${GLAS}" stroke="${bc}" stroke-width="${r(b * 0.7)}"/>`;
      g += `<path d="M${r(fx + fwid / 2)} ${r(fy)} v${r(fh)} M${r(fx)} ${r(fy + fh / 2)} h${r(fwid)}" stroke="#f4efe2" stroke-width="${r(b * 0.35)}"/>`;
      g += `<path d="M${r(fx + 0.4)} ${r(fy + fh - 0.4)} L${r(fx + fwid * 0.45)} ${r(fy + 0.4)}" stroke="#fff" stroke-width="${r(b * 0.3)}" opacity=".35"/>`;
    } else if (i % 2 === 0) s += ` M${r(xa)} ${r(y0 + h * 0.62)} L${r(xb)} ${r(y0)} M${r(xa)} ${r(y0 + h)} L${r(xa + fw * 0.5)} ${r(y0 + h * 0.62)}`;
    else s += ` M${r(xb)} ${r(y0 + h * 0.62)} L${r(xa)} ${r(y0)} M${r(xb)} ${r(y0 + h)} L${r(xb - fw * 0.5)} ${r(y0 + h * 0.62)}`;
  }
  if (s) g += `<path d="${s}" stroke="${bc}" stroke-width="${r(b * 0.85)}"/>`;
  return g;
}

/* =====================================================================
   KULISSE — Himmel und Hügel des Odenwalds
   ===================================================================== */
S.hinten(`<rect width="320" height="${HORIZ + 2}" fill="${S.lg("himmel", [[0, "#78acdc"], [0.7, "#c4dbee"], [1, "#eaf0f2"]])}"/>`);
S.hinten(`<g fill="#fff"><ellipse cx="246" cy="22" rx="30" ry="5" opacity=".85"/><ellipse cx="266" cy="18" rx="14" ry="5"/><ellipse cx="120" cy="12" rx="20" ry="3" opacity=".6"/></g>`);
S.hinten(`<path d="M0 112 Q40 98 90 104 Q150 92 210 102 Q270 94 320 104 L320 ${HORIZ} L0 ${HORIZ} Z" fill="${S.lg("huegel", [[0, "#8fae88"], [1, "#a9bfa0"]])}"/>`);
{
  let w = "";
  for (let x = 0; x < 320; x += 4 + rnd() * 3) w += `<ellipse cx="${r(x)}" cy="${r(104 + Math.sin(x / 30) * 4 + rnd() * 3)}" rx="${r(3 + rnd() * 2)}" ry="${r(2.4 + rnd())}" fill="${rnd() < 0.5 ? "#7d9e74" : "#93b189"}" opacity=".8"/>`;
  S.hinten(w);
}
/* Häuser hinten rechts neben dem Rathaus (Kulisse, Platzende) */
{
  let g = "";
  g += fachwerk(204, 104, 28, 34, 4, { fenster: [0, 2], b: 0.7 }) + `<path d="M202 104 L218 82 L234 104 Z" fill="${ZIEGEL}"/>`;
  g += `<rect x="204" y="138" width="28" height="12" fill="#e9dcc2"/><rect x="214" y="140" width="6" height="10" fill="#5a3a24"/>`;
  g += `<rect x="232" y="96" width="20" height="54" fill="#f1d9b5"/><path d="M230 96 L242 80 L254 96 Z" fill="${ZIEGEL}"/>`;
  for (const y of [102, 116]) for (const x of [235, 244]) g += `<rect x="${x}" y="${y}" width="5" height="7" fill="${GLAS}" stroke="#fff" stroke-width=".5"/>`;
  S.hinten(g);
}

/* =====================================================================
   1 — DAS KOPFSTEINPFLASTER (der Platz)
   ===================================================================== */
S.def(`<pattern id="${S.id("pfl")}" width="6" height="4" patternUnits="userSpaceOnUse"><rect width="6" height="4" fill="#6c665d"/><rect x=".3" y=".3" width="2.5" height="1.5" rx=".7" fill="#a49c8f"/><rect x="3.2" y=".3" width="2.5" height="1.5" rx=".7" fill="#b2aa9c"/><rect x="-1.2" y="2.2" width="2.5" height="1.5" rx=".7" fill="#9b9386"/><rect x="1.7" y="2.2" width="2.5" height="1.5" rx=".7" fill="#ada597"/><rect x="4.6" y="2.2" width="2.5" height="1.5" rx=".7" fill="#a0988b"/></pattern>`);
{
  let k = "";
  const baender = [[HORIZ, 150, 0.4], [150, 160, 0.55], [160, 172, 0.75], [172, 186, 1], [186, 200, 1.3]];
  baender.forEach(([a, b, s], i) => {
    S.def(`<pattern id="${S.id("pfl" + i)}" href="#${S.id("pfl")}" patternTransform="scale(${s})"/>`);
    k += `<rect x="-160" y="${a - 200}" width="320" height="${b - a}" fill="url(#${S.id("pfl" + i)})"/>`;
  });
  k += `<rect x="-160" y="${HORIZ - 200}" width="320" height="${200 - HORIZ}" fill="${S.lg("pfllicht", [[0, "#fff", 0.28], [0.35, "#fff", 0.06], [1, "#000", 0.1]])}"/>`;
  /* Rinne aus Granit quer über den Platz */
  k += `<path d="M-160 -22 Q0 -26 160 -22" stroke="#4f4a43" stroke-width="1.2" fill="none" opacity=".45"/>`;
  S.teil({ id: "pflaster", de: "das Kopfsteinpflaster", syl: "KOPF-stein-pflas-ter", it: "il selciato", itSyl: "sel-CIA-to", en: "cobblestones", x: 160, y: 200, kunst: k,
    tipp: "Viele alte Marktplätze in Deutschland haben Kopfsteinpflaster." });
}

/* =====================================================================
   2 — DIE KIRCHE (Stadtkirche aus rotem Sandstein, hinten links)
   ===================================================================== */
{
  let k = "";
  /* Langhaus mit steilem Dach (nach rechts hinter das Rathaus) */
  k += `<rect x="8" y="-40" width="60" height="40" fill="${SANDSTEIN}"/>`;
  k += `<path d="M6 -40 L18 -66 L66 -66 L70 -40 Z" fill="${SCHIEFER}"/>`;
  for (const x of [16, 30, 44, 58]) k += `<path d="M${x} -8 L${x} -28 Q${x + 2.5} -33 ${x + 5} -28 L${x + 5} -8 Z" fill="${GLAS}" stroke="#a8624b" stroke-width=".6"/><path d="M${x + 2.5} -30 v22" stroke="#d9c7b0" stroke-width=".35"/>`;
  for (const x of [12, 26, 40, 54, 66]) k += `<rect x="${x - 1}" y="-40" width="2.6" height="40" fill="#a8624b"/>`;
  /* Turm: quadratischer Schaft, Uhr, achteckiges Glockengeschoss, Spitzhelm */
  k += `<rect x="-11" y="-108" width="22" height="108" fill="${SANDSTEIN}"/>`;
  for (let y = -104; y < 0; y += 12) k += `<rect x="-11" y="${y}" width="22" height=".7" fill="#9b5843" opacity=".6"/>`;
  k += `<rect x="-11" y="-108" width="4" height="108" fill="#fff" opacity=".12"/>`;
  k += `<rect x="-2.4" y="-70" width="4.8" height="10" rx="2.4" fill="#4b3a33"/><rect x="-2.4" y="-44" width="4.8" height="10" rx="2.4" fill="#4b3a33"/>`;
  k += `<circle cx="0" cy="-90" r="6" fill="#283a52" stroke="${GOLD}" stroke-width="1"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<circle cx="${r(Math.sin(a) * 4.8)}" cy="${r(-90 - Math.cos(a) * 4.8)}" r=".45" fill="#f5dc7a"/>`; }
  k += `<path d="M0 -90 L-2.6 -91.6 M0 -90 L0 -94.6" stroke="#f5dc7a" stroke-width=".8" stroke-linecap="round"/>`;
  k += `<path d="M-12.4 -108 h24.8 v2 h-24.8 Z" fill="#9b5843"/>`;
  k += `<path d="M-9 -108 L-9 -122 L9 -122 L9 -108 Z" fill="${SANDSTEIN}"/><rect x="-5" y="-120" width="3" height="9" rx="1.5" fill="#3e302a"/><rect x="2" y="-120" width="3" height="9" rx="1.5" fill="#3e302a"/>`;
  k += `<path d="M-10 -122 L0 -154 L10 -122 Z" fill="${SCHIEFER}"/><path d="M-10 -122 L0 -154 L-3 -122 Z" fill="#fff" opacity=".1"/>`;
  k += `<line x1="0" y1="-154" x2="0" y2="-160" stroke="#8a6a2a" stroke-width=".7"/><circle cx="0" cy="-158" r="1" fill="${GOLD}"/><path d="M0 -161 l3.2 1 l-3.2 1 Z" fill="${GOLD}"/>`;
  S.teil({ id: "kirche", de: "die Kirche", syl: "KIR-che", it: "la chiesa", itSyl: "CHIE-sa", en: "church", x: 64, y: 146, steht: true, kunst: `<g transform="scale(.86)">${k}</g>`,
    tipp: "Die Stadtkirche ist aus rotem Sandstein gebaut — so wie viele Häuser im Odenwald." });
}

/* =====================================================================
   3 — DAS RATHAUS (spätgotisch, 1484) — mit Lupe
   ===================================================================== */
const RH = { x: 160, y: 150 };
{
  const unter = [];
  let k = schatten(0, 0.6, 50, 2.4, 0.3);
  /* Erdgeschoss: offene Halle auf Eichenpfosten */
  k += `<rect x="-46" y="-32" width="92" height="32" fill="${S.lg("halle", [[0, "#3a2c22"], [1, "#5a4636"]])}"/>`;
  k += `<rect x="-40" y="-18" width="80" height="18" fill="#4d3c2f"/><rect x="-14" y="-16" width="10" height="16" fill="#2c211a"/>`;
  for (const x of [-44, -22, 0, 22, 44]) {
    k += `<rect x="${x - 2}" y="-32" width="4" height="32" fill="${S.lg("eiche", [[0, "#6b4a2c"], [0.5, "#8d6a44"], [1, "#5a3d22"]], 0, 0, 1, 0)}"/>`;
    k += `<rect x="${x - 3}" y="-2" width="6" height="2" fill="#9a9184"/>`;
    if (x > -44) k += `<path d="M${x - 2} -26 Q${x - 7} -27 ${x - 10} -31.6" stroke="#6b4a2c" stroke-width="1.6" fill="none"/>`;
    if (x < 44) k += `<path d="M${x + 2} -26 Q${x + 7} -27 ${x + 10} -31.6" stroke="#6b4a2c" stroke-width="1.6" fill="none"/>`;
  }
  /* Schwelle */
  k += `<rect x="-49" y="-35" width="98" height="3.4" fill="${BALKEN_D}"/>`;
  /* 1. und 2. Obergeschoss in Fachwerk, jeweils etwas vorkragend */
  k += fachwerk(-48, -58, 96, 23, 8, { fenster: [1, 2, 5, 6], b: 1.2 });
  k += `<rect x="-49" y="-60" width="98" height="2.4" fill="${BALKEN_D}"/>`;
  k += fachwerk(-46, -80, 92, 20, 8, { fenster: [1, 3, 4, 6], b: 1.1 });
  /* Giebel, sehr steil, mit Fachwerk und Uhr */
  const giebel = "M-48 -80 L0 -136 L48 -80 Z";
  k += `<path d="M-52 -79 L0 -140 L52 -79 L48 -79 L0 -134 L-48 -79 Z" fill="${SCHIEFER}"/>`;
  k += `<path d="${giebel}" fill="${PUTZ}"/>`;
  let gb = "M-38 -92 h76 M-27 -105 h54 M-16 -118 h32";
  for (const x of [-30, -15, 0, 15, 30]) { const top = -80 - (48 - Math.abs(x)) * 56 / 48; gb += ` M${x} -80 L${x} ${r(top)}`; }
  gb += " M-30 -92 L-15 -80 M-15 -92 L-30 -80 M30 -92 L15 -80 M15 -92 L30 -80 M-15 -105 L0 -92 M15 -105 L0 -92";
  k += `<path d="${gb}" stroke="${BALKEN}" stroke-width="1" fill="none"/><path d="${giebel}" stroke="${BALKEN}" stroke-width="1.2" fill="none"/>`;
  for (const x of [-24, 18]) k += `<rect x="${x}" y="-90" width="6" height="7" fill="${GLAS}" stroke="${BALKEN}" stroke-width=".6"/>`;
  k += `<rect x="-3" y="-128" width="6" height="7" fill="${GLAS}" stroke="${BALKEN}" stroke-width=".6"/>`;
  /* Uhr im Giebel */
  const uy = -107;
  k += `<circle cx="0" cy="${uy}" r="7.4" fill="${BALKEN_D}"/><circle cx="0" cy="${uy}" r="6.4" fill="#1f3550"/><circle cx="0" cy="${uy}" r="6.4" fill="none" stroke="${GOLD}" stroke-width=".7"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<rect x="-.3" y="${r(uy - 5.6)}" width=".6" height="1.3" fill="#f5dc7a" transform="rotate(${i * 30} 0 ${uy})"/>`; }
  k += `<path d="M0 ${uy} L3 ${uy + 1.6} M0 ${uy} L-1.4 ${uy - 4.8}" stroke="#f5dc7a" stroke-width=".9" stroke-linecap="round"/><circle cx="0" cy="${uy}" r=".8" fill="#f5dc7a"/>`;
  unter.push({ id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: RH.x, y: RH.y + uy + 7.4, kunst: flaecheEllipse(0, -7.4, 7.6, 7.6),
    tipp: "Die Rathausuhr zeigt allen auf dem Markt die Zeit." });
  /* Dachreiter auf dem First */
  k += `<rect x="-3" y="-150" width="6" height="12" fill="${PUTZ}" stroke="${BALKEN}" stroke-width=".6"/><rect x="-1.6" y="-148" width="3.2" height="5" rx="1.6" fill="#3e302a"/><path d="M-1 -144.6 q1 -1.6 2 0 Z" fill="${GOLD}"/>`;
  k += `<path d="M-4 -150 L0 -166 L4 -150 Z" fill="${SCHIEFER}"/><line x1="0" y1="-166" x2="0" y2="-172" stroke="#6a5a2a" stroke-width=".5"/>`;
  k += `<path d="M0 -171.6 L4.2 -170.4 L4.2 -168.6 L0 -169.4 Z" fill="${GOLD}"/><circle cx="0" cy="-168" r=".7" fill="${GOLD}"/>`;
  unter.push({ id: "wetterfahne", de: "die Wetterfahne", syl: "WET-ter-fah-ne", it: "la banderuola", itSyl: "ban-de-RUO-la", en: "weather vane", x: RH.x + 1.6, y: RH.y - 166, kunst: flaeche(-3, -7, 7, 7.6),
    tipp: "Die Wetterfahne dreht sich mit dem Wind und zeigt, woher er weht." });
  unter.push({ id: "glocke", de: "die Glocke", syl: "GLO-cke", it: "la campana", itSyl: "cam-PA-na", en: "bell", x: RH.x, y: RH.y - 141, kunst: flaeche(-3, -8, 6, 8.4),
    tipp: "Im kleinen Dachreiter hängt eine Glocke." });
  /* zwei Erkertürmchen an den vorderen Ecken */
  for (const s of [-1, 1]) {
    const ex = s * 49;
    k += `<path d="M${ex - 6} -58 L${ex + 6} -58 L${ex + 3} -54 Q${ex} -50 ${ex - 3} -54 Z" fill="${BALKEN_D}"/>`;
    k += `<rect x="${ex - 6}" y="-86" width="12" height="28" fill="${PUTZ}"/>`;
    k += `<path d="M${ex - 6} -86 v28 M${ex - 2} -86 v28 M${ex + 2} -86 v28 M${ex + 6} -86 v28 M${ex - 6} -72 h12 M${ex - 6} -86 h12" stroke="${BALKEN}" stroke-width=".9"/>`;
    k += `<rect x="${ex - 1.4}" y="-83" width="2.8" height="8" fill="${GLAS}"/><rect x="${ex - 1.4}" y="-69" width="2.8" height="8" fill="${GLAS}"/>`;
    k += `<path d="M${ex - 7} -86 L${ex} -116 L${ex + 7} -86 Z" fill="${SCHIEFER}"/><path d="M${ex - 7} -86 L${ex} -116 L${ex - 2} -86 Z" fill="#fff" opacity=".12"/>`;
    k += `<line x1="${ex}" y1="-116" x2="${ex}" y2="-120" stroke="#6a5a2a" stroke-width=".5"/><circle cx="${ex}" cy="-119" r=".8" fill="${GOLD}"/>`;
  }
  unter.push({ id: "erker", de: "der Erker", syl: "ER-ker", it: "il bovindo", itSyl: "bo-VIN-do", en: "oriel turret", x: RH.x + 49, y: RH.y - 54, kunst: flaeche(-7, -66, 14, 66),
    tipp: "Ein Erker ragt aus der Wand heraus. Von dort sieht man den ganzen Markt." });
  unter.push({ id: "balken", de: "der Balken", syl: "BAL-ken", it: "la trave", itSyl: "TRA-ve", en: "beam", x: RH.x, y: RH.y - 90, kunst: flaeche(-34, -4, 68, 4.4),
    tipp: "Die Balken aus Eichenholz bilden das Gerüst des Fachwerks — seit über 500 Jahren." });
  const SK = 0.82;
  unter.forEach((u) => { u.x = RH.x + (u.x - RH.x) * SK; u.y = RH.y + (u.y - RH.y) * SK; u.kunst = `<g transform="scale(${SK})">${u.kunst}</g>`; });
  k = `<g transform="scale(${SK})">${k}</g>`;
  S.teil({ id: "rathaus", de: "das Rathaus", syl: "RAT-haus", it: "il municipio", itSyl: "mu-ni-CI-pio", en: "town hall", x: RH.x, y: RH.y, steht: true, kunst: k,
    zoom: { x: RH.x - 66, y: 6, w: 132, h: 88 }, unter,
    tipp: "Im Rathaus arbeiten der Bürgermeister und die Stadtverwaltung." });
}

/* =====================================================================
   4 — LINKE HÄUSERZEILE (Kulisse) mit Briefkasten
   ===================================================================== */
{
  let g = "";
  g += `<rect x="-4" y="116" width="48" height="44" fill="#efe1c4"/>`;
  g += fachwerk(-4, 76, 48, 40, 5, { fenster: [0, 2, 4], b: 1.3 });
  g += `<path d="M-8 77 L20 30 L48 77 Z" fill="${ZIEGEL}"/><path d="M-6 77 L20 34 L46 77 Z" fill="${PUTZ}"/>`;
  g += `<path d="M6 77 L6 60 M20 77 L20 40 M34 77 L34 60 M2 66 h36 M10 52 h20" stroke="${BALKEN}" stroke-width="1.2"/>`;
  g += `<rect x="15" y="54" width="10" height="9" fill="${GLAS}" stroke="${BALKEN}" stroke-width=".8"/>`;
  g += `<rect x="4" y="124" width="12" height="18" fill="${GLAS}" stroke="#d8c8a8" stroke-width="1.2"/><rect x="26" y="128" width="12" height="32" fill="#5a3a24" stroke="#d8c8a8" stroke-width="1.2"/><circle cx="35" cy="145" r=".7" fill="#e1c46a"/>`;
  g += `<rect x="-4" y="158" width="48" height="2.4" fill="#b8a888"/>`;
  S.hinten(g);
}
{
  /* 5 — DER BRIEFKASTEN (gelb, an der Hauswand) */
  let k = `<path d="M-4 -8 L4 -8 Q5 -8 5 -7 L5 0 L-5 0 L-5 -7 Q-5 -8 -4 -8 Z" fill="${S.lg("bk", [[0, "#ffd84a"], [1, "#e5b400"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-5 -8 Q0 -11.6 5 -8 Z" fill="#f2c300"/><rect x="-3.4" y="-6.6" width="6.8" height="1" rx=".4" fill="#222"/>`;
  k += `<path d="M-1.8 -3 q1.8 -1.6 3.6 0 q-.4 1.2 -1.8 1 q-1.4 .2 -1.8 -1 Z M1.8 -3 l1 -.6" stroke="#222" stroke-width=".3" fill="none"/>`;
  k += `<rect x="-4" y="-1.4" width="8" height=".9" fill="#fff" opacity=".85"/><path d="M-4.4 -7.6 v6" stroke="#fff" stroke-width=".5" opacity=".35"/>`;
  S.teil({ id: "briefkasten", de: "der Briefkasten", syl: "BRIEF-kas-ten", it: "la cassetta delle lettere", itSyl: "cas-SET-ta del-le LET-te-re", en: "postbox", x: 10, y: 152, kunst: k,
    tipp: "In Deutschland sind die Briefkästen gelb." });
}

/* =====================================================================
   6 — DER BRUNNEN (Marktbrunnen mit Säule und Michaelsfigur)
   ===================================================================== */
{
  let k = schatten(0, 0.6, 30, 2.4, 0.3);
  /* Säule mit Kapitell und Figur */
  k += `<rect x="-2.4" y="-60" width="4.8" height="52" fill="${SANDSTEIN}"/><rect x="-2.4" y="-60" width="1.4" height="52" fill="#fff" opacity=".15"/>`;
  k += `<rect x="-4" y="-63" width="8" height="3" fill="#a8624b"/><rect x="-3.2" y="-65" width="6.4" height="2" fill="#c27b62"/>`;
  k += `<path d="M-2.2 -65 L-2.6 -76 Q0 -79 2.6 -76 L2.2 -65 Z" fill="${S.lg("figur", [[0, "#c8b796"], [1, "#9a876a"]], 0, 0, 1, 0)}"/><circle cx="0" cy="-80" r="2" fill="#bfae8c"/>`;
  k += `<path d="M2.4 -74 L5.4 -85" stroke="#8d7b5d" stroke-width=".7"/><path d="M-2.6 -73 q-3 1 -3 4 q1.6 1.4 3 0 Z" fill="#a8956f"/>`;
  k += `<path d="M-2 -76 q-4 -4 -3 -9 q2 3 3.4 5 M2 -76 q4 -4 3 -9 q-2 3 -3.4 5" fill="#b9a885"/>`;
  /* Wasserspeier */
  for (const s of [-1, 1]) k += `<path d="M${s * 2.4} -36 l${s * 3} .4" stroke="#8a8a8a" stroke-width=".8"/><path d="M${s * 5.4} -35.4 q${s * 4} 2 ${s * 6} 12" stroke="#d6ecf4" stroke-width=".7" fill="none" opacity=".9"/>`;
  /* achteckiges Becken: drei sichtbare Seiten */
  k += `<path d="M-26 -10 L-14 -14 L14 -14 L26 -10 L26 0 L14 3 L-14 3 L-26 0 Z" fill="${SANDSTEIN}"/>`;
  k += `<path d="M-26 -10 L-14 -6 L14 -6 L26 -10 L14 -14 L-14 -14 Z" fill="${S.lg("wasser", [[0, "#9ec7d8"], [1, "#6f9fb6"]])}"/>`;
  k += `<path d="M-14 -6 L-14 3 M14 -6 L14 3" stroke="#9b5843" stroke-width=".6"/><path d="M-26 -10 L-14 -6 L14 -6 L26 -10" stroke="#e1a58c" stroke-width="1" fill="none"/>`;
  k += `<rect x="-10" y="-3" width="20" height="4" rx=".6" fill="#b06a52"/><text x="0" y="0" font-size="2.6" text-anchor="middle" fill="#f5e3c8" font-family="Georgia,serif">1575</text>`;
  /* Blumen am Beckenrand */
  for (let i = 0; i < 8; i++) k += `<circle cx="${r(-22 + i * 6.2)}" cy="${r(-13 + Math.abs(i - 3.5) * 0.3)}" r="1.2" fill="${i % 2 ? "#d8382c" : "#e85d75"}"/><circle cx="${r(-21 + i * 6.2)}" cy="${r(-11.6 + Math.abs(i - 3.5) * 0.3)}" r="1" fill="#4f7d3a"/>`;
  S.teil({ id: "brunnen", de: "der Brunnen", syl: "BRUN-nen", it: "la fontana", itSyl: "fon-TA-na", en: "fountain", x: 86, y: 164, steht: true, kunst: k,
    tipp: "Der Marktbrunnen ist über 400 Jahre alt. Früher holten die Leute hier ihr Wasser." });
}

/* =====================================================================
   7 — DIE BANK vor dem Rathaus
   ===================================================================== */
{
  let k = schatten(0, 0.4, 18, 1.2, 0.3);
  const holz = S.lg("bankholz", [[0, "#7a9a5a"], [1, "#4f6e3c"]]);
  for (const x of [-14, 14]) k += `<path d="M${x - 1} 0 L${x - 1} -8 M${x + 1} 0 L${x + 1} -8" stroke="#2f3438" stroke-width="1.1"/><path d="M${x} -8 L${x} -17" stroke="#2f3438" stroke-width="1.1"/>`;
  for (let i = 0; i < 2; i++) k += `<rect x="-17" y="${-9 + i * 1.6}" width="34" height="1.3" rx=".4" fill="${holz}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="-17" y="${-17.4 + i * 2.6}" width="34" height="1.8" rx=".5" fill="${holz}"/>`;
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: 150, y: 168, steht: true, kunst: k });
}

/* =====================================================================
   8 — DAS FACHWERKHAUS (rechts, mit Café) — mit Lupe
   ===================================================================== */
const FH = { x0: 226, x1: 322, y: 162 };
{
  const unter = [];
  const W = FH.x1 - FH.x0;
  let k = schatten(0, 0.4, W / 2, 1.6, 0.25);
  /* Erdgeschoss aus Sandstein mit Schaufenster und Haustür */
  k += `<rect x="${-W / 2}" y="-48" width="${W}" height="48" fill="${S.lg("eg", [[0, "#e2c7a8"], [1, "#cfae8c"]])}"/>`;
  k += `<rect x="${-W / 2 + 6}" y="-40" width="40" height="28" rx="1" fill="${GLAS}" stroke="#7a3524" stroke-width="1.4"/>`;
  k += `<path d="M${-W / 2 + 26} -40 v28" stroke="#7a3524" stroke-width="1"/><path d="M${-W / 2 + 8} -14 L${-W / 2 + 22} -38" stroke="#fff" stroke-width=".8" opacity=".25"/>`;
  k += `<text x="${-W / 2 + 26}" y="-30" font-size="3.4" text-anchor="middle" fill="#f6e6c0" font-family="Georgia,serif" font-style="italic">Kaffee &amp; Kuchen</text>`;
  /* Haustür mit Oberlicht */
  const tx = W / 2 - 16;
  k += `<rect x="${tx - 8}" y="-38" width="16" height="38" rx="1" fill="#e9d8bc"/><path d="M${tx - 6} 0 L${tx - 6} -30 Q${tx} -36 ${tx + 6} -30 L${tx + 6} 0 Z" fill="${S.lg("tuer", [[0, "#5a7a4a"], [1, "#3f5a33"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${tx - 4.6} -2 v-12 h9.2 v12 M${tx - 4.6} -17 v-10 h9.2 v10" stroke="#2f4426" stroke-width=".6" fill="none"/><path d="M${tx - 6} -30 Q${tx} -36 ${tx + 6} -30 Z" fill="${GLAS}"/>`;
  k += `<circle cx="${tx + 4}" cy="-15" r=".8" fill="#e1c46a"/><rect x="${tx - 7}" y="0" width="14" height="1.4" fill="#9a9184"/>`;
  unter.push({ id: "haustuer", de: "die Haustür", syl: "HAUS-tür", it: "il portone", itSyl: "por-TO-ne", en: "front door", x: FH.x0 + W / 2 + tx, y: FH.y, kunst: flaeche(-6, -35, 12, 35) });
  /* Klingelschild neben der Tür */
  const kx = tx + 10.5;
  k += `<rect x="${kx - 1.6}" y="-22" width="3.2" height="7.4" rx=".4" fill="${S.lg("messing", [[0, "#e8cf86"], [1, "#b99a4a"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${kx - 1.2}" y="${-21.2 + i * 2.2}" width="1.6" height="1.4" fill="#f8f4ea"/><circle cx="${kx + 0.9}" cy="${-20.5 + i * 2.2}" r=".45" fill="#6b5a2a"/>`;
  unter.push({ id: "klingelschild", de: "das Klingelschild", syl: "KLIN-gel-schild", it: "il citofono", itSyl: "ci-TO-fo-no", en: "doorbell panel", x: FH.x0 + W / 2 + kx, y: FH.y - 14, kunst: flaeche(-2.6, -9, 5.2, 9.4),
    tipp: "Auf dem Klingelschild stehen die Namen der Leute, die im Haus wohnen." });
  /* Hausnummer: blaues Emailleschild */
  k += `<rect x="${tx - 3}" y="-44" width="6" height="4" rx=".6" fill="#1f4f8f" stroke="#fff" stroke-width=".4"/><text x="${tx}" y="-41" font-size="3" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">7</text>`;
  unter.push({ id: "hausnummer", de: "die Hausnummer", syl: "HAUS-num-mer", it: "il numero civico", itSyl: "NU-me-ro CI-vi-co", en: "house number", x: FH.x0 + W / 2 + tx, y: FH.y - 39.6, kunst: flaeche(-3.4, -4.8, 6.8, 5.2) });
  /* Obergeschosse in Fachwerk, vorkragend */
  k += `<rect x="${-W / 2 - 2}" y="-52" width="${W + 2}" height="4" fill="${BALKEN_D}"/>`;
  k += fachwerk(-W / 2 - 2, -96, W + 2, 44, 6, { fenster: [0, 2, 4], b: 1.6 });
  k += `<rect x="${-W / 2 - 4}" y="-100" width="${W + 4}" height="4" fill="${BALKEN_D}"/>`;
  k += fachwerk(-W / 2 - 4, -142, W + 4, 42, 6, { fenster: [1, 3, 5], b: 1.6 });
  k += `<rect x="${-W / 2 - 6}" y="-146" width="${W + 6}" height="4" fill="${BALKEN_D}"/>`;
  k += `<path d="M${-W / 2 - 8} -146 L${-W / 2 + 12} -162 L${W / 2} -162 L${W / 2} -146 Z" fill="${ZIEGEL}"/>`;
  for (let i = 1; i < 4; i++) k += `<path d="M${r(-W / 2 - 8 + i * 5)} ${r(-146 - i * 4)} H${W / 2}" stroke="#7a3322" stroke-width=".35"/>`;
  /* Blumenkästen mit Geranien unter den Fenstern des 1. OG */
  const fw = (W + 2) / 6;
  [0, 2, 4].forEach((i, n) => {
    const bx = -W / 2 - 2 + i * fw + fw * 0.15, by = -96 + 44 * 0.6 + 0.6, bw = fw * 0.7;
    k += `<rect x="${r(bx)}" y="${r(by)}" width="${r(bw)}" height="3.2" rx=".6" fill="#7a5a3a"/>`;
    for (let j = 0; j < 7; j++) k += `<circle cx="${r(bx + 1.2 + j * (bw - 2.4) / 6)}" cy="${r(by - 1 - (j % 2) * 1.2)}" r="1.5" fill="${j % 3 ? "#d8282c" : "#4f7d3a"}"/>`;
    k += `<path d="M${r(bx + 1)} ${r(by + 1.6)} q${r(bw / 2)} 3 ${r(bw - 2)} 0" stroke="#5f8f45" stroke-width="1" fill="none"/>`;
    if (n === 1) unter.push({ id: "blumenkasten", de: "der Blumenkasten", syl: "BLU-men-kas-ten", it: "la fioriera", itSyl: "fio-RIE-ra", en: "window box", x: FH.x0 + W / 2 + bx + bw / 2, y: FH.y + by + 3.4, kunst: flaeche(-bw / 2, -6.6, bw, 7),
      tipp: "Rote Geranien im Blumenkasten — typisch für Fachwerkhäuser." });
  });
  S.teil({ id: "fachwerkhaus", de: "das Fachwerkhaus", syl: "FACH-werk-haus", it: "la casa a graticcio", itSyl: "CA-sa a gra-TIC-cio", en: "half-timbered house", x: FH.x0 + W / 2, y: FH.y, steht: true, kunst: k,
    zoom: { x: FH.x0 + 18, y: FH.y - 82, w: 78, h: 52 }, unter,
    tipp: "Beim Fachwerkhaus sieht man das Holzgerüst. Unten ist ein Café." });
}

/* 9 — DAS SCHILD (Ausleger des Cafés) */
{
  let k = `<path d="M0 0 L-24 0 M0 -4 Q-10 -8 -24 0 M-6 0 q-2 3 -5 2" stroke="#2a2a2a" stroke-width=".8" fill="none"/>`;
  k += `<circle cx="-14" cy="-3.6" r="1.6" fill="none" stroke="#2a2a2a" stroke-width=".5"/>`;
  k += `<line x1="-21" y1="0" x2="-21" y2="3" stroke="#2a2a2a" stroke-width=".4"/><line x1="-9" y1="0" x2="-9" y2="3" stroke="#2a2a2a" stroke-width=".4"/>`;
  k += `<rect x="-24" y="3" width="18" height="12" rx="1" fill="${GOLD}"/><rect x="-23" y="4" width="16" height="10" rx=".6" fill="#2c4a3a"/>`;
  k += `<text x="-15" y="8.4" font-size="2.6" text-anchor="middle" fill="#f5dc7a" font-family="Georgia,serif" font-weight="bold">Café</text><text x="-15" y="12" font-size="2" text-anchor="middle" fill="#f5dc7a" font-family="Georgia,serif">am Markt</text>`;
  S.teil({ oben: true, id: "schild", de: "das Schild", syl: "SCHILD", it: "l'insegna", itSyl: "in-SE-gna", en: "sign", x: FH.x0 - 1, y: 66, kunst: k });
}

/* =====================================================================
   10 — DER MÜLLEIMER und 11 — DIE PFANDFLASCHE
   ===================================================================== */
{
  let k = schatten(0, 0.3, 6, 1, 0.3);
  k += `<rect x="-.8" y="-26" width="1.6" height="26" fill="#2f3438"/>`;
  k += `<path d="M-5.6 -24 L5.6 -24 L5 -8 Q0 -6.6 -5 -8 Z" fill="${S.lg("eimer", [[0, "#3f6b4a"], [0.5, "#5a8a64"], [1, "#2f5238"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="-24" rx="5.6" ry="1.4" fill="#2a2e31"/><path d="M-6 -24.6 Q0 -28 6 -24.6" stroke="#2f3438" stroke-width=".8" fill="none"/>`;
  for (const x of [-3, 0, 3]) k += `<line x1="${x}" y1="-22" x2="${x * 0.9}" y2="-9" stroke="#2f5238" stroke-width=".5"/>`;
  /* Pfandring am Mast */
  k += `<ellipse cx="0" cy="-6" rx="5" ry="1.2" fill="none" stroke="#9aa3aa" stroke-width=".8"/>`;
  S.teil({ id: "muelleimer", de: "der Mülleimer", syl: "MÜLL-ei-mer", it: "il cestino", itSyl: "ce-STI-no", en: "litter bin", x: 196, y: 178, steht: true, kunst: k,
    tipp: "Am Ring unten am Mülleimer kann man Pfandflaschen abstellen — so muss niemand im Müll suchen." });
  let f = `<path d="M-1 0 L-1 -5 Q-1 -6.4 -.5 -7 L-.5 -9 L.5 -9 L.5 -7 Q1 -6.4 1 -5 L1 0 Z" fill="${S.lg("flasche", [[0, "#7a4a1c"], [0.5, "#a8692c"], [1, "#5e3510"]], 0, 0, 1, 0)}"/>`;
  f += `<rect x="-1" y="-4" width="2" height="2" fill="#e8dcc2"/><rect x="-.5" y="-9.4" width="1" height=".6" fill="#c8c8c8"/><path d="M-.6 -6.6 v5" stroke="#fff" stroke-width=".3" opacity=".5"/>`;
  S.teil({ oben: true, id: "pfandflasche", de: "die Pfandflasche", syl: "PFAND-fla-sche", it: "la bottiglia con cauzione", itSyl: "bot-TI-glia con cau-ZIO-ne", en: "deposit bottle", x: 199.6, y: 172.2, steht: true, kunst: f + flaeche(-2, -10, 4, 10.4),
    tipp: "Für Pfandflaschen gibt es im Supermarkt Geld zurück — 8 bis 25 Cent." });
}

/* =====================================================================
   12 — DIE TAUBE (zwei Tauben auf dem Pflaster)
   ===================================================================== */
{
  const taube = (s) => {
    let g = `<ellipse cx="0" cy="-2.4" rx="3.4" ry="2.2" fill="#8d939c"/><path d="M-3 -2.6 L-6 -1.6 L-3.2 -1.4 Z" fill="#6c727a"/>`;
    g += `<path d="M-1.6 -3.6 Q.6 -4.6 2 -2.6" stroke="#6c727a" stroke-width=".8" fill="none"/><circle cx="2.6" cy="-4.6" r="1.3" fill="#7d838c"/><path d="M1.8 -3.6 q.8 .6 1.8 0" stroke="#6aa58a" stroke-width=".6" fill="none"/>`;
    g += `<path d="M3.8 -4.8 l1 .3 l-1 .3 Z" fill="#c9a"/><circle cx="2.9" cy="-5" r=".25" fill="#d84"/><path d="M-.4 -.4 v.6 M.8 -.4 v.6" stroke="#c76" stroke-width=".4"/>`;
    return `<g transform="scale(${s} 1)">${g}</g>`;
  };
  const k = schatten(0, 0.2, 4, 0.6, 0.25) + taube(1) + `<g transform="translate(10 1.6) scale(.95)">${schatten(0, 0.2, 4, 0.6, 0.25)}${taube(-1)}</g>` + flaeche(-6, -7, 20, 8.6);
  S.teil({ oben: true, id: "taube", de: "die Taube", syl: "TAU-be", it: "il piccione", itSyl: "pic-CIO-ne", en: "pigeon", x: 124, y: 184, kunst: k });
}

/* =====================================================================
   13 — DAS FAHRRAD (an der Hauswand links)
   ===================================================================== */
{
  let k = schatten(0, 0.3, 20, 1.4, 0.3);
  const rad = (cx) => `<circle cx="${cx}" cy="-8.4" r="8.2" fill="none" stroke="#1f2326" stroke-width="1.4"/><circle cx="${cx}" cy="-8.4" r="7.2" fill="none" stroke="#b9c1c8" stroke-width=".25"/>` +
    [0, 1, 2, 3, 4, 5].map((i) => `<line x1="${cx}" y1="-8.4" x2="${r(cx + Math.cos(i * Math.PI / 3 + 0.3) * 7.2)}" y2="${r(-8.4 + Math.sin(i * Math.PI / 3 + 0.3) * 7.2)}" stroke="#b9c1c8" stroke-width=".22"/>`).join("") + `<circle cx="${cx}" cy="-8.4" r=".8" fill="#777"/>`;
  k += rad(-12.4) + rad(12.4);
  k += `<path d="M-12.4 -8.4 L-4 -19.6 L9 -19.6 L12.4 -8.4 M-4 -19.6 L0 -8.4 L9 -19.6 M0 -8.4 L-12.4 -8.4" stroke="#b8272a" stroke-width="1.4" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="M-4 -19.6 L-5 -22.4 M-7.4 -22.8 L-2.4 -22.8" stroke="#222" stroke-width="1.1" stroke-linecap="round"/>`;
  k += `<path d="M9 -19.6 L8.2 -23.6 M6.4 -24 q2.2 -.8 4.2 .2" stroke="#222" stroke-width="1" fill="none" stroke-linecap="round"/>`;
  /* Gepäckträger mit Korb */
  k += `<path d="M-16 -18.6 L-4 -18.6 M-16 -18.6 L-12.4 -8.4" stroke="#444" stroke-width=".6"/><path d="M-17 -18.6 L-5 -18.6 L-6 -24 L-16 -24 Z" fill="#a87c48" stroke="#7a5a2a" stroke-width=".4"/>`;
  k += `<path d="M-15 -21 h8 M-15 -23 h8" stroke="#7a5a2a" stroke-width=".3"/><ellipse cx="-11" cy="-24.6" rx="2.6" ry="1.2" fill="#c98b44"/>`;
  k += `<circle cx="0" cy="-8.4" r="1.6" fill="#444"/><path d="M11 -21.6 q2 .3 2.4 2" stroke="#ddd" stroke-width=".8" fill="none"/><rect x="10.6" y="-21" width="2.4" height="1.6" rx=".4" fill="#f2f2f0"/>`;
  S.teil({ id: "fahrrad", de: "das Fahrrad", syl: "FAHR-rad", it: "la bicicletta", itSyl: "bi-ci-CLET-ta", en: "bicycle", x: 34, y: 176, steht: true, kunst: k,
    tipp: "Viele Deutsche fahren mit dem Fahrrad zum Bäcker oder zur Arbeit." });
}

/* =====================================================================
   14 — DIE LATERNE (alte Gaslaterne, links vorne)
   ===================================================================== */
{
  let k = schatten(0, 0.3, 5, 1, 0.3);
  const mast = S.lg("mast", [[0, "#2a3035"], [0.5, "#58626a"], [1, "#22272b"]], 0, 0, 1, 0);
  k += `<path d="M-3.6 0 L3.6 0 L2.4 -6 L-2.4 -6 Z" fill="${mast}"/><rect x="-1.2" y="-70" width="2.4" height="64" fill="${mast}"/>`;
  k += `<rect x="-2" y="-34" width="4" height="2" fill="#2a3035"/><path d="M-1.2 -70 h-6 M1.2 -70 h6" stroke="#2a3035" stroke-width=".8"/>`;
  k += `<path d="M-5 -72 L5 -72 L7 -84 L-7 -84 Z" fill="${S.lg("leuchte", [[0, "#fff9e0"], [1, "#f3e3a8"]])}" stroke="#2a3035" stroke-width=".9"/>`;
  k += `<path d="M-1.6 -72 L-2.2 -84 M1.6 -72 L2.2 -84" stroke="#2a3035" stroke-width=".5"/><path d="M-8 -84 L8 -84 L0 -90 Z" fill="#2a3035"/><circle cx="0" cy="-91" r="1" fill="#2a3035"/>`;
  S.teil({ id: "strassenlaterne", de: "die Laterne", syl: "La-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: 62, y: 188, steht: true, kunst: k });
}

/* =====================================================================
   CAFÉ vorne rechts: 15 Sonnenschirm, 16 Tisch, 17 Stuhl, 18 Bier,
   19 Brezel, 20 Kellnerin
   ===================================================================== */
const TISCH = { x: 276, y: 190, h: 22 };
{
  let k = `<rect x="-.7" y="-80" width="1.4" height="80" fill="#e9e4da"/>`;
  k += `<path d="M-46 -64 Q-20 -78 0 -82 Q20 -78 46 -64 Z" fill="${S.lg("schirm", [[0, "#fbf7ee"], [1, "#e4dccb"]])}"/>`;
  for (const x of [-30, -12, 12, 30]) k += `<path d="M0 -82 Q${x * 0.6} -76 ${x} ${-64 - (46 - Math.abs(x)) * 0.12}" stroke="#d2c8b4" stroke-width=".5" fill="none"/>`;
  let vol = "";
  for (let x = -46; x < 46; x += 7.66) vol += `<path d="M${r(x)} -64 h7.66 v3.4 q-3.83 2 -7.66 0 Z" fill="#2c4a3a"/>`;
  k += vol + `<text x="0" y="-61.6" font-size="2.6" text-anchor="middle" fill="#f5dc7a" font-family="Georgia,serif">Café am Markt</text>`;
  S.teil({ id: "sonnenschirm", de: "der Sonnenschirm", syl: "SON-nen-schirm", it: "l'ombrellone", itSyl: "om-brel-LO-ne", en: "parasol", x: TISCH.x - 4, y: TISCH.y - 2, kunst: k + flaeche(-46, -84, 92, 24) + flaeche(-2, -60, 4, 40) });
}
{
  let k = schatten(0, 0.4, 14, 1.2, 0.3);
  k += `<path d="M-1.4 0 L-1.4 -${TISCH.h - 2} L1.4 -${TISCH.h - 2} L1.4 0 Z" fill="#2f3438"/><path d="M-8 0 L8 0 L0 -3 Z" fill="#2f3438"/>`;
  k += `<ellipse cx="0" cy="-${TISCH.h}" rx="16" ry="3.4" fill="${S.lg("platte", [[0, "#f3efe7"], [1, "#cfc8bb"]])}"/><path d="M-16 -${TISCH.h} q16 4.6 32 0 v1.2 q-16 4.6 -32 0 Z" fill="#a9a194"/>`;
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: TISCH.x, y: TISCH.y, steht: true, kunst: k });
}
{
  /* Bierglas (Weizenglas) auf dem Tisch */
  let k = `<path d="M-2.4 0 L-2.6 -4 Q-3.4 -8 -2.6 -12 L2.6 -12 Q3.4 -8 2.6 -4 L2.4 0 Z" fill="${S.lg("bier", [[0, "#f4b437"], [1, "#d9891a"]])}"/>`;
  k += `<path d="M-2.8 -12 Q0 -15.4 2.8 -12 Z" fill="#fffaf0"/><ellipse cx="0" cy="-12.2" rx="2.9" ry="1" fill="#fffdf6"/>`;
  k += `<path d="M-1.8 -10 v8" stroke="#fff" stroke-width=".6" opacity=".5"/><ellipse cx="0" cy="0" rx="3" ry=".7" fill="#fff" opacity=".7"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(-1.4 + rnd() * 2.8)}" cy="${r(-2 - rnd() * 8)}" r=".22" fill="#fff4cc"/>`;
  S.teil({ oben: true, id: "bier", de: "das Bier", syl: "BIER", it: "la birra", itSyl: "BIR-ra", en: "beer", x: TISCH.x + 7, y: TISCH.y - TISCH.h + 0.4, steht: true, kunst: k,
    tipp: "In Deutschland gibt es über 1.500 Brauereien. Für Bier gilt seit 1516 das Reinheitsgebot." });
}
{
  /* Brezel auf einem Teller */
  let k = `<ellipse cx="0" cy="0" rx="6.4" ry="1.6" fill="#fdfcf8" stroke="#d9d4c8" stroke-width=".3"/>`;
  const L = S.rg("lauge", [[0, "#b36a2c"], [0.6, "#8a4614"], [1, "#5e2c0a"]], 0.4, 0.35, 0.8);
  k += `<path d="M-4.6 -.8 C-6.6 -3.4 -4.4 -7.6 -.8 -6.6 C1.4 -6 1.6 -3.4 .4 -1.8 M4.6 -.8 C6.6 -3.4 4.4 -7.6 .8 -6.6 C-1.4 -6 -1.6 -3.4 -.4 -1.8" stroke="${L}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M-2.6 -1.6 L2.6 -1.6" stroke="${L}" stroke-width="1.4" stroke-linecap="round"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(-4 + rnd() * 8)}" cy="${r(-6 + rnd() * 4.4)}" r=".3" fill="#fffaf0"/>`;
  S.teil({ oben: true, id: "brezel", de: "die Brezel", syl: "BRE-zel", it: "il pretzel", itSyl: "PRET-zel", en: "pretzel", x: TISCH.x - 6, y: TISCH.y - TISCH.h + 0.6, steht: true, kunst: k + flaeche(-6.6, -8, 13.2, 9.8),
    tipp: "Zur Brezel und zum Bier sagt man in Bayern: „a Brezn und a Mass“." });
}
{
  /* Bistrostuhl rechts am Tisch */
  let k = schatten(0, 0.3, 8, 1, 0.3);
  const st = "#2f3438";
  k += `<path d="M-6 0 L-5 -13 M5 0 L4.4 -13 M-4 0 L-4.4 -12 M3.6 0 L3.8 -12" stroke="${st}" stroke-width="1"/>`;
  k += `<ellipse cx="0" cy="-13.4" rx="7" ry="2" fill="${S.lg("sitz", [[0, "#5a7a4a"], [1, "#3f5a33"]])}"/>`;
  k += `<path d="M4.4 -13 L6.4 -30 M-5 -13 L-3.2 -30" stroke="${st}" stroke-width="1"/><path d="M-3.6 -30 Q1.4 -32.6 6.8 -30 L6.4 -27 Q1.4 -29.4 -3.4 -27 Z" fill="#3f5a33"/>`;
  for (const y of [-25, -21]) k += `<path d="M${-3} ${y} Q1.4 ${y - 2.2} 6 ${y}" stroke="${st}" stroke-width=".6" fill="none"/>`;
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: TISCH.x + 26, y: TISCH.y + 2, steht: true, kunst: k });
}
{
  const m = B.mensch({ id: "tdx_kell", geschlecht: "w", pose: "servieren", blick: 62, frisur: "zopf", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "weiss" }, schuerze: { stueck: "schuerze", farbe: "schwarz" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 56);
  /* Tablett mit einer Tasse Kaffee auf der erhobenen Hand */
  const hand = [m.z.handL, m.z.handR].filter(Boolean).sort((p, q) => (p.y != null ? p.y : p[1]) - (q.y != null ? q.y : q[1]))[0];
  const hx = (hand.x != null ? hand.x : hand[0]) * m.k, hy = (hand.y != null ? hand.y : hand[1]) * m.k;
  const tablett = `<g transform="translate(${r(hx)} ${r(hy - 1)})"><ellipse cx="0" cy="0" rx="7" ry="1.6" fill="#3a3f44"/><ellipse cx="0" cy="-.4" rx="6.4" ry="1.2" fill="#5a6168"/>` +
    `<ellipse cx="-2" cy="-.8" rx="2.6" ry=".7" fill="#f4f2ec"/><path d="M-3.8 -4.6 h3.6 l-.4 3.6 h-2.8 Z" fill="#fbfbfa"/><ellipse cx="-2" cy="-4.6" rx="1.8" ry=".45" fill="#6b4226"/><path d="M-.3 -3.8 q1.2 .2 .9 1.2 q-.3 .7 -1.2 .5" stroke="#eee" stroke-width=".5" fill="none"/>` +
    `<path d="M2 -.8 v-3.4 q1 -1 2 0 v3.4 Z" fill="#e8f2f6" opacity=".8"/></g>`;
  S.teil({ id: "kellnerin", de: "die Kellnerin", syl: "KELL-ne-rin", it: "la cameriera", itSyl: "ca-me-RIE-ra", en: "waitress", x: 238, y: 194, kunst: m.svg + tablett,
    tipp: "Die Kellnerin fragt: „Was darf ich Ihnen bringen?“" });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/typisch_deutsch.js"));
console.log(aus);
