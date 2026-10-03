#!/usr/bin/env node
/* =====================================================================
   DIE BÄCKEREI (FASSUNG 851) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263): „wie sieht es in der Bäckerei richtig aus …
   recherchiere bis ins kleinste Detail im Internet bevor du da wirklich
   etwas anfängst zu bauen und mache diese Orte authentisch“.

   RECHERCHE (Ladenbau für Bäckereien, z. B. Kesseböhmer „Backwaren“,
   Bizerba-Fallstudie Bäckerei Koch, Fachartikel Kaffeevollautomat in der
   Bäckerei) — so ist eine deutsche Bäckereifiliale aufgebaut:
   - Hinter der Theke die RÜCKWAND mit dem Brotregal: schräge Fächer,
     damit die Brote nach vorne rutschen und mit der Schnittfläche bzw.
     dem Laib zur Kundschaft liegen; Brötchen in Körben/Schütten.
   - Davor die VERKAUFSTHEKE; links die gekühlte KUCHENVITRINE mit
     gebogener Glasfront (Torten, Blechkuchen, Teilchen, belegte
     Brötchen), jedes Stück mit Preisschild.
   - Auf der Theke: Kasse mit Bildschirm, Kartenlesegerät, Gebäckzange,
     Papiertüten, Trinkgeldglas, Brezelständer.
   - Auf dem Rückbuffet: Kaffeevollautomat mit Tassen, die
     Brotschneidemaschine (das Brot wird auf Wunsch geschnitten).
   - Kreidetafel mit den Angeboten, Wanduhr, warmes LED-/Pendellicht.
   - In Handwerksbäckereien oft ein Fenster in die BACKSTUBE: man sieht
     den Backofen.
   Maßstab: Rückwand ≈ 47 Einheiten je Meter, Theke ≈ 58 je Meter
   (Thekenhöhe 0,9 m), Verkäuferin 1,66 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "baeckerei", titel: "Die Bäckerei", emoji: "🥐", thema: "Essen & Trinken", kuerzel: "bk", fassung: 851 });
const rnd = zufall(1928);
const r = B.r;

/* ---------- Grundfarben und Stoffe ---------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("glanz")}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="0.6"/></filter>`);
const WAND = S.lg("wand", [[0, "#f3e6cf"], [0.55, "#eedcbe"], [1, "#e2cba6"]]);
const DECKE = S.lg("decke", [[0, "#efe7da"], [1, "#e3d8c7"]]);
const HOLZ_H = S.lg("holzh", [[0, "#a8703f"], [0.5, "#946034"], [1, "#7d4f2a"]]);
const HOLZ_V = S.lg("holzv", [[0, "#8a5a30"], [0.5, "#a06a3a"], [1, "#835529"]], 0, 0, 1, 0);
const HOLZ_DUNKEL = S.lg("holzd", [[0, "#6b4322"], [1, "#4e2f17"]]);
const BODEN = S.lg("boden", [[0, "#b7a089"], [1, "#9c8570"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.32], [0.4, "#e8f4f7", 0.08], [1, "#ffffff", 0.18]], 0, 0, 1, 1);
const KRUSTE = S.rg("kruste", [[0, "#d99a52"], [0.55, "#b9732f"], [1, "#7e4719"]], 0.42, 0.35, 0.75);
const KRUSTE_DUNKEL = S.rg("krusted", [[0, "#9a5f30"], [0.6, "#6e3f1c"], [1, "#4a2810"]], 0.42, 0.35, 0.75);
const LAUGE = S.rg("lauge", [[0, "#b36a2c"], [0.6, "#8a4614"], [1, "#5e2c0a"]], 0.4, 0.35, 0.8);
const HELL = S.rg("hellkruste", [[0, "#f2cf8e"], [0.6, "#dba35b"], [1, "#b47838"]], 0.42, 0.35, 0.8);

/* =====================================================================
   KULISSE — der Raum (Decke, Wand, Boden). Keine Dinge zum Antippen.
   ===================================================================== */
const WAND_UNTEN = 128;     // Boden hinter der Theke (Rückwandfuß)
S.hinten(`<rect x="0" y="0" width="320" height="15" fill="${DECKE}"/>`);
/* Deckenleiste und eingelassene Spots */
S.hinten(`<rect x="0" y="14" width="320" height="2.2" fill="#d6c7ad"/>`);
for (const x of [40, 120, 200, 280]) {
  S.hinten(`<ellipse cx="${x}" cy="7" rx="5" ry="1.4" fill="#fff8e6"/><ellipse cx="${x}" cy="7" rx="10" ry="3" fill="#fff3d0" opacity=".25"/>`);
}
/* Rückwand mit leichtem Putz und warmem Lichtverlauf */
S.hinten(`<rect x="0" y="16" width="320" height="${WAND_UNTEN - 16}" fill="${WAND}"/>`);
S.hinten(`<rect x="0" y="16" width="320" height="${WAND_UNTEN - 16}" fill="${S.rg("wandlicht", [[0, "#fff6df", 0.55], [1, "#fff6df", 0]], 0.5, 0.15, 0.7)}"/>`);
let putz = "";
for (let i = 0; i < 140; i++) {
  const x = rnd() * 320, y = 16 + rnd() * (WAND_UNTEN - 16);
  putz += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.3 + rnd() * 0.6)}" fill="${rnd() < 0.5 ? "#d9c29c" : "#fbf1dd"}" opacity=".5"/>`;
}
S.hinten(putz);
/* Wandfliesen (Metro-Fliesen) hinter dem Rückbuffet — hygienisch, typisch */
let fliesen = "";
for (const [x0, x1] of [[4, 78], [244, 316]]) {
  for (let y = 78; y < WAND_UNTEN; y += 4) {
    const off = ((y - 78) / 4) % 2 ? 4 : 0;
    for (let x = x0 - off; x < x1; x += 8) {
      const a = Math.max(x, x0), b = Math.min(x + 8, x1);
      if (b - a > 0.6) fliesen += `<rect x="${r(a + 0.2)}" y="${r(y + 0.2)}" width="${r(b - a - 0.4)}" height="3.6" rx=".5" fill="#f7f4ee" stroke="#d8d1c4" stroke-width=".25"/>`;
    }
  }
}
S.hinten(fliesen);
/* Fliesenboden: durchgehend vom Rückwandfuß bis vorne, in Fluchtperspektive */
{
  let f = `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${BODEN}"/>`;
  for (let i = -9; i <= 9; i++) f += `<line x1="${160 + i * 22}" y1="${WAND_UNTEN}" x2="${160 + i * 62}" y2="200" stroke="#7f6a56" stroke-width=".35" opacity=".65"/>`;
  for (const y of [WAND_UNTEN + 6, WAND_UNTEN + 14, WAND_UNTEN + 25, WAND_UNTEN + 40, WAND_UNTEN + 58]) f += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#7f6a56" stroke-width=".35" opacity=".55"/>`;
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="1.2" fill="#6f5a47"/>`;
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.18], [0.4, "#000", 0], [1, "#fff", 0.06]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DIE LAMPEN (Pendelleuchten über der Theke)
   ===================================================================== */
{
  let k = "";
  for (const x of [-60, 0, 60]) {
    k += `<line x1="${x}" y1="-20" x2="${x}" y2="-3" stroke="#3a2c20" stroke-width=".5"/>`;
    k += `<path d="M${x - 7} 4 Q${x - 6} -3 ${x} -3.5 Q${x + 6} -3 ${x + 7} 4 Z" fill="${S.lg("lampe", [[0, "#2f3b35"], [1, "#1c2420"]])}"/>`;
    k += `<ellipse cx="${x}" cy="4" rx="7" ry="1.6" fill="#fff4cf"/>`;
    k += `<path d="M${x - 7} 4.5 L${x - 22} 30 L${x + 22} 30 L${x + 7} 4.5 Z" fill="${S.lg("kegel", [[0, "#fff4cf", 0.32], [1, "#fff4cf", 0]])}" pointer-events="none"/>`;
  }
  k += flaeche(-68, -6, 16, 11) + flaeche(-8, -6, 16, 11) + flaeche(52, -6, 16, 11);
  S.teil({ id: "lampe", de: "die Lampe", syl: "LAM-pe", it: "la lampada", itSyl: "LAM-pa-da", en: "lamp", x: 160, y: 22, kunst: k });
}

/* =====================================================================
   2 — DIE KREIDETAFEL mit den Angeboten des Tages (links oben)
   ===================================================================== */
{
  let k = `<rect x="-24" y="-20" width="48" height="40" rx="1.6" fill="${HOLZ_V}"/>`;
  k += `<rect x="-21.5" y="-17.5" width="43" height="35" fill="${S.lg("tafel", [[0, "#2e3a33"], [1, "#222b26"]])}"/>`;
  k += `<rect x="-21.5" y="-17.5" width="43" height="35" fill="#fff" opacity=".04"/>`;
  const t = (y, s, txt, f = "#f4f0e6", w = "normal") => `<text x="0" y="${y}" font-size="${s}" text-anchor="middle" fill="${f}" font-family="'Comic Sans MS','Segoe Print',cursive" font-weight="${w}">${txt}</text>`;
  k += t(-10.5, 4.6, "Angebot des Tages", "#f6e7a1", "bold");
  k += `<line x1="-15" y1="-8.2" x2="15" y2="-8.2" stroke="#f6e7a1" stroke-width=".35" stroke-dasharray="1 .8"/>`;
  k += t(-2.5, 3.5, "6 Brötchen … 2,10 €");
  k += t(3, 3.5, "Kaffee &amp; Croissant 3,20 €");
  k += t(8.5, 3.5, "Bienenstich … 2,40 €");
  k += t(14, 3.2, "Heute frisch: Dinkelbrot!", "#ffc9b8");
  /* Kreidestaub und Wischspuren */
  k += `<path d="M-19 15 q8 -1.5 16 0" stroke="#fff" stroke-width=".9" opacity=".08" fill="none"/>`;
  k += `<rect x="-24" y="19.5" width="48" height="2" rx=".8" fill="${HOLZ_DUNKEL}"/><rect x="10" y="18.6" width="6" height="1.1" rx=".5" fill="#fff"/>`;
  S.teil({ id: "kreidetafel", de: "die Kreidetafel", syl: "KREI-de-ta-fel", it: "la lavagna", itSyl: "la-VA-gna", en: "chalkboard", x: 41, y: 46, kunst: k,
    tipp: "Auf der Kreidetafel stehen die Angebote des Tages." });
}

/* =====================================================================
   3 — DIE UHR (Wanduhr rechts oben)
   ===================================================================== */
{
  let k = `<circle r="9" fill="#3b2a1c"/><circle r="8" fill="${S.rg("ziffer", [[0, "#fffdf6"], [1, "#efe6d2"]])}"/>`;
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6, x1 = Math.sin(a) * 6.9, y1 = -Math.cos(a) * 6.9, x2 = Math.sin(a) * (i % 3 ? 6.1 : 5.3), y2 = -Math.cos(a) * (i % 3 ? 6.1 : 5.3);
    k += `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="#2a1d12" stroke-width="${i % 3 ? 0.35 : 0.7}"/>`;
  }
  /* sieben Uhr zehn — Bäckereien öffnen früh */
  k += `<line x1="0" y1="0" x2="${r(Math.sin(7.17 * Math.PI / 6) * 3.8)}" y2="${r(-Math.cos(7.17 * Math.PI / 6) * 3.8)}" stroke="#1d140c" stroke-width=".9" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="0" x2="${r(Math.sin(2 * Math.PI / 6) * 5.8)}" y2="${r(-Math.cos(2 * Math.PI / 6) * 5.8)}" stroke="#1d140c" stroke-width=".55" stroke-linecap="round"/>`;
  k += `<circle r=".7" fill="#b3261e"/><path d="M-5 -6 A8 8 0 0 1 4 -7" stroke="#fff" stroke-width=".8" opacity=".55" fill="none"/>`;
  S.teil({ id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: 78, y: 30, kunst: k });
}

/* =====================================================================
   4 — DAS SCHILD über dem Brotregal (Name der Bäckerei)
   ===================================================================== */
{
  let k = `<rect x="-40" y="-7" width="80" height="14" rx="2" fill="${S.lg("schild", [[0, "#5b3417"], [1, "#3f2410"]])}"/>`;
  k += `<rect x="-38.6" y="-5.6" width="77.2" height="11.2" rx="1.3" fill="none" stroke="#d8b46a" stroke-width=".45"/>`;
  k += `<text x="0" y="2.4" font-size="7.2" text-anchor="middle" fill="#f1d79a" font-family="Georgia,'Times New Roman',serif" font-weight="bold" letter-spacing=".6">Bäckerei Meier</text>`;
  k += `<text x="0" y="5.6" font-size="2.2" text-anchor="middle" fill="#d8b46a" font-family="Georgia,serif" letter-spacing=".5">SEIT 1928 · MEISTERBETRIEB</text>`;
  S.teil({ id: "schild", de: "das Schild", syl: "SCHILD", it: "l'insegna", itSyl: "in-SE-gna", en: "sign", x: 160, y: 25, kunst: k });
}

/* =====================================================================
   5 — DER BACKOFEN, durch das Fenster in die Backstube (rechts)
   ===================================================================== */
{
  let k = `<rect x="-30" y="-19" width="60" height="38" rx="1.2" fill="${HOLZ_DUNKEL}"/>`;
  k += `<rect x="-28" y="-17" width="56" height="34" fill="${S.lg("backstube", [[0, "#cfc6b8"], [1, "#a99c88"]])}"/>`;
  /* Etagenofen aus Edelstahl mit drei Backkammern, eine glüht */
  k += `<rect x="-22" y="-13" width="44" height="30" rx="1" fill="${STAHL}"/>`;
  for (let i = 0; i < 3; i++) {
    const y = -11 + i * 9.4;
    k += `<rect x="-19" y="${r(y)}" width="31" height="7.4" rx=".8" fill="#2b2622"/>`;
    k += `<rect x="-18" y="${r(y + 0.9)}" width="29" height="5.6" rx=".5" fill="${i === 1 ? S.lg("glut", [[0, "#ffb347"], [1, "#d9631e"]]) : "#4a3f37"}"/>`;
    if (i === 1) for (let j = 0; j < 5; j++) k += `<ellipse cx="${r(-15 + j * 6)}" cy="${r(y + 4.6)}" rx="2.3" ry="1.1" fill="#8b4d18"/>`;
    k += `<rect x="-17" y="${r(y + 0.4)}" width="27" height="1" fill="#fff" opacity=".2"/>`;
    k += `<rect x="14" y="${r(y + 1)}" width="5.5" height="5.2" rx=".6" fill="#1e2a33"/><circle cx="16.7" cy="${r(y + 3.6)}" r="1.3" fill="#62c370"/>`;
  }
  /* Fensterrahmen und Spiegelung */
  k += `<path d="M-28 -17 L-8 -17 L-28 6 Z" fill="#fff" opacity=".13"/>`;
  k += `<rect x="-28" y="-17" width="56" height="34" fill="none" stroke="#5a3a1f" stroke-width="1.6"/>`;
  k += `<line x1="0" y1="-17" x2="0" y2="17" stroke="#5a3a1f" stroke-width="1.1"/>`;
  S.teil({ id: "backofen", de: "der Backofen", syl: "BACK-o-fen", it: "il forno", itSyl: "FOR-no", en: "oven", x: 278, y: 58, kunst: k,
    tipp: "Durch das Fenster sieht man in die Backstube. Dort backt der Bäcker im Backofen." });
}

/* =====================================================================
   6 — RÜCKBUFFET links: KAFFEEMASCHINE und TASSEN
   ===================================================================== */
const BUFFET_O = 104; // Oberkante Rückbuffet
S.hinten(`<rect x="2" y="${BUFFET_O}" width="80" height="${WAND_UNTEN - BUFFET_O}" fill="${HOLZ_H}"/><rect x="2" y="${BUFFET_O}" width="80" height="2.2" fill="#c89a62"/>`);
S.hinten(`<rect x="240" y="${BUFFET_O}" width="80" height="${WAND_UNTEN - BUFFET_O}" fill="${HOLZ_H}"/><rect x="240" y="${BUFFET_O}" width="80" height="2.2" fill="#c89a62"/>`);
{
  /* Kaffeevollautomat: Gehäuse, Display, Auslauf, Tropfgitter */
  let k = schatten(0, 0.3, 14, 1.2, 0.3);
  k += `<rect x="-12" y="-30" width="24" height="30" rx="2" fill="${S.lg("kaffeegeh", [[0, "#3a3d42"], [0.5, "#24272b"], [1, "#16181b"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-12" y="-30" width="24" height="4" rx="1.6" fill="#4a4e54"/>`;
  k += `<rect x="-8" y="-24" width="16" height="7" rx=".8" fill="#0f2430"/><rect x="-7" y="-23" width="14" height="5" rx=".5" fill="${S.lg("display", [[0, "#5ed0f0"], [1, "#2a8fb8"]])}"/>`;
  k += `<text x="0" y="-19.6" font-size="2.2" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif">Cappuccino</text>`;
  for (let i = 0; i < 4; i++) k += `<circle cx="${-6 + i * 4}" cy="-14.6" r="1.1" fill="#6b7178"/>`;
  k += `<rect x="-7" y="-12" width="14" height="3" rx=".6" fill="${STAHL}"/><rect x="-2.4" y="-9" width="1.4" height="2.2" fill="#9aa3aa"/><rect x="1" y="-9" width="1.4" height="2.2" fill="#9aa3aa"/>`;
  k += `<rect x="-10" y="-2.6" width="20" height="2.6" rx=".5" fill="${STAHL}"/>`;
  for (let i = 0; i < 9; i++) k += `<line x1="${-9 + i * 2.2}" y1="-2.3" x2="${-9 + i * 2.2}" y2="-.3" stroke="#7d868d" stroke-width=".35"/>`;
  /* eine Tasse unter dem Auslauf, Dampf */
  k += `<path d="M-2.8 -6.6 h5.6 l-.6 4 h-4.4 Z" fill="#fbfbfa"/><path d="M2.6 -5.8 q1.8 .2 1.4 1.6 q-.4 1.1 -1.8 .8" stroke="#e8e8e6" stroke-width=".7" fill="none"/>`;
  k += `<path d="M-1 -8 q-1.2 -2 0 -3.6 q1.2 -1.6 0 -3.2" stroke="#fff" stroke-width=".5" opacity=".55" fill="none"/>`;
  k += `<path d="M-11 -29 L-11 -1 L-8 -1 L-8 -29 Z" fill="#fff" opacity=".08"/>`;
  S.teil({ id: "kaffeemaschine", de: "die Kaffeemaschine", syl: "KAF-fee-ma-schi-ne", it: "la macchina del caffè", itSyl: "MAC-chi-na del caf-FÈ", en: "coffee machine", x: 24, y: BUFFET_O, steht: true, kunst: k });
}
{
  /* Tassenstapel und Untertassen neben der Maschine */
  let k = "";
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 3; i++) {
      const x = -4.6 + j * 9.2, y = -i * 4.2;
      k += `<ellipse cx="${x}" cy="${r(y - 0.6)}" rx="4.4" ry="1.1" fill="#ece9e2"/>`;
      k += `<path d="M${x - 3.2} ${r(y - 4)} h6.4 l-.5 3.3 q-2.7 1.2 -5.4 0 Z" fill="${S.lg("tasse", [[0, "#ffffff"], [0.7, "#f1efea"], [1, "#d8d4cc"]], 0, 0, 1, 0)}"/>`;
      k += `<ellipse cx="${x}" cy="${r(y - 4)}" rx="3.2" ry=".7" fill="#e2ddd3"/>`;
      k += `<path d="M${x + 3} ${r(y - 3.2)} q1.6 .2 1.2 1.4 q-.4 .9 -1.6 .6" stroke="#f3f1ec" stroke-width=".6" fill="none"/>`;
    }
  }
  S.teil({ oben: true, id: "tasse", de: "die Tasse", syl: "TAS-se", it: "la tazza", itSyl: "TAZ-za", en: "cup", x: 24, y: BUFFET_O - 30, steht: true, kunst: k,
    tipp: "Oben auf der Kaffeemaschine werden die Tassen vorgewärmt." });
}

/* =====================================================================
   7 — DIE BROTSCHNEIDEMASCHINE (Rückbuffet rechts)
   ===================================================================== */
{
  let k = schatten(0, 0.3, 17, 1.3, 0.3);
  /* Gehäuse mit Plexiglas-Haube, Brot liegt im Schacht */
  k += `<rect x="-16" y="-8" width="32" height="8" rx="1.2" fill="${S.lg("bsm", [[0, "#f2f3f2"], [1, "#c9cdcf"]])}"/>`;
  k += `<rect x="-16" y="-8" width="32" height="1.6" rx=".8" fill="#ffffff"/>`;
  k += `<path d="M-14 -8 L-14 -22 Q-14 -25 -11 -25 L11 -25 Q14 -25 14 -22 L14 -8 Z" fill="#dfe9ee" opacity=".55" stroke="#9fb2bb" stroke-width=".5"/>`;
  /* Brot im Schacht, halb geschnitten */
  k += `<path d="M-11 -9 Q-11 -18 -3 -18.6 Q5 -18 6 -9 Z" fill="${KRUSTE_DUNKEL}"/>`;
  for (let i = 0; i < 5; i++) k += `<path d="M${6 + i * 1.5} -9 L${6 + i * 1.5} -16.5 Q${7 + i * 1.5} -17.4 ${7.3 + i * 1.5} -16.5 L${7.3 + i * 1.5} -9 Z" fill="${i % 2 ? "#e7cfa4" : "#dcbf8f"}" stroke="#7b4a22" stroke-width=".25"/>`;
  k += `<rect x="-15" y="-4.8" width="9" height="2.4" rx=".6" fill="#2d6fb3"/><circle cx="10" cy="-3.8" r="1.4" fill="#d23b30"/><circle cx="13.4" cy="-3.8" r="1.4" fill="#3ca35a"/>`;
  k += `<path d="M-13 -24 L-6 -24 L-13 -12 Z" fill="#fff" opacity=".25"/>`;
  S.teil({ id: "brotschneidemaschine", de: "die Brotschneidemaschine", syl: "BROT-schnei-de-ma-schi-ne", it: "l'affettatrice per il pane", itSyl: "af-fet-ta-TRI-ce per il PA-ne", en: "bread slicer", x: 268, y: BUFFET_O, steht: true, kunst: k,
    tipp: "Auf Wunsch wird das Brot hier in Scheiben geschnitten." });
}

/* =====================================================================
   8 — DAS BROTREGAL (Rückwand, schräge Fächer) — Lupe mit den Broten
   ===================================================================== */
const REGAL = { x0: 92, x1: 228, y0: 32, y1: WAND_UNTEN };
const brotUnter = [];
{
  const W = REGAL.x1 - REGAL.x0, H = REGAL.y1 - REGAL.y0, cx = (REGAL.x0 + REGAL.x1) / 2;
  let k = "";
  /* Korpus */
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${HOLZ_V}"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="3" fill="#6d4322"/>`;
  /* drei Reihen mit schrägen Böden, vier Fächer je Reihe */
  const reihen = [[-H + 4, -H + 24], [-H + 26, -H + 46], [-H + 48, -H + 68]];
  const spalten = 4, fw = (W - 6) / spalten;
  reihen.forEach(([a, b], ri) => {
    for (let s = 0; s < spalten; s++) {
      const x = -W / 2 + 3 + s * fw;
      k += `<rect x="${r(x + 0.8)}" y="${r(a)}" width="${r(fw - 1.6)}" height="${r(b - a)}" fill="${S.lg("fach", [[0, "#3b2412"], [1, "#5a381c"]])}"/>`;
      /* Licht von oben im Fach */
      k += `<rect x="${r(x + 0.8)}" y="${r(a)}" width="${r(fw - 1.6)}" height="${r(b - a)}" fill="${S.lg("fachlicht", [[0, "#ffd88a", 0.32], [0.35, "#ffd88a", 0.06], [1, "#ffd88a", 0]])}"/>`;
      /* schräger Boden (vorne tiefer) */
      k += `<path d="M${r(x + 0.8)} ${r(b - 4)} L${r(x + fw - 0.8)} ${r(b - 4)} L${r(x + fw - 0.8)} ${r(b)} L${r(x + 0.8)} ${r(b)} Z" fill="#8c5a2e"/>`;
      k += `<rect x="${r(x + 0.8)}" y="${r(b - 0.9)}" width="${r(fw - 1.6)}" height="1.6" fill="#c08a52"/>`;
    }
  });
  /* Stützen zwischen den Fächern */
  for (let s = 0; s <= spalten; s++) {
    const x = -W / 2 + 3 + s * fw;
    k += `<rect x="${r(x - 0.9)}" y="${-H + 3}" width="1.8" height="${r(H - 30)}" fill="#6d4322"/>`;
  }
  /* Brote einsetzen: [Spalte, Reihe, Sorte, Wort …] */
  const sorten = [
    { s: 0, r: 0, art: "laib", farbe: KRUSTE_DUNKEL, mehl: true, id: "roggenbrot", de: "das Roggenbrot", syl: "ROG-gen-brot", it: "il pane di segale", itSyl: "PA-ne di SE-ga-le", en: "rye bread" },
    { s: 1, r: 0, art: "laib", farbe: KRUSTE, schnitte: true, id: "mischbrot", de: "das Mischbrot", syl: "MISCH-brot", it: "il pane misto", itSyl: "PA-ne MI-sto", en: "mixed bread" },
    { s: 2, r: 0, art: "kasten", farbe: KRUSTE_DUNKEL, koerner: true, id: "vollkornbrot", de: "das Vollkornbrot", syl: "VOLL-korn-brot", it: "il pane integrale", itSyl: "PA-ne in-te-GRA-le", en: "wholegrain bread" },
    { s: 3, r: 0, art: "kasten", farbe: HELL, toast: true, id: "toastbrot", de: "das Toastbrot", syl: "TOAST-brot", it: "il pancarré", itSyl: "pan-car-RÈ", en: "toast bread" },
    { s: 0, r: 1, art: "baguette", farbe: HELL, id: "baguette", de: "das Baguette", syl: "ba-GET-te", it: "la baguette", itSyl: "ba-GHET-te", en: "baguette" },
    { s: 1, r: 1, art: "laib", farbe: HELL, dinkel: true, id: "dinkelbrot", de: "das Dinkelbrot", syl: "DIN-kel-brot", it: "il pane di farro", itSyl: "PA-ne di FAR-ro", en: "spelt bread" },
    { s: 2, r: 1, art: "stange", farbe: LAUGE, id: "laugenstange", de: "die Laugenstange", syl: "LAU-gen-stan-ge", it: "il bastoncino al pretzel", itSyl: "ba-ston-CI-no al PRET-zel", en: "pretzel stick" },
    { s: 3, r: 1, art: "laib", farbe: KRUSTE, rund: true, id: "bauernbrot", de: "das Bauernbrot", syl: "BAU-ern-brot", it: "il pane casereccio", itSyl: "PA-ne ca-se-REC-cio", en: "farmhouse bread" },
    { s: 0, r: 2, art: "broetchen", farbe: HELL, id: "weizenbroetchen", de: "das Weizenbrötchen", syl: "WEI-zen-bröt-chen", it: "il panino bianco", itSyl: "pa-NI-no BIAN-co", en: "white roll" },
    { s: 1, r: 2, art: "broetchen", farbe: KRUSTE_DUNKEL, koerner: true, id: "koernerbroetchen", de: "das Körnerbrötchen", syl: "KÖR-ner-bröt-chen", it: "il panino ai cereali", itSyl: "pa-NI-no ai ce-re-A-li", en: "seeded roll" },
    { s: 2, r: 2, art: "broetchen", farbe: KRUSTE, mohn: true, id: "mohnbroetchen", de: "das Mohnbrötchen", syl: "MOHN-bröt-chen", it: "il panino ai semi di papavero", itSyl: "pa-NI-no ai SE-mi di pa-PA-ve-ro", en: "poppy seed roll" },
    { s: 3, r: 2, art: "broetchen", farbe: KRUSTE, sesam: true, id: "sesambroetchen", de: "das Sesambrötchen", syl: "SE-sam-bröt-chen", it: "il panino al sesamo", itSyl: "pa-NI-no al SE-sa-mo", en: "sesame roll" },
  ];
  sorten.forEach((b) => {
    const [a, bb] = reihen[b.r];
    const fx = -W / 2 + 3 + b.s * fw + fw / 2, boden = bb - 4;
    let g = "";
    if (b.art === "laib") {
      /* zwei Laibe hintereinander, der vordere ganz zu sehen */
      for (const [dx, dy, sk] of [[-4, -3, 0.82], [2, 0, 1]]) {
        const w = 13 * sk, h = (b.rund ? 9.5 : 8) * sk, x = fx + dx, y = boden + dy;
        g += `<path d="M${r(x - w)} ${r(y)} Q${r(x - w)} ${r(y - h * 1.05)} ${r(x)} ${r(y - h)} Q${r(x + w)} ${r(y - h * 1.05)} ${r(x + w)} ${r(y)} Z" fill="${b.farbe}"/>`;
        if (b.mehl) {
          for (let i = 0; i < 70; i++) { const t = rnd() * 2 - 1, u = rnd(); g += `<circle cx="${r(x + t * w * 0.8)}" cy="${r(y - h * (0.55 + 0.45 * (1 - t * t)) + u * h * 0.35)}" r="${r(0.18 + rnd() * 0.22)}" fill="#f4ede0" opacity="${r(0.35 + rnd() * 0.45)}"/>`; }
          for (const t of [-0.45, 0, 0.45]) g += `<path d="M${r(x + t * w - 1.6)} ${r(y - h * 0.86)} q1.6 -.9 3.2 0" stroke="#3b200d" stroke-width=".55" fill="none"/>`;
        }
        if (b.schnitte) for (let i = -1; i <= 1; i++) g += `<path d="M${r(x + i * 4 * sk - 2)} ${r(y - h * 0.82)} q2 -1.4 4 0" stroke="#7e4719" stroke-width=".7" fill="none"/>`;
        if (b.dinkel) g += `<path d="M${r(x - w * 0.6)} ${r(y - h * 0.55)} L${r(x + w * 0.6)} ${r(y - h * 0.55)}" stroke="#a2652b" stroke-width=".7"/><path d="M${r(x - w * 0.5)} ${r(y - h * 0.75)} L${r(x + w * 0.5)} ${r(y - h * 0.75)}" stroke="#a2652b" stroke-width=".6"/>`;
        if (b.rund) g += `<circle cx="${r(x)}" cy="${r(y - h * 0.6)}" r="${r(2.6 * sk)}" fill="none" stroke="#7e4719" stroke-width=".6"/>`;
        g += `<path d="M${r(x - w * 0.6)} ${r(y - h * 0.8)} Q${r(x - w * 0.1)} ${r(y - h * 1.02)} ${r(x + w * 0.25)} ${r(y - h * 0.92)}" stroke="#fff" stroke-width=".7" opacity=".25" fill="none"/>`;
      }
    } else if (b.art === "kasten") {
      for (const [dx, dy, sk] of [[-4, -2.5, 0.85], [2, 0, 1]]) {
        const w = 11 * sk, h = 9 * sk, x = fx + dx, y = boden + dy;
        g += `<path d="M${r(x - w)} ${r(y)} L${r(x - w)} ${r(y - h * 0.75)} Q${r(x - w)} ${r(y - h)} ${r(x - w * 0.6)} ${r(y - h)} L${r(x + w * 0.6)} ${r(y - h)} Q${r(x + w)} ${r(y - h)} ${r(x + w)} ${r(y - h * 0.75)} L${r(x + w)} ${r(y)} Z" fill="${b.farbe}"/>`;
        if (b.koerner) for (let i = 0; i < 14; i++) g += `<ellipse cx="${r(x - w * 0.8 + rnd() * w * 1.6)}" cy="${r(y - h * 0.9 + rnd() * 2)}" rx=".7" ry=".4" fill="#e3c98f"/>`;
        if (b.toast) g += `<rect x="${r(x - w)}" y="${r(y - h)}" width="${r(w * 2)}" height="${r(h)}" fill="#fff" opacity=".22" rx="1"/><text x="${r(x)}" y="${r(y - h * 0.35)}" font-size="${r(2.2 * sk)}" text-anchor="middle" fill="#2d6fb3" font-family="Arial">Toast</text>`;
      }
    } else if (b.art === "baguette") {
      for (let i = 0; i < 3; i++) {
        const y = boden - 1.2 - i * 3.4, x = fx - 2 + i * 1.2;
        g += `<rect x="${r(x - 16)}" y="${r(y - 3)}" width="32" height="3.4" rx="1.7" fill="${b.farbe}" transform="rotate(${-6 + i * 3} ${r(x)} ${r(y)})"/>`;
        g += `<path d="M${r(x - 10)} ${r(y - 2.3)} l3 -.6 M${r(x - 3)} ${r(y - 2.3)} l3 -.6 M${r(x + 4)} ${r(y - 2.3)} l3 -.6" stroke="#9a5f2a" stroke-width=".5" transform="rotate(${-6 + i * 3} ${r(x)} ${r(y)})"/>`;
      }
    } else if (b.art === "stange") {
      for (let i = 0; i < 5; i++) {
        const y = boden - 1 - (i % 2) * 3.2 - Math.floor(i / 2) * 1.4, x = fx - 6 + i * 3;
        g += `<rect x="${r(x - 12)}" y="${r(y - 2.4)}" width="24" height="2.6" rx="1.3" fill="${b.farbe}" transform="rotate(${-4 + i * 2} ${r(x)} ${r(y)})"/>`;
        for (let j = -2; j <= 2; j++) g += `<circle cx="${r(x + j * 4)}" cy="${r(y - 1.6)}" r=".35" fill="#fff8ea" transform="rotate(${-4 + i * 2} ${r(x)} ${r(y)})"/>`;
      }
    } else if (b.art === "broetchen") {
      /* ein Weidenkorb voller Brötchen */
      g += `<path d="M${r(fx - 13)} ${r(boden - 5)} L${r(fx + 13)} ${r(boden - 5)} L${r(fx + 11)} ${r(boden)} L${r(fx - 11)} ${r(boden)} Z" fill="${S.lg("korb", [[0, "#d3a35b"], [1, "#9b6b2c"]])}"/>`;
      for (let i = 0; i < 6; i++) g += `<line x1="${r(fx - 12 + i * 4.8)}" y1="${r(boden - 5)}" x2="${r(fx - 10 + i * 4)}" y2="${r(boden)}" stroke="#8a5c22" stroke-width=".35"/>`;
      g += `<line x1="${r(fx - 12)}" y1="${r(boden - 2.5)}" x2="${r(fx + 12)}" y2="${r(boden - 2.5)}" stroke="#8a5c22" stroke-width=".35"/>`;
      const pos = [[-8, -7.5], [-2.6, -8.4], [2.8, -7.8], [8, -7.2], [-5, -10.6], [0.4, -11.2], [5.6, -10.5]];
      pos.forEach(([dx, dy]) => {
        const x = fx + dx, y = boden + dy;
        g += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="3.4" ry="2.5" fill="${b.farbe}"/>`;
        g += `<path d="M${r(x - 1.8)} ${r(y - 0.6)} q1.8 -1 3.6 0" stroke="#7e4719" stroke-width=".5" fill="none"/>`;
        if (b.mohn) for (let i = 0; i < 8; i++) g += `<circle cx="${r(x - 2.4 + rnd() * 4.8)}" cy="${r(y - 1.6 + rnd() * 2)}" r=".25" fill="#1f2230"/>`;
        if (b.sesam) for (let i = 0; i < 7; i++) g += `<ellipse cx="${r(x - 2.4 + rnd() * 4.8)}" cy="${r(y - 1.6 + rnd() * 2)}" rx=".35" ry=".2" fill="#f5e6c2"/>`;
        if (b.koerner) for (let i = 0; i < 6; i++) g += `<ellipse cx="${r(x - 2.4 + rnd() * 4.8)}" cy="${r(y - 1.6 + rnd() * 2)}" rx=".45" ry=".28" fill="#e2c88e"/>`;
        g += `<ellipse cx="${r(x - 1)}" cy="${r(y - 1.3)}" rx="1.3" ry=".5" fill="#fff" opacity=".22"/>`;
      });
    }
    k += g;
    /* Preisschild am Fach */
    const preis = { roggenbrot: "4,20", mischbrot: "3,90", vollkornbrot: "4,50", toastbrot: "2,60", baguette: "1,80", dinkelbrot: "4,80", laugenstange: "0,95", bauernbrot: "4,30", weizenbroetchen: "0,35", koernerbroetchen: "0,65", mohnbroetchen: "0,55", sesambroetchen: "0,55" }[b.id];
    k += `<rect x="${r(fx - 5)}" y="${r(bb - 0.4)}" width="10" height="3.4" rx=".4" fill="#fffdf4" stroke="#b9a37a" stroke-width=".2"/><text x="${r(fx)}" y="${r(bb + 2.2)}" font-size="2.2" text-anchor="middle" fill="#3a2a18" font-family="Arial" font-weight="bold">${preis} €</text>`;
    brotUnter.push({ id: b.id, de: b.de, syl: b.syl, it: b.it, itSyl: b.itSyl, en: b.en, x: cx + fx, y: REGAL.y1 + bb - 5,
      kunst: flaeche(-fw / 2 + 1.2, -(bb - a) + 6, fw - 2.4, bb - a - 2) });
  });
  /* Unterschrank mit Schubladen (Vorrat) — liegt hinter der Theke */
  k += `<rect x="${-W / 2}" y="${-H + 69}" width="${W}" height="${H - 69}" fill="${HOLZ_H}"/>`;
  for (let s = 0; s < 4; s++) k += `<rect x="${r(-W / 2 + 3 + s * fw + 1)}" y="${-H + 72}" width="${r(fw - 2)}" height="10" rx="1" fill="none" stroke="#6d4322" stroke-width=".6"/><rect x="${r(-W / 2 + 3 + s * fw + fw / 2 - 4)}" y="${-H + 76}" width="8" height="1.4" rx=".7" fill="#d8c6a4"/>`;
  S.teil({ id: "brotregal", de: "das Brotregal", syl: "BROT-re-gal", it: "lo scaffale del pane", itSyl: "scaf-FA-le del PA-ne", en: "bread shelf", x: cx, y: REGAL.y1, steht: true, kunst: k,
    zoom: { x: REGAL.x0 - 2, y: REGAL.y0 - 2, w: W + 4, h: 70 },
    unter: brotUnter.map((u) => Object.assign(u, { x: u.x - 0, y: u.y })),
    tipp: "Die Fächer sind schräg: So rutscht das Brot nach vorne." });
}

/* =====================================================================
   9 — DIE VERKÄUFERIN (hinter der Theke, mit Schürze und Haarnetz-Dutt)
   ===================================================================== */
{
  const m = B.mensch({ id: "bk_verk", geschlecht: "w", pose: "servieren", blick: 18, frisur: "dutt", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "weiss" }, schuerze: { stueck: "schuerze", farbe: "creme" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 88);
  /* Sie reicht eine gefüllte Brötchentüte über die Theke */
  const hand = [m.z.handL, m.z.handR].filter(Boolean).sort((a, b) => a.y - b.y)[0];   /* die erhobene Hand */
  const hx = (hand.x != null ? hand.x : hand[0]) * m.k, hy = (hand.y != null ? hand.y : hand[1]) * m.k;
  let tuete = `<g transform="translate(${r(hx + 0.6)} ${r(hy - 9.4)})"><path d="M-3.2 -1 L3.2 -1 L3.6 9 L-3.6 9 Z" fill="#d8ad78" stroke="#a87c48" stroke-width=".25"/><path d="M-3.2 -1 L-2 -2.6 L2 -2.6 L3.2 -1 Z" fill="#c99b62"/><ellipse cx="-.6" cy="-1.6" rx="2" ry=".9" fill="${HELL}"/><text x="0" y="5.4" font-size="1.7" text-anchor="middle" fill="#5a3a1f" font-family="Georgia" font-style="italic">Meier</text></g>`;
  S.teil({ id: "verkaeuferin", de: "die Verkäuferin", syl: "ver-KÄU-fe-rin", it: "la commessa", itSyl: "com-MES-sa", en: "shop assistant", x: 214, y: 176, kunst: m.svg + tuete,
    tipp: "Die Verkäuferin fragt: „Was darf es sein?“" });
}

/* =====================================================================
   10 — DIE THEKE (Verkaufstheke) und 11 — DIE VITRINE (gekühlt, links)
   ===================================================================== */
const THEKE = { y0: 128, y1: 180, x0: 8, x1: 312 };
const VIT = { x0: 40, x1: 158, y0: 92, y1: 128 };
{
  let k = "";
  const W = THEKE.x1 - THEKE.x0;
  /* Arbeitsplatte (von leicht oben gesehen) */
  k += `<path d="M${-W / 2 - 2} -${THEKE.y1 - THEKE.y0} L${W / 2 + 2} -${THEKE.y1 - THEKE.y0} L${W / 2} -${THEKE.y1 - THEKE.y0 - 4} L${-W / 2} -${THEKE.y1 - THEKE.y0 - 4} Z" fill="${S.lg("platte", [[0, "#e9e2d6"], [1, "#c9bfae"]])}"/>`;
  /* Front: Holzlamellen mit Sockelleiste */
  k += `<rect x="${-W / 2}" y="-${THEKE.y1 - THEKE.y0 - 4}" width="${W}" height="${THEKE.y1 - THEKE.y0 - 4}" fill="${HOLZ_V}"/>`;
  for (let x = -W / 2 + 3; x < W / 2; x += 3.2) k += `<rect x="${r(x)}" y="-${THEKE.y1 - THEKE.y0 - 5}" width=".7" height="${THEKE.y1 - THEKE.y0 - 9}" fill="#6f4423" opacity=".55"/>`;
  k += `<rect x="${-W / 2}" y="-5" width="${W}" height="5" fill="#3a2414"/>`;
  k += `<rect x="${-W / 2}" y="-${THEKE.y1 - THEKE.y0 - 4}" width="${W}" height="1.4" fill="#fff" opacity=".18"/>`;
  /* links unter der Vitrine: Kühlsockel mit Lüftungsgitter, davor die Tablettschiene */
  const vl = VIT.x0 - (THEKE.x0 + THEKE.x1) / 2, vr = VIT.x1 - (THEKE.x0 + THEKE.x1) / 2, hT = THEKE.y1 - THEKE.y0;
  k += `<rect x="${r(vl)}" y="${-hT + 4}" width="${r(vr - vl)}" height="${hT - 9}" fill="${S.lg("kuehlsockel", [[0, "#c3c9ce"], [0.5, "#aab2b9"], [1, "#8d969e"]])}"/>`;
  for (let x = vl + 4; x < vr - 3; x += 2.2) k += `<rect x="${r(x)}" y="-14" width="1.1" height="7" rx=".4" fill="#6f7a83"/>`;
  k += `<rect x="${r(vl)}" y="${-hT + 9}" width="${r(vr - vl)}" height="3.2" rx="1" fill="${STAHL}"/><rect x="${r(vl)}" y="${-hT + 12}" width="${r(vr - vl)}" height=".8" fill="#7d868d"/>`;
  for (const x of [vl + 8, (vl + vr) / 2, vr - 8]) k += `<rect x="${r(x - 0.8)}" y="${-hT + 12.4}" width="1.6" height="4" fill="#9aa3aa"/>`;
  /* rechts: Logo-Platte mit Ähren */
  const lx = (VIT.x1 + THEKE.x1) / 2 - (THEKE.x0 + THEKE.x1) / 2 + 10;
  k += `<rect x="${r(lx - 30)}" y="${-hT + 14}" width="60" height="20" rx="2" fill="#3f2410" opacity=".9"/><rect x="${r(lx - 28.6)}" y="${-hT + 15.4}" width="57.2" height="17.2" rx="1.4" fill="none" stroke="#d8b46a" stroke-width=".4"/>`;
  k += `<text x="${r(lx)}" y="${-hT + 25.6}" font-size="5.6" text-anchor="middle" fill="#f1d79a" font-family="Georgia,serif" font-weight="bold">Meier</text><text x="${r(lx)}" y="${-hT + 30}" font-size="2.2" text-anchor="middle" fill="#d8b46a" font-family="Georgia,serif" letter-spacing=".4">BROT · KUCHEN · KAFFEE</text>`;
  for (const sx of [-1, 1]) {
    const ax = lx + sx * 22;
    k += `<path d="M${r(ax)} ${-hT + 31} q${sx * -1} -6 0 -12" stroke="#d8b46a" stroke-width=".5" fill="none"/>`;
    for (let i = 0; i < 4; i++) k += `<ellipse cx="${r(ax + sx * -0.4 + (i % 2 ? 1 : -1) * 0.9)}" cy="${r(-hT + 21 + i * 2.2)}" rx=".7" ry="1.3" fill="#d8b46a" transform="rotate(${(i % 2 ? 25 : -25)} ${r(ax)} ${r(-hT + 21 + i * 2.2)})"/>`;
  }
  /* Lichtband unter der Platte */
  k += `<rect x="${-W / 2}" y="-${THEKE.y1 - THEKE.y0 - 4}" width="${W}" height="3" fill="${S.lg("lichtband", [[0, "#ffe9b0", 0.45], [1, "#ffe9b0", 0]])}"/>`;
  S.teil({ id: "theke", de: "die Theke", syl: "THE-ke", it: "il bancone", itSyl: "ban-CO-ne", en: "counter", x: (THEKE.x0 + THEKE.x1) / 2, y: THEKE.y1, steht: true, kunst: k });
}

/* Die Vitrine: Korpus + Kühlboden + zwei Glasböden; Kuchen sind unter-Teile */
const vitrineUnter = [];
{
  const W = VIT.x1 - VIT.x0, H = VIT.y1 - VIT.y0, cx = (VIT.x0 + VIT.x1) / 2;
  let k = "";
  /* Rückwand innen, beleuchtet */
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${S.lg("vitinnen", [[0, "#fdf8ec"], [1, "#e9dcc2"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="2.2" fill="#fffbe9"/>`;
  /* Böden: oben Glas, unten gekühlter Edelstahlboden */
  const boeden = [-H + 18, -1.2];
  k += `<rect x="${-W / 2 + 1}" y="${boeden[0]}" width="${W - 2}" height="1.4" fill="#cfe4ea" opacity=".85"/>`;
  k += `<rect x="${-W / 2}" y="${boeden[1] - 1}" width="${W}" height="3" fill="${STAHL}"/>`;
  /* Rahmen (Edelstahl) */
  k += `<rect x="${-W / 2 - 1.2}" y="${-H - 1}" width="2.4" height="${H + 3}" fill="${STAHL}"/><rect x="${W / 2 - 1.2}" y="${-H - 1}" width="2.4" height="${H + 3}" fill="${STAHL}"/>`;
  k += `<rect x="${-W / 2 - 1.2}" y="${-H - 1.6}" width="${W + 2.4}" height="2" fill="${STAHL}"/>`;

  const stueck = (x, boden, art) => {
    let g = "";
    const y = boden;
    if (art === "torte") {
      /* Schwarzwälder Kirschtorte auf Tortenplatte: Sahnemantel, Schokoraspel
         am Rand, oben Sahnetuffs mit Kirschen. Vorne liegt ein Stück mit den
         Schichten (Biskuit, Sahne, Kirschen). */
      g += `<ellipse cx="${x - 2}" cy="${y}" rx="11.5" ry="1.8" fill="#e9e3d7" stroke="#cfc6b3" stroke-width=".25"/>`;
      g += `<path d="M${x - 12} ${y - 0.6} L${x - 12} ${y - 9} A10 2.2 0 0 1 ${x + 8} ${y - 9} L${x + 8} ${y - 0.6} A10 2.2 0 0 1 ${x - 12} ${y - 0.6} Z" fill="${S.lg("sahne", [[0, "#fbf8f1"], [0.6, "#f3eee3"], [1, "#ddd5c4"]], 0, 0, 1, 0)}"/>`;
      g += `<ellipse cx="${x - 2}" cy="${y - 9}" rx="10" ry="2.2" fill="#fffdf8"/>`;
      /* Schokoraspel als Band unten am Rand */
      for (let i = 0; i < 40; i++) g += `<rect x="${r(x - 11.6 + rnd() * 19.2)}" y="${r(y - 4.2 + rnd() * 3.4)}" width=".9" height=".35" rx=".15" fill="${rnd() < 0.5 ? "#5a321a" : "#7a4a2a"}" transform="rotate(${Math.round(-30 + rnd() * 60)} ${r(x)} ${r(y - 2)})"/>`;
      for (let i = 0; i < 6; i++) {
        const tx = x - 9.5 + i * 3.4, ty = y - 9.4 + Math.sin(i / 5 * Math.PI) * -0.6;
        g += `<path d="M${r(tx - 1.3)} ${r(ty + 0.4)} q1.3 -2.6 2.6 0 Z" fill="#fffaf0" stroke="#e3dccd" stroke-width=".2"/><circle cx="${r(tx)}" cy="${r(ty - 1.8)}" r=".85" fill="#7d0c1f"/><circle cx="${r(tx - 0.3)}" cy="${r(ty - 2.1)}" r=".25" fill="#fff" opacity=".7"/>`;
      }
      g += `<path d="M${x - 11} ${y - 8.6} A10 2 0 0 0 ${x + 7} ${y - 8.6}" stroke="#d9cfbc" stroke-width=".3" fill="none"/>`;
      /* das Stück davor, auf der Seite liegend: Schichten sichtbar */
      const sx = x + 9, sy = y;
      g += `<path d="M${sx - 4} ${sy} L${sx + 4} ${sy} L${sx + 4} ${sy - 6.4} L${sx - 4} ${sy - 6.4} Z" fill="#4a2a17"/>`;
      g += `<rect x="${sx - 4}" y="${sy - 4.8}" width="8" height="1.1" fill="#fbf7ef"/><rect x="${sx - 4}" y="${sy - 2.6}" width="8" height="1.1" fill="#fbf7ef"/>`;
      g += `<rect x="${sx - 4}" y="${sy - 4.3}" width="8" height=".45" fill="#9b1b30"/><rect x="${sx - 4}" y="${sy - 2.1}" width="8" height=".45" fill="#9b1b30"/>`;
      g += `<rect x="${sx - 4}" y="${sy - 7.6}" width="8" height="1.3" rx=".4" fill="#fbf7ef"/><circle cx="${sx}" cy="${sy - 8.4}" r=".8" fill="#7d0c1f"/>`;
    } else if (art === "kaese") {
      /* Käsekuchen am Stück */
      g += `<path d="M${x - 11} ${y} L${x - 11} ${y - 8} Q${x} ${y - 9.6} ${x + 11} ${y - 8} L${x + 11} ${y} Z" fill="${S.lg("kaesek", [[0, "#f0d48e"], [1, "#e2bd6a"]])}"/>`;
      g += `<path d="M${x - 11} ${y - 8} Q${x} ${y - 9.6} ${x + 11} ${y - 8} Q${x} ${y - 6.8} ${x - 11} ${y - 8} Z" fill="#b8722d"/>`;
      g += `<rect x="${x - 11}" y="${y - 1.6}" width="22" height="1.6" fill="#c98c45"/>`;
      g += `<line x1="${x - 3}" y1="${y - 8.6}" x2="${x - 3}" y2="${y}" stroke="#d1a65a" stroke-width=".4"/><line x1="${x + 4}" y1="${y - 8.6}" x2="${x + 4}" y2="${y}" stroke="#d1a65a" stroke-width=".4"/>`;
    } else if (art === "bienenstich") {
      g += `<rect x="${x - 11}" y="${y - 3}" width="22" height="3" fill="#e8b766"/>`;
      g += `<rect x="${x - 11}" y="${y - 6.6}" width="22" height="3.6" fill="#fbf2d8"/>`;
      g += `<rect x="${x - 11}" y="${y - 9.4}" width="22" height="2.8" fill="#e5a85a"/>`;
      g += `<rect x="${x - 11}" y="${y - 10.6}" width="22" height="1.4" fill="${S.lg("karamell", [[0, "#c87d2e"], [1, "#a8601d"]])}"/>`;
      for (let i = 0; i < 16; i++) g += `<ellipse cx="${r(x - 10 + rnd() * 20)}" cy="${r(y - 10.4 + rnd())}" rx=".9" ry=".35" fill="#f2d8a2"/>`;
      for (let i = 1; i < 4; i++) g += `<line x1="${r(x - 11 + i * 5.5)}" y1="${y - 10.6}" x2="${r(x - 11 + i * 5.5)}" y2="${y}" stroke="#c48b45" stroke-width=".35"/>`;
    } else if (art === "streusel") {
      g += `<rect x="${x - 11}" y="${y - 4}" width="22" height="4" fill="#e2b26c"/>`;
      for (let i = 0; i < 26; i++) g += `<circle cx="${r(x - 10.5 + rnd() * 21)}" cy="${r(y - 4.4 - rnd() * 1.4)}" r="${r(0.6 + rnd() * 0.6)}" fill="${rnd() < 0.5 ? "#e8bf7d" : "#c98b44"}"/>`;
      g += `<path d="M${x - 11} ${y - 4.6} q11 -2 22 0" stroke="#fffbe9" stroke-width=".6" opacity=".7" fill="none"/>`;
      for (let i = 1; i < 4; i++) g += `<line x1="${r(x - 11 + i * 5.5)}" y1="${y - 5.4}" x2="${r(x - 11 + i * 5.5)}" y2="${y}" stroke="#b77d3d" stroke-width=".35"/>`;
    } else if (art === "berliner") {
      for (const [dx, dy] of [[-6, 0], [0, 0], [6, 0], [-3, -3.6], [3, -3.6]]) {
        g += `<ellipse cx="${x + dx}" cy="${y + dy - 2.6}" rx="3.4" ry="2.6" fill="${HELL}"/>`;
        g += `<path d="M${x + dx - 3.3} ${y + dy - 2.5} q3.3 1.4 6.6 0" stroke="#f6ead0" stroke-width=".9" fill="none"/>`;
        for (let i = 0; i < 6; i++) g += `<circle cx="${r(x + dx - 2.2 + rnd() * 4.4)}" cy="${r(y + dy - 4.2 + rnd() * 1.4)}" r=".28" fill="#fff"/>`;
        g += `<circle cx="${x + dx + 2.6}" cy="${y + dy - 2.8}" r=".55" fill="#b5162b"/>`;
      }
    } else if (art === "croissant") {
      for (const [dx, dy, sp] of [[-5.5, 0, 1], [5.5, 0, -1], [0, -3.2, 1]]) {
        const cx2 = x + dx, cy2 = y + dy - 2;
        /* Sichel: dicke Mitte, spitze Enden, nach unten gebogen */
        g += `<path d="M${r(cx2 - 6.4)} ${r(cy2 + 1.6)} Q${r(cx2 - 4)} ${r(cy2 - 3.8)} ${r(cx2)} ${r(cy2 - 3.9)} Q${r(cx2 + 4)} ${r(cy2 - 3.8)} ${r(cx2 + 6.4)} ${r(cy2 + 1.6)} Q${r(cx2 + 3.4)} ${r(cy2 + 0.2)} ${r(cx2)} ${r(cy2 + 0.4)} Q${r(cx2 - 3.4)} ${r(cy2 + 0.2)} ${r(cx2 - 6.4)} ${r(cy2 + 1.6)} Z" fill="${HELL}"/>`;
        /* Wicklungen: schräge Bögen, Mitte am dicksten */
        for (const t of [-4.2, -2.4, -0.6, 1.2, 3]) {
          const h = 3.6 - Math.abs(t) * 0.45;
          g += `<path d="M${r(cx2 + t)} ${r(cy2 - h + 0.2)} q${r(0.9 * sp)} ${r(h * 0.5)} ${r(0.2 * sp)} ${r(h)}" stroke="#a8672a" stroke-width=".5" fill="none" opacity=".85"/>`;
        }
        g += `<path d="M${r(cx2 - 3)} ${r(cy2 - 3.1)} Q${r(cx2)} ${r(cy2 - 4)} ${r(cx2 + 2.6)} ${r(cy2 - 3.2)}" stroke="#fff3d6" stroke-width=".6" opacity=".6" fill="none"/>`;
      }
    } else if (art === "belegt") {
      for (const [dx, dy] of [[-6, 0], [6, 0], [0, -3]]) {
        const cx2 = x + dx, cy2 = y + dy;
        g += `<ellipse cx="${cx2}" cy="${cy2 - 1.4}" rx="5" ry="1.6" fill="${HELL}"/>`;
        g += `<path d="M${cx2 - 5.4} ${cy2 - 2.4} q5.4 -1.2 10.8 0" stroke="#72b043" stroke-width="1.2" fill="none"/>`;
        g += `<rect x="${cx2 - 4.6}" y="${cy2 - 3.6}" width="9.2" height="1.2" rx=".5" fill="#f0c94a"/>`;
        g += `<rect x="${cx2 - 4.4}" y="${cy2 - 4.8}" width="8.8" height="1.2" rx=".5" fill="#e9a3a0"/>`;
        g += `<ellipse cx="${cx2}" cy="${cy2 - 6.2}" rx="5" ry="2.2" fill="${HELL}"/>`;
        for (let i = 0; i < 5; i++) g += `<ellipse cx="${r(cx2 - 3 + rnd() * 6)}" cy="${r(cy2 - 7 + rnd() * 1.4)}" rx=".4" ry=".22" fill="#f5e6c2"/>`;
      }
    }
    return g;
  };
  /* oben (Glasboden): Torte, Käsekuchen, Bienenstich, Streuselkuchen */
  const oben = [["torte", "die Torte", "TOR-te", "la torta", "TOR-ta", "cake", "Schwarzwälder Kirschtorte — mit Sahne, Kirschen und Schokolade.", "3,90"],
    ["kaesekuchen", "der Käsekuchen", "KÄ-se-ku-chen", "la cheesecake", "CHEE-se-cake", "cheesecake", null, "2,60"],
    ["bienenstich", "der Bienenstich", "BIE-nen-stich", "il Bienenstich (torta con mandorle)", "BI-nen-stich", "bee sting cake", "Hefekuchen mit Pudding und Mandel-Karamell.", "2,40"],
    ["streuselkuchen", "der Streuselkuchen", "STREU-sel-ku-chen", "la torta crumble", "TOR-ta CRUM-ble", "crumb cake", null, "2,10"]];
  const unten = [["berliner", "der Berliner", "ber-LI-ner", "il bombolone", "bom-bo-LO-ne", "doughnut", "In Berlin heißt er „Pfannkuchen“, in Bayern „Krapfen“.", "1,30"],
    ["croissant", "das Croissant", "crois-SANT", "il cornetto", "cor-NET-to", "croissant", null, "1,40"],
    ["belegtes_broetchen", "das belegte Brötchen", "be-LEG-te BRÖT-chen", "il panino imbottito", "pa-NI-no im-bot-TI-to", "sandwich roll", "Mit Käse, Schinken und Salat.", "3,20"]];
  const reihe = (liste, boden, abstand, startX) => {
    liste.forEach(([id, de, syl, it, itSyl, en, tipp, preis], i) => {
      const x = startX + i * abstand, art = { torte: "torte", kaesekuchen: "kaese", bienenstich: "bienenstich", streuselkuchen: "streusel", berliner: "berliner", croissant: "croissant", belegtes_broetchen: "belegt" }[id];
      k += `<g>${stueck(x, boden, art)}</g>`;
      /* Preisschild an einem Spieß */
      k += `<rect x="${x - 3.5}" y="${boden + 0.9}" width="7" height="3" rx=".3" fill="#fff" stroke="#9e8a62" stroke-width=".2"/><text x="${x}" y="${boden + 3}" font-size="1.8" text-anchor="middle" fill="#2b1d0e" font-family="Arial" font-weight="bold">${preis} €</text>`;
      vitrineUnter.push({ id, de, syl, it, itSyl, en, tipp, x: cx + x, y: VIT.y1 + boden, kunst: flaeche(-12, -14, 24, 15) });
    });
  };
  reihe(oben, boeden[0], 28.5, -W / 2 + 15);
  reihe(unten, boeden[1] - 0.5, 36, -W / 2 + 20);
  /* Glasfront (gebogen) — als Umriss; die Spiegelung liegt in „vorne“ */
  k += `<path d="M${-W / 2} ${-H - 1} Q${-W / 2 + 6} ${-H - 9} ${-W / 2 + 18} ${-H - 9} L${W / 2 - 18} ${-H - 9} Q${W / 2 - 6} ${-H - 9} ${W / 2} ${-H - 1}" fill="none" stroke="#c7d4d9" stroke-width=".8"/>`;
  k += `<path d="M${-W / 2} ${-H - 1} Q${-W / 2 + 6} ${-H - 9} ${-W / 2 + 18} ${-H - 9} L${W / 2 - 18} ${-H - 9} Q${W / 2 - 6} ${-H - 9} ${W / 2} ${-H - 1} Z" fill="#e8f3f6" opacity=".25"/>`;
  S.teil({ id: "vitrine", de: "die Vitrine", syl: "vi-TRI-ne", it: "la vetrina", itSyl: "ve-TRI-na", en: "display case", x: cx, y: VIT.y1, kunst: k,
    zoom: { x: VIT.x0 - 2, y: VIT.y0 - 12, w: W + 4, h: H + 14 },
    unter: vitrineUnter,
    tipp: "In der gekühlten Vitrine liegen Kuchen, Torten und belegte Brötchen." });
  /* Glas vor den Kuchen: Spiegelstreifen (fangen keinen Tipp ab) */
  S.davor(`<g opacity=".9">
    <path d="M${VIT.x0 + 8} ${VIT.y1 - 2} L${VIT.x0 + 22} ${VIT.y0 - 6} L${VIT.x0 + 30} ${VIT.y0 - 6} L${VIT.x0 + 16} ${VIT.y1 - 2} Z" fill="#fff" opacity=".16"/>
    <path d="M${VIT.x0 + 70} ${VIT.y1 - 2} L${VIT.x0 + 80} ${VIT.y0 - 6} L${VIT.x0 + 84} ${VIT.y0 - 6} L${VIT.x0 + 74} ${VIT.y1 - 2} Z" fill="#fff" opacity=".12"/>
    <rect x="${VIT.x0}" y="${VIT.y0 - 8}" width="${VIT.x1 - VIT.x0}" height="${VIT.y1 - VIT.y0 + 8}" fill="${GLAS}"/>
  </g>`);
}

/* =====================================================================
   12 — AUF DER THEKE rechts: Brötchenkorb, Brezelständer, Zange, Tüten,
        Kasse, Kartenlesegerät, Kassenbon, Trinkgeldglas
   ===================================================================== */
const PLATTE = THEKE.y0 + 1; // Standhöhe auf der Thekenplatte
{
  /* DIE BREZEL — am Brezelständer */
  let k = schatten(0, 0.3, 8, 1, 0.3);
  k += `<ellipse cx="0" cy="-.6" rx="6" ry="1.4" fill="#6d4322"/><rect x="-.7" y="-31" width="1.4" height="31" fill="${STAHL}"/>`;
  k += `<rect x="-9" y="-29" width="18" height="1" rx=".5" fill="${STAHL}"/><rect x="-9" y="-16" width="18" height="1" rx=".5" fill="${STAHL}"/>`;
  const brezel = (x, y, s) => {
    const p = (dx, dy) => `${r(x + dx * s)} ${r(y + dy * s)}`;
    let g = `<path d="M${p(-5, 4)} C${p(-8, 1)} ${p(-6, -5)} ${p(-1, -4.6)} C${p(3, -4.2)} ${p(4, 0)} ${p(1.2, 2.6)} M${p(5, 4)} C${p(8, 1)} ${p(6, -5)} ${p(1, -4.6)} C${p(-3, -4.2)} ${p(-4, 0)} ${p(-1.2, 2.6)}" stroke="${LAUGE}" stroke-width="${r(2.2 * s)}" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M${p(-5, 4)} C${p(-8, 1)} ${p(-6, -5)} ${p(-1, -4.6)} C${p(3, -4.2)} ${p(4, 0)} ${p(1.2, 2.6)} M${p(5, 4)} C${p(8, 1)} ${p(6, -5)} ${p(1, -4.6)} C${p(-3, -4.2)} ${p(-4, 0)} ${p(-1.2, 2.6)}" stroke="#c0773a" stroke-width="${r(0.6 * s)}" opacity=".6" fill="none" stroke-linecap="round" transform="translate(-.3 -.4)"/>`;
    for (let i = 0; i < 6; i++) g += `<circle cx="${r(x + (-5 + rnd() * 10) * s)}" cy="${r(y + (-4 + rnd() * 6) * s)}" r="${r(0.32 * s)}" fill="#fffaf0"/>`;
    return g;
  };
  for (const [x, y] of [[-6, -24], [6, -24], [-6, -11], [6, -11]]) k += `<line x1="${x}" y1="${y - 5}" x2="${x}" y2="${y - 3.4}" stroke="#9aa3aa" stroke-width=".4"/>` + brezel(x, y, 1);
  S.teil({ oben: true, id: "brezel", de: "die Brezel", syl: "BRE-zel", it: "il pretzel", itSyl: "PRET-zel", en: "pretzel", x: 172, y: PLATTE, steht: true, kunst: k,
    tipp: "Die Brezel ist ein Laugengebäck — außen braun und glänzend, mit grobem Salz." });
}
{
  /* DAS BRÖTCHEN — Korb mit Kaiserbrötchen auf der Theke */
  let k = schatten(0, 0.3, 13, 1.2, 0.3);
  k += `<path d="M-13 -6 L13 -6 L11 0 L-11 0 Z" fill="${S.lg("korb2", [[0, "#d3a35b"], [1, "#9b6b2c"]])}"/>`;
  for (let i = 0; i < 7; i++) k += `<line x1="${-12 + i * 4}" y1="-6" x2="${-10.5 + i * 3.5}" y2="0" stroke="#8a5c22" stroke-width=".35"/>`;
  k += `<path d="M-13 -6 L13 -6" stroke="#c99550" stroke-width="1.2"/>`;
  for (const [dx, dy] of [[-8, -7.6], [-2.6, -8.2], [3, -7.8], [8.2, -7.4], [-5, -10.8], [0.6, -11.3], [5.8, -10.6]]) {
    k += `<ellipse cx="${dx}" cy="${dy}" rx="3.5" ry="2.6" fill="${HELL}"/>`;
    /* Kaiserbrötchen: fünf gebogene Kerben */
    for (let a = 0; a < 5; a++) {
      const w = a * 72 * Math.PI / 180;
      k += `<path d="M${r(dx)} ${r(dy - 0.2)} q${r(Math.cos(w) * 1.6)} ${r(Math.sin(w) * 0.9)} ${r(Math.cos(w + 0.5) * 2.6)} ${r(Math.sin(w + 0.5) * 1.6)}" stroke="#a8672a" stroke-width=".4" fill="none"/>`;
    }
    k += `<ellipse cx="${dx - 1}" cy="${dy - 1.2}" rx="1.2" ry=".5" fill="#fff" opacity=".25"/>`;
  }
  S.teil({ id: "broetchen", de: "das Brötchen", syl: "BRÖT-chen", it: "il panino", itSyl: "pa-NI-no", en: "bread roll", x: 194, y: PLATTE, steht: true, kunst: k,
    tipp: "In Norddeutschland sagt man „Brötchen“, in Bayern „Semmel“, in Schwaben „Weckle“." });
}
{
  /* DIE ZANGE — Gebäckzange auf einer Ablage */
  let k = `<rect x="-6" y="-1.2" width="12" height="1.2" rx=".4" fill="#c9cfd4"/>`;
  k += `<path d="M-5 -1.8 L5 -2.8 L5.6 -2.2 L-4.6 -1 Z" fill="${STAHL}"/><path d="M-5 -1.8 L5 -1.4 L5.6 -0.8 L-4.6 -1.1 Z" fill="#aeb6bd"/>`;
  k += `<path d="M5 -2.8 q1.4 -.2 1.6 .8" stroke="#8f979e" stroke-width=".5" fill="none"/>`;
  S.teil({ oben: true, id: "zange", de: "die Zange", syl: "ZAN-ge", it: "la pinza", itSyl: "PIN-za", en: "tongs", x: 246, y: PLATTE, steht: true, kunst: k + flaeche(-6.5, -4.5, 13, 5) });
}
{
  /* DIE TÜTE — Stapel brauner Papiertüten im Spender */
  let k = schatten(0, 0.2, 7, .9, .25);
  k += `<rect x="-6" y="-10" width="12" height="10" rx=".6" fill="${STAHL}"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${-5 + i * .3} ${-9.2 - i * .9} L${4.5 + i * .3} ${-9.2 - i * .9} L${4.2 + i * .3} ${-12.6 - i * .9} L${-4.7 + i * .3} ${-12.6 - i * .9} Z" fill="${i % 2 ? "#cfa06a" : "#d8ad78"}" stroke="#a87c48" stroke-width=".2"/>`;
  k += `<text x="0" y="-4" font-size="2" text-anchor="middle" fill="#5a3a1f" font-family="Georgia" font-style="italic">Meier</text>`;
  S.teil({ oben: true, id: "tuete", de: "die Tüte", syl: "TÜ-te", it: "il sacchetto", itSyl: "sac-CHET-to", en: "paper bag", x: 232, y: PLATTE, steht: true, kunst: k });
}
{
  /* DIE KASSE — Touch-Kasse mit Kundendisplay */
  let k = schatten(0, 0.3, 14, 1.3, .3);
  k += `<rect x="-11" y="-3" width="22" height="3" rx=".6" fill="#2b2f33"/>`;
  k += `<rect x="-1.4" y="-6" width="2.8" height="3" fill="#3a3f44"/>`;
  k += `<path d="M-12 -19 L12 -19 L13 -6 L-13 -6 Z" fill="#1d2125"/>`;
  k += `<path d="M-10.8 -17.8 L10.8 -17.8 L11.6 -7.2 L-11.6 -7.2 Z" fill="${S.lg("kassebild", [[0, "#2c4e6b"], [1, "#1b3247"]])}"/>`;
  /* Kacheln auf dem Bildschirm: Brot, Brötchen, Kuchen, Kaffee */
  const kach = [["#d39a52", "Brot"], ["#e5b066", "Brötchen"], ["#a3473a", "Kuchen"], ["#5c3b26", "Kaffee"]];
  kach.forEach(([f, t], i) => {
    const x = -10 + (i % 2) * 10.4, y = -17 + Math.floor(i / 2) * 4.8;
    k += `<rect x="${x}" y="${y}" width="9.8" height="4.2" rx=".5" fill="${f}"/><text x="${x + 4.9}" y="${y + 2.8}" font-size="1.8" text-anchor="middle" fill="#fff" font-family="Arial">${t}</text>`;
  });
  k += `<text x="0" y="-7.8" font-size="1.7" text-anchor="end" fill="#9fe39a" font-family="Arial" dx="10">Summe 4,85 €</text>`;
  /* Kundendisplay hinten */
  k += `<rect x="6" y="-23.6" width="9" height="4.4" rx=".4" fill="#111"/><text x="10.5" y="-20.5" font-size="2.2" text-anchor="middle" fill="#7cff8a" font-family="monospace">4,85</text><rect x="9.8" y="-19.2" width="1.4" height=".4" fill="#333"/>`;
  k += `<path d="M-11 -18 L-4 -18 L-11 -9 Z" fill="#fff" opacity=".1"/>`;
  S.teil({ id: "kasse", de: "die Kasse", syl: "KAS-se", it: "la cassa", itSyl: "CAS-sa", en: "cash register", x: 268, y: PLATTE, steht: true, kunst: k });
}
{
  /* DAS KARTENLESEGERÄT — mit Karte, kontaktlos */
  let k = schatten(0, .2, 4, .7, .3);
  k += `<path d="M-3.2 0 L3.2 0 L3.6 -11 Q3.6 -12 2.6 -12 L-2.6 -12 Q-3.6 -12 -3.6 -11 Z" fill="#2a2e33"/>`;
  k += `<rect x="-2.6" y="-11" width="5.2" height="3.6" rx=".3" fill="#9cd3e8"/><text x="0" y="-8.6" font-size="1.4" text-anchor="middle" fill="#0b3b52" font-family="Arial">4,85 €</text>`;
  for (let i = 0; i < 12; i++) k += `<rect x="${-2.4 + (i % 3) * 1.8}" y="${-6.6 + Math.floor(i / 3) * 1.4}" width="1.3" height="1" rx=".2" fill="${i === 9 ? "#d23b30" : i === 11 ? "#3ca35a" : "#596068"}"/>`;
  k += `<path d="M1.6 -13.6 q1 -1 0 -2 M2.6 -13 q1.8 -1.6 0 -3.2" stroke="#4aa8d8" stroke-width=".35" fill="none"/>`;
  S.teil({ oben: true, id: "kartenlesegeraet", de: "das Kartenlesegerät", syl: "KAR-ten-le-se-ge-rät", it: "il lettore di carte", itSyl: "let-TO-re di CAR-te", en: "card reader", x: 288, y: PLATTE, steht: true, kunst: k + flaeche(-4, -16.5, 8, 16.5),
    tipp: "Mit dem Kartenlesegerät bezahlt man mit Karte oder Handy." });
}
{
  /* DER KASSENBON */
  let k = `<path d="M-3 0 L3 0 L3.2 -1 L-2.8 -1.2 Z" fill="#fbfbf8"/><path d="M-2.4 -.6 L2.4 -.5" stroke="#9a9a9a" stroke-width=".18"/>`;
  k += `<path d="M-3.4 -1.2 Q-2 -4 0 -4.2 L2.2 -1.1 Z" fill="#f6f6f2" stroke="#d6d6d0" stroke-width=".15"/><path d="M-1.8 -2.6 L.6 -3.4 M-1.4 -2 L1 -2.8" stroke="#8a8a8a" stroke-width=".15"/>`;
  S.teil({ oben: true, id: "kassenbon", de: "der Kassenbon", syl: "KAS-sen-bon", it: "lo scontrino", itSyl: "scon-TRI-no", en: "receipt", x: 254, y: PLATTE, steht: true, kunst: k + flaeche(-4, -5, 8, 5.4) });
}
{
  /* DAS TRINKGELD — Glas mit Münzen */
  let k = schatten(0, .2, 4, .7, .25);
  k += `<path d="M-3.4 -9 L3.4 -9 L3 0 L-3 0 Z" fill="#e6f2f5" opacity=".55" stroke="#b9cbd1" stroke-width=".3"/>`;
  for (let i = 0; i < 9; i++) k += `<ellipse cx="${r(-2 + rnd() * 4)}" cy="${r(-1 - i * 0.55)}" rx="1.2" ry=".45" fill="${i % 3 === 0 ? "#c9a227" : i % 3 === 1 ? "#b87333" : "#c7c9cc"}"/>`;
  k += `<rect x="-3.2" y="-6.4" width="6.4" height="2.4" fill="#fff8e1"/><text x="0" y="-4.6" font-size="1.5" text-anchor="middle" fill="#7a4f1c" font-family="Arial">Danke!</text>`;
  k += `<path d="M-2.8 -8.6 L-2.4 -.6" stroke="#fff" stroke-width=".5" opacity=".6"/>`;
  S.teil({ oben: true, id: "trinkgeld", de: "das Trinkgeld", syl: "TRINK-geld", it: "la mancia", itSyl: "MAN-cia", en: "tip", x: 302, y: PLATTE, steht: true, kunst: k });
}

{
  /* DAS TABLETT — Stapel am linken Thekenende (für Kaffee und Kuchen am Platz) */
  let k = schatten(0, .3, 11, 1, .25);
  for (let i = 0; i < 5; i++) k += `<path d="M${-10 + i * .2} ${-i * 1.3} L${10 + i * .2} ${-i * 1.3} L${9.4 + i * .2} ${-i * 1.3 - 1.1} L${-9.4 + i * .2} ${-i * 1.3 - 1.1} Z" fill="${i % 2 ? "#5c3d24" : "#6b482b"}" stroke="#3d2716" stroke-width=".2"/>`;
  k += `<path d="M-9 -7.4 L9.6 -7.4" stroke="#8a6440" stroke-width=".4"/>`;
  S.teil({ id: "tablett", de: "das Tablett", syl: "tab-LETT", it: "il vassoio", itSyl: "vas-SO-io", en: "tray", x: 24, y: PLATTE, steht: true, kunst: k + flaeche(-11, -9, 22, 9.5) });
}
{
  /* DIE KUNDIN — vorne links, schaut in die Vitrine */
  const m = B.mensch({ id: "bk_kundin", geschlecht: "w", pose: "stehen", blick: 104, frisur: "zopf", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "rot" }, unterteil: { stueck: "hose", farbe: "grau" }, jacke: { stueck: "jacke", farbe: "gruen_d" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, 100);
  S.teil({ id: "kundin", de: "die Kundin", syl: "KUN-din", it: "la cliente", itSyl: "cli-EN-te", en: "customer", x: 14, y: 198, kunst: m.svg,
    tipp: "Die Kundin sagt: „Ich hätte gern sechs Brötchen, bitte.“" });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/baeckerei.js"));
console.log(aus);
