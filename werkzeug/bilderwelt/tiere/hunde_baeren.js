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
function teil(T, name, pts, fill, innen = "", aussen = "", o = {}) {
  const d = typeof pts === "string" ? pts : T.glatt(gleich(pts));
  const id = T.id("t" + name);
  T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  let k = `<use href="#${id}" fill="${fill}"/>` + (innen ? `<g clip-path="url(#${id}c)">${innen}</g>` : "") + aussen;
  const mb = o.box || [-300, -400, 400, 50];
  /* erst Licht-Filter (sieht die volle Form), DANN die Ausblend-Maske – sonst entstünde am weichen Rand ein heller Lichtsaum */
  const f = volumen(T, o.weich || 4, o.tiefe || 2.6, o.umgebung != null ? o.umgebung : 0.4);
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
  /* Kritik Runde 1 umgesetzt: Kopf ≈ 37 % der Widerristhöhe (Fang gekürzt), Stop mit Knick, schlanker Unterkiefer;
     Vorderbeine nach vorn (Vorbrust ≈ 5 % vor dem Bein), Brust flacher (≈ 44 %), Läufe länger (≈ 56 %), Flanke aufgezogen,
     Kruppe ≈ 12° fallend, Sitzbeinhöcker; Hinterbein von Hand: breite Keule, Kniescheibe, Sprunggelenk-Spitze auf 26 %. */
  const W = 82;
  T.dichte = 0.72;   // Haar-/Strähnenmenge so, dass die Art ≤ 70 KB bleibt
  const rumpf = [
    [37, -72.2], [43, -75.8], [51, -77.8], [64, -78.4], [82, -79.2], [98, -80.4], [110, -82.4],           // Kruppe fällt, Lende, Rücken, Widerrist
    [119, -85.2], [127, -88.6], [134.5, -91.4], [141, -90], [146, -82], [146, -74],                     // Nacken (Mähne), unter dem Kopf
    [142, -71.4], [136.4, -66.4], [131, -59.6], [127.6, -52], [125.4, -47.6],                            // Kehle, Hals, Vorbrust
    [118, -45], [108, -45.4], [98, -46.6], [90, -48.4], [83, -51.6], [76, -55.6], [68, -57.8], [60, -58.6], // Brust (≈ 44 %), Bauch hochgezogen
    [50, -63], [40, -66.4], [34.6, -67.6],
  ];
  /* Kopf als eigener Körperteil: Scheitel, Stirn, Braue, Stop (Knick), Nasenrücken, Nase, Oberlippe, kleines Kinn, schlanker Unterkiefer */
  const kopf = [[133.4, -88], [135.6, -91.6], [140, -93.4], [146, -92.8], [149.2, -91.4], [151.8, -88.8, 1], [156, -86.8], [160.5, -85], [163.4, -84.1], [165.4, -82.6], [165.8, -80.6], [164.6, -79.2],
    [163.4, -78.2], [162.6, -77, 1], [161.6, -76], [159.4, -75.2], [153, -74.4], [147, -73.4], [142, -71.6], [137.6, -73], [134.4, -79]];
  /* nahes Vorderbein: Ellbogen, Unterarm verjüngt, Handwurzel mit Karpalballen (≈ 20 %), Vordermittelfuß ≈ 11° vorgeneigt */
  const vbN = [[108, -62], [106.6, -51], [107.4, -46.4], [109.2, -40], [110, -31], [110.2, -23], [109.8, -18.4], [110.6, -15.8], [111.2, -11], [112.2, -6.6]]
    .concat(pfoteZ(115.6, 11, 4.8), [[116.4, -8.6], [115.8, -12.8], [116, -16.2], [116.4, -18.6], [116, -24], [116.2, -32], [117.8, -40], [120.4, -46], [123.6, -53], [124, -60], [118, -66]]);
  /* nahes Hinterbein: Sitzbein, Hinterbacke, Achillessehne, Sprunggelenk-Spitze (≈ 26 %), senkrechter Mittelfuß; Knie vorn */
  const hbN = [[41, -73], [34.6, -67], [33.2, -59], [34.4, -49], [36.4, -40], [38, -31], [38.6, -25], [37.6, -21.4, 1], [39.2, -17.6], [40.2, -12], [40.6, -6.8]]
    .concat(pfoteZ(43.4, 10.4, 4.6), [[45.8, -7.2], [45.8, -13], [45.4, -19], [44.6, -23], [47.6, -30], [53.4, -38], [59.6, -45], [64.2, -50.4], [65.4, -54.6], [63.4, -60], [58, -66], [50, -74]]);
  /* ferne Beine: eigene Stellung (halber Schritt versetzt), kein Abklatsch */
  const vbF = glied([[104, -60], [99.6, -46], [99.6, -32], [99.2, -18], [99.8, -11], [100.8, -5.6]],
    [[8, 8], [5.8, 5], [4, 4.2], [3.4, 3.4], [2.8, 3], [2.6, 2.8]], pfoteZ(104, 10.4, 4.5));
  const hbF = glied([[55, -66], [68, -49], [61, -34], [52.6, -22.4], [53.8, -12], [55.4, -5.6]],
    [[12, 10], [9, 6.6], [6.2, 3.8], [4, 2.6], [2.6, 2.4], [2.5, 2.4]], pfoteZ(58.4, 10, 4.4), [3]);

  /* Farben: Flanke grau-ocker, Unterseite creme (eigene Form), Läufe lohfarben */
  const fell = hoehenVerlauf(T, "fell", -96, 0, [[-96, "#68625a"], [-80, "#7d766c"], [-66, "#918674"], [-54, "#a2906f"], [-46, "#ad946a"], [-30, "#bf9c6c"], [-12, "#b88f5d"], [0, "#9a754c"]]);
  const fellF = hoehenVerlauf(T, "fellF", -96, 0, [[-90, "#5a554f"], [-60, "#6f665a"], [-44, "#7a6a55"], [-12, "#776048"], [0, "#5e4b38"]]);
  const sattel = hoehenVerlauf(T, "sattel", -95, -58, [[-95, "#1a1714", 0.88], [-86, "#26211c", 0.66], [-74, "#38312a", 0.32], [-60, "#38312a", 0]]);
  const grau = [["#16130f", 1, 0.13, 0.6], ["#efe6d6", 0.7, 0.12, 0.6], ["#a07d52", 0.4, 0.13, 0.5]];
  const lauf = [["#5e4428", 1, 0.11, 0.5], ["#f0e1c2", 0.9, 0.1, 0.55]];
  /* Wuchsrichtung: Kopf → hinten, Hals → hinten unten, Schulter → schräg unten, Rumpf → hinten (unten zur Bauchkante gebogen),
     Keule → von der Hüfte strahlend nach hinten unten, Läufe → unten */
  const wuchs = (x, y) => {
    if (y > -47 && x > 96) return 94;
    if (y > -56 && x < 70) return 96;
    if (x > 136) return 178;
    if (x > 118) return 150 - (y + 88) * 1.2;
    if (x > 99) return 128 - (x - 99) * 0.4 + (y + 80) * 0.3;
    if (x < 58) return 112 + (x - 40) * 1.6;
    return 176 - (y + 80) * 1.1;
  };

  let s = "";
  const fein = T.fein !== false;
  /* ---- fernes Ohr, dann nahes Ohr: HINTER dem Kopf gezeichnet → der Grund wächst aus dem Kopffell ---- */
  const ohrF = [[141.6, -92.6], [143.2, -99.6], [144.6, -101.6], [146, -100], [147.6, -93.2]];
  s += teil(T, "wohrF", ohrF, T.lg("ohrF", [[0, "#2a241f"], [1, "#5d5244"]]), "", fellKante(T, [[143.4, -99.6], [144.6, -101.4], [146, -99.8], [147.2, -95]], 10, 0.8, -0.3, "#2e2822", 0.11, 0.6), { weich: 1 });
  const ohr = [[135.4, -90.4], [136.6, -97.2], [138.8, -102.2], [140.6, -103], [142.2, -100.4], [144.6, -93.6], [144.6, -88.6], [137, -88]];
  const sichel = [[141.6, -101], [143, -97.6], [144.2, -93.4], [142.2, -93], [141.6, -97.4]];
  s += teil(T, "wohr", ohr, T.lg("ohr", [[0, "#2e2822"], [0.35, "#6e604f"], [1, "#9c8466"]]),
    T.form(sichel, T.lg("ohrI", [[0, "#d8c8a8"], [1, "#7a6a54"]])) + haare(T, sichel, 26, -70, 1.6, [["#f6eedd", 1, 0.09, 0.85]], 20, 0.3) + haare(T, ohr, 40, -82, 1.1, [["#2a241e", 1, 0.1, 0.5], ["#c9b08a", 0.7, 0.1, 0.55]], 14),
    fellKante(T, [[135.6, -91], [136.6, -97.2], [138.8, -102.2], [140.6, -103]], 14, -0.7, -0.5, "#2e2822", 0.1, 0.65) + fellKante(T, [[141.4, -101.6], [142.6, -98], [144, -94]], 14, 1.1, -0.4, "#f2e8d4", 0.08, 0.8), { weich: 1.4 });

  /* ---- ferne Beine: Körperton, 15–20 % dunkler und kühler; oben Schlagschatten des Rumpfs ---- */
  const fern = (name, pts, innen) => teil(T, name, pts, fellF, innen + `<rect x="0" y="-70" width="140" height="70" fill="${hoehenVerlauf(T, "fernO", -58, -26, [[-58, "#000", 0.25], [-44, "#000", 0.15], [-26, "#000", 0]])}"/>`, "", { weich: 2 });
  s += fern("wvbF", vbF, haare(T, unten(vbF, -46), 40, 94, 1.3, lauf, 8)) + fern("whbF", hbF, haare(T, unten(hbF, -50), 46, (x, y) => (y < -30 ? 118 : 95), 1.4, lauf, 10));
  s += pfote2(T, 104, 10.4, 4.5, { op: 0.75, kralle: "#15110d", fell: "#8a7458" }) + pfote2(T, 58.4, 10, 4.4, { op: 0.75, kralle: "#15110d", fell: "#8a7458" });

  /* ---- Rute: hängt mit Spalt hinter der Keule, größte Breite ≈ 13 % (Mitte), Wurzel ≈ 70 %, Violdrüse, dunkler Haarpinsel ---- */
  const rt = rute([[38, -71.6], [32.4, -68.6], [27.6, -61.6], [25.4, -52], [24.8, -42], [25.2, -32], [26, -25.4]], [3.6, 4.2, 4.8, 5.3, 5.2, 4.4, 2.8], 0);
  s += teil(T, "wrute", rt.pts, hoehenVerlauf(T, "rute", -74, -19, [[-74, "#7a7064"], [-56, "#948775"], [-38, "#7d7262"], [-28, "#3a342d"], [-22, "#161310"]]),
    fleck(T, "", 31.6, -66.4, 3.6, 2.6, "#1a1612", 0.75, -40) +
    straehnen(T, rt.pts, 70, (x, y) => 100 - (y + 50) * 0.5, 4.2, 0.4, ["#1e1a16", 0.3], ["#f1e8d8", 0.3], 10) +
    haare(T, rt.pts, 110, (x, y) => 98 - (y + 50) * 0.5, 3.6, [["#1d1915", 1.1, 0.12, 0.55], ["#f3eadb", 0.7, 0.11, 0.55]], 12, 0.3),
    fellKante(T, rt.ob.slice(1), 40, -1.4, 1.9, "#4a443b", 0.11, 0.6) + fellKante(T, rt.un.slice(2), 26, 0.5, 2, "#3a342d", 0.1, 0.5) +
    fellKante(T, [[22.4, -30], [24.6, -24.4], [27.6, -24], [29.6, -28]], 26, 0.2, 3.4, "#14110e", 0.12, 0.75), { weich: 2.6 });

  /* ---- nahes Vorderbein: UNTER dem Rumpf gezeichnet – der Unterarm kommt unter der Brust (mit Bauchfransen) hervor ---- */
  let v = fleck(T, "!", 115.6, -30, 0.8, 9, "#2a1d10", 0.6) + fleck(T, "", 110.2, -17, 1, 1.4, "#000", 0.3);
  v += haare(T, unten(vbN, -50), 80, 94, 1.2, lauf, 6) + `<rect x="100" y="-50" width="30" height="20" fill="${hoehenVerlauf(T, "vbS", -47, -36, [[-47, "#000", 0.25], [-36, "#000", 0]])}"/>`;
  s += teil(T, "wvbN", vbN, fell, v, fellKante(T, [[106.6, -51], [107.4, -46.4], [109, -41]], 10, -1.2, 1.2, "#8a7254", 0.09, 0.6) +
    pfote2(T, 115.6, 11, 4.8, { kralle: "#17120e", fell: "#c9a06a", afterkralle: [111.2, -10.6] }), { weich: 2.2 });

  /* ---- Rumpf mit Hals ---- */
  let n = "";
  /* Sattel von Nacken bis Kruppe (schwarzgespitzte Grannen), unregelmäßiger Unterrand; Schulterstreif schräg und weich */
  n += T.form([[34, -77], [50, -80.6], [70, -81.4], [94, -83.6], [112, -86.6], [126, -92], [136, -96], [137, -87], [131, -78], [124, -69], [116, -66], [104, -64], [94, -66.6], [82, -64.4], [70, -67.4], [58, -64.6], [46, -67], [38, -70]], sattel);
  n += fleck(T, "!", 117, -72, 2.6, 11, "#2a241e", 0.4, -22);
  /* cremefarbene Unterseite: Kehle, Vorbrust, Bauch, Hosen */
  n += fleck(T, "!", 104, -46, 15, 3.4, "#ede2ca", 0.8) + fleck(T, "!", 84, -51, 11, 3, "#ede2ca", 0.6, -22) + fleck(T, "!", 128, -55, 4, 10, "#ede2ca", 0.75, 25) + fleck(T, "!", 138, -67, 4, 5, "#ede2ca", 0.7, 35);
  /* nur anatomische Formschatten (fein): hinter dem Schulterblatt, Flankenfalte vor dem Oberschenkel */
  n += fleck(T, "", 103.6, -57, 2.4, 8, "#000", 0.2, 12) + fleck(T, "", 66, -57, 2.6, 7, "#000", 0.25, -22);
  const wuchsR = (x, y) => wuchs(x, y);
  const rumpfH = rumpf.concat([[60, -60]]);
  n += straehnen(T, rumpfH, 150, wuchsR, 5, 0.42, ["#2c2620", 0.22], ["#f0e6d4", 0.24], 10);
  n += haare(T, rumpfH, 120, wuchsR, 4.6, grau, 10, 0.3);
  s += teil(T, "wrumpf", rumpf, fell, n,
    fellKante(T, [[43, -75.4], [51, -77.4], [64, -78], [82, -78.8], [98, -80], [110, -82]], 50, -1.8, -0.2, "#5a5248", 0.09, 0.6) +
    fellKante(T, [[110, -82], [119, -84.8], [127, -88.2], [134.5, -91]], 44, -3.2, -0.25, "#3a342d", 0.1, 0.6) +
    fellKante(T, [[142, -71.4], [136.4, -66.4], [131, -59.6], [127.6, -52], [125.4, -47.6]], 40, -2, 2, "#efe4cf", 0.1, 0.8) +
    fellKante(T, [[118, -45.4], [108, -45.6], [98, -46.8], [90, -48.6], [83, -51.8], [76, -55.8]], 44, -1.4, 1.8, "#ece0c8", 0.09, 0.75), { weich: 10 });

  /* ---- nahes Hinterbein (Keule wächst weich aus dem Rumpf) ---- */
  const keule = [[34, -68], [42, -74], [52, -76], [62, -66], [64, -55], [58, -45], [48, -36], [39, -30], [35, -44], [33.6, -58]];
  let h = fleck(T, "!", 36, -52, 3.4, 12, "#e8dcc2", 0.55, -5) + fleck(T, "", 39.4, -28, 0.8, 5, "#fff", 0.35, 22) + fleck(T, "", 42.2, -27, 0.8, 4.6, "#000", 0.3, 22);
  h += straehnen(T, keule, 46, wuchs, 4, 0.34, ["#2a2119", 0.22], ["#f5ead6", 0.26]) + haare(T, keule, 40, wuchs, 3.4, grau, 10, 0.25);
  h += haare(T, unten(hbN, -40), 80, (x, y) => (y < -24 ? 110 : 94), 1.3, lauf, 8);
  s += teil(T, "whbN", hbN, fell, h, fellKante(T, [[34.6, -66.6], [33.2, -59], [34.4, -49], [36.4, -40]], 30, -1.6, 1.4, "#e8dcc2", 0.09, 0.65) +
    pfote2(T, 43.4, 10.4, 4.6, { kralle: "#17120e", fell: "#c9a06a" }), { weich: 3.6, einblenden: [-76, -62] });
  /* ---- Kopf (eigener Teil, hinten weich in den Hals) ---- */
  let k = "";
  const maske = [[146.6, -84.6], [151.4, -84.2], [156, -82.6], [161, -81.4], [164.4, -79.6], [163.4, -78], [162.4, -76.6], [159.4, -75.2], [153, -74.4], [147, -73.4], [142, -71.6], [138.6, -73], [138, -78.6], [141.4, -83]];
  const stirn = [[134, -90], [140, -93.4], [146, -92.8], [149.2, -91.4], [151.8, -88.8], [156, -86.8], [160.5, -85], [163.4, -84.1], [158, -84.4], [150, -86.4], [142, -86.6], [134, -86]];
  k += T.form(stirn, T.lg("stirn", [[0, "#3a332b", 0.5], [1, "#3a332b", 0]])) + fleck(T, "!", 157.6, -85, 6.6, 1.7, "#a37a48", 0.75, 21);
  /* helle Maske aus weichen Flecken (keine Kante): Oberlippe, Wange, Lefzenbereich cremeweiß, Unterkiefer grauer */
  k += fleck(T, "!", 155.4, -79.4, 9.6, 3, "#f2eadb", 0.95, 8) + fleck(T, "!", 146, -78.4, 7.4, 5.4, "#efe6d4", 0.95) + fleck(T, "!", 140, -75.4, 4.6, 4.6, "#ece2ce", 0.9) +
    fleck(T, "!", 153, -75.6, 9, 1.6, "#d6cab2", 0.7, 5);
  k += haare(T, stirn, 70, (x, y) => (x > 151 ? 198 : 184), 1, [["#1e1a16", 1, 0.09, 0.6], ["#efe6d6", 0.8, 0.09, 0.6], ["#9b7a52", 0.4, 0.09, 0.5]], 12);
  k += haare(T, maske, 90, (x, y) => (x > 151 ? 188 : 160 - (y + 78) * 2), 1.1, [["#a8987a", 0.6, 0.08, 0.5], ["#fff", 1, 0.08, 0.6]], 12);
  /* Haarkante grau → creme über der Lefze (statt einer Konturlinie) */
  k += fellKante(T, [[139, -81], [145, -83], [151, -83], [157, -81.6]], 30, 1.4, 0.8, "#5a5248", 0.07, 0.45);
  k += haare(T, kopf, 60, (x, y) => (x > 150 ? 190 : 170), 1.4, grau, 12);
  /* Augenhöhle: Brauenwulst wirft Schatten aufs Oberlid; heller Überaugenfleck direkt über dem Lid; Strich vom Außenwinkel zum Ohr */
  k += fleck(T, "", 148, -89.6, 3.4, 1.6, "#000", 0.4, 16) + fleck(T, "!", 147.4, -91.4, 2.4, 0.9, "#f3ead6", 0.9, 14) + fleck(T, "", 142, -90.4, 3.4, 0.6, "#000", 0.4, 22);
  /* Lefze: schwarz, fast waagerecht, endet unter dem vorderen Augenwinkel mit nur angedeutetem Winkel */
  k += zart(T, [[163.6, -77.9], [160.4, -77.7], [156.4, -77.6], [152.4, -77.5], [150.4, -77.6], [149.6, -77.9]], "#120d0a", 0.34, 0.95);
  let ka = fellKante(T, [[146, -82], [144, -77], [141.6, -72.6]], 20, -2.2, 1.4, "#f2e9d8", 0.09, 0.8) + fellKante(T, [[136, -90.6], [134.4, -84], [135, -78]], 16, -2, 0.6, "#3a332b", 0.09, 0.6);
  /* Nase: Oberkante bündig mit dem Nasenrücken, schräge Vorderfläche, leicht über die Oberlippe, Komma-Nasenloch mit Schlitz */
  const nase = [[162, -84.2], [164.2, -83.5], [165.6, -82.2], [166, -80.6], [165.2, -79.5], [163.6, -79.6], [162.4, -80.6], [161.6, -82.6]];
  const naseS = T.form(nase, T.lg("nase", [[0, "#3d3631"], [0.5, "#181412"], [1, "#0b0908"]]));
  ka += fein && T.relief ? `<g filter="${T.relief("nase", { f: 3.6, tiefe: 0.35, okt: 1 })}">${naseS}</g>` : naseS;
  ka += `<path d="M165.5 -81q-.9 -.5 -1.5 .2q.3 .5 1 .5q-.6 .3 -1.6 .1" fill="#000"/><path d="M163 -83.7q1.4 -.2 2.3 .6" stroke="#fff" stroke-width=".3" stroke-opacity=".5" fill="none" stroke-linecap="round"/>`;
  ka += augeTier(T, 148.4, -88.4, 1.22, { iris: "#d6a02e", iris2: "#7a4a12", offen: 0.6, winkel: 17, wimpern: 10, lidstrich: 0.8 });
  if (fein) ka += `<path d="M157.6 -79.6h.01M159 -79.9h.01M160.4 -80.2h.01M158.2 -78.8h.01M159.6 -79.1h.01M161 -79.4h.01" stroke="#2a1f17" stroke-width=".35" stroke-linecap="round" opacity=".55"/>`;
  ka += T.schnurrhaare ? T.schnurrhaare(160.4, -79.4, 6, 6, 12, 26, "#231c16", 0.1) : "";
  /* Kopflänge ≈ 37 % der Widerristhöhe: Kopf um 8 % kürzer gesetzt (vom Hinterhaupt aus) */
  s += `<g transform="translate(133.4 0) scale(.92 1) translate(-133.4 0)">` + teil(T, "wkopf", kopf, fell, k, ka, { weich: 3.6, einblendenX: [133.4, 138] }) + `</g>`;
  return { svg: s, box: [19.6, -103, 163.5, 0], fuesse: [46, 61, 107, 119], kopf: [132, -105, 166, -68] };
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
  /* Kritik Runde 1 umgesetzt: Kopf ≈ 46 % der Widerristhöhe, Stirnwölbung + Stop, Auge→Nase : Auge→Hinterhaupt ≈ 1,0;
     Lunte ≈ 65 % der Kopf-Rumpf-Länge, schmale Wurzel, weiße Pinselspitze; Taille aufgezogen; Strümpfe nach Natur. */
  T.dichte = 0.7;
  const rumpf = [
    [25, -36.4], [30, -38.8], [39, -39.6], [49, -38.8], [58, -39.4], [66, -40.6], [72, -42.4], [76.6, -44.6], [80, -45.4],  // Rücken, Widerrist, Nacken
    [83.4, -42], [84, -37.4], [82.4, -33.6], [79, -30.6], [75, -27.4], [71, -23.6], [67, -20.6],                          // unter dem Kopf, Kehle, Brust
    [60, -19.6], [52, -20.4], [45, -22.6], [40, -25], [35, -26.4], [29, -28.8], [25.6, -32],                                 // Bauch, Taille aufgezogen
  ];
  const kopf = [[78.2, -42.6], [79.6, -46], [82.4, -47.8], [85.4, -48.1], [88, -47.2], [89.8, -45.8, 1], [92.4, -44.4], [95, -42.9], [96.3, -41.9], [96.8, -40.4], [96.3, -39.4],
    [95.2, -39], [94.2, -38.7, 1], [93.2, -38.1], [91, -37.4], [87.6, -36.9], [84.4, -36.6], [81.4, -37.2], [79.2, -39.4]];
  const vbN = [[61, -30], [62.6, -24], [63.4, -18], [64, -12], [64.2, -8.4], [64.4, -6.4]].concat(pfoteZ(66.4, 5.8, 2.7),
    [[67.6, -5.4], [67.4, -7.6], [67.8, -9.6], [68.2, -14], [68.8, -20], [70.4, -25], [72, -30], [68, -34]]);
  const hbN = [[31, -38], [26.4, -35.6], [24, -31], [23.8, -25.6], [24.8, -19.6], [25.6, -14.6], [25, -11.2], [24.6, -10.2, 1], [25.6, -7], [25.9, -3.8]].concat(pfoteZ(27.6, 5.6, 2.6),
    [[28.6, -5], [28.7, -8], [28.6, -11.4], [29.6, -14.4], [32.6, -19], [36, -23], [38.6, -26.6], [38.6, -30], [36, -35]]);
  const vbF = glied([[60, -28], [57.6, -20], [57.6, -12], [57.4, -8], [57.8, -4.6]], [[3.2, 3.2], [2.4, 2.4], [1.8, 1.9], [1.7, 1.8], [1.5, 1.6]], pfoteZ(59.4, 5.6, 2.6));
  const hbF = glied([[33, -32], [39.4, -23.6], [35.4, -16], [32.2, -10.6], [32.8, -5.4], [33.4, -2.6]], [[6, 5], [5, 3.4], [3.6, 2.4], [2.1, 1.5], [1.5, 1.4], [1.4, 1.4]], pfoteZ(34.6, 5.4, 2.5), [3]);

  const fell = hoehenVerlauf(T, "fell", -50, 0, [[-50, "#9a421a"], [-42, "#ad4e1c"], [-34, "#c25e24"], [-27, "#c86b30"], [-21, "#bd672e"], [-14, "#a35a2c"], [0, "#7a4424"]]);
  const fellF = hoehenVerlauf(T, "fellF", -50, 0, [[-40, "#7a3a18"], [-24, "#83461f"], [-12, "#6a3a1e"], [0, "#4a2a16"]]);
  const rot = [["#5d2509", 1.1, 0.11, 0.5], ["#f6b676", 0.9, 0.1, 0.55], ["#2a1a10", 0.3, 0.11, 0.45], ["#e6dccd", 0.25, 0.09, 0.45]];
  const schwarz = [["#000", 1, 0.09, 0.55], ["#7a4a2a", 0.6, 0.08, 0.5]];
  const wuchs = (x, y) => (x > 74 ? 150 - (y + 42) * 1.4 : y > -22 ? 94 : x < 38 ? 112 + (x - 25) * 1.6 : 176 - (y + 38) * 0.8);
  /* Strumpf: Schwarz mit Haarkante; rote Grannen eingemischt */
  const strumpf = (pts, n, kante) => T.form(pts, hoehenVerlauf(T, "strumpf", -30, 0, [[-30, "#1a120d", 0], [-24, "#1a120d", 0.85], [0, "#0d0907", 1]])) + haare(T, pts, n, 94, 0.8, [["#000", 1, 0.08, 0.6], ["#a0522a", 0.4, 0.07, 0.5]], 8) +
    (kante ? fellKante(T, kante, 16, 0.1, -1.2, "#140d09", 0.07, 0.8) : "");

  let s = "";
  /* ---- Ohren (hinter dem Kopf): groß, spitz; Rückseite schwarz, Basis rotbraun, vorn nur eine Sichel aus weißem Innenhaar ---- */
  const ohrF = [[84, -46], [85.4, -51], [87, -54.8], [88, -54.6], [88.8, -50.6], [89.4, -46]];
  s += teil(T, "fohrF", ohrF, T.lg("fohrF", [[0, "#0e0a08"], [0.6, "#24160e"], [1, "#6a3416"]]), "", fellKante(T, [[87.2, -54.4], [88.4, -51], [89, -47.6]], 10, 0.5, -0.1, "#1a120c", 0.07, 0.6), { weich: 0.8 });
  const ohr = [[79.6, -45.6], [80.4, -50.4], [82, -55.2], [83.2, -57.2], [84.6, -55.4], [86.4, -50.8], [87.4, -46.4], [83, -44.6]];
  const sichel = [[83.6, -56], [85, -52.6], [86.4, -48], [85, -47.6], [84, -52.4]];
  s += teil(T, "fohr", ohr, T.lg("fohr", [[0, "#0d0907"], [0.5, "#1b120c"], [0.78, "#4a2410"], [1, "#9a4a1c"]]),
    T.form(sichel, T.lg("fohrI", [[0, "#e8dccb"], [1, "#b8a08a"]])) + haare(T, sichel, 30, -75, 1.4, [["#fbf6ee", 1, 0.08, 0.85]], 22, 0.3),
    fellKante(T, [[79.8, -46.4], [80.4, -50.4], [82, -55.2], [83.2, -57.2]], 14, -0.6, -0.3, "#120c09", 0.07, 0.6) + fellKante(T, [[83.6, -56.4], [85, -52.6], [86.6, -48]], 14, 0.8, -0.3, "#f6efe4", 0.07, 0.85), { weich: 1 });

  /* ---- ferne Beine: Körperton, dunkler und kühler; Strümpfe ---- */
  const fern = (name, pts, str) => teil(T, name, pts, fellF, strumpf(str, 20) + `<rect x="20" y="-34" width="60" height="34" fill="${hoehenVerlauf(T, "ffO", -30, -14, [[-30, "#000", 0.3], [-14, "#000", 0]])}"/>`, "", { weich: 1 });
  s += fern("fvbF", vbF, [[59.4, -21], [61, -21], [59.6, -14], [59.6, -9], [60.4, -6], [62.6, -3], [62.6, 0.6], [55, 0.6], [55.6, -5], [56, -8], [57.4, -11], [58.4, -16]]);
  s += fern("fhbF", hbF, [[30, -11.6], [31.4, -12.6], [32.4, -11.6], [33.6, -12.4], [34.4, -7], [36.6, -3], [37.6, 0.6], [30, 0.6], [30.6, -6], [30, -10]]);
  s += pfote2(T, 59.4, 5.6, 2.6, { op: 0.8, kralle: "#2a2420", fell: "#3a2a20" }) + pfote2(T, 34.6, 5.4, 2.5, { op: 0.8, kralle: "#2a2420", fell: "#3a2a20" });

  /* ---- Lunte: lang (≈ 65 % der Kopf-Rumpf-Länge), schmale Wurzel unter der Kruppe, größte Breite hinten, weiße Pinselspitze ---- */
  const lt = rute([[28.6, -33.4], [21.6, -32], [14.4, -29], [7.4, -25.2], [0.6, -21.2], [-5.4, -18.2], [-10.4, -16.4]], [3, 4.4, 5.6, 6.4, 6.6, 5.8, 4], 0);
  let l = T.form([[-1, -32], [1, -10], [-24, -8], [-24, -34]], T.lg("spitzeW", [[0, "#f6f1e8", 0], [0.45, "#f3ede3", 0.85], [1, "#f6f1e8"]], -1.5, 0, -9.5, 0, ' gradientUnits="userSpaceOnUse"'));
  l += fleck(T, "!", 18, -34.4, 9, 1.8, "#3a1a0a", 0.6, 18) + fleck(T, "!", 21.6, -33.4, 2.6, 1.8, "#2a1408", 0.7);   // dunkler Oberstrich, Violdrüse
  l += straehnen(T, lt.pts, 120, (x, y) => 160 - (x - 10) * 0.4, 4.6, 0.32, ["#3a1a0a", 0.3], ["#f7bd82", 0.32], 12);
  l += haare(T, lt.pts.filter((p) => p[0] > -6), 150, (x, y) => 160 - (x - 10) * 0.4, 3.6, [["#1c120b", 1.1, 0.1, 0.55], ["#f1a764", 0.9, 0.1, 0.55], ["#fff", 0.2, 0.09, 0.4]], 14, 0.3);
  l += haare(T, [[2, -30], [3, -12], [-20, -8], [-20, -30]], 110, 160, 3.2, [["#fff", 1, 0.1, 0.75], ["#1c120b", 0.3, 0.09, 0.5], ["#c9b8a2", 0.4, 0.09, 0.5]], 18, 0.3);
  s += teil(T, "flunte", lt.pts, hoehenVerlauf(T, "lunte", -42, -14, [[-42, "#a8491c"], [-34, "#c26026"], [-24, "#a85a2e"], [-14, "#d8c0a6"]]), l,
    fellKante(T, lt.ob.slice(1), 50, -1.5, -0.7, "#a44a1a", 0.09, 0.6) + fellKante(T, lt.un.slice(1), 40, -0.6, 1.5, "#5a3018", 0.09, 0.55) +
    fellKante(T, [[-6.4, -23.4], [-11, -21.4], [-14.6, -17], [-12.6, -13.2], [-8, -12.8]], 40, -2.2, 0.8, "#f6f1e8", 0.09, 0.85), { weich: 2 });

  /* ---- nahes Hinterbein (Hose, Sprunggelenk, schwarzer Mittelfuß) ---- */
  let h = strumpf([[23.6, -11.6], [25, -12.6], [26.4, -11.4], [27.8, -12], [28.8, -8], [29, -4], [31.4, -1.6], [31.6, 0.6], [23.6, 0.6], [24.6, -4], [24, -8]], 30, [[24, -11.6], [26, -12], [28.4, -11.8]]);
  h += fleck(T, "!", 26, -26, 2.6, 8, "#d8cfc2", 0.45, 5) + fleck(T, "", 24.6, -18, 0.6, 4, "#fff", 0.3, 15);
  h += straehnen(T, unten(hbN, -38), 50, (x, y) => (y < -14 ? 116 + (x - 25) * 0.6 : 94), 2.4, 0.18, ["#5a2008", 0.24], ["#f7b77a", 0.28]) + haare(T, unten(hbN, -38), 60, (x, y) => (y < -14 ? 116 : 94), 1.4, rot, 10);
  s += teil(T, "fhbN", hbN, fell, h, fellKante(T, [[26.4, -35.6], [24, -31], [23.8, -25.6], [24.8, -19.6]], 24, -1.2, 0.8, "#c4642a", 0.08, 0.6) +
    pfote2(T, 27.6, 5.6, 2.6, { kralle: "#2a2420", fell: "#2a1c14" }), { weich: 1.8, einblenden: [-39, -31] });
  /* ---- nahes Vorderbein (unter dem Rumpf): schwarzer Streif vorn bis zum Ellbogen, hinten rotbraun bis zur Handwurzel ---- */
  let v = strumpf([[68.4, -25], [70.4, -25], [68.8, -18], [68.2, -12], [67.8, -8], [70.6, -3.6], [71, 0.6], [62.6, 0.6], [63.8, -4], [64.4, -6.6], [65.6, -8.4], [66.4, -13], [67.2, -19]], 40);
  v += haare(T, unten(vbN, -32), 30, 94, 1, rot, 8);
  s += teil(T, "fvbN", vbN, fell, v, pfote2(T, 66.4, 5.8, 2.7, { kralle: "#2a2420", fell: "#2a1c14" }), { weich: 1.2 });

  /* ---- Rumpf mit Hals ---- */
  let n = "";
  n += T.form([[22, -40], [40, -41.4], [58, -41], [70, -43.4], [80, -47], [80, -42], [72, -36], [60, -34], [40, -35], [26, -34]], T.lg("ruecken", [[0, "#5e2508", 0.5], [1, "#5e2508", 0]]));
  /* weiß: Kehle, Brust (vor den Vorderbeinen), Backenbart; Bauch weißlich-grau; Hüfte silbrig gesprenkelt */
  const weissB = [[84, -40], [84, -37.4], [82.4, -33.6], [79, -30.6], [75, -27.4], [71, -23.6], [67, -20.6], [66.4, -24], [70, -28], [74, -32], [77, -36.6], [79, -40]];
  n += T.form(weissB, T.lg("weissB", [[0, "#f4efe6", 0.95], [1, "#e9e0d2", 0.95]], 0, 0, 1, 0));
  n += fleck(T, "!", 54, -21, 13, 2.4, "#e4d9cb", 0.7) + fleck(T, "!", 42, -24.4, 6, 1.8, "#e4d9cb", 0.5, -15);
  n += haare(T, [[30, -36], [44, -38], [44, -28], [32, -30]], 50, 150, 1.4, [["#e8e0d4", 1, 0.08, 0.55], ["#2a1a10", 0.6, 0.08, 0.45]], 14);
  n += straehnen(T, rumpf, 150, wuchs, 3, 0.2, ["#5a2008", 0.26], ["#f7b77a", 0.3]);
  n += haare(T, rumpf, 170, wuchs, 2.2, rot, 10, 0.18);
  n += haare(T, weissB, 60, (x, y) => 120 - (x - 70) * 1.2, 1.4, [["#fff", 1, 0.08, 0.7], ["#b9ab98", 0.5, 0.08, 0.5]], 14);
  n += fellKante(T, [[79, -40], [77, -36.6], [74, -32], [70, -28], [66.4, -24]], 40, 1.2, 0.9, "#c25e24", 0.08, 0.7);   // Haarkante rot → weiß
  s += teil(T, "frumpf", rumpf, fell, n,
    fellKante(T, [[30, -39.2], [40, -39.9], [50, -39], [58, -39.6], [66, -40.8], [72, -42.6], [77, -44.8]], 40, -1.3, -0.15, "#8a3a14", 0.08, 0.6) +
    fellKante(T, [[83.6, -39], [82.4, -33.6], [79, -30.6], [75, -27.4], [71, -23.6], [67, -20.4]], 40, -1, 1.5, "#f4eee4", 0.08, 0.85) +
    fellKante(T, [[66, -19.8], [58, -19.8], [50, -20.6], [44, -22.9], [38, -25.4]], 30, -0.8, 1.2, "#e1d6c8", 0.08, 0.7), { weich: 4.4 });

  /* ---- Kopf ---- */
  let k = "";
  /* weiß: Oberlippe, Wange unter dem Auge, Unterkiefer, Kinn; Backenbart hinter dem Mundwinkel nach hinten unten */
  const weissK = [[96.2, -39.6], [94.6, -40.6], [92, -41.2], [89.4, -41.6], [86.6, -42.4], [83.6, -42.6], [80.6, -42], [79.2, -39.4], [81.4, -37.2], [84.4, -36.6], [87.6, -36.9], [91, -37.4], [93.2, -38.1], [95.2, -39]];
  k += T.form(weissK, T.lg("weissK", [[0, "#f6f1e8", 0.6], [0.3, "#f6f1e8", 0.95], [1, "#ebe2d4", 0.95]]));
  k += haare(T, weissK, 70, (x, y) => (x > 89 ? 192 : 140), 0.9, [["#fff", 1, 0.07, 0.6], ["#b9ab98", 0.5, 0.07, 0.45]], 14);
  k += haare(T, kopf.filter((p) => p[1] < -40.5), 80, (x, y) => (x > 89 ? 196 : 182), 0.8, [["#5a2008", 1, 0.07, 0.5], ["#f6b676", 0.8, 0.07, 0.5]], 12);
  k += fellKante(T, [[81, -42.4], [84.6, -42.6], [88.4, -42], [92, -41.2], [95, -40.4]], 30, 0.8, 0.6, "#c25e24", 0.06, 0.55);
  /* Augenhöhle und Stirn; Tränenstreif vom inneren Augenwinkel schräg nach vorn unten zur Oberlippe; dunkles Schnurrhaarkissen */
  k += fleck(T, "", 86.8, -45.8, 2.4, 1.1, "#000", 0.4, 18) + fleck(T, "", 85, -47, 3, 1.2, "#fff", 0.2);
  k += T.form([[88.4, -44], [89, -44], [90, -42.8], [91.2, -41], [92, -39.4], [91.6, -39.2], [90.6, -40.6], [89.4, -42.4]], T.lg("traene", [[0, "#2a160c", 0.4], [1, "#140a06", 0.75]]));
  k += fleck(T, "!", 93.8, -39.6, 1.9, 0.9, "#1a100a", 0.85, 12);
  /* Lefze: erst waagerecht, am Mundwinkel unter dem Auge leicht nach oben (Fuchslächeln) */
  k += zart(T, [[95.6, -39.2], [93.6, -38.8], [91.4, -38.5], [89.4, -38.4], [88.2, -38.6], [87.6, -39]], "#1a100a", 0.2, 0.85);
  let ka = fellKante(T, [[81, -40.6], [79.8, -38.4], [80.6, -36.4], [79.4, -34.6]], 22, -1.5, 0.9, "#f4eee4", 0.07, 0.85);
  const nase = [[95.4, -42.6], [96.6, -41.9], [97.2, -40.6], [97, -39.6], [96.2, -39.3], [95.2, -39.8], [94.9, -41.2]];
  const naseS = T.form(nase, T.lg("nase", [[0, "#3f3732"], [0.5, "#161210"], [1, "#0a0807"]]));
  ka += T.fein !== false && T.relief ? `<g filter="${T.relief("nase", { f: 8, tiefe: 0.12, okt: 1 })}">${naseS}</g>` : naseS;
  ka += `<path d="M97 -40.3q-.5 -.3 -.8 .1q.2 .3 .6 .3q-.3 .2 -.9 .1" fill="#000"/><path d="M95.6 -42.2q.8 -.1 1.3 .4" stroke="#fff" stroke-width=".18" stroke-opacity=".5" fill="none" stroke-linecap="round"/>`;
  ka += augeTier(T, 87.4, -44.8, 0.82, { iris: "#e6a83a", iris2: "#8a4e10", offen: 0.62, winkel: 22, pupille: "schlitz", wimpern: 10, lidstrich: 0.9 });
  if (T.fein !== false) ka += `<path d="M92.4 -39.6h.01M93.1 -39.8h.01M93.8 -40h.01M92.8 -39.1h.01M93.5 -39.3h.01M94.2 -39.5h.01" stroke="#000" stroke-width=".2" stroke-linecap="round" opacity=".6"/>`;
  ka += T.schnurrhaare ? T.schnurrhaare(93.6, -39.4, 7, 6, 10, 30, "#1a120c", 0.06) : "";
  s += teil(T, "fkopf", kopf, hoehenVerlauf(T, "fkopfF", -49, -36, [[-49, "#a7471a"], [-44, "#c25e24"], [-40, "#c96b30"], [-36, "#c96b30"]]), k, ka, { weich: 1.8, einblendenX: [78.2, 81] });
  return { svg: s, box: [-19.6, -57.2, 97.2, 0], fuesse: [28.8, 35.8, 60.6, 67.6], kopf: [76, -58, 99, -32] };
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
  /* Kritik Runde 1 umgesetzt: Buckel als Muskelhügel direkt über dem Ellbogen, Nacken davor 5–7 % tiefer, Sattel dahinter;
     hängender Bauch mit Fransen; durchgehende Hinterkontur (Kruppe → Gesäß → Ferse), kein Lappen; Vorderpfote ≈ 60 % des
     Hinterfußes, Handwurzel-Knick; Kopf mit eigenem Volumen, ohne Kontur, weich aus dem massigen Hals. */
  T.dichte = 0.75;
  const rumpf = [
    [12, -86], [18, -94], [30, -98.4], [48, -99.8], [66, -98.8], [80, -98.4], [96, -101], [110, -106], [121, -111], [130, -113],  // Kruppe, Sattel, Buckel
    [139, -111.4], [147, -106.4], [155, -101.6], [164, -97.6], [172, -93], [176, -84], [176, -74],                              // Nacken (unter dem Kopf)
    [170, -66], [162, -58], [155, -50], [149, -43], [140, -39],                                                                 // Kehle, Brust
    [126, -36.6], [110, -35.2], [94, -35], [78, -36.4], [64, -39.4], [50, -44], [36, -50], [22, -56], [12, -66], [9, -76],          // hängender Bauch, Hinterkontur
  ];
  const kopf = [[160, -92], [162.4, -99], [168, -103.4], [176, -104.2], [183, -102], [188, -97.6, 1], [193, -94], [199, -92], [205, -90.2], [210, -87.6], [214, -84.2],
    [216.2, -80.4], [215.6, -76.4], [212.8, -74.6], [208.4, -73.6], [204.2, -72.4, 1], [203.4, -70], [200.6, -68.8], [196, -68.2], [189, -68.4], [182, -69.4], [175, -71.4], [168, -75], [162, -82]];
  /* Vorderbein: Ellbogen hinten, Unterarm verjüngt, Handwurzel-Knick auf ≈ 13 %, kurze breite Vorderpfote */
  const vbN = [[116, -74], [118.4, -60], [117.6, -52], [120.4, -42], [124.4, -30], [126.6, -20], [127.4, -14], [126.6, -8], [127.6, -3], [129, 0, 1], [146, 0, 1], [148.6, -2.4], [148.2, -5.6],
    [145.6, -7.6], [142.4, -9.4], [141, -12], [141.6, -15.4], [143, -20], [144.6, -30], [146.4, -42], [147.6, -54], [145.4, -66], [138, -76]];
  /* Hinterbein: Gesäß → Oberschenkel-Rückseite → Ferse (kleine Wölbung) → ganze Sohle; Knie vorn */
  const hbN = [[22, -90], [12, -84], [8.4, -72], [9, -58], [12, -44], [15.4, -30], [17.4, -18], [16.4, -10], [14.6, -5.6], [15.4, -1.6], [17.4, 0, 1], [47, 0, 1], [49.4, -2.4], [48.4, -5.6],
    [45, -7.2], [40, -8.6], [35.6, -12], [36, -20], [39, -32], [45, -44], [50.4, -54], [52, -66], [48, -80], [38, -88]];
  const versetzt = (p, dx) => p.map((q) => [q[0] + dx, q[1], q[2]]);
  const vbF = versetzt(vbN, -15).map((q) => (q[1] > -2 ? q : [q[0] + (q[1] < -60 ? 0 : 0), q[1], q[2]]));
  const hbF = versetzt(hbN, 17);

  const fell = hoehenVerlauf(T, "fell", -114, 0, [[-114, "#8e6c46"], [-102, "#755433"], [-86, "#644428"], [-66, "#583820"], [-46, "#4c301b"], [-24, "#3e2717"], [0, "#2e1c10"]]);
  const fellF = hoehenVerlauf(T, "fellF", -114, 0, [[-90, "#4a3420"], [-50, "#3a2818"], [0, "#26170d"]]);
  const braun = [["#22150b", 1.1, 0.22, 0.5], ["#cfa676", 0.75, 0.2, 0.5], ["#8a6038", 0.6, 0.22, 0.45], ["#ecd5ad", 0.3, 0.18, 0.45]];
  const lauf = [["#140b05", 1, 0.2, 0.5], ["#8a6a48", 0.7, 0.18, 0.45], ["#c9a072", 0.25, 0.16, 0.45]];
  const wuchs = (x, y) => (x > 150 ? 120 - (y + 90) * 0.5 : y > -44 && x > 60 ? 98 : x < 40 ? 100 + (x - 10) * 1.4 : 168 - (y + 100) * 0.5);

  let s = "";
  /* ---- Ohren (hinter dem Kopf): klein, rund, im Profil schmal, Öffnung als dunkle Sichel vorn, Grund im Fell ---- */
  s += teil(T, "bohrF", [[172, -101], [172.4, -105.6], [174.6, -107.8], [177, -106.6], [177.6, -102]], "#3a2616", "", fellKante(T, [[172.6, -105.6], [174.6, -107.6], [177, -106.4]], 14, 0.2, -1.2, "#5a3b22", 0.16, 0.6), { weich: 1 });
  const ohr = [[166.8, -101.6], [167, -106.6], [169.2, -110], [172, -110], [173.6, -106.4], [173.4, -101]];
  s += teil(T, "bohr", ohr, T.lg("bohr", [[0, "#2a1a0e"], [1, "#6a4a2c"]]),
    T.form([[171, -102], [172, -105.4], [171.6, -108.4], [173, -106.2], [173.2, -102]], "#120a05", ' opacity=".7"') + haare(T, ohr, 40, -95, 1.8, [["#c9a072", 1, 0.14, 0.6], ["#2a1a0e", 0.8, 0.14, 0.5]], 40, 0.3),
    fellKante(T, [[167, -102.4], [167, -106.6], [169.2, -110], [172, -110], [173.6, -106.4]], 26, 0, -1.4, "#5a3b22", 0.15, 0.65), { weich: 1.4 });

  /* ---- ferne Beine: Körperton, dunkler und kühler, Schlagschatten des Bauchs ---- */
  const fern = (name, pts) => teil(T, name, pts, fellF, straehnen(T, unten(pts, -60), 30, 96, 5, 0.45, ["#120a05", 0.3], ["#7a5a3a", 0.25]) +
    `<rect x="0" y="-80" width="200" height="80" fill="${hoehenVerlauf(T, "bfO", -60, -24, [[-60, "#000", 0.35], [-40, "#000", 0.22], [-24, "#000", 0]])}"/>`, "", { weich: 4 });
  s += fern("bvbF", vbF) + fern("bhbF", hbF);
  s += kralleB(T, 131.6, -3.6, 4, 6.4, 1.6, "#a89a82", "#5a4c3c", 0.5, T.fein !== false) + kralleB(T, 64.6, -2.4, 3, 3.2, 1.6, "#3e3428", "#2a221a", 0.55, T.fein !== false);

  /* ---- nahes Vorderbein: unter dem Rumpf – der Unterarm kommt unter Brust und Bauchfransen hervor ---- */
  let v = straehnen(T, unten(vbN, -66), 60, 95, 5.6, 0.5, ["#120a05", 0.3], ["#a0805a", 0.3]) + haare(T, unten(vbN, -66), 60, 95, 3.6, lauf, 10);
  v += fleck(T, "", 145, -30, 2.4, 14, "#fff", 0.12);
  s += teil(T, "bvbN", vbN, fell, v, fellKante(T, [[118, -60], [117.6, -52], [120.4, -42], [124.4, -30]], 24, -2.4, 2, "#3a2414", 0.2, 0.6) +
    kralleB(T, 146.4, -4, 5, 7.6, 2.5, "#d2c3a6", "#6a5a46", 0.48, T.fein !== false) +
    (T.fein !== false ? `<path d="M143.6 -8.6q-1 3.6 -.4 7.6M139.6 -9.6q-1 3.6 -.4 8.6" stroke="#0d0805" stroke-width=".5" stroke-opacity=".5" fill="none"/>` : ""), { weich: 4 });

  /* ---- Rumpf mit Hals ---- */
  let n = "";
  /* silbrig-goldene Grannenspitzen auf Buckel, Schulter, Rücken (nach unten abnehmend) */
  n += T.form([[14, -95], [50, -102], [100, -103], [120, -112], [138, -115], [165, -100], [160, -84], [132, -82], [100, -86], [60, -88], [24, -84]],
    hoehenVerlauf(T, "spitzen", -114, -84, [[-114, "#e0c49a", 0.55], [-102, "#e0c49a", 0.25], [-86, "#e0c49a", 0]]));
  n += straehnen(T, rumpf, 210, wuchs, 7.6, 0.55, ["#1e1209", 0.3], ["#dcb987", 0.3], 14);
  n += haare(T, rumpf, 150, wuchs, 6, braun, 12, 0.25);
  n += haare(T, [[80, -104], [130, -116], [160, -100], [130, -96], [90, -96]], 70, wuchs, 4.4, [["#ecd5ad", 1, 0.18, 0.6], ["#fff2d8", 0.5, 0.16, 0.5]], 12, 0.25);
  s += teil(T, "brumpf", rumpf, fell, n,
    fellKante(T, [[18, -94], [30, -98.4], [48, -99.8], [66, -98.8], [80, -98.4], [96, -101], [110, -106], [121, -111], [130, -113], [139, -111.4], [147, -106.4], [155, -101.6]], 90, -3.4, -0.7, "#6a4a2c", 0.2, 0.6) +
    fellKante(T, [[48, -100], [100, -101.6], [126, -112], [148, -107]], 40, -3, -0.9, "#e4cba2", 0.18, 0.5) +
    fellKante(T, [[170, -66], [162, -58], [155, -50], [149, -43], [140, -39]], 40, -2.2, 3, "#4a301c", 0.22, 0.7) +
    fellKante(T, [[140, -38.6], [126, -36.2], [110, -34.8], [94, -34.6], [78, -36], [64, -39]], 80, -1.6, 4.6, "#3e2716", 0.22, 0.75), { weich: 12 });

  /* ---- nahes Hinterbein: Oberschenkel als runde Masse aus der Kruppe; Ferse; ganze Sohle ---- */
  let h = straehnen(T, hbN, 80, (x, y) => (y < -40 ? 112 + (x - 20) * 0.5 : 98), 6, 0.5, ["#120a05", 0.3], ["#a0805a", 0.3]) + haare(T, unten(hbN, -60), 60, 96, 3.6, lauf, 10);
  h += fleck(T, "", 16, -4, 2, 2.6, "#fff", 0.15);
  s += teil(T, "bhbN", hbN, fell, h, fellKante(T, [[9, -58], [12, -44], [15.4, -30], [17.4, -18]], 26, -1.6, 1.6, "#3a2414", 0.2, 0.6) +
    fellKante(T, [[16, 0], [47, 0]], 30, 0.4, 0.8, "#3a2414", 0.18, 0.6) +
    kralleB(T, 47.4, -2.6, 4, 3.4, 1.7, "#4a3e30", "#2a221a", 0.55, T.fein !== false), { weich: 5, tiefe: 1.8, blende: [58, -92, 40, -64] });
  /* ---- Kopf: breite Stirn, Schüsselprofil, langer heller Fang, klarer Unterkiefer, kurzes Kinn ---- */
  let k = "";
  const schnauze = [[192, -93], [199, -91.6], [206, -89.4], [212, -86], [215, -80], [213, -75], [206, -73], [200, -70], [193, -69], [188, -72], [187, -84]];
  k += T.form(schnauze, T.rg("schnauze", [[0, "#ad8558", 0.85], [0.7, "#95693f", 0.55], [1, "#95693f", 0]], 0.6, 0.45, 0.6));
  k += fleck(T, "", 180, -74, 9, 3.6, "#000", 0.3);
  k += haare(T, kopf, 220, (x, y) => (x > 190 ? 194 : 165 + (y + 88) * 1.4), 2.2, [["#24160c", 1, 0.15, 0.5], ["#cfa676", 0.8, 0.14, 0.5], ["#7a5634", 0.5, 0.15, 0.45]], 14, 0.2);
  /* Augenhöhle: Brauenwulst, dunkle Lidhaut */
  k += fleck(T, "", 188.4, -95.6, 3.6, 1.6, "#000", 0.45, -8) + fleck(T, "", 186, -97.6, 4, 1.4, "#fff", 0.2);
  /* Lefze: dunkel, fast waagerecht unter dem Nasenspiegel bis unter das Auge, Unterlippe vorn leicht hängend */
  k += zart(T, [[212.6, -75.2], [208.4, -74.4], [203.4, -73.6], [198, -73.2], [194, -73.1], [191.6, -73.2]], "#140b06", 0.4, 0.85);
  let ka = fellKante(T, [[203.4, -70], [200.6, -68.8], [196, -68.2], [189, -68.4], [182, -69.4], [175, -71.4]], 40, -1.4, 2.6, "#3a2414", 0.18, 0.65) +
    fellKante(T, [[163, -97], [161.6, -90], [162.4, -82], [166, -76]], 30, -2.6, 1, "#4a2f1b", 0.18, 0.7);
  const nase = [[209.8, -87.2], [213.6, -84.8], [215.8, -82], [216.6, -78.8], [215.6, -76.2], [212.6, -75.8], [210.4, -77.6], [209.2, -81.6]];
  const naseS = T.form(nase, T.lg("nase", [[0, "#3e3631"], [0.5, "#171311"], [1, "#0a0807"]]));
  ka += T.fein !== false && T.relief ? `<g filter="${T.relief("nase", { f: 3, tiefe: 0.25, okt: 1 })}">${naseS}</g>` : naseS;
  ka += `<path d="M216.6 -78.8q-1.4 -.6 -2.4 .2q.6 .8 1.8 .8q-1 .4 -2.4 .2" fill="#000"/><path d="M211.4 -85.6q1.8 .2 3.2 1.6" stroke="#fff" stroke-width=".4" stroke-opacity=".35" fill="none" stroke-linecap="round"/>`;
  ka += augeTier(T, 188.8, -93.6, 0.95, { iris: "#5c3418", iris2: "#24120a", offen: 0.72, winkel: 8, wimpern: 8, lidstrich: 0.3, haut: 0.55 });
  if (T.fein !== false) ka += `<path d="M206 -75.6q3 .4 6 2M205.6 -76.6q3.4 -.4 6.4 .4" stroke="#1a120c" stroke-width=".14" fill="none" opacity=".6"/>`;
  s += teil(T, "bkopf", kopf, hoehenVerlauf(T, "bkopfF", -105, -66, [[-105, "#86643f"], [-92, "#6e4d2d"], [-78, "#5c3e24"], [-66, "#4a301b"]]), k, ka, { weich: 8, tiefe: 2.2, einblendenX: [160, 168] });
  return { svg: s, box: [7.6, -113.4, 217, 0], fuesse: [32, 48, 122, 138], kopf: [158, -112, 219, -64] };
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
  /* Kritik Runde 1 umgesetzt: durchgehende Hinterkontur (Kruppe → Gesäß → Ferse), kein Sims; Beine im Körperton, ferne Beine
     kühl blaugrau; Hals zur Schulter dicker, Kehle gewölbt; kleiner Kopf mit Römernase, Brauenwulst, schlankem Unterkiefer;
     Weiß cremig, Schatten kühl blaugrau, keine grauen Kratzer. */
  T.dichte = 0.8;
  const blau = "#7d8a9a";
  const rumpf = [
    [12, -82], [16, -94], [26, -104.6], [40, -110.4], [56, -112], [76, -110.6], [96, -107.4], [114, -104.4], [130, -101.6],     // hohe Hüfte → Schulter
    [144, -98.4], [158, -94.6], [170, -91.6], [180, -90.4], [192, -86], [194, -72],                                            // langer Hals (reicht unter den Kopf)
    [178, -67], [168, -62.4], [158, -57.6], [151, -51], [147, -45.6],                                                          // Kehle konvex, Brustbein
    [136, -46.6], [120, -46], [104, -47], [86, -48.6], [68, -51.4], [52, -55.6], [38, -60], [26, -64.6], [17, -70.6],              // Bauch
  ];
  const kopf = [[178.6, -84], [180.4, -89.6], [185, -92.2], [192, -92.8], [198.4, -91.8], [203, -90.6], [209, -88.6], [216, -85.8], [222, -82.4], [226.6, -78.4], [229.4, -74.6], [230, -71.6],
    [229, -69.4], [226, -68.4], [222.4, -67.6, 1], [221.6, -66], [218, -64.8], [210, -64.4], [202, -65.2], [194, -67.4], [188, -70.2], [182, -75.6]];
  const vbN = [[124, -80], [122, -62], [121, -54], [124, -44], [127, -32], [128.6, -20], [128, -14], [127.6, -8], [128.6, -3], [130, 0, 1], [157, 0, 1], [160.4, -2.6], [160, -6],
    [156.6, -8.6], [151.6, -10.6], [146.4, -12.4], [144.6, -16], [145.6, -24], [147, -36], [148, -50], [147, -64], [140, -76]];
  const hbN = [[30, -104], [18, -98], [12.4, -86], [10.4, -72], [11.4, -58], [14, -44], [17, -30], [18.6, -18], [17.4, -10], [16, -5.6], [16.8, -1.6], [18.6, 0, 1], [55.4, 0, 1],
    [58.4, -2.4], [57.8, -5.6], [54, -7.4], [48, -8.6], [42.4, -11], [38.8, -16], [39.4, -26], [42.6, -38], [48, -50], [54, -62], [56, -76], [52, -92], [42, -104]];
  const versetzt = (p, dx) => p.map((q) => [q[0] + dx, q[1], q[2]]);
  const vbF = versetzt(vbN, -16), hbF = versetzt(hbN, 17);

  const fell = hoehenVerlauf(T, "fell", -114, 0, [[-114, "#fbf8f1"], [-100, "#f4efe3"], [-80, "#ece5d5"], [-60, "#e3dac6"], [-44, "#ded3bc"], [-20, "#d9cdb2"], [0, "#cdbf9f"]]);
  const fellF = hoehenVerlauf(T, "fellF", -114, 0, [[-100, "#c3c6c6"], [-60, "#b2b5b4"], [-30, "#a8a99f"], [0, "#99968a"]]);
  const weissH = [["#fff", 1, 0.2, 0.6], ["#c4c6c8", 0.6, 0.18, 0.4], ["#e8dcc0", 0.5, 0.2, 0.45]];
  const kuehl = (y0, y1, op) => `<rect x="-20" y="-130" width="280" height="140" fill="${hoehenVerlauf(T, "kuehl" + y0 + "_" + y1, y0, y1, [[y0, blau, 0], [y0 + (y1 - y0) * 0.6, blau, op * 0.7], [y1, blau, op]])}"/>`;
  const wuchs = (x, y) => (x > 150 ? 172 - (y + 88) * 0.4 : y > -50 ? 96 : x < 44 ? 104 + (x - 20) * 1.4 : 166 - (y + 105) * 0.4);

  let s = "";
  /* ---- Ohr: klein, tief im Kopffell, seitlich am Hinterkopf; nur eine schmale dunkle Muschelsichel vorn ---- */
  const ohr = [[187, -90.6], [187.4, -93.8], [189, -95.6], [191, -95], [191.8, -92.2], [191.4, -90.2]];
  s += teil(T, "eohr", ohr, T.lg("eohr", [[0, "#fbf8f0"], [1, "#d6ccb6"]]), T.form([[190.4, -91], [191, -93.4], [190.4, -94.8], [191.4, -93.6], [191.6, -91]], "#6a6e72", ' opacity=".6"'),
    fellKante(T, [[187, -91.2], [187.4, -93.8], [189, -95.6], [191, -95]], 14, -0.2, -0.9, "#fff", 0.12, 0.75), { weich: 0.8 });
  /* ---- ferne Beine: kühl blaugrau, 20–25 % dunkler ---- */
  const fern = (name, pts) => teil(T, name, pts, fellF, straehnen(T, unten(pts, -70), 30, 96, 5, 0.45, ["#6a7480", 0.25], ["#e6ebee", 0.35]) +
    `<rect x="0" y="-90" width="200" height="90" fill="${hoehenVerlauf(T, "efO", -70, -30, [[-70, "#3a4450", 0.35], [-48, "#3a4450", 0.2], [-30, "#3a4450", 0]])}"/>`,
    fellKante(T, [[pts[10][0], 0], [pts[12][0], 0]], 30, 0.4, 1, "#b8b8b0", 0.18, 0.6), { weich: 4 });
  s += fern("evbF", vbF) + fern("ehbF", hbF);
  s += kralleB(T, 143.4, -3.2, 3, 3.2, 2.2, "#1d1814", "#1d1814", 0.8, T.fein !== false) + kralleB(T, 71.6, -2.6, 3, 2.8, 2, "#1d1814", "#1d1814", 0.8, T.fein !== false);
  /* ---- nahes Vorderbein (unter dem Rumpf): Ellbogen, Hosenfahne hinten am Unterarm, Handwurzel-Knick, breite Tatze leicht einwärts ---- */
  let v = straehnen(T, unten(vbN, -70), 70, 95, 5.6, 0.5, ["#9aa2aa", 0.25], ["#fff", 0.5]) + haare(T, unten(vbN, -70), 60, 95, 3.6, weissH, 10) + kuehl(-40, 0, 0.18);
  s += teil(T, "evbN", vbN, fell, v, fellKante(T, [[122, -62], [121, -54], [124, -44], [127, -32], [128.6, -20]], 40, -3, 2.2, "#ece5d5", 0.2, 0.75) +
    fellKante(T, [[130, -0.6], [157, -0.6]], 40, 0.5, 1.2, "#e8e0cc", 0.2, 0.7) +
    kralleB(T, 159.6, -3, 4, 3.6, 2.4, "#14110f", "#14110f", 0.85, T.fein !== false) +
    (T.fein !== false ? `<path d="M156 -9q-1 3.6 -.4 8M151 -10.6q-1 4 -.4 9.6" stroke="#9a9a90" stroke-width=".5" stroke-opacity=".6" fill="none"/>` : ""), { weich: 4.4 });

  /* Stummelschwanz am Ende der Kruppe, vom Gesäßfell halb verdeckt */
  s += teil(T, "eschw", [[22, -97.6], [15.6, -98.4], [12.8, -95.6], [14.4, -92], [20, -92]], "#ece5d4", fleck(T, "!", 15, -92.4, 3, 1, blau, 0.4), fellKante(T, [[15.6, -98.2], [13, -95.6], [14.4, -92.2]], 12, -1, 0.5, "#fff", 0.14, 0.75), { weich: 1 });
  /* ---- Rumpf mit Hals: drei Volumen (Schulterblatt, Rippenkorb, Kruppe), Kernschatten kühl ---- */
  let n = kuehl(-70, -46, 0.38);
  n += fleck(T, "!", 120, -88, 12, 14, "#fff", 0.35, 15) + fleck(T, "!", 84, -96, 20, 8, "#fff", 0.35) + fleck(T, "!", 44, -100, 16, 10, "#fff", 0.45);
  n += fleck(T, "!", 108, -70, 4, 14, blau, 0.25, 15) + fleck(T, "!", 150, -60, 8, 8, blau, 0.3);
  n += straehnen(T, rumpf, 200, wuchs, 7, 0.5, ["#a8b0b8", 0.22], ["#fff", 0.55], 12);
  n += haare(T, rumpf, 150, wuchs, 5, weissH, 12, 0.22);
  s += teil(T, "erumpf", rumpf, fell, n,
    fellKante(T, [[26, -104.6], [40, -110.4], [56, -112], [76, -110.6], [96, -107.4], [114, -104.4], [130, -101.6], [144, -98.4], [158, -94.6], [172, -91.4]], 80, -3, -0.4, "#fff", 0.2, 0.75) +
    fellKante(T, [[184, -70], [178, -67], [168, -62.4], [158, -57.6], [151, -51], [147, -45.6]], 50, -2.4, 3, "#dcd2bc", 0.2, 0.75) +
    fellKante(T, [[146, -45.2], [136, -46.2], [120, -45.6], [104, -46.6], [86, -48.2], [68, -51], [52, -55.2]], 80, -1.4, 4.4, "#d6ccb4", 0.2, 0.75), { weich: 12 });
  /* ---- nahes Hinterbein: Oberschenkel aus der Kruppe, Knie, Ferse, ganze Sohle mit Fellsaum ---- */
  let h = straehnen(T, hbN, 110, (x, y) => (y < -40 ? 110 + (x - 20) * 0.5 : 97), 6, 0.5, ["#9aa2aa", 0.24], ["#fff", 0.5]) + haare(T, unten(hbN, -70), 60, 96, 3.6, weissH, 10) + kuehl(-40, 0, 0.16);
  s += teil(T, "ehbN", hbN, fell, h, fellKante(T, [[12.4, -86], [10.4, -72], [11.4, -58], [14, -44], [17, -30]], 40, -2, 1.6, "#ece5d5", 0.2, 0.7) +
    fellKante(T, [[18.6, -0.6], [55.4, -0.6]], 44, 0.5, 1.2, "#e8e0cc", 0.2, 0.7) + kralleB(T, 57.6, -2.6, 4, 3.2, 2.2, "#14110f", "#14110f", 0.85, T.fein !== false), { weich: 5, tiefe: 1.8, blende: [68, -96, 46, -70] });

  /* ---- Kopf: leicht römische Nase, Brauenwulst, Jochbogen/Kaumuskel, schlanker Unterkiefer ---- */
  let k = kuehl(-74, -64, 0.3);
  k += fleck(T, "", 203.6, -87.8, 4, 1.4, "#000", 0.22, -8) + fleck(T, "!", 199, -90, 6, 1.6, "#fff", 0.55, -5);   // Brauenwulst: Licht oben, Schatten darunter
  k += fleck(T, "!", 196, -78, 8, 4, blau, 0.22, -10) + fleck(T, "!", 194, -82.4, 7, 2.6, "#fff", 0.4, -10);       // Jochbogen/Kaumuskel
  k += haare(T, kopf, 150, (x, y) => (x > 200 ? 194 : 182), 1.6, [["#fff", 1, 0.12, 0.6], ["#b8bcc0", 0.6, 0.11, 0.45]], 12, 0.2);
  k += haare(T, [[222, -82], [229, -75], [228, -70], [222, -76]], 20, 200, 0.6, [["#fff", 1, 0.08, 0.7]], 20);
  k += zart(T, [[229.4, -69.6], [226, -68.9], [222, -68.4], [217, -68.2], [212.4, -68.2], [210.8, -68.6]], "#141110", 0.5, 0.9);   // schwarzes Lippenpigment
  let ka = fellKante(T, [[218, -64.8], [210, -64.4], [202, -65.2], [194, -67.4], [188, -70.2]], 30, -1.2, 2, "#ddd4c0", 0.16, 0.7) + fellKante(T, [[180, -87], [179, -80], [182, -74.6]], 20, -2, 0.8, "#f0eadc", 0.16, 0.7);
  const nase = [[226.4, -77.6], [229.4, -75.4], [230.6, -72.4], [230, -70], [227.8, -69.4], [225.8, -70.6], [225.2, -74.6]];
  const naseS = T.form(nase, T.lg("nase", [[0, "#3e3631"], [0.5, "#171311"], [1, "#0a0807"]]));
  ka += T.fein !== false && T.relief ? `<g filter="${T.relief("nase", { f: 3, tiefe: 0.25, okt: 1 })}">${naseS}</g>` : naseS;
  ka += `<path d="M230.4 -71.6q-1 -.5 -1.8 .1q.4 .6 1.3 .6q-.6 .3 -1.8 .2" fill="#000"/><path d="M227 -76.6q1.6 0 2.8 1.2" stroke="#fff" stroke-width=".35" stroke-opacity=".5" fill="none" stroke-linecap="round"/>`;
  ka += augeTier(T, 204.6, -85.2, 1.05, { iris: "#4a2a16", iris2: "#1e0e06", offen: 0.72, winkel: 6, wimpern: 8, wimpernFarbe: "#d8d2c6", lidstrich: 0.3, haut: 0.85 });
  if (T.fein !== false) ka += `<path d="M222.4 -69.6q3.4 .2 6.4 1.8M222 -70.6q3.6 -.6 6.6 .2" stroke="#8a8070" stroke-width=".14" fill="none" opacity=".6"/>`;
  s += teil(T, "ekopf", kopf, fell, k, ka, { weich: 6.5, tiefe: 2, einblendenX: [178.6, 190] });
  return { svg: s, box: [9.6, -112.4, 230.6, 0], fuesse: [36, 53, 128, 144], kopf: [176, -98, 233, -60] };
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
  /* Kritik Runde 1 umgesetzt: massiger runder Kopf (Höhe ≈ 85 % der Länge), hohe Stirnkuppel, große Wangen bis unter die
     Kieferlinie, kurze stumpfe Schnauze; Augenfleck als schräger Tropfen (nach vorn unten), Schlitzpupille; Schulterband
     schließt vorn über die Brust, oben schmaler; Vorderbein aus einer Masse mit dem Band; Schwarz modelliert, keine Kreide-
     striche; Rumpf gedrungen, Bauch durchhängend, Rücken zur Kruppe leicht fallend. */
  T.dichte = 0.8;
  const rumpf = [
    [22, -50], [24, -60], [32, -68], [46, -73.6], [64, -75.6], [84, -76.4], [100, -77], [112, -77.6], [120, -78.4], [128, -74], [131, -62],   // Rücken, Nacken (unter dem Kopf)
    [130, -50], [125, -39], [118, -32.6], [106, -29.2], [92, -27.6], [76, -27.6], [60, -28.6], [46, -31.2], [34, -36], [26, -42],             // Brust, durchhängender Bauch
  ];
  const kopf = [[121, -66], [120.6, -74], [123.4, -82.4], [128.6, -87.4], [136, -89.4], [143, -88], [148.4, -84], [151.6, -79], [153.2, -74.4], [155.4, -71.6], [157, -70.4],
    [158.2, -68.6], [158.6, -65.6], [157.8, -63.2], [156, -62.4], [155.2, -61, 1], [153.8, -59.2], [150.4, -57.8], [145, -56.6], [138, -55.4], [131, -55.6], [125.6, -57.8]];
  const vbN = [[100, -60], [99, -46], [98.6, -40], [101, -30], [103, -20], [104, -14], [103, -8], [103.8, -3], [105, 0, 1], [121, 0, 1], [123.4, -2.4], [123, -5.4],
    [120.4, -7], [116.4, -8.6], [114, -11], [113.6, -14], [114.6, -20], [116, -30], [117.6, -42], [118, -54], [114, -64]];
  const hbN = [[30, -66], [22.4, -58], [20.4, -46], [22, -34], [24, -22], [25.4, -14], [24, -8], [23.4, -3], [24.6, 0, 1], [46, 0, 1], [48.6, -2.4], [48, -5.4],
    [45, -7], [40.6, -8.4], [37.6, -11], [37.4, -16], [39.6, -26], [44, -38], [48, -48], [50, -58], [44, -66]];
  const versetzt = (p, dx) => p.map((q) => [q[0] + dx, q[1], q[2]]);
  const vbF = versetzt(vbN, -12), hbF = versetzt(hbN, 12);

  const weissV = hoehenVerlauf(T, "weiss", -90, 0, [[-90, "#f8f5ee"], [-70, "#f1ece1"], [-50, "#e6dfcf"], [-32, "#d9d0bd"], [0, "#c9bfa8"]]);
  const schwarzV = hoehenVerlauf(T, "schwarz", -90, 0, [[-90, "#3c3733"], [-60, "#2a2622"], [-30, "#1d1a17"], [0, "#121110"]]);
  const schwarzF = hoehenVerlauf(T, "schwarzF", -90, 0, [[-70, "#3a3a3c"], [-30, "#2a2a2c"], [0, "#1c1c1e"]]);
  const wHaar = [["#fff", 1, 0.13, 0.55], ["#b0a898", 0.6, 0.12, 0.35]], sHaar = [["#5e564e", 1, 0.12, 0.25], ["#000", 0.8, 0.12, 0.4]];
  const wuchs = (x, y) => (x > 118 ? 160 : y > -34 ? 96 : x < 32 ? 110 + (x - 10) * 2 : 170 - (y + 70) * 0.5);

  let s = "";
  /* ---- Ohren: rund, dicht behaart, Grund im Kopffell; fernes Ohr hinter dem nahen, nur zum kleinen Teil sichtbar ---- */
  s += teil(T, "pohrF", [[121.4, -83], [121.6, -88.6], [124.4, -92.2], [128, -92.2], [129.6, -88]], "#121110", "", fellKante(T, [[121.6, -88.4], [124.4, -92], [128, -92]], 14, -0.2, -0.9, "#2a2724", 0.11, 0.6), { weich: 1 });
  const ohr = [[125, -85], [125.2, -90.4], [128.6, -94.6], [133.4, -94.4], [136, -90.4], [135.4, -85.4]];
  s += teil(T, "pohr", ohr, T.lg("pohr", [[0, "#3c3834"], [1, "#121110"]]), haare(T, ohr, 40, -95, 1.4, sHaar, 40, 0.3),
    fellKante(T, [[125, -86], [125.2, -90.4], [128.6, -94.6], [133.4, -94.4], [136, -90.4]], 30, 0, -1, "#1a1816", 0.11, 0.7), { weich: 1.6 });
  /* ---- ferne Beine: Schwarz mit bläulichem Grau, etwas heller als die nahen ---- */
  const fern = (name, pts) => teil(T, name, pts, schwarzF, haare(T, unten(pts, -40), 30, 96, 1.6, sHaar, 10) +
    `<rect x="0" y="-70" width="160" height="70" fill="${hoehenVerlauf(T, "pfO", -50, -24, [[-50, "#000", 0.35], [-24, "#000", 0]])}"/>`, "", { weich: 3 });
  s += fern("pvbF", vbF) + fern("phbF", hbF);
  s += kralleB(T, 110, -2.6, 3, 2.6, 1.6, "#6a645a", "#3a362e", 0.7, T.fein !== false) + kralleB(T, 59.4, -2.4, 3, 2.4, 1.6, "#6a645a", "#3a362e", 0.7, T.fein !== false);
  /* ---- nahes Vorderbein (unter dem Rumpf, eine schwarze Masse mit dem Schulterband) ---- */
  s += teil(T, "pvbN", vbN, schwarzV, haare(T, unten(vbN, -40), 40, 96, 1.6, sHaar, 10) + fleck(T, "!", 116.4, -24, 1.6, 10, "#5a5650", 0.4),
    kralleB(T, 122.4, -3, 4, 3, 1.5, "#8a8478", "#3a362e", 0.75, T.fein !== false) +
    (T.fein !== false ? `<path d="M119.4 -7q-.8 2.6 -.3 5.6M115.6 -8.2q-.8 2.8 -.3 6.8" stroke="#000" stroke-width=".4" stroke-opacity=".6" fill="none"/>` : ""), { weich: 3.4 });

  /* ---- Rumpf: weiß, mit schwarzem Schulterband (schließt vorn über die Brust) und schwarzer Hüfte ---- */
  let n = "";
  const band = [[91, -78], [104, -79], [117, -79.4], [121, -70], [126, -62], [130.4, -54], [129.6, -44], [124.4, -35], [116, -29.4], [104, -28.8], [100, -40], [97.4, -52], [94, -64], [91.4, -72]];
  const hinten = [[20, -50], [23, -60], [30, -65.4], [41, -65], [51, -58.6], [57, -48], [59, -36], [56, -27], [40, -27], [26, -36]];
  n += straehnen(T, rumpf, 130, wuchs, 4, 0.32, ["#8a8070", 0.2], ["#fff", 0.55], 14);
  n += haare(T, rumpf, 120, wuchs, 2.6, wHaar, 12, 0.2);
  n += T.form(band, schwarzV) + T.form(hinten, schwarzV);
  /* Schwarz: Glanz nur, wo das Licht auftrifft (Schulter, Oberschenkel), als weiche Bänder; Haare dunkel, schwach */
  n += fleck(T, "!", 108, -70, 8, 3, "#6a6660", 0.3, -15);
  n += straehnen(T, band, 40, 112, 4, 0.3, ["#000", 0.3], ["#5e5852", 0.25], 14) + haare(T, band, 60, 108, 2.4, sHaar, 12) + haare(T, hinten, 40, 118, 2, sHaar, 12);
  /* Haarkanten Schwarz ↔ Weiß (verzahnt, nicht glatt) */
  n += fellKante(T, [[89, -76], [93.6, -66], [97.6, -52], [100, -40], [103, -30]], 50, -1.4, 0.6, "#1d1a17", 0.11, 0.8) + fellKante(T, [[91, -74], [95.4, -62], [98.6, -48]], 30, 1.4, 0.4, "#f1ece1", 0.1, 0.7);
  n += fellKante(T, [[118, -77], [121, -70], [126, -62], [129.4, -55]], 30, 1.2, -0.6, "#1d1a17", 0.11, 0.8) + fellKante(T, [[30, -65], [41, -64.6], [51, -58.4], [57, -48]], 40, 0.8, -1.2, "#1d1a17", 0.11, 0.75);
  s += teil(T, "prumpf", rumpf, weissV, n,
    fellKante(T, [[24, -60], [32, -68], [46, -73.6], [64, -75.6], [84, -76.4]], 40, -2, -0.3, "#fff", 0.14, 0.7) +
    fellKante(T, [[92, -27.8], [76, -27.6], [60, -28.6], [46, -31.2]], 30, -1, 2.2, "#d9d1c0", 0.14, 0.7), { weich: 9 });
  /* ---- nahes Hinterbein: schwarz, Sohlengänger mit Ferse ---- */
  s += teil(T, "phbN", hbN, schwarzV, haare(T, hbN, 60, (x, y) => (y < -30 ? 118 : 96), 1.8, sHaar, 10),
    kralleB(T, 48, -2.6, 4, 2.8, 1.5, "#8a8478", "#3a362e", 0.75, T.fein !== false), { weich: 4, blende: [36, -70, 30, -54] });

  /* ---- Kopf: rund und massig, weiß; Augenfleck als schräger Tropfen; Wange als große Wölbung ---- */
  let k = "";
  k += fleck(T, "!", 134, -64, 10, 7, "#fff", 0.35) + fleck(T, "!", 134, -58.6, 10, 2.6, "#8a8070", 0.3) + fleck(T, "!", 140, -84, 8, 3, "#fff", 0.4);
  k += haare(T, kopf, 160, (x, y) => (x > 150 ? 192 : 165 + (y + 66) * 1.3), 1.3, wHaar, 14);
  const fleckA = [[137.4, -76.4], [138.4, -79.8], [141.4, -81], [144.6, -79.8], [146.2, -76.6], [147.6, -72], [148, -68.2], [146.4, -66.8], [143.4, -68.8], [140, -71.8], [137.8, -74.2]];
  k += T.form(fleckA, T.rg("augenfleck", [[0, "#1c1a18"], [0.8, "#211e1b"], [1, "#2a2724", 0.85]], 0.4, 0.35, 0.65)) + haare(T, fleckA, 26, 140, 0.8, sHaar, 20);
  k += fellKante(T, [[137.8, -74.2], [140, -71.8], [143.4, -68.8], [146.4, -66.8], [148, -68.2]], 20, -0.3, 0.8, "#1c1a18", 0.08, 0.6) + fellKante(T, [[138.4, -79.8], [141.4, -81], [144.6, -79.8]], 10, 0, -0.7, "#1c1a18", 0.08, 0.6);
  /* Mund: Philtrum senkrecht vom Nasenspiegel, Lippe schwarz waagerecht bis unter das vordere Fleck-Drittel */
  k += zart(T, [[156.4, -62.6], [155.6, -61.2], [153.4, -60.8], [150.6, -60.8], [148.4, -61.2]], "#141210", 0.32, 0.9);
  let ka = fellKante(T, [[150.4, -57.8], [145, -56.6], [138, -55.4], [131, -55.6], [125.6, -57.8]], 40, -1.2, 1.4, "#ece6d8", 0.11, 0.75) + fellKante(T, [[121, -66], [120.6, -74], [123, -80]], 20, -1.4, 0.4, "#ece6d8", 0.11, 0.7);
  const nase = [[154.6, -71.4], [157, -70.4], [158.6, -68.4], [159, -65.6], [158.2, -63.4], [156.2, -63], [154.8, -64.6], [154.2, -68.4]];
  const naseS = T.form(nase, T.lg("nase", [[0, "#3e3631"], [0.5, "#171311"], [1, "#0a0807"]]));
  ka += T.fein !== false && T.relief ? `<g filter="${T.relief("nase", { f: 3.4, tiefe: 0.2, okt: 1 })}">${naseS}</g>` : naseS;
  ka += `<path d="M158.8 -65q-1 -.4 -1.6 .2q.4 .5 1.2 .5q-.5 .3 -1.5 .1" fill="#000"/><path d="M155.6 -70.6q1.6 .1 2.6 1" stroke="#fff" stroke-width=".3" stroke-opacity=".45" fill="none" stroke-linecap="round"/>`;
  ka += augeTier(T, 141.6, -77.4, 1.05, { iris: "#4a2e1a", iris2: "#1a0e06", offen: 0.66, winkel: 14, pupille: "schlitz", wimpern: 7, wimpernFarbe: "#3a3632", lidstrich: 0.3 });
  if (T.fein !== false) ka += `<path d="M154.6 -63q3 -.2 5.6 .8M154.2 -63.8q3 -.8 5.8 -.6" stroke="#8a8070" stroke-width=".1" fill="none" opacity=".6"/>`;
  s += teil(T, "pkopf", kopf, weissV, k, ka, { weich: 6, tiefe: 2, einblendenX: [120.6, 126] });
  return { svg: s, box: [19.6, -95, 159, 0], fuesse: [36, 48, 101, 113], kopf: [117, -97, 161, -53] };
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
  const rumpf = [
    [36, -60], [38.4, -66], [46, -69.6], [60, -72.4], [74, -76], [88, -80.4], [100, -84.2], [110, -85.8], [117, -84.4],   // kurze Kruppe, Rücken steigt zum Höcker
    [124, -80.6], [131, -75.6], [137, -70.4], [143, -66], [146, -60], [143.6, -53],                                    // dicker Hals mit Mähne (unter den Kopf)
    [137, -50.4], [129, -46.6], [121, -41.6], [113, -38.4],                                                            // Kehle, Brust
    [104, -37.6], [94, -39.2], [84, -43], [74, -46.6], [64, -49.6], [54, -52.4], [44, -55.6],                           // tiefe Brust, Flanke aufgezogen
  ];
  const kopf = [[137, -66], [139.4, -71.6], [144, -74.4], [150, -74.6], [155.4, -72.4], [159.8, -69], [163.4, -65.6], [166.4, -62.6], [168.6, -59.8], [169.4, -56.6], [169, -53.8],
    [167.6, -52.4], [165.6, -52, 1], [164.8, -50.6], [162, -49.6], [157, -49.2], [151, -49.8], [145.6, -51.2], [141, -54], [138, -59]];
  /* Vorderbein: Ellbogen unter dem Höcker, kräftiger gerader Unterarm, Handwurzel auf ≈ 15 %, Mittelhand vorgeneigt */
  const vbN = [[102, -66], [101.4, -52], [102.6, -44], [103.4, -32], [104, -20], [104.4, -14], [104.2, -11.4], [105.2, -8.6], [106, -5]].concat(pfoteZ(108.8, 10.6, 4.6),
    [[111.6, -6.2], [111, -9.4], [110.6, -12.4], [111, -15.4], [111.4, -22], [112, -32], [113.6, -42], [116, -52], [114, -64]]);
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
    if (T.fein === false) n = Math.round(n * 0.55);
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
  n += flecken(fleckZone, 46, 1, 2.6, "#3e2c18", 0.72, (x) => Math.max(0.15, Math.min(1, (120 - x) / 55)));
  n += flecken([[118, -82], [130, -76], [140, -66], [138, -56], [126, -52], [120, -64]], 8, 0.8, 1.6, "#4a3820", 0.4);
  n += fleck(T, "!", 112, -84, 12, 3, "#4a3820", 0.45, 6) + fleck(T, "!", 128, -77, 9, 2.6, "#4a3820", 0.4, 35);
  n += straehnen(T, rumpf, 150, wuchs, 2.8, 0.2, ["#3a2c18", 0.28], ["#f4e8cc", 0.34], 12);
  n += haare(T, rumpf, 170, wuchs, 1.8, sand, 12, 0.18);
  s += teil(T, "hrumpf", rumpf, fell, n,
    fellKante(T, [[88, -80.6], [100, -84.4], [110, -86], [117, -84.6], [124, -80.8], [131, -75.8], [137, -70.6]], 60, -2.6, -0.5, "#3a2a16", 0.1, 0.65) +
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
    gruppe: "Raubtiere", lebensraum: "Wald", laenge: 1.44, hoehe: 1.03, zeichne: wolf },
  { id: "fuchs", de: "der Fuchs", syl: "FUCHS", it: "la volpe", itSyl: "VOL-pe", en: "fox",
    gruppe: "Raubtiere", lebensraum: "Wald", laenge: 1.17, hoehe: 0.57, zeichne: fuchs },
  { id: "braunbaer", de: "der Braunbär", syl: "BRAUN-bär", it: "l'orso bruno", itSyl: "OR-so BRU-no", en: "brown bear",
    gruppe: "Raubtiere", lebensraum: "Wald", laenge: 2.09, hoehe: 1.13, zeichne: braunbaer },
  { id: "eisbaer", de: "der Eisbär", syl: "EIS-bär", it: "l'orso polare", itSyl: "OR-so po-LA-re", en: "polar bear",
    gruppe: "Raubtiere", lebensraum: "Arktis", laenge: 2.21, hoehe: 1.12, zeichne: eisbaer },
  { id: "panda", de: "der Panda", syl: "PAN-da", it: "il panda", itSyl: "PAN-da", en: "panda",
    gruppe: "Raubtiere", lebensraum: "Bambuswald", laenge: 1.39, hoehe: 0.95, zeichne: panda },
  { id: "waschbaer", de: "der Waschbär", syl: "WASCH-bär", it: "il procione", itSyl: "pro-CIO-ne", en: "raccoon",
    gruppe: "Raubtiere", lebensraum: "Wald", laenge: 0.84, hoehe: 0.34, zeichne: waschbaer },
  { id: "hyaene", de: "die Hyäne", syl: "hy-Ä-ne", it: "la iena", itSyl: "I-e-na", en: "hyena",
    gruppe: "Raubtiere", lebensraum: "Savanne", laenge: 1.44, hoehe: 0.86, zeichne: hyaene },
];
