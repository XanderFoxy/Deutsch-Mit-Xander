#!/usr/bin/env node
/* =====================================================================
   SPIELZEUG (FASSUNG 852) — Bilderwelt neu: das Spielwarengeschäft
   ---------------------------------------------------------------------
   Früher eine Sammlung von Kacheln, jetzt ein echter Ort: ein kleines
   Spielwarengeschäft in einer deutschen Innenstadt (Fachhandel mit
   Holzspielzeug, Plüsch, Spielen und Gartenspielzeug).

   RECHERCHE (Fachgeschäfte für Spielwaren, Holzeisenbahn-Spieltische,
   Plüschtier-Hersteller wie Kösen):
   - Holzregale an der Wand: „Spiele & Puzzles“ (Kartons liegend und
     stehend, Murmeln im Netz, Seifenblasen-Dosen, Kindertrommel).
   - Eine beleuchtete Glasvitrine für Puppen, Blechspielzeug (Kreisel,
     Roboter), Spielzeugautos und Babyspielzeug (Rasseln).
   - In der Mitte ein niedriger SPIELTISCH mit Holzeisenbahn, an dem
     Kinder spielen dürfen; daneben Bausteine.
   - Drachen hängen unter der Decke; ein großer Teddybär und ein Korb
     mit Kuscheltieren; Schaukelpferd aus Holz; Ballkorb aus Draht.
   - Eine Ecke „Garten“ auf Kunstrasen: Kinderrutsche und Schaukelgestell.
   Maßstab: Rückwand ≈ 40 Einheiten je Meter (Wand 3 m), Augenhöhe 1,6 m
   → Horizont y = 68; Garten-Ecke ≈ 45, Spieltisch ≈ 70, vorne ≈ 78.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "spielzeug", titel: "Spielzeug", emoji: "🧸", thema: "Spielzeug", kuerzel: "b26c", fassung: 852 });
const rnd = zufall(2024);
const r = B.r;
{ const lg0 = S.lg, rg0 = S.rg, c = {}; S.lg = (n, ...a) => c[n] || (c[n] = lg0(n, ...a)); S.rg = (n, ...a) => c["r" + n] || (c["r" + n] = rg0(n, ...a)); }

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WAND = S.lg("wand", [[0, "#fbefd2"], [1, "#f2dfb6"]]);
const HOLZ = S.lg("holz", [[0, "#d9a96a"], [0.5, "#c8935a"], [1, "#a8743f"]]);
const HOLZ_H = S.lg("holzh", [[0, "#e7bf86"], [1, "#c99558"]]);
const HOLZ_D = S.lg("holzd", [[0, "#8a5a30"], [1, "#6b4322"]]);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.28], [0.5, "#e8f4f7", 0.06], [1, "#ffffff", 0.16]], 0, 0, 1, 1);
const FELL = S.rg("fell", [[0, "#d9a86a"], [0.6, "#b98446"], [1, "#8a5a2a"]], 0.4, 0.35, 0.7);
const HORIZONT = 68, WAND_UNTEN = 132;

/* =====================================================================
   KULISSE — Decke mit Balken, Wand, Dielenboden in Fluchtperspektive
   ===================================================================== */
S.hinten(`<rect width="320" height="15" fill="${S.lg("decke", [[0, "#efe4cf"], [1, "#e2d4b8"]])}"/>`);
{
  let k = "";
  for (const x of [0, 80, 160, 240]) k += `<rect x="${x}" y="0" width="80" height="4" fill="#c79a62" opacity=".35"/>`;
  k += `<rect x="0" y="13" width="320" height="2.2" fill="#c9b08a"/>`;
  for (const x of [40, 120, 200, 280]) k += `<ellipse cx="${x}" cy="7" rx="5" ry="1.4" fill="#fff8e6"/><ellipse cx="${x}" cy="7" rx="11" ry="3" fill="#fff3d0" opacity=".3"/>`;
  S.hinten(k);
}
S.hinten(`<rect x="0" y="15" width="320" height="${WAND_UNTEN - 15}" fill="${WAND}"/>
<rect x="0" y="15" width="320" height="${WAND_UNTEN - 15}" fill="${S.rg("wandlicht", [[0, "#fffaf0", 0.6], [1, "#fffaf0", 0]], 0.5, 0.1, 0.7)}"/>`);
/* Tapete mit kleinen Sternen */
S.def(`<pattern id="${S.id("sterne")}" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M7 4 l.8 1.8 1.9 .2 -1.4 1.3 .4 1.9 -1.7 -1 -1.7 1 .4 -1.9 -1.4 -1.3 1.9 -.2 Z" fill="#f0c86a" opacity=".35"/><circle cx="1" cy="11" r=".6" fill="#9cc7e0" opacity=".4"/></pattern>`);
S.hinten(`<rect x="0" y="15" width="320" height="${WAND_UNTEN - 15}" fill="url(#${S.id("sterne")})"/>`);
/* Schilder an der Wand */
{
  let k = "";
  const schild = (x, y, w, txt, f) => { k += `<rect x="${x - w / 2}" y="${y}" width="${w}" height="8" rx="4" fill="${f}"/><rect x="${x - w / 2}" y="${y}" width="${w}" height="2.4" rx="1.2" fill="#fff" opacity=".25"/><text x="${x}" y="${y + 5.7}" font-size="4.4" text-anchor="middle" fill="#fff" font-family="'Trebuchet MS',Arial,sans-serif" font-weight="bold">${txt}</text>`; };
  schild(46, 30, 62, "Spiele &amp; Puzzles", "#e0573c");
  schild(153, 26, 60, "Puppen &amp; Co.", "#3d8fd1");
  schild(262, 30, 46, "Garten", "#3fa34d");
  S.hinten(k);
}
/* Fußleiste, Dielenboden */
{
  let f = `<rect x="0" y="${WAND_UNTEN - 3}" width="320" height="3" fill="#b88a55"/>`;
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#c99a62"], [1, "#b07c45"]])}"/>`;
  for (let i = -12; i <= 12; i++) {
    const xw = 160 + i * 14, t = (200 - HORIZONT) / (WAND_UNTEN - HORIZONT);
    f += `<line x1="${xw}" y1="${WAND_UNTEN}" x2="${r(160 + (xw - 160) * t)}" y2="200" stroke="#8f6232" stroke-width=".4" opacity=".7"/>`;
  }
  for (let i = 0; i < 40; i++) { const y = WAND_UNTEN + 3 + rnd() * 64, x = rnd() * 320; f += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x)}" y2="${r(y + 2 + (y - 132) * 0.06)}" stroke="#8f6232" stroke-width=".35" opacity=".5"/>`; }
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.15], [0.4, "#000", 0], [1, "#fff", 0.06]])}"/>`;
  /* Kunstrasen der Garten-Ecke */
  f += `<path d="M198 ${WAND_UNTEN} L320 ${WAND_UNTEN} L320 146 L192 146 Z" fill="${S.lg("rasen", [[0, "#6fb555"], [1, "#4f9a3c"]])}"/>`;
  for (let i = 0; i < 90; i++) { const x = 194 + rnd() * 124, y = WAND_UNTEN + 1 + rnd() * 13; f += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x + 0.3)}" y2="${r(y - 1.4)}" stroke="#86c96a" stroke-width=".3"/>`; }
  S.hinten(f);
}

/* =====================================================================
   1 — DER DRACHEN (hängt unter der Decke)
   ===================================================================== */
{
  let k = `<line x1="0" y1="-26" x2="0" y2="-14" stroke="#777" stroke-width=".25"/>`;
  k += `<path d="M0 -14 L13 -2 L0 18 L-13 -2 Z" fill="${S.lg("drache1", [[0, "#ff5a5a"], [1, "#d8262e"]])}"/>`;
  k += `<path d="M0 -14 L13 -2 L0 -2 Z" fill="#ffd23f"/><path d="M0 -2 L-13 -2 L0 18 Z" fill="#2f7fd0"/>`;
  k += `<path d="M0 -14 L0 18 M-13 -2 L13 -2" stroke="#6b4322" stroke-width=".6"/>`;
  k += `<path d="M0 18 q-4 5 0 9 q4 4 0 9 q-3 3 1 6" stroke="#444" stroke-width=".3" fill="none"/>`;
  for (const [x, y, f] of [[-0.8, 22, "#ffd23f"], [0.6, 27, "#2f7fd0"], [-0.6, 32, "#ff5a5a"], [0.6, 37, "#3fa34d"]]) k += `<path d="M${x - 2} ${y} l2 -1 l2 1 l-2 1 Z" fill="${f}"/>`;
  k += `<path d="M-13 -2 L0 -14 L-5 -8 Z" fill="#fff" opacity=".2"/>`;
  S.teil({ id: "drachen", de: "der Drachen", syl: "DRA-chen", it: "l'aquilone", itSyl: "a-qui-LO-ne", en: "kite", x: 214, y: 40, kunst: k,
    tipp: "Im Herbst lässt man in Deutschland gern Drachen steigen." });
}

/* =====================================================================
   2 — DAS REGAL „Spiele & Puzzles“ (links) mit Lupe:
       Brettspiel, Puzzle, Murmel, Seifenblasen, Trommel
   ===================================================================== */
const RL = { x0: 4, x1: 90, y0: 40, y1: WAND_UNTEN };
const BOEDEN_L = [62, 84, 106];
{
  const W = RL.x1 - RL.x0, H = RL.y1 - RL.y0, cx = (RL.x0 + RL.x1) / 2;
  const Y = (y) => y - RL.y1, X = (x) => x - cx;
  let k = `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${HOLZ}"/>`;
  k += `<rect x="${-W / 2 + 2.4}" y="${-H + 2.4}" width="${W - 4.8}" height="${H - 6}" fill="${S.lg("regalinnen", [[0, "#9b6a3a"], [1, "#7d5229"]])}"/>`;
  for (const b of BOEDEN_L) k += `<rect x="${-W / 2 + 2.4}" y="${Y(b)}" width="${W - 4.8}" height="2.2" fill="${HOLZ_H}"/><rect x="${-W / 2 + 2.4}" y="${Y(b) + 2.2}" width="${W - 4.8}" height="1" fill="#000" opacity=".15"/>`;
  k += `<rect x="${-W / 2}" y="-4" width="${W}" height="4" fill="${HOLZ_D}"/>`;
  const unter = [];
  const u = (id, de, syl, it, itSyl, en, x0, x1, b0, b1, tipp) => unter.push({ id, de, syl, it, itSyl, en, tipp, x: (x0 + x1) / 2, y: b1, kunst: flaeche(-(x1 - x0) / 2, -(b1 - b0) + 1, x1 - x0, b1 - b0 - 1) });
  /* Fach 1: Brettspiele liegend gestapelt (links), Puzzles stehend (rechts) */
  const spiele = [["#2f7fd0", "Mensch ärgere"], ["#e0573c", "Memory"], ["#3fa34d", "Halma"], ["#f2b705", "Spiel des Lebens"]];
  spiele.forEach(([f, t], i) => {
    const y = Y(BOEDEN_L[0]) - 4 * (i + 1), w = 30 - i * 2;
    k += `<rect x="${X(10 + i)}" y="${y}" width="${w}" height="4" rx=".3" fill="${f}"/><rect x="${X(10 + i)}" y="${y}" width="${w}" height="1" fill="#fff" opacity=".3"/><text x="${r(X(10 + i) + w / 2)}" y="${y + 3.1}" font-size="2.3" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">${t}</text>`;
  });
  u("brettspiel", "das Brettspiel", "BRETT-spiel", "il gioco da tavolo", "GIO-co da TA-vo-lo", "board game", 8, 42, 42, BOEDEN_L[0],
    "„Mensch ärgere dich nicht“ ist ein Brettspiel aus Deutschland.");
  for (let i = 0; i < 4; i++) {
    const x = X(48 + i * 9.4), y = Y(BOEDEN_L[0]) - 18;
    k += `<rect x="${x}" y="${y}" width="8.6" height="18" rx=".4" fill="${["#5aa7e0", "#f08a4b", "#7fc06a", "#c77dd8"][i]}"/>`;
    k += `<rect x="${x + 0.8}" y="${y + 1}" width="7" height="10" fill="${["#bfe3ff", "#ffe0b0", "#d8f0c4", "#f0d6ff"][i]}"/>`;
    k += `<path d="M${x + 0.8} ${y + 9} L${x + 3} ${y + 5} L${x + 5} ${y + 8} L${x + 7.8} ${y + 4} L${x + 7.8} ${y + 11} L${x + 0.8} ${y + 11} Z" fill="${["#3d7fb8", "#c0603a", "#4f9a3c", "#8c4fa0"][i]}" opacity=".7"/>`;
    k += `<path d="M${x + 1.6} ${y + 13} h2 v1.4 h-2 Z M${x + 4.4} ${y + 13} h2 v1.4 h-2 Z" fill="#fff" opacity=".85"/><text x="${x + 4.3}" y="${y + 17}" font-size="1.9" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">${[100, 200, 500, 1000][i]}</text>`;
  }
  u("puzzle", "das Puzzle", "PUZ-zle", "il puzzle", "PUZ-zle", "jigsaw puzzle", 47, 85, 43, BOEDEN_L[0], "Auf der Packung steht, wie viele Teile das Puzzle hat.");
  /* Fach 2: Murmeln im Netz und im Glas (links), Seifenblasen-Dosen (rechts) */
  {
    const by = Y(BOEDEN_L[1]);
    k += `<path d="M${X(10)} ${by} Q${X(9)} ${by - 12} ${X(16)} ${by - 13} Q${X(23)} ${by - 12} ${X(22)} ${by} Z" fill="#fff" opacity=".35" stroke="#e0573c" stroke-width=".3"/>`;
    for (let i = 0; i < 16; i++) { const mx = X(11 + rnd() * 10), my = by - 1.6 - rnd() * 9; k += `<circle cx="${r(mx)}" cy="${r(my)}" r="1.5" fill="${["#2f7fd0", "#e0573c", "#3fa34d", "#f2b705", "#8c4fa0"][i % 5]}"/><circle cx="${r(mx - 0.5)}" cy="${r(my - 0.5)}" r=".45" fill="#fff" opacity=".8"/>`; }
    k += `<path d="M${X(14)} ${by - 13} L${X(16)} ${by - 15} L${X(18)} ${by - 13}" stroke="#e0573c" stroke-width=".4" fill="none"/>`;
    k += `<rect x="${X(25)}" y="${by - 12}" width="11" height="12" rx="1.6" fill="#e8f4f7" opacity=".55" stroke="#b9cbd1" stroke-width=".3"/><rect x="${X(25)}" y="${by - 13.4}" width="11" height="2" rx=".6" fill="#c0603a"/>`;
    for (let i = 0; i < 10; i++) { const mx = X(27 + rnd() * 7), my = by - 1.6 - rnd() * 8; k += `<circle cx="${r(mx)}" cy="${r(my)}" r="1.2" fill="${["#5aa7e0", "#ff7a5a", "#7fc06a", "#ffd23f"][i % 4]}" opacity=".9"/><circle cx="${r(mx - 0.4)}" cy="${r(my - 0.4)}" r=".35" fill="#fff"/>`; }
    u("murmel", "die Murmel", "MUR-mel", "la biglia", "BI-glia", "marble", 8, 38, 64, BOEDEN_L[1], "Murmeln sind kleine bunte Kugeln aus Glas.");
    for (let i = 0; i < 5; i++) {
      const x = X(46 + i * 7.6);
      k += `<rect x="${x}" y="${by - 12}" width="5.6" height="12" rx="1.4" fill="${["#ff6fa8", "#5aa7e0", "#ffd23f", "#7fc06a", "#c77dd8"][i]}"/><rect x="${x + 1}" y="${by - 14.6}" width="3.6" height="2.8" rx=".8" fill="#fff"/><rect x="${x + 0.6}" y="${by - 10}" width="1" height="8" rx=".5" fill="#fff" opacity=".4"/>`;
    }
    for (const [bx, bb, br] of [[56, 18, 2.6], [64, 16, 1.6], [71, 19, 2]]) k += `<circle cx="${X(bx)}" cy="${by - bb}" r="${br}" fill="#dff3ff" opacity=".35" stroke="#ff9ad0" stroke-width=".25"/><circle cx="${X(bx) - br * 0.4}" cy="${by - bb - br * 0.4}" r="${r(br * 0.25)}" fill="#fff" opacity=".8"/>`;
    u("seifenblasen", "die Seifenblasen", "SEI-fen-bla-sen", "le bolle di sapone", "BOL-le di sa-PO-ne", "soap bubbles", 44, 85, 64, BOEDEN_L[1], "In der Dose ist Seifenwasser und ein Ring zum Pusten.");
  }
  /* Fach 3: Kindertrommel mit Schlägeln (links), weitere Spiele (rechts) */
  {
    const by = Y(BOEDEN_L[2]);
    const tx = X(22);
    k += `<rect x="${tx - 10}" y="${by - 12}" width="20" height="11" fill="${S.lg("trommel", [[0, "#e0573c"], [0.5, "#ff7a5a"], [1, "#b8402a"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${tx - 10} ${by - 11} ${Array.from({ length: 6 }, (_, i) => `L${tx - 10 + (i + 0.5) * 3.33} ${by - 2} L${tx - 10 + (i + 1) * 3.33} ${by - 11}`).join(" ")}" stroke="#fff" stroke-width=".4" fill="none"/>`;
    k += `<ellipse cx="${tx}" cy="${by - 12}" rx="10" ry="2.2" fill="#f6efe0" stroke="#3d8fd1" stroke-width=".7"/><rect x="${tx - 10}" y="${by - 2}" width="20" height="1.4" fill="#3d8fd1"/>`;
    k += `<line x1="${tx - 4}" y1="${by - 13}" x2="${tx + 8}" y2="${by - 18}" stroke="#d9a96a" stroke-width=".8"/><circle cx="${tx + 8}" cy="${by - 18}" r="1.1" fill="#d8262e"/><line x1="${tx - 2}" y1="${by - 12.4}" x2="${tx + 11}" y2="${by - 15}" stroke="#d9a96a" stroke-width=".8"/><circle cx="${tx + 11}" cy="${by - 15}" r="1.1" fill="#d8262e"/>`;
    u("trommel", "die Trommel", "TROM-mel", "il tamburo", "tam-BU-ro", "drum", 8, 38, 86, BOEDEN_L[2]);
    for (let i = 0; i < 6; i++) k += `<rect x="${X(46 + i * 6.4)}" y="${by - 16 + (i % 2) * 2}" width="5.8" height="${16 - (i % 2) * 2}" rx=".3" fill="${["#3d8fd1", "#f2b705", "#e0573c", "#3fa34d", "#8c4fa0", "#ff7a5a"][i]}"/><rect x="${X(46 + i * 6.4) + 1}" y="${by - 13 + (i % 2) * 2}" width="3.8" height="5" fill="#fff" opacity=".5"/>`;
  }
  /* Fach 4: Kartons */
  for (let i = 0; i < 7; i++) k += `<rect x="${X(8 + i * 11.4)}" y="${Y(WAND_UNTEN) - 4 - 18 + (i % 3) * 2}" width="10.4" height="${18 - (i % 3) * 2}" rx=".4" fill="${["#ffb85a", "#9cc7e0", "#f08a8a", "#b9e08a"][i % 4]}"/>`;
  S.teil({ id: "regal", de: "das Regal", syl: "re-GAL", it: "lo scaffale", itSyl: "scaf-FA-le", en: "shelf", x: cx, y: RL.y1, steht: true, kunst: k,
    zoom: { x: 0, y: 38, w: 100, h: 70 }, unter });
}

/* =====================================================================
   3 — DIE VITRINE (Mitte, beleuchtet) mit Lupe: Puppe, Roboter,
       Spielzeugauto, Kreisel, Rassel
   ===================================================================== */
const VI = { x0: 108, x1: 196, y0: 38, y1: WAND_UNTEN };
const BOEDEN_V = [62, 84, 106];
{
  const W = VI.x1 - VI.x0, H = VI.y1 - VI.y0, cx = (VI.x0 + VI.x1) / 2;
  const Y = (y) => y - VI.y1, X = (x) => x - cx;
  let k = `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" rx="1" fill="${HOLZ_D}"/>`;
  k += `<rect x="${-W / 2 + 2}" y="${-H + 2}" width="${W - 4}" height="${H - 7}" fill="${S.lg("vitinnen", [[0, "#fff9ec"], [1, "#efe0c2"]])}"/>`;
  for (const b of BOEDEN_V) k += `<rect x="${-W / 2 + 2}" y="${Y(b)}" width="${W - 4}" height="1.4" fill="#dcecef" opacity=".9"/><rect x="${-W / 2 + 2}" y="${Y(b) - 22 + 0.5}" width="${W - 4}" height="3" fill="${S.lg("vitlicht", [[0, "#fff1c0", 0.7], [1, "#fff1c0", 0]])}"/>`;
  k += `<rect x="${-W / 2}" y="-5" width="${W}" height="5" fill="${HOLZ_D}"/>`;
  const unter = [];
  const u = (id, de, syl, it, itSyl, en, x0, x1, b0, b1, tipp) => unter.push({ id, de, syl, it, itSyl, en, tipp, x: (x0 + x1) / 2, y: b1, kunst: flaeche(-(x1 - x0) / 2, -(b1 - b0) + 1, x1 - x0, b1 - b0 - 1) });
  /* Fach 1: Puppe (sitzend, Kleid, Zöpfe) und Roboter (Blech) */
  {
    const by = Y(BOEDEN_V[0]), px = X(126);
    k += `<path d="M${px - 6} ${by} Q${px - 6} ${by - 8} ${px} ${by - 9} Q${px + 6} ${by - 8} ${px + 6} ${by} Z" fill="${S.lg("kleid", [[0, "#ff8fb8"], [1, "#e0507e"]])}"/>`;
    k += `<path d="M${px - 6} ${by - 0.4} q6 1.4 12 0" stroke="#fff" stroke-width=".7" fill="none"/>`;
    k += `<rect x="${px - 4.6}" y="${by - 1}" width="2" height="1.6" rx=".6" fill="#7a3a20"/><rect x="${px + 2.6}" y="${by - 1}" width="2" height="1.6" rx=".6" fill="#7a3a20"/>`;
    k += `<path d="M${px - 4} ${by - 8} q-3 2 -2.6 4.4 M${px + 4} ${by - 8} q3 2 2.6 4.4" stroke="#f6d2b8" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
    k += `<circle cx="${px}" cy="${by - 12.6}" r="4" fill="${S.rg("puppenkopf", [[0, "#fde3cf"], [1, "#f0c4a4"]])}"/>`;
    k += `<path d="M${px - 4.2} ${by - 12.4} Q${px - 4.4} ${by - 17.4} ${px} ${by - 17} Q${px + 4.4} ${by - 17.4} ${px + 4.2} ${by - 12.4} Q${px + 2} ${by - 15} ${px} ${by - 14.6} Q${px - 2} ${by - 15} ${px - 4.2} ${by - 12.4} Z" fill="#c8812f"/>`;
    k += `<path d="M${px - 4.2} ${by - 13} q-2 2 -1 5 M${px + 4.2} ${by - 13} q2 2 1 5" stroke="#c8812f" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
    k += `<circle cx="${px - 1.4}" cy="${by - 12.6}" r=".55" fill="#2f5d8f"/><circle cx="${px + 1.4}" cy="${by - 12.6}" r=".55" fill="#2f5d8f"/><path d="M${px - 0.9} ${by - 10.8} q.9 .6 1.8 0" stroke="#d0506a" stroke-width=".35" fill="none"/>`;
    k += `<circle cx="${px - 2.4}" cy="${by - 11.4}" r=".7" fill="#ff9aa8" opacity=".5"/><circle cx="${px + 2.4}" cy="${by - 11.4}" r=".7" fill="#ff9aa8" opacity=".5"/>`;
    u("puppe", "die Puppe", "PUP-pe", "la bambola", "BAM-bo-la", "doll", 116, 136, 41, BOEDEN_V[0]);
    const rx = X(150);
    k += `<rect x="${rx - 5}" y="${by - 10}" width="10" height="8.4" rx="1" fill="${S.lg("blech", [[0, "#e9edf0"], [0.5, "#b9c0c6"], [1, "#8a929a"]], 0, 0, 1, 0)}"/>`;
    k += `<rect x="${rx - 3.6}" y="${by - 8.6}" width="7.2" height="3.4" rx=".4" fill="#2f3337"/><circle cx="${rx - 1.6}" cy="${by - 6.9}" r=".7" fill="#ff5a3a"/><circle cx="${rx}" cy="${by - 6.9}" r=".7" fill="#3fe36a"/><circle cx="${rx + 1.6}" cy="${by - 6.9}" r=".7" fill="#ffd23f"/>`;
    k += `<rect x="${rx - 3.6}" y="${by - 1.6}" width="2.6" height="1.6" fill="#5b636b"/><rect x="${rx + 1}" y="${by - 1.6}" width="2.6" height="1.6" fill="#5b636b"/>`;
    k += `<rect x="${rx - 7.4}" y="${by - 9}" width="2.4" height="5" rx="1" fill="#d8262e"/><rect x="${rx + 5}" y="${by - 9}" width="2.4" height="5" rx="1" fill="#d8262e"/>`;
    k += `<rect x="${rx - 4}" y="${by - 17}" width="8" height="6.6" rx="1.2" fill="${S.lg("blech", [[0, "#e9edf0"], [0.5, "#b9c0c6"], [1, "#8a929a"]], 0, 0, 1, 0)}"/><circle cx="${rx - 1.8}" cy="${by - 14}" r="1.3" fill="#ffd23f" stroke="#5b636b" stroke-width=".4"/><circle cx="${rx + 1.8}" cy="${by - 14}" r="1.3" fill="#ffd23f" stroke="#5b636b" stroke-width=".4"/>`;
    k += `<rect x="${rx - 1.6}" y="${by - 11.8}" width="3.2" height=".7" fill="#5b636b"/><line x1="${rx}" y1="${by - 17}" x2="${rx}" y2="${by - 19.4}" stroke="#5b636b" stroke-width=".4"/><circle cx="${rx}" cy="${by - 19.8}" r=".7" fill="#d8262e"/>`;
    u("roboter", "der Roboter", "RO-bo-ter", "il robot", "ro-BOT", "robot", 141, 160, 41, BOEDEN_V[0], "Der Roboter aus Blech läuft mit einem Uhrwerk zum Aufziehen.");
    /* Spieluhr und Blechfrosch (Deko) */
    k += `<rect x="${X(168)}" y="${by - 7}" width="10" height="7" rx=".6" fill="#c0603a"/><rect x="${X(168)}" y="${by - 8}" width="10" height="1.6" rx=".6" fill="#d9a96a"/><circle cx="${X(181)}" cy="${by - 3}" r="3" fill="#3fa34d"/><circle cx="${X(180)}" cy="${by - 5}" r=".6" fill="#fff"/>`;
  }
  /* Fach 2: Spielzeugautos (Reihe), Kreisel */
  {
    const by = Y(BOEDEN_V[1]);
    const auto = (x, f, b = by) => `<path d="M${x - 4} ${b - 1} L${x - 4} ${b - 3} L${x - 2.2} ${b - 3.4} L${x - 1.2} ${b - 5.2} L${x + 1.8} ${b - 5.2} L${x + 2.8} ${b - 3.4} L${x + 4} ${b - 3} L${x + 4} ${b - 1} Z" fill="${f}"/><path d="M${x - 0.9} ${b - 3.5} L${x - 0.3} ${b - 4.8} L${x + 1.5} ${b - 4.8} L${x + 2.2} ${b - 3.5} Z" fill="#bfe3ff"/><circle cx="${x - 2.4}" cy="${b - 1}" r="1.1" fill="#222"/><circle cx="${x + 2.4}" cy="${b - 1}" r="1.1" fill="#222"/>`;
    k += auto(X(116), "#d8262e") + auto(X(126), "#2f7fd0") + auto(X(136), "#f2b705") + auto(X(146), "#3fa34d");
    /* zweite Reihe auf einer Acrylstufe dahinter */
    k += `<rect x="${X(111)}" y="${by - 9.6}" width="40" height="1.2" fill="#dcecef" opacity=".9"/>`;
    for (let i = 0; i < 4; i++) k += auto(X(118 + i * 9), ["#8c4fa0", "#ff7a5a", "#5b636b", "#1d3f7a"][i], by - 9.6);
    u("spielzeugauto", "das Spielzeugauto", "SPIEL-zeug-au-to", "la macchinina", "mac-chi-NI-na", "toy car", 111, 151, 63, BOEDEN_V[1]);
    const kx = X(172);
    k += `<line x1="${kx}" y1="${by - 18}" x2="${kx}" y2="${by - 14}" stroke="#5b636b" stroke-width=".7"/><circle cx="${kx}" cy="${by - 18.4}" r=".9" fill="#d8262e"/>`;
    k += `<path d="M${kx - 8} ${by - 8} Q${kx - 8} ${by - 14.6} ${kx} ${by - 14.6} Q${kx + 8} ${by - 14.6} ${kx + 8} ${by - 8} Q${kx + 4} ${by - 2} ${kx} ${by - 0.6} Q${kx - 4} ${by - 2} ${kx - 8} ${by - 8} Z" fill="${S.lg("kreisel", [[0, "#ff5a5a"], [0.3, "#ffd23f"], [0.55, "#3fa34d"], [0.8, "#2f7fd0"], [1, "#8c4fa0"]])}"/>`;
    k += `<path d="M${kx - 8} ${by - 8} Q${kx} ${by - 6} ${kx + 8} ${by - 8}" stroke="#fff" stroke-width=".5" fill="none" opacity=".7"/><path d="M${kx - 5} ${by - 13} Q${kx - 6} ${by - 10} ${kx - 4.4} ${by - 6}" stroke="#fff" stroke-width=".8" fill="none" opacity=".45"/>`;
    u("kreisel", "der Kreisel", "KREI-sel", "la trottola", "TROT-to-la", "spinning top", 162, 183, 63, BOEDEN_V[1], "Drückt man oben auf den Kreisel, dreht er sich und summt.");
  }
  /* Fach 3: Rasseln und Babyspielzeug */
  {
    const by = Y(BOEDEN_V[2]);
    const rassel = (x, f) => `<rect x="${x - 0.8}" y="${by - 8}" width="1.6" height="8" rx=".8" fill="${f}"/><circle cx="${x}" cy="${by - 11}" r="4" fill="${f}"/><circle cx="${x}" cy="${by - 11}" r="2.8" fill="#fff" opacity=".35"/><circle cx="${x - 1.2}" cy="${by - 12.4}" r=".9" fill="#fff" opacity=".7"/><ellipse cx="${x}" cy="${by - 0.6}" rx="2.4" ry=".9" fill="${f}"/>`;
    k += rassel(X(118), "#ffb85a") + rassel(X(128), "#9cc7e0") + rassel(X(138), "#ff9ad0");
    u("rassel", "die Rassel", "RAS-sel", "il sonaglio", "so-NA-glio", "rattle", 112, 143, 88, BOEDEN_V[2], "Die Rassel ist ein Spielzeug für Babys.");
    /* Stapelturm und Holzente (Deko) */
    for (let i = 0; i < 5; i++) k += `<ellipse cx="${X(160)}" cy="${by - 2 - i * 3}" rx="${6 - i}" ry="1.6" fill="${["#d8262e", "#f2b705", "#3fa34d", "#2f7fd0", "#8c4fa0"][i]}"/>`;
    k += `<rect x="${X(160) - 0.6}" y="${by - 18}" width="1.2" height="4" fill="#d9a96a"/>`;
    k += `<path d="M${X(176)} ${by - 1} q-2 -6 4 -6 q2 -4 5 -1 q2 2 -1 3 q4 4 -2 4 Z" fill="#ffd23f"/><circle cx="${X(181)}" cy="${by - 6.6}" r=".5" fill="#222"/><path d="M${X(184)} ${by - 6} l2 .4 -2 .8 Z" fill="#ff7a2a"/>`;
  }
  /* Fach 4: Kartons */
  for (let i = 0; i < 7; i++) k += `<rect x="${X(112 + i * 11.4)}" y="${-5 - 17 + (i % 2) * 3}" width="10.4" height="${17 - (i % 2) * 3}" rx=".4" fill="${["#f08a8a", "#9cc7e0", "#ffd27a", "#c7e0a0"][i % 4]}"/>`;
  /* Glastüren: Rahmen; die Spiegelung liegt in „davor“ */
  k += `<rect x="${-0.6}" y="${-H + 2}" width="1.2" height="${H - 7}" fill="${HOLZ_D}"/>`;
  S.teil({ id: "vitrine", de: "die Vitrine", syl: "vi-TRI-ne", it: "la vetrina", itSyl: "ve-TRI-na", en: "display cabinet", x: cx, y: VI.y1, steht: true, kunst: k,
    zoom: { x: VI.x0 - 6, y: VI.y0 - 2, w: W + 12, h: 69 }, unter });
  S.davor(`<path d="M${VI.x0 + 6} ${VI.y1 - 6} L${VI.x0 + 20} ${VI.y0 + 2} L${VI.x0 + 27} ${VI.y0 + 2} L${VI.x0 + 13} ${VI.y1 - 6} Z" fill="#fff" opacity=".12"/>
<path d="M${VI.x0 + 54} ${VI.y1 - 6} L${VI.x0 + 66} ${VI.y0 + 2} L${VI.x0 + 70} ${VI.y0 + 2} L${VI.x0 + 58} ${VI.y1 - 6} Z" fill="#fff" opacity=".1"/>
<rect x="${VI.x0 + 2}" y="${VI.y0 + 2}" width="${VI.x1 - VI.x0 - 4}" height="${VI.y1 - VI.y0 - 7}" fill="${GLAS}"/>`);
}

/* =====================================================================
   4 — DIE RUTSCHE und 5 — DIE SCHAUKEL (Garten-Ecke, ≈ 45 je Meter)
   ===================================================================== */
{
  /* Kinderrutsche aus Kunststoff: Leiter links, Rutschfläche nach rechts unten */
  let k = schatten(0, 0, 32, 1.6, .25);
  k += `<path d="M-26 0 L-22 -44 L-18 -44 L-22 0 Z" fill="#2f7fd0"/><path d="M-12 0 L-10 -44 L-6 -44 L-8 0 Z" fill="#2f7fd0"/>`;
  for (let i = 1; i < 6; i++) k += `<path d="M${r(-24 + i * 0.36)} ${-i * 7.4} L${r(-9 + i * 0.1)} ${-i * 7.4}" stroke="#ffd23f" stroke-width="2.2" stroke-linecap="round"/>`;
  k += `<path d="M-24 -46 L-6 -46 L-4 -42 L-24 -42 Z" fill="#ffd23f"/><path d="M-22 -46 Q-22 -54 -14 -54 Q-6 -54 -6 -46" stroke="#3fa34d" stroke-width="2" fill="none"/>`;
  k += `<path d="M-6 -46 Q4 -42 14 -20 Q20 -6 32 -4 L32 0 Q16 -1 10 -14 Q2 -34 -6 -40 Z" fill="${S.lg("rutschbahn", [[0, "#ff6a5a"], [0.5, "#e0402e"], [1, "#b02a1c"]])}"/>`;
  k += `<path d="M-5 -45 Q5 -41 15 -19 Q21 -5 32 -3" stroke="#fff" stroke-width=".8" fill="none" opacity=".45"/>`;
  k += `<rect x="28" y="-4" width="5" height="4" rx="1" fill="#2f7fd0"/>`;
  S.teil({ id: "rutsche", de: "die Rutsche", syl: "RUT-sche", it: "lo scivolo", itSyl: "SCI-vo-lo", en: "slide", x: 222, y: 141, steht: true, kunst: k });
}
{
  /* Schaukelgestell aus Holz (A-Rahmen) mit Brettschaukel */
  let k = schatten(0, 0, 32, 1.6, .25);
  k += `<path d="M-30 0 L-22 -78 L-19 -78 L-25 0 Z M25 0 L19 -78 L22 -78 L30 0 Z" fill="${HOLZ}"/>`;
  k += `<path d="M-22 0 L-21 -76 L-18 -76 L-18 0 Z M18 0 L18 -76 L21 -76 L22 0 Z" fill="${HOLZ_D}" opacity=".6"/>`;
  k += `<rect x="-26" y="-81" width="52" height="4.4" rx="1" fill="${HOLZ}"/><rect x="-26" y="-81" width="52" height="1.2" fill="#fff" opacity=".2"/>`;
  k += `<line x1="-8" y1="-77" x2="-8" y2="-22" stroke="#7a6a50" stroke-width=".7"/><line x1="8" y1="-77" x2="8" y2="-22" stroke="#7a6a50" stroke-width=".7"/>`;
  k += `<rect x="-11" y="-23" width="22" height="3.4" rx="1.4" fill="${S.lg("sitz", [[0, "#ff6a5a"], [1, "#c0302a"]])}"/>`;
  S.teil({ id: "schaukel", de: "die Schaukel", syl: "SCHAU-kel", it: "l'altalena", itSyl: "al-ta-LE-na", en: "swing", x: 289, y: 141, steht: true, kunst: k,
    tipp: "Schaukel und Rutsche stellt man in den Garten." });
}

/* =====================================================================
   6 — DER TEDDYBÄR (groß, sitzt auf dem Boden zwischen Regal und Vitrine)
   ===================================================================== */
{
  let k = schatten(0, 0, 16, 1.6, .3);
  /* Beine nach vorn, Körper, Arme, Kopf mit Ohren, Schleife */
  k += `<ellipse cx="0" cy="-14" rx="12" ry="13" fill="${FELL}"/><ellipse cx="0" cy="-12" rx="7" ry="8" fill="#e8c491" opacity=".8"/>`;
  k += `<ellipse cx="-9" cy="-3.6" rx="5.6" ry="4" fill="${FELL}"/><ellipse cx="9" cy="-3.6" rx="5.6" ry="4" fill="${FELL}"/><ellipse cx="-11" cy="-3.6" rx="2.6" ry="3" fill="#e8c491"/><ellipse cx="11" cy="-3.6" rx="2.6" ry="3" fill="#e8c491"/>`;
  k += `<ellipse cx="-12" cy="-16" rx="4" ry="7.4" fill="${FELL}" transform="rotate(20 -12 -16)"/><ellipse cx="12" cy="-16" rx="4" ry="7.4" fill="${FELL}" transform="rotate(-20 12 -16)"/>`;
  k += `<circle cx="-9" cy="-37" r="4.4" fill="${FELL}"/><circle cx="9" cy="-37" r="4.4" fill="${FELL}"/><circle cx="-9" cy="-37" r="2.4" fill="#e8c491"/><circle cx="9" cy="-37" r="2.4" fill="#e8c491"/>`;
  k += `<circle cx="0" cy="-31" r="10" fill="${FELL}"/><ellipse cx="0" cy="-27.4" rx="4.6" ry="3.6" fill="#e8c491"/>`;
  k += `<ellipse cx="0" cy="-29" rx="1.8" ry="1.2" fill="#2a1a10"/><path d="M0 -27.8 v1.6 M-1.6 -25.6 q1.6 1.2 3.2 0" stroke="#2a1a10" stroke-width=".5" fill="none"/>`;
  k += `<circle cx="-3.6" cy="-33" r="1.2" fill="#1a0f08"/><circle cx="3.6" cy="-33" r="1.2" fill="#1a0f08"/><circle cx="-3.3" cy="-33.4" r=".4" fill="#fff"/><circle cx="3.9" cy="-33.4" r=".4" fill="#fff"/>`;
  k += `<path d="M-4 -22 l-4 -2.6 l0 5.2 Z M4 -22 l4 -2.6 l0 5.2 Z" fill="#d8262e"/><circle cx="0" cy="-22" r="1.6" fill="#b01c22"/>`;
  k += `<path d="M-6 -36 Q-2 -40 4 -38" stroke="#f0d0a0" stroke-width=".8" fill="none" opacity=".5"/>`;
  S.teil({ id: "teddy", de: "der Teddybär", syl: "TED-dy-bär", it: "l'orsacchiotto", itSyl: "or-sac-CHIOT-to", en: "teddy bear", x: 98, y: 152, steht: true, kunst: k,
    tipp: "Der Teddybär wurde 1902 in Deutschland von Margarete Steiff erfunden." });
}

/* =====================================================================
   7 — DER SPIELTISCH mit 8 — DER EISENBAHN und 9 — DEM LEGOSTEIN
   ===================================================================== */
const ST = { x0: 112, x1: 206, fuss: 180, h: 32 };
{
  const W = ST.x1 - ST.x0, H = ST.h;
  let k = schatten(0, 0, W / 2 + 3, 2, .3);
  k += `<path d="M${-W / 2 + 4} ${-H - 8} L${W / 2 - 4} ${-H - 8} L${W / 2} ${-H} L${-W / 2} ${-H} Z" fill="${S.lg("tischplatte", [[0, "#e7bf86"], [1, "#d9a96a"]])}"/>`;
  /* aufgedruckte Landschaft: Wiese, Straße, Teich */
  k += `<path d="M${-W / 2 + 6} ${-H - 7.4} L${W / 2 - 6} ${-H - 7.4} L${W / 2 - 2} ${-H - 0.8} L${-W / 2 + 2} ${-H - 0.8} Z" fill="#8cc66a"/>`;
  k += `<ellipse cx="22" cy="${-H - 3.4}" rx="6" ry="1.6" fill="#5aa7e0"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="3.4" fill="${HOLZ}"/><rect x="${-W / 2}" y="${-H + 3.4}" width="${W}" height="2.4" fill="${HOLZ_D}"/>`;
  k += `<rect x="${-W / 2 + 4}" y="${-H + 5.8}" width="20" height="10" rx="1" fill="#b98446"/><rect x="${-W / 2 + 26}" y="${-H + 5.8}" width="20" height="10" rx="1" fill="#b98446"/>`;
  k += `<rect x="${-W / 2 + 13}" y="${-H + 10}" width="3" height="1.4" rx=".6" fill="#6b4322"/><rect x="${-W / 2 + 35}" y="${-H + 10}" width="3" height="1.4" rx=".6" fill="#6b4322"/>`;
  for (const x of [-W / 2 + 2, W / 2 - 6]) k += `<rect x="${x}" y="${-H + 5.8}" width="4" height="${H - 5.8}" fill="${HOLZ}"/><rect x="${x}" y="${-H + 5.8}" width="1.2" height="${H - 5.8}" fill="#fff" opacity=".15"/>`;
  k += `<text x="20" y="${-H + 14}" font-size="3.6" text-anchor="middle" fill="#6b4322" font-family="'Trebuchet MS',Arial" font-weight="bold">Hier darf gespielt werden!</text>`;
  S.teil({ id: "spieltisch", de: "der Spieltisch", syl: "SPIEL-tisch", it: "il tavolo da gioco", itSyl: "TA-vo-lo da GIO-co", en: "play table", x: (ST.x0 + ST.x1) / 2, y: ST.fuss, steht: true, kunst: k });
}
const PL = ST.fuss - ST.h - 3;     // Standhöhe auf der Spieltischplatte
{
  /* Holzeisenbahn: Gleisoval (in Draufsicht verkürzt) mit Lok und zwei Wagen */
  let k = `<ellipse cx="0" cy="-2.4" rx="30" ry="3.6" fill="none" stroke="#c99558" stroke-width="2.2"/><ellipse cx="0" cy="-2.4" rx="30" ry="3.6" fill="none" stroke="#a8743f" stroke-width=".3" stroke-dasharray="1 .6"/>`;
  /* Brücke hinten */
  k += `<path d="M-6 -6.2 Q0 -11 6 -6.2" stroke="#d9a96a" stroke-width="1.6" fill="none"/><rect x="-6.6" y="-7" width="1.4" height="2.4" fill="#a8743f"/><rect x="5.2" y="-7" width="1.4" height="2.4" fill="#a8743f"/>`;
  /* Lok (rot, Schornstein) */
  const lx = -10;
  k += `<rect x="${lx - 5}" y="-6" width="9" height="4" rx=".6" fill="${S.lg("lok", [[0, "#ff5a4a"], [1, "#c0141c"]])}"/><rect x="${lx - 5}" y="-10.4" width="4" height="4.6" rx=".4" fill="#c0141c"/><rect x="${lx - 4.4}" y="-9.6" width="2.8" height="1.8" fill="#bfe3ff"/>`;
  k += `<rect x="${lx + 1.2}" y="-9" width="1.8" height="3.2" fill="#2a2d31"/><rect x="${lx + 0.8}" y="-9.6" width="2.6" height=".8" fill="#2a2d31"/>`;
  for (const dx of [-3.4, -0.6, 2.2]) k += `<circle cx="${lx + dx}" cy="-1.6" r="1.2" fill="#2a2d31"/><circle cx="${lx + dx}" cy="-1.6" r=".4" fill="#d9a96a"/>`;
  /* Wagen (blau, gelb) */
  k += `<rect x="${lx + 6}" y="-5.6" width="7" height="3.6" rx=".4" fill="#2f7fd0"/><circle cx="${lx + 7.6}" cy="-1.6" r="1.1" fill="#2a2d31"/><circle cx="${lx + 11.4}" cy="-1.6" r="1.1" fill="#2a2d31"/>`;
  k += `<rect x="${lx + 14.6}" y="-5.6" width="7" height="3.6" rx=".4" fill="#ffd23f"/><rect x="${lx + 15.4}" y="-8" width="2.2" height="2.4" fill="#3fa34d"/><rect x="${lx + 18}" y="-7.4" width="2.2" height="1.8" fill="#d8262e"/><circle cx="${lx + 16.2}" cy="-1.6" r="1.1" fill="#2a2d31"/><circle cx="${lx + 20}" cy="-1.6" r="1.1" fill="#2a2d31"/>`;
  k += `<line x1="${lx + 4}" y1="-3.6" x2="${lx + 6}" y2="-3.6" stroke="#6b4322" stroke-width=".5"/><line x1="${lx + 13}" y1="-3.6" x2="${lx + 14.6}" y2="-3.6" stroke="#6b4322" stroke-width=".5"/>`;
  /* Bäume am Gleis */
  for (const [tx, ts] of [[-26, 1], [24, 0.8]]) k += `<rect x="${tx - 0.5}" y="${-5 * ts}" width="1" height="${3 * ts}" fill="#8a5a30"/><circle cx="${tx}" cy="${-7 * ts}" r="${3 * ts}" fill="#3fa34d"/>`;
  S.teil({ oben: true, id: "eisenbahn", de: "die Eisenbahn", syl: "EI-sen-bahn", it: "il trenino", itSyl: "tre-NI-no", en: "toy train", x: 150, y: PL, steht: true, kunst: k,
    tipp: "Die Holzeisenbahn fährt im Kreis – über die Brücke und durch die Wiese." });
}
{
  /* Legosteine: ein kleines Haus und lose Steine auf der Platte */
  let k = "";
  const stein = (x, y, w, f) => {
    let g = `<rect x="${x}" y="${y - 2.4}" width="${w}" height="2.4" rx=".2" fill="${f}"/><rect x="${x}" y="${y - 2.4}" width="${w}" height=".5" fill="#fff" opacity=".3"/>`;
    for (let i = 0; i < Math.round(w / 1.8); i++) g += `<rect x="${r(x + 0.35 + i * 1.8)}" y="${y - 3}" width="1.1" height=".7" rx=".2" fill="${f}"/>`;
    return g;
  };
  k += stein(-6, 0, 7.2, "#d8262e") + stein(1.4, 0, 7.2, "#d8262e") + stein(-4, -2.4, 7.2, "#ffd23f") + stein(3.4, -2.4, 3.6, "#ffd23f") + stein(-6, -4.8, 3.6, "#2f7fd0") + stein(-2.2, -4.8, 7.2, "#2f7fd0") + stein(5.2, -4.8, 3.6, "#2f7fd0");
  k += `<path d="M-6.4 -8 L1 -12.4 L8.8 -8 Z" fill="#3fa34d"/>`;
  k += stein(11, 0.4, 3.6, "#3fa34d") + stein(-12, 0.6, 3.6, "#ff7a2a");
  S.teil({ oben: true, id: "legostein", de: "der Legostein", syl: "LE-go-stein", it: "il mattoncino", itSyl: "mat-ton-CI-no", en: "Lego brick", x: 192, y: PL + 1, steht: true, kunst: k });
}

/* =====================================================================
   10 — DIE BAUKLÖTZE (Turm aus Holzklötzen auf dem Boden vorne)
   ===================================================================== */
{
  let k = schatten(0, 0, 14, 1.4, .3);
  const klotz = (x, y, w, h, f) => `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx=".5" fill="${f}"/><path d="M${x} ${y - h} l2 -2 h${w} l-2 2 Z" fill="#fff" opacity=".35"/><path d="M${x + w} ${y - h} l2 -2 v${h} l-2 2 Z" fill="#000" opacity=".12"/>`;
  k += klotz(-12, 0, 8, 8, "#d8262e") + klotz(-3, 0, 8, 8, "#2f7fd0") + klotz(6, 0, 7, 7, "#ffd23f");
  k += klotz(-8, -8, 16, 4, "#e7bf86") + klotz(-6, -12, 7, 7, "#3fa34d") + klotz(2, -12, 6, 6, "#ff7a2a");
  k += `<path d="M-6 -19 L-2.5 -25 L1 -19 Z" fill="#8c4fa0"/>`;
  k += `<text x="-8" y="-2.4" font-size="5" text-anchor="middle" fill="#fff" font-family="Georgia" font-weight="bold">A</text><text x="1" y="-2.4" font-size="5" text-anchor="middle" fill="#fff" font-family="Georgia" font-weight="bold">B</text>`;
  S.teil({ id: "bauklotz", de: "die Bauklötze", syl: "BAU-klöt-ze", it: "i cubi", itSyl: "CU-bi", en: "building blocks", x: 96, y: 194, steht: true, kunst: k });
}

/* =====================================================================
   11 — DAS SCHAUKELPFERD (Holz, vorne links, ≈ 78 je Meter)
   ===================================================================== */
{
  let k = schatten(0, 0, 32, 2, .3);
  /* Kufen */
  k += `<path d="M-34 -10 Q0 6 34 -10" stroke="${HOLZ_D}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M-34 -10 Q0 6 34 -10" stroke="#c99558" stroke-width="1" fill="none" opacity=".6" transform="translate(0 -1)"/>`;
  /* Beine */
  /* Beine: oben am Körper, unten auf der Kufe (Hufe dunkel), leicht gespreizt */
  for (const [x0, x1, yb] of [[-16, -22, -6.4], [-10, -12, -3.2], [10, 12, -3.2], [16, 22, -6.4]]) {
    k += `<path d="M${x0 - 2.4} -28 L${x0 + 2.4} -28 L${x1 + 1.8} ${yb - 2} L${x1 - 1.8} ${yb - 2} Z" fill="${S.lg("pferd", [[0, "#f5f1ea"], [1, "#d8d0c2"]])}" stroke="#cfc6b6" stroke-width=".3"/>`;
    k += `<rect x="${x1 - 2}" y="${yb - 2.6}" width="4" height="2.6" rx=".6" fill="#3a2a1c"/>`;
  }
  /* Körper */
  k += `<ellipse cx="0" cy="-30" rx="24" ry="8" fill="${S.lg("pferd", [[0, "#f5f1ea"], [1, "#d8d0c2"]])}"/>`;
  for (const [x, y] of [[-12, -32], [-4, -27], [6, -31], [14, -28], [-16, -27]]) k += `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.6" fill="#8a7a66" opacity=".5"/>`;
  /* Hals und Kopf (rechts) */
  k += `<path d="M14 -34 Q20 -50 26 -52 L34 -46 Q36 -42 32 -41 L26 -42 Q22 -34 20 -28 Z" fill="${S.lg("pferd", [[0, "#f5f1ea"], [1, "#d8d0c2"]])}"/>`;
  k += `<path d="M13 -35 Q16 -48 24 -54 Q22 -46 18 -36 Z" fill="#6b4322"/>`;
  k += `<circle cx="28" cy="-47" r="1" fill="#2a1a10"/><path d="M25 -53 l1 -4 l2 3.4 Z" fill="#e8e0d2"/><circle cx="33.4" cy="-43" r=".6" fill="#2a1a10"/>`;
  k += `<path d="M22 -46 L33 -44" stroke="#d8262e" stroke-width=".9"/><path d="M27 -44.6 Q20 -38 10 -36" stroke="#d8262e" stroke-width=".6" fill="none"/>`;
  /* Sattel, Schweif, Griff */
  k += `<path d="M-6 -38 Q0 -41 8 -38 L8 -33 L-6 -33 Z" fill="#d8262e"/><rect x="-1" y="-41" width="2" height="4" fill="#b01c22"/>`;
  k += `<path d="M-23 -32 Q-32 -30 -30 -18 Q-28 -24 -24 -26 Z" fill="#6b4322"/>`;
  k += `<rect x="20" y="-49" width="7" height="1.2" rx=".6" fill="${HOLZ_D}"/>`;
  S.teil({ id: "schaukelpferd", de: "das Schaukelpferd", syl: "SCHAU-kel-pferd", it: "il cavallo a dondolo", itSyl: "ca-VAL-lo a DON-do-lo", en: "rocking horse", x: 42, y: 190, steht: true, kunst: k });
}

/* =====================================================================
   12 — DAS KUSCHELTIER (Weidenkorb voller Plüschtiere) und
   13 — DER BALL (Drahtkorb mit Bällen), vorne rechts
   ===================================================================== */
{
  let k = schatten(0, 0, 18, 1.6, .3);
  k += `<path d="M-15 -20 L15 -20 L12 0 L-12 0 Z" fill="${S.lg("korb", [[0, "#d3a35b"], [1, "#9b6b2c"]])}"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${-14.4 + i * 0.6} ${-16 + i * 4.4} L${14.4 - i * 0.6} ${-16 + i * 4.4}" stroke="#8a5c22" stroke-width=".6"/>`;
  for (let i = 0; i < 9; i++) k += `<line x1="${-13 + i * 3.3}" y1="-20" x2="${-10.6 + i * 2.65}" y2="0" stroke="#8a5c22" stroke-width=".4"/>`;
  /* Plüschtiere: Hase (grau), Elefant (blau), Hund (beige), Eule (lila) */
  k += `<ellipse cx="-9" cy="-24" rx="5" ry="5" fill="#b9bfc5"/><ellipse cx="-11" cy="-33" rx="1.6" ry="5" fill="#b9bfc5"/><ellipse cx="-7" cy="-33" rx="1.6" ry="5" fill="#b9bfc5"/><ellipse cx="-7" cy="-33" rx=".7" ry="3.4" fill="#ffc0cc"/><circle cx="-10.4" cy="-25" r=".6" fill="#222"/><circle cx="-7.6" cy="-25" r=".6" fill="#222"/><circle cx="-9" cy="-23.4" r=".6" fill="#ff8fb8"/>`;
  k += `<ellipse cx="1" cy="-25" rx="6.4" ry="5.6" fill="#7fb3e0"/><ellipse cx="-4.6" cy="-25" rx="2.6" ry="3.4" fill="#9cc7e0"/><ellipse cx="6.6" cy="-25" rx="2.6" ry="3.4" fill="#9cc7e0"/><path d="M1 -22 q-.6 4 2 5" stroke="#7fb3e0" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="-1" cy="-26" r=".6" fill="#222"/><circle cx="3" cy="-26" r=".6" fill="#222"/>`;
  k += `<circle cx="10" cy="-23" r="4.6" fill="#e8c491"/><ellipse cx="6.4" cy="-23" rx="1.6" ry="3" fill="#a8743f"/><ellipse cx="13.6" cy="-23" rx="1.6" ry="3" fill="#a8743f"/><circle cx="10" cy="-21.6" r=".9" fill="#2a1a10"/><circle cx="8.6" cy="-24" r=".5" fill="#222"/><circle cx="11.4" cy="-24" r=".5" fill="#222"/>`;
  k += `<ellipse cx="-2" cy="-20.6" rx="4.6" ry="3.6" fill="#a87dd8"/><circle cx="-3.6" cy="-21.4" r="1.4" fill="#fff"/><circle cx="-.4" cy="-21.4" r="1.4" fill="#fff"/><circle cx="-3.6" cy="-21.4" r=".6" fill="#222"/><circle cx="-.4" cy="-21.4" r=".6" fill="#222"/><path d="M-2.6 -20 l.6 1 .6 -1 Z" fill="#ffb347"/>`;
  k += `<rect x="-8" y="-12" width="16" height="6" rx="1" fill="#fff8e6"/><text x="0" y="-7.8" font-size="3.2" text-anchor="middle" fill="#c0302a" font-family="'Trebuchet MS',Arial" font-weight="bold">je 9,99 €</text>`;
  S.teil({ id: "kuscheltier", de: "das Kuscheltier", syl: "KU-schel-tier", it: "il peluche", itSyl: "pe-LU-che", en: "cuddly toy", x: 230, y: 188, steht: true, kunst: k });
}
{
  let k = schatten(0, 0, 18, 1.6, .3);
  /* Bälle zuerst (hinter dem Draht), dann das Gitter */
  const baelle = [[-9, -22, 7, "#d8262e"], [5, -24, 7.6, "#2f7fd0"], [-3, -33, 6, "#ffd23f"], [12, -34, 5.4, "#3fa34d"], [-13, -33, 4.6, "#ff7a2a"]];
  baelle.forEach(([x, y, rr, f], i) => {
    k += `<circle cx="${x}" cy="${y}" r="${rr}" fill="${f}"/><path d="M${x - rr} ${y} Q${x} ${y + rr * 0.5} ${x + rr} ${y}" stroke="#fff" stroke-width="${r(rr * 0.22)}" fill="none" opacity=".75"/><circle cx="${x - rr * 0.35}" cy="${y - rr * 0.4}" r="${r(rr * 0.28)}" fill="#fff" opacity=".35"/>`;
    if (i === 1) k += `<path d="M${x - 2.6} ${y - 2} l2.6 -2 l2.6 2 l-1 3 h-3.2 Z" fill="#fff" opacity=".85"/>`;
  });
  k += `<path d="M-17 -30 L17 -30 L15 0 L-15 0 Z" fill="none" stroke="#9aa2a9" stroke-width=".9"/>`;
  for (let i = 1; i < 8; i++) k += `<line x1="${-17 + i * 4.25}" y1="-30" x2="${-15 + i * 3.75}" y2="0" stroke="#9aa2a9" stroke-width=".45"/>`;
  for (let i = 1; i < 6; i++) k += `<line x1="${-17 + i * 0.33}" y1="${-30 + i * 5}" x2="${17 - i * 0.33}" y2="${-30 + i * 5}" stroke="#9aa2a9" stroke-width=".45"/>`;
  S.teil({ id: "ball", de: "der Ball", syl: "BALL", it: "la palla", itSyl: "PAL-la", en: "ball", x: 286, y: 195, steht: true, kunst: k });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/spielzeug.js"));
console.log(aus);
