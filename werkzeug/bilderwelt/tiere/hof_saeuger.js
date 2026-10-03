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
const z = (v, q) => { const n = Math.round(v / q) * q; return kurz(Math.round(n * 10) / 10); };
/* Zahl ohne führende Null: 0.5 → .5, -0.5 → -.5 */
const kurz = (n) => { const t = String(n); return t.replace(/^(-?)0\./, "$1."); };
/* Zahlenfolge kompakt: Leerzeichen nur, wo nötig (vor „-" und vor „.“ nach einer Zahl mit Punkt entfällt es) */
function folge(zahlen) {
  let d = "";
  for (const t of zahlen) {
    if (!d || t[0] === "-" || (t[0] === "." && /\.\d*$/.test(d))) d += t; else d += " " + t;
  }
  return d;
}
/* glatte Kurve (Catmull-Rom), RELATIV geschrieben (c/l), auf q gerundet – ohne Rundungsdrift */
function gl(pts, zu = true, q = 1) {
  if (!FEIN) q = Math.max(q, 0.5);       // Szene: halbe Zentimeter reichen
  const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const R = (v) => Math.round(Math.round(v / q) * q * 10) / 10;
  let cx = R(pts[0][0]), cy = R(pts[0][1]);
  let d = "M" + folge([kurz(cx), kurz(cy)]);
  const rel = (x, y) => [kurz(Math.round((R(x) - cx) * 10) / 10), kurz(Math.round((R(y) - cy) * 10) / 10)];
  let letzt = "";
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    let cmd, zs;
    if (p1[2] && p2[2]) { cmd = "l"; zs = rel(p2[0], p2[1]); }
    else {
      const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      cmd = "c"; zs = rel(c1[0], c1[1]).concat(rel(c2[0], c2[1]), rel(p2[0], p2[1]));
    }
    const f = folge(zs);
    d += (cmd === letzt ? (f[0] === "-" || (f[0] === "." && /\.\d*$/.test(d)) ? "" : " ") : cmd) + f;
    letzt = cmd;
    cx = R(p2[0]); cy = R(p2[1]);
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
  return F.licht(xm, yR + h * 0.1, rx * 0.95, h * 0.11, 0.5 * st) + F.schatten(xm, yR + h * 0.74, rx * 1.02, h * 0.2, 0.55 * st) +
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
  const f = (fill) => (x, y, rx, ry, op = 1, g = 0) => {
    if (!FEIN && op < 0.45) return "";
    const q = Math.min(rx, ry) < 2 ? 0.1 : Math.min(rx, ry) < 6 ? 0.2 : 0.5, X = z(x, q), Y = z(y, q);
    return `<ellipse ${g ? `transform="translate(${folge([X, Y])})rotate(${Math.round(g)})"` : `cx="${X}" cy="${Y}"`} rx="${z(rx, q)}" ry="${z(ry, q)}" fill="${fill}"${op !== 1 ? ` opacity="${kurz(Math.round(op * 100) / 100)}"` : ""}/>`;
  };
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
/* =====================================================================
   WERKZEUG RUNDE 2 (Kritik Runde 1: „Aufkleber-Umriss, Airbrush-Flecken, Holzmaserung statt Fell,
   Comic-Augen, Pantoffel-Hufe“) – keine Umrisslinien mehr; Kanten entstehen aus Licht und Schatten.
   ===================================================================== */
/* Zahl in Millimetern (ganzzahlig) – Haare werden in mm geschrieben und mit scale(.1) gezeichnet: halb so viele Bytes */
const mm = (v) => Math.round(v * 10);
const paar = (a, b) => a + (b < 0 ? "" : " ") + b;
/* Teilstück: Geometrie EINMAL in defs, gezeichnet/geklippt/gekantet über <use>.
   o.licht: Breite der Richtungskanten (cm); o.dunkel / o.hell: Stärke (0–1). */
function stueck(T, pts, fill, innen = "", o = {}) {
  const id = T.id("s" + (T._n = (T._n || 0) + 1));
  const d = typeof pts === "string" ? pts : gl(pts, true, o.q || 0.2);
  T.def(`<path id="${id}" d="${d}"/>`);
  let s = `<use href="#${id}" fill="${fill}"/>`;
  let i = innen;
  if (o.licht !== 0) i += kanten(T, id, o.licht || 1.5, o.dunkel != null ? o.dunkel : 1, o.hell != null ? o.hell : 1, o.hellFarbe, o.stufen);
  if (i) { T.def(`<clipPath id="${id}c"><use href="#${id}"/></clipPath>`); s += `<g clip-path="url(#${id}c)">${i}</g>`; T._clip = id + "c"; }
  return s;
}
/* Volumen je Körperteil (kern.js T.volumen): Gruppe wird über ihre eigene, weichgezeichnete Silhouette von links oben
   beleuchtet – echte Rundung, Kernschatten zur Unterkante, Licht zur Oberkante. weich ≈ 20–30 % der Teildicke (cm). */
const vol = (T, name, weich, svg, o = {}) => (T.fein && T.volumen ? `<g filter="${T.volumen(name, Object.assign({ weich }, o))}">${svg}</g>` : svg);
/* Schatten/Licht nachträglich in den Umriss des zuletzt gezeichneten Rumpfes legen (nichts fällt auf den Hintergrund) */
const imRumpf = (clip, svg) => (svg ? `<g clip-path="url(#${clip})">${svg}</g>` : "");
/* Richtungskanten: verschobene Kopie der Umrisslinie, breit gestrichen, in die Form geklippt.
   Zum Licht hin verschoben → Band an den abgewandten Kanten (Okklusion, Kernschatten am Rand);
   vom Licht weg verschoben → Band an den beleuchteten Kanten (Randlicht). Mehrere Stufen = weicher Verlauf. */
function kanten(T, id, w, dunkel, hell, hellFarbe = "#fff", eigene = null) {
  const lx = -0.45, ly = -0.89;                   // Richtung zum Licht (oben, etwas links)
  const klein = w < 1.1;
  const stufen = eigene || (!FEIN ? [[0.7, 0.4]] : klein ? [[1, 0.3], [0.4, 0.35]] : [[1, 0.22], [0.55, 0.22], [0.25, 0.25]]);
  const u = (f, op, sg) => `<use href="#${id}" stroke-opacity="${op.toFixed(2)}" stroke-width="${z(2 * w * f, 0.1)}" transform="translate(${z(sg * lx * w * f, 0.1)} ${z(sg * ly * w * f, 0.1)})"/>`;
  let s = "";
  if (dunkel > 0) s += `<g fill="none" stroke="#000">` + stufen.map(([f, op]) => u(f, op * dunkel, 1)).join("") + `</g>`;
  if (hell > 0 && FEIN) s += `<g fill="none" stroke="${hellFarbe}">` + (klein ? [[0.4, 0.3]] : [[0.5, 0.16], [0.22, 0.22]]).map(([f, op]) => u(f, op * hell, -1)).join("") + `</g>`;
  return s;
}
/* Haar für Haar in mm-Koordinaten (ein Pfad je Farbe). */
function haare2(T, pts, n, winkel, laenge, o = {}) {
  const [x0, y0, x1, y1] = T.box(pts);
  const farben = o.farben || [["#000", 1, laenge * 0.06, 0.35]];
  const summe = farben.reduce((s, f) => s + f[1], 0);
  const eimer = farben.map(() => "");
  const wf = typeof winkel === "function" ? winkel : () => winkel;
  const ziel = Math.round(n * (T.fein ? 1 : (o.szene != null ? o.szene : 0.25)));
  let versuche = 0, gemacht = 0;
  while (gemacht < ziel && versuche < ziel * 12) {
    versuche++;
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!T.inPoly(x, y, pts)) continue;
    const a = (wf(x, y) + (T.rnd() - 0.5) * (o.streuung != null ? o.streuung : 14)) * Math.PI / 180;
    const L = laenge * (0.55 + T.rnd() * 0.9);
    const ex = Math.cos(a) * L, ey = Math.sin(a) * L;
    const kr = (o.kruemmung != null ? o.kruemmung : 0.15) * L * (T.rnd() - 0.5) * 2;
    const cx = ex / 2 - Math.sin(a) * kr, cy = ey / 2 + Math.cos(a) * kr;
    let u = T.rnd() * summe, i = 0;
    while (i < farben.length - 1 && u > farben[i][1]) { u -= farben[i][1]; i++; }
    eimer[i] += "M" + paar(mm(x), mm(y)) + (L < 2.6 && Math.abs(kr) < 0.25 ? "l" + paar(mm(ex), mm(ey)) : "q" + paar(mm(cx), mm(cy)) + " " + paar(mm(ex), mm(ey)));
    gemacht++;
  }
  const p = eimer.map((d, i) => d ? `<path d="${d}" stroke="${farben[i][0]}" stroke-width="${z(farben[i][2] * 10, 0.1)}" stroke-opacity="${farben[i][3]}"/>` : "").join("");
  return p ? `<g transform="scale(.1)" fill="none" stroke-linecap="round">${p}</g>` : "";
}
/* Fellmuster: eine Kachel (S × S cm) dicht mit Haaren in Richtung 0° (nach rechts); je Zone gedreht. */
function fellMuster(T, name, L, n, farben, streu = 14, S = null) {
  const id = T.id("fm" + name);
  if (!T.fein) return `url(#${id})`;
  S = S || Math.max(3, L * 4);
  const summe = farben.reduce((s, f) => s + f[1], 0), eimer = farben.map(() => "");
  for (let k = 0; k < n; k++) {
    const x = T.rnd() * S, y = T.rnd() * S, a = (T.rnd() - 0.5) * streu * Math.PI / 180, l = L * (0.6 + T.rnd() * 0.8);
    const ex = Math.cos(a) * l, ey = Math.sin(a) * l, kr = l * 0.12 * (T.rnd() - 0.5) * 2;
    let u = T.rnd() * summe, i = 0;
    while (i < farben.length - 1 && u > farben[i][1]) { u -= farben[i][1]; i++; }
    const h = (dx, dy) => "M" + paar(mm(x + dx), mm(y + dy)) + "q" + paar(mm(ex / 2 - Math.sin(a) * kr), mm(ey / 2 + Math.cos(a) * kr)) + " " + paar(mm(ex), mm(ey));
    eimer[i] += h(0, 0);
    if (x + ex > S) eimer[i] += h(-S, 0);
    if (y + ey > S) eimer[i] += h(0, -S);
    if (y + ey < 0) eimer[i] += h(0, S);
    if (x + ex > S && (y + ey > S || y + ey < 0)) eimer[i] += h(-S, y + ey > S ? -S : S);
  }
  T.def(`<pattern id="${id}" width="${z(S, 0.1)}" height="${z(S, 0.1)}" patternUnits="userSpaceOnUse"><g transform="scale(.1)" fill="none" stroke-linecap="round">` +
    eimer.map((d, i) => d ? `<path d="${d}" stroke="${farben[i][0]}" stroke-width="${z(farben[i][2] * 10, 0.1)}" stroke-opacity="${farben[i][3]}"/>` : "").join("") + `</g></pattern>`);
  return `url(#${id})`;
}
/* Fellzone: Muster in Wuchsrichtung (winkel, Grad; 90 = abwärts) in einer Fläche */
function fellZone(T, muster, pts, winkel, deck = 1) {
  if (!T.fein) return "";
  const cid = T.id("fz" + (T._n = (T._n || 0) + 1));
  T.def(`<clipPath id="${cid}"><path d="${gl(pts, true, 0.5)}"/></clipPath>`);
  const [x0, y0, x1, y1] = T.box(pts), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.hypot(x1 - x0, y1 - y0) / 2 + 1;
  return `<g clip-path="url(#${cid})"${deck !== 1 ? ` opacity="${deck}"` : ""}><rect x="${z(cx - R, 0.5)}" y="${z(cy - R, 0.5)}" width="${z(2 * R, 0.5)}" height="${z(2 * R, 0.5)}" fill="${muster}" transform="rotate(${Math.round(winkel)} ${z(cx, 0.5)} ${z(cy, 0.5)})"/></g>`;
}
/* Saum: Haare, die über eine Kante (Silhouette oder Farbgrenze) hinauswachsen; pts = offene Linie */
function saum2(T, pts, n, winkel, laenge, farbe, w, op, o = {}) {
  if (!T.fein && !o.szene) return "";
  const wf = typeof winkel === "function" ? winkel : () => winkel;
  const lang = [];
  let ges = 0;
  for (let i = 0; i < pts.length - 1; i++) { const L = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); lang.push(L); ges += L; }
  let d = "";
  const ziel = T.fein ? n : Math.round(n * o.szene);
  for (let j = 0; j < ziel; j++) {
    let u = T.rnd() * ges, i = 0;
    while (i < lang.length - 1 && u > lang[i]) { u -= lang[i]; i++; }
    const a = pts[i], b = pts[i + 1], t = u / lang[i];
    const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
    const g = (wf(x, y) + (T.rnd() - 0.5) * (o.streuung || 24)) * Math.PI / 180, L = laenge * (0.5 + T.rnd() * 0.9);
    const ab = o.ab != null ? o.ab : 0.4;
    const kr = L * 0.15 * (T.rnd() - 0.5) * 2;
    d += "M" + paar(mm(x - Math.cos(g) * L * ab), mm(y - Math.sin(g) * L * ab)) + "q" + paar(mm(Math.cos(g) * L / 2 - Math.sin(g) * kr), mm(Math.sin(g) * L / 2 + Math.cos(g) * kr)) + " " + paar(mm(Math.cos(g) * L), mm(Math.sin(g) * L));
  }
  return `<path transform="scale(.1)" d="${d}" stroke="${farbe}" stroke-width="${z(w * 10, 0.1)}" stroke-opacity="${op}" fill="none" stroke-linecap="round"/>`;
}
/* Auge (Huftier, Seitenansicht, Blick nach rechts): Augenhöhle mit Knochenbogen, Oberlid als Hautwulst mit Lidfalte,
   mandelförmige Lidspalte, Iris (fast ganz sichtbar), waagerechte Pupille mit Traubenkörnern, Lidschatten,
   Fensterreflex statt Punkt, feuchter Unterlidrand, Karunkel vorn, Wimpern nach vorn-unten (hinten dichter, länger).
   a = halbe Lidspaltenbreite (cm). o: { winkel, iris, iris2, pupille ("quer"|"rund"), hoehe, wimpern, wl, wr, wf, haut, licht, unten } */
function auge2(T, F, x, y, a, o = {}) {
  const b = a * (o.hoehe || 0.62), g = o.winkel || 0;
  const id = T.id("au" + (T._n = (T._n || 0) + 1));
  const k = (v) => String(Math.round(v * 100) / 100);
  const oben = `M${k(-a)} ${k(0.05 * b)}C${k(-0.62 * a)} ${k(-1.15 * b)} ${k(0.3 * a)} ${k(-1.3 * b)} ${k(a)} ${k(0.2 * b)}`;
  const unten = `C${k(0.5 * a)} ${k(1.05 * b)} ${k(-0.45 * a)} ${k(1.0 * b)} ${k(-a)} ${k(0.05 * b)}Z`;
  T.def(`<clipPath id="${id}"><path d="${oben}${unten}"/></clipPath>`);
  const iris = T.rg("ir" + (o.iris || "#3a2210").slice(1), [[0, o.iris || "#3a2210"], [0.62, o.iris || "#3a2210"], [0.9, o.iris2 || "#160b05"], [1, "#0a0604"]], 0.5, 0.5, 0.5);
  const lid = T.lg("lid", [[0, "#000", 0.85], [0.38, "#000", 0.35], [0.62, "#000", 0]]);
  let s = `<g transform="translate(${k(x)} ${k(y)}) rotate(${Math.round(g)})">`;
  /* Augenhöhle: weiche Mulde rundum, heller Knochenbogen oben-hinten, Schatten unter dem Bogen */
  s += F.schatten(0, -0.2 * b, a * 1.9, b * 2.4, o.mulde != null ? o.mulde : 0.42) + F.kante(-1.7 * a, -1.6 * b, 1.3 * a, -2.5 * b, 0.55 * a, o.licht != null ? o.licht : 0.75) +
    F.schatten(0.1 * a, -1.25 * b, a * 1.3, b * 0.55, 0.5);
  /* Oberlid-Wulst und Lidfalte */
  s += `<path d="M${k(-1.05 * a)} ${k(-0.15 * b)}C${k(-0.6 * a)} ${k(-1.5 * b)} ${k(0.35 * a)} ${k(-1.65 * b)} ${k(1.05 * a)} ${k(0.05 * b)}" fill="none" stroke="${o.haut || "#fff"}" stroke-opacity=".22" stroke-width="${k(0.35 * b)}"/>`;
  s += `<path d="M${k(-0.95 * a)} ${k(-0.75 * b)}C${k(-0.5 * a)} ${k(-1.95 * b)} ${k(0.45 * a)} ${k(-1.95 * b)} ${k(0.95 * a)} ${k(-0.55 * b)}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="${k(0.09 * a)}" stroke-linecap="round"/>`;
  /* Lidspalte und Augapfel */
  s += `<path d="${oben}${unten}" fill="#120a06"/><g clip-path="url(#${id})">`;
  if (o.weiss) s += `<path d="${oben}${unten}" fill="#e8dccb"/>`;
  s += `<ellipse cx="${k(0.06 * a)}" cy="${k(0.05 * b)}" rx="${k(o.irisR ? o.irisR * a : 0.98 * a)}" ry="${k(1.08 * b)}" fill="${iris}"/>`;
  if (T.fein) {
    let fa = "";
    for (let i = 0; i < 22; i++) { const w = i / 22 * Math.PI * 2; fa += `M${k(0.06 * a + Math.cos(w) * 0.35 * a)} ${k(Math.sin(w) * 0.4 * b)}L${k(0.06 * a + Math.cos(w) * 0.9 * a)} ${k(Math.sin(w) * 1.0 * b)}`; }
    s += `<path d="${fa}" stroke="${o.iris2 || "#160b05"}" stroke-width="${k(0.03 * a)}" stroke-opacity=".5" fill="none"/>`;
  }
  if ((o.pupille || "quer") === "quer") {
    const pw = 1.15 * a * (o.pupBreite || 0.62), ph = 0.42 * b;
    s += `<rect x="${k(0.06 * a - pw / 2)}" y="${k(0.08 * b - ph / 2)}" width="${k(pw)}" height="${k(ph)}" rx="${k(ph / 2)}" fill="#040302" fill-opacity=".92"/>`;
    s += `<ellipse cx="${k(-0.12 * a)}" cy="${k(0.08 * b - ph / 2)}" rx="${k(0.16 * a)}" ry="${k(0.12 * b)}" fill="#1c1006"/><ellipse cx="${k(0.16 * a)}" cy="${k(0.08 * b - ph / 2)}" rx="${k(0.12 * a)}" ry="${k(0.1 * b)}" fill="#1c1006"/>`;
  } else s += `<circle cx="${k(0.1 * a)}" cy="${k(0.06 * b)}" r="${k(0.38 * b)}" fill="#040302"/>`;
  s += `<rect x="${k(-a)}" y="${k(-1.3 * b)}" width="${k(2 * a)}" height="${k(2.4 * b)}" fill="${lid}"/>`;
  /* Fensterreflex (oben links, der Hornhaut folgend) und schwacher Bodenreflex unten */
  s += `<path d="M${k(-0.55 * a)} ${k(-0.32 * b)}Q${k(-0.2 * a)} ${k(-0.72 * b)} ${k(0.22 * a)} ${k(-0.62 * b)}L${k(0.18 * a)} ${k(-0.36 * b)}Q${k(-0.18 * a)} ${k(-0.44 * b)} ${k(-0.4 * a)} ${k(-0.12 * b)}Z" fill="#fff" fill-opacity=".72"/>`;
  s += `<ellipse cx="${k(-0.3 * a)}" cy="${k(-0.42 * b)}" rx="${k(0.1 * a)}" ry="${k(0.08 * b)}" fill="#fff"/>`;
  s += `<path d="M${k(-0.2 * a)} ${k(0.72 * b)}Q${k(0.25 * a)} ${k(0.86 * b)} ${k(0.55 * a)} ${k(0.55 * b)}" fill="none" stroke="#d8b090" stroke-opacity=".3" stroke-width="${k(0.12 * b)}"/>`;
  s += `</g>`;
  /* Lidränder: oben kräftig, unten feucht; Karunkel vorn (zur Nase) */
  s += `<path d="${oben}" fill="none" stroke="#0a0604" stroke-width="${k(0.14 * a)}" stroke-linecap="round"/>`;
  s += `<path d="M${k(0.92 * a)} ${k(0.32 * b)}C${k(0.45 * a)} ${k(1.0 * b)} ${k(-0.45 * a)} ${k(0.95 * b)} ${k(-0.9 * a)} ${k(0.15 * b)}" fill="none" stroke="#0a0604" stroke-opacity=".6" stroke-width="${k(0.06 * a)}"/>`;
  s += `<path d="M${k(0.85 * a)} ${k(0.45 * b)}C${k(0.4 * a)} ${k(1.12 * b)} ${k(-0.42 * a)} ${k(1.08 * b)} ${k(-0.82 * a)} ${k(0.28 * b)}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="${k(0.035 * a)}"/>`;
  s += `<path d="M${k(0.78 * a)} ${k(0.02 * b)}L${k(1.1 * a)} ${k(0.22 * b)}L${k(0.8 * a)} ${k(0.42 * b)}Z" fill="#8a5050" fill-opacity=".45"/>`;
  /* Wimpern */
  const nw = o.wimpern || 0;
  if (nw && T.fein) {
    let d = "";
    for (let i = 0; i < nw; i++) {
      const t = 0.08 + 0.8 * Math.pow(i / Math.max(1, nw - 1), 1.25);
      const bx = -a + 2 * a * t * 0.92, by = -1.08 * b * Math.sin(Math.PI * Math.min(1, t * 1.02)) + 0.06 * b;
      const L = a * (o.wl || 0.55) * (0.65 + 0.5 * Math.sin(Math.PI * (1 - t) * 0.9) + 0.25 * T.rnd());
      const w = (o.wr != null ? o.wr : 12) + 18 * t + (T.rnd() - 0.5) * 14;
      const ex = Math.cos(w * Math.PI / 180) * L, ey = Math.sin(w * Math.PI / 180) * L;
      d += `M${k(bx)} ${k(by)}q${k(ex * 0.55)} ${k(ey * 0.2 - L * 0.12)} ${k(ex)} ${k(ey)}`;
    }
    s += `<path d="${d}" fill="none" stroke="${o.wf || "#1e1814"}" stroke-width="${k(0.045 * a)}" stroke-linecap="round"/>`;
    if (o.unten !== 0) {
      let u = "";
      for (let i = 0; i < 4; i++) { const t = 0.2 + i * 0.16, bx = -a + 2 * a * t, by = 0.9 * b * Math.sin(Math.PI * t); u += `M${k(bx)} ${k(by)}l${k(0.12 * a)} ${k(0.22 * a)}`; }
      s += `<path d="${u}" fill="none" stroke="${o.wf || "#1e1814"}" stroke-opacity=".6" stroke-width="${k(0.03 * a)}" stroke-linecap="round"/>`;
    }
  }
  return s + `</g>`;
}
/* Einhuferhuf: Trachten (xh) bis Zehe (xt) am Boden, Zehenhöhe h, Wand ~ winkel (Grad). Hornröhrchen parallel zur Wand,
   2 Wachstumsringe, Glanz oben auf der Wand, Haare über dem Kronrand. */
function huf2(T, F, xh, xt, h, winkel, farbe, haarFarbe) {
  const tw = h / Math.tan(winkel * Math.PI / 180), xo = xt - tw, hh = h * 0.38;
  const p = [[xh - 0.6, -0.4, 1], [xt, 0, 1], [xo, -h], [xo - (xo - xh) * 0.35, -h * 0.9], [xo - (xo - xh) * 0.7, -h * 0.66], [xh + 1.2, -hh], [xh - 0.4, -hh * 0.55]];
  let innen = "";
  if (T.fein) {
    let d = "";
    for (let i = 1; i < 9; i++) { const t = i / 9, x0 = xo - (xo - xh - 1) * t, y0 = -h + (h - hh) * t; d += `M${z(x0, 0.1)} ${z(y0, 0.1)}l${z(tw * (1 - t * 0.5), 0.1)} ${z(-y0, 0.1)}`; }
    innen += `<path d="${d}" stroke="#fff" stroke-opacity=".05" stroke-width=".15" fill="none"/>`;
    innen += [0.4, 0.7].map((t) => strich([[xh + 0.5, -hh * (1 - t) - 0.2], [xo - (xo - xh) * 0.5, -h * (1 - t) * 0.86], [xt - tw * t, -h * (1 - t)]], "#000", 0.2, 0.16, 0.1)).join("");
  }
  innen += F.kante(xo - tw * 0.1, -h * 0.85, xt - tw * 0.55, -h * 0.25, 0.9, 0.55) + F.schatten(xh + 1, -hh * 0.4, 2.2, 2.2, 0.55);
  let s = stueck(T, p, T.lg("huf" + farbe.slice(1), [[0, farbe], [1, "#000"]], 0, 0, 1, 0.3), innen, { licht: 0.8, q: 0.1 });
  s += saum2(T, [[xh + 1, -hh - 0.3], [xo - (xo - xh) * 0.45, -h * 0.82], [xo + 0.2, -h - 0.2]], 13, 95, 1.6, haarFarbe, 0.12, 0.8, { ab: 0.7 });
  return s;
}
/* Paarhuferklaue (Seitenansicht): äußere Klaue ganz, die innere als Spitze davor; Ballen hinten (heller),
   Klauenspalt, Wachstumsrillen, Glanz oben auf der Wand. xh = Ballen hinten am Boden, L = Länge, h = Höhe */
function klaue2(T, F, xh, L, h, farbe, ballen = "#8a7a74", tief = "#0c0a09") {
  const xt = xh + L, xo = xt - h * 0.85;
  const innenKl = [[xh + L * 0.35, -h * 0.9, 1], [xo + L * 0.08, -h * 0.96], [xt + L * 0.08, -h * 0.12], [xt + L * 0.06, 0, 1], [xh + L * 0.45, 0, 1]];
  const aussen = [[xh - 0.2, -h * 0.5], [xh + L * 0.25, -h * 0.93], [xo, -h * 1.02], [xt - L * 0.04, -h * 0.25], [xt, 0, 1], [xh + L * 0.12, 0, 1], [xh - 0.3, -h * 0.18]];
  let s = stueck(T, innenKl, tief === "#0c0a09" ? "#14100e" : tief, "", { licht: 0, q: 0.1 });
  let innen = F.schatten(xh + L * 0.12, -h * 0.25, L * 0.3, h * 0.4, 0.4) + F.kante(xo - L * 0.1, -h * 0.85, xt - L * 0.12, -h * 0.25, h * 0.14, 0.55);
  if (T.fein) {
    let d = "";
    for (let i = 1; i < 6; i++) { const t = i / 6; d += `M${z(xh + L * 0.25 + (xo - xh - L * 0.25) * t, 0.1)} ${z(-h * 0.93 - h * 0.09 * t, 0.1)}l${z(L * 0.12 + h * 0.3 * t, 0.1)} ${z(h * 0.85, 0.1)}`; }
    innen += `<path d="${d}" stroke="#fff" stroke-opacity=".07" stroke-width="${z(h * 0.03, 0.01)}" fill="none"/>`;
  }
  innen += `<ellipse cx="${z(xh + L * 0.12, 0.1)}" cy="${z(-h * 0.25, 0.1)}" rx="${z(L * 0.18, 0.1)}" ry="${z(h * 0.3, 0.1)}" fill="${ballen}" opacity=".7"/>`;
  s += stueck(T, aussen, T.lg("kl" + farbe.slice(1), [[0, farbe], [1, tief]], 0, 0, 1, 0.4), innen, { licht: h * 0.12, q: 0.1 });
  s += strich([[xo + L * 0.05, -h * 0.98], [xt - L * 0.02, -h * 0.2], [xt + L * 0.02, -0.1]], "#000", h * 0.06, 0.6, 0.1);
  return s;
}
/* Tasthaare: einzelne Haare, jedes aus eigenem Punkt entlang einer Linie (Oberlippe, Kinn), leicht gebogen */
function tasthaare(T, pts, n, laenge, winkel, farbe, w = 0.06) {
  if (!T.fein) return "";
  return saum2(T, pts, n, winkel, laenge, farbe, w, 0.85, { ab: 0, streuung: 40 });
}
/* Muskel-/Knochenmasse: unsichtbare Form, nur ihre Richtungskanten (innen) – Kernschatten unten-rechts, Randlicht oben-links */
function masse(T, pts, w, dunkel, hell) {
  if (!T.fein) return "";
  return stueck(T, pts, "none", "", { licht: w, dunkel, hell, q: 0.5, stufen: [[1, 0.3], [0.6, 0.12]] });
}
/* weich gezeichnete Gruppe (nur volle Feinheit): Muskelformen ohne harte Kanten */
function weich(T, inhalt, sd = 1.2) {
  if (!T.fein || !inhalt) return inhalt;
  const id = T.id("wz" + String(sd).replace(".", ""));
  if (!T["_" + id]) { T["_" + id] = 1; T.def(`<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="${sd}"/></filter>`); }
  return `<g filter="url(#${id})">${inhalt}</g>`;
}
/* Afterklaue: kleiner Hornkegel hinten am Fesselgelenk, nach hinten-unten, halb im Haar */
function afterklaue2(T, x, y, b, farbe, haarFarbe) {
  return form([[x + b * 0.3, y - b * 0.55], [x + b * 0.25, y + b * 0.45], [x - b * 0.6, y + b * 1.05, 1], [x - b * 0.55, y + b * 0.1]], farbe, "", 0.05) +
    strich([[x - b * 0.1, y - b * 0.1], [x - b * 0.5, y + b * 0.75]], "#fff", b * 0.12, 0.25, 0.05) +
    saum2(T, [[x + b * 0.3, y - b * 0.5], [x - b * 0.5, y + b * 0.05]], 6, 120, b * 0.9, haarFarbe, b * 0.06, 0.8, { ab: 0.8 });
}

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
   Stockmaß 160–175 cm (hier 168), 550–650 kg. Rumpf im Quadrat: Buggelenk–Sitzbeinhöcker ≈ Widerristhöhe; Schulter :
   Rücken : Hinterhand ≈ 1 : 1 : 1; Widerrist 3–4 % über der Kruppe („bergauf“). Kopf ≈ 60–65 cm, Hals ≈ 1,5 × Kopf,
   Kamm konvex. Schulter- und Fesselwinkel 45–55°, Huf parallel zur Fessel (gerade Huf-Fessel-Achse), Trachten ≈ ⅓ der
   Zehenlänge. Vorderbein: Unterarm oben ≈ 13 % WH breit, flaches Vorderfußwurzelgelenk („Knie“) mit Erbsenbein hinten,
   Röhre mit Beugesehne dahinter (Rinne), Fesselkopf ≈ 1,4 × Röhre mit Sporn und Kötenhaar. Hinterbein: Kniescheibe vorn
   auf Bauchhöhe, Kniefalte, Unterschenkel schräg, Sprunggelenk mit Fersenbeinhöcker; Lot vom Sitzbeinhöcker berührt
   Sprunggelenk und Röhre hinten. Schweifrübe am Ende der Kruppe, Langhaar 15–20 cm darunter, Ende verlesen (gerade).
   Kastanien (Hornwarzen) an der INNENSEITE: vorn über dem Knie, hinten unter dem Sprunggelenk – an den fernen Beinen.
   Brauner: rotbraunes, kurzes, glänzendes Sommerfell; Mähne, Schweif, Ohrränder/-spitzen und Beine ab Knie/Sprung-
   gelenk schwarz (Agouti), Grenze unregelmäßig. Auge groß, seitlich, Iris fast schwarzbraun, querovale Pupille mit
   Traubenkörnern, lange Oberwimpern nach vorn-unten. Nüstern groß, kommaförmig (10–12 % der Kopflänge). Ganasche
   ≈ 30 % der Kopflänge, Gesichtsleiste unter dem Auge, Kinn mit Kinnwulst, Tasthaare. Ohren lanzettförmig ~15 cm.
   Haarströme: Hals schräg nach hinten-unten, Schulter abwärts, Rumpf nach hinten, Kruppe strahlig von der Schweifrübe,
   Flankenwirbel vor der Kniefalte. Quellen: UMN Extension (Conformation), Practical Horseman, Wikipedia „Bay (horse)“. */
const P_HB = [[24.5, -127], [25.5, -116], [27.5, -104], [29.5, -92], [30.8, -80], [30, -70], [27.6, -63.5], [28.4, -59], [30.6, -55], [31.6, -48],
  [31.8, -36], [31.6, -27], [30.4, -23], [29.8, -19.5], [31.2, -15.5], [34, -11.5], [37, -8], [38.6, -5.5], [38.8, -3.5, 1]];
const P_HV = [[50.4, -8, 1], [47.6, -12], [45.4, -16.5], [44.4, -21], [43.4, -25], [43, -30], [43, -46], [43.6, -53], [45.2, -58], [47.6, -63],
  [51, -69], [56, -77], [61.5, -86], [66.5, -94], [70, -100], [72.5, -104.5]];
const P_VB = [[163.5, -94.5], [165, -88], [166, -78], [166.6, -66], [167, -57], [166, -53], [166.4, -49.5], [168.4, -46], [169.4, -40], [169.4, -27],
  [168.4, -23], [168, -19.5], [169.2, -15.5], [172, -11.5], [175, -8], [176.6, -5.5], [176.8, -3.5, 1]];
const P_VV = [[187.2, -8.2, 1], [184.4, -12.5], [182.2, -17], [181.2, -21], [180.4, -25], [180.2, -30], [180.2, -44], [181.4, -47], [182, -52],
  [181.8, -57], [183, -63], [185.2, -72], [186.8, -82], [188, -90], [189, -96]];
const P_KAMM = [[233, -217.5], [224, -214.5], [212, -209], [200, -201], [188, -191.5], [176, -180.5], [167, -172.5]];
function pferd(T) {
  FEIN = T.fein;
  const F = flecken(T, "#ffd2a0", "#1a0602");
  const U = ' gradientUnits="userSpaceOnUse"';
  const fell = T.lg("fell", [[0, "#a65f2c"], [0.4, "#8a4520"], [0.8, "#6a3015"], [1, "#4e220e"]], 0, -176, 0, -88, U);
  const fern = T.lg("fern", [[0, "#5a2a13"], [0.45, "#40200f"], [0.62, "#171210"], [1, "#100c0b"]], 0, -95, 0, -45, U);
  const schwarz = "#1b1513";
  const dunkelH = fellMuster(T, "d", 1.1, 110, [["#3a1406", 1, 0.06, 0.2]], 8, 6);
  const hellH = fellMuster(T, "h", 1.0, 60, [["#f6c08a", 1, 0.06, 0.18]], 8, 6);
  const beinH = fellMuster(T, "b", 1.2, 50, [["#8a7a70", 1, 0.06, 0.16]], 8, 5);
  let s = "";
  /* ---------- ferne Beine: Körperton −20 %, unten schwarz; oben im Schlagschatten des Rumpfs ---------- */
  const fernBein = (vorn, dx) => {
    const kante = vorn ? P_VB.concat(P_VV) : P_HB.slice(3).concat(P_HV);
    const pts = verschiebe(kante, dx).concat(vorn ? [[189 + dx, -110], [160 + dx, -110]] : [[72 + dx, -110], [27 + dx, -110]]);
    const innen = (vorn ? F.schatten(166 + dx, -94, 14, 16, 0.8) : F.schatten(60 + dx, -100, 22, 20, 0.8)) +
      fellZone(T, beinH, pts, 90, 0.8) +
      (vorn ? form([[145.6 + dx + 14, -72], [148.2 + dx + 14, -73], [148.6 + dx + 14, -66.5], [146 + dx + 14, -66]].map((p) => [p[0] - 14, p[1]]), "#2e2620", "", 0.1) :
        form([[30.2 + dx, -51.5], [32.6 + dx, -52.5], [32.8 + dx, -47.5], [30.4 + dx, -47]], "#2e2620", "", 0.1));
    return stueck(T, pts, fern, innen, { licht: 1.2, dunkel: 0.7, hell: 0.35 });
  };
  s += vol(T, "bein", 3, fernBein(false, 18)) + huf2(T, F, 38.6 + 18, 56.8 + 18, 9, 54, "#2a2420", "#0c0908");
  s += vol(T, "bein", 3, fernBein(true, -15)) + huf2(T, F, 176.6 - 15, 193.4 - 15, 9.5, 52, "#2a2420", "#0c0908");
  /* ---------- Rumpf, Hals und nahe Beine: EIN Umriss ---------- */
  const rumpf = P_HB.concat(P_HV, [[75, -106], [79, -105.5], [84, -103], [96, -99], [112, -94], [130, -90], [146, -88.5], [156, -89.5], [161, -92]],
    P_VB, P_VV, [[191.5, -101], [196, -108], [200, -115], [202.5, -121], [203.2, -127], [204.4, -135], [206, -146], [207.6, -158], [209.2, -170],
      [210.6, -182], [212, -192], [216, -203], [224, -210]], P_KAMM,
    [[162, -170.5], [154, -166], [144, -162], [130, -159], [116, -158], [102, -159], [90, -161], [78, -163.5], [68, -165], [60, -165], [52, -163.5],
      [44, -160], [37, -155.5], [31, -150], [27.4, -143], [25.2, -135]]);
  const zHinten = [[0, -175], [76, -175], [88, -140], [80, -100], [62, -76], [50, -60], [20, -60]];
  const zRumpf = [[76, -175], [160, -175], [158, -130], [160, -86], [80, -92], [88, -140]];
  const zSchulter = [[160, -175], [170, -175], [205, -122], [195, -92], [188, -60], [160, -60], [160, -86], [158, -130]];
  const zHals = [[170, -175], [240, -230], [222, -190], [206, -120], [205, -122]];
  const zBeine = [[[20, -62], [52, -62], [52, 0], [20, 0]], [[160, -62], [190, -62], [190, 0], [160, 0]]];
  const zLicht = [[20, -170], [90, -170], [150, -168], [170, -178], [230, -222], [222, -196], [190, -170], [160, -146], [100, -146], [40, -140], [22, -130]];
  const innen =
    /* Fell in Wuchsrichtung (Muster je Zone): Hinterhand abwärts, Rumpf nach hinten, Schulter abwärts, Hals schräg */
    fellZone(T, dunkelH, zHinten, 100) + fellZone(T, dunkelH, zRumpf, 168) + fellZone(T, dunkelH, zSchulter, 96) + fellZone(T, dunkelH, zHals, 122) +
    fellZone(T, hellH, zLicht, 160, 0.9) +
    /* Großform: Rücken hell, Kernschatten im unteren Rumpfdrittel, warmes Bodenreflexlicht am Bauch */
    rumpfLicht(F, 26, 200, -168, -88, 0.8) +
    /* Muskelmassen als eigene Formen (Kernschatten innen unten-rechts, Randlicht oben-links): Hinterhand, Unterschenkel,
       Schulter mit Oberarm, Unterarm, Armkopfmuskel am Hals */
    weich(T, masse(T, [[72, -151], [56, -161], [38, -156], [27, -141], [25.5, -126], [29, -104], [34, -95], [52, -97], [67, -101], [77, -112], [80, -132]], 4.5, 0.75, 0) +
    masse(T, [[33, -112], [50, -112], [66, -100], [56, -82], [47, -68], [36, -66], [31, -80]], 2.2, 0.65, 0) +
    masse(T, [[163, -167], [173, -165], [189, -143], [201, -124], [197, -108], [185, -100], [170, -100], [160, -112], [157, -140]], 4, 0.7, 0) +
    masse(T, [[166, -95], [188, -95], [186.5, -78], [182.5, -60], [168, -58], [166.5, -76]], 1.8, 0.6, 0) +
    masse(T, [[177, -177], [230, -214], [221, -203], [212, -186], [204, -131], [197, -124], [188, -150]], 3.2, 0.55, 0), 2.2) +
    /* Knochenpunkte: Hüfthöcker, Sitzbeinhöcker, Kniescheibe, Buggelenk, Ellbogen; Halbsehnenrinne; Gurtrinne; Rippen */
    F.licht(69, -152, 6, 2.2, 0.32, -20) + F.schatten(73, -145, 5, 4, 0.35) + F.licht(26, -128, 1.6, 3, 0.3) + F.licht(71, -103, 2.4, 3, 0.25) +
    F.rinne(30.5, -140, 33.5, -97, 2.2, 0.38) + F.schatten(88, -136, 7, 12, 0.22) +
    F.licht(199, -123, 2.4, 6, 0.3, -25) + F.schatten(194, -104, 5, 7, 0.4) + F.schatten(166, -97, 5, 4, 0.5) +
    F.schatten(157, -112, 6, 18, 0.35) + [118, 128, 138].map((x) => F.rinne(x, -134, x - 3, -108, 3, 0.1)).join("") +
    /* Hals: Kamm mit Glanzband, Drosselrinne mit Licht darüber, Kehle */
    F.glanz(196, -194, 30, 4, 0.4, -38) + F.rinne(211.5, -184, 207, -140, 1.8, 0.42) + F.kante(215.5, -184, 211, -142, 1.4, 0.35) + F.schatten(213, -194, 7, 6, 0.5) +
    /* Glanzbänder (glattes Sommerfell) auf den Wölbungen, gestreckt in Haarrichtung */
    F.licht(46, -157, 18, 2.2, 0.38, 10) + F.licht(120, -153, 26, 2, 0.3) + F.licht(176, -150, 2, 13, 0.28, -32) + F.licht(36, -122, 1.8, 14, 0.25, 4) +
    /* Flankenwirbel vor der Kniefalte */
    fein(T, wirbel(T, 84, -120, 3, 26, "#2a0e04", 0.1, 0.4, 1.3)) +
    /* Schwarze Abzeichen: Beine ab Knie / Sprunggelenk, Grenze unregelmäßig und weich */
    `<rect x="158" y="-60" width="34" height="62" fill="${T.lg("abzV", [[0, schwarz, 0], [0.12, schwarz, 0.9], [1, schwarz, 1]])}"/>` +
    `<rect x="18" y="-64" width="36" height="66" fill="${T.lg("abzH", [[0, schwarz, 0], [0.12, schwarz, 0.9], [1, schwarz, 1]])}"/>` +
    zBeine.map((z0) => fellZone(T, beinH, z0, 90)).join("") +
    [[167, -61, 4.5, 10], [170, -58, 4, 6], [180, -56, 4, 5], [175, -57, 5, 4], [184, -55, 2.5, 4], [30.5, -66, 4, 9], [45, -67, 4, 10], [38, -61, 6, 5], [34, -60, 4, 5], [41, -63, 3, 4]].map(([x, y, rx, ry]) =>
      `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${T.rg("abz", [[0, schwarz, 1], [0.55, schwarz, 0.9], [1, schwarz, 0]])}"/>`).join("") +
    /* Läufe als Zylinder: Sehne, Rinne Röhrbein/Beugesehne, Fesselkopf, Erbsenbein, Fersenbeinhöcker, Achillessehne */
    F.kante(170.6, -44, 170.8, -27, 0.7, 0.4) + F.rinne(173, -44, 173, -27, 0.55, 0.55) + F.licht(173.5, -20.5, 3, 3, 0.12) + F.licht(166.6, -51, 1.4, 2, 0.35) +
    F.kante(182.2, -55.5, 182.2, -47.5, 0.6, 0.35) + F.glanz(184.5, -76, 2.2, 9, 0.22) +
    F.kante(33, -48, 33.2, -27, 0.7, 0.4) + F.rinne(35.6, -48, 35.6, -27, 0.55, 0.55) + F.licht(36, -20.5, 3, 3, 0.12) +
    F.kante(30.4, -86, 28.8, -66, 0.8, 0.4) + F.licht(28.6, -62.5, 1.4, 1.8, 0.4) + F.rinne(46, -61, 43.6, -55, 0.7, 0.4);
  s += vol(T, "rumpf", 11, stueck(T, rumpf, fell, innen, { licht: 2.2, hell: 0.6, hellFarbe: "#ffd2a8", q: T.fein ? 0.2 : 0.5 }), { tiefe: 4, umgebung: 0.35 });
  const rk = T._clip;
  /* Kötenhaar am Fesselkopf (Sporn) */
  s += saum2(T, [[168.4, -22], [168.2, -17]], 14, 110, 2.6, "#0c0908", 0.14, 0.8, { ab: 0.3 }) + saum2(T, [[30.6, -22], [30.2, -17]], 14, 110, 2.6, "#0c0908", 0.14, 0.8, { ab: 0.3 });
  s += huf2(T, F, 38.6, 56.8, 9, 54, "#3a322c", "#0c0908") + huf2(T, F, 176.6, 193.4, 9.5, 52, "#3a322c", "#0c0908");
  /* ---------- Mähne: Haarmasse auf dem Kamm, darüber 12 Strähnenbündel, die auf die nahe Seite fallen ---------- */
  const kammAuf = (t, dy = 0) => { const q = punktAuf(P_KAMM, t); return [q[0], q[1] + dy]; };
  const mBasis = [];
  for (let i = 0; i <= 12; i++) mBasis.push(kammAuf(i / 12, -2.4 - 0.8 * Math.sin(i * 1.7)));
  for (let i = 12; i >= 0; i--) mBasis.push(kammAuf(i / 12, 4 + 1.5 * Math.sin(i * 2.3)));
  const mFarbe = T.lg("mb", [[0, "#3e3430"], [0.4, "#1b1513"], [1, "#0a0807"]], 0, 0, 0.6, 1);
  s += stueck(T, mBasis, mFarbe, haare2(T, mBasis, 46, 112, 4, { farben: [["#000", 1, 0.14, 0.5], ["#6a5a50", 0.8, 0.1, 0.45]], streuung: 16, szene: 0 }),
    { licht: 0.8, dunkel: 0.6, hell: 0.6 });
  if (T.fein) {
    for (let i = 9; i >= 0; i--) {
      const t0 = Math.max(0, i / 10 - 0.02 + (T.rnd() - 0.5) * 0.03), t1 = Math.min(1, t0 + 0.09 + T.rnd() * 0.05);
      const A = kammAuf(t0, -1.6), B = kammAuf(t1, -1.6);
      const L = 9 + 6 * Math.sin(Math.PI * Math.min(1, t0 * 1.1)) + T.rnd() * 4, w = 100 + 12 * t0 + T.rnd() * 8;
      const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, c = Math.cos(w * Math.PI / 180), si = Math.sin(w * Math.PI / 180);
      const tip = [mx + c * L - 1.2, my + si * L];
      const pts = [A, B, [B[0] + c * L * 0.45 - 0.4, B[1] + si * L * 0.45], [tip[0] + 0.6, tip[1] - 1], tip, [A[0] + c * L * 0.5 + 0.6, A[1] + si * L * 0.5]];
      s += stueck(T, pts, mFarbe, F.kante(A[0] + 0.6, A[1] + 1, tip[0] - 0.2, tip[1] - 1.2, 0.7, 0.35) +
        haare2(T, pts, 14, w - 2, L * 0.6, { farben: [["#000", 1.3, 0.13, 0.6], ["#6a5a50", 1, 0.1, 0.5], ["#b8a898", 0.25, 0.08, 0.45]], streuung: 7, kruemmung: 0.25 }) +
        F.schatten(B[0] - 1, B[1] + L * 0.5, 2, L * 0.4, 0.5, w - 90), { licht: 0 });
      s += saum2(T, [[tip[0] + 0.8, tip[1] - 2.5], tip], 4, w, 3, "#0e0b0a", 0.1, 0.7, { ab: 0.1, streuung: 10 });
    }
  } else {
    const spitzen = [];
    for (let i = 0; i <= 8; i++) { const q = kammAuf(i / 8, 0); spitzen.push([q[0] - 2, q[1] + 9 + 4 * Math.sin(Math.PI * i / 8) + (i % 2) * 3]); }
    s += form(mBasis.slice(0, 13).concat(spitzen.reverse()), "#16110f", "", 0.5);
  }
  /* ---------- Schweif: Rübe am Kruppenende, Langhaar darunter, Ende verlesen ---------- */
  const ruebe = [[37, -156.5], [31, -155.5], [26, -150], [22.5, -141], [24.5, -137], [28.5, -143], [33.5, -150]];
  const schweif = [[27, -148], [23, -147.5], [17, -137], [12, -120], [9.5, -98], [10.5, -76], [11.5, -50], [16, -48.4], [21, -49.2], [25.5, -48.5],
    [25, -72], [25.8, -96], [27, -118], [27.5, -134]];
  s += stueck(T, schweif, T.lg("sw", [[0, "#2c2420"], [0.5, "#16110f"], [1, "#0a0807"]], 0, 0, 1, 0.2),
    [[13, -120, 12.5, -60], [18, -128, 18, -56], [23, -124, 23.5, -60]].map(([x1, y1, x2, y2], i) => F.kante(x1, y1, x2, y2, 1.4, 0.45 - i * 0.1)).join("") +
    haare2(T, schweif, 80, (x, y) => 90 + (x - 18) * 0.5 + (y < -125 ? 25 : 0), 22,
      { farben: [["#000", 1.5, 0.18, 0.6], ["#5a4a42", 1, 0.13, 0.5], ["#a89888", 0.3, 0.1, 0.4]], streuung: 5, kruemmung: 0.1, szene: 0.08 }),
    { licht: 1.2, dunkel: 0.9, hell: 0.5 });
  s += stueck(T, ruebe, T.lg("rb", [[0, "#4a2a1a"], [0.35, "#221814"], [1, "#100c0b"]], 0, 0, 1, 1),
    haare2(T, ruebe, 26, 118, 3.2, { farben: [["#000", 1, 0.12, 0.55], ["#5a4a40", 0.7, 0.1, 0.45]], streuung: 14, szene: 0 }), { licht: 1, dunkel: 0.8, hell: 0.5 });
  s += saum2(T, [[12, -51], [24, -50]], 26, 92, 3, "#0e0b0a", 0.14, 0.7, { ab: 0.4, streuung: 10 });
  /* ---------- Kopf: Achse Genick → Maul, 55° geneigt, Länge 62 cm ---------- */
  const G = [232, -214.5], W = 55, K = (pts) => dreh(pts, G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  const kopfL = [[-1, -3.2], [8, -5.6], [18, -6.4], [30, -5.4], [42, -4.2], [52, -2.6], [57.5, -1], [60.6, 1.8], [62, 5.4], [62.2, 9], [61, 12.2],
    [58.8, 13.3], [59.4, 14.6], [58, 16.4], [55, 17.2], [52, 17], [49.5, 18.4], [46, 18], [40, 16.8], [32, 17.6], [26, 20.4], [19, 25], [11, 27.2],
    [4.5, 25.4], [0.5, 20.5], [-1.6, 13], [-2.2, 5]];
  const kopf = K(kopfL);
  /* Kehlgang: Schatten des Kopfes auf den Hals */
  s += imRumpf(rk, F.schatten(...P(4, 24), 9, 6, 0.55, W - 70));
  const maul = K([[47, -3.6], [57.5, -1], [62, 5.4], [62.4, 9], [61, 12.4], [58, 16.6], [52, 17.4], [46, 13]]);
  const kInnen =
    fellZone(T, dunkelH, kopf, W, 0.9) + fellZone(T, hellH, K([[0, -7], [50, -4], [50, 3], [0, 4]]), W, 0.8) +
    /* Stirn/Nasenrücken im Licht, Ganasche als runde Masse (Licht oben vorn, Kernschatten-Bogen unten hinten, Reflex) */
    F.glanz(...P(26, 1), 20, 4, 0.5, W) + F.licht(...P(40, -2.6), 14, 1.4, 0.4, W) +
    F.glanz(...P(16, 13), 8, 6, 0.55, W) + F.schatten(...P(8, 23), 10, 4, 0.5, W - 40) + F.licht(...P(12, 26), 6, 1.4, 0.25, W - 40) +
    F.schatten(...P(36, 15), 13, 3, 0.45, W) + F.schatten(...P(1, 12), 3, 9, 0.4, W) +
    /* Gesichtsleiste unter dem Auge: Licht oben, Schatten unten */
    F.kante(...P(19, 7.4), ...P(38, 6), 1.3, 0.7) + F.rinne(...P(20, 9.8), ...P(38, 8.4), 1.5, 0.55) + F.licht(...P(44, -2.8), 9, 1, 0.5, W) +
    /* Maul: dunkle, samtige Haut, nach vorn heller-feucht */
    `<ellipse cx="${z(P(57, 8)[0], 0.1)}" cy="${z(P(57, 8)[1], 0.1)}" rx="11" ry="10" transform="rotate(${W} ${z(P(57, 8)[0], 0.1)} ${z(P(57, 8)[1], 0.1)})" fill="${T.rg("maul", [[0, "#2e2220", 0.9], [0.5, "#33221a", 0.7], [1, "#3a2418", 0]])}"/>` +
    F.licht(...P(56, 2), 3, 2.2, 0.25, W) + F.schatten(...P(51.5, 16), 3, 1.4, 0.55, W) +
    fein(T, `<g opacity=".5">${haare2(T, maul, 26, W + 10, 0.7, { farben: [["#c8b4a0", 1, 0.08, 0.5]], streuung: 40 })}</g>`);
  s += vol(T, "kopf", 4, stueck(T, kopf, fell, kInnen, { licht: 1.4, hell: 0.45, q: 0.1 }), { tiefe: 4, umgebung: 0.35 });
  T._kopf = T._clip;
  /* Nüster: groß, Kommaform, Öffnung nach vorn-oben; Nüsternflügel als helle Hautkante */
  const nueF = K([[47.6, 2.2], [51.6, 0.9], [55, 2], [56.4, 5], [55.6, 8.4], [53.6, 9.8], [53.6, 7], [52.6, 4.6], [49.8, 4]]);
  s += form(nueF, T.rg("nue", [[0, "#050302"], [0.6, "#1a0f0a"], [1, "#3e2a22"]], 0.62, 0.42, 0.62), "", 0.05);
  s += strich(K([[47.2, 1.5], [51.6, 0.1], [55.6, 1.4], [57, 5.2], [56, 9]]), "#c8ae98", 0.5, 0.45, 0.05) + strich(K([[48.6, 4.6], [52, 5.2], [53, 8]]), "#000", 0.6, 0.4, 0.05);
  /* Maulspalte, Unterlippe, Kinnwulst, Tasthaare */
  s += strich(K([[59, 13.3], [56, 13.5], [53, 13.9]]), "#000", 0.6, 0.7, 0.05) + strich(K([[58.8, 14.4], [57.6, 16.2], [55, 17]]), "#d8c0a8", 0.35, 0.3, 0.05);
  if (T.fein) {
    s += tasthaare(T, K([[54, 13.2], [58, 12.8], [61, 11.6], [62.2, 8]]), 9, 3.4, W + 45, "#1c1410") + tasthaare(T, K([[48, 18.2], [52, 17.4], [57, 16.6]]), 8, 3, W + 80, "#1c1410");
  }
  /* Auge: groß, seitlich, im Augenbogen */
  const A = P(18.5, 2.6);
  s += imRumpf(T._kopf, F.schatten(...P(11, -3.4), 5, 3, 0.45, W)) + auge2(T, F, A[0], A[1], 3.3, { winkel: 30, iris: "#3c2414", iris2: "#120804", hoehe: 0.7, wimpern: 18, wl: 0.8, wr: 10, haut: "#e0a070", mulde: 0.5 });
  /* Ohren: fernes dunkler; nahes mit Muschel (dunkle Tiefe, helle Haare), schwarzer Rand und Spitze */
  const ohrL = [[-3.4, 0.5], [-4.4, -5], [-3.6, -11], [-1.4, -15.5], [0.2, -17.5, 1], [2, -14], [3.6, -8.5], [3.8, -2.6], [2.6, 1.2]];
  const ohrF = T.lg("ohr", [[0, "#0c0908"], [0.2, "#2a1a12"], [0.42, "#7a3e1e"], [1, "#8a4520"]]);
  const OF = P(-1, -3.5), ON = P(3, -4.2);
  s += stueck(T, dreh(ohrL, OF[0], OF[1], -16), "#2a1810", "", { licht: 0.6, dunkel: 0.5, hell: 0.3, q: 0.1 });
  const oI = dreh([[-2.2, -0.5], [-2.6, -6], [-1.4, -12], [0.1, -14.6], [1.4, -10], [1.6, -4]], ON[0], ON[1], -6);
  s += stueck(T, dreh(ohrL, ON[0], ON[1], -6), ohrF,
    form(oI, T.lg("ohri", [[0, "#2a160c"], [1, "#4a2a18"]], 1, 0, 0, 0), "", 0.05) + haare2(T, oI, 26, 268, 2.6, { farben: [["#e8d4bc", 1, 0.07, 0.6]], streuung: 22, szene: 0.3 }) +
    strich(dreh([[-4.2, -4], [-3.6, -11], [-1.3, -15.6]], ON[0], ON[1], -6), "#0c0908", 0.7, 0.75, 0.05), { licht: 0.6, dunkel: 0.6, hell: 0.4, q: 0.05 });
  /* Schopf: Strähnen zwischen den Ohren, über die Stirn bis Augenhöhe */
  if (!T.fein) s += form(K([[-2, -7], [8, -6.4], [16, -4.6], [19, -2], [14, -1.6], [8, -2.8], [2, -2.4]]), "#1b1513", "", 0.5);
  else {
    /* Schopf als lockere Strähnen: dünne, spitz auslaufende Bündel und Einzelhaare, unten durchscheinend */
    let d = "";
    for (let i = 0; i < 9; i++) {
      const b0 = P(-0.6 + i * 1.0, -5.8 - (i % 2) * 0.4), L = 7 + ((i * 7) % 5) * 1.5, w = W + 18 - i * 3.5 + (T.rnd() - 0.5) * 6;
      const c = Math.cos(w * Math.PI / 180), si = Math.sin(w * Math.PI / 180), br = 0.55 + (i % 3) * 0.2;
      const tip = [b0[0] + c * L, b0[1] + si * L], m = [b0[0] + c * L * 0.5 + si * 0.6, b0[1] + si * L * 0.5 - c * 0.6];
      d += `M${z(b0[0] - si * br, 0.05)} ${z(b0[1] + c * br, 0.05)}Q${z(m[0] - si * br, 0.05)} ${z(m[1] + c * br, 0.05)} ${z(tip[0], 0.05)} ${z(tip[1], 0.05)}Q${z(m[0] + si * br, 0.05)} ${z(m[1] - c * br, 0.05)} ${z(b0[0] + si * br, 0.05)} ${z(b0[1] - c * br, 0.05)}Z`;
    }
    s += `<path d="${d}" fill="${T.lg("schopf", [[0, "#2a2220"], [0.6, "#151110"], [1, "#151110", 0.6]])}"/>`;
    s += haare2(T, K([[-1, -7], [10, -7], [16, -2], [12, 0], [2, -2]]), 30, W + 8, 5, { farben: [["#000", 1, 0.08, 0.55], ["#7a6a60", 0.7, 0.07, 0.45]], streuung: 16, kruemmung: 0.3 });
  }
  const kb = T.box(kopf);
  return { svg: s, box: [5, -236, 272, 0], fuesse: [47, 66, 170, 186], kopf: [kb[0] - 4, kb[1] - 27, kb[2] + 2, kb[3] + 2] };
}
/* Punkt bei Anteil t (0–1) entlang einer Polylinie */
function punktAuf(pts, t) {
  const L = [];
  let g = 0;
  for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); L.push(l); g += l; }
  let u = t * g, i = 0;
  while (i < L.length - 1 && u > L[i]) { u -= L[i]; i++; }
  const f = Math.min(1, u / L[i]);
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
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
  return haare2(T, kreis, n, (px, py) => Math.atan2(py - y, px - x) * 180 / Math.PI + 70, laenge,
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
/* RECHERCHE Kuh (Deutsche Holsteins, Zuchtprogramm/Exterieur, Holstein-Linearbeschreibung): Widerristhöhe 145–156 cm,
   650–750 kg; großrahmig, „milchtypisch“: wenig Fleisch, kantige Knochen. Hüfthöcker ragen über die Rückenlinie, Kruppe
   lang und breit, fällt vom Hüft- zum Sitzbeinhöcker 5–7 % WH ab; Hüftgelenk mittig; Hungergrube vor dem Hüfthöcker;
   4–6 flache Rippen; Rumpftiefe ≈ 50 % WH. Hinterbein von der Seite mäßig gewinkelt (Sprunggelenk 145–150°, auf 27–30 %
   WH), trocken; Röhre leicht nach vorn geneigt, Fesselgelenk verdickt, Fessel ~50°, Afterklauen hinten am Fesselgelenk.
   Klauen: Dorsalwand 45–50°, Zehe ≈ 1,7 × Trachtenhöhe, Ballen hinten weich. Vorhand: Buggelenk, Triel ragt vor die
   Vorderbeine, kleine Wamme in 2–3 Falten, Ellbogen, Unterarm verjüngt zum flachen Vorderfußwurzelgelenk. Euter mäßig
   tief, Boden über dem Sprunggelenk, Hintereuter hoch und breit zwischen den Schenkeln, Vordereuter fließend in die
   Bauchwand; 4 Zitzen 5–6 cm, zylindrisch; Milchader geschlängelt bis zum Milchbrunnen. Schwanz am Ansatz zwischen den
   Sitzbeinhöckern leicht erhaben, hängt frei, verjüngt sich, Quaste dicht, weiß, bis unter das Sprunggelenk.
   Farbe: schwarze Platten mit unregelmäßigen, „landkartenartigen“ Rändern auf Weiß (Haarsaum statt Linie), Bauch, Beine,
   Quaste weiß; Kopf schwarz mit Blesse. Hörner: Rasse gehörnt, in deutschen Laufställen ~97 % hornlos (enthornt oder
   genetisch hornlos) → hornlos, rundes Genick mit Haarschopf. Kopf ≈ 50 cm: breite flache Stirn, gerader Nasenrücken,
   Ganasche mit Kaumuskel, Kehlgang, breites Flotzmaul (haarlos, feucht, feines Rillenmuster, gedecktes Rosa mit grauen
   Pigmentflecken), Nasenloch kommaförmig, überhängende Oberlippe, Maulspalte 18–22 % der Kopflänge; Ohren seitlich-waag-
   recht, löffelförmig, innen lange weiße Haare, gelbe Ohrmarke (Pflicht in Deutschland). Auge seitlich vorstehend,
   waagerechte Pupille, Wimpern nur oben. Haarstrich: Rücken nach hinten, Flanke 30–60° nach hinten-unten, Beine abwärts,
   Hals zur Schulter, Wirbel an Flanke und Stirn. Quellen: masterrind.com/mdc.de Zuchtprogramme, Holstein USA „Linear
   Traits“, PDCA Scorecard, Bundestag-Drs. 18/11818 (Enthornung), Krogmeier 2020. */
const K_HB = [[20.5, -137], [21.4, -127], [24, -114], [27, -100], [29.2, -86], [30.2, -74], [29, -62], [27, -52.5], [25.8, -48.6], [26.8, -45], [30, -41.6],
  [31.8, -36], [32, -28], [31.8, -20], [30.8, -15.5], [30.4, -12.5], [31.8, -9], [34, -5.6], [35.4, -3, 1]];
const K_HV = [[45.4, -6.8, 1], [43, -10], [41.6, -14], [40.6, -18], [39.6, -24], [39.2, -34], [39.4, -41], [40.8, -47], [43.4, -53], [46.5, -59]];
const K_VB = [[158.5, -80], [160, -70], [161, -58], [161.6, -46], [160.8, -41], [161.4, -37], [162.8, -33], [163.2, -24], [162.8, -17.5], [162, -14],
  [162.6, -10.5], [164.6, -6.6], [166.8, -3.2, 1]];
const K_VV = [[176.6, -6.8, 1], [174.4, -10], [173.4, -14], [172.6, -18], [171.6, -24], [171.2, -33], [172.6, -37], [172.8, -44], [173.8, -52], [175.2, -62], [176.6, -72]];
function kuh(T) {
  FEIN = T.fein;
  const F = flecken(T, "#fff8ea", "#1a1820");
  const U = ' gradientUnits="userSpaceOnUse"';
  const weiss = T.lg("weiss", [[0, "#fbf9f4"], [0.45, "#f0ece4"], [0.8, "#d8d2c8"], [1, "#c8c2b7"]], 0, -150, 0, -70, U);
  const fernW = T.lg("fernW", [[0, "#8e8a84"], [0.5, "#aeaaa2"], [1, "#a29e96"]], 0, -90, 0, 0, U);
  const schwarz = "#1c1b1e", horn = "#3a3836";
  const wH = fellMuster(T, "w", 1.4, 80, [["#8a8276", 1, 0.06, 0.2]], 10, 6);
  const sH = fellMuster(T, "s", 1.2, 80, [["#6a7280", 1, 0.05, 0.16]], 8, 6);
  let s = "";
  /* ---------- ferne Beine: kühler, 20–25 % dunkler, mit Zylinder-Licht ---------- */
  const fernBein = (vorn, dx) => {
    const pts = verschiebe(vorn ? K_VB.concat(K_VV) : K_HB.slice(5).concat(K_HV), dx).concat(vorn ? [[178 + dx, -90], [158 + dx, -90]] : [[52 + dx, -96], [30 + dx, -96]]);
    return stueck(T, pts, fernW, fellZone(T, wH, pts, 90, 0.8) + F.schatten(vorn ? 166 + dx : 40 + dx, vorn ? -80 : -80, 12, 14, 0.7) +
      F.rinne((vorn ? 164.5 : 33) + dx, -36, (vorn ? 165 : 33.4) + dx, -18, 0.8, 0.45), { licht: 1.2, dunkel: 0.6, hell: 0.4 });
  };
  s += vol(T, "bein", 3, fernBein(false, 16)) + klaue2(T, F, 35.4 + 16, 13.5, 7.5, "#4a4644", "#8a7e78") + afterklaue2(T, 30.6 + 16, -12.5, 1.6, "#3a3634", "#c8c2b8");
  s += vol(T, "bein", 3, fernBein(true, -13)) + klaue2(T, F, 166.8 - 13, 13.5, 7.5, "#4a4644", "#8a7e78") + afterklaue2(T, 162 - 13, -12.5, 1.6, "#3a3634", "#c8c2b8");
  /* ---------- Rumpf mit Hals, Euter und nahen Beinen ---------- */
  const rumpf = K_HB.concat(K_HV, [[48.6, -55], [53, -52.4], [60, -51.4], [68, -51.6], [74, -53.4], [79, -57], [83, -61.5], [88, -66.5], [96, -70.4], [108, -72.6],
    [125, -74], [140, -75.5], [152, -77], [157, -79]], K_VB, K_VV,
    [[179.5, -78], [184, -82.5], [188, -87], [190.5, -93], [192.6, -100], [194, -104], [196.5, -107], [200, -112], [204, -118], [208, -124], [212, -129.5],
      [216, -134], [222, -141], [226, -143.5], [220, -144.5], [210, -145], [198, -145.4], [186, -146], [176, -147], [170, -147.6], [166, -146.8], [158, -144.5],
      [146, -143.5], [130, -143], [114, -143.5], [98, -145], [86, -147], [76, -148.5], [68, -151], [63, -152.4], [58, -151], [50, -148.4], [42, -145.5],
      [34, -143], [28, -141.4], [24, -140], [21, -138.5]]);
  const wuchs = richtung([[15, 95], [45, 100], [70, 160], [140, 165], [158, 100], [180, 100], [205, 125]]);
  /* Platten: Ränder wie Küstenlinien; der Haarsaum verzahnt Schwarz und Weiß in Wuchsrichtung */
  const p1 = zackig(T, [[146, -160], [232, -160], [232, -122], [214, -120], [205, -110], [198, -101], [191, -95], [184, -98], [178, -106], [166, -110],
    [155, -104], [147, -113], [142, -130], [143, -150]], 1.1, 3);
  const p2 = zackig(T, [[92, -160], [132, -160], [134, -138], [129, -122], [134, -106], [126, -93], [112, -89], [100, -95], [92, -108], [86, -128]], 1.1, 3);
  const p3 = zackig(T, [[0, -160], [68, -160], [72, -140], [64, -125], [69, -112], [58, -103], [50, -100], [44, -92], [33, -87], [22, -91], [10, -104], [0, -114]], 1.1, 3);
  const p4 = zackig(T, [[150, -98], [159, -100], [161, -91], [154, -86], [148, -91]], 0.8, 2);
  const p5 = zackig(T, [[77, -104], [85, -106], [87, -97], [81, -93], [75, -97]], 0.8, 2);
  const platten = [p1, p2, p3, p4, p5];
  const zHinten = [[0, -165], [74, -165], [86, -130], [70, -96], [56, -60], [20, -60]];
  const zRumpf = [[74, -165], [150, -165], [150, -110], [156, -70], [90, -70], [86, -130]];
  const zVorn = [[150, -165], [240, -160], [210, -110], [180, -70], [156, -70], [150, -110]];
  const zBeine = [[[20, -62], [50, -62], [50, 0], [20, 0]], [[154, -72], [182, -72], [182, 0], [154, 0]]];
  /* Euter: Haut gedeckt rosa, oben fließend in die Bauchwand; nahes Hinterbein liegt davor */
  const euter = [[40, -92], [58, -86], [74, -78], [84, -70], [84, -62], [78, -56], [68, -51.5], [54, -51.5], [44, -58]];
  const hinterbein = K_HB.slice(2).concat(K_HV, [[45.4, -63], [47.4, -71], [50.6, -80], [55, -89], [60, -97], [50, -104], [30, -106]]);
  const innen =
    fellZone(T, wH, zHinten, 100) + fellZone(T, wH, zRumpf, 160) + fellZone(T, wH, zVorn, 112) + zBeine.map((q) => fellZone(T, wH, q, 90)).join("") +
    form(euter, T.lg("euter", [[0, "#e4cfc4", 0], [0.45, "#e0c4b8", 0.7], [1, "#cba092", 1]]), "", 0.5) +
    F.licht(68, -60, 8, 3, 0.35) + F.schatten(62, -53, 16, 2.4, 0.45) + F.rinne(60, -72, 62, -53, 1.2, 0.28) +
    fein(T, strich([[80, -63], [74, -60.4], [68, -62.6], [62, -60.4]], "#a07078", 0.45, 0.2) + strich([[76, -69], [69, -66.4], [62, -68]], "#a07078", 0.4, 0.16)) +
    haare2(T, euter, 26, 92, 0.8, { farben: [["#fff", 1, 0.05, 0.5]], streuung: 30, szene: 0 }) +
    /* Schatten des Rumpfs auf Euter-Oberteil und Beinansätze */
    F.schatten(64, -82, 26, 8, 0.4) +
    /* nahes Hinterbein vor dem Euter (verdeckt dessen hinteres Drittel) */
    form(hinterbein, weiss, "", 0.2) + F.rinne(48.4, -60, 61, -94, 1.6, 0.5) +
    /* Platten mit Haarsaum und Fell */
    platten.map((p) => form(T.fein ? p : vieleck(p), schwarz, "", 0.3)).join("") +
    fein(T, platten.map((p) => fellZone(T, sH, p, p === p1 ? 112 : p === p2 ? 160 : 100, 1)).join("")) +
    fein(T, platten.map((p, i) => { const r = p.concat([p[0]]), n = i < 3 ? 62 : 18;
      return saum2(T, r, n, wuchs, 1.6, schwarz, 0.07, 0.75, { streuung: 30 }) + saum2(T, r, Math.round(n * 0.5), wuchs, 1.5, "#f2eee6", 0.07, 0.7, { streuung: 30 }); }).join("")) +
    /* Glanz auf Schwarz: breite Bänder in Haarrichtung (keine runden Kleckse) */
    F.licht(40, -148, 20, 1.8, 0.35, 10) + F.licht(110, -150, 22, 1.8, 0.3, 2) + F.licht(190, -144, 20, 1.6, 0.3, -2) + F.licht(160, -130, 2, 12, 0.22, -30) +
    /* Großform: Rücken hell, Kernschatten bei 65–75 % der Rumpftiefe, Bodenreflex */
    rumpfLicht(F, 20, 190, -150, -72, 0.8) +
    /* Muskel- und Knochenformen, weich */
    weich(T, masse(T, [[64, -152], [44, -146], [24, -140], [21, -126], [26, -100], [30, -86], [48, -90], [60, -100], [70, -118], [76, -140]], 3.6, 0.65, 0) +
      masse(T, [[150, -146], [168, -146], [186, -118], [192, -101], [186, -86], [174, -78], [160, -80], [152, -100], [148, -128]], 3.4, 0.6, 0) +
      masse(T, [[158, -82], [177, -80], [175, -62], [173, -48], [162, -46], [160, -62]], 1.6, 0.5, 0) +
      masse(T, [[180, -146], [222, -144], [214, -132], [204, -118], [194, -104], [186, -118]], 2.4, 0.45, 0), 1.8) +
    /* Hüfthöcker (Knochenbuckel mit Glanzpunkt, Schatten dahinter), Sitzbeinhöcker, Hüftgelenk, Hungergrube, Kniefalte */
    F.licht(62, -150, 4.4, 1.4, 0.4, -12) + F.schatten(66, -143, 6, 4, 0.45) + F.licht(22.4, -136.6, 1, 2.4, 0.3) +
    F.schatten(43, -119, 7, 4, 0.3) + F.schatten(80, -132, 8, 12, 0.32, 15) + F.licht(83, -122, 4, 9, 0.18, 15) +
    F.rinne(58, -98, 66, -112, 1.6, 0.4) + [100, 108, 116, 124, 132].map((x) => F.rinne(x, -126, x - 6, -94, 2, 0.12)).join("") +
    [104, 112, 120, 128].map((x) => F.kante(x, -124, x - 6, -96, 1.6, 0.1)).join("") +
    /* Vorhand: Buggelenk, Ellbogen, Triel; Wamme in Falten */
    F.licht(192, -104, 2.4, 4, 0.35) + F.schatten(167, -80, 6, 4, 0.45) + F.rinne(197, -110, 203, -118, 1, 0.35) + F.rinne(192, -98, 196, -104, 1, 0.3) +
    F.kante(190, -96, 194, -102, 0.8, 0.3) +
    /* Milchader: erhabener, geschlängelter Strang mit Licht oben und Schatten unten, endet im Milchbrunnen */
    fein(T, strich([[90, -68.4], [97, -70.2], [104, -69.4], [111, -71.6], [118, -71]], "#fff", 1.2, 0.35) + strich([[90, -67.2], [97, -69], [104, -68.2], [111, -70.4], [118, -69.8]], "#6a6058", 1, 0.3)) +
    F.schatten(121, -70.6, 1.8, 1.2, 0.5) +
    /* Läufe: Sehne, Gelenke, Kontaktschatten des Rumpfs */
    F.rinne(165, -32, 165.5, -18, 0.8, 0.45) + F.rinne(34, -38, 34.4, -18, 0.8, 0.45) + F.licht(161.5, -40, 1.2, 2.4, 0.4) + F.licht(27.4, -48, 1.4, 2.6, 0.5) + F.rinne(29.4, -70, 27.4, -52, 0.8, 0.4) +
    F.schatten(168, -72, 9, 6, 0.4) + F.kante(29.8, -84, 28.2, -52, 0.8, 0.3) +
    wirbel(T, 84, -112, 3, 24, "#8a8276", 0.08, 0.45, 1.6);
  s += vol(T, "rumpf", 11, stueck(T, rumpf, weiss, innen, { licht: 2, dunkel: 0.6, hell: 0.5, q: T.fein ? 0.2 : 0.5 }), { tiefe: 4, umgebung: 0.4 });
  const rk = T._clip;
  s += klaue2(T, F, 35.4, 13.5, 7.5, "#4a4644", "#9a8a84") + afterklaue2(T, 30.6, -12.5, 1.8, "#3a3634", "#e8e4dc");
  s += klaue2(T, F, 166.8, 13.5, 7.5, "#4a4644", "#9a8a84") + afterklaue2(T, 162.2, -12.5, 1.8, "#3a3634", "#e8e4dc");
  /* Zitzen: ferne zuerst (dunkler), dann nahe; zylindrisch, Spitze dunkler, Glanzkante */
  const zitze = (x, y, f, k) => stueck(T, [[x - 1.3, y - 1], [x + 1.3, y - 1], [x + 1.2, y + 3.4], [x + 0.8, y + 5], [x - 0.8, y + 5], [x - 1.2, y + 3.4]], f,
    F.kante(x - 0.7, y, x - 0.6, y + 4, 0.35, 0.5 * k) + F.schatten(x, y + 4.6, 1.2, 0.8, 0.35), { licht: 0.4, dunkel: 0.6, hell: 0, q: 0.05 });
  s += zitze(55.2, -51.6, "#b08a82", 0.5) + zitze(71.4, -52.4, "#b08a82", 0.5) + zitze(52, -51.2, "#ccaaa0", 1) + zitze(68.4, -51.8, "#ccaaa0", 1);
  /* ---------- Schwanz: frei hängend, verjüngt; Schwarz → Weiß als Haargrenze; dichte Quaste ---------- */
  const schwanz = [[27.5, -142.5], [22, -141.8], [18.4, -136], [16.6, -126], [15.8, -110], [15.4, -90], [15.4, -70], [15.6, -52], [18, -52], [18.2, -70],
    [18.4, -90], [19, -110], [20.4, -125], [23.4, -134], [27.5, -137.5]];
  s += stueck(T, schwanz, T.lg("schw", [[0, schwarz], [0.42, "#26252a"], [0.5, "#e8e4dc"], [1, "#d4cfc6"]], 0, -142, 0, -52, U),
    fein(T, saum2(T, [[15.4, -100], [19, -100]], 14, 92, 2.4, schwarz, 0.08, 0.8, { streuung: 10 })) + F.kante(16.4, -126, 16, -60, 0.6, 0.35), { licht: 0.8, dunkel: 0.7, hell: 0.3 });
  const quaste = [[15.2, -56], [18.4, -56], [20.6, -46], [21.6, -32], [20.8, -20], [19, -14], [17.6, -17], [16, -11], [14.4, -16], [12.6, -13], [12, -24], [12.6, -38], [13.6, -48]];
  s += stueck(T, quaste, T.lg("qu", [[0, "#ebe7df"], [1, "#c8c2b8"]], 0, 0, 1, 0),
    haare2(T, quaste, 80, (x) => 90 + (x - 16.5) * 2.2, 13, { farben: [["#a8a094", 1, 0.08, 0.6], ["#fff", 0.9, 0.07, 0.75]], streuung: 6, kruemmung: 0.25, szene: 0.1 }),
    { licht: 0.9, dunkel: 0.7, hell: 0.4 });
  s += saum2(T, [[12.4, -16], [16, -12], [19.4, -14]], 14, 92, 4, "#d8d2c8", 0.08, 0.8, { ab: 0.1, streuung: 18 });
  /* ---------- Kopf: Achse Genick → Flotzmaul, 62° geneigt, 50 cm ---------- */
  const G = [226, -140], W = 62, K = (pts) => dreh(pts, G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  const kopf = K([[-1, -3], [6, -6.2], [14, -7.4], [24, -6.8], [34, -5.8], [42, -5], [47, -3.6], [50.4, -1], [51.8, 3.6], [52.2, 8.4], [51.6, 12.2],
    [49.8, 13.8], [49.6, 14.6], [47.8, 17], [44, 18.2], [36, 17.6], [28, 19], [20, 23.4], [12, 26.4], [5.4, 24.6], [1, 18], [-1.6, 8]]);
  s += imRumpf(rk, F.schatten(...P(3, 22), 7, 5, 0.5, W));
  const blesse = K([[2, -8], [10, -8.6], [22, -8], [36, -6.8], [45, -5.4], [52.6, -1], [53, 5], [50.4, 6.6], [47, 4.4], [43.4, 0], [36, -1.8], [26, -2.6],
    [18, -2.4], [12, -3.6], [6, -4.2]]);
  const flotz = K([[44.4, -4.6], [50.8, -1.4], [52.6, 3.6], [52.8, 8.4], [52, 12.4], [49.8, 13.8], [46.4, 12.6], [44.8, 7.4], [44, 1.4]]);
  const kInnen =
    fellZone(T, sH, kopf, W - 180, 0.9) + form(blesse, "#f3efe8", "", 0.1) + fellZone(T, wH, blesse, W - 180, 0.9) +
    saum2(T, blesse.concat([blesse[0]]), 52, W - 180, 1.2, schwarz, 0.06, 0.7, { streuung: 30 }) +
    wirbel(T, ...P(10, -4.6), 2.4, 24, "#9a958c", 0.07, 0.6, 1.2) +
    /* Stirn breit-flach im Licht, Kaumuskel als Masse, Kehlgang, Gesichtsleiste */
    F.licht(...P(20, -3), 14, 3.4, 0.3, W) + F.kante(...P(8, 7), ...P(22, 9), 1.6, 0.3) + F.schatten(...P(14, 20), 9, 3.6, 0.55, W) +
    F.schatten(...P(4, 16), 4, 8, 0.45, W) + F.kante(...P(18, 5.4), ...P(32, 5), 1.1, 0.4) + F.rinne(...P(19, 7.6), ...P(32, 7.4), 1.3, 0.5) +
    F.schatten(...P(36, 15.4), 10, 2.4, 0.4, W) +
    /* Flotzmaul: haarlos, feucht, Rillenmuster, graue Pigmentflecken */
    form(flotz, T.lg("flotz", [[0, "#d4a8a0"], [0.6, "#c4948c"], [1, "#a87870"]], 0, 0, 0.4, 1), "", 0.05) +
    fein(T, `<g opacity=".3">${haare2(T, flotz, 45, 0, 0.4, { farben: [["#6a3a38", 1, 0.06, 0.8]], streuung: 180, kruemmung: 0.4 })}</g>`) +
    `<ellipse cx="${z(P(48.4, 9)[0], 0.1)}" cy="${z(P(48.4, 9)[1], 0.1)}" rx="1.6" ry="1.1" fill="#6a6268" opacity=".5"/>` +
    F.licht(...P(49, -0.2), 2.6, 1, 0.75, W - 30) + F.licht(...P(51.6, 6), 0.6, 1.8, 0.6, W) +
    fein(T, [[47, 2.4], [49.4, 3.8], [51, 9], [47.6, 10.4], [45.8, 5.6], [50.6, 11.4]].map(([x, y]) => F.licht(...P(x, y), 0.25, 0.2, 0.9)).join(""));
  s += vol(T, "kopf", 3.5, stueck(T, kopf, schwarz, kInnen, { licht: 1.4, dunkel: 0.8, hell: 0.5, hellFarbe: "#c8ccd8", q: 0.1 }), { tiefe: 4, umgebung: 0.4 });
  /* Nasenloch: Kommaform, Nasenflügel als Lichtkante, tiefer Schatten innen */
  s += form(K([[47, 0.8], [50, 0.2], [51.6, 2.4], [51.2, 6.4], [49.6, 7.6], [49.6, 5], [48.4, 3]]), T.rg("nl", [[0, "#1a0c0c"], [0.7, "#3a1a1a"], [1, "#7a4a48"]], 0.6, 0.4, 0.6), "", 0.05);
  s += strich(K([[46.4, 0.2], [49.8, -0.8], [52.2, 2], [52, 6.6]]), "#f0d0c8", 0.35, 0.55, 0.05);
  /* Maulspalte (lang, nach hinten auslaufend), Unterlippe, Kinn, Tasthaare */
  s += strich(K([[50, 13.8], [45, 14.8], [40, 14.8]]), "#2a1414", 0.5, 0.7, 0.05) + strich(K([[49.6, 14.8], [47.6, 16.6], [44, 17.6]]), "#d0b0a8", 0.3, 0.3, 0.05);
  s += tasthaare(T, K([[42, 17.8], [46, 17], [49, 15]]), 8, 2.4, W + 70, "#e8e2d8", 0.05) + tasthaare(T, K([[45, 13], [49, 12.6], [51.6, 10]]), 6, 2.2, W + 20, "#e8e2d8", 0.05);
  /* Auge: seitlich vorstehend, im Augenbogen */
  const A = P(15, -0.8);
  s += auge2(T, F, A[0], A[1], 2.35, { winkel: 24, iris: "#3a2214", iris2: "#120804", hoehe: 0.68, wimpern: 13, wl: 0.85, wr: 14, wf: "#0c0c0e", haut: "#c8ccd8", mulde: 0.35, licht: 0.9 });
  /* Genick: kurzer Haarschopf (hornlos) */
  s += saum2(T, K([[-1.4, -2.6], [3, -5.2], [8, -6.4]]), 26, W - 150, 2.2, "#2a2a30", 0.08, 0.8, { ab: 0.4, streuung: 50 });
  /* Ohr: seitlich-waagerecht nach hinten, Löffelform, innen hell behaart; Ohrmarke am Ohrgrund */
  const OX = P(3.6, 4.2), OW = 196;
  const ohrA = dreh([[0, 2.4], [5, 3.8], [11, 4.4], [17, 3.6], [21.6, 1.4], [22, -0.8], [18, -3.4], [11, -4.2], [5, -3.6], [0, -2.4]], OX[0], OX[1], OW);
  const ohrI = dreh([[2.6, -0.4], [8, -0.2], [14, -0.2], [19.6, -0.6], [17, -2.6], [10, -3.4], [3.4, -2.6]], OX[0], OX[1], OW);
  s += imRumpf(rk, F.schatten(OX[0] - 9, OX[1] + 4, 10, 3, 0.4, 18));
  s += stueck(T, ohrA, schwarz, form(ohrI, T.lg("ohri", [[0, "#3e3a3c"], [1, "#8a8284"]], 1, 0, 0, 0), "", 0.05) +
    F.rinne(...dreh([[5, -1.4], [16, -1.4]], OX[0], OX[1], OW).flat(), 0.6, 0.45) +
    haare2(T, ohrI, 34, OW + 205, 3.6, { farben: [["#f4f0e8", 1, 0.06, 0.85]], streuung: 12, kruemmung: 0.2, szene: 0.3 }) +
    F.licht(...dreh([[10, 4.4]], OX[0], OX[1], OW)[0], 7, 0.9, 0.45, OW), { licht: 0.7, dunkel: 0.6, hell: 0.4, hellFarbe: "#c8ccd8", q: 0.05 });
  s += saum2(T, dreh([[3, -2.6], [10, -4], [17, -3.2], [21, -0.8]], OX[0], OX[1], OW), 22, OW + 215, 3, "#f4f0e8", 0.06, 0.8, { ab: 0.2, streuung: 16 });
  const m = dreh([[6.5, -1.2], [6.5, -4.4]], OX[0], OX[1], OW);
  s += strich([m[0], m[1]], "#d8a800", 0.6, 0.95, 0.05);
  const mk = [m[1][0], m[1][1] - 0.4];
  s += F.schatten(mk[0] + 0.8, mk[1] + 3.6, 3, 3.6, 0.35);
  s += stueck(T, [[mk[0] - 1.9, mk[1]], [mk[0] + 1.9, mk[1]], [mk[0] + 2.2, mk[1] + 4.4], [mk[0] - 1.6, mk[1] + 4.6]].map((p) => p.concat([1])),
    T.lg("marke", [[0, "#ffdc50"], [1, "#e2a800"]]), fein(T, `<text x="${z(mk[0] - 1.3, 0.1)}" y="${z(mk[1] + 2.2, 0.1)}" font-size="1.4" font-family="Arial" font-weight="700" fill="#2a2000">DE</text><text x="${z(mk[0] - 1.4, 0.1)}" y="${z(mk[1] + 3.8, 0.1)}" font-size="1" font-family="Arial" fill="#2a2000">0571</text>`),
    { licht: 0.4, dunkel: 0.5, hell: 0.5, q: 0.05 });
  const kb = T.box(kopf);
  return { svg: s, box: [12, -154, 252, 0], fuesse: [42, 58, 173, 187], kopf: [kb[0] - 24, kb[1] - 10, kb[2] + 2, kb[3] + 2] };
}

/* =====================================================================
   KALB (Holstein-Kalb, wenige Wochen alt)
   ===================================================================== */
/* RECHERCHE Kalb (Holstein, 4–6 Wochen): Widerristhöhe ≈ 80–88 cm, ~70–80 kg. Jungtier-Proportionen: Brusttiefe nur
   ≈ 40 % WH (Kuh ≈ 52 %), aufgezogene Flanke, Ellbogen ≈ 60 % WH über dem Boden – die Röhrbeine sind fast so lang wie
   beim erwachsenen Tier („Stelzen“); Kruppe 2–3 % höher als der Widerrist (überbaut); Gelenke (Vorderfußwurzel,
   Sprunggelenk, Fesselgelenk) relativ dick, „knubbelig“. Kopf groß (≈ 38 % WH), Gesicht kurz, Stirn breit und gewölbt
   mit Haarwirbel, Maul stumpf und tief, große Augen, große waagerecht abstehende Ohren, Ohrmarken (Pflicht ab Geburt);
   Hornknospen in den ersten Wochen entfernt (oder genetisch hornlos). Hals dünn und kurz. Fell etwas länger, weich,
   flaumig – Silhouette mit Haarfransen. Schwanz dünn, Quaste kurz bis zum Sprunggelenk. Flotzmaul haarlos, feucht,
   Rillenmuster. Afterklauen hinten am Fesselgelenk. Schwarzbunt: schwarze Platten, Bauch, Beine, Blesse weiß. */
const KA_HB = [[11.5, -79], [12, -72], [14, -64], [16.5, -57], [18, -50], [18.6, -44], [17.6, -37], [16.2, -33], [16, -30.6], [17, -28], [19, -25.6],
  [19.6, -20], [19.4, -12], [18.4, -9.6], [18.6, -7], [20, -4.6], [21.6, -2.4, 1]];
const KA_HV = [[27.6, -4.4, 1], [26.4, -6.4], [25.6, -8.4], [25.8, -10.8], [24.6, -13], [24.4, -18], [24.4, -24], [25.2, -27.6], [26.6, -31.4],
  [28.6, -35], [31, -40], [33.4, -46], [35.6, -52], [37, -56.6]];
const KA_VB = [[86, -52], [86.6, -48], [87.4, -42], [88, -35], [87.6, -30], [86.8, -27.4], [87, -24.6], [88.4, -22], [88.8, -16], [88.6, -11.6],
  [87.8, -9.6], [88.2, -7], [89.6, -4.6], [91.2, -2.4, 1]];
const KA_VV = [[97.2, -4.4, 1], [95.8, -6.4], [95, -8.4], [95.6, -10.8], [94.4, -13], [94.2, -19.6], [95.6, -22.4], [96.4, -24.4], [96.6, -28.4],
  [95.6, -31.4], [96, -38], [97, -45], [98.2, -50]];
function kalb(T) {
  FEIN = T.fein;
  const F = flecken(T, "#fff8ea", "#1a1820");
  const U = ' gradientUnits="userSpaceOnUse"';
  const weiss = T.lg("weiss", [[0, "#fbf9f4"], [0.45, "#f0ece4"], [0.8, "#dcd6cc"], [1, "#cdc7bc"]], 0, -88, 0, -48, U);
  const fernW = T.lg("fernW", [[0, "#8e8a84"], [0.5, "#aeaaa2"], [1, "#a29e96"]], 0, -55, 0, 0, U);
  const schwarz = "#221e1d", horn = "#3a3634";
  const wH = fellMuster(T, "w", 1.2, 70, [["#8a8276", 1, 0.05, 0.2]], 18, 5);
  const sH = fellMuster(T, "s", 1.2, 70, [["#6a625e", 1, 0.05, 0.2]], 18, 5);
  let s = "";
  /* ferne Beine */
  const fernBein = (vorn, dx) => {
    const pts = verschiebe(vorn ? KA_VB.concat(KA_VV) : KA_HB.slice(4).concat(KA_HV), dx).concat(vorn ? [[99 + dx, -56], [86 + dx, -56]] : [[37 + dx, -62], [18 + dx, -62]]);
    return stueck(T, pts, fernW, fellZone(T, wH, pts, 90, 0.8) + F.schatten((vorn ? 92 : 28) + dx, -50, 8, 8, 0.6) +
      plastik(F, verschiebe(vorn ? KA_VB : KA_HB.slice(4), dx), verschiebe(vorn ? KA_VV : KA_HV, dx), 0.6, 0.5), { licht: 0.9, dunkel: 0.45, hell: 0.3 });
  };
  s += vol(T, "bein", 1.8, fernBein(false, 8)) + klaue2(T, F, 21.6 + 8, 8.6, 4.6, "#4a4644", "#9a8a84") + afterklaue2(T, 18.8 + 8, -8.8, 1, "#3a3634", "#c8c2b8");
  s += vol(T, "bein", 1.8, fernBein(true, -7)) + klaue2(T, F, 91.2 - 7, 8.6, 4.6, "#4a4644", "#9a8a84") + afterklaue2(T, 88 - 7, -8.8, 1, "#3a3634", "#c8c2b8");
  /* Rumpf mit Hals und nahen Beinen: kurzer, flacher Rumpf, aufgezogene Flanke */
  const rumpf = KA_HB.concat(KA_HV, [[40, -57.6], [46, -56], [56, -53.6], [68, -52], [78, -51.4], [84, -52]], KA_VB, KA_VV,
    [[100.6, -54], [102.8, -58.4], [104.2, -63], [104.8, -66.6], [106, -71], [107.4, -76], [109, -81], [113, -86], [118, -89.4], [112, -89.2], [104, -87.4],
      [96.6, -85.6], [90, -85], [80, -84.6], [66, -84.8], [52, -85.6], [40, -86.8], [31, -87.8], [24, -86.4], [18, -84.6], [14, -82.6]]);
  const wuchs = richtung([[10, 95], [30, 105], [44, 160], [84, 165], [92, 100], [110, 120]]);
  const platte = zackig(T, [[0, -98], [130, -98], [130, -72], [112, -68], [105.6, -61], [100, -57], [94, -59], [90, -55], [84, -59], [77, -64], [70, -70], [63, -77],
    [57, -79], [51, -76], [47, -70], [42, -64], [35, -60], [27, -59], [20, -63], [12, -71], [0, -76]], 0.8, 3);
  const insel = zackig(T, [[38, -82], [47, -83.6], [52, -78], [47, -73], [40, -75]], 0.6, 2);
  const zHinten = [[0, -95], [42, -95], [50, -70], [38, -50], [12, -40]];
  const zRumpf = [[42, -95], [88, -95], [88, -50], [38, -50], [50, -70]];
  const zVorn = [[88, -95], [125, -95], [104, -60], [88, -50]];
  const innen =
    fellZone(T, wH, zHinten, 100) + fellZone(T, wH, zRumpf, 160) + fellZone(T, wH, zVorn, 112) + fellZone(T, wH, [[10, -50], [100, -50], [100, 0], [10, 0]], 90) +
    form(T.fein ? platte : vieleck(platte), schwarz, "", 0.2) + form(T.fein ? insel : vieleck(insel), "#f2eee6", "", 0.2) +
    fein(T, fellZone(T, sH, platte, 150)) +
    fein(T, saum2(T, platte, 110, wuchs, 1.3, schwarz, 0.06, 0.75, { streuung: 34 }) + saum2(T, platte, 60, wuchs, 1.2, "#f2eee6", 0.06, 0.7, { streuung: 34 }) +
      saum2(T, insel.concat([insel[0]]), 26, wuchs, 1.1, schwarz, 0.06, 0.7, { streuung: 34 })) +
    /* flaumiges Kalbsfell: längere, weich gewellte Haare in Wuchsrichtung */
    haare2(T, rumpf, 150, wuchs, 1.6, { farben: [["#9a9288", 1, 0.06, 0.3]], streuung: 22, kruemmung: 0.35, szene: 0.04 }) +
    haare2(T, platte.filter((p) => p[1] < -60), 90, wuchs, 1.6, { farben: [["#5a504c", 1, 0.06, 0.4], ["#3a2e28", 1, 0.06, 0.3]], streuung: 22, kruemmung: 0.35, szene: 0 }) +
    wirbel(T, 44, -66, 2, 18, "#8a8276", 0.06, 0.5, 1.1) +
    rumpfLicht(F, 12, 100, -88, -51, 0.75) +
    weich(T, masse(T, [[32, -88], [18, -85], [12, -78], [14, -64], [18, -50], [30, -46], [38, -58], [42, -76]], 2.2, 0.6, 0) +
      masse(T, [[88, -86], [98, -84], [104.8, -66], [100, -54], [92, -50], [85, -54], [84, -72]], 2, 0.55, 0) +
      masse(T, [[86, -54], [98, -52], [97, -38], [95.6, -31], [88, -30], [87, -42]], 1, 0.45, 0), 1.2) +
    /* Knochenpunkte des mageren Kalbs: Hüfthöcker, Sitzbeinhöcker, Hungergrube, Kniefalte, Schulterblatt, Rippen */
    F.licht(31, -86, 3, 1, 0.4, -10) + F.schatten(33, -82, 3.4, 2.6, 0.35) + F.licht(12.4, -78.6, 0.8, 1.6, 0.3) + F.schatten(42, -76, 4, 6, 0.25) +
    F.rinne(37, -58, 43, -68, 1, 0.4) + F.rinne(88, -84, 86, -56, 1.2, 0.18) + [56, 62, 68, 74].map((x) => F.rinne(x, -74, x - 3, -56, 1.2, 0.1)).join("") +
    /* knubbelige Gelenke: Licht auf Vorderfußwurzel, Fersenhöcker, Fesselgelenken */
    F.licht(96, -25.4, 0.9, 2, 0.45) + F.licht(87.6, -26.6, 0.7, 1.2, 0.35) + F.licht(16.8, -31.6, 0.9, 1.6, 0.45) +
    F.licht(25, -10.4, 0.8, 1.2, 0.35) + F.licht(95, -10, 0.8, 1.2, 0.35) + F.rinne(91.8, -21, 92, -12, 0.5, 0.4) + F.rinne(22, -24, 22, -12, 0.5, 0.4) +
    F.schatten(92, -50, 6, 4, 0.4) + F.schatten(30, -55, 6, 4, 0.35);
  s += vol(T, "rumpf", 6, stueck(T, rumpf, weiss, innen, { licht: 1.3, dunkel: 0.45, hell: 0.5, q: T.fein ? 0.1 : 0.5 }), { tiefe: 4, umgebung: 0.4 });
  const rk = T._clip;
  /* Flaum: Haarfransen über die Silhouette (Rücken, Bauch, Beinrückseiten) */
  s += saum2(T, [[14, -82.6], [24, -86.4], [40, -86.8], [66, -84.8], [90, -85], [104, -87.4]], 70, (x) => (x < 44 ? 150 : 175), 1.4, schwarz, 0.06, 0.7, { ab: 0.2 });
  s += saum2(T, [[40, -57.6], [56, -53.6], [78, -51.4], [84, -52]], 26, 115, 2, "#e4e0d8", 0.05, 0.7, { ab: 0.3, streuung: 40 });
  s += saum2(T, [[12, -72], [16.5, -57], [18.6, -44]], 20, 120, 1.4, "#ece8e0", 0.06, 0.7, { ab: 0.2 });
  s += klaue2(T, F, 21.6, 8.6, 4.6, "#4a4644", "#a89890") + afterklaue2(T, 18.8, -8.8, 1.1, "#3a3634", "#ece8e0");
  s += klaue2(T, F, 91.2, 8.6, 4.6, "#4a4644", "#a89890") + afterklaue2(T, 88, -8.8, 1.1, "#3a3634", "#ece8e0");
  /* Schwanz: dünn, frei hängend; kurze Quaste bis zum Sprunggelenk */
  const schwanz = [[16.6, -83.4], [13, -82.4], [10.6, -78], [9.6, -68], [9.4, -52], [9.6, -40], [11.4, -40], [11.4, -52], [11.8, -68], [12.8, -77], [16, -79.6]];
  s += stueck(T, schwanz, T.lg("schw", [[0, schwarz], [0.4, "#2a2626"], [0.5, "#e8e4dc"], [1, "#d8d2c8"]], 0, -83, 0, -40, U),
    fein(T, saum2(T, [[9.4, -63], [11.8, -63]], 10, 92, 1.6, schwarz, 0.05, 0.8, { streuung: 10 })), { licht: 0.5, dunkel: 0.6, hell: 0.3 });
  const quaste = [[9.2, -43], [11.8, -43], [13.2, -37], [12.8, -31], [11.6, -28.4], [10.6, -30.6], [9.4, -27.6], [8.2, -31], [7.8, -37]];
  s += stueck(T, quaste, "#e6e2da", haare2(T, quaste, 40, (x) => 90 + (x - 10.5) * 3, 7, { farben: [["#a8a094", 1, 0.06, 0.6], ["#fff", 0.9, 0.05, 0.7]], streuung: 8, kruemmung: 0.3, szene: 0.1 }),
    { licht: 0.5, dunkel: 0.6, hell: 0.3 });
  s += saum2(T, [[8, -30], [10.4, -27.8], [12.8, -30]], 12, 92, 2.4, "#d8d2c8", 0.05, 0.8, { ab: 0.1, streuung: 20 });
  /* Kopf: groß, kurzes Gesicht, gewölbte Stirn, stumpfes tiefes Maul; 55° geneigt, 32 cm */
  const G = [118.4, -87.6], W = 55, K = (pts) => dreh(pts, G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  const kopf = K([[-0.8, -2], [3, -4.6], [8, -5.8], [13, -5.6], [18, -4.4], [23, -3.4], [27, -2.8], [30, -1.4], [31.6, 1.2], [32, 4.6], [31.4, 8],
    [30, 9.4], [29.6, 10.2], [28.4, 11.8], [25.6, 12.8], [20, 12.6], [15, 13.8], [10, 16.2], [5.6, 17], [2, 14.8], [-0.6, 10], [-1.4, 4]]);
  s += imRumpf(rk, F.schatten(...P(2, 15), 5, 4, 0.5, W));
  const blesse = K([[3, -6.2], [8, -7], [14, -6.8], [20, -5.4], [26, -4.2], [32, -2], [32.6, 3.6], [31, 4.6], [28.4, 2.6], [25, 0.4], [20, 0], [15, 0.4], [11, -1.4], [7, -2.6]]);
  const flotz = K([[27.2, -3.4], [30.8, -1.8], [32.6, 1.4], [32.8, 4.8], [32, 8.4], [30, 9.6], [28, 8.6], [27, 5], [26.6, 1]]);
  const kInnen = fellZone(T, sH, kopf, W - 180, 0.9) + form(blesse, "#f4f0e9", "", 0.05) + fellZone(T, wH, blesse, W - 180, 0.9) +
    saum2(T, blesse.concat([blesse[0]]), 44, W - 180, 0.9, schwarz, 0.05, 0.7, { streuung: 34 }) +
    wirbel(T, ...P(8, -3), 1.6, 20, "#9a958c", 0.05, 0.6, 0.9) +
    F.licht(...P(11, -2), 8, 2.6, 0.3, W) + F.kante(...P(5, 6), ...P(14, 7.6), 1.2, 0.3) + F.schatten(...P(9, 13.6), 6, 2.6, 0.55, W) +
    F.schatten(...P(2, 10), 3, 5, 0.45, W) + F.kante(...P(13, 4.2), ...P(21, 4.2), 0.7, 0.35) + F.rinne(...P(13.6, 5.8), ...P(21, 5.8), 0.8, 0.45) +
    F.schatten(...P(22, 11), 6, 1.6, 0.4, W) +
    form(flotz, T.lg("flotz", [[0, "#e2b4ac"], [0.6, "#d4a098"], [1, "#b8847c"]], 0, 0, 0.4, 1), "", 0.05) +
    fein(T, `<g opacity=".3">${haare2(T, flotz, 30, 0, 0.3, { farben: [["#6a3a38", 1, 0.05, 0.8]], streuung: 180, kruemmung: 0.4 })}</g>`) +
    F.licht(...P(29, -1), 1.6, 0.7, 0.75, W - 30) + F.licht(...P(32, 4), 0.4, 1.2, 0.6, W) +
    fein(T, [[29, 2], [30.6, 3.4], [31.4, 6.6], [28.8, 7.2]].map(([x, y]) => F.licht(...P(x, y), 0.18, 0.14, 0.9)).join(""));
  s += vol(T, "kopf", 2.4, stueck(T, kopf, schwarz, kInnen, { licht: 0.9, dunkel: 0.8, hell: 0.5, hellFarbe: "#c8ccd8", q: 0.05 }), { tiefe: 4, umgebung: 0.4 });
  s += saum2(T, K([[-0.8, -2], [3, -4.6], [8, -5.8], [13, -5.6]]), 22, W - 150, 1.4, "#3a3432", 0.05, 0.8, { ab: 0.3, streuung: 50 });
  s += form(K([[28.6, 0.4], [30.6, 0], [31.8, 1.6], [31.6, 4.4], [30.6, 5.2], [30.6, 3.4], [29.6, 2]]), T.rg("nl", [[0, "#1a0c0c"], [0.7, "#3a1a1a"], [1, "#7a4a48"]], 0.6, 0.4, 0.6), "", 0.05);
  s += strich(K([[28.2, -0.2], [30.6, -0.8], [32.2, 1.2], [32.2, 4.4]]), "#f4d4cc", 0.25, 0.55, 0.05);
  s += strich(K([[30.2, 9.8], [26.6, 10.6], [23.4, 10.6]]), "#2a1414", 0.35, 0.7, 0.05) + strich(K([[29.6, 10.6], [28.2, 11.8], [25.6, 12.6]]), "#d0b0a8", 0.2, 0.3, 0.05);
  s += tasthaare(T, K([[24, 12.6], [27, 12.2], [29.4, 10.6]]), 6, 1.6, W + 70, "#e8e2d8", 0.04);
  /* großes Auge (Kindchenschema), im Augenbogen */
  const A = P(11, 1.4);
  s += auge2(T, F, A[0], A[1], 1.85, { winkel: 22, iris: "#3a2214", iris2: "#120804", hoehe: 0.72, wimpern: 13, wl: 0.85, wr: 14, wf: "#0c0c0e", haut: "#c8ccd8", mulde: 0.35, licht: 0.9 });
  /* großes Ohr, waagerecht abstehend, innen langes weißes Haar; gelbe Ohrmarke */
  const OX = P(4.4, 5.6), OW = 192;
  const ohrA = dreh([[0, 2], [4, 3.2], [8.6, 3.8], [13, 3], [16.4, 1.2], [16.8, -0.8], [13.8, -3], [8.6, -3.8], [4, -3.2], [0, -2]], OX[0], OX[1], OW);
  const ohrI = dreh([[2, -0.4], [6, -0.2], [11, -0.2], [15, -0.6], [13, -2.4], [8, -3], [2.6, -2.2]], OX[0], OX[1], OW);
  s += imRumpf(rk, F.schatten(OX[0] - 7, OX[1] + 3, 7, 2.4, 0.4, 14));
  s += stueck(T, ohrA, schwarz, form(ohrI, T.lg("ohri", [[0, "#3e3a3c"], [1, "#8a8284"]], 1, 0, 0, 0), "", 0.05) +
    haare2(T, ohrI, 28, OW + 205, 2.8, { farben: [["#f4f0e8", 1, 0.05, 0.85]], streuung: 12, kruemmung: 0.2, szene: 0.3 }) +
    F.licht(...dreh([[8, 3.4]], OX[0], OX[1], OW)[0], 5, 0.7, 0.45, OW), { licht: 0.5, dunkel: 0.6, hell: 0.4, hellFarbe: "#c8ccd8", q: 0.05 });
  s += saum2(T, dreh([[2.4, -2], [8, -3.2], [13, -2.6], [16.4, -0.6]], OX[0], OX[1], OW), 18, OW + 215, 2.4, "#f4f0e8", 0.05, 0.8, { ab: 0.2, streuung: 16 });
  const m = dreh([[5, -1], [5, -3.4]], OX[0], OX[1], OW);
  s += strich([m[0], m[1]], "#d8a800", 0.45, 0.95, 0.05);
  const mk = [m[1][0], m[1][1] - 0.3];
  s += F.schatten(mk[0] + 0.6, mk[1] + 2.6, 2.2, 2.6, 0.35);
  s += stueck(T, [[mk[0] - 1.5, mk[1]], [mk[0] + 1.5, mk[1]], [mk[0] + 1.7, mk[1] + 3.5], [mk[0] - 1.3, mk[1] + 3.6]].map((p) => p.concat([1])),
    T.lg("marke", [[0, "#ffdc50"], [1, "#e2a800"]]), fein(T, `<text x="${z(mk[0] - 1.05, 0.1)}" y="${z(mk[1] + 1.8, 0.1)}" font-size="1.1" font-family="Arial" font-weight="700" fill="#2a2000">DE</text>`),
    { licht: 0.3, dunkel: 0.5, hell: 0.5, q: 0.05 });
  const kb = T.box(kopf);
  return { svg: s, box: [8, -90, 137, 0], fuesse: [26, 33, 95, 101], kopf: [kb[0] - 16, kb[1] - 6, kb[2] + 2, kb[3] + 2] };
}

/* =====================================================================
   ESEL (Hausesel, grau, „Mittelesel“)
   ===================================================================== */
/* RECHERCHE Esel (Hausesel, Equus asinus, Grauesel): Stockmaß je nach Schlag 90–130 cm (hier 115), 180–250 kg. Kopf groß
   (~ 50 cm, verhältnismäßig größer als beim Pferd), gerades bis leicht ramsnasiges Profil; Ohren sehr lang (≈ 60 % der
   Kopflänge), dunkler Rand und dunkle Spitze, innen dicht cremeweiß behaart. Grauesel („mausgrau“): dunkler Aalstrich von
   der Mähne bis in die Schweifrübe und Schulterkreuz (flache Pigmentzeichnung, kein Relief), „Mehlmaul“ (helles Maul mit
   weichem Übergang), helle Augenringe („Brille“), heller Bauch und helle Beininnenseiten, oft feine dunkle Querstreifen an
   den Beinen. Kurze, aufrechte Stehmähne (8–10 cm, bürstenartig, ohne Stirnschopf). Schweif rinderähnlich: kurz behaarte
   Rübe, ab etwa der Hälfte länger werdende Haare bis zur Quaste. Gerader Rücken, kaum Widerrist, steile Schulter, schmales
   Becken. Hufe schmaler, höher und steiler als beim Pferd (Wand 55–60°, parallel zur Fessel, Trachten 60–70 % der
   Zehenhöhe). Unterarm ≈ 1,3 × Röhrbein. Kastanien nur an den Vorderbeinen (innen). Fell dicht, etwas rau; Haarstrich am
   Hals nach hinten-unten, Rumpf nach hinten-unten, Hinterhand abwärts, Flankenwirbel vor dem Kniegelenk. Iris fast
   schwarzbraun mit Traubenkörnern. Quellen: FCI/Rassebeschreibungen, Wiktionary/Duden „Aalstrich“, Fachliteratur Eselhuf. */
const E_HB = [[12.4, -98], [13.4, -88], [15.4, -78], [17.4, -68], [18.6, -58], [18.2, -50], [16.2, -44.6], [16.6, -40.6], [18.6, -37.6], [19.6, -32],
  [19.8, -20], [19.4, -16], [18.8, -13], [19.6, -10], [21.6, -7.4], [23.2, -5.4], [23.8, -3.4, 1]];
const E_HV = [[29, -7.6, 1], [27.6, -10], [26.6, -13], [26.2, -16], [25.4, -19], [25.2, -26], [25.2, -34], [26, -38.6], [27.6, -42.6], [30, -47], [33, -53],
  [36.4, -60], [40, -67], [41.6, -71]];
const E_VB = [[84.6, -63.4], [85.2, -58], [85.6, -54], [86, -44], [86.4, -34], [85.6, -31.4], [86, -28.6], [87.6, -26], [88, -20], [87.6, -15], [87, -12.6],
  [87.8, -9.6], [89.8, -6.8], [91.4, -5.2], [92, -3.4, 1]];
const E_VV = [[97.2, -7.6, 1], [95.8, -10], [94.6, -13], [94, -16], [93.4, -19], [93.2, -26], [94.2, -28.4], [94.6, -34], [95.2, -40], [96.4, -48],
  [97.6, -56], [98.6, -62]];
const E_KAMM = [[127, -134.6], [118, -131.4], [108, -127], [98, -121.4], [90, -116.6]];
function esel(T) {
  FEIN = T.fein;
  const F = flecken(T, "#fff4e2", "#16120e");
  const U = ' gradientUnits="userSpaceOnUse"';
  const fell = T.lg("fell", [[0, "#a49c90"], [0.4, "#958d80"], [0.75, "#8a8276"], [1, "#a8a092"]], 0, -118, 0, -66, U);
  const fern = T.lg("fern", [[0, "#6e675d"], [0.5, "#7a7266"], [1, "#6c655b"]], 0, -70, 0, 0, U);
  const dunkel = "#4a423a";
  const dH = fellMuster(T, "d", 1.4, 90, [["#3e372f", 1, 0.06, 0.24]], 16, 5);
  const hH = fellMuster(T, "h", 1.3, 50, [["#e6dfd2", 1, 0.06, 0.26]], 16, 5);
  const bleich = T.rg("bleich", [[0, "#e2dbce", 1], [0.55, "#dcd4c6", 0.75], [1, "#dcd4c6", 0]]);
  const hellF = (x, y, rx, ry, op, g = 0) => `<ellipse ${g ? `transform="translate(${folge([z(x, 0.1), z(y, 0.1)])})rotate(${g})"` : `cx="${z(x, 0.1)}" cy="${z(y, 0.1)}"`} rx="${z(rx, 0.1)}" ry="${z(ry, 0.1)}" fill="${bleich}" opacity="${op}"/>`;
  const streifen = (x0, x1, y, n, dy) => fein(T, Array.from({ length: n }, (_, i) =>
    `<path d="M${z(x0, 0.1)} ${z(y + i * dy, 0.1)}Q${z((x0 + x1) / 2, 0.1)} ${z(y + i * dy + 1.6, 0.1)} ${z(x1, 0.1)} ${z(y + i * dy, 0.1)}" fill="none" stroke="${dunkel}" stroke-opacity=".14" stroke-width="1.3"/>`).join(""));
  let s = "";
  /* ferne Beine (Textur 60 %, 15 % dunkler); Kastanie nur vorn */
  const fernBein = (vorn, dx) => {
    const pts = verschiebe(vorn ? E_VB.concat(E_VV) : E_HB.slice(3).concat(E_HV), dx).concat(vorn ? [[100 + dx, -74], [84 + dx, -74]] : [[42 + dx, -76], [16 + dx, -76]]);
    return stueck(T, pts, fern, fellZone(T, dH, pts, 92, 0.6) + F.schatten((vorn ? 90 : 26) + dx, -66, 9, 10, 0.6) +
      plastik(F, verschiebe(vorn ? E_VB : E_HB.slice(3), dx), verschiebe(vorn ? E_VV : E_HV, dx), 0.7, 0.6) +
      (vorn ? form([[86.6 + dx, -46], [88.4 + dx, -46.6], [88.6 + dx, -42.6], [86.8 + dx, -42.2]], "#3e3730", "", 0.05) + fein(T, F.licht(87.4 + dx, -45.4, 0.3, 0.2, 0.6) + F.licht(87.8 + dx, -43.4, 0.25, 0.2, 0.5)) : ""),
      { licht: 0.9, dunkel: 0.6, hell: 0.3 });
  };
  s += vol(T, "bein", 2.2, fernBein(false, 12)) + huf2(T, F, 23.8 + 12, 33.8 + 12, 8.2, 57, "#2e2924", "#4a433a");
  s += vol(T, "bein", 2.2, fernBein(true, -9)) + huf2(T, F, 92 - 9, 102 - 9, 8.2, 57, "#2e2924", "#4a433a");
  /* Rumpf mit Hals und nahen Beinen */
  const rumpf = E_HB.concat(E_HV, [[44, -70], [50, -66], [58, -62], [68, -59.4], [78, -59], [83, -61.4]], E_VB, E_VV,
    [[100.8, -68], [103.6, -74], [105.8, -80], [106.6, -84.6], [107.8, -90], [109.6, -98], [111.4, -106], [113, -114], [116, -122], [122, -130]], E_KAMM,
    [[84, -115.4], [74, -115.6], [62, -116], [50, -116.6], [40, -117.2], [32, -117], [26, -115], [20, -111.4], [15.4, -106], [13, -102]]);
  const zHinten = [[0, -122], [44, -122], [50, -96], [42, -70], [26, -40], [10, -40]];
  const zRumpf = [[44, -122], [86, -122], [86, -58], [42, -66], [50, -96]];
  const zVorn = [[86, -122], [132, -140], [110, -100], [100, -60], [86, -58]];
  const zLicht = [[10, -114], [86, -120], [128, -142], [118, -124], [86, -104], [40, -102], [12, -98]];
  const innen =
    fellZone(T, dH, zHinten, 100) + fellZone(T, dH, zRumpf, 160) + fellZone(T, dH, zVorn, 116) + fellZone(T, dH, [[10, -40], [100, -40], [100, 0], [10, 0]], 90) +
    fellZone(T, hH, zLicht, 160, 0.9) +
    /* heller Bauch, helle Innenschenkel; Beine nach unten etwas dunkler */
    hellF(64, -60, 26, 7, 0.95) + hellF(84, -62, 6, 5, 0.8) + hellF(44, -66, 5, 7, 0.7) + hellF(97, -44, 2.4, 10, 0.4) + hellF(29, -44, 2.4, 9, 0.35) +
    `<rect x="80" y="-40" width="24" height="40" fill="${T.lg("vbein", [[0, "#5a5248", 0], [0.4, "#5a5248", 0.25], [1, "#4a433b", 0.45]])}"/>` +
    `<rect x="12" y="-44" width="24" height="44" fill="${T.lg("hbein", [[0, "#5a5248", 0], [0.45, "#5a5248", 0.25], [1, "#4a433b", 0.45]])}"/>` +
    /* feine dunkle Querstreifen an den Beinen, der Zylinderform folgend */
    streifen(86.4, 96.4, -38, 4, 3.2) + streifen(18.8, 28, -32, 3, 3.6) +
    /* Schulterkreuz: flache Pigmentzeichnung; Aalstrich etwas innerhalb der Oberlinie */
    form([[86.2, -116], [90.6, -116], [91.2, -108], [92.2, -100], [93.2, -93.4], [92.6, -93], [90.4, -100], [88.4, -108]], dunkel, ` opacity=".62"`, 0.1) +
    fein(T, saum2(T, [[86.4, -114], [88.6, -106], [90.6, -98], [92.6, -93.6]], 18, 98, 1.4, dunkel, 0.07, 0.6, { streuung: 30 }) +
      saum2(T, [[90.6, -114], [91.4, -106], [92.6, -98]], 14, 98, 1.4, dunkel, 0.07, 0.6, { streuung: 30 })) +
    strich([[90, -114.6], [80, -114], [64, -114.4], [50, -115], [38, -115.4], [28, -113.6], [21, -109.6]], dunkel, 2.2, 0.5) +
    fein(T, saum2(T, [[88, -113.2], [64, -113], [38, -114], [24, -110]], 40, 100, 1.2, dunkel, 0.06, 0.55, { streuung: 40 })) +
    /* Großform und Muskeln */
    rumpfLicht(F, 14, 104, -117, -59, 0.75) +
    weich(T, masse(T, [[44, -117], [28, -117], [16, -108], [12.6, -98], [16, -76], [19, -60], [34, -60], [40, -70], [46, -90], [50, -108]], 3, 0.65, 0) +
      masse(T, [[22, -76], [36, -78], [41, -71], [33, -53], [27.6, -44], [17.6, -46], [18.6, -60]], 1.6, 0.55, 0) +
      masse(T, [[84, -116], [92, -116], [101, -96], [106.6, -84], [102, -70], [92, -62], [84.6, -66], [82, -92]], 3, 0.6, 0) +
      masse(T, [[84.6, -64], [99, -66], [97.6, -54], [95.2, -40], [86.2, -40], [85.6, -54]], 1.2, 0.5, 0) +
      masse(T, [[92, -120], [127, -135], [118, -124], [113, -112], [108, -92], [104, -84], [96, -100]], 2.2, 0.45, 0), 1.6) +
    /* Knochenpunkte: Hüfthöcker, Sitzbein, Kniescheibe, Buggelenk, Ellbogen; Rippen; Kniefalte; Flankenwirbel */
    F.licht(38, -114, 4, 1.6, 0.4, -15) + F.schatten(41, -109, 4, 3, 0.35) + F.licht(13, -98, 1, 2.4, 0.3) + F.licht(40.6, -69, 1.6, 2.2, 0.3) +
    F.rinne(41, -71, 46, -84, 1.3, 0.4) + F.licht(105, -83, 1.6, 4, 0.3, -20) + F.schatten(87, -61, 4, 3, 0.5) +
    [58, 64, 70, 76].map((x) => F.rinne(x, -98, x - 4, -70, 1.6, 0.1)).join("") +
    wirbel(T, 44, -82, 2.4, 22, "#3e372f", 0.07, 0.45, 1.3) +
    /* Läufe: Sehnenmodellierung statt Balken, flaches Knie, Fersenbeinhöcker */
    F.kante(88.4, -25, 88.6, -14, 0.6, 0.35) + F.rinne(90.4, -25, 90.4, -14, 0.5, 0.45) + F.kante(94.2, -34, 94.2, -28.6, 0.5, 0.35) + F.licht(86, -30, 0.6, 1.4, 0.35) +
    F.kante(20.2, -32, 20.4, -18, 0.6, 0.35) + F.rinne(22.4, -32, 22.4, -18, 0.5, 0.45) + F.licht(16.8, -44.4, 0.9, 1.6, 0.45) + F.kante(18.4, -58, 17, -46, 0.6, 0.35);
  s += vol(T, "rumpf", 8, stueck(T, rumpf, fell, innen, { licht: 1.6, dunkel: 0.75, hell: 0.6, hellFarbe: "#fff6e8", q: T.fein ? 0.1 : 0.5 }), { tiefe: 4, umgebung: 0.35 });
  const rk = T._clip;
  /* Fell bricht die Silhouette: Bauch, Kehle, Hinterbacken */
  s += saum2(T, [[44, -70], [50, -66], [58, -62], [68, -59.4], [78, -59], [83, -61.4]], 30, 110, 1.6, "#cfc7b9", 0.06, 0.7, { ab: 0.3, streuung: 30 });
  s += saum2(T, [[12.6, -100], [13.4, -88], [15.4, -78]], 14, 125, 1.4, "#8a8276", 0.06, 0.6, { ab: 0.3 });
  s += saum2(T, [[87, -12.6], [87.6, -16]], 8, 110, 1.6, "#3e372f", 0.07, 0.8, { ab: 0.3 }) + saum2(T, [[18.8, -13], [19.4, -16]], 8, 110, 1.6, "#3e372f", 0.07, 0.8, { ab: 0.3 });
  s += huf2(T, F, 23.8, 33.8, 8.2, 57, "#3a342e", "#5a5248") + huf2(T, F, 92, 102, 8.2, 57, "#3a342e", "#5a5248");
  /* Stehmähne: aufrechte Bürste, in der Halsmitte 9 cm, an Genick und Widerrist 3 cm; geht in den Aalstrich über */
  const mo = [], mu = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14, q = punktAuf(E_KAMM, t), h = 2.6 + 6.6 * Math.sin(Math.PI * Math.pow(t, 0.8)) + (i % 2) * 0.9 + (i % 3 === 1 ? -0.8 : 0);
    mu.push([q[0], q[1] + 1.2]);
    mo.push([q[0] - h * 0.2, q[1] - h]);
  }
  const maehne = mo.concat(mu.slice().reverse());
  s += stueck(T, maehne, T.lg("mae", [[0, "#8e887e"], [0.35, "#5e564c"], [1, "#2e2822"]], 0, 0, 0.2, 1),
    haare2(T, maehne, 110, -98, 5.2, { farben: [["#2a241e", 1.2, 0.07, 0.6], ["#8e887e", 1, 0.06, 0.55], ["#b8b2a8", 0.4, 0.05, 0.5]], streuung: 8, kruemmung: 0.08, szene: 0.15 }),
    { licht: 0.7, dunkel: 0.6, hell: 0.5 });
  s += saum2(T, mo, 40, -100, 1.6, "#8e887e", 0.06, 0.7, { ab: 0.2, streuung: 16 });
  /* Schweif: breite, kurz behaarte Rübe mit Aalstrich, liegt an der Hinterbacke; Haare ab der Hälfte länger bis zur Quaste */
  const ruebe = [[22, -112.6], [16.4, -110], [12.4, -104], [10.4, -94], [9.6, -82], [9.6, -70], [11.6, -68], [13.6, -70], [14, -82], [15, -94], [17.6, -102], [22, -106]];
  s += stueck(T, ruebe, T.lg("rue", [[0, "#8a8276"], [0.6, "#7a7266"], [1, "#4a433a"]], 0, -112, 0, -68, U),
    haare2(T, ruebe, 40, (x, y) => 95 + (y + 90) * 0.4, 2, { farben: [["#4a433a", 1, 0.06, 0.45], ["#c8c0b2", 0.6, 0.05, 0.4]], streuung: 14, szene: 0 }) +
    strich([[19, -110], [14.4, -104], [12.2, -94], [11.6, -80]], dunkel, 1.2, 0.6), { licht: 0.8, dunkel: 0.7, hell: 0.4 });
  const quaste = [[9.2, -78], [14.2, -78], [15.8, -66], [16, -54], [15, -44], [13.6, -40], [12.4, -43], [11, -39], [9.6, -43], [8.4, -41], [7.8, -50], [8.2, -64]];
  s += stueck(T, quaste, T.lg("qua", [[0, "#3e3730"], [1, "#1e1a16"]], 0, 0, 0.3, 1),
    haare2(T, quaste, 90, (x) => 90 + (x - 12) * 2, 12, { farben: [["#000", 1, 0.07, 0.6], ["#5a5248", 0.8, 0.06, 0.5], ["#9a9288", 0.3, 0.05, 0.45]], streuung: 6, kruemmung: 0.25, szene: 0.1 }) +
    F.kante(10, -74, 9.6, -50, 0.8, 0.35), { licht: 0.8, dunkel: 0.7, hell: 0.4 });
  s += saum2(T, [[8, -42], [12, -38.6], [15.4, -42]], 18, 92, 3.4, "#2a241e", 0.06, 0.75, { ab: 0.1, streuung: 18 });
  /* Kopf: groß, gerades Profil, tiefe Ganasche; 52° geneigt, 50 cm */
  const G = [128, -132], W = 52, K = (pts) => dreh(pts, G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  const kopf = K([[-1, -3.2], [8, -5.8], [18, -6.6], [28, -6], [38, -4.8], [44, -3.6], [48, -1.6], [50.4, 1.4], [51, 5.4], [50.4, 9.6], [48.4, 12],
    [47.4, 12.6], [47.4, 13.6], [45.8, 15.4], [42, 16.2], [38.6, 15.8], [33, 16.6], [26, 19.6], [19, 24.4], [12, 26.6], [5.6, 25], [1.4, 20], [-1.2, 12], [-1.8, 4]]);
  s += imRumpf(rk, F.schatten(...P(4, 24), 7, 5, 0.5, W - 60));
  const mehl = K([[33, -5.4], [44, -3.6], [48, -1.6], [50.4, 1.4], [51, 5.4], [50.4, 9.6], [48.4, 12], [45.8, 15.4], [42, 16.2], [36, 16], [32, 12], [30.6, 4]]);
  const kInnen =
    fellZone(T, dH, kopf, W, 0.8) +
    /* Mehlmaul mit weichem Übergang (Falb-Zwischenton), rosagraue Haut um Nüster und Lippen */
    `<ellipse transform="translate(${folge([z(P(44, 5.6)[0], 0.1), z(P(44, 5.6)[1], 0.1)])})rotate(${W})" rx="13" ry="12.6" fill="${T.rg("mehl", [[0, "#f2ede4"], [0.62, "#ebe5da"], [0.8, "#d8c8b0", 0.75], [1, "#d8c8b0", 0]])}"/>` +
    F.licht(...P(46, 4), 4, 3, 0.4, W) + `<ellipse transform="translate(${folge([z(P(47.6, 6.6)[0], 0.1), z(P(47.6, 6.6)[1], 0.1)])})rotate(${W})" rx="4" ry="5" fill="#c9b7ad" opacity=".28"/>` +
    F.schatten(...P(42, 14.6), 6, 2, 0.4, W) +
    /* Ganasche als runde Masse, Gesichtsleiste, Nasenrücken-Licht, Kehlgangschatten */
    F.licht(...P(16, 13), 7, 6, 0.4, W) + F.schatten(...P(9, 23), 9, 3.4, 0.5, W - 40) + F.licht(...P(12, 25.4), 6, 1.2, 0.25, W - 40) +
    F.kante(...P(19, 6.4), ...P(36, 5.4), 1.1, 0.5) + F.rinne(...P(20, 8.6), ...P(36, 7.6), 1.3, 0.45) + F.licht(...P(30, -4.4), 13, 1.2, 0.5, W) +
    F.schatten(...P(1.6, 12), 3, 8, 0.4, W) +
    /* helle „Brille“ um das Auge, breit und weich */
    hellF(...P(17.6, 1.4), 5.6, 4.6, 0.6, W) + hellF(...P(17.6, 1.4), 4, 3.4, 0.6, W);
  s += vol(T, "kopf", 3.5, stueck(T, kopf, fell, kInnen, { licht: 1.2, dunkel: 0.75, hell: 0.45, hellFarbe: "#fff6e8", q: 0.1 }), { tiefe: 4, umgebung: 0.35 });
  /* Nüster: schräger Kommaschlitz, oberes Ende zum Auge; erhabener Nasenflügel; innen dunkel rosagrau */
  s += form(K([[45.6, 1.8], [48.4, 1.6], [49.6, 3.6], [49.2, 6.6], [47.8, 7.6], [48, 5.2], [46.8, 3.4]]), T.rg("nue", [[0, "#1e1414"], [0.7, "#3e2c2a"], [1, "#6a5450"]], 0.6, 0.4, 0.6), "", 0.05);
  s += strich(K([[45, 1], [48.4, 0.6], [50.2, 2.8], [50.2, 6]]), "#fff", 0.4, 0.55, 0.05) + strich(K([[45.6, 2.6], [47.4, 4.2], [47.6, 7]]), "#6a5a52", 0.35, 0.5, 0.05);
  s += strich(K([[47.6, 13], [44.6, 13.6], [41, 13.6]]), "#5a4a44", 0.25, 0.6, 0.05);
  s += tasthaare(T, K([[42, 13.4], [46, 12.8], [49.4, 11]]), 7, 2.4, W + 40, "#3a3430", 0.05) + tasthaare(T, K([[38, 16], [42, 16.2], [45.6, 15.4]]), 6, 2.2, W + 75, "#3a3430", 0.05);
  /* Auge: 15 % größer, runder, im Augenbogen */
  const A = P(17.6, 1.6);
  s += auge2(T, F, A[0], A[1], 2.5, { winkel: 30, iris: "#2a1a10", iris2: "#0e0805", hoehe: 0.74, wimpern: 14, wl: 0.8, wr: 12, wf: "#2a2420", haut: "#fff6e8", mulde: 0.45 });
  /* Ohren: sehr lang (60 % der Kopflänge), breit; Ansatz als Röhre mit Falte, dunkler Rand und Spitze; innen Trichter mit Haarbüscheln */
  const ohrL = [[-4.4, 0.6], [-5.4, -6], [-5.6, -14], [-4.4, -22], [-2, -28], [0.2, -30.6, 1], [2.4, -27], [4.8, -20], [5.6, -12], [5, -5], [3.4, 0.8]];
  const ohrF = T.lg("eohr", [[0, "#1e1a16"], [0.14, "#3e3730"], [0.3, "#8a8276"], [1, "#958d80"]]);
  const OF = P(-2, -4), ON = P(3.6, -4.6);
  s += stueck(T, dreh(ohrL, OF[0], OF[1], -24), ohrF, F.schatten(OF[0] + 3, OF[1] - 6, 3, 8, 0.3), { licht: 1, dunkel: 0.6, hell: 0.4, q: 0.1 });
  const oI = dreh([[-3.4, -1], [-4, -8], [-3.6, -16], [-2, -23], [0, -26.4], [2.2, -20], [3.4, -12], [3, -4]], ON[0], ON[1], -6);
  s += stueck(T, dreh(ohrL, ON[0], ON[1], -6), ohrF,
    form(oI, T.lg("ohri", [[0, "#5a5248"], [0.5, "#b8b0a2"], [1, "#e4ddd0"]], 0.5, 0, 0, 0), "", 0.05) +
    haare2(T, oI, 60, -92, 3.2, { farben: [["#f2ece2", 1, 0.06, 0.8], ["#b8b0a2", 0.4, 0.05, 0.6]], streuung: 14, kruemmung: 0.2, szene: 0.3 }) +
    strich(dreh([[-5.2, -6], [-5.4, -14], [-4.2, -22], [-1.8, -28], [0.2, -30.4]], ON[0], ON[1], -6), "#1e1a16", 1, 0.7, 0.05) +
    F.schatten(...dreh([[-0.4, -2]], ON[0], ON[1], -6)[0], 3, 2.4, 0.5), { licht: 1, dunkel: 0.65, hell: 0.45, q: 0.1 });
  s += saum2(T, dreh([[2.8, -4], [3.4, -12], [2.2, -20]], ON[0], ON[1], -6), 22, -60, 2, "#f2ece2", 0.06, 0.8, { ab: 0.4, streuung: 20 });
  const kb = T.box(kopf);
  return { svg: s, box: [8, -166, 181, 0], fuesse: [29, 41, 88, 97], kopf: [kb[0] - 4, kb[1] - 34, kb[2] + 2, kb[3] + 2] };
}

/* =====================================================================
   SCHWEIN (Deutsche Landrasse, Sau)
   ===================================================================== */
/* RECHERCHE Schwein (Deutsche Landrasse, Zuchtziel/Exterieur, Sachsen „Exterieurbeurteilung Mutterrassen“): weiße
   Mutterrasse, großrahmig, lange Seite (16–17 Rippenpaare), gerade bis leicht gewölbte Rückenlinie (steigt zur Kruppe
   ~5 cm an), Kruppe hinten mäßig abfallend, volle Schinken, breite Schulter; mittellanger Kopf mit geradem Profil,
   gefurchte Stirn, große SCHLAPPOHREN nach vorn über die Augen; trockene, stabile Gliedmaßen mit Sprunggelenk (~38 %
   der Beinhöhe), Fesseln 50–55°; Sau mit ≥ 14 Zitzen (7 je Seite) auf flachen Drüsenwölbungen. Sau ~1,6–1,8 m lang,
   ~85–90 cm hoch, 250–300 kg. Paarhufer: zwei Hauptklauen, Afterklauen hinten tief an der Fessel. Haut cremeweiß mit
   rosa Unterton, kräftiger rosa an dünner Haut (Ohrränder, Achseln, Bauch, Gesäuge, Rüssel); spärliche Borsten, am
   Nacken/Rücken dichter (Borstenkamm), im Gegenlicht als Saum über der Silhouette; Poren. Rüsselscheibe fast senkrecht,
   rund, feucht, mit Rand (Rostralwulst); Maulspalte bis unter den vorderen Augenrand; Unterkiefer kürzer als die
   Oberlippe; schwere Backe; Ohr dünn, durchscheinend, mit verzweigten Adern. Auge klein, Wimpern hell. Ringelschwanz
   (Korkenzieher) mit Endquaste. Quellen: sachsen.de (Landrasse, Exterieur), NABU, Alberta 4-H Swine Judging. */
function schwein(T) {
  FEIN = T.fein;
  const F = flecken(T, "#fff4ec", "#7a3020");
  const U = ' gradientUnits="userSpaceOnUse"';
  const haut = T.lg("haut", [[0, "#f8e6da"], [0.35, "#f2d8c9"], [0.7, "#e3bba8"], [1, "#d6a894"]], 0, -90, 0, -30, U);
  const fernH = T.lg("fernH", [[0, "#c4a296"], [1, "#b8988c"]], 0, -40, 0, 0, U);
  const hornF = "#b4a49a";
  const borsten = fellMuster(T, "b", 1.6, 26, [["#fff8f0", 1, 0.05, 0.6], ["#c8907e", 0.5, 0.05, 0.4]], 18, 6);
  const poren = fellMuster(T, "p", 0.06, 40, [["#a86a5a", 1, 0.12, 0.18]], 180, 3);
  let s = "";
  /* Beinkanten (nah); ferne Beine verschoben, kühler */
  const HB = [[12, -40], [14, -36], [16.4, -30.6], [17.6, -25.6], [16.6, -22.6], [17.2, -20], [19, -17.6], [20.6, -12], [21.4, -8.8], [23, -6.2], [24.4, -4.2, 1]];
  const HV = [[30.8, -4.4, 1], [29.6, -6.6], [28.6, -9], [27.8, -12], [27, -15], [26.6, -18.6], [27.6, -21.6], [29.6, -25], [32.6, -29], [36, -33], [40, -34.6]];
  const VB = [[121.6, -36], [122.4, -30], [123, -24], [122.6, -19.6], [122.2, -17], [122.8, -14.6], [123.4, -10], [123.2, -7.6], [124.2, -5.6], [125.8, -4, 1]];
  const VV = [[132, -4.4, 1], [131, -6.4], [130.4, -8.6], [130.2, -12], [130.8, -15], [131.2, -18.4], [130.8, -22], [131.6, -28], [133.2, -34], [135.4, -40]];
  const fernBein = (vorn, dx) => {
    const pts = verschiebe(vorn ? VB.concat(VV) : HB.slice(1).concat(HV), dx).concat(vorn ? [[136 + dx, -46], [121 + dx, -46]] : [[42 + dx, -44], [14 + dx, -44]]);
    return stueck(T, pts, fernH, F.schatten((vorn ? 127 : 26) + dx, -36, 8, 7, 0.7) + plastik(F, verschiebe(vorn ? VB : HB.slice(1), dx), verschiebe(vorn ? VV : HV, dx), 0.5, 0.5),
      { licht: 0.8, dunkel: 0.6, hell: 0.3 });
  };
  const klaueS = (xh, f) => klaue2(T, F, xh, 7.8, 4.6, f, "#d4b4aa", "#7a6a60");
  s += vol(T, "bein", 2, fernBein(false, 9)) + klaueS(24.6 + 9, "#a89a8e") + afterklaue2(T, 21.4 + 9, -6.4, 1, "#8a7a70", "#e0c4b8");
  s += vol(T, "bein", 2, fernBein(true, -8)) + klaueS(126 - 8, "#a89a8e") + afterklaue2(T, 123.4 - 8, -6.4, 1, "#8a7a70", "#e0c4b8");
  /* Bauch mit 7 Drüsenwölbungen (wellige Unterlinie) */
  const zx = [46, 57, 68, 79, 90, 101, 111];
  const bauch = [[40, -34.6]];
  zx.forEach((x, i) => { const y0 = -32.6 - Math.abs(i - 3) * 0.35; bauch.push([x - 4.6, y0 + 0.5], [x, y0 - 0.4]); });
  bauch.push([116, -33.6], [119.6, -35]);
  /* Kopf gehört zum Umriss (die schwere Backe geht ohne Naht in Hals und Brust über) */
  const rumpf = HB.concat(HV, bauch, VB, VV, [[138.6, -45], [142, -48.6], [148, -51.6], [155, -53.8], [162, -54.6], [167, -54.8], [169.6, -56.2], [170.6, -57.4],
    [174, -58.2], [177.4, -58.8], [178, -63], [177.4, -67.4], [174, -69], [166, -72.6], [156, -77], [146, -81.6], [138, -85.6], [126, -87.4],
    [110, -88.4], [90, -89], [70, -88.6], [50, -87.8], [36, -86.8], [28, -85], [20, -82], [14.6, -79.6], [10, -76], [6.4, -70], [4.8, -62], [5, -54], [7, -47], [9.6, -42.6]]);
  const kopfLicht = F.licht(162, -73.4, 12, 2.4, 0.45, 24) + F.licht(152, -62, 6, 5, 0.3) + F.schatten(160, -56.4, 9, 2.4, 0.45, 4) + F.schatten(170, -57, 4, 1.4, 0.4) +
    fein(T, [169, 171.6, 174].map((x) => strich([[x, -70.4 + (x - 169) * 0.3], [x + 0.6, -68.4 + (x - 169) * 0.3], [x + 0.4, -66.6 + (x - 169) * 0.3]], "#a86a5c", 0.22, 0.45, 0.05)).join("")) +
    [0, 1, 2].map((i) => strich([[143.6 - i * 2.2, -64 + i * 1.4], [145 - i * 2.2, -58 + i * 1.4], [144 - i * 2.2, -52 + i * 1.4]], "#a86a5c", 0.4, 0.22, 0.05)).join("");
  const wuchs = richtung([[5, 100], [30, 140], [60, 165], [130, 150], [150, 120]]);
  const innen =
    fellZone(T, poren, rumpf, 0, 1) + fellZone(T, borsten, [[0, -100], [40, -100], [36, -30], [0, -30]], 105) + fellZone(T, borsten, [[40, -100], [125, -100], [125, -30], [36, -30]], 160) +
    fellZone(T, borsten, [[125, -100], [160, -100], [150, -30], [125, -30]], 130) + fellZone(T, borsten, [[0, -30], [140, -30], [140, 0], [0, 0]], 90) +
    /* Rumpf als liegender Zylinder: Lichtband am Rücken, Terminator bei 60 %, Kernschatten, warmes Bodenreflexlicht */
    rumpfLicht(F, 8, 148, -89, -32, 0.8) + F.licht(80, -84, 64, 3.4, 0.4) +
    /* Schulter und Schinken als Kugelmassen, je mit eigenem Licht und Kernschatten; Senken davor/dahinter */
    weich(T, masse(T, [[20, -40], [36, -36], [32, -28], [27, -22], [17, -24], [16.4, -30]], 1.2, 0.5, 0), 1.8) +
    F.schatten(42, -48, 10, 13, 0.32, -20) + F.schatten(28, -40, 12, 6, 0.3) + F.schatten(140, -50, 8, 12, 0.3, 15) +
    F.licht(24, -70, 15, 13, 0.45) + F.licht(130, -72, 11, 12, 0.4) + F.rinne(56, -84, 44, -44, 5, 0.08) + F.rinne(114, -82, 106, -46, 5, 0.07) +
    /* Hautfalten: Ellbogen, Knie/Flanke, Halsfalten hinter der Backe, Ringe an den Fesseln */
    strich([[124, -42], [128, -45.4], [134, -45.6]], "#a86a5c", 0.5, 0.35) + strich([[38, -38], [42, -41.6], [46, -41]], "#a86a5c", 0.5, 0.3) +
    [0, 1, 2].map((i) => strich([[142 - i * 2.4, -70 + i * 3], [143.6 - i * 2.4, -62 + i * 3], [143 - i * 2.4, -55 + i * 3]], "#a86a5c", 0.45, 0.22)).join("") +
    fein(T, strich([[123.6, -9.6], [127, -9.2], [130.2, -10]], "#a86a5c", 0.3, 0.3) + strich([[21.4, -10], [24.6, -9.8], [28, -10.6]], "#a86a5c", 0.3, 0.3)) +
    /* Sprunggelenk, Knie, Gesäuge-Rosa, Achselrosa */
    F.licht(16.8, -23, 0.9, 1.6, 0.4) + F.licht(131, -17, 0.9, 1.6, 0.35) +
    `<ellipse cx="80" cy="-33" rx="40" ry="3.4" fill="${T.rg("ros", [[0, "#e8a898", 0.4], [1, "#e8a898", 0]])}"/>` +
    F.schatten(125, -40, 6, 5, 0.35) + F.schatten(30, -36, 7, 4, 0.3) + kopfLicht;
  s += vol(T, "rumpf", 9, stueck(T, rumpf, haut, innen, { licht: 1.6, dunkel: 0.6, hell: 0.6, hellFarbe: "#fff6f0", q: T.fein ? 0.1 : 0.5 }), { tiefe: 4, umgebung: 0.4 });
  const rk = T._clip;
  /* Borstensaum im Gegenlicht: Rücken, Nacken, Bauch, Beinrückseiten */
  s += saum2(T, [[14.6, -79.6], [28, -85], [50, -87.8], [90, -89], [126, -87.4], [146, -83.6]], 90, wuchs, 2, "#fff8f0", 0.05, 0.7, { ab: 0.15, streuung: 40 });
  s += saum2(T, bauch, 40, 100, 1.6, "#f4e0d4", 0.05, 0.6, { ab: 0.2, streuung: 40 });
  s += saum2(T, [[6.4, -70], [4.8, -62], [5, -54], [7, -47]], 18, 150, 1.6, "#fff8f0", 0.05, 0.6, { ab: 0.2, streuung: 40 });
  s += klaueS(24.6, "#d0c2b4") + afterklaue2(T, 21.6, -6.4, 1.2, "#b4a498", "#f4e0d4") + klaueS(126, "#d0c2b4") + afterklaue2(T, 123.4, -6.4, 1.2, "#a49488", "#f4e0d4");
  /* Zitzen auf den Wölbungen (ferne Reihe dunkler dahinter) */
  zx.slice(1, 4).forEach((x) => { s += form([[x + 1.4, -31.8], [x + 2.4, -31.8], [x + 2.3, -30.4], [x + 1.9, -30], [x + 1.5, -30.4]], "#c88c80", "", 0.05); });
  zx.forEach((x, i) => {
    const y = -32.6 - Math.abs(i - 3) * 0.35 - 0.6;
    s += stueck(T, [[x - 0.6, y + 0.2], [x + 0.6, y + 0.2], [x + 0.55, y + 1.1], [x + 0.3, y + 1.6], [x - 0.3, y + 1.6], [x - 0.55, y + 1.1]], "#e0a494",
      F.kante(x - 0.5, y + 0.2, x - 0.4, y + 1.6, 0.2, 0.5) + F.schatten(x, y + 1.9, 0.6, 0.4, 0.3), { licht: 0.25, dunkel: 0.6, hell: 0, q: 0.05 });
  });
  /* Ringelschwanz: 1,5 Windungen in die Tiefe, verjüngt, Endquaste */
  s += imRumpf(rk, F.schatten(14, -78, 3, 2.4, 0.4));
  s += strich([[11.6, -78.6], [9.8, -80.6], [7.4, -80], [6.4, -77.4]], "#c89a8c", 1.2, 1, 0.05) + strich([[9.4, -76.4], [8.6, -78.6], [7, -78.2]], "#b88a7c", 0.8, 1, 0.05);
  s += strich([[13.6, -79], [11.6, -80.2], [9.8, -80.6]], "#e8c8b8", 1.4, 1, 0.05) + strich([[11.6, -78.6], [9.8, -80.6], [7.4, -80], [6.4, -77.4], [7.4, -75], [9.6, -75.6]], "#f0d2c2", 1, 1, 0.05);
  s += strich([[7, -78.2], [5, -76], [4.2, -72.6], [5, -70]], "#ecd0c0", 0.6, 1, 0.05) + strich([[10.4, -80.4], [8, -80.4]], "#fff", 0.3, 0.5, 0.05);
  s += saum2(T, [[4.8, -70.6], [5.2, -69.6]], 8, 100, 1.4, "#e8d0c4", 0.05, 0.8, { ab: 0, streuung: 50 });
  /* Kopf (im Rumpfumriss): Licht auf Stirn/Nasenrücken, schwere Backe mit Kernschatten, Querfalten, Maulspalte */
  const kopf = [[146, -81.6], [156, -77], [166, -72.6], [174, -69], [177.4, -67.4], [178, -63], [177.4, -58.8], [170.6, -57.4], [167, -54.8], [155, -53.8], [148, -51.6], [144, -60]];
  /* Rüsselscheibe: fast senkrecht, schmal, glänzender Rostralwulst, Nasenloch als Sichel am Vorderrand, feucht */
  const scheibe = [[176.4, -68.4], [178.4, -68], [179.6, -66], [179.8, -62.4], [179.4, -59.4], [178, -58.2], [176.6, -58.8], [176, -63]];
  s += stueck(T, scheibe, T.lg("sch", [[0, "#d89c8e"], [0.6, "#eab4a6"], [1, "#e4a898"]], 0, 0, 1, 0),
    F.licht(178.4, -66.2, 0.7, 1.2, 0.7) + form([[179, -64.4], [179.6, -63.6], [179.4, -60.6], [178.8, -60], [179, -62]], "#5a2c26", "", 0.05) +
    fein(T, `<g opacity=".25">${haare2(T, scheibe, 26, 0, 0.12, { farben: [["#8a4a40", 1, 0.08, 0.8]], streuung: 180 })}</g>`), { licht: 0.5, dunkel: 0.6, hell: 0.6, q: 0.05 });
  s += strich([[176.6, -68.2], [178.6, -67.8], [179.8, -65.8]], "#fff", 0.22, 0.6, 0.05) + F.licht(179.2, -61.8, 0.25, 0.25, 0.9);
  s += tasthaare(T, [[176.4, -66], [176, -62], [176.6, -59.4]], 9, 2, 20, "#fff4ec", 0.04) + tasthaare(T, [[168, -56.6], [172, -57.8], [175.6, -58.8]], 6, 1.8, 95, "#fff4ec", 0.04);
  /* Maulspalte von unter der Scheibe bis unter den vorderen Augenrand, leicht ansteigend, Mundwinkelfalte */
  s += strich([[176.2, -59.6], [171, -59.2], [165, -59.2], [161.4, -59.8]], "#8a4a40", 0.32, 0.55, 0.05) + strich([[161.4, -59.8], [160.4, -61.2]], "#8a4a40", 0.28, 0.45, 0.05);
  /* Auge: halb vom Ohr verdeckt, helle Wimpern */
  s += auge2(T, F, 159.4, -70.4, 1.55, { winkel: -4, iris: "#6a4024", iris2: "#2a1408", hoehe: 0.62, pupBreite: 0.45, wimpern: 10, wl: 0.9, wr: -30, wf: "#f4e4d8", haut: "#fff", mulde: 0.35, licht: 0.5 });
  /* Schlappohr: eingerollter Ohrgrund mit Knorpelfalten, kippt nach vorn-unten über das Auge; durchscheinend, verzweigte Adern */
  const ohr = [[146.6, -83], [153, -82.6], [159, -80.6], [164, -77.4], [168.6, -73.2], [172, -68.6], [173.6, -64.4], [172.6, -62.6], [168.6, -63.6],
    [164, -66.2], [159.6, -69.8], [155, -72.2], [150.6, -74.8], [147, -77.4]];
  s += imRumpf(rk, F.schatten(161, -67.4, 10, 2.6, 0.45, 26));
  s += stueck(T, ohr, T.lg("ohr", [[0, "#f2d6c8"], [0.55, "#efc2b2"], [1, "#e29a88"]], 0, 0, 1, 1),
    F.licht(156, -78, 8, 1.6, 0.55, 26) + F.schatten(162, -70.6, 9, 1.4, 0.3, 30) + F.glanz(169, -67, 3, 2, 0.3) +
    fein(T, strich([[149, -80], [155, -78], [161, -75], [166.4, -71], [170, -66.6]], "#b05a6a", 0.22, 0.4, 0.05) +
      strich([[155, -78], [159, -74.4], [161, -72.4]], "#b05a6a", 0.16, 0.35, 0.05) + strich([[161, -75], [164.6, -71], [165.4, -69.4]], "#b05a6a", 0.14, 0.3, 0.05) +
      strich([[152, -79.4], [154, -76.6]], "#b05a6a", 0.12, 0.3, 0.05)) +
    strich([[147.6, -81.4], [150, -78.4], [149.6, -76.4]], "#c08070", 0.4, 0.4, 0.05) + strich([[150.6, -81.6], [152.6, -78.6]], "#c08070", 0.3, 0.35, 0.05) +
    haare2(T, ohr, 22, 30, 1.1, { farben: [["#fff8f0", 1, 0.04, 0.6]], streuung: 20, szene: 0 }),
    { licht: 0.6, dunkel: 0.5, hell: 0.7, hellFarbe: "#fff4ec", q: 0.05 });
  s += strich([[147.6, -77.6], [155, -72.6], [163.4, -67.6], [171, -63.8]], "#fff0e8", 0.3, 0.5, 0.05);
  const kb = T.box(kopf.concat(scheibe, ohr));
  return { svg: s, box: [3, -90, 186, 0], fuesse: [29, 39, 121, 130], kopf: [kb[0] + 4, kb[1] - 8, kb[2] + 2, kb[3] + 2] };
}

/* =====================================================================
   SCHAF (Schwarzköpfiges Fleischschaf)
   ===================================================================== */
/* RECHERCHE Schaf (Schwarzköpfiges Fleischschaf, LfL Bayern; Suffolk-Standard zum Vergleich): mittel- bis großrahmiges
   Fleischschaf; Mutterschaf 70–80 cm Widerrist, 70–100 kg. Kopf mittelbreit, hornlos, SCHWARZ, Stirn höchstens leicht
   bewollt (kleiner Schopf im Genick), Ramsnase; kräftige, lange, glockenförmige Ohren, seitlich abstehend, leicht
   hängend; Voraugendrüse (Tränengrube) vor dem Auge; waagerechte, rechteckige Pupille, Iris bernsteinfarben; gespaltene
   Oberlippe. Vlies dicht, gleichmäßig weiß, Kreuzzuchtwolle 33–35 µm, kurzer Stapel; Stapel durch feine Wollspalten
   getrennt, Scheitel entlang der Rückenlinie, an den Seiten senkrecht fallend; unten und an den Keulen leicht gelblich
   (Wollfett, Staub). Beine kräftig, schwarz, ab Vorderfußwurzel/Sprunggelenk unbewollt, darüber bewollt. Fleischschaf:
   tiefe, breite, bis zum Sprunggelenk bemuskelte Keule; gerade Rückenlinie; Sprunggelenk auf 30–33 % WH; Klauen
   45–50°, Afterklauen hinten an der Fessel; Schwanz kupiert (kurzer bewollter Stummel). Länge Nase–Schwanzansatz ~1,3 m.
   Quellen: lfl.bayern.de Rassebeschreibungen (Schwarzköpfiges Fleischschaf, Suffolk), suffolks.org. */
/* Wollrand: Umriss in kleine Abschnitte teilen, unregelmäßig wenig nach außen (3–6 mm statt Wellen) */
function lockig(pts, r, rnd = null) {
  let fl = 0;
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; fl += a[0] * b[1] - b[0] * a[1]; }
  const sgn = fl > 0 ? 1 : -1, out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (a[2]) { out.push(a); continue; }
    const m = Math.max(1, Math.round(L / (r * 1.6)));
    for (let j = 0; j < m; j++) {
      const t = (j + (rnd ? (rnd() - 0.5) * 0.6 : 0)) / m, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
      const nx = (b[1] - a[1]) / L * sgn, ny = -(b[0] - a[0]) / L * sgn;
      const k = r * (rnd ? rnd() * 0.5 : 0.3);
      out.push([x + nx * k, y + ny * k]);
    }
  }
  return out;
}
/* Vlies-Muster: Kachel mit Stapelspitzen (abgeflachte Zellen), getrennt durch feine dunkle Wollspalten; je Zelle eine
   scharfe Lichtkante oben-links und feine Kräuselung. Zellen längs der Kachel-x-Achse (Zone dreht in Fallrichtung). */
function vliesMuster(T, name, zl, zb, spalte = "#8a7c60", hell = "#fffcf2") {
  const id = T.id("vm" + name);
  if (!T.fein) return `url(#${id})`;
  const nx = 6, ny = 7, S = [nx * zl, ny * zb];
  let sp = "", li = "", kr = "";
  const k = (v) => kurz(Math.round(v * 10) / 10);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const cx = (i + 0.5 + (j % 2) * 0.5) * zl + (T.rnd() - 0.5) * zl * 0.7, cy = (j + 0.5) * zb + (T.rnd() - 0.5) * zb * 0.6;
    const a = zl * (0.3 + T.rnd() * 0.3), b = zb * (0.3 + T.rnd() * 0.3);
    for (const [dx, dy] of [[0, 0], [-S[0], 0], [0, -S[1]], [S[0], 0], [0, S[1]]]) {
      const x = cx + dx, y = cy + dy;
      if (x < -zl || x > S[0] + zl || y < -zb || y > S[1] + zb) continue;
      /* Spalte: unterer und rechter Rand der Zelle (wo das Licht nicht hinkommt) */
      sp += `M${k(x - a)} ${k(y + b * 0.2)}Q${k(x - a * 0.2)} ${k(y + b * 1.25)} ${k(x + a)} ${k(y + b * 0.1)}`;
      /* Lichtkante oben-links */
      li += `M${k(x - a * 0.75)} ${k(y - b * 0.25)}Q${k(x - a * 0.2)} ${k(y - b * 0.95)} ${k(x + a * 0.5)} ${k(y - b * 0.7)}`;
      /* Kräuselung */
      kr += `M${k(x - a * 0.4)} ${k(y + b * 0.1)}q${k(a * 0.2)} ${k(-b * 0.3)} ${k(a * 0.4)} 0t${k(a * 0.4)} 0`;
    }
  }
  T.def(`<pattern id="${id}" width="${k(S[0])}" height="${k(S[1])}" patternUnits="userSpaceOnUse"><g fill="none" stroke-linecap="round">` +
    `<path d="${sp}" stroke="${spalte}" stroke-width="${k(zb * 0.13)}" stroke-opacity=".28"/><path d="${li}" stroke="${hell}" stroke-width="${k(zb * 0.15)}" stroke-opacity=".5"/>` +
    `<path d="${kr}" stroke="${spalte}" stroke-width="${k(zb * 0.05)}" stroke-opacity=".22"/></g></pattern>`);
  return `url(#${id})`;
}
function schaf(T) {
  FEIN = T.fein;
  const F = flecken(T, "#fffaee", "#2a2418");
  const U = ' gradientUnits="userSpaceOnUse"';
  const wolF = T.lg("wolle", [[0, "#f6f0e2"], [0.3, "#eee6d4"], [0.62, "#d6cab2"], [0.8, "#b6aa92"], [1, "#c8bca2"]], 0, -80, 0, -36, U);
  const bein = T.lg("bein", [[0, "#3c342e"], [0.5, "#26201c"], [1, "#1a1614"]], 0, 0, 1, 0), beinF = "#2a2420", horn = "#2a2420";
  const vm = vliesMuster(T, "a", 1.9, 1.5), vmFein = vliesMuster(T, "b", 1.5, 1.2);
  const haarS = fellMuster(T, "s", 0.7, 50, [["#6a6058", 1, 0.04, 0.3]], 10, 3);
  let s = "";
  /* Beine (unbewollt ab Knie/Sprunggelenk); fern: versetzt, 10–15 % dunkler */
  const HB = [[13.4, -26], [12.6, -23.4], [13.2, -21.2], [15, -18.8], [15.6, -12], [15.2, -7.8], [14.6, -6.6], [15.2, -4.6], [16.4, -3.2], [17.2, -2.2, 1]];
  const HV = [[21.6, -3.6, 1], [20.4, -4.8], [19.6, -6.2], [19.8, -7.8], [18.8, -9.2], [18.6, -14], [18.8, -19], [19.6, -22.6], [21, -26]];
  const VB = [[88.2, -25], [88.8, -22], [89.4, -20], [90.2, -16.6], [90.4, -9], [90, -7.6], [89.4, -6.6], [90, -4.6], [91, -3.2], [91.8, -2.2, 1]];
  const VV = [[96.2, -3.6, 1], [95, -4.8], [94.2, -6.2], [94.4, -7.8], [93.4, -9.2], [93.2, -16.6], [94, -19.8], [94.8, -22.6], [95, -25]];
  const lauf = (pts, f, fern) => vol(T, "bein", 0.9, stueck(T, pts, f, fellZone(T, haarS, pts, 92, 1) + (fern ? "" : F.glanz(T.box(pts)[0] + 1.8, -14, 1.2, 9, 0.18)) +
    F.schatten((T.box(pts)[0] + T.box(pts)[2]) / 2, -26, 4, 3, 0.6), { licht: 0.7, dunkel: 0.7, hell: fern ? 0.2 : 0.4, hellFarbe: "#a89888" }), { tiefe: 3, umgebung: 0.45 });
  s += lauf(verschiebe(HB.concat(HV), 8).concat([[30, -30], [20, -30]]), beinF, 1) + klaue2(T, F, 25, 6.4, 3.7, "#3a3430", "#5a4a44") + afterklaue2(T, 22.2, -6.6, 0.8, "#2a2420", "#3a322c");
  s += lauf(verschiebe(VB.concat(VV), -6).concat([[88, -28], [83, -28]]), beinF, 1) + klaue2(T, F, 85.6, 6.4, 3.7, "#3a3430", "#5a4a44") + afterklaue2(T, 82.8, -6.6, 0.8, "#2a2420", "#3a322c");
  /* Wollärmel der fernen Beine (bis Knie/Sprunggelenk), dunkler */
  const aermel = (pts) => stueck(T, lockig(pts, 0.6, T.rnd), "#b8ac94", fellZone(T, vm, pts, 92, 0.8), { licht: 0.8, dunkel: 0.5, hell: 0.2 });
  s += aermel([[21, -40], [31, -40], [30, -27], [27.6, -24.6], [22, -25.2], [20, -30]]) + aermel([[78, -44], [90, -44], [89.6, -26], [86.6, -24], [82.4, -25], [80.6, -32]]);
  s += lauf(HB.concat(HV, [[23, -30], [12, -30]]), bein, 0) + klaue2(T, F, 17, 6.4, 3.7, "#4a4440", "#6a5a54") + afterklaue2(T, 14.2, -6.6, 0.9, "#2a2420", "#3a322c");
  s += lauf(VB.concat(VV, [[96, -30], [87, -30]]), bein, 0) + klaue2(T, F, 91.6, 6.4, 3.7, "#4a4440", "#6a5a54") + afterklaue2(T, 88.8, -6.6, 0.9, "#2a2420", "#3a322c");
  /* Kopf: schwarz, Ramsnase, breites Maul; Genick 5–8 % WH über dem Widerrist; 50° geneigt, 26 cm */
  const G = [117.6, -90], W = 50, K = (pts) => dreh(pts, G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  const ohrL = [[0, -2], [4.6, -3.4], [9.4, -3.2], [12.8, -1.4], [13.6, 0.8], [11.6, 2.6], [7.6, 3.2], [3.4, 2.6], [0, 1.6]];
  /* fernes Ohr: hinter Kopf und Hals, nur die Spitze schaut über das Genick */
  const OF = P(1.4, -1.6);
  s += stueck(T, dreh(ohrL, OF[0], OF[1], 172), "#1c1814", "", { licht: 0.4, dunkel: 0.5, hell: 0.3, hellFarbe: "#6a6058", q: 0.05 });
  /* Vlies aus dem Skelett: gerade Rückenlinie, Keule kräftig gewölbt bis zum Sprunggelenk, Bugspitze rund,
     tiefster Punkt der Unterlinie hinter den Vorderbeinen, Bauch zur Flanke ansteigend */
  const basis = [[110, -86], [104, -82.4], [96, -78], [88, -76.6], [76, -76.8], [60, -77], [44, -77.4], [30, -77], [20, -75.4], [13, -71.6],
    [7.6, -66], [4.4, -58], [4, -49], [6, -40.6], [9.4, -33.4], [12.6, -28], [16, -25.4], [21, -25.6], [24.6, -29], [29, -35.6], [34, -41.6],
    [42, -43], [54, -41.4], [66, -39.8], [78, -38.6], [84, -38.6], [86.6, -32], [87.4, -26.4], [91, -24.2], [95.6, -25], [97.4, -30.4], [99.6, -36.6],
    [103.6, -42.4], [106.6, -48.6], [108.4, -55], [110.2, -61], [112.6, -67.4], [115.4, -73.6], [118.6, -79.4], [117.6, -86.6]];
  const vlies = lockig(basis, 1.1, T.rnd);
  const dV = gl(vlies, true, T.fein ? 0.1 : 0.5);
  const zRuecken = [[0, -84], [120, -96], [120, -74], [0, -70]];
  const zSeite = [[24, -76], [96, -76], [96, -20], [24, -20]];
  const zKeule = [[0, -76], [26, -76], [32, -40], [24, -20], [0, -20]];
  const zBug = [[94, -80], [122, -90], [118, -50], [100, -20], [86, -20], [90, -60]];
  const vInnen =
    fellZone(T, vm, zSeite, 90) + fellZone(T, vm, zKeule, 112) + fellZone(T, vm, zBug, 70) + fellZone(T, vmFein, zRuecken, 0) +
    fellZone(T, vmFein, [[100, -96], [124, -96], [120, -60], [104, -60]], 64) +
    /* Walze: obere 30 % warmes Licht, Kernschatten bei 65–80 %, Reflexlicht unten; Schulter und Keule als eigene Rundungen */
    rumpfLicht(F, 6, 112, -78, -38, 0.8) + F.licht(26, -62, 13, 12, 0.5) + F.schatten(16, -36, 10, 8, 0.4) + F.licht(98, -64, 8, 10, 0.4) + F.schatten(102, -44, 6, 6, 0.35) +
    F.rinne(30, -70, 34, -46, 3, 0.18) + F.rinne(86, -72, 84, -48, 3, 0.14) +
    /* Wollfett/Staub unten und an der Keule, Okklusion an den Beinansätzen, Kopfschatten auf dem Hals */
    `<rect x="0" y="-48" width="122" height="24" fill="${T.lg("gelb", [[0, "#d9cba8", 0], [1, "#c8b890", 0.55]])}"/>` +
    F.schatten(17, -26, 6, 2.6, 0.7) + F.schatten(91, -25.6, 6, 2.4, 0.7) + F.schatten(113, -70, 6, 8, 0.45, 20) + F.schatten(108, -84, 5, 3, 0.4) +
    haare2(T, vlies, 80, (x, y) => (y > -60 ? 95 : 70 + T.rnd() * 40), 0.9, { farben: [["#fffdf6", 1, 0.06, 0.6], ["#a89a7c", 0.6, 0.05, 0.4]], streuung: 90, kruemmung: 0.5, szene: 0 });
  s += vol(T, "rumpf", 9, stueck(T, dV, wolF, vInnen, { licht: 1.5, dunkel: 0.55, hell: 0.6, hellFarbe: "#fffaf0" }), { tiefe: 4, umgebung: 0.4 });
  const rk = T._clip;
  /* Faserspitzen am Vliesrand (halbtransparent), Lichtseite heller */
  s += saum2(T, vlies.filter((p, i) => i % 2 === 0), 160, (x, y) => (y < -70 ? -100 + (x - 60) * 0.1 : x < 30 ? 180 : 100), 0.8, "#f6f0e2", 0.07, 0.6, { ab: 0.5, streuung: 70 });
  /* kupierter, bewollter Schwanzstummel */
  const schw = lockig([[14, -72.6], [9.6, -73.6], [6.8, -71], [6.4, -66.4], [8.6, -64.6], [11.6, -67]], 0.6, T.rnd);
  s += stueck(T, schw, T.lg("sw", [[0, "#f2ecde"], [1, "#c8bca4"]]), fellZone(T, vmFein, schw, 100), { licht: 0.8, dunkel: 0.5, hell: 0.5 });
  const kopf = K([[-1, -2.4], [5, -4], [10, -4.8], [16, -4.4], [21, -3], [24.4, -1], [26.2, 1.8], [26.8, 4.8], [26.2, 7.2], [25.2, 8.2], [24.6, 8.6], [24.4, 9.4],
    [23.2, 10.4], [21, 10.8], [17, 10.6], [12, 12.2], [7, 15], [3, 15.4], [0, 12.4], [-1.6, 5]]);
  const kInnen = fellZone(T, haarS, kopf, W, 0.8) +
    F.licht(...P(14, -2.4), 9, 1.6, 0.35, W) + F.licht(...P(10, 6), 4, 3, 0.2, W) + F.schatten(...P(7, 12), 6, 3, 0.55, W) + F.schatten(...P(1, 9), 2.4, 5, 0.45, W) +
    F.kante(...P(10, 4.6), ...P(18, 4.4), 0.8, 0.3) + F.schatten(...P(18, 9.6), 6, 1.4, 0.45, W) +
    /* Satinglanz auf Nasenrücken und Jochbogen */
    F.licht(...P(20, -1.6), 5, 0.9, 0.35, W - 8) + F.licht(...P(9, 3.6), 3, 0.8, 0.25, W);
  s += vol(T, "kopf", 2.4, stueck(T, kopf, T.lg("kopf", [[0, "#302822"], [1, "#16120f"]]), kInnen, { licht: 0.9, dunkel: 0.6, hell: 0.6, hellFarbe: "#8a7e74", q: 0.05 }), { tiefe: 4, umgebung: 0.4 });
  /* Wollkragen hinter den Ohren und an der Kehle (saubere Kragenlinie) */
  s += saum2(T, K([[-0.6, 4], [0, 10], [2, 14]]), 30, W + 180, 1.2, "#f2ecde", 0.07, 0.75, { ab: 0.7, streuung: 30 });
  /* Nasenloch: schräges Komma, heller Nasenflügel; gespaltene Oberlippe; dünne Maulspalte; Kinn */
  s += form(K([[23.6, 1.6], [25.4, 2], [26, 3.6], [25.4, 5.4], [24.6, 4], [23.8, 3]]), "#050302", "", 0.05);
  s += strich(K([[23.2, 1], [25.4, 1.2], [26.6, 3.4]]), "#7a6a62", 0.2, 0.6, 0.05) + strich(K([[26.4, 6.4], [25.4, 7.2], [25, 8.4]]), "#000", 0.2, 0.7, 0.05);
  s += strich(K([[24.8, 8.6], [22, 9], [19.6, 8.6]]), "#000", 0.16, 0.7, 0.05) + F.licht(...P(22, 10.4), 1.4, 0.5, 0.25, W);
  s += tasthaare(T, K([[21, 9.4], [24, 8.8], [25.8, 7]]), 5, 1.2, W + 50, "#6a6058", 0.03);
  /* Auge: Bernstein, rechteckige Pupille, kurze dichte Wimpern; Voraugendrüse vorn-unten */
  const A = P(8.4, 1.4);
  s += F.schatten(...P(11.6, 3.6), 1.6, 0.8, 0.6, W - 20);
  s += auge2(T, F, A[0], A[1], 1.3, { winkel: 26, iris: "#c4943e", iris2: "#5a3a10", hoehe: 0.64, pupBreite: 0.72, wimpern: 12, wl: 0.32, wr: -60, wf: "#1a1612", haut: "#6a6058", mulde: 0.4, licht: 0.6, unten: 0 });
  /* Ohren: glockenförmig, seitlich-hängend (Spitze ~20° unter der Waagerechten); fernes Ohr: Spitze hinter dem Genick */
  const ON = P(3.6, 0.4);
  /* kleiner Wollschopf im Genick */
  const schopf = lockig(K([[-2, -2.8], [0.6, -5], [3.6, -5.6], [5.6, -4.6], [3.6, -3.6], [0.8, -2.4]]), 0.4, T.rnd);
  s += stueck(T, schopf, T.lg("schopf", [[0, "#efe8d6"], [0.7, "#d8ceb8"], [1, "#8a8070"]], 0, 0, 0.3, 1), fellZone(T, vmFein, schopf, 30), { licht: 0.4, dunkel: 0.5, hell: 0.5, q: 0.05 });
  s += saum2(T, K([[-1.6, -2.8], [1.4, -5], [4.4, -5.4], [5.6, -4.4]]), 16, W - 120, 0.6, "#f6f0e2", 0.05, 0.6, { ab: 0.3, streuung: 60 }) +
    saum2(T, K([[0.8, -2.4], [3.6, -3.6], [5.6, -4.4]]), 14, W + 10, 0.8, "#efe8d6", 0.05, 0.5, { ab: 0.1, streuung: 30 });
  s += imRumpf(rk, F.schatten(ON[0] - 4, ON[1] + 2, 6, 2, 0.45, 20));
  s += stueck(T, dreh(ohrL, ON[0], ON[1], 158), T.lg("ohr", [[0, "#2c2620"], [1, "#14110e"]]),
    form(dreh([[2.6, 0.6], [7, 1.2], [11, 0.8], [12.4, 0.6], [11, 2], [7, 2.4], [3, 1.8]], ON[0], ON[1], 158), "#7a6862", "", 0.05) +
    F.licht(...dreh([[6.4, -2]], ON[0], ON[1], 158)[0], 4.4, 0.8, 0.35, 158 - 180) + strich(dreh([[1.4, -0.4], [2.8, 1]], ON[0], ON[1], 158), "#000", 0.25, 0.5, 0.05),
    { licht: 0.5, dunkel: 0.6, hell: 0.5, hellFarbe: "#6a6058", q: 0.05 });
  const kb = T.box(kopf);
  return { svg: s, box: [4, -99, 134, 0], fuesse: [20, 28, 88, 94], kopf: [kb[0] - 14, kb[1] - 6, kb[2] + 2, kb[3] + 2] };
}

/* =====================================================================
   ZIEGE (Bunte Deutsche Edelziege, Geiß)
   ===================================================================== */
/* RECHERCHE Ziege (Bunte Deutsche Edelziege, Rassebeschreibung sachsen.de / genres.de Steckbrief): seit 1928 aus den
   braunen Landschlägen; reh- bis dunkelbraun mit schwarzem AALSTRICH, dunkler Bauch und dunkle Beine, Gesicht hell bis
   dunkel gezeichnet (dunkler Streifen vom Auge zum Maulwinkel), kurzes, glatt anliegendes, seidig glänzendes Haar,
   längeres Haar an Rückenlinie, Bauch und Keulen („Hosen“); STEHOHREN; behornt oder hornlos (hier: Geiß mit säbelförmig
   nach hinten gebogenen Hörnern mit dichten Querwülsten, Spitze glatt); Bart. Geiß 70–90 cm Widerrist (hier 80),
   55–75 kg. Straffer Rücken, Becken breit, nicht zu steil; Milchziege: flache, leicht konkave Keule; trockene Gliedmaßen,
   Sprunggelenk auf ≈ 39 % WH; Euter breit angesetzt, fest, mit ZWEI kegelförmigen Zitzen, die senkrecht bis leicht nach
   vorn zeigen; Klauen klein, Afterklauen. Auge hell bernsteingelb mit waagerechter, rechteckiger Pupille. Kurzer,
   flacher, aufgestellter Schwanz mit gefransten Rändern. Haarstrich: Kopf/Hals nach hinten-unten, Rumpf nach hinten
   (10–20° abwärts), Keule abwärts mit Haarnaht, Wirbel an der Kniefalte, Beine abwärts. */
const Z_HB = [[12.6, -71.6], [13.6, -66], [14.6, -60], [15.4, -52], [16.4, -46], [16.6, -40], [15.6, -34], [14.4, -31.6], [15, -29.4], [17.2, -27.6],
  [18.4, -25], [18.6, -12], [17.8, -9.8], [18.2, -7.6], [19.6, -5.4], [21, -3.6], [21.6, -2.4, 1]];
const Z_HV = [[25.8, -4.2, 1], [24.6, -5.6], [23.6, -7.4], [23.4, -10.2], [22.6, -12], [22.4, -16], [22.4, -24], [23, -27.6], [24.4, -31], [26.2, -34.4], [27.6, -37.4]];
const Z_VB = [[68, -53], [68.4, -48], [69.2, -40], [69.6, -34], [69, -30.4], [69.2, -27.6], [70.4, -25], [70.8, -18], [70.8, -12], [70, -9.8], [70.4, -7.6],
  [71.8, -5.4], [73.2, -3.6], [73.8, -2.4, 1]];
const Z_VV = [[77.8, -4.2, 1], [76.8, -5.6], [76, -7.4], [76, -10.2], [75.2, -12], [74.8, -18], [75, -24], [76, -26.6], [76.2, -31], [75.4, -33], [75.8, -38],
  [76.6, -44], [77.6, -49]];
function ziege(T) {
  FEIN = T.fein;
  const F = flecken(T, "#ffe2b8", "#1a0c04");
  const U = ' gradientUnits="userSpaceOnUse"';
  const fell = T.lg("fell", [[0, "#bc844c"], [0.35, "#a86e3c"], [0.62, "#8a5428"], [0.8, "#3a2416"], [1, "#2a1c12"]], 0, -82, 0, -50, U);
  const fern = T.lg("fern", [[0, "#6a4424"], [0.4, "#2e2016"], [1, "#221a14"]], 0, -56, 0, 0, U);
  const schwarz = "#1e1712";
  const dH = fellMuster(T, "d", 1.5, 90, [["#3a1e0c", 1, 0.05, 0.2]], 8, 6);
  const hH = fellMuster(T, "h", 1.4, 50, [["#f2c890", 1, 0.05, 0.22]], 8, 6);
  const sH = fellMuster(T, "s", 1.4, 50, [["#7a5a40", 1, 0.05, 0.22]], 8, 6);
  let s = "";
  /* ferne Beine: beginnen verdeckt hinter dem Rumpf, 10–15 % dunkler und kühler */
  const fernBein = (vorn, dx) => {
    const pts = verschiebe(vorn ? Z_VB.concat(Z_VV) : Z_HB.slice(5).concat(Z_HV), dx).concat(vorn ? [[78 + dx, -58], [68 + dx, -58]] : [[30 + dx, -46], [16 + dx, -46]]);
    return stueck(T, pts, fern, fellZone(T, sH, pts, 92, 0.8) + F.schatten((vorn ? 72 : 22) + dx, -46, 6, 8, 0.6) +
      plastik(F, verschiebe(vorn ? Z_VB : Z_HB.slice(5), dx), verschiebe(vorn ? Z_VV : Z_HV, dx), 0.5, 0.5), { licht: 0.7, dunkel: 0.6, hell: 0.25 });
  };
  const kl = (xh, f) => klaue2(T, F, xh, 6.2, 3.6, f, "#4a3a32", "#120e0c");
  s += vol(T, "bein", 1.4, fernBein(false, 6)) + kl(21.6 + 6, "#2e2824") + afterklaue2(T, 18 + 6, -7.6, 0.8, "#1a1512", "#2a201a");
  s += vol(T, "bein", 1.4, fernBein(true, -6)) + kl(73.8 - 6, "#2e2824") + afterklaue2(T, 70.2 - 6, -7.6, 0.8, "#1a1512", "#2a201a");
  /* Rumpf, Hals, Euter (zwischen den Hinterbeinen) und nahe Beine */
  const rumpf = Z_HB.concat(Z_HV, [[30, -37.6], [34, -37.4], [38, -38.6], [41.6, -41.6], [44.2, -46.4], [46.4, -50.4], [52, -53], [60, -52.6], [65, -52.8]], Z_VB, Z_VV,
    [[79.6, -51.6], [82.2, -54], [83.8, -57.4], [84.4, -61], [85, -66], [86.2, -72], [87.4, -78], [88.6, -84], [89.6, -89], [91, -93], [94, -100],
      [96, -102.4], [92, -99.4], [87, -94.4], [82, -89.4], [77, -84.6], [72.4, -80.6], [66, -79.4], [58, -78.8], [48, -78.6], [40, -79], [34, -80.4], [30, -79.8],
      [24, -77.6], [19, -75.6], [15, -73.8]]);
  const wuchs = richtung([[12, 92], [30, 100], [36, 165], [66, 166], [74, 100], [90, 125]]);
  const euter = [[22, -54], [36, -50], [44, -48], [46, -44], [42, -40.4], [36, -37.8], [28, -37.6], [22, -42]];
  const hinterbein = Z_HB.slice(4).concat(Z_HV, [[29, -41], [31.4, -45.4], [33.6, -50.4], [35.6, -55], [26, -60], [16, -58]]);
  const zHinten = [[0, -84], [36, -84], [40, -60], [30, -30], [10, -30]];
  const zRumpf = [[36, -84], [70, -84], [70, -50], [38, -50], [40, -60]];
  const zVorn = [[70, -84], [100, -108], [90, -86], [86, -54], [70, -50]];
  const innen =
    fellZone(T, dH, zHinten, 96) + fellZone(T, dH, zRumpf, 168) + fellZone(T, dH, zVorn, 122) + fellZone(T, sH, [[10, -36], [80, -36], [80, 0], [10, 0]], 90) +
    fellZone(T, hH, [[10, -82], [72, -84], [96, -106], [92, -92], [70, -70], [20, -66]], 165, 0.9) +
    /* Euter: grau-rosabraun, breit angesetzt, vorn flach in die Bauchwand; nahes Hinterbein liegt davor */
    form(euter, T.lg("eu", [[0, "#6a4a3a", 0], [0.4, "#8c6a62", 0.85], [1, "#6e5048", 1]]), "", 0.2) +
    F.licht(37, -43, 4, 2, 0.25) + F.rinne(33, -48, 34, -38.6, 0.8, 0.3) + F.schatten(34, -38.6, 8, 1.4, 0.4) +
    fein(T, strich([[44, -45], [40, -43.4], [36, -44.6]], "#5e4640", 0.3, 0.25)) +
    haare2(T, euter, 20, 95, 0.6, { farben: [["#a88a80", 1, 0.04, 0.5]], streuung: 30, szene: 0 }) + F.schatten(34, -50, 12, 4, 0.45) +
    form(hinterbein, fell, "", 0.1) + fellZone(T, dH, hinterbein, 92) + F.rinne(28.4, -39, 35.4, -55, 1, 0.45) +
    /* dunkler Bauch und dunkle Beine (BDE-Zeichnung), weich in das Rehbraun */
    `<path d="M10 -40C30 -46 44 -60 56 -60C66 -60 74 -58 90 -64L90 2L10 2Z" fill="${T.lg("bauchs", [[0, schwarz, 0], [0.14, schwarz, 0.6], [0.3, schwarz, 0.86], [1, schwarz, 0.92]])}"/>` +
    fein(T, saum2(T, [[38, -57], [52, -56.6], [66, -57]], 40, 95, 1.8, schwarz, 0.06, 0.6, { streuung: 20 })) +
    /* Aalstrich: über Widerrist und Lende breiter, am Hals schmaler, zum Schwanz auslaufend; Unterkante haarig */
    strich([[94, -99.4], [88, -94], [82, -88.6], [76.6, -84], [72.2, -80.2]], schwarz, 0.9, 0.75) +
    strich([[72.2, -80.2], [62, -78.4], [48, -78.2], [36, -79.6], [30, -79.2], [24, -77], [20, -75.2]], schwarz, 1.8, 0.8) +
    fein(T, saum2(T, [[90, -95], [80, -86.6], [72, -79.2], [58, -77.6], [40, -78.2], [24, -76.4]], 60, wuchs, 1.6, schwarz, 0.06, 0.7, { streuung: 20 })) +
    /* Licht: Zylinder, Schulterblatt, Bugspitze, Rippenwellen, Hüft-/Sitzbeinhöcker, Keule mit Rinne */
    rumpfLicht(F, 12, 84, -80, -52, 0.75) +
    weich(T, masse(T, [[34, -81], [20, -78], [13.6, -72], [15, -52], [17, -44], [26, -42], [33, -52], [38, -64], [40, -76]], 2.6, 0.6, 0) +
      masse(T, [[70, -80], [76, -82], [83, -64], [84, -58], [78, -50], [70, -50], [66, -62]], 2.2, 0.55, 0), 1.3) +
    F.licht(33, -80, 2.6, 1, 0.45, -10) + F.schatten(35, -77, 3, 2.4, 0.35) + F.licht(13.8, -74.4, 0.8, 1.6, 0.4) + F.rinne(17, -70, 18, -50, 1.4, 0.3) +
    F.kante(72, -78, 80, -58, 1.4, 0.4) + F.licht(83, -56, 1.6, 2, 0.4) + [48, 53, 58].map((x) => F.rinne(x, -72, x - 3, -58, 1.2, 0.12)).join("") +
    F.rinne(87, -86, 85.4, -64, 1, 0.35) + F.kante(89.6, -86, 87.6, -66, 0.9, 0.3) + F.rinne(36.6, -56, 40, -64, 0.9, 0.35) +
    wirbel(T, 37, -60, 1.8, 18, "#3a1e0c", 0.05, 0.45, 1) +
    /* Läufe: seidig matt, Gelenke, Sehne; Rumpfschatten auf den Beinansätzen */
    F.licht(76, -28.6, 0.8, 2, 0.25) + F.licht(15, -31.6, 0.8, 1.6, 0.3) + F.rinne(72.6, -22, 72.8, -12, 0.45, 0.4) + F.rinne(20.2, -22, 20.4, -12, 0.45, 0.4) +
    F.schatten(72, -50, 6, 4, 0.4) + F.schatten(22, -44, 5, 4, 0.35);
  s += vol(T, "rumpf", 6, stueck(T, rumpf, fell, innen, { licht: 1.2, dunkel: 0.7, hell: 0.6, hellFarbe: "#ffe2b8", q: T.fein ? 0.1 : 0.5 }), { tiefe: 4, umgebung: 0.35 });
  const rk = T._clip;
  /* Silhouette mit Haarspitzen gebrochen: Rückenkamm, Bauch, Keule, Kehle */
  s += saum2(T, [[19, -75.6], [30, -79.8], [48, -78.6], [66, -79.4], [77, -84.6], [87, -94.4]], 70, wuchs, 2, schwarz, 0.06, 0.7, { ab: 0.15, streuung: 18 });
  s += saum2(T, [[46.4, -50.4], [52, -53], [60, -52.6], [65, -52.8]], 24, 100, 2.4, schwarz, 0.06, 0.7, { ab: 0.2, streuung: 24 });
  s += saum2(T, [[13.6, -68], [14.6, -60], [15.4, -52]], 16, 110, 2, "#6a4426", 0.06, 0.6, { ab: 0.2 });
  s += saum2(T, [[85, -66], [87.4, -78], [89.6, -89]], 18, 150, 1.6, "#8a5428", 0.05, 0.6, { ab: 0.2 });
  s += kl(21.6, "#3a332e") + afterklaue2(T, 18, -7.6, 0.9, "#1a1512", "#2a201a") + kl(73.8, "#3a332e") + afterklaue2(T, 70.2, -7.6, 0.9, "#1a1512", "#2a201a");
  /* Zitzen: zwei Kegel, leicht nach vorn-unten; ferne versetzt, halb verdeckt, dunkler */
  const zitze = (x, y, f, k) => stueck(T, dreh([[-1.2, 0], [1.2, 0], [0.9, 3], [0.6, 4.4], [-0.6, 4.4], [-0.9, 3]], x, y, -12), f,
    F.kante(...dreh([[-0.6, 0.4], [-0.4, 3.6]], x, y, -12).flat(), 0.3, 0.3 * k) + F.schatten(...dreh([[0, 4]], x, y, -12)[0], 0.8, 0.6, 0.4), { licht: 0.3, dunkel: 0.6, hell: 0, q: 0.05 });
  s += zitze(36.6, -38.8, "#6e5048", 0.4) + zitze(33.4, -38.2, "#8c6a62", 1);
  /* Schwanz: kurz, flach, breite Basis, 50° aufgestellt, gefranst; Unterseite heller */
  const schw = [[21.4, -75.6], [17.6, -76], [14.6, -79], [12.4, -82.4], [13.2, -83.6], [16.4, -81.6], [19.6, -79], [22.6, -77.6]];
  s += stueck(T, schw, schwarz, form([[18.4, -77], [15.4, -79.6], [14.2, -81.4], [16.6, -79.6]], "#5a4030", "", 0.05), { licht: 0.4, dunkel: 0.5, hell: 0.3 });
  s += saum2(T, [[20.4, -78.6], [16.8, -80.4], [12.8, -83.2], [15.2, -82.4], [18.8, -80]], 26, -120, 1.6, schwarz, 0.05, 0.8, { ab: 0.2, streuung: 40 });
  /* Kopf: gerades Profil, Stirnwölbung zwischen den Hornansätzen; 55° geneigt, 24 cm */
  const G = [96, -100.6], W = 55, K = (pts) => dreh(pts, G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  const kopf = K([[-1, -2.4], [4, -3.9], [9, -3.6], [15, -2.8], [20, -1.6], [23, 0.2], [24.4, 2.6], [24.4, 5], [23.4, 6.4], [22.2, 6.8], [21.6, 7.4], [22, 8.2],
    [20.6, 9.4], [17, 9.2], [12, 10.4], [7, 12.8], [2.6, 13], [0, 10.6], [-1.4, 4.4]]);
  s += imRumpf(rk, F.schatten(...P(2, 12), 4, 3, 0.5, W));
  const kInnen = fellZone(T, dH, kopf, W - 180, 0.9) +
    /* dunkler Gesichtsstreifen Auge → Maulwinkel (modelliert zugleich), Maul dunkelbraun */
    F.rinne(...P(9, 2.6), ...P(16, 4.4), 1.2, 0.7) + F.rinne(...P(14.6, 4.6), ...P(21.6, 6.2), 1.4, 0.75) +
    F.licht(...P(13, -1.4), 7, 1.4, 0.4, W) + F.kante(...P(5, 5), ...P(12, 6.6), 1, 0.35) + F.schatten(...P(7, 10), 4, 2, 0.5, W) + F.schatten(...P(1.4, 7), 2, 4, 0.4, W) +
    F.schatten(...P(17, 8.6), 4, 1.2, 0.4, W) +
    `<ellipse transform="translate(${folge([z(P(22.6, 4)[0], 0.1), z(P(22.6, 4)[1], 0.1)])})rotate(${W})" rx="2.4" ry="2.6" fill="#b88a70" opacity=".35"/>`;
  s += vol(T, "kopf", 2, stueck(T, kopf, fell, kInnen, { licht: 0.8, dunkel: 0.7, hell: 0.5, hellFarbe: "#ffe2b8", q: 0.05 }), { tiefe: 4, umgebung: 0.35 });
  /* Nüster: schräges Komma, oben breit nach hinten-oben offen, unten in die Lippenspalte; feuchter Glanz */
  s += form(K([[21.2, 1.4], [23, 1.4], [23.8, 2.6], [23.4, 4.6], [22.6, 5.6], [22.4, 4], [21.6, 2.8]]), "#0a0604", "", 0.05) + F.licht(...P(23.4, 2), 0.3, 0.2, 0.8);
  s += strich(K([[23.2, 5.6], [23, 6.6], [22.2, 6.8]]), "#000", 0.15, 0.6, 0.05) + strich(K([[22.2, 7], [19, 7.6], [16.8, 7.6]]), "#000", 0.18, 0.65, 0.05);
  s += tasthaare(T, K([[19, 7.8], [21.6, 7.4], [23.4, 6]]), 5, 1.2, W + 40, "#2a1a10", 0.03);
  /* Bart am Kinn: 7 spitz zulaufende Strähnen, nach unten und leicht nach vorn, Schatten auf der Kehle */
  s += imRumpf(rk, F.schatten(...P(15, 13), 3, 4, 0.5, 10));
  for (let i = 0; i < 7; i++) {
    const b0 = P(14.6 + i * 0.9, 9.6 + Math.abs(i - 3) * 0.08), L = 8.6 + ((i * 5) % 4) * 1.1, w = 92 - i * 2.5 + (T.rnd() - 0.5) * 6;
    const c = Math.cos(w * Math.PI / 180), si = Math.sin(w * Math.PI / 180), br = 0.55 + (i % 2) * 0.25;
    const tip = [b0[0] + c * L, b0[1] + si * L], m = [b0[0] + c * L * 0.5, b0[1] + si * L * 0.5];
    s += stueck(T, [[b0[0] - br, b0[1]], [b0[0] + br, b0[1]], [m[0] + br * 0.9, m[1]], tip, [m[0] - br * 0.9, m[1]]], i % 2 ? "#2a1a10" : "#1e140c",
      haare2(T, [[b0[0] - br, b0[1]], [b0[0] + br, b0[1]], tip], 8, w, L * 0.6, { farben: [["#8a6040", 1, 0.05, 0.6]], streuung: 6, szene: 0 }), { licht: 0, q: 0.05 });
  }
  /* Auge: bernsteingelb, rechteckige Pupille, kurze Wimpern; Augenhöhlenwölbung */
  const A = P(8.4, 1);
  s += auge2(T, F, A[0], A[1], 1.4, { winkel: 22, iris: "#d4a440", iris2: "#7a5414", hoehe: 0.66, pupBreite: 0.68, wimpern: 10, wl: 0.45, wr: 20, wf: "#1a120a", haut: "#ffd8a8", mulde: 0.35 });
  /* Hörner (Geiß): säbelförmig nach hinten, dichte Querwülste, Spitze glatt und spitz; fernes Horn versetzt, dunkler */
  const horn = (B, f, d) => {
    const pts = [[1.3, 0.4], [1.2, -5.6], [-0.8, -11.6], [-4.4, -16.4], [-9.4, -19.4, 1], [-7.6, -17], [-4.2, -12.6], [-2.2, -6.6], [-1.6, 0.6]].map((p) => [B[0] + p[0], B[1] + p[1]].concat(p[2] ? [1] : []));
    let ringe = "";
    if (T.fein) for (let i = 1; i < 11; i++) { const t = i / 12; const a2 = punktAuf([[1.3, 0.4], [1.2, -5.6], [-0.8, -11.6], [-4.4, -16.4], [-9.4, -19.4]], t), b2 = punktAuf([[-1.6, 0.6], [-2.2, -6.6], [-4.2, -12.6], [-7.6, -17], [-9.4, -19.4]], t);
      ringe += strich([[B[0] + b2[0], B[1] + b2[1] + 0.3], [B[0] + (a2[0] + b2[0]) / 2 + 0.2, B[1] + (a2[1] + b2[1]) / 2 + 0.5], [B[0] + a2[0], B[1] + a2[1] + 0.2]], "#000", 0.22 - t * 0.12, 0.45 - t * 0.25, 0.05); }
    return stueck(T, pts, T.lg("horn" + d, [[0, f], [0.7, "#7d7366"], [1, "#8a8074"]], 0, 1, 0.4, 0), ringe +
      F.kante(B[0] + 0.6, B[1] - 2, B[0] - 2.6, B[1] - 13, 0.5, 0.35), { licht: 0.5, dunkel: 0.6, hell: 0.4, q: 0.05 });
  };
  const HB0 = P(3.4, -2.6);
  s += horn([HB0[0] - 1.6, HB0[1] + 0.6], "#2a241e", "f") + horn(HB0, "#3a332c", "n");
  s += saum2(T, [[HB0[0] - 1.8, HB0[1] + 0.6], [HB0[0] + 1.4, HB0[1] + 0.4]], 10, -80, 0.8, "#8a5428", 0.05, 0.8, { ab: 0.6 });
  /* Stehohr: 40° über der Waagerechten nach vorn-seitwärts, Öffnung nach vorn-außen, innen hell mit feinen Haaren */
  const OX = P(3.4, 2.2), OW = -40;
  const ohr = dreh([[0, -1.6], [4, -3], [9, -3.2], [13.4, -1.4], [14.4, 0.2], [12, 1.8], [7.6, 2.6], [3, 2.2], [0, 1.6]], OX[0], OX[1], OW);
  const ohrI = dreh([[2.4, 0.2], [6, -1.2], [11, -1], [13.2, -0.2], [11, 1], [6.6, 1.6], [3, 1.2]], OX[0], OX[1], OW);
  s += imRumpf(rk, F.schatten(OX[0] - 1, OX[1] - 2, 4, 2.4, 0.45));
  s += stueck(T, ohr, T.lg("ohr", [[0, "#7a4a26"], [1, "#a86e3c"]]), form(ohrI, T.lg("ohri", [[0, "#c9a07e"], [1, "#d8b494"]], 0, 0, 1, 0), "", 0.05) +
    haare2(T, ohrI, 22, OW + 10, 1.6, { farben: [["#f4e4cc", 1, 0.04, 0.7]], streuung: 30, szene: 0.3 }) + F.schatten(...dreh([[3, 0.6]], OX[0], OX[1], OW)[0], 1.6, 1, 0.4),
    { licht: 0.5, dunkel: 0.6, hell: 0.4, hellFarbe: "#ffe2b8", q: 0.05 });
  const kb = T.box(kopf);
  return { svg: s, box: [10, -122, 112, 0], fuesse: [24, 30, 71, 76], kopf: [kb[0] - 8, kb[1] - 22, kb[2] + 4, kb[3] + 12] };
}

module.exports = [
  { id: "ziege", de: "die Ziege", syl: "ZIE-ge", it: "la capra", itSyl: "CA-pra", en: "goat",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 1.02, hoehe: 1.16, zeichne: ziege },
  { id: "schaf", de: "das Schaf", syl: "SCHAF", it: "la pecora", itSyl: "PE-co-ra", en: "sheep",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 1.3, hoehe: 0.99, zeichne: schaf },
  { id: "schwein", de: "das Schwein", syl: "SCHWEIN", it: "il maiale", itSyl: "ma-IA-le", en: "pig",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 1.79, hoehe: 0.89, zeichne: schwein },
  { id: "esel", de: "der Esel", syl: "E-sel", it: "l'asino", itSyl: "A-si-no", en: "donkey",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 1.71, hoehe: 1.61, zeichne: esel },
  { id: "kalb", de: "das Kalb", syl: "KALB", it: "il vitello", itSyl: "vi-TEL-lo", en: "calf",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 1.29, hoehe: 0.9, zeichne: kalb },
  { id: "kuh", de: "die Kuh", syl: "KUH", it: "la vacca", itSyl: "VAC-ca", en: "cow",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 2.4, hoehe: 1.54, zeichne: kuh },
  { id: "pferd", de: "das Pferd", syl: "PFERD", it: "il cavallo", itSyl: "ca-VAL-lo", en: "horse",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 2.68, hoehe: 2.17, zeichne: pferd },
];
