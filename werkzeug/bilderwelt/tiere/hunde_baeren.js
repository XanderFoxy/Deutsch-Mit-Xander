/* =====================================================================
   TIER-BIBLIOTHEK — HUNDE & BÄREN (Raubtiere)  (FASSUNG 854)
   Wolf, Fuchs, Braunbär, Eisbär, Panda, Waschbär, Hyäne.
   Arbeitsweise je Art: eine VEREINIGTE Silhouette (Rumpf + Hals + Kopf +
   nahe Beine als Teilpfade, gleiche Drehrichtung → nonzero = Vereinigung),
   Fell als Verlauf in Zentimeter-Koordinaten (userSpaceOnUse: Bein und
   Rumpf haben an derselben Höhe dieselbe Farbe → keine Nähte), Rand als
   Strich HINTER der Füllung (nur die Außenkante bleibt sichtbar), weiches
   Licht/Schatten mit Radialverläufen, Muskeln als zarte Linien, Fell mit
   T.striche. Ferne Beine dunkler, kein Filter (schnell).
   ===================================================================== */
"use strict";
const R = (n) => Math.round(n * 10) / 10;
/* kurze Zahl: 0.4 → .4, -0.4 → -.4 (Haare sind viele – jedes Byte zählt) */
const Z = (n) => String(R(n)).replace(/^(-?)0\./, "$1.");
/* Haare/Strähnen in Zehntel-Zentimetern als ganze Zahlen (Pfad mit scale(.1)) – spart ein Fünftel der Bytes */
const G = (n) => Math.round(n * 10);
const fein10 = (d, attr) => `<path transform="scale(.1)" d="${d}" ${attr}/>`;

/* ---------- Hilfen ---------- */
/* Fläche (Vorzeichen) – alle Teilpfade einer Silhouette gleich herum */
function flaeche(p) { let a = 0; for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length]; a += p[i][0] * q[1] - q[0] * p[i][1]; } return a; }
const gleich = (p) => (flaeche(p) < 0 ? p.slice().reverse() : p);
/* Glied: Gelenkkette (oben → unten) mit Breiten [hinten, vorn] je Gelenk; dazwischen die Pfote */
function glied(kette, breiten, pfote = [], ecken = []) {
  const n = kette.length, hin = [], vor = [];
  for (let i = 0; i < n; i++) {
    const a = kette[Math.max(0, i - 1)], b = kette[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const nx = -dy, ny = dx, [wh, wv] = breiten[i];
    hin.push(ecken.includes(i) ? [kette[i][0] + nx * wh, kette[i][1] + ny * wh, 1] : [kette[i][0] + nx * wh, kette[i][1] + ny * wh]);
    vor.push([kette[i][0] - nx * wv, kette[i][1] - ny * wv]);
  }
  return hin.concat(pfote, vor.reverse());
}
/* Hundepfote (Zehengänger): Ballen hinten, Zehen vorn, flache Sohle. x = Mitte unter dem Mittelfuß */
const pfoteHund = (x, L = 10, H = 4.5) => [[x - L * 0.26, -H * 0.55], [x - L * 0.2, 0, 1], [x + L * 0.6, 0, 1], [x + L * 0.73, -H * 0.26], [x + L * 0.67, -H * 0.62], [x + L * 0.53, -H * 0.7], [x + L * 0.4, -H * 0.93], [x + L * 0.27, -H * 0.96], [x + L * 0.18, -H * 1.08]];
/* Pfoten-Feinheiten (Seitenansicht): Zehenfugen, Sohlenballen dunkel, Krallen aus dem Fell nach vorn-unten, mit Glanz */
function pfoteDetail(x, L = 10, H = 4.5, op = 1, kralle = "#1d1813", fein = true) {
  const P = (a, b) => `${R(x + L * a)} ${R(-H * b)}`;
  if (!fein) return `<path d="M${P(0.66, 0.34)}q${R(L * 0.11)} ${R(H * 0.05)} ${R(L * 0.15)} ${R(H * 0.33)}" stroke="${kralle}" stroke-width=".6" fill="none"/>`;
  return `<path d="M${P(0.53, 0.7)}Q${P(0.47, 0.35)} ${P(0.5, 0.04)}M${P(0.3, 0.94)}Q${P(0.26, 0.5)} ${P(0.3, 0.06)}" stroke="#2b1f14" stroke-width=".32" fill="none" stroke-opacity="${R(0.55 * op * 100) / 100}"/>` +
    `<path d="M${P(-0.16, 0.06)}L${P(0.55, 0.06)}" stroke="#1a130d" stroke-width=".7" stroke-opacity="${R(0.6 * op * 100) / 100}" stroke-linecap="round"/>` +
    `<path d="M${P(0.66, 0.34)}q${R(L * 0.11)} ${R(H * 0.05)} ${R(L * 0.15)} ${R(H * 0.33)}l${R(-L * 0.05)} ${R(-H * 0.08)}q${R(-L * 0.04)} ${R(-H * 0.18)} ${R(-L * 0.13)} ${R(-H * 0.18)}zM${P(0.44, 0.3)}q${R(L * 0.1)} ${R(H * 0.04)} ${R(L * 0.13)} ${R(H * 0.29)}l${R(-L * 0.05)} ${R(-H * 0.06)}q${R(-L * 0.03)} ${R(-H * 0.16)} ${R(-L * 0.11)} ${R(-H * 0.18)}z" fill="${kralle}" fill-opacity="${op}"/>` +
    `<path d="M${P(0.69, 0.32)}q${R(L * 0.07)} ${R(H * 0.04)} ${R(L * 0.1)} ${R(H * 0.2)}" stroke="#fff" stroke-width=".18" fill="none" stroke-opacity="${R(0.45 * op * 100) / 100}"/>`;
}
/* Querlicht für Läufe/Schwanz: links hell, rechts dunkel (Licht von links), als Überzug derselben Form */
const querLicht = (T, pts, st = 1) => T.form(pts, T.lg("ql" + String(st).replace(".", ""), [[0, "#fff", 0.22 * st], [0.4, "#fff", 0], [0.75, "#000", 0.1 * st], [1, "#000", 0.3 * st]], 0, 0, 1, 0));
/* Bärentatze (Sohlengänger): lange flache Sohle, vorne Krallen extra */
const tatze = (x, L, H) => [[x - L * 0.42, -H * 0.5], [x - L * 0.4, 0, 1], [x + L * 0.5, 0, 1], [x + L * 0.6, -H * 0.45], [x + L * 0.42, -H * 0.95]];
/* unterer Teil eines Glied-Umrisses (nur Punkte unterhalb von y) – für Laufhaar/-textur, die nicht in den Rumpf ragen sollen */
const unten = (p, y) => p.filter((q) => q[1] > y);
/* Pfad aus mehreren Teilen (alle gleich herum) */
const vereint = (T, teile) => teile.map((p) => T.glatt(gleich(p))).join("");
/* weicher Fleck (Radialverlauf, keine harte Kante); ein Verlauf je Farbe+Stärke */
const fleck = (T, n, cx, cy, rx, ry, farbe, op, dreh = 0) => (T.fein === false && rx * ry < 8 ? "" : fleckRoh(T, cx, cy, rx, ry, /^#(fff|000)$/.test(farbe) || op > 0.6 || n === "!" ? farbe : "#24190f", Math.max(0.1, Math.round(op * 10) / 10), dreh));
const fleckRoh = (T, cx, cy, rx, ry, farbe, op, dreh) =>
  `<ellipse cx="${R(cx)}" cy="${R(cy)}" rx="${R(rx)}" ry="${R(ry)}"${dreh ? ` transform="rotate(${dreh} ${R(cx)} ${R(cy)})"` : ""} fill="${T.rg("f" + farbe.slice(1) + String(op).replace(".", ""), [[0, farbe, op], [0.5, farbe, op * 0.6], [1, farbe, 0]])}"/>`;
/* Verlauf in Zentimetern (senkrecht): stops [[y, farbe, op?], …] */
const hoehenVerlauf = (T, n, y0, y1, stops) => T.lg(n, stops.map(([y, c, a]) => [R((y - y0) / (y1 - y0) * 1000) / 1000, c, a]), 0, y0, 0, y1, ' gradientUnits="userSpaceOnUse"');
/* Silhouette: Pfad EINMAL in defs; Rand-Strich dahinter, Füllung, Innenleben geklippt */
function silhouette(T, d, fill, innen, rand = "#2a2018", rw = 1.3, ra = 0.55, ueber = "") {
  T._n = (T._n || 0) + 1;
  const id = T.id("s" + T._n);
  T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  /* Kritik Runde 1: KEINE Umrisslinie (wirkt wie Aufkleber) – die Kante entsteht aus Kernschatten und Randhaaren */
  T._letzte = id;
  return `<use href="#${id}" fill="${fill}"/>` +
    (innen ? `<g clip-path="url(#${id}c)">${innen}</g>` : "") + (ueber ? `<use href="#${id}" fill="${ueber}"/>` : "");
}
/* Volumen-Licht wie T.volumen (ANLEITUNG 13), aber mit Glättung NACH der Beleuchtung: die 8-Bit-Stufen des geblurrten
   Alphas erzeugen sonst Höhenlinien („Holzmaserung“) auf großen Flächen. In Szenen (T.fein = false) kein Filter. */
function volumen(T, w, tiefe, amb) {
  if (T.fein === false || !T.volumen) return "none";
  const id = T.id("vl" + String(w).replace(".", "_") + "_" + String(tiefe).replace(".", "_"));
  T._vf = T._vf || new Set();
  if (!T._vf.has(id)) {
    T._vf.add(id);
    const el = 50, k1 = Math.round((1 - amb) / Math.sin(el * Math.PI / 180) * 10000) / 10000;
    T.def(`<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">` +
      `<feGaussianBlur in="SourceAlpha" stdDeviation="${w}" result="b"/>` +
      `<feDiffuseLighting in="b" surfaceScale="${tiefe}" diffuseConstant="1" lighting-color="#fff" result="d"><feDistantLight azimuth="225" elevation="${el}"/></feDiffuseLighting>` +
      `<feGaussianBlur in="d" stdDeviation="${R(w * 0.35)}" result="g"/>` +
      `<feComposite in="g" in2="SourceGraphic" operator="arithmetic" k1="${k1}" k2="0" k3="${amb}" k4="0" result="m"/>` +
      `<feComposite in="m" in2="SourceGraphic" operator="in"/></filter>`);
  }
  return `url(#${id})`;
}
/* KÖRPERTEIL mit eigenem Volumen (T.volumen, ANLEITUNG Punkt 13): Füllung + geklippte Innenzeichnung + Randhaare in EINER
   Gruppe mit Licht-Filter (Rundung, Licht links oben, Kernschatten unten entstehen aus der eigenen Silhouette).
   o.weich = 20–30 % der Teildicke (cm); o.einblenden = [y0, y1] → oberer Rand weich ausgeblendet (Bein wächst aus dem Rumpf),
   o.einblendenX = [x0, x1] → linker Rand weich (Kopf wächst aus dem Hals). Liefert { svg, id }. */
/* glatte geschlossene Kurve wie T.glatt, aber relativ (in cm, eine Nachkommastelle, ohne führende Null) – kürzer.
   KEIN scale(.1) am Pfad: sonst rechneten die userSpaceOnUse-Verläufe (Fellfarbe nach Höhe) in Zehntel-cm. */
function glattR(pts) {
  const n = pts.length, P = (i) => pts[(i + n) % n], Zr = (v) => Z(v / 10);
  let cx = G(pts[0][0]), cy = G(pts[0][1]), d = `M${Zr(cx)} ${Zr(cy)}`;
  for (let i = 0; i < n; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    const ex = G(p2[0]), ey = G(p2[1]);
    d += `c${Zr(G(c1[0]) - cx)} ${Zr(G(c1[1]) - cy)} ${Zr(G(c2[0]) - cx)} ${Zr(G(c2[1]) - cy)} ${Zr(ex - cx)} ${Zr(ey - cy)}`;
    cx = ex; cy = ey;
  }
  return d + "z";
}
function teil(T, name, pts, fill, innen = "", aussen = "", o = {}) {
  const id = T.id("t" + name);
  if (typeof pts === "string") T.def(`<path id="${id}" d="${pts}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  else T.def(`<path id="${id}" d="${glattR(gleich(pts))}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  let k = `<use href="#${id}" fill="${fill}"/>` + (innen ? `<g clip-path="url(#${id}c)">${innen}</g>` : "") + (o.ueber ? `<use href="#${id}" fill="${o.ueber}"/>` : "") + aussen;
  const mb = o.box || [-300, -400, 400, 50];
  /* erst Licht-Filter (sieht die volle Form), DANN die Ausblend-Maske – sonst entstünde am weichen Rand ein heller Lichtsaum */
  /* Runde 3: kern.js T.volumen (stufenlos: Innen-Schatten unten rechts, Innen-Glanz oben links) – deutlicher als Diffuslicht */
  /* Filter je Weichheit nur EINMAL (der Name im Filter-Id wäre sonst je Teil neu) */
  const wv = [1.2, 2.2, 3.6, 6, 10].reduce((b, v) => (Math.abs(v - (o.weich || 4)) < Math.abs(b - (o.weich || 4)) ? v : b), 3.6);
  const f = T.volumen ? T.volumen("v" + String(o.tiefe || 7).replace(".", "") + "_", { weich: wv, tiefe: o.tiefe || 7, umgebung: o.umgebung != null ? o.umgebung : 0.25 }) : "none";
  if (f !== "none") k = `<g filter="${f}">${k}</g>`;
  if (o.einblenden || o.einblendenX || o.blende) {
    /* blende = [xa, ya, xb, yb]: bei A unsichtbar, ab B voll sichtbar (beliebige Richtung) */
    const mid = T.id("tm" + name), [xa, ya, xb, yb] = o.blende || (o.einblendenX ? [o.einblendenX[0], 0, o.einblendenX[1], 0] : [0, o.einblenden[0], 0, o.einblenden[1]]);
    const gr = T.lg("tmg" + name, [[0, "#fff", 0], [1, "#fff", 1]], xa, ya, xb, yb, ' gradientUnits="userSpaceOnUse"');
    T.def(`<mask id="${mid}" maskUnits="userSpaceOnUse" x="${mb[0]}" y="${mb[1]}" width="${mb[2] - mb[0]}" height="${mb[3] - mb[1]}"><rect x="${mb[0]}" y="${mb[1]}" width="${mb[2] - mb[0]}" height="${mb[3] - mb[1]}" fill="${gr}"/></mask>`);
    k = `<g mask="url(#${mid})">${k}</g>`;
  }
  return k;
}
/* Ausblend-Maske (in lokalen Koordinaten): links (x0) unsichtbar → ab x1 voll sichtbar. Für Köpfe, die weich in den Hals übergehen. */
function ausblenden(T, n, x0, x1, box) {
  const id = T.id("m" + n);
  T.def(`<mask id="${id}" maskUnits="userSpaceOnUse" x="${box[0]}" y="${box[1]}" width="${box[2] - box[0]}" height="${box[3] - box[1]}"><rect x="${box[0]}" y="${box[1]}" width="${box[2] - box[0]}" height="${box[3] - box[1]}" fill="${T.lg("mv" + n, [[0, "#fff", 0], [1, "#fff", 1]], x0, 0, x1, 0, ' gradientUnits="userSpaceOnUse"')}"/></mask>`);
  return `url(#${id})`;
}
/* zarte Linie (Muskel, Falte) */
const zart = (T, pts, farbe, w, op) => T.linie(pts, farbe, w, ` stroke-opacity="${op}"`);
/* Punkt in Vieleck? */
function inPoly(x, y, p) {
  let ja = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const xi = p[i][0], yi = p[i][1], xj = p[j][0], yj = p[j][1];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) ja = !ja;
  }
  return ja;
}
/* Gleichmäßig gestreute Punkte in einem Vieleck (gezittertes Raster – keine Klumpen, keine Löcher) */
function streuPunkte(T, pts, n) {
  if (n <= 0) return [];
  const [x0, y0, x1, y1] = T.box(pts), A = Math.abs(flaeche(pts)) / 2, c = Math.sqrt(A / n), out = [];
  for (let y = y0; y < y1; y += c) for (let x = x0; x < x1; x += c) {
    const px = x + T.rnd() * c, py = y + T.rnd() * c;
    if (inPoly(px, py, pts)) out.push([px, py]);
  }
  return out;
}
/* Haare in einer Fläche: Wuchsrichtung winkel (Grad: 0 rechts, 90 unten, 180 links; Zahl oder f(x, y)),
   farben [[farbe, anteil, breite, deckkraft], …] → je Farbe EIN Pfad; leicht gebogen. In Szenen (T.fein = false) ein Drittel. */
function haare(T, pts, n, winkel, len, farben, streu = 16, krumm = 0.22) {
  const [x0, y0, x1, y1] = T.box(pts), wf = typeof winkel === "function" ? winkel : () => winkel;
  const ziel = Math.round(n * (T.dichte || 1) * (T.fein === false ? 0.08 : 1));
  if (T.fein === false && ziel < 16) return "";
  const eimer = farben.map(() => ""), sum = farben.reduce((q, f) => q + f[1], 0);
  for (const [x, y] of streuPunkte(T, pts, ziel)) {
    const a = (wf(x, y) + (T.rnd() - 0.5) * streu) * Math.PI / 180, L = len * (0.55 + T.rnd() * 0.9);
    const ex = Math.cos(a) * L, ey = Math.sin(a) * L, k = krumm * L * (T.rnd() - 0.5) * 2;
    let u = T.rnd() * sum, i = 0;
    while (i < farben.length - 1 && u > farben[i][1]) { u -= farben[i][1]; i++; }
    eimer[i] += L < 1.6 ? `M${G(x)} ${G(y)}l${G(ex)} ${G(ey)}` : `M${G(x)} ${G(y)}q${G(ex / 2 - Math.sin(a) * k)} ${G(ey / 2 + Math.cos(a) * k)} ${G(ex)} ${G(ey)}`;
  }
  return eimer.map((d, i) => (d ? fein10(d, `fill="none" stroke="${farben[i][0]}" stroke-width="${R(farben[i][2] * 10)}" stroke-opacity="${farben[i][3]}" stroke-linecap="round"`) : "")).join("");
}
/* Fellsträhnen (Locken/Büschel wie in der naturkundlichen Malerei): spitz zulaufende Flächen in Wuchsrichtung,
   je Strähne ein Schatten (unten versetzt) und ein Lichtsaum (oben) → plastisches, büscheliges Fell.
   farben: [schatten, licht] als [farbe, deckkraft]. In Szenen nur ein Zehntel (ab 10 Stück). */
function straehnen(T, pts, n, winkel, len, br, schatten, licht, streu = 10) {
  const [x0, y0, x1, y1] = T.box(pts), wf = typeof winkel === "function" ? winkel : () => winkel;
  const ziel = Math.round(n * (T.dichte || 1) * (T.fein === false ? 0.1 : 1));
  if (ziel < 10) return "";
  let dS = "", dL = "";
  const eine = (x, y, a, L, w, k) => {
    const ex = Math.cos(a) * L, ey = Math.sin(a) * L, nx = -Math.sin(a), ny = Math.cos(a);
    /* Wurzel schmal (0,25 w), bauchig in der Mitte (Kontrollpunkt ±1,6 w), spitz am Ende */
    const bx = nx * w * 0.25, by = ny * w * 0.25, cx = nx * w * 1.6, cy = ny * w * 1.6;
    return `M${G(x + bx)} ${G(y + by)}q${G(ex * 0.4 + cx - bx + nx * k)} ${G(ey * 0.4 + cy - by + ny * k)} ${G(ex - bx)} ${G(ey - by)}q${G(-ex * 0.6 - cx + nx * k)} ${G(-ey * 0.6 - cy + ny * k)} ${G(-ex - bx)} ${G(-ey - by)}z`;
  };
  for (const [x, y] of streuPunkte(T, pts, ziel)) {
    const a = (wf(x, y) + (T.rnd() - 0.5) * streu) * Math.PI / 180, L = len * (0.6 + T.rnd() * 0.8), w = br * (0.7 + T.rnd() * 0.6), k = (T.rnd() - 0.5) * L * 0.25;
    /* Schatten unter der Strähne (nach unten versetzt), heller Kopf oben */
    dS += eine(x, y + w * 0.8, a, L, w, k);
    if (T.rnd() < 0.7) dL += eine(x - Math.cos(a) * L * 0.05, y - w * 0.3, a, L * 0.75, w * 0.5, k);
  }
  return fein10(dS, `fill="${schatten[0]}" fill-opacity="${schatten[1]}"`) + (dL ? fein10(dL, `fill="${licht[0]}" fill-opacity="${licht[1]}"`) : "");
}
/* FELLBÜSCHEL (Kritik Runde 2: „Reiskörner ohne Wuchsrichtung“ → Strähnen in Gruppen mit hellem Kopf und dunkler Kerbe).
   Je Gruppe: dunkle Schattenkerbe unter der Spitze + 3–5 sich verjüngende Strähnen (Wurzel breit, Spitze spitz → Richtung
   lesbar), die zu einer gemeinsamen Spitze zusammenlaufen; Lichtseite (oben) heller. winkel wie bei haare(). */
function bueschel(T, pts, n, winkel, len, br, hell, dunkel, o = {}) {
  const wf = typeof winkel === "function" ? winkel : () => winkel;
  const ziel = Math.round(n * (T.dichte || 1) * (T.fein === false ? 0.12 : 1));
  if (ziel < 6) return "";
  let dH = "", dD = "";
  /* relativ in Zehntel-cm: M x y q c e q c' b' z – kurz */
  const spitz = (bx, by, cx, cy, ex, ey, wx, wy) => {
    const X = G(bx - wx), Y = G(by - wy);
    return `M${X} ${Y}q${G(cx - wx * 0.5) - X} ${G(cy - wy * 0.5) - Y} ${G(ex) - X} ${G(ey) - Y}q${G(cx + wx * 0.5) - G(ex)} ${G(cy + wy * 0.5) - G(ey)} ${G(bx + wx) - G(ex)} ${G(by + wy) - G(ey)}z`;
  };
  for (const [x, y] of streuPunkte(T, pts, ziel)) {
    const a = (wf(x, y) + (T.rnd() - 0.5) * (o.streu || 12)) * Math.PI / 180, L = len * (0.7 + T.rnd() * 0.6), w = br * (0.7 + T.rnd() * 0.6);
    const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux, s = ny >= 0 ? 1 : -1, mx = nx * s, my = ny * s, kr = (T.rnd() - 0.5) * L * 0.16;
    const tx = x + ux * L + mx * kr, ty = y + uy * L + my * kr;
    /* Schattenkerbe: schmale dunkle Strähne knapp unter der Gruppe, etwas kürzer */
    dD += spitz(x + mx * w * 1.3 + ux * L * 0.15, y + my * w * 1.3 + uy * L * 0.15, x + ux * L * 0.6 + mx * w * 1.2, y + uy * L * 0.6 + my * w * 1.2, tx + mx * w * 0.6 - ux * L * 0.05, ty + my * w * 0.6 - uy * L * 0.05, mx * w * 0.5, my * w * 0.5);
    /* 2–3 helle Strähnen, die zur gemeinsamen Spitze zusammenlaufen */
    const m = o.straehnen || (T.rnd() < 0.3 ? 2 : 1);
    for (let j = 0; j < m; j++) {
      const off = m > 1 ? (j / (m - 1) - 0.5) * w * 1.4 : 0, bx = x + mx * off, by = y + my * off;
      const ex = tx + (T.rnd() - 0.5) * w * 0.6, ey = ty + (T.rnd() - 0.5) * w * 0.6;
      const ww = m > 1 ? 0.3 : 0.55;
      dH += spitz(bx, by, (bx + ex) / 2 + mx * kr * 0.4, (by + ey) / 2 + my * kr * 0.4, ex, ey, mx * w * ww, my * w * ww);
    }
  }
  return fein10(dD, `fill="${dunkel[0]}" fill-opacity="${dunkel[1]}"`) + fein10(dH, `fill="${hell[0]}" fill-opacity="${hell[1]}"`);
}
/* NASE (Kritik: „Ball/Ei“): Oberkante = Profil des Nasenrückens (bündig), schräge Vorderfläche, leicht überhängend, flacher als
   hoch; Nasenloch als Komma vorn seitlich mit Schlitz nach hinten und hellem Rand; Glanz als schmaler Streifen oben vorn.
   top = [x, y] Beginn der Oberkante am Rücken, L = Länge, H = Höhe, k = Neigung des Nasenrückens (dy/dx) */
function nase2(T, x, y, L, H, k = 0.3) {
  const P = (u, v) => `${R(x + u * L)} ${R(y + k * u * L + v * H)}`;
  const d = `M${P(0, 0)}L${P(0.82, 0)}Q${P(1.02, 0.02)} ${P(1.02, 0.35)}L${P(0.98, 0.78)}Q${P(0.96, 1)} ${P(0.78, 1)}Q${P(0.5, 1.08)} ${P(0.3, 0.86)}Q${P(0.05, 0.62)} ${P(0, 0)}Z`;
  let s = `<path d="${d}" fill="${T.lg("nase2", [[0, "#4a423c"], [0.35, "#26201c"], [1, "#0d0b0a"]])}"/>`;
  if (T.fein !== false && T.relief) s = `<g filter="${T.relief("nase", { f: 3.2 / Math.max(0.6, H), tiefe: 0.3, okt: 1 })}">${s}</g>`;
  s += `<path d="M${P(0.93, 0.42)}Q${P(0.7, 0.3)} ${P(0.62, 0.6)}Q${P(0.66, 0.78)} ${P(0.86, 0.72)}Q${P(0.7, 0.66)} ${P(0.74, 0.52)}Z" fill="#000"/>`;
  s += `<path d="M${P(0.62, 0.6)}Q${P(0.5, 0.66)} ${P(0.42, 0.62)}" stroke="#000" stroke-width="${R(H * 0.07)}" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M${P(0.66, 0.8)}Q${P(0.82, 0.86)} ${P(0.9, 0.74)}" stroke="#6a625c" stroke-width="${R(H * 0.05)}" fill="none" stroke-opacity=".7"/>`;
  s += `<path d="M${P(0.3, 0.1)}L${P(0.85, 0.08)}" stroke="#fff" stroke-width="${R(H * 0.08)}" stroke-opacity=".45" stroke-linecap="round"/>`;
  return s;
}
/* Randhaare in BÜSCHELN entlang einer Kurve: je Büschel 3–4 Haare aus fast einer Wurzel, leicht gefächert, verschieden lang.
   (dx, dy) = Wuchsrichtung und Länge; sie soll 20–30° zur Kontur nach hinten liegen, nicht senkrecht abstehen. */
function fellKante(T, pts, n, dx, dy, farbe, w, op) {
  let d = "";
  const z = Math.round(n * (T.dichte || 1) * (T.fein === false ? 0.15 : 1) / 3.2);
  if (T.fein === false && z < 3) return "";
  const L0 = Math.hypot(dx, dy), a0 = Math.atan2(dy, dx);
  for (let i = 0; i < z; i++) {
    const t = (i + 0.2 + T.rnd() * 0.6) / z * (pts.length - 1), k = Math.min(pts.length - 2, Math.floor(t)), f = t - k;
    const x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f;
    const m = 3 + (T.rnd() < 0.3 ? 1 : 0), fach = (T.rnd() - 0.5) * 0.3;
    for (let j = 0; j < m; j++) {
      const a = a0 + fach + (j - (m - 1) / 2) * 0.14 + (T.rnd() - 0.5) * 0.08, L = L0 * (0.55 + T.rnd() * 0.75);
      const ex = Math.cos(a) * L, ey = Math.sin(a) * L, kr = (T.rnd() - 0.3) * L * 0.18, wx = x + (T.rnd() - 0.5) * L0 * 0.12, wy = y + (T.rnd() - 0.5) * L0 * 0.12;
      d += `M${G(wx)} ${G(wy)}q${G(ex * 0.5 - Math.sin(a) * kr)} ${G(ey * 0.5 + Math.cos(a) * kr)} ${G(ex)} ${G(ey)}`;
    }
  }
  return fein10(d, `stroke="${farbe}" stroke-width="${R(w * 10)}" stroke-opacity="${op}" fill="none" stroke-linecap="round"`);
}
/* Fell-Grundstruktur (nur fein): zwei Rauschlagen (dunkle Furchen + helle Spitzen) gestreckt in Wuchsrichtung.
   richtung = Wuchsrichtung in Grad (0 rechts, 90 unten, 180 links) */
function fellGrund(T, d, n, dunkel, hell, richtung, box, st = 1, ohne = "") {
  /* Kritik Runde 1: Rauschen wirkt wie Holzmaserung/Sandpapier → abgeschaltet; die Struktur tragen Strähnen und Haare */
  if (!fellGrund.an || T.fein === false || !T.rauschen) return "";
  /* EINE Klammer für beide Lagen – spart die doppelte Pfadkopie. ohne = ausgesparter Bereich (Maske), z. B. der Rumpf über
     den Läufen: so liegt nie doppelte Struktur übereinander (kein dunkles Band am Bauch). */
  const f1 = T.rauschen(n, { fx: 1.4, fy: 0.1, farbe: dunkel, staerke: 2.6, schwelle: 0.55, okt: 2 });
  const f2 = T.rauschen(n + "h", { fx: 1.6, fy: 0.12, farbe: hell, staerke: 2.6, schwelle: 0.55, okt: 2 });
  const cid = T.id("fg" + n);
  if (ohne) T.def(`<mask id="${cid}" maskUnits="userSpaceOnUse" x="${box[0]}" y="${box[1]}" width="${box[2] - box[0]}" height="${box[3] - box[1]}"><path d="${d}" fill="#fff"/><path d="${ohne}" fill="#000"/></mask>`);
  else T.def(`<clipPath id="${cid}"><path d="${d}"/></clipPath>`);
  const cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2, Rr = Math.hypot(box[2] - box[0], box[3] - box[1]) / 2 + 2;
  const rect = (f, op) => `<rect x="${R(cx - Rr)}" y="${R(cy - Rr)}" width="${R(2 * Rr)}" height="${R(2 * Rr)}" filter="${f}" opacity="${R(op * 100) / 100}"/>`;
  return `<g ${ohne ? "mask" : "clip-path"}="url(#${cid})"><g transform="rotate(${R(richtung - 90)} ${R(cx)} ${R(cy)})">${rect(f1, 0.34 * st)}${rect(f2, 0.18 * st)}</g></g>`;
}
/* EIN Licht oben links: heller Rückensaum, Kernschatten-Band im unteren Rumpfdrittel (−30 %), Bodenreflex ganz unten (+6 %).
   pts = Rumpf ohne Kopf, yo = Rückenlinie, yu = Bauchlinie (cm) */
const licht = (T, n, yo, yu) => {
  const h = yu - yo;
  /* Kernschatten-Band im unteren Rumpfdrittel, an der Bauchkante etwas Reflexlicht (weniger Schatten),
     darunter Schlagschatten des Rumpfs auf die Läufe, nach unten auslaufend. Über yo nichts (Kopf bleibt frei). */
  return hoehenVerlauf(T, "licht" + n, yo, yu + h * 0.45, [[yo + h * 0.45, "#000", 0], [yo + h * 0.72, "#000", 0.26], [yo + h * 0.88, "#000", 0.3],
    [yu - h * 0.02, "#000", 0.16], [yu + h * 0.03, "#000", 0.24], [yu + h * 0.2, "#000", 0.08], [yu + h * 0.45, "#000", 0]]);
};
/* (licht liefert den Verlauf; silhouette legt ihn als letzte Lage über Fell und Haare – kein zweiter Pfad nötig) */
/* Augenhöhle: Brauenwulst wirft weichen Schatten auf das obere Drittel des Auges, darunter Wangenlicht */
const augenhoehle = (T, x, y, r, dreh = -10) => fleck(T, "", x, y - r * 0.55, r * 2.2, r * 1.2, "#000", 0.4, dreh) + fleck(T, "", x - r * 0.4, y + r * 1.5, r * 2, r * 0.9, "#fff", 0.2, dreh);
/* Fellstruktur (nur fein): Rauschen in Wuchsrichtung, von der Form geklippt */
const struktur = (T, d, n, farbe, winkel, op, box, fx = 0.9, fy = 0.09) =>
  (false && T.fein !== false && T.textur ? T.textur(d, T.rauschen(n, { fx, fy, farbe, staerke: 2.6, schwelle: 0.55, okt: 2 }), winkel, op, box) : "");
/* Schwanz/Rute aus Achse + Breiten (halbe Breite je Achspunkt), Spitze als Haarpinsel (mehrere harte Spitzen) */
function rute(achse, breiten, pinsel = 0) {
  const ob = [], un = [];
  achse.forEach((p, i) => {
    const a = achse[Math.max(0, i - 1)], b = achse[Math.min(achse.length - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    ob.push([p[0] + dy * breiten[i], p[1] - dx * breiten[i]]); un.push([p[0] - dy * breiten[i], p[1] + dx * breiten[i]]);
  });
  const e = achse[achse.length - 1], v = achse[achse.length - 2];
  let dx = e[0] - v[0], dy = e[1] - v[1]; const l = Math.hypot(dx, dy); dx /= l; dy /= l;
  const spitze = [];
  if (pinsel) for (let k = -2; k <= 2; k++) {
    const t = k / 2.5, w = breiten[breiten.length - 1];
    spitze.push([e[0] + dx * pinsel * (1 - Math.abs(t) * 0.5) + dy * w * t, e[1] + dy * pinsel * (1 - Math.abs(t) * 0.5) - dx * w * t, 1]);
    if (k < 2) spitze.push([e[0] + dx * pinsel * 0.55 + dy * w * (t + 0.2), e[1] + dy * pinsel * 0.55 - dx * w * (t + 0.2)]);
  }
  else spitze.push([e[0] + dx * breiten[breiten.length - 1] * 1.5, e[1] + dy * breiten[breiten.length - 1] * 1.5]);
  return { pts: ob.concat(spitze, un.reverse()), ob, un };
}
/* ---------- AUGE (eigenes, nach Kritik Runde 1) ----------
   Seitenansicht, Blick nach rechts: Innenwinkel mit Karunkel VORN UNTEN, Außenwinkel HINTEN OBEN (winkel > 0 hebt ihn).
   Iris füllt die Lidspalte fast ganz, dunkler Limbus, Pupille (rund | schlitz | oval; Schlitz bleibt senkrecht zum Boden),
   Lidschatten im oberen Irisdrittel, Glanzlicht oben links (Licht von links oben) + schwacher Unterreflex,
   schwarzer Lidrand mit Lidstrich am Außenwinkel, feuchter Unterlidsaum, Wimpern oben (außen länger), wenige unten.
   o: { iris, iris2, offen, winkel, pupille, wimpern, wimpernFarbe, lidstrich (× rr), haut (dunkler Hof, Deckkraft), rand (Lidrandfarbe) } */
function augeTier(T, x, y, rr, o = {}) {
  const off = o.offen != null ? o.offen : 0.62, W = rr * 1.3, Ho = rr * off * 1.15, Hu = rr * off * 0.9;
  const iris = o.iris || "#c88a24", iris2 = o.iris2 || "#6a3e0e", wk = o.winkel || 0, fein = T.fein !== false;
  T._ag = (T._ag || 0) + 1;
  const id = T.id("ag" + T._ag), Q = (v) => R(v * 100) / 100;
  const spalt = `M${Q(-W)} 0C${Q(-W * 0.45)} ${Q(-Ho * 1.3)} ${Q(W * 0.45)} ${Q(-Ho * 1.25)} ${Q(W)} ${Q(Hu * 0.2)}C${Q(W * 0.5)} ${Q(Hu * 1.2)} ${Q(-W * 0.5)} ${Q(Hu * 1.05)} ${Q(-W)} 0Z`;
  T.def(`<clipPath id="${id}"><path d="${spalt}"/></clipPath>`);
  const g = T.rg("aiv" + iris.slice(1), [[0, iris], [0.5, iris], [0.82, iris2], [1, "#120a04"]], 0.5, 0.5, 0.5);
  let s = `<g transform="translate(${Q(x)} ${Q(y)}) rotate(${Q(wk)})">`;
  if (o.haut) s += `<ellipse cx="0" cy="${Q(rr * 0.05)}" rx="${Q(W * 1.5)}" ry="${Q(rr * 1.15)}" fill="${T.rg("ahaut", [[0, "#000", 0.9], [0.6, "#000", 0.5], [1, "#000", 0]])}" opacity="${o.haut}"/>`;
  s += `<path d="${spalt}" fill="#1a0f06"/><g clip-path="url(#${id})">`;
  s += `<circle cx="${Q(rr * 0.06)}" cy="${Q(rr * 0.04)}" r="${Q(rr * 0.98)}" fill="${g}"/>`;
  if (fein) {
    let fa = "";
    for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2; fa += `M${Q(rr * 0.06 + Math.cos(a) * rr * 0.42)} ${Q(rr * 0.04 + Math.sin(a) * rr * 0.42)}L${Q(rr * 0.06 + Math.cos(a + 0.12) * rr * 0.85)} ${Q(rr * 0.04 + Math.sin(a + 0.12) * rr * 0.85)}`; }
    s += `<path d="${fa}" stroke="${iris2}" stroke-width="${Q(rr * 0.035)}" stroke-opacity=".5" fill="none"/>`;
  }
  s += `<circle cx="${Q(rr * 0.06)}" cy="${Q(rr * 0.04)}" r="${Q(rr * 0.93)}" fill="none" stroke="#0d0703" stroke-width="${Q(rr * 0.12)}" stroke-opacity=".75"/>`;
  const p = o.pupille || "rund", pg = `transform="rotate(${Q(-wk)} ${Q(rr * 0.08)} ${Q(rr * 0.04)})"`;
  if (p === "rund") s += `<circle cx="${Q(rr * 0.08)}" cy="${Q(rr * 0.04)}" r="${Q(rr * 0.4)}" fill="#040201"/>`;
  if (p === "oval") s += `<ellipse cx="${Q(rr * 0.08)}" cy="${Q(rr * 0.04)}" rx="${Q(rr * 0.24)}" ry="${Q(rr * 0.5)}" fill="#040201" ${pg}/>`;
  if (p === "schlitz") s += `<ellipse cx="${Q(rr * 0.08)}" cy="${Q(rr * 0.04)}" rx="${Q(rr * 0.11)}" ry="${Q(rr * 0.78)}" fill="#040201" ${pg}/>`;
  s += `<rect x="${Q(-W)}" y="${Q(-rr * 1.3)}" width="${Q(2 * W)}" height="${Q(rr * 1.3)}" fill="${T.lg("alid", [[0, "#000", 0.8], [0.62, "#000", 0.35], [1, "#000", 0]])}"/>`;
  s += `<ellipse cx="${Q(-rr * 0.22)}" cy="${Q(-rr * 0.3)}" rx="${Q(rr * 0.22)}" ry="${Q(rr * 0.16)}" fill="#fff" opacity=".9" transform="rotate(${Q(-wk - 20)} ${Q(-rr * 0.22)} ${Q(-rr * 0.3)})"/>`;
  s += `<ellipse cx="${Q(rr * 0.42)}" cy="${Q(rr * 0.42)}" rx="${Q(rr * 0.2)}" ry="${Q(rr * 0.07)}" fill="#fff" opacity=".35"/></g>`;
  /* Karunkel vorn unten */
  s += `<path d="M${Q(W * 1.02)} ${Q(Hu * 0.2)}q${Q(-W * 0.18)} ${Q(-Hu * 0.32)} ${Q(-W * 0.3)} ${Q(Hu * 0.18)}q${Q(W * 0.16)} ${Q(Hu * 0.2)} ${Q(W * 0.3)} ${Q(-Hu * 0.18)}z" fill="#7a3a34" opacity=".85"/>`;
  /* Lidrand oben kräftig, unten fein, Lidstrich hinten */
  const rd = o.rand || "#0a0604", ls = (o.lidstrich != null ? o.lidstrich : 0.5) * rr;
  s += `<path d="M${Q(-W)} 0C${Q(-W * 0.45)} ${Q(-Ho * 1.3)} ${Q(W * 0.45)} ${Q(-Ho * 1.25)} ${Q(W)} ${Q(Hu * 0.2)}" fill="none" stroke="${rd}" stroke-width="${Q(rr * 0.24)}" stroke-linecap="round"/>`;
  s += `<path d="M${Q(W)} ${Q(Hu * 0.2)}C${Q(W * 0.5)} ${Q(Hu * 1.2)} ${Q(-W * 0.5)} ${Q(Hu * 1.05)} ${Q(-W)} 0" fill="none" stroke="${rd}" stroke-width="${Q(rr * 0.14)}"/>`;
  if (ls > 0) s += `<path d="M${Q(-W + rr * 0.1)} ${Q(-rr * 0.1)}L${Q(-W - ls)} ${Q(-ls * 0.32)}L${Q(-W + rr * 0.15)} ${Q(rr * 0.12)}z" fill="${rd}"/>`;
  s += `<path d="M${Q(W * 0.7)} ${Q(Hu * 0.72)}C${Q(W * 0.25)} ${Q(Hu * 1.02)} ${Q(-W * 0.35)} ${Q(Hu * 0.95)} ${Q(-W * 0.75)} ${Q(Hu * 0.35)}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="${Q(rr * 0.05)}"/>`;
  const nw = o.wimpern || 0;
  if (nw && fein) {
    let d = "";
    const L = rr * 0.42;
    for (let i = 0; i < nw; i++) {
      const t = 0.08 + 0.84 * i / Math.max(1, nw - 1), u = 1 - t;
      const bx = u * u * u * -W + 3 * u * u * t * -W * 0.45 + 3 * u * t * t * W * 0.45 + t * t * t * W;
      const by = 3 * u * u * t * -Ho * 1.3 + 3 * u * t * t * -Ho * 1.25 + t * t * t * Hu * 0.2;
      const Ll = L * (1.25 - 0.7 * t), a = -Math.PI / 2 - 0.9 + 0.5 * t;
      d += `M${Q(bx)} ${Q(by)}q${Q(Math.cos(a) * Ll * 0.4)} ${Q(Math.sin(a) * Ll * 0.6)} ${Q(Math.cos(a - 0.5) * Ll)} ${Q(Math.sin(a - 0.5) * Ll * 0.85)}`;
    }
    for (let i = 0; i < 3; i++) { const t = 0.25 + i * 0.22, bx = -W + 2 * W * t; d += `M${Q(bx)} ${Q(Hu * 0.95)}l${Q(-rr * 0.08)} ${Q(rr * 0.14)}`; }
    s += `<path d="${d}" fill="none" stroke="${o.wimpernFarbe || "#120a05"}" stroke-width="${Q(rr * 0.045)}" stroke-linecap="round"/>`;
  }
  return s + `</g>`;
}
/* ---------- PFOTE (Zehengänger, nach Kritik Runde 1) ----------
   Umriss mit drei sichtbaren Zehenwölbungen; Details: Zehenfugen, getrennte Ballen nur als feiner dunkler Streifen am Boden
   (keine Sohlenbalken), kurze dicke stumpfe Krallen schräg zum Boden mit Glanzgrat, Fellbüschel über den Zehen. */
const pfoteZ = (x, L = 10, H = 4.5) => [[x - L * 0.25, -H * 0.62], [x - L * 0.22, -H * 0.18], [x - L * 0.1, 0, 1], [x + L * 0.64, 0, 1],
  [x + L * 0.75, -H * 0.24], [x + L * 0.71, -H * 0.62], [x + L * 0.6, -H * 0.72], [x + L * 0.5, -H * 0.64], [x + L * 0.4, -H * 0.9], [x + L * 0.28, -H * 0.86],
  [x + L * 0.18, -H * 1.02], [x + L * 0.1, -H * 1.16]];
function pfote2(T, x, L = 10, H = 4.5, o = {}) {
  const op = o.op || 1, kr = o.kralle || "#1d1813", fein = T.fein !== false, Q = (v) => R(v * 100) / 100, P = (a, b) => `${Q(x + L * a)} ${Q(-H * b)}`;
  /* Krallen: Wurzel dick, kurz, stumpf, schräg nach vorn unten zum Boden */
  const kralle = (a, b, s) => `M${P(a, b)}q${Q(L * 0.06 * s)} ${Q(H * 0.02)} ${Q(L * 0.085 * s)} ${Q(H * 0.24 * s)}l${Q(-L * 0.035 * s)} ${Q(H * 0.03)}q${Q(-L * 0.02 * s)} ${Q(-H * 0.12 * s)} ${Q(-L * 0.06 * s)} ${Q(-H * 0.2 * s)}z`;
  let s = `<path d="${kralle(0.69, 0.36, 1)}${kralle(0.47, 0.3, 0.85)}${o.dreiKrallen ? kralle(0.25, 0.28, 0.7) : ""}" fill="${kr}" fill-opacity="${op}"/>`;
  if (!fein) return s;
  s += `<path d="M${P(0.5, 0.64)}q${Q(-L * 0.04)} ${Q(H * 0.3)} ${Q(-L * 0.01)} ${Q(H * 0.58)}M${P(0.28, 0.86)}q${Q(-L * 0.04)} ${Q(H * 0.4)} ${Q(-L * 0.01)} ${Q(H * 0.78)}" stroke="#20160d" stroke-width="${Q(L * 0.022)}" fill="none" stroke-opacity="${Q(0.5 * op)}"/>`;
  s += `<path d="M${P(0.53, 0.02)}L${P(0.66, 0.02)}M${P(0.31, 0.02)}L${P(0.46, 0.02)}M${P(-0.06, 0.02)}L${P(0.22, 0.02)}" stroke="#120c07" stroke-width="${Q(H * 0.06)}" stroke-opacity="${Q(0.55 * op)}" stroke-linecap="round"/>`;
  s += `<path d="M${P(0.72, 0.33)}q${Q(L * 0.04)} ${Q(H * 0.02)} ${Q(L * 0.06)} ${Q(H * 0.16)}" stroke="#fff" stroke-width="${Q(L * 0.012)}" fill="none" stroke-opacity="${Q(0.5 * op)}"/>`;
  /* Licht auf jeder Zehenwölbung (trennt die Zehen, auch bei dunklem Fell) */
  s += `<path d="M${P(0.53, 0.6)}Q${P(0.61, 0.8)} ${P(0.71, 0.58)}M${P(0.31, 0.8)}Q${P(0.39, 1)} ${P(0.49, 0.78)}M${P(0.11, 0.98)}Q${P(0.18, 1.16)} ${P(0.27, 0.96)}" stroke="${o.licht || "#fff"}" stroke-width="${Q(L * 0.03)}" fill="none" stroke-opacity="${Q(0.35 * op)}" stroke-linecap="round"/>`;
  if (o.fell) s += fellKante(T, [[x + L * 0.12, -H * 1.1], [x + L * 0.38, -H * 0.92], [x + L * 0.62, -H * 0.72]], 14, L * 0.09, H * 0.28, o.fell, L * 0.012, 0.6 * op);
  if (o.afterkralle) s += `<path d="M${Q(o.afterkralle[0])} ${Q(o.afterkralle[1])}q${Q(-L * 0.06)} ${Q(H * 0.05)} ${Q(-L * 0.05)} ${Q(H * 0.25)}q${Q(L * 0.04)} ${Q(-H * 0.05)} ${Q(L * 0.06)} ${Q(-H * 0.1)}z" fill="${kr}" fill-opacity="${Q(0.8 * op)}"/>`;
  return s;
}
/* Krallen: kleine dunkle Bögen an den Zehen */
function krallen(x, y, n, abst, len, farbe = "#1d1712", w = 0.7) {
  let d = "";
  for (let i = 0; i < n; i++) { const xx = x + i * abst; d += `M${R(xx)} ${R(y)}q${R(len * 0.7)} ${R(len * 0.1)} ${R(len)} ${R(len * 0.55)}`; }
  return `<path d="${d}" stroke="${farbe}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
}

/* =====================================================================
   WOLF
   ===================================================================== */
/* RECHERCHE Wolf (Grauwolf, Canis lupus): Schulterhöhe 80–85 cm, Kopf-Rumpf 105–160 cm,
   Schwanz 29–50 cm (buschig, hängt gerade herab bis etwa zum Sprunggelenk, dunkle Spitze und
   dunkler Fleck der Violdrüse oben nahe der Wurzel). Schlank, tiefer kielförmiger Brustkorb,
   schmale Brust, lange Beine (länger als bei anderen Hundeartigen), große Pfoten (≈ 10 cm),
   Zehengänger; Beine fast genau unter der Körpermitte. Ohren 9–11 cm, aufrecht, an der Spitze
   gerundet. Fell: grau-meliert mit dunklem „Sattel“ über Schultern und Rücken (schwarze
   Grannenspitzen), Beine/Flanken lohfarben-ockerbraun, Bauch, Kehle, Wangen und Lippenpartie
   cremeweiß („helle Maske“), Stirn dunkler, helle Flecken über den Augen, Augen bernsteingelb,
   schräg mandelförmig, schwarze Lippen und Nase. Nackenkragen (Mähne) und Wangenbart. */
function wolf(T) {
  /* Runde 3 (Kritik R2): Rumpf-Umriss enthält Hals, Widerrist-Kuppe, Vorbrust, Oberarm bis zum Ellbogen und Oberschenkel bis
     zum Unterschenkel – die Läufe liegen DARUNTER (keine Platten, keine Nähte). Ferne Läufe: Hüfte/Schulter hinter dem Rumpf,
     sichtbar erst ab Knie/Ellbogen, halber Schritt versetzt. Fell als Büschel (heller Kopf, dunkle Kerbe) in Wuchsrichtung.
     Widerristhöhe 82 cm; Kopf ≈ 30 cm (≈ 37 %); Brust 44 %, Lauf 56 %; Sprunggelenk 26 %, Handwurzel 19 %. */
  T.dichte = 0.52;
  const rumpf = [
    [38, -72], [44, -76.4], [52, -77.8], [64, -77.2], [78, -77.4], [92, -79.4], [103, -82], [109, -82.8], [115, -82.2],   // Kruppe, Rücken, Widerrist-Kuppe
    [121, -82.6], [127, -84.6], [133, -87.6], [139, -86], [143, -78], [142.4, -71.4],                                    // Nackensenke, Nacken → unter den Kopf
    [138.6, -66.4], [134.6, -60], [131.4, -54], [130, -49.4], [128.2, -45.6], [125.4, -42.4], [122.6, -38.8],             // konkave Kehle, Vorbrust, Oberarm
    [116, -39.6], [111, -43], [104, -45.8], [94, -47.2], [84, -49.8], [75, -54.4], [67.6, -57.6],                         // Ellbogen, Brust (44 %), Bauch aufgezogen
    [63.6, -53.6], [62.4, -47.6], [60, -41.6], [55.4, -36], [51, -31.6], [46, -30.4], [41.6, -32],                       // Kniefalte, Knie, Unterschenkel läuft aus
    [38.6, -38.4], [35.6, -48.4], [34.2, -57], [34.8, -65.4],                                                            // Hinterbacke, Sitzbeinecke
  ];
  const kopf = [[128, -82], [129.4, -84.4], [133, -87], [135.4, -89.4], [138.4, -91.6], [142.6, -92.8], [147, -92], [150.4, -90], [152.8, -87.4, 1], [156, -86.2], [160, -84.8], [163.4, -83.7],
    [165.2, -82.4], [165.2, -80.4], [163.8, -79.2], [162.8, -78.4], [162.2, -77.4, 1], [160, -76.6], [155, -75.9], [150, -75.2], [145.6, -74], [141, -73.4], [136, -74.6], [131, -76.6]];
  /* nahe Läufe (unter dem Rumpf): Vorderlauf mit Handwurzel + Karpalballen, Vordermittelfuß ≈ 12° vorgeneigt */
  const vbN = [[111, -44], [108.8, -36.4], [109.6, -28], [110.2, -21.4], [109.6, -18.6], [110.6, -15.8], [111.4, -11], [112.6, -6.6]]
    .concat(pfoteZ(115.8, 11, 4.8), [[117, -8.6], [116.4, -12.8], [116.6, -16.4], [117.2, -19.2], [116.8, -26], [117.6, -33], [120, -40], [121, -45]]);
  /* Hinterlauf: Unterschenkel, Sprunggelenk-Spitze (26 % = 21 cm), sehniger Hinterrand, senkrechter Mittelfuß */
  const hbN = [[42, -37], [39.6, -31], [38.8, -25.6], [38, -21.4, 1], [39.6, -17.4], [40.6, -12], [41, -6.8]]
    .concat(pfoteZ(43.8, 10.4, 4.6), [[46.2, -7.2], [46.2, -13], [45.8, -18.4], [45.4, -22.2], [48.4, -27.6], [53.2, -33.4], [58, -38.6], [60, -42]]);
  const versetzt = (p, dx) => p.map((q) => [q[0] + dx, q[1], q[2]]);
  const vbF = versetzt(vbN, -12.6);
  /* ferner Hinterlauf: halber Schritt vor dem nahen, Oberteil endet UNTER dem Rumpf (kein Keil aus dem Bauch) */
  const hbF = versetzt([[42, -37], [39.6, -31], [38.8, -25.6], [38, -21.4, 1], [39.6, -17.4], [40.6, -12], [41, -6.8]]
    .concat(pfoteZ(43.8, 10.4, 4.6), [[46.2, -7.2], [46.2, -13], [45.8, -18.4], [45.4, -22.2], [48, -27], [51, -31], [52, -36], [48, -39]]), 8);

  const fell = hoehenVerlauf(T, "fell", -96, 0, [[-96, "#6c665e"], [-80, "#827a6e"], [-66, "#988a74"], [-54, "#a6906c"], [-46, "#b79a6a"], [-30, "#c19d6a"], [-12, "#b88f5d"], [0, "#9a754c"]]);
  const fellF = hoehenVerlauf(T, "fellF", -96, 0, [[-60, "#857760"], [-44, "#8c7658"], [-12, "#7f6648"], [0, "#62503a"]]);
  const grau = [["#16130f", 1, 0.12, 0.55], ["#efe6d6", 0.8, 0.11, 0.55]];
  const lauf = [["#5e4428", 1, 0.1, 0.5], ["#f0e1c2", 0.9, 0.09, 0.55]];
  const hellB = ["#f2e9d8", 0.3], dunkB = ["#1e1914", 0.26];
  /* Wuchsrichtung (Grad, 0 = rechts/vorn, 90 = unten, 180 = hinten) */
  const wuchs = (x, y) => {
    if (x > 126) return 150 - (y + 70) * 0.8;          // Hals: nach hinten unten
    if (x > 104) return 120 + (x - 104) * 0.6;        // Schulter: schräg nach unten
    if (x < 56) return 112 + (x - 40) * 1.2;          // Keule: von der Hüfte strahlend nach hinten unten
    return 172 - (y + 78) * 0.9;                       // Rumpf: nach hinten, unten zur Bauchkante gebogen
  };

  let s = "";
  /* ---- Ohren: breit (Basis ≈ 75 % der Höhe), gerundete Spitze; wachsen aus dem Kopffell (Kopf liegt darüber) ---- */
  const ohrF = [[142, -91], [143.4, -97.4], [145.4, -99.6], [147.4, -98], [148.8, -91.6]];
  s += teil(T, "wohrF", ohrF, T.lg("ohrF", [[0, "#2a241f"], [1, "#5d5244"]]), "", fellKante(T, [[143.4, -97.4], [145.4, -99.4], [147.4, -97.8]], 10, 0.6, -0.4, "#2e2822", 0.1, 0.6), { weich: 1 });
  const ohr = [[134.8, -90], [135.8, -96], [138.2, -100.2], [140.4, -101], [142.6, -98.6], [144.6, -93], [144.4, -89], [137, -88]];
  const sichel = [[141.4, -99.8], [143.2, -96.4], [144.2, -92.4], [142.4, -92.6], [141.2, -96.4]];
  s += teil(T, "wohr", ohr, T.lg("ohr", [[0, "#2e2822"], [0.35, "#6e604f"], [1, "#9c8466"]]),
    T.form(sichel, T.lg("ohrI", [[0, "#ddcdae"], [1, "#8a7a62"]])) + haare(T, sichel, 30, -70, 1.6, [["#f6eedd", 1, 0.09, 0.85]], 20, 0.3) + haare(T, ohr, 40, -82, 1.1, [["#2a241e", 1, 0.1, 0.5], ["#c9b08a", 0.7, 0.1, 0.55]], 14),
    fellKante(T, [[135, -90.6], [135.8, -96], [138.2, -100.2], [140.4, -101]], 14, -0.7, -0.4, "#1e1a16", 0.1, 0.65) + fellKante(T, [[141.2, -100], [143, -96.4], [144.4, -92]], 16, 1.2, -0.4, "#f2e8d4", 0.08, 0.8), { weich: 1.4 });

  /* ---- ferne Läufe: Körperton 15–20 % dunkler und kühler; oben Schlagschatten des Rumpfs ---- */
  const schlag = `<rect x="20" y="-60" width="120" height="60" fill="${hoehenVerlauf(T, "wSchlag", -46, -26, [[-46, "#000", 0.32], [-26, "#000", 0]])}"/>`;
  s += teil(T, "wvbF", vbF, fellF, haare(T, vbF, 40, 94, 1.2, lauf, 8) + schlag, pfote2(T, 103.2, 11, 4.8, { op: 0.8, kralle: "#15110d", fell: "#7a6448", licht: "#d8c4a0" }), { weich: 2 });
  s += teil(T, "whbF", hbF, fellF, haare(T, hbF, 40, (x, y) => (y < -24 ? 112 : 94), 1.3, lauf, 8) + schlag, pfote2(T, 51.8, 10.4, 4.6, { op: 0.8, kralle: "#15110d", fell: "#7a6448", licht: "#d8c4a0" }), { weich: 2 });

  /* ---- Rute: hängt 4° vom Bein weg mit Spalt zur Hinterbacke; größte Breite 13 % (Mitte), Wurzel 70 %; Violdrüse; Haarpinsel ---- */
  const rt = rute([[37.4, -70.4], [32.8, -66.4], [29.6, -60], [27.8, -52], [26.8, -44], [26.4, -36], [26.6, -29.6]], [3.4, 4, 4.7, 5.2, 5.3, 4.6, 3], 0);
  s += teil(T, "wrute", rt.pts, hoehenVerlauf(T, "rute", -74, -24, [[-74, "#766c60"], [-56, "#908471"], [-40, "#7d7262"], [-32, "#3a342d"], [-26, "#161310"]]),
    fleck(T, "!", 32.6, -65.6, 2.8, 2, "#1a1612", 0.7, -40) + bueschel(T, rt.pts, 80, (x, y) => 98 - (y + 50) * 0.5, 4.6, 0.3, ["#efe6d6", 0.4], ["#120f0c", 0.28]) +
    haare(T, rt.pts, 70, (x, y) => 98 - (y + 50) * 0.5, 3.6, [["#1d1915", 1.1, 0.12, 0.55], ["#f3eadb", 0.7, 0.11, 0.5]], 12, 0.3),
    fellKante(T, rt.ob.slice(1), 44, -1.4, 2, "#4a443b", 0.1, 0.6) + fellKante(T, rt.un.slice(2), 30, 0.6, 2, "#3a342d", 0.1, 0.5) +
    fellKante(T, [[22.8, -32], [24.4, -27], [26.6, -25.6], [28.8, -27], [30, -31]], 40, 0.1, 3.6, "#14110e", 0.11, 0.8), { weich: 2.6 });

  /* ---- Rumpf mit Hals, Oberarm und Keule ---- */
  let n = "";
  /* Sattel: Zone dunkler Grannen, oben, ohne Kante (Verlauf, der sich nach unten auflöst) + Schulterstreif */
  n += `<rect x="20" y="-100" width="130" height="60" fill="${hoehenVerlauf(T, "wSattel", -88, -60, [[-88, "#1c1814", 0.62], [-80, "#26201b", 0.42], [-70, "#2e2822", 0.16], [-60, "#2e2822", 0]])}"/>`;
  n += fleck(T, "!", 116, -70, 2.4, 13, "#2a241e", 0.4, -20);
  /* Unterseite creme: Kehle, Vorbrust, Bauch, Innenschenkel */
  n += fleck(T, "!", 102, -47, 14, 3.2, "#ede2ca", 0.75) + fleck(T, "!", 83, -51.4, 10, 2.6, "#ede2ca", 0.55, -22) + fleck(T, "!", 131, -55, 4, 11, "#ede2ca", 0.8, 22) + fleck(T, "!", 138, -69, 4, 5, "#ede2ca", 0.8, 35);
  /* Formschatten nur anatomisch: hinter dem Schulterblatt, Ellbogenkerbe, Flankenfalte vor dem Oberschenkel */
  n += fleck(T, "!", 103, -60, 2.6, 10, "#2a2016", 0.25, 14) + fleck(T, "!", 111, -44.6, 3.4, 1.8, "#2a2016", 0.35) + fleck(T, "!", 66.4, -54, 2.4, 7, "#2a2016", 0.3, -24);
  /* Büschel: graues Deckhaar (heller Kopf, dunkle Kerbe), schwarzgespitzte Grannen im Sattel, lange helle Halskrause */
  n += bueschel(T, rumpf, 200, wuchs, 5.4, 0.3, hellB, dunkB);
  n += haare(T, rumpf.filter((p) => p[1] < -60), 120, wuchs, 4.6, [["#100d0a", 1, 0.12, 0.6]], 10, 0.3);
  n += haare(T, rumpf, 60, wuchs, 4.4, grau, 10, 0.3);
  n += bueschel(T, [[124, -84], [134, -88], [142, -78], [140, -66], [132, -54], [126, -60], [122, -72]], 40, (x, y) => 128 - (y + 70) * 0.4, 6.4, 0.32, ["#f2eadb", 0.45], ["#2a241e", 0.26]);
  s += teil(T, "wrumpf", rumpf, fell, n,
    fellKante(T, [[44, -76.4], [52, -77.8], [64, -77.2], [78, -77.4], [92, -79.4], [103, -82]], 50, -2, -0.3, "#4a433b", 0.09, 0.6) +
    fellKante(T, [[103, -82], [109, -82.8], [115, -82.2], [121, -82.6], [127, -84.6], [133, -87.6]], 50, -3.4, -0.6, "#2a241e", 0.1, 0.65) +
    fellKante(T, [[142.4, -71.4], [138.6, -66.4], [134.6, -60], [131.4, -54], [130, -49.4]], 50, -2.6, 2.6, "#efe4cf", 0.1, 0.85) +
    fellKante(T, [[111, -43], [104, -45.8], [94, -47.2], [84, -49.8], [75, -54.4]], 44, -1.6, 2.2, "#e8dcc2", 0.09, 0.75) +
    fellKante(T, [[42.6, -35.4], [38.4, -40.6], [35.6, -48.4], [34.2, -57]], 30, -2, 1.6, "#d8c8a8", 0.09, 0.7) +
    fellKante(T, [[122.6, -39.4], [116, -40], [112, -42.4]], 14, -1.4, 2.4, "#8a7458", 0.09, 0.6), { weich: 10, ueber: licht(T, "w", -82, -47) });

  /* ---- nahe Läufe: ÜBER dem Rumpf, oben weich ausgeblendet → wachsen ohne Naht aus Brust und Unterschenkel ---- */
  let h = `<rect x="30" y="-40" width="30" height="20" fill="${hoehenVerlauf(T, "wOkkH", -32, -22, [[-32, "#2a2016", 0.3], [-22, "#2a2016", 0]])}"/>` + haare(T, hbN, 90, (x, y) => (y < -24 ? 110 : 94), 1.3, lauf, 8) + fleck(T, "", 39.6, -28, 0.8, 5, "#fff", 0.35, 22) + fleck(T, "", 42.6, -27, 0.8, 4.6, "#000", 0.3, 22);
  s += teil(T, "whbN", hbN, fell, h, fellKante(T, [[42, -36], [39.6, -31], [38.8, -25.6]], 16, -1.4, 1, "#d8c4a0", 0.08, 0.6) +
    pfote2(T, 43.8, 10.4, 4.6, { kralle: "#17120e", fell: "#c9a06a", licht: "#fff2d8" }), { weich: 2.2, ueber: licht(T, "w", -82, -47), einblenden: [-37, -29] });
  /* Vorderlauf: dunkler Strich vorn am Unterarm (Grauwolf), Fahne hinten */
  let v = `<rect x="104" y="-48" width="20" height="20" fill="${hoehenVerlauf(T, "wOkkV", -40, -30, [[-40, "#2a2016", 0.3], [-30, "#2a2016", 0]])}"/>` + haare(T, vbN, 90, 94, 1.2, lauf, 6) + T.form([[116.6, -38], [117.6, -32], [117, -24], [116.4, -19], [115.4, -19.6], [115.6, -26], [115.8, -33]], T.lg("wStrich", [[0, "#2a1d10", 0], [0.3, "#2a1d10", 0.7], [1, "#2a1d10", 0.2]]));
  v += fleck(T, "", 110.4, -17, 1, 1.4, "#000", 0.3);
  s += teil(T, "wvbN", vbN, fell, v, fellKante(T, [[110.4, -40], [108.8, -36.4], [109.4, -30], [110, -24]], 22, -1.6, 1, "#c8ad84", 0.08, 0.6) +
    pfote2(T, 115.8, 11, 4.8, { kralle: "#17120e", fell: "#c9a06a", licht: "#fff2d8", afterkralle: [111.4, -10.6] }), { weich: 2, ueber: licht(T, "w", -82, -47), einblenden: [-44, -36] });

  /* ---- Kopf: breite flache Stirn, Stop (Knick), gerader, sich verjüngender Fang; Wange flach, folgt dem Jochbogen ---- */
  let k = "";
  const stirn = [[134, -88], [138.4, -91.6], [142.6, -92.8], [147, -92], [150.4, -90], [152.8, -87.4], [156, -86.2], [160, -84.8], [163.4, -83.7], [158, -83.6], [150, -86], [142, -86.4], [134, -85]];
  k += T.form(stirn, T.lg("stirn", [[0, "#3a332b", 0.5], [1, "#3a332b", 0]])) + fleck(T, "!", 158, -84.6, 5.6, 1.4, "#a37a48", 0.8, 21);
  /* cremeweiß nur an Oberlippe, Kinn und Wangenrand – mit Haarkante zum Grau */
  k += T.form([[163.6, -79.4], [160, -80.6], [154, -80.4], [149, -79.6], [145, -78], [142, -75.6], [141, -73.6], [145.6, -74], [150, -75.2], [155, -75.9], [160, -76.6], [162.2, -77.4]],
    T.lg("wLippe", [[0, "#f2eadb", 0.6], [0.5, "#f2eadb", 0.95], [1, "#e6dcc6", 0.95]]));
  k += fellKante(T, [[161, -80.8], [155, -80.6], [149, -79.8], [145, -78.2], [142, -75.8]], 40, 0.2, 1.1, "#7a7064", 0.07, 0.55);
  k += haare(T, stirn, 60, (x, y) => (x > 152 ? 198 : 184), 1, [["#1e1a16", 1, 0.09, 0.6], ["#efe6d6", 0.8, 0.09, 0.6], ["#9b7a52", 0.4, 0.09, 0.5]], 12);
  k += haare(T, kopf, 80, (x, y) => (x > 150 ? 190 : 172), 1.3, grau, 12);
  /* Jochbogen: Licht unter dem Auge, Schatten darunter (flache Wange, keine Backe) */
  k += fleck(T, "!", 146, -83.4, 5, 1.1, "#d8cfbc", 0.3, -6) + fleck(T, "", 145, -80.6, 6, 1.4, "#000", 0.15, -6);
  /* Augenhöhle: Brauenschatten, heller Überaugenfleck direkt auf dem Oberlid (mit Haarkante), Strich vom Außenwinkel zum Ohr */
  k += fleck(T, "", 149.4, -89.2, 3, 1.3, "#000", 0.4, 16);
  k += T.form([[146.6, -90.2], [148.4, -91], [150.6, -90.6], [151.6, -89.8], [150, -89.8], [148, -89.8]], "#e6dcc6", ' opacity=".6"') + fellKante(T, [[146.6, -90.4], [148.4, -91.2], [150.6, -90.8]], 12, -0.3, -0.6, "#efe6d2", 0.06, 0.7);
  k += zart(T, [[146.6, -89.4], [144.4, -90.4], [142.4, -91]], "#1a1612", 0.35, 0.6);
  /* Lefze: schwarz, fast waagerecht, endet unter dem vorderen Augenwinkel mit kleinem Bogen nach oben */
  k += zart(T, [[163.2, -78.5], [160, -78.2], [156, -78.1], [152.6, -78.1], [151, -78.4], [150.4, -79]], "#120d0a", 0.34, 0.95);
  let ka = fellKante(T, [[145.6, -74], [141, -73.4], [138, -75.4]], 20, -2.2, 0.9, "#ece2ce", 0.08, 0.8) + fellKante(T, [[135, -88], [134.4, -84], [135.4, -79]], 16, -1.8, 0.4, "#3a332b", 0.08, 0.6);
  ka += nase2(T, 161.6, -84.4, 3.8, 3.4, 0.32);
  ka += augeTier(T, 149.2, -88, 1.24, { iris: "#d6a02e", iris2: "#7a4a12", offen: 0.6, winkel: 17, wimpern: 10, lidstrich: 0.9 });
  if (T.fein !== false) ka += `<path d="M157.4 -79.8h.01M158.8 -80.1h.01M160.2 -80.4h.01M158 -79h.01M159.4 -79.3h.01M160.8 -79.6h.01" stroke="#2a1f17" stroke-width=".35" stroke-linecap="round" opacity=".55"/>`;
  ka += T.schnurrhaare ? T.schnurrhaare(160.2, -79.6, 6, 6, 12, 26, "#231c16", 0.1) : "";
  s += teil(T, "wkopf", kopf, fell, k, ka, { weich: 3.4, einblendenX: [128.5, 139] });
  return { svg: s, box: [21, -101, 165.6, 0], fuesse: [47, 58, 106, 119], kopf: [132, -103, 168, -70] };
}

/* =====================================================================
   FUCHS
   ===================================================================== */
/* RECHERCHE Fuchs (Rotfuchs, Vulpes vulpes): Schulterhöhe 35–50 cm, Kopf-Rumpf 45–90 cm, Schwanz 30–55 cm
   (≈ 70 % der Kopf-Rumpf-Länge, sehr buschige „Lunte“, im Stand tief gehalten, berührt fast den Boden, weiße
   Spitze, schwarze Grannen darin). Langer Rumpf, relativ kurze, schlanke Beine, Zehengänger, vorn 5, hinten 4 Zehen.
   Fell oben rostrot bis orangerot, Bauch weißlich-grau, Kinn, Oberlippe, Kehle und Brust weiß; Ohren groß, spitz,
   Rückseite schwarz, innen weiß behaart; schwarze „Strümpfe“ an den Läufen (vorn von der Brust abwärts an der
   Vorderseite, hinten ab dem Sprunggelenk); schlanke, spitze Schnauze, dunkler Streifen vom Auge zur Schnauze
   (Tränenstrich), schwarzer Fleck an den Tasthaaren; Augen bernstein-orange mit SENKRECHTER Schlitzpupille. */
function fuchs(T) {
  /* Runde 3 (Kritik R2): Rumpf-Umriss mit Hals (Nackensenke, konkave Kehle), Vorbrust, Oberarm bis Ellbogen, „Hose“ bis zum
     Unterschenkel – Läufe darunter bzw. weich darüber; ferner Hinterlauf erst ab Knie sichtbar; Kopf 18,6 cm (≈ 46 %);
     Lunte ≈ 62 % der Kopf-Rumpf-Länge, tiefer, lange Konturhaare, Pinselspitze; Tränenstreif schwarzbraun, schmal → breit,
     endet im Schnurrhaarfeld; Backenbart; Ohr mit weißer Sichel am Vorderrand. Widerrist 40 cm. */
  T.dichte = T.fein === false ? 0.42 : 0.52;
  const rumpf = [
    [25, -35.6], [29, -38.4], [36, -39.6], [46, -38.8], [56, -39.2], [63, -40.8], [66.4, -41.4], [70, -41], [74, -42.2], [77.4, -44.6], [80, -45.4],   // Rücken, Widerrist, Nacken
    [83, -40.6], [82.6, -36.4], [80.4, -32], [77.8, -28.2], [76.4, -24.6], [75.4, -21.8], [73.4, -19.2], [70.6, -17.2],                            // unter dem Kopf, konkave Kehle, Vorbrust, Oberarm
    [66.4, -17.6], [62.6, -19.4], [56, -20], [49, -20.8], [43.6, -22.8], [38.6, -25.8], [35.2, -26.8],                                             // Ellbogen, Brust, Taille aufgezogen
    [33.6, -23.8], [32.8, -20.4], [31, -16.8], [28.6, -14.2], [26, -13.4], [23.6, -14.6],                                                         // Knie, Unterschenkel läuft aus
    [22.2, -18.4], [21.6, -24.2], [22, -29.6], [23.2, -33.4],                                                                                     // Hose hinten
  ];
  const kopf = [[74.4, -40.4], [74.6, -41.8], [77, -43.8], [79.4, -45.2], [80.6, -47.2], [82.6, -48.8], [85.2, -49.1], [87.6, -48.3], [89, -46.6, 1], [91.4, -45.4], [94, -44.1], [95.8, -43.3],
    [97.2, -42.3], [97.7, -40.9], [96.9, -40], [95.6, -39.6], [94.9, -38.8, 1], [92.6, -38.2], [89.4, -37.7], [86, -37.3], [83, -37.4], [80.4, -38.2], [77.6, -39.4]];
  const vbN = [[63.4, -21.6], [62.2, -17], [62.6, -13], [63, -9.6], [62.8, -8], [63.4, -6.6], [63.8, -4.2], [64.4, -2.6]].concat(pfoteZ(66, 5.8, 2.7),
    [[67.1, -3.2], [66.9, -5.4], [67.2, -7.2], [67.6, -8.8], [67.6, -12], [68.2, -16], [69.8, -20], [70.4, -23]]);
  const hbN = [[26, -17.6], [24.6, -14.6], [24.2, -12], [23.6, -10.2, 1], [24.6, -7.6], [25, -4.6], [25.4, -2.8]].concat(pfoteZ(27, 5.6, 2.6),
    [[28.4, -3.4], [28.6, -6.2], [28.2, -9], [28, -11.2], [29.6, -13.6], [31.2, -16.4], [31.8, -19.6], [28, -20.4]]);
  const versetzt = (p, dx) => p.map((q) => [q[0] + dx, q[1], q[2]]);
  const vbF = versetzt(vbN, -6.4);
  /* ferner Hinterlauf: halber Schritt vor, Oberteil endet unter der Hose (nicht unter dem Bauch sichtbar) */
  const hbF = versetzt([[26, -17.6], [24.6, -14.6], [24.2, -12], [23.6, -10.2, 1], [24.6, -7.6], [25, -4.6], [25.4, -2.8]].concat(pfoteZ(27, 5.6, 2.6),
    [[28.4, -3.4], [28.6, -6.2], [28.2, -9], [28, -11.2], [29, -13.4], [29.6, -16], [28, -19]]), 4.6);

  const fell = hoehenVerlauf(T, "fell", -50, 0, [[-50, "#9a421a"], [-42, "#ad4e1c"], [-34, "#c25e24"], [-27, "#c66a2e"], [-21, "#b8622c"], [-14, "#9e5a2e"], [0, "#7a4424"]]);
  const fellF = hoehenVerlauf(T, "fellF", -50, 0, [[-30, "#86421c"], [-18, "#7a4220"], [-10, "#5a3018"], [0, "#3a2214"]]);
  const rot = [["#4a1c06", 1, 0.1, 0.5], ["#f6b676", 0.9, 0.09, 0.55]];
  const wuchs = (x, y) => (x > 70 ? 150 - (y + 40) * 1.6 : x > 58 ? 122 : x < 33 ? 108 + (x - 22) * 2 : 174 - (y + 36) * 0.9);
  /* Strumpf: schwarz mit schräger Grenze, die über 2–3 cm mit roten Grannen ins Rot verläuft */
  const strumpf = (pts, y0, y1) => T.form(pts, hoehenVerlauf(T, "strumpf" + y0, y0, 0, [[y0, "#1a120d", 0], [y1, "#1a120d", 0.9], [0, "#0d0907", 1]])) +
    haare(T, pts, 40, 94, 0.9, [["#000", 1, 0.08, 0.55], ["#b0602e", 0.5, 0.07, 0.55]], 8);

  let s = "";
  /* ---- Ohren: groß, spitz; Rückseite schwarz (Ränder), Basis rotbraun; weiße Sichel am VORDERrand mit überstehenden Haaren ---- */
  const ohrF = [[84.6, -48.6], [86, -53.4], [87.4, -56.4], [88.4, -56], [89.2, -52.4], [89.4, -48]];
  s += teil(T, "fohrF", ohrF, T.lg("fohrF", [[0, "#0e0a08"], [0.55, "#24160e"], [1, "#7a3a16"]]), "", fellKante(T, [[87.6, -56], [88.8, -52.4], [89.4, -49]], 10, 0.5, -0.1, "#1a120c", 0.07, 0.6), { weich: 1.2 });
  const ohr = [[79.6, -46.6], [80.4, -51.4], [82, -56], [83.4, -58], [85, -56.2], [86.8, -51.6], [87.6, -47.4], [83, -45.6]];
  const sichel = [[84.2, -56.6], [85.6, -53.4], [86.8, -49.6], [87.6, -47.4], [85.4, -47.6], [84.8, -51.6]];
  s += teil(T, "fohr", ohr, T.lg("fohr", [[0, "#0d0907"], [0.45, "#1b120c"], [0.72, "#5a2a12"], [1, "#a24e1e"]]),
    T.form(sichel, T.lg("fohrI", [[0, "#efe6d8"], [1, "#d8c8b4"]], 0, 0, 1, 0)) + haare(T, sichel, 40, -80, 1.6, [["#fbf6ee", 1, 0.08, 0.85]], 22, 0.3),
    fellKante(T, [[79.8, -47.4], [80.4, -51.4], [82, -56], [83.4, -58]], 14, -0.6, -0.3, "#120c09", 0.07, 0.6) + fellKante(T, [[84.4, -57], [85.8, -53.4], [87.4, -48.6]], 22, 1.1, -0.4, "#f8f2e8", 0.07, 0.85), { weich: 1.2 });

  /* ---- ferne Läufe: Oberteil hinter dem Rumpf, Körperton dunkler; Strümpfe ---- */
  const schlag = `<rect x="10" y="-30" width="80" height="30" fill="${hoehenVerlauf(T, "fSchlag", -22, -12, [[-22, "#000", 0.3], [-12, "#000", 0]])}"/>`;
  s += teil(T, "fvbF", vbF, fellF, strumpf([[63, -20], [64.6, -20], [61.4, -12], [61.2, -8], [62, -5], [63.4, -2.4], [63.4, 0.6], [55, 0.6], [56, -6], [56.6, -12], [58.6, -18]], -20, -16) + schlag,
    pfote2(T, 59.6, 5.8, 2.7, { op: 0.8, kralle: "#2a2420", fell: "#3a2418", licht: "#8a6a50" }), { weich: 1.2 });
  s += teil(T, "fhbF", hbF, fellF, strumpf([[26, -12.6], [34.4, -12.6], [34, -7], [34.6, -3], [35.6, 0.6], [27.6, 0.6], [28.6, -6]], -13, -10) + schlag,
    pfote2(T, 31.6, 5.6, 2.6, { op: 0.8, kralle: "#2a2420", fell: "#3a2418", licht: "#8a6a50" }), { weich: 1.2 });

  /* ---- Lunte: ≈ 62 % der Kopf-Rumpf-Länge, schmale Wurzel unter der Kruppe, tief; Oberseite schwarzgespitzt, Unterseite heller im
     Schatten; weiße Pinselspitze aus Strähnen, Übergang mit schwarzen Grannen ---- */
  const lt = rute([[24.8, -33], [18, -31.4], [11, -28.4], [4, -24.6], [-3, -20.6], [-9.6, -17], [-15, -14.2], [-19, -12.6]], [2.8, 4.2, 5.4, 6.2, 6.6, 6.4, 5.4, 3.8], 0);
  let l = `<rect x="-30" y="-40" width="60" height="40" fill="${T.lg("spitzeW", [[0, "#f6f1e8"], [0.5, "#f3ede3", 0.85], [1, "#f3ede3", 0]], -16, 0, -9, 0, ' gradientUnits="userSpaceOnUse"')}"/>`;
  l += fleck(T, "!", 14, -33.8, 10, 1.8, "#2a1408", 0.55, 14) + fleck(T, "!", 21.6, -33, 2.4, 1.6, "#2a1408", 0.7) + fleck(T, "!", 2, -18, 16, 3, "#2a1408", 0.25, 30);
  l += bueschel(T, lt.pts, 140, (x, y) => 158 - (x - 10) * 0.35, 5.4, 0.36, ["#f7bd82", 0.4], ["#2a1206", 0.32], { streu: 16 });
  l += haare(T, lt.pts, 160, (x, y) => 158 - (x - 10) * 0.35, 4, [["#140c06", 1, 0.1, 0.55], ["#f1a764", 0.9, 0.1, 0.5], ["#fff", 0.4, 0.09, 0.6]], 14, 0.3);
  s += teil(T, "flunte", lt.pts, hoehenVerlauf(T, "lunte", -38, -8, [[-38, "#9a441a"], [-31, "#bf5e26"], [-22, "#b86232"], [-12, "#c49a78"]]), l,
    fellKante(T, lt.ob.slice(1), 70, -2.6, -1, "#a44a1a", 0.09, 0.6) + fellKante(T, lt.un.slice(1), 70, -1.4, 2.6, "#7a3a1a", 0.09, 0.55) +
    fellKante(T, [[-12.6, -21.6], [-17.4, -18.6], [-20.8, -15.4], [-22.4, -12.2], [-21.4, -9.6], [-16.4, -9]], 80, -3, 0.9, "#f6f1e8", 0.09, 0.85) +
    fellKante(T, [[-8, -19.6], [-10.6, -11.8]], 14, -1.6, 0.4, "#1a0e06", 0.07, 0.6), { weich: 2.2 });

  /* ---- Rumpf mit Hals, Oberarm, Hose ---- */
  let n = "";
  n += `<rect x="10" y="-52" width="80" height="20" fill="${hoehenVerlauf(T, "fRuecken", -44, -34, [[-44, "#4a1a06", 0.45], [-34, "#4a1a06", 0]])}"/>`;
  /* weiß: Kehle, Brust vor den Vorderläufen (kühl im Schatten); Bauch weißlich-grau; Hüfte silbrig gesprenkelt */
  const weissB = [[83, -40.6], [82.6, -36.4], [80.4, -32], [77.8, -28.2], [76.4, -24.6], [75.4, -21.8], [73.4, -19.2], [71, -17.6], [70.4, -21], [72, -25], [74.6, -29.6], [77.4, -34], [79.4, -38.4]];
  n += T.form(weissB, T.lg("weissB", [[0, "#f4efe6", 0.95], [0.6, "#e6e0d6", 0.95], [1, "#c8c4c0", 0.95]], 0, 0, 0, 1));
  n += fleck(T, "!", 52, -21, 12, 2.2, "#ded4c6", 0.6) + fleck(T, "!", 42, -24.2, 5, 1.6, "#ded4c6", 0.45, -15);
  n += haare(T, [[26, -36], [40, -38], [44, -28], [30, -30]], 60, 150, 1.6, [["#ece6dc", 1, 0.08, 0.6], ["#2a1a10", 0.5, 0.08, 0.45]], 14);
  /* Formschatten: hinter dem Schulterblatt, Flankenfalte vor der Hose */
  n += fleck(T, "!", 60, -30, 1.4, 6, "#3a1606", 0.3, 14) + fleck(T, "!", 34.6, -27, 1.4, 4, "#3a1606", 0.35, -20);
  n += bueschel(T, rumpf, 170, wuchs, 3.4, 0.24, ["#f7b77a", 0.32], ["#3a1404", 0.28]);
  n += haare(T, rumpf, 120, wuchs, 2.4, rot, 10, 0.18);
  n += haare(T, weissB, 60, (x, y) => 120 - (x - 70) * 1.2, 1.6, [["#fff", 1, 0.08, 0.7], ["#a8a49e", 0.5, 0.08, 0.5]], 14);
  n += fellKante(T, [[79.4, -38.4], [77.4, -34], [74.6, -29.6], [72, -25], [70.4, -21]], 50, 1.3, 0.9, "#c25e24", 0.07, 0.7);
  s += teil(T, "frumpf", rumpf, fell, n,
    fellKante(T, [[29, -38.4], [36, -39.6], [46, -38.8], [56, -39.2], [63, -40.8], [66.4, -41.4], [70, -41], [74, -42.2], [77.4, -44.6]], 60, -1.6, -0.25, "#8a3a14", 0.08, 0.6) +
    fellKante(T, [[82.6, -36.4], [80.4, -32], [77.8, -28.2], [76.4, -24.6], [75.4, -21.8], [73.4, -19.2]], 50, -1.2, 1.6, "#f4eee4", 0.08, 0.85) +
    fellKante(T, [[62.6, -19.4], [56, -20], [49, -20.8], [43.6, -22.8], [38.6, -25.8]], 40, -1, 1.4, "#e1d6c8", 0.08, 0.7) +
    fellKante(T, [[23.6, -14.6], [22.2, -18.4], [21.6, -24.2], [22, -29.6]], 40, -1.8, 0.8, "#b8582a", 0.08, 0.65), { weich: 6, ueber: licht(T, "f", -41, -20.5) });

  /* ---- nahe Läufe: über dem Rumpf, oben weich ausgeblendet ---- */
  let h = strumpf([[22.6, -11.2], [24.6, -12.4], [26.4, -11], [28.4, -12.4], [29.4, -13.6], [28.8, -9], [28.6, -5], [30.6, -2.6], [31, 0.6], [23.4, 0.6], [24.6, -4], [24, -8]], -13.2, -10.6);
  h += `<rect x="20" y="-20" width="15" height="10" fill="${hoehenVerlauf(T, "fOkkH", -16, -11, [[-16, "#2a1006", 0.3], [-11, "#2a1006", 0]])}"/>` + haare(T, unten(hbN, -16), 30, 94, 1, rot, 8);
  s += teil(T, "fhbN", hbN, fell, h, pfote2(T, 27, 5.6, 2.6, { kralle: "#3a3430", fell: "#3a2418", licht: "#a07858" }), { weich: 1.2, ueber: licht(T, "f", -41, -20.5), einblenden: [-17.6, -13.6] });
  /* Vorderlauf: Schwarz als Streif vorn bis zum Ellbogen, hinten rotbraun bis zur Handwurzel */
  let v = strumpf([[68.6, -23], [70.6, -23], [68.6, -16], [67.8, -11], [67.6, -7.6], [70, -3.4], [70.4, 0.6], [62, 0.6], [63.4, -4], [63.6, -6.4], [65, -8.6], [66.4, -13], [67.2, -19]], -22, -17);
  v += `<rect x="58" y="-26" width="14" height="10" fill="${hoehenVerlauf(T, "fOkkV", -21, -15, [[-21, "#2a1006", 0.3], [-15, "#2a1006", 0]])}"/>` + haare(T, unten(vbN, -20), 24, 94, 1, rot, 8);
  s += teil(T, "fvbN", vbN, fell, v, fellKante(T, [[62.2, -17], [62.6, -13], [63, -9.6]], 14, -1, 0.5, "#b8582a", 0.07, 0.6) +
    pfote2(T, 66, 5.8, 2.7, { kralle: "#3a3430", fell: "#3a2418", licht: "#a07858" }), { weich: 1.2, ueber: licht(T, "f", -41, -20.5), einblenden: [-22, -18] });

  /* ---- Kopf ---- */
  let k = "";
  /* weiß: Oberlippe, Wange unter dem Auge, Kinn; Haarkante zum Rot */
  const weissK = [[96.6, -40.4], [94, -41.4], [91, -41.8], [88, -42.4], [84.6, -42.8], [81, -42.6], [78.4, -41], [77.6, -39.4], [80.4, -38.2], [83, -37.4], [86, -37.3], [89.4, -37.7], [92.6, -38.2], [94.9, -38.8], [95.6, -39.6]];
  k += T.form(weissK, T.lg("weissK", [[0, "#f6f1e8", 0.9], [0.6, "#f0ebe2", 0.95], [1, "#d8d2c8", 0.95]], 0, 0, 0, 1));
  k += fellKante(T, [[79, -42.4], [82.6, -43], [86.4, -42.6], [90, -42], [93.4, -41.4], [96, -40.6]], 50, 0.7, 0.7, "#c25e24", 0.06, 0.6);
  k += haare(T, weissK, 70, (x, y) => (x > 89 ? 192 : 150), 1, [["#fff", 1, 0.07, 0.6], ["#a8a49e", 0.5, 0.07, 0.45]], 14);
  k += haare(T, kopf.filter((p) => p[1] < -41), 90, (x, y) => (x > 88 ? 197 : 182), 1, [["#5a2008", 1, 0.07, 0.5], ["#f6b676", 0.9, 0.07, 0.5]], 12);
  /* Augenhöhle, Brauenschatten */
  k += fleck(T, "", 86.6, -46.6, 2.2, 1, "#000", 0.4, 20) + fleck(T, "", 84.6, -47.8, 3, 1.1, "#fff", 0.2);
  /* Tränenstreif: am inneren Augenwinkel 0,4 cm, zur Lippe 0,9 cm, leicht gebogen, schwarzbraun, endet im Schnurrhaarfeld */
  k += T.form([[88.5, -44.9], [88.8, -44.8], [89.8, -43.6], [91.1, -42], [92.3, -40.7], [93.4, -40.3], [92.7, -39.9], [91.4, -40.4], [90.1, -41.7], [89, -43.4]], T.lg("traene", [[0, "#1e1008", 0.35], [0.4, "#1e1008", 0.6], [1, "#140a06", 0.75]]));
  k += fellKante(T, [[89, -43.4], [90.2, -41.6], [91.4, -40.2]], 16, -0.4, 0.5, "#1e1008", 0.06, 0.6);
  k += fleck(T, "!", 93.8, -40, 1.8, 0.85, "#1a100a", 0.85, 10);
  /* Lefze: waagerecht, am Mundwinkel unter dem Auge leicht nach oben (Fuchslächeln) */
  k += zart(T, [[96.4, -39.4], [94, -38.95], [91.6, -38.7], [89.6, -38.75], [88.6, -39.1], [88.1, -39.6]], "#1a100a", 0.2, 0.85);
  /* Backenbart: lange weiße Strähnen hinter dem Mundwinkel, nach hinten unten über die Halskontur */
  let ka = fellKante(T, [[80.8, -42], [79.4, -40.6], [78.4, -39.2], [77.8, -38]], 40, -2.4, 1.2, "#f6f1e8", 0.07, 0.9) + fellKante(T, [[80.4, -38.2], [83, -37.4], [86, -37.3]], 20, -1, 1, "#ece6dc", 0.06, 0.7);
  ka += nase2(T, 95.2, -43.6, 2.5, 2.2, 0.42);
  ka += augeTier(T, 86.9, -45.1, 0.84, { iris: "#e6a83a", iris2: "#8a4e10", offen: 0.62, winkel: 22, pupille: "schlitz", wimpern: 10, lidstrich: 0.9 });
  if (T.fein !== false) ka += `<path d="M92.6 -40.4h.01M93.3 -40.6h.01M94 -40.8h.01M93 -39.8h.01M93.7 -40h.01M94.4 -40.2h.01M93.4 -39.2h.01M94.1 -39.4h.01" stroke="#000" stroke-width=".2" stroke-linecap="round" opacity=".6"/>`;
  ka += T.schnurrhaare ? T.schnurrhaare(93.8, -39.8, 8, 6, 10, 32, "#1a120c", 0.06) : "";
  s += teil(T, "fkopf", kopf, hoehenVerlauf(T, "fkopfF", -49.5, -37, [[-49.5, "#a7471a"], [-45, "#c25e24"], [-41, "#c96b30"], [-37, "#c96b30"]]), k, ka, { weich: 1.6, einblendenX: [74.6, 81.5] });
  return { svg: s, box: [-23, -58, 97.8, 0], fuesse: [29, 33.6, 61, 67.4], kopf: [74, -59, 100, -33] };
}

/* =====================================================================
   BÄREN – gemeinsamer Bauplan (Sohlengänger)
   ===================================================================== */
/* Bärentatze Seitenansicht: Ferse/Handballen hinten, Sohle flach, Zehen als Wülste vorn, Krallen darüber.
   x0 = Ferse, x1 = Zehenspitze, H = Höhe am Gelenk. Liefert Umrisspunkte (für glied) */
const tatzeB = (x0, x1, H) => {
  const L = x1 - x0;
  return [[x0 + L * 0.02, -H * 0.7], [x0 - L * 0.02, -H * 0.25], [x0 + L * 0.05, 0, 1], [x1 - L * 0.08, 0, 1], [x1, -H * 0.18], [x1 - L * 0.04, -H * 0.42],
    [x1 - L * 0.16, -H * 0.5], [x1 - L * 0.28, -H * 0.62], [x1 - L * 0.42, -H * 0.8]];
};
/* Krallen eines Bären: n lange, gebogene Krallen an der Zehenfront, Farbe hornhell (Braunbär) oder dunkel */
function baerKrallen(x, y, n, len, abst, farbe, glanz = "#fff", op = 1, fein = true) {
  let d = "", g = "";
  for (let i = 0; i < n; i++) {
    const bx = x - i * abst, by = y + i * 0.15 * len, L = len * (1 - i * 0.06);
    /* Wurzel dick (0,3 L), Bogen nach vorn und unten, Spitze fast senkrecht nach unten */
    d += `M${R(bx)} ${R(by - L * 0.2)}q${R(L * 0.7)} ${R(-L * 0.1)} ${R(L * 0.86)} ${R(L * 0.72)}q${R(-L * 0.24)} ${R(-L * 0.44)} ${R(-L * 0.82)} ${R(-L * 0.42)}z`;
    if (fein) g += `M${R(bx + L * 0.12)} ${R(by - L * 0.16)}q${R(L * 0.48)} ${R(-L * 0.04)} ${R(L * 0.64)} ${R(L * 0.5)}`;
  }
  return `<path d="${d}" fill="${farbe}" fill-opacity="${op}" stroke="#000" stroke-opacity=".35" stroke-width=".25"/>` + (g ? `<path d="${g}" stroke="${glanz}" stroke-opacity=".5" stroke-width=".3" fill="none"/>` : "");
}

/* Bärenkralle als Volumen (Kritik Runde 1): Wurzel so dick wie die halbe Zehe, gebogen, Spitze nahe am Boden;
   hornfarben mit dunkler Wurzel, heller Grat oben, dunkle Unterseite. n Krallen, die hinteren leicht versetzt und dunkler. */
function kralleB(T, x, y, n, L, abst, farbe, wurzel, fall = 0.5, fein = true) {
  let s = "";
  for (let i = n - 1; i >= 0; i--) {
    const bx = x - i * abst, by = y - i * 0.12 * L, l = L * (1 - i * 0.05), d = l * 0.32, f = fall;
    const pfad = `M${R(bx)} ${R(by - d * 0.5)}C${R(bx + l * 0.45)} ${R(by - d * 0.6)} ${R(bx + l * 0.85)} ${R(by + l * f * 0.3)} ${R(bx + l)} ${R(by + l * f)}C${R(bx + l * 0.7)} ${R(by + l * f * 0.5)} ${R(bx + l * 0.4)} ${R(by + d * 0.4)} ${R(bx)} ${R(by + d * 0.5)}Z`;
    s += `<path d="${pfad}" fill="${i ? wurzel : farbe}"${i ? ` fill-opacity=".85"` : ""}/>`;
    if (fein) {
      s += `<path d="M${R(bx)} ${R(by - d * 0.5)}C${R(bx + l * 0.2)} ${R(by - d * 0.55)} ${R(bx + l * 0.3)} ${R(by - d * 0.3)} ${R(bx + l * 0.32)} ${R(by + d * 0.2)}L${R(bx)} ${R(by + d * 0.5)}Z" fill="${wurzel}" fill-opacity=".8"/>`;
      s += `<path d="M${R(bx + l * 0.2)} ${R(by - d * 0.42)}C${R(bx + l * 0.5)} ${R(by - d * 0.45)} ${R(bx + l * 0.78)} ${R(by + l * f * 0.2)} ${R(bx + l * 0.9)} ${R(by + l * f * 0.7)}" stroke="#fff" stroke-opacity=".55" stroke-width="${R(d * 0.12) || 0.1}" fill="none"/>`;
      s += `<path d="M${R(bx + l * 0.3)} ${R(by + d * 0.35)}C${R(bx + l * 0.6)} ${R(by + d * 0.4)} ${R(bx + l * 0.8)} ${R(by + l * f * 0.6)} ${R(bx + l * 0.98)} ${R(by + l * f * 0.98)}" stroke="#000" stroke-opacity=".35" stroke-width="${R(d * 0.14) || 0.1}" fill="none"/>`;
    }
  }
  return s;
}

/* =====================================================================
   BRAUNBÄR
   ===================================================================== */
/* RECHERCHE Braunbär (Ursus arctos): Schulterhöhe auf allen vieren 0,9–1,5 m, Kopf-Rumpf 1,5–2,8 m, Schwanz
   6–21 cm (im Fell versteckt). Kennzeichen: deutlicher SCHULTERBUCKEL (Muskelmasse zum Graben), Kruppe niedriger
   als der Buckel, großer breiter Kopf mit „eingedelltem“ (konkavem) Gesichtsprofil, kleine runde Ohren, kleine
   dunkelbraune Augen, große schwarze Nase, Sohlengänger (Ferse setzt auf), Vorderkrallen sehr lang (5–10 cm), hell,
   leicht gebogen, Hinterkrallen kürzer. Fell dicht, zottig, braun von hell- bis schwarzbraun, beim Grizzly
   silbrig-goldene Haarspitzen auf Buckel und Rücken; Beine meist dunkler; Bauchfransen. Gang: schwerfällig, Kopf
   tief, Beine wie Säulen. */
function braunbaer(T) {
  /* Runde 3 (Kritik R2): Rumpf-Umriss mit Oberschenkel (konvexes Gesäß, Knie vorn) und Oberarm bis Ellbogen; Läufe darüber,
     oben weich ausgeblendet; Buckel über dem Ellbogen, Nacken davor ≈ 6 % tiefer, Sattelsenke dahinter; hängender Bauch mit
     ungleichen Fransen; Schüsselprofil (Stirnwulst, Delle vor dem Auge, gerader schmaler werdender Fang), klarer Unterkiefer,
     kurzes Kinn; Nase breiter als hoch, bündig; Vorderfuß ≈ 60 % des Hinterfußes, Krallen an den Zehenspitzen. */
  T.dichte = T.fein === false ? 0.6 : 0.56;
  const rumpf = [
    [16, -92], [24, -97.6], [36, -99.6], [48, -98.4], [60, -96.4], [74, -96.8], [88, -99.4], [100, -103.4], [112, -109], [124, -112.6], [132, -112],  // Kruppe, Sattel, Buckel
    [140, -109.6], [148, -105.6], [156, -101.2], [163, -98], [168, -92], [168, -82],                                                             // Nacken (≈ 6 % tiefer), unter den Kopf
    [166, -72], [160, -63], [155, -54], [151.4, -46], [149.6, -40], [147, -36],                                                                 // Kehle, Brust, Vorbrust
    [128, -36], [121, -39], [114, -41], [100, -38.8], [86, -37.6], [72, -38.8], [61, -41.6],                                                    // Ellbogen, hängender Bauch
    [53.6, -45], [49.6, -40], [45.6, -32], [40, -27], [30, -25.4], [20, -27],                                                                  // Knie, Unterschenkel läuft aus
    [14.4, -34], [10, -44], [7, -56], [6.4, -68], [8.6, -80], [12, -88],                                                                       // Gesäß konvex
  ];
  const kopf = [[152, -84], [153, -93], [157, -99], [162, -102.6], [168, -104.6], [176, -106.2], [182, -106.4], [186.6, -104.6], [190.2, -101.4], [193, -98.2, 1], [197, -96.6], [202.6, -94.4], [208, -91.2],
    [211.6, -89], [213.8, -87.4], [214.4, -84], [213.8, -80.6], [211.6, -79], [209.8, -77.6, 1], [206, -76.4], [200, -75.2], [192, -74], [184, -73.6], [176, -74.6], [168, -77], [160, -79.4], [154, -80.6]];
  /* Vorderlauf: Unterarm oben breiter, Handwurzel-Knick nach vorn (≈ 12 %), kurzer breiter Fuß (≈ 60 % des Hinterfußes) */
  const vbN = [[118, -48], [116.4, -40], [118.6, -30], [121, -20], [122, -13], [121.2, -8.6], [122, -3.6], [123.6, 0, 1], [142, 0, 1], [144.8, -2.4], [144.4, -5.6], [141.6, -7.8], [139.6, -10.6],
    [140.4, -15.4], [142.6, -23], [145, -32], [147.4, -42], [146, -50]];
  /* Hinterlauf: Unterschenkel, Ferse (kleine Wölbung), ganze Sohle */
  const hbN = [[16, -38], [17.6, -28], [19.2, -20], [18.8, -13], [17.4, -7.2], [16.6, -3.4], [18.4, 0, 1], [49.6, 0, 1], [52.4, -2.4], [51.6, -5.8], [46.4, -7.6], [40.4, -9], [37, -12.4],
    [36.6, -19], [38.6, -27], [42, -34], [44, -40], [30, -40]];
  const versetzt = (p, dx) => p.map((q) => [q[0] + dx, q[1], q[2]]);
  const vbF = versetzt(vbN, -15), hbF = versetzt(hbN, 13);

  const fell = hoehenVerlauf(T, "fell", -114, 0, [[-114, "#6a4c2e"], [-102, "#583c22"], [-86, "#4a301b"], [-66, "#412915"], [-46, "#382212"], [-24, "#301d10"], [0, "#24150b"]]);
  const fellF = hoehenVerlauf(T, "fellF", -114, 0, [[-60, "#463020"], [-30, "#3a2818"], [0, "#28180e"]]);
  const lauf = [["#140b05", 1, 0.2, 0.5], ["#a0805a", 0.7, 0.18, 0.5]];
  const wuchs = (x, y) => (x > 150 ? 118 - (y + 90) * 0.5 : x > 112 ? 115 : x < 44 ? 100 + (x - 10) * 1.2 : y > -50 ? 140 : 168 - (y + 100) * 0.5);
  const okk = (y0, y1, n) => `<rect x="0" y="-60" width="160" height="60" fill="${hoehenVerlauf(T, "bOkk" + n, y0, y1, [[y0, "#140a04", 0.35], [y1, "#140a04", 0]])}"/>`;

  let s = "";
  /* ---- Ohren (unter dem Kopf → Grund vom Kopffell überlappt): klein, rund; Muschel als dunkle Sichel vorn; fernes Ohr dahinter ---- */
  s += teil(T, "bohrF", [[173, -100], [173.6, -106.4], [176, -108.8], [178.6, -107.6], [179, -101]], "#3a2616", "", fellKante(T, [[173.6, -107.6], [176, -109.8], [178.6, -108.6]], 14, 0.2, -1.2, "#5a3b22", 0.16, 0.6), { weich: 1.2 });
  const ohr = [[164.4, -99.4], [164.6, -106.6], [167, -110.4], [170.4, -110.6], [172.4, -107], [172.4, -99.4]];
  s += teil(T, "bohr", ohr, T.lg("bohr", [[0, "#2a1a0e"], [1, "#6a4a2c"]]),
    T.form([[170.4, -103], [171.4, -106.4], [170.6, -109.6], [172, -107.4], [172.2, -103]], "#120a05", ' opacity=".7"') + haare(T, ohr, 50, -95, 2, [["#c9a072", 1, 0.14, 0.6], ["#2a1a0e", 0.8, 0.14, 0.5]], 40, 0.3),
    fellKante(T, [[164.6, -103], [164.6, -107.6], [167, -111.2], [170.4, -111.4], [172.4, -107.8]], 34, 0, -1.6, "#6a4a2c", 0.15, 0.65), { weich: 1.2 });

  /* ---- ferne Läufe: Körperton, kühler und 20 % dunkler; oben vom Rumpf verdeckt + Schlagschatten ---- */
  s += teil(T, "bvbF", vbF, fellF, bueschel(T, vbF, 40, 96, 5, 0.4, ["#8a6a48", 0.35], ["#0a0603", 0.3]) + okk(-38, -24, "F"),
    kralleB(T, 126.6, -4.4, 4, 6.4, 1.8, "#9a8c76", "#4a3c2e", 0.6, T.fein !== false), { weich: 6 });
  s += teil(T, "bhbF", hbF, fellF, bueschel(T, hbF, 40, 98, 5, 0.4, ["#8a6a48", 0.35], ["#0a0603", 0.3]) + okk(-38, -24, "F"),
    kralleB(T, 61.4, -2.6, 4, 3.4, 1.6, "#3e3428", "#2a221a", 0.6, T.fein !== false), { weich: 6 });

  /* ---- Rumpf ---- */
  let n = "";
  /* silbrig-goldene Grannenspitzen auf Buckel, Schulter, Rücken (nach unten abnehmend) */
  n += `<rect x="0" y="-120" width="180" height="40" fill="${hoehenVerlauf(T, "spitzen", -114, -86, [[-114, "#e4c89c", 0.42], [-102, "#e4c89c", 0.16], [-86, "#e4c89c", 0]])}"/>`;
  /* Volumen: Schulterblatt (helle Oberkante, Schatten hinten), Oberschenkel als Kugel (Licht oben vorn), Rippenkorb */
  n += fleck(T, "!", 128, -94, 12, 10, "#e4c89c", 0.2) + fleck(T, "!", 108, -76, 6, 18, "#140a04", 0.2, 10) + fleck(T, "!", 30, -80, 14, 12, "#e4c89c", 0.15) + fleck(T, "!", 58, -60, 6, 14, "#140a04", 0.2, -15);
  n += bueschel(T, rumpf, 230, wuchs, 8.4, 0.36, ["#d8b688", 0.32], ["#140a04", 0.26], { streu: 18 });
  n += haare(T, [[60, -100], [100, -106], [126, -116], [150, -106], [130, -98], [100, -94], [60, -92]], 80, wuchs, 6, [["#f0dab4", 1, 0.18, 0.6]], 14, 0.25);
  n += haare(T, rumpf, 70, wuchs, 6, [["#1a0e06", 1, 0.2, 0.5]], 14, 0.25);
  s += teil(T, "brumpf", rumpf, fell, n,
    fellKante(T, [[24, -97.6], [36, -99.6], [48, -98.4], [60, -96.4], [74, -96.8], [88, -99.4], [100, -103.4], [112, -109], [124, -112.6], [132, -112], [140, -109.6], [148, -105.6], [156, -101.2]], 90, -3.6, -1, "#7a5a3a", 0.2, 0.6) +
    fellKante(T, [[60, -96.4], [100, -103], [126, -112.2], [148, -105.4]], 40, -3.2, -1.2, "#ead2a8", 0.18, 0.5) +
    fellKante(T, [[166, -72], [160, -63], [155, -54], [151.4, -46]], 46, -2.4, 3.4, "#4a301c", 0.22, 0.7) +
    fellKante(T, [[121, -39], [114, -41], [100, -38.8], [86, -37.6], [72, -38.8], [61, -41.6]], 110, -2, 5.4, "#4a301c", 0.22, 0.75) +
    fellKante(T, [[14.4, -34], [10, -44], [7, -56], [6.4, -68]], 40, -2.4, 1.6, "#4a2f1b", 0.2, 0.6), { weich: 10, ueber: licht(T, "b", -112, -38) });
  /* Stummelschwanz: Fellbüschel am Gesäßrand */
  s += fellKante(T, [[13, -90], [11.6, -87.4]], 16, -2.4, -0.6, "#5a3e24", 0.22, 0.75);

  /* ---- nahe Läufe: über dem Rumpf, oben weich (Schlagschatten des Bauchbehangs) ---- */
  let h = bueschel(T, hbN, 60, (x, y) => (y < -10 ? 100 : 95), 5, 0.42, ["#a0805a", 0.35], ["#0a0603", 0.3]) + haare(T, hbN, 50, 96, 3.6, lauf, 10) + okk(-36, -22, "H");
  s += teil(T, "bhbN", hbN, fell, h, fellKante(T, [[17.6, -28], [19.2, -20], [18.8, -13]], 14, -1.6, 1.2, "#3a2414", 0.18, 0.6) + fellKante(T, [[18.4, 0], [49.6, 0]], 40, 0.4, 0.9, "#3a2414", 0.16, 0.6) +
    kralleB(T, 48.4, -2.4, 4, 3.4, 1.8, "#4a3e30", "#2a221a", 0.6, T.fein !== false), { weich: 4, ueber: licht(T, "b", -112, -38), einblenden: [-38, -28] });
  let v = bueschel(T, vbN, 60, 95, 5, 0.42, ["#a0805a", 0.35], ["#0a0603", 0.3]) + haare(T, vbN, 50, 95, 3.6, lauf, 10) + okk(-40, -26, "V");
  s += teil(T, "bvbN", vbN, fell, v, fellKante(T, [[116.4, -40], [118.6, -30], [121, -20]], 28, -2.6, 2, "#3a2414", 0.18, 0.65) +
    kralleB(T, 141.6, -4.2, 4, 6.6, 2.6, "#d2c3a6", "#6a5a46", 0.62, T.fein !== false) +
    (T.fein !== false ? `<path d="M139.4 -8.6q-1.2 3.6 -.4 8M134.4 -9q-1 3.6 -.4 8.4M129.4 -8.6q-1 3.4 -.4 8" stroke="#0d0805" stroke-width=".5" stroke-opacity=".5" fill="none"/>` : ""),
    { weich: 4, ueber: licht(T, "b", -112, -38), einblenden: [-46, -36] });

  /* ---- Kopf ---- */
  let k = "";
  const schnauze = [[194, -95.6], [202, -93], [208, -90.4], [211.6, -89], [213.8, -87.4], [214.4, -84], [213.8, -80.6], [211.6, -79], [209.8, -77.6], [206, -76.4], [200, -75.2], [194, -76], [190, -82]];
  k += T.form(schnauze, T.rg("schnauze", [[0, "#ae8758", 0.85], [0.7, "#966b40", 0.55], [1, "#966b40", 0]], 0.6, 0.45, 0.6));
  /* Stirnwulst im Licht, Delle vor dem Auge im Schatten, Kaumuskel/Wange als Wölbung, Unterkiefer klar */
  k += fleck(T, "!", 182, -102, 7, 2.6, "#e4c89c", 0.4, -10) + fleck(T, "!", 192, -95.4, 2.4, 1.6, "#140a04", 0.35) + fleck(T, "!", 178, -86, 9, 7, "#e4c89c", 0.18) + fleck(T, "!", 186, -76, 12, 2, "#140a04", 0.35);
  k += bueschel(T, kopf.filter((p) => p[0] < 196), 70, (x, y) => 175 + (y + 88) * 1.2, 3.4, 0.22, ["#d8b688", 0.3], ["#140a04", 0.22]);
  k += haare(T, kopf, 140, (x, y) => (x > 190 ? 194 : 168 + (y + 88) * 1.4), 2, [["#24160c", 1, 0.15, 0.5], ["#d6ae7c", 0.8, 0.14, 0.5]], 14, 0.2);
  /* Augenhöhle: Brauenwulst wirft Schatten, dunkle Lidhaut */
  k += fleck(T, "", 187.6, -97.8, 3.6, 1.6, "#000", 0.45, -8);
  /* Lefze: dunkel, fast waagerecht unter dem Nasenspiegel bis unter das Auge; Unterlippe vorn leicht hängend */
  k += zart(T, [[212.4, -79.4], [208.6, -78.4], [203.4, -77.6], [198, -77.2], [193.4, -77.1], [190.8, -77.4]], "#140b06", 0.42, 0.85);
  /* Kehlhaare: lockere, ungleich lange Strähnen nach hinten unten (keine Reihe gleicher Büschel) */
  let ka = fellKante(T, [[206, -76.4], [200, -75.2], [192, -74], [184, -73.6], [176, -74.6], [168, -77]], 60, -2.6, 3, "#3a2414", 0.18, 0.65);
  ka += nase2(T, 208.8, -90.4, 6.2, 5.2, 0.28);
  ka += augeTier(T, 187.8, -95.6, 1, { iris: "#5c3418", iris2: "#24120a", offen: 0.72, winkel: 8, wimpern: 8, lidstrich: 0.3, haut: 0.55 });
  if (T.fein !== false) ka += `<path d="M206 -79.6q3 .4 6 2M205.6 -80.6q3.4 -.4 6.4 .4" stroke="#1a120c" stroke-width=".14" fill="none" opacity=".6"/>`;
  s += teil(T, "bkopf", kopf, hoehenVerlauf(T, "bkopfF", -106, -73, [[-106, "#765636"], [-94, "#614427"], [-82, "#50361f"], [-73, "#412915"]]), k, ka, { weich: 6, einblendenX: [152.5, 161] });
  return { svg: s, box: [5, -113, 215.6, 0], fuesse: [34, 47, 118, 133], kopf: [156, -114, 218, -66] };
}

/* =====================================================================
   EISBÄR
   ===================================================================== */
/* RECHERCHE Eisbär (Ursus maritimus): Männchen Kopf-Rumpf 2,0–2,5 m, Schulterhöhe 1,3–1,6 m (Weibchen kleiner),
   Schwanz 7–13 cm. Gegenüber dem Braunbären: KEIN Schulterbuckel, Hinterteil höher als die Schultern, langer Hals,
   relativ kleiner, länglicher Kopf mit gerader bis leicht gewölbter („römischer“) Nase, kleine runde Ohren, kleine
   dunkle Augen. Sehr große, breite Tatzen (bis 30 cm) mit kurzen, kräftigen, dunklen Krallen, Sohlen behaart.
   Fell: Haare durchsichtig-hohl, wirkt weiß bis cremegelb (im Sommer gelblich), darunter SCHWARZE Haut – sichtbar
   an Nase, Lippen, Lidrändern und Sohlenballen. Schatten im Fell bläulich-grau (Himmelslicht), unten warm-gelblich. */
function eisbaer(T) {
  /* Runde 3 (Kritik R2): Rumpf-Umriss mit Oberschenkel (konvexes Gesäß), Knie, Oberarm; Läufe darüber, oben weich; Hüfte höher
     als die Schulter; Hals zur Schulter dicker, Kehle konvex mit langen ungleichen Haaren; kleiner Kopf mit Römernase,
     Brauenwulst, Jochbogen, kleinem Kinn; drei Volumen (Schulterblatt, Rippenkorb, Oberschenkel) und kräftiger KÜHLER Kernschatten;
     ferne Läufe nur 20–25 % dunkler, blaugrau; Ohr matt, seitlich; Stummelschwanz aus Fell; breite Tatzen, kurze dicke Krallen. */
  T.dichte = T.fein === false ? 0.6 : 0.62;
  const blau = "#6f7f94";
  const rumpf = [
    [14, -90], [20, -102], [32, -109.4], [46, -112], [60, -111.4], [80, -108], [100, -104], [118, -101], [130, -100],      // hohe Hüfte → Schulter
    [144, -97.4], [158, -93.6], [170, -90.6], [180, -89.6], [188, -86], [190, -76],                                       // langer Hals (unter den Kopf)
    [184, -70.4], [176, -67.2], [166, -62.6], [158, -57.2], [152.4, -50], [150, -44], [148.4, -40],                       // Kehle konvex, Brustbein, Vorbrust
    [128, -40], [122, -44], [106, -46.6], [88, -48], [72, -50.4], [62, -53],                                              // Ellbogen, Bauch
    [55, -52], [51.6, -46], [47.6, -38], [42, -30.4], [32, -28.4], [22, -30.4],                                           // Knie, Unterschenkel
    [16.4, -38], [12, -50], [9.6, -64], [10, -78],                                                                        // Gesäß konvex
  ];
  const kopf = [[176, -82], [177, -87], [181, -89.2], [187, -92.4], [193, -93.4], [198.4, -92.4], [202, -91.4], [207, -90], [213, -88.2], [219, -85.4], [224, -81.4],
    [227.4, -76], [228.8, -73], [228.2, -70.4], [226, -69], [223.6, -68.4, 1], [222.4, -66.8], [219, -65.6], [212, -65.2], [204, -65.8], [196, -67.4], [190, -70], [184, -73], [179, -76.6]];
  const vbN = [[124, -48], [122.4, -38], [124.6, -28], [126.6, -18], [127, -12], [126.2, -8], [127, -3.6], [128.6, 0, 1], [154, 0, 1], [157, -2.6], [156.6, -6], [153, -8.4], [148.6, -10],
    [146.4, -13], [147.4, -18], [149, -28], [151, -38], [152, -48]];
  const hbN = [[20, -36], [21.4, -24], [21, -14], [19.4, -7.6], [18.6, -3.4], [20.4, 0, 1], [55, 0, 1], [58, -2.4], [57.4, -6], [52, -7.6], [45, -9], [40.6, -12], [40, -20], [42, -30],
    [46, -40], [30, -42]];
  const versetzt = (p, dx) => p.map((q) => [q[0] + dx, q[1], q[2]]);
  const vbF = versetzt(vbN, -16), hbF = versetzt(hbN, 15);

  const fell = hoehenVerlauf(T, "fell", -114, 0, [[-114, "#fbf8f1"], [-100, "#f6f1e7"], [-84, "#f0eadc"], [-66, "#e9e2d1"], [-48, "#e4dcc8"], [-24, "#e6dfcd"], [0, "#dad1bb"]]);
  const fellF = hoehenVerlauf(T, "fellF", -114, 0, [[-60, "#cdd1d2"], [-30, "#c4c8c8"], [0, "#b4b6ae"]]);
  /* kühler Kernschatten im unteren Drittel, Reflexlicht an der Bauchkante, Schlagschatten auf die Laufansätze */
  const kern = hoehenVerlauf(T, "eKern", -112, -18, [[-86, blau, 0], [-70, blau, 0.24], [-58, blau, 0.42], [-50, blau, 0.36], [-40, blau, 0.24], [-26, blau, 0.1], [-14, blau, 0]]);
  const weissS = (pts, n, len, w) => bueschel(T, pts, n, wuchs, len, w, ["#ffffff", 0.55], ["#8a98aa", 0.22], { streu: 14 });
  const wuchs = (x, y) => (x > 150 ? 172 - (y + 88) * 0.5 : x > 110 ? 120 : x < 44 ? 100 + (x - 10) * 1.6 : y > -54 ? 140 : 170 - (y + 105) * 0.4);

  let s = "";
  /* ---- Ohr: klein, rund, matt, seitlich am Hinterkopf; Grund vom Kopffell überdeckt; schmale dunkle Muschelsichel vorn ---- */
  const ohr = [[184, -89], [184.4, -93.2], [186, -95.2], [188.2, -94.8], [189.4, -92], [189.2, -89]];
  s += teil(T, "eohr", ohr, T.lg("eohr", [[0, "#f4f0e6"], [1, "#d8d0bc"]]), T.form([[188, -89.8], [188.8, -92.6], [188.2, -94.2], [189.2, -92.6], [189.2, -90]], "#5a6270", ' opacity=".5"') +
    haare(T, ohr, 30, -95, 1.2, [["#fff", 1, 0.1, 0.7], ["#b8b4a8", 0.6, 0.1, 0.5]], 40, 0.3),
    fellKante(T, [[184, -89.6], [184.4, -93.2], [186, -95.2], [188.2, -94.8]], 20, -0.2, -0.9, "#fff", 0.1, 0.75), { weich: 1.2 });
  /* ---- ferne Läufe: kühl blaugrau, nur 20–25 % dunkler, mit Fell ---- */
  const okk = (y0, y1, n, op) => `<rect x="0" y="-60" width="180" height="60" fill="${hoehenVerlauf(T, "eOkk" + n, y0, y1, [[y0, "#3a4658", op], [y1, "#3a4658", 0]])}"/>`;
  s += teil(T, "evbF", vbF, fellF, bueschel(T, vbF, 40, 96, 5, 0.4, ["#eef2f4", 0.45], ["#5a6474", 0.25]) + okk(-40, -24, "F", 0.3),
    fellKante(T, [[112.6, 0], [138, 0]], 30, 0.4, 1.2, "#c4c6c2", 0.16, 0.6) + kralleB(T, 138.4, -3.2, 3, 3.2, 2.4, "#1d1814", "#1d1814", 0.8, T.fein !== false), { weich: 6 });
  s += teil(T, "ehbF", hbF, fellF, bueschel(T, hbF, 40, 98, 5, 0.4, ["#eef2f4", 0.45], ["#5a6474", 0.25]) + okk(-40, -24, "F", 0.3),
    fellKante(T, [[35.4, 0], [70, 0]], 30, 0.4, 1.2, "#c4c6c2", 0.16, 0.6) + kralleB(T, 70.4, -2.6, 3, 2.8, 2.2, "#1d1814", "#1d1814", 0.8, T.fein !== false), { weich: 6 });

  /* ---- Rumpf ---- */
  let n = "";
  /* Volumen: Schulterblatt (Licht oben vorn, kühler Schatten dahinter), Rippenkorb, Oberschenkel als Kugel */
  n += fleck(T, "!", 122, -88, 12, 9, "#ffffff", 0.55) + fleck(T, "!", 82, -92, 18, 7, "#ffffff", 0.45) + fleck(T, "!", 40, -96, 16, 11, "#ffffff", 0.55);
  /* Formschatten nur, wo die Form vom Licht wegdreht: Hinterkante des Schulterblatts (lang, weich), Rückseite der Keule */
  n += fleck(T, "!", 110, -74, 9, 22, blau, 0.12, 12) + fleck(T, "!", 18, -66, 9, 24, blau, 0.16, 8);
  n += weissS(rumpf, 220, 7, 0.4);
  n += haare(T, rumpf, 60, wuchs, 5, [["#ffffff", 1, 0.16, 0.6], ["#9aa6b4", 0.5, 0.15, 0.3]], 14, 0.25);
  /* gelblicher Ton nur in Schattenübergängen, an Hals und Läufen */
  n += fleck(T, "!", 160, -68, 14, 8, "#d8c8a0", 0.2, 30);
  s += teil(T, "erumpf", rumpf, fell, n,
    fellKante(T, [[20, -102], [32, -109.4], [46, -112], [60, -111.4], [80, -108], [100, -104], [118, -101], [130, -100], [144, -97.4], [158, -93.6], [170, -90.6]], 90, -3.2, -0.6, "#ffffff", 0.2, 0.75) +
    fellKante(T, [[188, -76], [184, -70.4], [176, -67.2], [166, -62.6], [158, -57.2], [152.4, -50]], 80, -2.4, 3.6, "#d8d0bc", 0.2, 0.75) +
    fellKante(T, [[128, -40], [122, -44], [106, -46.6], [88, -48], [72, -50.4], [62, -53]], 90, -1.6, 4.6, "#cfc6b0", 0.2, 0.75) +
    fellKante(T, [[16.4, -38], [12, -50], [9.6, -64], [10, -78]], 34, -2, 1.4, "#e2d8c4", 0.2, 0.6), { weich: 10, ueber: kern });
  /* Stummelschwanz: Fellbüschel am Kruppenende */
  s += fellKante(T, [[15.6, -94], [13.2, -91.6]], 22, -2.6, -0.4, "#ece6d6", 0.24, 0.85) + fellKante(T, [[15, -92.6], [13.6, -90.6]], 10, -2.2, 0.6, "#a8b0bc", 0.2, 0.5);

  /* ---- nahe Läufe: über dem Rumpf, oben weich; Haarfahne hinten am Unterarm; Sohlenfell in Büscheln ---- */
  let h = weissS(hbN, 70, 5, 0.38) + okk(-36, -22, "H", 0.3);
  s += teil(T, "ehbN", hbN, fell, h, fellKante(T, [[21.4, -24], [21, -14], [19.4, -8]], 14, -1.6, 1.2, "#e2d8c4", 0.18, 0.6) +
    fellKante(T, [[20.4, -0.4], [55, -0.4]], 50, 0.5, 1.3, "#ece4d0", 0.2, 0.75) + kralleB(T, 56.4, -2.4, 4, 3, 2.2, "#14110f", "#14110f", 0.85, T.fein !== false),
    { weich: 4, tiefe: 4, ueber: kern, einblenden: [-40, -26] });
  let v = weissS(vbN, 70, 5, 0.38) + okk(-40, -26, "V", 0.3);
  s += teil(T, "evbN", vbN, fell, v, fellKante(T, [[122.4, -38], [124.6, -28], [126.6, -18]], 40, -3, 2, "#e8e0cc", 0.2, 0.75) +
    fellKante(T, [[128.6, -0.4], [154, -0.4]], 44, 0.5, 1.3, "#ece4d0", 0.2, 0.75) + kralleB(T, 155.4, -3, 4, 3.4, 2.4, "#14110f", "#14110f", 0.85, T.fein !== false) +
    (T.fein !== false ? `<path d="M152.6 -8.6q-1 3.6 -.4 8M147.6 -10q-1 4 -.4 9.6M142.6 -10q-1 4 -.4 9.6" stroke="#a8a89c" stroke-width=".5" stroke-opacity=".6" fill="none"/>` : ""),
    { weich: 4, tiefe: 4, ueber: kern, einblenden: [-48, -34] });

  /* ---- Kopf: Römernase, Brauenwulst, Jochbogen/Kaumuskel, kleines abgesetztes Kinn ---- */
  let k = "";
  k += fleck(T, "!", 199, -89.8, 5, 1.3, blau, 0.3, -8) + fleck(T, "!", 197, -92, 6, 1.6, "#ffffff", 0.6, -5);     // Brauenwulst: Licht oben, Schattenkante darunter
  k += fleck(T, "!", 198, -78, 8, 3.4, blau, 0.22, -10) + fleck(T, "!", 196, -82.4, 7, 2.2, "#ffffff", 0.45, -10);   // Jochbogen/Kaumuskel
  k += `<rect x="170" y="-100" width="62" height="40" fill="${hoehenVerlauf(T, "eKopfK", -80, -64, [[-80, blau, 0], [-70, blau, 0.2], [-64, blau, 0.3]])}"/>`;
  k += haare(T, kopf, 170, (x, y) => (x > 200 ? 194 : 178 + (y + 80) * 1.2), 1.8, [["#fff", 1, 0.12, 0.65], ["#8a96a6", 0.7, 0.11, 0.45]], 12, 0.2);
  k += haare(T, [[220, -82], [228, -75], [228, -71], [221, -76]], 20, 200, 0.6, [["#fff", 1, 0.08, 0.7]], 20);
  k += zart(T, [[227.4, -69.8], [224, -69.2], [219.4, -68.8], [214, -68.6], [209.6, -68.7], [208.2, -69.2]], "#141110", 0.5, 0.9);   // schwarzes Lippenpigment
  let ka = fellKante(T, [[219, -65.6], [212, -65.2], [204, -65.8], [196, -67.4], [190, -70]], 34, -1.4, 2.2, "#ddd4c0", 0.16, 0.7);
  ka += nase2(T, 222.6, -81, 5.6, 4.4, 0.78);
  ka += augeTier(T, 203.6, -87.4, 1.18, { iris: "#4a2a16", iris2: "#1e0e06", offen: 0.72, winkel: 6, wimpern: 9, wimpernFarbe: "#e0dace", lidstrich: 0.3, haut: 0.85 });
  if (T.fein !== false) ka += `<path d="M220.6 -70.2q3.4 .2 6.4 1.8M220.2 -71.2q3.6 -.6 6.6 .2" stroke="#8a8070" stroke-width=".14" fill="none" opacity=".6"/>`;
  s += teil(T, "ekopf", kopf, fell, k, ka, { weich: 6, einblendenX: [176.5, 184] });
  return { svg: s, box: [8.6, -112.4, 229, 0], fuesse: [38, 53, 126, 142], kopf: [176, -98, 231, -60] };
}

/* =====================================================================
   PANDA (Großer Panda)
   ===================================================================== */
/* RECHERCHE Großer Panda (Ailuropoda melanoleuca), Duden: „der Panda“: Schulterhöhe 65–80 cm, Kopf-Rumpf 1,2–1,9 m,
   Schwanz 10–15 cm (weiß, kurz), 70–125 kg. Gedrungener, tonnenförmiger Körper, sehr großer runder Kopf (mächtige
   Kaumuskeln → breite, volle Wangen), kurze Schnauze, schwarze Nase. Schwarz: Ohren (rund, pelzig), Augenflecken
   (unregelmäßig, schräg zur Schnauze hin abfallend), alle vier Beine und ein Band über die Schultern, das die
   Vorderbeine verbindet; sonst weiß bis cremeweiß. Augen klein, dunkel, mit SENKRECHTER Schlitzpupille (anders als
   andere Bären). Sohlengänger, kräftige Krallen, „Pseudodaumen“ am Handgelenk. Fell dicht, wollig, ölig. */
function panda(T) {
  /* Runde 3 (Kritik R2): gedrungener, tonnenförmiger Rumpf (−10 %), Bauch durchhängend, Rücken vom Widerrist leicht fallend;
     Schulterband als Sattel um den Rumpf (über dem Widerrist schmaler, vorn über die ganze Brust, Grenze schräg von der Kehle
     zum Widerrist – kein weißer Kragenkeil); Oberschenkel rund, Unterschenkel ≈ 30 % schmaler; Schwarz modelliert (Glanz
     #3a3633 → Tiefe #0e0c0b); Läufe über dem Rumpf, oben weich; Kopf rund und massig mit großer Wange, die über die Kieferlinie
     reicht, ohne Schattenhof; Augenfleck mit Haarkante, Auge tief im oberen hinteren Teil; Nase breit und bündig; Lippen schwarz. */
  T.dichte = T.fein === false ? 0.6 : 0.62;
  const rumpf = [
    [22, -52], [24, -62], [32, -70], [46, -75], [62, -76.4], [80, -77.6], [96, -78.6], [106, -79], [114, -78], [120, -72], [122, -62],   // Rücken fällt zur Kruppe, Nacken unter dem Kopf
    [121.4, -52], [119, -44], [116.6, -38], [100, -36.4], [94, -34.6], [80, -30.6], [64, -30.4], [50, -32.4],                         // Brust, Ellbogen, durchhängender Bauch
    [44.6, -36.6], [42, -28.4], [37.6, -22.6], [30, -20.4], [24, -24], [19, -32], [17.6, -42], [19, -49],                              // Knie, Unterschenkelansatz, runde Keule
  ];
  const kopf = [[112, -62], [112.6, -70], [115, -74.4], [117.2, -77.4], [119.6, -82.6], [123, -87], [129.6, -90.6], [138, -90.4], [145, -87.2], [150, -82], [152.6, -77], [154.4, -73.2],
    [156.6, -71.4], [158.4, -69], [158.8, -66], [158, -63.4], [156, -62.6], [155, -61.2, 1], [153.4, -59.4], [149.6, -57.6], [144, -56.2], [137, -55.2], [130, -55.4], [123, -57], [117, -59]];
  const vbN = [[96, -40], [95.4, -32], [97.6, -24], [99, -16], [99.4, -11], [98.6, -7.6], [99.4, -3.4], [101, 0, 1], [117, 0, 1], [119.6, -2.4], [119.2, -5.4], [116.4, -7.4], [113, -9],
    [111.4, -12.6], [112.2, -18], [113.6, -26], [115.4, -36], [116, -44]];
  const hbN = [[20, -30], [22, -20], [21.4, -12], [20, -6.6], [19.6, -3], [21.4, 0, 1], [44, 0, 1], [46.6, -2.4], [46, -5.4], [42, -7], [38, -8.4], [35.4, -11], [35, -16], [37, -24],
    [40, -32], [42, -38], [28, -38]];
  const versetzt = (p, dx) => p.map((q) => [q[0] + dx, q[1], q[2]]);
  const vbF = versetzt(vbN, -11), hbF = versetzt(hbN, 11);

  const weissV = hoehenVerlauf(T, "weiss", -92, 0, [[-92, "#f8f5ee"], [-72, "#f2ede2"], [-52, "#e8e1d2"], [-36, "#ddd5c4"], [0, "#cfc6b2"]]);
  const schwarzV = hoehenVerlauf(T, "schwarz", -92, 0, [[-92, "#3a3633"], [-62, "#2a2623"], [-36, "#1c1917"], [0, "#0e0c0b"]]);
  const schwarzF = hoehenVerlauf(T, "schwarzF", -92, 0, [[-50, "#36383c"], [-20, "#26282b"], [0, "#18191b"]]);
  const sHaar = [["#5a5450", 1, 0.12, 0.22], ["#000", 0.8, 0.12, 0.35]];
  const wuchs = (x, y) => (x > 112 ? 150 : x > 90 ? 112 : x < 34 ? 104 + (x - 14) * 2 : y > -38 ? 130 : 172 - (y + 72) * 0.6);
  const sGlanz = (cx, cy, rx, ry, d) => fleck(T, "!", cx, cy, rx, ry, "#6a6660", 0.32, d);
  const kern = hoehenVerlauf(T, "pKern", -79, -20, [[-60, "#4a4a52", 0], [-46, "#4a4a52", 0.2], [-36, "#4a4a52", 0.28], [-31, "#4a4a52", 0.16], [-20, "#4a4a52", 0]]);

  let s = "";
  /* ---- Ohren (unter dem Kopf → Grund vom Kopffell überdeckt), rund, dicht behaart, Licht oben; fernes Ohr dahinter ---- */
  s += teil(T, "pohrF", [[127, -87], [127.6, -94.4], [131.6, -97], [135.4, -95.2], [136, -88]], "#141210", haare(T, [[127, -87], [131.6, -97], [136, -88]], 20, -95, 1.2, sHaar, 40),
    fellKante(T, [[127.6, -94.2], [131.6, -96.8], [135.4, -95]], 18, 0.2, -1, "#2a2724", 0.1, 0.6), { weich: 1.2 });
  const ohr = [[119.6, -84], [119.8, -90.6], [123.2, -95], [128.2, -95.2], [131, -91], [130.4, -85]];
  s += teil(T, "pohr", ohr, T.lg("pohr", [[0, "#4a4642"], [0.5, "#24211e"], [1, "#121110"]]), sGlanz(123.6, -91.6, 3, 2, 0) + haare(T, ohr, 50, -95, 1.4, sHaar, 40, 0.3),
    fellKante(T, [[119.8, -86], [119.8, -90.6], [123.2, -95], [128.2, -95.2], [131, -91]], 36, 0, -1.1, "#1a1816", 0.11, 0.7), { weich: 1.6 });

  /* ---- ferne Läufe: Schwarz mit bläulichem Grau (10 % heller) ---- */
  const okk = (n, y0, y1) => `<rect x="0" y="-60" width="140" height="60" fill="${hoehenVerlauf(T, "pOkk" + n, y0, y1, [[y0, "#000", 0.35], [y1, "#000", 0]])}"/>`;
  s += teil(T, "pvbF", vbF, schwarzF, haare(T, vbF, 30, 96, 1.6, sHaar, 10) + okk("F", -38, -24), kralleB(T, 106.6, -3.4, 3, 2.8, 2, "#6a645a", "#3a362e", 0.7, T.fein !== false), { weich: 3.6 });
  s += teil(T, "phbF", hbF, schwarzF, haare(T, hbF, 30, 96, 1.6, sHaar, 10) + okk("F", -38, -24), kralleB(T, 55.4, -2.8, 3, 2.6, 2, "#6a645a", "#3a362e", 0.7, T.fein !== false), { weich: 3.6 });

  /* ---- Rumpf: weiß, mit schwarzem Sattelband und schwarzer Hüfte; Grenzen als verzahnte Haarkanten ---- */
  let n = "";
  n += bueschel(T, rumpf, 150, wuchs, 4.6, 0.32, ["#ffffff", 0.6], ["#8a8478", 0.22], { streu: 16 });
  n += haare(T, rumpf, 60, wuchs, 3, [["#fff", 1, 0.13, 0.55], ["#a8a090", 0.6, 0.12, 0.35]], 12, 0.2);
  const band = [[86, -82], [104, -82], [110, -77], [116, -70], [122, -60], [126, -52], [125, -40], [118, -32], [100, -32], [95.6, -40], [92.4, -52], [89, -66], [86.6, -76]];
  const hinten = [[14, -44], [18, -54], [24, -60.6], [33, -64.6], [44, -63], [52, -56], [57, -46], [58.6, -34], [56, -26], [20, -20]];
  n += T.form(band, schwarzV) + T.form(hinten, schwarzV);
  n += sGlanz(100, -72, 8, 3, -15) + sGlanz(110, -56, 4, 8, 20) + sGlanz(32, -56, 10, 4, -20);
  n += bueschel(T, band, 40, 112, 4, 0.3, ["#5e5852", 0.3], ["#000", 0.3]) + haare(T, band, 50, 110, 2.4, sHaar, 12) + haare(T, hinten, 40, (x, y) => (y < -40 ? 118 : 96), 2.2, sHaar, 12);
  /* Haarkanten: Schwarz greift ins Weiß und Weiß ins Schwarz, 6–10 Spitzen je Abschnitt */
  n += fellKante(T, [[86.6, -78], [89, -66], [92.4, -52], [95.6, -40], [99, -33]], 70, -1.8, 0.7, "#1d1a17", 0.08, 0.75) + fellKante(T, [[88, -74], [91, -60], [94, -46]], 40, 1.6, 0.5, "#f1ece1", 0.08, 0.7);
  n += fellKante(T, [[104, -80], [110, -77], [116, -70], [120, -63]], 40, 1.2, -1, "#1d1a17", 0.08, 0.75);
  n += fellKante(T, [[18, -54], [24, -60.6], [33, -64.6], [44, -63], [52, -56], [57, -46]], 60, 0.6, -1.4, "#1d1a17", 0.08, 0.75) + fellKante(T, [[22, -57], [32, -62], [44, -61], [51, -54]], 30, -0.4, 1.4, "#ece6d8", 0.08, 0.6);
  s += teil(T, "prumpf", rumpf, weissV, n,
    fellKante(T, [[24, -62], [32, -70], [46, -75], [62, -76.4], [80, -77.6]], 44, -2, -0.3, "#fff", 0.13, 0.7) +
    fellKante(T, [[80, -30.6], [64, -30.4], [50, -32.4]], 30, -1, 2.4, "#d9d1c0", 0.13, 0.7) +
    fellKante(T, [[100, -36.4], [94, -34.6], [86, -32.4]], 20, -1, 2.4, "#1d1a17", 0.12, 0.7), { weich: 10, ueber: kern });
  /* Stummelschwanz: weißer Fellbüschel */
  s += fellKante(T, [[21, -55], [19.6, -51.6]], 16, -2.4, 0.2, "#ece6d8", 0.16, 0.85);
  /* ---- nahe Läufe (schwarz), über dem Rumpf mit weichem Ansatz: Ellbogen, Unterarm verjüngt, Handwurzel-Knick ---- */
  s += teil(T, "phbN", hbN, schwarzV, haare(T, hbN, 50, (x, y) => (y < -20 ? 108 : 96), 1.8, sHaar, 10) + sGlanz(26, -20, 3, 7, 10) + okk("H", -32, -20),
    kralleB(T, 44.6, -2.8, 4, 2.8, 1.8, "#8a8478", "#3a362e", 0.7, T.fein !== false), { weich: 3, einblenden: [-34, -26] });
  s += teil(T, "pvbN", vbN, schwarzV, haare(T, vbN, 40, 96, 1.6, sHaar, 10) + sGlanz(100, -24, 2.4, 9, 0) + okk("V", -36, -24),
    kralleB(T, 118, -3.4, 4, 3, 2, "#8a8478", "#3a362e", 0.7, T.fein !== false) + fellKante(T, [[95.4, -32], [97.6, -24], [99, -16]], 14, -1.2, 1, "#2a2724", 0.1, 0.6) +
    (T.fein !== false ? `<path d="M116 -7.6q-.8 2.6 -.3 5.6M112 -8.8q-.8 2.8 -.3 6.8M108 -8.8q-.8 2.8 -.3 6.8" stroke="#000" stroke-width=".4" stroke-opacity=".6" fill="none"/>` : ""),
    { weich: 3, einblenden: [-40, -32] });

  /* ---- Kopf: rund, massig; Wange als große Wölbung mit Licht oben, kühlem Kernschatten unten, die über die Kieferlinie reicht ---- */
  let k = "";
  k += fleck(T, "!", 132, -66, 12, 8, "#ffffff", 0.45) + fleck(T, "!", 133, -58.4, 14, 3, "#8a8a92", 0.3) + fleck(T, "!", 136, -85, 9, 3, "#ffffff", 0.45);
  k += bueschel(T, kopf.filter((p) => p[0] < 150), 60, (x, y) => 160 + (y + 70) * 1.2, 2.4, 0.22, ["#ffffff", 0.55], ["#9a9488", 0.2]);
  k += haare(T, kopf, 120, (x, y) => (x > 150 ? 192 : 165 + (y + 66) * 1.3), 1.3, [["#fff", 1, 0.12, 0.55], ["#a8a090", 0.6, 0.11, 0.35]], 14);
  /* Augenfleck: schräger Tropfen (oben hinten rund, unten vorn spitz), Rand verzahnt */
  const fleckA = [[136.6, -77], [137.4, -80.6], [140.6, -82.4], [144, -81.6], [146, -78.6], [147.6, -73.6], [148.4, -69], [147.4, -66.6], [145, -67.4], [141.6, -70.6], [138.4, -73.6]];
  k += T.form(fleckA, T.rg("augenfleck", [[0, "#1c1a18"], [0.85, "#211e1b"], [1, "#2a2724"]], 0.35, 0.3, 0.75)) + haare(T, fleckA, 30, 140, 0.8, sHaar, 20);
  k += fellKante(T, [[136.6, -77], [137.4, -80.6], [140.6, -82.4], [144, -81.6], [146, -78.6], [147.6, -73.6], [148.4, -69], [147.4, -66.6], [145, -67.4], [141.6, -70.6], [138.4, -73.6], [136.6, -77]], 70, 0.4, 0.4, "#1c1a18", 0.06, 0.7);
  k += sGlanz(140, -80.6, 2.4, 0.8, -10);
  /* Mund: Philtrum senkrecht vom Nasenspiegel, Lippe schwarz waagerecht zurück bis unter das vordere Fleck-Drittel */
  k += zart(T, [[156.8, -64.4], [156.4, -62.4], [154.4, -61.7], [151, -61.6], [148.2, -61.9]], "#141210", 0.42, 0.9);
  let ka = fellKante(T, [[153.4, -59.4], [149.6, -57.6], [144, -56.2], [137, -55.2], [130, -55.4], [123, -57]], 60, -1.2, 1.6, "#ece6d8", 0.11, 0.8) +
    fellKante(T, [[117.4, -59], [120, -56.6], [123, -57]], 16, -1, 1.4, "#1d1a17", 0.1, 0.7);
  ka += nase2(T, 154.4, -72, 4.4, 3.6, 0.5);
  ka += augeTier(T, 141.2, -77.6, 1.05, { iris: "#2a1a10", iris2: "#100804", offen: 0.66, winkel: 14, pupille: "schlitz", wimpern: 7, wimpernFarbe: "#4a4642", lidstrich: 0.3 });
  if (T.fein !== false) ka += `<path d="M154 -64q3 -.2 5.6 .8M153.6 -64.8q3 -.8 5.8 -.6" stroke="#8a8070" stroke-width=".1" fill="none" opacity=".6"/>`;
  s += teil(T, "pkopf", kopf, weissV, k, ka, { weich: 6, einblendenX: [112, 117] });
  return { svg: s, box: [14, -97, 159.6, 0], fuesse: [33, 44, 99, 110], kopf: [110, -99, 162, -52] };
}

/* =====================================================================
   WASCHBÄR
   ===================================================================== */
/* RECHERCHE Waschbär (Procyon lotor): Kopf-Rumpf 40–70 cm, Schwanz 20–40 cm, Schulterhöhe 23–30 cm, 4–9 kg.
   Hinterbeine länger als Vorderbeine → im Gang Rücken hoch gewölbt („Buckel“), Hinterteil höher als Kopf, Kopf
   tief. Sohlengänger, Vorderpfoten wie schlanke Hände mit 5 langen Fingern. Fell dicht, grau meliert (Grannen mit
   schwarzen und hellen Spitzen), Bauch heller, Beine grau-bräunlich, Pfoten hell. Gesicht: schwarze bis
   dunkelbraune MASKE quer über die Augen, scharf abgesetzt von weißen „Augenbrauen“ darüber und weißer Schnauze,
   dunkler Strich von der Stirn zur Nase; Ohren gerundet-dreieckig mit weißem Rand; spitze schwarze Nase. Buschiger
   Schwanz mit 5–7 schwarzen und gelblich-grauen Ringen, Spitze schwarz. */
function waschbaer(T) {
  /* Kritik Runde 1 umgesetzt: Kopf ≈ 55 % der Schulterhöhe, kurze spitze Schnauze (Auge→Nase ≈ 36 % der Kopflänge), breiter
     runder Oberkopf, Backenbart; Maske schräg bis zum Kieferwinkel, spitz endend; dunkle Mittellinie; weiße Ohrränder; Hüfte
     ≈ 18 % über der Schulter; Hände mit fünf langen dunklen Fingern; Ringelschwanz als Zylinder mit gewölbten Ringgrenzen,
     hängend. */
  T.dichte = 0.85;
  const rumpf = [
    [24, -22], [25.6, -27.6], [30, -31.6], [37, -33.4], [45, -33], [53, -31], [60, -28.6], [66, -27], [71, -26.4], [74.4, -22], [73.4, -17.4],   // Rücken, Nacken
    [70, -14.6], [66, -12.6], [58, -11.6], [50, -12.2], [43, -13.6], [37, -15.8], [31, -18.6], [27, -20.4],                                         // Brust, Bauch
  ];
  const kopf = [[69.4, -21], [70.4, -25.6], [73, -28.4], [76.6, -29.4], [79.6, -28.6], [81.8, -26.6], [83.4, -24.4], [85, -23], [86, -21.8], [85.8, -20.6],
    [84.6, -20.1], [83.4, -19.7, 1], [82.6, -18.9], [80, -18.3], [76.6, -17.6], [73.6, -16.2], [71, -16.8], [69.4, -18.6]];
  const vbN = [[59.4, -20], [60, -14], [61, -9], [61.6, -5], [61.6, -2], [62.4, 0, 1], [65.6, 0, 1], [66.4, -0.8], [66, -1.8], [65, -3], [64.4, -5.4], [64.4, -9.6], [64.8, -15], [65.6, -20]];
  const hbN = [[36, -28], [31, -24], [29.8, -18], [31.4, -13], [33, -9.6], [32.6, -5.4], [32.6, -2], [33.6, 0, 1], [41.4, 0, 1], [42.2, -0.8], [41.8, -1.8], [40.4, -2.6], [38.6, -3.4], [36.4, -5.4], [36, -9.6],
    [38, -14], [41.6, -18.6], [42.6, -25]];
  const versetzt = (p, dx) => p.map((q) => [q[0] + dx, q[1], q[2]]);
  const vbF = versetzt(vbN, -5.4), hbF = versetzt(hbN, 6.4);

  const fell = hoehenVerlauf(T, "fell", -34, 0, [[-34, "#4e4943"], [-29, "#67615a"], [-22, "#857e74"], [-16, "#968e82"], [-11, "#7a7268"], [-5, "#57504a"], [0, "#4a443e"]]);
  const fellF = hoehenVerlauf(T, "fellF", -34, 0, [[-30, "#4c4843"], [-14, "#4e4842"], [0, "#38332e"]]);
  const grau = [["#100e0c", 1.3, 0.07, 0.6], ["#f0ebe1", 1, 0.06, 0.55], ["#8a7a62", 0.4, 0.07, 0.45]];
  const wuchs = (x, y) => (x > 68 ? 168 : y > -13 ? 96 : x < 34 ? 110 + (x - 24) * 3 : 172 - (y + 30) * 0.8);
  /* Hand/Fuß: lange dunkle Finger (Kritik: das Markenzeichen), Krallen an den Spitzen */
  const finger = (T_, x, y, n, L, fein) => {
    /* lange, nackte, dunkle Finger flach auf dem Boden, gestaffelt (hinten beginnend), je mit Knöchel, Glanz und Kralle */
    let f = "", g = "", kr = "";
    for (let i = n - 1; i >= 0; i--) {
      const bx = x - i * 1.35, l = L * (1 - Math.abs(i - 1.2) * 0.1), tx = bx + l, h = 1.2 - i * 0.08;
      f += `M${R(bx)} ${R(-h - 0.3)}C${R(bx + l * 0.35)} ${R(-h - 0.4)} ${R(bx + l * 0.7)} ${R(-h * 0.8)} ${R(tx)} ${R(-0.35)}Q${R(tx - 0.1)} 0 ${R(tx - 0.5)} 0L${R(bx + 0.8)} 0Q${R(bx)} 0 ${R(bx)} ${R(-h - 0.3)}Z`;
      g += `M${R(bx + l * 0.15)} ${R(-h - 0.22)}C${R(bx + l * 0.45)} ${R(-h - 0.28)} ${R(bx + l * 0.7)} ${R(-h * 0.7)} ${R(tx - 0.3)} ${R(-0.45)}`;
      kr += `M${R(tx - 0.3)} ${R(-0.5)}q.55 0 .7 .5`;
    }
    return `<path d="${f}" fill="#24201c" stroke="#0d0b09" stroke-width=".12" stroke-opacity=".6"/>` + (fein ? `<path d="${g}" stroke="#9a928a" stroke-width=".16" fill="none" stroke-opacity=".7"/>` : "") +
      `<path d="${kr}" stroke="#0d0b09" stroke-width=".25" fill="none" stroke-linecap="round"/>`;
  };

  let s = "";
  /* ---- Ohren: klein, gerundet-dreieckig; Rand weiß, dahinter dunkle Basis; Grund im Kopffell ---- */
  s += teil(T, "rohrF", [[74.8, -27.6], [75.6, -30.4], [77.2, -31.2], [78.4, -29.8], [78.6, -27.6]], "#2a2622", "", fellKante(T, [[75.6, -30.2], [77.2, -31], [78.4, -29.6]], 10, 0.2, -0.5, "#f0ebe1", 0.05, 0.7), { weich: 0.6 });
  const ohr = [[71.2, -27.4], [71.6, -30.4], [73, -32.2], [74.6, -31.4], [75.4, -28.8], [75, -27]];
  s += teil(T, "rohr", ohr, T.lg("rohr", [[0, "#cfc7b8"], [0.4, "#3a3530"], [1, "#1e1b18"]]), T.form([[72.4, -27.6], [72.8, -30], [73.6, -31], [74.4, -29.8], [74.4, -27.6]], "#191614", ' opacity=".5"'),
    fellKante(T, [[71.4, -27.8], [71.6, -30.4], [73, -32.2], [74.6, -31.4], [75.4, -28.8]], 24, 0, -0.5, "#f6f2ea", 0.05, 0.9), { weich: 0.7 });
  /* ---- ferne Beine: kühler, 15 % dunkler ---- */
  const fern = (name, pts) => teil(T, name, pts, fellF, haare(T, unten(pts, -12), 24, 95, 0.6, grau, 10) +
    `<rect x="0" y="-30" width="90" height="30" fill="${hoehenVerlauf(T, "rfO", -16, -6, [[-16, "#000", 0.3], [-6, "#000", 0]])}"/>`, "", { weich: 1 });
  s += fern("rvbF", vbF) + finger(T, 60.8, -1.2, 4, 3.8, T.fein !== false) + fern("rhbF", hbF) + finger(T, 48.4, -1.2, 4, 3.6, T.fein !== false);
  /* ---- Ringelschwanz: Zylinder, hängt locker nach hinten unten; Ringgrenzen als zur Spitze gewölbte Bögen ---- */
  const ach = [[28, -24], [22, -23.4], [16.6, -21], [12, -17.6], [8.6, -14], [6.6, -11]];
  const rt = rute(ach, [3.2, 4, 4.4, 4.4, 4, 3.2], 0);
  const P = (t) => { const f = t * (ach.length - 1), i = Math.min(ach.length - 2, Math.floor(f)), u = f - i, A = ach[i], B = ach[i + 1];
    const dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy); return { x: A[0] + dx * u, y: A[1] + dy * u, dx: dx / l, dy: dy / l }; };
  const bogen = (t, w) => { const p = P(t), b = w * 0.4; return [[p.x + p.dy * w, p.y - p.dx * w], [p.x + p.dx * b, p.y + p.dy * b], [p.x - p.dy * w, p.y + p.dx * w]]; };
  let ringe = "";
  for (let r = 0; r < 5; r++) {
    const t1 = 0.12 + r * 0.165, t2 = t1 + 0.075, A = bogen(t1, 6), B = bogen(t2, 6);
    ringe += `M${R(A[0][0])} ${R(A[0][1])}Q${R(A[1][0])} ${R(A[1][1])} ${R(A[2][0])} ${R(A[2][1])}L${R(B[2][0])} ${R(B[2][1])}Q${R(B[1][0])} ${R(B[1][1])} ${R(B[0][0])} ${R(B[0][1])}Z`;
  }
  const E = bogen(0.93, 6);
  ringe += `M${R(E[0][0])} ${R(E[0][1])}Q${R(E[1][0])} ${R(E[1][1])} ${R(E[2][0])} ${R(E[2][1])}L0 -4L0 -16Z`;
  let l = `<path d="${ringe}" fill="#1c1916" fill-opacity=".9"/>`;
  l += haare(T, rt.pts, 130, (x, y) => 150 - (x - 10) * 1.2, 1.4, [["#000", 1, 0.06, 0.55], ["#f2ece0", 0.9, 0.06, 0.55]], 22, 0.3);
  s += teil(T, "rschw", rt.pts, T.lg("rschw", [[0, "#c2b9a5"], [0.5, "#aca28d"], [1, "#7a7262"]]), l,
    fellKante(T, rt.ob, 30, -0.8, -0.5, "#7a7468", 0.05, 0.6) + fellKante(T, rt.un, 26, -0.5, 0.9, "#3a3630", 0.05, 0.55) + fellKante(T, [[7.4, -14.6], [4.2, -12.2], [4.4, -9]], 14, -0.9, 0.5, "#141210", 0.05, 0.7), { weich: 1.2 });
  /* ---- nahes Vorderbein (unter dem Rumpf): kräftiger, verjüngt zur Handwurzel; Hand mit langen Fingern ---- */
  s += teil(T, "rvbN", vbN, fell, haare(T, unten(vbN, -12), 30, 95, 0.6, grau, 10) + T.form([[61, -4.4], [64.6, -4.6], [66.4, -2.4], [66, 0.4], [61.6, 0.4]], T.lg("handO", [[0, "#b8b0a2", 0], [1, "#b8b0a2", 0.5]])),
    finger(T, 66.2, -1.6, 4, 4.4, T.fein !== false), { weich: 1 });

  /* ---- Rumpf: grau meliert (schwarze Grannenspitzen), Rückgrat dunkler, Bauch heller ---- */
  let n = fleck(T, "!", 50, -13.6, 14, 2.4, "#b8ae9c", 0.5);
  n += straehnen(T, rumpf, 120, wuchs, 2.6, 0.18, ["#0c0a08", 0.3], ["#f4efe6", 0.42], 14);
  n += haare(T, rumpf, 260, wuchs, 1.8, grau, 12, 0.2);
  s += teil(T, "rrumpf", rumpf, fell, n,
    fellKante(T, [[25.6, -27.6], [30, -31.6], [37, -33.4], [45, -33], [53, -31], [60, -28.6], [66, -27]], 60, -1.1, -0.3, "#3a3632", 0.06, 0.6) +
    fellKante(T, [[70, -14.6], [66, -12.6], [58, -11.6], [50, -12.2], [43, -13.6], [37, -15.8]], 40, -0.6, 1.2, "#b8b0a2", 0.06, 0.7) +
    fellKante(T, [[24.4, -26], [24.6, -22.6], [26.6, -20.6]], 16, -1, 0.3, "#5a5650", 0.06, 0.7), { weich: 3 });
  /* ---- nahes Hinterbein: Oberschenkel, Ferse, langer Fuß mit fünf Zehen ---- */
  s += teil(T, "rhbN", hbN, fell, haare(T, hbN, 50, (x, y) => (y < -12 ? 118 : 96), 0.9, grau, 10) + T.form([[32.6, -4.6], [36.4, -5], [38.6, -3.6], [40.6, -2.6], [40.6, 0.4], [33, 0.4]], T.lg("handO", [[0, "#b8b0a2", 0], [1, "#b8b0a2", 0.6]])),
    finger(T, 42, -1.8, 4, 4.2, T.fein !== false) + fellKante(T, [[31, -24], [29.6, -18], [31, -12]], 14, -0.8, 0.6, "#5a5650", 0.06, 0.6), { weich: 1.4, blende: [44, -30, 38, -22] });

  /* ---- Kopf ---- */
  let k = haare(T, kopf, 70, (x, y) => (x > 79 ? 192 : 176), 0.7, grau, 14);
  const braue = [[76, -26.4], [78.2, -28], [81.4, -28.2], [83.4, -26.2], [82.2, -25.8], [80.4, -26.6], [77.6, -26.2]];
  const schnauze = [[82.4, -22.6], [84, -23.6], [85.6, -22.4], [86, -21], [84.6, -20.1], [83.4, -19.7], [82.6, -18.9], [80, -18.3], [78, -18.6], [78.8, -20.6], [80.6, -21.8]];
  const maske = [[77.4, -26.2], [80.4, -26.8], [82.8, -25.6], [83.8, -23.8], [82.6, -22.6], [80.4, -22.2], [77.6, -21.4], [74.6, -20.2], [72.4, -19.4], [73.2, -21.4], [75.2, -23.8]];
  k += T.form(schnauze, T.rg("schn", [[0, "#f2ede4"], [0.8, "#e6dfd2"], [1, "#e6dfd2", 0.6]], 0.6, 0.4, 0.65)) + T.form(braue, T.rg("braue", [[0, "#f4efe6"], [0.75, "#ebe5da"], [1, "#ebe5da", 0.5]]));
  k += fleck(T, "!", 73.4, -18.4, 3, 1.8, "#e8e2d6", 0.85, -20);                                     // heller Wangenfleck hinter dem Maskenende
  k += T.form(maske, T.rg("maske", [[0, "#141210"], [0.75, "#1c1916"], [1, "#2e2a26", 0.6]], 0.55, 0.45, 0.6));
  k += T.form([[78.2, -28.6], [80.6, -27.4], [83, -25.2], [85, -23.2], [84.6, -22.8], [82.6, -24.6], [80.2, -26.4], [77.6, -27.8]], T.lg("mittel", [[0, "#2a2622", 0.35], [1, "#1a1714", 0.85]], 0, 0, 1, 0));
  k += haare(T, maske, 30, 175, 0.5, [["#000", 1, 0.05, 0.5], ["#5a5650", 0.8, 0.05, 0.5]], 16) + haare(T, schnauze, 34, 192, 0.5, [["#fff", 1, 0.05, 0.6], ["#a49c8e", 0.6, 0.05, 0.4]], 14) + haare(T, braue, 16, 180, 0.5, [["#fff", 1, 0.05, 0.6]], 14);
  k += fellKante(T, [[72.4, -19.4], [74.6, -20.2], [77.6, -21.4], [80.4, -22.2]], 14, -0.3, 0.6, "#141210", 0.05, 0.6) + fellKante(T, [[77.4, -26.2], [80.4, -26.8], [82.8, -25.6]], 10, -0.2, -0.5, "#141210", 0.05, 0.5);
  k += zart(T, [[85, -20.4], [83.6, -20], [82, -19.8], [80.8, -19.7]], "#1a1614", 0.16, 0.8);
  let ka = fellKante(T, [[71, -21], [69.6, -18.6], [70.6, -16.6], [73.6, -16.2], [76.6, -17.4]], 30, -0.9, 0.7, "#ece6da", 0.055, 0.8) + fellKante(T, [[70.6, -25], [69.6, -21.6]], 10, -0.8, 0.2, "#5a5650", 0.05, 0.6);
  const nase = [[84.8, -23], [85.8, -22.4], [86.4, -21.4], [86.2, -20.6], [85.4, -20.5], [84.8, -21.4]];
  ka += T.form(nase, T.lg("nase", [[0, "#3e3631"], [0.5, "#171311"], [1, "#0a0807"]])) + `<path d="M86.3 -21q-.4 -.2 -.6 .1q.2 .2 .5 .2" fill="#000"/><ellipse cx="85.4" cy="-22.3" rx=".35" ry=".14" fill="#fff" opacity=".5"/>`;
  ka += augeTier(T, 80.2, -24.4, 0.62, { iris: "#2a1a10", iris2: "#0e0805", offen: 0.8, winkel: 6, wimpern: 7, wimpernFarbe: "#3a3632", lidstrich: 0.2 });
  ka += T.schnurrhaare ? T.schnurrhaare(84, -20.6, 9, 4, 10, 36, "#ece6da", 0.05) : "";
  s += teil(T, "rkopf", kopf, fell, k, ka, { weich: 1.6, einblendenX: [69.4, 72] });
  return { svg: s, box: [2.4, -33.6, 86.4, 0], fuesse: [38, 44, 62, 66], kopf: [66, -34, 88, -14] };
}

/* =====================================================================
   HYÄNE (Tüpfelhyäne)
   ===================================================================== */
/* RECHERCHE Tüpfelhyäne (Crocuta crocuta): Kopf-Rumpf 0,95–1,65 m, Schulterhöhe 0,75–0,85 m, Schwanz 25–35 cm
   (dünn, mit schwarzer buschiger Quaste). Vorderbeine länger als Hinterbeine → Rücken fällt von der kräftigen
   Schulter zur niedrigen Kruppe ab; sehr kräftiger Hals und Nacken, kurze aufgerichtete Nackenmähne. Großer, breiter,
   runder Kopf mit kurzer, stumpfer, dunkler Schnauze; Ohren RUND (anders als Streifen-/Schabrackenhyäne). Zehengänger,
   4 Zehen, stumpfe, nicht einziehbare Krallen. Fell kurz, sandfarben bis gelblich-grau, mit unregelmäßigen dunkel-
   braunen bis schwärzlichen Flecken auf Rücken, Flanken, Keulen und Beinen (Flecken verblassen im Alter); Kopf
   ungefleckt, Gesicht dunkler. Augen dunkelbraun, groß. */
function hyaene(T) {
  /* Kritik Runde 1 umgesetzt: hoher Schulterhöcker über dem Ellbogen, Rücken zur kurzen, runden Kruppe abfallend; langer,
     dicker Hals, Kopf unter Schulterhöhe; Schädel mit durchgehend konvexem Profil bis zum Scheitelkamm, breite stumpfe Schnauze,
     lange Maulspalte; Flecken ohne Hof, dicht an Flanke/Keule, spärlich an Schulter/Hals, keine im Gesicht; kurze, raue Strähnen;
     Mähne flach nach hinten; Quaste als Haarpinsel; Sprunggelenk-Spitze, Handwurzel; Füße mit 4 Zehen, stumpfe Krallen. */
  T.dichte = 0.72;
  const dS = T.fein === false ? 0.8 : 1;   // Szene: Randhaare/Haare etwas sparsamer (≤ 25 KB)
  const rumpf = [
    [36, -60], [38.4, -66], [46, -69.6], [60, -72.4], [74, -76], [88, -80.4], [100, -84.2], [110, -85.8], [117, -84.4],   // kurze Kruppe, Rücken steigt zum Höcker
    [124, -80.6], [131, -75.6], [137, -70.4], [143, -66], [146, -60], [143.6, -53],                                    // dicker Hals mit Mähne (unter den Kopf)
    [137, -50.4], [129, -46.6], [121, -41.6], [113, -38.4],                                                            // Kehle, Brust
    [104, -37.6], [94, -39.2], [84, -43], [74, -46.6], [64, -49.6], [54, -52.4], [44, -55.6],                           // tiefe Brust, Flanke aufgezogen
  ];
  const kopf = [[137, -66], [139.4, -71.6], [144, -74.4], [150, -74.6], [155.4, -72.4], [159.8, -69], [163.4, -65.6], [166.4, -62.6], [168.6, -59.8], [169.4, -56.6], [169, -53.8],
    [167.6, -52.4], [165.6, -52, 1], [164.8, -50.6], [162, -49.6], [157, -49.2], [151, -49.8], [145.6, -51.2], [141, -54], [138, -59]];
  /* Vorderbein: Ellbogen unter dem Höcker, kräftiger gerader Unterarm, Handwurzel auf ≈ 15 %, Mittelhand vorgeneigt */
  const vbN = [[100, -66], [99.4, -54], [101.4, -44], [103, -32], [104, -20], [104.4, -14], [104.2, -11.4], [105.2, -8.6], [106, -5]].concat(pfoteZ(108.8, 10.6, 4.6),
    [[111.6, -6.2], [111, -9.4], [110.6, -12.4], [111, -15.4], [111.4, -22], [112.4, -32], [114.6, -42], [118, -52], [116, -64]]);
  /* Hinterbein: Oberschenkel als Teil der Rumpfkontur, Knie vorn, Sprunggelenk-Spitze ≈ 20 %, Mittelfuß senkrecht */
  const hbN = [[46, -70], [37.6, -63], [35.4, -54], [36.8, -44], [39.6, -34], [41.6, -26], [42, -20.6], [41, -17.2, 1], [42.4, -13], [43.2, -8], [43.4, -5]].concat(pfoteZ(46, 9.8, 4.4),
    [[48.4, -6], [48.4, -10], [48, -14.6], [49, -19], [52.6, -26], [57.6, -33], [62.6, -40], [65.4, -47], [65, -55], [60, -64], [52, -71]]);
  const vbF = glied([[98, -62], [93.6, -44], [92.6, -30], [91.4, -15], [91.4, -9], [92.2, -5]], [[6.4, 6.4], [5, 4.2], [3.8, 3.6], [3.2, 3.2], [2.8, 2.8], [2.6, 2.6]], pfoteZ(95, 9.8, 4.4));
  const hbF = glied([[54, -64], [64, -44], [61, -30], [56.6, -18.4], [57.4, -10], [58.2, -5]], [[9.6, 8], [7.4, 5.4], [5, 3.4], [3.2, 2.6], [2.6, 2.4], [2.4, 2.4]], pfoteZ(60.8, 9.4, 4.2), [3]);

  const fell = hoehenVerlauf(T, "fell", -88, 0, [[-88, "#a08a62"], [-74, "#b09870"], [-60, "#bea67c"], [-48, "#c6af86"], [-38, "#c1aa82"], [-20, "#b09872"], [0, "#8a7656"]]);
  const fellF = hoehenVerlauf(T, "fellF", -88, 0, [[-70, "#857250"], [-40, "#8a7656"], [-10, "#766446"], [0, "#5e4f38"]]);
  const sand = [["#4a3a22", 1, 0.12, 0.5], ["#f0e4c8", 0.8, 0.11, 0.5], ["#8a7048", 0.5, 0.12, 0.4]];
  const wuchs = (x, y) => (x > 118 ? 160 - (y + 70) * 0.6 : y > -42 && x > 70 ? 96 : x < 52 ? 112 + (x - 36) * 1.4 : 172 - (y + 75) * 0.5);
  /* Tüpfel: unregelmäßige Kleckse ohne Hof; Rand von Haaren verzahnt (Haare werden darübergelegt); Größe/Dichte nach Ort (g) */
  const flecken = (pts, n, rMin, rMax, farbe, op, g = () => 1) => {
    const [x0, y0, x1, y1] = T.box(pts);
    let d = "";
    const klecks = (x, y, r, e, rad, dreh) => {
      /* in Zehntel-cm, relativ – kurz */
      const P = rad.map((q, i) => { const a = i / 6 * Math.PI * 2; const px = Math.cos(a) * r * q, py = Math.sin(a) * r * q * e; return [G(x + px * Math.cos(dreh) - py * Math.sin(dreh)), G(y + px * Math.sin(dreh) + py * Math.cos(dreh))]; });
      const M = (i) => [Math.round((P[i % 6][0] + P[(i + 1) % 6][0]) / 2), Math.round((P[i % 6][1] + P[(i + 1) % 6][1]) / 2)];
      let c = M(0), t = `M${c[0]} ${c[1]}`;
      for (let i = 1; i <= 6; i++) { const q = P[i % 6], m = M(i); t += `q${q[0] - c[0]} ${q[1] - c[1]} ${m[0] - c[0]} ${m[1] - c[1]}`; c = m; }
      return t + "z";
    };
    if (T.fein === false) n = Math.round(n * 0.45);
    for (const [x, y] of streuPunkte(T, pts, n * 1.6)) {
      const gg = g(x, y);
      if (T.rnd() > gg) continue;
      const r = (rMin + Math.pow(T.rnd(), 1.4) * (rMax - rMin)) * (0.7 + gg * 0.3), e = 0.7 + T.rnd() * 0.35, rad = [0, 1, 2, 3, 4, 5].map(() => 0.72 + T.rnd() * 0.5);
      d += klecks(x, y, r, e, rad, T.rnd() * 3);
    }
    return fein10(d, `fill="${farbe}" fill-opacity="${op}"`);
  };

  let s = "";
  /* ---- Ohren: groß, RUND; Grund im Kopffell; Innenseite nur als helle Sichel vorn; Rand dunkelbraun ---- */
  s += teil(T, "hohrF", [[146, -72], [146.4, -77.6], [149.4, -80.8], [152.8, -79.6], [153.4, -73.6]], "#3e3020", "", fellKante(T, [[146.4, -77.4], [149.4, -80.6], [152.8, -79.4]], 14, 0.2, -0.8, "#2a2016", 0.1, 0.6), { weich: 1 });
  const ohr = [[139.6, -71.4], [139.4, -77.8], [142, -82.6], [146, -83.2], [148.4, -79.6], [148, -72.4]];
  const sichel = [[145.8, -82.2], [147.8, -79], [147.8, -73.6], [146.6, -74], [146.4, -78.6]];
  s += teil(T, "hohr", ohr, T.lg("hohr", [[0, "#2a2016"], [0.35, "#6a5636"], [1, "#9a8460"]]),
    T.form(sichel, "#ddcfae", ' opacity=".85"') + haare(T, sichel, 22, -80, 1.2, [["#f4e9d0", 1, 0.09, 0.8]], 24, 0.3) + haare(T, ohr, 30, -95, 1, [["#3a2c1c", 1, 0.1, 0.5]], 30),
    fellKante(T, [[139.6, -72.4], [139.4, -77.8], [142, -82.6], [146, -83.2], [148.4, -79.6]], 22, 0, -0.8, "#1e170e", 0.09, 0.7), { weich: 1.2 });

  /* ---- ferne Beine ---- */
  const fern = (name, pts, fl) => teil(T, name, pts, fellF, fl + haare(T, unten(pts, -40), 40, 94, 1, sand, 10) +
    `<rect x="40" y="-70" width="80" height="70" fill="${hoehenVerlauf(T, "hfO", -56, -26, [[-56, "#000", 0.3], [-26, "#000", 0]])}"/>`, "", { weich: 2 });
  s += fern("hvbF", vbF, flecken(unten(vbF, -40), 8, 0.6, 1.3, "#3a2a18", 0.6)) + fern("hhbF", hbF, flecken(unten(hbF, -50), 12, 0.7, 1.6, "#3a2a18", 0.6));
  s += pfote2(T, 95, 9.8, 4.4, { op: 0.8, kralle: "#2a241c", fell: "#6a5a40" }) + pfote2(T, 60.8, 9.4, 4.2, { op: 0.8, kralle: "#2a241c", fell: "#6a5a40" });
  /* ---- Schwanz: dünn, hängt; Quaste als Haarpinsel ---- */
  const sch = rute([[38, -64], [33, -61], [30.4, -55], [29.6, -48], [29.8, -42]], [1.8, 2, 1.9, 1.8, 1.8], 0);
  s += teil(T, "hschw", sch.pts, T.lg("hschw", [[0, "#a08a62"], [1, "#7a6648"]], 0, 0, 1, 0), haare(T, sch.pts, 30, 100, 1.2, sand, 14) + flecken(sch.pts, 3, 0.5, 0.8, "#3a2a18", 0.6), "", { weich: 0.8 });
  const qu = rute([[29.8, -45], [29.4, -40], [29.4, -35], [29.8, -31]], [2.2, 3.2, 3.4, 3], 0);
  s += teil(T, "hquaste", qu.pts, T.lg("hquaste", [[0, "#3a2c1c"], [1, "#100c08"]]), haare(T, qu.pts, 50, 96, 2.4, [["#000", 1, 0.12, 0.6], ["#5a4a36", 0.6, 0.12, 0.5]], 16, 0.3),
    fellKante(T, [[27, -39], [26.4, -34], [27.4, -30], [30, -29], [32.4, -30], [33, -34]], 60, 0, 3.6, "#0e0b08", 0.13, 0.85) + fellKante(T, qu.ob, 14, -0.8, 0.8, "#1a140e", 0.1, 0.7), { weich: 1.4 });

  /* ---- nahes Vorderbein (unter dem Rumpf) ---- */
  s += teil(T, "hvbN", vbN, fell, flecken(unten(vbN, -44), 14, 0.6, 1.4, "#3a2814", 0.7) + haare(T, unten(vbN, -50), 50, 94, 1, sand, 8) +
    `<rect x="95" y="-60" width="25" height="20" fill="${hoehenVerlauf(T, "hvS", -46, -36, [[-46, "#000", 0.2], [-36, "#000", 0]])}"/>`,
    pfote2(T, 108.8, 10.6, 4.6, { kralle: "#2a241c", fell: "#8a7656" }), { weich: 2.4 });
  /* ---- Rumpf: Flecken dicht an Flanke/Hüfte, spärlich und blass an Schulter und Hals ---- */
  let n = fleck(T, "!", 84, -44, 26, 3.4, "#d8c8a4", 0.5);
  const fleckZone = [[40, -64], [46, -68.4], [60, -71], [76, -74.6], [92, -79], [108, -82], [118, -80], [124, -72], [122, -58], [112, -44], [96, -41], [78, -45], [66, -50], [64, -62], [50, -66]];
  n += flecken(fleckZone, Math.round(46 * dS), 1, 2.6, "#3e2c18", 0.72, (x) => Math.max(0.15, Math.min(1, (120 - x) / 55)));
  n += flecken([[118, -82], [130, -76], [140, -66], [138, -56], [126, -52], [120, -64]], 8, 0.8, 1.6, "#4a3820", 0.4);
  n += fleck(T, "!", 112, -84, 12, 3, "#4a3820", 0.45, 6) + fleck(T, "!", 128, -77, 9, 2.6, "#4a3820", 0.4, 35);
  n += straehnen(T, rumpf, 150, wuchs, 2.8, 0.2, ["#3a2c18", 0.28], ["#f4e8cc", 0.34], 12);
  n += haare(T, rumpf, 170, wuchs, 1.8, sand, 12, 0.18);
  s += teil(T, "hrumpf", rumpf, fell, n,
    fellKante(T, [[88, -80.6], [100, -84.4], [110, -86], [117, -84.6], [124, -80.8], [131, -75.8], [137, -70.6]], 60 * dS, -2.6, -0.5, "#3a2a16", 0.1, 0.65) +
    fellKante(T, [[38.4, -66], [46, -69.6], [60, -72.4], [74, -76], [86, -79.8]], 40, -1.4, -0.3, "#8a7450", 0.09, 0.6) +
    fellKante(T, [[143.6, -53], [137, -50.4], [129, -46.6], [121, -41.6], [113, -38.4]], 30, -1, 1.4, "#c8b38a", 0.09, 0.7) +
    fellKante(T, [[104, -37.8], [94, -39.4], [84, -43.2], [74, -46.8], [64, -49.8]], 30, -0.8, 1.4, "#b8a27a", 0.09, 0.7), { weich: 6 });
  /* ---- nahes Hinterbein ---- */
  s += teil(T, "hhbN", hbN, fell, flecken(unten(hbN, -69), 30, 0.8, 2.2, "#3a2814", 0.72, (x, y) => (y < -30 ? 1 : 0.7)) +
    straehnen(T, hbN, 50, (x, y) => (y < -24 ? 112 + (x - 40) * 0.6 : 94), 2.4, 0.18, ["#3a2c18", 0.24], ["#f4e8cc", 0.3]) + haare(T, hbN, 70, (x, y) => (y < -24 ? 112 : 94), 1.2, sand, 10) +
    fleck(T, "", 41.4, -22, 0.9, 4, "#fff", 0.3, 20),
    fellKante(T, [[37.6, -63], [35.4, -54], [36.8, -44], [39.6, -34]], 24, -1.2, 1, "#8a7450", 0.09, 0.6) + pfote2(T, 46, 9.8, 4.4, { kralle: "#2a241c", fell: "#8a7656" }), { weich: 3, blende: [52, -73, 49, -67] });

  /* ---- Kopf: kein Fleck; Gesicht um die Augen dunkler; Schnauze schwärzlich als Verlauf mit Haarkante ---- */
  let k = haare(T, kopf, 120, (x, y) => (x > 158 ? 196 : 176 + (y + 62) * 1), 1, sand, 12);
  k += fleck(T, "!", 166, -57, 9, 9.6, "#1a140e", 0.9) + fleck(T, "!", 160, -60, 7, 9, "#2a2016", 0.6);
  k += fleck(T, "", 153, -64, 4, 3, "#2a2016", 0.35) + fleck(T, "", 147, -58, 6, 5, "#fff", 0.2);                      // dunkle Augenumgebung, Kaumuskel im Licht
  k += fleck(T, "", 152.6, -67.2, 2.8, 1.2, "#000", 0.4, 8);                                                         // Brauenschatten
  k += zart(T, [[166.6, -54], [162, -53.7], [158, -53.4], [154, -53.2], [150.4, -53.1], [149.2, -52.7]], "#0e0a06", 0.34, 0.9);   // lange Maulspalte bis hinter das Auge
  let ka = fellKante(T, [[141, -52.6], [145.6, -49.6], [151, -48.4], [157, -48.2]], 20, -1, 1.4, "#c8b38a", 0.08, 0.65) + fellKante(T, [[137.6, -60], [137, -66], [139.4, -71.4]], 16, -1.4, 0.2, "#8a7450", 0.08, 0.6);
  const nase = [[166, -63.6], [168.2, -62.4], [169.8, -59.6], [170, -56.6], [168.8, -55], [166.4, -55.4], [165.6, -58], [165.4, -61.4]];
  const naseS = T.form(nase, T.lg("nase", [[0, "#3e3631"], [0.5, "#171311"], [1, "#0a0807"]]));
  ka += T.fein !== false && T.relief ? `<g filter="${T.relief("nase", { f: 3, tiefe: 0.2, okt: 1 })}">${naseS}</g>` : naseS;
  ka += `<path d="M169.8 -57.4q-1 -.5 -1.6 .1q.4 .5 1.2 .5q-.6 .3 -1.6 .2" fill="#000"/><path d="M166.6 -63q1.4 .1 2.4 1.2" stroke="#fff" stroke-width=".3" stroke-opacity=".45" fill="none" stroke-linecap="round"/>`;
  ka += augeTier(T, 153.4, -65, 1.25, { iris: "#4a2c14", iris2: "#1a0e06", offen: 0.7, winkel: 8, wimpern: 9, lidstrich: 0.4, haut: 0.45 });
  ka += T.schnurrhaare ? T.schnurrhaare(164.4, -54.4, 5, 5, 12, 26, "#1a140e", 0.08) : "";
  s += teil(T, "hkopf", kopf, hoehenVerlauf(T, "hkopfF", -75, -48, [[-75, "#a68e66"], [-62, "#b49c74"], [-48, "#a8916a"]]), k, ka, { weich: 3.4, einblendenX: [137, 141.6] });
  return { svg: s, box: [26.4, -86, 170, 0], fuesse: [49, 63, 98, 112], kopf: [134, -86, 172, -45] };
}

module.exports = [
  { id: "wolf", de: "der Wolf", syl: "WOLF", it: "il lupo", itSyl: "LU-po", en: "wolf",
    gruppe: "Raubtiere", lebensraum: "Wald", laenge: 1.45, hoehe: 1.01, zeichne: wolf },
  { id: "fuchs", de: "der Fuchs", syl: "FUCHS", it: "la volpe", itSyl: "VOL-pe", en: "fox",
    gruppe: "Raubtiere", lebensraum: "Wald", laenge: 1.21, hoehe: 0.58, zeichne: fuchs },
  { id: "braunbaer", de: "der Braunbär", syl: "BRAUN-bär", it: "l'orso bruno", itSyl: "OR-so BRU-no", en: "brown bear",
    gruppe: "Raubtiere", lebensraum: "Wald", laenge: 2.11, hoehe: 1.13, zeichne: braunbaer },
  { id: "eisbaer", de: "der Eisbär", syl: "EIS-bär", it: "l'orso polare", itSyl: "OR-so po-LA-re", en: "polar bear",
    gruppe: "Raubtiere", lebensraum: "Arktis", laenge: 2.21, hoehe: 1.12, zeichne: eisbaer },
  { id: "panda", de: "der Panda", syl: "PAN-da", it: "il panda", itSyl: "PAN-da", en: "panda",
    gruppe: "Raubtiere", lebensraum: "Bambuswald", laenge: 1.46, hoehe: 0.97, zeichne: panda },
  { id: "waschbaer", de: "der Waschbär", syl: "WASCH-bär", it: "il procione", itSyl: "pro-CIO-ne", en: "raccoon",
    gruppe: "Raubtiere", lebensraum: "Wald", laenge: 0.84, hoehe: 0.34, zeichne: waschbaer },
  { id: "hyaene", de: "die Hyäne", syl: "hy-Ä-ne", it: "la iena", itSyl: "I-e-na", en: "hyena",
    gruppe: "Raubtiere", lebensraum: "Savanne", laenge: 1.44, hoehe: 0.86, zeichne: hyaene },
];
