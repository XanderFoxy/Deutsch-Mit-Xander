/* =====================================================================
   TIER-BIBLIOTHEK — HOFVÖGEL (FASSUNG 854, Maßstab 2, Runde 2)
   Hahn, Henne, Küken, Ente (Stockenten-Erpel), Gans (weiße Höckergans), Truthahn (Bronzeputer, balzend)
   Zentimeter, Blick nach rechts, Boden y = 0, EIN Licht von links oben (siehe ANLEITUNG.md).
   Kritik Runde 1 (alle sechs NICHT OK): „Fischschuppen/Tannenzapfen statt Gefieder, Umrisslinien wie Ausschneidebogen,
   kein Volumen, Säulenbeine, Säugetieraugen". Darum jetzt:
   - Körper zuerst als EINE Licht-/Schattenform (Lichtkante oben, Kernschatten im unteren Drittel, Bodenreflex),
     Schlagschatten und Okklusion weich (Weichzeichner nur in der Großansicht, sRGB).
   - Gefieder als Federfluren: Reihen parallel zur Körperkontur, je Feder nur Lichtsaum + weicher Schatten auf der Feder
     darunter, keine Umrisse; abgesetzte Federn (Decken, Schwingen, Behang) mit weichem Schattensaum (paint-order).
   - Vogelauge rund mit Lidring, Oberlid-Schatten, Glanz zur Lichtquelle; keine Augenwinkel, keine Braue.
   - Läufe mit Ferse, Gürtelschuppen vorn, Netzschuppen hinten, gefächerten Zehen mit Ballen und Krallen.
   Mikrodetails nur bei T.fein (Großansicht); in der Szene bleiben Form, Licht und Farbe.
   ===================================================================== */
"use strict";
let Q = 10;                                   // Rundung (10 = 1 mm); das Küken rechnet feiner
/* knappe Zahlen für Pfade: „0.5" → „.5", Trenner nur wo nötig */
const N = (n) => { let s = String(Math.round(n * Q) / Q); if (s.startsWith("0.")) s = s.slice(1); else if (s.startsWith("-0.")) s = "-" + s.slice(2); return s === "-0" ? "0" : s; };
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
const B3 = (n) => String(Math.round(n * 1000) / 1000).replace(/^0\./, ".");   // Strichbreiten fein (unabhängig von Q)
const zug = (d, farbe, w, op = 1, extra = "") => d ? `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${B3(w)}"${op < 1 ? ` stroke-opacity="${B3(op)}"` : ""} stroke-linecap="round"${extra}/>` : "";
const fl = (d, farbe, op = 1, extra = "") => d ? `<path d="${d}" fill="${farbe}"${op < 1 ? ` opacity="${B3(op)}"` : ""}${extra}/>` : "";
/* glatte Kurve (Catmull-Rom), relativ geschrieben, ohne Rundungsdrift; [x, y, 1] = harte Ecke */
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
function auf(pts, t) {
  const n = pts.length - 1, f = Math.max(0, Math.min(0.9999, t)) * n, i = Math.floor(f);
  return lerp(pts[i], pts[i + 1], f - i);
}
function mische(c1, c2, t) {
  const h = (c) => (c.length === 4 ? c.replace(/([0-9a-f])/gi, "$1$1") : c);
  const a = h(c1), b = h(c2);
  return "#" + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, "0")).join("");
}
const box = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };

/* ---------- Licht ---------- */
function einmal(T, key, svg) { T._d = T._d || new Set(); if (!T._d.has(key)) { T._d.add(key); T.def(svg); } }
/* Weichzeichner (Kritik Punkt 12: color-interpolation-filters="sRGB") */
const weich = (T, sd0) => { const sd = sd0 < 0.3 ? 0.15 : sd0 < 0.65 ? 0.5 : 0.8, id = T.id("w" + String(sd).replace(".", "_")); einmal(T, id, `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${sd}"/></filter>`); return `url(#${id})`; };
/* weicher Schatten- oder Lichtfleck: groß geweichzeichnet, in der Szene ohne Filter mit weniger Deckkraft */
const fleck = (T, d, farbe, op, sd = 0.6, szene = false) => T.fein ? `<path d="${typeof d === "string" ? d : G(d)}" fill="${farbe}" opacity="${B3(op)}" filter="${weich(T, sd)}"/>` : (szene ? `<path d="${typeof d === "string" ? d : G(d)}" fill="${farbe}" opacity="${B3(op * 0.55)}"/>` : "");
/* Zylinder-Licht über einer Körperform (von oben nach unten): Lichtkante, Mitte, Kernschatten, Bodenreflex */
const LICHT = (T, st0 = 1) => { if (T.fein && T.volumen) return "";   // groß: das Volumen-Licht (T.volumen) übernimmt
  const st = st0; return T.lg("licht" + st0, [[0, "#fff", 0.2 * st], [0.24, "#fff", 0.04 * st], [0.5, "#000", 0], [0.7, "#000", 0.22 * st], [0.85, "#000", 0.34 * st], [0.95, "#000", 0.2 * st], [1, "#fff", 0.1 * st]]); };
/* Volumen je Körperteil (ANLEITUNG 13): die eigene Silhouette wird weichgezeichnet und gegen das Licht (links oben)
   versetzt – daraus entsteht innen an der abgewandten Kante (rechts unten) ein weicher Kernschatten und an der
   Lichtkante ein Licht; das passt von Teil zu Teil. Bewusst OHNE feDiffuseLighting (wie T.volumen): dessen Ableitung
   des 8-Bit-Weichzeichners ergab auf hellen, großen Flächen „Holzmaserung" (Treppenringe) – so bleibt es glatt.
   Klassen: k (0,35 cm), a (0,5), e (1,1), b (1,5), c (2,2), d (Rumpf, 4); je Art nur die benutzten Filter. */
const VW = { a: 0.5, b: 1.5, c: 2.2, d: 4, e: 1.1, k: 0.35 };
const vol = (T, n, inh, sch = 0.5, li = 0.12, farbe = "#140a04") => {
  if (!T.fein) return inh;
  const id = T.id("vo" + n + Math.round(sch * 100) + Math.round(li * 100) + farbe.slice(1)), w = VW[n], o = N(w * 0.9);
  const c = [1, 3, 5].map((i) => N(parseInt(farbe.slice(i, i + 2), 16) / 255));
  einmal(T, id, `<filter id="${id}" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="${w}" result="b"/>` +
    `<feOffset dx="-${o}" dy="-${o}"/><feComposite in="SourceAlpha" operator="out"/><feColorMatrix values="0 0 0 0 ${c[0]} 0 0 0 0 ${c[1]} 0 0 0 0 ${c[2]} 0 0 0 ${sch} 0" result="s"/>` +
    `<feOffset in="b" dx="${o}" dy="${o}"/><feComposite in="SourceAlpha" operator="out"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 ${li} 0" result="l"/>` +
    `<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="s"/><feMergeNode in="l"/></feMerge></filter>`);
  return `<g filter="url(#${id})">${inh}</g>`;
};
/* Körperteil: Form EINMAL als Definition, darauf Füllung, geklippte Innenzeichnung und Licht. Keine Umrisslinie. */
function teil(T, pts, fill, innen = "", o = {}) {
  const d = typeof pts === "string" ? pts : G(pts);
  const id = T.id("p" + (T._n = (T._n || 0) + 1));
  T.def(`<path id="${id}" d="${d}"/>`);
  let s = `<use href="#${id}" fill="${fill}"/>`;
  const lf = o.licht === false ? "" : (o.licht === undefined ? LICHT(T) : o.licht);
  const li = (lf ? `<use href="#${id}" fill="${lf}"/>` : "") + (o.seite && T.fein ? `<use href="#${id}" fill="${SEITE(T)}"/>` : "");
  const inn = (innen || "") + li;
  if (inn) {
    if (innen) { T.def(`<clipPath id="${id}c"><use href="#${id}"/></clipPath>`); s += `<g clip-path="url(#${id}c)">${inn}</g>`; } else s += li;
  }
  if (o.rand) s += `<use href="#${id}" fill="none" stroke="${o.rand}" stroke-width="${o.rw || 0.1}" stroke-opacity="${o.ra || 0.15}"/>`;
  return s;
}
const relief = (T, n, inh, o) => (T.fein ? `<g filter="${T.relief(n, o)}">${inh}</g>` : inh);
const struktur = (T, pts, n, winkel, farbe, op, fx = 0.9, fy = 0.25) => (T.fein ? T.textur(G(pts), T.rauschen(n, { fx, fy, farbe, staerke: 2.2, okt: 2 }), winkel, op, box(pts)) : "");

/* ---------- Federn ---------- */
/* Band entlang einer Mittellinie: Breite w0 → w1; rund = runde Federspitze, sonst spitz */
function band(pts, w0, w1, rund = false) {
  const n = pts.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const t = i / (n - 1), w = (w0 + (w1 - w0) * t) / 2;
    L.push([pts[i][0] - dy * w, pts[i][1] + dx * w]); R.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  const e = pts[n - 1], v = pts[n - 2], l = Math.hypot(e[0] - v[0], e[1] - v[1]) || 1;
  if (rund) return [...L, [e[0] + (e[0] - v[0]) / l * w1 * 0.55, e[1] + (e[1] - v[1]) / l * w1 * 0.55], ...R.reverse()];
  return [...L.slice(0, -1), [e[0], e[1], 1], ...R.slice(0, -1).reverse()];
}
function mitte3(pts, t0, t1, seite, w0, w1) {   // Linie entlang der Feder, seitlich versetzt (Anteil der Halbbreite)
  const p = (t) => {
    const f = t * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f)), q = lerp(pts[i], pts[i + 1], f - i);
    const dx = pts[i + 1][0] - pts[i][0], dy = pts[i + 1][1] - pts[i][1], l = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * t) / 2 * seite;
    return [q[0] - dy / l * w, q[1] + dx / l * w];
  };
  const a = p(t0), m = p((t0 + t1) / 2), e = p(t1);
  return "M" + J(a[0], a[1]) + "Q" + J(2 * m[0] - (a[0] + e[0]) / 2, 2 * m[1] - (a[1] + e[1]) / 2, e[0], e[1]);
}
/* Sammler: Federflächen in EINE Gruppe mit weichem Schattensaum (paint-order: der Saum liegt nur AUSSEN, auf der Feder
   darunter – keine Umrisslinie), Striche gleicher Art in EINEN Pfad */
function sammler() {
  const m = new Map(); let f = "";
  return {
    f: (x) => { f += x; },
    z: (d, farbe, w, op) => { if (!d) return; const k = farbe + "|" + w + "|" + op; m.set(k, (m.get(k) || "") + d); },
    aus: (saum = "#000", sw = 0.35, sop = 0.2) => (f ? `<g stroke="${saum}" stroke-width="${B3(sw)}" stroke-opacity="${B3(sop)}" paint-order="stroke" stroke-linejoin="round">${f}</g>` : "") +
      [...m].map(([k, d]) => { const [c, w, op] = k.split("|"); return zug(d, c, +w, +op); }).join(""),
  };
}
/* Lange Feder (Sichel, Schwinge, Steuerfeder): Fläche, Schaft, Lichtkante, Schillerband (glanz: [farbe, deckkraft]),
   Fahnenstrahlen (nur fein). Wird in einen Sammler K gelegt. */
function langfeder(T, pts, w0, w1, fill, o, K) {
  K.f(`<path d="${G(band(pts, w0, w1, o.rund))}" fill="${fill}"/>`);
  if (!T.fein) return;
  const zwei = pts.length > 3, lin = (s, a = 0, b = 0.95) => zwei ? mitte3(pts, a, (a + b) / 2, s, w0, w1) + mitte3(pts, (a + b) / 2, b, s, w0, w1) : mitte3(pts, a, b, s, w0, w1);
  if (o.glanz) K.z(lin(-0.3, 0.05, 0.9), o.glanz[0], (w0 + w1) / 2 * 0.32, o.glanz[1]);
  if (o.schaft) K.z(lin(o.aussen || 0, 0, 0.93), o.schaft, o.sw || 0.07, o.schaftOp || 0.5);
  if (o.kante) K.z(lin(-0.7, 0.05, 0.92), o.kante, o.kw || 0.12, o.kanteOp || 0.45);
  if (o.strahl) {
    let st = "";
    const m = o.strahlN || 10, n = pts.length;
    for (let j = 1; j < m; j++) {
      const t = j / m, f = t * (n - 1), i = Math.min(n - 2, Math.floor(f)), p = lerp(pts[i], pts[i + 1], f - i);
      let dx = pts[i + 1][0] - pts[i][0], dy = pts[i + 1][1] - pts[i][1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
      const w = (w0 + (w1 - w0) * t) / 2 * 0.9;
      for (const sg of [-1, 1]) st += "M" + J(p[0], p[1]) + "l" + J(-dy * sg * w + dx * w * 0.6, dx * sg * w + dy * w * 0.6);
    }
    K.z(st, o.strahl, 0.04, o.strahlOp || 0.25);
  }
}
/* Lanzettfeder (Hals-/Sattelbehang): Ansatz b, Spitze t, Breite w, Biegung bg; relativ geschriebene Bögen */
function lanze(b, t, w, bg = 0, rund = false) {
  const dx = t[0] - b[0], dy = t[1] - b[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, ux = dx / l, uy = dy / l;
  const m = [b[0] + dx * 0.5 + nx * bg, b[1] + dy * 0.5 + ny * bg], h = w * 0.5;
  const s1 = [m[0] + nx * h * 1.1, m[1] + ny * h * 1.1], s2 = [m[0] - nx * h * 1.1, m[1] - ny * h * 1.1];
  const sp = rund ? [t[0] - ux * w * 0.35, t[1] - uy * w * 0.35] : t;
  const pts = [[b[0] + nx * h * 0.6, b[1] + ny * h * 0.6], [s1[0] - ux * l * 0.15, s1[1] - uy * l * 0.15], s1];
  if (rund) pts.push([sp[0] + nx * h * 1.1, sp[1] + ny * h * 1.1], t, [sp[0] - nx * h * 1.1, sp[1] - ny * h * 1.1], s2);
  else pts.push([s1[0] + ux * l * 0.32, s1[1] + uy * l * 0.32], t, [s2[0] + ux * l * 0.32, s2[1] + uy * l * 0.32], s2);
  pts.push([s2[0] - ux * l * 0.15, s2[1] - uy * l * 0.15], [b[0] - nx * h * 0.6, b[1] - ny * h * 0.6]);
  const rd = (v) => Math.round(v * Q) / Q;
  let cx = rd(pts[0][0]), cy = rd(pts[0][1]), d = "M" + J(cx, cy);
  for (let i = 1; i < pts.length; i += 2) {
    const ex = rd(pts[i + 1][0]), ey = rd(pts[i + 1][1]);
    d += "q" + J(rd(pts[i][0]) - cx, rd(pts[i][1]) - cy, ex - cx, ey - cy); cx = ex; cy = ey;
  }
  return d + "Z";
}
/* Behang (Hals, Sattel): Federreihen; jede Reihe r (0 = oben/innen) mit Ansätzen auf der Linie ansatz(r, i) und
   Spitzen spitze(r, i). Untere Reihen zuerst (liegen unten), obere zuletzt. o: { reihen, je, w(r), farbe(r, i), rund,
   bieg, schaft: [farbe, deckkraft, von, bis] (Schaftstrich), saum } */
function behang(T, o) {
  const reihen = T.fein ? o.reihen : Math.ceil(o.reihen * 0.45), je = T.fein ? o.je : Math.ceil(o.je * 0.5);
  const K = sammler();
  const farben = new Map();
  let sf = "";
  for (let r = reihen - 1; r >= 0; r--) {
    const tr = reihen === 1 ? 0 : r / (reihen - 1);
    const reihe = [];
    for (let i = 0; i < je; i++) { const ti = Math.min(1, Math.max(0, (i + 0.5 + (T.rnd() - 0.5) * 0.7) / je)); reihe.push(ti); }
    reihe.sort((a, b) => Math.abs(b - 0.5) - Math.abs(a - 0.5));
    for (const ti of reihe) {
      const b = o.ansatz(tr, ti), t = o.spitze(tr, ti, T.rnd());
      const L = Math.hypot(t[0] - b[0], t[1] - b[1]);
      const w = o.w(tr) * (0.85 + T.rnd() * 0.3) * (T.fein ? 1 : 1.6);
      const f = o.farbe(tr, ti, T.rnd());
      if (!farben.has(f)) farben.set(f, "");
      farben.set(f, farben.get(f) + lanze(b, t, w, (o.bieg || 0) * L, o.rund));
      if (T.fein && o.schaft && tr >= (o.schaft[4] || 0)) {
        const a0 = lerp(b, t, o.schaft[2]), a1 = lerp(b, t, o.schaft[3]), mm = lerp(a0, a1, 0.5), nx = -(t[1] - b[1]) / L, ny = (t[0] - b[0]) / L, bb = (o.bieg || 0) * L * 0.5;
        sf += "M" + J(a0[0], a0[1]) + "Q" + J(mm[0] + nx * bb, mm[1] + ny * bb, a1[0], a1[1]);
      }
    }
  }
  /* je Farbe ein Pfad (klein); Reihenfolge der Farben ist egal, weil gleiche Reihen dieselbe Farbe teilen */
  let s = "";
  for (const [f, d] of farben) s += `<path d="${d}" fill="${f}"/>`;
  return `<g stroke="${o.saum || "#000"}" stroke-width="${B3(o.sw || 0.22)}" stroke-opacity="${B3(o.sop || 0.22)}" paint-order="stroke" stroke-linejoin="round">${s}</g>` +
    (sf ? zug(sf, o.schaft[0], o.schaftW || 0.1, o.schaft[1]) : "");
}

/* Federspitze: Mitte c, Richtung a (Grad), Länge L, Breite W */
function spitze(c, a, L, W) {
  const u = [Math.cos(rad(a)), Math.sin(rad(a))], n = [-u[1], u[0]], R = W / 2;
  return { u, n, R, L, T0: [c[0] + u[0] * (L / 2 - R), c[1] + u[1] * (L / 2 - R)] };
}
/* Bogen um die Federspitze (relativ), k = Radius-Faktor, Versatz ox/oy */
function bogen(F, k = 1, ox = 0, oy = 0, spitz = false) {
  const R = F.R * k, u = F.u, n = F.n, x = F.T0[0] + ox + n[0] * R, y = F.T0[1] + oy + n[1] * R;
  if (spitz) return "M" + J(x, y) + "q" + J(u[0] * R * 1.4 - n[0] * R * 0.3, u[1] * R * 1.4 - n[1] * R * 0.3, u[0] * R * 2 - n[0] * R, u[1] * R * 2 - n[1] * R) +
    "q" + J(-u[0] * R * 0.6 - n[0] * R * 0.7, -u[1] * R * 0.6 - n[1] * R * 0.7, -u[0] * R * 2 - n[0] * R, -u[1] * R * 2 - n[1] * R);
  return "M" + J(x, y) + "c" + J(u[0] * R * 1.33, u[1] * R * 1.33, u[0] * R * 1.33 - n[0] * 2 * R, u[1] * R * 1.33 - n[1] * 2 * R, -n[0] * 2 * R, -n[1] * 2 * R);
}
/* ganze Feder als Zunge: runde (oder spitze) Spitze, parallele Seiten, gerader Ansatz (liegt unter der Nachbarfeder) */
/* Blatt: runde Spitze, Seiten laufen gebogen zum Ansatzpunkt zusammen (keine geraden Kanten zwischen Nachbarn) */
const blatt = (F, spitz, lang = 2) => { const R = F.R, u = F.u, n = F.n, L = R * lang;
  return bogen(F, 1, 0, 0, spitz) + "q" + J(-u[0] * L * 0.55, -u[1] * L * 0.55, -u[0] * L + n[0] * R, -u[1] * L + n[1] * R) + "q" + J(u[0] * L * 0.45 + n[0] * R, u[1] * L * 0.45 + n[1] * R, u[0] * L + n[0] * R, u[1] * L + n[1] * R) + "Z"; };
const zunge = (F, spitz, lang = 2) => bogen(F, 1, 0, 0, spitz) + "l" + J(-F.u[0] * F.R * lang, -F.u[1] * F.R * lang) + "l" + J(F.n[0] * F.R * 2, F.n[1] * F.R * 2) + "Z";

/* Reihen parallel zur Körperkontur: oben/unten = Polylinien von vorn nach hinten; v = 0 (oben) … 1 (unten).
   Liefert Federn {p, W, u, v} in Dachziegel-Reihenfolge (stromab zuerst). o: { v0, v1, dv, W(u, v), abstand, innen } */
function reihen(T, oben, unten, o) {
  const fs = [];
  let j = 0;
  for (let v = o.v0; v <= o.v1 + 1e-6; v += o.dv, j++) {
    const R = []; for (let i = 0; i <= 48; i++) { const u = i / 48; R.push(lerp(auf(oben, u), auf(unten, u), v)); }
    const cum = [0]; for (let i = 1; i < R.length; i++) cum.push(cum[i - 1] + Math.hypot(R[i][0] - R[i - 1][0], R[i][1] - R[i - 1][1]));
    let pos = (j % 2) * 0.5 * o.W(0, v) + T.rnd() * 0.2;
    while (pos < cum[cum.length - 1]) {
      let i = 1; while (i < cum.length - 1 && cum[i] < pos) i++;
      const t = (pos - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1), u = (i - 1 + t) / 48, p = lerp(R[i - 1], R[i], t);
      const W = o.W(u, v) * (0.85 + T.rnd() * 0.3);
      if (!o.innen || T.inPoly(p[0], p[1], o.innen)) fs.push({ p: [p[0] + (T.rnd() - 0.5) * W * 0.15, p[1] + (T.rnd() - 0.5) * W * 0.15], W, u, v });
      pos += W * (o.abstand || 0.9);
    }
  }
  return fs;
}
/* Federfluren als Licht und Schatten: je Feder ein Lichtsaum knapp innerhalb der Spitze und ein weicher Schatten
   knapp außerhalb (auf der Feder darunter). Keine Füllung, keine Umrisse. Nur in der Großansicht. */
function fluren(T, fs, o) {
  if (!T.fein) return "";
  let sa = "";
  for (const f of fs) {
    const F = spitze(f.p, o.winkel(f.p[0], f.p[1], f.u, f.v) + (T.rnd() - 0.5) * (o.streu || 8), f.W * (o.lang || 1.25), f.W);
    sa += bogen(F, 0.9, 0, 0, o.spitz);
  }
  /* derselbe Bogen zweimal: versetzt und breit als Schatten auf der Feder darunter, dann schmal als Lichtsaum */
  const id = T.id("fl" + (T._n = (T._n || 0) + 1)), v = o.versatz || [-0.12, 0.2];
  return `<use href="#${id}" transform="translate(${J(v[0], v[1])})" fill="none" stroke="${o.schatten[0]}" stroke-width="${B3(o.schatten[2])}" stroke-opacity="${B3(o.schatten[1])}"/>` +
    `<g stroke="${o.saum[0]}" stroke-width="${B3(o.saum[2])}" stroke-opacity="${B3(o.saum[1])}" fill="none" stroke-linecap="round"><path id="${id}" d="${sa}"/></g>`;
}
/* Abgesetzte Federn als Zungen (Decken, Schulterfedern): je Feder eine Fläche mit Verlauf (dunkler Ansatz → Farbe →
   heller Saum an der Spitze), weicher Schattensaum außen (paint-order), in Dachziegel-Reihenfolge. */
function zungen(T, fs, o) {
  const ux = Math.cos(rad(o.richtung || 180)), uy = Math.sin(rad(o.richtung || 180));
  const toene = o.toene.map((c, i) => T.fein ? T.lg(o.name + i, o.stops ? o.stops(c) : [[0, mische(c, "#000", o.dunkel || 0.12)], [0.55, c], [0.86, mische(c, o.saum, 0.25)], [1, mische(c, o.saum, o.saumT || 0.5)]],
    N(0.5 - ux * 0.5), N(0.5 - uy * 0.5), N(0.5 + ux * 0.5), N(0.5 + uy * 0.5)) : c);
  const sortiert = fs.slice().sort((a, b) => (b.p[0] * ux + b.p[1] * uy) - (a.p[0] * ux + a.p[1] * uy));
  let s = "";
  for (const f of sortiert) {
    const F = spitze(f.p, o.winkel(f.p[0], f.p[1], f.u, f.v) + (T.rnd() - 0.5) * (o.streu || 8), f.W * (o.lang || 1.3), f.W);
    const i = Math.floor(T.rnd() * toene.length);
    s += `<path d="${(o.blatt ? blatt : zunge)(F, o.spitz, o.zl || 2.2)}"${i ? ` fill="${toene[i]}"` : ""}/>`;
  }
  return `<g fill="${toene[0]}" stroke="${o.sc || "#000"}" stroke-width="${B3(o.sw || 0.3)}" stroke-opacity="${B3(o.sop || 0.18)}" paint-order="stroke" stroke-linejoin="round">${s}</g>`;
}

/* ---------- Auge ---------- */
/* Vogelauge (Seitenansicht): rund, ohne Augenwinkel; Lidring, Iris mit Fasern und dunklem Limbus, Pupille, Oberlid
   deckt den oberen Rand und wirft Schatten, Glanz zur Lichtquelle (links oben) und schwacher Gegenreflex, feuchter
   Unterlidrand; optional Augenhöhlen-Schatten und Augenring-Haut. */
function vogelauge(T, x, y, r, o = {}) {
  let s = "";
  if (o.haut) s += `<ellipse cx="${N(x)}" cy="${N(y)}" rx="${N(r * (o.hautR || 1.75))}" ry="${N(r * (o.hautR || 1.75) * 0.9)}" fill="${o.haut}"${o.hautOp ? ` opacity="${o.hautOp}"` : ""}/>`;
  if (o.hoehle) s += fleck(T, `M${J(x - r * 2.1, y)}a${J(r * 2.1, r * 1.9)} 0 1 0 ${J(r * 4.2, 0)}a${J(r * 2.1, r * 1.9)} 0 1 0 ${J(-r * 4.2, 0)}`, o.hoehle, o.hoehleOp || 0.16, r * 0.45);
  const R = r * (1 + (o.rb || 0.16));
  s += `<circle cx="${N(x)}" cy="${N(y)}" r="${N(R)}" fill="${o.ring || "#2a1a10"}"/>`;
  const g = T.rg("iris", [[0, o.iris0 || o.iris], [0.45, o.iris], [0.82, o.iris2], [0.93, o.limbus || "#120804"], [1, o.limbus || "#120804"]], 0.5, 0.5, 0.5);
  s += `<circle cx="${N(x)}" cy="${N(y)}" r="${N(r)}" fill="${g}"/>`;
  if (T.fein) {
    let fa = "";
    for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2 + T.rnd() * 0.15; fa += "M" + J(x + Math.cos(a) * r * 0.48, y + Math.sin(a) * r * 0.48) + "l" + J(Math.cos(a) * r * 0.38, Math.sin(a) * r * 0.38); }
    s += zug(fa, o.faser || o.iris2, r * 0.035, 0.35);
  }
  s += `<circle cx="${N(x + r * 0.03)}" cy="${N(y)}" r="${N(r * (o.pupille || 0.42))}" fill="#040302"/>`;
  const ob = o.ober || 0.14, yc = y - R + 2 * R * ob, c = Math.sqrt(Math.max(0, R * R - (yc - y) ** 2));
  const yc2 = yc + r * 0.24, c2 = Math.sqrt(Math.max(0, r * r - (yc2 - y) ** 2));
  s += `<path d="M${J(x - c2, yc2)}A${J(r, r)} 0 0 1 ${J(x + c2, yc2)}A${J(R * 1.5, R * 1.5)} 0 0 1 ${J(x - c2, yc2)}Z" fill="#000" opacity=".3"/>`;
  s += `<path d="M${J(x - c, yc)}A${J(R, R)} 0 0 1 ${J(x + c, yc)}A${J(R * 1.6, R * 1.6)} 0 0 1 ${J(x - c, yc)}Z" fill="${o.deckel || o.ring || "#2a1a10"}"/>`;
  s += `<ellipse cx="${N(x - r * 0.3)}" cy="${N(y - r * 0.28)}" rx="${N(r * 0.2)}" ry="${N(r * 0.15)}" fill="#fff" opacity=".92"/>`;
  s += `<circle cx="${N(x + r * 0.36)}" cy="${N(y + r * 0.4)}" r="${N(r * 0.09)}" fill="#fff" opacity=".35"/>`;
  if (T.fein) s += zug(`M${J(x - R * 0.6, y + R * 0.75)}Q${J(x, y + R * 1.02, x + R * 0.6, y + R * 0.75)}`, "#fff", r * 0.05, 0.25);
  return s;
}

/* ---------- Beine ---------- */
/* Vogellauf (Huhn, Pute): Fersengelenk als Verdickung, Gürtelschuppen vorn (Platten mit heller Oberkante, dunkler
   Fuge), Netzschuppen hinten, drei Vorderzehen gefächert (die äußere zum Betrachter, die innere halb verdeckt), Hinter-
   zehe am Boden, Zehen mit Gelenkwülsten, Ballen und Querschildern, kegelige gebogene Krallen, Sporn hinten-innen.
   o: { H: Ferse, A: Fußwurzel, w0, w1, hell, mittel, dunkel, kralle, sporn (Länge), k (Fußgröße), fern,
        zehen: [hinten, innen, außen, mitte] (cm), schatten (oberer Anteil verschattet) } */
function lauf(T, o0) {
  const dn = o0.dn || 0.26;
  const o = o0.fern ? Object.assign({}, o0, { hell: mische(o0.hell, "#000", dn), mittel: mische(o0.mittel, "#000", dn), dunkel: mische(o0.dunkel, "#000", dn), kralle: mische(o0.kralle, "#000", 0.2) }) : o0;
  const { H, A, w0, w1, k = 1, fern } = o, F = T.fein;
  const dx = A[0] - H[0], dy = A[1] - H[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, nx = uy, ny = -ux;   // n zeigt nach vorn
  const Z = o.zehen || [2.2, 3.6, 4.4, 5.4];
  const sf = fern ? "F" : "";
  const g = F ? T.lg("lauf" + sf, [[0, o.mittel], [0.3, o.hell], [0.62, o.mittel], [1, o.dunkel]], 0, 0, 1, 0) : o.mittel, gz = F ? (fern ? g : T.lg("zeh", [[0, o.hell], [0.55, o.mittel], [1, o.dunkel]])) : o.mittel;
  const B = [A[0] + nx * w1 * 0.1, A[1] + 0.2 * k];
  let s = "";
  /* Zehe: Röhre mit Gelenkwülsten oben, Ballen unten, Querschilder, Kralle */
  const zeh = (ende, w, glieder, farbe, hinten, boden = true) => {
    const ex = ende[0] - B[0], ey = ende[1] - B[1], el = Math.hypot(ex, ey), zx = ex / el, zy = ey / el, mx = zy, my = -zx;   // m zeigt nach oben
    const ob = [], un = [];
    for (let i = 0; i <= glieder; i++) {
      const t = i / glieder, c = [B[0] + ex * t, B[1] + ey * t], ww = w * (1 - t * 0.35);
      ob.push([c[0] + mx * ww * (i > 0 && i < glieder ? 0.56 : 0.5), c[1] + my * ww * (i > 0 && i < glieder ? 0.56 : 0.5)]);
      if (i < glieder) { const t2 = (i + 0.5) / glieder, c2 = [B[0] + ex * t2, B[1] + ey * t2], w2 = w * (1 - t2 * 0.35); ob.push([c2[0] + mx * w2 * 0.47, c2[1] + my * w2 * 0.47]); un.push([c2[0] - mx * w2 * 0.58, c2[1] - my * w2 * 0.58]); }
      un.push([c[0] - mx * ww * 0.46, c[1] - my * ww * 0.46]);
    }
    const tip = [ende[0] + zx * w * 0.32, ende[1] + zy * w * 0.32];
    let z = `<path d="${G([...ob, tip, ...un.reverse()])}" fill="${farbe}"/>`;
    /* Kralle: Kegel, nach unten gebogen, Spitze am Boden */
    const kl = w * (hinten ? 1.1 : 1.2), kx = ende[0] + zx * w * 0.12, ky = ende[1] + zy * w * 0.12;
    const kp = [kx + zx * kl, boden ? -0.02 : ky + zy * kl + w * 0.4];
    z += `<path d="M${J(kx + mx * w * 0.3, ky + my * w * 0.3)}Q${J(kx + zx * kl * 0.8 + mx * w * 0.22, ky + zy * kl * 0.8 + my * w * 0.22, kp[0], kp[1])}Q${J(kx + zx * kl * 0.45 - mx * w * 0.05, ky + zy * kl * 0.45 - my * w * 0.05, kx - mx * w * 0.3, ky - my * w * 0.3)}Z" fill="${o.kralle}"/>`;
    if (F) {
      let ri = "";
      const nR = Math.round(el / (0.5 * k));
      for (let i = 1; i < nR; i++) { const t = i / nR, c = [B[0] + ex * t, B[1] + ey * t], ww = w * (1 - t * 0.35) * 0.5; ri += "M" + J(c[0] + mx * ww, c[1] + my * ww) + "q" + J(zx * ww * 0.3 - mx * ww * 0.5, zy * ww * 0.3 - my * ww * 0.5, -mx * ww * 0.95, -my * ww * 0.95); }
      if (!fern) z += zug(ri, o.dunkel, 0.04 * k, 0.45);
      if (!fern) z += zug(`M${J(kx + mx * w * 0.14 + zx * kl * 0.15, ky + my * w * 0.14 + zy * kl * 0.15)}Q${J(kx + zx * kl * 0.7 + mx * w * 0.1, ky + zy * kl * 0.7 + my * w * 0.1, kp[0] - zx * w * 0.25, kp[1] - w * 0.18)}`, "#fff", 0.05 * k, 0.5);
      if (boden) z += zug(`M${J(B[0] + ex * 0.25, -0.04)}L${J(kp[0], -0.03)}`, "#000", w * 0.3, 0.3, ` filter="${weich(T, 0.1)}"`);
    }
    return z;
  };
  const zb = -0.3 * k;
  s += zeh([B[0] - Z[0] * k, zb + 0.06 * k], 0.72 * k, 2, o.dunkel, true);                         // Hinterzehe (Hallux), am Boden
  s += zeh([B[0] + Z[1] * k, zb - 0.42 * k], 0.74 * k, 3, mische(o.dunkel, "#000", 0.12), false, false);   // innere Zehe, weiter weg, halb verdeckt
  /* Lauf mit Fersengelenk */
  const P = (t, f) => [H[0] + dx * t + nx * f, H[1] + dy * t + ny * f];
  const vorn = [P(-0.03, w0 * 0.62), P(0.1, w0 * 0.5), P(0.5, (w0 + w1) * 0.25), P(0.93, w1 * 0.5), [A[0] + nx * w1 * 0.62 + ux * 0.35 * k, A[1] + uy * 0.35 * k]];
  const hinten = [[A[0] - nx * w1 * 0.55 + ux * 0.3 * k, A[1] + uy * 0.3 * k], P(0.93, -w1 * 0.5), P(0.5, -(w0 + w1) * 0.25), P(0.12, -w0 * 0.52), P(-0.03, -w0 * 0.6), P(-0.09, 0)];
  const lp = G([...vorn, ...hinten]);
  s += `<path d="${lp}" fill="${g}"/>`;
  if (F) {
    /* Gürtelschuppen vorn: Platten über ~60 % der Breite, Fuge dunkel, Oberkante hell; Grenze zur Netzschuppen-Seite */
    let fu = "", ka = "", ne = "";
    const nP = Math.round(l / (0.95 * k));
    for (let i = 1; i < nP; i++) {
      const t = i / nP, w = (w0 + (w1 - w0) * t) / 2, a = P(t, w * 0.98), b = P(t + 0.012, -w * 0.15);
      fu += "M" + J(a[0], a[1]) + "Q" + J((a[0] + b[0]) / 2 + ux * 0.18 * k, (a[1] + b[1]) / 2 + uy * 0.18 * k, b[0], b[1]);
      const a2 = P(t + 0.02, w * 0.9), b2 = P(t + 0.03, -w * 0.08);
      ka += "M" + J(a2[0], a2[1]) + "Q" + J((a2[0] + b2[0]) / 2 + ux * 0.16 * k, (a2[1] + b2[1]) / 2 + uy * 0.16 * k, b2[0], b2[1]);
    }
    const g0 = P(0.08, -w0 * 0.18), g1 = P(0.98, -w1 * 0.18);
    fu += "M" + J(g0[0], g0[1]) + "L" + J(g1[0], g1[1]);
    /* Netzschuppen hinten: kleine Sechsecke, schwacher Kontrast */
    const nN = Math.round(l / (0.7 * k));
    for (let i = 0; i < (fern ? 0 : nN); i++) for (const q of [-0.6]) {
      const t = (i + 0.5 + (q < -0.5 ? 0.5 : 0)) / nN; if (t > 0.97) continue;
      const w = (w0 + (w1 - w0) * t) / 2, c = P(t, w * q), r = 0.17 * k;
      ne += "M" + J(c[0] - r, c[1]) + "l" + J(r * 0.5, -r * 0.85) + "h" + N(r) + "l" + J(r * 0.5, r * 0.85) + "l" + J(-r * 0.5, r * 0.85) + "h" + N(-r) + "Z";
    }
    s += zug(ne, o.dunkel, 0.035 * k, 0.25) + zug(fu, o.dunkel, 0.08 * k, fern ? 0.45 : 0.7) + (fern ? "" : zug(ka, "#fff", 0.06 * k, 0.4));
    if (!fern) s += zug("M" + J(...P(0.12, -w0 * 0.3)) + "L" + J(...P(0.92, -w1 * 0.28)), "#fff", 0.12 * k, 0.25);
  }
  /* oberer Teil des Laufs im Schatten des Körpers */
  if (o.schatten) s += `<path d="${lp}" fill="${T.lg("laufS", [[0, "#000", 0.4], [o.schatten, "#000", 0], [1, "#000", 0]])}"/>`;
  if (o.sporn) {
    /* Sporn: hinten-innen, ~28 % über dem Fuß, kegelig, nach hinten und leicht nach oben gebogen */
    const t = 0.72, w = (w0 + (w1 - w0) * t) / 2, sb = P(t, -w * 0.82), sl = o.sporn, d0 = w * 0.42;
    const sp = [sb[0] - sl * 0.95, sb[1] - sl * 0.4];
    s += `<path d="M${J(sb[0] + 0.1 * k, sb[1] - d0)}Q${J(sb[0] - sl * 0.5, sb[1] - d0 * 0.9, sp[0], sp[1])}Q${J(sb[0] - sl * 0.45, sb[1] + d0 * 0.5, sb[0] + 0.1 * k, sb[1] + d0)}Z" fill="${F && !fern ? T.lg("sporn", [[0, "#efe0b8"], [0.5, "#bea06a"], [1, "#6a5434"]]) : mische("#a08a5a", "#000", fern ? dn : 0)}"/>`;
    if (F) s += zug("M" + J(sb[0] - sl * 0.1, sb[1] - d0 * 0.55) + "Q" + J(sb[0] - sl * 0.55, sb[1] - d0 * 0.6, sp[0] + 0.25 * k, sp[1] + 0.06 * k), "#fff", 0.07 * k, fern ? 0.3 : 0.6);
  }
  s += zeh([B[0] + Z[2] * k, zb + 0.12 * k], 0.84 * k, 3, gz);   // äußere Zehe (zum Betrachter)
  s += zeh([B[0] + Z[3] * k, zb - 0.1 * k], 0.88 * k, 4, gz);  // Mittelzehe
  return s;
}

/* Schwimmfuß (Ente, Gans) leicht von oben: kurzer, seitlich abgeflachter Lauf mit Querplättchen, drei gefächerte
   Vorderzehen mit Gelenkwülsten, gespannte, durchscheinende Schwimmhaut mit eingebuchtetem Rand, kurze dunkle Krallen,
   kleine hoch angesetzte Hinterzehe. o: { H, A, w0, w1, L (Mittelzehe), hell, mittel, dunkel, haut, kralle, fern, schatten } */
function schwimmfuss(T, o0) {
  const dn = 0.24;
  const o = o0.fern ? Object.assign({}, o0, { hell: mische(o0.hell, "#000", dn), mittel: mische(o0.mittel, "#000", dn), dunkel: mische(o0.dunkel, "#000", dn), haut: mische(o0.haut || o0.mittel, "#000", dn) }) : o0;
  const { H, A, w0, w1, L } = o, F = T.fein, sf = o0.fern ? "F" : "";
  const dx = A[0] - H[0], dy = A[1] - H[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, nx = uy, ny = -ux;
  const B = [A[0] + 0.1 * L, A[1] + 0.05 * L];
  /* Zehenspitzen: innen (weiter weg, höher, kürzer), Mitte, außen (zum Betrachter, tiefer) */
  const zi = [B[0] + L * 0.74, -L * 0.2], zm = [B[0] + L, -L * 0.1], za = [B[0] + L * 0.82, -L * 0.02];
  let s = "";
  s += zug("M" + J(H[0] + dx * 0.88 - nx * w1 * 0.45, H[1] + dy * 0.88) + "q" + J(-L * 0.12, L * 0.03, -L * 0.2, L * 0.1), o.dunkel, L * 0.07, 1);   // Hinterzehe
  const P = (t, f) => [H[0] + dx * t + nx * f, H[1] + dy * t + ny * f];
  const lp = G([P(-0.04, w0 * 0.5), P(0.5, (w0 + w1) * 0.25), P(0.95, w1 * 0.5), [B[0] + L * 0.12, B[1] - L * 0.04], [B[0] - L * 0.04, B[1] + L * 0.04], P(0.95, -w1 * 0.5), P(0.5, -(w0 + w1) * 0.25), P(-0.04, -w0 * 0.5), P(-0.1, 0)]);
  const g = F ? T.lg("slauf" + sf, [[0, o.hell], [0.35, o.mittel], [1, o.dunkel]], 0, 0, 1, 0) : o.mittel;
  s += `<path d="${lp}" fill="${g}"/>`;
  if (F) {
    let q = "";
    const n = Math.round(l / (w1 * 0.5));
    for (let i = 1; i < n; i++) { const t = i / n, w = (w0 + (w1 - w0) * t) / 2, a = P(t, w * 0.95), b = P(t + 0.02, -w * 0.9); q += "M" + J(a[0], a[1]) + "Q" + J((a[0] + b[0]) / 2 + ux * w * 0.25, (a[1] + b[1]) / 2 + uy * w * 0.25, b[0], b[1]); }
    s += zug(q, o.dunkel, w1 * 0.045, 0.3);
  }
  if (o.schatten) s += `<path d="${lp}" fill="${T.lg("slaufS", [[0, "#000", 0.38], [o.schatten, "#000", 0], [1, "#000", 0]])}"/>`;
  /* Schwimmhaut */
  const ein = (p, q2) => [p[0] + (q2[0] - p[0]) * 0.5 - L * 0.14, p[1] + (q2[1] - p[1]) * 0.5 + L * 0.01];
  const haut = [[B[0] - L * 0.02, B[1] - L * 0.06], zi, ein(zi, zm), zm, ein(zm, za), za, [B[0] + L * 0.3, -0.01], [B[0] - L * 0.04, B[1] + L * 0.02]];
  s += `<path d="${G(haut)}" fill="${F ? T.lg("haut" + sf, [[0, o.mittel], [0.6, o.haut || o.mittel], [1, o.hell]], 0, 0, 1, 0.3) : (o.haut || o.mittel)}"${F ? ` opacity=".93"` : ""}/>`;
  /* Zehen als Wülste mit Gelenken */
  let ze = "";
  for (const z of [zi, zm, za]) { const m = lerp(B, z, 0.5); ze += "M" + J(B[0], B[1] - L * 0.03) + "Q" + J(m[0], m[1] - L * 0.04, z[0], z[1]); }
  s += zug(ze, o.dunkel, L * 0.085, 0.45) + zug(ze, o.mittel, L * 0.06, 1);
  if (F) {
    s += zug(ze, o.hell, L * 0.018, 0.6, ` transform="translate(0 ${N(-L * 0.012)})"`);
    let q = "";
    for (const z of [zm, za, zi]) for (let i = 1; i < 4; i++) { const t = i / 4, p = lerp(B, z, t); q += "M" + J(p[0] - L * 0.005, p[1] - L * 0.035 - L * 0.04 * 4 * t * (1 - t) * 0.5) + "l" + J(L * 0.012, L * 0.06); }
    s += zug(q, o.dunkel, L * 0.012, 0.55);
    s += zug(`M${J(B[0] + L * 0.15, -0.03)}L${J(za[0] + L * 0.05, -0.03)}`, "#000", L * 0.05, 0.35, ` filter="${weich(T, 0.1)}"`);
  }
  let kr = "";
  for (const z of [zi, zm, za]) kr += "M" + J(z[0] - L * 0.02, z[1] - L * 0.015) + "q" + J(L * 0.05, -L * 0.005, L * 0.07, L * 0.03);
  s += zug(kr, o.kralle, L * 0.035, 1);
  return s;
}

/* Einfachkamm: Blatt mit runden Zacken (spitzen: [[x, y, w], …] von vorn nach hinten), Tal-Tiefe tal */
function kammPfad(vorn, spitzen, tal, hinten) {
  const p = [...vorn];
  spitzen.forEach(([x, y, w = 0.5], i, A) => {
    p.push([x + w, y + w * 1.6], [x + w * 0.35, y + w * 0.1], [x - w * 0.35, y + w * 0.1], [x - w, y + w * 1.6]);
    if (i < A.length - 1) p.push([(x + A[i + 1][0]) / 2, tal < 0 ? tal : Math.max(y, A[i + 1][1]) + tal]);   // tal < 0: Talgrund absolut
  });
  return G([...p, ...hinten]);
}
/* Daunen/Flaum: Büschel aus 4–7 Strähnen, die zur Spitze zusammenlaufen. pts = Fläche (ungeglättet), winkel(x, y) */
function bueschel(T, pts, n, laenge, winkel, farben, o = {}) {
  const [x0, y0, x1, y1] = box(pts);
  const eimer = farben.map(() => "");
  let gemacht = 0, vers = 0;
  const m = Math.round(n * (T.fein ? 1 : (o.szene || 0)));
  while (gemacht < m && vers++ < m * 20) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!T.inPoly(x, y, pts)) continue;
    const a = rad(winkel(x, y) + (T.rnd() - 0.5) * (o.streu || 24)), L = laenge * (0.6 + T.rnd() * 0.8), ex = x + Math.cos(a) * L, ey = y + Math.sin(a) * L;
    const nx = -Math.sin(a), ny = Math.cos(a), k = 4 + Math.floor(T.rnd() * 3), fi = gemacht % farben.length, br = L * (o.breit || 0.45), kr = (T.rnd() - 0.5) * L * 0.5;
    for (let i = 0; i < k; i++) {
      const q = (i / (k - 1) - 0.5) * br, sx = x + nx * q - Math.cos(a) * L * 0.1 * Math.abs(q / br), sy = y + ny * q - Math.sin(a) * L * 0.1 * Math.abs(q / br);
      eimer[fi] += "M" + J(sx, sy) + "q" + J((ex - sx) * 0.5 + nx * (kr + q * 0.2), (ey - sy) * 0.5 + ny * (kr + q * 0.2), ex - sx + nx * q * 0.12, ey - sy + ny * q * 0.12);
    }
    gemacht++;
  }
  return eimer.map((d, i) => zug(d, farben[i][0], farben[i][1], farben[i][2])).join("");
}
/* Schwarz mit grünem Metallglanz (Hahn) */
const gruenSchwarz = (T) => T.lg("gs", [[0, "#0e1311"], [0.45, "#141d19"], [0.6, "#0e1412"], [1, "#060707"]], 0, 0, 1, 1);
/* Flaumkante: feine, gebogene Daunenstrahlen quer über den Umriss (innen beginnend, außen auslaufend), damit die
   Silhouette weich statt scharf wirkt. pts = Umriss (ungeglättet, geschlossen), mitte = Bezugspunkt für „außen". */
function randflaum(T, pts, mitte, n, L, farben, zu = true, wahl = null) {
  if (!T.fein) return "";
  const seg = []; let Lg = 0;
  for (let i = 0; i < pts.length - (zu ? 0 : 1); i++) { const a = pts[i], b = pts[(i + 1) % pts.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); seg.push([a, b, Lg, l]); Lg += l; }
  const eimer = farben.map(() => "");
  for (let i = 0; i < n; i++) {
    const t = (i + T.rnd()) / n * Lg, sg = seg.find((g) => t >= g[2] && t <= g[2] + g[3]) || seg[seg.length - 1];
    const p = lerp(sg[0], sg[1], (t - sg[2]) / (sg[3] || 1));
    let nx = sg[1][1] - sg[0][1], ny = -(sg[1][0] - sg[0][0]); const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
    if (nx * (p[0] - mitte[0]) + ny * (p[1] - mitte[1]) < 0) { nx = -nx; ny = -ny; }
    const w = (T.rnd() - 0.5) * 1.1, ux = nx * Math.cos(w) - ny * Math.sin(w), uy = nx * Math.sin(w) + ny * Math.cos(w), l = L * (0.5 + T.rnd() * 0.9);
    const sx = p[0] - ux * l * 0.55, sy = p[1] - uy * l * 0.55, k = (T.rnd() - 0.5) * l * 0.7;
    eimer[wahl ? wahl(p, i) : i % farben.length] += "M" + J(sx, sy) + "q" + J(ux * l * 0.5 - uy * k, uy * l * 0.5 + ux * k, ux * l, uy * l);
  }
  return eimer.map((d, i) => zug(d, farben[i][0], farben[i][1], farben[i][2])).join("");
}

module.exports = [
  /* ------------------------------------------------------------------ HAHN */
  { id: "hahn", de: "der Hahn", syl: "HAHN", it: "il gallo", itSyl: "GAL-lo", en: "rooster",
    gruppe: "Vögel", lebensraum: "Bauernhof", laenge: 0.617, hoehe: 0.583,
    /* RECHERCHE: goldhalsiger Haushahn (Bankiva-Typ) – 60–65 cm von Schnabel bis Sichelspitze, 55–60 cm hoch bis
       Kammspitze, 1,5–3 kg. Gefiederzonen nach Standard: Kopf und Halsbehang orange-gold, lange schmale spitze
       Lanzettfedern (Länge : Breite 8–12 : 1), in der unteren Hälfte mit feinem schwarzem Schaftstrich; Sattelbehang
       ebenso, rotorange, kaskadenartig über Flügelende und Schwanzwurzel; Schulter und Flügeldecken dunkel rotbraun,
       Flügelbinde (große Armdecken, 2 Reihen) schwarz mit grünem Glanz, Flügeldreieck (Außenfahnen der Armschwingen)
       kastanienbraun, Handschwingen schwarz mit braunem Saum; Brust, Bauch, Schenkel schwarz, Glanz nur im Licht;
       14 Steuerfedern, darüber 2 große und 4–6 kleine Sicheln, schwarz mit grün-violettem Metallglanz. Einfachkamm mit
       5 tief eingeschnittenen Zacken (≈ halbe Kammhöhe), Fahne folgt der Nackenlinie; paarige Kehllappen am
       Unterkiefer; Ohrscheibe flaches Oval unter der Ohröffnung, darüber Ohrfedern; Auge mit orangeroter Iris und
       fleischigem rotem Lidrand; Schnabel hornfarben, kurzer Haken (≤ 8 %), Nasenloch als Schlitz an der Wurzel mit
       Hautdeckel. Lauf gelb, vorn große Gürtelschuppen (Scuta), seitlich/hinten Netzschuppen, Sporn hinten-innen im
       unteren Drittel, kegelig nach hinten-oben gebogen; vier Zehen (3 vorn, Hallux hinten am Boden), Mittelzehe
       ≈ 55–60 % der Lauflänge. Quellen: extension.org „External anatomy of chickens", mypetchicken.com „hackles,
       sickles, saddles", Rassestandard „goldhalsig", Kritik Runde 1. */
    zeichne(T) {
      Q = 10;
      const F = T.fein;
      let s = "", K;
      const BEIN = { hell: "#f8da7c", mittel: "#e4b040", dunkel: "#9a6a1c", kralle: "#6b5a3e", k: 1, zehen: [2, 3.4, 4.2, 5], schatten: 0.36 };
      /* fernes Bein (Ton des nahen, 26 % dunkler, Details bleiben) */
      s += vol(T, "k", lauf(T, Object.assign({}, BEIN, { H: [-4.6, -12.4], A: [-2.6, -1], w0: 1.75, w1: 1.42, fern: true, sporn: 2 })));
      /* Steuerfedern und ferne Sicheln (hinter dem Rumpf) */
      const schwarz = T.lg("schwarz", [[0, "#161b19"], [1, "#0a0c0b"]]), glanz = ["#2f6b4f", 0.38];
      K = sammler();
      for (const t of [[-25, -50.5], [-27.6, -48.2], [-29.6, -45.4], [-31, -42.2], [-31.6, -38.8]])
        langfeder(T, [[-15.6, -34.5], lerp([-15.6, -34.5], t, 0.5), t], 2.5, 2.3, schwarz, { rund: true, schaft: "#3a4a44", glanz: ["#24483a", 0.3] }, K);
      const sichelF = T.lg("sichelF", [[0, "#0a0d0c"], [0.5, "#101614"], [1, "#070908"]], 0, 0, 1, 1);
      for (const [p, w] of [[[[-15, -38], [-18.6, -48.4], [-24, -53.2], [-30, -51.8], [-33.6, -45], [-34.8, -37.4], [-34.2, -31]], 1.9], [[[-16, -36.4], [-21.4, -45.6], [-27, -47.8], [-31, -43.2], [-32.2, -35.6], [-31.6, -28.6]], 1.7]])
        langfeder(T, p, w, 0.8, sichelF, { rund: true, schaft: "#2a3a34", glanz: ["#1f4a3a", 0.3] }, K);
      s += vol(T, "a", K.aus("#000", 0.16, 0.25));
      if (!F) s += `<path d="${G([[-15, -38], [-24, -53], [-33, -50], [-36.5, -38], [-33.5, -26], [-24, -21], [-17, -30]])}" fill="#101614" opacity=".6"/>`;
      /* Rumpf: schwarz, als Ei nach hinten unten geneigt; Glanz nur oben vorn an der Brust */
      const rumpf = [[18.8, -32.6], [18.2, -27.8], [15.6, -23.4], [10.6, -20.2], [4, -18.9], [-3, -19.2], [-9.4, -21], [-14, -24.6], [-17, -29.8], [-16.6, -34.8], [-12.4, -38.4], [-4, -40.2], [5, -40.6], [12, -39.6], [16, -37]];
      const oben = [[17.6, -36], [9, -37.6], [0, -37.4], [-9, -36.4], [-16.4, -32]], unten = [[18.6, -30.6], [15, -22.6], [5, -19.2], [-5, -19.6], [-13.4, -23.8]];
      const fsR = reihen(T, oben, unten, { v0: 0.05, v1: 1, dv: 0.11, W: (u, v) => 1.9 + 1.2 * Math.min(1, u * 2.2) - 0.4 * v, abstand: 0.95 });
      s += vol(T, "d", teil(T, rumpf, T.lg("rumpf", [[0, "#1d2420"], [0.6, "#121614"], [1, "#0b0d0c"]]),
        `<ellipse cx="13.6" cy="-32" rx="5.6" ry="4.6" fill="${T.rg("brustGlanz", [[0, "#2e5a46", 0.55], [0.6, "#2e5a46", 0.18], [1, "#2e5a46", 0]])}"/>` +
        fluren(T, fsR, { winkel: (x, y, u, v) => 96 + 62 * Math.min(1, u * 1.6) - 18 * v, saum: [T.lg("saumR", [[0, "#5a8a74", 0.4], [0.55, "#3e6a58", 0.18], [1, "#2a3a34", 0]], 0, 0, 0.3, 1), 1, 0.12], schatten: ["#000", 0.3, 0.4] }) +
        bueschel(T, [[12, -23.4], [4, -19.6], [-6, -20], [-12.6, -23.4], [-9, -22.6], [0, -21.6], [8, -22.6]], 10, 0.8, (x) => 110 + (x < 0 ? 30 : 0), [["#2c3430", 0.05, 0.6], ["#000", 0.05, 0.5]]), { licht: LICHT(T, 0.6) }) +
      /* Flaumkante am Bauch statt glatter Linie */
        bueschel(T, [[13.6, -22.4], [10, -20.2], [3, -18.7], [-4, -19], [-10, -21], [-13.6, -24.2], [-12.6, -24.6], [-4, -20.4], [4, -20], [12, -22.8]], 10, 0.6, (x, y) => 100 + (x < -4 ? 30 : 0), [["#0f1311", 0.07, 0.9], ["#1c2420", 0.06, 0.8]]));
      /* nahes Bein, darüber der befiederte Schenkel (Keule, schräg nach vorn unten), die Ferse darunter sichtbar */
      s += vol(T, "k", lauf(T, Object.assign({}, BEIN, { H: [1, -12.4], A: [3.2, -1], w0: 1.8, w1: 1.45, sporn: 2.5 })));
      const hose = [[-6.2, -24.6], [4.6, -25.4], [5.2, -21], [4.4, -17.6], [3.2, -15.4], [2.2, -14.4], [1, -14.7], [-0.2, -14.2], [-1.4, -15], [-2.8, -17], [-4.8, -20.2]];
      const fsH = reihen(T, [[4.6, -24], [-5.6, -23]], [[2.6, -14.4], [-1.4, -14.4]], { v0: 0.05, v1: 1, dv: 0.18, W: () => 1.45 });
      s += fleck(T, [[-6, -26], [4, -27], [5, -24], [-5, -23.6]], "#000", 0.45, 0.6);
      s += vol(T, "b", teil(T, hose, T.lg("hose", [[0, "#151a18"], [1, "#0a0c0b"]]),
        fluren(T, fsH, { winkel: (x) => 96 - x * 1.5, saum: ["#4a7462", 0.3, 0.11], schatten: ["#000", 0.45, 0.35] }) +
        `<ellipse cx="-0.8" cy="-20.6" rx="2.2" ry="5" transform="rotate(-14 -.8 -20.6)" fill="${T.rg("hoseL", [[0, "#4e7a68", 0.3], [1, "#3e6a58", 0]])}"/>`,
        { licht: T.lg("hoseV", [[0, "#000", 0], [0.5, "#000", 0.08], [1, "#000", 0.3]]) }) + bueschel(T, [[4.2, -17.2], [2.8, -15], [1, -14.3], [-0.4, -14.1], [-1.8, -15.2], [-3, -17], [-1.4, -16], [1, -15.6], [3, -16.2]], 8, 0.6, () => 92, [["#0f1311", 0.07, 0.9], ["#22302a", 0.06, 0.8]]));
      /* Flügel: Bug und kleine Decken dunkel rotbraun, Flügelbinde (2 Reihen) schwarz-grün, Flügeldreieck kastanienbraun,
         Handschwingen schwarz mit braunem Saum; wirft einen Schatten auf die Flanke */
      const flug = [[10.8, -35.6], [9.8, -29.8], [5.8, -25.8], [-1.6, -24.2], [-9.6, -24], [-14.4, -25.6], [-11.8, -28.8], [-5, -32.8], [2.6, -36.2], [7.6, -37.4]];
      s += fleck(T, [[9.6, -28], [5.6, -24.6], [-1.6, -23], [-10, -22.8], [-14, -24.4], [-10, -23.4], [-1.4, -24.8], [5.8, -26.4]], "#000", 0.7, 0.45);
      let fi = "";
      K = sammler();
      for (let i = 0; i < (F ? 4 : 2); i++) langfeder(T, [[-2 - i * 2, -27.6 + i * 0.3], [-9 - i * 1.6, -26.2 + i * 0.2], [-14.4 - i * 0.6, -25.2]], 2.1, 1.5, "#141716", { rund: true, schaft: "#4a4a44", kante: "#7a4a24", kanteOp: 0.7, kw: 0.2 }, K);
      fi += K.aus("#000", 0.3, 0.2);
      K = sammler();
      const nA = F ? 8 : 4;
      for (let i = 0; i < nA; i++) {
        const x = 8.6 - i * 14 / nA, w = 1.9 * 8 / nA * (F ? 1 : 0.9);
        langfeder(T, [[x + 0.8, -29.6], [x - 1.6, -27.2], [x - 4.4, -25], [x - 6.2, -24.2]], w, w * 0.9, T.lg("dreieck", [[0, "#b8743a"], [0.5, "#a0612a"], [1, "#6a3410"]], 1, 0, 0, 1),
          { rund: true, schaft: "#4a1e08", schaftOp: 0.4, kante: "#e0a060", kanteOp: 0.35, aussen: 0.3 }, K);
      }
      fi += K.aus("#2a0e04", 0.3, 0.3);
      /* Flügelbinde: große Armdecken in zwei Reihen, schwarz mit grünem Glanz, schmal */
      K = sammler();
      const nD = F ? 8 : 4;
      for (const [y0, dy] of [[-31.6, 0], [-30.4, 0.9]]) for (let i = 0; i < nD; i++) {
        const x = 9.4 - i * 18 / nD - (dy ? 1.1 : 0), w = 2.6 * 8 / nD;
        langfeder(T, [[x + 0.6, y0 - 1 + i * 0.1], [x - 0.6, y0 + 0.4 + i * 0.12], [x - 1.4, y0 + 1.2 + i * 0.14]], w, w * 0.9, gruenSchwarz(T), { rund: true, glanz: ["#3a7e60", 0.45] }, K);
      }
      fi += K.aus("#000", 0.3, 0.3);
      /* Bug und kleine/mittlere Decken: dachziegelartige Reihen, dunkel rotbraun */
      const fsB = reihen(T, [[10.8, -37.6], [3, -37.8], [-5, -36.2]], [[10.2, -32], [2, -31.6], [-8, -33.4]], { v0: 0, v1: 1, dv: F ? 0.24 : 0.4, W: (u, v) => (1.2 + v * 0.35) * (F ? 1 : 1.6) });
      fi += `<path d="${G([[10.8, -37.6], [10.4, -31.6], [3, -31], [-5, -32.2], [-8.4, -33.8], [-5, -36.6], [3, -38]])}" fill="${T.lg("bug", [[0, "#b5481c"], [0.6, "#8e2a12"], [1, "#6a1e0c"]], 0, 0, 0.3, 1)}"/>` +
        fluren(T, fsB, { winkel: () => 160, saum: ["#e07a4a", 0.32, 0.1], schatten: ["#2a0602", 0.24, 0.3], lang: 1.4 });
      s += vol(T, "c", teil(T, flug, "#5a1c0c", fi, { licht: LICHT(T, 0.8) }));
      /* kleine Sicheln (unregelmäßig gestaffelt) und die zwei großen Hauptsicheln, schwarz mit grün-violettem Glanz */
      const sichel = gruenSchwarz(T);
      K = sammler();
      const kleine = [[[[-17.2, -30], [-20.2, -29.8], [-22.4, -25.6], [-22, -21.4]], 1.1], [[[-17, -31.6], [-21, -32.4], [-24.4, -28], [-24.6, -22]], 1.2], [[[-16.8, -33.2], [-22, -35.8], [-26.4, -32.4], [-27.6, -25.4]], 1.3],
        [[[-16.6, -35], [-22.6, -40.6], [-28, -39], [-30.6, -32.4], [-30.4, -25.6]], 1.4], [[[-16.4, -36.4], [-23.4, -44], [-29.4, -43.4], [-32.4, -36.6], [-32.6, -29]], 1.45]];
      for (const [p, w] of (F ? kleine : kleine.filter((x, i) => i % 2))) langfeder(T, p, w * (F ? 1 : 1.3), 0.4, sichel, { rund: true, glanz: glanz }, K);
      for (const [p, w] of [[[[-15.2, -37.6], [-20, -47.4], [-26, -50.6], [-31.6, -47.6], [-34, -40.2], [-34, -33.4]], 2.1], [[[-14.6, -39], [-18.4, -49.6], [-24.6, -54.6], [-31.4, -53], [-35.6, -46], [-37, -38], [-36.4, -31.6]], 2.3]])
        langfeder(T, p, w, 0.7, sichel, { rund: true, schaft: "#3a5a4c", glanz: glanz, kante: "#4a3e7a", kanteOp: 0.35 }, K);
      s += vol(T, "a", K.aus("#000", 0.16, 0.3));
      /* Sattelbehang: lange schmale Federn (10 : 1) vom unteren Rücken über Flügelende und Schwanzwurzel */
      const satRand = [[3.6, -40.4], [-2.4, -41.3], [-8.4, -40.8], [-13.2, -38.8], [-15.6, -36.4]], satSpitze = [[-1.2, -30.8], [-6.6, -27.8], [-11.8, -27.2], [-16, -29.2], [-18.4, -32.6]];
      s += fleck(T, [[-2.4, -31], [-8, -28], [-13.4, -27.6], [-17.4, -31], [-17, -28], [-12, -26], [-6, -27.4]], "#000", 0.5, 0.5);
      s += vol(T, "b", `<path d="${G([[2.6, -40.4], [-3, -41], [-8.6, -40.4], [-13.4, -38.4], [-17.2, -32.6], [-13, -28.4], [-7, -29], [-1, -33]])}" fill="#6a220c"/>` + behang(T, { reihen: 3, je: 8, w: (tr) => 0.95 - tr * 0.1, rund: false, bieg: -0.13,
        ansatz: (tr, ti) => { const a = auf(satRand, ti); return [a[0] - tr * 0.8 + 0.5, a[1] + 0.5 + tr * 1.6]; },
        spitze: (tr, ti, z) => auf(satSpitze, Math.min(1, ti * 1.05 + (z - 0.5) * 0.08)),
        farbe: (tr, ti, z) => [T.lg("sat1", [[0, "#a83c16"], [0.4, "#e39a2e"], [1, "#f4c25a"]], 1, 0, 0, 1), T.lg("sat2", [[0, "#983414"], [0.5, "#d8862a"], [1, "#f0b84e"]], 1, 0, 0, 1), T.lg("sat3", [[0, "#b8481a"], [1, "#f6cc6a"]], 1, 0, 0, 1)][Math.floor(z * 3)],
        schaft: ["#ffe6a8", 0.35, 0.2, 0.8, 0], saum: "#3a1004", sw: 0.16, sop: 0.2 }));
      /* Kopf: kleiner, keilförmig zum Schnabel; feine orangerote Federn nach hinten, gehen ohne Kante in den Behang über */
      const kopf = [[13.8, -50.2], [14.8, -52.6], [17, -53.6], [19.8, -52.9], [21.4, -51.8], [21.6, -49.8], [20.6, -47.8], [17.8, -46.8], [15, -47.6]];
      let hals = teil(T, kopf, T.lg("kopfF", [[0, "#e8a040"], [0.5, "#d8782a"], [1, "#b8501a"]]),
        F ? T.haare(kopf, 90, (x, y) => 176 + (y + 50) * 5, 0.8, { farben: [["#f8cf70", 1, 0.06, 0.55], ["#a8401a", 1, 0.06, 0.5]], streuung: 12, kruemmung: 0.15 }) : "", { licht: T.lg("kopfL", [[0, "#fff", 0.12], [0.5, "#fff", 0], [1, "#000", 0.12]]) });
      /* Halsbehang: Unterlage, Schlagschatten auf Schulter und Brust, dann die Lanzettfedern (oben kurz, unten lang),
         in der unteren Hälfte mit schwarzem Schaftstrich */
      const kante = [[-2.4, -38.4], [3, -36.2], [8.6, -34.6], [13.6, -33.8], [17.2, -33.8]];
      s += fleck(T, [[3, -35.2], [9, -33.4], [14, -32.6], [17.6, -32.8], [17.6, -31.2], [12, -31], [4, -33]], "#000", 0.55, 0.55);
      hals += `<path d="${G([[13.4, -50.4], [17.6, -49.6], [18.6, -46.6], [18, -40.6], [17.2, -34.4], [9, -35.2], [-1.6, -38.6], [4.6, -42], [9.4, -46.4]])}" fill="#8a3412"/>`;
      hals += behang(T, { reihen: 8, je: 8, w: (tr) => 0.3 + 1 * tr, rund: false, bieg: 0.07,
        ansatz: (tr, ti) => lerp(auf([[14.6, -52.8], [12.6, -49.8], [9, -45.6], [5.4, -41.8]], tr), auf([[17.3, -52.8], [17.6, -49.4], [18.3, -46.4], [17.6, -39.8]], tr), ti),
        spitze: (tr, ti, z) => { const b = lerp(auf([[14.6, -52.8], [12.6, -49.8], [9, -45.6], [5.4, -41.8]], tr), auf([[17.3, -52.8], [17.6, -49.4], [18.3, -46.4], [17.6, -39.8]], tr), ti); return lerp(b, auf(kante, Math.min(1, Math.max(0, ti + (z - 0.5) * 0.08))), 0.07 + 0.93 * Math.pow(tr, 1.5)); },
        farbe: (tr, ti, z) => {
          const h = [T.lg("h1", [[0, "#a8401a"], [0.5, "#c8571b"], [1, "#e08a2c"]], 1, 0, 0, 1), T.lg("h2", [[0, "#b04a18"], [0.45, "#e9a93a"], [1, "#f5ce6e"]], 1, 0, 0, 1),
            T.lg("h3", [[0, "#c25a1e"], [0.5, "#eeb44a"], [1, "#f8d880"]], 1, 0, 0, 1), T.lg("h4", [[0, "#c86a22"], [0.6, "#f2c25a"], [1, "#f9e0a0"]], 1, 0, 0, 1)];
          return tr < 0.25 ? h[z < 0.6 ? 0 : 1] : h[1 + Math.floor(z * 3)];
        },
        schaft: ["#1a0e06", 0.3, 0.58, 0.84, 0.5], schaftW: 0.07, saum: "#5a2006", sw: 0.14, sop: 0.18 });
      if (F) hals += T.haare([[14.6, -53.2], [17.6, -53.4], [17.8, -50.6], [16.4, -48.6], [13.6, -49.4], [12.8, -51]], 34, (x, y) => 158 + (y + 51) * 8, 1.1, { farben: [["#c8571b", 1, 0.09, 0.8], ["#e08a2c", 1, 0.08, 0.75], ["#8a3412", 0.5, 0.07, 0.6]], streuung: 14, kruemmung: 0.2 });
      s += vol(T, "e", hals);
      /* Kamm: 5 runde Zacken, tief eingeschnitten (Talgrund ≈ halbe Höhe), Fahne frei über der Nackenlinie */
      const rot = T.lg("rot", [[0, "#e8343c"], [0.5, "#cc1c26"], [1, "#8a0c14"]]);
      const kammS = kammPfad([[21.2, -52.2, 1], [21.4, -53.6]], [[20, -56, 0.75], [18.2, -57.6, 0.85], [16.3, -58.2, 0.9], [14.4, -57.6, 0.85], [12.6, -56.4, 0.75]], -55.3, [[11.2, -55.4], [10.6, -54.8], [11.6, -54], [13.8, -53.2], [17.6, -53.6]]);
      let kamm = teil(T, kammS, F ? T.lg("kamm", [[0, "#ee3e46"], [0.5, "#d01c26"], [1, "#7a0f14"]], 0, 0, 0.2, 1) : "#d0141e",
        F ? zug(kammS, T.lg("kammRand", [[0, "#ff7a5a", 0.7], [0.4, "#ff7a5a", 0]]), 0.5) +
          fleck(T, `M12.4 -56.4a.4 .8 0 1 0 .1 0ZM14.3 -57.4a.4 .8 0 1 0 .1 0ZM16.2 -58a.4 .8 0 1 0 .1 0ZM18.1 -57.4a.4 .8 0 1 0 .1 0Z`, "#fff", 0.25, 0.15) +
          `<path d="M10.6 -54.6Q16 -53.8 21.6 -52.6L21.6 -51.6L10.6 -53Z" fill="#5a0008" opacity=".45"/>` : "", { licht: false });
      if (!F) kamm = `<g transform="translate(16 -53.2) scale(1.2) translate(-16 53.2)">${kamm}</g>`;
      s += fleck(T, [[12, -53.6], [17.6, -53.2], [21.2, -52], [17, -52.2], [13, -52.6]], "#3a0a04", 0.5, 0.35) + vol(T, "k", kamm);
      /* Gesichtshaut rot, Rand unregelmäßig mit feinen Federchen; Ohrfedern; Ohrscheibe als flaches Oval */
      const gesicht = [[17.6, -52.2], [18.6, -52.5], [20.6, -52.4], [21.5, -50.6], [21.3, -48.8], [20.4, -47.6], [18.4, -47.2], [17.6, -47.9], [17.9, -48.6], [17.3, -49.4], [17.6, -50.2], [17.1, -51], [17.5, -51.5]];
      let haut = teil(T, gesicht, rot, "", { licht: false });
      haut += `<ellipse cx="17.1" cy="-48.2" rx=".72" ry=".95" fill="${T.lg("ohr", [[0, "#e8545a"], [0.6, "#c8303a"], [1, "#a8202a"]], 0, 0, 0.4, 1)}"/><ellipse cx="16.9" cy="-48.6" rx=".22" ry=".35" fill="#fff" opacity=".35"/>`;
      /* Kehllappen: paarig unter dem Mundwinkel, der ferne dunkler und nur knapp sichtbar, Rand leicht wellig */
      haut += `<path d="${G([[20.6, -48.4], [21.9, -48.2], [22.3, -46.2], [22.1, -44.2], [21.5, -43], [20.8, -43.2], [20.6, -46]])}" fill="#8a0c14"/>`;
      haut += teil(T, [[19.6, -48.5], [21.4, -48.3], [21.9, -46.6], [21.8, -45], [21.3, -43.7], [21, -42.8], [20.3, -42.5], [19.6, -42.9], [19.1, -43.9], [18.9, -45.6], [19.1, -47.2]], rot,
        fleck(T, `M19.9 -46.4a.35 1.1 0 1 0 .1 0Z`, "#fff", 0.3, 0.2) + `<path d="M19 -48.6Q20.6 -47.4 22 -48.4L22 -49L19 -49Z" fill="#4a0008" opacity=".45"/>`, { licht: T.lg("lappenL", [[0, "#fff", 0.1], [0.4, "#fff", 0], [1, "#000", 0.25]], 0, 0, 1, 0.3) });
      s += vol(T, "k", haut);
      s += fleck(T, [[18.6, -46.8], [19, -43], [18.2, -41.6], [17.6, -45]], "#3a0a00", 0.35, 0.4);
      if (F) {
        s += T.haare([[16.6, -52.6], [17.9, -52.6], [17.8, -50.4], [17.2, -49], [16.6, -49.2], [16.4, -51]], 46, 176, 0.45, { farben: [["#d8782a", 1, 0.07, 0.9], ["#b8501a", 1, 0.06, 0.8]], streuung: 18 });
        s += T.haare([[16.4, -50.3], [17.3, -50.5], [17.5, -49.6], [16.6, -49.4]], 14, 160, 0.5, { farben: [["#7a6a5a", 1, 0.05, 0.6], ["#5a4a3a", 1, 0.05, 0.5]], streuung: 20 });
        s += T.haare([[20.4, -52.6], [21.4, -52.2], [21.2, -51.6], [20.2, -52]], 14, 190, 0.4, { farben: [["#b8501a", 1, 0.05, 0.7]], streuung: 20 });
      }
      /* Schnabel: Hornfarbe, kurzer Haken, dunklerer First mit Glanz, Nasenloch als Schlitz mit Hautdeckel an der Wurzel,
         Schnabelspalte bis unter die Augenvorderkante */
      s += (teil(T, [[21.1, -52.1], [22.6, -51.8], [23.9, -50.9], [24.6, -49.6], [24.6, -49, 1], [23.6, -49.35], [21.4, -49.6]], T.lg("schn", [[0, "#c8a04a"], [0.5, "#d9b45a"], [1, "#e9cf8a"]], 0, 0, 1, 0),
        F ? zug("M21.4 -51.95Q23.4 -51.65 24.4 -49.85", "#8a6a2c", 0.16, 0.35) + zug("M21.6 -51.7Q23.4 -51.4 24.2 -50", "#fff6d0", 0.12, 0.6) : "", { licht: T.lg("schnL", [[0, "#fff", 0.15], [0.5, "#fff", 0], [1, "#000", 0.2]]) })
        + teil(T, [[21.4, -49.55], [23.6, -49.3], [24.35, -49.05], [23.4, -48.7], [21.6, -48.6]], "#c8a050", "", { licht: false }));
      s += zug("M19.9 -49.3Q20.8 -49.55 21.5 -49.55L24.3 -49.12", "#4a3010", 0.08, 0.8);
      s += `<path d="M21.3 -51.5q.5 -.3 1.1 0q-.5 .3 -1.1 0Z" fill="#e8c878"/>` + zug("M21.5 -51.15l.75 .05", "#2a1a08", 0.12, 0.9);
      /* Auge: rund, fleischiger roter Lidrand, Oberlid wirft Schatten, Glanz zur Lichtquelle */
      s += vogelauge(T, 18.9, -50.5, 0.7, { iris: "#d9661e", iris0: "#f09a30", iris2: "#b04a14", limbus: "#3a1004", ring: "#8a1a16", rb: 0.2, deckel: "#b0222a", ober: 0.17 });
      return { svg: s, box: [-37.6, -58.9, 24.6, 0], fuesse: [-1.4, 4.6], kopf: [9.6, -59.2, 25, -42] };
    } },

  /* ------------------------------------------------------------------ HENNE */
  { id: "henne", de: "die Henne", syl: "HEN-ne", it: "la gallina", itSyl: "gal-LI-na", en: "hen",
    gruppe: "Vögel", lebensraum: "Bauernhof", laenge: 0.448, hoehe: 0.428,
    /* RECHERCHE: braunes Legehuhn (ISA Brown / Lohmann Brown, Hybride v. a. aus Rhode Island Red × Rhode Island White) –
       kastanien- bis rotbraun, ca. 40–44 cm lang, 38–42 cm hoch. Konturfedern dicht wie ein weicher Pelz: an Kehle und
       Brust klein, an Rücken und Flanke groß, über dem Schwanz ein Kissen aus längeren Federn; Spitzen zum Schwanz hin,
       an der Brust nach unten, mit hellerem Saum. Halsbehang goldocker, Federn bei der Henne RUND (beim Hahn spitz) und
       kürzer, verläuft vorn ohne Stufe über den Kropf in die Brust. Schwanz kompakt, dachförmig gefaltet, ca. 40–45° hoch,
       dunkelbraun mit rostbraunen Säumen. Flügel: Handschwingen fast ganz verdeckt, Armschwingen gestaffelt mit hellem
       Saum, drei Reihen Decken. Kopf: kleiner Einfachkamm (5 runde Zacken), kleine Kehllappen, Gesicht rot, Ohröffnung mit
       braunen Ohrfedern hinter dem Auge, darunter die rote Ohrscheibe; Auge orange mit rosa-orangem Lidring (Hühner
       schließen das Auge von unten); Schnabel kurz, kräftig, hornfarben, Nasenloch als Schlitz mit Hautdeckel an der
       Wurzel. Lauf gelb, vorn Gürtelschuppen, hinten Netzschuppen, kein Sporn; Mittelzehe ≈ 60 % des Laufs, Seitenzehen
       ≈ 75–80 % der Mittelzehe, Hinterzehe ≈ 35 % flach am Boden; Krallen hornfarben. Quellen: Wikipedia „ISA Brown",
       extension.org „External Anatomy of Chickens", Kritik Runde 1. */
    zeichne(T) {
      Q = 10;
      const F = T.fein;
      let s = "", K;
      const BEIN = { hell: "#f8dc82", mittel: "#e8b448", dunkel: "#a8781e", kralle: "#a8946a", k: 0.8, zehen: [2.5, 4.5, 5, 6], schatten: 0.4 };
      s += vol(T, "k", lauf(T, Object.assign({}, BEIN, { H: [-4, -10.3], A: [-2.4, -0.8], w0: 1.35, w1: 1.1, fern: true })));
      /* Schwanz: kompakter, dachförmig gefalteter Keil (≈ 42°), Steuerfedern dunkelbraun mit rostbraunem Saum,
         darüber Schwanzdecken */
      K = sammler();
      const st = T.lg("steuer", [[0, "#5a3018"], [0.6, "#3a2010"], [1, "#24140a"]]);
      for (const t of [[-22.6, -35.6], [-23.4, -34.8], [-24, -33.8], [-24.4, -32.6], [-24.4, -31.2]])
        langfeder(T, [[-16.4, -27.4], lerp([-16.4, -27.4], t, 0.5), t], 2.5, 2.3, st, { rund: true, schaft: "#a07850", schaftOp: 0.35, aussen: 0.3, kante: "#9a5a2c", kanteOp: 0.5, kw: 0.2, strahl: "#000", strahlN: 6 }, K);
      const sd = T.lg("sdecke", [[0, "#8a4a1e"], [0.7, "#a85a26"], [1, "#c87a3c"]]);
      for (const t of [[-20.6, -33.6], [-21.8, -32.2], [-22.4, -30.6], [-22.2, -28.8]])
        langfeder(T, [[-15.4, -28.2], lerp([-15.4, -28.2], t, 0.5), t], 2.3, 2.1, sd, { rund: true, schaft: "#f0c890", schaftOp: 0.3, aussen: 0.3, kante: "#e8b07a", kanteOp: 0.45 }, K);
      s += vol(T, "a", K.aus("#2a1206", 0.25, 0.25));
      /* Rumpf mit Schenkel (eine Masse, keine Kante): Konturfedern als Fluren, Kissen über dem Schwanz */
      const rumpf = [[14.6, -29.4], [15.3, -26.6], [14.4, -22.6], [12.6, -18.4], [9.6, -14.8], [5, -12.8], [-0.6, -12.2], [-7, -12.5], [-12.4, -14.4], [-16.6, -17.6], [-19.4, -22.4], [-20, -27], [-18, -30.8], [-13.4, -32.4], [-7, -31.4], [-1, -30.6], [5, -30.2], [10.4, -29.8]];
      const oben = [[13.6, -28.6], [5, -29.6], [-4, -30.2], [-12, -31.4], [-18.6, -29]], unten = [[14.2, -23], [9, -14.2], [0, -12.4], [-8, -12.7], [-16, -17.4]];
      const fsR = reihen(T, oben, unten, { v0: 0.02, v1: 1, dv: 0.09, W: (u, v) => (u < 0.22 ? 1.25 + u * 5 : 2.35) + (u > 0.8 && v < 0.5 ? 0.5 : 0), abstand: 0.92 });
      const hose = [[-5, -17.4], [4, -17.6], [4.4, -13.6], [3, -11.6], [1.4, -10.9], [0, -11.3], [-1.4, -10.8], [-2.8, -11.5], [-4.4, -13], [-5.4, -15]];
      let rk = teil(T, rumpf, T.lg("braun", [[0, "#b4642c"], [0.5, "#9a4c1e"], [1, "#6a2e10"]]),
        `<ellipse cx="13" cy="-25" rx="3.6" ry="5" fill="${T.rg("kropf", [[0, "#c27a3a", 0.5], [1, "#c27a3a", 0]])}"/>` +
        fluren(T, fsR, { winkel: (x, y, u, v) => (u < 0.22 ? 95 + u * 230 : 168 - v * 34), saum: [T.lg("saumH", [[0, "#f8cc90", 0.45], [0.6, "#e8a868", 0.25], [1, "#c8844a", 0.06]], 0, 0, 0.2, 1), 1, 0.13], schatten: ["#3a1404", 0.2, 0.4], lang: 1.2 }) +
        `<path d="M-1 -29.6Q6 -26.2 14 -27.6L14.4 -25.4Q6 -24.2 -1 -27.6Z" fill="#000" opacity=".2"/>`);
      /* Schenkel: weiches Oval in Körperfarbe, unten flaumige Federspitzen um den Laufansatz */
      rk += teil(T, hose, T.lg("hose", [[0, "#8a4218", 0], [0.35, "#8a4218", 0.85], [1, "#7a3814"]]), (F ? fluren(T, reihen(T, [[4, -16.6], [-4.6, -16]], [[2.4, -11.6], [-2.4, -11.4]], { v0: 0.1, v1: 1, dv: 0.3, W: () => 1.4 }), { winkel: (x) => 96 - x * 2, saum: ["#e8a868", 0.3, 0.1], schatten: ["#3a1404", 0.22, 0.3] }) : ""), { licht: false }) +
        bueschel(T, [[4, -13.4], [2.8, -11.4], [1.2, -10.7], [-0.4, -11], [-1.8, -10.7], [-3.2, -11.6], [-4.4, -13], [-2.4, -12.4], [1, -12.2], [3, -12.8]], 13, 0.7, () => 94, [["#8a4218", 0.07, 0.9], ["#c27a3a", 0.05, 0.8]], { szene: 0.3 });
      s += vol(T, "d", rk);
      s += vol(T, "k", lauf(T, Object.assign({}, BEIN, { H: [0.6, -10.3], A: [2.2, -0.8], w0: 1.4, w1: 1.12 })));
      /* Flügel, angehoben: Handschwingen fast verdeckt, Armschwingen gestaffelt mit hellem Saum, große Decken, kleine und
         mittlere Decken als Fluren; Schlagschatten auf die Flanke */
      const flug = [[9.2, -28.2], [8.4, -24.4], [5.6, -22.2], [-1, -21.4], [-9, -21.6], [-15, -23.4], [-17.2, -25.6], [-13, -27.8], [-6, -29.4], [1, -29.8], [6, -29.6]];
      s += fleck(T, [[8, -23.6], [3, -21], [-5, -20.4], [-14, -22], [-9, -21], [-1, -20.8], [5, -21.6]], "#2a0c02", 0.55, 0.45);
      let fi = "";
      K = sammler();
      for (let i = 0; i < 2; i++) langfeder(T, [[-8 - i * 2, -24.6], [-13 - i, -24.4], [-17.2 - i * 0.2, -25.6]], 1.9, 1.3, "#844a22", { rund: true, kante: "#b07a48", kanteOp: 0.5 }, K);
      const nA = F ? 8 : 4;
      for (let i = 0; i < nA; i++) {
        const x = 7 - i * 19 / nA, w = 2.3 * 8 / nA * (F ? 1 : 0.85);
        langfeder(T, [[x + 0.6, -26.4], [x - 1.8, -24.2], [x - 4.4, -22.2], [x - 6, -21.6]], w, w * 0.92, T.lg("arm", [[0, "#b46a32"], [0.6, "#96501e"], [1, "#6a3010"]], 1, 0, 0, 1),
          { rund: true, schaft: "#f0c890", schaftOp: 0.35, aussen: 0.3, kante: "#f2c088", kanteOp: 0.55, kw: 0.16 }, K);
      }
      /* Schirmfedern (innere Armschwingen) decken die hintere Oberkante */
      for (let i = 0; i < (F ? 3 : 2); i++) langfeder(T, [[-2 - i * 2.6, -28.4 + i * 0.3], [-9 - i * 2, -27.6 + i * 0.3], [-15.4 - i * 0.6, -26.2 + i * 0.2]], 2.4, 1.9, T.lg("schirm", [[0, "#b06a32"], [1, "#8a4a1e"]]),
        { rund: true, schaft: "#f0c890", schaftOp: 0.3, kante: "#f2c088", kanteOp: 0.5, kw: 0.16 }, K);
      fi += K.aus("#2a0e02", 0.28, 0.25);
      K = sammler();
      const nD = F ? 7 : 4;
      for (let i = 0; i < nD; i++) {
        const x = 8 - i * 16 / nD, w = 2.4 * 7 / nD;
        langfeder(T, [[x + 0.4, -28.2 + i * 0.12], [x - 0.8, -26.6 + i * 0.14], [x - 1.8, -25.4 + i * 0.16]], w, w * 0.9, T.lg("decke", [[0, "#a85e2a"], [1, "#c27e40"]]),
          { rund: true, schaft: "#f6d4a0", schaftOp: 0.3, kante: "#f6cc94", kanteOp: 0.5 }, K);
      }
      fi += K.aus("#2a0e02", 0.28, 0.25);
      const fsB = reihen(T, [[9.6, -29.4], [2, -30.4], [-5, -29.6]], [[8.8, -26.4], [2, -27.2], [-6, -27.8]], { v0: 0, v1: 0.9, dv: 0.3, W: () => 1.25 });
      fi += `<path d="${G([[9.6, -29.6], [9, -26.4], [2, -27], [-6, -27.6], [-8, -28.8], [-2, -30.4], [5, -30.6]])}" fill="#a85c28"/>` +
        fluren(T, fsB, { winkel: () => 162, saum: ["#f4c890", 0.5, 0.11], schatten: ["#3a1404", 0.35, 0.3], lang: 1.3 });
      s += vol(T, "c", teil(T, flug, "#6a3014", fi, { licht: LICHT(T, 0.7) }));
      /* Halsbehang: goldocker, rundliche Federn, oben kurz, unten bis über die Schultern; vorn ohne Stufe in den Kropf */
      const hk = [[0.4, -29.4], [4, -27.4], [7.6, -26.4], [11, -26.2], [14.4, -26.8]];
      const hb = [[12.6, -40.8], [10.8, -38], [7.4, -34], [3.8, -31.2]], hv = [[15.6, -40.6], [15.4, -38], [15.8, -35], [15, -30.6]];
      s += fleck(T, [[1, -28.8], [6, -26.2], [11, -25.6], [14.4, -26], [13, -24.4], [6, -24.6]], "#2a0c02", 0.4, 0.5);
      let hals = teil(T, [[11.2, -37.4], [12.6, -40.4], [15.6, -41.2], [18.4, -39.8], [18.8, -37.2], [17.8, -35.2], [15.2, -34.4], [12.2, -35.4]], T.lg("kopf", [[0, "#c8884a"], [0.6, "#b06a30"], [1, "#9a5424"]]),
        F ? T.haare([[11.2, -37.4], [12.6, -40.4], [15.6, -41.2], [18.4, -39.8], [18.8, -37.2], [17.8, -35.2], [15.2, -34.4], [12.2, -35.4]], 80, (x, y) => 174 + (y + 37) * 6, 0.8, { farben: [["#e8b070", 1, 0.06, 0.35], ["#7a3a12", 1, 0.06, 0.35]], streuung: 12, kruemmung: 0.15 }) : "", { licht: false });
      hals += `<path d="${G([[12.2, -40], [15.6, -40], [16.2, -36], [15, -31], [13.4, -27], [7, -26.4], [0.4, -29.4], [4, -32], [8, -35.6]])}" fill="#8a4a1c"/>`;
      hals += behang(T, { reihen: 7, je: 8, w: (tr) => 0.42 + 0.85 * tr, rund: true, bieg: 0.06,
        ansatz: (tr, ti) => lerp(auf(hb, tr), auf(hv, tr), ti),
        spitze: (tr, ti, z) => lerp(lerp(auf(hb, tr), auf(hv, tr), ti), auf(hk, Math.min(1, Math.max(0, ti + (z - 0.5) * 0.08))), 0.07 + 0.93 * Math.pow(tr, 1.4)),
        farbe: (tr, ti, z) => [T.lg("h1", [[0, "#8e4a1c"], [0.5, "#c27e3c"], [1, "#dcaa62"]], 1, 0, 0, 1), T.lg("h2", [[0, "#9a5222"], [1, "#e2ae66"]], 1, 0, 0, 1),
          T.lg("h3", [[0, "#a85c26"], [0.6, "#cc8a46"], [1, "#d29452"]], 1, 0, 0, 1)][tr > 0.75 && z < 0.4 ? 2 : Math.floor(z * 2)],
        schaft: ["#f8dcb0", 0.3, 0.3, 0.8, 0.3], saum: "#4a1e08", sw: 0.16, sop: 0.2 });
      if (F) hals += T.haare([[12.4, -41], [15.6, -41.4], [15.8, -38.6], [14.4, -36.6], [12, -37.2], [11, -38.8]], 40, (x, y) => 160 + (y + 39) * 8, 0.9, { farben: [["#b87638", 1, 0.08, 0.8], ["#d89c58", 1, 0.07, 0.7], ["#6a3410", 0.5, 0.06, 0.6]], streuung: 14, kruemmung: 0.2 });
      s += vol(T, "e", hals);
      /* Kamm: klein, 5 runde, fleischige Zacken; Dicke als dunklere Seitenkante; wachsig, breiter weicher Glanz */
      const rot = T.lg("rot", [[0, "#e8343c"], [0.55, "#c81c26"], [1, "#8a0c14"]]);
      const kammS = kammPfad([[18.6, -39.6, 1], [18.8, -40.4]], [[17.8, -41.5, 0.48], [16.5, -42.5, 0.52], [15, -42.8, 0.52], [13.6, -42.3, 0.5], [12.4, -41.3, 0.46]], 0.8, [[11.6, -40.6], [12.6, -40], [15.6, -40.2]]);
      let kopf = `<path d="${kammS}" fill="#7a0a12" transform="translate(.18 .12)"/>` + teil(T, kammS, F ? T.lg("kamm", [[0, "#ec4048"], [0.5, "#d01e28"], [1, "#900e16"]], 0, 0, 0.2, 1) : "#d0141e",
        F ? fleck(T, `M13.2 -41.6a.5 .8 0 1 0 .1 0ZM15 -42.2a.6 .8 0 1 0 .1 0ZM16.6 -41.9a.5 .8 0 1 0 .1 0Z`, "#fff", 0.28, 0.15) + `<path d="M11.8 -40.6Q15 -40 18.6 -39.8L18.6 -39.2L11.8 -40Z" fill="#5a0008" opacity=".4"/>` : "", { licht: false });
      /* Gesicht: kleiner, Rand unregelmäßig mit feinen Federchen; Ohrscheibe flach oval auf Höhe des Mundwinkels */
      kopf += teil(T, [[15.2, -39.4], [16.6, -39.7], [17.9, -39.5], [18.7, -37.8], [18.5, -36.2], [17.6, -35.1], [16, -35], [15.4, -35.8], [15.6, -36.6], [15, -37.3], [15.4, -38], [14.9, -38.7]], rot, "", { licht: false });
      kopf += `<ellipse cx="14.9" cy="-35.9" rx=".52" ry=".68" fill="${T.lg("ohr", [[0, "#ec5058"], [1, "#b82830"]], 0, 0, 0.4, 1)}"/><ellipse cx="14.75" cy="-36.2" rx=".16" ry=".26" fill="#fff" opacity=".3"/>`;
      kopf += `<path d="${G([[17.9, -36.1], [18.9, -35.8], [19, -34], [18.4, -33], [17.6, -33.2], [17.3, -34.8]])}" fill="#8a0c14"/>` +
        teil(T, [[17.5, -36.2], [18.6, -35.9], [18.8, -34.4], [18.2, -33], [17.3, -32.8], [16.9, -33.8], [17, -35.2]], rot, F ? fleck(T, `M17.6 -34.8a.2 .6 0 1 0 .1 0Z`, "#fff", 0.3, 0.15) : "", { licht: false });
      s += vol(T, "k", kopf);
      if (F) {
        s += T.haare([[14.4, -39.6], [15.4, -39.6], [15.3, -38], [15.5, -36.8], [14.8, -36.6], [14.2, -38]], 40, 174, 0.45, { farben: [["#c0803e", 1, 0.06, 0.9], ["#8a4a1c", 1, 0.06, 0.8]], streuung: 16 });
        s += T.haare([[14.3, -37.8], [15.1, -37.9], [15.2, -37], [14.4, -36.9]], 14, 160, 0.5, { farben: [["#7a4a26", 1, 0.05, 0.8], ["#5a3418", 1, 0.05, 0.7]], streuung: 20 });
      }
      /* Schnabel: kurzer kräftiger Kegel, Firste flach, Haken ≤ 10 %, satinierter Glanz vorn; Nasenloch mit Hautdeckel */
      s += teil(T, [[18.5, -38.3], [19.8, -38], [20.8, -37.3], [21.2, -36.6, 1], [20.4, -36.75], [18.8, -36.95]], T.lg("schn", [[0, "#c09a50"], [0.5, "#d8b868"], [1, "#e8d08e"]], 0, 0, 1, 0),
        F ? zug("M19.8 -37.95Q20.6 -37.6 21 -36.9", "#fff6d8", 0.12, 0.45) : "", { licht: false }) +
        teil(T, [[18.8, -36.9], [20.4, -36.7], [20.9, -36.55], [20, -36.25], [18.9, -36.3]], "#c8a058", "", { licht: false });
      s += zug("M16.9 -36.8Q17.9 -36.95 18.8 -36.92L20.8 -36.62", "#4a3010", 0.07, 0.8) + `<path d="M18.7 -37.85q.4 -.25 .9 0q-.4 .22 -.9 0Z" fill="#e2c27a"/>` + zug("M18.85 -37.6l.6 .04", "#2a1a08", 0.1, 0.9);
      /* Auge: größer, rund, blass rosa-oranger Lidring, Unterlid etwas kräftiger, Glanz zur Lichtquelle */
      s += vogelauge(T, 16.3, -37.5, 0.66, { iris: "#e8962a", iris0: "#f6c060", iris2: "#c06a14", limbus: "#5a2a08", ring: "#d8806a", rb: 0.14, deckel: "#c84a50", ober: 0.12 });
      s += zug("M15.6 -36.75Q16.3 -36.55 17 -36.75", "#e89a80", 0.12, 0.8);
      return { svg: s, box: [-24.6, -42.9, 21.2, 0], fuesse: [-1.2, 3.6], kopf: [10.6, -43.2, 22, -30.6] };
    } },

  /* ------------------------------------------------------------------ KÜKEN */
  { id: "kueken", de: "das Küken", syl: "KÜ-ken", it: "il pulcino", itSyl: "pul-CI-no", en: "chick",
    gruppe: "Vögel", lebensraum: "Bauernhof", laenge: 0.11, hoehe: 0.101,
    /* RECHERCHE: Eintagsküken (Haushuhn) ca. 40 g, 8–10 cm lang, ca. 9–10 cm hoch; dichtes Daunenkleid (Dunen, noch
       keine Konturfedern), butter- bis zitronengelb, Kehle, Wangen und Bauch cremig; Körper birnenförmig, breiteste
       Stelle unten, Kopf als Kugel (≈ 55–60 % der Körperhöhe) oben vorn aufgesetzt, Kinn und Kehle gerundet, Brust
       gewölbt; Flügel nur kleine Daunenstummel (26–30 % der Körperlänge), erste Kiele der Handschwingen ab Tag 3–4;
       kein Schwanz, kleines Bürzelbüschel. Auge groß, rund, dunkelbraun, dünner gelbocker Lidrand, knapp über der
       Schnabellinie. Schnabel kurz, blass horn- bis gelblich-rosa (Höhe : Länge ≈ 0,6), Eizahn als kleine matte
       kalkweiße Hornkappe an der Spitze des Oberschnabels (fällt nach ≈ 1 Tag ab). Läufe blass gelb-rosa, Schuppen kaum
       sichtbar, oben von Daunen überdeckt; drei Vorderzehen gefächert, Mittelzehe ≈ 75 % des Laufs, kurze blasse Krallen.
       Quellen: Alabama Extension „Chicken Embryo Development", Cobb „Chick Embryo Development", Kritik Runde 1. */
    zeichne(T) {
      Q = 100;
      const F = T.fein;
      let s = "";
      const BEIN = F ? { hell: "#fde8b8", mittel: "#f6d39a", dunkel: "#e0a86c", kralle: "#e0c098", k: 0.22, zehen: [1.5, 2.5, 2.8, 3.3], schatten: 0.3, dn: 0.17 }
        : { hell: "#f0b070", mittel: "#e39a52", dunkel: "#b06a30", kralle: "#c88a50", k: 0.22, zehen: [1.5, 2.5, 2.8, 3.3] };
      s += vol(T, "k", lauf(T, Object.assign({}, BEIN, { H: [-1.1, -1.95], A: [-0.6, -0.25], w0: 0.44, w1: 0.36, fern: true })), 0.35, 0.1, "#7a4a1a");
      /* EINE weiche Silhouette: Kopfkugel oben vorn, flache Einsattelung im Nacken, Birnenkörper mit Masse unten,
         gewölbte Brust, Kinn- und Kehlbogen */
      const umriss = [[5.1, -8.25], [4.7, -9.35], [3.4, -9.95], [2.1, -9.7], [1.2, -9], [0.75, -7.95], [-0.2, -7.45], [-1.8, -7.35], [-3.3, -6.85], [-4.4, -5.9], [-4.95, -4.5],
        [-4.75, -3.15], [-3.8, -2.25], [-2, -1.72], [0.3, -1.58], [2.1, -1.88], [3.25, -2.75], [3.75, -4], [3.72, -5.05], [4, -5.75], [4.7, -6.3], [5.15, -7], [5.15, -7.4]];
      const mitte = [-0.4, -4.4];
      const daune = T.rg("daune", [[0, "#fff6c0"], [0.42, "#ffe27a"], [0.78, "#f8cf5e"], [1, "#eaa63e"]], 0.35, 0.25, 0.8);
      /* Wuchsrichtung: am Kopf radial vom Schnabelansatz nach hinten, am Rücken nach hinten, an den Flanken schräg nach hinten unten */
      const wuchs = (x, y) => (x > 1 && y < -6.2 ? Math.atan2(y + 7.7, x - 5.4) * 180 / Math.PI : y < -5.4 ? 182 : 150 - (x + 1) * 7);
      const nach_aussen = (x, y) => (x > 1 && y < -6.2 ? Math.atan2(y + 7.8, x - 3) * 180 / Math.PI : Math.atan2(y - mitte[1], x - mitte[0]) * 180 / Math.PI);
      let k = "";
      k += teil(T, umriss, daune,
        (F ? T.haare(umriss, 700, wuchs, 0.26, { farben: [["#fff7cc", 1, 0.022, 0.32], ["#eaa83e", 1, 0.022, 0.22], ["#fde49a", 1, 0.022, 0.3]], streuung: 30, kruemmung: 0.3 }) +
          bueschel(T, umriss, 70, 0.32, wuchs, [["#fff7cc", 0.016, 0.22], ["#f0b648", 0.016, 0.18]], { breit: 0.3 }) : "") +
        /* Kopfkugel: eigenes Licht, Schatten unter Kinn/Kehle und im Nacken, cremige Wange */
        `<circle cx="3" cy="-8.1" r="2.2" fill="${T.rg("kopfL", [[0, "#fffbe0", 0.6], [0.6, "#fff2b0", 0.15], [1, "#fff2b0", 0]], 0.35, 0.3, 0.7)}"/>` +
        fleck(T, [[0.6, -7.2], [2.2, -6], [3.8, -5.4], [4.4, -5.6], [3, -4.9], [1.2, -5.6], [-0.2, -6.6]], "#d8901e", 0.35, 0.3, true) +
        `<ellipse cx="4.1" cy="-6.6" rx="1.1" ry=".75" fill="${T.rg("wange", [[0, "#fff5d0", 0.6], [1, "#fff5d0", 0]])}"/>` +
        `<ellipse cx="0.6" cy="-2.7" rx="2.9" ry="1.1" fill="${T.rg("bauch", [[0, "#fff4cc", 0.45], [1, "#fff4cc", 0]])}"/>` +
        `<path d="M-4 -2.4Q-0.4 -1.4 3 -2.2L3 -1.4L-4 -1.4Z" fill="#ffe9a0" opacity=".3"/>` +
        /* Flügelstummel als flache Wölbung im Flaum: darunter Eigenschatten, darauf Licht, Daunen gegen die Flanke gedreht */
        fleck(T, [[0.6, -4.6], [-0.8, -3.8], [-2.6, -3.7], [-1.2, -3.4], [0.6, -4]], "#c8801a", 0.3, 0.15, true) +
        `<path d="${G([[0.7, -5.7], [0.1, -4.7], [-1, -4.1], [-2.4, -4], [-2.8, -4.5], [-2.1, -5.25], [-0.8, -5.8]])}" fill="${T.lg("fl", [[0, "#fff2b0"], [1, "#f6cc58"]])}"/>` +
        (F ? bueschel(T, [[0.7, -5.7], [0.1, -4.7], [-1, -4.1], [-2.4, -4], [-2.8, -4.5], [-2.1, -5.25], [-0.8, -5.8]], 26, 0.28, () => 162, [["#fff6c8", 0.016, 0.45], ["#e6a83e", 0.016, 0.3]], { breit: 0.3 }) +
          zug("M-2.6 -4.15l-.18 .05M-2.3 -4l-.2 .1M-1.95 -3.9l-.18 .12", "#d8d0c0", 0.03, 0.8) : ""), { licht: LICHT(T, 0.6) });
      s += vol(T, "e", k, 0.42, 0.14, "#a8600a");
      /* weiche Flaumkante über dem ganzen Umriss: oben cremiges Gegenlicht, unten warm */
      s += randflaum(T, umriss, mitte, 420, 0.28, [["#fff3c4", 0.02, 0.75], ["#fbe08a", 0.02, 0.7], ["#f0b44a", 0.02, 0.65], ["#f8d06a", 0.02, 0.6]], true,
        (p, i) => (p[1] < -4.6 ? i % 2 : 2 + i % 2));
      s += vol(T, "k", lauf(T, Object.assign({}, BEIN, { H: [0.6, -1.85], A: [1.15, -0.25], w0: 0.46, w1: 0.37 })), 0.35, 0.1, "#7a4a1a");
      /* Daunen überdecken die oberen Läufe */
      s += bueschel(T, [[-1.9, -2.2], [-0.6, -1.7], [0.2, -1.62], [1.6, -1.95], [1.4, -1.5], [0.6, -1.35], [-0.6, -1.4], [-1.6, -1.7]], 26, 0.3, () => 96, [["#f6c95a", 0.02, 0.9], ["#fde7a0", 0.018, 0.85]], { szene: 0.3, breit: 0.3 });
      /* Schnabel: kurzer Kegel (H : L ≈ 0,6), blass horn-rosa; Eizahn als matte Kappe an der Spitze; Daunen überlappen die Basis */
      s += teil(T, [[5.05, -8.1], [5.55, -7.98], [6.02, -7.66, 1], [5.6, -7.48], [5.08, -7.42]], F ? T.lg("schn", [[0, "#f3dca6"], [1, "#e3bf86"]]) : "#e39a52", "", { licht: false }) +
        teil(T, [[5.12, -7.44], [5.7, -7.5], [5.22, -7.22]], F ? "#e2c08c" : "#d08a48", "", { licht: false });
      s += zug("M5.1 -7.45L5.75 -7.49", "#9a7448", 0.025, 0.45) + `<circle cx="5.08" cy="-7.38" r=".06" fill="#fbe7a0"/>`;
      s += `<path d="M5.88 -7.8q.17 .02 .16 .18l-.14 -.02Z" fill="#f2ecdc"/>` + zug("M5.86 -7.64l.16 .02", "#b8a080", 0.02, 0.6);
      s += `<ellipse cx="5.32" cy="-7.88" rx=".07" ry=".03" fill="#9a7448"/>`;
      if (F) s += randflaum(T, [[5.05, -8.3], [5.1, -7.8], [5.08, -7.25]], [4, -7.8], 16, 0.18, [["#ffe27a", 0.016, 0.85]], false) +
        fleck(T, [[5.05, -8.2], [5.25, -7.9], [5.2, -7.3], [5, -7.4]], "#a86a10", 0.25, 0.06);
      /* Auge: groß, rund, dunkelbraun, dünner gelbocker Lidrand, weiche Augenhöhle */
      s += vogelauge(T, 3.75, -8.05, 0.4, { iris: "#3a2210", iris0: "#4a2c14", iris2: "#24140a", limbus: "#0e0804", ring: "#c9a24a", rb: 0.08, deckel: "#d8b058", ober: 0.08, hoehle: "#c88a20", hoehleOp: 0.15, pupille: 0.5 });
      return { svg: s, box: [-4.95, -9.95, 6.02, 0], fuesse: [0, 2.2], kopf: [0.4, -10.4, 6.4, -5] };
    } },

  /* ------------------------------------------------------------------ ENTE */
  { id: "ente", de: "die Ente", syl: "EN-te", it: "l'anatra", itSyl: "A-na-tra", en: "duck",
    gruppe: "Vögel", lebensraum: "Bauernhof", laenge: 0.588, hoehe: 0.314,
    /* RECHERCHE: Stockente (Anas platyrhynchos), Erpel im Prachtkleid, stehend – 50–65 cm lang, ca. 30–35 cm hoch.
       Rumpf schwer, Masse vorn: volle runde Brust ragt vor die Kehle, tiefster Bauchpunkt kurz vor den Beinen, Rücken
       leicht gewölbt, Heck verjüngt und steigt zum Schwanz an (Rumpf L : H ≈ 2 : 1). Kopf rund, deutlich vom schlankeren
       Oberhals abgesetzt (Hals unter dem Kopf ≈ 65–70 % der Kopfhöhe), flaschengrün mit Metallglanz, im Licht
       violett-blau; schmaler weißer Halsring, hinten offen; direkt darunter purpur-kastanienbraune Brust mit feinen
       hellen Säumen. Flanken hellgrau mit sehr feiner Wellenzeichnung; Schulterfedern graubraun, fein gewellt;
       Schirmfedern graubraun mit kastanienbraunem Außensaum; Spiegel metallisch blau-violett, vorn und hinten schwarz und
       auffällig weiß gesäumt, von den Flankenfedern teils verdeckt; Handschwingen graubraun. Bürzel, Ober- und
       Unterschwanzdecken samtschwarz mit grünem Schimmer; Schwanz weißlich-grau, spitz; Erpellocke: 2–4 mittlere
       Oberschwanzdecken, eng nach vorn eingerollt. Schnabel olivgelb, breit und flach, Spitze gerundet, kleiner dunkler
       Nagel oben auf der Spitze, Unterschnabel als schmaler Streifen, Schnabelkante leicht S-förmig, Nasenloch länglich
       nahe der Basis am First; Auge dunkelbraun, rund; Beine und Schwimmfüße orange bis orangerot, Schwimmhäute bis zu
       den Zehenspitzen. Quellen: Wildlife Trusts „How to identify dabbling ducks", NZ Birds Online „Mallard",
       naturalis.nl „Anas platyrhynchos", MDC Waterfowl ID, Birds Canada „Ducks & Geese", Kritik Runde 1. */
    zeichne(T) {
      Q = 10;
      const F = T.fein;
      let s = "", K;
      const FUSS = { hell: "#ffa04a", mittel: "#f07a28", dunkel: "#c85a18", haut: "#f8904a", kralle: "#3a2418", L: 5.4 };
      s += vol(T, "k", schwimmfuss(T, Object.assign({}, FUSS, { H: [-3.4, -6.6], A: [-2.6, -1.3], w0: 1.05, w1: 0.8, fern: true, schatten: 0.4 })), 0.4, 0.1, "#5a2008");
      /* Schwanz: geschlossener spitzer Keil, weißlich-grau, 10–15° aufwärts aus der Spitze des schwarzen Hecks */
      K = sammler();
      for (const [t, w] of [[[-28.2, -20.6], 2.6], [[-28.9, -19.6], 2.8], [[-28.8, -18.6], 2.8], [[-28, -17.8], 2.6]])
        langfeder(T, [[-21.6, -18.8], lerp([-21.6, -18.8], t, 0.55), t], w, 0.9, T.lg("schw", [[0, "#9a9a92"], [0.5, "#dddcd4"], [1, "#f4f3ec"]], 0, 0, 1, 0), { schaft: "#8a8a84", schaftOp: 0.35 }, K);
      s += vol(T, "a", K.aus("#7a7a74", 0.12, 0.15), 0.35, 0.1);
      /* Rumpf: Masse vorn, Brust ragt vor, tiefster Bauchpunkt vor den Beinen, Heck verjüngt und steigt an */
      const rumpf = [[16.4, -20.8], [18.4, -18.4], [19, -15.6], [18.6, -12.6], [16.8, -9.6], [13, -7.4], [7, -6.3], [1, -6.3], [-4.6, -7], [-10, -8.6], [-15.2, -11], [-19.2, -14.2], [-21.6, -17], [-21.8, -19],
        [-19.6, -21.4], [-13, -23.6], [-4, -24.8], [5, -25], [11.6, -24], [14.6, -22.6]];
      const brust = [[11.6, -26], [20, -26], [20, -6], [12.2, -6], [13.2, -8.4], [13.4, -11.4], [12.6, -15], [11.6, -18.8], [11.2, -22]];
      const heck = [[-14.6, -26], [-24, -26], [-24, -6], [-14.6, -8.6], [-12.8, -11], [-12, -14.4], [-12.4, -18], [-13.6, -21.8]];
      /* Kopf und Hals: Kopf rund, Hals unter dem Kopf eingeschnürt; flaschengrün, Glanzbogen an Scheitel und Wange,
         violett-blau am Hals; weißer Halsring (hinten offen), darunter sofort die purpur-kastanienbraune Brust */
      const kopf = [[13.2, -22.4], [14.6, -25.4], [15.6, -27.2], [15.5, -29.6], [16.4, -31.6], [18.8, -32.6], [21.2, -32], [22.5, -30.4], [22.8, -28.8], [22.5, -27.4], [21.2, -26.9], [19.8, -26.2], [19.4, -24.6], [19.4, -22.8], [19, -21], [16.2, -20.4]];
      const gruen = T.lg("kopf", [[0, "#1f7a48"], [0.3, "#0f5232"], [0.62, "#0b3a26"], [0.85, "#1a2a5c"], [1, "#0e1a30"]], 0.2, 0, 0.5, 1);
      let ki = fleck(T, `M15 -28Q16.6 -33 22 -31.2`, "none", 1, 0.3).replace('fill="none"', `fill="none" stroke="${T.lg("glanzB", [[0, "#7ee0a0", 0], [0.4, "#7ee0a0", 0.6], [1, "#7ee0a0", 0.1]], 0, 0, 1, 0)}" stroke-width="1.2"`) +
        fleck(T, `M17.2 -27.6Q19.6 -27 21.6 -28.2`, "none", 1, 0.25).replace('fill="none"', `fill="none" stroke="#5ac888" stroke-width=".8" stroke-opacity=".2"`) +
        `<ellipse cx="17.6" cy="-24.6" rx="2.4" ry="2.2" fill="${T.rg("viol", [[0, "#4a46b0", 0.5], [1, "#4a46b0", 0]])}"/>` +
        fleck(T, [[19.6, -27], [21.6, -27.4], [22.6, -27.8], [20.4, -26.2], [19.2, -25]], "#000", 0.4, 0.4, true);
      /* unter dem Ring beginnt die Brust */
      ki += `<path d="M13 -23.3Q16 -23.5 19.4 -22.1L19.8 -18L13 -18Z" fill="${T.lg("brustO", [[0, "#6a2c2a"], [1, "#7a3a30"]])}"/>`;
      ki += `<path d="M14.4 -23.7Q16.6 -23.7 19.2 -22.4" fill="none" stroke="${T.lg("ring", [[0, "#cfcfc8"], [0.35, "#fbfaf4"], [1, "#e6e6de"]], 0, 0, 1, 0)}" stroke-width=".6" stroke-linecap="round"/>` +
        `<path d="M14.4 -23.3Q16.6 -23.2 19.2 -21.95" fill="none" stroke="#000" stroke-width=".3" stroke-opacity=".25"/>`;
      const KT = "translate(19 -25.4) scale(1.06) translate(-19 27)";
      s += `<g transform="${KT}">` + vol(T, "e", teil(T, kopf, gruen, ki, { licht: LICHT(T, 0.5) }), 0.45, 0.12, "#021008") + "</g>";

      /* Grundton des Rumpfs (Rücken/Flanke), Brust und Heck – darauf der Flügel, davor die Flanke mit gebogener Federkante */
      const flankeG = T.lg("flanke", [[0, "#dcdcd6"], [0.5, "#c8c8c2"], [1, "#8e8e88"]], 0, -25, 0, -6.3, ' gradientUnits="userSpaceOnUse"');
      let ri = "";
      ri += `<path d="${G(heck)}" fill="${T.lg("heck", [[0, "#16201c"], [0.4, "#0c100f"], [1, "#060707"]])}"/>` +
        `<path d="M-13 -23Q-17 -22.4 -20.6 -20.2L-20 -19.4Q-17 -21 -13 -21.6Z" fill="${T.lg("heckG", [[0, "#2a5a48", 0.35], [1, "#2a5a48", 0]], 1, 0, 0, 0)}"/>`;
      /* Flügel: Oberkante = Rückenkontur. Schulterfedern (fein gewellt), Schirmfedern mit kastanienbraunem Außensaum,
         Handschwingen graubraun bis zur Schwanzbasis, Spiegel als schmales Band hinten unten */
      const flug = [[13.2, -23.2], [11, -19.8], [4, -17.4], [-6, -16.6], [-14, -17.2], [-19.6, -18.8], [-21.6, -20.4], [-19.6, -21.5], [-13, -23.7], [-4, -24.9], [5, -25.1], [11, -24.2]];
      let fi = "";
      /* Spiegel: Armschwingen blau-violett, vorn und hinten schwarz + weiß gesäumt */
      fi += `<path d="M-4.4 -19L-15 -19.6L-15.4 -16.4L-5.6 -15.9Q-4.4 -17.4 -4.4 -19Z" fill="${T.lg("spiegel", [[0, "#1e2a6a"], [0.5, "#34489e"], [0.8, "#4a3682"], [1, "#1a245a"]], 0, 0, 1, 0.3)}"/>`;
      if (F) { let k = ""; for (let i = 1; i < 6; i++) { const x = -3.8 - i * 1.9; k += "M" + J(x, -19.1 - i * 0.1) + "l" + J(-0.5, 3); } fi += zug(k, "#10164a", 0.12, 0.6); }
      fi += zug("M-4.2 -19.2L-15 -19.9", "#fbfbf6", 0.4) + zug("M-4.4 -18.85L-15 -19.5", "#0a0a0a", 0.2) + zug("M-5.4 -15.95L-15.4 -16.5", "#0a0a0a", 0.2) + zug("M-3.8 -15.5L-15.6 -16.1", "#fbfbf6", 0.4);
      /* Handschwingen: graubraun, unter den Schirmfedern, Spitzen stumpf an der Schwanzbasis */
      K = sammler();
      for (let i = 0; i < (F ? 4 : 2); i++) langfeder(T, [[-10 - i * 1.2, -21.4 + i * 0.3], [-16 - i * 0.6, -21 + i * 0.25], [-21.2 + i * 0.4, -20.6 + i * 0.3]], 1.9, 1.4, "#5e554c", { rund: true, schaft: "#c8c0b4", schaftOp: 0.3, kante: "#8a8076", kanteOp: 0.5 }, K);
      fi += K.aus("#1a1612", 0.25, 0.3);
      /* Schulterfedern: 12 überlappende, spitzovale Federn, graubraun, heller Saum, fein gewellt */
      const fsS = reihen(T, [[12.6, -24.4], [4, -25.4], [-6, -24.8]], [[11, -20], [3, -18.6], [-8, -19.6]], { v0: 0.1, v1: 0.95, dv: F ? 0.28 : 0.5, W: (u) => (2.5 - u * 0.4) * (F ? 1 : 1.5) });
      fi += `<path d="${G([[12.8, -24], [11, -19.8], [3, -18.4], [-8, -19.4], [-10, -22.6], [-4, -24.8], [5, -25.2]])}" fill="#9e9284"/>`;
      fi += zungen(T, fsS, { richtung: 176, winkel: (x) => 176 - x * 0.4, toene: ["#a69a8a", "#9a8e7e", "#aea292"], name: "sch", saum: "#e2dacc", saumT: 0.3, sw: 0.5, sop: 0.07, spitz: true, lang: 1.6, zl: 2.4 });
      /* Schirmfedern: 3 lange, spitze Federn, graubraune Mitte, kastanienbrauner Außensaum */
      K = sammler();
      for (let i = 0; i < 3; i++) {
        const x = -1 - i * 2.4, p = [[x + 3, -22.8 + i * 0.5], [x - 2.6, -22 + i * 0.5], [x - 7.4, -20.6 + i * 0.5]];
        langfeder(T, p, 3.2, 1, T.lg("tert", [[0, "#a09280"], [0.55, "#8a7a68"], [0.8, "#7a5a40"], [1, "#7a4428"]], 0, 0, 0, 1), { rund: true, schaft: "#e0d6c8", schaftOp: 0.25, kante: "#8a4a2a", kanteOp: 0.35, kw: 0.4 }, K);
      }
      fi += K.aus("#2a2018", 0.3, 0.25);
      ri += vol(T, "c", teil(T, flug, "#7a6e62", fi, { licht: false }), 0.3, 0.1, "#1a1410");
      /* Flanke VOR dem Flügel: oberste Flankenfedern als weich gerundete Bögen, die den Flügelunterrand und 30–50 % des
         Spiegels überdecken; gleicher Flankenton, nur ein zarter Lichtsaum an der Federkante; darin die feine Wellenzeichnung */
      const fk = [], fkr = [];
      for (let x = 12.6; x > -11.6; x -= F ? 2.9 : 4.4) { const y = -17.7 + Math.max(0, -x - 10) * 0.12 - (x > 6 ? (x - 6) * 0.32 : 0), w = F ? 1.45 : 2.2; fk.push([x, y - 0.2], [x - w, y + 0.5, 1]); fkr.push(`M${J(x + 0.2, y - 0.1)}Q${J(x - w * 0.5, y - 0.75, x - w, y + 0.45)}`); }
      fk.push([-12, -17.6], [-12, -14.4], [-12.8, -11], [-14.6, -8.6], [-14.6, -5], [14, -5], [14, -20.6]);
      const fkd = G(fk);
      let fli = "";
      if (F) {
        /* feine Wellenzeichnung: senkrechte Bögen, die der Walzenform folgen */
        let w = "";
        for (let x = -12.2; x < 11.6; x += 0.24 + T.rnd() * 0.08) {
          const y0 = -19 - Math.sin((x + 13) / 26 * Math.PI) * 1.2 + T.rnd(), y1 = -6.6 - Math.max(0, (-x - 2) * 0.16) - Math.max(0, (x - 6) * 0.2) - T.rnd();
          w += "M" + J(x, y0);
          for (let y = y0 + 0.6, i = 0; y < y1; y += 0.6, i++) w += "l" + J(((i % 2) - 0.5) * (0.08 + T.rnd() * 0.12) - (y - (y0 + y1) / 2) * 0.01, 0.6);
        }
        fli += zug(w, "#4a4c48", 0.035, 0.12);
      }
      fli += F ? zug(fkr.join(""), "#fff", 0.16, 0.28) : "";
      ri += `<path d="${fkd}" fill="${flankeG}"/>` + (fli ? `<g>${fli}</g>` : "") + (F ? fleck(T, fkd, "#000", 0.08, 0.5) : "");
      ri += `<path d="${G(brust)}" fill="${T.lg("brust", [[0, "#7a3a30"], [0.45, "#5c2a26"], [1, "#341616"]], 0, 0, 0.3, 1)}"/>` +
        `<ellipse cx="16" cy="-19" rx="3" ry="4" fill="${T.rg("purpur", [[0, "#5a2a40", 0.35], [1, "#5a2a40", 0]])}"/>`;
      if (F) ri += fluren(T, reihen(T, [[18.8, -20], [16, -21], [12.4, -20.6]], [[18.8, -9.6], [15, -7.6], [13, -8.4]], { v0: 0.04, v1: 1, dv: 0.09, W: (u, v) => 0.7 + v * 0.3 }), { winkel: (x, y, u, v) => 92 + u * 40, saum: [T.lg("saumB", [[0, "#c0907e", 0.22], [0.6, "#a87060", 0.08], [1, "#7a4a3a", 0]], 0, 0, 0.3, 1), 1, 0.05], schatten: ["#200a08", 0.1, 0.14], lang: 1.2 });
      ri += `<ellipse cx="3" cy="-7.6" rx="12" ry="1.6" fill="${T.rg("bauchR", [[0, "#fff", 0.16], [1, "#fff", 0]])}"/>`;
      s += vol(T, "d", teil(T, rumpf, flankeG, ri, { licht: LICHT(T, 0.6) }), 0.45, 0.12, "#1a1a18");
      /* Erpellocke: zwei schwarze Federn mit Fahne, eng nach vorn eingerollt (kleiner Ring), auf der Schwanzbasis */
      const locke = (x, y, r) => `M${J(x, y)}C${J(x - 0.2, y - r * 1.2, x + r * 1.6, y - r * 2.6, x + r * 1.7, y - r * 1.2)}C${J(x + r * 1.75, y - r * 0.3, x + r * 0.7, y - r * 0.2, x + r * 0.75, y - r * 1)}`;
      s += zug(locke(-19.4, -21.1, 0.8) + locke(-20.3, -20.8, 0.7), "#0c100e", 0.55) + (F ? zug(locke(-19.25, -21.2, 0.78), "#3e7a60", 0.12, 0.6) : "");
      s += vol(T, "k", schwimmfuss(T, Object.assign({}, FUSS, { H: [-0.6, -6.5], A: [0.3, -1.4], w0: 1.1, w1: 0.82, schatten: 0.4 })), 0.4, 0.1, "#5a2008");
      /* Schnabel: olivgelb, flacher Keil ohne Stufe zur Stirn, Spitze breit gerundet, kleiner dunkler Nagel oben auf der
         Spitze, Unterschnabel schmal, Schnabelkante S-förmig, Nasenloch länglich nahe dem First */
      s += `<g transform="${KT}">`;
      let sn = teil(T, [[22, -31.1], [23.6, -30], [25.4, -29.4], [27.8, -28.9], [28.7, -28.4], [28.8, -27.7], [28.3, -27.3], [26, -27.5], [24.4, -27.8], [22.4, -27.9], [22.8, -29.4]], T.lg("schn", [[0, "#d8cc4a"], [0.6, "#b4a838"], [1, "#7a7428"]]),
        (F ? zug("M22.6 -30.6Q25 -29.6 28 -28.9", "#fff6b0", 0.16, 0.45) : ""), { licht: false });
      sn += teil(T, [[22.8, -27.95], [24.6, -27.75], [26.6, -27.4], [28.3, -27.25], [27.8, -27.05], [25.6, -27.1], [23.4, -27.4]], "#8a8230", "", { licht: false });
      sn += `<path d="M28.1 -28.9Q28.9 -28.6 28.85 -27.9Q28.5 -28.1 28.1 -28.35Z" fill="#3a3020"/>`;
      sn += zug("M22.7 -27.95Q24.6 -27.7 26.4 -27.45T28.4 -27.3", "#4a4418", 0.1, 0.8) + `<ellipse cx="23.9" cy="-29.85" rx=".42" ry=".15" fill="#3a3214" transform="rotate(22 23.9 -29.85)"/>` + zug("M23.5 -29.65q.4 .25 .85 .3", "#e8dc7a", 0.06, 0.6);
      if (F) sn += zug("M23.4 -27.85l.15 .2M24.2 -27.75l.15 .2M25 -27.62l.15 .2M25.8 -27.5l.15 .2", "#5a5420", 0.05, 0.2);
      s += vol(T, "k", sn, 0.35, 0.14, "#2a2408");
      s += F ? T.haare([[21.9, -31.2], [22.5, -30.6], [22.7, -29.2], [22.5, -28], [22, -28.4]], 26, 8, 0.3, { farben: [["#0e4a2c", 1, 0.05, 0.8], ["#155e38", 1, 0.05, 0.7]], streuung: 16 }) : "";
      /* Auge: rund, dunkelgrün-schwarzer Lidring, dunkelbraune Iris, Glanzpunkt zur Lichtquelle */
      s += vogelauge(T, 20.1, -30.1, 0.5, { iris: "#3a1e0a", iris0: "#4a2a10", iris2: "#1a0c04", limbus: "#080402", ring: "#04120a", rb: 0.1, deckel: "#062014", ober: 0.12, pupille: 0.45 }) + "</g>";
      return { svg: s, box: [-29.2, -31.4, 29.6, 0], fuesse: [-1.4, 2.3], kopf: [13.4, -32.2, 29.8, -18.4] };
    } },

  /* ------------------------------------------------------------------ GANS */
  { id: "gans", de: "die Gans", syl: "GANS", it: "l'oca", itSyl: "O-ca", en: "goose",
    gruppe: "Vögel", lebensraum: "Bauernhof", laenge: 0.704, hoehe: 0.836,
    /* RECHERCHE: Hausgans, weiße Höckergans (White Chinese, aus der Schwanengans gezüchtet) – Ganter 80–90 cm hoch,
       80–95 cm lang, 5–10 kg. Körper kompakt, ohne Bauchwamme, in etwa 30–40° aufgerichtet; volle, runde Brust; langer,
       schlanker, schwanenartig gebogener Hals (S-Linie: Nacken unter dem Hinterkopf eingezogen, Kehle konkav), feine
       Längsfurchen im Halsgefieder; großer, runder, aufrechter Stirnhöcker mit Knick zum langen, schlanken Schnabel.
       Gefieder reinweiß, glatt: Brust winzige Federn, Flanke längliche Flankenfedern in Reihen, Bauch Flaum; auf dem
       Rücken große Schulterfedern; Flügel mit kleinen, mittleren, großen Decken, Schirmfedern und langen weißen
       Handschwingen, die über dem kurzen keilförmigen Schwanz kreuzen. Schnabel, Höcker und Füße kräftig orange,
       Unterschnabel etwas gelblicher, Nagel als runder Haken, Lamellen an der Schnabelkante, Nasenloch länglich im
       hinteren Drittel; Auge blau mit schmalem orangem Lidring. Schwimmfüße mit gespannter Schwimmhaut, kleine hoch
       angesetzte Hinterzehe. Quellen: poultryhub.org „Fancy goose breeds", a-z-animals „Chinese Geese", Livestock
       Conservancy „Chinese Goose", Wikipedia „Domestic goose", Kritik Runde 1. */
    zeichne(T) {
      Q = 10;
      const F = T.fein;
      let s = "", K;
      const FUSS = { hell: "#ffb860", mittel: "#f08a2a", dunkel: "#c06a20", haut: "#ffa850", kralle: "#4a3020", L: 7.6 };
      s += vol(T, "k", schwimmfuss(T, Object.assign({}, FUSS, { H: [-5, -12.4], A: [-4, -1.6], w0: 2.2, w1: 1.7, fern: true, schatten: 0.45 })), 0.4, 0.1, "#6a2a08");
      /* Schwanz: kurzer weißer Keil, 1–2 Spitzen hinter den Handschwingen, leicht angehoben */
      K = sammler();
      for (const t of [[-39.6, -27.6], [-39.8, -25.8]]) langfeder(T, [[-31, -22.4], lerp([-31, -22.4], t, 0.5), t], 3.2, 1.4, T.lg("schw", [[0, "#dfe2e4"], [1, "#fbfaf6"]], 0, 0, 1, 0), { schaft: "#c8ccd0", schaftOp: 0.4 }, K);
      s += vol(T, "b", K.aus("#8a929c", 0.2, 0.12), 0.25, 0.1, "#4a5866");
      /* Hals und Kopf (hinter der Brust angesetzt): S-Linie, unter dem Kopf schmal, zur Basis breit */
      const hals = [[2.6, -43], [6.4, -50], [9.2, -57.6], [10.8, -64.6], [11.4, -70], [12.6, -73.6], [12.8, -76.8], [13.8, -80.4], [16.4, -82.6], [19.2, -82.6], [20.8, -81.2],
        [21.8, -79.6], [21.8, -77.2], [20.8, -75.8], [19.6, -75.2], [18.2, -72.6], [17.8, -68.6], [18.2, -63], [18.8, -57.4], [19.4, -50], [18.4, -42], [4, -40]];
      let hi = "";
      if (F) {
        /* feine, leicht wellige Längsfurchen parallel zur Halsachse (typisch Gans), vor allem auf der Schattenseite */
        let f = "";
        for (let i = 0; i < 8; i++) {
          const q = 0.3 + i * 0.085, pts = [];
          for (let t = 0; t <= 1.001; t += 0.1) { const a = auf([[3, -44], [9.6, -58], [11.6, -68], [12.9, -74.4]], t), b = auf([[17.8, -45], [18.8, -57], [18, -66], [18.4, -72.6]], t); pts.push([a[0] + (b[0] - a[0]) * q + Math.sin(t * 19 + i) * 0.08, a[1] + (b[1] - a[1]) * q]); }
          f += G(pts, false);
        }
        hi += zug(f, "#a0a8b0", 0.07, 0.3);
      }
      hi += `<ellipse cx="16.4" cy="-80" rx="4" ry="2.4" fill="${T.rg("kopfL", [[0, "#fff", 0.9], [1, "#fff", 0]])}"/>` +
        fleck(T, [[18.6, -75.6], [21.6, -75.6], [19.4, -74.4]], "#5a6878", 0.3, 0.4) +
        fleck(T, [[16.8, -66], [17.8, -58], [18.6, -50], [19.2, -46], [17.8, -50], [17, -58]], "#6a7888", 0.3, 0.8);
      s += vol(T, "c", teil(T, hals, T.lg("hals", [[0, "#ffffff"], [0.45, "#f8f7f2"], [1, "#d4dade"]], 0, 0, 1, 0), hi, { licht: LICHT(T, 0.4) }), 0.3, 0.2, "#4a5a6a");
      /* Rumpf: kompakt, ~30° aufgerichtet, volle Brust vorn oben, straffer Bauch ohne Wamme, Rückenlinie fällt gleichmäßig
         zum Schwanz ab (sie ist zugleich die Flügeloberkante), Unterschwanzdecken weich gewölbt */
      const ei = [[12, -47.6], [16.4, -44.6], [18.8, -39], [18.8, -32], [16.4, -24.6], [11, -18.4], [3, -14.4], [-5.6, -13.6], [-13.4, -14.8], [-20.6, -17.6], [-26.4, -20.8],
        [-30.6, -23.2], [-30.4, -25.4], [-25, -28.4], [-17, -33], [-7, -39.4], [3, -45.6]];
      const fsR = reihen(T, [[15, -45], [4, -44], [-10, -36.6], [-24, -28.4]], [[18.4, -32], [10, -18.4], [-4, -13.6], [-22, -18]], { v0: 0.12, v1: 1, dv: 0.1, W: (u, v) => (u < 0.2 ? 1.1 : 3.4) * (1 - v * 0.25), abstand: 1.15 });
      let ri = fluren(T, fsR, { winkel: (x, y, u, v) => (u < 0.2 ? 100 : 172 - v * 30), saum: ["#ffffff", 0.8, 0.16], schatten: ["#b8b4a8", 0.22, 0.22], lang: 1.6 });
      ri += `<ellipse cx="-4" cy="-14" rx="18" ry="3.6" fill="${T.rg("bauchR", [[0, "#e8dfcf", 0.55], [1, "#e8dfcf", 0]])}"/>` +
        fleck(T, [[16, -40], [10, -21], [-2, -13], [-20, -15], [-6, -16], [8, -24], [14, -35]], "#7a8898", 0.3, 1.2) +
        `<ellipse cx="8" cy="-43" rx="7" ry="5" fill="${T.rg("brustL", [[0, "#fff", 0.9], [1, "#fff", 0]])}"/>` +
        fleck(T, [[3, -42], [10, -43], [8, -39.4], [3, -39.4]], "#6a7888", 0.22, 0.9);
      s += vol(T, "d", teil(T, ei, T.lg("rumpf", [[0, "#ffffff"], [0.45, "#f5f4ef"], [1, "#c8ced4"]]), ri, { licht: LICHT(T, 0.5) }), 0.38, 0.25, "#4a5866");
      /* Flügel: kleine/mittlere/große Decken (Lichtkanten statt Umrisse), Schirmfedern, lange Handschwingen über dem Schwanz */
      s += `<g>`;
      const flug = [[9.4, -46.6], [9.8, -40], [6.2, -33.4], [-2, -27.4], [-13, -23.2], [-26, -21.6], [-38.4, -24.8], [-29, -26.6], [-20, -31.2], [-8, -38.6], [2.4, -45], [6, -46.8]];
      const flugAlt = [[8.4, -47.4], [8.6, -42], [5, -35.8], [-3, -29.4], [-14, -24.4], [-26, -22], [-38.4, -25.4], [-28.6, -27.6], [-18, -31.6], [-6, -38.6], [3, -45.4]];
      s += fleck(T, [[7, -35], [-2, -26], [-14, -21.6], [-26, -20.2], [-14, -20.2], [-2, -24], [6, -31]], "#6a7888", 0.35, 0.8);
      let fi = "";
      K = sammler();
      for (let i = 0; i < (F ? 5 : 3); i++) langfeder(T, [[-12 - i * 1.4, -27 + i * 0.3], [-25 - i * 0.8, -25.6 + i * 0.25], [-38.8 + i * 1.2, -25.6 - i * 0.5]], 3.2, 1.6, T.lg("hand", [[0, "#eef0f2"], [0.6, "#e2e5e8"], [1, "#c8cdd2"]], 0, 0, 0, 1),
        { rund: true, schaft: "#b0b6bc", schaftOp: 0.4, kante: "#ffffff", kanteOp: 0.75, kw: 0.25 }, K);
      fi += K.aus("#8a929c", 0.25, 0.12);
      K = sammler();
      for (let i = 0; i < (F ? 4 : 2); i++) langfeder(T, [[-2 - i * 3, -36 + i * 1.4], [-10 - i * 3, -32 + i * 1], [-17 - i * 2.6, -29 + i * 0.7]], 4.4, 3.6, T.lg("schirm", [[0, "#ffffff"], [0.7, "#f2f2ee"], [1, "#d8dde2"]], 0, 0, 0, 1),
        { rund: true, schaft: "#c0c6cc", schaftOp: 0.35, kante: "#ffffff", kanteOp: 0.8, kw: 0.3 }, K);
      fi += K.aus("#8a929c", 0.3, 0.12);
      const fsD = reihen(T, [[8.8, -45.4], [2, -43.8], [-6, -38.4], [-12, -34]], [[8.4, -38], [2, -32.4], [-6, -28.6], [-12, -27.2]], { v0: 0.06, v1: 1, dv: F ? 0.16 : 0.34, W: (u, v) => (1.4 + v * 2.2) * (F ? 1 : 1.6), abstand: 1.05 });
      fi += fluren(T, fsD, { winkel: (x, y, u, v) => 140 + v * 20, saum: ["#ffffff", 0.85, 0.2], schatten: ["#b4bcc4", 0.3, 0.25], lang: 1.35 });
      s += vol(T, "c", teil(T, flug, T.lg("flug", [[0, "#ffffff"], [0.6, "#f2f2ee"], [1, "#d6dce0"]]), fi, { licht: false }), 0.32, 0.2, "#4a5866");
      /* Schulterfedern: 6 große, längliche, weich gerundete Federn längs auf dem Rücken */
      K = sammler();
      for (let i = 0; i < 5; i++) { const x = 7 - i * 3.6, y = -46.4 + i * 2.7; langfeder(T, [[x + 1, y - 0.5], [x - 2.4, y + 1.6], [x - 5.4, y + 3.8]], 2.6, 2.3, T.lg("schul", [[0, "#ffffff"], [1, "#eceeee"]], 0, 0, 0, 1), { rund: true, kante: "#ffffff", kanteOp: 0.9, kw: 0.25 }, K); }
      s += vol(T, "a", K.aus("#8a929c", 0.3, 0.1), 0.2, 0.15, "#4a5866") + "</g>";
      /* Flankenfedern überdecken den Flügelunterrand */
      let fkd = "M30 -36L10.4 -33.6", fkl = "";
      { let px = 10.4, py = -33.6; const dw = F ? 4.6 : 7;
        for (let x = 10.4 - dw; x > -27; x -= dw) { const y = -30.8 + (7.4 - x) * 0.33, mx = (px + x) / 2, my = (py + y) / 2 - 1.3; const seg = "Q" + J(mx, my, x, y); fkd += seg; fkl += (fkl ? "" : "M" + J(px, py)) + seg; px = x; py = y; }
        fkd += "L-40 -16L-40 0L30 0Z"; }
      const fk = fkd;
      s += `<g clip-path="url(#${T.id("eiK")})">` + `<path d="${fk}" fill="${T.lg("flk", [[0, "#f8f7f2"], [0.6, "#eceae4"], [1, "#d6dbe0"]], 0, -34, 0, -14, ' gradientUnits="userSpaceOnUse"')}"/>` +
        (F ? fluren(T, reihen(T, [[14, -29.6], [0, -27.8], [-24, -20.6]], [[16, -19], [0, -14.6], [-20, -17.4]], { v0: 0.12, v1: 0.85, dv: 0.24, W: () => 3.6, abstand: 1.3 }),
          { winkel: () => 176, saum: ["#ffffff", 0.5, 0.14], schatten: ["#aab2ba", 0.14, 0.3], lang: 2.4, streu: 4 }) + fleck(T, fk, "#7a8898", 0.1, 0.6) + zug(fkl, "#fff", 0.2, 0.6) : "") + "</g>";
      T.def(`<clipPath id="${T.id("eiK")}"><path d="${G(ei)}"/></clipPath>`);
      /* nahes Bein: obere Enden unter dem Bauchgefieder */
      s += vol(T, "k", schwimmfuss(T, Object.assign({}, FUSS, { H: [0.6, -12.2], A: [2, -1.7], w0: 2.3, w1: 1.75, schatten: 0.45 })), 0.4, 0.1, "#6a2a08");
      s += bueschel(T, [[-6, -13.4], [-1.6, -11.6], [3, -11.8], [5, -13.2], [3, -12.6], [-1.4, -12.2], [-5, -13.2]], 14, 0.9, () => 100, [["#dcdcd6", 0.12, 0.9], ["#f6f6f2", 0.1, 0.9]], { szene: 0.3 });
      /* Schnabel und Stirnhöcker: Höcker als eigene Kugel über der Stirnlinie, Knick zum First, langer schlanker Schnabel;
         Unterschnabel gelblicher, Schnabelspalte bis unter das Auge, Nagel als runder Haken, Lamellen, Nasenloch */
      const orange = T.lg("orange", [[0, "#ffb04a"], [0.45, "#f28a1e"], [1, "#c8661a"]]);
      let sn = teil(T, [[21.2, -80.2], [24.6, -79.6], [26.4, -78.6], [28.4, -77.9], [29.9, -77.3], [30.4, -76.6, 1], [29.4, -76.4], [26.4, -76.6], [23.6, -76.9], [21.2, -77.3]], orange,
        F ? zug("M25.2 -79Q27.6 -78.1 29.8 -77.3", "#ffc066", 0.18, 0.55) : "", { licht: false });
      sn += teil(T, [[21.2, -77.3], [23.6, -76.9], [26.4, -76.6], [29.6, -76.35], [29, -75.9], [26, -75.8], [23.2, -76], [21, -76.4]], T.lg("unter", [[0, "#f5a040"], [1, "#d8781e"]]), "", { licht: false });
      sn += `<path d="M29.1 -77.45Q30.6 -77.3 30.4 -76.4Q29.9 -76.1 29.3 -76.4Z" fill="#f7b060"/>`;
      sn += zug("M20 -76.5Q20.6 -77.1 21.2 -77.3L26.4 -76.6L29.8 -76.4", "#7a3a10", 0.1, 0.7);
      if (F) sn += zug("M22.2 -77.15l.1 .18M23 -77.05l.1 .18M23.8 -76.95l.1 .18M24.6 -76.85l.1 .18M25.4 -76.75l.1 .18", "#a8501a", 0.05, 0.3);
      sn += `<ellipse cx="23.7" cy="-78.55" rx=".6" ry=".22" fill="#6a3008" transform="rotate(14 23.7 -78.55)"/>` + zug("M23.1 -78.32Q23.7 -78.15 24.3 -78.25", "#ffc070", 0.07, 0.6);
      /* Höcker */
      sn += teil(T, [[20.2, -80.2], [20.5, -82.2], [21.6, -83.3], [23.2, -83.3], [24.4, -82.2], [24.9, -80.6], [24.4, -79.4], [22, -79.2]], T.rg("hoecker", [[0, "#ffc060"], [0.55, "#f28a1e"], [1, "#c06418"]], 0.38, 0.32, 0.72),
        (F ? `<ellipse cx="21.6" cy="-82.6" rx=".5" ry=".32" fill="#fff" opacity=".5" transform="rotate(-25 21.6 -82.6)"/>` : "") + `<path d="M24.8 -80.6Q24.6 -79.6 24 -79.3" fill="none" stroke="#9a4a10" stroke-width=".22" stroke-opacity=".55"/>`, { licht: false });
      if (!F) sn = `<g transform="translate(22 -80) scale(1.2) translate(-22 80)">${sn}</g>`;
      s += vol(T, "a", sn, 0.3, 0.16, "#7a3008");
      /* Federgrenze am Schnabel als weicher Bogen, schmaler heller Federsaum */
      /* Auge: schmaler orangeroter Lidring, blaue Iris mit Fasern und dunklem Limbus, befiederter Oberlidrand mit Schatten */
      s += vogelauge(T, 18.4, -79.9, 0.6, { iris: "#6a8ebc", iris0: "#9abce0", iris2: "#4a6a90", limbus: "#2a3a50", faser: "#2a4a70", ring: "#e8892c", rb: 0.13, deckel: "#f4f4f0", ober: 0.17, pupille: 0.34, hoehle: "#7a8898", hoehleOp: 0.12 });
      return { svg: s, box: [-39.8, -83.6, 30.6, 0], fuesse: [-0.4, 5.8], kopf: [12, -85.4, 31, -71] };
    } },

  /* ------------------------------------------------------------------ TRUTHAHN */
  { id: "truthahn", de: "der Truthahn", syl: "TRUT-hahn", it: "il tacchino", itSyl: "tac-CHI-no", en: "turkey",
    gruppe: "Vögel", lebensraum: "Bauernhof", laenge: 0.72, hoehe: 0.92,
    /* RECHERCHE: Hausputer, Farbschlag Bronze, balzend („Rad schlagen"): 18 Steuerfedern senkrecht zum Rad gestellt,
       in Seitenansicht perspektivisch zur Ellipse verkürzt und leicht nach hinten gekippt, Nabe über dem Bürzel.
       Steuerfedern kastanienbraun mit feiner, welliger schwarzer Querbänderung, schwarzem Subterminalband mit schmalem
       kupfer-metallischem Band darin und breitem weißem Endsaum (beim Bronzeputer endet der Fächer weiß); darüber die
       Oberschwanzdecken (bronze, schwarzes Band, Kupferband, heller Saum). Körpergefieder aufgeplustert, Federn breit und
       vorn gerade gerundet, kupfer-bronze metallisch (Lichtseite kupfer-gold, Schatten grün-bronze) mit schwarzem
       Endsaum; kleinere Federn am Halsansatz und am Bauch. Flügel gesenkt, Handschwingen erreichen den Boden, Arm- und
       Handschwingen schwarz-weiß gebändert (quer zum Schaft). Kopf und Hals nackt: Scheitel weißlich-hellblau, Gesicht
       blau, Hals rot mit dichten, unregelmäßigen, warzigen Karunkeln; Kehllappen als Hautfalte an der Kehle; Stirnzapfen
       (Snood) entspringt an der Stirn über der Schnabelwurzel, beim Balzen lang, dick an der Basis, hängt neben dem
       Schnabel herab; schwarzer Bart (Borstenbüschel) am vordersten Brustpunkt; Schnabel kräftig, hornfarben, leicht
       gekrümmt; Auge dunkelbraun mit nackter dunkler Lidkante; Ohröffnung mit Borsten hinter dem Auge. Läufe rosa-rötlich,
       vorn große Querschilder, Sporn hinten, 30–35 % über den Zehen. Hahn bis ca. 1 m hoch. Quellen: Wikipedia „Domestic
       turkey", „Wild turkey", „Caruncle (bird anatomy)", extension.org „External anatomy of turkeys", Turkey Club UK
       „Bronze Standard", RBST „Bronze", Kritik Runde 1. */
    zeichne(T) {
      Q = 10;
      const F = T.fein;
      let s = "", K;
      const BEIN = { hell: "#f4c8b8", mittel: "#dc9c8c", dunkel: "#9a5a4c", kralle: "#4a3a30", k: 1.6, zehen: [2.2, 3.8, 4.4, 5.2], schatten: 0.3 };
      s += vol(T, "a", lauf(T, Object.assign({}, BEIN, { H: [1.4, -16.6], A: [3.8, -2], w0: 3.2, w1: 2.6, fern: true, sporn: 2.2 })));
      /* ---- Schwanzfächer im Fächerraum: Nabe (0, 0), Radius 44, zur Ellipse gestaucht und nach hinten gekippt ---- */
      const FT = "translate(-6.4 -47) rotate(-9) scale(.68 1)";
      const R = 44, fed = [];
      for (let i = 0; i < 18; i++) {
        const a = rad(192 + i * 156 / 17), L = R * (0.88 + 0.12 * Math.sin(i / 17 * Math.PI)) * (0.99 + T.rnd() * 0.02);
        const u = [Math.cos(a), Math.sin(a)];
        fed.push({ i, u, L, p: band([[u[0] * 6, u[1] * 6], [u[0] * L * 0.55, u[1] * L * 0.55], [u[0] * L, u[1] * L]], 3.2, 7.8, true) });
      }
      const fstops = [[0, "#2a1a0c"], [0.26, "#5a361a"], [0.3, "#8a5428"], [0.716, "#9a6230"], [0.717, "#140a06"], [0.75, "#140a06"], [0.752, "#8a5a2a"], [0.768, "#c08a48"],
        [0.77, "#140a06"], [0.835, "#140a06"], [0.84, "#6a4422"], [0.852, "#6a4422"], [0.855, "#e8dcc4"], [1, "#f4ecda"]];
      const fg = T.rg("steuer", fstops, 0, 0, 46, ' gradientUnits="userSpaceOnUse"');
      /* feine wellige Querbänderung (schwarz auf kastanienbraun) einmal als Definition, je Feder leicht versetzt */
      const bid = T.id("binden");
      if (F) {
        let b = "";
        for (let r0 = 13; r0 < 32.6; r0 += 0.82) {
          b += "M";
          for (let k = 0; k <= 12; k++) { const a = rad(188 + k * 14), rr = r0 + Math.sin(k * 1.7 + r0) * 0.16; b += (k ? "L" : "") + J(Math.cos(a) * rr, Math.sin(a) * rr); }
        }
        T.def(`<path id="${bid}" d="${b}" fill="none" stroke="#140a06" stroke-width=".26" stroke-opacity=".7"/>`);
      }
      let fz = `<g fill="${fg}" stroke="#1a0e06" stroke-width=".5" stroke-opacity=".22" paint-order="stroke">`;
      const reihenfolge = fed.slice().sort((a, b) => Math.abs(b.i - 8.5) - Math.abs(a.i - 8.5));
      let schaefte = "";
      const klip = ["", ""];
      for (const f of reihenfolge) {
        const fid = T.id("f" + f.i);
        T.def(`<path id="${fid}" d="${G(f.p)}"/>`);
        fz += `<use href="#${fid}"/>`;
        klip[f.i % 2] += `<use href="#${fid}"/>`;
        schaefte += "M" + J(f.u[0] * 6, f.u[1] * 6) + "L" + J(f.u[0] * f.L * 0.98, f.u[1] * f.L * 0.98);
      }
      fz += "</g>";
      if (F) {
        /* Querbänderung je Feder leicht versetzt (gerade/ungerade Federn verschieden skaliert), Schäfte dunkelbraun */
        klip.forEach((k, j) => { const cid = T.id("fk" + j); T.def(`<clipPath id="${cid}">${k}</clipPath>`); fz += `<g clip-path="url(#${cid})"><use href="#${bid}"${j ? ` transform="scale(1.025)"` : ""}/></g>`; });
        fz += zug(schaefte, "#2a1608", 0.22, 0.45);
      }
      /* Oberschwanzdecken: innerer Fächer */
      const dk = [];
      for (let i = 0; i < 14; i++) { const a = rad(196 + i * 148 / 13), L = 27.6 - Math.abs(i - 6.5) * 0.2; dk.push(band([[Math.cos(a) * 5, Math.sin(a) * 5], [Math.cos(a) * L * 0.6, Math.sin(a) * L * 0.6], [Math.cos(a) * L, Math.sin(a) * L]], 3, 7.6, true)); }
      const dg = T.rg("decke", [[0, "#3a2a14"], [0.55, "#7a5426"], [0.72, "#9a6a32"], [0.73, "#140a06"], [0.8, "#140a06"], [0.805, "#9a6a34"], [0.83, "#c49050"], [0.835, "#140a06"], [0.88, "#140a06"], [0.885, "#d8c6a2"], [1, "#e6d8bc"]], 0, 0, 28.5, ' gradientUnits="userSpaceOnUse"');
      fz += `<g fill="${dg}" stroke="#140a06" stroke-width=".45" stroke-opacity=".25" paint-order="stroke">` + dk.map((p) => `<path d="${G(p)}"/>`).join("") + "</g>";
      /* Fächer leicht hohl: Mitte dunkler, Ränder heller; Schlagschatten des Körpers auf die innere rechte untere Zone */
      if (F) fz += `<circle r="44" fill="${T.rg("hohl", [[0, "#000", 0.3], [0.5, "#000", 0.1], [1, "#fff", 0.06]], 0, 0, 44, ' gradientUnits="userSpaceOnUse"')}"/>`;
      s += `<g transform="${FT}">${vol(T, "b", fz, 0.3, 0.12, "#1a0a04")}</g>`;
      s += fleck(T, [[2, -56], [12, -64], [18, -50], [12, -36], [2, -36]], "#000", 0.35, 1.6);
      /* ---- Rumpf: schräges Ei, Brust nach vorn oben, aufgeplustert; Federn breit, vorn gerundet, kupfer-bronze mit
         schwarzem Endsaum (Schiller als Sichel kurz vor dem Saum), Größe von Halsansatz (klein) über Brust/Flanke (groß)
         zum Bauch (mittel); Umriss durch Federspitzen aufgebrochen ---- */
      const rumpf = [[18, -66], [25, -61], [29.6, -53], [30.4, -44], [28, -35], [22, -26.4], [13, -20.6], [3, -19], [-6, -20.6], [-13.6, -25], [-18, -31.6], [-19.6, -40], [-17.6, -49], [-11.6, -57], [-2.6, -62.6], [8, -66]];
      const oben = [[22, -64.4], [8, -65], [-4, -61.4], [-14, -52], [-18.6, -40]], unten = [[30, -46], [26, -30], [12, -20], [-2, -19.8], [-14, -26]];
      const fsR = reihen(T, oben, unten, { v0: 0, v1: 1.04, dv: F ? 0.12 : 0.16, W: (u, v) => (u < 0.12 ? 2.2 + u * 12 : v > 0.82 ? 3 : 4.1) * (F ? 1 : 1.5), abstand: 0.84 });
      const bronze = (c) => [[0, c], [0.66, mische(c, "#2a1a0c", 0.15)], [0.78, mische(c, "#e8b060", 0.4)], [0.85, mische(c, "#4f5a2a", 0.25)], [0.87, "#120d08"], [1, "#0a0604"]];
      let rk = `<path d="${G(rumpf)}" fill="${F ? "#2a1c0e" : "#6a4420"}"/>`;
      if (F) rk += zungen(T, fsR, { richtung: 115, winkel: (x, y, u, v) => (u < 0.18 ? 92 : 100 + v * 30 + u * 20), toene: ["#7a4a1e", "#8a5626", "#94602a"], name: "rF", saum: "#000",
        stops: bronze, sw: 0.6, sop: 0.3, lang: 1.05, zl: 2.8, blatt: true, streu: 16 });
      rk += `<path d="${G(rumpf)}" fill="${T.rg("kugel", [[0, "#ffd890", 0.16], [0.45, "#fff", 0], [0.8, "#000", 0.3], [1, "#000", 0.5]], 0.32, 0.25, 0.8)}"/>`;
      s += vol(T, "d", rk, 0.55, 0.14, "#0a0604");
      /* ---- gesenkter Flügel: Decken bronze, Arm- und Handschwingen schwarz-weiß gebändert (quer zum Schaft), Spitzen am Boden ---- */
      const binden = [0, 0.3, 0.6].map((ph, j) => T.lg("bind" + j, [[0, "#1b1612"], [0.52, "#1b1612"], [0.52, "#e9e4da"], [1, "#e2dccf"]], N(-ph * 0.55), N(ph * 1.5), N(-0.55 - ph * 0.55), N(1.5 + ph * 1.5), ' gradientUnits="userSpaceOnUse" spreadMethod="repeat"'));
      let fl = fleck(T, [[16, -56], [12, -40], [4, -20], [-8, -6], [-12, -8], [-2, -26], [8, -46]], "#000", 0.5, 0.8);
      K = sammler();
      const nS = F ? 9 : 5;
      for (let i = 0; i < nS; i++) {
        const t = i / (nS - 1), b0 = [13.6 - t * 13, -50 + t * 11], tip = [-0.6 - t * 10.4 + (i % 2) * 0.6, -1.4 - t * 3.6 - (i % 2) * 0.6];
        langfeder(T, [b0, lerp(b0, tip, 0.5), tip], F ? 4.2 : 7, F ? 3.4 : 6.4, F ? binden[i % 3] : "#5a5450", { rund: true, schaft: "#1b1612", schaftOp: 0.5 }, K);
      }
      fl += K.aus("#000", 0.45, 0.35);
      /* Schulter- und Flügeldecken: geschlossenes kupferglänzendes Band, unten mit schwarzem Band zu den Schwingen */
      const fsD = reihen(T, [[17.6, -60], [10, -60], [3, -55]], [[15.6, -42], [6, -40], [-2, -38]], { v0: 0.04, v1: 1, dv: F ? 0.17 : 0.25, W: () => (F ? 3.6 : 4.4), abstand: 0.86 });
      fl += `<path d="${G([[18, -61], [16.4, -42], [6, -38.4], [-2.6, -37.4], [0, -50], [8, -59]])}" fill="${F ? "#1a1008" : "#7a4a20"}"/>`;
      if (F) fl += zungen(T, fsD, { richtung: 105, winkel: () => 108, toene: ["#7a4a1e", "#8a5626", "#6e4a22"], name: "dF", saum: "#000", stops: bronze, sw: 0.6, sop: 0.3, lang: 1.05, zl: 2.8, blatt: true });
      s += vol(T, "c", fl, 0.45, 0.12, "#0a0604");
      /* nahes Bein (oben im Bauchschatten), Federn des Unterbauchs darüber */
      s += vol(T, "a", lauf(T, Object.assign({}, BEIN, { H: [8.6, -17.6], A: [11.4, -2], w0: 3.4, w1: 2.7, sporn: 2.6 })));
      /* Bart: am vordersten Brustpunkt, tritt zwischen den Federn hervor, hängt 15–25° nach vorn unten frei vor der Brust */
      let bart = "";
      for (let i = 0; i < (F ? 34 : 12); i++) { const x = 29.4 + (T.rnd() - 0.5) * 1.2, l = 14 + T.rnd() * 3.4, w = (T.rnd() - 0.5) * 3; bart += "M" + J(x, -50.4 + T.rnd() * 0.8) + "q" + J(1.6 + w * 0.2, l * 0.5, 4.6 + w, l); }
      s += zug(bart, "#100a08", 0.3, 0.9) + (F ? zug(bart, "#8a6a40", 0.07, 0.45) : "");
      /* ---- Hals: nackt, dickes, zurückgezogenes S, rot, oben bläulich-purpur; Querfalten am Hinterhals; dichte Traube
         unregelmäßiger, abgeflachter Karunkeln an Vorder- und Seitenfläche, dazwischen dunkle Furchen ---- */
      const hals = [[15, -63], [17.4, -69.6], [20.6, -75], [23.6, -78.6], [27.4, -79.4], [29.6, -77.2], [29, -73.4], [27.6, -69.6], [27.8, -64.6], [28.4, -59.6], [22, -58]];
      let hi = "";
      if (F) {
        hi += zug("M17.4 -66.4q1.4 .6 2.8 .2M18.6 -69.6q1.2 .5 2.6 .1M20.2 -72.6q1.2 .5 2.4 0M22 -75.4q1 .4 2.2 0", "#5a0a12", 0.18, 0.5);
        hi += `<ellipse cx="24.6" cy="-75.6" rx="3" ry="2" fill="${T.rg("purpH", [[0, "#9a6aa8", 0.45], [1, "#9a6aa8", 0]])}"/>`;
        let fu = "", wz = ["", "", ""];
        for (let i = 0; i < 36; i++) {
          const t = T.rnd(), x = 28.6 - t * 3.2 - T.rnd() * (2.4 + t * 1.4), y = -60 - t * 15.6 + (T.rnd() - 0.5) * 0.8, rx = 0.22 + T.rnd() * 0.36, ry = rx * (0.55 + T.rnd() * 0.3);
          fu += `M${J(x - rx * 1.15, y)}a${J(rx * 1.15, ry * 1.15)} 0 1 0 ${J(rx * 2.3, 0)}a${J(rx * 1.15, ry * 1.15)} 0 1 0 ${J(-rx * 2.3, 0)}`;
          wz[Math.floor(T.rnd() * 3)] += `M${J(x - rx, y)}a${J(rx, ry)} 0 1 0 ${J(rx * 2, 0)}a${J(rx, ry)} 0 1 0 ${J(-rx * 2, 0)}`;
        }
        hi += `<path d="${fu}" fill="#5a0f14" opacity=".55"/>` + [["#b3122a"], ["#8e1030"], ["#a8182c"]].map(([c], i) => `<path d="${wz[i]}" fill="${c}"/>`).join("");
      }
      s += vol(T, "c", teil(T, hals, T.lg("hals", [[0, "#b07aa0"], [0.3, "#c04a5a"], [1, "#9a1c26"]], 0, 0, 0.3, 1), hi, {}));
      /* kleine Bronzefedern laufen über den Halsansatz */
      if (F) s += T.haare([[15.4, -64.6], [21, -62.6], [28.4, -60.6], [28.6, -57.6], [22, -59], [15.6, -61.4]], 100, (x) => 100 - (x - 22) * 1.5, 1.4, { farben: [["#8a5626", 1, 0.14, 0.95], ["#5a3a18", 1, 0.12, 0.9], ["#c08a48", 0.5, 0.08, 0.8]], streuung: 22, kruemmung: 0.25 });
      /* Kehllappen: Hautfalte, oben durchgehend an der Kehle angewachsen, nur das untere Drittel hängt frei; warzig */
      s += vol(T, "a", relief(T, "haut", teil(T, [[28.4, -78.8], [30.6, -78], [31.6, -75.2], [31.4, -71.8], [30.4, -68.6], [29, -66.8], [28, -67.6], [28.2, -70.6], [28.6, -74.6]], T.lg("lappen", [[0, "#e8444c"], [0.6, "#c41c26"], [1, "#8a0c14"]], 0, 0, 1, 0),
        F ? zug("M28.8 -78Q30 -73.6 28.6 -69", "#5a0a12", 0.3, 0.35) + fleck(T, `M30.4 -76.4a.4 1.4 0 1 0 .1 0Z`, "#fff", 0.2, 0.3) : "", { licht: false }), { f: 2.6, tiefe: 0.05, okt: 2, k1: 1.06 }));
      /* ---- Kopf: nackt, Scheitel weißlich-hellblau, Gesicht blau, Übergang purpur-rosa zum Hals; feine Falten und Borsten ---- */
      const kopf = [[24.4, -80], [25.2, -82.6], [27.4, -84.2], [30.2, -84.6], [32.4, -83.6], [33.2, -81.6], [32.4, -79.4], [30.4, -78.2], [27.6, -78], [25.4, -78.6]];
      let ki = `<ellipse cx="25.6" cy="-79.4" rx="2.4" ry="1.6" fill="${T.rg("purpK", [[0, "#c870a0", 0.6], [1, "#c870a0", 0]])}"/>`;
      if (F) ki += zug("M28.2 -81.6q.6 .5 .4 1.2M27.4 -80.8q.5 .4 .3 .9M30.8 -80q.6 .2 1 -.1", "#3a4a7a", 0.1, 0.4) +
        zug("M26.6 -83.4l-.3-.7M27.6 -84l-.1-.8M28.8 -84.4l.1-.8M30 -84.6l.2-.8M31.2 -84.4l.3-.7M29.6 -80.4l.5-.5M30.6 -82.6l.6-.3", "#1a1a20", 0.06, 0.7) +
        `<ellipse cx="27" cy="-80.9" rx=".35" ry=".26" fill="#2a2030"/>` + zug("M26.7 -80.9l-.4 -.2M27 -81.2l-.1 -.4M27.3 -81l.3 -.3", "#1a1a20", 0.05, 0.7);
      s += vol(T, "e", teil(T, kopf, T.lg("kopf", [[0, "#e4ecf6"], [0.35, "#a8c4e6"], [0.75, "#6f9fd6"], [1, "#5a80b8"]], 0, 0, 0.3, 1), ki, {}));
      /* Schnabel: kräftig, 30–35 % der Kopflänge, Oberschnabel leicht gekrümmt mit hakiger Spitze, First dunkler, Spalte */
      s += vol(T, "k", teil(T, [[32, -82.6], [33.8, -82.2], [35.6, -80.9], [36.2, -79.6, 1], [35.2, -79.9], [33.4, -79.9], [32, -80.1]], T.lg("schn", [[0, "#cfc0a6"], [0.5, "#e8dcc8"], [1, "#b8a488"]], 0, 0, 1, 0),
        F ? zug("M32.4 -82.4Q34.6 -81.8 35.8 -80.2", "#8a7660", 0.2, 0.5) + zug("M32.6 -82.1Q34.4 -81.6 35.4 -80.5", "#fff", 0.08, 0.6) : "", { licht: false }) +
        teil(T, [[32.2, -80], [34.8, -79.8], [35.6, -79.6], [34.6, -79.2], [32.4, -79.3]], "#b8a488", "", { licht: false }));
      s += zug("M31.4 -79.7Q32.4 -79.95 33.4 -79.9L35.6 -79.65", "#3a2a1a", 0.08, 0.8) + `<ellipse cx="33" cy="-81.6" rx=".38" ry=".14" fill="#3a2a1a" transform="rotate(15 33 -81.6)"/>`;
      /* Auge: dunkelbraun, schmale nackte dunkle Lidkante, Oberlid deckt den oberen Rand, Glanzpunkt zur Lichtquelle */
      s += vogelauge(T, 29.8, -82.1, 0.62, { iris: "#4a2a12", iris0: "#6a3e1a", iris2: "#2a160a", limbus: "#0a0402", ring: "#2a2a44", rb: 0.12, deckel: "#6a88b8", ober: 0.14, pupille: 0.45 });
      /* Snood: entspringt an der Stirn über der Schnabelwurzel, dick an der Basis, verjüngt, Spitze kolbig, hängt neben dem
         Schnabel herab; 8–10 Querfalten, weicher Zylinderglanz an der Lichtkante */
      const snood = [[31.9, -83.2], [33, -83], [33.9, -81.8], [34.3, -80], [34.8, -77.4], [35.4, -74.6], [35.9, -72.4], [35.7, -71.3], [34.9, -71.2], [34.5, -72.6], [33.9, -75.4], [33.1, -78.4], [32.5, -80.6], [31.9, -82.2]];
      let sni = F ? `<path d="${G(snood)}" fill="${T.lg("snoodZ", [[0, "#fff", 0.22], [0.35, "#fff", 0], [1, "#000", 0.3]], 0, 0, 1, 0)}"/>` : "";
      if (F) { let q = ""; for (let i = 0; i < 9; i++) { const t = i / 9, a = auf([[32.6, -82.6], [33.4, -80.2], [33.9, -77], [34.6, -73.6], [35.2, -71.8]], t), w = 1.3 - t * 0.8; q += "M" + J(a[0] - w * 0.6, a[1] - 0.15) + "q" + J(w * 0.6, 0.35, w * 1.2, 0); } sni += zug(q, "#5a0a14", 0.12, 0.5); }
      s += vol(T, "a", teil(T, snood, T.lg("snood", [[0, "#7a1030"], [0.25, "#c8303e"], [1, "#d8404e"]], 0, 0, 0, 1), sni, { licht: false }));
      return { svg: s, box: [-36.4, -91.6, 36.2, 0], fuesse: [8, 15.6], kopf: [22, -86, 37, -66] };
    } },
];
