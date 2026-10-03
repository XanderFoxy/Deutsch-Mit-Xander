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

/* Bein mit Pfote (Zehengänger): V = Vorderkante, H = Hinterkante (je von oben nach unten), x = Mitte der Fessel,
   pl/ph = Pfotenlänge/-höhe, krallen = sichtbare Krallen (Gepard). Liefert Umriss, Kanten, Zehenfurchen, Sohle. */
function bein(L, pl, ph, krallen = 0) {
  const { V, H, x } = L;
  const pf = [[x + pl * 0.18, -ph * 1.06], [x + pl * 0.34, -ph * 1.1], [x + pl * 0.5, -ph * 1.02], [x + pl * 0.62, -ph * 0.98], [x + pl * 0.74, -ph * 0.86],
    [x + pl * 0.84, -ph * 0.74], [x + pl * 0.94, -ph * 0.48], [x + pl * 0.98, -ph * 0.2], [x + pl * 0.9, -ph * 0.02], [x + pl * 0.5, 0, 1], [x - pl * 0.12, 0, 1],
    [x - pl * 0.26, -ph * 0.24], [x - pl * 0.28, -ph * 0.52]];
  const z = (t, h, l) => `M${f1(x + pl * t)} ${f1(-ph * h)}q${f1(pl * 0.05)} ${f1(ph * l * 0.5)} ${f1(pl * 0.03)} ${f1(ph * l)}`;
  let kr = "";
  if (krallen) for (const t of [0.66, 0.86, 1.0]) kr += `M${f1(x + pl * (t - 0.03))} ${f1(-ph * 0.3)}q${f1(pl * 0.08)} ${f1(ph * 0.05)} ${f1(pl * 0.07)} ${f1(ph * 0.3)}`;
  return { pts: V.concat(pf, H.slice().reverse()), V, H, x, zehen: kurz(z(0.56, 0.99, 0.5) + z(0.78, 0.8, 0.45) + z(0.4, 1.06, 0.3)), krallen: kurz(kr),
    sohle: [x - pl * 0.15, x + pl * 0.86] };
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
/* Haare: n Haare in Polygon pts, Wuchsrichtung w (Grad oder Funktion), Länge L; farben [[farbe, anteil, breite, deckkraft]]
   o: { streu (Grad), krumm, szene (Anteil bei T.fein = false) }. Relative Koordinaten → ~24 Byte je Haar. */
function haare(T, pts, n, w, L, farben, o = {}) {
  const [x0, y0, x1, y1] = T.box(pts);
  const sum = farben.reduce((s, f) => s + f[1], 0), eimer = farben.map(() => "");
  const ziel = Math.round(n * (T.fein ? 1 : (o.szene != null ? o.szene : 0.15)));
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
/* Fell-Textur (gestreckte Rauschstruktur) in einer Form */
function textur(T, n, d, winkel, op, box, farbe = "#2a1606", fx = 0.9, fy = 0.11) {
  if (!T.fein || !T.textur) return "";
  return T.textur(d, T.rauschen(n, { fx, fy, farbe, staerke: 2.8, schwelle: 0.52, okt: 3 }), winkel, op, box);
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
  const def = (n, d) => { const id = T.id(n); T.def(`<path id="${id}" d="${d}"/>`); return `href="#${id}"`; };
  const strich = (o, w, c = RF) => `fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const hb = A.haarBreite || 0.3;
  let s = "";
  /* ---------- ferne Beine: dunkler (Tiefe), eigene Haare ---------- */
  const vf = bein(A.vf, A.pl, A.ph, A.krallen), hf = bein(A.hf, A.pl * 0.9, A.ph * 0.95, A.krallen);
  for (const [n, b] of [["vf", vf], ["hf", hf]]) {
    const h = def(n, G(box(b.pts)));
    const c = T.id(n + "c");
    T.def(`<clipPath id="${c}"><use ${h}/></clipPath>`);
    s += `<use ${h} fill="${fell}"/><g clip-path="url(#${c})">${A.musterFern ? A.musterFern(T, b, n) : ""}` +
      haare(T, b.pts, A.haarBein * 0.45, 95, A.haarL * 0.8, A.haarFarben.slice(0, 2)) +
      `<use ${h} fill="#1a0e06" fill-opacity="${A.fernDunkel || 0.36}"/>` +
      weich(T, n, [], 1.5, `<path d="${G(b.H, false)}" ${strich(0.3, A.pl * 0.25, "#120802")}/>`) + `</g>` +
      `<use ${h} ${strich(0.35, 0.6)}/><path d="${b.zehen}" ${strich(0.5, 0.6)}/>` + (b.krallen ? `<path d="${b.krallen}" ${strich(0.95, 0.9, "#2a2420")}/>` : "");
  }
  /* ---------- Schwanz ---------- */
  const sw = rohr(A.schwanz), swPts = box(sw.V.concat(sw.H.slice().reverse()));
  const sh = def("sw", G(swPts));
  T.def(`<clipPath id="${T.id("swc")}"><use ${sh}/></clipPath>`);
  s += `<use ${sh} fill="${fell}"/><g clip-path="url(#${T.id("swc")})">` + (A.schwanzMuster ? A.schwanzMuster(T, A, sw) : "") +
    haare(T, swPts, A.haarSchwanz || 60, A.schwanzWinkel || 100, A.haarL, A.haarFarben) +
    weich(T, "sw", [], 1.2, `<path d="${G(sw.H, false)}" ${strich(0.35, A.schwanz[0][2] * 0.9, "#1a0e06")}/><path d="${G(sw.V, false)}" ${strich(0.2, A.schwanz[0][2] * 0.6, "#fff")}/>`) +
    `</g><use ${sh} ${strich(0.3, 0.5)}/>`;
  if (A.schwanzEnde) s += A.schwanzEnde(T, A, sw);
  /* ---------- Rumpf + nahe Beine (eine Fellfläche) ---------- */
  const kd = G(box(A.koerper)), kh = def("k", kd);
  const hn = bein(A.hn, A.pl * 0.9, A.ph * 0.95, A.krallen), vn = bein(A.vn, A.pl, A.ph, A.krallen);
  const hh = def("hn", G(box(hn.pts))), vh = def("vn", G(box(vn.pts)));
  const clip = T.id("ku");
  T.def(`<clipPath id="${clip}"><use ${kh}/><use ${hh}/><use ${vh}/></clipPath>`);
  s += `<use ${kh} fill="${fell}"/><use ${kh} ${strich(0.28, 0.5)}/><use ${hh} fill="${fell}"/><use ${vh} fill="${fell}"/>`;
  let i = "";
  if (A.muster) i += A.muster(T, A, { vn, hn });
  const bb = T.box(A.koerper.concat(hn.pts, vn.pts));
  i += textur(T, "k", kd + G(hn.pts) + G(vn.pts), A.texturWinkel != null ? A.texturWinkel : 90, A.texturDeck || 0.08, bb);
  /* Plastik: Muskeln, Kernschatten, Kantenlicht (weich geblendet) */
  if (A.formenFein) i += weich(T, "kf", A.formenFein, A.hs * 0.016);
  i += weich(T, "k", A.formen || [], A.weichSd || A.hs * 0.045,
    `<use ${kh} ${strich(0.28, A.hs * 0.09, "#2a1506")}/>` +
    `<path d="${G(A.ruecken, false)}" ${strich(0.28, A.hs * 0.06, "#fff6e0")}/>` +
    (A.bauch ? `<path d="${G(A.bauch, false)}" ${strich(0.14, A.hs * 0.04, "#ffe6c0")}/>` : "") +
    [hn, vn].map((b) => `<path d="${G(b.H.slice(1), false)}" ${strich(0.26, A.pl * 0.3, "#2a1506")}/><path d="${G(b.V.slice(2), false)}" ${strich(0.14, A.pl * 0.14, "#fff")}/>`).join(""));
  i += `<rect x="${bb[0] - 20}" y="${-A.hs * 1.3}" width="${bb[2] - bb[0] + 40}" height="${A.hs * 1.3}" fill="${T.lg("vol", [[0, "#fff", 0.14], [0.3, "#fff", 0.02], [0.55, "#000", 0.02], [0.64, "#1a0c04", 0.16], [0.8, "#1a0c04", 0.08], [1, "#1a0c04", 0.16]], 0, -A.hs * 1.08, 0, 0, UB)}"/>`;
  i += weich(T, "se", (A.sehnen || []).map(([pts, w, o, c]) => `<path d="${G(pts, false)}" ${strich(o, w, c || "#2a1506")}/>`), 0.6);
  for (const F of A.haarFelder(T, { vn, hn })) i += haare(T, F[0], F[1], F[2], F[3], F[4], F[5] || {});
  s += `<g clip-path="url(#${clip})">${i}</g>`;
  /* Ränder: Rumpf ganz, nahe Beine nur unterhalb des Rumpfes */
  for (const [n, h, b, y, xh] of [["rh", hh, hn, A.randH, A.randHx], ["rv", vh, vn, A.randV]]) {
    T.def(`<clipPath id="${T.id(n)}"><rect x="-99" y="${y}" width="600" height="99"/>${xh != null ? `<rect x="-99" y="-86" width="${xh + 99}" height="99"/>` : ""}</clipPath>`);
    s += `<use ${h} ${strich(0.32, 0.55)} clip-path="url(#${T.id(n)})"/><path d="${b.zehen}" ${strich(0.5, 0.6)}/>` +
      (b.krallen ? `<path d="${b.krallen}" ${strich(0.95, 0.9, "#2a2420")}/>` : "");
  }
  if (A.fransen) for (const F of A.fransen) s += haare(T, F[0], F[1], F[2], F[3], F[4], F[5] || {});
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
    textur(T, "kopf", kd, H.texturWinkel || 0, 0.1, [-5, -50, 110, 40]) +
    weich(T, "kopf", H.formen || [], 2.4, `<path d="${G(H.profil, false)}" fill="none" stroke="#2a1506" stroke-opacity=".28" stroke-width="8"/>`) +
    `<use href="#${id}" fill="${T.lg("kvol", [[0, "#fff", 0.12], [0.35, "#fff", 0], [0.7, "#000", 0.05], [1, "#000", 0.26]], 0, -45, 0, 34, UB)}"/>` +
    (H.muster || "") + (H.haare ? H.haare(T) : "") + `</g>`;
  s += `<path d="${G(H.profil, false)}" fill="none" stroke="#1a1009" stroke-opacity=".38" stroke-width=".8" stroke-linecap="round"/>`;
  s += H.details || "";
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
    hs, pl: 26, ph: 12, randH: -60, randV: -56, randHx: 6,
    fell: [[0, "#a0733f"], [0.22, "#bd8e55"], [0.5, "#cba26b"], [0.68, "#d6b887"], [0.85, "#cdb085"], [1, "#b39670"]],
    haarL: 2.2, haarBreite: 0.24, haarBein: 140, haarSchwanz: 40,
    haarFarben: [["#8a6232", 1, 0.22, 0.32], ["#f0d4a0", 1, 0.22, 0.34]],
    koerper: [[6, -100], [14, -106], [26, -110], [42, -108], [60, -104], [80, -103], [98, -106], [110, -112], [120, -118], [135, -120],
      [150, -117], [163, -108], [168, -92], [166, -76], [158, -60], [146, -52], [128, -50], [108, -52], [88, -55], [72, -58], [60, -60],
      [50, -63], [42, -70], [20, -76], [4, -78], [-2, -86], [0, -95]],
    ruecken: [[2, -96], [14, -105], [26, -109], [42, -107], [60, -103], [80, -102], [98, -105], [110, -111], [120, -116]],
    bauch: [[56, -61], [72, -59], [88, -56], [108, -53], [128, -51]],
    hn: { V: [[40, -96], [45, -84], [47, -72], [46, -62], [40, -54], [32, -46], [24, -38], [19, -31], [19, -22], [21, -12]],
      H: [[-2, -90], [-3, -78], [-1, -68], [2, -58], [3, -48], [2, -40], [1, -35], [6, -30], [9, -20], [11, -12]], x: 16 },
    hf: { V: [[60, -80], [66, -68], [65, -60], [59, -52], [51, -44], [45, -36], [42, -29], [43, -20], [45, -12]],
      H: [[26, -80], [26, -68], [27, -58], [29, -48], [28, -40], [27, -35], [31, -30], [34, -20], [36, -12]], x: 40.5 },
    vn: { V: [[162, -92], [160, -78], [158, -64], [153, -52], [150, -40], [148, -28], [146, -20], [147, -12]],
      H: [[124, -86], [123, -68], [121, -57], [124, -48], [128, -36], [131, -25], [130, -19], [133, -15], [135, -12]], x: 141 },
    vf: { V: [[170, -80], [170, -64], [167, -52], [168, -40], [171, -29], [174, -20], [177, -12]],
      H: [[140, -70], [138, -58], [142, -48], [148, -38], [154, -28], [157, -20], [160, -16], [164, -12]], x: 170.5 },
    schwanz: [[8, -98, 4.6, 4.6], [-4, -96, 4.4, 4.4], [-15, -86, 4, 4], [-22, -70, 3.7, 3.7], [-25, -52, 3.4, 3.4], [-24, -36, 3.2, 3.2], [-21, -26, 3, 3]],
    weichSd: 4.6,
    formen: [
      /* Oberschenkel-Rundung, Lende/Rücken im Licht, Rippen, Unterschenkel, Unterarm-Vorderkante */
      [[[4, -100], [22, -106], [38, -98], [38, -84], [24, -78], [8, -84]], "#fff2d6", 0.38],
      [[[30, -108], [60, -104], [100, -105], [100, -98], [60, -97], [30, -100]], "#fff2d6", 0.3],
      [84, -88, 22, 8, 0, "#fff2d6", 0.2], [[[10, -58], [20, -56], [19, -46], [9, -47]], "#fff2d6", 0.25],
      [[[150, -50], [153, -46], [149, -24], [146, -26]], "#fff2d6", 0.25],
      /* Flankengrube, Kernschatten am Bauch, unter dem Knie, hinter dem Ellbogen, Rückenlinie etwas dunkler */
      [[[47, -92], [58, -86], [57, -70], [46, -72]], "#5a2c0c", 0.3],
      [[[56, -66], [90, -60], [128, -56], [128, -50], [90, -54], [56, -60]], "#2a1406", 0.3],
      [30, -64, 8, 5, 0, "#2a1406", 0.2], [121, -60, 4, 6, 0, "#2a1406", 0.3], [70, -106, 46, 2.5, 0, "#6a4218", 0.3],
    ],
    formenFein: [
      [[[44, -94], [48, -80], [47, -66], [45, -66], [45, -80], [42, -92]], "#2a1406", 0.35],
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
        [this.koerper, 420, kw, L * 0.9, [["#8e6534", 1, 0.2, 0.22], ["#b48650", 1, 0.2, 0.22], ["#f6dcaa", 1, 0.2, 0.26]]],
        [vn.pts, 90, 94, L * 0.9, this.haarFarben],
        [hn.pts, 90, (x, y) => (y < -60 ? 125 : 96), L * 0.9, this.haarFarben],
      ];
    },
    fransen: [
      [[[60, -61], [100, -54], [130, -52], [130, -49], [100, -51], [60, -58]], 40, 100, 3.5, [["#8a6234", 1, 0.26, 0.45], ["#dcbc88", 1, 0.24, 0.4]], { szene: 0.3 }],
      [[[119, -60], [125, -56], [126, -50], [121, -52]], 22, 112, 6, [["#2e1a0c", 1, 0.45, 0.6], ["#6a4422", 0.6, 0.4, 0.5]], { szene: 0.4 }],
    ],
  };
  /* Schwanzquaste: dunkler Pinsel aus Strähnen, der Sporn steckt darin */
  A.schwanzEnde = (T) => {
    const feld = [[-27, -30], [-17, -30], [-14, -18], [-18, -6], [-23, -3], [-28, -10], [-29, -20]];
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
    [["#a06c36", 1, 0.45, 0.5], ["#f2d49a", 1, 0.42, 0.5]], { szene: 0.2, krumm: 0.3 }) + haare(T, K.umriss, 180, (x, y) => (x > 80 && y < -5 ? 196 : y > 10 ? 165 : x < 58 ? 160 : 186), 2.4,
    [["#8a5e2e", 1, 0.3, 0.3], ["#fbeccc", 0.9, 0.28, 0.34]], { szene: 0.15 });
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
    const id = T.id("mf");
    T.def(`<clipPath id="${id}"><path d="${G(feld)}"/></clipPath>`);
    const unter = [tr([38, -50], g), tr([32, -20], g), tr([34, 14], g), tr([48, 40], g)].map(([x, y]) => [x, y, 13, 11, 0, "#b27a3c", 0.9])
      .concat([[150, -118, 22, 9, -10, "#8a5a2a", 0.8], [140, -66, 20, 14, 0, "#120802", 0.9], [112, -92, 8, 18, 0, "#1e0e06", 0.7], [168, -56, 10, 8, 0, "#1a0c04", 0.8]]);
    return `<path d="${G(feld)}" fill="#4a2a12"/><g clip-path="url(#${id})">${weich(T, "mu", unter, 6)}</g>` +
      weich(T, "ml", [lockenFeld(T, feld, 140, fl, 12, 22, 6.5, rf, (x, y) => Math.hypot(x - C[0], y - C[1]), { szene: 0.3, kante: 0 })], 0.45) +
      bueschel(T, feld, 80, fl, 12, 22, rampe, ton, { pro: 6, breite: 4.5, w: 0.5, op: 0.8, szene: 0.12 });
  };
  A.vorKopf = (T) => {
    /* Backenbart: helle, kürzere Büschel über dem hinteren Kopfrand; Bart unter dem Kinn */
    const band = [[46, -52], [36, -36], [30, -14], [30, 8], [38, 26], [52, 36], [64, 38], [70, 33], [58, 29], [48, 21], [42, 4], [42, -14], [48, -30], [54, -44]].map((p) => tr(p, g));
    const fk = (x, y) => norm((x - C[0]) / 18 - 0.4, (y - C[1]) / 18 + 0.8);
    const hr = ["#5a3416", "#7e4e22", "#a06a32", "#c08848", "#d8a660", "#ecc382", "#f8deaa"];
    const ht = (x, y) => Math.max(0, Math.min(1, 0.55 + (-y - 100) / 40));
    return weich(T, "rb", [`<path d="${G(band)}" fill="#b47c3e"/>`, lockenFeld(T, band, 46, fk, 7, 13, 4.5, (x, y, z) => hr[Math.min(6, Math.floor((ht(x, y) + (z - 0.5) * 0.3) * 7))],
      (x, y) => Math.hypot(x - C[0], y - C[1]), { szene: 0.3, kante: 0 })], 0.5) +
      bueschel(T, band, 36, fk, 7, 13, hr, ht, { pro: 6, breite: 3, w: 0.42, op: 0.85, szene: 0.12 });
  };
  return katze(T, A);
}

module.exports = [
  { id: "loewe", de: "der Löwe", syl: "LÖ-we", it: "il leone", itSyl: "le-O-ne", en: "lion", gruppe: "Raubtiere", lebensraum: "Savanne",
    laenge: 2.5, hoehe: 1.4, zeichne: loewe },
];
