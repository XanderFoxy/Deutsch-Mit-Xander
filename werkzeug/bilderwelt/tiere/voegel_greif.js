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

/* Zeichnung im Gefieder: Querbinden (flache Winkel/Bögen quer zur Federrichtung), Tropfen- oder Schaftflecken.
   poly ungeglättet, winkel = Federrichtung (Grad oder f), o = { abst (Reihen), dx (in der Reihe), lang, dick, farbe, op,
   art: "binde" | "tropfen", bogen, sz (Anteil in der Szene), dichte(x, y) 0..1 } */
function muster(T, poly, winkel, o) {
  const [x0, y0, x1, y1] = box(poly), wf = typeof winkel === "function" ? winkel : () => winkel;
  const f = T.fein ? 1 : (o.sz || 0);
  if (!f) return "";
  const ab = o.abst / Math.sqrt(f), dxx = (o.dx || o.lang * 1.3) / Math.sqrt(f);
  let d = "", j = 0;
  for (let y = y0; y <= y1; y += ab, j++)
    for (let x = x0 + (j % 2) * dxx * 0.5; x <= x1; x += dxx) {
      const px = x + (T.rnd() - 0.5) * dxx * 0.35, py = y + (T.rnd() - 0.5) * ab * 0.3;
      if (!inPoly(px, py, poly)) continue;
      if (o.dichte && T.rnd() > o.dichte(px, py)) continue;
      const a = rad(wf(px, py)), u = [Math.cos(a), Math.sin(a)], q = [-u[1], u[0]], L = o.lang * (0.7 + T.rnd() * 0.6);
      if (o.art === "tropfen") { d += "M" + J(px - u[0] * L / 2, py - u[1] * L / 2) + "l" + J(u[0] * L, u[1] * L); continue; }
      const b = (o.bogen != null ? o.bogen : 0.35) * L;
      d += "M" + J(px - q[0] * L / 2, py - q[1] * L / 2) + "q" + J(q[0] * L / 2 + u[0] * b, q[1] * L / 2 + u[1] * b, q[0] * L, q[1] * L);
    }
  return zug(d, o.farbe, o.dick, o.op, o.art === "tropfen" ? "" : ' stroke-linecap="butt"');
}

/* Baumstumpf / Pfahl / Treibholz: Oberseite als Ellipse (leicht von oben), Rinde oder blankes Holz mit Fasern, Jahresringe.
   o = { x0, x1, oben (y der Oberkante), holz, rinde (null = blank), dunkel, ringe, moos } */
function stumpf(T, n, o) {
  const { x0, x1 } = o, yo = o.oben, mx = (x0 + x1) / 2, rx = (x1 - x0) / 2, ry = rx * 0.17;
  const um = [[x0 - 1.2, 0, 1], [x0 - 0.4, -2], [x0, -6], [x0 + 0.1, yo + ry * 0.2], [mx - rx * 0.6, yo + ry * 0.85], [mx, yo + ry], [mx + rx * 0.6, yo + ry * 0.85], [x1 - 0.1, yo + ry * 0.2], [x1 + 0.2, -6], [x1 + 0.8, -2], [x1 + 1.8, 0, 1]];
  const d = G(um);
  const rinde = o.rinde || o.holz;
  let inn = "";
  if (T.fein) {
    /* Fasern / Rindenfurchen senkrecht, leicht wellig */
    let fu = "", li = "";
    for (let i = 0; i < 16; i++) {
      const x = x0 + (x1 - x0) * (i + 0.3 + T.rnd() * 0.4) / 16, w = (T.rnd() - 0.5) * 1.2;
      const p = [[x, yo + ry * 0.8], [x + w, (yo) / 2], [x - w * 0.5, -1]];
      fu += GO(p); if (i % 2) li += GO(p.map(([a, b]) => [a - 0.35, b]));
    }
    inn += zug(fu, o.dunkel, o.rinde ? 0.55 : 0.2, o.rinde ? 0.55 : 0.45) + zug(li, "#fff", o.rinde ? 0.25 : 0.12, 0.2);
    inn += T.textur(d, T.rauschen(n + "f", { fx: 2.4, fy: 0.12, farbe: o.dunkel, staerke: 2.4, okt: 2 }), 90, 0.35, [x0 - 2, yo - 3, x1 + 2, 1]);
  }
  inn += fl(d, verlauf(T, n + "q", x0, 0, x1, 0, [[0, "#fff", 0.16], [0.35, "#fff", 0], [0.7, "#000", 0.22], [1, "#000", 0.5]]));
  if (o.moos) inn += weich(T, G(o.moos), "#5a6a2a", 0.85, 0.3, true) + (T.fein ? striche(T, o.moos, 60, -90, 0.5, [["#8a9a40", 1, 0.08, 0.7], ["#3a4a18", 1, 0.08, 0.6]], { streu: 60 }) : "");
  inn += weich(T, `M${J(x0 - 2, -1.4)}L${J(x1 + 3, -1.4)} ${J(x1 + 3, 1)} ${J(x0 - 2, 1)}Z`, "#000", 0.45, 0.8);
  let s = teil(T, n, d, verlauf(T, n + "g", 0, yo, 0, 0, [[0, rinde], [1, mische(rinde, "#000", 0.25)]]), inn);
  /* Schnittfläche mit Jahresringen und Trockenrissen */
  const top = `M${J(x0, yo)}a${J(rx, ry)} 0 1 0 ${J(2 * rx, 0)}a${J(rx, ry)} 0 1 0 ${J(-2 * rx, 0)}Z`;
  let ti = "";
  if (T.fein && o.ringe !== false) {
    let r = "";
    for (let i = 1; i < 7; i++) { const k = i / 7 * (0.9 + T.rnd() * 0.08); r += `M${J(mx + 1 - rx * k, yo)}a${J(rx * k, ry * k)} 0 1 0 ${J(2 * rx * k, 0)}a${J(rx * k, ry * k)} 0 1 0 ${J(-2 * rx * k, 0)}Z`; }
    ti += zug(r, o.dunkel, 0.12, 0.45);
    ti += zug(`M${J(mx + 1, yo)}l${J(-rx * 0.7, ry * 0.3)}M${J(mx + 1, yo)}l${J(rx * 0.5, ry * 0.6)}M${J(mx + 1, yo)}l${J(rx * 0.3, -ry * 0.7)}`, "#1a120a", 0.2, 0.6);
  }
  s += teil(T, n + "o", top, verlauf(T, n + "og", x0, yo - ry, x1, yo + ry, [[0, mische(o.holz, "#fff", 0.25)], [1, mische(o.holz, "#000", 0.1)]]), ti);
  return s;
}

/* =====================================================================
   TAGGREIFE (Steinadler, Weißkopfseeadler, Wanderfalke, Mäusebussard, Gänsegeier) – EIN Bauplan, je Art eigene
   Maße, Farben, Zeichnung, Kopf und Schnabel. Gezeichnet in „Adler-Einheiten“ (Steinadler = cm), am Ende auf die
   echte Größe skaliert (P.k). Haltung sitzend, Körper ca. 60° aufgerichtet, Kopf im Profil.
   ===================================================================== */
function greif(T, P) {
  Q = 10;
  const F = T.fein;
  let s = "";
  const DREH = P.dreh != null ? P.dreh : 9, PIV = [3.5, -16.5], KDREH = P.kdreh != null ? P.kdreh : -8, KPIV = [0, -72];
  const rot = (inh) => `<g transform="rotate(${DREH} ${PIV[0]} ${PIV[1]})">${inh}</g>`;
  const kk = P.kopfK || 1;   // Kopfgröße relativ (um den Hals)
  const krot = (inh) => `<g transform="rotate(${KDREH} ${KPIV[0]} ${KPIV[1]})${kk !== 1 ? ` translate(${N(KPIV[0] * (1 - kk))} ${N(KPIV[1] * (1 - kk) + (P.kopfY || 0))}) scale(${kk})` : (P.kopfY ? ` translate(0 ${P.kopfY})` : "")}">${inh}</g>`;
  const mk = (n, liste, form, extra = {}) => liste.map(([c, sa, m], i) => vorlage(T, n + i, c, sa, form, Object.assign({}, extra, m ? { marke: m } : {})));
  const brust = mk("b", P.brust, "lanz", { weich: 1 }), hose = mk("h", P.hose, "flaum", { weich: 1 });
  const nacken = mk("g", P.nacken, P.nackenForm || "spitz", { weich: 1 });
  const decke = mk("d", P.decke, "rund", { schaft: P.schaft || "#8a6a4a" }), mittel = mk("m", P.mittel, "rund", { schaft: P.schaft || "#9a7a52" });
  const schulter = mk("s", P.schulter, "breit", { schaft: P.schaft || "#7a5e44" });

  /* ---- Schwanz: drei sichtbare Steuerfedern mit Binden und Endsaum ---- */
  const SW = P.schwanz;
  let sw = "";
  const sl = SW.lang || 1;
  [[[-10.6, -38], [-20.2, -13.2]], [[-11.6, -37.6], [-21.6, -12.7]], [[-12.8, -37], [-22.8, -13.4]]].forEach(([b, e0], i) => {
    const e = lerp(b, e0, sl);
    sw += schwinge(T, [b, lerp(b, e, 0.5), [e[0] + 0.2, e[1]]], 4.6 - i * 0.1, 3.6 - i * 0.1, { quer: SW.quer, schaft: [SW.schaft || "#b0a088", 0.12, 0.45],
      binden: SW.binden, saum: SW.saum, bindenBogen: 0.3 });
  });
  if (SW.endbinde && F) { const t = lerp([-12, -37], [-22, -13], sl); sw += fl(G([[t[0] + 3.4, t[1] - 4.2], [t[0] - 1.8, t[1] - 4], [t[0] - 2.4, t[1] - 1.2], [t[0] - 0.8, t[1] + 0.4], [t[0] + 1.6, t[1] + 0.8], [t[0] + 3.4, t[1] - 0.6]]), SW.endbinde, 0.55, ` filter="${blur(T, 0.4)}"`); }
  s += vg(T, "schwanz", 1.4, rot(sw));

  /* ---- Sitzplatz ---- */
  s += P.sitz(T);

  /* ---- Fänge ---- */
  const ZF = P.zehen;
  const fuss = (dx, dy, fern) => {
    const o = Object.assign({}, ZF, fern ? { hell: mische(ZF.hell, "#000", 0.4), mittel: mische(ZF.mittel, "#000", 0.45), dunkel: mische(ZF.dunkel, "#000", 0.5), fern: true } : {});
    const P2 = (x, y) => [x + dx, y + dy], m = (k) => Object.assign({}, o, k), kz = P.krallenK || 1;
    let f = "";
    if (P.lauf) f += zehe(T, [P2(1.6, -28), P2(2.6, -22.4), P2(3.4, -17.8)], 3, 2.6, m({ n: "l" + dx, schilde: 7 }));   // nackter Lauf mit Gürtelschildern vorn
    if (!fern) f += zehe(T, [P2(3.8, -17.6), P2(6.4, -17.4), P2(8.4, -17)], 2, 1.6, m({ kralle: [3.6 * kz, 1.2, 130], n: "i" + dx, hell: mische(o.hell, "#000", 0.3), mittel: mische(o.mittel, "#000", 0.3), fern: true }));
    f += zehe(T, [P2(2.6, -16.9), P2(0.4, -16.6), P2(-1.4, -16.1)], 2.3, 1.9, m({ kralle: [5.2 * kz, 1.5, -118], n: "h" + dx, krAnsatz: -6 }));
    f += zehe(T, [P2(4.2, -17), P2(7, -16.8), P2(9.6, -16.3), P2(11.4, -15.5)], 2.4, 1.85, m({ kralle: [4.4 * kz, 1.35, 150], n: "m" + dx }));
    if (!fern) f += zehe(T, [P2(3.6, -16.2), P2(5.6, -15.2), P2(7.2, -14.2)], 2.3, 1.8, m({ kralle: [3.8 * kz, 1.3, 145], n: "a" + dx }));
    return f;
  };
  s += vg(T, "fussF", 0.5, fuss(-3.4, -0.5, true));

  /* ---- ferne Hose, Unterschwanzdecken ---- */
  const lauf = !!P.lauf, hy = lauf ? -25 : -17.4;
  const hoseFU = lauf ? [[-7, -37], [-2.6, -40], [-1.6, -31], [-2.6, -26.4], [-5, -25.2], [-8, -27], [-8.8, -31]] : [[-7, -37], [-2.6, -40], [-1.6, -30], [-3.2, -22], [-4.8, -17.6], [-7.6, -17.4], [-8.6, -24], [-8.8, -31]];
  s += vg(T, "hoseF", 2, rot(teil(T, "hoseF", G(hoseFU), mische(P.hoseFarbe, "#000", 0.35), federFeld(T, hoseFU, { typen: hose, abst: 5, L: 7, W: 2.4, winkel: () => 95, streu: 16 }) + fl(G(hoseFU), "#1a1008", 0.35))));
  const usdU = [[-12.8, -38.4], [-6, -36], [-4.6, -31], [-7, -27.6], [-11, -27.4], [-14.4, -31.6]];
  s += vg(T, "usd", 2, rot(teil(T, "usd", G(usdU), P.usd || P.hoseFarbe, federFeld(T, usdU, { typen: P.usdF ? mk("u", P.usdF, "flaum", { weich: 1 }) : hose, abst: 4.2, L: 6, W: 2.4, winkel: () => 118, streu: 16 }) + (P.usdMuster ? P.usdMuster(T, usdU) : ""))));

  /* ---- Rumpf ---- */
  const rumpf = P.rumpf || [[-7.8, -78.6], [-10.6, -72.4], [-12.4, -65.6], [-13.4, -57.6], [-13.4, -49], [-12, -41], [-9.4, -35.4], [-5.6, -32.4], [-0.6, -31.6], [5, -33.6], [9.6, -38], [12.8, -44], [14.8, -50.4], [15.4, -56.6], [14.6, -62.4], [12.6, -67.2], [10.6, -70.6], [9.6, -73.6], [6, -77.6], [0, -80]];
  const brustU = [[-6, -70.5], [10.4, -71.6], [14.8, -62], [15.4, -52], [13.2, -43], [9.4, -36.6], [4.2, -32.6], [-3.4, -32.2], [0.8, -37], [4.6, -43], [7.2, -49.4], [8.6, -55.5], [8.6, -61]];
  const brW = (x, y) => 94 + (y + 50) * 0.5 - (x - 9) * 1.2;
  let ri = P.rumpfUnter ? P.rumpfUnter(T, brustU) : "";
  ri += federFeld(T, brustU, { typen: brust, abst: 4.8, L: 7, W: 3.7, zeile: 0.55, winkel: brW, gr: (x, y) => 0.72 + (y + 72) * 0.011, streu: 14 });
  if (P.brustMuster) ri += P.brustMuster(T, brustU, brW);
  if (F) ri += striche(T, brustU, 64, brW, 2.4, P.brustStriche || [["#1a0e06", 1, 0.05, 0.45], ["#8a6444", 0.7, 0.045, 0.35]], { streu: 12, krumm: 0.12 });
  ri += weich(T, G([[-4, -72], [6, -73], [10.4, -70], [4, -66.4], [-4, -66]]), "#000", 0.35, 1.2);   // Schlagschatten des Kopfes
  ri += weich(T, G([[-2, -35], [6, -34.6], [10.6, -38.6], [4, -31.6], [-3, -31.4]]), "#e8c898", 0.14, 0.9);   // Bodenreflex
  s += vg(T, "rumpf", 6.5, rot(teil(T, "rumpf", G(rumpf), P.rumpfFarbe, ri)));

  /* ---- nahe Hose ---- */
  const hoseN = lauf ? [[9.8, -41], [11.2, -35], [10.6, -29.6], [8.6, -25.6], [6, -24.2], [3.4, -24.6], [0.6, -24.6], [-1.8, -26.2], [-3.8, -30.4], [-4, -35.8], [-1.4, -40], [4.2, -42]]
    : [[9.8, -41], [11.2, -35], [10.8, -28.6], [9.4, -23.2], [7.6, -19.4], [6.4, -17.2], [5, -16.2], [3.4, -16.4], [1.6, -16.2], [0.2, -17], [-1.4, -19.8], [-3.2, -24.8], [-4.2, -30.4], [-4, -35.8], [-1.4, -40], [4.2, -42]];
  const hoW = (x, y) => 90 - (x - 3.5) * 1.6 + (y + 30) * 0.4;
  let hi = federFeld(T, hoseN, { typen: hose, abst: 4.8, L: 9, W: 3.3, zeile: 0.46, winkel: hoW, gr: (x, y) => 0.75 + (y + 42) * 0.012, streu: 20 });
  if (P.hoseMuster) hi += P.hoseMuster(T, hoseN, hoW);
  if (F) hi += striche(T, hoseN, 54, hoW, 2.8, P.hoseStriche || [["#2a1606", 1, 0.05, 0.4], ["#c49a68", 0.8, 0.045, 0.35]], { streu: 18, krumm: 0.25 });
  hi += weich(T, G([[-4, -43], [11.4, -43], [11, -37], [3, -35.4], [-4, -37]]), "#140a04", 0.5, 1.1);
  let hs = teil(T, "hose", G(hoseN), P.hoseFarbe, hi);
  hs += federReihe(T, lauf ? [[-1.6, -25.8], [1.4, -24.6], [4.4, -24.4], [7.6, -25.2]] : [[0.4, -17.4], [2.4, -16.9], [4.4, -16.8], [6.4, -17.6]], 7, { typen: hose, L: 3.4, W: 1.6, winkel: (t) => 98 - t * 26, streu: 20, reihenfolge: (t) => t });
  s += vg(T, "hose", 3, rot(hs));

  /* ---- nahe Fänge ---- */
  s += vg(T, "fuss", 0.5, fuss(0, 0, false));

  /* ---- Flügel (gefaltet) ---- */
  const E = [[8.6, -61], [8.6, -55.5], [7.2, -49.4], [4.6, -43], [0.8, -37], [-4, -31.4], [-9.6, -25.6], [-15.4, -20.4], [-21, -15.8]];
  const B = [[-6, -70], [-10.6, -66], [-12.8, -60], [-13.8, -52], [-14.6, -44], [-15.8, -36], [-17.6, -28], [-19.4, -21], [-21, -15.8]];
  const { W, linie, richtung } = fluegelRahmen(E, B);
  let fw = "";
  const nH = F ? 5 : 3, nA = F ? 5 : 3;
  for (let k = 0; k < nH; k++) {   // Handschwingen: äußere (längste) zuerst, innere darüber; Stufen an der Spitze
    const kx = k * 6.5 / nH;
    fw += schwinge(T, linie(0.16 + kx * 0.02, 0.05 + kx * 0.05, 1 - kx * 0.042, 0.28 + kx * 0.05), 4.8, 3.4, { quer: P.quH, schaft: [P.remSchaft || "#9a8a78", 0.13, 0.45], binden: P.handBinden, saum: P.handSaum });
  }
  for (let j = 0; j < nA; j++) {   // Armschwingen
    const jj = j * 7.5 / nA;
    fw += schwinge(T, linie(0.18 + jj * 0.025, 0.28 + jj * 0.06, 0.66 - jj * 0.006, 0.36 + jj * 0.07), 5.6, 5, { quer: P.quA, schaft: [P.remSchaft || "#a8987e", 0.13, 0.4], binden: P.armBinden, saum: P.armSaum });
  }
  for (let i = 0; i < 2; i++)   // Schirmfedern
    fw += schwinge(T, linie(0.3, 0.84 + i * 0.05, 0.75 - i * 0.07, 0.84 + i * 0.07), 6.2, 5.6, { quer: P.quA, schaft: [P.remSchaft || "#a8987e", 0.13, 0.4], saum: P.schirmSaum || ["#a8906c", 0.55, 0.22], binden: P.schirmBinden });
  const deckU = [...E.slice(0, 5), ...linie(0.5, 0.05, 0.43, 1, 3), ...B.slice(0, 4).reverse()];
  let dk = "";
  dk += federReihe(T, linie(0.3, 0.04, 0.24, 0.3, 3), 4, { typen: schulter, L: 7.2, W: 3.4, winkel: (t) => richtung(0.28, t * 0.3) + 4, streu: 4 });
  dk += federReihe(T, linie(0.42, 0.28, 0.38, 0.94, 4), 7, { typen: decke, L: 6.6, W: 3.8, winkel: (t) => richtung(0.38, 0.3 + t * 0.6) + 6, streu: 5 });
  dk += federReihe(T, linie(0.31, 0.26, 0.28, 0.96, 4), 8, { typen: mittel, L: 4.8, W: 3.2, winkel: (t) => richtung(0.28, 0.3 + t * 0.6) + 8, streu: 6 });
  dk += federFeld(T, [W(0.02, 0.12), W(0.25, 0.2), W(0.25, 0.99), W(0.02, 1)], { typen: [decke[0], mittel[mittel.length - 1], decke[decke.length - 1]], abst: 3.9, L: 4.6, W: 3.4, zeile: 0.6, winkel: (x, y) => 118 - (y + 60) * 0.7 });
  dk += federReihe(T, linie(0.47, 0.93, 0.05, 1.02, 5), 6, { typen: schulter, L: 8.2, W: 4.8, winkel: (t) => richtung(0.47 - t * 0.42, 0.95) + 10, streu: 6, reihenfolge: (t) => t });
  s += vg(T, "fluegel", 3.4, rot(fw + teil(T, "deck", G(deckU), P.deckFarbe, dk + (P.deckMuster ? P.deckMuster(T, deckU) : ""))));
  /* Flanke: Brustseitenfedern decken die Flügelunterkante, Schatten des Flügels */
  let fk = weich(T, G([[-12, -25], [-5, -31.6], [1.2, -38], [5, -44], [7.6, -50], [9.4, -55], [9.6, -50], [7, -42.4], [2.4, -35.6], [-5, -28.6], [-11.4, -23]]), "#0a0502", 0.3, 0.8);
  const flU = [...E.slice(0, 6).map(([x, y]) => [x - 0.6, y + 0.2]), ...E.slice(0, 6).reverse().map(([x, y]) => [x + 2.2, y + 1.2])];
  fk += federFeld(T, flU, { typen: P.flanke ? mk("fl", P.flanke, "lanz", { weich: 1 }) : brust, abst: 3.5, L: 5.8, W: 2.7, zeile: 0.6, winkel: (x, y) => 100 + (-38 - y) * -0.9, ueber: 0, streu: 18 });
  s += vg(T, "flanke", 1.2, rot(fk));

  /* ---- Kopf ---- */
  let kp = "", sn = "";
  if (P.kopf) [kp, sn] = P.kopf(T, { mk, nacken });
  else {
    const kopf = [[10, -80.4], [9.2, -81.6], [7, -82.9], [3.6, -84.3], [-0.4, -84.6], [-4, -83.6], [-6.8, -81.4], [-8.6, -78.2], [-10.2, -74], [-11.6, -69], [-12.8, -65], [-9.6, -65.8], [-4, -68.6], [2, -70.2], [6.8, -72], [9, -74], [9.8, -76.4], [10.2, -78.4]];
    let ki = federFeld(T, [[3.4, -85.4], [-4.4, -85], [-9.4, -78.4], [-12, -70], [-13.8, -64], [-9, -65.4], [-3, -69.2], [1.2, -72.2], [2.6, -76], [3.6, -81]], {
      typen: nacken, abst: 3.6, L: 6.8, W: 2.6, zeile: 0.46, winkel: (x, y) => 166 - (y + 85) * 3.4 + Math.max(0, x) * 2, gr: (x, y) => 0.5 + (y + 86) * 0.034, streu: 9 });
    if (P.kopfMuster) ki += P.kopfMuster(T);
    if (F) {
      const kf = P.kopfStriche || [["#1a1008", 1, 0.05, 0.5], ["#a07c50", 0.6, 0.045, 0.4]];
      ki += striche(T, [[3.2, -84], [9, -82], [9.8, -79], [4.4, -79.4], [3, -81.6]], 24, (x, y) => 186 - (x - 6) * 2, 1.2, kf, { streu: 10 });   // Stirn
      ki += striche(T, [[2.4, -77.4], [9.6, -77.6], [9.6, -74], [5, -72.6], [2, -74.6]], 34, (x, y) => 168 + (y + 76) * 6, 1.1, P.wangeStriche || kf, { streu: 12 });   // Wange
      ki += striche(T, [[-6, -82], [3, -84], [2, -76], [-4, -72], [-9, -74]], 40, (x, y) => 172 - (y + 78) * 3, 1.4, kf, { streu: 10 });   // Hinterkopf
      ki += striche(T, [[8.8, -79.6], [10.6, -79.4], [10.4, -76.6], [8.6, -77]], 30, (x, y) => 192 + (y + 78) * 8, 0.8, [[P.borsten || "#0a0604", 1, 0.045, 0.7]], { streu: 16 });   // Zügelborsten
    }
    ki += weich(T, G([[4, -79.6], [9.6, -79.8], [9.2, -78.2], [5, -78.4]]), "#000", 0.5 * (P.wulst != null ? P.wulst : 1), 0.35);
    ki += weich(T, G([[3, -84.2], [-2, -85], [-6, -83], [-2, -82.4]]), "#fff2d0", 0.25, 0.8);   // Licht auf dem Scheitel
    ki += weich(T, G([[1.6, -72.4], [8.4, -74], [9.8, -72], [4, -70]]), "#000", 0.35, 0.8);   // Kinn im Schatten
    kp = teil(T, "kopf", G(kopf), verlauf(T, "kG", -7, -82, 7.5, -76, P.kG), ki);
    kp += federReihe(T, [[-12.4, -64.6], [-9.2, -65.6], [-5.6, -67.6], [-2, -69], [1.6, -70.2]], 9, { typen: nacken, L: 4.6, W: 1.5, winkel: (t) => 112 - t * 25, streu: 14, reihenfolge: (t) => -t, gr: (t) => 1 - t * 0.3 });
    Q = 20;
    kp += greifAuge(T, 7, -78.9, 1.26 * (P.augeK || 1), Object.assign({ pupille: 0.46, lid: "#1e1610", hoehle: 0.5, offen: 0.9 }, P.auge));
    if (P.wulst !== 0) {
      const wu = P.wulst != null ? P.wulst : 1, wy = (1 - wu) * 0.7;
      const wulst = [[3.6, -79.6 - wy], [5, -81 - wy], [7.2, -81.7 - wy], [9.4, -81.4 - wy], [10.6, -80.5 - wy], [10.4, -79.8 - wy], [9, -79.8 - wy], [7.4, -79.95 - wy], [5.8, -79.7 - wy], [4.6, -79.2 - wy]];
      kp += weich(T, G([[4.6, -79.6], [7.2, -80.1], [9.6, -79.9], [9.4, -79.1], [7, -79.3], [5, -78.9]]), "#000", 0.6 * wu, 0.2);
      kp += fl(G(wulst), verlauf(T, "wulst", 7, -81.8, 7, -79.6, P.wulstFarbe || [[0, "#6a4a2c"], [0.45, "#3a2616"], [1, "#160e08"]]));
      if (F) kp += striche(T, wulst, 24, (x, y) => 190 - (x - 7) * 3, 0.9, P.wulstStriche || [["#0e0804", 1, 0.05, 0.55], ["#b08a5c", 0.6, 0.045, 0.45]], { streu: 8 }) +
        zug(GO([[4.2, -80.6 - wy], [6.6, -81.5 - wy], [9.4, -81.3 - wy]]), "#f0d0a0", 0.14, 0.3, ` filter="${blur(T, 0.1)}"`);
    }
    sn = schnabel(T, P.schnabel || {});
    Q = 10;
  }
  s += vg(T, "kopf", 2.6, rot(krot(kp))) + vg(T, "schnabel", 0.8, rot(krot(sn)));
  /* Box, Füße und Kopf-Ausschnitt nach Neigung und Maßstab */
  const dr = (p, a, c) => { const ca = Math.cos(rad(a)), sa = Math.sin(rad(a)), x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * ca - y * sa, c[1] + x * sa + y * ca]; };
  const kpk = (p) => dr(dr([KPIV[0] + (p[0] - KPIV[0]) * kk, KPIV[1] + (p[1] - KPIV[1]) * kk + (P.kopfY || 0)], KDREH, KPIV), DREH, PIV);
  const sk = (P.schnabel && P.schnabel.k) || 1, sb = (p) => [10 + (p[0] - 10) * sk, -78 + (p[1] + 78) * sk];
  const ex = [...[[16.6, -74.2], [16, -72.8], [16.6, -76], [-0.4, -84.6], [3.6, -84.3], [-4, -83.6]].map((p) => (p[0] > 12 ? kpk(sb(p)) : kpk(p))), ...(P.boxExtra || []).map(kpk),
    ...[[-22.8, -13.4], [-24.4, -14.6], [-21, -15.8], [15.4, -56.6]].map((p) => dr(p[1] > -20 ? lerp([-12, -37], p, sl) : p, DREH, PIV)), ...P.sitzBox];
  const bx = box(ex), kb = box([[-6, -86], [17 * sk + 10 * (1 - sk) + 1, -86], [17, -70], [-6, -70]].map(kpk));
  const k = P.k;
  return { svg: k === 1 ? s : `<g transform="scale(${k})">${s}</g>`, box: [bx[0] - 0.3, bx[1] - 0.3, bx[2] + 0.2, 0].map((v) => v * k), fuesse: P.fuesse.map((v) => v * k), kopf: kb.map((v) => v * k) };
}

/* Greifvogelschnabel im Profil (Adler-Einheiten, Kopf-Koordinaten): Wachshaut mit Nasenloch, Oberschnabel mit Haken,
   Unterschnabel, Mundwinkel, Schnabelspalte; o = { k (Größe), horn: stops Oberschnabel, hornU, wachs: stops, zahn (Falken-
   „Zahn“), nasenHoecker (Falke), mund } */
function schnabel(T, o) {
  const F = T.fein, k = o.k || 1, S = (pts) => pts.map(([x, y, h]) => (h ? [10 + (x - 10) * k, -78 + (y + 78) * k, 1] : [10 + (x - 10) * k, -78 + (y + 78) * k]));
  const schnO = S(o.zahn ? [[11.6, -80.1], [13.4, -79.9], [14.9, -79.1], [16, -77.7], [16.6, -75.9], [16.6, -74.2], [16, -72.8, 1], [15.5, -73.9], [14.8, -74.6], [14.5, -74.2, 1], [14.1, -75.1], [13.2, -75.7], [12.2, -76], [9.6, -76.6, 1], [10.4, -78.4]]
    : [[11.6, -80.1], [13.4, -79.9], [14.9, -79.1], [16, -77.7], [16.6, -75.9], [16.6, -74.2], [16, -72.8, 1], [15.6, -73.8], [14.9, -74.8], [13.8, -75.5], [12.4, -76], [9.6, -76.6, 1], [10.4, -78.4]]);
  const schnU = S([[9.6, -76.3, 1], [12.4, -75.8], [14.6, -75], [15.2, -74.5], [14.6, -74], [12.6, -74.4], [10.4, -75.1]]);
  const B = (x0, y0, x1, y1) => { const a = S([[x0, y0], [x1, y1]]); return [a[0][0], a[0][1], a[1][0], a[1][1]]; };
  let sn = teil(T, "schnU", G(schnU), verlauf(T, "hornU", ...B(10, -76, 15.4, -73.6), o.hornU || [[0, "#d0a848"], [0.25, "#8a8c90"], [0.7, "#3e4046"], [1, "#16161a"]]));
  sn += teil(T, "schnO", G(schnO), verlauf(T, "horn", ...B(11.5, -80, 16.4, -73), o.horn || [[0, "#a4aab2"], [0.35, "#787e88"], [0.62, "#34363c"], [1, "#0c0c0e"]]),
    (F ? zug(GO(S([[12.4, -79.6], [14.2, -79.3], [15.6, -78.2], [16.3, -76.4], [16.4, -74.4]])), "#fff", 0.13 * k, 0.55) +
      zug(GO(S([[12.6, -78.8], [14.4, -78.3], [15.6, -76.8]])), "#fff", 0.3 * k, 0.12) : "") +
    weich(T, G(S([[11.4, -76.2], [14.6, -75.2], [16, -73.6], [14.4, -74.4], [11.6, -75.4]])), "#000", 0.35, 0.25));
  const wachs = S([[9.8, -80.5], [11.9, -80.3], [12.3, -79.2], [12.3, -77.6], [11.8, -76.4], [10.4, -76.2], [9.4, -76.5], [9.4, -78.6]]);
  const wst = o.wachs || [[0, "#ecca5a"], [0.5, "#d6a42c"], [1, "#94640e"]];
  sn += teil(T, "wachs", G(wachs), T.lg("wachs", wst, 0.2, 0, 0.7, 1), F ? T.textur(G(wachs), T.rauschen("wP", { fx: 5, fy: 5, farbe: "#000", staerke: 2.2, okt: 2 }), 0, 0.15, box(wachs)) +
    weich(T, G(S([[11.6, -80.2], [12.5, -79], [12.4, -77], [11.8, -76.4], [11.7, -78]])), "#000", 0.25, 0.15) : "");
  const nl = S([[10.5, -78.25]])[0];
  if (o.nasenHoecker) {   // Falke: rundes Nasenloch mit Knochenzapfen in der Mitte
    sn += `<circle cx="${N(nl[0] + 0.5 * k)}" cy="${N(nl[1] + 0.1 * k)}" r="${N(0.42 * k)}" fill="#1e1206"/><circle cx="${N(nl[0] + 0.55 * k)}" cy="${N(nl[1] + 0.12 * k)}" r="${N(0.17 * k)}" fill="${wst[1][1]}"/>`;
  } else {
    sn += fl(`M${J(nl[0], nl[1])}c${J(0.25 * k, -0.42 * k, 0.85 * k, -0.6 * k, 1.15 * k, -0.4 * k)}c${J(0.12 * k, 0.22 * k, -0.3 * k, 0.6 * k, -0.8 * k, 0.66 * k)}c${J(-0.3 * k, 0.02 * k, -0.45 * k, -0.1 * k, -0.35 * k, -0.26 * k)}Z`, "#1e1206");
    if (F) sn += zug(`M${J(nl[0] + 0.05 * k, nl[1] + 0.4 * k)}c${J(0.3 * k, 0.12 * k, 0.72 * k, 0.04 * k, 0.95 * k, -0.22 * k)}`, "#fff0c0", 0.07 * k, 0.6);
  }
  sn += fl(G(S([[7.6, -76.4], [9.4, -77.1], [10.3, -76.6], [10, -75.9], [8.4, -75.9]])), T.lg("mund", o.mund || [[0, "#e0b03a"], [1, "#9a6a14"]]));
  sn += zug(GO(S(o.zahn ? [[8, -76.2], [9.8, -76.4], [12.4, -75.9], [14.1, -75.1], [14.5, -74.3], [15.2, -74.5]] : [[8, -76.2], [9.8, -76.4], [12.4, -75.9], [14.6, -75], [15.2, -74.5]])), "#120c08", 0.12 * k, 0.85);
  if (F) sn += striche(T, S([[9.2, -80.4], [10.6, -80.2], [10.4, -77.4], [9.2, -77.2]]), 26, 200, 0.8 * k, [[o.borsten || "#0e0804", 1, 0.045, 0.7]], { streu: 14 });
  return sn;
}

/* Granitfels für die Adler-Einheiten (Oberkante bei y ≈ −15,5 unter den Fängen) */
function felsGranit(T, o = {}) {
  const felsU = [[-19.8, 0, 1], [-21.4, -3.4], [-20.6, -7.6, 1], [-17.4, -11.2], [-12.6, -13.8, 1], [-6, -15.1], [1, -15.6], [7.2, -15.4], [11.4, -14.2, 1], [14.6, -11.6], [16.2, -8.2, 1], [17.6, -3.6], [18, 0, 1]];
  return vg(T, "fels", 0.8, fels(T, "fels", felsU, Object.assign({
    hell: "#bab4aa", mittel: "#8e887e", dunkel: "#5a564f",
    oben: [[-17.4, -11.2], [-12.6, -13.8, 1], [-6, -15.1], [1, -15.6], [7.2, -15.4], [11.4, -14.2, 1], [9.6, -12.8], [3, -13.4, 1], [-4.6, -13], [-11.4, -11.8, 1], [-15.6, -9.6]],
    rechts: [[11.4, -14.2], [14.6, -11.6], [16.2, -8.2], [17.6, -3.6], [18, 0], [12.8, 0], [12.2, -4.4], [12.6, -8.6], [10.6, -12.2]],
    links: [[-21.4, -3.4], [-20.6, -7.6], [-17.4, -11.2], [-15.6, -9.6], [-16, -5.6], [-18, -1.6]],
    risse: [[[-4.6, -13], [-4, -9.6], [-5.2, -5.8], [-4.4, -1.4]], [[3, -13.4], [3.8, -10.4], [3.2, -7.6]], [[-11.4, -11.8], [-10.6, -8.4], [-11.6, -4.6]]],
    flechten: [[-10, -12.6, 1.1, "#b8bc94"], [9.4, -13.8, 0.6, "#d49a40"], [-17, -7.4, 0.9, "#c2c098"], [15, -6.4, 0.6, "#cfa048"], [0.6, -6, 1.2, "#aeb48c"]],
  }, o)));
}
const FELS_BOX = [[-21.4, 0], [18, 0]], FELS_FUESSE = [-17, -8, 2, 12];

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
   dunkelbraun; mittlere Flügeldecken mit helleren lohfarbenen Spitzen, Hosen und Unterschwanzdecken lohbraun.
   Läufe bis zu den Zehen befiedert („befiederte Läufe“, Echte Adler). Zehen gelb mit Querschildern; Mittelzehe
   ca. 7 cm, Krallen schwarz, stark gebogen, Hinterkralle 4,5–6,5 cm. Schwanz adult graubraun mit unregelmäßigen
   dunklen Binden und breiter dunkler Endbinde. Sitzend: Körper ca. 60° aufgerichtet, breite Brust, Kopf mit flachem
   Scheitel, Schwanz hängt fast senkrecht. */
const goldM = (k, o) => `<path d="M0 0Q.45-${k}.8 0Q.45 ${k} 0 0Z" fill="#3e2410" opacity="${o}"/>`;
const STEINADLER = {
  k: 1, sitz: (T) => felsGranit(T), sitzBox: FELS_BOX, fuesse: FELS_FUESSE,
  brust: [["#4a3020", "#5c402c"], ["#3e281a", "#523826"]], hose: [["#7a5230", "#966c44"], ["#684428", "#86603a"]], hoseFarbe: "#7a5230", usd: "#8a643a",
  nacken: [["#b88234", "#e6ba62", goldM(0.09, 0.4)], ["#c4903e", "#eec470", goldM(0.05, 0.3)], ["#a06e2c", "#d8aa56", goldM(0.12, 0.45)]],
  decke: [["#4e3420", "#6a4c30"], ["#45301e", "#604430"]], mittel: [["#5e4026", "#906a44"], ["#543822", "#7e5c3a"]], schulter: [["#422c1c", "#5e442c"]],
  rumpfFarbe: "#4a3020", deckFarbe: "#4e3420",
  quH: [[0, "#564638"], [1, "#160f0a"]], quA: [[0, "#625242"], [1, "#1a120c"]], armBinden: [4, "#8a8274", 0.2, 0.75, 0.4, 0.9],
  schwanz: { quer: [[0, "#7e705e"], [1, "#30261e"]], binden: [5, "#2a2018", 0.42, 0.95, 0.25, 0.86], saum: ["#c8b8a0", 0.6, 0.2], endbinde: "#1e1610" },
  zehen: { hell: "#f8dc70", mittel: "#e0aa2a", dunkel: "#8e5c0c", schilde: 6 },
  kG: [[0, "#c8943c"], [0.38, "#a87430"], [0.66, "#4a3220"], [1, "#2a1a10"]],
  auge: { iris: "#c8902e", iris2: "#6e4010" },
};
const steinadler = (T) => greif(T, STEINADLER);

/* =====================================================================
   WEISSKOPFSEEADLER
   ===================================================================== */
/* RECHERCHE Weißkopfseeadler (Haliaeetus leucocephalus) – aus Fachwissen (Wappenvogel der USA; im Deutschen „der
   Seeadler“ als Wort, gemeint ist der bekannteste Seeadler mit weißem Kopf): Länge 70–102 cm, Spannweite 180–230 cm,
   Gewicht 3–6,3 kg. Altvogel: Kopf, Hals und Schwanz (samt Ober- und Unterschwanzdecken) reinweiß, Körper und Flügel
   schokoladenbraun, Federn mit etwas hellerem Saum. Schnabel sehr groß und hoch (First 5–7 cm), ganz gelb, ebenso
   Wachshaut und Mundwinkel; Iris blassgelb (Jungvögel braun), kräftiger Überaugenwulst. Lauf nur oben befiedert, unten
   nackt und gelb (Unterschied zu den Echten Adlern!), Zehen gelb mit Spicula, Krallen schwarz, Hinterkralle bis 5 cm.
   Schwanz keilförmig gerundet, im Sitzen ragt er etwas über die Flügelspitzen hinaus. Sitzt gern auf Treibholz und
   abgestorbenen Bäumen am Wasser. */
const SEEADLER = {
  k: 1.05,
  sitz: (T) => vg(T, "holz", 2, stumpf(T, "holz", { x0: -12.6, x1: 15.4, oben: -16, holz: "#b8b0a2", dunkel: "#5a5248" })), sitzBox: [[-14, 0], [17.4, 0]], fuesse: [-11, -2, 8, 14],
  brust: [["#3a2416", "#4c3222"], ["#2e1e12", "#40291a"]], hose: [["#3c2618", "#523624"], ["#30200f", "#44301e"]], hoseFarbe: "#3a2618",
  usd: "#ece8e0", usdF: [["#e8e4dc", "#ffffff"], ["#dedad2", "#f8f6f0"]],
  nacken: [["#f0eee8", "#ffffff"], ["#e4e2dc", "#fbfaf6"], ["#d8d6ce", "#f4f2ec"]],
  decke: [["#3e2a1a", "#5e4430"], ["#36241a", "#523c2a"]], mittel: [["#432e1e", "#6a4e36"], ["#3a281a", "#5e4430"]], schulter: [["#36241a", "#4e3828"]],
  rumpfFarbe: "#3a2416", deckFarbe: "#3e2a1a", lauf: true,
  quH: [[0, "#4a3c30"], [1, "#120c08"]], quA: [[0, "#54443a"], [1, "#160f0b"]],
  schwanz: { quer: [[0, "#ffffff"], [1, "#c8c4bc"]], schaft: "#d8d4cc", saum: ["#ffffff", 0.5, 0.2], lang: 1.08 },
  zehen: { hell: "#ffe27a", mittel: "#eab83a", dunkel: "#9a6a10", schilde: 6 },
  kG: [[0, "#ffffff"], [0.45, "#f2f0ea"], [1, "#b4b0a8"]],
  kopfStriche: [["#9a968e", 1, 0.05, 0.35], ["#ffffff", 0.8, 0.045, 0.6]], borsten: "#8a8680",
  wulstFarbe: [[0, "#ffffff"], [0.45, "#e6e4dc"], [1, "#9a968c"]], wulstStriche: [["#8a867e", 1, 0.05, 0.4], ["#ffffff", 0.8, 0.045, 0.6]],
  auge: { iris: "#f4e08a", iris2: "#b8983a", pupille: 0.4, lid: "#4a4238" },
  schnabel: { k: 1.2, horn: [[0, "#ffe680"], [0.4, "#f4c838"], [0.8, "#dca020"], [1, "#a8700e"]], hornU: [[0, "#f6d860"], [0.5, "#e8b42c"], [1, "#a8700e"]], wachs: [[0, "#fff090"], [0.5, "#f2c840"], [1, "#b8860e"]], borsten: "#8a8680" },
};
const seeadler = (T) => greif(T, SEEADLER);

/* =====================================================================
   WANDERFALKE
   ===================================================================== */
/* RECHERCHE Wanderfalke (Falco peregrinus) – aus Fachwissen: Länge 34–50 cm (Männchen ca. 40, Weibchen ca. 48),
   Spannweite 80–120 cm, Gewicht 0,6–1,3 kg. Kompakt, breite Brust, spitze Flügel, im Sitzen reichen die
   Handschwingen fast bis zur Schwanzspitze. Altvogel: Oberseite schiefer-blaugrau mit dunkleren Querbinden, Bürzel
   heller grau; Kopfplatte, Nacken und Wange schwarz („Kapuze“) mit breitem schwarzem Bartstreif senkrecht unter dem
   Auge; Kehle und Wangenfleck weiß; Brust weiß bis lachsfarben-rahm mit kleinen Tropfenflecken, Bauch, Flanken und
   Hosen dicht schwarz quergebändert; Schwanz grau mit 6–8 dunklen Binden und hellem Endsaum. Auge sehr groß, dunkel-
   braun, nackter gelber Augenring; Schnabel kurz, stark gekrümmt, blaugrau mit dunkler Spitze und „Falkenzahn“
   (Hornzahn am Oberschnabel), rundes Nasenloch mit Knochenzapfen; Wachshaut gelb. Lauf nackt, gelb, Zehen lang. */
const fBinde = `<path d="M.36-.6h.11v1.2h-.11zM.66-.6h.09v1.2h-.09z" fill="#1a1e24" opacity=".5"/><path d="M.15 0L.95 0" stroke="#1a1e24" stroke-width=".06" opacity=".5"/>`;
const binden = (dicht, farbe, abst, lang, dick, op, sz = 0.35) => (T, poly, w) => muster(T, poly, w, { abst, lang, dick, farbe, op, bogen: 0.3, dichte: dicht, sz });
const FALKE = {
  k: 0.5, kopfK: 1.1,
  sitz: (T) => felsGranit(T, { hell: "#dcd6ca", mittel: "#b8b0a2", dunkel: "#7e7668", flechten: [[-10, -12.6, 1.1, "#c8c49c"], [-17, -7.4, 0.9, "#d0cca8"], [0.6, -6, 1.4, "#e0a848"], [12, -5, 0.8, "#c8c49c"]] }), sitzBox: FELS_BOX, fuesse: FELS_FUESSE,
  brust: [["#efe6d6", "#fbf6ee"], ["#e4d8c4", "#f4ecde"]], hose: [["#e6dcca", "#f6f0e4"], ["#dccfba", "#efe6d6"]], hoseFarbe: "#e2d6c2", usd: "#ebe2d2",
  rumpfFarbe: "#e6dac6", brustStriche: [["#9a8a72", 1, 0.05, 0.3], ["#ffffff", 0.8, 0.045, 0.55]], hoseStriche: [["#9a8a72", 1, 0.05, 0.3], ["#ffffff", 0.8, 0.045, 0.5]],
  brustMuster: (T, poly, w) => binden((x, y) => (y > -55 ? 1 : 0), "#22242a", 1.9, 2.4, 0.55, 0.85, 0.5)(T, poly, w) +
    muster(T, poly, w, { art: "tropfen", abst: 2.4, lang: 0.9, dick: 0.55, farbe: "#2a2a30", op: 0.75, dichte: (x, y) => (y <= -55 && y > -66 ? 0.8 : 0), sz: 0.4 }),
  hoseMuster: binden(null, "#22242a", 1.7, 2.2, 0.5, 0.85, 0.5),
  usdMuster: (T, poly) => binden(null, "#2a2c32", 1.8, 2, 0.4, 0.7)(T, poly, 110),
  nacken: [["#2a2e34", "#40464e"], ["#22262c", "#383e46"]],
  decke: [["#4e5864", "#8a94a0", fBinde], ["#444e5a", "#7a8490", fBinde]], mittel: [["#56606c", "#949ea8", fBinde], ["#4a5460", "#848e9a", fBinde]], schulter: [["#3e4650", "#6e7884", fBinde]],
  deckFarbe: "#4a525c", schaft: "#1e2228",
  quH: [[0, "#4a4e56"], [1, "#15171b"]], quA: [[0, "#5e6672"], [1, "#22262c"]], armBinden: [5, "#16181c", 0.4, 0.55, 0.25, 0.92], schirmBinden: [4, "#16181c", 0.4, 0.6, 0.25, 0.9], handSaum: ["#c8c4bc", 0.4, 0.15], remSchaft: "#2a2e34",
  schwanz: { quer: [[0, "#7e8894"], [1, "#3a4048"]], binden: [7, "#16181e", 0.55, 0.65, 0.1, 0.85], saum: ["#efe8da", 0.8, 0.28], endbinde: "#16181e", schaft: "#2a2e34" },
  lauf: true, zehen: { hell: "#ffe468", mittel: "#f0bc2a", dunkel: "#9a6a08", schilde: 7 }, krallenK: 0.9,
  kG: [[0, "#3c424a"], [0.5, "#2a2e34"], [1, "#16181c"]], kopfStriche: [["#0e1014", 1, 0.05, 0.5], ["#7a828c", 0.6, 0.045, 0.4]], borsten: "#0a0a0c",
  /* weißer Wangenfleck und Kehle, darüber der breite schwarze Bartstreif */
  kopfMuster: (T) => weich(T, G([[0.6, -76.6], [4.6, -77.2], [9.6, -76.8], [10.6, -73.8], [9.8, -70.4], [4, -69.2], [-0.6, -70.6], [-1.2, -73.6]]), "#f4eee2", 0.97, 0.3, true) +
    weich(T, G([[4.8, -79], [9, -78.6], [9.4, -75.6], [9, -72.6], [7.8, -70], [6, -70.2], [5.6, -73.4], [4.6, -76.4]]), "#16181c", 0.97, 0.3, true) +
    weich(T, G([[-2, -79], [3.4, -80], [4.4, -77], [1.4, -76.4], [-1.8, -75]]), "#16181c", 0.9, 0.4, true) +
    (T.fein ? striche(T, [[0.6, -76.2], [4.4, -76.6], [4.6, -71], [0, -71]], 30, 120, 0.9, [["#ffffff", 1, 0.05, 0.6], ["#9a948a", 0.6, 0.045, 0.35]], { streu: 16 }) : ""),
  wangeStriche: [["#0e1014", 1, 0.045, 0.4], ["#6a727c", 0.5, 0.04, 0.3]],
  wulst: 0.35, wulstFarbe: [[0, "#4a5058"], [0.45, "#2a2e34"], [1, "#101216"]], wulstStriche: [["#0a0a0c", 1, 0.05, 0.5], ["#8a929c", 0.6, 0.045, 0.4]],
  augeK: 1.15, auge: { iris: "#3a2414", iris2: "#100804", pupille: 0.52, ring: ["#f2c840", 0.36], lid: "#c89a20", hoehle: 0.3 },
  schnabel: { k: 0.82, zahn: true, nasenHoecker: true, horn: [[0, "#a4b0c0"], [0.4, "#6e7e94"], [0.75, "#2a3240"], [1, "#0c0e12"]], hornU: [[0, "#e8c858"], [0.3, "#8e9aaa"], [1, "#2a3038"]], wachs: [[0, "#ffe46a"], [0.5, "#f2c434"], [1, "#b8880e"]] },
};
const falke = (T) => greif(T, FALKE);

/* =====================================================================
   MÄUSEBUSSARD
   ===================================================================== */
/* RECHERCHE Mäusebussard (Buteo buteo) – aus Fachwissen: Länge 46–58 cm, Spannweite 110–140 cm, Gewicht 0,5–1,2 kg.
   Sehr variabel (hell bis fast schwarzbraun); häufigster Typ: Oberseite dunkelbraun mit helleren Federsäumen, Kopf
   rund, braun mit heller, gestrichelter Kehle; Brust oben braun gestrichelt, darunter ein helles, rahmweißes Brustband
   („U“), Bauch und Flanken braun quergebändert, Hosen braun gebändert. Schwanz graubraun mit 10–12 feinen dunklen
   Binden und breiterer dunkler Endbinde. Schnabel klein, dunkelgrau mit hellerer Basis, Wachshaut gelb; Auge dunkel-
   braun (Altvogel), schwacher Überaugenwulst; Lauf nackt, gelb (nur oben befiedert), Zehen gelb, Krallen schwarz.
   Sitzt gern aufrecht und rundlich auf Pfählen und Baumstümpfen am Feldrand. */
const BUSSARD = {
  k: 0.6, kopfK: 1.08,
  sitz: (T) => vg(T, "stumpf", 2, stumpf(T, "stumpf", { x0: -11.6, x1: 14.2, oben: -16, holz: "#b09470", rinde: "#5a4634", dunkel: "#2a1e14", moos: [[-11.6, -6], [-8, -8.6], [-5, -4], [-6, 0], [-11.8, 0]] })), sitzBox: [[-13, 0], [16.2, 0]], fuesse: [-10, -2, 7, 13],
  brust: [["#6a4a2e", "#8a6a48"], ["#5a3e26", "#7a5a3c"]], hose: [["#6e5034", "#9a7a56"], ["#5e422a", "#86684a"]], hoseFarbe: "#6a4c30", usd: "#d8c8aa", usdF: [["#d0c0a0", "#efe4cc"]],
  rumpfFarbe: "#6a4a2e",
  brustMuster: (T, poly, w) => weich(T, G([[3, -55], [9, -57], [15.6, -55], [14.6, -45], [9, -43], [3, -46]]), "#ebdfc6", 0.95, 1, true) +
    muster(T, poly, w, { art: "tropfen", abst: 2, lang: 2, dick: 0.7, farbe: "#5a3c22", op: 0.7, dichte: (x, y) => (y > -56 && y < -45 ? 0.35 : 0), sz: 0.4 }) +
    binden((x, y) => (y >= -45 ? 0.95 : 0), "#5a3c24", 2.2, 2.8, 0.9, 0.8, 0.5)(T, poly, w) +
    weich(T, G([[6, -70], [10.4, -71.4], [12.4, -66], [9, -64.6], [6, -66]]), "#e4d6ba", 0.8, 0.6, true),
  hoseMuster: binden(null, "#3e2a18", 2.4, 2.6, 0.8, 0.6, 0.4),
  nacken: [["#6a4a2e", "#9a7652", goldM(0.12, 0.5)], ["#5a3e26", "#8a6a46", goldM(0.14, 0.55)]],
  decke: [["#5a3e26", "#9a7a52"], ["#4e3622", "#8a6a46"]], mittel: [["#5e4228", "#b08a5c"], ["#54392a", "#a07e54"]], schulter: [["#4a3220", "#7a5a3a"]],
  deckFarbe: "#5a3e26",
  quH: [[0, "#4a3a2c"], [1, "#140e0a"]], quA: [[0, "#6a5848"], [1, "#2a2018"]], armBinden: [6, "#1e1610", 0.35, 0.45, 0.2, 0.85], schirmBinden: [4, "#2a1e14", 0.3, 0.5, 0.2, 0.85],
  schwanz: { quer: [[0, "#a0907a"], [1, "#5e4e3e"]], binden: [10, "#3a2a1e", 0.5, 0.38, 0.08, 0.8], saum: ["#e4d8c4", 0.6, 0.2], endbinde: "#2a1e16" },
  lauf: true, zehen: { hell: "#fadc6a", mittel: "#e6b030", dunkel: "#946414", schilde: 7 }, krallenK: 0.85,
  kG: [[0, "#9a7854"], [0.45, "#6a4a30"], [1, "#3a2818"]], kopfStriche: [["#2a1a0c", 1, 0.05, 0.5], ["#c8a87c", 0.7, 0.045, 0.45]],
  kopfMuster: (T) => weich(T, G([[3, -74.6], [8.6, -75.2], [10.2, -72.4], [7, -70.4], [2.6, -71]]), "#dcc8a4", 0.85, 0.5, true) +
    (T.fein ? striche(T, [[3, -74.4], [8.6, -75], [9.6, -72], [3, -71.2]], 24, 100, 0.9, [["#5a3c20", 1, 0.06, 0.6]], { streu: 10 }) : ""),
  wulst: 0.55, auge: { iris: "#5a3418", iris2: "#24120a", pupille: 0.5 },
  schnabel: { k: 0.78, horn: [[0, "#8a8e96"], [0.4, "#4e525a"], [0.75, "#1e2024"], [1, "#0a0a0c"]], hornU: [[0, "#e0c060"], [0.3, "#8a8c90"], [1, "#2a2c30"]], wachs: [[0, "#fadc6a"], [0.5, "#e6b030"], [1, "#a8780e"]] },
};
const bussard = (T) => greif(T, BUSSARD);

module.exports = [
  { id: "steinadler", de: "der Adler", syl: "AD-ler", it: "l'aquila", itSyl: "A-qui-la", en: "golden eagle",
    gruppe: "Greifvögel und Eulen", lebensraum: "Gebirge", laenge: 0.5, hoehe: 0.85, zeichne: steinadler },
  { id: "seeadler", de: "der Seeadler", syl: "SEE-ad-ler", it: "l'aquila di mare testabianca", itSyl: "A-qui-la di MA-re te-sta-BIAN-ca", en: "bald eagle",
    gruppe: "Greifvögel und Eulen", lebensraum: "Küste und Seen", laenge: 0.55, hoehe: 0.89, zeichne: seeadler },
  { id: "falke", de: "der Falke", syl: "FAL-ke", it: "il falco pellegrino", itSyl: "FAL-co pel-le-GRI-no", en: "peregrine falcon",
    gruppe: "Greifvögel und Eulen", lebensraum: "Felsen und Städte", laenge: 0.25, hoehe: 0.43, zeichne: falke },
  { id: "bussard", de: "der Bussard", syl: "BUS-sard", it: "la poiana", itSyl: "po-IA-na", en: "common buzzard",
    gruppe: "Greifvögel und Eulen", lebensraum: "Feld und Waldrand", laenge: 0.3, hoehe: 0.52, zeichne: bussard },
];
