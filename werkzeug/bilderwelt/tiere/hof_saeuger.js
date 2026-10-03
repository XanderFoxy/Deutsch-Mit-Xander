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
    F.glanz(xm, yB - h * 0.02, rx * 0.8, h * 0.07, 0.3 * st);
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
    if (!FEIN && (op < 0.45 || rx * ry < 5)) return "";     // Szene: zarte und winzige Flecken unsichtbar
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
/* Volumen je Körperteil – nach dem Prinzip von kern.js T.volumen (Silhouette weichzeichnen, von links oben
   beleuchten), aber als weicher Innen-Schatten/-Glanz statt feDiffuseLighting: Letzteres zeigte bei großen Teilen
   Höhenlinien-Streifen (8-Bit-Alpha wird abgeleitet). Hier wird das geblurrte Alpha nur verschoben und
   ausgestanzt – keine Ableitung, keine Stufen. Kernschatten an der Unterseite/hinten, Licht oben/vorn-links.
   Die alten, gestuften Richtungskanten des äußeren Teils werden in voller Feinheit entfernt (der Filter ersetzt sie). */
function vol(T, name, weich, svg, o = {}) {
  if (!T.fein) return svg;
  const d = o.dunkel != null ? o.dunkel : 0.6, h = o.hell != null ? o.hell : 0.35, w = weich;
  const id = T.id("vo" + name + String(w).replace(".", "_"));
  if (!T["_" + id]) {
    T["_" + id] = 1;
    const k = (v) => kurz(Math.round(v * 100) / 100), lx = -0.45 * w, ly = -0.89 * w;
    T.def(`<filter id="${id}" x="-3%" y="-3%" width="106%" height="106%" color-interpolation-filters="sRGB">` +
      `<feGaussianBlur in="SourceAlpha" stdDeviation="${k(w * 0.8)}" result="b"/>` +
      `<feOffset in="b" dx="${k(lx * 0.9)}" dy="${k(ly * 0.9)}" result="o1"/><feComposite in="SourceAlpha" in2="o1" operator="out" result="s1"/>` +
      `<feFlood flood-color="${o.schatten || "#000"}" flood-opacity="${d}"/><feComposite in2="s1" operator="in" result="s"/>` +
      `<feOffset in="b" dx="${k(-lx * 0.5)}" dy="${k(-ly * 0.5)}" result="o2"/><feComposite in="SourceAlpha" in2="o2" operator="out" result="h1"/>` +
      `<feFlood flood-color="${o.licht || "#fff"}" flood-opacity="${h}"/><feComposite in2="h1" operator="in" result="h"/>` +
      `<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="s"/><feMergeNode in="h"/></feMerge></filter>`);
  }
  svg = svg.replace(/(?:<g fill="none" stroke="[^"]+">(?:<use [^>]*\/>)+<\/g>)+<\/g>$/, "</g>");
  return `<g filter="url(#${id})">${svg}</g>`;
}
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
function huf2(T, F, xh, xt, h, winkel, farbe, haarFarbe, tr = 0.42) {
  const tw = h / Math.tan(winkel * Math.PI / 180), xo = xt - tw, hh = h * tr;
  const p = [[xh - 0.6, -0.4, 1], [xt - 0.7, 0, 1], [xt - 0.1, -0.6], [xo, -h], [xo - (xo - xh) * 0.35, -h * 0.9], [xo - (xo - xh) * 0.7, -h * 0.66], [xh + 1.2, -hh], [xh - 0.4, -hh * 0.55]];
  let innen = "";
  if (T.fein) {
    let d = "";
    for (let i = 1; i < 9; i++) { const t = i / 9, x0 = xo - (xo - xh - 1) * t, y0 = -h + (h - hh) * t; d += `M${z(x0, 0.1)} ${z(y0, 0.1)}l${z(tw * (1 - t * 0.5), 0.1)} ${z(-y0, 0.1)}`; }
    innen += `<path d="${d}" stroke="#fff" stroke-opacity=".05" stroke-width=".15" fill="none"/>`;
  }
  innen += F.kante(xo - tw * 0.05, -h * 0.85, xt - tw * 0.5, -h * 0.25, 0.7, 0.4) + F.schatten(xh + 1, -hh * 0.4, 2.2, 2.2, 0.55);
  let s = stueck(T, p, T.lg("huf" + farbe.slice(1), [[0, farbe], [1, abdunkeln(farbe, 0.45)]], 0, 0, 1, 0.3), innen, { licht: 0.8, hell: 0.15, q: 0.1 });
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
/* =====================================================================
   RUNDE 3 – Beine aus Schablonen (Kritik R2: „Hinterbeine ohne Sprunggelenk, Säulen“).
   Schablonen in cm für ein Warmblut (WH 168), x relativ zur Röhrenmitte, y absolut. Hinterbein: Sitzbein, Hosen-
   muskel, Achillessehne (konkav), Fersenbeinhöcker als Spitze, Stufe unter dem Sprunggelenk, Röhre, Fesselkopf mit
   Sporn, Fessel; vorn: Krone, Fessel, Fesselkopf, Röhre, Sprunggelenk (Beugewinkel ~150°), Unterschenkel schräg nach
   vorn-oben zum Kniegelenk an der Bauchlinie. Vorderbein: Ellbogen, Unterarm (oben breit, konisch), Erbsenbein hinten am
   flachen Vorderfußwurzelgelenk, Röhre, Fesselkopf. Andere Arten: x-Maßstab und stückweise y-Abbildung (Gelenkhöhen).
   ===================================================================== */
const HB_TPL = { h: [[-11.5, -127], [-10.6, -116], [-9.4, -104], [-8, -93], [-5.8, -84], [-3.8, -77], [-4.2, -71], [-6.6, -65.4], [-8.6, -62.4],
  [-7.8, -59], [-5.6, -56], [-4.8, -49], [-4.8, -34], [-5.4, -28.4], [-6.8, -24], [-6.2, -19.8], [-3.8, -15.2], [-1.2, -11.2], [0.8, -8.2], [2, -5.6], [2.4, -3.4, 1]],
  v: [[9.2, -8.4, 1], [7.6, -11.6], [6.2, -15.6], [5.4, -19.6], [5.6, -23.2], [5, -27.4], [4.4, -32], [4.2, -46], [4.8, -53], [6.2, -58.4], [8.4, -63],
  [11.6, -69], [15.6, -76.4], [20, -85], [24.2, -93.4], [27.6, -100], [31, -105.6]] };
const VB_TPL = { h: [[-9, -97], [-8.2, -88], [-7.2, -78], [-6, -66], [-5.2, -58], [-6.4, -55], [-7, -52], [-6.4, -49.4], [-5, -46.6], [-4.8, -40], [-4.8, -30],
  [-5.6, -26.4], [-6.8, -22.2], [-6.2, -18.6], [-3.8, -14.4], [-1.2, -10.8], [0.8, -8], [2, -5.6], [2.4, -3.4, 1]],
  v: [[9.2, -8.4, 1], [7.6, -11.6], [6.2, -15.6], [5.4, -19.6], [5.6, -23.2], [5, -27.4], [4.4, -32], [4.2, -44], [4.8, -47.4], [5.6, -50.4], [5.8, -54.6],
  [5.2, -58], [5.8, -63], [7.8, -72], [10.2, -82], [11.6, -90], [12.4, -97]] };
/* Abbildung: x = cx + dx * xs; y stückweise linear nach ymap [[schablonenY, zielY], …] (absteigend sortiert: 0, -23, …) */
function bildeBein(tpl, cx, xs, ymap) {
  const Y = (y) => {
    for (let i = 0; i < ymap.length - 1; i++) {
      const [a0, b0] = ymap[i], [a1, b1] = ymap[i + 1];
      if (y <= a0 && y >= a1 || i === ymap.length - 2) return b0 + (y - a0) * (b1 - b0) / (a1 - a0);
    }
    return y;
  };
  /* xs: Zahl oder [[schablonenY, xs], …] absteigend – z. B. schlanker Unterschenkel bei Kalb und Ziege */
  const X = (y) => {
    if (typeof xs === "number") return xs;
    if (y >= xs[0][0]) return xs[0][1];
    for (let i = 0; i < xs.length - 1; i++) if (y <= xs[i][0] && y >= xs[i + 1][0]) return xs[i][1] + (y - xs[i][0]) * (xs[i + 1][1] - xs[i][1]) / (xs[i + 1][0] - xs[i][0]);
    return xs[xs.length - 1][1];
  };
  const m = (pts) => pts.map((p) => [cx + p[0] * X(p[1]), Y(p[1])].concat(p[2] ? [1] : []));
  return { h: m(tpl.h), v: m(tpl.v) };
}
/* Paarhuferklaue, Runde 3: zwei getrennte Klauen (Kritik: „einteiliger Pferdehuf“, „Pantoffel mit Ballen-Klotz“).
   Seitenansicht: Keil mit Dorsalwand ~48°, Zehe leicht gerundet, Kronsaum fällt flach nach hinten zum weichen Ballen,
   der Ballen ist Teil derselben Form (hellere, weiche Haut), getrennt nur durch eine weiche Furche. Die innere Klaue
   liegt etwas versetzt davor, dazwischen ein dunkles V vom Kronsaum bis zur Spitze. Hornrillen, Glanz auf der Wand. */
const abdunkeln = (f, k) => "#" + [1, 3, 5].map((i) => Math.round(parseInt(f.slice(i, i + 2), 16) * k).toString(16).padStart(2, "0")).join("");
function klaue3(T, F, xh, L, h, farbe, haar = "#e8e4dc", ballen = "#a89894") {
  const w = h / Math.tan(48 * Math.PI / 180), xt = xh + L, xo = xt - w;
  const kl = (dx, hh, f, id) => {
    const X = (u) => xh + dx + u * L;
    const pts = [[X(0.1), 0, 1], [X(0.02), -hh * 0.14], [X(0.01), -hh * 0.34], [X(0.08), -hh * 0.5], [X(0.24), -hh * 0.64], [X(0.42), -hh * 0.82],
      [xo + dx - L * 0.03, -hh], [xo + dx + L * 0.05, -hh * 0.93], [xt + dx - L * 0.05, -hh * 0.24], [xt + dx - L * 0.04, -hh * 0.08], [xt + dx - L * 0.11, 0, 1]];
    const dk = abdunkeln(f, 0.42);
    const g = T.lg("k3" + id + farbe.slice(1) + ballen.slice(1), [[0, ballen], [0.26, ballen], [0.4, f], [1, dk]], 0, 0, 1, 0.4);
    let innen = F.kante(xo + dx, -hh * 0.8, xt + dx - L * 0.14, -hh * 0.22, hh * 0.12, 0.55) + F.rinne(X(0.3), -hh * 0.66, X(0.36), -hh * 0.04, L * 0.035, 0.6) +
      F.licht(X(0.12), -hh * 0.36, L * 0.07, hh * 0.14, 0.4) + F.schatten(X(0.5), -hh * 0.12, L * 0.4, hh * 0.18, 0.5);
    if (T.fein) {
      let d = "";
      for (let i = 1; i < 5; i++) { const t = i / 5; d += `M${z(X(0.36) + (xo + dx - X(0.36)) * t, 0.1)} ${z(-hh * (0.74 + 0.24 * t), 0.1)}l${z(w * 0.6, 0.1)} ${z(hh * 0.72, 0.1)}`; }
      innen += `<path d="${d}" stroke="#000" stroke-opacity=".14" stroke-width="${z(h * 0.025, 0.01)}" fill="none"/>`;
    }
    return stueck(T, pts, g, innen, { licht: 0, q: 0.05 });
  };
  /* innere Klaue (davor, versetzt, dunkler), Spalt-Schatten, äußere Klaue */
  /* Runde 4: Spalt deutlich (Kritik: „einteilig“) – innere Klaue 18 % vor, dunkler Keil vom Kronsaum bis zwischen die
     beiden Zehenspitzen, unten ≈ 8 % der Klauenlänge breit; zwei getrennte, gerundete Zehenspitzen */
  let s = kl(L * 0.18, h * 0.93, abdunkeln(farbe, 0.72), "i");
  s += form([[xo + L * 0.02, -h * 0.99], [xo + L * 0.12, -h * 0.97], [xt + L * 0.12, -h * 0.2], [xt + L * 0.06, -h * 0.1], [xt - L * 0.02, -h * 0.12], [xt - L * 0.04, -h * 0.22]],
    "#050403", ` opacity=".92"`, 0.05);
  s += kl(0, h, farbe, "a");
  /* Kronsaum: Haare fallen über den Rand */
  s += saum2(T, [[xh + L * 0.04, -h * 0.5], [xh + L * 0.24, -h * 0.66], [xh + L * 0.42, -h * 0.84], [xo, -h * 1.02]], 12, 100, h * 0.26, haar, h * 0.015, 0.85, { ab: 0.7, streuung: 30 });
  return s;
}
/* Wurst: gefüllte, sich verjüngende Röhre entlang einer Mittellinie (Schwanz, Strähne) – EIN durchgehendes Gebilde.
   mitte = [[x, y], …], w0/w1 = Breite am Anfang/Ende (cm). Liefert die Umrisspunkte (links hin, rechts zurück). */
function wurst(mitte, w0, w1) {
  const n = mitte.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = mitte[Math.max(0, i - 1)], b = mitte[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * i / (n - 1)) / 2, nx = -dy / l * w, ny = dx / l * w;
    L.push([mitte[i][0] + nx, mitte[i][1] + ny]); R.push([mitte[i][0] - nx, mitte[i][1] - ny]);
  }
  return L.concat(R.reverse());
}
/* Tasthaare: einzelne Haare, jedes aus eigenem Punkt entlang einer Linie (Oberlippe, Kinn), leicht gebogen */
function tasthaare(T, pts, n, laenge, winkel, farbe, w = 0.06) {
  if (!T.fein) return "";
  return saum2(T, pts, n, winkel, laenge, farbe, w, 0.85, { ab: 0, streuung: 40 });
}
/* Muskel-/Knochenmasse: unsichtbare Form, nur ihre Richtungskanten (innen) – Kernschatten unten-rechts, Randlicht oben-links */
function masse(T, pts, w, dunkel, hell) {
  return "";   // Runde 2: „Gummikissen-Ringe“ (Kritik) – Muskeln jetzt über gezielte Licht-/Schattenflächen
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
/* Beine aus den Schablonen: Hinterbein Röhrenmitte x = 38, Vorderbein x = 175 */
/* Pferdelauf-Details: Beugesehne (Licht) und Rinne zum Röhrbein, Fesselkopf, flaches Knie mit Erbsenbein bzw.
   Sprunggelenk mit Fersenbeinhöcker und gespannter Achillessehne, Licht vorn auf dem Gelenk */
function laufP(T, F, cx, vorn) {
  let s = F.kante(cx - 3.6, -46, cx - 3.4, -28, 0.8, 0.45) + F.rinne(cx - 1.2, -46, cx - 1.2, -28, 0.6, 0.55) + F.licht(cx + 3, -40, 0.8, 6, 0.3) +
    F.licht(cx - 1, -23, 3.2, 2.4, 0.18) + F.schatten(cx + 4, -16, 2, 3, 0.3);
  if (vorn) s += F.licht(cx - 5.6, -52.6, 1.2, 1.8, 0.4) + F.kante(cx + 5, -55, cx + 5, -48, 0.7, 0.5) + F.schatten(cx - 3, -48, 3, 1.4, 0.4) +
    F.glanz(cx + 6, -80, 2.2, 10, 0.3);
  else s += F.kante(cx - 5, -82, cx - 7, -66, 0.9, 0.55) + F.rinne(cx - 2.4, -80, cx - 4.4, -66, 0.8, 0.4) + F.licht(cx - 7.6, -62.4, 1.2, 1.6, 0.5) +
    F.schatten(cx + 5, -58, 2.4, 3, 0.4) + F.kante(cx + 7, -66, cx + 14, -78, 0.8, 0.4);
  return s;
}
const P_HCX = 38, P_VCX = 175;
const P_H = bildeBein(HB_TPL, P_HCX, 1, [[0, 0], [-200, -200]]), P_V = bildeBein(VB_TPL, P_VCX, 1, [[0, 0], [-200, -200]]);
/* Hinterkontur: Sitzbeinhöcker, Halbsehnenmuskel-Wölbung, Kniekehle, gerade Achillessehne, Fersenbeinhöcker */
const P_HB = [[24.4, -128], [23.8, -121], [24.6, -114], [26.6, -106], [29.4, -98], [32, -90], [33.6, -82], [34.2, -76]].concat(P_H.h.slice(6)), P_HV = P_H.v, P_VB = P_V.h, P_VV = P_V.v;
/* PROPORTIONEN Pferd (Warmblut, Stockmaß 168) in Kopflängen (KL = 62 cm): Widerrist 2,7 KL, Kruppe 2,67 KL, Sitzbeinhöcker
   2,2 KL (135), Rumpflänge Bug–Sitzbein 2,8 KL (175), Brusttiefe 1,15 KL (Brustboden 95), Ellbogen 1,6 KL (100), Vorderfußwurzel
   0,8 KL (50), Fesselgelenk 0,37 KL (23), Kniegelenk 1,7 KL (106, vor dem Hüfthöcker-Lot), Fersenbeinhöcker 1 KL (62; Lot vom
   Sitzbeinhöcker), Unterschenkel 55–60° nach hinten-unten, Hinterbacke unten zur Kniekehle eingezogen; Hals: Kamm 1,5 KL,
   gewölbt, Halsunterlinie ≈ 68° vom Buggelenk (115) zur Kehle (190), Genick 3,45 KL (214), Kopfwinkel 55°. */
const P_KAMM = [[245, -215.4], [236, -213.6], [226, -209.6], [216, -204], [206, -197.6], [196, -190.6], [186, -183.4], [176, -177], [167, -172.5]];
function pferd(T) {
  FEIN = T.fein;
  const F = flecken(T, "#ffd2a0", "#1a0602");
  const U = ' gradientUnits="userSpaceOnUse"';
  const fell = T.lg("fell", [[0, "#a65f2c"], [0.4, "#8a4520"], [0.8, "#6a3015"], [1, "#4e220e"]], 0, -176, 0, -88, U);
  const fern = T.lg("fern", [[0, "#5a2a13"], [0.45, "#40200f"], [0.62, "#171210"], [1, "#100c0b"]], 0, -95, 0, -45, U);
  const schwarz = "#1b1513";
  const dunkelH = fellMuster(T, "d", 1.1, 110, [["#3a1406", 1, 0.06, 0.2]], 8, 6);
  const hellH = fellMuster(T, "h", 1.0, 60, [["#f6c08a", 1, 0.06, 0.18]], 8, 6);
  const beinH = fellMuster(T, "b", 1.2, 50, [["#5a4a40", 1, 0.06, 0.18]], 8, 5);
  let s = "";
  /* ---------- ferne Beine: Körperton −20 %, unten schwarz; oben im Schlagschatten des Rumpfs ---------- */
  const fernBein = (vorn, dx) => {
    const cx = (vorn ? P_VCX : P_HCX) + dx;
    const kante = vorn ? P_VB.concat(P_VV) : P_HB.slice(4).concat(P_HV);
    const pts = verschiebe(kante, dx).concat(vorn ? [[cx + 13, -112], [cx - 10, -112]] : [[cx + 31, -112], [cx - 6, -112]]);
    /* Kastanie (Hornwarze, Innenseite): vorn über dem Knie, hinten unter dem Sprunggelenk – rau, unregelmäßig, kleine Lichter */
    const kast = (x, y) => form([[x - 1.4, y - 2.6], [x + 0.6, y - 3], [x + 1.4, y - 0.6], [x + 1, y + 2.6], [x - 1, y + 2.2], [x - 1.6, y]], "#2e2620", "", 0.05) +
      fein(T, F.licht(x - 0.3, y - 1.4, 0.4, 0.3, 0.6) + F.licht(x + 0.4, y + 0.8, 0.3, 0.3, 0.5) + strich([[x - 1, y - 0.6], [x + 0.8, y - 0.8]], "#000", 0.15, 0.4, 0.05));
    const innen = (vorn ? F.schatten(cx - 2, -96, 14, 16, 0.8) : F.schatten(cx + 18, -100, 20, 18, 0.8)) +
      `<rect x="${cx - 12}" y="${vorn ? -80 : -74}" width="${vorn ? 26 : 44}" height="80" fill="${T.lg("abzF", [[0, "#100c0b", 0], [0.18, "#100c0b", 0.95], [1, "#100c0b", 1]])}"/>` +
      fellZone(T, beinH, pts, 90, 0.8) + (vorn ? kast(cx - 1.2, -64) : kast(cx - 1.6, -49));
    return stueck(T, pts, fern, innen, { licht: 1.2, dunkel: 0.7, hell: 0.35 });
  };
  const hufP = (cx, h, f, haar) => huf2(T, F, cx + 2.2, cx + 9.4 + h / Math.tan(53 * Math.PI / 180), h, 53, f, haar);
  s += vol(T, "bein", 3, fernBein(false, 10)) + hufP(P_HCX + 10, 9.6, "#2a2420", "#0c0908");
  s += vol(T, "bein", 3, fernBein(true, -12)) + hufP(P_VCX - 12, 10, "#2a2420", "#0c0908");
  /* ---------- Rumpf, Hals und nahe Beine: EIN Umriss ---------- */
  const rumpf = P_HB.concat(P_HV, [[75, -106], [79, -105.5], [84, -103], [96, -99], [112, -94], [130, -90], [146, -88.5], [156, -89.5], [161, -92]],
    P_VB, P_VV, [[192.6, -100.6], [198.6, -106.4], [204.4, -113.4], [208, -121], [210.8, -130], [213.6, -140], [217, -151], [220.6, -162], [224.2, -173],
      [227.6, -183], [230.8, -191], [234, -197.4], [238, -204], [242, -210.4]], P_KAMM,
    [[163, -173], [157, -171], [150, -167.6], [142, -164.4], [130, -161.6], [116, -160.6], [102, -161], [90, -162.4], [78, -164.2], [68, -165.2], [60, -165], [52, -163.5],
      [44, -160], [37, -155.5], [31, -150], [27.4, -143], [25.2, -135]]);
  const zHinten = [[0, -175], [76, -175], [88, -140], [80, -100], [62, -76], [50, -60], [20, -60]];
  const zRumpf = [[76, -175], [160, -175], [158, -130], [160, -86], [80, -92], [88, -140]];
  const zSchulter = [[160, -175], [170, -175], [205, -122], [195, -92], [188, -60], [160, -60], [160, -86], [158, -130]];
  const zHals = [[170, -175], [252, -232], [236, -190], [210, -118], [205, -122]];
  const zBeine = [[[P_HCX - 14, -56], [P_HCX + 24, -56], [P_HCX + 24, 0], [P_HCX - 14, 0]], [[P_VCX - 12, -60], [P_VCX + 18, -60], [P_VCX + 18, 0], [P_VCX - 12, 0]]];
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
    /* Hinterhand: Hüfthöcker als Lichtecke, Kruppe als flache Kuppel, Hungerrinne (Halbsehnenmuskel), Bizeps femoris als
       schräge Lichtfläche davor, Kniescheibe, Kniefalte zur Flanke */
    F.licht(69, -152, 5, 2, 0.45, -20) + F.schatten(73, -146, 5, 4, 0.4) + F.glanz(48, -156, 22, 6, 0.45, 8) +
    F.rinne(29, -140, 33, -96, 2.6, 0.45) + F.glanz(46, -122, 7, 20, 0.5, -14) + F.rinne(58, -134, 64, -104, 2.4, 0.3) +
    F.licht(68.6, -104, 2.4, 3.4, 0.4) + F.rinne(72, -106, 80, -126, 1.6, 0.4) + F.schatten(86, -134, 7, 12, 0.22) +
    /* Schulter: Schulterblattgräte (~48°) als Lichtkante, Mulde des Trizepsansatzes dahinter, Trizepswulst über dem Ellbogen,
       Buggelenk als Höcker vorn, Gurtrinne; 3 schwache Rippenbögen */
    F.kante(168, -164, 197, -126, 2.2, 0.5) + F.rinne(163, -156, 186, -118, 2.6, 0.3) + F.kante(164, -112, 178, -106, 2.4, 0.35) +
    F.rinne(162, -101, 182, -101, 1.8, 0.35) + F.licht(201, -122, 2.6, 5, 0.4, -25) + F.schatten(196, -106, 5, 6, 0.4) +
    F.schatten(157, -112, 6, 16, 0.35) + [120, 130, 140].map((x) => F.rinne(x, -132, x - 4, -106, 3, 0.09)).join("") +
    /* Hals: Kamm mit Glanzband, Drosselrinne mit Licht darüber, Kehle */
    F.glanz(204, -194, 32, 4, 0.4, -34) + F.rinne(224, -182, 210, -138, 1.8, 0.42) + F.kante(227.6, -183, 214, -141, 1.4, 0.35) + F.schatten(230, -193, 7, 6, 0.5) +
    /* Glanzbänder (glattes Sommerfell) auf den Wölbungen, gestreckt in Haarrichtung */
    F.licht(46, -157, 18, 2.2, 0.38, 10) + F.licht(120, -153, 26, 2, 0.3) + F.licht(176, -150, 2, 13, 0.28, -32) + F.licht(36, -122, 1.8, 14, 0.25, 4) +
    /* Flankenwirbel vor der Kniefalte */
    fein(T, wirbel(T, 84, -120, 3, 26, "#2a0e04", 0.1, 0.4, 1.3)) +
    /* Schwarze Abzeichen: Beine ab Knie / Sprunggelenk, Grenze unregelmäßig und weich */
    /* Schwarze Abzeichen: vorn bis Mitte Unterarm, hinten knapp über das Sprunggelenk; Grenze schräg, unregelmäßig, weich */
    weich(T, `<path d="M${P_VCX - 12} -66C${P_VCX - 6} -74 ${P_VCX} -72 ${P_VCX + 4} -78C${P_VCX + 8} -82 ${P_VCX + 12} -76 ${P_VCX + 16} -80L${P_VCX + 18} 2L${P_VCX - 12} 2Z" fill="${schwarz}"/>` +
      `<path d="M${P_HCX - 14} -64C${P_HCX - 8} -72 ${P_HCX - 2} -66 ${P_HCX + 4} -71C${P_HCX + 9} -75 ${P_HCX + 14} -69 ${P_HCX + 22} -74L${P_HCX + 24} 2L${P_HCX - 14} 2Z" fill="${schwarz}"/>`, 2) +
    zBeine.map((z0) => fellZone(T, beinH, z0, 90)).join("") +
    laufP(T, F, P_VCX, true) + laufP(T, F, P_HCX, false);
  s += vol(T, "rumpf", 11, stueck(T, rumpf, fell, innen, { licht: 2.2, hell: 0.3, hellFarbe: "#ffd2a8", q: T.fein ? 0.2 : 0.5 }), { hell: 0.14, licht: "#ffc890" });
  const rk = T._clip;
  /* Kötenhaar am Fesselkopf (Sporn) */
  s += saum2(T, [[P_VCX - 6.8, -23], [P_VCX - 6.2, -18.6]], 16, 112, 2.8, "#0c0908", 0.12, 0.8, { ab: 0.3 }) + saum2(T, [[P_HCX - 6.8, -24], [P_HCX - 6.2, -19.6]], 16, 112, 2.8, "#0c0908", 0.12, 0.8, { ab: 0.3 });
  s += hufP(P_HCX, 9.6, "#3a322c", "#0c0908") + hufP(P_VCX, 10, "#3a322c", "#0c0908");
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
  /* Rübe: Fortsetzung der Kruppenlinie, ~30° nach hinten-unten, oben Körperfell; Langhaar liegt an der Hinterbacke an */
  const ruebe = [[38, -157.6], [32, -156.4], [26.4, -152], [22.6, -145.4], [21.6, -139], [25.4, -138.4], [29.6, -143.6], [34.4, -149.4]];
  const schweif = [[28.6, -147.4], [23.6, -147.4], [18.6, -139], [14, -122], [11.4, -100], [11.6, -78], [12.4, -52], [17, -49.6], [22, -50.6], [26.6, -49.6],
    [28.6, -70], [30.6, -94], [30.4, -116], [29.6, -134]];
  s += stueck(T, schweif, T.lg("sw", [[0, "#2c2420"], [0.5, "#16110f"], [1, "#0a0807"]], 0, 0, 1, 0.2),
    [[13, -120, 12.5, -60], [18, -128, 18, -56], [23, -124, 23.5, -60]].map(([x1, y1, x2, y2], i) => F.kante(x1, y1, x2, y2, 1.4, 0.45 - i * 0.1)).join("") +
    haare2(T, schweif, 80, (x, y) => 90 + (x - 18) * 0.5 + (y < -125 ? 25 : 0), 22,
      { farben: [["#000", 1.5, 0.18, 0.6], ["#5a4a42", 1, 0.13, 0.5], ["#a89888", 0.3, 0.1, 0.4]], streuung: 5, kruemmung: 0.1, szene: 0.08 }),
    { licht: 1.2, dunkel: 0.9, hell: 0.5 });
  s += stueck(T, ruebe, T.lg("rb", [[0, "#9a5428", 0.6], [0.45, "#4a2814", 0.85], [1, "#16110f"]], 0, 0, 0.5, 1),
    haare2(T, ruebe, 26, 118, 3.2, { farben: [["#000", 1, 0.12, 0.55], ["#5a4a40", 0.7, 0.1, 0.45]], streuung: 14, szene: 0 }) +
    F.schatten(27, -142, 4, 3, 0.4), { licht: 0 });
  s += saum2(T, [[12, -51], [24, -50]], 26, 92, 3, "#0e0b0a", 0.14, 0.7, { ab: 0.4, streuung: 10 });
  /* ---------- Kopf: Achse Genick → Maul, 55° geneigt, Länge 62 cm ---------- */
  const G = [244, -213], W = 55, K = (pts) => dreh(pts, G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  const kopfL = [[-1, -3.2], [8, -5.6], [18, -6.4], [30, -5.4], [42, -4.2], [52, -2.6], [57.5, -1], [60.6, 1.8], [62, 5.4], [62.2, 9], [61, 12.2],
    [58.8, 13.3], [59.4, 14.6], [58, 16.4], [55, 17.2], [52, 17], [49.5, 18.4], [46, 18], [40, 16.8], [32, 17.4], [26, 19.6], [19, 23.2], [12, 24.6],
    [6, 23], [1.6, 18.6], [-1.2, 12], [-2.2, 5]];
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
  s += F.kante(...P(48, 0.6), ...P(56.4, 3.4), 0.8, 0.3) + strich(K([[48.6, 4.6], [52, 5.2], [53, 8]]), "#000", 0.6, 0.4, 0.05);
  /* Maulspalte, Unterlippe, Kinnwulst, Tasthaare */
  s += strich(K([[59, 13.3], [56, 13.5], [53, 13.9]]), "#000", 0.6, 0.7, 0.05) + strich(K([[58.8, 14.4], [57.6, 16.2], [55, 17]]), "#d8c0a8", 0.35, 0.3, 0.05);
  if (T.fein) {
    s += tasthaare(T, K([[54, 13.2], [58, 12.8], [61, 11.6], [62.2, 8]]), 9, 3.4, W + 45, "#1c1410") + tasthaare(T, K([[48, 18.2], [52, 17.4], [57, 16.6]]), 8, 3, W + 80, "#1c1410");
  }
  /* Auge: groß, seitlich, im Augenbogen */
  const A = P(18.5, 2.6);
  s += imRumpf(T._kopf, F.schatten(...P(11, -3.4), 5, 3, 0.45, W)) + auge2(T, F, A[0], A[1], 3.8, { winkel: 30, iris: "#26150c", iris2: "#0c0603", hoehe: 0.64, wimpern: 18, wl: 0.8, wr: 10, haut: "#e0a070", mulde: 0.5 });
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
  return { svg: s, box: [10, -235, 279, 0], fuesse: [P_HCX + 8, P_HCX + 18, P_VCX - 4, P_VCX + 8], kopf: [kb[0] - 4, kb[1] - 27, kb[2] + 2, kb[3] + 2] };
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
  if (op < 0.5) return "";   // schwache Flankenwirbel lasen sich als „Kringel“ (Kritik R2)
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
/* Kuh-Beine aus den Schablonen (WH 145): Fesselgelenk ~12 % WH, Sprunggelenk 30 % WH, Kniegelenk an der Bauchlinie */
const K_HCX = 36, K_VCX = 167;
const K_H = bildeBein(HB_TPL, K_HCX, 0.95, [[0, 0], [-23, -18], [-62, -44], [-105, -82], [-127, -126], [-140, -140]]);
const K_V = bildeBein(VB_TPL, K_VCX, 0.95, [[0, 0], [-23, -18], [-50, -38], [-97, -80], [-110, -92]]);
/* Hinterkontur vom Sitzbeinhöcker: fast senkrecht, mager eingezogen (milchtypisch) bis zum Sprunggelenk */
/* PROPORTIONEN Kuh (Holstein) in Kopflängen (KL = 52 cm): Widerrist 2,8 KL (146), Hüfthöcker 2,95 KL (154, ragt 4–5 cm
   über die Rückenlinie), Sitzbeinhöcker 2,7 KL (141), Rumpflänge Bug–Sitzbein 3,3 KL (171), Brusttiefe 1,45 KL (Brustboden 70),
   Ellbogen 1,5 KL (78), Vorderfußwurzel 0,73 KL (38), Fesselgelenk 0,35 KL (18), Kniegelenk 1,6 KL (83), Fersenhöcker 0,85 KL
   (44 = 30 % WH), Euterboden 1,0 KL (52, über dem Sprunggelenk), Hals 1,2 KL lang, vom Widerrist leicht zum Genick fallend,
   Genick 2,5 KL (131), Kopfwinkel 56°. Hinterkontur: unter dem Sitzbeinhöcker konkav nach vorn bis zur Achillessehne,
   Fersenhöcker 5 cm dahinter vorspringend. */
const K_HB = [[21, -138], [20.6, -134], [21.4, -127], [23.6, -117], [26.4, -105], [29, -93], [31, -82], [32.4, -72], [33, -63.4]].concat(K_H.h.slice(5)), K_HV = K_H.v, K_VB = K_V.h, K_VV = K_V.v;
function kuh(T) {
  FEIN = T.fein;
  const F = flecken(T, "#fff8ea", "#1a1820");
  const U = ' gradientUnits="userSpaceOnUse"';
  /* Weiß: Rücken hell, Kernschatten unter dem Bauch (≈ 70 % Rumpftiefe), Beine wieder hell (Kritik: „graue Beine“) */
  const weiss = T.lg("weiss", [[0, "#fbf9f5"], [0.3, "#efebe4"], [0.46, "#d9d3c9"], [0.52, "#cfc9be"], [0.6, "#e2ded6"], [0.78, "#ece9e3"], [1, "#dedad2"]], 0, -152, 0, 0, U);
  const fernW = T.lg("fernW", [[0, "#9a968f"], [0.5, "#b8b4ac"], [1, "#aaa69e"]], 0, -90, 0, 0, U);
  const schwarz = "#1c1b1e";
  const wH = fellMuster(T, "w", 1.4, 58, [["#8a8276", 1, 0.06, 0.2]], 10, 6);
  const sH = fellMuster(T, "s", 1.2, 64, [["#6a7280", 1, 0.05, 0.16]], 8, 6);
  let s = "";
  /* ---------- ferne Beine: kühler, 20 % dunkler, mit Zylinder-Licht ---------- */
  const fernBein = (vorn, dx) => {
    const cx = (vorn ? K_VCX : K_HCX) + dx;
    const pts = verschiebe(vorn ? K_VB.concat(K_VV) : K_H.h.slice(2).concat(K_HV), dx).concat(vorn ? [[cx + 13, -92], [cx - 9, -92]] : [[cx + 32, -96], [cx - 6, -96]]);
    return stueck(T, pts, fernW, fellZone(T, wH, pts, 90, 0.8) + F.schatten(cx + (vorn ? 0 : 14), -82, 13, 14, 0.7) +
      F.licht(cx - 2.6, -30, 1.4, 10, 0.4) + F.rinne(cx - 1.4, -36, cx - 1.4, -20, 0.6, 0.4), { licht: 1.2, dunkel: 0.45, hell: 0.4 });
  };
  /* Klauen: zwei Klauen je Fuß mit Spalt; Ballen schiefergrau; Afterklauen hinten am Fesselgelenk */
  const klK = (cx, f) => klaue3(T, F, cx + 0.6, 14.6, 7.4, f, "#ece8e0", "#6e6560") + afterklaue2(T, cx - 3.2, -12.8, 1.3, "#54504c", "#ece8e0");
  s += vol(T, "bein", 3, fernBein(false, 14), { dunkel: 0.3 }) + klK(K_HCX + 14, "#3e3a37");
  s += vol(T, "bein", 3, fernBein(true, -12), { dunkel: 0.3 }) + klK(K_VCX - 12, "#3e3a37");
  /* ---------- Rumpf mit Hals, Euter und nahen Beinen ---------- */
  /* Euterboden über dem Sprunggelenk; Vordereuter fließend in die Bauchwand; das nahe Hinterbein deckt das hintere Drittel */
  const euterUnten = [[54, -54.2], [60, -52.6], [67, -52], [74, -52.8], [80, -55], [84.6, -58.6], [88, -63.4], [91.4, -68], [95.6, -71]];
  const rumpf = K_HB.concat(K_HV.slice(0, 13), euterUnten,
    [[104, -71.2], [116, -69.6], [128, -69], [140, -70], [150, -72.6], [156, -76.4]], K_VB, K_VV,
    /* Triel 6–8 cm vor den Vorderbeinen, Buggelenk, Halsunterlinie zur Ganasche */
    [[181, -79.6], [184.4, -82.4], [187.8, -86.2], [190.6, -90.8], [192.8, -96], [195.4, -100.6], [198.8, -104.2], [203, -107.6], [207, -112], [210.6, -116.4],
      [214.6, -121], [219.6, -126], [224, -129.6], [227, -131.6],
      /* Hals fällt vom Widerrist leicht zum Genick; Widerrist leicht erhaben; gerader Rücken; Hüfthöcker als Buckel; Kruppe fällt zum Sitzbeinhöcker */
      [224, -133], [218, -134.4], [208, -137.6], [194, -142.6], [182, -147.4], [172, -150.6], [166, -151.6], [160, -150.6], [152, -148.6], [140, -147.6],
      [126, -147.2], [112, -147.4], [98, -147.6], [86, -147.6], [77, -148.6], [70, -151.4], [64, -154.2], [59.6, -154.4], [55, -152], [48, -149.4], [40, -147],
      [32, -145], [26.6, -143.4], [23.4, -141.2]]);
  const wuchs = richtung([[15, 95], [45, 100], [70, 160], [140, 165], [158, 100], [180, 100], [205, 125]]);
  /* Platten: Ränder wie Küstenlinien; der Haarsaum verzahnt Schwarz und Weiß in Wuchsrichtung */
  const p1 = zackig(T, [[146, -162], [240, -162], [240, -128], [226, -126], [214, -120], [206, -114], [199, -110], [192, -106], [186, -103], [181, -107], [175, -112],
    [166, -111], [157, -106], [149, -114], [143, -131], [144, -150]], 1.1, 3);
  const p2 = zackig(T, [[92, -160], [132, -160], [134, -138], [129, -122], [134, -106], [126, -93], [112, -89], [100, -95], [92, -108], [86, -128]], 1.1, 3);
  const p3 = zackig(T, [[0, -160], [68, -160], [72, -140], [64, -125], [69, -112], [58, -103], [50, -100], [44, -92], [33, -87], [22, -91], [10, -104], [0, -114]], 1.1, 3);
  const p4 = zackig(T, [[148.6, -97.4], [152.4, -100.6], [157, -99.2], [160.8, -101], [162, -96.4], [159.4, -92.6], [161, -88.4], [156, -87], [152.6, -89.6], [148.4, -88.4], [147.6, -92.6]], 0.9, 2);
  const p5 = zackig(T, [[75.6, -103.2], [79.4, -106.6], [83.2, -104], [87.2, -105.4], [86.4, -100.4], [88.4, -96.6], [84, -94.8], [80.6, -92.2], [77.8, -95.4], [74.2, -96.4], [76, -99.6]], 0.9, 2);
  const platten = [p1, p2, p3, p4, p5];
  const zHinten = [[0, -165], [74, -165], [86, -130], [70, -96], [56, -60], [20, -60]];
  const zRumpf = [[74, -165], [150, -165], [150, -110], [156, -66], [90, -66], [86, -130]];
  const zVorn = [[150, -165], [240, -160], [232, -110], [190, -74], [156, -70], [150, -110]];
  const zBeine = [[[20, -62], [70, -62], [70, 0], [20, 0]], [[154, -72], [182, -72], [182, 0], [154, 0]]];
  const euter = [[38, -100], [56, -95], [70, -88], [80, -80], [87, -72], [92, -68.6], [97, -71.6]].concat(euterUnten.slice().reverse(), [[48, -58], [42, -72]]);
  const hinterbein = K_H.h.slice(1).concat(K_HV, [[K_HCX + 33, -90], [K_HCX + 20, -104], [K_HCX - 10, -108]]);
  const innen =
    fellZone(T, wH, zHinten, 100) + fellZone(T, wH, zRumpf, 160) + fellZone(T, wH, zVorn, 112) + zBeine.map((q) => fellZone(T, wH, q, 90)).join("") +
    /* Euter: deckend, Haut gedeckt rosa unter feinem weißem Haar; Kernschatten unten, Licht am Vordereuter, Zentralfurche */
    form(euter, T.lg("euter", [[0, "#e8dcd2", 0], [0.42, "#e4d4ca", 0.5], [0.62, "#dcc2b8"], [1, "#bc9a90"]]), "", 0.5) +
    F.licht(82, -66, 8, 3.4, 0.45, -30) + F.schatten(68, -53.6, 16, 2.6, 0.55) + F.rinne(66, -76, 64, -55, 1.6, 0.25) + F.schatten(52, -62, 6, 9, 0.45) +
        F.schatten(64, -84, 26, 7, 0.4) +
    /* nahes Hinterbein vor dem Euter; Kontaktlinie und Schlagschatten auf das Euter */
    form(hinterbein, weiss, "", 0.2) + fellZone(T, wH, hinterbein, 95) + strich(K_HV.slice(11), "#5a5048", 1.2, 0.3) + F.rinne(K_HCX + 9, -52, K_HCX + 22, -76, 1.8, 0.4) +
    /* Platten mit Haarsaum und Fell */
    platten.map((p) => form(T.fein ? p : vieleck(p), schwarz, "", 0.3)).join("") +
    fein(T, platten.map((p) => fellZone(T, sH, p, p === p1 ? 112 : p === p2 ? 160 : 100, 1)).join("")) +
    fein(T, platten.map((p, i) => { const r = p.concat([p[0]]), n = i < 3 ? 26 : 9;
      return saum2(T, r, n, wuchs, 1.6, schwarz, 0.07, 0.75, { streuung: 30 }) + saum2(T, r, Math.round(n * 0.5), wuchs, 1.5, "#f2eee6", 0.07, 0.7, { streuung: 30 }); }).join("")) +
    /* Glanz auf Schwarz: breite Bänder in Haarrichtung */
    F.licht(40, -148, 20, 1.8, 0.35, 10) + F.licht(110, -150, 22, 1.8, 0.3, 2) + F.licht(186, -146, 20, 1.6, 0.3, 14) + F.licht(160, -130, 2, 12, 0.22, -30) +
    rumpfLicht(F, 20, 190, -150, -72, 0.8) +
    /* Hüfthöcker (Knochenbuckel, Glanz oben, Schatten dahinter), Sitzbeinhöcker, Hüftgelenk, Hungergrube, Kniefalte, Rippen */
    F.licht(62, -154, 4.4, 1.6, 0.55, -8) + F.schatten(66, -147, 6, 4, 0.5) + F.licht(22, -140, 1.4, 2.6, 0.45) + F.schatten(27, -133, 3, 6, 0.3) +
    F.schatten(43, -119, 7, 4, 0.3) + F.schatten(80, -134, 8, 12, 0.32, 15) + F.licht(83, -122, 4, 9, 0.18, 15) +
    F.rinne(65, -85, 76, -101, 1.6, 0.4) + F.licht(70, -96, 2, 7, 0.3, 30) + [104, 116, 128].map((x) => F.rinne(x, -112, x - 5, -92, 2.4, 0.1)).join("") +
    /* Vorhand: Schulterblattgräte, Buggelenk, Ellbogen, Drosselrinne, Wammenfalten */
    F.kante(168, -140, 184, -106, 1.6, 0.3) + F.rinne(160, -136, 172, -100, 2.2, 0.2) +
    F.licht(193, -97, 2.6, 4, 0.45) + F.schatten(160, -82, 6, 4, 0.45) + F.licht(157, -84, 2, 2.6, 0.3) +
    F.rinne(206, -116, 194, -102, 1.4, 0.3) + F.licht(203, -122, 3, 9, 0.18, 40) +
    [0, 1].map((i) => F.kante(197 + i * 3.4, -101 - i * 3.4, 199 + i * 3.4, -96 - i * 3.4, 0.9, 0.45) + F.rinne(198.4 + i * 3.4, -100 - i * 3.4, 200.4 + i * 3.4, -95.4 - i * 3.4, 0.9, 0.35)).join("") +
    /* Milchader: erhabener, geschlängelter Strang, endet im Milchbrunnen */
    [[96, -73.4], [103, -75], [110, -74], [117, -76], [124, -75.4]].map((p, i, a) => i ? F.kante(a[i - 1][0], a[i - 1][1] - 0.5, p[0], p[1] - 0.5, 0.7, 0.45) +
      F.rinne(a[i - 1][0], a[i - 1][1] + 0.7, p[0], p[1] + 0.7, 0.6, 0.3) : "").join("") +
    F.schatten(127, -75.4, 1.8, 1.2, 0.5) +
    /* Läufe als Zylinder: Licht links, Kernschatten rechts; Sehne; Fersenhöcker; Achillessehne; Vorderfußwurzel */
    [K_HCX, K_VCX].map((cx) => F.licht(cx - 2.6, -30, 1.8, 12, 0.7) + F.schatten(cx + 3.6, -30, 1.6, 12, 0.3) + F.rinne(cx - 1, -36, cx - 1, -20, 0.6, 0.3)).join("") +
    F.licht(K_HCX - 7.8, -45.6, 1.2, 1.6, 0.55) + F.kante(K_HCX - 5, -63, K_HCX - 7, -48, 0.8, 0.55) + F.rinne(K_HCX - 2.6, -62, K_HCX - 4.4, -48, 0.7, 0.35) +
    F.licht(K_VCX - 5.6, -40.6, 1.2, 1.6, 0.5) + F.licht(K_VCX - 3, -60, 2.4, 10, 0.45) + F.schatten(K_VCX, -78, 9, 5, 0.35);
  s += vol(T, "rumpf", 5, stueck(T, rumpf, weiss, innen, { licht: 1.6, dunkel: 0.3, hell: 0.5, q: T.fein ? 0.2 : 0.5 }), { dunkel: 0.4, hell: 0.25 });
  const rk = T._clip;
  s += klK(K_HCX, "#4e4b47") + klK(K_VCX, "#4e4b47");
  /* Zitzen: ferne zuerst (kleiner, dunkler), dann nahe; leicht konisch, verschieden lang, Spitze dunkler, Glanzkante */
  const zitze = (x, y, f, k, l) => !T.fein ? form([[x - 1.2, y - 1], [x + 1.2, y - 1], [x + 0.8, y + l], [x - 0.8, y + l]], f, "", 0.5) : stueck(T, [[x - 1.3, y - 1], [x + 1.3, y - 1], [x + 1.1, y + l * 0.7], [x + 0.7, y + l], [x - 0.7, y + l], [x - 1.1, y + l * 0.7]], f,
    F.kante(x - 0.7, y, x - 0.6, y + l * 0.8, 0.35, 0.5 * k) + F.schatten(x, y + l * 0.92, 1.2, 0.8, 0.4), { licht: 0.4, dunkel: 0.6, hell: 0, q: 0.05 });
  s += zitze(59.4, -53.4, "#a8847c", 0.5, 4.8) + zitze(79.6, -54.6, "#a8847c", 0.5, 4.6) + zitze(55.8, -53.4, "#caa69c", 1, 5.6) + zitze(76, -53, "#caa69c", 1, 6);
  /* ---------- Schwanz: Ansatz zwischen den Sitzbeinhöckern, verjüngt, liegt an der Hinterbacke; Quaste bis zum Sprunggelenk ---------- */
  const schwanz = [[26.6, -141.4], [23.6, -140.8], [21.4, -138.4], [20, -133], [19.4, -122], [19.4, -106], [19.8, -90], [20.2, -77], [22.8, -77], [22.8, -90],
    [22.6, -106], [22.8, -122], [23.6, -131], [25, -135.4], [27, -137.6]];
  s += stueck(T, schwanz, T.lg("schw", [[0, schwarz], [0.48, "#26252a"], [0.56, "#e8e4dc"], [1, "#d4cfc6"]], 0, -144, 0, -77, U),
    F.kante(20.4, -130, 20.2, -82, 0.6, 0.35) +
    F.schatten(22.6, -110, 0.8, 26, 0.3), { licht: 0.7, dunkel: 0.5, hell: 0.3 });
  /* Quaste: kein Löffel – dichter Kern ohne Kante, darüber lange, gewellte Strähnen, unten ausgefranst, 15 % grau */
  const quaste = [[19.4, -80], [22.8, -80], [24.2, -70], [24.6, -60], [23.6, -52], [21.2, -48], [18.8, -52], [17.8, -60], [18.2, -70]];
  const qAchse = [[20.4, -84], [21, -70], [21.2, -56], [21.2, -50]];
  s += form(quaste, T.lg("qu", [[0, "#f2efe8"], [1, "#cdc7bd"]], 0, 0, 1, 0), "", 0.2) +
    saum2(T, qAchse, 28, (x, y) => 90 + (y + 66) * 0.4, 12, "#b0a89c", 0.1, 0.7, { ab: 0, streuung: 16, szene: 0.25 }) +
    saum2(T, qAchse, 66, (x, y) => 90 + (y + 66) * 0.4, 12.5, "#f6f3ec", 0.1, 0.85, { ab: 0, streuung: 14, szene: 0.25 }) +
    F.schatten(23.4, -58, 1.6, 10, 0.3);
  /* ---------- Kopf: Achse Genick → Flotzmaul, 56° geneigt, 53 cm ---------- */
  const G = [227, -131], W = 56, K = (pts) => dreh(pts, G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  /* Umriss: Genick, flache Stirn mit Augenbogen, gerader Nasenrücken, breites Flotzmaul, überhängende Oberlippe,
     Kinn, Unterkieferrand, runde Ganasche (Unterkieferwinkel), Hinterrand des Unterkiefers */
  const kopf = K([[-1.6, -2.4], [3, -5.6], [8, -6.8], [14, -7.8], [20, -7.4], [28, -6.8], [36, -6.4], [42, -6], [46.4, -5.4], [49.6, -3.8], [51.8, -1.2],
    [53.2, 3], [53.6, 7.4], [53, 11], [51.6, 13.2], [50.2, 14.2], [49.8, 15.8], [48, 17.4], [45, 18.2], [40, 18.4], [34, 18.8], [27, 19.8], [20, 21.8],
    [14, 24.6], [10.4, 26.6], [7.4, 27.2], [4.4, 26], [2.4, 23], [0.6, 18], [-1.6, 11], [-2.6, 4]]);
  /* Kehlgang/Ganasche: Schatten hinter dem Unterkieferwinkel auf den Hals */
  s += imRumpf(rk, F.schatten(...P(3, 25), 6, 5, 0.55, W) + F.schatten(...P(-4, 6), 4, 10, 0.4, W));
  const blesse = K([[1, -8.4], [10, -8.6], [22, -8], [34, -7], [44, -6.4], [49.6, -4.4], [50.8, -1.4], [48, -1.2], [44, -2.8], [36, -3.6], [26, -4.4],
    [18, -5.2], [12, -5.8], [6, -5.6]]);
  const flotz = K([[45, -5.8], [49.6, -4], [51.8, -1.4], [53.4, 3], [53.8, 7.4], [53.2, 11], [51.8, 13.2], [48.6, 12.8], [46.2, 8], [44.8, 2]]);
  const kInnen =
    fellZone(T, sH, kopf, W - 180, 0.9) + form(blesse, "#f3efe8", "", 0.1) + fellZone(T, wH, blesse, W - 180, 0.9) +
    saum2(T, blesse.concat([blesse[0]]), 22, W - 180, 1.2, schwarz, 0.06, 0.7, { streuung: 30 }) +
    wirbel(T, ...P(9, -5.4), 2, 20, "#9a958c", 0.07, 0.6, 1.1) +
    /* Stirn breit-flach im Licht; Augenbogen; Kaumuskel (Licht oben, Kernschatten am Unterkieferrand); Ganasche; Gesichtsleiste */
    F.licht(...P(20, -4.6), 14, 2.4, 0.25, W) + F.licht(...P(12, 13), 8.6, 6, 0.2, W) + F.schatten(...P(15, 23), 10, 2.6, 0.55, W) +
    F.licht(...P(7, 23.6), 3.4, 2, 0.3, W + 50) + F.schatten(...P(3.4, 18), 2.4, 7, 0.45, W) +
    F.kante(...P(20, 5.4), ...P(33, 5), 0.8, 0.3) + F.rinne(...P(21, 7.4), ...P(33, 7), 1.1, 0.42) + F.schatten(...P(23, 1.6), 5, 2.2, 0.3, W) +
    F.schatten(...P(40, 14.2), 9, 2.2, 0.4, W) + F.licht(...P(40, 4), 6, 2, 0.15, W) +
    /* Flotzmaul: haarlos, feucht, Rillenmuster, graue Pigmentflecken, Glanzband oben */
    form(flotz, T.lg("flotz", [[0, "#d4aaa2"], [0.6, "#c4968e"], [1, "#a87a72"]], 0, 0, 0.4, 1), "", 0.05) +
    fein(T, `<g opacity=".3">${haare2(T, flotz, 22, 0, 0.4, { farben: [["#6a3a38", 1, 0.06, 0.8]], streuung: 180, kruemmung: 0.4 })}</g>`) +
    `<ellipse cx="${z(P(48.6, 9)[0], 0.1)}" cy="${z(P(48.6, 9)[1], 0.1)}" rx="1.6" ry="1.1" fill="#6a6268" opacity=".45"/>` +
    F.licht(...P(49.4, -1.2), 2.6, 1, 0.75, W - 30) + F.licht(...P(52, 6), 0.6, 1.8, 0.6, W) +
    fein(T, [[47.4, 2.4], [49.6, 3.8], [51.2, 9], [47.8, 10.4], [46, 5.6], [50.8, 11.4]].map(([x, y]) => F.licht(...P(x, y), 0.25, 0.2, 0.9)).join(""));
  s += vol(T, "kopf", 3.5, stueck(T, kopf, schwarz, kInnen, { licht: 1.2, dunkel: 0.7, hell: 0.5, hellFarbe: "#c8ccd8", q: 0.1 }), { tiefe: 4, umgebung: 0.4 });
  /* Nasenloch: C-Form, Nasenflügel als Wulst, tiefer Schatten innen */
  s += form(K([[47.8, 0.4], [51, -0.4], [53, 2], [52.8, 6.6], [51.2, 8], [51, 5.2], [49.4, 2.8]]), T.rg("nl", [[0, "#1a0c0c"], [0.7, "#3a1a1a"], [1, "#7a4a48"]], 0.6, 0.4, 0.6), "", 0.05);
  s += F.kante(...P(47.4, -0.4), ...P(53, 2.4), 0.5, 0.5) + F.licht(...P(49.6, 4.4), 1, 1.6, 0.25, W);
  /* Maulspalte (18–22 % der Kopflänge), Unterlippe, Kinn, Tasthaare */
  s += strich(K([[51.4, 14.2], [47, 15.2], [41.4, 15]]), "#060404", 0.4, 0.5, 0.05) + F.licht(...P(46, 17), 3, 0.8, 0.22, W);
  s += tasthaare(T, K([[42, 18.6], [46, 18.4], [49.6, 16.8]]), 8, 2.4, W + 70, "#e8e2d8", 0.05) + tasthaare(T, K([[46.4, 13.8], [50.4, 13.8], [53.2, 11.2]]), 6, 2.2, W + 20, "#e8e2d8", 0.05);
  /* Auge: seitlich vorstehend, unter dem Augenbogen, ≈ 1/3 der Kopflänge hinter dem Genick */
  const A = P(16, -0.6);
  s += auge2(T, F, A[0], A[1], 2.8, { winkel: 20, iris: "#3a2214", iris2: "#120804", hoehe: 0.68, wimpern: 13, wl: 0.85, wr: 14, wf: "#0c0c0e", haut: "#c8ccd8", mulde: 0.35, licht: 0.9 });
  /* Genick: gerundeter Kamm mit kurzem Haarschopf (hornlos) */
  s += saum2(T, K([[-1.4, -2.6], [3, -5.4], [8, -6.6]]), 18, W - 150, 2.2, "#2a2a30", 0.08, 0.8, { ab: 0.4, streuung: 50 });
  /* Ohr: am Genick, seitlich-waagerecht nach hinten-oben, Löffelform mit dickem Ansatz; Innenmuschel mit weißen Haarbüscheln */
  const OX = P(2.4, 1.2), OW = 198;
  const ohrA = dreh([[-1, 3.6], [4, 5], [10, 5.6], [16, 5], [20.6, 3], [22.4, 0.4], [21, -2.8], [16, -4.6], [9, -5], [3, -4.2], [-1, -3.2]], OX[0], OX[1], OW);
  const ohrI = dreh([[2.6, 1.4], [8, 2.2], [14, 2], [19.4, 0.8], [19.6, -1.2], [15, -3], [8, -3.4], [3, -2.4]], OX[0], OX[1], OW);
  s += imRumpf(rk, F.schatten(OX[0] - 10, OX[1] + 4.6, 11, 3, 0.45, 18));
  s += stueck(T, ohrA, schwarz, form(ohrI, T.lg("ohri", [[0, "#2a2628"], [1, "#6e6668"]], 1, 0, 0, 0), "", 0.05) +
    F.schatten(...dreh([[10, -0.6]], OX[0], OX[1], OW)[0], 8, 1.6, 0.5, OW) +
    haare2(T, ohrI, 22, OW + 196, 3.8, { farben: [["#f4f0e8", 1, 0.06, 0.85]], streuung: 14, kruemmung: 0.2, szene: 0.3 }) +
    F.licht(...dreh([[11, 4.6]], OX[0], OX[1], OW)[0], 8, 1, 0.5, OW) + F.licht(...dreh([[2, 0]], OX[0], OX[1], OW)[0], 2.4, 3.6, 0.25, OW),
    { licht: 0.5, dunkel: 0.4, hell: 0.4, hellFarbe: "#c8ccd8", q: 0.05 });
  s += saum2(T, dreh([[3, -3.4], [10, -4.6], [17, -3.8], [21.6, -1.4]], OX[0], OX[1], OW), 18, OW + 200, 3.2, "#f4f0e8", 0.06, 0.8, { ab: 0.2, streuung: 18 });
  /* Ohrmarke (gelb, Pflicht), etwas kleiner */
  const m = dreh([[6, 0.6], [6, -2.8]], OX[0], OX[1], OW);
  s += strich([m[0], m[1]], "#d8a800", 0.5, 0.95, 0.05);
  const mk = [m[1][0], m[1][1] - 0.2];
  s += F.schatten(mk[0] + 0.7, mk[1] + 3, 2.6, 3, 0.35);
  s += stueck(T, [[mk[0] - 1.6, mk[1]], [mk[0] + 1.6, mk[1]], [mk[0] + 1.8, mk[1] + 3.6], [mk[0] - 1.3, mk[1] + 3.8]].map((p) => p.concat([1])),
    T.lg("marke", [[0, "#ffdc50"], [1, "#e2a800"]]), fein(T, `<text x="${z(mk[0] - 1.1, 0.1)}" y="${z(mk[1] + 1.9, 0.1)}" font-size="1.15" font-family="Arial" font-weight="700" fill="#2a2000">DE</text><text x="${z(mk[0] - 1.2, 0.1)}" y="${z(mk[1] + 3.2, 0.1)}" font-size=".85" font-family="Arial" fill="#2a2000">0571</text>`),
    { licht: 0.4, dunkel: 0.5, hell: 0.5, q: 0.05 });
  const kb = T.box(kopf);
  return { svg: s, box: [14, -156, 260, 0], fuesse: [K_HCX + 7, K_HCX + 21, K_VCX - 5, K_VCX + 7], kopf: [kb[0] - 24, kb[1] - 10, kb[2] + 2, kb[3] + 2] };
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
/* Kalb-Beine aus den Schablonen (WH 85): Fesselgelenk 13 % WH, Fersenhöcker 36 % WH, Kniegelenk an der Bauchlinie,
   Vorderfußwurzel 29 % WH, Ellbogen 60 % WH („Stelzen“); Gelenke relativ dick */
const KA_HCX = 24, KA_VCX = 92;
const KA_H = bildeBein(HB_TPL, KA_HCX, [[-62, 0.58], [-105, 0.47], [-130, 0.5]], [[0, 0], [-23, -11], [-62, -30.5], [-105, -52], [-127, -72], [-140, -80]]);
const KA_V = bildeBein(VB_TPL, KA_VCX, 0.58, [[0, 0], [-23, -11], [-50, -25], [-97, -51], [-110, -58]]);
function kalb(T) {
  FEIN = T.fein;
  const F = flecken(T, "#fff8ea", "#1a1820");
  const U = ' gradientUnits="userSpaceOnUse"';
  const weiss = T.lg("weiss", [[0, "#fbf9f4"], [0.25, "#f0ece4"], [0.4, "#d8d2c8"], [0.47, "#d0cabf"], [0.58, "#e6e2da"], [0.8, "#eeebe5"], [1, "#e0dcd4"]], 0, -88, 0, 0, U);
  const fernW = T.lg("fernW", [[0, "#9a968f"], [0.5, "#b8b4ac"], [1, "#aaa69e"]], 0, -55, 0, 0, U);
  const schwarz = "#221e1d";
  const wH = fellMuster(T, "w", 1.2, 60, [["#8a8276", 1, 0.05, 0.2]], 18, 5);
  const sH = fellMuster(T, "s", 1.2, 60, [["#6a625e", 1, 0.05, 0.2]], 18, 5);
  let s = "";
  /* ferne Beine: kühler, dunkler, mit Zylinderlicht */
  const fernBein = (vorn, dx) => {
    const cx = (vorn ? KA_VCX : KA_HCX) + dx;
    const pts = verschiebe(vorn ? KA_V.h.concat(KA_V.v) : KA_H.h.slice(1).concat(KA_H.v), dx).concat(vorn ? [[cx + 8, -58], [cx - 6, -58]] : [[cx + 19, -60], [cx - 6, -64]]);
    return stueck(T, pts, fernW, fellZone(T, wH, pts, 90, 0.8) + F.schatten(cx + (vorn ? 0 : 8), -50, 8, 8, 0.6) + F.licht(cx - 1.4, -18, 0.9, 6, 0.4),
      { licht: 0.9, dunkel: 0.45, hell: 0.3 });
  };
  const klK = (cx, f) => klaue3(T, F, cx + 0.6, 7.6, 4.4, f, "#ece8e0", "#8a7e78") + afterklaue2(T, cx - 2.6, -7.6, 0.9, "#5a5450", "#ece8e0");
  s += vol(T, "bein", 1.8, fernBein(false, 8)) + klK(KA_HCX + 8, "#3e3a37");
  s += vol(T, "bein", 1.8, fernBein(true, -7)) + klK(KA_VCX - 7, "#3e3a37");
  /* Rumpf: Länge ≈ 1,0 × WH, Kruppe etwas höher als der Widerrist, aufgezogene Flanke; Hals mit Knick 28° nach vorn-oben, dünn */
  /* PROPORTIONEN Kalb (Holstein, 4–6 Wochen) in Kopflängen (KL = 29 cm): Widerrist 2,9 KL (85), Kruppe 3 KL (87),
     Rumpflänge Bug–Sitzbein 3 KL (88), Brusttiefe 1,15 KL (Brustboden 51 = 60 % WH), Ellbogen 1,75 KL, Vorderfußwurzel 0,9 KL (26),
     Fesselgelenk 0,38 KL (11), Kniegelenk 1,7 KL (50, Bauchlinie), Fersenhöcker 1,07 KL (31 = 36 % WH), Hals 28° steigend,
     Genick 3,4 KL (99), Kopfwinkel 50°, Gesicht (Auge–Maul) 0,55 KL, Stirn gewölbt.
     Hinterkontur: unter dem Sitzbeinhöcker zur Kniekehle eingezogen, gerade Achillessehne, Fersenhöcker 2,5 cm vorspringend. */
  const hinten = [[13.4, -79], [12.8, -76], [13.4, -71], [15, -64], [17.4, -57], [19.6, -49], [21.2, -42.6], [22.2, -37.6]].concat(KA_H.h.slice(7));
  const rumpf = hinten.concat(KA_H.v, [[44.4, -54], [48, -55], [54, -54.2], [62, -52.8], [72, -51.6], [80, -51], [84.6, -51.2]], KA_V.h, KA_V.v,
    [[100.4, -53.4], [101.2, -56.6], [101, -60], [100.8, -63.6], [101.2, -68], [101.8, -72.6], [102.6, -77], [103.8, -80.6], [105.6, -84], [108, -88], [110.4, -92.6],
      [112, -96.6], [110.6, -99.4], [106, -97.2], [100, -93.8], [94, -90.4], [88.6, -87.4], [84, -85.8], [79, -85.2], [70, -84.8], [60, -85], [50, -85.6], [40, -86.4],
      [33, -87.2], [29, -87.6], [25, -87], [20.4, -85.6], [16.6, -83.6]]);
  const wuchs = richtung([[10, 95], [30, 105], [44, 160], [84, 165], [92, 100], [104, 120]]);
  const pA = zackig(T, [[0, -100], [58, -100], [61, -90], [55, -82], [59, -74], [52, -68], [45, -66], [37, -61], [29, -63], [21, -67], [12, -71], [0, -73]], 0.8, 3);
  const pB = zackig(T, [[70, -100], [130, -100], [130, -98], [113, -95], [107, -89], [104, -83], [101, -76], [97, -71], [91, -73], [86, -69], [80, -72], [74, -80], [69, -90]], 0.8, 3);
  const insel = zackig(T, [[38, -82], [46, -83.6], [50, -78], [45, -74], [39, -76]], 0.6, 2);
  const platten = [pA, pB];
  const zHinten = [[0, -95], [42, -95], [50, -70], [44, -50], [12, -40]];
  const zRumpf = [[42, -95], [88, -95], [88, -48], [44, -48], [50, -70]];
  const zVorn = [[88, -95], [125, -105], [106, -60], [88, -48]];
  const innen =
    fellZone(T, wH, zHinten, 100) + fellZone(T, wH, zRumpf, 160) + fellZone(T, wH, zVorn, 120) + fellZone(T, wH, [[10, -50], [100, -50], [100, 0], [10, 0]], 90) +
    platten.map((p) => form(T.fein ? p : vieleck(p), schwarz, "", 0.2)).join("") + form(T.fein ? insel : vieleck(insel), "#f2eee6", "", 0.2) +
    fein(T, fellZone(T, sH, pA, 140) + fellZone(T, sH, pB, 125)) +
    fein(T, platten.map((p) => saum2(T, p.concat([p[0]]), 50, wuchs, 1.3, schwarz, 0.06, 0.75, { streuung: 34 }) + saum2(T, p.concat([p[0]]), 26, wuchs, 1.2, "#f2eee6", 0.06, 0.7, { streuung: 34 })).join("") +
      saum2(T, insel.concat([insel[0]]), 20, wuchs, 1.1, schwarz, 0.06, 0.7, { streuung: 34 })) +
    /* flaumiges Kalbsfell: längere, weich gewellte Haare in Wuchsrichtung */
    haare2(T, rumpf, 110, wuchs, 1.6, { farben: [["#9a9288", 1, 0.06, 0.3]], streuung: 22, kruemmung: 0.35, szene: 0 }) +
    rumpfLicht(F, 12, 100, -88, -51, 0.75) +
    /* Knochenpunkte des mageren Kalbs: Hüfthöcker, Sitzbeinhöcker, Hungergrube, Kniefalte, Schulterblatt, Rippen, Ellbogen */
    F.licht(29, -88, 3, 1.1, 0.5, -10) + F.schatten(32, -84, 3.4, 2.6, 0.4) + F.licht(13.6, -79, 0.9, 1.8, 0.4) + F.schatten(16, -74, 1.8, 3, 0.3) +
    F.schatten(42, -78, 4, 6, 0.3) + F.rinne(41, -53, 47, -66, 1, 0.4) + F.licht(44, -62, 1.2, 4, 0.3, 30) +
    F.kante(84, -82, 94, -62, 1, 0.3) + F.rinne(80, -80, 88, -58, 1.4, 0.22) + [56, 63, 70, 77].map((x) => F.rinne(x, -74, x - 3, -56, 1.2, 0.1)).join("") +
    F.licht(100, -59, 1.6, 2.4, 0.45) + F.schatten(88, -50, 4, 3, 0.45) + F.licht(86.6, -52, 1.2, 1.6, 0.35) +
    F.rinne(104, -80, 100, -64, 1, 0.3) + F.licht(105, -86, 2, 5, 0.25, 30) +
    /* knubbelige Gelenke, Zylinderlicht, Achillessehne */
    [KA_HCX, KA_VCX].map((cx) => F.licht(cx - 1.4, -18, 1, 6, 0.6) + F.schatten(cx + 2, -18, 0.9, 6, 0.3) + F.rinne(cx - 0.6, -21, cx - 0.6, -12, 0.4, 0.3)).join("") +
    strich(KA_H.v.slice(9), "#5a5048", 0.6, 0.3) + F.schatten(KA_HCX + 12, -44, 2, 7, 0.3, 30) +
    F.licht(KA_HCX - 4.6, -31, 0.8, 1.1, 0.55) + F.kante(KA_HCX - 2.8, -42, KA_HCX - 4, -33, 0.5, 0.55) + F.rinne(KA_HCX - 1.4, -42, KA_HCX - 2.4, -33, 0.5, 0.35) +
    F.licht(KA_VCX - 3.6, -25.4, 0.8, 1.2, 0.5) + F.licht(KA_VCX + 2.6, -26, 1, 1.6, 0.35) + F.licht(KA_VCX - 1.6, -38, 1.4, 6, 0.45) +
    F.licht(KA_HCX + 0.4, -10, 0.8, 1.2, 0.35) + F.licht(KA_VCX + 0.4, -10, 0.8, 1.2, 0.35) + F.schatten(KA_VCX, -50, 6, 4, 0.4) + F.schatten(30, -55, 6, 4, 0.35);
  s += vol(T, "rumpf", 3.5, stueck(T, rumpf, weiss, innen, { licht: 1.2, dunkel: 0.35, hell: 0.5, q: T.fein ? 0.1 : 0.5 }), { dunkel: 0.4, hell: 0.25 });
  const rk = T._clip;
  /* Flaum: dichte, leicht gewellte Haarfransen über die Silhouette (Rücken, Bauch, Beinrückseiten) */
  s += saum2(T, [[16.6, -83.6], [25, -87], [33, -87.2], [50, -85.6], [70, -84.8], [84, -85.8], [94, -90.4], [106, -97.2]], 90, (x) => (x < 44 ? 160 : x < 86 ? 178 : 205), 1.5, schwarz, 0.06, 0.75, { ab: 0.8, streuung: 16 });
  s += saum2(T, [[44.4, -54], [54, -54.2], [72, -51.6], [84.6, -51.2]], 30, 112, 1.8, "#e8e4dc", 0.05, 0.75, { ab: 0.4, streuung: 30 });
  s += saum2(T, [[101, -60], [101.2, -68], [102.6, -77], [105.6, -84]], 16, 60, 1.4, "#ece8e0", 0.05, 0.7, { ab: 0.4, streuung: 30 });
  s += saum2(T, hinten.slice(1, 7), 20, 125, 1.4, "#ece8e0", 0.06, 0.7, { ab: 0.3 });
  s += klK(KA_HCX, "#4e4b47") + klK(KA_VCX, "#4e4b47");
  /* Schwanz: Ansatz zwischen den Sitzbeinhöckern, liegt an der Hinterbacke, verjüngt; kurze dünne Quaste bis zum Sprunggelenk */
  const schwanz = [[17.6, -84.4], [15, -84], [13.2, -81.4], [12.4, -75], [12.2, -64], [12.4, -52], [12.8, -44], [14.4, -44], [14.4, -52], [14.4, -64],
    [14.6, -74], [15.4, -79], [17.4, -81.6]];
  s += stueck(T, schwanz, T.lg("schw", [[0, schwarz], [0.42, "#2a2626"], [0.52, "#e8e4dc"], [1, "#d8d2c8"]], 0, -84, 0, -44, U),
    F.kante(12.8, -78, 12.8, -48, 0.4, 0.35), { licht: 0.4, dunkel: 0.5, hell: 0.3 });
  const qA = [[13.4, -47], [13.6, -40], [13.6, -34]];
  s += form([[12.6, -46], [14.6, -46], [15.2, -40], [14.4, -35], [13.4, -33.6], [12.4, -35], [12, -40]], "#e8e4dc", "", 0.1) +
    saum2(T, qA, 22, (x, y) => 90 + (y + 40) * 0.5, 7, "#b0a89c", 0.07, 0.7, { ab: 0, streuung: 16, szene: 0.3 }) +
    saum2(T, qA, 50, (x, y) => 90 + (y + 40) * 0.5, 7.4, "#f6f3ec", 0.07, 0.85, { ab: 0, streuung: 14, szene: 0.3 });
  /* Kopf: groß (≈ 37 % WH), kurzes Gesicht, gewölbte Stirn, stumpfes tiefes Maul; Genick über der Rückenlinie, 50° geneigt */
  /* Gesicht kindlich kurz: alles vor dem Auge (x > 11) um 20 % gestaucht */
  const G = [111, -99], W = 50, kurzG = (p) => [p[0] <= 11 ? p[0] : 11 + (p[0] - 11) * 0.8, p[1]].concat(p[2] ? [1] : []);
  const K = (pts) => dreh(pts.map(kurzG), G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  const kopf = K([[-0.8, -2.4], [3, -6], [7, -7.8], [11, -7.6], [15, -6.4], [19, -5], [23, -4.2], [26, -3.6], [28.6, -2.2], [30.2, 0.6], [30.8, 4], [30.4, 7.4],
    [29.2, 9.4], [28.4, 10.2], [27.6, 11.4], [24.6, 12], [20, 12.2], [15, 13], [10, 14.8], [6.4, 15.8], [3.4, 15.2], [1.4, 12.4], [-0.6, 8], [-1.4, 3]]);
  /* Kehlgang und Schatten hinter dem Kieferwinkel auf den Hals */
  s += imRumpf(rk, F.schatten(...P(3, 15), 4.4, 3.6, 0.55, W) + F.schatten(...P(-3, 6), 3, 7, 0.4, W));
  const blesse = K([[2, -7.2], [8, -7.8], [14, -7.4], [20, -6], [26, -4.6], [29.6, -2.6], [30.4, 1.2], [28.6, 1.6], [26, 0], [22, -1.2], [17, -1.6], [13, -2.4], [9, -3.4], [5, -4]]);
  const flotz = K([[26.4, -4], [28.8, -2.6], [30.4, 0.4], [31, 4], [30.6, 7.6], [29.4, 9.6], [27.2, 9], [26, 5.4], [25.6, 1.2]]);
  const kInnen = fellZone(T, sH, kopf, W - 180, 0.9) + form(blesse, "#f4f0e9", "", 0.05) + fellZone(T, wH, blesse, W - 180, 0.9) +
    saum2(T, blesse.concat([blesse[0]]), 36, W - 180, 0.9, schwarz, 0.05, 0.7, { streuung: 34 }) +
    wirbel(T, ...P(7.6, -5.2), 1.5, 18, "#9a958c", 0.05, 0.6, 0.9) +
    /* gewölbte Stirn im Licht; Kaumuskel-Oval (Licht oben, Schattenrinne unten); Kieferwinkel; Kehle; Gesichtsleiste */
    F.licht(...P(9, -4), 7, 2.4, 0.3, W) + F.licht(...P(8, 8.6), 5, 3.6, 0.22, W) + F.schatten(...P(9, 13.8), 6, 1.8, 0.55, W) +
    F.licht(...P(4.6, 14), 2, 1.2, 0.3, W + 50) + F.schatten(...P(1.6, 10), 1.8, 4.4, 0.45, W) +
    F.kante(...P(13, 4), ...P(21, 3.8), 0.6, 0.32) + F.rinne(...P(13.6, 5.4), ...P(21, 5.2), 0.7, 0.42) +
    F.schatten(...P(23, 9.6), 5, 1.4, 0.4, W) +
    /* Flotzmaul: feucht, Polygonmuster, Glanzband oben und Glanzpunkte */
    form(flotz, T.lg("flotz", [[0, "#e2b4ac"], [0.6, "#d4a098"], [1, "#b8847c"]], 0, 0, 0.4, 1), "", 0.05) +
    fein(T, `<g opacity=".3">${haare2(T, flotz, 18, 0, 0.3, { farben: [["#6a3a38", 1, 0.05, 0.8]], streuung: 180, kruemmung: 0.4 })}</g>`) +
    F.licht(...P(28, -1.6), 1.6, 0.7, 0.75, W - 30) + F.licht(...P(30.4, 4), 0.4, 1.2, 0.6, W) +
    fein(T, [[27.6, 1.6], [29.2, 3], [30, 6.2], [27.6, 6.8], [28.6, 0.2]].map(([x, y]) => F.licht(...P(x, y), 0.18, 0.14, 0.9)).join(""));
  s += vol(T, "kopf", 2.4, stueck(T, kopf, schwarz, kInnen, { licht: 0.9, dunkel: 0.7, hell: 0.5, hellFarbe: "#c8ccd8", q: 0.05 }), { tiefe: 4, umgebung: 0.4 });
  s += saum2(T, K([[-0.8, -2], [3, -5.2], [7, -6.8], [11, -7]]), 22, W - 150, 1.4, "#3a3432", 0.05, 0.8, { ab: 0.3, streuung: 50 });
  /* Nasenloch: C-Form mit Nasenflügel-Wulst */
  s += form(K([[27.2, 0], [29.4, -0.4], [30.6, 1.4], [30.4, 4.4], [29.4, 5.2], [29.4, 3.4], [28.2, 1.8]]), T.rg("nl", [[0, "#1a0c0c"], [0.7, "#3a1a1a"], [1, "#7a4a48"]], 0.6, 0.4, 0.6), "", 0.05);
  s += F.kante(...P(27, -0.6), ...P(30.6, 1.4), 0.35, 0.5) + F.licht(...P(28.4, 3), 0.6, 1, 0.25, W);
  /* Maulspalte (25–30 % Kopflänge), Unterlippe und Kinn als eigene Wölbung, Tasthaare */
  s += strich(K([[29, 10.2], [25.6, 10.8], [21.6, 10.6]]), "#060404", 0.3, 0.5, 0.05) + F.licht(...P(25.6, 11.8), 2, 0.6, 0.25, W);
  s += tasthaare(T, K([[22, 12.2], [25.6, 12], [28.6, 10.8]]), 6, 1.6, W + 70, "#e8e2d8", 0.04);
  /* großes Auge (Kindchenschema), im Augenbogen */
  const A = P(11.4, 0.6);
  s += auge2(T, F, A[0], A[1], 2.1, { winkel: 18, iris: "#3a2214", iris2: "#120804", hoehe: 0.72, wimpern: 16, wl: 0.9, wr: 14, wf: "#0c0c0e", haut: "#c8ccd8", mulde: 0.35, licht: 0.9 });
  /* Ohr: Blatt (≈ 45 % Kopflänge), schmaler Grund am Genick, waagerecht nach hinten-seitlich – bricht die Silhouette */
  const OX = P(3, 4), OW = 166;
  const ohrA = dreh([[-0.6, 1.2], [3, 2], [7, 3.2], [11, 3.6], [14.6, 3], [17, 1.4], [17.6, -0.2], [16.4, -1.8], [12.6, -3], [8, -3.2], [3.4, -2.2], [-0.6, -1.2]], OX[0], OX[1], OW);
  const ohrI = dreh([[2.4, 0.4], [6.4, 1.4], [10.6, 1.8], [14.6, 1.2], [16.4, -0.2], [15, -1.4], [11, -2.2], [6, -2], [2.6, -1]], OX[0], OX[1], OW);
  s += imRumpf(rk, F.schatten(OX[0] - 8, OX[1] + 3.4, 7, 2, 0.45, 12));
  s += stueck(T, ohrA, schwarz, form(ohrI, T.lg("ohri", [[0, "#5a4a4a"], [1, "#a08c8a"]], 1, 0, 0, 0), "", 0.05) +
    F.rinne(...dreh([[4, -0.8], [14, -0.6]], OX[0], OX[1], OW).flat(), 0.4, 0.45) + F.rinne(...dreh([[5, 0.6], [13, 0.8]], OX[0], OX[1], OW).flat(), 0.3, 0.35) +
    haare2(T, ohrI, 22, OW + 196, 2.6, { farben: [["#f4f0e8", 1, 0.05, 0.85]], streuung: 14, kruemmung: 0.2, szene: 0.3 }) +
    F.licht(...dreh([[8, 3]], OX[0], OX[1], OW)[0], 5, 0.7, 0.45, OW), { licht: 0, q: 0.05 });
  s += saum2(T, dreh([[3.4, -2.2], [8, -3.2], [12.6, -3], [16.4, -1.8], [17.6, -0.2]], OX[0], OX[1], OW), 18, OW + 200, 2, "#f4f0e8", 0.05, 0.8, { ab: 0.2, streuung: 16 });
  const m = dreh([[5, 0.4], [5, -2]], OX[0], OX[1], OW);
  s += strich([m[0], m[1]], "#d8a800", 0.4, 0.95, 0.05);
  const mk = [m[1][0], m[1][1] - 0.2];
  s += F.schatten(mk[0] + 0.5, mk[1] + 2.4, 2, 2.4, 0.35);
  s += stueck(T, [[mk[0] - 1.3, mk[1]], [mk[0] + 1.3, mk[1]], [mk[0] + 1.5, mk[1] + 3], [mk[0] - 1.1, mk[1] + 3.1]].map((p) => p.concat([1])),
    T.lg("marke", [[0, "#ffdc50"], [1, "#e2a800"]]), fein(T, `<text x="${z(mk[0] - 0.95, 0.1)}" y="${z(mk[1] + 1.7, 0.1)}" font-size=".95" font-family="Arial" font-weight="700" fill="#2a2000">DE</text>`),
    { licht: 0.3, dunkel: 0.5, hell: 0.5, q: 0.05 });
  const kb = T.box(kopf);
  return { svg: s, box: [10, -104, 133, 0], fuesse: [KA_HCX + 4, KA_HCX + 12, KA_VCX - 3, KA_VCX + 4], kopf: [kb[0] - 14, kb[1] - 4, kb[2] + 2, kb[3] + 2] };
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
/* Esel-Beine aus den Schablonen (WH 115): Fesselgelenk 14 % WH, Fersenhöcker 36 % WH, Kniegelenk an der Bauchlinie,
   Vorderfußwurzel 28 % WH (Unterarm : Röhre ≈ 1,5 : 1); Röhren kräftig (≈ 6,7 cm) */
const E_HCX = 27, E_VCX = 94;
const E_H = bildeBein(HB_TPL, E_HCX, 0.74, [[0, 0], [-8.4, -7], [-23, -16], [-62, -42], [-105, -68], [-127, -88], [-140, -98]]);
const E_V = bildeBein(VB_TPL, E_VCX, 0.74, [[0, 0], [-8.4, -7], [-23, -16], [-50, -32], [-97, -63], [-110, -72]]);
const E_KAMM = [[124, -133], [116, -130], [107, -125.6], [98, -121], [89, -117.6]];
function esel(T) {
  FEIN = T.fein;
  const F = flecken(T, "#fff4e2", "#16120e");
  const U = ' gradientUnits="userSpaceOnUse"';
  /* fünf Tonstufen: Licht oben, Halbton, Kernschatten im unteren Rumpfdrittel, Reflexlicht am Bauch, Beine dunkler */
  const fell = T.lg("fell", [[0, "#a8a094"], [0.25, "#9a9286"], [0.45, "#8a8276"], [0.52, "#9a9284"], [0.62, "#8a8276"], [1, "#6e675d"]], 0, -118, 0, 0, U);
  const fern = T.lg("fern", [[0, "#6a6359"], [0.5, "#736b60"], [1, "#5e574e"]], 0, -70, 0, 0, U);
  const dunkel = "#4a423a";
  const dH = fellMuster(T, "d", 1.4, 80, [["#3e372f", 1, 0.06, 0.24]], 16, 5);
  const hH = fellMuster(T, "h", 1.3, 44, [["#e6dfd2", 1, 0.06, 0.26]], 16, 5);
  const bleich = T.rg("bleich", [[0, "#e2dbce", 1], [0.55, "#dcd4c6", 0.75], [1, "#dcd4c6", 0]]);
  const hellF = (x, y, rx, ry, op, g = 0) => `<ellipse ${g ? `transform="translate(${folge([z(x, 0.1), z(y, 0.1)])})rotate(${g})"` : `cx="${z(x, 0.1)}" cy="${z(y, 0.1)}"`} rx="${z(rx, 0.1)}" ry="${z(ry, 0.1)}" fill="${bleich}" opacity="${op}"/>`;
  const streifen = (x0, x1, y, n, dy) => fein(T, Array.from({ length: n }, (_, i) =>
    `<path d="M${z(x0, 0.1)} ${z(y + i * dy, 0.1)}Q${z((x0 + x1) / 2, 0.1)} ${z(y + i * dy + 1.4, 0.1)} ${z(x1, 0.1)} ${z(y + i * dy, 0.1)}" fill="none" stroke="${dunkel}" stroke-opacity=".07" stroke-width="1.5"/>`).join(""));
  /* Eselhuf: steiler, schmaler Zylinderstumpf, Wand 58°, Trachten 62 % der Zehenhöhe, hinten rund */
  const hufE = (cx, f, haar) => huf2(T, F, cx + 1.2, cx + 11.4, 8, 58, f, haar, 0.62);
  let s = "";
  /* ferne Beine (kühler, dunkler); Kastanie nur vorn innen – raue Hornplatte */
  const kastanie = (x, y) => form([[x - 0.9, y - 1.8], [x + 0.4, y - 2.2], [x + 1, y - 0.6], [x + 0.8, y + 1.4], [x - 0.2, y + 1.9], [x - 1, y + 0.6]], "#3a332c", "", 0.05) +
    fein(T, F.licht(x - 0.2, y - 1, 0.3, 0.2, 0.6) + F.licht(x + 0.3, y + 0.4, 0.25, 0.2, 0.5) + F.licht(x - 0.4, y + 1, 0.2, 0.15, 0.5));
  const fernBein = (vorn, dx) => {
    const cx = (vorn ? E_VCX : E_HCX) + dx;
    const pts = verschiebe(vorn ? E_V.h.concat(E_V.v) : E_H.h.slice(1).concat(E_H.v), dx).concat(vorn ? [[cx + 10, -74], [cx - 7, -74]] : [[cx + 25, -78], [cx - 8, -82]]);
    return stueck(T, pts, fern, fellZone(T, dH, pts, 92, 0.6) + F.schatten(cx + (vorn ? 0 : 10), -66, 9, 10, 0.6) + F.licht(cx - 2, -24, 1.2, 8, 0.3) +
      (vorn ? kastanie(cx - 4.4, -44) : ""), { licht: 0.9, dunkel: 0.5, hell: 0.3 });
  };
  s += vol(T, "bein", 2.2, fernBein(false, 10)) + hufE(E_HCX + 10, "#3a3530", "#4a433a");
  s += vol(T, "bein", 2.2, fernBein(true, -9)) + hufE(E_VCX - 9, "#3a3530", "#4a433a");
  /* Rumpf mit Hals und nahen Beinen: gerader Rücken, kaum Widerrist, Hüfthöcker als Beule, schmales Becken; Hals kurz und kräftig */
  /* PROPORTIONEN Esel (Grauesel, Stockmaß 115) in Kopflängen (KL = 50 cm): Widerrist 2,3 KL, Kruppe 2,36 KL (118), Sitzbein-
     höcker 2 KL (101), Rumpflänge Bug–Sitzbein 1,9 KL (94), Brusttiefe 1,05 KL (Brustboden 61), Ellbogen 1,26 KL (63),
     Vorderfußwurzel 0,64 KL (32), Fesselgelenk 0,32 KL (16), Kniegelenk 1,36 KL (68), Fersenhöcker 0,84 KL (42 = 36 % WH),
     Ohr 0,6 KL, Hals kurz und kräftig (Kamm 0,9 KL), Genick 2,6 KL (130), Kopfwinkel 52°, Huf 8 cm hoch, Wand 58°.
     Hinterkontur: Sitzbeinhöcker, Hinterbacke, Kniekehle, gerade Achillessehne, Fersenhöcker 4 cm vorspringend. */
  const hinten = [[13.4, -101], [12.8, -96], [13.4, -89], [15.4, -81], [18.4, -72], [21.4, -63], [23.6, -56], [24.8, -51]].concat(E_H.h.slice(6));
  const rumpf = hinten.concat(E_H.v, [[52, -67.6], [58, -64.4], [66, -61.8], [76, -60.6], [84, -61.6]], E_V.h, E_V.v,
    [[104.6, -66.4], [106, -71], [107, -76.6], [107.6, -82], [108.6, -88], [110.4, -95], [113, -102.6], [116.4, -110], [120.4, -118], [124.6, -126]], E_KAMM,
    [[86, -116.6], [80, -116], [72, -115.8], [62, -116], [52, -116.6], [44, -117.4], [38, -118.2], [33, -117.6], [27, -116], [21, -112.8], [16.6, -108], [14, -104]]);
  const zHinten = [[0, -122], [44, -122], [50, -96], [50, -66], [30, -40], [10, -40]];
  const zRumpf = [[44, -122], [86, -122], [86, -58], [50, -66], [50, -96]];
  const zVorn = [[86, -122], [132, -140], [112, -100], [104, -60], [86, -58]];
  const zLicht = [[10, -114], [86, -120], [128, -142], [118, -124], [86, -104], [40, -102], [12, -98]];
  const innen =
    /* Schulterkreuz und Aalstrich zuerst (weich gezeichnet), das Fell liegt darüber: Pigment, keine Kante */
    weich(T, form([[86.4, -116.6], [89.4, -116.6], [90.4, -110], [91.8, -102], [93.4, -94.6], [94.2, -91.4], [93.4, -91.4], [91.6, -96], [89.4, -103], [87.6, -110]], dunkel, ` opacity=".65"`, 0.1) +
      form([[90, -116], [80, -115.4], [64, -115.6], [50, -116.4], [40, -117.6], [32, -117.2], [26, -115.6], [20.6, -112.2], [21.8, -110.6], [27, -113.4],
        [33, -115], [40, -115.4], [50, -114.4], [64, -113.8], [80, -113.6], [90, -114]], dunkel, ` opacity=".8"`, 0.2), 0.5) +
    /* Fell als eine Fläche (Kritik: „Nähte“): Rumpf einheitlich nach hinten-unten, nur Hals und Läufe mit eigener Richtung */
    fellZone(T, dH, [[0, -122], [88, -122], [88, -58], [50, -66], [30, -42], [10, -42]], 150) + fellZone(T, dH, zVorn, 128, 0.8) +
    fellZone(T, dH, [[10, -44], [104, -44], [104, 0], [10, 0]], 90, 0.8) +
    fellZone(T, hH, zLicht, 160, 0.9) +
    /* heller Bauch, helle Innenschenkel */
    hellF(66, -60, 22, 5.4, 0.9) + hellF(84, -62, 5, 4, 0.7) + hellF(48, -66, 4, 5, 0.6) + hellF(99, -48, 2.6, 9, 0.35) + hellF(31.4, -48, 2.4, 8, 0.3) +
    streifen(89.6, 98.6, -40, 4, 3) + streifen(22.6, 31, -36, 3, 3.4) +
    fein(T, saum2(T, [[86.6, -114], [87.8, -106], [90, -98], [93, -92]], 22, 100, 1.2, dunkel, 0.07, 0.5, { streuung: 40 }) +
      saum2(T, [[89.6, -114], [90.8, -106], [92.4, -98]], 16, 100, 1.2, dunkel, 0.07, 0.5, { streuung: 40 }) +
      saum2(T, [[88, -113.8], [64, -113.6], [40, -115.4], [26, -113.4]], 40, 100, 1.2, dunkel, 0.06, 0.5, { streuung: 40 })) +
    rumpfLicht(F, 14, 104, -117, -59, 0.75) +
    /* Knochenpunkte: Hüfthöcker (Beule, Glanz), Sitzbein, Hüftgelenk, Kniescheibe, Kniefalte; Rippen; Schulterblatt, Buggelenk, Ellbogen */
    F.licht(37, -116, 4, 1.4, 0.45, -10) + F.schatten(40, -111, 5, 2.4, 0.25) + F.licht(13.6, -100, 1, 2.4, 0.35) + F.schatten(28, -100, 5, 4, 0.25) +
    F.licht(48, -69, 1.4, 2.2, 0.35) + F.rinne(48, -70, 54, -84, 1.3, 0.4) + [60, 66, 72, 78].map((x) => F.rinne(x, -98, x - 4, -70, 1.6, 0.1)).join("") +
    F.kante(88, -112, 100, -86, 1.6, 0.3) + F.rinne(84, -110, 92, -80, 2, 0.2) + F.licht(106, -80, 2, 4, 0.45) + F.schatten(104, -72, 3, 3, 0.3) +
    F.schatten(88, -62, 4, 3, 0.5) + F.licht(86.6, -64.6, 1.4, 1.6, 0.3) +
    /* Hals: Drosselrinne, Kehle */
    F.rinne(119, -116, 108, -90, 1.4, 0.35) + F.licht(114, -112, 2, 8, 0.2, 25) +
    /* Läufe: Zylinderlicht, Sehnen, Fersenbeinhöcker, Achillessehne (vorn hell, hinten dunkel), flaches Knie */
    [E_HCX, E_VCX].map((cx) => F.licht(cx - 2.4, -24, 1.4, 8, 0.45) + F.schatten(cx + 2.8, -24, 1.2, 8, 0.3) + F.rinne(cx - 0.4, -28, cx - 0.4, -18, 0.5, 0.35)).join("") +
    F.licht(E_HCX - 6.2, -42.6, 1, 1.4, 0.5) + F.kante(E_HCX - 3.6, -56, E_HCX - 5, -45, 0.6, 0.5) + F.rinne(E_HCX - 1.4, -56, E_HCX - 2.8, -45, 0.6, 0.4) +
    F.licht(E_VCX - 4.6, -33, 1, 1.4, 0.45) + F.licht(E_VCX - 1.6, -48, 1.8, 8, 0.3) + strich(E_H.v.slice(9), "#2e2822", 0.6, 0.3);
  s += vol(T, "rumpf", 5, stueck(T, rumpf, fell, innen, { licht: 1.4, dunkel: 0.5, hell: 0.5, hellFarbe: "#fff6e8", q: T.fein ? 0.1 : 0.5 }), { dunkel: 0.45, hell: 0.25 });
  const rk = T._clip;
  /* Fell bricht die Silhouette: Bauch, Kehle, Hinterbacken, Fesselbehang */
  s += saum2(T, [[52, -67.6], [58, -64.4], [66, -61.8], [76, -60.6], [84, -61.6]], 30, 110, 1.6, "#cfc7b9", 0.06, 0.7, { ab: 0.3, streuung: 30 });
  s += saum2(T, hinten.slice(1, 6), 14, 125, 1.4, "#8a8276", 0.06, 0.6, { ab: 0.3 });
  s += saum2(T, [[108.6, -88], [110.4, -95], [113, -102.6]], 10, 60, 1.4, "#9a9286", 0.06, 0.6, { ab: 0.3 });
  s += saum2(T, [[E_VCX - 4.8, -11], [E_VCX - 5, -15]], 8, 110, 1.6, "#3e372f", 0.07, 0.8, { ab: 0.3 }) + saum2(T, [[E_HCX - 4.8, -11], [E_HCX - 5, -15]], 8, 110, 1.6, "#3e372f", 0.07, 0.8, { ab: 0.3 });
  s += hufE(E_HCX, "#4e4842", "#5a5248") + hufE(E_VCX, "#4e4842", "#5a5248");
  /* Stehmähne: ≥ 60 einzelne, aufrechte Strähnen; Wurzel dunkel, Spitzen hell; Oberkante unregelmäßig; läuft in den Aalstrich aus */
  const mo = [], mu = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16, q = punktAuf(E_KAMM, t), h = 2.4 + 6.4 * Math.sin(Math.PI * Math.pow(t, 0.8)) + (i % 2) * 1 + (i % 3 === 1 ? -0.9 : 0);
    mu.push([q[0], q[1] + 1.2]);
    mo.push([q[0] - h * 0.2, q[1] - h]);
  }
  const maehne = mo.concat(mu.slice().reverse());
  s += stueck(T, maehne, T.lg("mae", [[0, "#8a847a", 0.7], [0.35, "#5a5248", 0.9], [1, "#2e2822"]], 0, 0, 0.2, 1),
    haare2(T, maehne, 150, -98, 5.4, { farben: [["#2a241e", 1.2, 0.07, 0.65], ["#8e887e", 1, 0.06, 0.6], ["#c8c2b8", 0.5, 0.05, 0.55]], streuung: 8, kruemmung: 0.08, szene: 0.15 }),
    { licht: 0, q: 0.2 });
  s += saum2(T, mo, 80, -100, 2.2, "#9a948a", 0.06, 0.75, { ab: 0.3, streuung: 14 });
  /* Schweif: an der Wurzel breite, kurz grau behaarte Rübe ohne Kontur, liegt an der Hinterbacke; ab 45 % der Länge
     werden die Haare länger und dunkler; Quaste aus vielen Strähnen, unten ausgefranst */
  const ruebe = [[27, -115.6], [20.6, -113.6], [16, -108], [13.6, -99], [12.8, -88], [12.8, -76], [15.4, -73], [17.6, -76], [17.8, -86], [18.8, -96],
    [21.4, -104], [26, -109]];
  s += stueck(T, ruebe, T.lg("rue", [[0, "#8e867a"], [0.55, "#7a7266"], [1, "#3e3730"]], 0, -114, 0, -74, U),
    haare2(T, ruebe, 40, (x, y) => 95 + (y + 90) * 0.4, 2, { farben: [["#4a433a", 1, 0.06, 0.45], ["#c8c0b2", 0.6, 0.05, 0.4]], streuung: 14, szene: 0 }) +
    weich(T, form([[24, -113.6], [19.6, -110], [16.8, -103], [15.4, -94], [15.2, -82], [16.4, -82], [16.6, -94], [18, -102], [21, -108.4], [25, -111.4]], dunkel, ` opacity=".5"`, 0.2), 0.5) +
    F.licht(14.6, -96, 0.8, 10, 0.35), { licht: 0, q: 0.2 });
  s += imRumpf(rk, F.schatten(19, -98, 3, 12, 0.45));
  const qA = [[14.4, -92], [14.8, -80], [15, -66], [15, -56]];
  s += form([[12.8, -84], [17.4, -84], [18.4, -70], [18, -58], [15.6, -50], [13, -52], [11.8, -60], [12, -72]], T.lg("qua", [[0, "#5a5248"], [1, "#1e1a16"]], 0, 0, 0, 1), "", 0.2) +
    saum2(T, qA, 70, (x, y) => 90 + (y + 70) * 0.3, 12, "#1a1612", 0.11, 0.7, { ab: 0, streuung: 14, szene: 0.25 }) +
    saum2(T, qA, 44, (x, y) => 90 + (y + 70) * 0.3, 11, "#5a5248", 0.1, 0.6, { ab: 0, streuung: 16, szene: 0.15 }) +
    saum2(T, qA, 16, (x, y) => 90 + (y + 70) * 0.3, 10, "#9a9288", 0.08, 0.5, { ab: 0, streuung: 16, szene: 0 });
  /* Kopf: groß, gerades Profil, Ganasche kleiner; 52° geneigt, 50 cm; Hals 10 % kürzer → Genick tiefer/weiter hinten */
  const G = [124, -130], W = 52, K = (pts) => dreh(pts, G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  const kopf = K([[-1, -3.2], [8, -5.8], [18, -6.6], [28, -6], [38, -4.8], [44, -3.6], [48, -1.6], [50.4, 1.4], [51, 5.4], [50.4, 9.6], [48.4, 12],
    [47.4, 12.6], [47.4, 13.6], [45.8, 15.4], [42, 16.2], [38.6, 15.8], [33, 16.6], [26, 19], [19, 22.6], [12.6, 24.2], [6.6, 23], [2, 19], [-1.2, 12], [-1.8, 4]]);
  s += imRumpf(rk, F.schatten(...P(4, 23), 7, 5, 0.5, W - 60));
  const kInnen =
    fellZone(T, dH, kopf, W, 0.8) +
    /* Mehlmaul: Grau geht über einen Falb-Zwischenton weich in Creme über; Hautschimmer; kein Leuchthof */
    `<ellipse transform="translate(${folge([z(P(44.6, 5.6)[0], 0.1), z(P(44.6, 5.6)[1], 0.1)])})rotate(${W})" rx="12" ry="12" fill="${T.rg("mehl", [[0, "#e6e0d4"], [0.55, "#ddd5c8"], [0.78, "#cdbca4", 0.7], [1, "#cdbca4", 0]])}"/>` +
    `<ellipse transform="translate(${folge([z(P(47.6, 6.6)[0], 0.1), z(P(47.6, 6.6)[1], 0.1)])})rotate(${W})" rx="4" ry="5" fill="#c9b7ad" opacity=".22"/>` +
    F.licht(...P(46, 2), 3, 2, 0.25, W) + F.schatten(...P(43, 14.4), 6, 2, 0.45, W) +
    /* Ganasche: Glanz oben vorn, Kernschattenbogen unten hinten, Reflexlicht; Jochbeinleiste; Nasenrücken-Licht; Kehlgang */
    F.licht(...P(15, 11), 5.6, 4.6, 0.35, W) + F.schatten(...P(10, 21.4), 8, 2.6, 0.5, W - 40) + F.licht(...P(12, 23.2), 5, 1, 0.22, W - 40) +
    F.kante(...P(18, 6), ...P(34, 5.2), 1, 0.5) + F.rinne(...P(19, 8.2), ...P(34, 7.4), 1.2, 0.45) + F.licht(...P(30, -4.4), 13, 1.2, 0.45, W) +
    F.schatten(...P(1.6, 12), 3, 8, 0.4, W) +
    /* helle „Brille“ um das Auge, breit und weich */
    hellF(...P(17.6, 1.4), 6, 5, 0.45, W) + hellF(...P(17.6, 1.4), 4.4, 3.8, 0.5, W);
  s += vol(T, "kopf", 3.5, stueck(T, kopf, fell, kInnen, { licht: 1, dunkel: 0.6, hell: 0.4, hellFarbe: "#fff6e8", q: 0.1 }), { dunkel: 0.45, hell: 0.25 });
  /* Nüster: schräger Kommaschlitz, oberes Ende zum Auge; erhabener Nasenflügel als weiche Lichtkante (kein weißer Strich) */
  s += form(K([[45.6, 1.8], [48.4, 1.6], [49.6, 3.6], [49.2, 6.6], [47.8, 7.6], [48, 5.2], [46.8, 3.4]]), T.rg("nue", [[0, "#1e1414"], [0.7, "#3e2c2a"], [1, "#6a5450"]], 0.6, 0.4, 0.6), "", 0.05);
  s += F.kante(...P(45, 0.8), ...P(50.2, 3), 0.6, 0.45) + F.schatten(...P(46.8, 5), 1, 2, 0.35, W);
  s += strich(K([[47.6, 13], [44.6, 13.6], [41, 13.6]]), "#3a2e2a", 0.22, 0.45, 0.05) + F.licht(...P(44, 15.2), 3, 0.7, 0.3, W);
  s += tasthaare(T, K([[42, 13.4], [46, 12.8], [49.4, 11]]), 7, 2.4, W + 40, "#3a3430", 0.05) + tasthaare(T, K([[38, 16], [42, 16.2], [45.6, 15.4]]), 6, 2.2, W + 75, "#3a3430", 0.05);
  /* Auge: +20 %, Höhe:Breite ≈ 0,62, im Augenbogen */
  const A = P(17.6, 1.6);
  s += auge2(T, F, A[0], A[1], 3, { winkel: 30, iris: "#2a1a10", iris2: "#0e0805", hoehe: 0.64, wimpern: 14, wl: 0.8, wr: 12, wf: "#2a2420", haut: "#fff6e8", mulde: 0.45 });
  /* Ohren: sehr lang (60 % der Kopflänge), ohne Konturlinie; Ansatz als Röhre mit Falte und weichem Schatten,
     außen dunkler Haarrand und dunkle Spitze; innen heller Trichter mit Haarbüscheln */
  const ohrL = [[-4.4, 0.6], [-5.4, -6], [-5.6, -14], [-4.4, -22], [-2, -28], [0.2, -30.6, 1], [2.4, -27], [4.8, -20], [5.6, -12], [5, -5], [3.4, 0.8]];
  const ohrF = T.lg("eohr", [[0, "#1e1a16"], [0.14, "#3e3730"], [0.3, "#8a8276"], [1, "#958d80"]]);
  const rand = (o, g) => strich(dreh([[-5.2, -6], [-5.4, -14], [-4.2, -22], [-1.8, -28], [0.2, -30.4]], o[0], o[1], g), "#1e1a16", 0.9, 0.55, 0.05);
  const OF = P(-2, -4), ON = P(3.6, -4.6);
  s += imRumpf(rk, F.schatten(OF[0] - 1, OF[1] + 2, 4, 3, 0.4));
  s += stueck(T, dreh(ohrL, OF[0], OF[1], -24), ohrF, F.schatten(OF[0] + 3, OF[1] - 6, 3, 8, 0.3) + rand(OF, -24) + F.schatten(OF[0], OF[1], 4, 3, 0.5), { licht: 0, q: 0.1 });
  const oI = dreh([[-3.4, -1], [-4, -8], [-3.6, -16], [-2, -23], [0, -26.4], [2.2, -20], [3.4, -12], [3, -4]], ON[0], ON[1], -6);
  s += stueck(T, dreh(ohrL, ON[0], ON[1], -6), ohrF,
    form(oI, T.lg("ohri", [[0, "#4a4238"], [0.5, "#a8a092"], [1, "#e0d9cc"]], 0.5, 0, 0, 0), "", 0.05) +
    haare2(T, oI, 60, -92, 3.2, { farben: [["#f2ece2", 1, 0.06, 0.8], ["#b8b0a2", 0.4, 0.05, 0.6]], streuung: 14, kruemmung: 0.2, szene: 0.3 }) +
    rand(ON, -6) + F.licht(...dreh([[4.6, -12]], ON[0], ON[1], -6)[0], 0.8, 7, 0.3, -6) +
    F.schatten(...dreh([[-0.4, -1]], ON[0], ON[1], -6)[0], 4, 3, 0.55), { licht: 0, q: 0.1 });
  s += saum2(T, dreh([[2.8, -4], [3.4, -12], [2.2, -20]], ON[0], ON[1], -6), 22, -60, 2, "#f2ece2", 0.06, 0.8, { ab: 0.4, streuung: 20 });
  const kb = T.box(kopf);
  return { svg: s, box: [10, -164, 157, 0], fuesse: [E_HCX + 5, E_HCX + 17, E_VCX - 4, E_VCX + 6], kopf: [kb[0] - 4, kb[1] - 34, kb[2] + 2, kb[3] + 2] };
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
/* Schweine-Beine aus den Schablonen: kurz und stämmig, Sprunggelenk ≈ 25 % der Höhe (38 % der Beinlänge),
   Vorderfußwurzel ≈ 19 %, Fesseln 50–55°; oben breit (Unterarm, Unterschenkel) */
const S_HCX = 24, S_VCX = 127;
const S_H = bildeBein(HB_TPL, S_HCX, [[-23, 0.7], [-62, 0.75], [-105, 0.72], [-140, 0.9]], [[0, 0], [-8.4, -4.4], [-23, -9.5], [-62, -22], [-105, -40], [-127, -58], [-140, -68]]);
const S_V = bildeBein(VB_TPL, S_VCX, [[-23, 0.68], [-50, 0.72], [-97, 0.8], [-110, 0.85]], [[0, 0], [-8.4, -4.4], [-23, -9], [-50, -17], [-97, -40], [-110, -50]]);
function schwein(T) {
  FEIN = T.fein;
  const F = flecken(T, "#fff4ec", "#7a3020");
  const U = ' gradientUnits="userSpaceOnUse"';
  /* Flanke cremig, Terminator bei ≈ 60 % der Rumpfhöhe, Kernschatten, warmes Reflexlicht am Unterbauch; Beine etwas dunkler */
  const haut = T.lg("haut", [[0, "#f8e8de"], [0.18, "#f3ddd0"], [0.38, "#eaccbc"], [0.5, "#d4a894"], [0.58, "#deb2a0"], [0.66, "#d6a896"], [1, "#cc9c8c"]], 0, -90, 0, 0, U);
  const fernH = T.lg("fernH", [[0, "#b89488"], [1, "#a8887c"]], 0, -40, 0, 0, U);
  const borsten = fellMuster(T, "b", 1.6, 26, [["#fff8f0", 1, 0.05, 0.6], ["#c8907e", 0.5, 0.05, 0.4]], 18, 6);
  const poren = fellMuster(T, "p", 0.06, 110, [["#a86a5a", 1, 0.1, 0.1]], 180, 7);
  let s = "";
  const klS = (cx, f, b) => klaue3(T, F, cx + 0.6, 7.4, 4.6, f, "#f4e0d4", b) + afterklaue2(T, cx - 1, -6, 1, "#a49488", "#f4e0d4");
  const fernBein = (vorn, dx) => {
    const cx = (vorn ? S_VCX : S_HCX) + dx;
    const pts = verschiebe(vorn ? S_V.h.concat(S_V.v) : S_H.h.slice(2).concat(S_H.v), dx).concat(vorn ? [[cx + 10, -48], [cx - 8, -48]] : [[cx + 22, -46], [cx - 6, -46]]);
    return stueck(T, pts, fernH, F.schatten(cx + (vorn ? 0 : 8), -38, 9, 7, 0.7) + F.licht(cx - 1.6, -14, 1, 5, 0.3), { licht: 0.8, dunkel: 0.5, hell: 0.3 });
  };
  s += vol(T, "bein", 2, fernBein(false, 9), { schatten: "#6a2418" }) + klS(S_HCX + 9, "#a8988c", "#b89488");
  s += vol(T, "bein", 2, fernBein(true, -8), { schatten: "#6a2418" }) + klS(S_VCX - 8, "#a8988c", "#b89488");
  /* Bauch mit 7 Drüsenwölbungen (nach hinten leicht enger) */
  const zx = [55, 65.4, 75.4, 85, 94.4, 103.4, 112];
  const bauch = [[49, -41.2]];
  zx.forEach((x, i) => { const y0 = -39.4 - Math.abs(i - 3) * 0.3; bauch.push([x - 4.4, y0 + 0.5], [x, y0 - 0.5]); });
  bauch.push([116.4, -40.2]);
  /* Umriss: Schinken als eigene Masse hinten (über die Beinlinie, zur Kniekehle eingezogen), Kruppe fällt 15–20°,
     breite Schulter, schwere Backe ohne Hals; Kopf mit Kinnstufe (Unterkiefer kürzer als die Oberlippe) */
  const rumpf = [[9, -80.6], [6, -76], [3.8, -69], [3, -61], [3.8, -53], [6, -46.4], [9.6, -41], [13.6, -37.4]].concat(S_H.h.slice(3), S_H.v, bauch, S_V.h, S_V.v,
    [[139.4, -42.2], [143.6, -45.6], [148, -48.4], [152.4, -50], [158, -51.4], [164, -52.8], [169, -54], [172.6, -54.8], [175, -55.6], [176.4, -57], [178.2, -57.8], [179.8, -58.2], [181.4, -58.6],
      [182.4, -63], [182, -68.4], [176, -70.8], [168, -74.2], [160, -78], [152, -81.8], [146, -84.4], [138, -86.6], [126, -88], [110, -89], [90, -89.6], [70, -89.6],
      [50, -89], [38, -87.8], [28, -85.6], [19, -83], [12.6, -81.6]]);
  const wuchs = richtung([[5, 100], [30, 140], [60, 165], [130, 150], [150, 120]]);
  const innen =
    fellZone(T, poren, rumpf, 0, 1) + fellZone(T, borsten, [[0, -100], [42, -100], [36, -30], [0, -30]], 105) + fellZone(T, borsten, [[42, -100], [125, -100], [125, -30], [36, -30]], 160) +
    fellZone(T, borsten, [[125, -100], [160, -100], [150, -30], [125, -30]], 130) + fellZone(T, borsten, [[0, -30], [140, -30], [140, 0], [0, 0]], 90) +
    rumpfLicht(F, 8, 148, -89, -40, 0.8) + F.licht(80, -86, 60, 3, 0.4) +
    /* Schinken: Kugelmasse mit eigenem Glanz, Kernschatten unten-vorn, Senke zur Flanke; Schulter mit Glanz, Senke dahinter */
    F.licht(20, -70, 13, 12, 0.5) + F.glanz(14, -74, 6, 5, 0.4) + F.schatten(26, -46, 14, 6, 0.45, -20) + F.schatten(44, -56, 7, 16, 0.3, -15) +
    F.licht(128, -72, 11, 12, 0.42) + F.schatten(136, -50, 8, 8, 0.3, 15) +
    /* Falten als weiche Wülste: Halsfalten hinter der Backe, Ellbogen, Kniefalte; Fesselringe */
    [0, 1, 2].map((i) => F.kante(146 - i * 3.2, -70 + i * 2, 147 - i * 3.2, -56 + i * 2, 0.7, 0.4) + F.rinne(147.2 - i * 3.2, -70 + i * 2, 148.2 - i * 3.2, -56 + i * 2, 0.8, 0.3)).join("") +
    F.kante(120, -43, 132, -45.6, 0.7, 0.4) + F.rinne(120, -41.6, 132, -44.2, 0.8, 0.35) + F.rinne(44, -40, 50, -48, 1, 0.35) + F.licht(47, -46, 1.2, 3, 0.3, 30) +
    [S_HCX, S_VCX].map((cx) => F.licht(cx - 1.8, -14, 1.2, 4, 0.45) + F.schatten(cx + 2.6, -14, 1, 4, 0.3)).join("") +
    /* Sprunggelenk-Höcker, Vorderfußwurzel, Achillessehne; Achsel- und Leistenschatten */
    F.licht(S_HCX - 6.2, -22.6, 0.9, 1.2, 0.5) + F.kante(S_HCX - 4.4, -30, S_HCX - 5.6, -24, 0.5, 0.45) + F.licht(S_VCX - 4.4, -17.4, 0.8, 1.2, 0.45) +
    F.schatten(S_VCX - 4, -40, 6, 4, 0.45) + F.schatten(46, -40, 6, 3, 0.4) + strich(S_H.v.slice(10), "#8a4a3e", 0.5, 0.25) +
    `<ellipse cx="84" cy="-39.6" rx="36" ry="3.2" fill="${T.rg("ros", [[0, "#e8a898", 0.45], [1, "#e8a898", 0]])}"/>` +
    /* Kopf: Stirn/Nasenrücken im Licht, schwere Backe mit Kernschatten unten, Kinnstufe, feine Querfalten am Rüssel */
    F.licht(162, -75, 12, 2.2, 0.45, 24) + F.licht(156, -62, 8, 6, 0.35) + F.schatten(158, -54.6, 11, 2.2, 0.5, 6) + F.schatten(172, -56.6, 4, 1.2, 0.45, 10) +
    F.licht(152, -52, 4, 1, 0.3, 15) +
    [0, 1, 2].map((i) => F.kante(174 + i * 2.2, -71.6 + i * 0.8, 174.6 + i * 2.2, -68.6 + i * 0.8, 0.35, 0.4) + F.rinne(174.8 + i * 2.2, -71.4 + i * 0.8, 175.4 + i * 2.2, -68.4 + i * 0.8, 0.35, 0.3)).join("");
  s += vol(T, "rumpf", 5, stueck(T, rumpf, haut, innen, { licht: 1.4, dunkel: 0.5, hell: 0.5, hellFarbe: "#fff6f0", q: T.fein ? 0.1 : 0.5 }), { schatten: "#6a2418", dunkel: 0.45, hell: 0.25 });
  const rk = T._clip;
  /* Borstensaum im Gegenlicht: Rücken (Kamm dichter), Nacken, Bauch, Schinken, Beinrückseiten */
  s += saum2(T, [[12.6, -81.6], [28, -85.6], [50, -89], [90, -89.6], [126, -88], [146, -84.4]], 110, wuchs, 2, "#fff8f0", 0.05, 0.75, { ab: 0.15, streuung: 40 });
  s += saum2(T, bauch, 40, 100, 1.6, "#f4e0d4", 0.05, 0.6, { ab: 0.2, streuung: 40 });
  s += saum2(T, [[6, -76], [3.8, -69], [3, -61], [3.8, -53], [6, -46.4]], 20, 150, 1.6, "#fff8f0", 0.05, 0.6, { ab: 0.2, streuung: 40 });
  s += saum2(T, [[148, -48.6], [158, -52.6], [169, -55]], 14, 100, 1.2, "#fff8f0", 0.05, 0.6, { ab: 0.2, streuung: 40 });
  s += klS(S_HCX, "#cfc0b2", "#d8b4a8") + klS(S_VCX, "#cfc0b2", "#d8b4a8");
  /* Zitzen: ferne Reihe dunkler dahinter; nahe Reihe mit Licht oben, Schatten unten, Größe leicht variierend */
  zx.slice(1, 5).forEach((x) => { s += form([[x + 1.5, -38.6], [x + 2.5, -38.6], [x + 2.4, -37.2], [x + 2, -36.8], [x + 1.6, -37.2]], "#c08478", "", 0.05); });
  zx.forEach((x, i) => {
    const y = -39.4 - Math.abs(i - 3) * 0.3 - 0.6, l = 1.4 + (i % 3) * 0.2;
    s += stueck(T, [[x - 0.6, y + 0.2], [x + 0.6, y + 0.2], [x + 0.55, y + l * 0.7], [x + 0.3, y + l], [x - 0.3, y + l], [x - 0.55, y + l * 0.7]], "#e0a494",
      F.kante(x - 0.5, y + 0.2, x - 0.4, y + l, 0.2, 0.5) + F.schatten(x, y + l + 0.3, 0.6, 0.4, 0.3), { licht: 0, q: 0.05 });
  });
  /* Ringelschwanz: Ansatz am Ende der Kruppe auf Höhe der Rückenlinie, 1,5 Korkenzieher-Windungen, verjüngt,
     hinterer Teil der Windung dunkler (verdeckt), Endquaste aus Borsten */
  s += imRumpf(rk, F.schatten(11, -79.4, 3, 2.4, 0.5));
  {
    /* Mittellinie: Ansatz auf der Rückenlinie, dann 1,5 Windungen nach hinten-unten, Radius und Dicke nehmen ab */
    const m = [[12.4, -81.2], [10.6, -82.2]];
    for (let i = 0; i <= 26; i++) {
      const t = i / 26, a = -Math.PI / 2 - 3 * Math.PI * t, r = 2.3 - 0.9 * t;
      m.push([8.4 - 4 * t + r * Math.cos(a), -79.8 + 7.6 * t + r * Math.sin(a) * 0.85]);
    }
    const n = m.length, breite = (i) => 1.5 - 0.95 * i / (n - 1);
    /* ganze Röhre im Schatten (verdeckte Teile), dann die vorderen Windungsbögen hell darüber */
    s += form(wurst(m, 1.5, 0.55), "#b8877a", "", 0.05);
    let teil = [];
    const flush = (i) => { if (teil.length > 2) s += form(wurst(teil, breite(i - teil.length), breite(i)), "#efcfbf", "", 0.05) + strich(teil.map(([x, y]) => [x - 0.15, y - 0.2]), "#fff", 0.18, 0.4, 0.05); teil = []; };
    m.forEach((p, i) => { const vorn = i < 3 || Math.sin(-Math.PI / 2 - 3 * Math.PI * ((i - 2) / 26)) > -0.2; if (vorn) teil.push(p); else flush(i); });
    flush(n);
    const e = m[n - 1];
    s += saum2(T, [[e[0] - 0.2, e[1]], [e[0] + 0.2, e[1] + 0.2]], 9, 100, 1.4, "#e8d0c4", 0.05, 0.85, { ab: 0, streuung: 60, szene: 0.5 });
  }
  /* Rüsselscheibe: fast senkrecht, ohne Kontur; glänzender Rostralwulst; Nasenloch als Sichel; feucht, fein punktiert */
  const scheibe = [[180.6, -68.8], [182.8, -68.4], [184.2, -66.2], [184.6, -62.4], [184.2, -59.2], [182.8, -57.8], [181.2, -58.2], [180.2, -63]];
  s += stueck(T, scheibe, T.lg("sch", [[0, "#d4988a"], [0.55, "#e8b2a4"], [1, "#e2a696"]], 0, 0, 1, 0),
    F.kante(183.6, -67.6, 184.6, -60, 0.5, 0.7) + F.licht(182.8, -66.6, 0.8, 1.2, 0.75) + F.schatten(181, -63, 0.8, 4, 0.3) +
    form([[183.2, -65], [184, -64], [183.9, -60.6], [183.1, -59.8], [183.4, -62.2]], T.lg("nls", [[0, "#3a1814"], [1, "#7a4038"]], 1, 0, 0, 0), "", 0.05) +
    fein(T, [[182, -66], [183, -62.6], [182.2, -60], [181.4, -64.4], [183.2, -58.8]].map(([x, y]) => F.licht(x, y, 0.16, 0.14, 0.9)).join("")), { licht: 0, q: 0.05 });
  s += tasthaare(T, [[180.6, -67], [180.2, -62], [180.8, -59.4]], 9, 2, 20, "#fff4ec", 0.04) + tasthaare(T, [[172, -56.4], [176, -57.4], [179.6, -58.4]], 6, 1.8, 95, "#fff4ec", 0.04);
  /* Maulspalte: kurz, von unter der Scheibe bis unter den vorderen Augenrand, sanft, ohne Haken; Mundwinkelfalte */
  s += strich([[180.4, -59.6], [176.4, -59.6], [172.4, -60]], "#8a4a40", 0.24, 0.45, 0.05) + F.rinne(171.6, -61.2, 172.4, -59.8, 0.3, 0.4) + F.licht(176, -58.4, 3, 0.5, 0.3);
  /* Auge: +40 %, Oberlid als dicke Hautfalte, helle Wimpern, 1/3 vom Ohr verdeckt */
  s += auge2(T, F, 163.8, -67.6, 2.3, { winkel: -6, iris: "#6a4024", iris2: "#2a1408", hoehe: 0.62, pupBreite: 0.45, wimpern: 10, wl: 0.9, wr: -30, wf: "#f4e4d8", haut: "#fff", mulde: 0.35, licht: 0.5 });
  s += F.rinne(160, -64.8, 167, -64.6, 0.3, 0.35) + F.rinne(160.6, -63.6, 166, -63.2, 0.25, 0.25) + F.kante(160.6, -70.4, 167, -69.8, 0.35, 0.4);
  /* Schlappohr (Landrasse): kräftiger, eingerollter Ohrgrund über/hinter dem Auge; breit-dreieckig nach vorn-unten,
     Spitze vor dem Auge auf Höhe des Nasenrückens; durchscheinend warm zum Rand, feine verzweigte Adern */
  const ohr = [[145.4, -84.8], [151.6, -86.2], [158, -85], [164.6, -81.6], [170.4, -76.4], [174.6, -70.6], [176.4, -66], [177.2, -62.2, 1], [173.6, -62.6],
    [170.4, -64.6], [166.6, -68], [162.6, -71.2], [158, -74.2], [152.4, -77.6], [147.4, -80.6]];
  s += imRumpf(rk, F.schatten(164, -64.6, 12, 2.8, 0.5, 28) + F.schatten(152, -73, 6, 4, 0.4));
  s += vol(T, "ohr", 1.2, stueck(T, ohr, T.lg("ohr", [[0, "#f0d2c4"], [0.55, "#efc2b2"], [1, "#e8a290"]], 0, 0, 1, 1),
    /* Ohrgrund: Rolle mit zwei Knorpelfalten */
    F.licht(150, -82, 4, 2, 0.5, 20) + F.rinne(148, -80.4, 154, -77, 0.6, 0.45) + F.rinne(150.6, -83.6, 156.6, -80.2, 0.5, 0.35) +
    F.licht(160, -81.4, 10, 2, 0.5, 34) + F.schatten(166, -69.6, 10, 1.8, 0.35, 36) + F.glanz(172.6, -66, 3, 2, 0.4, 55) +
    fein(T, strich([[152, -82], [158, -80], [164, -76], [170, -70.6], [174.4, -64.6]], "#a8506a", 0.16, 0.32, 0.05) +
      strich([[158, -80], [160.4, -76.4], [161, -72.6]], "#a8506a", 0.12, 0.3, 0.05) + strich([[164, -76], [166.4, -72], [166.6, -68.6]], "#a8506a", 0.11, 0.28, 0.05) +
      strich([[160.4, -76.4], [163, -75.4]], "#a8506a", 0.09, 0.28, 0.05) + strich([[166.4, -72], [169, -71]], "#a8506a", 0.08, 0.26, 0.05) +
      strich([[170, -70.6], [171, -66.6]], "#a8506a", 0.08, 0.26, 0.05)) +
    /* Randwulst an der freien Kante: Knorpelrand mit Licht, darüber eine feine Schattenrinne (Dicke), warm durchscheinend */
    [[148.4, -79.8], [152.6, -76.8], [158, -73.4], [162.6, -70.4], [166.6, -67.2], [170.4, -63.8], [173.8, -61.8]].map((p, i, a) => i ?
      F.kante(a[i - 1][0], a[i - 1][1] - 0.5, p[0], p[1] - 0.5, 0.35, 0.55) + F.rinne(a[i - 1][0], a[i - 1][1] - 1.2, p[0], p[1] - 1.2, 0.3, 0.35) : "").join("") +
    F.glanz(170, -66, 4, 1.2, 0.35, 40) +
    haare2(T, ohr, 22, 30, 1.1, { farben: [["#fff8f0", 1, 0.04, 0.6]], streuung: 20, szene: 0 }),
    { licht: 0, q: 0.05 }), { schatten: "#6a2418", dunkel: 0.35, hell: 0.35 });
  s += saum2(T, [[164.6, -81.6], [170.4, -76.4], [174.6, -70.6], [176.6, -65.6]], 14, 30, 1, "#fff4ec", 0.04, 0.6, { ab: 0.2, streuung: 30 });
  const kb = T.box(scheibe.concat(ohr, [[146, -50]]));
  return { svg: s, box: [1, -92, 186, 0], fuesse: [S_HCX + 3, S_HCX + 11, S_VCX - 2, S_VCX + 5], kopf: [kb[0] - 2, kb[1] - 6, kb[2] + 2, kb[3] + 2] };
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
/* Schafbeine (WH 75): Fesselgelenk 12 % WH, Fersenbeinhöcker 32 % WH, Vorderfußwurzel 28 % WH; Röhre ≈ 3,3 cm */
const SF_HCX = 20, SF_VCX = 92;
const SF_H = bildeBein(HB_TPL, SF_HCX, [[-23, 0.34], [-62, 0.38], [-105, 0.5], [-140, 0.6]], [[0, 0], [-8.4, -4], [-23, -9], [-62, -24], [-105, -40], [-127, -52], [-140, -58]]);
const SF_V = bildeBein(VB_TPL, SF_VCX, [[-23, 0.34], [-50, 0.38], [-97, 0.5], [-110, 0.55]], [[0, 0], [-8.4, -4], [-23, -9], [-50, -21], [-97, -38], [-110, -46]]);
function schaf(T) {
  FEIN = T.fein;
  const F = flecken(T, "#fffaee", "#2a2418");
  const U = ' gradientUnits="userSpaceOnUse"';
  /* Vlies-Licht: oben warmes Licht, Kernschatten bei 65–80 % der Rumpftiefe, unten schmales Reflexlicht */
  const wolF = T.lg("wolle", [[0, "#f6f0e2"], [0.3, "#efe8d8"], [0.58, "#dcd1ba"], [0.74, "#c2b69c"], [0.9, "#cec2a6"], [1, "#c4b89c"]], 0, -80, 0, -34, U);
  const bein = T.lg("bein", [[0, "#3c342e"], [0.5, "#26201c"], [1, "#1a1614"]], 0, 0, 1, 0), beinF = "#2a2420";
  /* Vlies: Stapel-Relief statt Musterkachel (Kritik: „Prägetapete“) – Rauschen als Höhenkarte von links oben beleuchtet,
     unregelmäßige, abgeflachte Stapelspitzen mit feinen Spalten; nur in voller Feinheit */
  const wr = T.fein ? T.relief("wolle", { typ: "turbulence", f: 0.5, f2: 0.42, okt: 2, tiefe: 0.5, k1: 1.24, hoehe: 55, seed: 5 }) : "";
  const relief = (svg) => (wr ? `<g filter="${wr}">${svg}</g>` : svg);
  const haarS = fellMuster(T, "s", 0.7, 50, [["#6a6058", 1, 0.04, 0.3]], 10, 3);
  let s = "";
  const klSF = (cx, f) => klaue3(T, F, cx + 0.3, 5.4, 3.4, f, "#3a322c", "#4a403a") + afterklaue2(T, cx - 1.6, -4.6, 0.8, "#2a2420", "#3a322c");
  /* schwarze Läufe ab Sprunggelenk/Vorderfußwurzel (Oberteil verschwindet im Vlies) */
  const laufPts = (vorn) => vorn ? SF_V.h.slice(3).concat(SF_V.v.slice(0, 13), [[SF_VCX + 3, -28], [SF_VCX - 3, -28]]) :
    SF_H.h.slice(5).concat(SF_H.v.slice(0, 12), [[SF_HCX + 6, -31], [SF_HCX - 1, -31]]);
  const lauf = (pts, f, fern, cx) => vol(T, "bein", 0.9, stueck(T, pts, f, fellZone(T, haarS, pts, 92, 1) + (fern ? "" : F.glanz(cx - 1.2, -14, 0.8, 6, 0.25)) +
    F.licht(cx - 2.4, -23.4, 0.6, 0.8, fern ? 0.2 : 0.4), { licht: 0.6, dunkel: 0.6, hell: fern ? 0.2 : 0.4, hellFarbe: "#a89888" }), { dunkel: 0.5, hell: 0.25 });
  s += lauf(verschiebe(laufPts(false), 7), beinF, 1, SF_HCX + 7) + klSF(SF_HCX + 7, "#2e2824");
  s += lauf(verschiebe(laufPts(true), -6), beinF, 1, SF_VCX - 6) + klSF(SF_VCX - 6, "#2e2824");
  /* Wollärmel der fernen Beine (bis Sprunggelenk/Knie), im Schatten −20 %, Rand ausgefranst */
  const aermel = (pts, w) => relief(stueck(T, lockig(pts, 0.5, T.rnd), "#aa9e84", F.schatten(T.box(pts)[2] - 2, -30, 4, 8, 0.4), { licht: 0.8, dunkel: 0.5, hell: 0.1 })) +
    saum2(T, pts.slice(2, 5), 14, 95, 1.2, "#b8ac92", 0.06, 0.7, { ab: 0.3, streuung: 40 });
  s += aermel([[22, -40], [34, -40], [31, -29], [29.6, -25.6], [24.2, -24], [22.4, -26.6], [21, -32]], 100) + aermel([[80, -40], [92, -40], [91, -27], [90.4, -22.4], [85, -21.4], [84, -26]], 92);
  s += lauf(laufPts(false), bein, 0, SF_HCX) + klSF(SF_HCX, "#3e3632");
  s += lauf(laufPts(true), bein, 0, SF_VCX) + klSF(SF_VCX, "#3e3632");
  /* Kopf-Lage: Genick 6 cm über dem Widerrist; 50° geneigt, 27 cm */
  const G = [122, -93], W = 50, K = (pts) => dreh(pts, G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  /* fernes Ohr: nur die Spitze schaut über das Genick */
  const ohrL = [[0, -1], [3.4, -1.5], [7, -2.4], [10.6, -3], [13.4, -2.6], [14.8, -0.8], [14.2, 1.6], [11.6, 2.8], [7.6, 2.5], [4, 1.7], [0, 1]];
  const OF = P(5, -0.6);
  s += stueck(T, dreh(ohrL, OF[0], OF[1], 198, 0.78), "#1c1814", F.licht(...dreh([[11, -1.6]], OF[0], OF[1], 198, 0.78)[0], 2, 0.5, 0.3, 18), { licht: 0, q: 0.05 });
  /* Vlies: gerade Rückenlinie; Keule kräftig konvex bis zum Sprunggelenk; Schwanzstummel wächst aus dem Vlies;
     Bugspitze rund vor; tiefster Punkt hinter den Vorderbeinen; Bauch steigt zur Flanke; Hals 40–45° nach vorn-oben, schmaler */
  /* PROPORTIONEN Schaf (Schwarzköpfiges Fleischschaf, Mutterschaf) in Kopflängen (KL = 27 cm): Widerrist 2,8 KL (75),
     Rückenlinie mit Vlies 2,95 KL (80), Rumpflänge Bug–Sitzbein 3,3 KL (90), Vliesunterlinie hinter den Vorderbeinen 1,3 KL (35),
     zur Flanke auf 1,5 KL (41) steigend, Vorderfußwurzel 0,78 KL (21), Fesselgelenk 0,33 KL (9), Fersenhöcker 0,9 KL (24 = 32 % WH),
     Keule 4 % WH über die Sitzbeinlinie ausgebaucht bis zum Sprunggelenk, Bugspitze 0,4 KL vor dem Vorderbein,
     bewollter Hals 40–45° nach vorn-oben, Genick 3,45 KL (93), Kopfwinkel 50°. */
  const basis = [[118, -91.6], [112, -88], [106, -84.2], [100, -81.2], [94, -80], [86, -79.2], [72, -79], [58, -79.2], [44, -79.6], [32, -79.6], [22, -78.6], [16, -77.6],
    [11.6, -76.4], [8.4, -74], [7.4, -70.8], [8.2, -68.6], [5.8, -64.6], [4, -58], [3.8, -50], [5.4, -42], [8.4, -35], [12, -29.6], [15, -26.2], [16.4, -24.6],
    [19.4, -24], [23.6, -25.2], [26.6, -29.6], [30, -34.6], [34, -39], [38.4, -41], [46, -39.6], [56, -37.6], [66, -36], [76, -35], [83.6, -35], [86.4, -32],
    [87.4, -26], [88.4, -22], [91, -21], [94.6, -21.6], [95.6, -24.6], [96.8, -29.4], [98.6, -34], [102, -38.4], [106, -43.4], [109.2, -49], [111.2, -55],
    [112.6, -60.4], [114.4, -65.6], [116.6, -70.6], [119.2, -75.4], [122, -80], [124, -84.4], [122.6, -89.4]];
  const vlies = lockig(basis, 0.9, T.rnd);
  const dV = gl(vlies, true, T.fein ? 0.1 : 0.5);
  /* Stapelrichtung: Scheitel auf dem Rücken, Bögen über Schulter und Keule, an den Seiten senkrecht fallend; Hals/Schulter fein, Keule grob */
  const zRuecken = [[0, -86], [120, -96], [120, -75], [0, -73]];
  const zSeite = [[28, -76], [62, -76], [62, -20], [28, -20]];
  const zSeite2 = [[62, -76], [92, -76], [92, -20], [62, -20]];
  const zKeule = [[0, -76], [28, -76], [34, -40], [26, -20], [0, -20]];
  const zBug = [[92, -80], [122, -92], [118, -50], [100, -18], [86, -18], [90, -60]];
  const vInnen =
    /* Walze, Schulter und Keule mit eigenem Licht; Okklusion an den Beinansätzen und unter dem Kopf */
    rumpfLicht(F, 6, 112, -80, -36, 0.8) + F.licht(22, -64, 13, 12, 0.5) + F.schatten(12, -34, 9, 8, 0.4) + F.licht(100, -66, 8, 10, 0.4) + F.schatten(104, -44, 6, 6, 0.35) +
    F.rinne(32, -72, 36, -46, 3, 0.18) + F.rinne(88, -74, 86, -48, 3, 0.14) + F.schatten(11, -68, 3, 2.4, 0.45) + F.rinne(34, -38, 40, -50, 1.4, 0.3) +
    `<rect x="0" y="-50" width="122" height="30" fill="${T.lg("gelb", [[0, "#d9cba8", 0], [1, "#c8b890", 0.5]])}"/>` +
    F.schatten(SF_HCX + 1, -25.4, 5, 2, 0.7) + F.schatten(SF_VCX, -22, 5, 2, 0.7) + F.schatten(112, -72, 6, 8, 0.5, 20) + F.schatten(108, -84, 5, 3, 0.4) +
    haare2(T, vlies, 70, (x, y) => (y > -60 ? 95 : 70 + T.rnd() * 40), 0.9, { farben: [["#fffdf6", 1, 0.06, 0.6], ["#a89a7c", 0.6, 0.05, 0.4]], streuung: 90, kruemmung: 0.5, szene: 0 });
  const vl = stueck(T, dV, wolF, vInnen, { licht: 1.2, dunkel: 0.45, hell: 0.5, hellFarbe: "#fffaf0" });
  const rk = T._clip;
  s += vol(T, "rumpf", 5, relief(vl), { dunkel: 0.4, hell: 0.25 });
  /* Faserspitzen am Vliesrand; Übergang Wolle → schwarzes Kurzhaar als ausgefranster Saum */
  s += saum2(T, vlies.filter((p, i) => i % 2 === 0), 150, (x, y) => (y < -70 ? -100 + (x - 60) * 0.1 : x < 30 ? 180 : 100), 0.8, "#f6f0e2", 0.07, 0.6, { ab: 0.5, streuung: 70 });
  s += saum2(T, [[15, -26.2], [16.4, -24.6], [19.4, -24], [23.6, -25.2]], 16, 95, 1.4, "#e2d8c2", 0.07, 0.75, { ab: 0.3, streuung: 30 }) +
    saum2(T, [[87.4, -26], [88.4, -22], [91, -21], [94.6, -21.6], [95.6, -24.6]], 16, 95, 1.4, "#e2d8c2", 0.07, 0.75, { ab: 0.3, streuung: 30 });
  const kopf = K([[-1, -2.4], [5, -4], [10, -4.8], [16, -4.6], [21, -3.4], [24.6, -1.2], [26.4, 1.8], [27, 5], [26.4, 7.6], [25.4, 9], [24.8, 9.6], [24.4, 10.6],
    [22.8, 11.6], [19.6, 11.6], [16, 11.2], [12, 12.6], [8, 14.6], [4.6, 15.8], [1.6, 14], [-0.6, 9], [-1.6, 4]]);
  const kInnen = fellZone(T, haarS, kopf, W, 0.8) +
    /* Satinglanz auf Nasenrücken und Jochbogen; Ganasche mit Kieferwinkel und Kernschatten; Kaumuskel; Tränengrube */
    F.licht(...P(14, -2.6), 9, 1.4, 0.35, W) + F.licht(...P(20.4, -1.8), 5, 0.9, 0.35, W - 8) + F.licht(...P(9, 3.4), 3, 0.8, 0.25, W) +
    F.licht(...P(8, 8), 4, 3, 0.22, W) + F.schatten(...P(7, 13.4), 6, 2, 0.55, W) + F.licht(...P(4.4, 14.4), 2, 0.8, 0.25, W + 40) + F.schatten(...P(1, 9), 2.4, 5, 0.45, W) +
    F.kante(...P(10, 4.6), ...P(18, 4.4), 0.7, 0.3) + F.rinne(...P(10.6, 6), ...P(18, 5.8), 0.7, 0.35) + F.schatten(...P(19, 10.2), 6, 1.2, 0.45, W) +
    F.schatten(...P(11.6, 3.6), 1.6, 0.9, 0.65, W - 20);
  s += vol(T, "kopf", 2.2, stueck(T, kopf, T.lg("kopf", [[0, "#302822"], [1, "#16120f"]]), kInnen, { licht: 0.8, dunkel: 0.5, hell: 0.5, hellFarbe: "#8a7e74", q: 0.05 }), { dunkel: 0.45, hell: 0.25 });
  /* Wollkragen hinter dem Kiefer (saubere Kragenlinie) */
  s += saum2(T, K([[-0.6, 4], [0, 10], [2, 14]]), 30, W + 180, 1.2, "#f2ecde", 0.07, 0.75, { ab: 0.7, streuung: 30 });
  /* Nase und Maul: schräges Komma-Nasenloch mit hellem Nasenflügel, Philtrum, gespaltene Oberlippe, Maulspalte mit
     leicht ansteigendem Mundwinkel, Kinnwölbung, Tasthaare */
  s += form(K([[23.8, 1.6], [25.6, 2], [26.2, 3.6], [25.6, 5.4], [24.8, 4], [24, 3]]), "#050302", "", 0.05);
  s += F.kante(...P(23.4, 1), ...P(26.6, 3.2), 0.4, 0.5) + F.rinne(...P(26.6, 5.6), ...P(25.6, 8.4), 0.3, 0.6);
  s += strich(K([[24.8, 9.4], [22, 9.8], [19.6, 9.2]]), "#000", 0.16, 0.7, 0.05) + F.licht(...P(22.4, 11), 1.6, 0.6, 0.3, W);
  s += tasthaare(T, K([[21, 10], [24, 9.4], [26, 7.4]]), 5, 1.2, W + 50, "#6a6058", 0.03);
  /* Auge: +15 %, Bernstein, rechteckige Pupille, Augenbogen-Glanz, feuchtes Unterlid, Karunkel */
  const A = P(8.4, 1.2);
  s += auge2(T, F, A[0], A[1], 1.5, { winkel: 26, iris: "#c4943e", iris2: "#5a3a10", hoehe: 0.64, pupBreite: 0.72, wimpern: 12, wl: 0.35, wr: -60, wf: "#1a1612", haut: "#8a7e74", mulde: 0.4, licht: 0.8 });
  /* Wollkappe: Polster aus Vliesstapeln zwischen den Ohren, Rand läuft in schwarzes Kurzhaar aus, Unterkante im Schatten */
  const schopf = lockig(K([[-2.4, -2.6], [0.4, -5.2], [3.6, -5.8], [6, -4.6], [3.6, -3.4], [0.6, -2.2]]), 0.35, T.rnd);
  s += relief(stueck(T, schopf, T.lg("schopf", [[0, "#efe8d6"], [0.7, "#d8ceb8"], [1, "#9a9080"]], 0, 0, 0.3, 1), "", { licht: 0, q: 0.05 }));
  s += saum2(T, K([[-1.6, -3], [1.4, -5.2], [4.4, -5.6], [6, -4.6]]), 16, W - 120, 0.6, "#f6f0e2", 0.05, 0.6, { ab: 0.3, streuung: 60 }) +
    saum2(T, K([[0.6, -2.2], [3.6, -3.4], [6, -4.6]]), 16, W + 20, 0.7, "#2a2420", 0.05, 0.7, { ab: 0.5, streuung: 30 });
  /* nahes Ohr: glockenförmig, lang (≈ 50 % Kopflänge), seitlich abstehend, Spitze ≈ 20° unter der Waagerechten;
     samtschwarz mit breitem mattem Glanz; Innenseite nur als schmale Sichel an der Unterkante; Knorpelfalte am Grund */
  const ON = P(3.4, 0.2), OW = 162;
  s += imRumpf(rk, F.schatten(ON[0] - 5, ON[1] + 2.6, 6, 2, 0.45, 20));
  s += stueck(T, dreh(ohrL, ON[0], ON[1], OW), T.lg("ohr", [[0, "#2c2620"], [1, "#14110e"]]),
    form(dreh([[3, -0.9], [6.4, -1.3], [10, -1.6], [13.4, -1.2], [13.8, -2], [11.4, -2.7], [7.4, -2.2], [3.6, -1.4]], ON[0], ON[1], OW), T.lg("ohri", [[0, "#3a302c"], [0.5, "#86726a"], [1, "#6a5a52"]], 0, 0, 1, 0), "", 0.05) +
    F.licht(...dreh([[7.6, 1.2]], ON[0], ON[1], OW)[0], 5.4, 0.9, 0.4, OW - 180) + F.schatten(...dreh([[8, -0.6]], ON[0], ON[1], OW)[0], 5, 0.5, 0.5, OW - 180) +
    F.rinne(...dreh([[1, -0.6], [3.4, 0.6]], ON[0], ON[1], OW).flat(), 0.3, 0.5),
    { licht: 0, q: 0.05 });
  const kb = T.box(kopf);
  return { svg: s, box: [2, -99, 140, 0], fuesse: [SF_HCX + 2, SF_HCX + 9, SF_VCX - 4, SF_VCX + 3], kopf: [kb[0] - 14, kb[1] - 6, kb[2] + 2, kb[3] + 2] };
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
/* PROPORTIONEN Ziege (Bunte Deutsche Edelziege, Geiß) in Kopflängen (KL = 24 cm, Genick–Maulspitze):
     Widerristhöhe 3,3 KL (80 cm)        Kruppenhöhe am Hüfthöcker 3,4 KL (82)   Sitzbeinhöcker 3,1 KL (75)
     Rumpflänge Bug–Sitzbein 3,6 KL (86)  Brusttiefe 1,55 KL (37; Brustboden 43 cm über dem Boden = 54 % WH)
     Ellbogen 1,8 KL (44)  Vorderfußwurzel 0,88 KL (21)  Fesselgelenk 0,4 KL (9,5)
     Kniegelenk 1,9 KL (46, auf der Bauchlinie)  Fersenbeinhöcker 1,17 KL (28 = 35 % WH)  Unterschenkel 50–55° nach hinten-unten
     Bugspitze 0,25 KL vor dem Vorderbein, 2,3 KL hoch (56); Hals 45° steigend, Halstiefe am Ansatz 1,2 KL, an der Kehle 0,5 KL
     Genick 1 KL über dem Widerrist (104); Kopfwinkel 55° zur Waagerechten
     Abstand Röhre vorn–hinten 2,5 KL (60); Bauch am tiefsten hinter dem Ellbogen, Flanke vor dem Knie 3–4 cm aufgezogen */
const Z_HCX = 22, Z_VCX = 82;
const Z_H = bildeBein(HB_TPL, Z_HCX, [[-23, 0.38], [-62, 0.42], [-105, 0.48], [-140, 0.6]], [[0, 0], [-8.4, -4.2], [-23, -9.5], [-62, -28], [-105, -46], [-127, -60], [-140, -68]]);
const Z_V = bildeBein(VB_TPL, Z_VCX, [[-23, 0.38], [-50, 0.42], [-97, 0.55], [-110, 0.6]], [[0, 0], [-8.4, -4.2], [-23, -9.5], [-50, -21], [-97, -44], [-110, -52]]);
function ziege(T) {
  FEIN = T.fein;
  const F = flecken(T, "#ffe2b8", "#1a0c04");
  const U = ' gradientUnits="userSpaceOnUse"';
  /* Licht getrennt von der Zeichnung: Rehbraun mit Glanzband oben, Terminator ≈ 60 %, Kernschatten, Reflexlicht am Bauch */
  const fell = T.lg("fell", [[0, "#c48c52"], [0.22, "#b47a44"], [0.5, "#a06838"], [0.7, "#8a5630"], [0.86, "#9a643c"], [1, "#7a4c2c"]], 0, -84, 0, -40, U);
  const fern = T.lg("fern", [[0, "#5a3a20"], [0.4, "#2e2016"], [1, "#221a14"]], 0, -56, 0, 0, U);
  const schwarz = "#1e1712";
  const dH = fellMuster(T, "d", 1.5, 80, [["#3a1e0c", 1, 0.05, 0.2]], 8, 6);
  const hH = fellMuster(T, "h", 1.4, 44, [["#f2c890", 1, 0.05, 0.22]], 8, 6);
  const sH = fellMuster(T, "s", 1.4, 44, [["#7a5a40", 1, 0.05, 0.22]], 8, 6);
  let s = "";
  const klZ = (cx, f) => klaue3(T, F, cx + 0.3, 5.8, 3.6, f, "#2a201a", "#3a2e28") + afterklaue2(T, cx - 0.9, -5.2, 0.7, "#1a1512", "#2a201a");
  /* ferne Beine: parallel versetzt, oben verdeckt, 10–15 % dunkler und kühler */
  const fernBein = (vorn, dx) => {
    const cx = (vorn ? Z_VCX : Z_HCX) + dx;
    const pts = verschiebe(vorn ? Z_V.h.concat(Z_V.v) : Z_H.h.slice(1).concat(Z_H.v), dx).concat(vorn ? [[cx + 7, -52], [cx - 6, -52]] : [[cx + 15, -52], [cx - 6, -56]]);
    return stueck(T, pts, fern, fellZone(T, sH, pts, 92, 0.8) + F.schatten(cx + (vorn ? 0 : 6), -44, 6, 8, 0.6) + F.licht(cx - 1.4, -16, 0.6, 5, 0.25),
      { licht: 0.7, dunkel: 0.5, hell: 0.25 });
  };
  s += vol(T, "bein", 1.4, fernBein(false, 6), { hell: 0.15 }) + klZ(Z_HCX + 6, "#2a2420");
  s += vol(T, "bein", 1.4, fernBein(true, -6), { hell: 0.15 }) + klZ(Z_VCX - 6, "#2a2420");
  /* Umriss nach der Tabelle: Widerrist leicht erhaben, Rücken mit sanfter Senke, Hüfthöcker als Buckel, Kruppe fällt 15° zum
     Sitzbeinhöcker; darunter Hinterbacke, Kniekehle, Unterschenkel nach vorn eingezogen, Fersenbeinhöcker; Euter zwischen den
     Hinterbeinen (nahes Bein davor); Bauch tief und gerundet, Flanke aufgezogen; Bugspitze vor dem Bein; Hals mit Kehle */
  const euterUnten = [[30, -33.8], [33.4, -32.4], [37, -32.2], [40.6, -33.6], [43.2, -36.6], [44.8, -40.6], [46.6, -44]];
  const keule = [[14, -75.4], [12.8, -72.4], [12.6, -68.6], [13.4, -64.6], [14.8, -62], [17, -56], [19, -49.4], [20.4, -43], [20.8, -38], [20.6, -34.6]].concat(Z_H.h.slice(6));
  const rumpf = keule.concat(Z_H.v.slice(0, 12), euterUnten,
    [[50, -45.4], [54, -44.2], [60, -42.8], [66, -42], [72, -42.2], [75.6, -43.2]], Z_V.h, Z_V.v,
    [[91, -45.6], [94.4, -48.4], [96.8, -52.4], [98, -57], [98, -61.6], [98.2, -67], [98.8, -73], [99.8, -79], [101, -85], [102.2, -90.4], [103, -94.6],
      [103.4, -99], [100, -104.2], [97, -102.6], [93, -98.4], [89, -93.4], [85.4, -88.6], [82, -84.6], [78.6, -82.4], [72, -80.8], [64, -80], [56, -80.2],
      [48, -80.8], [42, -81.8], [37, -83], [33, -82.8], [27, -80.6], [20.4, -77.8], [15.6, -76]]);
  const wuchs = richtung([[12, 92], [30, 100], [36, 165], [74, 166], [82, 100], [98, 125]]);
  const euter = [[20, -56], [32, -50], [42, -47], [46.6, -44]].concat(euterUnten.slice().reverse(), [[26, -38], [20, -44]]);
  const hinterbein = keule.slice(3).concat(Z_H.v, [[39, -48], [32, -55], [16, -62]]);
  const zHinten = [[0, -86], [38, -86], [42, -60], [30, -30], [10, -30]];
  const zRumpf = [[38, -86], [78, -86], [78, -46], [40, -46], [42, -60]];
  const zVorn = [[78, -86], [104, -110], [104, -86], [94, -50], [78, -46]];
  /* BDE-Zeichnung: dunkler Bauch nur als schmaler Saum (6–7 cm) mit unregelmäßiger, schräger Grenze; Vorderbeine dunkel ab
     Ellbogen, Hinterbeine ab Mitte Unterschenkel; Übergang weich (keine Haarfransen auf der Farbgrenze) */
  const bauchDunkel = `<path d="M30 -37C34 -40 38 -43.4 43 -46.6C47 -48.6 50 -47.6 54 -48.8C58 -50 61 -48.6 65 -49.6C69 -50.6 72 -49.2 76 -49.4C80 -49.6 84 -48 88 -49L92 -44L90 -30L74 -27L74 2L92 2L92 -26L36 -26L36 -30C32 -36 26 -40 22 -40C18 -40 14 -38 12 -36L10 2L40 2L40 -26Z" fill="${schwarz}" opacity=".88"/>`;
  const innen =
    fellZone(T, dH, zHinten, 96) + fellZone(T, dH, zRumpf, 168) + fellZone(T, dH, zVorn, 122) + fellZone(T, sH, [[10, -36], [94, -36], [94, 0], [10, 0]], 90) +
    fellZone(T, hH, [[10, -84], [80, -86], [106, -108], [100, -92], [78, -70], [20, -68]], 165, 0.9) +
    /* Licht: Glanzband, Schulterblatt als schräge beleuchtete Fläche, Bugspitze, weiche Rippenwellen, Hüft- und Sitzbeinhöcker */
    rumpfLicht(F, 12, 94, -81, -43, 0.5) + F.licht(56, -78, 24, 2.2, 0.35) +
    F.licht(86, -70, 4, 10, 0.3, 20) + F.rinne(80, -78, 77, -54, 1.6, 0.3) + F.licht(96, -54, 1.8, 2.6, 0.45) + F.schatten(78, -46, 4, 3, 0.4) +
    [54, 61, 68].map((x) => F.schatten(x, -62, 2.2, 9, 0.12, 12)).join("") +
    F.licht(36, -83.6, 2.6, 1.1, 0.5, -10) + F.schatten(39, -79, 3, 2.6, 0.35) + F.licht(13.4, -74, 0.8, 1.6, 0.45) + F.rinne(16.4, -66, 19, -48, 1.4, 0.25) +
    F.rinne(38, -46, 42, -58, 1, 0.35) + F.licht(40, -54, 1, 3, 0.25, 25) +
    /* Euter: deckend, dunkel pigmentiert, Licht oben, zwischen den Hinterbeinen; nahes Hinterbein davor */
    form(euter, T.lg("eu", [[0, "#6a4a3a", 0], [0.4, "#7c5c52", 1], [1, "#5e4440", 1]]), "", 0.2) +
    F.licht(40, -38, 3.4, 1.8, 0.35) + F.schatten(36, -32.6, 7, 1.2, 0.45) + F.schatten(31, -40, 3, 5, 0.4) +
    form(hinterbein, fell, "", 0.1) + fellZone(T, dH, hinterbein, 92) + strich(Z_H.v.slice(9), "#3a2414", 0.5, 0.3) +
    weich(T, bauchDunkel, 1.6) +
    /* Aalstrich: Widerrist/Lende breit, Hals schmal, zum Schwanz auslaufend; 0,5 cm innerhalb der Kontur, Unterkante weich */
    weich(T, form([[99.6, -103.4], [96.6, -101.8], [92.6, -97.6], [88.6, -92.6], [85, -87.8], [81.4, -83.4], [74, -81.2], [64, -80.6], [54, -80.8], [44, -81.8],
      [37, -83.2], [32, -83], [26, -80.8], [20, -78], [22, -77.4], [27, -79.4], [33, -81.2], [38, -81.2], [46, -79.6], [56, -78.4], [66, -78.4], [75, -79.6],
      [82.6, -82.2], [86.4, -86.6], [90, -91.4], [93.6, -96], [97.4, -100.2]], schwarz, ` opacity=".8"`, 0.2), 0.4) +
    /* Läufe: Zylinderlicht, Gelenke, Sehne; Rumpfschatten auf den Beinansätzen */
    [Z_HCX, Z_VCX].map((cx) => F.licht(cx - 1.4, -16, 0.7, 5, 0.35) + F.rinne(cx - 0.2, -18, cx - 0.2, -11, 0.35, 0.4)).join("") +
    F.licht(Z_HCX - 3.4, -28.4, 0.6, 0.9, 0.4) + F.licht(Z_VCX - 2.6, -21.6, 0.6, 0.9, 0.35) + F.kante(Z_HCX - 1.6, -37, Z_HCX - 2.8, -30, 0.45, 0.4);
  s += vol(T, "rumpf", 4, stueck(T, rumpf, fell, innen, { licht: 1.1, dunkel: 0.5, hell: 0.5, hellFarbe: "#ffe2b8", q: T.fein ? 0.1 : 0.5 }), { dunkel: 0.45, hell: 0.2, licht: "#ffd8a0" });
  const rk = T._clip;
  /* Silhouette mit Haarspitzen gebrochen: Rückenkamm (leicht aufgestellt), Bauch, Keule („Hosen“), Kehle */
  s += saum2(T, [[15.6, -76], [27, -80.6], [37, -83], [48, -80.8], [64, -80], [78.6, -82.4], [85.4, -88.6], [93, -98.4], [97, -102.6]], 80, wuchs, 2, schwarz, 0.06, 0.7, { ab: 0.15, streuung: 18 });
  s += saum2(T, [[50, -45.4], [54, -44.2], [60, -42.8], [66, -42], [72, -42.2]], 24, 100, 2.2, schwarz, 0.06, 0.7, { ab: 0.2, streuung: 24 });
  s += saum2(T, keule.slice(1, 7), 24, 115, 2.2, "#5a3a20", 0.06, 0.65, { ab: 0.2 });
  s += saum2(T, [[98, -61.6], [98.2, -67], [98.8, -73], [99.8, -79], [101, -85]], 18, 160, 1.6, "#8a5428", 0.05, 0.6, { ab: 0.2 });
  s += klZ(Z_HCX, "#3a332e") + klZ(Z_VCX, "#3a332e");
  /* Zitzen: zwei Kegel, leicht nach vorn-unten; ferne versetzt, dunkler; Glanzkante */
  const zitze = (x, y, f, k) => stueck(T, dreh([[-1.1, 0], [1.1, 0], [0.8, 2.8], [0.5, 4], [-0.5, 4], [-0.8, 2.8]], x, y, -12), f,
    F.kante(...dreh([[-0.6, 0.4], [-0.4, 3.4]], x, y, -12).flat(), 0.3, 0.5 * k) + F.schatten(...dreh([[0, 3.7]], x, y, -12)[0], 0.8, 0.6, 0.4), { licht: 0, q: 0.05 });
  s += zitze(38.6, -33.4, "#5e4440", 0.4) + zitze(35.2, -33, "#7c5c52", 1);
  /* Schwanz: kurz, flach, breite Basis, ≈ 50° aufgerichtet; Körperfarbe mit dunkler Mittellinie (Aalstrich), Ränder als Haarfransen */
  const schw = [[21, -77.6], [18.4, -77.6], [16.2, -79.2], [14.8, -81.6], [14.2, -84.2], [15.2, -84.8], [16.8, -82.6], [18.8, -80.8], [21.6, -79.6]];
  s += stueck(T, schw, "#7e5030", weich(T, form([[20.8, -78.6], [17.8, -79.8], [15.6, -82.4], [14.8, -84.4], [16.2, -83.2], [18.4, -81], [21, -79.6]], schwarz, ` opacity=".7"`, 0.05), 0.3), { licht: 0, q: 0.05 });
  s += saum2(T, [[21.4, -79.6], [18.8, -80.8], [16.8, -82.6], [15.2, -84.8]], 26, -100, 1.6, "#3a2414", 0.05, 0.85, { ab: 0.3, streuung: 40 }) +
    saum2(T, [[20.6, -77.6], [18.4, -77.6], [16.2, -79.2], [14.8, -81.6], [14.2, -84.2]], 26, -170, 1.4, "#6a4224", 0.05, 0.8, { ab: 0.3, streuung: 40 });
  s += imRumpf(rk, F.schatten(19, -76.4, 3, 1.6, 0.45, -20));
  /* Kopf: gerades Profil, Stirnwölbung; 55° geneigt, 24 cm; Kieferwinkel unter dem Ohr, Kehlgang, Kinn */
  const G = [100, -104], W = 55, K = (pts) => dreh(pts, G[0], G[1], W), P = (x, y) => K([[x, y]])[0];
  const kopf = K([[-1, -2.4], [4, -3.9], [9, -3.6], [15, -2.8], [20, -1.6], [23, 0.2], [24.4, 2.6], [24.4, 5], [23.6, 6.4], [22.6, 7], [22.2, 7.8], [22.4, 8.6],
    [21, 9.8], [18, 9.8], [14.6, 9.8], [10.6, 10.8], [6.8, 12.4], [3.4, 12.6], [0.6, 10.6], [-1.4, 4.4]]);
  s += imRumpf(rk, F.schatten(...P(2, 12), 4, 3, 0.55, W) + F.schatten(...P(-2.4, 5), 2.4, 5, 0.4, W));
  const kInnen = fellZone(T, dH, kopf, W - 180, 0.9) +
    /* dunkler Gesichtsstreifen Auge → Maulwinkel (weich), Maul dunkelbraun, haarlose Haut um die Nüster */
    F.rinne(...P(10, 2.8), ...P(16, 4.6), 1.1, 0.5) + F.rinne(...P(15, 5), ...P(21.4, 6.4), 1.2, 0.55) +
    F.licht(...P(13, -1.6), 7, 1.3, 0.45, W) + F.licht(...P(7, 6.6), 3.6, 2.6, 0.3, W) + F.schatten(...P(7, 11), 4, 1.4, 0.55, W) + F.licht(...P(4, 11.6), 1.6, 0.6, 0.3, W + 40) +
    F.schatten(...P(1.2, 7), 1.6, 3.6, 0.45, W) + F.kante(...P(9.4, 4.4), ...P(15, 4.2), 0.5, 0.35) + F.schatten(...P(18, 9), 3.4, 0.9, 0.45, W) +
    `<ellipse transform="translate(${folge([z(P(22.4, 4)[0], 0.1), z(P(22.4, 4)[1], 0.1)])})rotate(${W})" rx="2.2" ry="2.6" fill="#a87a62" opacity=".3"/>` +
    F.licht(...P(22.6, 8.8), 1.2, 0.6, 0.3, W);
  s += vol(T, "kopf", 2, stueck(T, kopf, fell, kInnen, { licht: 0.8, dunkel: 0.5, hell: 0.4, hellFarbe: "#ffe2b8", q: 0.05 }), { dunkel: 0.45, hell: 0.2 });
  /* Nüster: schräges Komma, oben offen, feuchter Glanz */
  s += form(K([[21.2, 1.4], [23, 1.2], [23.8, 2.4], [23.4, 4.4], [22.8, 5.4], [22.6, 3.8], [21.8, 2.6]]), "#0a0604", "", 0.05) + F.licht(...P(23.4, 1.8), 0.3, 0.2, 0.8) +
    F.kante(...P(20.8, 0.8), ...P(23.8, 1.8), 0.3, 0.45);
  /* Oberlippe leicht überstehend; Maulspalte leicht durchhängend; Unterlippe/Kinn eigene Rundung */
  s += strich(K([[23, 5.8], [22.6, 6.8], [22, 7.2]]), "#000", 0.14, 0.55, 0.05) + strich(K([[22, 7.4], [20, 8], [17.6, 7.8]]), "#000", 0.16, 0.6, 0.05) + F.licht(...P(20.4, 9.2), 1.4, 0.5, 0.3, W);
  s += tasthaare(T, K([[19, 8.2], [21.6, 7.6], [23.4, 6]]), 5, 1.2, W + 40, "#2a1a10", 0.03);
  /* Bart am Kinn (weiter vorn): 7 spitz zulaufende Strähnen aus feinen Haaren, leicht nach vorn, Spitzen gebrochen,
     Licht auf den Spitzen, Schatten zwischen den Strähnen und auf der Kehle */
  s += imRumpf(rk, F.schatten(...P(16, 12), 3, 4, 0.5, 10));
  for (let i = 0; i < 7; i++) {
    const b0 = P(16.6 + i * 0.8, 9.6 + Math.abs(i - 3) * 0.06), L = 7.6 + ((i * 5) % 4) * 1, w = 96 - i * 2.4 + (T.rnd() - 0.5) * 6;
    const c = Math.cos(w * Math.PI / 180), si = Math.sin(w * Math.PI / 180), br = 0.5 + (i % 2) * 0.22;
    const tip = [b0[0] + c * L, b0[1] + si * L], m = [b0[0] + c * L * 0.5, b0[1] + si * L * 0.5];
    s += stueck(T, [[b0[0] - br, b0[1]], [b0[0] + br, b0[1]], [m[0] + br * 0.9, m[1]], tip, [m[0] - br * 0.9, m[1]]], i % 2 ? "#2a1a10" : "#1e140c",
      haare2(T, [[b0[0] - br, b0[1]], [b0[0] + br, b0[1]], tip], 10, w, L * 0.6, { farben: [["#8a6040", 1, 0.05, 0.6]], streuung: 6, szene: 0 }), { licht: 0, q: 0.05 });
    s += saum2(T, [m, tip], 4, w, 1.2, "#a07850", 0.04, 0.6, { ab: 0.3, streuung: 20 });
  }
  /* Auge: bernsteingelb, rechteckige Pupille; Lidwülste, Augenbogen mit Lichtkante, Tränenwinkel */
  const A = P(8.4, 1);
  s += auge2(T, F, A[0], A[1], 1.6, { winkel: 22, iris: "#d4a440", iris2: "#7a5414", hoehe: 0.64, pupBreite: 0.68, wimpern: 11, wl: 0.45, wr: 20, wf: "#1a120a", haut: "#ffd8a8", mulde: 0.4, licht: 0.85 });
  /* Hörner (Geiß): säbelförmig nach hinten; Basis auf dem Schädel sichtbar, mit Haar überdeckt und Ringschatten; Wülste an der
     Basis kräftig (Licht-/Schattenkante), zur Spitze schwächer; Kiel als Lichtkante; fernes Horn versetzt, divergierend, dunkler */
  const hornA = [[1.3, 0.4], [1.2, -5.6], [-0.8, -11.6], [-4.4, -16.4], [-9.4, -19.4]], hornB = [[-1.6, 0.6], [-2.2, -6.6], [-4.2, -12.6], [-7.6, -17], [-9.4, -19.4]];
  const horn = (B, f, d, g) => {
    const R = (p) => dreh([p], B[0], B[1], g)[0];
    const pts = [[1.3, 0.4], [1.2, -5.6], [-0.8, -11.6], [-4.4, -16.4], [-9.4, -19.4, 1], [-7.6, -17], [-4.2, -12.6], [-2.2, -6.6], [-1.6, 0.6]].map((p) => R(p).concat(p[2] ? [1] : []));
    let ringe = "";
    if (T.fein) for (let i = 1; i < 11; i++) {
      const t = i / 12, a2 = punktAuf(hornA, t), b2 = punktAuf(hornB, t);
      const p0 = R([b2[0], b2[1] + 0.3]), p1 = R([(a2[0] + b2[0]) / 2 + 0.2, (a2[1] + b2[1]) / 2 + 0.5]), p2 = R([a2[0], a2[1] + 0.2]);
      ringe += strich([p0, p1, p2], "#000", 0.26 - t * 0.16, 0.5 - t * 0.32, 0.05) + strich([[p0[0], p0[1] - 0.35], [p1[0], p1[1] - 0.35], [p2[0], p2[1] - 0.35]], "#fff", 0.12 - t * 0.08, 0.25 - t * 0.18, 0.05);
    }
    return stueck(T, pts, T.lg("horn" + d, [[0, f], [0.7, "#7d7366"], [1, "#8a8074"]], 0, 1, 0.4, 0), ringe +
      F.kante(...R([0.8, -2]), ...R([-2.4, -13]), 0.45, 0.45) + F.schatten(...R([-1, -1]), 1.6, 1.4, 0.4), { licht: 0, q: 0.05 });
  };
  const HB0 = P(3.6, -2.4);
  s += horn([HB0[0] - 2.2, HB0[1] + 1.2], "#241e18", "f", -14) + horn(HB0, "#3a332c", "n", 0);
  s += saum2(T, [[HB0[0] - 1.8, HB0[1] + 0.8], [HB0[0] + 1.6, HB0[1] + 0.4]], 14, -84, 1, "#9a6436", 0.05, 0.85, { ab: 0.7, streuung: 30 }) +
    F.schatten(HB0[0], HB0[1] - 0.6, 1.6, 0.6, 0.45);
  /* Stehohr: schmaler, Spitze ausgezogen, ohne Rand; Ansatz unter/hinter dem Hornansatz; Innenseite hell mit Haaren vom Rand */
  const OX = P(2.6, 2.6), OW = -36;
  const ohr = dreh([[0, -1.3], [4, -2.4], [9, -2.6], [13, -1.4], [15, 0.1], [12.4, 1.4], [8, 2], [3.4, 1.8], [0, 1.3]], OX[0], OX[1], OW);
  const ohrI = dreh([[1.6, 0.2], [5, -1.8], [9.6, -1.9], [13.4, -0.8], [14.2, 0.1], [12, 1.1], [7.6, 1.6], [3, 1.4]], OX[0], OX[1], OW);
  s += imRumpf(rk, F.schatten(OX[0] - 1, OX[1] - 1.6, 3.6, 2, 0.5));
  s += stueck(T, ohr, T.lg("ohr", [[0, "#7a4a26"], [1, "#a86e3c"]]), form(ohrI, T.lg("ohri", [[0, "#b8906e"], [1, "#d4b090"]], 0, 0, 1, 0), "", 0.05) +
    haare2(T, ohrI, 22, OW + 10, 1.4, { farben: [["#f4e4cc", 1, 0.04, 0.7]], streuung: 30, szene: 0.3 }) + F.schatten(...dreh([[3, 0.6]], OX[0], OX[1], OW)[0], 1.6, 1, 0.45) +
    F.licht(...dreh([[8, -1.8]], OX[0], OX[1], OW)[0], 4, 0.5, 0.35, OW), { licht: 0, q: 0.05 });
  s += saum2(T, dreh([[3.4, 1.8], [8, 2], [12.4, 1.4]], OX[0], OX[1], OW), 14, OW + 90, 0.9, "#e8d0b0", 0.04, 0.7, { ab: 0.3, streuung: 30 });
  const kb = T.box(kopf);
  return { svg: s, box: [10, -123, 115, 0], fuesse: [Z_HCX + 1, Z_HCX + 7, Z_VCX - 3, Z_VCX + 3], kopf: [kb[0] - 8, kb[1] - 22, kb[2] + 4, kb[3] + 12] };
}

module.exports = [
  { id: "ziege", de: "die Ziege", syl: "ZIE-ge", it: "la capra", itSyl: "CA-pra", en: "goat",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 1.01, hoehe: 1.21, zeichne: ziege },
  { id: "schaf", de: "das Schaf", syl: "SCHAF", it: "la pecora", itSyl: "PE-co-ra", en: "sheep",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 1.36, hoehe: 0.97, zeichne: schaf },
  { id: "schwein", de: "das Schwein", syl: "SCHWEIN", it: "il maiale", itSyl: "ma-IA-le", en: "pig",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 1.83, hoehe: 0.9, zeichne: schwein },
  { id: "esel", de: "der Esel", syl: "E-sel", it: "l'asino", itSyl: "A-si-no", en: "donkey",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 1.43, hoehe: 1.62, zeichne: esel },
  { id: "kalb", de: "das Kalb", syl: "KALB", it: "il vitello", itSyl: "vi-TEL-lo", en: "calf",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 1.19, hoehe: 1.02, zeichne: kalb },
  { id: "kuh", de: "die Kuh", syl: "KUH", it: "la vacca", itSyl: "VAC-ca", en: "cow",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 2.4, hoehe: 1.53, zeichne: kuh },
  { id: "pferd", de: "das Pferd", syl: "PFERD", it: "il cavallo", itSyl: "ca-VAL-lo", en: "horse",
    gruppe: "Bauernhof", lebensraum: "Bauernhof", laenge: 2.67, hoehe: 2.33, zeichne: pferd },
];
