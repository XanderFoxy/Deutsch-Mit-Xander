"use strict";
/* Raubkatzen – Entwurf 2 */
const r = (n) => Math.round(n * 10) / 10;
const UB = ' gradientUnits="userSpaceOnUse"';

/* glatte Kurve, ganzzahlig (cm) – spart Bytes; [x, y, 1] = harte Ecke */
function G(pts, zu = true) {
  const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]), q = Math.round;
  let d = `M${q(pts[0][0])} ${q(pts[0][1])}`;
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${q(c1[0])} ${q(c1[1])} ${q(c2[0])} ${q(c2[1])} ${q(p2[0])} ${q(p2[1])}`;
  }
  return (d + (zu ? "Z" : "")).replace(/ -/g, "-");
}
/* Röhre (Bein, Schwanz) um eine Mittellinie: J = [[x, y, vorn, hinten], …] */
function rohr(J) {
  const n = J.length, V = [], H = [];
  for (let i = 0; i < n; i++) {
    const a = J[Math.max(0, i - 1)], b = J[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    V.push([J[i][0] + dy * J[i][2], J[i][1] - dx * J[i][2]]);
    H.push([J[i][0] - dy * J[i][3], J[i][1] + dx * J[i][3]]);
  }
  return { V, H };
}
/* Bein mit Pfote (Zehengänger): letzter Gelenkpunkt = Fesselgelenk über der Pfote */
function bein(J, pl, ph) {
  const { V, H } = rohr(J);
  const x = J[J.length - 1][0];
  const pf = [[x + pl * 0.22, -ph * 1.02], [x + pl * 0.52, -ph * 0.98], [x + pl * 0.8, -ph * 0.72], [x + pl * 0.96, -ph * 0.32], [x + pl * 0.86, 0, 1],
    [x - pl * 0.2, 0, 1], [x - pl * 0.3, -ph * 0.4]];
  return { pts: V.slice(0, -1).concat(pf, H.slice(0, -1).reverse()), V, H,
    zehen: `M${r(x + pl * 0.5)} ${r(-ph * 0.95)}q1 ${r(ph * 0.4)} 0 ${r(ph * 0.8)}M${r(x + pl * 0.74)} ${r(-ph * 0.72)}q1 ${r(ph * 0.3)} 0 ${r(ph * 0.62)}` };
}
const tr = (p, g) => { const c = Math.cos(g.w), s = Math.sin(g.w), x = p[0] * g.k, y = p[1] * g.k; return [g.x + x * c - y * s, g.y + x * s + y * c]; };
const norm = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };

/* Haarlocken an einer Kante: Spitzen zeigen in Fließrichtung fl(p) */
function locken(T, pts, schritt, laenge, fl) {
  const o = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / schritt));
    for (let k = 0; k < n; k++) {
      const t = k / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
      o.push([x, y]);
      const tm = (k + 0.5) / n, xm = x0 + (x1 - x0) * tm, ym = y0 + (y1 - y0) * tm, [fx, fy] = fl(xm, ym), L = laenge * (0.5 + T.rnd());
      o.push([xm + fx * L, ym + fy * L, 1]);
    }
  }
  o.push(pts[pts.length - 1]);
  return o;
}
/* Haarsträhnen in einem Feld, entlang Fließrichtung, leicht gebogen – EIN Pfad */
function straehnen(T, n, x0, y0, x1, y1, fl, L, farbe, w, op) {
  let d = "";
  for (let i = 0; i < n; i++) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0), [fx, fy] = fl(x, y), l = L * (0.6 + T.rnd() * 0.7), b = (T.rnd() - 0.5) * l * 0.5;
    d += `M${Math.round(x)} ${Math.round(y)}q${Math.round(fx * l / 2 - fy * b)} ${Math.round(fy * l / 2 + fx * b)} ${Math.round(fx * l)} ${Math.round(fy * l)}`;
  }
  return `<path d="${d.replace(/ -/g, "-")}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round"/>`;
}

/* ---------- die Katze ---------- */
function katze(T, A) {
  const B = [];
  const box = (pts) => { for (const p of pts) B.push(p); return pts; };
  const fell = T.lg("fell", A.fell, 0, -A.hs * 1.12, 0, 0, UB);
  const RF = "#1a1009";
  const def = (n, d) => { const id = T.id(n); T.def(`<path id="${id}" d="${d}"/>`); return `href="#${id}"`; };
  const strich = (o, w) => `fill="none" stroke="${RF}" stroke-opacity="${o}" stroke-width="${w}" stroke-linejoin="round"`;
  let s = "";
  /* ferne Beine (dunkler, Tiefe) */
  const vf = bein(A.vf, A.pl, A.ph), hf = bein(A.hf, A.pl * 0.94, A.ph);
  for (const [n, b] of [["vf", vf], ["hf", hf]]) {
    const h = def(n, G(box(b.pts)));
    s += `<use ${h} fill="${fell}"/><use ${h} fill="#22140a" fill-opacity=".38"/><use ${h} ${strich(0.3, 0.7)}/>` +
      `<path d="${b.zehen}" ${strich(0.4, 0.6)}/>`;
  }
  /* Schwanz */
  const sw = rohr(A.schwanz);
  const sh = def("sw", G(box(sw.V.concat(sw.H.slice().reverse()))));
  s += `<use ${sh} fill="${fell}"/><use ${sh} fill="${T.lg("swv", [[0, "#fff", 0.14], [0.5, "#000", 0], [1, "#000", 0.32]], 0, 0, 1, 0)}"/>`;
  if (A.schwanzMuster) s += `<g clip-path="url(#${T.id("swc")})">${A.schwanzMuster(T)}</g>`, T.def(`<clipPath id="${T.id("swc")}"><use ${sh}/></clipPath>`);
  s += `<use ${sh} ${strich(0.3, 0.6)}/>`;
  if (A.schwanzEnde) s += A.schwanzEnde(T);
  /* Körper + nahe Beine (gleiche Füllung, nahtlos) */
  const kh = def("k", G(box(A.koerper)));
  const hn = bein(A.hn, A.pl * 0.94, A.ph), vn = bein(A.vn, A.pl, A.ph);
  const hh = def("hn", G(box(hn.pts))), vh = def("vn", G(box(vn.pts)));
  const clip = T.id("ku");
  T.def(`<clipPath id="${clip}"><use ${kh}/><use ${hh}/><use ${vh}/></clipPath>`);
  s += `<use ${kh} fill="${fell}"/><use ${kh} ${strich(0.32, 0.7)}/><use ${hh} fill="${fell}"/><use ${vh} fill="${fell}"/>`;
  /* Innenzeichnung */
  let i = A.muster ? A.muster(T, A) : "";
  const vol = T.lg("vol", [[0, "#fff", 0.22], [0.28, "#fff", 0.05], [0.5, "#000", 0.04], [0.62, "#000", 0.22], [0.75, "#000", 0.1], [1, "#000", 0.16]], 0, -A.hs * 1.08, 0, 0, UB);
  i += `<rect x="-60" y="${-A.hs * 1.3}" width="${A.hs * 3.2}" height="${A.hs * 1.3}" fill="${vol}"/>`;
  const hl = T.rg("hl", [[0, "#fff", 0.24], [1, "#fff", 0]]), ds = T.rg("ds", [[0, "#2a1606", 0.3], [1, "#2a1606", 0]]);
  for (const [x, y, rx, ry] of A.licht || []) i += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${hl}"/>`;
  for (const [x, y, rx, ry] of A.dunkel || []) i += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${ds}"/>`;
  for (const [pts, w, o] of A.muskeln || []) i += `<path d="${G(pts, false)}" ${strich(o, w)} stroke-linecap="round"/>`;
  for (const b of [hn, vn]) i += `<path d="${G(b.H.slice(1, -1), false)}" fill="none" stroke="#2a1606" stroke-opacity=".18" stroke-width="${A.pl * 0.3}" stroke-linecap="round"/>`;
  if (A.fellStriche) i += A.fellStriche(T, A);
  s += `<g clip-path="url(#${clip})">${i}</g>`;
  /* Rand der nahen Beine nur unterhalb des Rumpfes */
  for (const [n, h, b, y] of [["rh", hh, hn, A.randH], ["rv", vh, vn, A.randV]]) {
    T.def(`<clipPath id="${T.id(n)}"><rect x="-99" y="${y}" width="500" height="99"/></clipPath>`);
    s += `<use ${h} ${strich(0.34, 0.7)} clip-path="url(#${T.id(n)})"/><path d="${b.zehen}" ${strich(0.42, 0.6)}/>`;
  }
  /* Kontaktschatten der Pfoten */
  s += `<path d="${[vn, hn, vf, hf].map((b) => `M${Math.round(b.V[b.V.length - 1][0] - A.pl * 0.3)} 0h${Math.round(A.pl * 1.2)}`).join("")}" stroke="#000" stroke-opacity=".3" stroke-width="1.6" stroke-linecap="round"/>`;
  if (A.hinterKopf) s += A.hinterKopf(T, box);
  s += kopf(T, A, box);
  if (A.vorKopf) s += A.vorKopf(T, box);
  const bx = T.box(B).map(Math.round);
  bx[3] = 0;
  return { svg: s, box: bx };
}

/* ---------- Kopf (lokal: Kopflänge 100, Nase rechts, y nach unten) ---------- */
function kopf(T, A, box) {
  const H = A.kopf, g = { x: H.x, y: H.y, k: H.k / 100, w: (H.w || 0) * Math.PI / 180 };
  box(H.umriss.map((p) => tr(p, g)));
  if (H.ohr) box(H.ohr.map((p) => tr(p, g)));
  const id = T.id("kp");
  T.def(`<path id="${id}" d="${G(H.umriss)}"/><clipPath id="${T.id("kc")}"><use href="#${id}"/></clipPath>`);
  let s = "";
  if (H.ohr) s += `<path d="${G(H.ohr)}" fill="${H.ohrFarbe}" stroke="#000" stroke-opacity=".3"/>` + (H.ohrInnen || "");
  s += `<use href="#${id}" fill="${T.lg("kopf", H.fell, 0, -45, 0, 32, UB)}"/>`;
  s += `<g clip-path="url(#${T.id("kc")})">${H.zeichnung || ""}<use href="#${id}" fill="${T.lg("kvol", [[0, "#fff", 0.2], [0.4, "#fff", 0], [0.75, "#000", 0.08], [1, "#000", 0.3]], 0, -45, 0, 32, UB)}"/></g>`;
  s += `<path d="${G(H.profil, false)}" fill="none" stroke="#1a1009" stroke-opacity=".4" stroke-linecap="round"/>`;
  s += H.details || "";
  return `<g transform="translate(${r(g.x)} ${r(g.y)})rotate(${H.w || 0})scale(${H.k / 100})">${s}</g>`;
}

/* Profil-Auge (lokal): Mandel, Iris, Pupille, Lidrand, kleines Glanzlicht */
function auge(x, y, w, iris, pup = "rund") {
  const m = (k, dx = 0) => G([[x - w * 0.52 * k + dx, y - w * 0.02 * k], [x - w * 0.04 * k + dx, y - w * 0.3 * k], [x + w * 0.5 * k + dx, y + w * 0.06 * k], [x + w * 0.02 * k + dx, y + w * 0.25 * k]]);
  const q = (n) => Math.round(n * 10) / 10;
  return `<path d="${m(1.35)}" fill="#f4ead6" opacity=".5"/><path d="${m(1)}" fill="#0f0905"/><path d="${m(0.78, w * 0.04)}" fill="${iris}"/>` +
    `<ellipse cx="${q(x + w * 0.14)}" cy="${q(y + w * 0.01)}" rx="${q(w * (pup === "rund" ? 0.13 : 0.07))}" ry="${q(w * 0.19)}" fill="#050302"/>` +
    `<path d="M${q(x - w * 0.46)} ${q(y - w * 0.06)}Q${q(x)} ${q(y - w * 0.4)} ${q(x + w * 0.48)} ${q(y + w * 0.02)}" fill="none" stroke="#070402" stroke-width="${q(w * 0.13)}" stroke-linecap="round"/>` +
    `<circle cx="${q(x + w * 0.24)}" cy="${q(y - w * 0.1)}" r="${q(w * 0.065)}" fill="#fff" opacity=".9"/>`;
}
/* Schnurrhaar-Punkte und Schnurrhaare (lokal) */
function schnurr(punkte, haare, farbe = "#fbf6ea") {
  return `<path d="M${punkte.map(([x, y]) => x + " " + y + "h0").join("M")}" stroke="#20140c" stroke-width="1.3" stroke-linecap="round"/>` +
    `<path d="${haare}" fill="none" stroke="${farbe}" stroke-opacity=".8" stroke-width=".45" stroke-linecap="round"/>`;
}

/* ================= LÖWE =================
   RECHERCHE (Britannica, SDZG, UFS): Männchen 1,8–2,1 m Kopf-Rumpf + ~0,9–1 m Schwanz, Schulterhöhe ~1,2 m, 170–230 kg.
   Muskulös, breite Brust, großer Kopf mit langer, gerader Nasenlinie, runde kleine Ohren, kurze kräftige Beine.
   Mähne: umrahmt das Gesicht, bedeckt Hinterkopf, Hals, Schultern, geht auf Kehle und Brust über (Fransen bis zum Bauch),
   nach hinten/unten dunkler (goldgelb → dunkelbraun/schwarz). Einzige Katze mit schwarzer Schwanzquaste. Ellbogenbüschel.
   Fell gelbbraun (lohfarben), Unterseite heller, Kinn/Lefzen weiß, Nasenspiegel rosa-braun, Augen bernstein, runde Pupille. */
function loewe(T) {
  const hs = 118;
  const A = {
    hs, pl: 27, ph: 12.5, randH: -60, randV: -62,
    fell: [[0, "#a77a45"], [0.25, "#c29358"], [0.55, "#cfa56c"], [0.72, "#dabb88"], [1, "#c9a878"]],
    koerper: [[6, -100], [24, -110], [50, -108], [90, -103], [120, -107], [148, -116], [176, -117], [196, -104], [205, -84], [198, -64],
      [182, -50], [160, -45], [125, -49], [90, -51], [62, -46], [44, -50], [26, -64], [4, -72], [-4, -88]],
    vn: [[160, -88, 22, 20], [150, -54, 15, 17], [154, -34, 11, 9.5], [157, -19, 9, 8], [159, -11, 8, 7.5]],
    vf: [[167, -86, 18, 18], [171, -55, 13, 15], [183, -33, 10, 8.5], [190, -19, 8.5, 7.5], [193, -11, 8, 7]],
    hn: [[22, -84, 27, 26], [29, -58, 17, 15], [11, -37, 9, 11], [15, -21, 7.5, 6.5], [17, -11, 7, 6.5]],
    hf: [[38, -84, 22, 22], [52, -57, 15, 14], [40, -36, 8.5, 10], [46, -20, 7.5, 6.5], [49, -11, 7, 6.5]],
    schwanz: [[8, -98, 5, 5], [-6, -94, 4.6, 4.6], [-19, -80, 4.2, 4.2], [-27, -60, 3.8, 3.8], [-29, -40, 3.5, 3.5], [-26, -25, 3.2, 3.2]],
    schwanzEnde(T) {
      const pts = locken(T, [[-31, -30], [-34, -18], [-30, -6]], 3, 5, () => [0, 1]).concat([[-24, -4], [-19, -12], [-21, -27]]);
      return `<path d="${G(pts)}" fill="${T.lg("quaste", [[0, "#4a2c16"], [1, "#120a05"]])}"/>` +
        straehnen(T, 10, -31, -28, -22, -12, () => [0.1, 1], 9, "#000", 0.6, 0.45);
    },
    licht: [[158, -96, 26, 22], [26, -92, 28, 24], [100, -100, 40, 8]],
    dunkel: [[136, -66, 16, 20], [62, -60, 22, 11]],
    muskeln: [[[[42, -52], [46, -70], [42, -88], [32, -104]], 1.6, 0.16], [[[4, -46], [-1, -64], [-2, -82]], 1.2, 0.12],
      [[[140, -54], [138, -72], [145, -92]], 1.6, 0.14]],
    fellStriche: (T) => straehnen(T, 26, 70, -66, 135, -48, () => [-0.3, 1], 6, "#6b4520", 0.6, 0.3) +
      straehnen(T, 18, 10, -112, 140, -95, () => [-1, 0.15], 14, "#f6e2b8", 0.6, 0.22),
  };
  /* Kopf: 100 Einheiten = 56 cm */
  const K = A.kopf = {
    x: 178, y: -103, k: 56, w: 9,
    fell: [[0, "#b98a50"], [0.45, "#cfa46a"], [1, "#dcc19a"]],
    umriss: [[0, -30], [20, -40], [40, -42], [55, -39], [66, -33], [75, -27], [87, -22], [96, -18], [101, -14], [103, -8], [101, -3],
      [100, 4], [98, 12], [93, 16], [89, 18], [90, 22], [86, 28], [74, 32], [55, 32], [35, 28], [15, 20], [3, 6]],
    profil: [[50, -40], [55, -39], [66, -33], [75, -27], [87, -22], [96, -18], [101, -14], [103, -8], [101, -3], [100, 4], [98, 12], [93, 16], [89, 18], [90, 22], [86, 28], [74, 32], [62, 32]],
    ohr: [[22, -34], [21, -48], [29, -55], [37, -50], [39, -38]], ohrFarbe: "#3a2616",
    ohrInnen: `<path d="M27 -40q1 -9 7 -10q2 5 1 10z" fill="#d8c09a" opacity=".7"/>`,
  };
  K.zeichnung =
    `<path d="${G([[72, -24], [86, -19], [97, -15], [96, -8], [80, -12], [66, -16]])}" fill="#a2713e" opacity=".55"/>` + // Nasenrücken dunkler
    `<path d="${G([[66, 4], [80, -6], [96, -3], [101, 6], [99, 15], [86, 18], [70, 15]])}" fill="#efe2c6" opacity=".85"/>` + // Schnurrhaarpolster
    `<path d="${G([[74, 22], [88, 18], [92, 24], [84, 32], [68, 32]])}" fill="#f7f0e2"/>` + // Kinn weiß
    `<path d="${G([[50, -18], [62, -14], [72, -19], [66, -9], [52, -8]])}" fill="#f2e3c4" opacity=".6"/>` + // hell unterm Auge
    `<path d="${G([[40, 0], [58, 4], [70, 12], [56, 24], [34, 20]])}" fill="#7a5028" opacity=".2"/>` + // Wangenschatten
    straehnen(T, 16, 40, -36, 86, -20, () => [0.97, 0.25], 10, "#7a5229", 0.6, 0.3);
  K.details =
    `<path d="${G([[95, -16], [102, -11], [103, -6], [101, -2], [96, -4], [93, -10]])}" fill="#6e3a33"/>` + // Nasenspiegel
    `<path d="M99 -4q-4 -1 -3 -6" fill="none" stroke="#1a0c08" stroke-width="1.3" stroke-linecap="round"/>` +
    `<path d="M101 2Q100 10 94 15Q84 17 66 12" fill="none" stroke="#1d120c" stroke-width="1.6" stroke-linecap="round"/>` + // Lefze
    `<path d="M88 24Q80 27 70 26" fill="none" stroke="#5b4630" stroke-opacity=".35"/>` +
    schnurr([[84, 2], [88, 3.5], [92, 4], [82, 6], [86, 7.5], [90, 8], [94, 8], [84, 10.5], [88, 11.5]],
      "M90 5q16 -4 30 -12M90 7q18 0 33 -2M89 9q16 4 30 10M88 11q12 7 22 16M86 6q12 -8 20 -16") +
    auge(60, -25, 10.5, "#b5852e") +
    `<path d="M65 -21Q71 -13 76 -4" fill="none" stroke="#2a1a10" stroke-opacity=".45" stroke-width="1.3" stroke-linecap="round"/>`;
  /* Mähne: Fließrichtung vom Gesicht weg, nach unten fallend */
  const C = [212, -108];
  const fl = (x, y) => norm((x - C[0]) / 30, (y - C[1]) / 30 + 0.9);
  A.hinterKopf = (T, box) => {
    const aussen = [[203, -126], [190, -140], [170, -141], [150, -134], [134, -122], [124, -104], [122, -86], [128, -68], [142, -54], [160, -46], [180, -44], [198, -50], [210, -62], [216, -74]];
    const pts = box(locken(T, aussen, 7, 8, fl)).concat([[208, -88], [200, -102], [198, -118]]);
    const id = T.id("mh");
    T.def(`<path id="${id}" d="${G(pts)}"/><clipPath id="${T.id("mc")}"><use href="#${id}"/></clipPath>`);
    const mitte = locken(T, [[201, -128], [184, -134], [166, -130], [154, -116], [150, -96], [156, -78], [170, -64], [190, -58], [206, -64], [212, -76]], 6, 7, fl)
      .concat([[206, -90], [199, -104], [198, -120]]);
    return `<use href="#${id}" fill="${T.lg("maehne", [[0, "#5a3618"], [0.55, "#3c2210"], [1, "#22120a"]], 1, 0, 0, 1)}"/>` +
      `<g clip-path="url(#${T.id("mc")})"><path d="${G(mitte)}" fill="${T.lg("maehne2", [[0, "#c08a48"], [0.6, "#8a5a2a"], [1, "#5a3618"]], 1, 0, 0, 1)}"/>` +
      straehnen(T, 70, 124, -140, 214, -46, fl, 12, "#1a0d06", 0.8, 0.4) + straehnen(T, 45, 150, -134, 212, -58, fl, 10, "#e8b874", 0.7, 0.35) +
      `<use href="#${id}" fill="${T.lg("mvol", [[0, "#fff", 0.12], [0.5, "#fff", 0], [1, "#000", 0.3]])}"/></g>` +
      `<use href="#${id}" fill="none" stroke="#000" stroke-opacity=".22" stroke-width=".7"/>`;
  };
  A.vorKopf = (T) => {
    /* Krause hinter Wange und Bart unter dem Kinn (über dem Kopf) */
    const fk = (x, y) => norm((x - C[0]) / 20, (y - C[1]) / 20 + 0.5);
    const pts = locken(T, [[198, -122], [192, -110], [192, -96], [197, -84], [206, -76], [217, -73]], 4, 6, fk).concat([[214, -80], [205, -84], [200, -96], [200, -112]]);
    return `<path d="${G(pts)}" fill="${T.lg("krause", [[0, "#d39c58"], [1, "#9a6630"]], 1, 0, 0, 1)}"/>` +
      straehnen(T, 22, 191, -120, 212, -78, fk, 8, "#4a2a10", 0.6, 0.4);
  };
  return katze(T, A);
}

module.exports = [
  { id: "loewe", de: "der Löwe", syl: "LÖ-we", it: "il leone", itSyl: "le-O-ne", en: "lion", gruppe: "Raubtiere", lebensraum: "Savanne",
    laenge: 2.5, hoehe: 1.4, zeichne: loewe },
];
