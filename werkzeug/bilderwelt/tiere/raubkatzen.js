"use strict";
/* =====================================================================
   RAUBKATZEN — Löwe, Löwin, Tiger, Leopard, Jaguar, Gepard, Luchs (FASSUNG 854, MASSSTAB 2, Runde 2)
   Bauplan: alles in „Normmaß“ gezeichnet (Schulterhöhe = 100), am Ende auf cm skaliert.
   Jeder Körperteil (Rumpf mit Hals, Keule mit Hinterbein, Schulter mit Vorderbein, ferne Beine, Schwanz, Kopf, Ohr,
   Mähnenlagen) ist eine eigene Gruppe mit T.volumen → Rundung, Kernschatten, Licht links oben entstehen aus der Form.
   Darüber: Muster (scharf, Kanten fellig ausgefranst), Fell Haar für Haar (dunkler Schaft, helle Spitze) nach
   Wuchsrichtung, feiner Fellsaum am Umriss statt Konturlinie. Kopf im Profil mit eigenem Auge (Iris als verkürzte
   Halbellipse, Lidschatten), flachem Nasenspiegel, dünner werdender Lefze.
   ===================================================================== */
const r = (n) => Math.round(n * 10) / 10;
const f1 = (n) => String(Math.round(n * 10) / 10).replace(/^(-?)0\./, "$1.");
const kurz = (d) => d.replace(/ -/g, "-");
const UB = ' gradientUnits="userSpaceOnUse"';
const RAD = Math.PI / 180;
const SRGB = ' color-interpolation-filters="sRGB"';

/* glatte Kurve (Catmull-Rom), Genauigkeit p (1 = ganze Einheiten, 10 = Zehntel); [x, y, 1] = harte Ecke */
function G(pts, zu = true, p = 2) {
  const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const q = (v) => String(Math.round(v * p) / p).replace(/^(-?)0\./, "$1.");
  let d = `M${q(pts[0][0])} ${q(pts[0][1])}`;
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${q(c1[0])} ${q(c1[1])} ${q(c2[0])} ${q(c2[1])} ${q(p2[0])} ${q(p2[1])}`;
  }
  return kurz(d + (zu ? "Z" : ""));
}
const norm = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const tr = (p, g) => { const c = Math.cos(g.w), s = Math.sin(g.w), x = p[0] * g.k, y = p[1] * g.k; return [g.x + x * c - y * s, g.y + x * s + y * c]; };
const boxOf = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
/* x einer Polylinie (nach y sortiert oder nicht) bei Höhe y – erster Treffer */
function xBei(pl, y) {
  for (let i = 0; i < pl.length - 1; i++) {
    const [x0, y0] = pl[i], [x1, y1] = pl[i + 1];
    if ((y0 - y) * (y1 - y) <= 0 && y0 !== y1) return x0 + (x1 - x0) * (y - y0) / (y1 - y0);
  }
  return null;
}
/* y einer Polylinie bei x */
function yBei(pl, x) {
  for (let i = 0; i < pl.length - 1; i++) {
    const [x0, y0] = pl[i], [x1, y1] = pl[i + 1];
    if ((x0 - x) * (x1 - x) <= 0 && x0 !== x1) return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
  }
  return null;
}
/* Farbe mischen (hex) */
const mische = (a, b, t) => { const h = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); const A = h(a), B = h(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * Math.max(0, Math.min(1, t))).toString(16).padStart(2, "0")).join(""); };

/* Haare: n Haare im Polygon pts, Wuchsrichtung w (Grad oder Funktion (x, y)), Länge L.
   farben: [[farbe, anteil, breite, deckkraft], …]; o.spitze = [farbe, breite, deckkraft] → zweifarbig (Schaft + helle Spitze).
   o.streu (Grad), o.krumm, o.szene (Anteil bei T.fein = false). Je Farbe EIN Pfad, relative Koordinaten. */
function haare(T, pts, n, w, L, farben, o = {}) {
  const [x0, y0, x1, y1] = boxOf(pts);
  const sum = farben.reduce((s, f) => s + f[1], 0), eimer = farben.map(() => "");
  let spitze = "";
  const ziel = Math.round(n * (T.fein ? 1 : (o.szene != null ? o.szene : 0)));
  let v = 0, g = 0;
  while (g < ziel && v < ziel * 20) {
    v++;
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!T.inPoly(x, y, pts)) continue;
    const a = ((typeof w === "function" ? w(x, y) : w) + (T.rnd() - 0.5) * (o.streu != null ? o.streu : 18)) * RAD;
    const l = L * (0.6 + T.rnd() * 0.8), ex = Math.cos(a) * l, ey = Math.sin(a) * l;
    const k = (o.krumm != null ? o.krumm : 0.2) * l * (T.rnd() - 0.5) * 2;
    let u = T.rnd() * sum, i = 0;
    while (i < farben.length - 1 && u > farben[i][1]) { u -= farben[i][1]; i++; }
    const xs = Math.round(x), ys = Math.round(y);
    if (o.spitze && T.rnd() < 0.65) {
      eimer[i] += `M${xs} ${ys}l${f1(ex * 0.62)} ${f1(ey * 0.62)}`;
      spitze += `M${f1(x + ex * 0.55)} ${f1(y + ey * 0.55)}l${f1(ex * 0.45)} ${f1(ey * 0.45)}`;
    } else if (o.spitze) eimer[i] += `M${xs} ${ys}l${f1(ex)} ${f1(ey)}`; else eimer[i] += `M${xs} ${ys}` + (l < 3 ? `l${f1(ex)} ${f1(ey)}` : `q${f1(ex / 2 - Math.sin(a) * k)} ${f1(ey / 2 + Math.cos(a) * k)} ${f1(ex)} ${f1(ey)}`);
    g++;
  }
  const s = eimer.map((d, i) => d ? `<path d="${kurz(d)}" fill="none" stroke="${farben[i][0]}" stroke-width="${farben[i][2]}" stroke-opacity="${farben[i][3]}" stroke-linecap="round"/>` : "").join("");
  return s + (spitze ? `<path d="${kurz(spitze)}" fill="none" stroke="${o.spitze[0]}" stroke-width="${o.spitze[1]}" stroke-opacity="${o.spitze[2]}" stroke-linecap="round"/>` : "");
}
/* Fellsaum am Umriss: kurze Haare, die quer über die Kante hinauslaufen (statt Konturlinie).
   pts = geschlossenes Polygon (beliebige Richtung), nur Kantenstücke, für die nimm(x, y, nx, ny) wahr ist.
   wuchs(x, y) → Winkel (Grad) der Wuchsrichtung; das Haar neigt sich um 'raus' zur Außennormalen. */
function saum(T, pts, schritt, L, hell, dunkel, wuchs, o = {}) {
  if (!T.fein) return "";
  let fl = 0;
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; fl += (b[0] - a[0]) * (b[1] + a[1]); }
  const aus = fl > 0 ? 1 : -1;            /* Umlaufsinn → Außennormale */
  let dh = "", dd = "", rest = T.rnd() * schritt;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-6;
    const nx = (b[1] - a[1]) / l * aus, ny = -(b[0] - a[0]) / l * aus;
    let t = rest;
    for (; t < l; t += schritt * (0.6 + T.rnd() * 0.8)) {
      const x = a[0] + (b[0] - a[0]) * t / l, y = a[1] + (b[1] - a[1]) * t / l;
      if (o.nimm && !o.nimm(x, y, nx, ny)) continue;
      const [wx, wy] = (() => { const g = wuchs(x, y) * RAD; return [Math.cos(g), Math.sin(g)]; })();
      const [hx, hy] = norm(wx + nx * (o.raus || 0.8), wy + ny * (o.raus || 0.8));
      const ll = L * (0.5 + T.rnd() * 0.9);
      const d = `M${Math.round(x - hx * ll * 0.45)} ${Math.round(y - hy * ll * 0.45)}l${f1(hx * ll)} ${f1(hy * ll)}`;
      if (ny < -0.2) dh += d; else dd += d;
    }
    rest = t - l;
  }
  const w = o.breite || 0.3;
  return (dd ? `<path d="${kurz(dd)}" fill="none" stroke="${dunkel}" stroke-width="${w}" stroke-opacity="${o.op || 0.7}" stroke-linecap="round"/>` : "") +
    (dh ? `<path d="${kurz(dh)}" fill="none" stroke="${hell}" stroke-width="${w}" stroke-opacity="${o.op || 0.7}" stroke-linecap="round"/>` : "");
}
/* weich gezeichnete Formen (Licht-/Schattenflächen): [pts, farbe, deckkraft] | [x, y, rx, ry, winkel, farbe, deckkraft] | "svg" */
function weich(T, name, liste, sd, extra = "") {
  const id = T.id("bl" + name);
  if (!weich.schon) weich.schon = new WeakMap();
  let s = weich.schon.get(T); if (!s) weich.schon.set(T, (s = new Set()));
  if (!s.has(id)) { s.add(id); T.def(`<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"${SRGB}><feGaussianBlur stdDeviation="${sd}"/></filter>`); }
  const e = liste.map((el) => {
    if (typeof el === "string") return el;
    const [x, y, rx, ry, w, c, o] = el;
    if (Array.isArray(x)) return `<path d="${G(x, true, 1)}" fill="${y}" fill-opacity="${rx}"/>`;
    return `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rx)}" ry="${r(ry)}"${w ? ` transform="rotate(${w} ${r(x)} ${r(y)})"` : ""} fill="${c}" fill-opacity="${o}"/>`;
  }).join("");
  return `<g filter="url(#${id})">${e}${extra}</g>`;
}
/* Fransen-Filter: verschiebt Kanten (Muster, Fell) mit gestrecktem Rauschen → haarige statt glatter Ränder.
   fx/fy Frequenz (je Einheit), s Stärke, achse "x" | "y". In Szenen kein Filter. */
function fransen(T, n, fx, fy, s, achse = "x") {
  if (!T.fein) return "";
  const id = T.id("fr" + n);
  if (!fransen.schon) fransen.schon = new WeakMap();
  let m = fransen.schon.get(T); if (!m) fransen.schon.set(T, (m = new Set()));
  if (!m.has(id)) {
    m.add(id);
    const cm = achse === "x" ? "1 0 0 0 0  0 0 0 0 .5  0 0 0 0 0  0 0 0 0 1" : "0 0 0 0 .5  1 0 0 0 0  0 0 0 0 0  0 0 0 0 1";
    T.def(`<filter id="${id}" x="-3%" y="-3%" width="106%" height="106%"${SRGB}><feTurbulence type="fractalNoise" baseFrequency="${fx} ${fy}" numOctaves="2" seed="5"/>` +
      `<feColorMatrix values="${cm}"/><feDisplacementMap in="SourceGraphic" scale="${s}" xChannelSelector="R" yChannelSelector="G"/></filter>`);
  }
  return ` filter="url(#${id})"`;
}
/* Band entlang einer Mittellinie, Breite w (an der Wurzel), spitz zulaufend; stumpf = oben volle Breite */
function band(T, mp, w, stumpf = false, w1 = 0.02) {
  const n = mp.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = mp[Math.max(0, i - 1)], b = mp[Math.min(n - 1, i + 1)];
    const [dx, dy] = norm(b[0] - a[0], b[1] - a[1]);
    const t = i / (n - 1);
    const prof = stumpf ? Math.max(w1, Math.pow(1 - t, 0.7)) : Math.max(w1, Math.pow(Math.sin(Math.PI * t), 0.6));
    const ww = w * prof * (0.85 + T.rnd() * 0.3) / 2;
    L.push([mp[i][0] - dy * ww, mp[i][1] + dx * ww]); R.push([mp[i][0] + dy * ww, mp[i][1] - dx * ww]);
  }
  return G(L.concat(R.reverse()), true, T.fein ? 2 : 1);
}
/* sich verjüngender Strich als Fläche (Lefze, Tasthaar): w0 → w1 */
function strichBand(pts, w0, w1, p = 10) {
  const n = pts.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    const [dx, dy] = norm(b[0] - a[0], b[1] - a[1]), ww = (w0 + (w1 - w0) * i / (n - 1)) / 2;
    L.push([pts[i][0] - dy * ww, pts[i][1] + dx * ww]); R.push([pts[i][0] + dy * ww, pts[i][1] - dx * ww]);
  }
  return G(L.concat(R.reverse()), true, p);
}
/* Mittellinie → Kanten (Schwanz) */
function rohr(J) {
  const n = J.length, V = [], H = [];
  for (let i = 0; i < n; i++) {
    const a = J[Math.max(0, i - 1)], b = J[Math.min(n - 1, i + 1)];
    const [dx, dy] = norm(b[0] - a[0], b[1] - a[1]);
    V.push([J[i][0] + dy * J[i][2], J[i][1] - dx * J[i][2]]);
    H.push([J[i][0] - dy * J[i][3], J[i][1] + dx * J[i][3]]);
  }
  return { V, H };
}
/* Punkt auf einer Mittellinie bei Anteil u: [x, y, tx, ty] */
function linienPunkt(J) {
  const seg = [];
  for (let i = 0; i < J.length - 1; i++) seg.push([J[i], J[i + 1], Math.hypot(J[i + 1][0] - J[i][0], J[i + 1][1] - J[i][1])]);
  const ges = seg.reduce((s, q) => s + q[2], 0);
  return (u) => {
    let l = u * ges;
    for (let i = 0; i < seg.length; i++) { const [a, b, L] = seg[i]; if (l <= L || i === seg.length - 1) { const t = Math.min(1, l / L), [tx, ty] = norm(b[0] - a[0], b[1] - a[1]); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, tx, ty]; } l -= L; }
  };
}
/* Haarlocke (Mähne, Bart): Wurzel R, Richtung d, Länge L, Breite b, Schwung s (−1…1).
   Liefert [helle Hälfte, dunkle Hälfte, Mittellinie] – die obere (lichtzugewandte) Hälfte hell. */
function locke(R, d, L, b, s) {
  const [dx, dy] = norm(d[0], d[1]), nx = -dy, ny = dx;
  const C = [0, 0.3, 0.62, 1].map((t, i) => {
    const off = [0, 0.13, -0.07, 0.05][i] * s * L;
    return [R[0] + dx * L * t + nx * off, R[1] + dy * L * t + ny * off];
  });
  const W = [b * 0.42, b * 0.5, b * 0.34, 0];
  const A = C.map((p, i) => [p[0] + nx * W[i], p[1] + ny * W[i]]), B = C.map((p, i) => [p[0] - nx * W[i], p[1] - ny * W[i]]);
  const hellA = ny < 0;                       /* Seite A zeigt nach oben → hell */
  const hA = A.slice(0, 3).concat([C[3]], C.slice(1, 3).reverse()), hB = B.slice(0, 3).concat([C[3]], C.slice(1, 3).reverse());
  hA.push(C[0]); hB.push(C[0]);
  return { hell: hellA ? hA : hB, dunkel: hellA ? hB : hA, mitte: C, A, B };
}
const punkte = (pp, w = 0.65, c = "#1e140c", op = 0.7) => `<path d="M${pp.map(([x, y]) => f1(x) + " " + f1(y) + "h0").join("M")}" stroke="${c}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round"/>`;
/* Tasthaare: verjüngt (Wurzel w0 → Spitze 0), gebogen; liste [x, y, winkel, länge, biegung] */
function tasthaare(liste, farbe = "#fbf7ee", w0 = 0.4, op = 0.7) {
  let d = "";
  for (const [x, y, a, L, b] of liste) {
    const [dx, dy] = [Math.cos(a * RAD), Math.sin(a * RAD)], nx = -dy, ny = dx;
    const m = [x + dx * L * 0.5 + nx * b * L * 0.12, y + dy * L * 0.5 + ny * b * L * 0.12], e = [x + dx * L + nx * b * L * 0.3, y + dy * L + ny * b * L * 0.3];
    d += `M${f1(x - nx * w0 / 2)} ${f1(y - ny * w0 / 2)}Q${f1(m[0] - nx * w0 / 4)} ${f1(m[1] - ny * w0 / 4)} ${f1(e[0])} ${f1(e[1])}Q${f1(m[0] + nx * w0 / 4)} ${f1(m[1] + ny * w0 / 4)} ${f1(x + nx * w0 / 2)} ${f1(y + ny * w0 / 2)}Z`;
  }
  return `<path d="${kurz(d)}" fill="${farbe}" fill-opacity="${op}"/>`;
}
/* Volumen je Körperteil (wie T.volumen in kern.js, Licht links oben, Kernschatten zur Unterkante), zusätzlich wird das
   Licht vor dem Einrechnen leicht geglättet – sonst entstehen im 8-Bit-Alpha „Höhenlinien“ (Terrassen). Szene: kein Filter. */
function volumen(T, n, o = {}) {
  if (!T.fein) return "";
  const w0 = o.weich || 6, w = w0 < 2 ? 1.6 : w0 < 3.5 ? 2.6 : w0 < 5.2 ? 4.4 : w0 < 8 ? 6.5 : 10, el = 52, amb = 0.45;
  o = { tiefe: 3 };
  const id = T.id("vo" + String(w).replace(".", "_") + "_" + String(o.tiefe || 4).replace(".", "_") + "_" + String(amb).replace(".", "_"));
  if (!volumen.schon) volumen.schon = new WeakMap();
  let m = volumen.schon.get(T); if (!m) volumen.schon.set(T, (m = new Set()));
  if (!m.has(id)) {
    m.add(id);
    T.def(`<filter id="${id}" x="-6%" y="-6%" width="112%" height="112%"${SRGB}><feGaussianBlur in="SourceAlpha" stdDeviation="${w}" result="b"/>` +
      `<feDiffuseLighting in="b" surfaceScale="${o.tiefe || 4}" diffuseConstant="1" lighting-color="#fff" result="d"><feDistantLight azimuth="${o.azimut || 225}" elevation="${el}"/></feDiffuseLighting>` +
      `<feGaussianBlur in="d" stdDeviation="${r(Math.max(0.4, w * 0.18))}"/><feColorMatrix values="1 0 0 0 0 0 1.1 0 0 -.1 0 0 1.25 0 -.25 0 0 0 1 0" result="e"/>` +
      `<feComposite in="e" in2="SourceGraphic" operator="arithmetic" k1="${Math.round((1 - amb) / Math.sin(el * RAD) * 1000) / 1000}" k2="0" k3="${amb}" k4="0" result="m"/>` +
      `<feComposite in="m" in2="SourceGraphic" operator="in"/></filter>`);
  }
  return ` filter="url(#${id})"`;
}
/* Haarbündel-Locken (Mähne, Bart, Quaste): liste [[R, d, L, b, schwung, farbe], …] (fern zuerst).
   Je Locke: schlanke Grundform (Mittelton), Lichtband auf der lichtzugewandten Seite, darüber 6–12 Strähnen, die zur
   Spitze zusammenlaufen und etwas über sie hinausragen (weiche, haarige Spitzen statt Kanten). Kein Weichzeichner. */
function lockenBuendel(T, liste, o = {}) {
  const grund = {}, licht = {};
  let sd = "", sh = "", sm = "";
  const nS = T.fein ? (o.straehnen || 9) : 0;
  for (const [R, d, L, b, sw, c] of liste) {
    const lk = locke(R, d, L, b, sw);
    const form = lk.A.slice(0, 3).concat([lk.mitte[3]], lk.B.slice(0, 3).reverse());
    grund[c] = (grund[c] || "") + G(form, true, 2);
    const oben = lk.A[0][1] + lk.A[1][1] < lk.B[0][1] + lk.B[1][1] ? lk.A : lk.B;
    const band = [0, 1, 2].map((i) => lerp(lk.mitte[i], oben[i], 0.85)).concat([lerp(lk.mitte[2], lk.mitte[3], 0.5)], [0, 1, 2].map((i) => lerp(lk.mitte[i], oben[i], 0.2)).reverse());
    const cl = mische(c, o.licht || "#ffeec0", o.lichtStaerke || 0.28);
    licht[cl] = (licht[cl] || "") + G(band, true, 2);
    for (let j = 0; j < nS; j++) {
      const u = (j + 0.5) / nS * 2 - 1, src = u > 0 ? lk.A : lk.B, au = Math.abs(u);
      const p0 = lerp(lk.mitte[0], src[0], au * 0.95), p1 = lerp(lk.mitte[1], src[1], au * 0.8);
      const k = 1.03 + T.rnd() * 0.2, tip = lk.mitte[3], ex = (tip[0] - p0[0]) * k + (T.rnd() - 0.5) * b * 0.3, ey = (tip[1] - p0[1]) * k + (T.rnd() - 0.5) * b * 0.3;
      const seg = `M${f1(p0[0])} ${f1(p0[1])}q${f1(p1[0] - p0[0])} ${f1(p1[1] - p0[1])} ${f1(ex)} ${f1(ey)}`;
      const hellSeite = src === oben;
      if (hellSeite && au > 0.25) sh += seg; else if (!hellSeite && au > 0.3) sd += seg; else sm += seg;
    }
  }
  const w = o.strW || 0.3;
  return Object.entries(grund).map(([c, d]) => `<path d="${d}" fill="${c}"/>`).join("") +
    Object.entries(licht).map(([c, d]) => `<path d="${d}" fill="${c}" fill-opacity=".75"/>`).join("") +
    (sd ? `<path d="${kurz(sd)}" fill="none" stroke="${o.dunkel || "#1a0c04"}" stroke-width="${w}" stroke-opacity=".5" stroke-linecap="round"/>` : "") +
    (sm ? `<path d="${kurz(sm)}" fill="none" stroke="${o.mittel || "#6a4220"}" stroke-width="${w}" stroke-opacity=".45" stroke-linecap="round"/>` : "") +
    (sh ? `<path d="${kurz(sh)}" fill="none" stroke="${o.hell || "#f8dc9c"}" stroke-width="${w * 0.85}" stroke-opacity=".55" stroke-linecap="round"/>` : "");
}
/* Strähnen-Feld (Mähne, Bart, Krause, Quaste): nK Büschel, je pro Strähnen. Jede Strähne ist eine spitz zulaufende,
   leicht gebogene Fläche (Wurzelbreite w0), Büschel teilen Richtung, Schwung und Grundton → Locken ohne harte Kanten.
   fl(x, y) → Richtung [dx, dy]; ton(x, y) → 0 … 1 (Stufe der Farbrampe, dunkel → hell). Dunkle Stufen zuerst. */
function straehnen(T, feld, nK, pro, fl, L0, L1, w0, rampe, ton, o = {}) {
  const [x0, y0, x1, y1] = boxOf(feld), eimer = rampe.map(() => "");
  const nKz = Math.round(nK * (T.fein ? 1 : (o.szeneK || 0.5))), proZ = T.fein ? pro : Math.max(2, Math.round(pro * (o.szeneP || 0.4)));
  const q = (v) => (T.fein ? String(Math.round(v * 2) / 2).replace(/^(-?)0\./, "$1.") : String(Math.round(v)));
  let k = 0, v = 0;
  const sitze = [];
  while (k < nKz && v < nKz * 50) {
    v++;
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!T.inPoly(x, y, feld)) continue;
    sitze.push([x, y]); k++;
  }
  if (o.sortiere) sitze.sort(o.sortiere);
  for (const [x, y] of sitze) {
    const [dx0, dy0] = fl(x, y), rot = (T.rnd() - 0.5) * (o.streu || 0.3);
    const dx = dx0 * Math.cos(rot) - dy0 * Math.sin(rot), dy = dx0 * Math.sin(rot) + dy0 * Math.cos(rot);
    const L = (L0 + T.rnd() * (L1 - L0)) * (o.laenge ? o.laenge(x, y) : 1), sw = (T.rnd() - 0.5) * L * (o.schwung || 0.35), t0 = ton(x, y) + (T.rnd() - 0.5) * (o.tonStreu || 0.3);
    for (let j = 0; j < proZ; j++) {
      const ox = (T.rnd() - 0.5) * w0 * 3, oy = (T.rnd() - 0.5) * w0 * 3;
      const rx = x + ox * Math.abs(dy) + (T.rnd() - 0.5) * L * 0.15 * dx, ry = y + oy * Math.abs(dx) + (T.rnd() - 0.5) * L * 0.15 * dy;
      const l = L * (0.7 + T.rnd() * 0.45), w = w0 * (0.6 + T.rnd() * 0.7), s2 = sw * (0.8 + T.rnd() * 0.4), nx = -dy, ny = dx;
      const mx = dx * l * 0.5 + nx * s2, my = dy * l * 0.5 + ny * s2, ex = dx * l + nx * s2 * 0.6, ey = dy * l + ny * s2 * 0.6;
      const t = Math.max(0, Math.min(0.999, t0 + (T.rnd() - 0.5) * (o.strStreu || 0.25)));
      /* Linsenform: an der Wurzel und an der Spitze spitz, breiteste Stelle im ersten Drittel → keine abgeschnittenen Enden */
      const c1x = mx * 0.6 + nx * w, c1y = my * 0.6 + ny * w, c2x = mx * 0.6 - nx * w, c2y = my * 0.6 - ny * w;
      eimer[Math.floor(t * rampe.length)] += `M${q(rx)} ${q(ry)}q${q(c1x)} ${q(c1y)} ${q(ex)} ${q(ey)}q${q(c2x - ex)} ${q(c2y - ey)} ${q(-ex)} ${q(-ey)}z`;
    }
  }
  return eimer.map((d, i) => (d ? `<path d="${kurz(d)}" fill="${rampe[i]}"${o.op ? ` fill-opacity="${o.op}"` : ""}/>` : "")).join("");
}
/* Haarlocken (Mähne, Bart, Krause, Quaste) – Kritik Runde 2: „S-förmige Locken, spitz zulaufend, in Dachziegel-Reihen,
   Lichtkante oben, Kernschatten unten, dunkle Spalten, an den Spitzen feine Haare über die Form hinaus, kein Weichzeichner“.
   liste: [[R (Wurzel), d (Richtung), L, b (Wurzelbreite), schwung (−1…1), farbe], …] in Zeichenreihenfolge (fern zuerst).
   Je Locke: S-förmige Form mit 2–3 Spitzen (Mittelton), darauf Strähnen entlang der Mittellinie – oben heller, unten dunkler,
   die längsten laufen über die Spitze hinaus. Strähnen gleicher Farbe in EINEM Pfad. */
function haarLocken(T, liste, o = {}) {
  const F = T.fein, q = (v) => String(Math.round(v * 2) / 2).replace(/^(-?)0\./, "$1."), formen = {};
  const str = { h: "", m: "", d: "" };
  const nS = F ? (o.straehnen || 7) : 0;
  for (const [R, d0, L, b, sw, c] of liste) {
    const [dx, dy] = norm(d0[0], d0[1]), nx = -dy, ny = dx;
    const oben = ny < 0 ? 1 : -1;                                    /* Seite zur Lichtquelle (oben) */
    const C = (t) => { const off = Math.sin(t * Math.PI * 1.15) * sw * L * 0.12 - t * t * sw * L * 0.06; return [R[0] + dx * L * t + nx * off, R[1] + dy * L * t + ny * off]; };
    const Wd = (t) => b * 0.5 * Math.min(1, (o.wurzel != null ? o.wurzel : 0.4) + t * 2.2) * Math.pow(Math.max(0, 1 - t), 0.85);
    /* Umriss: zwei Spitzen mit Kerbe, Flanken als Bögen – relative Koordinaten, wenige Bytes */
    const w0 = Wd(0), wm = Wd(0.4) * 1.25, L0 = [R[0] + nx * w0, R[1] + ny * w0], R0 = [R[0] - nx * w0, R[1] - ny * w0];
    const t1 = C(0.98 + T.rnd() * 0.1), t2 = C(0.9 + T.rnd() * 0.1), kerb = C(0.8), mm = C(0.42);
    const tA = [t1[0] + nx * b * 0.14, t1[1] + ny * b * 0.14], tB = [t2[0] - nx * b * 0.14, t2[1] - ny * b * 0.14];
    const c1 = [mm[0] + nx * wm, mm[1] + ny * wm], c2 = [mm[0] - nx * wm, mm[1] - ny * wm];
    const rel = (p, o) => `${q(p[0] - o[0])} ${q(p[1] - o[1])}`;
    formen[c] = (formen[c] || "") + `M${q(L0[0])} ${q(L0[1])}q${rel(c1, L0)} ${rel(tA, L0)}l${rel(kerb, tA)}l${rel(tB, kerb)}q${rel(c2, tB)} ${rel(R0, tB)}z`;
    for (let j = 0; j < nS; j++) {
      const u = (j + 0.5) / nS * 2 - 1, t0 = 0.04 + T.rnd() * 0.1, t1 = 0.92 + T.rnd() * 0.22;
      const P0 = C(t0), P1 = C((t0 + t1) / 2), P2 = C(t1), w0 = Wd(t0) * u * 0.85, w1 = Wd((t0 + t1) / 2) * u * 0.8;
      const a = [P0[0] + nx * w0, P0[1] + ny * w0], m = [P1[0] + nx * w1, P1[1] + ny * w1], e = [P2[0] + nx * u * b * 0.12, P2[1] + ny * u * b * 0.12];
      const seg = `M${q(a[0])} ${q(a[1])}q${q(2 * m[0] - (a[0] + e[0]) / 2 - a[0])} ${q(2 * m[1] - (a[1] + e[1]) / 2 - a[1])} ${q(e[0] - a[0])} ${q(e[1] - a[1])}`;
      const seite = u * oben;
      if (seite > 0.3) str.h += seg; else if (seite < -0.2) str.d += seg; else str.m += seg;
    }
  }
  const w = o.strW || 0.32;
  return Object.entries(formen).map(([c, d]) => `<path d="${kurz(d)}" fill="${c}"/>`).join("") +
    (str.d ? `<path d="${kurz(str.d)}" fill="none" stroke="${o.dunkel || "#1a0c04"}" stroke-width="${w}" stroke-opacity="${o.dOp || 0.5}" stroke-linecap="round"/>` : "") +
    (str.m ? `<path d="${kurz(str.m)}" fill="none" stroke="${o.mittel || "#7a4a20"}" stroke-width="${w}" stroke-opacity=".45" stroke-linecap="round"/>` : "") +
    (str.h ? `<path d="${kurz(str.h)}" fill="none" stroke="${o.hell || "#f6d496"}" stroke-width="${w * 0.9}" stroke-opacity="${o.hOp || 0.6}" stroke-linecap="round"/>` : "");
}

/* =====================================================================
   VORLAGE einer Großkatze (Normmaß: Schulterhöhe 100, Sitzbeinhöcker x ≈ 0, Blick nach rechts, Boden y = 0).
   Proportionen nach Löwen-/Tiger-Fotos: Bug bis Sitzbein ≈ 1,2 × Schulterhöhe, Brustbein ≈ 0,47 über dem Boden,
   Knie auf Höhe der Bauchlinie (≈ 0,52), Fersenhöcker 0,27–0,29, Ellbogenhöcker auf Brustbeinhöhe.
   Teile: R Rückenlinie, U Unterlinie, hn Keule + nahes Hinterbein (Z-Form: Knie vorn, Unterschenkel schräg nach
   hinten, Fersenhöcker, steiler Mittelfuß), vn Schulter + nahes Vorderbein (Ellbogenhöcker, Unterarm oben breit,
   Handwurzelballen, leicht vorgeneigte Mittelhand). Pfoten als Kuppel mit drei Zehenwölbungen.
   ===================================================================== */
const VORLAGE = {
  R: [[4, -91], [10, -95.5], [18, -97.5], [28, -97.5], [40, -96], [54, -94.5], [66, -94.5], [76, -96], [84, -98.5], [92, -100], [100, -99.5]],
  U: [[121, -66], [119.5, -58], [115, -51], [107, -47.5], [97, -46.8], [86, -47.8], [74, -50], [62, -52], [52, -53.2], [45, -55], [40, -58.5],
    [34, -62], [20, -65], [6, -68], [-1, -76], [-2.5, -84], [0, -89]],
  hn: {
    oben: [[2, -91.5], [10, -95.6], [18, -97.6], [28, -97.6], [37, -96.6]],
    V: [[42, -94], [46.5, -86], [50, -76], [52, -66], [51.6, -59.4], [48.8, -54.6], [43.6, -50.8], [36.8, -46], [29.6, -40.6], [22.6, -35], [17, -30.6],
      [13.8, -27], [12.8, -22], [12.9, -16.5], [13.5, -11]],
    H: [[0, -89.5], [-1.6, -83], [-2.2, -74], [-1, -65], [1.4, -57], [3.2, -50], [3.8, -44], [2.8, -38], [1.4, -31.6], [0.2, -27.2], [1.6, -24], [4, -20],
      [5.6, -15], [6.8, -11]],
    zehe: 21, ph: 8.2,
  },
  vn: {
    oben: [[80, -97.4], [86, -99.1], [92, -100.1], [98, -99.7], [104, -98.6]],
    V: [[110, -94.5], [115, -84], [119.2, -72.5], [120.8, -66], [119.4, -59], [116, -52.5], [113.6, -47], [112.7, -41], [112.1, -33], [111.1, -26],
      [110.4, -20], [110.3, -15.5], [110.9, -11.5]],
    H: [[79, -94], [81, -86], [85, -74], [88, -64], [89.5, -56], [90.8, -50.5], [92.6, -47], [94.4, -44.5], [95.7, -40], [97.4, -32], [98.8, -25],
      [99.4, -21.4], [97.8, -18.6], [99.2, -15.2], [100.8, -11.5]],
    zehe: 118, ph: 9.6,
  },
  /* gemalte Muskel- und Lichtformen (über dem Volumen, weich, warm): Rückenlicht, Schulterblatt mit Grat, Trizeps mit
     Schatten dahinter, Achsel, Kernschatten unten, Bodenreflex am Bauch, Oberschenkel (Licht oben vorn, Schatten hinten),
     Muskelfurche, Kniefalte */
  formen: [
    [[[20, -96.5], [60, -93.5], [90, -98.5], [90, -95], [60, -90.5], [20, -93]], "#fff3d6", 0.28],
    [[[88, -97], [100, -97], [112, -84], [114, -74], [104, -78], [92, -88]], "#fff3d6", 0.18],
    [[[92, -95.5], [95.5, -95.5], [110, -74], [106.5, -74]], "#fff6e0", 0.32],
    [[[88.5, -93], [91.5, -93], [104, -72], [100.5, -72]], "#4a2408", 0.16],
    [[[80, -90], [84, -90], [90, -64], [92.5, -54], [88.5, -54], [84.5, -66]], "#4a2408", 0.28],
    [[[85, -84], [90, -82], [96, -66], [92, -64]], "#fff3d6", 0.18],
    [92, -52.5, 4, 4, 0, "#3a1806", 0.42],
    [[[44, -64], [70, -60.5], [96, -57.5], [112, -56], [106, -49.5], [92, -48.5], [70, -51.5], [48, -56.5]], "#4a2408", 0.28],
    [[[48, -55.8], [70, -51.3], [96, -48.2], [96, -47.4], [70, -50.4], [48, -54.9]], "#ffe8c0", 0.32],
    [[[18, -92], [36, -93], [44, -84], [42, -72], [30, -76], [16, -84]], "#fff3d6", 0.26],
    [[[-1, -86], [3, -88], [8, -74], [8, -62], [4, -58], [1, -68]], "#4a2408", 0.26],
    [[[9, -88], [10.6, -88], [15, -62], [13.4, -62]], "#4a2408", 0.18],
    [[[44, -80], [47, -80], [49, -62], [45.5, -57], [43, -62]], "#4a2408", 0.22],
    [44, -55, 3, 3, 0, "#3a1806", 0.3], [50.5, -62, 2, 3.4, 0, "#fff3d6", 0.35],
  ],
  formenH: [[48, -57, 2.6, 2.2, 0, "#fff3d6", 0.35], [[[5, -44], [7, -44], [6, -30], [4.6, -30]], "#4a2408", 0.3],
    [[[2.5, -44], [3.7, -44], [1.9, -30], [1.1, -30]], "#fff3d6", 0.35], [1.6, -28.6, 1.3, 1, 0, "#ffffff", 0.3],
    [[[36, -47], [38, -47], [17, -31], [15.5, -31]], "#fff3d6", 0.26], [[[3.4, -50], [6, -50], [8, -36], [5, -32]], "#4a2408", 0.22], [[[12.8, -22], [13.4, -22], [13.6, -13], [13, -13]], "#fff3d6", 0.2]],
  formenV: [[92.5, -49, 2, 2, 0, "#fff3d6", 0.35], [[[112.4, -44], [113.2, -44], [111.2, -24], [110.2, -24]], "#fff3d6", 0.26],
    [[[95.6, -42], [97.2, -42], [99.6, -24], [98.4, -24]], "#4a2408", 0.3], [98.6, -16.2, 1.6, 1, 0, "#4a2408", 0.4]],
  schwanz: [[2.5, -84], [-1.5, -80.5], [-5.5, -74], [-8.5, -64], [-10, -53], [-9.8, -42], [-7.6, -32], [-3.6, -24.5], [1, -20]],
};
/* Pfotenkuppel: von der Fessel vorn über drei Zehenwölbungen zur Zehenspitze, Sohle, Ballen hinten */
function pfote(V, H, zehe, ph) {
  const a = V[V.length - 1], b = H[H.length - 1], x0 = b[0] - 0.7, dx = zehe - a[0];
  const P = (t, h) => [a[0] + dx * t, -ph * h];
  const kuppe = [P(0.12, 1.12), P(0.3, 1.07), P(0.44, 1.0), P(0.53, 0.955), P(0.63, 0.94), P(0.73, 0.86), P(0.8, 0.79), P(0.89, 0.66),
    P(0.97, 0.45), [zehe, -ph * 0.22], [zehe - 0.7, -ph * 0.04], [zehe - 2.4, 0, 1], [x0 + 2.6, 0, 1], [x0 - 0.3, -ph * 0.24], [x0 + 0.1, -ph * 0.6]];
  return { kuppe, kerben: [P(0.53, 0.955), P(0.8, 0.79)], knoechel: [P(0.35, 1.05), P(0.66, 0.92), P(0.9, 0.66)], sohle: [x0, zehe] };
}
/* Beindicke um die Mittellinie skalieren (unterhalb ab) */
function dicke(L, f, ab) {
  const c = (y) => { const a = xBei(L.V, y), b = xBei(L.H, y); return a != null && b != null ? (a + b) / 2 : null; };
  const sk = (p) => { if (p[1] < ab) return p; const m = c(p[1]); if (m == null) return p; const t = Math.min(1, (p[1] - ab) / 6); return [m + (p[0] - m) * (1 + (f - 1) * t), p[1]]; };
  return Object.assign({}, L, { V: L.V.map(sk), H: L.H.map(sk) });
}
/* Scherung (ferne Beine): oben verankert, unten um dx verschoben */
const schere = (pts, dx, y0, y1) => pts.map(([x, y, h]) => { const t = Math.max(0, Math.min(1, (y - y0) / (y1 - y0))); const q = [x + dx * t * t * (3 - 2 * t), y]; if (h) q.push(1); return q; });

/* Grundriss einer Art aus der Vorlage.  P: { rumpf (Länge Lende/Brustkorb), bein (Beinlänge), dickeV, dickeH (Beindicke),
   brust (Brust tiefer, Einheiten), taille (Bauch hochgezogen), tailleX, kruppe (Kruppe höher), pfoteV/H (Länge), fernV/fernH
   (Schritt der fernen Beine), R/U/hn/vn (eigene Linien) } */
function grundriss(P = {}) {
  const V0 = VORLAGE;
  const leg = (L, f, fp) => {
    const D = dicke(L, f, P.dickeAb || -58);
    const pf = pfote(D.V, D.H, D.V[D.V.length - 1][0] + (L.zehe - L.V[L.V.length - 1][0]) * fp, L.ph * Math.sqrt(fp));
    return { oben: L.oben, V: D.V, H: D.H, pf };
  };
  /* Keule schmaler (Gepard): Punkte oberhalb y = −50 zur Mitte x ≈ 22 ziehen */
  const keule = (L) => (P.keule ? Object.assign({}, L, { V: L.V.map(([x, y]) => [y < -50 ? 22 + (x - 22) * P.keule : x, y]), H: L.H.map(([x, y]) => [y < -50 ? 22 + (x - 22) * P.keule : x, y]) }) : L);
  const hn0 = leg(keule(P.hn || V0.hn), P.dickeH || 1, P.pfoteH || 1), vn0 = leg(P.vn || V0.vn, P.dickeV || 1, P.pfoteV || 1);
  const fern = (L, dx, y0, y1) => {
    const V = schere(L.V, dx, y0, y1), H = schere(L.H, dx, y0, y1);
    return { oben: L.oben, V, H, pf: { kuppe: schere(L.pf.kuppe, dx, y0, y1), kerben: schere(L.pf.kerben, dx, y0, y1), knoechel: schere(L.pf.knoechel, dx, y0, y1), sohle: L.pf.sohle.map((x) => x + dx) } };
  };
  const hf0 = fern(hn0, P.fernH != null ? P.fernH : 13, -82, -14), vf0 = fern(vn0, P.fernV != null ? P.fernV : -12.5, -66, -14);
  const sr = P.rumpf || 1, b = P.bein || 1, s = 100 / (50 + 50 * b);
  const tx = P.taillenX || 52, tb = P.taillenB || 26;
  const X = (x) => (x < 40 ? x : x < 100 ? 40 + (x - 40) * sr : x + 60 * (sr - 1));
  const Y = (y) => (y > -50 ? y * b : y - 50 * (b - 1));
  const F = (p) => { const q = [X(p[0]) * s, Y(p[1]) * s]; if (p[2]) q.push(1); return q; };
  const unten = (p) => {
    let [x, y] = p;
    if (P.brust) { const w = x < 70 ? 0 : x < 92 ? (x - 70) / 22 : x < 110 ? 1 : Math.max(0.25, 1 - (x - 110) / 14); y += P.brust * w; }
    if (P.taille) { const w = Math.abs(x - tx) < tb ? Math.cos((x - tx) / tb * Math.PI / 2) ** 2 : 0; y -= P.taille * w; }
    return [x, y];
  };
  const oben = (p) => { const [x, y] = p; return P.kruppe ? [x, y - P.kruppe * Math.max(0, 1 - x / 60)] : p; };
  const M = (pts, f = (p) => p) => pts.map((p) => F(f(p)));
  const L2 = (L) => ({ oben: M(L.oben, oben), V: M(L.V, oben), H: M(L.H, oben),
    pf: { kuppe: M(L.pf.kuppe), kerben: M(L.pf.kerben), knoechel: M(L.pf.knoechel), sohle: L.pf.sohle.map((x) => X(x) * s) } });
  const geo = {
    R: M(P.R || V0.R, oben), U: M(P.U || V0.U, unten),
    hn: L2(hn0), hf: L2(hf0), vn: L2(vn0), vf: L2(vf0),
    formen: (P.formen || V0.formen).map((f) => Array.isArray(f[0]) ? [f[0].map((p) => F(f[0] && p[0] > 60 && p[1] > -66 ? unten(p) : oben(p))), f[1], f[2]] : (() => { const q = F([f[0], f[1]]); return [q[0], q[1], f[2] * s, f[3] * s, f[4], f[5], f[6]]; })()),
    formenH: V0.formenH.map((f) => Array.isArray(f[0]) ? [f[0].map((p) => F(p)), f[1], f[2]] : (() => { const q = F([f[0], f[1]]); return [q[0], q[1], f[2] * s, f[3] * s, f[4], f[5], f[6]]; })()),
    formenV: V0.formenV.map((f) => Array.isArray(f[0]) ? [f[0].map((p) => F(p)), f[1], f[2]] : (() => { const q = F([f[0], f[1]]); return [q[0], q[1], f[2] * s, f[3] * s, f[4], f[5], f[6]]; })()),
    schwanz: (P.schwanz || V0.schwanz).map(([x, y], i, all) => { const q = F(oben([x, y])), w0 = (P.schwanzW || [2.4, 1.8])[0], w1 = (P.schwanzW || [2.4, 1.8])[1], w = w0 + (w1 - w0) * i / (all.length - 1); return [q[0], q[1], w, w]; }),
    F: (p) => F(p), s,
  };
  for (const k of ["hn", "hf", "vn", "vf"]) { const L = geo[k]; L.pts = L.oben.concat(L.V, L.pf.kuppe, L.H.slice().reverse()); }
  return geo;
}

/* =====================================================================
   DIE KATZE — A: { hs (cm), P (Grundriss), fell/beinFell/innen (Verläufe in Normmaß, y −105…0), haar, kopf, muster …}
   ===================================================================== */
function katze(T, A) {
  const geo = grundriss(A.P);
  const B = [], box = (pts) => { for (const p of pts) { if (isNaN(p[0]) || isNaN(p[1])) throw new Error("NaN " + JSON.stringify(pts).slice(0, 200)); B.push(p); } return pts; };
  const F = T.fein;
  const def = (n, d) => { const id = T.id(n); T.def(`<path id="${id}" d="${d}"/>`); return id; };
  const Gp = (pts) => G(pts, true, F ? 2 : 1);
  const use = (id, extra = "") => `<use href="#${id}"${extra}/>`;
  const clipDef = (n, ids) => { const id = T.id(n); T.def(`<clipPath id="${id}">${ids.map((i) => use(i)).join("")}</clipPath>`); return `clip-path="url(#${id})"`; };
  const fell = T.lg("fell", A.fell, 0, -108, 0, 0, UB);
  const bfell = T.lg("bfell", A.beinFell || A.fell, 0, -108, 0, 0, UB);
  const ffell = T.lg("ffell", A.fernFell || A.beinFell || A.fell, 0, -108, 0, 0, UB);
  const H = A.haar;
  const vol = (n, w, o = {}) => volumen(T, n, Object.assign({ weich: w, tiefe: 3.2, umgebung: 0.42 }, o));
  /* einfache Rundung für Szenen (dort liefert T.volumen keinen Filter) */
  const szeneVol = (id, quer) => F ? "" : use(id, ` fill="${quer ? T.lg("svx", [[0, "#fff", 0.12], [0.5, "#fff", 0], [1, "#2a1206", 0.28]], 0, 0, 1, 0) : T.lg("svy", [[0, "#fff", 0.2], [0.45, "#fff", 0], [0.8, "#2a1206", 0.22], [1, "#2a1206", 0.35]])}"`);
  const kopfG = A.kopf;
  if (!A.kopfFest) { const c0 = [121, -66], c1 = geo.U[0]; kopfG.x += c1[0] - c0[0]; kopfG.y += c1[1] - c0[1]; A.kopfFest = true; }
  const gk = { x: kopfG.x, y: kopfG.y, k: kopfG.k / 100, w: (kopfG.w || 0) * RAD };
  /* Hals: Nackenlinie vom Widerrist zum Hinterhaupt, Kehle vom Kiefer zur Brust */
  const N = tr(kopfG.nacken, gk), Q = tr(kopfG.kehle, gk), Wr = geo.R[geo.R.length - 1], C = geo.U[0];
  const hals = [lerp(Wr, N, 0.5).map((v, i) => v + (i ? -(A.nackenWoelbung || 1.5) : 0)), N, tr([kopfG.nacken[0] + 25, kopfG.nacken[1] + 12], gk),
    tr([kopfG.kehle[0] + 8, kopfG.kehle[1] - 10], gk), Q, lerp(Q, C, 0.5).map((v, i) => v + (i ? 0 : 1))];
  const rumpf = box(geo.R.concat(hals, geo.U));
  let s = "";
  const muster = A.muster ? A.muster(T, geo, { rumpf }) : null;   /* { id: Musterpfad-Gruppe in defs, fern(leg, n) → svg, schwanz → svg } */
  const musterUse = muster && muster.id ? use(muster.id) : "";
  const haarFarben = H.farben, spitze = H.spitze;
  /* ---------- Bein-Inhalt (fern/nah gleich gebaut) ---------- */
  const beinInhalt = (L, n, anz, wuchs) => {
    let i = "";
    const pd = L.pf;
    i += haare(T, L.pts, anz, wuchs, H.L * 0.8, haarFarben, { spitze, szene: 0 });
    /* Zehenfurchen als weiche Schattenkerben, Knöchellichter, Fellbüschel an der Sohle */
    /* drei Zehenhöcker: Licht auf jeder Wölbung, schmale weiche Schattenkerbe dazwischen (kein Strich) */
    if (F) i += weich(T, "pf", pd.kerben.map(([x, y]) => `<path d="M${f1(x - 0.6)} ${f1(y + 0.2)}q1 ${f1(-y * 0.3)} .9 ${f1(-y * 0.55)}l.8 0q-.2 ${f1(y * 0.3)} -1.1 ${f1(y * 0.55)}z" fill="#4a1e06" fill-opacity=".4"/>`)
      .concat(pd.knoechel.map(([x, y]) => [x, y + 1.4, 1.8, 1.2, 0, "#fff6e4", 0.4])), 0.25);
    if (A.krallen) {
      /* halb einziehbare Krallen (Gepard): kurze, stumpfe, dunkle Hornspitzen vorn an den Zehen */
      const [x0, x1] = pd.sohle, ph = -pd.knoechel[0][1];
      let k = "";
      /* zwei sichtbare Krallen: kurz, stumpf, leicht gebogen, dunkles Horn mit hellerer Spitze */
      for (const t of [0.04, 0.24]) { const x = x1 - (x1 - x0) * t * 0.6 - 0.8, y = -ph * (0.3 - t * 0.5) - 0.3; k += `M${f1(x)} ${f1(y)}q1 .1 1.3 ${f1(-y * 0.8)}`; }
      i += `<path d="${k}" fill="none" stroke="#2a2018" stroke-width=".7" stroke-linecap="round"/><path d="${k}" fill="none" stroke="#b8a890" stroke-width=".22" stroke-linecap="round" stroke-opacity=".6"/>`;
    }
    if (F) {
      let d = "";
      for (const [x] of pd.kerben) for (let j = 0; j < 3; j++) d += `M${f1(x + 1 + j * 0.5)} -.4l${f1(0.3 + T.rnd() * 0.5)} ${f1(0.5 + T.rnd() * 0.4)}`;
      i += `<path d="${d}" stroke="${A.pfotenHaar || "#e8d6b4"}" stroke-width=".25" stroke-opacity=".8" fill="none" stroke-linecap="round"/>`;
    }
    return i;
  };
  /* ---------- ferne Beine: gleiche Fellfarbe (Innenseite), nur ~25 % dunkler, mit Form ---------- */
  for (const [n, L] of [["hf", geo.hf], ["vf", geo.vf]]) {
    box(L.pts.filter((p) => p[1] > -60));
    const id = def(n, G(L.pts.filter((p) => p[1] > -76), true, F ? 2 : 1));
    const cl = clipDef(n + "c", [id]);
    s += `<g${vol(n, 2.6)}>${use(id, ` fill="${A.fernFell ? ffell : bfell}"`)}<g ${cl}>${muster && muster.fern ? muster.fern(L, n) : ""}${beinInhalt(L, n, H.nBein, (x, y) => 94)}` +
      use(id, ` fill="${A.fernDunkel || "#4a2208"}" fill-opacity="${A.fernDeck || 0.22}"`) + szeneVol(id, true) + `</g></g>`;
  }
  /* ---------- Schwanz ---------- */
  const sw = rohr(geo.schwanz), swPts = box(sw.V.concat(sw.H.slice().reverse()));
  const swId = def("sw", Gp(swPts)), swCl = clipDef("swc", [swId]);
  s += `<g${vol("sw", 1.1, { tiefe: 3 })}>${use(swId, ` fill="${A.schwanzFell ? T.lg("swf", A.schwanzFell) : bfell}"`)}<g ${swCl}>${muster && muster.schwanz ? muster.schwanz(T, geo) : ""}` +
    haare(T, swPts, H.nSchwanz || 40, 100, H.L, haarFarben, { spitze, szene: 0 }) + szeneVol(swId, true) + `</g>` +
    saum(T, swPts, 4, H.L * 0.5, H.saumHell, H.saumDunkel, () => 100, { op: 0.3, breite: 0.2, raus: 0.4 }) + `</g>`;
  if (A.schwanzEnde) s += A.schwanzEnde(T, geo);
  /* ---------- Rumpf mit Hals ---------- */
  const rId = def("ru", Gp(rumpf)), rCl = clipDef("ruc", [rId]);
  const hnId = def("hn", Gp(box(geo.hn.pts))), vnId = def("vn", Gp(box(geo.vn.pts)));
  const imTeil = (x, y) => T.inPoly(x, y, geo.hn.pts) || T.inPoly(x, y, geo.vn.pts);
  const wuchsR = A.wuchs || ((x, y) => { const t = Math.max(0, Math.min(1, (y + 98) / 46)); return x > 112 ? 125 - t * 20 : 176 - t * 56; });
  /* Unterlage der Keule ohne Maske: so bleibt die Silhouette am Schwanzansatz geschlossen */
  s += `<g${vol("hn", A.keuleWeich || 4.6)}>${use(hnId, ` fill="${bfell}"`)}</g>`;
  s += `<g${vol("ru", A.rumpfWeich || 9)}>${use(rId, ` fill="${fell}"`)}<g ${rCl}>` +
    (F ? weich(T, "rf", geo.formen.map((f) => (A.formStaerke ? (Array.isArray(f[0]) ? [f[0], f[1], f[2] * A.formStaerke] : f.slice(0, 6).concat([f[6] * A.formStaerke])) : f)), 3) : "") +
    musterUse + haare(T, rumpf, H.nRumpf, wuchsR, H.L, haarFarben, { spitze }) +
    (A.rumpfExtra ? A.rumpfExtra(T, geo) : "") + szeneVol(rId) + (F && T.rauschen && A.textur ? `<rect x="-20" y="-120" width="180" height="90" filter="${T.rauschen("fell", { fx: 0.12, fy: 0.9, farbe: A.textur[0], staerke: 2.4, schwelle: 0.55, okt: 2 })}" opacity="${A.textur[1]}"/>` : "") + `</g>` +
    saum(T, rumpf, 4 * (A.saumSchritt || 1), H.L * 0.55 * (A.saumL || 1), H.saumHell, H.saumDunkel, wuchsR, { nimm: (x, y) => !imTeil(x, y) && x < N[0] - 4, op: 0.35, breite: 0.2, raus: 0.5 }) + `</g>`;
  /* ---------- Keule + nahes Hinterbein ---------- */
  const imRumpf = (x, y) => T.inPoly(x, y, rumpf);
  const wuchsH = (x, y) => (y < -60 ? 120 : y < -40 ? 105 : 94);
  const maske = (n, x1, y1, x2, y2) => { if (!F) return ""; const id = T.id(n); T.def(`<mask id="${id}" maskUnits="userSpaceOnUse" x="-40" y="-130" width="260" height="140"><rect x="-40" y="-130" width="260" height="140" fill="${T.lg(n + "g", [[0, "#000"], [1, "#fff"]], x1, y1, x2, y2, UB)}"/></mask>`); return ` mask="url(#${id})"`; };
  s += `<g${maske("hnm", 0, -80, 0, -66)}><g${vol("hn", A.keuleWeich || 4.6)}>${use(hnId, ` fill="${bfell}"`)}<g ${clipDef("hnc", [hnId])}>` + (F ? weich(T, "lf", geo.formenH, 0.7) : "") + musterUse +
    beinInhalt(geo.hn, "hn", H.nKeule, wuchsH) +
    (A.keuleExtra ? A.keuleExtra(T, geo) : "") + szeneVol(hnId, true) + `</g>` +
    saum(T, geo.hn.pts, 4.5 * (A.saumSchritt || 1), H.L * 0.55 * (A.saumL || 1), H.saumHell, H.saumDunkel, wuchsH, { nimm: (x, y) => (!imRumpf(x, y) && y < -20) || y < -88, op: 0.35, breite: 0.2, raus: 0.5 }) + `</g></g>`;
  /* ---------- Schulter + nahes Vorderbein ---------- */
  const wuchsV = (x, y) => (y < -60 ? 108 : 93);
  s += `<g${maske("vnm", 0, -84, 0, -68)}><g${vol("vn", A.schulterWeich || 4.2)}>${use(vnId, ` fill="${bfell}"`)}<g ${clipDef("vnc", [vnId])}>` + (F ? weich(T, "lf", geo.formenV, 0.7) : "") + musterUse +
    beinInhalt(geo.vn, "vn", H.nSchulter, wuchsV) +
    (A.schulterExtra ? A.schulterExtra(T, geo) : "") + szeneVol(vnId, true) + `</g>` +
    saum(T, geo.vn.pts, 4.5 * (A.saumSchritt || 1), H.L * 0.55 * (A.saumL || 1), H.saumHell, H.saumDunkel, wuchsV, { nimm: (x, y) => !imRumpf(x, y) && y < -20, op: 0.35, breite: 0.2, raus: 0.5 }) + `</g></g>`;
  /* ---------- Kopf (mit Mähne/Krause) ---------- */
  if (A.hinterKopf) s += A.hinterKopf(T, geo, box, gk);
  s += kopf(T, A, box, gk);
  if (A.vorKopf) s += A.vorKopf(T, geo, box, gk);
  else if (A.ohrSpaeter) s += `<g transform="${A.kopfTf}">${A.ohrSpaeter}</g>`;
  const k = A.hs / 100, bx = boxOf(B);
  const fuesse = ["vn", "hn", "vf", "hf"].map((n) => Math.round((geo[n].pf.sohle[0] + geo[n].pf.sohle[1]) / 2 * k));
  return { svg: `<g transform="scale(${k})">${s}</g>`, box: [Math.round(bx[0] * k), Math.round(bx[1] * k), Math.round(bx[2] * k), 0], fuesse,
    kopf: A.kopfBox ? A.kopfBox.map((v) => Math.round(v * k)) : undefined };
}

/* =====================================================================
   KOPF im Profil (lokal: Kopflänge 100 Einheiten, Nase rechts, y nach unten).
   Hinterkopf blendet über eine Maske weich in den Hals (keine Naht). Eigene Volumen-Gruppe.
   K: { x, y, k, w, umriss, nacken, kehle, fade:[x0,x1], fell, zonen, formen, muster, haarN, haarL, weich,
        auge:{x,y,w,…}, nase:{pts,farbe,loch,…}, lefze:[pts], lefzeB:[w0,w1], punkte, tasthaare, ohr:{…}, extra }
   ===================================================================== */
function kopf(T, A, box, g) {
  const K = A.kopf, F = T.fein;
  const welt = K.umriss.map((p) => tr(p, g));
  const ohrW = K.ohr ? K.ohr.pts.concat(K.ohr.spitze ? [[30.6, -74]] : []).map((p) => tr(p, g)) : [];
  box(welt); box(ohrW);
  A.kopfBox = boxOf(welt.concat(ohrW, A.kopfExtraBox || []));
  const id = T.id("kp"), mid = T.id("km"), cid = T.id("kc");
  T.def(`<path id="${id}" d="${G(K.umriss, true, F ? 2 : 1)}"/><clipPath id="${cid}"><use href="#${id}"/></clipPath>` +
    `<mask id="${mid}" maskUnits="userSpaceOnUse" x="-60" y="-100" width="260" height="220"><rect x="-60" y="-100" width="260" height="220" fill="${T.lg("kfade", [[0, "#000"], [1, "#fff"]], K.fade[0], 0, K.fade[1], 0, UB)}"/></mask>`);
  const vol = volumen(T, "kopf", { weich: K.weich || 6, tiefe: 3, umgebung: 0.45 });
  let s = "";
  /* Ohr: eigene Gruppe mit Volumen */
  let ohr = "";
  if (K.ohr) {
    const O = K.ohr, oid = T.id("oh");
    T.def(`<path id="${oid}" d="${G(O.pts, true, 4)}"/><clipPath id="${oid}c"><use href="#${oid}"/></clipPath>`);
    ohr = `<g${volumen(T, "ohr", { weich: O.weich || 2, tiefe: 2.5, umgebung: 0.5 })}><use href="#${oid}" fill="${O.farbe}"/>` +
      `<g clip-path="url(#${oid}c)">${O.innen || ""}</g>${O.spitze || ""}${O.saum ? saum(T, O.pts, 0.7, O.saum[0], O.saum[1], O.saum[2], () => -90, { op: 0.45, breite: 0.22, raus: 2 }) : ""}</g>`;
  }
  if (K.ohr && !K.ohr.vorn) s += ohr;
  const kfell = T.lg("kfell", K.fell, 0, -45, 0, 32, UB);
  s += `<g mask="url(#${mid})"><g${vol}><use href="#${id}" fill="${kfell}"/><g clip-path="url(#${cid})">` +
    weich(T, "kz" + String(K.zonenWeich || 0.9).replace(".", ""), (K.zonen || []).map((z) => z.slice(0, 3)), K.zonenWeich || 0.9) +
    /* Fellkante der hellen Gesichtsflecken: Haare in Fleckfarbe laufen über den Rand */
    (F ? (K.zonen || []).filter((z) => z[3]).map((z) => { const c = z[0].reduce((a, q) => [a[0] + q[0] / z[0].length, a[1] + q[1] / z[0].length], [0, 0]);
      const gr = z[0].map(([x, y]) => [c[0] + (x - c[0]) * 1.12, c[1] + (y - c[1]) * 1.12]);
      return haare(T, gr, 42, (x, y) => (x > 76 && y < -6 ? 196 : y > 12 ? 168 : x < 52 ? 162 : 186), 2.2, [[z[1], 1, 0.4, 0.75]], { streu: 30 }); }).join("") : "") + (F ? weich(T, "kf", K.formen || [], 2.2) : "") + (K.muster || "") +
    (F ? haare(T, K.umriss, K.haarN || 160, K.wuchs || ((x, y) => (x > 76 && y < -6 ? 196 : y > 12 ? 168 : x < 52 ? 162 : 186)), K.haarL || 2.2, K.haarFarben, { spitze: K.haarSpitze }) : "") +
    (F ? "" : `<use href="#${id}" fill="${T.lg("ksz", [[0, "#fff", 0.16], [0.5, "#fff", 0], [1, "#3a1806", 0.3]])}"/>`) +
    `</g>` + saum(T, K.umriss, 2.4, (K.haarL || 2.2) * 0.7, K.saum ? K.saum[0] : "#f6e6c8", K.saum ? K.saum[1] : "#8a6034",
      K.wuchs || ((x, y) => (y > 10 ? 168 : 190)), { nimm: (x, y) => x > K.fade[1] - 4, op: 0.5, breite: 0.35 }) + `</g></g>`;
  /* Einzelheiten (nicht vom Volumenfilter gedämpft) */
  let d = "";
  if (K.nase) d += nase(T, K.nase);
  if (K.lefze) d += `<path d="${strichBand(K.lefze, K.lefzeB ? K.lefzeB[0] : 1.5, K.lefzeB ? K.lefzeB[1] : 0.45)}" fill="#120a06"/>`;
  if (K.kinnLinie) d += `<path d="${G(K.kinnLinie, false, 4)}" fill="none" stroke="#4a3018" stroke-opacity=".35" stroke-width=".7" stroke-linecap="round"/>`;
  if (K.punkte) d += punkte(K.punkte, K.punktB || 0.65, "#1e140c", 0.72);
  if (K.auge) d += augeP(T, K.auge);
  if (K.tasthaare && F) d += tasthaare(K.tasthaare, K.tasthaarFarbe || "#fbf7ee", K.tasthaarB || 0.4);
  if (K.extra) d += K.extra;
  s += d;
  if (K.ohr && K.ohr.vorn) A.ohrSpaeter = ohr;
  const tf = `translate(${r(g.x)} ${r(g.y)})rotate(${K.w || 0})scale(${K.k / 100})`;
  A.kopfTf = tf;
  return `<g transform="${tf}">${s}</g>`;
}

/* Auge im Profil (Großkatzen blicken nach vorn → Iris verkürzt als hochovale, vorn angeschnittene Halbellipse).
   o: { x, y, w (Breite der Lidspalte), offen, winkel, iris, iris2, ring (heller Ring um Pupille), lid, falte (Lidwulst-Farbe),
        kerbe (Strich am inneren Winkel: Länge), traene (Gepard) } */
function augeP(T, o) {
  const { x, y, w } = o, h = w * (o.offen || 0.44), F = T.fein;
  const Fv = [x + w * 0.5, y + w * 0.07], Hk = [x - w * 0.5, y - w * 0.05];
  const oben = `M${f1(Hk[0])} ${f1(Hk[1])}C${f1(x - w * 0.26)} ${f1(y - h * 1.02)} ${f1(x + w * 0.2)} ${f1(y - h * 1.08)} ${f1(Fv[0])} ${f1(Fv[1])}`;
  const unten = `C${f1(x + w * 0.22)} ${f1(y + h * 0.66)} ${f1(x - w * 0.24)} ${f1(y + h * 0.62)} ${f1(Hk[0])} ${f1(Hk[1])}`;
  const id = T.id("au");
  T.def(`<clipPath id="${id}"><path d="${kurz(oben + unten)}Z"/></clipPath>`);
  const ix = x + w * 0.1, iy = y + h * 0.04, irx = w * 0.36, iry = h * 1.02;
  const ig = T.rg("iris", [[0, o.ring || mische(o.iris, "#fff4c0", 0.25)], [0.32, o.iris], [0.78, o.iris], [0.93, o.iris2], [1, "#120802"]], 0.58, 0.5, 0.55);
  let s = `<g transform="rotate(${o.winkel || 0} ${f1(x)} ${f1(y)})">`;
  s += `<path d="${kurz(oben + unten)}Z" fill="#160c06"/><g clip-path="url(#${id})">`;
  s += `<ellipse cx="${f1(ix)}" cy="${f1(iy)}" rx="${f1(irx)}" ry="${f1(iry)}" fill="${ig}"/>`;
  if (F) {
    let fa = "";
    for (let i = 0; i < 26; i++) {
      const a = i / 26 * Math.PI * 2 + T.rnd() * 0.1, a2 = a + (T.rnd() - 0.5) * 0.25;
      fa += `M${f1(ix + w * 0.03 + Math.cos(a) * irx * 0.42)} ${f1(iy + Math.sin(a) * iry * 0.42)}L${f1(ix + Math.cos(a2) * irx * 0.92)} ${f1(iy + Math.sin(a2) * iry * 0.92)}`;
    }
    s += `<path d="${kurz(fa)}" stroke="${o.iris2}" stroke-width="${f1(w * 0.018) || 0.1}" stroke-opacity=".5" fill="none"/>`;
  }
  s += `<circle cx="${f1(ix + w * 0.03)}" cy="${f1(iy)}" r="${f1(w * 0.125)}" fill="#050302"/>`;
  s += `<rect x="${f1(x - w)}" y="${f1(y - h * 1.3)}" width="${f1(2 * w)}" height="${f1(h * 1.12)}" fill="${T.lg("lidsch", [[0, "#000", 0.9], [0.62, "#000", 0.55], [1, "#000", 0]])}"/>`;
  s += `<circle cx="${f1(x + w * 0.19)}" cy="${f1(y - h * 0.22)}" r="${f1(w * 0.034)}" fill="#fff" opacity=".9"/>`;
  s += `<ellipse cx="${f1(x + w * 0.02)}" cy="${f1(y + h * 0.42)}" rx="${f1(w * 0.08)}" ry="${f1(h * 0.07)}" fill="#fff" opacity=".22"/>`;
  s += `</g>`;
  /* Lidränder: schwarz, unten etwas dicker; Lidwulst hell darüber; feuchter Rand unten */
  s += `<path d="${kurz(oben)}" fill="none" stroke="${o.lid || "#0a0604"}" stroke-width="${f1(w * 0.055)}" stroke-linecap="round"/>`;
  s += `<path d="M${f1(Fv[0])} ${f1(Fv[1])}${kurz(unten)}" fill="none" stroke="${o.lid || "#0a0604"}" stroke-width="${f1(w * 0.07)}" stroke-linecap="round"/>`;
  s += `<path d="M${f1(Hk[0] + w * 0.08)} ${f1(Hk[1] - h * 0.32)}C${f1(x - w * 0.22)} ${f1(y - h * 1.32)} ${f1(x + w * 0.2)} ${f1(y - h * 1.38)} ${f1(Fv[0] - w * 0.06)} ${f1(Fv[1] - h * 0.42)}" fill="none" stroke="${o.falte || "#f4e6c8"}" stroke-opacity=".3" stroke-width="${f1(w * 0.04)}" stroke-linecap="round"/>`;
  if (F) s += `<path d="M${f1(x + w * 0.3)} ${f1(y + h * 0.42)}Q${f1(x)} ${f1(y + h * 0.6)} ${f1(x - w * 0.32)} ${f1(y + h * 0.3)}" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="${f1(w * 0.025)}"/>`;
  if (o.kerbe) s += `<path d="M${f1(Fv[0] - w * 0.02)} ${f1(Fv[1])}l${f1(w * 0.08)} ${f1(o.kerbe * 0.9)}" stroke="#120a04" stroke-width="${f1(w * 0.07)}" stroke-linecap="round" stroke-opacity=".75" fill="none"/>`;
  return s + `</g>`;
}
/* Nasenspiegel im Profil: flacher Keil, bündig mit der Lippe; schmaler Nasenloch-Schlitz, Nasenfurche, kühler Glanz oben */
function nase(T, o) {
  const d = G(o.pts, true, 10);
  let s = `<path d="${d}" fill="${T.lg("nase", [[0, mische(o.farbe, "#ffffff", 0.12)], [1, mische(o.farbe, "#000000", 0.25)]])}"/>`;
  if (o.flecken) s += punkte(o.flecken, o.fleckB || 0.9, "#1a0e0a", 0.6);
  if (T.fein && T.relief) s += `<g opacity=".1" filter="${T.relief("nase", { f: 2.6, tiefe: 0.4, okt: 2 })}"><path d="${d}" fill="${o.farbe}"/></g>`;
  s += `<path d="${o.loch}" fill="none" stroke="#120806" stroke-width="${o.lochB || 0.75}" stroke-linecap="round"/>`;
  if (o.furche) s += `<path d="${o.furche}" fill="none" stroke="#2a1410" stroke-opacity=".6" stroke-width=".45" stroke-linecap="round"/>`;
  s += `<path d="${o.glanz}" fill="none" stroke="#eef4fa" stroke-opacity=".55" stroke-width=".55" stroke-linecap="round"/>`;
  return s;
}

/* =====================================================================
   LÖWE (Männchen)
   RECHERCHE (Britannica, San Diego Zoo, Univ. Free State; Kritik Runde 1): Kopf-Rumpf 1,8–2,1 m + Schwanz 0,9–1 m,
   Schulterhöhe ~1,2 m, 170–230 kg. Vorderhand massig (Unterarme deutlich dicker als die Hinterbeine), tiefe Brust,
   Lende kurz, Bauchlinie steigt zur Flanke, lose Bauchfalte. Kopf 10–15 % größer und kantiger als bei der Löwin:
   lange, gerade, leicht gewölbte „Römernase“, Brauenwulst, hohe kastige Schnauze mit senkrechter Oberlippe und
   gewölbtem Schnurrhaarpolster (4–5 Reihen Punkte), kräftiges rundes cremeweißes Kinn, schwarze Lefze, Mundwinkel unter
   dem hinteren Augenwinkel. Nasenspiegel rosa-braun mit schwarzen Pigmentflecken (alter Kater). Augen bernstein,
   runde Pupille, heller Fleck unter dem Auge; keine Tränenlinie. Ohren klein, rund, halb in der Mähne, Rückseite dunkel.
   Mähne in drei Zonen: kurzer heller Gesichtskranz (Wange, Kieferwinkel), lange gelb- bis mittelbraune Nacken- und
   Halsmähne (fällt vom Gesicht strahlenförmig nach hinten-unten, endet über dem Schulterblatt), dunkelste Brustmähne
   (hängt senkrecht zwischen den Vorderbeinen bis Ellbogenhöhe, vor dem nahen Vorderbein). Ellbogenbüschel, dunkle
   Bauchfransen. Schwanz hängt, schwingt im unteren Drittel nach vorn; schwarzbraune spindelförmige Quaste.
   ===================================================================== */
function loewe(T) {
  const A = {
    hs: 115, kopfFest: true,
    P: { rumpf: 0.9, brust: 5, taille: 4, fernH: 13, fernV: -12.5, dickeV: 1.08, dickeH: 0.88, schwanzW: [2.4, 1.7] }, textur: ["#5a3612", 0.12],
    fell: [[0, "#9c7040"], [0.1, "#ab7e4a"], [0.3, "#bc8f58"], [0.46, "#c69e68"], [0.53, "#d0ae80"], [0.6, "#dcc49c"], [1, "#e2cca6"]],
    beinFell: [[0, "#9c7040"], [0.1, "#ab7e4a"], [0.3, "#bc8f58"], [0.55, "#c39a62"], [0.8, "#c6a06c"], [1, "#cca878"]],
    haar: { L: 3, nRumpf: 80, nKeule: 32, nSchulter: 28, nBein: 14, nSchwanz: 10,
      farben: [["#7a5226", 1, 0.17, 0.22]], spitze: ["#f6e0b4", 0.15, 0.28], saumHell: "#d8b47c", saumDunkel: "#a07444" },
    rumpfWeich: 10,
  };
  /* ---------- Kopf: 100 Einheiten = 46 Normmaß (≈ 54 cm) ---------- */
  const K = A.kopf = kopfVorlage(T, {
    x: 114, y: -85, k: 56, w: 6, weich: 6, schnauze: 0.98, hoch: 1.08, stirn: 2, tief: 1.04, haarN: 100, haarL: 2.6,
    fell: [[0, "#ad783e"], [0.4, "#c49458"], [0.72, "#d3b082"], [1, "#e2cfac"]], dunkel: "#9a6632",
    haarFarben: [["#7a5226", 1, 0.22, 0.3]], haarSpitze: ["#f8e6c0", 0.2, 0.4], saum: ["#f2dcb0", "#8a6034"],
    nase: "#a8685c", nasenFlecken: [[97.6, -12.2], [99.2, -15.4], [96.6, -16], [99.6, -18.6]],
    polster: "#f2e8d4", kinn: "#efe2c6",
    auge: { iris: "#c8902e", iris2: "#6a3c10", ring: "#e8c060" },
    ohr: rundOhr(T, { x: 17, y: -33, s: 0.82, dunkel: "#1e120a", rand: "#8a5e30", innen: "#e6d2ae", haar: "#f6e8cc", saumHell: "#c8a070", saumDunkel: "#3a2414" }),
  });
  /* ---------- Mähne: Locken in Dachziegel-Reihen um das Gesicht, Spitzen nach hinten-unten ----------
     Ringe k = 0 (Gesichtskranz, kurz, blond) … 4 (außen, lang, dunkler); Winkel phi läuft vom Scheitel über den Nacken
     bis zur Brust. Außenkante: über dem Schulterblatt (nicht weiter zurück), Brustmähne bis Ellbogenhöhe. */
  const gk = { x: K.x, y: K.y, k: K.k / 100, w: K.w * RAD };
  const C = tr([56, -4], gk);
  const theta = (phi) => (-72 - phi * 190) * RAD;
  const lerpTab = (tab, u) => { for (let i = 1; i < tab.length; i++) if (u <= tab[i][0]) { const [a0, v0] = tab[i - 1], [a1, v1] = tab[i]; return v0 + (v1 - v0) * (u - a0) / (a1 - a0); } return tab[tab.length - 1][1]; };
  const rIn = (phi) => lerpTab([[0, 21], [0.25, 19], [0.45, 16.5], [0.65, 17], [0.85, 19], [1, 19.5]], phi);
  const rOut = (phi) => lerpTab([[0, 27], [0.2, 34], [0.42, 48], [0.6, 50], [0.78, 44], [0.9, 40], [1, 37]], phi);
  const pol = (phi, rr) => { const t = theta(phi); return [C[0] + Math.cos(t) * rr, C[1] + Math.sin(t) * rr]; };
  /* Fließrichtung: radial nach außen, nach unten fallend (keine Spitze zeigt nach oben) */
  const fl = (x, y) => { const [rx, ry] = norm(x - C[0], y - C[1]); const d = norm(rx * 0.5 - 0.3, ry * 0.45 + 0.95); return norm(d[0], Math.max(0.5, d[1])); };
  /* Locken säen: Wurzeln zwischen Gesichtsrand und Außenkante, außen zuerst gezeichnet (innen liegt oben) */
  const saeen = (T2, n, kMin, kMax) => {
    const out = [];
    for (let v = 0; out.length < n && v < n * 40; v++) {
      const phi = T2.rnd(), u = kMin + T2.rnd() * (kMax - kMin), ri = rIn(phi), ro = rOut(phi);
      const rr = ri + (ro - ri) * u * 0.78;
      const R = pol(phi, rr);
      if (out.some(([Q]) => Math.hypot(Q[0] - R[0], Q[1] - R[1]) < (kMax < 0.2 ? 2.4 : 3.6))) continue;
      const d = fl(R[0], R[1]), brust = phi > 0.8;
      const L = Math.max(7, (ro - rr) * 0.95 + 3 + T2.rnd() * 4) * (kMax < 0.2 ? 0.55 : 1);
      const hell = Math.max(0, Math.min(1, (C[1] - R[1]) / 28 + 0.45));
      const c = kMax < 0.2 ? mische("#c08848", "#f0cc88", 0.3 + hell * 0.5 + (T2.rnd() - 0.5) * 0.35)
        : brust ? mische("#24140a", "#6a4220", (1 - u) * 0.6 + T2.rnd() * 0.25)
        : mische(mische("#c88c48", "#2e1a0c", u * 1.05 + (T2.rnd() - 0.5) * 0.3), "#ecc078", hell * 0.3);
      out.push([R, d, L, (kMax < 0.2 ? 4 : 7.5) + T2.rnd() * 2.5, (T2.rnd() - 0.5) * 1.6, c, rr / ro]);
    }
    return out.sort((a, b) => b[6] - a[6]);
  };
  const lockOpt = { straehnen: 5, strW: 0.3, hell: "#f6d498", dunkel: "#140802", mittel: "#6a4220" };
  A.hinterKopf = (T2, geo, box) => {
    const aussen = [], innen = [];
    for (let i = 0; i <= 24; i++) { const phi = i / 24; aussen.push(pol(phi, rOut(phi) - 5)); innen.push(pol(phi, rIn(phi) - 2)); }
    box(aussen);
    const id = T2.id("mfeld");
    T2.def(`<path id="${id}" d="${G(aussen.concat(innen.reverse()), true, 1)}"/>`);
    const locken = saeen(T2, T2.fein ? 64 : 30, 0.12, 1);
    /* Bauchfransen (an der Bauchlinie angesetzt) und Ellbogenbüschel */
    /* Bauchfransen und Ellbogenbüschel als hängende Haare, an der Bauchlinie angesetzt */
    const band2 = []; for (let x = 64; x <= 92; x += 4) band2.push([x, (yBei(geo.U, x) || -50) - 2.5]);
    const fr = band2.concat(band2.slice().reverse().map(([x, y]) => [x, y + 3]));
    return haare(T2, fr, 80, 96, 4.5, [["#4a2c14", 1, 0.3, 0.55], ["#8a6030", 0.6, 0.28, 0.5]], { krumm: 0.08, streu: 10, szene: 0.3 }) +
      haare(T2, [[88, -58], [93, -58], [93, -50], [88, -50]], 30, 100, 6.5, [["#2a180c", 1, 0.36, 0.6], ["#6a4422", 0.5, 0.3, 0.5]], { krumm: 0.1, streu: 12, szene: 0.3 }) +
      `<g${volumen(T2, "maehne", { weich: 7, tiefe: 3, umgebung: 0.5 })}><use href="#${id}" fill="${T2.rg("mgr", [[0, "#8a5a2c"], [0.6, "#4a2a12"], [1, "#24140a"]], 0.75, 0.4, 0.75)}"/>` + haarLocken(T2, locken, lockOpt) + `</g><g${volumen(T2, "kranz", { weich: 2.4, tiefe: 2.5, umgebung: 0.55 })}>` + kranzUndBart(T2) + `</g>`;
  };
  /* Gesichtskranz (Ring 0) und Bart liegen HINTER dem Kopf: die Wurzeln verschwinden unter Wange und Kiefer, nur die
     Spitzen rahmen das Gesicht. Vor dem Kopf nur das Ohr und ein paar kurze Locken über seinem Ansatz. */
  const kranzUndBart = (T2) => {
    const kranz = saeen(T2, T2.fein ? 24 : 10, 0, 0.1).map((l) => { const [R, d] = l; return [[R[0] + (C[0] - R[0]) * 0.22, R[1] + (C[1] - R[1]) * 0.22], d, l[2] * 1.15, l[3], l[4], l[5], l[6]]; });
    const bart = [];
    for (let i = 0; i < (T2.fein ? 8 : 4); i++) { const p = tr([42 + i * 5.6, 18 + i * 0.6], gk); bart.push([p, norm(-0.22, 1), 13 + T2.rnd() * 6, 5.4, (T2.rnd() - 0.5), mische("#7a4e24", "#d4a462", 0.25 + T2.rnd() * 0.55)]); }
    return haarLocken(T2, bart.concat(kranz), Object.assign({}, lockOpt, { hell: "#fbe4b0" }));
  };
  A.vorKopf = (T2) => {
    const ueber = [];
    for (let i = 0; i < (T2.fein ? 5 : 2); i++) { const p = tr([14 + i * 3.4, -30 - i * 1.4], gk); ueber.push([p, fl(p[0], p[1]), 7 + T2.rnd() * 3, 4, (T2.rnd() - 0.5), mische("#a8763a", "#e0b070", T2.rnd())]); }
    return `<g transform="${A.kopfTf}">${A.ohrSpaeter || ""}</g>` + haarLocken(T2, ueber, lockOpt);
  };
  A.ohrSpaeter = "";
  /* ---------- Schwanzquaste: spindelförmig aus schwarzbraunen Locken mit Lichtkante, weicher Übergang ---------- */
  A.schwanzEnde = (T2, geo) => {
    const P = linienPunkt(geo.schwanz), liste = [];
    for (let j = 0; j < 7; j++) {
      const [x, y, tx, ty] = P(0.8 + j * 0.022), side = ((j % 3) - 1) * 0.9;
      liste.push([[x - ty * side, y + tx * side], norm(tx + (T2.rnd() - 0.5) * 0.25, ty + 0.12), 6 + j * 0.6 + T2.rnd() * 2, 3, (T2.rnd() - 0.5) * 1.2, mische("#140a04", "#3a2212", T2.rnd() * 0.6)]);
    }
    return `<g${volumen(T2, "quaste", { weich: 1.6, tiefe: 2.5, umgebung: 0.5 })}>` + haarLocken(T2, liste, Object.assign({}, lockOpt, { straehnen: 5, hell: "#8a6440" })) + `</g>`;
  };
  return katze(T, A);
}

/* =====================================================================
   TIGER (Bengal-Tiger, Männchen)
   RECHERCHE (Wikipedia „Bengal tiger“, San Diego Zoo, A-Z Animals; Kritik Runde 1): Schulterhöhe 90–110 cm, Kopf-Rumpf
   1,8–2,1 m, Schwanz 85–110 cm. Länger und schwerer als der Löwe, vor allem vorn (tiefe Brust, dicke Unterarme), runder
   breiter Kopf mit hoher gewölbter Stirn und kurzer breiter Schnauze, Backenkrause (weiß, mit schwarzen Wangenstreifen).
   Fell rötlich-orange, Rücken dunkler; Bauch, Brust, Kehle, Beininnenseiten, Schnauze, Kinn, Flecken über den Augen weiß.
   Streifen schwarzbraun, 28–35 je Flanke, an der Rückenlinie am breitesten, laufen spitz zum Bauch aus, oft doppelt oder
   gegabelt; an Kruppe/Oberschenkel Bögen um die Hüfte, an Schulter und Hals schmaler und dichter; Beine außen orange mit
   wenigen Querstreifen hinten am Unterarm. Ohren: Rückseite schwarz mit weißem Fleck. Schwanz: schräge Streifen am Ansatz,
   hinten 8–10 unregelmäßige Ringe, Unterseite heller, Spitze schwarz. Augen gelb-bernstein, Pupille rund; Nase rosa.
   ===================================================================== */
function tiger(T) {
  const A = {
    hs: 110, kopfFest: true,
    P: { rumpf: 1.08, bein: 0.94, brust: 4, taille: 3, dickeV: 1.16, dickeH: 0.96, fernH: 13, fernV: -12.5, schwanzW: [2.5, 1.8],
      schwanz: [[2.5, -84], [-2, -80.5], [-6.5, -73], [-9.5, -62], [-11, -50], [-10.5, -38], [-8, -27], [-4, -18], [1, -12], [6, -10]] },
    fell: [[0, "#a84812"], [0.12, "#bc5818"], [0.3, "#d06e26"], [0.44, "#d97c30"], [0.5, "#de8a3c"], [0.535, "#e9c49a"], [0.56, "#f3ebdd"], [1, "#f2eadc"]],
    beinFell: [[0, "#a84812"], [0.12, "#bc5818"], [0.3, "#d06e26"], [0.5, "#d97a2e"], [0.7, "#e08c40"], [0.86, "#e6a660"], [0.95, "#eedcc0"], [1, "#f2e6d2"]],
    fernDunkel: "#5a2408", fernDeck: 0.2,
    schwanzFell: [[0, "#c86a26"], [0.5, "#d98a44"], [1, "#e6b07a"]],
    haar: { L: 2.4, nRumpf: 50, nKeule: 18, nSchulter: 16, nBein: 14, nSchwanz: 12,
      farben: [["#7a3208", 1, 0.17, 0.24]], spitze: ["#ffe6c0", 0.15, 0.3], saumHell: "#ec9a52", saumDunkel: "#b86a34" },
    rumpfWeich: 9, textur: ["#5a2406", 0.1],
  };
  /* ---------- Kopf: 100 Einheiten = 50 cm ---------- */
  const K = A.kopf = kopfVorlage(T, {
    x: 119, y: -76, k: 50, w: 12, weich: 6, schnauze: 0.9, hoch: 1.1, stirn: 4, stopp: 0.6,
    fell: [[0, "#b04e16"], [0.45, "#d06e28"], [0.7, "#dc8a44"], [1, "#e8b880"]], dunkel: "#a84612",
    zonen: (M) => [
      [M([[57, -32.2], [65, -34.6], [74, -32], [70, -29.6], [60, -30]]), "#fbf8f2", 1, 1],
      [M([[46, -16], [58, -18.6], [69, -18.4], [74, -13], [72, -6], [64, 3], [56, 9], [44, 15], [34, 11], [34, -5]]), "#f8f4ec", 0.98, 1],
      [M([[74, -2], [84, -6], [96, -5], [100.8, 2], [100.4, 9], [98.2, 13.4], [86, 15.4], [70, 16], [62, 19], [66, 8]]), "#fbf8f2", 0.98, 1],
      [M([[60, 21], [88, 18.6], [91.6, 22.4], [89.4, 27.2], [83.6, 30.4], [72, 31.8], [52, 29], [44, 25]]), "#fbf8f2", 1],
    ],
    zonenWeich: 0.35, polster: "#fbf8f2", kinn: "#fbf8f2", unterAuge: "#fbf8f2", ueberAuge: "#fbf8f2",
    haarFarben: [["#7a3208", 1, 0.2, 0.3]], haarSpitze: ["#fff0d8", 0.2, 0.4], saum: ["#f4b070", "#a8521a"],
    nase: "#d4887e", auge: { iris: "#d8a234", iris2: "#7a4a12", ring: "#f0d070" },
    ohr: rundOhr(T, { x: 18, y: -33, s: 0.86, dunkel: "#141010", rand: "#b85a1c", fleck: "#f4f0e8", innen: "#f0e8dc", haar: "#fffaf2", saumHell: "#f0e6d8", saumDunkel: "#2a1a10" }),
  });
  K.zonenWeich = 0.35;
  const wst = (mp, w) => band(T, K.M(mp), w);
  /* Gesicht: 6 schmale Stirnstreifen, die zum Hinterkopf auseinanderlaufen; schmaler Streifen vom hinteren Augenwinkel
     zum Ohr; drei parallel geschwungene Wangenstreifen, die in die Krause münden (einer gegabelt) */
  K.muster = `<path d="${[
    wst([[58.5, -41.6], [58, -38.4], [57, -36]], 1), wst([[53.5, -42.4], [53, -38.6], [51.6, -35.6]], 1.15), wst([[48, -42.8], [47.4, -38.4], [45.6, -34.8]], 1.3),
    wst([[42, -42.6], [41, -37.6], [38.8, -33.6]], 1.4), wst([[35.5, -41.6], [34.2, -36], [31.6, -31.6]], 1.4), wst([[29, -39.6], [27.4, -34], [24.6, -29.6]], 1.3),
    wst([[61, -23], [54, -23.6], [47, -22.2], [40, -19.6]], 1),
    wst([[64, -9], [56, -6.4], [48, -2.6], [40, 1.6], [31, 5.6]], 2), wst([[50, -4], [45, -6.6], [40, -8]], 1),
    wst([[61, 3.4], [54, 6.4], [47, 10.6], [39, 14.6], [31, 17.4]], 1.9), wst([[55, 13.6], [49, 17], [42, 21], [35, 23.4]], 1.5),
  ].join("")}" fill="#16100c" opacity=".94"${fransen(T, "kopf", 0.15, 0.9, 0.6)}/>`;
  /* ---------- Streifen (Normmaß nach dem Grundriss) ---------- */
  A.muster = (T2, geo) => {
    const st = [], R = geo.R, U = geo.U, F2 = T2.fein;
    const yT = (x) => yBei(R, x) || -95, yB = (x) => (yBei(U, x) || -50);
    /* Mittellinie eines Streifens: Start oben, Länge L, Neigung (Grad), Bauch nach vorn (über dem Brustkorb), S-Welle */
    const lin = (x, y0, L, neig, bauch, n = 6) => { const p = [], w = (T2.rnd() - 0.5) * 2; for (let i = 0; i < n; i++) { const t = i / (n - 1); p.push([x - Math.sin(neig * RAD) * L * t + bauch * Math.sin(Math.PI * t) + w * Math.sin(2 * Math.PI * t), y0 + Math.cos(neig * RAD) * L * t]); } return p; };
    /* Flanke: 28–35 Streifen je Seite (fein), Enden gestaffelt, 30–40 % doppelt (oben verbunden), einige gegabelt oder unterbrochen */
    for (let x = 118; x > 38; ) {
      const y0 = yT(x) - 2.5, tief = yB(x) - y0, L = tief * (0.4 + T2.rnd() * 0.58), w = (F2 ? 3.2 : 4) + T2.rnd() * 1.8 + (x < 70 ? 0.6 : 0);
      const neig = (x > 96 ? -8 : x < 60 ? 10 : 2) + (T2.rnd() - 0.5) * 10, bauch = 1 + T2.rnd() * 2.2, art = F2 ? T2.rnd() : 1;
      if (art < 0.34) {                                              /* Doppelstreifen: zwei Linien aus einem Scheitel */
        const sp = 1.6 + T2.rnd() * 1.6;
        st.push(band(T2, lin(x + sp, y0, L, neig - 7, bauch), w * 0.62, true)); st.push(band(T2, lin(x - sp * 0.3, y0, L * (0.7 + T2.rnd() * 0.3), neig + 8, bauch), w * 0.58, true));
      } else if (art < 0.48) {                                       /* unten gegabelt */
        const m = lin(x, y0, L * 0.6, neig, bauch * 0.6, 4), e = m[3];
        st.push(band(T2, m, w, true, 0.35)); st.push(band(T2, lin(e[0] + 0.6, e[1] - 0.5, L * 0.45, neig - 14, 0.4, 4), w * 0.5));
        st.push(band(T2, lin(e[0] - 0.6, e[1] - 0.5, L * 0.42, neig + 16, 0.4, 4), w * 0.45));
      } else if (art < 0.6) {                                        /* unterbrochen und versetzt */
        const m = lin(x, y0, L * 0.45, neig, bauch * 0.5, 4), e = m[3];
        st.push(band(T2, m, w, true)); st.push(band(T2, lin(e[0] - 1.2, e[1] + 2.4, L * 0.4, neig + 4, 0.6, 4), w * 0.6));
      } else st.push(band(T2, lin(x, y0, L, neig, bauch), w, true));
      if (F2 && T2.rnd() < 0.3) { const yy = yB(x) - 11 - T2.rnd() * 5, l = 3 + T2.rnd() * 3; st.push(band(T2, [[x - 2, yy], [x - 2.3, yy + l / 2], [x - 2.8, yy + l]], 1.6, true)); }
      x -= F2 ? 4.2 + T2.rnd() * 2.4 : 7;
    }
    /* Schulter und Hals: schmaler und dichter, oben nach vorn geneigt */
    for (let x = 120; F2 && x < 150; ) {
      const y0 = yT(Math.min(x, 140)) - 2, L = 9 + T2.rnd() * 12;
      st.push(band(T2, lin(x, y0, L, -16 - T2.rnd() * 10, 0.8, 4), 1.2 + T2.rnd() * 0.8, true));
      x += 3 + T2.rnd() * 1.6;
    }
    /* Kruppe und Oberschenkel: C-förmige Bögen konzentrisch um die Hüfte, teils unterbrochen */
    const bg = (cx, cy, R2, a0, a1) => { const p = []; for (let i = 0; i < 7; i++) { const a = (a0 + (a1 - a0) * i / 6) * RAD; p.push([cx + Math.cos(a) * R2, cy + Math.sin(a) * R2]); } return p; };
    const HX = 27, HY = -71;
    for (let R2 = 7; R2 < (F2 ? 34 : 30); R2 += F2 ? 4.4 + T2.rnd() * 1.2 : 9) {
      const a0 = 296 - T2.rnd() * 20, a1 = 128 + T2.rnd() * 30, w = 1.4 + R2 * 0.05 + T2.rnd() * 0.6;
      if (F2 && T2.rnd() < 0.45) { const m = (a0 + a1) / 2 + (T2.rnd() - 0.5) * 30; st.push(band(T2, bg(HX, HY, R2, a0, m + 4), w)); st.push(band(T2, bg(HX, HY, R2 + 1, m - 6, a1), w * 0.85)); }
      else st.push(band(T2, bg(HX, HY, R2, a0, a1), w));
    }
    /* Beine: Querstreifen hinten am Unterarm (Vorderseite frei), außen am Unterschenkel */
    const beinStreifen = (L, ys, anteil, w) => ys.map((y) => { const xh = xBei(L.H, y), xv = xBei(L.V, y); if (xh == null || xv == null) return ""; const l = (xv - xh) * anteil; return band(T2, [[xh - 0.5, y], [xh + l * 0.5, y + 0.6], [xh + l, y + 1.6]], w, true); }).join("");
    if (F2) {
      st.push(beinStreifen(geo.vn, [-44, -38, -32, -26, -21], 0.55, 1.3));
      st.push(beinStreifen(geo.hn, [-45, -40, -35], 0.6, 1.4));
      for (const x of [62, 76, 90]) { const yy = yB(x) - 1.5, l = 4 + T2.rnd() * 2; st.push(band(T2, [[x, yy], [x + 0.3, yy - l / 2], [x + 0.8, yy - l]], 1.5, true)); }
    }
    const id = T2.id("must");
    /* Weiß: Bauch, Brust, Kehle – weicher, haariger Übergang (kein Band mit harter Kante) */
    const weiss = [[44, yB(44) - 2], [60, yB(60) - 6], [80, yB(80) - 7], [96, yB(96) - 7], [106, -54], [114, -58], [120, -63], [126, -68], [134, -72], [144, -74], [150, -62],
      [150, -50], [124, -50], [116, -47], [104, yB(104) + 2], [80, yB(80) + 2], [60, yB(60) + 2], [44, yB(44) + 2]];
    const wHaare = F2 ? haare(T2, weiss.slice(0, 11).concat(weiss.slice(0, 11).reverse().map(([x, y]) => [x, y - 5])), 110, (x) => (x > 112 ? 125 : 96), 2.6, [["#f6efe4", 1, 0.3, 0.7], ["#e09040", 0.6, 0.28, 0.6]], { streu: 25 }) : "";
    T2.def(`<g id="${id}"><g filter="url(#${T2.id("blws")})"><path d="${G(weiss, true, 1)}" fill="#f4ede0"/></g>${wHaare}<path d="${st.join("")}" fill="#16100c"${fransen(T2, "st", 0.1, 0.9, 0.7)}/></g>`);
    T2.def(`<filter id="${T2.id("blws")}" x="-10%" y="-10%" width="120%" height="120%"${SRGB}><feGaussianBlur stdDeviation="${F2 ? 1.6 : 0.8}"/></filter>`);
    return { id,
      fern: (L, n) => { if (!T2.fein) return ""; return `<path d="${n === "vf" ? beinStreifen(L, [-42, -35, -28], 0.5, 1.2) : beinStreifen(L, [-44, -38], 0.55, 1.3)}" fill="#16100c" fill-opacity=".85"/>`; },
      schwanz: (T3, g) => {
        const P = linienPunkt(g.schwanz);
        let d = "";
        /* Ansatz: schräge Streifen; hintere Hälfte: 8–10 unregelmäßige Ringe; Spitze schwarz, spitz auslaufend */
        const us = T3.fein ? [0.1, 0.18, 0.26, 0.34, 0.43, 0.5, 0.57, 0.63, 0.69, 0.75, 0.8, 0.85] : [0.2, 0.4, 0.56, 0.7, 0.82];
        us.forEach((u, k) => {
          const [x, y, tx, ty] = P(u), w = 0.9 + T3.rnd() * 1 + u * 0.8, schraeg = u < 0.4 ? 0.7 : 0.12 + T3.rnd() * 0.2;
          d += band(T3, [[x - ty * 3.6 - tx * schraeg * 3, y + tx * 3.6 - ty * schraeg * 3], [x, y], [x + ty * 3.6 + tx * schraeg * 3, y - tx * 3.6 + ty * schraeg * 3]], w * 2, false, 0.6);
        });
        const [ex, ey, etx, ety] = P(0.9), [fx, fy] = P(1);
        d += G([[ex - ety * 2.4, ey + etx * 2.4], [fx + etx * 2.4, fy + ety * 2.4], [ex + ety * 2.4, ey - etx * 2.4]], true, 2);
        return `<path d="${d}" fill="#16100c"/>`;
      } };
  };
  /* ---------- Backenkrause: 10–14 weiße Locken von der Wange nach hinten-unten, HINTER dem Kopf angesetzt;
     die schwarzen Wangenstreifen laufen als sich verjüngende Bänder hinein ---------- */
  A.hinterKopf = (T2, geo, box, gk) => {
    const liste = [];
    const n = T2.fein ? 14 : 7;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), p = tr([36 - Math.sin(t * Math.PI) * 6, -12 + t * 42], gk), d = norm(-0.7 + t * 0.35, 0.65 + t * 0.35);
      liste.push([p, d, 10 + T2.rnd() * 6 + Math.sin(t * Math.PI) * 5, 5.5, (T2.rnd() - 0.5) * 1.4, mische("#d8ccba", "#fbf8f2", 0.4 + T2.rnd() * 0.6 - (t > 0.7 ? 0.3 : 0))]);
    }
    const str = [[[40, -6], [30, -2], [22, 2], [14, 6]], [[42, 10], [32, 15], [24, 19]], [[46, 22], [38, 27], [30, 31]]].map((m) => band(T2, m.map((q) => tr(q, gk)), 1.8, true)).join("");
    return `<g${volumen(T2, "krause", { weich: 2.4 })}>` + haarLocken(T2, liste, { straehnen: 5, hell: "#ffffff", mittel: "#c8b8a0", dunkel: "#8a7660", dOp: 0.4, strW: 0.28 }) +
      `<path d="${str}" fill="#16100c" opacity=".88"/></g>`;
  };
  return katze(T, A);
}

/* =====================================================================
   KOPFVORLAGE (alle sieben Arten): Profil eines Großkatzenschädels, Kopflänge 100, Nase rechts, y nach unten.
   Kritik Runde 2: Auge nicht auf der Kontur, sondern unter einem Brauenwulst in der Kopffläche; Nasenrücken lang und
   gerade; Schnauze hoch und kastig, Oberlippe vorn senkrecht; Nasenspiegel flach und bündig mit der Lippe, Nasenloch
   als Schlitz; Mundwinkel unter dem hinteren Augenwinkel ohne Haken; Kinn ein runder cremefarbener Block, Schatten warm.
   Eine Punktabbildung formt die Arten: schnauze (Länge), hoch (Schnauzenhöhe), stirn (Kuppel), stopp, tief (Unterkiefer).
   ===================================================================== */
function kopfVorlage(T, o) {
  const sf = o.schnauze || 1, sh = o.hoch || 1, st = o.stirn || 0, sp = o.stopp || 0, ti = o.tief || 1;
  const P = (x, y) => {
    let nx = x > 64 ? 64 + (x - 64) * sf : x, ny = y;
    if (x > 66 && y > -26) ny = -26 + (y + 26) * sh;              /* Schnauzenhöhe */
    if (y > 12) ny = 12 * (x > 66 ? sh : 1) + (ny - 12 * (x > 66 ? sh : 1)) * ti; /* Unterkiefer */
    if (y < -24 && x > 18 && x < 78) ny -= st * Math.sin((x - 18) / 60 * Math.PI) ** 1.5;   /* Stirnkuppel */
    if (y < -24 && x > 64 && x < 80) ny += sp * Math.sin((x - 64) / 16 * Math.PI);           /* Stopp */
    return [nx, ny];
  };
  const M = (pts) => pts.map(([x, y, h]) => { const q = P(x, y); return h ? [q[0], q[1], 1] : q; });
  const p = (x, y) => P(x, y).map((v) => Math.round(v * 10) / 10).join(" ");
  const umriss = M([[12, -30], [22, -38], [36, -42], [50, -42.6], [60, -41.2], [66, -38.8], [70.5, -35.4], [76, -32.2], [86, -28.4], [94, -25], [98.4, -22.4],
    [100.4, -18.6], [100.9, -13], [100.6, -8.6], [101.4, -3.4], [102.4, 2.4], [102, 8.6], [99.8, 13.4], [94, 15.9], [91.2, 18.4], [91.6, 22.4], [89.4, 27.2],
    [83.6, 30.4], [74, 31.8], [62, 31.4], [50, 28.8], [38, 23.4], [28, 15.4], [19, 4], [13, -12]]);
  const K = {
    x: o.x, y: o.y, k: o.k, w: o.w != null ? o.w : 6, weich: o.weich || 6, umriss, nacken: P(14, -29), kehle: P(44, 23), fade: o.fade || [16, 32],
    fell: o.fell,
    zonen: [
      [M([[24, -37], [50, -41.5], [62, -39.5], [60, -35], [40, -35], [24, -32]]), o.stirnFarbe || o.dunkel, 0.35],
      [M([[71, -33], [84, -28.6], [95, -24.4], [95, -21], [84, -24.6], [72, -29.4]]), o.rueckenFarbe || o.dunkel, 0.45],
      [M([[76, 2], [86, -3.8], [98, -4.4], [102.4, 2.4], [102, 8.6], [99.8, 13.4], [90, 15], [80, 14.6], [74, 9]]), o.polster || "#f1e8d6", 0.94],
      [M([[90.6, 18.6], [91.6, 22.4], [89.4, 27.2], [83.6, 30.4], [74, 31.8], [64, 31], [66, 24.6], [76, 20], [84, 18.4]]), o.kinn || "#f2e8d6", 1],
      [M([[66, 26], [80, 27], [88, 25], [84, 30.6], [72, 32]]), o.kinnSchatten || "#c8a078", 0.3],
      [M([[59, -16.8], [66, -15.2], [74, -17], [72, -11.6], [64, -10.8], [58.6, -13.2]]), o.unterAuge || "#f8f0e0", 0.85],
      [M([[59.6, -30.4], [66.4, -32.2], [73, -30.2], [67, -28.4], [61, -28.4]]), o.ueberAuge || "#f6e8d0", 0.65],
    ].concat(o.zonen ? o.zonen(M) : []).filter((z) => z[1]),
    formen: [
      [M([[58, -37], [66, -36], [72, -32.6], [66, -31.6], [59, -33.8]]), "#fff4dc", 0.6],                /* Brauenwulst im Licht */
      [...P(66, -22.6), 7.4, 4.8, -4, "#2a1004", 0.42],                                                  /* Augenhöhle */
      [M([[42, -13], [60, -15.2], [68, -12.6], [56, -9.6], [42, -9.6]]), "#fff0d0", 0.45],             /* Jochbogen */
      [...P(50, -2), 12, 3, 0, "#5a2c0c", 0.12], [...P(76, 8), 4, 7, 0, "#5a2c0c", 0.2], [...P(94, 3), 6, 5, 0, "#ffffff", 0.45], [...P(86, 12), 10, 2.6, 0, "#6a3410", 0.22],
      [...P(64, 28), 20, 3.4, 0, "#6a3410", 0.32],                                                       /* warmer Schatten unter dem Kinn */
      [M([[72, -32], [95, -24.4], [95, -23.4], [72, -31]]), "#fff0d0", 0.35],                           /* Lichtkante Nasenrücken */
      [M([[32, -6], [44, -12], [50, 4], [44, 16], [34, 12]]), "#4a2208", 0.1],                         /* Kaumuskel unten */
      [M([[34, -14], [48, -18], [52, -12], [40, -8]]), "#fff0d0", 0.28],                                 /* Kaumuskel oben */
    ],
    haarN: o.haarN || 50, haarL: o.haarL || 2, haarFarben: o.haarFarben, haarSpitze: o.haarSpitze, saum: o.saum,
    nase: { pts: M([[94.6, -23], [98, -21.6], [100.2, -18.8], [100.8, -14.6], [100.5, -10.6], [98.6, -10.4], [96.2, -12.4], [94.6, -17.4]]),
      farbe: o.nase || "#c08478", loch: `M${p(100, -11.8)}L${p(97.4, -13.2)}`, furche: `M${p(100.5, -10.4)}Q${p(100.9, -4)} ${p(100.8, 2)}`,
      glanz: `M${p(95.4, -22.8)}Q${p(98.4, -21.6)} ${p(100, -19)}`, lochB: 0.55, flecken: o.nasenFlecken ? M(o.nasenFlecken) : null },
    lefze: M([[100.6, 14], [96.6, 15.3], [90, 15.9], [81, 16.4], [72, 16.6], [65, 17]]), lefzeB: [1.1, 0.35],
    punkte: M([[82, 1], [85.5, 1], [89, 1.2], [92.5, 1.4], [96, 1.6], [80.5, 4.4], [84, 4.6], [87.5, 4.8], [91, 5], [94.5, 5.2], [97.5, 5.4], [82, 8], [85.5, 8.2],
      [89, 8.4], [92.5, 8.6], [96, 8.8], [85, 11.4], [88.5, 11.6], [92, 11.8]]),
    punktB: o.punktB || 0.55,
    auge: Object.assign({ x: P(66, -21.6)[0], y: P(66, -21.6)[1], w: o.augeW || 8.6, winkel: -4 }, o.auge),
    tasthaare: [[90, 3, 8, 30, 0.5], [92, 5, 18, 32, 0.6], [89, 7, 28, 30, 0.7], [93, 8, 38, 26, 0.8], [87, 9, 48, 24, 0.8], [95, 2, -2, 28, 0.4],
      [86, 5, 22, 26, 0.5], [91, 10, 58, 20, 0.9], [69, -30, -70, 12, -0.4], [67, -29.5, -52, 10, -0.3]].map(([x, y, a, L, b]) => [...P(x, y), a, L * (o.tastL || 1), b]),
    ohr: o.ohr,
  };
  K.muster = o.muster ? o.muster(M, P) : "";
  K.extra = o.extra ? o.extra(M, P) : "";
  K.P = P; K.M = M;
  return K;
}
/* Ohr einer Großkatze (rund): Rückseite dunkel, Rand fellfarben, Innenseite hell behaart, heller Fleck als Sichel hinten */
function rundOhr(T, o) {
  const [x, y, s] = [o.x || 18, o.y || -32, o.s || 1];
  const Q = (a, b) => [x + a * s, y + b * s];
  return { pts: [Q(0, 0), Q(-0.5, -8.5), Q(3, -15), Q(8.5, -16.2), Q(13, -11.8), Q(14.5, -3.5)], weich: 1.6, vorn: true,
    farbe: T.lg("ohr", [[0, o.dunkel || "#1e140c"], [0.5, o.dunkel || "#2a1a10"], [0.85, o.rand || "#9a6c3a"], [1, o.rand || "#b07c44"]]),
    innen: `<path d="M${f1(Q(7.5, -4)[0])} ${f1(Q(7.5, -4)[1])}q${f1(1 * s)} ${f1(-7 * s)} ${f1(3 * s)} ${f1(-10.5 * s)}q${f1(2.4 * s)} ${f1(3 * s)} ${f1(2.6 * s)} ${f1(10.5 * s)}z" fill="${o.innen || "#e6d6ba"}" opacity=".9"/>` +
      (o.fleck ? `<path d="M${f1(Q(0.4, -3)[0])} ${f1(Q(0.4, -3)[1])}q${f1(0.2 * s)} ${f1(-5 * s)} ${f1(3 * s)} ${f1(-9 * s)}q${f1(-0.6 * s)} ${f1(4 * s)} ${f1(-0.8 * s)} ${f1(9 * s)}z" fill="${o.fleck}" opacity=".9"/>` : "") +
      haare(T, [Q(8, -4), Q(10.5, -14), Q(13, -4)], 12, 255, 4 * s, [[o.haar || "#fbf0dc", 1, 0.3, 0.85]], { streu: 30 }),
    saum: o.saumAus ? null : [0.9 * s, o.saumHell || "#d8b07a", o.saumDunkel || "#4a3020"] };
}

/* =====================================================================
   FLECKEN: Rosetten (Leopard), Rosetten mit Mittelpunkten (Jaguar), Vollflecken (Gepard, Luchs, Beine, Bauch).
   Auf dem Rumpf mit Verkürzung: an Rücken- und Bauchkante (Oberfläche dreht weg) gestaucht und dichter.
   ===================================================================== */
function flecken(T, felder, o = {}) {
  const F = T.fein, q = (v) => (F ? String(Math.round(v * 2) / 2).replace(/^(-?)0\./, "$1.") : String(Math.round(v)));
  const out = { innen: "", striche: {}, voll: "", ringe: [] };
  const alle = [];
  for (const fd of felder) {
    const { pts, art, g } = fd, [x0, y0, x1, y1] = boxOf(pts);
    if (!F && fd.szene === false) continue;
    const a = g * 2.2, n = Math.round((x1 - x0) * (y1 - y0) / (a * a) * (fd.dichte || 1) * 1.15 * (F ? 1 : 0.45));
    const abst = (fd.abst || 1.25) * (F ? 1 : 1.45);
    for (let v = 0, k = 0; k < n && v < n * 30; v++) {
      const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
      if (!T.inPoly(x, y, pts) || (fd.nur && !fd.nur(x, y))) continue;
      let ver = 1;
      if (fd.oben && fd.unten) { const yt = fd.oben(x), yb = fd.unten(x), t = Math.max(0, Math.min(1, (y - yt) / (yb - yt))); ver = Math.max(0.45, Math.pow(Math.sin(Math.PI * (0.08 + t * 0.84)), 0.7)); }
      const gg = g * (fd.groesse ? fd.groesse(x, y) : 1);
      if (alle.some(([ax, ay, ar]) => Math.hypot((ax - x) * 1, (ay - y) / Math.max(0.6, ver)) < (ar + gg) * abst)) continue;
      alle.push([x, y, gg]); k++;
      const R = gg * (0.85 + T.rnd() * 0.3), dreh = (T.rnd() - 0.5) * 50;
      const ell = (cx, cy, rx, ry, w) => { const c = Math.cos(w * RAD), s = Math.sin(w * RAD); return `M${q(cx - rx * c)} ${q(cy - rx * s)}a${q(rx)} ${q(ry)} ${Math.round(w)} 1 0 ${q(2 * rx * c)} ${q(2 * rx * s)}a${q(rx)} ${q(ry)} ${Math.round(w)} 1 0 ${q(-2 * rx * c)} ${q(-2 * rx * s)}z`; };
      const pk = (ang, rr) => { const c = Math.cos(ang * RAD) * rr, s = Math.sin(ang * RAD) * rr * ver, w = dreh * RAD; return [x + c * Math.cos(w) - s * Math.sin(w), y + c * Math.sin(w) + s * Math.cos(w)]; };
      if (!F && art !== "voll") {
        /* Szene: Rosette als Gruppe kleiner Punkte bzw. dunkler Ring mit Punkt */
        const w = art === "jaguar" ? 2 : 1;
        if (art === "jaguar") { out.striche[w] = (out.striche[w] || "") + ell(x, y, R * 0.8, R * 0.8 * ver, 0).replace(/z$/, ""); out.voll += ell(x, y, R * 0.22, R * 0.2, 0); }
        else for (let j = 0; j < 3; j++) { const [px, py] = pk(j * 120 + T.rnd() * 40, R * 0.7); out.voll += ell(px, py, R * 0.3, R * 0.3 * ver, 0); }
        continue;
      }
      if (art === "voll") { out.voll += ell(x, y, R * (0.8 + T.rnd() * 0.35), R * ver * (0.7 + T.rnd() * 0.3), dreh); continue; }
      /* Rosette: unregelmäßiges Vieleck (Radien gestreut), daraus 3–5 Teile verschieden lang und dick – Bögen (Leopard)
         bzw. eckige Haken (Jaguar), dazwischen Lücken; einzelne Teile als Punkte; Innenfeld weich etwas dunkler */
      const jag = art === "jaguar", nV = jag ? 7 : 6, w0 = T.rnd() * 360;
      out.innen += ell(x, y, R * 0.8, R * 0.72 * ver, dreh);
      /* geschlossener, unregelmäßig runder (Leopard) bzw. eckiger (Jaguar) Ring; Lücken über ein gestreutes Strichmuster
         (pathLength = 60), Dicke je Rosette verschieden → offene C-/U-Formen, Haken, Bruchstücke */
      const V = [];
      for (let i = 0; i < nV; i++) V.push(pk(w0 + i * 360 / nV + (T.rnd() - 0.5) * 26, R * (jag ? 0.72 + T.rnd() * 0.5 : 0.78 + T.rnd() * 0.42)));
      const sw = Math.round(R * (jag ? 0.36 + T.rnd() * 0.2 : 0.34 + T.rnd() * 0.24) * (0.7 + 0.3 * ver) * 4) / 4;
      const muster = jag ? ["17 3 12 4 20 4", "24 5 9 3 15 4", "11 3 21 5 16 4", "30 6 18 6"] : ["13 6 9 8 16 8", "18 9 7 6 12 8", "10 7 14 12 9 8", "22 8 6 10 8 6"];
      /* kompakt: Jaguar eckig (relative Linien), Leopard rund (Mittelpunkte der Kanten, Ecken als Kontrollpunkte) */
      const r2 = (v) => Math.round(v * 2) / 2;
      let dz;
      if (jag) { let px = r2(V[0][0]), py = r2(V[0][1]); dz = `M${q(px)} ${q(py)}`; for (const p of V.slice(1)) { const nx2 = r2(p[0]), ny2 = r2(p[1]); dz += `l${q(nx2 - px)} ${q(ny2 - py)}`; px = nx2; py = ny2; } dz += "z"; }
      else {
        const Mm = V.map((p, k) => { const n2 = V[(k + 1) % nV]; return [r2((p[0] + n2[0]) / 2), r2((p[1] + n2[1]) / 2)]; });
        let px = Mm[nV - 1][0], py = Mm[nV - 1][1]; dz = `M${q(px)} ${q(py)}`;
        for (let k = 0; k < nV; k++) { const c = V[k], e = Mm[k]; dz += `q${q(r2(c[0]) - px)} ${q(r2(c[1]) - py)} ${q(e[0] - px)} ${q(e[1] - py)}`; px = e[0]; py = e[1]; }
      }
      out.ringe.push(`<path pathLength="60" stroke-dasharray="${muster[Math.floor(T.rnd() * 4)]}" stroke-width="${sw}" d="${kurz(dz).replace(/(\.\d)\d+/g, "$1")}"/>`);
      if (!jag && T.rnd() < 0.5) { const m2 = V[Math.floor(T.rnd() * nV)]; out.voll += ell(m2[0], m2[1], sw * 0.55, sw * 0.5, 0); }
      if (jag) for (let j = 0, m = 1 + Math.floor(T.rnd() * 2.8); j < m; j++) { const ang = T.rnd() * 360, rr = R * (0.12 + T.rnd() * 0.32), pr = R * (0.09 + T.rnd() * 0.12); const [px, py] = pk(ang, rr); out.voll += ell(px, py, pr, pr * (0.8 + T.rnd() * 0.3), 0); }
    }
  }
  return out;
}
const fleckenSvg = (f, schwarz, innen, extra = "") =>
  (f.innen && innen ? `<path d="${kurz(f.innen)}" fill="${innen}" fill-opacity=".55"/>` : "") +
  (f.ringe && f.ringe.length ? `<g fill="none" stroke="${schwarz}" stroke-linecap="round" stroke-linejoin="round">${f.ringe.join("")}</g>` : "") +
  Object.entries(f.striche).map(([w, d]) => `<path d="${kurz(d)}" fill="none" stroke="${schwarz}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`).join("") +
  (f.voll ? `<path d="${kurz(f.voll)}" fill="${schwarz}"/>` : "") + extra;

/* Rumpf-Felder für Muster: Ober-/Unterkante als Funktionen (für die Verkürzung) */
function rumpfFeld(geo, rumpf, x0, x1) {
  const oben = (x) => yBei(geo.R, Math.min(x, geo.R[geo.R.length - 1][0])) || -95, unten = (x) => yBei(geo.U, x) || -50;
  return { pts: rumpf.filter((p) => p[0] >= x0 - 2 && p[0] <= x1 + 2), oben, unten };
}
/* Quaste/Spitze aus Strähnen am Schwanzende */
function schwanzSpitze(T, geo, u0, rampe, ton, o = {}) {
  const P = linienPunkt(geo.schwanz), [x, y, tx, ty] = P(u0), [x2, y2, tx2, ty2] = P(1), b = o.breite || 2.2;
  const feld = [[x - ty * b, y + tx * b], [x + ty * b, y - tx * b], [x2 + ty2 * b * 1.1 + tx2 * 2, y2 - tx2 * b * 1.1 + ty2 * 2], [x2 - ty2 * b * 1.1 + tx2 * 2, y2 + tx2 * b * 1.1 + ty2 * 2]];
  return `<g${volumen(T, "quaste", { weich: 1.6 })}>` + straehnen(T, feld, o.n || 8, 6, (px, py) => { const t = Math.max(0, Math.min(1, Math.hypot(px - x, py - y) / Math.hypot(x2 - x, y2 - y))); return norm(tx + (tx2 - tx) * t, ty + (ty2 - ty) * t); },
    o.L0 || 6, o.L1 || 11, o.w || 1.1, rampe, ton, { schwung: 0.3 }) + `</g>`;
}

/* =====================================================================
   LÖWIN
   RECHERCHE (Britannica, San Diego Zoo; Kritik Runde 1): Kopf-Rumpf 1,5–1,7 m, Schulterhöhe 0,9–1,1 m, Schwanz 0,7–1 m,
   120–180 kg. Schlanker und kürzer als das Männchen (Gesäß–Nase ≈ 1,75 × Schulterhöhe), ohne Mähne, deutlicher Hals,
   kleinerer Kopf mit flacher Schädeldecke, langem flachem Nasenrücken und längerer Schnauze (H : L ≈ 0,65), Jochbogen
   als Lichtwulst. Fell einheitlich lohfarben, Rücken etwas dunkler, Bauch/Brust/Kehle/Beininnenseiten cremeweiß,
   Kinn und Lippenrand weiß, schwarze „Kajal“-Lidkante, heller Fleck unter dem Auge; Ohren rund, Rückseite schwarz;
   schwarze Schwanzquaste. Bauchfalte vor den Hinterbeinen, Schulterblätter beim Gehen sichtbar.
   ===================================================================== */
function loewin(T) {
  const A = {
    hs: 100,
    P: { rumpf: 0.9, brust: -2, taille: 9, dickeV: 0.9, dickeH: 0.8, fernH: 13, fernV: -12.5, schwanzW: [2.2, 1.5] }, formStaerke: 0.7,
    fell: [[0, "#a87a46"], [0.12, "#b88a52"], [0.3, "#c69a62"], [0.45, "#cea56e"], [0.52, "#d8b88a"], [0.58, "#e6d2b0"], [1, "#eadcc2"]],
    beinFell: [[0, "#a87a46"], [0.12, "#b88a52"], [0.3, "#c69a62"], [0.55, "#cba26a"], [0.8, "#d0aa76"], [1, "#d8b88a"]],
    haar: { L: 2.6, nRumpf: 130, nKeule: 46, nSchulter: 40, nBein: 18, nSchwanz: 14,
      farben: [["#7a5428", 1, 0.17, 0.22]], spitze: ["#f8e6c2", 0.15, 0.3], saumHell: "#dcbc88", saumDunkel: "#a07648" },
    textur: ["#5a3a16", 0.1],
  };
  A.kopf = kopfVorlage(T, {
    x: 118, y: -86, k: 48, w: 10, schnauze: 1.06, hoch: 1.02, stirn: 0,
    fell: [[0, "#b08250"], [0.4, "#c69a64"], [0.72, "#d6b48a"], [1, "#e6d4b6"]], dunkel: "#9e7040",
    haarFarben: [["#7a5428", 1, 0.22, 0.3]], haarSpitze: ["#fbecd0", 0.2, 0.4], saum: ["#f0dab4", "#8a6036"],
    nase: "#c4887a", auge: { iris: "#c8962e", iris2: "#6a4410", ring: "#e8c46a" },
    ohr: rundOhr(T, { x: 20, y: -33, s: 0.95, dunkel: "#1a120c", rand: "#b08250" }),
  });
  A.schwanzEnde = (T2, geo) => schwanzSpitze(T2, geo, 0.85, ["#140a04", "#24140a", "#3a2212", "#56341c"], () => 0.4, { breite: 2.6, n: 9 });
  return katze(T, A);
}

/* =====================================================================
   LEOPARD
   RECHERCHE (SDZG, Britannica, Safari Ltd/Four Paws; Kritik Runde 1): Schulterhöhe 45–80 cm (♂ ~70), Kopf-Rumpf
   1–1,9 m, Schwanz 60–110 cm. Lang, niedrig, geschmeidig, kurze kräftige Beine, kleiner länglicher Kopf (flache Stirn,
   relativ lange schmale Schnauze), deutlicher Hals. Grund goldgelb bis ocker, Bauch cremeweiß. ROSETTEN klein und dicht
   (4–6 cm), aus 3–5 unregelmäßigen Teilen (Bögen, Haken, Punkte), offen wie C/U, KEIN Mittelpunkt, Innenfeld dunkler
   und rötlicher; an der Rückenmitte kleinere, gestreckte; zur Schulter hin kleiner und in Vollflecken übergehend.
   Kopf, Beine, Bauch mit Vollflecken (Kopf klein, Bauch groß und locker); Kehle mit Fleckenband. Schwanz lang,
   Spitze hochgebogen, oben dunkle Halbringe, Unterseite der Spitze weiß. Augen gelbgrün, keine Tränenlinie.
   ===================================================================== */
function leopard(T) {
  const A = {
    hs: 66,
    P: { rumpf: 1.12, bein: 0.98, brust: -4, dickeV: 0.86, dickeH: 0.78, fernH: 13, fernV: -12.5, schwanzW: [2.7, 1.8], taille: 7,
      schwanz: [[2.5, -84], [-3, -80], [-9, -71], [-13, -58], [-15, -45], [-14, -33], [-10, -24], [-4, -18.5], [3, -17], [9, -19.5], [13, -24.5], [15, -30]] },
    fell: [[0, "#b07a30"], [0.12, "#c48a3a"], [0.3, "#d29c4c"], [0.42, "#dcaa5c"], [0.47, "#e2bc80"], [0.51, "#efe2c8"], [1, "#f2e8d6"]],
    beinFell: [[0, "#b07a30"], [0.12, "#c48a3a"], [0.3, "#d29c4c"], [0.55, "#d8a65a"], [0.8, "#deb46e"], [1, "#e6c690"]],
    haar: { L: 1.9, nRumpf: 34, nKeule: 12, nSchulter: 10, nBein: 6, nSchwanz: 6,
      farben: [["#8a5a1c", 1, 0.15, 0.22]], spitze: ["#fff0cc", 0.13, 0.3], saumHell: "#e8bc70", saumDunkel: "#a8763a" },
    textur: ["#5a3a10", 0.08], saumSchritt: 1.6,
  };
  const S = "#18110b";
  A.muster = (T2, geo, { rumpf }) => {
    const rf = rumpfFeld(geo, rumpf, -5, 132);
    const gr = (x, y) => (x > 104 ? 0.6 : x > 92 ? 0.8 : 1) * (y < (rf.oben(x) + 7) ? 0.75 : 1);
    const f = flecken(T2, [
      { pts: rumpf, nur: (x) => x < 122, art: "rosette", g: 4.1, oben: rf.oben, unten: (x) => rf.unten(x) - 6, groesse: (x, y) => gr(x, y) * (0.75 + T2.rnd() * 0.5), abst: 1.2 },
      { pts: rumpf, nur: (x) => x >= 116, art: "voll", g: 0.95, abst: 2.2 },
      { pts: [[40, -62], [100, -55], [112, -50], [100, -44], [40, -50]], art: "voll", g: 1.5, abst: 2.1, dichte: 0.6 },
      { pts: geo.vn.pts.filter((p) => p[1] > -48), art: "voll", g: 0.85, abst: 3.1, groesse: (x, y) => 0.6 + (-y / 48) * 0.5, szene: false },
      { pts: geo.hn.pts.filter((p) => p[1] > -62), art: "voll", g: 0.95, abst: 3.1, groesse: (x, y) => 0.6 + (-y / 62) * 0.55, szene: false },
    ]);
    const id = T2.id("must");
    T2.def(`<g id="${id}"${fransen(T2, "fl", 0.12, 0.9, 0.7)}>${weich(T2, "fi", [`<path d="${kurz(f.innen)}" fill="#a8641e" fill-opacity=".5"/>`], 0.9)}${fleckenSvg(f, S)}</g>`);
    return { id,
      fern: (L) => fleckenSvg(flecken(T2, [{ pts: L.pts.filter((p) => p[1] > -52), art: "voll", g: 0.8, abst: 2, szene: false }]), S),
      schwanz: (T3, g) => {
        const P = linienPunkt(g.schwanz);
        let d = "";
        for (let k = 0; k < 5; k++) { const [x, y, tx, ty] = P(0.62 + k * 0.075); d += `M${f1(x - ty * 3.2)} ${f1(y + tx * 3.2)}q${f1(ty * 1.8 + tx * 0.8)} ${f1(-tx * 1.8 + ty * 0.8)} ${f1(ty * 3.4)} ${f1(-tx * 3.4)}`; }
        const sp = rohr(g.schwanz.slice(-3)).H;
        const fl = flecken(T3, [{ pts: rohr(g.schwanz.slice(0, 8)).V.concat(rohr(g.schwanz.slice(0, 8)).H.reverse()), art: "voll", g: 0.9, abst: 1.4 }]);
        return fleckenSvg(fl, S) + `<path d="${kurz(d)}" stroke="${S}" stroke-width="1.5" fill="none" stroke-linecap="round"/>` +
          "";
      } };
  };
  A.kopf = kopfVorlage(T, {
    x: 118, y: -84, k: 44, w: 10, schnauze: 1, hoch: 0.98, stirn: 0.5, haarN: 30,
    fell: [[0, "#b67e36"], [0.4, "#d0a050"], [0.7, "#e0bc80"], [1, "#f2e8d6"]], dunkel: "#a8742c",
    haarFarben: [["#8a5a1c", 1, 0.22, 0.3]], haarSpitze: ["#fff0d0", 0.2, 0.4], saum: ["#f0cc88", "#a06a2c"],
    nase: "#c88a7e", auge: { iris: "#b9b040", iris2: "#5a5618", ring: "#e0dc80", kerbe: 1.6 }, augeW: 8.8,
    ohr: rundOhr(T, { x: 20, y: -32, s: 0.9, dunkel: "#140e0a", rand: "#c08a3c", fleck: "#efe6d4" }),
    muster: (M, P) => {
      const f = flecken(T, [
        { pts: M([[24, -36], [56, -40], [68, -37], [64, -33], [44, -32], [26, -30]]), art: "voll", g: 0.9, abst: 1.5 },
        { pts: M([[58, -34.5], [72, -33], [74, -31], [58, -31.5]]), art: "voll", g: 0.6, abst: 1.3 },
        { pts: M([[30, -12], [48, -6], [52, -2], [32, -6]]), art: "voll", g: 0.75, abst: 1.9 },
        { pts: M([[28, 6], [44, 12], [47, 16], [30, 11]]), art: "voll", g: 0.75, abst: 1.9 },
      ]);
      return `<g${fransen(T, "kf", 0.2, 0.9, 0.5)}>${fleckenSvg(f, S)}</g>`;
    },
  });
  return katze(T, A);
}

/* =====================================================================
   JAGUAR
   RECHERCHE (SDZG, SeaWorld, IFAS, Four Paws; Kritik Runde 1): Schulterhöhe 63–76 cm, Kopf-Rumpf 1,1–1,85 m, Schwanz
   45–75 cm (kürzester der Großkatzen), 56–96 kg. Gedrungenste Großkatze: tonnenförmiger, tiefer Brustkorb, kurze dicke
   Beine, große breite Pranken, Rücken gerade (Kruppe = Widerrist), kurzer dicker Hals. Massivster Kopf: Kuppelstirn mit
   deutlichem Absatz, kurze, hohe Schnauze, breite muskulöse Wange, eckiger kräftiger Unterkiefer. Grund kräftig
   goldgelb bis rötlich, Bauch weiß mit großen schwarzen Klecksen. ROSETTEN groß (5–9 cm), wenige, eckig, mit dicken
   unregelmäßigen Rändern und 1–3 Punkten IN der Mitte; Rückenmitte mit einer Reihe großer Vollflecken; Kopf, Hals,
   Beine mit Vollflecken; Schwanz gefleckt, am Ende 3–4 unregelmäßige Ringe und schwarze Spitze.
   ===================================================================== */
function jaguar(T) {
  const A = {
    hs: 70,
    P: { rumpf: 0.94, bein: 0.86, brust: 1, taille: 1, dickeV: 1.22, dickeH: 1.06, pfoteV: 1.18, pfoteH: 1.14, fernH: 12, fernV: -12, schwanzW: [3.4, 2.7],
      schwanz: [[2.5, -84], [-3, -80], [-8, -70], [-11, -58], [-12, -46], [-11, -35], [-8, -26]] },
    fell: [[0, "#a8661e"], [0.12, "#ba7428"], [0.3, "#c88636"], [0.43, "#d29444"], [0.48, "#dcae78"], [0.52, "#eee2cc"], [1, "#f2e8d8"]],
    beinFell: [[0, "#a8661e"], [0.12, "#ba7428"], [0.3, "#c88636"], [0.55, "#ce903e"], [0.8, "#d6a056"], [1, "#e0b880"]],
    haar: { L: 1.9, nRumpf: 50, nKeule: 16, nSchulter: 14, nBein: 8, nSchwanz: 8,
      farben: [["#7a4614", 1, 0.15, 0.22]], spitze: ["#ffe8c0", 0.13, 0.3], saumHell: "#e0a860", saumDunkel: "#9a6630" },
    textur: ["#5a3410", 0.08],
  };
  const S = "#150e09";
  A.muster = (T2, geo, { rumpf }) => {
    const rf = rumpfFeld(geo, rumpf, -5, 132);
    const f = flecken(T2, [
      { pts: rumpf, nur: (x, y) => x < 118 && y > rf.oben(x) + 3, art: "jaguar", g: 5.4, oben: (x) => rf.oben(x) + 4, unten: (x) => rf.unten(x) - 5, abst: 1.32,
        groesse: (x) => (x > 100 ? 0.7 : 1) * (0.7 + T2.rnd() * 0.6) },
      { pts: rumpf, nur: (x) => x >= 114, art: "voll", g: 1.2, abst: 1.7 },
      { pts: [[40, -60], [100, -52], [112, -48], [100, -42], [40, -48]], art: "voll", g: 2.2, abst: 1.6, dichte: 0.6 },
      { pts: geo.vn.pts.filter((p) => p[1] > -46), art: "voll", g: 1.05, abst: 2.3, groesse: (x, y) => 0.6 + (-y / 46) * 0.6, szene: false },
      { pts: geo.hn.pts.filter((p) => p[1] > -60), art: "voll", g: 1.1, abst: 2.3, groesse: (x, y) => 0.6 + (-y / 60) * 0.6, szene: false },
    ]);
    /* Rückenreihe großer Vollflecken, teils zu einer unterbrochenen Linie verschmolzen */
    let reihe = "";
    for (let x = 8; x < 106; x += 5 + T2.rnd() * 4) { const y = (rf.oben(x) || -96) + 2.6, l = 1.6 + T2.rnd() * 2.2; reihe += `M${f1(x - l)} ${f1(y)}a${f1(l)} 1.2 0 1 0 ${f1(2 * l)} 0a${f1(l)} 1.2 0 1 0 ${f1(-2 * l)} 0z`; }
    const id = T2.id("must");
    T2.def(`<g id="${id}"${fransen(T2, "fl", 0.12, 0.9, 0.7)}>${weich(T2, "fi", [`<path d="${kurz(f.innen)}" fill="#984c12" fill-opacity=".55"/>`], 1.1)}${fleckenSvg(f, S)}<path d="${kurz(reihe)}" fill="${S}"/></g>`);
    return { id,
      fern: (L) => fleckenSvg(flecken(T2, [{ pts: L.pts.filter((p) => p[1] > -50), art: "voll", g: 1, abst: 1.9, szene: false }]), S),
      schwanz: (T3, g) => {
        const P = linienPunkt(g.schwanz);
        let d = "";
        for (let k = 0; k < 3; k++) { const [x, y, tx, ty] = P(0.56 + k * 0.12); d += `M${f1(x - ty * 3.6)} ${f1(y + tx * 3.6)}q${f1(ty * 2 + tx)} ${f1(-tx * 2 + ty)} ${f1(ty * 4)} ${f1(-tx * 4)}`; }
        const [ex, ey] = P(1);
        const fl = flecken(T3, [{ pts: rohr(g.schwanz.slice(0, 5)).V.concat(rohr(g.schwanz.slice(0, 5)).H.reverse()), art: "voll", g: 1.1, abst: 1.4 }]);
        return fleckenSvg(fl, S) + `<path d="${kurz(d)}" stroke="${S}" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="${f1(ex)}" cy="${f1(ey)}" r="3.4" fill="${S}"/>`;
      } };
  };
  A.kopf = kopfVorlage(T, {
    x: 118, y: -80, k: 54, w: 10, schnauze: 0.84, hoch: 1.14, stirn: 5, stopp: 1.8, tief: 1,
    fell: [[0, "#b06e26"], [0.4, "#cc8c3c"], [0.7, "#dcb07a"], [1, "#f2e8d8"]], dunkel: "#9e5e1c",
    haarFarben: [["#7a4614", 1, 0.22, 0.3]], haarSpitze: ["#ffeccc", 0.2, 0.4], saum: ["#e8b46c", "#94582a"],
    nase: "#b87468", auge: { iris: "#c8a034", iris2: "#6a4a12", ring: "#ecd070", kerbe: 1.4 }, augeW: 8.4,
    zonen: (M) => [[M([[30, -14], [50, -16], [58, -6], [50, 10], [32, 8]]), "#e6a858", 0.35]],
    ohr: rundOhr(T, { x: 19, y: -31, s: 0.92, dunkel: "#120c08", rand: "#b8782e", fleck: "#e8dcc8" }),
    muster: (M) => {
      const f = flecken(T, [
        { pts: M([[22, -36], [56, -41], [68, -38], [64, -33], [44, -32], [24, -30]]), art: "voll", g: 0.95, abst: 1.4 },
        { pts: M([[28, -12], [48, -6], [52, -2], [30, -6]]), art: "voll", g: 0.85, abst: 1.9 },
        { pts: M([[26, 6], [42, 12], [45, 16], [28, 11]]), art: "voll", g: 0.85, abst: 1.9 },
      ]);
      return `<g${fransen(T, "kf", 0.2, 0.9, 0.5)}>${fleckenSvg(f, S)}</g>`;
    },
  });
  return katze(T, A);
}

/* =====================================================================
   GEPARD
   RECHERCHE (Cheetah Conservation Fund, Toronto Zoo, GBIF; Kritik Runde 1): Schulterhöhe 70–90 cm, Kopf-Rumpf 1,1–1,5 m,
   Schwanz 60–80 cm (≈ 60–65 % der Kopf-Rumpf-Länge), 21–72 kg. Windhund-Silhouette: tiefe, schmale, kielförmige Brust,
   extrem eingezogene Taille, lange dünne Beine (Z-Hinterbein mit langem schmalem Unterschenkel, hohem Fersenhöcker,
   langem Mittelfuß), Lende leicht gewölbt, schmaler Oberschenkel, kleiner runder Kopf mit kurzer, hoher Schnauze, hoch
   sitzenden Augen, kurzem breitem Nasenrücken, kleine runde Ohren (Rückseite schwarz). Schwarze TRÄNENSTREIFEN vom
   inneren Augenwinkel bis zum Mundwinkel, daneben hell. Nasenspiegel schwarz. Fell gelblich-lohfarben, kurz, etwas
   rau; Bauch cremeweiß. Volle runde schwarze Punkte (2–3 cm), gleichmäßig mit ≈ 1 Durchmesser Abstand, keine Rosetten;
   Schwanz: Punkte, dann 4–6 Ringe aus verschmolzenen Punkten, buschige weiße Spitze. Krallen nur halb einziehbar:
   kurze, stumpfe, dunkle Spitzen vorn an den Zehen; Afterkralle innen am Vorderbein. Kurze Nackenmähne.
   ===================================================================== */
function gepard(T) {
  const A = {
    hs: 80,
    P: { rumpf: 0.86, bein: 1.2, brust: -5, taille: 12, keule: 0.76, taillenX: 50, taillenB: 24, dickeV: 0.6, dickeH: 0.62, dickeAb: -84, pfoteV: 0.78, pfoteH: 0.78,
      fernH: 12, fernV: -12, schwanzW: [2.1, 1.8],
      schwanz: [[2.5, -84], [-3, -80], [-8, -71], [-11, -58], [-12, -45], [-11, -33], [-8, -24], [-3, -17.5], [3, -14.5], [9, -14]] },
    fell: [[0, "#bc8a40"], [0.12, "#cc9a4e"], [0.3, "#dab060"], [0.42, "#e2be78"], [0.5, "#ead0a0"], [0.56, "#f2e8d6"], [1, "#f4ecde"]],
    beinFell: [[0, "#bc8a40"], [0.12, "#cc9a4e"], [0.3, "#dab060"], [0.55, "#dfba72"], [0.8, "#e6c88e"], [1, "#ecd8b0"]],
    haar: { L: 1.7, nRumpf: 120, nKeule: 40, nSchulter: 36, nBein: 18, nSchwanz: 18,
      farben: [["#8a6024", 1, 0.15, 0.24]], spitze: ["#fff0d0", 0.13, 0.3], saumHell: "#ecc884", saumDunkel: "#a88040" },
    textur: ["#6a4a18", 0.1],
  };
  const S = "#1a120c";
  A.muster = (T2, geo, { rumpf }) => {
    const rf = rumpfFeld(geo, rumpf, -5, 140);
    const f = flecken(T2, [
      { pts: rumpf, art: "voll", g: 1.5, oben: rf.oben, unten: rf.unten, abst: 1.95, groesse: (x, y) => (y > rf.unten(x) - 8 ? 0.75 : 1) },
      { pts: geo.vn.pts.filter((p) => p[1] > -60), art: "voll", g: 1.05, abst: 1.9, groesse: (x, y) => 0.6 + (-y / 60) * 0.5, szene: false },
      { pts: geo.hn.pts.filter((p) => p[1] > -76), art: "voll", g: 1.15, abst: 1.9, groesse: (x, y) => 0.6 + (-y / 76) * 0.5, szene: false },
    ]);
    const id = T2.id("must");
    T2.def(`<g id="${id}"${fransen(T2, "fl", 0.12, 0.9, 0.5)}>${fleckenSvg(f, S)}</g>`);
    return { id,
      fern: (L) => fleckenSvg(flecken(T2, [{ pts: L.pts.filter((p) => p[1] > -64), art: "voll", g: 1, abst: 1.9, szene: false }]), S),
      schwanz: (T3, g) => {
        const P = linienPunkt(g.schwanz);
        let d = "";
        for (let k = 0; k < 5; k++) { const [x, y, tx, ty] = P(0.56 + k * 0.075), w = 1.3 + k * 0.25 + T3.rnd() * 0.5; d += band(T3, [[x - ty * 3, y + tx * 3], [x + tx * 0.6, y + ty * 0.6], [x + ty * 3, y - tx * 3]], w * 2, false, 0.5); }
        const sch = rohr(g.schwanz.slice(0, 6));
        return fleckenSvg(flecken(T3, [{ pts: sch.V.concat(sch.H.reverse()), art: "voll", g: 1, abst: 1.7 }]), S) + `<path d="${d}" fill="${S}"/>`;
      } };
  };
  /* weiße, buschige Schwanzspitze */
  A.schwanzEnde = (T2, geo) => schwanzSpitze(T2, geo, 0.9, ["#c8bca8", "#e0d8ca", "#f2ede4", "#fbf9f4"], () => 0.7, { breite: 2.6, n: 8, L0: 4, L1: 7, w: 0.9 });
  A.krallen = true;
  A.kopf = kopfVorlage(T, {
    x: 126, y: -86, k: 34, w: 16, schnauze: 0.74, hoch: 1.04, stirn: 4.5, weich: 4,
    fell: [[0, "#c4904a"], [0.4, "#d8aa64"], [0.7, "#e6c896"], [1, "#f4ecde"]], dunkel: "#b88440",
    haarFarben: [["#8a6024", 1, 0.24, 0.3]], haarSpitze: ["#fff4dc", 0.22, 0.4], saum: ["#f0d498", "#a87c3c"],
    nase: "#2a201c", auge: { iris: "#b8862c", iris2: "#5a3a10", ring: "#e0b860", kerbe: 0 }, augeW: 10, unterAuge: "#fbf6ec", ueberAuge: "#f8f0e0",
    ohr: rundOhr(T, { x: 22, y: -32, s: 0.82, dunkel: "#140e0a", rand: "#c8984c" }), tastL: 0.8,
    muster: (M) => {
      const f = flecken(T, [
        { pts: M([[24, -36], [56, -40], [66, -37], [62, -33], [44, -32], [26, -30]]), art: "voll", g: 0.75, abst: 1.5 },
        { pts: M([[30, -2], [44, 0], [46, 4], [32, 4]]), art: "voll", g: 0.6, abst: 2.6, dichte: 0.6 },
      ]);
      /* Tränenstreifen: vom inneren Augenwinkel an der Schnauzenseite zum Mundwinkel, daneben hell */
      const tr2 = band(T, M([[67.5, -24], [69.8, -17], [69.4, -9], [67.6, -1], [65, 7], [62, 14.6]]), 3, true, 0.6);
      const hell = band(T, M([[70.5, -22], [72.5, -15], [72, -7], [70, 1], [67, 9]]), 2.6, true, 0.4);
      return `<g${fransen(T, "kf", 0.25, 0.9, 0.7)}><path d="${hell}" fill="#fbf6ec" opacity=".9"/>${fleckenSvg(f, S)}<path d="${tr2}" fill="#140c08"/></g>`;
    },
  });
  /* kurze Nackenmähne */
  A.rumpfExtra = (T2, geo) => {
    const W = geo.R[geo.R.length - 1];
    return straehnen(T2, [[W[0] - 18, W[1] - 1], [W[0] + 12, W[1] - 1], [W[0] + 10, W[1] + 5], [W[0] - 18, W[1] + 4]], 10, 4, () => norm(-1, 0.35), 3, 5, 0.6,
      ["#a87a3a", "#c49656", "#dcb878", "#ecd2a0"], () => 0.5, { schwung: 0.3 });
  };
  return katze(T, A);
}

/* =====================================================================
   LUCHS (Eurasischer Luchs)
   RECHERCHE (Wikipedia „Eurasian lynx“, Big Cat Sanctuary, ActiveWild; Kritik Runde 1): Schulterhöhe 55–75 cm,
   Kopf-Rumpf 76–106 cm, Schwanz 11–25 cm, 18–30 kg. Kurzer Rumpf, lange Beine, Kruppe nur 5–8 % höher als der
   Widerrist, schlank (Brusttiefe ≈ 0,4 × Schulterhöhe), deutlicher Aufzug; sehr große, runde, behaarte Pfoten.
   Runder breiter Kopf, kurze Schnauze, hohe gewölbte Stirn mit 2–4 schmalen schwarzen Längsstrichen; dunkler Strich
   vom hinteren Augenwinkel nach hinten. BACKENBART an Wange und Kieferwinkel, hängt nach hinten-unten in zwei
   Spitzen (6–8 cm), cremegrau mit 2–3 schwarzen Querbändern. Ohren groß, dreieckig, aufrecht, Rand schwarz, Rückseite
   mit grauweißem Fleck, schwarze PINSEL (≈ 4 cm, geschlossenes Büschel). Stummelschwanz, Spitze rundum schwarz.
   Sommerfell rötlichbraun, Unterseite, Kehle, Brust, Beininnenseiten weiß; dunkelbraune bis schwarze Flecken, an
   Flanken und Beinen am deutlichsten, auf dem Rücken klein in Längsreihen. Augen gelb-bernstein.
   ===================================================================== */
function luchs(T) {
  const A = {
    hs: 66,
    P: { rumpf: 0.78, bein: 1.12, kruppe: 4, brust: -5, taille: 8, taillenX: 48, dickeV: 0.8, dickeH: 0.8, dickeAb: -70, pfoteV: 1.32, pfoteH: 1.28,
      fernH: 11, fernV: -11, schwanzW: [3.8, 3.4],
      schwanz: [[1, -83], [-3, -79.5], [-6, -74.5], [-7.6, -69.5]] },
    fell: [[0, "#a2683a"], [0.12, "#b07444"], [0.3, "#bc8452"], [0.4, "#c49264"], [0.45, "#dcc6a8"], [0.5, "#f0eae0"], [1, "#f2ece2"]],
    beinFell: [[0, "#a2683a"], [0.12, "#b07444"], [0.3, "#bc8452"], [0.55, "#c3925e"], [0.8, "#ccA070"], [1, "#dcc0a0"]],
    saumL: 2.2, schwanzMitte: true,
    haar: { L: 2.6, nRumpf: 84, nKeule: 26, nSchulter: 24, nBein: 14, nSchwanz: 10,
      farben: [["#5a3618", 1, 0.17, 0.3]], spitze: ["#f6e8d2", 0.15, 0.36], saumHell: "#d8b48c", saumDunkel: "#7a5232" },
    textur: ["#4a2a10", 0.12], pfotenHaar: "#e8dcc8",
  };
  const S = "#3a2414";
  A.muster = (T2, geo, { rumpf }) => {
    const rf = rumpfFeld(geo, rumpf, -5, 140);
    const f = flecken(T2, [
      /* Rücken: kleine Flecken in Längsreihen; Flanke größer und lockerer; Unterseite fast frei; Beine außen nach unten auslaufend */
      { pts: rumpf, nur: (x, y) => y < rf.oben(x) + 9, art: "voll", g: 0.8, oben: rf.oben, unten: (x) => rf.unten(x) - 4, abst: 2, groesse: () => 0.7 + T2.rnd() * 0.4 },
      { pts: rumpf, nur: (x, y) => y >= rf.oben(x) + 9 && y < rf.unten(x) - 9, art: "voll", g: 1.5, oben: rf.oben, unten: (x) => rf.unten(x) - 4, abst: 1.9, groesse: () => 0.6 + T2.rnd() * 0.8 },
      { pts: geo.vn.pts.filter((p) => p[1] > -56 && p[1] < -14), art: "voll", g: 0.95, abst: 2.2, szene: false, dichte: 0.7 },
      { pts: geo.hn.pts.filter((p) => p[1] > -76 && p[1] < -20), art: "voll", g: 1.05, abst: 2.2, szene: false, dichte: 0.7 },
    ]);
    const id = T2.id("must");
    T2.def(`<g id="${id}"${fransen(T2, "fl", 0.12, 0.9, 0.9)} opacity=".78">${T2.fein ? fleckenSvg(f, S) : ""}</g>`);
    return { id, fern: (L) => (T2.fein ? `<g opacity=".7">${fleckenSvg(flecken(T2, [{ pts: L.pts.filter((p) => p[1] > -60), art: "voll", g: 1, abst: 1.8 }]), S)}</g>` : "") };
  };
  /* Stummelschwanz: dicke, runde, rundum schwarze Spitze aus weichem Fell */
  A.schwanzEnde = (T2, geo) => {
    const P = linienPunkt(geo.schwanz), [x, y, tx, ty] = P(0.62), [x2, y2] = P(1);
    const feld = [[x - ty * 3.4, y + tx * 3.4], [x + ty * 3.4, y - tx * 3.4], [x2 + ty * 3.4 + tx * 2.4, y2 - tx * 3.4 + ty * 2.4], [x2 - ty * 3.4 + tx * 2.4, y2 + tx * 3.4 + ty * 2.4]];
    return `<g${volumen(T2, "quaste", { weich: 1.6 })}><path d="${G([feld[0], feld[1], feld[2], [x2 + tx * 4, y2 + ty * 4], feld[3]], true, 2)}" fill="#1a120c"/>` +
      straehnen(T2, feld, 8, 5, () => norm(tx, ty), 3, 5, 0.8, ["#0e0806", "#1e140c", "#3a2618"], () => 0.4, { schwung: 0.3 }) + `</g>`;
  };
  const K = A.kopf = kopfVorlage(T, {
    x: 116, y: -91, k: 40, w: 6, schnauze: 0.72, hoch: 1.04, stirn: 4.5, weich: 4,
    fell: [[0, "#a26c40"], [0.4, "#bc8a5e"], [0.7, "#d4bc9c"], [1, "#f2ece2"]], dunkel: "#8e5c34",
    haarFarben: [["#5a3618", 1, 0.24, 0.32]], haarSpitze: ["#f8ecda", 0.22, 0.42], saum: ["#e2c8a4", "#7a5232"],
    nase: "#c4806e", auge: { iris: "#ccac40", iris2: "#6a5012", ring: "#ecd880" }, augeW: 10.4, polster: "#f6f2ea", unterAuge: "#fbf8f2", ueberAuge: "#faf6ee",
    ohr: { pts: [[22, -33], [24, -46], [28, -58], [31, -61], [35, -56], [40, -44], [42, -33]], weich: 1.4, vorn: true,
      spitze: `<path d="M29.4 -59.5Q29 -66 30.6 -74Q31.6 -66 32.6 -59.5z" fill="#140c08"/><path d="M30.6 -60q-.6 -7 .1 -14.5M30.1 -60q-1.2 -6 -.8 -12M31.2 -60q.6 -6 1.6 -11.5" fill="none" stroke="#0a0604" stroke-width=".35" stroke-linecap="round"/>`,
      farbe: T.lg("ohr", [[0, "#2a1a10"], [0.3, "#3a2416"], [0.7, "#8a5c3a"], [1, "#a8784e"]]),
      innen: `<path d="M22.6 -36q2 -12 6.6 -23.5l1.8 1q-4.4 10 -6 22.5z" fill="#120c08"/><path d="M33 -38q2 -9 2.4 -15q3 5 3.6 15z" fill="#e8dccb" opacity=".95"/>` +
        haare(T, [[33, -38], [35.5, -52], [39, -38]], 14, 252, 4, [["#fbf6ee", 1, 0.28, 0.9]], { streu: 30 }),
      saum: null },
    zonen: (M) => [[M([[24, -12], [44, -14], [52, -4], [48, 10], [30, 8]]), "#e6d4bc", 0.5]],
    muster: (M) => {
      const l = [M([[42, -40], [44, -34], [47, -29]]), M([[48, -41], [49.5, -35.5], [51.5, -31]]), M([[36, -38], [37, -32], [39, -27]]), M([[54, -40.5], [55, -36.5]])].map((m) => band(T, m, 1.2)).join("");
      const auge = band(T, M([[57, -27], [50, -25], [42, -21], [34, -16]]), 1.4);
      const f = flecken(T, [{ pts: M([[24, -32], [40, -34], [46, -26], [30, -24]]), art: "voll", g: 0.55, abst: 1.8 }]);
      return `<g${fransen(T, "kf", 0.2, 0.9, 0.4)}><path d="${l}${auge}" fill="#1e140c" opacity=".85"/>${fleckenSvg(f, S)}</g>`;
    },
  });
  /* Backenbart: 8–12 Locken an Wange und Kieferwinkel, hinter dem Kopf angesetzt, nach hinten-unten in zwei Spitzen;
     oben creme, unten-innen dunkler; zwei schwarze Querbänder laufen von der Wange hinein */
  A.hinterKopf = (T2, geo, box, gk) => {
    const P = K.P, W = (x, y) => tr(P(x, y), gk), liste = [];
    const n = T2.fein ? 12 : 6;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), p = W(40 + t * 12 - Math.sin(t * Math.PI) * 6, -8 + t * 34);
      const d = norm(-0.95 + t * 0.4, 0.45 + t * 0.4), L = 12 + T2.rnd() * 3 + (Math.abs(t - 0.35) < 0.14 || Math.abs(t - 0.85) < 0.1 ? 7 : 0);
      liste.push([p, d, L, 4.6, (T2.rnd() - 0.5) * 1.2, mische("#a89482", "#f6f2ec", 0.85 - t * 0.5 + (T2.rnd() - 0.5) * 0.2)]);
    }
    const streif = [[[42, 0], [34, 4], [26, 9], [19, 14]], [[46, 14], [38, 19], [30, 24], [24, 28]]].map((m) => band(T2, m.map(([a, b]) => W(a, b)), 1.6, true)).join("");
    return `<g${volumen(T2, "bart", { weich: 1.6 })}>` + haarLocken(T2, liste, { straehnen: 6, hell: "#ffffff", mittel: "#b8a898", dunkel: "#5a4a3c", dOp: 0.45, strW: 0.22 }) +
      `<path d="${streif}" fill="#16100c" opacity=".88"/></g>`;
  };
  return katze(T, A);
}
module.exports = [
  { id: "loewe", de: "der Löwe", syl: "LÖ-we", it: "il leone", itSyl: "le-O-ne", en: "lion", gruppe: "Raubtiere", lebensraum: "Savanne",
    laenge: 2.1, hoehe: 1.29, zeichne: loewe },
  { id: "loewin", de: "die Löwin", syl: "LÖ-win", it: "la leonessa", itSyl: "le-o-NES-sa", en: "lioness", gruppe: "Raubtiere", lebensraum: "Savanne",
    laenge: 1.74, hoehe: 1.07, zeichne: loewin },
  { id: "tiger", de: "der Tiger", syl: "TI-ger", it: "la tigre", itSyl: "TI-gre", en: "tiger", gruppe: "Raubtiere", lebensraum: "Dschungel",
    laenge: 2.0, hoehe: 1.1, zeichne: tiger },
  { id: "leopard", de: "der Leopard", syl: "le-o-PARD", it: "il leopardo", itSyl: "le-o-PAR-do", en: "leopard", gruppe: "Raubtiere", lebensraum: "Savanne",
    laenge: 1.25, hoehe: 0.68, zeichne: leopard },
  { id: "jaguar", de: "der Jaguar", syl: "JA-gu-ar", it: "il giaguaro", itSyl: "gia-GUA-ro", en: "jaguar", gruppe: "Raubtiere", lebensraum: "Regenwald",
    laenge: 1.34, hoehe: 0.7, zeichne: jaguar },
  { id: "gepard", de: "der Gepard", syl: "ge-PARD", it: "il ghepardo", itSyl: "ghe-PAR-do", en: "cheetah", gruppe: "Raubtiere", lebensraum: "Savanne",
    laenge: 1.21, hoehe: 0.82, zeichne: gepard },
  { id: "luchs", de: "der Luchs", syl: "LUCHS", it: "la lince", itSyl: "LIN-ce", en: "lynx", gruppe: "Raubtiere", lebensraum: "Wald",
    laenge: 0.95, hoehe: 0.81, zeichne: luchs },
];
