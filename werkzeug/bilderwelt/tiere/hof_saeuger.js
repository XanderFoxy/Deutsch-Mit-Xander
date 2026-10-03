/* =====================================================================
   TIER-BIBLIOTHEK — HOF-SÄUGETIERE (FASSUNG 854)
   Kuh, Kalb, Pferd, Esel, Schwein, Schaf, Ziege – Seitenansicht, Blick
   nach rechts, Zentimeter, Boden y = 0, Licht von links oben.
   ===================================================================== */
"use strict";

/* ---------- Helfer ---------- */
/* FEIN: volle Feinheit (Blatt/Lupe) oder Szene (klein) – wird zu Beginn jeder zeichne-Funktion aus T.fein gesetzt.
   In der Szene entfallen sehr schwache Licht-/Schattenflecken und feine Striche (man sieht sie dort nicht). */
let FEIN = true;
const rad = (g) => (g * Math.PI) / 180;
/* Zahl kurz schreiben (q = Raster in cm; große Tiere brauchen keine Zehntel) */
const z = (v, q) => { const n = Math.round(v / q) * q; return String(Math.round(n * 10) / 10); };
/* glatte Kurve (Catmull-Rom) wie T.glatt, aber mit grobem Raster → halb so viele Bytes */
function gl(pts, zu = true, q = 1) {
  if (!FEIN) q = Math.max(q, 0.5);       // Szene: halbe Zentimeter reichen
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
  const rand = o.rand === false ? "" : ` stroke="${o.rc || "#1a0c05"}" stroke-opacity="${o.ra != null ? o.ra : 0.45}" stroke-width="${o.rw || 0.8}" stroke-linejoin="round"`;
  let s = `<path id="${id}" d="${d}" fill="${fill}"${rand}/>`;
  if (innen) { T.def(`<clipPath id="${id}c"><use href="#${id}"/></clipPath>`); s += `<g clip-path="url(#${id}c)">${innen}</g>`; }
  return s;
}
/* Vieleck mit geraden Kanten (für kleine Szenen-Darstellung von zackigen Rändern) */
const vieleck = (pts) => "M" + pts.map((p) => Math.round(p[0]) + " " + Math.round(p[1])).join("L") + "Z";
const form = (pts, fill, extra = "", q = 1) => `<path d="${typeof pts === "string" ? pts : gl(pts, true, q)}" fill="${fill}"${extra}/>`;
/* feine Linie (Falte, Muskelkante) */
const strich = (pts, farbe, w, op, q = 1) => (!FEIN && op < 0.3) ? "" :
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
  const f = (fill) => (x, y, rx, ry, op = 1, g = 0) => (!FEIN && op < 0.45) ? "" :
    `<ellipse cx="${z(x, 0.5)}" cy="${z(y, 0.5)}" rx="${z(rx, 0.5)}" ry="${z(ry, 0.5)}" fill="${fill}"${op !== 1 ? ` opacity="${op}"` : ""}${g ? ` transform="rotate(${Math.round(g)} ${z(x, 0.5)} ${z(y, 0.5)})"` : ""}/>`;
  /* weiche Rinne/Kante zwischen zwei Punkten: gestreckte Ellipse (spitz auslaufend, keine Strichkante) */
  const zwischen = (fn) => (x1, y1, x2, y2, b, op) => fn((x1 + x2) / 2, (y1 + y2) / 2, Math.hypot(x2 - x1, y2 - y1) / 2, b, op, Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI);
  return { licht: f(hell), glanz: f(warm), schatten: f(dunkel), rinne: zwischen(f(dunkel)), kante: zwischen(f(warm)) };
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
  const p = [[x - b * 0.45, -h * 0.62, 1], [x - b * 0.1, -h * 0.88], [x + b * 0.2, -h, 1], [x + b * 0.44, -h * 0.5], [x + b * 0.62, 0, 1], [x - b * 0.42, 0, 1],
    [x - b * 0.55, -h * 0.2], [x - b * 0.54, -h * 0.45]];
  const ringe = [0.3, 0.52, 0.74].map((t) => strich([[x - b * 0.47 + t * 0.12 * b, -h * 0.62 * (1 - t) - 0.3], [x + b * (0.2 + 0.38 * t), -h * (1 - t)]], "#000", 0.25, 0.3, 0.1)).join("");
  return teil(T, p, farbe, (T.fein ? ringe + form(p, T.lg("hufv", [[0, "#fff", 0.1], [0.5, "#fff", 0], [1, "#000", 0.3]], 0, 0, 1, 0), "", 0.1) : "") +
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
/* Afterklaue: kleiner Hornzapfen hinten am Fesselkopf, nach hinten-unten gerichtet; x/y = Ansatz an der Beinkante */
const afterklaue = (x, y, b, farbe) =>
  form([[x + b * 0.5, y - b * 0.6], [x + b * 0.4, y + b * 0.5], [x - b * 0.5, y + b * 0.95, 1], [x - b * 0.7, y + b * 0.2]], farbe, ` stroke="#000" stroke-opacity=".45" stroke-width=".35"`, 0.1);

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
/* Einhufer-Beine als Kanten (für den Körperumriss): Vorderbein hinten hinab / vorn hinauf, Hinterbein ebenso.
   Grundmaße eines Warmbluts (168 cm), cx = Röhrenmitte, s = Größe (Esel), hx = Hufmitte. */
const VB_H = [[159, -76], [160, -61], [158.6, -55], [159, -49.5], [161.6, -44.5], [162, -32], [160.6, -24.5], [162, -19.5], [166.5, -13], [170.6, -6, 1]];
const VB_V = [[180.6, -9.2, 1], [176.6, -14], [174, -19.5], [173.6, -24.5], [172, -31], [171.8, -44], [173, -49], [174.3, -54], [173.8, -60], [173, -70]];
const HB_H = [[27, -92], [30, -80], [29, -71], [26.4, -64.5], [27.6, -58], [30.6, -52], [31, -40], [31, -30.5], [29.6, -24.5], [31, -19.5], [35.6, -13], [39.6, -6, 1]];
const HB_V = [[49.6, -9.2, 1], [45.6, -14], [43, -19.5], [42.6, -24.5], [41, -31], [40.8, -46], [41.6, -54], [43.6, -60], [44, -66], [47, -76]];
const verschiebe = (pts, dx, s = 1, ox = 0) => pts.map((p) => [ox + (p[0] - ox) * s + dx, p[1] * s].concat(p[2] ? [1] : []));
/* Lauf-Details: Beugesehne hinten (Licht von links), Rinne zwischen Röhrbein und Sehne, Fesselkopf, Behang (Kötenhaar) */
function laufDetails(T, F, cx, gy, s, haarFarbe) {
  const x0 = cx - 5.4 * s;
  return strich([[cx - 2.2 * s, gy + 8 * s], [cx - 2.1 * s, -38 * s], [cx - 1.6 * s, -29 * s]], "#000", 1 * s, FEIN ? 0.5 : 0.2, 0.1) +
    strich([[x0 + 1.6 * s, gy + 9 * s], [x0 + 1.3 * s, -40 * s], [x0 + 1.5 * s, -31 * s]], "#c8b0a0", 2 * s, 0.07, 0.1) +
    fein(T, strich([[cx + 3 * s, -21 * s], [cx + 6 * s, -16 * s], [cx + 9.4 * s, -11 * s]], "#000", 0.7, 0.3, 0.1)) +
    haar(T, [[cx - 7.5 * s, -27 * s], [cx - 3 * s, -27 * s], [cx - 1 * s, -18 * s], [cx - 6.5 * s, -18 * s]], 18, 108, 4 * s,
      { farben: [[haarFarbe, 1, 0.25, 0.7]], streuung: 22, kruemmung: 0.3, szene: 0 });
}
/* RECHERCHE Pferd (Deutsches Warmblut, z. B. Hannoveraner/Oldenburger, „Brauner“):
   Stockmaß 160–175 cm (hier 168), 550–650 kg. Rumpf quadratisch: Buggelenk–Sitzbeinhöcker ≈ Widerristhöhe, Kruppe auf
   Widerristhöhe. Kopf ≈ 60–65 cm, Hals ≈ 1,5 × Kopf (Genick bis Schultermitte), Hals am Ansatz tief, oben gewölbter
   Mähnenkamm. Schulter- und Fesselwinkel 45–55°, Huf gleich steil wie die Fessel. Vorderbein: Unterarm senkrecht,
   flaches Vorderfußwurzelgelenk („Knie“) mit Erbsenbein hinten, Röhre mit Beugesehne dahinter (Rinne), Fesselkopf mit
   Kötenhaar, Fessel, Kronrand, Huf. Hinterbein: Kniegelenk vorn an der Flanke (Kniefalte), Unterschenkel schräg, Sprung-
   gelenk mit Fersenbeinhöcker; Lot vom Sitzbeinhöcker trifft Sprunggelenk und Röhre hinten. Kastanien (Hornwarzen) an der
   INNENSEITE: vorn über dem Knie, hinten unter dem Sprunggelenk – sichtbar an den fernen Beinen. Brauner: rotbraunes,
   kurzes, glänzendes Fell; Mähne, Schweif, Ohrränder und Beine ab Knie/Sprunggelenk schwarz. Auge groß, seitlich,
   waagerechte Pupille, lange Wimpern am Oberlid; Nüstern groß, kommaförmig; Tasthaare am Maul; Ganasche (Unterkiefer-
   bogen) deutlich; Jochleiste unter dem Auge; Ohren lanzettförmig ~15 cm. Fellstrich: Hals/Schulter abwärts, Rumpf nach
   hinten, Kruppe/Hinterbacke abwärts, Gesicht zur Nase. */
const KAMM = [[244, -210], [234, -216], [220, -216], [204, -209], [186, -195], [170, -180], [160, -171]];
function pferd(T) {
  FEIN = T.fein;
  const F = flecken(T, "#ffcf98");
  const fell = T.lg("fell", [[0, "#9c5427"], [0.28, "#86431e"], [0.5, "#6a3015"], [0.62, "#542610"], [1, "#3a1a0a"]]);
  const fern = T.lg("fern", [[0, "#4e2511"], [0.3, "#3a1c0d"], [0.45, "#130e0b"], [1, "#0e0a08"]]);
  const schwarz = "#1c1512";
  const stiefel = T.lg("stiefel", [[0, schwarz, 0], [0.2, schwarz, 0.35], [0.36, schwarz, 0.97], [1, schwarz, 0.97]]);
  let s = "";
  /* ---------- ferne Beine (Innenseite, im Schatten; Kastanien) ---------- */
  const fv = [[146, -104]].concat(verschiebe(VB_H, -15), verschiebe(VB_V, -15), [[160, -104]]);
  const fh = [[56, -104]].concat(verschiebe(HB_H.slice(1), 22), verschiebe(HB_V, 22), [[76, -104]]);
  s += teil(T, fh, fern, form([[54, -57], [56.6, -58], [57, -53.4], [54.4, -52.8]], "#29221e", ` stroke="#5a4e46" stroke-width=".3"`, 0.1) +
    "", { ra: 0.4 }) + huf(T, 68, 13, 9, "#1c1714");
  s += teil(T, fv, fern, form([[145, -71.5], [147.6, -72.5], [148, -66.5], [145.4, -66]], "#29221e", ` stroke="#5a4e46" stroke-width=".3"`, 0.1) +
    "", { ra: 0.4 }) + huf(T, 162.5, 13, 9, "#1c1714");
  /* ---------- Schweif: Rübe am Kruppenende, lange Strähnen (über den Rand hinaus) ---------- */
  const schweif = [[38, -163], [25, -162], [16, -153], [10, -131], [7, -104], [5, -80], [4.5, -62], [6, -49, 1], [9, -55], [12, -45, 1], [14.5, -53],
    [17.5, -47, 1], [20, -58], [22, -84], [21, -108], [23, -132], [28, -150]];
  const sw = (x, y) => 93 + (y < -140 ? 45 : 0) + (x - 14) * 0.35;
  s += teil(T, schweif, schwarz, haar(T, schweif, 105, sw, 26,
    { farben: [["#000", 2, 0.5, 0.55], ["#4a3a32", 1.4, 0.35, 0.5], ["#8a7a70", 0.5, 0.25, 0.35]], streuung: 8, kruemmung: 0.12, szene: 0.08 }), { ra: 0.4 });
  s += haar(T, [[7, -84], [20, -84], [20, -58], [6, -58]], 34, sw, 10, { farben: [["#1c1512", 1, 0.4, 0.6], ["#4a3a32", 0.6, 0.3, 0.45]], streuung: 8, kruemmung: 0.15, szene: 0.1 });
  /* ---------- Rumpf: Hals, Rumpf und nahe Beine in EINEM Umriss (keine Nähte an den Gelenken) ---------- */
  const rumpf = [[58, -168], [40, -164], [28, -156], [20, -142], [17, -126], [20, -108]].concat(HB_H, HB_V,
    [[56, -90], [66, -101], [74, -107], [84, -104], [104, -96], [130, -92], [150, -92], [156, -90]], VB_H, VB_V,
    [[172, -84], [176, -102], [184, -116], [189, -127], [194, -140], [203, -155], [214, -168], [222, -180], [228, -188], [236, -199],
     [244, -210]], KAMM.slice(1), [[150, -167], [140, -161], [120, -158], [92, -161], [72, -166]]);
  const dR = gl(rumpf, true, T.fein ? 0.2 : 1);
  const wuchs = richtung([[20, 96], [50, 100], [75, 150], [140, 168], [158, 110], [185, 100], [205, 108], [240, 112]], (x, y) => (y > -60 ? 90 - 120 * 0 : 0));
  const lichtSeite = [[30, -158], [60, -169], [92, -162], [120, -159], [148, -163], [164, -172], [200, -204], [234, -216], [228, -196], [196, -176],
    [172, -140], [150, -132], [100, -136], [60, -142], [32, -132]];
  const innen =
    struktur(T, dR, "fell", "#2a0f04", 168, 0.1, [15, -218, 250, 0]) +
    /* Muskelmassen (Licht links oben): Kruppe, Hinterbacke, Rippenwand, Schulter, Trizeps, Unterarm, Armkopfmuskel, Unterschenkel */
    F.glanz(62, -150, 34, 15, 0.75, 12) + F.glanz(34, -118, 9, 20, 0.45, 8) + F.glanz(112, -151, 34, 8, 0.6, 2) +
    F.glanz(171, -150, 11, 22, 0.6, -24) + F.glanz(161, -112, 8, 11, 0.45) + F.glanz(165, -80, 4, 13, 0.4) + F.glanz(210, -194, 24, 7, 0.55, -40) +
    F.glanz(48, -84, 5, 12, 0.35, 25) +
    F.schatten(118, -94, 46, 13, 0.8) + F.schatten(151, -126, 7, 17, 0.4, -10) + F.schatten(178, -112, 9, 6, 0.45) +
    F.schatten(201, -148, 10, 22, 0.5, 40) + F.schatten(86, -121, 10, 17, 0.32) + F.schatten(80, -134, 4, 4, 0.35) +
    F.schatten(59, -101, 7, 10, 0.32) + F.schatten(229, -190, 8, 7, 0.5) + F.schatten(176, -76, 4, 14, 0.4) + F.schatten(46, -66, 3, 10, 0.4) +
    /* weiche Muskelrinnen (breit, schwach): Schulterblattgräte, Trizepsrand, Hüfthöcker, Kniefalte, Hosenrinne, Drosselrinne */
    F.rinne(166, -162, 186, -124, 2.6, 0.4) + F.kante(164, -160, 182, -126, 2.4, 0.45) +
    F.rinne(152, -100, 166, -119, 2.4, 0.4) + F.rinne(162, -119, 182, -114, 2.2, 0.35) +
    F.rinne(73, -149, 81, -134, 2.2, 0.4) + F.kante(70, -152, 78, -146, 2, 0.6) +
    F.rinne(86, -104, 64, -127, 2.6, 0.38) +
    F.rinne(34, -154, 42, -110, 2.4, 0.35) + F.rinne(42, -110, 46, -88, 2, 0.3) +
    F.rinne(194, -150, 222, -186, 2.2, 0.42) + F.kante(190, -152, 218, -190, 2.4, 0.4) +
    F.rinne(148, -99, 98, -106, 1.4, 0.3) +
    /* Haar für Haar: dunkle Haare überall, helle Spitzen oben am Licht */
    haar(T, rumpf, 240, wuchs, 2.3, { farben: [["#3a1606", 1, 0.18, 0.24]], streuung: 16, kruemmung: 0.2, szene: 0.06 }) +
    haar(T, lichtSeite, 100, wuchs, 2.1, { farben: [["#f0b070", 1, 0.15, 0.2]], streuung: 14, kruemmung: 0.2, szene: 0.06 }) +
    /* schwarze Abzeichen ab Knie / Sprunggelenk, dann Läufe als Zylinder (Licht hinten links) */
    `<rect x="148" y="-92" width="38" height="92" fill="${stiefel}"/><rect x="18" y="-96" width="36" height="96" fill="${stiefel}"/>` +
    laufDetails(T, F, 167, -50, 1, "#000") + laufDetails(T, F, 36, -58, 1, "#000") +
    F.schatten(176, -36, 3, 22, 0.5) + F.schatten(45, -40, 3, 22, 0.5) +
    fein(T, strich([[31.5, -84], [29.6, -72], [28, -64]], "#c8a890", 1.6, 0.07) + strich([[34, -82], [33, -68], [32.4, -62]], "#000", 1, 0.25));
  s += teil(T, dR, fell, innen, { ra: 0.34 });
  s += huf(T, 46, 13, 9, "#2a2320") + huf(T, 177, 13, 9, "#2a2320");
  /* ---------- Mähne (auf der nahen Seite, verzogen ~12 cm), Strähnen hängen über den Rand ---------- */
  /* Kamm fein abtasten, Mähne von oben (auf der Umrisslinie) bis 7–11 cm darunter */
  const kamm = [];
  for (let i = 0; i < KAMM.length - 1; i++) for (let t = 0; t < 1; t += 0.5) kamm.push([KAMM[i][0] + (KAMM[i + 1][0] - KAMM[i][0]) * t, KAMM[i][1] + (KAMM[i + 1][1] - KAMM[i][1]) * t]);
  kamm.push(KAMM[KAMM.length - 1]);
  const mo = kamm.map((p) => [p[0], p[1] - 1.2]);
  const mu = kamm.map((p, i) => { const t = i / (kamm.length - 1); return [p[0] - 3.5 - 2 * Math.sin(t * 3), p[1] + 5 + 4 * Math.sin(t * Math.PI) + (i % 2) * 1.3 - 3 * t]; }).reverse();
  const maehne = mo.concat(mu);
  const mf = { farben: [["#000", 2, 0.45, 0.6], ["#4e3d33", 1.3, 0.32, 0.55], ["#a08a78", 0.35, 0.2, 0.4]], streuung: 10, kruemmung: 0.25 };
  s += teil(T, maehne, schwarz, haar(T, maehne, 100, (x) => 112 - (x - 160) * 0.25, 9, Object.assign({ szene: 0.12 }, mf)), { ra: 0.2 });
  s += haar(T, mu.map((p) => [p[0] + 1.5, p[1] - 3]).concat(mu.slice().reverse()), 55, (x) => 108 - (x - 160) * 0.2, 4.5,
    { farben: [["#140f0c", 1, 0.4, 0.55], ["#4e3d33", 0.6, 0.3, 0.45]], streuung: 12, kruemmung: 0.3, szene: 0 });
  /* ---------- Kopf: eigenes System (x Genick → Nase, y zur Unterseite), 57° geneigt ---------- */
  const G = [245, -203], W = 57, K = (pts) => dreh(pts, G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  const kopf = K([[0, -3], [10, -5.5], [22, -6], [36, -4.5], [48, -2.5], [57, -0.5], [62, 3], [63.5, 8], [61.5, 12.5], [57, 14.3], [54, 17.4],
    [49, 17.2], [45, 15], [37, 15], [29, 18], [20, 24], [11, 26.5], [3, 23], [-1, 14], [-2, 5]]);
  const dK = gl(kopf, true, 0.1);
  const maul = K([[48, -3], [58, -1], [63, 4], [64, 9], [62, 13], [57, 15], [54, 19], [48, 18.5], [45, 9]]);
  const kInnen =
    struktur(T, dK, "kopf", "#2a0f04", W, 0.16, [200, -212, 280, -135]) +
    F.glanz(...P(24, 12), 13, 9, 0.75, W) + F.glanz(...P(42, 0.5), 15, 3.5, 0.55, W) + F.glanz(...P(14, -1.5), 6, 3, 0.45, W) +
    F.schatten(...P(10, 21), 10, 7, 0.55, W) + F.schatten(...P(1, 10), 5, 12, 0.5, W) + F.schatten(...P(9, -3), 4, 2.5, 0.45, W) +
    F.schatten(...P(40, 12.5), 10, 4, 0.4, W) +
    /* Ganasche (Unterkieferbogen), Jochleiste (Licht oben, Schatten unten), Gesichtsvene */
    F.rinne(...P(27, 11), ...P(19, 20), 1.6, 0.45) + F.rinne(...P(19, 20), ...P(8, 23), 1.6, 0.45) + F.rinne(...P(9, 23), ...P(4, 17), 1.4, 0.4) +
    F.glanz(...P(22, 15), 6, 3, 0.4, W - 40) + F.rinne(...P(13, 7.6), ...P(36, 6), 1.6, 0.4) + F.kante(...P(13, 5), ...P(36, 3.6), 1.6, 0.6) +
    fein(T, strich(K([[31, 16.5], [38, 13.5], [46, 11.5]]), "#2a1006", 0.9, 0.2, 0.1)) +
    haar(T, kopf, 120, W + 2, 1.4, { farben: [["#3a1606", 1, 0.14, 0.28], ["#f0b070", 0.5, 0.12, 0.18]], streuung: 12, kruemmung: 0.08, szene: 0.1 }) +
    /* Maul: dunkle, samtige Haut */
    form(maul, T.rg("maul", [[0, "#3a2a22", 0.6], [0.6, "#3a2216", 0.35], [1, "#3a2216", 0]], 0.75, 0.45, 0.65), "", 0.1) +
    fein(T, `<g opacity=".5">${haar(T, maul, 45, W + 10, 0.8, { farben: [["#d8c0a8", 1, 0.1, 0.5]], streuung: 40 })}</g>`);
  s += teil(T, dK, fell, kInnen, { ra: 0.34 });
  /* Nüster: groß, Kommaform, feuchter Rand */
  s += form(K([[54.5, 0.5], [59, 0.8], [61, 3.5], [60.4, 6.6], [58, 7.2], [57.4, 4.6], [55.4, 3.2]]), "#2f201a", "", 0.1);
  s += form(K([[56.5, 1.8], [59.4, 2.2], [60.1, 5.2], [58.6, 6.3], [58.2, 3.9]]), "#050302", "", 0.1);
  s += strich(K([[54.6, 0.2], [59.2, 0.2], [61.6, 3.4]]), "#e8d8c8", 0.5, 0.45, 0.1) + fein(T, strich(K([[54, 1.5], [55, 4.5], [57.6, 7.8]]), "#000", 0.5, 0.4, 0.1));
  /* Maulspalte, Unterlippe, Kinn, Tasthaare */
  s += strich(K([[56.5, 13.4], [59.5, 12.8], [62.2, 11.6]]), "#000", 0.9, 0.6, 0.1) + strich(K([[50.2, 15.8], [53.5, 15.6], [55.6, 14.3]]), "#000", 0.6, 0.45, 0.1);
  if (T.fein) {
    const [mx, my] = P(60, 13), [cx2, cy2] = P(52, 18);
    s += strich(K([[56.6, 14.6], [60.4, 13.6]]), "#e8d8c8", 0.4, 0.3, 0.1);
    s += T.schnurrhaare(mx, my, 7, 3.2, W + 30, 60, "#1a120e", 0.12) + T.schnurrhaare(cx2, cy2, 6, 3, W + 70, 50, "#1a120e", 0.12);
  }
  /* Auge: groß, seitlich, waagerechte Pupille, lange Wimpern; Augenbogen und Grube darüber */
  const A = P(18, 1.6);
  s += F.kante(...P(11, -2.6), ...P(23, -3.4), 1.4, 0.55) + F.rinne(...P(8, -3.8), ...P(14, -4.4), 2, 0.5) + strich(K([[12, -0.2], [17, -2.4], [22.5, -1.4]]), "#1a0a04", 0.8, 0.4, 0.1);
  s += F.schatten(A[0] - 0.5, A[1] - 1.2, 4.8, 3.6, 0.35) + T.augeReal(A[0], A[1], 2.35, { iris: "#5a3418", iris2: "#24120a", pupille: "quer", offen: 0.66, winkel: 33, wimpern: 14, wimpernLaenge: 0.75,
    wimpernFarbe: "#0e0806", haut: "#2a1208" });
  /* Ohren: fern dunkler; nah mit Muschel, hellem Innenhaar, schwarzem Rand */
  const ohrL = [[0, 0], [-3.6, -6], [-3.2, -12], [-0.6, -17.5, 1], [2.4, -11.5], [3.9, -4], [3, 1]];
  s += teil(T, dreh(ohrL, 239, -206, -4), "#4a2410", "", { ra: 0.45, q: 0.1 });
  const oI = dreh([[1.6, -0.5], [-1.6, -6.5], [-1, -13.5], [1.7, -8]], 245, -206, 12);
  s += teil(T, dreh(ohrL, 245, -206, 12), T.lg("ohr", [[0, "#1c1512"], [0.35, "#7e401f"], [1, "#8f4a22"]]),
    form(oI, "#2a140a", ` opacity=".85"`, 0.1) + haar(T, oI, 18, 95, 2.6, { farben: [["#e8d4b8", 1, 0.1, 0.45]], streuung: 16, szene: 0.5 }) +
    strich(dreh([[-3.4, -6], [-3, -12], [-0.6, -17.3]], 245, -206, 12), "#000", 0.9, 0.7, 0.1), { ra: 0.4, q: 0.1 });
  /* Schopf: Strähnen zwischen den Ohren über die Stirn */
  const schopf = K([[-3, -7.5], [4, -9], [10, -8.2], [14.5, -6.6], [16.5, -4.2], [14, -3.6], [11.5, -2.6], [9, -3.8], [6, -2.4], [1, -3]]);
  s += teil(T, schopf, schwarz, haar(T, schopf, 40, W - 10, 6, { farben: [["#000", 1, 0.35, 0.6], ["#5a4840", 0.8, 0.25, 0.5]], streuung: 10, kruemmung: 0.25 }), { ra: 0.2, q: 0.1 });
  s += haar(T, K([[6, -7], [14, -6], [16, -3.5], [8, -3]]), 14, W - 14, 5, { farben: [["#0e0a08", 1, 0.3, 0.6]], streuung: 12, kruemmung: 0.3, szene: 0 });
  return { svg: s, box: [4, -224, 272, 0] };
}

/* ---------- Helfer für Rinder ---------- */
/* Umriss zackig machen (Scheckenränder: unregelmäßig, „Landkarte“): je Kante k Zwischenpunkte, quer verschoben ±amp */
function zackig(T, pts, amp, k = 2) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    out.push([a[0], a[1]]);
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    for (let j = 1; j <= k; j++) {
      const t = j / (k + 1), v = (T.rnd() - 0.5) * 2 * amp;
      out.push([a[0] + dx * t - dy / L * v, a[1] + dy * t + dx / L * v]);
    }
  }
  return out;
}
/* Haarsaum an einer Farbgrenze: kurze Haare in Wuchsrichtung, die über den Rand der Fläche hinauswachsen */
function saum(T, pts, n, winkel, laenge, farbe, w, op) {
  if (!T.fein) return "";
  const wf = typeof winkel === "function" ? winkel : () => winkel;
  const lang = [];
  let ges = 0;
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; const L = Math.hypot(b[0] - a[0], b[1] - a[1]); lang.push(L); ges += L; }
  let d = "";
  for (let j = 0; j < n; j++) {
    let u = T.rnd() * ges, i = 0;
    while (u > lang[i]) { u -= lang[i]; i++; }
    const a = pts[i], b = pts[(i + 1) % pts.length], t = u / lang[i];
    const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
    const g = (wf(x, y) + (T.rnd() - 0.5) * 30) * Math.PI / 180, L = laenge * (0.6 + T.rnd() * 0.8);
    const x0 = x - Math.cos(g) * L * 0.5, y0 = y - Math.sin(g) * L * 0.5;
    d += "M" + z(x0, 0.1) + " " + z(y0, 0.1) + "l" + z(Math.cos(g) * L, 0.1) + " " + z(Math.sin(g) * L, 0.1);
  }
  return `<path d="${d}" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" fill="none" stroke-linecap="round"/>`;
}
/* Fellwirbel: Haare drehen sich um (x, y) */
function wirbel(T, x, y, r, n, farbe, w, op, laenge) {
  const kreis = [];
  for (let i = 0; i < 10; i++) kreis.push([x + Math.cos(i * 0.628) * r, y + Math.sin(i * 0.628) * r]);
  return haar(T, kreis, n, (px, py) => Math.atan2(py - y, px - x) * 180 / Math.PI + 70, laenge,
    { farben: [[farbe, 1, w, op]], streuung: 10, kruemmung: 0.35, szene: 0 });
}
/* Rinderbein-Kanten (Holstein-Kuh 145 cm): Vorderbein hinten hinab / vorn hinauf; Hinterbein ebenso; Klauenmitte */
const RV_H = [[165, -70], [166, -58], [167, -46], [166.2, -40], [166.8, -35], [168.6, -30], [168.8, -20], [167.6, -15.5], [170, -10.5], [172, -5.6, 1]];
const RV_V = [[178.9, -8.2, 1], [178.2, -12], [177, -16], [176.2, -23], [176.2, -30], [177.6, -35], [177.8, -40], [176.6, -50], [177.4, -62]];
const RH_H = [[17, -106], [21, -90], [24.6, -77], [25.4, -66], [23.4, -58], [24.6, -52.5], [28, -47], [29.4, -36], [29.6, -22], [28.6, -16], [31, -10.5], [33, -5.6, 1]];
const RH_V = [[39.9, -8.2, 1], [39.4, -12], [39, -16], [38.2, -24], [37.8, -38], [38.6, -46], [39.6, -52], [42, -58]];
/* Klaue in Rinderbein-Lage: Mitte so, dass Ballen und Kronrand an die Beinkanten passen */
const rKlaue = (T, xHinten, farbe, s = 1) => klaue(T, xHinten + 6.2 * s, 13 * s, 8 * s, farbe);

/* =====================================================================
   KUH (Deutsche Holstein, Schwarzbunt)
   ===================================================================== */
/* RECHERCHE Kuh (Deutsche Holsteins, Zuchtprogramm/Exterieur): Widerristhöhe 145–156 cm, 650–750 kg; großrahmig,
   „milchtypisch“: wenig Fleisch, kantige Knochen – Hüfthöcker und Sitzbeinhöcker deutlich, Kreuzbein, Hungergrube
   (Flankengrube) hinter der letzten Rippe, Rippen schräg und flach sichtbar, gerade Oberlinie, leicht abfallendes
   Becken, tiefer Rumpf (großer Pansen). Hals schlank, kleine Wamme. Euter: breit, hoch angesetzt hinten, Boden über
   dem Sprunggelenk, 4 Zitzen 5–6 cm, senkrecht; Milchader (Eutervene) am Bauch bis zum „Milchbrunnen“. Beine: Sprung-
   gelenk mäßig gewinkelt (~150°), Afterklauen hinten am Fesselkopf, Paarhufer-Klauen. Schwanz lang, Quaste bis unter
   das Sprunggelenk (oft weiß). Farbe: schwarze Platten mit unregelmäßigen, scharfen Rändern auf Weiß; Bauch, Beine und
   Schwanzquaste meist weiß; Kopf oft schwarz mit weißer Blesse. Hörner: die Rasse ist gehörnt, aber in deutschen
   Laufställen sind ~97 % der Rinder hornlos (als Kalb enthornt oder genetisch hornlos) → hornlos, Genick mit Haarschopf.
   Kopf ~ 50 cm, breite Stirn mit Haarwirbel, Ohren waagerecht seitlich, gelbe Ohrmarken (Pflicht in Deutschland, beide
   Ohren), großes dunkles Auge mit waagerechter Pupille und langen Wimpern, breites feuchtes Flotzmaul. */
function kuh(T) {
  FEIN = T.fein;
  const F = flecken(T, "#fff6e6");
  const weiss = T.lg("weiss", [[0, "#faf8f3"], [0.38, "#efebe3"], [0.6, "#d6d1c7"], [0.68, "#e2ded6"], [0.85, "#ebe7df"], [1, "#d2ccc1"]]);
  const fernW = T.lg("fernW", [[0, "#9a958b"], [0.45, "#c6c0b6"], [1, "#b4aea3"]]);
  const schwarz = "#1b1a1c", horn = "#2e2a28";
  let s = "";
  /* ---------- ferne Beine ---------- */
  const fv = [[150, -80]].concat(verschiebe(RV_H, -14), verschiebe(RV_V, -14), [[166, -80]]);
  const fh = [[44, -92]].concat(verschiebe(RH_H.slice(1), 18), verschiebe(RH_V, 18), [[66, -84], [72, -92]]);
  s += teil(T, fh, fernW, F.schatten(48, -40, 6, 30, 0.4), { ra: 0.4 }) + rKlaue(T, 51, horn) + afterklaue(46.8, -17, 1.7, "#3a3532");
  s += teil(T, fv, fernW, F.schatten(160, -30, 5, 26, 0.4), { ra: 0.4 }) + rKlaue(T, 158, horn) + afterklaue(153.8, -16.6, 1.7, "#3a3532");
  /* ---------- Rumpf mit Hals, Euter und nahen Beinen in EINEM Umriss ---------- */
  const rumpf = [[48, -153], [36, -150], [25, -151], [19, -146], [14.5, -137], [14.5, -126], [15.5, -116]].concat(RH_H, RH_V,
    [[45, -51.5], [56, -49.5], [68, -49.5], [77, -51.5], [82, -56], [86, -59.5], [96, -58], [118, -57], [140, -61], [158, -67]], RV_H, RV_V,
    [[180, -74], [183, -82], [185, -92], [190, -104], [198, -116], [205, -126], [211, -135], [219, -147], [212, -152], [196, -150], [178, -148],
     [160, -150], [148, -148], [128, -146], [108, -145], [88, -146], [70, -147], [58, -150]]);
  const dR = gl(rumpf, true, T.fein ? 0.2 : 1);
  /* Schecken: schwarze Platten, Rand unregelmäßig wie eine Landkarte und haarig (gestrichelter Saum) */
  const wuchs = richtung([[15, 95], [45, 100], [70, 160], [140, 168], [158, 105], [180, 100], [205, 112]]);
  const p1 = zackig(T, [[142, -160], [176, -160], [222, -160], [220, -130], [208, -124], [199, -108], [192, -98], [184, -102], [178, -114], [166, -119],
    [154, -112], [146, -121], [141, -138]], 1.5, 3);
  const p2 = zackig(T, [[92, -160], [132, -160], [134, -140], [129, -122], [135, -104], [126, -88], [112, -84], [100, -90], [92, -106], [86, -126]], 1.5, 3);
  const p3 = zackig(T, [[0, -160], [68, -160], [72, -142], [64, -124], [69, -110], [58, -100], [50, -97], [44, -86], [34, -80], [24, -84], [10, -100], [0, -112]], 1.5, 3);
  const p4 = zackig(T, [[150, -94], [160, -96], [162, -86], [154, -80], [148, -86]], 1, 2);
  const p5 = zackig(T, [[76, -101], [84, -103], [86, -93], [80, -89], [74, -93]], 1, 2);
  const weich = ` stroke="${schwarz}" stroke-width=".9" stroke-opacity=".5"`;
  const flk = [p1, p2, p3, p4, p5].map((p) => form(T.fein ? p : vieleck(p), schwarz, weich, 0.5)).join("");
  const euter = [[42, -54], [44, -52], [56, -49.5], [68, -49.5], [77, -51.5], [82, -56], [86, -60], [84, -66], [72, -70], [56, -68], [44, -64]];
  const innen =
    struktur(T, dR, "kfell", "#5a5650", 165, 0.1, [10, -165, 222, 0]) + flk +
    [[p1, 100], [p2, 80], [p3, 64], [p4, 22], [p5, 22]].map(([p, n]) => saum(T, p, n, wuchs, 1.5, schwarz, 0.24, 0.6)).join("") +
    /* Euter: rosa Haut, oben weich in das weiße Bauchfell übergehend; Adern */
    form(euter, T.lg("euter", [[0, "#e9c0b4", 0], [0.4, "#e9c0b4", 0.9], [1, "#c9968a", 1]]), "", 0.5) +
    F.licht(66, -58, 10, 4, 0.55) + F.schatten(62, -50, 22, 3, 0.45) +
    fein(T, strich([[84, -60], [76, -58], [68, -60.5], [60, -57]], "#9a6a70", 0.7, 0.35) + strich([[72, -64], [64, -61.5], [54, -63]], "#9a6a70", 0.6, 0.3)) +
    /* Haare: grau im Weiß, silbrig im Schwarz (Glanz) */
    haar(T, rumpf, 170, wuchs, 2.2, { farben: [["#7a756c", 1, 0.16, 0.22]], streuung: 16, szene: 0.04 }) +
    [p1, p2, p3].map((p) => haar(T, p, 50, wuchs, 2.2, { farben: [["#8a8c96", 1, 0.15, 0.3]], streuung: 16, szene: 0.04 })).join("") +
    wirbel(T, 74, -114, 4, 24, "#555", 0.15, 0.4, 2) + wirbel(T, 158, -132, 4, 20, "#8a8c96", 0.15, 0.4, 2) +
    /* Knochenbau (milchtypisch): Hüfthöcker, Sitzbeinhöcker, Hungergrube, Rippen, Schulterblatt, Ellbogen, Hals */
    F.licht(48, -148, 7, 4, 0.5) + F.schatten(52, -137, 8, 6, 0.5) + F.licht(17, -138, 3, 5, 0.45) + F.schatten(23, -130, 4, 8, 0.45) +
    F.schatten(72, -130, 8, 14, 0.5, -20) + F.kante(62, -142, 58, -112, 2.6, 0.5) +
    [0, 1, 2, 3, 4].map((i) => F.rinne(114 + i * 8, -122, 106 + i * 8, -90, 1.6, 0.26)).join("") +
    [0, 1, 2, 3, 4].map((i) => F.kante(118 + i * 8, -124, 110 + i * 8, -94, 1.2, 0.14)).join("") +
    F.rinne(150, -142, 178, -104, 2.2, 0.42) + F.rinne(160, -78, 174, -96, 2.2, 0.4) +
    F.rinne(28, -140, 36, -100, 2, 0.35) + F.rinne(56, -86, 64, -110, 2, 0.32) +
    F.schatten(110, -60, 48, 8, 0.8) + F.schatten(170, -71, 9, 9, 0.5) + F.schatten(196, -114, 7, 18, 0.45, 30) +
    F.licht(198, -141, 16, 5, 0.35, -5) + F.licht(118, -141, 32, 6, 0.4) + F.licht(200, -132, 14, 4, 0.3, 40) + F.licht(166, -136, 7, 14, 0.3, -25) +
    F.licht(40, -128, 14, 6, 0.3, 70) +
    /* Kniefalte und Vorderkante des nahen Hinterbeins vor dem Euter */
    F.rinne(43, -58, 52, -73, 1.6, 0.55) + F.rinne(52, -73, 60, -83, 1.4, 0.45) +
    /* Milchader (Eutervene) am Bauch, Milchbrunnen */
    fein(T, strich([[86, -60.5], [96, -61.5], [104, -59.5], [112, -62.5], [122, -60.5]], "#8a8278", 1.6, 0.35) + F.schatten(124, -61.5, 2.4, 1.6, 0.3)) +
    /* Läufe: Sehne (Licht hinten), Röhre vorn im Schatten, Gelenke */
    F.rinne(168.4, -31, 168.6, -18, 0.9, 0.5) + F.rinne(29.6, -44, 30, -20, 0.9, 0.5) + F.schatten(177, -28, 2, 14, 0.4) + F.schatten(38.6, -30, 2, 16, 0.4) +
    F.licht(25.6, -58, 1.6, 3.4, 0.5) + F.licht(176, -37, 1.6, 2.6, 0.45) + F.schatten(24, -72, 2, 8, 0.4);
  s += teil(T, dR, weiss, innen, { ra: 0.4 });
  s += rKlaue(T, 33, horn) + afterklaue(28.8, -17, 1.9, "#4a4440") + rKlaue(T, 172, horn) + afterklaue(167.8, -16.6, 1.9, "#4a4440");
  /* Zitzen: vorn und hinten (nah), dahinter die ferne Vorderzitze */
  const zitze = (x, y, f) => teil(T, [[x - 1.9, y], [x + 1.9, y], [x + 1.7, y + 4.5], [x + 1, y + 6.6], [x - 1, y + 6.6], [x - 1.7, y + 4.5]], f,
    F.licht(x - 0.8, y + 2.5, 0.7, 2.4, 0.6), { ra: 0.5, q: 0.1 });
  s += zitze(71, -51, "#c08a80") + zitze(77.5, -52.5, "#d9a196") + zitze(52, -50.6, "#d9a196");
  /* ---------- Schwanz: am Schwanzansatz zwischen den Sitzbeinhöckern, liegt an der Hinterseite an; weiße Quaste ---------- */
  const schwanz = [[27, -152], [21.6, -150.4], [17.6, -144], [14.6, -130], [13.4, -100], [13.4, -70], [13.8, -52], [16.8, -52], [17, -70], [17.4, -100],
    [18.6, -126], [21.6, -139], [27, -146]];
  s += teil(T, schwanz, T.lg("schw", [[0, schwarz], [0.6, "#2a292b"], [0.82, "#cfcac0"], [1, "#e8e4dc"]]),
    F.licht(15, -110, 1.4, 22, 0.4) + F.schatten(17, -80, 1.4, 30, 0.5), { ra: 0.4 });
  const quaste = [[13.2, -56], [17.4, -56], [19.6, -42], [20.6, -26], [19.4, -12], [17.4, -17], [15.4, -8], [13.4, -15], [11, -11], [10.6, -26], [11.8, -42]];
  s += teil(T, quaste, "#ebe6dc", haar(T, quaste, 70, (x) => 90 + (x - 15) * 2, 14,
    { farben: [["#a8a092", 1, 0.3, 0.55], ["#fff", 0.6, 0.25, 0.6]], streuung: 8, kruemmung: 0.2, szene: 0.12 }), { ra: 0.35 });
  /* ---------- Kopf: x Genick → Flotzmaul, y zur Unterseite; 60° geneigt ---------- */
  const G = [223, -150], W = 60, K = (pts) => dreh(pts, G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  const kopf = K([[-1, -3], [7, -5.8], [16, -6.8], [28, -5.4], [40, -4.4], [46, -3.4], [50.5, -0.8], [52, 4], [51.6, 9], [49.6, 12.4], [47, 13.6], [45, 15.8],
    [40, 17], [32, 16], [24, 18.4], [15, 21], [8, 21.4], [2, 18], [-2, 8]]);
  const dK = gl(kopf, true, 0.1);
  const blesse = K([[2, -8], [10, -8.6], [22, -8], [36, -6.6], [46, -4.4], [53, 0], [53, 6], [50, 9], [46.6, 6.4], [43.6, 1.2], [36, -1.4], [26, -2],
    [18, -1.6], [12, -2.8], [6, -3.4]]);
  const flotz = K([[45.4, -3.2], [50.6, -0.8], [52.4, 4], [51.8, 9], [49.6, 12.2], [46.4, 11.6], [44.8, 6.4], [44.4, 1]]);
  const kInnen = form(blesse, "#f3efe8", ` stroke="#f3efe8" stroke-width=".7" stroke-opacity=".5"`, 0.1) + saum(T, blesse, 60, W, 1.4, "#1b1a1c", 0.22, 0.7) +
    F.licht(...P(26, 4), 14, 7, 0.4, W) + F.schatten(...P(10, 16), 9, 5, 0.6, W) + F.schatten(...P(38, 12), 9, 4, 0.5, W) +
    F.licht(...P(14, 7), 6, 4, 0.3, W) + F.rinne(...P(22, 11), ...P(37, 10), 1.4, 0.55) + F.kante(...P(22, 9), ...P(36, 8), 1.2, 0.4) +
    haar(T, kopf, 90, W, 1.4, { farben: [["#6e7078", 1, 0.13, 0.35]], streuung: 14, szene: 0.08 }) +
    haar(T, blesse, 50, W, 1.3, { farben: [["#9a958c", 1, 0.13, 0.35]], streuung: 14, szene: 0.08 }) +
    wirbel(T, ...P(12, -5), 2.6, 22, "#a8a399", 0.14, 0.6, 1.5) +
    /* Flotzmaul: rosa, feucht, genarbt; Nasenloch; Glanz */
    form(flotz, T.lg("flotz", [[0, "#e8b4ae"], [1, "#c98880"]]), "", 0.1) +
    fein(T, `<g opacity=".35">${haar(T, flotz, 40, 0, 0.5, { farben: [["#9a5a58", 1, 0.25, 0.6]], streuung: 180, kruemmung: 0 })}</g>`) +
    form(K([[48.6, 1], [51, 2.4], [51, 6.2], [49.6, 5.6], [48.2, 3.4]]), "#3a1c1c", "", 0.1) +
    F.licht(...P(50.4, 0.6), 1.6, 0.8, 0.9, W) + F.licht(...P(47, 8), 1.4, 0.7, 0.6, W);
  s += teil(T, dK, schwarz, kInnen, { ra: 0.4 });
  s += strich(K([[45.6, 12.6], [49, 12.2]]), "#000", 0.7, 0.6, 0.1);
  if (T.fein) {
    const [mx, my] = P(46, 14);
    s += T.schnurrhaare(mx, my, 6, 2.6, W + 60, 50, "#e8e2d8", 0.1);
  }
  /* Auge: groß, seitlich vorstehend, waagerechte Pupille, lange Wimpern */
  const A = P(15.5, 1.8);
  s += F.licht(A[0] - 1, A[1] - 2.8, 4.4, 2.4, 0.3, W - 60) + T.augeReal(A[0], A[1], 2.5, { iris: "#4a2a14", iris2: "#1a0c06", pupille: "quer", offen: 0.7,
    winkel: 26, wimpern: 15, wimpernLaenge: 0.85, wimpernFarbe: "#0a0808", haut: "#000" });
  /* Genick (hornlos): Haarschopf */
  s += wirbel(T, ...P(3, -3), 3, 26, "#5a5c64", 0.18, 0.55, 2.2);
  /* nahes Ohr: waagerecht seitlich-hinten, Innenseite hell behaart, gelbe Ohrmarke (Pflicht in Deutschland) */
  const OX = P(7, 6), OW = 14;
  const ohr = dreh([[0, -3], [-7, -5.6], [-15, -6.4], [-22, -4.6], [-25, -1.4], [-22, 2.4], [-14, 4.6], [-6, 4.4], [0, 3]], OX[0], OX[1], OW);
  const ohrIn = dreh([[-4, 0.4], [-10, -0.4], [-17, -0.2], [-22.6, 0.6], [-20, 3], [-12, 4], [-5, 3.4]], OX[0], OX[1], OW);
  s += teil(T, ohr, schwarz, form(ohrIn, "#5a5456", "", 0.1) +
    haar(T, ohrIn, 40, 180 + OW, 3.2, { farben: [["#ece6dc", 1, 0.14, 0.75]], streuung: 22, kruemmung: 0.3, szene: 0.3 }) +
    F.licht(...dreh([[-12, -3]], OX[0], OX[1], OW)[0], 9, 2.2, 0.4, OW), { ra: 0.45, q: 0.1 });
  const m = dreh([[-13, 2], [-13, 5]], OX[0], OX[1], OW);
  s += strich([m[0], m[1]], "#e0b000", 0.8, 0.9, 0.1);
  s += teil(T, [[m[1][0] - 2.8, m[1][1]], [m[1][0] + 2.8, m[1][1]], [m[1][0] + 3.2, m[1][1] + 6.5], [m[1][0] - 2.4, m[1][1] + 6.8]].map((p) => p.concat([1])),
    T.lg("marke", [[0, "#ffd84a"], [1, "#e0a800"]]), fein(T, `<text x="${z(m[1][0] - 2, 0.1)}" y="${z(m[1][1] + 4.8, 0.1)}" font-size="2.6" font-family="Arial" font-weight="700" fill="#2a2000">DE</text>`),
    { ra: 0.5, rw: 0.4, q: 0.1 });
  return { svg: s, box: [9, -160, 237, 0] };
}

/* =====================================================================
   KALB (Holstein-Kalb, wenige Wochen alt)
   ===================================================================== */
/* RECHERCHE Kalb: Holstein-Kalb bei Geburt 40–45 kg, ~75 cm Widerrist; mit 6–8 Wochen ~85 cm, ~80 kg. Proportionen
   anders als bei der Kuh: lange, dünne Beine (Bauch auf ~55 % der Widerristhöhe), knubbelige Gelenke (Vorderfuß-
   wurzel, Fesselköpfe), kurzer Rumpf, großer Kopf mit kurzem Gesicht, großen Augen und breiter Stirn, große Ohren
   (je eine gelbe Ohrmarke, Pflicht ab Geburt), kurzer Hals; Fell etwas länger und weicher (flauschig); Schwanz dünn
   mit kleiner Quaste; kein Euter. Hornknospen werden in den ersten Wochen entfernt (oder genetisch hornlos) →
   flache Stirn. Schwarzbunt: schwarze Platten, Bauch, Beine und Blesse weiß. */
const KV_H = [[80, -45], [81, -34], [80.4, -25.4], [81, -22], [82.2, -18], [82.4, -11], [81.6, -7.8], [82.8, -5], [84, -3.2, 1]];
const KV_V = [[88, -4.5, 1], [88.2, -7], [87.8, -9], [87.2, -14], [87.4, -19], [88.6, -23.2], [88.8, -26.4], [88, -32], [88.4, -40]];
const KH_H = [[9.5, -66], [11.4, -57], [14.6, -48], [16.4, -40], [15, -33.4], [15.8, -30], [17.6, -26.6], [18.2, -18], [18.2, -11], [17.6, -7.8], [18.6, -5], [19.8, -3.2, 1]];
const KH_V = [[23.9, -4.5, 1], [23.8, -7], [23.4, -9], [22.8, -14], [22.6, -22], [23.4, -27], [24.2, -31], [26, -36], [29, -41]];
function kalb(T) {
  FEIN = T.fein;
  const F = flecken(T, "#fff6e6");
  const weiss = T.lg("weiss", [[0, "#faf8f3"], [0.38, "#efebe3"], [0.55, "#d8d3c9"], [0.62, "#e4e0d8"], [0.85, "#ece8e0"], [1, "#d4cec3"]]);
  const fernW = T.lg("fernW", [[0, "#9a958b"], [0.45, "#c6c0b6"], [1, "#b4aea3"]]);
  const schwarz = "#1c1b1d", horn = "#3a3533";
  const k = 0.55;
  let s = "";
  /* ferne Beine */
  const fv = [[74, -48]].concat(verschiebe(KV_H, -8), verschiebe(KV_V, -8), [[84, -48]]);
  const fh = [[24, -52]].concat(verschiebe(KH_H.slice(2), 9), verschiebe(KH_V, 9), [[42, -48]]);
  s += teil(T, fh, fernW, F.schatten(28, -20, 4, 18, 0.4), { ra: 0.4 }) + rKlaue(T, 28.8, horn, k) + afterklaue(26.4, -8.6, 1.1, "#4a4440");
  s += teil(T, fv, fernW, F.schatten(80, -16, 3, 16, 0.4), { ra: 0.4 }) + rKlaue(T, 76, horn, k) + afterklaue(73.4, -8.6, 1.1, "#4a4440");
  /* Rumpf mit Hals und nahen Beinen */
  const rumpf = [[28, -82.6], [20, -81.4], [14, -80.6], [10.4, -77], [9, -72]].concat(KH_H, KH_V,
    [[33, -45], [38, -46], [50, -44], [62, -43], [74, -45]], KV_H, KV_V,
    [[90, -47], [92.4, -53], [95, -59], [99, -64], [105, -69], [111, -73], [118, -84], [110, -86.4], [98, -84.6], [88, -81.4], [80, -79.6],
     [62, -78.4], [45, -79.4]]);
  const dR = gl(rumpf, true, T.fein ? 0.1 : 0.5);
  const wuchs = richtung([[10, 95], [25, 100], [36, 160], [74, 168], [82, 105], [95, 100], [110, 112]]);
  const p1 = zackig(T, [[70, -92], [124, -92], [116, -70], [106, -64], [100, -56], [94, -54], [90, -60], [84, -62], [76, -60], [72, -70], [68, -80]], 0.9, 3);
  const p2 = zackig(T, [[30, -92], [56, -92], [58, -78], [54, -66], [58, -56], [50, -51], [42, -55], [34, -58], [28, -70]], 0.9, 3);
  const p3 = zackig(T, [[0, -92], [16, -92], [18, -80], [14, -70], [12, -60], [6, -60], [0, -70]], 0.8, 2);
  const flk = [p1, p2, p3].map((p) => form(T.fein ? p : vieleck(p), schwarz, ` stroke="${schwarz}" stroke-width=".6" stroke-opacity=".5"`, 0.2)).join("");
  const innen =
    struktur(T, dR, "kafell", "#5a5650", 165, 0.12, [6, -92, 122, 0]) + flk +
    [[p1, 80], [p2, 60], [p3, 30]].map(([p, n]) => saum(T, p, n, wuchs, 1.3, schwarz, 0.18, 0.6)).join("") +
    /* flauschiges Kalbsfell: etwas längere, weiche Haare */
    haar(T, rumpf, 170, wuchs, 1.8, { farben: [["#7a756c", 1, 0.13, 0.25]], streuung: 22, kruemmung: 0.3, szene: 0.05 }) +
    [p1, p2].map((p) => haar(T, p, 50, wuchs, 1.7, { farben: [["#8a8c96", 1, 0.12, 0.32]], streuung: 22, kruemmung: 0.3, szene: 0.05 })).join("") +
    wirbel(T, 36, -64, 2.4, 18, "#666", 0.12, 0.45, 1.3) +
    /* Bau: Hüfthöcker, Rippen (schlank), Bauch rund, Schulter, Gelenke (knubbelig) */
    F.licht(28, -79, 5, 3, 0.45) + F.schatten(30, -72, 5, 4, 0.4) + F.licht(15, -70, 4, 8, 0.4, 8) +
    F.schatten(55, -46, 26, 5, 0.75) + F.schatten(80, -48, 5, 5, 0.5) + F.schatten(102, -66, 4, 9, 0.45, 30) +
    F.licht(60, -72, 20, 5, 0.45) + F.licht(85, -66, 5, 9, 0.35, -25) + F.rinne(80, -74, 90, -54, 1.4, 0.4) +
    [0, 1, 2, 3].map((i) => F.rinne(58 + i * 5, -66, 54 + i * 5, -50, 1, 0.22)).join("") +
    F.rinne(20, -40, 25, -46, 1, 0.45) + F.rinne(25, -46, 31, -52, 1, 0.35) +
    F.licht(87, -24, 1.4, 2.2, 0.55) + F.licht(83, -24.6, 1, 1.6, 0.4) + F.licht(16.6, -33, 1.2, 2.2, 0.5) +
    F.rinne(81.6, -17, 82, -9, 0.6, 0.45) + F.rinne(17.6, -25, 18, -9, 0.6, 0.45) +
    F.schatten(88, -15, 1.2, 8, 0.35) + F.schatten(23, -16, 1.2, 9, 0.35) + F.licht(17.6, -8, 1.2, 1.2, 0.4) + F.licht(81.8, -8, 1.2, 1.2, 0.4);
  s += teil(T, dR, weiss, innen, { ra: 0.4, rw: 0.6 });
  s += rKlaue(T, 19.8, horn, k) + afterklaue(17.6, -8.4, 1.2, "#4a4440") + rKlaue(T, 84, horn, k) + afterklaue(81.8, -8.4, 1.2, "#4a4440");
  /* Schwanz: dünn, kleine Quaste */
  const schwanz = [[15.6, -82], [12, -80.6], [9.6, -75], [8.6, -62], [8.6, -44], [10.2, -44], [10.6, -62], [11.6, -74], [15, -78]];
  s += teil(T, schwanz, T.lg("schw", [[0, schwarz], [0.4, "#2c2b2d"], [0.62, "#d8d3c9"], [1, "#e8e4dc"]]), F.licht(9.4, -62, 0.6, 10, 0.4), { ra: 0.4, rw: 0.5, q: 0.1 });
  const quaste = [[8.2, -46], [10.6, -46], [12, -38], [11.6, -30], [10.4, -33], [9.2, -28.6], [8, -32], [7.2, -38]];
  s += teil(T, quaste, "#ebe6dc", haar(T, quaste, 30, 92, 6, { farben: [["#a8a092", 1, 0.18, 0.55]], streuung: 10, szene: 0.1 }), { ra: 0.35, rw: 0.5, q: 0.1 });
  /* Kopf: groß, kurzes Gesicht, breite Stirn; 55° geneigt */
  const G = [119.4, -86], W = 55, K = (pts) => dreh(pts, G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  const kopf = K([[-1.4, -2.6], [4.6, -4.8], [10, -5.4], [17, -4.6], [23, -3.4], [27, -2], [30, 0.4], [31, 3.4], [30.4, 6.4], [28.8, 8.2], [27.2, 8.8], [25.8, 10.2],
    [22.6, 10.8], [18, 10.2], [13, 11.8], [8, 12.6], [3, 11.2], [-1, 6.4]]);
  const dK = gl(kopf, true, 0.1);
  const blesse = K([[0, -6], [8, -6.4], [16, -5.8], [24, -4.4], [31, -0.4], [31.6, 4.6], [29.8, 7], [27.6, 5.6], [26, 2], [20, 0.6], [16, 1.2], [12, -0.6], [7, -2], [3, -2.4]]);
  const flotz = K([[26.6, -2.2], [30.2, 0.2], [31.4, 3.4], [30.8, 6.4], [29, 8.2], [27.6, 7.4], [26.6, 4], [26.2, 0.8]]);
  const kInnen = form(blesse, "#f4f0e9", ` stroke="#f4f0e9" stroke-width=".5" stroke-opacity=".5"`, 0.1) + saum(T, blesse, 50, W, 1, schwarz, 0.16, 0.6) +
    F.licht(...P(14, 3), 8, 4, 0.4, W) + F.schatten(...P(7, 9), 5, 3.4, 0.55, W) + F.schatten(...P(22, 7), 5, 2.4, 0.45, W) +
    F.rinne(...P(13, 6.4), ...P(22, 6), 0.9, 0.45) +
    haar(T, kopf, 70, W, 1, { farben: [["#6e7078", 1, 0.1, 0.35]], streuung: 16, szene: 0.08 }) +
    haar(T, blesse, 40, W, 0.9, { farben: [["#9a958c", 1, 0.1, 0.35]], streuung: 16, szene: 0.08 }) +
    wirbel(T, ...P(7, -3.6), 1.8, 18, "#a8a399", 0.1, 0.6, 1) +
    form(flotz, T.lg("flotz", [[0, "#efc0ba"], [1, "#d29a92"]]), "", 0.1) +
    fein(T, `<g opacity=".3">${haar(T, flotz, 26, 0, 0.35, { farben: [["#9a5a58", 1, 0.18, 0.6]], streuung: 180, kruemmung: 0 })}</g>`) +
    form(K([[28.8, 0.8], [30.6, 1.8], [30.6, 4.2], [29.6, 3.8], [28.6, 2.4]]), "#4a2424", "", 0.1) + F.licht(...P(30, 0.6), 1, 0.5, 0.9, W);
  s += teil(T, dK, schwarz, kInnen, { ra: 0.4, rw: 0.6 });
  s += strich(K([[26.6, 9], [29, 8.6]]), "#000", 0.5, 0.6, 0.1);
  /* Auge: groß (Kalb), waagerechte Pupille, lange Wimpern */
  const A = P(9.6, 1.4);
  s += F.licht(A[0] - 0.6, A[1] - 1.9, 2.8, 1.5, 0.3, W - 60) + T.augeReal(A[0], A[1], 1.75, { iris: "#4a2a14", iris2: "#1a0c06", pupille: "quer", offen: 0.74,
    winkel: 24, wimpern: 13, wimpernLaenge: 0.85, wimpernFarbe: "#0a0808", haut: "#000" });
  /* Ohr: groß, waagerecht nach hinten, Innenseite mit hellem Haar, Ohrmarke */
  const OX = P(4.4, 4), OW = 10;
  const ohr = dreh([[0, -2], [-5, -4.2], [-10.5, -4.8], [-15, -3.4], [-17, -1], [-15, 1.8], [-9.6, 3.4], [-4, 3.2], [0, 2.2]], OX[0], OX[1], OW);
  const ohrIn = dreh([[-3, 0.3], [-7, -0.2], [-12, 0], [-15.4, 0.6], [-13.6, 2.2], [-8.6, 2.8], [-3.6, 2.4]], OX[0], OX[1], OW);
  s += teil(T, ohr, schwarz, form(ohrIn, "#5a5456", "", 0.1) +
    haar(T, ohrIn, 30, 180 + OW, 2.2, { farben: [["#ece6dc", 1, 0.11, 0.75]], streuung: 22, kruemmung: 0.3, szene: 0.3 }) +
    F.licht(...dreh([[-8, -2]], OX[0], OX[1], OW)[0], 6, 1.5, 0.4, OW), { ra: 0.45, rw: 0.5, q: 0.1 });
  const m = dreh([[-8.6, 1.4], [-8.6, 3.4]], OX[0], OX[1], OW);
  s += strich([m[0], m[1]], "#e0b000", 0.5, 0.9, 0.1);
  s += teil(T, [[m[1][0] - 2, m[1][1]], [m[1][0] + 2, m[1][1]], [m[1][0] + 2.3, m[1][1] + 4.6], [m[1][0] - 1.7, m[1][1] + 4.8]].map((p) => p.concat([1])),
    T.lg("marke", [[0, "#ffd84a"], [1, "#e0a800"]]), "", { ra: 0.5, rw: 0.3, q: 0.1 });
  return { svg: s, box: [7, -92, 137, 0] };
}

module.exports = [
  { id: "kalb", de: "das Kalb", syl: "KALB", it: "il vitello", itSyl: "vi-TEL-lo", en: "calf",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 1.3, hoehe: 0.92, zeichne: kalb },
  { id: "kuh", de: "die Kuh", syl: "KUH", it: "la vacca", itSyl: "VAC-ca", en: "cow",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 2.21, hoehe: 1.63, zeichne: kuh },
  { id: "pferd", de: "das Pferd", syl: "PFERD", it: "il cavallo", itSyl: "ca-VAL-lo", en: "horse",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 2.69, hoehe: 2.15, zeichne: pferd },
];
