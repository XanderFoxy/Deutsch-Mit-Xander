#!/usr/bin/env node
/* =====================================================================
   DIE EISDIELE (FASSUNG 852) — Bilderwelt neu: ein italienisches Eiscafé
   ---------------------------------------------------------------------
   RECHERCHE (Smithsonian/Stars and Stripes zum Spaghettieis — 1969 in
   Mannheim von Dario Fontanella erfunden —, Berichte zur Eiscafé-Kultur):
   - Die gekühlte EISTHEKE mit schräger Glasfront: das Eis liegt hoch
     aufgetürmt und verziert in Edelstahlwannen, an jeder Wanne ein
     Sortenschild; oben auf der Theke Hörnchen im Halter, Becher, lange
     Eislöffel, Fächerwaffeln.
   - Dahinter der Eisverkäufer, auf dem Rückbuffet die Espressomaschine
     (Siebträger), die Sahnemaschine und die Kasse.
   - An der Wand die SORTENTAFEL mit den Kugelpreisen; im Gastraum
     Bistrotische mit Marmorplatte und Stühle, auf dem Tisch die EISKARTE
     mit Spaghettieis und Eiskaffee — Eisbecher kommen immer mit Waffel.
   Maßstab: Rückwand ≈ 45 Einheiten je Meter (Wandfuß y = 126),
   Theke ≈ 56 je Meter, vorn ≈ 62 je Meter. Fluchtpunkt (160 | 90).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "eisdiele", titel: "Die Eisdiele", emoji: "🍦", thema: "Essen & Trinken", kuerzel: "b11e", fassung: 852 });
const rnd = zufall(1969);
const r = B.r;
const T = (x, y, s, t, f = "#222", a = "middle", w = "normal", fam = "Arial,Helvetica,sans-serif", extra = "") =>
  `<text x="${r(x)}" y="${r(y)}" font-size="${s}" text-anchor="${a}" fill="${f}" font-family="${fam}" font-weight="${w}"${extra}>${t}</text>`;

/* ---------- Stoffe ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const GRUEN = "#1f8a4c", ROT = "#c8302a";
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const STAHL_H = S.lg("stahlh", [[0, "#f4f6f7"], [1, "#a9b1b8"]]);
const WAFFEL = S.lg("waffel", [[0, "#e9b96a"], [1, "#c48a3e"]]);
const MARMOR = S.lg("marmor", [[0, "#fbfaf7"], [1, "#e2ddd3"]]);

/* =====================================================================
   KULISSE — Decke, Wand (oben pastell, unten Fliesen), Markisen-Band,
   Rückbuffet, Terrazzoboden
   ===================================================================== */
const WU = 126, VP = { x: 160, y: 90 };
S.hinten(`<rect x="0" y="0" width="320" height="12" fill="${S.lg("decke", [[0, "#fbf7ef"], [1, "#ece4d4"]])}"/>`);
for (const x of [50, 160, 270]) S.hinten(`<line x1="${x}" y1="0" x2="${x}" y2="6" stroke="#8a6a3a" stroke-width=".4"/><path d="M${x - 5} 10 Q${x} 4 ${x + 5} 10 Z" fill="#e7c766"/><ellipse cx="${x}" cy="10" rx="5" ry="1" fill="#fff4cf"/>`);
S.hinten(`<rect x="0" y="12" width="320" height="${WU - 12}" fill="${S.lg("wand", [[0, "#fbe9d6"], [1, "#f4d9bc"]])}"/>`);
/* Markisen-Band in Grün-Weiß-Rot über dem Rückbuffet */
{
  let k = "";
  for (let i = 0; i < 16; i++) k += `<path d="M${i * 14} 12 L${i * 14 + 14} 12 L${i * 14 + 14} 19 Q${i * 14 + 7} 22.6 ${i * 14} 19 Z" fill="${[GRUEN, "#fbfaf4", ROT][i % 3]}"/>`;
  S.hinten(k + `<rect x="0" y="12" width="224" height="1.2" fill="#000" opacity=".15"/>`);
}
/* Fliesen unten an der Wand (Rauten in Pastell) */
{
  let f = `<rect x="0" y="80" width="320" height="${WU - 80}" fill="#e9f2ee"/>`;
  for (let y = 80; y < WU; y += 6) for (let x = (y / 6) % 2 ? 3 : 0; x < 320; x += 6) f += `<path d="M${x} ${y + 3} L${x + 3} ${y} L${x + 6} ${y + 3} L${x + 3} ${y + 6} Z" fill="#d3e6dd"/>`;
  f += `<rect x="0" y="79" width="320" height="1.4" fill="#b9cfc4"/>`;
  S.hinten(f);
}
/* Bild von Venedig an der rechten Wand */
S.hinten(`<rect x="282" y="34" width="32" height="24" fill="#6b4a2a"/><rect x="284" y="36" width="28" height="20" fill="${S.lg("venedig", [[0, "#f2b46a"], [0.5, "#fde0b0"], [0.51, "#4a8ab0"], [1, "#2a6a90"]])}"/>` +
  `<path d="M285 46 L285 40 L288 40 L288 37 L290 37 L290 40 L293 40 L293 46 Z M300 46 L300 42 Q303 38.6 306 42 L306 46 Z" fill="#b8754a" opacity=".8"/><path d="M289 50 Q296 52.6 305 49.4 L306 48.6 Q296 51.4 289 49 Z" fill="#1d1d1d"/><line x1="302" y1="49.6" x2="304" y2="43" stroke="#1d1d1d" stroke-width=".4"/>`);
/* Rückbuffet (Oberkante y = 96) */
S.hinten(`<rect x="0" y="96" width="206" height="${WU - 96}" fill="${S.lg("buffet", [[0, "#f6f3ec"], [1, "#d9d3c6"]])}"/><rect x="0" y="95" width="206" height="2" fill="${MARMOR}"/><rect x="0" y="97" width="206" height=".6" fill="#b9b2a2"/>`);
/* Terrazzoboden */
{
  let f = `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("boden", [[0, "#cdbfae"], [1, "#e6dccd"]])}"/>`;
  for (let i = 0; i < 90; i++) f += `<circle cx="${r(rnd() * 320)}" cy="${r(WU + 2 + rnd() * 72)}" r="${r(0.3 + rnd() * 0.5)}" fill="${["#9a8a76", "#b55a3a", "#5a7a6a", "#fff"][i % 4]}" opacity=".5"/>`;
  for (let i = -10; i <= 10; i++) { const xw = VP.x + i * 26; f += `<line x1="${xw}" y1="${WU}" x2="${r(VP.x + (xw - VP.x) * (200 - VP.y) / (WU - VP.y))}" y2="200" stroke="#b3a48f" stroke-width=".35"/>`; }
  for (const y of [131, 138, 148, 162, 180, 200]) f += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#b3a48f" stroke-width=".35"/>`;
  f += `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("bodenlicht", [[0, "#000", 0.15], [0.4, "#000", 0], [1, "#fff", 0.1]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DAS SCHILD „Eiscafé Venezia“
   ===================================================================== */
{
  let k = `<rect x="-46" y="-9" width="92" height="18" rx="9" fill="#fbfaf4" stroke="${GRUEN}" stroke-width="1.2"/>`;
  k += T(0, 3.6, 10, "Eiscafé Venezia", ROT, "middle", "bold", "'Brush Script MT','Segoe Script',cursive");
  k += `<rect x="-14" y="6.2" width="9.4" height="1.4" fill="${GRUEN}"/><rect x="-4.6" y="6.2" width="9.4" height="1.4" fill="#e9e6dc"/><rect x="4.8" y="6.2" width="9.4" height="1.4" fill="${ROT}"/>`;
  S.teil({ id: "ed_schild", de: "das Schild", syl: "SCHILD", it: "l'insegna", itSyl: "in-SE-gna", en: "sign", x: 104, y: 36, kunst: k + flaeche(-46, -9, 92, 18) });
}

/* =====================================================================
   2 — DIE SORTENTAFEL (Preise je Kugel)
   ===================================================================== */
{
  let k = `<rect x="-29" y="-46" width="58" height="46" rx="1.4" fill="#6b4a2a"/><rect x="-27" y="-44" width="54" height="42" fill="${S.lg("tafel", [[0, "#2f3a33"], [1, "#222b26"]])}"/>`;
  const t = (y, s, txt, f = "#f4f0e6", a = "middle", x = 0) => T(x, y, s, txt, f, a, "normal", "'Comic Sans MS','Segoe Print',cursive");
  k += t(-37.4, 5, "Gelato", "#f6e7a1") + `<line x1="-16" y1="-35.4" x2="16" y2="-35.4" stroke="#f6e7a1" stroke-width=".35" stroke-dasharray="1 .8"/>`;
  [["1 Kugel", "1,80 €"], ["2 Kugeln", "3,40 €"], ["3 Kugeln", "4,90 €"], ["Sahne", "0,80 €"], ["Spaghettieis", "6,50 €"]].forEach(([a, b], i) => {
    k += t(-29.6 + i * 5.8, 3.4, a, "#f4f0e6", "start", -23) + t(-29.6 + i * 5.8, 3.4, b, "#ffd1c2", "end", 23);
  });
  k += `<circle cx="-18" cy="-9" r="1.6" fill="#f6c6d4"/><circle cx="-15.6" cy="-9.6" r="1.6" fill="#f3e7b4"/><path d="M-19 -8 L-16.6 -3.4 L-14.4 -8.4 Z" fill="#d9a35b"/>` + t(4, -6, 2.6, "Becher auch zum Mitnehmen!", "#c9e6a0");
  S.teil({ id: "ed_sortentafel", de: "die Sortentafel", syl: "SOR-ten-ta-fel", it: "il listino dei gusti", itSyl: "li-STI-no dei GU-sti", en: "flavour board", x: 244, y: 78, kunst: k,
    tipp: "Auf der Sortentafel steht, was eine Kugel Eis kostet." });
}

/* =====================================================================
   3 — AUF DEM RÜCKBUFFET: Espressomaschine, Sahne, Kasse
   ===================================================================== */
{
  let k = schatten(0, 0, 17, 1.2, .3);
  k += `<rect x="-16" y="-24" width="32" height="24" rx="1.6" fill="${STAHL}"/><rect x="-16" y="-24" width="32" height="5" rx="1.6" fill="${ROT}"/>`;
  k += T(0, -20.4, 2.6, "ESPRESSO", "#fff", "middle", "bold", "Georgia,serif", ' letter-spacing=".4"');
  /* zwei Brühgruppen mit Siebträger, Dampfrohr, Manometer */
  for (const x of [-7, 7]) k += `<rect x="${x - 3}" y="-16" width="6" height="3" rx=".6" fill="#7d868d"/><rect x="${x - 2.4}" y="-13" width="4.8" height="2" fill="#5c646b"/><rect x="${x + 1.4}" y="-12.4" width="6" height="1.4" rx=".6" fill="#1d1d1d"/>`;
  k += `<path d="M14 -16 q2 2 1 8" stroke="#9aa3aa" stroke-width=".8" fill="none"/><circle cx="0" cy="-15" r="2" fill="#f4f6f7" stroke="#5c646b" stroke-width=".4"/><line x1="0" y1="-15" x2="1.2" y2="-16" stroke="#c8302a" stroke-width=".3"/>`;
  k += `<rect x="-14" y="-4" width="28" height="2" rx=".6" fill="#8d969e"/>`;
  for (const x of [-7, 7]) k += `<path d="M${x - 1.8} -8 h3.6 l-.4 3.6 h-2.8 Z" fill="#fff"/>`;
  /* Tassen auf der Maschine (zum Vorwärmen) */
  for (let i = 0; i < 4; i++) k += `<path d="M${-10 + i * 6 - 2} -28.6 h4 l-.4 3.4 h-3.2 Z" fill="#fff" stroke="#ddd" stroke-width=".2"/>`;
  S.teil({ id: "ed_espressomaschine", de: "die Espressomaschine", syl: "es-PRES-so-ma-schi-ne", it: "la macchina per espresso", itSyl: "MAC-chi-na per e-SPRES-so", en: "espresso machine", x: 42, y: 96, steht: true, kunst: k,
    tipp: "In der italienischen Eisdiele gibt es auch Espresso und Cappuccino." });
}
{
  /* DIE SAHNE — Sahnemaschine mit Zapfhahn, davor eine Schale Sahne */
  let k = schatten(0, 0, 9, 1, .3);
  k += `<rect x="-7" y="-22" width="14" height="22" rx="1.4" fill="${STAHL}"/><rect x="-7" y="-22" width="14" height="4" rx="1.4" fill="#dfe3e6"/>`;
  k += T(0, -13, 2.2, "Sahne", "#3a3f44", "middle", "bold") + `<rect x="-2" y="-10" width="4" height="2" fill="#5c646b"/><path d="M-1 -8 L1 -8 L.4 -6 L-.4 -6 Z" fill="#7d868d"/>`;
  k += `<path d="M-5 -2 Q0 1 5 -2 Z" fill="#fff" stroke="#ddd" stroke-width=".2"/><path d="M-4 -2 Q-3 -5.4 0 -5.6 Q3 -5.4 4 -2 Z" fill="#fffdf6"/><path d="M-1.6 -4.6 q1.6 -1.6 3.2 0" stroke="#e8e2d2" stroke-width=".4" fill="none"/>`;
  S.teil({ oben: true, id: "ed_sahne", de: "die Sahne", syl: "SAH-ne", it: "la panna", itSyl: "PAN-na", en: "whipped cream", x: 142, y: 96, steht: true, kunst: k,
    tipp: "„Mit Sahne?“ — Die Sahne kostet extra." });
}
{
  /* DIE KASSE */
  let k = schatten(0, .3, 9, 1, .3) + `<rect x="-9" y="-6" width="18" height="6" rx=".8" fill="#2b2f33"/><rect x="-8" y="-5" width="16" height="2" fill="#3a3f44"/>`;
  k += `<path d="M-7 -6 L7 -6 L8 -16 L-8 -16 Z" fill="#1d2125"/><path d="M-6.2 -7 L6.2 -7 L7 -15 L-7 -15 Z" fill="${S.lg("kbild", [[0, "#2c4e6b"], [1, "#1b3247"]])}"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${r(-6 + (i % 3) * 4.2)}" y="${r(-14.2 + Math.floor(i / 3) * 3.6)}" width="3.6" height="3" rx=".3" fill="${["#f6c6d4", "#f3e7b4", "#8a5a3a", "#a8d08a", "#fbfaf4", "#ffb84a"][i]}"/>`;
  k += `<rect x="3" y="-20" width="7" height="4" rx=".4" fill="#111"/>` + T(6.5, -17.2, 2, "3,40", "#7cff8a", "middle", "normal", "monospace");
  S.teil({ oben: true, id: "ed_kasse_ed", de: "die Kasse", syl: "KAS-se", it: "la cassa", itSyl: "CAS-sa", en: "till", x: 184, y: 96, steht: true, kunst: k });
}

/* =====================================================================
   4 — DER EISVERKÄUFER (hinter der Theke, weiße Jacke, Papierhut)
   ===================================================================== */
{
  const m = B.mensch({ id: "ed_verk", geschlecht: "m", pose: "halten", blick: 16, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "oliv", laecheln: true, bart: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, schuerze: { stueck: "schuerze", farbe: "#e9f2ee" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, kopf: { stueck: "kappe", farbe: "weiss" } } }, 90);
  S.teil({ id: "ed_eisverkaeufer", de: "der Eisverkäufer", syl: "EIS-ver-käu-fer", it: "il gelataio", itSyl: "ge-la-TA-io", en: "ice-cream seller", x: 104, y: 170, kunst: m.svg,
    tipp: "Der Eisverkäufer fragt: „Becher oder Waffel?“" });
}

/* =====================================================================
   5 — DIE EISTHEKE (gekühlt, schräge Glasfront) — Lupe: die Eissorten
   ===================================================================== */
const TH = { x0: 6, x1: 194, fuss: 182, front: 130, glasOben: 100, ablage: 96 };
{
  const W = TH.x1 - TH.x0, cx = (TH.x0 + TH.x1) / 2, F = TH.fuss;
  let k = schatten(0, 0, W / 2 + 3, 2.2, .3);
  /* Innenraum (kühles Licht) */
  k += `<rect x="${-W / 2 + 2}" y="${TH.ablage - F + 3}" width="${W - 4}" height="${TH.front - TH.ablage}" fill="${S.lg("innen", [[0, "#eef8fb"], [1, "#cfe3ea"]])}"/>`;
  const sorten = [
    ["ed_vanille", "das Vanilleeis", "va-NIL-le-eis", "il gelato alla vaniglia", "ge-LA-to al-la va-NI-glia", "vanilla ice cream", "#f6e9b8", "#e9d38a", "Vaniglia", "vanille"],
    ["ed_schokolade", "das Schokoladeneis", "scho-ko-LA-den-eis", "il gelato al cioccolato", "ge-LA-to al cioc-co-LA-to", "chocolate ice cream", "#6b3a1e", "#4a2410", "Cioccolato", "schoko"],
    ["ed_erdbeere", "das Erdbeereis", "ERD-beer-eis", "il gelato alla fragola", "ge-LA-to al-la FRA-go-la", "strawberry ice cream", "#f4a6b8", "#e07a92", "Fragola", "erdbeere"],
    ["ed_pistazie", "das Pistazieneis", "pis-TA-zi-en-eis", "il gelato al pistacchio", "ge-LA-to al pi-STAC-chio", "pistachio ice cream", "#b9cf86", "#94b05e", "Pistacchio", "pistazie"],
    ["ed_stracciatella", "das Stracciatellaeis", "strat-scha-TEL-la-eis", "il gelato stracciatella", "ge-LA-to strac-cia-TEL-la", "stracciatella ice cream", "#fbf7ee", "#e6dfcf", "Stracciatella", "stracciatella"],
    ["ed_zitrone", "das Zitroneneis", "zi-TRO-nen-eis", "il gelato al limone", "ge-LA-to al li-MO-ne", "lemon ice cream", "#fbf1a6", "#ecd96a", "Limone", "zitrone"],
    ["ed_haselnuss", "das Haselnusseis", "HA-sel-nuss-eis", "il gelato alla nocciola", "ge-LA-to al-la noc-CIO-la", "hazelnut ice cream", "#c99a6a", "#a8774a", "Nocciola", "haselnuss"],
    ["ed_mango", "das Mangoeis", "MAN-go-eis", "il gelato al mango", "ge-LA-to al MAN-go", "mango ice cream", "#ffbe4a", "#f29a2a", "Mango", "mango"],
  ];
  const unter = [];
  const pw = (W - 8) / sorten.length, yb = TH.front - F - 2, yt = yb - 13;
  sorten.forEach(([id, de, syl, it, itSyl, en, hell, dunkel, name, art], i) => {
    const x0 = -W / 2 + 4 + i * pw, x1 = x0 + pw - 1.4, mx = (x0 + x1) / 2;
    /* Wanne (schräg gestellt): hinten höher */
    k += `<path d="M${r(x0)} ${r(yt + 2)} L${r(x1)} ${r(yt + 2)} L${r(x1)} ${r(yb)} L${r(x0)} ${r(yb)} Z" fill="#b5bcc2"/>`;
    /* Eis aufgetürmt mit Wellen (wie mit dem Spatel gezogen) */
    const g = S.lg("eis" + i, [[0, hell], [1, dunkel]]);
    k += `<path d="M${r(x0 + 0.4)} ${r(yb - 1)} L${r(x0 + 0.4)} ${r(yt + 3)} Q${r(x0 + pw * 0.2)} ${r(yt - 4)} ${r(mx)} ${r(yt - 5)} Q${r(x1 - pw * 0.2)} ${r(yt - 4)} ${r(x1 - 0.4)} ${r(yt + 3)} L${r(x1 - 0.4)} ${r(yb - 1)} Z" fill="${g}"/>`;
    k += `<path d="M${r(x0 + 2)} ${r(yt + 1)} Q${r(mx - 2)} ${r(yt - 3)} ${r(mx + 2)} ${r(yt - 1)} Q${r(mx + 5)} ${r(yt + 1)} ${r(x1 - 2)} ${r(yt)}" stroke="#fff" stroke-width=".7" opacity=".55" fill="none"/>`;
    k += `<path d="M${r(x0 + 3)} ${r(yt + 4)} Q${r(mx)} ${r(yt + 1)} ${r(x1 - 3)} ${r(yt + 4)}" stroke="${dunkel}" stroke-width=".6" fill="none" opacity=".8"/>`;
    /* Verzierung je Sorte */
    if (art === "vanille") k += `<path d="M${r(mx - 3)} ${r(yt - 4)} l6 1.4" stroke="#3a2410" stroke-width=".7"/><path d="M${r(mx - 2)} ${r(yt - 2.4)} l5 1" stroke="#3a2410" stroke-width=".6"/>`;
    if (art === "schoko") k += `<path d="M${r(mx - 4)} ${r(yt - 1)} q4 -3 8 0" stroke="#2a1408" stroke-width="1" fill="none"/><rect x="${r(mx - 1.6)}" y="${r(yt - 7)}" width="3.2" height="2.4" rx=".3" fill="#3a1a08"/>`;
    if (art === "erdbeere") k += `<path d="M${r(mx - 1.8)} ${r(yt - 5.6)} q1.8 -2.4 3.6 0 q-1.8 3.6 -3.6 0 Z" fill="#d42a3a"/><path d="M${r(mx - 1)} ${r(yt - 6.2)} l1 -1 l1 1" stroke="#3a8a2a" stroke-width=".6" fill="none"/>`;
    if (art === "pistazie") for (const d of [-3, 0, 3]) k += `<ellipse cx="${r(mx + d)}" cy="${r(yt - 4 + Math.abs(d) * 0.3)}" rx=".9" ry=".6" fill="#6a9a3a"/>`;
    if (art === "stracciatella") for (let j = 0; j < 9; j++) k += `<rect x="${r(x0 + 2 + rnd() * (pw - 6))}" y="${r(yt - 2 + rnd() * 9)}" width=".9" height=".5" fill="#3a1a08"/>`;
    if (art === "zitrone") k += `<circle cx="${r(mx)}" cy="${r(yt - 5)}" r="2.2" fill="#fbe34a" stroke="#e8c52a" stroke-width=".4"/><path d="M${r(mx)} ${r(yt - 5)} l0 -2 M${r(mx)} ${r(yt - 5)} l1.6 1.2 M${r(mx)} ${r(yt - 5)} l-1.6 1.2" stroke="#fff7c0" stroke-width=".3"/>`;
    if (art === "haselnuss") for (const d of [-2.6, 1, 3.6]) k += `<circle cx="${r(mx + d)}" cy="${r(yt - 4 + Math.abs(d) * 0.3)}" r=".9" fill="#7a4a22"/>`;
    if (art === "mango") k += `<path d="M${r(mx - 2.4)} ${r(yt - 4)} l2.4 -2 l2.4 2 l-2.4 1.6 Z" fill="#f28a1a"/>`;
    /* Spatel in einigen Sorten */
    if (i % 3 === 1) k += `<path d="M${r(mx + 2)} ${r(yt - 2)} L${r(mx + 6)} ${r(yt - 13)}" stroke="#9aa3aa" stroke-width=".9"/><rect x="${r(mx + 5)}" y="${r(yt - 17)}" width="1.6" height="4.6" rx=".5" fill="#2b2f33" transform="rotate(20 ${r(mx + 6)} ${r(yt - 13)})"/>`;
    /* Sortenschild */
    k += `<rect x="${r(mx - pw / 2 + 1.4)}" y="${r(yb - 4)}" width="${r(pw - 4.2)}" height="3.6" rx=".4" fill="#fff" stroke="#ddd" stroke-width=".2"/>` + T(mx, yb - 1.4, r(Math.min(2.2, (pw - 5) / (name.length * 0.56))), name, ROT, "middle", "bold", "Georgia,serif", ' font-style="italic"');
    unter.push({ id, de, syl, it, itSyl, en, x: cx + mx, y: F + yb, kunst: flaeche(-pw / 2 + 0.6, -19, pw - 1.6, 19.4) });
  });
  /* Ablage oben (Edelstahl) und Glasscheibe schräg */
  k += `<rect x="${-W / 2}" y="${TH.ablage - F}" width="${W}" height="3.4" fill="${STAHL_H}"/><rect x="${-W / 2}" y="${TH.ablage - F + 3.4}" width="${W}" height=".6" fill="#7d868d"/>`;
  k += `<path d="M${-W / 2} ${TH.front - F} L${W / 2} ${TH.front - F} L${W / 2} ${TH.ablage - F + 4} L${-W / 2} ${TH.ablage - F + 4} Z" fill="#e8f4f8" opacity=".14" stroke="#c7d6dc" stroke-width=".5"/>`;
  /* Front: weiß, Mosaikband in Grün-Rot, Lüftungsgitter */
  const H = F - TH.front;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="3" fill="${STAHL}"/>`;
  k += `<rect x="${-W / 2}" y="${-H + 3}" width="${W}" height="${H - 3}" fill="${S.lg("front", [[0, "#fbfaf6"], [1, "#e4e0d6"]])}"/>`;
  for (let x = -W / 2; x < W / 2; x += 3) k += `<rect x="${x + 0.2}" y="${-H + 6}" width="2.6" height="2.6" fill="${[GRUEN, "#fbfaf4", ROT, "#f2c46a"][Math.floor((x + W / 2) / 3) % 4]}"/>`;
  k += T(0, -H + 22, 8, "Gelato artigianale", "#7a5a3a", "middle", "normal", "'Brush Script MT','Segoe Script',cursive");
  k += T(0, -H + 30, 3, "HAUSGEMACHTES EIS · SEIT 1972", "#9a8a76", "middle", "bold", "Arial", ' letter-spacing=".6"');
  for (let x = -W / 2 + 6; x < W / 2 - 6; x += 2.4) k += `<rect x="${r(x)}" y="-12" width="1.2" height="6" rx=".4" fill="#a9a396"/>`;
  k += `<rect x="${-W / 2}" y="-4" width="${W}" height="4" fill="#3a3d40"/>`;
  S.teil({ id: "ed_eistheke", de: "die Eistheke", syl: "EIS-the-ke", it: "il banco dei gelati", itSyl: "BAN-co dei ge-LA-ti", en: "ice-cream counter", x: cx, y: F, steht: true, kunst: k,
    zoom: { x: TH.x0 - 2, y: TH.ablage - 12, w: W + 4, h: 60 }, unter,
    tipp: "Die Eistheke ist gekühlt: minus 12 Grad. Jede Sorte liegt in einer eigenen Wanne." });
  S.davor(`<path d="M${TH.x0 + 14} ${TH.front - 1} L${TH.x0 + 24} ${TH.ablage + 5} L${TH.x0 + 32} ${TH.ablage + 5} L${TH.x0 + 22} ${TH.front - 1} Z" fill="#fff" opacity=".22"/>` +
    `<path d="M${TH.x0 + 112} ${TH.front - 1} L${TH.x0 + 120} ${TH.ablage + 5} L${TH.x0 + 124} ${TH.ablage + 5} L${TH.x0 + 116} ${TH.front - 1} Z" fill="#fff" opacity=".16"/>`);
}

/* =====================================================================
   6 — OBEN AUF DER THEKE: Hörnchen, Becher, Eislöffel, Waffeln
   ===================================================================== */
const AB = TH.ablage + 1;
{
  /* DAS HÖRNCHEN — Halter mit Waffelhörnchen */
  let k = schatten(0, .2, 9, .7, .3) + `<rect x="-9" y="-2.2" width="18" height="2.2" rx=".5" fill="${STAHL}"/><rect x="-9" y="-9" width="18" height="1.4" rx=".5" fill="${STAHL}"/>`;
  for (const x of [-8.6, 8.6]) k += `<rect x="${x - 0.5}" y="-9" width="1" height="7" fill="#9aa3aa"/>`;
  for (let i = 0; i < 4; i++) {
    const x = -6 + i * 4;
    k += `<path d="M${x - 1.8} -12 L${x + 1.8} -12 L${x} -2.6 Z" fill="${WAFFEL}"/><path d="M${x - 1.2} -10.4 L${x + 0.8} -6.4 M${x + 1.2} -10.4 L${x - 0.8} -6.4" stroke="#a8703a" stroke-width=".25"/><ellipse cx="${x}" cy="-12" rx="1.8" ry=".5" fill="#d9a35b"/>`;
  }
  S.teil({ oben: true, id: "ed_hoernchen", de: "das Hörnchen", syl: "HÖRN-chen", it: "il cono", itSyl: "CO-no", en: "cone", x: 24, y: AB, steht: true, kunst: k,
    tipp: "Eis gibt es im Hörnchen oder im Becher." });
}
{
  /* DER BECHER — Stapel bunter Pappbecher */
  let k = schatten(0, .2, 6, .6, .3);
  for (const [dx, f] of [[-3.4, "#f6c6d4"], [3.4, "#a8d8c0"]]) {
    for (let i = 0; i < 4; i++) k += `<path d="M${dx - 3} ${-i * 1.6} L${dx + 3} ${-i * 1.6} L${dx + 3.4} ${-i * 1.6 - 3} L${dx - 3.4} ${-i * 1.6 - 3} Z" fill="${f}" stroke="#fff" stroke-width=".3"/>`;
    k += `<ellipse cx="${dx}" cy="-7.8" rx="3.4" ry=".7" fill="#fff"/>`;
  }
  S.teil({ oben: true, id: "ed_becher_ed", de: "der Becher", syl: "BE-cher", it: "la coppetta", itSyl: "cop-PET-ta", en: "tub", x: 44, y: AB, steht: true, kunst: k });
}
{
  /* DER EISLÖFFEL — lange Löffel im Glas (Korrektur: en war „ice-cream scoop“,
     ein Eislöffel ist aber der lange Löffel für den Eisbecher, kein Portionierer) */
  let k = schatten(0, .2, 3.6, .5, .3) + `<path d="M-3 0 L3 0 L3.4 -7 L-3.4 -7 Z" fill="#e6f2f5" opacity=".7" stroke="#b9cbd1" stroke-width=".3"/>`;
  for (const [x, a] of [[-1.4, -10], [0, 0], [1.4, 9], [-.6, -4]]) k += `<g transform="rotate(${a} ${x} -1)"><rect x="${x - 0.3}" y="-15" width=".6" height="14" fill="#c9cfd4"/><ellipse cx="${x}" cy="-15.4" rx=".8" ry="1.2" fill="#dfe3e6"/></g>`;
  S.teil({ oben: true, id: "ed_eisloeffel", de: "der Eislöffel", syl: "EIS-löf-fel", it: "il cucchiaino", itSyl: "cuc-chia-I-no", en: "ice-cream spoon", x: 62, y: AB, steht: true, kunst: k + flaeche(-3.6, -17, 7.2, 17.2) });
}
{
  /* DIE WAFFEL — Glas mit Fächerwaffeln */
  let k = schatten(0, .2, 5, .6, .3) + `<path d="M-4.4 0 L4.4 0 L4.8 -8 L-4.8 -8 Z" fill="#e6f2f5" opacity=".6" stroke="#b9cbd1" stroke-width=".3"/>`;
  for (const [x, a] of [[-2.6, -14], [0, 0], [2.6, 12]]) k += `<g transform="rotate(${a} ${x} -4)"><path d="M${x - 2.2} -4 L${x - 2.6} -13 Q${x} -15 ${x + 2.6} -13 L${x + 2.2} -4 Z" fill="${WAFFEL}" stroke="#b8803a" stroke-width=".2"/><path d="M${x - 1.6} -11 h3.2 M${x - 1.6} -8.6 h3.2 M${x} -13.6 v8" stroke="#b8803a" stroke-width=".25"/></g>`;
  S.teil({ oben: true, id: "ed_waffel", de: "die Waffel", syl: "WAF-fel", it: "la cialda", itSyl: "CIAL-da", en: "wafer", x: 172, y: AB, steht: true, kunst: k,
    tipp: "Zum Eisbecher gibt es immer eine Waffel." });
}

/* =====================================================================
   7 — DAS KIND (zeigt auf die Sorte) und DER VATER
   ===================================================================== */
{
  const m = B.mensch({ id: "ed_kind", geschlecht: "m", alter: "kind", pose: "zeigen", blick: -62, frisur: "kurz", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "gelb" }, unterteil: { stueck: "hose", farbe: "blau" }, schuhe: { stueck: "turnschuh", farbe: "rot" } } }, 74);
  S.teil({ id: "ed_kind_ed", de: "das Kind", syl: "KIND", it: "il bambino", itSyl: "bam-BI-no", en: "child", x: 210, y: 196, kunst: m.svg,
    tipp: "Das Kind zeigt auf die Sorte: „Ich möchte Erdbeere!“" });
}
{
  const m = B.mensch({ id: "ed_vater", geschlecht: "m", pose: "stehen", blick: -40, frisur: "kurz", haarfarbe: "braun", haut: "hell", bart: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "hellblau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 112);
  S.teil({ id: "ed_vater", de: "der Vater", syl: "VA-ter", it: "il padre", itSyl: "PA-dre", en: "father", x: 238, y: 194, kunst: m.svg,
    tipp: "Der Vater sagt: „Zwei Kugeln im Becher, bitte.“" });
}

/* =====================================================================
   8 — DER STUHL und DER TISCH (Bistro, Marmorplatte) mit Spaghettieis,
       Eiskaffee und Eiskarte
   ===================================================================== */
const TI = { x: 294, y: 186, s: 57 };
const TT = TI.y - 0.75 * TI.s;
{
  let k = schatten(0, 0, 14, 1.8, .3) + `<ellipse cx="0" cy="-1" rx="10" ry="2.2" fill="#2b2f33"/>`;
  k += `<path d="M-1.2 ${TT - TI.y + 3} L1.2 ${TT - TI.y + 3} L1.6 -2 L-1.6 -2 Z" fill="#2b2f33"/>`;
  k += `<ellipse cx="0" cy="${TT - TI.y + 1.4}" rx="20" ry="4.6" fill="#bdb6a8"/><ellipse cx="0" cy="${TT - TI.y}" rx="20" ry="4.6" fill="${MARMOR}"/>`;
  k += `<path d="M-14 ${TT - TI.y - 1} q6 2 10 -1 q4 -2 9 1" stroke="#cfc8ba" stroke-width=".3" fill="none"/>`;
  S.teil({ id: "ed_tisch_ed", de: "der Tisch", syl: "TISCH", it: "il tavolino", itSyl: "ta-vo-LI-no", en: "table", x: TI.x, y: TI.y, steht: true, kunst: k });
}
{
  /* DER EISKAFFEE — hohes Glas mit Sahne, Strohhalm und Löffel */
  let k = schatten(0, .2, 3.4, .5, .3) + `<path d="M-2.6 0 L2.6 0 L3.2 -11 L-3.2 -11 Z" fill="${S.lg("kaffee", [[0, "#c9a07a"], [0.5, "#8a5a32"], [1, "#5a3518"]])}" opacity=".95"/>`;
  k += `<path d="M-3.4 -11 Q-3 -15 0 -15.4 Q3 -15 3.4 -11 Z" fill="#fffdf6"/><path d="M-2 -13 q2 -1.4 4 0" stroke="#6b3a1e" stroke-width=".5" fill="none"/>`;
  k += `<path d="M1 -14 L2.6 -19" stroke="${ROT}" stroke-width=".7"/><path d="M-2.6 -10.6 L-2.2 -.6" stroke="#fff" stroke-width=".5" opacity=".6"/>`;
  S.teil({ oben: true, id: "ed_eiskaffee", de: "der Eiskaffee", syl: "EIS-kaf-fee", it: "il caffè con gelato", itSyl: "caf-FÈ con ge-LA-to", en: "iced coffee", x: TI.x - 12, y: TT, steht: true, kunst: k + flaeche(-3.6, -19.4, 7.2, 19.6),
    tipp: "Eiskaffee: kalter Kaffee mit Vanilleeis und Sahne." });
}
{
  /* DAS SPAGHETTIEIS — Vanilleeis als „Spaghetti“, Erdbeersoße, weiße Schokolade */
  let k = schatten(0, .3, 8, .8, .3) + `<ellipse cx="0" cy="-.8" rx="8.4" ry="2.2" fill="#fff" stroke="#ddd" stroke-width=".3"/>`;
  k += `<path d="M-6.4 -1.6 Q-6 -6.4 0 -6.8 Q6 -6.4 6.4 -1.6 Z" fill="#f6e9b8"/>`;
  for (let i = 0; i < 9; i++) k += `<path d="M${r(-5.6 + i * 1.4)} -1.8 q.6 -2 -.2 -4" stroke="#e9d38a" stroke-width=".5" fill="none"/>`;
  k += `<path d="M-4.4 -5.4 Q-2 -7.6 1 -6.6 Q4 -6 4.6 -4 Q2 -3.2 -1 -4 Q-3.6 -3.4 -4.4 -5.4 Z" fill="#d42a3a"/>`;
  for (let i = 0; i < 8; i++) k += `<rect x="${r(-3.4 + rnd() * 7)}" y="${r(-6.6 + rnd() * 2)}" width=".7" height=".4" fill="#fffdf6"/>`;
  k += `<path d="M5 -3 L9 -9" stroke="${WAFFEL}" stroke-width="1.4"/>`;
  S.teil({ oben: true, id: "ed_spaghettieis", de: "das Spaghettieis", syl: "spa-GHET-ti-eis", it: "il gelato spaghetti", itSyl: "ge-LA-to spa-GHET-ti", en: "spaghetti ice cream", x: TI.x + 1, y: TT + 1, steht: true, kunst: k,
    tipp: "Das Spaghettieis wurde 1969 in Mannheim erfunden." });
}
{
  /* DIE EISKARTE — aufgestellte Karte mit Bildern */
  let k = schatten(0, .2, 4, .5, .3) + `<path d="M-4.4 0 L4.4 0 L3.6 -12 L-3.6 -12 Z" fill="#fbfaf4" stroke="#c9c2b4" stroke-width=".2"/>`;
  k += `<rect x="-3.4" y="-11.4" width="6.8" height="2" fill="${GRUEN}"/>` + T(0, -9.9, 1.4, "Eiskarte", "#fff", "middle", "bold");
  k += `<path d="M-2.4 -5 Q-2.4 -8 0 -8.2 Q2.4 -8 2.4 -5 Z" fill="#f4a6b8"/><path d="M-2.6 -5 L2.6 -5 L1.6 -2 L-1.6 -2 Z" fill="#e6f2f5" stroke="#b9cbd1" stroke-width=".2"/>`;
  S.teil({ oben: true, id: "ed_eiskarte", de: "die Eiskarte", syl: "EIS-kar-te", it: "la carta dei gelati", itSyl: "CAR-ta dei ge-LA-ti", en: "ice-cream menu", x: TI.x + 12, y: TT - 1, steht: true, kunst: k });
}
{
  /* Bistrostuhl (Rattan-Optik), vorn rechts am Tisch */
  let k = schatten(0, 0, 13, 1.8, .3);
  for (const x of [-9, 9]) k += `<rect x="${x - 0.7}" y="-27" width="1.4" height="27" fill="#2b2f33"/>`;
  for (const x of [-6, 6]) k += `<rect x="${x - 0.6}" y="-26" width="1.2" height="24" fill="#3a3d40"/>`;
  k += `<ellipse cx="0" cy="-27" rx="12" ry="3.4" fill="${S.lg("rattan", [[0, "#d9b07a"], [1, "#b8874a"]])}"/>`;
  for (let i = -2; i <= 2; i++) k += `<path d="M${i * 4 - 2} -29.6 L${i * 4 + 2} -24.6" stroke="#9a6a3a" stroke-width=".3"/>`;
  k += `<path d="M-11 -27 Q-12 -52 0 -54 Q12 -52 11 -27" stroke="#2b2f33" stroke-width="1.4" fill="none"/>`;
  k += `<path d="M-9.6 -40 Q0 -44 9.6 -40 L9.8 -48 Q0 -52 -9.8 -48 Z" fill="${S.lg("lehne", [[0, "#d9b07a"], [1, "#b8874a"]])}"/>`;
  for (let i = -4; i <= 4; i++) k += `<line x1="${i * 2}" y1="${-50 + Math.abs(i) * 0.3}" x2="${i * 2}" y2="${-42 + Math.abs(i) * 0.2}" stroke="#9a6a3a" stroke-width=".3"/>`;
  S.teil({ id: "ed_stuhl_ed", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: 268, y: 196, steht: true, kunst: k });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/eisdiele.js"));
console.log(aus);
