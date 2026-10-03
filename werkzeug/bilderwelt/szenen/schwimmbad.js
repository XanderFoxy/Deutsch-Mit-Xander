#!/usr/bin/env node
/* =====================================================================
   DAS SCHWIMMBAD (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Bäderbeschreibungen kommunaler Hallenbäder, z. B. Lindenbad
   Halle/Westf., Hallenbad Einsiedlerbach Hameln, Freizeitbad Werra;
   Normen für Sportbecken) — so sieht ein deutsches Hallenbad aus:
   - Sportbecken 25 m lang, meist 4–6 Bahnen zu 2,5 m. Die Bahnen trennen
     schwimmende BAHNLEINEN aus Scheiben; die letzten 5 m vor der Wand
     sind rot. Am Boden dunkle Bahnmarkierungen mit „T“ vor der Wand.
   - Am tiefen Ende die STARTBLÖCKE mit Bahnnummern und Griff für den
     Rückenstart; 5 m vor der Wand eine Leine mit WIMPELN (Rückenschwimmer).
   - Rundum eine Überlaufrinne mit Gitter, Boden aus rutschfesten Fliesen.
   - Sprunganlage am tiefen Ende: 1-m-BRETT und 3-m-TURM mit Leiter.
   - Der Schwimmmeister (umgangssprachlich BADEMEISTER) sitzt auf einem
     HOCHSITZ am Beckenrand; daran hängt ein RETTUNGSRING.
   - Edelstahl-LEITERN an der Beckenseite, große Schwimmuhr mit
     Sekundenzeiger an der Stirnwand, DUSCHEN am Rand (vor dem Baden
     duschen!), Oberlichter, oft Holz an Wand und Decke.
   - Am Rand: Liegen, ein Gitterwagen mit Schwimmbrettern, Poolnudeln,
     Schwimmflügeln und Tauchringen für den Schwimmkurs.
   Maßstab (Zentralperspektive, Blick von der Galerie am flachen Ende):
   Augenhöhe 3,6 m über dem Beckenrand, Fluchtpunkt (140 | 50).
   Einheiten je Meter = 656 / Abstand: Stirnwand ≈ 14, ferner Beckenrand
   15, naher Beckenrand 35, Bildunterkante ≈ 42.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "schwimmbad", titel: "Das Schwimmbad", emoji: "🏊", thema: "Freizeit", kuerzel: "b14a", fassung: 852 });
const rnd = zufall(2512);
const r = B.r;
/* Menschen knapper speichern: In den kleinen Figuren reichen ganze
   Zentimeter für die Umrisse (bei Maßstab < 0,3 sind das < 0,15 Einheiten). */
const knapp = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);
const mensch = (spec, h) => { const m = B.mensch(spec, h); m.svg = knapp(m.svg); return m; };

/* ---------- Perspektive ---------------------------------------------- */
const VX = 140, YH = 50, H = 3.6, F = 656;
const s = (d) => F / d;                                  // Einheiten je Meter
const X = (xm, d) => VX + xm * F / d;                    // seitlich (m) → x
const Y = (d, h = 0) => YH + (H - h) * F / d;            // Höhe (m) → y
const pt = (xm, d, h = 0) => `${r(X(xm, d))} ${r(Y(d, h))}`;
const D_W = 46.25, D_F = 43.75, D_N = 18.75, D_U = 15.6;   // Stirnwand, ferner/naher Rand, Bildunterkante
const B_L = -5, B_R = 5, W_L = -8, W_R = 11;              // Becken, Wände
const yW = Y(D_W), yF = Y(D_F), yN = Y(D_N);
/* Vieleck auf den Bildrand (x 0…320) beschneiden — die Trefferfläche
   eines Dings darf nicht aus dem Bild ragen. */
function imBild(pts) {
  const schnitt = (pp, innen, t) => { const o = []; for (let i = 0; i < pp.length; i++) { const a = pp[i], b = pp[(i + 1) % pp.length];
    const ia = innen(a), ib = innen(b); if (ia) o.push(a); if (ia !== ib) { const u = t(a, b); o.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]); } } return o; };
  let q = schnitt(pts, (p) => p[0] >= 0, (a, b) => (0 - a[0]) / (b[0] - a[0]));
  q = schnitt(q, (p) => p[0] <= 320, (a, b) => (320 - a[0]) / (b[0] - a[0]));
  return "M" + q.map((p) => `${r(p[0])} ${r(p[1])}`).join(" L") + " Z";
}
const ecke = (xm, d) => [X(xm, d), Y(d)];
const trapez = (xa, xb, da, db) => imBild([ecke(xa, da), ecke(xb, da), ecke(xb, db), ecke(xa, db)]);

/* ---------- Farben ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const STAHL = S.lg("stahl", [[0, "#f4f6f7"], [0.45, "#c5ccd2"], [0.55, "#aab3ba"], [1, "#e6eaed"]], 0, 0, 1, 0);
const WEISS = S.lg("weiss", [[0, "#ffffff"], [1, "#d9e1e5"]]);
const HOLZ = S.lg("holz", [[0, "#d7b07a"], [1, "#c39760"]]);
S.def(`<pattern id="${S.id("fl")}" width="3.4" height="3.4" patternUnits="userSpaceOnUse"><rect width="3.4" height="3.4" fill="#f3f7f8"/><path d="M0 .1H3.4M.1 0V3.4" stroke="#c3d2d8" stroke-width=".3"/></pattern>`);
S.def(`<pattern id="${S.id("mos")}" width="1.6" height="1.6" patternUnits="userSpaceOnUse"><rect width="1.6" height="1.6" fill="#2f86b8"/><rect width="1.4" height="1.4" x=".1" y=".1" fill="#3b97c8"/><rect width=".7" height=".7" x=".2" y=".2" fill="#5aaed8" opacity=".6"/></pattern>`);
S.def(`<pattern id="${S.id("lat")}" width="3" height="10" patternUnits="userSpaceOnUse"><rect width="3" height="10" fill="#cfa36a"/><rect width=".5" height="10" fill="#a87b45"/><rect x="1.2" width=".6" height="10" fill="#dcb47f" opacity=".6"/></pattern>`);
const FLIESE = `url(#${S.id("fl")})`, MOSAIK = `url(#${S.id("mos")})`, LATTEN = `url(#${S.id("lat")})`;

/* =====================================================================
   KULISSE — Stirnwand, Seitenwände, Boden (nicht antippbar)
   ===================================================================== */
{
  const hW = (h) => Y(D_W, h);
  let k = `<rect x="0" y="-2" width="320" height="${r(yW + 2)}" fill="${LATTEN}"/>`;
  /* Deckenkante mit Licht */
  k += `<rect x="0" y="-2" width="320" height="5" fill="#9c7444"/><rect x="0" y="3" width="320" height="1" fill="#6e5030" opacity=".5"/>`;
  /* Fliesen bis 2,6 m, darüber ein blaues Mosaikband */
  k += `<rect x="0" y="${r(hW(2.6))}" width="320" height="${r(yW - hW(2.6))}" fill="${FLIESE}"/>`;
  k += `<rect x="0" y="${r(hW(2.75))}" width="320" height="${r(hW(2.6) - hW(2.75))}" fill="${MOSAIK}"/>`;
  k += `<rect x="0" y="${r(hW(2.75))}" width="320" height="${r(yW - hW(2.75))}" fill="${S.lg("wandlicht", [[0, "#fff", 0], [1, "#5b7f8f", 0.18]])}"/>`;
  /* linke Seitenwand (fluchtet zum Fluchtpunkt) */
  const lw = (h, d) => pt(W_L, d, h);
  const dL0 = 8 * F / VX; /* Abstand, bei dem die linke Wand den Bildrand trifft */
  k += `<path d="M${lw(7.5, D_W)} L${lw(0, D_W)} L0 ${r(Y(dL0))} L0 ${r(Y(dL0, 7.5))} Z" fill="${LATTEN}"/>`;
  k += `<path d="M${lw(2.6, D_W)} L${lw(0, D_W)} L0 ${r(Y(dL0))} L0 ${r(Y(dL0, 2.6))} Z" fill="${S.lg("lwand", [[0, "#e9f0f2"], [1, "#cdd9de"]], 0, 0, 1, 0)}"/>`;
  for (let h = 0.25; h < 2.6; h += 0.25) k += `<path d="M${lw(h, D_W)} L0 ${r(Y(dL0, h))}" stroke="#b9c9d0" stroke-width=".3"/>`;
  k += `<path d="M${lw(2.75, D_W)} L${lw(2.6, D_W)} L0 ${r(Y(dL0, 2.6))} L0 ${r(Y(dL0, 2.75))} Z" fill="#2f86b8"/>`;
  k += `<path d="M${lw(7.5, D_W)} L${lw(0, D_W)} L0 ${r(Y(dL0))} L0 ${r(Y(dL0, 7.5))} Z" fill="#000" opacity=".1"/>`;
  /* rechte Seitenwand: Glasfront zum Garten (schmaler Streifen) */
  const dR0 = 11 * F / (320 - VX);
  k += `<path d="M${pt(W_R, D_W, 7.5)} L${pt(W_R, D_W)} L320 ${r(Y(dR0))} L320 ${r(Y(dR0, 7.5))} Z" fill="${S.lg("rglas", [[0, "#cfe9f5"], [1, "#9cc9a4"]])}"/>`;
  k += `<path d="M${pt(W_R, D_W, 0.5)} L320 ${r(Y(dR0, 0.5))}" stroke="#7d8b91" stroke-width=".8"/>`;
  /* Fliesenboden der Beckenumgänge in Fluchtperspektive */
  k += `<path d="M0 ${r(Y(dL0))} L${pt(W_L, D_W)} L${pt(W_R, D_W)} L320 ${r(Y(dR0))} L320 200 L0 200 Z" fill="${S.lg("boden", [[0, "#e7e2d8"], [1, "#cfc8bb"]])}"/>`;
  let lin = "";
  for (let xm = -8; xm <= 11.01; xm += 0.5) lin += `M${pt(xm, D_W)} L${pt(xm, D_U)}`;
  for (let d = D_U; d <= D_W; d += d < 25 ? 0.5 : 1) lin += `M0 ${r(Y(d))} H320`;
  k += `<path d="${lin}" stroke="#b3ab9d" stroke-width=".3" opacity=".7"/>`;
  k += `<rect x="0" y="${r(yW - 0.6)}" width="320" height="1.2" fill="#9fb3bb"/>`;
  /* Lichtschein der Oberlichter auf dem nassen Boden */
  k += `<path d="M0 200 L0 ${r(Y(dL0))} L${pt(W_L, D_W)} L${pt(W_R, D_W)} L320 ${r(Y(dR0))} L320 200 Z" fill="${S.lg("bodenglanz", [[0, "#fff", 0.25], [0.5, "#fff", 0], [1, "#000", 0.06]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE FENSTER (Oberlichter in der Stirnwand)
   ===================================================================== */
{
  const y0 = Y(D_W, 6.7), y1 = Y(D_W, 4.9);
  let k = `<rect x="2" y="${r(y0 - 1)}" width="316" height="${r(y1 - y0 + 2)}" fill="#6d7a80"/>`;
  k += `<rect x="3" y="${r(y0)}" width="314" height="${r(y1 - y0)}" fill="${S.lg("himmel", [[0, "#8fc4ea"], [0.7, "#cfe6f5"], [1, "#e9f3ea"]])}"/>`;
  /* Bäume vor dem Fenster */
  for (let i = 0; i < 17; i++) { const x = 14 + i * 18 + rnd() * 6; k += `<ellipse cx="${r(x)}" cy="${r(y1 - 1)}" rx="${r(6 + rnd() * 4)}" ry="${r(3 + rnd() * 2)}" fill="${rnd() < 0.5 ? "#86ad78" : "#9dbc85"}" opacity=".85"/>`; }
  for (let x = 3; x <= 317; x += 19.6) k += `<rect x="${r(x - 0.6)}" y="${r(y0)}" width="1.2" height="${r(y1 - y0)}" fill="#59666c"/>`;
  k += `<rect x="3" y="${r((y0 + y1) / 2 - 0.4)}" width="314" height=".8" fill="#59666c"/>`;
  for (let x = 10; x < 317; x += 39) k += `<path d="M${x} ${r(y0)} l7 0 l-9 ${r(y1 - y0)} l-7 0 Z" fill="#fff" opacity=".22"/>`;
  S.teil({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: 160, y: r(y1 + 1), kunst: `<g transform="translate(-160 ${r(-y1 - 1)})">${k}</g>` });
}

/* =====================================================================
   2 — DIE UHR (große Schwimmuhr mit rotem Sekundenzeiger)
   ===================================================================== */
{
  const R = 9.5;
  let k = `<circle r="${R + 1.4}" fill="#1f2a30"/><circle r="${R}" fill="${S.rg("ziff", [[0, "#ffffff"], [1, "#e6ecef"]])}"/>`;
  for (let i = 0; i < 60; i++) {
    const a = i * Math.PI / 30, l = i % 5 ? 0.9 : 2;
    k += `<line x1="${r(Math.sin(a) * (R - 0.5))}" y1="${r(-Math.cos(a) * (R - 0.5))}" x2="${r(Math.sin(a) * (R - 0.5 - l))}" y2="${r(-Math.cos(a) * (R - 0.5 - l))}" stroke="${i % 15 ? "#26323a" : "#c0262d"}" stroke-width="${i % 5 ? 0.25 : 0.6}"/>`;
  }
  for (const [n, a] of [[60, 0], [15, 90], [30, 180], [45, 270]]) k += `<text x="${r(Math.sin(a * Math.PI / 180) * (R - 4.2))}" y="${r(-Math.cos(a * Math.PI / 180) * (R - 4.2) + 1)}" font-size="2.6" text-anchor="middle" fill="#26323a" font-family="Arial" font-weight="bold">${n}</text>`;
  /* zehn nach drei, der rote Sekundenzeiger läuft */
  k += `<line x1="0" y1="0" x2="${r(Math.sin(3.17 * Math.PI / 6) * 4.4)}" y2="${r(-Math.cos(3.17 * Math.PI / 6) * 4.4)}" stroke="#1d262b" stroke-width=".9" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="0" x2="${r(Math.sin(2 * Math.PI / 6) * 6.6)}" y2="${r(-Math.cos(2 * Math.PI / 6) * 6.6)}" stroke="#1d262b" stroke-width=".6" stroke-linecap="round"/>`;
  k += `<line x1="${r(-Math.sin(4.3) * 2)}" y1="${r(Math.cos(4.3) * 2)}" x2="${r(Math.sin(4.3) * 8.4)}" y2="${r(-Math.cos(4.3) * 8.4)}" stroke="#d7262e" stroke-width=".45"/><circle r=".8" fill="#d7262e"/>`;
  k += `<path d="M${-R + 2} -4 A${R} ${R} 0 0 1 3 ${-R + 0.6}" stroke="#fff" stroke-width="1" opacity=".7" fill="none"/>`;
  S.teil({ id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: VX, y: r(Y(D_W, 3.9)), kunst: k,
    tipp: "An der großen Uhr sieht man die Sekunden: So misst man die Zeit für 50 Meter." });
}

/* =====================================================================
   3 — DIE DUSCHE (drei Duschsäulen am Rand, vor dem Baden duschen)
   ===================================================================== */
{
  const d = D_W - 0.05, sc = s(d), x0 = X(6.4, d), x1 = X(10.6, d), y0 = Y(d);
  let k = `<rect x="${r(x0)}" y="${r(Y(d, 2.45))}" width="${r(x1 - x0)}" height="${r(y0 - Y(d, 2.45))}" fill="${MOSAIK}"/>`;
  k += `<rect x="${r(x0)}" y="${r(Y(d, 2.45))}" width="${r(x1 - x0)}" height="${r(y0 - Y(d, 2.45))}" fill="${S.lg("mosl", [[0, "#fff", 0.25], [1, "#000", 0.12]])}"/>`;
  [7.2, 8.5, 9.8].forEach((xm, i) => {
    const x = X(xm, d);
    k += `<rect x="${r(x - 0.5)}" y="${r(Y(d, 2.15))}" width="1" height="${r(y0 - Y(d, 2.15) - 0.4)}" fill="${STAHL}"/>`;
    k += `<path d="M${r(x)} ${r(Y(d, 2.15))} q0 -1.2 2.2 -1.2 h1" stroke="#b9c2c8" stroke-width=".8" fill="none"/>`;
    k += `<ellipse cx="${r(x + 3.4)}" cy="${r(Y(d, 2.15) - 0.6)}" rx="1.8" ry=".7" fill="${STAHL}" stroke="#8a949b" stroke-width=".2"/>`;
    k += `<rect x="${r(x - 1.1)}" y="${r(Y(d, 1.2))}" width="2.2" height="1.6" rx=".4" fill="#d9dee1" stroke="#8a949b" stroke-width=".2"/><circle cx="${r(x)}" cy="${r(Y(d, 1.2) + 0.8)}" r=".5" fill="#2f6fb0"/>`;
    if (i === 1) for (let j = 0; j < 9; j++) k += `<line x1="${r(x + 2.2 + j * 0.3)}" y1="${r(Y(d, 2.15) + 0.2)}" x2="${r(x + 1.4 + j * 0.45)}" y2="${r(y0 - 1)}" stroke="#e8f7ff" stroke-width=".25" opacity=".7"/>`;
  });
  k += `<rect x="${r(x0)}" y="${r(y0 - 0.9)}" width="${r(x1 - x0)}" height=".9" fill="#7e98a4"/>`;
  k += `<text x="${r((x0 + x1) / 2)}" y="${r(Y(d, 2.6))}" font-size="2.3" text-anchor="middle" fill="#1f5f86" font-family="Arial" font-weight="bold">Vor dem Baden duschen</text>`;
  const cx = (x0 + x1) / 2;
  S.teil({ id: "dusche", de: "die Dusche", syl: "DU-sche", it: "la doccia", itSyl: "DOC-cia", en: "shower", x: cx, y: y0, steht: true, kunst: `<g transform="translate(${r(-cx)} ${r(-y0)})">${k}</g>`,
    tipp: "Vor dem Schwimmen duscht man sich – das ist im Schwimmbad Pflicht." });
}

/* =====================================================================
   4 — DER STARTBLOCK (vier Blöcke mit Bahnnummern am tiefen Ende)
   ===================================================================== */
{
  const d = D_F + 0.35, sc = s(d);
  let k = "";
  [-3.75, -1.25, 1.25, 3.75].forEach((xm, i) => {
    const x = X(xm, d), yb = Y(d), w = 0.5 * sc, hP = 0.72 * sc;
    k += schatten(x, yb, w * 0.7, 0.6, 0.3);
    /* Sockel und schräge Plattform (vorn tiefer, zum Wasser) */
    k += `<path d="M${r(x - w * 0.42)} ${r(yb)} L${r(x - w * 0.42)} ${r(yb - hP)} L${r(x + w * 0.42)} ${r(yb - hP)} L${r(x + w * 0.42)} ${r(yb)} Z" fill="${S.lg("sockel", [[0, "#ffffff"], [1, "#c9d3d8"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${r(x - w / 2)} ${r(yb - hP + 0.9)} L${r(x + w / 2)} ${r(yb - hP + 0.9)} L${r(x + w / 2 - 0.3)} ${r(yb - hP - 1.4)} L${r(x - w / 2 + 0.3)} ${r(yb - hP - 1.4)} Z" fill="#2f6fb0"/>`;
    k += `<path d="M${r(x - w / 2)} ${r(yb - hP + 0.9)} L${r(x + w / 2)} ${r(yb - hP + 0.9)} L${r(x + w / 2)} ${r(yb - hP + 1.6)} L${r(x - w / 2)} ${r(yb - hP + 1.6)} Z" fill="#1d4d80"/>`;
    /* Griff für den Rückenstart */
    k += `<path d="M${r(x - w / 2 - 0.4)} ${r(yb - hP + 0.6)} v-2 h${r(w + 0.8)} v2" stroke="#c4ccd2" stroke-width=".45" fill="none"/>`;
    k += `<text x="${r(x)}" y="${r(yb - hP * 0.4)}" font-size="${r(0.32 * sc)}" text-anchor="middle" fill="#1d4d80" font-family="Arial" font-weight="bold">${i + 1}</text>`;
  });
  const cx = VX;
  S.teil({ id: "startblock", de: "der Startblock", syl: "START-block", it: "il blocco di partenza", itSyl: "BLOC-co di par-TEN-za", en: "starting block", x: cx, y: Y(d), steht: true,
    kunst: `<g transform="translate(${-cx} ${r(-Y(d))})">${k}</g>`, tipp: "Vom Startblock springt man beim Wettkampf ins Wasser." });
}

/* =====================================================================
   5 — DER SCHWIMMER (wartet am tiefen Ende neben Block 4)
   ===================================================================== */
{
  const d = 45.3, sc = s(d);
  const m = mensch({ id: "b14a_schw", geschlecht: "m", pose: "strecken", blick: 20, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "badeshirt", farbe: "#1d3a5c" }, unterteil: { stueck: "badehose", farbe: "#1d3a5c" } } }, 1.8 * sc);
  S.teil({ id: "schwimmer", de: "der Schwimmer", syl: "SCHWIM-mer", it: "il nuotatore", itSyl: "nuo-ta-TO-re", en: "swimmer", x: X(5.55, d), y: Y(d), kunst: schatten(0, 0, 4, 0.6, 0.25) + m.svg,
    tipp: "Der Schwimmer dehnt sich, bevor er ins Wasser springt." });
}

/* =====================================================================
   6 — DER SPRUNGTURM (3 m): gefliester Betonturm, Treppe, Geländer
   ===================================================================== */
{
  const d = 40.5, sc = s(d), yb = Y(d), yP = Y(d, 3);
  const xL = X(-7.75, d), xR = X(-6.05, d);
  let k = schatten((xL + xR) / 2 + 4, yb, 20, 1.3, 0.3);
  /* Turmkörper: weiß gefliest, Kante blau, Schattenseite links */
  k += `<rect x="${r(xL)}" y="${r(yP + 2)}" width="${r(xR - xL)}" height="${r(yb - yP - 2)}" fill="${FLIESE}"/>`;
  k += `<rect x="${r(xL)}" y="${r(yP + 2)}" width="${r(xR - xL)}" height="${r(yb - yP - 2)}" fill="${S.lg("turmlicht", [[0, "#3d5f70", 0.28], [0.35, "#fff", 0], [1, "#fff", 0.15]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(xL)}" y="${r(yb - 3)}" width="${r(xR - xL)}" height="3" fill="${MOSAIK}"/>`;
  k += `<text x="${r((xL + xR) / 2)}" y="${r(yP + 7)}" font-size="2.6" text-anchor="middle" fill="#1f5f86" font-family="Arial" font-weight="bold">3 m</text>`;
  /* Plattform, Geländer hinten und an der Treppe */
  k += `<path d="M${r(xL - 1)} ${r(yP)} L${r(xR + 1)} ${r(yP)} L${r(xR + 1)} ${r(yP + 2.2)} L${r(xL - 1)} ${r(yP + 2.2)} Z" fill="#2f86b8"/>`;
  k += `<rect x="${r(xL - 1)}" y="${r(yP - 0.5)}" width="${r(xR - xL + 2)}" height=".8" fill="#9ccbe8"/>`;
  const yG = yP - 1.0 * sc;
  k += `<path d="M${r(xL - 0.4)} ${r(yP)} V${r(yG)} Q${r(xL - 0.4)} ${r(yG - 0.8)} ${r(xL + 0.6)} ${r(yG - 0.8)} H${r(xR - 1)} Q${r(xR)} ${r(yG - 0.8)} ${r(xR)} ${r(yG)} V${r(yP)} M${r(xL - 0.4)} ${r((yP + yG) / 2)} H${r(xR)}" stroke="${STAHL}" stroke-width="1" fill="none"/>`;
  /* Treppe links mit Handlauf */
  const tx0 = xL - 15, n = 9;
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n;
    const x0 = tx0 + (xL - tx0) * t0, x1 = tx0 + (xL - tx0) * t1, y1 = yb + (yP - yb) * t1;
    k += `<rect x="${r(x0)}" y="${r(y1)}" width="${r(x1 - x0 + 0.3)}" height="${r(yb - y1)}" fill="${i % 2 ? "#e4ecef" : "#edf3f5"}"/>`;
    k += `<rect x="${r(x0)}" y="${r(y1)}" width="${r(x1 - x0 + 0.3)}" height=".6" fill="#2f86b8"/>`;
  }
  k += `<path d="M${r(tx0)} ${r(yb)} L${r(xL)} ${r(yP)} L${r(xL)} ${r(yb)} Z" fill="#000" opacity=".06"/>`;
  k += `<path d="M${r(tx0 - 0.5)} ${r(yb - 0.95 * sc)} L${r(xL - 0.4)} ${r(yG)} M${r(tx0 - 0.5)} ${r(yb - 0.95 * sc)} V${r(yb)}" stroke="${STAHL}" stroke-width=".8" fill="none"/>`;
  /* das 3-m-Brett ragt über das Wasser */
  const xB = X(-2.7, d);
  k += `<path d="M${r(xR - 2)} ${r(yP - 1.2)} L${r(xB)} ${r(yP - 1.2)} Q${r(xB + 1.2)} ${r(yP - 1.2)} ${r(xB + 1.2)} ${r(yP - 0.2)} L${r(xB + 1.2)} ${r(yP + 0.3)} L${r(xR - 2)} ${r(yP + 0.3)} Z" fill="${S.lg("brett3", [[0, "#ffffff"], [0.5, "#f1f4f5"], [1, "#b8c4ca"]])}"/>`;
  k += `<rect x="${r(xR - 2)}" y="${r(yP - 1.7)}" width="${r(xB - xR + 2)}" height=".6" fill="#5aa0d0"/>`;
  k += `<path d="M${r(xR + 6)} ${r(yP + 0.3)} L${r(xR + 4.5)} ${r(yP + 4)} L${r(xR + 8.5)} ${r(yP + 4)} L${r(xR + 7)} ${r(yP + 0.3)} Z" fill="#9aa5ab"/>`;
  const cx = (tx0 + xB) / 2;
  S.teil({ id: "sprungturm", de: "der Sprungturm", syl: "SPRUNG-turm", it: "il trampolino", itSyl: "tram-po-LI-no", en: "diving tower", x: cx, y: yb, steht: true,
    kunst: `<g transform="translate(${r(-cx)} ${r(-yb)})">${k}</g>`, tipp: "Vom Sprungturm springt man aus drei Metern Höhe – nur ins tiefe Wasser!" });
}

/* =====================================================================
   7 — DAS BECKEN (Wasser, Überlaufrinne, Bodenmarkierungen, Wellen)
   ===================================================================== */
{
  let k = "";
  /* Rand mit Überlaufrinne und Gitter */
  k += `<path d="${trapez(B_L - 0.45, B_R + 0.45, D_F + 0.45, D_N - 0.45)}" fill="#f4f6f6"/>`;
  k += `<path d="${trapez(B_L - 0.3, B_R + 0.3, D_F + 0.3, D_N - 0.3)}" fill="${S.lg("rinne", [[0, "#8fa3ac"], [1, "#6b818b"]])}"/>`;
  let gitter = "";
  const drin = (xm, d) => X(xm, d) > 0.5 && X(xm, d) < 319.5;
  for (let d = D_N - 0.3; d < D_F + 0.3; d += 0.25) { if (drin(B_L - 0.3, d)) gitter += `M${pt(B_L - 0.3, d)} L${pt(B_L, d)}`; if (drin(B_R + 0.3, d)) gitter += `M${pt(B_R, d)} L${pt(B_R + 0.3, d)}`; }
  for (let xm = B_L - 0.3; xm < B_R + 0.3; xm += 0.25) { if (drin(xm, D_N)) gitter += `M${pt(xm, D_N - 0.3)} L${pt(xm, D_N)}`; gitter += `M${pt(xm, D_F)} L${pt(xm, D_F + 0.3)}`; }
  k += `<path d="${gitter}" stroke="#e7eef1" stroke-width=".3"/>`;
  /* Wasser */
  const WP = trapez(B_L, B_R, D_F, D_N);
  k += `<path d="${WP}" fill="${S.lg("wasser", [[0, "#9fdbe8"], [0.12, "#56bdd8"], [0.5, "#2a9dcb"], [1, "#1784b8"]])}"/>`;
  /* Bahnmarkierungen am Beckenboden (schwarzblau, mit T vor der Wand) */
  let mark = "";
  for (const xm of [-3.75, -1.25, 1.25, 3.75]) {
    const a = D_N + 2, b = D_F - 2, w = 0.13;
    mark += `M${pt(xm - w, b)} L${pt(xm + w, b)} L${pt(xm + w, a)} L${pt(xm - w, a)} Z`;
    for (const dd of [a, b]) mark += `M${pt(xm - 0.5, dd + 0.12)} L${pt(xm + 0.5, dd + 0.12)} L${pt(xm + 0.5, dd - 0.12)} L${pt(xm - 0.5, dd - 0.12)} Z`;
  }
  k += `<path d="${mark}" fill="#123f66" opacity=".45"/>`;
  /* Spiegelung der Oberlichter hinten und Licht-Netz (Kaustik) */
  k += `<path d="${trapez(B_L, B_R, D_F, 34)}" fill="${S.lg("spiegel", [[0, "#ffffff", 0.55], [1, "#ffffff", 0]])}"/>`;
  let wellen = "";
  for (let d = D_N + 0.35; d < D_F - 0.2; d *= 1.045) {
    const sc = s(d), y = Y(d), xa = Math.max(0, X(B_L, d)), xb = Math.min(320, X(B_R, d)), lw = 0.55 * sc;
    let p = `M${r(xa)} ${r(y)}`, x = xa, up = rnd() < 0.5;
    while (x < xb - 0.1) { const nx = Math.min(xb, x + lw * (0.7 + rnd() * 0.6)); p += ` Q${r((x + nx) / 2)} ${r(y + (up ? -1 : 1) * 0.05 * sc)} ${r(nx)} ${r(y)}`; up = !up; x = nx; }
    wellen += `<path d="${p}" stroke="#e9fbff" stroke-width="${r(0.25 + sc * 0.018)}" opacity="${r(0.18 + rnd() * 0.18)}" fill="none"/>`;
  }
  k += wellen;
  /* Schatten der Rinne auf dem Wasser vorne, Glanz */
  k += `<path d="${trapez(B_L, B_R, D_N + 0.5, D_N)}" fill="#0b5a86" opacity=".25"/>`;
  const cy = Y(D_N);
  S.teil({ id: "becken", de: "das Schwimmbecken", syl: "SCHWIMM-be-cken", it: "la piscina", itSyl: "pi-SCI-na", en: "swimming pool", x: VX, y: cy,
    kunst: `<g transform="translate(${-VX} ${r(-cy)})">${k}</g>`, tipp: "Das Sportbecken ist 25 Meter lang. Eine Bahn hin und zurück sind 50 Meter." });
}

/* =====================================================================
   8 — DIE BAHNLEINE (schwimmende Scheiben, die letzten 5 m rot)
   ===================================================================== */
{
  let k = "";
  for (const xm of [-2.5, 0, 2.5]) {
    /* Schatten auf dem Wasser */
    k += `<path d="M${pt(xm + 0.08, D_F)} L${pt(xm + 0.08, D_N)}" stroke="#0d5378" stroke-width="1.2" opacity=".2"/>`;
    k += `<path d="M${pt(xm, D_F)} L${pt(xm, D_N)}" stroke="#e9f2f5" stroke-width=".35"/>`;
    for (let d = D_N + 0.1; d < D_F - 0.05; d += 0.3) {
      const sc = s(d), dd = d - D_N, rot = dd < 5 || dd > 20;
      const farbe = rot ? "#d8343a" : (Math.floor(dd / 0.3) % 2 ? "#f4f6f4" : (xm === 0 ? "#f2c230" : "#2f6fd0"));
      const y0 = Y(d + 0.14), y1 = Y(d - 0.14);
      k += `<ellipse cx="${r(X(xm, d))}" cy="${r((y0 + y1) / 2)}" rx="${r(0.075 * sc)}" ry="${r(Math.max(0.25, (y1 - y0) / 2))}" fill="${farbe}"/>`;
    }
  }
  const cy = Y(D_N);
  S.teil({ id: "bahnleine", de: "die Bahnleine", syl: "BAHN-lei-ne", it: "la corsia galleggiante", itSyl: "cor-SI-a gal-leg-GIAN-te", en: "lane rope", x: VX, y: cy,
    kunst: `<g transform="translate(${-VX} ${r(-cy)})">${k}</g>`, tipp: "Die Bahnleine trennt die Bahnen und dämpft die Wellen." });
}

/* Rückenwimpel quer über dem Becken, 5 m vor der Stirnwand (fängt keinen Tipp) */
{
  const d = D_F - 5, sc = s(d), y = Y(d, 1.8);
  let k = `<path d="M${r(X(B_L - 1.2, d))} ${r(Y(d))} V${r(y - 0.5)} M${r(X(B_R + 1.2, d))} ${r(Y(d))} V${r(y - 0.5)}" stroke="#b3bec4" stroke-width=".8"/>`;
  k += `<path d="M${r(X(B_L - 1.2, d))} ${r(y)} Q${VX} ${r(y + 1.6)} ${r(X(B_R + 1.2, d))} ${r(y)}" stroke="#6b767c" stroke-width=".25" fill="none"/>`;
  const fl = ["#d8343a", "#f4f6f4", "#2f6fd0"];
  for (let i = 0, x = X(B_L, d); x < X(B_R, d); i++, x += 0.32 * sc) {
    const t = (x - X(B_L - 1.2, d)) / (X(B_R + 1.2, d) - X(B_L - 1.2, d)), yy = y + 1.6 * 2 * t * (1 - t) * 2 * 0.5;
    k += `<path d="M${r(x)} ${r(yy)} l${r(0.22 * sc)} 0 l${r(-0.11 * sc)} ${r(0.3 * sc)} Z" fill="${fl[i % 3]}"/>`;
  }
  S.davor(k);
}

/* =====================================================================
   9 — DAS SPRUNGBRETT (1 m) auf gefliestem Sockel, davor links
   ===================================================================== */
{
  const d = 34, sc = s(d), yb = Y(d), yB = Y(d, 0.95);
  const xa = X(-6.85, d), xs = X(-5.75, d), xe = X(-2.9, d);
  let k = schatten((xa + xe) / 2, yb, (xe - xa) / 2 + 2, 1.1, 0.28);
  /* Sockel (Beton, gefliest) mit zwei Stufen an der Seite */
  k += `<rect x="${r(xa)}" y="${r(yB + 1.4)}" width="${r(xs - xa)}" height="${r(yb - yB - 1.4)}" fill="${FLIESE}"/>`;
  k += `<rect x="${r(xa - 4)}" y="${r(yb - (yb - yB) / 3)}" width="4.2" height="${r((yb - yB) / 3)}" fill="#e6eef1"/><rect x="${r(xa - 2)}" y="${r(yb - (yb - yB) * 2 / 3)}" width="2.2" height="${r((yb - yB) * 2 / 3)}" fill="#edf3f5"/>`;
  k += `<rect x="${r(xa)}" y="${r(yB + 1.4)}" width="${r(xs - xa)}" height="${r(yb - yB - 1.4)}" fill="${S.lg("sockel1", [[0, "#3d5f70", 0.22], [1, "#fff", 0.1]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(xa)}" y="${r(yb - 2)}" width="${r(xs - xa)}" height="2" fill="${MOSAIK}"/>`;
  /* Federbock (verstellbare Walze) */
  const xF = xs + (xe - xs) * 0.3;
  k += `<path d="M${r(xF - 2.6)} ${r(yb)} L${r(xF - 1)} ${r(yB + 1.2)} L${r(xF + 1)} ${r(yB + 1.2)} L${r(xF + 2.6)} ${r(yb)} Z" fill="${S.lg("bock", [[0, "#dfe6e9"], [1, "#9aa5ab"]], 0, 0, 1, 0)}"/><circle cx="${r(xF)}" cy="${r(yB + 1.1)}" r="1" fill="#6b767c"/>`;
  /* das Brett, vorne leicht dünner */
  k += `<path d="M${r(xa)} ${r(yB - 0.5)} L${r(xe)} ${r(yB - 0.9)} Q${r(xe + 1.3)} ${r(yB - 0.9)} ${r(xe + 1.3)} ${r(yB - 0.1)} L${r(xe + 1.3)} ${r(yB + 0.2)} L${r(xa)} ${r(yB + 1.4)} Z" fill="${S.lg("brett1", [[0, "#ffffff"], [0.55, "#eef1f2"], [1, "#b4c0c6"]])}"/>`;
  k += `<path d="M${r(xa)} ${r(yB - 1.6)} L${r(xe)} ${r(yB - 1.9)} L${r(xe)} ${r(yB - 0.9)} L${r(xa)} ${r(yB - 0.5)} Z" fill="#5aa0d0"/>`;
  /* Handläufe links und rechts am Aufgang */
  k += `<path d="M${r(xa - 3.6)} ${r(yb - (yb - yB) / 3)} L${r(xa)} ${r(yB - 0.85 * sc)} H${r(xs + 1)} V${r(yB - 0.5)}" stroke="${STAHL}" stroke-width=".8" fill="none" stroke-linejoin="round"/>`;
  k += `<text x="${r((xa + xs) / 2)}" y="${r(yB + 6.2)}" font-size="2.2" text-anchor="middle" fill="#1f5f86" font-family="Arial" font-weight="bold">1 m</text>`;
  const cx = (xa + xe) / 2;
  S.teil({ id: "sprungbrett", de: "das Sprungbrett", syl: "SPRUNG-brett", it: "il trampolino da un metro", itSyl: "tram-po-LI-no da un ME-tro", en: "springboard", x: cx, y: yb, steht: true,
    kunst: `<g transform="translate(${r(-cx)} ${r(-yb)})">${k}</g>`, tipp: "Das Brett federt: Man wippt einmal und springt dann ab." });
}

/* =====================================================================
   10 — DER HOCHSITZ des Bademeisters, mit Rettungsring
   ===================================================================== */
const HS = { d: 28 };
{
  const d = HS.d, sc = s(d), yb = Y(d), x = X(6.4, d);
  HS.x = x; HS.yb = yb; HS.sc = sc;
  const ySitz = Y(d, 1.5), yFuss = Y(d, 1.0);
  let k = schatten(0, 0, 10, 1.2, 0.3);
  /* zwei Leiterholme vorne, zwei Stützen hinten (Aluminium) */
  const vw = 0.42 * sc;
  k += `<path d="M${r(-vw - 1.5)} 0 L${r(-vw + 1.2)} ${r(ySitz - yb + 2)} M${r(vw + 1.5)} 0 L${r(vw - 1.2)} ${r(ySitz - yb + 2)}" stroke="${STAHL}" stroke-width="1.5" stroke-linecap="round"/>`;
  k += `<path d="M${r(-vw - 0.5)} -1.5 L${r(-vw + 2)} ${r(ySitz - yb + 2)} M${r(vw + 0.5)} -1.5 L${r(vw - 2)} ${r(ySitz - yb + 2)}" stroke="#8d989f" stroke-width="1"/>`;
  for (let i = 1; i <= 4; i++) { const t = i / 5, yy = (ySitz - yb + 2) * t, ww = vw + 1.5 - 2.7 * t; k += `<rect x="${r(-ww)}" y="${r(yy - 0.5)}" width="${r(ww * 2)}" height="1" rx=".3" fill="#9aa5ab"/>`; }
  /* Fußbrett und Sitz (weiß, Kunststoff), Rückenlehne */
  k += `<rect x="${r(-vw - 1)}" y="${r(yFuss - yb - 0.6)}" width="${r(vw * 2 + 2)}" height="1.5" rx=".4" fill="#e9eef0" stroke="#9aa5ab" stroke-width=".2"/>`;
  k += `<path d="M${r(-vw - 2.5)} ${r(ySitz - yb)} L${r(vw + 2.5)} ${r(ySitz - yb)} L${r(vw + 2)} ${r(ySitz - yb + 2.2)} L${r(-vw - 2)} ${r(ySitz - yb + 2.2)} Z" fill="${S.lg("sitz", [[0, "#ffffff"], [1, "#c7d0d5"]])}"/>`;
  k += `<rect x="${r(vw + 1)}" y="${r(ySitz - yb - 0.55 * sc)}" width="2.2" height="${r(0.55 * sc)}" rx=".8" fill="${S.lg("lehne", [[0, "#ffffff"], [1, "#cdd5da"]], 0, 0, 1, 0)}" stroke="#9aa5ab" stroke-width=".2"/>`;
  k += `<rect x="${r(-vw - 1.4)}" y="${r(ySitz - yb + 2.2)}" width="${r(vw * 2 + 2.8)}" height="2.8" fill="#d23a33"/><text x="0" y="${r(ySitz - yb + 4.3)}" font-size="2.1" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">AUFSICHT</text>`;
  S.teil({ id: "hochsitz", de: "der Hochsitz", syl: "HOCH-sitz", it: "la torretta del bagnino", itSyl: "tor-RET-ta del ba-GNI-no", en: "lifeguard chair", x, y: yb, steht: true, kunst: k,
    tipp: "Vom Hochsitz aus sieht der Bademeister das ganze Becken." });
}
{
  /* DER BADEMEISTER — sitzt oben, Blick auf das Becken */
  const m = mensch({ id: "b14a_bm", geschlecht: "m", pose: "sitzen", blick: -62, frisur: "kurz", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#d23a33" }, unterteil: { stueck: "shorts", farbe: "weiss" }, schuhe: { stueck: "sandale" } } }, 1.82 * HS.sc);
  const yF = Y(HS.d, 1.0) - 0.2;
  /* Trillerpfeife am Band */
  const pf = `<path d="M-1.2 ${r(-0.62 * HS.sc * 1.82)} l1.4 3.2 l1.2 -3.2" stroke="#2f6fd0" stroke-width=".25" fill="none"/>`;
  S.teil({ id: "bademeister", de: "der Bademeister", syl: "BA-de-meis-ter", it: "il bagnino", itSyl: "ba-GNI-no", en: "lifeguard", x: HS.x - 1, y: yF, kunst: m.svg,
    tipp: "Der Bademeister passt auf, dass niemand in Gefahr kommt. Sein Beruf heißt „Fachangestellter für Bäderbetriebe“." });
}
{
  /* DER RETTUNGSRING — hängt vorne am Hochsitz */
  const sc = HS.sc, R = 0.29 * sc;
  let k = `<path d="M0 ${r(-R - 1.4)} v1.2" stroke="#8d989f" stroke-width=".6"/>`;
  k += `<circle r="${r(R)}" fill="none" stroke="${S.lg("ring", [[0, "#ff8a6e"], [1, "#d2382c"]])}" stroke-width="${r(R * 0.5)}"/>`;
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; k += `<path d="M${r(Math.cos(a - 0.22) * R)} ${r(Math.sin(a - 0.22) * R)} A${r(R)} ${r(R)} 0 0 1 ${r(Math.cos(a + 0.22) * R)} ${r(Math.sin(a + 0.22) * R)}" stroke="#f6f6f2" stroke-width="${r(R * 0.51)}" fill="none"/>`; }
  k += `<circle r="${r(R)}" fill="none" stroke="#7d1d18" stroke-width=".2" opacity=".5"/><path d="M${r(-R * 0.9)} ${r(-R * 0.3)} A${r(R)} ${r(R)} 0 0 1 ${r(-R * 0.2)} ${r(-R * 0.95)}" stroke="#fff" stroke-width=".5" opacity=".6" fill="none"/>`;
  S.teil({ oben: true, id: "rettungsring", de: "der Rettungsring", syl: "RET-tungs-ring", it: "il salvagente anulare", itSyl: "sal-va-GEN-te a-nu-LA-re", en: "life ring", x: HS.x - 0.55 * sc, y: r(Y(HS.d, 0.65)), kunst: k,
    tipp: "Den Rettungsring wirft man jemandem zu, der im Wasser Hilfe braucht." });
}

/* =====================================================================
   11 — DIE LEITER (Edelstahl, rechts an der Beckenseite)
   ===================================================================== */
{
  const d = 23.2, sc = s(d), xe = X(B_R, d), y = Y(d);
  let k = "";
  for (const [dd, op] of [[0.35, 0.75], [-0.35, 1]]) {
    const x = X(B_R, d + dd) - xe, yy = Y(d + dd) - y, h = 0.85 * sc;
    /* Holm: aus dem Wasser hoch, über den Rand, auf den Boden */
    k += `<path d="M${r(x - 1.6)} ${r(yy + 3)} L${r(x - 1.6)} ${r(yy - h + 2.2)} Q${r(x - 1.6)} ${r(yy - h)} ${r(x + 0.8)} ${r(yy - h)} Q${r(x + 3.2)} ${r(yy - h)} ${r(x + 3.2)} ${r(yy - h + 2.2)} L${r(x + 3.2)} ${r(yy + 0.3)}" stroke="${STAHL}" stroke-width="1.1" fill="none" opacity="${op}"/>`;
    k += `<path d="M${r(x - 1.9)} ${r(yy - h + 2.2)} Q${r(x - 1.9)} ${r(yy - h - 0.3)} ${r(x + 0.8)} ${r(yy - h - 0.3)}" stroke="#fff" stroke-width=".3" fill="none" opacity=".8"/>`;
    k += `<ellipse cx="${r(x + 3.2)}" cy="${r(yy + 0.4)}" rx=".9" ry=".35" fill="#8d989f"/>`;
  }
  /* Stufen unter Wasser (gebrochen und blasser) */
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-3.4 + i * 0.3)}" y="${r(2.2 + i * 2.6)}" width="3.6" height=".8" rx=".3" fill="#cfe9f1" opacity="${0.55 - i * 0.15}"/>`;
  S.teil({ oben: true, id: "leiter", de: "die Leiter", syl: "LEI-ter", it: "la scaletta", itSyl: "sca-LET-ta", en: "ladder", x: xe, y, kunst: k,
    tipp: "Über die Leiter steigt man ins Becken und wieder heraus." });
}

/* =====================================================================
   12 — DIE SCHWIMMERIN (steht im flachen Teil und winkt)
   ===================================================================== */
{
  const d = 22.6, sc = s(d), yWL = Y(d), x = X(-1.45, d);
  const m = mensch({ id: "b14a_swi", geschlecht: "w", pose: "winken", blick: 12, frisur: "dutt", haarfarbe: "braun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "badeanzug", farbe: "#c8324a" }, kopf: { stueck: "muetze", farbe: "#f2f2ee" } } }, 1.68 * sc);
  const tief = 1.22 * sc;                  /* Wassertiefe im flachen Teil */
  const fig = S.id("swifig"), cid = S.id("swiclip"), cid2 = S.id("swiunter");
  S.def(`<g id="${fig}">${m.svg}</g>`);
  S.def(`<clipPath id="${cid}" clipPathUnits="userSpaceOnUse"><rect x="-40" y="-80" width="80" height="80"/></clipPath>`);
  S.def(`<clipPath id="${cid2}" clipPathUnits="userSpaceOnUse"><rect x="-40" y="0" width="80" height="${r(yN - yWL - 1.2)}"/></clipPath>`);
  /* unter Wasser: blass und leicht gestaucht (Lichtbrechung) */
  let k = `<g clip-path="url(#${cid2})" opacity=".22"><use href="#${fig}" transform="translate(0 ${r(tief * 0.82)}) scale(1.04 .82)"/></g>`;
  k += `<g clip-path="url(#${cid})"><use href="#${fig}" transform="translate(0 ${r(tief)})"/></g>`;
  k += `<ellipse cx=".3" cy=".2" rx="${r(0.27 * sc)}" ry="1.1" fill="none" stroke="#e9fbff" stroke-width=".6" opacity=".85"/>`;
  k += `<path d="M${r(-0.5 * sc)} 1.4 q${r(0.25 * sc)} -.8 ${r(0.5 * sc)} 0 t${r(0.5 * sc)} 0" stroke="#e9fbff" stroke-width=".4" fill="none" opacity=".6"/>`;
  S.teil({ id: "schwimmerin", de: "die Schwimmerin", syl: "SCHWIM-me-rin", it: "la nuotatrice", itSyl: "nuo-ta-TRI-ce", en: "swimmer", x, y: yWL, kunst: k,
    tipp: "Die Schwimmerin macht nach acht Bahnen eine kurze Pause." });
}

/* =====================================================================
   13 — VORNE AUF DEM BECKENUMGANG
   ===================================================================== */
{
  /* DER LIEGESTUHL — weiße Kunststoffliege, Kopfteil hochgestellt */
  const d = 16.6, sc = s(d), y = Y(d);
  const L = 1.9 * sc, h = 0.36 * sc, xk = L * 0.3;
  let k = schatten(L / 2, 0, L / 2 + 2, 2.2, 0.3);
  for (const x of [3, L * 0.5, L - 3]) k += `<rect x="${r(x - 1)}" y="${r(-h + 1)}" width="2" height="${r(h - 1)}" rx=".4" fill="${S.lg("bein", [[0, "#eef2f4"], [1, "#b9c3c8"]], 0, 0, 1, 0)}"/>`;
  /* Liegefläche (Lamellen) */
  k += `<path d="M${r(xk)} ${r(-h)} L${r(L)} ${r(-h)} Q${r(L + 1)} ${r(-h)} ${r(L + 1)} ${r(-h + 1.3)} L${r(L + 1)} ${r(-h + 2.6)} L${r(xk)} ${r(-h + 2.6)} Z" fill="${S.lg("liege", [[0, "#ffffff"], [1, "#cdd6db"]])}"/>`;
  for (let x = xk + 2; x < L; x += 2.6) k += `<line x1="${r(x)}" y1="${r(-h + 0.5)}" x2="${r(x)}" y2="${r(-h + 2.2)}" stroke="#aeb9bf" stroke-width=".4"/>`;
  /* Rückenteil schräg nach oben links */
  const rx0 = xk, ry0 = -h + 1.3, rx1 = 1.2, ry1 = -h - 0.58 * sc;
  k += `<path d="M${r(rx0)} ${r(ry0 + 1.3)} L${r(rx0 + 1)} ${r(ry0 - 1.4)} L${r(rx1 + 2.4)} ${r(ry1 - 0.4)} Q${r(rx1)} ${r(ry1 - 0.8)} ${r(rx1 - 0.6)} ${r(ry1 + 1.6)} L${r(rx0 - 2)} ${r(ry0 + 1.6)} Z" fill="${S.lg("liege2", [[0, "#ffffff"], [1, "#c3ccd2"]], 0, 0, 1, 0)}" stroke="#aeb9bf" stroke-width=".3"/>`;
  for (let t = 0.15; t < 0.95; t += 0.14) k += `<line x1="${r(rx0 + (rx1 - rx0) * t - 0.4)}" y1="${r(ry0 + (ry1 - ry0) * t - 0.2)}" x2="${r(rx0 + (rx1 - rx0) * t + 1.6)}" y2="${r(ry0 + (ry1 - ry0) * t + 1.4)}" stroke="#aeb9bf" stroke-width=".35"/>`;
  k += `<path d="M${r(rx0 - 1)} ${r(ry0 + 1.5)} L${r(rx0 - 3)} 0" stroke="#b9c3c8" stroke-width="1.4"/>`;
  k += `<rect x="${r(xk)}" y="${r(-h - 0.2)}" width="${r(L - xk)}" height=".7" fill="#fff"/>`;
  S.teil({ id: "liegestuhl", de: "der Liegestuhl", syl: "LIE-ge-stuhl", it: "la sdraio", itSyl: "SDRA-io", en: "deck chair", x: 6, y, steht: true, kunst: k });
  /* DAS HANDTUCH — gestreift, über das Fußende gelegt */
  let t = `<path d="M${r(L * 0.55)} ${r(-h - 0.5)} L${r(L * 0.93)} ${r(-h - 0.5)} L${r(L * 0.94)} ${r(-h + 6)} Q${r(L * 0.9)} ${r(-h + 6.8)} ${r(L * 0.86)} ${r(-h + 6)} L${r(L * 0.85)} ${r(-h + 2.6)} L${r(L * 0.55)} ${r(-h + 2.6)} Z" fill="${S.lg("tuch", [[0, "#ffb347"], [1, "#e07b22"]])}"/>`;
  for (let i = 0; i < 4; i++) t += `<rect x="${r(L * 0.58 + i * 7)}" y="${r(-h - 0.5)}" width="2" height="3.1" fill="#fff6e0" opacity=".85"/>`;
  t += `<path d="M${r(L * 0.55)} ${r(-h - 0.5)} L${r(L * 0.93)} ${r(-h - 0.5)}" stroke="#fff" stroke-width=".5" opacity=".5"/>`;
  S.teil({ oben: true, id: "handtuch", de: "das Handtuch", syl: "HAND-tuch", it: "l'asciugamano", itSyl: "a-sciu-ga-MA-no", en: "towel", x: 6, y, kunst: t });
}
{
  /* DIE BADESCHUHE — Badelatschen vor der Liege */
  const d = 16.0, sc = s(d), y = Y(d);
  let k = "";
  for (const [dx, rot] of [[0, -8], [6.5, 6]]) {
    k += `<g transform="translate(${dx} 0) rotate(${rot})"><ellipse cx="0" cy="-1" rx="2.7" ry="1.25" fill="#1f5f9f"/><ellipse cx="0" cy="-1.3" rx="2.4" ry=".95" fill="#2f86d0"/><path d="M-.6 -2.1 Q.6 -3.2 1.6 -2.1" stroke="#f2f2ee" stroke-width="1.3" fill="none"/></g>`;
  }
  S.teil({ oben: true, id: "badeschuhe", de: "die Badeschuhe", syl: "BA-de-schu-he", it: "le ciabatte", itSyl: "cia-BAT-te", en: "pool slides", x: 96, y, kunst: schatten(3, 0, 6, 1, 0.2) + k,
    tipp: "Mit Badeschuhen rutscht man auf den nassen Fliesen nicht aus." });
}
{
  /* DER SCHWIMMREIFEN — Kinder-Schwimmreifen, liegt am Rand */
  const d = 17.3, sc = s(d), y = Y(d);
  const R = 0.3 * sc;
  let k = schatten(0, 0, R + 2, 1.6, 0.25);
  k += `<ellipse cx="0" cy="${r(-R * 0.32)}" rx="${r(R)}" ry="${r(R * 0.45)}" fill="${S.rg("reifen", [[0, "#ffe066"], [0.7, "#f7b733"], [1, "#d98a10"]], 0.4, 0.3, 0.8)}"/>`;
  k += `<ellipse cx="0" cy="${r(-R * 0.36)}" rx="${r(R * 0.48)}" ry="${r(R * 0.18)}" fill="#c9c2b6"/>`;
  for (const a of [0.6, 2.2, 3.8, 5.3]) k += `<ellipse cx="${r(Math.cos(a) * R * 0.75)}" cy="${r(-R * 0.32 + Math.sin(a) * R * 0.33)}" rx="${r(R * 0.16)}" ry="${r(R * 0.12)}" fill="#3ba3e0"/>`;
  k += `<path d="M${r(-R * 0.7)} ${r(-R * 0.55)} Q0 ${r(-R * 0.82)} ${r(R * 0.6)} ${r(-R * 0.6)}" stroke="#fff" stroke-width=".7" opacity=".6" fill="none"/>`;
  S.teil({ id: "schwimmreifen", de: "der Schwimmreifen", syl: "SCHWIMM-rei-fen", it: "il salvagente", itSyl: "sal-va-GEN-te", en: "swim ring", x: 130, y, steht: true, kunst: k });
}
{
  /* DIE BADEKAPPE und DIE SCHWIMMBRILLE — liegen auf dem Beckenrand */
  const d = D_N - 0.65, y = Y(d);
  let k = `<path d="M-4.2 0 Q-4.4 -5 0 -5.2 Q4.4 -5 4.2 0 Q0 1 -4.2 0 Z" fill="${S.rg("kappe", [[0, "#7fc2ff"], [1, "#1f6fd0"]], 0.4, 0.3, 0.8)}"/>`;
  k += `<path d="M-2.6 -3.8 Q-1 -4.8 1 -4.4" stroke="#fff" stroke-width=".6" opacity=".6" fill="none"/>`;
  S.teil({ oben: true, id: "badekappe", de: "die Badekappe", syl: "BA-de-kap-pe", it: "la cuffia", itSyl: "CUF-fia", en: "swimming cap", x: 162, y, kunst: schatten(0, 0, 4.6, 0.8, 0.2) + k });
  let b = `<path d="M-6 -1.2 Q0 -3.4 6 -1.2" stroke="#222" stroke-width=".5" fill="none"/>`;
  for (const sx of [-1, 1]) b += `<ellipse cx="${sx * 2.3}" cy="-1" rx="2" ry="1.3" fill="${S.lg("glas2", [[0, "#9ff0ff"], [1, "#2c7fa8"]])}" stroke="#ff6a2b" stroke-width=".7"/><ellipse cx="${sx * 2.3 - 0.6}" cy="-1.5" rx=".7" ry=".3" fill="#fff" opacity=".7"/>`;
  b += `<rect x="-.5" y="-1.4" width="1" height=".6" fill="#ff6a2b"/>`;
  S.teil({ oben: true, id: "schwimmbrille", de: "die Schwimmbrille", syl: "SCHWIMM-bril-le", it: "gli occhialini", itSyl: "oc-chia-LI-ni", en: "goggles", x: 178, y, kunst: schatten(0, 0, 5, 0.7, 0.2) + b,
    tipp: "Mit der Schwimmbrille brennt das Wasser nicht in den Augen." });
}
{
  /* DER KORB — Gitterwagen mit Schwimmhilfen für den Schwimmkurs (Lupe) */
  const d = 16.5, sc = s(d), y = Y(d);
  const W = 1.2 * sc, Hk = 0.6 * sc;
  let k = schatten(0, 0, W / 2 + 3, 1.6, 0.3);
  /* Rollen */
  for (const x of [-W / 2 + 2, W / 2 - 2]) k += `<circle cx="${r(x)}" cy="-1.4" r="1.4" fill="#2b2f33"/><circle cx="${r(x)}" cy="-1.4" r=".5" fill="#9aa3aa"/>`;
  const yo = -Hk - 2.6, yu = -2.8;
  /* hinter dem Gitter: Schwimmnudeln (stehen hoch), Schwimmbretter, Schwimmflügel, Tauchringe */
  const nud = [["#ff5c8a", -W / 2 + 6], ["#ffd23f", -W / 2 + 9.5], ["#38c172", -W / 2 + 13], ["#3ba3e0", -W / 2 + 16.5]];
  nud.forEach(([f, x], i) => { k += `<rect x="${r(x - 1.5)}" y="${r(yo - 18 + i * 1.4)}" width="3" height="${r(yu - yo + 18 - i * 1.4)}" rx="1.5" fill="${f}"/><ellipse cx="${r(x)}" cy="${r(yo - 18 + i * 1.4 + 0.8)}" rx="1.5" ry=".6" fill="#fff" opacity=".35"/><circle cx="${r(x)}" cy="${r(yo - 18 + i * 1.4 + 0.8)}" r=".5" fill="#000" opacity=".25"/>`; });
  const bre = [["#2f86d0", 1], ["#f2c230", 7.4], ["#e8453c", 13.8]];
  bre.forEach(([f, dx]) => { const x = -2 + dx; k += `<path d="M${r(x - 2.6)} ${yu} L${r(x - 2.6)} ${r(yo - 6)} Q${r(x - 2.6)} ${r(yo - 9)} ${r(x)} ${r(yo - 9)} Q${r(x + 2.6)} ${r(yo - 9)} ${r(x + 2.6)} ${r(yo - 6)} L${r(x + 2.6)} ${yu} Z" fill="${f}" stroke="#000" stroke-opacity=".15" stroke-width=".25"/><ellipse cx="${r(x)}" cy="${r(yo - 6)}" rx="1.2" ry=".8" fill="#fff" opacity=".35"/>`; });
  /* Schwimmflügel (orange) und Tauchringe (bunt) vorne im Korb */
  const xf = W / 2 - 7;
  for (const dx of [-2.2, 2.2]) k += `<rect x="${r(xf + dx - 2)}" y="${r(yo - 3.6)}" width="4" height="5.4" rx="1.8" fill="${S.lg("fluegel", [[0, "#ffb15c"], [1, "#f07a1a"]], 0, 0, 1, 0)}"/><ellipse cx="${r(xf + dx)}" cy="${r(yo - 1.2)}" rx="1" ry="1.6" fill="#c45f12" opacity=".5"/>`;
  /* Gitterkorb */
  k += `<rect x="${r(-W / 2)}" y="${r(yo)}" width="${r(W)}" height="${r(yu - yo)}" rx="1" fill="#9aa3aa" opacity=".18" stroke="${STAHL}" stroke-width="1"/>`;
  let g = "";
  for (let x = -W / 2 + 2.4; x < W / 2; x += 2.4) g += `M${r(x)} ${r(yo)} V${yu}`;
  for (let yy = yo + 2.4; yy < yu; yy += 2.4) g += `M${r(-W / 2)} ${r(yy)} H${r(W / 2)}`;
  k += `<path d="${g}" stroke="#b9c2c8" stroke-width=".35"/>`;
  k += `<rect x="${r(-W / 2 - 0.6)}" y="${r(yo - 0.8)}" width="${r(W + 1.2)}" height="1.6" rx=".8" fill="${STAHL}"/>`;
  /* Tauchringe vorne am Korb eingehängt */
  const tauch = [["#e8453c", -W / 2 + 5], ["#2f86d0", -W / 2 + 10.5], ["#38c172", -W / 2 + 16]];
  tauch.forEach(([f, x]) => { k += `<circle cx="${r(x)}" cy="${r(yo + 6)}" r="2.3" fill="none" stroke="${f}" stroke-width="1.3"/><path d="M${r(x)} ${r(yo - 0.2)} v3.6" stroke="#d6dde1" stroke-width=".4"/>`; });
  const ux = 252, uy = y;
  const unter = [
    { id: "schwimmnudel", de: "die Schwimmnudel", syl: "SCHWIMM-nu-del", it: "il tubo galleggiante", itSyl: "TU-bo gal-leg-GIAN-te", en: "pool noodle", x: ux - W / 2 + 11, y: uy + yo - 4, kunst: flaeche(-6.6, -15, 13.2, 8),
      tipp: "Mit der Schwimmnudel üben Kinder das Schwimmen." },
    { id: "schwimmbrett", de: "das Schwimmbrett", syl: "SCHWIMM-brett", it: "la tavoletta", itSyl: "ta-vo-LET-ta", en: "kickboard", x: ux + 5.4, y: uy + yo - 3, kunst: flaeche(-11.5, -6.5, 15, 6.5) },
    { id: "schwimmfluegel", de: "die Schwimmflügel", syl: "SCHWIMM-flü-gel", it: "i braccioli", itSyl: "brac-CIO-li", en: "armbands", x: ux + xf, y: uy + yo + 2, kunst: flaeche(-4.6, -6, 9.2, 6),
      tipp: "Schwimmflügel trägt man an den Oberarmen." },
    { id: "tauchring", de: "der Tauchring", syl: "TAUCH-ring", it: "l'anello da immersione", itSyl: "a-NEL-lo da im-mer-SIO-ne", en: "diving ring", x: ux - W / 2 + 10.5, y: uy + yo + 9, kunst: flaeche(-8.5, -5.5, 17, 6),
      tipp: "Die Tauchringe sinken: Man taucht und holt sie vom Boden." },
  ];
  S.teil({ id: "korb", de: "der Korb", syl: "KORB", it: "il cesto", itSyl: "CE-sto", en: "basket", x: ux, y: uy, steht: true, kunst: k,
    zoom: { x: r(ux - 39), y: r(uy - 50), w: 78, h: 52 }, unter,
    tipp: "Im Gitterkorb liegen die Schwimmhilfen für den Schwimmkurs." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/schwimmbad.js"));
console.log(aus);
