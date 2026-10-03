/* =====================================================================
   TIER-BIBLIOTHEK — HOF-SÄUGETIERE (FASSUNG 854)
   Kuh, Kalb, Pferd, Esel, Schwein, Schaf, Ziege – Seitenansicht, Blick
   nach rechts, Zentimeter, Boden y = 0, Licht von links oben.
   ===================================================================== */
"use strict";

/* ---------- Helfer ---------- */
const rad = (g) => (g * Math.PI) / 180;
/* Zahl kurz schreiben (q = Raster in cm; große Tiere brauchen keine Zehntel) */
const z = (v, q) => { const n = Math.round(v / q) * q; return String(Math.round(n * 10) / 10); };
/* glatte Kurve (Catmull-Rom) wie T.glatt, aber mit grobem Raster → halb so viele Bytes */
function gl(pts, zu = true, q = 1) {
  const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const k = (x, y) => z(x, q) + " " + z(y, q);
  let d = "M" + k(pts[0][0], pts[0][1]);
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    if (p1[2] && p2[2]) { d += "L" + k(p2[0], p2[1]); continue; }
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += "C" + k(c1[0], c1[1]) + " " + k(c2[0], c2[1]) + " " + k(p2[0], p2[1]);
  }
  return d + (zu ? "Z" : "");
}
/* Körperteil: EIN Pfad (Füllung + Rand); die Innenzeichnung wird über <use> auf
   denselben Pfad geklippt (kein zweiter, dritter Pfad wie bei T.koerper). */
function teil(T, pts, fill, innen = "", o = {}) {
  const d = typeof pts === "string" ? pts : gl(pts, true, o.q || 1);
  const id = T.id("t" + (T._n = (T._n || 0) + 1));
  const rand = o.rand === false ? "" : ` stroke="${o.rc || "#000"}" stroke-opacity="${o.ra != null ? o.ra : 0.32}" stroke-width="${o.rw || 1.3}" stroke-linejoin="round"`;
  let s = `<path id="${id}" d="${d}" fill="${fill}"${rand}/>`;
  if (innen) { T.def(`<clipPath id="${id}c"><use href="#${id}"/></clipPath>`); s += `<g clip-path="url(#${id}c)">${innen}</g>`; }
  return s;
}
const form = (pts, fill, extra = "", q = 1) => `<path d="${typeof pts === "string" ? pts : gl(pts, true, q)}" fill="${fill}"${extra}/>`;
/* feine Linie (Falte, Muskelkante) */
const strich = (pts, farbe, w, op, q = 1) =>
  `<path d="${gl(pts, false, q)}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round"/>`;
/* Haar für Haar (wie T.haare aus kern.js, aber auf 1 mm gerundet → ein Viertel kleiner):
   n Haare in der Fläche pts, Wuchsrichtung winkel (Grad oder Funktion (x, y)), Länge laenge (cm).
   o: { farben: [[farbe, anteil, breite, deckkraft]], streuung, kruemmung, szene (Anteil bei T.fein = false, 0,25) } */
function haar(T, pts, n, winkel, laenge, o = {}) {
  const [x0, y0, x1, y1] = T.box(pts);
  const farben = o.farben || [["#000", 1, laenge * 0.06, 0.35]];
  const summe = farben.reduce((s, f) => s + f[1], 0);
  const eimer = farben.map(() => "");
  const wf = typeof winkel === "function" ? winkel : () => winkel;
  const ziel = Math.round(n * (T.fein ? 1 : (o.szene != null ? o.szene : 0.25)));
  const k = (v) => z(v, 0.1);
  let versuche = 0, gemacht = 0;
  while (gemacht < ziel && versuche < ziel * 12) {
    versuche++;
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!T.inPoly(x, y, pts)) continue;
    const a = (wf(x, y) + (T.rnd() - 0.5) * (o.streuung != null ? o.streuung : 14)) * Math.PI / 180;
    const L = laenge * (0.55 + T.rnd() * 0.9);
    const ex = x + Math.cos(a) * L, ey = y + Math.sin(a) * L;
    const kr = (o.kruemmung != null ? o.kruemmung : 0.15) * L * (T.rnd() - 0.5) * 2;
    const cx = (x + ex) / 2 - Math.sin(a) * kr, cy = (y + ey) / 2 + Math.cos(a) * kr;
    let u = T.rnd() * summe, i = 0;
    while (i < farben.length - 1 && u > farben[i][1]) { u -= farben[i][1]; i++; }
    eimer[i] += "M" + k(x) + " " + k(y) + "Q" + k(cx) + " " + k(cy) + " " + k(ex) + " " + k(ey);
    gemacht++;
  }
  return eimer.map((d, i) => d ? `<path d="${d}" fill="none" stroke="${farben[i][0]}" stroke-width="${farben[i][2]}" stroke-opacity="${farben[i][3]}" stroke-linecap="round"/>` : "").join("");
}
/* nur in voller Feinheit */
const fein = (T, svg) => (T.fein ? svg : "");
/* Punkte aus einem eigenen Koordinatensystem (Kopf: x entlang Stirn–Nase, y zur Unterseite)
   drehen und verschieben. Harte Ecken ([x, y, 1]) bleiben. */
function dreh(pts, ox, oy, g, s = 1) {
  const c = Math.cos(rad(g)), si = Math.sin(rad(g));
  return pts.map((p) => {
    const q = [ox + (p[0] * c - p[1] * si) * s, oy + (p[0] * si + p[1] * c) * s];
    if (p[2]) q.push(1);
    return q;
  });
}
/* Bein aus einer Mittellinie: [x, y, vorn, hinten, ecke] – Breiten waagerecht gemessen. */
function glied(sp) {
  const vorn = sp.map((p) => [p[0] + p[2], p[1]].concat(p[4] ? [1] : []));
  const hint = sp.slice().reverse().map((p) => [p[0] - p[3], p[1]].concat(p[4] ? [1] : []));
  return vorn.concat(hint);
}
/* weiche Licht- und Schattenflecken (radialer Verlauf). licht = weiß, glanz = warm (Fellglanz), schatten = schwarz */
function flecken(T, glanzFarbe = "#ffe2b8") {
  const hell = T.rg("hell", [[0, "#fff", 0.5], [1, "#fff", 0]]);
  const warm = T.rg("warm", [[0, glanzFarbe, 0.6], [0.5, glanzFarbe, 0.25], [1, glanzFarbe, 0]]);
  const dunkel = T.rg("dunkel", [[0, "#000", 0.5], [1, "#000", 0]]);
  const f = (fill) => (x, y, rx, ry, op = 1, g = 0) =>
    `<ellipse cx="${z(x, 0.5)}" cy="${z(y, 0.5)}" rx="${z(rx, 0.5)}" ry="${z(ry, 0.5)}" fill="${fill}"${op !== 1 ? ` opacity="${op}"` : ""}${g ? ` transform="rotate(${Math.round(g)} ${z(x, 0.5)} ${z(y, 0.5)})"` : ""}/>`;
  return { licht: f(hell), glanz: f(warm), schatten: f(dunkel) };
}
/* Wuchsrichtung: Winkel (Grad) über x verteilt – stuetzen [[x, winkel], …] aufsteigend nach x; dazu optional y-Einfluss */
function richtung(stuetzen, yEinfluss = null) {
  return (x, y) => {
    let w = stuetzen[0][1];
    for (let i = 0; i < stuetzen.length - 1; i++) {
      const [xa, wa] = stuetzen[i], [xb, wb] = stuetzen[i + 1];
      if (x >= xa && x <= xb) { w = wa + (wb - wa) * (x - xa) / (xb - xa); break; }
      if (x > xb) w = wb;
    }
    return w + (yEinfluss ? yEinfluss(x, y) : 0);
  };
}
/* feine Fellstruktur (Rauschen in Wuchsrichtung) – nur in voller Feinheit (Filter kosten in Szenen Zeit) */
function struktur(T, d, name, farbe, winkel, deck, box, fx = 0.9, fy = 0.1) {
  if (!T.fein) return "";
  return T.textur(d, T.rauschen(name, { fx, fy, farbe, staerke: 2.6, okt: 3 }), winkel - 90, deck, box);
}
/* Einhufer-Huf: Zehe vorn, Wand ~ Fesselwinkel, Sohle auf y = 0; Kronrand, Hornringe, Glanz. x = Hufmitte */
function huf(T, x, b, h, farbe) {
  const p = [[x - b * 0.45, -h * 0.62, 1], [x - b * 0.1, -h * 0.9], [x + b * 0.2, -h, 1], [x + b * 0.6, 0, 1], [x - b * 0.5, 0, 1]];
  const ringe = [0.3, 0.52, 0.74].map((t) => strich([[x - b * 0.47 + t * 0.12 * b, -h * 0.62 * (1 - t) - 0.3], [x + b * (0.2 + 0.38 * t), -h * (1 - t)]], "#000", 0.25, 0.3, 0.1)).join("");
  return teil(T, p, farbe, (T.fein ? ringe : "") +
    form([[x - b * 0.48, -h * 0.66], [x + b * 0.21, -h * 1.02], [x + b * 0.26, -h * 0.86], [x - b * 0.44, -h * 0.48]], "#000", ` opacity=".35"`, 0.1) +
    strich([[x + b * 0.06, -h * 0.82], [x + b * 0.44, -h * 0.14]], "#fff", 1.4, 0.16, 0.1) +
    strich([[x - b * 0.5, -0.4], [x + b * 0.6, -0.4]], "#000", 0.8, 0.4, 0.1), { ra: 0.55, rw: 0.7, q: 0.1 }) +
    /* Kronrand: weicher Wulst über dem Huf */
    strich([[x - b * 0.47, -h * 0.66], [x + b * 0.21, -h * 1.03]], "#5a4a40", 1.3, 0.6, 0.1);
}
/* Auge (realistisch) mit kern.js T.augeReal */
const augeR = (T, x, y, rr, o) => T.augeReal(x, y, rr, o);
/* Paarhufer-Klaue (Seitenansicht: äußere Klaue vorn, innere dahinter) */
function klaue(T, x, b, h, farbe) {
  const k1 = [[x - b * 0.48, -h * 0.72, 1], [x + b * 0.08, -h, 1], [x + b * 0.56, -h * 0.08], [x + b * 0.5, 0, 1], [x - b * 0.52, 0, 1]];
  const k2 = [[x - b * 0.1, -h * 0.85, 1], [x + b * 0.4, -h * 0.9, 1], [x + b * 0.74, -h * 0.05], [x + b * 0.68, 0, 1], [x, 0, 1]];
  return form(k2, "#000", ` opacity=".6"`, 0.1) + teil(T, k1, farbe,
    strich([[x - b * 0.1, -h * 0.85], [x + b * 0.4, -h * 0.12]], "#fff", b * 0.12, 0.18, 0.1) +
    strich([[x - b * 0.5, -h * 0.68], [x + b * 0.08, -h * 0.98]], "#000", b * 0.12, 0.35, 0.1), { ra: 0.55, rw: 0.5, q: 0.1 }) +
    strich([[x + b * 0.06, -h * 0.94], [x + b * 0.28, -h * 0.15]], "#000", 0.5, 0.5, 0.1);
}
const afterklaue = (x, y, b, farbe) =>
  form([[x - b * 0.3, y - b * 0.5], [x + b * 0.5, y - b * 0.1], [x + b * 0.1, y + b * 0.6], [x - b * 0.6, y + b * 0.3]], farbe, ` stroke="#000" stroke-opacity=".4" stroke-width=".4"`, 0.1);

/* =====================================================================
   PFERD
   ===================================================================== */
/* RECHERCHE Pferd (Deutsches Warmblut, z. B. Hannoveraner/Oldenburger, „Brauner“):
   Stockmaß 160–175 cm (hier 168), Gewicht 550–650 kg. Rumpf quadratisch: Länge Buggelenk–Sitzbein-
   höcker ≈ Widerristhöhe; Kruppe auf Widerristhöhe. Kopf ≈ 60–65 cm, Hals ≈ 1,5 × Kopf (Genick bis
   Schultermitte). Schulter- und Fesselwinkel 45–55°. Vorderbein: Unterarm senkrecht, flaches Vorder-
   fußwurzelgelenk („Knie“), Röhre, Fesselkopf, Fessel schräg, Huf. Hinterbein: Kniegelenk vorn an der
   Flanke, Unterschenkel schräg nach hinten unten, Sprunggelenk mit Fersenbeinhöcker, Röhre senkrecht
   (Lot vom Sitzbeinhöcker läuft hinten an Sprunggelenk und Röhre herab). Brauner: rotbraunes Fell,
   „Abzeichen“ schwarz: Mähne, Schweif, Beine ab Röhre (Stiefel), Ohrränder. Kurzes, glänzendes Fell.
   Auge groß, seitlich, waagerechte Pupille; Ohren lanzettförmig, ~15 cm. Kastanien an der Innenseite. */
/* Unterbein eines Einhufers ab Vorderfußwurzel („Knie“, mit Erbsenbein hinten) bzw. Sprunggelenk: cx = Röhrenmitte,
   gy = Gelenkmitte. Liefert [Umriss, Hufmitte, Fesselkopf-Punkt hinten]. s = Größe (Esel kleiner). */
function einhuferUnterbein(cx, oben, gy, hinten, s = 1) {
  const sp = hinten
    ? [[cx - 1, oben, 6 * s, 6 * s], [cx, gy - 2 * s, 7.8 * s, 8.8 * s], [cx, gy + 5 * s, 6 * s, 7 * s], [cx, gy + 12 * s, 5 * s, 5.6 * s],
       [cx, -32 * s, 4.8 * s, 5.6 * s], [cx + 1 * s, -24 * s, 5.6 * s, 6.8 * s], [cx + 2 * s, -20 * s, 5.6 * s, 6.4 * s],
       [cx + 6 * s, -13 * s, 4.2 * s, 4.2 * s], [cx + 9 * s, -8.5 * s, 4.6 * s, 4.8 * s]]
    : [[cx - 0.5, oben, 5.5 * s, 5.5 * s], [cx, gy - 3 * s, 7 * s, 8.6 * s], [cx, gy + 1 * s, 6.6 * s, 7.2 * s], [cx, gy + 7 * s, 5 * s, 5.4 * s],
       [cx, -32 * s, 4.6 * s, 5.4 * s], [cx + 1 * s, -24 * s, 5.4 * s, 6.6 * s], [cx + 2 * s, -20 * s, 5.4 * s, 6.2 * s],
       [cx + 6 * s, -13 * s, 4.2 * s, 4.2 * s], [cx + 9 * s, -8.5 * s, 4.6 * s, 4.8 * s]];
  return [glied(sp), cx + 10.5 * s, [cx + 1 * s - 6.6 * s, -23 * s]];
}
/* Lauf-Details: Sehne hinten (Licht von links = hinten), Rinne zwischen Röhrbein und Beugesehne, Fesselkopf, Behang */
function laufDetails(T, F, cx, gy, s, haarFarbe) {
  const x0 = cx - 5.4 * s;
  return strich([[cx - 2.3 * s, gy + 8 * s], [cx - 2.2 * s, -38 * s], [cx - 1.6 * s, -28 * s]], "#000", 0.9 * s, 0.55, 0.1) +
    strich([[x0 + 1.4 * s, gy + 9 * s], [x0 + 1.2 * s, -40 * s], [x0 + 1.6 * s, -30 * s]], "#fff", 1.4 * s, 0.14, 0.1) +
    F.licht(cx - 3 * s, -22 * s, 3 * s, 3 * s, 0.35) + F.licht(cx + 2 * s, gy, 3 * s, 4 * s, 0.4) +
    strich([[cx + 3 * s, -21 * s], [cx + 6 * s, -16 * s], [cx + 9.6 * s, -11 * s]], "#000", 0.6, 0.35, 0.1) +
    haar(T, [[cx - 7 * s, -27 * s], [cx - 3 * s, -27 * s], [cx - 1 * s, -18 * s], [cx - 6 * s, -18 * s]], 22, 105, 4 * s,
      { farben: [[haarFarbe, 1, 0.25, 0.7]], streuung: 22, kruemmung: 0.3 });
}
function pferd(T) {
  const F = flecken(T, "#ffd3a0");
  const fell = T.lg("fell", [[0, "#a65f2c"], [0.3, "#8f4a22"], [0.65, "#6e3416"], [1, "#4a210d"]]);
  const oberF = T.lg("oberF", [[0, "#5a2b14"], [0.5, "#47210f"], [1, "#130e0b"]]);
  const schwarz = "#1c1512", schwarzF = "#100c0a";
  const stiefel = T.lg("stiefel", [[0, schwarz, 0], [0.7, schwarz, 0.96], [1, schwarz, 0.96]]);
  let s = "";
  /* ---------- ferne Beine (Innenseite, im Schatten; mit Kastanie = Hornwarze innen) ---------- */
  s += teil(T, glied([[149, -100, 9, 9], [151, -80, 7, 6.5], [152, -58, 6.5, 6], [152, -50, 6.5, 6.5]]), oberF,
    form([[147, -72], [150, -73], [150.5, -66], [147.5, -65]], "#2e2722", ` opacity=".9"`, 0.1), { ra: 0.4 });
  s += teil(T, glied([[64, -112, 10, 13], [60, -92, 7, 9], [57, -76, 6.5, 7], [57, -62, 7.5, 8.5]]), oberF, "", { ra: 0.4 });
  let [u, hx] = einhuferUnterbein(152, -56, -50, false);
  s += teil(T, u, schwarzF, strich([[149.6, -42], [149.8, -28]], "#fff", 1, 0.08, 0.1), { ra: 0.4 }) + huf(T, hx, 13, 9, "#1e1916");
  [u, hx] = einhuferUnterbein(58, -66, -60, true);
  s += teil(T, u, schwarzF, form([[54, -57], [57, -58], [57.3, -53], [54.3, -52.5]], "#2e2722", "", 0.1), { ra: 0.4 }) + huf(T, hx, 13, 9, "#1e1916");
  /* ---------- Schweif: Rübe am Kruppenende, lange Strähnen ---------- */
  const schweif = [[38, -163], [25, -162], [16, -153], [10, -131], [6, -104], [4, -80], [4, -60], [7, -46, 1], [11, -53], [14, -44, 1], [17, -54],
    [21, -47, 1], [22, -62], [22, -84], [21, -108], [23, -132], [28, -150]];
  s += teil(T, schweif, schwarz, haar(T, schweif, 170, (x, y) => 92 + (y < -140 ? 50 : 0) + (x - 14) * 0.4, 26,
    { farben: [["#000", 2, 0.5, 0.55], ["#4a3a32", 1.4, 0.35, 0.5], ["#8a7a70", 0.5, 0.25, 0.35]], streuung: 8, kruemmung: 0.12 }), { ra: 0.4 });
  /* ---------- Rumpf mit Hals; naher Ober-/Unterarm und Keule/Unterschenkel gehören dazu ---------- */
  const rumpf = [
    [58, -168], [40, -164], [28, -156], [20, -142], [17, -126], [20, -108], [27, -92], [30, -80], [29, -70], [27, -63], [29, -56, 1], [43, -56, 1],
    [43, -64], [47, -76], [56, -90], [66, -101], [74, -107], [84, -104], [104, -96], [130, -92], [150, -92], [156, -90], [159, -76], [160, -58],
    [161, -52, 1], [174, -52, 1], [173, -66], [172, -84], [176, -102], [184, -116], [189, -128], [195, -142], [205, -158], [216, -173], [226, -185],
    [236, -198], [244, -208], [232, -209], [216, -204], [198, -195], [180, -183], [164, -171], [148, -162], [120, -158], [92, -161], [72, -166]];
  const dR = gl(rumpf);
  const wuchs = richtung([[20, 96], [50, 100], [75, 150], [140, 168], [158, 112], [185, 102], [205, 112], [240, 118]]);
  const oben = [[30, -158], [60, -169], [92, -162], [120, -159], [148, -163], [164, -172], [200, -196], [232, -210], [228, -192], [196, -170],
    [172, -140], [150, -130], [100, -134], [60, -140], [32, -132]];
  const innen =
    struktur(T, dR, "fell", "#2a0f04", 165, 0.35, [15, -212, 248, -50]) +
    /* Muskelmassen: Kruppe/Kruppenmuskel, Schulter, Trizeps, Unterarm, Hals (Armkopfmuskel), Rippenwand, Unterschenkel */
    F.glanz(60, -146, 36, 18, 0.9, 12) + F.glanz(110, -150, 34, 9, 0.7, 2) + F.glanz(172, -146, 13, 26, 0.75, -24) +
    F.glanz(208, -190, 26, 8, 0.6, -38) + F.glanz(160, -112, 9, 13, 0.5) + F.glanz(166, -84, 4, 14, 0.5) + F.glanz(36, -110, 9, 22, 0.5, 8) +
    F.glanz(194, -158, 18, 6, 0.4, -45) + F.licht(76, -140, 6, 5, 0.35) +
    F.schatten(118, -93, 46, 14, 0.8) + F.schatten(151, -128, 7, 18, 0.45, -10) + F.schatten(176, -112, 8, 6, 0.5) +
    F.schatten(42, -80, 8, 22, 0.45, 15) + F.schatten(200, -150, 9, 20, 0.45, 40) + F.schatten(84, -122, 10, 18, 0.35) +
    F.schatten(78, -132, 5, 5, 0.4) + F.schatten(58, -100, 7, 10, 0.35) + F.schatten(230, -186, 8, 6, 0.5) +
    /* Kanten: Schulterblattgräte, Trizepsrand, Hüfthöcker, Kniefalte, Hosenrinne, Rippen, Drosselrinne, Sporader */
    strich([[167, -163], [177, -140], [187, -124]], "#2a1006", 1.2, 0.3) +
    strich([[152, -98], [158, -114], [168, -118], [180, -114]], "#2a1006", 1.1, 0.28) +
    strich([[70, -150], [77, -144], [80, -134]], "#2a1006", 1, 0.32) + strich([[71, -153], [79, -146]], "#ffd8a8", 1.4, 0.3) +
    strich([[86, -104], [76, -116], [64, -127]], "#2a1006", 1.1, 0.28) +
    strich([[33, -154], [39, -130], [42, -106], [46, -86]], "#2a1006", 1.1, 0.25) +
    strich([[64, -100], [56, -112], [52, -128]], "#2a1006", 0.9, 0.2) +
    strich([[117, -132], [115, -110]], "#2a1006", 1, 0.12) + strich([[128, -134], [127, -108]], "#2a1006", 1, 0.12) +
    strich([[138, -134], [138, -108]], "#2a1006", 1, 0.1) +
    strich([[193, -150], [206, -166], [222, -184]], "#2a1006", 1, 0.28) + strich([[194, -153], [207, -169], [222, -188]], "#ffd8a8", 1, 0.2) +
    strich([[150, -98], [128, -101], [104, -103], [96, -108]], "#2a1006", 0.9, 0.22) +
    /* Haar für Haar: dunkle Haare überall, helle Spitzen oben am Licht */
    haar(T, rumpf, 360, wuchs, 3, { farben: [["#3a1606", 1, 0.2, 0.3]], streuung: 16, kruemmung: 0.2 }) +
    haar(T, oben, 170, wuchs, 2.6, { farben: [["#e8a768", 1, 0.17, 0.35]], streuung: 14, kruemmung: 0.2 }) +
    /* schwarze Abzeichen: Beine ab Knie/Sprunggelenk */
    `<rect x="148" y="-86" width="32" height="36" fill="${stiefel}"/><rect x="20" y="-90" width="30" height="36" fill="${stiefel}"/>`;
  s += teil(T, dR, fell, innen, { ra: 0.34 });
  /* ---------- Mähne (auf der nahen Seite, verzogen ~12 cm), Strähnen hängen ---------- */
  const mo = [], mu = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14, x = 160 + t * 85, y = -169 - 39 * Math.pow(t, 0.9) - 6 * Math.sin(t * Math.PI);
    mo.push([x, y - 2]);
    mu.unshift([x - 3 + (i % 2) * 2, y + 9 + (i % 3) * 3 + 4 * Math.sin(t * Math.PI)]);
  }
  const maehne = mo.concat(mu);
  s += teil(T, maehne, schwarz, haar(T, maehne, 160, 100, 11,
    { farben: [["#000", 2, 0.45, 0.6], ["#4e3d33", 1.3, 0.35, 0.55], ["#9a8676", 0.4, 0.22, 0.4]], streuung: 12, kruemmung: 0.25 }), { ra: 0.25 });
  /* ---------- nahe Beine ---------- */
  [u, hx] = einhuferUnterbein(36, -62, -60, true);
  s += teil(T, u, schwarz, laufDetails(T, F, 36, -60, 1, "#000") + F.schatten(41, -60, 5, 6, 0.6), { ra: 0.45 }) + huf(T, hx, 13, 9, "#2a2320");
  [u, hx] = einhuferUnterbein(167, -56, -50, false);
  s += teil(T, u, schwarz, laufDetails(T, F, 167, -50, 1, "#000"), { ra: 0.45 }) + huf(T, hx, 13, 9, "#2a2320");
  /* Sprunggelenk: Fersenbeinhöcker; Achillessehne */
  s += strich([[31, -84], [29, -72], [28, -63]], "#ffd8a8", 1.2, 0.22) + strich([[34, -82], [33, -68], [32, -62]], "#000", 0.8, 0.35);
  /* ---------- Kopf: eigenes System (x Genick → Nase, y zur Unterseite), 57° geneigt ---------- */
  const G = [245, -203], W = 57, K = (pts) => dreh(pts, G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  const kopfL = [[0, -3], [10, -5.5], [22, -6], [36, -4.5], [48, -2.5], [57, -0.5], [62, 3], [63.5, 8], [61.5, 12.5], [57, 14.5], [54, 18.5],
    [49, 18], [45, 15], [37, 15], [29, 18], [20, 24], [11, 26.5], [3, 23], [-1, 14], [-2, 5]];
  const kopf = K(kopfL), dK = gl(kopf, true, 0.1);
  const maul = K([[48, -3], [58, -1], [63, 4], [64, 9], [62, 13], [57, 15], [54, 19], [48, 18.5], [45, 9]]);
  const kInnen =
    struktur(T, dK, "kopf", "#2a0f04", W, 0.3, [200, -212, 280, -135]) +
    F.glanz(...P(24, 12), 14, 9, 0.85, W) + F.glanz(...P(44, 1), 14, 3.5, 0.6, W) + F.glanz(...P(14, -1), 6, 3, 0.5, W) +
    F.schatten(...P(10, 21), 10, 7, 0.55, W) + F.schatten(...P(2, 10), 5, 12, 0.45, W) + F.schatten(...P(10, -3), 4, 2.5, 0.5, W) +
    F.schatten(...P(40, 12), 10, 4, 0.4, W) +
    /* Ganasche, Jochleiste, Gesichtsvene, Augenhöhle */
    strich(K([[28, 10], [22, 18], [13, 23], [5, 19]]), "#2a1006", 1.2, 0.42, 0.1) +
    strich(K([[29, 8], [23, 15], [14, 20]]), "#ffd8a8", 1, 0.25, 0.1) +
    strich(K([[13, 6.5], [24, 6.5], [36, 5]]), "#2a1006", 1, 0.32, 0.1) + strich(K([[13, 5.2], [24, 5.2], [36, 3.6]]), "#ffd8a8", 0.9, 0.3, 0.1) +
    strich(K([[33, 16], [40, 13], [46, 11]]), "#2a1006", 0.7, 0.22, 0.1) +
    haar(T, kopf, 150, W + 2, 1.6, { farben: [["#3a1606", 1, 0.15, 0.32], ["#e8a768", 0.6, 0.13, 0.3]], streuung: 14 }) +
    /* Maul: dunkle, fein behaarte Haut, Lippen */
    form(maul, T.rg("maul", [[0, "#3a2a22", 0.75], [1, "#2a1a12", 0.35]], 0.7, 0.4, 0.7), "", 0.1) +
    (T.fein ? `<g opacity=".5">${haar(T, maul, 50, W + 10, 0.8, { farben: [["#d8c0a8", 1, 0.1, 0.5]], streuung: 40 })}</g>` : "");
  s += teil(T, dK, fell, kInnen, { ra: 0.34 });
  /* Nüster: groß, Kommaform, feuchter Rand */
  s += form(K([[54.5, 0.5], [59, 0.8], [61, 3.5], [60.4, 6.6], [58, 7.2], [57.4, 4.6], [55.4, 3.2]]), "#2f201a", "", 0.1);
  s += form(K([[56.5, 1.8], [59.4, 2.2], [60.1, 5.2], [58.6, 6.3], [58.2, 3.9]]), "#050302", "", 0.1);
  s += strich(K([[54.6, 0.2], [59.2, 0.2], [61.6, 3.4]]), "#e8d8c8", 0.5, 0.45, 0.1) + strich(K([[54, 1.5], [55, 4.5], [57.6, 7.8]]), "#000", 0.5, 0.4, 0.1);
  /* Maulspalte, Unterlippe, Kinn, Tasthaare */
  s += strich(K([[56.5, 13.4], [59.5, 12.8], [62.2, 11.6]]), "#000", 0.9, 0.6, 0.1) + strich(K([[50.2, 15.8], [53.5, 15.6], [55.6, 14.3]]), "#000", 0.6, 0.45, 0.1);
  s += strich(K([[56.6, 14.6], [60.4, 13.6]]), "#e8d8c8", 0.4, 0.3, 0.1);
  if (T.fein) {
    const [mx, my] = P(60, 13), [cx2, cy2] = P(52, 18);
    s += T.schnurrhaare(mx, my, 7, 3.2, W + 30, 60, "#1a120e", 0.12) + T.schnurrhaare(cx2, cy2, 6, 3, W + 70, 50, "#1a120e", 0.12);
  }
  /* Auge: groß, seitlich, waagerechte Pupille, lange Wimpern; Augenbogen und Grube darüber */
  const A = P(18, 1.6);
  s += strich(K([[11, -1], [16.5, -3.6], [23, -2.6]]), "#ffd8a8", 1.2, 0.35, 0.1) + strich(K([[12, -0.2], [17, -2.4], [22.5, -1.4]]), "#1a0a04", 0.8, 0.5, 0.1);
  s += augeR(T, A[0], A[1], 2.1, { iris: "#5a3418", iris2: "#24120a", pupille: "quer", offen: 0.66, winkel: 33, wimpern: 14, wimpernLaenge: 0.75,
    wimpernFarbe: "#0e0806", haut: "#2a1208" });
  /* Ohren: fern dunkler; nah mit Muschel, hellem Innenhaar, schwarzem Rand */
  const ohrL = [[0, 0], [-3.6, -6], [-3.2, -12], [-0.6, -17.5, 1], [2.4, -11.5], [3.9, -4], [3, 1]];
  s += teil(T, dreh(ohrL, 239, -205, -4), "#4a2410", "", { ra: 0.45, q: 0.1 });
  const oN = dreh(ohrL, 245, -205, 12), oI = dreh([[1.6, -0.5], [-1.6, -6.5], [-1, -13.5], [1.7, -8]], 245, -205, 12);
  s += teil(T, oN, T.lg("ohr", [[0, "#1c1512"], [0.35, "#7e401f"], [1, "#8f4a22"]]),
    form(oI, "#2a140a", ` opacity=".85"`, 0.1) + haar(T, oI, 26, 100, 2.4, { farben: [["#e8d4b8", 1, 0.12, 0.6]], streuung: 30 }) +
    strich(dreh([[-3.4, -6], [-3, -12], [-0.6, -17.3]], 245, -205, 12), "#000", 0.9, 0.7, 0.1), { ra: 0.4, q: 0.1 });
  /* Schopf: Strähnen zwischen den Ohren über die Stirn */
  const schopf = K([[-3, -8], [5, -10.5], [12, -9.5], [18, -7], [21.5, -3.2], [19, -1.8], [16, -3.6], [13, -1.6], [10, -3.5], [6, -1.5], [1, -2.5]]);
  s += teil(T, schopf, schwarz, haar(T, schopf, 40, W - 8, 6, { farben: [["#000", 1, 0.35, 0.6], ["#5a4840", 0.8, 0.25, 0.5]], streuung: 10, kruemmung: 0.25 }), { ra: 0.3, q: 0.1 });
  return { svg: s, box: [4, -223, 272, 0] };
}

module.exports = [
  { id: "pferd", de: "das Pferd", syl: "PFERD", it: "il cavallo", itSyl: "ca-VAL-lo", en: "horse",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 2.69, hoehe: 2.15, zeichne: pferd },
];
