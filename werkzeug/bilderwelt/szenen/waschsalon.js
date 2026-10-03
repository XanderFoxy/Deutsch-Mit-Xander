#!/usr/bin/env node
/* =====================================================================
   DER WASCHSALON (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Berliner Waschsalons im tip Berlin, Kassenautomat
   „LaundryPoint“ von Suzohapp, Waschsalon-Umbau im Nordkurier):
   - Ein SB-Waschsalon: eine Reihe gewerblicher WASCHMASCHINEN aus
     Edelstahl (große Bullaugen, Nummern über der Tür) auf einem Sockel,
     daneben die TROCKNER, oft zwei übereinander gestapelt.
   - Bezahlt wird zentral am KASSENAUTOMATEN: Maschinennummer wählen,
     mit Münzen oder Karte zahlen, die Maschine startet. Waschmittel
     gibt es am WASCHMITTELAUTOMATEN (kleine Päckchen).
   - In der Mitte ein TISCH zum Zusammenlegen der Wäsche, an der Wand
     PREISLISTE und HINWEISSCHILDER („Flusensieb reinigen“),
     eine UHR, eine SITZBANK am SCHAUFENSTER zum Warten.
   - Typisch: Schachbrett- oder Terrazzoboden, Leuchtstoffröhren,
     kräftige Hausfarbe an der Wand.
   Maßstab (Augenhöhe 1,6 m, Fluchtpunkt 160/80): Rückwand ≈ 44
   Einheiten je Meter (Wandfuß y 150), vorne (y 200) ≈ 75.
   Maschinen 1,0 m, Trockner zusammen 1,9 m, Tisch 0,9 m, Kundin 1,65 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "waschsalon", titel: "Der Waschsalon", emoji: "🧺", thema: "Alltag", kuerzel: "b15d", fassung: 852 });
const rnd = zufall(6620);
const r = B.r;

const WAND_UNTEN = 150, DECKE = 16;
const VP = { x: 160, y: 80 };
const M = (y) => 44 * (y - VP.y) / (WAND_UNTEN - VP.y);
const SW = 44;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const EDEL = S.lg("edel", [[0, "#eef0f2"], [0.3, "#c9ced2"], [0.55, "#e3e6e9"], [0.8, "#b5bcc1"], [1, "#d6dadd"]], 0, 0, 1, 0);
const EDEL_V = S.lg("edelv", [[0, "#f2f4f5"], [1, "#c3c8cc"]]);
const DUNKEL = S.lg("dunkel", [[0, "#3a3f44"], [1, "#1b1e21"]]);
const TUERKIS = "#1f8a8a";

/* =====================================================================
   KULISSE — Decke mit Leuchtstoffröhren, türkise Wand mit weißem
   Fliesensockel, Schachbrettboden
   ===================================================================== */
const FEN = { x0: 4, x1: 60, y0: 30, y1: WAND_UNTEN - 0.6 * SW };
{
  let k = `<rect x="0" y="0" width="320" height="${DECKE}" fill="${S.lg("decke", [[0, "#e9e9e6"], [1, "#dcdcd8"]])}"/>`;
  for (const x of [40, 130, 220, 300]) k += `<rect x="${x - 20}" y="5" width="40" height="3.6" rx="1.4" fill="#f6f6f3" stroke="#d2d2cd" stroke-width=".3"/><rect x="${x - 18}" y="6.2" width="36" height="1.2" rx=".6" fill="#ffffff"/>`;
  k += `<rect x="0" y="${DECKE}" width="320" height="${WAND_UNTEN - DECKE}" fill="${S.lg("wand", [[0, "#2aa3a1"], [1, "#1f8a8a"]])}"/>`;
  k += `<rect x="0" y="${DECKE}" width="320" height="${WAND_UNTEN - DECKE}" fill="${S.rg("wandlicht", [[0, "#ffffff", 0.22], [1, "#ffffff", 0]], 0.5, 0.1, 0.7)}"/>`;
  /* Fliesensockel bis 1,2 m, weiß */
  const ys = WAND_UNTEN - 1.2 * SW;
  S.def(`<pattern id="${S.id("fl")}" width="6.6" height="6.6" patternUnits="userSpaceOnUse" y="${r(ys)}"><rect width="6.6" height="6.6" fill="#d9dcdc"/><rect x=".25" y=".25" width="6.1" height="6.1" rx=".3" fill="#f6f7f6"/></pattern>`);
  k += `<rect x="0" y="${r(ys)}" width="320" height="${r(WAND_UNTEN - ys)}" fill="url(#${S.id("fl")})"/>`;
  k += `<rect x="0" y="${r(ys - 1.4)}" width="320" height="1.6" fill="#f2c230"/>`;
  /* Hausname als Wandschrift */
  k += `<text x="120" y="${DECKE + 13}" font-size="9" text-anchor="middle" fill="#f2c230" font-family="'Arial Rounded MT Bold',Arial,sans-serif" font-weight="bold" letter-spacing="1">WASCH·BAR</text>`;
  k += `<text x="120" y="${DECKE + 18}" font-size="2.8" text-anchor="middle" fill="#e8f6f5" font-family="Arial" letter-spacing=".8">SB-WASCHSALON · TÄGLICH 6–23 UHR</text>`;
  /* Schachbrettboden in Fluchtperspektive */
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="#ecebe6"/>`;
  /* Zeilen: gleiche Tiefe 30 cm → y = VP + 70·D/(D−d), D = 7 m */
  const yz = (d) => VP.y + (WAND_UNTEN - VP.y) * 7 / (7 - d);
  let fl = "";
  for (let j = 0; ; j++) {
    const y0 = yz(j * 0.3), y1 = Math.min(200, yz((j + 1) * 0.3));
    if (y0 >= 200) break;
    for (let i = -16; i < 16; i++) {
      if ((i + j) % 2 === 0) continue;
      const xb0 = VP.x + i * 0.3 * SW, xb1 = VP.x + (i + 1) * 0.3 * SW;
      const f0 = (y0 - VP.y) / (WAND_UNTEN - VP.y), f1 = (y1 - VP.y) / (WAND_UNTEN - VP.y);
      fl += `M${r(VP.x + (xb0 - VP.x) * f0)} ${r(y0)}L${r(VP.x + (xb1 - VP.x) * f0)} ${r(y0)}L${r(VP.x + (xb1 - VP.x) * f1)} ${r(y1)}L${r(VP.x + (xb0 - VP.x) * f1)} ${r(y1)}Z`;
    }
  }
  k += `<path d="${fl}" fill="#2b2f33"/>`;
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.12], [0.4, "#000", 0], [1, "#fff", 0.08]])}"/>`;
  k += `<rect x="0" y="${WAND_UNTEN - 1}" width="320" height="1.6" fill="#9aa0a3"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DAS SCHAUFENSTER (links, zur Straße), 2 — DIE SITZBANK davor,
   3 — DIE ZEITUNG, 4 — DER WARTENDE
   ===================================================================== */
{
  let k = `<rect x="-2" y="-2" width="${FEN.x1 - FEN.x0 + 4}" height="${FEN.y1 - FEN.y0 + 4}" fill="#3d4247"/>`;
  k += `<rect x="0" y="0" width="${FEN.x1 - FEN.x0}" height="${FEN.y1 - FEN.y0}" fill="${S.lg("strasse", [[0, "#b7d9ee"], [0.45, "#dfeef6"], [0.46, "#c9b79c"], [1, "#a69680"]])}"/>`;
  /* Haus gegenüber, Fahrrad, Baum */
  k += `<rect x="4" y="10" width="36" height="34" fill="#d8c3a3"/>`;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) k += `<rect x="${7 + i * 11}" y="${14 + j * 13}" width="6" height="8" fill="#8fa9b9"/>`;
  k += `<rect x="0" y="${r(FEN.y1 - FEN.y0 - 30)}" width="${FEN.x1 - FEN.x0}" height="2" fill="#8d8273"/>`;
  k += `<circle cx="47" cy="22" r="8" fill="#6f9a55"/><circle cx="42" cy="27" r="6" fill="#5b8746"/><rect x="45.6" y="28" width="2" height="18" fill="#6a4a2a"/>`;
  /* Schrift auf dem Glas (von innen spiegelverkehrt) */
  k += `<text x="${(FEN.x1 - FEN.x0) / 2}" y="9" font-size="5" text-anchor="middle" fill="#f2c230" font-family="Arial" font-weight="bold" transform="scale(-1 1) translate(${-(FEN.x1 - FEN.x0)} 0)">WASCHSALON</text>`;
  k += `<path d="M2 ${r(FEN.y1 - FEN.y0 - 2)} L18 2 L26 2 L10 ${r(FEN.y1 - FEN.y0 - 2)} Z" fill="#fff" opacity=".2"/>`;
  k += `<rect x="${(FEN.x1 - FEN.x0) / 2 - 1}" y="0" width="2" height="${FEN.y1 - FEN.y0}" fill="#3d4247"/>`;
  k += `<rect x="-3" y="${FEN.y1 - FEN.y0 + 1}" width="${FEN.x1 - FEN.x0 + 6}" height="2.4" fill="#c9cdcf"/>`;
  S.teil({ id: "schaufenster", de: "das Schaufenster", syl: "SCHAU-fens-ter", it: "la vetrina", itSyl: "ve-TRI-na", en: "shop window",
    x: FEN.x0, y: FEN.y0, kunst: k });
}
const BANK = { x0: 6, x1: 60, y: 160 };
const SITZ_Y = BANK.y - 0.45 * M(BANK.y);
{
  const s = M(BANK.y), W = BANK.x1 - BANK.x0;
  let k = schatten(0, 0, 28, 1.6, 0.25);
  /* Sitzfläche aus Holzlatten (leicht von oben), Rahmen aus Stahlrohr */
  const hS = 0.45 * s, t = 3.4;
  k += `<path d="M${-W / 2} ${-hS} L${W / 2} ${-hS} L${W / 2 - 1.2} ${-hS - t} L${-W / 2 + 1.2} ${-hS - t} Z" fill="${S.lg("latten", [[0, "#b7864f"], [1, "#d6a66c"]])}"/>`;
  for (let i = 1; i < 3; i++) k += `<line x1="${-W / 2 + 0.4 * i}" y1="${r(-hS - i * t / 3)}" x2="${W / 2 - 0.4 * i}" y2="${r(-hS - i * t / 3)}" stroke="#8f6232" stroke-width=".35"/>`;
  k += `<rect x="${-W / 2}" y="${r(-hS)}" width="${W}" height="1.8" fill="#8f6232"/>`;
  for (const x of [-W / 2 + 3, W / 2 - 3]) k += `<path d="M${x} ${r(-hS + 1.8)} L${x} 0" stroke="#4a5056" stroke-width="1.4"/><rect x="${x - 2}" y="-.8" width="4" height="1" fill="#2b2f33"/>`;
  k += `<path d="M${-W / 2 + 3} ${r(-hS * 0.4)} L${W / 2 - 3} ${r(-hS * 0.4)}" stroke="#4a5056" stroke-width=".9"/>`;
  S.teil({ id: "sitzbank", de: "die Sitzbank", syl: "SITZ-bank", it: "la panca", itSyl: "PAN-ca", en: "bench",
    x: (BANK.x0 + BANK.x1) / 2, y: BANK.y, steht: true, kunst: k, tipp: "Auf der Sitzbank wartet man, bis die Wäsche fertig ist." });
}
{
  /* gefaltete Zeitung auf der Bank */
  let k = `<path d="M-7 0 L6 0 L7.6 -2.4 L-5.4 -2.4 Z" fill="#f1efe8" stroke="#bdb9ad" stroke-width=".25"/>`;
  k += `<path d="M-4.6 -1.6 L4 -1.6 M-4.4 -.8 L5 -.8" stroke="#8a877e" stroke-width=".3"/><rect x="-5" y="-2.2" width="4" height=".5" fill="#2b2f33"/>`;
  S.teil({ oben: true, id: "zeitung", de: "die Zeitung", syl: "ZEI-tung", it: "il giornale", itSyl: "gior-NA-le", en: "newspaper",
    x: 14, y: r(SITZ_Y - 3.2), kunst: k + flaeche(-7.6, -4.4, 15.6, 5.2) });
}
{
  const H = 1.78 * M(BANK.y);
  const m = B.mensch({ id: "b15d_wart", geschlecht: "m", pose: "lesen", blick: 22, frisur: "locken", haarfarbe: "schwarz", haut: "mittel",
    kleidung: { oberteil: { stueck: "pullover", farbe: "orange" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "buch", farbe: "#2f6fb5" } } }, H);
  const ox = 36 - m.z.sitz.x * m.k, oy = SITZ_Y - 3.2 - m.z.sitz.y * m.k;
  S.teil({ id: "ws_wartender", de: "der Wartende", syl: "WAR-ten-de", it: "chi aspetta", itSyl: "chi a-SPET-ta", en: "person waiting", x: r(ox), y: r(oy), kunst: m.svg,
    tipp: "Er liest ein Buch, solange seine Maschine läuft." });
}

/* =====================================================================
   5 — DIE WASCHMASCHINEN (drei gewerbliche Frontlader) — Lupe Nr. 2
   ===================================================================== */
const WM = { x0: 66, w: 30, gap: 3, h: 1.0 * SW, sockel: 0.2 * SW };
const wmUnter = [];
{
  const ges = 3 * WM.w + 2 * WM.gap, cx = WM.x0 + ges / 2, top = -(WM.sockel + WM.h);
  let k = schatten(0, 0, ges / 2 + 2, 1.6, 0.3);
  /* Betonsockel, gefliest */
  k += `<rect x="${-ges / 2 - 2}" y="${-WM.sockel}" width="${ges + 4}" height="${WM.sockel}" fill="${S.lg("sockel", [[0, "#d9dcdc"], [1, "#b7bbbc"]])}"/><rect x="${-ges / 2 - 2}" y="${-WM.sockel}" width="${ges + 4}" height=".8" fill="#fff" opacity=".6"/>`;
  for (let i = 0; i < 3; i++) {
    const x = -ges / 2 + i * (WM.w + WM.gap), mx = x + WM.w / 2, nr = i + 1;
    k += `<rect x="${x}" y="${r(top)}" width="${WM.w}" height="${WM.h}" rx="1.2" fill="${EDEL}"/>`;
    /* Oberseite (Deckel mit Waschmittelfach) */
    k += `<path d="M${x} ${r(top)} L${x + WM.w} ${r(top)} L${x + WM.w - 0.6} ${r(top - 1.8)} L${x + 0.6} ${r(top - 1.8)} Z" fill="#dfe3e6"/>`;
    k += `<rect x="${x + 2}" y="${r(top - 1.4)}" width="9" height="1.2" rx=".3" fill="#9aa3aa"/>`;
    /* Bedienfeld schwarz mit Display und Tasten */
    k += `<rect x="${x + 1.2}" y="${r(top + 1.2)}" width="${WM.w - 2.4}" height="7.4" rx=".6" fill="${DUNKEL}"/>`;
    k += `<rect x="${x + 2.4}" y="${r(top + 2.2)}" width="10" height="4.4" rx=".3" fill="#0b1013"/>`;
    const txt = nr === 2 ? "0:32" : nr === 1 ? "FREI" : "0:05";
    k += `<text x="${x + 7.4}" y="${r(top + 5.6)}" font-size="${nr === 1 ? 2.4 : 3}" text-anchor="middle" fill="${nr === 1 ? "#7cff8a" : "#7fe0ff"}" font-family="monospace">${txt}</text>`;
    for (let b = 0; b < 4; b++) k += `<rect x="${x + 14 + b * 3.4}" y="${r(top + 3)}" width="2.4" height="2.8" rx=".5" fill="${b === 0 ? "#f2c230" : "#59626a"}"/>`;
    /* Nummernschild */
    k += `<circle cx="${mx}" cy="${r(top + 12.2)}" r="2.6" fill="#f2c230"/><text x="${mx}" y="${r(top + 13.6)}" font-size="3.8" text-anchor="middle" fill="#1b1e21" font-family="Arial" font-weight="bold">${nr}</text>`;
    /* Bullauge: dicker Chromring, Glas, Trommel (bei 2 mit Wäsche und Schaum) */
    const cy = top + 27, R = 9.6;
    k += `<circle cx="${mx}" cy="${r(cy)}" r="${R + 2.6}" fill="${S.rg("ring" + nr, [[0, "#ffffff"], [0.75, "#c9d0d5"], [0.9, "#7e8890"], [1, "#e8ecee"]], 0.4, 0.35, 0.65)}"/>`;
    k += `<circle cx="${mx}" cy="${r(cy)}" r="${R}" fill="${S.rg("tr" + nr, [[0, "#c9d1d6"], [0.75, "#7e8a92"], [1, "#3e474e"]], 0.5, 0.45, 0.6)}"/>`;
    for (let p = 0; p < 26; p++) { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * (R - 1.4); k += `<circle cx="${r(mx + Math.cos(a) * d)}" cy="${r(cy + Math.sin(a) * d)}" r=".22" fill="#5b666e"/>`; }
    if (nr !== 1) {
      const f1 = nr === 2 ? "#d64550" : "#3f7fd1", f2 = nr === 2 ? "#f2f2f0" : "#5ea06a";
      k += `<path d="M${r(mx - R + 1.4)} ${r(cy + 1.6)} Q${r(mx - 3)} ${r(cy - 2.4)} ${r(mx + 1)} ${r(cy + 1)} Q${r(mx + 5)} ${r(cy - 3)} ${r(mx + R - 1.2)} ${r(cy + 0.6)} L${r(mx + R - 2.4)} ${r(cy + 5.6)} Q${mx} ${r(cy + 10)} ${r(mx - R + 2.4)} ${r(cy + 5.6)} Z" fill="${f1}"/>`;
      k += `<path d="M${r(mx - 5)} ${r(cy + 2.6)} Q${r(mx - 1)} ${r(cy + 0.4)} ${r(mx + 3)} ${r(cy + 3.6)} Q${r(mx + 3)} ${r(cy + 7)} ${r(mx - 2)} ${r(cy + 7.6)} Z" fill="${f2}"/>`;
      if (nr === 2) for (let p = 0; p < 9; p++) k += `<circle cx="${r(mx - 6 + rnd() * 12)}" cy="${r(cy - 1 + rnd() * 3)}" r="${r(0.8 + rnd() * 0.8)}" fill="#fff" opacity=".85"/>`;
    }
    k += `<circle cx="${mx}" cy="${r(cy)}" r="${R}" fill="${S.rg("glas" + nr, [[0, "#9fb6c4", 0.06], [0.7, "#2a3a46", 0.15], [1, "#0f1a22", 0.5]], 0.45, 0.4, 0.6)}"/>`;
    k += `<path d="M${r(mx - R * 0.7)} ${r(cy - R * 0.2)} A${r(R * 0.75)} ${r(R * 0.75)} 0 0 1 ${r(mx + R * 0.1)} ${r(cy - R * 0.72)}" stroke="#fff" stroke-width="1" opacity=".55" fill="none"/>`;
    k += `<rect x="${r(mx + R + 1.4)}" y="${r(cy - 3.6)}" width="2.2" height="7.2" rx="1" fill="#59626a"/>`;
    k += `<path d="M${x + 1.2} ${r(top + 10)} L${x + 1.2} -${WM.sockel + 2}" stroke="#fff" stroke-width=".7" opacity=".55"/>`;
    k += `<text x="${mx}" y="${-WM.sockel - 2.2}" font-size="1.8" text-anchor="middle" fill="#59626a" font-family="Arial">${nr === 3 ? "18 kg" : "8 kg"}</text>`;
    if (nr === 2) {
      wmUnter.push(
        { id: "ws_trommel", de: "die Trommel", syl: "TROM-mel", it: "il cestello", itSyl: "ce-STEL-lo", en: "drum", x: cx + mx, y: WAND_UNTEN + cy + 1, kunst: flaecheEllipse(0, -1, 7.6, 7.6),
          tipp: "In der Trommel dreht sich die Wäsche mit Wasser und Schaum." },
        { id: "ws_waschgang", de: "der Waschgang", syl: "WASCH-gang", it: "il programma di lavaggio", itSyl: "pro-GRAM-ma di la-VAG-gio", en: "wash cycle", x: cx + x + 7.4, y: WAND_UNTEN + top + 7, kunst: flaeche(-5.4, -5, 10.8, 5.4),
          tipp: "Die Anzeige zeigt: Dieser Waschgang dauert noch 32 Minuten." },
        { id: "nummer", de: "die Nummer", syl: "NUM-mer", it: "il numero", itSyl: "NU-me-ro", en: "number", x: cx + mx, y: WAND_UNTEN + top + 15, kunst: flaeche(-3, -5.6, 6, 6),
          tipp: "Am Kassenautomaten wählt man die Nummer der Maschine." },
        { id: "waschmittelfach", de: "das Waschmittelfach", syl: "WASCH-mit-tel-fach", it: "la vaschetta del detersivo", itSyl: "va-SCHET-ta del de-ter-SI-vo", en: "detergent compartment", x: cx + x + 6.5, y: WAND_UNTEN + top, kunst: flaeche(-5, -2.6, 10, 2.8),
          tipp: "Oben auf der Maschine ist das Waschmittelfach." },
      );
    }
  }
  const x2 = -ges / 2 + WM.w + WM.gap;
  S.teil({ id: "ws_waschmaschine_ws", de: "die Waschmaschine", syl: "WASCH-ma-schi-ne", it: "la lavatrice", itSyl: "la-va-TRI-ce", en: "washing machine",
    x: cx, y: WAND_UNTEN, steht: true, kunst: k,
    zoom: { x: r(cx + x2 + WM.w / 2 - 25), y: r(WAND_UNTEN + top - 6), w: 50, h: 33.4 },
    unter: wmUnter, tipp: "Im Waschsalon gibt es große Maschinen – Nummer 3 schafft sogar 18 kg." });
}
{
  /* DAS WASCHPULVER — ein Päckchen auf Maschine 1 */
  let k = `<path d="M-4 0 L4 0 L4 -7 L-4 -7 Z" fill="${S.lg("pack", [[0, "#f4a12a"], [1, "#d6761a"]], 0, 0, 1, 0)}"/><path d="M-4 -7 L-3 -8 L5 -8 L4 -7 Z" fill="#f8c06a"/><path d="M4 0 L5 -1 L5 -8 L4 -7 Z" fill="#b8620f"/>`;
  k += `<circle cx="0" cy="-3.6" r="2.2" fill="#fff"/><text x="0" y="-3" font-size="1.4" text-anchor="middle" fill="#d6761a" font-family="Arial" font-weight="bold">1×</text>`;
  S.teil({ oben: true, id: "ws_waschmittel_ws", de: "das Waschpulver", syl: "WASCH-pul-ver", it: "il detersivo in polvere", itSyl: "de-ter-SI-vo in POL-ve-re", en: "washing powder",
    x: WM.x0 + 22, y: r(WAND_UNTEN - WM.sockel - WM.h - 1.2), kunst: k + flaeche(-5, -9, 10.6, 9.4) });
}

/* =====================================================================
   6 — HINWEISSCHILD, 7 — PREISLISTE, 8 — WASCHMITTELAUTOMAT (Wand Mitte)
   ===================================================================== */
{
  let k = `<rect x="-11" y="-11" width="22" height="22" rx="1" fill="#fffef6" stroke="#d23b30" stroke-width="1"/>`;
  k += `<circle cx="0" cy="-5" r="3.2" fill="#d23b30"/><text x="0" y="-3.6" font-size="4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">!</text>`;
  k += `<text x="0" y="2.2" font-size="2.3" text-anchor="middle" fill="#1b1e21" font-family="Arial" font-weight="bold">Bitte</text><text x="0" y="5" font-size="2.3" text-anchor="middle" fill="#1b1e21" font-family="Arial" font-weight="bold">Flusensieb</text><text x="0" y="7.8" font-size="2.3" text-anchor="middle" fill="#1b1e21" font-family="Arial" font-weight="bold">reinigen!</text>`;
  S.teil({ id: "hinweisschild", de: "das Hinweisschild", syl: "HIN-weis-schild", it: "il cartello", itSyl: "car-TEL-lo", en: "notice sign",
    x: 177, y: 52, kunst: k, tipp: "Auf dem Hinweisschild steht: Bitte das Flusensieb im Trockner reinigen!" });
}
{
  let k = `<rect x="-17" y="-16" width="34" height="32" rx="1.2" fill="#fffef6" stroke="#1b1e21" stroke-width=".6"/>`;
  k += `<rect x="-17" y="-16" width="34" height="6" rx="1.2" fill="#f2c230"/><text x="0" y="-11.6" font-size="3.4" text-anchor="middle" fill="#1b1e21" font-family="Arial" font-weight="bold">PREISE</text>`;
  const z = [["Waschen 8 kg", "4,00 €"], ["Waschen 18 kg", "8,00 €"], ["Trocknen 10 Min.", "1,00 €"], ["Waschmittel", "1,00 €"], ["Weichspüler", "0,50 €"]];
  z.forEach(([a, b], i) => { k += `<text x="-15" y="${r(-5 + i * 4.2)}" font-size="2.3" fill="#1b1e21" font-family="Arial">${a}</text><text x="15" y="${r(-5 + i * 4.2)}" font-size="2.3" text-anchor="end" fill="#1b1e21" font-family="Arial" font-weight="bold">${b}</text>`; });
  k += `<text x="0" y="14.4" font-size="1.8" text-anchor="middle" fill="#1f8a8a" font-family="Arial">Münzen · Karte · Handy</text>`;
  S.teil({ id: "preisliste", de: "die Preisliste", syl: "PREIS-lis-te", it: "il listino prezzi", itSyl: "li-STI-no PREZ-zi", en: "price list",
    x: 207, y: 50, kunst: k, tipp: "Einmal Waschen kostet 4 Euro, zehn Minuten Trocknen 1 Euro." });
}
{
  /* Waschmittelautomat an der Wand: Fächer mit Päckchen, Münzschlitz */
  let k = `<rect x="-10" y="-38" width="20" height="38" rx="1.2" fill="${S.lg("wma", [[0, "#f2c230"], [1, "#d9a81c"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-8.4" y="-35.6" width="16.8" height="20" rx=".6" fill="#2b3a40"/>`;
  for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) {
    const x = -7.6 + i * 8.2, y = -34.6 + j * 6.4;
    k += `<rect x="${x}" y="${y}" width="7.2" height="5.6" fill="#405257"/>`;
    k += `<rect x="${x + 1.4}" y="${y + 1}" width="4.4" height="4.2" fill="${["#f4a12a", "#3f7fd1", "#e98fb4"][j]}"/><rect x="${x + 2}" y="${y + 2.2}" width="3.2" height="1.6" fill="#fff" opacity=".85"/>`;
  }
  k += `<path d="M-8.4 -35.6 L-3 -35.6 L-8.4 -24 Z" fill="#fff" opacity=".15"/>`;
  k += `<rect x="-8" y="-13" width="9" height="3" rx=".4" fill="#0b1013"/><text x="-3.5" y="-10.8" font-size="2" text-anchor="middle" fill="#7cff8a" font-family="monospace">1,00</text>`;
  k += `<rect x="3" y="-13" width="4.6" height="5" rx=".6" fill="#59626a"/><rect x="4.8" y="-12.2" width=".9" height="3.4" fill="#1b1e21"/>`;
  k += `<rect x="-6" y="-6" width="12" height="4" rx=".8" fill="#2b2f33"/><text x="0" y="-1" font-size="1.6" text-anchor="middle" fill="#1b1e21" font-family="Arial" font-weight="bold">WASCHMITTEL</text>`;
  S.teil({ id: "waschmittelautomat", de: "der Waschmittelautomat", syl: "WASCH-mit-tel-au-to-mat", it: "il distributore di detersivo", itSyl: "di-stri-bu-TO-re di de-ter-SI-vo", en: "detergent vending machine",
    x: 177, y: 106, kunst: k, tipp: "Wer kein Waschmittel dabei hat, kauft hier ein Päckchen." });
}

/* =====================================================================
   9 — DIE UHR, 10 — DIE TROCKNER (2 × 2 gestapelt)
   ===================================================================== */
{
  let k = `<circle r="8" fill="#1b1e21"/><circle r="7" fill="#fffef8"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(Math.sin(a) * 6)}" y1="${r(-Math.cos(a) * 6)}" x2="${r(Math.sin(a) * (i % 3 ? 5.4 : 4.7))}" y2="${r(-Math.cos(a) * (i % 3 ? 5.4 : 4.7))}" stroke="#1b1e21" stroke-width="${i % 3 ? 0.35 : 0.7}"/>`; }
  /* 18:40 */
  k += `<line x1="0" y1="0" x2="${r(Math.sin(18.67 / 12 * 2 * Math.PI) * 3.4)}" y2="${r(-Math.cos(18.67 / 12 * 2 * Math.PI) * 3.4)}" stroke="#1b1e21" stroke-width=".9" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="0" x2="${r(Math.sin(40 / 60 * 2 * Math.PI) * 5.2)}" y2="${r(-Math.cos(40 / 60 * 2 * Math.PI) * 5.2)}" stroke="#1b1e21" stroke-width=".55" stroke-linecap="round"/><circle r=".6" fill="#d23b30"/>`;
  k += `<path d="M-4.6 -5.2 A7 7 0 0 1 3 -6.3" stroke="#fff" stroke-width=".7" opacity=".6" fill="none"/>`;
  S.teil({ id: "ws_uhr_ws", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: 258, y: 32, kunst: k, tipp: "Es ist zwanzig vor sieben. Um 22:30 Uhr startet die letzte Wäsche." });
}
const TR = { x0: 227, w: 31, gap: 2, h: 0.95 * SW };
{
  const ges = 2 * TR.w + TR.gap, cx = TR.x0 + ges / 2;
  let k = schatten(0, 0, ges / 2 + 1, 1.6, 0.3);
  const nrn = [[5, 7], [4, 6]];
  for (let col = 0; col < 2; col++) for (let row = 0; row < 2; row++) {
    const x = -ges / 2 + col * (TR.w + TR.gap), y0 = -(row + 1) * TR.h, mx = x + TR.w / 2, nr = nrn[row][col];
    k += `<rect x="${x}" y="${r(y0)}" width="${TR.w}" height="${r(TR.h - 0.6)}" rx="1" fill="${S.lg("trg", [[0, "#fbfbfb"], [0.6, "#eceeef"], [1, "#cfd3d6"]], 0, 0, 1, 0)}"/>`;
    k += `<rect x="${x + 1}" y="${r(y0 + 1)}" width="${TR.w - 2}" height="6" rx=".6" fill="${DUNKEL}"/>`;
    const lauf = nr === 4 || nr === 7;
    k += `<rect x="${x + 2.2}" y="${r(y0 + 1.8)}" width="9" height="4.4" rx=".3" fill="#0b1013"/><text x="${x + 6.7}" y="${r(y0 + 5)}" font-size="2.6" text-anchor="middle" fill="${lauf ? "#ff9a3c" : "#7cff8a"}" font-family="monospace">${lauf ? "08'" : "FREI"}</text>`;
    k += `<circle cx="${x + TR.w - 4}" cy="${r(y0 + 4)}" r="2" fill="#f2c230"/><text x="${x + TR.w - 4}" y="${r(y0 + 5.1)}" font-size="3" text-anchor="middle" fill="#1b1e21" font-family="Arial" font-weight="bold">${nr}</text>`;
    const cy = y0 + 22, R = 11;
    k += `<circle cx="${mx}" cy="${r(cy)}" r="${R + 2}" fill="${S.rg("trr" + nr, [[0, "#ffffff"], [0.8, "#d3d8db"], [1, "#9aa3aa"]], 0.4, 0.35, 0.65)}"/>`;
    k += `<circle cx="${mx}" cy="${r(cy)}" r="${R}" fill="${S.rg("trt" + nr, [[0, "#dfe4e7"], [0.75, "#9aa4ab"], [1, "#4e585f"]], 0.5, 0.45, 0.6)}"/>`;
    if (lauf) k += `<path d="M${mx - 8} ${r(cy + 3)} Q${mx - 2} ${r(cy - 5)} ${mx + 7} ${r(cy + 1)} Q${mx + 4} ${r(cy + 8)} ${mx - 5} ${r(cy + 7)} Z" fill="${nr === 4 ? "#7fb7bd" : "#e0607e"}"/><path d="M${mx - 4} ${r(cy - 6)} Q${mx + 2} ${r(cy - 8)} ${mx + 6} ${r(cy - 4)} L${mx + 2} ${r(cy - 1)} Z" fill="#f2f2f0"/>`;
    k += `<circle cx="${mx}" cy="${r(cy)}" r="${R}" fill="${S.rg("trg" + nr, [[0, "#9fb6c4", 0.05], [0.7, "#2a3a46", 0.12], [1, "#0f1a22", 0.45]], 0.45, 0.4, 0.6)}"/>`;
    k += `<path d="M${r(mx - R * 0.7)} ${r(cy - R * 0.2)} A${r(R * 0.75)} ${r(R * 0.75)} 0 0 1 ${r(mx + R * 0.1)} ${r(cy - R * 0.72)}" stroke="#fff" stroke-width="1" opacity=".55" fill="none"/>`;
    k += `<rect x="${x + TR.w - 2.6}" y="${r(cy - 4)}" width="1.6" height="8" rx=".8" fill="#9aa3aa"/>`;
    /* Flusensieb-Klappe unten */
    k += `<rect x="${x + 3}" y="${r(y0 + TR.h - 6)}" width="${TR.w - 6}" height="3" rx=".6" fill="none" stroke="#b9c0c5" stroke-width=".4"/>`;
  }
  S.teil({ id: "ws_trockner", de: "der Trockner", syl: "TROCK-ner", it: "l'asciugatrice", itSyl: "a-sciu-ga-TRI-ce", en: "tumble dryer",
    x: cx, y: WAND_UNTEN, steht: true, kunst: k, tipp: "Die Trockner stehen übereinander. Zehn Minuten kosten einen Euro." });
}

/* =====================================================================
   11 — DER KASSENAUTOMAT (Münzautomat, rechts)
   ===================================================================== */
{
  /* altes Wort korrigiert: Silben „MÜNZ-au-to-mat“ (vorher „MÜN-z-…“),
     italienisch „la gettoniera“ (weiblich, vorher „il“) */
  const H = 1.55 * SW, W = 24;
  let k = schatten(0, 0, 13, 1.4, 0.3);
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" rx="1.6" fill="${S.lg("kasse", [[0, "#3b4248"], [0.5, "#2b3136"], [1, "#1b1f22"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="3" rx="1.4" fill="#f2c230"/>`;
  /* Bildschirm: Maschine wählen */
  k += `<rect x="-9.6" y="${r(-H + 5)}" width="19.2" height="13" rx=".8" fill="#0b1013"/><rect x="-8.8" y="${r(-H + 5.8)}" width="17.6" height="11.4" fill="${S.lg("screen", [[0, "#1d6f8f"], [1, "#134b62"]])}"/>`;
  k += `<text x="0" y="${r(-H + 8.6)}" font-size="2" text-anchor="middle" fill="#fff" font-family="Arial">Maschine wählen</text>`;
  for (let i = 0; i < 7; i++) k += `<rect x="${r(-8 + (i % 4) * 4.2)}" y="${r(-H + 10 + Math.floor(i / 4) * 3.6)}" width="3.6" height="3" rx=".4" fill="${i === 1 ? "#f2c230" : "#2e8fb0"}"/><text x="${r(-6.2 + (i % 4) * 4.2)}" y="${r(-H + 12.2 + Math.floor(i / 4) * 3.6)}" font-size="2" text-anchor="middle" fill="${i === 1 ? "#1b1e21" : "#fff"}" font-family="Arial" font-weight="bold">${i + 1}</text>`;
  /* Kartenleser, Münzeinwurf, Scheineinzug, Rückgabe */
  k += `<rect x="-9" y="${r(-H + 21)}" width="8" height="9" rx=".6" fill="#14181b"/><rect x="-8" y="${r(-H + 22)}" width="6" height="3" fill="#9cd3e8"/><path d="M-5 ${r(-H + 27)} q1.2 -1 0 -2 M-4 ${r(-H + 27.6)} q2 -1.6 0 -3.2" stroke="#4aa8d8" stroke-width=".35" fill="none"/>`;
  k += `<rect x="1.6" y="${r(-H + 21)}" width="7.4" height="4" rx=".6" fill="#59626a"/><rect x="4.9" y="${r(-H + 21.6)}" width=".8" height="2.8" fill="#0b1013"/><text x="5.3" y="${r(-H + 27.4)}" font-size="1.5" text-anchor="middle" fill="#cfd6db" font-family="Arial">€</text>`;
  k += `<rect x="-8" y="${r(-H + 33)}" width="16" height="2.4" rx=".6" fill="#59626a"/><rect x="-6" y="${r(-H + 33.8)}" width="12" height=".8" fill="#0b1013"/>`;
  k += `<rect x="-4" y="${r(-H + 41)}" width="8" height="5" rx="1" fill="#14181b"/><text x="0" y="${r(-H + 48.6)}" font-size="1.5" text-anchor="middle" fill="#cfd6db" font-family="Arial">Rückgabe</text>`;
  k += `<path d="M${-W / 2 + 1.4} ${r(-H + 4)} L${-W / 2 + 1.4} -3" stroke="#fff" stroke-width=".8" opacity=".25"/>`;
  S.teil({ id: "ws_muenzautomat", de: "der Münzautomat", syl: "MÜNZ-au-to-mat", it: "la gettoniera", itSyl: "get-to-NIE-ra", en: "coin machine",
    x: 306, y: WAND_UNTEN + 1, steht: true, kunst: k, tipp: "Am Automaten wählt man die Nummer der Maschine und bezahlt mit Münzen oder Karte." });
}

/* =====================================================================
   12 — DIE KUNDIN, 13 — DER TISCH (zum Zusammenlegen), 14 — DIE WÄSCHE,
   15 — DER WÄSCHEKORB, 16 — DER STUHL
   ===================================================================== */
const TISCH = { x0: 168, x1: 226, y: 180, yh: 172 };
{
  const Y = 171, H = 1.65 * M(Y);
  const m = B.mensch({ id: "b15d_kundin", geschlecht: "w", pose: "halten", blick: -8, frisur: "dutt", haarfarbe: "rot", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "gruen" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, H);
  S.teil({ id: "ws_kundin_ws", de: "die Kundin", syl: "KUN-din", it: "la cliente", itSyl: "cli-EN-te", en: "customer", x: 204, y: Y, kunst: m.svg,
    tipp: "Sie legt ihre trockene Wäsche am Tisch zusammen." });
}
{
  const s = M(TISCH.y), W = TISCH.x1 - TISCH.x0, hT = 0.9 * s, hH = 0.9 * M(TISCH.yh);
  let k = schatten(0, 0, W / 2 + 2, 2, 0.25);
  /* Platte (Oberseite) */
  k += `<path d="M${-W / 2 + 2} ${r(TISCH.yh - TISCH.y - hH)} L${W / 2 - 2} ${r(TISCH.yh - TISCH.y - hH)} L${W / 2} ${r(-hT)} L${-W / 2} ${r(-hT)} Z" fill="${S.lg("platte", [[0, "#e7e9ea"], [1, "#f8f9f9"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${r(-hT)}" width="${W}" height="2.4" fill="${EDEL}"/>`;
  /* Unterbau: Ablagefach mit Edelstahlbeinen */
  for (const x of [-W / 2 + 1.4, W / 2 - 1.4]) k += `<rect x="${x - 1}" y="${r(-hT + 2.4)}" width="2" height="${r(hT - 2.4)}" fill="${EDEL_V}"/>`;
  k += `<rect x="${-W / 2 + 1}" y="${r(-hT * 0.25)}" width="${W - 2}" height="1.6" fill="#b9c0c5"/>`;
  k += `<rect x="${-W / 2 + 4}" y="${r(-hT * 0.25 - 4)}" width="12" height="4" rx=".6" fill="#7fb7bd"/>`;
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table",
    x: (TISCH.x0 + TISCH.x1) / 2, y: TISCH.y, steht: true, kunst: k, tipp: "Am großen Tisch legt man die Wäsche zusammen." });
}
{
  /* gefaltete Wäsche: zwei Stapel auf dem Tisch */
  const s = M(TISCH.y), yT = TISCH.y - 0.9 * s - 0.6;
  let k = "";
  const farben = [["#f2f2f0", "#d64550", "#3f7fd1", "#f2d24a"], ["#5ea06a", "#e98fb4", "#f2f2f0"]];
  farben.forEach((st, si) => {
    const x = si ? 8 : -6;
    st.forEach((f, i) => {
      k += `<path d="M${x - 7} ${r(-i * 2.3)} L${x + 7} ${r(-i * 2.3)} Q${x + 7.6} ${r(-i * 2.3 - 1.1)} ${x + 7} ${r(-i * 2.3 - 2.2)} L${x - 7} ${r(-i * 2.3 - 2.2)} Q${x - 7.6} ${r(-i * 2.3 - 1.1)} ${x - 7} ${r(-i * 2.3)} Z" fill="${f}" stroke="#00000022" stroke-width=".2"/>`;
    });
  });
  S.teil({ oben: true, id: "waesche", de: "die Wäsche", syl: "WÄ-sche", it: "il bucato", itSyl: "bu-CA-to", en: "laundry",
    x: 194, y: r(yT + 0.4), kunst: k + flaeche(-14, -10, 30, 10.6), tipp: "Die saubere Wäsche ist gefaltet." });
}
{
  const Y = 193;
  let k = schatten(0, 0, 15, 1.8, 0.3);
  k += `<path d="M-14 -16 L14 -16 L12 0 L-12 0 Z" fill="${S.lg("korb", [[0, "#3f7fd1"], [1, "#2b5a9a"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 7; i++) for (let j = 0; j < 2; j++) k += `<rect x="${r(-11 + i * 3.3 + j * 0.2)}" y="${r(-12.6 + j * 5)}" width="2" height="3" rx=".6" fill="#22477a"/>`;
  k += `<rect x="-15" y="-17.4" width="30" height="2.4" rx="1" fill="#4a8ae0"/><rect x="-4" y="-14.6" width="8" height="1.8" rx=".9" fill="#22477a"/>`;
  k += `<path d="M-12 -17 Q-8 -24 -1 -21 Q5 -25 12 -17 Z" fill="#f2f2f0"/><path d="M-6 -18 Q-2 -22 3 -19 L-6 -17.4 Z" fill="#e0607e"/>`;
  S.teil({ id: "ws_waeschekorb", de: "der Wäschekorb", syl: "WÄ-sche-korb", it: "il cesto della biancheria", itSyl: "CE-sto della bian-che-RI-a", en: "laundry basket",
    x: 248, y: Y, steht: true, kunst: k });
}
{
  /* DER STUHL — Kunststoff-Schalenstuhl vorne rechts vor dem Automaten */
  const Y = 197, s = M(Y);
  const hS = 0.45 * s, hL = 0.85 * s;
  let k = schatten(0, 0, 11, 1.4, 0.3);
  for (const x of [-9, 9]) k += `<path d="M${x} 0 L${x * 0.9} ${r(-hS)}" stroke="#59626a" stroke-width="1.3"/>`;
  k += `<path d="M-11 ${r(-hS)} L11 ${r(-hS)} L10 ${r(-hS - 3)} L-10 ${r(-hS - 3)} Z" fill="${S.lg("schale", [[0, "#f28a3c"], [1, "#d06a22"]])}"/>`;
  k += `<rect x="-11" y="${r(-hS)}" width="22" height="2" rx=".8" fill="#b85a1a"/>`;
  k += `<path d="M-9 ${r(-hS - 3)} L-10 ${r(-hL)} Q0 ${r(-hL - 3)} 10 ${r(-hL)} L9 ${r(-hS - 3)} Z" fill="${S.lg("lehne", [[0, "#f59a52"], [1, "#e07a2e"]])}"/>`;
  k += `<path d="M-7 ${r(-hL + 2)} Q0 ${r(-hL)} 7 ${r(-hL + 2)}" stroke="#fff" stroke-width=".8" opacity=".35" fill="none"/>`;
  S.teil({ id: "ws_stuhl_ws", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: 303, y: Y, steht: true, kunst: k, tipp: "Auf dem Stuhl kann man warten, bis der Trockner fertig ist." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/waschsalon.js"));
console.log(aus);
