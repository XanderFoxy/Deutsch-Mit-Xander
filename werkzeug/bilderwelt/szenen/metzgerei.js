#!/usr/bin/env node
/* =====================================================================
   DIE METZGEREI (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar.

   RECHERCHE (Fachhandel Metzgereibedarf: Aufschnittmaschinen VS-Reihe,
   Wurstgehänge, Thekenwaagen; Lexikon „Aufschnitt“) — so sieht eine
   deutsche Metzgerei (Fleischerei) aus:
   - Die lange gekühlte FLEISCHTHEKE (Bedientheke) mit gewölbter
     Glasfront. Darin auf weißen Schalen: oben Wurst und Aufschnitt
     (fächerartig gelegt), Leberwurst, Fleischwurst im Ring,
     Frikadellen; unten das Frischfleisch: Schnitzel, Hackfleisch,
     Steaks, Bratwürste. Dazwischen grüne Deko-Petersilie, vor jeder
     Schale ein Preisschild „€/100 g“.
   - Auf der Theke die WAAGE mit Anzeige zur Kundschaft, Papiertüten.
   - Hinter der Theke die gefliesten Wände, das RÜCKBUFFET mit der
     AUFSCHNITTMASCHINE und dem Fleischwolf, eine Magnetleiste mit
     Messern, an einer Stange HÄNGENDE WÜRSTE (Salami, Landjäger) und
     Schinken, eine PREISTAFEL mit den Angeboten.
   - Der Metzger in weißer Jacke mit Schürze und Kappe.
   - Vorne der Spender für die WARTENUMMER mit Anzeige.
   Maßstab: Rückwand ≈ 46 Einheiten je Meter, Theke ≈ 55 je Meter
   (0,9 m), Kundin vorne 1,65 m ≈ 100.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "metzgerei", titel: "Die Metzgerei", emoji: "🥩", thema: "Einkaufen", kuerzel: "b02d", fassung: 852 });
const rnd = zufall(1871);
const r = B.r;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const STAHL_H = S.lg("stahlh", [[0, "#f2f4f5"], [1, "#b8c0c6"]]);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.3], [0.45, "#e8f4f7", 0.06], [1, "#ffffff", 0.16]], 0, 0, 1, 1);
const FLEISCH = S.rg("fleisch", [[0, "#e8909a"], [0.6, "#d06470"], [1, "#a8404e"]], 0.4, 0.35, 0.8);
const ROT = S.rg("rotfl", [[0, "#c43a3a"], [0.7, "#9c2026"], [1, "#6e1218"]], 0.4, 0.35, 0.8);
const HELL = S.rg("hellfl", [[0, "#f7d1cf"], [0.6, "#eab3b1"], [1, "#d08e8d"]], 0.4, 0.35, 0.8);
const BRATEN = S.rg("braun", [[0, "#a86a3c"], [0.6, "#7d4a26"], [1, "#55301a"]], 0.4, 0.35, 0.8);
const PETERSILIE = "#3f8f3a";

/* =====================================================================
   KULISSE — Decke, gefliesste Wände mit Bordüre, Boden
   ===================================================================== */
const WU = 120;
S.def(`<pattern id="${S.id("fliese")}" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#e3e6e4"/><rect x=".2" y=".2" width="6.6" height="6.6" rx=".4" fill="#f9faf9"/></pattern>`);
S.def(`<pattern id="${S.id("boden")}" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#a8463c"/><rect x=".3" y=".3" width="9.4" height="9.4" fill="#b5544a"/></pattern>`);
S.hinten(`<rect x="0" y="0" width="320" height="12" fill="${S.lg("decke", [[0, "#f6f5f2"], [1, "#e4e2dc"]])}"/><rect x="0" y="11" width="320" height="1.6" fill="#cfccc4"/>`);
S.hinten(`<rect x="0" y="12.6" width="320" height="${WU - 12.6}" fill="url(#${S.id("fliese")})"/>`);
/* Bordüre (rot-weiß) auf Schulterhöhe */
S.hinten(`<rect x="0" y="74" width="320" height="3.4" fill="#b3262c"/><rect x="0" y="77.4" width="320" height=".8" fill="#fff"/><rect x="0" y="78.2" width="320" height="1" fill="#b3262c"/>`);
S.hinten(`<rect x="0" y="12.6" width="320" height="${WU - 12.6}" fill="${S.rg("wandlicht", [[0, "#fffaf0", 0.5], [1, "#fffaf0", 0]], 0.5, 0.15, 0.7)}"/>`);
for (const x of [60, 160, 260]) S.hinten(`<ellipse cx="${x}" cy="6" rx="6" ry="1.4" fill="#fff6ee"/><ellipse cx="${x}" cy="6.4" rx="14" ry="3.4" fill="#ffe9e4" opacity=".3"/>`);
{
  /* Fliesenboden (Terrakotta) mit Flucht */
  let f = `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("bodenf", [[0, "#9e4a40"], [1, "#b65b4f"]])}"/>`;
  for (let i = -9; i <= 9; i++) f += `<line x1="${160 + i * 20}" y1="${WU}" x2="${160 + i * 58}" y2="200" stroke="#7d342c" stroke-width=".4" opacity=".7"/>`;
  for (const y of [WU + 7, WU + 16, WU + 28, WU + 44, WU + 64]) f += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#7d342c" stroke-width=".4" opacity=".6"/>`;
  f += `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("bodenlicht", [[0, "#000", 0.2], [0.4, "#000", 0], [1, "#fff", 0.08]])}"/>`;
  S.hinten(f);
}
/* Rückbuffet (Edelstahl) entlang der Rückwand */
const RB = 82;   /* Oberkante Rückbuffet (0,9 m an der Wand) */
S.hinten(`<rect x="124" y="${RB}" width="196" height="${WU - RB}" fill="${STAHL_H}"/><rect x="124" y="${RB}" width="196" height="2" fill="#f7f9fa"/>`);
for (let x = 128; x < 316; x += 32) S.hinten(`<rect x="${x}" y="${RB + 5}" width="28" height="${WU - RB - 9}" rx="1" fill="none" stroke="#9aa3aa" stroke-width=".5"/><rect x="${x + 10}" y="${RB + 8}" width="8" height="1.2" rx=".6" fill="#8d969d"/>`);

/* =====================================================================
   1 — DIE WURST (an der Stange hängend) — Lupe: Salami, Landjäger, Schinken
   ===================================================================== */
{
  const x0 = 16, x1 = 116, ys = 30, cx = (x0 + x1) / 2;
  let k = `<g transform="translate(${-cx} ${-ys})">`;
  k += `<rect x="${x0 - 2}" y="${ys - 2}" width="3" height="5" fill="#8d969d"/><rect x="${x1 - 1}" y="${ys - 2}" width="3" height="5" fill="#8d969d"/>`;
  k += `<rect x="${x0}" y="${ys - 1}" width="${x1 - x0}" height="2" rx="1" fill="${STAHL}"/>`;
  const haken = (x) => `<path d="M${x} ${ys + 0.6} L${x} ${ys + 3} q0 1.6 1.2 1.6" stroke="#7d868d" stroke-width=".5" fill="none"/>`;
  const unter = [];
  /* Salamis mit weißem Edelschimmel und Schnur */
  for (let i = 0; i < 4; i++) {
    const x = x0 + 6 + i * 6.4, l = 30 + (i % 2) * 4;
    k += haken(x) + `<line x1="${x}" y1="${ys + 3}" x2="${x}" y2="${ys + 6}" stroke="#d9c9a3" stroke-width=".4"/>`;
    k += `<rect x="${x - 2.4}" y="${ys + 6}" width="4.8" height="${l}" rx="2.4" fill="${S.lg("salami", [[0, "#cfc6bb"], [0.4, "#f1ece4"], [1, "#b9ada0"]], 0, 0, 1, 0)}"/>`;
    for (let j = 1; j < 6; j++) k += `<path d="M${x - 2.4} ${r(ys + 6 + j * l / 6)} q2.4 1 4.8 0" stroke="#a8977f" stroke-width=".3" fill="none"/>`;
    k += `<rect x="${x - 1.6}" y="${ys + 6 + l - 1}" width="3.2" height="1.6" rx=".8" fill="#8c3a2c"/>`;
  }
  unter.push({ id: "mz_salami", de: "die Salami", syl: "Sa-LA-mi", it: "il salame", itSyl: "sa-LA-me", en: "salami", x: x0 + 15.6, y: ys + 42, kunst: flaeche(-14, -40, 28, 40) });
  /* Landjäger paarweise */
  for (let i = 0; i < 3; i++) {
    const x = x0 + 36 + i * 7;
    k += haken(x) + `<path d="M${x - 2} ${ys + 4} L${x + 2} ${ys + 4}" stroke="#d9c9a3" stroke-width=".4"/>`;
    for (const dx of [-1.2, 1.2]) k += `<rect x="${x + dx - 1.1}" y="${ys + 4.4}" width="2.2" height="20" rx=".6" fill="${S.lg("landj", [[0, "#5a2a18"], [0.5, "#7d3e24"], [1, "#4a2214"]], 0, 0, 1, 0)}"/>`;
  }
  unter.push({ id: "mz_landjaeger", de: "der Landjäger", syl: "LAND-jä-ger", it: "il Landjäger (salsiccia secca)", itSyl: "LAND-je-gher", en: "landjäger sausage", x: x0 + 43, y: ys + 26, kunst: flaeche(-11, -24, 22, 24),
    tipp: "Landjäger sind flache, harte Würste — gut für die Wanderung." });
  /* Schinken (Schwarzwälder Art) im Netz */
  for (let i = 0; i < 2; i++) {
    const x = x0 + 68 + i * 15, y = ys + 4;
    k += haken(x) + `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 4}" stroke="#d9c9a3" stroke-width=".5"/>`;
    k += `<path d="M${x - 2} ${y + 4} Q${x - 7} ${y + 12} ${x - 6.4} ${y + 24} Q${x - 5} ${y + 33} ${x} ${y + 33} Q${x + 5} ${y + 33} ${x + 6.4} ${y + 24} Q${x + 7} ${y + 12} ${x + 2} ${y + 4} Z" fill="${S.lg("schinken", [[0, "#3a1a10"], [0.5, "#6a2e1c"], [1, "#2e140c"]], 0, 0, 1, 0)}"/>`;
    for (let j = 0; j < 5; j++) k += `<path d="M${x - 6} ${y + 10 + j * 5} Q${x} ${y + 12 + j * 5} ${x + 6} ${y + 10 + j * 5}" stroke="#e6dccb" stroke-width=".25" fill="none" opacity=".7"/>`;
    k += `<path d="M${x - 3} ${y + 8} L${x - 5} ${y + 30} M${x + 3} ${y + 8} L${x + 5} ${y + 30}" stroke="#e6dccb" stroke-width=".25" opacity=".6"/>`;
  }
  unter.push({ id: "mz_schinken", de: "der Schinken", syl: "SCHIN-ken", it: "il prosciutto", itSyl: "pro-SCIUT-to", en: "ham", x: x0 + 75.5, y: ys + 38, kunst: flaeche(-14, -35, 28, 35) });
  k += `</g>`;
  S.teil({ id: "mz_wurst_mz", de: "die Wurst", syl: "WURST", it: "il salame", itSyl: "sa-LA-me", en: "sausage", x: cx, y: ys, kunst: k,
    zoom: { x: x0 - 4, y: ys - 4, w: x1 - x0 + 8, h: 46 }, unter,
    tipp: "Luftgetrocknete Würste hängen an der Stange." });
}

/* =====================================================================
   2 — DIE PREISTAFEL (rechts oben)
   ===================================================================== */
{
  let k = `<rect x="-24" y="-22" width="48" height="44" rx="1.6" fill="#5a3a22"/><rect x="-22" y="-20" width="44" height="40" fill="${S.lg("tafel", [[0, "#2c3530"], [1, "#212824"]])}"/>`;
  const t = (y, s, txt, f = "#f2efe6", a = "start", x = -19.5) => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="${a}" fill="${f}" font-family="'Comic Sans MS','Segoe Print',cursive">${txt}</text>`;
  k += t(-13.6, 4.4, "Unsere Angebote", "#f6e7a1", "middle", 0);
  const zeilen = [["Schweineschnitzel", "1,39"], ["Rinderhack", "1,29"], ["Rumpsteak", "3,49"], ["Bratwurst", "0,99"], ["Fleischwurst", "1,19"], ["Leberwurst", "1,09"]];
  zeilen.forEach(([w, p], i) => { k += t(-6.6 + i * 4.4, 3, w) + t(-6.6 + i * 4.4, 3, p + " €", "#ffc9b8", "end", 19.5); });
  k += `<text x="0" y="18.4" font-size="2.2" text-anchor="middle" fill="#cfcabd" font-family="Arial">Preise je 100 g</text>`;
  S.teil({ id: "mz_preistafel", de: "die Preistafel", syl: "PREIS-ta-fel", it: "il listino prezzi", itSyl: "li-STI-no PREZ-zi", en: "price board", x: 290, y: 39, kunst: k,
    tipp: "Fleisch und Wurst kosten so und so viel „pro 100 Gramm“." });
}

/* =====================================================================
   3 — DAS MESSER (Magnetleiste), DIE AUFSCHNITTMASCHINE, DER FLEISCHWOLF
   ===================================================================== */
{
  let k = `<rect x="-20" y="-1.6" width="40" height="3.2" rx=".8" fill="#2b2f33"/>`;
  const messer = [[-15, 16, 1.6], [-8, 20, 2.4], [-1, 14, 1.4], [6, 18, 3.4], [13, 15, 2]];
  for (const [x, l, b] of messer) {
    k += `<rect x="${x - 1}" y="-1" width="2" height="7" rx=".6" fill="#2a1d14"/><circle cx="${x}" cy="1" r=".3" fill="#ccc"/><circle cx="${x}" cy="4" r=".3" fill="#ccc"/>`;
    k += `<path d="M${x - b / 2} 6 L${x + b / 2} 6 L${x + b / 2} ${6 + l * 0.7} Q${x + b / 2} ${6 + l} ${x - b / 2} ${6 + l} Z" fill="${STAHL}" stroke="#8d969d" stroke-width=".15"/>`;
  }
  S.teil({ id: "mz_messer_mz", de: "das Messer", syl: "MES-ser", it: "il coltello", itSyl: "col-TEL-lo", en: "knife", x: 202, y: 52, kunst: k,
    tipp: "Ein Metzger braucht viele scharfe Messer — für jede Arbeit ein eigenes." });
}
{
  /* Aufschnittmaschine: rundes Messer mit Schutz, Schlitten, rotes Gehäuse */
  let k = schatten(0, .3, 16, 1.2, .3);
  k += `<path d="M-15 0 L15 0 L13 -6 L-13 -6 Z" fill="${S.lg("asm", [[0, "#d13a3a"], [1, "#9c2020"]])}"/>`;
  k += `<rect x="-12" y="-8" width="16" height="2.4" rx=".6" fill="${STAHL}"/><path d="M-12 -8 L-3 -8 L-3 -14 L-12 -11 Z" fill="${STAHL}" opacity=".9"/>`;
  k += `<circle cx="6" cy="-13" r="9" fill="${S.rg("klinge", [[0, "#ffffff"], [0.7, "#cfd5da"], [1, "#8d969d"]], 0.4, 0.4, 0.6)}"/><circle cx="6" cy="-13" r="9" fill="none" stroke="#7d868d" stroke-width=".4"/>`;
  k += `<path d="M-2.6 -16 A9 9 0 0 1 14.6 -16 L14 -13 A8 8 0 0 0 -2 -13 Z" fill="#c9cfd4"/><circle cx="6" cy="-13" r="2.2" fill="#a8b0b6"/><circle cx="6" cy="-13" r=".8" fill="#6d757b"/>`;
  /* Wurst auf dem Schlitten, ein paar Scheiben davor */
  k += `<rect x="-11" y="-13" width="9" height="5" rx="2.4" fill="${HELL}"/><ellipse cx="-2" cy="-10.5" rx="1.2" ry="2.5" fill="#f0c1bf"/>`;
  for (let i = 0; i < 3; i++) k += `<ellipse cx="${12 + i * 1.2}" cy="${-1.6 - i * 0.5}" rx="3" ry="1" fill="#f0c1bf" stroke="#c98c8a" stroke-width=".15"/>`;
  k += `<circle cx="-10" cy="-3" r="1.3" fill="#2b2f33"/>`;
  S.teil({ id: "mz_aufschnittmaschine", de: "die Aufschnittmaschine", syl: "AUF-schnitt-ma-schi-ne", it: "l'affettatrice", itSyl: "af-fet-ta-TRI-ce", en: "meat slicer", x: 158, y: RB + 1, steht: true, kunst: k,
    tipp: "Mit der Aufschnittmaschine wird die Wurst in dünne Scheiben geschnitten." });
}
{
  /* Fleischwolf aus Edelstahl mit Trichter */
  let k = schatten(0, .3, 9, 1, .3);
  k += `<rect x="-8" y="-9" width="16" height="9" rx="1.2" fill="${STAHL}"/><rect x="-8" y="-9" width="16" height="1.6" rx=".8" fill="#fff" opacity=".6"/>`;
  k += `<rect x="-4" y="-14" width="11" height="5" rx="2.4" fill="${STAHL}"/><path d="M-1 -14 L-4 -20 L8 -20 L5 -14 Z" fill="${STAHL}" stroke="#9aa3aa" stroke-width=".2"/><ellipse cx="2" cy="-20" rx="6" ry="1.1" fill="#9aa3aa"/>`;
  k += `<circle cx="7.6" cy="-11.5" r="2.6" fill="#c9cfd4" stroke="#7d868d" stroke-width=".3"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${8.4 + i * 0.4} -10 q.6 ${2 + i * 0.3} -.2 ${3.4 + i * 0.4}" stroke="#b5444a" stroke-width=".6" fill="none"/>`;
  k += `<rect x="6" y="-3" width="6" height="3" rx=".4" fill="#fff" stroke="#bbb" stroke-width=".2"/><ellipse cx="9" cy="-3" rx="2.6" ry="1" fill="${ROT}"/>`;
  S.teil({ id: "mz_fleischwolf", de: "der Fleischwolf", syl: "FLEISCH-wolf", it: "il tritacarne", itSyl: "tri-ta-CAR-ne", en: "mincer", x: 288, y: RB + 1, steht: true, kunst: k,
    tipp: "Im Fleischwolf wird Hackfleisch frisch gemacht." });
}

/* =====================================================================
   4 — DER METZGER (hinter der Theke, rechts)
   ===================================================================== */
{
  const m = B.mensch({ id: "mz_metzger", geschlecht: "m", pose: "stehen", blick: 30, frisur: "kurz", haarfarbe: "hellbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, schuerze: { stueck: "schuerze", farbe: "#dfe6f0" }, unterteil: { stueck: "arbeitshose", farbe: "grau" }, schuhe: { stueck: "gummistiefel", farbe: "weiss" }, kopf: { stueck: "kappe", farbe: "weiss" } } }, 88);
  S.teil({ id: "mz_metzger", de: "der Metzger", syl: "METZ-ger", it: "il macellaio", itSyl: "ma-cel-LA-io", en: "butcher", x: 222, y: 172, kunst: m.svg,
    tipp: "In Norddeutschland sagt man „Schlachter“, im Süden „Metzger“, sonst oft „Fleischer“." });
}

/* =====================================================================
   5 — DIE FLEISCHTHEKE (Unterbau, ganze Breite)
   ===================================================================== */
const TH = { x0: 8, x1: 312, y0: 132, y1: 182 };
{
  const cx = (TH.x0 + TH.x1) / 2, W = TH.x1 - TH.x0, hT = TH.y1 - TH.y0;
  let k = `<path d="M${-W / 2 - 2} ${-hT} L${W / 2 + 2} ${-hT} L${W / 2} ${-hT + 4} L${-W / 2} ${-hT + 4} Z" fill="${S.lg("platte", [[0, "#f3f4f4"], [1, "#c5ccd1"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${-hT + 4}" width="${W}" height="${hT - 4}" fill="${S.lg("front", [[0, "#f7f7f5"], [1, "#e1e3e2"]])}"/>`;
  /* rote Zierleiste und Lüftungsgitter der Kühlung */
  k += `<rect x="${-W / 2}" y="${-hT + 6}" width="${W}" height="5" fill="#b3262c"/><rect x="${-W / 2}" y="${-hT + 11}" width="${W}" height=".8" fill="#fff"/>`;
  k += `<text x="${r(-W / 2 + 104)}" y="${-hT + 25}" font-size="6" text-anchor="middle" fill="#7a1c20" font-family="Georgia,serif" font-weight="bold" letter-spacing=".5">Metzgerei Huber</text>`;
  k += `<text x="${r(-W / 2 + 104)}" y="${-hT + 30}" font-size="2.6" text-anchor="middle" fill="#7a1c20" font-family="Georgia,serif" letter-spacing=".5">Meisterbetrieb · eigene Herstellung</text>`;
  for (let x = -W / 2 + 6; x < W / 2 - 6; x += 2.6) k += `<rect x="${r(x)}" y="-12" width="1.2" height="6" rx=".4" fill="#9aa3aa"/>`;
  k += `<rect x="${-W / 2}" y="-5" width="${W}" height="5" fill="#4a4e52"/><rect x="${-W / 2}" y="${-hT + 4}" width="${W}" height="1.2" fill="#fff" opacity=".7"/>`;
  S.teil({ id: "mz_theke_mz", de: "die Fleischtheke", syl: "FLEISCH-the-ke", it: "il banco della carne", itSyl: "BAN-co della CAR-ne", en: "meat counter", x: cx, y: TH.y1, steht: true, kunst: k });
}

/* =====================================================================
   6 — DIE VITRINE (gekühlt, gewölbtes Glas) — Lupe mit Fleisch und Wurst
   ===================================================================== */
const VI = { x0: 30, x1: 186, y0: 94, y1: 134 };
{
  const W = VI.x1 - VI.x0, H = VI.y1 - VI.y0, cx = (VI.x0 + VI.x1) / 2;
  let k = `<g transform="translate(${-cx} ${-VI.y1})">`;
  k += `<rect x="${VI.x0}" y="${VI.y0}" width="${W}" height="${H}" fill="${S.lg("vinnen", [[0, "#fdf6f4"], [1, "#efe2df"]])}"/>`;
  /* Glasboden oben und gekühlte Auslage unten (beide aus Edelstahl/Glas) */
  const B1 = VI.y0 + 18, B2 = VI.y1 - 1.5;
  k += `<rect x="${VI.x0 + 1}" y="${B1}" width="${W - 2}" height="1.4" fill="#d2e6ec"/>`;
  k += `<rect x="${VI.x0}" y="${B2}" width="${W}" height="2.4" fill="${STAHL}"/>`;
  k += `<rect x="${VI.x0 - 1.2}" y="${VI.y0 - 1}" width="2.4" height="${H + 2}" fill="${STAHL}"/><rect x="${VI.x1 - 1.2}" y="${VI.y0 - 1}" width="2.4" height="${H + 2}" fill="${STAHL}"/><rect x="${VI.x0 - 1.2}" y="${VI.y0 - 1.6}" width="${W + 2.4}" height="2" fill="${STAHL}"/>`;
  const schale = (x, y, w) => `<path d="M${x - w / 2} ${y} L${x + w / 2} ${y} L${x + w / 2 - 1} ${y - 3} L${x - w / 2 + 1} ${y - 3} Z" fill="#ffffff" stroke="#cfd5d8" stroke-width=".2"/>`;
  const petersilie = (x, y) => { let g = ""; for (let i = 0; i < 5; i++) g += `<circle cx="${r(x - 1.2 + rnd() * 2.4)}" cy="${r(y - 1 - rnd() * 3)}" r="${r(0.9 + rnd() * 0.5)}" fill="${i % 2 ? PETERSILIE : "#57a84f"}"/>`; return g; };
  const preis = (x, y, p) => `<line x1="${x}" y1="${y - 2}" x2="${x}" y2="${y + 1}" stroke="#888" stroke-width=".25"/><rect x="${x - 4}" y="${y + 0.6}" width="8" height="3.2" rx=".3" fill="#fff" stroke="#b3262c" stroke-width=".25"/><text x="${x}" y="${y + 2.8}" font-size="1.9" text-anchor="middle" fill="#b3262c" font-family="Arial" font-weight="bold">${p}</text>`;
  const unter = [];
  const fach = 37.5;
  const ware = (reihe, i, id, de, syl, it, itSyl, en, p, zeichne, tipp) => {
    const y = reihe ? B2 : B1, x = VI.x0 + fach / 2 + 2 + i * fach;
    k += schale(x, y, fach - 4) + zeichne(x, y - 2.6) + petersilie(x + fach / 2 - 3, y - 1.2) + preis(x - 8, y - 1, p);
    unter.push({ id, de, syl, it, itSyl, en, tipp, x, y: y + 4, kunst: flaeche(-fach / 2 + 1, -18, fach - 2, 18.6) });
  };
  /* OBEN: Aufschnitt, Leberwurst, Fleischwurst, Frikadellen */
  ware(0, 0, "mz_aufschnitt", "der Aufschnitt", "AUF-schnitt", "gli affettati", "af-fet-TA-ti", "cold cuts", "1,49", (x, y) => {
    let g = "";
    const sorten = [["#c2414a", true], ["#f2c4c0", false], ["#e79a9a", false]];
    for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) {
      const sx = x - 12 + i * 3.4 + j * 1.2, sy = y - j * 3, [f, punkte] = sorten[j];
      g += `<ellipse cx="${r(sx)}" cy="${r(sy - 1.2)}" rx="3" ry="2" fill="${f}" stroke="#ffffff" stroke-width=".2"/>`;
      if (punkte) for (let q = 0; q < 3; q++) g += `<circle cx="${r(sx - 1.4 + rnd() * 2.8)}" cy="${r(sy - 2 + rnd() * 1.6)}" r=".3" fill="#fff3e8"/>`;
    }
    return g;
  }, "Aufschnitt ist Wurst in dünnen Scheiben — fürs Brot.");
  ware(0, 1, "mz_leberwurst", "die Leberwurst", "LE-ber-wurst", "il paté di fegato", "pa-TÈ di FE-ga-to", "liver sausage", "1,09", (x, y) => {
    let g = "";
    for (let i = 0; i < 2; i++) g += `<rect x="${x - 13 + i * 2}" y="${y - 5 - i * 3}" width="17" height="5.4" rx="2.7" fill="${S.lg("leber", [[0, "#d8b6a4"], [1, "#a8826e"]])}"/><rect x="${x - 13 + i * 2}" y="${y - 3.6 - i * 3}" width="17" height=".5" fill="#c33" opacity=".6"/>`;
    g += `<ellipse cx="${x + 6}" cy="${y - 2.7}" rx="1.4" ry="2.7" fill="#e7c9b6"/><path d="M${x + 7.6} ${y - 4} q1.6 0 3.6 1.4" stroke="#e7c9b6" stroke-width="1.6" fill="none"/>`;
    return g;
  });
  ware(0, 2, "mz_fleischwurst", "die Fleischwurst", "FLEISCH-wurst", "la mortadella tedesca", "mor-ta-DEL-la te-DE-sca", "ring sausage", "1,19", (x, y) => {
    let g = `<path d="M${x - 11} ${y} Q${x - 12} ${y - 12} ${x} ${y - 12} Q${x + 12} ${y - 12} ${x + 11} ${y}" stroke="${S.lg("fwd", [[0, "#e0555a"], [1, "#a32a30"]])}" stroke-width="4.4" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M${x - 9} ${y - 7} Q${x - 7} ${y - 10.6} ${x - 2} ${y - 11}" stroke="#fff" stroke-width=".7" opacity=".4" fill="none"/><ellipse cx="${x + 11}" cy="${y - 0.2}" rx="2.3" ry="1.2" fill="#f4c6c4"/>`;
    return g;
  }, "Die Fleischwurst bekommt man als Ring — Kinder bekommen oft eine Scheibe geschenkt.");
  ware(0, 3, "mz_frikadelle", "die Frikadelle", "Fri-ka-DEL-le", "la polpetta", "pol-PET-ta", "meatball patty", "1,20", (x, y) => {
    let g = "";
    for (const [dx, dy] of [[-8, 0], [0, 0], [8, 0], [-4, -3.4], [4, -3.4]]) { g += `<ellipse cx="${x + dx}" cy="${y + dy - 1.8}" rx="4" ry="2.2" fill="${BRATEN}"/>`; for (let q = 0; q < 3; q++) g += `<circle cx="${r(x + dx - 2 + rnd() * 4)}" cy="${r(y + dy - 2.6 + rnd())}" r=".35" fill="#c08850"/>`; }
    return g;
  }, "In Berlin heißt sie „Bulette“, in Bayern „Fleischpflanzerl“.");
  /* UNTEN: Schnitzel, Hackfleisch, Steak, Bratwurst */
  ware(1, 0, "mz_schnitzel", "das Schnitzel", "SCHNIT-zel", "la cotoletta", "co-to-LET-ta", "escalope", "1,39", (x, y) => {
    let g = "";
    for (let i = 0; i < 4; i++) { const sx = x - 9 + i * 5.6; g += `<path d="M${sx - 5} ${y} Q${sx - 6} ${y - 6} ${sx} ${y - 6.6} Q${sx + 6} ${y - 6} ${sx + 4.6} ${y} Z" fill="${HELL}" stroke="#c98c8a" stroke-width=".2"/><path d="M${sx - 2} ${y - 3} q2 -1 4 .4" stroke="#fff" stroke-width=".4" opacity=".6" fill="none"/>`; }
    return g;
  });
  ware(1, 1, "mz_hackfleisch", "das Hackfleisch", "HACK-fleisch", "la carne macinata", "CAR-ne ma-ci-NA-ta", "minced meat", "1,29", (x, y) => {
    let g = `<path d="M${x - 14} ${y} Q${x - 13} ${y - 8} ${x} ${y - 8.6} Q${x + 13} ${y - 8} ${x + 14} ${y} Z" fill="${FLEISCH}"/>`;
    for (let i = 0; i < 40; i++) g += `<circle cx="${r(x - 12 + rnd() * 24)}" cy="${r(y - 0.8 - rnd() * 6.6)}" r=".38" fill="${rnd() < 0.5 ? "#f3c3c3" : "#9a3440"}"/>`;
    for (let i = -2; i <= 2; i++) g += `<path d="M${x + i * 4 - 2} ${y - 1} L${x + i * 4 + 2} ${y - 7}" stroke="#a8404e" stroke-width=".35" opacity=".7"/>`;
    g += `<ellipse cx="${x}" cy="${y - 7.6}" rx="2.4" ry=".8" fill="none" stroke="#f2ead8" stroke-width=".6"/>`;
    return g;
  }, "Hackfleisch muss am selben Tag gegessen werden.");
  ware(1, 2, "mz_steak", "das Steak", "STEAK", "la bistecca", "bi-STEC-ca", "steak", "3,49", (x, y) => {
    let g = "";
    for (let i = 0; i < 3; i++) { const sx = x - 8 + i * 7.6; g += `<path d="M${sx - 5} ${y} Q${sx - 6} ${y - 7} ${sx} ${y - 7.4} Q${sx + 6} ${y - 7} ${sx + 5} ${y} Z" fill="${ROT}"/><path d="M${sx - 5} ${y - 0.6} Q${sx - 6.2} ${y - 6.6} ${sx - 0.6} ${y - 7.4}" stroke="#f6efe2" stroke-width="1.2" fill="none"/><path d="M${sx - 1} ${y - 4} q2 -1 3.6 .6" stroke="#e98d8d" stroke-width=".35" fill="none"/>`; }
    return g;
  });
  ware(1, 3, "mz_bratwurst", "die Bratwurst", "BRAT-wurst", "la salsiccia", "sal-SIC-cia", "bratwurst", "0,99", (x, y) => {
    let g = "";
    for (let j = 0; j < 2; j++) for (let i = 0; i < 5; i++) g += `<rect x="${x - 14 + i * 5.6 + j * 2.8}" y="${y - 3 - j * 3}" width="5.2" height="2.8" rx="1.4" fill="${S.lg("bratw", [[0, "#f3dcc8"], [1, "#d4b49a"]])}" stroke="#bfa088" stroke-width=".15"/>`;
    return g;
  }, "Die Thüringer Rostbratwurst ist berühmt.");
  k += `</g>`;
  S.teil({ id: "mz_vitrine", de: "die Vitrine", syl: "Vi-TRI-ne", it: "la vetrina", itSyl: "ve-TRI-na", en: "display case", x: cx, y: VI.y1, kunst: k,
    zoom: { x: VI.x0 - 2, y: VI.y0 - 10, w: W + 4, h: H + 14 }, unter });
  /* gewölbtes Glas davor */
  S.davor(`<path d="M${VI.x0} ${VI.y0 - 1} Q${VI.x0 + 6} ${VI.y0 - 9} ${VI.x0 + 18} ${VI.y0 - 9} L${VI.x1 - 18} ${VI.y0 - 9} Q${VI.x1 - 6} ${VI.y0 - 9} ${VI.x1} ${VI.y0 - 1} Z" fill="#e8f3f6" opacity=".3" stroke="#c7d4d9" stroke-width=".8"/>
    <path d="M${VI.x0 + 10} ${VI.y1 - 2} L${VI.x0 + 26} ${VI.y0 - 6} L${VI.x0 + 33} ${VI.y0 - 6} L${VI.x0 + 17} ${VI.y1 - 2} Z" fill="#fff" opacity=".14"/>
    <path d="M${VI.x0 + 90} ${VI.y1 - 2} L${VI.x0 + 100} ${VI.y0 - 6} L${VI.x0 + 104} ${VI.y0 - 6} L${VI.x0 + 94} ${VI.y1 - 2} Z" fill="#fff" opacity=".1"/>
    <rect x="${VI.x0}" y="${VI.y0 - 8}" width="${VI.x1 - VI.x0}" height="${VI.y1 - VI.y0 + 8}" fill="${GLAS}"/>`);
}

/* =====================================================================
   7 — AUF DER THEKE: Papiertüte, Waage
   ===================================================================== */
const PL = TH.y0 + 1.2;
{
  /* DIE PAPIERTÜTE — gefüllt, Metzgerpapier oben eingeschlagen */
  let k = schatten(0, .2, 6, .7, .25);
  k += `<path d="M-5 0 L5 0 L4.4 -11 L-4.4 -11 Z" fill="${S.lg("tuete", [[0, "#e6c99a"], [1, "#c9a46a"]], 0, 0, 1, 0)}" stroke="#a8814c" stroke-width=".2"/>`;
  k += `<path d="M-4.4 -11 L-3 -13 L3.2 -13 L4.4 -11 Z" fill="#d6b582"/><path d="M-2.6 -13 Q0 -15.4 2.6 -13" fill="#f4efe6" stroke="#cfc6b6" stroke-width=".2"/>`;
  k += `<text x="0" y="-5" font-size="1.9" text-anchor="middle" fill="#7a1c20" font-family="Georgia" font-weight="bold">Huber</text><path d="M-2.8 -3.4 h5.6" stroke="#7a1c20" stroke-width=".25"/>`;
  S.teil({ oben: true, id: "mz_papiertuete", de: "die Papiertüte", syl: "Pa-PIER-tü-te", it: "il sacchetto di carta", itSyl: "sac-CHET-to di CAR-ta", en: "paper bag", x: 200, y: PL, steht: true, kunst: k });
}
{
  /* DIE WAAGE — Thekenwaage mit Anzeige zur Kundschaft */
  let k = schatten(0, .3, 12, 1.1, .3);
  k += `<path d="M-11 0 L11 0 L10 -3 L-10 -3 Z" fill="#dfe3e6"/><path d="M-10 -3 L10 -3 L9 -5 L-9 -5 Z" fill="${STAHL}"/>`;
  k += `<rect x="-1" y="-20" width="2" height="15" fill="#7d868d"/>`;
  k += `<rect x="-11" y="-30" width="22" height="11" rx="1.2" fill="#2b2f33"/><rect x="-10" y="-29" width="20" height="9" rx=".6" fill="#10161a"/>`;
  k += `<text x="-5" y="-25.6" font-size="2" text-anchor="middle" fill="#9fb2bf" font-family="Arial">kg</text><text x="-5" y="-22" font-size="3" text-anchor="middle" fill="#7cff8a" font-family="monospace">0,348</text>`;
  k += `<text x="5" y="-25.6" font-size="2" text-anchor="middle" fill="#9fb2bf" font-family="Arial">€</text><text x="5" y="-22" font-size="3" text-anchor="middle" fill="#ffd166" font-family="monospace">4,52</text>`;
  /* Hackfleisch in Papier auf der Waage */
  k += `<path d="M-6 -5 L6 -5 L5 -7 L-5 -7 Z" fill="#f4efe6"/><ellipse cx="0" cy="-7.4" rx="4" ry="1.6" fill="${FLEISCH}"/>`;
  S.teil({ oben: true, id: "mz_waage_mz", de: "die Waage", syl: "WAA-ge", it: "la bilancia", itSyl: "bi-LAN-cia", en: "scales", x: 256, y: PL, steht: true, kunst: k,
    tipp: "Die Waage zeigt das Gewicht und gleich den Preis." });
}

/* =====================================================================
   8 — DIE WARTENUMMER (Spender auf Ständer, vorne links) und DIE KUNDIN
   ===================================================================== */
{
  let k = schatten(0, .3, 7, 1.2, .3);
  k += `<ellipse cx="0" cy="-.8" rx="6.6" ry="1.6" fill="#3a3f44"/><rect x="-1" y="-62" width="2" height="61" fill="${STAHL}"/>`;
  k += `<rect x="-6.6" y="-84" width="13.2" height="7" rx="1" fill="#1a1d20"/><text x="0" y="-78.8" font-size="4.6" text-anchor="middle" fill="#ff4d3d" font-family="monospace" font-weight="bold">47</text>`;
  k += `<rect x="-.6" y="-77" width="1.2" height="2" fill="#555"/>`;
  k += `<path d="M-6 -75 L6 -75 L6 -62 Q0 -59 -6 -62 Z" fill="${S.lg("spender", [[0, "#e23a3a"], [1, "#a81d1d"]], 0, 0, 1, 0)}"/><rect x="-3.6" y="-71" width="7.2" height="2.4" rx=".4" fill="#fff"/><text x="0" y="-69.3" font-size="1.6" text-anchor="middle" fill="#a81d1d" font-family="Arial" font-weight="bold">Nummer ziehen</text>`;
  k += `<path d="M-2.4 -66 L2.4 -66 L2.6 -58.6 L-2.2 -58.4 Z" fill="#fffdf2" stroke="#d9d2b9" stroke-width=".15"/><text x="0.2" y="-61" font-size="2.6" text-anchor="middle" fill="#222" font-family="monospace" font-weight="bold">52</text>`;
  S.teil({ id: "mz_nummer_mz", de: "die Wartenummer", syl: "WAR-te-num-mer", it: "il numero d'attesa", itSyl: "NU-me-ro d'at-TE-sa", en: "queue number", x: 14, y: 197, steht: true, kunst: k,
    tipp: "Man zieht eine Wartenummer und wartet, bis sie oben angezeigt wird." });
}
{
  const m = B.mensch({ id: "mz_kundin", geschlecht: "w", pose: "stehen", blick: -60, frisur: "kurz", haarfarbe: "grau", haut: "hell", alter: "senior",
    kleidung: { oberteil: { stueck: "bluse", farbe: "rosa" }, jacke: { stueck: "mantel", farbe: "#5b6b7d" }, unterteil: { stueck: "hose", farbe: "beige" }, schuhe: { stueck: "halbschuh" }, zubehoer: { stueck: "tasche", farbe: "schwarz" } } }, 98);
  S.teil({ id: "mz_kundin_mz", de: "die Kundin", syl: "KUN-din", it: "la cliente", itSyl: "cli-EN-te", en: "customer", x: 294, y: 197, kunst: m.svg,
    tipp: "Die Kundin bestellt: „Ich hätte gern 200 Gramm Aufschnitt, bitte.“" });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/metzgerei.js"));
console.log(aus);
