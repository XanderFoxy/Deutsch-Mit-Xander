#!/usr/bin/env node
/* =====================================================================
   DAS JOBCENTER (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Jobcenter Dresden und Berlin: Ablauf in der Eingangszone;
   BA-Konzepte „Kundensteuerung“ und „Terminierung im Jobcenter“):
   - In der Eingangszone zieht man eine WARTENUMMER und setzt sich in
     den Wartebereich. Ein BILDSCHIRM zeigt die Nummer und den Platz,
     an den man gehen soll.
   - Es gibt offene Wartebereiche und abgetrennte Plätze für vertrau-
     liche Gespräche (TRENNWAND mit Milchglas).
   - Am Beratungsplatz: Schreibtisch mit Computer, die Beraterin
     (Arbeitsvermittlung/Leistung), ein Stuhl für den Antragsteller.
     Auf dem Tisch: ANTRAG (z. B. auf Bürgergeld), BESCHEID, Unterlagen
     für die Bewerbung (Lebenslauf, Bewerbungsmappe), der Ausweis.
   - Typisch für das Amtsgebäude: Stuhlreihen mit Kunststoffschalen,
     Pinnwand mit Stellenangeboten, Formularständer, Heizkörper unter
     dem Fenster, Aktenordner im Regal, ein Wandkalender mit Terminen.
   BLICK: Fluchtpunkt rechts der Mitte (x = 200), Augenhöhe 1,9 m:
   links die Seitenwand mit dem Wartebereich in Flucht, rechts vorn der
   Beratungsplatz hinter der Trennwand.
   Maßstab: Rückwand 38 Einheiten je Meter, Schreibtisch 60 je Meter
   (Tischhöhe 0,75 m), Sitzhöhe 0,42 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "jobcenter", titel: "Das Jobcenter", emoji: "🗂️", thema: "Arbeit", kuerzel: "b01d", fassung: 852 });
const rnd = zufall(2005);
const r = B.r;

/* ---------- Kamera ---------------------------------------------------- */
const HY = 50, E = 1.9, D = 5.5, S0 = 38, VX = 200;
const sk = (z) => S0 * D / (D - z);
const P = (X, H, z) => [r(VX + X * sk(z)), r(HY + (E - H) * sk(z))];
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((p) => p[0] + " " + p[1]).join(" L")} Z" fill="${fill}"${extra ? " " + extra : ""}/>`;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const bbox = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
function kiste(X0, X1, H0, H1, z0, z1, f) {
  let g = "";
  if (X1 < 0 && f.seite) g += poly([P(X1, H0, z1), P(X1, H0, z0), P(X1, H1, z0), P(X1, H1, z1)], f.seite);
  if (X0 > 0 && f.seite) g += poly([P(X0, H0, z1), P(X0, H0, z0), P(X0, H1, z0), P(X0, H1, z1)], f.seite);
  if (H1 < E && f.deckel) g += poly([P(X0, H1, z1), P(X1, H1, z1), P(X1, H1, z0), P(X0, H1, z0)], f.deckel);
  if (f.vorn) g += poly([P(X0, H0, z1), P(X1, H0, z1), P(X1, H1, z1), P(X0, H1, z1)], f.vorn);
  return g;
}
/* Fläche auf der linken Wand (Ebene X = L) */
const L = -3.68;
const wand = (z0, z1, H0, H1, fill, extra) => poly([P(L, H0, z0), P(L, H0, z1), P(L, H1, z1), P(L, H1, z0)], fill, extra);
/* flach liegendes Blatt auf dem Tisch: Mitte (X, z), Breite, Tiefe, Drehung (rad) */
const HT = 0.75;
function blatt(X, z, w, t, dreh, h = HT + 0.004) {
  const c = Math.cos(dreh), s = Math.sin(dreh);
  return [[-w / 2, -t / 2], [w / 2, -t / 2], [w / 2, t / 2], [-w / 2, t / 2]].map(([a, b]) => P(X + a * c - b * s, h, z + a * s + b * c));
}

/* ---------- Grundfarben ---------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const PETROL = "#00697a", ORANGE = "#e8772e";
const WAND = S.lg("wand", [[0, "#f1eee6"], [1, "#e2ddd1"]]);
const LWAND = S.lg("lwand", [[0, "#ddd8cb"], [1, "#e8e4da"]], 0, 0, 1, 0);
const BUCHE = S.lg("buche", [[0, "#e2cba2"], [1, "#d3b88a"]]);
const GRAU = S.lg("grau", [[0, "#9aa3ab"], [1, "#7c858d"]], 0, 0, 1, 0);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Rasterdecke mit Leuchten, Rückwand, linke Wand, Linoleum
   ===================================================================== */
const WU = P(0, 0, 0)[1], WO = P(0, 2.9, 0)[1];
const [CX] = P(L, 0, 0);
const ZL = (VX - 0) / (-L) ;                      // s am linken Bildrand
const zRand = D * (1 - S0 / ZL);
{
  let k = `<rect x="0" y="0" width="320" height="${WO}" fill="${S.lg("decke", [[0, "#e6e4de"], [1, "#f3f2ee"]])}"/>`;
  for (let i = -6; i <= 6; i++) { const X = i * 0.625, a = P(X, 2.9, 0), b = P(X, 2.9, 2.0); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#d2d0c9" stroke-width=".3"/>`; }
  for (const z of [0.625, 1.25, 1.875]) { const a = P(-6, 2.9, z), b = P(4, 2.9, z); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#d2d0c9" stroke-width=".3"/>`; }
  for (const [X, z] of [[-1.875, 0.625], [0.625, 0.625], [-1.875, 1.25], [0.625, 1.25]]) k += poly([P(X, 2.9, z + 0.625), P(X + 1.25, 2.9, z + 0.625), P(X + 1.25, 2.9, z), P(X, 2.9, z)], "#fffef8", 'stroke="#dcdad2" stroke-width=".4"');
  /* Linoleum, blaugrau gesprenkelt, mit Bahnenstößen */
  k += `<rect x="0" y="${WU}" width="320" height="${r(200 - WU)}" fill="${S.lg("boden", [[0, "#97a2ab"], [1, "#84909a"]])}"/>`;
  for (let i = 0; i < 240; i++) k += `<circle cx="${r(rnd() * 320)}" cy="${r(WU + rnd() * (200 - WU))}" r="${r(0.2 + rnd() * 0.35)}" fill="${rnd() < 0.5 ? "#b9c2c9" : "#6c7882"}" opacity=".55"/>`;
  for (let i = -4; i <= 3; i++) { const X = i * 2, a = P(X, 0, 0), b = P(X, 0, 2.9); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#76828c" stroke-width=".35"/>`; }
  k += `<rect x="0" y="${WU}" width="320" height="${r(200 - WU)}" fill="${S.lg("bodenlicht", [[0, "#000", 0.14], [0.5, "#000", 0], [1, "#fff", 0.06]])}"/>`;
  /* Rückwand mit Petrol-Band und Sockelleiste */
  k += `<rect x="${CX}" y="${WO}" width="${r(320 - CX)}" height="${r(WU - WO)}" fill="${WAND}"/>`;
  const [, bo] = P(0, 2.25, 0), [, bu] = P(0, 2.15, 0);
  k += `<rect x="${CX}" y="${bo}" width="${r(320 - CX)}" height="${r(bu - bo)}" fill="${PETROL}"/>`;
  k += `<rect x="${CX}" y="${r(WU - 2.4)}" width="${r(320 - CX)}" height="2.4" fill="#5d666e"/>`;
  /* linke Wand */
  k += poly([P(L, 2.9, 0), P(L, 2.9, zRand + 0.05), P(L, 0, zRand + 0.05), P(L, 0, 0)], LWAND);
  k += wand(0, zRand + 0.05, 2.15, 2.25, PETROL);
  k += wand(0, zRand + 0.05, 0, 0.09, "#5d666e");
  S.hinten(k);
}

/* =====================================================================
   1 — DAS SCHILD „Jobcenter · Wartebereich“ (Rückwand links)
   ===================================================================== */
{
  let k = `<rect x="-30" y="-7" width="60" height="14" rx="1" fill="#fff" stroke="#c9c5bb" stroke-width=".4"/>`;
  k += `<rect x="-30" y="-7" width="5" height="14" rx="1" fill="${ORANGE}"/>`;
  k += `<text x="2" y="-.6" font-size="5.4" text-anchor="middle" fill="${PETROL}" font-family="Arial,Helvetica,sans-serif" font-weight="bold">Jobcenter</text>`;
  k += `<text x="2" y="4.6" font-size="2.6" text-anchor="middle" fill="#555" font-family="Arial">Eingangszone · Wartebereich</text>`;
  S.teil({ id: "schild", de: "das Schild", syl: "SCHILD", it: "l'insegna", itSyl: "in-SE-gna", en: "sign", x: 104, y: 32, kunst: k });
}

/* =====================================================================
   2 — DIE NUMMERNANZEIGE an der linken Wand (Bildschirm)
   ===================================================================== */
{
  const z0 = 0.45, z1 = 1.25;
  const [ax, ay] = P(L, 1.75, z1);
  let k = wand(z0 - 0.03, z1 + 0.03, 1.73, 2.12, "#1c1f23");
  k += wand(z0, z1, 1.76, 2.09, S.lg("anzeige", [[0, "#0f2a3a"], [1, "#0a1c27"]]));
  k += wand(z0, z1, 2.02, 2.09, PETROL);
  /* Zeilen: Nummer → Platz (auf der Wandebene, verzerrt) */
  const zeile = (H, a, b, f) => {
    const p0 = P(L, H, z1 - 0.05), p1 = P(L, H, z0 + 0.05), ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 180 / Math.PI, w = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    const gs = r(2.4 * sk((z0 + z1) / 2) / S0);
    return `<g transform="translate(${p0[0]} ${p0[1]}) skewY(${r(ang)})"><text x="0" y="0" font-size="${gs}" fill="${f}" font-family="monospace" font-weight="bold">${a}</text><text x="${r(w)}" y="0" font-size="${gs}" text-anchor="end" fill="${f}" font-family="monospace" font-weight="bold">${b}</text></g>`;
  };
  const [t0, t1] = [P(L, 2.035, z1 - 0.05), P(L, 2.035, z0 + 0.05)];
  k += `<g transform="translate(${t0[0]} ${t0[1]}) skewY(${r(Math.atan2(t1[1] - t0[1], t1[0] - t0[0]) * 180 / Math.PI)})"><text x="0" y="0" font-size="${r(1.8 * sk(0.85) / S0)}" fill="#fff" font-family="Arial" font-weight="bold">Nummer → Platz</text></g>`;
  k += zeile(1.94, "A 052", "3", "#ffd54a");
  k += zeile(1.86, "B 017", "7", "#e9f2f5");
  k += zeile(1.78, "A 049", "1", "#e9f2f5");
  S.teil({ id: "nummernanzeige", de: "die Nummernanzeige", syl: "NUM-mern-an-zei-ge", it: "il display dei numeri", itSyl: "di-SPLAY dei NU-me-ri", en: "number display", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Auf der Nummernanzeige erscheint die Wartenummer und der Platz, an den man gehen soll." });
}

/* =====================================================================
   3 — DIE PINNWAND mit Stellenangeboten, 4 — DAS FORMULAR (Ständer)
   ===================================================================== */
{
  const [x0, y0] = P(-3.45, 1.85, 0), [x1, y1] = P(-2.7, 0.95, 0);
  const w = x1 - x0, h = y1 - y0;
  let k = `<rect x="0" y="0" width="${r(w)}" height="${r(h)}" fill="#7d6a52"/><rect x="1" y="1" width="${r(w - 2)}" height="${r(h - 2)}" fill="${S.lg("kork", [[0, "#c9a46e"], [1, "#b88f59"]])}"/>`;
  for (let i = 0; i < 40; i++) k += `<circle cx="${r(1.5 + rnd() * (w - 3))}" cy="${r(1.5 + rnd() * (h - 3))}" r=".25" fill="#8f6c40" opacity=".6"/>`;
  k += `<text x="${r(w / 2)}" y="4" font-size="2.2" text-anchor="middle" fill="#3a2a18" font-family="Arial" font-weight="bold">Stellenangebote</text>`;
  const zettel = [[2.4, 6, 8, 9, "#fff"], [11.4, 5.4, 8, 10, "#fffbd0"], [20, 6.4, 7.6, 9, "#e8f4ff"], [3, 17, 7.6, 9, "#fff"], [12, 17.4, 8, 8.6, "#fff"], [20.4, 16.6, 7.4, 9.4, "#ffe8e0"]];
  zettel.forEach(([x, y, zw, zh, f], i) => {
    if (x + zw > w - 1 || y + zh > h - 1) return;
    k += `<rect x="${x}" y="${y}" width="${zw}" height="${zh}" fill="${f}" transform="rotate(${(i % 3) - 1} ${x + zw / 2} ${y})"/>`;
    k += `<rect x="${r(x + 1)}" y="${r(y + 1.4)}" width="${r(zw - 2)}" height=".9" fill="${[PETROL, ORANGE, "#2f6db5"][i % 3]}"/>`;
    for (let j = 0; j < 3; j++) k += `<rect x="${r(x + 1)}" y="${r(y + 3.4 + j * 1.4)}" width="${r(zw - 2 - j)}" height=".35" fill="#888"/>`;
    k += `<circle cx="${r(x + zw / 2)}" cy="${r(y + 0.4)}" r=".6" fill="${["#d23b30", "#2f6db5", "#3ca35a"][i % 3]}"/>`;
  });
  S.teil({ id: "pinnwand", de: "die Pinnwand", syl: "PINN-wand", it: "la bacheca", itSyl: "ba-CHE-ca", en: "notice board", x: x0 + w / 2, y: y1, kunst: um(w / 2, h, k),
    tipp: "An der Pinnwand hängen Stellenangebote aus der Region." });
}
{
  const [x0, y0] = P(-2.55, 1.6, 0), [x1, y1] = P(-2.12, 0.85, 0);
  const w = x1 - x0, h = y1 - y0;
  let k = `<rect x="0" y="0" width="${r(w)}" height="${r(h)}" rx=".6" fill="#d9dde0" stroke="#9aa2a8" stroke-width=".3"/>`;
  const farben = ["#fff", "#fff6c9", "#e2f0f4", "#fde3d6"];
  for (let i = 0; i < 4; i++) {
    const y = 1.6 + i * (h - 2) / 4;
    k += `<rect x="1.4" y="${r(y - 1.4)}" width="${r(w - 2.8)}" height="${r((h - 2) / 4)}" fill="${farben[i]}" stroke="#ccc" stroke-width=".2"/>`;
    k += `<rect x="2" y="${r(y - 0.6)}" width="${r(w - 6)}" height=".6" fill="${PETROL}"/>`;
    k += `<rect x=".8" y="${r(y + 1.2)}" width="${r(w - 1.6)}" height="${r((h - 2) / 4 - 2.2)}" fill="#eef3f5" opacity=".7" stroke="#aebfc6" stroke-width=".2"/>`;
  }
  S.teil({ id: "formular", de: "das Formular", syl: "for-mu-LAR", it: "il modulo", itSyl: "MO-du-lo", en: "form", x: x0 + w / 2, y: y1, kunst: um(w / 2, h, k),
    tipp: "Hier liegen Formulare, zum Beispiel für eine Veränderungsmitteilung." });
}

/* =====================================================================
   5 — DIE STUHLREIHE an der linken Wand (orange Sitzschalen)
   ===================================================================== */
{
  const z0 = 0.3, z1 = 1.62, n = 4, d = (z1 - z0) / n;
  const [ax, ay] = P(L + 0.3, 0, z1);
  let k = "";
  /* Traverse und Füße */
  k += kiste(L + 0.1, L + 0.48, 0.34, 0.38, z0, z1, { seite: "#4a4f55", deckel: "#5a6068", vorn: "#3a3f45" });
  for (const z of [z0 + 0.08, z1 - 0.08]) { k += kiste(L + 0.25, L + 0.3, 0, 0.34, z - 0.03, z, { seite: "#3a3f45", vorn: "#2c3035" }); const [fx, fy] = P(L + 0.28, 0, z); k += `<ellipse cx="${fx}" cy="${fy}" rx="3" ry=".8" fill="#2c3035"/>`; }
  for (let i = 0; i < n; i++) {
    const za = z0 + i * d + 0.03, zb = za + d - 0.06;
    /* Lehne (an der Wand) und Sitzschale */
    k += kiste(L + 0.06, L + 0.12, 0.42, 0.88, za + 0.02, zb - 0.02, { seite: S.lg("lehne", [[0, "#f08a3c"], [1, "#d76a1e"]]), deckel: "#f39a52", vorn: "#c8601a" });
    k += kiste(L + 0.1, L + 0.52, 0.38, 0.44, za, zb, { seite: "#c8601a", deckel: S.lg("schale", [[0, "#f5a362"], [1, "#e57a2a"]]), vorn: "#b9581a" });
  }
  k = um(-ax, -ay, schatten(0, 0, 18, 1.4, 0.25)) + k;
  S.teil({ id: "stuhlreihe", de: "die Stuhlreihe", syl: "STUHL-rei-he", it: "la fila di sedie", itSyl: "FI-la di SE-die", en: "row of chairs", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Im Wartebereich wartet man, bis die eigene Nummer aufgerufen wird." });
}

/* =====================================================================
   RÜCKWAND rechts: Fenster mit Jalousie, Heizkörper, Regal, Kalender
   ===================================================================== */
{
  const [x0, y0] = P(0.55, 2.3, 0), [x1, y1] = P(2.15, 0.95, 0);
  const w = x1 - x0, h = y1 - y0;
  let k = `<rect x="-1.4" y="-1.4" width="${r(w + 2.8)}" height="${r(h + 2.8)}" fill="#f7f7f5"/><rect x="0" y="0" width="${r(w)}" height="${r(h)}" fill="${S.lg("himmel", [[0, "#a9cbe4"], [1, "#dfeaf0"]])}"/>`;
  k += `<rect x="0" y="${r(h * 0.55)}" width="${r(w)}" height="${r(h * 0.45)}" fill="#b8c3a4"/><rect x="4" y="${r(h * 0.4)}" width="14" height="${r(h * 0.25)}" fill="#c9b79a"/><rect x="${r(w - 22)}" y="${r(h * 0.32)}" width="16" height="${r(h * 0.33)}" fill="#d6cdbd"/>`;
  /* Jalousie halb heruntergelassen */
  const jh = h * 0.42;
  for (let y = 0; y < jh; y += 1.6) k += `<rect x="0" y="${r(y)}" width="${r(w)}" height="1.2" fill="#e9ebec"/><rect x="0" y="${r(y + 1.1)}" width="${r(w)}" height=".3" fill="#b9bfc4"/>`;
  k += `<rect x="0" y="-1.6" width="${r(w)}" height="2" fill="#d6d9dc"/><line x1="${r(w * 0.8)}" y1="0" x2="${r(w * 0.8)}" y2="${r(jh + 6)}" stroke="#bbb" stroke-width=".25"/>`;
  k += `<line x1="${r(w / 2)}" y1="0" x2="${r(w / 2)}" y2="${r(h)}" stroke="#f7f7f5" stroke-width="1.4"/><rect x="${r(w / 2 + 2)}" y="${r(h / 2)}" width="1" height="4" fill="#ccc"/>`;
  k += `<rect x="-1.6" y="${r(h + 1)}" width="${r(w + 3.2)}" height="1.8" fill="#e4e2dc"/>`;
  S.teil({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: x0 + w / 2, y: y1, kunst: um(w / 2, h, k) });
}
{
  const [x0, y0] = P(0.75, 0.75, 0), [x1, y1] = P(1.95, 0.18, 0);
  const w = x1 - x0, h = y1 - y0;
  let k = `<rect x="0" y="0" width="${r(w)}" height="${r(h)}" rx=".8" fill="${S.lg("heizung", [[0, "#f7f7f4"], [1, "#dcdcd6"]])}"/>`;
  for (let x = 1.6; x < w - 1; x += 1.6) k += `<rect x="${r(x)}" y="1" width=".7" height="${r(h - 2)}" fill="#c9c9c2"/>`;
  k += `<rect x="${r(w + 0.4)}" y="2" width="2" height="2.6" rx=".6" fill="#e9e9e4" stroke="#bbb" stroke-width=".25"/><rect x="${r(w + 1)}" y="${r(h)}" width="1" height="4" fill="#ccc"/>`;
  S.teil({ id: "heizkoerper", de: "der Heizkörper", syl: "HEIZ-kör-per", it: "il termosifone", itSyl: "ter-mo-SI-fo-ne", en: "radiator", x: x0 + w / 2, y: y1, kunst: um(w / 2, h, k) });
}
{
  /* Wandkalender mit dem markierten TERMIN */
  const [x0, y0] = P(2.35, 1.95, 0), [x1, y1] = P(3.0, 1.1, 0);
  const w = x1 - x0, h = y1 - y0;
  let k = `<rect x="0" y="0" width="${r(w)}" height="${r(h)}" fill="#fff" stroke="#bbb" stroke-width=".3"/><rect x="0" y="0" width="${r(w)}" height="9" fill="${S.lg("kalbild", [[0, "#5d8fb3"], [1, "#9cc0a0"]])}"/>`;
  k += `<rect x="0" y="9" width="${r(w)}" height="3" fill="${PETROL}"/><text x="${r(w / 2)}" y="11.3" font-size="2.2" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">OKTOBER</text>`;
  const zw = (w - 2) / 7;
  for (let i = 0; i < 28; i++) {
    const cx = 1 + (i % 7) * zw + zw / 2, cy = 14.6 + Math.floor(i / 7) * 3.2;
    k += `<text x="${r(cx)}" y="${r(cy)}" font-size="1.7" text-anchor="middle" fill="${i % 7 > 4 ? "#c8102e" : "#333"}" font-family="Arial">${i + 1}</text>`;
    if (i === 13) k += `<circle cx="${r(cx)}" cy="${r(cy - 0.6)}" r="1.5" fill="none" stroke="#d23b30" stroke-width=".45"/>`;
  }
  k += `<rect x="1" y="${r(h - 4)}" width="${r(w - 2)}" height="3.2" fill="#fff4b0"/><text x="${r(w / 2)}" y="${r(h - 1.7)}" font-size="1.8" text-anchor="middle" fill="#333" font-family="Arial">14.: Termin 10:30</text>`;
  S.teil({ id: "termin", de: "der Termin", syl: "ter-MIN", it: "l'appuntamento", itSyl: "ap-pun-ta-MEN-to", en: "appointment", x: x0 + w / 2, y: y1, kunst: um(w / 2, h, k),
    tipp: "Zum Termin im Jobcenter muss man pünktlich kommen – sonst kann es Kürzungen geben." });
}
{
  /* Aktenregal hinter dem Beratungsplatz (links) */
  const X0 = -1.05, X1 = 0.3, z0 = 0.02, z1 = 0.4;
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  let k = kiste(X0, X1, 0, 1.85, z0, z1, { vorn: "#b9bfc4", deckel: "#d4d8dc", seite: "#a2a9af" });
  k += poly([P(X0 + 0.03, 0.05, z1), P(X1 - 0.03, 0.05, z1), P(X1 - 0.03, 1.82, z1), P(X0 + 0.03, 1.82, z1)], "#6f777e");
  const farben = ["#2f6db5", "#c8102e", "#3d9a5b", "#f2a900", PETROL, "#7b4fa3", "#555"];
  for (const hb of [0.08, 0.5, 0.92, 1.34]) {
    k += kiste(X0 + 0.02, X1 - 0.02, hb - 0.02, hb, z0, z1, { vorn: "#cfd4d8", deckel: "#e4e7ea" });
    let X = X0 + 0.05;
    let i = Math.floor(hb * 10);
    while (X < X1 - 0.12) {
      const b = 0.075, hh = 0.32 + (i % 2) * 0.02, f = farben[i % farben.length];
      if (i % 9 === 4) { X += 0.08; i++; continue; }
      k += poly([P(X, hb, z1 - 0.03), P(X + b, hb, z1 - 0.03), P(X + b, hb + hh, z1 - 0.03), P(X, hb + hh, z1 - 0.03)], f, 'stroke="#222" stroke-width=".15"');
      const c = P(X + b / 2, hb + hh * 0.3, z1 - 0.03), e = P(X + b * 0.2, hb + hh * 0.8, z1 - 0.03);
      k += `<circle cx="${c[0]}" cy="${c[1]}" r=".75" fill="#fff" opacity=".85"/><rect x="${e[0]}" y="${e[1]}" width="${r(b * sk(z1) * 0.6)}" height="2.4" fill="#fff" opacity=".85"/>`;
      X += b + 0.006; i++;
    }
  }
  S.teil({ id: "aktenordner", de: "der Aktenordner", syl: "AK-ten-ord-ner", it: "il raccoglitore", itSyl: "rac-co-gli-TO-re", en: "ring binder", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "In den Aktenordnern liegen die Unterlagen – jeder Fall hat eine Akte." });
}

/* =====================================================================
   6 — DIE BERATERIN (sitzt hinter dem Schreibtisch, mit Bürostuhl)
   ===================================================================== */
{
  const z = 0.82, X = 0.95;
  const [bx, by] = P(X, 0, z);
  /* Bürostuhl (Lehne hinter ihr) */
  let st = kiste(X - 0.25, X + 0.25, 0.55, 1.12, z - 0.3, z - 0.24, { vorn: "#2d3035", deckel: "#3d4147" });
  const [px, py] = P(X, 0.04, z - 0.1);
  st += `<ellipse cx="${px}" cy="${py}" rx="10" ry="1.6" fill="#2a2a2a"/>`;
  const m = B.mensch({ id: "b01d_berat", geschlecht: "w", pose: "sitzen", blick: 12, frisur: "dutt", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#d8e6ee" }, jacke: { stueck: "jacke", farbe: "#3d4a5c" }, unterteil: { stueck: "hose", farbe: "#2f3035" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "brille" } } }, 1.68 * sk(z));
  S.teil({ id: "beraterin", de: "die Beraterin", syl: "be-RA-te-rin", it: "la consulente", itSyl: "con-su-LEN-te", en: "adviser", x: bx, y: by, kunst: um(bx, by, st) + m.svg,
    tipp: "Die Beraterin hilft bei der Arbeitssuche und prüft die Anträge." });
}

/* =====================================================================
   7 — DER STUHL und DER ANTRAGSTELLER (sitzt links am Tisch)
   ===================================================================== */
const AS = { X: -0.62, z: 1.72 };
{
  const { X, z } = AS;
  const [ax, ay] = P(X, 0, z);
  let k = "";
  /* vier Beine, Sitz, Lehne (links, hinter seinem Rücken) */
  for (const [dx, dz] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) { const a = P(X + dx, 0, z + dz), b = P(X + dx, 0.42, z + dz); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#3a3f45" stroke-width="1.1"/>`; }
  k += kiste(X - 0.23, X + 0.23, 0.39, 0.43, z - 0.23, z + 0.23, { vorn: "#2c3035", deckel: S.lg("sitz", [[0, "#5d6f86"], [1, "#4a5a70"]]) });
  k += kiste(X - 0.27, X - 0.22, 0.43, 0.92, z - 0.2, z + 0.2, { seite: S.lg("lehne2", [[0, "#5d6f86"], [1, "#46566b"]]), deckel: "#6c7f97", vorn: "#3e4c5f" });
  for (const dz of [-0.18, 0.18]) { const a = P(X - 0.245, 0.43, z + dz), b = P(X - 0.245, 0.62, z + dz); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#3a3f45" stroke-width=".9"/>`; }
  k = um(-ax, -ay, schatten(0, 0, 13, 1.4, 0.28)) + k;
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: ax, y: ay, steht: true, kunst: um(ax, ay, k) });
}
{
  const { X, z } = AS;
  const [ax, ay] = P(X + 0.02, 0, z);
  const m = B.mensch({ id: "b01d_antrag", geschlecht: "m", pose: "sitzen", blick: 78, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "oliv",
    kleidung: { oberteil: { stueck: "hemd", farbe: "#e9e4d6" }, jacke: { stueck: "jacke", farbe: "#3a4a3a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.78 * sk(z));
  S.teil({ id: "antragsteller", de: "der Antragsteller", syl: "AN-trag-stel-ler", it: "il richiedente", itSyl: "ri-chie-DEN-te", en: "applicant", x: ax, y: ay, kunst: m.svg,
    tipp: "Der Antragsteller sagt: „Ich habe heute einen Termin um 10:30 Uhr.“" });
}

/* =====================================================================
   8 — DIE TRENNWAND (Milchglas oben) zwischen Wartebereich und Platz
   ===================================================================== */
{
  const X = -1.25, z0 = 0.35, z1 = 2.25;
  const [ax, ay] = P(X, 0, z1);
  let k = poly([P(X, 0, z1), P(X, 0, z0), P(X, 1.0, z0), P(X, 1.0, z1)], S.lg("trenn", [[0, "#c5ccd2"], [1, "#a9b2ba"]], 0, 0, 1, 0));
  k += poly([P(X, 1.0, z1), P(X, 1.0, z0), P(X, 1.6, z0), P(X, 1.6, z1)], "#eef4f6", 'opacity=".72"');
  k += poly([P(X, 1.22, z1), P(X, 1.22, z0), P(X, 1.36, z0), P(X, 1.36, z1)], "#fff", 'opacity=".5"');
  for (const H of [0, 1.0, 1.6]) { const a = P(X, H, z0), b = P(X, H, z1); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#7d868d" stroke-width="${H === 1.6 ? 1.2 : 0.8}"/>`; }
  for (const z of [z0, (z0 + z1) / 2, z1]) { const a = P(X, 0, z), b = P(X, 1.6, z); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#7d868d" stroke-width="1"/>`; }
  /* Schild „Platz 3“ oben auf der Trennwand */
  const [sx, sy] = P(X, 1.6, z1 - 0.15);
  k += `<rect x="${r(sx - 1)}" y="${r(sy - 8)}" width="12" height="7" rx=".8" fill="${PETROL}"/><text x="${r(sx + 5)}" y="${r(sy - 2.6)}" font-size="5" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">3</text><text x="${r(sx + 5)}" y="${r(sy - 6.2)}" font-size="1.5" text-anchor="middle" fill="#fff" font-family="Arial">PLATZ</text>`;
  S.teil({ id: "trennwand", de: "die Trennwand", syl: "TRENN-wand", it: "la parete divisoria", itSyl: "pa-RE-te di-vi-SO-ria", en: "partition", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Die Trennwand schützt die Privatsphäre: Andere sollen nicht mithören." });
}

/* =====================================================================
   9 — DER SCHREIBTISCH (Lupe: die Unterlagen auf dem Tisch)
   ===================================================================== */
const TI = { X0: -0.22, X1: 1.65, z0: 1.2, z1: 2.0 };
{
  const { X0, X1, z0, z1 } = TI;
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  let k = poly([P(X0 - 0.05, 0, z1 + 0.1), P(X1 + 0.05, 0, z1 + 0.1), P(X1, 0, z1), P(X0, 0, z1)], "#1b120a", 'opacity=".2" filter="url(#bw_weich)"');
  /* Wange links, Sichtblende vorne (Metall), Platte Buche */
  k += kiste(X0 + 0.02, X0 + 0.06, 0, HT - 0.03, z0 + 0.05, z1 - 0.05, { vorn: "#7c858d" });
  k += kiste(X0 + 0.05, X1 - 0.05, 0.28, HT - 0.03, z1 - 0.07, z1 - 0.05, { vorn: GRAU });
  for (const X of [X0 + 0.04, X1 - 0.06]) k += kiste(X, X + 0.04, 0, 0.3, z1 - 0.09, z1 - 0.05, { vorn: "#5d666e" });
  k += kiste(X0, X1, HT - 0.03, HT, z0, z1, { vorn: "#c4a676", deckel: BUCHE, seite: "#b3956a" });
  /* Unterlagen (die Lupe macht sie einzeln anwählbar) */
  const U = [];
  const papier = (pts, f = "#fbfbf8") => poly(pts, f, 'stroke="#cfccc4" stroke-width=".18"');
  const linien = (q, n, f = "#9a9a9a", ab = 0.2) => { let g = ""; for (let i = 0; i < n; i++) { const t = ab + i * (0.75 - ab) / n, a = [q[0][0] + (q[3][0] - q[0][0]) * t, q[0][1] + (q[3][1] - q[0][1]) * t], b = [q[1][0] + (q[2][0] - q[1][0]) * t, q[1][1] + (q[2][1] - q[1][1]) * t]; g += `<line x1="${r(a[0] + (b[0] - a[0]) * 0.1)}" y1="${r(a[1])}" x2="${r(b[0] - (b[0] - a[0]) * 0.15)}" y2="${r(b[1])}" stroke="${f}" stroke-width=".22"/>`; } return g; };
  /* Bewerbungsmappe (blau) mit Lebenslauf darauf */
  const mappe = blatt(-0.02, 1.8, 0.3, 0.24, 0.12);
  k += poly(mappe, S.lg("mappe", [[0, "#2f6db5"], [1, "#1f4f8a"]]));
  const lebl = blatt(0.06, 1.74, 0.21, 0.28, -0.08, HT + 0.012);
  k += papier(lebl) + linien(lebl, 6);
  const fp = P(0.12, HT + 0.012, 1.66);
  k += `<rect x="${r(fp[0])}" y="${r(fp[1] - 1.6)}" width="2" height="1.8" fill="#c9b49a"/><circle cx="${r(fp[0] + 1)}" cy="${r(fp[1] - 1)}" r=".55" fill="#7a5a44"/>`;
  U.push(["bewerbung", mappe, "die Bewerbung", "be-WER-bung", "la candidatura", "can-di-da-TU-ra", "job application", "In die Bewerbungsmappe gehören Anschreiben, Lebenslauf und Zeugnisse."]);
  U.push(["lebenslauf", lebl, "der Lebenslauf", "LE-bens-lauf", "il curriculum", "cur-RI-cu-lum", "CV", "Im Lebenslauf stehen Schule, Ausbildung und Berufserfahrung."]);
  /* Antrag (Formular mit Kästchen) */
  const antr = blatt(0.42, 1.76, 0.21, 0.29, 0.05);
  k += papier(antr) + linien(antr, 5, "#7aa4b0", 0.28);
  const ak = P(0.34, HT + 0.006, 1.66);
  k += `<rect x="${ak[0]}" y="${r(ak[1] - 1)}" width="5" height="1.1" fill="${PETROL}"/>`;
  U.push(["antrag", antr, "der Antrag", "AN-trag", "la domanda", "do-MAN-da", "application form", "Den Antrag auf Bürgergeld stellt man beim Jobcenter."]);
  /* Kugelschreiber auf dem Antrag */
  const k0 = P(0.36, HT + 0.02, 1.86), k1 = P(0.58, HT + 0.02, 1.8);
  k += `<line x1="${k0[0]}" y1="${k0[1]}" x2="${k1[0]}" y2="${k1[1]}" stroke="#1f3f8a" stroke-width="1" stroke-linecap="round"/><circle cx="${k1[0]}" cy="${k1[1]}" r=".35" fill="#ccc"/>`;
  U.push(["stift", [[k0[0] - 1.6, k0[1] + 1.6], [k1[0] + 1.6, k1[1] - 1.6]], "der Kugelschreiber", "KU-gel-schrei-ber", "la penna", "PEN-na", "pen", null]);
  /* Bescheid (Brief mit Kopf) */
  const besch = blatt(0.8, 1.64, 0.21, 0.29, -0.14);
  k += papier(besch) + linien(besch, 6, "#8a8a8a", 0.34);
  const bk = P(0.73, HT + 0.006, 1.53);
  k += `<rect x="${bk[0]}" y="${r(bk[1] - 0.9)}" width="4.6" height="1" fill="${ORANGE}"/>`;
  U.push(["bescheid", besch, "der Bescheid", "be-SCHEID", "la decisione", "de-ci-SIO-ne", "official decision", "Im Bescheid steht, wie viel Geld man bekommt – und für wie lange."]);
  /* Ausweis und Wartenummer (vorne) */
  const ausw = blatt(-0.1, 1.94, 0.12, 0.08, 0.2, HT + 0.006);
  k += poly(ausw, S.lg("ausweis", [[0, "#dbe9f3"], [1, "#b9d0de"]]), 'stroke="#8aa3b3" stroke-width=".2"');
  const ap = P(-0.14, HT + 0.006, 1.95);
  k += `<rect x="${r(ap[0] - 0.4)}" y="${r(ap[1] - 1.4)}" width="1.6" height="1.4" fill="#a88b74"/>`;
  U.push(["ausweis", ausw, "der Ausweis", "AUS-weis", "la carta d'identità", "CAR-ta d'i-den-ti-TÀ", "identity card", "Zum Termin bringt man immer den Ausweis mit."]);
  const ticket = blatt(1.0, 1.9, 0.07, 0.1, 0.3, HT + 0.006);
  k += poly(ticket, "#fffdf0", 'stroke="#c9c09a" stroke-width=".2"');
  const tp = P(1.0, HT + 0.006, 1.9);
  k += `<text x="${tp[0]}" y="${r(tp[1] + 0.5)}" font-size="1.4" text-anchor="middle" fill="#111" font-family="monospace" font-weight="bold">A052</text>`;
  U.push(["wartenummer", ticket, "die Wartenummer", "WAR-te-num-mer", "il numero d'attesa", "NU-me-ro d'at-TE-sa", "queue number", "Die Wartenummer zieht man am Eingang aus dem Automaten."]);
  const unter = U.map(([id, q, de, syl, it, itSyl, en, tipp]) => {
    const [x0, y0, x1, y1] = bbox(q), w = Math.max(x1 - x0, 4.6), h = Math.max(y1 - y0, 3.6);
    const o = { id, de, syl, it, itSyl, en, x: ax, y: ay, kunst: flaeche((x0 + x1) / 2 - w / 2 - ax, (y0 + y1) / 2 - h / 2 - ay, w, h) };
    if (tipp) o.tipp = tipp;
    return o;
  });
  S.teil({ id: "schreibtisch", de: "der Schreibtisch", syl: "SCHREIB-tisch", it: "la scrivania", itSyl: "scri-va-NI-a", en: "desk", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: 180, y: 96, w: 66, h: 44 }, unter,
    tipp: "Auf dem Schreibtisch liegen die Unterlagen für das Gespräch." });
}
{
  /* DER COMPUTER — Bildschirm schräg zur Beraterin, Tastatur, Maus */
  const [cx, cy] = P(1.35, HT, 1.45);
  let k = schatten(0, 0, 9, 1, .25);
  k += `<path d="M-3.4 0 L3.4 0 L2.6 -1.2 L-2.6 -1.2 Z" fill="#3a3d42"/><rect x="-.9" y="-5" width="1.8" height="4" fill="#4a4e54"/>`;
  k += `<path d="M-11 -18.6 L7.6 -16.4 L7.6 -4.6 L-11 -5.2 Z" fill="#1f2226"/><path d="M-10 -17.6 L6.6 -15.6 L6.6 -5.6 L-10 -6 Z" fill="${S.lg("bild", [[0, "#e9f2f5"], [1, "#c9dde4"]])}"/>`;
  k += `<path d="M-10 -17.6 L6.6 -15.6 L6.6 -14 L-10 -15.8 Z" fill="${PETROL}"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M-8.6 ${r(-13.4 + i * 1.8)} L${r(2 - i)} ${r(-12.4 + i * 1.8)}" stroke="#7a8a94" stroke-width=".45"/>`;
  k += `<path d="M7.6 -16.4 L9 -16 L9 -4.8 L7.6 -4.6 Z" fill="#3a3d42"/>`;
  const [tx, ty] = P(1.05, HT, 1.5);
  k += `<path d="M${r(tx - cx - 6)} ${r(ty - cy)} L${r(tx - cx + 6)} ${r(ty - cy - 0.4)} L${r(tx - cx + 5)} ${r(ty - cy - 2.4)} L${r(tx - cx - 6.4)} ${r(ty - cy - 2)} Z" fill="#2a2d31"/>`;
  k += `<ellipse cx="${r(tx - cx + 9.6)}" cy="${r(ty - cy - 1)}" rx="1.2" ry=".8" fill="#2a2d31"/>`;
  S.teil({ oben: true, id: "computer", de: "der Computer", syl: "com-PU-ter", it: "il computer", itSyl: "com-PU-ter", en: "computer", x: cx, y: cy, steht: true, kunst: k,
    tipp: "Im Computer sieht die Beraterin die Akte und passende Stellen." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/jobcenter.js"));
console.log(aus);
