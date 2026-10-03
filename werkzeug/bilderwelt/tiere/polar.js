/* =====================================================================
   TIER-BIBLIOTHEK — POLAR (FASSUNG 854, Maßstab 2)
   Kaiserpinguin, Walross, Seehund, Rentier, Polarfuchs, Moschusochse, Schneeeule, Robbenbaby.
   Zentimeter, Blick nach rechts, Boden y = 0, Licht von links oben (siehe ANLEITUNG.md).
   Weißes Gefieder/Fell bekommt Schatten in Blau-/Grautönen (Schnee spiegelt den Himmel),
   Federn als feine Schuppenlage, Haut mit T.relief, Haare in Lagen. Mikrodetails nur bei T.fein.
   ===================================================================== */
"use strict";
const R = (n) => Math.round(n * 10) / 10;
/* kurze Zahl: 0.4 → .4 (Federn und Haare sind viele – jedes Byte zählt) */
const Z = (n) => String(R(n)).replace(/^(-?)0\./, "$1.");
const Z2 = (n) => String(Math.round(n * 100) / 100).replace(/^(-?)0\./, "$1.");

/* Zahlen zu Pfad: Leerzeichen nur wo nötig ("1 -2" → "1-2") */
const J = (...v) => v.map((x, i) => { const t = Z(x); return i && t[0] !== "-" ? " " + t : t; }).join("");
/* glatte Kurve durch Punkte (Catmull-Rom), kompakt mit relativen Befehlen. [x, y, 1] = harte Ecke */
function G(pts, zu = true, sp = 1) {
  const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let cx = R(pts[0][0]), cy = R(pts[0][1]), d = "M" + J(cx, cy);
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6 * sp, p1[1] + (p2[1] - p0[1]) / 6 * sp];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6 * sp, p2[1] - (p3[1] - p1[1]) / 6 * sp];
    const ex = R(p2[0]), ey = R(p2[1]);
    d += "c" + J(c1[0] - cx, c1[1] - cy, c2[0] - cx, c2[1] - cy, ex - cx, ey - cy);
    cx = ex; cy = ey;
  }
  return d + (zu ? "z" : "");
}
const form = (T, pts, fill, extra = "") => `<path d="${typeof pts === "string" ? pts : G(pts)}" fill="${fill}"${extra}/>`;
const linie = (pts, farbe, w, extra = "") => `<path d="${G(pts, false)}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-linecap="round"${extra}/>`;
/* ---------- Hilfen ---------- */
function flaeche(p) { let a = 0; for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length]; a += p[i][0] * q[1] - q[0] * p[i][1]; } return a; }
const gleich = (p) => (flaeche(p) < 0 ? p.slice().reverse() : p);
const vereint = (T, teile) => teile.map((p) => G(gleich(p))).join("");
function inPoly(x, y, p) {
  let ja = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const xi = p[i][0], yi = p[i][1], xj = p[j][0], yj = p[j][1];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) ja = !ja;
  }
  return ja;
}
/* weicher Fleck (Radialverlauf); ein Verlauf je Farbe + Stärke */
function fleck(T, cx, cy, rx, ry, farbe, op, dreh = 0) {
  const o = Math.max(0.05, Math.round(op * 20) / 20);
  const g = T.rg("f" + farbe.slice(1), [[0, farbe], [0.5, farbe, 0.6], [1, farbe, 0]]);
  return `<ellipse cx="${Z(cx)}" cy="${Z(cy)}" rx="${Z(rx)}" ry="${Z(ry)}"${dreh ? ` transform="rotate(${dreh} ${Z(cx)} ${Z(cy)})"` : ""} fill="${g}"${o < 1 ? ` opacity="${Z2(o)}"` : ""}/>`;
}
/* Verlauf in Zentimetern (userSpaceOnUse): stops [[pos, farbe, op?], …] zwischen (x0,y0) und (x1,y1) */
const verlauf = (T, n, x0, y0, x1, y1, stops) => {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ax = (x1 - x0) / L, ay = (y1 - y0) / L;
  return T.lg(n, stops.map(([p, c, a]) => [Math.round(Math.max(0, Math.min(1, ((p[0] - x0) * ax + (p[1] - y0) * ay) / L)) * 1000) / 1000, c, a]), Z(x0), Z(y0), Z(x1), Z(y1), ' gradientUnits="userSpaceOnUse"');
};
/* Silhouette: Pfad EINMAL in defs; Rand-Strich dahinter, Füllung, Innenleben geklippt */
function silhouette(T, d, fill, innen, rand = "#000", rw = 0, ra = 0) {
  T._n = (T._n || 0) + 1;
  const id = T.id("s" + T._n);
  T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  return (rw ? `<use href="#${id}" fill="none" stroke="${rand}" stroke-width="${rw}" stroke-opacity="${ra}" stroke-linejoin="round"/>` : "") + `<use href="#${id}" fill="${fill}"/>` +
    (innen ? `<g clip-path="url(#${id}c)">${innen}</g>` : "");
}
const zart = (T, pts, farbe, w, op) => linie(pts, farbe, w, op < 1 ? ` stroke-opacity="${op}"` : "");
/* Haare in einer Fläche (Wuchsrichtung winkel: Grad oder f(x,y)); farben [[farbe, anteil, breite, deckkraft]]; Szene: Anteil sz */
function haare(T, pts, n, winkel, len, farben, streu = 14, krumm = 0.2, sz = 0.12) {
  const [x0, y0, x1, y1] = T.box(pts), wf = typeof winkel === "function" ? winkel : () => winkel;
  const ziel = Math.round(n * (T.fein === false ? sz : 1));
  if (ziel < 6) return "";
  const eimer = farben.map(() => ""), sum = farben.reduce((q, f) => q + f[1], 0);
  for (let got = 0, v = 0; got < ziel && v < ziel * 14; v++) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!inPoly(x, y, pts)) continue;
    const a = (wf(x, y) + (T.rnd() - 0.5) * streu) * Math.PI / 180, L = len * (0.55 + T.rnd() * 0.9);
    const ex = Math.cos(a) * L, ey = Math.sin(a) * L, k = krumm * L * (T.rnd() - 0.5) * 2;
    let u = T.rnd() * sum, i = 0;
    while (i < farben.length - 1 && u > farben[i][1]) { u -= farben[i][1]; i++; }
    eimer[i] += L < 1.2 ? `M${J(x, y)}l${J(ex, ey)}` : `M${J(x, y)}q${J(ex / 2 - Math.sin(a) * k, ey / 2 + Math.cos(a) * k, ex, ey)}`;
    got++;
  }
  return eimer.map((d, i) => (d ? `<path d="${d}" fill="none" stroke="${farben[i][0]}" stroke-width="${farben[i][2]}" stroke-opacity="${farben[i][3]}" stroke-linecap="round"/>` : "")).join("");
}
/* Wolllocken: kurze, stark gebogene Haare (Lanugo, Unterwolle) in der Fläche pts; farben wie haare(); Szene: Anteil sz */
function locken(T, pts, n, winkel, len, farben, sz = 0.06) {
  const [x0, y0, x1, y1] = T.box(pts), wf = typeof winkel === "function" ? winkel : () => winkel;
  const ziel = Math.round(n * (T.fein === false ? sz : 1));
  if (ziel < 6) return "";
  const eimer = farben.map(() => ""), sum = farben.reduce((q, f) => q + f[1], 0);
  for (let got = 0, v = 0; got < ziel && v < ziel * 14; v++) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!inPoly(x, y, pts)) continue;
    const a = (wf(x, y) + (T.rnd() - 0.5) * 80) * Math.PI / 180, L = len * (0.6 + T.rnd() * 0.8), k = (T.rnd() < 0.5 ? -1 : 1) * L * (0.35 + T.rnd() * 0.3);
    const ex = Math.cos(a) * L, ey = Math.sin(a) * L;
    let u = T.rnd() * sum, i = 0;
    while (i < farben.length - 1 && u > farben[i][1]) { u -= farben[i][1]; i++; }
    eimer[i] += `M${J(x, y)}q${J(ex / 2 - Math.sin(a) * k, ey / 2 + Math.cos(a) * k, ex, ey)}`;
    got++;
  }
  return eimer.map((d, i) => (d ? `<path d="${d}" fill="none" stroke="${farben[i][0]}" stroke-width="${farben[i][2]}" stroke-opacity="${farben[i][3]}" stroke-linecap="round"/>` : "")).join("");
}
/* Fellbüschel (spitz zulaufende Strähnen) in Wuchsrichtung: je Büschel Schatten (unten versetzt) und Lichtsaum (oben).
   schatten/licht: [farbe, deckkraft]. Szene: Anteil sz. */
function buschel(T, pts, n, winkel, len, br, schatten, licht, streu = 14, sz = 0.08) {
  const [x0, y0, x1, y1] = T.box(pts), wf = typeof winkel === "function" ? winkel : () => winkel;
  const ziel = Math.round(n * (T.fein === false ? sz : 1));
  if (ziel < 5) return "";
  let dS = "", dL = "";
  const eine = (x, y, a, L, w, k) => {
    const ex = Math.cos(a) * L, ey = Math.sin(a) * L, nx = -Math.sin(a), ny = Math.cos(a);
    return `M${J(x + nx * w * 0.3, y + ny * w * 0.3)}q${J(ex * 0.45 + nx * (w + k), ey * 0.45 + ny * (w + k), ex - nx * w * 0.3, ey - ny * w * 0.3)}q${J(-ex * 0.55 + nx * (k - w), -ey * 0.55 + ny * (k - w), -ex - nx * w * 0.3, -ey - ny * w * 0.3)}z`;
  };
  for (let got = 0, v = 0; got < ziel && v < ziel * 12; v++) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!inPoly(x, y, pts)) continue;
    const a = (wf(x, y) + (T.rnd() - 0.5) * streu) * Math.PI / 180, L = len * (0.6 + T.rnd() * 0.8), w = br * (0.7 + T.rnd() * 0.6), k = (T.rnd() - 0.5) * L * 0.3;
    dS += eine(x, y + w * 0.6, a, L, w, k);
    if (T.rnd() < 0.8) dL += eine(x - Math.cos(a) * L * 0.05, y - w * 0.4, a, L * 0.75, w * 0.5, k);
    got++;
  }
  return `<path d="${dS}" fill="${schatten[0]}" fill-opacity="${schatten[1]}"/>` + (dL ? `<path d="${dL}" fill="${licht[0]}" fill-opacity="${licht[1]}"/>` : "");
}
/* Fellkante: Büschel, die entlang einer Konturlinie nach außen (Normale, seite ±1) und in Wuchsrichtung abstehen;
   Füllung = Körperfarbe (Verlauf in cm), damit die Kontur weich und haarig wird. */
function fellRand(T, pts, n, len, br, fill, seite = 1, zug = 0, sz = 0.2) {
  const z = Math.round(n * (T.fein === false ? sz : 1));
  if (z < 4) return "";
  let d = "";
  for (let i = 0; i < z; i++) {
    const t = (i + T.rnd() * 0.8) / z * (pts.length - 1), k = Math.min(pts.length - 2, Math.floor(t)), f = t - k;
    const a = pts[k], b = pts[k + 1], x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f;
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, tx = (b[0] - a[0]) / l, ty = (b[1] - a[1]) / l;
    const nx = ty * seite, ny = -tx * seite, L = len * (0.5 + T.rnd() * 0.9), w = br * (0.6 + T.rnd() * 0.7);
    const dx = nx * 0.7 + tx * zug + (T.rnd() - 0.5) * 0.5, dy = ny * 0.7 + ty * zug + (T.rnd() - 0.5) * 0.5, dl = Math.hypot(dx, dy) || 1;
    const ex = dx / dl * L, ey = dy / dl * L, px = -ey / L * w, py = ex / L * w;
    d += `M${J(x - nx * 0.6 + px, y - ny * 0.6 + py)}q${J(ex * 0.5 + px * 0.4 + nx * 0.6, ey * 0.5 + py * 0.4 + ny * 0.6, ex - px + nx * 0.6, ey - py + ny * 0.6)}q${J(-ex * 0.4 - px * 0.6, -ey * 0.4 - py * 0.6, -ex - px, -ey - py)}z`;
  }
  return `<path d="${d}" fill="${fill}"/>`;
}
/* Haarsaum entlang einer Kontur: feine, gebogene Haare, Ansatz innen, Spitze nach außen (Normale, seite ±1) und mit
   Zug in Laufrichtung; Längen stark gemischt → weiche, haarige Kante statt Sägezahn. farben wie haare(). */
function haarSaum(T, pts, n, len, farben, seite = 1, zug = 0, sz = 0.1) {
  const z = Math.round(n * (T.fein === false ? sz : 1));
  if (z < 4) return "";
  const eimer = farben.map(() => ""), sum = farben.reduce((q, f) => q + f[1], 0);
  for (let i = 0; i < z; i++) {
    const t = (i + T.rnd()) / z * (pts.length - 1), k = Math.min(pts.length - 2, Math.floor(t)), f = t - k;
    const a = pts[k], b = pts[k + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, tx = (b[0] - a[0]) / l, ty = (b[1] - a[1]) / l;
    const nx = ty * seite, ny = -tx * seite, L = len * (0.3 + T.rnd() * T.rnd() * 1.6);
    const x = a[0] + (b[0] - a[0]) * f - nx * L * 0.35, y = a[1] + (b[1] - a[1]) * f - ny * L * 0.35;
    const dx = nx + tx * zug + (T.rnd() - 0.5) * 0.6, dy = ny + ty * zug + (T.rnd() - 0.5) * 0.6, dl = Math.hypot(dx, dy) || 1;
    const ex = dx / dl * L, ey = dy / dl * L, kk = (T.rnd() - 0.5) * L * 0.5;
    let u = T.rnd() * sum, c = 0;
    while (c < farben.length - 1 && u > farben[c][1]) { u -= farben[c][1]; c++; }
    eimer[c] += `M${J(x, y)}q${J(ex / 2 - ey / L * kk, ey / 2 + ex / L * kk, ex, ey)}`;
  }
  return eimer.map((d, i) => (d ? `<path d="${d}" fill="none" stroke="${farben[i][0]}" stroke-width="${farben[i][2]}" stroke-opacity="${farben[i][3]}" stroke-linecap="round"/>` : "")).join("");
}
/* Strähnen: Bündel aus m feinen, leicht gewellten, parallelen Haaren, die zur Spitze zusammenlaufen (Lanugo, Langhaar).
   Pfad EINMAL in defs, zweimal benutzt: Schattenseite (versetzt) und Lichtseite. o: { m, ab (Haarabstand), welle,
   streu, licht:[farbe,op,w], schatten:[farbe,op,w], dx, dy (Schattenversatz), sz (Anteil Szene) } */
function straehnen(T, pts, n, winkel, len, o = {}) {
  const m = o.m || 4, ab = o.ab || 0.06, we = o.welle ?? 0.12;
  const ziel = Math.round(n * (T.fein === false ? (o.sz ?? 0.06) : 1));
  if (ziel < 4) return "";
  const [x0, y0, x1, y1] = T.box(pts), wf = typeof winkel === "function" ? winkel : () => winkel;
  let d = "";
  for (let got = 0, v = 0; got < ziel && v < ziel * 14; v++) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!inPoly(x, y, pts)) continue;
    const a = (wf(x, y) + (T.rnd() - 0.5) * (o.streu ?? 12)) * Math.PI / 180, L = len * (0.6 + T.rnd() * 0.8);
    const c = Math.cos(a), si = Math.sin(a), nx = -si, ny = c, w = (T.rnd() - 0.5) * 2 * we * L;
    const mm = Math.max(2, Math.round(m * (0.7 + T.rnd() * 0.6)));
    for (let j = 0; j < mm; j++) {
      const q = j - (mm - 1) / 2, off = q * ab * (0.7 + T.rnd() * 0.6), l = L * (1 - Math.abs(q) / mm * 0.6) * (0.9 + T.rnd() * 0.2);
      const sx = x + nx * off, sy = y + ny * off;
      d += `M${J(sx, sy)}c${J(c * l / 3 + nx * w, si * l / 3 + ny * w, c * l * 2 / 3 - nx * (w * 0.5 + off * 0.3), si * l * 2 / 3 - ny * (w * 0.5 + off * 0.3), c * l - nx * off * 0.7, si * l - ny * off * 0.7)}`;
    }
    got++;
  }
  const id = T.id("st" + (T._st = (T._st || 0) + 1));
  T.def(`<path id="${id}" d="${d}"/>`);
  const u = (f, dx, dy) => `<use href="#${id}" fill="none" stroke="${f[0]}" stroke-opacity="${f[1]}" stroke-width="${f[2]}" stroke-linecap="round"${dx || dy ? ` transform="translate(${Z2(dx)} ${Z2(dy)})"` : ""}/>`;
  return (o.schatten ? u(o.schatten, o.dx ?? 0.04, o.dy ?? 0.07) : "") + (o.licht ? u(o.licht, 0, 0) : "");
}
/* Federschuppen: versetzte Reihen kleiner Bögen (Federspitzen) in der Fläche pts.
   o: { b (Breite), h (Reihenabstand), t (Wölbung), farbe, w (Strich), op, winkel f(x,y) (Neigung, Grad),
        p f(x,y) → Wahrscheinlichkeit 0..1, sz (Anteil in der Szene, Standard 0) } */
function schuppen(T, pts, o) {
  if (T.fein === false && !o.sz) return "";
  const [x0, y0, x1, y1] = T.box(pts);
  let d = "";
  const hz = T.fein === false ? o.h / Math.sqrt(o.sz) : o.h, bz = T.fein === false ? o.b / Math.sqrt(o.sz) : o.b;
  for (let y = y0, z = 0; y < y1; y += hz, z++) {
    for (let x = x0 - (z % 2) * bz / 2; x < x1; x += bz) {
      const jx = x + (T.rnd() - 0.5) * bz * 0.35, jy = y + (T.rnd() - 0.5) * hz * 0.35;
      if (!inPoly(jx, jy, pts)) continue;
      if (o.p && T.rnd() > o.p(jx, jy)) continue;
      const a = (o.winkel ? o.winkel(jx, jy) : 0) * Math.PI / 180, w = o.b * (0.8 + T.rnd() * 0.4) / 2;
      const ca = Math.cos(a), sa = Math.sin(a), t = (o.t || 0.45) * w;
      d += `M${Z(jx - ca * w)} ${Z(jy - sa * w)}q${Z2(ca * w - sa * 2 * t)} ${Z2(sa * w + ca * 2 * t)} ${Z2(2 * ca * w)} ${Z2(2 * sa * w)}`;
    }
  }
  return d ? `<path d="${d}" fill="none" stroke="${o.farbe}" stroke-width="${o.w}" stroke-opacity="${o.op}" stroke-linecap="round"/>` : "";
}
/* Randhaare/Federspitzen entlang einer Kurve (bricht die glatte Vektorkante) */
function kante(T, pts, n, dx, dy, farbe, w, op, sz = 0.2) {
  const z = Math.round(n * (T.fein === false ? sz : 1));
  if (z < 5) return "";
  let d = "";
  for (let i = 0; i < z; i++) {
    const t = (i + T.rnd() * 0.8) / z * (pts.length - 1), k = Math.min(pts.length - 2, Math.floor(t)), f = t - k;
    const x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f, s = 0.6 + T.rnd() * 0.8, b = (T.rnd() - 0.5) * 0.6;
    d += `M${Z(x)} ${Z(y)}q${Z2(dx * s * 0.5 + dy * b)} ${Z2(dy * s * 0.5 - dx * b)} ${Z2(dx * s)} ${Z2(dy * s)}`;
  }
  return `<path d="${d}" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" fill="none" stroke-linecap="round"/>`;
}
/* nur in voller Feinheit */
const fein = (T, s) => (T.fein === false ? "" : s);
/* Gruppe mit Relief-Filter (nur fein) */
const relief = (T, n, o, s) => (T.fein === false ? s : `<g filter="${T.relief(n, o)}">${s}</g>`);

/* Federmuster (Schuppenlage) als Kachel: versetzte Reihen von Federspitzen. Je Feder ein dunkler Sichelschatten unter
   der Spitze (auf der Feder darunter) und ein heller Sichelsaum auf der Spitze. b Breite, h Reihenabstand (cm),
   dreh = Neigung der Reihen. Liefert eine Funktion (erst beim Zeichnen anlegen → in der Szene keine Defs). */
function federMuster(T, n, b, h, dunkel, hell, opD, opH, dreh = 0) {
  const id = T.id("pm" + n);
  T._pm = T._pm || new Set();
  if (!T._pm.has(id)) {
    T._pm.add(id);
    const w = b * 0.44, d = h * 0.62;
    const sichel = (cx, cy, t1, t2) => `M${Z2(cx - w)} ${Z2(cy)}Q${Z2(cx)} ${Z2(cy + 2 * d * t1)} ${Z2(cx + w)} ${Z2(cy)}Q${Z2(cx)} ${Z2(cy + 2 * d * t2)} ${Z2(cx - w)} ${Z2(cy)}Z`;
    const alle = (t1, t2, dy) => [[b / 2, 0.05 * h], [0, 1.05 * h], [b, 1.05 * h]].map(([x, y]) => sichel(x, y + dy, t1, t2)).join("");
    T.def(`<pattern id="${id}" width="${Z2(b)}" height="${Z2(2 * h)}" patternUnits="userSpaceOnUse"${dreh ? ` patternTransform="rotate(${dreh})"` : ""}>` +
      `<path d="${alle(1.25, 0.95, 0)}" fill="${dunkel}" fill-opacity="${opD}"/>` +
      (hell ? `<path d="${alle(0.92, 0.55, -0.02)}" fill="${hell}" fill-opacity="${opH}"/>` : "") + `</pattern>`);
  }
  return `url(#${id})`;
}
/* Lanzett-Federn als Kachel: sichtbar ist nur die spitze Federspitze jeder überlappenden Feder (Spitze nach unten) –
   dunkler Spitzen-Schatten auf der Feder darunter, feiner Lichtsaum darüber. trans = patternTransform (Rundung: scale). */
function lanzettMuster(T, n, b, h, dunkel, hell, opD, opH, trans = "") {
  const id = T.id("lz" + n);
  T._pm = T._pm || new Set();
  if (!T._pm.has(id)) {
    T._pm.add(id);
    const w = b * 0.46, d = h * 0.9;
    const v = (cx, cy, t) => `M${J(cx - w, cy)}Q${J(cx - w * 0.35, cy + d * 0.85 * t, cx, cy + d * t)}Q${J(cx + w * 0.35, cy + d * 0.85 * t, cx + w, cy)}Q${J(cx + w * 0.3, cy + d * 0.62 * t, cx, cy + d * 0.72 * t)}Q${J(cx - w * 0.3, cy + d * 0.62 * t, cx - w, cy)}z`;
    const alle = (t, dy) => [[b / 2, dy], [0, h + dy], [b, h + dy]].map(([x, y]) => v(x, y, t)).join("");
    T.def(`<pattern id="${id}" width="${Z2(b)}" height="${Z2(2 * h)}" patternUnits="userSpaceOnUse"${trans ? ` patternTransform="${trans}"` : ""}>` +
      `<path d="${alle(1, 0.05)}" fill="${dunkel}" fill-opacity="${opD}"/>` + (hell ? `<path d="${alle(0.8, -h * 0.18)}" fill="${hell}" fill-opacity="${opH}"/>` : "") + `</pattern>`);
  }
  return `url(#${id})`;
}
/* Maske mit Radialverlauf (userSpaceOnUse): stops [[0..1, farbe]] – Weiß = sichtbar */
function radialMaske(T, n, x, y, w, h, cx, cy, rr, stops, sy = 1) {
  const id = T.id("rm" + n);
  const g = T.rg("rmg" + n, stops, Z(cx), Z(cy), Z(rr), ` gradientUnits="userSpaceOnUse"${sy !== 1 ? ` gradientTransform="translate(0 ${Z(cy * (1 - sy))}) scale(1 ${sy})"` : ""}`);
  T.def(`<mask id="${id}" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${g}"/></mask>`);
  return `url(#${id})`;
}
/* Fläche mit Federmuster füllen (nur fein; in der Szene nichts) */
const federn = (T, x, y, w, h, n, b, hh, dunkel, hell, opD, opH, dreh, op, wk = true, maske = null) =>
  (T.fein === false ? "" : `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${federMuster(T, n, b, hh, dunkel, hell, opD, opH, dreh)}"${wk ? ` filter="${wackel(T)}"` : ""}${op < 1 ? ` opacity="${op}"` : ""}${maske ? ` mask="${maske()}"` : ""}/>`);
/* leichtes Verwackeln (Turbulenz-Verschiebung): Kachelmuster wirkt wie gewachsen, nicht gestempelt */
function wackel(T) {
  if (!T._wk) { T._wk = T.id("wk"); T.def(`<filter id="${T._wk}" x="-2%" y="-2%" width="104%" height="104%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".22" numOctaves="2" seed="9"/><feDisplacementMap in="SourceGraphic" scale=".8" xChannelSelector="R" yChannelSelector="G"/></filter>`); }
  return `url(#${T._wk})`;
}
/* fleckige Maske aus Rauschen (Federn liegen mal glatt, mal gesträubt): Muster nur stellenweise sichtbar. Nur fein. */
function rauschMaske(T, n, f, x, y, w, h, k = 3, mitte = 0.45, seed = 4) {
  const id = T.id("nm" + n);
  T.def(`<filter id="${id}f" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${f}" numOctaves="2" seed="${seed}"/>` +
    `<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 ${k} 0 0 0 ${Z2(-k * mitte)}"/></filter>` +
    `<mask id="${id}" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}"><rect x="${x}" y="${y}" width="${w}" height="${h}" filter="url(#${id}f)"/></mask>`);
  return `url(#${id})`;
}
/* Maske mit Verlauf (Teil blendet weich aus): stops wie verlauf() */
function verlaufMaske(T, n, x, y, w, h, x0, y0, x1, y1, stops) {
  const id = T.id("vm" + n);
  T.def(`<mask id="${id}" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${verlauf(T, "vg" + n, x0, y0, x1, y1, stops)}"/></mask>`);
  return `url(#${id})`;
}
/* Hautrelief als Lichtkarte (warm getönt) – wird per multiply über die Haut gelegt: Falten/Poren dunkeln nur ab,
   die Hautfarbe bleibt warm (kein Grauschleier). typ "turbulence" = Knitterfalten, "fractalNoise" = Poren/Körnung. */
function hautLicht(T, n, o) {
  const id = T.id("hl" + n);
  T._hl = T._hl || new Set();
  if (!T._hl.has(id)) {
    T._hl.add(id);
    T.def(`<filter id="${id}" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB"><feTurbulence type="${o.typ || "turbulence"}" baseFrequency="${o.f}" numOctaves="${o.okt || 2}" seed="${o.seed || 3}"/>` +
      `<feDiffuseLighting surfaceScale="${o.tiefe}" diffuseConstant="1.26" lighting-color="${o.farbe || "#fff0e6"}"><feDistantLight azimuth="225" elevation="56"/></feDiffuseLighting></filter>`);
  }
  return `url(#${id})`;
}
/* Volumen je Körperteil – wie T.volumen (kern.js, ANLEITUNG Punkt 13: Silhouette weichzeichnen und von links oben
   beleuchten → Rundung, Kernschatten, Licht automatisch), zusätzlich wird die Lichtkarte leicht geglättet: bei großem
   „weich“ (Rumpf) zeigt der 8-Bit-Alphaverlauf sonst Höhenlinien („Holzmaserung“) auf hellen Flächen. Szene: "none". */
function vol(T, n, o = {}) {
  if (T.fein === false) return "none";
  /* stufenlos wie T.volumen (kern.js): Innen-Schatten unten rechts, Innen-Glanz oben links aus der weich verschobenen
     Silhouette; Filterbereich großzügig (sonst entsteht am Rand eine Kante, wo der verschobene Weichzeichner abreißt) */
  /* gleiche Einstellungen → derselbe Filter (kleine Datei): weich und Stärke auf Stufen runden */
  const w = [0.5, 0.8, 1.2, 1.6, 2.2, 3, 4.5, 7, 9, 12, 16].reduce((b, v) => (Math.abs(Math.log(v / (o.weich || 6))) < Math.abs(Math.log(b / (o.weich || 6))) ? v : b), 6);
  const st = Math.min(1, 0.09 * (o.tiefe || 5)), amb = o.umgebung != null ? o.umgebung : 0.3;
  const d = w * 0.9, sch = Z2(Math.round(st * (1 - amb) * 0.95 * 20) / 20), gl = Z2(Math.round(st * (1 - amb) * 0.38 * 20) / 20);
  const id = T.id("pv" + String(w).replace(".", "_") + sch.replace(".", "") + gl.replace(".", "") + (o.schatten || "").slice(1) + (o.licht || "").slice(1));
  T._pv = T._pv || new Set();
  if (!T._pv.has(id)) {
    T._pv.add(id);
    T.def(`<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">` +
      `<feGaussianBlur in="SourceAlpha" stdDeviation="${w}" result="b"/><feOffset dx="${Z2(-d)}" dy="${Z2(-d)}" result="u"/><feOffset in="b" dx="${Z2(d * 0.8)}" dy="${Z2(d * 0.8)}" result="o"/>` +
      `<feComposite in="SourceAlpha" in2="u" operator="out" result="u"/><feComposite in="SourceAlpha" in2="o" operator="out" result="o"/>` +
      `<feFlood flood-color="${o.schatten || "#1a1008"}" flood-opacity="${sch}"/><feComposite in2="u" operator="in" result="u"/>` +
      `<feFlood flood-color="${o.licht || "#fff6e6"}" flood-opacity="${gl}"/><feComposite in2="o" operator="in"/>` +
      `<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="u"/><feMergeNode/></feMerge><feComposite in2="SourceGraphic" operator="in"/></filter>`);
  }
  return `url(#${id})`;
}
/* Hautrelief als Schatten- bzw. Lichtschicht (normale Deckung, kein mix-blend – das wirkt in Chrome innerhalb gefilterter
   Gruppen nicht und gibt sonst einen grauen Schleier): Turbulenz → Licht von links oben → Alpha aus der Helligkeit.
   art "schatten": dunkle Farbe dort, wo die Falte vom Licht abgewandt ist; art "licht": helle Farbe auf den Kämmen. */
function relief2(T, n, o) {
  const id = T.id("r2" + n);
  T._r2 = T._r2 || new Set();
  if (!T._r2.has(id)) {
    T._r2.add(id);
    const c = o.farbe || (o.art === "licht" ? "#ffe2d0" : "#2a120a"), k = o.k || 1.6, rgb = [1, 3, 5].map((i) => Math.round(parseInt(c.slice(i, i + 2), 16) / 2.55) / 100);
    const al = o.art === "licht" ? `${k} 0 0 0 ${Z2(-k * (o.schwelle || 0.92))}` : `${-k} 0 0 0 ${Z2(k * (o.schwelle || 0.86))}`;
    T.def(`<filter id="${id}" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB"><feTurbulence type="${o.typ || "turbulence"}" baseFrequency="${o.f}" numOctaves="${o.okt || 2}" seed="${o.seed || 3}"/>` +
      `<feDiffuseLighting surfaceScale="${o.tiefe}" diffuseConstant="1" lighting-color="#fff"><feDistantLight azimuth="225" elevation="56"/></feDiffuseLighting>` +
      `<feColorMatrix values="0 0 0 0 ${rgb[0]} 0 0 0 0 ${rgb[1]} 0 0 0 0 ${rgb[2]} ${al}"/></filter>`);
  }
  return `url(#${id})`;
}
/* Relief als nahtlose Musterkachel (feTurbulence stitchTiles): die teure Turbulenz-/Lichtberechnung läuft nur für EINE
   Kachel, die Fläche wird damit gefüllt → schnell beim Rendern. o wie relief2 (+ kachel in cm). */
function reliefKachel(T, n, o) {
  const id = T.id("rk" + n), k = o.kachel || 30;
  T._rk = T._rk || new Set();
  if (!T._rk.has(id)) {
    T._rk.add(id);
    const fid = id + "f", c = o.farbe || (o.art === "licht" ? "#ffe2d0" : "#2a120a"), kk = o.k || 1.6, rgb = [1, 3, 5].map((i) => Math.round(parseInt(c.slice(i, i + 2), 16) / 2.55) / 100);
    const al = o.art === "licht" ? `${kk} 0 0 0 ${Z2(-kk * (o.schwelle || 0.92))}` : `${-kk} 0 0 0 ${Z2(kk * (o.schwelle || 0.86))}`;
    T.def(`<filter id="${fid}" filterUnits="userSpaceOnUse" x="0" y="0" width="${k}" height="${k}" color-interpolation-filters="sRGB"><feTurbulence type="${o.typ || "turbulence"}" baseFrequency="${o.f}" numOctaves="${o.okt || 2}" seed="${o.seed || 3}" stitchTiles="stitch"/>` +
      `<feDiffuseLighting surfaceScale="${o.tiefe}" diffuseConstant="1" lighting-color="#fff"><feDistantLight azimuth="225" elevation="56"/></feDiffuseLighting>` +
      `<feColorMatrix values="0 0 0 0 ${rgb[0]} 0 0 0 0 ${rgb[1]} 0 0 0 0 ${rgb[2]} ${al}"/></filter>` +
      `<pattern id="${id}" width="${k}" height="${k}" patternUnits="userSpaceOnUse"><rect width="${k}" height="${k}" filter="url(#${fid})"/></pattern>`);
  }
  return `url(#${id})`;
}
/* Volumen als Licht-/Schattenschicht über einer Silhouette – schnelle Variante von T.volumen für große Körper (die
   Lichtberechnung von feDiffuseLighting kostet bei großen Flächen sehr viel Renderzeit): Umriss weichzeichnen, gegen die
   Lichtrichtung bzw. mit ihr versetzen und vom Umriss abziehen → Kernschatten an der lichtabgewandten Kante (unten rechts),
   Licht an der zugewandten (oben links), dazwischen ein weicher Übergang = Rundung. Szene: nichts. */
function volSchicht(T, n, d, o = {}) {
  if (T.fein === false) return "";
  const w = o.weich || 6, v = Z2(w * (o.versatz || 0.7)), id = T.id("vs" + n);
  T.def(`<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="${w}" result="b"/>` +
    `<feOffset in="b" dx="-${v}" dy="-${v}" result="bs"/><feComposite in="SourceAlpha" in2="bs" operator="out" result="ms"/>` +
    `<feOffset in="b" dx="${v}" dy="${v}" result="bl"/><feComposite in="SourceAlpha" in2="bl" operator="out" result="ml"/>` +
    `<feFlood flood-color="${o.schatten || "#1a0d08"}" flood-opacity="${o.ks || 0.6}"/><feComposite in2="ms" operator="in" result="s"/>` +
    `<feFlood flood-color="${o.licht || "#fff4ec"}" flood-opacity="${o.kl || 0.35}"/><feComposite in2="ml" operator="in" result="l"/>` +
    `<feMerge><feMergeNode in="s"/><feMergeNode in="l"/></feMerge></filter>`);
  return `<path d="${d}" filter="url(#${id})"/>`;
}
/* weiche Licht-/Schattenform: fein = Vieleck verwischt; Szene = gleich große weiche Ellipse (Radialverlauf, kein Filter) */
function weichForm(T, pts, farbe, op, sd) {
  if (T.fein !== false) { const [a0, b0, a1, b1] = T.box(pts); return form(T, pts, farbe, ` opacity="${Z2(op)}" filter="${blur(T, sd, 2.6 * sd / Math.max(0.5, Math.min(a1 - a0, b1 - b0)))}"`); }
  if (op < 0.3) return "";   // Szene: zarte Formen weglassen (klein unsichtbar, spart Bytes)
  const n = pts.length, mx = pts.reduce((a, p) => a + p[0], 0) / n, my = pts.reduce((a, p) => a + p[1], 0) / n;
  let sxx = 0, syy = 0, sxy = 0;
  for (const [x, y] of pts) { sxx += (x - mx) ** 2; syy += (y - my) ** 2; sxy += (x - mx) * (y - my); }
  const w = 0.5 * Math.atan2(2 * sxy, sxx - syy), c = Math.cos(w), si = Math.sin(w);
  let a = 0, b = 0;
  for (const [x, y] of pts) { a = Math.max(a, Math.abs((x - mx) * c + (y - my) * si)); b = Math.max(b, Math.abs(-(x - mx) * si + (y - my) * c)); }
  return fleck(T, mx, my, a + sd, b + sd, farbe, op * 0.85, Math.round(w * 180 / Math.PI));
}
/* weiches Verwischen (nur fein benutzen) */
const BLUR_STUFEN = [0.06, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.6, 2, 2.4, 3, 4, 5, 6, 8, 10, 12, 16];
/* rand: Filterbereich als Anteil der Form (klein halten – große Bereiche kosten Renderzeit) */
function blur(T, sd, rand = 1.5) {
  sd = BLUR_STUFEN.reduce((b, v) => (Math.abs(Math.log(v / sd)) < Math.abs(Math.log(b / sd)) ? v : b), 1);   // wenige Filter → kleine Datei
  rand = [0.1, 0.25, 0.5, 1, 1.5].find((v) => v >= rand) || 1.5;
  const id = T.id("bl" + String(sd).replace(".", "") + "_" + String(rand).replace(".", ""));
  T._bl = T._bl || new Set();
  if (!T._bl.has(id)) { T._bl.add(id); T.def(`<filter id="${id}" x="${-rand * 100}%" y="${-rand * 100}%" width="${100 + rand * 200}%" height="${100 + rand * 200}%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${sd}"/></filter>`); }
  return `url(#${id})`;
}
/* Röhre entlang einer Mittellinie (Zehe, Kralle, Haar-Büschel): Breite w0 → w1, Spitze rund */
function roehre(pts, w0, w1) {
  const n = pts.length, L = [], Rr = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const w = (w0 + (w1 - w0) * i / (n - 1)) / 2;
    L.push([pts[i][0] - dy * w, pts[i][1] + dx * w]); Rr.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  const e = pts[n - 1], v = pts[n - 2], l = Math.hypot(e[0] - v[0], e[1] - v[1]) || 1;
  return [...L, [e[0] + (e[0] - v[0]) / l * w1 * 0.5, e[1] + (e[1] - v[1]) / l * w1 * 0.5], ...Rr.reverse()];
}
/* Saum aus kleinen gefüllten Bögen entlang einer Linie (Federspitzen greifen über eine Farbgrenze), Richtung: rechts der Laufrichtung = innen */
function saum(T, pts, schritt, tiefe, farbe, op, seite = 1) {
  let d = "";
  if (T.fein === false) { schritt *= 2.5; tiefe *= 1.5; }
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.round(L / schritt));
    const nx = -(b[1] - a[1]) / L * seite, ny = (b[0] - a[0]) / L * seite, sx = (b[0] - a[0]) / k, sy = (b[1] - a[1]) / k;
    for (let j = 0; j < k; j++) {
      const tt = tiefe * (0.6 + T.rnd() * 0.8);
      d += `M${Z2(a[0] + sx * j)} ${Z2(a[1] + sy * j)}q${Z2(sx / 2 - nx * tt * 2)} ${Z2(sy / 2 - ny * tt * 2)} ${Z2(sx)} ${Z2(sy)}z`;
    }
  }
  return `<path d="${d}" fill="${farbe}"${op < 1 ? ` fill-opacity="${op}"` : ""}/>`;
}

/* =====================================================================
   KAISERPINGUIN
   ===================================================================== */
/* RECHERCHE Kaiserpinguin (Aptenodytes forsteri): größter Pinguin, stehend 100–120 cm, 22–45 kg.
   Stromlinien-Körper wie eine längliche Birne: kleiner Kopf, dicker kurzer Hals, Brust und Bauch tief
   gewölbt (breiteste Stelle im unteren Drittel), Rücken fast gerade. Steht aufrecht, Gewicht auf den
   Fersen, der kurze, steife, keilförmige Schwanz stützt hinten auf dem Eis. Kopf, Kinn, Kehle, Rücken,
   Flossen-Oberseite und Schwanz schwarz (Rücken schiefer-/blaugrau überhaucht, Kopf tiefschwarz);
   Bauch weiß, obere Brust blassgelb. Ohrfleck: leuchtend gelb-orange, oben hinter dem Auge am breitesten
   (dort am kräftigsten, goldorange), läuft als „Komma“ seitlich am Hals nach unten-vorn schmaler aus und
   verschmilzt mit dem Blassgelb der Brust; vorn trennt ihn ein schmaler schwarzer Kehlkeil. Scharfe
   schwarz-weiße Grenze seitlich vor der Flosse, dunkler Grenzstreif. Schnabel ≈ 8 cm, lang, schlank, leicht
   abwärts gebogen; Oberschnabel schwarz, am Unterschnabel seitlich eine orange-rosa bis lila Platte
   (Schnabelstreif). Auge klein, Iris dunkelbraun, keine Wimpern. Flossen 30–35 cm, abgeflacht, Oberseite
   blauschwarz, Unterseite weiß. Füße schwarz, beschuppt, Schwimmhäute, kräftige Krallen; Lauf befiedert,
   Bauchfedern hängen über die Füße. Gefieder: sehr dichte, kurze, steife, schuppenartig überlappende Federn
   (kein Fell!) – glatt, satiniert, auf dem Rücken mit hellen Federspitzen (silbriger Schimmer). */
function pinguin(T) {
  const F = T.fein !== false;
  const weich = (pts, farbe, op, sd) => weichForm(T, pts, farbe, op, sd);
  /* Umriss: Nacken leicht konkav, Schulter/Flossenansatz konvex, unterer Rücken fast gerade; Kehle rund, Brust unter der
     Kehle vorgewölbt, größte Tiefe bei 65–70 % der Höhe, Bauch hängt weich über die Fußwurzeln */
  const koerper = [
    [10.1, -108.8], [9.9, -105.4], [10.8, -101.4], [13, -97.4], [16.6, -92.6], [20.4, -86], [23.2, -78], [25, -69], [26.2, -59], [26.9, -49],
    [27, -39], [26, -30], [23.8, -22], [20.4, -15], [16, -9.4], [10.8, -6], [4.6, -4.7], [-1.6, -4.6], [-7, -5.6], [-11.6, -8.2], [-15.6, -12.4],
    [-19.2, -18.4], [-22.2, -26.4], [-24, -37], [-24.8, -49], [-24.8, -61], [-24.2, -72], [-22.8, -80.4], [-20.4, -87.4], [-17.2, -93.2],
    [-13.8, -97.8], [-11.8, -101.6], [-10.6, -105.4], [-9.4, -109.4], [-7.2, -113], [-3.8, -115.8], [0.6, -117], [5.4, -116.6], [8.6, -115],
    [10.3, -113.2], [10.8, -111.2], [10.5, -109.8],
  ];
  const kD = G(koerper);
  let s = "";

  /* ---- Füße: drei Vorderzehen leicht gefächert, Hornschuppen quer, Schwimmhautsaum, kurze kräftige stumpfe Krallen ---- */
  const zehF = verlauf(T, "zeh", 0, -5.4, 0, 0.2, [[[0, -5.4], "#767b84"], [[0, -2.8], "#40444a"], [[0, 0.2], "#18191c"]]);
  const zehe = (m, w0, w1, k, fern) => {
    const ring = [];
    if (F) for (let t = 0.1; t < 0.96; t += 0.085) {
      const i = Math.min(m.length - 2, Math.floor(t * (m.length - 1))), f = t * (m.length - 1) - i, a = m[i], b = m[i + 1];
      const x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f, w = (w0 + (w1 - w0) * t) / 2;
      ring.push(`M${J(x - 0.1, y - w * 0.95)}q${J(0.34, w * 0.95, 0, w * 1.9)}`);
    }
    let z = `<g filter="${vol(T, "zeh", { weich: 0.5, tiefe: 2.5 })}">` + T.koerper(G(roehre(m, w0, w1)), fern ? "#1c1d20" : zehF, { vol: false, rand: false, innen:
      (ring.length ? `<path d="${ring.join("")}" stroke="#08090a" stroke-width=".1" stroke-opacity="${fern ? 0.4 : 0.6}" fill="none"/>` +
        (fern ? "" : `<path d="${ring.join("")}" stroke="#8d939c" stroke-width=".06" stroke-opacity=".45" fill="none" transform="translate(-.14 0)"/>`) : "") +
      (fern ? "" : zart(T, m.map(([x, y], i) => [x, y - w0 * 0.3 * (1 - i / m.length)]), "#aab1bb", 0.26, 0.4)) }) + `</g>`;
    /* Kralle: kurz, dick, stumpf, nur leicht gebogen; dunkelgrau mit Glanzkante oben */
    z += form(T, roehre(k, 1, 0.42), fern ? "#09090a" : verlauf(T, "kralle", 0, k[0][1] - 0.6, 0, k[2][1] + 0.3, [[[0, k[0][1] - 0.6], "#4a4846"], [[0, k[2][1] + 0.3], "#121212"]]));
    if (!fern) z += zart(T, [[k[0][0] + 0.1, k[0][1] - 0.32], [k[1][0], k[1][1] - 0.3], [k[2][0] - 0.3, k[2][1] - 0.2]], "#c7ccd3", 0.1, 0.75);
    return z;
  };
  /* ferner Fuß: 20 % zurückgesetzt, im Schatten */
  s += zehe([[-1.6, -3.6], [2.4, -3.8], [5.8, -3.6], [8.4, -3.2]], 1.8, 1.2, [[8.3, -3.6], [9.9, -3.4], [10.9, -2.4]], true);
  /* naher Fuß: Lauf unter dem Bauch, Schwimmhaut, Innen-, Mittel-, Außenzehe (leicht gefächert) */
  s += form(T, [[-4, -4.8], [-3.4, -0.3], [2, 0, 1], [6, -0.4], [7, -3], [4, -5.4], [-1, -5.8]], "#1a1b1e");                        // Ferse (unter dem Bauch)
  /* Schwimmhaut zwischen den Zehenbasen, dunkler, Saum hell */
  s += form(T, [[3, -5], [10.4, -5.4], [13.4, -2.6], [10.4, -0.8], [3, -1]], verlauf(T, "haut", 0, -5.2, 0, -0.8, [[[0, -5.2], "#33363c"], [[0, -0.8], "#141518"]]));
  s += fein(T, zart(T, [[10.6, -5.2], [12.2, -3.9], [13.2, -2.8]], "#7b828c", 0.12, 0.6));
  s += zehe([[2.4, -4.6], [6.4, -5], [10, -5.3], [12.6, -5.3]], 1.7, 1.15, [[12.5, -5.7], [14.3, -5.7], [15.5, -4.9]]);               // Innenzehe (hinten, leicht aufwärts)
  s += zehe([[1.6, -2.9], [6.6, -2.8], [11.4, -2.5], [15, -2.1]], 2, 1.35, [[14.9, -2.6], [16.9, -2.3], [18.2, -1.3]]);               // Mittelzehe (längste)
  s += zehe([[0.8, -1.2], [4.8, -1], [8.8, -0.85], [11.6, -0.8]], 2.1, 1.4, [[11.5, -1.25], [13.3, -1], [14.4, 0]]);                  // Außenzehe (nah, am Boden)
  /* Schattenfugen zwischen den Zehen */
  s += fein(T, zart(T, [[3, -3.9], [7, -3.95], [11, -3.85], [13.4, -3.6]], "#000", 0.22, 0.6) + zart(T, [[2.4, -2], [6, -1.9], [10, -1.7], [12, -1.6]], "#000", 0.2, 0.55));

  /* ---- Schwanz: kurzer, schmaler, steifer Keil (≈ 7 % der Höhe), Spitze auf dem Eis; 9 steife Federn mit hellem Schaft ---- */
  const schwanz = [[-12, -5], [-14.6, -9.6], [-17, -13.4], [-19.4, -11.4], [-21.8, -7.4], [-24, -3.4], [-25.4, -0.7], [-25.6, -0.3, 1], [-23, -0.4], [-19.4, -1.6], [-15.2, -3.2]];
  let sch = "";
  if (F) {
    let d = "", e = "";
    for (let i = 0; i < 9; i++) {
      const t = i / 8, x0 = -17.4 - t * 3.4, y0 = -8.6 + t * 4.2, x1 = -19.6 - t * 5.4, y1 = -1.5 + t * 1.0;
      d += `M${J(x0, y0)}L${J(x1, y1)}`; e += `M${J(x0 - 0.15, y0 - 0.12)}L${J(x1 + 0.4, y1 - 0.15)}`;
    }
    sch += `<path d="${d}" stroke="#000" stroke-width=".22" stroke-opacity=".55" fill="none"/><path d="${e}" stroke="#7a889d" stroke-width=".07" stroke-opacity=".55" fill="none"/>`;
  }
  sch += weich([[-17, -9.6], [-20, -8.8], [-22, -5.4], [-19.4, -5.6]], "#6c7c93", 0.35, 0.6);
  s += `<g filter="${vol(T, "schwanz", { weich: 1.2, tiefe: 3 })}">${silhouette(T, G(schwanz), verlauf(T, "schw", -24, -12, -16, -12, [[[-24, -12], "#3a4658"], [[-21, -12], "#262e39"], [[-16, -12], "#14181d"]]), sch)}</g>`;

  /* ---- Körper: Weiß als Grund, darin (geklippt) Gelb, Ohrfleck, Rücken/Kopf, Federn, Licht/Schatten ---- */
  let n = "";
  /* Weiß: im Licht warm-weiß, kühler Kernschatten rechts unten (Schnee spiegelt den Himmel), Reflexlicht vom Eis am Rand */
  n += `<rect x="-30" y="-120" width="60" height="120" fill="${verlauf(T, "weissH", 2, -86, 24, -10, [[[2, -86], "#fffefb"], [[9, -64], "#f9f9f7"], [[16, -44], "#e8ecf0"], [[21, -28], "#cdd5de"], [[24, -10], "#aebbca"]])}"/>`;
  n += weich([[0, -84], [10, -82], [16, -62], [14, -40], [4, -36], [-2, -56]], "#fffefb", 0.6, 4);
  n += weich([[-6, -12], [6, -8], [16, -10], [10, -5.2], [-4, -5.6]], "#7d8ea5", 0.5, 1.6);
  n += weich([[-8, -78], [-4, -76], [-4, -30], [-9, -20], [-10, -50]], "#8c9db2", 0.35, 2.4);   // Flanke dreht nach hinten weg
  /* Federn im Weiß: nur im Übergang Licht → Schatten sichtbar, im Glanzlicht ausgeblendet */
  if (F) n += `<rect x="-14" y="-98" width="42" height="96" fill="${lanzettMuster(T, "w", 1.1, 0.62, "#5d7090", "#ffffff", 0.55, 0.8)}" filter="${wackel(T)}" opacity=".22" mask="${radialMaske(T, "w", -14, -98, 42, 96, 6, -60, 34, [[0, "#000"], [0.38, "#000"], [0.7, "#fff"], [1, "#888"]], 1.5)}"/>`;
  /* Brust: blasses Zitronengelb nur oben, bis ≈ 28 % der Höhe ins Weiß ausgelaufen */
  n += form(T, [[-3, -98], [13, -98], [17.6, -92], [21.6, -84], [14, -81], [4, -82], [-3, -88]], verlauf(T, "brust", 0, -97, 0, -81, [[[0, -97], "#fcf1c2", 0.9], [[0, -90], "#fdf5d4", 0.55], [[0, -81], "#fef9e8", 0]]), F ? ` filter="${blur(T, 1.4)}"` : "");
  /* Okklusion unter der schwarzen Kehle auf der Brust */
  n += weich([[0, -98], [12, -97.4], [16, -93.6], [8, -94.4], [0, -95.4]], "#6a7b92", 0.3, 1.2);
  /* Ohrfleck: oben schmal (hinter und unter dem Auge), an der Halsseite breiter, unten weich ins Brustgelb */
  const vorn = [[3.2, -110.6], [4.8, -109.6], [6.2, -107], [7.6, -104], [9.4, -101], [11.6, -98.6], [13.6, -96.8]];
  const hinten = [[1.6, -110.4], [0.4, -108], [-0.8, -104.4], [-1.8, -100.6], [-2.6, -97], [-3, -93.6]];
  const ohr = [...vorn, [16, -93], [12, -90.6], [4, -91.4], ...hinten.slice().reverse()];
  let oi = weich([[0.6, -109.4], [2.6, -109.6], [3.6, -106], [0.4, -104]], "#e8920f", 0.45, 0.8) + weich([[2, -104], [6, -103], [9, -99], [4, -98.6]], "#fff3c0", 0.3, 1.2);
  if (F) oi += `<rect x="-4" y="-112" width="22" height="22" fill="${lanzettMuster(T, "o", 0.5, 0.3, "#b8650a", "#fff4c4", 0.4, 0.45)}" opacity=".45" mask="${verlaufMaske(T, "om", -4, -112, 22, 22, 0, -100, 0, -94, [[[0, -100], "#fff"], [[0, -94], "#000"]])}"/>`;
  n += silhouette(T, G(ohr), verlauf(T, "ohr", 0, -110.6, 0, -91, [[[0, -110.6], "#f2a51a"], [[0, -104], "#f5b52c"], [[0, -99], "#f7c842"], [[0, -95], "#fbe48a"], [[0, -91], "#fbf0be", 0]]), oi);
  /* Rücken, Kopf, Kinn und Kehle: schwarz; die Form spart den Ohrfleck aus (scharfe Kante gegen Schwarz) */
  const dunkel = [[13.6, -96.8, 1], ...vorn.slice().reverse().map(([x, y]) => [x - 0.15, y + 0.1]), ...hinten.map(([x, y]) => [x + 0.15, y]), [-3.2, -90], [-3.8, -85], [-5.4, -79], [-6.8, -71], [-7.6, -61], [-8.2, -50], [-9.2, -38], [-10.8, -27], [-12.8, -17], [-14.6, -9],
    [-15.6, -3], [-16, 1, 1], [-40, 1, 1], [-40, -125, 1], [20, -125, 1], [20, -98, 1]];
  const dD = G(dunkel);
  T.def(`<clipPath id="${T.id("dkc")}"><path d="${dD}"/></clipPath>`);
  let dk = `<rect x="-30" y="-120" width="50" height="120" fill="${verlauf(T, "ruecken", -24.6, -60, -8, -60, [[[-24.6, -60], "#465569"], [[-21.4, -60], "#323d4c"], [[-15, -60], "#212831"], [[-8, -60], "#11151a"]])}"/>`;
  /* Lanzett-Federn: in der Mitte normal, zum Rand (Rundung) schmaler und kleiner; Kopf sehr fein */
  if (F) {
    const rand = verlaufMaske(T, "rr", -26, -118, 44, 118, -24.6, 0, -19, 0, [[[-24.6, 0], "#fff"], [[-19, 0], "#000"]]);
    const mitte = verlaufMaske(T, "rm", -26, -118, 44, 118, -24.6, 0, -19, 0, [[[-24.6, 0], "#000"], [[-19, 0], "#fff"]]);
    dk += `<rect x="-26" y="-104" width="22" height="104" fill="${lanzettMuster(T, "r", 1.15, 0.66, "#000", "#9fb2ca", 0.7, 0.5, "rotate(4)")}" filter="${wackel(T)}" opacity=".7" mask="${mitte}"/>`;
    dk += `<rect x="-26" y="-104" width="22" height="104" fill="${lanzettMuster(T, "rs", 1.15, 0.66, "#000", "#9fb2ca", 0.7, 0.5, "rotate(4) scale(.5 .75)")}" opacity=".7" mask="${rand}"/>`;
    dk += `<rect x="-10" y="-118" width="24" height="20" fill="${lanzettMuster(T, "k", 0.42, 0.26, "#000", "#62738d", 0.55, 0.5, "rotate(-12)")}" opacity=".45"/>`;
  }
  /* Kopf tiefschwarz, Rücken schiefer-blaugrau; Glanzband folgt der Wölbung (oben breiter, unten schmaler) */
  dk += `<rect x="-30" y="-120" width="50" height="38" fill="${verlauf(T, "kopfS", 0, -114, 0, -88, [[[0, -114], "#050608", 0.85], [[0, -101], "#090b0e", 0.7], [[0, -88], "#090b0e", 0]])}"/>`;
  dk += weich([[-19.6, -90], [-16.4, -94], [-20.6, -80], [-22.4, -60], [-22.2, -42], [-21, -30], [-21.6, -50], [-21.8, -72]], "#4a5a70", 0.9, 1.2);
  dk += weich([[-18, -90], [-15.4, -93.6], [-19.6, -82], [-20.6, -70], [-19.8, -76]], "#8396b0", 0.5, 1);
  dk += weich([[-8, -114.6], [-2, -116.4], [5, -116], [2, -115], [-5, -113.6]], "#6f829c", 0.5, 0.8);
  dk += weich([[-20, -20], [-14, -12], [-12, -6], [-18, -10]], "#000", 0.45, 2) + weich([[-11, -80], [-9, -60], [-10, -30], [-12, -55]], "#000", 0.35, 1.6);
  /* Grenze: dunklerer Saum auf der schwarzen Seite */
  dk += zart(T, [[-3.6, -94], [-3.2, -89], [-4, -84], [-5.6, -78], [-7, -70], [-7.8, -60], [-8.4, -49], [-9.4, -37], [-11, -26], [-13, -16], [-14.8, -8]], "#05070a", 1.1, 0.7);
  n += `<path d="${dD}" fill="#0a0c0f"/><g clip-path="url(#${T.id("dkc")})">${dk}</g>`;
  /* weiße Federspitzen greifen über die Grenze ins Schwarz (nicht umgekehrt) */
  const grenze = [[-3.4, -94], [-3, -90], [-3.8, -85], [-5.4, -79], [-6.8, -71], [-7.6, -61], [-8.2, -50], [-9.2, -38], [-10.8, -27], [-12.8, -17], [-14.6, -9], [-15.4, -4]];
  n += F ? linie(grenze.map(([x, y]) => [x + 0.5, y]), "#7a8ba2", 1, ` stroke-opacity=".3" filter="${blur(T, 0.4)}"`) : "";
  /* kühles Reflexlicht vom Eis knapp innerhalb der Bauchkante rechts unten, darunter weicher Kantenschatten */
  const bauchKante = [[26.4, -42], [25.6, -31], [23.4, -22.4], [20, -15.4], [15.6, -9.8], [10.4, -6.4], [4.4, -5.2]];
  n += F ? linie(bauchKante, "#8a9bb1", 2, ` stroke-opacity=".3" filter="${blur(T, 0.7)}"`) + linie(bauchKante.map(([x, y]) => [x - 0.7, y - 0.7]), "#dce6f0", 0.9, ` stroke-opacity=".55" filter="${blur(T, 0.5)}"`) : "";
  s += `<g filter="${vol(T, "rumpf", { weich: 8, tiefe: 4, umgebung: 0.4 })}">${silhouette(T, kD, "#f4f5f6", n)}</g>`;
  /* Bauchfedern überdecken die Fußwurzel, weicher Schatten auf dem Fuß */
  s += weich([[-4, -4.4], [4, -4.4], [10, -5.6], [12, -4.2], [4, -3.4], [-4, -3.4]], "#000", 0.55, 0.6);
  s += fein(T, `<g opacity=".5" filter="${blur(T, 0.1)}">${saum(T, [[14.8, -8.6], [10.6, -5.8], [4.6, -4.5], [-1.6, -4.4], [-7, -5.4]], 0.8, 0.25, "#aebccb", 1)}</g>`);

  /* ---- Flosse: Paddel am Schultergelenk, Vorderkante ragt über die Schwarz-Weiß-Grenze; Schlagschatten auf dem Weiß ---- */
  const flosse = [[-2.4, -93], [-1.2, -86], [-1.2, -78], [-2.2, -70], [-4, -63], [-6, -58.4], [-7.8, -56.4], [-9.6, -57.2], [-10.6, -61], [-11.4, -68], [-12, -77],
    [-12.2, -86], [-11, -93], [-6.8, -95.4]];
  let fg = F ? form(T, flosse.map(([x, y]) => [x + 1.6, y + 1.8]), "#8e9bae", ` filter="${blur(T, 1.1)}" opacity=".8"`) : "";
  let fl = weich([[-2.8, -88], [-2, -80], [-3, -70], [-5.2, -62], [-4, -68], [-3.2, -80]], "#5d6f88", 0.8, 0.6);   // Glanzband Vorderkante
  fl += weich([[-9.8, -88], [-10.6, -76], [-10, -64], [-8.2, -60], [-8.6, -72]], "#000", 0.4, 1.2);
  if (F) fl += `<rect x="-13" y="-96" width="13" height="40" fill="${lanzettMuster(T, "f", 0.42, 0.26, "#000", "#8ea1ba", 0.55, 0.45, "rotate(-6)")}" opacity=".5"/>`;
  fl += F ? linie([[-11.9, -86], [-11.3, -76], [-10.7, -66], [-9.8, -58.6]], "#c9d3de", 0.4, ` stroke-opacity=".18" filter="${blur(T, 0.15)}"`) : "";   // heller Hinterrand
  fg += `<g filter="${vol(T, "flosse", { weich: 2.2, tiefe: 2, umgebung: 0.45 })}">${silhouette(T, G(flosse), verlauf(T, "flosse", -12.2, -70, -1.2, -70, [[[-12.2, -70], "#2e3a4c"], [[-7, -70], "#1d2532"], [[-1.2, -70], "#151b25"]]), fl)}</g>`;
  s += `<g mask="${verlaufMaske(T, "fl", -15, -100, 17, 50, 0, -94.6, 0, -89, [[[0, -94.6], "#000"], [[0, -89], "#fff"]])}">${fg}</g>`;

  /* ---- Schnabel: First gleichmäßig leicht abwärts gebogen, Spitze stumpfer; Platte am Unterschnabel orange → rosa → lila ---- */
  const oben = [[10.2, -113], [14, -112.8], [17.6, -111.9], [20.2, -110.6], [21.5, -109.5], [21.6, -109.1, 1], [20.4, -109.6], [17.6, -110.3], [14, -110.8], [10.6, -110.95]];
  const unten = [[10.5, -110.95], [14, -110.8], [17.6, -110.3], [20.4, -109.6], [21.4, -109.2, 1], [20.4, -109.0], [17.6, -109.15], [14, -109.25], [10.4, -109.4]];
  s += T.koerper(G(unten), "#0f1013", { vol: false, rand: false, innen:
    form(T, [[10.8, -110.7], [14, -110.55], [16.6, -110.25], [17.9, -110.0, 1], [16, -109.85], [13.4, -109.8], [10.8, -109.9]], verlauf(T, "platte", 10.8, -110.3, 17.9, -110.1, [[[10.8, -110.3], "#f08a3a"], [[13.8, -110.3], "#e77aa0"], [[17.9, -110.1], "#b98ad0"]])) +
    fein(T, zart(T, [[11.4, -110.45], [14.2, -110.35], [16.6, -110.15]], "#fff", 0.06, 0.45)) });
  s += T.koerper(G(oben), verlauf(T, "oben", 0, -113, 0, -110.9, [[[0, -113], "#3e434b"], [[0, -112.1], "#16181b"], [[0, -110.9], "#07080a"]]), { vol: false, rand: false,
    innen: zart(T, [[11.4, -112.75], [14.8, -112.5], [18, -111.6], [20.4, -110.3]], "#9aa1ab", 0.14, 0.6) });
  s += zart(T, [[10.6, -110.95], [14, -110.8], [17.6, -110.3], [20.4, -109.6], [21.4, -109.2]], "#000", 0.1, 0.9);
  /* Mundwinkel: weiche dunkle Falte; Nasenloch; Kopffedern laufen weich auf den Schnabelgrund */
  s += weich([[9.8, -111.4], [11, -111.2], [11, -110.4], [9.8, -110.4]], "#000", 0.7, 0.3);
  s += zart(T, [[11.6, -112.3], [12.9, -112.2]], "#000", 0.1, 0.85);
  s += fein(T, saum(T, [[10.1, -113.4], [10.4, -112.4], [10.8, -111.2], [10.6, -109.9]], 0.3, 0.14, "#08090c", 1));

  /* ---- Auge: Iris dunkelbraun, feiner graublauer Lidrand (löst das Auge vom Schwarz), ein Glanzlicht oben vorn ---- */
  s += T.augeReal(4.8, -112, 0.8, { iris: "#3b2216", iris2: "#160a04", offen: 0.84, winkel: -6, lid: "#020203" });
  s += `<path d="M3.85 -111.85q1 .75 2.1 .05" fill="none" stroke="#5a6474" stroke-width=".08" stroke-opacity=".6"/>`;
  s += weich([[3.6, -113.6], [6, -113.8], [6.2, -113], [3.6, -112.9]], "#8396b0", 0.3, 0.4);
  return { svg: s, box: [-25.8, -117, 27, 0], fuesse: [-2, 6, 12], kopf: [-10, -119, 24, -88] };
}

/* =====================================================================
   WALROSS
   ===================================================================== */
/* RECHERCHE Walross (Odobenus rosmarus), Bulle: 2,7–3,6 m lang, 800–1700 kg (Kühe 2,3–3,1 m). Massiger,
   spindelförmiger Körper; Hals, Brust und Schultern gewaltig, der Körper verjüngt sich zu den Hinterflossen.
   An Land: liegt auf Bauch und Brust, die Vorderflossen stützen die Brust, die Hinterflossen können nach vorn
   unter den Körper gedreht werden (oder liegen nach hinten). Haut 2–4 cm dick, am Hals der Bullen bis 15 cm,
   stark gefaltet und runzlig, Farbe zimt-/rosabraun (Jungtiere dunkelbraun, alte Bullen fast rosa; im kalten
   Wasser fast weiß); Bullen mit „Bossen“ (Knoten/Beulen) an Hals und Schultern; spärliches, kurzes rötlich-braunes
   Haar; Narben. Kopf klein, rund, ohne Ohrmuschel (nur Gehöröffnung hinter dem Auge); Augen klein, oft blutunterlaufen,
   hoch und seitlich. Breites, fleischiges Schnauzenpolster (Mystacialpolster) mit 400–700 steifen, dicken,
   hell-cremefarbenen Vibrissen in 13–15 Reihen (bis 30 cm, vorn abgenutzt kürzer). Nasenlöcher oben auf der
   Schnauze (Halbmondschlitze). Stoßzähne = obere Eckzähne, bei beiden Geschlechtern, beim Bullen bis 1 m (sichtbar
   ~50 cm), elfenbeinfarben, an der Basis bräunlich, längsgerillt, Risse, abgenutzte Spitzen; treten unter dem
   Polster aus, hängen leicht nach hinten gebogen. Vorderflossen kurz, breit, fast quadratisch, fünf Finger mit
   winzigen Nägeln; Hinterflossen dreieckig mit Schwimmhaut, Krallen an den drei mittleren Zehen. Schwanz winzig. */
function walross(T) {
  let s = "";
  const F = T.fein !== false;
  const weich = (pts, farbe, op, sd) => weichForm(T, pts, farbe, op, sd);
  /* Hautfalte: breiter Schatten unter der Kerbe, dunkle schmale Kerbe (#5A2E22), heller Kamm darüber (Licht links oben) */
  const falte = (pts, w, op = 0.5) => {
    if (!F) return op >= 0.55 ? zart(T, pts, "#4a271c", w * 0.8, op * 0.7) : "";
    const ob = pts.map(([x, y]) => [x - w * 0.8, y - w * 1.1]);
    return linie(pts.map(([x, y]) => [x + w * 1.2, y + w * 1.5]), "#3e1c12", w * 4, ` stroke-opacity="${Z2(Math.min(1, op * 0.9))}" filter="${blur(T, w * 1.1)}"`) +
      zart(T, pts, "#5a2e22", w * 0.7, Math.min(1, op * 1.4)) + linie(ob, "#f3c3aa", w * 2.2, ` stroke-opacity="${Z2(Math.min(1, op * 0.85))}" filter="${blur(T, w * 0.7)}"`);
  };
  /* Umriss: Nacken/Schulter direkt hinter dem Kopf am höchsten und dicksten, der Rücken fällt in konvexem Bogen ab und
     bleibt über dem Becken bei ≈ 75 % der Höhe; erst im letzten Fünftel rund eingezogen. Kehle voll (kein Hals-Ausschnitt),
     Schnauze vorn fast senkrecht abgeschnitten (Bartpolster). Bauch liegt satt auf. */
  const rumpf = [
    [34, -28], [37, -46], [45, -62], [58, -76], [76, -88], [98, -99], [124, -109], [152, -117.6], [180, -124.4], [204, -129.6], [224, -133.4], [240, -135.2], [252, -135],
    [262, -133], [271, -131.6], [279.4, -129], [285.4, -125.4], [290, -122.8], [293.8, -120.6], [296.2, -116.6], [297.4, -110.6], [297.6, -103], [296.8, -96.6], [294.6, -91.8],
    [290.8, -89.2], [285, -88.2], [279, -87.8], [274.4, -86], [271.2, -82], [270, -76], [269.4, -69], [267.8, -61], [264.6, -53], [260, -45], [254, -37.4], [246.6, -30],
    [237.6, -23], [226, -16.4], [211, -10.2], [194, -5.6], [172, -2.6], [146, -1.2], [118, -1], [92, -1.4], [70, -2.8], [54, -5.6], [42, -11], [36, -19],
  ];
  const kD = G(rumpf);
  /* Grundfarbe: Rücken/Kopfoberseite dunkler, Bauch heller und matter */
  const haut = verlauf(T, "haut", 0, -136, 0, 0, [[[0, -136], "#8e5440"], [[0, -112], "#9b5f48"], [[0, -80], "#a86d55"], [[0, -46], "#b17a62"], [[0, -18], "#b98a70"], [[0, 0], "#a37a64"]]);
  const flosse = (n, hell) => verlauf(T, n, 0, -40, 0, 0, [[[0, -40], hell ? "#7e4f3e" : "#64402f"], [[0, -14], hell ? "#6c4436" : "#553528"], [[0, 0], hell ? "#4c3026" : "#3c261e"]]);

  /* ---- ferne Hinterflosse: nach hinten gestreckt, fleischiger Fächer, äußere Zehen länger (konkave Hinterkante), Nägel an den Enden ---- */
  const hfF = [[44, -31], [32, -33.4], [21, -35.6], [10.4, -38.6], [7.6, -37.4], [11.6, -33], [13, -27.6], [11.8, -22.4], [7.8, -16.6], [9.8, -15.2], [20, -15.4], [32, -16.2], [44, -18]];
  let hfi = weich([[42, -30], [24, -33], [12, -35.6], [22, -30], [40, -26]], "#c9927c", 0.5, 1) + weich([[42, -19], [22, -17], [10, -16.4], [24, -19.6], [42, -22]], "#2e1a12", 0.5, 1);
  for (let i = 0; i < 5; i++) hfi += falte([[42, -31 + i * 3.2], [30, -32.6 + i * 4], [20, -34 + i * 4.4], [10.4 + [0, 2.6, 3.4, 2.6, 0][i], -37.6 + i * 5.2]], 0.28, 0.35);
  hfi += `<path d="M10.8 -37.6l-1.6 -.6M12.2 -31.4l-1.6 -.4M12.8 -25.2l-1.6 0M11.6 -19.6l-1.4 .4M9 -16.4l-1.4 .6" stroke="#1d120d" stroke-width=".55" stroke-linecap="round"/>`;
  s += `<g filter="${vol(T, "hff", { weich: 3, tiefe: 3 })}">${silhouette(T, G(hfF), flosse("hfF", false), hfi)}</g>`;
  /* ---- ferne Vorderflosse ---- */
  const vfF = [[212, -28], [222, -22.4], [234, -16], [246, -10.6], [256, -7.2], [263, -5.6], [266, -3.8], [265.4, -1.6], [261, -0.2], [242, -0.1], [224, -0.6], [213, -5], [208, -16]];
  s += `<g filter="${vol(T, "vff", { weich: 3, tiefe: 3 })}">${silhouette(T, G(vfF), flosse("vfF", false), weich([[214, -4], [240, -1], [262, -1], [240, 0], [214, 0]], "#2e1a12", 0.45, 0.8) +
    fein(T, zart(T, [[238, -8], [250, -5], [260, -3]], "#3a2018", 0.25, 0.4)))}</g>`;

  /* ---- Stoßzähne: obere Eckzähne, treten an den Mundwinkeln unter der Oberlippe aus; leicht nach hinten gekrümmt,
          zylindrisch, Elfenbein mit ockerbrauner Basis, Längsrillen, stumpf abgeschliffene Spitzen ---- */
  const zahnD = (dx, ddx) => [[281.6 + dx, -91], [288.4 + dx, -90.6], [288 + dx, -76], [285.6 + dx + ddx * 0.3, -60], [282 + dx + ddx * 0.6, -45], [278.6 + dx + ddx, -36.4],
    [277.6 + dx + ddx, -35.2], [275.4 + dx + ddx, -35.4], [274.6 + dx + ddx, -37.4], [277.4 + dx + ddx * 0.6, -47], [280.4 + dx + ddx * 0.3, -61], [282.2 + dx, -76]];
  const zahnFarbe = (n, f) => verlauf(T, n, 274, 0, 289, 0, [[[274, 0], f ? "#bdb197" : "#e7dcc0"], [[278, 0], f ? "#d4c8ab" : "#f6efdb"], [[282, 0], f ? "#c8bb9c" : "#efe6cf"], [[286, 0], f ? "#9a8b6e" : "#c2b08c"], [[289, 0], f ? "#a6977a" : "#d6c7a6"]]);
  const zahnInnen = (f) => {
    let z = weich([[281, -91], [289, -91], [288.4, -80], [286, -74], [282.4, -76]], "#a6824e", f ? 0.55 : 0.6, 1.2);   // ockerbraune Basis
    if (F) {
      z += zart(T, [[283.4, -88], [283, -76], [281, -60], [277.6, -44]], f ? "#7d6c52" : "#a8946e", 0.12, 0.6) + zart(T, [[285.6, -88], [285.4, -76], [283.4, -61], [280.2, -46]], f ? "#7d6c52" : "#a8946e", 0.12, 0.55);
      z += zart(T, [[287, -86], [286.6, -74], [284.8, -62]], "#8a7756", 0.1, 0.5);
      if (!f) z += zart(T, [[285, -70], [286.8, -69.2]], "#6b5638", 0.08, 0.7) + zart(T, [[282.4, -56], [284.6, -55.4]], "#6b5638", 0.08, 0.7) + zart(T, [[276, -36.2], [277.6, -36.8], [278.6, -36]], "#9c8a68", 0.14, 0.8);
    }
    return z;
  };
  s += `<g filter="${vol(T, "zahnF", { weich: 1.2, tiefe: 3 })}">${silhouette(T, G(zahnD(-4.6, 2.2)), zahnFarbe("zahnF", true), zahnInnen(true))}</g>`;

  /* ---- Körper mit Kopf ---- */
  let n = `<rect x="30" y="-140" width="270" height="141" fill="${haut}"/>`;
  /* Farbwolken (weich, unregelmäßig): rosig an Hals und in den Falten, Rücken dunkler, Bauch heller */
  n += weich([[200, -116], [236, -130], [262, -124], [266, -96], [262, -70], [250, -50], [226, -56], [210, -84]], "#c47a64", 0.55, 8);
  n += weich([[60, -76], [120, -106], [180, -122], [150, -112], [100, -96], [70, -74]], "#7e4735", 0.4, 6);
  n += weich([[70, -40], [110, -60], [150, -66], [130, -48], [90, -34]], "#c48e74", 0.35, 8) + weich([[140, -90], [170, -100], [186, -84], [160, -80]], "#8a523e", 0.3, 7);
  /* Kernschatten der Flankenrundung (≈ 60 % der Höhe), darunter Reflexlicht vom Eis am Bauchrand */
  n += weich([[44, -24], [80, -34], [130, -40], [180, -44], [222, -48], [246, -50], [244, -36], [210, -28], [160, -20], [110, -16], [60, -14]], "#4a2418", 0.4, 6);
  n += weich([[70, -2.8], [120, -2], [180, -3.6], [220, -8], [180, -6], [120, -4.4], [76, -4.6]], "#d9c6c4", 0.6, 1.2);
  /* Okklusion: unter dem Kinn, am Flossenansatz */
  n += weich([[264, -88], [278, -87.4], [272, -82], [266, -80]], "#2a140e", 0.6, 1.6) + weich([[212, -38], [234, -34], [244, -24], [224, -18], [210, -24]], "#2a140e", 0.5, 3);
  /* Hautrelief in drei Stufen: tief an Hals/Schulter, mittel an der Flanke, fast glatt am Bauch (Licht-Karte, multipliziert) */
  if (F) {
    const mx = verlaufMaske(T, "relx", 30, -140, 270, 141, 60, 0, 240, 0, [[[60, 0], "#000"], [[120, 0], "#444"], [[190, 0], "#999"], [[240, 0], "#fff"]]);
    const my = verlaufMaske(T, "rely", 30, -140, 270, 141, 0, -60, 0, -10, [[[0, -60], "#fff"], [[0, -10], "#000"]]);
    const rr = (art, op) => `<rect x="30" y="-138" width="270" height="138" fill="${reliefKachel(T, "haut" + art, { f: 0.3, tiefe: 0.55, seed: 11, art, k: 1.5, kachel: 40 })}" opacity="${op}"/>`;
    n += `<g mask="${my}"><g mask="${mx}">${rr("schatten", 0.55)}${rr("licht", 0.4)}</g></g>`;
  }
  /* Falten: viele unregelmäßige Runzeln unterschiedlicher Länge (4–26 cm), teils verzweigt, am dichtesten an Halsbasis und
     Schulter, zur Flanke hin seltener; Richtung folgt den Halsringen (steil), an Kehle und Brust quer. Je Stärkeklasse
     EIN Pfad für Schatten, Kerbe und Kamm (klein trotz vieler Falten). */
  {
    const kl = [{ w: 0.75, op: 0.42, s: "", k: "", c: "" }, { w: 1.3, op: 0.58, s: "", k: "", c: "" }];
    /* Falte als Quadratkurve durch Anfang, Mitte, Ende (relativ – kurz) */
    const qk = (p, dx, dy) => { const [a0, m, e] = [p[0], p[Math.floor(p.length / 2)], p[p.length - 1]]; const cx = 2 * m[0] - (a0[0] + e[0]) / 2, cy = 2 * m[1] - (a0[1] + e[1]) / 2;
      return `M${J(a0[0] + dx, a0[1] + dy)}q${J(cx - a0[0], cy - a0[1], e[0] - a0[0], e[1] - a0[1])}`; };
    const dazu = (pts, c) => { const q = kl[c], w = q.w; q.s += qk(pts, w * 1.2, w * 1.5); q.k += qk(pts, 0, 0); q.c += qk(pts, -w * 0.8, -w * 1.1); };
    const zone = [[170, -118], [228, -133.6], [258, -134], [262, -118], [264, -96], [266, -82], [262, -60], [252, -46], [232, -44], [200, -50], [176, -70], [166, -96]];
    const ziel = F ? 40 : 10;
    for (let i = 0, v = 0; i < ziel && v < 600; v++) {
      const x = 192 + T.rnd() * 74, y = -134 + T.rnd() * 90;
      if (!inPoly(x, y, zone)) continue;
      if (T.rnd() > 0.15 + 0.85 * Math.max(0, 1 - Math.abs(x - 238) / 50)) continue;   // dichter an der Halsbasis
      const quer = x > 255 && y > -92, L = 4 + Math.pow(T.rnd(), 1.4) * (quer ? 10 : 22);
      const a = ((quer ? 172 : 96 + (x - 230) * 0.5) + (T.rnd() - 0.5) * 34) * Math.PI / 180, b = (T.rnd() - 0.5) * L * 0.35;
      const dx = Math.cos(a), dy = Math.sin(a), px = -dy, py = dx;
      const pts = [0, 0.33, 0.66, 1].map((t, j) => [x + dx * L * t + px * b * Math.sin(Math.PI * t) + (T.rnd() - 0.5) * 0.6 * (j % 3 ? 1 : 0), y + dy * L * t + py * b * Math.sin(Math.PI * t)]);
      const c = L > 11 || T.rnd() < 0.3 ? 1 : 0;
      if (!F && c === 0) { i++; continue; }
      dazu(pts, c);
      if (F && T.rnd() < 0.14) { const m = pts[1], a2 = a + (T.rnd() < 0.5 ? 0.7 : -0.7), L2 = L * 0.4; dazu([m, [m[0] + Math.cos(a2) * L2 * 0.5, m[1] + Math.sin(a2) * L2 * 0.5], [m[0] + Math.cos(a2) * L2, m[1] + Math.sin(a2) * L2]], 0); }
      i++;
    }
    for (const q of kl) {
      if (!q.k) continue;
      n += F ? `<path d="${q.s}" fill="none" stroke="#3e1c12" stroke-width="${Z2(q.w * 4)}" stroke-opacity="${Z2(q.op * 0.85)}" stroke-linecap="round" filter="${blur(T, q.w * 1.1, 0.1)}"/>` +
        `<path d="${q.k}" fill="none" stroke="#5a2e22" stroke-width="${Z2(q.w * 0.5)}" stroke-opacity="${Z2(Math.min(1, q.op * 1.2))}" stroke-linecap="round"/>` +
        `<path d="${q.c}" fill="none" stroke="#eab098" stroke-width="${Z2(q.w * 3.2)}" stroke-opacity="${Z2(q.op * 0.75)}" stroke-linecap="round" filter="${blur(T, q.w * 1, 0.1)}"/>`
        : `<path d="${q.k}" fill="none" stroke="#4a271c" stroke-width="${Z2(q.w * 0.8)}" stroke-opacity=".45" stroke-linecap="round"/>`;
    }
  }
  /* große, weiche Fettwülste an Flanke und Hüfte (Kamm hell, darunter weiche Kerbe) */
  n += weich([[100, -30], [150, -38], [200, -44], [196, -40], [150, -33], [104, -26]], "#4a2418", 0.35, 2.4) + weich([[100, -34], [150, -43], [196, -49], [190, -46], [150, -40], [104, -31]], "#d89a80", 0.35, 2.4);
  n += weich([[120, -96], [150, -104], [170, -104], [150, -98], [124, -90]], "#4a2418", 0.25, 2.4) + weich([[120, -99], [150, -107], [170, -107], [150, -101], [124, -93]], "#d89a80", 0.25, 2.4);
  /* schwere, quer laufende Kehlfalten */
  n += falte([[270.4, -80], [265, -77.6], [258.6, -78.4]], 1, 0.6) + falte([[269.6, -70], [262.4, -67.4], [255.4, -68]], 1.1, 0.6) + falte([[267, -59], [259.6, -56], [252.4, -56.8]], 1, 0.5);
  /* Schulter-/Achselfalte über der Vorderflosse (Fettwulst) */
  n += falte([[238, -48], [230, -42.4], [218, -39.6], [208, -40]], 1, 0.5);
  /* Tuberkel (Bossen) an Hals und Schulter: Licht oben links, Schatten unten rechts, Glanzpunkt */
  const bossen = [[212, -108, 3.4], [221, -97, 4], [229, -86, 3.4], [234, -106, 3], [241.6, -97, 2.8], [224, -73, 3.2], [236, -71, 2.8], [204, -93, 3.6], [213, -81, 3],
    [246.6, -111, 2.4], [249, -85, 2.4], [241, -61, 2.6], [200, -105, 2.8], [228, -116, 2.6], [207, -69, 2.8], [195, -82, 2.6], [229.6, -56, 2.4], [218, -124, 2.4]];
  if (F) {
    let gl = "";
    for (const [x, y, rr] of bossen) {
      n += fleck(T, x + rr * 0.45, y + rr * 0.55, rr * 1.2, rr * 0.85, "#4a2418", 0.5, -20) + fleck(T, x - rr * 0.25, y - rr * 0.3, rr * 0.95, rr * 0.75, "#efb59c", 0.45, -20);
      gl += `M${J(x - rr * 0.35, y - rr * 0.42)}h.01`;
    }
    n += `<path d="${gl}" stroke="#ffe8da" stroke-width=".45" stroke-linecap="round" stroke-opacity=".3"/>`;
  }
  /* Narben: helle, leicht erhabene Striche (Kämpfe mit Stoßzähnen) */
  n += zart(T, [[216, -102], [224, -95], [229, -92]], "#e8c0aa", 0.5, 0.35) + zart(T, [[244, -90], [247, -81]], "#e8c0aa", 0.4, 0.3);
  /* spärliche kurze Haare, heller als die Haut, nach hinten; auf der Lichtseite sichtbar */
  n += haare(T, [[50, -50], [100, -96], [170, -122], [230, -134], [262, -134], [256, -118], [200, -110], [130, -92], [70, -60]], 70, (x, y) => 172 + (x - 150) * 0.03, 0.5,
    [["#e9b89e", 1, 0.07, 0.5], ["#5a3022", 0.5, 0.06, 0.35]], 20, 0.3, 0.04);
  /* Kopf: Stirnwulst, Augenhöhle; Bartpolster geschwollen mit zwei Backenwölbungen, Glanz oben, Mundspalte darunter im Schatten */
  n += weich([[258, -128], [268, -130], [276, -126], [270, -124], [260, -124]], "#e8b29a", 0.5, 1.2);
  const polster = [[281, -125], [287, -123.4], [292.4, -121], [296, -116.6], [297.2, -110.6], [297.4, -103], [296.6, -96.6], [294.4, -91.8], [290, -89.6], [283.6, -89.6], [278.6, -92.6], [276.6, -100], [276.8, -110], [278, -119]];
  n += weich([[281, -123], [292, -120], [296, -113], [292, -108], [282, -112]], "#e9b09a", 0.6, 1.6);   // obere Wölbung, Glanz
  n += weich([[280, -104], [292, -102], [296, -96], [290, -92], [281, -95]], "#d79d86", 0.5, 1.4);       // untere Wölbung
  n += weich([[278, -107.6], [292, -107], [296.4, -105.6], [290, -105], [279, -105]], "#6a3428", 0.35, 0.8);   // Kerbe zwischen den Wölbungen
  n += weich([[287, -122.6], [293, -119.6], [295.4, -116.4], [291, -118.6]], "#fde3d6", 0.55, 0.6);
  n += weich([[276, -92], [292, -90.8], [295, -91.6], [286, -88.6], [276, -89]], "#2a140e", 0.55, 0.8);   // Mundspalte im Schatten
  s += silhouette(T, kD, haut, n) + volSchicht(T, "rumpf", kD, { weich: 12, schatten: "#2a1008", licht: "#ffd2bb", ks: 0.6, kl: 0.4 });

  /* ---- naher Stoßzahn mit Lippenmanschette ---- */
  s += `<g filter="${vol(T, "zahn", { weich: 1.3, tiefe: 3.2 })}">${silhouette(T, G(zahnD(0, 0)), zahnFarbe("zahn", false), zahnInnen(false))}</g>`;
  const lippe = [[279.6, -96], [286, -96.6], [290.4, -95], [290.4, -91], [288.2, -88.6], [282, -88.4], [279, -91]];
  s += `<g filter="${vol(T, "lippe", { weich: 1.4, tiefe: 3 })}">${silhouette(T, G(lippe), verlauf(T, "lippe", 0, -96, 0, -88, [[[0, -96], "#ad6d55"], [[0, -88], "#7a4232"]]),
    weich([[281, -94], [288, -94.6], [290, -92], [284, -92]], "#f0b8a0", 0.5, 0.6) + fein(T, zart(T, [[281, -89.6], [285, -88.8], [289, -89.4]], "#4a2418", 0.3, 0.6)))}</g>`;
  s += weich([[282, -88.4], [288.4, -88], [288, -85], [282.6, -85.6]], "#3a1a10", 0.5, 0.6);   // Schatten der Lippe auf dem Zahn

  /* Haarbälge (Follikel) in Reihen auf dem Bartpolster */
  const vorne = (y) => 297.4 - Math.pow((y + 104) / 15, 2) * 3.2;
  if (F) {
    let d = "";
    for (let r = 0; r < 9; r++) for (let i = 0; i < 11; i++) {
      const y = -120.4 + (i + 0.5) / 12 * 29.6 + r * 0.25, x = vorne(y) - 1.1 - r * 1.35 + (T.rnd() - 0.5) * 0.3;
      if (inPoly(x, y, polster)) d += `M${J(x, y)}h.01`;
    }
    s += `<path d="${d}" stroke="#6a3426" stroke-width=".55" stroke-linecap="round" stroke-opacity=".6"/>`;
  }
  /* ---- Vibrissen: 12–14 Reihen dicker, steifer Borsten; jede wurzelt im Follikel, verjüngt sich, alle nach vorn unten
          gebogen; vorn abgenutzt kürzer, hinten und unten länger; hornfarben mit bräunlicher Basis und Glanzkante ---- */
  {
    let dS = "", dH = "";
    const rows = F ? 10 : 5, per = F ? 10 : 6;
    for (let r = 0; r < rows; r++) for (let i = 0; i < per; i++) {
      const t = (i + 0.5) / per, y = -120.4 + t * 29.6 + r * (F ? 0.25 : 0.6), x = vorne(y) - 1.1 - r * (F ? 1.35 : 3.5) + (T.rnd() - 0.5) * 0.3;
      if (!inPoly(x, y, polster)) continue;
      const rr = r / (rows - 1);
      const L = (2.2 + rr * 3 + t * 2.2 + T.rnd() * 2) * (t < 0.15 ? 0.7 : 1), a = (34 + t * 40 + (T.rnd() - 0.5) * 8) * Math.PI / 180;
      const w = 0.3 + 0.12 * (1 - rr), ca = Math.cos(a), sa = Math.sin(a), nx = -sa, ny = ca;
      const ex = x + ca * L + L * 0.06, ey = y + sa * L + L * 0.16, mx = x + ca * L * 0.5 + nx * L * 0.06, my = y + sa * L * 0.5 + ny * L * 0.06 + L * 0.03;
      dS += `M${J(x - nx * w, y - ny * w)}Q${J(mx - nx * w * 0.7, my - ny * w * 0.7, ex - nx * w * 0.3, ey - ny * w * 0.3)}L${J(ex + nx * w * 0.3, ey + ny * w * 0.3)}Q${J(mx + nx * w * 0.7, my + ny * w * 0.7, x + nx * w, y + ny * w)}z`;
      if (F && T.rnd() < 0.35) dH += `M${J(x - nx * w * 0.5, y - ny * w * 0.5)}Q${J(mx - nx * w * 0.4, my - ny * w * 0.4, x + ca * L * 0.8 + L * 0.03, y + sa * L * 0.8 + L * 0.1)}`;
    }
    s += `<path d="${dS}" fill="#e8ddbf" stroke="#7a6240" stroke-width=".05" stroke-opacity=".55"/>` + (dH ? `<path d="${dH}" fill="none" stroke="#fffaf0" stroke-width=".07" stroke-opacity=".8"/>` : "");
  }

  /* ---- Nasenlöcher oben auf der Schnauzenfront: zwei kurze, gebogene Schlitze ---- */
  s += `<path d="M286.6 -123.6q2.2 -.4 3.3 1.1q-1.6 -.4 -3.1 -.3zM289.8 -121.6q1.8 -.1 2.5 1.3q-1.3 -.5 -2.4 -.5z" fill="#3a1810" opacity=".85"/>`;
  s += zart(T, [[286.2, -124.6], [290, -123.8]], "#f5d2c0", 0.22, 0.5);

  /* ---- Auge: klein, hoch, in leicht vortretender fleischiger Höhle; rosig-roter Lidrand, gerötete Bindehaut ---- */
  s += weich([[262, -123.6], [270, -124.4], [272, -120], [264, -118.6]], "#c88a72", 0.55, 1.2) + weich([[263, -117.6], [270.6, -117.4], [270, -115.6], [264, -116]], "#4a2418", 0.4, 0.8);
  s += T.augeReal(266.6, -119.6, 1.15, { iris: "#4a2412", iris2: "#1e0c06", offen: 0.6, winkel: -8, weiss: true, lid: "#9c4a40", haut: "#9c4a40" });
  s += `<ellipse cx="268.1" cy="-119.6" rx=".45" ry=".3" fill="#b0503e" opacity=".75"/>`;
  s += fein(T, falte([[260.6, -124.6], [264.6, -125.6], [268.2, -125]], 0.35, 0.45) + falte([[264.6, -115.4], [268, -115]], 0.3, 0.3));
  /* Gehöröffnung hinter dem Auge (keine Ohrmuschel): kleiner Schlitz in einer Hautfalte */
  s += zart(T, [[251.6, -118.4], [252.4, -117]], "#2a140e", 0.5, 0.85) + fein(T, falte([[250, -120.6], [253, -120.8], [254.4, -118.6]], 0.3, 0.35));

  /* ---- nahe Hinterflosse: nach vorn unter das Becken gedreht, Sohle auf dem Boden; dicker Hautwulst am Ansatz ---- */
  const hf = [[34, -14], [44, -17], [56, -17.4], [68, -15.4], [78, -12.4], [85.4, -10], [87.4, -7.6], [86.6, -6], [89.4, -4.8], [89.8, -2.8], [87.6, -1.8], [88.6, -0.6], [86, -0.1], [60, -0.1], [40, -0.4], [32, -4]];
  let hi = weich([[38, -15], [56, -16], [76, -12], [62, -12], [40, -11]], "#a26b56", 0.5, 1.4) + weich([[40, -2], [70, -1.4], [88, -1.2], [70, 0], [40, 0]], "#2e170f", 0.55, 0.8);
  for (let i = 0; i < 5; i++) hi += falte([[60, -15.6 + i * 2.6], [72, -13.6 + i * 2.4], [80, -11.4 + i * 2.1], [86 + [-0.4, 0.8, 2, 2.2, 1.4][i], -9.6 + i * 2.1]], 0.28, 0.4);
  hi += falte([[48, -16.4], [46, -10], [47, -3]], 0.5, 0.45) + falte([[40, -15], [38, -8]], 0.45, 0.35);
  if (F) hi += `<rect x="30" y="-18" width="62" height="18" fill="${reliefKachel(T, "sohle", { f: 0.7, tiefe: 0.35, seed: 2, k: 1.4, kachel: 20 })}" opacity=".4"/>`;
  s += `<g filter="${vol(T, "hf", { weich: 3.4, tiefe: 3 })}">${silhouette(T, G(hf), flosse("hf", true), hi)}</g>`;
  s += `<path d="M86.6 -8.6l1.5 -.2M88.6 -5.4l1.4 0M89.4 -3.2l1.3 .2" stroke="#1d120d" stroke-width=".55" stroke-linecap="round"/>`;
  s += weich([[30, -15.4], [44, -18.6], [58, -19], [44, -16.4], [32, -13]], "#2a140e", 0.5, 1.2);   // Wulstschatten des Beckens

  /* ---- nahe Vorderflosse: kurz, breit, sichtbar dick (Oberseite hell, Kante dunkel), fünf Nägel vor den Zehen,
          Fettfalte darüber mit Schatten ---- */
  const vf = [[220, -38], [230, -34], [240, -27.4], [250, -20.6], [258, -15.6], [266, -12], [272, -10], [276.4, -8.4], [277.4, -6.4], [276.4, -4.4], [277.4, -2.6], [276, -0.6], [268, -0.1],
    [250, -0.1], [234, -0.4], [224, -2.6], [217, -8], [213, -18], [213, -30]];
  let vi = weich([[222, -35], [240, -25], [262, -14], [274, -9.6], [262, -10.4], [240, -21], [224, -30]], "#a26b56", 0.5, 1.4);
  vi += weich([[218, -6], [250, -2.4], [276, -2], [250, 0], [218, -1]], "#3a2018", 0.6, 1) + weich([[214, -28], [222, -32], [226, -22], [218, -14]], "#2e170f", 0.45, 2);
  vi += weich([[226, -16], [248, -9], [268, -5.4], [250, -5], [228, -9]], "#8a5d4c", 0.35, 2);
  for (let i = 0; i < 4; i++) vi += falte([[240 + i * 1.6, -21.6 + i * 3.4], [254 + i * 2, -13.6 + i * 2.2], [266 + i * 2.2, -9 + i * 1.4], [274 + i * 0.8, -7.4 + i * 1.4]], 0.28, 0.4);
  vi += falte([[222, -33], [218, -22], [219.6, -10]], 0.55, 0.4);
  if (F) vi += `<rect x="210" y="-40" width="70" height="40" fill="${reliefKachel(T, "sohle", { f: 0.7, tiefe: 0.35, seed: 2, k: 1.4, kachel: 20 })}" opacity=".4"/>`;
  s += `<g mask="${verlaufMaske(T, "vf", 205, -44, 80, 46, 226, -36, 230, -28, [[[226, -36], "#000"], [[230, -28], "#fff"]])}"><g filter="${vol(T, "vf", { weich: 3.4, tiefe: 3 })}">${silhouette(T, G(vf), flosse("vf", true), vi)}</g></g>`;
  s += `<path d="M276.2 -8.2l1.6 .1M277.4 -6.2l1.5 .2M277.6 -4.4l1.4 .3M277.8 -2.6l1.3 .4M277 -.9l1.2 .5" stroke="#1d120d" stroke-width=".6" stroke-linecap="round"/>`;
  /* Bauch liegt auf: schmaler, dunkler Kontaktschatten */
  s += weich([[50, -0.8], [120, -1.2], [200, -2.4], [236, -1.6], [200, 0.4], [120, 0.6], [52, 0.4]], "#1a0d08", 0.65, 0.8);
  return { svg: s, box: [7.6, -135.2, 297.6, 0], kopf: [240, -140, 302, -30] };
}

/* =====================================================================
   SEEHUND
   ===================================================================== */
/* RECHERCHE Seehund (Phoca vitulina) – Websuche-Kontingent der Sitzung war erschöpft, daher aus Fachwissen
   (Säugetier-Bestimmungsbücher): 1,4–1,9 m, 50–150 kg. An Land liegt er auf dem Bauch in der typischen
   „Bananenhaltung“: Kopf und Hinterflossen angehoben. Rundlicher Kopf, kurze, breite Schnauze mit deutlichem
   Stirnabsatz („Hundegesicht“), Nasenlöcher V-förmig an der Schnauzenspitze, keine Ohrmuschel (kleine Öffnung
   hinter dem Auge), große, runde, fast schwarze Augen, kräftige helle, gewellte („perlschnurartige“) Tasthaare.
   Fell kurz, glatt anliegend; Färbung silbergrau bis graubraun mit vielen kleinen dunklen Flecken und Ringen,
   Rücken dunkler, Bauch heller. Vorderflossen kurz mit fünf kräftigen dunklen Krallen; Hinterflossen fächerförmig,
   werden nicht unter den Körper gedreht (Hundsrobbe) und an Land nachgeschleppt oder angehoben. */
function seehund(T) {
  let s = "";
  const F = T.fein !== false;
  const weich = (pts, farbe, op, sd) => weichForm(T, pts, farbe, op, sd);
  /* Bananenhaltung: Kopf gehoben (kurzhalsig), Rumpf walzenförmig, über das letzte Viertel gleichmäßig zum Becken
     verjüngt (≈ 55 % der Rumpfhöhe am „Fußgelenk“), Hinterflossen ohne Stufe angesetzt und leicht angehoben.
     Kopf rund mit Stirnabsatz, kurze stumpfe Schnauze, wulstige Schnurrhaarpolster. */
  const rumpf = [
    [16, -20.6], [24, -25.4], [34, -30.4], [46, -34.8], [60, -38.4], [76, -41], [96, -43], [114, -44.6], [128, -47], [138, -50.8], [145, -55], [150.6, -58.4], [156.4, -60.4], [162, -60], [166.2, -57.8], [168.4, -54.8],
    [170.2, -52], [172.8, -50.8], [175.4, -49.6], [177, -47.6], [177.6, -45], [176.8, -42.4], [174.6, -40.4], [171.4, -38.8], [167.2, -37.8],
    [162.6, -36.4], [157.4, -33.4], [152, -29], [146, -23], [139.6, -16.4], [131, -10], [118, -4.8], [100, -1.6], [78, -1], [60, -1.8], [46, -4.6], [34, -8.6], [24, -12.6], [17.6, -16.4],
  ];
  const kD = G(rumpf);
  const fell = verlauf(T, "fell", 0, -58, 0, 0, [[[0, -58], "#5d6167"], [[0, -46], "#6e7279"], [[0, -32], "#8f8e8a"], [[0, -18], "#b6b0a5"], [[0, -6], "#a59f94"], [[0, 0], "#8f8a80"]]);

  /* ---- Hinterflossen: zwei, Sohle an Sohle, die hintere 15 % dunkler; fünf Zehenstrahlen, 1. und 5. am längsten
          (halbmondförmige Hinterkante), Krallen an den Zehenspitzen, Schwimmhaut heller ---- */
  const hfPts = (dy, dx) => [[30 + dx, -26 + dy], [22 + dx, -29.6 + dy], [14 + dx, -33 + dy], [6.4 + dx, -36.8 + dy], [3 + dx, -38.6 + dy], [5.6 + dx, -35 + dy], [5.8 + dx, -31 + dy],
    [4.6 + dx, -27.4 + dy], [1.6 + dx, -23.8 + dy], [6.4 + dx, -22.2 + dy], [14 + dx, -20.4 + dy], [22 + dx, -17.8 + dy], [30 + dx, -14 + dy]];
  const flosse = (dy, dx, fern) => {
    const p = hfPts(dy, dx);
    let i = weich([[28 + dx, -24 + dy], [16 + dx, -30 + dy], [6 + dx, -36 + dy], [14 + dx, -27 + dy], [26 + dx, -20 + dy]], "#c7c4bd", fern ? 0.2 : 0.35, 0.8);
    for (let k = 0; k < 5; k++) i += zart(T, [[28 + dx, -21.6 + dy + k * 0.4], [18 + dx, -25.6 + dy + k * 1.4], [10 + dx, -30.2 + dy + k * 2.6], [[3.6, 5.2, 5.6, 4.6, 2.2][k] + dx, -37.6 + dy + k * 3.4]], "#24221f", 0.32, 0.55);
    i += fein(T, haare(T, p, 60, 190, 0.8, [["#d0cdc6", 1, 0.05, 0.4]], 10, 0.1));
    i += `<path d="M${J(4 + dx, -37.8 + dy)}l-1.7 -.7M${J(6 + dx, -34.2 + dy)}l-1.4 -.3M${J(5.8 + dx, -30.4 + dy)}l-1.4 0M${J(4.6 + dx, -27 + dy)}l-1.4 .3M${J(2.4 + dx, -23.8 + dy)}l-1.6 .5" stroke="#121110" stroke-width=".5" stroke-linecap="round"/>`;
    return `<g filter="${vol(T, "hf" + (fern ? "f" : "n"), { weich: 1.8, tiefe: 3 })}">${silhouette(T, G(p), verlauf(T, "shf" + (fern ? "f" : "n"), 0, -38 + dy, 0, -14 + dy, [[[0, -38 + dy], fern ? "#5a5752" : "#6e6a64"], [[0, -14 + dy], fern ? "#3e3c38" : "#4e4a45"]]), i)}</g>`;
  };
  s += flosse(-2.6, -4.6, true) + flosse(0, -6.6, false);

  let n = `<rect x="0" y="-60" width="182" height="61" fill="${fell}"/>`;
  /* weiches Glanzband entlang des Rückens (anliegendes Fell glänzt), Kernschatten ≈ 65 % der Höhe, Reflexlicht am Boden */
  n += weich([[30, -27], [56, -36.6], [96, -41.6], [128, -45.4], [146, -53.4], [158, -57], [150, -51], [128, -41], [96, -37], [58, -32], [34, -23]], "#d9dce0", 0.45, 1.6);
  n += weich([[34, -10], [70, -14], [110, -15], [136, -19], [146, -26], [132, -10], [104, -4], [60, -4]], "#3a3530", 0.4, 3);
  n += weich([[54, -1.4], [100, -1.8], [124, -5], [100, -0.4], [56, -0.4]], "#dfe3e8", 0.55, 0.8);
  n += weich([[150, -31.6], [160, -36], [170, -38.6], [160, -34.6], [152, -29]], "#2e2a26", 0.4, 1.2);   // Kehle unter dem Kopf
  /* Fleckenmuster: dichte, unregelmäßige Tupfen, Komma-/Y-Formen, zusammenfließende Gruppen und Ringflecken mit hellem
     Hof; Rücken dicht, Bauch fast frei; zur Rücken- und Bauchkontur hin gestaucht (Verkürzung über die Rundung) */
  {
    let dF = "", dR = "", dH = "";
    const k = F ? 900 : 200;
    const oben = (x) => { for (let i = 0; i < rumpf.length - 1; i++) if (rumpf[i][0] <= x && rumpf[i + 1][0] > x) return rumpf[i][1]; return -44; };
    for (let i = 0; i < k; i++) {
      const x = 28 + T.rnd() * 144, y = -2 - T.rnd() * 58;
      if (!inPoly(x, y, rumpf) || (x > 162 && y > -50) || Math.hypot(x - 160.6, y + 51) < 3.4 || x > 170) continue;
      const top = oben(x), rel = Math.max(0, Math.min(1, (y - top) / -top));   // 0 = Rückenlinie, 1 = Boden
      if (T.rnd() > 0.95 - rel * 1.1) continue;
      const stauch = Math.max(0.35, Math.min(1, rel * 4)) * Math.max(0.5, Math.min(1, (1 - rel) * 3));
      const r = (0.3 + Math.pow(T.rnd(), 1.6) * 1.1) * (x > 144 ? 0.6 : 1), ry = r * (0.45 + T.rnd() * 0.35) * stauch, dreh = Math.round(-10 + (T.rnd() - 0.5) * 50);
      const u = T.rnd();
      if (u < 0.16 && r > 0.6 && F) {
        dR += `M${J(x - r, y)}a${J(r, ry * 1.2, dreh)} 0 1 ${J(2 * r, 0)}a${J(r, ry * 1.2, dreh)} 0 1 ${J(-2 * r, 0)}`;
        dH += `M${J(x - r * 0.5, y)}a${J(r * 0.5, ry * 0.6, dreh)} 0 1 ${J(r, 0)}a${J(r * 0.5, ry * 0.6, dreh)} 0 1 ${J(-r, 0)}`;
      } else if (u < 0.36) {   // Komma/Y: zwei bis drei verbundene Tupfen
        for (let j = 0; j < 2 + (u < 0.24 ? 1 : 0); j++) { const xx = x + j * r * 1.1 * (j === 2 ? -0.3 : 1), yy = y + (j === 2 ? -r * 0.9 : j * r * 0.5) * stauch, rr = r * (1 - j * 0.25); dF += `M${J(xx - rr, yy)}a${J(rr, rr * 0.6 * stauch, dreh)} 0 1 ${J(2 * rr, 0)}a${J(rr, rr * 0.6 * stauch, dreh)} 0 1 ${J(-2 * rr, 0)}`; }
      } else dF += `M${J(x - r, y)}a${J(r, ry, dreh)} 0 1 ${J(2 * r, 0)}a${J(r, ry, dreh)} 0 1 ${J(-2 * r, 0)}`;
    }
    const sb = F ? ` filter="${blur(T, 0.1, 0.1)}"` : "";
    n += (dH ? `<path d="${dR}" fill="#2a292a" fill-opacity=".55"${sb}/><path d="${dH}" fill="#a3a7ab" fill-opacity=".7"${sb}/>` : "") + `<path d="${dF}" fill="#2a292a" fill-opacity=".6"${sb}/>`;
  }
  /* Kopf: Stirn und Scheitel dunkler, Schnurrhaarpolster heller und wulstig mit Glanz, Augenumgebung leicht dunkler */
  n += weich([[148, -57], [158, -60], [166, -56], [158, -54], [150, -53]], "#3d4046", 0.35, 1.2);
  n += weich([[168.6, -48.6], [176, -47.6], [177.6, -44], [174, -39.6], [167.8, -40.8]], "#c8c3ba", 0.6, 1);
  n += weich([[169.6, -48.4], [174.6, -47.6], [175, -45.6], [170.6, -46]], "#f2efe9", 0.55, 0.6) + weich([[168.4, -41.4], [174, -40.8], [173, -39.4], [168.6, -39.6]], "#3a3632", 0.35, 0.6);
  n += weich([[166.6, -40], [172.4, -39.8], [172, -38.6], [167, -38.6]], "#2a2622", 0.45, 0.5);   // Maulspalte im Schatten unter dem Polster
  /* Fell: kurz, anliegend, in Wuchsrichtung (Kopf nach hinten, Hals der Biegung folgend, Flanke nach hinten unten) */
  const wuchs = (x, y) => (x > 150 ? 180 + (y + 48) * 2 : x > 128 ? 160 + (y + 40) * 0.6 : 178 + (y + 25) * -0.5);
  n += haare(T, rumpf.filter((p) => p[0] < 172), 900, wuchs, 0.9, [["#2e2d2c", 1, 0.05, 0.16], ["#f2efe8", 0.9, 0.045, 0.22]], 10, 0.1, 0.04);
  s += `<g filter="${vol(T, "rumpf", { weich: 7, tiefe: 5, umgebung: 0.35 })}">${silhouette(T, kD, fell, n)}</g>`;
  /* Fellflaum an der Kontur */
  s += haarSaum(T, rumpf.slice(0, 13), 160, 0.5, [["#6c7078", 1, 0.045, 0.6]], -1, -0.6);

  /* ---- Vorderflosse: kurz, Spitze breiter, fünf kräftige dunkle Krallen; Fellfalte am Ansatz ---- */
  const vf = [[123, -18], [130, -14.2], [135.6, -9.8], [139, -6], [140.6, -3], [139.6, -1], [133, -0.6], [126, -2.4], [121, -6.4], [119, -12]];
  let vi = weich([[124, -15], [133, -10.6], [139, -5], [132, -8], [124, -12]], "#ece9e2", 0.4, 0.8) + weich([[120, -4], [132, -1.4], [140, -1.4], [128, 0], [120, -2]], "#2e2b28", 0.5, 0.8);
  vi += haare(T, vf, 120, 40, 0.7, [["#2e2d2c", 1, 0.05, 0.3], ["#f2efe8", 0.7, 0.05, 0.3]], 12, 0.1, 0.05);
  s += `<g mask="${verlaufMaske(T, "svf", 112, -22, 34, 24, 120, -17, 124, -12, [[[120, -17], "#000"], [[124, -12], "#fff"]])}"><g filter="${vol(T, "svf", { weich: 1.6, tiefe: 3 })}">${silhouette(T, G(vf), verlauf(T, "svf", 0, -18, 0, 0, [[[0, -18], "#a29e96"], [[0, 0], "#706c65"]]), vi)}</g></g>`;
  s += F ? zart(T, [[121, -15], [125, -17.4], [130, -16.6]], "#3a3632", 0.5, 0.35) : "";
  s += `<path d="M137.4 -6q1.8 -.1 2.7 1.1M138.8 -4.4q1.7 .1 2.5 1.2M139.6 -2.9q1.6 .2 2.2 1.2M139.6 -1.5q1.4 .3 1.9 1.1M138.6 -.6q1.2 .3 1.6 .9" stroke="#1a1714" stroke-width=".55" stroke-linecap="round" fill="none"/>`;

  /* ---- Gesicht: Nasenspiegel dunkelgrau mit feuchtem Glanz, Nasenschlitz als Komma (oberes Ende zur Stirn), zweiter
          Schlitz hinter der Schnauzenwölbung angedeutet (V-Form) ---- */
  s += form(T, [[175.4, -47.6], [177, -47], [177.8, -45.2], [177.4, -43.8], [176, -43.6], [175, -45.4]], "#3a3a3e");
  s += `<path d="M176.6 -46.6q.8 .9 .3 2.2q-.3 .4 -.8 .3q.6 -1 .5 -2.5z" fill="#0d0d0e"/><path d="M175.4 -46.9q-.5 .9 -.3 2" stroke="#1a1a1c" stroke-width=".22" fill="none" stroke-linecap="round"/>`;
  s += `<ellipse cx="176.6" cy="-47" rx=".35" ry=".16" fill="#fff" opacity=".55"/>`;
  /* Haarbälge in Reihen auf dem Schnurrhaarpolster */
  if (F) {
    let d = "";
    for (let r = 0; r < 5; r++) for (let i = 0; i < 6; i++) d += `M${J(167.8 + i * 1.3 - r * 0.6 + (T.rnd() - 0.5) * 0.4, -47.4 + r * 1.3 + i * 0.2 + (T.rnd() - 0.5) * 0.3)}h.01`;
    s += `<path d="${d}" stroke="#3a3632" stroke-width=".38" stroke-linecap="round" stroke-opacity=".6"/>`;
  }
  /* Vibrissen: 14 in 4–5 Reihen über das ganze Polster, perlschnurartig gewellt, hell mit grauer Schattenkante,
          nach hinten unten geschwungen; die oberen kürzer */
  {
    let d = "";
    const k = F ? 15 : 8;
    for (let i = 0; i < k; i++) {
      const r = i % 5, c = Math.floor(i / 5), bx = 168.4 + c * 2.2 - r * 0.6, by = -47 + r * 1.25 + c * 0.3, L = 5 + r * 1.6 + T.rnd() * 2.4;
      const a = (-6 + r * 16 + (T.rnd() - 0.5) * 10) * Math.PI / 180;
      const ex = bx + Math.cos(a) * L, ey = by + Math.sin(a) * L + L * 0.2;
      if (F) { let p = `M${J(bx, by)}`; for (let j = 1; j <= 8; j++) { const f = j / 8, w = (j % 2 ? 0.2 : -0.2) * (1 - f); p += `L${J(bx + (ex - bx) * f - Math.sin(a) * w, by + (ey - by) * f + Math.cos(a) * w + Math.sin(f * Math.PI) * L * 0.07)}`; } d += p; }
      else d += `M${J(bx, by)}Q${J((bx + ex) / 2, (by + ey) / 2 + L * 0.08, ex, ey)}`;
    }
    s += (F ? `<path d="${d}" fill="none" stroke="#6b665e" stroke-width=".1" stroke-opacity=".5" transform="translate(.05 .08)"/>` : "") + `<path d="${d}" fill="none" stroke="#efe9dc" stroke-width=".13" stroke-opacity=".95" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  /* Überaugenborsten */
  s += fein(T, `<path d="M160 -54.6q1.6 -2.4 3.6 -3.2M161.2 -54.4q1.8 -2 4 -2.4" stroke="#e6e0d4" stroke-width=".12" fill="none" stroke-opacity=".8"/>`);
  /* ---- Auge: groß, rund, fast schwarz, Fellwölbung darüber, ein Glanzlicht + Bodenreflex; keine rosa Ecke ---- */
  s += weich([[157.6, -54], [163, -54.2], [163.4, -52.8], [158, -52.8]], "#2f3236", 0.4, 0.8);
  s += `<circle cx="160.6" cy="-51" r="1.85" fill="#141210"/><circle cx="160.6" cy="-51" r="1.6" fill="${T.rg("sauge", [[0, "#2a1c14"], [0.7, "#1e120c"], [1, "#0a0605"]], 0.45, 0.45, 0.55)}"/>`;
  s += `<path d="M158.8 -51.8q1.8 -1.6 3.6 0" fill="none" stroke="#000" stroke-width=".5" stroke-opacity=".4"/><ellipse cx="160.1" cy="-51.9" rx=".42" ry=".3" fill="#fff" opacity=".9"/><path d="M159.6 -49.8q1 .5 2.1 0" fill="none" stroke="#9fb0c4" stroke-width=".3" stroke-opacity=".5"/>`;
  /* Ohröffnung 1,5 Augenbreiten hinter dem Auge, mit weicher Hautfalte */
  s += `<ellipse cx="155.2" cy="-50.6" rx=".5" ry=".38" fill="#1d1c1b"/>` + weich([[154.2, -51.4], [156.2, -51.6], [156.2, -50.2], [154.2, -50]], "#2f3236", 0.35, 0.4);
  return { svg: s, box: [-5, -60.4, 177.8, 0], kopf: [140, -66, 190, -30] };
}

/* =====================================================================
   ROBBENBABY (Sattelrobben-Jungtier, „Whitecoat“)
   ===================================================================== */
/* RECHERCHE Sattelrobbe (Pagophilus groenlandicus), Jungtier – Websuche-Kontingent erschöpft, aus Fachwissen:
   Geburt auf dem Packeis (Feb./März), 80–90 cm, ~11 kg, nach 12 Tagen Säugen ~35 kg: dann prall, fast walzenförmig,
   der Hals verschwindet im Speck. Lanugo-Fell („Whitecoat“) weiß, dicht und wollig-flauschig (in den ersten
   Tagen gelblich vom Fruchtwasser), nach ~2 Wochen Haarwechsel zum grauen Fell mit Flecken. Kopf rund, kurze
   Schnauze, sehr große, dunkle, feucht glänzende Augen (oft „Tränen“-Spur darunter), schwarze Nase mit zwei
   Schlitzen, dunkle Lippen, helle Tasthaare. Vorderflossen kurz mit dunklen Krallen, Hinterflossen dunkelgrau,
   behaart, nach hinten. Liegt bäuchlings, hebt den Kopf. */
function robbeBaby(T) {
  let s = "";
  const F = T.fein !== false;
  const weich = (pts, farbe, op, sd) => weichForm(T, pts, farbe, op, sd);
  /* pralle Walze ohne Hals: großer Rundkopf (≈ 26 % der Länge) sitzt direkt auf einem Fettring; Oberkopf rund mit
     Stirnabsatz, kurze stumpfe Schnauze mit wulstigen Polstern; Kinn geht ohne Kehle in die volle Brust über; Bauch quillt */
  const rumpf = [
    [9.6, -10.4], [11.6, -13.4], [16, -15.6], [22, -21.6], [30, -26.4], [40, -30.4], [50, -33.4], [58, -35.8], [64, -37.6], [68.4, -38.6], [71.6, -40.8], [75.4, -42.6], [80, -43.4],
    [84.6, -42.4], [88, -40.2], [89.8, -37.8], [91.6, -36.4], [93.4, -35], [94.6, -33], [94.8, -30.6], [93.8, -28.8], [91.6, -27.8], [88.6, -27.2], [85.6, -26.2],
    [82.6, -23.8], [80.4, -20.4], [78, -16], [74.4, -11.4], [68.4, -6.8], [60, -3], [50, -0.8], [38, 0, 1], [26, -0.2], [18.4, -2.6], [13.6, -5.2], [10.6, -7.2],
  ];
  const kD = G(rumpf);
  const fell = verlauf(T, "rfell", 0, -44, 0, 0, [[[0, -44], "#fefbf3"], [[0, -33], "#f8f5ec"], [[0, -22], "#e4e8ed"], [[0, -11], "#c3cfdc"], [[0, -3], "#a9b8c9"], [[0, 0], "#c5d3e0"]]);

  /* ---- Hinterflossen: Sohle an Sohle, hintere 15 % dunkler; weiße Haarmanschette über die ersten 25–30 % (überlappende
          Haarspitzen), dann Dunkelgrau; 5 Zehenstrahlen als Wölbungen, äußere länger; kleine Krallen; feine Haare ---- */
  const hfPts = (dx, dy) => [[18 + dx, -14.6 + dy], [12 + dx, -15.4 + dy], [6 + dx, -16.6 + dy], [0.8 + dx, -18.2 + dy], [2.8 + dx, -15.8 + dy], [2.4 + dx, -13.2 + dy],
    [0.4 + dx, -10.2 + dy], [4.6 + dx, -8.6 + dy], [10 + dx, -7.4 + dy], [16 + dx, -6.4 + dy]];
  const hf = (dx, dy, fern) => {
    const p = hfPts(dx, dy), c = fern ? "#2f3237" : "#3e4146";
    let i = "";
    /* 5 Zehenstrahlen als Wölbungen: Lichtgrat oben, weiche Rinne darunter; äußere Strahlen länger */
    for (let k = 0; k < 5; k++) {
      const pts = [[13 + dx, -12.8 + dy + k * 0.95], [8 + dx, -14.1 + dy + k * 1.45], [[1.8, 3.1, 2.9, 1.8, 0.9][k] + dx, -17.4 + dy + k * 1.85]];
      i += F ? weich(pts.map(([x, y]) => [x, y - 0.2]).concat(pts.slice().reverse().map(([x, y]) => [x, y + 0.25])), fern ? "#5b6068" : "#71767f", 0.55, 0.25)
        + zart(T, pts.map(([x, y]) => [x, y + 0.75]), "#1a1b1e", 0.35, 0.45) : zart(T, pts.map(([x, y]) => [x, y - 0.2]), "#6c717a", 0.35, 0.5);
    }
    i += weich([[0, -11 + dy], [18 + dx, -8 + dy], [18 + dx, -5 + dy], [0, -8 + dy]], "#191b1f", 0.45, 1);
    i += haare(T, p, 40, 186, 0.45, [["#8d96a1", 1, 0.035, 0.45]], 14, 0.2, 0.1);
    i += `<path d="M${J(1.8 + dx, -17.6 + dy)}l-.7 -.25M${J(3 + dx, -15.5 + dy)}l-.7 -.05M${J(2.4 + dx, -13 + dy)}l-.7 .1M${J(0.6 + dx, -10.4 + dy)}l-.7 .3" stroke="#121212" stroke-width=".28" stroke-linecap="round"/>`;
    let o = `<g filter="${vol(T, "rhf", { weich: 0.9, tiefe: 3, schatten: "#101418" })}">${silhouette(T, G(p), c, i)}</g>`;
    return o;
  };
  s += hf(1.2, -3, true) + hf(0, 0, false);

  /* ---- Körper ---- */
  let n = `<rect x="0" y="-46" width="98" height="47" fill="${fell}"/>`;
  /* Licht oben links warm-weiß, Hauch Gelblich an Nacken und Rücken, Kernschatten ≈ 60 % der Höhe kühl blaugrau,
     Schnee-Reflexlicht am Bauchrand */
  n += weich([[20, -19], [40, -28.6], [60, -34], [72, -39.4], [82, -42.6], [76, -37], [60, -29], [40, -23], [22, -15]], "#fffdf7", 0.9, 2);
  n += weich([[46, -31], [62, -35], [72, -39], [64, -32], [50, -28]], "#f6f0dc", 0.6, 2.4);
  n += weich([[22, -9], [44, -11.6], [62, -10], [72, -11.4], [64, -5], [44, -3.6], [24, -4]], "#b5c2d3", 0.65, 2.6);
  n += weich([[30, -1.6], [50, -1.8], [64, -4.6], [50, -0.6], [30, -0.4]], "#dce6f0", 0.75, 0.8);
  /* Fettring hinter dem Kopf: Kerbe kühl (AO), darüber Glanzwulst; zwei weiche Querwülste an der Flanke */
  n += weich([[68, -39], [70.4, -33], [72.8, -26], [74, -18], [71.6, -22], [69.4, -29], [67.8, -34]], "#9fb0c4", 0.5, 1.6);
  n += weich([[64.4, -37.6], [67, -32], [69, -25], [70, -18], [67.6, -22], [65.6, -29]], "#ffffff", 0.45, 1.6);
  n += weich([[44, -30.4], [47, -22], [48, -13], [45, -19], [43.6, -26]], "#b8c4d3", 0.3, 2.4) + weich([[40, -30], [43, -22], [44, -13], [41, -19]], "#ffffff", 0.35, 2.4);
  /* AO unter der Vorderflosse und am Übergang zur Hinterflosse */
  n += weich([[60, -12], [70, -10.4], [74, -6], [62, -6]], "#8fa0b6", 0.5, 1.6) + weich([[12, -12], [18, -15], [20, -8], [14, -6]], "#8fa0b6", 0.5, 1.4);
  /* Kopf: Stirnwölbung im Licht, Augenmulde kühl, Kinnschatten, Schnurrhaarpolster wulstig mit Glanz */
  n += weich([[77, -42.6], [84, -42.6], [88, -40], [82, -38.6], [77.6, -39.4]], "#ffffff", 0.75, 1);
  n += weich([[81, -36.4], [88, -36.4], [88.4, -31.6], [81.4, -31.4]], "#9aa7b8", 0.35, 1.4);
  n += weich([[82, -27.4], [90, -27.6], [93, -28.6], [86, -26], [82, -25.4]], "#9eabbd", 0.5, 1);
  n += weich([[89.6, -34.6], [94, -33.4], [94.4, -30.4], [90.4, -29.4], [88.6, -31.4]], "#f6f8fa", 0.75, 0.6);
  n += weich([[89, -29.4], [93.6, -29.4], [93, -28.4], [89.4, -28.2]], "#7d8a9b", 0.45, 0.5);   // Maulspalte im Schatten
  /* Lanugo: weiche Strähnen in Bündeln (Wuchs: Schnauze → Kopf → hinten, um den Fettring, Flanke nach hinten unten);
     Lichtseite zart, Schattenseite deutlicher */
  const wuchs = (x, y) => (x > 84 ? 192 : x > 70 ? 182 + (y + 34) * 1.6 : x > 62 ? 132 - (y + 30) * 1.2 : 170 - (y + 18) * 0.9);
  const unten = [[14, -6], [30, -10], [50, -12], [66, -12], [76, -17], [78, -12], [62, -3.2], [40, -0.4], [20, -1.6]];
  n += straehnen(T, rumpf.filter((p) => p[0] < 88), 250, wuchs, 2.8, { m: 3, ab: 0.08, welle: 0.15, licht: ["#ffffff", 0.55, 0.05], schatten: ["#b4c2d2", 0.42, 0.055], sz: 0.07 });
  n += straehnen(T, unten, 100, wuchs, 2.5, { m: 3, ab: 0.08, welle: 0.15, licht: ["#dfe6ee", 0.16, 0.05], schatten: ["#8898ae", 0.42, 0.055], sz: 0.07 });
  s += `<g filter="${vol(T, "rrumpf", { weich: 4.5, tiefe: 5, umgebung: 0.38, schatten: "#20304a" })}">${silhouette(T, kD, fell, n)}</g>`;
  /* Fellsaum: oben fast weiß in den Hintergrund, unten kühl grau – keine glatte Vektorkante */
  s += haarSaum(T, [rumpf[rumpf.length - 2], rumpf[rumpf.length - 1], rumpf[0], rumpf[1]], 50, 1.4, [["#e9edf2", 1, 0.06, 0.9], ["#b2bfce", 0.8, 0.06, 0.85]], -1, 0);
  s += haarSaum(T, rumpf.slice(1, 14), 220, 1.2, [["#ffffff", 1, 0.06, 0.85], ["#e6eaef", 0.6, 0.06, 0.8]], -1, -0.5);
  s += haarSaum(T, rumpf.slice(21, 30), 110, 1, [["#c7d0db", 1, 0.06, 0.8], ["#aab8c8", 0.6, 0.06, 0.7]], -1, 0.3);

  /* ---- Vorderflosse: mit Lanugo, 5 Zehenwölbungen vorn, 5 kräftige, nur leicht gebogene Krallen; Schatten auf dem Körper ---- */
  const vf = [[62.4, -12.6], [67.6, -10], [71.6, -7], [74.6, -4.2], [75.8, -2.4], [75.2, -0.8], [73.6, -0.2], [68, -0.4], [63.4, -2.6], [60.6, -6.6]];
  let vi = weich([[63, -11], [69, -8], [74, -3.6], [69, -5], [63, -7.6]], "#ffffff", 0.7, 0.6) + weich([[61, -2.6], [69, -0.8], [75, -0.8], [69, 0], [61, -1]], "#9eabbd", 0.6, 0.6);
  vi += buschel(T, vf, 30, 38, 1.6, 0.2, ["#c9d3df", 0.35], ["#ffffff", 0.55], 20, 0.03);
  vi += haare(T, vf, 120, 38, 0.8, [["#b9c4d1", 1, 0.045, 0.45], ["#ffffff", 1, 0.05, 0.6]], 26, 0.4, 0.05);
  for (let k = 0; k < 4; k++) vi += zart(T, [[70 + k * 0.8, -6 + k * 0.6], [73.4 + k * 0.4, -3.6 + k * 0.7]], "#aab6c4", 0.18, 0.5);
  s += weich([[60, -11], [70, -9.6], [74, -6], [64, -6.6]], "#8fa0b6", 0.45, 1.2);
  s += `<g mask="${verlaufMaske(T, "rvf", 56, -16, 22, 17, 61.4, -12.6, 64.6, -8.6, [[[61.4, -12.6], "#000"], [[64.6, -8.6], "#fff"]])}"><g filter="${vol(T, "rvf", { weich: 1.2, tiefe: 3, schatten: "#20304a" })}">${silhouette(T, G(vf), verlauf(T, "rvf", 0, -12, 0, 0, [[[0, -12], "#f1f3f5"], [[0, 0], "#b4c0ce"]]), vi)}</g></g>`;
  s += haarSaum(T, [[63.4, -2.6], [68, -0.4], [73.6, -0.2]], 24, 0.6, [["#c7d0db", 1, 0.05, 0.8]], 1, 0.2);
  s += `<path d="M73.4 -4.6q1.3 -.2 1.9 .6l-.4 .3q-.6 -.5 -1.5 -.5zM74.6 -3.4q1.3 -.1 1.8 .7l-.4 .2q-.6 -.4 -1.4 -.5zM75.2 -2.2q1.2 0 1.6 .7l-.4 .2q-.5 -.4 -1.2 -.5zM75.2 -1.1q1.1 .1 1.4 .7l-.4 .2q-.4 -.4 -1 -.5zM74.4 -.3q1 .1 1.3 .6l-.4 .1q-.4 -.3 -.9 -.4z" fill="#24221f"/>`;
  s += weich([[66, -0.6], [76, -0.6], [76, 0.2], [66, 0.2]], "#203048", 0.4, 0.4);

  /* ---- Gesicht: Nasenspiegel klein (–25 %), matt dunkelgrau, zwei gebogene geschlossene Schlitze in V-Stellung ---- */
  s += form(T, [[93.2, -33.4], [94.1, -33.1], [94.7, -32.2], [94.6, -31.4], [93.9, -31.1], [93.2, -31.6], [93, -32.6]], "#2e2c2e");
  s += `<path d="M94.3 -32.7q.5 .5 .2 1.3M93.6 -32.8q-.3 .6 -.1 1.2" stroke="#0e0d0e" stroke-width=".14" fill="none" stroke-linecap="round"/><ellipse cx="93.8" cy="-33" rx=".2" ry=".09" fill="#fff" opacity=".4"/>`;
  /* Follikel klein in gebogenen Reihen; 13 Vibrissen in 4 Reihen, perlschnurartig, cremeweiß mit grauer Schattenkante */
  if (F) {
    let d = "";
    for (let r = 0; r < 4; r++) for (let i = 0; i < 5; i++) d += `M${J(89.4 + i * 1 - r * 0.45 + Math.sin(i * 0.8) * 0.2 + (T.rnd() - 0.5) * 0.25, -33.4 + r * 0.95 + i * 0.16 + (T.rnd() - 0.5) * 0.2)}h.01`;
    s += `<path d="${d}" stroke="#a49e92" stroke-width=".2" stroke-linecap="round" stroke-opacity=".7"/>`;
  }
  {
    /* 14 Vibrissen in 4 Reihen, sanft nach hinten-unten gebogen, fächern wenig; Perlung als zarte Verdickungen */
    let d = "";
    const k = F ? 14 : 7;
    for (let i = 0; i < k; i++) {
      const r = i % 4, c = Math.floor(i / 4), bx = 90 + c * 1.15 - r * 0.4, by = -32.9 + r * 0.9 + c * 0.15, L = 4.6 + r * 1 + T.rnd() * 2.2;
      const a = (2 + r * 8 + (T.rnd() - 0.5) * 8) * Math.PI / 180, ex = bx + Math.cos(a) * L, ey = by + Math.sin(a) * L;
      d += `M${J(bx, by)}Q${J((bx + ex) / 2 + 0.2, (by + ey) / 2 - L * 0.06, ex, ey + L * 0.05)}`;
    }
    s += (F ? `<path d="${d}" fill="none" stroke="#7d8794" stroke-width=".1" stroke-opacity=".55" transform="translate(.04 .07)"/>` : "") + `<path d="${d}" fill="none" stroke="#f3efe6" stroke-width=".11" stroke-linecap="round"/>`
      + fein(T, `<path d="${d}" fill="none" stroke="#fffaf0" stroke-width=".17" stroke-dasharray=".14 .5" stroke-opacity=".5"/>`);
  }
  s += fein(T, `<path d="M83.2 -38.4q.8 -1.8 2.2 -2.6M84 -38.2q1 -1.6 2.6 -2M84.8 -38q1.2 -1.2 2.6 -1.4" stroke="#d8d6cf" stroke-width=".07" fill="none"/>`);
  /* ---- Auge: sehr groß, rund, fast schwarz, in weicher Mulde; feuchter dunkler Lidrand, Fell überlappt den Rand leicht;
          ein Glanzlicht oben vorn, breiter bläulicher Schneereflex unten. Tränenspur: feucht verklebter, grau-gelblicher
          Fellstreifen mit kleinem Glanz, Haare darin zu Spitzen verklebt ---- */
  {
    const x = 84.8, y = -34, rx = 2.5, ry = 2.3;
    s += form(T, [[84.6, -31.8], [86.6, -31.8], [86.8, -29], [85.6, -26.2], [84.2, -25.6], [83.8, -28.2]], "#b8b4a6", F ? ` opacity=".7" filter="${blur(T, 0.3, 0.5)}"` : ` opacity=".5"`);
    s += fein(T, `<path d="M84.8 -31.4q.3 2 -.2 4.6M85.5 -31.4q.4 2.2 0 5M86.2 -31.2q.2 1.8 -.2 3.8M85.1 -30q.5 1.6 .2 3.2" fill="none" stroke="#9c9789" stroke-width=".09" stroke-opacity=".7" stroke-linecap="round"/>` + zart(T, [[85.9, -31.2], [85.8, -29.6], [85.4, -28]], "#fffdf6", 0.12, 0.55));
    s += weich([[x - 3.4, y - 1.4], [x + 3.4, y - 1.6], [x + 3.2, y + 2.4], [x - 3, y + 2.6]], "#9aa7b8", 0.45, 0.9);
    s += `<ellipse cx="${Z2(x)}" cy="${Z2(y)}" rx="${Z2(rx + 0.3)}" ry="${Z2(ry + 0.3)}" fill="#0c0908"/><ellipse cx="${Z2(x)}" cy="${Z2(y)}" rx="${Z2(rx)}" ry="${Z2(ry)}" fill="${T.rg("rauge", [[0, "#24180f"], [0.75, "#1a0f0a"], [1, "#080504"]], 0.5, 0.45, 0.6)}"/>`;
    s += `<ellipse cx="${Z2(x - 0.9)}" cy="${Z2(y - 1)}" rx=".45" ry=".32" fill="#fff" opacity=".92"/><path d="M${J(x - 1.5, y + 1.6)}q${J(1.5, 0.8, 3, 0)}" fill="none" stroke="#9fb4cf" stroke-width=".3" stroke-opacity=".3"/>`;
    s += `<ellipse cx="${Z2(x)}" cy="${Z2(y)}" rx="${Z2(rx + 0.15)}" ry="${Z2(ry + 0.15)}" fill="none" stroke="#3a3632" stroke-width=".2" stroke-opacity=".7"/>`;
    s += haarSaum(T, [[x - 2.8, y - 0.6], [x - 1.6, y - 2.6], [x + 0.4, y - 2.9], [x + 2.4, y - 2]], 24, 0.5, [["#f4f5f6", 1, 0.06, 0.85]], 1, 0.2);
  }
  return { svg: s, box: [0.4, -43.4, 94.8, 0], kopf: [70, -48, 99, -20] };
}

/* =====================================================================
   POLARFUCHS (Winterfell)
   ===================================================================== */
/* RECHERCHE Polarfuchs (Vulpes lagopus) – Websuche-Kontingent erschöpft, aus Fachwissen: Kopf-Rumpf 46–68 cm,
   Schwanz 26–42 cm (sehr buschig), Schulterhöhe 25–30 cm, 3–8 kg. Gedrungen: kurze Beine, kurze, breite Schnauze,
   kleine, runde, dicht behaarte Ohren (Wärmeschutz), dichtes, langes Winterfell (weiße Morphe: rein weiß,
   Schatten wirken blaugrau), dicke Halskrause und „Backenbart“, stark behaarte Pfoten (auch die Sohlen),
   Schwanz wird tief getragen. Augen bernstein- bis goldbraun, Pupille bei Licht senkrechter Schlitz; Nase und
   Lippenrand schwarz; dunkle Tasthaare. Zehengänger: Ellbogen nah am Körper, Handwurzel, Sprunggelenk hinten
   deutlich. Steht ruhig, Kopf leicht erhoben. */
function polarfuchs(T) {
  let s = "";
  const F = T.fein !== false;
  const weich = (pts, farbe, op, sd) => weichForm(T, pts, farbe, op, sd);
  const fell = verlauf(T, "pfell", 0, -45, 0, 0, [[[0, -45], "#fffdf8"], [[0, -34], "#f8f7f3"], [[0, -24], "#eceff2"], [[0, -15], "#d3dbe4"], [[0, -7], "#dfe5ec"], [[0, 0], "#c9d2dc"]]);
  const fellF = verlauf(T, "pfellF", 0, -30, 0, 0, [[[0, -30], "#cbd3dd"], [[0, -12], "#b2bfcd"], [[0, 0], "#a3b0c0"]]);
  const randF = verlauf(T, "prf", 0, -45, 0, 0, [[[0, -45], "#fbfaf7"], [[0, -26], "#e6eaee"], [[0, -14], "#c9d2dc"], [[0, 0], "#ccd5df"]]);
  /* Winterhaar: Strähnen-Bündel (Glanzseite #FFFFFF, Schattenseite #C7D0DC) + feine Deckhaare */
  const haar = (pts, k, w, L, sz = 0.04) => haare(T, pts, k, w, L, [["#9aa8bb", 1, 0.06, 0.25], ["#ffffff", 1.4, 0.065, 0.65]], 16, 0.35, sz);
  const buendel = (pts, k, w, L, br) => buschel(T, pts, k, w, L, br, ["#b4c0ce", 0.18], ["#ffffff", 0.7], 14, 0.05);
  /* weiche Konturbüschel: gebogene, spitz auslaufende Strähnen in Körperfarbe (kein Borstenrand) */
  const kontur = (pts, k, L, br, fill, seite, zug, sz) => F ? `<g filter="${blur(T, 0.08, 0.1)}">${fellRand(T, pts, k, L, br, fill, seite, zug, sz)}</g>` : fellRand(T, pts, Math.round(k * 0.5), L, br, fill, seite, zug, 0.4);

  /* ---- Beine (Hinterbein als Z: Oberschenkel, Knie vorn, Sprunggelenk ≈ 130° auf 30 % der Höhe, schräger Mittelfuß;
          Vorderbein unter dem Ellbogen verjüngt, Vorderfußwurzel verdickt; runde, kompakte Pfoten) ---- */
  const vb = (dx) => [[59.2 + dx, -22], [65.2 + dx, -22], [65.2 + dx, -16], [64.2 + dx, -10.4], [64.4 + dx, -7.8], [65 + dx, -5.8], [66.4 + dx, -4.6], [68.2 + dx, -4], [69 + dx, -2.4],
    [68.8 + dx, -0.5], [67.8 + dx, 0, 1], [62 + dx, 0, 1], [61.4 + dx, -1.8], [61.6 + dx, -4.4], [61.8 + dx, -6.2], [61.4 + dx, -8.4], [61 + dx, -12], [60 + dx, -17]];
  const hb = (dx) => [[28 + dx, -25], [39 + dx, -27.4], [44 + dx, -21.4], [44.8 + dx, -16.8], [42.4 + dx, -13.2], [39 + dx, -10.6], [38 + dx, -8.4], [38.8 + dx, -5.6], [40 + dx, -4.2],
    [41.8 + dx, -3.6], [42.8 + dx, -2], [42.6 + dx, -0.4], [41.6 + dx, 0, 1], [35.6 + dx, 0, 1], [34.6 + dx, -1.8], [34.4 + dx, -4.2], [33.8 + dx, -7], [32.8 + dx, -9.4], [31, -12.6 + dx * 0], [29.4 + dx, -16.2], [27.6 + dx, -20.6]];
  const vbF = vb(-5.4), hbF = hb(6.4), vbN = vb(0), hbN = hb(0);
  let fi = weich([[54, -20], [57, -20], [57, -6], [55, -6]], "#eef2f6", 0.4, 0.8) + haar(vbF, 60, 94, 0.9) + haar(hbF, 80, (x, y) => (y < -12 ? 115 : y < -7 ? 68 : 92), 1);
  s += `<g filter="${vol(T, "pbF", { weich: 1.4, tiefe: 3, schatten: "#203048" })}">${silhouette(T, vereint(T, [vbF, hbF]), fellF, fi)}</g>`;
  s += kontur([[56.6, -1.6], [59.6, -3.6], [63, -3.4], [65.4, -1.6]], 16, 0.8, 0.22, "#b8c4d1", -1, 0.4) + kontur([[41.6, -1.6], [44.4, -3.8], [48, -3.4], [50.6, -1.6]], 16, 0.8, 0.22, "#b8c4d1", -1, 0.4);

  /* ---- Schwanz (behalten): tief angesetzt, hängt erst, schwingt dann aus, größte Breite in der Mitte, Spitze rund ---- */
  const schwanz = [[31, -24.6], [25.6, -23.8], [18.6, -21.6], [12.4, -18], [7.6, -13.6], [5.2, -9.4], [5.6, -6.2], [8.4, -4.6], [12.4, -5.4], [16.6, -8.2], [21.6, -12], [26, -16], [29.6, -18.8]];
  const swuchs = (x) => (x > 24 ? 160 : 150 + (24 - x) * 3.4);
  let si = weich([[28, -23.6], [18, -20.8], [10, -14.8], [16, -17], [26, -20.2]], "#ffffff", 0.85, 1.4) + weich([[26, -15.4], [16, -9.4], [8, -5.8], [14, -6.2], [24, -12.4]], "#7f8fa5", 0.4, 1.6);
  si += buendel(schwanz, 40, swuchs, 3.4, 0.34) + haar(schwanz, 200, swuchs, 2.2);
  s += `<g filter="${vol(T, "pschw", { weich: 2.2, tiefe: 3.5, schatten: "#203048" })}">${silhouette(T, G(schwanz), fell, si)}</g>`;
  s += kontur([[30, -24.8], [25.6, -24], [18.6, -21.8], [12.4, -18.2], [7.6, -13.8], [5.2, -9.6], [5.6, -6.4], [8.4, -4.8]], 70, 1.7, 0.34, randF, 1, -0.2);
  s += kontur([[8.4, -4.6], [12.4, -5.4], [16.6, -8.2], [21.6, -12], [26, -16]], 36, 1.4, 0.3, "#c3cdd8", 1, 0.3);

  /* ---- Ohren (vor dem Körper zeichnen: der Kopf deckt den Ansatz, die Basis versinkt im Fell) ---- */
  const ohr = (dx, dy, fern) => {
    const o = [[73.4 + dx, -41.6 + dy], [73.6 + dx, -44.4 + dy], [74.8 + dx, -46.6 + dy], [76.4 + dx, -47 + dy], [77.8 + dx, -45.4 + dy], [78.6 + dx, -42 + dy]];
    const oi = [[74.8 + dx, -42.6 + dy], [75.2 + dx, -44.8 + dy], [76.2 + dx, -45.8 + dy], [77.2 + dx, -44.6 + dy], [77.4 + dx, -42.6 + dy]];
    let i = form(T, oi, fern ? "#9aa5b2" : verlauf(T, "pohrI", 0, -46 + dy, 0, -42.6 + dy, [[[0, -46 + dy], "#9ea8b5"], [[0, -42.6 + dy], "#cfd6de"]]));
    i += haare(T, oi, 50, (x) => (x < 76.2 + dx ? 205 : 335), 1, [["#ffffff", 1, 0.07, 0.9]], 26, 0.35, 0.1);   // weiße, nach außen gekämmte Büschel
    i += haar(o, 30, -85, 0.6);
    return `<g filter="${vol(T, "pohr", { weich: 0.8, tiefe: 3, schatten: "#203048" })}">${silhouette(T, G(o), fern ? "#d0d7df" : verlauf(T, "pohr", 0, -47 + dy, 0, -41.6 + dy, [[[0, -47 + dy], "#f8f8f5"], [[0, -41.6 + dy], "#e3e7ec"]]), i)}</g>` +
      kontur([[73.6 + dx, -42.4 + dy], [73.8 + dx, -44.6 + dy], [75 + dx, -46.6 + dy], [76.4 + dx, -47.1 + dy], [77.9 + dx, -45.4 + dy]], 22, 0.5, 0.14, fern ? "#d0d7df" : "#f8f8f5", 1, 0);
  };
  s += ohr(4, -0.8, true) + ohr(0.4, -1.4, false);

  /* ---- Körper, Hals, Kopf, nahe Beine: eine Silhouette.
          Kompakt (Kopf-Rumpf ≈ 1,9 × Schulterhöhe), Brust tief, Bauch hinter dem Brustkorb hochgezogen; Hals kurz und steil
          (≈ 35°); Kopf als eigene Rundung mit Hinterhaupt; kurze, an der Basis hohe Schnauze (Auge–Nase ≈ 40 % der
          Kopflänge), Stirnabsatz, Kinn; breite Wangen und Kragen ---- */
  const rumpf = [
    [27, -22.6], [29, -26.6], [34, -29], [42, -30], [50, -29.6], [56, -30.6], [61, -32.4], [64.6, -35.4], [67.4, -38.8], [70.4, -41.2], [73.4, -43], [77, -44.4],
    [80.6, -44.6], [83, -43.6], [84.4, -42], [85.6, -41.2], [87, -40.8], [88.2, -40.4], [88.9, -39.6], [89, -38.6], [88.4, -37.9], [87.2, -37.5], [85.6, -37.2], [84, -36.8],
    [82.4, -36.2], [80.6, -35.3], [78.6, -33.8], [76.6, -31.6], [74.6, -28.6], [73, -25.6], [71.6, -23], [69.6, -19.6], [67.2, -16.8], [62, -14.6], [56, -13.6], [48, -13], [41, -14],
    [35, -16], [30.6, -18.8],
  ];
  const kD = vereint(T, [rumpf, vbN, hbN]);
  let n = `<rect x="20" y="-48" width="76" height="49" fill="${fell}"/>`;
  /* Licht oben links (Rücken, Kopf, Schulter warm-weiß); kühle Schatten unter Hals, Bauch, hinter dem Vorderbein; AO an
     den Beinansätzen; Schnee-Reflex unten */
  n += weich([[30, -26], [44, -29.4], [58, -30], [66, -36], [74, -42.6], [70, -37], [60, -29], [44, -26], [32, -23]], "#fffdf8", 0.9, 1.6);
  n += weich([[34, -14.6], [48, -13.4], [60, -14], [67, -16.6], [60, -19], [46, -19.4], [36, -19]], "#9aa9bd", 0.5, 1.8);
  n += weich([[58.6, -21.4], [63, -21.4], [63.4, -16], [59, -15.6]], "#7f8fa5", 0.5, 1) + weich([[37, -23], [42, -22.6], [42.4, -18], [37.4, -17.6]], "#7f8fa5", 0.35, 1.2);
  n += weich([[62, -1.6], [68.8, -1.2], [68.8, -0.2], [62, -0.2]], "#dfe8f1", 0.6, 0.4) + weich([[35.6, -1.6], [42.6, -1.2], [42.6, -0.2], [35.6, -0.2]], "#dfe8f1", 0.6, 0.4);
  /* Gelenke: Knie (Lichtkante vorn), Fersenhöcker, Vorderfußwurzel, Ellbogen */
  n += weich([[42.4, -19], [44.6, -17], [43.4, -14.6]], "#ffffff", 0.6, 0.5) + weich([[32.4, -10.4], [34, -9.4], [33.8, -7.6], [32.8, -8.4]], "#6f7f96", 0.5, 0.4);
  n += weich([[64.6, -8.4], [66, -8], [66.4, -5.8], [65, -6]], "#ffffff", 0.5, 0.4) + weich([[61.4, -8.4], [62.4, -8.4], [62.2, -5.8], [61.4, -6]], "#7f8fa5", 0.4, 0.4);
  /* Kopf: Stirn/Scheitel im Licht, Augenhöhle kühl, Wange breit mit Kragen; Kinn als weicher Schatten */
  n += weich([[74, -43], [80, -44], [83.4, -42.4], [78, -40.4], [74, -40.6]], "#ffffff", 0.7, 0.8);
  n += weich([[80.6, -39.8], [84, -39.6], [84, -38.8], [80.8, -38.8]], "#8a99ad", 0.4, 0.5);
  n += weich([[80, -36.6], [86, -37.4], [87.4, -37.6], [84, -36.4], [80, -35.8]], "#8a99ad", 0.35, 0.6);
  n += weich([[76, -36], [81, -37], [82, -35.4], [78, -33], [75.6, -33.6]], "#ffffff", 0.7, 1);
  n += weich([[74, -36], [79, -35], [81, -33], [76, -31], [73, -33]], "#ffffff", 0.6, 1);
  /* Fell: Bündel in Wuchsrichtung – Kopf nach hinten, Kragen nach hinten unten, Flanke nach unten, Oberschenkel nach hinten */
  const wuchs = (x, y) => (x > 82 ? 190 : x > 72 && y < -36 ? 182 : x > 70 ? 128 : x > 60 ? 116 - (y + 26) * 1.2 : x < 42 && y > -27 ? 118 : y > -19 ? 95 : 166 + (y + 24) * 1.4);
  const rumpfH = rumpf.filter((p) => p[0] < 84);
  n += buendel(rumpfH, 70, wuchs, 3.2, 0.34);
  n += haar(rumpfH, 330, wuchs, 1.6);
  n += haar(vbN, 80, (x, y) => (y < -10 ? 100 : 92), 0.9) + haar(hbN, 100, (x, y) => (y < -12 ? 118 : y < -7 ? 68 : 92), 1);
  n += haare(T, [[84, -42], [88, -40.6], [88.4, -38.6], [84.4, -38.4]], 30, 186, 0.5, [["#aab5c3", 1, 0.045, 0.45]], 10, 0.1, 0.1);   // kurze Haare auf dem Nasenrücken
  s += `<g filter="${vol(T, "prumpf", { weich: 3.4, tiefe: 4, umgebung: 0.4, schatten: "#203048" })}">${silhouette(T, kD, fell, n)}</g>`;
  /* weiche Kontur: Rücken, Hinterhaupt, Bauchsaum (unregelmäßig), Hosen */
  s += kontur([[27.6, -24], [29, -26.8], [34, -29.2], [42, -30.2], [50, -29.8], [56, -30.8], [61, -32.6], [64.6, -35.6], [67.4, -39], [70.4, -41.4], [73.4, -43]], 110, 1.1, 0.24, randF, 1, -0.45);
  s += kontur([[67.2, -16.8], [62, -14.6], [56, -13.6], [48, -13], [41, -14], [35, -16]], 70, 1.6, 0.3, "#c9d2dc", 1, 0.1);
  s += kontur([[30.6, -18.8], [29.6, -16.4], [31, -12.8]], 18, 1.2, 0.26, "#c9d2dc", -1, 0.4);
  /* Kragen: Wangen- und Kehlfell steht 1–2 cm über die Kopfkontur, nach hinten unten gestrichen */
  s += kontur([[82.6, -35.8], [80.6, -35.2], [78.6, -33.8], [76.6, -31.6], [74.6, -28.6], [73, -25.6], [71.6, -23], [69.6, -19.6]], 90, 2, 0.4, verlauf(T, "pkr", 0, -34, 0, -18, [[[0, -34], "#f8f9f8"], [[0, -18], "#d0d8e1"]]), 1, -0.5);
  s += F ? buendel([[73, -36], [80.6, -34.6], [83, -33], [78, -30], [73, -29.4], [72, -32]], 26, 160, 1.6, 0.26) : "";
  /* Pfoten: rund und kompakt, 4 Zehenwölbungen unter überhängendem Fell, 1–2 dunkle Krallenspitzen */
  const pfote = (x0, x1) => {
    let d = "";
    for (let i = 0; i < 4; i++) { const x = x0 + (x1 - x0) * (i + 0.5) / 4; d += `M${J(x - 0.9, -0.2)}q${J(0.9, -1.6, 1.8, 0)}`; }
    return `<path d="${d}" fill="none" stroke="#a9b6c5" stroke-width=".16" stroke-opacity=".7"/>`;
  };
  s += pfote(62.6, 68.8) + pfote(36.2, 42.6);
  s += kontur([[61.6, -2.6], [64.2, -4.4], [67, -4.2], [68.8, -2.2]], 18, 0.6, 0.18, "#eef2f6", 1, 0.6) + kontur([[35.2, -2.6], [37.6, -4.4], [40.4, -4], [42.6, -2.2]], 18, 0.6, 0.18, "#eef2f6", 1, 0.6);
  s += `<path d="M68.8 -.7l.6 .4M68.1 -.4l.5 .3M42.6 -.7l.6 .4M41.9 -.4l.5 .3" stroke="#2e2a26" stroke-width=".22" stroke-linecap="round" stroke-opacity=".85"/>`;

  /* ---- Gesicht ---- */
  /* Nase: klein (≈ 55 %), vorn an der Spitze, geradeaus; Nasenloch nur als feine Kerbe */
  s += form(T, [[88.1, -40.5], [88.65, -40.25], [89.1, -39.6], [89.1, -39], [88.65, -38.7], [88.15, -38.95], [87.95, -39.8]], verlauf(T, "pnase", 0, -40.5, 0, -38.7, [[[0, -40.5], "#4a4542"], [[0, -38.7], "#121110"]]));
  s += `<ellipse cx="88.5" cy="-40.2" rx=".2" ry=".09" fill="#fff" opacity=".45"/>`;
  /* Lefze: schwarzer Lippensaum, hinten leicht abwärts, vom weißen Schnauzenfell überlappt; Kinn weicher Schatten */
  s += zart(T, [[88, -38], [87, -37.7], [86, -37.6]], "#141210", 0.09, 0.7);
  s += fein(T, haare(T, [[84.8, -38.6], [88.2, -38.6], [88, -37.7], [85, -37.4]], 26, 160, 0.5, [["#ffffff", 1, 0.06, 0.9]], 12, 0.1));
  /* Vibrissen: 11, Basis kräftiger, verjüngt; Follikel klein und unregelmäßig in 3–4 gebogenen Reihen */
  if (F) {
    let d = "", dp = "";
    for (let i = 0; i < 11; i++) {
      const r = i % 4, c = Math.floor(i / 4), bx = 85.4 + c * 0.8 - r * 0.4 + (T.rnd() - 0.5) * 0.3, by = -39.6 + r * 0.5 + c * 0.1, L = 3.2 + T.rnd() * 2 + r * 0.5;
      const a = (-4 + r * 13 + (T.rnd() - 0.5) * 8) * Math.PI / 180, ex = Math.cos(a) * L, ey = Math.sin(a) * L + L * 0.18, nx = -Math.sin(a) * 0.035, ny = Math.cos(a) * 0.035;
      d += `M${J(bx - nx, by - ny)}q${J(ex * 0.5, ey * 0.5 - 0.25, ex, ey)}q${J(-ex * 0.5 + nx * 2, -ey * 0.5 - 0.25 + ny * 2, -ex + nx * 2, -ey + ny * 2)}z`;
      dp += `M${J(bx, by)}h.01`;
    }
    s += `<path d="${dp}" stroke="#8a95a4" stroke-width=".16" stroke-linecap="round"/><path d="${d}" fill="#2d2a28" fill-opacity=".75"/>`;
    s += `<path d="M82 -42q.6 -1.2 1.6 -1.8M82.6 -41.8q.8 -1 1.8 -1.3" fill="none" stroke="#3a3632" stroke-width=".05" stroke-opacity=".75"/>`;
  }
  /* Auge: mandelförmig, äußerer Winkel leicht schräg nach oben, bernstein, senkrecht ovale Pupille, schwarzer Lidrand,
     scharfes Glanzlicht, Schatten der Augenhöhle darunter (kein Rosa) */
  {
    const x = 82.6, y = -40.6, r = 0.85, id = T.id("pauge");
    const spalt = `M${J(x + r * 1.3, y - r * 0.15)}C${J(x + r * 0.5, y - r * 0.95, x - r * 0.7, y - r * 0.9, x - r * 1.3, y + r * 0.25)}C${J(x - r * 0.5, y + r * 0.8, x + r * 0.7, y + r * 0.6, x + r * 1.3, y - r * 0.15)}z`;
    T.def(`<clipPath id="${id}"><path d="${spalt}"/></clipPath>`);
    s += weich([[x - 1.4, y + 0.6], [x + 1.4, y + 0.4], [x + 1.2, y + 1.2], [x - 1.2, y + 1.3]], "#7f8fa5", 0.45, 0.4);
    s += `<path d="${spalt}" fill="#0b0908"/><g clip-path="url(#${id})"><circle cx="${Z2(x)}" cy="${Z2(y)}" r="${Z2(r * 0.85)}" fill="${T.rg("piris", [[0, "#e9b84a"], [0.7, "#d9a332"], [1, "#c8901e"]], 0.45, 0.45, 0.55)}"/>` +
      `<ellipse cx="${Z2(x)}" cy="${Z2(y)}" rx="${Z2(r * 0.22)}" ry="${Z2(r * 0.55)}" fill="#050403"/><rect x="${Z2(x - r * 1.4)}" y="${Z2(y - r)}" width="${Z2(r * 2.8)}" height="${Z2(r * 0.7)}" fill="${T.lg("plid", [[0, "#000", 0.6], [1, "#000", 0]])}"/>` +
      `<ellipse cx="${Z2(x + r * 0.25)}" cy="${Z2(y - r * 0.3)}" rx="${Z2(r * 0.16)}" ry="${Z2(r * 0.12)}" fill="#fff" opacity=".95"/></g><path d="${spalt}" fill="none" stroke="#0b0908" stroke-width="${Z2(r * 0.2)}"/>`;
  }
  return { svg: s, box: [5.2, -48.5, 89.1, 0], fuesse: [39.6, 46, 61, 66.4], kopf: [68, -50, 93, -26] };
}

/* =====================================================================
   RENTIER
   ===================================================================== */
/* RECHERCHE Rentier (Rangifer tarandus) – Websuche-Kontingent erschöpft, aus Fachwissen: Kopf-Rumpf 150–230 cm,
   Schulterhöhe 90–140 cm, Bullen 90–180 kg. Einzige Hirschart, bei der beide Geschlechter ein Geweih tragen (Bullen
   größer). Geweih: lange, nach hinten-oben geschwungene Hauptstangen, oben nach vorn gebogen und schaufelartig
   verbreitert mit Enden; vorn über dem Gesicht eine senkrecht abgeflachte Augsprosse („Schaufel“), meist nur auf
   einer Seite voll ausgebildet; darüber die Eissprosse. Kräftiger, gedrungener Körper, Beine kürzer als bei anderen
   Hirschen, Kopf lang mit breiter, ganz behaarter Schnauze (auch der Nasenspiegel ist behaart), kurze runde Ohren,
   kurzer Schwanz. Winterfell dicht (hohle Haare): Rücken und Flanke graubraun, Hals und Halsmähne (lange Haare
   unter dem Hals) hell cremeweiß, heller Spiegel am Hinterteil, heller Streif an der unteren Flanke, Beine dunkel-
   braun mit hellem Band über den Hufen. Hufe groß, breit, halbmondförmig, Afterklauen tief und groß (klicken beim
   Gehen). Augen dunkelbraun mit Wimpern. Huftier: steht auf den Hufspitzen, Sprunggelenk hinten hoch. */
function rentier(T) {
  let s = "";
  const F = T.fein !== false;
  const weich = (pts, farbe, op, sd) => weichForm(T, pts, farbe, op, sd);
  const haarL = (pts, k, w, L, f = "#2b2219", l = "#d8ccb4", sz = 0.03) => haare(T, pts, k, w, L, [[f, 1, 0.1, 0.35], [l, 0.9, 0.1, 0.4]], 14, 0.25, sz);
  /* Lauf: Gelenkkette (oben → unten) mit Breiten [hinten, vorn] */
  const lauf = (kette, br) => {
    const n = kette.length, hin = [], vor = [];
    for (let i = 0; i < n; i++) {
      const a = kette[Math.max(0, i - 1)], b = kette[Math.min(n - 1, i + 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
      hin.push([kette[i][0] + dy * br[i][0], kette[i][1] - dx * br[i][0]]); vor.push([kette[i][0] - dy * br[i][1], kette[i][1] + dx * br[i][1]]);
    }
    return hin.concat(vor.reverse());
  };
  /* Huf: sehr breit, halbmondförmig, zwei Klauenhälften mit Spalt, Afterklauen tief hinten; helles Haarband darüber */
  const huf = (x0, fern) => {
    const x = x0;
    const h1 = [[x - 6.4, -5.6], [x + 1, -6.4], [x + 5.6, -3.4], [x + 6.8, 0, 1], [x - 6.8, 0, 1], [x - 7.2, -2.6]];
    const h2 = [[x + 1.6, -6], [x + 6, -5.4], [x + 9.4, -2.4], [x + 10.6, 0, 1], [x + 4.2, 0, 1], [x + 3.8, -3]];
    const g = fern ? "#211b16" : verlauf(T, "huf", 0, -6.4, 0, 0, [[[0, -6.4], "#55493d"], [[0, -2], "#2a221b"], [[0, 0], "#4a4036"]]);
    let o = `<g filter="${vol(T, "huf", { weich: 1, tiefe: 3 })}">` + form(T, h2, fern ? "#1a1511" : g) + form(T, h1, g) + `</g>`;
    o += zart(T, [[x + 3.4, -5.8], [x + 5.4, -0.2]], "#0a0806", 0.45, 0.8);   // Spalt
    o += fein(T, zart(T, [[x - 6.4, -0.6], [x + 6.4, -0.6]], fern ? "#4a4036" : "#9a8a76", 0.3, 0.6));   // Abriebkante
    o += form(T, [[x - 9.6, -5.6], [x - 7, -6.2], [x - 6, -3], [x - 7.6, -1.4], [x - 10, -2.8]], fern ? "#15110d" : verlauf(T, "afterkl", 0, -6.2, 0, -1.4, [[[0, -6.2], "#4a4036"], [[0, -1.4], "#1a1511"]]));
    /* helles Haarband hängt über den Kronrand */
    o += haarSaum(T, [[x - 7, -5.4], [x - 2, -6.6], [x + 3, -6.4], [x + 8, -4.4]], 20, 1.4, [[fern ? "#a59a88" : "#efe8da", 1, 0.12, 0.8]], 1, 0.6);
    return o;
  };

  /* ---- Silhouetten ---- */
  /* Rumpf: Widerrist am höchsten (x ≈ 132), Rücken fällt leicht zur runden Kruppe, Sitzbeinhöcker als stumpfe Ecke,
     Vorbrust vor den Vorderbeinen, Bauch am Brustkorb am tiefsten, zur Flanke hochgezogen; kräftiger Hals; langer Kopf
     mit breitem, stumpfem, behaartem Maul und schwerem Unterkiefer (leichte Ramsnase) */
  const rumpf = [
    [33.6, -50], [29.6, -60], [25.4, -71], [22.6, -82], [22.4, -92], [25.4, -101], [32, -106.6], [42, -109], [50, -109.4], [68, -110], [88, -111], [106, -113.6], [120, -117.6], [132, -121.4], [142, -123.4],
    [152, -126.6], [161, -131.6], [168.6, -137], [174, -140.2], [180, -140.6], [185, -138.6], [190.4, -134.6], [196, -129.6], [202, -124.4], [207.4, -119.6],
    [211.6, -115.6], [214.2, -111.6], [215, -107.6], [214, -104], [211.4, -101.6], [207, -100.4], [202, -99.6], [196, -98], [190, -98.4], [184.6, -100.8],
    [179, -103.2], [173, -102], [167, -96], [161.6, -87], [157, -77], [153, -68.6], [146, -61], [136, -56.4], [122, -55], [106, -57.4], [90, -61.4], [74, -65.6],
    [64, -69.6], [58, -69], [54, -64], [46, -56], [40, -48],
  ];
  /* nahes Hinterbein: Oberschenkel aus der Kruppe (breit), Knie nach vorn, Sprunggelenk ≈ 140° mit Fersenhöcker, gerader Mittelfuß */
  const hbN = lauf([[40, -90], [52, -74], [58, -64], [47, -48], [38.6, -40], [36.8, -27], [37.4, -14], [38.6, -6]], [[16, 14], [13, 12], [9.4, 7.4], [6.4, 5.6], [6, 4], [3.8, 4], [3.8, 4], [4.4, 4.4]]);
  /* nahes Vorderbein: Unterarm oben breit (Muskel), zur Vorderfußwurzel verjüngt, flache Verdickung dort, Fesselgelenk über dem Huf */
  const vbN = lauf([[140, -74], [140.6, -58], [140, -44], [139.6, -38], [140, -26], [140.6, -14], [142, -6]], [[11, 11], [8, 7.6], [5.4, 5.4], [5.6, 5.8], [4.2, 4.4], [4.4, 4.4], [5, 5]]);
  const vbF = lauf([[128, -72], [126.6, -56], [125.6, -44], [125.2, -38], [125.6, -26], [126.4, -14], [128, -6]], [[8.6, 8.6], [6.8, 6.8], [5, 5], [5.2, 5.4], [3.8, 4], [4, 4], [4.6, 4.6]]);
  const hbF = lauf([[52, -86], [62, -68], [66, -60], [57, -46], [50, -39], [48.6, -26], [49.4, -14], [50.6, -6]], [[13, 11], [10, 8.4], [7.4, 6], [5.4, 5], [5.2, 3.6], [3.4, 3.8], [3.4, 3.6], [4, 4]]);
  const fellBein = verlauf(T, "rbein", 0, -70, 0, 0, [[[0, -70], "#5d4e3f"], [[0, -40], "#43362b"], [[0, -12], "#3a2e25"], [[0, -8], "#ddd3c2"], [[0, 0], "#e8e0d2"]]);
  const fellBeinF = verlauf(T, "rbeinF", 0, -70, 0, 0, [[[0, -70], "#4c4034"], [[0, -40], "#362b22"], [[0, -12], "#2e251e"], [[0, -8], "#a99e8c"], [[0, 0], "#b9ae9c"]]);

  /* ---- ferne Beine: 15–20 % dunkler, Form und Fell sichtbar ---- */
  let fi = weich([[47, -84], [60, -84], [64, -64], [54, -60], [48, -70]], "#7a6a58", 0.4, 2.4) + weich([[124, -70], [128, -70], [127, -46], [124.6, -46]], "#7a6a58", 0.4, 1);
  fi += haarL(vbF, 50, 92, 1.3, "#1d1712", "#7a6a58") + haarL(hbF, 70, (x, y) => (y < -55 ? 120 : 95), 1.4, "#1d1712", "#7a6a58");
  s += `<g filter="${vol(T, "rbF", { weich: 2.4, tiefe: 3 })}">${silhouette(T, vereint(T, [vbF, hbF]), fellBeinF, fi)}</g>`;
  s += huf(127.6, true) + huf(50, true);

  /* ---- Geweih: runde Stangen (Volumen), Rinde mit Längsrillen und Perlung, unten dunkelbraun, Enden hell poliert;
          knotige Rose am Ansatz; Krone als Schaufel mit 5 ungleichen Enden; Eissprosse nach vorn oben ---- */
  const geweih = (dx, dy, k, fern) => {
    const P = (x, y) => [dx + x * k, dy + y * k];
    const stange = [[0, 0], [-8, -10], [-18, -22], [-25, -38], [-26, -54], [-20, -66], [-9, -73], [4, -74]];
    const enden = [
      [[-25.4, -42], [-32, -48], [-38, -50.4]],              // hinterer Spross
      [[-12, -71], [-13, -82], [-16, -90]],                   // Krone: Enden unterschiedlich lang
      [[-4, -73.6], [-2, -86], [-4, -96]],
      [[3, -74], [8, -84], [9, -92]],
      [[4, -74], [13, -78], [19, -84]],
      [[3, -73], [13, -72], [20, -74]],
      [[-6.6, -9], [1, -17], [10, -21], [16, -20]],            // Eissprosse
    ];
    const farbe = fern ? verlauf(T, "geweihF", 0, dy, 0, dy - 96 * k, [[[0, dy], "#3e3226"], [[0, dy - 60 * k], "#5a4c3c"], [[0, dy - 96 * k], "#8a7e6c"]]) :
      verlauf(T, "geweih", 0, dy, 0, dy - 96 * k, [[[0, dy], "#5a4632"], [[0, dy - 40 * k], "#7d6a52"], [[0, dy - 70 * k], "#a8987e"], [[0, dy - 96 * k], "#d9cdb4"]]);
    let o = "";
    const st = stange.map(([x, y]) => P(x, y));
    o += form(T, roehre(st, 6 * k, 4.6 * k), farbe);
    for (const e of enden) o += form(T, roehre(e.map(([x, y]) => P(x, y)), 2.8 * k, 0.9 * k), farbe);
    o += form(T, [P(-14, -68), P(-11, -77), P(-4, -81), P(4, -80), P(12, -77), P(15, -73), P(10, -70.4), P(0, -71.6), P(-8, -68.6)], farbe);   // Schaufel
    if (F && !fern) {
      /* Längsrillen und Perlung im unteren Teil */
      let d = "";
      for (let i = 0; i < 3; i++) d += G(stange.slice(0, 6).map(([x, y], j) => P(x + (i - 1) * 1.2 + (j % 2 ? 0.3 : -0.3), y)), false);
      o += `<path d="${d}" fill="none" stroke="#2e2318" stroke-width=".18" stroke-opacity=".5"/>`;
      let pe = "";
      for (let i = 0; i < 26; i++) { const t = T.rnd() * 0.5, j = Math.floor(t * 7), f = t * 7 - j, a = stange[j], b = stange[j + 1]; const p = P(a[0] + (b[0] - a[0]) * f + (T.rnd() - 0.5) * 3.6, a[1] + (b[1] - a[1]) * f); pe += `M${J(p[0], p[1])}h.01`; }
      o += `<path d="${pe}" stroke="#2a2016" stroke-width=".5" stroke-linecap="round" stroke-opacity=".3"/>`;
    }
    o = `<g filter="${vol(T, "geweih" + (fern ? "f" : ""), { weich: 1.4 * k, tiefe: 4, umgebung: 0.3 })}">${o}</g>`;
    /* Rose: knotiger Ring, ≈ 1,3 × Stangendicke */
    let ro = "";
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; ro += `<circle cx="${Z(dx + Math.cos(a) * 3.4 * k)}" cy="${Z(dy + 0.6 + Math.sin(a) * 1.4 * k)}" r="${Z((0.9 + T.rnd() * 0.5) * k)}"/>`; }
    o += F ? `<g fill="${fern ? "#2e251c" : "#4a3a2a"}" filter="${vol(T, "rose", { weich: 0.5, tiefe: 3 })}">${ro}</g>` : `<ellipse cx="${Z(dx)}" cy="${Z(dy + 0.6)}" rx="${Z(4.2 * k)}" ry="${Z(2 * k)}" fill="#4a3a2a"/>`;
    return o;
  };
  /* fernes Geweih: eigene, kühlere Beleuchtung, sichtbar versetzt (nicht als Schatten) */
  s += geweih(181, -142, 0.84, true);

  /* ---- Körper, Hals, Kopf, nahe Beine ---- */
  const kD = vereint(T, [rumpf, hbN, vbN]);
  const fell = verlauf(T, "rfell2", 0, -141, 0, 0, [[[0, -141], "#6f6050"], [[0, -112], "#7a6955"], [[0, -90], "#86745e"], [[0, -74], "#8e7c64"], [[0, -60], "#6e5d4a"], [[0, -44], "#4a3d31"], [[0, -12], "#3a2e25"], [[0, -8], "#ddd3c2"], [[0, 0], "#e8e0d2"]]);
  let n = `<rect x="10" y="-146" width="210" height="147" fill="${fell}"/>`;
  /* Farbfelder mit weichen Übergängen: helles Halsfeld läuft schräg (Widerrist → Brust) aus; weißer Spiegel um den
     Schwanz, nach unten in den Oberschenkel; dunkles Flankenband vom Ellbogen zur Kniefalte; Gesicht graubraun */
  n += weich([[150, -126], [166, -134], [176, -140], [178, -126], [172, -106], [162, -88], [154, -72], [144, -76], [140, -96], [142, -116]], "#e6dfcf", 0.9, 5);
  n += weich([[130, -120], [146, -124], [144, -100], [138, -84], [132, -96]], "#c9bea9", 0.45, 6);
  n += weich([[22, -98], [28, -106], [36, -107], [37, -98], [33, -86], [30, -72], [28, -62], [24, -70], [22.6, -84]], "#f0ebe1", 0.9, 3.4);
  n += weich([[44, -84], [56, -72], [60, -64], [54, -66], [46, -76]], "#2e251d", 0.4, 2);   // Kniefalte
  n += weich([[60, -70], [80, -66], [104, -62], [126, -59], [136, -60], [120, -68], [96, -71], [70, -74]], "#3a2e24", 0.55, 2.8);
  n += weich([[62, -76], [90, -76], [118, -74], [130, -74], [116, -78], [90, -80], [64, -80]], "#d9cfbb", 0.35, 3);   // heller Streif darüber
  n += weich([[178, -136], [188, -133], [198, -124], [208, -116], [200, -112], [190, -118], [180, -124]], "#5e5040", 0.5, 2.4);
  n += weich([[196, -116], [208, -117], [214.4, -110], [212, -101.6], [198, -101]], "#c9bea9", 0.75, 1.6);   // graues, behaartes Maul
  /* Licht oben links: Rückenkante, Kruppe, Widerrist; Schulterblatt als helle schräge Fläche mit Schattenkante darunter;
     Rippenbogen und Oberschenkel als weiche Wölbungen; Bauch im Kernschatten; AO an den Beinansätzen; Kinn/Kehle */
  n += weich([[28, -102], [50, -108], [90, -109.6], [130, -119], [160, -130], [150, -124], [120, -114], [80, -106], [42, -104]], "#c9b89c", 0.45, 2.4);
  n += weich([[118, -114], [132, -118], [140, -100], [136, -84], [126, -92]], "#a8977c", 0.4, 3) + weich([[124, -90], [140, -82], [146, -76], [132, -78]], "#2e251d", 0.3, 2);
  n += weich([[30, -100], [48, -104], [58, -88], [52, -74], [38, -80]], "#a8977c", 0.32, 4);
  n += weich([[132, -66], [146, -66], [148, -60], [136, -58]], "#2e251d", 0.5, 2) + weich([[48, -70], [60, -68], [58, -62], [46, -64]], "#2e251d", 0.45, 2);
  n += weich([[176, -104], [186, -101], [198, -99.6], [186, -98], [176, -100]], "#2e251d", 0.45, 1.4);
  /* Kopf: Augenhöhle, Wange, Nasenrücken mit leichter Wölbung (Ramsnase), Kinnbart */
  n += weich([[183, -130], [192, -129], [192, -124], [184, -124]], "#2e251d", 0.35, 1.2);
  n += weich([[188, -134], [198, -127], [208, -119], [202, -120], [192, -126]], "#8f7e65", 0.5, 1.4);
  n += weich([[176, -116], [190, -112], [198, -107], [186, -105], [176, -108]], "#2e251d", 0.3, 2.4);
  /* Gelenke: Vorderfußwurzel (flache Verdickung, Licht vorn), Fersenhöcker hinten, Kniefalte; Sehnen am Lauf */
  n += weich([[136, -41], [139, -42], [139, -35], [136.4, -35]], "#7a6a58", 0.5, 0.8) + weich([[29.6, -48], [32.6, -46], [32, -40], [29.6, -42]], "#7a6a58", 0.5, 0.8);
  n += zart(T, [[33.8, -36], [33.4, -26], [34, -14]], "#1c1612", 0.4, 0.4) + zart(T, [[143.2, -34], [143.4, -24], [143.8, -14]], "#1c1612", 0.35, 0.35);
  /* Fell: Wuchsrichtung Kopf → hinten, Flanke nach hinten unten, Beine nach unten; Längen variieren
     (Rumpf kurz, Hals und Bauch länger, Beine kurz und anliegend) */
  const wuchs = (x, y) => (x > 176 ? 168 : x > 146 ? 112 : y > -64 ? 94 : 168 + (y + 90) * 0.6);
  n += haarL(rumpf.filter((p) => p[0] < 186), 340, wuchs, 1.6);
  n += haare(T, [[150, -124], [166, -132], [172, -116], [168, -100], [162, -88], [154, -76], [148, -92]], 120, 104, 3.2, [["#ffffff", 1, 0.11, 0.6], ["#a99a80", 0.6, 0.11, 0.45]], 14, 0.3, 0.03);
  n += haarL([[60, -70], [100, -64], [136, -62], [130, -57.6], [100, -59.6], [62, -66]], 50, 100, 2.4, "#2b2219", "#a8987e");
  n += haarL(vbN, 70, 92, 1.1, "#1a140f", "#8a7a64") + haarL(hbN, 100, (x, y) => (y < -62 ? 125 : y < -44 ? 70 : 94), 1.2, "#1a140f", "#8a7a64");
  n += haare(T, [[196, -116], [208, -117], [214, -110], [212, -102], [196, -101]], 70, 196, 0.7, [["#7a6a56", 1, 0.07, 0.5], ["#efe7d8", 0.8, 0.07, 0.6]], 20, 0.2, 0.1);
  s += `<g filter="${vol(T, "rrumpf", { weich: 9, tiefe: 8, umgebung: 0.3 })}">${silhouette(T, kD, fell, n)}</g>`;
  /* Kehlmähne: lange, helle Haare in welligen Strähnen von der Kehle bis zur Brust, hängen unter die Halskontur */
  const maehne = [[176, -104], [170, -101], [165, -94], [160, -86], [156, -77], [152, -69], [147, -63.4]];
  s += F ? buschel(T, [[178, -104], [166, -98], [158, -82], [150, -66], [144, -62], [148, -72], [156, -88], [166, -100]], 46, 108, 6, 0.6, ["#9a8b72", 0.35], ["#f6f1e6", 0.7], 18) : "";
  s += haarSaum(T, maehne, 90, 5.4, [["#efe9dc", 1, 0.16, 0.8], ["#c9bea9", 0.6, 0.16, 0.7], ["#8a7c66", 0.3, 0.14, 0.5]], -1, 0.5, 0.15);
  /* Konturhaare: unregelmäßige Büschel an Rücken, Bauch, Kruppe */
  s += haarSaum(T, [[28, -103.4], [36, -108], [50, -109.8], [68, -110.4], [88, -111.4], [106, -114], [120, -118], [132, -121.8], [142, -123.8], [152, -127], [161, -132]], 90, 1.6, [["#8f7f68", 1, 0.1, 0.6], ["#d9cdb6", 0.6, 0.09, 0.6]], -1, -0.5);
  s += haarSaum(T, [[136, -58.6], [122, -57.4], [106, -59.6], [90, -62.4], [74, -64.6]], 60, 2.6, [["#3a2e24", 1, 0.11, 0.6], ["#7a6a56", 0.5, 0.1, 0.5]], -1, 0.2);
  /* Schwanz: kurz, auf dem weißen Spiegel, hängt nach unten; oben dunkler, Unterseite weiß, lange weiche Haare */
  s += `<g filter="${vol(T, "rschw", { weich: 1.4, tiefe: 3 })}">` + form(T, [[30, -104.6], [25.6, -103.8], [22.6, -99.6], [22.4, -94], [24.6, -92], [27.4, -95.6], [29.6, -100]], verlauf(T, "rschw", 22, 0, 30, 0, [[[22, 0], "#f2ede3"], [[26, 0], "#e6dfd2"], [[30, 0], "#8a7a66"]])) + `</g>`;
  s += haarSaum(T, [[25.6, -103.8], [22.6, -99.6], [22.4, -94], [24.6, -92]], 30, 1.6, [["#f4efe6", 1, 0.1, 0.8]], 1, 0.4);

  /* ---- Hufe ---- */
  s += huf(142, false) + huf(38.6, false);

  /* ---- Ohr: kurz, rund, dicht behaart, seitlich unter der Geweihbasis, schräg nach hinten; helles Innenfell ---- */
  const ohr = [[171.6, -134.6], [166.6, -137.6], [162.2, -141.6], [161.8, -144.6], [165, -145.2], [170.6, -142.2], [175, -138.6]];
  s += `<g filter="${vol(T, "rohr", { weich: 1.2, tiefe: 3 })}">${silhouette(T, G(ohr), verlauf(T, "rohr", 162, 0, 175, 0, [[[162, 0], "#7d6c58"], [[175, 0], "#5a4b3c"]]),
    weich([[164, -143.4], [169.6, -142.6], [172.6, -139.4], [167.6, -140.6]], "#e6dfcf", 0.6, 0.6) + haarL(ohr, 40, -160, 0.9, "#2e251d", "#efe6d4"))}</g>`;
  s += haarSaum(T, [[171.6, -134.8], [166.6, -137.8], [162.2, -141.8], [161.8, -144.8]], 24, 0.8, [["#d9cdb6", 1, 0.08, 0.7]], 1, -0.3);
  /* ---- nahes Geweih ---- */
  s += geweih(176, -140, 0.94, false);
  /* Augsprosse: senkrechte, schaufelförmige Platte, die vor der Stirn nach vorn unten über den Nasenrücken ragt,
          vorne gezackt mit 4 Enden; eigene Rundung, Schatten auf dem Nasenrücken */
  {
    /* Stiel aus der Rose nach vorn oben, dann die senkrechte Schaufel nach vorn unten vor der Stirn; Enden an der
       Unterkante zeigen nach vorn unten über den Nasenrücken */
    const sch = [[177.4, -141.4], [181, -145.6], [185, -147.4], [188.4, -146.6], [191.6, -144.4], [194.6, -141], [197.4, -137.4], [199.6, -133.6],
      [202.6, -130.6], [199.4, -131], [200.4, -127.4], [197.4, -129.2], [197.2, -125.4], [194.6, -128.4], [193.4, -125.8], [191.8, -130.6],
      [189.4, -135.6], [186, -140], [182.4, -142.4], [179.4, -140]];
    s += weich([[188, -127], [196, -124], [200, -122.6], [192, -122]], "#2e251d", 0.3, 1.2);
    s += `<g filter="${vol(T, "raug", { weich: 1.2, tiefe: 4 })}">${silhouette(T, G(sch), verlauf(T, "rsch", 180, -146, 200, -126, [[[180, -146], "#4e3d2c"], [[190, -138], "#6e5a44"], [[197, -130], "#8f7c62"], [[201, -126], "#cfc1a6"]]),
      fein(T, zart(T, [[181, -143.6], [186, -145], [191, -142], [195.6, -136]], "#2e2318", 0.18, 0.5) + zart(T, [[184, -144.6], [189, -143.6], [193.4, -139]], "#c9b89a", 0.2, 0.45)))}</g>`;
  }

  /* ---- Gesicht: Auge 15 % größer in kleiner Höhle, feine Wimpern nur oben, weiche Voraugendrüse; Nasenlöcher als
          zwei schräge Schlitze im hellgrauen Fell (kein nackter Nasenspiegel); Mundspalte weich; Kinnbart ---- */
  s += weich([[183.6, -128.6], [190, -128.4], [190.4, -126.4], [184, -126.4]], "#2e251d", 0.4, 0.8);
  s += T.augeReal(187, -125.8, 2.1, { iris: "#3a2414", iris2: "#140a04", offen: 0.64, winkel: 20, weiss: false, lid: "#120d09", wimpern: 11, wimpernLaenge: 0.5, wimpernFarbe: "#2a1e14" });
  s += weich([[190.6, -123.4], [193.6, -121.2], [193, -120.4], [190.2, -122.4]], "#2e251d", 0.4, 0.5);
  s += `<path d="M209.4 -112.4q2 -.5 3 .9q-1.3 -.2 -2.6 .2zM211.2 -110.4q1.4 -.1 2 .8q-.9 -.2 -1.8 0z" fill="#2a2018" opacity=".85"/>`;
  s += zart(T, [[212.2, -112.8], [214, -111]], "#f2ede3", 0.25, 0.5);
  s += weich([[200, -101.6], [208, -102.2], [213, -103.4], [208, -101], [200, -100.6]], "#2e251d", 0.55, 0.5);
  s += haarSaum(T, [[202, -99.6], [196, -98], [190, -98.4], [184.6, -100.8]], 30, 1.6, [["#cfc6b4", 1, 0.09, 0.8], ["#6a5a48", 0.5, 0.09, 0.6]], -1, 0.3);
  s += fein(T, T.schnurrhaare(206, -103.4, 6, 3.4, 30, 30, "#efe7d8", 0.07));
  return { svg: s, box: [22.4, -230.6, 215, 0], fuesse: [38.6, 50, 127.6, 142], kopf: [158, -160, 220, -92] };
}

/* =====================================================================
   MOSCHUSOCHSE
   ===================================================================== */
/* RECHERCHE Moschusochse (Ovibos moschatus) – Websuche-Kontingent erschöpft, aus Fachwissen: Kopf-Rumpf 190–230 cm,
   Schulterhöhe 120–150 cm, Bullen 250–400 kg. Wirkt durch das Fell riesig und kastenförmig: lange, dunkelbraune bis
   schwarze Grannenhaare („Rock“) hängen fast bis zum Boden, darunter die feine Unterwolle (Qiviut). Hoher Buckel über
   den Schultern, kurzer Hals, großer Kopf tief getragen. Hörner der Bullen: an der Basis zu einer breiten, gewölbten
   Platte („Boss“) über der Stirn verwachsen, laufen seitlich am Kopf herab, biegen dann nach vorn-außen und oben;
   Spitzen hell, Basis/Platte hell hornfarben bis grau. Heller „Sattel“ (cremefarben) auf dem Rücken hinter dem Buckel,
   helle Beine unter dem Fellrock („Socken“), Stirn und Schnauze mit helleren, gräulichen Haaren, Nasenspiegel klein,
   Augen dunkel, Ohren klein und im Fell versteckt, Schwanz sehr kurz, Hufe groß und rund. */
function moschusochse(T) {
  let s = "";
  const F = T.fein !== false;
  const weich = (pts, farbe, op, sd) => weichForm(T, pts, farbe, op, sd);
  /* lange, wellige Grannenhaar-Strähnen in drei Schichten: hinten dunkel, Mitte, helle Spitzen; in Locken-Gruppen */
  const strang = (pts, k, w, L, sz = 0.04) => haare(T, pts, k, w, L, [["#140e0a", 1, 0.2, 0.55], ["#4a3526", 1, 0.18, 0.55], ["#7a6048", 0.55, 0.15, 0.55]], 8, 0.35, sz);
  const locke = (pts, k, w, L, br) => buschel(T, pts, k, w, L, br, ["#0c0806", 0.35], ["#6a5240", 0.35], 10, 0.05);
  /* Huf: breit, rund, zwei Klauen mit Spalt, kleine Afterklaue, helle Abriebkante */
  const huf = (x, fern, gr = 1) => {
    const h1 = [[x - 5.6 * gr, -5.4], [x + 0.6, -6], [x + 4 * gr, -3.2], [x + 4.8 * gr, 0, 1], [x - 6 * gr, 0, 1], [x - 6.4 * gr, -2.6]];
    const h2 = [[x + 1.2, -5.6], [x + 4.6 * gr, -5], [x + 7.6 * gr, -2.2], [x + 8.4 * gr, 0, 1], [x + 3.4 * gr, 0, 1], [x + 3 * gr, -2.8]];
    const g = fern ? "#1a1612" : verlauf(T, "mhuf", 0, -6, 0, 0, [[[0, -6], "#3e3832"], [[0, -2], "#1c1814"], [[0, 0], "#3a332c"]]);
    let o = `<g filter="${vol(T, "mhuf", { weich: 0.8, tiefe: 3 })}">` + form(T, h2, g) + form(T, h1, g) + `</g>`;
    o += zart(T, [[x + 2.4 * gr, -5.6], [x + 4 * gr, -0.2]], "#080605", 0.4, 0.8);
    o += fein(T, zart(T, [[x - 5.6, -0.5], [x + 7.6, -0.5]], fern ? "#3a332c" : "#8a8070", 0.3, 0.55));
    o += form(T, [[x - 8.4, -6.6], [x - 6.4, -7.2], [x - 5.6, -4.4], [x - 7.2, -3.4], [x - 9, -4.6]], fern ? "#14110e" : "#2a241e");
    return o;
  };

  /* ---- ferne Beine: helle Strümpfe, 15 % dunkler, Fesselgelenk als Verdickung ---- */
  const bein = (x) => [[x - 4.6, -34], [x + 4.6, -34], [x + 4.4, -20], [x + 5.2, -10], [x + 4.6, -5], [x - 4.6, -5], [x - 5.2, -10], [x - 4.4, -20]];
  const sockF = verlauf(T, "msockF", 0, -34, 0, -5, [[[0, -34], "#3e342a"], [[0, -24], "#7a6e5c"], [[0, -5], "#6a5f50"]]);
  s += `<g filter="${vol(T, "mbF", { weich: 1.6, tiefe: 3 })}">${silhouette(T, vereint(T, [bein(171), bein(68)]), sockF, haare(T, bein(171).concat(bein(68)), 70, 96, 1.2, [["#2a231c", 1, 0.1, 0.5], ["#a89c88", 0.6, 0.1, 0.4]], 14, 0.2, 0.1))}</g>`;
  s += huf(172, true) + huf(69, true);
  /* fernes Horn: nur der Haken vor dem Gesicht sichtbar, kühler, dunkler */
  s += `<g filter="${vol(T, "mhornF", { weich: 0.8, tiefe: 3 })}">` + form(T, [[234, -92], [238.4, -95.6], [241.4, -100.6], [242.4, -104.4], [239.6, -102], [236, -97.8], [232.4, -94]], verlauf(T, "mhornF", 0, -92, 0, -104, [[[0, -92], "#5a524a"], [[0, -104], "#141210"]])) + `</g>`;

  /* ---- Körper: Buckel über den Schultern, Rücken zur runden Kruppe abfallend (≈ 11 % tiefer), Heck als herabhängende
          Haarkaskade, Rock bis knapp über den Boden; Kopf groß, tief getragen und leicht abwärts gedreht ---- */
  const rumpf = [
    [36, -116], [30, -108], [25.4, -96], [22.6, -82], [21.4, -66], [22.4, -50], [25.6, -36], [30.6, -27], [38, -23.4], [46, -22], [52, -24], [60, -23.6], [70, -20], [80, -16.4],
    [92, -13.4], [104, -12.2], [116, -13.4], [126, -12], [138, -13.6], [150, -15.6], [162, -19], [168, -22.6], [176, -21.4], [184, -23.4], [192, -22], [200, -28], [208, -36], [214, -45], [220, -54.4], [226, -60],
    [233, -62], [239.6, -62.4], [244.4, -64.8], [246.6, -68.4], [246.6, -73], [244.6, -79], [241.4, -86.4], [237.8, -95], [233.6, -104], [228.6, -112.4],
    [222.6, -119.4], [215.4, -124.2], [207, -126.4], [199, -127.2], [192, -131], [184, -138.6], [174, -144.4], [162, -146], [148, -143.6], [132, -137.4],
    [114, -131], [94, -127], [72, -125.4], [52, -122.6],
  ];
  const kD = G(rumpf);
  const fell = verlauf(T, "mfell", 0, -147, 0, 0, [[[0, -147], "#4a3a2c"], [[0, -124], "#3c2e22"], [[0, -90], "#2e2219"], [[0, -50], "#241a13"], [[0, -22], "#1a120d"], [[0, 0], "#1a120d"]]);
  let n = `<rect x="15" y="-150" width="236" height="151" fill="${fell}"/>`;
  /* heller, cremebrauner Sattel über der Rückenmitte (≈ 30 % der Rumpflänge), weich ins dunkle Haar auslaufend */
  n += weich([[78, -125.6], [96, -128], [116, -132], [134, -138], [140, -132], [124, -124], [104, -119], [84, -118]], "#b7a285", 0.85, 3.6);
  n += weich([[86, -126], [104, -128.6], [124, -134], [118, -128], [100, -123]], "#cbb898", 0.45, 2);
  /* warme Glanzkämme an Buckel und Rücken (Licht oben links), Kernschatten im Rock, AO unter dem Kopf */
  n += weich([[140, -138], [160, -144.4], [178, -140], [170, -136], [152, -136]], "#7a6048", 0.5, 2.4);
  n += weich([[40, -116], [60, -122], [80, -124], [60, -118], [42, -110]], "#5a4636", 0.45, 3);
  n += weich([[30, -30], [80, -24], [140, -24], [190, -28], [204, -40], [180, -40], [130, -38], [80, -38], [36, -42]], "#0a0705", 0.55, 4);
  n += weich([[196, -64], [214, -58], [226, -64], [222, -76], [204, -74]], "#0a0705", 0.45, 3);
  n += weich([[190, -126], [200, -124], [208, -108], [200, -98], [190, -106]], "#0a0705", 0.3, 4);   // Nacken unter dem Boss
  /* Gesicht: kurzes, dichtes, dunkles Fell; Stirn/Nasenrücken etwas grauer; Maul hellgrau bis weißlich behaart */
  n += weich([[226, -112], [234, -102], [240, -90], [236, -88], [228, -100]], "#5a4a3c", 0.5, 1.6);
  n += weich([[236, -90], [243, -82], [246.4, -72], [242, -64.4], [234, -66], [233, -78]], "#bdb5a6", 0.85, 1.4);
  n += weich([[234, -68], [242, -64.4], [244, -64], [236, -63]], "#3a3028", 0.55, 0.8);   // Lippen-Schattenfalte
  /* Haar: Scheitel entlang der Rückenlinie, Strähnen fallen über die Wölbung; an der Schulter über den Buckel
     geschwungen, am Heck nach hinten unten, Flanke senkrecht, Bart/Hals nach unten, Gesicht kurz nach vorn unten */
  const wuchs = (x, y) => (x > 226 ? 70 : x > 196 ? (y < -100 ? 100 : 90) : x < 44 ? 104 + (44 - x) * 0.8 : y < -118 ? 100 + (x - 150) * 0.12 : 88 + (x - 120) * 0.04);
  const rumpfH = rumpf.filter((p) => p[0] < 226);
  n += locke(rumpfH, 150, wuchs, 14, 0.9);
  n += strang(rumpfH, 330, wuchs, 10);
  /* Sattel: kürzere, wolligere, hellere Haare */
  n += fein(T, haare(T, [[82, -126], [104, -129], [130, -137], [124, -126], [100, -120]], 160, 150, 1.6, [["#d8c6a8", 1, 0.09, 0.6], ["#7a6450", 0.7, 0.09, 0.5]], 50, 0.6));
  /* Gesicht: feine, kurze Strichel nach vorn unten */
  n += haare(T, [[212, -122], [226, -116], [236, -100], [240, -90], [232, -80], [222, -90], [214, -106]], 120, 70, 0.8, [["#120c08", 1, 0.07, 0.5], ["#6a5848", 0.8, 0.07, 0.5]], 14, 0.2, 0.08);
  n += haare(T, [[236, -90], [243, -82], [246, -72], [242, -65], [234, -67]], 50, 80, 0.6, [["#efe8dc", 1, 0.06, 0.6], ["#7a7062", 0.6, 0.06, 0.5]], 16, 0.2, 0.1);
  s += `<g filter="${vol(T, "mrumpf", { weich: 9, tiefe: 7, umgebung: 0.32 })}">${silhouette(T, kD, fell, n)}</g>`;
  /* Gegenlicht-Saum an den Konturhaaren oben */
  s += haarSaum(T, [[30, -108], [36, -116], [52, -122.8], [72, -125.6], [94, -127.2], [114, -131.2], [132, -137.6], [148, -143.8], [162, -146.2], [174, -144.6], [184, -138.8], [192, -131.2]], 120, 2.6, [["#8c7258", 1, 0.12, 0.6], ["#2a1e16", 0.8, 0.14, 0.6]], -1, -0.3);
  /* Heck: lange, nach unten hängende Haarkaskade */
  s += haarSaum(T, [[30, -108], [25.4, -96], [22.6, -82], [21.4, -66], [22.4, -50], [25.6, -36], [30.6, -26]], 90, 5, [["#2a1e16", 1, 0.2, 0.7], ["#4a3526", 0.8, 0.18, 0.6], ["#7a6048", 0.3, 0.14, 0.5]], 1, 0.7);
  /* Rocksaum: unregelmäßig, in der Bauchmitte und an der Brust am längsten, an den Beinen angehoben; einzelne,
     spitz auslaufende Strähnen-Enden (Länge schwankt stark) */
  /* ---- nahe Beine: helle Strümpfe, kurz, raues Haar nach unten, Fesselgelenk; Rockschatten oben ---- */
  const sock = verlauf(T, "msock", 0, -21, 0, -5, [[[0, -21], "#6a5c4c"], [[0, -16], "#b0a28a"], [[0, -11], "#c9bca4"], [[0, -5], "#a89a84"]]);
  const beinN = (x) => bein(x).map(([a, b]) => [a, Math.max(b, -21)]);
  s += `<g filter="${vol(T, "mbN", { weich: 1.8, tiefe: 3.5 })}">${silhouette(T, vereint(T, [beinN(187), beinN(55)]), sock,
    haare(T, beinN(187).concat(beinN(55)), 120, 94, 1.3, [["#4a3d31", 1, 0.1, 0.5], ["#efe6d4", 0.8, 0.1, 0.5]], 16, 0.25, 0.1) + weich([[50, -30], [60, -30], [60, -22], [50, -22]], "#0a0705", 0.55, 1.6) + weich([[182, -30], [192, -30], [192, -22], [182, -22]], "#0a0705", 0.55, 1.6))}</g>`;
  s += huf(188, false, 1.08) + huf(56, false);

  {
    /* Strähnen: an der Wurzel breit, lang, leicht gewellt und spitz auslaufend, in zwei Tönen */
    let d1 = "", d2 = "", d3 = "";
    const k = F ? 130 : 36, saum = rumpf.slice(rumpf.findIndex((p) => p[0] === 38), rumpf.findIndex((p) => p[0] === 192) + 1);
    for (let i = 0; i < k; i++) {
      const t = (i + T.rnd()) / k * (saum.length - 1), j = Math.min(saum.length - 2, Math.floor(t)), fr = t - j;
      const x = saum[j][0] + (saum[j + 1][0] - saum[j][0]) * fr, y = saum[j][1] + (saum[j + 1][1] - saum[j][1]) * fr;
      const L = (4 + T.rnd() * 8) * (y < -20 ? 0.6 : 1), w = 0.5 + T.rnd() * 0.5, a = (90 + (T.rnd() - 0.5) * 24) * Math.PI / 180, kk = (T.rnd() - 0.5) * 2.4;
      const ex = Math.cos(a) * L, ey = Math.sin(a) * L, y0 = y - 5 - T.rnd() * 3;
      const p = `M${J(x - w, y0)}c${J(0, L * 0.4, kk, L * 0.6, ex + kk * 0.3, ey + 5)}c${J(-kk * 0.2, -L * 0.3, w * 2 - kk, -L * 0.5, w * 2 - ex - kk * 0.3, -ey - 5)}z`;
      const u = T.rnd(); if (u < 0.45) d1 += p; else if (u < 0.85) d2 += p; else d3 += p;
    }
    s += `<path d="${d1}" fill="#1a120d"/><path d="${d2}" fill="#32241a"/><path d="${d3}" fill="#5a4434"/>`;
  }
  /* ---- Bart: langes Haar unter Kinn und Kehle geht in die Halsmähne über ---- */
  s += haarSaum(T, [[239, -62.6], [233, -62], [226, -60], [220, -54.4], [214, -45], [208, -36], [200, -28]], 80, 6, [["#1e1610", 1, 0.2, 0.75], ["#3e2e22", 0.7, 0.18, 0.65]], 1, 0.4);

  /* ---- Ohr: klein, rund, behaart, fast im Fell versteckt, hinter dem Horn ---- */
  s += `<g filter="${vol(T, "mohr", { weich: 0.8, tiefe: 3 })}">` + form(T, [[208, -117], [204.4, -118.6], [202.6, -116], [204, -112.6], [207.6, -113]], "#3a2c20") + `</g>`;

  /* ---- Horn: breite, gewölbte, rissige Platte (Boss) über der ganzen Stirn bis knapp über die Augen, mittlere Längsrinne;
          das Horn läuft flach am Kopf nach unten, biegt hinter und unter dem Auge nach vorn außen und mit der dunklen
          Spitze nach oben vorn (Spitze auf Augenhöhe). Basis cremegrau → mittig grau → letzte 35 % dunkelgrau bis schwarz ---- */
  const horn = [[198, -125.4], [204, -130.4], [212, -132], [220, -130.4], [226.4, -126], [229.6, -119.6], [228.6, -113.4], [226.4, -108.4], [225.4, -101.4], [226.6, -94.6],
    [230.2, -89.6], [235, -88.2], [239.2, -90.4], [241.8, -95], [242.6, -100.8], [242.4, -103.4, 1], [240, -99.8], [237.6, -96], [234.6, -94.4], [231.4, -95.6],
    [229.4, -99.6], [221.6, -101.6], [220, -108.6], [219.2, -115.4], [213, -120], [204, -121.6]];
  let hi = weich([[200, -127], [210, -131], [220, -129.6], [212, -126]], "#f2ece0", 0.65, 1);
  hi += weich([[221, -114], [224.6, -104], [223, -98], [220.4, -106]], "#2a241e", 0.45, 1);
  if (F) {
    let d = "";
    for (let i = 0; i < 7; i++) d += G([[201 + i * 0.6, -126 + i * 0.2], [207 + i * 0.4, -129 + i * 0.6], [214 + i * 0.4, -129.4 + i * 0.7], [221 + i * 0.3, -126.6 + i * 0.8]], false);   // Risse, Rauheit
    hi += `<path d="${d}" fill="none" stroke="#6a6052" stroke-width=".22" stroke-opacity=".55"/>` + zart(T, [[206, -129.6], [213, -131], [220, -129]], "#4a4038", 0.35, 0.5);
    let q = "";
    for (let i = 0; i < 8; i++) { const t = i / 7, y = -118 + t * 24, x = 220 + Math.sin(t * 2.2) * 2.4; q += `M${J(x - 1.4, y)}q${J(2, 0.6, 4.6, 0)}`; }   // Querriefen
    hi += `<path d="${q}" fill="none" stroke="#3e362e" stroke-width=".2" stroke-opacity=".5"/>`;
  }
  s += `<g filter="${vol(T, "mhorn", { weich: 1.4, tiefe: 4, umgebung: 0.32 })}">${silhouette(T, G(horn), verlauf(T, "mhorn", 204, -128, 242, -100, [[[204, -128], "#cfc4ae"], [[222, -112], "#b0a592"], [[226, -96], "#8e8576"], [[232, -91], "#4a4038"], [[242, -100], "#141210"]]), hi)}</g>`;
  s += weich([[228, -94], [236, -90], [238, -88], [230, -89]], "#0a0705", 0.4, 1);   // Schlagschatten des Horns

  /* ---- Auge: klein, dunkel, ins Fell gebettet (Ober- und Unterlid aus kurzen Haaren), dunkler feuchter Lidrand,
          kleines Glanzlicht; das Horn läuft knapp dahinter und darunter vorbei ---- */
  s += T.augeReal(231.6, -104.6, 1.15, { iris: "#3a2214", iris2: "#120904", offen: 0.66, winkel: 14, weiss: false, lid: "#0d0907" });
  s += fein(T, haare(T, [[229, -107.6], [234.6, -107.2], [234.4, -106], [229, -106.2]], 18, 60, 0.6, [["#3a2e24", 1, 0.06, 0.8]], 20, 0.3) + haare(T, [[229.4, -103.2], [234, -102.8], [233.8, -101.8], [229.4, -102]], 12, 100, 0.5, [["#3a2e24", 1, 0.06, 0.7]], 20, 0.3));
  /* Nasenspiegel klein, dunkel, feucht glänzend; Nasenloch; Lippe als weiche Schattenfalte */
  s += form(T, [[243, -73.4], [245.6, -72], [246.6, -69.4], [245.4, -67.6], [243, -68.2], [242.4, -70.8]], verlauf(T, "mnase", 0, -73.4, 0, -67.6, [[[0, -73.4], "#4a4440"], [[0, -67.6], "#141210"]]));
  s += `<path d="M244.6 -70.6q1.2 -.4 1.6 .7q-.7 .3 -1.2 .2z" fill="#050404"/><ellipse cx="244" cy="-72.6" rx=".5" ry=".2" fill="#fff" opacity=".5"/>`;
  return { svg: s, box: [21.4, -146, 246.6, 0], fuesse: [56, 69, 172, 188], kopf: [196, -140, 250, -56] };
}

/* =====================================================================
   SCHNEEEULE
   ===================================================================== */
/* RECHERCHE Schneeeule (Bubo scandiacus) – Websuche-Kontingent erschöpft, aus Fachwissen: Länge 52–71 cm,
   Spannweite 125–150 cm, Weibchen größer. Großer, runder Kopf ohne Federohren, kompakter Körper, steht aufrecht auf
   dem Boden (Tundra) mit leicht vorgeneigter Brust. Männchen fast rein weiß, Weibchen und Jungvögel mit dunkelbraunen
   Querbändern/Pfeilflecken auf Rücken, Flügeln, Flanke und Scheitel, Gesicht und Brust heller. Augen groß, leuchtend
   gelb, nach vorn gerichtet, schwarzer Lidrand; Schnabel schwarz, gebogen, fast ganz in den Gesichtsfedern versteckt;
   Gesichtsschleier flach. Beine und Zehen dicht befiedert („Hosen“, Zehen wie Pfoten), schwarze, gebogene Krallen
   ragen heraus. Flügel lang, breit, Handschwingen reichen fast bis zur Schwanzspitze; Schwanz kurz, gerundet.
   Kopf zum Betrachter gedreht (Eulen drehen den Kopf bis 270°). Hier: Weibchen mit kräftiger Bänderung. */
function schneeeule(T) {
  let s = "";
  const F = T.fein !== false;
  const weich = (pts, farbe, op, sd) => weichForm(T, pts, farbe, op, sd);
  const weiss = verlauf(T, "ewe", 0, -66, 0, 0, [[[0, -66], "#ffffff"], [[0, -48], "#fbfbf8"], [[0, -30], "#eef1f4"], [[0, -14], "#d8dfe7"], [[0, -5], "#c3cdd8"], [[0, 0], "#d4dde6"]]);
  /* schmale, leicht wellige, oft unterbrochene Querbinden; folgen der Wölbung (an den Rändern nach unten gebogen und
     verkürzt); dick = Bandhöhe (cm), dichte f(x, y) 0..1 */
  const binden = (pts, y0, y1, abst, dick, farbe, op, dichte, bogen = 0.012, xc = 28) => {
    let d = "";
    for (let y = y0; y < y1; y += abst * (0.85 + T.rnd() * 0.3)) {
      for (let x = 0; x < 46; x += 1.2 + T.rnd() * 1.8) {
        const L = 1.2 + T.rnd() * 2.4, yy = y + Math.pow(x - xc, 2) * bogen + (T.rnd() - 0.5) * 0.4, xe = x + L;
        if (!inPoly(x, yy, pts) || !inPoly(xe, yy, pts) || T.rnd() > dichte(x, yy)) { x += 0.6; continue; }
        const rand = Math.min(1, Math.min(...[x, xe].map((v) => 1 - Math.abs(v - xc) / 18))), h = dick * Math.max(0.4, rand) * (0.7 + T.rnd() * 0.5);
        const ye = y + Math.pow(xe - xc, 2) * bogen, w = (T.rnd() - 0.5) * 0.5;
        d += `M${J(x, yy)}q${J(L / 2, w - h * 0.4, L, ye - yy)}q${J(-L / 2, h * 1.6 - w, -L, yy - ye)}z`;
        x = xe;
      }
    }
    return d ? `<path d="${d}" fill="${farbe}" fill-opacity="${op}"${F ? ` filter="${blur(T, 0.06, 0.1)}"` : ""}/>` : "";
  };

  /* ---- Schwanz: kurz (≈ 10 % der Höhe), 4–5 breit gebänderte Federn, gerades Ende, schräg nach hinten unten ---- */
  const schwanz = [[11, -12.4], [6, -9.6], [1.6, -6.4], [-0.6, -4.6], [0.4, -3.6], [5, -5], [10.4, -7.6], [13.4, -9]];
  let si = "";
  for (let i = 0; i < 4; i++) si += zart(T, [[12, -11 + i * 0.8], [6, -8.4 + i * 0.6], [0.4 + i * 0.4, -5 + i * 0.3]], "#9aa8b9", 0.07, 0.8);
  for (const t of [0.3, 0.58, 0.84]) { const x = 12 - 12.4 * t, y = -11.6 + 7.6 * t; si += `<path d="M${J(x - 1.6, y - 3)}l${J(3.2, 6)}" stroke="#3e3024" stroke-width="1" stroke-opacity=".7"${F ? ` filter="${blur(T, 0.1, 0.25)}"` : ""}/>`; }
  s += `<g filter="${vol(T, "eschw", { weich: 0.8, tiefe: 3 })}">${silhouette(T, G(schwanz), "#e6ebf0", si)}</g>`;

  /* ---- Körper + Kopf als EINE Form: Kopf breit, oben flacher, geht ohne Hals breit in die Schultern über ---- */
  const koerper = [
    [12, -12], [9.6, -22], [9.2, -32], [10.4, -42], [12.6, -50], [15, -56.6], [17.6, -61.4], [21.4, -64.4], [27, -65.6], [33, -65.2], [37.8, -62.8], [41, -58.6],
    [42.2, -53.6], [41.8, -48.6], [41.4, -44.6], [42.2, -38], [42.4, -30], [41, -21.4], [37.8, -13.6], [32.4, -7.6], [25.4, -5.6], [18.4, -6.8], [14.4, -9],
  ];
  let n = `<rect x="0" y="-70" width="48" height="71" fill="${weiss}"/>`;
  /* Licht oben links: Kopf oben und Schulter am hellsten; Brust EINE Wölbung, Kernschatten rechts unten; Schnee-Reflex unten */
  n += weich([[16, -60], [24, -65], [34, -64], [28, -60], [18, -54]], "#ffffff", 1, 2);
  n += weich([[34, -32], [41, -30], [40, -18], [34, -12], [30, -18]], "#9aa9bd", 0.45, 3);
  n += weich([[20, -8], [30, -7], [38, -13], [30, -11], [22, -10]], "#e2eaf2", 0.7, 1.2);
  n += weich([[24, -46], [34, -45], [40, -43], [32, -42], [26, -43]], "#8d9bb0", 0.4, 1.4);   // Kinnschatten (AO) auf der Brust
  /* Gesichtsschleier: flache Mulden um die Augen mit weichem Schatten außen, kaum sichtbarer Rand aus Federspitzen */
  n += weich([[19, -58], [22, -61.6], [26, -61.4], [24, -57]], "#a9b6c6", 0.35, 1.4) + weich([[38.4, -58], [36.6, -61.4], [33, -61.4], [35, -57]], "#a9b6c6", 0.35, 1.4);
  n += weich([[18.6, -53], [20, -48.6], [24, -46.8], [21, -50]], "#a9b6c6", 0.35, 1.2) + weich([[40.4, -53], [39.4, -48.6], [35.6, -46.8], [38.6, -50]], "#a9b6c6", 0.35, 1.2);
  if (F) {
    let d = "";
    for (const [cx, cy] of [[25.6, -55.4], [34.6, -55.4]]) for (let i = 0; i < 22; i++) {
      const a = i / 22 * Math.PI * 2 + T.rnd() * 0.2, r0 = 2.4, r1 = 4.4 + T.rnd() * 1.2, k = 0.6;
      const x0 = cx + Math.cos(a) * r0, y0 = cy + Math.sin(a) * r0, x1 = cx + Math.cos(a + 0.2) * r1, y1 = cy + Math.sin(a + 0.2) * r1;
      d += `M${J(x0, y0)}Q${J((x0 + x1) / 2 - Math.sin(a) * k, (y0 + y1) / 2 + Math.cos(a) * k, x1, y1)}`;
    }
    n += `<path d="${d}" stroke="#7d8ca2" stroke-width=".07" stroke-opacity=".12" fill="none"/>`;
  }
  /* Scheitel: feine dunkle Tropfen, dichter am Hinterkopf, zur Stirn auslaufend; Gesicht frei */
  {
    let d = "";
    const k = F ? 44 : 14;
    for (let i = 0; i < k; i++) {
      const x = 16 + T.rnd() * 24, y = -66 + T.rnd() * 7;
      if (!inPoly(x, y, koerper) || T.rnd() > 1 - (x - 16) / 30 || (y > -61 && x > 20 && x < 39)) continue;
      const r = 0.2 + T.rnd() * 0.18;
      d += `M${J(x, y - r)}q${J(r, r, 0, r * 2.4)}q${J(-r, -r * 1.4, 0, -r * 2.4)}z`;
    }
    n += `<path d="${d}" fill="#3e3024" fill-opacity=".8"/>`;
  }
  /* Brust und Flanke: schmale Querbinden (0,3 cm, Abstand ≈ 1,1 cm), Kehle und obere Brust fast frei, nach unten und
     zur Flanke dichter; im Schatten weniger Kontrast */
  n += binden(koerper, -43, -7, 1.1, 0.32, "#4a3a2e", 0.78, (x, y) => Math.min(1, Math.max(0, (y + 44) / 10) * (x > 36 ? 0.55 : 0.95)), 0.006, 30);
  n += haare(T, koerper, 220, (x, y) => (y < -44 ? 85 + (x - 29) * 6 : 95 + (x - 26) * 1.4), 1, [["#a3b0c0", 1, 0.06, 0.3], ["#ffffff", 1.3, 0.06, 0.6]], 18, 0.3, 0.03);
  s += `<g filter="${vol(T, "erumpf", { weich: 4.5, tiefe: 6, umgebung: 0.35, schatten: "#203048" })}">${silhouette(T, G(koerper), weiss, n)}</g>`;
  /* weiche, abgerundete Federspitzen und lose, flaumige Federchen an der Kontur */
  s += haarSaum(T, [[41.8, -48.6], [41.4, -44.6], [42.2, -38], [42.4, -30], [41, -21.4], [37.8, -13.6], [32.4, -7.6]], 70, 0.9, [["#f6f8fa", 1, 0.09, 0.8], ["#c9d2dc", 0.7, 0.09, 0.7]], 1, 0.2);
  s += haarSaum(T, [[15, -56.6], [17.6, -61.4], [21.4, -64.4], [27, -65.6], [33, -65.2], [37.8, -62.8], [41, -58.6]], 60, 0.5, [["#ffffff", 1, 0.07, 0.8]], 1, 0);

  /* ---- Füße: dick befiedert, 2–3 Zehen mit Kerben, lange haarartige Federn hängen über die Krallen; Krallen schwarz,
          kräftig, stark gebogen, mit Glanzlinie; der Bauch überdeckt die Fußwurzel und wirft Schatten darauf ---- */
  const fuss = (x, fern) => {
    const f = [[x - 4.6, -7.4], [x + 1.6, -8], [x + 5, -5.4], [x + 6.6, -2.8], [x + 6.6, -0.6], [x + 4.4, 0, 1], [x - 4.8, 0, 1], [x - 5.6, -3]];
    let i = haare(T, f, 50, 75, 1.1, [["#93a2b6", 1, 0.07, 0.4], ["#ffffff", 1, 0.07, 0.75]], 30, 0.4, 0.1);
    i += weich([[x - 4.6, -7.4], [x + 1.6, -8], [x + 3, -6], [x - 3, -6]], "#7f8fa5", 0.6, 0.8);   // Bauchschatten
    i += zart(T, [[x + 1, -5], [x + 2.4, -2.2], [x + 2.6, 0]], "#93a2b6", 0.25, 0.6) + zart(T, [[x + 3.6, -4.4], [x + 4.6, -2], [x + 4.8, 0]], "#93a2b6", 0.22, 0.5);
    let o = `<g filter="${vol(T, "efuss", { weich: 1, tiefe: 3, schatten: "#203048" })}">${silhouette(T, G(f), fern ? "#c3ccd7" : verlauf(T, "efuss", 0, -8, 0, 0, [[[0, -8], "#f6f8fa"], [[0, 0], "#ccd5df"]]), i)}</g>`;
    const kr = (kx, ky, gr) => `M${J(kx, ky)}q${J(1.6 * gr, -0.6 * gr, 2.4 * gr, 1.2 * gr)}q${J(0.2 * gr, 0.6 * gr, -0.1 * gr, 1 * gr)}q${J(-0.5 * gr, -1.1 * gr, -2 * gr, -1.4 * gr)}z`;
    o += `<path d="${kr(x + 5.6, -1.6, 1.3) + kr(x + 3.6, -0.9, 1.1) + kr(x + 1.2, -0.6, 0.9)}" fill="#0f0d0c"/>`;
    o += fein(T, `<path d="M${J(x + 6, -1.9)}q${J(1.4, -0.4, 2.2, 1)}M${J(x + 3.9, -1.2)}q${J(1.2, -0.3, 1.8, 0.8)}" stroke="#9aa0a8" stroke-width=".1" fill="none"/>`);
    o += haarSaum(T, [[x - 4.4, -6], [x + 1.6, -7.6], [x + 5, -5.2], [x + 6.6, -2.6]], 30, 1.2, [["#f4f6f8", 1, 0.07, 0.8]], -1, 0.6);
    return o;
  };
  s += fuss(29, true) + fuss(22.6, false);

  /* ---- Flügel: angelegt, 8–10 % dunkler als die Brust; Kante aus überlappenden Deckfedern mit hellen Federkanten,
          weicher Schatten auf der Brust darunter; Decken mit Pfeilspitzen-Flecken in Federreihen; Handschwingen als
          gestaffelte lange Federn mit gebänderten Spitzen bis knapp vor das Schwanzende ---- */
  const fluegel = [[15.6, -48], [12, -42], [9, -32], [6.6, -22], [5, -15], [4.6, -11.6], [8.8, -12.6], [14, -14.6], [19.4, -18.6], [23.6, -25], [25.4, -33.4], [24.4, -41.4], [20.6, -47]];
  s += weich([[24, -40], [27, -32], [25, -22], [20, -16], [22, -26], [24, -34]], "#7f8fa5", 0.45, 1.6);   // Schatten auf der Brust
  /* Handschwingen (unter den Decken): gestaffelte lange Federn, ragen bis knapp vor das Schwanzende, Spitzen gebändert */
  {
    let d = "", b = "";
    for (let i = 0; i < 4; i++) {
      const p = roehre([[13 - i * 0.6, -20 + i * 0.8], [8 - i * 0.4, -13.6 + i * 0.6], [3.6 + i * 0.9, -8.2 + i * 0.5]], 3.2, 1.8);
      d += G(p);
      const cid = T.id("ehs" + i);
      if (!F && i) continue;
      T.def(`<clipPath id="${cid}"><path d="${G(p)}"/></clipPath>`);
      b += `<g clip-path="url(#${cid})">` + [0.5, 0.75].map((t) => { const x = 13 - i * 0.6 + (3.6 + i * 0.9 - 13 + i * 0.6) * t, y = -20 + i * 0.8 + (-8.2 + i * 0.5 + 20 - i * 0.8) * t; return `<path d="M${J(x - 3, y - 2.2)}l${J(1.4, -0.6)}l${J(3.6, 4.2)}l${J(-1.4, 0.6)}z" fill="#3a2c20" fill-opacity=".8"/>`; }).join("") + `</g>`;
    }
    s += `<g filter="${vol(T, "ehand", { weich: 0.8, tiefe: 3, schatten: "#203048" })}"><path d="${d}" fill="#e3e8ee" stroke="#aab6c4" stroke-width=".08"/>${b}</g>`;
  }
  let fi = weich([[14, -46], [22, -46], [24, -38], [18, -36], [12, -40]], "#ffffff", 0.7, 1.6) + weich([[6, -16], [14, -16], [21, -21], [12, -20], [6, -19]], "#6b7a90", 0.45, 1.4);
  /* Deckfedern: Reihen kleiner, runder Federspitzen mit Pfeilspitzen-Flecken (V, Spitze nach unten) */
  {
    let fk = "", ff = "";
    const reihen = F ? 9 : 5;
    for (let r = 0; r < reihen; r++) for (let i = 0; i < 6; i++) {
      const t = r / (reihen - 1), x = 21 - t * 12 + i * 2.2 - r * 0.2 + (T.rnd() - 0.5) * 0.6, y = -44 + t * 26 + i * 0.6 + (T.rnd() - 0.5) * 0.4;
      if (!inPoly(x, y, fluegel) || !inPoly(x, y + 1.2, fluegel)) continue;
      const w = 1.2 + t * 0.5, h = 0.9 + t * 0.5;
      fk += `M${J(x - w, y)}q${J(w, h * 1.8, w * 2, 0)}`;
      if (T.rnd() < 0.8) { const q = 0.7 + T.rnd() * 0.5; ff += `M${J(x - w * 0.6 * q, y - h * 0.1)}q${J(w * 0.3 * q, h * 0.6, w * 0.6 * q, h * 0.95)}q${J(w * 0.3 * q, -h * 0.35, w * 0.6 * q, -h * 0.95)}q${J(-w * 0.6 * q, h * 0.25, -w * 1.2 * q, 0)}z`; }
    }
    fi += `<path d="${ff}" fill="#3e3024" fill-opacity=".82"${F ? ` filter="${blur(T, 0.1, 0.1)}"` : ""}/>`;
    if (F) fi += `<path d="${fk}" fill="none" stroke="#8a98ab" stroke-width=".14" stroke-opacity=".35" transform="translate(0 .25)"/><path d="${fk}" fill="none" stroke="#ffffff" stroke-width=".25" stroke-opacity=".6"/>`;
  }
  /* Armschwingen: breite Querbinden über die Feder */
  fi += binden(fluegel, -24, -12, 1.5, 0.55, "#3e3024", 0.78, () => 0.9, 0.01, 14);
  s += `<g filter="${vol(T, "efl", { weich: 2.4, tiefe: 5, umgebung: 0.32, schatten: "#203048" })}">${silhouette(T, G(fluegel), verlauf(T, "efl", 0, -48, 0, -11, [[[0, -48], "#f3f4f3"], [[0, -26], "#e1e6ec"], [[0, -11], "#c3cdd8"]]), fi)}</g>`;
  /* Flügelvorderkante: überlappende Federspitzen statt Linie */
  s += haarSaum(T, [[25.4, -33.4], [23.6, -25], [19.4, -18.6], [14, -14.6], [8.8, -12.6]], 50, 0.8, [["#f4f6f8", 1, 0.09, 0.85], ["#c3cdd8", 0.5, 0.09, 0.6]], -1, -0.2);

  /* ---- Augen: zitronengelb, große Pupille (≈ 45 %), Oberlid mit weißen Federn deckt 15–20 % (Mandelform) und wirft
          einen schmalen Schatten; schwarzer Lidrand 1,5–2 px; ein Glanzlicht (beide Augen gleich), schwache Bodenreflexion ---- */
  const auge = (x, y, r) => {
    const id = T.id("eac" + Math.round(x));
    const spalt = `M${J(x - r * 1.15, y + r * 0.1)}C${J(x - r * 0.6, y - r * 0.85, x + r * 0.6, y - r * 0.85, x + r * 1.15, y + r * 0.1)}C${J(x + r * 0.6, y + r * 1.2, x - r * 0.6, y + r * 1.2, x - r * 1.15, y + r * 0.1)}z`;
    T.def(`<clipPath id="${id}"><path d="${spalt}"/></clipPath>`);
    let o = `<path d="${spalt}" fill="#0c0a08"/><g clip-path="url(#${id})">`;
    o += `<circle cx="${Z2(x)}" cy="${Z2(y + r * 0.12)}" r="${Z2(r * 0.95)}" fill="${T.rg("eiris", [[0, "#fbe64a"], [0.55, "#f7d51d"], [0.9, "#e3b300"], [1, "#9a7a06"]], 0.45, 0.45, 0.55)}"/>`;
    if (F) { let fa = ""; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; fa += `M${J(x + Math.cos(a) * r * 0.5, y + r * 0.12 + Math.sin(a) * r * 0.5)}L${J(x + Math.cos(a) * r * 0.9, y + r * 0.12 + Math.sin(a) * r * 0.9)}`; } o += `<path d="${fa}" stroke="#c99a08" stroke-width=".05" stroke-opacity=".6"/>`; }
    o += `<circle cx="${Z2(x)}" cy="${Z2(y + r * 0.12)}" r="${Z2(r * 0.44)}" fill="#050403"/>`;
    o += `<rect x="${Z2(x - r * 1.2)}" y="${Z2(y - r)}" width="${Z2(r * 2.4)}" height="${Z2(r * 0.9)}" fill="${T.lg("elid", [[0, "#000", 0.65], [1, "#000", 0]])}"/>`;
    o += `<ellipse cx="${Z2(x - r * 0.32)}" cy="${Z2(y - r * 0.22)}" rx="${Z2(r * 0.17)}" ry="${Z2(r * 0.12)}" fill="#fff" opacity=".92"/><path d="M${J(x - r * 0.5, y + r * 0.78)}q${J(r * 0.5, r * 0.18, r, 0)}" stroke="#fff" stroke-width="${Z2(r * 0.08)}" stroke-opacity=".35" fill="none"/></g>`;
    o += `<path d="${spalt}" fill="none" stroke="#0c0a08" stroke-width="${Z2(r * 0.12)}"/>`;
    /* befiedertes Oberlid */
    o += `<path d="M${J(x - r * 1.35, y)}C${J(x - r * 0.7, y - r * 1.05, x + r * 0.7, y - r * 1.05, x + r * 1.35, y)}C${J(x + r * 0.7, y - r * 0.62, x - r * 0.7, y - r * 0.62, x - r * 1.35, y)}z" fill="#f6f8fa"/>`;
    return o;
  };
  s += auge(25.6, -55.2, 1.75) + auge(34.6, -55.2, 1.7);
  /* Schnabel: schwarzer Hakenschnabel, First nach unten gebogen, nur die vorderen 50 % sichtbar, Basis unter weißen
     Borstenfedern, die von beiden Seiten darübergreifen; Glanzpunkt auf dem First */
  s += form(T, [[29.3, -51.6], [30.9, -51.6], [31.3, -50.4], [30.9, -49.2], [30.2, -48.4], [29.7, -49.2], [29.3, -50.4]], verlauf(T, "eschn", 0, -51.6, 0, -48.4, [[[0, -51.6], "#3e3a36"], [[0, -48.4], "#0a0908"]]));
  s += `<ellipse cx="30.5" cy="-50.8" rx=".18" ry=".32" fill="#fff" opacity=".55"/>`;
  s += haare(T, [[27.4, -54.4], [33, -54.4], [32.6, -51], [30.2, -50.4], [27.8, -51]], 90, (x) => (x < 30.2 ? 62 : 118), 1.6, [["#ffffff", 1, 0.09, 0.95], ["#a7b3c2", 0.45, 0.08, 0.7]], 24, 0.35, 0.2);
  return { svg: s, box: [-0.6, -65.6, 42.4, 0], fuesse: [23, 29], kopf: [14, -70, 46, -42] };
}

module.exports = [
  { id: "pinguin", de: "der Pinguin", syl: "PIN-gu-in", it: "il pinguino", itSyl: "pin-GUI-no", en: "penguin",
    gruppe: "Polar", lebensraum: "Antarktis", laenge: 0.53, hoehe: 1.17, zeichne: pinguin },
  { id: "walross", de: "das Walross", syl: "WAL-ross", it: "il tricheco", itSyl: "tri-CHE-co", en: "walrus",
    gruppe: "Polar", lebensraum: "Arktis", laenge: 2.9, hoehe: 1.35, zeichne: walross },
  { id: "seehund", de: "der Seehund", syl: "SEE-hund", it: "la foca", itSyl: "FO-ca", en: "harbour seal",
    gruppe: "Polar", lebensraum: "Küste", laenge: 1.83, hoehe: 0.6, zeichne: seehund },
  { id: "robbe_baby", de: "das Robbenbaby", syl: "ROB-ben-ba-by", it: "il cucciolo di foca", itSyl: "CUC-cio-lo di FO-ca", en: "seal pup",
    gruppe: "Polar", lebensraum: "Packeis", laenge: 0.94, hoehe: 0.43, zeichne: robbeBaby },
  { id: "polarfuchs", de: "der Polarfuchs", syl: "po-LAR-fuchs", it: "la volpe artica", itSyl: "VOL-pe AR-ti-ca", en: "arctic fox",
    gruppe: "Polar", lebensraum: "Tundra", laenge: 0.84, hoehe: 0.49, zeichne: polarfuchs },
  { id: "rentier", de: "das Rentier", syl: "REN-tier", it: "la renna", itSyl: "REN-na", en: "reindeer",
    gruppe: "Polar", lebensraum: "Tundra", laenge: 1.93, hoehe: 2.31, zeichne: rentier },
  { id: "moschusochse", de: "der Moschusochse", syl: "MO-schus-och-se", it: "il bue muschiato", itSyl: "BU-e mu-SCHIA-to", en: "musk ox",
    gruppe: "Polar", lebensraum: "Tundra", laenge: 2.25, hoehe: 1.46, zeichne: moschusochse },
  { id: "schneeeule", de: "die Schneeeule", syl: "SCHNEE-eu-le", it: "la civetta delle nevi", itSyl: "ci-VET-ta del-le NE-vi", en: "snowy owl",
    gruppe: "Polar", lebensraum: "Tundra", laenge: 0.43, hoehe: 0.66, zeichne: schneeeule },
];
