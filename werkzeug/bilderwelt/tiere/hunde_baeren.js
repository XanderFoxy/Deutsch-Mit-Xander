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
function glied(kette, breiten, pfote = []) {
  const n = kette.length, hin = [], vor = [];
  for (let i = 0; i < n; i++) {
    const a = kette[Math.max(0, i - 1)], b = kette[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const nx = -dy, ny = dx, [wh, wv] = breiten[i];
    hin.push([kette[i][0] + nx * wh, kette[i][1] + ny * wh]);
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
function silhouette(T, d, fill, innen, rand = "#2a2018", rw = 1.3, ra = 0.55) {
  T._n = (T._n || 0) + 1;
  const id = T.id("s" + T._n);
  T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  return `<use href="#${id}" fill="none" stroke="${rand}" stroke-width="${rw}" stroke-opacity="${ra}" stroke-linejoin="round"/><use href="#${id}" fill="${fill}"/>` +
    (innen ? `<g clip-path="url(#${id}c)">${innen}</g>` : "");
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
/* Haare in einer Fläche: Wuchsrichtung winkel (Grad: 0 rechts, 90 unten, 180 links; Zahl oder f(x, y)),
   farben [[farbe, anteil, breite, deckkraft], …] → je Farbe EIN Pfad; leicht gebogen. In Szenen (T.fein = false) ein Drittel. */
function haare(T, pts, n, winkel, len, farben, streu = 16, krumm = 0.22) {
  const [x0, y0, x1, y1] = T.box(pts), wf = typeof winkel === "function" ? winkel : () => winkel;
  const ziel = Math.round(n * (T.fein === false ? 0.08 : 1));
  if (T.fein === false && ziel < 16) return "";
  const eimer = farben.map(() => ""), sum = farben.reduce((q, f) => q + f[1], 0);
  for (let got = 0, v = 0; got < ziel && v < ziel * 12; v++) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!inPoly(x, y, pts)) continue;
    const a = (wf(x, y) + (T.rnd() - 0.5) * streu) * Math.PI / 180, L = len * (0.55 + T.rnd() * 0.9);
    const ex = Math.cos(a) * L, ey = Math.sin(a) * L, k = krumm * L * (T.rnd() - 0.5) * 2;
    let u = T.rnd() * sum, i = 0;
    while (i < farben.length - 1 && u > farben[i][1]) { u -= farben[i][1]; i++; }
    eimer[i] += L < 1.6 ? `M${G(x)} ${G(y)}l${G(ex)} ${G(ey)}` : `M${G(x)} ${G(y)}q${G(ex / 2 - Math.sin(a) * k)} ${G(ey / 2 + Math.cos(a) * k)} ${G(ex)} ${G(ey)}`;
    got++;
  }
  return eimer.map((d, i) => (d ? fein10(d, `fill="none" stroke="${farben[i][0]}" stroke-width="${R(farben[i][2] * 10)}" stroke-opacity="${farben[i][3]}" stroke-linecap="round"`) : "")).join("");
}
/* Fellsträhnen (Locken/Büschel wie in der naturkundlichen Malerei): spitz zulaufende Flächen in Wuchsrichtung,
   je Strähne ein Schatten (unten versetzt) und ein Lichtsaum (oben) → plastisches, büscheliges Fell.
   farben: [schatten, licht] als [farbe, deckkraft]. In Szenen nur ein Zehntel (ab 10 Stück). */
function straehnen(T, pts, n, winkel, len, br, schatten, licht, streu = 10) {
  const [x0, y0, x1, y1] = T.box(pts), wf = typeof winkel === "function" ? winkel : () => winkel;
  const ziel = Math.round(n * (T.fein === false ? 0.1 : 1));
  if (ziel < 10) return "";
  let dS = "", dL = "";
  const eine = (x, y, a, L, w, k) => {
    const ex = Math.cos(a) * L, ey = Math.sin(a) * L, nx = -Math.sin(a), ny = Math.cos(a);
    /* Wurzel schmal (0,25 w), bauchig in der Mitte (Kontrollpunkt ±1,6 w), spitz am Ende */
    const bx = nx * w * 0.25, by = ny * w * 0.25, cx = nx * w * 1.6, cy = ny * w * 1.6;
    return `M${G(x + bx)} ${G(y + by)}q${G(ex * 0.4 + cx - bx + nx * k)} ${G(ey * 0.4 + cy - by + ny * k)} ${G(ex - bx)} ${G(ey - by)}q${G(-ex * 0.6 - cx + nx * k)} ${G(-ey * 0.6 - cy + ny * k)} ${G(-ex - bx)} ${G(-ey - by)}z`;
  };
  for (let got = 0, v = 0; got < ziel && v < ziel * 12; v++) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!inPoly(x, y, pts)) continue;
    const a = (wf(x, y) + (T.rnd() - 0.5) * streu) * Math.PI / 180, L = len * (0.6 + T.rnd() * 0.8), w = br * (0.7 + T.rnd() * 0.6), k = (T.rnd() - 0.5) * L * 0.25;
    dS += eine(x, y + w * 0.7, a, L, w, k);
    if (T.rnd() < 0.55) dL += eine(x - Math.cos(a) * L * 0.08, y - w * 0.35, a, L * 0.7, w * 0.45, k);
    got++;
  }
  return fein10(dS, `fill="${schatten[0]}" fill-opacity="${schatten[1]}"`) + (dL ? fein10(dL, `fill="${licht[0]}" fill-opacity="${licht[1]}"`) : "");
}
/* Randhaare entlang einer Kurve (Ansatz innen, Spitze nach außen in Wuchsrichtung): bricht die glatte Vektorkante */
function fellKante(T, pts, n, dx, dy, farbe, w, op) {
  let d = "";
  const z = Math.round(n * (T.fein === false ? 0.15 : 1));
  if (T.fein === false && z < 8) return "";
  for (let i = 0; i < z; i++) {
    const t = (i + T.rnd() * 0.8) / z * (pts.length - 1), k = Math.min(pts.length - 2, Math.floor(t)), f = t - k;
    const x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f, s = 0.6 + T.rnd() * 0.8, b = (T.rnd() - 0.5) * 0.6;
    d += `M${G(x)} ${G(y)}q${G(dx * s * 0.5 + dy * b)} ${G(dy * s * 0.5 - dx * b)} ${G(dx * s)} ${G(dy * s)}`;
  }
  return fein10(d, `stroke="${farbe}" stroke-width="${R(w * 10)}" stroke-opacity="${op}" fill="none" stroke-linecap="round"`);
}
/* Fell-Grundstruktur (nur fein): zwei Rauschlagen (dunkle Furchen + helle Spitzen) gestreckt in Wuchsrichtung.
   richtung = Wuchsrichtung in Grad (0 rechts, 90 unten, 180 links) */
const fellGrund = (T, d, n, dunkel, hell, richtung, box, st = 1) =>
  struktur(T, d, n, dunkel, richtung - 90, 0.7 * st, box, 1.4, 0.1) + struktur(T, d, n + "h", hell, richtung - 90, 0.35 * st, box, 1.6, 0.12);
/* Fellstruktur (nur fein): Rauschen in Wuchsrichtung, von der Form geklippt */
const struktur = (T, d, n, farbe, winkel, op, box, fx = 0.9, fy = 0.09) =>
  (T.fein !== false && T.textur ? T.textur(d, T.rauschen(n, { fx, fy, farbe, staerke: 2.6, schwelle: 0.55, okt: 2 }), winkel, op, box) : "");
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
  /* Haltung: ruhiges Stehen, Kopf auf Rückenhöhe. Nase rechts bei x≈170, Schwanzwurzel x≈38, Widerrist 83 cm */
  const rumpf = [
    [37, -72.5], [45, -77.2], [60, -77.8], [76, -77], [94, -79], [111, -82.6],             // Kruppe, Lende, Rücken, Widerrist
    [121, -86], [130, -89],                                                               // kräftiger Nacken mit Mähne
    [137, -91], [144, -92.2], [149, -90.8], [153.4, -88.2], [156, -85.4],                  // breiter Oberkopf, Stirn, Stopp
    [161, -82.6], [166, -80.4], [168.6, -79.2], [170.2, -77], [170.4, -74.4], [169.2, -73.1], // Nasenrücken, stumpfe Nase
    [168, -72.2], [167.2, -70.6, 1], [165, -69.6], [162.4, -67.6], [157, -66.6], [151, -66.2], [146, -66.6], // Oberlippe, Kinn, Unterkiefer
    [141, -63.4], [135, -58.8], [129.6, -52.6], [125.2, -46.6],                            // Kehle, Vorbrust
    [119, -41.2], [107, -40], [97, -41.8], [87, -45.4], [77, -50.6], [68, -54.6], [59, -55.6], // tiefer Brustkorb, Bauch hochgezogen
    [50, -59], [41, -63.6], [35.5, -67.6],
  ];
  const vbN = glied([[117, -64], [107.4, -47], [108.8, -36], [109.8, -24], [110.3, -15], [110.9, -10], [112.2, -5]],
    [[10, 9.5], [7.6, 6.4], [5, 5.6], [3.5, 4.1], [3.9, 3.5], [2.9, 3.1], [2.8, 3]], pfoteHund(113.4, 10.8, 4.8));
  const hbN = glied([[48, -68], [58, -48], [48.4, -33], [37.8, -22], [39, -12], [41, -5]],
    [[16, 12.4], [10.8, 7.6], [7.6, 4.6], [4.4, 3], [2.9, 2.6], [2.7, 2.6]], pfoteHund(42.4, 10.4, 4.6));
  const vbF = glied([[113, -64], [100.6, -46], [99.4, -36], [98, -24], [97, -15], [96.6, -10], [97, -5]],
    [[8.5, 8], [6.6, 5], [4.4, 4.8], [3.2, 3.6], [3.4, 3.1], [2.6, 2.8], [2.5, 2.7]], pfoteHund(98.2, 10.3, 4.6));
  const hbF = glied([[52, -66], [65.5, -46], [57.5, -32], [50.5, -22], [53, -12], [55.6, -5]],
    [[12, 10], [9.2, 6.6], [6.4, 4], [3.8, 2.8], [2.6, 2.5], [2.5, 2.5]], pfoteHund(57, 10.2, 4.5));

  /* Fell nach Höhe (cm): Rücken grau-meliert, Flanke lohfarben, Bauch creme, Läufe zimt-ocker */
  const fell = hoehenVerlauf(T, "fell", -96, 0, [[-96, "#6c655d"], [-82, "#857c70"], [-68, "#a0927c"], [-56, "#bfa784"], [-45, "#e2d6bd"], [-36, "#d9b98a"], [-14, "#c99e64"], [0, "#a37c50"]]);
  const fellF = hoehenVerlauf(T, "fellF", -96, 0, [[-90, "#5e574e"], [-60, "#7b6e5d"], [-42, "#8d785d"], [-12, "#7c6447"], [0, "#5c4935"]]);
  const sattel = hoehenVerlauf(T, "sattel", -95, -56, [[-95, "#1a1713", 0.92], [-85, "#26211c", 0.74], [-73, "#38312a", 0.4], [-57, "#38312a", 0]]);
  const box = [20, -106, 172, 0];
  const grau = [["#1b1713", 1.2, 0.16, 0.55], ["#f1e9da", 0.8, 0.14, 0.55], ["#a3845d", 0.5, 0.15, 0.5], ["#4d453b", 0.7, 0.2, 0.4]];
  const lauf = [["#6b4f30", 1, 0.14, 0.45], ["#f4e7cc", 0.9, 0.13, 0.5]];

  let s = "";
  /* ---- fernes Ohr (hinter dem Kopf, nur die Spitze ragt vor) ---- */
  const ohrF = [[141.4, -90.6], [144.6, -100.6], [146.6, -101.2], [148.8, -91.4]];
  s += T.form(ohrF, T.lg("ohrF", [[0, "#2c2621"], [1, "#6a5d4d"]])) + haare(T, ohrF, 30, -75, 1.2, [["#8a7864", 1, 0.12, 0.5]], 16) +
    fellKante(T, [[146.6, -101], [148.6, -92]], 9, 1, 0.3, "#3a322a", 0.12, 0.6);
  /* ---- ferne Beine (im Schatten) ---- */
  const fD = vereint(T, [vbF, hbF]);
  s += silhouette(T, fD, fellF,
    struktur(T, fD, "lauf", "#3a2814", 0, 0.3, box, 2.2, 0.35) + fleck(T, "", 80, -45, 44, 11, "#1a140e", 0.5) + fleck(T, "", 97.4, -24, 2, 14, "#fff", 0.2) + fleck(T, "", 101, -24, 1.6, 14, "#000", 0.2) +
    fleck(T, "", 55.4, -24, 2, 10, "#fff", 0.2) + fleck(T, "", 60, -52, 7, 6, "#000", 0.3) + haare(T, vbF, 25, 93, 1, lauf, 6) + haare(T, hbF, 30, (x, y) => (y < -40 ? 125 : 95), 1.2, lauf, 8), "#1c1712", 0.7, 0.35);
  s += pfoteDetail(98.2, 10.3, 4.6, 0.8, "#1d1813", T.fein !== false) + pfoteDetail(57, 10.2, 4.5, 0.8, "#1d1813", T.fein !== false);

  /* ---- Schwanz: hängt gerade herab bis zum Sprunggelenk, buschig, dunkle Spitze, Violdrüse oben ---- */
  const schwanz = [[44, -73.5], [37, -72.4], [30.2, -66.4], [25.6, -56.6], [23.2, -46], [22.8, -36], [24, -29], [26.8, -23.6], [29.4, -21.2, 1],
    [31.4, -25.4], [33.4, -31], [35.8, -39], [38, -48], [41, -58.6], [45, -66]];
  s += silhouette(T, T.glatt(schwanz), T.lg("schw", [[0, "#776d61"], [0.36, "#968a77"], [0.7, "#6a6155"], [0.86, "#2c2722"], [1, "#1b1815"]]),
    fleck(T, "", 28, -50, 4, 20, "#fff", 0.2, 6) + fleck(T, "", 38, -50, 4, 18, "#000", 0.2, 8) + fleck(T, "", 33.4, -67.4, 4.4, 3.2, "#1a1612", 0.5) +
    haare(T, schwanz, 135, (x, y) => 97 - (y + 50) * 0.5, 3.4, [["#211d19", 1.2, 0.17, 0.5], ["#f3eadb", 0.7, 0.15, 0.5], ["#8f7d63", 0.6, 0.18, 0.45]], 14, 0.3), "#1c1712", 0.7, 0.35);
  s += fellKante(T, [[31, -67], [26, -57], [23.4, -46], [23, -35], [24.4, -28], [27.4, -23]], 27, -1.4, 2.2, "#3d372f", 0.16, 0.6);
  s += fellKante(T, [[36, -40], [34, -32], [31.6, -25.6]], 8, 1, 2, "#2a2520", 0.15, 0.55);

  /* ---- Körper + Kopf + nahe Beine als EINE Silhouette ---- */
  const kD = vereint(T, [rumpf, vbN, hbN]);
  let n = "";
  /* Sattel: dunkle Decke über Schultern und Rücken (Grannenspitzen), endet vor der Kruppe; Nacken/Mähne mit */
  n += T.form([[30, -78], [50, -81], [70, -81], [94, -83], [114, -87], [128, -92], [138, -95], [139, -84], [134, -73], [125, -63], [112, -58], [100, -57], [88, -62], [74, -60], [62, -64], [50, -60], [40, -62], [34, -68]], sattel);
  n += fleck(T, "", 47, -62, 10, 9, "#000", 0.2) + fleck(T, "", 80, -58, 9, 5, "#000", 0.1, -10);
  /* Licht von links oben, Schatten unten (weiche Flecken) – Rippenbogen, Schulter, Keule */
  n += fleck(T, "", 50, -72, 12, 6, "#fff", 0.2) + fleck(T, "", 117, -71, 9, 12, "#fff", 0.2) + fleck(T, "", 86, -70, 16, 7, "#fff", 0.12);
  n += fleck(T, "", 88, -42.5, 32, 7, "#2e2115", 0.5) + fleck(T, "", 103, -54, 3, 8, "#2b2016", 0.3, 10) + fleck(T, "", 132, -57, 7, 5, "#2b2016", 0.3, -40);
  n += fleck(T, "", 65.6, -54, 4, 10, "#2b2016", 0.5, -20) + fleck(T, "", 36, -40, 4, 16, "#2b2016", 0.3, 15) + fleck(T, "", 146, -68, 7, 3, "#2b2016", 0.3);
  /* Läufe: links Licht, rechts Schatten; dunkler Strich vorn am Vorderlauf (typisch Grauwolf) */
  n += fleck(T, "", 108.2, -24, 1.8, 14, "#fff", 0.3) + fleck(T, "", 113, -24, 1.6, 14, "#000", 0.2) + fleck(T, "", 113.3, -27, 0.8, 9, "#24190f", 0.5);
  n += fleck(T, "", 38.4, -14, 1.6, 9, "#fff", 0.2) + fleck(T, "", 43.6, -14, 1.4, 9, "#000", 0.2) + fleck(T, "", 51.2, -37, 3, 7, "#fff", 0.2, 30);
  n += fleck(T, "", 76, -1, 56, 4, "#2b2016", 0.4);
  /* Muskeln/Sehnen: Schulterblattkante, Trizeps, Kniefalte, Achillessehne, Beugesehne am Vorderlauf */
  n += fleck(T, "", 121, -64, 2.2, 9, "#000", 0.2, -12) + fleck(T, "", 107, -26, 0.8, 8, "#000", 0.2);
  /* Achillessehne hell, Rinne davor dunkel; Fersenhöcker; Handwurzel mit Ballen hinten */
  n += fleck(T, "", 38.8, -29, 0.9, 6.5, "#fff", 0.4, 38) + fleck(T, "", 41.8, -28, 0.8, 5.5, "#000", 0.3, 38) + fleck(T, "", 34.6, -21.8, 1.4, 1.6, "#fff", 0.3);
  n += fleck(T, "", 106.6, -15, 1.1, 1.6, "#000", 0.3) + fleck(T, "", 110.4, -16, 2.6, 2, "#fff", 0.2);
  n += struktur(T, vereint(T, [unten(vbN, -40), unten(hbN, -36)]), "lauf", "#3a2814", 0, 0.3, box, 2.2, 0.35);
  /* Haare in Lagen: Unterwolle (kurz, weich), Grannen (dunkel/hell gebändert), Läufe kurz */
  const wuchs = (x, y) => (x > 120 ? 150 - (y + 90) : y > -40 ? 93 : x < 62 ? 118 + (x - 40) * 0.6 : 175 - (y + 80) * 0.5);
  const rumpfH = rumpf.filter((p) => p[0] < 140);
  n += straehnen(T, rumpfH, 178, wuchs, 5, 0.32, ["#1f1a15", 0.26], ["#efe5d3", 0.24]);
  n += haare(T, rumpfH, 150, wuchs, 3.2, grau, 9, 0.14);
  /* Keule: Deckhaar läuft vom Rücken über den Oberschenkel nach hinten-unten */
  const keule = [[33, -70], [47, -77], [62, -72], [66, -58], [62, -47], [52, -38], [41, -31], [34, -42], [32, -57]];
  n += straehnen(T, keule, 46, (x, y) => 112 + (x - 40) * 0.5, 4, 0.3, ["#2a2119", 0.22], ["#f5ead6", 0.26]) + haare(T, keule, 90, (x, y) => 112 + (x - 40) * 0.5, 2.6, grau, 10, 0.15);
  n += haare(T, unten(vbN, -40), 60, 93, 1, lauf, 6) + haare(T, unten(hbN, -36), 70, 94, 1.2, lauf, 8);
  /* Kopf: Stirn dunkler, Zimt auf Nasenrücken und hinter dem Auge, helle Lippen/Wangen/Kehle, Hals seitlich grau */
  const maske = [[146, -76], [152, -78.6], [158, -79.4], [164.6, -77.4], [169.6, -73.4], [167.4, -70.4], [162.6, -67.6], [156, -66.6], [149, -66.4], [143, -65], [137, -60], [131, -53], [128, -48], [132, -60], [139, -70]];
  const kopfOben = [[136, -92], [144, -93], [149.4, -91.4], [156, -86], [161, -83], [168.6, -79.6], [163, -79.8], [156, -82.6], [148, -82.4], [138, -83]];
  n += T.form([[136, -92], [149, -91.4], [156.2, -85.6], [150, -84.6], [138, -84]], T.lg("stirn", [[0, "#26201b", 0.6], [1, "#26201b", 0]]));
  n += fleck(T, "!", 162.4, -80.6, 8.4, 1.9, "#a07a49", 0.7, 25) + fleck(T, "!", 143, -82, 5, 3, "#a07a49", 0.4);
  n += fleck(T, "", 151.2, -84, 2.8, 1.6, "#000", 0.5, -12) + fleck(T, "", 155.4, -80.4, 3.2, 0.8, "#24190f", 0.5, 55);
  n += T.form(maske, T.lg("maske", [[0, "#f7f1e4", 0], [0.3, "#f7f1e4", 0.9], [1, "#ece0c7", 0.92]]));
  n += fleck(T, "", 149, -87.8, 2.6, 1.3, "#f3ead6", 0.9) + fleck(T, "!", 134, -66, 5, 10, "#4d453b", 0.5, 15) + fleck(T, "", 147.6, -77.6, 5, 2.6, "#fff", 0.3, -15);
  n += haare(T, maske, 82, (x, y) => (x > 153 ? 186 : 165 - (y + 70) * 1.2), 1.2, [["#bfae8e", 1, 0.12, 0.55], ["#fff", 0.8, 0.12, 0.6]], 12);
  n += haare(T, kopfOben, 72, (x, y) => (x > 155 ? 192 : 180), 1, [["#231e1a", 1, 0.12, 0.5], ["#e9dcc4", 0.7, 0.11, 0.5], ["#9b7a52", 0.4, 0.12, 0.45]], 12);
  /* Lefze: schwarzer Lippenrand, fast gerade, leicht fallend, kleiner Mundwinkel (kein Grinsen) */
  n += zart(T, [[167.4, -70.7], [162.6, -69.8], [157.6, -69.1], [153.4, -68.6], [151.2, -68.1]], "#16100c", 0.55, 0.9);
  n += zart(T, [[151.4, -68.2], [150.2, -67.4]], "#16100c", 0.35, 0.55) + fleck(T, "", 158, -68, 7, 1.2, "#000", 0.2);
  s += silhouette(T, kD, fell, n, "#2a2018", 0.6, 0.28);

  /* Wangenkrause: helle Fellbüschel hinter dem Kieferwinkel, über Kehle und Hals */
  const krause = [[150, -74], [148, -67.8], [144, -65.4], [140, -63.2], [136.4, -61], [135.4, -67], [136.4, -74], [140, -79], [145, -79]];
  s += T.koerper(krause, T.rg("krause", [[0, "#efe5d2", 0.95], [0.6, "#e8dcc4", 0.8], [1, "#e2d4b9", 0]], 0.75, 0.75, 0.8),
    { vol: false, rand: false, innen: haare(T, krause, 62, (x, y) => 150 - (y + 70) * 2, 2, [["#fff", 1, 0.12, 0.6], ["#b9a582", 0.8, 0.13, 0.5]], 12, 0.25) });
  /* Wangenbart: helle Haarkante vom Ohransatz um die Wange zur Kehle, dahinter grauer Hals */
  s += fellKante(T, [[137.6, -86], [135.6, -79], [134.8, -71], [135.6, -64], [137.6, -59]], 36, -2.4, 1.3, "#efe6d4", 0.15, 0.85);
  s += fellKante(T, [[135.4, -84], [133.4, -77], [132.8, -69], [133.6, -62]], 23, -2.2, 1.1, "#3a332b", 0.16, 0.5);
  /* Randhaare: Rückenlinie, Mähne, Halskrause, Bauchfransen, „Hosen“ hinten an der Keule */
  s += fellKante(T, [[46, -77.4], [62, -78], [78, -77.2], [96, -79.3], [111, -82.8]], 39, -1.8, -0.35, "#3a342d", 0.16, 0.55);
  s += fellKante(T, [[111, -82.8], [121, -86.2], [130, -89.2], [136, -91]], 25, -2.4, -1, "#25211c", 0.17, 0.6);
  s += fellKante(T, [[141, -63.4], [135, -58.8], [129.6, -52.6], [125.2, -46.6], [121, -42.4]], 31, -1.6, 2.4, "#efe4cf", 0.16, 0.8);
  s += fellKante(T, [[119, -41.4], [107, -40.2], [96, -42], [86, -45.6], [76, -51], [68, -54.8]], 43, -1.2, 2.2, "#f3ead8", 0.15, 0.75);
  s += fellKante(T, [[34.6, -66], [33, -56], [33.6, -46], [35.6, -38]], 22, -1.6, 1.6, "#ece0c6", 0.15, 0.6);
  s += fellKante(T, [[36, -28], [35.4, -20], [36.6, -12]], 6, -0.9, 0.9, "#5a4630", 0.13, 0.5);

  /* Pfoten: Zehenwülste, Krallen; Afterkralle hinten fehlt */
  s += pfoteDetail(113.4, 10.8, 4.8, 1, "#1d1813", T.fein !== false) + pfoteDetail(42.4, 10.4, 4.6, 1, "#1d1813", T.fein !== false);
  /* Nase (Nasenspiegel feucht, gekörnt), Nasenloch als Komma */
  const nase = [[167.2, -79.4], [169.9, -77.6], [170.6, -74.6], [169.4, -73.1], [167.2, -73.4], [166.2, -76.2]];
  const naseS = T.form(nase, T.lg("nase", [[0, "#4a423c"], [0.45, "#1b1715"], [1, "#0b0908"]]));
  s += T.fein !== false && T.relief ? `<g filter="${T.relief("nase", { f: 2.2, tiefe: 0.6, okt: 2 })}">${naseS}</g>` : naseS;
  s += `<path d="M170.3 -75.3q-1.2 -.3 -1.8 .6q.5 .4 1.4 .3" fill="#000"/><ellipse cx="168.4" cy="-78" rx="1" ry=".4" fill="#fff" opacity=".45"/>`;
  /* Auge: bernstein, mandelförmig, schräg gestellt */
  s += T.augeReal ? T.augeReal(151.2, -84, 1.15, { iris: "#d49a2a", iris2: "#7a4a12", offen: 0.6, winkel: -12, lid: "#100b08" })
    : `<g transform="rotate(-12 151.2 -84)">` + T.auge(151.2, -84, 1.3, "#c88b22", { flach: 0.6, lid: "#120d09" }) + `</g>`;
  /* nahes Ohr: aufrecht, gerundete Spitze, Rand dunkel, Innenhaar hell */
  const ohr = [[135.2, -89.8], [136.8, -97.4], [139.4, -102.6], [141.4, -103.4], [143.4, -99.2], [145.4, -90.8]];
  const ohrI = [[139, -91], [140, -98], [141.5, -101.4], [143.1, -97.4], [143.8, -91.2]];
  s += T.koerper(ohr, T.lg("ohr", [[0, "#3a332b"], [0.45, "#7d6e5b"], [1, "#9c8466"]]),
    { vol: false, innen: T.form(ohrI, T.lg("ohrI", [[0, "#cbb999"], [1, "#4a3d30"]])) + haare(T, ohrI, 45, -95, 1.8, [["#f4ead6", 1, 0.12, 0.8]], 30) +
      haare(T, ohr, 45, -80, 1.2, [["#2a241e", 1, 0.12, 0.45], ["#c9b08a", 0.6, 0.12, 0.5]], 14), randA: 0.3, rw: 0.45 });
  s += fellKante(T, [[135.4, -90.4], [136.8, -97.4], [139.4, -102.6]], 12, -1, -0.5, "#3a332b", 0.12, 0.6) + fellKante(T, [[141.6, -103.2], [143.4, -99.2], [145.2, -92]], 11, 0.9, -0.3, "#4a3f33", 0.11, 0.5);
  /* Tasthaare (dunkel, spärlich) aus Haarbälgen in Reihen auf der Oberlippe */
  if (T.fein !== false) s += `<path d="M161 -72.4h.01M162.6 -72.8h.01M164.2 -73.2h.01M161.8 -71.4h.01M163.4 -71.8h.01M165 -72.2h.01" stroke="#2a1f17" stroke-width=".45" stroke-linecap="round" opacity=".6"/>`;
  s += T.schnurrhaare ? T.schnurrhaare(164.4, -72, 6, 6.5, 12, 26, "#231c16", 0.11) : "";
  return { svg: s, box: [21.4, -103.4, 170.6, 0] };
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
  /* Haltung: ruhig stehend, Kopf auf Rückenhöhe leicht erhoben, Lunte tief nach hinten. Nase rechts x≈102, Widerrist 40 cm */
  const rumpf = [
    [25, -36.5], [30, -39.2], [39, -39.8], [49, -38.8], [58, -39.4], [66, -40.6],          // Kruppe, Rücken, Widerrist
    [72, -42.4], [76.6, -44.4],                                                           // kurzer Hals
    [80.5, -46.2], [84.4, -47.4], [88, -46.4], [90.6, -44.6],                              // Hinterkopf, Stirn, flacher Stopp
    [94.6, -42.6], [98.4, -40.8], [100.6, -39.8], [101.6, -38.4], [101.2, -37.3],           // schmale, spitze Schnauze, Nase
    [99.6, -36.8], [96.6, -36.2, 1], [95.4, -35.3], [92, -34.7], [88.6, -34.6],             // Oberlippe, Kinn, Unterkiefer
    [86.2, -34.4], [84.2, -32.6], [80, -30.6], [75, -27.6], [70.6, -23.6],                 // Wangenkrause, Kehle, Brust
    [66.6, -19.8], [60, -19], [52, -19.4], [45, -21.4], [39.6, -23.8], [35, -25.6],         // Brustkorb, Bauch (Winterfell)
    [29, -28.6], [25, -32.6],
  ];
  const vbN = glied([[68.6, -30], [64.2, -21], [64.8, -14], [65.6, -7.6], [65.9, -4.4], [66.6, -2.4]],
    [[5.8, 5.4], [4.2, 3.4], [2.7, 2.9], [1.9, 2.1], [2.1, 1.8], [1.6, 1.7]], pfoteHund(67.2, 5.9, 2.8));
  const hbN = glied([[31, -35], [37.6, -23.6], [31.6, -16], [25.8, -10.4], [26.6, -5.4], [27.4, -2.4]],
    [[10, 7.8], [11.4, 4.6], [6.4, 2.8], [2.9, 1.8], [1.7, 1.6], [1.6, 1.6]], pfoteHund(28.2, 5.7, 2.7));
  const vbF = glied([[66, -30], [59.6, -21], [59, -14], [58, -7.6], [57.8, -4.4], [58.2, -2.4]],
    [[4.8, 4.6], [3.6, 2.9], [2.4, 2.5], [1.8, 1.9], [1.9, 1.6], [1.5, 1.5]], pfoteHund(58.8, 5.6, 2.6));
  const hbF = glied([[34, -34], [41.8, -23], [36.6, -15.8], [32.4, -10.4], [33.4, -5.4], [34.6, -2.4]],
    [[8.4, 7], [5.8, 4.2], [3.9, 2.5], [2.4, 1.6], [1.5, 1.4], [1.4, 1.4]], pfoteHund(35.4, 5.4, 2.5));

  /* Fell nach Höhe: Rücken rostrot, Flanke orangerot, Läufe unten schwarz („Strümpfe“) */
  const fell = hoehenVerlauf(T, "fell", -50, 0, [[-50, "#98411a"], [-41, "#ad4e1c"], [-33, "#c46226"], [-26, "#d27c3c"], [-20, "#c97436"], [-15, "#8e5230"], [-11, "#35231a"], [-6, "#1b1410"], [0, "#110c0a"]]);
  const fellF = hoehenVerlauf(T, "fellF", -50, 0, [[-40, "#743313"], [-24, "#8a4823"], [-15, "#55341f"], [-11, "#20160f"], [0, "#0d0a08"]]);
  const box = [-8, -62, 108, 0];
  const rot = [["#5d2509", 1.1, 0.12, 0.5], ["#f3b071", 0.8, 0.11, 0.5], ["#2a1a10", 0.3, 0.12, 0.45], ["#e6dccd", 0.2, 0.1, 0.45]];
  const schwarz = [["#000", 1, 0.1, 0.5], ["#6a5442", 0.7, 0.09, 0.5]];

  let s = "";
  /* fernes Ohr (nur der Rand ragt neben dem nahen vor) */
  const ohrF = [[83.4, -45.8], [85.6, -51.8], [87, -54.2], [88, -51], [89, -46]];
  s += T.form(ohrF, T.lg("ohrF", [[0, "#0f0b09"], [1, "#3a2416"]])) + fellKante(T, [[87, -54], [88, -51], [88.8, -47]], 10, 0.6, 0.1, "#1a120c", 0.07, 0.6);
  /* ferne Beine */
  const fD = vereint(T, [vbF, hbF]);
  s += silhouette(T, fD, fellF, struktur(T, fD, "lauf", "#000", 0, 0.3, box, 3.2, 0.5) + fleck(T, "", 50, -22, 22, 6, "#000", 0.4) +
    haare(T, vbF, 30, 93, 0.7, schwarz, 6) + haare(T, hbF, 36, (x, y) => (y < -18 ? 120 : 95), 0.8, schwarz, 8), "#140d09", 0.5, 0.35);
  s += pfoteDetail(58.8, 5.6, 2.6, 0.7, "#0c0907", T.fein !== false) + pfoteDetail(35.4, 5.4, 2.5, 0.7, "#0c0907", T.fein !== false);

  /* Lunte: sehr buschig schon ab der Wurzel, tief nach hinten, dunkler Rückenstrich, weiße Spitze */
  const lunte = [[30, -39], [22, -39.4], [14.6, -37.4], [8, -33.6], [2.8, -28.4], [-0.8, -22.4], [-2.8, -17], [-2.8, -12.8], [-0.8, -10, 1],
    [1.2, -12], [3.2, -10.8, 1], [4.6, -13.6], [8.2, -17.8], [13.6, -22.2], [19.4, -25.8], [24.4, -28.2], [28.4, -30.8]];
  const spitze = [[-3.2, -18.8], [-0.2, -21.4], [3.6, -20], [5.8, -16.6], [4.4, -12.4], [1.4, -9.6], [-2.2, -10.6], [-3.6, -14.4]];
  s += silhouette(T, T.glatt(lunte), T.lg("lunte", [[0, "#a84c1c"], [0.45, "#c46526"], [0.8, "#97512a"], [1, "#d8b490"]], 0, 0, 0, 1),
    fleck(T, "", 13, -28, 12, 4.5, "#fff", 0.2, 30) + fleck(T, "", 12, -21, 13, 4, "#000", 0.3, 34) + fleck(T, "", 16, -35, 12, 2, "#000", 0.4, 22) +
    T.form(spitze, T.rg("spitze", [[0, "#f6f1e8"], [0.7, "#ece3d4"], [1, "#ece3d4", 0]], 0.4, 0.65, 0.65)) +
    straehnen(T, lunte, 140, (x, y) => 148 - (x - 10) * 0.4, 4.2, 0.3, ["#2a160a", 0.32], ["#f5b778", 0.3], 12) +
    haare(T, lunte, 132, (x, y) => 146 - (x - 10) * 0.4, 3, [["#1c120b", 1.2, 0.12, 0.5], ["#f0a764", 0.8, 0.11, 0.5], ["#fff", 0.3, 0.1, 0.4]], 14, 0.25) +
    haare(T, spitze, 50, 130, 2.4, [["#fff", 1, 0.11, 0.7], ["#d3c6b2", 0.5, 0.1, 0.5]], 18, 0.3), "#3a1d0c", 0.5, 0.35);
  s += fellKante(T, [[22, -39.4], [14.6, -37.4], [8, -33.6], [2.8, -28.4], [-0.8, -22.4]], 34, -1.5, -0.6, "#a54a1a", 0.12, 0.6);
  s += fellKante(T, [[-0.8, -22.4], [-2.8, -17], [-2.8, -12.8], [-0.8, -10.2]], 18, -1.3, 0.8, "#f4eee4", 0.11, 0.8);
  s += fellKante(T, [[3.2, -10.8], [8.2, -17.8], [13.6, -22.2], [19.4, -25.8], [24.4, -28.2]], 26, -0.6, 1.5, "#3a2414", 0.11, 0.55);

  /* Körper + Kopf + nahe Beine */
  const kD = vereint(T, [rumpf, vbN, hbN]);
  let n = "";
  n += T.form([[22, -40], [40, -41.4], [58, -41], [70, -43.4], [80, -48], [80, -42], [72, -36], [60, -34], [40, -35], [26, -34]], T.lg("ruecken", [[0, "#5e2508", 0.55], [1, "#5e2508", 0]]));
  n += fleck(T, "", 34, -33, 7, 5, "#fff", 0.2) + fleck(T, "", 66, -33, 5, 6, "#fff", 0.2) + fleck(T, "", 52, -34, 10, 3, "#fff", 0.15);
  /* Bauch: weißlich-grau, weich nach oben auslaufend */
  const bauch = [[70, -20.4], [62, -19.2], [52, -19.6], [45, -21.6], [39, -24.2], [36, -26], [44, -24.4], [54, -22.6], [64, -22.6]];
  n += T.form(bauch, T.lg("bauch", [[0, "#e4d8ca", 0], [0.6, "#e4d8ca", 0.6], [1, "#c9bba9", 0.75]]));
  n += fleck(T, "", 52, -20, 18, 3, "#000", 0.3) + fleck(T, "", 61, -26, 2.4, 5, "#000", 0.3, 10) + fleck(T, "", 38, -25, 3, 5, "#000", 0.3, -20);
  /* schwarze Strümpfe: vorn an der Vorderseite des Vorderlaufs bis zur Brust hinauf, hinten ab dem Sprunggelenk */
  n += T.form([[67.2, -25], [68.8, -17], [68.4, -9], [69.6, -3], [72.4, -1], [70, 0.2], [62, 0.2], [62.6, -5], [63, -10], [63.4, -15], [64.8, -20]], T.lg("strumpfV", [[0, "#1a120d", 0], [0.25, "#1a120d", 0.9], [1, "#0d0907"]]));
  n += T.form([[22, -15], [27, -14], [29, -9], [29.4, -3], [32.4, -1], [30, 0.2], [24, 0.2], [24.4, -5], [23.6, -10]], T.lg("strumpfH", [[0, "#1a120d", 0], [0.35, "#1a120d", 0.9], [1, "#0d0907"]]));
  n += fleck(T, "", 64.4, -10, 1, 6, "#fff", 0.2) + fleck(T, "", 25, -7, 0.8, 4, "#fff", 0.2) + fleck(T, "", 27.8, -17.4, 0.8, 4.5, "#fff", 0.3, 38);
  n += struktur(T, vereint(T, [unten(vbN, -19), unten(hbN, -14)]), "lauf", "#000", 0, 0.3, box, 3.2, 0.5);
  /* Fell: Strähnen + Deckhaar in Wuchsrichtung */
  const wuchs = (x, y) => (x > 70 ? 140 - (y + 42) * 1.2 : y > -21 ? 93 : x < 38 ? 115 + (x - 25) * 0.8 : 176 - (y + 38) * 0.6);
  const rumpfH = rumpf.filter((p) => p[0] < 81);
  n += straehnen(T, rumpfH, 170, wuchs, 3, 0.2, ["#5a2008", 0.3], ["#f7b77a", 0.3]);
  n += haare(T, rumpfH, 250, wuchs, 2, rot, 10, 0.15);
  const keule = [[21, -36], [30, -40], [44, -38], [44, -28], [37, -20], [30, -15], [24, -18], [21, -27]];
  n += straehnen(T, keule, 50, (x, y) => 118 + (x - 25) * 0.8, 2.8, 0.2, ["#5a2008", 0.25], ["#f7b77a", 0.3]) + haare(T, keule, 60, (x, y) => 118 + (x - 25) * 0.8, 1.6, [["#5d2509", 0.6, 0.1, 0.4], ["#f3b071", 1, 0.1, 0.45]], 10, 0.15);
  n += haare(T, unten(vbN, -19), 45, 93, 0.7, schwarz, 6) + haare(T, unten(hbN, -14), 45, 94, 0.8, schwarz, 8);
  /* Kopf: weiße Oberlippe, Wangen, Kinn, Kehle, Brust; Tränenstrich und Tasthaar-Fleck schwarz */
  /* Weiß: Oberlippe → Wange unter dem Auge → Wangenkrause (Kante nach hinten) → nur die Kehle/Brust vorn */
  const weiss = [[86.6, -41.2], [90, -40.4], [94, -39.8], [98, -38.8], [101, -37.4], [101.4, -36.4], [96.6, -35.4], [95.6, -34.4], [92, -33.8], [88.6, -33.8], [86.4, -33.6], [84.4, -31.8], [80, -29.8], [75, -26.8], [70.6, -22.8], [66.6, -19.4], [68.8, -24], [73, -28.6], [78, -32.4], [81.6, -35.6], [83, -38.4], [84.2, -40.6]];
  n += T.form(weiss, T.lg("weiss", [[0, "#f6f1e8", 0], [0.12, "#f6f1e8", 0.95], [1, "#e9e0d2", 0.97]]));
  n += haare(T, weiss, 110, (x, y) => (x > 88 ? 190 : 125 - (x - 78) * 1.4), 1, [["#fff", 1, 0.07, 0.6], ["#b9ab98", 0.6, 0.07, 0.45]], 14);
  const kopfO = [[79, -46], [84.4, -47.6], [88, -46.6], [91, -44.6], [95, -42.6], [99, -40.8], [100.6, -39.8], [96, -40.6], [90, -41.2], [82, -41.4]];
  n += haare(T, kopfO, 90, (x, y) => (x > 90 ? 196 : 182), 0.8, [["#5a2008", 1, 0.07, 0.45], ["#f3b071", 0.8, 0.07, 0.45]], 12);
  n += fleck(T, "", 92.8, -41.2, 3.6, 0.6, "#000", 0.6, 30) + fleck(T, "!", 96.8, -38.2, 2.4, 1, "#1a100a", 0.8, 14) + fleck(T, "", 89.2, -42.9, 1.9, 1.1, "#000", 0.4, -18);
  n += fleck(T, "", 82, -42, 4, 3, "#fff", 0.2) + fleck(T, "", 88, -36.2, 4, 1.3, "#000", 0.2);
  /* Lefze: lang (bis unter das Auge), fast gerade, am Ende leicht abwärts */
  n += zart(T, [[100.6, -36.9], [97.6, -36.3], [94.4, -35.9], [92, -35.7], [90.8, -35.2]], "#1a100a", 0.2, 0.75) + zart(T, [[100.6, -36.9], [97.4, -36.3]], "#1a100a", 0.34, 0.8);
  s += silhouette(T, kD, fell, n, "#2a1408", 0.5, 0.3);

  /* Randhaare: Rücken, Nacken, Wangenkrause (weiß), Kehle, Bauch */
  s += fellKante(T, [[30, -39.4], [40, -39.9], [50, -39], [58, -39.6], [66, -40.8], [72, -42.6]], 46, -1, -0.25, "#8a3a14", 0.1, 0.6);
  s += fellKante(T, [[84.4, -40.4], [83, -37.4], [83.6, -34.4]], 18, -1.8, 0.9, "#f4eee4", 0.1, 0.85);
  s += fellKante(T, [[86.2, -34.4], [84.2, -32.6], [80, -30.6], [75, -27.6], [70.6, -23.6], [67, -20.4]], 36, -1, 1.4, "#f4eee4", 0.1, 0.8);
  s += fellKante(T, [[66, -19.8], [58, -19.1], [50, -19.8], [44, -21.7], [38, -24.2]], 32, -0.8, 1.3, "#e1d6c8", 0.1, 0.7);
  s += fellKante(T, [[23, -34], [21.8, -28], [22.4, -22]], 14, -1, 1, "#c4642a", 0.1, 0.6);
  /* Pfoten */
  s += pfoteDetail(67.2, 5.9, 2.8, 1, "#0c0907", T.fein !== false) + pfoteDetail(28.2, 5.7, 2.7, 1, "#0c0907", T.fein !== false);
  /* Nase: klein, schwarz, feucht */
  const nase = [[99.8, -40.2], [101.5, -39.2], [101.9, -37.7], [101.2, -37.1], [99.8, -37.2], [99.2, -38.7]];
  const naseS = T.form(nase, T.lg("nase", [[0, "#3f3732"], [0.5, "#161210"], [1, "#0a0807"]]));
  s += T.fein !== false && T.relief ? `<g filter="${T.relief("nase", { f: 8, tiefe: 0.12, okt: 1 })}">${naseS}</g>` : naseS;
  s += `<path d="M101.7 -38.1q-.7 -.2 -1 .3q.3 .2 .8 .2" fill="#000"/><ellipse cx="100.5" cy="-39.5" rx=".55" ry=".22" fill="#fff" opacity=".5"/>`;
  /* Auge: bernstein-orange, schräg, SENKRECHTE Schlitzpupille */
  s += T.augeReal ? T.augeReal(89.2, -42.9, 0.84, { iris: "#e2a234", iris2: "#8a4e10", offen: 0.66, winkel: -18, pupille: "schlitz", lid: "#0c0705" })
    : `<g transform="rotate(-18 89.2 -42.9)">` + T.auge(89.2, -42.9, 0.8, "#e0a032", { flach: 0.6, pupille: "schlitz" }) + `</g>`;
  /* nahes Ohr: groß, dreieckig, breite Basis; Rückseite schwarz, vorn die weiß behaarte Muschel */
  /* Ohr als Muschel: hinten/oben schwarz, an der Basis rostrot, vorn die Öffnung mit dichtem cremeweißem Innenhaar */
  const ohr = [[77.6, -45.2], [78.6, -49.6], [80.4, -54.2], [82, -56.8], [83.6, -54.6], [85.6, -50.4], [87, -45.8]];
  const ohrI = [[81.2, -45.8], [81.8, -50], [82.6, -53.8], [84.6, -50.2], [86.4, -45.8]];
  s += T.koerper(ohr, T.lg("ohr", [[0, "#0d0907"], [0.55, "#1d130d"], [0.82, "#5a2a12"], [1, "#9a4a1c"]]),
    { vol: false, innen: T.form(ohrI, T.lg("ohrI", [[0, "#8a6e58"], [0.5, "#d8cab8"], [1, "#efe6d8"]])) +
      haare(T, ohrI, 55, -100, 1.6, [["#fbf6ee", 1, 0.08, 0.85], ["#b9a58e", 0.4, 0.08, 0.6]], 30, 0.3) + fleck(T, "", 83.4, -46.6, 3, 1.6, "#000", 0.3), randA: 0.25, rw: 0.25 });
  s += fellKante(T, [[77.8, -45.6], [78.6, -49.6], [80.4, -54.2]], 12, -0.7, -0.3, "#120c09", 0.07, 0.6) + fellKante(T, [[83.6, -54.6], [85.6, -50.4], [86.6, -46.6]], 12, 0.7, -0.4, "#f1e8da", 0.07, 0.7);
  /* Tasthaare: schwarz, lang */
  if (T.fein !== false) s += `<path d="M95.6 -37.5h.01M96.4 -37.7h.01M97.2 -37.9h.01M98 -38.1h.01M96 -36.9h.01M96.8 -37.1h.01M97.6 -37.3h.01M98.4 -37.5h.01" stroke="#000" stroke-width=".2" stroke-linecap="round" opacity=".6"/>`;
  s += T.schnurrhaare ? T.schnurrhaare(97, -37.4, 7, 6, 10, 30, "#1a120c", 0.06) : "";
  return { svg: s, box: [-3.6, -56.8, 101.9, 0] };
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
  /* Haltung: ruhiges Stehen, Kopf unter der Buckellinie, Beine wie Säulen. Kopf als eigene Form (größer gesetzt). */
  const rumpf = [
    [8, -72], [11, -82], [18, -90], [30, -95.6], [46, -98], [64, -98.2], [84, -99], [104, -103.4], [119, -109.8], [131, -112.8], // Kruppe tiefer als Buckel, Rücken steigt zum Buckel
    [143, -110], [153, -104.6], [161, -100.6], [170, -96], [176, -86], [177, -72],                                       // Nacken (unter dem Kopf)
    [172, -64], [166, -58.6], [160.6, -51.6], [155, -45], [148, -42.6],                                                   // Halskrause, Brust
    [138, -42.6], [124, -42.4], [108, -43.4], [90, -44.4], [72, -45.6], [56, -48], [43, -52.6],                             // Brustkorb, Bauch
    [30, -60], [18, -66], [10, -68],
  ];
  const vbN = glied([[143, -78], [130, -54], [131.6, -32], [134, -16]], [[16, 16], [14, 11], [10.6, 9.4], [9.8, 9.2]], tatzeB(124, 155, 15));
  const hbN = glied([[30, -82], [44, -56], [39.4, -32], [36, -18], [37, -12]], [[20, 17], [14.6, 12], [10.6, 9.6], [11, 9.4], [9.6, 9.6]], tatzeB(27, 59, 13));
  const vbF = glied([[129, -78], [115, -54], [116, -32], [118, -16]], [[14, 13], [12.4, 9.6], [9.6, 8.6], [8.8, 8.4]], tatzeB(108.6, 137.6, 14));
  const hbF = glied([[48, -82], [62, -56], [58, -32], [55.6, -14]], [[18, 15], [13.6, 11], [10, 9], [9, 9]], tatzeB(46.6, 76, 12));

  const fell = hoehenVerlauf(T, "fell", -114, 0, [[-114, "#94714a"], [-102, "#7a5734"], [-86, "#674629"], [-66, "#583820"], [-46, "#4a2e1a"], [-22, "#3a2415"], [0, "#2a190e"]]);
  const fellF = hoehenVerlauf(T, "fellF", -114, 0, [[-90, "#45301c"], [-50, "#362314"], [0, "#20130a"]]);
  const box = [0, -116, 216, 0];
  const braun = [["#22150b", 1.2, 0.24, 0.5], ["#c9a26e", 0.75, 0.22, 0.5], ["#8a6038", 0.6, 0.24, 0.45], ["#ecd5ad", 0.25, 0.2, 0.45]];
  const kopfTr = `translate(-5 2) translate(172 -84) scale(1.13) translate(-172 84)`;

  let s = "";
  /* fernes Ohr (klein, rund, halb verdeckt) – im Kopf-Maßstab */
  const ohrF = [[167.6, -99.4], [168.4, -104], [171.4, -106.4], [174.6, -105], [175.4, -100]];
  s += `<g transform="${kopfTr}">` + T.form(ohrF, "#33210f") + fellKante(T, [[168.4, -104], [171.4, -106.2], [174.6, -104.8]], 14, 0.2, -1.2, "#5a3b22", 0.18, 0.6) + `</g>`;
  /* ferne Beine */
  const fD = vereint(T, [vbF, hbF]);
  s += silhouette(T, fD, fellF, fellGrund(T, fD, "bF", "#0c0703", "#a07a52", 95, box, 0.8) + fleck(T, "", 90, -46, 60, 14, "#000", 0.4) + fleck(T, "", 112, -30, 3, 16, "#fff", 0.1) + fleck(T, "", 53, -30, 3, 14, "#fff", 0.1) +
    straehnen(T, unten(vbF, -50), 26, 96, 5, 0.45, ["#120a05", 0.3], ["#7a5a3a", 0.25]) + straehnen(T, unten(hbF, -50), 26, 100, 5, 0.45, ["#120a05", 0.3], ["#7a5a3a", 0.25]), "#140c06", 0.8, 0.4);
  s += baerKrallen(137.4, -2.8, 3, 6.4, 1.3, "#8f806a", "#fff", 0.75, T.fein !== false) + baerKrallen(75.6, -1.6, 3, 3.6, 1.2, "#4a3e30", "#fff", 0.8, T.fein !== false);

  /* Körper + Hals + nahe Beine */
  const kD = vereint(T, [rumpf, vbN, hbN]);
  let n = "";
  n += fellGrund(T, T.glatt(gleich(rumpf)), "bR", "#140b05", "#e8c898", 150, box) + fellGrund(T, vereint(T, [unten(vbN, -44), unten(hbN, -60)]), "bL", "#0c0703", "#c09a6a", 95, box);
  /* silbrig-goldene Haarspitzen auf Buckel, Schultern und Rücken (Grizzly) */
  n += T.form([[16, -97], [50, -105], [100, -105], [120, -112], [138, -115], [165, -103], [160, -84], [132, -80], [100, -84], [60, -86], [24, -84]],
    hoehenVerlauf(T, "spitzen", -114, -84, [[-114, "#dcc093", 0.6], [-100, "#dcc093", 0.3], [-86, "#dcc093", 0]]));
  /* Plastik: Buckel und Schulter im Licht, Keule rund, Bauch und Ellbogen im Schatten */
  n += fleck(T, "", 128, -100, 16, 10, "#fff", 0.3) + fleck(T, "", 34, -86, 16, 10, "#fff", 0.2) + fleck(T, "", 90, -88, 26, 8, "#fff", 0.1);
  n += fleck(T, "", 92, -47, 52, 9, "#000", 0.5) + fleck(T, "", 117, -64, 6, 18, "#000", 0.3, 10) + fleck(T, "", 58, -66, 6, 15, "#000", 0.3, -25) + fleck(T, "", 162, -70, 10, 16, "#000", 0.3, 20);
  n += fleck(T, "", 129, -28, 5, 16, "#fff", 0.15) + fleck(T, "", 36, -28, 6, 14, "#fff", 0.12) + fleck(T, "", 141, -32, 4, 14, "#000", 0.3) + fleck(T, "", 92, -2, 70, 5, "#000", 0.4);
  /* Fell: zottige Strähnen und Deckhaar; Buckel/Nacken nach hinten-unten, Keule abwärts, Läufe abwärts */
  const wuchs = (x, y) => (x > 150 ? 128 - (y + 90) * 0.6 : y > -44 ? 96 : x < 46 ? 104 + (x - 20) * 1.4 : 162 - (y + 100) * 0.5);
  n += straehnen(T, rumpf, 170, wuchs, 8, 0.5, ["#1e1209", 0.32], ["#dcb987", 0.32], 14);
  n += haare(T, rumpf, 150, wuchs, 5, braun, 12, 0.2);
  n += straehnen(T, unten(vbN, -46), 36, 95, 6, 0.48, ["#120a05", 0.3], ["#8a6a48", 0.3]) + straehnen(T, unten(hbN, -46), 40, (x, y) => (y < -30 ? 106 : 95), 6, 0.48, ["#120a05", 0.3], ["#8a6a48", 0.3]);
  n += haare(T, unten(vbN, -46), 40, 94, 3, braun, 10) + haare(T, unten(hbN, -46), 40, 96, 3, braun, 10);
  s += silhouette(T, kD, fell, n, "#1a0f07", 0.9, 0.4);

  /* zottige Randhaare: Buckel/Rücken (hell gespitzt), Halskrause, Bauchfransen, Ellbogenfransen, Hosen */
  s += fellKante(T, [[18, -89.6], [30, -95.2], [46, -97.6], [64, -97.8], [84, -98.6], [104, -103], [119, -109.4], [131, -112.4], [143, -109.6], [153, -104.2]], 80, -3.2, -0.6, "#6a4a2c", 0.22, 0.6);
  s += fellKante(T, [[46, -97.8], [100, -102.4], [126, -111.6], [148, -107.6]], 34, -2.8, -0.9, "#e0c69a", 0.2, 0.5);
  s += fellKante(T, [[172, -64], [166, -58.6], [160.6, -51.6], [155, -45], [148, -42.6]], 36, -2.2, 3, "#5a3b22", 0.24, 0.7);
  s += fellKante(T, [[148, -42], [138, -42.4], [124, -42.2], [108, -43.2], [90, -44.2], [72, -45.4], [56, -47.8]], 70, -1.4, 4.4, "#3e2716", 0.24, 0.75);
  s += fellKante(T, [[124, -48], [121, -40], [121.4, -30]], 16, -2.4, 2.2, "#3a2414", 0.22, 0.6);
  s += fellKante(T, [[11.6, -82], [8.6, -72], [10, -62], [14.6, -54]], 26, -1.4, 1.4, "#4a2f1b", 0.2, 0.55);
  /* Tatzen: Zehenwülste und lange helle, gebogene Krallen vorn; hinten kürzer und dunkler */
  s += baerKrallen(154, -3, 4, 8.4, 1.4, "#cdbd9f", "#fff", 1, T.fein !== false) + baerKrallen(58.4, -1.8, 4, 4.2, 1.3, "#5e4e3c", "#fff", 1, T.fein !== false);
  if (T.fein !== false) s += `<path d="M149.6 -8.2q-1.2 3.4 -.4 7M144.4 -9q-1 3.6 -.4 8M53.6 -6.6q-1 2.8 -.4 5.8M48.2 -7.6q-1 3 -.4 6.8" stroke="#0d0805" stroke-width=".5" stroke-opacity=".5" fill="none"/>`;

  /* ---- Kopf (eigene Form, im Kopf-Maßstab): breite Stirn, konkaves Profil, lange Schnauze, volle Wangen ---- */
  const kopf = [[156, -90], [158.6, -97.4], [164, -100.8], [170, -101], [176, -100.2], [181.4, -97.4], [186, -93], [190.4, -90], [196, -88.4], [202, -86.8], [207, -84.6],
    [211, -81.4], [213, -77.6], [212.4, -74], [209.6, -72.4], [205, -71.2], [200.6, -69.4, 1], [198.6, -67], [194, -65.2], [187, -64.6], [180, -65.4], [173, -64.6], [166, -67], [159.4, -73], [156, -80]];
  let k = "";
  k += fellGrund(T, T.glatt(kopf), "bK", "#140b05", "#e8c898", 185, box, 0.8);
  const schnauze = [[189, -89], [196, -88.6], [203, -86.4], [209, -83], [212, -78], [210, -73.4], [204, -71.4], [199, -68.6], [192, -66.4], [186, -67.4], [184, -76]];
  k += T.form(schnauze, T.rg("schnauze", [[0, "#ac8456", 0.85], [0.7, "#93693f", 0.6], [1, "#93693f", 0]], 0.6, 0.45, 0.6));
  k += fleck(T, "", 180, -95, 7, 4, "#fff", 0.3) + fleck(T, "", 186.4, -87.6, 4.4, 3, "#000", 0.4) + fleck(T, "", 174, -78, 9, 8, "#fff", 0.12) + fleck(T, "", 190, -67.6, 9, 2.2, "#000", 0.3) + fleck(T, "", 166, -74, 7, 8, "#000", 0.3);
  k += haare(T, kopf, 190, (x, y) => (x > 188 ? 194 : 160 + (y + 85) * 1.4), 2, [["#24160c", 1, 0.15, 0.5], ["#cfa676", 0.8, 0.14, 0.5], ["#7a5634", 0.5, 0.15, 0.45]], 14, 0.2);
  k += zart(T, [[209.4, -72.6], [205, -71.2], [200, -70.2], [195, -69.7], [191.6, -69.4], [190.8, -69]], "#140b06", 0.5, 0.85);
  /* Kopfform: hinten weich in den Hals ausgeblendet (keine „Maskenkante“), Rand nur vorn */
  let kopfSvg = `<g mask="${ausblenden(T, "kopf", 157, 168, [150, -112, 216, -60])}">` + silhouette(T, T.glatt(kopf), fell, k, "#1a0f07", 0.8, 0.35) + `</g>`;
  /* Wangen- und Kinnfell, das über den Hals fällt (verdeckt die Naht Kopf/Hals) */
  kopfSvg += fellKante(T, [[159.4, -94], [157, -86], [157, -78], [160, -71], [166, -66.4], [173, -64.6]], 60, -2.4, 1.6, "#4a2f1b", 0.2, 0.75);
  kopfSvg += fellKante(T, [[194, -65.2], [187, -64.6], [180, -65.4], [173, -64.6]], 26, -1, 2.4, "#3a2414", 0.18, 0.6);
  /* Nase: groß, schwarz, Nasenloch, feucht glänzend */
  const nase = [[207.4, -83.4], [211.4, -81.2], [213.4, -77.2], [212.8, -73.8], [209.6, -73], [207, -74.8], [206.2, -79.4]];
  const naseS = T.form(nase, T.lg("nase", [[0, "#3e3631"], [0.5, "#171311"], [1, "#0a0807"]]));
  kopfSvg += T.fein !== false && T.relief ? `<g filter="${T.relief("nase", { f: 2.4, tiefe: 0.3, okt: 1 })}">${naseS}</g>` : naseS;
  kopfSvg += `<path d="M213 -75.8q-1.8 -.4 -2.8 .8q.9 .6 2.4 .4" fill="#000"/><ellipse cx="209.4" cy="-81.4" rx="1.6" ry=".6" fill="#fff" opacity=".4"/>`;
  /* Auge: klein, dunkelbraun, unter dem Brauenwulst */
  kopfSvg += T.augeReal ? T.augeReal(186.6, -87.8, 1, { iris: "#5c3418", iris2: "#24120a", offen: 0.66, winkel: -8, lid: "#0d0805" }) : T.auge(186.6, -87.8, 1, "#4a2a14");
  kopfSvg += zart(T, [[183.6, -90.2], [186.8, -91], [189.6, -90]], "#140b06", 0.3, 0.4);
  /* nahes Ohr: klein, rund, dicht behaart, Ohröffnung dunkel */
  const ohr = [[160.4, -98.4], [160.6, -103.6], [163.2, -107], [167, -106.8], [169.2, -103.4], [168.8, -98.6]];
  kopfSvg += T.koerper(ohr, T.lg("ohr", [[0, "#2a1a0e"], [1, "#6a4a2c"]]), { vol: false, rand: false,
    innen: T.form([[162.8, -99], [163.2, -103], [165.4, -105.2], [167.4, -102.6], [167.2, -99]], "#140b06", ' opacity=".55"') + haare(T, ohr, 50, -95, 1.8, [["#c9a072", 1, 0.14, 0.6], ["#2a1a0e", 0.8, 0.14, 0.5]], 40, 0.3) });
  kopfSvg += fellKante(T, [[160.4, -99], [160.6, -103.6], [163.2, -107], [167, -106.8], [169.2, -103.4]], 26, 0, -1.3, "#5a3b22", 0.16, 0.65);
  if (T.fein !== false) kopfSvg += `<path d="M205 -73.6q3 .4 6 2M204.6 -74.6q3.4 -.4 6.4 .4" stroke="#1a120c" stroke-width=".14" fill="none" opacity=".6"/>`;
  s += `<g transform="${kopfTr}">${kopfSvg}</g>`;
  /* Kopf rechts: 172 + (213.4 − 172) · 1,13 − 5 ≈ 213,8; oben: −84 + (−107 + 84) · 1,13 + 2 ≈ −108 */
  return { svg: s, box: [6.4, -113.2, 213.8, 0] };
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
  const rumpf = [
    [11, -76], [12.6, -86], [17, -96], [26, -104.6], [40, -110], [56, -112], [76, -110.4], [98, -107], [118, -104.4], [132, -101.6], // hohe Hüfte, Rücken fällt zur Schulter
    [146, -97.6], [160, -93.4], [172, -90.4], [182, -89.4],                                                          // langer Hals
    [190, -90.6], [198, -89.6], [206, -87], [214, -84], [221, -80.4], [227, -76.4], [230.6, -72.6], [231.2, -68.8],     // flacher Schädel, Römernase
    [229.4, -66.4], [225.6, -65.2], [221.4, -63.6, 1], [219.6, -61.8], [213, -60.6], [205, -61], [197, -63],            // Lippe, Kinn, Unterkiefer
    [188, -66.6], [178, -68], [166, -65], [156, -59], [149, -51],                                                    // Hals unten, Brust
    [140, -47], [122, -46], [104, -47], [86, -48.8], [68, -51.6], [52, -56.6], [38, -63],                             // Bauch
    [26, -69], [16, -73],
  ];
  const vbN = glied([[138, -80], [126, -56], [128.4, -34], [130.6, -18], [131.6, -12]], [[14, 13], [12.6, 10.4], [9.6, 8.8], [8, 7.6], [9, 9]], tatzeB(121, 156, 13));
  const hbN = glied([[36, -94], [50, -66], [45, -38], [41, -18], [42, -12]], [[19, 16], [14.6, 11.6], [10.4, 9.2], [10.4, 8.6], [9.6, 9.6]], tatzeB(31, 68, 12));
  const vbF = glied([[124, -80], [111, -56], [112, -34], [113.6, -18], [114.6, -12]], [[12.4, 11.6], [11, 9.2], [8.8, 8], [7.4, 7], [8.4, 8.4]], tatzeB(105, 139, 12));
  const hbF = glied([[54, -92], [68, -66], [63.4, -38], [60, -18], [61, -12]], [[17, 14], [13, 10.4], [10, 9], [10.2, 8.6], [9.4, 9.4]], tatzeB(50, 88, 12));

  const fell = hoehenVerlauf(T, "fell", -114, 0, [[-114, "#fcfaf3"], [-100, "#f4f0e4"], [-80, "#ebe5d4"], [-60, "#e0d7c0"], [-46, "#d8ccb0"], [-20, "#ddd2b8"], [0, "#cbbd9c"]]);
  const fellF = hoehenVerlauf(T, "fellF", -114, 0, [[-100, "#b9bab4"], [-60, "#a6a69c"], [-20, "#a39d88"], [0, "#8c836b"]]);
  const box = [0, -124, 234, 0];
  const weiss = [["#fff", 1, 0.24, 0.6], ["#a49c8c", 0.8, 0.22, 0.4], ["#d9cdb2", 0.6, 0.24, 0.45]];
  const blau = "#6f7f92";

  let s = "";
  /* ferne Beine (bläulicher Schatten) */
  const fD = vereint(T, [vbF, hbF]);
  s += silhouette(T, fD, fellF, fellGrund(T, fD, "eF", "#6a6252", "#fff", 95, box, 0.6) + fleck(T, "", 92, -44, 60, 14, blau, 0.3) +
    straehnen(T, unten(vbF, -50), 24, 96, 5, 0.45, ["#7a705e", 0.3], ["#fff", 0.35]) + straehnen(T, unten(hbF, -60), 26, 100, 5, 0.45, ["#7a705e", 0.3], ["#fff", 0.35]), "#5a5244", 0.7, 0.35);
  s += baerKrallen(139, -2.4, 3, 3.6, 1.4, "#2a221c", "#fff", 0.8, T.fein !== false) + baerKrallen(88, -2.2, 3, 3.2, 1.3, "#2a221c", "#fff", 0.8, T.fein !== false);

  /* Körper + Kopf + nahe Beine */
  const kD = vereint(T, [rumpf, vbN, hbN]);
  let n = "";
  n += fellGrund(T, T.glatt(gleich(rumpf)), "eR", "#7a7262", "#fff", 160, box, 0.7) + fellGrund(T, vereint(T, [unten(vbN, -48), unten(hbN, -68)]), "eL", "#7a7262", "#fff", 95, box, 0.7);
  /* Licht: Rücken/Hüfte hell, Schatten bläulich am Bauch, unter dem Hals, hinter der Schulter */
  /* Form: Licht oben (Hüfte, Rücken, Schulter, Stirn), kühler Eigenschatten unten (Bauch, Halsunterseite, Ellbogen, Kniefalte) */
  n += fleck(T, "", 48, -100, 26, 12, "#fff", 0.6) + fleck(T, "", 120, -96, 22, 9, "#fff", 0.5) + fleck(T, "", 196, -84, 12, 4, "#fff", 0.4);
  n += fleck(T, "!", 88, -50, 34, 9, blau, 0.5) + fleck(T, "!", 170, -68, 18, 6, blau, 0.4, 15) + fleck(T, "!", 148, -54, 8, 8, blau, 0.4) + fleck(T, "!", 205, -63, 12, 3, blau, 0.3);
  n += fleck(T, "!", 118, -60, 6, 14, blau, 0.3, 12) + fleck(T, "!", 66, -64, 6, 12, blau, 0.3, -30) + fleck(T, "!", 30, -56, 8, 16, blau, 0.25, 10);
  n += fleck(T, "", 125, -30, 3.6, 14, "#fff", 0.35) + fleck(T, "!", 136, -30, 3, 14, blau, 0.3) + fleck(T, "", 38, -30, 4, 14, "#fff", 0.3) + fleck(T, "!", 52, -30, 3, 14, blau, 0.3) + fleck(T, "!", 92, -2, 74, 5, "#5a5040", 0.3);
  /* Fell: lange Deckhaare, Wuchs nach hinten-unten; Hals nach hinten; Läufe abwärts, an den Tatzen dicht */
  const wuchs = (x, y) => (x > 150 ? 172 - (y + 88) * 0.4 : y > -48 ? 96 : x < 46 ? 104 + (x - 20) * 1.4 : 166 - (y + 105) * 0.4);
  const rumpfH = rumpf.filter((p) => p[0] < 196);
  n += straehnen(T, rumpfH, 190, wuchs, 7, 0.45, ["#8a8070", 0.28], ["#fff", 0.55], 12);
  n += haare(T, rumpfH, 160, wuchs, 4.6, weiss, 12, 0.2);
  n += straehnen(T, unten(vbN, -48), 36, 95, 5.4, 0.45, ["#8a8070", 0.25], ["#fff", 0.5]) + straehnen(T, unten(hbN, -66), 40, (x, y) => (y < -30 ? 106 : 95), 5.4, 0.45, ["#8a8070", 0.25], ["#fff", 0.5]);
  /* Kopf: Augenpartie leicht grau, Schnauze cremig, schwarze Lippen */
  const kopfH = [[182, -91], [198, -90], [214, -84.6], [226, -77], [229, -70], [222, -66], [206, -62], [192, -65], [182, -70]];
  n += haare(T, kopfH, 150, (x, y) => (x > 200 ? 196 : 182), 1.6, [["#fff", 1, 0.13, 0.6], ["#a49c8c", 0.7, 0.12, 0.45]], 12, 0.2);
  n += fleck(T, "", 207, -81, 4, 2.4, "#000", 0.2) + fleck(T, "", 212, -66, 10, 2.6, "#000", 0.2);
  n += zart(T, [[229.6, -66.8], [226, -65.8], [221.6, -64.6], [216, -64.2], [211.6, -64.2], [210.2, -63.6]], "#151210", 0.7, 0.85);
  s += silhouette(T, kD, fell, n, "#6a6050", 0.8, 0.3);

  /* Randhaare: Rücken/Hüfte, Halsunterseite, Bauchfransen, Hosen, Ellbogen */
  s += fellKante(T, [[24, -103.6], [40, -110.6], [56, -111.6], [76, -109.6], [98, -106.6], [118, -104], [132, -101.2], [146, -97.2], [160, -93]], 70, -3, -0.4, "#fff", 0.22, 0.75);
  s += fellKante(T, [[188, -66.6], [178, -68], [166, -65], [156, -59], [149, -51]], 36, -2.2, 2.8, "#d6ccb6", 0.22, 0.7);
  s += fellKante(T, [[146, -48], [140, -47], [122, -46], [104, -47], [86, -48.8], [68, -51.6], [52, -56.6]], 70, -1.4, 4, "#d2c6aa", 0.22, 0.75);
  s += fellKante(T, [[13, -86], [11.4, -76], [13.6, -68], [20, -62]], 26, -1.6, 1.4, "#e2d8c4", 0.22, 0.6);
  /* Stummelschwanz */
  s += T.form([[14, -96], [9.6, -95.6], [8.6, -92.6], [11, -90.4], [14.6, -91.6]], "#ebe4d2") + fellKante(T, [[9.6, -95.4], [8.6, -92.6], [11, -90.6]], 10, -1.2, 0.6, "#fff", 0.16, 0.7);
  s += fellKante(T, [[121, -52], [118, -44], [118.4, -32]], 14, -2.2, 2, "#cdc0a4", 0.22, 0.6);
  /* Tatzen: groß, behaart, kurze dunkle Krallen, schwarzer Ballen an der Sohle */
  s += baerKrallen(156, -2.6, 4, 4, 1.5, "#1d1814", "#fff", 1, T.fein !== false) + baerKrallen(68, -2.2, 4, 3.6, 1.4, "#1d1814", "#fff", 1, T.fein !== false);
  s += fellKante(T, [[123, -1], [152, -1]], 36, 0.4, 1.2, "#e8e0cc", 0.2, 0.7) + fellKante(T, [[32, -1], [64, -1]], 36, 0.4, 1.2, "#e8e0cc", 0.2, 0.7);
  if (T.fein !== false) s += `<path d="M155 -7.4q-1.2 3.2 -.4 6.6M149.4 -8.4q-1 3.6 -.4 7.8M65.4 -6.6q-1 2.8 -.4 5.8M59.6 -7.6q-1 3 -.4 6.8" stroke="#6a5e48" stroke-width=".5" stroke-opacity=".5" fill="none"/>`;
  /* Nase: schwarz, groß; Augen klein, dunkel mit schwarzem Lidrand */
  const nase = [[226.4, -77.4], [229.8, -75.4], [231.6, -71.6], [231, -68.6], [228.2, -68], [226, -69.6], [225.4, -73.8]];
  const naseS = T.form(nase, T.lg("nase", [[0, "#3e3631"], [0.5, "#171311"], [1, "#0a0807"]]));
  s += T.fein !== false && T.relief ? `<g filter="${T.relief("nase", { f: 2.4, tiefe: 0.3, okt: 1 })}">${naseS}</g>` : naseS;
  s += `<path d="M231.2 -70.6q-1.8 -.4 -2.6 .8q.9 .6 2.2 .4" fill="#000"/><ellipse cx="228" cy="-75.6" rx="1.4" ry=".5" fill="#fff" opacity=".45"/>`;
  s += T.augeReal ? T.augeReal(207.2, -81.4, 0.85, { iris: "#2a1a10", iris2: "#0e0805", offen: 0.7, winkel: -10, lid: "#0a0706" }) : T.auge(207.2, -81.4, 0.9, "#2a1a10");
  /* Ohr: klein, rund, weiß, kaum aus dem Fell ragend */
  const ohr = [[186, -89.4], [186.6, -94], [189.4, -96.6], [192.6, -95.6], [193.8, -91.8], [193, -88.6]];
  s += T.koerper(ohr, T.lg("ohr", [[0, "#fbf8f0"], [1, "#d6ccb6"]]), { vol: false, rand: false,
    innen: T.form([[188.2, -89.6], [188.8, -93], [190.8, -94.4], [192.2, -92], [191.8, -89.4]], "#8a8070", ' opacity=".5"') + haare(T, ohr, 30, -95, 1.4, [["#fff", 1, 0.12, 0.7]], 40, 0.3) });
  s += fellKante(T, [[186, -90], [186.6, -94], [189.4, -96.6], [192.6, -95.6]], 16, 0, -1.1, "#fff", 0.14, 0.7);
  if (T.fein !== false) s += `<path d="M222 -67.4q3.4 .2 6.4 1.8M221.6 -68.4q3.6 -.6 6.6 .2" stroke="#8a8070" stroke-width=".14" fill="none" opacity=".6"/>`;
  return { svg: s, box: [10.6, -112, 231.6, 0] };
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
  /* gedrungen, tonnenförmig; großer runder Kopf. Nase rechts x≈165, Rücken 78 cm */
  const rumpf = [
    [16, -47], [17, -58], [24, -67.4], [38, -74.4], [58, -77.6], [80, -77.6], [98, -76.4], [110, -75.4], [117, -76.4],     // runder Rücken, kein sichtbarer Hals
    [122, -79], [127, -82.4], [136, -84.4], [145, -82.8], [152, -78], [156.6, -72.4],                                  // großer runder Oberkopf
    [160, -67.6], [163.2, -64.6], [164.8, -61.6], [164.2, -58.8],                                                      // kurze Schnauze, Nase
    [161.6, -57.8], [158.4, -57, 1], [156.8, -55], [152, -52.6], [145, -50.6], [137, -50.2], [130, -51.4],              // Kinn, mächtige Wangen
    [125, -49], [121.4, -42], [117, -34], [110, -29],                                                                 // Kehle, Brust
    [96, -27.4], [80, -27], [64, -27.8], [48, -29.6], [34, -33], [24, -38], [18, -42.6],                               // Bauch
  ];
  const vbN = glied([[110, -52], [103, -32], [105.4, -18], [107.4, -10]], [[11, 11], [10, 8.8], [8.4, 7.8], [7.8, 7.8]], tatzeB(100, 124, 10));
  const hbN = glied([[34, -56], [44, -34], [39.6, -18], [37.4, -10]], [[15, 12.6], [11.6, 9.4], [8.6, 7.8], [8, 8]], tatzeB(30, 54, 9));
  const vbF = glied([[100, -52], [91.6, -32], [93.4, -18], [95.4, -10]], [[10, 10], [9.2, 8], [7.8, 7.2], [7.2, 7.2]], tatzeB(89, 111.6, 9.4));
  const hbF = glied([[46, -56], [56, -34], [52, -18], [50, -10]], [[13.6, 11.4], [10.6, 8.6], [8, 7.2], [7.4, 7.4]], tatzeB(43, 65, 8.6));

  const weissV = hoehenVerlauf(T, "weiss", -86, 0, [[-86, "#f8f5ee"], [-66, "#f0ebe0"], [-46, "#e4ddcd"], [-30, "#d2c9b5"], [0, "#c2b8a2"]]);
  const schwarzV = hoehenVerlauf(T, "schwarz", -86, 0, [[-86, "#3c3834"], [-56, "#26231f"], [-24, "#1b1917"], [0, "#121110"]]);
  const box = [0, -94, 168, 0];
  const wHaar = [["#fff", 1, 0.13, 0.6], ["#a8a090", 0.7, 0.12, 0.4]], sHaar = [["#000", 1, 0.13, 0.5], ["#7a746a", 0.8, 0.12, 0.45]];
  const glanz = "#9a948a";

  let s = "";
  /* fernes Ohr (etwas weiter vorn, halb hinter dem Kopf) */
  const ohrF = [[133.4, -83.6], [134.4, -89.4], [138.4, -92], [142.6, -90], [143, -84]];
  s += T.form(ohrF, "#161412") + fellKante(T, [[134.4, -89.2], [138.4, -91.8], [142.6, -89.8]], 16, 0.2, -1, "#2a2724", 0.12, 0.6);
  /* ferne Beine: schwarz, aber modelliert (Glanz vorn, Kernschatten hinten) */
  const fD = vereint(T, [vbF, hbF]);
  s += silhouette(T, fD, schwarzV, fellGrund(T, fD, "pF", "#000", "#8a847a", 95, box, 0.5) + fleck(T, "", 94, -26, 2.6, 14, glanz, 0.4) + fleck(T, "", 53, -26, 2.6, 12, glanz, 0.35) +
    fleck(T, "", 76, -40, 30, 10, "#000", 0.5) + haare(T, unten(vbF, -34), 30, 96, 1.6, sHaar, 10) + haare(T, unten(hbF, -34), 30, 98, 1.6, sHaar, 10), "#000", 0.6, 0.4);
  s += baerKrallen(111.2, -1.8, 3, 2.6, 1, "#4a443a", "#fff", 0.8, T.fein !== false) + baerKrallen(64.6, -1.6, 3, 2.4, 1, "#4a443a", "#fff", 0.8, T.fein !== false);
  /* Schwanz: kurz, weiß */
  s += T.form([[19, -58], [13.4, -57.4], [12, -53.4], [14.6, -50.6], [18.6, -51.6]], "#ece6d8") + fellKante(T, [[13.4, -57.4], [12, -53.4], [14.6, -50.8]], 10, -1, 0.5, "#fff", 0.12, 0.7);

  /* Körper + Kopf + nahe Beine */
  const kD = vereint(T, [rumpf, vbN, hbN]);
  let n = "";
  n += fellGrund(T, T.glatt(gleich(rumpf)), "pR", "#6a6252", "#fff", 160, box, 0.4);
  /* weiße Formen: Licht oben (Rücken, Kopf), Schatten unten (Bauch, unter den Wangen) */
  n += fleck(T, "", 56, -68, 26, 9, "#fff", 0.6) + fleck(T, "", 138, -76, 12, 6, "#fff", 0.5) + fleck(T, "", 70, -32, 34, 7, "#000", 0.2) + fleck(T, "", 140, -54, 12, 4, "#000", 0.25);
  /* schwarzes Schulterband: schräg über den Widerrist, unten in beide Vorderbeine und über die Brust */
  const band = [[86, -78], [101, -77.4], [112, -76], [118, -66], [122, -54], [123, -44], [118, -33], [110, -28], [100, -27.4], [97, -38], [92, -52], [86, -64], [83, -73]];
  const hinten = [[14, -46], [17, -56], [25, -62.6], [37, -63.6], [48, -58], [55, -47], [57, -36], [54, -28], [48, -20], [47, -10], [57, -4], [57, 1], [22, 1], [26, -10], [22, -22], [17, -34]];
  const vorn = unten(vbN, -40).concat([[96, -36]]);
  n += T.form(band, schwarzV) + T.form(hinten, schwarzV) + T.form(vorn, schwarzV);
  const schwarzD = vereint(T, [band, hinten, vorn]);
  n += fellGrund(T, schwarzD, "pS", "#000", "#8a847a", 100, box, 0.6);
  /* Plastik im Schwarz: Glanz auf Schulter, Vorderkante der Läufe, Keule; Kernschatten hinten */
  n += fleck(T, "", 104, -64, 8, 9, glanz, 0.4) + fleck(T, "", 109, -22, 2.6, 12, glanz, 0.4) + fleck(T, "", 36, -50, 10, 8, glanz, 0.35) + fleck(T, "", 40, -22, 2.6, 10, glanz, 0.3);
  n += fleck(T, "", 98, -30, 4, 12, "#000", 0.5) + fleck(T, "", 26, -24, 3, 12, "#000", 0.4) + fleck(T, "", 80, -1, 50, 4, "#000", 0.4);
  /* Haare: weiß auf weiß, schwarz auf schwarz */
  const wuchs = (x, y) => (x > 118 ? 160 : y > -34 ? 96 : x < 30 ? 110 + (x - 10) * 2 : 170 - (y + 70) * 0.5);
  const rumpfH = rumpf.filter((p) => p[0] < 120);
  n += straehnen(T, rumpfH, 130, wuchs, 4, 0.3, ["#8a8070", 0.22], ["#fff", 0.6], 14);
  n += haare(T, rumpfH, 150, wuchs, 2.6, wHaar, 12, 0.2);
  n += straehnen(T, band, 40, 112, 4, 0.3, ["#000", 0.35], ["#7a746a", 0.4], 14) + haare(T, band, 60, 108, 2.4, sHaar, 12);
  n += straehnen(T, hinten, 40, (x, y) => (y < -30 ? 118 : 96), 3.4, 0.3, ["#000", 0.35], ["#7a746a", 0.4], 14) + haare(T, vorn, 40, 96, 1.6, sHaar, 10) + haare(T, hinten, 40, (x, y) => (y < -30 ? 115 : 96), 1.8, sHaar, 10);
  /* Kopf: weiß, große Wangen; Augenfleck unregelmäßig, schräg zur Schnauze abfallend */
  const kopf = [[118, -72], [127, -81.6], [136, -84.4], [145, -82.8], [152, -78], [156.6, -72.4], [160, -67.6], [163.2, -64.6], [158, -58], [152, -53], [144, -51], [134, -51], [124, -52], [119, -60]];
  n += haare(T, kopf, 170, (x, y) => (x > 152 ? 192 : 165 + (y + 66) * 1.3), 1.3, wHaar, 14);
  n += fleck(T, "", 132, -60, 10, 7, "#fff", 0.35) + fleck(T, "", 156, -61, 5, 3, "#000", 0.15);
  const augenfleck = [[141, -73.4], [143.6, -77.4], [148, -78.6], [151.8, -76.6], [153.6, -72.4], [153.2, -67.6], [151, -63.6], [147.6, -62], [144.4, -63.6], [142, -67.6]];
  n += T.form(augenfleck, T.rg("augenfleck", [[0, "#1a1816"], [0.8, "#1f1d1a"], [1, "#2a2724", 0.85]], 0.55, 0.4, 0.6)) + haare(T, augenfleck, 34, 150, 0.9, sHaar, 20);
  n += fellKante(T, [[142, -67.6], [144.4, -63.6], [147.6, -62], [151, -63.6]], 14, -0.4, 0.9, "#1a1816", 0.1, 0.6);
  n += fleck(T, "", 149.2, -76.6, 1.4, 0.8, glanz, 0.4);
  n += zart(T, [[162.4, -58.4], [159.6, -57.9], [157, -57.7], [155.6, -57.5]], "#1a1614", 0.35, 0.8) + zart(T, [[163, -58.8], [163.2, -57]], "#1a1614", 0.3, 0.6);
  s += silhouette(T, kD, weissV, n, "#4a443c", 0.7, 0.3);

  /* Randhaare: Rücken, Bauch, Band/Beine (schwarz), Wangen */
  s += fellKante(T, [[24, -67.4], [38, -74.4], [58, -77.6], [80, -77.6]], 34, -2, -0.4, "#fff", 0.15, 0.7);
  s += fellKante(T, [[86, -77.8], [101, -77.2], [112, -75.8]], 18, -2, -0.6, "#2a2724", 0.15, 0.7);
  s += fellKante(T, [[96, -27.6], [80, -27], [64, -27.8], [48, -29.6]], 30, -1, 2.2, "#d9d1c0", 0.15, 0.7);
  s += fellKante(T, [[152, -52.6], [145, -50.6], [137, -50.2], [130, -51.4], [125, -49], [121.4, -42]], 30, -1.4, 1.8, "#ece6d8", 0.14, 0.75);
  s += fellKante(T, [[17, -56], [15, -50], [18, -43]], 10, -1.2, 0.8, "#1a1816", 0.14, 0.6);
  /* Tatzen: kräftige Krallen, Zehenwülste */
  s += baerKrallen(123.6, -2, 4, 3, 1.1, "#5a544a", "#fff", 1, T.fein !== false) + baerKrallen(53.6, -1.8, 4, 2.8, 1.1, "#5a544a", "#fff", 1, T.fein !== false);
  if (T.fein !== false) s += `<path d="M120 -5.4q-.8 2.4 -.3 5M116 -6.2q-.8 2.6 -.3 5.6M50.4 -4.8q-.8 2.2 -.3 4.6M46.6 -5.6q-.8 2.4 -.3 5.2" stroke="#000" stroke-width=".4" stroke-opacity=".6" fill="none"/>`;
  /* Nase */
  const nase = [[160.8, -66.4], [163.8, -64.6], [165.2, -61.6], [164.6, -59], [162.2, -58.6], [160.6, -61]];
  const naseS = T.form(nase, T.lg("nase", [[0, "#3e3631"], [0.5, "#171311"], [1, "#0a0807"]]));
  s += T.fein !== false && T.relief ? `<g filter="${T.relief("nase", { f: 3.4, tiefe: 0.2, okt: 1 })}">${naseS}</g>` : naseS;
  s += `<path d="M164.8 -60.2q-1 -.3 -1.6 .5q.5 .4 1.3 .3" fill="#000"/><ellipse cx="162.4" cy="-64.6" rx=".9" ry=".35" fill="#fff" opacity=".45"/>`;
  /* Auge: klein, dunkelbraun, SENKRECHTE Schlitzpupille, im oberen Teil des Flecks */
  s += T.augeReal ? T.augeReal(148.8, -73.4, 1, { iris: "#4a2e1a", iris2: "#1a0e06", offen: 0.72, winkel: -12, pupille: "schlitz", lid: "#000" }) : T.auge(148.8, -73.4, 1, "#4a2e1a", { pupille: "schlitz" });
  /* nahes Ohr: rund, schwarz, pelzig, mit Glanz */
  const ohr = [[123.6, -79.4], [123.6, -85.6], [127.4, -90.4], [132.6, -90.4], [135.6, -86.4], [135, -80.6]];
  s += T.koerper(ohr, T.lg("ohr", [[0, "#3a3632"], [1, "#121110"]]), { vol: false, rand: false, innen: fleck(T, "", 127, -87, 3, 2, glanz, 0.4) + haare(T, ohr, 50, -95, 1.4, sHaar, 40, 0.3) });
  s += fellKante(T, [[123.6, -80.4], [123.6, -85.6], [127.4, -90.4], [132.6, -90.4], [135.6, -86.4]], 30, 0, -1.1, "#1a1816", 0.12, 0.7);
  if (T.fein !== false) s += `<path d="M159.4 -59.4q3 -.2 5.6 .8M159 -60.2q3 -.8 5.8 -.6" stroke="#8a8070" stroke-width=".1" fill="none" opacity=".6"/>`;
  return { svg: s, box: [12, -91.6, 165.2, 0] };
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
  /* Gang mit hochgewölbtem Rücken: Hüfte am höchsten, Kopf tief. Nase rechts x≈90, Hüfte 35 cm */
  const rumpf = [
    [26, -22], [27.6, -28], [32, -32.6], [39, -35], [47, -34.8], [55, -32.4], [62, -28.8],               // hoch gewölbter Rücken
    [67, -26.6], [71.4, -26.6], [76, -25], [79, -21], [77, -16.6],                                       // Nacken (unter dem Kopf)
    [74.4, -16.4], [71.8, -14.6], [68.6, -13.2],                                                        // Kehle, Brust
    [63, -12.6], [56, -13], [49, -14.2], [42, -15.8], [36, -18], [30.6, -20.6],                           // Bauch
  ];
  const vbN = glied([[64, -18], [61, -11], [62.4, -5], [63.4, -2.6]], [[4.4, 4], [3.4, 2.8], [2.3, 2.3], [2, 2]], tatzeB(60.6, 70, 3));
  const hbN = glied([[37, -26], [43, -15], [38.2, -6.4], [37.2, -3]], [[7.4, 5.8], [5.4, 3.6], [3, 2.6], [2.5, 2.5]], tatzeB(34.2, 47.4, 3.6));
  const vbF = glied([[59, -18], [55.6, -11], [56.4, -5], [57, -2.6]], [[4, 3.6], [3.1, 2.6], [2.1, 2.1], [1.9, 1.9]], tatzeB(54.6, 63.2, 2.8));
  const hbF = glied([[43, -26], [49.6, -15], [45.6, -6.4], [44.6, -3]], [[6.8, 5.2], [4.9, 3.2], [2.8, 2.4], [2.3, 2.3]], tatzeB(41.6, 54, 3.4));

  const fell = hoehenVerlauf(T, "fell", -36, 0, [[-36, "#5c574f"], [-30, "#726c64"], [-23, "#8a837a"], [-16, "#a39b8e"], [-12, "#8a8276"], [-4, "#665e55"], [0, "#564e45"]]);
  const fellF = hoehenVerlauf(T, "fellF", -36, 0, [[-30, "#55504a"], [-14, "#5c554c"], [0, "#403a33"]]);
  const box = [-4, -38, 94, 0];
  const grau = [["#141210", 1.2, 0.07, 0.55], ["#efeae0", 0.9, 0.06, 0.55], ["#8a7a62", 0.4, 0.07, 0.45]];

  let s = "";
  /* fernes Ohr (klein, gerundet, halb verdeckt) */
  const ohrF = [[77.6, -27], [78.6, -30.2], [80.4, -31.4], [81.8, -29.6], [81.6, -26.8]];
  s += `<g transform="translate(-1.4 0.6) translate(79 -21) scale(1.16) translate(-79 21)">` + T.form(ohrF, "#3a3630") + fellKante(T, [[78.6, -30], [80.4, -31.2], [81.8, -29.4]], 8, 0.2, -0.5, "#e8e2d6", 0.05, 0.7) + `</g>`;
  /* ferne Beine (modelliert) */
  const fD = vereint(T, [vbF, hbF]);
  s += silhouette(T, fD, fellF, fellGrund(T, fD, "wF", "#000", "#b0a898", 95, box, 0.5) + fleck(T, "", 56, -8, 1.2, 5, "#fff", 0.25) + fleck(T, "", 46.6, -8, 1.2, 5, "#fff", 0.2) +
    fleck(T, "", 52, -14, 10, 3, "#000", 0.4) + haare(T, unten(vbF, -12), 26, 95, 0.6, grau, 10) + haare(T, unten(hbF, -14), 26, (x, y) => (y < -10 ? 120 : 96), 0.7, grau, 10), "#1a1814", 0.35, 0.4);
  s += fellKante(T, [[55, -0.8], [63, -0.8]], 12, 0.3, 0.6, "#b8b0a2", 0.05, 0.6) + fellKante(T, [[42, -0.8], [54, -0.8]], 14, 0.3, 0.6, "#b8b0a2", 0.05, 0.6);
  s += baerKrallen(63.2, -0.8, 3, 1, 0.4, "#2a2620", "#fff", 0.8, T.fein !== false) + baerKrallen(54, -0.8, 3, 1, 0.4, "#2a2620", "#fff", 0.8, T.fein !== false);

  /* buschiger Ringelschwanz: tief angesetzt, hängt nach hinten-unten; 5 dunkle Ringe + schwarze Spitze, weich behaart */
  const achse = [[30, -25.6], [24, -24.4], [18, -22], [12.6, -18.8], [8, -15], [4.6, -11]];
  const breite = [3.8, 4.4, 4.6, 4.4, 4, 2.6];
  const oben = [], unten2 = [];
  achse.forEach((p, i) => {
    const a2 = achse[Math.max(0, i - 1)], b2 = achse[Math.min(achse.length - 1, i + 1)];
    let dx = b2[0] - a2[0], dy = b2[1] - a2[1]; const l = Math.hypot(dx, dy); dx /= l; dy /= l;
    oben.push([p[0] + dy * breite[i], p[1] - dx * breite[i]]); unten2.push([p[0] - dy * breite[i], p[1] + dx * breite[i]]);
  });
  const schw = oben.concat([[2.6, -9]], unten2.slice().reverse());
  let ringe = "";
  for (let r = 0; r < 5; r++) {
    const t = 0.16 + r * 0.16, i = Math.min(achse.length - 2, Math.floor(t * (achse.length - 1))), f = t * (achse.length - 1) - i;
    const cx = achse[i][0] + (achse[i + 1][0] - achse[i][0]) * f, cy = achse[i][1] + (achse[i + 1][1] - achse[i][1]) * f;
    const ang = Math.atan2(achse[i + 1][1] - achse[i][1], achse[i + 1][0] - achse[i][0]) * 180 / Math.PI;
    ringe += `<ellipse cx="${R(cx)}" cy="${R(cy)}" rx="${R(1.5 + r * 0.08)}" ry="6.4" transform="rotate(${R(ang + 6)} ${R(cx)} ${R(cy)})" fill="#1c1916" opacity=".88"/>`;
  }
  ringe += T.form([[1.6, -10.4], [4.6, -14], [7.4, -12.4], [6, -8.6], [3.2, -7.6]], "#161412");
  s += silhouette(T, T.glatt(schw), T.lg("schw", [[0, "#b9b09c"], [0.5, "#a89e8a"], [1, "#6e665a"]]),
    ringe + fleck(T, "", 17, -24, 9, 2, "#fff", 0.3, 25) + fleck(T, "", 15, -17.6, 11, 2.4, "#000", 0.35, 30) +
    haare(T, schw, 150, (x, y) => 148 - (x - 10) * 0.8, 1.5, [["#000", 1, 0.07, 0.55], ["#f2ece0", 0.9, 0.06, 0.6]], 20, 0.3), "#1a1814", 0.35, 0.4);
  s += fellKante(T, oben, 30, -0.8, -0.5, "#7a7468", 0.06, 0.6) + fellKante(T, unten2, 26, -0.5, 0.9, "#3a3630", 0.06, 0.55);

  /* Körper + Kopf + nahe Beine */
  const kD = vereint(T, [rumpf, vbN, hbN]);
  let n = "";
  n += fellGrund(T, T.glatt(gleich(rumpf)), "wR", "#000", "#f0ebe2", 160, box, 0.7);
  n += fleck(T, "", 42, -30, 11, 4, "#fff", 0.4) + fleck(T, "", 52, -14, 14, 2.6, "#000", 0.35) + fleck(T, "", 60, -17, 3, 4, "#000", 0.3) + fleck(T, "", 38, -18, 4, 5, "#000", 0.25);
  n += fleck(T, "", 62.4, -6, 1, 4, "#fff", 0.3) + fleck(T, "", 39.4, -8, 1.4, 4, "#fff", 0.25) + fleck(T, "", 50, -0.4, 22, 1.4, "#000", 0.4);
  /* Pfoten oben hell behaart, Zehen dunkel */
  n += T.form([[58.6, -4.4], [60.8, -2.8], [70.6, -2.6], [70.6, 0.4], [58.6, 0.4]], T.lg("hand", [[0, "#c6bdac", 0], [0.45, "#c6bdac", 0.8], [1, "#8a8070"]])) + T.form([[33.4, -4.6], [36, -3.4], [48, -3.2], [48, 0.4], [33.4, 0.4]], T.lg("fuss", [[0, "#c6bdac", 0], [0.45, "#c6bdac", 0.8], [1, "#8a8070"]]));
  /* Fell: grau meliert, Strähnen + Grannen */
  const wuchs = (x, y) => (x > 70 ? 168 : y > -13 ? 96 : x < 36 ? 110 + (x - 26) * 3 : 172 - (y + 32) * 0.8);
  const rumpfH = rumpf.filter((p) => p[0] < 72);
  n += straehnen(T, rumpfH, 110, wuchs, 2.2, 0.16, ["#000", 0.3], ["#f4efe6", 0.4], 14);
  n += haare(T, rumpfH, 220, wuchs, 1.5, grau, 12, 0.2);
  n += haare(T, unten(vbN, -12), 30, 95, 0.6, grau, 10) + haare(T, unten(hbN, -16), 40, (x, y) => (y < -10 ? 118 : 96), 0.7, grau, 10);
  s += silhouette(T, kD, fell, n, "#1a1814", 0.4, 0.35);
  /* ---- Kopf als eigene Form (größer gesetzt, hinten weich in den Hals ausgeblendet) ---- */
  const kopfTr = `translate(-1.4 0.6) translate(79 -21) scale(1.16) translate(-79 21)`;
  const kopf = [[70.6, -24], [72.4, -26.4], [75, -27.6], [79, -27.2], [82.6, -25.2], [85.6, -23.2], [88.4, -21.4], [90.2, -19.8], [90, -18.6],
    [88.6, -18.2], [86.8, -17.8, 1], [85.6, -16.8], [82.4, -16.2], [79, -16.2], [76.4, -15.4], [73.6, -16.4], [71, -19]];
  n = fellGrund(T, T.glatt(kopf), "wK", "#000", "#f0ebe2", 175, box, 0.6) + haare(T, kopf, 60, 180, 0.9, grau, 14);
  /* Gesicht: Maske als Band durch das Auge zur Wange, weiße Braue, weiße Schnauze, dunkler Nasenrückenstrich */
  const schnauze = [[83.4, -20.8], [86, -21.6], [88.4, -21], [90, -19.6], [88.6, -18.2], [86.8, -17.8], [85.6, -16.8], [82.4, -16.2], [79, -16.2], [76.4, -15.4], [75.4, -17.6], [77.6, -19.6], [80.6, -20.6]];
  const braue = [[75.6, -25], [78.4, -26.6], [82, -26], [84.6, -23.8], [82.4, -24.4], [79, -25], [76.4, -24]];
  const maske = [[76.4, -24], [79, -25], [82.4, -24.4], [84.8, -23.2], [86.2, -21.6], [84.4, -20.8], [81, -20.6], [78, -19.8], [75.2, -20.6], [74.2, -22.4]];
  n += T.form(schnauze, T.rg("schn", [[0, "#f2ede4"], [0.8, "#e6dfd2"], [1, "#e6dfd2", 0.7]], 0.6, 0.4, 0.65)) + T.form(braue, T.rg("braue", [[0, "#f4efe6"], [0.8, "#ebe5da"], [1, "#ebe5da", 0.6]]));
  n += T.form(maske, T.rg("maske", [[0, "#141210"], [0.75, "#1c1916"], [1, "#2e2a26", 0.7]], 0.5, 0.45, 0.6));
  n += T.form([[84.4, -24.8], [86.6, -23], [89, -20.8], [88.4, -20.4], [85.8, -22.4], [83.8, -23.8]], "#2a2622", ' opacity=".75"');
  n += haare(T, maske, 40, 172, 0.6, [["#000", 1, 0.05, 0.5], ["#5a5650", 0.8, 0.05, 0.5]], 16) + haare(T, schnauze, 50, 192, 0.6, [["#fff", 1, 0.05, 0.6], ["#a49c8e", 0.6, 0.05, 0.4]], 14) + haare(T, braue, 20, 175, 0.6, [["#fff", 1, 0.05, 0.6]], 14);
  n += fellKante(T, [[74.2, -22.4], [75.2, -20.6], [78, -19.8], [81, -20.6]], 14, -0.4, 0.7, "#141210", 0.05, 0.6) + fellKante(T, [[76.4, -24], [79, -25], [82.4, -24.4]], 12, -0.3, -0.6, "#141210", 0.05, 0.5);
  n += zart(T, [[89.4, -18.6], [87.4, -18.2], [85.6, -17.9], [84.6, -17.5]], "#1a1614", 0.16, 0.8);
  let kopfSvg = `<g mask="${ausblenden(T, "wkopf", 71, 74.6, [64, -36, 94, -10])}">` + silhouette(T, T.glatt(kopf), fell, n, "#1a1814", 0.4, 0.35) + `</g>`;

  /* Randhaare: Buckel, Wangenbart (hell), Bauch */
  s += fellKante(T, [[30.6, -20.6], [27, -23], [26.4, -26.6], [28, -30]], 22, -1.3, 0.3, "#6a645a", 0.07, 0.7);
  s += fellKante(T, [[27.6, -28], [32, -32.6], [39, -35], [47, -34.8], [55, -32.4], [62, -28.8], [67, -26.6]], 50, -1.2, -0.4, "#4a453e", 0.07, 0.6);
  kopfSvg += fellKante(T, [[76.4, -19.4], [75.6, -17.4], [74.4, -16.2]], 14, -1.1, 0.6, "#ece6da", 0.06, 0.8) + fellKante(T, [[72.6, -25.4], [71.4, -22.4], [72, -19], [74, -16.6]], 20, -1, 0.5, "#6a645a", 0.06, 0.7);
  s += fellKante(T, [[68.6, -13.2], [63, -12.6], [56, -13], [49, -14.2], [42, -15.8]], 30, -0.6, 1, "#b8b0a2", 0.06, 0.7);
  s += fellKante(T, [[60, -0.8], [70, -0.8]], 14, 0.3, 0.6, "#d6cec0", 0.05, 0.6) + fellKante(T, [[34, -0.8], [47, -0.8]], 16, 0.3, 0.6, "#d6cec0", 0.05, 0.6);
  s += baerKrallen(70, -0.8, 3, 1.2, 0.5, "#2a2620", "#fff", 1, T.fein !== false) + baerKrallen(47.4, -0.8, 3, 1.2, 0.5, "#2a2620", "#fff", 1, T.fein !== false);
  if (T.fein !== false) s += `<path d="M68.2 -2.4q-.4 1 -.1 2.2M66.4 -2.6q-.4 1.1 -.1 2.4M46 -2.8q-.4 1.2 -.1 2.6M44 -3q-.4 1.2 -.1 2.8" stroke="#4a443c" stroke-width=".15" stroke-opacity=".7" fill="none"/>`;
  /* Nase */
  const nase = [[88.2, -21.2], [89.8, -20.2], [90.6, -19], [90.2, -18.2], [89, -18.2], [88.2, -19.4]];
  kopfSvg += T.form(nase, T.lg("nase", [[0, "#3e3631"], [0.5, "#171311"], [1, "#0a0807"]])) + `<ellipse cx="89.3" cy="-20.3" rx=".45" ry=".18" fill="#fff" opacity=".5"/>`;
  /* Auge: dunkel, glänzend, mitten in der Maske */
  kopfSvg += T.augeReal ? T.augeReal(81.2, -22.6, 0.62, { iris: "#2a1a10", iris2: "#0e0805", offen: 0.8, winkel: -8, lid: "#000" }) : T.auge(81.2, -22.6, 0.62, "#2a1a10");
  /* nahes Ohr: klein, gerundet, grau mit weißem Rand und hellem Innenhaar */
  const ohr = [[72.4, -26.4], [73, -29.6], [74.8, -31.6], [76.8, -30.6], [77.6, -27.8], [77, -26.2]];
  kopfSvg += T.koerper(ohr, T.lg("ohr", [[0, "#2a2622"], [1, "#6a645a"]]), { vol: false, rand: false,
    innen: T.form([[73.8, -26.8], [74.2, -29.2], [75.2, -30.2], [76.2, -29], [76.4, -26.8]], "#cfc7b8", ' opacity=".75"') + haare(T, ohr, 16, -95, 0.8, [["#fff", 1, 0.05, 0.7]], 30) });
  kopfSvg += fellKante(T, [[72.6, -26.8], [73, -29.6], [74.8, -31.6], [76.8, -30.6], [77.6, -27.8]], 20, 0, -0.55, "#f4efe6", 0.05, 0.85);
  kopfSvg += T.schnurrhaare ? T.schnurrhaare(87, -19, 6, 4.4, 10, 34, "#e8e2d6", 0.05) : "";
  s += `<g transform="${kopfTr}">${kopfSvg}</g>`;
  /* Kopf rechts: 79 + (90.6 − 79) · 1,16 − 1,4 ≈ 91 */
  return { svg: s, box: [1.6, -35.2, 91.1, 0] };
}

module.exports = [
  { id: "wolf", de: "der Wolf", syl: "WOLF", it: "il lupo", itSyl: "LU-po", en: "wolf",
    gruppe: "Raubtiere", lebensraum: "Wald", laenge: 1.49, hoehe: 1.03, zeichne: wolf },
  { id: "fuchs", de: "der Fuchs", syl: "FUCHS", it: "la volpe", itSyl: "VOL-pe", en: "fox",
    gruppe: "Raubtiere", lebensraum: "Wald", laenge: 1.06, hoehe: 0.57, zeichne: fuchs },
  { id: "braunbaer", de: "der Braunbär", syl: "BRAUN-bär", it: "l'orso bruno", itSyl: "OR-so BRU-no", en: "brown bear",
    gruppe: "Raubtiere", lebensraum: "Wald", laenge: 2.07, hoehe: 1.13, zeichne: braunbaer },
  { id: "eisbaer", de: "der Eisbär", syl: "EIS-bär", it: "l'orso polare", itSyl: "OR-so po-LA-re", en: "polar bear",
    gruppe: "Raubtiere", lebensraum: "Arktis", laenge: 2.21, hoehe: 1.12, zeichne: eisbaer },
  { id: "panda", de: "der Panda", syl: "PAN-da", it: "il panda", itSyl: "PAN-da", en: "panda",
    gruppe: "Raubtiere", lebensraum: "Bambuswald", laenge: 1.53, hoehe: 0.92, zeichne: panda },
  { id: "waschbaer", de: "der Waschbär", syl: "WASCH-bär", it: "il procione", itSyl: "pro-CIO-ne", en: "raccoon",
    gruppe: "Raubtiere", lebensraum: "Wald", laenge: 0.89, hoehe: 0.35, zeichne: waschbaer },
];
