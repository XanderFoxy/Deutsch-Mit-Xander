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
  li[0].push(1); re[0].push(1);   // Basis als harte Ecken (kein Überschwingen der Glättung)
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
  const N = toene.length, eimer = toene.map(() => ""), hEimer = toene.map(() => ""), hz = o.haare || 0;
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
    /* Haare in der Strähne: 2–4 feine Linien, an der Wurzel gebündelt, Spitzen aufgespalten, Ton ±1–2 Stufen */
    if (hz && fein) for (let h = 0; h < hz; h++) {
      const u = (h + 0.5) / hz - 0.5, sp = (T.rnd() - 0.5) * 0.6 + u * 1.6, lh = 0.75 + T.rnd() * 0.35;
      const jj = Math.max(0, Math.min(N - 1, j + (T.rnd() < 0.55 ? 1 : -1) * (1 + (T.rnd() < 0.3 ? 1 : 0))));
      hEimer[jj] += "M" + zf(x + px * u * 0.6, y + py * u * 0.6) + "q" + zf(mx + px * u * 1.4, my + py * u * 1.4, tx * lh + px * sp, ty * lh + py * sp);
    }
  }
  return eimer.map((d, j) => {
    if (!d) return "";
    const t = toene[j], f = Array.isArray(t) ? t[0] : t, op = Array.isArray(t) ? t[1] : 1;
    return `<path d="${d}" fill="${f}"${op < 1 ? ` fill-opacity="${op}"` : ""}/>`;
  }).join("") + hEimer.map((d, j) => {
    if (!d) return "";
    const t = toene[j], f = Array.isArray(t) ? t[0] : t;
    return `<path d="${d}" fill="none" stroke="${f}" stroke-width="${o.hb || 0.6}" stroke-linecap="round"/>`;
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
  s += `<ellipse cx="${r2(cx + R0 * 0.3)}" cy="${r2(h * 0.3)}" rx="${r2(R0 * 0.22)}" ry="${r2(R0 * 0.07)}" fill="#fff" opacity=".18"/>`;
  /* schweres Oberlid: hängt über das obere Drittel der Iris und wirft Schatten */
  if (o.oberlid) {
    const yl = -h * 0.62 + o.oberlid * h * 1.0;
    s += `<path d="M${z2(-w, -h * 1.2)}L${z2(w, -h * 1.2)}L${z2(w, yl - h * 0.1)}Q${z2(0, yl + h * 0.22, -w, yl)}Z" fill="${o.lidfarbe || "#3a2a20"}"/>` +
      `<path d="M${z2(w, yl - h * 0.1)}Q${z2(0, yl + h * 0.22, -w, yl)}" fill="none" stroke="#000" stroke-width="${r2(h * 0.18)}" stroke-opacity=".35"/>`;
  }
  s += `</g>`;
  /* Lidrand dunkel, Unterlid feucht hell, Lidfalten als Paare */
  s += `<path d="${A}" fill="none" stroke="#0a0604" stroke-width="${r2(h * 0.09)}" stroke-opacity=".9"/>`;
  s += `<path d="M${z2(w * 0.3, h * 0.32)}C${z2(w * 0.12, h * 0.46, -w * 0.08, h * 0.47, -w * 0.18, h * 0.44)}" fill="none" stroke="#fff4e6" stroke-width="${r2(h * 0.04)}" stroke-opacity=".4"/>`;
  /* Hautfalten: unregelmäßig, unterbrochen, oben dichter als unten, jede als Paar dunkle Rinne + helle Kante;
     dazu Krähenfüße, die vom hinteren Winkel fächerförmig auslaufen (keine konzentrischen Ringe) */
  const nf = o.falten != null ? o.falten : 2, hd = o.hautHell || "#c8a07a";
  let dD = "", dH = "";
  for (let i = 0; i < nf; i++) {
    const f = 1.25 + i * (0.26 + T.rnd() * 0.16), t0 = 0.05 + T.rnd() * 0.3, t1 = 0.62 + T.rnd() * 0.33, oben = i % 3 !== 2;
    const bog = (t) => { const xx = -w * 0.55 * f + w * 1.1 * f * t, yy = oben ? -h * (0.55 + 0.2 * i) * f * Math.sin(Math.PI * (0.1 + 0.8 * t)) + h * 0.05 : h * 0.45 * f * Math.sin(Math.PI * (0.15 + 0.7 * t)) + h * 0.2; return [xx, yy + (T.rnd() - 0.5) * h * 0.12]; };
    const a = bog(t0), m = bog((t0 + t1) / 2), e = bog(t1);
    dD += "M" + z2(...a) + "Q" + z2(m[0] * 2 - (a[0] + e[0]) / 2, m[1] * 2 - (a[1] + e[1]) / 2, ...e);
    dH += "M" + z2(a[0], a[1] + h * 0.1) + "Q" + z2(m[0] * 2 - (a[0] + e[0]) / 2, m[1] * 2 - (a[1] + e[1]) / 2 + h * 0.1, e[0], e[1] + h * 0.1);
  }
  for (let i = 0; i < (o.kraehen != null ? o.kraehen : nf ? 2 : 0); i++) {
    const a = (175 + (i - 0.5) * 22 + (T.rnd() - 0.5) * 10) * Math.PI / 180, L = w * (0.45 + T.rnd() * 0.35);
    dD += "M" + z2(-w * 0.58, h * 0.1) + "q" + z2(Math.cos(a) * L * 0.5, Math.sin(a) * L * 0.5 - h * 0.08, Math.cos(a) * L, Math.sin(a) * L);
  }
  if (dD) s += `<path d="${dD}" fill="none" stroke="#000" stroke-width="${r2(h * 0.08)}" stroke-opacity=".32" stroke-linecap="round"/>` +
    `<path d="${dH}" fill="none" stroke="${hd}" stroke-width="${r2(h * 0.06)}" stroke-opacity=".26" stroke-linecap="round"/>`;
  const nw = o.wimpern || 0;
  if (nw) {
    let d = "";
    const wa = (o.wwinkel != null ? o.wwinkel : 40) * Math.PI / 180;
    for (let i = 0; i < nw; i++) {
      const t = 0.12 + 0.8 * i / Math.max(1, nw - 1);
      const bx = -w / 2 + w * t, by = -h * 0.6 * Math.sin(Math.PI * t) + h * 0.06;
      const L = h * (o.wl || 1.4) * (0.6 + T.rnd() * 0.5) * (0.6 + t * 0.6);
      const a = wa - 0.5 + t * 0.6;
      const kb = o.wkrumm != null ? o.wkrumm : 0.6;
      d += `M${z2(bx, by)}q${z2(Math.cos(a - kb) * L * 0.5, Math.sin(a - kb) * L * 0.5, Math.cos(a) * L, Math.sin(a) * L)}`;
    }
    s += `<path d="${d}" fill="none" stroke="#120a05" stroke-width="${r2(h * 0.045)}" stroke-linecap="round"/>`;
  }
  return s + "</g>";
}
/* HAARMUSTER: kachelbares Feld aus feinen, verjüngten Haaren (nach unten), einmal in den defs. Abgeleitete Muster
   mit anderer Wuchsrichtung erben den Inhalt (href) und drehen nur – so kostet jede Richtung ~100 Byte.
   farben: [[Farbe, Anteil, Breite, Deckkraft], …]; winkel in Grad (90 = nach unten). Nur volle Feinheit. */
function HAARMUSTER(T, name, w, h, n, len, farben, winkel = 90, sk = 1) {
  T._hm = T._hm || {};
  const basis = T.id("hm_" + name);
  if (!T._hm[name]) {
    T._hm[name] = 1;
    const summe = farben.reduce((a, f) => a + f[1], 0), eim = farben.map(() => "");
    for (let i = 0; i < n; i++) {
      let u = T.rnd() * summe, j = 0;
      while (j < farben.length - 1 && u > farben[j][1]) { u -= farben[j][1]; j++; }
      const x = T.rnd() * w, y = T.rnd() * h, l = len * (0.6 + T.rnd() * 0.8), k = (T.rnd() - 0.5) * l * 0.25, dx = (T.rnd() - 0.5) * l * 0.12;
      for (const [ox, oy] of [[0, 0], [0, -h], [w, 0], [-w, 0], [w, -h], [-w, -h]]) {
        const X = x + ox, Y = y + oy;
        if (Y + l < 0 || Y > h || X + 2 < 0 || X - 2 > w) continue;
        eim[j] += "M" + z2(X, Y) + "q" + z2(k, l / 2, dx, l);
      }
    }
    T.def(`<pattern id="${basis}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">` + eim.map((d, j) => d ? `<path d="${d}" fill="none" stroke="${farben[j][0]}" stroke-width="${farben[j][2]}" stroke-opacity="${farben[j][3]}" stroke-linecap="round"/>` : "").join("") + `</pattern>`);
  }
  const rot = Math.round(winkel - 90), key = name + "_" + rot + "_" + sk;
  if (rot === 0 && sk === 1) return `url(#${basis})`;
  const id = T.id("hm_" + key.replace(/[^\w]/g, "x"));
  if (!T._hm[key]) { T._hm[key] = 1; T.def(`<pattern id="${id}" href="#${basis}" patternTransform="rotate(${rot})${sk !== 1 ? ` scale(${sk})` : ""}"/>`); }
  return `url(#${id})`;
}
/* Fläche mit Haarmuster füllen (Zonen mit eigener Wuchsrichtung), geklippt auf den Körper (clip = Pfad d) */
function HAARZONEN(T, d, zonen, muster) {
  if (T.fein === false) return "";
  let cid = null;
  if (d) { T._n = (T._n || 0) + 1; cid = T.id("hz" + T._n); T.def(`<clipPath id="${cid}"><path d="${d}"/></clipPath>`); }
  /* d = null: schon geklippt (Innenzeichnung eines K) – kein zweiter Pfad */
  return (cid ? `<g clip-path="url(#${cid})">` : "<g>") + zonen.map(([poly, winkel, op]) => {
    const g = GEN; GEN = 1; const dd = glatt(poly); GEN = g;
    return muster.map(([name, w, h, n, len, farben, sk]) => `<path d="${dd}" fill="${HAARMUSTER(T, name, w, h, n, len, farben, winkel, sk || 1)}" opacity="${op != null ? op : 1}"/>`).join("");
  }).join("") + `</g>`;
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
  SZ = !fein; SZMIN = 0.25; FLMIN = 0.3;
  const S0 = "#000", W = "#fff3dc";
  /* Töne des Deckhaars (dunkel → hell); dunkelster Ton nicht schwarz, damit Strähnen im Schatten lesbar bleiben */
  const TON = ["#2a190d", "#331f10", "#3e2513", "#4c2e18", "#5c381e", "#6e4424", "#82522c", "#9a6436"];
  const ROCK = ["#2e1b0e", "#3a2414", "#4d301b", "#64401f"];
  const FERN = ["#22170e", "#2c1e13", "#382618", "#45301f", "#523a26"];
  const SPITZ = [["#b8844c", 0.85], ["#cc9a5c", 0.8]];
  const wolle = T.lg("wolle", [[0, "#8e6038"], [0.22, "#74492a"], [0.5, "#58361e"], [0.78, "#3e2616"], [1, "#4a3020"]], 0, -360, 0, -140, UB);
  const haut = T.lg("rhaut", [[0, "#5a3a22"], [0.4, "#4e331f"], [1, "#46301f"]], 0, -260, 0, 0, UB);
  /* feines Haar überall (Kachelmuster, zwei Lagen: dunkle Grannen, helle Spitzen) – „jedes einzelne Haar" */
  const MU = [["m_d", 46, 64, 56, 26, [["#24150a", 2, 0.5, 0.55], ["#3a2414", 2, 0.45, 0.5]], 1]];
  let s = "";

  /* ---------- Form: Becken – leicht konkav – Fettbuckel über den Vorderbeinen – Nackenkerbe – Kuppel (Rouffignac) ---------- */
  const ruecken = [[30, -226], [42, -244], [70, -258], [128, -272], [186, -288], [236, -304], [272, -322], [300, -336], [326, -344], [346, -340],
    [362, -330], [372, -326], [384, -336], [402, -351], [420, -356], [438, -349], [452, -328], [459, -300], [459, -282], [456, -268], [457, -252]];
  const top = (x) => bei(ruecken.slice(0, 18), Math.max(30, Math.min(452, x)));
  const bauchY = (x) => (x > 392 ? -190 : x > 360 ? -168 + (x - 360) * -0.7 : -150 - Math.max(0, 90 - x) * 0.25);
  const t_ = (x, y) => (y - top(x)) / (bauchY(x) - top(x));
  const licht = (x, y) => {
    let v = zyl(t_(x, y)) + (x < 140 ? 0.04 : 0) - (x > 420 ? 0.04 : 0);
    if (x > 352 && x < 392 && y > -326 && y < -214) v -= 0.25;          // Schlagschatten des Kopfs auf Nacken und Schulter
    if (x > 372 && x < 446 && y > -236 && y < -150) v -= 0.22;          // Okklusion unter dem Kopf
    return Math.max(0, Math.min(1, v));
  };
  /* Fluss: Rücken 25° gegen die Senkrechte nach hinten, Flanke allmählich senkrecht, Kopf nach vorn-unten */
  const fluss = (x, y) => {
    const t = t_(x, y);
    if (x > 386) return 86 - Math.max(0, 0.3 - t) * 30;
    return 93 + 22 * Math.max(0, 1 - t / 0.55);
  };
  const lang = (x, y) => { const t = t_(x, y); return x > 386 ? 14 + 26 * Math.max(0, t - 0.35) : t < 0.25 ? 18 + 22 * t / 0.25 : 40 + 32 * Math.min(1, (t - 0.25) / 0.6); };

  /* ---------- Beine: Säule, zum Fußgelenk verjüngt; Ellbogenwulst hinten (−142), Handgelenk (−46); Knie vorn (−118), Ferse (−58) ---------- */
  const vorderbein = (cx) => glied([[cx + 4, -205, 28, 26], [cx, -168, 30, 25], [cx - 1, -142, 33, 24], [cx, -112, 25, 23], [cx + 1, -76, 22, 21], [cx + 1, -46, 23, 23],
    [cx + 1, -30, 21, 21]], [[cx + 22, -18], [cx + 24, -8], [cx + 23, -1], [cx + 21, 0, 1], [cx - 21, 0, 1], [cx - 23, -1], [cx - 24, -8], [cx - 22, -18]]);
  const hinterbein = (cx) => glied([[cx - 4, -215, 34, 28], [cx, -160, 30, 30], [cx + 3, -118, 24, 33], [cx + 3, -86, 22, 24], [cx + 2, -58, 26, 21], [cx + 3, -40, 22, 21],
    [cx + 4, -28, 21, 21]], [[cx + 25, -18], [cx + 27, -8], [cx + 26, -1], [cx + 24, 0, 1], [cx - 18, 0, 1], [cx - 20, -1], [cx - 21, -8], [cx - 19, -18]]);
  const beinLicht = (P, ferne) => (x, y) => {
    let v = zylX(quer_u(P, x, y)) * (ferne ? 0.75 : 1);
    if (y < -150) v -= 0.3 * Math.min(1, (-150 - y) / 40);           // Verdeckung unter Bauch und Rock
    return Math.max(0, Math.min(1, v));
  };
  const fuss = (cx, ferne, vorn) => {
    /* Sohle 5–8 % breiter als oben, leicht gewölbte Unterkante, Haut wie der Rüssel mit feinen waagrechten Runzeln */
    const o = vorn ? 0 : 3;
    const P = [[cx - 22 + o, -1], [cx - 24 + o, -8], [cx - 22 + o, -20], [cx - 20 + o, -30], [cx + 20 + o, -30], [cx + 23 + o, -20], [cx + 25 + o, -8], [cx + 23 + o, -1], [cx + 12 + o, 0.4], [cx - 10 + o, 0.4]];
    let f = K(T, P, ferne ? "#2a211b" : T.lg("haut", [[0, "#5a4636"], [0.5, "#44362a"], [1, "#2a201a"]], 0, 0, 1, 0), { rand: false, vol: false, innen:
      fleck(T, cx + o, -1, 26, 3, S0, 0.45) + (fein && !ferne ? `<path d="M${zf(cx - 20 + o, -22)}h16m6 1h14M${zf(cx - 21 + o, -17)}h12m5 0h20M${zf(cx - 22 + o, -12)}h18m6 .5h16M${zf(cx - 21 + o, -7)}h10m6 0h22" stroke="#120a06" stroke-width=".6" opacity=".22" fill="none"/>` : "") });
    /* Nägel: flache Halbmonde 2:1 auf der Sohlenkante, nur vorn; nah 3, fern 2; Unterkante schmutzig dunkel */
    if (fein) {
      const ng = ferne ? "#6e665a" : T.lg("nagel", [[0, "#b0a48c"], [0.7, "#8e826c"], [1, "#4a4036"]]);
      for (const x of (ferne ? [cx + 17 + o, cx + 6 + o] : [cx + 18 + o, cx + 8 + o, cx - 2 + o])) f += F(`M${zf(x - 5, 0)}q0-5 5-5q5 0 5 5z`, ng) + `<path d="M${zf(x - 5, -0.5)}h10" stroke="#2a2018" stroke-width="1" opacity=".7"/>`;
    }
    return f;
  };
  const bein = (P, cx, ferne, vorn) => {
    let b = K(T, P, ferne ? "#2e1e12" : T.lg("beinn", [[0, "#4e301a"], [0.5, "#3e2614"], [1, "#2e1c0e"]], 0, -210, 0, 0, UB), { rand: false, vol: false, innen:
      fleck(T, cx, -180, 40, 36, S0, 0.45) }) + fuss(cx, ferne, vorn);
    /* Beinfell: Strähnen senkrecht, fallen in unregelmäßigen Spitzen über die oberen 40–60 % des Fußes */
    const H0 = [[cx - 30, -208], [cx + 30, -208], [cx + 28, -30], [cx - 28, -30]];
    b += LOCKEN(T, H0, ferne ? 18 : 34, (x) => 91 + (x < cx ? 2 : -2), (x, y) => 22 + (y + 205) * 0.05, 3.6, beinLicht(P, ferne), ferne ? FERN : TON, { streuung: 7, szene: ferne ? 0.06 : 0.12, szeneB: 2.2 });
    b += LOCKENLINIE(T, [[cx - 24, -38], [cx + 26, -38]], ferne ? 10 : 18, [-6, 0], 92, (x) => 18 + ((x * 7.3) % 1) * 14, 3.4, beinLicht(P, ferne), ferne ? FERN : TON, { streuung: 10, szene: 0.25, haare: ferne ? 0 : 2, hb: 0.5 });
    if (fein && !ferne) b += LOCKEN(T, [[cx - 26, -200], [cx - 10, -200], [cx - 10, -60], [cx - 26, -60]], 8, 91, 26, 1.2, () => 1, SPITZ, { streuung: 6, jitter: 0.3 });
    return `<g filter="${T.volumen(ferne ? "beinf" : "beinn", { weich: 12, tiefe: 5, umgebung: 0.3 })}">${b}</g>`;
  };
  const VF = vorderbein(334), HF = hinterbein(100), VN = vorderbein(356), HN = hinterbein(76);

  /* ---------- ferne Beine, ferner Stoßzahn, Schwanz ---------- */
  s += bein(VF, 334, true, true) + bein(HF, 100, true, false);
  /* Schwanz: Ansatz tief (−214), von Anfang an 75° nach unten-hinten, liegt am Gesäß an, 60 % im Körperhaar, Quaste aus Strähnen */
  s += K(T, [[34, -218], [27, -214], [24, -200], [23, -184], [27, -183], [29, -198], [33, -208]], "#3e2616", { rand: false, vol: false });
  s += LOCKEN(T, [[22, -188], [28, -188], [28, -182], [22, -182]], 7, 98, 17, 2.2, () => 0.35, ROCK, { streuung: 12, szene: 0.4, haare: 2, hb: 0.6, jitter: 0.8 });

  /* ferner Stoßzahn: zu mehr als der Hälfte hinter dem nahen, Spitze 20 cm links und 8 cm tiefer, 25 % dunkler */
  const zahn = [[436, -214], [448, -188], [468, -160], [498, -140], [534, -130], [570, -136], [598, -158], [612, -190], [610, -226], [596, -254], [576, -269], [557, -275]];
  const zahnF = zahn.map(([x, y], i) => { const t = Math.pow(i / (zahn.length - 1), 3); return [x - 4 - 18 * t, y - 3 + 10 * t]; });
  s += K(T, rohr(zahnF, 22, 8, "rund"), T.lg("elff", [[0, "#988868"], [0.5, "#8a7a5c"], [1, "#5e4e38"]], 0, 0, 0.25, 1), { rand: false, vol: false, innen:
    LI(quer(zahnF, 22, 8, -0.7), "#3a2e20", 3, ` opacity=".4"`) + LI(zahnF.slice(9), "#6a5434", 9, ` opacity=".4"`) });

  /* ---------- nahe Beine ---------- */
  s += bein(HN, 76, false, false) + bein(VN, 356, false, true);

  /* ---------- Rüssel: ohne Knick aus der Stirn, verjüngt (46 → 34 → 18 cm), Körperbraun, oben behaart, Ringfalten als Bögen ---------- */
  const vorn = [[459, -252], [462, -230], [463, -196], [463, -150], [462, -114], [459, -80], [458, -54], [459, -36]];
  const hint = [[406, -246], [410, -222], [416, -196], [424, -150], [428, -114], [434, -80], [438, -54], [441, -30]];
  const spitze = [[463, -27], [470, -24], [477, -24], [483, -27], [486, -31, 1], [484, -24], [481, -21], [487, -19], [490, -14], [488, -9], [480, -6], [468, -6], [454, -9], [446, -16]];
  const rueP = [...vorn, ...spitze, ...hint.slice().reverse()];
  let falten = "", kanten = "";
  for (let y = -186, i = 0; y < -28; i++, y += (fein ? 1 : 2.4) * (3.6 + 2.2 * (-28 - y) / 158) * (0.85 + T.rnd() * 0.3)) {
    if (i % 3 === 2 && fein) continue;
    const xa = bei(hint, y, 1), xb = bei(vorn, y, 1), w = xb - xa, a0 = 0.03 + T.rnd() * 0.32, a1 = 0.62 + T.rnd() * 0.36, b = w * (0.1 + T.rnd() * 0.08);
    falten += "M" + zf(xa + w * a0, y + b * Math.sin(Math.PI * a0) * 1.2) + "q" + zf(w * (a1 - a0) / 2, b * 1.7, w * (a1 - a0), b * 1.2 * (Math.sin(Math.PI * a1) - Math.sin(Math.PI * a0)));
    if (fein) kanten += "M" + zf(xa + w * a0, y + 1.4 + b * Math.sin(Math.PI * a0) * 1.2) + "q" + zf(w * (a1 - a0) / 2, b * 1.7, w * (a1 - a0), b * 1.2 * (Math.sin(Math.PI * a1) - Math.sin(Math.PI * a0)));
  }
  let rue = K(T, rueP, haut, { rand: false, vol: false, innen:
    `<path d="${falten}" fill="none" stroke="#1a0e06" stroke-width="1" opacity=".45"/>` + (kanten ? `<path d="${kanten}" fill="none" stroke="#c09070" stroke-width=".6" opacity=".22"/>` : "") +
    /* Schlagschatten des Stoßzahns auf dem Rüssel */
    WEICH(T, FO([[426, -196], [446, -170], [470, -148], [470, -136], [446, -158], [428, -182]], S0, 0.38), 2) +
    /* Spitze: dunkle Nasenöffnung zwischen Finger und Lappen */
    `<path d="M480-21q5 1 7 2q-4 2-7-2z" fill="#0a0604"/>` + fleck(T, 476, -15, 8, 4, "#8a6a58", 0.5) });
  rue += LOCKEN(T, [[406, -248], [458, -250], [463, -150], [428, -140], [414, -200]], 36, 92, (x, y) => 7 + (y + 250) * 0.03, 2, (x, y) => Math.max(0, zylX((x - 404) / 58) - 0.05), TON, { streuung: 10, szene: 0.08, szeneB: 2, haare: 1, hb: 0.4 });
  if (fein) rue += FELL(T, [[428, -140], [462, -140], [458, -60], [438, -60]], 34, 95, 3.5, (x, y) => zylX((x - 428) / 32), [["#2a1a0e", 0.5, 0.4], ["#4e321e", 0.5, 0.4], ["#7a5434", 0.4, 0.35]], { szene: 0 });
  s += `<g filter="${T.volumen("ruessel", { weich: 9, tiefe: 5, umgebung: 0.3 })}">${rue}</g>`;

  /* ---------- Rumpf mit Kopf: Grund = Unterwolle, darauf feines Haar und Strähnen; Volumen über den ganzen Körper ---------- */
  const koerper = [...ruecken, [460, -240], [455, -224], [440, -210], [418, -200], [398, -190], [386, -172], [370, -156],
    [330, -148], [270, -144], [200, -142], [140, -146], [100, -152], [64, -164], [42, -178], [30, -198], [28, -214]];
  const dK = glatt(koerper);
  let rumpf = K(T, dK, wolle, { rand: false, vol: false, innen:
    /* Kuppel als Kugel: Glanz oben links, Kernschatten rechts unten, Reflex an der Stirnkante */
    WEICH(T, FO([[386, -340], [404, -352], [424, -354], [436, -344], [420, -336], [398, -330]], "#d8a46c", 0.4) +
      FO([[426, -300], [446, -310], [452, -286], [440, -272], [424, -282]], S0, 0.3) + FO([[452, -320], [458, -300], [458, -284], [454, -300]], "#c89660", 0.3) +
      /* Schlagschatten des Kopfs auf Nacken und Schulter; Kernschatten unten; Bauchreflex */
      FO([[356, -326], [372, -322], [388, -300], [392, -250], [380, -214], [362, -230], [354, -280]], S0, 0.3) +
      FO([[60, -186], [140, -176], [240, -174], [330, -180], [384, -196], [384, -176], [330, -164], [240, -160], [140, -162], [60, -170]], S0, 0.28) +
      FO([[400, -214], [440, -216], [450, -204], [420, -196], [398, -200]], S0, 0.4), 6) });
  rumpf += HAARZONEN(T, dK, [
    [[[20, -262], [372, -372], [372, -306], [20, -222]], 126, 0.9],
    [[[20, -222], [372, -306], [372, -140], [20, -140]], 100, 0.9],
    [[[372, -372], [470, -372], [470, -190], [372, -190]], 84, 0.9]], MU);
  /* Strähnen in zwei Lagen, je mit 2–3 Einzelhaaren und aufgespaltenen Spitzen; Lichthaare nur auf der Lichtseite */
  const rumpfZone = [[34, -222], [70, -254], [186, -284], [272, -318], [326, -340], [362, -326], [372, -322], [386, -300], [390, -250], [392, -200],
    [380, -172], [330, -156], [200, -150], [100, -158], [50, -176], [32, -200]];
  rumpf += LOCKEN(T, rumpfZone, 84, fluss, lang, 5.4, (x, y) => licht(x, y) * 0.86, TON, { streuung: 7, kruemmung: 0.1, szene: 0.2, szeneB: 2, haare: 2, hb: 0.6 });
  rumpf += LOCKEN(T, rumpfZone, 52, fluss, (x, y) => lang(x, y) * 0.7, 3.6, licht, TON, { streuung: 7, kruemmung: 0.12, szene: 0.12, szeneB: 2 });
  if (fein) rumpf += LOCKEN(T, [[40, -238], [70, -256], [186, -286], [272, -320], [326, -342], [360, -330], [330, -312], [240, -290], [140, -270], [60, -244]],
    30, fluss, (x, y) => lang(x, y) * 0.8, 1.2, () => 1, SPITZ, { streuung: 6, jitter: 0.4 });
  /* Kontur brechen: alle 6–12 cm eine Strähnenspitze 2–6 cm über die Rückenlinie, mit Randlicht */
  rumpf += LOCKENLINIE(T, ruecken.slice(0, 11), 44, [-4, 8], (x, y) => fluss(x, y + 6) + 6, (x) => (x > 290 && x < 372 ? 20 : 15), 3, (x, y) => licht(x, y + 6) + 0.08, TON, { streuung: 8, szene: 0.15, szeneB: 1.6, haare: 1, hb: 0.5 });
  rumpf += LOCKENLINIE(T, ruecken.slice(1, 11), 24, [0, 3], (x) => (x > 300 && x < 372 ? 160 : 172), (x) => (x > 290 && x < 372 ? 14 : 10), 1.6, () => 1, TON, { streuung: 8, szene: 0.1 });
  /* Rock: Bündel verschieden lang (±25 %), mit Lücken; 3 Töne statt fast schwarz; 30 % der Spitzen gebogen, aufgespalten */
  const rockZone = [[54, -172], [120, -160], [200, -156], [270, -158], [330, -160], [380, -176], [396, -196], [390, -206], [330, -184], [200, -176], [60, -186]];
  const rockLang = (x) => (x > 340 ? 74 : x < 110 ? 40 : 56) * (0.85 + 0.3 * ((x * 0.37) % 1));
  const rockLicht = (x, y) => 0.25 + 0.5 * Math.max(0, Math.min(1, (y + 150) / 60));       // Reflex vom Boden an den Spitzen
  rumpf += LOCKEN(T, rockZone, 16, (x) => 93 + ((x * 1.7) % 1 - 0.5) * 16, rockLang, 14, rockLicht, ROCK, { streuung: 4, kruemmung: 0.18, szene: 0.5, szeneB: 1.2, jitter: 0.6, haare: 3, hb: 0.8 });
  rumpf += LOCKEN(T, rockZone, 46, (x) => 93 + (x < 120 ? 5 : 0), (x) => rockLang(x) * 0.9, 4, rockLicht, ROCK, { streuung: 10, kruemmung: 0.22, szene: 0.1, szeneB: 2.4, jitter: 0.8, haare: 1, hb: 0.6 });
  s += `<g filter="${T.volumen("rumpf", { weich: 40, tiefe: 5, umgebung: 0.32 })}">${rumpf}</g>`;

  /* ---------- Kopf ---------- */
  const auge = [428, -272];
  const kopfLicht = (x, y) => Math.max(0, Math.min(1, zyl((y + 356) / 170) - (x > 446 ? 0.08 : 0)));
  /* Ohr: klein (34 × 22 cm), hochoval, nach hinten geneigt; die unteren 60 % unter Halshaar, sichtbar nur der obere Hinterrand */
  let ohr = K(T, [[370, -286], [380, -288], [388, -280], [389, -266], [384, -254], [372, -252, 1], [366, -264], [366, -278]],
    T.lg("ohr", [[0, "#5a3a20"], [1, "#3a2414"]]), { rand: false, vol: false });
  ohr += FELL(T, [[368, -286], [388, -286], [388, -262], [368, -262]], 26, 104, 4, (x, y) => kopfLicht(x, y) - 0.12, [["#3a2414", 0.6, 0.4], ["#5c381e", 0.6, 0.4], ["#7a4c28", 0.5, 0.35]], { szene: 0 });
  s += fleck(T, 391, -270, 5, 14, S0, 0.35) + `<g filter="${T.volumen("ohr", { weich: 4, tiefe: 4 })}">${ohr}</g>`;
  /* Halshaar fällt von oben über den unteren Ohrrand */
  s += LOCKEN(T, [[362, -276], [392, -276], [392, -262], [362, -262]], 20, 96, 22, 4, (x, y) => kopfLicht(x, y) - 0.05, TON, { streuung: 8, szene: 0.2, haare: 1, hb: 0.5 });

  /* ---------- Gesicht: Kopfhaar kurz, Stirn nach vorn-unten; Augenzone nur kurzes, anliegendes Haar ---------- */
  const kopfZone = [[372, -324], [388, -338], [404, -352], [420, -354], [440, -346], [454, -326], [458, -300], [459, -276], [456, -256], [440, -252], [418, -246], [396, -250], [380, -292]];
  const ohneAuge = (x, y) => Math.hypot(x - auge[0], (y - auge[1]) * 1.2) > 14;
  s += LOCKEN(T, kopfZone, 80, (x, y) => (y < -332 ? 60 : 86 + (x < 400 ? 6 : 0)), (x, y) => (ohneAuge(x, y) ? 11 + (y + 340) * 0.06 : 0.01), 2.4, kopfLicht, TON, { streuung: 8, szene: 0.1, szeneB: 2.4 });
  /* Wangenhaar deckt die hintere Rüsselkante */
  s += LOCKEN(T, [[398, -250], [418, -250], [422, -206], [404, -200]], 22, 96, 18, 3, (x, y) => licht(x, y) + 0.1, TON, { streuung: 8, szene: 0.2, haare: 1, hb: 0.45 });
  if (fein) {
    const AZ = []; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; AZ.push([auge[0] + Math.cos(a) * 16, auge[1] + Math.sin(a) * 13]); }
    s += FELL(T, AZ, 30, (x, y) => Math.atan2(y - auge[1], x - auge[0]) * 180 / Math.PI + 15, (x, y) => Math.min(4, Math.hypot(x - auge[0], y - auge[1]) * 0.3), kopfLicht,
      [["#2a190d", 0.6, 0.4], ["#4c2e18", 0.6, 0.4], ["#6e4424", 0.55, 0.35], ["#9a6436", 0.5, 0.35]], { szene: 0 });
  }
  /* Kuppelkontur: abgelegte Schopfsträhnen (10–16 cm, nach vorn-unten) brechen den Kreisbogen */
  s += LOCKENLINIE(T, [[388, -346], [404, -354], [422, -357], [440, -350], [452, -332]], 22, [-3, 5], 62, (x) => 10 + ((x * 3.1) % 1) * 7, 3, (x, y) => 0.88, TON, { streuung: 12, szene: 0.25, haare: 2, hb: 0.45 });

  /* Maul: kleiner Keil direkt hinter dem Zahnaustritt, schmale Unterlippe */
  s += F([[420, -208], [431, -209], [434, -203], [428, -199], [421, -201]], "#1a0f0a") + F([[422, -199.5], [431, -200.5], [429, -195.5], [423, -196.5]], "#5a463c");

  /* ---------- naher Stoßzahn: Spirale (nach vorn-unten, vorn-oben, Spitze zurück und einwärts), abgerundete, verwitterte Spitze ---------- */
  const ZW = [26, 8];
  let zz = LI(quer(zahn, ...ZW, 0.55).slice(2, 4), "#efe4cc", 2.4, ` opacity=".6"`) + LI(quer(zahn, ...ZW, 0.55).slice(5, 7), "#efe4cc", 2.2, ` opacity=".6"`) +
    LI(quer(zahn, ...ZW, 0.55).slice(8, 10), "#efe4cc", 1.6, ` opacity=".5"`) +
    LI(quer(zahn, ...ZW, -0.72), "#5a4630", 4, ` opacity=".35"`) + LI(zahn.slice(0, 3), "#8a7350", 18, ` opacity=".25"`) +
    /* letzte 15 % gelbbraun verwittert, Abriebfacette an der Unterseite */
    LI(zahn.slice(9), "#9c8460", 9, ` opacity=".55"`) + LI(quer(zahn, ...ZW, -0.4).slice(9), "#d8c8a4", 1.8, ` opacity=".5"`);
  if (fein) zz += [-0.3, 0.05, 0.3, -0.55].map((q, i) => LI(quer(zahn, ...ZW, q).slice(1 + i, 6 + i * 1.5), "#5a4630", 0.5, ` opacity=".15"`)).join("") +
    `<path d="M440-206q4 2 7 1M442-200q4 2 7 0M444-194q4 2 7 0M447-188q4 1 6-1" stroke="#6a5638" stroke-width=".5" opacity=".1" fill="none"/>`;
  s += K(T, rohr(zahn, ...ZW, "rund"), T.lg("elf", [[0, "#e0d2b0"], [0.45, "#d4c4a0"], [0.8, "#b8a27c"], [1, "#94805c"]], 0, 0, 0.25, 1), { rand: false, vol: false, innen: zz });
  /* behaarte Lippe deckt den Zahnansatz */
  /* ---------- Zahnscheide: flache Schwellung diagonal vom Auge zum Zahnaustritt, kurzes Haar; endet am Zahnaustritt ---------- */
  s += WEICH(T, FO([[420, -256], [432, -258], [442, -238], [436, -236]], "#d8a46c", 0.16) + FO([[436, -230], [448, -222], [446, -208], [434, -214]], S0, 0.35), 3);
  s += FELL(T, [[418, -256], [432, -258], [446, -232], [448, -212], [436, -210], [424, -232]], 46, 66, 7, (x, y) => Math.max(0, 0.85 - (y + 258) / 60), [["#2a190d", 0.7, 0.6], ["#4c2e18", 0.7, 0.6], ["#6e4424", 0.6, 0.55], ["#9a6436", 0.6, 0.5]], { szene: 0.2 });

  /* ---------- Auge: unterbrochene Oberlidfalte, Krähenfüße, lange Wimpern nach vorn-unten ---------- */
  s += AUGE2(T, auge[0], auge[1], 7.4, 3.8, { iris: "#3a2410", iris2: "#6a4422", winkel: -6, falten: 3, kraehen: 2, wimpern: 10, wl: 1.9, wwinkel: 55, wkrumm: 0.35, haut: "#3a2a20", hautHell: "#b08866" });

  return { svg: s, box: [20, -360, 618, 0], fuesse: [356, 334, 79, 103], kopf: [364, -366, 500, -150] };
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
  SZ = !fein; SZMIN = 0.25; FLMIN = 0.2;
  const S0 = "#000", HL = "#fff2d6", CREME = "#e8dcc4";
  const FT = [["#4e321a", 0.5, 0.13], ["#6a4626", 0.45, 0.12], ["#8a6038", 0.4, 0.12], ["#c49a66", 0.42, 0.11], ["#f2dcb4", 0.5, 0.1]];
  /* feines Fell als Kachelmuster: dunkler Schaft und helle Spitze, 1–1,4 cm lang */
  const MU = [["s_d", 5, 7, 70, 1.2, [["#5a3a1c", 1, 0.12, 0.3], ["#7a5230", 1, 0.11, 0.26]]], ["s_h", 6, 5, 46, 1, [["#f0d8a8", 1, 0.1, 0.32], ["#d8b07a", 1, 0.1, 0.24]]]];
  let s = "";

  /* ---------- Formen (cm). Widerrist 102 cm, kompakter Rumpf, kurze Lende, massige Vorderhand ---------- */
  const ruecken = [[24, -86], [28, -89.6], [36, -91.8], [48, -92.6], [60, -92.2], [74, -92.6], [88, -93.4], [100, -96.6], [108, -100.6], [116, -103.4], [124, -102.6], [134, -100], [144, -97.2], [150, -96.6]];
  /* Kopf: kurzes Gesicht, hoher runder Schädel (Scheitel 9 cm über dem Auge), flache Einsattelung vor dem Auge,
     stumpfe, senkrechte Schnauze, Nasenspiegel oben; Unterkiefer mit Kinnflansch knapp hinter der Säbel-Vorderkante */
  const kopfOben = [[155, -100.8], [160, -103.8], [166, -104.4], [170, -102.8], [173.2, -100], [175.4, -97.8], [177.8, -96.8], [180.6, -95.6], [182.8, -94.6], [184.1, -92.8],
    [184.5, -90.2], [184.8, -87.6], [184.2, -85.4], [183, -84]];
  const kinn = [[181.2, -83.2], [180.4, -82.6], [180.2, -78.6], [179.8, -75.4], [177.4, -74.6], [172, -76.2], [166, -79.2], [160, -82.4], [155, -85.4], [152, -88]];
  const bauch = [[149, -81], [147.4, -74], [145.6, -66], [141, -60], [128, -54.6], [112, -52.6], [100, -55.4], [86, -59.6], [72, -64], [62, -66], [52, -66], [40, -65.4],
    [30, -68], [20, -71], [15.5, -77], [16, -83], [20, -85.4]];
  const rumpf = [...ruecken, ...kopfOben, ...kinn, ...bauch];
  /* Vorderbein: Unterarm unter dem Ellbogen 17 cm, Handgelenk 12–13 cm bei −12, Ellbogenhöcker hinten auf Brustbeinhöhe,
     Karpalballen hinten, runde Pfote 20–25 % breiter mit Zehenwülsten */
  const vbein = (dx) => [[128, -80], [138, -70], [141, -60], [137.6, -50], [136, -42], [134.8, -30], [133.8, -20], [133.4, -16], [134.6, -12], [136.4, -10.4], [137.8, -10.8],
    [139.4, -9.4], [140.6, -9.6], [142, -8], [143.2, -8], [144.4, -6], [145.4, -4.6], [146, -2.4], [145.4, -0.6], [143.6, 0, 1], [121.6, 0, 1], [120, -2.4], [119.8, -6.4], [120.6, -9], [119.2, -11.4],
    [120.4, -14], [120.8, -18], [120.2, -30], [119.2, -42], [117.4, -47], [114.6, -50.6], [113.8, -55], [116, -66], [120, -78]].map(([x, y, h]) => [x + dx, y, h]);
  /* Hinterbein als Z: Oberschenkel nach vorn zum Knie (−48), Unterschenkel schräg nach hinten zum Fersenhöcker (−25, ragt 2,4 cm
     hinter den Mittelfuß), Achillessehne konkav, Mittelfuß steil, nur die Zehen am Boden */
  const hbein = (dx) => [[44, -82], [55, -72], [60.6, -63], [61.4, -55], [59, -48], [56, -42], [51.4, -36], [47, -30], [44, -25.6], [43.4, -20], [44, -14], [45, -9.8],
    [46.6, -8.2], [48, -8.6], [49.4, -7.2], [50.6, -7.4], [51.8, -5.8], [53, -4.6], [53.8, -2.4], [53.6, -0.8], [53.2, 0, 1], [37.4, 0, 1], [36, -2.4], [36, -6], [36.4, -12], [36.2, -18], [35.6, -22],
    [33.4, -25.4], [34.4, -29.6], [34.6, -35], [32.6, -42], [29, -48], [24, -56], [19.4, -63], [16.4, -70], [16, -78], [22, -84]].map(([x, y, h]) => [x + dx, y, h]);
  const schw = [[24, -85.6], [17, -85.4], [11, -83.4], [7, -78], [4.6, -71], [4, -64.4], [6, -62.4], [8.4, -63.6], [9.4, -70], [11.6, -76], [15.4, -79.6], [21, -80.6]];
  const VN = vbein(0), HN = hbein(0), VF = vbein(-9), HF = hbein(7);
  const grund = T.lg("grund", [[0, "#946a3e"], [0.1, "#a87c48"], [0.3, "#bc905a"], [0.55, "#c49a64"], [0.8, "#bc9260"], [1, "#a88052"]], 0, -104, 0, 0, UB);

  /* Zylinderlicht eines Beins (weich gemalt): Licht links, Kernschatten rechts, schmaler Reflex */
  const beinLicht = (P, y0, y1, k = 1) => (SZ ? "" : FO(streifen(P, y0, y1, 0.1, 0.34, 6), HL, 0.28 * k) + FO(streifen(P, y0, y1, 0.66, 0.9, 6), S0, 0.3 * k) +
    FO(streifen(P, y0 + 4, y1, 0.92, 0.99, 6), "#e8c898", 0.25 * k));
  const zonen = (y0) => [[[[0, y0], [200, y0], [200, 2], [0, 2]], 93, 1]];
  const zehen = (pts) => `<path d="${pts.map(([x, y]) => "M" + z2(x, y) + "q.3 1.6-.1 3.2").join("")}" stroke="#3a2412" stroke-width=".45" fill="none" opacity=".55"/>`;

  /* ---------- ferne Beine: gleiche Gliederung, 20 % dunkler, Form sichtbar ---------- */
  for (const [P, y0] of [[VF, -50], [HF, -56]]) {
    const d = glatt(P);
    s += `<g filter="${T.volumen("beinf", { weich: 3.5, tiefe: 5 })}">` + K(T, d, grund, { rand: false, vol: false, innen: `<rect x="0" y="-110" width="200" height="112" fill="#000" opacity=".2"/>` +
      WEICH(T, beinLicht(P, y0, -8, 0.8), 1) + HAARZONEN(T, d, zonen(-90), MU.slice(0, 1)) + fleck(T, P[18][0] + 10, -1, 12, 2, S0, 0.4) }) + "</g>";
  }

  /* ---------- Schwanz: Fortsetzung der Kruppenkurve, 4–5 cm unter der Rückenlinie, verjüngt, Spitze dunkler ---------- */
  const dS = glatt(schw);
  s += `<g filter="${T.volumen("schwanz", { weich: 1.5, tiefe: 5 })}">` + K(T, dS, T.lg("schw", [[0, "#a07444"], [0.7, "#8a6036"], [1, "#4e3018"]], 0, -88, 0, -62, UB), { rand: false, vol: false, innen:
    HAARZONEN(T, dS, [[[[0, -90], [26, -90], [26, -60], [0, -60]], 100, 1]], MU) }) +
    FELL(T, [[3.6, -70], [9, -70], [9, -62], [4, -62]], 40, 100, 1.4, () => 0.15, FT, { szene: 0.3 }) + "</g>";

  /* ---------- Körper mit Kopf und nahen Beinen als eine Fläche; Volumen über den ganzen Körper ---------- */
  const dK = [rumpf, VN, HN].map((p) => glatt(gleich(p))).join("");
  const malen = WEICH(T,
    /* Rückenmitte 10–15 % dunkler; Gegenschattierung creme: Bauch, Brust, Kehle, Kinn, Schnauzenunterseite */
    FO([[30, -90], [88, -94], [124, -101], [140, -98], [124, -96], [88, -90], [32, -86]], "#6a4626", 0.3) +
    FO([[60, -68], [86, -63], [112, -56], [128, -57], [141, -62], [146, -70], [150, -80], [156, -84], [166, -78], [176, -75], [180, -76], [180, -80], [172, -79], [160, -82],
      [150, -86], [146, -78], [140, -66], [128, -62], [112, -61], [86, -66], [62, -70]], CREME, 0.85) +
    /* Okklusion: Achsel, Leiste, unter dem Unterkiefer; Schlagschatten des Kopfs auf den Hals */
    FO([[112, -58], [118, -55], [118, -48], [112, -50]], S0, 0.35) + FO([[56, -66], [62, -63], [62, -56], [57, -58]], S0, 0.35) +
    FO([[152, -86], [162, -81], [170, -78], [158, -77], [150, -80]], S0, 0.3) + FO([[146, -96], [152, -94], [154, -84], [146, -82], [142, -90]], S0, 0.22) +
    /* Muskeln als Formen: Schulterblatt mit Lichtkante oben, Trizeps-Wulst mit Schatten dahinter, Oberarm,
       Bizeps femoris (Schatten an der Hinterkante), Quadrizeps vorn mit Lichtkante, Wade über der Sehne */
    FO([[112, -100], [126, -100], [136, -86], [136, -76], [128, -80], [118, -92]], HL, 0.22) + FO([[110, -98], [114, -98], [124, -80], [128, -70], [124, -70], [114, -84]], S0, 0.12) +
    FO([[114, -72], [124, -74], [128, -62], [122, -56], [114, -60]], HL, 0.16) + FO([[112, -60], [118, -58], [117, -51], [112, -53]], S0, 0.22) +
    FO([[22, -86], [36, -88], [44, -80], [38, -66], [26, -66], [20, -76]], HL, 0.2) + FO([[16, -80], [21, -80], [25, -62], [24, -54], [18, -62]], S0, 0.26) +
    FO([[46, -80], [56, -74], [62, -62], [62, -56], [56, -62], [50, -72]], HL, 0.2) +
    FO([[28, -50], [33, -46], [35, -38], [32, -36], [28, -42]], HL, 0.2) + FO([[33.4, -34], [35, -34], [35.2, -27], [34, -27]], HL, 0.35) +
    beinLicht(VN, -48, -8) + beinLicht(HN, -46, -8) +
    /* Kopf: Schädelkugel, Nasenrücken mit Glanz, Jochbogen hell, Schläfenmuskel mit Schatten unten, Augenhöhle,
       heller Fleck über und unter dem Auge, Schnurrhaarpolster hell */
    FO([[155, -100], [164, -103.4], [170, -101.4], [162, -99], [155, -97]], HL, 0.32) + FO([[176, -97], [182.6, -95], [182.6, -94], [176, -96]], HL, 0.36) +
    FO([[160, -91.6], [170, -92.6], [172, -91], [161, -90.2]], HL, 0.32) + FO([[160, -89.8], [171, -90.4], [170, -89], [161, -88.6]], S0, 0.16) +
    FO([[158, -98], [166, -98.4], [167, -93.4], [159, -94]], S0, 0.14) + FO([[168.6, -96.4], [174.4, -96.8], [175, -94.2], [169, -94]], S0, 0.2) +
    FO([[169.6, -98.8], [174.6, -99.2], [176, -98], [170.6, -97.6]], CREME, 0.55) + FO([[169.2, -93.4], [174.6, -93.2], [175.6, -92.2], [170.6, -92]], CREME, 0.6) +
    FO([[177.4, -91.6], [182.4, -93], [184, -88.4], [183.2, -84.6], [177.6, -85.6], [176.2, -88.6]], CREME, 0.75), 1.4);
  let k = K(T, dK, grund, { rand: false, vol: false, innen: malen +
    HAARZONEN(T, dK, [
      [[[150, -110], [200, -110], [200, -70], [150, -70]], 184, 1],
      [[[126, -110], [150, -110], [150, -50], [126, -50]], 138, 1],
      [[[0, -110], [126, -110], [126, -54], [0, -54]], 150, 1],
      [[[0, -54], [150, -54], [150, 2], [0, 2]], 93, 1]], MU) +
    fleck(T, 133, -1, 13, 2, S0, 0.4) + fleck(T, 45, -1, 10, 2, S0, 0.4) });
  /* Fellsaum: auf dem Umriss 0,3–0,5 cm quer zur Kante, auf der Rückenlinie alle ~1 cm eine Haarspitze über der Kontur */
  if (fein) {
    k += LOCKENLINIE(T, ruecken, 130, [-0.4, 0.6], (x) => (x > 140 ? 205 : 192), 1, 0.1, () => 0.85, ["#c49a66", "#e8cc9c"], { streuung: 18, genau: 1, szene: 0 });
    k += LOCKENLINIE(T, bauch.slice(3, 12), 70, [-1, 0], 100, 1.2, 0.1, () => 0.6, ["#c4a07a", "#ecdcc0"], { streuung: 14, genau: 1, szene: 0 });
    k += LOCKENLINIE(T, HN.slice(26, 34), 30, [0, 0.6], 150, 0.9, 0.1, () => 0.5, ["#8a6038", "#c49a66"], { streuung: 16, genau: 1, szene: 0 });
    k += LOCKENLINIE(T, VN.slice(20, 28), 22, [0, 0.6], 135, 0.8, 0.1, () => 0.4, ["#8a6038", "#c49a66"], { streuung: 16, genau: 1, szene: 0 });
  }
  s += `<g filter="${T.volumen("koerper", { weich: 10, tiefe: 6.5, umgebung: 0.28 })}">${k}</g>`;

  /* ---------- Ohr: klein, rund, weiter vorn und tiefer; Muschel hell behaart, Rückseite dunkler mit hellem Randsaum ---------- */
  const OHR = [[158.4, -102], [158.2, -104.8], [159.6, -107.8], [161.8, -109], [163.8, -107.4], [164.8, -104.2], [164.4, -102.2]];
  s += `<g filter="${T.volumen("ohr", { weich: 0.6, tiefe: 2.5 })}">` + K(T, OHR, T.lg("ohr", [[0, "#6a4626"], [0.5, "#946a3e"], [1, "#a87c48"]], 0, 0, 1, 0), { rand: false, vol: false, innen:
    FO([[160.8, -102.6], [161.2, -106], [162.4, -107.2], [163.6, -105.2], [163.4, -102.8]], "#e2ceaa", 0.8) +
    LI([[158.4, -103.6], [159.4, -106.8], [161.6, -108.6]], "#3a2412", 0.35, ` opacity=".5"`) }) + "</g>";
  s += LOCKEN(T, [[161.2, -103], [162.4, -106.4], [163.4, -103.2]], 14, 255, 1.8, 0.12, () => 1, ["#f4ead8"], { genau: 1, szene: 0 });
  if (fein) s += LOCKENLINIE(T, OHR.slice(1, 6), 26, [-0.2, 0.3], (x) => (x < 162 ? 225 : 315), 0.7, 0.08, () => 1, ["#c49a66", "#e8cc9c"], { genau: 1, szene: 0 }) +
    FELL(T, [[157, -102.4], [166, -102.6], [166, -100.4], [157, -100.4]], 30, 245, 1, () => 0.6, FT, { szene: 0 });

  /* ---------- Gesicht ---------- */
  if (fein) {
    let dd = "";
    for (let r = 0; r < 5; r++) for (let i = 0; i < 5 - (r > 2 ? 1 : 0); i++) dd += "M" + z2(177.2 + i * 1.2 + r * 0.4, -90.6 + r * 1.1) + "h.01";
    s += `<path d="${dd}" stroke="#4a2e18" stroke-width=".22" stroke-linecap="round" opacity=".3"/>`;
  }
  /* Nasenspiegel: klein, im Profil flaches Dreieck, bündig mit der Schnauzenfront; Nasenloch als nach hinten geschwungene Linie */
  s += K(T, [[180.8, -95.2], [183, -94.6], [184.2, -92.9], [183.7, -92.1], [181.9, -92.5]], T.lg("nase", [[0, "#6a4a46"], [1, "#3a2826"]]), { rand: false, vol: false, innen:
    `<path d="M183.8-92.8q-.9-.1-1.4.5" stroke="#140a08" stroke-width=".26" fill="none"/>` + fleck(T, 182.2, -94.5, 0.8, 0.3, "#e8eef4", 0.7) });
  s += LI([[183.7, -92.1], [183.9, -89.4], [183.2, -86]], "#3a2416", 0.22, ` opacity=".5"`);
  /* kleiner unterer Eckzahn vor dem Säbel, halb von der Lippe verdeckt; Schneidezähne */
  s += F([[182.6, -83.4], [183.6, -83.5], [183.2, -82.5]], "#e2d6bc", ` stroke="#8a7a5a" stroke-width=".08"`);
  s += F([[181.6, -84.4], [183.2, -84.6], [183.3, -83.9], [181.8, -83.8]], "#e6dcc4");
  /* Säbel: Basis 3,2 cm, Vorderkante konvex (Bogenhöhe 9 %), Spitze leicht nach hinten, Zähnung an beiden Kanten (hinten deutlicher),
     Wurzel gelblich, scharfe Glanzkante vorn, Schattenseite hinten; wirft Schatten auf den Kinnflansch */
  const vk = [[182, -83.6], [183, -80], [183.2, -76], [182.6, -72], [181.2, -68.6]], hk = [[178.8, -83.6], [179, -79], [179, -75], [178.8, -71.4]];
  const saege = (L, f, n) => { const o = []; for (let i = 0; i <= n; i++) { const p = entlang(L, i / n); o.push([p[0] + (i % 2 ? f : 0), p[1]]); } return o; };
  const sab = fein ? [...saege(vk, 0.07, 26), [179.4, -66.2], ...saege(hk.slice().reverse(), -0.11, 24)] : [[182.4, -83.6], [183.6, -76], [181.6, -70], [179, -66.4], [178.6, -76], [178.6, -83.6]];
  const sd = fein ? "M" + sab.map(([x, y]) => z2(x, y)).join("L") + "Z" : glatt(sab);
  s += WEICH(T, FO([[177.6, -82], [180.2, -82], [180, -75.6], [177.8, -75.6]], S0, 0.35), 0.4);
  s += K(T, sd, T.lg("zahn", [[0, "#e4d6b4"], [0.35, "#f6efdc"], [1, "#c8b896"]], 0, 0, 1, 0), { rand: "#8a7a5a", randA: 0.6, rw: 0.08, vol: false, innen:
    `<rect x="177.6" y="-84" width="7" height="5" fill="${T.lg("zahnw", [[0, "#d9c9a0"], [1, "#d9c9a0", 0]])}"/>` +
    LI([[182.6, -81], [182.8, -77], [182.2, -73], [181, -70]], "#fffaf0", 0.45, ` opacity=".9"`) + LI([[179.4, -80], [179.5, -75], [179.3, -71]], "#7a6a4c", 0.7, ` opacity=".3"`) });
  /* Oberlippe fällt über die Zahnwurzel (dunkel gerandete Lippenfalte), kurze Lippenlinie, Mundwinkel unter dem Auge leicht nach oben */
  s += F([[177.8, -85], [181.8, -85.2], [183.4, -84.6], [182.6, -83.6], [180, -83.4], [178, -84]], T.lg("lippe", [[0, "#d8c4a4"], [0.6, "#c4a684"], [1, "#4a3020"]]));
  s += LI([[183, -84], [180.4, -83.4], [177.8, -83.8], [174.8, -84.4], [172.6, -85.2], [171.8, -86]], "#24140c", 0.3, ` opacity=".85"`);
  /* Auge: bernsteinfarben, Pupille 40 % der Iris, Oberlid-Schatten, Lidrand 2 px; Tränenlinie dünn vom inneren Winkel */
  s += AUGE2(T, 172, -95.4, 4.2, 2.6, { iris: "#c48a2a", iris2: "#e0b04c", winkel: 10, falten: 0, kraehen: 0, wimpern: 0 });
  if (fein) {
    let fa = "";
    for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2 + T.rnd() * 0.1, r0 = 0.5 + T.rnd() * 0.15, r1 = 1.2 + T.rnd() * 0.25; fa += "M" + z2(172.25 + Math.cos(a) * r0, -95.4 + Math.sin(a) * r0) + "L" + z2(172.25 + Math.cos(a) * r1, -95.4 + Math.sin(a) * r1); }
    s += `<g transform="rotate(10 172 -95.4)"><path d="${fa}" stroke="#6a3e12" stroke-width=".05" opacity=".35"/></g>`;
  }
  s += LI([[174, -94.4], [175.6, -92.4], [177, -90]], "#2a160a", 0.16, ` opacity=".7"`);
  /* Tasthaare: Schnurrhaare kürzer, Fächer 65°, verjüngt, einige nach unten über das Kinn; 3 kurze über dem Auge */
  const W0 = []; for (let i = 0; i < 14; i++) W0.push([177.8 + (i % 5) * 1.2, -89.6 + Math.floor(i / 5) * 1.2 + (i % 2) * 0.3]);
  s += TASTHAARE(T, W0, (i) => 150 + i * 5 + (T.rnd() - 0.5) * 8, 10, 0.18, "#f6f0e4", 0.72);
  s += TASTHAARE(T, [[170.8, -98], [171.8, -98.3], [172.8, -98.1]], (i) => 235 + i * 12, 2.6, 0.08, "#f6f0e4", 0.7);

  /* ---------- Pfoten: Zehenkerben, Fellbüschel, Krallenscheiden, Afterkralle innen am nahen Vorderbein ---------- */
  s += zehen([[138.2, -9.2], [141, -8], [143.4, -6]]) + zehen([[48.6, -7.4], [51, -6.2], [52.8, -4.2]]);
  if (fein) s += FELL(T, [[136, -2], [145, -2], [145, 0], [136, 0]], 14, 90, 0.8, () => 0.7, FT, { szene: 0 }) + FELL(T, [[46, -2], [53.6, -2], [53.6, 0], [46, 0]], 10, 90, 0.7, () => 0.7, FT, { szene: 0 });
  s += `<path d="M141.6-1.2q.8.3 1.3 1M144.2-2.6q.8.4 1 1.4M51.8-1.4q.7.4 1 1.2" stroke="#2a1a0e" stroke-width=".3" fill="none" opacity=".7"/>`;
  s += F([[120.4, -15], [119.6, -13.2], [118.4, -11.6], [117.6, -10.4], [118.2, -10.2], [119.4, -11.2], [120.6, -12.4]], T.lg("kralle", [[0, "#2a1e16"], [1, "#d8ccb4"]], 0, 0, 0, 1));

  return { svg: s, box: [4, -109, 185, 0], fuesse: [133, 124, 45, 52], kopf: [146, -111, 188, -62] };
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
  const TON = ["#26170c", "#311e10", "#3e2614", "#4e3019", "#603c20", "#744a27", "#8a5a30", "#a26c3a"];
  const FERN = ["#22170e", "#2c1e13", "#382618", "#45301f", "#523a26"];
  const SPITZ = [["#b8804a", 0.8], ["#cc9658", 0.75]];
  const wolle = T.lg("wolle", [[0, "#9a683e"], [0.25, "#7e5230"], [0.55, "#5e3c22"], [0.8, "#40281a"], [1, "#4a3220"]], 0, -162, 0, -60, UB);
  const MU = [["n_d", 30, 44, 50, 16, [["#22140a", 2, 0.45, 0.5], ["#3a2414", 2, 0.4, 0.45]]], ["n_h", 36, 34, 26, 12, [["#b07a44", 1, 0.35, 0.35]]]];
  let s = "";

  /* ---------- Form: Fettbuckel weich ab x≈125, Scheitel über dem Widerrist, flacher Sattel, runde Kruppe ---------- */
  const ruecken = [[16, -106], [22, -120], [40, -130], [76, -133], [110, -134], [130, -136], [160, -143], [188, -152], [208, -158.6], [224, -160.6], [242, -158], [258, -150], [274, -139], [288, -128]];
  const top = (x) => bei(ruecken, Math.max(16, Math.min(288, x)));
  const bauchY = (x) => (x > 262 ? -60 : x > 60 ? -62 - Math.max(0, 120 - x) * 0.12 : -78 - (60 - x) * 0.4);
  const t_ = (x, y) => (y - top(x)) / (bauchY(x) - top(x));
  const licht = (x, y) => {
    let v = zyl(t_(x, y)) + (x < 120 ? 0.04 : 0);
    if (x > 262 && y > -96) v -= 0.18;
    return Math.max(0, Math.min(1, v));
  };
  const fluss = (x, y) => { const t = t_(x, y); return x > 262 ? 100 : 94 + 24 * Math.max(0, 1 - t / 0.5); };
  const lang = (x, y) => { const t = t_(x, y); const zone = x > 180 ? 1 : x > 140 ? 0.6 + (x - 140) / 100 : 0.6; return (12 + 22 * Math.min(1, t / 0.7)) * zone + 4; };

  /* ---------- Beine: Ellbogenmasse hinten, Handgelenk-Verdickung (−40) mit Einschnürung darunter; Knie vorn auf Bauchhöhe,
     Fersenhöcker hinten (−45, 3–4 cm vorstehend); kurzes dichtes Fell bis zur Fessel ---------- */
  const vorderbein = (cx) => glied([[cx + 4, -124, 26, 22], [cx - 2, -84, 26, 20], [cx - 1, -70, 28, 19], [cx, -56, 20, 19], [cx + 1, -42, 20, 20], [cx + 1, -32, 16, 16], [cx + 1, -18, 16, 16]],
    [[cx + 17, -10], [cx + 18, -4], [cx + 17, 0, 1], [cx - 15, 0, 1], [cx - 16, -4], [cx - 16, -10]]);
  const hinterbein = (cx) => glied([[cx - 6, -124, 32, 24], [cx, -96, 30, 26], [cx + 4, -66, 22, 27], [cx + 2, -56, 18, 20], [cx, -45, 22, 16], [cx + 1, -34, 16, 16], [cx + 1, -18, 16, 16]],
    [[cx + 17, -10], [cx + 18, -4], [cx + 17, 0, 1], [cx - 15, 0, 1], [cx - 16, -4], [cx - 16, -10]]);
  const beinLicht = (P, ferne) => (x, y) => {
    let v = zylX(quer_u(P, x, y)) * (ferne ? 0.72 : 1);
    if (y < -90) v -= 0.4 * Math.min(1, (-90 - y) / 24);          // Verdeckung unter dem Fellsaum
    return Math.max(0, Math.min(1, v));
  };
  const fuss = (cx, ferne) => {
    /* Fuß im Beinton (−15 %), keine Glocke; Hufe im Profil: III vorn und 1,3× größer, IV seitlich weiter hinten, II als Sichel */
    let f = K(T, [[cx - 16, 0, 1], [cx - 16.5, -8], [cx - 16, -20], [cx + 16, -20], [cx + 17.5, -8], [cx + 17, 0, 1]], ferne ? "#1e140c" : "#2c1c10", { rand: false, vol: false, innen:
      (fein && !ferne ? `<path d="M${zf(cx - 15, -14)}q8 1.5 14 .4M${zf(cx - 3, -10)}q9 1.6 18-.4M${zf(cx - 15, -7)}q10 1.4 20 .2" stroke="#000" stroke-width=".6" opacity=".25" fill="none"/>` : "") });
    if (fein || !ferne) {
      const hg = ferne ? "#140e0a" : T.lg("huf", [[0, "#3a2c20"], [0.6, "#2a2018"], [1, "#16100c"]]);
      f += F([[cx + 5, 0, 1], [cx + 6, -6], [cx + 11.5, -9], [cx + 17, -6.6], [cx + 19, 0, 1]], hg) + F([[cx - 5, 0, 1], [cx - 4.4, -4.6], [cx - 1, -6.4], [cx + 3, -4.6], [cx + 3.6, 0, 1]], hg) +
        F([[cx - 11, 0, 1], [cx - 10, -3], [cx - 8, -3.6], [cx - 8.4, 0, 1]], hg);
      if (fein && !ferne) f += `<path d="M${zf(cx + 7.6, -6.8)}q3.6-2 7.4-.6" stroke="#c8b8a0" stroke-width=".7" opacity=".4" fill="none"/>`;
    }
    return f;
  };
  const bein = (P, cx, ferne) => {
    let b = K(T, P, ferne ? "#2c1d12" : T.lg("beinn", [[0, "#4e301a"], [0.6, "#3e2616"], [1, "#30200f"]], 0, -124, 0, 0, UB), { rand: false, vol: false, innen:
      fleck(T, cx, -96, 30, 24, S0, 0.5) }) + fuss(cx, ferne);
    b += LOCKEN(T, [[cx - 24, -122], [cx + 24, -122], [cx + 19, -18], [cx - 19, -18]], ferne ? 24 : 50, 91, (x, y) => 6 + (y + 120) * 0.025, 1.6, beinLicht(P, ferne), ferne ? FERN : TON,
      { streuung: 9, szene: ferne ? 0 : 0.1, szeneB: 2.2, haare: ferne ? 0 : 1, hb: 0.35 });
    b += LOCKENLINIE(T, [[cx - 18, -26], [cx + 19, -26]], ferne ? 10 : 20, [-4, 0], 92, (x) => 9 + ((x * 3.7) % 1) * 8, 2.4, beinLicht(P, ferne), ferne ? FERN : TON, { streuung: 14, szene: 0.3 });
    return `<g filter="${T.volumen(ferne ? "beinf" : "beinn", { weich: 7, tiefe: 5 })}">${b}</g>`;
  };
  const VF = vorderbein(214), HF = hinterbein(92), VN = vorderbein(234), HN = hinterbein(68);
  s += bein(VF, 214, true) + bein(HF, 92, true);

  /* Schwanz: eng am Gesäß, 0,47 m, behaart, Endquaste */
  s += K(T, [[24, -118], [17, -112], [13, -100], [12, -86], [13, -78], [17, -78], [18, -88], [20, -102], [26, -110]], "#3a2414", { rand: false, vol: false });
  s += LOCKEN(T, [[12, -116], [22, -116], [18, -84], [12, -84]], 20, 96, 8, 2, () => 0.35, TON, { streuung: 8, szene: 0.2 });
  s += LOCKEN(T, [[11, -84], [18, -84], [18, -78], [11, -78]], 14, 95, 15, 2, () => 0.28, TON, { streuung: 12, szene: 0.4, haare: 2, hb: 0.4 });

  s += bein(HN, 68, false) + bein(VN, 234, false);

  /* ---------- Rumpf, Hals, Kopf ---------- */
  const kopfOben = [[288, -128], [298, -124], [306, -116], [318, -104], [332, -92], [344, -84], [352, -77]];
  /* Schnauze: breit, eckig, fast senkrecht, aus einem Stück; Oberlippe als flacher Wulst; Unterlippe zurückgesetzt, flaches Kinn */
  const schnauze = [[358, -71], [360.6, -64], [361, -56], [361.4, -50.6], [361, -47], [359.4, -45.6], [356, -45.2], [357.6, -44], [357, -41.6], [353, -40.2], [344, -39.8], [334, -40.4],
    [320, -42.6], [306, -47], [298, -52], [290, -58], [280, -62]];
  const koerper = [...ruecken, ...kopfOben, ...schnauze, [266, -61], [240, -60], [200, -62], [160, -63], [120, -64], [84, -68], [56, -78], [34, -90], [20, -98]];
  const dK = glatt(koerper);
  let k = K(T, dK, wolle, { rand: false, vol: false, innen:
    WEICH(T,
      /* Tonne: Glanz oben, Bauch dunkel; Schulter- und Keulenmasse als runde Helligkeitsformen; Lichtzone auf Nasenrücken und Stirn */
      FO([[150, -140], [190, -152], [224, -160], [256, -150], [240, -140], [200, -136], [160, -132]], "#d8a46c", 0.3) +
      FO([[220, -134], [252, -138], [266, -116], [254, -96], [228, -100], [216, -118]], "#c89660", 0.2) +
      FO([[40, -124], [80, -128], [96, -110], [84, -90], [52, -92], [36, -108]], "#c89660", 0.2) +
      FO([[50, -84], [120, -76], [200, -74], [262, -78], [262, -64], [200, -62], [120, -64], [56, -72]], S0, 0.35) +
      FO([[300, -118], [318, -104], [332, -92], [328, -88], [312, -100], [298, -112]], "#d8a46c", 0.3) +
      /* Schlagschatten der Hörner auf Stirn und Nasenrücken; Jochbogen hell mit Schattenrinne; Kieferwinkel dunkel */
      FO([[318, -100], [326, -96], [324, -90], [316, -94]], S0, 0.3) + FO([[336, -84], [348, -80], [346, -72], [334, -76]], S0, 0.35) +
      FO([[292, -74], [312, -78], [318, -76], [296, -71]], "#c89660", 0.35) + FO([[292, -71], [316, -74], [314, -71], [294, -68]], S0, 0.3) +
      FO([[288, -60], [300, -62], [304, -52], [292, -52]], S0, 0.35), 4) +
    /* nackte Schnauzenhaut: graubraun, mit Runzeln */
    WEICH(T, FO([[346, -58], [354, -66], [361, -63], [361.4, -48], [356, -44], [346, -46]], "#4a3a32", 0.7), 2) });
  k += HAARZONEN(T, dK, [
    [[[0, -175], [262, -175], [262, -110], [0, -110]], 112, 0.85],
    [[[0, -110], [262, -110], [262, -50], [0, -50]], 95, 0.85],
    [[[262, -175], [340, -175], [340, -40], [262, -40]], 200, 0.45]], MU);
  if (fein) k += `<path d="M343-57q8-2 16-1M342-53q9-1 18 0M346-60q6-2 12-1" stroke="#1a120c" stroke-width=".5" opacity=".35" fill="none"/>`;
  /* Fell in Strähnen: Locken mit Einzelhaaren, Längen nach Zone; Töne gleiten über ~33 cm (kein harter Tonwechsel) */
  const rumpfZone = [[22, -118], [44, -129], [120, -133], [188, -150], [224, -159], [258, -149], [280, -132], [292, -114], [296, -84], [288, -60], [240, -64],
    [160, -65], [100, -66], [56, -80], [24, -100]];
  k += LOCKEN(T, rumpfZone, 125, fluss, lang, 4.8, (x, y) => licht(x, y) * 0.88, TON, { streuung: 8, kruemmung: 0.12, szene: 0.14, szeneB: 2.2, jitter: 1, haare: 2, hb: 0.5 });
  k += LOCKEN(T, rumpfZone, 70, fluss, (x, y) => lang(x, y) * 0.7, 3.2, licht, TON, { streuung: 8, kruemmung: 0.14, szene: 0.08, szeneB: 2.2, jitter: 1 });
  if (fein) k += LOCKEN(T, [[26, -122], [44, -131], [120, -135], [188, -152], [224, -161], [256, -152], [240, -144], [180, -136], [100, -126], [40, -114]],
    34, fluss, (x, y) => lang(x, y) * 0.8, 1.1, () => 1, SPITZ, { streuung: 6, jitter: 0.4 });
  /* Rückenkontur alle 4–7 cm durch Haarspitzen gebrochen */
  k += LOCKENLINIE(T, ruecken.slice(0, 13), 50, [-3, 6], (x, y) => fluss(x, y + 6) + 6, (x) => (x > 180 && x < 270 ? 16 : 11), 2.4, (x, y) => licht(x, y + 6) + 0.06, TON, { streuung: 8, szene: 0.15, szeneB: 1.6, haare: 1, hb: 0.4 });
  /* Bauch-, Brust- und Kehlbehang: Längen ±40 % */
  const rz = [[60, -84], [120, -72], [200, -70], [262, -72], [292, -60], [300, -50], [270, -58], [200, -60], [120, -62], [60, -76]];
  k += LOCKEN(T, rz, 90, (x) => 93 + (x > 262 ? -6 : 0), (x) => (x > 250 ? 32 : 24) * (0.6 + 0.8 * ((x * 7.3) % 1)), 3.4, (x, y) => 0.25 + 0.12 * Math.max(0, (y + 50) / 30), TON,
    { streuung: 7, kruemmung: 0.16, szene: 0.1, szeneB: 2.4, jitter: 0.8, haare: 1, hb: 0.45 });

  /* ---------- Kopf: kurzes Haar von der Nase zum Ohr; Augenzone frei von langen Strähnen ---------- */
  const auge = [304, -82];
  const kopfZone = [[288, -126], [298, -122], [318, -102], [332, -90], [344, -82], [354, -76], [358, -70], [352, -66], [346, -58], [342, -50], [330, -46], [314, -44], [300, -46], [290, -60], [286, -100]];
  const kopfLicht = (x, y) => Math.max(0, Math.min(1, zyl(Math.max(0, (y + 126 - (x - 288) * 0.6) / 70)) + 0.06));
  k += FELL(T, kopfZone, 220, (x, y) => (Math.hypot(x - auge[0], y - auge[1]) < 9 ? Math.atan2(y - auge[1], x - auge[0]) * 180 / Math.PI : 200 + (y + 90) * 0.3),
    (x, y) => (Math.hypot(x - auge[0], y - auge[1]) < 9 ? 1.6 : 4.5), kopfLicht, [["#2a190d", 0.7, 0.6], ["#3e2614", 0.7, 0.6], ["#5a3820", 0.65, 0.55], ["#7a4e2a", 0.6, 0.5], ["#a26c3a", 0.55, 0.45]], { szene: 0.12 });
  /* Querfalten am Übergang zum Hals, Mundwinkelfalte */
  k += `<path d="M294-62q4 6 4 14M288-64q4 5 4 12M282-66q3 5 3 10" stroke="#000" stroke-width="1" opacity=".3" fill="none"/>`;
  s += `<g filter="${T.volumen("rumpf", { weich: 22, tiefe: 5, umgebung: 0.3 })}">${k}</g>`;

  /* ---------- Ohr: Trichter, 12° nach hinten gekippt, Muschel innen dunkel → heller zum Rand, weiches Randhaar fällt nach hinten-unten ---------- */
  const OHR = [[280, -122], [278, -129], [279, -138], [283, -142], [288.4, -135], [291.6, -122]].map(([x, y]) => { const a = -12 * Math.PI / 180, dx = x - 286, dy = y + 121; return [286 + dx * Math.cos(a) - dy * Math.sin(a), -121 + dx * Math.sin(a) + dy * Math.cos(a)]; });
  s += `<g filter="${T.volumen("ohr", { weich: 2, tiefe: 4 })}">` + K(T, OHR, T.lg("ohr", [[0, "#704626"], [1, "#46301c"]]), { rand: false, vol: false, innen:
    FO([[OHR[0][0] + 3, OHR[0][1] - 2], [OHR[1][0] + 3, OHR[1][1]], [OHR[3][0] + 1, OHR[3][1] + 4], [OHR[4][0] - 2, OHR[4][1] + 2], [OHR[5][0] - 3, OHR[5][1] - 1]], T.lg("muschel", [[0, "#3a2414"], [1, "#140a04"]], 0, 1, 0, 0), 0.9) +
    FELL(T, [[OHR[1][0] + 3, OHR[1][1]], [OHR[3][0] + 1, OHR[3][1] + 4], [OHR[4][0] - 2, OHR[4][1] + 2], [OHR[5][0] - 3, OHR[5][1] - 1]], 14, 280, 3, () => 1, [["#c8a07a", 0.3, 0.3]], { szene: 0 }) }) + "</g>";
  s += LOCKENLINIE(T, [OHR[1], OHR[2], OHR[3], OHR[4]], 22, [0, 1.5], (x, y) => 140 + (y + 140) * -2, (x, y) => 7 + T.rnd() * 6, 1.2, () => 0.55, TON, { streuung: 14, kruemmung: 0.3, szene: 0.2, haare: 1, hb: 0.3 });
  s += LOCKEN(T, [[OHR[3][0] - 2, OHR[3][1] - 1], [OHR[3][0] + 2, OHR[3][1] - 1], [OHR[3][0] + 1, OHR[3][1] + 2]], 3, 165, 9, 1.4, () => 0.6, TON, { streuung: 20, kruemmung: 0.3, szene: 0, haare: 1, hb: 0.3 });

  /* ---------- Maul: Oberlippe mit heller Kante oben und Schattenkerbe darunter, gerade Maulspalte bis 25 % der Kopflänge, Mundwinkelfalte ---------- */
  s += WEICH(T, FO([[346, -52], [358, -52], [361, -50], [358, -49.4], [346, -50]], "#8a7468", 0.3), 0.5) + FELL(T, [[344, -56], [361, -56], [361, -50], [344, -50]], 40, 175, 1.6, () => 0.4, [["#2a1c14", 0.5, 0.3], ["#6a5444", 0.4, 0.3]], { szene: 0 });
  s += LI([[360, -45.6], [350, -45], [340, -45.6], [334, -47]], "#0e0805", 0.9, ` opacity=".8"`) + LI([[334, -47], [331, -49.6], [331.4, -53]], "#0e0805", 0.7, ` opacity=".45"`);
  s += LI([[359, -44.4], [350, -44.2], [342, -44.6]], S0, 1.4, ` opacity=".3"`);
  /* Nasenloch: schräger Schlitz mit Wulst und Schattenkerbe, vor dem Horn auf halber Schnauzenhöhe */
  s += F([[350, -60.6], [354.6, -63.8], [357.2, -63.2], [352.4, -59.6]], "#0a0604") + LI([[348.6, -59.4], [353, -57.8], [357.4, -60.6]], "#6a5446", 1, ` opacity=".5"`) +
    LI([[349.4, -61.6], [354, -65], [358, -64.4]], S0, 0.8, ` opacity=".35"`);

  /* ---------- Auge: dunkelbraun, Pupille quer-oval, schweres Oberlid, kurze grobe Wimpern, unregelmäßige Falten ---------- */
  s += AUGE2(T, auge[0], auge[1], 4.6, 2.4, { iris: "#2e1a0c", iris2: "#4a2c14", pupille: "quer", winkel: 18, falten: 4, kraehen: 1, oberlid: 0.3, lidfarbe: "#3a2618",
    wimpern: 10, wl: 0.6, wkrumm: 0.1, wwinkel: 205, hautHell: "#a07858" });

  /* ---------- Hörner: Keratin, Längsfasern, Querwellen im unteren Drittel, Farbstufen; Glanzkante nur am Rücken; Schleiffacette vorn ---------- */
  const hornG = (n) => T.lg(n, [[0, "#2a2018"], [0.45, "#5e5246"], [1, "#a9a093"]], 0, 1, 0.8, 0);
  const horn = (h, w0, w1, n, name) => {
    let f = "";
    if (fein) {
      const fa = ["", "", ""];
      for (let i = 0; i < n; i++) {
        const q = -0.88 + 1.76 * i / (n - 1) + (T.rnd() - 0.5) * 0.04, L = quer(h, w0, w1, q, 0.8), a = L[Math.floor(T.rnd() * 2)], m = L[Math.floor(L.length / 2)], e = L[L.length - 1 - (i % 3 === 0 ? 1 : 0)];
        fa[Math.floor(T.rnd() * 3)] += "M" + zf(...a) + "Q" + zf(2 * m[0] - (a[0] + e[0]) / 2, 2 * m[1] - (a[1] + e[1]) / 2, ...e);
      }
      f += `<path d="${fa[0]}" stroke="#120c08" stroke-width=".35" opacity=".14" fill="none"/><path d="${fa[1]}" stroke="#120c08" stroke-width=".3" opacity=".08" fill="none"/>` +
        `<path d="${fa[2]}" stroke="#b0a292" stroke-width=".35" opacity=".12" fill="none"/>`;
      let w = "";
      for (let i = 1; i < 7; i++) { const t = i * 0.045, p = entlang(h, t), q = entlang(h, t + 0.01), dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy), ww = w0 / 2 * (1 - t * 0.6);
        w += "M" + zf(p[0] - dy / l * ww, p[1] + dx / l * ww) + "q" + zf(dy / l * ww + dx / l * 1.4, -dx / l * ww + dy / l * 1.4, 2 * dy / l * ww, -2 * dx / l * ww); }
      f += `<path d="${w}" stroke="#000" stroke-width=".6" opacity=".08" fill="none"/>`;
    }
    const L = h.length;
    f += LI(quer(h, w0, w1, 0.78, 0.8).slice(0, Math.ceil(L * 0.6)), "#8e8274", w0 * 0.1, ` opacity=".7"`) +
      (fein ? LI(quer(h, w0, w1, 0.76, 0.8).slice(0, Math.ceil(L * 0.6)), "#c8bcac", 0.35, ` opacity=".35"`) : "") +
      LI(quer(h, w0, w1, -0.74, 0.8).slice(1, 3), "#f2ebe0", 1, ` opacity=".5"`) + (L > 5 ? LI(quer(h, w0, w1, -0.74, 0.8).slice(4, L - 1), "#f2ebe0", 1, ` opacity=".5"`) : "");
    return K(T, rohr(h, w0, w1, true, 0.8), hornG(name), { rand: false, vol: false, innen: f });
  };
  const h2 = [[311, -98], [313, -107], [315.4, -117], [315.4, -128]];
  const h1 = [[345, -83], [352, -93], [362, -104], [374, -117], [387, -132], [399, -148], [409, -164]];
  s += horn(h2, 18, 3.5, 12, "horn2") + horn(h1, 26, 4, 30, "horn1");
  /* Haarkranz aus kurzen, verfilzten Haaren umschließt die Hornbasen */
  s += LOCKENLINIE(T, [[334, -90], [340, -92], [348, -84], [354, -76], [356, -72]], 40, [-1, 3], (x) => (x < 342 ? 120 : 70), (x) => 4 + ((x * 3.3) % 1) * 4, 1.2, () => 0.42, TON, { streuung: 30, kruemmung: 0.3, szene: 0.2, haare: 1, hb: 0.3 });
  s += LOCKENLINIE(T, [[302, -95], [308, -100], [316, -101], [322, -98]], 22, [-1, 2], 140, (x) => 3 + ((x * 3.3) % 1) * 3, 1, () => 0.5, TON, { streuung: 30, kruemmung: 0.3, szene: 0.2 });

  return { svg: s, box: [7, -168, 417, 0], fuesse: [235, 215, 69, 93], kopf: [270, -170, 418, -30] };
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
  const fein = T.fein !== false;
  GEN = fein ? 10 : 1;
  SZ = !fein; SZMIN = 0.3; FLMIN = 0.25;
  const S0 = "#000", HL = "#fff4e0", DUNKEL = "#4a3524", ELF = "#ddcfa8";
  /* Fell: Kachelmuster (dunkle + helle Haare) je Wuchsrichtung, Strähnen mit Einzelhaaren, Töne dunkel → hell */
  const MD = [["r_d", 9, 12, 60, 3.2, [["#3a2816", 1, 0.2, 0.34], ["#5a4228", 1, 0.18, 0.3]]]];
  const MH = [["r_h", 11, 11, 30, 3, [["#f2e0bc", 1, 0.17, 0.34]]]];
  const MDk = [[...MD[0].slice(0, 6), 0.45]], MHk = [[...MH[0].slice(0, 6), 0.45]];
  const TON = ["#2a1c10", "#3e2c1c", "#56402a", "#6e5638", "#8a6e4a", "#a8885e", "#c4a67a", "#dcc49c"];
  const TONB = ["#1c120a", "#281a10", "#342416", "#42301e", "#523c26"];
  let s = "";

  /* ---------- Kopf: eigenes System (x zur Schnauze, y nach unten), Genick bei (PX, PY), um TH gedreht, Maßstab KS.
     Länge Hinterhaupt–Nase ≈ 57 cm (≈ 28 % der Widerristhöhe), Höhe am Kieferwinkel ≈ 23,5 cm ---------- */
  const PX = 283, PY = -262, TH = 35, KS = 1.08, ct = Math.cos(TH * Math.PI / 180) * KS, st = Math.sin(TH * Math.PI / 180) * KS;
  const kw = ([x, y, h]) => [PX + x * ct - y * st, PY + x * st + y * ct, h];
  const KG = `<g transform="translate(${PX} ${PY}) rotate(${TH}) scale(${KS})">`;
  /* Profil: gerader Nasenrücken, flacher Nasenspiegel, stumpfes Maul mit überstehender Oberlippe, kleines rundes Kinn,
     leicht konvexe Unterkieferlinie, gerundeter Ganaschenwinkel, weiche Kehle */
  const kopfL = [[-6, 5], [-2, -0.6], [4, -2.8], [11, -3.6], [18, -3.2], [26, -1.8], [36, 0.8], [46, 3.6], [52, 5.2], [55.8, 6.4], [58.2, 8.4], [59.4, 11.4],
    [59.8, 14.6], [59.2, 17.6], [58.2, 19.4], [57, 20.2, 1], [56.2, 20.9], [55, 22], [53, 22.8], [50.4, 23], [46, 22.8], [40, 23], [32, 23.4], [24, 23],
    [17.6, 21.8], [12.4, 19.6], [8, 16.4], [3.6, 12.4], [-2, 9.4]];
  const kopf = kopfL.map(kw);

  /* ---------- Rumpf mit Hals: Buckel = Kontur selbst (Kuppel über dem Widerrist, hinten steiler, vorn weich in den Hals);
     Hüfthöcker als Buckel ≈ 25 % vor dem Schwanz; Kruppe rund; Kehle → Brust → Buggelenk (vorgewölbt, y ≈ −134) ---------- */
  const ruecken = [[26, -190], [34, -196], [46, -199], [57, -200.6], [65, -201.6], [73, -200.4], [86, -197.8], [104, -197.4], [126, -198.2], [146, -199.4],
    [162, -201.4], [176, -205.6], [188, -213], [198, -221], [207, -226], [216, -227.8], [226, -227.2], [236, -226.4], [247, -229.6], [258, -237], [270, -248], [279, -257]];
  const nacken = [kw([-1, 2]), kw([2, 10]), kw([6, 15.6])];
  const hals = [[289, -234], [294.6, -216], [296, -198], [293.6, -181], [288.6, -164], [282, -150], [276, -139], [271, -132], [265.6, -126.6], [259, -123.4]];
  const bauch = [[250, -121], [240, -122.4], [232, -122], [224, -120.4], [210, -118.8], [190, -118], [170, -118.8], [158, -119.6], [153, -118.2], [148, -118.6],
    [143, -120.4], [128, -122.2], [114, -123.6], [104, -125], [80, -128], [52, -132], [33, -134], [25, -147], [20, -159], [17.4, -170], [18.6, -180], [21.6, -186.6]];
  const rumpf = [...ruecken, ...nacken, ...hals, ...bauch];

  /* ---------- Beine (cm). Vorne: Buggelenk, Ellbogenhöcker hinten auf Bauchhöhe, Vorderfußwurzel (−64), Röhrbein ≈ 9 cm mit
     Beugesehne, Fesselgelenk (−22), schräge Fessel, Spalthuf (Vorderwand ≈ 52°). Hinten: Knie (≈ 100, −110), Unterschenkel
     schräg nach hinten, Fersenhöcker (47, −85) 8 cm hinter der Mittelfußlinie, konkave Achillessehne, Mittelfuß 5° nach vorn ---------- */
  const vorderbein = (dx) => [[262, -150], [258.4, -128], [257, -114], [256, -100], [255.2, -86], [255.6, -76], [257, -70], [257.4, -64], [256.2, -58], [255, -50],
    [254.8, -36], [255.4, -27], [257, -22], [259.4, -16.6], [261.6, -12], [262.6, -9.6], [269.4, -0.6], [268.8, 0, 1], [254.6, 0, 1], [253.4, -2.8], [252.6, -6.6],
    [250, -11], [247, -16.4], [245.6, -20.4], [245.8, -27], [246.2, -36], [246, -50], [245.4, -57], [243.8, -62], [244, -67], [243.4, -74], [242, -86], [240, -98],
    [236.6, -107], [232.4, -112.4], [231, -117.4], [233, -124], [238, -140], [244, -156]].map(([x, y, h]) => [x + dx, y, h]);
  const hinterbein = (dx) => [[118, -186], [112, -164], [107, -142], [103.6, -128], [102, -120], [101.6, -116], [100.6, -108], [97, -102], [90, -97], [82, -92.6], [74, -88.6], [68.8, -85.4], [66.6, -81], [66.2, -74],
    [67.6, -60], [69, -44], [70.6, -30], [71.4, -25], [73, -20.6], [75.6, -15.6], [78, -11], [78.8, -9.6], [85.4, -0.6], [84.8, 0, 1], [71.4, 0, 1], [70.2, -2.8],
    [69.4, -6.6], [66.8, -11], [63.8, -16.6], [62.4, -20.6], [61.8, -27], [60.6, -40], [58.6, -58], [57, -70], [55.6, -76], [52.6, -79.8], [49.4, -81.8],
    [47.2, -84.6], [46.6, -89], [45.6, -96], [43.4, -105], [40.2, -114.6], [36.4, -124], [31, -135], [25, -147], [20, -159], [17.4, -170], [18.6, -180], [26, -190], [60, -194]].map(([x, y, h]) => [x + dx, y, h]);
  const VN = vorderbein(0), HN = hinterbein(0), VF = vorderbein(-17), HF = hinterbein(15);

  /* Spalthuf: Vorderwand mit Hornstreifen und Glanz, Tragrand heller, V-Spalt mit Eigenschatten, Ballen */
  const huf = (P, ferne) => {
    const i0 = P.findIndex((p) => p[2] === 1) - 2, k = P[i0], t = P[i0 + 1], b = P[i0 + 3], ba = P[i0 + 5];
    const hp = [[k[0] - 0.4, k[1] + 0.2], [t[0] + 0.3, t[1] + 0.2], [t[0] - 0.4, 0, 1], [b[0], 0, 1], [b[0] - 0.8, -2.6], [ba[0] - 0.2, ba[1] + 0.4], [k[0] - 6, k[1] + 1.2]];
    let h = F(hp, ferne ? "#17110c" : T.lg("hufw", [[0, "#5e4e3e"], [0.35, "#3e3228"], [1, "#1a140e"]], 0, 0, 1, 0.3));
    if (!fein) return h;
    const sx = (t[0] + b[0]) / 2 + 1.6;
    h += `<path d="M${zf(sx + 0.6, -8.4)}q-.2 4-1.6 8.2" stroke="#060403" stroke-width="1" opacity="${ferne ? 0.5 : 0.8}" fill="none"/>`;
    if (!ferne) {
      let d = "";
      for (let i = 0; i < 6; i++) { const u = i / 5, x0 = k[0] - 5.2 + u * 4.6, y0 = k[1] + 1.2 - u * 0.8; d += "M" + zf(x0, y0) + "l" + zf(2.4 + u * 4, 8.6 - u * 0.6); }
      h += `<path d="${d}" stroke="#a89a88" stroke-width=".22" opacity=".3"/>` +
        `<path d="M${zf(k[0] + 0.6, k[1] + 1.2)}l${zf(t[0] - k[0] - 1.6, -t[1] + k[1] - 2.2)}" stroke="#e8dccb" stroke-width=".9" opacity=".42" stroke-linecap="round"/>` +
        `<path d="M${zf(b[0] + 0.6, -0.4)}H${zf(t[0] - 0.8)}" stroke="#9a8a74" stroke-width=".7" opacity=".6"/>` + fleck(T, sx - 1, -5, 2.4, 4, S0, 0.4);
    }
    return h;
  };
  /* Afterklauen: kleine stumpfe Hornkegel (≈ 30 % der Huflänge) nach hinten-unten, halb im Haarbüschel */
  const afterklaue = (P, i, ferne, tone) => {
    const p = P[i];
    let a = F([[p[0] + 1.2, p[1] - 1.4], [p[0] - 2.2, p[1] + 1.4], [p[0] - 3, p[1] + 3.4, 1], [p[0] - 0.6, p[1] + 3], [p[0] + 1.4, p[1] + 1.2]], ferne ? "#140e0a" : "#2a2018");
    if (fein && !ferne) a += `<path d="M${zf(p[0] - 1.6, p[1] + 1.4)}l-.8 1.4" stroke="#b0a090" stroke-width=".4" opacity=".5"/>`;
    return a + LOCKEN(T, [[p[0] - 1, p[1] - 3], [p[0] + 2, p[1] - 3], [p[0] + 1, p[1] + 0.6], [p[0] - 1.6, p[1] + 0.6]], ferne ? 4 : 8, 116, 3, 0.7, () => 0.25, tone, { streuung: 18, szene: 0 });
  };
  /* Bein als eigener Körperteil: Fellton, Zylinderlicht (Kante zum Licht hell, Kernschatten hinten), Unterlauf dunkler, Muster */
  const beinG = (n, ferne, vorne) => T.lg(n, ferne ? [[0, "#5a4430"], [0.5, "#4a3826"], [1, "#2c2016"]] : vorne ? [[0, "#5a4430"], [0.2, "#56412e"], [0.42, "#604a34"], [0.7, "#4a3a2a"], [1, "#2c2219"]]
    : [[0, "#8a6a44"], [0.2, "#6e5438"], [0.33, "#5a4430"], [0.47, "#624c36"], [0.7, "#4a3a2a"], [1, "#2c2219"]], 0, vorne || ferne ? -150 : -190, 0, 0, UB);
  /* Maske: oberes Ende des nahen Beins läuft weich in den Rumpf aus (keine Naht) */
  const maske = (n, y0, y1) => { if (!T._mk) T._mk = {}; const id = T.id("mk" + n); if (!T._mk[id]) { T._mk[id] = 1;
    T.def(`<mask id="${id}"><rect x="-50" y="-260" width="420" height="270" fill="${T.lg("mg" + n, [[0, "#fff", 0], [1, "#fff"]], 0, y0, 0, y1, UB)}"/></mask>`); } return `url(#${id})`; };
  const beinLicht = (P, y0, y1, k) => FO(streifen(P, y0, y1, 0.06, 0.3, 6), HL, 0.26 * k) + FO(streifen(P, y0, y1, 0.66, 0.94, 6), S0, 0.3 * k);
  const bein = (P, name, vorne, ferne, extra) => {
    const dP = glatt(P);
    const zonen = [[[[P[0][0] - 90, -200], [P[0][0] + 60, -200], [P[0][0] + 60, 2], [P[0][0] - 90, 2]], vorne ? 92 : 98, 0.9]];
    let b = K(T, dP, beinG("bg" + (ferne ? "f" : vorne ? "v" : "h"), ferne, vorne), { rand: false, vol: false, innen:
      (ferne ? `<rect x="${P[0][0] - 90}" y="-200" width="160" height="202" fill="#000" opacity=".18"/>` : "") +
      WEICH(T, beinLicht(P, -118, -12, ferne ? 0.7 : 1), 0.9) + HAARZONEN(T, null, zonen, MDk) + (ferne ? "" : HAARZONEN(T, null, zonen.map(([p, w]) => [p, w, 0.5]), MHk)) + (extra || "") });
    const i0 = P.findIndex((p) => p[2] === 1) - 2;
    b += huf(P, ferne) + afterklaue(P, i0 + 7, ferne, ferne ? TONB : TON.slice(0, 5));
    /* Haarsaum an der Hinterkante (Kontur nicht glatt) */
    if (!ferne) b += LOCKENLINIE(T, P.slice(i0 + 9, P.length - (vorne ? 3 : 7)), 20, [-0.4, 0.4], vorne ? 112 : 118, 1.4, 0.45, () => 0.3, TON.slice(0, 5), { streuung: 14, szene: 0 });
    const g = `<g filter="${T.volumen(name, { weich: 2.6, tiefe: 5, umgebung: 0.32 })}">${b}</g>`;
    return ferne ? g : `<g mask="${vorne ? maske("v", -150, -130) : maske("h", -170, -148)}">${g}</g>`;
  };

  /* ---------- Geweih: Rose (Perlring), runde Stange, Schaufel wie eine erhobene Hand; Enden ungleich lang (16–52 cm), leicht
     gebogen, nach hinten fächernd, Spitzen poliert (Elfenbein); kurze Enden am Hinterrand ---------- */
  const ENDEN = [[0.0, -78, 22, 12], [0.15, -92, 31, 13], [0.3, -104, 21, 12.4], [0.46, -116, 35, 14], [0.62, -131, 26, 13], [0.77, -148, 20, 12],
    [0.9, -165, 14, 10.4], [1, -184, 11, 9.6]];
  const RAND = [[0, -40], [-8, -56], [-20, -68], [-34, -76], [-50, -79], [-66, -77], [-80, -71], [-92, -62], [-102, -52]];
  const UNTEN = [[-102, -52], [-96, -42], [-80, -34], [-60, -28], [-40, -24], [-24, -20], [-12, -14], [-6, -6], [-4.2, 0]];
  const VY = 0.78;
  const geweih = (bx, by, sk) => {
    const P = [[bx + 4 * sk, by], [bx + 4.6 * sk, by - 12 * sk], [bx + 3.2 * sk, by - 25 * sk]], spitzen = [], achsen = [];
    let Lr = 0; for (let i = 1; i < RAND.length; i++) Lr += Math.hypot(RAND[i][0] - RAND[i - 1][0], RAND[i][1] - RAND[i - 1][1]);
    const rp = (t) => { const p = entlang(RAND, Math.max(0, Math.min(1, t))); return [bx + p[0] * sk, by + p[1] * sk]; };
    for (const [t, a, L, bw] of ENDEN) {
      const hw = bw / 2 / Lr, c = Math.cos(a * Math.PI / 180), s2 = Math.sin(a * Math.PI / 180), B = rp(t), n = [-s2, c];
      const ax = [], k = L * 0.1;
      for (const u of [0, 0.5, 0.86, 0.97]) ax.push([B[0] + (c * L * u + n[0] * k * u * u) * sk, B[1] + (s2 * L * u + n[1] * k * u * u) * sk]);
      const w = (u) => bw * sk * (0.4 - 0.14 * u);
      const sp = (i, f) => [ax[i][0] + n[0] * w(i === 1 ? 0.5 : 0.88) * f, ax[i][1] + n[1] * w(i === 1 ? 0.5 : 0.88) * f];
      if (t > 0) P.push([...rp(t - hw * 1.2)]);
      P.push(sp(1, 1), sp(2, 1), [ax[3][0] + n[0] * w(1) * 0.55, ax[3][1] + n[1] * w(1) * 0.55], ax[3], [ax[3][0] - n[0] * w(1) * 0.55, ax[3][1] - n[1] * w(1) * 0.55], sp(2, -1), sp(1, -1));
      if (t < 1) P.push([...rp(t + hw * 1.2)]);
      spitzen.push([ax[1], ax[2], ax[3], n, w]); achsen.push([B, ax[3]]);
    }
    for (const [x, y] of UNTEN.slice(1)) P.push([bx + x * sk, by + y * sk]);
    const v = ([x, y, h]) => [x, by + (y - by) * VY, h];
    return { P: P.map(v), spitzen: spitzen.map(([m, q, e, n, w]) => [v(m), v(q), v(e), n, w]), achsen: achsen.map(([B, E]) => [v(B), v(E)]) };
  };
  const burr = kw([14.6, -4.6]);
  const textur = (G, bx, by, sk, dunkel) => {
    if (!fein) return "";
    /* Längsrillen: von der Stange in jedes Ende; Perlung an Stange und Rose */
    let dr = "", dl = "", dp = "", dq = "";
    for (const [B, E] of G.achsen) for (const o of [-2.4, 0.2, 2.8]) {
      const r = (T.rnd() - 0.5) * 3, a0 = [bx - 1 + o * 0.4 + r, by - (24 + r * 2) * sk * VY], m = [(B[0] + E[0]) / 2 + o * 0.7 + r * 0.3, (B[1] + E[1]) / 2 + r];
      dr += "M" + zf(...a0) + "Q" + zf(B[0] + o * 0.8 + r, B[1] + 6, m[0], m[1]) + "T" + zf(E[0] + o * 0.3, E[1] + 3 + Math.abs(r));
    }
    for (let i = 0; i < 5; i++) { const o = -2 + i; dl += "M" + zf(bx + o * sk, by - 2) + "q" + zf(-1, -14 * sk * VY, o * 0.3 - 1.6, -30 * sk * VY); }
    for (let i = 0; i < 26; i++) { const y = (-2 - T.rnd() * 26) * VY, x = 3.6 - T.rnd() * 7.6; const m = "M" + zf(bx + x * sk, by + y * sk) + "h0"; if (i % 3) dp += m; else dq += m; }
    return `<path d="${dr}" fill="none" stroke="#1c140c" stroke-width=".3" opacity="${dunkel ? 0.1 : 0.13}"/>` +
      `<path d="${dl}" fill="none" stroke="#120c06" stroke-width=".45" opacity=".22"/>` +
      `<path d="${dr.replace(/M([\d.-]+)/g, (m0, v) => "M" + R(+v + 0.9))}" fill="none" stroke="#f6ead0" stroke-width=".3" opacity="${dunkel ? 0.05 : 0.1}"/>` +
      `<path d="${dp}" stroke="#20160c" stroke-width="1.1" stroke-linecap="round" opacity=".35"/><path d="${dq}" stroke="#e8dcc0" stroke-width=".8" stroke-linecap="round" opacity=".35"/>`;
  };
  const spitzenElf = (G, op) => G.spitzen.map(([m, q, e, n, w]) =>
    FO([[m[0] - n[0] * w(0.5) * 1.2, m[1] - n[1] * w(0.5) * 1.2], [q[0] - n[0] * 2, q[1] - n[1] * 2], [e[0] + (e[0] - q[0]) * 0.6, e[1] + (e[1] - q[1]) * 0.6],
      [q[0] + n[0] * 2, q[1] + n[1] * 2], [m[0] + n[0] * w(0.5) * 1.2, m[1] + n[1] * w(0.5) * 1.2]], ELF, op)).join("");
  const gewG = (n, d) => T.lg(n, d ? [[0, "#2e2418"], [0.5, "#4a3c2a"], [1, "#7a6a52"]] : [[0, "#4a3a28"], [0.4, "#6e5a40"], [0.75, "#9c866a"], [1, "#c8b694"]], 0, 1, 0.3, 0);

  /* fernes Geweih: an der fernen Rose (etwas höher und weiter vorn), 10 % kleiner, 20 % dunkler, sichtbare ferne Stange */
  const fb = [burr[0] + 7, burr[1] - 5];
  const GF = geweih(fb[0], fb[1], 0.9);
  s += K(T, GF.P, gewG("gwf", 1), { rand: false, vol: false, innen: textur(GF, fb[0], fb[1], 0.9, 1) + WEICH(T, spitzenElf(GF, 0.35) +
    FO([[fb[0] + 2, fb[1] - 2], [fb[0] + 3, fb[1] - 26], [fb[0] - 30, fb[1] - 40], [fb[0] - 80, fb[1] - 40], [fb[0] - 40, fb[1] - 30], [fb[0] - 2, fb[1] - 6]], S0, 0.3), 1.4) });
  s += F([[fb[0] - 4.6, fb[1] + 1.6], [fb[0] - 4, fb[1] - 2], [fb[0], fb[1] - 3], [fb[0] + 4.6, fb[1] - 1.6], [fb[0] + 5, fb[1] + 1.8], [fb[0], fb[1] + 3]], "#2e2418");

  /* ---------- ferne Beine: gleiche Gelenke, 18 % dunkler, Verdeckungsschatten des nahen Beins ---------- */
  s += bein(VF, "vf", true, true, WEICH(T, FO(VN.map(([x, y]) => [x + 2.4, y + 1]), S0, 0.35), 1.6));
  s += bein(HF, "hf", false, true, WEICH(T, FO(HN.map(([x, y]) => [x + 2.4, y + 1]), S0, 0.35), 1.6));

  /* ---------- nahe Beine (vor dem Rumpf gezeichnet: der Rumpf liegt mit Achsel- und Kniefalte darüber) ---------- */
  const sehnenV = fein ? LI([[255.4, -56], [254.4, -44], [254.4, -30]], "#f0dcbc", 0.6, ` opacity=".4"`) + LI([[248.6, -56], [248.4, -42], [248.6, -28]], "#120a04", 0.55, ` opacity=".5"`) +
    LI([[246.6, -54], [246.4, -40], [246.6, -28]], "#e8d4b4", 0.4, ` opacity=".3"`) + LI([[255.8, -96], [255.4, -80]], "#f0dcbc", 0.7, ` opacity=".3"`) : "";
  const sehnenH = fein ? LI([[39.4, -114], [43, -104], [45.4, -95], [46.2, -88]], "#f0dcbc", 0.7, ` opacity=".45"`) +
    LI([[44.6, -118], [48, -106], [50, -96], [51, -88]], "#120a04", 0.75, ` opacity=".5"`) + LI([[67.4, -72], [68.6, -56], [70, -40], [71, -30]], "#f0dcbc", 0.6, ` opacity=".35"`) +
    LI([[61, -72], [62.4, -56], [63.6, -40], [64.2, -30]], "#120a04", 0.55, ` opacity=".45"`) : "";

  /* ---------- Rumpf und Hals ---------- */
  const grund = T.lg("grund", [[0, "#c8a678"], [0.12, "#ad8a5e"], [0.32, "#987650"], [0.55, "#86663f"], [0.72, "#5e4630"], [0.88, "#4e3a28"], [1, "#6e5640"]], 0, -232, 0, -112, UB);
  const dR = glatt(rumpf);
  /* Höhlenbild-Zeichnung: Buckel dunkel und 25–30 cm auf Schulter und Halsansatz herab, Schulterstreifen 10,6 → 4,2 cm,
     Halsband (oben in den Buckel, zur Kehle auslaufend), Flankenlinie (vorn 5 cm, vor dem Knie verlöschend) – Ränder gefiedert */
  const band = (Lin, w0, w1) => { const L = [], Q = []; for (let i = 0; i <= 12; i++) { const t = i / 12, p = entlang(Lin, t), q = entlang(Lin, Math.min(1, t + 0.04)), p0 = entlang(Lin, Math.max(0, t - 0.04));
    const dx = q[0] - p0[0], dy = q[1] - p0[1], l = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * t) / 2; L.push([p[0] - dy / l * w, p[1] + dx / l * w]); Q.push([p[0] + dy / l * w, p[1] - dx / l * w]); }
    return [L, Q]; };
  const SCH = [[206, -214], [213, -192], [221, -168], [227, -146], [230, -128]], FLA = [[226, -132], [196, -136], [166, -140], [140, -145], [116, -151]];
  const HB = [[234, -224], [246, -206], [260, -190], [274, -180], [290, -176]];
  const [s1, s2] = band(SCH, 10.6, 4.2), [f1, f2] = band(FLA, 5.3, 1.2), [h1, h2] = band(HB, 15, 10);
  const buckel = [[168, -202], [182, -210], [196, -220], [210, -229], [226, -230], [240, -229], [254, -235], [258, -222], [248, -204], [234, -194], [218, -190], [202, -192], [186, -198]];
  const fl = T.lg("fla", [[0, DUNKEL, 0.85], [0.7, DUNKEL, 0.35], [1, DUNKEL, 0]], 226, 0, 116, 0, UB);
  const hbG = T.lg("hb", [[0, DUNKEL, 0.9], [0.6, DUNKEL, 0.6], [1, DUNKEL, 0]], 236, -224, 292, -176, UB);
  const buG = T.lg("bu", [[0, DUNKEL, 0.95], [0.55, DUNKEL, 0.88], [0.85, DUNKEL, 0.4], [1, DUNKEL, 0]], 0, -232, 0, -190, UB);
  const muster = WEICH(T, F(buckel, buG) + F(s1.concat([...s2].reverse()), DUNKEL, ` opacity=".8"`) + F(f1.concat([...f2].reverse()), fl) + F(h1.concat([...h2].reverse()), hbG), 0.7);
  /* gefiederte Ränder: Fellstriche in Wuchsrichtung über die Kanten */
  const feder = (Lin, n, w, len, op) => FELL(T, (() => { const a = [], b = []; for (let i = 0; i <= 12; i++) { const p = entlang(Lin, i / 12); a.push([p[0] - 2, p[1] - 1.6]); b.unshift([p[0] + 2, p[1] + 1.6]); } return a.concat(b); })(),
    n, w, len, () => 0, [[DUNKEL, op, 0.4]], { streuung: 14, szene: 0.15 });
  const federn = feder(buckel.slice(8).concat(buckel.slice(0, 1)), 70, 150, 3.2, 0.6) + feder(s1, 30, 130, 3, 0.55) + feder(s2.slice().reverse(), 30, 130, 3, 0.55) +
    feder(f1.slice(0, 8), 22, 150, 2.6, 0.45) + feder(h1, 24, 100, 3.4, 0.5) + feder(h2, 24, 100, 3.4, 0.4);
  /* Licht: oben links. Rückenlinie, Halsoberseite +; Kernschatten unteres Drittel; Reflex an der Bauchkante; Verdeckung unter
     Kinn, Hals, Achsel, Leiste; Schulterblattgräte als Lichtkante; Rippenbogen; Hüfthöcker; Keulenfurche */
  const licht = WEICH(T,
    FO([[30, -195], [60, -199], [110, -197], [160, -200], [180, -206], [176, -199], [120, -192], [60, -192], [32, -188]], HL, 0.34) +
    FO([[240, -226], [258, -235], [272, -249], [281, -258], [284, -250], [266, -236], [244, -222]], HL, 0.3) +
    FO([[262, -224], [284, -236], [292, -214], [292, -186], [278, -180], [268, -200]], "#efe0c0", 0.55) +
    FO([[40, -132], [100, -132], [160, -128], [222, -126], [230, -118], [160, -119], [104, -124], [44, -124]], S0, 0.22) +
    FO([[110, -122], [160, -120], [210, -119], [210, -117.4], [160, -118.2], [112, -121.6]], "#e8d0a8", 0.35) +
    FO([[246, -232], [266, -246], [279, -258], [282, -250], [266, -238], [248, -226]], S0, 0.2) + FO([[276, -246], [292, -238], [290, -226], [280, -232]], S0, 0.32) + FO([[270, -150], [284, -158], [282, -142], [272, -136]], S0, 0.26) +
    FO([[224, -128], [234, -126], [236, -118], [226, -118]], S0, 0.42) + FO([[104, -132], [112, -130], [110, -122], [104, -124]], S0, 0.4) +
    FO([[206, -206], [212, -204], [252, -150], [264, -138], [258, -136], [244, -150]], HL, 0.24) + FO([[212, -196], [222, -194], [252, -150], [246, -148]], S0, 0.14) +
    FO([[178, -186], [190, -170], [200, -146], [194, -144], [184, -168], [172, -184]], S0, 0.14) +
    FO([[58, -200], [70, -200], [74, -192], [60, -192]], HL, 0.3) + FO([[64, -190], [74, -190], [72, -184], [62, -184]], S0, 0.12) +
    FO([[30, -186], [56, -190], [70, -176], [60, -160], [36, -164]], HL, 0.14), 2.4);
  /* Haarstrom: Rumpf vom Widerrist nach hinten-unten, Hals abwärts zur Brust, Buckel nach hinten, Keule abwärts */
  const zonen = [
    [[[150, -240], [300, -240], [300, -110], [226, -110], [236, -200], [150, -206]], 98],
    [[[150, -206], [236, -200], [226, -110], [150, -110]], 128],
    [[[60, -210], [150, -210], [150, -110], [60, -110]], 150],
    [[[0, -210], [60, -210], [60, -100], [0, -100]], 108]];
  const zl = zonen.map(([p, w]) => [p, w, 0.85]), zh = zonen.map(([p, w], i) => [p, w, i === 3 ? 0.55 : 0.7]);
  let k = K(T, dR, grund, { rand: false, vol: false, innen: licht + HAARZONEN(T, null, zl, MD) + HAARZONEN(T, null, [[[[252, -262], [300, -262], [300, -170], [250, -170], [246, -200]], 98, 0.7], [[[60, -206], [176, -206], [200, -192], [250, -196], [250, -165], [60, -165]], 145, 0.7], [[[0, -206], [60, -206], [60, -150], [0, -150]], 108, 0.55]], MH) + muster + federn });
  /* Strähnen mit Einzelhaaren: Rumpf 3–4,5 cm, Glanzhaare oben, dunkle unten */
  const top = (x) => bei(ruecken, Math.max(26, Math.min(279, x)));
  const lr = (x, y) => (x > 172 && x < 252 && y < -194 ? 0.05 : Math.max(0, Math.min(1, zyl(Math.max(0, (y - top(x)) / (-120 - top(x)))) * 0.82)));
  const flussR = (x, y) => (x > 236 ? 96 : x > 200 ? 128 : x > 60 ? 150 + (y + 200) * 0.2 : 108);
  k += LOCKEN(T, [[30, -192], [100, -196], [170, -200], [200, -194], [236, -196], [250, -200], [234, -126], [150, -122], [100, -126], [60, -116], [36, -128], [22, -170]], 60,
    flussR, 4, 0.9, lr, TON, { streuung: 12, kruemmung: 0.14, szene: 0.08, szeneB: 2, haare: 2, hb: 0.16, jitter: 0.5 });
  /* Buckel: Haar 2–3× länger, nach hinten anliegend, 3 Töne geschichtet; Kontur nur durch weiche Spitzen gebrochen */
  k += LOCKEN(T, buckel, 30, 172, 9, 1.4, (x, y) => Math.max(0, Math.min(1, (-196 - y) / 30)), TONB, { streuung: 8, kruemmung: 0.12, szene: 0.15, haare: 2, hb: 0.2 });
  k += LOCKENLINIE(T, ruecken.slice(9, 18), 26, [-0.5, 1.5], 176, 6, 0.9, () => 0.7, TONB, { streuung: 10, szene: 0.1, haare: 1, hb: 0.18 });
  /* Kehlmähne (Winterfell): 8–15 cm, hängend, geschichtet, Wurzeln dunkler */
  const mane = [[kw([4, 16])[0], kw([4, 16])[1]], [292, -232], [296, -210], [294, -190], [288, -170], [282, -176], [284, -200], [280, -224]];
  k += LOCKEN(T, mane, 40, (x, y) => 98 - (x - 286) * 1.4, (x, y) => 9 + (y + 230) * -0.06, 2, (x, y) => 0.45 + (296 - x) / 40 + (y + 200) / 120, TON.slice(2), { streuung: 8, kruemmung: 0.18, szene: 0.15, szeneB: 1.8, haare: 2, hb: 0.22 });
  /* Konturen gebrochen: Rücken, Bauch, Keule, Brust */
  k += LOCKENLINIE(T, ruecken.slice(0, 10), 30, [-0.4, 0.8], (x) => (x < 60 ? 130 : 168), 2.2, 0.5, () => 0.85, TON.slice(4), { streuung: 12, szene: 0.1 });
  k += LOCKENLINIE(T, bauch.slice(1, 12), 32, [-1.6, 0.2], 94, 2.4, 0.55, () => 0.3, TON.slice(0, 5), { streuung: 14, szene: 0.1 });
  /* Präputialpinsel: aus einem kleinen Hautwulst, 10–13 cm, braunschwarz, gebündelt, unten aufgefächert */
  k += F([[146, -121], [151, -116.6], [156, -118.4], [157, -121]], "#4a3828");
  k += LOCKEN(T, [[148.6, -118.6], [153.6, -118], [152.6, -116.4], [149.6, -116.6]], 11, (x) => 92 + (x - 151) * 5, 11, 1, () => 0.3, TONB, { streuung: 6, kruemmung: 0.2, szene: 0.4, haare: 2, hb: 0.18 });
  s += `<g filter="${T.volumen("rumpf", { weich: 20, tiefe: 5, umgebung: 0.3 })}">${k}</g>`;

  /* ---------- nahe Beine: nach dem Rumpf, oben weich ausgeblendet ---------- */
  s += bein(HN, "hn", false, false, WEICH(T,
    /* Keule: runde Lichtform oben hinten, Muskelfurche (Bizeps / Halbsehnenmuskel), Unterkante des Bizeps als weicher Schatten,
       Kniescheibe hell, Unterschenkel im Schatten */
    FO([[24, -176], [52, -184], [76, -170], [70, -150], [44, -146], [26, -158]], HL, 0.2) +
    FO([[37, -178], [41, -178], [44, -150], [45, -128], [41.4, -128], [38, -152]], S0, 0.26) + FO([[42, -178], [45, -176], [47.4, -150], [48, -130], [46, -130], [44.6, -152]], HL, 0.14) +
    FO([[46, -128], [70, -126], [100, -118], [96, -108], [70, -112], [48, -116]], S0, 0.26) + FO([[96, -128], [103, -124], [102, -112], [96, -116]], HL, 0.22) +
    FO([[60, -112], [96, -108], [92, -98], [70, -90], [52, -98]], S0, 0.2), 2) + sehnenH);
  s += bein(VN, "vn", true, false, WEICH(T, FO([[228, -124], [256, -124], [256, -112], [232, -108]], S0, 0.35), 2) + sehnenV);
  /* Schwanz: 14 cm, in die Rückenlinie gesetzt, behaart mit Haarspitzen, hellere Unterseite; heller Spiegel */
  s += WEICH(T, FO([[18, -184], [28, -188], [30, -160], [22, -150], [16, -164]], "#efe2c8", 0.5), 1.6);
  const SW = [[28, -192], [23, -191.4], [19.6, -186], [17.4, -178], [17, -175], [19.4, -174.4], [21.4, -179], [24, -185], [28, -187.6]];
  s += `<g filter="${T.volumen("schwanz", { weich: 1.2, tiefe: 4 })}">` + K(T, SW, T.lg("sw", [[0, "#6a5038"], [0.6, "#4a3826"], [1, "#d8c8a8"]], 0, 0, 1, 0.4), { rand: false, vol: false }) +
    LOCKEN(T, [[19, -188], [26, -191], [23, -183], [19.4, -178]], 12, 110, 5, 0.9, (x) => (x < 20 ? 0.8 : 0.2), TON, { streuung: 10, kruemmung: 0.2, szene: 0.3, haare: 1, hb: 0.16 }) + "</g>";

  /* ---------- Kopf (eigene Volumengruppe) ---------- */
  const dK = glatt(kopfL);
  const kopfG = T.lg("kopf", [[0, "#dcc8a4"], [0.4, "#c8b08a"], [0.75, "#a68a66"], [1, "#8a7052"]], 0, -4, 0, 24, UB);
  const kl = WEICH(T,
    /* Nasenrücken gerade mit Glanzlinie; Gesichtsleiste helle Kante + Schattenrinne; Masseter rund; Stirn hell; Maul grauer */
    FO([[24, -1.4], [40, 1.8], [51, 4.8], [51, 6.6], [40, 3.6], [24, 0.6]], HL, 0.45) + FO([[16, 10.4], [28, 10.6], [38, 12.2], [38, 13.6], [26, 12.6], [16, 12.4]], HL, 0.32) +
    FO([[16, 13], [28, 13.2], [40, 14.4], [40, 16], [26, 15], [16, 15]], S0, 0.24) + FO([[6, 13], [14, 11.6], [21, 14], [21, 20], [14, 22], [7, 19]], HL, 0.2) +
    FO([[-2, 2], [8, -2], [18, -2], [14, 2], [4, 6]], HL, 0.3) + FO([[44, 8], [56, 9], [59, 16], [54, 21], [44, 20]], "#4a3c30", 0.3) +
    FO([[24, 20], [44, 21], [52, 22.6], [44, 23.2], [24, 23.4]], S0, 0.25) + FO([[2, 14], [10, 18], [16, 22], [8, 20]], S0, 0.24), 0.9);
  let kk = K(T, dK, kopfG, { rand: false, vol: false, innen: kl +
    HAARZONEN(T, null, [[[[-10, -10], [62, -10], [62, 30], [-10, 30]], 182, 0.75]], [[...MD[0].slice(0, 6), 0.4]]) +
    HAARZONEN(T, null, [[[[-10, -10], [62, -10], [62, 12], [-10, 12]], 182, 0.6]], [[...MH[0].slice(0, 6), 0.4]]) });
  /* Haarstrom im Gesicht: kurz, von der Nase nach hinten; um das Auge herum strahlenförmig */
  const ax = 21.4, ay = 4.2;
  kk += FELL(T, kopfL.slice(1, 26), 150, (x, y) => (Math.hypot(x - ax, y - ay) < 8 ? Math.atan2(y - ay, x - ax) * 180 / Math.PI : y > 18 ? 186 : 178), 1.6,
    (x, y) => Math.max(0, Math.min(1, 0.92 - (y + 3) / 32)), [["#5a4430", 0.5, 0.18], ["#8a6e4e", 0.45, 0.16], ["#c8b08c", 0.5, 0.15], ["#f0e2c4", 0.5, 0.14]], { streuung: 12, szene: 0.1 });
  kk += LOCKENLINIE(T, kopfL.slice(22, 29), 26, [-0.8, 0.4], 150, 3, 0.5, () => 0.55, TON.slice(3), { streuung: 12, szene: 0 });
  s += `<g filter="${T.volumen("kopf", { weich: 4, tiefe: 5, umgebung: 0.32 })}">${KG}${kk}</g></g>`;

  /* ---------- Ohr (≈ 27 cm, 47 % der Kopflänge): löffelförmig, Muschel innen dunkel, heller Haarsaum, Schlagschatten des Geweihs ---------- */
  let o = KG;
  const OHR = [[9, 0.4], [1, -1.6], [-8, 0.4], [-15, 3.4], [-19.4, 6.8], [-16.4, 9.4], [-8, 9.6], [1, 8], [9, 6]];
  o += `<g filter="${T.volumen("ohr", { weich: 1.4, tiefe: 4 })}">` + K(T, OHR, T.lg("ohr", [[0, "#c8ae86"], [1, "#8a6e4e"]], 0, 0, 0, 1), { rand: false, vol: false, innen:
    F([[6, 2.6], [-2, 2.4], [-11, 4.6], [-16, 7.2], [-9, 7.6], [-1, 6.6], [6, 5.4]], T.lg("muschel", [[0, "#3a2a1c"], [1, "#6a5038"]], 0, 0, 1, 0)) +
    FELL(T, [[6, 2.6], [-2, 2.4], [-11, 4.6], [-16, 7.2], [-9, 7.6], [-1, 6.6], [6, 5.4]], 22, 200, 2.4, () => 1, [["#e8d8b8", 0.4, 0.12]], { szene: 0 }) +
    WEICH(T, FO([[-4, -2], [8, -2], [8, 4], [-4, 3]], S0, 0.3), 1) }) + "</g>";
  o += LOCKENLINIE(T, [[-19.4, 6.8], [-16.4, 9.4], [-8, 9.6], [1, 8]], 18, [-0.4, 0.2], 110, 1.8, 0.3, () => 1, ["#efe2c8", "#dccaa6"], { szene: 0 });
  /* Rose wächst aus dem Stirnfell; Schlagschatten des Geweihs auf Stirn und Hinterkopf */
  o += WEICH(T, FO([[4, -3], [16, -4], [22, 2], [10, 4], [2, 2]], S0, 0.22), 1.4);

  /* ---------- Auge (+35 %): rundlich-oval, vorgewölbt, dunkle Iris, querovale Pupille, Glanzlicht, Oberlidschatten, 6 Wimpern;
     Voraugendrüse beginnt im inneren Augenwinkel, Tropfengrube 30° nach vorn-unten, dunkler Kern, heller Faltenrand ---------- */
  o += F([[24.2, 5.2], [27.6, 5.8], [31.4, 7.6], [33.6, 9.4], [32.4, 10.4], [29, 9.4], [25.6, 7.6]], "#6a5440", ` opacity=".55"`) +
    F([[24.6, 5.8], [28, 6.8], [31.6, 8.6], [29, 8.4], [25.6, 7]], "#1a120a", ` opacity=".7"`) +
    LI([[24.6, 4.2], [28.4, 5], [32.4, 7], [34.6, 9.4]], "#efe0c4", 0.5, ` opacity=".5"`) + LI([[25.4, 8.6], [29, 10.4], [32.4, 11.4]], "#e8d4b0", 0.4, ` opacity=".35"`);
  o += AUGE2(T, ax, ay, 6.8, 4.9, { iris: "#1e140c", iris2: "#3a2616", pupille: "quer", winkel: -6, falten: 2, kraehen: 1, oberlid: 0.18, lidfarbe: "#6a5440",
    wimpern: 6, wl: 0.55, wkrumm: 0.15, wwinkel: 18, hautHell: "#e8d4b0" });
  /* Nasenspiegel: flach, unbehaart, dunkel graubraun matt, kleiner feuchter Glanzpunkt; Nüster als Kommaschlitz nach hinten-oben */
  o += K(T, [[51.4, 5.2], [55.8, 6.4], [58.2, 8.4], [59.4, 11.4], [59.8, 14.6], [59.2, 16.4], [56.4, 15.6], [53.4, 11.6], [51, 7.4]], T.lg("nase", [[0, "#3a3028"], [1, "#2a221c"]]), { rand: false, vol: false, innen:
    `<path d="M58.4 14.4q-1.2-.2-2.7-1.8q-1.5-1.6-3.4-2.6q2.4 0 3.8 1.4q1.3 1.2 2.3 3z" fill="#0a0806"/>` + fleck(T, 57.2, 8.6, 1, 0.5, "#e8eef0", 0.55) +
    (fein ? `<path d="M52.6 8.8q3 1 5.6 4.4" stroke="#5a4a40" stroke-width=".3" opacity=".5" fill="none"/>` : "") });
  /* Mundspalt gerade bis 1/3 der Kopflänge, Oberlippe steht über, kleines rundes Kinn; Tasthaare hell */
  o += LI([[57.2, 20.2], [52, 20.6], [45, 21], [39.6, 20.8]], "#1a120c", 0.6, ` opacity=".8"`) + LI([[57, 19.2], [50, 19.6], [44, 20]], "#e8dcc8", 0.4, ` opacity=".35"`) +
    WEICH(T, FO([[46, 21.6], [54, 21.4], [55, 22.4], [50, 23], [46, 22.8]], "#efe2c8", 0.35), 0.5);
  o += TASTHAARE(T, [[56.4, 17.2], [57.4, 18.2], [55.2, 18], [56.4, 19.2], [54.2, 19], [53.6, 17.4], [55, 16.6], [52.8, 18.4]], (i) => 64 + i * 9, 5.2, 0.14, "#f4ece0", 0.65);
  o += "</g>";
  s += o;

  /* ---------- nahes Geweih ---------- */
  const GN = geweih(burr[0], burr[1], 1);
  /* Schlagschatten des Geweihs auf Hals und Buckel */
  s += K(T, GN.P, gewG("gwn", 0), { rand: false, vol: false, innen: textur(GN, burr[0], burr[1], 1, 0) + WEICH(T, spitzenElf(GN, 0.7) +
    /* gewölbte Schaufel: dunkler Kern innen, heller Randsaum oben; runde Stange mit Lichtgrat */
    FO([[burr[0] - 6, burr[1] - 40], [burr[0] - 24, burr[1] - 56], [burr[0] - 56, burr[1] - 58], [burr[0] - 84, burr[1] - 50], [burr[0] - 56, burr[1] - 40], [burr[0] - 20, burr[1] - 34]], S0, 0.3) +
    FO([[burr[0] - 0.4, burr[1] - 2], [burr[0] - 1, burr[1] - 34], [burr[0] + 1.6, burr[1] - 34], [burr[0] + 2.4, burr[1] - 2]], HL, 0.42) +
    FO([[burr[0] - 6, burr[1] - 60], [burr[0] - 40, burr[1] - 70], [burr[0] - 84, burr[1] - 62], [burr[0] - 80, burr[1] - 58], [burr[0] - 40, burr[1] - 64]], HL, 0.3), 1.4) });
  /* Augsprosse: direkt über der Rose, schaufelig mit zwei Enden, nach vorn über Stirn und Auge */
  const AUG = [[1, -3], [9, -6], [18, -10], [26, -15], [31, -20], [33.4, -25], [30, -22.6], [28.6, -27.4], [25, -22], [16, -14.4], [6, -10], [0, -8]].map(([x, y, h]) => [burr[0] + x, burr[1] + y, h]);
  s += K(T, AUG, gewG("gwn", 0), { rand: false, vol: false, innen: WEICH(T, FO([[burr[0] + 2, burr[1] - 3], [burr[0] + 24, burr[1] - 13], [burr[0] + 24, burr[1] - 11], [burr[0] + 2, burr[1] - 1]], S0, 0.35) +
    FO([[burr[0] + 26, burr[1] - 18], [burr[0] + 34, burr[1] - 26], [burr[0] + 31, burr[1] - 22], [burr[0] + 29, burr[1] - 28], [burr[0] + 24, burr[1] - 22]], ELF, 0.6), 0.8) +
    (fein ? `<path d="M${zf(burr[0] + 3, burr[1] - 6)}q12-3 26-15M${zf(burr[0] + 4, burr[1] - 8.4)}q10-2 22-13" stroke="#1c140c" stroke-width=".3" opacity=".22" fill="none"/>` : "") });
  /* Rose: dicker Perlring (1,3 × Stange), Eigenschatten unten, aus dem Stirnfell wachsend */
  let rose = fleck(T, burr[0] + 1, burr[1] + 2.6, 7, 2.2, S0, 0.5) + F([[burr[0] - 5.2, burr[1] + 0.8], [burr[0] - 4.6, burr[1] - 1.8], [burr[0], burr[1] - 2.8], [burr[0] + 4.8, burr[1] - 1.8], [burr[0] + 5.6, burr[1] + 0.8], [burr[0], burr[1] + 2.2]],
    T.lg("rose", [[0, "#9c866a"], [0.45, "#6e5a40"], [1, "#2e2418"]], 0, 0, 0, 1));
  if (fein) { let d1 = "", d2 = ""; for (let i = 0; i < 11; i++) { const a = Math.PI * (0.04 + 0.92 * i / 10), x = burr[0] - Math.cos(a) * 4.8, y = burr[1] - Math.sin(a) * 1.8 + 0.5; d1 += "M" + zf(x, y + 0.3) + "h0"; d2 += "M" + zf(x - 0.3, y - 0.3) + "h0"; }
    rose += `<path d="${d1}" stroke="#2e2216" stroke-width="1.1" stroke-linecap="round" opacity=".8"/><path d="${d2}" stroke="#e0d0ac" stroke-width=".6" stroke-linecap="round" opacity=".7"/>`; }
  rose += FELL(T, [[burr[0] - 7, burr[1] + 4], [burr[0] + 7, burr[1] + 4], [burr[0] + 6, burr[1] + 1.6], [burr[0] - 6, burr[1] + 1.6]], 20, -84, 2, () => 0.7,
    [["#a88c66", 0.7, 0.18], ["#dcc8a4", 0.7, 0.16]], { szene: 0 });
  s += rose;

  return { svg: s, box: [14, -342, 340, 0], fuesse: [262, 245, 78, 93], kopf: [266, -300, 340, -196] };
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
    gruppe: "Eiszeit", lebensraum: "Eiszeit", laenge: 1.81, hoehe: 1.09, zeichne: saebelzahn },
  { id: "wollnashorn", de: "das Wollnashorn", syl: "WOLL-nas-horn", it: "il rinoceronte lanoso", itSyl: "ri-no-ce-RON-te la-NO-so", en: "woolly rhinoceros",
    gruppe: "Eiszeit", lebensraum: "Eiszeit", laenge: 4.1, hoehe: 1.68, zeichne: wollnashorn },
  { id: "riesenhirsch", de: "der Riesenhirsch", syl: "RIE-sen-hirsch", it: "il megacero", itSyl: "me-GA-ce-ro", en: "giant deer",
    gruppe: "Eiszeit", lebensraum: "Eiszeit", laenge: 3.22, hoehe: 3.42, zeichne: riesenhirsch },
  { id: "hoehlenbaer", de: "der Höhlenbär", syl: "HÖH-len-bär", it: "l'orso delle caverne", itSyl: "OR-so del-le ca-VER-ne", en: "cave bear",
    gruppe: "Eiszeit", lebensraum: "Eiszeit", laenge: 2.84, hoehe: 1.42, zeichne: hoehlenbaer },
];
