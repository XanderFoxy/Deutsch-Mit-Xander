#!/usr/bin/env node
/* =====================================================================
   DIE UNIVERSITÄT – DER HÖRSAAL (FASSUNG 852) — Bilderwelt neu
   ---------------------------------------------------------------------
   RECHERCHE (Hörsäle deutscher Universitäten, z. B. Audimax-Typen,
   Hersteller von Hörsaalgestühl wie Kusch+Co/Ventano):
   - Die Sitzreihen STEIGEN nach hinten an (Stufen von 35–45 cm), damit
     jeder nach vorn sieht. In der Mitte oder an der Seite führt eine
     TREPPE hinunter.
   - Hörsaalgestühl: KLAPPSITZE (die Sitzfläche klappt hoch) und durch-
     gehende KLAPPTISCHE (Schreibplatten) vor jeder Reihe.
   - Vorn: Podium mit REDNERPULT (Mikrofon, Leselampe), dahinter die
     große, oft dreiteilige Schiebe-TAFEL (grün, mit Kreide), daneben die
     LEINWAND; der BEAMER hängt an der Decke. Ein Bildschirm am Eingang
     zeigt die VORLESUNG (Fach, Zeit, Hörsaal).
   - Studierende schreiben mit dem LAPTOP oder im SKRIPT mit; der
     STUDENTENAUSWEIS ist oft zugleich Mensakarte und Semesterticket.
   BLICK: von der obersten Reihe nach vorn hinunter (Kamera 5,9 m über
   dem Podium, um 22° nach unten geneigt). Reihenabstand 1,2 m, Stufe
   0,45 m. Menschen 1,66–1,80 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "universitaet", titel: "Die Universität", emoji: "🎓", thema: "Bildung", kuerzel: "b09d", fassung: 852 });
const rnd = zufall(1386);
const r = B.r;

/* ---------- Kamera mit Neigung -----------------------------------------
   X nach rechts, H nach oben (über dem Podium), W = Abstand nach vorn. */
const E = 5.9, TH = 22 * Math.PI / 180, F = 205, CY = 60, VX = 160;
const tief = (H, W) => -(H - E) * Math.sin(TH) + W * Math.cos(TH);
const P = (X, H, W) => { const d = tief(H, W), v = (H - E) * Math.cos(TH) + W * Math.sin(TH); return [r(VX + F * X / d), r(CY - F * v / d)]; };
const mass = (H, W) => F / tief(H, W);                       // Einheiten je Meter an dieser Stelle
function klipp(pts) {
  const kanten = [[(p) => p[0] >= 0, (a, b) => { const t = (0 - a[0]) / (b[0] - a[0]); return [0, a[1] + t * (b[1] - a[1])]; }],
    [(p) => p[0] <= 320, (a, b) => { const t = (320 - a[0]) / (b[0] - a[0]); return [320, a[1] + t * (b[1] - a[1])]; }],
    [(p) => p[1] >= 0, (a, b) => { const t = (0 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), 0]; }],
    [(p) => p[1] <= 200, (a, b) => { const t = (200 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), 200]; }]];
  let out = pts;
  for (const [drin, schnitt] of kanten) {
    const inp = out; out = [];
    for (let i = 0; i < inp.length; i++) {
      const a = inp[(i + inp.length - 1) % inp.length], b = inp[i];
      if (drin(b)) { if (!drin(a)) out.push(schnitt(a, b)); out.push(b); } else if (drin(a)) out.push(schnitt(a, b));
    }
    if (!out.length) return out;
  }
  return out.map((p) => [r(p[0]), r(p[1])]);
}
const poly = (pts, fill, extra = "", frei = false) => { const q = frei ? pts : klipp(pts); return q.length < 3 ? "" : `<path d="M${q.map((p) => p[0] + " " + p[1]).join(" L")} Z" fill="${fill}"${extra ? " " + extra : ""}/>`; };
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const T = (x, y, s, txt, f = "#222", extra = "") => `<text x="${r(x)}" y="${r(y)}" font-size="${r(s)}" fill="${f}" font-family="Arial,Helvetica,sans-serif"${extra ? " " + extra : ""}>${txt}</text>`;
/* Quader: Grundriss X0..X1, W0..W1 (W0 näher), Höhe H0..H1; sichtbar: Deckel, Rückseite (zur Kamera), Seiten */
function quader(X0, X1, H0, H1, W0, W1, f) {
  let g = "";
  if (f.seite && X1 < 0) g += poly([P(X1, H0, W0), P(X1, H0, W1), P(X1, H1, W1), P(X1, H1, W0)], f.seite);
  if (f.seite && X0 > 0) g += poly([P(X0, H0, W0), P(X0, H0, W1), P(X0, H1, W1), P(X0, H1, W0)], f.seite);
  if (f.vorn) g += poly([P(X0, H0, W0), P(X1, H0, W0), P(X1, H1, W0), P(X0, H1, W0)], f.vorn);
  if (f.deckel) g += poly([P(X0, H1, W0), P(X1, H1, W0), P(X1, H1, W1), P(X0, H1, W1)], f.deckel);
  return g;
}
function blatt(X, W, w, t, dreh, h) {
  const c = Math.cos(dreh), s = Math.sin(dreh);
  return [[-w / 2, -t / 2], [w / 2, -t / 2], [w / 2, t / 2], [-w / 2, t / 2]].map(([a, b]) => P(X + a * c - b * s, h, W + a * s + b * c));
}

/* ---------- Farben ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const HOLZ = S.lg("holz", [[0, "#c79a63"], [1, "#a97c48"]], 0, 0, 1, 0);
const HOLZ_H = S.lg("holzh", [[0, "#e3c79a"], [1, "#d2b17d"]]);
const POLSTER = S.lg("polster", [[0, "#2f5d8a"], [1, "#22466b"]]);
const POLSTER_H = S.lg("polsterh", [[0, "#3c6f9e"], [1, "#2c5880"]]);
const TEPPICH = "#5d6670";

/* =====================================================================
   KULISSE — Stirnwand mit Holzvertäfelung, Seitenwände, Podium
   ===================================================================== */
const WF = 12.2, XS = 6.2, WP = 9.0;     // Stirnwand, Seitenwände, Vorderkante Podium
const reihen = [0, 1, 2, 3, 4].map((i) => ({ i, Wd: 7.9 - i * 1.2, f: 0.3 + 0.45 * i }));
{
  let k = `<rect x="0" y="0" width="320" height="200" fill="#3a3530"/>`;
  /* Stirnwand: helle Ahorn-Paneele */
  k += poly([P(-XS, 7, WF), P(XS, 7, WF), P(XS, 0, WF), P(-XS, 0, WF)], S.lg("stirn", [[0, "#e9dcc4"], [1, "#d9c6a5"]]));
  for (let X = -XS; X <= XS; X += 0.6) k += `<line x1="${P(X, 7, WF)[0]}" y1="${P(X, 7, WF)[1]}" x2="${P(X, 0, WF)[0]}" y2="${P(X, 0, WF)[1]}" stroke="#c4ae88" stroke-width=".3"/>`;
  /* Seitenwände: dunkleres Holz, rechts die Tür zum Flur */
  k += poly([P(-XS, 7, WF), P(-XS, 7, 0.5), P(-XS, 0, 0.5), P(-XS, 0, WF)], S.lg("lw", [[0, "#9a7a55"], [1, "#b8966a"]], 0, 0, 1, 0));
  k += poly([P(XS, 7, WF), P(XS, 7, 0.5), P(XS, 0, 0.5), P(XS, 0, WF)], S.lg("rw", [[0, "#b8966a"], [1, "#9a7a55"]], 0, 0, 1, 0));
  for (let W = 1; W < WF; W += 0.8) { k += `<line x1="${P(-XS, 7, W)[0]}" y1="${P(-XS, 7, W)[1]}" x2="${P(-XS, 0, W)[0]}" y2="${P(-XS, 0, W)[1]}" stroke="#866747" stroke-width=".3"/>`; k += `<line x1="${P(XS, 7, W)[0]}" y1="${P(XS, 7, W)[1]}" x2="${P(XS, 0, W)[0]}" y2="${P(XS, 0, W)[1]}" stroke="#866747" stroke-width=".3"/>`; }
  /* Tür rechts vorn mit Notausgang-Zeichen */
  k += poly([P(XS, 2.1, 10.6), P(XS, 2.1, 9.4), P(XS, 0, 9.4), P(XS, 0, 10.6)], "#6f5236");
  const [nx, ny] = P(XS, 2.35, 10.0);
  k += `<rect x="${r(nx - 3)}" y="${r(ny - 1.6)}" width="6" height="3" fill="#159a4c"/><path d="M${r(nx - 1.8)} ${r(ny + 0.6)} l1 -1.6 l1 1.6 M${r(nx + 0.6)} ${r(ny - 0.4)} h1.4" stroke="#fff" stroke-width=".4" fill="none"/>`;
  /* Podium (Parkett) und Stufe davor */
  k += poly([P(-XS, 0, WP), P(XS, 0, WP), P(XS, 0, WF), P(-XS, 0, WF)], S.lg("parkett", [[0, "#b98a55"], [1, "#a77845"]]));
  for (let X = -XS; X < XS; X += 0.18) k += `<line x1="${P(X, 0, WP)[0]}" y1="${P(X, 0, WP)[1]}" x2="${P(X, 0, WF)[0]}" y2="${P(X, 0, WF)[1]}" stroke="#94693a" stroke-width=".22" opacity=".7"/>`;
  /* Boden vor dem Podium und Teppich unter den Reihen */
  k += poly([P(-XS, -0.15, 7.0), P(XS, -0.15, 7.0), P(XS, -0.15, WP), P(-XS, -0.15, WP)], "#6b5a48");
  k += poly([P(-XS, 0, WP), P(XS, 0, WP), P(XS, -0.15, WP), P(-XS, -0.15, WP)], "#7d6142");
  /* Lichtschein von oben */
  k += `<rect x="0" y="0" width="320" height="200" fill="${S.rg("licht", [[0, "#fff6e0", 0.25], [1, "#fff6e0", 0]], 0.5, 0.15, 0.7)}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE TAFEL (dreiteilige Schiebetafel, grün, links)
   ===================================================================== */
{
  const X0 = -5.85, X1 = -1.85, H0 = 0.9, H1 = 2.6;
  const pts = [P(X0, H1, WF), P(X1, H1, WF), P(X1, H0, WF), P(X0, H0, WF)];
  const [x0, y0] = pts[0], [x1, y1] = pts[2];
  let k = `<rect x="${x0 - 1}" y="${y0 - 1}" width="${r(x1 - x0 + 2)}" height="${r(y1 - y0 + 2.4)}" fill="#6d5a45"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="${S.lg("tafelg", [[0, "#2f5a45"], [1, "#24483a"]])}"/>`;
  for (const t of [1 / 3, 2 / 3]) k += `<line x1="${r(x0 + (x1 - x0) * t)}" y1="${y0}" x2="${r(x0 + (x1 - x0) * t)}" y2="${y1}" stroke="#1b352a" stroke-width=".5"/>`;
  const kr = (x, y, s, t, ex = "") => T(x, y, s, t, "#eef2ea", `font-family="'Segoe Print','Comic Sans MS',cursive"${ex ? " " + ex : ""}`);
  k += kr(x0 + 2, y0 + 4.2, 2.5, "Soziologie I – Grundbegriffe", 'font-weight="bold"');
  k += kr(x0 + 2, y0 + 8, 1.9, "Gesellschaft → Gruppe → Rolle");
  k += kr(x0 + 2, y0 + 11, 1.9, "Norm = Regel für das Handeln");
  k += kr(x0 + 2, y0 + 14, 1.9, "Status: zugeschrieben / erworben");
  const mx = x0 + (x1 - x0) * 0.72, my = y0 + 8.5;
  k += `<circle cx="${r(mx)}" cy="${r(my)}" r="3.6" fill="none" stroke="#eef2ea" stroke-width=".35"/><circle cx="${r(mx + 5)}" cy="${r(my + 2)}" r="2.6" fill="none" stroke="#f2e28a" stroke-width=".35"/>`;
  k += `<path d="M${r(x0 + 1)} ${r(y1 - 2)} q8 -1.4 16 0" stroke="#fff" stroke-width=".8" opacity=".1" fill="none"/>`;
  k += `<rect x="${x0}" y="${r(y1 + 0.4)}" width="${r(x1 - x0)}" height="1.2" fill="#8a7458"/><rect x="${r(x0 + 6)}" y="${r(y1 - 0.2)}" width="2.4" height=".8" fill="#fff"/><rect x="${r(x0 + 10)}" y="${r(y1 - 0.2)}" width="3" height="1" rx=".3" fill="#5a4a3a"/>`;
  const ax = (x0 + x1) / 2, ay = y1 + 1.6;
  S.teil({ id: "un_tafel", de: "die Tafel", syl: "TA-fel", it: "la lavagna", itSyl: "la-VA-gna", en: "blackboard", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Manches schreibt die Dozentin noch mit Kreide an." });
}

/* =====================================================================
   2 — DER HÖRSAAL (Schriftzug an der Stirnwand)
   ===================================================================== */
{
  const [x, y] = P(-3.8, 3.15, WF), s = mass(3.15, WF);
  let k = T(x, y, 0.42 * s, "HÖRSAAL 1", "#6d5236", 'text-anchor="middle" font-weight="bold" letter-spacing=".8" font-family="Georgia,serif"');
  k += `<line x1="${r(x - 0.95 * s)}" y1="${r(y + 0.12 * s)}" x2="${r(x + 0.95 * s)}" y2="${r(y + 0.12 * s)}" stroke="#6d5236" stroke-width=".4"/>`;
  k += T(x, y + 0.32 * s, 0.17 * s, "Philosophische Fakultät", "#7d6448", 'text-anchor="middle" letter-spacing=".3"');
  S.teil({ id: "un_hoersaal", de: "der Hörsaal", syl: "HÖR-saal", it: "l'aula magna", itSyl: "AU-la MA-gna", en: "lecture hall", x: x, y: y + 0.4 * s, kunst: um(x, y + 0.4 * s, k + flaeche(x - 1.25 * s, y - 0.45 * s, 2.5 * s, 0.85 * s)),
    tipp: "Ein großer Raum, in dem die Bänke ansteigen — damit jeder nach vorn sehen kann." });
}

/* =====================================================================
   3 — DIE LEINWAND mit der Folie der Vorlesung
   ===================================================================== */
{
  const X0 = -1.4, X1 = 3.6, H0 = 1.45, H1 = 3.95;
  const [x0, y0] = P(X0, H1, WF - 0.1), [x1, y1] = P(X1, H0, WF - 0.1);
  let k = `<rect x="${x0 - 1}" y="${y0 - 1.6}" width="${r(x1 - x0 + 2)}" height="1.8" rx=".6" fill="#2b2b2b"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="${S.lg("lw2", [[0, "#ffffff"], [1, "#ecefef"]])}"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="none" stroke="#1d1d1d" stroke-width="1.2"/>`;
  /* Folie */
  const w = x1 - x0, h = y1 - y0, fx = x0 + 3, fy = y0 + 3;
  k += `<rect x="${r(fx)}" y="${r(fy)}" width="${r(w - 6)}" height="5" fill="#1b4f8a"/>` + T(fx + 2, fy + 3.5, 2.8, "Vorlesung 3: Familie im Wandel", "#fff", 'font-weight="bold"');
  k += T(fx + 2, fy + 9.2, 1.9, "Haushalte in Deutschland (Anteil in %)", "#333");
  const bal = [[1991, 34], [2001, 36], [2011, 40], [2023, 41]];
  bal.forEach(([j, v], i) => { const bx = fx + 4 + i * 9, bh = v * 0.36; k += `<rect x="${r(bx)}" y="${r(fy + 28 - bh)}" width="6" height="${r(bh)}" fill="${i === 3 ? "#d2452f" : "#5b8fc2"}"/>` + T(bx + 3, fy + 30.4, 1.5, String(j), "#444", 'text-anchor="middle"') + T(bx + 3, fy + 27 - bh, 1.5, v + "%", "#222", 'text-anchor="middle"'); });
  k += `<line x1="${r(fx + 2)}" y1="${r(fy + 28)}" x2="${r(fx + 41)}" y2="${r(fy + 28)}" stroke="#333" stroke-width=".3"/>`;
  k += T(fx + 46, fy + 14, 1.9, "• Einpersonen-", "#333") + T(fx + 47.4, fy + 16.4, 1.9, "haushalte nehmen zu", "#333") + T(fx + 46, fy + 20, 1.9, "• Familie heute:", "#333") + T(fx + 47.4, fy + 22.4, 1.9, "vielfältig", "#333");
  k += T(x1 - 3, y1 - 2.2, 1.4, "Prof. Dr. Weber · WS 2026/27", "#777", 'text-anchor="end"');
  const ax = (x0 + x1) / 2, ay = y1;
  S.teil({ id: "un_leinwand", de: "die Leinwand", syl: "LEIN-wand", it: "lo schermo", itSyl: "SCHER-mo", en: "screen", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Darauf wirft der Beamer die Folien." });
}

/* =====================================================================
   4 — DIE VORLESUNG (Bildschirm am Eingang: Fach, Zeit, Hörsaal)
   ===================================================================== */
{
  const X0 = 4.15, X1 = 5.6, H0 = 1.55, H1 = 2.35;
  const [x0, y0] = P(X0, H1, WF), [x1, y1] = P(X1, H0, WF);
  let k = `<rect x="${x0 - 0.8}" y="${y0 - 0.8}" width="${r(x1 - x0 + 1.6)}" height="${r(y1 - y0 + 1.6)}" rx=".6" fill="#1d1f22"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="${S.lg("disp", [[0, "#0f3b63"], [1, "#0a2742"]])}"/>`;
  k += T(x0 + 1, y0 + 2.6, 1.6, "Hörsaal 1 · heute", "#9fd0ff", 'font-weight="bold"');
  k += T(x0 + 1, y0 + 5.4, 1.5, "10:15–11:45  Vorlesung", "#fff");
  k += T(x0 + 1, y0 + 7.6, 1.4, "Soziologie I", "#ffd166") + T(x0 + 1, y0 + 9.6, 1.25, "Prof. Dr. A. Weber", "#cfe3f5");
  k += `<rect x="${x1 - 6}" y="${y0 + 1}" width="5" height="2" rx=".4" fill="#2ecc71"/>` + T(x1 - 3.5, y0 + 2.5, 1.1, "läuft", "#05361a", 'text-anchor="middle" font-weight="bold"');
  const ax = (x0 + x1) / 2, ay = y1 + 0.8;
  S.teil({ id: "un_vorlesung", de: "die Vorlesung", syl: "VOR-le-sung", it: "la lezione", itSyl: "le-ZIO-ne", en: "lecture", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Auf dem Bildschirm steht: Fach, Zeit, Hörsaal." });
}

/* =====================================================================
   5 — DER BEAMER (hängt an der Decke über den vorderen Reihen)
   ===================================================================== */
{
  const X = 1.1, H = 5.05, W = 6.6;
  const [ax, ay] = P(X, H, W), s = mass(H, W);
  let k = `<rect x="-.5" y="${r(-ay - 2)}" width="1" height="${r(ay - 0.18 * s)}" fill="#8f979e"/>`;
  k += `<path d="M${r(-0.3 * s)} ${r(-0.16 * s)} L${r(0.3 * s)} ${r(-0.16 * s)} L${r(0.33 * s)} ${r(0.06 * s)} L${r(-0.33 * s)} ${r(0.06 * s)} Z" fill="${S.lg("beamer", [[0, "#f6f7f8"], [1, "#c3c8cd"]])}"/>`;
  k += `<rect x="${r(-0.33 * s)}" y="${r(0.04 * s)}" width="${r(0.66 * s)}" height="${r(0.05 * s)}" rx=".5" fill="#a9b0b6"/>`;
  k += `<ellipse cx="${r(-0.12 * s)}" cy="${r(-0.05 * s)}" rx="${r(0.07 * s)}" ry="${r(0.055 * s)}" fill="#2e353c"/><ellipse cx="${r(-0.12 * s)}" cy="${r(-0.05 * s)}" rx="${r(0.04 * s)}" ry="${r(0.032 * s)}" fill="#7fc0ff"/>`;
  for (let i = 0; i < 4; i++) k += `<line x1="${r((0.06 + i * 0.05) * s)}" y1="${r(-0.11 * s)}" x2="${r((0.06 + i * 0.05) * s)}" y2="${r(0.01 * s)}" stroke="#9aa1a8" stroke-width=".3"/>`;
  S.teil({ oben: true, id: "un_beamer", de: "der Beamer", syl: "BEA-mer", it: "il proiettore", itSyl: "pro-iet-TO-re", en: "projector", x: ax, y: ay, kunst: k,
    tipp: "Er hängt an der Decke und wirft das Bild an die Leinwand." });
  /* Lichtkegel (zart, fängt keinen Tipp) */
  const [l0x, l0y] = P(X - 0.25, H - 0.05, W + 0.2), a = P(-1.4, 3.95, WF - 0.1), b = P(3.6, 1.45, WF - 0.1);
  S.davor(`<path d="M${l0x} ${l0y} L${a[0]} ${a[1]} L${b[0]} ${b[1]} Z" fill="#fffbe6" opacity=".05"/>`);
}

/* =====================================================================
   6 — DIE DOZENTIN und DAS REDNERPULT (auf dem Podium, rechts)
   ===================================================================== */
{
  const [ax, ay] = P(2.7, 0, 10.38);
  const m = B.mensch({ id: "b09d_doz", geschlecht: "w", pose: "zeigen", blick: -38, frisur: "dutt", haarfarbe: "grau", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#f0ece2" }, jacke: { stueck: "jacke", farbe: "#7a2e3a" }, unterteil: { stueck: "anzughose", farbe: "#2f3035" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "brille" } } }, 1.7 * mass(0.85, 10.38));
  S.teil({ id: "un_dozentin", de: "die Dozentin", syl: "Do-ZEN-tin", it: "la docente", itSyl: "do-CEN-te", en: "lecturer", x: ax, y: ay, kunst: m.svg,
    tipp: "Sie hält die Vorlesung. Fragen kommen am Ende." });
}
{
  const X0 = 2.36, X1 = 2.92, W0 = 10.05, W1 = 10.4, H = 1.08;
  const [ax, ay] = P((X0 + X1) / 2, 0, W0);
  let k = schatten(ax, ay, 8, 1, 0.3);
  k += quader(X0, X1, 0, H, W0, W1, { vorn: S.lg("pult", [[0, "#7a5636"], [1, "#5b3e25"]], 0, 0, 1, 0), seite: "#4b331f" });
  k += poly([P(X0 - 0.04, H, W0 - 0.04), P(X1 + 0.04, H, W0 - 0.04), P(X1 + 0.04, H + 0.12, W1), P(X0 - 0.04, H + 0.12, W1)], "#8a6744");
  /* Uni-Siegel vorn */
  const [sx, sy] = P((X0 + X1) / 2, 0.68, W0), s = mass(0.68, W0);
  k += `<circle cx="${sx}" cy="${sy}" r="${r(0.13 * s)}" fill="#d9c08a" stroke="#f3e2b4" stroke-width=".3"/><circle cx="${sx}" cy="${sy}" r="${r(0.07 * s)}" fill="none" stroke="#8a6a35" stroke-width=".25"/>`;
  /* Schwanenhals-Mikrofon */
  const m0 = P(X0 + 0.15, H + 0.08, W0 + 0.1), m1 = P(X0 + 0.05, H + 0.42, W0 - 0.05);
  k += `<path d="M${m0[0]} ${m0[1]} Q${r(m0[0] - 1.5)} ${r((m0[1] + m1[1]) / 2)} ${m1[0]} ${m1[1]}" stroke="#222" stroke-width=".5" fill="none"/><ellipse cx="${m1[0]}" cy="${m1[1]}" rx=".6" ry=".9" fill="#111"/>`;
  S.teil({ id: "un_pult", de: "das Rednerpult", syl: "RED-ner-pult", it: "il leggio", itSyl: "LEG-gio", en: "lectern", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Darauf liegt das Manuskript, daran steht das Mikrofon." });
}

/* =====================================================================
   7 — DIE TREPPE (Mittelgang) und DIE SITZREIHEN
   ===================================================================== */
const GANG = 0.62;
{
  /* Treppe im Mittelgang: je Reihe zwei Stufen */
  let k = "";
  const [ax, ay] = P(0, reihen[4].f, reihen[4].Wd - 0.6);
  for (let i = 4; i >= 0; i--) {
    const { Wd, f } = reihen[i];
    const Wv = Wd + 0.3, Wh = Wd - 0.9;        // Vorder- und Hinterkante der Stufe dieser Reihe
    for (const [w0, w1, h] of [[Wv - 0.6, Wv, f - 0.225], [Wh, Wv - 0.6, f]]) {
      k += poly([P(-GANG, h, w0), P(GANG, h, w0), P(GANG, h, w1), P(-GANG, h, w1)], i % 2 ? "#6f7780" : "#68707a");
      k += poly([P(-GANG, h, w1), P(GANG, h, w1), P(GANG, h, w1), P(-GANG, h, w1)], "#555");
      /* Stufenkante mit gelbem Sicherheitsstreifen */
      k += poly([P(-GANG, h, w1 - 0.04), P(GANG, h, w1 - 0.04), P(GANG, h, w1), P(-GANG, h, w1)], "#d9b53a");
    }
  }
  /* Handlauf-Lampen an den Stufen */
  for (const { Wd, f } of reihen) { const [x, y] = P(-GANG + 0.02, f + 0.12, Wd + 0.1); k += `<rect x="${r(x - 0.6)}" y="${r(y - 0.3)}" width="1.2" height=".6" fill="#fff3c4"/>`; }
  S.teil({ id: "treppe", de: "die Treppe", syl: "TREP-pe", it: "la scala", itSyl: "SCA-la", en: "stairs", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Über die Treppe in der Mitte kommt man zu den Plätzen." });
}

/* Eine Reihe: Podest, Klapptisch, Sitze (beide Blöcke) */
function reihe(i, opt = {}) {
  const { Wd, f } = reihen[i];
  let k = "";
  const Wv = Wd + 0.3, Wh = Wd - 0.9;
  for (const [a, b] of [[-XS, -GANG], [GANG, XS]]) {
    /* Podest (Teppich) */
    k += poly([P(a, f, Wh), P(b, f, Wh), P(b, f, Wv), P(a, f, Wv)], TEPPICH);
    /* Klapptisch: Platte und Schürze zur Kamera hin */
    k += quader(a, b, f + 0.62, f + 0.76, Wd - 0.42, Wd, { vorn: HOLZ, deckel: HOLZ_H });
    k += poly([P(a, f + 0.76, Wd - 0.42), P(b, f + 0.76, Wd - 0.42), P(b, f + 0.745, Wd - 0.42), P(a, f + 0.745, Wd - 0.42)], "#f0dcb4");
    /* Sitze (Polster, Rückenlehne zur Kamera) */
    const n = Math.round((b - a) / 0.56);
    for (let j = 0; j < n; j++) {
      const s0 = a + j * 0.56 + 0.04, s1 = s0 + 0.48;
      const hoch = opt.hoch && opt.hoch.includes(j + (a < 0 ? 0 : 100));
      if (hoch) k += quader(s0 + 0.02, s1 - 0.02, f + 0.42, f + 0.78, Wh + 0.32, Wh + 0.36, { vorn: "#1b3a59", deckel: "#2c5880" });
      else k += quader(s0 + 0.02, s1 - 0.02, f + 0.4, f + 0.46, Wh + 0.12, Wh + 0.54, { vorn: "#1b3a59", deckel: POLSTER_H });
      k += quader(s0, s1, f + 0.46, f + 0.98, Wh + 0.06, Wh + 0.12, { vorn: POLSTER, deckel: "#3c6f9e" });
      k += poly([P(s0, f + 0.98, Wh + 0.06), P(s1, f + 0.98, Wh + 0.06), P(s1, f + 0.95, Wh + 0.06), P(s0, f + 0.95, Wh + 0.06)], "#5584b3");
      /* Platznummer */
      if (i === 4 && j % 2 === 0) { const [nx, ny] = P((s0 + s1) / 2, f + 0.93, Wh + 0.05); if (nx > 2 && nx < 318 && ny < 198) k += `<rect x="${r(nx - 1)}" y="${r(ny - 0.5)}" width="2" height="1.2" rx=".2" fill="#e8e2d0"/>`; }
    }
    /* Seitenwange am Gang */
    const g = a < 0 ? b : a;
    k += poly([P(g, f, Wh + 0.05), P(g, f, Wd), P(g, f + 0.78, Wd), P(g, f + 1.0, Wh + 0.05)], "#4a3a2a");
  }
  return k;
}
const reiheTeil = (i, wort, extra = "", mehr = {}) => {
  const { Wd, f } = reihen[i];
  const [ax, ay] = P(GANG + 1.4, f, Wd - 0.9);
  S.teil(Object.assign({ x: ax, y: ay, steht: true, kunst: um(ax, ay, reihe(i, mehr.opt) + extra) }, wort));
};
reiheTeil(0, { id: "un_reihe3", de: "die vordere Reihe", syl: "VOR-de-re REI-he", it: "la prima fila", itSyl: "PRI-ma FI-la", en: "front row", tipp: "Vorn sieht man die Tafel am besten." });
reiheTeil(1, { id: "klapptisch", de: "der Klapptisch", syl: "KLAPP-tisch", it: "il tavolino ribaltabile", itSyl: "ta-vo-LI-no ri-bal-TA-bi-le", en: "folding desk", tipp: "Den Klapptisch klappt man zum Schreiben herunter." }, "", { opt: { hoch: [] } });

/* =====================================================================
   8 — DER STUDENT (mittlere Reihe, rechts, schreibt mit)
   ===================================================================== */
reiheTeil(2, { id: "un_reihe2", de: "die mittlere Reihe", syl: "MITT-le-re REI-he", it: "la fila di mezzo", itSyl: "FI-la di MEZ-zo", en: "middle row" });
{
  const { Wd, f } = reihen[2];
  const [ax, ay] = P(2.38, f, Wd - 0.62);
  const m = B.mensch({ id: "b09d_student", geschlecht: "m", pose: "lesen", blick: 172, frisur: "locken", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#c9a33a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#2f3035" } } }, 1.78 * mass(f, Wd - 0.62));
  /* Sitzpolster und Lehne unter/hinter ihm bleiben im Bild sichtbar (vor ihm: die Lehne) */
  const lehne = (() => { const s0 = 2.38 - 0.24, s1 = 2.38 + 0.24, Wh = Wd - 0.9; return quader(s0, s1, f + 0.46, f + 0.98, Wh + 0.06, Wh + 0.12, { vorn: POLSTER, deckel: "#3c6f9e" }); })();
  S.teil({ id: "student", de: "der Student", syl: "Stu-DENT", it: "lo studente", itSyl: "stu-DEN-te", en: "student", x: ax, y: ay, kunst: m.svg + um(ax, ay, lehne),
    tipp: "Er schreibt im Skript mit." });
}
reiheTeil(3, { id: "klappsitz", de: "der Klappsitz", syl: "KLAPP-sitz", it: "il sedile ribaltabile", itSyl: "se-DI-le ri-bal-TA-bi-le", en: "folding seat", tipp: "Steht man auf, klappt der Sitz von selbst hoch." }, "", { opt: { hoch: [2, 3, 102, 104] } });

/* =====================================================================
   9 — DIE STUDENTIN (zu spät, kommt die Treppe herunter)
   ===================================================================== */
{
  const W = reihen[3].Wd - 0.95, h = reihen[3].f + 0.22;
  const [ax, ay] = P(-0.12, h, W);
  const m = B.mensch({ id: "b09d_studentin", geschlecht: "w", pose: "treppe", blick: 196, frisur: "zopf", haarfarbe: "rot", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#d9d2c3" }, jacke: { stueck: "jacke", farbe: "#3f5f45" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel", farbe: "braun" }, zubehoer: { stueck: "tasche", farbe: "#7a4a2a" } } }, 1.68 * mass(h, W));
  S.teil({ id: "un_studentin", de: "die Studentin", syl: "Stu-DEN-tin", it: "la studentessa", itSyl: "stu-den-TES-sa", en: "student", x: ax, y: ay, kunst: m.svg,
    tipp: "Sie kommt zu spät und sucht einen Platz." });
}

/* =====================================================================
   10 — DIE HINTERE REIHE mit Lupe: Skript, Studentenausweis, Becher
   ===================================================================== */
{
  const i = 4, { Wd, f } = reihen[i], H = f + 0.765;
  let k = "";
  const U = [];
  /* Skript (geheftet, aufgeschlagen) */
  k += poly(blatt(2.15, Wd - 0.22, 0.42, 0.28, 0.06, H), "#fbfaf4", 'stroke="#c9c2b2" stroke-width=".2"');
  k += `<line x1="${P(2.15, H + 0.003, Wd - 0.35)[0]}" y1="${P(2.15, H + 0.003, Wd - 0.35)[1]}" x2="${P(2.15, H + 0.003, Wd - 0.09)[0]}" y2="${P(2.15, H + 0.003, Wd - 0.09)[1]}" stroke="#a49c8c" stroke-width=".4"/>`;
  for (let j = 0; j < 5; j++) for (const dx of [-0.16, 0.05]) k += `<line x1="${P(2.15 + dx, H + 0.004, Wd - 0.32 + j * 0.045)[0]}" y1="${P(2.15 + dx, H + 0.004, Wd - 0.32 + j * 0.045)[1]}" x2="${P(2.15 + dx + 0.12, H + 0.004, Wd - 0.32 + j * 0.045)[0]}" y2="${P(2.15 + dx + 0.12, H + 0.004, Wd - 0.32 + j * 0.045)[1]}" stroke="#8a8a8a" stroke-width=".25"/>`;
  k += poly(blatt(2.25, Wd - 0.12, 0.12, 0.04, 0.06, H + 0.004), "#f5e83b", 'opacity=".75"');
  { const [x, y] = P(2.15, H, Wd - 0.42); U.push({ id: "un_skript", de: "das Skript", syl: "SKRIPT", it: "la dispensa", itSyl: "di-SPEN-sa", en: "course notes", x, y: y + 1, kunst: flaeche(-12, -1, 24, 13),
    tipp: "Der gedruckte Text zur Vorlesung. Man kauft ihn im Copyshop." }); }
  /* Studentenausweis (Chipkarte) */
  k += poly(blatt(1.62, Wd - 0.18, 0.086, 0.054, -0.3, H + 0.002), S.lg("karte", [[0, "#2f7db3"], [1, "#1b4f8a"]]));
  { const c = P(1.62, H + 0.003, Wd - 0.18); k += `<rect x="${r(c[0] - 1.6)}" y="${r(c[1] - 0.9)}" width="1.1" height="1.2" fill="#e0c068" transform="rotate(-12 ${c[0]} ${c[1]})"/><rect x="${r(c[0] + 0.2)}" y="${r(c[1] - 0.8)}" width="1.6" height=".35" fill="#fff" transform="rotate(-12 ${c[0]} ${c[1]})"/>`; }
  { const [x, y] = P(1.62, H, Wd - 0.18); U.push({ id: "un_ausweis", de: "der Studentenausweis", syl: "Stu-DEN-ten-aus-weis", it: "il libretto universitario", itSyl: "li-BRET-to", en: "student card", x, y: y + 2.4, kunst: flaeche(-4.6, -5.6, 9.2, 6.8),
    tipp: "Darauf steht die Matrikelnummer — die eigene Nummer an der Hochschule." }); }
  /* Kaffeebecher (to go) */
  { const [x, y] = P(2.72, H, Wd - 0.15), s = mass(H, Wd - 0.15);
    k += `<path d="M${r(x - 0.04 * s)} ${y} L${r(x - 0.045 * s)} ${r(y - 0.13 * s)} L${r(x + 0.045 * s)} ${r(y - 0.13 * s)} L${r(x + 0.04 * s)} ${y} Z" fill="#f4efe6"/><rect x="${r(x - 0.046 * s)}" y="${r(y - 0.08 * s)}" width="${r(0.092 * s)}" height="${r(0.04 * s)}" fill="#7a4a2a"/><ellipse cx="${x}" cy="${r(y - 0.13 * s)}" rx="${r(0.05 * s)}" ry="${r(0.015 * s)}" fill="#3a3a3a"/>`;
    U.push({ id: "kaffeebecher", de: "der Kaffeebecher", syl: "KAF-fee-be-cher", it: "il bicchiere da caffè", itSyl: "bic-CHIE-re da caf-FÈ", en: "coffee cup", x, y: y + 1, kunst: flaeche(-4, -0.15 * s - 1, 8, 0.15 * s + 2) }); }
  const [ax, ay] = P(GANG + 1.4, f, Wd - 0.9);
  const [zx, zy] = P(1.0, H, Wd - 0.42);
  S.teil({ id: "un_reihe1", de: "die hintere Reihe", syl: "HIN-te-re REI-he", it: "la fila in alto", itSyl: "FI-la in AL-to", en: "back row", x: ax, y: ay, steht: true, kunst: um(ax, ay, reihe(4) + k),
    zoom: { x: r(zx - 6), y: r(zy - 26), w: 78, h: 52 },
    unter: U.map((u) => Object.assign(u, { x: r(u.x), y: r(u.y) })),
    tipp: "Die Bänke steigen nach hinten an." });
}
{
  /* DER LAPTOP — aufgeklappt auf dem Klapptisch der hinteren Reihe */
  const { Wd, f } = reihen[4], H = f + 0.765;
  const [ax, ay] = P(0.98, H, Wd - 0.12);
  const s = mass(H, Wd - 0.12);
  let k = schatten(0, 0, 0.18 * s, 0.03 * s, 0.25);
  const b = 0.17 * s, t = 0.11 * s, hs = 0.21 * s;
  k += `<path d="M${r(-b)} 0 L${r(b)} 0 L${r(b * 0.86)} ${r(-t)} L${r(-b * 0.86)} ${r(-t)} Z" fill="#b9c0c6"/>`;
  k += `<path d="M${r(-b * 0.78)} ${r(-t * 0.25)} L${r(b * 0.78)} ${r(-t * 0.25)} L${r(b * 0.7)} ${r(-t * 0.85)} L${r(-b * 0.7)} ${r(-t * 0.85)} Z" fill="#3a4148"/>`;
  k += `<path d="M${r(-b * 0.86)} ${r(-t)} L${r(b * 0.86)} ${r(-t)} L${r(b * 0.9)} ${r(-t - hs)} L${r(-b * 0.9)} ${r(-t - hs)} Z" fill="#2b3036"/>`;
  k += `<path d="M${r(-b * 0.8)} ${r(-t - 0.8)} L${r(b * 0.8)} ${r(-t - 0.8)} L${r(b * 0.84)} ${r(-t - hs + 0.8)} L${r(-b * 0.84)} ${r(-t - hs + 0.8)} Z" fill="${S.lg("lapbild", [[0, "#f5f7fa"], [1, "#dfe7ef"]])}"/>`;
  k += `<rect x="${r(-b * 0.78)}" y="${r(-t - hs + 1)}" width="${r(b * 1.56)}" height="1.6" fill="#1b4f8a"/>`;
  for (let j = 0; j < 5; j++) k += `<rect x="${r(-b * 0.7)}" y="${r(-t - hs + 4 + j * 1.9)}" width="${r(b * (1.1 - (j % 3) * 0.2))}" height=".5" fill="#7d8790"/>`;
  S.teil({ oben: true, id: "un_laptop", de: "der Laptop", syl: "LAP-top", it: "il portatile", itSyl: "por-TA-ti-le", en: "laptop", x: ax, y: ay, steht: true, kunst: k,
    tipp: "Mitschreiben geht heute meist damit." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/universitaet.js"));
console.log(aus);
