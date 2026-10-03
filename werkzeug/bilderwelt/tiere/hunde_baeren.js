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
const pfoteHund = (x, L = 10, H = 4.5) => [[x - L * 0.26, -H * 0.55], [x - L * 0.2, 0, 1], [x + L * 0.56, 0, 1], [x + L * 0.71, -H * 0.3], [x + L * 0.63, -H * 0.7], [x + L * 0.43, -H * 0.92], [x + L * 0.22, -H * 1.04]];
/* Querlicht für Läufe/Schwanz: links hell, rechts dunkel (Licht von links), als Überzug derselben Form */
const querLicht = (T, pts, st = 1) => T.form(pts, T.lg("ql" + String(st).replace(".", ""), [[0, "#fff", 0.22 * st], [0.4, "#fff", 0], [0.75, "#000", 0.1 * st], [1, "#000", 0.3 * st]], 0, 0, 1, 0));
/* Bärentatze (Sohlengänger): lange flache Sohle, vorne Krallen extra */
const tatze = (x, L, H) => [[x - L * 0.42, -H * 0.5], [x - L * 0.4, 0, 1], [x + L * 0.5, 0, 1], [x + L * 0.6, -H * 0.45], [x + L * 0.42, -H * 0.95]];
/* Pfad aus mehreren Teilen (alle gleich herum) */
const vereint = (T, teile) => teile.map((p) => T.glatt(gleich(p))).join("");
/* weicher Fleck (Radialverlauf, keine harte Kante); ein Verlauf je Farbe+Stärke */
const fleck = (T, n, cx, cy, rx, ry, farbe, op, dreh = 0) =>
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
  const ziel = Math.round(n * (T.fein === false ? 0.2 : 1)), eimer = farben.map(() => ""), sum = farben.reduce((q, f) => q + f[1], 0);
  for (let got = 0, v = 0; got < ziel && v < ziel * 12; v++) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!inPoly(x, y, pts)) continue;
    const a = (wf(x, y) + (T.rnd() - 0.5) * streu) * Math.PI / 180, L = len * (0.55 + T.rnd() * 0.9);
    const ex = Math.cos(a) * L, ey = Math.sin(a) * L, k = krumm * L * (T.rnd() - 0.5) * 2;
    let u = T.rnd() * sum, i = 0;
    while (i < farben.length - 1 && u > farben[i][1]) { u -= farben[i][1]; i++; }
    eimer[i] += L < 1.6 ? `M${Z(x)} ${Z(y)}l${Z(ex)} ${Z(ey)}` : `M${Z(x)} ${Z(y)}q${Z(ex / 2 - Math.sin(a) * k)} ${Z(ey / 2 + Math.cos(a) * k)} ${Z(ex)} ${Z(ey)}`;
    got++;
  }
  return eimer.map((d, i) => (d ? `<path d="${d}" fill="none" stroke="${farben[i][0]}" stroke-width="${farben[i][2]}" stroke-opacity="${farben[i][3]}" stroke-linecap="round"/>` : "")).join("");
}
/* Randhaare entlang einer Kurve (Ansatz innen, Spitze nach außen in Wuchsrichtung): bricht die glatte Vektorkante */
function fellKante(T, pts, n, dx, dy, farbe, w, op) {
  let d = "";
  const z = Math.round(n * (T.fein === false ? 0.25 : 1));
  for (let i = 0; i < z; i++) {
    const t = (i + T.rnd() * 0.8) / z * (pts.length - 1), k = Math.min(pts.length - 2, Math.floor(t)), f = t - k;
    const x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f, s = 0.6 + T.rnd() * 0.8, b = (T.rnd() - 0.5) * 0.6;
    d += `M${Z(x)} ${Z(y)}q${Z(dx * s * 0.5 + dy * b)} ${Z(dy * s * 0.5 - dx * b)} ${Z(dx * s)} ${Z(dy * s)}`;
  }
  return `<path d="${d}" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" fill="none" stroke-linecap="round"/>`;
}
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
  const fell = hoehenVerlauf(T, "fell", -96, 0, [[-96, "#6c655d"], [-82, "#857c70"], [-68, "#a0927c"], [-56, "#bfa784"], [-45, "#e2d6bd"], [-36, "#d6b98c"], [-14, "#c49d69"], [0, "#a17e56"]]);
  const fellF = hoehenVerlauf(T, "fellF", -96, 0, [[-90, "#5e574e"], [-60, "#7b6e5d"], [-42, "#8d785d"], [-12, "#7c6447"], [0, "#5c4935"]]);
  const sattel = hoehenVerlauf(T, "sattel", -95, -56, [[-95, "#1a1713", 0.92], [-85, "#26211c", 0.74], [-73, "#38312a", 0.4], [-57, "#38312a", 0]]);
  const box = [20, -106, 172, 0];
  const grau = [["#1b1713", 1.2, 0.16, 0.55], ["#f1e9da", 0.8, 0.14, 0.55], ["#a3845d", 0.5, 0.15, 0.5], ["#4d453b", 0.7, 0.2, 0.4]];
  const lauf = [["#6b4f30", 1, 0.14, 0.45], ["#f4e7cc", 0.9, 0.13, 0.5]];

  let s = "";
  /* ---- fernes Ohr (hinter dem Kopf, nur die Spitze ragt vor) ---- */
  const ohrF = [[141.4, -90.6], [144.6, -100.6], [146.6, -101.2], [148.8, -91.4]];
  s += T.form(ohrF, T.lg("ohrF", [[0, "#2c2621"], [1, "#6a5d4d"]])) + fellKante(T, [[146.6, -101], [148.6, -92]], 10, 1, 0.3, "#3a322a", 0.13, 0.6);
  /* ---- ferne Beine (im Schatten) ---- */
  s += silhouette(T, vereint(T, [vbF, hbF]), fellF,
    fleck(T, "", 80, -45, 44, 11, "#1a140e", 0.5) + fleck(T, "", 97.4, -24, 2, 14, "#fff", 0.2) + fleck(T, "", 101, -24, 1.6, 14, "#000", 0.2) +
    fleck(T, "", 55.4, -24, 2, 10, "#fff", 0.2) + haare(T, vbF, 60, 93, 1.8, lauf, 10) + haare(T, hbF, 70, (x, y) => (y < -40 ? 125 : 95), 2, lauf, 10), "#1c1712", 0.7, 0.35);
  s += krallen(102.6, -1.4, 2, 1.5, 1.5, "#15110d", 0.5) + krallen(61.4, -1.4, 2, 1.5, 1.5, "#15110d", 0.5);

  /* ---- Schwanz: hängt gerade herab bis zum Sprunggelenk, buschig, dunkle Spitze, Violdrüse oben ---- */
  const schwanz = [[44, -73.5], [37, -72.4], [30.2, -66.4], [25.6, -56.6], [23.2, -46], [22.8, -36], [24, -29], [26.8, -23.6], [29.4, -21.2, 1],
    [31.4, -25.4], [33.4, -31], [35.8, -39], [38, -48], [41, -58.6], [45, -66]];
  s += silhouette(T, T.glatt(schwanz), T.lg("schw", [[0, "#776d61"], [0.36, "#968a77"], [0.7, "#6a6155"], [0.86, "#2c2722"], [1, "#1b1815"]]),
    fleck(T, "", 28, -50, 4, 20, "#fff", 0.2, 6) + fleck(T, "", 38, -50, 4, 18, "#000", 0.2, 8) + fleck(T, "", 33.4, -67.4, 4.4, 3.2, "#1a1612", 0.5) +
    haare(T, schwanz, 260, (x, y) => 97 - (y + 50) * 0.5, 3.4, [["#211d19", 1.2, 0.17, 0.5], ["#f3eadb", 0.7, 0.15, 0.5], ["#8f7d63", 0.6, 0.18, 0.45]], 14, 0.3), "#1c1712", 0.7, 0.35);
  s += fellKante(T, [[31, -67], [26, -57], [23.4, -46], [23, -35], [24.4, -28], [27.4, -23]], 34, -1.4, 2.2, "#3d372f", 0.16, 0.6);
  s += fellKante(T, [[36, -40], [34, -32], [31.6, -25.6]], 10, 1, 2, "#2a2520", 0.15, 0.55);

  /* ---- Körper + Kopf + nahe Beine als EINE Silhouette ---- */
  const kD = vereint(T, [rumpf, vbN, hbN]);
  let n = "";
  /* Sattel: dunkle Decke über Schultern und Rücken (Grannenspitzen), endet vor der Kruppe; Nacken/Mähne mit */
  n += T.form([[50, -81], [70, -81], [94, -83], [114, -87], [128, -92], [138, -95], [139, -84], [134, -73], [125, -63], [112, -59], [94, -61], [74, -63], [57, -67]], sattel);
  n += struktur(T, kD, "wolf", "#14110e", 85, 0.18, box, 1.6, 0.16);
  /* Licht von links oben, Schatten unten (weiche Flecken) – Rippenbogen, Schulter, Keule */
  n += fleck(T, "", 55, -69, 18, 11, "#fff", 0.3) + fleck(T, "", 117, -71, 9, 12, "#fff", 0.2) + fleck(T, "", 88, -68, 22, 8, "#fff", 0.15);
  n += fleck(T, "", 88, -42.5, 32, 7, "#2e2115", 0.5) + fleck(T, "", 101.4, -56, 3.6, 11, "#2b2016", 0.4, 10) + fleck(T, "", 132, -57, 7, 5, "#2b2016", 0.3, -40);
  n += fleck(T, "", 66.5, -53, 5, 9, "#2b2016", 0.4, -30) + fleck(T, "", 36, -40, 4, 16, "#2b2016", 0.3, 15) + fleck(T, "", 146, -68, 7, 3, "#2b2016", 0.3);
  /* Läufe: links Licht, rechts Schatten; dunkler Strich vorn am Vorderlauf (typisch Grauwolf) */
  n += fleck(T, "", 108.2, -24, 1.8, 14, "#fff", 0.3) + fleck(T, "", 113, -24, 1.6, 14, "#000", 0.2) + fleck(T, "", 113.2, -21, 0.9, 7, "#2a1d10", 0.5);
  n += fleck(T, "", 38.4, -14, 1.6, 9, "#fff", 0.2) + fleck(T, "", 43.6, -14, 1.4, 9, "#000", 0.2) + fleck(T, "", 51.2, -37, 3, 7, "#fff", 0.2, 30);
  n += fleck(T, "", 76, -1, 56, 4, "#2b2016", 0.4);
  /* Muskeln/Sehnen: Schulterblattkante, Trizeps, Kniefalte, Achillessehne, Beugesehne am Vorderlauf */
  n += zart(T, [[113, -79], [118.6, -68], [120.6, -58]], "#2b2219", 0.5, 0.22) + zart(T, [[104, -60], [102.6, -52], [103.6, -46]], "#2b2219", 0.5, 0.2);
  n += zart(T, [[65, -69], [66, -59], [62.4, -50]], "#2b2219", 0.6, 0.22) + zart(T, [[44, -31], [38.8, -23.6]], "#2b2219", 0.45, 0.32) + zart(T, [[106, -33], [106.8, -19]], "#2b2219", 0.4, 0.22);
  /* Haare in Lagen: Unterwolle (kurz, weich), Grannen (dunkel/hell gebändert), Läufe kurz */
  const wuchs = (x, y) => (x > 120 ? 150 - (y + 90) : y > -40 ? 93 : x < 62 ? 118 + (x - 40) * 0.6 : 175 - (y + 80) * 0.5);
  const rumpfH = rumpf.filter((p) => p[0] < 140);
  n += haare(T, rumpfH, 280, wuchs, 2, [["#5a5046", 1, 0.22, 0.28], ["#d9c9ab", 0.6, 0.2, 0.28]], 22, 0.3);
  n += haare(T, rumpfH, 640, wuchs, 3, grau, 14, 0.22);
  n += haare(T, vbN, 110, 93, 1.5, lauf, 8) + haare(T, hbN, 140, (x, y) => (y < -40 ? 122 : 94), 1.8, lauf, 10);
  /* Kopf: Stirn dunkler, Zimt auf Nasenrücken und hinter dem Auge, helle Lippen/Wangen/Kehle, Hals seitlich grau */
  const maske = [[146, -76], [152, -78.6], [158, -79.4], [164.6, -77.4], [169.6, -73.4], [167.4, -70.4], [162.6, -67.6], [156, -66.6], [149, -66.4], [143, -65], [137, -60], [131, -53], [128, -48], [132, -60], [139, -70]];
  const kopfOben = [[136, -92], [144, -93], [149.4, -91.4], [156, -86], [161, -83], [168.6, -79.6], [163, -79.8], [156, -82.6], [148, -82.4], [138, -83]];
  n += T.form([[136, -92], [149, -91.4], [156.2, -85.6], [150, -84.6], [138, -84]], T.lg("stirn", [[0, "#26201b", 0.6], [1, "#26201b", 0]]));
  n += T.form([[155.6, -84.6], [161, -82], [166.2, -80], [168.6, -78.8], [162, -79], [155.6, -81.4]], "#a07a49", ' opacity=".55"');
  n += fleck(T, "", 143, -82, 5, 3, "#a07a49", 0.4);
  n += T.form(maske, T.lg("maske", [[0, "#f7f1e4", 0], [0.3, "#f7f1e4", 0.9], [1, "#ece0c7", 0.92]]));
  n += fleck(T, "", 149, -87.8, 2.6, 1.3, "#f3ead6", 0.9) + fleck(T, "", 135, -64, 6, 9, "#4d453b", 0.4, 20) + fleck(T, "", 151.6, -78, 3, 1.4, "#3a2e22", 0.3, -20);
  n += haare(T, maske, 140, (x, y) => (x > 153 ? 186 : 165 - (y + 70) * 1.2), 1.2, [["#bfae8e", 1, 0.12, 0.55], ["#fff", 0.8, 0.12, 0.6]], 12);
  n += haare(T, kopfOben, 130, (x, y) => (x > 155 ? 192 : 180), 1, [["#231e1a", 1, 0.12, 0.5], ["#e9dcc4", 0.7, 0.11, 0.5], ["#9b7a52", 0.4, 0.12, 0.45]], 12);
  n += zart(T, [[153.4, -83.4], [155.4, -81], [157, -79]], "#2a2118", 0.35, 0.45);
  /* Lefze: schwarzer Lippenrand, fast gerade, leicht fallend, kleiner Mundwinkel (kein Grinsen) */
  n += zart(T, [[167.4, -70.9], [163, -70], [158, -69.3], [153.6, -69.2], [151.4, -69.7]], "#16100c", 0.6, 0.9);
  n += zart(T, [[151.4, -69.7], [150.4, -70.6]], "#16100c", 0.4, 0.6) + zart(T, [[164, -68.6], [158, -67.9]], "#fff", 0.3, 0.3);
  s += silhouette(T, kD, fell, n, "#2a2018", 0.7, 0.35);

  /* Wangenkrause: helle Fellbüschel hinter dem Kieferwinkel, über Kehle und Hals */
  const krause = [[150, -74], [148.2, -67.6], [145.6, -63.4, 1], [144.2, -65.4], [141.8, -60.6, 1], [140.2, -63], [137, -57.8, 1], [136, -62], [134.6, -69], [138.6, -76], [144, -78]];
  s += T.koerper(krause, T.lg("krause", [[0, "#efe5d2", 0], [0.35, "#efe5d2", 0.85], [1, "#e2d4b9", 0.95]]),
    { vol: false, rand: false, innen: haare(T, krause, 90, (x, y) => 120 - (x - 140) * 2, 2, [["#fff", 1, 0.12, 0.6], ["#b9a582", 0.8, 0.13, 0.5]], 14, 0.3) });
  /* Randhaare: Rückenlinie, Mähne, Halskrause, Bauchfransen, „Hosen“ hinten an der Keule */
  s += fellKante(T, [[46, -77.4], [62, -78], [78, -77.2], [96, -79.3], [111, -82.8]], 50, -1.8, -0.35, "#3a342d", 0.16, 0.55);
  s += fellKante(T, [[111, -82.8], [121, -86.2], [130, -89.2], [136, -91]], 32, -2.4, -1, "#25211c", 0.17, 0.6);
  s += fellKante(T, [[141, -63.4], [135, -58.8], [129.6, -52.6], [125.2, -46.6], [121, -42.4]], 40, -1.6, 2.4, "#efe4cf", 0.16, 0.8);
  s += fellKante(T, [[119, -41.4], [107, -40.2], [96, -42], [86, -45.6], [76, -51], [68, -54.8]], 55, -1.2, 2.2, "#f3ead8", 0.15, 0.75);
  s += fellKante(T, [[34.6, -66], [33, -56], [33.6, -46], [35.6, -38]], 28, -1.6, 1.6, "#ece0c6", 0.15, 0.6);
  s += fellKante(T, [[36, -28], [35.4, -20], [36.6, -12]], 8, -0.9, 0.9, "#5a4630", 0.13, 0.5);

  /* Pfoten: Zehenwülste, Krallen; Afterkralle hinten fehlt */
  s += `<path d="M118.5 -4.5q.8 1.6 .5 3.6M116.1 -5q.6 2 .3 4.2M45.6 -4.4q.8 1.6 .5 3.4M43.3 -4.8q.6 2 .3 4" stroke="#3b2a18" stroke-width=".35" stroke-opacity=".55" fill="none"/>`;
  s += krallen(119.2, -1.2, 2, 1.7, 1.6, "#1a140f", 0.6) + krallen(47.2, -1.1, 2, 1.7, 1.5, "#1a140f", 0.6);
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
    { innen: T.form(ohrI, T.lg("ohrI", [[0, "#cbb999"], [1, "#4a3d30"]])) + haare(T, ohrI, 45, -95, 1.8, [["#f4ead6", 1, 0.12, 0.8]], 30) +
      haare(T, ohr, 45, -80, 1.2, [["#2a241e", 1, 0.12, 0.45], ["#c9b08a", 0.6, 0.12, 0.5]], 14), randA: 0.3, rw: 0.45 });
  s += fellKante(T, [[136.8, -90.4], [136.2, -96]], 8, -1.2, -0.5, "#3a332b", 0.13, 0.6) + fellKante(T, [[141.6, -103], [144.6, -94]], 8, 1, -0.4, "#3a332b", 0.12, 0.5);
  /* Tasthaare (dunkel, spärlich) */
  s += T.schnurrhaare ? T.schnurrhaare(164.4, -72, 6, 6.5, 12, 26, "#231c16", 0.11) : "";
  return { svg: s, box: [21.4, -103.4, 170.6, 0] };
}

module.exports = [
  { id: "wolf", de: "der Wolf", syl: "WOLF", it: "il lupo", itSyl: "LU-po", en: "wolf",
    gruppe: "Raubtiere", lebensraum: "Wald", laenge: 1.49, hoehe: 1.03, zeichne: wolf },
];
