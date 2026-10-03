/* =====================================================================
   TIER-BIBLIOTHEK — GREIFVÖGEL UND EULEN (FASSUNG 854, Maßstab 2)
   Steinadler, Weißkopfseeadler, Wanderfalke, Uhu, Schleiereule, Waldkauz, Gänsegeier, Mäusebussard –
   jeder sitzt auf Fels, Stumpf oder Pfahl (der Sitzplatz steht am Boden, so entsteht der Bodenschatten).
   Zentimeter, Blick nach rechts, Boden y = 0, EIN Licht von links oben (siehe ANLEITUNG.md).
   Gefieder in Hierarchie:
   - Deckfedern (Schulter, Flügeldecken, Brust, Hosen, Kopf) als einzelne Federn: Form in Einheitskoordinaten
     (Ansatz 0, Spitze 1) als Vorlage in den defs, je Feder nur ein <use> mit Matrix. Die Vorlage trägt Verlauf
     (Ansatz dunkel → Farbe → Saum), Zeichnung (Schaftstrich, Binden, Flecken), Fahnenstrahlen und – nur fein – einen
     weichen Schatten auf die Feder darunter.
   - Schwung- und Steuerfedern einzeln: Fahne mit runder Spitze, Schaft, Lichtkante, Binden, Fächer überlappend
     (äußere zuerst, innere darüber), Licht über den ganzen Flügel als ein Verlauf in Zentimetern.
   - Fahnenstruktur als gerichtetes Rauschen (schwach), Kontur nie als Strich.
   Mikrodetails (Federschatten, Strahlen, Relief, Flechten) nur bei T.fein – die Szene bleibt klein.
   ===================================================================== */
"use strict";
let Q = 10;                                   // Rundung (10 = 1 mm); Kopf und Fänge rechnen feiner
const N = (n) => { let s = String(Math.round(n * Q) / Q); if (s.startsWith("0.")) s = s.slice(1); else if (s.startsWith("-0.")) s = "-" + s.slice(2); return s === "-0" ? "0" : s; };
const N2 = (n) => { let s = String(Math.round(n * 100) / 100); if (s.startsWith("0.")) s = s.slice(1); else if (s.startsWith("-0.")) s = "-" + s.slice(2); return s === "-0" ? "0" : s; };
/* knappe Zahlenfolge für Pfade: Trenner nur wo nötig */
function J(...ns) {
  let o = "", punkt = false;
  for (const n of ns) {
    const s = N(n);
    if (o && !(s[0] === "-" || (s[0] === "." && punkt))) o += " ";
    o += s; punkt = s.includes(".");
  }
  return o;
}
const rad = (g) => g * Math.PI / 180;
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const zug = (d, farbe, w, op = 1, extra = "") => d ? `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${N2(w)}"${op < 1 ? ` stroke-opacity="${N2(op)}"` : ""}${/linecap/.test(extra) ? "" : ' stroke-linecap="round"'}${extra}/>` : "";
const fl = (d, farbe, op = 1, extra = "") => d ? `<path d="${d}" fill="${farbe}"${op < 1 ? ` opacity="${N2(op)}"` : ""}${extra}/>` : "";
/* glatte Kurve (Catmull-Rom), relativ geschrieben; [x, y, 1] = harte Ecke */
function G(pts, zu = true) {
  const n = pts.length, A = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]), rd = (v) => Math.round(v * Q) / Q;
  let cx = rd(pts[0][0]), cy = rd(pts[0][1]), d = "M" + J(cx, cy);
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = A(i - 1), p1 = A(i), p2 = A(i + 1), p3 = A(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    const ex = rd(p2[0]), ey = rd(p2[1]);
    d += "c" + J(rd(c1[0]) - cx, rd(c1[1]) - cy, rd(c2[0]) - cx, rd(c2[1]) - cy, ex - cx, ey - cy);
    cx = ex; cy = ey;
  }
  return d + (zu ? "Z" : "");
}
const GO = (pts) => G(pts, false);
/* Punkt auf einer Polylinie (t 0..1, nach Länge) */
function auf(pts, t) {
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const z = Math.max(0, Math.min(1, t)) * L[L.length - 1];
  let i = 1;
  while (i < L.length - 1 && L[i] < z) i++;
  return lerp(pts[i - 1], pts[i], (z - L[i - 1]) / ((L[i] - L[i - 1]) || 1));
}
function inPoly(x, y, p) {
  let ja = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const xi = p[i][0], yi = p[i][1], xj = p[j][0], yj = p[j][1];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) ja = !ja;
  }
  return ja;
}
const box = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
/* Farben mischen: mische("#a05020", "#fff", 0.3) */
function mische(c1, c2, t) {
  const h = (c) => (c.length === 4 ? c.replace(/([0-9a-f])/gi, "$1$1") : c);
  const a = h(c1), b = h(c2);
  return "#" + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, "0")).join("");
}
/* Mittellinie gleichmäßig neu abtasten (n Punkte) */
function abtasten(pts, n) { const o = []; for (let i = 0; i < n; i++) o.push(auf(pts, i / (n - 1))); return o; }
/* Band entlang einer Mittellinie: Breite w0 → w1; Ränder L (links der Laufrichtung) und R; rund = runde Spitze */
function bandRaender(pts, w0, w1, wf) {
  const n = pts.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const t = i / (n - 1), w = (wf ? wf(t) : w0 + (w1 - w0) * t) / 2;
    L.push([pts[i][0] + dy * w, pts[i][1] - dx * w]); R.push([pts[i][0] - dy * w, pts[i][1] + dx * w]);
  }
  return { L, R };
}
function band(pts, w0, w1, rund = 0, wf = null) {
  const { L, R } = bandRaender(pts, w0, w1, wf), n = pts.length;
  const e = pts[n - 1], v = pts[n - 2], l = Math.hypot(e[0] - v[0], e[1] - v[1]) || 1, w = (wf ? wf(1) : w1);
  if (rund) return [...L, [e[0] + (e[0] - v[0]) / l * w * 0.5 * rund, e[1] + (e[1] - v[1]) / l * w * 0.5 * rund], ...R.reverse()];
  return [...L.slice(0, -1), [e[0], e[1], 1], ...R.slice(0, -1).reverse()];
}

/* ---------- Filter (alle mit sRGB, sonst kippt Braun nach Oliv) ---------- */
function blur(T, sd0) {
  const sd = [0.08, 0.15, 0.25, 0.4, 0.6, 0.9, 1.2, 1.6].reduce((b, x) => (Math.abs(x - sd0) < Math.abs(b - sd0) ? x : b), 0.08);
  const id = T.id("bl" + String(sd).replace(".", "_"));
  T._bl = T._bl || new Set();
  if (!T._bl.has(id)) { T._bl.add(id); T.def(`<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${sd}"/></filter>`); }
  return `url(#${id})`;
}
/* weicher Schatten/Lichtfleck (geblurrt); in der Szene nur, wenn wichtig = true */
const weich = (T, d, farbe, op, sd, wichtig) => (T.fein || wichtig ? fl(d, farbe, op, ` filter="${blur(T, sd)}"`) : "");
/* Schatten einer langen Feder (Zentimeter): weich nach rechts unten auf die Feder darunter */
function federSchatten(T) {
  const id = T.id("fsl");
  if (!T._fsl) { T._fsl = 1; T.def(`<filter id="${id}" x="-10%" y="-10%" width="125%" height="125%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation=".22"/><feOffset dx=".14" dy=".22" result="o"/><feFlood flood-color="#0c0603" flood-opacity=".55"/><feComposite in2="o" operator="in" result="s"/><feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`); }
  return `url(#${id})`;
}
/* Schatten der Deckfeder-Vorlage (Einheitskoordinaten): weicher Saum vor der Spitze und an den Seiten, Rand minimal weich.
   art "d" = deutlich (Decken, Schultern), "w" = weich (Brust, Hosen, Kopf: Federn verschmelzen, keine Schuppen) */
function vorlageSchatten(T, art = "d") {
  const id = T.id("fsv" + art);
  T._fsv = T._fsv || {};
  if (!T._fsv[art]) {
    T._fsv[art] = 1;
    const [sd, dx, op, wb] = art === "d" ? [".07 .11", ".05", ".45", ".012"] : [".12 .16", ".08", ".26", ".02"];
    T.def(`<filter id="${id}" x="-.3" y="-.6" width="1.7" height="2.2" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="${sd}"/><feOffset dx="${dx}" result="o"/><feFlood flood-color="#0c0603" flood-opacity="${op}"/><feComposite in2="o" operator="in" result="s"/><feGaussianBlur in="SourceGraphic" stdDeviation="${wb}" result="g"/><feMerge><feMergeNode in="s"/><feMergeNode in="g"/></feMerge></filter>`);
  }
  return `url(#${id})`;
}

/* ---------- Licht über einer Form (Verläufe in Formkoordinaten, einmal je Art) ---------- */
/* EIN Licht von links oben: Rückenkante hell, Kernschatten-Band im unteren Drittel, Bodenreflex ganz unten */
const LICHT = (T) => T.lg("licht", [[0, "#fff", 0.16], [0.3, "#fff", 0], [0.55, "#000", 0.06], [0.78, "#000", 0.34], [0.9, "#000", 0.28], [1, "#e8d2b0", 0.1]], 0.25, 0, 0.6, 1);
const RUND = (T) => T.rg("rund", [[0, "#fff", 0.14], [0.45, "#fff", 0], [0.78, "#000", 0.16], [1, "#000", 0.34]], 0.36, 0.3, 0.78);
/* Teil: Pfad EINMAL in defs, Füllung + (geklippt) Innenleben + Licht */
function teil(T, n, d, fill, innen = "", o = {}) {
  const id = T.id("t" + n);
  T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  const li = (o.licht ? `<use href="#${id}" fill="${LICHT(T)}"/>` : "") + (o.rund ? `<use href="#${id}" fill="${RUND(T)}"/>` : "");
  return `<use href="#${id}" fill="${fill}"/>` + (innen || li ? `<g clip-path="url(#${id}c)">${innen}${li}${o.danach || ""}</g>` : "");
}
const clip = (T, n) => `clip-path="url(#${T.id("t" + n)}c)"`;
/* Verlauf in Zentimetern (userSpaceOnUse) zwischen (x0, y0) und (x1, y1); stops [[t, farbe, op?], …] */
const verlauf = (T, n, x0, y0, x1, y1, stops) => T.lg(n, stops, N(x0), N(y0), N(x1), N(y1), ' gradientUnits="userSpaceOnUse"');
/* Rausch-Struktur (Fahnenstrahlen, Daunen) in eine Form, gestreckt in Wuchsrichtung – nur fein, schwach */
const struktur = (T, d, n, winkel, farbe, op, bx, fx = 1.4, fy = 0.22) => (T.fein ? T.textur(d, T.rauschen(n, { fx, fy, farbe, staerke: 2.2, okt: 2 }), winkel, op, bx) : "");

/* Fahnenstriche/Borsten in einer Fläche (wie T.haare, aber relativ und knapp geschrieben): poly ungeglättet,
   winkel (Grad oder f(x, y)), len (cm), farben [[farbe, anteil, breite, deckkraft]…], o = { streu, krumm, sz } */
function striche(T, poly, n, winkel, len, farben, o = {}) {
  const [x0, y0, x1, y1] = box(poly), wf = typeof winkel === "function" ? winkel : () => winkel;
  const ziel = Math.round(n * (T.fein ? 1 : (o.sz || 0)));
  if (ziel < 4) return "";
  const eimer = farben.map(() => ""), sum = farben.reduce((q, f) => q + f[1], 0);
  for (let got = 0, v = 0; got < ziel && v < ziel * 12; v++) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!inPoly(x, y, poly)) continue;
    const a = rad(wf(x, y) + (T.rnd() - 0.5) * (o.streu != null ? o.streu : 14)), L = len * (0.55 + T.rnd() * 0.9);
    const ex = Math.cos(a) * L, ey = Math.sin(a) * L, k = (o.krumm != null ? o.krumm : 0.15) * L * (T.rnd() - 0.5) * 2;
    let u = T.rnd() * sum, i = 0;
    while (i < farben.length - 1 && u > farben[i][1]) { u -= farben[i][1]; i++; }
    eimer[i] += "M" + J(x, y) + "q" + J(ex / 2 - Math.sin(a) * k, ey / 2 + Math.cos(a) * k, ex, ey);
    got++;
  }
  return eimer.map((d, i) => zug(d, farben[i][0], farben[i][2], farben[i][3])).join("");
}

/* ---------- Deckfedern als Vorlagen ---------- */
/* Formen in Einheitskoordinaten: Ansatz (0, 0), Spitze (1, 0), größte Breite 1 */
const FORMEN = {
  rund: "M0-.34C.3-.52.72-.52.88-.32C.98-.18 1.02-.06 1.02 0C1.02.06.98.18.88.32C.72.52.3.52 0 .34Z",
  lanz: "M0-.3C.3-.5.6-.46.8-.26C.92-.13.98-.04 1.03.02C.96.1.9.18.8.27C.6.46.3.5 0 .3Z",
  breit: "M0-.38C.3-.52.78-.53.93-.3C1.01-.14 1.02.1.95.27C.82.5.3.53 0 .38Z",
  flaum: "M0-.3C.25-.5.55-.5.75-.38C.88-.28.97-.16 1.04-.06C.98 0 1.02.08.96.14C.9.3.72.46.5.48C.3.5.15.42 0 .3Z",
  spitz: "M0-.28C.3-.5.55-.42.75-.24C.88-.12.96-.03 1.04 0C.96.03.88.12.75.24C.55.42.3.5 0 .28Z",
};
/* Fahnenstrahlen in der Vorlage: vom Schaft schräg nach vorn zum Rand (ein Pfad je Farbe) */
function strahlenD(n, x0 = 0.2, x1 = 0.95) {
  let d = "";
  for (let i = 0; i < n; i++) {
    const t = x0 + (x1 - x0) * i / (n - 1);
    for (const sg of [-1, 1]) {
      const ey = sg * (0.46 - 0.3 * Math.max(0, (t - 0.62) / 0.38) ** 2);
      d += "M" + N2(t) + " 0Q" + N2(t + 0.07) + " " + N2(sg * 0.2) + " " + N2(Math.min(1.02, t + 0.2)) + " " + N2(ey);
    }
  }
  return d;
}
/* Strahlen-Geometrie EINMAL je Art; jede Vorlage setzt nur Farbe und Deckkraft */
function strahlen(T, farbe, op, hell) {
  const id = T.id(hell ? "strH" : "strD");
  if (!T["_" + id]) { T["_" + id] = 1; T.def(`<path id="${id}" d="${hell ? strahlenD(7, 0.28, 0.9) : strahlenD(8)}" fill="none" stroke-width="${hell ? 0.012 : 0.014}"/>`); }
  return `<use href="#${id}" stroke="${farbe}" stroke-opacity="${op}"/>`;
}
/* Vorlage: o = { form, stops (entlang der Feder), marke (SVG in Einheitskoordinaten, geklippt), schaft, strahl: [dunkel, hell],
   schatten, weich (Körpergefieder: Schatten schwach und breit) }. Wird erst beim ersten Gebrauch in die defs geschrieben
   (die Szene braucht viele Vorlagen gar nicht). Die Grundform liegt EINMAL je Art in den defs. */
function federTyp(T, n, o) {
  T._fts = T._fts || {};
  const id = T.id("f" + n);
  T._fts[id] = Object.assign({ n }, o);
  return id;
}
function federDef(T, id) {
  const o = T._fts && T._fts[id];
  if (!o) return;
  delete T._fts[id];
  T._ft = T._ft || new Set();
  const form = o.form || "rund", fid = T.id("F" + form), cid = fid + "c";
  if (!T._ft.has(fid)) { T._ft.add(fid); T.def(`<path id="${fid}" d="${FORMEN[form]}"/><clipPath id="${cid}"><use href="#${fid}"/></clipPath>`); }
  let inh = `<use href="#${fid}" fill="${T.lg("g" + o.n, o.stops, 0, 0, 1, 0)}"/>`;
  let innen = o.marke || "";
  if (T.fein) {
    if (o.strahl) innen += strahlen(T, o.strahl[0], 0.22) + strahlen(T, o.strahl[1], 0.16, 1);
    if (o.schaft) innen += `<path d="M.12 0Q.55-.015.93 0" stroke="${o.schaft}" stroke-width=".026" stroke-opacity="${o.schaftOp || 0.45}" fill="none"/>`;
  } else if (o.markeSz != null) innen = o.markeSz;
  if (innen) inh += `<g clip-path="url(#${cid})">${innen}</g>`;
  T.def(`<g id="${id}"${T.fein && o.schatten !== false ? ` filter="${vorlageSchatten(T, o.weich ? "w" : "d")}"` : ""}>${inh}</g>`);
}
/* eine Feder setzen: Spitze bei (x, y), Richtung a (Grad), Länge L, Breite W */
function feder(T, id, x, y, a, L, W) {
  federDef(T, id);
  const c = Math.cos(rad(a)), s = Math.sin(rad(a));
  const M = (v) => (Math.abs(v) >= 2 ? String(Math.round(v * 10) / 10).replace(/^(-?)0\./, "$1.") : N2(v));
  return `<use href="#${id}" transform="matrix(${M(c * L)} ${M(s * L)} ${M(-s * W)} ${M(c * W)} ${N(x - c * L)} ${N(y - s * L)})"/>`;
}
/* Federfeld: Spitzen gesät in poly (etwas darüber hinaus, die Form klippt), Dachziegel-Reihenfolge (stromab zuerst).
   o = { typen: [id…], abst, L, W, winkel(x, y), gr(x, y), streu, typ(x, y) → Index, ueber, sz (auch in der Szene zeichnen) } */
function federFeld(T, poly, o) {
  if (!T.fein && !o.sz) return "";
  const a = o.abst * (T.fein ? 1 : (o.szAbst || 1.7)), fs = [];
  const cx = poly.reduce((q, p) => q + p[0], 0) / poly.length, cy = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const ue = o.ueber != null ? o.ueber : a * 0.15;
  const pol = poly.map(([x, y]) => { const l = Math.hypot(x - cx, y - cy) || 1; return [x + (x - cx) / l * ue, y + (y - cy) / l * ue]; });
  const [x0, y0, x1, y1] = box(pol);
  let j = 0;
  for (let y = y0; y <= y1; y += a * (o.zeile || 0.62), j++)
    for (let x = x0 + (j % 2) * a * 0.5; x <= x1; x += a) {
      const px = x + (T.rnd() - 0.5) * a * 0.45, py = y + (T.rnd() - 0.5) * a * 0.3;
      if (!inPoly(px, py, pol)) continue;
      const g = (o.gr ? o.gr(px, py) : 1) * (T.fein ? 1 : (o.szGr || 1.5));
      const w = o.winkel(px, py) + (T.rnd() - 0.5) * (o.streu != null ? o.streu : 12);
      const u = [Math.cos(rad(w)), Math.sin(rad(w))];
      const ti = o.typ ? o.typ(px, py, T.rnd()) : Math.floor(T.rnd() * o.typen.length);
      fs.push({ k: px * u[0] + py * u[1], s: feder(T, o.typen[ti], px, py, w, o.L * g * (0.85 + T.rnd() * 0.3), o.W * g * (0.85 + T.rnd() * 0.3)) });
    }
  fs.sort((p, q) => q.k - p.k);
  if (process.env.ZAEHL) console.error("feld", fs.length, o.L, o.abst);
  return fs.map((f) => f.s).join("");
}
/* Federreihe entlang einer Linie (Flügeldecken, Saum über einer Kante): pts = Spitzenlinie, je Feder Richtung winkel(t) */
function federReihe(T, pts, n, o) {
  const nn = T.fein ? n : Math.max(2, Math.round(n * (o.sz || 0.5)));
  const fs = [];
  for (let i = 0; i < nn; i++) {
    const t = (i + 0.5 + (T.rnd() - 0.5) * 0.3) / nn, p = auf(pts, t);
    const w = (typeof o.winkel === "function" ? o.winkel(t) : o.winkel) + (T.rnd() - 0.5) * (o.streu || 6);
    const g = (o.gr ? o.gr(t) : 1) * (T.fein ? 1 : n / nn * 0.8);
    const ti = o.typ ? o.typ(t, T.rnd()) : Math.floor(T.rnd() * o.typen.length);
    fs.push({ k: o.reihenfolge ? o.reihenfolge(t) : -t, s: feder(T, o.typen[ti], p[0], p[1], w, o.L * g * (0.9 + T.rnd() * 0.2), o.W * g * (0.9 + T.rnd() * 0.2)) });
  }
  fs.sort((p, q) => q.k - p.k);
  return fs.map((f) => f.s).join("");
}

/* ---------- lange Federn (Schwingen, Steuerfedern) ---------- */
/* pts: Mittellinie Ansatz → Spitze; o = { fill, schaft, kante, binden: [anzahl, farbe, deckkraft, breite, von, bis],
   saum: [farbe, deckkraft] (heller Endsaum), aussen: 1 | -1 (Seite der schmalen Außenfahne), dunkel (Innenfahne) } */
function schwinge(T, pts0, w0, w1, o) {
  const pts = abtasten(pts0, 5), n = pts.length;
  const um = band(pts, w0, w1, 1.1);
  const { L, R } = bandRaender(pts, w0 * 0.92, w1 * 0.92);
  const au = o.aussen || 1, A = au > 0 ? L : R, I = au > 0 ? R : L;
  /* Querverlauf je Feder: Außenfahne (zum Licht) heller, Innenfahne dunkler – so trennt sich jede Feder */
  let fill = o.fill;
  if (o.quer && T.fein) { T._sw = (T._sw || 0) + 1; const m = Math.floor(n * 0.55); fill = verlauf(T, "sw" + T._sw, A[m][0], A[m][1], I[m][0], I[m][1], o.quer); }
  else if (o.quer) fill = o.quer[1][1];
  let s = `<path d="${G(um)}" fill="${fill}"${T.fein && o.schatten !== false ? ` filter="${federSchatten(T)}"` : ""}/>`;
  if (!T.fein && !o.szene) return s;
  /* Innenfahne etwas dunkler (sie liegt im Schatten der nächsten Feder) */
  if (o.dunkel) s += fl(G([...pts.slice(1, n - 1).map((p, i) => lerp(p, I[i + 1], 0.15)), ...I.slice(1, n - 1).reverse()]), o.dunkel[0], o.dunkel[1]);
  /* Binden quer über die Fahne (folgen der Biegung) */
  if (o.binden && T.fein) {
    const [k, farbe, op, br, von = 0.12, bis = 0.92] = o.binden;
    let d = "";
    for (let i = 0; i < k; i++) {
      const t = von + (bis - von) * (i + 0.5) / k, f = t * (n - 1), q = Math.min(n - 2, Math.floor(f)), r = f - q;
      const a = lerp(A[q], A[q + 1], r), b = lerp(I[q], I[q + 1], r), m = lerp(pts[q], pts[q + 1], r);
      const dx = pts[q + 1][0] - pts[q][0], dy = pts[q + 1][1] - pts[q][1], l = Math.hypot(dx, dy) || 1;
      const v = (o.bindenBogen || 0.25) * (w0 + (w1 - w0) * t);
      d += "M" + J(a[0], a[1]) + "Q" + J(m[0] + dx / l * v, m[1] + dy / l * v, b[0], b[1]);
    }
    s += zug(d, farbe, br, op, ' stroke-linecap="butt"');
  }
  if (T.fein) {
    /* Schaft: nahe der Außenfahne, zur Spitze feiner */
    const sa = lerp(pts[0], A[0], 0.28), sm = lerp(pts[2], A[2], 0.28), se = lerp(pts[n - 2], A[n - 2], 0.28);
    if (o.schaft) s += zug("M" + J(sa[0], sa[1]) + "Q" + J(2 * sm[0] - (sa[0] + se[0]) / 2, 2 * sm[1] - (sa[1] + se[1]) / 2, se[0], se[1]), o.schaft[0], o.schaft[1] || 0.12, o.schaft[2] || 0.55);
    /* Lichtkante an der Außenfahne (oben, zum Licht) und heller Endsaum */
    if (o.kante) s += zug(GO(A.slice(1, n - 1)), o.kante[0], o.kante[1] || 0.1, o.kante[2] || 0.4);
    if (o.saum) s += zug(GO([A[n - 2], um[n], I[n - 2]]), o.saum[0], o.saum[2] || 0.25, o.saum[1]);
  }
  return s;
}

/* ---------- Fänge ---------- */
/* Kralle: Ansatz b, Richtung a (Grad), Länge L, Dicke w, Krümmung k (Grad gesamt, + = nach unten im Uhrzeigersinn) */
function kralle(T, b, a, L, w, k, o = {}) {
  const pts = [];
  let p = b, ang = a;
  for (let i = 0; i <= 5; i++) { pts.push(p); ang += k / 5; p = [p[0] + Math.cos(rad(ang)) * L / 5, p[1] + Math.sin(rad(ang)) * L / 5]; }
  const um = band(pts, w, w * 0.12, 0, (t) => w * (1 - t * 0.9) * (t < 0.15 ? 0.9 + t : 1));
  let s = fl(G(um), o.fill || T.lg("kralle", [[0, "#3a3430"], [0.35, "#141210"], [1, "#050505"]], 0, 0, 1, 1));
  if (T.fein) {
    const { L: Lr } = bandRaender(pts, w * 0.7, w * 0.1);
    s += zug(GO(Lr.slice(1, 5)), "#fff", w * 0.1, 0.6);
  }
  return s;
}
/* Zehe: Mittellinie pts (Ansatz → Spitze), Dicke w0 → w1; Querschilder oben, Ballen unten, Kralle am Ende.
   o = { hell, mittel, dunkel, kralle: [Länge, Dicke, Krümmung], fern, schilde (Anzahl) } */
function zehe(T, pts0, w0, w1, o) {
  const pts = abtasten(pts0, 6), n = pts.length;
  const { L, R } = bandRaender(pts, w0, w1);
  /* L = Oberseite (Blick nach rechts, Zehe nach vorn: links der Laufrichtung = oben) */
  const ballen = R.map((p, i) => { const q = pts[i]; const b = i > 0 && i < n - 1 ? 1 + 0.16 * Math.sin(i * 1.9) : 1; return lerp(q, p, b); });
  const e = pts[n - 1], v = pts[n - 2], l = Math.hypot(e[0] - v[0], e[1] - v[1]) || 1;
  const spitze = [e[0] + (e[0] - v[0]) / l * w1 * 0.4, e[1] + (e[1] - v[1]) / l * w1 * 0.4];
  const um = [...L, spitze, ...ballen.reverse()];
  const gl = o.fern ? o.dunkel : T.lg("zehe" + o.hell.slice(1), [[0, o.hell], [0.45, o.mittel], [1, o.dunkel]], 0, 0, 0.25, 1);
  let s = fl(G(um), gl);
  if (T.fein && !o.fern) {
    /* Querschilder (Scuta) auf der Oberseite: dunkle Fuge, helle Kante */
    let fu = "";
    const k = o.schilde || 6;
    for (let i = 1; i < k; i++) {
      const t = i / k, f = t * (n - 1), q = Math.min(n - 2, Math.floor(f)), r = f - q;
      const a = lerp(L[q], L[q + 1], r), m = lerp(pts[q], pts[q + 1], r);
      const c = lerp(a, m, 0.85), dx = pts[q + 1][0] - pts[q][0], dy = pts[q + 1][1] - pts[q][1], ll = Math.hypot(dx, dy) || 1, h = lerp(a, c, 0.5);
      fu += "M" + J(a[0], a[1]) + "q" + J(h[0] + dx / ll * 0.25 * w0 - a[0], h[1] + dy / ll * 0.25 * w0 - a[1], c[0] - a[0], c[1] - a[1]);
    }
    /* Querschilder: dunkle Fuge, darüber eine helle Lichtkante entlang der Oberseite */
    s += zug(fu, o.fuge || "#5a3a08", w0 * 0.07, 0.75) + zug(GO(L.slice(1, n - 1).map((p, i) => lerp(p, pts[i + 1], 0.22))), "#fff8d0", w0 * 0.1, 0.35);
  }
  if (o.kralle) {
    const [kl, kw, kk] = o.kralle, a = Math.atan2(e[1] - v[1], e[0] - v[0]) * 180 / Math.PI;
    s += kralle(T, lerp(e, L[n - 1], 0.25), a + (o.krAnsatz || 0), kl, kw, kk);
  }
  return s;
}

/* ---------- Greifvogelauge (Seitenansicht) ----------
   In der Höhle: Okklusion rundum, Brauenschatten aufs obere Drittel, Lidrand, Iris mit Fasern, Linsenaufhellung
   gegenüber dem Licht, runde Pupille, scharfes Glanzlicht oben links + weicher Gegenreflex.
   o = { iris, iris2, pupille (Anteil), ring: [farbe, breite], lid, braue (Deckkraft), offen (Höhe/Breite) } */
function greifAuge(T, x, y, r, o) {
  const id = T.id("ga" + Math.round(x * 10));
  const off = o.offen || 0.92;
  T.def(`<clipPath id="${id}"><ellipse cx="${N2(x)}" cy="${N2(y)}" rx="${N2(r * 1.04)}" ry="${N2(r * off)}"/></clipPath>`);
  let s = "";
  if (o.hoehle !== false) s += weich(T, `M${J(x - r * 2.1, y)}a${J(r * 2.1, r * 1.6)} 0 1 0 ${J(r * 4.2, 0)}a${J(r * 2.1, r * 1.6)} 0 1 0 ${J(-r * 4.2, 0)}Z`, "#000", o.hoehle || 0.35, r * 0.45);
  if (o.ring) s += `<ellipse cx="${N2(x)}" cy="${N2(y)}" rx="${N2(r * (1.04 + o.ring[1]))}" ry="${N2(r * (off + o.ring[1]))}" fill="${T.rg("ring", [[0, mische(o.ring[0], "#fff", 0.2)], [0.75, o.ring[0]], [1, mische(o.ring[0], "#000", 0.35)]], 0.4, 0.35, 0.65)}"/>`;
  s += `<ellipse cx="${N2(x)}" cy="${N2(y)}" rx="${N2(r * 1.13)}" ry="${N2(r * (off + 0.1))}" fill="${o.lid || "#1a1410"}"/>`;
  let inn = `<circle cx="${N2(x)}" cy="${N2(y)}" r="${N2(r)}" fill="${T.rg("iris", [[0, mische(o.iris, "#fff", 0.25)], [0.45, o.iris], [0.8, o.iris2], [1, "#0c0704"]], 0.62, 0.66, 0.72)}"/>`;
  if (T.fein) {
    let fa = "";
    for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2, a2 = a + (T.rnd() - 0.5) * 0.25, r1 = r * (0.5 + T.rnd() * 0.1); fa += "M" + N2(x + Math.cos(a) * r1) + " " + N2(y + Math.sin(a) * r1) + "L" + N2(x + Math.cos(a2) * r * 0.93) + " " + N2(y + Math.sin(a2) * r * 0.93); }
    inn += `<path d="${fa}" stroke="${o.iris2}" stroke-width="${N2(r * 0.035)}" stroke-opacity=".5" fill="none"/>`;
    inn += `<circle cx="${N2(x)}" cy="${N2(y)}" r="${N2(r * 0.95)}" fill="none" stroke="#0a0604" stroke-width="${N2(r * 0.1)}" stroke-opacity=".75"/>`;
  }
  inn += `<circle cx="${N2(x + r * 0.03)}" cy="${N2(y)}" r="${N2(r * (o.pupille || 0.46))}" fill="#030202"/>`;
  /* Schatten von Oberlid und Braue */
  inn += `<rect x="${N2(x - r * 1.2)}" y="${N2(y - r * 1.1)}" width="${N2(r * 2.4)}" height="${N2(r * 1.25)}" fill="${T.lg("lidsch", [[0, "#000", 0.85], [0.5, "#000", 0.35], [1, "#000", 0]])}"/>`;
  inn += `<ellipse cx="${N2(x - r * 0.38)}" cy="${N2(y - r * 0.3)}" rx="${N2(r * 0.2)}" ry="${N2(r * 0.14)}" fill="#fff" opacity=".95" transform="rotate(-25 ${N2(x - r * 0.38)} ${N2(y - r * 0.3)})"/>`;
  inn += `<ellipse cx="${N2(x + r * 0.42)}" cy="${N2(y + r * 0.45)}" rx="${N2(r * 0.3)}" ry="${N2(r * 0.12)}" fill="#fff" opacity=".22" transform="rotate(-35 ${N2(x + r * 0.42)} ${N2(y + r * 0.45)})"/>`;
  s += `<g clip-path="url(#${id})">${inn}</g>`;
  /* Lidränder: oben kräftig, unten fein mit feuchtem Glanz */
  s += zug(`M${J(x - r * 1.08, y + r * 0.1)}Q${J(x - r * 0.2, y - r * (off + 0.42), x + r * 1.08, y - r * 0.05)}`, o.lid || "#1a1410", r * 0.16, 0.9);
  if (T.fein) s += zug(`M${J(x - r * 0.75, y + r * 0.72)}Q${J(x + r * 0.1, y + r * 1.05, x + r * 0.85, y + r * 0.62)}`, "#fff", r * 0.05, 0.3);
  return s;
}

/* ---------- Sitzplätze ---------- */
/* Fels: Umriss (Boden y = 0), Lichtfläche oben, Schattenseite rechts, Risse, Körnung, Flechten. o = { hell, mittel, dunkel, oben: pts, rechts: pts, risse: [pts…], flechten: [[x, y, r, farbe]…], koernung } */
function fels(T, n, um, o) {
  const [x0, y0, x1, y1] = box(um);
  const d = G(um);
  let inn = "";
  if (o.oben) inn += fl(G(o.oben), verlauf(T, n + "ob", x0, y0, x0 + (x1 - x0) * 0.3, y0 + (y1 - y0) * 0.6, [[0, o.hell], [1, o.mittel]]), 0.9);
  if (o.links) inn += fl(G(o.links), o.hell, 0.35);
  if (o.rechts) inn += weich(T, G(o.rechts), "#000", 0.38, 0.5);
  if (T.fein && o.koernung !== false) {
    inn += T.textur(d, T.rauschen(n + "k1", { fx: 1.9, fy: 1.9, farbe: "#1a1816", staerke: 3.2, okt: 1, schwelle: 0.66 }), 0, 0.3, [x0, y0, x1, y1]);
    inn += T.textur(d, T.rauschen(n + "k2", { fx: 1.5, fy: 1.5, farbe: "#f4f0e8", staerke: 3, okt: 1, schwelle: 0.68, seed: 11 }), 0, 0.3, [x0, y0, x1, y1]);
  }
  if (o.risse && T.fein) {
    let r = "", h = "";
    for (const p of o.risse) { r += GO(p); h += GO(p.map(([x, y]) => [x - 0.12, y - 0.1])); }
    inn += zug(h, "#fff", 0.16, 0.22, ` filter="${blur(T, 0.06)}"`) + zug(r, "#1a1612", 0.2, 0.6, ` filter="${blur(T, 0.06)}"`);
  }
  if (o.flechten && T.fein) {
    for (const [fx, fy, fr, fc] of o.flechten) {
      let p = "";
      for (let i = 0; i < 4; i++) { const a = T.rnd() * Math.PI * 2, rr = fr * (0.3 + T.rnd() * 0.7); const px = fx + Math.cos(a) * fr * 0.8, py = fy + Math.sin(a) * fr * 0.35; p += `M${J(px - rr, py)}a${J(rr, rr * 0.55)} 0 1 0 ${J(rr * 2, 0)}a${J(rr, rr * 0.55)} 0 1 0 ${J(-rr * 2, 0)}Z`; }
      inn += fl(p, fc, 0.75);
    }
  }
  inn += fl(d, verlauf(T, n + "li", x0, y0, x1, y1, [[0, "#fff", 0.12], [0.4, "#fff", 0], [0.75, "#000", 0.18], [1, "#000", 0.42]]));
  inn += weich(T, `M${J(x0 - 2, -1.2)}L${J(x1 + 2, -1.2)} ${J(x1 + 2, 1)} ${J(x0 - 2, 1)}Z`, "#000", 0.45, 0.8);
  return relief(T, n, teil(T, n, d, verlauf(T, n + "g", x0, y0, x1, y1, [[0, o.hell], [0.45, o.mittel], [1, o.dunkel]]), inn, { licht: false }), { f: 0.7, tiefe: 0.25, okt: 2, k1: 1.08 });
}
const relief = (T, n, inh, o) => (T.fein ? `<g filter="${T.relief(n, o)}">${inh}</g>` : inh);
/* Volumen je Körperteil (ANLEITUNG Punkt 13, „Bump-Shading“): eigene Silhouette weich beleuchtet von links oben.
   weich ≈ 20–30 % der Dicke des Teils (cm). In Szenen ohne Filter.
   Wie T.volumen (kern.js) gedacht, aber ohne Ableitung des geblurrten Alphas: Die Beleuchtung über
   feDiffuseLighting rechnet Normalen aus 8-Bit-Stufen und erzeugt im Großbild konzentrische Ringe („Holzmaserung“,
   gemessen an Kopf und Schnabel). Hier: geblurrte Silhouette, einmal zum Licht hin und einmal vom Licht weg versetzt;
   die Differenz ist glatt und gibt Licht an der Oberkante und Kernschatten an der Unterkante. Licht und Schatten
   liegen als halbdurchsichtige Schichten ÜBER der Farbe (warmes Weiß, warmes Dunkel) – Kanten bleiben sauber. */
function volumen(T, n, o = {}) {
  if (!T.fein) return "none";
  const w = o.weich || 3, v = Math.round(w * 0.7 * 100) / 100, li = o.licht != null ? o.licht : 0.32, sc = o.schatten != null ? o.schatten : 0.62;
  const id = T.id(("vo" + w + "_" + li + "_" + sc).replace(/\./g, ""));
  T._vo = T._vo || new Set();
  if (!T._vo.has(id)) {
    T._vo.add(id);
    T.def(`<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">` +
      `<feGaussianBlur in="SourceAlpha" stdDeviation="${w}" result="b"/>` +
      `<feOffset in="b" dx="${-v}" dy="${N2(-v * 1.25)}" result="a"/><feOffset in="b" dx="${v}" dy="${N2(v * 1.25)}" result="c"/>` +
      `<feComposite in="a" in2="c" operator="arithmetic" k2="${li}" k3="${-li}"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 .96 0 0 0 0 .88 0 0 0 1 0" result="h"/>` +
      `<feComposite in="c" in2="a" operator="arithmetic" k2="${sc}" k3="${-sc}"/><feColorMatrix values="0 0 0 0 .07 0 0 0 0 .04 0 0 0 0 .02 0 0 0 1 0" result="s"/>` +
      `<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="s"/><feMergeNode in="h"/></feMerge><feComposite in2="SourceGraphic" operator="in"/></filter>`);
  }
  return `url(#${id})`;
}
const STUFEN = [0.6, 2, 6];
const vg = (T, n, weich, inh, o = {}) => {
  if (process.env.ZAEHL) console.error("teil", n, inh.length);
  const w = STUFEN.reduce((b, x) => (Math.abs(x - weich) < Math.abs(b - weich) ? x : b), STUFEN[0]);   // wenige Stufen: Filter werden geteilt
  return T.fein ? `<g filter="${volumen(T, n, Object.assign({ weich: w }, o))}">${inh}</g>` : inh;
};


/* ---------- gemeinsame Bausteine der Arten ---------- */
/* Feder-Vorlage mit Verlauf Ansatz → Farbe → Saum. weich = Körpergefieder (kontrastarm, verschmilzt) */
function vorlage(T, n, c, saum, form = "rund", extra = {}) {
  const w = extra.weich;
  const stops = w ? [[0, mische(c, "#000", 0.25)], [0.6, c], [1, saum]]
    : [[0, mische(c, "#000", 0.5)], [0.55, mische(c, "#000", 0.08)], [0.85, c], [1, saum]];
  return federTyp(T, n, Object.assign({ form, stops }, extra));
}
/* Flügel-Rahmen: Unterkante E (Handgelenk → Spitze), Rückenkante B; W(s, v) = Punkt (s längs 0..1, v quer 0 = unten, 1 = oben) */
function fluegelRahmen(E, B) {
  const W = (sx, v) => lerp(auf(E, sx), auf(B, sx), v);
  const linie = (s0, v0, s1, v1, k = 6) => { const o = []; for (let i = 0; i <= k; i++) { const t = i / k; o.push(W(s0 + (s1 - s0) * t, v0 + (v1 - v0) * t)); } return o; };
  const richtung = (sx, v) => { const a = W(sx, v), b = W(Math.min(1, sx + 0.04), v); return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI; };
  return { W, linie, richtung };
}

/* =====================================================================
   STEINADLER
   ===================================================================== */
/* RECHERCHE Steinadler (Aquila chrysaetos) – Websuche-Kontingent erschöpft, aus Fachwissen (HBW, Svensson, Forsman):
   Länge 75–93 cm (Weibchen größer), Spannweite 190–227 cm, Gewicht 3–6,5 kg. Schwanz 27–35 cm, Flügel (gefaltet)
   57–72 cm: im Sitzen reichen die Handschwingen fast bis zur Schwanzspitze. Schnabel (First mit Wachshaut) ca.
   5,5–6,5 cm, hoch, Haken kräftig; Basis blaugrau, Spitze schwarz, Wachshaut und Mundwinkel gelb, die Schnabelspalte
   reicht bis unter die Augenmitte. Auge groß (Iris ca. 2 cm sichtbar), Iris goldbraun bis haselnussbraun, kräftiger
   Überaugenwulst (flache, „finstere“ Stirnlinie), Augenumgebung dunkel befiedert, kein nackter Augenring.
   Kennzeichen: goldgelbe, lanzettförmige Federn an Hinterkopf, Nacken und Halsseiten („Goldnacken“), sonst
   dunkelbraun; mittlere Flügeldecken mit hellen lohfarbenen Spitzen (helles Band auf dem Oberflügel), Hosen und
   Unterschwanzdecken lohbraun. Läufe bis zu den Zehen befiedert („befiederte Läufe“, Echte Adler). Zehen gelb mit
   Querschildern; Mittelzehe ca. 7 cm, Krallen schwarz, stark gebogen, Hinterkralle 4,5–6,5 cm. Schwanz adult
   graubraun mit unregelmäßigen dunklen Binden und breiter dunkler Endbinde. Sitzend: Körper ca. 60° aufgerichtet,
   breite Brust, Kopf mit flachem Scheitel, Schwanz hängt fast senkrecht. */
function steinadler(T) {
  Q = 10;
  const F = T.fein;
  let s = "";
  /* Haltung: Körper um die Fänge 9° nach vorn geneigt (ca. 60° aufgerichtet), Kopf wieder waagerecht */
  const DREH = 9, PIV = [3.5, -16.5], KDREH = -8, KPIV = [0, -72];
  const rot = (inh) => `<g transform="rotate(${DREH} ${PIV[0]} ${PIV[1]})">${inh}</g>`;
  const krot = (inh) => `<g transform="rotate(${KDREH} ${KPIV[0]} ${KPIV[1]})">${inh}</g>`;
  /* ---- Feder-Vorlagen ---- */
  const brust = [vorlage(T, "b1", "#4a3020", "#5c402c", "lanz", { weich: 1 }), vorlage(T, "b2", "#3e281a", "#523826", "lanz", { weich: 1 })];
  const hose = [vorlage(T, "h1", "#7a5230", "#966c44", "flaum", { weich: 1 }), vorlage(T, "h2", "#684428", "#86603a", "flaum", { weich: 1 })];
  const goldM = (k, o) => `<path d="M0 0Q.45-${k}.8 0Q.45 ${k} 0 0Z" fill="#3e2410" opacity="${o}"/>`;
  const gold = [vorlage(T, "g1", "#b88234", "#e6ba62", "spitz", { marke: goldM(0.09, 0.4), weich: 1 }), vorlage(T, "g2", "#c4903e", "#eec470", "spitz", { marke: goldM(0.05, 0.3), weich: 1 }), vorlage(T, "g3", "#a06e2c", "#d8aa56", "spitz", { marke: goldM(0.12, 0.45), weich: 1 })];
  const goldD = [vorlage(T, "g4", "#74502a", "#a87a3e", "spitz", { marke: goldM(0.12, 0.5), weich: 1 })];
  const decke = [vorlage(T, "d1", "#4e3420", "#6a4c30", "rund", { schaft: "#8a6a4a" }), vorlage(T, "d2", "#45301e", "#604430", "rund", { schaft: "#8a6a4a" })];
  const mittel = [vorlage(T, "m1", "#5e4026", "#906a44", "rund", { schaft: "#9a7a52" }), vorlage(T, "m2", "#543822", "#7e5c3a", "rund", { schaft: "#9a7a52" })];
  const schulter = [vorlage(T, "s1", "#422c1c", "#5e442c", "breit", { schaft: "#7a5e44" })];

  /* ---- Schwanz (hinter allem): drei sichtbare Steuerfedern, graubraun mit Binden und dunkler Endbinde ---- */
  const quSt = [[0, "#7e705e"], [1, "#30261e"]];
  let sw = "";
  [[[-10.6, -38], [-20.2, -13.2]], [[-11.6, -37.6], [-21.6, -12.7]], [[-12.8, -37], [-22.8, -13.4]]].forEach(([b, e], i) => {
    sw += schwinge(T, [b, lerp(b, e, 0.5), [e[0] + 0.2, e[1]]], 4.6 - i * 0.1, 3.6 - i * 0.1, { quer: quSt, schaft: ["#b0a088", 0.12, 0.45],
      binden: [5, "#2a2018", 0.42, 0.95, 0.25, 0.86], saum: ["#c8b8a0", 0.6, 0.2], bindenBogen: 0.3 });
  });
  if (F) sw += fl(G([[-18.6, -17.6], [-23.8, -17.4], [-24.4, -14.6], [-22.8, -13], [-20.4, -12.6], [-18.6, -14]]), "#1e1610", 0.55, ` filter="${blur(T, 0.4)}"`);   // breite dunkle Endbinde
  s += vg(T, "schwanz", 1.4, rot(sw));

  /* ---- Fels (Granit, kantig: Flächen statt Kugel, Risse, Flechten) ---- */
  const felsU = [[-19.8, 0, 1], [-21.4, -3.4], [-20.6, -7.6, 1], [-17.4, -11.2], [-12.6, -13.8, 1], [-6, -15.1], [1, -15.6], [7.2, -15.4], [11.4, -14.2, 1], [14.6, -11.6], [16.2, -8.2, 1], [17.6, -3.6], [18, 0, 1]];
  s += vg(T, "fels", 0.8, fels(T, "fels", felsU, {
    hell: "#bab4aa", mittel: "#8e887e", dunkel: "#5a564f",
    oben: [[-17.4, -11.2], [-12.6, -13.8, 1], [-6, -15.1], [1, -15.6], [7.2, -15.4], [11.4, -14.2, 1], [9.6, -12.8], [3, -13.4, 1], [-4.6, -13], [-11.4, -11.8, 1], [-15.6, -9.6]],
    rechts: [[11.4, -14.2], [14.6, -11.6], [16.2, -8.2], [17.6, -3.6], [18, 0], [12.8, 0], [12.2, -4.4], [12.6, -8.6], [10.6, -12.2]],
    links: [[-21.4, -3.4], [-20.6, -7.6], [-17.4, -11.2], [-15.6, -9.6], [-16, -5.6], [-18, -1.6]],
    risse: [[[-4.6, -13], [-4, -9.6], [-5.2, -5.8], [-4.4, -1.4]], [[3, -13.4], [3.8, -10.4], [3.2, -7.6]], [[-11.4, -11.8], [-10.6, -8.4], [-11.6, -4.6]]],
    flechten: [[-10, -12.6, 1.1, "#b8bc94"], [9.4, -13.8, 0.6, "#d49a40"], [-17, -7.4, 0.9, "#c2c098"], [15, -6.4, 0.6, "#cfa048"], [0.6, -6, 1.2, "#aeb48c"]],
  }));

  /* ---- Fänge: gelb, dicke Zehen mit Querschildern, große schwarze Krallen; fern dunkler und halb verdeckt ---- */
  const ZF = { hell: "#f8dc70", mittel: "#e0aa2a", dunkel: "#8e5c0c", schilde: 6 };
  const fuss = (dx, dy, fern) => {
    Q = 10;
    const o = Object.assign({}, ZF, fern ? { hell: "#9a7a30", mittel: "#76561a", dunkel: "#3e2a08", fern: true } : {});
    const P = (x, y) => [x + dx, y + dy], m = (k) => Object.assign({}, o, k);
    let f = "";
    if (!fern) f += zehe(T, [P(3.8, -17.6), P(6.4, -17.4), P(8.4, -17)], 2, 1.6, m({ kralle: [3.6, 1.2, 130], n: "i" + dx, hell: mische(o.hell, "#000", 0.3), mittel: mische(o.mittel, "#000", 0.3), fern: true }));   // Innenzehe (dahinter)
    f += zehe(T, [P(2.6, -16.9), P(0.4, -16.6), P(-1.4, -16.1)], 2.3, 1.9, m({ kralle: [5.2, 1.5, -118], n: "h" + dx, krAnsatz: -6 }));   // Hinterzehe mit der größten Kralle
    f += zehe(T, [P(4.2, -17), P(7, -16.8), P(9.6, -16.3), P(11.4, -15.5)], 2.4, 1.85, m({ kralle: [4.4, 1.35, 150], n: "m" + dx }));   // Mittelzehe über die Felskante
    if (!fern) f += zehe(T, [P(3.6, -16.2), P(5.6, -15.2), P(7.2, -14.2)], 2.3, 1.8, m({ kralle: [3.8, 1.3, 145], n: "a" + dx }));   // Außenzehe (zum Betrachter, verkürzt)
    return f;
  };
  s += vg(T, "fussF", 0.5, fuss(-3.4, -0.5, true));

  /* ---- ferne Hose, Unterschwanzdecken ---- */
  const hoseFU = [[-7, -37], [-2.6, -40], [-1.6, -30], [-3.2, -22], [-4.8, -17.6], [-7.6, -17.4], [-8.6, -24], [-8.8, -31]];
  s += vg(T, "hoseF", 1.8, rot(teil(T, "hoseF", G(hoseFU), "#4a321e", federFeld(T, hoseFU, { typen: hose, abst: 5, L: 7, W: 2.4, winkel: () => 95, streu: 16 }) + fl(G(hoseFU), "#1a1008", 0.35))));
  const usdU = [[-12.8, -38.4], [-6, -36], [-4.6, -31], [-7, -27.6], [-11, -27.4], [-14.4, -31.6]];
  s += vg(T, "usd", 1.5, rot(teil(T, "usd", G(usdU), "#8a643a", federFeld(T, usdU, { typen: hose, abst: 4.2, L: 6, W: 2.4, winkel: () => 118, streu: 16 }))));

  /* ---- Rumpf: Brust und Bauch dunkelbraun, weiche Lanzettfedern, Fahnenstriche ---- */
  const rumpf = [[-7.8, -78.6], [-10.6, -72.4], [-12.4, -65.6], [-13.4, -57.6], [-13.4, -49], [-12, -41], [-9.4, -35.4], [-5.6, -32.4], [-0.6, -31.6], [5, -33.6], [9.6, -38], [12.8, -44], [14.8, -50.4], [15.4, -56.6], [14.6, -62.4], [12.6, -67.2], [10.6, -70.6], [9.6, -73.6], [6, -77.6], [0, -80]];
  const brustU = [[-6, -70.5], [10.4, -71.6], [14.8, -62], [15.4, -52], [13.2, -43], [9.4, -36.6], [4.2, -32.6], [-3.4, -32.2], [0.8, -37], [4.6, -43], [7.2, -49.4], [8.6, -55.5], [8.6, -61]];
  const brW = (x, y) => 94 + (y + 50) * 0.5 - (x - 9) * 1.2;
  let ri = federFeld(T, brustU, { typen: brust, abst: 4.8, L: 7, W: 3.7, zeile: 0.55, winkel: brW, gr: (x, y) => 0.72 + (y + 72) * 0.011, streu: 14 });
  if (F) ri += striche(T, brustU, 64, brW, 2.4, [["#1a0e06", 1, 0.05, 0.45], ["#8a6444", 0.7, 0.045, 0.35]], { streu: 12, krumm: 0.12 });
  ri += weich(T, G([[-4, -72], [6, -73], [10.4, -70], [4, -66.4], [-4, -66]]), "#000", 0.35, 1.2);   // Schlagschatten des Kopfes
  ri += weich(T, G([[-2, -35], [6, -34.6], [10.6, -38.6], [4, -31.6], [-3, -31.4]]), "#e8c898", 0.14, 0.9);   // Bodenreflex vom hellen Fels
  s += vg(T, "rumpf", 6.5, rot(teil(T, "rumpf", G(rumpf), "#4a3020", ri)));

  /* ---- nahe Hose: lohbraune, zottige Federn bis auf die Zehen ---- */
  const hoseN = [[9.8, -41], [11.2, -35], [10.8, -28.6], [9.4, -23.2], [7.6, -19.4], [6.4, -17.2], [5, -16.2], [3.4, -16.4], [1.6, -16.2], [0.2, -17], [-1.4, -19.8], [-3.2, -24.8], [-4.2, -30.4], [-4, -35.8], [-1.4, -40], [4.2, -42]];
  const hoW = (x, y) => 90 - (x - 3.5) * 1.6 + (y + 30) * 0.4;
  let hi = federFeld(T, hoseN, { typen: hose, abst: 4.8, L: 9, W: 3.3, zeile: 0.46, winkel: hoW, gr: (x, y) => 0.75 + (y + 42) * 0.012, streu: 20 });
  if (F) hi += striche(T, hoseN, 54, hoW, 2.8, [["#2a1606", 1, 0.05, 0.4], ["#c49a68", 0.8, 0.045, 0.35]], { streu: 18, krumm: 0.25 });
  hi += weich(T, G([[-4, -43], [11.4, -43], [11, -37], [3, -35.4], [-4, -37]]), "#140a04", 0.5, 1.1);   // Bauch und Flügel werfen Schatten
  let hs = teil(T, "hose", G(hoseN), "#7a5230", hi);
  hs += federReihe(T, [[0.4, -17.4], [2.4, -16.9], [4.4, -16.8], [6.4, -17.6]], 7, { typen: hose, L: 3.4, W: 1.6, winkel: (t) => 98 - t * 26, streu: 20, reihenfolge: (t) => t });   // zottiger Saum über den Zehen
  s += vg(T, "hose", 3, rot(hs));

  /* ---- nahe Fänge ---- */
  s += vg(T, "fuss", 0.5, fuss(0, 0, false));

  /* ---- Flügel (gefaltet) ---- */
  const E = [[8.6, -61], [8.6, -55.5], [7.2, -49.4], [4.6, -43], [0.8, -37], [-4, -31.4], [-9.6, -25.6], [-15.4, -20.4], [-21, -15.8]];
  const B = [[-6, -70], [-10.6, -66], [-12.8, -60], [-13.8, -52], [-14.6, -44], [-15.8, -36], [-17.6, -28], [-19.4, -21], [-21, -15.8]];
  const { W, linie, richtung } = fluegelRahmen(E, B);
  const quH = [[0, "#564638"], [1, "#160f0a"]];
  const quA = [[0, "#625242"], [1, "#1a120c"]];
  let fw = "";
  const nH = F ? 5 : 3, nA = F ? 5 : 3;
  for (let k = 0; k < nH; k++) {   // Handschwingen: äußere (längste) zuerst, innere darüber; Stufen an der Spitze
    const kk = k * 6.5 / nH;
    fw += schwinge(T, linie(0.16 + kk * 0.02, 0.05 + kk * 0.05, 1 - kk * 0.042, 0.28 + kk * 0.05), 4.8, 3.4,
      { quer: quH, schaft: ["#9a8a78", 0.13, 0.45] });
  }
  for (let j = 0; j < nA; j++) {   // Armschwingen: breit, mit undeutlichen grauen Binden
    const jj = j * 7.5 / nA;
    fw += schwinge(T, linie(0.18 + jj * 0.025, 0.28 + jj * 0.06, 0.66 - jj * 0.006, 0.36 + jj * 0.07), 5.6, 5,
      { quer: quA, schaft: ["#a8987e", 0.13, 0.4], binden: [4, "#8a8274", 0.2, 0.75, 0.4, 0.9] });
  }
  for (let i = 0; i < 2; i++)   // Schirmfedern
    fw += schwinge(T, linie(0.3, 0.84 + i * 0.05, 0.75 - i * 0.07, 0.84 + i * 0.07), 6.2, 5.6, { quer: quA, schaft: ["#a8987e", 0.13, 0.4], saum: ["#a8906c", 0.55, 0.22] });
  /* Decken: Handdecken unten vorn, große Decken, mittlere (hellere lohfarbene Spitzen), kleine, Schultern oben */
  const deckU = [...E.slice(0, 5), ...linie(0.5, 0.05, 0.43, 1, 3), ...B.slice(0, 4).reverse()];
  let dk = "";
  dk += federReihe(T, linie(0.3, 0.04, 0.24, 0.3, 3), 4, { typen: schulter, L: 7.2, W: 3.4, winkel: (t) => richtung(0.28, t * 0.3) + 4, streu: 4 });
  dk += federReihe(T, linie(0.42, 0.28, 0.38, 0.94, 4), 7, { typen: decke, L: 6.6, W: 3.8, winkel: (t) => richtung(0.38, 0.3 + t * 0.6) + 6, streu: 5 });
  dk += federReihe(T, linie(0.31, 0.26, 0.28, 0.96, 4), 8, { typen: mittel, L: 4.8, W: 3.2, winkel: (t) => richtung(0.28, 0.3 + t * 0.6) + 8, streu: 6 });
  dk += federFeld(T, [W(0.02, 0.12), W(0.25, 0.2), W(0.25, 0.99), W(0.02, 1)], { typen: [decke[0], mittel[1], decke[1]], abst: 3.9, L: 4.6, W: 3.4, zeile: 0.6, winkel: (x, y) => 118 - (y + 60) * 0.7 });
  dk += federReihe(T, linie(0.47, 0.93, 0.05, 1.02, 5), 6, { typen: schulter, L: 8.2, W: 4.8, winkel: (t) => richtung(0.47 - t * 0.42, 0.95) + 10, streu: 6, reihenfolge: (t) => t });
  s += vg(T, "fluegel", 3.4, rot(fw + teil(T, "deck", G(deckU), "#4e3420", dk)));
  /* Flanke: Brustseitenfedern decken die Flügelunterkante (der Flügel liegt in der „Tasche“), Schatten des Flügels */
  let fk = weich(T, G([[-12, -25], [-5, -31.6], [1.2, -38], [5, -44], [7.6, -50], [9.4, -55], [9.6, -50], [7, -42.4], [2.4, -35.6], [-5, -28.6], [-11.4, -23]]), "#0a0502", 0.3, 0.8);
  const flU = [...E.slice(0, 6).map(([x, y]) => [x - 0.6, y + 0.2]), ...E.slice(0, 6).reverse().map(([x, y]) => [x + 2.2, y + 1.2])];
  fk += federFeld(T, flU, { typen: brust, abst: 3.5, L: 5.8, W: 2.7, zeile: 0.6, winkel: (x, y) => 100 + (-38 - y) * -0.9, ueber: 0, streu: 18 });
  s += vg(T, "flanke", 1.2, rot(fk));

  /* ---- Kopf: Goldnacken (Lanzettfedern), dunkles Gesicht, Überaugenwulst, großes Auge ---- */
  const kopf = [[10, -80.4], [9.2, -81.6], [7, -82.9], [3.6, -84.3], [-0.4, -84.6], [-4, -83.6], [-6.8, -81.4], [-8.6, -78.2], [-10.2, -74], [-11.6, -69], [-12.8, -65], [-9.6, -65.8], [-4, -68.6], [2, -70.2], [6.8, -72], [9, -74], [9.8, -76.4], [10.2, -78.4]];
  const kG = verlauf(T, "kG", -7, -82, 7.5, -76, [[0, "#c8943c"], [0.38, "#a87430"], [0.66, "#4a3220"], [1, "#2a1a10"]]);
  let ki = "";
  ki += federFeld(T, [[3.4, -85.4], [-4.4, -85], [-9.4, -78.4], [-12, -70], [-13.8, -64], [-9, -65.4], [-3, -69.2], [1.2, -72.2], [2.6, -76], [3.6, -81]], {
    typen: gold, abst: 3.6, L: 6.8, W: 2.6, zeile: 0.46, winkel: (x, y) => 166 - (y + 85) * 3.4 + Math.max(0, x) * 2, gr: (x, y) => 0.5 + (y + 86) * 0.034, streu: 9 });
  if (F) {
    ki += striche(T, [[3.2, -84], [9, -82], [9.8, -79], [4.4, -79.4], [3, -81.6]], 24, (x, y) => 186 - (x - 6) * 2, 1.2, [["#1a1008", 1, 0.05, 0.5], ["#a07c50", 0.6, 0.045, 0.4]], { streu: 10 });   // Stirn
    ki += striche(T, [[2.4, -77.4], [9.6, -77.6], [9.6, -74], [5, -72.6], [2, -74.6]], 34, (x, y) => 168 + (y + 76) * 6, 1.1, [["#140c06", 1, 0.045, 0.5], ["#7a5a40", 0.5, 0.04, 0.35]], { streu: 12 });   // Wange
    ki += striche(T, [[8.8, -79.6], [10.6, -79.4], [10.4, -76.6], [8.6, -77]], 30, (x, y) => 192 + (y + 78) * 8, 0.8, [["#0a0604", 1, 0.045, 0.7]], { streu: 16 });   // Zügelborsten
  }
  ki += weich(T, G([[4, -79.6], [9.6, -79.8], [9.2, -78.2], [5, -78.4]]), "#000", 0.5, 0.35);   // Brauenschatten aufs Auge
  ki += weich(T, G([[3, -84.2], [-2, -85], [-6, -83], [-2, -82.4]]), "#ffe2a0", 0.25, 0.8);   // Licht auf dem Scheitel
  ki += weich(T, G([[1.6, -72.4], [8.4, -74], [9.8, -72], [4, -70]]), "#000", 0.35, 0.8);   // Kinn im Schatten
  let kp = teil(T, "kopf", G(kopf), kG, ki);
  /* Nackensaum: Lanzettspitzen fallen über Mantel und Schultern (kein „Kapuzenrand“) */
  kp += federReihe(T, [[-12.4, -64.6], [-9.2, -65.6], [-5.6, -67.6], [-2, -69], [1.6, -70.2]], 9, { typen: [goldD[0], goldD[0], gold[0]], L: 4.6, W: 1.5, winkel: (t) => 112 - t * 25, streu: 14, reihenfolge: (t) => -t, gr: (t) => 1 - t * 0.3 });
  Q = 20;
  kp += greifAuge(T, 7, -78.9, 1.26, { iris: "#c8902e", iris2: "#6e4010", pupille: 0.46, lid: "#1e1610", hoehle: 0.5, offen: 0.9 });
  /* Überaugenwulst: ein befiederter Schild steht über dem Auge vor („finsterer Blick“), Oberseite im Licht, darunter Schatten */
  const wulst = [[3.6, -79.6], [5, -81], [7.2, -81.7], [9.4, -81.4], [10.6, -80.5], [10.4, -79.8], [9, -79.8], [7.4, -79.95], [5.8, -79.7], [4.6, -79.2]];
  kp += weich(T, G([[4.6, -79.6], [7.2, -80.1], [9.6, -79.9], [9.4, -79.1], [7, -79.3], [5, -78.9]]), "#000", 0.6, 0.2);
  kp += fl(G(wulst), verlauf(T, "wulst", 7, -81.8, 7, -79.6, [[0, "#6a4a2c"], [0.45, "#3a2616"], [1, "#160e08"]]));
  if (F) kp += striche(T, wulst, 24, (x, y) => 190 - (x - 7) * 3, 0.9, [["#0e0804", 1, 0.05, 0.55], ["#b08a5c", 0.6, 0.045, 0.45]], { streu: 8 }) +
    zug(GO([[4.2, -80.6], [6.6, -81.5], [9.4, -81.3]]), "#d8b080", 0.14, 0.3, ` filter="${blur(T, 0.1)}"`);

  /* ---- Schnabel: Wachshaut gelb mit Nasenloch, Hornbasis blaugrau, Haken schwarz, Schnabelspalte bis unters Auge ---- */
  const schnO = [[11.6, -80.1], [13.4, -79.9], [14.9, -79.1], [16, -77.7], [16.6, -75.9], [16.6, -74.2], [16, -72.8, 1], [15.6, -73.8], [14.9, -74.8], [13.8, -75.5], [12.4, -76], [9.6, -76.6, 1], [10.4, -78.4]];
  const schnU = [[9.6, -76.3, 1], [12.4, -75.8], [14.6, -75], [15.2, -74.5], [14.6, -74], [12.6, -74.4], [10.4, -75.1]];
  let sn = teil(T, "schnU", G(schnU), verlauf(T, "hornU", 10, -76, 15.4, -73.6, [[0, "#d0a848"], [0.25, "#8a8c90"], [0.7, "#3e4046"], [1, "#16161a"]]));
  sn += teil(T, "schnO", G(schnO), verlauf(T, "horn", 11.5, -80, 16.4, -73, [[0, "#a4aab2"], [0.35, "#787e88"], [0.62, "#34363c"], [1, "#0c0c0e"]]),
    (F ? zug(GO([[12.4, -79.6], [14.2, -79.3], [15.6, -78.2], [16.3, -76.4], [16.4, -74.4]]), "#fff", 0.13, 0.55) +
      zug(GO([[12.6, -78.8], [14.4, -78.3], [15.6, -76.8]]), "#fff", 0.3, 0.12) : "") +
    weich(T, G([[11.4, -76.2], [14.6, -75.2], [16, -73.6], [14.4, -74.4], [11.6, -75.4]]), "#000", 0.35, 0.25));
  const wachs = [[9.8, -80.5], [11.9, -80.3], [12.3, -79.2], [12.3, -77.6], [11.8, -76.4], [10.4, -76.2], [9.4, -76.5], [9.4, -78.6]];
  sn += teil(T, "wachs", G(wachs), T.lg("wachs", [[0, "#ecca5a"], [0.5, "#d6a42c"], [1, "#94640e"]], 0.2, 0, 0.7, 1), F ? T.textur(G(wachs), T.rauschen("wP", { fx: 5, fy: 5, farbe: "#7a4a00", staerke: 2.2, okt: 2 }), 0, 0.22, box(wachs)) +
    weich(T, G([[11.6, -80.2], [12.5, -79], [12.4, -77], [11.8, -76.4], [11.7, -78]]), "#5a3a00", 0.4, 0.15) : "");
  sn += fl(`M${J(10.5, -78.25)}c${J(0.25, -0.42, 0.85, -0.6, 1.15, -0.4)}c${J(0.12, 0.22, -0.3, 0.6, -0.8, 0.66)}c${J(-0.3, 0.02, -0.45, -0.1, -0.35, -0.26)}Z`, "#1e1206");   // Nasenloch
  if (F) sn += zug(`M${J(10.55, -77.85)}c${J(0.3, 0.12, 0.72, 0.04, 0.95, -0.22)}`, "#fff0a0", 0.07, 0.6);
  sn += fl(G([[7.6, -76.4], [9.4, -77.1], [10.3, -76.6], [10, -75.9], [8.4, -75.9]]), T.lg("mund", [[0, "#e0b03a"], [1, "#9a6a14"]]));   // Mundwinkel
  sn += zug(GO([[8, -76.2], [9.8, -76.4], [12.4, -75.9], [14.6, -75], [15.2, -74.5]]), "#120c08", 0.12, 0.85);
  if (F) sn += striche(T, [[9.2, -80.4], [10.6, -80.2], [10.4, -77.4], [9.2, -77.2]], 26, 200, 0.8, [["#0e0804", 1, 0.045, 0.7]], { streu: 14 });   // Borsten über der Wachshaut
  Q = 10;
  s += vg(T, "kopf", 2.6, rot(krot(kp))) + vg(T, "schnabel", 0.8, rot(krot(sn)));
  /* Box und Kopf-Ausschnitt nach der Neigung */
  const dr = (p, a, c) => { const ca = Math.cos(rad(a)), sa = Math.sin(rad(a)), x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * ca - y * sa, c[1] + x * sa + y * ca]; };
  const kpk = (p) => dr(dr(p, KDREH, KPIV), DREH, PIV);
  const ex = [...[[16.6, -74.2], [16, -72.8], [-0.4, -84.6], [3.6, -84.3], [-4, -83.6]].map(kpk), ...[[-22.8, -13.4], [-24.4, -14.6], [-21, -15.8], [15.4, -56.6]].map((p) => dr(p, DREH, PIV)), [-21.4, 0], [18, 0]];
  const bx = box(ex), kb = box([[-6, -85], [17, -85], [17, -70], [-6, -70]].map(kpk));
  return { svg: s, box: [bx[0] - 0.3, bx[1] - 0.3, bx[2] + 0.2, 0], fuesse: [-17, -8, 2, 12], kopf: kb };
}

module.exports = [
  { id: "steinadler", de: "der Adler", syl: "AD-ler", it: "l'aquila", itSyl: "A-qui-la", en: "golden eagle",
    gruppe: "Greifvögel und Eulen", lebensraum: "Gebirge", laenge: 0.5, hoehe: 0.85, zeichne: steinadler },
];
