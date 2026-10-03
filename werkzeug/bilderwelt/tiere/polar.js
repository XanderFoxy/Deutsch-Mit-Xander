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
function haarSaum(T, pts, n, len, farben, seite = 1, zug = 0, sz = 0.15) {
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
/* weiche Licht-/Schattenform: fein = Vieleck verwischt; Szene = gleich große weiche Ellipse (Radialverlauf, kein Filter) */
function weichForm(T, pts, farbe, op, sd) {
  if (T.fein !== false) return form(T, pts, farbe, ` opacity="${Z2(op)}" filter="${blur(T, sd)}"`);
  const n = pts.length, mx = pts.reduce((a, p) => a + p[0], 0) / n, my = pts.reduce((a, p) => a + p[1], 0) / n;
  let sxx = 0, syy = 0, sxy = 0;
  for (const [x, y] of pts) { sxx += (x - mx) ** 2; syy += (y - my) ** 2; sxy += (x - mx) * (y - my); }
  const w = 0.5 * Math.atan2(2 * sxy, sxx - syy), c = Math.cos(w), si = Math.sin(w);
  let a = 0, b = 0;
  for (const [x, y] of pts) { a = Math.max(a, Math.abs((x - mx) * c + (y - my) * si)); b = Math.max(b, Math.abs(-(x - mx) * si + (y - my) * c)); }
  return fleck(T, mx, my, a + sd, b + sd, farbe, op * 0.85, Math.round(w * 180 / Math.PI));
}
/* weiches Verwischen (nur fein benutzen) */
function blur(T, sd) {
  const id = T.id("bl" + String(sd).replace(".", ""));
  T._bl = T._bl || new Set();
  if (!T._bl.has(id)) { T._bl.add(id); T.def(`<filter id="${id}" x="-150%" y="-150%" width="400%" height="400%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${sd}"/></filter>`); }
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
  const zehF = verlauf(T, "zeh", 0, -5, 0, 0.2, [[[0, -5], "#5b6069"], [[0, -2.8], "#2c2f34"], [[0, 0.2], "#0e0f11"]]);
  const zehe = (m, w0, w1, k, fern) => {
    const ring = [];
    if (F) for (let t = 0.1; t < 0.96; t += 0.085) {
      const i = Math.min(m.length - 2, Math.floor(t * (m.length - 1))), f = t * (m.length - 1) - i, a = m[i], b = m[i + 1];
      const x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f, w = (w0 + (w1 - w0) * t) / 2;
      ring.push(`M${J(x - 0.1, y - w * 0.95)}q${J(0.34, w * 0.95, 0, w * 1.9)}`);
    }
    let z = T.koerper(G(roehre(m, w0, w1)), fern ? "#1c1d20" : zehF, { vol: false, rand: false, innen:
      (ring.length ? `<path d="${ring.join("")}" stroke="#08090a" stroke-width=".1" stroke-opacity="${fern ? 0.4 : 0.6}" fill="none"/>` +
        (fern ? "" : `<path d="${ring.join("")}" stroke="#8d939c" stroke-width=".06" stroke-opacity=".45" fill="none" transform="translate(-.14 0)"/>`) : "") +
      (fern ? "" : zart(T, m.map(([x, y], i) => [x, y - w0 * 0.3 * (1 - i / m.length)]), "#aab1bb", 0.26, 0.4)) });
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
  const schwanz = [[-12.6, -6.4], [-15.8, -11.4], [-18.8, -13.8], [-21, -10.2], [-23.4, -5.6], [-25.4, -1.4], [-25.8, -0.3, 1], [-23.6, -0.4], [-20.2, -1.6], [-16, -3.4]];
  let sch = "";
  if (F) {
    let d = "", e = "";
    for (let i = 0; i < 9; i++) {
      const t = i / 8, x0 = -14 - t * 4.4, y0 = -5.6 - t * 6.6, x1 = -24.8 + t * 3.6, y1 = -0.8 - t * 3;
      d += `M${J(x0, y0)}L${J(x1, y1)}`; e += `M${J(x0 - 0.15, y0 - 0.12)}L${J(x1 + 0.4, y1 - 0.15)}`;
    }
    sch += `<path d="${d}" stroke="#000" stroke-width=".22" stroke-opacity=".55" fill="none"/><path d="${e}" stroke="#7a889d" stroke-width=".07" stroke-opacity=".55" fill="none"/>`;
  }
  sch += weich([[-17, -9.6], [-20, -8.8], [-22, -5.4], [-19.4, -5.6]], "#6c7c93", 0.35, 0.6);
  s += silhouette(T, G(schwanz), verlauf(T, "schw", -15, -9, -25, -1, [[[-15, -9], "#262d37"], [[-25, -1], "#0d0f12"]]), sch);

  /* ---- Körper: Weiß als Grund, darin (geklippt) Gelb, Ohrfleck, Rücken/Kopf, Federn, Licht/Schatten ---- */
  let n = "";
  /* Weiß: im Licht warm-weiß, kühler Kernschatten rechts unten (Schnee spiegelt den Himmel), Reflexlicht vom Eis am Rand */
  n += `<rect x="-30" y="-120" width="60" height="120" fill="${verlauf(T, "weissH", 2, -86, 24, -10, [[[2, -86], "#fffefb"], [[9, -64], "#f9f9f7"], [[16, -44], "#e8ecf0"], [[21, -28], "#cdd5de"], [[24, -10], "#aebbca"]])}"/>`;
  n += weich([[0, -84], [10, -82], [16, -62], [14, -40], [4, -36], [-2, -56]], "#fffefb", 0.9, 4);
  n += weich([[22, -50], [26, -40], [24, -22], [18, -12], [12, -8], [16, -20], [21, -34]], "#8c9db2", 0.4, 2.4);
  n += weich([[-6, -12], [6, -8], [16, -10], [10, -5.2], [-4, -5.6]], "#7d8ea5", 0.5, 1.6);
  n += weich([[-8, -78], [-4, -76], [-4, -30], [-9, -20], [-10, -50]], "#8c9db2", 0.35, 2.4);   // Flanke dreht nach hinten weg
  /* Federn im Weiß: nur im Übergang Licht → Schatten sichtbar, im Glanzlicht ausgeblendet */
  if (F) n += `<rect x="-14" y="-98" width="42" height="96" fill="${lanzettMuster(T, "w", 1.1, 0.62, "#5d7090", "#ffffff", 0.55, 0.8)}" filter="${wackel(T)}" opacity=".22" mask="${radialMaske(T, "w", -14, -98, 42, 96, 6, -60, 34, [[0, "#000"], [0.38, "#000"], [0.7, "#fff"], [1, "#888"]], 1.5)}"/>`;
  /* Brust: blasses Zitronengelb nur oben, bis ≈ 28 % der Höhe ins Weiß ausgelaufen */
  n += form(T, [[-3, -98], [13, -98], [17.6, -92], [21.6, -84], [14, -81], [4, -82], [-3, -88]], verlauf(T, "brust", 0, -97, 0, -81, [[[0, -97], "#fbefb8", 0.95], [[0, -90], "#fbf0be", 0.6], [[0, -81], "#fbf3d6", 0]]), F ? ` filter="${blur(T, 1.4)}"` : "");
  /* Okklusion unter der schwarzen Kehle auf der Brust */
  n += weich([[0, -98], [12, -97.4], [16, -93.6], [8, -94.4], [0, -95.4]], "#6a7b92", 0.3, 1.2);
  /* Ohrfleck: oben schmal (hinter und unter dem Auge), an der Halsseite breiter, unten weich ins Brustgelb */
  const vorn = [[3.2, -110.6], [4.8, -109.6], [6.2, -107], [7.6, -104], [9.4, -101], [11.6, -98.6], [13.6, -96.8]];
  const hinten = [[1.6, -110.4], [0.4, -108], [-0.8, -104.4], [-1.8, -100.6], [-2.6, -97], [-3, -93.6]];
  const ohr = [...vorn, [16, -93], [12, -90.6], [4, -91.4], ...hinten.slice().reverse()];
  let oi = weich([[0.6, -109.4], [2.6, -109.6], [3.6, -106], [0.4, -104]], "#e8920f", 0.45, 0.8) + weich([[2, -104], [6, -103], [9, -99], [4, -98.6]], "#fff3c0", 0.3, 1.2);
  if (F) oi += `<rect x="-4" y="-112" width="22" height="22" fill="${lanzettMuster(T, "o", 0.5, 0.3, "#b8650a", "#fff4c4", 0.4, 0.45)}" opacity=".45"/>`;
  n += silhouette(T, G(ohr), verlauf(T, "ohr", 0, -110.6, 0, -91, [[[0, -110.6], "#f2a51a"], [[0, -104], "#f5b52c"], [[0, -99], "#f7c842"], [[0, -95], "#fbe48a"], [[0, -91], "#fbeeb8", 0]]), oi);
  /* Rücken, Kopf, Kinn und Kehle: schwarz; die Form spart den Ohrfleck aus (scharfe Kante gegen Schwarz) */
  const dunkel = [[13.6, -96.8, 1], ...vorn.slice().reverse(), [2.4, -111.2], ...hinten, [-3.2, -90], [-3.8, -85], [-5.4, -79], [-6.8, -71], [-7.6, -61], [-8.2, -50], [-9.2, -38], [-10.8, -27], [-12.8, -17], [-14.6, -9],
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
  n += F ? `<g opacity=".45" filter="${blur(T, 0.08)}">${saum(T, grenze, 0.7, 0.24, "#dfe5ec", 1, -1)}</g>` : "";
  /* kühles Reflexlicht vom Eis knapp innerhalb der Bauchkante rechts unten, darunter weicher Kantenschatten */
  const bauchKante = [[26.4, -42], [25.6, -31], [23.4, -22.4], [20, -15.4], [15.6, -9.8], [10.4, -6.4], [4.4, -5.2]];
  n += F ? linie(bauchKante, "#8a9bb1", 2, ` stroke-opacity=".3" filter="${blur(T, 0.7)}"`) + linie(bauchKante.map(([x, y]) => [x - 0.7, y - 0.7]), "#dce6f0", 0.9, ` stroke-opacity=".55" filter="${blur(T, 0.5)}"`) : "";
  s += silhouette(T, kD, "#f4f5f6", n);
  /* Bauchfedern überdecken die Fußwurzel, weicher Schatten auf dem Fuß */
  s += weich([[-4, -4.4], [4, -4.4], [10, -5.6], [12, -4.2], [4, -3.4], [-4, -3.4]], "#000", 0.55, 0.6);
  s += fein(T, saum(T, [[14.8, -8.6], [10.6, -5.8], [4.6, -4.5], [-1.6, -4.4], [-7, -5.4]], 0.5, 0.16, "#c3cfdb", 1));

  /* ---- Flosse: Paddel am Schultergelenk, Vorderkante ragt über die Schwarz-Weiß-Grenze; Schlagschatten auf dem Weiß ---- */
  const flosse = [[-2.4, -93], [-1.2, -86], [-1.2, -78], [-2.2, -70], [-4, -63], [-6, -58.4], [-7.8, -56.4], [-9.6, -57.2], [-10.6, -61], [-11.4, -68], [-12, -77],
    [-12.2, -86], [-11, -93], [-6.8, -95.4]];
  let fg = F ? form(T, flosse.map(([x, y]) => [x + 1.6, y + 1.8]), "#8e9bae", ` filter="${blur(T, 1.1)}" opacity=".8"`) : "";
  let fl = weich([[-2.8, -88], [-2, -80], [-3, -70], [-5.2, -62], [-4, -68], [-3.2, -80]], "#5d6f88", 0.8, 0.6);   // Glanzband Vorderkante
  fl += weich([[-9.8, -88], [-10.6, -76], [-10, -64], [-8.2, -60], [-8.6, -72]], "#000", 0.4, 1.2);
  if (F) fl += `<rect x="-13" y="-96" width="13" height="40" fill="${lanzettMuster(T, "f", 0.42, 0.26, "#000", "#8ea1ba", 0.55, 0.45, "rotate(-6)")}" opacity=".5"/>`;
  fl += F ? linie([[-11.9, -86], [-11.3, -76], [-10.7, -66], [-9.8, -58.6]], "#c9d3de", 0.5, ` stroke-opacity=".35" filter="${blur(T, 0.15)}"`) : "";   // heller Hinterrand
  fg += silhouette(T, G(flosse), verlauf(T, "flosse", -12.2, -70, -1.2, -70, [[[-12.2, -70], "#2e3a4c"], [[-7, -70], "#1d2532"], [[-1.2, -70], "#151b25"]]), fl);
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
  /* weiche Licht-/Schattenform: in voller Feinheit verwischt, in der Szene einfach schwächer */
  const weich = (pts, farbe, op, sd) => weichForm(T, pts, farbe, op, sd);
  /* Hautfalte: Schattenrinne, Knick (dunkel) und belichteter Wulst darüber (Licht von links oben) */
  const falte = (pts, w, op = 0.5) => {
    const ob = pts.map(([x, y]) => [x - w * 0.7, y - w * 1.1]);
    if (!F) return op >= 0.55 ? zart(T, pts, "#4a271c", w * 0.8, op * 0.7) : "";
    return linie(pts.map(([x, y]) => [x + w * 1.4, y + w * 1.7]), "#3e1c12", w * 4.6, ` stroke-opacity="${Z2(Math.min(1, op * 1.1))}" filter="${blur(T, w * 1.1)}"`) +
      zart(T, pts, "#2e150d", w * 0.6, op) + linie(ob, "#f6c9b2", w * 2.6, ` stroke-opacity="${Z2(Math.min(1, op * 0.9))}" filter="${blur(T, w * 0.8)}"`);
  };
  /* Umriss: Rücken fällt von den Schultern zur Hüfte, Hals gewaltig mit Faltenwülsten an Kehle und Brust, Kopf klein und rund,
     Schnauzenpolster wölbt sich nach vorn-unten; hinten breit gerundet (kein Kegel) */
  const rumpf = [
    [40, -24], [50, -32], [62, -41.4], [78, -52.8], [96, -63.4], [122, -75], [150, -86.4], [166, -92], [178, -97.8], [198, -107.4], [214, -115.4], [226, -122], [236, -126.8], [246, -130.6],
    [256, -132.6], [266, -133.6], [275, -132.2], [283, -128], [289, -121.6], [293.4, -113.6], [295.4, -105], [294.6, -97.6], [291, -92.6], [285, -90], [278, -89.6],
    [271, -88.8], [265.6, -86.6], [262, -83], [260.8, -78.6], [258.6, -74.4], [257, -70], [256.6, -65], [255, -60.4], [253.6, -53], [254, -46], [251.6, -38.6],
    [247.4, -31], [240.6, -24], [231, -18], [218, -12.6], [202, -8], [184, -4.4], [160, -2.4], [132, -1.2], [106, -1.4], [84, -2.6], [68, -3.6], [52, -6], [40, -12],
  ];
  /* nahe Hinterflosse gehört zur Silhouette (keine Naht am Fußgelenk) */
  const hf = [[44, -23.4], [30, -19.8], [18, -17.6], [9.4, -16.4], [8.4, -15], [10.6, -13.4], [10, -11.6], [12.4, -10], [12, -8.2], [13.4, -6.4], [11.4, -4.4], [11, -2.8],
    [7.2, -1.2], [6.6, -0.2], [16, -0.1], [36, -0.3], [54, -0.8], [72, -2.4], [60, -6], [48, -12]];
  const kD = vereint(T, [rumpf, hf]);
  const haut = verlauf(T, "haut", 0, -134, 0, 0, [[[0, -134], "#b8765c"], [[0, -110], "#ad6c53"], [[0, -80], "#a5654d"], [[0, -50], "#965c46"], [[0, -28], "#7a4a37"], [[0, -10], "#5c3627"], [[0, 0], "#664032"]]);
  const fernTon = verlauf(T, "fern", 0, -32, 0, 0, [[[0, -32], "#946451"], [[0, -14], "#7e5241"], [[0, 0], "#5e3b2e"]]);

  /* ---- ferne Hinterflosse (etwas angehoben, Körperton 25 % dunkler, modelliert) ---- */
  const hfF = [[58, -28], [44, -28.6], [30, -28.4], [19, -28], [12.4, -28.2], [14.6, -26], [12.8, -23.8], [16, -21.8], [14.4, -19.6], [18, -17.6], [30, -16.4], [44, -15.6], [56, -15]];
  s += silhouette(T, G(hfF), fernTon, weich([[54, -27], [30, -27.2], [15, -26.8], [30, -24.6], [52, -24]], "#e0ae98", 0.45, 0.8) + weich([[54, -17], [30, -18], [16, -19], [30, -16.4], [54, -15.4]], "#3a2018", 0.45, 0.8) +
    fein(T, zart(T, [[52, -23], [36, -24.2], [22, -25], [14, -25.6]], "#4a271c", 0.2, 0.4) + zart(T, [[52, -20], [36, -20.6], [22, -21.2], [15, -21.6]], "#4a271c", 0.2, 0.35)), "#000", 0, 0);
  /* ---- ferne Vorderflosse ---- */
  const vfF = [[212, -28], [224, -22], [236, -15], [248, -9.6], [258, -6.4], [264.6, -5], [266.6, -3.4], [266, -1.6], [262, -0.2], [244, -0.1], [226, -0.6], [214, -5], [208, -16]];
  s += silhouette(T, G(vfF), fernTon, weich([[218, -24], [240, -13], [262, -6], [240, -10], [220, -18]], "#e0ae98", 0.45, 0.8) + weich([[214, -3], [240, -1], [264, -1], [240, 0], [214, 0]], "#3a2018", 0.5, 0.8) +
    fein(T, zart(T, [[240, -8], [252, -5], [262, -3]], "#4a271c", 0.25, 0.45)), "#000", 0, 0);

  /* ---- Stoßzähne (vor dem Körper zeichnen: die Oberlippe deckt die Wurzel) ---- */
  const zahnD = (dx, dy, kurz) => [[282.4 + dx, -91.6 + dy], [289.2 + dx, -91.2 + dy], [288.6 + dx, -76 + dy], [285.8 + dx, -58 + dy], [281.8 + dx, -42 + dy + kurz],
    [277.6 + dx, -33.8 + dy + kurz], [275.8 + dx, -33.2 + dy + kurz, 1], [275.4 + dx, -35.8 + dy + kurz], [278.4 + dx, -46 + dy + kurz], [281.2 + dx, -60 + dy], [283 + dx, -76 + dy]];
  const zahnF = zahnD(-4.4, -0.6, -2);
  s += silhouette(T, G(zahnF), verlauf(T, "zahnF", 271, 0, 285, 0, [[[271, 0], "#d9caa8"], [[285, 0], "#9c8664"]]), weich([[280, -90], [284, -90], [283, -70], [280, -70]], "#6a5236", 0.45, 1), "#000", 0, 0);
  const zahn = zahnD(0, 0, 0);
  let zi = weich([[283, -92], [289, -92], [288.6, -80], [283.4, -80]], "#8a6440", 0.55, 1.2) + weich([[278.6, -46], [282.6, -64], [284.4, -80], [283, -80], [280.6, -64], [277, -44]], "#fffbf0", 0.75, 0.6);
  zi += weich([[287.6, -84], [286.4, -66], [283, -48], [285, -48], [288, -66], [289, -84]], "#7a6446", 0.4, 0.8);
  zi += zart(T, [[286.6, -90], [286, -76], [283.6, -60], [280, -44]], "#9c8662", 0.16, 0.5) + zart(T, [[288.2, -89], [287.6, -76], [285.4, -62]], "#9c8662", 0.14, 0.45);
  zi += fein(T, zart(T, [[284, -72], [286.4, -71]], "#6b5638", 0.1, 0.7) + zart(T, [[282, -56], [284.6, -55.4]], "#6b5638", 0.1, 0.7) + zart(T, [[279.6, -44], [281.6, -43.6]], "#6b5638", 0.08, 0.6) +
    zart(T, [[276.2, -35.6], [277.8, -36.4], [278.8, -35.6]], "#b39d78", 0.15, 0.8));
  s += silhouette(T, G(zahn), verlauf(T, "zahn", 275, 0, 289.4, 0, [[[275, 0], "#fbf4e2"], [[281, 0], "#efe3c6"], [[289.4, 0], "#c3ad86"]]), zi, "#5a4630", 0.18, 0.5);

  /* ---- Körper mit Kopf ---- */
  let n = "";
  /* Grundton auch innen (Hintergrund für das multiply-Relief) */
  n += `<rect x="40" y="-140" width="260" height="141" fill="${haut}"/>`;
  /* Lichtrand am Rücken, Nacken, Scheitel (Licht von links oben) */
  n += weich([[56, -30], [90, -56], [148, -82], [200, -105], [232, -122], [256, -131], [276, -130], [284, -125], [270, -127], [250, -127], [226, -117], [196, -101], [146, -79], [92, -53], [62, -27]], "#f0bfa6", 0.6, 1.6);
  n += weich([[90, -46], [140, -68], [190, -86], [220, -96], [200, -76], [150, -56], [100, -38]], "#e2a588", 0.4, 7);
  /* rosiger Hals und Brust (gut durchblutet), zimtbraune Flanken, Flecken */
  n += weich([[236, -118], [252, -124], [262, -110], [258, -88], [250, -66], [244, -46], [234, -54], [232, -80], [230, -100]], "#cf8068", 0.45, 5);
  n += weich([[120, -66], [170, -84], [196, -80], [170, -64], [130, -54]], "#8e5c46", 0.3, 6) + weich([[280, -120], [292, -112], [292, -100], [282, -100]], "#e9b19c", 0.5, 2);
  /* Kernschatten im unteren Rumpfdrittel, Bodenreflex, Okklusion an Kinn/Kehle und an den Flossenansätzen */
  n += weich([[58, -16], [90, -24], [140, -28], [190, -32], [226, -36], [246, -42], [250, -30], [236, -18], [196, -9], [140, -6], [90, -7], [64, -10]], "#40221a", 0.5, 4);
  n += weich([[80, -2.4], [140, -1.6], [200, -3.4], [236, -10], [200, -5.4], [140, -3.2], [86, -3.6]], "#c7aaa4", 0.6, 1);
  n += weich([[258, -88], [270, -86.6], [284, -88.6], [262, -82], [256, -74]], "#2a140e", 0.65, 2.4) + weich([[214, -34], [236, -28], [244, -20], [224, -16], [210, -22]], "#2a140e", 0.55, 3);
  /* Hautrelief (Poren, feine Runzeln): nur Kopf, Hals, Schultern, schwach und nach hinten ausblendend */
  if (F) n += `<g style="mix-blend-mode:multiply" opacity=".5"><g mask="${verlaufMaske(T, "rel", 40, -140, 260, 140, 120, -60, 250, -60, [[[120, -60], "#444"], [[200, -60], "#999"], [[250, -60], "#eee"]])}"><rect x="40" y="-140" width="260" height="140" fill="#fff" filter="${hautLicht(T, "haut", { f: 0.42, tiefe: 0.42, seed: 11 })}"/></g></g>`;
  /* Falten: Halsringe (um den dicken Hals), Nackenfalte, Kehlfalten, Schulter-/Achselfalten, Flanke, Bauch */
  n += falte([[247, -129], [242, -118], [240.6, -106], [242, -96]], 0.9, 0.6) + falte([[243, -92], [246, -82], [251, -73]], 0.8, 0.5);
  n += falte([[236.4, -125], [230, -113], [228, -100], [229.4, -88], [234, -77]], 1.1, 0.6) + falte([[231, -80], [237, -68], [245, -58], [250, -54]], 0.9, 0.5);
  n += falte([[224, -119], [219, -108], [217, -96], [218, -86]], 1, 0.5) + falte([[220, -84], [224, -72], [232, -60], [240, -50]], 0.9, 0.45);
  n += falte([[210, -111], [205, -98], [205, -84], [210, -70], [218, -58]], 0.9, 0.4) + falte([[226, -96], [233, -94], [240, -96]], 0.6, 0.35);
  n += falte([[256, -132], [252.4, -122], [251.6, -110], [254, -99], [260, -90]], 0.7, 0.5) + falte([[214, -90], [222, -86], [228, -88]], 0.6, 0.3);
  n += falte([[260, -84], [265, -81.4], [272, -81.6]], 0.6, 0.5) + falte([[256, -76], [261, -72.6], [268, -72.8]], 0.6, 0.45) + falte([[254.6, -66], [259, -63.4], [263, -63]], 0.5, 0.4);
  n += falte([[196, -104], [190, -88], [192, -70], [200, -56]], 0.8, 0.3);
  n += falte([[234, -40], [222, -31], [206, -25], [188, -22]], 0.9, 0.35) + falte([[242, -50], [230, -44], [216, -40]], 0.7, 0.25);
  n += falte([[186, -44], [160, -38], [134, -35]], 0.8, 0.14);
  /* Hinterflosse: Fächer mit Schwimmhaut, fünf Zehenstrahlen, Krallen an den drei mittleren; Fußgelenk mit Querfalten */
  n += weich([[44, -21], [30, -18], [12, -15], [30, -15.4], [44, -18]], "#f0c2aa", 0.5, 1) + weich([[60, -1.6], [30, -1], [8, -1.4], [30, 0], [60, 0]], "#2e170f", 0.5, 0.8);
  for (let i = 0; i < 5; i++) n += falte([[46, -15 + i * 1.6], [34, -15.4 + i * 2.6], [22, -15.6 + i * 3], [10 + [-1.6, 0.6, 2.4, 0.6, -2.6][i], -16 + i * 3.6]], 0.3, 0.4);
  n += `<path d="M22.4 -12.6q-1.2 -.5 -2 .2M22.2 -9.4q-1.2 -.4 -2 .2M21.4 -6.4q-1.1 -.3 -1.8 .2" stroke="#2a1a12" stroke-width=".5" stroke-linecap="round" fill="none"/>`;
  n += falte([[50, -22], [47.6, -14], [49, -5]], 0.45, 0.25);
  /* große, weiche Hautfalten an Hüfte und Flanke; leichte Fleckung der Haut */
  n += fleck(T, 120, -50, 22, 12, "#c98a70", 0.35, -15) + fleck(T, 170, -40, 18, 10, "#7e4a38", 0.25, -10) + fleck(T, 205, -80, 16, 10, "#c98a70", 0.3) + fleck(T, 150, -72, 14, 6, "#7e4a38", 0.2, -20);
  /* Bossen: Knoten und Beulen an Hals und Schultern (Licht oben links, Schatten unten rechts) */
  const bossen = [[212, -108, 4.4], [221, -97, 5], [229, -86, 4.4], [234, -106, 3.8], [242, -95, 3.6], [224, -73, 4.2], [236, -72, 3.6], [204, -92, 4.6], [213, -80, 3.8],
    [246, -110, 3], [248, -84, 3], [240, -60, 3.4], [200, -104, 3.4], [228, -116, 3.2], [206, -68, 3.6], [194, -82, 3.2], [228, -56, 3.2]];
  if (F) for (const [x, y, rr] of bossen) n += fleck(T, x + rr * 0.5, y + rr * 0.6, rr * 1.25, rr * 0.85, "#3e1d13", 0.45, -20) + fleck(T, x - rr * 0.25, y - rr * 0.3, rr * 0.95, rr * 0.75, "#f2b9a0", 0.35, -20);
  /* Narben: helle, leicht erhabene Striche (Kämpfe mit Stoßzähnen) */
  n += zart(T, [[216, -102], [224, -95], [229, -92]], "#f0d0c0", 0.5, 0.5) + zart(T, [[202, -76], [207, -66]], "#f0d0c0", 0.45, 0.45) + zart(T, [[244, -90], [247, -81]], "#f0d0c0", 0.4, 0.45);
  /* Haare: spärlich, kurz, rötlich-braun, auf Rücken und Flanke (samtiger Schimmer am Licht) */
  n += haare(T, [[60, -40], [110, -72], [170, -96], [218, -118], [250, -132], [240, -110], [200, -92], [140, -68], [80, -40]], 300, (x, y) => 165 + (x - 150) * 0.05, 0.8,
    [["#4e2a1d", 1, 0.07, 0.4], ["#eab79b", 0.5, 0.06, 0.4]], 22, 0.3, 0.04);
  /* Kopf: Stirnwulst, Augenhöhle mit Schatten darüber, Polster heller und geschwollen */
  n += weich([[258, -126], [268, -128], [276, -124], [270, -122], [260, -122]], "#f5d4c2", 0.5, 1.2) + weich([[260, -121.6], [272, -122], [272, -118], [262, -117]], "#4a271c", 0.45, 1);
  const polster = [[278, -128], [285, -126], [290.6, -120], [294.2, -112], [295.2, -103.6], [293.4, -96.6], [289, -92.2], [282, -91.2], [276, -94], [273.6, -104], [274.6, -118]];
  n += weich(polster, "#e7b09b", 0.55, 1.4) + weich([[282, -122], [290, -116], [292, -106], [286, -108], [280, -116]], "#fbe0d2", 0.45, 1.6);
  n += weich([[276, -96], [288, -93], [292, -96], [284, -98]], "#4a271c", 0.4, 1);
  /* Mund: Unterlippe unter dem Polster, Kinn */
  n += zart(T, [[290, -92], [284, -90.6], [277, -90], [270.6, -89]], "#3b1d14", 0.5, 0.6) + weich([[270, -88], [284, -89], [282, -87], [270, -86]], "#f0c2ab", 0.4, 0.6);
  s += silhouette(T, kD, haut, n, "#2a1812", 0.3, 0.5);
  /* Haarbälge (Follikelreihen) auf dem Polster */
  if (F) {
    let d = "";
    for (let r = 0; r < 11; r++) for (let i = 0; i < 12; i++) {
      const t = i / 11, x = 293.8 + 3 * Math.sin(t * 2.4 - 0.4) - r * 1.6 - (T.rnd() - 0.5) * 0.5 - (t > 0.8 ? (t - 0.8) * 14 : 0), y = -124 + t * 30 + r * 0.25 + (T.rnd() - 0.5) * 0.5;
      if (inPoly(x, y, polster)) d += `M${J(x, y)}h.01`;
    }
    s += `<path d="${d}" stroke="#6a3426" stroke-width=".6" stroke-linecap="round" stroke-opacity=".65"/>`;
  }

  /* ---- Vibrissen: dicke, steife, cremefarbene Borsten in dichten Reihen; vorn abgenutzt kurz, unten und seitlich
          länger; sie stehen nach vorn-unten wie eine Bürste ---- */
  {
    let dS = "", dH = "";
    const k = F ? 290 : 45;
    for (let i = 0; i < k; i++) {
      const t = T.rnd(), reihe = T.rnd();
      const bx = 294.2 + 2.8 * Math.sin(t * 2.4 - 0.4) - reihe * 15 - (t > 0.8 ? (t - 0.8) * 14 : 0), by = -123 + t * 29 + reihe * 2;
      if (!inPoly(bx, by, polster)) continue;
      const L = (2 + 4.4 * t + T.rnd() * 1.8) * (1 - reihe * 0.4), a = (18 + t * 58 + (T.rnd() - 0.5) * 18) * Math.PI / 180;
      const ex = bx + Math.cos(a) * L, ey = by + Math.sin(a) * L + L * 0.08, nx = -Math.sin(a), ny = Math.cos(a), w = 0.32 + 0.2 * (1 - reihe);
      dS += `M${J(bx - nx * w, by - ny * w)}L${J(ex, ey)}L${J(bx + nx * w, by + ny * w)}z`;
      if (F && T.rnd() < 0.4) dH += `M${J(bx - nx * w * 0.3, by - ny * w * 0.3)}L${J(ex - Math.cos(a) * L * 0.3, ey - Math.sin(a) * L * 0.3)}`;
    }
    s += `<path d="${dS}" fill="#e9dcbd" stroke="#7a6240" stroke-width=".07" stroke-opacity=".55"/>` + (dH ? `<path d="${dH}" stroke="#fffaf0" stroke-width=".08" stroke-opacity=".8"/>` : "");
  }

  /* ---- Nasenlöcher oben auf der Schnauze (Halbmondschlitze) ---- */
  s += `<path d="M283 -125.2q2.2 -.3 3.2 1.3q-1.6 -.5 -3 -.5zM285.8 -123q1.8 -.1 2.5 1.4q-1.3 -.5 -2.4 -.6z" fill="#3a1810" opacity=".85"/>`;
  s += zart(T, [[282.6, -126.2], [286.4, -125.4]], "#f5d2c0", 0.22, 0.5);

  /* ---- Auge: klein, hoch und seitlich, in fleischiger Höhle; gerötete Bindehaut, braune Iris ---- */
  s += fleck(T, 266.4, -118.6, 3.4, 2.4, "#3b1d14", 0.5);
  s += T.augeReal(266.4, -118.8, 1.15, { iris: "#5a2e16", iris2: "#24100a", offen: 0.62, winkel: -8, weiss: true, lid: "#3a1a12", haut: "#9b5444" });
  s += fein(T, falte([[261.6, -122], [266.4, -123.6], [271.2, -122.4]], 0.35, 0.5) + falte([[262.4, -115.6], [266.6, -114.4], [270.8, -115.4]], 0.3, 0.4) + falte([[260.4, -125.4], [266.6, -127.4], [272.6, -125.6]], 0.4, 0.4));
  /* Gehöröffnung hinter dem Auge (keine Ohrmuschel): kleiner Schlitz in einer Hautfalte */
  s += zart(T, [[248.6, -116.4], [249.6, -114.2]], "#2a140e", 0.45, 0.8) + zart(T, [[247, -118], [250.4, -118.4], [251.6, -116.6]], "#4a271c", 0.35, 0.4);

  /* ---- nahe Vorderflosse: breit, kurz, fast quadratisch; stützt die Brust; fünf Fingerwülste, winzige Nägel ---- */
  const vf = [[220, -36], [231, -31], [242, -24.6], [252, -18], [261, -12.4], [268, -9], [274, -7.4], [277.8, -6.6], [279.4, -5], [278.4, -3.6], [280, -2.4], [279, -0.8], [274, -0.1],
    [258, -0.1], [242, -0.3], [230, -1.6], [221, -6.4], [215, -15], [214, -27]];
  let vi = weich([[224, -32], [244, -21], [266, -9.6], [276, -7], [264, -12], [244, -25], [226, -35]], "#f4c9b2", 0.6, 1.4) + weich([[218, -5], [250, -1.4], [278, -1.2], [250, 0], [218, -1]], "#2e170f", 0.55, 1);
  vi += weich([[214, -30], [224, -34], [228, -24], [222, -14], [216, -18]], "#2e170f", 0.55, 2.4) + weich([[226, -18], [248, -10], [266, -5], [246, -6], [228, -10]], "#c08a72", 0.35, 2);
  for (let i = 0; i < 5; i++) vi += falte([[238 + i * 1.6, -21 + i * 3.6], [254 + i * 2, -12.6 + i * 2.2], [266 + i * 2.2, -7.8 + i * 1.4], [275 + i * 1.2, -6.2 + i * 1.2]], 0.3, 0.4);
  vi += falte([[222, -32], [218, -20], [220, -9]], 0.6, 0.45) + falte([[230, -28], [228, -20]], 0.5, 0.35);
  s += `<g mask="${verlaufMaske(T, "vf", 205, -40, 80, 42, 226, -33, 232, -24, [[[226, -33], "#000"], [[232, -24], "#fff"]])}">` + silhouette(T, G(vf), verlauf(T, "vf", 0, -32, 0, 0, [[[0, -32], "#ad7158"], [[0, -14], "#97614b"], [[0, 0], "#6a4132"]]), vi, "#000", 0, 0) + `</g>`;
  s += `<path d="M275.4 -7q1.1 -.3 1.7 .3M277.4 -5.6q1.1 -.2 1.6 .4M278.4 -4q1 -.1 1.4 .5M278.6 -2.2q.9 0 1.3 .5" stroke="#2a1a12" stroke-width=".5" stroke-linecap="round" fill="none"/>`;

  /* Bauch liegt auf: schmaler Kontaktschatten (Okklusion), kein eigener Bodenschatten */
  s += weich([[60, -0.6], [120, -1], [200, -2], [240, -1.4], [200, 0.4], [120, 0.6], [62, 0.4]], "#1a0d08", 0.6, 0.8);
  return { svg: s, box: [5, -133.6, 295.4, 0], kopf: [236, -140, 302, -30] };
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
  const rumpf = [
    [30, -18], [40, -26], [54, -33], [72, -38], [92, -41], [110, -42.6], [124, -44], [133, -47.6], [140, -52], [146, -56], [153, -58.4], [160, -57.6], [165.6, -54.6],
    [169.4, -50.8], [173, -48.6], [175.6, -46.4], [176.6, -43.6], [175.6, -41], [173, -39.6], [169, -38.6], [164, -37], [158, -34.4], [151, -29.6], [144, -23],
    [136, -15.4], [126, -8.6], [112, -3.6], [90, -1.4], [64, -1.2], [46, -3], [36, -7.4], [30.6, -12],
  ];
  const kD = G(rumpf);
  /* Hinterflossen angehoben (Bananenhaltung), beide Sohlen aneinander: Fächer mit fünf Zehenstrahlen und Krallen */
  const hf = [[38, -20], [26, -24.6], [16, -29.6], [8, -34], [3, -37.6], [4.4, -35.4], [1.8, -33], [4.8, -31.2], [2.6, -28.6], [6.2, -26.8], [5, -24], [11, -21], [20, -16], [32, -9]];
  let hi = weich([[34, -18], [20, -25], [6, -34], [14, -27], [30, -16]], "#d6d2ca", 0.35, 0.8) + weich([[30, -10], [16, -20], [6, -25], [16, -17], [30, -8]], "#24221f", 0.45, 1);
  for (let i = 0; i < 5; i++) hi += zart(T, [[32, -12 - i * 1.4], [22, -18 - i * 1.6], [12, -23.6 - i * 2.2], [3 + (i % 2) * 2.2, -24.6 - i * 3]], "#2a2724", 0.3, 0.5);
  hi += `<path d="M7.6 -36.2l-1.8 -.6M6.6 -32.6l-1.7 -.4M6.8 -29.2l-1.6 -.3M8 -26l-1.6 -.2" stroke="#16130f" stroke-width=".55" stroke-linecap="round"/>`;
  s += silhouette(T, G(hf), verlauf(T, "shf", 0, -38, 0, -8, [[[0, -38], "#6c6862"], [[0, -8], "#4d4944"]]), hi, "#000", 0, 0);
  const fell = verlauf(T, "fell", 0, -58, 0, 0, [[[0, -58], "#5e6166"], [[0, -44], "#767a80"], [[0, -30], "#9a9893"], [[0, -16], "#bab4a9"], [[0, -5], "#a29c91"], [[0, 0], "#8d887e"]]);
  let n = `<rect x="0" y="-60" width="180" height="61" fill="${fell}"/>`;
  /* Rücken dunkler (Längsband), Licht von links oben auf Rücken und Scheitel, Kernschatten unten, Bodenreflex */
  n += weich([[30, -20], [54, -34], [92, -42], [124, -45], [142, -54], [156, -59], [150, -52], [124, -39], [92, -35], [56, -29], [34, -15]], "#3d4046", 0.5, 2);
  n += weich([[40, -25], [70, -36], [100, -39.6], [124, -41.6], [140, -50], [150, -55.6], [138, -48], [118, -38], [90, -36], [60, -32], [42, -21]], "#e9e6df", 0.3, 1.4);
  n += weich([[40, -6], [70, -9], [110, -10], [130, -14], [140, -22], [126, -6], [100, -2.6], [60, -2.4]], "#3a3530", 0.45, 3);
  n += weich([[60, -1.6], [100, -2], [124, -6], [100, -0.6], [60, -0.6]], "#d9dde2", 0.5, 0.8);
  n += weich([[148, -31], [160, -36.4], [170, -38.4], [158, -34], [150, -29]], "#3a3530", 0.4, 1.2);
  /* Fleckenmuster: viele kleine dunkle Flecken und Ringe, auf dem Rücken dichter, am Bauch spärlich und heller */
  {
    let dF = "", dR = "";
    const k = F ? 520 : 110;
    for (let i = 0; i < k; i++) {
      const x = 34 + T.rnd() * 134, y = -3 - T.rnd() * 56;
      if (!inPoly(x, y, rumpf) || x > 168) continue;
      const top = Math.min(1, (y + 4) / -40), r = (0.35 + T.rnd() * 0.9) * (0.6 + top * 0.6) * (x > 142 ? 0.55 : 1), dreh = Math.round(T.rnd() * 180);
      if (x > 163 || (x > 155 && y > -47 && y < -40) || Math.hypot(x - 160.2, y + 50.4) < 3) continue;
      if (T.rnd() > 0.25 + top * 0.6) continue;
      if (T.rnd() < 0.2) dR += `M${J(x - r, y)}a${J(r, r * 0.7, dreh)} 0 1 ${J(2 * r, 0)}a${J(r, r * 0.7, dreh)} 0 1 ${J(-2 * r, 0)}`;
      else dF += `M${J(x - r, y)}a${J(r, r * 0.6, dreh)} 0 1 ${J(2 * r, 0)}a${J(r, r * 0.6, dreh)} 0 1 ${J(-2 * r, 0)}`;
    }
    n += `<path d="${dF}" fill="#2c2b2c" fill-opacity=".55"${F ? ` filter="${blur(T, 0.12)}"` : ""}/>` + (dR ? `<path d="${dR}" fill="none" stroke="#2c2b2c" stroke-opacity=".45" stroke-width=".28"${F ? ` filter="${blur(T, 0.1)}"` : ""}/>` : "");
  }
  /* Kopf: Stirn und Scheitel dunkler, Schnauzenpolster hell, Okklusion an der Kehle */
  n += weich([[148, -56], [160, -58], [166, -53], [158, -52], [150, -52]], "#3d4046", 0.4, 1);
  n += weich([[166, -47], [174, -46.6], [176, -43], [172, -39.6], [165, -40.6]], "#c8c3ba", 0.6, 0.8);
  /* Fell: kurz, glatt, nach hinten anliegend; feiner Glanz entlang der Rundung */
  n += haare(T, rumpf.filter((p) => p[0] < 168), 700, (x, y) => 180 + (y + 30) * 0.25 + (x > 130 ? -(x - 130) * 0.5 : 0), 0.7,
    [["#2e2d2c", 1, 0.05, 0.25], ["#f2efe8", 0.8, 0.045, 0.3]], 10, 0.1, 0.04);
  n += fein(T, T.textur(kD, T.rauschen("sfell", { fx: 1.4, fy: 0.15, farbe: "#2a2826", staerke: 2, schwelle: 0.6, okt: 2 }), 90, 0.1, [0, -60, 180, 0]));
  s += silhouette(T, kD, fell, n, "#2a2a2a", 0.25, 0.5);

  /* ---- Vorderflosse: kurz, liegt an der Brust; fünf dunkle Krallen ---- */
  const vf = [[124, -18], [132, -14], [139, -9], [143.6, -5.2], [145.4, -3], [144, -1.2], [138, -0.6], [130, -2.2], [123, -6], [119, -12]];
  let vi = weich([[124, -15], [134, -11], [142, -5], [134, -8], [124, -12]], "#e9e6df", 0.4, 0.8) + weich([[120, -4], [134, -1.4], [144, -1.6], [130, 0], [120, -2]], "#2e2b28", 0.5, 0.8);
  vi += haare(T, vf, 120, 40, 0.8, [["#2e2d2c", 1, 0.05, 0.35], ["#f2efe8", 0.7, 0.05, 0.35]], 12, 0.1, 0.05);
  s += `<g mask="${verlaufMaske(T, "svf", 112, -22, 36, 24, 121, -16, 126, -11, [[[121, -16], "#000"], [[126, -11], "#fff"]])}">` + silhouette(T, G(vf), verlauf(T, "svf", 0, -18, 0, 0, [[[0, -18], "#9e9a92"], [[0, 0], "#6e6a63"]]), vi, "#000", 0, 0) + `</g>`;
  s += `<path d="M141.6 -5.4q1.6 -.2 2.4 .8M143 -4q1.5 0 2.2 .9M143.8 -2.6q1.4 .1 1.9 1M143.6 -1.4q1.2 .2 1.6 1" stroke="#1d1a17" stroke-width=".45" stroke-linecap="round" fill="none"/>`;

  /* ---- Gesicht: Nasenloch (Komma an der Spitze), Mundspalte, Schnurrhaarpolster mit Haarbälgen ---- */
  s += `<path d="M174.4 -44.6q1.7 -.7 2.1 .9q-.8 -.2 -1.5 .5q-.4 -.7 -.6 -1.4z" fill="#151413"/>` + zart(T, [[173, -46.8], [175.6, -46]], "#e8e4dc", 0.2, 0.5);
  s += zart(T, [[174, -40.6], [170, -39.6], [165.6, -38.6]], "#2a2622", 0.35, 0.8);
  if (F) {
    let d = "";
    for (let r = 0; r < 4; r++) for (let i = 0; i < 6 - (r === 3 ? 2 : 0); i++) d += `M${J(166.4 + i * 1.3 - r * 0.7 + (T.rnd() - 0.5) * 0.5, -44.6 + r * 1.15 + i * 0.18 + (T.rnd() - 0.5) * 0.4)}h.01`;
    s += `<path d="${d}" stroke="#3a3632" stroke-width=".4" stroke-linecap="round" stroke-opacity=".7"/>`;
  }
  /* Tasthaare: hell, kräftig, leicht gewellt (perlschnurartig), fächern nach vorn-unten */
  {
    let d = "";
    const k = F ? 22 : 10;
    for (let i = 0; i < k; i++) {
      /* Ansatz in Reihen auf dem Schnurrhaarpolster, Fächer von vorn-oben bis nach unten */
      const t = i / (k - 1), r = i % 4, bx = 166.6 + (i >> 2) * 1.1 - r * 0.6, by = -44.4 + r * 1.15 + (i >> 2) * 0.18, L = 6.5 + T.rnd() * 3.5 - r * 0.6;
      const a = (-14 + r * 18 + (i >> 2) * 3 + (T.rnd() - 0.5) * 12) * Math.PI / 180;
      const ex = bx + Math.cos(a) * L, ey = by + Math.sin(a) * L + L * 0.18;
      if (F) { let p = `M${J(bx, by)}`; for (let j = 1; j <= 6; j++) { const f = j / 6, w = (j % 2 ? 0.25 : -0.25) * (1 - f); p += `L${J(bx + (ex - bx) * f - Math.sin(a) * w, by + (ey - by) * f + Math.cos(a) * w + Math.sin(f * Math.PI) * L * 0.06)}`; } d += p; }
      else d += `M${J(bx, by)}Q${J((bx + ex) / 2, (by + ey) / 2 + L * 0.08, ex, ey)}`;
    }
    s += `<path d="${d}" fill="none" stroke="#efe9dc" stroke-width=".13" stroke-opacity=".9" stroke-linecap="round" stroke-linejoin="round"/>` + fein(T, `<path d="${d}" fill="none" stroke="#6b665e" stroke-width=".04" stroke-opacity=".5" transform="translate(.05 .07)"/>`);
  }
  /* Brauenhaare über dem Auge */
  s += fein(T, `<path d="M160.4 -53.6q1.4 -2.6 3.4 -3.6M161.6 -53.4q1.8 -2.2 4 -2.8" stroke="#e6e0d4" stroke-width=".12" fill="none" stroke-opacity=".8"/>`);
  /* ---- Auge: groß, rund, fast schwarz, feucht glänzend; dunkler Lidrand ---- */
  s += fleck(T, 160, -50.2, 3.2, 2.6, "#1f1e1d", 0.55);
  s += T.augeReal(160.2, -50.4, 1.5, { iris: "#2a1a10", iris2: "#0c0705", offen: 0.88, winkel: -4, lid: "#141210" });
  /* Ohröffnung hinter dem Auge */
  s += fleck(T, 150.8, -49.6, 0.9, 0.6, "#1d1c1b", 0.7) + fleck(T, 150.4, -50.4, 1.4, 0.6, "#e8e4dc", 0.25);
  return { svg: s, box: [1.8, -58.4, 176.6, 0], kopf: [138, -64, 190, -28] };
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
  /* prall und kurz: der Hals verschwindet im Speck, großer runder Kopf, sehr kurze Schnauze */
  const rumpf = [
    [12, -10], [18, -17.4], [28, -23.4], [40, -27.6], [52, -30], [61, -31.4], [67, -33.6], [72, -36.4], [77, -38.2], [82, -38.4], [86.4, -36.8], [89.4, -34.2],
    [91.4, -31.4], [92.6, -29], [93.2, -26.8], [92.6, -24.8], [90.8, -23.6], [88, -22.8], [84, -21.2], [79, -17.6], [74, -12.2], [67, -7.2], [56, -3], [42, -1.2], [28, -1.6], [18, -4.4], [13, -7],
  ];
  /* Hinterflossen: dunkelgrau, behaart, Zehen mit kleinen Krallen, liegen nach hinten zusammen */
  const hf = [[14, -11.6], [8, -13.4], [2.6, -15.2], [0.4, -14], [2.2, -12.4], [0.2, -11], [2.4, -9.6], [0.8, -8], [3.4, -6.8], [8, -5.4], [13, -5.6]];
  let hi = weich([[12, -11], [4, -13.6], [6, -11], [12, -9]], "#cfd4da", 0.35, 0.6);
  for (let i = 0; i < 4; i++) hi += zart(T, [[12, -9.6 + i * 0.6], [6, -11.4 + i * 1.4], [1.6 + (i % 2), -13.6 + i * 1.8]], "#1e1f22", 0.18, 0.5);
  hi += haare(T, hf, 70, 185, 0.7, [["#e9ecef", 1, 0.05, 0.45]], 20, 0.3, 0.1);
  s += silhouette(T, G(hf), verlauf(T, "rhf", 0, -15, 0, -5, [[[0, -15], "#5a5e65"], [[0, -5], "#34363b"]]), hi, "#000", 0, 0);

  /* ---- Körper: weißes Wollfell, Schatten blaugrau (Himmel/Schnee), unten Reflexlicht vom Eis ---- */
  const kD = G(rumpf);
  const fell = verlauf(T, "rfell", 0, -39, 0, 0, [[[0, -37], "#fdfcf9"], [[0, -26], "#f4f2ec"], [[0, -16], "#dfe3e8"], [[0, -7], "#b8c3cf"], [[0, -2], "#a3b1c1"], [[0, 0], "#c9d6e2"]]);
  let n = `<rect x="0" y="-40" width="98" height="41" fill="${fell}"/>`;
  /* große weiche Formen: Licht oben links auf Rücken und Kopf, Kernschatten im unteren Drittel, Schatten unter dem Kinn,
     leicht gelblicher Schimmer (Fruchtwasser der ersten Tage) an Flanke und Hals */
  n += weich([[20, -18], [40, -26], [60, -29], [72, -34], [82, -37], [78, -33], [62, -25], [40, -21], [22, -14]], "#ffffff", 0.9, 1.8);
  n += weich([[30, -11], [50, -12.4], [66, -10], [72, -12], [64, -5], [44, -3.4], [26, -4]], "#7f90a6", 0.45, 3);
  n += weich([[74, -22], [84, -22.4], [91, -24], [82, -18.6], [75, -15]], "#6f8099", 0.5, 1.4) + weich([[64, -30], [70, -33], [72, -26], [66, -22]], "#8d9bb0", 0.3, 2.4);
  n += weich([[46, -18], [62, -20], [72, -24], [60, -14], [48, -13]], "#efe3c2", 0.35, 3);
  /* Wollfell: viele kurze, gekräuselte Haare in Lagen (Schatten-, Grund- und Lichthaare), Wuchs nach hinten */
  const wuchs = (x, y) => (x > 72 ? 200 + (y + 30) * 2 : 182 + (y + 15) * 0.8);
  /* Wolle als Relief (flauschige Büschel, Schatten kühl) per multiply, darüber Locken */
  if (F) n += `<g style="mix-blend-mode:multiply" opacity=".42"><rect x="0" y="-40" width="98" height="41" fill="#fff" filter="${hautLicht(T, "wolle", { typ: "fractalNoise", f: 0.9, tiefe: 0.16, okt: 3, seed: 5, farbe: "#f2f6fb" })}"/></g>`;
  n += locken(T, rumpf.filter((p) => p[0] < 90), 1500, wuchs, 0.7, [["#a3afbf", 1, 0.07, 0.45], ["#ffffff", 1.5, 0.08, 0.75], ["#dfe3e9", 0.8, 0.07, 0.5]]);
  /* Gesicht: kurze Haare um Auge und Schnauze, etwas grauer Schimmer um die Augen */
  n += weich([[82, -33], [88, -33.4], [90, -29.6], [86, -28], [81.6, -29.4]], "#9aa4b1", 0.35, 0.9);
  n += weich([[90.6, -30.4], [95, -28.4], [95.4, -25.6], [92, -24.8], [89.6, -26.6]], "#e3e6ea", 0.6, 0.5);
  s += silhouette(T, kD, fell, n, "#7d8796", 0.2, 0.6);
  /* Flauschkante: abstehende Wollhaare entlang Rücken, Kopf und Bauch brechen die glatte Kontur */
  s += kante(T, [[12, -10.6], [18, -17.6], [28, -23.6], [40, -27.8], [52, -30.2], [61, -31.6], [67, -33.8], [72, -36.6], [77, -38.4], [82, -38.6], [86.4, -37]], 200, -0.2, -0.35, "#ffffff", 0.08, 0.7, 0.2);
  s += kante(T, [[84, -21.4], [79, -17.8], [74, -12.4], [67, -7.4]], 50, 0.35, 0.3, "#c7d0db", 0.08, 0.75, 0.2);

  /* ---- Vorderflosse: kurz, behaart, an der Brust; fünf dunkle Krallen ---- */
  const vf = [[63, -11.6], [68.4, -9], [72.6, -5.8], [75.6, -2.8], [76.6, -1.2], [75, -0.3], [70, -0.6], [65, -2.6], [61, -6.4]];
  let vi = weich([[64, -9.6], [70, -7], [75, -3], [70, -4.6], [64, -7]], "#ffffff", 0.7, 0.6) + weich([[62, -2.6], [70, -0.8], [77, -0.8], [70, 0], [62, -1]], "#6f8099", 0.5, 0.6);
  vi += haare(T, vf, 140, 40, 0.6, [["#a7b2c1", 1, 0.06, 0.45], ["#ffffff", 1, 0.06, 0.6]], 26, 0.4, 0.06);
  s += `<g mask="${verlaufMaske(T, "rvf", 58, -14, 22, 15, 63, -11, 66, -7.4, [[[63, -11], "#000"], [[66, -7.4], "#fff"]])}">` + silhouette(T, G(vf), verlauf(T, "rvf", 0, -11, 0, 0, [[[0, -11], "#eef0f2"], [[0, 0], "#aab6c4"]]), vi, "#000", 0, 0) + `</g>`;
  s += `<path d="M74.4 -3.4q1.2 -.1 1.7 .8M75.4 -2.4q1.1 0 1.5 .8M75.8 -1.4q1 .1 1.3 .8" stroke="#24221f" stroke-width=".32" stroke-linecap="round" fill="none"/>`;

  /* ---- Gesicht: schwarze Nase mit zwei Schlitzen, dunkle Lippen, Tasthaare, sehr große feuchte Augen ---- */
  s += form(T, [[91, -29.6], [92.6, -29.2], [93.5, -27.6], [93.2, -26.2], [92, -25.9], [91, -27]], verlauf(T, "rnase", 0, -29.6, 0, -25.9, [[[0, -29.6], "#3d3a38"], [[0, -25.9], "#0d0c0b"]]));
  s += `<path d="M92.8 -27.8q.6 -.3 .7 .5M92.1 -27q.5 -.2 .6 .4" stroke="#000" stroke-width=".2" fill="none" stroke-linecap="round"/><ellipse cx="92" cy="-28.9" rx=".45" ry=".2" fill="#fff" opacity=".45"/>`;
  s += zart(T, [[91.8, -25.4], [90.4, -24.9], [88.8, -24.9]], "#2a2724", 0.22, 0.8);
  if (F) {
    let d = "";
    for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) d += `M${J(87.4 + i * 1 - r * 0.5 + (T.rnd() - 0.5) * 0.3, -27.8 + r * 0.9 + i * 0.12)}h.01`;
    s += `<path d="${d}" stroke="#7a7570" stroke-width=".28" stroke-linecap="round" stroke-opacity=".7"/>`;
  }
  {
    let d = "";
    const k = F ? 14 : 7;
    for (let i = 0; i < k; i++) {
      const t = i / (k - 1), bx = 87.8 + t * 3.2, by = -27.8 + t * 1.8, L = 4.6 + T.rnd() * 2.6 - t * 1.4, a = (-4 + t * 44 + (T.rnd() - 0.5) * 10) * Math.PI / 180;
      d += `M${J(bx, by)}q${J(Math.cos(a) * L * 0.5, Math.sin(a) * L * 0.5 - 0.2, Math.cos(a) * L, Math.sin(a) * L + L * 0.18)}`;
    }
    s += `<path d="${d}" fill="none" stroke="#e8e4dc" stroke-width=".09" stroke-opacity=".9" stroke-linecap="round"/>` + fein(T, `<path d="${d}" fill="none" stroke="#6f6a63" stroke-width=".03" stroke-opacity=".6" transform="translate(.04 .05)"/>`);
  }
  s += fein(T, `<path d="M82.2 -34.4q.8 -1.8 2.2 -2.6M83 -34.2q1 -1.6 2.6 -2" stroke="#e8e4dc" stroke-width=".07" fill="none"/>`);
  /* Auge: sehr groß, dunkel, feucht, in einer leichten Höhle; „Tränenspur“ darunter */
  s += fleck(T, 82.6, -31.4, 2.8, 2.3, "#5d6876", 0.55) + fleck(T, 83, -28.6, 1, 2.2, "#8a8579", 0.3, -15);
  s += T.augeReal(82.6, -31.6, 1.5, { iris: "#24170f", iris2: "#080504", offen: 0.98, winkel: -4, lid: "#100e0c" });
  s += `<ellipse cx="81.7" cy="-32.4" rx=".38" ry=".27" fill="#fff" opacity=".85"/>`;
  return { svg: s, box: [0.2, -38.6, 93.5, 0], kopf: [66, -44, 98, -18] };
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
  const fell = verlauf(T, "pfell", 0, -44, 0, 0, [[[0, -44], "#fdfdfb"], [[0, -32], "#f7f7f4"], [[0, -22], "#e8ebef"], [[0, -13], "#cbd4de"], [[0, -6], "#d6dde6"], [[0, 0], "#bfcad6"]]);
  const fellF = verlauf(T, "pfellF", 0, -28, 0, 0, [[[0, -28], "#c3ccd7"], [[0, -12], "#aab6c5"], [[0, 0], "#97a5b7"]]);
  const randF = verlauf(T, "prf", 0, -44, 0, 0, [[[0, -44], "#f8f9f7"], [[0, -24], "#e2e7ec"], [[0, -12], "#c3cdd8"], [[0, 0], "#c9d2dc"]]);
  /* Wuchs: Kopf nach hinten, Krause nach unten-hinten, Rumpf nach hinten, Beine nach unten */
  const wuchs = (x, y) => (x > 76 ? 186 : x > 64 ? 130 - (y + 28) * 2.5 : y > -15 ? 100 : 176 + (y + 24) * 1.2);
  /* Haar in Lagen: kühle Schattenhaare (nur sichtbar, wo Schatten liegt), weiße Deckhaare */
  const haar = (pts, k, w, L, sz = 0.04) => haare(T, pts, k, w, L, [["#8796ab", 1, 0.06, 0.26], ["#ffffff", 1.5, 0.07, 0.7]], 16, 0.3, sz);
  /* weiche Büschel (Plastik des Fells) */
  const klumpen = (pts, k, w, L, br) => buschel(T, pts, k, w, L, br, ["#7d8da3", 0.09], ["#ffffff", 0.5], 14, 0.05);

  /* ---- ferne Beine (Körperton, kühl beschattet, modelliert; Hinterbein mit Sprunggelenk) ---- */
  const vbF = [[60, -16], [64, -15.6], [64.4, -10], [64, -5], [64.8, -2.6], [67.6, -1.8], [68.4, -0.6], [67.4, 0, 1], [61.6, 0, 1], [61, -1.6], [61, -6], [60.4, -11]];
  const hbF = [[39, -20], [46.6, -19], [47.4, -13], [44.4, -8.4], [44.8, -2.6], [47.8, -1.8], [48.6, -0.6], [47.6, 0, 1], [41.8, 0, 1], [41.2, -1.6], [41, -6], [40, -10.6], [38.8, -15]];
  let fi = weich([[60.6, -15], [63, -15], [62.6, -4], [61.4, -4]], "#eef2f6", 0.5, 0.8) + weich([[40, -18], [45, -17], [44, -9.6], [41.6, -9.6]], "#eef2f6", 0.4, 1);
  fi += haar(vbF, 45, 95, 1) + haar(hbF, 55, (x, y) => (y < -10 ? 115 : 95), 1.1);
  s += silhouette(T, vereint(T, [vbF, hbF]), fellF, fi, "#000", 0, 0);
  s += fellRand(T, [[61.2, -2.2], [64, -2.6], [66.6, -2.2], [68.2, -1.2]], 10, 0.6, 0.2, "#b6c2cf", -1, 0.3) + fellRand(T, [[41.4, -2.2], [44, -2.6], [46.6, -2.2], [48.4, -1.2]], 10, 0.6, 0.2, "#b6c2cf", -1, 0.3);

  /* ---- Schwanz: sehr buschig, fast so dick wie der Rumpf hinten, tief getragen ---- */
  const schwanz = [[32, -29], [25, -29.6], [17, -28], [10.4, -24.4], [5.6, -19.6], [3.4, -14.6], [4.2, -10.4], [7.2, -8.4], [11.4, -9.2], [16.4, -12], [22.4, -15], [30, -17.4]];
  let si = weich([[28, -28.4], [16, -27], [8, -21], [14, -23], [26, -25]], "#ffffff", 0.85, 1.4) + weich([[28, -19], [16, -14], [6.4, -11], [14, -10.6], [26, -16.4]], "#7b8aa0", 0.45, 1.6);
  si += klumpen(schwanz, 50, (x, y) => 170 + (x - 16) * -1.4 + (y + 19) * 1.6, 3.6, 0.32);
  si += haar(schwanz, 190, (x, y) => 170 + (x - 16) * -1.4 + (y + 19) * 1.6, 2.4);
  s += silhouette(T, G(schwanz), fell, si, "#000", 0, 0);
  s += fellRand(T, [[31, -29.2], [25, -29.8], [17, -28.2], [10.4, -24.6], [5.6, -19.8], [3.4, -14.8], [4.2, -10.6], [7.2, -8.6]], 90, 1.3, 0.26, randF, -1, -0.35);
  s += fellRand(T, [[7.2, -8.4], [11.4, -9.2], [16.4, -12], [22.4, -15], [29, -17.2]], 40, 1.1, 0.24, "#bcc7d3", -1, 0.25);

  /* ---- Körper, Kopf und nahe Beine als EINE Silhouette ---- */
  /* kompakt und rund (Winterfell), Kopf erhoben, Schädel rund, breite buschige Wangen, kurze Schnauze, deutlicher Stopp */
  const rumpf = [
    [27, -25.6], [33, -30], [42, -32.6], [52, -33], [60, -32.6], [65, -33.4], [69, -35.6], [72, -38.2], [74.6, -40.4], [77.6, -41.6], [80.4, -41.2], [82.6, -39.6],
    [83.8, -37.8], [85, -37], [86.8, -36.4], [88.2, -35.6], [88.8, -34.4], [88.4, -33.4], [87.2, -32.8], [85.4, -32.2], [83.4, -31.4], [81.8, -30], [79.6, -28.4],
    [76.4, -26.8], [73.4, -23.6], [70.6, -19], [67, -15], [60, -12.6], [50, -11.8], [42, -12.2], [35.6, -13.8], [30.6, -17], [27.6, -21.4],
  ];
  const vbN = [[62.6, -18], [67.6, -17.6], [68.6, -12], [68.2, -6], [69, -3.2], [72.2, -2.4], [73.2, -0.8], [72.2, 0, 1], [65.6, 0, 1], [64.8, -1.4], [64.8, -5], [64.2, -11], [62.2, -15]];
  const hbN = [[28.6, -24], [37, -25], [43, -21], [44, -15.4], [40.6, -10.4], [38.2, -6.6], [38.8, -2.8], [41.8, -1.8], [42.6, -0.6], [41.6, 0, 1], [35.2, 0, 1], [34.6, -1.6], [34.6, -4.6], [33.4, -7.2], [31.4, -9.6], [30.2, -13], [29, -17.6]];
  const kD = vereint(T, [rumpf, vbN, hbN]);
  let n = `<rect x="20" y="-46" width="72" height="47" fill="${fell}"/>`;
  /* große Formen: Licht oben links (Rücken, Kopf, Krause), Kernschatten am Bauch, Okklusion Achsel/Leiste, Bodenreflex */
  n += weich([[30, -28], [46, -32], [60, -31.6], [70, -36], [78, -40.4], [74, -35], [62, -29], [46, -28], [32, -24.6]], "#ffffff", 0.9, 1.4);
  n += weich([[32, -14.4], [46, -12.6], [60, -13], [68, -15], [62, -18], [46, -18.6], [34, -18.6]], "#7b8aa0", 0.42, 2);
  n += weich([[61.4, -19], [66.4, -18], [67, -14], [62.4, -14]], "#6a7a91", 0.45, 1.2) + weich([[34, -21], [40, -22], [41, -16], [35, -15]], "#6a7a91", 0.35, 1.4);
  n += weich([[71, -25], [78, -28], [84, -30.6], [77, -24], [71.6, -20]], "#7b8aa0", 0.35, 1.2);
  n += weich([[65.6, -2], [72.4, -1.4], [72.4, -0.2], [65.6, -0.2]], "#dfe8f1", 0.6, 0.4) + weich([[35.4, -2], [43.2, -1.4], [43.2, -0.2], [35.4, -0.2]], "#dfe8f1", 0.6, 0.4);
  /* Muskeln/Gelenke unter dem Fell: Schulter, Keule, Knie, Fersenhöcker (Sprunggelenk), Handwurzel */
  n += weich([[58, -29], [64, -28.6], [66.6, -21], [61, -20.6]], "#a3b1c2", 0.28, 1.8) + weich([[30, -28], [39, -28], [43.6, -21], [35, -19.6]], "#a3b1c2", 0.26, 2);
  n += weich([[41, -22], [43.6, -20], [43, -16], [40.6, -18]], "#ffffff", 0.6, 0.8);
  n += weich([[31.4, -10.4], [33.4, -9.6], [34, -7.2], [32.4, -7.6]], "#6a7a91", 0.5, 0.5) + weich([[64.8, -6.4], [67.4, -6.6], [67.6, -4.6], [65, -4.4]], "#7b8aa0", 0.35, 0.5);
  n += weich([[35.4, -7.6], [37.6, -7.2], [37.8, -3], [35.6, -3]], "#ffffff", 0.45, 0.6) + weich([[65.6, -15], [67, -15], [66.8, -7], [65.6, -7]], "#ffffff", 0.45, 0.5);
  /* Fell: weiche Büschel, darüber feine Haare in Wuchsrichtung */
  const rumpfH = rumpf.filter((p) => p[0] < 80);
  n += klumpen(rumpfH, 90, wuchs, 3.4, 0.3);
  n += haar(rumpfH, 420, wuchs, 1.8);
  n += haar(vbN, 80, (x, y) => (y < -10 ? 105 : 92), 1) + haar(hbN, 110, (x, y) => (y < -12 ? 125 : x < 34 ? 110 : 92), 1.2);
  /* Kopf: Stirn hell, Augenpartie leicht grau, Schnauzenrücken kurzhaarig, Wangen buschig */
  n += weich([[77, -39.4], [82, -39], [85, -36.4], [81.6, -35.6], [77.6, -36.6]], "#ffffff", 0.6, 0.8) + weich([[78.8, -38], [82.2, -38], [82.4, -35.6], [79.2, -35.6]], "#a3afbf", 0.38, 0.6);
  n += weich([[84, -32.6], [88, -33.6], [87.6, -32.8], [84, -31.8]], "#9aa6b6", 0.45, 0.4) + weich([[83.4, -37.6], [86, -36.6], [85.6, -35.6], [83.4, -36]], "#ffffff", 0.7, 0.4);
  n += haare(T, [[83.8, -37.6], [88.2, -35.6], [88.2, -34], [84, -34.4]], 26, 195, 0.55, [["#a9b4c2", 1, 0.05, 0.45]], 10, 0.1, 0.1);
  /* Wange: buschig, nach hinten gekämmt, macht den Kopf breit und rund */
  n += weich([[74, -36], [80, -35], [83, -32], [79, -29.6], [74.6, -30.4]], "#ffffff", 0.7, 1) + weich([[75, -31.4], [81, -30.6], [82.4, -30], [78, -28.6], [75, -29]], "#8d9bb0", 0.35, 0.8);
  s += silhouette(T, kD, fell, n, "#000", 0, 0);
  /* weiche Kontur: kurze, gebogene Büschel an Rücken, Nacken, Halskrause, Bauchfransen, „Hosen“ */
  const rand = (pts, k, L, w, seite, zug, f) => fellRand(T, pts, k, L, w, f || randF, seite, zug);
  s += rand([[28, -26.2], [33, -30.2], [42, -32.8], [52, -33.2], [60, -32.8], [65, -33.6], [69, -35.8], [72, -38.4], [74.6, -40.6]], 90, 1, 0.2, 1, -0.5);
  s += rand([[83.6, -30.8], [81.4, -29.6], [78.4, -28.6], [75.4, -26.6], [73, -23.2], [70.6, -19.4]], 70, 1.6, 0.3, 1, -0.3);
  s += rand([[70.6, -19], [67, -15], [60, -12.6], [50, -11.8], [42, -12.2], [35.6, -13.8]], 80, 1.2, 0.24, 1, 0.15, "#bcc7d3");
  s += rand([[29, -17.6], [30.6, -12.6], [32, -8.6]], 26, 1.2, 0.26, -1, 0.35, "#c4cfda");
  /* Backenbart: helle Wangenhaare fallen vom Kieferwinkel nach hinten-unten */
  s += rand([[76, -33], [78, -31.6], [80.6, -30.6], [83.4, -30.6]], 34, 1.3, 0.24, -1, 0.5, "#f4f6f7");
  s += fein(T, haare(T, [[75, -35], [80.6, -33], [84, -31], [79, -29.6], [75, -30.6]], 60, 168, 1.2, [["#ffffff", 1, 0.07, 0.8], ["#a7b3c2", 0.6, 0.06, 0.45]], 20, 0.3));
  /* Pfoten: dicht behaart, Zehen als Wülste, Krallenspitzen kaum sichtbar */
  s += rand([[65.2, -1.2], [67.8, -2.4], [70.8, -2.4], [72.8, -1.2]], 18, 0.6, 0.2, 1, 0.6, "#e6ebf0") + rand([[35.2, -1.2], [37.8, -2.4], [40.8, -2.2], [43.4, -1.2]], 18, 0.6, 0.2, 1, 0.6, "#e6ebf0");
  s += `<path d="M69.6 -1.8q.4 .9 .2 1.7M71.2 -1.8q.4 .8 .2 1.6M40 -1.8q.4 .9 .2 1.7M41.6 -1.8q.4 .8 .2 1.6" stroke="#93a2b6" stroke-width=".18" fill="none" stroke-opacity=".7"/>`;
  s += `<path d="M72.8 -.5l.7 .4M72.2 -.2l.6 .3M43.4 -.5l.7 .4M42.8 -.2l.6 .3" stroke="#3a3632" stroke-width=".22" stroke-linecap="round" stroke-opacity=".8"/>`;

  /* ---- Ohren: kurz, gerundet, dicht behaart, weit auseinander, halb im Fell ---- */
  const ohrF = [[77.6, -40.2], [78.2, -42.8], [79.4, -44.2], [80.8, -43.6], [81.4, -41.4], [81.2, -39.8]];
  s += silhouette(T, G(ohrF), verlauf(T, "pohrF", 0, -44, 0, -40, [[[0, -44], "#dfe4ea"], [[0, -40], "#b9c4d0"]]), haar(ohrF, 24, -80, 0.6) + weich([[78.4, -42.6], [80, -43.2], [80.4, -41], [78.8, -41]], "#8f9bab", 0.4, 0.4), "#000", 0, 0);
  s += fellRand(T, [[77.8, -40.6], [78.3, -42.8], [79.5, -44.3], [80.9, -43.6], [81.5, -41.4]], 18, 0.5, 0.12, "#dfe4ea", -1, 0);
  const ohr = [[73.2, -39.4], [73.6, -42.2], [74.8, -44.4], [76.4, -44.8], [77.8, -43], [78.4, -40.2]];
  const ohrI = [[74.6, -40.6], [75, -42.6], [76, -43.6], [77, -42.4], [77.2, -40.6]];
  s += silhouette(T, G(ohr), verlauf(T, "pohr", 0, -44.8, 0, -39.4, [[[0, -44.8], "#f6f6f3"], [[0, -39.4], "#e3e7ec"]]),
    form(T, ohrI, verlauf(T, "pohrI", 0, -43.6, 0, -40.6, [[[0, -43.6], "#a7b0bc"], [[0, -40.6], "#d9dee4"]])) + haare(T, ohrI, 36, -100, 0.8, [["#ffffff", 1, 0.06, 0.85]], 30, 0.3, 0.1), "#000", 0, 0);
  s += fellRand(T, [[73.4, -39.8], [73.7, -42.2], [74.9, -44.4], [76.4, -44.9], [77.9, -43]], 22, 0.55, 0.13, "#f6f6f3", -1, 0);
  s += fellRand(T, [[71, -37.4], [73.6, -39.4], [76.6, -40.4], [79, -40.6]], 26, 0.9, 0.22, "#f7f8f6", 1, -0.2);

  /* ---- Gesicht: schwarze Nase, Lippenrand, dunkle Tasthaare, Auge bernstein mit Schlitzpupille ---- */
  s += form(T, [[87.8, -36.2], [88.7, -35.8], [89.2, -34.8], [89, -34], [88.2, -33.9], [87.6, -34.8]], verlauf(T, "pnase", 0, -36.2, 0, -33.9, [[[0, -36.2], "#45403d"], [[0, -33.9], "#0d0c0b"]]));
  s += `<path d="M88.7 -34.6q.3 -.15 .4 .2" stroke="#000" stroke-width=".14" fill="none"/><ellipse cx="88.3" cy="-35.8" rx=".3" ry=".13" fill="#fff" opacity=".5"/>`;
  s += zart(T, [[88.1, -33.6], [86.8, -33.1], [85.4, -32.8], [84.6, -32.9]], "#181513", 0.16, 0.9) + zart(T, [[87.6, -32.8], [86, -32.3], [84.6, -31.8]], "#c9d1db", 0.3, 0.6);
  if (F) {
    let d = "";
    for (let i = 0; i < 9; i++) { const a = (-4 + i * 5 + (T.rnd() - 0.5) * 6) * Math.PI / 180, L = 4.4 + T.rnd() * 2.4, bx = 85.2 + (i % 3) * 0.7, by = -33.8 + (i % 3) * 0.3; d += `M${J(bx, by)}q${J(Math.cos(a) * L * 0.5, Math.sin(a) * L * 0.5 - 0.3, Math.cos(a) * L, Math.sin(a) * L + 0.6)}`; }
    s += `<path d="${d}" fill="none" stroke="#2d2a28" stroke-width=".06" stroke-opacity=".8"/>`;
  }
  s += fleck(T, 81.4, -36.8, 1.7, 1.2, "#6a7889", 0.45);
  s += T.augeReal(81.4, -37, 0.7, { iris: "#c99a3a", iris2: "#7a4f12", pupille: "schlitz", offen: 0.66, winkel: -10, lid: "#15110d" });
  return { svg: s, box: [3, -44.9, 89.4, 0], fuesse: [39, 44, 65, 69], kopf: [68, -48, 93, -24] };
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
  const fell = verlauf(T, "rfell2", 0, -140, 0, 0, [[[0, -140], "#6c5c4b"], [[0, -112], "#74634f"], [[0, -92], "#7e6c56"], [[0, -74], "#9c8d74"], [[0, -60], "#5a4b3d"], [[0, -40], "#43362b"], [[0, 0], "#342a22"]]);
  const fellF = verlauf(T, "rfellF", 0, -70, 0, 0, [[[0, -70], "#5e5042"], [[0, -30], "#40342a"], [[0, 0], "#2f2620"]]);
  const haarL = (pts, k, w, L, f = "#2b2219", l = "#d8ccb4") => haare(T, pts, k, w, L, [[f, 1, 0.12, 0.4], [l, 0.9, 0.11, 0.45]], 14, 0.2, 0.05);
  /* Huf: halbmondförmig, breit, Kronrand hell, Afterklaue dahinter */
  const huf = (x, fern) => {
    const h = [[x - 5.4, -6], [x + 4, -6.2], [x + 9, -2.6], [x + 10, 0, 1], [x - 6.2, 0, 1], [x - 6.4, -2.8]];
    let o = form(T, h, fern ? "#17130f" : verlauf(T, "huf", 0, -5.6, 0, 0, [[[0, -5.6], "#4c4238"], [[0, 0], "#15110d"]]));
    o += fein(T, zart(T, [[x - 4.4, -4.8], [x + 3.6, -5], [x + 7, -2.4]], fern ? "#3a3027" : "#8a7a66", 0.25, 0.6) + zart(T, [[x + 1.4, -5.2], [x + 2.6, -0.4]], "#0a0806", 0.25, 0.7));
    o += form(T, [[x - 8.4, -8.4], [x - 5, -8.6], [x - 4.2, -4.8], [x - 7.4, -3.4], [x - 9.2, -5.6]], fern ? "#120f0c" : "#2a221b");
    return o;
  };
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

  /* ---- ferne Beine ---- */
  const vbF = lauf([[128, -72], [126, -50], [125.4, -34], [126, -20], [127, -10], [129, -5]], [[8, 8], [6, 6], [4.6, 5], [3.6, 4], [3.8, 4], [4.6, 4.6]]);
  const hbF = lauf([[54, -80], [62, -58], [50, -40], [47, -26], [47.6, -12], [49, -5]], [[12, 9], [8, 7], [4.6, 4.2], [3.6, 3.8], [3.6, 3.8], [4.4, 4.4]]);
  let fi = weich([[123, -60], [125, -60], [124.4, -14], [123, -14]], "#7c6b58", 0.4, 1) + weich([[45, -36], [47, -36], [46.6, -12], [45.4, -12]], "#7c6b58", 0.35, 1);
  fi += weich([[122, -12], [132, -12], [132, -6], [122, -6]], "#a89a82", 0.8, 0.6) + weich([[44, -12], [53, -12], [53, -6], [44, -6]], "#a89a82", 0.8, 0.6);
  fi += haarL(vbF, 70, 92, 1.4, "#1d1712", "#8a7a66") + haarL(hbF, 90, (x, y) => (y < -45 ? 120 : 95), 1.4, "#1d1712", "#8a7a66");
  s += silhouette(T, vereint(T, [vbF, hbF]), fellF, fi, "#000", 0, 0);
  s += huf(130, true) + huf(50, true);

  /* ---- fernes Geweih (hinter dem Kopf, dunkler) ---- */
  const geweih = (dx, dy, k, fern) => {
    const P = (x, y) => [dx + x * k, dy + y * k];
    /* Hauptstange: vom Rosenstock nach hinten-oben, oben nach vorn, Schaufel mit Enden */
    const stange = [[0, 0], [-8, -10], [-18, -22], [-25, -38], [-26, -54], [-20, -66], [-8, -72], [6, -72]];
    const breite = [2.8, 2.6, 2.4, 2.2, 2, 2, 2.2, 2.8];
    const enden = [
      { b: 4, p: [[-25.6, -44], [-33, -50], [-38, -52]], w: 1.4 },          // hinterer Spross
      { b: 6, p: [[-6, -72], [-6, -84], [-9, -92]], w: 1.4 },               // Schaufel: Enden nach oben
      { b: 6, p: [[2, -73], [5, -85], [4, -93]], w: 1.3 },
      { b: 7, p: [[6, -72], [14, -78], [18, -86]], w: 1.2 },
      { b: 7, p: [[6, -71], [16, -70], [22, -73]], w: 1.1 },
      { b: 1, p: [[-7.4, -9.6], [0, -18], [10, -22], [17, -21]], w: 1.4 },  // Eissprosse (vorn)
    ];
    const farbe = fern ? "#3a2f26" : verlauf(T, "geweih", dx - 30 * k, 0, dx + 26 * k, 0, [[[dx - 30 * k, 0], "#6b5a46"], [[dx, 0], "#9d8a6e"], [[dx + 26 * k, 0], "#5a4a3a"]]);
    let o = "";
    const st = stange.map(([x, y]) => P(x, y));
    o += form(T, roehre(st, breite[0] * 2 * k, breite[6] * 2 * k), farbe);
    for (const e of enden) o += form(T, roehre(e.p.map(([x, y]) => P(x, y)), e.w * 2 * k, 0.5 * k), farbe);
    /* Schaufel oben: abgeflachte Fläche zwischen den Enden */
    o += form(T, [P(-14, -68), P(-10, -76), P(-4, -80), P(4, -80), P(12, -77), P(15, -73), P(10, -70.4), P(0, -71.6), P(-8, -68.6)], farbe);
    if (!fern) {
      o += zart(T, st.map(([x, y]) => [x - 0.8 * k, y + 0.2]), "#d6c6a6", 0.45 * k, 0.55) + zart(T, st.map(([x, y]) => [x + 1.4 * k, y]), "#2b231b", 0.6 * k, 0.5);
      o += fein(T, zart(T, [P(-5, -6), P(-12, -16), P(-19, -28)], "#3a2f25", 0.18, 0.5) + zart(T, [P(-24, -40), P(-24, -54), P(-18, -64)], "#3a2f25", 0.16, 0.45));
      /* Rose am Ansatz */
      o += `<ellipse cx="${Z(dx)}" cy="${Z(dy + 1)}" rx="${Z(3.4 * k)}" ry="${Z(1.6 * k)}" fill="#4a3d31"/>`;
    }
    return o;
  };
  s += geweih(170, -140, 0.86, true);

  /* ---- Schwanz: kurz, hell, Spiegel ---- */
  /* ---- Körper, Hals, Kopf, nahe Beine: EINE Silhouette ---- */
  const rumpf = [
    [24, -80], [25, -94], [31, -104], [44, -110], [64, -111], [86, -111], [106, -113], [120, -117], [130, -120.4], [140, -122.4], [150, -125.6],
    [160, -130.6], [168, -136], [174, -139.4], [180, -139.6], [184, -137.6], [188, -133.4], [194, -127.6], [200, -122], [205.4, -117.6], [209.4, -114],
    [211.4, -110], [211.2, -105.4], [209, -102], [204.6, -100], [198, -99.4], [191, -99], [184, -101.2], [178, -104.4], [172, -103.6],
    [166, -98], [160, -88], [154, -76], [148, -66], [140, -60], [128, -57], [112, -56], [94, -56.6], [76, -58.6], [62, -61.4], [50, -64], [38, -68.6], [29, -74],
  ];
  const vbN = lauf([[140, -72], [140.6, -52], [139.6, -36], [140.2, -22], [141, -12], [143.4, -5]], [[10, 9], [7, 7], [5, 5.4], [3.8, 4.2], [4, 4.2], [4.8, 4.8]]);
  const hbN = lauf([[40, -88], [52, -64], [38, -44], [33.4, -30], [34.6, -14], [36.4, -5]], [[16, 13], [10, 9], [5.6, 5], [4, 4], [3.8, 4], [4.6, 4.6]]);
  const kD = vereint(T, [rumpf, vbN, hbN]);
  let n = `<rect x="10" y="-145" width="205" height="146" fill="${fell}"/>`;
  /* Hals, Halsmähne, Schnauze hell; Gesicht graubraun; heller Flankenstreif; Spiegel; Beine dunkel mit hellem Band */
  n += weich([[152, -124], [164, -133], [172, -136], [170, -118], [168, -100], [162, -88], [154, -78], [150, -92], [150, -108]], "#e6dfcf", 0.95, 3) +
    weich([[138, -120], [150, -124], [150, -96], [146, -76], [140, -80], [138, -100]], "#c9bea9", 0.6, 5);
  n += weich([[176, -136], [186, -134], [196, -124], [206, -114], [200, -110], [188, -118], [178, -124]], "#5e5040", 0.55, 2);
  n += weich([[194, -114], [207, -115], [211, -108], [208, -101.6], [194, -101.6]], "#c9bea9", 0.6, 2);
  n += weich([[180, -134], [192, -128], [204, -118], [198, -118], [186, -126]], "#8f7e65", 0.6, 1.4);
  n += weich([[176, -116], [190, -112], [198, -106], [186, -104], [176, -108]], "#2e251d", 0.4, 2.4) + weich([[183, -129], [190, -128], [190, -122], [183, -122]], "#2e251d", 0.4, 1.2);
  n += weich([[172, -130], [180, -128], [182, -116], [174, -112], [170, -120]], "#2e251d", 0.25, 2.4);
  n += weich([[60, -63], [90, -61], [120, -60.6], [136, -63], [120, -67], [90, -67], [62, -68]], "#d9cfbb", 0.55, 2);
  n += weich([[22, -84], [26, -98], [34, -104], [38, -92], [33, -78]], "#e6dfcf", 0.9, 2);
  n += weich([[132, -40], [148, -40], [146, -14], [136, -14]], "#2c241d", 0.45, 2) + weich([[30, -50], [44, -50], [40, -14], [30, -14]], "#2c241d", 0.45, 2);
  n += weich([[134, -12.4], [146, -12.4], [146, -6], [134, -6]], "#e6dfcf", 0.9, 0.6) + weich([[30, -12.4], [41, -12.4], [41, -6], [30, -6]], "#e6dfcf", 0.9, 0.6);
  /* Licht oben links (Rücken, Kruppe, Widerrist), Kernschatten Bauch, Okklusion Achsel/Leiste/Kehle */
  n += weich([[30, -98], [50, -107], [90, -109], [130, -118], [160, -129], [150, -122], [120, -111], [80, -104], [44, -100]], "#c9b89c", 0.5, 2.4);
  n += weich([[60, -58.6], [100, -57], [138, -59], [140, -70], [100, -70], [62, -70]], "#2a2119", 0.4, 3);
  n += weich([[132, -72], [146, -70], [150, -62], [138, -60]], "#2e251d", 0.5, 2) + weich([[48, -70], [58, -68], [58, -60], [46, -62]], "#2e251d", 0.45, 2);
  n += weich([[176, -104], [186, -101], [196, -101], [186, -98], [176, -100]], "#2a2119", 0.45, 1.4);
  /* Muskeln/Sehnen: Schulter, Oberarm (Trizeps), Keule, Kniefalte, Achillessehne, Beugesehne am Vorderlauf */
  n += weich([[118, -110], [134, -112], [142, -92], [132, -82], [120, -90]], "#8f7e65", 0.35, 4) + weich([[132, -86], [144, -86], [146, -72], [134, -74]], "#2e251d", 0.22, 2.4);
  n += weich([[32, -100], [56, -104], [62, -84], [50, -76], [34, -84]], "#8f7e65", 0.3, 4) + weich([[54, -84], [62, -78], [58, -66], [50, -70]], "#2e251d", 0.25, 2);
  n += zart(T, [[36, -42], [33.6, -32], [33.6, -18]], "#1c1612", 0.4, 0.45) + zart(T, [[143, -40], [143.6, -26], [143.6, -14]], "#1c1612", 0.35, 0.4);
  /* Handwurzel und Sprunggelenk: Knochenvorsprung mit Lichtkante vorn, Schatten hinten */
  n += zart(T, [[136.4, -40], [135.8, -36], [136.2, -32]], "#8c7b64", 0.6, 0.45) + zart(T, [[29.8, -47], [29, -43], [29.6, -39]], "#8c7b64", 0.6, 0.4);
  /* Fell: dicht, Wuchs nach hinten-unten; Hals mit langen Haaren, Mähne unter dem Hals */
  const wuchs = (x, y) => (x > 170 ? 160 : x > 145 ? 115 : y > -60 ? 95 : 175 + (y + 85) * 0.5);
  n += haarL(rumpf.filter((p) => p[0] < 186), 720, wuchs, 2.2);
  n += haare(T, [[150, -122], [166, -132], [170, -116], [166, -100], [160, -88], [152, -80], [148, -96]], 180, 105, 3.4, [["#ffffff", 1, 0.12, 0.6], ["#a99a80", 0.6, 0.12, 0.45]], 14, 0.3, 0.06);
  n += haarL(vbN, 120, 92, 1.4, "#1a140f", "#9a8a72") + haarL(hbN, 160, (x, y) => (y < -45 ? 125 : 95), 1.5, "#1a140f", "#9a8a72");
  /* Schnauze ganz behaart: kurze Haare, Nasenloch als Schlitz */
  n += haare(T, [[196, -114], [208, -114], [211, -106], [206, -101], [196, -102]], 70, 200, 0.7, [["#7a6a56", 1, 0.08, 0.5], ["#efe7d8", 0.8, 0.08, 0.6]], 20, 0.2, 0.1);
  s += silhouette(T, kD, fell, n, "#000", 0, 0);
  /* Halsmähne: lange weiße Haare hängen unter dem Hals (Kontur) */
  s += fellRand(T, [[172, -103.6], [166, -98], [160, -90], [154, -80], [148, -70]], 80, 5, 0.6, verlauf(T, "rmaehne", 0, -104, 0, -66, [[[0, -104], "#efe9dc"], [[0, -66], "#cfc4ae"]]), 1, 0.4, 0.12);
  s += fein(T, haare(T, [[172, -104], [160, -86], [150, -70], [146, -66], [156, -80], [168, -98]], 80, 110, 4, [["#ffffff", 1, 0.1, 0.7], ["#9a8b72", 0.5, 0.1, 0.5]], 16, 0.4));
  s += fellRand(T, [[31, -104], [44, -110.2], [64, -111.2], [86, -111.2], [106, -113.2], [120, -117.2], [130, -120.6], [140, -122.6], [150, -125.8], [160, -130.8]], 100, 1.6, 0.3, verlauf(T, "rrand", 0, -130, 0, -104, [[[0, -130], "#ddd3bf"], [[0, -104], "#9f8f75"]]), 1, -0.5, 0.1);
  s += fellRand(T, [[128, -57], [112, -56], [94, -56.6], [76, -58.6], [62, -61.4]], 50, 1.6, 0.3, "#3e3229", 1, 0.2, 0.1);
  /* Schwanz: kurz, oben braun, unten weiß */
  s += form(T, [[27, -97], [22, -96], [18.6, -92], [19.4, -88], [23, -88.6], [26.4, -91]], verlauf(T, "rschw", 0, -97, 0, -88, [[[0, -97], "#7a6a58"], [[0, -91], "#efe9de"]]));
  s += fein(T, fellRand(T, [[23, -96], [19, -92.6], [19.4, -88.4]], 14, 1.2, 0.25, "#efe9de", -1, 0.5));

  /* ---- Hufe ---- */
  s += huf(144, false) + huf(37, false);

  /* ---- Ohr: kurz, rund, behaart ---- */
  const ohr = [[172, -136], [166, -140], [162.4, -145], [163.4, -147.4], [168, -146], [174, -142], [176.6, -138.6]];
  s += silhouette(T, G(ohr), verlauf(T, "rohr", 162, 0, 177, 0, [[[162, 0], "#8b7a64"], [[177, 0], "#5a4b3c"]]), haarL(ohr, 40, -150, 1, "#2a2119", "#e6dccb") + weich([[165, -143.6], [170, -143], [173, -140], [168, -141]], "#3a2e24", 0.5, 0.5), "#000", 0, 0);
  /* ---- nahes Geweih: Hauptstange, Schaufel, Augsprosse („Schaufel“ über dem Gesicht), Eissprosse ---- */
  s += geweih(176, -139.6, 0.94, false);
  /* Augsprosse: senkrecht abgeflachte Schaufel nach vorn über dem Nasenrücken, mit Enden */
  {
    const P = (x, y) => [176 + x, -139.6 + y];
    const sch = [P(2, -2), P(8, -6), P(16, -8), P(24, -7.4), P(29, -10.6), P(28.6, -7), P(32, -6.4), P(29.6, -3), P(31.6, -1.4), P(27, 0), P(18, -1.6), P(8, 0.4), P(3, 1.6)];
    s += silhouette(T, G(sch), verlauf(T, "rsch", 0, -150, 0, -138, [[[0, -150], "#a8957a"], [[0, -138], "#5d4c3b"]]),
      zart(T, [P(4, -1), P(12, -4.6), P(22, -5.2), P(28, -6)], "#e1d2b4", 0.35, 0.5) + zart(T, [P(6, 0.6), P(16, -0.4), P(26, -1.6)], "#2b231b", 0.4, 0.45), "#000", 0, 0);
  }

  /* ---- Gesicht: Auge mit Wimpern, Voraugendrüse, Nasenloch, Mundspalte, Tasthaare ---- */
  s += fleck(T, 186.6, -125.2, 3.6, 2.4, "#2e251d", 0.55);
  s += T.augeReal(186.6, -125.6, 1.85, { iris: "#3a2414", iris2: "#140a04", offen: 0.66, winkel: 20, weiss: false, lid: "#120d09", wimpern: 9, wimpernLaenge: 0.6 });
  s += zart(T, [[190.4, -122.4], [193, -120.6]], "#1e1712", 0.5, 0.5);
  s += `<path d="M207.4 -110.6q1.9 -.7 2.8 .7q-.8 .9 -1.9 .9q-.7 -.7 -.9 -1.6z" fill="#211a14"/>`;
  s += zart(T, [[210.6, -103.6], [206.4, -102.2], [200.8, -101.6]], "#211a14", 0.35, 0.75);
  s += fein(T, T.schnurrhaare(205, -104, 6, 4, 30, 30, "#efe7d8", 0.08));
  return { svg: s, box: [18.6, -219, 211.4, 0], fuesse: [37, 50, 130, 144], kopf: [158, -160, 216, -94] };
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
  const fell = verlauf(T, "mfell", 0, -150, 0, 0, [[[0, -150], "#4a3a2c"], [[0, -120], "#3a2c21"], [[0, -80], "#2c2119"], [[0, -40], "#221912"], [[0, -16], "#1a130e"], [[0, 0], "#140f0b"]]);
  /* langes Grannenhaar als Strähnen: Schatten- und Lichtsträhnen in Wuchsrichtung (Rock hängt nach unten) */
  const zotteln = (pts, k, w, L, br, sz = 0.07) => buschel(T, pts, k, w, L, br, ["#0c0806", 0.4], ["#7a6048", 0.4], 10, sz);
  const strahn = (pts, k, w, L) => haare(T, pts, k, w, L, [["#0a0705", 1, 0.16, 0.5], ["#8a6e52", 0.9, 0.14, 0.45], ["#c3a888", 0.3, 0.12, 0.4]], 10, 0.25, 0.05);
  const huf = (x, fern) => form(T, [[x - 5.4, -6], [x + 4, -6.4], [x + 7.6, -3], [x + 8.2, 0, 1], [x - 5.8, 0, 1], [x - 6.2, -3]], fern ? "#15110d" : verlauf(T, "mhuf", 0, -6.4, 0, 0, [[[0, -6.4], "#55493d"], [[0, 0], "#17120e"]])) +
    (fern ? "" : zart(T, [[x - 5, -5.4], [x + 3.8, -5.8], [x + 7, -3]], "#8c7c68", 0.3, 0.6) + zart(T, [[x + 1, -6], [x + 2, -0.4]], "#0d0a08", 0.3, 0.7));

  /* ---- ferne Beine: nur die hellen Socken unter dem Rock sichtbar ---- */
  const bF = (x) => [[x - 5, -30], [x + 4, -30], [x + 4.4, -16], [x + 4.6, -6], [x - 4.6, -6], [x - 4.4, -16]];
  s += silhouette(T, vereint(T, [bF(172), bF(70)]), verlauf(T, "msockF", 0, -30, 0, -6, [[[0, -30], "#5a4c3e"], [[0, -14], "#8a7c68"], [[0, -6], "#6e6252"]]),
    haare(T, bF(172).concat(bF(70)), 60, 95, 1.2, [["#3a2f25", 1, 0.1, 0.5]], 14, 0.2, 0.1), "#000", 0, 0);
  s += huf(173, true) + huf(71, true);

  /* ---- fernes Horn (gegenüberliegende Seite, nur der Haken vor dem Gesicht sichtbar) ---- */
  s += form(T, [[234, -94], [238.4, -97.4], [241.4, -101.6], [242.2, -104.4], [239.6, -102], [236, -98.6]], verlauf(T, "mhornF", 0, -94, 0, -104, [[[0, -94], "#6a6054"], [[0, -104], "#2a241e"]]));

  /* ---- Körper: Buckel, Rock bis fast zum Boden, Kopf tief vorn ---- */
  const rumpf = [
    [26, -70], [24, -86], [28, -100], [38, -110], [56, -116], [80, -118], [104, -122], [124, -130], [142, -140], [158, -145], [172, -144], [184, -137],
    [194, -126], [202, -120], [208, -120.6], [216, -122.6], [224, -121], [230, -114], [234, -104], [238, -94], [242, -86], [245, -80], [245.6, -75], [243.4, -71],
    [239, -69], [234, -68.6], [230, -66], [228, -60], [224, -52], [216, -44], [206, -34], [196, -26], [182, -18.6], [160, -16], [136, -16.6], [112, -16], [88, -17], [66, -17.6], [46, -18.6],
    [34, -22], [28, -34], [26, -52],
  ];
  const kD = G(rumpf);
  let n = `<rect x="15" y="-152" width="235" height="153" fill="${fell}"/>`;
  /* heller Sattel hinter dem Buckel, graue Stirn/Schnauze, Licht oben links auf Buckel und Rücken */
  n += weich([[96, -118], [120, -126], [140, -134], [130, -122], [110, -114], [94, -112]], "#bba68a", 0.65, 3);
  n += weich([[60, -114], [96, -118], [140, -136], [170, -146], [160, -138], [130, -124], [96, -112], [62, -108]], "#806650", 0.55, 3);
  n += weich([[210, -120], [224, -120], [232, -106], [238, -94], [230, -96], [218, -108]], "#6e5e4e", 0.6, 2);
  n += weich([[236, -94], [243, -84], [245, -76], [240, -72], [234, -82]], "#a89a86", 0.8, 1.4) + weich([[232, -76], [242, -72], [240, -68], [230, -70]], "#7d6f5e", 0.5, 1);
  /* Kernschatten unten am Rock, Okklusion unter dem Kopf/Kinn (Bart) */
  n += weich([[34, -24], [80, -22], [140, -21], [196, -26], [210, -40], [190, -36], [140, -32], [80, -32], [40, -32]], "#000", 0.45, 4);
  n += weich([[206, -70], [226, -66], [230, -62], [218, -56], [204, -62]], "#000", 0.4, 2.4) + weich([[196, -122], [206, -118], [212, -108], [200, -104], [192, -112]], "#000", 0.35, 3);
  /* Strähnen: Rücken nach hinten-unten, Flanke senkrecht herab, Hals/Bart nach unten, Kopf nach vorn-unten */
  const wuchs = (x, y) => (x > 214 ? (y < -100 ? 60 : 95) : x > 190 ? 110 : y < -110 ? 160 - (x - 100) * 0.2 : 95 - (x - 130) * 0.04);
  n += zotteln(rumpf.filter((p) => p[0] < 230), 260, wuchs, 9, 0.7);
  n += strahn(rumpf.filter((p) => p[0] < 230), 540, wuchs, 6);
  /* Qiviut (Unterwolle) schimmert hellbraun am Buckel durch */
  n += fein(T, haare(T, [[140, -140], [170, -146], [184, -138], [170, -126], [150, -126]], 120, 70, 1.2, [["#a88e70", 1, 0.1, 0.4]], 60, 0.6));
  s += silhouette(T, kD, fell, n, "#000", 0, 0);
  /* Rocksaum: lange Haare fallen über die Beine, unten ausgefranst */
  s += fellRand(T, [[46, -18.6], [66, -17.6], [88, -17], [112, -16], [136, -16.6], [160, -16], [182, -18.6], [196, -26]], 110, 4, 0.7, verlauf(T, "mrock", 0, -22, 0, -10, [[[0, -22], "#1e1610"], [[0, -10], "#3a2c20"]]), 1, 0);
  s += fellRand(T, [[28, -100], [38, -110], [56, -116], [80, -118], [104, -122], [124, -130], [142, -140], [158, -146], [172, -146], [184, -140]], 120, 2.2, 0.4, "#5a4636", 1, -0.4);
  s += fellRand(T, [[26, -86], [24, -70], [26, -52], [28, -34], [34, -22]], 50, 3, 0.5, "#2a1f17", -1, 0.4);

  /* ---- nahe Beine: helle Socken unter dem Rock, große runde Hufe ---- */
  const bN = (x) => [[x - 5.6, -24], [x + 5, -24], [x + 5, -14], [x + 5.4, -6], [x - 5.4, -6], [x - 5.4, -14]];
  s += silhouette(T, vereint(T, [bN(186), bN(54)]), verlauf(T, "msock", 0, -24, 0, -6, [[[0, -24], "#6b5d4e"], [[0, -16], "#b7a990"], [[0, -6], "#9a8c76"]]),
    haare(T, bN(186).concat(bN(54)), 90, 95, 1.3, [["#4a3d31", 1, 0.1, 0.5], ["#e9e0cf", 0.8, 0.1, 0.5]], 14, 0.2, 0.1) + weich([[50, -22], [54, -22], [53, -8], [50, -8]], "#e9e0cf", 0.4, 1) + weich([[182, -22], [186, -22], [185, -8], [182, -8]], "#e9e0cf", 0.4, 1), "#000", 0, 0);
  s += fellRand(T, [[48, -24], [56, -24.6], [62, -24]], 20, 2, 0.4, "#2a1f17", 1, 0);
  s += fellRand(T, [[180, -24], [188, -24.6], [194, -24]], 20, 2, 0.4, "#2a1f17", 1, 0);
  s += huf(187, false) + huf(55, false);

  /* ---- Hörner: Platte („Boss“) über der Stirn, seitlich am Kopf herab, Haken nach vorn-oben, helle Spitze ---- */
  /* Boss: breite, gewölbte, gerillte Hornplatte über der Stirn; Horn läuft seitlich am Kopf herab (hinter dem Auge),
     biegt unter dem Auge nach vorn und mit der dunklen Spitze nach oben-außen */
  const horn = [[202, -125], [208, -129.6], [216, -130.4], [222, -127.4], [224.4, -120], [223.6, -110], [222, -100], [223, -92], [227.4, -87], [233, -86.2],
    [237.6, -89], [240.4, -94.6], [240.6, -97.6, 1], [237.4, -95], [233.6, -92.4], [229.6, -92.6], [227, -96.6], [217.6, -104], [216.4, -112], [214, -119.6], [206, -121.4]];
  let hi = weich([[204, -126], [214, -129.6], [220, -127], [212, -125]], "#f2ece0", 0.75, 1) + weich([[219, -118], [222, -104], [220, -98], [217.6, -108]], "#2a241e", 0.45, 1.2);
  hi += weich([[224, -92], [230, -88], [236, -88], [230, -91]], "#f2ece0", 0.5, 0.6);
  hi += fein(T, zart(T, [[204, -124.4], [211, -127.4], [218, -127]], "#5a5046", 0.22, 0.55) + zart(T, [[205, -122.6], [212, -125.4], [219.6, -124.4]], "#5a5046", 0.2, 0.5) +
    zart(T, [[221, -118], [221.4, -108], [220.4, -100]], "#5a5046", 0.18, 0.45) + zart(T, [[225.6, -90], [231, -88.2], [236, -90]], "#5a5046", 0.15, 0.4));
  s += silhouette(T, G(horn), verlauf(T, "mhorn", 204, -128, 240, -96, [[[204, -128], "#d6ccbb"], [[220, -112], "#b4a894"], [[228, -90], "#8c8172"], [[234, -90], "#4a4038"], [[240, -96], "#1e1a16"]]), hi, "#1a1612", 0.2, 0.6);

  /* ---- Gesicht: Auge dunkel, Nasenspiegel klein, Nasenloch, Mund; Ohr im Fell ---- */
  s += fleck(T, 227.6, -106, 3, 2.2, "#000", 0.5);
  s += T.augeReal(227.8, -106.4, 1.2, { iris: "#3a2214", iris2: "#120904", offen: 0.66, winkel: 10, weiss: false, lid: "#0d0907", wimpern: 7, wimpernLaenge: 0.5, wimpernFarbe: "#1b140e" });
  s += form(T, [[242.4, -80.6], [244.6, -79.4], [245.8, -76.4], [244.6, -74.4], [242.2, -75], [241.6, -78]], verlauf(T, "mnase", 0, -80.6, 0, -74.4, [[[0, -80.6], "#4a4440"], [[0, -74.4], "#141210"]]));
  s += `<path d="M244 -77.6q1.3 -.4 1.7 .8q-.8 .3 -1.3 .2z" fill="#050404"/>` + zart(T, [[243.6, -72.6], [240, -71.6], [236, -71.6]], "#0d0a08", 0.4, 0.8);
  s += fein(T, haare(T, [[232, -98], [242, -86], [245, -79], [240, -74], [234, -84]], 60, 115, 1, [["#d2c6b4", 1, 0.08, 0.6], ["#3a2e24", 0.6, 0.08, 0.5]], 20, 0.2));
  /* Bart: lange Haare hängen unter Kinn und Kehle */
  s += fellRand(T, [[238, -69], [232, -68], [229, -62], [225, -54], [218, -46], [208, -36]], 70, 5, 0.6, "#1e1610", 1, 0.5);
  return { svg: s, box: [24, -145, 245.8, 0], fuesse: [55, 71, 173, 187], kopf: [196, -140, 248, -60] };
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
  const weiss = verlauf(T, "ewe", 0, -62, 0, 0, [[[0, -62], "#ffffff"], [[0, -40], "#f6f6f3"], [[0, -24], "#e3e7ec"], [[0, -10], "#c9d2dd"], [[0, 0], "#d2dae3"]]);
  /* Querbinden: dunkle, leicht gebogene, gezackte Bänder, die der Körperrundung folgen (nur, wo die Fläche liegt) */
  const binden = (pts, reihen, x0, x1, y0, y1, dick, farbe, op, neig = 0, p = 0.8) => {
    let d = "";
    const k = T.fein === false ? Math.ceil(reihen * 0.6) : reihen;
    for (let r = 0; r < k; r++) {
      const y = y0 + (y1 - y0) * (r + 0.5) / k;
      for (let x = x0; x < x1; x += 2.2 + T.rnd() * 1.6) {
        if (T.rnd() > p) continue;
        /* Pfeil-/Halbmondfleck an der Federspitze: Spitze nach unten-hinten, Enden nach oben, leicht gezackt */
        const L = 1.6 + T.rnd() * 1.8, yy = y + (x - x0) * neig + (T.rnd() - 0.5) * 0.8, w = dick * (0.7 + T.rnd() * 0.6), h = L * 0.22;
        if (!inPoly(x, yy, pts) || !inPoly(x + L, yy, pts)) continue;
        d += `M${J(x, yy - h)}q${J(L * 0.3, h * 1.6, L * 0.5, h * 1.2)}q${J(L * 0.2, -h * 0.2, L * 0.5, -h * 1.2)}l${J(-w * 0.3, w * 0.9)}q${J(-L * 0.25, h * 1.3, -L * 0.45, h * 1.4)}q${J(-L * 0.25, -h * 0.1, -L * 0.55 + w * 0.3, -h * 1.4 + w * 0.1)}z`;
      }
    }
    return d ? `<path d="${d}" fill="${farbe}" fill-opacity="${op}"${T.fein === false ? "" : ` filter="${blur(T, 0.06)}"`}/>` : "";
  };

  /* ---- Schwanz: kurz, gerundet, gebändert, unter den Flügelspitzen ---- */
  const schwanz = [[8, -16], [2, -12.4], [-1.6, -8.6], [0.4, -6.6], [6, -8], [12, -10]];
  s += silhouette(T, G(schwanz), "#eef1f4", binden(schwanz, 3, -2, 12, -14, -7, 0.5, "#4a3a2c", 0.8, 0.1, 0.9) + fleck(T, 4, -9, 5, 2.4, "#7b8aa0", 0.4), "#000", 0, 0);

  /* ---- Körper: aufrecht, rund, Brust leicht vorgeneigt ---- */
  const koerper = [
    [12, -13], [10, -22], [10.6, -32], [13, -40], [17, -46], [22, -50], [28, -51], [33, -48.6], [36.4, -44], [38.6, -36], [39, -27], [37.4, -18], [34, -11],
    [28.6, -6.6], [22, -5.4], [16.4, -7.4],
  ];
  let n = `<rect x="0" y="-64" width="48" height="65" fill="${weiss}"/>`;
  n += weich([[28, -48], [34, -44], [37, -34], [36, -24], [32, -30], [30, -40]], "#ffffff", 0.9, 2);
  n += weich([[18, -10], [30, -8], [36, -14], [30, -18], [20, -16]], "#7b8aa0", 0.45, 2.4) + weich([[30, -24], [38, -22], [37, -12], [32, -14]], "#8d9bb0", 0.35, 2);
  /* Brust: feine Querwellen (schwach), Flanke: kräftigere Bänder */
  n += binden(koerper, 9, 22, 39, -44, -10, 0.32, "#5a4a3a", 0.55, -0.05, 0.55);
  n += binden(koerper, 8, 12, 30, -40, -8, 0.42, "#3e3024", 0.8, -0.04, 0.8);
  n += haare(T, koerper, 260, (x, y) => 95 + (x - 26) * 1.6, 1.2, [["#8796ab", 1, 0.07, 0.3], ["#ffffff", 1.3, 0.07, 0.65]], 18, 0.3, 0.05);
  s += silhouette(T, G(koerper), weiss, n, "#000", 0, 0);
  s += fellRand(T, [[38.6, -36], [39, -27], [37.4, -18], [34, -11], [28.6, -6.6]], 50, 0.9, 0.2, verlauf(T, "erand", 0, -36, 0, -6, [[[0, -36], "#ffffff"], [[0, -6], "#c4ced9"]]), 1, 0.3);

  /* ---- Füße: dicht befiederte „Pfoten“, schwarze gebogene Krallen ---- */
  const fuss = (x, fern) => {
    const f = [[x - 4.4, -6], [x + 2, -6.6], [x + 5.4, -3.4], [x + 6.4, -0.6], [x + 4, 0, 1], [x - 4.6, 0, 1], [x - 5.4, -2.6]];
    let o = silhouette(T, G(f), fern ? "#b7c2ce" : verlauf(T, "efuss", 0, -6.6, 0, 0, [[[0, -6.6], "#f4f6f8"], [[0, 0], "#c3cdd8"]]),
      haare(T, f, 40, 70, 0.9, [["#8796ab", 1, 0.07, 0.4], ["#ffffff", 1, 0.07, 0.7]], 30, 0.3, 0.1), "#000", 0, 0);
    o += fellRand(T, [[x - 5, -3], [x - 2, -6], [x + 2, -6.4], [x + 5.4, -3.2], [x + 6.2, -0.6]], 20, 0.7, 0.18, fern ? "#b7c2ce" : "#eef1f4", -1, 0.4);
    o += `<path d="M${J(x + 5.4, -1.4)}q${J(1.6, -0.2, 2, 1.4)}q${J(-0.8, -0.6, -1.8, -0.8)}zM${J(x + 3.4, -0.8)}q${J(1.4, 0, 1.6, 0.8)}q${J(-0.7, -0.3, -1.5, -0.4)}z" fill="#0f0d0c"/>`;
    return o;
  };
  s += fuss(28, true) + fuss(22, false);

  /* ---- Flügel: angelegt, lang, breit; Decken und Schwingen gebändert, Federkanten hell ---- */
  const fluegel = [[16, -46], [12, -40], [8, -30], [4.6, -20], [2.4, -12], [1.6, -8.4], [4.6, -10.4], [10.4, -12.4], [16.8, -14.6], [23, -18.4], [27.6, -25], [29.4, -34], [27.6, -42], [22.6, -47]];
  let fi = weich([[14, -44], [24, -46], [28, -38], [20, -36], [12, -38]], "#ffffff", 0.8, 1.6) + weich([[4, -14], [14, -14.6], [22, -20], [12, -20], [4, -18]], "#6b7a90", 0.45, 1.4);
  /* Federlagen: kleine Decken (Schuppenreihen) oben, große Decken, Armschwingen und Handschwingen unten */
  if (F) {
    let d = "";
    for (let r = 0; r < 4; r++) for (let i = 0; i < 6; i++) { const x = 13 + i * 2.6 + r * 0.6, y = -42 + r * 2.4 + i * 0.5; if (inPoly(x, y, fluegel)) d += `M${J(x - 1.3, y)}q${J(1.3, 1.4, 2.6, 0)}`; }
    fi += `<path d="${d}" fill="none" stroke="#9fadbf" stroke-width=".12" stroke-opacity=".8"/>`;
  }
  for (let i = 0; i < 6; i++) {
    const t = i / 5, x0 = 26 - t * 4, y0 = -30 + t * 3.4, x1 = 3 + t * 6, y1 = -10.4 - t * 3.6;
    fi += zart(T, [[x0, y0], [(x0 + x1) / 2 - 1.4, (y0 + y1) / 2 + 0.6], [x1, y1]], "#a6b3c3", 0.16, 0.8);
  }
  fi += binden(fluegel, 11, 2, 29, -44, -10, 0.5, "#3a2c20", 0.85, 0.12, 0.85);
  s += silhouette(T, G(fluegel), verlauf(T, "efl", 0, -47, 0, -8, [[[0, -47], "#fafaf8"], [[0, -24], "#e8ecf0"], [[0, -8], "#bfcad6"]]), fi, "#000", 0, 0);
  s += zart(T, [[29.2, -34], [27.4, -25], [22.8, -18.6], [16.6, -14.8], [10.2, -12.6], [4.4, -10.6]], "#ffffff", 0.35, 0.6) + zart(T, [[28.4, -34], [26.6, -25.4], [22, -19.2], [16, -15.6]], "#7b8aa0", 0.4, 0.25);

  /* ---- Kopf: groß, rund, zum Betrachter gedreht; flacher Gesichtsschleier, gelbe Augen, Schnabel in Federn ---- */
  const kopf = [[16.6, -48], [16, -54], [18, -60], [23, -64.4], [29.6, -65.6], [36, -63.6], [40, -58.6], [41, -52], [39, -46.6], [34.4, -44], [28, -43.4], [21.4, -44.4]];
  let ki = weich([[18, -60], [26, -65], [34, -64], [28, -61], [20, -57]], "#ffffff", 0.9, 1.4) + weich([[18, -48], [26, -45], [36, -45], [30, -47.6], [20, -50]], "#7b8aa0", 0.4, 1.4);
  ki += binden(kopf, 4, 17, 40, -65, -59, 0.3, "#3e3024", 0.75, 0, 0.7);
  /* Gesichtsschleier: flache, helle Scheibe mit feinem Rand, Federn strahlen von den Augen aus */
  const schleier = [[21, -56], [24, -60.4], [29.6, -61.6], [35.6, -60.4], [38.6, -55.6], [37.6, -49.6], [33, -46.6], [27, -46.6], [22.4, -49.6]];
  ki += form(T, schleier, T.rg("eschl", [[0, "#ffffff"], [0.75, "#fafbfb"], [1, "#e9edf1", 0.6]], 0.5, 0.45, 0.6), T.fein === false ? "" : ` filter="${blur(T, 0.5)}"`);
  if (F) {
    let d = "";
    for (const [cx, cy] of [[26.4, -55], [34.2, -55]]) for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, r0 = 2.2, r1 = 4.6 + T.rnd() * 1.6; d += `M${J(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0)}L${J(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1)}`; }
    ki += `<path d="${d}" stroke="#b9c3cf" stroke-width=".06" stroke-opacity=".55" fill="none"/>`;
  }
  ki += haare(T, kopf, 160, (x, y) => (y < -58 ? 200 : 180), 0.9, [["#8796ab", 1, 0.06, 0.3], ["#ffffff", 1.3, 0.06, 0.6]], 30, 0.3, 0.05);
  s += silhouette(T, G(kopf), weiss, ki, "#000", 0, 0);
  s += fellRand(T, [[16.6, -48], [16, -54], [18, -60], [23, -64.4], [29.6, -65.6], [36, -63.6], [40, -58.6], [41, -52]], 60, 0.6, 0.16, "#fbfbfa", 1, 0);
  /* Augen: groß, gelb, schwarzer Lidrand, nach vorn gerichtet; Brauen-Federn werfen Schatten aufs obere Drittel */
  const auge = (x, y, r) => fleck(T, x, y - r * 0.4, r * 1.9, r * 1.3, "#5a6a80", 0.45) +
    `<ellipse cx="${Z2(x)}" cy="${Z2(y)}" rx="${Z2(r * 1.18)}" ry="${Z2(r * 1.08)}" fill="#0e0c0a"/>` +
    `<circle cx="${Z2(x)}" cy="${Z2(y)}" r="${Z2(r)}" fill="${T.rg("eiris", [[0, "#ffe46a"], [0.6, "#f6c51e"], [0.92, "#c8900c"], [1, "#6a4a08"]], 0.45, 0.45, 0.55)}"/>` +
    `<circle cx="${Z2(x + r * 0.05)}" cy="${Z2(y)}" r="${Z2(r * 0.46)}" fill="#050403"/>` +
    `<rect x="${Z2(x - r * 1.2)}" y="${Z2(y - r * 1.15)}" width="${Z2(r * 2.4)}" height="${Z2(r * 0.9)}" fill="${T.lg("elid", [[0, "#000", 0.7], [1, "#000", 0]])}" clip-path="url(#${T.id("eac" + Math.round(x))})"/>` +
    `<ellipse cx="${Z2(x - r * 0.35)}" cy="${Z2(y - r * 0.38)}" rx="${Z2(r * 0.22)}" ry="${Z2(r * 0.15)}" fill="#fff" opacity=".9"/>` +
    `<path d="M${J(x - r * 1.2, y - r * 0.2)}q${J(r * 1.2, -r * 1.25, r * 2.4, -r * 0.05)}" fill="none" stroke="#0e0c0a" stroke-width="${Z2(r * 0.16)}" stroke-linecap="round"/>` +
    `<path d="M${J(x - r * 1.5, y - r * 1.1)}q${J(r * 1.5, -r * 0.9, r * 3, 0)}" fill="none" stroke="#fff" stroke-width="${Z2(r * 0.5)}" stroke-opacity=".8" stroke-linecap="round"/>`;
  T.def(`<clipPath id="${T.id("eac26")}"><circle cx="26.4" cy="-55" r="1.6"/></clipPath><clipPath id="${T.id("eac34")}"><circle cx="34.2" cy="-55" r="1.5"/></clipPath>`);
  s += auge(26.4, -55, 1.6) + auge(34.2, -55, 1.5);
  /* Schnabel: schwarz, gebogen, zwischen den Augen fast ganz in Borstenfedern versteckt */
  s += form(T, [[29.6, -52.6], [31, -52.8], [31.2, -51.2], [30.5, -49.6], [30, -49.4], [29.4, -50.8]], verlauf(T, "eschn", 0, -52.8, 0, -49.4, [[[0, -52.8], "#4a4642"], [[0, -49.4], "#0c0b0a"]]));
  s += haare(T, [[28, -55], [32.8, -55], [32.6, -51], [30.4, -50.4], [28.2, -51]], 70, 88, 1.4, [["#ffffff", 1, 0.08, 0.95], ["#c3ccd7", 0.5, 0.07, 0.7]], 40, 0.3, 0.2);
  return { svg: s, box: [-1.6, -65.6, 41, 0], fuesse: [22, 28], kopf: [12, -70, 46, -40] };
}

module.exports = [
  { id: "pinguin", de: "der Pinguin", syl: "PIN-gu-in", it: "il pinguino", itSyl: "pin-GUI-no", en: "penguin",
    gruppe: "Polar", lebensraum: "Antarktis", laenge: 0.53, hoehe: 1.17, zeichne: pinguin },
  { id: "walross", de: "das Walross", syl: "WAL-ross", it: "il tricheco", itSyl: "tri-CHE-co", en: "walrus",
    gruppe: "Polar", lebensraum: "Arktis", laenge: 2.91, hoehe: 1.33, zeichne: walross },
  { id: "seehund", de: "der Seehund", syl: "SEE-hund", it: "la foca", itSyl: "FO-ca", en: "harbour seal",
    gruppe: "Polar", lebensraum: "Küste", laenge: 1.75, hoehe: 0.58, zeichne: seehund },
  { id: "robbe_baby", de: "das Robbenbaby", syl: "ROB-ben-ba-by", it: "il cucciolo di foca", itSyl: "CUC-cio-lo di FO-ca", en: "seal pup",
    gruppe: "Polar", lebensraum: "Packeis", laenge: 0.93, hoehe: 0.39, zeichne: robbeBaby },
  { id: "polarfuchs", de: "der Polarfuchs", syl: "po-LAR-fuchs", it: "la volpe artica", itSyl: "VOL-pe AR-ti-ca", en: "arctic fox",
    gruppe: "Polar", lebensraum: "Tundra", laenge: 0.86, hoehe: 0.45, zeichne: polarfuchs },
  { id: "rentier", de: "das Rentier", syl: "REN-tier", it: "la renna", itSyl: "REN-na", en: "reindeer",
    gruppe: "Polar", lebensraum: "Tundra", laenge: 1.92, hoehe: 2.19, zeichne: rentier },
  { id: "moschusochse", de: "der Moschusochse", syl: "MO-schus-och-se", it: "il bue muschiato", itSyl: "BU-e mu-SCHIA-to", en: "musk ox",
    gruppe: "Polar", lebensraum: "Tundra", laenge: 2.2, hoehe: 1.46, zeichne: moschusochse },
  { id: "schneeeule", de: "die Schneeeule", syl: "SCHNEE-eu-le", it: "la civetta delle nevi", itSyl: "ci-VET-ta del-le NE-vi", en: "snowy owl",
    gruppe: "Polar", lebensraum: "Tundra", laenge: 0.43, hoehe: 0.66, zeichne: schneeeule },
];
