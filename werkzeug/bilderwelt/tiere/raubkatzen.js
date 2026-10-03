"use strict";
/* =====================================================================
   RAUBKATZEN — Löwe, Löwin, Tiger, Leopard, Gepard, Jaguar, Luchs (FASSUNG 854, MASSSTAB 2)
   Gemeinsamer Bauplan „katze“: Rumpf + nahe Beine aus EINER Fellfläche (nahtlos), ferne Beine dunkler,
   Muskeln als weich geblendete Licht-/Schattenformen, Fell Haar für Haar in Wuchsrichtung (mehrere Lagen),
   Rausch-Textur, Muster (Streifen/Rosetten/Flecken) als echte Formen, Kopf im Profil mit T.augeReal.
   Licht von links oben. Maße in cm, Blick nach rechts, Boden y = 0.
   ===================================================================== */
const r = (n) => Math.round(n * 10) / 10;
const f1 = (n) => String(Math.round(n * 10) / 10).replace(/^(-?)0\./, "$1.");
const kurz = (d) => d.replace(/ -/g, "-");
const UB = ' gradientUnits="userSpaceOnUse"';
const RAD = Math.PI / 180;

/* glatte Kurve (Catmull-Rom), Genauigkeit p (1 = ganze cm, 10 = mm); [x, y, 1] = harte Ecke */
function G(pts, zu = true, p = 1) {
  const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const q = (v) => Math.round(v * p) / p;
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
const tr = (p, g) => { const c = Math.cos(g.w), s = Math.sin(g.w), x = p[0] * g.k, y = p[1] * g.k; return [g.x + x * c - y * s, g.y + x * s + y * c]; };

/* Bein mit Pfote (Zehengänger): V = Vorderkante, H = Hinterkante (je von oben nach unten, letzter Punkt = Fessel),
   pl = wie weit die Zehen vor die Fessel ragen, ph = Höhe der Zehenwölbung, krallen = sichtbare Krallen (Gepard).
   Zehen als drei Wölbungen (Knöchel), weiche Zehenfurchen, Ballen hinten. */
function bein(L, pl, ph, krallen = 0) {
  const V = L.V.filter((p) => p[1] < -ph * 1.3), H = L.H.filter((p) => p[1] < -ph * 0.9);
  const F = V[V.length - 1], Hb = H[H.length - 1], xf = F[0], x0 = Hb[0];
  const pf = [[xf + pl * 0.1, -ph * 1.24], [xf + pl * 0.32, -ph * 1.14], [xf + pl * 0.54, -ph * 0.98], [xf + pl * 0.74, -ph * 0.77],
    [xf + pl * 0.9, -ph * 0.5], [xf + pl * 0.99, -ph * 0.22], [xf + pl * 0.94, -ph * 0.04], [xf + pl * 0.8, 0, 1],
    [x0 - pl * 0.1, 0, 1], [x0 - pl * 0.22, -ph * 0.26], [x0 - pl * 0.14, -ph * 0.72]];
  const z = (t, h) => `M${f1(xf + pl * t)} ${f1(-ph * h)}q${f1(pl * 0.05)} ${f1(ph * 0.22)} ${f1(pl * 0.04)} ${f1(ph * 0.42)}`;
  let kr = "";
  if (krallen) for (const [t, h] of [[0.99, 0.3], [0.74, 0.62]]) kr += `M${f1(xf + pl * t)} ${f1(-ph * h)}q${f1(pl * 0.12)} ${f1(ph * 0.05)} ${f1(pl * 0.1)} ${f1(ph * 0.34)}`;
  return { pts: V.concat(pf, H.slice().reverse()), V, H, x: (xf + x0) / 2, zehen: kurz(z(0.5, 1.02) + z(0.73, 0.8)), krallen: kurz(kr),
    sohle: [x0 - pl * 0.1, xf + pl * 0.84], pfote: [[xf - 2, -ph * 1.05], [xf + pl * 0.98, -ph * 0.5], [xf + pl * 0.8, -ph * 0.05], [x0, -ph * 0.1], [x0, -ph * 0.9]] };
}
/* Mittellinie → Kanten (für Schwanz) */
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
/* Locken (Haarbüschel) in einem Feld: getönte, spitz zulaufende Strähnenbündel in Fließrichtung fl(x, y) → [fx, fy].
   farbe(x, y) → Farbe (Licht/Lage). Ferne Locken zuerst (sort), gleiche Farben in EINEM Pfad. */
function lockenFeld(T, feld, n, fl, L0, L1, breite, farbe, tiefe, o = {}) {
  const [x0, y0, x1, y1] = T.box(feld), saat = [];
  const ziel = Math.round(n * (T.fein ? 1 : (o.szene != null ? o.szene : 0.6)));
  let v = 0;
  while (saat.length < ziel && v < ziel * 30) { v++; const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0); if (T.inPoly(x, y, feld)) saat.push([x, y, T.rnd()]); }
  saat.sort((a, b) => tiefe(b[0], b[1]) - tiefe(a[0], a[1]));
  const reihe = [];
  for (const [x, y, z] of saat) {
    const [fx, fy] = fl(x, y), px = -fy, py = fx, len = L0 + z * (L1 - L0), w = breite * (0.6 + T.rnd() * 0.7), b = (T.rnd() - 0.5) * len * 0.45;
    const S = [x + px * w / 2, y + py * w / 2], Tp = [x + fx * len + px * b * 0.5, y + fy * len + py * b * 0.5];
    const C1 = [x + fx * len * 0.5 + px * (w * 0.4 + b * 0.5), y + fy * len * 0.5 + py * (w * 0.4 + b * 0.5)];
    const C2 = [x + fx * len * 0.5 + px * (-w * 0.4 + b * 0.5), y + fy * len * 0.5 + py * (-w * 0.4 + b * 0.5)];
    const E = [x - px * w / 2, y - py * w / 2];
    const d = `M${f1(S[0])} ${f1(S[1])}q${f1(C1[0] - S[0])} ${f1(C1[1] - S[1])} ${f1(Tp[0] - S[0])} ${f1(Tp[1] - S[1])}q${f1(C2[0] - Tp[0])} ${f1(C2[1] - Tp[1])} ${f1(E[0] - Tp[0])} ${f1(E[1] - Tp[1])}z`;
    const c = farbe(x, y, z), e = reihe.find((q) => q[0] === c);
    if (e) { e[1] += d; e[2] += tiefe(x, y); e[3]++; } else reihe.push([c, d, tiefe(x, y), 1]);
  }
  reihe.sort((a, b) => b[2] / b[3] - a[2] / a[3]);
  return reihe.map(([c, d]) => `<path d="${kurz(d)}" fill="${c}" stroke="#140a04" stroke-opacity="${o.kante != null ? o.kante : 0.22}" stroke-width="${o.kw || 0.35}"/>`).join("");
}
/* Haarbüschel (Strähnen in Bündeln, wie gemalt): n Büschel, je o.pro Haare, Wurzeln quer verteilt, Spitzen
   zusammenlaufend, gemeinsam gebogen. ton(x, y) → 0 (dunkel) … 1 (hell) wählt die Stufe der Farbrampe; je Stufe EIN Pfad,
   dunkle Stufen zuerst (Glanzlichter oben). Wurzeln ganzzahlig, Rest auf mm. */
function bueschel(T, feld, n, fl, L0, L1, rampe, ton, o = {}) {
  const [x0, y0, x1, y1] = T.box(feld), pro = o.pro || 8, eimer = rampe.map(() => "");
  const ziel = Math.round(n * (T.fein ? 1 : (o.szene != null ? o.szene : 0.3)));
  const proZ = T.fein ? pro : Math.max(3, Math.round(pro * 0.6));
  let v = 0, g = 0;
  while (g < ziel && v < ziel * 30) {
    v++;
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!T.inPoly(x, y, feld)) continue;
    g++;
    const [fx, fy] = fl(x, y), px = -fy, py = fx, len = L0 + T.rnd() * (L1 - L0), b = (T.rnd() - 0.5) * len * (o.biegung || 0.5);
    const wB = (o.breite || 4) * (0.6 + T.rnd() * 0.8), t0 = ton(x, y);
    const tx = x + fx * len + px * b * 0.3, ty = y + fy * len + py * b * 0.3;
    for (let j = 0; j < proZ; j++) {
      const u = j / (proZ - 1) - 0.5, sh = (T.rnd() - 0.5) * len * 0.2;
      const rx = Math.round(x + px * u * wB + fx * sh), ry = Math.round(y + py * u * wB + fy * sh);
      const k = 0.7 + T.rnd() * 0.35;
      const ex = (tx + px * u * wB * 0.2 - rx) * k, ey = (ty + py * u * wB * 0.2 - ry) * k;
      const cx = ex / 2 + px * b * 0.6, cy = ey / 2 + py * b * 0.6;
      const t = Math.max(0, Math.min(0.999, t0 + (T.rnd() - 0.5) * (o.streu != null ? o.streu : 0.3) + (Math.abs(u) < 0.2 ? 0.08 : 0)));
      eimer[Math.floor(t * rampe.length)] += `M${rx} ${ry}q${f1(cx)} ${f1(cy)} ${f1(ex)} ${f1(ey)}`;
    }
  }
  return eimer.map((d, i) => d ? `<path d="${kurz(d)}" fill="none" stroke="${rampe[i]}" stroke-width="${o.w || 0.6}" stroke-opacity="${o.op || 0.8}" stroke-linecap="round"/>` : "").join("");
}
/* Musterband (Streifen): Mittellinie mp, Breite w, spitz auslaufend (stumpf = oben volle Breite, z. B. am Rückgrat
   angeschnitten). Ausgefranste Breite. Liefert Pfad-d mit 0,5 cm Genauigkeit. */
function band(T, mp, w, stumpf = false) {
  const n = mp.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = mp[Math.max(0, i - 1)], b = mp[Math.min(n - 1, i + 1)];
    const [dx, dy] = norm(b[0] - a[0], b[1] - a[1]);
    const t = i / (n - 1);
    const ww = w * Math.pow(Math.max(0.02, Math.sin(Math.PI * (stumpf ? 0.5 + t * 0.5 : t))), 0.55) * (0.78 + T.rnd() * 0.44) / 2;
    L.push([mp[i][0] - dy * ww, mp[i][1] + dx * ww]); R.push([mp[i][0] + dy * ww, mp[i][1] - dx * ww]);
  }
  return G(L.concat(R.reverse()), true, T.fein ? 2 : 1);
}
/* Streifen von oben nach unten: Start (x, y), Länge L, Neigung a (Grad, + = untere Spitze nach hinten), Biegung b (cm), Wellen */
function streifenLinie(T, x, y, L, a, b, n = 6) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), w = Math.sin(t * Math.PI * 1.6 + T.rnd()) * L * 0.025;
    pts.push([x - Math.sin(a * RAD) * L * t + b * t * t + w, y + Math.cos(a * RAD) * L * t]);
  }
  return pts;
}
/* Bogen um Mitte (cx, cy), Radius R, von Winkel a0 bis a1 (Grad) */
function bogen(cx, cy, R, a0, a1, n = 7) {
  const p = [];
  for (let i = 0; i < n; i++) { const a = (a0 + (a1 - a0) * i / (n - 1)) * RAD; p.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); }
  return p;
}
/* Punkt auf der Schwanz-Mittellinie bei Anteil u (0 = Ansatz, 1 = Spitze): [x, y, tx, ty] (Tangente normiert) */
function schwanzPunkt(J) {
  const seg = [];
  for (let i = 0; i < J.length - 1; i++) seg.push([J[i], J[i + 1], Math.hypot(J[i + 1][0] - J[i][0], J[i + 1][1] - J[i][1])]);
  const ges = seg.reduce((s, q) => s + q[2], 0);
  return (u) => {
    let l = u * ges;
    for (const [a, b, L] of seg) { if (l <= L || b === seg[seg.length - 1][1]) { const t = Math.min(1, l / L), [tx, ty] = norm(b[0] - a[0], b[1] - a[1]); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, tx, ty]; } l -= L; }
  };
}
/* Haare: n Haare in Polygon pts, Wuchsrichtung w (Grad oder Funktion), Länge L; farben [[farbe, anteil, breite, deckkraft]]
   o: { streu (Grad), krumm, szene (Anteil bei T.fein = false) }. Relative Koordinaten → ~24 Byte je Haar. */
function haare(T, pts, n, w, L, farben, o = {}) {
  const [x0, y0, x1, y1] = T.box(pts);
  const sum = farben.reduce((s, f) => s + f[1], 0), eimer = farben.map(() => "");
  const ziel = Math.round(n * (T.fein ? 1 : (o.szene != null ? o.szene * 0.5 : 0.04)));
  let v = 0, g = 0;
  while (g < ziel && v < ziel * 15) {
    v++;
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!T.inPoly(x, y, pts)) continue;
    const a = ((typeof w === "function" ? w(x, y) : w) + (T.rnd() - 0.5) * (o.streu != null ? o.streu : 18)) * RAD;
    const l = L * (0.6 + T.rnd() * 0.8), ex = Math.cos(a) * l, ey = Math.sin(a) * l;
    const k = (o.krumm != null ? o.krumm : 0.2) * l * (T.rnd() - 0.5) * 2;
    let u = T.rnd() * sum, i = 0;
    while (i < farben.length - 1 && u > farben[i][1]) { u -= farben[i][1]; i++; }
    eimer[i] += `M${Math.round(x)} ${Math.round(y)}` + (L <= 3.5 ? `l${f1(ex)} ${f1(ey)}` : `q${f1(ex / 2 - Math.sin(a) * k)} ${f1(ey / 2 + Math.cos(a) * k)} ${f1(ex)} ${f1(ey)}`);
    g++;
  }
  return eimer.map((d, i) => d ? `<path d="${kurz(d)}" fill="none" stroke="${farben[i][0]}" stroke-width="${farben[i][2]}" stroke-opacity="${farben[i][3]}" stroke-linecap="round"/>` : "").join("");
}
/* weiche Licht-/Schattenformen: [x, y, rx, ry, winkel, farbe, deckkraft] in einer geblendeten Gruppe */
function weich(T, name, liste, sd, extra = "") {
  const id = T.id("bl" + name);
  T.def(`<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${sd}"/></filter>`);
  const e = liste.map((el) => {
    if (typeof el === "string") return el;
    const [x, y, rx, ry, w, c, o] = el;
    if (Array.isArray(x)) return `<path d="${G(x)}" fill="${y}" fill-opacity="${rx}"/>`;
    return `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rx)}" ry="${r(ry)}"${w ? ` transform="rotate(${w} ${r(x)} ${r(y)})"` : ""} fill="${c}" fill-opacity="${o}"/>`;
  }).join("");
  return `<g filter="url(#${id})">${e}${extra}</g>`;
}
/* Fell-Textur (gestreckte Rauschstruktur): ein gefiltertes Rechteck über box, gedreht; muss in einer schon geklippten
   Gruppe stehen (spart den zweiten Umriss). */
function textur(T, n, d, winkel, op, b, farbe = "#2a1606", fx = 0.9, fy = 0.11) {
  if (!T.fein || !T.rauschen || !op) return "";
  const f = T.rauschen(n, { fx, fy, farbe, staerke: 2.8, schwelle: 0.52, okt: 3 });
  const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, R = Math.round(Math.hypot(b[2] - b[0], b[3] - b[1]) / 2 + 2);
  return `<rect x="${Math.round(cx - R)}" y="${Math.round(cy - R)}" width="${2 * R}" height="${2 * R}" filter="${f}" opacity="${op}" transform="rotate(${winkel} ${Math.round(cx)} ${Math.round(cy)})"/>`;
}
/* Haarlocken an einer Kante: Basis–Spitze–Basis, Spitzen in Fließrichtung fl(x, y) */
function locken(T, pts, schritt, laenge, fl) {
  const o = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / schritt));
    for (let k = 0; k < n; k++) {
      const t = (k + T.rnd() * 0.3) / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
      o.push([x, y]);
      const tm = (k + 0.5) / n, xm = x0 + (x1 - x0) * tm, ym = y0 + (y1 - y0) * tm, [fx, fy] = fl(xm, ym), L = laenge * (0.35 + T.rnd() * 0.9);
      o.push([xm + fx * L * 0.55 - fy * 1.5, ym + fy * L * 0.55 + fx * 1.5]);
      o.push([xm + fx * L, ym + fy * L, 1]);
    }
  }
  o.push(pts[pts.length - 1]);
  return o;
}

/* =====================================================================
   DIE KATZE — A: Bauplan einer Art (siehe Löwe)
   ===================================================================== */
function katze(T, A) {
  const B = [];
  const box = (pts) => { for (const p of pts) B.push(p); return pts; };
  const RF = A.randFarbe || "#1c1008";
  const fell = T.lg("fell", A.fell, 0, -A.hs * 1.1, 0, 0, UB);
  const bfell = A.beinFell ? T.lg("beinfell", A.beinFell, 0, -A.hs * 1.1, 0, 0, UB) : fell;
  const def = (n, d) => { const id = T.id(n); T.def(`<path id="${id}" d="${d}"/>`); return `href="#${id}"`; };
  const strich = (o, w, c = RF) => `fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="${r(w)}" stroke-linejoin="round" stroke-linecap="round"`;
  const F = T.fein;
  const hb = A.haarBreite || 0.3;
  let s = "";
  /* ---------- ferne Beine: dunkler (Tiefe), eigene Haare ---------- */
  const vf = bein(A.vf, A.pl, A.ph, A.krallen), hf = bein(A.hf, A.pl * 0.9, A.ph * 0.95, A.krallen);
  for (const [n, b] of [["vf", vf], ["hf", hf]]) {
    const h = def(n, G(box(b.pts)));
    const c = T.id(n + "c");
    T.def(`<clipPath id="${c}"><use ${h}/></clipPath>`);
    s += `<use ${h} fill="${bfell}"/><g clip-path="url(#${c})">${A.musterFern ? A.musterFern(T, b, n) : ""}` +
      (F ? haare(T, b.pts, A.haarBein * 0.45, 95, A.haarL * 0.8, A.haarFarben.slice(0, 2)) : "") +
      `<use ${h} fill="#1a0e06" fill-opacity="${A.fernDunkel || 0.3}"/>` +
      weich(T, n, [], A.hs * 0.012, `<path d="${G(b.H, false)}" ${strich(0.32, A.hs * 0.05, "#120802")}/><path d="${G(b.V.slice(1), false)}" ${strich(0.16, A.hs * 0.03, "#fff4e0")}/>`) + `</g>` +
      `<use ${h} ${strich(0.35, 0.6)}/><path d="${b.zehen}" ${strich(0.35, 0.5)}/>` + (b.krallen ? `<path d="${b.krallen}" ${strich(0.95, 0.7, "#2a2420")}/>` : "");
  }
  /* ---------- Schwanz ---------- */
  const sw = rohr(A.schwanz), swPts = box(sw.V.concat(sw.H.slice().reverse()));
  const sh = def("sw", G(swPts));
  T.def(`<clipPath id="${T.id("swc")}"><use ${sh}/></clipPath>`);
  s += `<use ${sh} fill="${A.schwanzBein ? bfell : fell}"/><g clip-path="url(#${T.id("swc")})">` + (A.schwanzMuster ? A.schwanzMuster(T, A, sw) : "") +
    (F ? haare(T, swPts, A.haarSchwanz || 60, A.schwanzWinkel || 100, A.haarL, A.haarFarben) : "") +
    weich(T, "sw", [], 1.2, `<path d="${G(sw.H, false)}" ${strich(0.35, A.schwanz[0][2] * 0.9, "#1a0e06")}/><path d="${G(sw.V, false)}" ${strich(0.2, A.schwanz[0][2] * 0.6, "#fff")}/>`) +
    `</g><use ${sh} ${strich(0.3, 0.5)}/>`;
  if (A.schwanzEnde) s += A.schwanzEnde(T, A, sw);
  /* ---------- Rumpf + nahe Beine (eine Fellfläche) ---------- */
  const kd = G(box(A.koerper)), kh = def("k", kd);
  const hn = bein(A.hn, A.pl * 0.9, A.ph * 0.95, A.krallen), vn = bein(A.vn, A.pl, A.ph, A.krallen);
  const hh = def("hn", G(box(hn.pts))), vh = def("vn", G(box(vn.pts)));
  const clip = T.id("ku");
  T.def(`<clipPath id="${clip}"><use ${kh}/><use ${hh}/><use ${vh}/></clipPath>`);
  s += `<use ${kh} fill="${fell}"/><use ${kh} ${strich(0.28, 0.5)}/><use ${hh} fill="${bfell}"/><use ${vh} fill="${bfell}"/>`;
  let i = "";
  if (A.muster) i += A.muster(T, A, { vn, hn });
  const bb = T.box(A.koerper.concat(hn.pts, vn.pts));
  i += textur(T, "k", "", A.texturWinkel != null ? A.texturWinkel : 90, A.texturDeck || 0, bb);
  /* Plastik: Muskeln, Kernschatten, Kantenlicht (weich geblendet) */
  if (A.formenFein && F) i += weich(T, "kf", A.formenFein, A.hs * 0.016);
  i += weich(T, "k", A.formen || [], A.weichSd || A.hs * 0.045,
    `<use ${kh} ${strich(0.28, A.hs * 0.09, "#2a1506")}/>` +
    `<path d="${G(A.ruecken, false)}" ${strich(0.28, A.hs * 0.06, "#fff6e0")}/>` +
    (A.bauch ? `<path d="${G(A.bauch, false)}" ${strich(0.14, A.hs * 0.04, "#ffe6c0")}/>` : "") +
    [hn, vn].map((b) => (A.beinHinten ? `<path d="${G(b.H.slice(2), false)}" ${strich(0.85, A.hs * 0.075, A.beinHinten)}/>` : "") +
      `<path d="${G(b.H.slice(1), false)}" ${strich(0.26, A.hs * 0.055, "#2a1506")}/><path d="${G(b.V.slice(2), false)}" ${strich(0.14, A.hs * 0.026, "#fff")}/>`).join(""));
  i += `<rect x="${bb[0] - 20}" y="${-A.hs * 1.3}" width="${bb[2] - bb[0] + 40}" height="${A.hs * 1.3}" fill="${T.lg("vol", A.vol || [[0, "#fff8e8", 0.26], [0.22, "#fff8e8", 0.08], [0.42, "#000", 0], [0.56, "#2a1204", 0.16], [0.64, "#2a1204", 0.3], [0.8, "#2a1204", 0.14], [1, "#2a1204", 0.24]], 0, -A.hs * 1.08, 0, 0, UB)}"/>`;
  if (F) i += weich(T, "se", (A.sehnen || []).map(([pts, w, o, c]) => `<path d="${G(pts, false)}" ${strich(o, w, c || "#2a1506")}/>`), 0.6);
  if (F) for (const Q of A.haarFelder(T, { vn, hn })) i += haare(T, Q[0], Q[1], Q[2], Q[3], Q[4], Q[5] || {});
  /* Pfotenfell: kurze Haare nach vorn-unten über den Zehen */
  if (F) for (const b of [hn, vn]) i += haare(T, b.pfote, 26, 35, A.ph * 0.25, A.haarFarben, { streu: 30 });
  s += `<g clip-path="url(#${clip})">${i}</g>`;
  /* Ränder: Rumpf ganz, nahe Beine nur unterhalb des Rumpfes */
  for (const [n, h, b, y, xh] of [["rh", hh, hn, A.randH, A.randHx], ["rv", vh, vn, A.randV]]) {
    T.def(`<clipPath id="${T.id(n)}"><rect x="-99" y="${y}" width="600" height="99"/>${xh != null ? `<rect x="-99" y="-86" width="${xh + 99}" height="99"/>` : ""}</clipPath>`);
    s += `<use ${h} ${strich(0.32, 0.55)} clip-path="url(#${T.id(n)})"/><path d="${b.zehen}" ${strich(0.32, 0.5)}/>` +
      (b.krallen ? `<path d="${b.krallen}" ${strich(0.95, 0.7, "#2a2420")}/>` : "");
  }
  if (A.fransen) for (const Q of A.fransen) s += haare(T, Q[0], Q[1], Q[2], Q[3], Q[4], Q[5] || {});
  /* Kontaktschatten unter den Ballen */
  s += `<path d="${[vn, hn, vf, hf].map((b) => `M${Math.round(b.sohle[0])} 0H${Math.round(b.sohle[1])}`).join("")}" stroke="#000" stroke-opacity=".35" stroke-width="1.1" stroke-linecap="round"/>`;
  if (A.hinterKopf) s += A.hinterKopf(T, box);
  s += kopf(T, A, box);
  if (A.vorKopf) s += A.vorKopf(T, box);
  if (A.ohrSpaeter) s += A.ohrSpaeter;
  const bx = T.box(B).map(Math.round);
  bx[3] = 0;
  return { svg: s, box: bx };
}

/* ---------- Kopf (lokal: Kopflänge 100 Einheiten, Nase rechts, y nach unten) ---------- */
function kopf(T, A, box) {
  const H = A.kopf, g = { x: H.x, y: H.y, k: H.k / 100, w: (H.w || 0) * RAD };
  box(H.umriss.map((p) => tr(p, g)));
  if (H.ohr) box(H.ohr.map((p) => tr(p, g)));
  const id = T.id("kp"), kd = G(H.umriss);
  T.def(`<path id="${id}" d="${kd}"/><clipPath id="${T.id("kc")}"><use href="#${id}"/></clipPath>`);
  let s = H.hinten || "";
  const ohr = H.ohr ? `<path d="${G(H.ohr)}" fill="${H.ohrFarbe}"/>` + (H.ohrInnen || "") + `<path d="${G(H.ohr)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".7"/>` : "";
  const tf = `translate(${r(g.x)} ${r(g.y)})rotate(${H.w || 0})scale(${H.k / 100})`;
  if (H.ohrVorn) A.ohrSpaeter = `<g transform="${tf}">${ohr}</g>`; else s += ohr;
  s += `<use href="#${id}" fill="${T.lg("kopf", H.fell, 0, -45, 0, 34, UB)}"/>`;
  s += `<g clip-path="url(#${T.id("kc")})">${H.zeichnung || ""}` +
    (H.textur ? textur(T, "kopf", kd, H.texturWinkel || 0, H.textur, [-5, -50, 110, 40]) : "") +
    weich(T, "kopf", T.fein ? H.formen || [] : [], 2.4, `<path d="${G(H.profil, false)}" fill="none" stroke="#2a1506" stroke-opacity=".28" stroke-width="8"/>`) +
    `<use href="#${id}" fill="${T.lg("kvol", [[0, "#fff", 0.12], [0.35, "#fff", 0], [0.7, "#000", 0.05], [1, "#000", 0.26]], 0, -45, 0, 34, UB)}"/>` +
    (H.muster || "") + (H.haare && T.fein ? H.haare(T) : "") + `</g>`;
  s += `<path d="${G(H.profil, false)}" fill="none" stroke="#1a1009" stroke-opacity=".38" stroke-width=".8" stroke-linecap="round"/>`;
  s += (T.fein ? H.details : H.detailsSzene || H.details) || "";
  return `<g transform="${tf}">${s}</g>`;
}

/* Nasenspiegel im Profil (lokal): Form, Nasenloch, Rinne, feuchter Glanz, feine Narbung */
function nase(T, pts, loch, farbe, glanz) {
  const d = G(pts, true, 10);
  return `<path d="${d}" fill="${farbe}"/>` +
    (T.fein && T.relief ? `<g opacity=".5" filter="${T.relief("nase", { f: 2.2, tiefe: 0.3, okt: 2 })}"><path d="${d}" fill="${farbe}"/></g>` : "") +
    `<path d="${loch}" fill="none" stroke="#120806" stroke-width="1.5" stroke-linecap="round"/>` +
    `<path d="${glanz}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width=".9" stroke-linecap="round"/>`;
}
/* Tasthaar-Punkte (Reihen) */
const punkte = (pp, w = 1.2, c = "#1e140c") => `<path d="M${pp.map(([x, y]) => x + " " + y + "h0").join("M")}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
/* Farbe mischen (hex) */
const mische = (a, b, t) => { const h = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); const A = h(a), B = h(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * Math.max(0, Math.min(1, t))).toString(16).padStart(2, "0")).join(""); };
const verlauf = (stops, t) => { t = Math.max(0, Math.min(1, t)); for (let i = 1; i < stops.length; i++) if (t <= stops[i][0]) return mische(stops[i - 1][1], stops[i][1], (t - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0])); return stops[stops.length - 1][1]; };

/* =====================================================================
   LÖWE (Männchen)
   RECHERCHE (Britannica, San Diego Zoo, Univ. Free State): Kopf-Rumpf 1,8–2,1 m + Schwanz 0,9–1 m, Schulterhöhe ~1,2 m,
   170–230 kg. Rumpf (Bug bis Sitzbein) ≈ 1,35 × Schulterhöhe; Brustbein ≈ 0,45 × Schulterhöhe über dem Boden,
   Sprunggelenk ≈ 0,27 ×. Muskulös, breite Brust, großer Kopf (~0,42 × Schulterhöhe) mit langer, fast gerader Nasenlinie,
   kräftigem Kinn, kleinen runden Ohren (Rückseite schwarz gerandet); kurze, sehr kräftige Beine, große runde Pfoten,
   Krallen beim Gehen eingezogen. Mähne: umrahmt das Gesicht (Backenbart heller), bedeckt Scheitel, Hals und Schultern
   bis zur Mitte des Schulterblatts, geht über Kehle und Brust bis zwischen die Vorderbeine; nach hinten/unten dunkler
   (goldgelb → dunkelbraun/schwarz), in Büscheln. Ellbogenbüschel. Einzige Katze mit schwarzer Schwanzquaste (darin ein
   Hornsporn). Fell lohfarben, kurz; Unterseite heller; Kinn/Lippenrand weiß, Lefzen schwarz, Nasenspiegel rosa-braun;
   Augen bernstein, Pupille rund, heller Fleck unter dem Auge, dunkle Linie vom inneren Augenwinkel; 4–5 Reihen Tasthaar-Punkte.
   ===================================================================== */
function loewe(T) {
  const hs = 118;
  const A = {
    hs, pl: 13, ph: 8.8, randH: -60, randV: -56, randHx: 6,
    fell: [[0, "#a06c32"], [0.2, "#b98642"], [0.45, "#c39250"], [0.62, "#cfa66c"], [0.8, "#c8a87c"], [1, "#a88c66"]],
    haarL: 2.2, haarBreite: 0.24, haarBein: 80, haarSchwanz: 28,
    haarFarben: [["#8a6232", 1, 0.22, 0.32], ["#f0d4a0", 1, 0.22, 0.34]],
    koerper: [[6, -100], [14, -106], [26, -110], [42, -108], [60, -104], [80, -103], [98, -106], [110, -112], [120, -118], [135, -120],
      [150, -117], [163, -108], [168, -92], [166, -76], [158, -60], [146, -52], [128, -50], [108, -52], [88, -55], [72, -58], [60, -60],
      [50, -63], [42, -70], [20, -76], [4, -78], [-2, -86], [0, -95]],
    ruecken: [[2, -96], [14, -105], [26, -109], [42, -107], [60, -103], [80, -102], [98, -105], [110, -111], [120, -116]],
    bauch: [[56, -61], [72, -59], [88, -56], [108, -53], [128, -51]],
    hn: { V: [[40, -96], [45, -84], [47, -72], [46, -62], [40, -56], [32, -50], [25, -44], [21, -38], [19, -31], [18, -24], [19, -16], [20, -11]],
      H: [[0, -94], [-3, -84], [-3, -74], [-1, -64], [2, -56], [3, -48], [2, -41], [0, -36], [3, -31], [7, -26], [9, -18], [11, -11]], x: 15.5 },
    hf: { V: [[60, -80], [66, -68], [65, -60], [58, -54], [50, -48], [44, -42], [41, -36], [39, -30], [39, -22], [40, -16], [41, -11]],
      H: [[26, -80], [26, -68], [27, -58], [29, -48], [27, -41], [25, -36], [28, -31], [31, -25], [32, -17], [33, -11]], x: 37 },
    vn: { V: [[162, -92], [160, -78], [158, -64], [153, -52], [150, -42], [148, -30], [146, -22], [145.5, -15], [146, -11]],
      H: [[124, -86], [123, -68], [121, -57], [124, -48], [128, -38], [131, -28], [132, -22], [131, -18], [134, -14], [136, -11]], x: 141 },
    vf: { V: [[170, -80], [170, -64], [167, -52], [168, -40], [171, -30], [173, -22], [174, -15], [175, -11]],
      H: [[140, -70], [138, -58], [142, -48], [148, -38], [154, -29], [158, -22], [158, -18], [162, -14], [164, -11]], x: 169.5 },
    schwanz: [[8, -98, 3.8, 3.8], [-4, -96, 3.6, 3.6], [-15, -87, 3.3, 3.3], [-22, -72, 3, 3], [-25, -56, 2.8, 2.8], [-24, -44, 2.6, 2.6], [-21, -36, 2.5, 2.5]],
    weichSd: 4.6,
    formen: [
      /* Oberschenkel-Rundung, Lende/Rücken im Licht, Rippen, Unterschenkel, Unterarm-Vorderkante */
      [[[4, -100], [22, -106], [38, -98], [38, -84], [24, -78], [8, -84]], "#fff2d6", 0.5],
      [[[30, -108], [60, -104], [100, -105], [100, -98], [60, -97], [30, -100]], "#fff2d6", 0.38],
      [84, -88, 22, 8, 0, "#fff2d6", 0.28], [[[10, -58], [20, -56], [19, -46], [9, -47]], "#fff2d6", 0.3], [1, -36, 3, 3, 0, "#fff2d6", 0.4],
      [[[150, -50], [153, -46], [149, -24], [146, -26]], "#fff2d6", 0.25],
      /* Flankengrube, Kernschatten am Bauch, unter dem Knie, hinter dem Ellbogen, Rückenlinie etwas dunkler */
      [[[47, -92], [58, -86], [57, -70], [46, -72]], "#5a2c0c", 0.38],
      [[[56, -66], [90, -60], [128, -56], [128, -50], [90, -54], [56, -60]], "#2a1406", 0.36],
      [30, -64, 8, 5, 0, "#2a1406", 0.2], [121, -60, 4, 6, 0, "#2a1406", 0.3], [70, -106, 46, 2.5, 0, "#6a4218", 0.3],
    ],
    formenFein: [
      [[[44, -94], [48, -80], [47, -66], [45, -66], [45, -80], [42, -92]], "#2a1406", 0.42],
      [[[1, -86], [4, -76], [6, -66], [4, -66], [2, -76], [-1, -84]], "#4a2408", 0.16],
      [[[100, -94], [96, -80], [99, -64], [97, -64], [94, -80], [98, -94]], "#2a1406", 0.12],
    ],
    sehnen: [
      [[[5, -54], [4, -45], [3, -38]], 1.2, 0.25, "#fff4dc"], [[[12, -52], [9, -44], [7, -37]], 1.4, 0.28],
      [[[146, -21], [133, -20]], 0.8, 0.25],
    ],
    haarFelder(T, { vn, hn }) {
      const kw = (x, y) => { const t = Math.max(0, Math.min(1, (y + 110) / 55)); return x < 40 ? 128 + t * 6 : x > 112 ? 135 - t * 35 : 178 - t * 58; };
      const L = this.haarL;
      return [
        [this.koerper, 300, kw, L * 0.9, [["#8e6534", 1, 0.2, 0.22], ["#b48650", 1, 0.2, 0.22], ["#f6dcaa", 1, 0.2, 0.26]]],
        [vn.pts, 55, 94, L * 0.9, this.haarFarben],
        [hn.pts, 55, (x, y) => (y < -60 ? 125 : 96), L * 0.9, this.haarFarben],
      ];
    },
    fransen: [
      [[[60, -61], [100, -54], [130, -52], [130, -49], [100, -51], [60, -58]], 40, 100, 3.5, [["#8a6234", 1, 0.26, 0.45], ["#dcbc88", 1, 0.24, 0.4]], { szene: 0.3 }],
      [[[119, -60], [125, -56], [126, -50], [121, -52]], 22, 112, 6, [["#2e1a0c", 1, 0.45, 0.6], ["#6a4422", 0.6, 0.4, 0.5]], { szene: 0.4 }],
    ],
  };
  /* Schwanzquaste: dunkler Pinsel aus Strähnen, der Sporn steckt darin */
  A.schwanzEnde = (T) => {
    const feld = [[-26, -42], [-16, -42], [-13, -30], [-16, -18], [-21, -14], [-26, -20], [-28, -30]];
    return `<path d="${G(feld)}" fill="#24120a"/>` +
      bueschel(T, feld, 13, (x) => norm((x + 22) / 14, 1), 8, 15, ["#0e0703", "#1e0f06", "#33190a", "#4e2a12", "#6e4220"],
        (x) => 0.3 + (x < -22 ? 0.2 : 0), { pro: 6, breite: 3, w: 0.42, op: 0.85, szene: 0.3 });
  };
  /* ---------- Kopf: 100 Einheiten = 56 cm ---------- */
  const K = A.kopf = {
    x: 154, y: -103, k: 56, w: 9,
    fell: [[0, "#b07f45"], [0.4, "#c99c62"], [0.75, "#d9bd92"], [1, "#e8d6b6"]],
    umriss: [[38, -37], [46, -40], [58, -41], [68, -39], [78, -34], [88, -28], [97, -22], [102, -17], [104.5, -10], [103, -3], [101.5, 4], [99.5, 12],
      [95, 16], [90, 18], [89, 22], [85, 27], [74, 30], [58, 31], [44, 27], [36, 18], [32, 0], [32, -20]],
    profil: [[56, -41], [58, -41], [68, -39], [78, -34], [88, -28], [97, -22], [102, -17], [104.5, -10], [103, -3], [101.5, 4], [99.5, 12], [95, 16], [90, 18], [89, 22], [85, 27], [74, 30], [66, 31]],
    ohr: [[44, -37], [43, -47], [47, -55], [53, -56], [57, -48], [58, -40]], ohrFarbe: "#3a2414", ohrVorn: true,
    formen: [
      [70, -36, 10, 3.5, -8, "#fff4dc", 0.5], [90, -26, 12, 2.5, 20, "#fff4dc", 0.45], [62, -12, 11, 5, -10, "#fff4dc", 0.3],
      [77, -23, 5, 3.5, 0, "#2a1506", 0.3], [82, 18, 13, 3, 0, "#2a1506", 0.35], [62, 27, 22, 4, 0, "#2a1506", 0.32], [92, 3, 6, 6, 0, "#fff8ec", 0.45],
      [46, -12, 8, 14, 0, "#7a4a1c", 0.3],
    ],
  };
  K.ohrInnen = `<path d="M50 -40q1 -9 4 -14q3 3 3 13z" fill="#a87a48"/>` + haare(T, [[50, -40], [54, -54], [57, -42]], 14, 285, 5, [["#f2e2c4", 1, 0.45, 0.8]], { streu: 30 }) +
    `<path d="M44 -42q0 -10 5 -13q4 -1 7 2" fill="none" stroke="#0e0804" stroke-width="2.2" stroke-linecap="round"/>`;
  K.zeichnung = weich(T, "kz", [
    [[[42, -38], [60, -40], [70, -38], [62, -35], [46, -34]], "#a06c36", 0.35],
    [[[80, -32], [90, -27], [99, -21], [98, -14], [86, -19], [78, -26]], "#93602e", 0.5],
    [[[72, -14], [86, -12], [96, -8], [99, 2], [82, 4], [70, 0]], "#e0c498", 0.5],
    [[[74, 2], [84, -4], [98, -4], [101.5, 5], [99.5, 13], [90, 16], [78, 14]], "#f2e7d0", 0.88],
    [[[76, 21], [86, 19], [89, 23], [84, 28], [72, 29]], "#faf6ee", 1],
    [[[66, -22], [74, -19.5], [83, -23], [80, -15], [68, -15]], "#f8eedc", 0.8],
    [[[64, -35], [74, -34], [81, -31], [74, -30], [64, -31]], "#f2e2c2", 0.45],
    [[[44, -14], [60, -6], [68, 8], [54, 20], [40, 14]], "#a06c36", 0.3]], 1.1);
  K.haare = (T) => haare(T, [[40, -38], [52, -40], [50, -20], [46, 0], [52, 20], [44, 28], [34, 18], [30, 0], [32, -22]], 70, (x, y) => 160 + y * 0.8, 5,
    [["#a06c36", 1, 0.45, 0.5], ["#f2d49a", 1, 0.42, 0.5]], { szene: 0.2, krumm: 0.3 }) + haare(T, K.umriss, 130, (x, y) => (x > 80 && y < -5 ? 196 : y > 10 ? 165 : x < 58 ? 160 : 186), 2.4,
    [["#8a5e2e", 1, 0.3, 0.3], ["#fbeccc", 0.9, 0.28, 0.34]], { szene: 0.15 });
  K.detailsSzene = `<path d="${G([[95, -20], [101, -16.5], [104.5, -10], [104, -5], [101.5, -2.5], [97, -4], [94, -11]], true, 10)}" fill="#8c5a50"/>` +
    `<path d="M101.5 5Q100.5 12 96 14.5Q88 16 74 17.6" fill="none" stroke="#120b07" stroke-width="1.7" stroke-linecap="round"/>` +
    `<ellipse cx="74" cy="-27" rx="3.6" ry="2.4" fill="#120804"/><circle cx="74.6" cy="-27" r="1.8" fill="#b8862e"/>`;
  K.details =
    nase(T, [[95, -20], [101, -16.5], [104.5, -10], [104, -5], [101.5, -2.5], [97, -4], [94, -11]], "M101.5 -4.5q-4 -.5 -3.5 -5", "#8c5a50", "M99 -17q3 1 4.5 4.5") +
    `<path d="M94 -11q3 1 5 -1M95 -19.5q6 1 9.5 8" fill="none" stroke="#2a1210" stroke-opacity=".5" stroke-width=".8"/>` +
    `<path d="M101.5 -1Q102 2 101.5 5" fill="none" stroke="#1d120c" stroke-width="1" stroke-linecap="round"/>` +
    `<path d="M101.5 5Q100.5 12 96 14.5Q88 16 74 17.6" fill="none" stroke="#120b07" stroke-width="1.7" stroke-linecap="round"/>` +
    `<path d="M74 17.6Q69 18 66 20" fill="none" stroke="#120b07" stroke-opacity=".45" stroke-width="1" stroke-linecap="round"/>` +
    `<path d="M89 21.5Q81 24.5 74 24" fill="none" stroke="#5b4630" stroke-opacity=".3" stroke-width=".8"/>` +
    punkte([[82, 0], [86, .5], [90, 1], [94, 1.4], [80, 4], [84, 4.5], [88, 5], [92, 5.4], [96, 5.6], [82, 8], [86, 8.6], [90, 9], [94, 9.4], [85, 11.6], [89, 12]]) +
    T.augeReal(74, -27, 3.1, { iris: "#c99434", iris2: "#6a3e12", offen: 0.76, winkel: 4, lid: "#0e0805", haut: "#efe0c2" }) +
    `<path d="M79 -24Q83 -17 86 -9" fill="none" stroke="#2a1a10" stroke-opacity=".4" stroke-width="1.1" stroke-linecap="round"/>` +
    `<path d="M67 -32Q74 -34.5 81 -31" fill="none" stroke="#2a1a10" stroke-opacity=".3" stroke-width=".8"/>` +
    T.schnurrhaare(88, 3, 7, 30, 6, 46, "#fbf6ec", 0.3) + T.schnurrhaare(84, 8, 5, 26, 34, 40, "#fbf6ec", 0.28) +
    T.schnurrhaare(75, -33, 3, 12, -60, 30, "#f6efe2", 0.25);
  /* ---------- Mähne: Untermalung (weiche Locken) + Strähnenbüschel, vom Gesicht weg nach hinten/unten fallend ---------- */
  const g = { x: K.x, y: K.y, k: K.k / 100, w: K.w * RAD };
  const C = tr([62, -10], g);
  const fl = (x, y) => norm((x - C[0]) / 30 - 0.5, (y - C[1]) / 30 + 1.0);
  const gesicht = [[66, 35], [62, 34], [50, 30], [40, 18], [36, 0], [38, -20], [44, -36], [52, -46]].map((p) => tr(p, g));
  const aussen = [tr([58, -48], g), [172, -128], [156, -133], [138, -131], [122, -125], [110, -115], [104, -100], [104, -86], [109, -72], [117, -60], [128, -52],
    [145, -47], [160, -48], [170, -55], [175, -66], tr([62, 42], g)];
  const feld = aussen.concat(gesicht);
  const ton = (x, y) => {
    const d = Math.hypot(x - C[0], y - C[1]);
    return Math.max(0, Math.min(1, 1 - (d - 18) / 55 - (y > -72 ? 0.22 : 0) + (y < -112 ? 0.15 : 0) - (x < 116 ? 0.12 : 0)));
  };
  const rampe = ["#140904", "#24120a", "#3a1f0e", "#563216", "#76471f", "#96602c", "#b67d3e", "#d39c56", "#ecc07c"];
  const rf = (x, y, z) => rampe[Math.min(8, Math.max(0, Math.floor((ton(x, y) + (z - 0.5) * 0.25) * 9)))];
  A.hinterKopf = (T, box) => {
    box(aussen);
    const id = T.id("mf"), pid = T.id("mp");
    T.def(`<path id="${pid}" d="${G(feld)}"/><clipPath id="${id}"><use href="#${pid}"/></clipPath>`);
    const unter = [tr([38, -50], g), tr([32, -20], g), tr([34, 14], g), tr([48, 40], g)].map(([x, y]) => [x, y, 13, 11, 0, "#b27a3c", 0.9])
      .concat([[150, -118, 22, 9, -10, "#8a5a2a", 0.8], [140, -66, 20, 14, 0, "#120802", 0.9], [112, -92, 8, 18, 0, "#1e0e06", 0.7], [168, -56, 10, 8, 0, "#1a0c04", 0.8]]);
    return `<use href="#${pid}" fill="#4a2a12"/><g clip-path="url(#${id})">${weich(T, "mu", unter, 6)}</g>` +
      weich(T, "ml", [lockenFeld(T, feld, 108, fl, 13, 24, 7.4, rf, (x, y) => Math.hypot(x - C[0], y - C[1]), { szene: 0.22, kante: 0 })], 0.45) +
      bueschel(T, feld, 72, fl, 12, 22, rampe, ton, { pro: 6, breite: 4.5, w: 0.5, op: 0.8, szene: 0.1 });
  };
  A.vorKopf = (T) => {
    /* Backenbart: helle, kürzere Büschel über dem hinteren Kopfrand; Bart unter dem Kinn */
    const band = [[46, -52], [36, -36], [30, -14], [30, 8], [38, 26], [52, 36], [64, 38], [70, 33], [58, 29], [48, 21], [42, 4], [42, -14], [48, -30], [54, -44]].map((p) => tr(p, g));
    const fk = (x, y) => norm((x - C[0]) / 18 - 0.4, (y - C[1]) / 18 + 0.8);
    const hr = ["#5a3416", "#7e4e22", "#a06a32", "#c08848", "#d8a660", "#ecc382", "#f8deaa"];
    const ht = (x, y) => Math.max(0, Math.min(1, 0.55 + (-y - 100) / 40));
    return weich(T, "rb", [`<path d="${G(band)}" fill="#b47c3e"/>`, lockenFeld(T, band, 40, fk, 7, 13, 4.8, (x, y, z) => hr[Math.min(6, Math.floor((ht(x, y) + (z - 0.5) * 0.3) * 7))],
      (x, y) => Math.hypot(x - C[0], y - C[1]), { szene: 0.22, kante: 0 })], 0.5) +
      (T.fein ? bueschel(T, band, 36, fk, 7, 13, hr, ht, { pro: 6, breite: 3, w: 0.42, op: 0.85 }) : "");
  };
  return katze(T, A);
}

/* =====================================================================
   TIGER (Bengal-Tiger, Männchen)
   RECHERCHE (Wikipedia „Bengal tiger“, San Diego Zoo, A-Z Animals): Schulterhöhe 90–110 cm, Kopf-Rumpf 183–211 cm,
   Schwanz 85–110 cm, Gesamtlänge 2,8–3,1 m. Lang gestreckter, muskulöser Körper, große Pranken, kräftiger Nacken,
   runder breiter Kopf mit Backenkrause (weiß mit schwarzen Streifen, beim Männchen deutlich). Fell rötlich-ocker bis
   orange, Unterseite, Innenseite der Beine, Backen, Kinn, Lippenrand und Flecken über den Augen weiß. Schwarze
   Streifen senkrecht, oft doppelt oder gegabelt, am Hinterteil und Oberschenkel kräftiger und bogenförmig; an den
   Beinen nur kurze Querbänder. Ohren rund, Rückseite schwarz mit großem weißem Fleck (Augenfleck). Schwanz gelb-orange
   mit ~10 schwarzen Ringen und schwarzer Spitze. Augen gelb-bernstein, runde Pupille. Nasenspiegel rosa.
   ===================================================================== */
function tiger(T) {
  const hs = 100;
  const A = {
    hs, pl: 13, ph: 8.4, randH: -54, randV: -48, randHx: 6,
    fell: [[0, "#a84a14"], [0.18, "#c25e1c"], [0.36, "#d47a30"], [0.5, "#e08f44"], [0.55, "#e9b47a"], [0.6, "#f2e8d8"], [1, "#e4dccd"]],
    beinFell: [[0, "#a84a14"], [0.18, "#c25e1c"], [0.36, "#d47a30"], [0.5, "#de8c42"], [0.7, "#e2a060"], [0.88, "#e9be8a"], [1, "#efd6b4"]],
    beinHinten: "#f6efe4", schwanzBein: true,
    haarL: 2, haarBreite: 0.22, haarBein: 80, haarSchwanz: 30,
    haarFarben: [["#7a3a10", 1, 0.2, 0.3], ["#ffe2b8", 1, 0.2, 0.32]],
    koerper: [[6, -86], [14, -92], [26, -95], [44, -93], [64, -89], [86, -88], [104, -92], [116, -98], [126, -100], [136, -98], [144, -93], [150, -84],
      [153, -70], [150, -58], [144, -50], [132, -44], [116, -42], [96, -44], [78, -46], [62, -49], [52, -52], [44, -57], [36, -63], [18, -67], [4, -69],
      [-2, -76], [0, -84]],
    ruecken: [[2, -82], [14, -91], [26, -94], [44, -92], [64, -88], [86, -87], [104, -91], [116, -97], [126, -99], [140, -98]],
    bauch: [[52, -53], [62, -50], [78, -47], [96, -45], [116, -43]],
    hn: { V: [[36, -84], [41, -74], [43, -63], [42, -55], [36, -51], [28, -47], [22, -42], [18, -37], [16, -31], [15.5, -22], [16, -12.5]],
      H: [[0, -82], [-3, -73], [-3, -64], [-1, -56], [1, -49], [2, -42], [1, -36], [0, -32], [3, -28], [5.5, -22], [7.5, -12.5]] },
    hf: { V: [[56, -70], [61, -60], [60, -53], [54, -49], [47, -45], [41, -40], [38, -34], [36, -27], [36, -20], [37, -12.5]],
      H: [[24, -70], [24, -60], [25, -51], [27, -43], [26, -36], [24, -31], [27, -27], [29, -21], [29.5, -12.5]] },
    vn: { V: [[138, -80], [138, -66], [136, -54], [133, -44], [131, -34], [129, -25], [127.5, -18], [127.5, -12.5]],
      H: [[112, -74], [111, -60], [110, -50], [113, -42], [116, -33], [118, -25], [118.5, -20], [118, -16.5], [120, -12.5]] },
    vf: { V: [[148, -70], [148, -58], [146, -47], [146, -37], [148, -28], [150, -20], [151, -12.5]],
      H: [[124, -62], [123, -52], [127, -43], [131, -34], [135, -26], [138, -20], [138, -17], [141.5, -12.5]] },
    schwanz: [[8, -84, 4.4, 4.4], [-5, -81, 4.2, 4.2], [-15, -70, 4, 4], [-21, -54, 3.8, 3.8], [-23, -38, 3.6, 3.6], [-21, -24, 3.4, 3.4], [-15, -15, 3.2, 3.2], [-8, -12, 3, 3]],
    weichSd: 4,
    formen: [
      /* Schulterblatt, Trizeps, Oberarm; Rippen; Oberschenkel; Lenden-Licht */
      [[[118, -98], [132, -96], [138, -84], [126, -74], [116, -84]], "#fff0d8", 0.36], [108, -72, 4, 16, 12, "#2a1004", 0.32],
      [[[128, -100], [142, -96], [146, -90], [134, -92]], "#fff0d8", 0.3], [[[146, -82], [150, -70], [149, -58], [144, -62], [143, -74]], "#2a1004", 0.3],
      [148, -52, 6, 6, 0, "#2a1004", 0.3],
      [[[24, -90], [40, -92], [44, -80], [32, -70], [14, -76]], "#fff0d8", 0.42], [[[30, -94], [70, -90], [104, -92], [104, -86], [70, -84], [30, -86]], "#fff0d8", 0.32],
      [80, -76, 20, 7, 0, "#fff0d8", 0.2], [[[42, -84], [52, -78], [51, -64], [42, -64]], "#3a1404", 0.3],
      [[[52, -58], [80, -54], [116, -50], [116, -44], [80, -48], [52, -52]], "#2a1004", 0.3], [109, -52, 3, 5, 0, "#2a1004", 0.3],
      [0, -32, 2.5, 2.5, 0, "#fff0d8", 0.4],
    ],
    formenFein: [
      [[[40, -82], [43, -70], [42, -58], [40.5, -58], [41, -70], [38, -80]], "#2a1004", 0.35],
      [[[1, -74], [3, -64], [5, -56], [3.5, -56], [1.5, -64], [-1, -72]], "#2a1004", 0.18],
    ],
    sehnen: [
      [[[4, -48], [3, -40], [2, -33]], 1, 0.25, "#fff4dc"], [[[10, -46], [8, -39], [6, -33]], 1.2, 0.28],
    ],
    haarFelder(T, { vn, hn }) {
      const kw = (x, y) => { const t = Math.max(0, Math.min(1, (y + 95) / 48)); return x < 36 ? 128 + t * 6 : x > 108 ? 132 - t * 35 : 176 - t * 60; };
      const L = this.haarL;
      return [
        [this.koerper, 300, kw, L, [["#7a3a10", 1, 0.2, 0.26], ["#c86a26", 1, 0.2, 0.26], ["#ffe6c4", 1, 0.18, 0.3]]],
        [vn.pts, 55, 94, L * 0.9, this.haarFarben], [hn.pts, 55, (x, y) => (y < -54 ? 125 : 96), L * 0.9, this.haarFarben],
      ];
    },
    fransen: [
      [[[50, -54], [90, -46], [120, -44], [120, -41], [90, -43], [50, -50]], 46, 98, 3.6, [["#f6efe2", 1, 0.26, 0.6], ["#d8cbb4", 0.5, 0.24, 0.5]], { szene: 0.3 }],
    ],
  };
  /* ---------- Streifen ---------- */
  const st = [];
  /* Flanke und Schulter: vom Rückgrat herab bis zum Bauch, wellig, teils doppelt, gegabelt oder unterbrochen */
  for (let x = 124, i = 0; x > 42; i++) {
    const vorn = x > 100, mitte = 1 - Math.abs(x - 78) / 40;
    const L = vorn ? 22 + T.rnd() * 18 : 34 + mitte * 16 + T.rnd() * 10, a = (T.rnd() - 0.5) * 14, w = vorn ? 1.5 + T.rnd() * 0.9 : 2.2 + T.rnd() * 1.6;
    const b = (T.rnd() - 0.5) * 10, art = T.rnd();
    if (art < 0.25) { st.push(band(T, streifenLinie(T, x, -104, L, a, b), w * 0.75, true)); st.push(band(T, streifenLinie(T, x - w * 1.4, -102, L * (0.7 + T.rnd() * 0.3), a + 3, b), w * 0.65, true)); }
    else if (art < 0.42) { const m = streifenLinie(T, x, -104, L, a, b); st.push(band(T, m.slice(0, 4), w, true)); st.push(band(T, streifenLinie(T, m[4][0] + 1, m[4][1] - 1, L * 0.3, a, 0, 4), w * 0.8)); }
    else st.push(band(T, streifenLinie(T, x, -104, L, a, b), w, true));
    if (art > 0.6 && !vorn) { const m = streifenLinie(T, x, -104, L, a, b)[3]; st.push(band(T, streifenLinie(T, m[0], m[1] - 3, L * 0.4, a + 24, 0, 4), w * 0.7)); }
    if (T.rnd() < 0.35) st.push(band(T, streifenLinie(T, x - 3.5, -66 + T.rnd() * 6, 8 + T.rnd() * 6, a, 0, 4), 1.6));
    x -= vorn ? 7 + T.rnd() * 2 : 5.8 + T.rnd() * 2.6;
  }
  /* Hals: senkrecht, kürzer */
  for (const x of [134, 141, 148]) st.push(band(T, streifenLinie(T, x, -104, 18 + T.rnd() * 8, -10, 2), 1.8, true));
  /* Oberschenkel: Bögen um das Knie */
  for (const [R, a0, a1, w] of [[14, 250, 205, 2], [20, 262, 196, 2.6], [26, 268, 192, 3], [32, 272, 190, 3.2], [38, 276, 196, 3], [44, 278, 214, 2.6]]) {
    const brich = T.rnd() < 0.4, m = (a0 + a1) / 2 + (T.rnd() - 0.5) * 10;
    if (brich) { st.push(band(T, bogen(36, -58, R, a0, m + 3, 5), w)); st.push(band(T, bogen(36, -58, R + 1.5, m - 3, a1, 5), w * 0.85)); }
    else st.push(band(T, bogen(36, -58, R, a0, a1), w));
  }
  /* Kruppe, Schwanzansatz */
  for (const x of [4, 12, 20]) st.push(band(T, streifenLinie(T, x, -98, 12, 30, -3, 4), 2.2, true));
  /* Beine: kurze Querbänder; Bauch: kurze Streifen von unten */
  const quer = (x0, y, L, w, k = 0) => band(T, [[x0, y], [x0 + L * 0.5, y + k], [x0 + L, y + 2 * k]], w);
  for (const [x, y, L] of [[110, -40, 10], [113, -32, 9], [116, -25, 7], [126, -46, 8]]) st.push(quer(x, y, L, 1.6, -0.5));
  for (const [x, y, L] of [[24, -44, 12], [20, -38, 9], [6, -50, 10], [14, -22, 5]]) st.push(quer(x, y, L, 1.6, 0.8));
  for (const x of [70, 82, 94, 106]) st.push(band(T, streifenLinie(T, x, -40, 9 + T.rnd() * 4, 180 + (T.rnd() - 0.5) * 20, 0, 4), 1.8));
  A.muster = (T) => weich(T, "st", [`<path d="${st.join("")}" fill="#120c0a"/>`], 0.35);
  A.musterFern = (T, b, n) => {
    const q = [];
    if (n === "vf") for (const [x, y, L] of [[128, -40, 9], [133, -32, 9], [139, -24, 6]]) q.push(quer(x, y, L, 1.5, -0.5));
    else for (const [x, y, L] of [[44, -42, 10], [40, -36, 8], [28, -48, 8]]) q.push(quer(x, y, L, 1.5, 0.8));
    return `<path d="${q.join("")}" fill="#120c0a" fill-opacity=".8"/>`;
  };
  A.schwanzMuster = (T, A) => {
    /* 10 Ringe quer zur Schwanzachse, nach hinten breiter; Spitze schwarz */
    const P = schwanzPunkt(A.schwanz);
    let d = "";
    for (let k = 0; k < 10; k++) {
      const [x, y, tx, ty] = P(0.22 + k * 0.074), w = 1.4 + k * 0.12;
      d += `M${f1(x - ty * 6 - tx * w)} ${f1(y + tx * 6 - ty * w)}l${f1(ty * 12)} ${f1(-tx * 12)}`;
    }
    const [ex, ey] = P(1);
    return `<path d="${kurz(d)}" stroke="#120c0a" stroke-width="2.4" fill="none"/><circle cx="${f1(ex)}" cy="${f1(ey)}" r="7.5" fill="#120c0a"/>`;
  };
  /* ---------- Kopf: 100 Einheiten = 46 cm ---------- */
  const K = A.kopf = {
    x: 141, y: -80, k: 50, w: 12,
    fell: [[0, "#b8561a"], [0.35, "#d27430"], [0.6, "#e49a56"], [0.8, "#f2e6d4"], [1, "#f6f0e6"]],
    umriss: [[18, -30], [30, -38], [44, -41], [58, -40], [68, -37], [78, -32], [88, -26], [96, -21], [101, -16], [103.5, -9], [102, -3], [100.5, 4], [98, 11],
      [93, 15], [88, 17], [87.5, 21], [83, 26], [72, 29], [56, 30], [40, 28], [26, 22], [16, 10], [12, -8]],
    profil: [[44, -41], [58, -40], [68, -37], [78, -32], [88, -26], [96, -21], [101, -16], [103.5, -9], [102, -3], [100.5, 4], [98, 11], [93, 15], [88, 17], [87.5, 21], [83, 26], [72, 29], [62, 30]],
    ohr: [[24, -33], [23, -43], [27, -50], [33, -51], [37, -45], [38, -36]], ohrFarbe: "#15100c", ohrVorn: true,
    formen: [
      [56, -38, 12, 4, -6, "#fff4dc", 0.45], [86, -24, 12, 2.5, 22, "#fff4dc", 0.45], [56, -10, 12, 6, -10, "#fff4dc", 0.3],
      [72, -21, 5, 3.5, 0, "#2a1004", 0.3], [80, 18, 12, 3, 0, "#2a1004", 0.3], [56, 27, 22, 4, 0, "#2a1004", 0.3], [92, 3, 6, 6, 0, "#fff", 0.4],
    ],
  };
  K.ohrInnen = `<ellipse cx="30" cy="-43" rx="2.4" ry="3.3" transform="rotate(-15 30 -43)" fill="#f4efe6"/>` +
    haare(T, [[34, -37], [36, -47], [38, -37]], 10, 290, 4, [["#f8f2e8", 1, 0.4, 0.7]], { streu: 30 });
  const wst = (mp, w) => band(T, mp, w);
  K.zeichnung = weich(T, "kz", [
    [[[61, -36], [71, -37], [81, -32], [75, -29.5], [64, -31]], "#f8f4ec", 0.95],
    [[[54, -17], [66, -18], [76, -20], [79, -11], [72, -3], [58, 1], [44, 6], [36, 0], [42, -10]], "#f6f0e6", 0.92],
    [[[72, 0], [84, -6], [97, -4], [100, 5], [97, 13], [88, 16], [74, 13]], "#f8f4ec", 0.95],
    [[[64, 19], [86, 19], [88, 23], [82, 28], [58, 30], [40, 29]], "#f8f4ec", 1],
    [[[78, -30], [92, -24], [99, -18], [96, -12], [84, -16], [76, -24]], "#b8561a", 0.35]], 1);
  K.muster = `<path d="${[
    wst([[44, -45], [45.5, -40], [47, -36]], 1.5), wst([[51, -45], [52, -41.5], [53.5, -38]], 1.2), wst([[38, -43], [37.5, -37], [39, -31]], 1.8),
    wst([[69, -26], [60, -25], [51, -21], [42, -15], [34, -10]], 2),
    wst([[63, -12], [56, -9], [48, -4], [40, 3], [31, 8]], 2.8), wst([[60, 3], [53, 8], [45, 13], [36, 19]], 2.5), wst([[52, -15], [46, -13], [41, -10]], 1.4),
    wst([[30, -28], [25, -20], [20, -11]], 2.2), wst([[26, -2], [20, 4], [14, 9]], 2),
  ].join("")}" fill="#120c0a" opacity=".93"/>`;
  K.haare = (T) => haare(T, K.umriss, 130, (x, y) => (x > 80 && y < -5 ? 196 : y > 10 ? 165 : x < 50 ? 160 : 186), 2.2,
    [["#7a3a10", 1, 0.3, 0.3], ["#fff4e2", 0.9, 0.28, 0.36]], { szene: 0.15 });
  K.detailsSzene = `<path d="${G([[94, -18], [99.5, -15], [103, -9], [102.5, -4], [100, -2], [95.5, -3.5], [93, -10]], true, 10)}" fill="#c87a70"/>` +
    `<path d="M100.5 4Q99.5 11 95 13.5Q88 15 74 16.5" fill="none" stroke="#120b07" stroke-width="1.6" stroke-linecap="round"/>` +
    `<ellipse cx="73" cy="-25.5" rx="3.4" ry="2.3" fill="#120804"/><circle cx="73.6" cy="-25.5" r="1.7" fill="#d8a43a"/>`;
  K.details =
    nase(T, [[94, -18], [99.5, -15], [103, -9], [102.5, -4], [100, -2], [95.5, -3.5], [93, -10]], "M100 -3.5q-3.6 -.5 -3.2 -4.6", "#d08a80", "M97.5 -15.5q3 1 4.2 4.2") +
    `<path d="M93 -10q3 1 5 -1" fill="none" stroke="#5a2a24" stroke-opacity=".6" stroke-width=".7"/>` +
    `<path d="M100.5 -.5Q101 2 100.5 4" fill="none" stroke="#1d120c" stroke-width="1" stroke-linecap="round"/>` +
    `<path d="M100.5 4Q99.5 11 95 13.5Q88 15 74 16.5" fill="none" stroke="#120b07" stroke-width="1.7" stroke-linecap="round"/>` +
    `<path d="M74 16.5Q69 17 66 19" fill="none" stroke="#120b07" stroke-opacity=".45" stroke-width="1" stroke-linecap="round"/>` +
    `<path d="M87 21Q79 24 70 23.5" fill="none" stroke="#5b4630" stroke-opacity=".3" stroke-width=".8"/>` +
    punkte([[82, -1], [86, -.5], [90, 0], [94, .4], [80, 3], [84, 3.5], [88, 4], [92, 4.4], [96, 4.6], [82, 7], [86, 7.6], [90, 8], [94, 8.4], [85, 10.6], [89, 11]], 1.1) +
    T.augeReal(73, -25.5, 3, { iris: "#d9a83c", iris2: "#7a4a12", offen: 0.78, winkel: 4, lid: "#0e0805", haut: "#f8f2e6" }) +
    `<path d="M77 -22.5Q81 -16 83 -9" fill="none" stroke="#2a1a10" stroke-opacity=".35" stroke-width="1" stroke-linecap="round"/>` +
    T.schnurrhaare(88, 2, 8, 32, 6, 50, "#fdfaf2", 0.3) + T.schnurrhaare(84, 7, 5, 26, 36, 40, "#fdfaf2", 0.28) +
    T.schnurrhaare(73, -32, 3, 12, -62, 30, "#f6efe2", 0.25);
  /* ---------- Backenkrause: weiß-cremefarbene Büschel nach hinten unten, mit schwarzen Streifen ---------- */
  const g = { x: K.x, y: K.y, k: K.k / 100, w: K.w * RAD };
  const C = tr([60, -6], g);
  A.vorKopf = (T) => {
    /* Backenkrause: weiß-cremefarbene längere Haare hinter Wange und Kiefer, nach hinten/unten, mit schwarzen Streifen */
    const band2 = [[24, -26], [13, -12], [7, 4], [10, 18], [20, 30], [36, 36], [54, 36], [56, 30], [40, 27], [30, 20], [25, 6], [25, -8], [29, -20]].map((p) => tr(p, g));
    const fk = (x, y) => norm((x - C[0]) / 16 - 0.3, (y - C[1]) / 16 + 1.1);
    const hr = ["#9a5a2a", "#d2a274", "#e8d4b8", "#f4eadc", "#fbf7f0"];
    const ht = (x, y) => Math.max(0, Math.min(0.99, 0.82 - (y < -97 ? 0.45 : 0)));
    const streif = [[[32, -20], [22, -12], [12, -6]], [[32, 4], [22, 10], [12, 14]], [[38, 20], [28, 27], [18, 30]]].map((m) => band(T, m.map((p) => tr(p, g)), 2.2)).join("");
    return weich(T, "rb", [`<path d="${G(band2)}" fill="#f2e8da"/>`], 0.8) +
      `<path d="${streif}" fill="#120c0a" opacity=".85"/>` +
      bueschel(T, band2, 30, fk, 4, 8, hr, ht, { pro: 6, breite: 2.6, w: 0.36, op: 0.9, szene: 0.15 });
  };
  return katze(T, A);
}
module.exports = [
  { id: "loewe", de: "der Löwe", syl: "LÖ-we", it: "il leone", itSyl: "le-O-ne", en: "lion", gruppe: "Raubtiere", lebensraum: "Savanne",
    laenge: 2.5, hoehe: 1.4, zeichne: loewe },
  { id: "tiger", de: "der Tiger", syl: "TI-ger", it: "la tigre", itSyl: "TI-gre", en: "tiger", gruppe: "Raubtiere", lebensraum: "Dschungel",
    laenge: 2.4, hoehe: 1.1, zeichne: tiger },
];
