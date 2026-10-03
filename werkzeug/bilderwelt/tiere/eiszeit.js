/* =====================================================================
   TIER-BIBLIOTHEK — GRUPPE EISZEIT (FASSUNG 854, MASSSTAB 2)
   ---------------------------------------------------------------------
   XANDER: „dass du das Mammut noch mal machst" – „fast fotorealistisch …
   jedes einzelne Haar … Augen, Wimpern … Licht und Schatten plastisch massiv".
   Mammut, Säbelzahnkatze, Wollnashorn, Riesenhirsch, Höhlenbär – nach
   Funden, gefrorenen Kadavern (Yuka, Ljuba, Sasha) und Höhlenmalereien
   (Chauvet, Rouffignac, Lascaux, Cougnac).
   Zentimeter, Blick nach rechts, Boden y = 0, Licht von links oben.
   Filter (Rauschen, Relief) nur bei T.fein – in Szenen bleibt es schnell.
   ===================================================================== */
"use strict";

/* ---------- eigene Werkzeuge (knappe Zahlen = kleine SVGs) ---------- */
let GEN = 1; // 1 = ganze Zentimeter, 10 = Millimeter (kleinere Tiere)
const R = (n) => Math.round(n * GEN) / GEN;
/* Zahlenfolge ohne überflüssige Leerzeichen („12-34" statt „12 -34") */
const zf = (...a) => a.map((v, i) => { const s = String(R(v)); return i && s[0] !== "-" ? " " + s : s; }).join("");
const UB = ' gradientUnits="userSpaceOnUse"';

function glatt(pts, zu = true, sp = 1) {
  const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = "M" + zf(pts[0][0], pts[0][1]);
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6 * sp, p1[1] + (p2[1] - p0[1]) / 6 * sp];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6 * sp, p2[1] - (p3[1] - p1[1]) / 6 * sp];
    d += "C" + zf(c1[0], c1[1], c2[0], c2[1], p2[0], p2[1]);
  }
  return d + (zu ? "Z" : "");
}
function imPoly(x, y, p) {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    if ((p[i][1] > y) !== (p[j][1] > y) && x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) c = !c;
  }
  return c;
}
/* Punkt bei Anteil t (0..1) entlang einer Linie */
function entlang(L, t) {
  const seg = []; let ges = 0;
  for (let i = 1; i < L.length; i++) { const l = Math.hypot(L[i][0] - L[i - 1][0], L[i][1] - L[i - 1][1]); seg.push(l); ges += l; }
  let s = t * ges;
  for (let i = 0; i < seg.length; i++) {
    if (s <= seg[i] || i === seg.length - 1) { const u = seg[i] ? Math.min(1, s / seg[i]) : 0; return [L[i][0] + (L[i + 1][0] - L[i][0]) * u, L[i][1] + (L[i + 1][1] - L[i][1]) * u]; }
    s -= seg[i];
  }
  return L[L.length - 1];
}
/* Wert einer Linie (nach a sortiert) an der Stelle v: k = 0 → y bei x, k = 1 → x bei y */
function bei(L, v, k = 0) {
  const a = 1 - k, b = k;
  if (v <= L[0][b]) return L[0][a];
  for (let i = 1; i < L.length; i++) if (v <= L[i][b]) { const u = (v - L[i - 1][b]) / (L[i][b] - L[i - 1][b]); return L[i - 1][a] + (L[i][a] - L[i - 1][a]) * u; }
  return L[L.length - 1][a];
}
/* Fransen: zottige Kante (Haarlocken) entlang L. len: Zahl oder f(t). sx: Schwung zur Seite (Anteil von len).
   nach: Richtung der Locken ([0, 1] = nach unten). Täler weich, Spitzen hart. */
function fransen(T, L, n, len, sx = 0, streu = 0.6, nach = [0, 1]) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const tm = (i + 0.5 + (T.rnd() - 0.5) * 0.5) / n;
    out.push(entlang(L, i / n));
    const m = entlang(L, tm), l = (typeof len === "function" ? len(tm) : len) * (1 - streu / 2 + T.rnd() * streu);
    const q = (sx + (T.rnd() - 0.5) * 0.3) * l;
    out.push([m[0] + nach[0] * l + (nach[0] ? 0 : q), m[1] + nach[1] * l + (nach[0] ? q : 0), 1]);
  }
  out.push(entlang(L, 1));
  return out;
}
/* HAAR FÜR HAAR: n Haare in der Fläche poly, Wuchsrichtung winkel in Grad (Zahl oder f(x, y); 0 = rechts, 90 = unten),
   Länge len (Zahl oder f(x, y)). o.farben: [[farbe, anteil, breite, deckkraft], …]. Ein Pfad je Farbe, relative
   Koordinaten (klein). Mit T.fein = false nur ein Teil (o.szene, sonst ein Viertel). */
function H(T, poly, n, winkel, len, o = {}) {
  const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  let farben = o.farben || [["#000", 1, 1, 0.4]];
  if (T.fein === false) farben = farben.slice(0, 1); // Szene: eine Farbe je Haarfeld (weniger Pfade)
  const summe = farben.reduce((s, f) => s + f[1], 0);
  const eimer = farben.map(() => "");
  const ziel = Math.round(n * (T.fein === false ? (o.szene != null ? o.szene : 0.25) * (T._sz || 1) : 1));
  const st = o.streuung != null ? o.streuung : 16, kr = o.kruemmung != null ? o.kruemmung : 0.18;
  for (let i = 0, v = 0; i < ziel && v < ziel * 30; v++) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!imPoly(x, y, poly)) continue;
    i++;
    const a = ((typeof winkel === "function" ? winkel(x, y) : winkel) + (T.rnd() - 0.5) * st) * Math.PI / 180;
    const l = (typeof len === "function" ? len(x, y) : len) * (0.55 + T.rnd() * 0.9);
    const ex = Math.cos(a) * l, ey = Math.sin(a) * l, k = (T.rnd() - 0.5) * 2 * kr * l;
    let u = T.rnd() * summe, j = 0;
    while (j < farben.length - 1 && u > farben[j][1]) { u -= farben[j][1]; j++; }
    eimer[j] += "M" + zf(x, y) + "q" + zf(ex / 2 - Math.sin(a) * k, ey / 2 + Math.cos(a) * k, ex, ey);
  }
  return eimer.map((d, j) => (d ? `<path d="${d}" fill="none" stroke="${farben[j][0]}" stroke-width="${farben[j][2]}" stroke-opacity="${farben[j][3]}" stroke-linecap="round"/>` : "")).join("");
}
/* Körperteil: Pfad einmal (mit id), Füllung, Volumen, geklippte Innenzeichnung, feiner Rand */
function K(T, pts, fill, o = {}) {
  const d = typeof pts === "string" ? pts : glatt(pts, true, o.sp || 1);
  T._n = (T._n || 0) + 1;
  const id = T.id("e" + T._n);
  T.def(`<clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  let s = `<defs><path id="${id}" d="${d}"/></defs><use href="#${id}" fill="${fill}"/>`;
  if (o.vol !== false) s += `<use href="#${id}" fill="${T.VOL()}"/>`;
  if (o.innen) s += `<g clip-path="url(#${id}c)">${o.innen}</g>`;
  if (o.rand !== false) s += `<use href="#${id}" fill="none" stroke="${o.rand || "#000"}" stroke-opacity="${o.randA != null ? o.randA : 0.28}" stroke-width="${o.rw || 0.8}"/>`;
  if (o.d) o.d.push(d);
  return s;
}
const F = (pts, fill, extra = "") => `<path d="${typeof pts === "string" ? pts : glatt(pts)}" fill="${fill}"${extra}/>`;
const LI = (pts, farbe, w, extra = "") => `<path d="${glatt(pts, false)}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-linecap="round"${extra}/>`;
/* weicher Fleck (Licht/Schatten ohne Kante): ein Verlauf je Farbe, Stärke über opacity */
let FLMIN = 0; // Szene: schwache Flecken weglassen
const fleck = (T, cx, cy, rx, ry, farbe, op, dreh = 0) => (T.fein === false && op < FLMIN ? "" :
  `<ellipse cx="${R(cx)}" cy="${R(cy)}" rx="${R(rx)}" ry="${R(ry)}"${dreh ? ` transform="rotate(${dreh} ${R(cx)} ${R(cy)})"` : ""} fill="${T.rg("f" + farbe.slice(1), [[0, farbe], [0.5, farbe, 0.55], [1, farbe, 0]])}" opacity="${op}"/>`);
/* Auge: fein = echtes Auge mit Wimpern; Szene = winziges dunkles Auge mit Glanzpunkt */
const AUGE = (T, x, y, rr, o) => (T.fein === false
  ? `<ellipse cx="${R(x)}" cy="${R(y)}" rx="${R(rr * 1.3)}" ry="${R(rr * 0.8)}" fill="#0c0705"/>`
  : T.augeReal(x, y, rr, o));
/* Textur-Rechteck (Rauschen) für die geklippte Innenzeichnung – nur in voller Feinheit */
const TX = (T, name, o, winkel, op, b) => {
  if (T.fein === false) return "";
  const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, r = Math.hypot(b[2] - b[0], b[3] - b[1]) / 2;
  return `<rect x="${R(cx - r)}" y="${R(cy - r)}" width="${R(2 * r)}" height="${R(2 * r)}" filter="${T.rauschen(name, o)}" transform="rotate(${winkel} ${R(cx)} ${R(cy)})" opacity="${op}"/>`;
};
const RF = (T, name, o, inhalt) => (T.fein === false ? inhalt : `<g filter="${T.relief(name, o)}">${inhalt}</g>`);
/* Rundung eines Beins: entlang der Höhe je ein weicher Licht-Streif an der linken (dem Licht zugewandten) Kante und ein
   Kernschatten an der rechten Kante – so wirkt auch das ferne Bein rund und nicht wie eine flache Silhouette */
function modell(T, P, hell, opH, opD, y0, y1, n = 7) {
  let o = "";
  const st = (y1 - y0) / n;
  for (let i = 0; i <= n; i++) {
    const y = y0 + i * st, xs = [];
    for (let j = 0, k = P.length - 1; j < P.length; k = j++) {
      const a = P[j], b = P[k];
      if ((a[1] > y) !== (b[1] > y)) xs.push(a[0] + (y - a[1]) / (b[1] - a[1]) * (b[0] - a[0]));
    }
    if (xs.length < 2) continue;
    const xl = Math.min(...xs), xr = Math.max(...xs), w = xr - xl;
    o += fleck(T, xl + w * 0.24, y, w * 0.2, Math.abs(st) * 0.9, hell, opH) + fleck(T, xr - w * 0.16, y, w * 0.2, Math.abs(st) * 0.9, "#000", opD);
  }
  return o;
}
/* Röhre (Stoßzahn, Horn): Mittellinie + Breite am Anfang/Ende */
function rohr(mitte, w0, w1, spitz = true, ex = 0.9) {
  const n = mitte.length, li = [], re = [];
  for (let i = 0; i < n; i++) {
    const a = mitte[Math.max(0, i - 1)], b = mitte[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * Math.pow(i / (n - 1), ex)) / 2;
    li.push([mitte[i][0] - dy / l * w, mitte[i][1] + dx / l * w]);
    re.push([mitte[i][0] + dy / l * w, mitte[i][1] - dx / l * w]);
  }
  const e = mitte[n - 1], f = mitte[n - 2], le = Math.hypot(e[0] - f[0], e[1] - f[1]) || 1;
  const ux = (e[0] - f[0]) / le, uy = (e[1] - f[1]) / le;
  if (spitz === "rund") {   // stumpfe, gerundete Spitze (abgenutzt)
    const k = [];
    for (const a of [-0.9, -0.45, 0, 0.45, 0.9]) { const c = Math.cos(a), s = Math.sin(a); k.push([e[0] + (ux * c - uy * s) * w1 / 2, e[1] + (uy * c + ux * s) * w1 / 2]); }
    return [...li, ...k.reverse(), ...re.reverse()];
  }
  const sp = [e[0] + ux * w1 * 0.9, e[1] + uy * w1 * 0.9];
  return [...li, ...(spitz ? [sp] : []), ...re.reverse()];
}
/* Linie parallel zur Mittellinie (f = Anteil der halben Breite, + = links der Laufrichtung) */
function quer(mitte, w0, w1, f, ex = 0.9) {
  const n = mitte.length;
  return mitte.map((p, i) => {
    const a = mitte[Math.max(0, i - 1)], b = mitte[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * Math.pow(i / (n - 1), ex)) / 2 * f;
    return [p[0] - dy / l * w, p[1] + dx / l * w];
  });
}

/* ---------------------------------------------------------------------
   WERKZEUGE RUNDE 2 (Kritik Runde 1: „Striche statt Strähnen, keine Lichtrichtung, Outline, Säulenbeine")
   --------------------------------------------------------------------- */
const r2 = (n) => Math.round(n * 100) / 100;
const z2 = (...a) => a.map((v, i) => { const s = String(r2(v)); return i && s[0] !== "-" ? " " + s : s; }).join("");
/* Licht über einen Zylinder: t = 0 oben (Lichtkante), 0,62 Schattengrenze, 0,85 Kernschatten, 1 Bodenreflex.
   Liefert 0 (dunkel) … 1 (hell). */
function zyl(t) {
  if (t < 0.06) return 0.96;
  if (t < 0.35) return 0.96 - (t - 0.06) / 0.29 * 0.16;
  if (t < 0.62) return 0.8 - (t - 0.35) / 0.27 * 0.4;
  if (t < 0.85) return 0.4 - (t - 0.62) / 0.23 * 0.22;
  if (t <= 1) return 0.18 + (t - 0.85) / 0.15 * 0.1;
  return 0.24 + 0.06 * Math.min(1, (t - 1) / 0.5);
}
/* Bein als Zylinder von der Seite: u = 0 linke Kante (Licht) … 1 rechte Kante */
function zylX(u) {
  if (u < 0.08) return 0.62;
  if (u < 0.3) return 0.62 + (u - 0.08) / 0.22 * 0.18;
  if (u < 0.72) return 0.8 - (u - 0.3) / 0.42 * 0.55;
  if (u < 0.9) return 0.25;
  return 0.25 + (u - 0.9) / 0.1 * 0.12;
}
/* STRÄHNEN: n spitz zulaufende, gefüllte Haarlocken mit der Wurzel in poly. winkel(x, y) Grad (0 = rechts, 90 = unten),
   len(x, y) cm, breite(x, y) cm an der Wurzel. licht(x, y) → 0…1 wählt den Ton aus toene (dunkel → hell, Farbe oder
   [Farbe, Deckkraft]). Ein Pfad je Ton, relative Koordinaten. Szene: o.szene × n, Breite × o.szeneB (Bündel). */
function LOCKEN(T, poly, n, winkel, len, breite, licht, toene, o = {}) {
  const fein = T.fein !== false;
  const ziel = Math.round(n * (fein ? 1 : (o.szene != null ? o.szene : 0.18)));
  const bf = fein ? 1 : (o.szeneB != null ? o.szeneB : 2);
  const st = o.streuung != null ? o.streuung : 10, kr = o.kruemmung != null ? o.kruemmung : 0.12, js = o.jitter != null ? o.jitter : 0.7;
  const fn = (f) => (typeof f === "function" ? f : () => f);
  const W = fn(winkel), L = fn(len), B = fn(breite), Li = fn(licht);
  const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const N = toene.length, eimer = toene.map(() => "");
  const Z = o.genau ? z2 : zf;
  for (let i = 0, v = 0; i < ziel && v < ziel * 40; v++) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!imPoly(x, y, poly)) continue;
    i++;
    const a = (W(x, y) + (T.rnd() - 0.5) * 2 * st) * Math.PI / 180;
    const l = L(x, y) * (0.7 + T.rnd() * 0.6), w = B(x, y) * (0.6 + T.rnd() * 0.8) * bf;
    const c = Math.cos(a), s = Math.sin(a), k = (T.rnd() - 0.5) * 2 * kr * l;
    const tx = c * l, ty = s * l, mx = tx / 2 - s * k, my = ty / 2 + c * k, px = -s * w / 2, py = c * w / 2;
    const lv = Li(x + tx * 0.5, y + ty * 0.5);
    const j = Math.max(0, Math.min(N - 1, Math.round(lv * (N - 1) + (T.rnd() - 0.5) * 2 * js)));
    /* Linse (spindelförmig): Wurzel und Spitze spitz, Mitte so dick wie w – keine Schnittkante an der Wurzel */
    if (o.keil) eimer[j] += "M" + Z(x + px, y + py) + "q" + Z(mx - 0.4 * px, my - 0.4 * py, tx - px, ty - py) + "q" + Z(mx - 0.6 * px - tx, my - 0.6 * py - ty, -px - tx, -py - ty) + "z";
    else eimer[j] += "M" + Z(x, y) + "q" + Z(mx + 2 * px, my + 2 * py, tx, ty, mx - 2 * px - tx, my - 2 * py - ty, -tx, -ty);
  }
  return eimer.map((d, j) => {
    if (!d) return "";
    const t = toene[j], f = Array.isArray(t) ? t[0] : t, op = Array.isArray(t) ? t[1] : 1;
    return `<path d="${d}" fill="${f}"${op < 1 ? ` fill-opacity="${op}"` : ""}/>`;
  }).join("");
}
/* Strähnen entlang einer Linie (Kontur brechen, Rock, Säume): Wurzeln auf L (+ Versatz nach innen), sonst wie LOCKEN */
function LOCKENLINIE(T, Lin, n, innen, winkel, len, breite, licht, toene, o = {}) {
  const pts = [];
  const tief = typeof innen === "number" ? [innen, innen] : innen;
  for (let i = 0; i <= 24; i++) { const p = entlang(Lin, i / 24); pts.push([p[0], p[1] + tief[0]]); }
  for (let i = 24; i >= 0; i--) { const p = entlang(Lin, i / 24); pts.push([p[0], p[1] + tief[1]]); }
  return LOCKEN(T, pts, n, winkel, len, breite, licht, toene, o);
}
/* Säugetier-Auge (Profil): Mandel mit hängendem hinterem Winkel, Iris füllt fast alles, Pupille, Oberlidschatten,
   kleines Glanzlicht oben zur Lichtseite, feuchter Unterlidrand, dunkler Lidrand, Lidfalten (dunkel + hell), Wimpern.
   o: { iris, iris2, pupille: "rund"|"quer", winkel, falten, wimpern, wl (× Höhe), wwinkel (Grad, Richtung der Wimpern),
        haut (Farbe Lidhaut), hautHell } */
function AUGE2(T, x, y, w, h, o = {}) {
  const fein = T.fein !== false;
  const g = `<g transform="translate(${z2(x, y)}) rotate(${o.winkel || 0})">`;
  if (!fein) return g + `<path d="M${z2(-w / 2, h * 0.16)}Q${z2(0, -h * 0.75, w / 2, 0)}Q${z2(0, h * 0.6, -w / 2, h * 0.16)}z" fill="#0c0705"/>` +
    `<circle cx="${r2(w * 0.12)}" cy="${r2(-h * 0.18)}" r="${r2(h * 0.14)}" fill="#fff" opacity=".7"/></g>`;
  T._n = (T._n || 0) + 1;
  const id = T.id("au" + T._n);
  const A = `M${z2(-w / 2, h * 0.16)}C${z2(-w * 0.3, -h * 0.58, w * 0.22, -h * 0.66, w / 2, -h * 0.02)}C${z2(w * 0.26, h * 0.5, -w * 0.24, h * 0.56, -w / 2, h * 0.16)}Z`;
  T.def(`<clipPath id="${id}"><path d="${A}"/></clipPath>`);
  const ir = T.rg("iris" + (o.iris || "#3a2410").slice(1), [[0, o.iris2 || "#5a3a1c"], [0.45, o.iris || "#3a2410"], [0.85, o.iris || "#3a2410"], [1, "#0e0805"]], 0.42, 0.42, 0.6);
  const R0 = h * 0.62, cx = w * 0.06;
  let s = g;
  /* Lidhaut um das Auge (nackt, etwas dunkler) */
  if (o.haut) s += `<ellipse cx="0" cy="${r2(-h * 0.05)}" rx="${r2(w * 0.78)}" ry="${r2(h * 0.95)}" fill="${o.haut}" opacity=".75"/>`;
  s += `<path d="${A}" fill="#120a05"/><g clip-path="url(#${id})">`;
  s += `<circle cx="${r2(cx)}" cy="${r2(h * 0.02)}" r="${r2(R0)}" fill="${ir}"/>`;
  if (o.pupille === "quer") s += `<ellipse cx="${r2(cx)}" cy="${r2(h * 0.02)}" rx="${r2(R0 * 0.55)}" ry="${r2(R0 * 0.26)}" fill="#050302"/>`;
  else s += `<circle cx="${r2(cx)}" cy="${r2(h * 0.02)}" r="${r2(R0 * 0.42)}" fill="#050302"/>`;
  s += `<rect x="${r2(-w / 2)}" y="${r2(-h)}" width="${r2(w)}" height="${r2(h * 0.9)}" fill="${T.lg("oberlid", [[0, "#000", 0.85], [0.6, "#000", 0.5], [1, "#000", 0]])}"/>`;
  s += `<ellipse cx="${r2(cx - R0 * 0.32)}" cy="${r2(-h * 0.2)}" rx="${r2(R0 * 0.16)}" ry="${r2(R0 * 0.11)}" fill="#fff6e8" opacity=".85"/>`;
  s += `<ellipse cx="${r2(cx + R0 * 0.3)}" cy="${r2(h * 0.3)}" rx="${r2(R0 * 0.22)}" ry="${r2(R0 * 0.07)}" fill="#fff" opacity=".18"/></g>`;
  /* Lidrand dunkel, Unterlid feucht hell, Lidfalten als Paare */
  s += `<path d="${A}" fill="none" stroke="#0a0604" stroke-width="${r2(h * 0.09)}" stroke-opacity=".9"/>`;
  s += `<path d="M${z2(w * 0.42, h * 0.08)}C${z2(w * 0.2, h * 0.5, -w * 0.22, h * 0.52, -w * 0.44, h * 0.22)}" fill="none" stroke="#fff4e6" stroke-width="${r2(h * 0.05)}" stroke-opacity=".5"/>`;
  const nf = o.falten != null ? o.falten : 2, hd = o.hautHell || "#c8a07a";
  for (let i = 0; i < nf; i++) {
    const f = 1.35 + i * 0.32, d = `M${z2(-w * 0.5 * f, h * 0.1)}C${z2(-w * 0.3 * f, -h * 0.75 * f, w * 0.25 * f, -h * 0.8 * f, w * 0.5 * f, -h * 0.1)}`;
    const du = `M${z2(-w * 0.45 * f, h * 0.35)}C${z2(-w * 0.2 * f, h * 0.7 * f, w * 0.2 * f, h * 0.68 * f, w * 0.42 * f, h * 0.2)}`;
    s += `<path d="${d}${i < nf - 1 ? du : ""}" fill="none" stroke="#000" stroke-width="${r2(h * 0.08)}" stroke-opacity=".38"/>`;
    s += `<path d="${d}" fill="none" stroke="${hd}" stroke-width="${r2(h * 0.06)}" stroke-opacity=".3" transform="translate(0 ${r2(h * 0.09)})"/>`;
  }
  const nw = o.wimpern || 0;
  if (nw) {
    let d = "";
    const wa = (o.wwinkel != null ? o.wwinkel : 40) * Math.PI / 180;
    for (let i = 0; i < nw; i++) {
      const t = 0.12 + 0.8 * i / Math.max(1, nw - 1);
      const bx = -w / 2 + w * t, by = -h * 0.6 * Math.sin(Math.PI * t) + h * 0.06;
      const L = h * (o.wl || 1.4) * (0.6 + T.rnd() * 0.5) * (0.6 + t * 0.6);
      const a = wa - 0.5 + t * 0.6;
      d += `M${z2(bx, by)}q${z2(Math.cos(a - 0.6) * L * 0.5, Math.sin(a - 0.6) * L * 0.5, Math.cos(a) * L, Math.sin(a) * L)}`;
    }
    s += `<path d="${d}" fill="none" stroke="#120a05" stroke-width="${r2(h * 0.045)}" stroke-linecap="round"/>`;
  }
  return s + "</g>";
}
/* Unterwolle als feines, gekräuseltes Kachelmuster (nur volle Feinheit): einmal in den defs, beliebig oft benutzt */
function WOLLE(T, name, farbe, groesse = 24, n = 22, l = 5) {
  T._m = T._m || {};
  const id = T.id("w_" + name);
  if (!T._m[name]) {
    T._m[name] = 1;
    let d = "";
    for (let i = 0; i < n; i++) {
      const x = T.rnd() * groesse, y = T.rnd() * groesse, a = (80 + T.rnd() * 40) * Math.PI / 180, k = (T.rnd() - 0.5) * l;
      const ex = Math.cos(a) * l, ey = Math.sin(a) * l;
      for (const [ox, oy] of [[0, 0], [-groesse, 0], [0, -groesse], [-groesse, -groesse]]) {
        const X = x + ox, Y = y + oy;
        if (X + Math.max(0, ex) < -1 || Y + Math.max(0, ey) < -1 || X + Math.min(0, ex) > groesse + 1 || Y > groesse + 1) continue;
        d += "M" + z2(X, Y) + "q" + z2(ex / 2 + k, ey / 2, ex, ey);
      }
    }
    T.def(`<pattern id="${id}" width="${groesse}" height="${groesse}" patternUnits="userSpaceOnUse"><path d="${d}" fill="none" stroke="${farbe}" stroke-width="${r2(l * 0.12)}" stroke-linecap="round"/></pattern>`);
  }
  return `url(#${id})`;
}
/* weich gemalte Licht-/Schattenformen: Gruppe mit Gaußscher Unschärfe (nur volle Feinheit; klein liegt die Kante unter
   einem Pixel). sd in cm. */
function WEICH(T, inhalt, sd) {
  if (T.fein === false || !inhalt) return inhalt;
  const id = T.id("bl" + String(sd).replace(".", "_"));
  T._b = T._b || {};
  if (!T._b[id]) { T._b[id] = 1; T.def(`<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${sd}"/></filter>`); }
  return `<g filter="url(#${id})">${inhalt}</g>`;
}
let SZ = false, SZMIN = 0.25; // Szene (klein): schwache Malformen weglassen
/* gemalte Form (weich gezeichnet in WEICH): ganzzahlig gerundet – unter der Unschärfe reicht 1 cm */
const FO = (pts, farbe, op) => {
  if (SZ && op < SZMIN) return "";
  const g = GEN; GEN = 1; const d = glatt(pts); GEN = g;
  return `<path d="${d}" fill="${farbe}" opacity="${op}"/>`;
};
/* kurzes Fell: gebogene Striche, Ton nach Licht (wie LOCKEN), je Ton [Farbe, Deckkraft, Strichbreite] */
function FELL(T, poly, n, winkel, len, licht, toene, o = {}) {
  const fein = T.fein !== false;
  const ziel = Math.round(n * (fein ? 1 : (o.szene != null ? o.szene : 0.12)));
  const st = o.streuung != null ? o.streuung : 12, kr = o.kruemmung != null ? o.kruemmung : 0.2, js = o.jitter != null ? o.jitter : 0.9;
  const fn = (f) => (typeof f === "function" ? f : () => f);
  const Wf = fn(winkel), L = fn(len), Li = fn(licht);
  const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const N = toene.length, eimer = toene.map(() => "");
  for (let i = 0, v = 0; i < ziel && v < ziel * 40; v++) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!imPoly(x, y, poly)) continue;
    i++;
    const a = (Wf(x, y) + (T.rnd() - 0.5) * 2 * st) * Math.PI / 180, l = L(x, y) * (0.6 + T.rnd() * 0.8);
    const ex = Math.cos(a) * l, ey = Math.sin(a) * l, k = (T.rnd() - 0.5) * 2 * kr * l;
    const lv = Li(x + ex / 2, y + ey / 2);
    const j = Math.max(0, Math.min(N - 1, Math.round(lv * (N - 1) + (T.rnd() - 0.5) * 2 * js)));
    eimer[j] += "M" + zf(x, y) + "q" + zf(ex / 2 - Math.sin(a) * k, ey / 2 + Math.cos(a) * k, ex, ey);
  }
  return eimer.map((d, j) => (d ? `<path d="${d}" fill="none" stroke="${toene[j][0]}" stroke-opacity="${toene[j][1]}" stroke-width="${toene[j][2]}" stroke-linecap="round"/>` : "")).join("");
}
/* Streifen über ein Glied (für Licht/Kernschatten eines Zylinders): zwischen den Anteilen u0…u1 der Breite, y0…y1 */
function streifen(P, y0, y1, u0, u1, n = 8) {
  const L = [], Rr = [];
  for (let i = 0; i <= n; i++) {
    const y = y0 + (y1 - y0) * i / n, xs = [];
    for (let j = 0, k = P.length - 1; j < P.length; k = j++) {
      const a = P[j], b = P[k];
      if ((a[1] > y) !== (b[1] > y)) xs.push(a[0] + (y - a[1]) / (b[1] - a[1]) * (b[0] - a[0]));
    }
    if (xs.length < 2) continue;
    const l = Math.min(...xs), r = Math.max(...xs), w = r - l, f = Math.sin(Math.PI * Math.min(1, (i + 0.5) / n)) ** 0.3;
    const m = l + w * (u0 + u1) / 2, h = w * (u1 - u0) / 2 * f;
    L.push([m - h, y]); Rr.push([m + h, y]);
  }
  return L.concat(Rr.reverse());
}
/* Tasthaare: spitz zulaufend (Keil), leicht gebogen. wurzeln: [[x, y], …], winkel(i) Grad, laenge, Wurzelbreite */
function TASTHAARE(T, wurzeln, winkel, laenge, b, farbe, op = 0.75) {
  if (T.fein === false) return "";
  let d = "";
  wurzeln.forEach(([x, y], i) => {
    const a = winkel(i) * Math.PI / 180, l = laenge * (0.7 + T.rnd() * 0.5), c = Math.cos(a), s = Math.sin(a), k = l * 0.12;
    const tx = c * l, ty = s * l + l * 0.08, px = -s * b / 2, py = c * b / 2;
    d += "M" + z2(x + px, y + py) + "q" + z2(tx / 2 - s * k - px, ty / 2 + c * k - py, tx - px, ty - py) + "q" + z2(-tx / 2 - s * k - px, -ty / 2 + c * k - py, -tx - px, -ty - py) + "z";
  });
  return `<path d="${d}" fill="${farbe}" fill-opacity="${op}"/>`;
}
/* weiches Band (Kernschatten, Lichtkante, Schlagschatten): Kette weicher Flecken entlang einer Linie */
function BAND(T, Lin, n, rx, ry, farbe, op) {
  let o = "";
  for (let i = 0; i <= n; i++) {
    const t = i / n, p = entlang(Lin, t), q = entlang(Lin, Math.min(1, t + 0.02)), p0 = entlang(Lin, Math.max(0, t - 0.02));
    const rr = typeof rx === "function" ? rx(t) : rx;
    o += fleck(T, p[0], p[1], rr, typeof ry === "function" ? ry(t) : ry, farbe, typeof op === "function" ? op(t) : op, Math.round(Math.atan2(q[1] - p0[1], q[0] - p0[0]) * 180 / Math.PI));
  }
  return o;
}
/* Glied aus einer Gelenkkette [[x, y, breiteHinten, breiteVorn], …] von oben nach unten; fuss: Punkte dazwischen */
function glied(kette, fuss = []) {
  const n = kette.length, hin = [], vor = [];
  for (let i = 0; i < n; i++) {
    const a = kette[Math.max(0, i - 1)], b = kette[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    hin.push([kette[i][0] - dy * kette[i][2], kette[i][1] + dx * kette[i][2]]);
    vor.push([kette[i][0] + dy * kette[i][3], kette[i][1] - dx * kette[i][3]]);
  }
  return vor.concat(fuss, hin.reverse());
}
/* Querschnitt-Licht einer Fläche: für ein Glied (Polygon) an der Stelle (x, y) den Anteil u über die Breite */
function quer_u(P, x, y) {
  const xs = [];
  for (let j = 0, k = P.length - 1; j < P.length; k = j++) {
    const a = P[j], b = P[k];
    if ((a[1] > y) !== (b[1] > y)) xs.push(a[0] + (y - a[1]) / (b[1] - a[1]) * (b[0] - a[0]));
  }
  if (xs.length < 2) return 0.5;
  const l = Math.min(...xs), r = Math.max(...xs);
  return Math.max(0, Math.min(1, (x - l) / ((r - l) || 1)));
}

/* =====================================================================
   DAS MAMMUT (Wollhaarmammut, Mammuthus primigenius)
   RECHERCHE: Schulterhöhe 2,7–3,4 m (Bullen ~3,2 m), 4–6 t. Hoher, kuppelförmiger
   Schädel (höchster Punkt etwa auf Höhe des Buckels oder knapp darüber), dahinter
   eine deutliche Nackenkerbe, dann der Fett-Buckel über der Schulter und ein steil
   nach hinten abfallender Rücken (Hinterbeine kürzer als Vorderbeine). Stirn fast
   senkrecht, breite Rüsselwurzel zwischen den Stoßzahnscheiden. Kleine Ohren
   (~30 × 17 cm, im Fell versteckt), kurzer Schwanz (~35 cm) mit Haarquaste.
   Stoßzähne bis 4,2 m, erst nach vorn-unten, dann nach oben und innen gedreht.
   Fell: dichte, hellere Unterwolle, darüber Grannenhaare bis 90 cm (lang an Flanken,
   Bauch, Brust = „Rock"), Farbe dunkelbraun bis rotbraun, Spitzen heller
   (Kadaver Yuka, Ljuba). Lange Wimpern wie beim Elefanten. Höhlenbilder
   (Rouffignac, Chauvet): Kuppel – Kerbe – Buckel – Schräge, Rock unter dem Bauch –
   genau diese Silhouette ist die Grundform. Rüsselspitze mit zwei „Fingern"
   (oben lang und schmal, unten breit). Füße rund, Säulenbeine, Zehennägel vorn.
   ===================================================================== */
function mammut(T) {
  GEN = 1;
  const fein = T.fein !== false;
  SZ = !fein; SZMIN = 0.25;
  FLMIN = 0.3;
  const S0 = "#000", W = "#fff3dc";
  /* Töne des Deckhaars (dunkel → hell) – die Lichtrichtung entscheidet, welcher Ton; Zufall nur ±0,7 Stufen */
  const TON = ["#1c1109", "#26170c", "#331e10", "#422815", "#52321b", "#653f22", "#7c4f2b", "#956236"];
  const FERN = ["#1f150d", "#291c12", "#352418", "#422e1f", "#503827", "#5e432f"];
  const SPITZ = [["#b07a44", 0.8], ["#c4904f", 0.75]];
  const wolle = T.lg("wolle", [[0, "#9a6a40"], [0.22, "#7e5432"], [0.5, "#5e3c22"], [0.78, "#3a2416"], [1, "#44301f"]], 0, -360, 0, -140, UB);
  let s = "";

  /* ---------- Form ---------- */
  /* Rücken: Becken – leicht konkav ansteigend – eigener Fettbuckel über den Vorderbeinen – Nackenkerbe – Kuppel */
  const ruecken = [[30, -226], [42, -244], [70, -258], [128, -272], [186, -288], [236, -304], [272, -322], [300, -336], [326, -344], [346, -340],
    [362, -330], [372, -326], [384, -336], [402, -351], [420, -356], [438, -348], [450, -330], [456, -306]];
  const top = (x) => bei(ruecken, Math.max(30, Math.min(456, x)));
  const bauchY = (x) => (x > 392 ? -190 : x > 360 ? -168 + (x - 360) * -0.7 : -150 - Math.max(0, 90 - x) * 0.25);
  const t_ = (x, y) => (y - top(x)) / (bauchY(x) - top(x));
  /* Licht: Zylinder + von links etwas heller; Okklusion unter dem Kopf; Schlagschatten des Kopfes auf Brust/Schulter */
  const licht = (x, y) => {
    let v = zyl(t_(x, y)) + (x < 140 ? 0.04 : 0) - (x > 420 ? 0.04 : 0);
    if (x > 372 && x < 446 && y > -236 && y < -150) v -= 0.22;
    if (x > 360 && x < 376 && y < -300) v -= 0.12;
    return Math.max(0, Math.min(1, v));
  };
  /* Fellrichtung: Rücken 25° gegen die Senkrechte nach hinten, Flanke allmählich senkrecht, Beine senkrecht, Kopf nach vorn-unten */
  const fluss = (x, y) => {
    const t = t_(x, y);
    if (x > 386) return 86 - Math.max(0, 0.3 - t) * 30;
    return 93 + 22 * Math.max(0, 1 - t / 0.55);
  };
  const lang = (x, y) => { const t = t_(x, y); return x > 386 ? 14 + 26 * Math.max(0, t - 0.35) : t < 0.25 ? 16 + 24 * t / 0.25 : 40 + 30 * Math.min(1, (t - 0.25) / 0.6); };

  /* ---------- Beine ---------- */
  /* Säule mit Ellbogen-/Kniewulst, zum Fußgelenk auf 85 % verjüngt, Fuß nur wenig breiter */
  const vorderbein = (cx, dy = 0) => glied([[cx + 4, -205, 28, 26], [cx - 2, -150, 30, 25], [cx, -100, 24, 23], [cx + 1, -55, 21, 21], [cx + 1, -26, 20, 20]],
    [[cx + 24, -18], [cx + 25, -6 - dy], [cx + 23, -dy, 1], [cx - 21, -dy, 1], [cx - 23, -6 - dy], [cx - 22, -18]]);
  const hinterbein = (cx, dy = 0) => glied([[cx - 4, -215, 34, 28], [cx, -160, 30, 30], [cx + 4, -112, 24, 30], [cx + 2, -70, 22, 22], [cx + 1, -42, 25, 20], [cx, -24, 20, 20]],
    [[cx + 23, -16], [cx + 24, -6 - dy], [cx + 22, -dy, 1], [cx - 22, -dy, 1], [cx - 24, -6 - dy], [cx - 22, -16]]);
  const beinLicht = (P, ferne) => (x, y) => {
    let v = zylX(quer_u(P, x, y)) * (ferne ? 0.72 : 1);
    if (y < -150) v -= 0.28 * Math.min(1, (-150 - y) / 40);   // Schatten von Bauch und Rock
    if (y > -40) v -= 0.08;
    return Math.max(0, Math.min(1, v));
  };
  const fuss = (cx, dy, ferne, nagel) => {
    const P = [[cx - 23, -dy, 1], [cx - 23, -8 - dy], [cx - 21, -24], [cx + 21, -24], [cx + 24, -8 - dy], [cx + 23, -dy, 1]];
    const hautL = ferne ? "#3e342e" : "#6a5a4e", hautD = ferne ? "#1e1814" : "#2c241f";
    let f = K(T, P, ferne ? hautD : T.lg("haut", [[0, hautL], [0.55, hautD], [1, hautD]], 0, 0, 1, 0), { rand: false, vol: false, innen:
      fleck(T, cx + 2, -1 - dy, 26, 3.5, S0, 0.6) + (fein ? `<path d="M${zf(cx - 18, -14)}q8 2 16-1M${zf(cx - 12, -9)}q10 2 20-1M${zf(cx - 20, -5)}q6 1 12 0" stroke="#000" stroke-width=".7" opacity=".35" fill="none"/>` : "") });
    if (fein) f = RF(T, "fuss", { f: 0.7, tiefe: 0.3, okt: 2 }, f);
    if (nagel) {
      const ng = ferne ? "#5a5248" : T.lg("nagel", [[0, "#a69a84"], [0.7, "#8a7e6a"], [1, "#3a3028"]]);
      for (const x of [cx + 15, cx + 3, cx - 9].slice(0, fein ? 3 : 2)) f += F(`M${zf(x - 5, -dy - 0.5)}q0-4.5 5-4.5q5 0 5 4.5z`, ng);
    }
    return f;
  };
  const bein = (P, cx, dy, ferne, vorn) => {
    let b = K(T, P, T.lg(ferne ? "beinf" : "beinn", ferne ? [[0, "#2a1c12"], [1, "#1a110b"]] : [[0, "#4a2e1a"], [0.5, "#3a2414"], [1, "#2a1a0e"]], 0, -210, 0, 0, UB), {
      rand: false, vol: false, innen: `<rect x="${cx - 40}" y="-220" width="80" height="220" fill="${T.lg("beinx", [[0, "#fff", 0.1], [0.3, "#fff", 0.06], [0.55, "#000", 0], [0.75, "#000", 0.32], [0.92, "#000", 0.2], [1, "#000", 0.1]], 0, 0, 1, 0)}"/>` +
        fleck(T, cx, -175, 40, 30, S0, 0.4) });
    b += fuss(cx, dy, ferne, true);
    /* Beinfell: Strähnen senkrecht, fallen über die oberen 40–60 % des Fußes */
    const H0 = [[cx - 26, -205], [cx + 26, -205], [cx + 24, -30], [cx - 24, -30]];
    b += LOCKEN(T, H0, ferne ? 28 : 66, (x) => 91 + (x < cx ? 2 : -2), (x, y) => 20 + (y + 205) * 0.05, 3.2, beinLicht(P, ferne), ferne ? FERN : TON, { streuung: 7, szene: ferne ? 0.08 : 0.14, szeneB: 2.2 });
    b += LOCKEN(T, [[cx - 25, -60], [cx + 25, -60], [cx + 25, -36], [cx - 25, -36]], ferne ? 6 : 11, 91, 22, 3.8, beinLicht(P, ferne), ferne ? FERN : TON, { streuung: 9, szene: 0.3, jitter: 0.4 });
    if (fein && !ferne) b += LOCKEN(T, [[cx - 24, -200], [cx - 8, -200], [cx - 9, -50], [cx - 24, -50]], 10, 91, 26, 1, () => 1, SPITZ, { streuung: 6, jitter: 0.3 });
    return b;
  };
  const VF = vorderbein(334, 2), HF = hinterbein(100, 2), VN = vorderbein(356), HN = hinterbein(76);

  /* ---------- ferne Beine, ferner Stoßzahn, Schwanz ---------- */
  s += bein(VF, 334, 2, true, true) + bein(HF, 100, 2, true, false);

  /* ferner Stoßzahn: verkürzt, andere Krümmung, überkreuzt den nahen, 25 % dunkler */
  const zahnF = [[426, -218], [438, -192], [456, -166], [482, -148], [514, -140], [546, -146], [572, -166], [588, -196], [594, -230], [590, -258], [582, -278]];
  s += K(T, rohr(zahnF, 22, 8, "rund"), T.lg("elff", [[0, "#9a8a6a"], [0.5, "#857455"], [1, "#5a4a34"]], 0, 0, 0.25, 1), { vol: false, rand: false, innen:
    LI(quer(zahnF, 22, 8, 0.5).slice(2, 9), "#c8b894", 1.2, ` opacity=".45"`) + LI(quer(zahnF, 22, 8, -0.7), "#3a2e20", 3, ` opacity=".4"`) });

  /* Schwanz: kurz (~35 cm), tief angesetzt, im Körperhaar, dunkle grobe Endquaste */
  s += K(T, [[36, -210], [26, -202], [22, -186], [22, -176], [28, -176], [30, -190], [38, -200]], "#3a2414", { rand: false, vol: false });
  s += LOCKEN(T, [[20, -184], [30, -184], [30, -176], [20, -176]], 26, 96, 17, 1.8, () => 0.3, TON, { streuung: 10, szene: 0.4, jitter: 0.6 });

  /* ---------- nahe Beine ---------- */
  s += bein(HN, 76, 0, false, false) + bein(VN, 356, 0, false, true);

  /* ---------- Rumpf mit Kopf (Grund = Unterwolle) ---------- */
  const koerper = [...ruecken, [458, -282], [456, -262], [452, -238], [446, -214], [432, -200], [412, -196], [394, -186], [386, -170], [370, -156],
    [330, -148], [270, -144], [200, -142], [140, -146], [100, -152], [64, -164], [42, -178], [30, -198], [28, -214]];
  s += K(T, koerper, wolle, { rand: false, vol: false, innen:
    /* Lichtkante am Rücken, Kernschatten unten, Okklusion unter dem Kopf */
    BAND(T, ruecken.slice(1, 15).map(([x, y]) => [x, y + 16]), fein ? 8 : 5, fein ? 44 : 64, 20, "#c89660", 0.38) +
    BAND(T, [[60, -180], [140, -170], [240, -168], [330, -174], [380, -190]], fein ? 5 : 3, fein ? 62 : 90, 34, S0, 0.3) +
    (fein ? `<rect x="20" y="-360" width="440" height="220" fill="${WOLLE(T, "m", "#1a0e06", 22, 26, 5)}" opacity=".22"/>` : "") +
    fleck(T, 410, -205, 40, 26, S0, 0.5) });

  /* ---------- Deckhaar: drei Lagen Strähnen ---------- */
  const rumpfZone = [[34, -222], [70, -254], [186, -284], [272, -318], [326, -340], [362, -326], [372, -322], [386, -300], [390, -250], [392, -200],
    [380, -172], [330, -156], [200, -150], [100, -158], [50, -176], [32, -200]];
  /* Lage 1: lange, breite Strähnen (Grannen), dunklerer Ton */
  s += LOCKEN(T, rumpfZone, 205, fluss, lang, 4.6, (x, y) => licht(x, y) * 0.85, TON, { streuung: 7, kruemmung: 0.1, szene: 0.13, szeneB: 2.2 });
  /* Lage 2: kürzer, darüber */
  s += LOCKEN(T, rumpfZone, 165, fluss, (x, y) => lang(x, y) * 0.7, 3.1, licht, TON, { streuung: 7, kruemmung: 0.12, szene: 0.08, szeneB: 2.2 });
  s += LOCKEN(T, [[36, -226], [70, -256], [186, -286], [272, -320], [326, -342], [362, -328], [340, -300], [240, -280], [120, -256], [50, -218]], 95, fluss, (x, y) => lang(x, y) * 0.8, 2.8,
    licht, TON, { streuung: 6, kruemmung: 0.1, szene: 0.1, szeneB: 2.2 });
  /* Lage 3: Lichthaare nur auf der Lichtseite (warm) */
  if (fein) s += LOCKEN(T, [[40, -238], [70, -256], [186, -286], [272, -320], [326, -342], [360, -330], [330, -312], [240, -290], [140, -270], [60, -244]],
    46, fluss, (x, y) => lang(x, y) * 0.8, 1.1, () => 1, SPITZ, { streuung: 6, jitter: 0.4 });
  /* Kontur brechen: Strähnenspitzen über die Rückenlinie, Randlicht */
  s += LOCKENLINIE(T, ruecken.slice(0, 11), 54, [-3, 9], (x, y) => fluss(x, y + 6) + 6, (x) => (x > 290 && x < 372 ? 20 : 15), 2.6, (x, y) => licht(x, y + 8), TON, { streuung: 8, szene: 0.15, szeneB: 1.6 });
  s += LOCKENLINIE(T, ruecken.slice(1, 11), 32, [1, 4], (x) => (x > 300 && x < 372 ? 160 : 174), (x) => (x > 290 && x < 372 ? 14 : 11), 1.6, (x, y) => licht(x, y) + 0.05, TON, { streuung: 8, szene: 0.1 });
  /* Rock: 16 Bündel verschieden lang, mit Lücken; Brust- und Kehlbehang am längsten */
  const rockZone = [[54, -172], [120, -160], [200, -156], [270, -158], [330, -160], [380, -176], [396, -196], [390, -206], [330, -184], [200, -176], [60, -186]];
  const rockLang = (x) => (x > 340 ? 74 : x < 110 ? 40 : 56) * (0.9 + 0.2 * Math.sin(x * 0.11));
  s += LOCKEN(T, rockZone, 14, 93, rockLang, 15, () => 0.2, TON, { streuung: 6, kruemmung: 0.08, szene: 0.5, szeneB: 1.2, jitter: 0.6 });
  s += LOCKEN(T, rockZone, 100, (x) => 93 + (x < 120 ? 5 : 0), (x) => rockLang(x) * 0.9, 3.6, (x, y) => 0.22 + 0.1 * Math.max(0, (y + 120) / 40), TON, { streuung: 6, kruemmung: 0.1, szene: 0.08, szeneB: 2.5, jitter: 0.8 });

  /* ---------- Kopf ---------- */
  const auge = [428, -270];
  const kopfLicht = (x, y) => Math.max(0, Math.min(1, zyl((y + 356) / 170) - (x > 446 ? 0.08 : 0)));
  /* Ohr: klein (~30 cm), hochoval, nach hinten geneigt, unten-hinten spitzer; nur der vordere untere Rand frei, Rest im Fell */
  s += fleck(T, 392, -250, 10, 20, S0, 0.35);
  s += K(T, [[370, -286], [382, -288], [390, -274], [391, -254], [385, -240], [375, -236, 1], [367, -250], [364, -270]],
    T.lg("ohr", [[0, "#7a4e2c"], [1, "#4a2e18"]]), { rand: false, innen: fleck(T, 382, -258, 6, 13, S0, 0.3) });
  s += LOCKEN(T, [[366, -284], [388, -286], [390, -262], [376, -250], [366, -262]], 28, 104, 5, 1.4, (x, y) => kopfLicht(x, y) - 0.1, TON, { streuung: 8, szene: 0 });
  /* ---------- Rüssel: nahtlos aus dem Gesicht, oben behaart, Ringfalten, Spitze mit zwei Fingern ---------- */
  const vorn = [[455, -262], [460, -230], [462, -184], [461, -146], [458, -108], [455, -72], [454, -46], [456, -32]];
  const hint = [[410, -262], [414, -232], [421, -196], [428, -160], [433, -120], [435, -80], [436, -44], [440, -20]];
  const spitze = [[462, -24], [471, -21], [479, -22], [486, -26], [492, -30, 1], [489, -23], [485, -19], [491, -16], [494, -11], [490, -5], [480, -2], [466, -2], [452, -6], [444, -12]];
  const rue = [...vorn, ...spitze, ...hint.slice().reverse()];
  let falten = "", kanten = "";
  for (let y = -190; y < -26; y += (fein ? 1 : 2.6) * (3.2 + 2.6 * (-26 - y) / 164) * (0.8 + T.rnd() * 0.4)) {
    const xa = bei(hint, y, 1), xb = bei(vorn, y, 1), w = xb - xa, a0 = T.rnd() * 0.25, a1 = 0.75 + T.rnd() * 0.25;
    falten += "M" + zf(xa + w * a0, y + 1.2 * Math.sin(Math.PI * a0)) + "q" + zf(w * (a1 - a0) / 2, 2.4, w * (a1 - a0), 1.2 * (Math.sin(Math.PI * a1) - Math.sin(Math.PI * a0)));
    if (fein) kanten += "M" + zf(xa + w * a0, y + 1.6) + "q" + zf(w * (a1 - a0) / 2, 2.4, w * (a1 - a0), 0);
  }
  s += K(T, rue, T.lg("rue", [[0, "#5c3a20"], [0.25, "#4e3220"], [0.55, "#4a3a30"], [1, "#4e4038"]], 0, -250, 0, 0, UB), { rand: false, vol: false, innen:
    `<rect x="405" y="-205" width="95" height="207" fill="${T.lg("ruex", [[0, "#fff", 0.16], [0.3, "#fff", 0.05], [0.6, "#000", 0], [0.82, "#000", 0.35], [1, "#000", 0.2]], 0, 0, 1, 0)}"/>` +
    `<path d="${falten}" fill="none" stroke="#120a06" stroke-width="1" opacity=".45"/>` + (kanten ? `<path d="${kanten}" fill="none" stroke="#d8b090" stroke-width=".6" opacity=".2"/>` : "") +
    /* Schlagschatten des Stoßzahns auf dem Rüssel */
    LI([[430, -196], [446, -170], [466, -150]], S0, 5, ` opacity=".35"`) +
    fleck(T, 484, -17, 7, 5, "#9a7a68", 0.6) + `<path d="M484-19q4 1 6 3q-4 1-6-3z" fill="#0a0604"/>` });
  /* Haar auf dem Rüssel: oben dicht und kurz, zur Spitze lichter */
  s += LOCKEN(T, [[412, -252], [456, -252], [461, -150], [434, -140], [420, -200]], 70, 92, (x, y) => 6 + (y + 252) * 0.03, 1.8,
    (x, y) => Math.max(0, zylX((x - 410) / 52) - 0.05), TON, { streuung: 10, szene: 0.08, szeneB: 2 });
  if (fein) s += LOCKEN(T, [[434, -140], [461, -140], [456, -50], [438, -50]], 28, 94, 4, 0.8, (x, y) => zylX((x - 432) / 28), TON, { streuung: 14, jitter: 0.6 });
  /* Wange und Kinn: Haar wächst über die hintere Rüsselkante */
  s += LOCKEN(T, [[398, -248], [418, -246], [424, -206], [404, -196]], 36, 96, 16, 2.2, (x, y) => licht(x, y), TON, { streuung: 8, szene: 0.2 });

  /* Maul: kleiner dunkler Keil hinter dem Stoßzahn unter der Rüsselwurzel, Unterlippe leicht hängend */
  s += F([[408, -206], [422, -207], [428, -199], [420, -194], [409, -197]], "#1a0f0a") + F([[410, -197], [421, -195], [419, -190], [411, -192]], "#4a3830");
  /* ---------- Maul, naher Stoßzahn, Zahnscheide ---------- */
  const zahn = [[436, -214], [448, -188], [468, -160], [498, -140], [534, -130], [570, -136], [598, -158], [612, -190], [610, -226], [596, -254], [574, -270], [556, -274]];
  const ZW = [26, 8];
  let zz = LI(quer(zahn, ...ZW, 0.55).slice(2, 5), "#fff6e2", 1.4, ` opacity=".6"`) + LI(quer(zahn, ...ZW, 0.55).slice(6, 9), "#fff6e2", 1.4, ` opacity=".6"`) +
    LI(quer(zahn, ...ZW, 0.3).slice(3, 8), "#fff4dc", 3.4, ` opacity=".14"`) + LI(quer(zahn, ...ZW, -0.72), "#5a4630", 4, ` opacity=".4"`) +
    LI(zahn.slice(0, 4), "#8a7350", 18, ` opacity=".3"`) + LI(zahn.slice(9), "#9a7a48", 8, ` opacity=".35"`) +
    F(`M${zf(560, -277)}q-4 3-2 8q8 1 10-6z`, "#efe2c4", ` opacity=".5"`);
  if (fein) {
    let risse = "";
    for (let i = 1; i < 14; i++) {
      const t = 0.05 + i * 0.065, p = entlang(zahn, t), q = entlang(zahn, t + 0.01);
      const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1, w = 12 * (1 - t * 0.65);
      risse += "M" + zf(p[0] - dy / l * w, p[1] + dx / l * w) + "q" + zf(dy / l * w + dx / l * 1.5, -dx / l * w + dy / l * 1.5, 2 * dy / l * w, -2 * dx / l * w);
    }
    zz += `<path d="${risse}" stroke="#6a5638" stroke-width=".5" opacity=".22" fill="none"/>` +
      LI(quer(zahn, ...ZW, -0.15).slice(1, 10), "#6a5638", 0.5, ` opacity=".18"`) + LI(quer(zahn, ...ZW, 0.12).slice(2, 8), "#6a5638", 0.5, ` opacity=".14"`);
  }
  s += K(T, rohr(zahn, ...ZW, "rund"), T.lg("elf", [[0, "#ddd0b0"], [0.45, "#d0c09c"], [0.8, "#b39e78"], [1, "#8e7a58"]], 0, 0, 0.25, 1), { rand: false, vol: false, innen: zz });
  /* Zahnscheide: behaarte Schwellung vom Auge abwärts, oben beleuchtet, bedeckt die ersten 10 % des Zahns */
  s += K(T, [[414, -262], [440, -262], [450, -232], [452, -208], [448, -192], [436, -190], [424, -202], [414, -226]], wolle, { rand: false, vol: false, innen: fleck(T, 446, -196, 14, 10, S0, 0.45) });
  s += LOCKEN(T, [[416, -252], [446, -252], [450, -200], [428, -196]], 44, 92, 9, 1.5, (x, y) => Math.max(0, 0.8 - (y + 244) / 60), TON, { streuung: 10, szene: 0.15 });
  s += LOCKENLINIE(T, [[450, -200], [440, -192], [428, -196]], 10, [-3, 0], 96, 8, 2, () => 0.2, TON, { streuung: 10, szene: 0.3 });

  /* Kopfhaar: kurz, Stirn nach vorn-unten; Augenzone frei */
  const kopfZone = [[372, -324], [388, -338], [404, -352], [420, -354], [440, -346], [452, -326], [456, -300], [458, -262], [456, -240], [440, -236], [418, -236], [396, -246], [380, -292]];
  const ohneAuge = (x, y) => Math.hypot(x - auge[0], (y - auge[1]) * 1.2) > 13;
  {
    const zone = kopfZone;
    let pts = 0;
    const wrap = (x, y) => (ohneAuge(x, y) ? 1 : 0);
    s += LOCKEN(T, zone, 190, (x, y) => (y < -330 ? 70 : 84 + (x < 400 ? 6 : 0)), (x, y) => (ohneAuge(x, y) ? 11 + (y + 340) * 0.06 : 0.01), 1.5, kopfLicht, TON, { streuung: 8, szene: 0.1, szeneB: 3 });
  }
  /* Augenzone: kurzes Haar, strahlig vom Auge weg */
  if (fein) {
    const AZ = []; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; AZ.push([auge[0] + Math.cos(a) * 15, auge[1] + Math.sin(a) * 12]); }
    s += LOCKEN(T, AZ, 36, (x, y) => Math.atan2(y - auge[1], x - auge[0]) * 180 / Math.PI + 20, (x, y) => Math.min(4, Math.hypot(x - auge[0], y - auge[1]) * 0.3), 0.9, kopfLicht, TON, { streuung: 12, jitter: 0.5 });
  }
  /* Stirnschopf: angelegt, fällt nach vorn-unten über die Stirn */
  s += LOCKENLINIE(T, [[392, -348], [408, -356], [424, -356], [440, -346], [450, -330]], 34, [-1, 8], 62, 13, 1.8, (x, y) => 0.9, TON, { streuung: 10, szene: 0.25 });
  /* Haar über dem Ohr (oberer und hinterer Rand bedeckt) */
  s += LOCKEN(T, [[364, -296], [392, -296], [392, -280], [366, -266]], 26, 100, 11, 1.6, kopfLicht, TON, { streuung: 8, szene: 0.2 });

  /* ---------- Auge mit Hautfalten und langen Wimpern ---------- */
  s += AUGE2(T, auge[0], auge[1], 7.4, 3.8, { iris: "#3a2410", iris2: "#6a4422", winkel: -6, falten: 3, wimpern: 10, wl: 2.4, wwinkel: 70, haut: "#3a2a20", hautHell: "#b08866" });

  return { svg: s, box: [20, -357, 618, 0], fuesse: [356, 334, 76, 100], kopf: [364, -364, 500, -180] };
}

/* =====================================================================
   DIE SÄBELZAHNKATZE (Smilodon fatalis)
   RECHERCHE: Schulterhöhe ~100 cm, Kopf-Rumpf ~175 cm, Schwanz nur ~35 cm (reicht
   kaum bis zum Sprunggelenk), 160–280 kg – so lang wie ein Löwe, aber viel
   gedrungener und muskulöser: kurze Lendenpartie, Rücken fällt zur Kruppe leicht ab,
   sehr kräftige Vorderbeine (Oberarm, Unterarm) mit breiten Pfoten und
   einziehbaren Krallen, kürzere Hinterbeine (Zehengänger). Obere Eckzähne ~18 cm
   Krone, flach wie eine Klinge, leicht nach hinten gebogen, fein gesägt; sie ragen
   bei geschlossenem Maul unter dem Kinn hervor (Unterkiefer mit Knochenlappen).
   Lippenlinie kurz und katzentypisch, Nase und Ohren wie bei heutigen Katzen
   (Antón et al. 1998) – keine Hängelippen. Augen nach vorn, Pupille rund.
   Fellfarbe unbekannt: wie in den Rekonstruktionen (Antón) gelbbraun, Bauch hell,
   Rücken dunkler, nur ganz schwache Tupfen; kurzes, dichtes Fell.
   ===================================================================== */
/* gleiche Drehrichtung für alle Teilpfade (dann ergibt nonzero die Vereinigung) */
const flaeche = (p) => p.reduce((a, q, i) => { const n = p[(i + 1) % p.length]; return a + q[0] * n[1] - n[0] * q[1]; }, 0);
const gleich = (p) => (flaeche(p) < 0 ? p.slice().reverse() : p);
/* vereinigte Silhouette: Rand HINTER der Füllung (nur die Außenkante bleibt), Füllung, geklippte Innenzeichnung */
function silhouette(T, teile, fill, innen, rand = "#2a1a0c", rw = 0.7) {
  const d = teile.map((p) => glatt(gleich(p))).join("");
  T._n = (T._n || 0) + 1;
  const id = T.id("e" + T._n);
  T.def(`<clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  return `<defs><path id="${id}" d="${d}"/></defs><use href="#${id}" fill="none" stroke="${rand}" stroke-opacity=".16" stroke-width="${rw}"/>` +
    `<use href="#${id}" fill="${fill}"/><g clip-path="url(#${id}c)">${innen}<use href="#${id}" fill="${T.VOL()}"/></g>`;
}

function saebelzahn(T) {
  GEN = 10;
  const fein = T.fein !== false;
  SZ = !fein; SZMIN = 0.25;
  FLMIN = 0.2;
  const S0 = "#000", HL = "#fff2d6", CREME = "#ecdfc6";
  const FT = [["#4e321a", 0.4, 0.13], ["#6a4626", 0.38, 0.12], ["#8a6038", 0.34, 0.12], ["#c49a66", 0.36, 0.11], ["#f2dcb4", 0.42, 0.1]];
  let s = "";
  /* kompakter Rumpf: alles vor der Mitte rückt 10 cm nach hinten (kurze Lende, wuchtige Vorderhand) */
  const c = (x) => (x <= 90 ? x : x <= 130 ? x - (x - 90) * 0.25 : x - 10);
  const C = (pts) => pts.map(([x, y, h]) => [c(x), y, h]);
  const KV = -10, kg = `<g transform="translate(${KV} 0)">`;

  /* ---------- Formen (cm). Widerrist 100 cm, Kopf-Rumpf ~170 cm, Schwanz 35 cm ---------- */
  const rumpf = C([[22, -85], [36, -89.5], [60, -92.5], [92, -94.5], [112, -98], [126, -101.5], [138, -101], [150, -99], [158, -97], [164, -86], [163, -78],
    [157, -70], [153, -62], [151, -54], [146, -48], [136, -45.6], [122, -45.4], [106, -48], [90, -52.5], [76, -57.5], [64, -62], [54, -65], [40, -66.5], [26, -66],
    [18, -71], [14.5, -78], [16, -84]]);
  const vbein = (dx) => C([[146, -78], [147.5, -68], [144, -59], [138.5, -50], [137, -43], [135.6, -33], [134.6, -24], [134.2, -16.5], [135.6, -11.5], [137.6, -9.4], [139.4, -9], [141, -7.6], [142.6, -7.2], [144, -5.6], [145.4, -4.8],
    [146.8, -2.6], [146.4, 0, 1], [124, 0, 1], [122.4, -3.2], [122.8, -7.4], [121.8, -10.6], [123.4, -14.5], [122.4, -22], [120.8, -32], [119.6, -41],
    [116.8, -47.5], [113.4, -54], [112, -64], [113, -74], [120, -84]].map(([x, y, h]) => [x + dx, y, h]));
  const hbein = (dx) => [[54, -80], [60.5, -67], [63, -57], [62, -49.5], [58, -44], [50.5, -36.5], [44.5, -29.5], [41.6, -24], [42, -16], [43.4, -8.4],
    [45.4, -6.6], [46.8, -6.2], [48.2, -4.8], [49.4, -4.4], [50.8, -2.4], [51, -0.9], [50, 0, 1], [33, 0, 1], [32, -2.6], [33, -6.4], [34.4, -12], [35, -20], [33.2, -26.2], [32.6, -30.5], [28.6, -38.5],
    [24.4, -46.5], [20.6, -56], [16.4, -66], [14.6, -76], [18, -84]].map(([x, y, h]) => [x + dx, y, h]);
  const kopf0 = [[152, -92], [155, -99], [162, -104.6], [170, -106.2], [177, -104.8], [182.4, -101.6], [187.6, -99.6], [192, -97.8], [195, -96.4], [196.8, -94.4],
    [196.6, -91.6], [196, -88.4], [195.2, -85.4], [193.6, -83.6], [189.5, -83], [187, -82.8], [186.8, -79], [186.2, -76.2], [184.2, -75.4], [178, -76],
    [170.5, -77.4], [164, -80.4], [159, -84.5], [154, -88]];
  const kopf = kopf0.map(([x, y]) => [x + KV, y]);
  const VN = vbein(0), HN = hbein(0), VF = vbein(-15), HF = hbein(13);

  const grund = T.lg("grund", [[0, "#8a5f34"], [0.12, "#a37444"], [0.32, "#b98a54"], [0.55, "#c39864"], [0.8, "#bd9260"], [1, "#a88052"]], 0, -107, 0, 0, UB);
  /* Zylinderlicht eines Beins: Lichtstreif links, Kernschatten rechts, schmales Reflexlicht – weich gemalt */
  const beinLicht = (P, y0, y1, k = 1) => FO(streifen(P, y0, y1, 0.1, 0.36, 5), HL, 0.3 * k) + FO(streifen(P, y0, y1, 0.66, 0.9, 5), S0, 0.36 * k) + FO(streifen(P, y0 + 4, y1, 0.92, 0.99, 5), "#e8c898", 0.25 * k);

  /* ---------- ferne Beine (im Körperton, 20 % dunkler, Form sichtbar) ---------- */
  for (const [P, y0] of [[VF, -46], [HF, -60]]) {
    s += K(T, P, grund, { rand: false, vol: false, innen: `<rect x="0" y="-110" width="200" height="110" fill="#000" opacity=".2"/>` + WEICH(T, beinLicht(P, y0, -2, 0.8), 1.2) +
      fleck(T, P[0][0] - 10, -1, 14, 2.2, S0, 0.5) });
    s += FELL(T, P.slice(4, P.length - 3), 36, (x, y) => (y < -40 && P === HF ? 120 : 93), 0.6, (x, y) => zylX(quer_u(P, x, y)) * 0.7, FT, { szene: 0 });
  }

  /* ---------- Schwanz: Stummel wie beim Luchs, Spitze auf halber Oberschenkelhöhe, dunklere Spitze ---------- */
  const schw = [[25, -88], [17, -86.5], [11, -81], [8, -73], [7.4, -65], [8.6, -59.6], [11.8, -60.4], [13, -67], [14.8, -75], [19, -80.6], [25, -82]];
  s += K(T, schw, T.lg("schw", [[0, "#9c7040"], [0.7, "#8a6036"], [1, "#4e3018"]], 0, -88, 0, -59, UB), { rand: false, vol: false, innen:
    WEICH(T, FO([[9, -80], [12, -82], [10, -64], [8.4, -64]], HL, 0.25) + FO([[13, -78], [15, -76], [12.6, -62], [11, -62]], S0, 0.3), 1) });
  s += FELL(T, schw, 30, 100, 0.8, (x) => zylX((x - 7) / 9), FT, { szene: 0.2 });

  /* ---------- Körper, nahe Beine und Kopf als eine Fläche, Licht oben links ---------- */
  const licht = WEICH(T,
    /* Lichtband Widerrist–Rücken–Kruppe; Kernschatten im unteren Rumpfdrittel; Bodenreflex an der Bauchkante */
    FO(C([[20, -86], [40, -91], [92, -95.5], [126, -102.5], [150, -100], [150, -95], [126, -96], [92, -89], [40, -85], [22, -81]]), HL, 0.4) +
    FO(C([[56, -64], [86, -58], [118, -53], [146, -56], [150, -50], [122, -47], [100, -49], [76, -56], [60, -60]]), S0, 0.3) +
    /* Gegenschattierung: Bauch, Brust, Kehle, Kinn */
    FO(C([[64, -61], [92, -54], [122, -46.8], [140, -47], [148, -50], [126, -50.4], [100, -53.6], [72, -60.4]]), CREME, 0.6) +
    FO(C([[152, -78], [158, -82], [163, -77], [160, -64], [154, -56], [151, -62]]), CREME, 0.5) +
    /* Okklusion: Achsel, Leiste, Kopf auf den Hals */
    FO(C([[113, -55], [121, -51], [124, -46], [116, -46], [111, -50]]), S0, 0.22) + FO([[56, -64], [63, -61], [64, -53], [58, -55]], S0, 0.3) +
    FO(C([[150, -98], [156, -97], [160, -86], [154, -82], [148, -88]]), S0, 0.16) +
    /* Schulterblatt mit Gräte, Trizeps-Wulst über dem Ellbogen, Oberarm */
    FO(C([[122, -99], [134, -98], [146, -84], [148, -75], [140, -76], [130, -88]]), HL, 0.26) + FO(C([[118, -96], [124, -96], [134, -82], [138, -72], [133, -72], [123, -86]]), S0, 0.06) +
    FO(C([[114, -70], [124, -72], [130, -64], [124, -58], [116, -60]]), HL, 0.1) + FO(C([[112, -60], [120, -56], [118, -50], [112, -52]]), S0, 0.14) +
    FO(C([[138, -78], [146, -76], [146, -64], [140, -60], [136, -68]]), HL, 0.24) +
    /* Halsmuskel vom Ohr zur Schulter (Licht), Schatten unter dem Hals */
    FO(C([[150, -96], [158, -94], [150, -78], [142, -72], [140, -80]]), HL, 0.22) + FO(C([[154, -74], [162, -80], [160, -66], [152, -60]]), S0, 0.18) +
    /* Brustkorb und Flanke */
    FO(C([[84, -80], [104, -83], [118, -78], [112, -68], [92, -66], [80, -72]]), S0, 0.05) + FO(C([[86, -89], [106, -92], [118, -89], [104, -85], [88, -85]]), HL, 0.08) +
    /* Keule: Lichtfleck, Schatten an der Hinterkante, Furche; Wade, Achillessehne */
    FO([[24, -84], [42, -86], [52, -76], [46, -67], [32, -67], [22, -74]], HL, 0.24) + FO([[14, -78], [19, -78], [23, -62], [23, -50], [18, -58]], S0, 0.24) +
    FO([[26, -78], [28.6, -78], [27.6, -60], [25.4, -60]], S0, 0.08) + FO([[52, -76], [60, -68], [62, -57], [56, -61], [52, -68]], S0, 0.1) +
    FO([[28, -48], [36, -44], [40, -34], [34, -32], [28, -38]], HL, 0.14) + FO([[31.6, -38], [33.2, -38], [34.4, -28], [33.4, -27.6]], HL, 0.35) +
    FO([[34.6, -36], [37, -36], [37, -29], [35.6, -29]], S0, 0.18) +
    /* Zylinderlicht der nahen Beine */
    beinLicht(VN, -46, -2) + beinLicht(HN, -44, -2) +
    /* Kopf (im Kopf-Koordinatensystem): Schädelkugel, Nasenrücken, Kaumuskel, Jochbogen, Schläfenmuskel, Augenhöhle, Gesichtsflecken */
    kg + FO([[162, -104], [172, -105.6], [180, -103], [174, -100.4], [164, -100.8]], HL, 0.26) + FO([[183, -100.6], [192, -97.2], [192.4, -96], [184, -98.6]], HL, 0.3) +
    FO([[162, -92], [170, -91], [173, -85], [168, -80.5], [161, -84]], HL, 0.14) + FO([[160, -84], [168, -80.5], [172, -78.4], [162, -79]], S0, 0.18) +
    FO([[165, -94.4], [176, -95.4], [178, -94], [166, -93]], HL, 0.28) + FO([[165, -92.6], [176, -93], [175, -91.4], [166, -91.2]], S0, 0.14) +
    FO([[164, -101], [174, -100.6], [177, -98.6], [168, -97.4]], S0, 0.12) + FO([[177.2, -99.8], [183.6, -99.6], [184, -96.4], [177, -96.6]], S0, 0.16) +
    FO([[164, -79.6], [176, -77.4], [185.6, -76.4], [186.4, -80.6], [180, -82.2], [170, -82.4]], CREME, 0.85) +
    FO([[186.5, -91.5], [192, -93.5], [195.5, -90], [195, -85.4], [189, -84.6], [185.5, -87.5]], CREME, 0.75) +
    FO([[176.5, -101.8], [181, -102.6], [184.6, -100.4], [181, -100.6]], CREME, 0.6) + FO([[176, -94.6], [181, -94.4], [184, -95.6], [180, -92.8]], CREME, 0.65) +
    FO([[160, -84], [170, -80], [178, -78], [168, -76], [158, -78]], S0, 0.25) + "</g>", 2.2);
  const innen = TX(T, "kurz", { fx: 1.4, fy: 0.2, farbe: "#4a2e14", staerke: 2, schwelle: 0.64, okt: 2 }, 80, 0.08, [0, -110, 200, 0]) + licht +
    fleck(T, c(135), -1, 13, 2, S0, 0.45) + fleck(T, 41, -1, 10, 2, S0, 0.45);
  const d = [rumpf, VN, HN, kopf].map((p) => glatt(gleich(p))).join("");
  s += K(T, d, grund, { rand: false, vol: false, innen });

  /* ---------- Fell Haar für Haar: Nase → Kopf → Hals schräg nach hinten-unten → Flanke diagonal → Beine abwärts ---------- */
  const lichtR = (x, y) => Math.max(0, Math.min(1, zyl(Math.max(0, (y + 101) / 52)) + (x < 50 ? 0.04 : 0)));
  s += FELL(T, rumpf, 640, (x, y) => (x > 140 ? 150 : 135 + (y + 95) * -0.6), 1.1, lichtR, FT, { streuung: 9, szene: 0.09 });
  for (const P of [VN, HN]) s += FELL(T, P.slice(3, P.length - 4), 120, (x, y) => (y < -45 && P === HN ? 120 : 93), 0.6, (x, y) => zylX(quer_u(P, x, y)), FT, { streuung: 8 });
  s += kg + FELL(T, kopf0, 280, (x, y) => (y > -82 ? 175 : 182 + (y + 96) * -0.8), 0.5, (x, y) => zyl(Math.max(0, (y + 106) / 30)) + 0.05, FT, { streuung: 12 }) + "</g>";
  /* feiner Fellsaum an der Lichtkante (quer zur Kante) und an der Bauchkante */
  s += LOCKENLINIE(T, C([[22, -85], [36, -89.5], [60, -92.5], [92, -94.5], [112, -98], [126, -101.5], [138, -101], [150, -99]]), 70, [0.3, 1], 205, 0.8, 0.1,
    () => 0.85, ["#c49a66", "#e8cc9c"], { streuung: 18, genau: 1, szene: 0 });
  s += LOCKENLINIE(T, C([[64, -61], [92, -54], [122, -46.4], [140, -46.4]]), 30, [-1, 0], 98, 1.2, 0.12, () => 0.6, ["#c4a07a", "#ecdcc0"], { streuung: 12, genau: 1, szene: 0 });

  /* ---------- Kopfdetails (Kopfkoordinaten, um KV verschoben) ---------- */
  let k = kg;
  /* Ohr: klein, rund, Muschel mit heller behaarter Innenseite und Falte, dunklerer Rand */
  k += K(T, [[160.4, -101.8], [160.4, -105.6], [162.4, -109], [165.2, -109.4], [167.6, -106.8], [167.6, -103], [166, -101.4]],
    T.lg("ohr", [[0, "#5a3a1c"], [0.4, "#8a6036"], [1, "#a87a46"]], 0, 0, 1, 0), { rand: false, vol: false, innen:
    FO([[163.4, -102.6], [163.8, -106.6], [165.6, -107.6], [166.8, -104.8], [166, -102.2]], "#e2cfae", 0.85) +
    LI([[164.4, -103.2], [164.9, -105.8], [165.8, -106.8]], "#7a5a3a", 0.25, ` opacity=".6"`) + LI([[160.6, -104], [161.8, -107.6], [164.6, -109.2]], "#3a2412", 0.5, ` opacity=".5"`) });
  k += LOCKEN(T, [[163.8, -103], [165.8, -107.6], [166.8, -103.6]], 16, 250, 2.2, 0.16, () => 1, ["#f4ead8"], { genau: 1, szene: 0 });
  /* Schnurrhaarpolster: Punktreihen */
  if (fein) {
    let dd = "";
    for (let r = 0; r < 5; r++) for (let i = 0; i < 5 - (r > 2 ? 1 : 0); i++) dd += "M" + z2(187.6 + i * 1.5 + r * 0.45, -91 + r * 1.25) + "h.01";
    k += `<path d="${dd}" stroke="#4a2e18" stroke-width=".4" stroke-linecap="round" opacity=".28"/>`;
  }
  /* Nasenspiegel: klein, im Profil dreieckig, dunkel graurosa, kühler Glanz oben; Nasenloch als nach hinten geschwungene Linie */
  k += K(T, [[193.4, -96.4], [196, -95.2], [197, -93.2], [196.4, -92.2], [194.4, -92.6]], T.lg("nase", [[0, "#7a5a56"], [1, "#3a2826"]]), { rand: false, vol: false, innen:
    `<path d="M196.4-93q-1.1-.1-1.6.8" stroke="#140a08" stroke-width=".36" fill="none"/>` + fleck(T, 195, -95.4, 1.1, 0.4, "#e8eef4", 0.7) });
  k += LI([[196.2, -92.2], [196, -89.6], [195.2, -86.4]], "#3a2416", 0.26, ` opacity=".55"`);
  /* Schneidezähne (halb hinter der Lippe), kleiner unterer Eckzahn hinter der Lippenlinie */
  k += F([[191, -83.3], [193.8, -83.6], [194.1, -82.8], [192.6, -82.5], [191.2, -82.7]], "#e6dcc4", ` stroke="#8a7a5a" stroke-width=".1"`);
    /* Säbel: flache Klinge, Vorderkante gewölbt, leicht nach hinten gebogen, beide Kanten fein gesägt, Wurzel gelblich */
  const vk = [[191, -83.4], [191.5, -80], [191.1, -76], [190, -72.6], [188.2, -69.8]], hk = [[187.2, -83.4], [187, -80], [186.9, -76.2], [186.6, -72.6]];
  const saege = (L, f, n) => { const o = []; for (let i = 0; i <= n; i++) { const p = entlang(L, i / n); o.push([p[0] + (i % 2 ? f : 0), p[1]]); } return o; };
  const sab = fein ? [...saege(vk, 0.1, 22), [186.4, -68.6, 1], ...saege(hk.slice().reverse(), -0.12, 22)] : [...vk, [186.4, -68.6, 1], ...hk.slice().reverse()];
  const sd = fein ? "M" + sab.map(([x, y]) => z2(x, y)).join("L") + "Z" : glatt([[191.8, -83.4], [192.4, -76], [190, -70], [185.8, -66.6, 1], [185.6, -76], [185.8, -83.4]]);
  k += K(T, sd, T.lg("zahn", [[0, "#efe4c8"], [0.45, "#f6efdc"], [1, "#c4b292"]], 0, 0, 1, 0), { rand: "#9a8a6e", randA: 0.8, rw: 0.1, vol: false, innen:
    `<rect x="185" y="-84" width="8" height="5" fill="${T.lg("zahnw", [[0, "#c8a870"], [1, "#c8a870", 0]])}"/>` +
    LI([[190.6, -81], [190.8, -77], [189.8, -73], [188.2, -70.4]], "#fffaf0", 0.55, ` opacity=".9"`) + LI([[187.5, -81], [187.4, -76], [187.1, -72.4]], "#7a6a4c", 0.8, ` opacity=".3"`) });
  k += F([[183.8, -83.4], [185.4, -83.6], [185, -81.2]], "#d8ccb0", ` stroke="#8a7a5a" stroke-width=".1"`);
  /* Oberlippe fällt über die Zahnwurzel; kurze Lippenlinie zum Mundwinkel */
  k += F([[186.4, -84.2], [192, -84.6], [194.6, -84], [193.4, -82.4], [191.2, -82.3], [188.6, -82], [186.6, -82.6]], T.lg("lippe", [[0, "#c8a07a"], [1, "#8a6a4e"]]));
  k += LI([[194.6, -83.4], [191.4, -82.3], [188.4, -82], [186, -82.6], [182.6, -83.4], [179.6, -84.4]], "#24140c", 0.36, ` opacity=".8"`);
  /* Auge: groß, leicht nach vorn, Bernstein mit Fasern, runde Pupille; Tränenlinie vom inneren Winkel, schmal */
  k += AUGE2(T, 180.6, -97.6, 4.6, 2.9, { iris: "#c48a2a", iris2: "#e2b24a", winkel: 12, falten: 0, wimpern: 0 });
  if (fein) {
    let fa = "";
    for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2; fa += "M" + z2(180.88 + Math.cos(a) * 0.55, -97.55 + Math.sin(a) * 0.55) + "L" + z2(180.88 + Math.cos(a) * 1.55, -97.55 + Math.sin(a) * 1.55); }
    k += `<g transform="rotate(12 180.6 -97.6)"><path d="${fa}" stroke="#7a4a12" stroke-width=".06" opacity=".5"/></g>`;
  }
  k += F([[182.7, -96.5], [183.2, -96.4], [185.6, -93.2], [186.2, -91.8], [185.4, -92.4]], "#3a2010", ` opacity=".6"`);
  /* Tasthaare */
  const W0 = []; for (let i = 0; i < 14; i++) W0.push([188.4 + (i % 5) * 1.3, -90.4 + Math.floor(i / 5) * 1.3 + (i % 2) * 0.4]);
  k += TASTHAARE(T, W0, (i) => (i < 10 ? 168 + i * 4.5 : 30 + (i - 10) * 12), 16, 0.22, "#f6f0e4", 0.72);
  k += TASTHAARE(T, [[179.6, -100.4], [180.6, -100.8], [181.6, -100.6]], (i) => 228 + i * 10, 5, 0.12, "#f6f0e4", 0.7);
  s += k + "</g>";

  /* ---------- Pfoten: Zehen als getrennte Rundungen, Krallenscheiden, Afterkralle ---------- */
  const zehen = (x0, x1, y0) => {
    let o = "";
    for (let i = 1; i < 4; i++) { const x = x0 + (x1 - x0) * i / 4; o += "M" + z2(x - 0.3, y0 + Math.abs(i - 2) * 0.5) + "q" + z2(0.6, 1.8, 0.2, 4.4 - Math.abs(i - 2) * 0.5); }
    return `<path d="${o}" stroke="#3a2412" stroke-width=".45" fill="none" opacity=".4"/>`;
  };
  s += zehen(c(134.6), c(148.6), -7.4) + zehen(42, 52, -5.8);
  s += `<path d="M${z2(c(140.4), -1.4)}q1.6.2 2.4 1.2M${z2(c(143.6), -2.6)}q1.4.4 2 1.6" stroke="#2a1a0e" stroke-width=".35" fill="none" opacity=".7"/>`;
  s += F(C([[122.8, -11.2], [121.2, -10.2], [120.2, -8.2], [120.6, -7.4], [121.4, -8.6], [122.6, -9.6]]), T.lg("kralle", [[0, "#2a1e16"], [1, "#a89c88"]], 0, 0, 0, 1));

  return { svg: s, box: [7.4, -110.6, 187, 0], fuesse: [c(135), c(120), 41.5, 54.5], kopf: [140, -112, 190, -64] };
}

/* =====================================================================
   DAS WOLLNASHORN (Coelodonta antiquitatis)
   RECHERCHE: Kopf-Rumpf 3,2–3,6 m, Schulterhöhe 1,45–1,6 m, bis 2 t. Kräftiger
   Schulterbuckel (trägt das schwere Horn, Fettspeicher). Kopf tief getragen (Grasfresser,
   breite eckige Oberlippe wie beim Breitmaulnashorn). Vorderes Horn 1–1,35 m lang,
   seitlich flach gedrückt, schräg nach vorn-oben, Vorderkante vom Schneeschieben
   abgeschliffen; hinteres Horn bis ~47 cm. Kleine Augen, kleine spitze Ohren mit
   Haarbüschel, kurzer Schwanz mit Quaste, kurze stämmige Beine mit drei Zehen (Hufnägel).
   Fell (Mumien aus Sibirien, Sasha 2015): dichte Unterwolle, darunter rotbraun bis
   dunkelbraun, langes Haar an Hals, Buckel und Bauch, kürzer an Beinen und Kopf.
   Chauvet: dunkles Band um die Körpermitte.
   ===================================================================== */
function wollnashorn(T) {
  GEN = 1;
  const fein = T.fein !== false;
  SZ = !fein; SZMIN = 0.25; FLMIN = 0.3;
  const S0 = "#000", W = "#fff3dc";
  const TON = ["#1e120a", "#2a190e", "#3a2313", "#4c2f19", "#603c20", "#764a28", "#8e5c32", "#a6703e"];
  const FERN = ["#1c140e", "#261b13", "#322419", "#3e2e20", "#4a3828", "#584330"];
  const SPITZ = [["#b8804a", 0.8], ["#cc9658", 0.75]];
  const wolle = T.lg("wolle", [[0, "#9c6a40"], [0.25, "#805432"], [0.55, "#5e3c22"], [0.8, "#3a2416"], [1, "#46301f"]], 0, -166, 0, -60, UB);
  let s = "";

  /* ---------- Form: Fettbuckel über Widerrist und Nacken, flacher Sattel, runde, tiefere Kruppe ---------- */
  const ruecken = [[16, -108], [24, -122], [44, -131], [80, -134], [120, -135], [160, -139], [188, -148], [206, -159], [224, -166], [242, -163], [258, -153], [274, -140], [288, -128]];
  const top = (x) => bei(ruecken, Math.max(16, Math.min(288, x)));
  const bauchY = (x) => (x > 262 ? -60 : x > 60 ? -62 - Math.max(0, 120 - x) * 0.12 : -78 - (60 - x) * 0.4);
  const t_ = (x, y) => (y - top(x)) / (bauchY(x) - top(x));
  const licht = (x, y) => {
    let v = zyl(t_(x, y)) + (x < 120 ? 0.04 : 0);
    if (x > 262 && y > -96) v -= 0.18;                     // unter Kopf und Hals
    return Math.max(0, Math.min(1, v));
  };
  const fluss = (x, y) => { const t = t_(x, y); return x > 262 ? 100 : 94 + 24 * Math.max(0, 1 - t / 0.5); };
  /* Länge: am Widerrist, Nacken und an der Kehle am längsten, Flanke und Keule 40 % kürzer */
  const lang = (x, y) => { const t = t_(x, y); const zone = x > 180 ? 1 : x > 140 ? 0.6 + (x - 140) / 100 : 0.6; return (12 + 22 * Math.min(1, t / 0.7)) * zone + 4; };

  /* ---------- Beine: Ellbogenmasse, Handgelenk-Verdickung bei 40 cm; Oberschenkel, Knie, Ferse bei 45 cm ---------- */
  const vorderbein = (cx) => glied([[cx + 4, -124, 26, 22], [cx - 2, -84, 26, 20], [cx, -62, 22, 19], [cx + 1, -40, 18, 18], [cx + 1, -26, 15, 15], [cx + 1, -14, 15, 15]],
    [[cx + 16, -8], [cx + 17, -2], [cx + 16, 0, 1], [cx - 15, 0, 1], [cx - 16, -2], [cx - 15, -8]]);
  const hinterbein = (cx) => glied([[cx - 6, -124, 32, 24], [cx, -96, 30, 26], [cx + 4, -72, 22, 24], [cx + 1, -56, 17, 17], [cx - 1, -45, 19, 15], [cx, -28, 15, 15], [cx, -14, 15, 15]],
    [[cx + 16, -8], [cx + 17, -2], [cx + 16, 0, 1], [cx - 15, 0, 1], [cx - 16, -2], [cx - 15, -8]]);
  const beinLicht = (P, ferne) => (x, y) => {
    let v = zylX(quer_u(P, x, y)) * (ferne ? 0.72 : 1);
    if (y < -62) v -= 0.3 * Math.min(1, (-62 - y) / 24);
    return Math.max(0, Math.min(1, v));
  };
  const fuss = (cx, ferne) => {
    /* Fuß in Beinhaut, 15 % dunkler, Faltenringe; Hufe: III vorn und größer, IV seitlich weiter hinten, II als Sichel */
    const haut = ferne ? "#241a14" : T.lg("fhaut", [[0, "#5a4638"], [0.6, "#3a2c22"], [1, "#2a2019"]], 0, 0, 1, 0);
    let f = K(T, [[cx - 16, 0, 1], [cx - 16.5, -6], [cx - 15.5, -14], [cx - 15, -24], [cx + 15, -24], [cx + 16, -14], [cx + 17.5, -6], [cx + 17, 0, 1]], haut, { rand: false, vol: false, innen:
      (fein && !ferne ? `<path d="M${zf(cx - 15, -15)}q8 1.5 14 .4M${zf(cx - 3, -11)}q9 1.6 18-.4M${zf(cx - 15, -8)}q10 1.4 20 .2" stroke="#000" stroke-width=".6" opacity=".25" fill="none"/>` : "") +
      fleck(T, cx, -1, 18, 3, S0, 0.5) });
    const hg = ferne ? "#1a140f" : T.lg("huf", [[0, "#3a2c22"], [0.6, "#221810"], [1, "#120c08"]]);
    f += F([[cx + 4, 0, 1], [cx + 5, -6], [cx + 10, -8.5], [cx + 15, -6], [cx + 18, 0, 1]], hg) + F([[cx - 9, 0, 1], [cx - 8, -5], [cx - 4, -6.6], [cx + 1, -5], [cx + 2, 0, 1]], hg) +
      F([[cx + 16.5, -1, 1], [cx + 18.6, -4], [cx + 18.4, -1]], hg);
    if (!ferne) f += `<path d="M${zf(cx + 6.5, -6.4)}q3.5-1.8 7-.2M${zf(cx - 7, -4.4)}q3-1.4 6 0" stroke="#d0c0a8" stroke-width=".6" opacity=".45" fill="none"/>`;
    return f;
  };
  const bein = (P, cx, ferne) => {
    let b = K(T, P, ferne ? "#2a1c12" : T.lg("beinn", [[0, "#4a2e1a"], [0.6, "#3a2414"], [1, "#2a1a0e"]], 0, -124, 0, 0, UB), {
      rand: false, vol: false, innen: `<rect x="${cx - 40}" y="-130" width="80" height="130" fill="${T.lg("beinx", [[0, "#fff", 0.1], [0.3, "#fff", 0.06], [0.55, "#000", 0], [0.75, "#000", 0.32], [0.92, "#000", 0.2], [1, "#000", 0.1]], 0, 0, 1, 0)}"/>` +
        fleck(T, cx, -84, 30, 22, S0, 0.45) + (ferne ? `<rect x="${cx - 40}" y="-130" width="80" height="130" fill="#203040" opacity=".12"/>` : "") });
    b += fuss(cx, ferne);
    /* kurzes, dichtes Beinfell bis zur Fessel */
    b += LOCKEN(T, [[cx - 22, -120], [cx + 22, -120], [cx + 18, -24], [cx - 18, -24]], ferne ? 36 : 80, 91, (x, y) => 7 + (y + 120) * 0.03, 1.8, beinLicht(P, ferne), ferne ? FERN : TON, { streuung: 9, szene: ferne ? 0 : 0.12, szeneB: 2.2 });
    b += LOCKENLINIE(T, [[cx - 17, -26], [cx + 17, -26]], ferne ? 8 : 16, [-4, 0], 92, 9, 2.4, beinLicht(P, ferne), ferne ? FERN : TON, { streuung: 12, szene: 0.3 });
    return b;
  };
  const VF = vorderbein(214), HF = hinterbein(92), VN = vorderbein(234), HN = hinterbein(68);
  s += bein(VF, 214, true) + bein(HF, 92, true);

  /* ---------- Schwanz: Ansatz auf 85 % der Kruppenhöhe, eng am Gesäß, 0,47 m, behaart, Endquaste ⅓ ---------- */
  s += K(T, [[24, -118], [17, -112], [13, -100], [12, -86], [13, -78], [17, -78], [18, -88], [20, -102], [26, -110]], "#3a2414", { rand: false, vol: false });
  s += LOCKEN(T, [[12, -116], [22, -116], [18, -84], [12, -84]], 24, 96, 8, 2, () => 0.35, TON, { streuung: 8, szene: 0.2 });
  s += LOCKEN(T, [[11, -84], [18, -84], [18, -78], [11, -78]], 22, 95, 15, 1.8, () => 0.28, TON, { streuung: 10, szene: 0.4 });

  s += bein(HN, 68, false) + bein(VN, 234, false);

  /* ---------- Rumpf, Hals und Kopf ---------- */
  const kopfOben = [[288, -128], [298, -124], [306, -116], [318, -104], [332, -92], [344, -84]];
  const schnauze = [[352, -78], [358, -72], [361, -64], [361, -56], [359, -49], [354, -45], [346, -44], [338, -45], [342, -41], [338, -37.6], [326, -37], [312, -39],
    [300, -45], [292, -52], [280, -58], [266, -62]];
  const koerper = [...ruecken, ...kopfOben, ...schnauze, [240, -60], [200, -62], [160, -63], [120, -64], [84, -68], [56, -78], [34, -90], [20, -98]];
  s += K(T, koerper, wolle, { rand: false, vol: false, innen:
    BAND(T, ruecken.slice(1, 12).map(([x, y]) => [x, y + 10]), fein ? 7 : 4, fein ? 34 : 50, 14, "#c89660", 0.4) +
    BAND(T, [[50, -88], [120, -82], [200, -80], [256, -84]], fein ? 4 : 3, fein ? 50 : 70, 22, S0, 0.35) +
    (fein ? `<rect x="0" y="-170" width="370" height="140" fill="${WOLLE(T, "n", "#1a0e06", 20, 26, 4)}" opacity=".22"/>` : "") +
    /* Kopf: nackte, runzlige Schnauze; Jochbogen hell, Kieferwinkel dunkel; Schlagschatten des Horns auf Stirn und Wange */
    F([[340, -58], [352, -66], [360, -62], [361, -52], [356, -46], [346, -45], [338, -50]], T.lg("schn", [[0, "#4e3e34"], [1, "#2e2420"]]), ` opacity=".85"`) +
    fleck(T, 312, -54, 14, 10, S0, 0.4) + fleck(T, 302, -74, 16, 5, "#c89660", 0.3, 20) + fleck(T, 326, -86, 14, 6, S0, 0.4, -30) });
  /* Schnauzenhaut: Runzeln (nur fein) */
  if (fein) s += RF(T, "schnauze", { f: 0.5, tiefe: 0.3, okt: 2 }, F([[342, -56], [352, -63], [359, -60], [359, -52], [350, -48], [340, -51]], "#3a2c24", ` opacity=".4"`));

  /* ---------- Fell in Strähnen ---------- */
  const rumpfZone = [[22, -118], [44, -129], [120, -133], [188, -146], [224, -163], [258, -151], [280, -132], [296, -112], [300, -84], [290, -58], [240, -64],
    [160, -65], [100, -66], [56, -80], [24, -100]];
  s += LOCKEN(T, rumpfZone, 230, fluss, lang, 4.2, (x, y) => licht(x, y) * 0.86, TON, { streuung: 7, kruemmung: 0.1, szene: 0.12, szeneB: 2.2 });
  s += LOCKEN(T, rumpfZone, 180, fluss, (x, y) => lang(x, y) * 0.7, 3, licht, TON, { streuung: 7, kruemmung: 0.12, szene: 0.08, szeneB: 2.2 });
  if (fein) s += LOCKEN(T, [[26, -122], [44, -131], [120, -135], [188, -148], [224, -165], [256, -154], [240, -146], [180, -136], [100, -126], [40, -114]],
    56, fluss, (x, y) => lang(x, y) * 0.8, 1.1, () => 1, SPITZ, { streuung: 6, jitter: 0.4 });
  /* Scheitel auf der Rückenlinie, Strähnenspitzen über die Kontur */
  s += LOCKENLINIE(T, ruecken.slice(0, 12), 52, [-3, 7], (x, y) => fluss(x, y + 6) + 6, (x) => (x > 180 && x < 270 ? 18 : 12), 2.6, (x, y) => licht(x, y + 6), TON, { streuung: 8, szene: 0.15, szeneB: 1.6 });
  s += LOCKENLINIE(T, ruecken.slice(1, 12), 30, [1, 4], (x) => (x > 210 ? 150 : 172), (x) => (x > 180 && x < 270 ? 14 : 10), 1.6, (x, y) => licht(x, y) + 0.05, TON, { streuung: 8, szene: 0.1 });
  /* Bauch-, Brust- und Kehlbehang: unregelmäßig lang (±40 %), einzelne Locken über den Beinen */
  const rz = [[60, -84], [120, -72], [200, -70], [262, -72], [292, -60], [300, -50], [270, -58], [200, -60], [120, -62], [60, -76]];
  s += LOCKEN(T, rz, 130, (x) => 93 + (x > 262 ? -6 : 0), (x) => (x > 250 ? 34 : 24) * (0.6 + 0.8 * ((x * 7.3) % 1)), 3.2, (x, y) => 0.22 + 0.1 * Math.max(0, (y + 50) / 30), TON,
    { streuung: 6, kruemmung: 0.1, szene: 0.1, szeneB: 2.4, jitter: 0.8 });

  /* ---------- Kopf: kurzes Haar von der Nase zum Ohr, Augenzone frei ---------- */
  const auge = [304, -82];
  const kopfZone = [[288, -126], [298, -122], [318, -102], [332, -90], [344, -82], [356, -74], [360, -66], [350, -64], [340, -58], [330, -50], [314, -44], [300, -46], [290, -60], [286, -100]];
  const kopfLicht = (x, y) => Math.max(0, Math.min(1, zyl(Math.max(0, (y + 126 - (x - 288) * 0.6) / 70)) - 0.05));
  s += LOCKEN(T, kopfZone, 230, (x, y) => (Math.hypot(x - auge[0], y - auge[1]) < 9 ? Math.atan2(y - auge[1], x - auge[0]) * 180 / Math.PI : 205 + (y + 90) * 0.4),
    (x, y) => (Math.hypot(x - auge[0], y - auge[1]) < 9 ? 2.5 : x > 336 ? 4 : 8), 1, (x, y) => kopfLicht(x, y) * 0.85, TON, { streuung: 9, szene: 0.1, szeneB: 2.6, jitter: 0.5 });
  /* Querfalten am Übergang zum Hals, Mundwinkelfalte */
  s += `<path d="M296-60q4 6 3 14M290-62q4 6 4 12M284-64q3 5 3 10" stroke="#000" stroke-width="1" opacity=".35" fill="none"/>`;

  /* ---------- Ohr: Trichter, spitz, nach hinten gekippt, innen dunkel, Rand mit langem Haar ---------- */
  s += K(T, [[280, -122], [278, -134], [279, -146, 1], [286, -140], [292, -130], [292, -120]], T.lg("ohr", [[0, "#704626"], [1, "#3e2616"]]), { rand: false, vol: false, innen:
    FO([[282, -126], [282, -136], [284, -140], [288, -132], [289, -124]], "#140a04", 0.6) });
  s += LOCKENLINIE(T, [[278, -124], [278, -134], [279, -146], [286, -140], [292, -130]], 26, [0, 1], (x, y) => (y < -140 ? 262 : x < 282 ? 215 : 320), (x, y) => (y < -140 ? 14 : 9), 1.1, () => 0.5, TON, { streuung: 14, szene: 0.2 });

  /* ---------- Maul: breite, eckige Oberlippe mit heller Kante, Maulspalte bis zum Mundwinkel, Unterlippe, Kinn ---------- */
  s += K(T, [[340, -51], [354, -52], [360.5, -49], [360, -44.6], [354, -43.2], [342, -43.6]], T.lg("lippe", [[0, "#5e4a3e"], [1, "#2e2420"]]), { rand: false, vol: false, innen: fleck(T, 352, -50, 7, 2, W, 0.2) });
  s += LI([[344, -49.6], [354, -50.4], [359, -47]], "#a89080", 0.8, ` opacity=".45"`);
  s += LI([[358, -43.4], [348, -42.6], [338, -43.4], [332, -46]], "#0e0805", 1, ` opacity=".75"`) + LI([[333, -45], [330, -47.6], [331, -51]], "#0e0805", 0.8, ` opacity=".45"`);
  s += F([[336, -42.6], [348, -42.4], [350, -40], [343, -38.4], [334, -39.2]], "#3a2c26", ` opacity=".85"`);
  /* Nasenloch: schräger Schlitz mit Wulst und Schattenkerbe, vor dem Horn auf halber Schnauzenhöhe */
  s += F([[349, -60.4], [353.4, -63.8], [356.4, -63.4], [351.4, -59.4]], "#0c0705") + LI([[348, -58.8], [352.6, -57.6], [356.6, -60.6]], "#8a7464", 0.7, ` opacity=".45"`);

  /* ---------- Auge: dunkelbraun, Pupille quer, schweres Oberlid, kurze grobe Wimpern, enge Hautfalten ---------- */
  s += AUGE2(T, auge[0], auge[1], 4.6, 2.4, { iris: "#2e1a0c", iris2: "#4a2c14", pupille: "quer", winkel: 18, falten: 4, wimpern: 10, wl: 0.8, wwinkel: 200, haut: "#2a1c14", hautHell: "#a07858" });

  /* ---------- Hörner: Keratin, faserig, 100 % deckend; Haarkranz um die Basis ---------- */
  const hornG = (n) => T.lg(n, [[0, "#2a221c"], [0.45, "#5a4e44"], [1, "#b0a698"]], 0, 1, 0.8, 0);
  /* Stirnhorn */
  const h2 = [[316, -96], [318, -108], [321, -120], [321, -132]];
  s += K(T, rohr(h2, 18, 3.5), hornG("horn2"), { rand: false, vol: false, innen:
    (fein ? [-0.5, -0.2, 0.15, 0.45].map((q) => LI(quer(h2, 18, 3.5, q), q > 0 ? "#8a7c6c" : "#120c08", 0.6, ` opacity=".35"`)).join("") : "") +
    LI(quer(h2, 18, 3.5, -0.7), "#000", 2, ` opacity=".35"`) + LI(quer(h2, 18, 3.5, 0.62).slice(1), "#e0d6c6", 1, ` opacity=".5"`) });
  /* Vorderhorn: Basis nur oben auf dem Nasenbein (Unterkante 8 cm über dem Nasenloch), geschwungen nach vorn-oben */
  const h1 = [[344, -78], [358, -88], [372, -103], [384, -120], [395, -138], [404, -156], [410, -172]];
  let fasern = "";
  if (fein) {
    for (let i = 0; i < 26; i++) { const q = -0.86 + 1.72 * i / 25; fasern += LI(quer(h1, 26, 4, q, 0.8).slice(0, 6 + (i % 2)), i % 3 ? "#120c08" : "#a8988a", 0.4, ` opacity="${i % 3 ? 0.12 + (i % 4) * 0.03 : 0.14}"`); }
    let ringe = "";
    for (let i = 1; i < 9; i++) { const t = i * 0.045, p = entlang(h1, t), q = entlang(h1, t + 0.01), dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy), w = 13 * (1 - t * 0.6);
      ringe += "M" + zf(p[0] - dy / l * w, p[1] + dx / l * w) + "q" + zf(dy / l * w + dx / l * 1.4, -dx / l * w + dy / l * 1.4, 2 * dy / l * w, -2 * dx / l * w); }
    fasern += `<path d="${ringe}" stroke="#000" stroke-width=".5" opacity=".14" fill="none"/>`;
  }
  s += K(T, rohr(h1, 26, 4, true, 0.8), hornG("horn1"), { rand: false, vol: false, innen: fasern +
    /* Schleiffacette an der Unterkante (Schneeschieben): matt, heller, mit Längskratzern */
    LI(quer(h1, 26, 4, -0.8, 0.8).slice(0, 5), "#8e8274", 3.4, ` opacity=".7"`) + (fein ? LI(quer(h1, 26, 4, -0.78, 0.8).slice(0, 5), "#c8bcac", 0.4, ` opacity=".4"`) : "") +
    /* harte Glanzkante nur am Rücken des Horns */
    LI(quer(h1, 26, 4, 0.72, 0.8).slice(1, 6), "#f2ebe0", 1.2, ` opacity=".6"`) + LI(quer(h1, 26, 4, 0.35, 0.8).slice(1, 6), "#000", 3, ` opacity=".12"`) });
  /* Haarkranz um die Hornbasen, Schlagschatten des Horns auf Stirn/Wange */
  s += LOCKENLINIE(T, [[332, -76], [340, -80], [352, -80], [356, -76]], 24, [-1, 2], 110, 5, 1.4, () => 0.4, TON, { streuung: 20, szene: 0.2 });
  s += LOCKENLINIE(T, [[306, -94], [314, -98], [324, -96]], 16, [-1, 2], 150, 5, 1.4, () => 0.45, TON, { streuung: 20, szene: 0.2 });

  return { svg: s, box: [7, -176, 414, 0], fuesse: [235, 215, 68, 92], kopf: [270, -180, 416, -30] };
}

/* =====================================================================
   DER RIESENHIRSCH (Megaloceros giganteus, „Irischer Elch")
   RECHERCHE: Schulterhöhe bis 2,1 m, 450–700 kg, Kopf-Rumpf ~3,1 m. Geweih der Hirsche
   bis 3,6 m Spannweite und ~40 kg: breite Schaufeln, hinten/oben eine Reihe Sprossen,
   vorn eine kurze, oft schaufelige Augsprosse. Starker Hals (trägt das Geweih), lange
   schlanke Läufe, Paarhufer mit Afterklauen. Höhlenbilder (Cougnac, Lascaux, Chauvet)
   zeigen immer einen dunklen, runden Fettbuckel über dem Widerrist, einen dunklen
   Streifen von der Schulter schräg nach unten, eine dunkle Flankenlinie, ein dunkles
   Halsband an der Kehle und einen hellen Hals und Kopf (Naish, Tetrapod Zoology).
   Kurzer Schwanz, Spiegel hell. Ohren lang-oval, großes dunkles Auge mit Voraugendrüse.
   ===================================================================== */
function riesenhirsch(T) {
  GEN = 10;
  const fein = T.fein !== false;
  SZ = !fein; SZMIN = 0.42; FLMIN = 0.25;
  const S0 = "#000", HL = "#fff4e0", DUNKEL = "#4a3524", CREME = "#c8b48e";
  const FT = [["#2e2014", 0.4, 0.2], ["#4a3624", 0.36, 0.2], ["#6e5438", 0.32, 0.18], ["#a4865e", 0.32, 0.17], ["#e0ccaa", 0.38, 0.16]];
  let s = "";

  /* ---------- Kopf im eigenen Koordinatensystem (x zur Schnauze, y nach unten), gedreht um 40° am Genick ---------- */
  const PX = 290, PY = -268, TH = 40, ct = Math.cos(TH * Math.PI / 180), st = Math.sin(TH * Math.PI / 180);
  const kw = ([x, y, h]) => [PX + x * ct - y * st, PY + x * st + y * ct, h];
  const KG = `<g transform="translate(${PX} ${PY}) rotate(${TH})">`;
  const kopfL = [[-4, 2], [0, -1], [8, -3], [18, -2], [27, 0.5], [38, 5], [49, 9], [56, 11.6], [60.4, 14.6], [61.6, 18.4], [61, 22.4], [59.4, 25], [56.6, 26.4],
    [54.4, 28.4], [50.6, 30], [46, 30.4], [38, 31], [26, 32.4], [16, 31.6], [9, 28], [5, 22], [0, 18]];
  const kopf = kopfL.map(kw);

  /* ---------- Rumpf, Hals: Länge Bug–Sitzbein ≈ 108 % der Widerristhöhe (2,1 m); Buckel 8–10 % hoch über dem Widerrist ---------- */
  const ruecken = [[22, -186], [32, -196], [48, -200], [64, -203], [72, -201], [100, -199], [140, -201], [172, -207], [190, -215], [200, -224], [210, -229],
    [222, -227], [232, -219], [242, -222], [256, -234], [272, -250], [286, -264]];
  const rumpf = [...ruecken, kw([0, 18]), [304, -230], [292, -208], [278, -184], [266, -164], [256, -140], [248, -126], [238, -116], [222, -113], [196, -115],
    [170, -119], [150, -123], [126, -129], [110, -136], [100, -144], [86, -156], [60, -146], [40, -146], [28, -158]];

  /* ---------- Beine (cm): Vorderbein mit Ellbogenhöcker, Vorderfußwurzel bei 63 cm, Fesselgelenk bei 20 cm, gespaltener Huf ---------- */
  const vorderbein = (dx, sk = 1) => [[248, -162], [248, -140], [246, -126], [244, -112], [242, -96], [240.6, -80], [240.6, -70], [241.6, -64], [240.6, -58], [240.2, -44],
    [240.2, -30], [240.8, -23], [242, -19], [244.4, -14], [247, -10.4], [248.4, -9], [253.4, -0.6], [252.8, 0, 1], [239.2, 0, 1], [238.2, -2.4], [237.2, -6.4],
    [235, -10.6], [231.8, -17], [232, -22.4], [232.6, -30], [232.8, -44], [232.6, -56], [231.2, -61.4], [230.4, -66], [230.2, -72], [229, -86], [227, -100],
    [224, -106], [220.4, -114], [219, -124], [220, -146], [226, -162]].map(([x, y, h]) => [236 + (x - 236) * sk + dx, y, h]);
  /* Hinterbein als Z: Oberschenkel nach vorn zum Knie auf Bauchhöhe, Unterschenkel schräg nach hinten, Fersenhöcker bei 41 %,
     straffe Achillessehne, Mittelfuß fast senkrecht */
  const hinterbein = (dx, sk = 1) => [[94, -174], [100, -152], [100.6, -140], [98, -130], [93, -120], [88, -108], [84.4, -97], [81.6, -90], [80.8, -82], [80.8, -60],
    [81, -40], [81.2, -24], [82.2, -19.4], [84.6, -14], [87.4, -10.2], [88.6, -9], [93.4, -0.6], [92.8, 0, 1], [79.4, 0, 1], [78.4, -2.4], [77.4, -6.4], [75.4, -10.4],
    [72.6, -17], [72.8, -22.4], [73.2, -30], [73.4, -50], [73.2, -70], [72.4, -80], [69, -84], [64.6, -87], [63.4, -91], [61, -102], [57, -114], [50, -123],
    [38, -131], [26, -140], [21, -152], [20.6, -166], [22.4, -180]].map(([x, y, h]) => [86 + (x - 86) * sk + dx, y, h]);
  const VN = vorderbein(0), HN = hinterbein(0), VF = vorderbein(-15, 0.92), HF = hinterbein(16, 0.92);

  const grund = T.lg("grund", [[0, "#7a5c3c"], [0.2, "#8e6d49"], [0.45, "#9a7a54"], [0.62, "#a8885e"], [0.72, "#6a4e34"], [1, "#3a2a1c"]], 0, -230, 0, 0, UB);
  /* Zylinderlicht eines Beins (weich gemalt) und dunklere Unterläufe */
  const beinLicht = (P, y0, y1, k = 1) => (SZ ? "" : FO(streifen(P, y0, y1, 0.08, 0.34, 6), HL, 0.3 * k) + FO(streifen(P, y0, y1, 0.64, 0.9, 6), S0, 0.36 * k) +
    FO(streifen(P, y0 + 6, y1, 0.92, 0.99, 6), "#d8c0a0", 0.25 * k));
  const huf = (P) => {
    /* zwei spitze Klauen mit V-Spalt, Vorderwand ~50°, Hornstreifen, Glanz an der Vorderwand, Tragrand heller */
    const a = P[16], b = P[18], top = P[15];
    const hx = (b[0] + a[0]) / 2;
    return F([[top[0] - 1, -9.4], [a[0] + 0.2, -0.4], [a[0] - 1, 0, 1], [b[0], 0, 1], [b[0] - 0.8, -3], [top[0] - 9, -9.6]], T.lg("huf", [[0, "#5a4a3a"], [0.5, "#3a3026"], [1, "#1e1812"]], 0, 0, 1, 0)) +
      `<path d="M${zf(hx + 1, -9)}l-1.4 9" stroke="#0a0806" stroke-width=".9" opacity=".75"/>` +
      `<path d="M${zf(hx + 4, -8)}l2.6 7.4M${zf(hx - 3, -9)}l.4 8.6" stroke="#8a7a66" stroke-width=".3" opacity=".4"/>` +
      `<path d="M${zf(top[0] + 0.6, -8.6)}l3.4 7.4" stroke="#d8ccb8" stroke-width=".7" opacity=".5"/>` + `<path d="M${zf(b[0], -0.5)}h${zf(a[0] - b[0])}" stroke="#7a6a58" stroke-width=".8" opacity=".6"/>`;
  };
  const afterklaue = (P) => { const p = P[22]; return F([[p[0] + 0.6, p[1] + 0.4], [p[0] - 3.4, p[1] + 3.2], [p[0] - 4.6, p[1] + 5.8, 1], [p[0] - 1.6, p[1] + 4.6], [p[0] + 1, p[1] + 2.4]], "#2a2018"); };

  /* ---------- fernes Geweih (hinter allem, 10 % kleiner, 20 % dunkler) ---------- */
  /* Schaufel (relativ zur Rose): Stange 25–30 % nach oben-hinten, dann die gewölbte Schaufel wie eine erhobene Hand mit 5 ungleichen,
     fingerförmigen Enden (runde Spitzen) am hinteren und oberen Rand */
  const schaufel = [[3, 0], [2, -16], [0, -30], [2, -44], [4, -60], [6, -78], [3, -88], [-2, -80], [-4, -70], [-10, -82], [-14, -100], [-20, -102], [-20, -90],
    [-24, -76], [-32, -88], [-40, -104], [-46, -104], [-44, -90], [-46, -76], [-56, -84], [-68, -96], [-74, -94], [-68, -80], [-66, -70], [-78, -72], [-94, -76],
    [-98, -71], [-84, -62], [-74, -54], [-60, -46], [-40, -40], [-22, -36], [-10, -28], [-5, -14], [-3, 0]];
  const geweih = (ox, oy, sk) => schaufel.map(([x, y, h]) => [ox + x * sk * 1.08, oy + y * sk * 0.78, h]);
  const burr = kw([16.5, -3.4]);
  const GF = geweih(burr[0] + 16, burr[1] - 8, 0.9);
  GEN = 1; const dGF = glatt(GF); GEN = 10;
  s += K(T, dGF, T.lg("gewf", [[0, "#3a2c1e"], [0.6, "#56442e"], [1, "#9a8a6c"]], 0, 1, 0, 0), { rand: false, vol: false, innen:
    WEICH(T, FO([[GF[3][0] - 4, GF[3][1]], [GF[13][0], GF[13][1] + 6], [GF[24][0] + 8, GF[24][1]], [GF[30][0], GF[30][1] - 4]], S0, 0.3), 2) });

  /* ---------- ferne Beine: gleiche Gelenke, 8 % schmaler, 20 % dunkler, Form sichtbar ---------- */
  for (const [P, y0] of [[VF, -126], [HF, -128]]) {
    s += K(T, P, grund, { rand: false, vol: false, innen: `<rect x="0" y="-240" width="300" height="240" fill="#000" opacity=".2"/>` + WEICH(T, beinLicht(P, y0, -10, 0.8), 1.2) });
    s += huf(P) + afterklaue(P);
    s += FELL(T, P.slice(2, P.length - 2), 40, 92, 1.4, (x, y) => zylX(quer_u(P, x, y)) * 0.7, FT, { szene: 0 });
  }

  /* ---------- Körper, nahe Beine, Hals und Kopf als eine Fläche ---------- */
  const band = (Lin, w0, w1, op) => { const L = [], R2 = []; for (let i = 0; i <= 10; i++) { const p = entlang(Lin, i / 10), q = entlang(Lin, Math.min(1, i / 10 + 0.05)), p0 = entlang(Lin, Math.max(0, i / 10 - 0.05));
    const dx = q[0] - p0[0], dy = q[1] - p0[1], l = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * i / 10) / 2; L.push([p[0] - dy / l * w, p[1] + dx / l * w]); R2.push([p[0] + dy / l * w, p[1] - dx / l * w]); }
    return FO(L.concat(R2.reverse()), DUNKEL, op); };
  const muster = WEICH(T,
    /* heller Hals und Kopf oberhalb des Halsbands */
    FO([[244, -224], [258, -236], [276, -256], [290, -268], [304, -236], [292, -210], [276, -184], [258, -196]], CREME, 0.7) + FO(kopf, CREME, 0.6) +
    /* Höhlenbild-Zeichnung: dunkler Buckel, Schulterstreifen, Flankenlinie (steigt nach hinten), Halsband */
    FO([[188, -213], [200, -226], [212, -231], [226, -227], [234, -217], [222, -210], [206, -208]], DUNKEL, 0.92) +
    band([[216, -212], [224, -188], [224, -156], [218, -126]], 11, 4, 0.55) + band([[208, -124], [180, -127], [146, -133], [116, -143]], 6, 3, 0.45) +
    band([[238, -218], [248, -198], [258, -180], [268, -164]], 10, 9, 0.6) +
    /* Licht oben links: Rückenlinie, Halsoberseite; Kernschatten unteres Rumpfdrittel; Reflex an der Bauchkante */
    FO([[30, -192], [70, -198], [140, -198], [186, -210], [186, -204], [140, -192], [70, -190], [32, -186]], HL, 0.36) +
    FO([[244, -220], [262, -234], [286, -262], [282, -254], [262, -228], [246, -214]], HL, 0.3) +
    FO([[100, -150], [150, -132], [200, -122], [236, -122], [238, -116], [196, -116], [150, -124], [104, -142]], S0, 0.26) +
    FO([[120, -131], [170, -121], [220, -116], [222, -114], [170, -119], [120, -129]], "#e0c8a0", 0.3) +
    /* Okklusion: unter dem Kinn, unter dem Hals auf der Brust, Achsel, Leiste; Schlagschatten des Geweihs auf Hals und Buckel */
    FO([[280, -230], [300, -234], [302, -224], [286, -218]], S0, 0.22) + FO([[248, -150], [258, -152], [256, -134], [246, -132]], S0, 0.3) +
    FO([[216, -122], [224, -120], [224, -110], [216, -112]], S0, 0.4) + FO([[98, -146], [106, -142], [104, -132], [96, -136]], S0, 0.35) +
    FO([[200, -226], [240, -230], [262, -250], [272, -262], [256, -248], [236, -232], [210, -226]], S0, 0.2) +
    /* Muskeln: Schulterblattgräte als Lichtkante, Trizeps, Rippenbogen, Hüfthöcker, Keulenfurche, Knie-Hautfalte */
    FO([[206, -206], [212, -204], [240, -150], [236, -148]], HL, 0.22) + FO([[218, -140], [232, -142], [230, -124], [220, -124]], HL, 0.16) +
    FO([[62, -200], [72, -200], [70, -195], [62, -195]], HL, 0.18) +
    FO([[42, -176], [46, -176], [50, -150], [46, -148], [42, -160]], S0, 0.1) + FO([[30, -190], [62, -194], [80, -176], [62, -170], [36, -172]], HL, 0.1) +
    FO([[100, -150], [108, -148], [104, -132], [100, -134]], S0, 0.28) + FO([[86, -122], [96, -126], [86, -98], [80, -96]], S0, 0.22) + FO([[62, -94], [66, -94], [66, -86], [63, -86]], HL, 0.4) + FO([[30, -136], [46, -126], [40, -124], [28, -132]], S0, 0.3) +
    /* Läufe: Zylinderlicht, Unterläufe dunkler */
    beinLicht(VN, -124, -10) + beinLicht(HN, -132, -10) +
    FO([[226, -70], [244, -70], [244, 0], [226, 0]], "#2a1e14", 0.45) + FO([[64, -84], [92, -84], [94, 0], [64, 0]], "#2a1e14", 0.45), 2.2);
  const sehnen = `<path d="M${zf(240.2, -56)}L${zf(240.2, -26)}M${zf(81, -76)}L${zf(81.2, -26)}" stroke="#d8c4a4" stroke-width=".7" opacity=".45"/>` +
    `<path d="M${zf(234.4, -55)}L${zf(234.2, -26)}M${zf(75.4, -76)}L${zf(75, -26)}" stroke="#120c06" stroke-width=".6" opacity=".45"/>` +
    `<path d="M${zf(58.6, -112)}L${zf(64.6, -90)}" stroke="#e8d4b4" stroke-width="1" opacity=".55"/><path d="M${zf(62.6, -110)}L${zf(67.6, -92)}" stroke="#120c06" stroke-width="1" opacity=".5"/>`;
  GEN = 1;
  const dS = [rumpf, VN, HN, kopf].map((p) => glatt(gleich(p))).join("");
  GEN = 10;
  s += K(T, dS, grund, { rand: false, vol: false, innen: muster + sehnen });
  s += huf(VN) + huf(HN) + afterklaue(VN) + afterklaue(HN);

  /* ---------- Fell: Nase → Kopf nach hinten, Hals abwärts zur Brust, vom Widerrist nach hinten-unten, Läufe abwärts ---------- */
  const lichtR = (x, y) => Math.max(0, Math.min(1, zyl(Math.max(0, (y + 205) / 75))));
  s += FELL(T, [[24, -186], [70, -200], [140, -200], [190, -214], [236, -218], [252, -138], [222, -116], [150, -124], [104, -144], [86, -158], [30, -170]], 280,
    (x, y) => (x > 200 && x < 236 && y > -200 ? 110 : 160 + (y + 200) * -0.5), 3.4, lichtR, FT, { streuung: 10, szene: 0.07 });
  s += FELL(T, [[236, -218], [256, -232], [288, -264], [300, -234], [290, -214], [266, -164], [256, -148]], 120, (x, y) => 105 + (x - 250) * 0.3, 4.2,
    (x, y) => Math.max(0, zyl(Math.max(0, quer_u([[236, -218], [290, -264], [300, -234], [252, -150]], x, y))) * 0.9), FT, { streuung: 10, szene: 0.07 });
  for (const P of [VN, HN]) s += FELL(T, P.slice(2, P.length - 2), 64, 92, 1.4, (x, y) => zylX(quer_u(P, x, y)), FT, { streuung: 7, szene: 0.05 });
  /* Buckel: dichtes, 2–3× längeres Haar, nach hinten anliegend; Kehlmähne (Winterfell) hängend, geschichtet */
  const TONB = ["#1e140c", "#2c1e12", "#3a2a1a", "#4a3624", "#5e4630", "#76593c"];
  s += LOCKEN(T, [[188, -212], [200, -224], [212, -229], [226, -226], [234, -216], [222, -210], [204, -208]], 70, 168, 9, 1.4, (x, y) => zyl(Math.max(0, (y + 230) / 30)), TONB, { streuung: 10, szene: 0.2 });
  s += LOCKENLINIE(T, [[190, -214], [200, -224], [212, -229], [226, -227], [234, -219]], 34, [-1.5, 1.5], 172, 6, 1, (x, y) => 0.6, TONB, { streuung: 12, szene: 0 });
  const TONK = ["#3a2c1e", "#54412c", "#6e5a40", "#8e7656", "#ae9670", "#c8b08a"];
  s += LOCKEN(T, [[266, -164], [280, -188], [294, -210], [302, -230], [290, -220], [276, -194], [264, -172]], 80, 100, 16, 1.8, (x, y) => 0.35 + (x - 260) / 100, TONK, { streuung: 8, szene: 0.15, szeneB: 2 });
  /* Präputialpinsel */
  s += LOCKEN(T, [[150, -124], [158, -123], [157, -118], [151, -119]], 18, 96, 10, 1.2, () => 0.25, TONB, { streuung: 10, szene: 0.3 });
  /* feiner Fellsaum an Rücken- und Halslinie */
  s += LOCKENLINIE(T, ruecken.slice(0, 9), 50, [0.3, 1.2], 196, 2.2, 0.3, () => 0.8, ["#a4865e", "#d8c4a0"], { streuung: 16, szene: 0 });
  s += LOCKENLINIE(T, ruecken.slice(12), 30, [0.3, 1.2], 228, 2.6, 0.3, () => 0.85, ["#c8b08a", "#e8d8bc"], { streuung: 16, szene: 0 });
  /* Schwanz: kurz, behaart, an der Kruppe in der Rückenlinie, Spiegel hell */
  s += K(T, [[26, -190], [20, -188], [16, -180], [15, -172], [19, -171], [22, -178], [27, -184]], T.lg("schwanz", [[0, "#5a4430"], [0.6, "#3a2a1c"], [1, "#d8c4a4"]], 0, 0, 1, 0), { rand: false, vol: false });
  s += fleck(T, 22, -170, 9, 12, "#f0e4cc", 0.55);

  /* ---------- Kopfdetails (Kopfkoordinaten) ---------- */
  let k = KG;
  const kl = (x, y) => Math.max(0, Math.min(1, 0.85 - (y + 2) / 40));
  k += FELL(T, kopfL, 135, (x, y) => (y > 26 ? 175 : 180 + (y - 10) * 0.6), 1.3, kl, FT, { streuung: 10, szene: 0.06 });
  k += WEICH(T,
    /* Nasenrücken mit Glanzlinie, Gesichtsleiste unter dem Auge (Licht, Rinne darunter), Kaumuskel, Augenhöhle, Ganasche */
    FO([[28, 1], [48, 8], [56, 11], [56, 13], [46, 10.6], [28, 3.6]], HL, 0.36) + FO([[14, 11], [32, 11.6], [38, 13], [26, 13.6], [14, 13]], HL, 0.3) +
    FO([[14, 14], [36, 14.6], [36, 16.4], [14, 16]], S0, 0.2) + FO([[8, 16], [18, 15.4], [22, 21], [16, 26], [8, 23]], HL, 0.16) +
    FO([[12, 28], [24, 31], [16, 32.4], [8, 30]], S0, 0.2) + FO([[17, 2], [26, 3], [27, 6], [18, 6]], HL, 0.3) + FO([[13, 6], [17, 4], [18, 10], [14, 10]], S0, 0.25), 0.8);
  /* Ohr: hinter und unter dem Rosenstock, löffelförmig, Innenmulde dunkel, heller Haarsaum, gerundete Spitze */
  k += K(T, [[10, 1], [2, -1], [-8, 2], [-17, 6], [-21, 9], [-17, 11.6], [-8, 11], [2, 9], [10, 7]], T.lg("ohr", [[0, "#b49870"], [1, "#7a5e40"]], 0, 0, 0, 1), { rand: false, vol: false, innen:
    FO([[6, 3.4], [-2, 3.6], [-12, 6.4], [-17, 8.8], [-10, 9], [-1, 7.4], [6, 6]], "#2a1e14", 0.6) + fleck(T, 0, 2, 8, 3, HL, 0.3) });
  k += LOCKENLINIE(T, [[-21, 9], [-17, 11.6], [-8, 11], [2, 9]], 18, [-0.6, 0.4], 100, 2.2, 0.28, () => 1, ["#efe2c8"], { szene: 0 });
  /* Voraugendrüse: beginnt im inneren Augenwinkel, tropfenförmig, 30° nach vorn-unten */
  k += F([[23.4, 6.6], [27, 6.4], [30.6, 6.6], [32, 7.4], [30.6, 8.4], [26.6, 8.2], [23.4, 7.8]], "#1e140c", ` opacity=".75"`) +
    LI([[23.8, 5.8], [27.6, 5.6], [31.2, 5.8], [32.8, 7]], "#d8c4a4", 0.35, ` opacity=".5"`);
  /* Auge: groß, rundlich-oval, vorgewölbt, dunkle Iris, Pupille quer angedeutet, Lidrand, wenige kurze Wimpern */
  k += AUGE2(T, 20.4, 6.6, 5.8, 3.9, { iris: "#1e140c", iris2: "#3a2416", pupille: "quer", winkel: -26, falten: 0, wimpern: 6, wl: 0.3, wwinkel: 30 });
  /* Nasenspiegel: flach, unbehaart, dunkel graubraun, matt, kleiner feuchter Glanzpunkt; Nüster als Komma */
  k += K(T, [[53.6, 11.2], [57, 11.6], [60.4, 14.6], [61.4, 17.8], [59, 18.6], [55.4, 16.4]], T.lg("nase", [[0, "#3e342c"], [1, "#221c18"]]), { rand: false, vol: false, innen:
    `<path d="M57.6 14.6q1.6.4 2.4 2.6q-1.6-.6-2.4-2.6z" fill="#080605"/>` + fleck(T, 58.6, 13.4, 1.2, 0.5, "#e8eef0", 0.6) });
  /* Oberlippe steht vor, Mundspalt gerade bis 1/3 der Kopflänge, kleines rundes Kinn; Tasthaare */
  k += LI([[59.8, 24.6], [54, 25.4], [46, 25.8], [41, 25.2]], "#1a120c", 0.7, ` opacity=".75"`);
  k += F([[48, 26.4], [56, 26.6], [58, 27.6], [54, 29.6], [48, 29.2]], "#5a4836", ` opacity=".45"`);
  k += TASTHAARE(T, [[57, 20], [58, 21.6], [56, 22.6], [58.6, 23], [55, 19.6], [57.6, 18.6], [54, 21.2]], (i) => 70 + i * 14, 6, 0.1, "#efe6d6", 0.6);

  /* ---------- nahes Geweih: Rose (Perlring), runde Stange, Augsprosse nach vorn, gewölbte Schaufel mit ungleichen Fingern ---------- */
  k += "</g>";
  s += k;
  const GN = geweih(burr[0], burr[1], 1);
  let rillen = "";
  if (fein) for (let i = 0; i < 5; i++) { const a = (-84 - i * 14) * Math.PI / 180, L = 44 + (i % 3) * 10;
    rillen += LI([[burr[0] + 1, burr[1] - 20], [burr[0] + Math.cos(a) * L * 0.5, burr[1] - 30 + Math.sin(a) * L * 0.3], [burr[0] + Math.cos(a) * L, burr[1] - 26 + Math.sin(a) * L * 0.6]],
      i % 2 ? "#fff4dc" : "#2a1e12", 0.5, ` opacity="${i % 2 ? 0.14 : 0.16}"`); }
  GEN = 1; const dGN = glatt(GN); GEN = 10;
  s += K(T, dGN, T.lg("gew", [[0, "#5a4430"], [0.45, "#7a6040"], [0.8, "#b09670"], [1, "#e0d0aa"]], 0, 1, 0, 0), { rand: false, vol: false, innen: rillen +
    /* gewölbte Schaufel: dunkler Kern innen, heller Randsaum; runde Stange mit Lichtgrat */
    WEICH(T, FO([[burr[0] - 4, burr[1] - 46], [burr[0] - 20, burr[1] - 70], [burr[0] - 52, burr[1] - 70], [burr[0] - 76, burr[1] - 66], [burr[0] - 50, burr[1] - 50], [burr[0] - 16, burr[1] - 40]], S0, 0.3) +
      FO([[burr[0] - 1, burr[1] - 2], [burr[0] - 2, burr[1] - 40], [burr[0] + 1, burr[1] - 40], [burr[0] + 1.6, burr[1] - 2]], HL, 0.4) +
      FO([[burr[0] - 6, burr[1] - 34], [burr[0] - 40, burr[1] - 42], [burr[0] - 84, burr[1] - 64], [burr[0] - 80, burr[1] - 60], [burr[0] - 40, burr[1] - 38]], HL, 0.3), 1.6) });
  /* Augsprosse: direkt über der Rose, schaufelig, nach vorn über Stirn und Auge */
  const aug = [[1, -4], [8, -6], [16, -9], [24, -13], [30, -17], [31, -21], [27, -19], [26, -24], [22, -21], [14, -14], [4, -11]].map(([x, y, h]) => [burr[0] + x, burr[1] + y, h]);
  s += K(T, aug, T.lg("gew", []), { rand: false, vol: false, innen: WEICH(T, FO([[aug[0][0], aug[0][1] + 2], [aug[3][0], aug[3][1] + 2], [aug[3][0], aug[3][1] + 4], [aug[0][0], aug[0][1] + 4]], S0, 0.3), 1) });
  /* Rose: dicker Perlring, Eigenschatten unten */
  s += F([[burr[0] - 6, burr[1] + 1], [burr[0] - 5, burr[1] - 3], [burr[0], burr[1] - 4.4], [burr[0] + 5.4, burr[1] - 3], [burr[0] + 6.4, burr[1] + 1], [burr[0], burr[1] + 2.6]], "#4a3a28") +
    (fein ? `<path d="M${zf(burr[0] - 5, burr[1] - 2)}h2m1.4-.8h2m1.4 0h2m1.4.8h2" stroke="#2a1e12" stroke-width="1.1" stroke-linecap="round"/>` : "") +
    fleck(T, burr[0], burr[1] + 2.6, 7, 2, S0, 0.4);

  return { svg: s, box: [14, -342, 336, 0], fuesse: [246, 230, 87, 102], kopf: [276, -300, 336, -206] };
}

/* =====================================================================
   DER HÖHLENBÄR (Ursus spelaeus)
   RECHERCHE: Männchen 350–600 kg, Weibchen 225–250 kg; Kopf-Rumpf 2,5–3 m, Schulterhöhe
   auf allen vieren ~1,3–1,5 m. Kennzeichen: sehr breiter, gewölbter Schädel mit steiler
   Stirn und deutlichem Stirnabsatz („frontal stop") – das unterscheidet ihn vom Braunbären;
   Rücken fällt von der hohen Schulter nach hinten ab (lange Vorderbeine, kurze
   Schienbeine), massige Vorderbeine, Sohlengänger mit langen, gebogenen Krallen,
   kurzer Schwanz, kleine runde Ohren, kleine Augen. Fell (angenommen) dicht und lang,
   dunkelbraun, an Rücken und Schulter heller bereift. Lebte und überwinterte in Höhlen
   (Chauvet: Kratzspuren, Schädel).
   ===================================================================== */
function hoehlenbaer(T) {
  GEN = 1;
  const fein = T.fein !== false;
  SZ = !fein; SZMIN = 0.3; FLMIN = 0.3;
  const S0 = "#000", W = "#fff3dc";
  const TON = ["#160d07", "#20140b", "#2c1b0f", "#3a2414", "#4a2f1a", "#5c3b21", "#704a2a", "#865a34"];
  const FERN = ["#140c07", "#1c120b", "#26190f", "#302014", "#3c291a"];
  const REIF = [["#cbbfa9", 0.55], ["#ddd2bc", 0.5]];
  const wolle = T.lg("wolle", [[0, "#7a5434"], [0.3, "#5e3e24"], [0.65, "#3a2414"], [1, "#2a1a0e"]], 0, -146, 0, -50, UB);
  let s = "";

  /* ---------- Form: höchster Punkt über dem Schulterblatt, gleichmäßiger Abfall zur Kruppe, runde Keule ---------- */
  const ruecken = [[14, -90], [16, -102], [24, -111], [40, -116], [70, -120], [110, -127], [150, -136], [180, -143], [200, -146], [216, -142], [228, -133], [236, -129]];
  const top = (x) => bei(ruecken, Math.max(14, Math.min(236, x)));
  const bauchY = (x) => (x > 200 ? -66 : x > 60 ? -58 : -66);
  const t_ = (x, y) => (y - top(x)) / (bauchY(x) - top(x));
  const licht = (x, y) => {
    let v = zyl(t_(x, y)) + (x < 80 ? 0.05 : 0);
    if (x > 214 && y > -100) v -= 0.15;
    return Math.max(0, Math.min(1, v));
  };
  const fluss = (x, y) => { const t = t_(x, y); if (x > 186 && x < 226 && t > 0.15 && t < 0.6) return 100 + (x - 206) * 0.8; return 96 + 26 * Math.max(0, 1 - t / 0.5); };
  const lang = (x, y) => { const t = t_(x, y); return 9 + 9 * Math.min(1, t / 0.8); };

  /* ---------- Beine: nah und fern getrennt; Ellbogenhöcker hinten, Einschnürung über dem Handgelenk; Knie vorn, Ferse hinten,
     lange flache Sohle (Sohlengänger) ---------- */
  const vorderbein = (cx, sk = 1) => [[cx + 16, -110], [cx + 18, -84], [cx + 15, -62], [cx + 12, -44], [cx + 10, -28], [cx + 11, -20], [cx + 14, -14], [cx + 20, -9],
    [cx + 23, -4], [cx + 22, 0, 1], [cx - 13, 0, 1], [cx - 14, -6], [cx - 12, -14], [cx - 11, -22], [cx - 12, -34], [cx - 16, -50], [cx - 18, -62], [cx - 16, -76], [cx - 14, -100]]
    .map(([x, y, h]) => [cx + (x - cx) * sk, y, h]);
  const hinterbein = (cx, sk = 1) => [[cx + 6, -112], [cx + 20, -92], [cx + 24, -70], [cx + 22, -56], [cx + 16, -44], [cx + 12, -30], [cx + 13, -18], [cx + 18, -10],
    [cx + 24, -5], [cx + 24, 0, 1], [cx - 18, 0, 1], [cx - 20, -4], [cx - 19, -10], [cx - 16, -16], [cx - 15, -28], [cx - 20, -44], [cx - 30, -62], [cx - 36, -80], [cx - 38, -96], [cx - 30, -112]]
    .map(([x, y, h]) => [cx + (x - cx) * sk, y, h]);
  const beinLicht = (P, ferne) => (x, y) => {
    let v = zylX(quer_u(P, x, y)) * (ferne ? 0.75 : 1);
    if (y < -56) v -= 0.25 * Math.min(1, (-56 - y) / 20);
    return Math.max(0, Math.min(1, v));
  };
  /* Zehenwülste am Pfotenrand, Sichelkrallen (Horn, Glanz oben, Eigenschatten unten, Schlagschatten), Spitzen tippen auf den Boden */
  const pfote = (x0, n, L, ferne) => {
    let d = "", g = "", h = "";
    for (let i = 0; i < n; i++) {
      const x = x0 - i * 3.4, y = -3.6 - i * 0.9, l = L * (1 - i * 0.07);
      d += "M" + z2(x, y - 2.4) + "q" + z2(l * 0.7, -2.4, l, -y - 0.4 + 2.4) + "q" + z2(-l * 0.45, -2.6, -l, -2.1 + 2.4 - (-y - 0.4) + 0.6) + "z";
      g += "M" + z2(x + l * 0.15, y - 2.1) + "q" + z2(l * 0.5, -1.6, l * 0.78, 1.4);
      h += "M" + z2(x + 1, -0.3) + "h" + z2(l * 0.9);
    }
    return (ferne ? "" : `<path d="${h}" stroke="#000" stroke-width=".9" opacity=".35"/>`) +
      `<path d="${d}" fill="${ferne ? "#2a2018" : T.lg("kralle", [[0, "#2a221c"], [0.65, "#4e443a"], [1, "#a89a84"]], 0, 0, 1, 0)}" stroke="#120c08" stroke-width=".3" stroke-opacity=".5"/>` +
      (ferne ? "" : `<path d="${g}" stroke="#efe6d6" stroke-width=".35" opacity=".55" fill="none"/>`);
  };
  const bein = (P, cx, ferne, vorn) => {
    let b = K(T, P, ferne ? "#1e140c" : T.lg("beinn", [[0, "#40281a"], [0.6, "#2e1c10"], [1, "#22160c"]], 0, -110, 0, 0, UB), { rand: false, vol: false, innen:
      `<rect x="${cx - 50}" y="-115" width="100" height="115" fill="${T.lg("beinx", [[0, "#fff", 0.1], [0.3, "#fff", 0.06], [0.55, "#000", 0], [0.75, "#000", 0.3], [0.92, "#000", 0.2], [1, "#000", 0.1]], 0, 0, 1, 0)}"/>` +
      fleck(T, cx, -2, 26, 3, S0, 0.5) + fleck(T, cx, -68, 34, 16, S0, 0.4) });
    /* Zehen als Wülste mit überhängendem Fell */
    const zx = vorn ? cx + 12 : cx + 14;
    if (fein) b += `<path d="M${zf(zx - 10, -9)}q2 3 0 6M${zf(zx - 5, -9.6)}q2 3 0 6M${zf(zx, -9.4)}q2 3 0 6M${zf(zx + 5, -8.6)}q2 3 0 6" stroke="#000" stroke-width=".8" opacity=".4" fill="none"/>`;
    b += LOCKEN(T, P.filter((p) => p[1] < -6), ferne ? 40 : 90, 93, (x, y) => 6 + (y + 110) * 0.05, 2, beinLicht(P, ferne), ferne ? FERN : TON, { streuung: 9, szene: ferne ? 0 : 0.12, szeneB: 2.2 });
    b += pfote(vorn ? cx + 20 : cx + 22, 5, vorn ? 12 : 7.5, ferne);
    return b;
  };
  const VF = vorderbein(190, 0.94), HF = hinterbein(82, 0.94), VN = vorderbein(208), HN = hinterbein(62);
  s += bein(VF, 190, true, true) + bein(HF, 82, true, false);
  s += bein(HN, 62, false, false) + bein(VN, 208, false, true);

  /* ---------- Rumpf mit Kopf: massiger Kopf, breiter gewölbter Schädel, steiler Stirnabsatz, kurze Schnauze ---------- */
  const kopfLinie = [[236, -128], [246, -133], [256, -131], [262, -124], [266, -113], [272, -109], [282, -105], [288, -102], [291, -97], [291, -92], [288, -88],
    [282, -86.4], [276, -86.6], [282, -83], [280, -79], [272, -77], [262, -78], [252, -82], [244, -86]];
  const koerper = [...ruecken, ...kopfLinie, [238, -80], [232, -70], [222, -63], [200, -59], [150, -56], [100, -57], [70, -60], [48, -65], [32, -71], [21, -79]];
  s += K(T, koerper, wolle, { rand: false, vol: false, innen:
    BAND(T, ruecken.slice(1, 9).map(([x, y]) => [x, y + 10]), fein ? 6 : 3, fein ? 34 : 50, 14, "#c89660", 0.35) +
    BAND(T, [[40, -76], [100, -72], [160, -72], [214, -78]], fein ? 4 : 2, fein ? 46 : 70, 18, S0, 0.35) +
    fleck(T, 240, -96, 16, 16, S0, 0.4) + fleck(T, 50, -100, 30, 22, "#c89660", 0.25) });

  /* ---------- Fell: drei Lagen Strähnen, Reif an den Spitzen oben ---------- */
  const zone = [[16, -100], [26, -110], [70, -118], [150, -134], [200, -144], [226, -134], [236, -122], [238, -96], [232, -74], [200, -63], [100, -61], [40, -70], [18, -86]];
  s += LOCKEN(T, zone, 220, fluss, lang, 3.2, (x, y) => licht(x, y) * 0.86, TON, { streuung: 8, kruemmung: 0.12, szene: 0.12, szeneB: 2.2 });
  s += LOCKEN(T, zone, 170, fluss, (x, y) => lang(x, y) * 0.7, 2.4, licht, TON, { streuung: 8, kruemmung: 0.14, szene: 0.08, szeneB: 2.2 });
  /* Bereifung: helle, kühle Spitzen in den oberen 25 % von Rumpf und Kopf, einzelne über der Silhouette */
  if (fein) s += LOCKEN(T, [[18, -106], [34, -118], [110, -130], [182, -140], [222, -136], [220, -126], [182, -128], [110, -118], [40, -106]], 80,
    fluss, 9, 0.5, () => 1, [["#cbbfa9", 0.32], ["#ddd2bc", 0.28]], { streuung: 8, jitter: 0.5 });
  s += LOCKENLINIE(T, ruecken.slice(0, 9), 40, [-2, 4], (x, y) => fluss(x, y + 5) + 8, 9, 2, (x, y) => licht(x, y + 4), TON, { streuung: 10, szene: 0.15, szeneB: 1.6 });
  if (fein) s += LOCKENLINIE(T, ruecken.slice(1, 9), 26, [0, 2], 172, 7, 0.5, () => 1, [["#cbbfa9", 0.4]], { streuung: 10 });
  /* Bauchbehang: wenige große Zotteln, die die Beine überlappen */
  s += LOCKEN(T, [[40, -72], [100, -64], [200, -66], [232, -74], [234, -64], [200, -58], [100, -56], [40, -64]], 90, 94, 12, 2.8, (x, y) => 0.22, TON,
    { streuung: 7, kruemmung: 0.1, szene: 0.1, szeneB: 2.4, jitter: 0.7 });
  /* Kehlbart geht in die Brust über (keine Kerbe) */
  s += LOCKEN(T, [[238, -96], [258, -84], [262, -78], [240, -74], [232, -82]], 50, 104, 12, 2.4, () => 0.3, TON, { streuung: 8, szene: 0.15 });
  /* Stummelschwanz im Fell */
  s += LOCKEN(T, [[16, -106], [21, -106], [20, -100], [16, -100]], 8, 150, 6, 1.8, () => 0.5, TON, { streuung: 10, szene: 0.3 });

  /* ---------- Kopf: kurzes Haar, Schnauze sehr kurz von der Nase nach hinten, Wirbel am Stirnabsatz, Wangenbart ---------- */
  const auge = [261.6, -105.4];
  const kopfZone = [[236, -126], [246, -132], [256, -130], [262, -123], [266, -112], [282, -104], [289, -100], [287, -90], [278, -86], [262, -80], [246, -86], [236, -100]];
  const kl = (x, y) => Math.max(0, Math.min(1, zyl(Math.max(0, (y + 132 - Math.max(0, x - 262) * 0.7) / 48)) - 0.04));
  s += LOCKEN(T, kopfZone, 340, (x, y) => {
    const dA = Math.hypot(x - auge[0], y - auge[1]);
    if (dA < 6) return Math.atan2(y - auge[1], x - auge[0]) * 180 / Math.PI;
    if (x > 266) return 188 + (y + 98) * 0.6;                 // Schnauze: von der Nase nach hinten
    if (Math.hypot(x - 265, y - 115) < 5) return 250;          // Wirbel am Stirnabsatz
    return y > -100 ? 120 : 175 + (y + 120) * 1.5;            // Stirn nach hinten, Wange nach hinten-unten
  }, (x, y) => (Math.hypot(x - auge[0], y - auge[1]) < 6 ? 1.4 : x > 268 ? 2.6 : 6), 0.55, (x, y) => kl(x, y) * 0.9 + 0.05, TON, { streuung: 10, szene: 0.1, szeneB: 3, jitter: 0.4 });
  if (fein) s += LOCKEN(T, [[238, -128], [248, -132], [258, -130], [262, -124], [250, -124], [240, -120]], 22, 175, 5, 0.45, () => 1, [["#cbbfa9", 0.3]], { streuung: 14, jitter: 0.4 });
  s += LOCKEN(T, [[242, -100], [256, -92], [258, -82], [244, -86]], 40, 118, 9, 1.8, kl, TON, { streuung: 8, szene: 0.15 });
  s += WEICH(T, FO([[266, -112], [276, -108], [287, -103.6], [276, -105.6]], "#c89660", 0.3) + FO([[256, -110], [262, -112], [266, -104], [260, -101]], S0, 0.3), 1);

  /* ---------- Ohr: klein, rund, wächst aus dem Kopffell; dunklere Muschel, heller Haarbüschel ---------- */
  s += K(T, [[234, -124], [234, -131], [237.6, -135.4], [242, -134.6], [244, -129.6], [242, -125]], T.lg("ohr", [[0, "#5a3a22"], [1, "#3a2414"]]), { rand: false, vol: false, innen:
    FO([[237, -127], [238, -132], [241, -132], [241.6, -128]], "#120a05", 0.6) });
  s += LOCKEN(T, [[237.6, -128], [240.6, -132], [241.6, -128.4]], 10, 250, 3, 0.5, () => 1, [["#b8a890", 0.6]], { szene: 0 });

  /* ---------- Maul: Unterkiefer als eigene Masse mit Kinnbogen, leicht hängende Unterlippe; Mundwinkel unter dem vorderen Augenwinkel ---------- */
  s += F([[264, -85], [277, -85.2], [281.4, -82.6], [279, -79.4], [271, -78.4], [263, -80]], "#120a05", ` opacity=".28"`) + LI([[269, -85.6], [276, -85.8], [281, -84.6]], "#9a7660", 0.5, ` opacity=".35"`);
  s += LI([[289, -88.4], [283, -87.2], [276, -87], [270, -88], [266.4, -90]], "#0c0705", 1.1, ` opacity=".8"`);
  /* Nase: oben flacher, vorn gerundet, Philtrum-Kerbe; Nasenloch als Komma; feine Körnung; Glanz als schmaler Bogen */
  s += K(T, [[284, -103.2], [289.6, -102.4], [292.6, -99.6], [293.4, -95.6], [291.6, -92.6], [288.6, -91.8], [287.2, -93.6], [285, -95.6], [283.6, -99.4]],
    T.lg("nase", [[0, "#3a302c"], [0.6, "#1c1614"], [1, "#0c0a08"]]), { rand: false, vol: false, innen:
    `<path d="M291.8-96.2q-1.2-.4-2.2.6q.6 1.4 2.4 1.2" fill="#000"/>` + `<path d="M285.6-101.8q3.6-.6 6.4 1.6" stroke="#e8e8ea" stroke-width=".5" opacity=".55" fill="none"/>` +
    `<path d="M289-92.4q2 .2 3.2-1" stroke="#c8c8ca" stroke-width=".35" opacity=".3" fill="none"/>` });
  s += LI([[290.6, -92], [290, -90], [289.6, -88.6]], "#0c0705", 0.6, ` opacity=".6"`);
  /* Auge: weiter unten-innen (Fell bis zur Stirnkante), dunkler Bernstein, runde Pupille, Lidwulst, Wimpern */
  s += fleck(T, auge[0], auge[1] - 1, 5, 3, S0, 0.35) + AUGE2(T, auge[0], auge[1], 3.6, 2.2, { iris: "#5a3414", iris2: "#8a5a26", winkel: 4, falten: 0, wimpern: 9, wl: 0.9, wwinkel: -40 });
  if (fein) s += T.schnurrhaare(286, -92, 3, 4, 175, 30, "#2a1a0e", 0.15);

  return { svg: s, box: [10, -142, 294, 0], fuesse: [208, 189, 62, 82], kopf: [228, -140, 296, -74] };
}

module.exports = [
  { id: "mammut", de: "das Mammut", syl: "MAM-mut", it: "il mammut", itSyl: "MAM-mut", en: "mammoth",
    gruppe: "Eiszeit", lebensraum: "Eiszeit", laenge: 5.98, hoehe: 3.57, zeichne: mammut },
  { id: "saebelzahnkatze", de: "die Säbelzahnkatze", syl: "SÄ-bel-zahn-kat-ze", it: "la tigre dai denti a sciabola", itSyl: "TI-gre dai DEN-ti a SCIA-bo-la", en: "sabre-toothed cat",
    gruppe: "Eiszeit", lebensraum: "Eiszeit", laenge: 1.8, hoehe: 1.11, zeichne: saebelzahn },
  { id: "wollnashorn", de: "das Wollnashorn", syl: "WOLL-nas-horn", it: "il rinoceronte lanoso", itSyl: "ri-no-ce-RON-te la-NO-so", en: "woolly rhinoceros",
    gruppe: "Eiszeit", lebensraum: "Eiszeit", laenge: 4.07, hoehe: 1.76, zeichne: wollnashorn },
  { id: "riesenhirsch", de: "der Riesenhirsch", syl: "RIE-sen-hirsch", it: "il megacero", itSyl: "me-GA-ce-ro", en: "giant deer",
    gruppe: "Eiszeit", lebensraum: "Eiszeit", laenge: 3.22, hoehe: 3.42, zeichne: riesenhirsch },
  { id: "hoehlenbaer", de: "der Höhlenbär", syl: "HÖH-len-bär", it: "l'orso delle caverne", itSyl: "OR-so del-le ca-VER-ne", en: "cave bear",
    gruppe: "Eiszeit", lebensraum: "Eiszeit", laenge: 2.84, hoehe: 1.42, zeichne: hoehlenbaer },
];
