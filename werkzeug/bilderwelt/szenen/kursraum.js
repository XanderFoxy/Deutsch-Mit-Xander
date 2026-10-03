#!/usr/bin/env node
/* =====================================================================
   DER KURSRAUM (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   Ein Raum für den INTEGRATIONSKURS (z. B. an der Volkshochschule).
   RECHERCHE (BAMF-Merkblatt für Teilnehmende, Flyer der VHS Essen,
   Braunschweig und des Internationalen Bundes 2025):
   - Unterricht in Modulen zu je 100 Unterrichtsstunden, vormittags
     Mo–Fr; am Ende die Prüfung „Deutsch-Test für Zuwanderer“ (DTZ) und
     der Test „Leben in Deutschland“. Der KOSTENBEITRAG ist 2,29 € je
     Unterrichtsstunde (229 € pro Modul); wer B1 schafft, bekommt die
     Hälfte zurück. Zur Prüfung meldet man sich mit einem ANMELDE-
     FORMULAR an – Aushänge hängen an der PINNWAND.
   - Die Tische stehen in U-FORM, damit alle einander sehen und sprechen
     können; vorn das WHITEBOARD (die Tafel) mit der Konjugationstabelle,
     der BEAMER an der Decke, das Lehrerpult (SCHREIBTISCH) mit
     BILDSCHIRM. Für hybride Stunden: KAMERA, MIKROFON und KOPFHÖRER,
     damit Teilnehmende auch von zu Hause mitmachen können.
   - Auf den Tischen: KURSBUCH, WÖRTERBUCH, ARBEITSBLÄTTER, HEFTE.
     An der Wand STUNDENPLAN, KALENDER mit dem Prüfungstag, eine UHR.
     Links Fenster mit Heizkörpern.
   BLICK: vom offenen Ende der U-Form zur Tafel, Fluchtpunkt in der
   Mitte, Augenhöhe 1,6 m. Maßstab: Stirnwand 36 Einheiten je Meter,
   Tischhöhe 0,75 m, Lehrer 1,80 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "kursraum", titel: "Der Kursraum", emoji: "💻", thema: "Bildung", kuerzel: "b09c", fassung: 852 });
const rnd = zufall(2290);
const r = B.r;

/* ---------- Kamera ---------------------------------------------------- */
const HY = 70, E = 1.7, D = 7, S0 = 36, VX = 160;
const sk = (z) => S0 * D / (D - z);
const P = (X, H, z) => [r(VX + X * sk(z)), r(HY + (E - H) * sk(z))];
/* Polygone und Linien werden am Bildrand abgeschnitten (nichts ragt aus dem Bild) */
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
const poly = (pts, fill, extra = "") => { const q = klipp(pts); return q.length < 3 ? "" : `<path d="M${q.map((p) => p[0] + " " + p[1]).join(" L")} Z" fill="${fill}"${extra ? " " + extra : ""}/>`; };
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
function L(a, b, w, f, ex = "") {
  /* Liang-Barsky: Linie auf das Bild beschneiden */
  let t0 = 0, t1 = 1; const dx = b[0] - a[0], dy = b[1] - a[1];
  for (const [p, q] of [[-dx, a[0]], [dx, 320 - a[0]], [-dy, a[1]], [dy, 200 - a[1]]]) {
    if (p === 0) { if (q < 0) return ""; continue; }
    const t = q / p; if (p < 0) { if (t > t1) return ""; if (t > t0) t0 = t; } else { if (t < t0) return ""; if (t < t1) t1 = t; }
  }
  const A = [r(a[0] + t0 * dx), r(a[1] + t0 * dy)], Bp = [r(a[0] + t1 * dx), r(a[1] + t1 * dy)];
  return `<line x1="${A[0]}" y1="${A[1]}" x2="${Bp[0]}" y2="${Bp[1]}" stroke="${f}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
}
function kiste(X0, X1, H0, H1, z0, z1, f) {
  let g = "";
  if (X1 < 0 && f.seite) g += poly([P(X1, H0, z1), P(X1, H0, z0), P(X1, H1, z0), P(X1, H1, z1)], f.seite);
  if (X0 > 0 && f.seite) g += poly([P(X0, H0, z1), P(X0, H0, z0), P(X0, H1, z0), P(X0, H1, z1)], f.seite);
  if (H1 < E && f.deckel) g += poly([P(X0, H1, z1), P(X1, H1, z1), P(X1, H1, z0), P(X0, H1, z0)], f.deckel);
  if (f.vorn) g += poly([P(X0, H0, z1), P(X1, H0, z1), P(X1, H1, z1), P(X0, H1, z1)], f.vorn);
  return g;
}
const WX = (X) => r(VX + X * S0), WY = (H) => r(HY + (E - H) * S0);
const T = (x, y, s, txt, f = "#222", extra = "") => `<text x="${r(x)}" y="${r(y)}" font-size="${s}" fill="${f}" font-family="Arial,Helvetica,sans-serif"${extra ? " " + extra : ""}>${txt}</text>`;
function blatt(X, z, w, t, dreh, h) {
  const c = Math.cos(dreh), s = Math.sin(dreh);
  return [[-w / 2, -t / 2], [w / 2, -t / 2], [w / 2, t / 2], [-w / 2, t / 2]].map(([a, b]) => P(X + a * c - b * s, h, z + a * s + b * c));
}

/* ---------- Farben ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WAND = S.lg("wand", [[0, "#f5f2ea"], [1, "#e8e2d4"]]);
const LWAND = S.lg("lwand", [[0, "#ddd6c7"], [1, "#ebe5d8"]], 0, 0, 1, 0);
const RWAND = S.lg("rwand", [[0, "#ebe5d8"], [1, "#ddd6c7"]], 0, 0, 1, 0);
const BUCHE = S.lg("buche", [[0, "#e6cfa6"], [1, "#d6ba8c"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const VHS = "#1c6aa8";

/* =====================================================================
   KULISSE — Decke, Stirnwand, Fensterwand links, Wand rechts, Boden,
   der rechte Schenkel der U-Form mit seinen Stühlen
   ===================================================================== */
const XL = -3.2, XR = 3.2, HD = 3.0, ZE = 4.2;
const stuhlZ = (X, z, seite) => {
  /* Vierfußstuhl mit Kunststoffschale, Lehne zur Wand */
  let k = "";
  for (const [dx, dz] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) k += L(P(X + dx, 0, z + dz), P(X + dx, 0.44, z + dz), 0.9, "#40474e");
  k += kiste(X - 0.22, X + 0.22, 0.42, 0.46, z - 0.22, z + 0.22, { vorn: "#7a2a2a", deckel: S.lg("sitz", [[0, "#b03a34"], [1, "#c9483f"]]), seite: "#8a302c" });
  const lx = X + seite * 0.22;
  k += poly([P(lx, 0.46, z - 0.22), P(lx, 0.46, z + 0.22), P(lx + seite * 0.03, 0.88, z + 0.21), P(lx + seite * 0.03, 0.88, z - 0.21)], S.lg("lehneS", [[0, "#c9483f"], [1, "#9e3530"]]));
  return k;
};
{
  const WO = WY(HD), WU = WY(0);
  /* Decke mit Rasterplatten und Rasterleuchten */
  let k = `<rect x="0" y="0" width="320" height="${WO}" fill="${S.lg("decke", [[0, "#e9e7e1"], [1, "#f4f3ef"]])}"/>`;
  for (let X = -3.0; X <= 3.01; X += 0.625) k += L(P(X, HD, 0), P(X, HD, ZE), 0.3, "#d6d3ca");
  for (let z = 0.625; z < ZE; z += 0.625) k += L(P(XL, HD, z), P(XR, HD, z), 0.3, "#d6d3ca");
  for (const [X, z] of [[-1.875, 0.625], [0.625, 0.625], [-1.875, 2.5], [0.625, 2.5]]) k += poly([P(X, HD, z), P(X + 1.25, HD, z), P(X + 1.25, HD, z + 0.625), P(X, HD, z + 0.625)], "#fffef6", 'stroke="#dcdad2" stroke-width=".4"');
  /* Stirnwand */
  k += `<rect x="${WX(XL)}" y="${WO}" width="${r(WX(XR) - WX(XL))}" height="${r(WU - WO)}" fill="${WAND}"/>`;
  k += `<rect x="${WX(XL)}" y="${WO}" width="${r(WX(XR) - WX(XL))}" height="${r(WU - WO)}" fill="${S.rg("wl", [[0, "#fffaf0", 0.5], [1, "#fffaf0", 0]], 0.5, 0.3, 0.7)}"/>`;
  /* linke Fensterwand und rechte Wand in Flucht */
  k += poly([P(XL, HD, 0), P(XL, HD, ZE), P(XL, 0, ZE), P(XL, 0, 0)], LWAND);
  k += poly([P(XR, HD, 0), P(XR, HD, ZE), P(XR, 0, ZE), P(XR, 0, 0)], RWAND);
  /* Boden: Linoleum, warmes Grau, mit Bahnen */
  k += poly([P(XL, 0, 0), P(XR, 0, 0), P(XR, 0, ZE), P(XL, 0, ZE)], S.lg("boden", [[0, "#a69d90"], [1, "#958b7e"]]));
  for (let X = -3.0; X < 3.2; X += 1.0) k += L(P(X, 0, 0), P(X, 0, ZE), 0.35, "#857b6f");
  for (let i = 0; i < 160; i++) { const X = XL + rnd() * 6.4, z = rnd() * ZE, [x, y] = P(X, 0, z); k += `<circle cx="${x}" cy="${y}" r="${r(0.2 + rnd() * 0.35)}" fill="${rnd() < 0.5 ? "#bdb5a8" : "#7d7366"}" opacity=".5"/>`; }
  /* Sockelleisten */
  k += `<rect x="${WX(XL)}" y="${r(WU - 2.2)}" width="${r(WX(XR) - WX(XL))}" height="2.2" fill="#6d665c"/>`;
  k += poly([P(XL, 0.08, 0), P(XL, 0.08, ZE), P(XL, 0, ZE), P(XL, 0, 0)], "#6d665c") + poly([P(XR, 0.08, 0), P(XR, 0.08, ZE), P(XR, 0, ZE), P(XR, 0, 0)], "#6d665c");
  /* Fenster links mit Bäumen draußen, darunter Heizkörper */
  for (const [za, zb] of [[0.35, 1.25], [1.55, 2.55]]) {
    k += poly([P(XL, 2.55, za - 0.05), P(XL, 2.55, zb + 0.05), P(XL, 0.85, zb + 0.05), P(XL, 0.85, za - 0.05)], "#f4f4f2");
    k += poly([P(XL, 2.5, za), P(XL, 2.5, zb), P(XL, 0.9, zb), P(XL, 0.9, za)], S.lg("himmel", [[0, "#bcd9ec"], [0.6, "#d9ead2"], [1, "#9cc28a"]]));
    /* Baumkronen */
    for (let i = 0; i < 6; i++) { const z = za + (zb - za) * (0.15 + i * 0.15), [x, y] = P(XL, 1.35 + (i % 2) * 0.25, z), s = sk(z) / S0; k += `<ellipse cx="${x}" cy="${y}" rx="${r(5 * s)}" ry="${r(7 * s)}" fill="${i % 2 ? "#6e9e58" : "#5b8a49"}" opacity=".85"/>`; }
    const m = (za + zb) / 2;
    k += L(P(XL, 2.5, m), P(XL, 0.9, m), 1.2, "#f4f4f2");
    k += poly([P(XL, 2.5, za), P(XL, 2.5, za + 0.25), P(XL, 1.3, za + 0.05), P(XL, 1.3, za)], "#fff", 'opacity=".25"');
    /* Fensterbank */
    k += poly([P(XL, 0.85, za - 0.08), P(XL, 0.85, zb + 0.08), P(XL + 0.18, 0.85, zb + 0.08), P(XL + 0.18, 0.85, za - 0.08)], "#e2ded6");
    /* Heizkörper */
    k += poly([P(XL + 0.05, 0.7, za + 0.1), P(XL + 0.05, 0.7, zb - 0.1), P(XL + 0.05, 0.15, zb - 0.1), P(XL + 0.05, 0.15, za + 0.1)], "#f0efeb");
    for (let z = za + 0.14; z < zb - 0.1; z += 0.07) k += L(P(XL + 0.05, 0.66, z), P(XL + 0.05, 0.19, z), 0.35, "#cfccc4");
  }
  /* Tür rechts vorn (zum Flur) */
  k += poly([P(XR, 2.05, 0.3), P(XR, 2.05, 1.3), P(XR, 0, 1.3), P(XR, 0, 0.3)], S.lg("tuer", [[0, "#c9a877"], [1, "#b8955f"]], 0, 0, 1, 0));
  k += poly([P(XR, 2.08, 0.26), P(XR, 2.08, 1.34), P(XR, 2.05, 1.34), P(XR, 2.05, 0.26)], "#8f979e");
  k += L(P(XR, 1.05, 1.15), P(XR, 1.05, 1.03), 1, "#c9cfd4");
  /* der linke Schenkel der U-Form: Stühle (an der Fensterseite) und Tische */
  for (const z of [1.95, 2.8, 3.65]) k += stuhlZ(-2.9, z, -1);
  for (const [z0, z1] of [[1.5, 2.35], [2.35, 3.2], [3.2, 4.05]]) {
    const X0 = -2.4, X1 = -1.75;
    for (const z of [z0 + 0.05, z1 - 0.05]) k += L(P(X1 - 0.05, 0, z), P(X1 - 0.05, 0.72, z), 1.1, "#4d555c");
    k += kiste(X0, X1, 0.72, 0.75, z0, z1, { seite: "#a9865a", deckel: BUCHE, vorn: "#b89466" });
    k += L(P(X1, 0.75, z1), P(X1, 0.75, z0), 0.3, "#fff", ' opacity=".5"');
  }
  /* Bücher und Hefte der anderen Teilnehmenden */
  k += poly(blatt(-2.08, 2.0, 0.24, 0.32, -0.3, 0.755), "#2f6db5") + poly(blatt(-2.1, 2.85, 0.42, 0.28, 0.2, 0.755), "#f8f6ef") + poly(blatt(-2.06, 3.6, 0.21, 0.3, -0.1, 0.755), "#e9a23b");
  S.hinten(k);
}

/* =====================================================================
   1 — DIE UHR über der Tafel
   ===================================================================== */
{
  let k = `<circle r="6" fill="#2f3439"/><circle r="5.3" fill="${S.rg("zb", [[0, "#ffffff"], [1, "#ecebe6"]])}"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, l = i % 3 ? 0.6 : 1.2; k += `<line x1="${r(Math.sin(a) * 4.7)}" y1="${r(-Math.cos(a) * 4.7)}" x2="${r(Math.sin(a) * (4.7 - l))}" y2="${r(-Math.cos(a) * (4.7 - l))}" stroke="#222" stroke-width="${i % 3 ? 0.28 : 0.55}"/>`; }
  /* 8:35 Uhr – der Kurs hat gerade begonnen */
  k += `<line x1="0" y1="0" x2="${r(Math.sin(8.58 * Math.PI / 6) * 2.8)}" y2="${r(-Math.cos(8.58 * Math.PI / 6) * 2.8)}" stroke="#111" stroke-width=".75" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="0" x2="${r(Math.sin(7 * Math.PI / 6) * 4)}" y2="${r(-Math.cos(7 * Math.PI / 6) * 4)}" stroke="#111" stroke-width=".45" stroke-linecap="round"/><circle r=".45" fill="#c8102e"/>`;
  k += `<path d="M-3.6 -3.8 A5.3 5.3 0 0 1 2.6 -4.6" stroke="#fff" stroke-width=".6" opacity=".7" fill="none"/>`;
  S.teil({ id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: WX(0), y: WY(2.62), kunst: k,
    tipp: "Der Kurs beginnt um 8:30 Uhr." });
}

/* =====================================================================
   2 — DIE TAFEL (Whiteboard) mit Konjugationstabelle
   ===================================================================== */
{
  const x0 = WX(-1.32), x1 = WX(1.32), y0 = WY(2.22), y1 = WY(0.94), w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0 - 1.3}" y="${y0 - 1.3}" width="${r(w + 2.6)}" height="${r(h + 2.6)}" rx=".8" fill="${STAHL}"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" fill="${S.lg("wbf", [[0, "#ffffff"], [1, "#eef1f2"]], 0, 0, 1, 1)}"/>`;
  const hw = (x, y, s, t, f = "#1d3f8a", ex = "") => T(x, y, s, t, f, `font-family="'Segoe Print','Comic Sans MS',cursive"${ex ? " " + ex : ""}`);
  k += hw(x0 + 3, y0 + 6, 3.8, "Modul 3 · Verben im Präsens", "#c0392b", 'font-weight="bold"');
  /* Konjugationstabelle: lernen / sein / haben */
  const tx = x0 + 3, ty = y0 + 10, cw = [15, 19, 19, 19], rh = 4.1;
  const kopf = ["", "lernen", "sein", "haben"];
  const zeilen = [["ich", "lerne", "bin", "habe"], ["du", "lernst", "bist", "hast"], ["er/sie/es", "lernt", "ist", "hat"], ["wir", "lernen", "sind", "haben"], ["ihr", "lernt", "seid", "habt"], ["sie/Sie", "lernen", "sind", "haben"]];
  let cx = tx;
  kopf.forEach((t, i) => { k += hw(cx + 1, ty + 3, 3, t, "#1d3f8a", 'font-weight="bold"'); cx += cw[i]; });
  k += `<line x1="${tx}" y1="${r(ty + 4.2)}" x2="${r(tx + 72)}" y2="${r(ty + 4.2)}" stroke="#1d3f8a" stroke-width=".4"/>`;
  k += `<line x1="${tx + 14}" y1="${ty}" x2="${tx + 14}" y2="${r(ty + 4.4 + zeilen.length * rh)}" stroke="#1d3f8a" stroke-width=".4"/>`;
  zeilen.forEach((z, j) => {
    let x = tx;
    z.forEach((t, i) => {
      if (i === 0) k += hw(x + 1, ty + 4.4 + (j + 1) * rh - 0.8, 2.6, t, "#333");
      else {
        /* Stamm schwarz, Endung rot (bei lernen) */
        if (i === 1) { const st = "lern", end = t.slice(4); k += hw(x + 1, ty + 4.4 + (j + 1) * rh - 0.8, 2.7, `${st}<tspan fill="#c0392b">${end}</tspan>`, "#111"); }
        else k += hw(x + 1, ty + 4.4 + (j + 1) * rh - 0.8, 2.7, t, "#111");
      }
      x += cw[i];
    });
  });
  k += hw(x1 - 3, y1 - 4, 2.6, "Hausaufgabe: AB S. 12", "#2e7d32", 'text-anchor="end"');
  /* Ablage mit Stiften und Schwamm */
  k += `<rect x="${x0 + 2}" y="${y1 + 1.3}" width="${r(w - 4)}" height="1.5" rx=".5" fill="#aeb6bd"/>`;
  for (const [dx, f] of [[10, "#1d3f8a"], [14, "#c0392b"], [18, "#2e7d32"], [22, "#111"]]) k += `<rect x="${x0 + dx}" y="${y1 + 0.5}" width="3.2" height=".9" rx=".4" fill="${f}"/>`;
  k += `<rect x="${x1 - 14}" y="${y1 - 0.6}" width="5" height="1.9" rx=".4" fill="#3b4b5c"/>`;
  k += `<path d="M${x0} ${y0} L${x0 + 20} ${y0} L${x0} ${y0 + 24} Z" fill="#fff" opacity=".22"/>`;
  const ax = (x0 + x1) / 2, ay = y1 + 2.8;
  S.teil({ id: "kr_tafel_kr", de: "die Tafel", syl: "TA-fel", it: "la lavagna", itSyl: "la-VA-gna", en: "board", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Heute ist die Tafel oft ein Whiteboard: Man schreibt mit Stiften." });
}

/* =====================================================================
   3 — DER STUNDENPLAN (links an der Stirnwand)
   ===================================================================== */
{
  const x0 = WX(-3.05), x1 = WX(-2.08), y0 = WY(2.3), y1 = WY(1.45), w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" fill="#fff" stroke="#c9c2b6" stroke-width=".4"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(w)}" height="4.6" fill="${VHS}"/>` + T(x0 + w / 2, y0 + 3.3, 2.3, "Stundenplan", "#fff", 'text-anchor="middle" font-weight="bold"');
  const tage = ["Mo", "Di", "Mi", "Do", "Fr"], cw = (w - 7) / 5;
  tage.forEach((t, i) => { k += T(x0 + 6 + i * cw + cw / 2, y0 + 7.4, 1.6, t, "#333", 'text-anchor="middle" font-weight="bold"'); });
  const zeiten = ["8:30", "10:15", "11:15"];
  const farbe = ["#e6f0f8", "#fdf0d8", "#e8f4e4"];
  zeiten.forEach((z, j) => {
    k += T(x0 + 1, y0 + 11.6 + j * 6.4, 1.4, z, "#555");
    for (let i = 0; i < 5; i++) k += `<rect x="${r(x0 + 6 + i * cw + 0.3)}" y="${r(y0 + 8.6 + j * 6.4)}" width="${r(cw - 0.6)}" height="5.6" fill="${farbe[(i + j) % 3]}"/>`;
  });
  k += T(x0 + w / 2, y1 - 1.2, 1.4, "Integrationskurs · Raum 104", "#666", 'text-anchor="middle"');
  const ax = (x0 + x1) / 2, ay = y1;
  S.teil({ id: "kr_stundenplan_kr", de: "der Stundenplan", syl: "STUN-den-plan", it: "l'orario", itSyl: "o-RA-rio", en: "timetable", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Der Integrationskurs ist Montag bis Freitag, jeden Vormittag." });
}

/* =====================================================================
   4 — DIE PINNWAND (Kork) mit Lupe: Preis, Anmeldeformular
   ===================================================================== */
{
  const x0 = WX(1.52), x1 = WX(2.62), y0 = WY(2.3), y1 = WY(1.48), w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0 - 1.1}" y="${y0 - 1.1}" width="${r(w + 2.2)}" height="${r(h + 2.2)}" rx=".6" fill="#8a6440"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" fill="${S.lg("kork", [[0, "#c9995e"], [1, "#b88748"]])}"/>`;
  for (let i = 0; i < 70; i++) k += `<circle cx="${r(x0 + rnd() * w)}" cy="${r(y0 + rnd() * h)}" r=".25" fill="${rnd() < 0.5 ? "#9c6c35" : "#dcae74"}"/>`;
  const nadel = (x, y, f) => `<circle cx="${r(x)}" cy="${r(y)}" r=".7" fill="${f}"/><circle cx="${r(x - 0.2)}" cy="${r(y - 0.2)}" r=".25" fill="#fff" opacity=".6"/>`;
  const U = [];
  /* Aushang Kostenbeitrag (Preis) */
  {
    const bx = x0 + 2, by = y0 + 2.4, bw = 16.5, bh = 19;
    k += `<rect x="${bx + 0.4}" y="${by + 0.5}" width="${bw}" height="${bh}" fill="#000" opacity=".2"/><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#fffef8"/>`;
    k += `<rect x="${bx}" y="${by}" width="${bw}" height="3.4" fill="${VHS}"/>` + T(bx + bw / 2, by + 2.4, 1.5, "Integrationskurs", "#fff", 'text-anchor="middle" font-weight="bold"');
    k += T(bx + bw / 2, by + 6, 1.3, "Kostenbeitrag", "#333", 'text-anchor="middle"');
    k += T(bx + bw / 2, by + 10.6, 3.6, "2,29 €", "#c0392b", 'text-anchor="middle" font-weight="bold"');
    k += T(bx + bw / 2, by + 13, 1.15, "pro Unterrichtsstunde", "#333", 'text-anchor="middle"');
    k += T(bx + bw / 2, by + 15.2, 1.1, "Modul (100 Std.) = 229 €", "#555", 'text-anchor="middle"');
    k += T(bx + bw / 2, by + 17.4, 1, "B1 bestanden: 50 % zurück", "#2e7d32", 'text-anchor="middle"');
    k += nadel(bx + bw / 2, by + 0.9, "#c0392b");
    U.push({ id: "kr_preis", de: "der Preis", syl: "PREIS", it: "il prezzo", itSyl: "PREZ-zo", en: "price", x: bx + bw / 2, y: by + bh,
      tipp: "Eine Stunde Integrationskurs kostet 2,29 €. Mit Bürgergeld ist der Kurs oft kostenlos.", kunst: flaeche(-bw / 2 - 0.5, -bh - 0.6, bw + 1, bh + 1) });
  }
  /* Anmeldeformular zur Prüfung DTZ */
  {
    const bx = x0 + 21, by = y0 + 3.4, bw = 15, bh = 20;
    k += `<rect x="${bx + 0.4}" y="${by + 0.5}" width="${bw}" height="${bh}" fill="#000" opacity=".2"/><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#ffffff" transform="rotate(2 ${bx + bw / 2} ${by})"/>`;
    k += `<g transform="rotate(2 ${bx + bw / 2} ${by})">` + T(bx + 1.2, by + 2.6, 1.3, "Anmeldung", "#111", 'font-weight="bold"') + T(bx + 1.2, by + 4.4, 1.05, "Prüfung DTZ · 27.11.", "#c0392b");
    for (let i = 0; i < 6; i++) k += T(bx + 1.2, by + 7.2 + i * 2, 0.95, ["Name:", "Vorname:", "Geburtsdatum:", "Adresse:", "Kurs-Nr.:", "Unterschrift:"][i], "#555") + `<line x1="${bx + 7}" y1="${r(by + 7.4 + i * 2)}" x2="${bx + bw - 1}" y2="${r(by + 7.4 + i * 2)}" stroke="#999" stroke-width=".18"/>`;
    k += `<rect x="${bx + 1.2}" y="${by + 18.8}" width=".8" height=".8" fill="none" stroke="#555" stroke-width=".18"/>` + T(bx + 2.4, by + 19.5, 0.85, "Leben in Deutschland", "#555") + `</g>`;
    k += nadel(bx + bw / 2, by + 0.9, "#2e7d32");
    U.push({ id: "kr_anmeldeformular", de: "das Anmeldeformular", syl: "AN-mel-de-for-mu-lar", it: "il modulo d'iscrizione", itSyl: "MO-du-lo d'i-scri-ZIO-ne", en: "registration form", x: bx + bw / 2, y: by + bh + 0.6,
      tipp: "Mit dem Anmeldeformular meldet man sich zur Prüfung an.", kunst: flaeche(-bw / 2 - 0.5, -bh - 1, bw + 1.4, bh + 1.4) });
  }
  const ax = (x0 + x1) / 2, ay = y1;
  S.teil({ id: "pinnwand", de: "die Pinnwand", syl: "PINN-wand", it: "la bacheca", itSyl: "ba-CHE-ca", en: "pinboard", x: ax, y: ay, kunst: um(ax, ay, k),
    zoom: { x: r(x0 - 3), y: r(y0 - 2), w: r(w + 6), h: r((w + 6) / 1.5) },
    unter: U.map((u) => Object.assign(u, { x: r(u.x), y: r(u.y) })),
    tipp: "An der Pinnwand hängen Aushänge für den Kurs." });
}

/* =====================================================================
   5 — DER KALENDER (rechts an der Stirnwand)
   ===================================================================== */
{
  const x0 = WX(2.72), x1 = WX(3.12), y0 = WY(2.28), y1 = WY(1.36), w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0 + 0.4}" y="${y0 + 0.5}" width="${r(w)}" height="${r(h)}" fill="#000" opacity=".15"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h * 0.5)}" fill="${S.lg("kalbild", [[0, "#8fbad8"], [0.6, "#c7dbe8"], [1, "#7d9e62"]])}"/>`;
  k += `<path d="M${x0} ${r(y0 + h * 0.5)} L${x0 + 4} ${r(y0 + h * 0.3)} L${x0 + 8} ${r(y0 + h * 0.42)} L${x0 + 11} ${r(y0 + h * 0.26)} L${x1} ${r(y0 + h * 0.4)} L${x1} ${r(y0 + h * 0.5)} Z" fill="#6c8f52"/>`;
  k += `<rect x="${x0}" y="${r(y0 + h * 0.5)}" width="${r(w)}" height="${r(h * 0.5)}" fill="#fff"/>`;
  k += T(x0 + w / 2, y0 + h * 0.5 + 2.4, 1.6, "November", "#c0392b", 'text-anchor="middle" font-weight="bold"');
  for (let i = 0; i < 30; i++) { const c = (i + 6) % 7, rr = Math.floor((i + 6) / 7); const x = x0 + 1 + c * (w - 2) / 7, y = y0 + h * 0.5 + 4.2 + rr * 2.6; k += T(x + 0.9, y, 1.05, String(i + 1), c > 4 ? "#c0392b" : "#333", 'text-anchor="middle"'); if (i === 26) k += `<circle cx="${r(x + 0.9)}" cy="${r(y - 0.4)}" r="1.2" fill="none" stroke="#c0392b" stroke-width=".3"/>`; }
  k += `<rect x="${r(x0 + w / 2 - 1)}" y="${y0 - 1.4}" width="2" height="1.6" rx=".4" fill="#555"/>`;
  const ax = (x0 + x1) / 2, ay = y1;
  S.teil({ id: "kr_kalender", de: "der Kalender", syl: "Ka-LEN-der", it: "il calendario", itSyl: "ca-len-DA-rio", en: "calendar", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Am 27. November ist die Prüfung – rot eingekreist." });
}

/* =====================================================================
   6 — DER BEAMER an der Decke (zeigt auf die Tafel)
   ===================================================================== */
{
  const [ax, ay] = P(0, 2.66, 1.7);
  const [, dy] = P(0, HD, 1.7);
  let k = `<rect x="-.6" y="${r(dy - ay)}" width="1.2" height="${r(ay - dy - 3.6)}" fill="#9aa1a8"/><rect x="-3" y="${r(-3.6 - 1)}" width="6" height="1" fill="#7d868d"/>`;
  k += `<path d="M-10 -3.6 L10 -3.6 L11 2.4 L-11 2.4 Z" fill="${S.lg("beamer", [[0, "#f6f7f8"], [1, "#c9ced3"]])}"/><rect x="-11" y="1.8" width="22" height="1.6" rx=".5" fill="#b8bec4"/>`;
  k += `<ellipse cx="0" cy="-.4" rx="3.2" ry="2.4" fill="#3a4148"/><ellipse cx="0" cy="-.4" rx="2" ry="1.5" fill="${S.rg("linse", [[0, "#9bd0ff"], [1, "#1d2a38"]])}"/>`;
  for (let i = 0; i < 4; i++) k += `<line x1="${5 + i * 1.4}" y1="-2" x2="${5 + i * 1.4}" y2="1.2" stroke="#9aa1a8" stroke-width=".35"/>`;
  k += `<circle cx="-7" cy="-1.6" r=".45" fill="#4cd964"/>`;
  S.teil({ oben: true, id: "beamer", de: "der Beamer", syl: "BEA-mer", it: "il proiettore", itSyl: "pro-iet-TO-re", en: "projector", x: ax, y: ay, kunst: k,
    tipp: "Der Beamer wirft Bilder und Videos an die Tafel." });
}

/* =====================================================================
   7 — DER BÜROSTUHL hinter dem Schreibtisch
   ===================================================================== */
const SD = { X0: 0.9, X1: 2.15, z0: 0.5, z1: 1.08, H: 0.75 };
{
  const X = 2.0, z = 0.28;
  const [ax, ay] = P(X, 0, z);
  let k = schatten(ax, ay, 9, 1, 0.25);
  /* Fünfsternfuß mit Rollen */
  for (let i = 0; i < 5; i++) { const a = i * 2 * Math.PI / 5 + 0.3, e = P(X + Math.cos(a) * 0.3, 0.05, z + Math.sin(a) * 0.3), c = P(X, 0.1, z); k += L(c, e, 1, "#2a2e33") + `<circle cx="${e[0]}" cy="${r(e[1] + 0.8)}" r=".8" fill="#1a1c1f"/>`; }
  k += L(P(X, 0.1, z), P(X, 0.46, z), 1.6, "#5d646b");
  k += kiste(X - 0.25, X + 0.25, 0.46, 0.54, z - 0.22, z + 0.24, { vorn: "#22262b", deckel: "#30353b", seite: "#22262b" });
  /* hohe Rückenlehne aus Netzstoff (zum Betrachter hin, hinter dem Tisch) */
  k += poly([P(X - 0.24, 0.62, z - 0.24), P(X + 0.24, 0.62, z - 0.24), P(X + 0.22, 1.18, z - 0.27), P(X - 0.22, 1.18, z - 0.27)], S.lg("netz", [[0, "#3b4148"], [1, "#24282d"]]));
  for (let i = 1; i < 6; i++) k += L(P(X - 0.22, 0.62 + i * 0.09, z - 0.25), P(X + 0.22, 0.62 + i * 0.09, z - 0.25), 0.2, "#4d555c");
  k += L(P(X - 0.26, 0.56, z), P(X - 0.26, 0.74, z - 0.1), 0.9, "#22262b") + L(P(X + 0.26, 0.56, z), P(X + 0.26, 0.74, z - 0.1), 0.9, "#22262b");
  S.teil({ id: "kr_schreibtischstuhl", de: "der Bürostuhl", syl: "BÜ-ro-stuhl", it: "la sedia da ufficio", itSyl: "SE-dia da uf-FI-cio", en: "office chair", x: ax, y: ay, steht: true, kunst: um(ax, ay, k) });
}

/* =====================================================================
   8 — DER SCHREIBTISCH (Lehrerpult) mit Lupe: Kamera, Mikrofon, Kopfhörer
   ===================================================================== */
{
  const { X0, X1, z0, z1, H } = SD;
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  let k = schatten(ax, ay, 28, 1.6, 0.22);
  /* Wange links (sichtbar), Front mit Sichtblende, Platte */
  k += poly([P(X0, 0, z1), P(X0, 0, z0), P(X0, H, z0), P(X0, H, z1)], "#b39062");
  k += poly([P(X0, 0.25, z1 - 0.02), P(X1, 0.25, z1 - 0.02), P(X1, H - 0.03, z1 - 0.02), P(X0, H - 0.03, z1 - 0.02)], S.lg("blende", [[0, "#c9a877"], [1, "#b8955f"]]));
  for (const X of [X0 + 0.02, X1 - 0.02]) k += L(P(X, 0, z1 - 0.02), P(X, 0.25, z1 - 0.02), 1.4, "#b39062");
  k += kiste(X0, X1, H - 0.03, H, z0, z1, { vorn: "#a17d4f", deckel: BUCHE });
  /* Bildschirm wird als eigenes Teil gezeichnet; hier: Tastatur, Becher, Ordner */
  k += poly(blatt(1.42, 0.86, 0.44, 0.15, 0, H + 0.01), "#2b2f33") + poly(blatt(1.42, 0.86, 0.4, 0.11, 0, H + 0.02), "#4a5057");
  const [bx, by] = P(1.98, H, 0.92);
  k += `<path d="M${bx - 1.6} ${by} L${bx - 1.8} ${by - 4} L${bx + 1.8} ${by - 4} L${bx + 1.6} ${by} Z" fill="${VHS}"/><ellipse cx="${bx}" cy="${by - 4}" rx="1.8" ry=".5" fill="#4a2d1a"/>`;
  k += poly(blatt(1.0, 0.95, 0.24, 0.32, 0.1, H + 0.01), "#d64b3b") + poly(blatt(1.0, 0.95, 0.22, 0.3, 0.1, H + 0.02), "#f2efe6");
  const U = [];
  /* Mikrofon (Konferenz-Tischmikrofon) */
  {
    const [mx, my] = P(1.78, H, 0.98);
    k += `<ellipse cx="${mx}" cy="${my}" rx="2.6" ry=".8" fill="#1f2226"/>`;
    k += `<path d="M${mx} ${my - 0.4} Q${mx - 0.4} ${my - 4} ${mx + 1.2} ${my - 6.2}" stroke="#2f3439" stroke-width=".55" fill="none"/>`;
    k += `<ellipse cx="${r(mx + 1.5)}" cy="${r(my - 6.8)}" rx=".9" ry="1.3" fill="#3a4148" transform="rotate(30 ${r(mx + 1.5)} ${r(my - 6.8)})"/><circle cx="${r(mx - 1.2)}" cy="${r(my - 0.2)}" r=".35" fill="#ff4d4d"/>`;
    U.push({ id: "kr_mikrofon", de: "das Mikrofon", syl: "MI-kro-fon", it: "il microfono", itSyl: "mi-CRO-fo-no", en: "microphone", x: mx, y: my + 1, kunst: flaeche(-3.4, -9, 6.8, 9.6),
      tipp: "Über das Mikrofon hören die Teilnehmer zu Hause den Lehrer." });
  }
  /* Kopfhörer (Headset) */
  {
    const [hx, hy] = P(1.2, H, 0.72);
    k += `<path d="M${hx - 3} ${hy - 0.6} Q${hx} ${hy - 4.6} ${hx + 3} ${hy - 0.6}" stroke="#222" stroke-width=".9" fill="none"/>`;
    k += `<ellipse cx="${hx - 3}" cy="${hy - 0.4}" rx="1.5" ry="1" fill="#2f3439"/><ellipse cx="${hx + 3}" cy="${hy - 0.4}" rx="1.5" ry="1" fill="#2f3439"/>`;
    k += `<path d="M${hx - 3} ${hy - 0.4} q1 1.6 3.4 1.4" stroke="#444" stroke-width=".35" fill="none"/>`;
    U.push({ id: "kr_kopfhoerer", de: "der Kopfhörer", syl: "KOPF-hö-rer", it: "le cuffie", itSyl: "CUF-fie", en: "headphones", x: hx, y: hy + 1.2, kunst: flaeche(-5, -6, 10, 6.8) });
  }
  /* Kamera (Webcam) auf dem Bildschirm — gemalt vom Bildschirm, hier nur die Fläche */
  const [cx, cy] = P(1.46, H + 0.5, 0.66);
  U.push({ id: "kr_kamera", de: "die Kamera", syl: "KA-me-ra", it: "la videocamera", itSyl: "vi-de-o-CA-me-ra", en: "camera", x: cx, y: cy, kunst: flaeche(-3.6, -3.4, 7.2, 4.2),
    tipp: "Mit der Kamera können Teilnehmende auch online am Kurs teilnehmen." });
  const [zx, zy] = P(X0, H, z1);
  S.teil({ id: "kr_schreibtisch", de: "der Schreibtisch", syl: "SCHREIB-tisch", it: "la scrivania", itSyl: "scri-va-NI-a", en: "desk", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: r(zx - 4), y: r(zy - 36), w: 66, h: 44 },
    unter: U.map((u) => Object.assign(u, { x: r(u.x), y: r(u.y) })) });
}
{
  /* DER BILDSCHIRM mit Webcam oben drauf */
  const [ax, ay] = P(1.46, SD.H, 0.68);
  const s = sk(0.68) / S0;
  let k = schatten(0, 0, 6, .8, .3);
  k += `<ellipse cx="0" cy="-.5" rx="4.2" ry=".9" fill="#2a2e33"/><rect x="-.8" y="-6" width="1.6" height="5.6" fill="#3a3f45"/>`;
  k += `<rect x="-11" y="-20" width="22" height="14" rx=".8" fill="#1c1f23"/>`;
  k += `<rect x="-10" y="-19" width="20" height="12" fill="${S.lg("bild", [[0, "#2a4f73"], [1, "#16304a"]])}"/>`;
  /* Videokonferenz: vier Kacheln mit Teilnehmenden zu Hause */
  for (let i = 0; i < 4; i++) {
    const x = -9.4 + (i % 2) * 9.6, y = -18.4 + Math.floor(i / 2) * 5.6;
    k += `<rect x="${x}" y="${y}" width="9" height="5.2" fill="${["#6b8fa8", "#a88f6b", "#7aa07a", "#9a7aa8"][i]}"/>`;
    k += `<circle cx="${x + 4.5}" cy="${y + 2.2}" r="1.3" fill="${["#c99a7a", "#8d5a3b", "#e8c4a4", "#b07a55"][i]}"/><path d="M${x + 2} ${y + 5.2} q2.5 -3 5 0 Z" fill="#33414f"/>`;
  }
  k += `<path d="M-10 -19 L-4 -19 L-10 -11 Z" fill="#fff" opacity=".12"/>`;
  /* Webcam */
  k += `<rect x="-3" y="-22.6" width="6" height="2.6" rx="1.2" fill="#202327"/><circle cx="0" cy="-21.3" r=".9" fill="${S.rg("cam", [[0, "#6fb6ff"], [1, "#0b1520"]])}"/><circle cx="2" cy="-21.3" r=".3" fill="#4cd964"/><rect x="-1.8" y="-20.2" width="3.6" height=".8" fill="#202327"/>`;
  S.teil({ oben: true, id: "kr_bildschirm", de: "der Bildschirm", syl: "BILD-schirm", it: "lo schermo", itSyl: "SCHER-mo", en: "screen", x: ax, y: ay, steht: true, kunst: `<g transform="scale(${r(s)})">${k}</g>`,
    tipp: "Auf dem Bildschirm sieht der Lehrer die Teilnehmenden, die online dabei sind." });
}
{
  /* DER PAPIERKORB neben dem Pult */
  const [ax, ay] = P(0.62, 0, 0.98);
  const s = sk(0.98) / S0;
  let k = schatten(0, 0, 4.4, .7, .3);
  k += `<path d="M-3.6 -11 L3.6 -11 L3 0 L-3 0 Z" fill="${S.lg("korb", [[0, "#5d646b"], [0.5, "#3e444a"], [1, "#2e3338"]], 0, 0, 1, 0)}"/><ellipse cx="0" cy="-11" rx="3.6" ry=".9" fill="#22262b"/>`;
  for (let i = 0; i < 6; i++) k += `<line x1="${r(-3.2 + i * 1.3)}" y1="-10" x2="${r(-2.7 + i * 1.1)}" y2="-.6" stroke="#6b737a" stroke-width=".3"/>`;
  k += `<path d="M-1.6 -11.4 q1 -2 2.6 -.6 q.6 1 -.4 1.2 Z" fill="#f4f1ea"/>`;
  S.teil({ id: "papierkorb", de: "der Papierkorb", syl: "pa-PIER-korb", it: "il cestino", itSyl: "ce-STI-no", en: "wastepaper basket", x: ax, y: ay, steht: true, kunst: `<g transform="scale(${r(s)})">${k}</g>` });
}

/* =====================================================================
   9 — DER LEHRER (vorn links an der Tafel, zeigt auf die Tabelle)
   ===================================================================== */
{
  const [ax, ay] = P(-1.72, 0, 0.42);
  const m = B.mensch({ id: "b09c_lehrer", geschlecht: "m", pose: "zeigen", blick: 52, frisur: "kurz", haarfarbe: "grau", haut: "hell", bart: "bart_kurz",
    kleidung: { oberteil: { stueck: "hemd", farbe: "#dbe6f0" }, jacke: { stueck: "weste", farbe: "#55606b" }, unterteil: { stueck: "anzughose", farbe: "#3b3f45" }, schuhe: { stueck: "halbschuh", farbe: "braun" }, zubehoer: { stueck: "brille" } } }, 1.8 * sk(0.42));
  S.teil({ id: "kr_lehrer", de: "der Lehrer", syl: "LEH-rer", it: "l'insegnante", itSyl: "in-se-GNAN-te", en: "teacher", x: ax, y: ay, kunst: m.svg,
    tipp: "Der Lehrer erklärt: „ich lerne, du lernst, er lernt …“" });
}

/* =====================================================================
   10 — DER STUHL und DIE TEILNEHMERIN (rechts an der U-Form)
   ===================================================================== */
const TN = { X: 2.62, z: 1.95 };
{
  const X = TN.X + 0.22, z = TN.z;
  const [ax, ay] = P(X, 0, z);
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: ax, y: ay, steht: true, kunst: um(ax, ay, schatten(ax, ay, 9, 1, 0.22) + stuhlZ(X, z, 1)) });
}
{
  const [ax, ay] = P(TN.X + 0.1, 0, TN.z);
  const m = B.mensch({ id: "b09c_tn", geschlecht: "w", pose: "lesen", blick: -40, frisur: "lang", haarfarbe: "dunkelbraun", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#3d7a5a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 1.64 * sk(TN.z));
  S.teil({ id: "teilnehmerin", de: "die Teilnehmerin", syl: "TEIL-neh-me-rin", it: "la partecipante", itSyl: "par-te-ci-PAN-te", en: "participant", x: ax, y: ay, kunst: m.svg,
    tipp: "Sie lernt im Integrationskurs Deutsch – schon im dritten Modul." });
}

/* =====================================================================
   11 — DER TISCH (rechter Schenkel der U-Form) mit Lupe:
        Kursbuch, Wörterbuch, Arbeitsblatt, Heft, Textmarker
   ===================================================================== */
{
  const X0 = 1.75, X1 = 2.4, z0 = 1.5, z1 = 4.3, H = 0.75;
  const [ax, ay] = P(X0, 0, 2.5);
  let k = "";
  for (const zz of [z0 + 0.05, 2.35, 3.2]) k += L(P(X0 + 0.05, 0, zz), P(X0 + 0.05, H - 0.03, zz), 1.3, "#4d555c");
  k += kiste(X0, X1, H - 0.03, H, z0, z1, { seite: "#a9865a", deckel: BUCHE, vorn: "#b89466" });
  for (const zz of [2.35, 3.2]) k += L(P(X0, H + 0.002, zz), P(X1, H + 0.002, zz), 0.3, "#b89466");
  k += L(P(X0, H, z0), P(X0, H, z1), 0.4, "#fff", ' opacity=".5"');
  const U = [];
  const unter = (id, de, syl, it, itSyl, en, X, z, w, h, tipp) => { const [x, y] = P(X, H, z); const o = { id, de, syl, it, itSyl, en, x, y: y + 1.5, kunst: flaeche(-w / 2, -h, w, h + 1.5) }; if (tipp) o.tipp = tipp; U.push(o); };
  /* Kursbuch (aufgeschlagen, vor der Teilnehmerin) */
  k += poly(blatt(2.1, 1.85, 0.3, 0.42, 0.04, H + 0.012), "#f8f6ef", 'stroke="#c8c2b5" stroke-width=".2"');
  k += L(P(2.1, H + 0.014, 1.65), P(2.1, H + 0.014, 2.05), 0.35, "#a49c8c");
  k += poly(blatt(2.02, 1.78, 0.1, 0.14, 0.04, H + 0.016), "#7fb3d5");
  for (let i = 0; i < 4; i++) k += L(P(2.15, H + 0.016, 1.72 + i * 0.07), P(2.22, H + 0.016, 1.72 + i * 0.07), 0.22, "#888");
  k += poly([P(2.25, H, 1.64), P(2.25, H, 2.06), P(2.27, H + 0.012, 2.06), P(2.27, H + 0.012, 1.64)], "#1f5fa0");
  unter("kr_kursbuch_kr", "das Kursbuch", "KURS-buch", "il libro di corso", "LI-bro di COR-so", "course book", 2.1, 2.06, 9, 7, "Im Kursbuch gibt es Texte, Dialoge und Übungen.");
  /* Wörterbuch (dick, rot-gelb) */
  k += kiste(1.9, 2.18, H, H + 0.06, 2.3, 2.5, { vorn: "#f4f0e2", deckel: "#c8102e", seite: "#f4f0e2" });
  k += poly(blatt(2.04, 2.4, 0.2, 0.06, 0, H + 0.062), "#f2c80f");
  unter("woerterbuch", "das Wörterbuch", "WÖR-ter-buch", "il dizionario", "di-zio-NA-rio", "dictionary", 2.04, 2.5, 10, 8, "Im Wörterbuch steht: der Tisch, die Tische.");
  /* Arbeitsblätter (Stapel) */
  for (let i = 0; i < 3; i++) k += poly(blatt(2.08 + i * 0.01, 2.85 + i * 0.02, 0.21, 0.3, 0.25 - i * 0.12, H + 0.004 + i * 0.002), "#ffffff", 'stroke="#c8c2b5" stroke-width=".2"');
  for (let i = 0; i < 5; i++) k += L(P(2.0, H + 0.01, 2.76 + i * 0.045), P(2.16, H + 0.01, 2.78 + i * 0.045), 0.25, "#8a8a8a");
  unter("arbeitsblatt", "das Arbeitsblatt", "AR-beits-blatt", "la scheda di lavoro", "SCHE-da di la-VO-ro", "worksheet", 2.08, 3.02, 11, 8, "Auf dem Arbeitsblatt übt man die Verben.");
  /* Heft (aufgeschlagen, liniert) */
  k += poly(blatt(2.08, 3.5, 0.3, 0.21, -0.05, H + 0.005), "#f9f8f2", 'stroke="#c8c2b5" stroke-width=".2"');
  k += L(P(2.08, H + 0.01, 3.4), P(2.08, H + 0.01, 3.6), 0.3, "#b0a898");
  for (let i = 0; i < 4; i++) k += L(P(1.96, H + 0.01, 3.42 + i * 0.045), P(2.06, H + 0.01, 3.42 + i * 0.045), 0.2, "#7aa6d0");
  unter("heft", "das Heft", "HEFT", "il quaderno", "qua-DER-no", "exercise book", 2.08, 3.61, 13, 8, null);
  /* Textmarker */
  k += L(P(1.9, H + 0.015, 3.82), P(1.95, H + 0.015, 3.98), 1.6, "#f5e83b") + L(P(1.95, H + 0.016, 3.98), P(1.955, H + 0.016, 4.02), 1.1, "#2b2b2b");
  unter("textmarker", "der Textmarker", "TEXT-mar-ker", "l'evidenziatore", "e-vi-den-zia-TO-re", "highlighter", 1.93, 4.0, 10, 7, "Mit dem Textmarker markiert man neue Wörter.");
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: 224, y: 104, w: 96, h: 64 },
    unter: U.map((u) => Object.assign(u, { x: r(u.x), y: r(u.y) })),
    tipp: "Die Tische stehen in U-Form: So sehen sich alle beim Sprechen." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/kursraum.js"));
console.log(aus);
