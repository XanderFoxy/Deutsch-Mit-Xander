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
/* Kopf (oder anderes Teil, das in den Hals übergeht): Füllung ohne geschlossenen Rand, nur die Außenkontur
   pts[i0..i1] als feine Linie – am Hals kein „Aufkleber“-Rand. */
function kopfTeil(T, pts, fill, innen, i0, i1, o = {}) {
  return teil(T, gl(pts, true, 0.1), fill, innen, { rand: false }) +
    `<path d="${gl(pts.slice(i0, i1 + 1), false, 0.1)}" fill="none" stroke="${o.rc || "#1a0c05"}" stroke-opacity="${o.ra != null ? o.ra : 0.42}" stroke-width="${o.rw || 0.8}" stroke-linecap="round"/>`;
}
/* Rumpf-Licht nach der Regel: Rückenkante hell, Kernschatten-Band im unteren Drittel, Bodenreflex am Bauch */
function rumpfLicht(F, x0, x1, yR, yB, st = 1) {
  const h = yB - yR, xm = (x0 + x1) / 2, rx = (x1 - x0) / 2;
  return F.licht(xm, yR + h * 0.1, rx * 0.95, h * 0.11, 0.5 * st) + F.schatten(xm, yR + h * 0.74, rx * 1.02, h * 0.13, 0.62 * st) +
    F.glanz(xm, yB - h * 0.03, rx * 0.85, h * 0.05, 0.4 * st);
}
/* Augenhöhle: Knochenwulst oben (Licht), Schatten auf dem oberen Drittel, weiche Grube rund ums Auge */
function augenhoehle(F, x, y, r, g = 0) {
  const c = Math.cos(rad(g)), si = Math.sin(rad(g)), Q = (dx, dy) => [x + dx * c - dy * si, y + dx * si + dy * c];
  return F.schatten(x, y, r * 2.3, r * 1.7, 0.45, g) + F.schatten(...Q(0, -r * 0.8), r * 1.8, r * 0.9, 0.6, g) + F.kante(...Q(-r * 2, -r * 1.9), ...Q(r * 1.8, -r * 1.7), r * 0.55, 0.55);
}
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
function flecken(T, glanzFarbe = "#ffe2b8", schattenFarbe = "#000") {
  const hell = T.rg("hell", [[0, "#fff", 0.5], [1, "#fff", 0]]);
  const warm = T.rg("warm", [[0, glanzFarbe, 0.6], [0.5, glanzFarbe, 0.25], [1, glanzFarbe, 0]]);
  const dunkel = T.rg("dunkel", [[0, schattenFarbe, 0.5], [1, schattenFarbe, 0]]);
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
/* Bein plastisch: Licht an der Hinterkante (Licht von links), Kernschatten an der Vorderkante, Reflexlicht ganz vorn.
   hinten: Kante oben→unten, vorn: Kante unten→oben. s = Größe. */
function plastik(F, hinten, vorn, s = 1, op = 1) {
  if (!FEIN) return "";
  let r = "";
  const seg = (pts, fn, dx, b, o) => {
    let a = pts[0];
    for (let i = 1; i < pts.length; i++) {
      const c = pts[i];
      if (Math.max(a[1], c[1]) > -5 * s) { a = c; continue; }
      if (Math.hypot(c[0] - a[0], c[1] - a[1]) < 7 * s && i < pts.length - 1) continue;
      r += fn(a[0] + dx, a[1], c[0] + dx, c[1], b, o * op);
      a = c;
    }
  };
  seg(hinten, F.kante, 1.5 * s, 1.3 * s, 0.55);
  seg(vorn, F.rinne, -1.9 * s, 1.6 * s, 0.5);
  seg(vorn, F.kante, -0.5 * s, 0.5 * s, 0.25);
  return r;
}
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
const KAMM = [[239, -205], [229, -210.6], [215, -210], [201, -203], [186, -193], [171, -180], [160, -171]];
function pferd(T) {
  FEIN = T.fein;
  const F = flecken(T, "#ffcf98");
  const fell = T.lg("fell", [[0, "#9c5427"], [0.28, "#86431e"], [0.5, "#6a3015"], [0.62, "#542610"], [1, "#3a1a0a"]]);
  const fern = T.lg("fern", [[0, "#6a3417"], [0.3, "#562a12"], [0.5, "#1e1612"], [1, "#16110e"]]);
  const schwarz = "#1c1512";
  const stiefel = T.lg("stiefel", [[0, schwarz, 0], [0.2, schwarz, 0.35], [0.36, schwarz, 0.97], [1, schwarz, 0.97]]);
  let s = "";
  /* ---------- ferne Beine (Innenseite, im Schatten; Kastanien) ---------- */
  const fv = [[146, -104]].concat(verschiebe(VB_H, -15), verschiebe(VB_V, -15), [[160, -104]]);
  const fh = [[56, -104]].concat(verschiebe(HB_H.slice(1), 22), verschiebe(HB_V, 22), [[76, -104]]);
  s += teil(T, fh, fern, plastik(F, verschiebe(HB_H.slice(1), 22), verschiebe(HB_V, 22), 1, 0.8) + form([[54.4, -56.6], [56.4, -57.2], [56.6, -53.8], [54.6, -53.4]], "#1e1814", ` stroke="#3a322c" stroke-width=".3"`, 0.1) +
    "", { ra: 0.4 }) + huf(T, 68, 13, 9, "#1c1714");
  s += teil(T, fv, fern, plastik(F, verschiebe(VB_H, -15), verschiebe(VB_V, -15), 1, 0.8) + form([[145.4, -71], [147.4, -71.8], [147.6, -67.2], [145.6, -66.8]], "#1e1814", ` stroke="#3a322c" stroke-width=".3"`, 0.1) +
    "", { ra: 0.4 }) + huf(T, 162.5, 13, 9, "#1c1714");
  /* ---------- Schweif: Rübe am Kruppenende, lange Strähnen (über den Rand hinaus) ---------- */
  const schweif = [[38, -163], [25, -162], [16, -153], [10, -131], [7, -104], [5, -80], [4.5, -62], [6, -49, 1], [9, -55], [12, -45, 1], [14.5, -53],
    [17.5, -47, 1], [20, -58], [22, -84], [21, -108], [23, -132], [28, -150]];
  const sw = (x, y) => 93 + (y < -140 ? 45 : 0) + (x - 14) * 0.35;
  s += teil(T, schweif, schwarz, haar(T, schweif, 92, sw, 26,
    { farben: [["#000", 2, 0.5, 0.55], ["#4a3a32", 1.4, 0.35, 0.5], ["#8a7a70", 0.5, 0.25, 0.35]], streuung: 8, kruemmung: 0.12, szene: 0.08 }), { ra: 0.4 });
  s += haar(T, [[7, -84], [20, -84], [20, -58], [6, -58]], 34, sw, 10, { farben: [["#1c1512", 1, 0.4, 0.6], ["#4a3a32", 0.6, 0.3, 0.45]], streuung: 8, kruemmung: 0.15, szene: 0.1 });
  /* ---------- Rumpf: Hals, Rumpf und nahe Beine in EINEM Umriss (keine Nähte an den Gelenken) ---------- */
  const rumpf = [[58, -168], [40, -164], [28, -156], [20, -142], [17, -126], [20, -108]].concat(HB_H, HB_V,
    [[56, -90], [66, -101], [74, -107], [84, -104], [104, -96], [130, -92], [150, -92], [156, -90]], VB_H, VB_V,
    [[172, -84], [176, -102], [184, -116], [189, -127], [194, -140], [203, -155], [213, -168], [220, -179], [227, -190], [234, -200]], KAMM, [[150, -167], [140, -161], [120, -158], [92, -161], [72, -166]]);
  const dR = gl(rumpf, true, T.fein ? 0.2 : 1);
  const wuchs = richtung([[20, 96], [50, 100], [75, 150], [140, 168], [158, 110], [185, 100], [205, 108], [240, 112]], (x, y) => (y > -60 ? 90 - 120 * 0 : 0));
  const lichtSeite = [[30, -158], [60, -169], [92, -162], [120, -159], [148, -163], [164, -172], [200, -202], [229, -210], [224, -192], [196, -176],
    [172, -140], [150, -132], [100, -136], [60, -142], [32, -132]];
  const innen =
    struktur(T, dR, "fell", "#2a0f04", 168, 0.1, [15, -218, 250, 0]) +
    /* Muskelmassen (Licht links oben): Kruppe, Hinterbacke, Rippenwand, Schulter, Trizeps, Unterarm, Armkopfmuskel, Unterschenkel */
    rumpfLicht(F, 20, 190, -165, -92) + F.glanz(62, -150, 34, 15, 0.7, 12) + F.glanz(34, -118, 9, 20, 0.45, 8) + F.glanz(112, -151, 34, 8, 0.6, 2) +
    F.glanz(171, -150, 11, 22, 0.6, -24) + F.glanz(161, -112, 8, 11, 0.45) + F.glanz(165, -80, 4, 13, 0.4) + F.glanz(206, -190, 22, 7, 0.55, -36) +
    F.glanz(48, -84, 5, 12, 0.35, 25) +
    F.schatten(118, -94, 46, 13, 0.8) + F.schatten(151, -126, 7, 17, 0.4, -10) + F.schatten(178, -112, 9, 6, 0.45) +
    F.schatten(201, -148, 10, 22, 0.5, 40) + F.schatten(86, -121, 10, 17, 0.32) + F.schatten(80, -134, 4, 4, 0.35) +
    F.schatten(59, -101, 7, 10, 0.32) + F.schatten(224, -184, 8, 7, 0.5) + F.schatten(176, -76, 4, 14, 0.4) + F.schatten(46, -66, 3, 10, 0.4) +
    /* weiche Muskelrinnen (breit, schwach): Schulterblattgräte, Trizepsrand, Hüfthöcker, Kniefalte, Hosenrinne, Drosselrinne */
    F.rinne(166, -162, 186, -124, 2.6, 0.4) + F.kante(164, -160, 182, -126, 2.4, 0.45) +
    F.rinne(152, -100, 166, -119, 2.4, 0.4) + F.rinne(162, -119, 182, -114, 2.2, 0.35) +
    F.rinne(73, -149, 81, -134, 2.2, 0.4) + F.kante(70, -152, 78, -146, 2, 0.6) +
    F.rinne(86, -104, 64, -127, 2.6, 0.38) +
    F.rinne(34, -154, 42, -110, 2.4, 0.35) + F.rinne(42, -110, 46, -88, 2, 0.3) +
    F.rinne(194, -150, 218, -181, 2.2, 0.42) + F.kante(190, -152, 214, -185, 2.4, 0.4) +
    F.rinne(148, -99, 98, -106, 1.4, 0.3) +
    /* Haar für Haar: dunkle Haare überall, helle Spitzen oben am Licht */
    haar(T, rumpf, 185, wuchs, 2.3, { farben: [["#3a1606", 1, 0.18, 0.24]], streuung: 16, kruemmung: 0.2, szene: 0.06 }) +
    haar(T, lichtSeite, 62, wuchs, 2.1, { farben: [["#f0b070", 1, 0.15, 0.2]], streuung: 14, kruemmung: 0.2, szene: 0.06 }) +
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
  s += teil(T, maehne, schwarz, haar(T, maehne, 85, (x) => 112 - (x - 160) * 0.25, 9, Object.assign({ szene: 0.12 }, mf)), { ra: 0.2 });
  s += haar(T, mu.map((p) => [p[0] + 1.5, p[1] - 3]).concat(mu.slice().reverse()), 45, (x) => 108 - (x - 160) * 0.2, 4.5,
    { farben: [["#140f0c", 1, 0.4, 0.55], ["#4e3d33", 0.6, 0.3, 0.45]], streuung: 12, kruemmung: 0.3, szene: 0 });
  /* ---------- Kopf: eigenes System (x Genick → Nase, y zur Unterseite), 57° geneigt ---------- */
  const G = [239, -197], W = 57, K = (pts) => dreh(pts, G[0], G[1], W, 1.06), P = (x, y) => K([[x, y]])[0];
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
    haar(T, kopf, 88, W + 2, 1.4, { farben: [["#3a1606", 1, 0.13, 0.2], ["#f0b070", 0.5, 0.12, 0.15]], streuung: 12, kruemmung: 0.08, szene: 0.1 }) +
    /* Maul: dunkle, samtige Haut */
    form(maul, T.rg("maul", [[0, "#3a2a22", 0.6], [0.6, "#3a2216", 0.35], [1, "#3a2216", 0]], 0.75, 0.45, 0.65), "", 0.1) +
    fein(T, `<g opacity=".5">${haar(T, maul, 45, W + 10, 0.8, { farben: [["#d8c0a8", 1, 0.1, 0.5]], streuung: 40 })}</g>`);
  s += kopfTeil(T, kopf, fell, kInnen, 1, 17);
  /* Nüster: groß, Kommaform, feuchter Rand */
  s += form(K([[54.5, 0.5], [59, 0.8], [61, 3.5], [60.4, 6.6], [58, 7.2], [57.4, 4.6], [55.4, 3.2]]), "#2f201a", "", 0.1);
  s += form(K([[56.5, 1.8], [59.4, 2.2], [60.1, 5.2], [58.6, 6.3], [58.2, 3.9]]), "#050302", "", 0.1);
  s += strich(K([[55.2, 0.9], [58.8, 1.1], [60.4, 3.2]]), "#e8d8c8", 0.4, 0.4, 0.1) + fein(T, strich(K([[54, 1.5], [55, 4.5], [57.6, 7.8]]), "#000", 0.5, 0.4, 0.1));
  /* Maulspalte, Unterlippe, Kinn, Tasthaare */
  s += strich(K([[56.5, 13.4], [59.5, 12.8], [62.2, 11.6]]), "#000", 0.9, 0.6, 0.1) + strich(K([[50.2, 15.8], [53.5, 15.6], [55.6, 14.3]]), "#000", 0.6, 0.45, 0.1);
  if (T.fein) {
    const [mx, my] = P(60, 13), [cx2, cy2] = P(52, 18);
    s += strich(K([[56.6, 14.6], [60.4, 13.6]]), "#e8d8c8", 0.4, 0.3, 0.1);
    s += T.schnurrhaare(mx, my, 7, 3.2, W + 30, 60, "#1a120e", 0.12) + T.schnurrhaare(cx2, cy2, 6, 3, W + 70, 50, "#1a120e", 0.12);
  }
  /* Auge: groß, seitlich, waagerechte Pupille, lange Wimpern; Augenbogen und Grube darüber */
  const A = P(18, 1.6);
  s += augenhoehle(F, A[0], A[1], 2.4, 33) + F.rinne(...P(8, -3.8), ...P(14, -4.4), 2, 0.5) + strich(K([[12, -0.2], [17, -2.4], [22.5, -1.4]]), "#1a0a04", 0.9, 0.5, 0.1);
  s += T.augeReal(A[0], A[1], 2.45, { iris: "#5a3418", iris2: "#24120a", pupille: "quer", offen: 0.66, winkel: 33, wimpern: 14, wimpernLaenge: 0.75,
    wimpernFarbe: "#0e0806", haut: "#2a1208" });
  /* Ohren: fern dunkler; nah mit Muschel, hellem Innenhaar, schwarzem Rand */
  const ohrL = [[0, 0], [-3.6, -6], [-3.2, -12], [-0.6, -17.5, 1], [2.4, -11.5], [3.9, -4], [3, 1]];
  s += teil(T, dreh(ohrL, 233, -200, -4), "#4a2410", "", { ra: 0.3, q: 0.1 });
  const oI = dreh([[1.6, -0.5], [-1.6, -6.5], [-1, -13.5], [1.7, -8]], 239, -200, 12);
  s += teil(T, dreh(ohrL, 239, -200, 12), T.lg("ohr", [[0, "#1c1512"], [0.35, "#7e401f"], [1, "#8f4a22"]]),
    form(oI, "#2a140a", ` opacity=".85"`, 0.1) + haar(T, oI, 18, 95, 2.6, { farben: [["#e8d4b8", 1, 0.1, 0.45]], streuung: 16, szene: 0.5 }) +
    strich(dreh([[-3.4, -6], [-3, -12], [-0.6, -17.3]], 239, -200, 12), "#000", 0.9, 0.7, 0.1), { ra: 0.3, q: 0.1 });
  /* Schopf: Strähnen zwischen den Ohren über die Stirn */
  const schopf = K([[-3, -7.5], [4, -8.4], [9, -7.6], [12.5, -6], [13.6, -4.4], [11.6, -4.2], [9.6, -3.4], [7.6, -4.4], [5, -3.4], [1, -3.6]]);
  s += teil(T, schopf, schwarz, haar(T, schopf, 40, W - 10, 6, { farben: [["#000", 1, 0.35, 0.6], ["#5a4840", 0.8, 0.25, 0.5]], streuung: 10, kruemmung: 0.25 }), { ra: 0.2, q: 0.1 });
  s += haar(T, K([[4, -7], [12, -6], [14, -3.5], [6, -3]]), 22, W - 12, 5.4, { farben: [["#0e0a08", 1, 0.26, 0.55], ["#4a3a30", 0.6, 0.2, 0.5]], streuung: 14, kruemmung: 0.3, szene: 0 });
  const kb = T.box(kopf);
  return { svg: s, box: [5, -217, 273, 0], fuesse: [46, 68, 162.5, 177], kopf: [kb[0], kb[1] - 22, kb[2], kb[3]] };
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
const RV_H = [[165.4, -71], [166, -58], [167, -46], [166.2, -40], [166.8, -35], [168.6, -30], [168.8, -20], [167.6, -15.5], [170, -10.5], [172, -5.6, 1]];
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
  s += teil(T, fh, fernW, F.schatten(48, -40, 6, 30, 0.3) + plastik(F, verschiebe(RH_H.slice(1), 18), verschiebe(RH_V, 18), 1, 0.55), { ra: 0.4 }) + rKlaue(T, 51, horn) + afterklaue(46.8, -17, 1.7, "#3a3532");
  s += teil(T, fv, fernW, F.schatten(160, -30, 5, 26, 0.3) + plastik(F, verschiebe(RV_H, -14), verschiebe(RV_V, -14), 1, 0.55), { ra: 0.4 }) + rKlaue(T, 158, horn) + afterklaue(153.8, -16.6, 1.7, "#3a3532");
  /* ---------- Rumpf mit Hals, Euter und nahen Beinen in EINEM Umriss ---------- */
  const rumpf = [[48, -153], [36, -150], [25, -151], [19, -146], [14.5, -137], [14.5, -126], [15.5, -116]].concat(RH_H, RH_V,
    [[45, -51.5], [56, -49.5], [68, -49.5], [77, -51.5], [82, -56], [88, -57.6], [100, -55.6], [118, -56.4], [140, -62], [156, -69], [162, -72]], RV_H, RV_V,
    [[180, -76], [183, -84], [186, -96], [191, -106], [198, -117], [205, -127], [211, -136], [219, -147], [212, -152], [196, -150], [178, -148],
     [160, -150], [148, -148], [128, -146], [108, -145], [88, -146], [70, -147], [58, -150]]);
  const dR = gl(rumpf, true, T.fein ? 0.2 : 1);
  /* Schecken: schwarze Platten, Rand unregelmäßig wie eine Landkarte und haarig (gestrichelter Saum) */
  const wuchs = richtung([[15, 95], [45, 100], [70, 160], [140, 168], [158, 105], [180, 100], [205, 112]]);
  const p1 = zackig(T, [[142, -160], [176, -160], [222, -160], [220, -130], [208, -124], [200, -110], [193, -101], [185, -104], [178, -114], [166, -119],
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
    [[p1, 62], [p2, 50], [p3, 40], [p4, 14], [p5, 14]].map(([p, n]) => saum(T, p, n, wuchs, 1.5, schwarz, 0.24, 0.6)).join("") +
    /* Euter: rosa Haut, oben weich in das weiße Bauchfell übergehend; Adern */
    form(euter, T.lg("euter", [[0, "#ead2c8", 0], [0.45, "#e6c6ba", 0.85], [1, "#cfa294", 1]]), "", 0.5) +
    F.licht(66, -58, 10, 4, 0.55) + F.schatten(62, -50, 22, 3, 0.45) +
    fein(T, strich([[84, -60], [76, -58], [68, -60.5], [60, -57]], "#9a6a70", 0.7, 0.35) + strich([[72, -64], [64, -61.5], [54, -63]], "#9a6a70", 0.6, 0.3)) +
    /* Haare: grau im Weiß, silbrig im Schwarz (Glanz) */
    haar(T, rumpf, 120, wuchs, 2.2, { farben: [["#7a756c", 1, 0.16, 0.22]], streuung: 16, szene: 0.04 }) +
    [p1, p2, p3].map((p) => haar(T, p, 40, wuchs, 2.2, { farben: [["#8a8c96", 1, 0.15, 0.3]], streuung: 16, szene: 0.04 })).join("") +
    wirbel(T, 74, -114, 4, 24, "#555", 0.15, 0.4, 2) + wirbel(T, 158, -132, 4, 20, "#8a8c96", 0.15, 0.4, 2) +
    /* Knochenbau (milchtypisch): Hüfthöcker, Sitzbeinhöcker, Hungergrube, Rippen, Schulterblatt, Ellbogen, Hals */
    F.licht(48, -148, 7, 4, 0.5) + F.schatten(52, -137, 8, 6, 0.5) + F.licht(17, -138, 3, 5, 0.45) + F.schatten(23, -130, 4, 8, 0.45) +
    F.schatten(72, -130, 8, 14, 0.5, -20) + F.kante(62, -142, 58, -112, 2.6, 0.5) +
    [0, 1, 2, 3, 4].map((i) => F.rinne(114 + i * 8, -122, 106 + i * 8, -90, 1.6, 0.26)).join("") +
    [0, 1, 2, 3, 4].map((i) => F.kante(118 + i * 8, -124, 110 + i * 8, -94, 1.2, 0.14)).join("") +
    F.rinne(150, -142, 178, -104, 2.2, 0.42) + F.rinne(160, -78, 174, -96, 2.2, 0.4) +
    F.rinne(28, -140, 36, -100, 2, 0.35) + F.rinne(56, -86, 64, -110, 2, 0.32) +
    rumpfLicht(F, 18, 186, -150, -56) + F.schatten(110, -60, 48, 8, 0.6) + F.schatten(170, -73, 9, 9, 0.5) + F.schatten(196, -114, 7, 18, 0.45, 30) +
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
  const zitze = (x, y, f) => teil(T, [[x - 1.5, y], [x + 1.5, y], [x + 1.4, y + 3.6], [x + 0.8, y + 5.4], [x - 0.8, y + 5.4], [x - 1.4, y + 3.6]], f,
    F.licht(x - 0.6, y + 2, 0.6, 2, 0.6), { ra: 0.3, q: 0.1 });
  s += zitze(71, -51, "#c9a094") + zitze(77.5, -52.5, "#ddb4a8") + zitze(52, -50.6, "#ddb4a8");
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
    wirbel(T, ...P(12, -5), 2.6, 22, "#a8a399", 0.14, 0.6, 1.5) + wirbel(T, ...P(4, -1), 3, 22, "#5a5c64", 0.16, 0.5, 2) +
    /* Flotzmaul: rosa, feucht, genarbt; Nasenloch; Glanz */
    form(flotz, T.lg("flotz", [[0, "#e8b4ae"], [1, "#c98880"]]), "", 0.1) +
    fein(T, `<g opacity=".35">${haar(T, flotz, 40, 0, 0.5, { farben: [["#9a5a58", 1, 0.25, 0.6]], streuung: 180, kruemmung: 0 })}</g>`) +
    form(K([[48.6, 1], [51, 2.4], [51, 6.2], [49.6, 5.6], [48.2, 3.4]]), "#3a1c1c", "", 0.1) +
    F.licht(...P(50.4, 0.6), 1.6, 0.8, 0.9, W) + F.licht(...P(47, 8), 1.4, 0.7, 0.6, W);
  s += kopfTeil(T, kopf, schwarz, kInnen, 1, 16);
  s += strich(K([[45.6, 12.6], [49, 12.2]]), "#000", 0.7, 0.6, 0.1);
  if (T.fein) {
    const [mx, my] = P(46, 14);
    s += T.schnurrhaare(mx, my, 6, 2.6, W + 60, 50, "#e8e2d8", 0.1);
  }
  /* Auge: groß, seitlich vorstehend, waagerechte Pupille, lange Wimpern */
  const A = P(15.5, 1.8);
  s += augenhoehle(F, A[0], A[1], 2.5, 26) + T.augeReal(A[0], A[1], 2.6, { iris: "#4a2a14", iris2: "#1a0c06", pupille: "quer", offen: 0.7,
    winkel: 26, wimpern: 15, wimpernLaenge: 0.85, wimpernFarbe: "#0a0808", haut: "#000" });
  /* Genick (hornlos): Haarschopf */
  /* nahes Ohr: waagerecht seitlich-hinten, Innenseite hell behaart, gelbe Ohrmarke (Pflicht in Deutschland) */
  const OX = P(7, 6), OW = 14;
  const ohr = dreh([[0, -3], [-7, -5.6], [-15, -6.4], [-22, -4.6], [-25, -1.4], [-22, 2.4], [-14, 4.6], [-6, 4.4], [0, 3]], OX[0], OX[1], OW);
  const ohrIn = dreh([[-4, 0.4], [-10, -0.4], [-17, -0.2], [-22.6, 0.6], [-20, 3], [-12, 4], [-5, 3.4]], OX[0], OX[1], OW);
  s += teil(T, ohr, schwarz, form(ohrIn, "#5a5456", "", 0.1) +
    haar(T, ohrIn, 40, 180 + OW, 3.2, { farben: [["#ece6dc", 1, 0.14, 0.75]], streuung: 22, kruemmung: 0.3, szene: 0.3 }) +
    F.licht(...dreh([[-12, -3]], OX[0], OX[1], OW)[0], 9, 2.2, 0.4, OW), { ra: 0.3, q: 0.1 });
  const m = dreh([[-13, 2], [-13, 5]], OX[0], OX[1], OW);
  s += strich([m[0], m[1]], "#e0b000", 0.8, 0.9, 0.1);
  s += teil(T, [[m[1][0] - 2.8, m[1][1]], [m[1][0] + 2.8, m[1][1]], [m[1][0] + 3.2, m[1][1] + 6.5], [m[1][0] - 2.4, m[1][1] + 6.8]].map((p) => p.concat([1])),
    T.lg("marke", [[0, "#ffd84a"], [1, "#e0a800"]]), fein(T, `<text x="${z(m[1][0] - 2, 0.1)}" y="${z(m[1][1] + 4.8, 0.1)}" font-size="2.6" font-family="Arial" font-weight="700" fill="#2a2000">DE</text>`),
    { ra: 0.5, rw: 0.4, q: 0.1 });
  const kb = T.box(kopf);
  return { svg: s, box: [11, -153, 249, 0], fuesse: [39.2, 57.2, 164.2, 178.2], kopf: [kb[0] - 22, kb[1] - 4, kb[2], kb[3]] };
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
const KV_H = [[80, -45], [81, -34], [79.8, -26], [80.6, -22], [82.2, -18], [82.4, -11], [81.8, -8], [82.8, -5], [84, -3.2, 1]];
const KV_V = [[88, -4.5, 1], [88.4, -7], [88.4, -9.2], [87.2, -13], [87.4, -19], [89, -23.2], [89.6, -26.4], [88.2, -32], [88.4, -40]];
const KH_H = [[9.5, -66], [11.4, -57], [14.6, -48], [16.4, -40], [15, -33.4], [15.8, -30], [17.6, -26.6], [18.2, -18], [18.2, -11], [17.6, -7.8], [18.6, -5], [19.8, -3.2, 1]];
const KH_V = [[23.9, -4.5, 1], [23.8, -7], [23.4, -9], [22.8, -14], [22.6, -22], [23.4, -27], [24.2, -31], [26, -36], [29, -41]];
function kalb(T) {
  FEIN = T.fein;
  const F = flecken(T, "#fff6e6");
  const weiss = T.lg("weiss", [[0, "#faf8f3"], [0.38, "#efebe3"], [0.55, "#d8d3c9"], [0.62, "#e4e0d8"], [0.85, "#ece8e0"], [1, "#d4cec3"]]);
  const fernW = T.lg("fernW", [[0, "#9a958b"], [0.45, "#c6c0b6"], [1, "#b4aea3"]]);
  const schwarz = "#1c1b1d", horn = "#3a3533";
  const k = 0.55, D = 6;            // Rumpf kürzer: Hinterhand um D cm nach vorn
  const KHH = verschiebe(KH_H, D), KHV = verschiebe(KH_V, D);
  let s = "";
  /* ferne Beine */
  const fv = [[76, -48]].concat(verschiebe(KV_H, -6), verschiebe(KV_V, -6), [[86, -48]]);
  const fh = [[28, -52]].concat(verschiebe(KHH.slice(2), 6), verschiebe(KHV, 6), [[44, -48]]);
  s += teil(T, fh, fernW, F.schatten(31, -20, 4, 18, 0.3) + plastik(F, verschiebe(KHH.slice(2), 6), verschiebe(KHV, 6), 0.6, 0.55), { ra: 0.4 }) + rKlaue(T, 31.8, horn, k) + afterklaue(29.4, -8.6, 1.1, "#4a4440");
  s += teil(T, fv, fernW, F.schatten(82, -16, 3, 16, 0.3) + plastik(F, verschiebe(KV_H, -6), verschiebe(KV_V, -6), 0.6, 0.55), { ra: 0.4 }) + rKlaue(T, 78, horn, k) + afterklaue(75.2, -8.6, 1.1, "#4a4440");
  /* Rumpf mit Hals und nahen Beinen */
  const rumpf = [[32, -82.6], [25, -81.6], [19.6, -80.6], [16.2, -77], [15, -72]].concat(KHH, KHV,
    [[39, -45], [43, -46], [52, -44], [62, -43], [74, -45]], KV_H, KV_V,
    [[90, -47], [92, -53], [94.5, -60], [98, -66], [102, -71], [105, -74], [111, -85.5], [104, -86.4], [95, -83.8], [88, -81.4], [80, -79.6],
     [62, -78.4], [45, -79.4]]);
  const dR = gl(rumpf, true, T.fein ? 0.1 : 0.5);
  const wuchs = richtung([[10, 95], [25, 100], [36, 160], [74, 168], [82, 105], [95, 100], [110, 112]]);
  const p1 = zackig(T, [[70, -92], [124, -92], [112, -72], [104, -66], [99, -57], [94, -54], [90, -60], [84, -62], [76, -60], [72, -70], [68, -80]], 0.9, 3);
  const p2 = zackig(T, [[34, -92], [58, -92], [60, -78], [56, -66], [60, -56], [52, -51], [45, -55], [38, -58], [33, -70]], 0.9, 3);
  const p3 = zackig(T, [[6, -92], [22, -92], [24, -80], [20, -70], [18, -60], [12, -60], [6, -70]], 0.8, 2);
  const flk = [p1, p2, p3].map((p) => form(T.fein ? p : vieleck(p), schwarz, ` stroke="${schwarz}" stroke-width=".6" stroke-opacity=".5"`, 0.2)).join("");
  const innen =
    struktur(T, dR, "kafell", "#5a5650", 165, 0.06, [12, -92, 122, 0]) + flk +
    [[p1, 80], [p2, 60], [p3, 30]].map(([p, n]) => saum(T, p, n, wuchs, 1.3, schwarz, 0.18, 0.6)).join("") +
    /* flauschiges Kalbsfell: etwas längere, weiche Haare */
    haar(T, rumpf, 170, wuchs, 1.6, { farben: [["#7a756c", 1, 0.12, 0.2]], streuung: 18, kruemmung: 0.2, szene: 0.05 }) +
    [p1, p2].map((p) => haar(T, p, 50, wuchs, 1.7, { farben: [["#8a8c96", 1, 0.12, 0.32]], streuung: 22, kruemmung: 0.3, szene: 0.05 })).join("") +
    wirbel(T, 40, -64, 2.4, 18, "#666", 0.12, 0.45, 1.3) +
    /* Bau: Hüfthöcker, Rippen (schlank), Bauch rund, Schulter, Gelenke (knubbelig) */
    F.licht(32, -79, 5, 3, 0.45) + F.schatten(34, -72, 5, 4, 0.4) + F.licht(21, -70, 4, 8, 0.4, 8) +
    rumpfLicht(F, 18, 92, -80, -44) + F.schatten(55, -46, 26, 5, 0.55) + F.schatten(80, -48, 5, 5, 0.5) + F.schatten(102, -66, 4, 9, 0.45, 30) +
    F.licht(60, -72, 20, 5, 0.45) + F.licht(85, -66, 5, 9, 0.35, -25) + F.rinne(80, -74, 90, -54, 1.4, 0.4) +
    F.rinne(26, -40, 31, -46, 1, 0.45) + F.rinne(31, -46, 37, -52, 1, 0.35) +
    F.licht(87, -24, 1.4, 2.2, 0.55) + F.licht(83, -24.6, 1, 1.6, 0.4) + F.licht(22.6, -33, 1.2, 2.2, 0.5) +
    F.rinne(83.6, -17, 83.8, -10, 0.6, 0.45) + F.rinne(25.4, -25, 25.6, -10, 0.6, 0.45) +
    F.schatten(88, -15, 1.2, 8, 0.35) + F.schatten(29, -16, 1.2, 9, 0.35) + F.licht(23.6, -8, 1.2, 1.2, 0.4) + F.licht(81.8, -8, 1.2, 1.2, 0.4);
  s += teil(T, dR, weiss, innen, { ra: 0.4, rw: 0.6 });
  s += rKlaue(T, 25.8, horn, k) + afterklaue(23.6, -8.4, 1.2, "#4a4440") + rKlaue(T, 84, horn, k) + afterklaue(81.8, -8.4, 1.2, "#4a4440");
  /* Schwanz: dünn, kleine Quaste */
  const schwanz = [[21.6, -82], [18, -80.6], [15.6, -75], [14.6, -62], [14.6, -44], [16.2, -44], [16.6, -62], [17.6, -74], [21, -78]];
  s += teil(T, schwanz, T.lg("schw", [[0, schwarz], [0.4, "#2c2b2d"], [0.62, "#d8d3c9"], [1, "#e8e4dc"]]), F.licht(15.4, -62, 0.6, 10, 0.4), { ra: 0.4, rw: 0.5, q: 0.1 });
  const quaste = [[14.2, -46], [16.6, -46], [18, -38], [17.6, -30], [16.4, -33], [15.2, -28.6], [14, -32], [13.2, -38]];
  s += teil(T, quaste, "#ebe6dc", haar(T, quaste, 30, 92, 6, { farben: [["#a8a092", 1, 0.18, 0.55]], streuung: 10, szene: 0.1 }), { ra: 0.35, rw: 0.5, q: 0.1 });
  /* Kopf: groß, kurzes Gesicht, breite Stirn; 55° geneigt */
  const G = [112.5, -85], W = 57, K = (pts) => dreh(pts, G[0], G[1], W, 1.12), P = (x, y) => K([[x, y]])[0];
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
  s += kopfTeil(T, kopf, schwarz, kInnen, 1, 15, { rw: 0.6 });
  s += strich(K([[26.8, 8.6], [28.6, 8.2]]), "#000", 0.45, 0.5, 0.1);
  /* Auge: groß (Kalb), waagerechte Pupille, lange Wimpern */
  const A = P(9.6, 1.4);
  s += augenhoehle(F, A[0], A[1], 1.8, 24) + T.augeReal(A[0], A[1], 1.85, { iris: "#4a2a14", iris2: "#1a0c06", pupille: "quer", offen: 0.74,
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
  const kb = T.box(kopf);
  return { svg: s, box: [13, -88, 131, 0], fuesse: [29.2, 35.2, 81.4, 87.4], kopf: [kb[0] - 16, kb[1] - 4, kb[2], kb[3]] };
}

/* =====================================================================
   ESEL (Hausesel, grau, „Mittelesel“)
   ===================================================================== */
/* RECHERCHE Esel (Hausesel, Equus asinus): Stockmaß je nach Schlag 90–130 cm (hier 115), 180–250 kg. Kopf groß
   (~ 45–50 cm, verhältnismäßig größer als beim Pferd), gerades bis leicht ramsnasiges Profil, sehr lange Ohren (25–30 cm)
   mit dunklem Rand/dunkler Spitze und hell behaarter Innenseite. Typische Zeichnung des Grauesels („mausgrau“):
   dunkler Aalstrich über den Rücken bis in den Schweif und Schulterkreuz (Querstreifen über den Widerrist),
   „Mehlmaul“ (helles Maul), helle Augenringe, heller Bauch und helle Beininnenseiten; manchmal feine dunkle
   Querstreifen an den Beinen. Stehmähne (kurz, aufrecht, kaum Schopf), Schweif rinderähnlich: kurz behaarte Rübe mit
   Quaste am Ende. Gerader Rücken, kaum Widerrist, schmales Becken, runder Bauch; Hufe kleiner, schmaler und steiler
   als beim Pferd (Wand ~ 55–60°). Kastanien nur an den Vorderbeinen. Fell dicht und etwas rau. */
function esel(T) {
  FEIN = T.fein;
  const F = flecken(T, "#fff2dc");
  const fell = T.lg("fell", [[0, "#a29a8c"], [0.3, "#91897b"], [0.55, "#81796c"], [0.7, "#b8b0a2"], [1, "#9c9486"]]);
  const fern = T.lg("fern", [[0, "#6e675c"], [0.5, "#7a7266"], [1, "#6a6358"]]);
  const dunkel = "#3a332c";
  const S = 0.69, vX = 112, hX = 30;
  const vh = verschiebe(VB_H, vX - 167, S, 167), vv = verschiebe(VB_V, vX - 167, S, 167);
  const hh = verschiebe(HB_H, hX - 36, S, 36), hv = verschiebe(HB_V, hX - 36, S, 36);
  const hufE = (x, f) => huf(T, x, 8.6, 7.2, f);
  let s = "";
  /* ferne Beine (Kastanie nur vorn) */
  const fv = [[98, -70]].concat(verschiebe(vh, -10), verschiebe(vv, -10), [[108, -70]]);
  const fh = [[44, -72]].concat(verschiebe(hh.slice(1), 14), verschiebe(hv, 14), [[58, -72]]);
  s += teil(T, fh, fern, F.schatten(48, -22, 3, 14, 0.3) + plastik(F, verschiebe(hh.slice(1), 14), verschiebe(hv, 14), 0.7, 0.8), { ra: 0.4 }) + hufE(hX + 14 + 7.2, "#2c2622");
  s += teil(T, fv, fern, plastik(F, verschiebe(vh, -10), verschiebe(vv, -10), 0.7, 0.8) + form([[99, -49.4], [100.6, -49.9], [100.8, -46.2], [99.2, -45.9]], "#3e3730", "", 0.1) + F.schatten(108, -18, 2.4, 12, 0.4), { ra: 0.4 }) +
    hufE(vX - 10 + 7.2, "#2c2622");
  /* Schweif: kurz behaarte Rübe, dunkle Quaste */
  const schweif = [[24, -110], [19, -108], [14.6, -100], [12.6, -86], [12, -68], [12.4, -58], [15.4, -58], [15.6, -70], [16.4, -86], [18.4, -98], [24, -104]];
  s += teil(T, schweif, T.lg("schw", [[0, "#8a8274"], [0.7, "#6a6256"], [1, "#4a433a"]]),
    haar(T, schweif, 40, 95, 3, { farben: [["#4a433a", 1, 0.2, 0.5]], streuung: 16, szene: 0.1 }), { ra: 0.4 });
  const quaste = [[11.6, -62], [16, -62], [18.4, -50], [19, -38], [17.6, -30], [16, -35], [14.2, -28], [12.4, -34], [10.4, -31], [10, -42], [10.8, -52]];
  s += teil(T, quaste, "#2e2924", haar(T, quaste, 60, (x) => 90 + (x - 14) * 2.5, 12,
    { farben: [["#000", 1, 0.3, 0.5], ["#6a6054", 0.7, 0.24, 0.5]], streuung: 8, kruemmung: 0.2, szene: 0.12 }), { ra: 0.35 });
  /* Rumpf, Hals, nahe Beine in EINEM Umriss */
  const rumpf = [[32, -114], [24, -110], [17, -103], [14, -92], [14.4, -82], [17.4, -72]].concat(hh, hv,
    [[46, -66], [52, -70], [58, -72], [70, -62], [88, -56], [100, -58], [104, -61]], vh, vv,
    [[118, -66], [121, -74], [126, -86], [131, -96], [138, -105], [146, -114], [152, -128], [146, -134], [136, -131], [124, -125], [112, -119],
     [102, -116], [84, -113], [64, -113], [46, -114]]);
  const dR = gl(rumpf, true, T.fein ? 0.1 : 0.5);
  const wuchs = richtung([[14, 96], [32, 102], [48, 150], [96, 165], [108, 108], [126, 104], [146, 112]]);
  const bleich = T.rg("bleich", [[0, "#e4ddd0", 1], [0.55, "#ddd6c8", 0.75], [1, "#ddd6c8", 0]]);
  const hellF = (x, y, rx, ry, op) => `<ellipse cx="${z(x, 0.5)}" cy="${z(y, 0.5)}" rx="${rx}" ry="${ry}" fill="${bleich}" opacity="${op}"/>`;
  const innen =
    struktur(T, dR, "efell", "#3a332c", 165, 0.1, [10, -136, 154, 0]) +
    /* heller Bauch und helle Innenschenkel, dunklere Beine mit feinen Querstreifen */
    hellF(78, -56, 30, 10, 0.95) + hellF(98, -60, 8, 6, 0.8) + hellF(44, -62, 6, 9, 0.7) + hellF(103, -40, 3, 12, 0.5) + hellF(44, -44, 3, 10, 0.4) +
    `<rect x="100" y="-60" width="26" height="60" fill="${T.lg("vbein", [[0, "#5a5248", 0], [0.4, "#5a5248", 0.35], [1, "#4a433b", 0.55]])}"/>` +
    `<rect x="14" y="-64" width="32" height="64" fill="${T.lg("hbein", [[0, "#5a5248", 0], [0.45, "#5a5248", 0.35], [1, "#4a433b", 0.55]])}"/>` +
    fein(T, [0, 1, 2].map((i) => strich([[107, -47 + i * 3.6], [111, -48.4 + i * 3.6], [115, -47.6 + i * 3.6], [118, -48.6 + i * 3.6]], dunkel, 0.7, 0.16)).join("") +
      [0, 1, 2].map((i) => strich([[23, -45 + i * 4], [27, -46.4 + i * 4], [31, -45.6 + i * 4], [34, -46.4 + i * 4]], dunkel, 0.7, 0.15)).join("")) +
    /* Aalstrich und Schulterkreuz */
    strich([[24, -110], [40, -114.4], [64, -113.8], [84, -113.6], [102, -116.4], [112, -119.4]], dunkel, 3, 0.75) +
    form([[103, -118], [108.5, -118], [109.6, -106], [111.6, -94], [112.4, -86], [111.2, -86], [108.6, -95], [105.6, -106]],
      T.lg("kreuz", [[0, dunkel, 0.75], [0.7, dunkel, 0.45], [1, dunkel, 0]]), "", 0.1) +
    /* Haar: dicht, etwas rau; Wirbel an der Flanke */
    haar(T, rumpf, 300, wuchs, 2.6, { farben: [["#4a433a", 1, 0.18, 0.3], ["#d8d0c2", 0.6, 0.16, 0.3]], streuung: 24, kruemmung: 0.25, szene: 0.06 }) +
    wirbel(T, 54, -86, 3.4, 24, "#4a433a", 0.16, 0.4, 2) +
    /* Muskeln und Knochen */
    F.licht(36, -104, 18, 9, 0.6, 15) + F.licht(76, -104, 26, 6, 0.5) + F.licht(112, -100, 8, 14, 0.5, -25) + F.licht(130, -114, 14, 6, 0.45, -35) +
    rumpfLicht(F, 14, 126, -114, -56) + F.schatten(78, -60, 30, 8, 0.45) + F.schatten(101, -78, 6, 10, 0.4) + F.schatten(132, -94, 6, 14, 0.4, 40) +
    F.rinne(100, -112, 114, -86, 2, 0.4) + F.rinne(104, -67, 112, -80, 1.8, 0.35) + F.rinne(52, -70, 42, -84, 1.8, 0.35) +
    F.rinne(22, -104, 28, -76, 1.6, 0.3) + F.licht(40, -108, 4, 3, 0.4) + F.rinne(130, -98, 146, -116, 1.8, 0.35) +
    laufDetails(T, F, vX, -50 * S, S, "#2e2924") + laufDetails(T, F, hX, -58 * S, S, "#2e2924") +
    F.schatten(vX + 7, -24, 2, 14, 0.45) + F.schatten(hX + 8, -26, 2, 15, 0.45);
  s += teil(T, dR, fell, innen, { ra: 0.4 });
  s += hufE(hX + 7.2, "#3a332e") + hufE(vX + 7.2, "#3a332e");
  /* Stehmähne: kurz, aufrecht, dunkle Spitzen */
  const KAMM_E = [[106, -117], [116, -121], [126, -126], [136, -131], [146, -134], [152, -130]];
  const mo = KAMM_E.map((p, i) => [p[0] + 1, p[1] - 7 - Math.sin(i / 5 * Math.PI) * 1.5]), mu = KAMM_E.map((p) => [p[0], p[1] + 2]).reverse();
  const maehne = mo.concat(mu);
  s += teil(T, maehne, T.lg("maehne", [[0, "#2a2520"], [0.6, "#4a4238"], [1, "#6e665a"]]),
    haar(T, maehne, 90, (x) => -78 - (x - 106) * 0.25, 5, { farben: [["#1a1612", 1, 0.3, 0.6], ["#8a8274", 0.5, 0.22, 0.45]], streuung: 16, kruemmung: 0.2, szene: 0.1 }),
    { ra: 0.3, q: 0.5 });
  s += haar(T, maehne, 40, (x) => -80 - (x - 106) * 0.25, 4, { farben: [["#1a1612", 1, 0.3, 0.55]], streuung: 20, kruemmung: 0.2, szene: 0 });
  /* Kopf: groß, 50° geneigt */
  const G = [150, -131], W = 52, K = (pts) => dreh(pts, G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  const kopf = K([[-1, -3], [8, -5.6], [18, -6.2], [30, -5.4], [40, -4], [46, -2.6], [50, 0.6], [51, 5], [50, 9.4], [47.4, 11.6], [44.6, 12.4], [42.6, 15.2],
    [38.4, 15.6], [34, 13.6], [26, 15.6], [17, 21.6], [8, 23], [2, 19], [-2, 9]]);
  const dK = gl(kopf, true, 0.1);
  const mehlmaul = K([[36, -4.6], [46, -2.6], [50, 0.6], [51, 5], [50, 9.4], [47.4, 11.6], [44.6, 12.4], [42.6, 15.2], [38.4, 15.6], [34, 13.6], [31, 10], [31, 2]]);
  const kInnen =
    struktur(T, dK, "ekopf", "#3a332c", W, 0.1, [128, -140, 186, -80]) +
    form(mehlmaul, T.rg("mehl", [[0, "#f0ebe2"], [0.6, "#e6e0d4"], [1, "#e6e0d4", 0]], 0.75, 0.5, 0.75), "", 0.1) +
    F.licht(...P(22, 6), 12, 7, 0.55, W) + F.schatten(...P(10, 18), 9, 6, 0.55, W) + F.schatten(...P(36, 12), 7, 3.5, 0.4, W) +
    F.rinne(...P(26, 9), ...P(18, 18), 1.4, 0.4) + F.rinne(...P(18, 18), ...P(8, 20), 1.4, 0.4) + F.rinne(...P(12, 7), ...P(30, 6), 1.4, 0.35) +
    F.kante(...P(12, 5), ...P(30, 4), 1.2, 0.45) +
    haar(T, kopf, 130, W + 4, 1.6, { farben: [["#4a433a", 1, 0.14, 0.32], ["#e0d8ca", 0.6, 0.13, 0.3]], streuung: 18, szene: 0.08 }) +
    /* heller Augenring („Brille“) */
    hellF(...P(16, 1.4), 5, 4, 0.95) + hellF(...P(16, 1.4), 3.6, 3, 0.8);
  s += kopfTeil(T, kopf, fell, kInnen, 1, 16);
  /* Nüster (dunkel umrandet im Mehlmaul), Maulspalte, Lippen, Tasthaare */
  s += form(K([[44.6, 0.2], [48.4, 1], [49.6, 3.8], [49, 6.4], [47.2, 6.6], [46.6, 4.2], [45.2, 2.8]]), "#4a4038", "", 0.1);
  s += form(K([[46.2, 1.4], [48.4, 2], [48.8, 4.8], [47.8, 5.8], [47.4, 3.6]]), "#0c0806", "", 0.1);
  s += strich(K([[45.2, 12.2], [48.2, 11.4], [50.2, 9.6]]), "#2a2420", 0.8, 0.65, 0.1) + strich(K([[39, 14.6], [42.2, 14.4], [44, 12.8]]), "#2a2420", 0.6, 0.45, 0.1);
  if (T.fein) {
    const [mx, my] = P(48, 11), [cx2, cy2] = P(41, 15.4);
    s += T.schnurrhaare(mx, my, 6, 2.8, W + 30, 60, "#2a2420", 0.1) + T.schnurrhaare(cx2, cy2, 5, 2.6, W + 70, 50, "#2a2420", 0.1);
  }
  const A = P(16, 1.4);
  s += augenhoehle(F, A[0], A[1], 2.2, 30) + T.augeReal(A[0], A[1], 2.25, { iris: "#3a2410", iris2: "#160c06", pupille: "quer", offen: 0.62,
    winkel: 30, wimpern: 12, wimpernLaenge: 0.7, wimpernFarbe: "#140c08" });
  /* Ohren: sehr lang (~27 cm), hell innen, dunkler Rand und dunkle Spitze */
  const ohrL = [[0, 0], [-4.6, -8], [-5, -17], [-3, -24], [0, -28.4, 1], [3.2, -23], [4.6, -14], [4.4, -5], [3.4, 1]];
  const ohrF = T.lg("eohr", [[0, "#1e1a16"], [0.22, "#4a433a"], [0.5, "#8a8274"], [1, "#958d7f"]]);
  s += teil(T, dreh(ohrL, 143, -133, -14), ohrF, "", { ra: 0.3, q: 0.1 });
  const oI = dreh([[1.4, -1], [-2.6, -8], [-2.8, -17], [-1, -23], [0.6, -25.6], [2.2, -18], [2.6, -8]], 149, -133, 4);
  s += teil(T, dreh(ohrL, 149, -133, 4), ohrF, form(oI, "#d8d0c2", "", 0.1) +
    haar(T, oI, 40, 95, 3, { farben: [["#f0eadf", 1, 0.12, 0.7], ["#8a8274", 0.5, 0.12, 0.5]], streuung: 25, kruemmung: 0.3, szene: 0.3 }) +
    strich(dreh([[-4.4, -8], [-4.8, -17], [-2.8, -24], [0, -28]], 149, -133, 4), "#1a1612", 1.2, 0.8, 0.1), { ra: 0.3, q: 0.1 });
  const kb = T.box(kopf);
  return { svg: s, box: [10, -161, 181, 0], fuesse: [37.2, 51.2, 109.2, 119.2], kopf: [kb[0], kb[1] - 30, kb[2], kb[3]] };
}

/* =====================================================================
   SCHWEIN (Deutsche Landrasse, Sau)
   ===================================================================== */
/* RECHERCHE Schwein (Deutsche Landrasse, Zuchtziel/Exterieur): großrahmig, weiß (rosa Haut, spärliche weiße Borsten),
   lange Seite (16–17 Rippenpaare), mittellanger Kopf mit geradem bis leicht eingesenktem Profil, gefurchte Stirn,
   große SCHLAPPOHREN, die nach vorn über die Augen hängen; Rücken lang, leicht gewölbt (steigt zur Kruppe ~5 cm an),
   breite Schulter, volle Schinken, trockene, stabile Gliedmaßen; Sau mit mindestens 14 Zitzen (2 Reihen, je 7).
   Adulte Sau: Rumpflänge ~1,6 m, Höhe ~85–90 cm, 250–300 kg. Paarhufer: läuft auf den zwei Hauptklauen, die zwei
   Afterklauen sitzen hinten tief und berühren weichen Boden fast; Sprunggelenk hinten, Vorderfußwurzel vorn. Rüssel
   mit flacher, runder Rüsselscheibe und zwei Nasenlöchern; schwere Backe (Ganasche), lange Maulspalte; kleine Augen
   mit hellen Wimpern. Schwanz geringelt (Ringelschwanz). */
const SV_H = [[126, -40], [127, -30], [126.4, -20], [127.4, -15.6], [128, -11], [127.2, -7.4], [128.6, -4.6], [130, -2.8, 1]];
const SV_V = [[134.2, -4.4, 1], [134.8, -7], [134.6, -11], [135.6, -16], [136, -20.4], [135.4, -27], [136.6, -35], [139, -42]];
const SH_H = [[10, -62], [11, -50], [15, -40], [19.6, -32], [20.6, -27], [19.2, -23.6], [20.4, -20.6], [22.8, -17], [23.4, -10.6], [22.6, -7.4], [23.8, -4.6], [25, -2.8, 1]];
const SH_V = [[29.2, -4.4, 1], [29.8, -7], [29.6, -11], [29.4, -16], [30.4, -21], [32, -26], [35, -31], [40, -36], [46, -40]];
function schwein(T) {
  FEIN = T.fein;
  const F = flecken(T, "#fff4ee", "#7a2818");
  const haut = T.lg("haut", [[0, "#f8dccf"], [0.35, "#f2cbbb"], [0.7, "#e3ad9b"], [1, "#c98d7c"]]);
  const fernH = T.lg("fernH", [[0, "#c58c7c"], [1, "#b07a6b"]]);
  const horn = "#b39484", hornF = "#8e7264", k = 0.55;
  let s = "";
  /* ferne Beine */
  const fv = [[118, -44]].concat(verschiebe(SV_H, -9), verschiebe(SV_V, -9), [[130, -44]]);
  const fh = [[30, -46]].concat(verschiebe(SH_H.slice(3), 12), verschiebe(SH_V, 12), [[58, -42]]);
  s += teil(T, fh, fernH, F.schatten(36, -14, 3, 10, 0.3) + plastik(F, verschiebe(SH_H.slice(3), 12), verschiebe(SH_V, 12), 0.6), { ra: 0.4, rw: 0.6 }) + rKlaue(T, 37, hornF, k) + afterklaue(34.4, -6.4, 1.6, hornF);
  s += teil(T, fv, fernH, F.schatten(126, -14, 3, 10, 0.3) + plastik(F, verschiebe(SV_H, -9), verschiebe(SV_V, -9), 0.6), { ra: 0.4, rw: 0.6 }) + rKlaue(T, 121, hornF, k) + afterklaue(118.4, -6.4, 1.6, hornF);
  /* Rumpf mit nahen Beinen */
  const rumpf = [[24, -84], [17, -81], [12, -76], [9, -68]].concat(SH_H, SH_V,
    [[52, -36], [70, -32.4], [95, -31.4], [115, -33.4], [123, -37]], SV_H, SV_V,
    [[141.6, -46.6], [144, -52], [150, -56], [150, -78], [140, -80.4], [128, -84.6], [112, -87.4], [92, -88.6], [70, -89], [48, -87.6], [34, -86]]);
  const dR = gl(rumpf, true, T.fein ? 0.1 : 0.5);
  const wuchs = richtung([[10, 100], [30, 110], [50, 160], [120, 168], [135, 110], [150, 120]]);
  const innen =
    /* Muskeln: Schinken, Schulter, lange Seite; Bauch im Schatten mit Zitzenleiste */
    F.licht(30, -68, 20, 15, 0.8, 20) + F.licht(84, -79, 42, 6, 0.6) + F.licht(126, -68, 11, 13, 0.55, -20) + F.licht(86, -66, 30, 8, 0.3) +
    rumpfLicht(F, 10, 146, -89, -32, 0.8) + F.schatten(84, -33, 46, 9, 0.55) + F.schatten(44, -44, 10, 12, 0.5) + F.schatten(120, -42, 8, 9, 0.5) + F.schatten(12, -52, 6, 14, 0.4) +
    F.schatten(56, -58, 8, 18, 0.3, -8) + F.schatten(118, -58, 7, 16, 0.3, 12) + F.licht(30, -64, 14, 14, 0.35) +
    F.licht(128, -66, 9, 11, 0.35) + F.rinne(140, -72, 148, -56, 2.4, 0.3) +
    /* Hautfalten: Ellbogen, Kniefalte, Hals */
    strich([[124, -44], [128, -48], [134, -48]], "#a86a5c", 0.7, 0.3) + strich([[44, -42], [49, -46], [54, -45]], "#a86a5c", 0.7, 0.3) +
    /* Borsten: spärlich, weiß-durchscheinend; am Rücken länger */
    haar(T, rumpf, 200, wuchs, 1.9, { farben: [["#fff", 1, 0.1, 0.5], ["#b98274", 0.6, 0.09, 0.3]], streuung: 22, kruemmung: 0.15, szene: 0.04 }) +
    fein(T, `<g opacity=".45">${haar(T, rumpf, 240, wuchs, 0.6, { farben: [["#c08070", 1, 0.25, 0.5]], streuung: 180, kruemmung: 0 })}</g>`) +
    /* Läufe: Gelenke, Sehnen */
    F.licht(136, -19, 1.4, 2.6, 0.5) + F.licht(20, -24, 1.2, 2.6, 0.5) + F.schatten(134.6, -11, 1.2, 5, 0.4) + F.schatten(29.4, -12, 1.2, 6, 0.4) +
    F.rinne(127.6, -14, 128, -8, 0.6, 0.45) + F.rinne(23, -16, 23.4, -8, 0.6, 0.45);
  s += teil(T, dR, haut, innen, { ra: 0.4, rc: "#5a2a20" });
  s += rKlaue(T, 25, horn, k) + afterklaue(22.4, -6.2, 1.8, horn) + rKlaue(T, 130, horn, k) + afterklaue(127.4, -6.2, 1.8, horn);
  /* Zitzen (Sau: Zitzenleiste) */
  for (let i = 0; i < 6; i++) {
    const x = 64 + i * 10 + (i % 2) * 0.8, y = -32.4 + Math.abs(i - 2.5) * 0.3;
    s += teil(T, [[x - 0.9, y - 0.8], [x + 0.9, y - 0.8], [x + 0.7, y + 0.8], [x, y + 1.3], [x - 0.7, y + 0.8]], "#dc9a8a", "", { ra: 0.4, rw: 0.3, q: 0.1 });
  }
  /* Ringelschwanz */
  const schw = [[13, -77], [9, -77.6], [6.4, -75], [7, -71.6], [9.8, -71.4], [10.4, -74], [8.4, -75.4], [5.8, -73.4], [4.6, -69.6], [5.6, -66.6]];
  s += strich(schw, "#a86e60", 1.9, 1, 0.1) + strich(schw, "#efc4b4", 1.2, 1, 0.1) + strich(schw.slice(0, 5), "#fff", 0.4, 0.4, 0.1);
  /* Kopf: x Genick → Rüsselscheibe, y zur Unterseite; 32° geneigt */
  const G = [144, -78], W = 33, K = (pts) => dreh(pts, G[0], G[1], W, 1.14), P = (x, y) => K([[x, y]])[0];
  const kopf = K([[-1, -3.4], [8, -4.8], [18, -4.2], [28, -2.8], [36, -1.6], [40.4, -1], [41.8, 2], [41.6, 6.6], [39.8, 7.6], [36, 8], [32, 9.8], [26, 12],
    [18, 15.6], [10, 19], [3, 18], [-2, 10]]);
  const dK = gl(kopf, true, 0.1);
  const kInnen =
    F.licht(...P(20, 2), 14, 5, 0.6, W) + F.schatten(...P(12, 14), 10, 5, 0.55, W) + F.schatten(...P(32, 7), 6, 2.4, 0.45, W) +
    F.rinne(...P(18, 10), ...P(34, 8), 1.2, 0.5) +
    /* Stirnfalten, Backenfalten */
    fein(T, strich(K([[8, -3], [11, -1.4], [14, -1.8]]), "#a86a5c", 0.5, 0.45, 0.1) + strich(K([[13, -3.6], [16, -2], [19, -2.4]]), "#a86a5c", 0.5, 0.4, 0.1) +
      strich(K([[22, 8.6], [26, 10.4]]), "#a86a5c", 0.5, 0.35, 0.1)) +
    haar(T, kopf, 90, W, 1.4, { farben: [["#fff", 1, 0.1, 0.55], ["#b98274", 0.6, 0.09, 0.35]], streuung: 22, szene: 0.06 });
  s += teil(T, dK, haut, kInnen + F.licht(...P(-3, 6), 8, 12, 0.5, W) + F.schatten(...P(4, 16), 8, 4, 0.4, W), { rand: false });
  s += strich(K([[3, -3.6], [8, -4.8], [18, -4.2], [28, -2.8], [36, -1.6], [40.4, -1]]), "#5a2a20", 0.8, 0.4, 0.1) +
    strich(K([[39.8, 7.6], [36, 8], [32, 9.8], [26, 12], [18, 15.6], [10, 19], [5, 18.6]]), "#5a2a20", 0.8, 0.4, 0.1);
  /* Rüsselscheibe (vorn, flach, leicht oval) mit Nasenlöchern; Maulspalte */
  const scheibe = K([[39.6, -0.8], [41.6, -0.4], [42.6, 2.6], [42.4, 6.6], [41, 8], [39.6, 7.6], [39, 3.6]]);
  s += teil(T, scheibe, T.lg("scheibe", [[0, "#f0b0a4"], [1, "#d08a7e"]], 0, 0, 1, 0),
    form(K([[40.6, 1.6], [41.8, 1.8], [41.8, 3.4], [40.8, 3.2]]), "#6a2e28", "", 0.1) + form(K([[40.6, 4.4], [41.8, 4.6], [41.6, 6.2], [40.6, 5.8]]), "#6a2e28", "", 0.1) +
    F.licht(...P(41.6, 0.6), 0.8, 0.5, 0.8, W), { ra: 0.5, rc: "#5a2a20", rw: 0.5, q: 0.1 });
  s += strich(K([[38.8, 7.8], [33, 8.6], [27, 10]]), "#7a3a30", 0.7, 0.6, 0.1);
  if (T.fein) { const [mx, my] = P(37, 8); s += T.schnurrhaare(mx, my, 5, 2, W + 60, 60, "#f8f0ea", 0.08); }
  /* Auge: klein, halb unter dem Schlappohr, helle Wimpern */
  const A = P(14.6, 2.8);
  s += augenhoehle(F, A[0], A[1], 1.3, 20) + T.augeReal(A[0], A[1], 1.3, { iris: "#5a3a20", iris2: "#2a1608", pupille: "rund", offen: 0.6, winkel: 20, wimpern: 9, wimpernLaenge: 0.9,
    wimpernFarbe: "#f4e8de", haut: "#c88a7a" });
  /* Schlappohr: groß, hängt nach vorn über das Auge; dünn, durchscheinend, Adern */
  const ohr = [[145, -83], [153, -86.6], [162, -84], [170, -77], [176, -68.6], [178.4, -60.4], [176.4, -59.6], [171, -61.4], [164, -63.4], [158, -65.6], [152, -69.6], [147, -75]];
  s += teil(T, ohr, T.lg("ohr", [[0, "#f6d2c4"], [0.6, "#eebaa8"], [1, "#d89888"]], 0, 0, 1, 1),
    F.licht(158, -80, 10, 3.4, 0.65, 35) + F.schatten(166, -65, 13, 2.6, 0.5, 38) + F.licht(174, -64, 4, 1.4, 0.4, 60) +
    fein(T, strich([[150, -81], [158, -80], [166, -74], [173, -66]], "#c07060", 0.45, 0.45, 0.1) + strich([[157, -79.4], [162, -73.4], [164, -70]], "#c07060", 0.3, 0.4, 0.1) +
      strich([[162, -78], [169, -70.6]], "#c07060", 0.3, 0.35, 0.1) + strich([[148, -78], [154, -76], [158, -73]], "#a86a5c", 0.5, 0.4, 0.1)) +
    haar(T, ohr, 30, 30, 1.4, { farben: [["#fff", 1, 0.08, 0.6]], streuung: 20, szene: 0 }), { ra: 0.45, rc: "#5a2a20", rw: 0.6 });
  s += strich([[147.4, -74.4], [154, -69], [164, -63.6], [172, -60.8], [177.6, -59.8]], "#8a4a40", 0.6, 0.45);
  const kb = T.box(kopf);
  return { svg: s, box: [5, -89, 184, 0], fuesse: [28.4, 40.4, 124.4, 133.4], kopf: [kb[0] - 4, kb[1] - 12, kb[2], kb[3]] };
}

/* =====================================================================
   SCHAF (Schwarzköpfiges Fleischschaf)
   ===================================================================== */
/* RECHERCHE Schaf (Schwarzköpfiges Fleischschaf, LfL-Rassebeschreibung): mittel- bis großrahmiges Fleischschaf,
   Mutterschaf 70–80 cm Widerrist, 70–100 kg; Kopf hornlos, mittelbreit, SCHWARZ, Stirn mehr oder weniger bewollt
   (Wollschopf), kräftige, seitlich abstehende Ohren; weiße Kreuzzuchtwolle (33–35 µm), Vlies dicht und gelockt, bedeckt
   Rumpf, Hals und die Beine bis Vorderfußwurzel/Sprunggelenk; Beine darunter dunkelbraun bis schwarz und weitgehend
   unbewollt. Leicht gewölbte Nase (Ramsnase), waagerechte rechteckige Pupille, Iris bernstein-gelblich; Paarhufer mit
   kleinen dunklen Klauen; Schwanz (oft kupiert, hier kurz). Länge Nase–Schwanzansatz ~1,3 m. */
/* Wollrand: Umriss in gleichmäßige Abschnitte teilen und jeden zweiten Punkt nach außen drücken (Locken) */
function lockig(pts, r, rnd = null) {
  let fl = 0;
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; fl += a[0] * b[1] - b[0] * a[1]; }
  const sgn = fl > 0 ? 1 : -1, out = [];
  let n = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (a[2]) { out.push(a); continue; }
    const m = Math.max(1, Math.round(L / (r * 1.7)));
    for (let j = 0; j < m; j++) {
      const t = (j + (rnd ? (rnd() - 0.5) * 0.5 : 0)) / m, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
      const nx = (b[1] - a[1]) / L * sgn, ny = -(b[0] - a[0]) / L * sgn;
      const k = (n++ % 2) ? r * (rnd ? 0.3 + rnd() * 0.5 : 0.55) : -r * 0.1;
      out.push([x + nx * k, y + ny * k]);
    }
  }
  return out;
}
/* Lockenballen („Blumenkohl“): viele kleine Kuppen mit Licht oben links und Schatten unten rechts, dicht gepackt.
   EIN gemeinsamer Verlauf, Kreise ohne eigene Füllangabe → klein. */
function lockenballen(T, pts, n, r, hell = "#fffcf4", dunkel = "#a2957c") {
  const g = T.rg("locke", [[0, hell, 0.8], [0.5, hell, 0.45], [1, hell, 0]], 0.5, 0.5, 0.5, ` fx="0.36" fy="0.32"`);
  const ziel = Math.round(n * (T.fein ? 1 : 0.18)), rr = T.fein ? r : r * 1.8;
  const [x0, y0, x1, y1] = T.box(pts);
  let k = "", m = 0, v = 0;
  while (m < ziel && v < ziel * 8) {
    v++;
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!T.inPoly(x, y, pts)) continue;
    k += `<circle cx="${z(x, 0.1)}" cy="${z(y, 0.1)}" r="${z(rr * (0.7 + T.rnd() * 0.6), 0.1)}"/>`;
    m++;
  }
  return `<g fill="${g}">${k}</g>`;
}
/* Wolle: gekräuselte Haare in drei Tönen + Lockenbögen */
function wolle(T, pts, n, farben) {
  return haar(T, pts, n, (x, y) => (x * 37 + y * 53) % 360, 2.4, { farben, streuung: 360, kruemmung: 0.65, szene: 0.05 });
}
/* dünnes Schaf-/Ziegenbein: Mittellinie mit Gelenken; xH = hintere Klauenkante */
function laufDuenn(xH, oben, gy, hinten, s = 1) {
  const c = xH + 1.45 * s;
  const sp = hinten
    ? [[c - 3, oben, 3 * s, 3.4 * s], [c - 2.6, gy, 2.8 * s, 3.8 * s], [c - 1.6, gy + 5 * s, 2.2 * s, 2.6 * s], [c - 1, -12 * s, 2 * s, 2.2 * s],
       [c - 0.8, -6 * s, 2.3 * s, 2.6 * s], [c - 0.4, -4.2 * s, 1.8 * s, 1.8 * s], [c, -2.8 * s, 1.5 * s, 1.45 * s, 1]]
    : [[c - 2.8, oben, 2.4 * s, 2.4 * s], [c - 2.6, gy, 2.9 * s, 3.2 * s], [c - 2.6, gy + 3.5 * s, 2.1 * s, 2.4 * s], [c - 1, -10 * s, 1.9 * s, 2.2 * s],
       [c - 1, -6 * s, 2.3 * s, 2.6 * s], [c - 0.4, -4.2 * s, 1.8 * s, 1.8 * s], [c, -2.8 * s, 1.5 * s, 1.45 * s, 1]];
  return glied(sp);
}
function schaf(T) {
  FEIN = T.fein;
  const F = flecken(T, "#fffaf0");
  const bein = T.lg("bein", [[0, "#3e362f"], [1, "#1e1a17"]], 0, 0, 1, 0), beinF = "#26201c", horn = "#1a1614";
  const k = 0.4;
  let s = "";
  /* ferne Beine (dunkel), dann nahe Beine – die Wolle liegt darüber */
  s += teil(T, laufDuenn(27, -40, -29, true), beinF, F.kante(26.4, -26, 27, -8, 0.8, 0.5) + F.licht(26.6, -29, 1.4, 2.4, 0.35), { ra: 0.4, rw: 0.5, q: 0.1 }) + rKlaue(T, 27, horn, k);
  s += teil(T, laufDuenn(88.6, -36, -23, false), beinF, F.kante(87.4, -20, 88, -8, 0.8, 0.5) + F.licht(88.2, -23, 1.4, 2.2, 0.35), { ra: 0.4, rw: 0.5, q: 0.1 }) + rKlaue(T, 88.6, horn, k);
  const lInnen = (x, gy) => F.licht(x - 1.4, gy, 1.2, 2.6, 0.45) + F.rinne(x - 0.6, gy + 5, x - 0.4, -6, 0.5, 0.5) + F.licht(x - 1.6, -5, 1, 1.4, 0.4) +
    haar(T, [[x - 4, gy - 8], [x + 3, gy - 8], [x + 3, -4], [x - 4, -4]], 30, 92, 1, { farben: [["#5a5048", 1, 0.12, 0.6]], streuung: 16, szene: 0 });
  s += teil(T, laufDuenn(21.4, -40, -29, true), bein, lInnen(20.6, -29), { ra: 0.45, rw: 0.5, q: 0.1 }) + rKlaue(T, 21.4, horn, k);
  s += teil(T, laufDuenn(95, -36, -23, false), bein, lInnen(94.2, -23), { ra: 0.45, rw: 0.5, q: 0.1 }) + rKlaue(T, 95, horn, k);
  /* Vlies: Rumpf, Hals, Oberbeine („Hosen“) – gelockter Rand */
  const basis = [[24, -81], [13, -77], [7, -66], [6, -52], [9, -42], [13.4, -34], [16.4, -28.6], [21, -27.4], [26, -28.4], [28.6, -33], [31.6, -39.6],
    [37, -42.6], [44, -38], [60, -34.6], [78, -35.4], [85, -37], [87.6, -30], [89.4, -23.6], [94, -22.4], [98, -23.4], [99.6, -30], [102, -40.6], [107, -53],
    [110, -61], [114, -68], [112, -80], [104, -83], [90, -83.6], [60, -84.4], [40, -83.4]];
  const vlies = lockig(basis, 3, T.rnd);
  const dV = gl(vlies, true, T.fein ? 0.1 : 0.5);
  const wolF = T.lg("wolle", [[0, "#ddd3bf"], [0.45, "#cfc4ad"], [0.8, "#b4a68b"], [1, "#998b70"]]);
  const vInnen =
    (T.fein ? T.textur(dV, T.rauschen("wolle", { fx: 0.45, fy: 0.45, farbe: "#8a7c62", staerke: 2.2, okt: 3 }), 0, 0.3, [4, -86, 116, -24]) : "") +
    F.licht(34, -70, 22, 12, 0.85) + F.licht(76, -73, 26, 9, 0.75) + F.licht(102, -62, 8, 12, 0.5, -30) +
    F.schatten(60, -38, 40, 8, 0.65) + F.schatten(32, -42, 8, 8, 0.45) + F.schatten(90, -34, 6, 8, 0.45) + F.schatten(12, -50, 5, 12, 0.4) +
    F.rinne(50, -78, 46, -46, 3, 0.25) + F.rinne(86, -78, 94, -46, 3, 0.25) +
    /* Locken (Stapel): dicht gepackte Kuppen, dazwischen Schatten; feine Fasern obenauf */
    lockenballen(T, vlies, 520, 2.4, "#f8f2e4") +
    F.licht(40, -72, 26, 10, 0.5) + F.licht(80, -74, 22, 8, 0.45) + F.schatten(60, -38, 44, 7, 0.55) +
    /* Scheitel/Spalten zwischen den Stapeln (Netz weicher dunkler Rinnen) */
    (() => { let r = ""; for (let i = 0; i < 26; i++) { const x = 14 + T.rnd() * 92, y = -78 + T.rnd() * 40, g = T.rnd() * 180, L = 3 + T.rnd() * 5;
      if (T.inPoly(x, y, basis)) r += F.rinne(x, y, x + Math.cos(g) * L, y + Math.sin(g) * L, 0.9, 0.5); } return r; })() +
    wolle(T, vlies, 90, [["#9c8f76", 1, 0.14, 0.3], ["#fffdf6", 1, 0.14, 0.4]]);
  s += teil(T, dV, wolF, vInnen, { ra: 0.35, rc: "#6a5e48", rw: 0.6 });
  /* Kopf: schwarz, Ramsnase, 50° geneigt */
  const G = [111, -78], W = 48, K = (pts) => dreh(pts, G[0], G[1], W, 0.94), P = (x, y) => K([[x, y]])[0];
  const kopf = K([[-1, -2.6], [6, -4], [13, -4.6], [20, -3.8], [25, -1.8], [27, 1.2], [27.2, 4.6], [26, 6.8], [23.6, 7.6], [22, 8.8], [18.6, 9.2], [14, 9.8],
    [8, 12.4], [2, 11.8], [-2, 6]]);
  const dK = gl(kopf, true, 0.1);
  const kInnen =
    F.licht(...P(14, 0), 9, 3.4, 0.45, W) + F.licht(...P(22, -1.4), 5, 1.6, 0.4, W) + F.schatten(...P(8, 9), 7, 3.6, 0.6, W) +
    F.rinne(...P(10, 5), ...P(20, 5), 0.9, 0.5) +
    haar(T, kopf, 110, W, 0.9, { farben: [["#6a5e54", 1, 0.09, 0.45], ["#000", 0.7, 0.09, 0.4]], streuung: 16, szene: 0.08 }) +
    F.licht(...P(26, 1.4), 1.2, 0.8, 0.5, W);
  s += kopfTeil(T, kopf, T.lg("kopf", [[0, "#2c2622"], [1, "#16120f"]]), kInnen, 1, 12, { rw: 0.5 });
  /* Nasenloch (Schlitz), Maulspalte */
  s += strich(K([[24.6, 1.4], [25.8, 2.4], [26.2, 4]]), "#000", 0.6, 0.85, 0.1) + strich(K([[22.4, 8], [25.6, 7]]), "#000", 0.5, 0.7, 0.1);
  if (T.fein) { const [mx, my] = P(24, 8.4); s += T.schnurrhaare(mx, my, 4, 1.4, W + 50, 50, "#a89a8c", 0.06); }
  /* Auge: bernsteinfarben, waagerechte rechteckige Pupille */
  const A = P(10.4, 1.4);
  s += augenhoehle(F, A[0], A[1], 1.3, 30) + T.augeReal(A[0], A[1], 1.35, { iris: "#c99a42", iris2: "#6a4410", pupille: "quer", offen: 0.66, winkel: 30, wimpern: 7, wimpernLaenge: 0.6,
    wimpernFarbe: "#0a0806", weiss: false });
  /* Ohren: kräftig, waagerecht abstehend */
  const OX = P(4, 3.4);
  s += teil(T, dreh([[0, -1.6], [-4, -3], [-9, -3], [-12.6, -1.4], [-13, 0.6], [-9, 2.2], [-4, 2.4], [0, 1.6]], OX[0], OX[1], 4), "#1e1a17",
    form(dreh([[-3, -0.4], [-8, -1.2], [-11.4, -0.4], [-8, 1.2], [-3, 1]], OX[0], OX[1], 4), "#5a4e46", "", 0.1) +
    F.licht(...dreh([[-7, -2]], OX[0], OX[1], 4)[0], 4, 0.8, 0.4, 4), { ra: 0.45, rw: 0.5, q: 0.1 });
  /* Wollschopf auf der Stirn */
  const schopf = lockig(K([[-3, -3], [2, -6.6], [8, -6.4], [11, -4.2], [8, -2.6], [3, -1.6], [-1, 0]]), 1.4, T.rnd);
  s += teil(T, schopf, wolF, lockenballen(T, schopf, 26, 1.1) + F.licht(...P(3, -5), 4, 2, 0.5, W),
    { ra: 0.35, rc: "#6a5e48", rw: 0.5, q: 0.1 });
  const kb = T.box(kopf);
  return { svg: s, box: [4, -86, 128, 0], fuesse: [23.9, 29.5, 91.1, 97.5], kopf: [kb[0] - 8, kb[1] - 6, kb[2], kb[3]] };
}

/* =====================================================================
   ZIEGE (Bunte Deutsche Edelziege, Geiß)
   ===================================================================== */
/* RECHERCHE Ziege (Bunte Deutsche Edelziege, Rassebeschreibung): seit 1928 aus den braunen Landschlägen; hell- bis
   dunkelbraun („rehbraun“) mit schwarzem AALSTRICH, Gesicht, Bauch und Beine hell bis dunkel gezeichnet (häufig:
   schwarzer Bauchstreif, schwarze Unterbeine, dunkle Gesichtsstreifen vom Auge zum Maul); kurzes, glatt anliegendes
   Haar; Stehohren, seitlich abstehend; gehörnt oder hornlos (hier: Geiß mit säbelförmig nach hinten gebogenen Hörnern
   mit Querwülsten); Bart. Geiß 70–90 cm Widerrist, 55–75 kg. Straffer Rücken, Becken breit und nicht zu steil, trockene
   Gliedmaßen (Ziegen: schlanke Läufe, deutliche Gelenke), Euter mit ZWEI Zitzen, senkrecht. Ziegenauge: hell
   bernsteingelb mit waagerechter, rechteckiger Pupille. Kurzer, aufgestellter Schwanz. Hüfthöcker und Widerrist kantig. */
function ziege(T) {
  FEIN = T.fein;
  const F = flecken(T, "#ffe6c4");
  const fell = T.lg("fell", [[0, "#b67a44"], [0.35, "#a56a38"], [0.55, "#8a5428"], [0.7, "#4a2e18"], [1, "#2a1c12"]]);
  const fern = T.lg("fern", [[0, "#7a4c28"], [0.45, "#3a2a1c"], [1, "#221a14"]]);
  const schwarz = "#1e1712", horn = "#2a221c";
  const S = 0.95, vX = 72, hX = 20;
  const vh = verschiebe(KV_H, vX - 85, S, 85), vv = verschiebe(KV_V, vX - 85, S, 85);
  const hh = verschiebe(KH_H, hX - 21, S, 21), hv = verschiebe(KH_V, hX - 21, S, 21);
  const k = 0.52;
  let s = "";
  /* ferne Beine */
  const fv = [[60, -46]].concat(verschiebe(vh, -6), verschiebe(vv, -6), [[70, -46]]);
  const fh = [[18, -50]].concat(verschiebe(hh.slice(2), 7), verschiebe(hv, 7), [[38, -46]]);
  s += teil(T, fh, fern, plastik(F, verschiebe(hh.slice(2), 7), verschiebe(hv, 7), 0.6, 0.8), { ra: 0.4, rw: 0.5 }) + rKlaue(T, hh[hh.length - 1][0] + 7, horn, k);
  s += teil(T, fv, fern, plastik(F, verschiebe(vh, -6), verschiebe(vv, -6), 0.6, 0.8), { ra: 0.4, rw: 0.5 }) + rKlaue(T, vh[vh.length - 1][0] - 6, horn, k);
  /* Euter (Geiß, zwei Zitzen) zwischen den Hinterbeinen */
  s += teil(T, [[24, -44], [29, -37], [35, -34.4], [41, -35.4], [44, -40], [40, -45]], T.lg("euter", [[0, "#6a4630"], [0.4, "#b48a78"], [1, "#9a6c60"]]),
    F.licht(36, -40, 4, 2, 0.5), { ra: 0.45, rw: 0.5 });
  s += teil(T, [[38.6, -34.4], [41, -34.6], [41.4, -30.6], [40.4, -29.2], [39.2, -30.4]], "#a8766a", "", { ra: 0.45, rw: 0.4, q: 0.1 });
  /* Rumpf, Hals, nahe Beine */
  const rumpf = [[26, -78.6], [18, -76.6], [12.4, -73], [9.6, -67]].concat(hh, hv,
    [[30, -42], [36, -43], [46, -41.4], [58, -41], [64, -43]], vh, vv,
    [[78, -47], [80.6, -55], [84, -63.6], [89, -72.4], [94, -81.4], [98.4, -89], [100, -96], [96.6, -100.6], [90, -98.4], [82, -91], [74, -83], [68, -77.6], [52, -76],
     [38, -76.8]]);
  const dR = gl(rumpf, true, T.fein ? 0.1 : 0.5);
  const wuchs = richtung([[10, 96], [26, 104], [34, 160], [64, 168], [72, 105], [84, 110], [96, 118]]);
  const innen =
    struktur(T, dR, "zfell", "#2a1608", 165, 0.1, [6, -104, 100, 0]) +
    /* Bunte Zeichnung: schwarzer Bauchstreif, schwarze Unterbeine, Aalstrich */
    form([[20, -52], [34, -45.4], [50, -44.6], [64, -46], [74, -50], [72, -36], [24, -36]], T.lg("bauchs", [[0, schwarz, 0], [0.45, schwarz, 0.85], [1, schwarz, 0.95]]), "", 0.5) +
    `<rect x="${vX - 12}" y="-34" width="22" height="34" fill="${T.lg("stief", [[0, schwarz, 0], [0.35, schwarz, 0.9], [1, schwarz, 0.95]])}"/>` +
    `<rect x="${hX - 12}" y="-40" width="24" height="40" fill="${T.lg("stief2", [[0, schwarz, 0], [0.3, schwarz, 0.9], [1, schwarz, 0.95]])}"/>` +
    strich([[14, -75], [26, -78.4], [40, -76.6], [52, -75.8], [68, -77.6], [74, -83], [82, -91], [90, -98.4], [96, -100.4]], schwarz, 2.4, 0.85) +
    /* Haare: kurz, glatt; am Rückgrat und an den Keulen etwas länger */
    haar(T, rumpf, 260, wuchs, 2, { farben: [["#3a2210", 1, 0.15, 0.32], ["#e6b47a", 0.7, 0.13, 0.3]], streuung: 16, kruemmung: 0.2, szene: 0.06 }) +
    haar(T, [[9, -72], [20, -76], [24, -62], [16, -48], [10, -54]], 50, 100, 4, { farben: [["#4a2c14", 1, 0.2, 0.45]], streuung: 14, kruemmung: 0.25, szene: 0.1 }) +
    wirbel(T, 30, -58, 2.6, 18, "#3a2210", 0.14, 0.4, 1.6) +
    /* Bau: Hüfthöcker, Sitzbein, Rippen, Schulterblatt, Hals */
    F.licht(26, -76, 5, 3, 0.55) + F.schatten(29, -70, 5, 4, 0.45) + F.licht(13, -69, 3, 5, 0.4) + F.licht(20, -62, 8, 12, 0.55, 10) +
    rumpfLicht(F, 10, 80, -77, -41) + F.licht(48, -70, 18, 5, 0.45) + F.licht(72, -66, 6, 10, 0.5, -25) + F.licht(86, -86, 6, 12, 0.45, 30) +
    F.schatten(36, -64, 6, 10, 0.4, -20) + [0, 1, 2, 3].map((i) => F.rinne(48 + i * 5, -64, 45 + i * 5, -50, 1.2, 0.18)).join("") +
    F.rinne(66, -76, 74, -54, 1.6, 0.4) + F.rinne(84, -66, 95, -86, 1.4, 0.35) + F.rinne(30, -44, 22, -54, 1.2, 0.4) +
    F.licht(vX + 2, -24, 1.2, 2.2, 0.45) + F.licht(hX - 4.4, -31.6, 1.1, 2, 0.45);
  s += teil(T, dR, fell, innen, { ra: 0.4, rw: 0.6 });
  s += rKlaue(T, hh[hh.length - 1][0], horn, k) + rKlaue(T, vh[vh.length - 1][0], horn, k);
  /* Schwanz: kurz, aufgestellt */
  const schw = [[17, -76.4], [13.4, -80.6], [11, -84], [11.8, -85.4], [15.4, -83], [19.6, -78.6]];
  s += teil(T, schw, schwarz, haar(T, schw, 18, -110, 2.6, { farben: [["#6a4a30", 1, 0.15, 0.5]], streuung: 20, szene: 0 }), { ra: 0.4, rw: 0.5, q: 0.1 });
  /* Kopf: 55° geneigt, gerades Profil, Bart */
  const G = [97, -99], W = 56, K = (pts) => dreh(pts, G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  const kopf = K([[-1, -2.4], [5, -3.6], [11, -3.8], [17, -3], [22, -1.6], [24.6, 0.6], [25, 3.2], [24, 5.2], [22, 6], [20.4, 7.2], [17, 7.4], [12, 7.8],
    [6, 9.6], [1, 9], [-2, 4.6]]);
  const dK = gl(kopf, true, 0.1);
  const kInnen =
    /* dunkle Gesichtsstreifen Auge → Maul, helleres Maul */
    F.rinne(...P(8, 1.6), ...P(17, 3), 2, 0.75) + F.rinne(...P(15, 3), ...P(24.6, 4), 2.2, 0.8) + F.schatten(...P(23, 5), 3, 2.4, 0.6, W) +
    F.licht(...P(14, -1.6), 9, 2.2, 0.5, W) + F.schatten(...P(6, 6.6), 6, 3, 0.5, W) + F.licht(...P(23, 1), 2, 1.2, 0.35, W) +
    haar(T, kopf, 100, W, 1, { farben: [["#3a2210", 1, 0.1, 0.4], ["#e6b47a", 0.6, 0.09, 0.3]], streuung: 16, szene: 0.08 });
  s += kopfTeil(T, kopf, fell, kInnen, 1, 12, { rw: 0.5 });
  s += strich(K([[22.4, 0.6], [23.6, 1.2], [24.4, 2.4]]), "#000", 0.5, 0.8, 0.1) + strich(K([[21, 6.2], [23.8, 5.6]]), "#000", 0.45, 0.7, 0.1);
  /* Bart */
  const bart = K([[15, 7.2], [20, 7], [22.6, 10], [24.6, 15.6], [23, 14.8], [21.6, 16.6], [20, 13.4], [17, 10]]);
  s += teil(T, bart, "#2a1c12", haar(T, bart, 30, W + 30, 4, { farben: [["#5a4030", 1, 0.15, 0.6]], streuung: 12, kruemmung: 0.25, szene: 0.2 }), { ra: 0.25, rw: 0.4, q: 0.1 });
  s += haar(T, bart, 26, W + 34, 4.4, { farben: [["#1e140e", 1, 0.18, 0.7], ["#6a4a34", 0.6, 0.14, 0.6]], streuung: 10, kruemmung: 0.3, szene: 0.2 });
  /* Auge: hell bernsteingelb, waagerechte rechteckige Pupille */
  const A = P(8.6, 0.8);
  s += augenhoehle(F, A[0], A[1], 1.4, 22) + T.augeReal(A[0], A[1], 1.45, { iris: "#d9b04a", iris2: "#8a6418", pupille: "quer", offen: 0.72, winkel: 22, wimpern: 8, wimpernLaenge: 0.55,
    wimpernFarbe: "#140c08" });
  /* Ohr: Stehohr, seitlich nach hinten-oben */
  const OX = P(2.4, 3.2), OW = 6;
  const ohrI = dreh([[-3, -0.2], [-8, -0.6], [-11.6, 0.2], [-8, 1.6], [-3, 1.4]], OX[0], OX[1], OW);
  const ohr = dreh([[0, -1.6], [-4, -3], [-9, -2.8], [-13, -0.6], [-13.4, 0.8], [-9, 2.6], [-4, 2.6], [0, 1.6]], OX[0], OX[1], OW);
  s += teil(T, ohr, T.lg("zohr", [[0, "#b07440"], [1, "#7a4a26"]]), form(ohrI, "#4a2e1a", "", 0.1) + F.licht(...dreh([[-7, -1.8]], OX[0], OX[1], OW)[0], 4, 0.8, 0.5, OW) +
    haar(T, ohrI, 14, 180 + OW, 1.6, { farben: [["#f0dcc0", 1, 0.08, 0.6]], streuung: 20, szene: 0 }),
    { ra: 0.45, rw: 0.45, q: 0.1 });
  /* Hörner: säbelförmig nach hinten, Querwülste */
  const B = P(3.6, -2.2);
  /* fernes Horn (versetzt, dunkler) */
  s += teil(T, [[2, 0.4], [1.6, -6], [-1.4, -12], [-6, -16.2], [-10.4, -18, 1], [-7.6, -15], [-4, -10.8], [-2, -5.4], [-2, 0.6]].map((p) => [B[0] - 2.4 + p[0], B[1] + 0.6 + p[1]].concat(p[2] ? [1] : [])),
    "#2a221c", "", { ra: 0.5, rw: 0.5, q: 0.1 });
  const hornP = [[2.2, 0.4], [1.6, -6], [-1.4, -12], [-6, -16.6], [-11.4, -18.6, 1], [-8.2, -15.4], [-4.4, -11], [-2.2, -5.4], [-2.2, 0.6]].map((p) => [B[0] + p[0], B[1] + p[1]].concat(p[2] ? [1] : []));
  let ringe = "";
  for (let i = 1; i < 9; i++) { const t = i / 9; const a = hornP[Math.floor(t * 4)], b2 = hornP[8 - Math.floor(t * 4)];
    ringe += strich([[a[0] - 0.2, a[1] + 0.6], [b2[0] + 0.2, b2[1] + 0.2]], "#000", 0.3, 0.4, 0.1); }
  s += teil(T, hornP, T.lg("horn", [[0, "#4a3e34"], [0.5, "#7a6a58"], [1, "#2e2620"]], 0, 0, 1, 0), fein(T, ringe) + F.licht(B[0] - 0.6, B[1] - 8, 1, 4, 0.5, 30), { ra: 0.5, rw: 0.5, q: 0.1 });
  const kb = T.box(kopf);
  return { svg: s, box: [9, -116, 111, 0], fuesse: [hh[hh.length - 1][0] + 3.2, hh[hh.length - 1][0] + 10.2, vh[vh.length - 1][0] - 2.8, vh[vh.length - 1][0] + 3.2],
    kopf: [kb[0] - 14, kb[1] - 22, kb[2], kb[3] + 6] };
}

module.exports = [
  { id: "ziege", de: "die Ziege", syl: "ZIE-ge", it: "la capra", itSyl: "CA-pra", en: "goat",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 1.02, hoehe: 1.16, zeichne: ziege },
  { id: "schaf", de: "das Schaf", syl: "SCHAF", it: "la pecora", itSyl: "PE-co-ra", en: "sheep",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 1.24, hoehe: 0.86, zeichne: schaf },
  { id: "schwein", de: "das Schwein", syl: "SCHWEIN", it: "il maiale", itSyl: "ma-IA-le", en: "pig",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 1.79, hoehe: 0.89, zeichne: schwein },
  { id: "esel", de: "der Esel", syl: "E-sel", it: "l'asino", itSyl: "A-si-no", en: "donkey",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 1.71, hoehe: 1.61, zeichne: esel },
  { id: "kalb", de: "das Kalb", syl: "KALB", it: "il vitello", itSyl: "vi-TEL-lo", en: "calf",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 1.18, hoehe: 0.88, zeichne: kalb },
  { id: "kuh", de: "die Kuh", syl: "KUH", it: "la vacca", itSyl: "VAC-ca", en: "cow",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 2.38, hoehe: 1.53, zeichne: kuh },
  { id: "pferd", de: "das Pferd", syl: "PFERD", it: "il cavallo", itSyl: "ca-VAL-lo", en: "horse",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 2.68, hoehe: 2.17, zeichne: pferd },
];
