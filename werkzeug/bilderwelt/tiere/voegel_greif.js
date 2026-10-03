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
    T.def(`<filter id="${id}" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">` +
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

