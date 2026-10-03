/* =====================================================================
   TIER-BIBLIOTHEK — GRUPPE EISZEIT (FASSUNG 854, MASSSTAB 2)
   ---------------------------------------------------------------------
   XANDER: „dass du das Mammut noch mal machst" – „fast fotorealistisch …
   jedes einzelne Haar … Augen, Wimpern … Licht und Schatten plastisch massiv".
   Mammut, Säbelzahnkatze, Wollnashorn, Riesenhirsch, Höhlenbär – nach
   Funden, gefrorenen Kadavern (Yuka, Ljuba, Sasha) und Höhlenmalereien
   (Chauvet, Rouffignac, Lascaux, Cougnac).
   Zentimeter, Blick nach rechts, Boden y = 0, Licht von links oben.
   Filter (Rauschen, Relief) nur bei T.fein – in Szenen bleibt es schnell.
   ===================================================================== */
"use strict";

/* ---------- eigene Werkzeuge (knappe Zahlen = kleine SVGs) ---------- */
let GEN = 1; // 1 = ganze Zentimeter, 10 = Millimeter (kleinere Tiere)
const R = (n) => Math.round(n * GEN) / GEN;
/* Zahlenfolge ohne überflüssige Leerzeichen („12-34" statt „12 -34") */
const zf = (...a) => a.map((v, i) => { const s = String(R(v)); return i && s[0] !== "-" ? " " + s : s; }).join("");
const UB = ' gradientUnits="userSpaceOnUse"';

function glatt(pts, zu = true, sp = 1) {
  const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = "M" + zf(pts[0][0], pts[0][1]);
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6 * sp, p1[1] + (p2[1] - p0[1]) / 6 * sp];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6 * sp, p2[1] - (p3[1] - p1[1]) / 6 * sp];
    d += "C" + zf(c1[0], c1[1], c2[0], c2[1], p2[0], p2[1]);
  }
  return d + (zu ? "Z" : "");
}
function imPoly(x, y, p) {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    if ((p[i][1] > y) !== (p[j][1] > y) && x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) c = !c;
  }
  return c;
}
/* Punkt bei Anteil t (0..1) entlang einer Linie */
function entlang(L, t) {
  const seg = []; let ges = 0;
  for (let i = 1; i < L.length; i++) { const l = Math.hypot(L[i][0] - L[i - 1][0], L[i][1] - L[i - 1][1]); seg.push(l); ges += l; }
  let s = t * ges;
  for (let i = 0; i < seg.length; i++) {
    if (s <= seg[i] || i === seg.length - 1) { const u = seg[i] ? Math.min(1, s / seg[i]) : 0; return [L[i][0] + (L[i + 1][0] - L[i][0]) * u, L[i][1] + (L[i + 1][1] - L[i][1]) * u]; }
    s -= seg[i];
  }
  return L[L.length - 1];
}
/* Wert einer Linie (nach a sortiert) an der Stelle v: k = 0 → y bei x, k = 1 → x bei y */
function bei(L, v, k = 0) {
  const a = 1 - k, b = k;
  if (v <= L[0][b]) return L[0][a];
  for (let i = 1; i < L.length; i++) if (v <= L[i][b]) { const u = (v - L[i - 1][b]) / (L[i][b] - L[i - 1][b]); return L[i - 1][a] + (L[i][a] - L[i - 1][a]) * u; }
  return L[L.length - 1][a];
}
/* Fransen: zottige Kante (Haarlocken) entlang L. len: Zahl oder f(t). sx: Schwung zur Seite (Anteil von len).
   nach: Richtung der Locken ([0, 1] = nach unten). Täler weich, Spitzen hart. */
function fransen(T, L, n, len, sx = 0, streu = 0.6, nach = [0, 1]) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const tm = (i + 0.5 + (T.rnd() - 0.5) * 0.5) / n;
    out.push(entlang(L, i / n));
    const m = entlang(L, tm), l = (typeof len === "function" ? len(tm) : len) * (1 - streu / 2 + T.rnd() * streu);
    const q = (sx + (T.rnd() - 0.5) * 0.3) * l;
    out.push([m[0] + nach[0] * l + (nach[0] ? 0 : q), m[1] + nach[1] * l + (nach[0] ? q : 0), 1]);
  }
  out.push(entlang(L, 1));
  return out;
}
/* HAAR FÜR HAAR: n Haare in der Fläche poly, Wuchsrichtung winkel in Grad (Zahl oder f(x, y); 0 = rechts, 90 = unten),
   Länge len (Zahl oder f(x, y)). o.farben: [[farbe, anteil, breite, deckkraft], …]. Ein Pfad je Farbe, relative
   Koordinaten (klein). Mit T.fein = false nur ein Teil (o.szene, sonst ein Viertel). */
function H(T, poly, n, winkel, len, o = {}) {
  const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const farben = o.farben || [["#000", 1, 1, 0.4]];
  const summe = farben.reduce((s, f) => s + f[1], 0);
  const eimer = farben.map(() => "");
  const ziel = Math.round(n * (T.fein === false ? (o.szene != null ? o.szene : 0.25) : 1));
  const st = o.streuung != null ? o.streuung : 16, kr = o.kruemmung != null ? o.kruemmung : 0.18;
  for (let i = 0, v = 0; i < ziel && v < ziel * 30; v++) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!imPoly(x, y, poly)) continue;
    i++;
    const a = ((typeof winkel === "function" ? winkel(x, y) : winkel) + (T.rnd() - 0.5) * st) * Math.PI / 180;
    const l = (typeof len === "function" ? len(x, y) : len) * (0.55 + T.rnd() * 0.9);
    const ex = Math.cos(a) * l, ey = Math.sin(a) * l, k = (T.rnd() - 0.5) * 2 * kr * l;
    let u = T.rnd() * summe, j = 0;
    while (j < farben.length - 1 && u > farben[j][1]) { u -= farben[j][1]; j++; }
    eimer[j] += "M" + zf(x, y) + "q" + zf(ex / 2 - Math.sin(a) * k, ey / 2 + Math.cos(a) * k, ex, ey);
  }
  return eimer.map((d, j) => (d ? `<path d="${d}" fill="none" stroke="${farben[j][0]}" stroke-width="${farben[j][2]}" stroke-opacity="${farben[j][3]}" stroke-linecap="round"/>` : "")).join("");
}
/* Körperteil: Pfad einmal (mit id), Füllung, Volumen, geklippte Innenzeichnung, feiner Rand */
function K(T, pts, fill, o = {}) {
  const d = typeof pts === "string" ? pts : glatt(pts, true, o.sp || 1);
  T._n = (T._n || 0) + 1;
  const id = T.id("e" + T._n);
  T.def(`<clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  let s = `<defs><path id="${id}" d="${d}"/></defs><use href="#${id}" fill="${fill}"/>`;
  if (o.vol !== false) s += `<use href="#${id}" fill="${T.VOL()}"/>`;
  if (o.innen) s += `<g clip-path="url(#${id}c)">${o.innen}</g>`;
  if (o.rand !== false) s += `<use href="#${id}" fill="none" stroke="${o.rand || "#000"}" stroke-opacity="${o.randA != null ? o.randA : 0.28}" stroke-width="${o.rw || 0.8}"/>`;
  if (o.d) o.d.push(d);
  return s;
}
const F = (pts, fill, extra = "") => `<path d="${typeof pts === "string" ? pts : glatt(pts)}" fill="${fill}"${extra}/>`;
const LI = (pts, farbe, w, extra = "") => `<path d="${glatt(pts, false)}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-linecap="round"${extra}/>`;
/* weicher Fleck (Licht/Schatten ohne Kante) */
const fleck = (T, cx, cy, rx, ry, farbe, op, dreh = 0) =>
  `<ellipse cx="${R(cx)}" cy="${R(cy)}" rx="${R(rx)}" ry="${R(ry)}"${dreh ? ` transform="rotate(${dreh} ${R(cx)} ${R(cy)})"` : ""} fill="${T.rg("f" + farbe.slice(1) + String(op).replace(".", ""), [[0, farbe, op], [0.55, farbe, op * 0.55], [1, farbe, 0]])}"/>`;
/* Textur (Rauschen) und Relief nur in voller Feinheit */
const TX = (T, d, name, o, winkel, op, box) => (T.fein === false ? "" : T.textur(d, T.rauschen(name, o), winkel, op, box));
const RF = (T, name, o, inhalt) => (T.fein === false ? inhalt : `<g filter="${T.relief(name, o)}">${inhalt}</g>`);
/* Röhre (Stoßzahn, Horn): Mittellinie + Breite am Anfang/Ende */
function rohr(mitte, w0, w1, spitz = true, ex = 0.9) {
  const n = mitte.length, li = [], re = [];
  for (let i = 0; i < n; i++) {
    const a = mitte[Math.max(0, i - 1)], b = mitte[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * Math.pow(i / (n - 1), ex)) / 2;
    li.push([mitte[i][0] - dy / l * w, mitte[i][1] + dx / l * w]);
    re.push([mitte[i][0] + dy / l * w, mitte[i][1] - dx / l * w]);
  }
  const e = mitte[n - 1];
  return [...li, ...(spitz ? [[e[0], e[1], 1]] : []), ...re.reverse()];
}
/* Linie parallel zur Mittellinie (f = Anteil der halben Breite, + = links der Laufrichtung) */
function quer(mitte, w0, w1, f, ex = 0.9) {
  const n = mitte.length;
  return mitte.map((p, i) => {
    const a = mitte[Math.max(0, i - 1)], b = mitte[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * Math.pow(i / (n - 1), ex)) / 2 * f;
    return [p[0] - dy / l * w, p[1] + dx / l * w];
  });
}

/* =====================================================================
   DAS MAMMUT (Wollhaarmammut, Mammuthus primigenius)
   RECHERCHE: Schulterhöhe 2,7–3,4 m (Bullen ~3,2 m), 4–6 t. Hoher, kuppelförmiger
   Schädel (höchster Punkt etwa auf Höhe des Buckels oder knapp darüber), dahinter
   eine deutliche Nackenkerbe, dann der Fett-Buckel über der Schulter und ein steil
   nach hinten abfallender Rücken (Hinterbeine kürzer als Vorderbeine). Stirn fast
   senkrecht, breite Rüsselwurzel zwischen den Stoßzahnscheiden. Kleine Ohren
   (~30 × 17 cm, im Fell versteckt), kurzer Schwanz (~35 cm) mit Haarquaste.
   Stoßzähne bis 4,2 m, erst nach vorn-unten, dann nach oben und innen gedreht.
   Fell: dichte, hellere Unterwolle, darüber Grannenhaare bis 90 cm (lang an Flanken,
   Bauch, Brust = „Rock"), Farbe dunkelbraun bis rotbraun, Spitzen heller
   (Kadaver Yuka, Ljuba). Lange Wimpern wie beim Elefanten. Höhlenbilder
   (Rouffignac, Chauvet): Kuppel – Kerbe – Buckel – Schräge, Rock unter dem Bauch –
   genau diese Silhouette ist die Grundform. Rüsselspitze mit zwei „Fingern"
   (oben lang und schmal, unten breit). Füße rund, Säulenbeine, Zehennägel vorn.
   ===================================================================== */
function mammut(T) {
  GEN = 1;
  const fein = T.fein !== false;
  const fell = T.lg("fell", [[0, "#7a4e2e"], [0.22, "#5e3a20"], [0.6, "#3a2213"], [1, "#1c1108"]], 0, -355, 0, -70, UB);
  const beinF = T.lg("bein", [[0, "#3c2514"], [0.5, "#2c1a0d"], [1, "#1b1007"]], 0, -210, 0, 0, UB);
  const fern = T.lg("fern", [[0, "#24160b"], [1, "#100904"]], 0, -210, 0, 0, UB);
  const haut = T.lg("haut", [[0, "#4a3d36"], [1, "#2a221e"]]);
  const elf = T.lg("elf", [[0, "#f8f0de"], [0.4, "#e6d8b6"], [0.8, "#bfa97f"], [1, "#8a744f"]], 0, 0, 0.2, 1);
  const elfF = T.lg("elff", [[0, "#b8a682"], [1, "#6c5a3f"]], 0, 0, 0.2, 1);
  const DUN = "#100803", MIT = "#3e2412", ROT = "#6e4220", HELL = "#b98048", SPITZ = "#e0ae74";
  let s = "";

  /* Rückenlinie (für Fellrichtung und Haarlänge) */
  const oben = [[30, -196], [29, -222], [46, -244], [96, -266], [160, -289], [224, -313], [268, -327], [302, -332], [328, -325], [348, -311],
    [364, -321], [384, -342], [407, -353], [430, -346], [446, -322], [453, -286], [455, -246], [453, -212]];
  const ruecken = oben.slice(1, 13);
  const tiefe = (x, y) => y - bei(ruecken, Math.max(29, Math.min(407, x)));
  /* Fellrichtung: am Rücken flach nach hinten gekämmt, an den Flanken senkrecht hängend, an Kopf/Brust leicht nach vorn */
  const fluss = (x, y) => {
    const t = tiefe(x, y);
    let a = 97 + 55 * Math.exp(-t / 24);
    if (x > 300 && x < 400 && y > -290) a += 10 * Math.sin((x - 300) / 100 * Math.PI) - 6; // Schulterwirbel
    if (x > 372) a = 84 + 28 * Math.exp(-t / 18);
    return a;
  };
  const laenge = (x, y) => (x > 372 ? 12 + 28 * Math.min(1, Math.max(0, (y + 300) / 120)) : 16 + 40 * Math.min(1, Math.max(0, tiefe(x, y) / 140)));

  /* Bein: Säule mit Ellbogen-/Kniewulst; v: Versatz des Fußes (Schritt) */
  const bein = (x0, x1, top, knie, v = 0) => [[x0 - 6, top], [x1 + 6, top], [x1 + 6 + v * 0.3, -130 + knie], [x1 - 1 + v * 0.7, -64], [x1 + 1 + v, -22],
    [x1 + 5 + v, 0, 1], [x0 - 5 + v, 0, 1], [x0 - 1 + v, -22], [x0 + 2 + v * 0.7, -66], [x0 - 2 + v * 0.3, -132]];
  const fussForm = (x0, x1, v) => [[x0 - 5 + v, 0, 1], [x0 - 3 + v, -14], [x0 + 8 + v, -22], [x1 - 8 + v, -22], [x1 + 4 + v, -13], [x1 + 6 + v, 0, 1]];
  const beinZeichnen = (x0, x1, knie, v, nah) => {
    const P = bein(x0, x1, -215, knie, v);
    let b = K(T, P, nah ? beinF : fern, { rand: false });
    /* Fuß: nackte, rissige Sohlenhaut, Nägel */
    const fu = K(T, fussForm(x0, x1, v), nah ? haut : "#1d1714", { rand: false, innen: fleck(T, x0 + 12 + v, -16, 22, 8, "#fff", 0.12) });
    b += RF(T, "fuss", { f: 0.45, tiefe: 1.6, okt: 3 }, fu);
    if (nah) {
      const nx = [x1 - 6, x1 - 21, x1 - 36].map((x) => x + v);
      b += nx.map((x, i) => F([[x - 6, 0, 1], [x - 6, -6], [x, -10 + i], [x + 6, -6], [x + 6, 0, 1]], T.lg("nagel", [[0, "#e6dcc4"], [1, "#9c8e74"]]))).join("");
      b += `<path d="${nx.map((x) => "M" + zf(x - 3, -7) + "q3-2 5 0").join("")}" stroke="#fff" stroke-opacity=".6" stroke-width="1" fill="none"/>`;
    }
    /* Fell der Beine: Hose bis knapp über den Fuß, Strähnen hängen über die Fußkante */
    const hose = [[x0 - 8, -215], [x1 + 8, -215], [x1 + 8 + v * 0.3, -130], [x1 + 5 + v * 0.8, -36], ...fransen(T, [[x1 + 6 + v * 0.85, -30], [x0 - 6 + v * 0.85, -30]], 8, 16, -0.12, 0.8).slice(1), [x0 - 6 + v * 0.8, -36], [x0 - 7 + v * 0.3, -130]];
    const poly = [[x0 - 4, -205], [x1 + 4, -205], [x1 + 3 + v * 0.8, -50], [x0 - 3 + v * 0.8, -50]];
    b += K(T, hose, nah ? beinF : fern, { rand: false, innen:
      fleck(T, x0 + 8, -150, 22, 70, nah ? "#c48a50" : "#6a4426", nah ? 0.22 : 0.12) + fleck(T, x1 + 4, -110, 18, 80, "#000", 0.3) });
    b += H(T, poly, nah ? 150 : 70, (x, y) => 92 - v * 0.15, (x, y) => 22 + (y + 205) * 0.12, {
      farben: nah ? [[DUN, 4, 1.8, 0.6], [MIT, 3, 1.6, 0.6], [ROT, 2, 1.3, 0.55], [HELL, 1, 1, 0.45]] : [[DUN, 3, 1.8, 0.6], [MIT, 2, 1.5, 0.45]], kruemmung: 0.12 });
    return b;
  };

  /* --- ferne Beine (dunkler, dahinter) --- */
  s += beinZeichnen(290, 342, 0, -16, false) + beinZeichnen(118, 170, 12, 14, false);

  /* --- Schwanz: kurz, mit Haarquaste (hinter dem Rumpf angesetzt) --- */
  s += K(T, [[34, -214], [22, -208], [15, -190], [13, -170], [19, -168], [23, -188], [33, -200]], "#2e1b0e", { rand: false });
  s += H(T, [[11, -176], [21, -176], [21, -166], [11, -166]], 40, 96, 26, { farben: [[DUN, 2, 1.5, 0.75], [MIT, 1, 1.2, 0.65]], kruemmung: 0.12 });

  /* --- nahe Beine (der Bauchrock hängt darüber) --- */
  s += beinZeichnen(334, 390, 0, 10, true) + beinZeichnen(46, 106, 14, -12, true);

  /* --- Rumpf mit Kopf: Kuppel – Kerbe – Buckel – steil abfallender Rücken, Rock unten --- */
  const bauch = [[428, -180], [414, -160], [398, -148], [360, -140], [300, -136], [220, -132], [150, -134], [96, -142], [60, -154]];
  const lang = (t) => (t < 0.2 ? 60 : 38 + 18 * Math.sin(t * Math.PI));
  /* hintere, dunklere Lage des Rocks (füllt die Lücken zwischen den Locken) */
  s += F([...bauch.slice().reverse().map(([x, y]) => [x, y - 24]), ...fransen(T, bauch, 22, (t) => lang(t) + 6, -0.18, 0.8)], "#170c05");
  const rock = fransen(T, bauch, 30, lang, -0.14, 0.85);
  const hinten = fransen(T, [[56, -158], [38, -170], [30, -192]], 3, 9, 0, 0.5, [-1, 0]);
  const rumpf = [...oben, [440, -192], ...rock, ...hinten.slice(1)];
  const dR = [];
  s += K(T, rumpf, fell, { rw: 0.9, randA: 0.18, d: dR, innen:
    /* Licht von links oben auf Rücken und Kuppel, Reflexlicht am Bauch */
    fleck(T, 210, -286, 175, 52, "#f0b878", 0.34, -14) + fleck(T, 392, -334, 42, 24, "#f0b878", 0.34) +
    fleck(T, 318, -268, 50, 34, "#e8aa68", 0.16) + fleck(T, 84, -236, 52, 30, "#e8aa68", 0.18) +
    /* Masse unter dem Fell: Schulter, Ellbogen, Keule, Kerbe, Kehle */
    fleck(T, 284, -186, 42, 66, "#000", 0.28) + fleck(T, 142, -182, 36, 56, "#000", 0.24) + fleck(T, 352, -296, 16, 30, "#000", 0.32) +
    fleck(T, 428, -172, 56, 44, "#000", 0.5) + fleck(T, 380, -205, 30, 50, "#000", 0.2) + fleck(T, 250, -136, 140, 14, "#a06a3a", 0.22) });
  /* Unterwolle (hell, wollig) und Strähnen (dunkel), gestreckt in Wuchsrichtung */
  s += TX(T, dR[0], "wolle", { fx: 0.32, fy: 0.035, farbe: "#d9a466", staerke: 2.2, schwelle: 0.6, okt: 3 }, 8, 0.3, [20, -360, 470, -80]);
  s += TX(T, dR[0], "straehne", { fx: 0.2, fy: 0.018, farbe: "#000", staerke: 2.4, schwelle: 0.52, okt: 2, seed: 11 }, 10, 0.4, [20, -360, 470, -80]);

  /* Haar für Haar: dunkle Grannen, rotbraune Mittellage, helle Spitzen im Licht */
  const innen = [[36, -224], [96, -260], [224, -308], [302, -327], [346, -306], [384, -336], [408, -347], [444, -318], [450, -250], [440, -200], [400, -152], [300, -142], [150, -140], [62, -158], [34, -196]];
  s += H(T, innen, 520, fluss, laenge, { farben: [[DUN, 5, 1.7, 0.5], [MIT, 4, 1.5, 0.55], [ROT, 3, 1.2, 0.5]] });
  const lichtZone = [[40, -236], [96, -262], [224, -310], [302, -330], [346, -308], [384, -338], [408, -350], [440, -326], [400, -312], [300, -296], [200, -270], [90, -232], [44, -214]];
  s += H(T, lichtZone, 260, fluss, (x, y) => laenge(x, y) * 0.8, { farben: [[HELL, 3, 1.1, 0.5], [SPITZ, 2, 0.9, 0.5], [ROT, 2, 1.1, 0.45]] });
  /* Flaum über der Rückenlinie (bricht die glatte Kante) */
  const kamm = ruecken.map(([x, y]) => [x, y + 5]).concat(ruecken.slice().reverse().map(([x, y]) => [x, y + 1]));
  s += H(T, kamm, 90, (x, y) => (x > 362 ? 230 : 172), 9, { farben: [[ROT, 2, 1, 0.55], [HELL, 1, 0.9, 0.5]], streuung: 22 });
  /* der Rock: lange Strähnen hängen über die Bauchkante */
  const rockZone = [...bauch.map(([x, y]) => [x, y - 34]), ...bauch.slice().reverse().map(([x, y]) => [x, y + 6])];
  s += H(T, rockZone, 230, (x, y) => 93 + (x < 120 ? 6 : 0), (x) => (x > 380 ? 58 : 50), { farben: [[DUN, 4, 1.9, 0.6], [MIT, 3, 1.6, 0.6], [ROT, 2, 1.3, 0.5]], kruemmung: 0.14 });

  /* --- Ohr: klein, rund, fast ganz im Fell --- */
  s += K(T, [[364, -282], [380, -282], [390, -268], [388, -248], [376, -240], [362, -250], [358, -268]], T.lg("ohr", [[0, "#4a2d18"], [1, "#22140a"]]), {
    randA: 0.2, innen: fleck(T, 374, -262, 9, 14, "#000", 0.45) + fleck(T, 366, -276, 12, 8, "#d09a60", 0.3) });
  s += H(T, [[360, -282], [388, -282], [390, -254], [362, -254]], 60, 100, 12, { farben: [[MIT, 2, 1.1, 0.6], [ROT, 2, 1, 0.55], [HELL, 1, 0.8, 0.5]] });

  /* --- Gesicht: Haut um das Auge, Auge mit langen Wimpern, Falten --- */
  s += F([[410, -270], [420, -279], [436, -277], [444, -266], [436, -256], [420, -255]], "#2e211a", ` opacity=".85"`);
  s += T.augeReal(427, -267, 2.5, { iris: "#6e4524", iris2: "#2a170a", offen: 0.6, winkel: -6, lid: "#120a06", wimpern: 11, wimpernLaenge: 1.4, wimpernFarbe: "#1a0f08" });
  s += `<path d="M412-276q15-10 30-1M414-283q14-8 28 0M416-256q11 5 22-1M418-251q9 4 18-1" fill="none" stroke="#0c0603" stroke-width=".9" opacity=".55"/>`;
  /* Kopfhaar: Schopf auf der Kuppel (aufgerichtet), Stirn nach unten */
  s += H(T, [[372, -340], [400, -354], [432, -347], [426, -334], [380, -326]], 110, (x) => 238 - (x - 372) * 0.6, 15, { farben: [[ROT, 3, 1.2, 0.6], [HELL, 2, 1, 0.55], [SPITZ, 1, 0.9, 0.5]], streuung: 26 });
  s += H(T, [[432, -330], [450, -310], [455, -250], [446, -244], [438, -300]], 80, 92, 16, { farben: [[DUN, 2, 1.2, 0.55], [ROT, 2, 1.1, 0.5], [HELL, 1, 0.9, 0.45]] });

  /* --- Unterlippe (spitz, hinter dem Rüssel) --- */
  s += K(T, [[404, -182], [426, -182], [436, -170], [424, -160], [406, -165]], "#4a3a34", { randA: 0.3, innen: fleck(T, 418, -178, 12, 4, "#fff", 0.2) });

  /* --- ferner Stoßzahn (hinter dem Rüssel) --- */
  const zahn = [[430, -198], [448, -168], [476, -142], [514, -126], [556, -126], [590, -146], [608, -180], [604, -218], [586, -246], [562, -260]];
  const zf2 = zahn.map(([x, y]) => [x - 24, y - 15]);
  s += K(T, rohr(zf2, 22, 6), elfF, { vol: false, randA: 0.3, innen: LI(quer(zf2, 22, 6, -0.5), "#4a3b28", 1.4, ` opacity=".35"`) });

  /* --- Rüssel: aus der Stirn heraus, Hautfalten, kurze Haare, Spitze mit zwei Fingern --- */
  const vorn = [[449, -250], [457, -224], [460, -186], [462, -140], [460, -96], [455, -58], [454, -34]];
  const hint = [[418, -230], [420, -190], [428, -156], [434, -120], [436, -80], [438, -40], [441, -18]];
  const ruessel = [...vorn, [459, -20], [468, -13], [478, -11], [487, -14, 1], [481, -18], [472, -20], [466, -18], [463, -11], [456, -5], [446, -6, 1],
    ...hint.slice().reverse().slice(0, 6), [418, -236], [430, -252]];
  let falten = "", lichtF = "";
  for (let y = -176, i = 0; y < -26; y += 8 + (y + 176) * -0.02 + 4 + T.rnd() * 4, i++) {
    const xa = bei(hint, y, 1), xb = bei(vorn, y, 1), w = xb - xa;
    falten += "M" + zf(xa, y) + "q" + zf(w / 2, 2.5, w, -1);
    lichtF += "M" + zf(xa + 1, y + 2) + "q" + zf(w / 2, 2.5, w - 2, -1);
  }
  const rue = K(T, ruessel, T.lg("ruessel", [[0, "#5a3820"], [0.35, "#4a2e1a"], [0.75, "#3a2a20"], [1, "#3a302c"]]), { rand: false, innen:
    fleck(T, 432, -150, 10, 90, "#e0a870", 0.22) + fleck(T, 458, -120, 8, 100, "#000", 0.35) +
    `<path d="${falten}" fill="none" stroke="#0e0703" stroke-width="1.3" opacity=".5"/><path d="${lichtF}" fill="none" stroke="#c89a70" stroke-width=".8" opacity=".3"/>` +
    fleck(T, 474, -14, 10, 5, "#9a7a6a", 0.5) + `<ellipse cx="469" cy="-17" rx="3" ry="1.6" fill="#0a0604"/>` });
  s += RF(T, "ruessel", { f: 0.5, tiefe: 1.1, okt: 3 }, rue);
  s += LI(vorn.concat([[459, -20], [468, -13], [478, -11], [487, -14]]), "#000", 0.9, ` opacity=".3"`);
  s += H(T, [[422, -240], [452, -246], [459, -150], [456, -60], [442, -60], [434, -150]], 140, 96, (x, y) => 9 + (y + 250) * 0.02, {
    farben: [[DUN, 3, 1, 0.5], [MIT, 2, 1, 0.5], [ROT, 2, 0.9, 0.45]] });
  /* Wangenhaar am hinteren Rüsselrand */
  s += H(T, [[396, -250], [424, -250], [432, -178], [404, -186]], 70, 94, 22, { farben: [[DUN, 3, 1.4, 0.6], [MIT, 2, 1.2, 0.55]] });

  /* --- naher Stoßzahn: Elfenbein mit Wachstumslinien, Glanz, abgenutzter Spitze; behaarte Scheide am Ansatz --- */
  let linien = LI(quer(zahn, 26, 6, -0.45), "#6e5a3c", 1.3, ` opacity=".35"`) + LI(quer(zahn, 26, 6, 0.15), "#8a7552", 0.9, ` opacity=".3"`) +
    LI(quer(zahn, 26, 6, 0.6).slice(1, 8), "#fffaf0", 2.6, ` opacity=".75"`) + LI(quer(zahn, 26, 6, -0.75), "#5a4630", 1.6, ` opacity=".3"`);
  if (fein) {
    let risse = "";
    for (let i = 1; i < 7; i++) {
      const p = entlang(zahn, i * 0.06 + T.rnd() * 0.03), q = entlang(zahn, i * 0.06 + 0.012);
      const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1, w = 10 - i;
      risse += "M" + zf(p[0] + dy / l * w, p[1] - dx / l * w) + "L" + zf(p[0] - dy / l * w * 0.4, p[1] + dx / l * w * 0.4);
    }
    linien += `<path d="${risse}" stroke="#5a4630" stroke-width=".7" opacity=".35" fill="none"/>`;
  }
  s += K(T, rohr(zahn, 26, 6), elf, { randA: 0.32, innen: linien + fleck(T, 566, -255, 18, 10, "#6a5a48", 0.35) + fleck(T, 440, -186, 18, 14, "#6a4a22", 0.5) });
  /* Scheide: Haut und Haar umschließen die Zahnwurzel */
  const scheide = [[414, -214], [438, -216], [452, -196], [458, -176], [452, -162], [438, -164], [424, -176], [414, -192]];
  s += K(T, scheide, T.lg("scheide", [[0, "#56361e"], [1, "#24150a"]]), { randA: 0.2, innen: fleck(T, 446, -170, 12, 8, "#000", 0.4) });
  s += H(T, [[416, -212], [440, -214], [454, -188], [430, -180]], 50, 88, 16, { farben: [[DUN, 2, 1.2, 0.6], [MIT, 2, 1.1, 0.55], [ROT, 1, 1, 0.5]] });

  return { svg: s, box: [11, -355, 614, 0] };
}

module.exports = [
  { id: "mammut", de: "das Mammut", syl: "MAM-mut", it: "il mammut", itSyl: "MAM-mut", en: "mammoth",
    gruppe: "Eiszeit", lebensraum: "Eiszeit", laenge: 6.03, hoehe: 3.55, zeichne: mammut },
];
