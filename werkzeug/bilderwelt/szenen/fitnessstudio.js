#!/usr/bin/env node
/* =====================================================================
   DAS FITNESSSTUDIO (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (DSSV-Planungshilfe Fitnessstudio, Studio-Einrichtungs-
   ratgeber, Fotos von Uni- und Kettenstudios) — so ist eine deutsche
   Trainingsfläche aufgebaut:
   - Getrennte Zonen: CARDIO (Laufbänder, Ergometer, oft mit Blick zum
     Fenster), FREIHANTELBEREICH vor einer SPIEGELWAND mit dem
     KURZHANTELSTÄNDER (Gummi-Hanteln, nach Gewicht sortiert), HANTELBANK,
     SCHEIBENSTÄNDER mit Gewichtsscheiben, KABELZUG-Turm mit Gewichtsblock.
   - Boden: im Kraftbereich schwarzer GUMMIBODEN in 1-m-Platten mit bunten
     Einstreuseln, im Cardiobereich Vinyl in Holzoptik.
   - Dunkle Decke mit offenen Lüftungsrohren und LED-Lichtbändern.
   - Handtuchpflicht, Trinkflasche, Wasserspender und eine Station zum
     Desinfizieren der Geräte; Wertfächer/SPINDE an der Wand; Wanduhr.
   - Eine Trainerin oder ein Trainer im Shirt des Studios betreut die
     Fläche; Dehnecke mit Matten und Gymnastikball.
   Maßstab (Zentralperspektive): Augenhöhe 1,55 m, Fluchtpunkt (160 | 95),
   Einheiten je Meter = 271 / Abstand: Rückwand (14 m) ≈ 19,
   Hantelbank (7,4 m) ≈ 37, Bildunterkante ≈ 64.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "fitnessstudio", titel: "Das Fitnessstudio", emoji: "🏋️", thema: "Freizeit", kuerzel: "b14b", fassung: 852 });
const rnd = zufall(4711);
const r = B.r;
/* Menschen knapper speichern (ganze Zentimeter reichen bei kleinem Maßstab) */
const knapp = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);
const mensch = (spec, h) => { const m = B.mensch(spec, h); m.svg = knapp(m.svg); return m; };

/* ---------- Perspektive ---------------------------------------------- */
const VX = 160, YH = 95, H = 1.55, F = 271;
const s = (d) => F / d;
const X = (xm, d) => VX + xm * F / d;
const Y = (d, h = 0) => YH + (H - h) * F / d;
const P = (xm, d, h = 0) => [X(xm, d), Y(d, h)];
const pt = (xm, d, h = 0) => `${r(X(xm, d))} ${r(Y(d, h))}`;
const D_W = 14, W_L = -4, W_R = 4, DECKE = 3.4;
const poly = (pp) => "M" + pp.map(([a, b]) => `${r(a)} ${r(b)}`).join(" L") + " Z";
/* Quader im Raum: sichtbare Flächen (Seite, Deckel, Front) */
function quader(x0, x1, d0, d1, h0, h1, f) {
  let o = "";
  if (x0 > 0 && f.seite) o += `<path d="${poly([P(x0, d0, h0), P(x0, d1, h0), P(x0, d1, h1), P(x0, d0, h1)])}" fill="${f.seite}"/>`;
  if (x1 < 0 && f.seite) o += `<path d="${poly([P(x1, d0, h0), P(x1, d1, h0), P(x1, d1, h1), P(x1, d0, h1)])}" fill="${f.seite}"/>`;
  if (h1 < H && f.deckel) o += `<path d="${poly([P(x0, d0, h1), P(x1, d0, h1), P(x1, d1, h1), P(x0, d1, h1)])}" fill="${f.deckel}"/>`;
  if (f.front) o += `<path d="${poly([P(x0, d0, h0), P(x1, d0, h0), P(x1, d0, h1), P(x0, d0, h1)])}" fill="${f.front}"/>`;
  return o;
}
/* Teil mit Zeichnung in Bildkoordinaten, Anker (ax|ay) */
const abs = (ax, ay, k) => `<g transform="translate(${r(-ax)} ${r(-ay)})">${k}</g>`;

/* ---------- Farben ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c3cad0"], [0.55, "#a7b0b7"], [1, "#dfe4e7"]], 0, 0, 1, 0);
const SCHWARZ = S.lg("schwarz", [[0, "#3a3d42"], [1, "#1b1d20"]]);
const LIME = "#9fd23a";
S.def(`<pattern id="${S.id("gummi")}" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#2a2c30"/><circle cx="1" cy="1.5" r=".35" fill="#5b8fd0" opacity=".5"/><circle cx="4.2" cy="3.6" r=".3" fill="#9fd23a" opacity=".45"/><circle cx="2.6" cy="5" r=".3" fill="#8b8f96" opacity=".6"/><circle cx="5.2" cy=".6" r=".25" fill="#8b8f96" opacity=".6"/></pattern>`);
const GUMMI = `url(#${S.id("gummi")})`;

/* =====================================================================
   KULISSE — Decke, Wände, Boden
   ===================================================================== */
{
  const dL0 = -W_L * F / VX, dR0 = W_R * F / (320 - VX);
  let k = "";
  /* Decke: dunkel gestrichen, offenes Lüftungsrohr, LED-Bänder */
  k += `<rect x="0" y="0" width="320" height="${r(Y(D_W, DECKE) + 1)}" fill="${S.lg("decke", [[0, "#15171a"], [1, "#2a2d31"]])}"/>`;
  k += `<path d="M0 0 L320 0 L320 ${r(Y(dR0, DECKE))} L${pt(W_R, D_W, DECKE)} L${pt(W_L, D_W, DECKE)} L0 ${r(Y(dL0, DECKE))} Z" fill="${S.lg("decke2", [[0, "#111316"], [1, "#24272b"]])}"/>`;
  for (const xm of [-1.8, 1.8]) k += `<path d="M${pt(xm - 0.035, D_W, DECKE - 0.02)} L${pt(xm + 0.035, D_W, DECKE - 0.02)} L${pt(xm + 0.035, 3.2, DECKE - 0.02)} L${pt(xm - 0.035, 3.2, DECKE - 0.02)} Z" fill="#f4fbff"/><path d="M${pt(xm - 0.16, D_W, DECKE - 0.02)} L${pt(xm + 0.16, D_W, DECKE - 0.02)} L${pt(xm + 0.16, 3.2, DECKE - 0.02)} L${pt(xm - 0.16, 3.2, DECKE - 0.02)} Z" fill="#dff3ff" opacity=".1"/>`;
  /* Lüftungsrohr (rund, Blech) */
  k += `<path d="M${pt(0, D_W, 3.05)} L${pt(0, 3.2, 3.05)}" stroke="${S.lg("rohr", [[0, "#9aa3aa"], [0.5, "#d6dce0"], [1, "#7b848b"]], 0, 0, 1, 0)}" stroke-width="7"/>`;
  k += `<path d="M${pt(-0.14, D_W, 3.05)} L${pt(-0.14 * 3, 3.2, 3.05)}" stroke="#4d555b" stroke-width=".4" opacity=".6"/>`;
  /* Rückwand anthrazit mit Lime-Streifen */
  k += `<path d="M${pt(W_L, D_W, DECKE)} L${pt(W_R, D_W, DECKE)} L${pt(W_R, D_W)} L${pt(W_L, D_W)} Z" fill="${S.lg("rueck", [[0, "#4a4f55"], [1, "#3b3f44"]])}"/>`;
  k += `<path d="M${pt(W_L, D_W, 1.15)} L${pt(W_R, D_W, 1.15)} L${pt(W_R, D_W, 1.0)} L${pt(W_L, D_W, 1.0)} Z" fill="${LIME}"/>`;
  k += `<text x="${r(X(1.2, D_W))}" y="${r(Y(D_W, 2.55))}" font-size="7.5" text-anchor="middle" fill="#f1f3f4" font-family="Arial Black,Arial" font-weight="900" letter-spacing=".5">FIT<tspan fill="${LIME}">WERK</tspan></text>`;
  k += `<text x="${r(X(1.2, D_W))}" y="${r(Y(D_W, 2.3))}" font-size="2.3" text-anchor="middle" fill="#c9cdd1" font-family="Arial" letter-spacing=".8">TRAINING · GESUNDHEIT · SPASS</text>`;
  /* linke Wand (Fensterfront; die Fenster sind ein eigenes Teil) */
  k += `<path d="M${pt(W_L, D_W, DECKE)} L${pt(W_L, D_W)} L0 ${r(Y(dL0))} L0 ${r(Y(dL0, DECKE))} Z" fill="${S.lg("lwand", [[0, "#3e4247"], [1, "#4c5157"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${pt(W_L, D_W, 0.55)} L${pt(W_L, D_W, 0.45)} L0 ${r(Y(dL0, 0.45))} L0 ${r(Y(dL0, 0.55))} Z" fill="${LIME}"/>`;
  /* rechte Wand */
  k += `<path d="M${pt(W_R, D_W, DECKE)} L${pt(W_R, D_W)} L320 ${r(Y(dR0))} L320 ${r(Y(dR0, DECKE))} Z" fill="${S.lg("rwand", [[0, "#50555b"], [1, "#3c4045"]], 0, 0, 1, 0)}"/>`;
  /* Boden: hinten Vinyl in Holzoptik (Cardio), vorne Gummiboden */
  const D_C = 11;
  k += `<path d="M${pt(W_L, D_W)} L${pt(W_R, D_W)} L${pt(W_R, D_C)} L${pt(W_L, D_C)} Z" fill="${S.lg("vinyl", [[0, "#a37a52"], [1, "#b88d62"]])}"/>`;
  let lin = "";
  for (let xm = W_L; xm <= W_R; xm += 0.2) lin += `M${pt(xm, D_W)} L${pt(xm, D_C)}`;
  k += `<path d="${lin}" stroke="#7d5a38" stroke-width=".25" opacity=".55"/>`;
  k += `<path d="M0 ${r(Y(dL0))} L${pt(W_L, D_C)} L${pt(W_R, D_C)} L320 ${r(Y(dR0))} L320 200 L0 200 Z" fill="${GUMMI}"/>`;
  let g = "";
  for (let xm = -9; xm <= 9; xm += 1) g += `M${pt(xm, D_C)} L${pt(xm, 3.6)}`;
  for (let d = 4; d <= D_C; d += 1) g += `M0 ${r(Y(d))} H320`;
  k += `<path d="${g}" stroke="#121315" stroke-width=".45" opacity=".8"/>`;
  k += `<path d="M0 ${r(Y(dL0))} L${pt(W_L, D_C)} L${pt(W_R, D_C)} L320 ${r(Y(dR0))} L320 200 L0 200 Z" fill="${S.lg("bodenlicht", [[0, "#fff", 0.1], [0.6, "#fff", 0], [1, "#000", 0.2]])}"/>`;
  k += `<path d="M${pt(W_L, D_C)} L${pt(W_R, D_C)}" stroke="#9aa3aa" stroke-width=".7"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DAS FENSTER (Fensterfront links, Blick auf die Stadt)
   ===================================================================== */
{
  const d0 = 6.9, d1 = 13.8, h0 = 0.75, h1 = 3.0;
  let k = `<path d="${poly([P(W_L, d0, h1 + 0.08), P(W_L, d1, h1 + 0.08), P(W_L, d1, h0 - 0.08), P(W_L, d0, h0 - 0.08)])}" fill="#2a2e33"/>`;
  k += `<path d="${poly([P(W_L, d0, h1), P(W_L, d1, h1), P(W_L, d1, h0), P(W_L, d0, h0)])}" fill="${S.lg("aussen", [[0, "#9cc7ea"], [0.55, "#d8e9f3"], [0.56, "#b7c4cc"], [1, "#8d9aa3"]])}"/>`;
  /* Häuserzeile gegenüber */
  for (let d = d0 + 0.2; d < d1 - 0.3; d += 0.9) {
    const hh = 1.75 + rnd() * 0.6;
    k += `<path d="${poly([P(W_L, d, hh), P(W_L, d + 0.8, hh), P(W_L, d + 0.8, h0), P(W_L, d, h0)])}" fill="${rnd() < 0.5 ? "#c9b49a" : "#b8a58e"}" opacity=".75"/>`;
    for (let i = 0; i < 2; i++) k += `<path d="${poly([P(W_L, d + 0.15 + i * 0.35, hh - 0.2), P(W_L, d + 0.35 + i * 0.35, hh - 0.2), P(W_L, d + 0.35 + i * 0.35, hh - 0.5), P(W_L, d + 0.15 + i * 0.35, hh - 0.5)])}" fill="#6f8796" opacity=".7"/>`;
  }
  /* Rahmen und Sprossen */
  let sp = "";
  for (let d = d0; d <= d1 + 0.01; d += (d1 - d0) / 5) sp += `M${pt(W_L, d, h0)} L${pt(W_L, d, h1)}`;
  k += `<path d="${sp}" stroke="#25292d" stroke-width="1.6"/>`;
  k += `<path d="M${pt(W_L, d0, 2.1)} L${pt(W_L, d1, 2.1)}" stroke="#25292d" stroke-width=".9"/>`;
  for (let d = d0 + 0.5; d < d1; d += 2.2) k += `<path d="${poly([P(W_L, d, h1), P(W_L, d + 0.5, h1), P(W_L, d + 1.1, h0), P(W_L, d + 0.6, h0)])}" fill="#fff" opacity=".14"/>`;
  const [ax, ay] = P(W_L, 9, h0);
  S.teil({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: ax, y: ay, kunst: abs(ax, ay, k) });
}

/* =====================================================================
   2 — DIE WANDUHR (Rückwand)
   ===================================================================== */
{
  const R = 6;
  let k = `<circle r="${R + 0.9}" fill="#16181b"/><circle r="${R}" fill="${S.rg("zb", [[0, "#ffffff"], [1, "#e4e7ea"]])}"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(Math.sin(a) * 5.2)}" y1="${r(-Math.cos(a) * 5.2)}" x2="${r(Math.sin(a) * (i % 3 ? 4.6 : 4))}" y2="${r(-Math.cos(a) * (i % 3 ? 4.6 : 4))}" stroke="#1d2024" stroke-width="${i % 3 ? 0.3 : 0.6}"/>`; }
  /* Viertel nach sechs am Abend — Feierabendtraining */
  k += `<line x1="0" y1="0" x2="${r(Math.sin(6.25 * Math.PI / 6) * 3)}" y2="${r(-Math.cos(6.25 * Math.PI / 6) * 3)}" stroke="#1d2024" stroke-width=".8" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="0" x2="${r(Math.sin(Math.PI / 2) * 4.4)}" y2="0" stroke="#1d2024" stroke-width=".5" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="1" x2="${r(Math.sin(4) * 4.8)}" y2="${r(-Math.cos(4) * 4.8)}" stroke="${LIME}" stroke-width=".3"/><circle r=".5" fill="${LIME}"/>`;
  k += `<path d="M-4.5 -2.5 A6 6 0 0 1 2 -5.6" stroke="#fff" stroke-width=".7" opacity=".7" fill="none"/>`;
  S.teil({ id: "fi_uhr_fi", de: "die Wanduhr", syl: "WAND-uhr", it: "l'orologio da parete", itSyl: "o-ro-LO-gio da pa-RE-te", en: "wall clock", x: r(X(-1.9, D_W)), y: r(Y(D_W, 2.55)), kunst: k });
}

/* =====================================================================
   3 — DER KABELZUG (Turm mit Gewichtsblock, hinten links)
   ===================================================================== */
{
  const d = 13.25, sc = s(d), c = -3.05, hT = 2.25;
  const [xc, yb] = P(c, d), yT = Y(d, hT), w = 0.62 * sc;
  let k = schatten(xc, yb, w + 3, 1.2, 0.35);
  k += quader(c - 0.7, c + 0.7, d - 0.35, d + 0.3, 0, 0.06, { deckel: "#2b2d31", front: "#17191b", seite: "#202225" });
  /* Rahmen */
  for (const sx of [-1, 1]) k += `<rect x="${r(xc + sx * w - 1.2)}" y="${r(yT)}" width="2.4" height="${r(yb - yT)}" fill="${S.lg("rahmen", [[0, "#2c2f33"], [0.5, "#4a4f55"], [1, "#1f2124"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(xc - w - 1.2)}" y="${r(yT - 1.6)}" width="${r(2 * w + 2.4)}" height="2.6" rx=".6" fill="#2c2f33"/>`;
  k += `<rect x="${r(xc - w - 1.2)}" y="${r(yT - 1.6)}" width="${r(2 * w + 2.4)}" height=".6" fill="${LIME}"/>`;
  /* Führungsstangen und Gewichtsblock mit Steckbolzen */
  k += `<path d="M${r(xc - 2.2)} ${r(yT + 1)} V${r(yb - 1)} M${r(xc + 2.2)} ${r(yT + 1)} V${r(yb - 1)}" stroke="#c9cfd4" stroke-width=".5"/>`;
  const nPl = 14, yS = Y(d, 0.12);
  for (let i = 0; i < nPl; i++) k += `<rect x="${r(xc - 3.6)}" y="${r(yS - (i + 1) * 1.15)}" width="7.2" height="1" rx=".3" fill="${i % 2 ? "#33363b" : "#3b3f45"}"/><text x="${r(xc + 3)}" y="${r(yS - i * 1.15 - 0.35)}" font-size=".8" text-anchor="end" fill="#e6e8ea" font-family="Arial">${(nPl - i) * 5}</text>`;
  k += `<rect x="${r(xc - 3.6)}" y="${r(yS - nPl * 1.15 - 3)}" width="7.2" height="2.8" rx=".5" fill="#4a4f55"/><circle cx="${r(xc + 3.2)}" cy="${r(yS - 6 * 1.15 + 0.5)}" r=".7" fill="#e23b2e"/>`;
  k += `<path d="M${r(xc)} ${r(yS - nPl * 1.15 - 3)} V${r(yT + 2)}" stroke="#1a1a1a" stroke-width=".35"/>`;
  /* Umlenkrollen und Seil zum Griff */
  k += `<circle cx="${r(xc)}" cy="${r(yT + 1.2)}" r="1.4" fill="#5b6066" stroke="#2a2d31" stroke-width=".3"/><circle cx="${r(xc + w - 0.5)}" cy="${r(yT + 1.6)}" r="1.2" fill="#5b6066"/>`;
  k += `<path d="M${r(xc)} ${r(yT - 0.2)} H${r(xc + w - 0.5)} M${r(xc + w + 0.6)} ${r(yT + 1.6)} L${r(xc + w + 3)} ${r(Y(d, 1.05))}" stroke="#1a1a1a" stroke-width=".35" fill="none"/>`;
  k += `<path d="M${r(xc + w + 1.5)} ${r(Y(d, 1.05))} h3 l-.5 2.2 h-2 Z" fill="none" stroke="#9aa3aa" stroke-width=".5"/><rect x="${r(xc + w + 1.9)}" y="${r(Y(d, 1.05) + 1.4)}" width="2.2" height="1" rx=".4" fill="#1d1f22"/>`;
  k += `<rect x="${r(xc - 4.3)}" y="${r(Y(d, 1.7))}" width="8.6" height="3" rx=".4" fill="#ffffff"/><text x="${r(xc)}" y="${r(Y(d, 1.7) + 2.1)}" font-size="1.6" text-anchor="middle" fill="#1d1f22" font-family="Arial" font-weight="bold">KABELZUG</text>`;
  S.teil({ id: "kabelzug", de: "der Kabelzug", syl: "KA-bel-zug", it: "il cavo", itSyl: "CA-vo", en: "cable machine", x: xc, y: yb, steht: true, kunst: abs(xc, yb, k),
    tipp: "Am Kabelzug zieht man das Gewicht über ein Seil und Rollen nach oben." });
}

/* =====================================================================
   4 — DER WASSERSPENDER und DAS DESINFEKTIONSMITTEL (Rückwand rechts)
   ===================================================================== */
{
  const d = 13.6, c = 2.5, [xc, yb] = P(c, d);
  let k = schatten(xc, yb, 4, 0.8, 0.3);
  k += quader(c - 0.17, c + 0.17, d - 0.3, d, 0, 1.0, { deckel: "#e9edf0", front: S.lg("wsp", [[0, "#f6f8f9"], [1, "#c9d1d6"]], 0, 0, 1, 0), seite: "#b7c0c6" });
  const yT = Y(d - 0.3, 1.0), sc = s(d - 0.3);
  k += `<path d="M${r(xc - 0.15 * sc)} ${r(yT)} L${r(xc - 0.15 * sc)} ${r(yT - 0.35 * sc)} Q${r(xc)} ${r(yT - 0.46 * sc)} ${r(xc + 0.15 * sc)} ${r(yT - 0.35 * sc)} L${r(xc + 0.15 * sc)} ${r(yT)} Z" fill="${S.lg("flasche5", [[0, "#9fd8f4", 0.85], [1, "#3f9ad0", 0.85]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(xc - 2)}" y="${r(Y(d - 0.3, 0.72))}" width="4" height="2" rx=".4" fill="#2b2f33"/><rect x="${r(xc - 1.3)}" y="${r(Y(d - 0.3, 0.72) + 0.4)}" width="1" height=".9" fill="#3a8fd8"/><rect x="${r(xc + 0.3)}" y="${r(Y(d - 0.3, 0.72) + 0.4)}" width="1" height=".9" fill="#e23b2e"/>`;
  k += `<rect x="${r(xc - 1.4)}" y="${r(Y(d - 0.3, 0.45))}" width="2.8" height=".6" fill="#9aa3aa"/>`;
  S.teil({ id: "wasserspender", de: "der Wasserspender", syl: "WAS-ser-spen-der", it: "il distributore d'acqua", itSyl: "di-stri-bu-TO-re d'AC-qua", en: "water dispenser", x: xc, y: yb, steht: true, kunst: abs(xc, yb, k),
    tipp: "Am Wasserspender füllt man die Trinkflasche auf." });
}
{
  const d = D_W - 0.02, c = 3.42, sc = s(d), [xc, y0] = P(c, d, 1.0);
  let k = `<rect x="${r(xc - 5)}" y="${r(Y(d, 1.62))}" width="10" height="${r(0.24 * sc)}" rx=".4" fill="#ffffff"/><text x="${r(xc)}" y="${r(Y(d, 1.62) + 1.9)}" font-size="1.25" text-anchor="middle" fill="#1d1f22" font-family="Arial" font-weight="bold">Bitte Geräte</text><text x="${r(xc)}" y="${r(Y(d, 1.62) + 3.5)}" font-size="1.25" text-anchor="middle" fill="#1d1f22" font-family="Arial" font-weight="bold">desinfizieren!</text>`;
  /* Wandhalter mit Papierrolle und Sprühflasche */
  k += `<rect x="${r(xc - 4.5)}" y="${r(Y(d, 1.3))}" width="9" height="${r(0.3 * sc)}" rx=".6" fill="#d9dee2"/>`;
  k += `<rect x="${r(xc - 3.8)}" y="${r(Y(d, 1.27))}" width="4.6" height="${r(0.24 * sc)}" rx="1" fill="${S.lg("rolle", [[0, "#ffffff"], [1, "#d7dadc"]])}"/><path d="M${r(xc - 2)} ${r(Y(d, 1.03))} v2.2 h1.8 v-2.2" fill="#f4f6f7" stroke="#c8cdd1" stroke-width=".15"/>`;
  k += `<path d="M${r(xc + 1.6)} ${r(Y(d, 1.05))} v-3.6 h2.4 v3.6 Z" fill="#3a8fd8"/><path d="M${r(xc + 2)} ${r(Y(d, 1.05) - 3.6)} v-1.4 h1.8 l.8 .6 v.8 Z" fill="#f2f2ee"/>`;
  S.teil({ id: "desinfektionsmittel", de: "das Desinfektionsmittel", syl: "Des-in-fek-TI-ons-mit-tel", it: "il disinfettante", itSyl: "di-sin-fet-TAN-te", en: "disinfectant", x: xc, y: y0, kunst: abs(xc, y0, k),
    tipp: "Nach dem Training sprüht man das Gerät ein und wischt es ab." });
}

/* =====================================================================
   5 — DAS LAUFBAND (zwei Laufbänder) — Front zu uns, Fenster links
   ===================================================================== */
const LB = [-1.5, 0.35];
function laufbandTeile(c, nurKonsole) {
  const dA = 11.5, dE = 13.35;
  let k = "";
  if (!nurKonsole) {
    k += schatten(X(c, 12.4), Y(12.4), 0.6 * s(12.4), 1.4, 0.35);
    /* Rahmen und Lauffläche */
    k += quader(c - 0.43, c + 0.43, dA + 0.25, dE, 0.04, 0.19, { deckel: "#2b2e32", front: "#1d1f22", seite: "#3a3e43" });
    k += quader(c - 0.33, c + 0.33, dA + 0.3, dE - 0.08, 0.19, 0.205, { deckel: S.lg("band", [[0, "#121315"], [1, "#2a2c2f"]]) });
    /* Seitenleisten (Trittflächen) in Alu */
    k += quader(c - 0.43, c - 0.33, dA + 0.3, dE, 0.19, 0.205, { deckel: "#aeb6bc" }) + quader(c + 0.33, c + 0.43, dA + 0.3, dE, 0.19, 0.205, { deckel: "#aeb6bc" });
    /* Motorhaube vorne */
    k += quader(c - 0.45, c + 0.45, dA, dA + 0.32, 0, 0.3, { deckel: "#3a3e43", front: S.lg("haube", [[0, "#4a4f55"], [1, "#222428"]]), seite: "#2c2f33" });
  }
  /* Stützen, Handläufe, Konsole */
  k += quader(c - 0.42, c - 0.35, dA + 0.08, dA + 0.16, 0.3, 1.18, { front: "#5c6167", seite: "#45494e" }) + quader(c + 0.35, c + 0.42, dA + 0.08, dA + 0.16, 0.3, 1.18, { front: "#5c6167", seite: "#45494e" });
  for (const sx of [-1, 1]) k += `<path d="M${pt(c + sx * 0.4, dA + 0.12, 1.02)} L${pt(c + sx * 0.4, dA + 0.85, 1.0)}" stroke="#c9cfd4" stroke-width="1.1" stroke-linecap="round"/>`;
  k += quader(c - 0.44, c + 0.44, dA, dA + 0.2, 1.12, 1.42, { deckel: "#24272b", front: S.lg("konsole", [[0, "#3a3e44"], [1, "#1c1e21"]]), seite: "#2c2f33" });
  const [kx, ky] = P(c, dA, 1.33);
  k += `<text x="${r(kx)}" y="${r(ky)}" font-size="1.7" text-anchor="middle" fill="${LIME}" font-family="Arial" font-weight="bold">FITWERK</text>`;
  k += `<path d="M${pt(c - 0.44, dA, 1.17)} L${pt(c + 0.44, dA, 1.17)}" stroke="${LIME}" stroke-width=".4"/>`;
  return k;
}
{
  let k = "";
  for (const c of LB) k += laufbandTeile(c, false);
  const [ax, ay] = P((LB[0] + LB[1]) / 2, 11.5);
  S.teil({ id: "fi_laufband", de: "das Laufband", syl: "LAUF-band", it: "il tapis roulant", itSyl: "ta-PI rou-LANT", en: "treadmill", x: ax, y: ay, steht: true, kunst: abs(ax, ay, k),
    tipp: "Auf dem Laufband läuft man – das Band bewegt sich, man bleibt am Platz." });
}
{
  /* DIE SPORTLERIN — joggt auf dem rechten Laufband */
  const d = 12.55, c = LB[1], sc = s(d);
  const m = mensch({ id: "b14b_spl", geschlecht: "w", pose: "laufen", blick: 4, frisur: "zopf", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "rosa" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "turnschuh" } } }, 1.68 * sc);
  const [x, y] = P(c, d, 0.205);
  S.teil({ id: "fi_sportlerin", de: "die Sportlerin", syl: "SPORT-le-rin", it: "la sportiva", itSyl: "spor-TI-va", en: "athlete", x, y, kunst: m.svg,
    tipp: "Die Sportlerin läuft 30 Minuten auf dem Laufband." });
  /* Die Konsole des Laufbands liegt vor ihr (nur Bild, fängt keinen Tipp) */
  S.davor(laufbandTeile(c, true));
}

/* =====================================================================
   6 — DIE SPIEGELWAND (rechte Wand) und DER SPIND (Wertfächer vorn)
   ===================================================================== */
{
  const d0 = 9.0, d1 = 13.85, h0 = 0.12, h1 = 2.3;
  let k = `<path d="${poly([P(W_R, d0, h1 + 0.05), P(W_R, d1, h1 + 0.05), P(W_R, d1, h0 - 0.05), P(W_R, d0, h0 - 0.05)])}" fill="#9aa3aa"/>`;
  k += `<path d="${poly([P(W_R, d0, h1), P(W_R, d1, h1), P(W_R, d1, h0), P(W_R, d0, h0)])}" fill="${S.lg("spiegel", [[0, "#8e98a0"], [0.35, "#c9d2d8"], [0.6, "#a4aeb5"], [1, "#6f7880"]], 0, 0, 1, 0)}"/>`;
  /* Spiegelbild: Fensterlicht und dunkler Raum */
  k += `<path d="${poly([P(W_R, d0, 1.1), P(W_R, d1, 1.1), P(W_R, d1, h0), P(W_R, d0, h0)])}" fill="#2a2c30" opacity=".35"/>`;
  for (let d = d0 + 0.6; d < d1; d += 1.5) k += `<path d="${poly([P(W_R, d, h1), P(W_R, d + 0.25, h1), P(W_R, d + 0.75, h0), P(W_R, d + 0.5, h0)])}" fill="#fff" opacity=".2"/>`;
  let fu = "";
  for (let d = d0; d <= d1 + 0.01; d += (d1 - d0) / 4) fu += `M${pt(W_R, d, h0)} L${pt(W_R, d, h1)}`;
  k += `<path d="${fu}" stroke="#d9dee2" stroke-width=".5"/>`;
  const [ax, ay] = P(W_R, d0, h0);
  S.teil({ id: "spiegelwand", de: "die Spiegelwand", syl: "SPIE-gel-wand", it: "la parete a specchio", itSyl: "pa-RE-te a SPEC-chio", en: "mirror wall", x: ax, y: ay, kunst: abs(ax, ay, k),
    tipp: "Im Spiegel prüft man, ob man die Übung richtig macht." });
}
{
  const d0 = 6.95, d1 = 8.75, h0 = 0.05, h1 = 1.95;
  let k = `<path d="${poly([P(W_R, d0, h1), P(W_R, d1, h1), P(W_R, d1, h0), P(W_R, d0, h0)])}" fill="#7d858c"/>`;
  const sp = 3, ze = 4;
  for (let i = 0; i < sp; i++) for (let j = 0; j < ze; j++) {
    const a = d0 + 0.04 + i * (d1 - d0) / sp, b = d0 + (i + 1) * (d1 - d0) / sp - 0.04;
    const u = h0 + 0.04 + j * (h1 - h0) / ze, o = h0 + (j + 1) * (h1 - h0) / ze - 0.04;
    k += `<path d="${poly([P(W_R, a, o), P(W_R, b, o), P(W_R, b, u), P(W_R, a, u)])}" fill="${S.lg("tuer", [[0, "#c7ccd1"], [1, "#a9b0b6"]], 0, 0, 1, 0)}"/>`;
    const [lx, ly] = P(W_R, b - 0.1, (u + o) / 2);
    k += `<rect x="${r(lx - 0.5)}" y="${r(ly - 1.1)}" width="1" height="2.2" rx=".3" fill="#2b2f33"/><circle cx="${r(lx)}" cy="${r(ly + 0.3)}" r=".25" fill="${LIME}"/>`;
    const [nx, ny] = P(W_R, a + 0.12, o - 0.1);
    k += `<text x="${r(nx)}" y="${r(ny + 1.2)}" font-size="1.4" fill="#2b2f33" font-family="Arial" font-weight="bold">${i * ze + j + 1}</text>`;
  }
  const [ax, ay] = P(W_R, (d0 + d1) / 2, h0);
  S.teil({ id: "fi_spind", de: "der Spind", syl: "SPIND", it: "l'armadietto", itSyl: "ar-ma-DIET-to", en: "locker", x: ax, y: ay, kunst: abs(ax, ay, k),
    tipp: "Im Spind schließt man Handy und Schlüssel ein." });
}

/* =====================================================================
   7 — DER HANTELSTÄNDER vor der Spiegelwand (Lupe: Hantel, Kettlebell,
       Springseil, Faszienrolle)
   ===================================================================== */
{
  const x0 = 3.0, x1 = 3.75, d0 = 9.9, d1 = 12.7;
  let k = "";
  /* Füße und Seitenwangen */
  for (const d of [d0, (d0 + d1) / 2, d1]) {
    k += quader(x0, x1, d - 0.05, d + 0.05, 0, 0.05, { deckel: "#2b2d31", front: "#17191b", seite: "#202225" });
    k += `<path d="M${pt(x0 + 0.05, d, 0.05)} L${pt(x0 + 0.05, d, 0.95)} M${pt(x1 - 0.05, d, 0.05)} L${pt(x1 - 0.05, d, 0.75)}" stroke="#2c2f33" stroke-width="1.2"/>`;
  }
  /* zwei Ablagen (oben schräg) */
  const ablage = (h, hh) => `<path d="${poly([P(x0, d0, h), P(x0, d1, h), P(x1, d1, hh), P(x1, d0, hh)])}" fill="#3a3e43"/><path d="M${pt(x0, d0, h)} L${pt(x0, d1, h)}" stroke="${LIME}" stroke-width=".6"/>`;
  k += ablage(0.35, 0.42) + ablage(0.82, 0.95);
  /* Kurzhanteln: je Ablage ein Paar pro Gewicht, Achse quer zur Wand */
  const hantel = (d, h, gew, gross) => {
    const sc = s(d), [xa, ya] = P(x0 + 0.08, d, h + 0.08), [xb] = P(x1 - 0.08, d, h + 0.08), rr = (0.06 + gross * 0.035) * sc;
    let g = `<rect x="${r(xa)}" y="${r(ya - 0.25)}" width="${r(xb - xa)}" height=".5" fill="#b9c0c6"/>`;
    for (const xx of [xa, xb]) g += `<rect x="${r(xx - rr * 0.55)}" y="${r(ya - rr)}" width="${r(rr * 1.1)}" height="${r(rr * 2)}" rx="${r(rr * 0.35)}" fill="${S.lg("kopf", [[0, "#3b3e42"], [0.5, "#24262a"], [1, "#141517"]], 0, 0, 1, 0)}"/>`;
    g += `<text x="${r(xa)}" y="${r(ya + 0.4)}" font-size="${r(Math.max(0.9, rr * 0.8))}" text-anchor="middle" fill="#e6e8ea" font-family="Arial" font-weight="bold">${gew}</text>`;
    return g;
  };
  const gewU = [12, 14, 16, 18, 20, 22], gewO = [2, 4, 6, 8, 10];
  /* hintere zuerst */
  for (let i = gewU.length - 1; i >= 0; i--) k += hantel(d0 + 0.3 + i * (d1 - d0 - 0.5) / (gewU.length - 1), 0.35, gewU[i], i / gewU.length + 0.5);
  /* oben: Kettlebells hinten, kleine Hanteln vorne */
  const kb = (d, farbe) => {
    const sc = s(d), [x, y] = P((x0 + x1) / 2, d, 0.9), R = 0.1 * sc;
    return `<circle cx="${r(x)}" cy="${r(y - R)}" r="${r(R)}" fill="${farbe}"/><path d="M${r(x - R * 0.7)} ${r(y - R * 1.6)} Q${r(x - R * 0.7)} ${r(y - R * 2.8)} ${r(x)} ${r(y - R * 2.8)} Q${r(x + R * 0.7)} ${r(y - R * 2.8)} ${r(x + R * 0.7)} ${r(y - R * 1.6)}" stroke="#1d1f22" stroke-width="${r(R * 0.35)}" fill="none"/><ellipse cx="${r(x - R * 0.35)}" cy="${r(y - R * 1.3)}" rx="${r(R * 0.3)}" ry="${r(R * 0.2)}" fill="#fff" opacity=".25"/>`;
  };
  const kbD = [12.45, 12.05, 11.65];
  ["#d23a33", "#2f6fd0", "#f2c230"].forEach((f, i) => { k += kb(kbD[i], f); });
  for (let i = gewO.length - 1; i >= 0; i--) k += hantel(d0 + 0.3 + i * 0.32, 0.82, gewO[i], i / gewO.length * 0.6);
  /* Springseile am Haken und Faszienrollen am Ende des Ständers */
  const [hx, hy] = P(x0 + 0.35, d0 - 0.05, 1.25), shs = s(d0);
  k += `<rect x="${r(hx - 0.8)}" y="${r(hy - 0.4)}" width="1.6" height="1.2" fill="#2c2f33"/>`;
  for (const [dx, f] of [[-1.2, "#2f6fd0"], [0, "#d23a33"], [1.2, LIME]]) k += `<path d="M${r(hx + dx * 0.3)} ${r(hy + 0.6)} q${r(dx - 1.6)} ${r(0.4 * shs)} ${r(dx * 0.6)} ${r(0.62 * shs)} q${r(1.6 - dx)} ${r(-0.1 * shs)} ${r(dx * 0.4)} ${r(-0.6 * shs)}" stroke="${f}" stroke-width=".5" fill="none"/><rect x="${r(hx + dx * 0.6 - 0.5)}" y="${r(hy + 0.62 * shs)}" width="1" height="3" rx=".4" fill="#1d1f22"/>`;
  const fr = (d, xm, f) => { const sc = s(d), [x, y] = P(xm, d, 0), R = 0.075 * sc, L = 0.33 * sc; return `<rect x="${r(x - L / 2)}" y="${r(y - 2 * R)}" width="${r(L)}" height="${r(2 * R)}" rx="${r(R)}" fill="${f}"/><ellipse cx="${r(x - L / 2 + R * 0.4)}" cy="${r(y - R)}" rx="${r(R * 0.4)}" ry="${r(R)}" fill="#000" opacity=".2"/>`; };
  k += fr(d0 - 0.25, 3.45, "#2f6fd0") + fr(d0 - 0.45, 3.4, "#f07a1a");
  const [ax, ay] = P(x0, (d0 + d1) / 2);
  /* Lupe */
  const pos = (xm, d, h) => { const [x, y] = P(xm, d, h); return [x, y]; };
  const [hux, huy] = pos(x0 + 0.37, 10.7, 0.35), [kbx, kby] = pos((x0 + x1) / 2, 12.05, 0.9), [ssx, ssy] = P(x0 + 0.35, d0 - 0.05, 1.25), [frx, fry] = P(3.43, d0 - 0.35, 0);
  const unter = [
    { id: "fi_hantel", de: "die Hantel", syl: "HAN-tel", it: "il manubrio", itSyl: "ma-NU-brio", en: "dumbbell", x: hux, y: huy, kunst: flaeche(-12, -9, 26, 10),
      tipp: "Die Kurzhanteln liegen nach Gewicht sortiert: vorne leicht, hinten schwer." },
    { id: "kettlebell", de: "die Kettlebell", syl: "KETT-le-bell", it: "il kettlebell", itSyl: "KET-tle-bell", en: "kettlebell", x: kbx, y: kby, kunst: flaeche(-6, -9, 12, 9) },
    { id: "springseil", de: "das Springseil", syl: "SPRING-seil", it: "la corda per saltare", itSyl: "COR-da per sal-TA-re", en: "skipping rope", x: ssx, y: ssy, kunst: flaeche(-4, -0.5, 9, 22) },
    { id: "faszienrolle", de: "die Faszienrolle", syl: "FAS-zi-en-rol-le", it: "il rullo per fasce", itSyl: "RUL-lo per FA-sce", en: "foam roller", x: frx, y: fry, kunst: flaeche(-7, -6, 14, 6.5) },
  ];
  S.teil({ id: "hantelstaender", de: "der Hantelständer", syl: "HAN-tel-stän-der", it: "la rastrelliera dei manubri", itSyl: "ra-strel-LIE-ra dei ma-NU-bri", en: "dumbbell rack", x: ax, y: ay, steht: true, kunst: abs(ax, ay, k),
    zoom: { x: r(X(x0, d1) - 10), y: r(Y(d0, 1.4) - 2), w: 63, h: 42 }, unter });
}

/* =====================================================================
   8 — DER TRAINER (steht zwischen Bank und Hantelständer)
   ===================================================================== */
{
  const d = 9.4, sc = s(d), [x, y] = P(1.15, d);
  const m = mensch({ id: "b14b_tr", geschlecht: "m", pose: "arme_verschraenkt", blick: -24, frisur: "kurz", haarfarbe: "schwarz", haut: "dunkel",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#1d1f22" }, unterteil: { stueck: "hose", farbe: "#2a2c30" }, schuhe: { stueck: "turnschuh" } } }, 1.84 * sc);
  /* Schriftzug auf dem Shirt */
  const t = `<text x="${r(0.2)}" y="${r(-1.84 * sc * 0.7)}" font-size="1.6" text-anchor="middle" fill="${LIME}" font-family="Arial" font-weight="bold">TRAINER</text>`;
  S.teil({ id: "fi_trainer", de: "der Trainer", syl: "TRAI-ner", it: "l'allenatore", itSyl: "al-le-na-TO-re", en: "trainer", x, y, kunst: schatten(0, 0, 6, 1.2, 0.3) + m.svg + t,
    tipp: "Der Trainer zeigt, wie man die Übung richtig macht." });
}

/* =====================================================================
   9 — DAS ERGOMETER (vorne links, Blick zum Fenster)
   ===================================================================== */
{
  const d = 7.9, sc = s(d), [xc, yb] = P(-3.0, d);
  const L = 1.05 * sc, k0 = xc - L / 2;
  let k = schatten(xc, yb, L / 2 + 3, 1.3, 0.35);
  /* Standfüße */
  k += `<rect x="${r(k0 - 1)}" y="${r(yb - 1.6)}" width="${r(0.18 * sc)}" height="1.6" rx=".6" fill="#2b2d31"/><rect x="${r(k0 + L - 0.18 * sc + 1)}" y="${r(yb - 1.6)}" width="${r(0.18 * sc)}" height="1.6" rx=".6" fill="#2b2d31"/>`;
  k += `<path d="M${r(k0)} ${r(yb - 1)} L${r(k0 + L)} ${r(yb - 1)}" stroke="#3a3e43" stroke-width="1.6"/>`;
  /* Schwungrad-Gehäuse vorne (links), Rahmen, Sattel, Lenker */
  const fx = k0 + 0.24 * sc, fy = yb - 0.32 * sc, fr = 0.27 * sc;
  k += `<circle cx="${r(fx)}" cy="${r(fy)}" r="${r(fr)}" fill="${S.rg("rad", [[0, "#5a6067"], [0.7, "#3a3e43"], [1, "#1f2124"]])}"/><circle cx="${r(fx)}" cy="${r(fy)}" r="${r(fr * 0.35)}" fill="${LIME}" opacity=".8"/>`;
  k += `<path d="M${r(fx + fr * 0.3)} ${r(fy)} L${r(k0 + 0.66 * sc)} ${r(yb - 0.25 * sc)} L${r(k0 + 0.74 * sc)} ${r(yb - 0.82 * sc)}" stroke="#30343a" stroke-width="${r(0.07 * sc)}" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="M${r(k0 + 0.58 * sc)} ${r(yb - 0.84 * sc)} Q${r(k0 + 0.6 * sc)} ${r(yb - 0.92 * sc)} ${r(k0 + 0.72 * sc)} ${r(yb - 0.91 * sc)} L${r(k0 + 0.92 * sc)} ${r(yb - 0.89 * sc)} Q${r(k0 + 0.95 * sc)} ${r(yb - 0.84 * sc)} ${r(k0 + 0.9 * sc)} ${r(yb - 0.81 * sc)} Q${r(k0 + 0.74 * sc)} ${r(yb - 0.8 * sc)} ${r(k0 + 0.58 * sc)} ${r(yb - 0.84 * sc)} Z" fill="#17191b"/>`;
  k += `<path d="M${r(fx)} ${r(fy - fr * 0.6)} L${r(k0 + 0.16 * sc)} ${r(yb - 1.12 * sc)} L${r(k0 - 0.05 * sc)} ${r(yb - 1.16 * sc)}" stroke="#30343a" stroke-width="${r(0.05 * sc)}" fill="none" stroke-linecap="round"/>`;
  k += `<rect x="${r(k0 + 0.06 * sc)}" y="${r(yb - 1.3 * sc)}" width="${r(0.2 * sc)}" height="${r(0.12 * sc)}" rx=".5" fill="#1d1f22" transform="rotate(-18 ${r(k0 + 0.16 * sc)} ${r(yb - 1.24 * sc)})"/>`;
  k += `<rect x="${r(k0 + 0.09 * sc)}" y="${r(yb - 1.28 * sc)}" width="${r(0.12 * sc)}" height="${r(0.06 * sc)}" fill="#7ad0f0" transform="rotate(-18 ${r(k0 + 0.16 * sc)} ${r(yb - 1.24 * sc)})"/>`;
  /* Pedale */
  k += `<circle cx="${r(k0 + 0.45 * sc)}" cy="${r(yb - 0.36 * sc)}" r="${r(0.06 * sc)}" fill="#24272b"/><path d="M${r(k0 + 0.45 * sc)} ${r(yb - 0.36 * sc)} l${r(0.1 * sc)} ${r(0.14 * sc)}" stroke="#9aa3aa" stroke-width=".9"/><rect x="${r(k0 + 0.5 * sc)}" y="${r(yb - 0.24 * sc)}" width="${r(0.12 * sc)}" height="1.1" rx=".4" fill="#17191b"/>`;
  S.teil({ id: "ergometer", de: "das Ergometer", syl: "Er-go-ME-ter", it: "la cyclette", itSyl: "ci-CLET-te", en: "exercise bike", x: xc, y: yb, steht: true, kunst: abs(xc, yb, k),
    tipp: "Auf dem Ergometer fährt man Rad, ohne vom Fleck zu kommen." });
}

/* =====================================================================
   10 — DIE HANTELBANK mit HANDTUCH und WASSERFLASCHE
   ===================================================================== */
const BANK = { x0: 0.15, x1: 1.45, d0: 7.25, d1: 7.55 };
{
  const { x0, x1, d0, d1 } = BANK, [ax, ay] = P((x0 + x1) / 2, d1);
  let k = schatten(ax, ay, (X(x1, d1) - X(x0, d1)) / 2 + 3, 1.6, 0.4);
  for (const xm of [x0 + 0.12, x1 - 0.12]) {
    k += quader(xm - 0.05, xm + 0.05, d0 - 0.12, d1 + 0.12, 0, 0.05, { deckel: "#3a3e43", front: "#1d1f22", seite: "#2b2d31" });
    k += quader(xm - 0.04, xm + 0.04, d0 + 0.1, d0 + 0.2, 0.05, 0.36, { front: "#4a4f55", seite: "#33363b" });
  }
  k += quader(x0 + 0.1, x1 - 0.1, d0 + 0.1, d0 + 0.2, 0.3, 0.36, { front: "#5c6167", deckel: "#4a4f55" });
  k += quader(x0, x1, d0, d1, 0.36, 0.46, { deckel: S.lg("polster", [[0, "#2a2c30"], [1, "#16171a"]]), front: S.lg("polsterf", [[0, "#1f2124"], [1, "#0e0f11"]]), seite: "#1a1b1e" });
  k += `<path d="M${pt(x0 + 0.03, d0, 0.455)} L${pt(x1 - 0.03, d0, 0.455)}" stroke="#55595f" stroke-width=".35"/>`;
  k += `<path d="M${pt(x0, d0, 0.41)} L${pt(x1, d0, 0.41)}" stroke="${LIME}" stroke-width=".4"/>`;
  S.teil({ id: "fi_hantelbank", de: "die Hantelbank", syl: "HAN-tel-bank", it: "la panca", itSyl: "PAN-ca", en: "weight bench", x: ax, y: ay, steht: true, kunst: abs(ax, ay, k),
    tipp: "Auf der Hantelbank liegt man beim Bankdrücken." });
}
{
  /* DAS HANDTUCH — über das linke Ende der Bank gelegt (Handtuchpflicht) */
  const { x0, d0, d1 } = BANK;
  const a = P(x0 + 0.05, d0 - 0.02, 0.47), b = P(x0 + 0.45, d0 - 0.02, 0.47), c = P(x0 + 0.47, d0 - 0.02, 0.22), e = P(x0 + 0.03, d0 - 0.02, 0.25);
  const ao = P(x0 + 0.05, d1, 0.47), bo = P(x0 + 0.45, d1, 0.47);
  let k = `<path d="M${r(ao[0])} ${r(ao[1])} L${r(bo[0])} ${r(bo[1])} L${r(b[0])} ${r(b[1])} L${r(a[0])} ${r(a[1])} Z" fill="#f2f4f5"/>`;
  k += `<path d="M${r(a[0])} ${r(a[1])} L${r(b[0])} ${r(b[1])} Q${r(b[0] + 0.6)} ${r((b[1] + c[1]) / 2)} ${r(c[0])} ${r(c[1])} L${r(e[0])} ${r(e[1])} Q${r(a[0] - 0.6)} ${r((a[1] + e[1]) / 2)} ${r(a[0])} ${r(a[1])} Z" fill="${S.lg("htuch", [[0, "#ffffff"], [1, "#d5dade"]])}"/>`;
  k += `<path d="M${r(e[0] + 0.3)} ${r(e[1] - 1.4)} L${r(c[0] - 0.3)} ${r(c[1] - 1.4)}" stroke="${LIME}" stroke-width=".9"/>`;
  const [ax, ay] = P(x0 + 0.25, d0, 0.25);
  S.teil({ oben: true, id: "fi_handtuch", de: "das Handtuch", syl: "HAND-tuch", it: "l'asciugamano", itSyl: "a-sciu-ga-MA-no", en: "towel", x: ax, y: ay, kunst: abs(ax, ay, k),
    tipp: "Im Fitnessstudio legt man immer ein Handtuch auf die Bank." });
}
{
  /* DIE WASSERFLASCHE — steht am Boden neben der Bank */
  const d = 7.05, sc = s(d), [x, y] = P(-0.08, d);
  const h = 0.24 * sc, w = 0.075 * sc;
  let k = schatten(0, 0, w + 1, 0.6, 0.35);
  k += `<rect x="${r(-w / 2)}" y="${r(-h)}" width="${r(w)}" height="${r(h)}" rx="${r(w * 0.3)}" fill="${S.lg("trink", [[0, "#7fd0f5"], [0.5, "#2f9ad8"], [1, "#1c6fa8"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-w / 2)}" y="${r(-h * 0.62)}" width="${r(w)}" height="${r(h * 0.22)}" fill="#1d1f22" opacity=".85"/>`;
  k += `<rect x="${r(-w * 0.35)}" y="${r(-h - 2)}" width="${r(w * 0.7)}" height="2.2" rx=".5" fill="${LIME}"/><rect x="${r(-w / 2 + 0.5)}" y="${r(-h + 1)}" width=".6" height="${r(h - 2)}" fill="#fff" opacity=".5"/>`;
  S.teil({ oben: true, id: "fi_wasserflasche", de: "die Wasserflasche", syl: "WAS-ser-fla-sche", it: "la bottiglia d'acqua", itSyl: "bot-TI-glia d'AC-qua", en: "water bottle", x, y, kunst: k,
    tipp: "Beim Training trinkt man viel Wasser." });
}

/* =====================================================================
   11 — DIE GEWICHTSSCHEIBE auf dem Scheibenständer (vorne rechts)
   ===================================================================== */
{
  const d = 5.7, sc = s(d), [x, y] = P(2.2, d);
  let k = schatten(0, 0, 0.35 * sc, 1.6, 0.4);
  /* Ständer: Fuß, Mittelsäule, vier Hörner */
  k += `<path d="M${r(-0.32 * sc)} 0 L${r(-0.08 * sc)} ${r(-0.06 * sc)} L${r(0.08 * sc)} ${r(-0.06 * sc)} L${r(0.32 * sc)} 0 Z" fill="#1d1f22"/>`;
  k += `<rect x="${r(-0.03 * sc)}" y="${r(-1.15 * sc)}" width="${r(0.06 * sc)}" height="${r(1.1 * sc)}" fill="${S.lg("saeule", [[0, "#2c2f33"], [0.5, "#4a4f55"], [1, "#1f2124"]], 0, 0, 1, 0)}"/>`;
  const scheibe = (cx, cy, R, farbe, gew) => `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R)}" fill="${S.rg("sch" + gew, [[0, farbe], [0.85, farbe], [1, "#0f1012"]], 0.45, 0.4, 0.65)}"/><circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R * 0.82)}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".3"/><circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R * 0.16)}" fill="#c9cfd4"/><circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R * 0.08)}" fill="#3a3e43"/><text x="${r(cx)}" y="${r(cy - R * 0.45)}" font-size="${r(R * 0.26)}" text-anchor="middle" fill="#f1f3f4" font-family="Arial" font-weight="bold">${gew} kg</text><path d="M${r(cx - R * 0.8)} ${r(cy - R * 0.2)} A${r(R)} ${r(R)} 0 0 1 ${r(cx - R * 0.1)} ${r(cy - R * 0.9)}" stroke="#fff" stroke-width=".5" opacity=".25" fill="none"/>`;
  k += scheibe(-0.13 * sc, -0.42 * sc, 0.225 * sc, "#2a2c30", 20);
  k += scheibe(0.14 * sc, -0.36 * sc, 0.19 * sc, "#2f5f9f", 15);
  k += scheibe(-0.1 * sc, -0.92 * sc, 0.14 * sc, "#2f7a3a", 10);
  k += scheibe(0.1 * sc, -0.88 * sc, 0.1 * sc, "#a8322c", 5);
  S.teil({ id: "fi_gewichtsscheibe", de: "die Gewichtsscheibe", syl: "Ge-WICHTS-schei-be", it: "il disco", itSyl: "DI-sco", en: "weight plate", x, y, steht: true, kunst: k,
    tipp: "Die Gewichtsscheiben steckt man auf die Langhantel." });
}

/* =====================================================================
   12 — DIE MATTE und DER GYMNASTIKBALL (Dehnecke vorne)
   ===================================================================== */
{
  const x0 = -1.85, x1 = 0.0, d0 = 5.0, d1 = 5.62, [ax, ay] = P((x0 + x1) / 2, d0);
  let k = quader(x0, x1, d0, d1, 0, 0.015, { deckel: S.lg("matte", [[0, "#2f7fd0"], [1, "#2468b0"]]), front: "#1b4f86", seite: "#1b4f86" });
  k += `<path d="M${pt(x0 + 0.05, (d0 + d1) / 2, 0.016)} L${pt(x1 - 0.05, (d0 + d1) / 2, 0.016)}" stroke="#5aa0e8" stroke-width=".4" opacity=".6"/>`;
  /* zusammengerollte zweite Matte am Ende */
  const [rx, ry] = P(x1 - 0.15, d1 + 0.25), rr = 0.09 * s(d1 + 0.25);
  k += `<rect x="${r(rx - 0.32 * s(d1 + 0.25))}" y="${r(ry - 2 * rr)}" width="${r(0.6 * s(d1 + 0.25))}" height="${r(2 * rr)}" rx="${r(rr)}" fill="#8a4fc0"/><ellipse cx="${r(rx + 0.28 * s(d1 + 0.25) - rr * 0.3)}" cy="${r(ry - rr)}" rx="${r(rr * 0.45)}" ry="${r(rr)}" fill="#6d3a9c"/><path d="M${r(rx + 0.28 * s(d1 + 0.25) - rr * 0.3)} ${r(ry - rr)} m-.6 0 a.6 .9 0 1 0 1.2 0" stroke="#b58ae0" stroke-width=".3" fill="none"/>`;
  S.teil({ id: "fi_matte", de: "die Matte", syl: "MAT-te", it: "il tappetino", itSyl: "tap-pe-TI-no", en: "mat", x: ax, y: ay, kunst: abs(ax, ay, k),
    tipp: "Auf der Matte macht man Übungen am Boden und dehnt sich." });
}
{
  const d = 5.1, sc = s(d), [x, y] = P(-2.5, d), R = 0.27 * sc;
  let k = schatten(0, 0, R * 0.9, 2, 0.45);
  k += `<circle cx="0" cy="${r(-R)}" r="${r(R)}" fill="${S.rg("ball", [[0, "#ffd36b"], [0.55, "#f2a51a"], [1, "#b36b05"]], 0.36, 0.3, 0.75)}"/>`;
  k += `<path d="M${r(-R * 0.95)} ${r(-R * 1.2)} Q0 ${r(-R * 0.75)} ${r(R * 0.95)} ${r(-R * 1.25)}" stroke="#d98a10" stroke-width=".4" fill="none" opacity=".6"/>`;
  k += `<ellipse cx="${r(-R * 0.35)}" cy="${r(-R * 1.45)}" rx="${r(R * 0.25)}" ry="${r(R * 0.14)}" fill="#fff" opacity=".45"/>`;
  S.teil({ id: "gymnastikball", de: "der Gymnastikball", syl: "gym-NAS-tik-ball", it: "la palla da ginnastica", itSyl: "PAL-la da gin-NA-sti-ca", en: "exercise ball", x, y, steht: true, kunst: k });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/fitnessstudio.js"));
console.log(aus);
