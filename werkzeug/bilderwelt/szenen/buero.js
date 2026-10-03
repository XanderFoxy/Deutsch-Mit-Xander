#!/usr/bin/env node
/* =====================================================================
   DAS BÜRO (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Arbeitsstättenregel ASR A1.8/A3.4, Ratgeber Büroeinrichtung,
   Bildschirmarbeitsplatz nach DGUV) — so sieht ein Büro in Deutschland
   heute aus:
   - Der SCHREIBTISCH (höhenverstellbar, weiße Platte, T-Füße) steht
     seitlich zum Fenster, davor ein drehbarer BÜROSTUHL mit Netzrücken,
     fünf Rollen und Armlehnen.
   - Auf dem Tisch: großer BILDSCHIRM auf Standfuß, flache TASTATUR,
     MAUS auf dem Mauspad, TELEFON mit Display, Notizblock, Kuli,
     KAFFEETASSE, Büroklammern; eine Schreibtischlampe. Der COMPUTER
     steht als Turm unter dem Tisch.
   - An der Wand der AKTENSCHRANK mit bunten ORDNERN (Rückenschilder),
     ein Sideboard mit dem DRUCKER (Multifunktionsgerät), Locher und
     Tacker, ein WHITEBOARD, eine PINNWAND aus Kork, ein KALENDER.
   - Fenster mit JALOUSIE, graue Teppichfliesen, eine große PFLANZE,
     der PAPIERKORB neben dem Tisch.
   Maßstab (eine Augenhöhe, Fluchtpunkt 160/−8):
   Rückwand ≈ 33 Einheiten je Meter, Schreibtisch ≈ 36, vorne ≈ 51.
   Sachbearbeiterin 1,66 m (sitzt), Kollege 1,82 m, Tisch 0,75 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "buero", titel: "Das Büro", emoji: "🗂️", thema: "Arbeit", kuerzel: "b07d", fassung: 852 });
const rnd = zufall(9172);
const r = B.r;

const VP = { x: 160, y: -8 };
const M = (y) => 0.25 * (y - VP.y);
const fx = (X, y) => VP.x + X * M(y);
const WAND_UNTEN = 124;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b2b9bf"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const WEISS = S.lg("weiss", [[0, "#ffffff"], [1, "#e6e8ea"]]);
const ANTH = S.lg("anth", [[0, "#4a4f55"], [1, "#2c3035"]]);
const SCHRANK = S.lg("schrank", [[0, "#e9ebec"], [0.5, "#dcdfe1"], [1, "#c9cdd0"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — weiße Wand, Fenster mit Blick auf die Stadt, Teppichfliesen
   ===================================================================== */
const FEN = { x0: 118, x1: 214, y0: 16, y1: 84 };
{
  let k = `<rect x="0" y="0" width="320" height="${WAND_UNTEN}" fill="${S.lg("wand", [[0, "#f4f4f1"], [1, "#e6e6e1"]])}"/>`;
  k += `<rect x="0" y="0" width="320" height="${WAND_UNTEN}" fill="${S.rg("wandlicht", [[0, "#fffdf2", 0.5], [1, "#fffdf2", 0]], 0.52, 0.25, 0.6)}"/>`;
  /* Fenster: Rahmen anthrazit, draußen Himmel und Bürohaus gegenüber */
  k += `<rect x="${FEN.x0 - 3}" y="${FEN.y0 - 3}" width="${FEN.x1 - FEN.x0 + 6}" height="${FEN.y1 - FEN.y0 + 6}" fill="#52575d"/>`;
  k += `<rect x="${FEN.x0}" y="${FEN.y0}" width="${FEN.x1 - FEN.x0}" height="${FEN.y1 - FEN.y0}" fill="${S.lg("himmel", [[0, "#a9d2ee"], [1, "#e4f1f8"]])}"/>`;
  k += `<rect x="${FEN.x0 + 50}" y="${FEN.y0 + 22}" width="60" height="60" fill="${S.lg("haus", [[0, "#d9cbb6"], [1, "#c4b49c"]])}"/>`;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) k += `<rect x="${FEN.x0 + 54 + i * 10}" y="${FEN.y0 + 27 + j * 11}" width="6" height="7" fill="#8fb3c9" opacity=".8"/>`;
  k += `<rect x="${FEN.x0}" y="${FEN.y0 + 48}" width="52" height="40" fill="#b9c4cb"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${FEN.x0 + 6 + i * 8}" cy="${FEN.y0 + 50}" r="${4 + (i % 2)}" fill="#6f9a55"/>`;
  k += `<rect x="${(FEN.x0 + FEN.x1) / 2 - 1.2}" y="${FEN.y0}" width="2.4" height="${FEN.y1 - FEN.y0}" fill="#52575d"/>`;
  k += `<path d="M${FEN.x0 + 4} ${FEN.y1} L${FEN.x0 + 22} ${FEN.y0} L${FEN.x0 + 30} ${FEN.y0} L${FEN.x0 + 12} ${FEN.y1} Z" fill="#fff" opacity=".22"/>`;
  k += `<rect x="${FEN.x0 - 6}" y="${FEN.y1 + 3}" width="${FEN.x1 - FEN.x0 + 12}" height="2.4" fill="#d9dadb"/>`;
  /* Heizkörper unter dem Fenster */
  k += `<rect x="${FEN.x0 + 8}" y="${FEN.y1 + 10}" width="${FEN.x1 - FEN.x0 - 16}" height="16" rx="1" fill="${WEISS}"/>`;
  for (let x = FEN.x0 + 10; x < FEN.x1 - 9; x += 2.4) k += `<rect x="${r(x)}" y="${FEN.y1 + 11}" width="1" height="14" fill="#d6d9dc"/>`;
  /* Sockelleiste und Kabelkanal */
  k += `<rect x="0" y="${WAND_UNTEN - 3}" width="320" height="3" fill="#cfd2d4"/>`;
  /* Steckdosen */
  for (const x of [100, 228]) k += `<rect x="${x}" y="${WAND_UNTEN - 14}" width="5" height="5" rx=".8" fill="#fff" stroke="#c9cdd0" stroke-width=".3"/><circle cx="${x + 2.5}" cy="${WAND_UNTEN - 11.5}" r="1.4" fill="#e9eaea"/>`;
  S.hinten(k);
}
{
  /* Teppichfliesen (50 cm), grau meliert, in Fluchtperspektive */
  let f = `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("teppich", [[0, "#7f858b"], [1, "#959ba1"]])}"/>`;
  const tiefen = [];
  /* Brennweite 320 Einheiten: Tiefe D (m) ↔ y = VP.y + 4 · 320 / D */
  const D0 = 320 / M(WAND_UNTEN);
  for (let d = 0; d < 40; d++) { const y = VP.y + 4 * 320 / (D0 - d * 0.5); tiefen.push(y); if (y > 200) break; }
  for (let X = -8; X <= 8; X += 0.5) {
    for (let i = 0; i + 1 < tiefen.length; i++) {
      const y0 = tiefen[i], y1 = tiefen[i + 1];
      if (y0 > 200) break;
      if ((Math.round(X * 2) + i) % 2) continue;
      const a = [fx(X, y0), y0], b = [fx(X + 0.5, y0), y0], c = [fx(X + 0.5, Math.min(y1, 200)), Math.min(y1, 200)], d2 = [fx(X, Math.min(y1, 200)), Math.min(y1, 200)];
      f += `<path d="M${r(a[0])} ${r(a[1])} L${r(b[0])} ${r(b[1])} L${r(c[0])} ${r(c[1])} L${r(d2[0])} ${r(d2[1])} Z" fill="#6f757b" opacity=".16"/>`;
    }
  }
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="1" fill="#62686e"/>`;
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.14], [0.4, "#000", 0], [1, "#fff", 0.05]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DIE JALOUSIE (halb heruntergelassen)
   ===================================================================== */
{
  const W = FEN.x1 - FEN.x0 + 4, cx = (FEN.x0 + FEN.x1) / 2;
  let k = `<rect x="${-W / 2 - 1}" y="-2" width="${W + 2}" height="3" rx=".6" fill="#c9cdd0"/>`;
  for (let y = 1.4; y < 30; y += 1.6) k += `<rect x="${-W / 2}" y="${r(y)}" width="${W}" height="1.2" fill="${S.lg("lamelle", [[0, "#ffffff"], [1, "#d6d9dc"]])}"/>`;
  k += `<rect x="${-W / 2}" y="30" width="${W}" height="1.6" fill="#b9bec2"/>`;
  k += `<line x1="${W / 2 - 6}" y1="1" x2="${W / 2 - 6}" y2="46" stroke="#9aa3aa" stroke-width=".4"/><rect x="${W / 2 - 7}" y="46" width="2" height="3" rx=".8" fill="#9aa3aa"/>`;
  for (const x of [-W / 3, 0, W / 3]) k += `<line x1="${r(x)}" y1="1" x2="${r(x)}" y2="31" stroke="#c9cdd0" stroke-width=".25"/>`;
  S.teil({ id: "bu_jalousie", de: "die Jalousie", syl: "Ja-lou-SIE", it: "la veneziana", itSyl: "ve-ne-ZIA-na", en: "blinds", x: cx, y: FEN.y0 - 1, kunst: k,
    tipp: "Mit der Jalousie hält man die Sonne vom Bildschirm fern." });
}

/* =====================================================================
   2 — DIE PINNWAND (Kork) und DER KALENDER und DAS WHITEBOARD
   ===================================================================== */
{
  let k = `<rect x="-21" y="-16" width="42" height="32" rx="1" fill="#9aa0a6"/><rect x="-20" y="-15" width="40" height="30" fill="${S.lg("kork", [[0, "#c99a62"], [1, "#b48550"]])}"/>`;
  for (let i = 0; i < 60; i++) k += `<circle cx="${r(-19 + rnd() * 38)}" cy="${r(-14 + rnd() * 28)}" r=".3" fill="${rnd() < 0.5 ? "#9b6e3c" : "#dcb27c"}"/>`;
  const zettel = [[-15, -10, 11, 9, "#fff59a", -4], [-2, -11, 10, 10, "#ffffff", 3], [10, -8, 8, 8, "#a8e0f5", -2], [-14, 2, 12, 9, "#ffffff", 2], [1, 3, 9, 8, "#f9b9c9", -5], [12, 4, 6, 8, "#fff59a", 4]];
  const pin = ["#c0392b", "#2a6db3", "#2f8f5b", "#e5b912", "#c0392b", "#2a6db3"];
  zettel.forEach(([x, y, w, h, f, rot], i) => {
    k += `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" stroke="#d6cfbf" stroke-width=".15"/>`;
    for (let j = 0; j < 3; j++) k += `<line x1="${x + 1.2}" y1="${r(y + 2.6 + j * 1.8)}" x2="${r(x + w - 1.2 - (j === 2 ? 2 : 0))}" y2="${r(y + 2.6 + j * 1.8)}" stroke="#8a8f94" stroke-width=".25"/>`;
    k += `<circle cx="${x + w / 2}" cy="${y + 0.8}" r=".8" fill="${pin[i]}"/></g>`;
  });
  S.teil({ id: "pinnwand", de: "die Pinnwand", syl: "PINN-wand", it: "la bacheca", itSyl: "ba-CHE-ca", en: "pinboard", x: 88, y: 50, kunst: k,
    tipp: "Wichtige Zettel werden mit Pinnnadeln an die Pinnwand gesteckt." });
}
{
  let k = `<rect x="-10" y="-16" width="20" height="30" fill="#fff" stroke="#c9cdd0" stroke-width=".3"/><rect x="-10" y="-16" width="20" height="11" fill="${S.lg("kalbild", [[0, "#6fb2d8"], [1, "#3f8f5b"]])}"/>`;
  k += `<path d="M-10 -8 L-4 -12 L1 -9 L6 -13 L10 -10 L10 -5 L-10 -5 Z" fill="#2f6f45"/>`;
  k += `<text x="0" y="-2.4" font-size="2.4" text-anchor="middle" fill="#1d1f22" font-family="Arial" font-weight="bold">OKTOBER</text>`;
  for (let w = 0; w < 5; w++) for (let d = 0; d < 7; d++) {
    const n = w * 7 + d - 2;
    if (n < 1 || n > 31) continue;
    k += `<text x="${-8.4 + d * 2.8}" y="${r(1.4 + w * 2.6)}" font-size="1.5" text-anchor="middle" fill="${d > 4 ? "#c0392b" : "#3a3f44"}" font-family="Arial">${n}</text>`;
    if (n === 3) k += `<circle cx="${-8.4 + d * 2.8}" cy="${r(0.9 + w * 2.6)}" r="1.2" fill="none" stroke="#c0392b" stroke-width=".3"/>`;
  }
  k += `<rect x="-6" y="-17" width="12" height="1.2" fill="#59616a"/>`;
  S.teil({ id: "kalender", de: "der Kalender", syl: "Ka-LEN-der", it: "il calendario", itSyl: "ca-len-DA-rio", en: "calendar", x: 306, y: 46, kunst: k,
    tipp: "Der 3. Oktober ist der Tag der Deutschen Einheit — ein Feiertag." });
}
{
  let k = `<rect x="-32" y="-22" width="64" height="40" rx="1" fill="#c9cdd0"/><rect x="-31" y="-21" width="62" height="38" fill="${S.lg("wb", [[0, "#ffffff"], [1, "#eef1f3"]])}"/>`;
  k += `<path d="M-31 -21 L-10 -21 L-31 6 Z" fill="#fff" opacity=".6"/>`;
  k += `<text x="-28" y="-14" font-size="3.4" fill="#1f4f87" font-family="'Comic Sans MS','Segoe Print',cursive" font-weight="bold">Projekt Herbst</text>`;
  k += `<text x="-28" y="-8.4" font-size="2.4" fill="#2c3035" font-family="'Comic Sans MS','Segoe Print',cursive">✓ Angebot schicken</text><text x="-28" y="-4.4" font-size="2.4" fill="#2c3035" font-family="'Comic Sans MS','Segoe Print',cursive">✓ Termin Kunde</text><text x="-28" y="-.4" font-size="2.4" fill="#c0392b" font-family="'Comic Sans MS','Segoe Print',cursive">→ Rechnung bis Fr!</text>`;
  /* kleines Balkendiagramm */
  for (let i = 0; i < 4; i++) { const h = [6, 9, 7, 12][i]; k += `<rect x="${8 + i * 5}" y="${8 - h}" width="3.4" height="${h}" fill="none" stroke="#2f8f5b" stroke-width=".5"/>`; }
  k += `<path d="M6 8 L28 8 M6 8 L6 -6" stroke="#2c3035" stroke-width=".4"/><path d="M8 -2 L13 -5 L18 -3 L24 -9" stroke="#c0392b" stroke-width=".5" fill="none"/>`;
  /* Magnete, Ablage mit Stiften und Schwamm */
  for (const [x, y, f] of [[22, -17, "#c0392b"], [27, -17, "#2a6db3"]]) k += `<circle cx="${x}" cy="${y}" r="1.2" fill="${f}"/>`;
  k += `<rect x="-30" y="17" width="60" height="2" rx=".6" fill="#b9bec2"/>`;
  for (const [x, f] of [[-24, "#2a6db3"], [-19, "#c0392b"], [-14, "#2c3035"]]) k += `<rect x="${x}" y="15.8" width="4" height="1.3" rx=".6" fill="${f}"/>`;
  k += `<rect x="16" y="15" width="7" height="2.2" rx=".4" fill="#2c3035"/><rect x="16" y="14.6" width="7" height=".8" fill="#e5b912"/>`;
  S.teil({ id: "bu_whiteboard", de: "das Whiteboard", syl: "WEIT-bord", it: "la lavagna bianca", itSyl: "la-VA-gna BIAN-ca", en: "whiteboard", x: 262, y: 50, kunst: k,
    tipp: "Auf dem Whiteboard schreibt man mit Filzstift — und wischt es wieder weg." });
}

/* =====================================================================
   2b — DIE UHR über dem Aktenschrank
   ===================================================================== */
{
  let k = `<circle r="7" fill="#f4f4f1" stroke="#3a3f44" stroke-width="1"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(Math.sin(a) * 5.6)}" y1="${r(-Math.cos(a) * 5.6)}" x2="${r(Math.sin(a) * (i % 3 ? 5 : 4.4))}" y2="${r(-Math.cos(a) * (i % 3 ? 5 : 4.4))}" stroke="#2c3035" stroke-width="${i % 3 ? 0.3 : 0.6}"/>`; }
  k += `<line x1="0" y1="0" x2="${r(Math.sin(10.5 * Math.PI / 6) * 3.2)}" y2="${r(-Math.cos(10.5 * Math.PI / 6) * 3.2)}" stroke="#2c3035" stroke-width=".8" stroke-linecap="round"/><line x1="0" y1="0" x2="${r(Math.sin(Math.PI) * 4.6)}" y2="${r(-Math.cos(Math.PI) * 4.6)}" stroke="#2c3035" stroke-width=".5" stroke-linecap="round"/><circle r=".5" fill="#c0392b"/>`;
  S.teil({ id: "bu_uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: 34, y: 30, kunst: k,
    tipp: "Halb elf — gleich ist Mittagspause." });
}

/* =====================================================================
   3 — DER AKTENSCHRANK mit den ORDNERN (links an der Wand)
   ===================================================================== */
const AS = { x0: 4, x1: 64, oben: WAND_UNTEN - 2.0 * 33 };
{
  const W = AS.x1 - AS.x0, H = WAND_UNTEN - AS.oben;
  let k = schatten(0, 0, W / 2 + 2, 1.4, .3);
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" rx=".6" fill="${SCHRANK}"/>`;
  k += `<rect x="${-W / 2 - 0.6}" y="${-H - 1.2}" width="${W + 1.2}" height="2" rx=".4" fill="#c9cdd0"/>`;
  /* vier offene Fächer (oben), unten Schiebetüren */
  for (let i = 0; i < 4; i++) k += `<rect x="${-W / 2 + 2}" y="${-H + 2 + i * 12}" width="${W - 4}" height="11" fill="#b9bec2"/><rect x="${-W / 2 + 2}" y="${-H + 2 + i * 12 + 10.2}" width="${W - 4}" height=".8" fill="#9aa0a6"/>`;
  k += `<rect x="${-W / 2 + 1.4}" y="${-H + 51}" width="${W / 2 - 1.6}" height="${H - 54}" fill="${S.lg("tuer", [[0, "#f2f4f5"], [1, "#d6d9dc"]])}" stroke="#b9bec2" stroke-width=".3"/><rect x="0.2" y="${-H + 51}" width="${W / 2 - 1.6}" height="${H - 54}" fill="${S.lg("tuer2", [[0, "#f2f4f5"], [1, "#d6d9dc"]])}" stroke="#b9bec2" stroke-width=".3"/>`;
  k += `<rect x="-4" y="${-H + 56}" width="1.2" height="5" rx=".5" fill="#7d868d"/><rect x="2.8" y="${-H + 56}" width="1.2" height="5" rx=".5" fill="#7d868d"/><circle cx="0" cy="${-H + 54}" r=".8" fill="#9aa0a6"/>`;
  k += `<rect x="${-W / 2}" y="-1.6" width="${W}" height="1.6" fill="#7d868d"/>`;
  S.teil({ id: "aktenschrank", de: "der Aktenschrank", syl: "AK-ten-schrank", it: "l'archivio", itSyl: "ar-CHI-vio", en: "filing cabinet", x: (AS.x0 + AS.x1) / 2, y: WAND_UNTEN, steht: true, kunst: k,
    tipp: "Im Aktenschrank stehen die Ordner. Unten ist er abschließbar." });
}
{
  const W = AS.x1 - AS.x0, H = WAND_UNTEN - AS.oben;
  const farben = ["#c0392b", "#2a6db3", "#2f8f5b", "#e5b912", "#2c3035", "#7a4fa0", "#e98a2b", "#9aa0a6"];
  let k = "";
  for (let i = 0; i < 4; i++) {
    const y = -H + 2 + i * 12 + 10.2;
    let x = -W / 2 + 3;
    let n = 0;
    while (x < W / 2 - 6) {
      if (i === 1 && n === 4) { x += 4.4; n++; continue; }   /* eine Lücke: dieser Ordner fehlt */
      const f = farben[(i * 3 + n) % farben.length], b = 4.2;
      const schief = (i === 2 && n === 9) ? ` transform="rotate(-10 ${r(x + b)} ${r(y)})"` : "";
      k += `<g${schief}><rect x="${r(x)}" y="${r(y - 9.2)}" width="${b}" height="9.2" rx=".3" fill="${f}"/><rect x="${r(x + 0.6)}" y="${r(y - 7.6)}" width="${b - 1.2}" height="3.2" fill="#fff"/><circle cx="${r(x + b / 2)}" cy="${r(y - 2.4)}" r=".9" fill="#1d1f22" opacity=".55"/>`;
      k += `<rect x="${r(x)}" y="${r(y - 9.2)}" width=".5" height="9.2" fill="#fff" opacity=".25"/></g>`;
      x += b + 0.2; n++;
    }
  }
  S.teil({ id: "ordner", de: "der Ordner", syl: "ORD-ner", it: "il raccoglitore", itSyl: "rac-co-gli-TO-re", en: "ring binder", x: (AS.x0 + AS.x1) / 2, y: WAND_UNTEN, kunst: k,
    tipp: "Im Ordner werden Briefe und Rechnungen abgeheftet — vorher macht man mit dem Locher zwei Löcher." });
}

/* =====================================================================
   4 — SIDEBOARD rechts mit DRUCKER, LOCHER, TACKER
   ===================================================================== */
const SB = { x0: 232, x1: 316, oben: WAND_UNTEN - 0.75 * 33 };
{
  const W = SB.x1 - SB.x0, H = WAND_UNTEN - SB.oben;
  let k = schatten(0, 0, W / 2 + 2, 1.2, .25);
  k += `<path d="M${-W / 2 + 0.6} ${-H - 3.4} L${W / 2 - 0.6} ${-H - 3.4} L${W / 2} ${-H} L${-W / 2} ${-H} Z" fill="#f2f3f4"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H - 2}" fill="${S.lg("sb", [[0, "#b98a57"], [1, "#9a6c40"]])}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-W / 2 + 1 + i * (W - 2) / 3)}" y="${-H + 1}" width="${r((W - 2) / 3 - 0.8)}" height="${H - 4}" fill="none" stroke="#7a5230" stroke-width=".3"/><rect x="${r(-W / 2 + (i + 0.5) * (W - 2) / 3 - 3)}" y="${-H + 4}" width="6" height=".8" rx=".4" fill="#c9cdd0"/>`;
  k += `<rect x="${-W / 2 + 2}" y="-2" width="${W - 4}" height="2" fill="#2c3035"/>`;
  S.teil({ id: "bu_sideboard", de: "das Sideboard", syl: "SEID-bord", it: "la credenza", itSyl: "cre-DEN-za", en: "sideboard", x: (SB.x0 + SB.x1) / 2, y: WAND_UNTEN, steht: true, kunst: k });
}
{
  let k = schatten(0, 0, 11, 1, .3);
  k += `<rect x="-10" y="-11" width="20" height="11" rx="1" fill="${S.lg("drucker", [[0, "#f4f5f6"], [1, "#c9cdd0"]])}"/>`;
  k += `<rect x="-10.6" y="-14.4" width="21.2" height="3.6" rx=".8" fill="#e6e8ea"/><rect x="-8" y="-13.4" width="13" height="1.4" fill="#59616a" opacity=".4"/>`;
  k += `<rect x="4" y="-10" width="5.4" height="3" rx=".4" fill="#2c3035"/><rect x="4.4" y="-9.6" width="3" height="2.2" fill="#6fc7e8"/><circle cx="8.6" cy="-8.5" r=".6" fill="#3ca35a"/>`;
  k += `<rect x="-8" y="-6.6" width="11" height="1.2" fill="#2c3035"/><path d="M-7.4 -6.2 L2.4 -6.2 L3 -3.8 L-6.8 -3.8 Z" fill="#fff" stroke="#d6d9dc" stroke-width=".15"/>`;
  k += `<rect x="-9" y="-3" width="18" height="2.4" rx=".4" fill="#d6d9dc" stroke="#b9bec2" stroke-width=".2"/>`;
  k += `<rect x="12" y="-4" width="7" height="4" fill="#fff" stroke="#d6d9dc" stroke-width=".2"/><rect x="12" y="-4.6" width="7" height=".8" fill="#2a6db3"/>`;
  S.teil({ id: "drucker", de: "der Drucker", syl: "DRU-cker", it: "la stampante", itSyl: "stam-PAN-te", en: "printer", x: 254, y: SB.oben - 0.6, steht: true, kunst: k,
    tipp: "Der Drucker kann auch kopieren und scannen. Daneben liegt das Papier." });
}
{
  let k = schatten(0, 0, 4, .6, .25);
  k += `<rect x="-3.6" y="-2" width="7.2" height="2" rx=".5" fill="#2c3035"/><path d="M-3.2 -2 L-3 -4.4 Q-3 -5 -2.4 -5 L3 -4.6 L3.4 -2 Z" fill="#c0392b"/><rect x="-3" y="-5.8" width="6.6" height="1.2" rx=".6" fill="#2c3035"/>`;
  S.teil({ oben: true, id: "locher", de: "der Locher", syl: "LO-cher", it: "la perforatrice", itSyl: "per-fo-ra-TRI-ce", en: "hole punch", x: 282, y: SB.oben - 0.6, steht: true, kunst: k,
    tipp: "Der Locher macht zwei Löcher ins Papier — genau passend für den Ordner." });
}
{
  let k = schatten(0, 0, 4, .5, .25);
  k += `<path d="M-4 0 L4 0 L4 -1.2 L-4 -1.2 Z" fill="#2c3035"/><path d="M-4 -1.4 L3.6 -1.8 Q4.4 -2 4.2 -2.8 L-3.6 -2.8 Q-4.2 -2.2 -4 -1.4 Z" fill="#2a6db3"/><rect x="-3.8" y="-3.4" width="7.6" height=".8" rx=".4" fill="${STAHL}"/>`;
  S.teil({ oben: true, id: "tacker", de: "der Tacker", syl: "TA-cker", it: "la cucitrice", itSyl: "cu-ci-TRI-ce", en: "stapler", x: 293, y: SB.oben - 0.6, steht: true, kunst: k });
}
{
  /* Papierstapel und Ablagekörbe (nur Bild, auf dem Sideboard) */
  let k = schatten(0, 0, 6, .6, .2);
  for (let i = 0; i < 3; i++) k += `<path d="M-6 ${-i * 3.4} L6 ${-i * 3.4} L6 ${-i * 3.4 - 2.6} L-6 ${-i * 3.4 - 2.6} Z" fill="#2c3035" opacity=".85"/><rect x="-5.4" y="${-i * 3.4 - 2.4}" width="10.8" height="1.6" fill="#fff"/>`;
  S.teil({ oben: true, id: "bu_ablage", de: "die Ablage", syl: "AB-la-ge", it: "il vassoio portacarte", itSyl: "vas-SO-io por-ta-CAR-te", en: "letter tray", x: 306, y: SB.oben - 0.6, steht: true, kunst: k,
    tipp: "In der Ablage liegen die Briefe, die noch bearbeitet werden." });
}

/* =====================================================================
   5 — DER SCHREIBTISCH (vor dem Fenster) — Lupe mit den kleinen Dingen
   ===================================================================== */
const ST = { x0: 112, x1: 226, vorne: 138, hinten: 126 };
const sV = M(ST.vorne), sH = M(ST.hinten);
const PL = { v: ST.vorne - 0.75 * sV, h: ST.hinten - 0.75 * sH };   /* Plattenkanten (y) */
{
  const cx = (ST.x0 + ST.x1) / 2, W = ST.x1 - ST.x0;
  const y = (v) => r(v - ST.vorne);
  let k = schatten(0, 0, W / 2 + 4, 2, .25);
  /* T-Füße (anthrazit) mit Hubsäulen */
  for (const x of [-W / 2 + 10, W / 2 - 10]) {
    k += `<rect x="${x - 1.6}" y="${y(PL.v + 2.6)}" width="3.2" height="${r(ST.vorne - PL.v - 4)}" fill="${ANTH}"/>`;
    k += `<path d="M${x - 1.6} ${y(PL.h + 2)} L${x + 1.6} ${y(PL.h + 2)} L${x + 1.6} ${y(PL.v + 4)} L${x - 1.6} ${y(PL.v + 4)} Z" fill="#3a3f44"/>`;
    k += `<rect x="${x - 2.2}" y="-2" width="4.4" height="2" rx=".6" fill="#2c3035"/>`;
  }
  k += `<rect x="${-W / 2 + 10}" y="${y(PL.v + 3)}" width="${W - 20}" height="2" fill="#3a3f44"/>`;
  /* Platte: Oberseite in die Tiefe, weiße Kante */
  k += `<path d="M${-W / 2} ${y(PL.v)} L${W / 2} ${y(PL.v)} L${W / 2 - 3} ${y(PL.h)} L${-W / 2 + 3} ${y(PL.h)} Z" fill="${S.lg("platte", [[0, "#eceeef"], [1, "#fafafa"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${y(PL.v)}" width="${W}" height="2" fill="#d6d9dc"/><rect x="${-W / 2}" y="${y(PL.v)}" width="${W}" height=".5" fill="#fff"/>`;
  /* Bedienteil für die Höhe */
  k += `<rect x="${W / 2 - 16}" y="${y(PL.v + 2)}" width="6" height="1.6" rx=".4" fill="#2c3035"/>`;
  /* Kabelwanne unter der Platte */
  k += `<rect x="${-W / 2 + 20}" y="${y(PL.v + 2)}" width="${W - 40}" height="2.2" fill="#59616a" opacity=".8"/>`;
  /* ---- die kleinen Dinge auf dem Tisch (werden in der Lupe einzeln anwählbar) ---- */
  const unter = [];
  const auf = PL.v - 1.6;   /* Standlinie vorn auf der Platte */
  const X = (x) => r(x - cx), Y = (v) => r(v - ST.vorne);
  /* Tastatur */
  k += `<path d="M${X(158)} ${Y(auf)} L${X(184)} ${Y(auf)} L${X(183)} ${Y(auf - 3.6)} L${X(159)} ${Y(auf - 3.6)} Z" fill="#2c3035"/>`;
  for (let row = 0; row < 3; row++) for (let i = 0; i < 12; i++) k += `<rect x="${r(X(160 + i * 1.95 - row * 0.15))}" y="${r(Y(auf - 3.1 + row * 1))}" width="1.5" height=".7" rx=".15" fill="#5a6067"/>`;
  k += `<rect x="${X(166)}" y="${r(Y(auf - 0.6))}" width="10" height=".6" rx=".2" fill="#5a6067"/>`;
  unter.push({ id: "tastatur", de: "die Tastatur", syl: "Tas-ta-TUR", it: "la tastiera", itSyl: "ta-STIE-ra", en: "keyboard", x: 171, y: auf + 0.4, kunst: flaeche(-13.5, -5, 27, 5.6) });
  /* Mauspad und Maus */
  k += `<ellipse cx="${X(192)}" cy="${Y(auf - 1.4)}" rx="5" ry="2" fill="#3a5f8a"/><ellipse cx="${X(192.6)}" cy="${Y(auf - 1.8)}" rx="1.5" ry="1.1" fill="${S.lg("maus", [[0, "#ffffff"], [1, "#b9bec2"]])}"/><line x1="${X(192.6)}" y1="${r(Y(auf - 2.8))}" x2="${X(192.6)}" y2="${r(Y(auf - 2))}" stroke="#9aa0a6" stroke-width=".15"/>`;
  k += `<path d="M${X(192.6)} ${r(Y(auf - 2.9))} Q${X(190)} ${r(Y(auf - 4))} ${X(186)} ${r(Y(auf - 4.4))}" stroke="#2c3035" stroke-width=".2" fill="none"/>`;
  unter.push({ id: "maus", de: "die Maus", syl: "MAUS", it: "il mouse", itSyl: "MOU-se", en: "mouse", x: 192, y: auf + 0.4, kunst: flaeche(-4.6, -4.4, 9.2, 4.8), tipp: "Die Computermaus — nicht das Tier." });
  /* Telefon (links) */
  k += `<path d="M${X(143)} ${Y(auf)} L${X(153)} ${Y(auf)} L${X(152)} ${Y(auf - 4.6)} L${X(144)} ${Y(auf - 4.6)} Z" fill="#2c3035"/><rect x="${X(146.4)}" y="${r(Y(auf - 4.2))}" width="5" height="1.6" fill="#7fc4e0"/>`;
  for (let i = 0; i < 9; i++) k += `<rect x="${r(X(146.6 + (i % 3) * 1.6))}" y="${r(Y(auf - 2.3 + Math.floor(i / 3) * 0.7))}" width="1.1" height=".45" fill="#9aa0a6"/>`;
  k += `<path d="M${X(143.4)} ${r(Y(auf - 4.4))} Q${X(143)} ${r(Y(auf - 6.6))} ${X(144.4)} ${r(Y(auf - 6.4))} L${X(145.6)} ${r(Y(auf - 6.2))} L${X(145.6)} ${r(Y(auf - 1))} L${X(144.4)} ${r(Y(auf - 0.8))} Q${X(143)} ${r(Y(auf - 1))} ${X(143.4)} ${r(Y(auf - 2.4))} Z" fill="#3a3f44"/>`;
  unter.push({ id: "telefon", de: "das Telefon", syl: "Te-le-FON", it: "il telefono", itSyl: "te-LE-fo-no", en: "telephone", x: 148, y: auf + 0.4, kunst: flaeche(-5.6, -7, 11.2, 7.4) });
  /* Notizblock und Kugelschreiber */
  k += `<path d="M${X(198)} ${Y(auf - 0.4)} L${X(207)} ${Y(auf - 0.4)} L${X(206.4)} ${Y(auf - 3.8)} L${X(198.6)} ${Y(auf - 3.8)} Z" fill="#fff59a"/>`;
  for (let i = 0; i < 3; i++) k += `<line x1="${X(199.4)}" y1="${r(Y(auf - 3 + i * 0.8))}" x2="${X(205.4)}" y2="${r(Y(auf - 3 + i * 0.8))}" stroke="#8a8f94" stroke-width=".18"/>`;
  k += `<path d="M${X(199)} ${r(Y(auf - 0.2))} L${X(207.6)} ${r(Y(auf - 2.4))}" stroke="#2a6db3" stroke-width=".6" stroke-linecap="round"/>`;
  unter.push({ id: "bu_kuli", de: "der Kugelschreiber", syl: "KU-gel-schrei-ber", it: "la penna a sfera", itSyl: "PEN-na a SFE-ra", en: "ballpoint pen", x: 202.6, y: auf + 0.4, kunst: flaeche(-5, -4.6, 10, 5),
    tipp: "Kurz sagt man einfach „Kuli“." });
  /* Kaffeetasse */
  k += `<path d="M${X(211)} ${Y(auf - 0.6)} L${X(215)} ${Y(auf - 0.6)} L${X(215.2)} ${Y(auf - 5)} L${X(210.8)} ${Y(auf - 5)} Z" fill="${S.lg("tasse", [[0, "#ffffff"], [1, "#d6d9dc"]], 0, 0, 1, 0)}"/><ellipse cx="${X(213)}" cy="${Y(auf - 5)}" rx="2.2" ry=".6" fill="#5a3a22"/>`;
  k += `<path d="M${X(215.1)} ${r(Y(auf - 4.2))} q1.6 .4 1.2 1.6 q-.3 .8 -1.2 .6" stroke="#e6e8ea" stroke-width=".6" fill="none"/><rect x="${X(211.4)}" y="${r(Y(auf - 3.6))}" width="3.2" height="1.4" fill="#c0392b"/>`;
  k += `<path d="M${X(212.4)} ${r(Y(auf - 5.8))} q-.8 -1.4 0 -2.6 q.8 -1.2 0 -2.4" stroke="#fff" stroke-width=".4" opacity=".7" fill="none"/>`;
  unter.push({ id: "kaffeetasse", de: "die Kaffeetasse", syl: "KAF-fee-tas-se", it: "la tazza", itSyl: "TAZ-za", en: "coffee cup", x: 213.4, y: auf + 0.4, kunst: flaeche(-3.6, -7.6, 7.2, 8) });
  /* Büroklammern in einer Schale */
  k += `<ellipse cx="${X(220)}" cy="${Y(auf - 1)}" rx="2.6" ry="1" fill="#59616a"/><ellipse cx="${X(220)}" cy="${Y(auf - 1.3)}" rx="2.2" ry=".7" fill="#2c3035"/>`;
  for (let i = 0; i < 5; i++) k += `<rect x="${r(X(218.4 + i * 0.7))}" y="${r(Y(auf - 1.6 - (i % 2) * 0.3))}" width="1" height=".45" rx=".2" fill="none" stroke="#d9dee2" stroke-width=".15"/>`;
  unter.push({ id: "bueroklammer", de: "die Büroklammer", syl: "Bü-RO-klam-mer", it: "la graffetta", itSyl: "graf-FET-ta", en: "paper clip", x: 220, y: auf + 0.4, kunst: flaeche(-3, -3.4, 6, 3.8), tipp: "Vier Millimeter breit — das kleinste Ding im Raum." });
  S.teil({ id: "schreibtisch", de: "der Schreibtisch", syl: "SCHREIB-tisch", it: "la scrivania", itSyl: "scri-va-NI-a", en: "desk", x: cx, y: ST.vorne, steht: true, kunst: k,
    zoom: { x: 140, y: auf - 22, w: 86, h: 57 },
    unter,
    tipp: "Der Schreibtisch lässt sich elektrisch hoch- und runterfahren — man kann auch im Stehen arbeiten." });
}
{
  /* DER COMPUTER — Turm unter dem Tisch rechts */
  let k = schatten(0, 0, 6, 1, .3);
  k += `<rect x="-4.4" y="-17" width="8.8" height="17" rx=".8" fill="${S.lg("pc", [[0, "#3a3f44"], [1, "#1d2125"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-3.4" y="-15.6" width="6.8" height="1.2" rx=".4" fill="#59616a"/><circle cx="2" cy="-12.6" r=".8" fill="#6fc7e8"/><rect x="-3" y="-11" width="2" height=".6" fill="#59616a"/><rect x="-3" y="-10" width="2" height=".6" fill="#59616a"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="-3" y="${-7 + i}" width="6" height=".35" fill="#2c3035"/>`;
  k += `<rect x="-4.4" y="-17" width="1" height="17" fill="#fff" opacity=".12"/>`;
  S.teil({ id: "computer", de: "der Computer", syl: "Com-PU-ter", it: "il computer", itSyl: "com-PU-ter", en: "computer", x: 210, y: 134, steht: true, kunst: k,
    tipp: "Der Computer steht unter dem Tisch, der Bildschirm oben drauf." });
}
{
  /* DER BILDSCHIRM — 27 Zoll, auf dem Standfuß hinten auf der Platte */
  let k = schatten(0, 0, 6, .6, .3);
  k += `<path d="M-5 0 L5 0 L4 -1.2 L-4 -1.2 Z" fill="#2c3035"/><rect x="-1.2" y="-8" width="2.4" height="7" fill="#3a3f44"/>`;
  k += `<rect x="-14" y="-24.4" width="28" height="17" rx=".8" fill="#1d2125"/>`;
  k += `<rect x="-13" y="-23.4" width="26" height="14.6" fill="${S.lg("desktop", [[0, "#e9f3fa"], [1, "#cfe2ef"]])}"/>`;
  /* Tabellenkalkulation und E-Mail-Fenster */
  k += `<rect x="-13" y="-23.4" width="26" height="1.6" fill="#2a6db3"/><rect x="-12.4" y="-21.2" width="14" height="11.8" fill="#fff"/>`;
  for (let i = 0; i < 7; i++) k += `<line x1="-12.4" y1="${r(-19.6 + i * 1.6)}" x2="1.6" y2="${r(-19.6 + i * 1.6)}" stroke="#c9d6df" stroke-width=".15"/>`;
  for (let j = 0; j < 4; j++) k += `<line x1="${r(-9 + j * 3.4)}" y1="-21.2" x2="${r(-9 + j * 3.4)}" y2="-9.4" stroke="#c9d6df" stroke-width=".15"/>`;
  k += `<rect x="-12.4" y="-21.2" width="14" height="1.4" fill="#2f8f5b" opacity=".75"/>`;
  k += `<rect x="2.6" y="-21.2" width="9.8" height="11.8" fill="#fff"/><rect x="2.6" y="-21.2" width="9.8" height="1.4" fill="#2a6db3"/>`;
  for (let i = 0; i < 5; i++) k += `<rect x="3.4" y="${r(-18.8 + i * 1.8)}" width="${8 - (i % 2) * 2}" height=".6" fill="#9aa0a6"/>`;
  k += `<path d="M-13 -23.4 L-5 -23.4 L-13 -12 Z" fill="#fff" opacity=".14"/>`;
  k += `<circle cx="0" cy="-8" r=".3" fill="#6fc7e8"/>`;
  S.teil({ oben: true, id: "bildschirm", de: "der Bildschirm", syl: "BILD-schirm", it: "lo schermo", itSyl: "SCHER-mo", en: "screen", x: 178, y: PL.h + 3.4, steht: true, kunst: k,
    tipp: "Der Bildschirm steht eine Armlänge entfernt — das schont die Augen." });
}
{
  /* DIE LAMPE — Schreibtischleuchte mit Gelenkarm, hinten links */
  let k = schatten(0, 0, 4, .5, .3);
  k += `<ellipse cx="0" cy="-.6" rx="3.6" ry="1" fill="#2c3035"/>`;
  k += `<path d="M0 -1 L5 -14 L-1 -24" stroke="#2c3035" stroke-width=".9" fill="none" stroke-linecap="round"/><circle cx="5" cy="-14" r=".8" fill="#59616a"/>`;
  k += `<path d="M-1 -24 L-7 -21 L-5 -18 Z" fill="#2c3035"/><path d="M-7.4 -21 L-4.6 -17.6" stroke="#fff6c8" stroke-width=".9"/>`;
  k += `<path d="M-6 -19 L-12 -6 L-1 -6 L-4.6 -18 Z" fill="#fff6c8" opacity=".18" pointer-events="none"/>`;
  S.teil({ oben: true, id: "schreibtischlampe", de: "die Lampe", syl: "LAM-pe", it: "la lampada", itSyl: "LAM-pa-da", en: "lamp", x: 126, y: PL.h + 4.6, steht: true, kunst: k });
}

/* =====================================================================
   6 — DER BÜROSTUHL und DIE SACHBEARBEITERIN (dreht sich zum Kollegen)
   ===================================================================== */
const STUHL = { x: 136, y: 156 };
{
  const s = M(STUHL.y);
  const m = B.mensch({ id: "bu_frau", geschlecht: "w", pose: "sitzen", blick: -48, frisur: "dutt", haarfarbe: "dunkelbraun", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#e9dfd0" }, jacke: { stueck: "jacke", farbe: "#2f4a66" }, unterteil: { stueck: "hose", farbe: "#2c3035" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "brille" } } }, 1.66 * s);
  const sitzY = STUHL.y + m.z.sitz.y * m.k, sitzX = STUHL.x + m.z.sitz.x * m.k;
  /* Stuhl: Fünfsternfuß mit Rollen, Gasfeder, Sitz, Netzrücken (hinter ihr, rechts sichtbar), Armlehne */
  let st = "";
  const fuss = [[-12, 0.6], [-6, 2], [6, 2], [12, 0.6], [0, -1.4]];
  for (const [dx, dy] of fuss) st += `<path d="M0 -3 L${dx} ${dy - 1.4}" stroke="#2c3035" stroke-width="1.6" stroke-linecap="round"/><circle cx="${dx}" cy="${dy - 0.4}" r="1.3" fill="#1d2125"/>`;
  st += `<rect x="-1" y="${r(sitzY - STUHL.y + 2)}" width="2" height="${r(STUHL.y - sitzY - 5)}" fill="${STAHL}"/>`;
  st += `<rect x="-1.6" y="-8" width="3.2" height="5" rx=".6" fill="#2c3035"/>`;
  /* Rückenlehne (Netz) hinter ihr */
  S.def(`<pattern id="${S.id("netz")}" width="1.2" height="1.2" patternUnits="userSpaceOnUse"><rect width="1.2" height="1.2" fill="#2c3035"/><path d="M0 0 L1.2 1.2 M1.2 0 L0 1.2" stroke="#4a4f55" stroke-width=".25"/></pattern>`);
  const ry = sitzY - STUHL.y;
  st += `<path d="M6 ${r(ry - 1)} L5 ${r(ry - 10)} Q4.6 ${r(ry - 23)} 10 ${r(ry - 25)} Q16 ${r(ry - 24)} 15 ${r(ry - 10)} L13.4 ${r(ry - 1)} Z" fill="url(#${S.id("netz")})" stroke="#1d2125" stroke-width=".9"/>`;
  st += `<path d="M9.4 ${r(ry - 1)} L9.6 ${r(ry + 3)}" stroke="#2c3035" stroke-width="1.6"/>`;
  /* Sitzfläche */
  st += `<path d="M-11 ${r(ry + 0.6)} Q-11 ${r(ry - 2.6)} -6 ${r(ry - 2.8)} L10 ${r(ry - 2.8)} Q14 ${r(ry - 2.6)} 14 ${r(ry + 0.6)} Q14 ${r(ry + 3)} 9 ${r(ry + 3)} L-7 ${r(ry + 3)} Q-11 ${r(ry + 3)} -11 ${r(ry + 0.6)} Z" fill="${ANTH}"/>`;
  /* Armlehne rechts (vorne sichtbar) */
  st += `<path d="M12 ${r(ry + 1)} L12.6 ${r(ry - 7)} L17 ${r(ry - 7.6)}" stroke="#1d2125" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
  S.teil({ id: "buerostuhl", de: "der Bürostuhl", syl: "Bü-RO-stuhl", it: "la sedia da ufficio", itSyl: "SE-dia da uf-FI-cio", en: "office chair", x: sitzX, y: STUHL.y, kunst: st,
    tipp: "Der Bürostuhl hat fünf Rollen und dreht sich — Sitzhöhe und Lehne kann man einstellen." });
  S.teil({ id: "sachbearbeiterin", de: "die Sachbearbeiterin", syl: "SACH-be-ar-bei-te-rin", it: "l'impiegata", itSyl: "im-pie-GA-ta", en: "clerk", x: STUHL.x, y: STUHL.y, kunst: m.svg,
    tipp: "Sie dreht sich auf dem Stuhl um und fragt: „Suchst du den Ordner ‚Rechnungen‘?“" });
}

/* =====================================================================
   7 — DER KOLLEGE (sucht einen Ordner)
   ===================================================================== */
{
  const y = 152, s = M(y);
  const m = B.mensch({ id: "bu_kollege", geschlecht: "m", pose: "halten", blick: -28, frisur: "kurz", haarfarbe: "schwarz", haut: "dunkel",
    kleidung: { oberteil: { stueck: "hemd", farbe: "hellblau" }, unterteil: { stueck: "anzughose", farbe: "#3a3f44" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.82 * s);
  /* er hält den grauen Ordner, der im zweiten Fach fehlt, und blättert darin */
  const hs = [m.z.handL, m.z.handR].filter(Boolean);
  const hx = hs.reduce((a, h) => a + h.x, 0) / hs.length * m.k, hy = Math.min(...hs.map((h) => h.y)) * m.k;
  const ordner = `<g transform="translate(${r(hx)} ${r(hy - 1.4)})"><path d="M-7.4 -2 L0 -3.2 L0 4.4 L-7.4 5 Z" fill="#9aa0a6"/><path d="M0 -3.2 L7.4 -2 L7.4 5 L0 4.4 Z" fill="#8a9096"/><path d="M-6.6 -1.4 L-.4 -2.4 L-.4 3.8 L-6.6 4.2 Z" fill="#fff"/><path d="M.4 -2.4 L6.6 -1.4 L6.6 4.2 L.4 3.8 Z" fill="#fbfbf8"/>${[0, 1, 2].map((i) => `<line x1="-5.6" y1="${r(-0.4 + i * 1.3)}" x2="-1.4" y2="${r(-1 + i * 1.3)}" stroke="#9aa0a6" stroke-width=".2"/><line x1="1.4" y1="${r(-1 + i * 1.3)}" x2="5.6" y2="${r(-0.4 + i * 1.3)}" stroke="#9aa0a6" stroke-width=".2"/>`).join("")}<circle cx="-.2" cy="-.6" r=".35" fill="#59616a"/><circle cx="-.2" cy="2.2" r=".35" fill="#59616a"/></g>`;
  S.teil({ id: "kollege", de: "der Kollege", syl: "Kol-LE-ge", it: "il collega", itSyl: "col-LE-ga", en: "colleague", x: 84, y, kunst: m.svg + ordner,
    tipp: "Er hat im Aktenschrank gesucht und den grauen Ordner gefunden." });
}

/* =====================================================================
   8 — DER PAPIERKORB und DIE PFLANZE
   ===================================================================== */
{
  let k = schatten(0, 0, 6, 1, .3);
  k += `<path d="M-5.4 -15 L5.4 -15 L4.4 0 L-4.4 0 Z" fill="${S.lg("korb", [[0, "#5a6067"], [1, "#3a3f44"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 6; i++) k += `<line x1="${r(-4.6 + i * 1.8)}" y1="-14.4" x2="${r(-3.8 + i * 1.5)}" y2="-.6" stroke="#2c3035" stroke-width=".35"/>`;
  k += `<ellipse cx="0" cy="-15" rx="5.4" ry="1.2" fill="#2c3035"/><path d="M-2.6 -15.6 q1.4 -2.4 3.4 -.8 q1.8 -1.4 2.2 .8" fill="#f4f4f1" stroke="#d6d9dc" stroke-width=".2"/>`;
  S.teil({ id: "papierkorb", de: "der Papierkorb", syl: "Pa-PIER-korb", it: "il cestino", itSyl: "ce-STI-no", en: "waste bin", x: 236, y: 150, steht: true, kunst: k,
    tipp: "Altpapier kommt in den Papierkorb — und später in die blaue Tonne." });
}
{
  /* Monstera im Übertopf, vorne rechts */
  let k = schatten(0, 0, 13, 2, .3);
  k += `<path d="M-10 -16 L10 -16 L8.4 0 L-8.4 0 Z" fill="${S.lg("topf", [[0, "#f4f4f1"], [0.6, "#dcdcd6"], [1, "#b9b9b2"]], 0, 0, 1, 0)}"/><ellipse cx="0" cy="-16" rx="10" ry="2.2" fill="#e6e6e1"/><ellipse cx="0" cy="-16" rx="8.6" ry="1.6" fill="#5a3f2a"/>`;
  const blatt = (x, y, sx, rot, f) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sx})"><path d="M0 0 C-7 -2 -10 -10 -6 -16 C-3 -20 3 -20 6 -16 C10 -10 7 -2 0 0 Z" fill="${f}"/><path d="M0 0 L0 -17" stroke="#2f5a35" stroke-width=".4"/><path d="M0 -5 L-6 -9 M0 -5 L6 -9 M0 -10 L-5 -14 M0 -10 L5 -14" stroke="#2f5a35" stroke-width=".35" opacity=".8"/><path d="M-1 -1 Q-5 -4 -6 -10" stroke="#fff" stroke-width=".4" opacity=".2" fill="none"/></g>`;
  const stiel = (x1, y1) => `<path d="M0 -16 Q${r(x1 * 0.4)} ${r((y1 - 16) * 0.6)} ${x1} ${y1}" stroke="#4f7a3a" stroke-width=".8" fill="none"/>`;
  for (const [x, y, sc, rot, f] of [[-12, -44, 1.05, -40, "#3f7a3a"], [10, -50, 1.1, 30, "#4f8a46"], [-2, -58, 1, -6, "#447f3e"], [-16, -30, .85, -70, "#5a9450"], [15, -32, .85, 62, "#3f7a3a"], [3, -38, .8, 14, "#5a9450"]]) k += stiel(x, y) + blatt(x, y, sc, rot, f);
  S.teil({ id: "bu_pflanze", de: "die Pflanze", syl: "PFLAN-ze", it: "la pianta", itSyl: "PIAN-ta", en: "plant", x: 296, y: 197, steht: true, kunst: `<g transform="scale(.78)">${k}</g>`,
    tipp: "Pflanzen im Büro machen die Luft besser — und sehen schön aus." });
}

S.davor(`<rect x="0" y="0" width="320" height="200" fill="${S.rg("tageslicht", [[0, "#fffdf2", 0.08], [1, "#fffdf2", 0]], 0.52, 0.2, 0.7)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/buero.js"));
console.log(aus);
