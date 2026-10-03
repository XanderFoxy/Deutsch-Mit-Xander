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
  let farben = o.farben || [["#000", 1, 1, 0.4]];
  if (T.fein === false) farben = farben.slice(0, 1); // Szene: eine Farbe je Haarfeld (weniger Pfade)
  const summe = farben.reduce((s, f) => s + f[1], 0);
  const eimer = farben.map(() => "");
  const ziel = Math.round(n * (T.fein === false ? (o.szene != null ? o.szene : 0.25) * (T._sz || 1) : 1));
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
/* weicher Fleck (Licht/Schatten ohne Kante): ein Verlauf je Farbe, Stärke über opacity */
let FLMIN = 0; // Szene: schwache Flecken weglassen
const fleck = (T, cx, cy, rx, ry, farbe, op, dreh = 0) => (T.fein === false && op < FLMIN ? "" :
  `<ellipse cx="${R(cx)}" cy="${R(cy)}" rx="${R(rx)}" ry="${R(ry)}"${dreh ? ` transform="rotate(${dreh} ${R(cx)} ${R(cy)})"` : ""} fill="${T.rg("f" + farbe.slice(1), [[0, farbe], [0.5, farbe, 0.55], [1, farbe, 0]])}" opacity="${op}"/>`);
/* Auge: fein = echtes Auge mit Wimpern; Szene = winziges dunkles Auge mit Glanzpunkt */
const AUGE = (T, x, y, rr, o) => (T.fein === false
  ? `<ellipse cx="${R(x)}" cy="${R(y)}" rx="${R(rr * 1.3)}" ry="${R(rr * 0.8)}" fill="#0c0705"/>`
  : T.augeReal(x, y, rr, o));
/* Textur-Rechteck (Rauschen) für die geklippte Innenzeichnung – nur in voller Feinheit */
const TX = (T, name, o, winkel, op, b) => {
  if (T.fein === false) return "";
  const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, r = Math.hypot(b[2] - b[0], b[3] - b[1]) / 2;
  return `<rect x="${R(cx - r)}" y="${R(cy - r)}" width="${R(2 * r)}" height="${R(2 * r)}" filter="${T.rauschen(name, o)}" transform="rotate(${winkel} ${R(cx)} ${R(cy)})" opacity="${op}"/>`;
};
const RF = (T, name, o, inhalt) => (T.fein === false ? inhalt : `<g filter="${T.relief(name, o)}">${inhalt}</g>`);
/* Rundung eines Beins: entlang der Höhe je ein weicher Licht-Streif an der linken (dem Licht zugewandten) Kante und ein
   Kernschatten an der rechten Kante – so wirkt auch das ferne Bein rund und nicht wie eine flache Silhouette */
function modell(T, P, hell, opH, opD, y0, y1, n = 7) {
  let o = "";
  const st = (y1 - y0) / n;
  for (let i = 0; i <= n; i++) {
    const y = y0 + i * st, xs = [];
    for (let j = 0, k = P.length - 1; j < P.length; k = j++) {
      const a = P[j], b = P[k];
      if ((a[1] > y) !== (b[1] > y)) xs.push(a[0] + (y - a[1]) / (b[1] - a[1]) * (b[0] - a[0]));
    }
    if (xs.length < 2) continue;
    const xl = Math.min(...xs), xr = Math.max(...xs), w = xr - xl;
    o += fleck(T, xl + w * 0.24, y, w * 0.2, Math.abs(st) * 0.9, hell, opH) + fleck(T, xr - w * 0.16, y, w * 0.2, Math.abs(st) * 0.9, "#000", opD);
  }
  return o;
}
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
  const e = mitte[n - 1], f = mitte[n - 2], le = Math.hypot(e[0] - f[0], e[1] - f[1]) || 1;
  const sp = [e[0] + (e[0] - f[0]) / le * w1 * 0.9, e[1] + (e[1] - f[1]) / le * w1 * 0.9];
  return [...li, ...(spitz ? [sp] : []), ...re.reverse()];
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
  T._sz = 0.28;
  FLMIN = 0.4;                 // Szene: noch weniger Haare (klein sieht man sie nicht einzeln)
  const NF = fein ? 1 : 0.45;    // Szene: weniger Locken an den Kanten
  const fell = T.lg("fell", [[0, "#7a4e2e"], [0.22, "#5c3920"], [0.6, "#382113"], [1, "#1a1007"]], 0, -355, 0, -70, UB);
  const beinF = T.lg("bein", [[0, "#3c2514"], [0.5, "#2c1a0d"], [1, "#1b1007"]], 0, -210, 0, 0, UB);
  const fern = T.lg("fern", [[0, "#24160b"], [1, "#100904"]], 0, -210, 0, 0, UB);
  const haut = T.lg("haut", [[0, "#6a5a4e"], [0.5, "#4a3e36"], [1, "#2a221d"]]);
  const elf = T.lg("elf", [[0, "#f6eedb"], [0.35, "#e8dbbb"], [0.75, "#c2ad84"], [1, "#8f7a55"]], 0, 0, 0.2, 1);
  const elfF = T.lg("elff", [[0, "#a8956f"], [1, "#5e4e36"]], 0, 0, 0.2, 1);
  const DUN = "#100803", MIT = "#3e2412", ROT = "#6e4220", HELL = "#b07a46", SPITZ = "#d29f68";
  const W = "#fff3dc", S0 = "#000";
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
  const bein = (x0, x1, top, knie, v = 0) => [[x0 - 8, top], [x1 + 8, top], [x1 + 7 + v * 0.3, -130 + knie], [x1 - 1 + v * 0.7, -64], [x1 + 1 + v, -22],
    [x1 + 5 + v, 0, 1], [x0 - 5 + v, 0, 1], [x0 - 1 + v, -22], [x0 + 2 + v * 0.7, -66], [x0 - 2 + v * 0.3, -132]];
  const fussForm = (x0, x1, v) => [[x0 - 8 + v, 0, 1], [x0 - 8 + v, -7], [x0 - 2 + v, -20], [x0 + 12 + v, -26], [x1 - 12 + v, -26], [x1 + 3 + v, -20], [x1 + 8 + v, -7], [x1 + 9 + v, 0, 1]];
  const beinZeichnen = (x0, x1, knie, v, nah, vorne) => {
    const P = bein(x0, x1, -215, knie, v);
    let b = K(T, P, nah ? beinF : fern, { rand: false });
    /* Fuß: nackte, rissige Sohlenhaut, Hornnägel (vorn 5, hinten 4 – zu sehen sind 3) */
    const fu = K(T, fussForm(x0, x1, v), nah ? haut : "#1d1714", { rand: false, innen:
      fleck(T, x0 + 10 + v, -15, 26, 9, W, 0.22) + fleck(T, x1 + v, -8, 16, 14, S0, 0.35) + fleck(T, (x0 + x1) / 2 + v, -1, 44, 5, S0, 0.55) });
    b += RF(T, "fuss", { f: 0.6, tiefe: 0.5, okt: 2 }, fu);
    if (nah) {
      const nx = (vorne ? [x1 - 4, x1 - 18, x1 - 32] : [x1 - 5, x1 - 20, x1 - 34]).map((x) => x + v);
      const ng = T.lg("nagel", [[0, "#a59a84"], [0.6, "#7c705c"], [1, "#4e463a"]]);
      b += nx.map((x, i) => F([[x - 5, -1.5, 1], [x - 5, -4], [x - 2.5, -8], [x + 2.5, -8], [x + 5, -4], [x + 5, -1.5, 1]], ng, ` stroke="#2a221a" stroke-width=".7" stroke-opacity=".6"`)).join("");
      b += `<path d="${nx.map((x) => "M" + zf(x - 3, -5) + "q3-1.5 5 0").join("")}" stroke="#fff" stroke-opacity=".35" stroke-width=".8" fill="none"/>`;
    }
    /* Fell der Beine: Hose bis knapp über den Fuß, Strähnen hängen über die Fußkante */
    const hose = [[x0 - 8, -215], [x1 + 8, -215], [x1 + 8 + v * 0.3, -130], [x1 + 6 + v * 0.8, -40], ...fransen(T, [[x1 + 7 + v * 0.9, -30], [x1 - 10 + v, -24], [x0 + 10 + v, -26], [x0 - 7 + v * 0.9, -32]], Math.round(10 * NF), 13, -0.1, 0.9).slice(1), [x0 - 6 + v * 0.8, -40], [x0 - 7 + v * 0.3, -130]];
    const poly = [[x0 - 4, -205], [x1 + 4, -205], [x1 + 3 + v * 0.8, -50], [x0 - 3 + v * 0.8, -50]];
    b += K(T, hose, nah ? beinF : fern, { rand: false, innen:
      fleck(T, x0 + 2, -120, 16, 90, nah ? SPITZ : ROT, nah ? 0.38 : 0.2) + fleck(T, x1 + 8, -110, 22, 110, S0, 0.5) + fleck(T, (x0 + x1) / 2, -40, 50, 20, S0, 0.3) +
      TX(T, "beinwolle", { fx: 0.3, fy: 0.03, farbe: "#c9955a", staerke: 2.2, schwelle: 0.6, okt: 2, seed: 5 }, 0, nah ? 0.25 : 0.12, [x0 - 10, -215, x1 + 10, -20]) });
    if (nah) b += H(T, [[x0 - 5, -200], [x0 + 16, -200], [x0 + 14 + v * 0.8, -60], [x0 - 4 + v * 0.8, -60]], 40, 93 - v * 0.15, 30, { farben: [[HELL, 2, 1.1, 0.55], [SPITZ, 1, 0.9, 0.5]], szene: 0.2 });
    b += H(T, poly, nah ? 92 : 50, (x, y) => 92 - v * 0.15, (x, y) => 22 + (y + 205) * 0.14, {
      farben: nah ? [[DUN, 4, 1.8, 0.75], [MIT, 3, 1.6, 0.75], [ROT, 2, 1.3, 0.7], [HELL, 1, 1, 0.55]] : [[DUN, 3, 1.8, 0.6], [MIT, 2, 1.5, 0.45]], kruemmung: 0.12, szene: nah ? 0.2 : 0 });
    return b;
  };

  /* --- ferne Beine (dunkler, dahinter) --- */
  s += beinZeichnen(290, 342, 0, -16, false, true) + beinZeichnen(118, 170, 12, 14, false, false);

  /* --- Schwanz: kurz, mit Haarquaste (hinter dem Rumpf angesetzt) --- */
  s += K(T, [[34, -214], [22, -208], [15, -190], [13, -170], [19, -168], [23, -188], [33, -200]], "#2e1b0e", { rand: false });
  s += H(T, [[11, -176], [21, -176], [21, -166], [11, -166]], 40, 96, 26, { farben: [[DUN, 2, 1.5, 0.75], [MIT, 1, 1.2, 0.65]], kruemmung: 0.12, szene: 0.4 });

  /* --- nahe Beine (der Bauchrock hängt darüber) --- */
  s += beinZeichnen(334, 390, 0, 10, true, true) + beinZeichnen(46, 106, 14, -12, true, false);

  /* --- Rumpf mit Kopf: Kuppel – Kerbe – Buckel – steil abfallender Rücken, Rock unten --- */
  const bauch = [[428, -180], [414, -160], [398, -148], [360, -140], [300, -136], [220, -132], [150, -134], [96, -142], [60, -154]];
  const lang = (t) => (t < 0.2 ? 48 : 28 + 16 * Math.sin(t * Math.PI));
  /* hintere, dunklere Lage des Rocks (füllt die Lücken zwischen den Locken) */
  s += F([...bauch.slice().reverse().map(([x, y]) => [x, y - 24]), ...fransen(T, bauch, Math.round(20 * NF), (t) => lang(t) + 6, -0.18, 0.8)], "#170c05");
  const rock = fransen(T, bauch, Math.round(34 * NF), lang, -0.14, 0.85);
  const hinten = fransen(T, [[56, -158], [38, -170], [30, -192]], 3, 9, 0, 0.5, [-1, 0]);
  const rumpf = [...oben, [440, -192], ...rock, ...hinten.slice(1)];
  const BX = [20, -360, 470, -80];
  s += K(T, rumpf, fell, { rw: 0.9, randA: 0.18, innen:
    /* Unterwolle (hell, wollig) und Strähnen (dunkel), gestreckt in Wuchsrichtung */
    TX(T, "wolle", { fx: 0.32, fy: 0.035, farbe: "#d9a466", staerke: 2.2, schwelle: 0.6, okt: 3 }, 8, 0.3, BX) +
    TX(T, "straehne", { fx: 0.2, fy: 0.018, farbe: "#000", staerke: 2.4, schwelle: 0.52, okt: 2, seed: 11 }, 10, 0.4, BX) +
    /* Licht von links oben auf Rücken und Kuppel, Reflexlicht am Bauch */
    fleck(T, 200, -290, 185, 58, SPITZ, 0.5, -14) + fleck(T, 392, -336, 44, 26, SPITZ, 0.5) +
    fleck(T, 318, -268, 52, 36, SPITZ, 0.25) + fleck(T, 84, -236, 52, 30, SPITZ, 0.28) +
    /* Masse unter dem Fell: Schulter, Ellbogen, Keule, Kerbe, Kehle, Bauch */
    fleck(T, 284, -186, 44, 70, S0, 0.4) + fleck(T, 142, -182, 38, 60, S0, 0.34) + fleck(T, 352, -296, 16, 30, S0, 0.4) +
    fleck(T, 428, -172, 58, 46, S0, 0.6) + fleck(T, 382, -205, 30, 52, S0, 0.25) + fleck(T, 230, -150, 190, 34, S0, 0.35) +
    fleck(T, 250, -136, 150, 12, ROT, 0.4) + fleck(T, 44, -168, 22, 30, S0, 0.45) });

  /* --- Ohr: klein (~30 cm), behaarter Lappen; wirft einen Schatten auf den Kopf dahinter --- */
  s += fleck(T, 382, -258, 14, 22, S0, 0.45);
  const ohr = [[364, -284], [377, -286], ...fransen(T, [[386, -276], [389, -258], [384, -244], [372, -238]], 6, 6, 0, 0.7, [1, 0.6]), [362, -246], [357, -266]];
  s += K(T, ohr, T.lg("ohr", [[0, "#5a3820"], [1, "#2a180c"]]), { rand: false, innen: fleck(T, 372, -262, 10, 16, S0, 0.35) + fleck(T, 366, -280, 16, 9, SPITZ, 0.4) });
  /* Haar für Haar: dunkle Grannen, rotbraune Mittellage, helle Spitzen im Licht */
  const innen = [[31, -222], [96, -260], [224, -308], [302, -327], [346, -306], [384, -336], [408, -347], [444, -318], [450, -250], [440, -200], [400, -152], [300, -142], [150, -140], [50, -156], [30, -196]];
  s += H(T, innen, 410, fluss, laenge, { farben: [[DUN, 5, 1.7, 0.5], [MIT, 4, 1.5, 0.55], [ROT, 3, 1.2, 0.5]], szene: 0.18 });
  const lichtZone = [[40, -236], [96, -262], [224, -310], [302, -330], [346, -308], [384, -338], [408, -350], [440, -326], [400, -312], [300, -296], [200, -270], [90, -232], [44, -214]];
  s += H(T, lichtZone, 170, fluss, (x, y) => laenge(x, y) * 0.8, { farben: [[HELL, 3, 1.1, 0.5], [SPITZ, 2, 0.9, 0.45], [ROT, 2, 1.1, 0.45]], szene: 0.18 });
  /* Flaum über Rücken- und Stirnlinie (bricht die glatte Kante) */
  const kamm = ruecken.map(([x, y]) => [x, y + 5]).concat(ruecken.slice().reverse().map(([x, y]) => [x, y + 1]));
  s += H(T, kamm, 45, (x, y) => (x > 362 ? 230 : 172), 9, { farben: [[ROT, 2, 1, 0.55], [HELL, 1, 0.9, 0.5]], streuung: 22, szene: 0.15 });
  s += H(T, [[440, -330], [452, -300], [456, -250], [452, -250], [446, -300], [436, -328]], 40, 75, 9, { farben: [[MIT, 2, 1, 0.55], [ROT, 1, 0.9, 0.5]], streuung: 20, szene: 0.15 });
  /* der Rock: lange Strähnen hängen über die Bauchkante */
  const rockZone = [...bauch.map(([x, y]) => [x, y - 34]), ...bauch.slice().reverse().map(([x, y]) => [x, y + 6])];
  s += H(T, rockZone, 190, (x, y) => 93 + (x < 120 ? 6 : 0), (x) => (x > 380 ? 60 : 54), { farben: [[DUN, 4, 1.9, 0.85], [MIT, 3, 1.6, 0.85], [ROT, 2, 1.3, 0.8]], kruemmung: 0.14, szene: 0.2 });

  s += H(T, [[360, -284], [380, -286], [388, -262], [384, -246], [362, -248]], 55, 104, 11, { farben: [[MIT, 2, 1.1, 0.6], [ROT, 2, 1, 0.55], [HELL, 1, 0.8, 0.5]], szene: 0.2 });
  /* --- Kopfhaar: Schopf auf der Kuppel (aufgerichtet, gedeckt), Stirn nach unten --- */
  s += H(T, [[372, -340], [400, -354], [432, -347], [426, -334], [380, -326]], 90, (x) => 238 - (x - 372) * 0.6, 13, { farben: [[MIT, 2, 1.2, 0.6], [ROT, 3, 1.1, 0.55], [HELL, 1, 1, 0.45]], streuung: 26, szene: 0.2 });
  s += H(T, [[430, -334], [450, -310], [455, -250], [440, -250], [432, -300]], 70, 92, 15, { farben: [[DUN, 2, 1.2, 0.55], [ROT, 2, 1.1, 0.5], [HELL, 1, 0.9, 0.45]], szene: 0.2 });

  /* --- ferner Stoßzahn (hinter dem Rüssel, im Schatten) --- */
  const zahn = [[424, -206], [446, -170], [476, -142], [514, -126], [556, -126], [590, -146], [608, -180], [604, -218], [588, -244], [566, -258]];
  const zf2 = zahn.map(([x, y], i) => [x - 6 - i * 1.6, y - 6 - i * 1.9]);
  s += K(T, rohr(zf2, 22, 3.5), elfF, { vol: false, randA: 0.3, innen: LI(quer(zf2, 22, 3.5, -0.5), "#3a2e20", 1.4, ` opacity=".35"`) });

  /* --- Rüssel: aus dem Gesicht heraus, oben behaart, unten nackte Ringhaut, Spitze nach vorn gerollt mit zwei Fingern --- */
  const vorn = [[452, -244], [458, -228], [461, -186], [462, -140], [459, -98], [455, -62], [455, -40], [460, -26]];
  const hint = [[416, -244], [416, -230], [420, -190], [428, -156], [434, -120], [437, -80], [440, -40], [443, -18]];
  const spitze = [[468, -19], [477, -21], [485, -27, 1], [487, -21], [493, -17, 1], [489, -8], [478, -2], [463, -1], [450, -6]];
  const ruessel = [...vorn, ...spitze, ...hint.slice().reverse(), [434, -250]];
  let falten = "", lichtF = "";
  for (let y = -182; y < -30; y += (6 + T.rnd() * 5 + (y + 182) * -0.012) * (fein ? 1 : 1.8)) {
    const xa = bei(hint, y, 1), xb = bei(vorn, y, 1), w = xb - xa;
    falten += "M" + zf(xa, y) + "q" + zf(w / 2, 2.5, w, -1);
    lichtF += "M" + zf(xa + 2, y + 2) + "q" + zf(w / 2, 2.5, w - 4, -1);
  }
  const rue = K(T, ruessel, T.lg("ruessel", [[0, "#3e2614"], [0.3, "#3c2616"], [0.65, "#3a2b22"], [1, "#4a3e38"]], 0, -250, 0, 0, UB), { rand: false, vol: false, innen:
    fleck(T, 432, -130, 10, 110, SPITZ, 0.3) + fleck(T, 460, -120, 9, 120, S0, 0.45) +
    `<path d="${falten}" fill="none" stroke="#0e0703" stroke-width="1.2" opacity=".5"/>` + (fein ? `<path d="${lichtF}" fill="none" stroke="#c89a70" stroke-width=".8" opacity=".25"/>` : "") +
    `<path d="M446-14q12 8 30 4M450-22q8 6 20 2" fill="none" stroke="#0e0703" stroke-width="1" opacity=".45"/>` +
    fleck(T, 482, -16, 9, 7, "#a08070", 0.55) + fleck(T, 470, -4, 18, 4, S0, 0.4) +
    `<path d="M485-25q3 3 2 6q2 0 4 1" fill="none" stroke="#0a0604" stroke-width="1.4"/>` });
  s += RF(T, "ruessel", { f: 0.08, f2: 0.5, tiefe: 0.5, okt: 2 }, rue);
  s += LI(vorn.slice(1).concat([[468, -19], [477, -21], [485, -27]]), "#000", 0.9, ` opacity=".3"`);
  s += H(T, [[416, -250], [454, -250], [460, -186], [440, -170], [422, -186]], 90, 94, 14, { farben: [[DUN, 3, 1.1, 0.55], [MIT, 2, 1, 0.55], [ROT, 2, 0.9, 0.5]], szene: 0.2 });
  s += H(T, [[424, -176], [459, -176], [458, -70], [442, -60], [433, -150]], 60, 98, 7, { farben: [[DUN, 2, 0.8, 0.45], [MIT, 2, 0.8, 0.45]], szene: 0.15 });

  /* --- naher Stoßzahn: Elfenbein mit Wachstumslinien, Glanz, abgenutzter Spitze --- */
  let linien = (fein ? LI(quer(zahn, 26, 3.5, -0.45), "#6e5a3c", 1.2, ` opacity=".3"`) + LI(quer(zahn, 26, 3.5, 0.15), "#8a7552", 0.8, ` opacity=".28"`) : "") +
    LI(quer(zahn, 26, 3.5, 0.55).slice(1, 8), "#fffaf0", 1.6, ` opacity=".7"`) + LI(quer(zahn, 26, 3.5, 0.38).slice(2, 7), "#fffaf0", 3, ` opacity=".25"`) +
    LI(quer(zahn, 26, 3.5, -0.78), "#4a3a26", 1.6, ` opacity=".35"`);
  if (fein) {
    let risse = "";
    for (let i = 1; i < 9; i++) {
      const t = 0.05 + i * 0.07 + T.rnd() * 0.03, p = entlang(zahn, t), q = entlang(zahn, t + 0.01);
      const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1, w = 11 * (1 - t);
      risse += "M" + zf(p[0] + dy / l * w, p[1] - dx / l * w) + "q" + zf(-dy / l * w * 0.6 + dx / l * 2, dx / l * w * 0.6 + dy / l * 2, -dy / l * w * 1.3, dx / l * w * 1.3);
    }
    linien += `<path d="${risse}" stroke="#5a4630" stroke-width=".6" opacity=".3" fill="none"/>`;
  }
  s += K(T, rohr(zahn, 26, 3.5), elf, { randA: 0.3, innen: linien + fleck(T, 568, -256, 18, 10, "#6a5a48", 0.4) + fleck(T, 440, -190, 24, 20, "#3a2410", 0.85) });

  const scheide = [[410, -228], [440, -232], [454, -214], [460, -194], ...fransen(T, [[460, -188], [446, -178], [428, -182], [412, -192]], Math.round(9 * NF), 5, 0, 0.7).slice(1)];
  s += K(T, scheide, fell, { rand: false, vol: false, innen: fleck(T, 446, -186, 16, 10, S0, 0.5) + fleck(T, 424, -220, 18, 10, SPITZ, 0.2) });
  /* --- Wange, Zahnscheide und Kinn: Haar wächst über Rüsselwurzel und Zahnansatz --- */
  s += H(T, [[400, -258], [440, -262], [458, -244], [458, -206], [452, -178], [432, -176], [404, -190]], 135, (x, y) => 88 + (452 - x) * 0.08, (x, y) => 12 + (y + 250) * 0.18, {
    farben: [[DUN, 3, 1.4, 0.65], [MIT, 3, 1.2, 0.6], [ROT, 2, 1, 0.5]], szene: 0.2 });

  /* --- Auge: klein, hellbraun, lange Wimpern, Hautfalten (Elefanten haben nackte, faltige Lider) --- */
  s += fleck(T, 427, -268, 13, 9, "#2a1d16", 0.9);
  s += AUGE(T, 427, -268, 3.4, { iris: "#8a5a2c", iris2: "#3a2210", offen: 0.62, winkel: -8, lid: "#140c07", weiss: false, wimpern: 12, wimpernLaenge: 1.5, wimpernFarbe: "#160d07" });
  s += `<path d="M416-276q8-6 16-5M421-281q8-3 15 1M418-259q7 3 14 0M424-254q6 2 11-1" fill="none" stroke="#0c0603" stroke-width=".7" opacity=".4"/>`;

  return { svg: s, box: [11, -355, 614, 0] };
}

/* =====================================================================
   DIE SÄBELZAHNKATZE (Smilodon fatalis)
   RECHERCHE: Schulterhöhe ~100 cm, Kopf-Rumpf ~175 cm, Schwanz nur ~35 cm (reicht
   kaum bis zum Sprunggelenk), 160–280 kg – so lang wie ein Löwe, aber viel
   gedrungener und muskulöser: kurze Lendenpartie, Rücken fällt zur Kruppe leicht ab,
   sehr kräftige Vorderbeine (Oberarm, Unterarm) mit breiten Pfoten und
   einziehbaren Krallen, kürzere Hinterbeine (Zehengänger). Obere Eckzähne ~18 cm
   Krone, flach wie eine Klinge, leicht nach hinten gebogen, fein gesägt; sie ragen
   bei geschlossenem Maul unter dem Kinn hervor (Unterkiefer mit Knochenlappen).
   Lippenlinie kurz und katzentypisch, Nase und Ohren wie bei heutigen Katzen
   (Antón et al. 1998) – keine Hängelippen. Augen nach vorn, Pupille rund.
   Fellfarbe unbekannt: wie in den Rekonstruktionen (Antón) gelbbraun, Bauch hell,
   Rücken dunkler, nur ganz schwache Tupfen; kurzes, dichtes Fell.
   ===================================================================== */
/* gleiche Drehrichtung für alle Teilpfade (dann ergibt nonzero die Vereinigung) */
const flaeche = (p) => p.reduce((a, q, i) => { const n = p[(i + 1) % p.length]; return a + q[0] * n[1] - n[0] * q[1]; }, 0);
const gleich = (p) => (flaeche(p) < 0 ? p.slice().reverse() : p);
/* vereinigte Silhouette: Rand HINTER der Füllung (nur die Außenkante bleibt), Füllung, geklippte Innenzeichnung */
function silhouette(T, teile, fill, innen, rand = "#2a1a0c", rw = 0.7) {
  const d = teile.map((p) => glatt(gleich(p))).join("");
  T._n = (T._n || 0) + 1;
  const id = T.id("e" + T._n);
  T.def(`<clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  return `<defs><path id="${id}" d="${d}"/></defs><use href="#${id}" fill="none" stroke="${rand}" stroke-opacity=".3" stroke-width="${rw}"/>` +
    `<use href="#${id}" fill="${fill}"/><g clip-path="url(#${id}c)">${innen}<use href="#${id}" fill="${T.VOL()}"/></g>`;
}

function saebelzahn(T) {
  GEN = 10;
  const fein = T.fein !== false;
  T._sz = 0.3; FLMIN = 0.3;
  const fell = T.lg("fell", [[0, "#7a5430"], [0.12, "#9c7040"], [0.32, "#b88a54"], [0.5, "#c89e6a"], [0.57, "#dcc29a"], [0.66, "#c99f6c"], [0.85, "#b48a5a"], [1, "#9a744a"]], 0, -106, 0, 0, UB);
  const fern = T.lg("fern", [[0, "#9c7850"], [0.6, "#94714c"], [1, "#7a5c3c"]], 0, -90, 0, 0, UB);
  const D = "#5a3a1c", M = "#8e6539", L = "#e2c79a", W = "#f6ecd8", S0 = "#000", HL = "#fff3dc";
  let s = "";

  /* --- Teile (Zentimeter). Proportionen nach Löwe/Smilodon: Bugspitze vor dem Widerrist, Ellbogen unter dem
     Widerrist auf Brusthöhe, Unterarm senkrecht, Knie vorn auf Bauchhöhe, Sprunggelenk hinten bei ~27 cm --- */
  const rumpf = [[14, -82], [20, -88], [36, -93], [56, -92], [78, -93.5], [100, -97.5], [121, -103.6], [136, -100.4], [148, -97.6], [156, -96], [162, -86], [167, -76], [160, -70],
    [151, -67], [146, -62], [134, -55], [118, -47.6], [102, -46.6], [88, -50], [74, -56.4], [62, -61], [50, -64], [36, -68], [22, -73], [12, -76]];
  const vbein = (dx) => [[104, -88], [122, -97], [138, -88], [146, -73], [143.4, -61], [137.6, -51.6], [134.4, -42], [132.6, -30], [131.4, -20], [132.4, -13.6], [135.6, -9.6],
    [139.6, -7.8], [143.2, -5.4], [145, -2.4], [144, 0, 1], [123, 0, 1], [121, -3], [120.6, -7.2], [118.6, -10.4], [119.6, -15], [120.8, -21], [120.6, -30], [119.6, -40],
    [115.6, -47.4], [106, -52], [100, -62], [100, -76]].map(([x, y, h]) => [x + dx, y, h]);
  const hbein = (dx) => [[16, -86], [40, -91], [55, -85], [61.5, -71], [60.5, -58], [52.6, -48], [45, -39], [40, -31], [38.4, -24], [37.6, -16], [38.6, -9.6],
    [41.6, -6.6], [45.4, -4], [46.6, -1.6], [45.6, 0, 1], [29.5, 0, 1], [28, -3.6], [28.2, -10], [27.8, -18], [26.4, -24], [25, -27.5], [23.6, -34], [20, -44],
    [14, -56], [9, -68], [11, -78]].map(([x, y, h]) => [x + dx, y, h]);
  /* Kopf: Katzenprofil – runder Schädel, langer gerader Nasenrücken, hohe, senkrechte Schnauze, zurückgesetztes Kinn */
  /* Kopf leicht gesenkt (Katzen tragen den Kopf unter der Rückenlinie): um 7° gedreht, 4 cm tiefer */
  const KW = 7, KX = 156, KY = -92, KD = 4, KS = 1.14;   // Kopf etwas größer (massiger Schädel)
  const kt = ([x, y, h]) => { const a = KW * Math.PI / 180, dx = (x - KX) * KS, dy = (y - KY) * KS; return [KX + dx * Math.cos(a) - dy * Math.sin(a), KY + dx * Math.sin(a) + dy * Math.cos(a) + KD, h]; };
  const KG = `<g transform="translate(0 ${KD}) rotate(${KW} ${KX} ${KY}) translate(${KX} ${KY}) scale(${KS}) translate(${-KX} ${-KY})">`;
  const kopf = [[152, -90], [152.4, -97], [158, -102.6], [164, -105.2], [172, -106], [179.6, -104.8], [184, -102.6], [190, -99], [194.5, -96], [196.4, -94.2],
    [197.6, -91.8], [197, -89.6], [196.6, -87.4], [195.8, -84.6], [193, -82.4], [189, -81.6], [184, -81.8], [179.6, -83.4], [183.2, -80.4], [185.4, -78.6], [185, -76],
    [179, -75.4], [171, -75.8], [164, -78], [158, -83]].map(kt);
  const zehen = (x0, x1, n) => {
    let d = "";
    for (let i = 1; i < n; i++) { const x = x0 + (x1 - x0) * i / n; d += "M" + zf(x - 0.6, -7.5 + Math.abs(i - n / 2) * 0.8) + "q" + zf(1.2, 3, 0.4, 6.8); }
    return `<path d="${d}" stroke="#3a2614" stroke-width=".55" opacity=".55" fill="none"/>`;
  };

  /* --- ferne Beine im Schatten --- */
  for (const P of [vbein(-17), hbein(17)]) s += K(T, P, fern, { rw: 0.45, randA: 0.2, innen: modell(T, P, HL, 0.28, 0.3, -86, -4) + fleck(T, P[0][0] + 20, -1, 12, 2, S0, 0.35) });

  /* --- Schwanz: kurz und dick, hängt bis knapp über das Sprunggelenk --- */
  s += K(T, [[17, -85], [10, -81], [5, -71], [2.6, -58], [2.4, -47], [5.4, -43, 1], [8.8, -47], [10, -58], [13, -68], [21, -78]],
    T.lg("schwanz", [[0, "#9a7044"], [0.65, "#8e6539"], [1, "#4a3018"]]), { randA: 0.25, rw: 0.5, innen: fleck(T, 5, -64, 3, 14, HL, 0.3) });
  s += H(T, [[3, -52], [9.5, -52], [9, -45], [4, -45]], 26, 100, 3.2, { farben: [[D, 1, 0.45, 0.7]], szene: 0.3 });

  /* --- Körper, nahe Beine und Kopf als EINE Fläche (keine Nähte); Licht von links oben --- */
  const BX = [0, -110, 202, 0];
  const KF = (x, y, rx, ry, c, o) => { const p = kt([x, y]); return fleck(T, p[0], p[1], rx, ry, c, o, KW); };
  const innen =
    TX(T, "kurzfell", { fx: 1.2, fy: 0.18, farbe: "#4a2e14", staerke: 2.2, schwelle: 0.6, okt: 3 }, 80, 0.18, BX) +
    TX(T, "kurzfellH", { fx: 0.9, fy: 0.12, farbe: "#fbe9c6", staerke: 2.2, schwelle: 0.62, okt: 2, seed: 9 }, 80, 0.22, BX) +
    /* Glanz auf Rücken, Schulterblatt, Kruppe, Stirn */
    fleck(T, 72, -91, 60, 7, HL, 0.45, -3) + fleck(T, 120, -95, 15, 7, HL, 0.45) + fleck(T, 32, -84, 18, 7, HL, 0.4) + KF(170, -104.6, 12, 3.4, HL, 0.45) +
    /* Körper rund: Eigenschatten unten, Bauch dunkler, Brust vorn im Schatten */
    fleck(T, 90, -50, 50, 12, S0, 0.42) + fleck(T, 80, -64, 60, 10, S0, 0.14) + fleck(T, 146, -62, 8, 16, S0, 0.3) + fleck(T, 160, -78, 6, 8, S0, 0.25) +
    /* Muskeln: Schulter (Deltamuskel) und Oberarm, Trizepsschatten, Unterarm; Keule, Oberschenkel vorn, Wade */
    fleck(T, 134, -79, 9, 10, HL, 0.35) + fleck(T, 108, -64, 7, 14, S0, 0.24) + fleck(T, 122, -36, 4, 14, HL, 0.3) + fleck(T, 136, -36, 3.6, 13, S0, 0.25) +
    fleck(T, 30, -72, 15, 11, HL, 0.35) + fleck(T, 100, -78, 26, 14, HL, 0.18) + fleck(T, 118, -84, 14, 12, HL, 0.22) + fleck(T, 70, -74, 10, 12, S0, 0.14) + fleck(T, 54, -66, 7, 12, S0, 0.2) + fleck(T, 18, -46, 5, 10, HL, 0.25) + fleck(T, 40, -36, 5, 8, S0, 0.2) +
    /* Pfoten unten dunkel (Schatten auf dem Boden) */
    fleck(T, 133, -1, 13, 2.4, S0, 0.45) + fleck(T, 38, -1, 10, 2.4, S0, 0.45) +
    /* helle Unterseite: Kehle, Kinn, Schnauze */
    fleck(T, 158, -80, 7, 5, W, 0.45) + KF(181, -77.4, 6, 2.2, W, 0.8) + KF(192, -86, 5.6, 3.6, W, 0.75) + KF(180.6, -96, 4.6, 2.4, W, 0.55) + KF(174, -100.4, 4, 3, W, 0.25) +
    /* Kopfmodellierung: Jochbogen, Kaumuskel, Augenhöhle */
    KF(170, -90, 8, 6, S0, 0.2) + KF(166, -82, 6, 5, S0, 0.2) + KF(178, -101.4, 4, 2.2, S0, 0.25) +
    /* Muskelränder und Sehnen: Schulterblattgräte, Trizepsrand, Ellbogenfalte, Achillessehne, Unterarm, Kniescheibe */
    LI([[114, -94], [124, -86], [134, -81]], D, 0.4, ` opacity=".15"`) + LI([[104, -76], [110, -64], [112, -52]], D, 0.5, ` opacity=".22"`) +
    LI([[112.6, -47.4], [108, -54], [103, -64]], "#2a1a0c", 0.7, ` opacity=".5"`) +
    LI([[14, -50], [17, -40], [20.6, -30]], D, 0.55, ` opacity=".45"`) + LI([[133, -48], [131, -36], [130, -26]], D, 0.4, ` opacity=".16"`) +
    LI([[28, -86], [44, -78], [54, -66]], D, 0.4, ` opacity=".12"`) + LI([[119, -16], [119.6, -22]], D, 0.4, ` opacity=".4"`) +
    LI([[56, -62], [60.4, -58], [58, -54]], D, 0.4, ` opacity=".35"`) +
    /* ganz schwache Tupfen */
    (fein ? Array.from({ length: 14 }, () => fleck(T, 30 + T.rnd() * 100, -84 + T.rnd() * 26, 1.8 + T.rnd() * 1.3, 1.3 + T.rnd() * 0.8, "#6a4826", 0.16)).join("") : "") +
    zehen(131.5, 144, 4) + zehen(38, 46.5, 4) + modell(T, vbein(0), HL, 0.2, 0.22, -44, -6, 6) + modell(T, hbein(0), HL, 0.2, 0.22, -40, -6, 6);
  s += silhouette(T, [rumpf, vbein(0), hbein(0), kopf], fell, innen);

  /* --- Fell: kurz und glatt; Haar für Haar nur fein, sichtbar vor allem an den Kanten --- */
  const fl = (x, y) => {
    if (x > 150 && y < -76) return 186 + KW + (y + 95) * 0.5;
    if (y > -58 && (x < 62 || (x > 100 && x < 146))) return 96;
    return 172 + (y + 95) * 0.5;
  };
  const alles = [[12, -82], [40, -92], [122, -104], [158, -98], [176, -102], [192, -88], [192, -80], [168, -70], [146, -64], [142, -8], [121, -6], [114, -46],
    [60, -58], [46, -38], [44, -6], [29, -6], [10, -60]];
  s += H(T, alles, 900, fl, 1.6, { farben: [[M, 3, 0.15, 0.22], [D, 1, 0.14, 0.2], [L, 3, 0.14, 0.3]], streuung: 14, kruemmung: 0.15, szene: 0.15 });
  const rk = rumpf.slice(1, 9);
  s += H(T, [...rk.map(([x, y]) => [x, y + 0.6]), ...rk.slice().reverse().map(([x, y]) => [x, y + 2.6])], 120, 182, 1.8,
    { farben: [[M, 2, 0.26, 0.6], [L, 1, 0.24, 0.55]], streuung: 22, szene: 0.15 });
  s += H(T, [[64, -55], [100, -48], [118, -50], [100, -46.5], [64, -52.5]], 70, 100, 3.4, { farben: [[W, 2, 0.3, 0.75], [L, 1, 0.28, 0.6]], szene: 0.15 });
  s += H(T, [[150, -76], [160, -78], [156, -70], [148, -67]], 26, 112, 2.6, { farben: [[W, 1, 0.22, 0.5]], szene: 0.15 });
  s += H(T, [[100, -60], [114, -50], [110, -44], [100, -50]], 26, 110, 3, { farben: [[L, 1, 0.26, 0.6]], szene: 0.15 }); // Ellbogenbüschel

  s += KG;
  /* --- Ohr: klein, abgerundet, weit hinten; Außenseite fellfarben mit dunklem Saum, helles Innenhaar an der Vorderkante --- */
  s += K(T, [[157, -101.6], [157.2, -105.4], [159.6, -108.4], [162.4, -107.8], [163.6, -104.6], [162.8, -101.8]], T.lg("ohr", [[0, "#4a3018"], [0.3, "#8e6539"], [1, "#b48852"]]), {
    rw: 0.4, randA: 0.3, rand: "#2a1a0c", innen: fleck(T, 159, -105.4, 2, 2.8, HL, 0.35) + LI([[157.4, -104.8], [158.6, -107.4], [160.8, -108.4]], "#2a1a0c", 0.8, ` opacity=".5"`) });
  s += H(T, [[162, -102.6], [162.8, -107], [164, -104.6], [163.4, -102]], 12, 290, 2, { farben: [[W, 1, 0.16, 0.85]], szene: 0 });

  /* --- Gesicht --- */
  /* Nasenspiegel: dunkel rosabraun, feucht glänzend, Nasenloch als Komma */
  s += K(T, [[194.6, -94.4], [196.9, -93.1], [197.7, -91], [196.8, -89.9], [195.2, -90], [194.2, -92]], T.lg("nase", [[0, "#7a5044"], [1, "#2e1c16"]]), {
    rw: 0.3, randA: 0.45, vol: false, innen: `<path d="M197.2-90.8q-1-.3-1.5.7" stroke="#0a0505" stroke-width=".65" fill="none"/>` + fleck(T, 195.8, -93.4, 0.9, 0.4, HL, 0.6) });
  /* Nasenrinne, Lippenlinie (kurz, katzentypisch), Kinn */
  s += LI([[196.6, -89.6], [196.3, -87.4], [195.2, -84.6]], "#2a1a12", 0.4, ` opacity=".6"`);
  s += LI([[193, -82.4], [189, -81.6], [184, -81.8], [179.6, -83.4]], "#1a0f08", 0.55, ` opacity=".7"`);
  s += LI([[181, -79.2], [184.6, -78.4]], "#2a1a12", 0.4, ` opacity=".45"`);
  if (fein) {
    let d = "";
    for (let r = 0; r < 4; r++) for (let i = 0; i < 5; i++) d += "M" + zf(187.6 + i * 1.45 + r * 0.5, -89 + r * 1.4) + "h.1";
    s += `<path d="${d}" stroke="#3a2414" stroke-width=".55" stroke-linecap="round" opacity=".6"/>`;
  }
  /* Säbel: flache Klinge, Vorderkante gewölbt, leicht nach hinten gebogen, Hinterkante fein gesägt */
  const saebel = [[184.6, -81.8], [189.8, -81.8], [190.2, -76.8], [189.4, -71.4], [187.8, -66.8], [184.6, -63.2, 1], [184.8, -67.2], [184.6, -71.8], [184.2, -76.8]];
  s += K(T, saebel, T.lg("zahn", [[0, "#fbf6ea"], [0.45, "#ece3cc"], [1, "#bfae8e"]], 0, 0, 1, 0), { rw: 0.35, randA: 0.5, vol: false, innen:
    fleck(T, 188.7, -75.6, 1, 6.5, "#fff", 0.7) + fleck(T, 185.6, -71.6, 0.9, 7, "#8a7a60", 0.4) + fleck(T, 187.2, -81.6, 3.4, 1.5, "#a08a66", 0.45) +
    (fein ? `<path d="M185.1-78.6l-.3.45.3.45-.3.45.3.45-.3.45.3.45-.3.45.3.45-.3.45.3.45-.3.45.3.45-.3.45" stroke="#9a8a6c" stroke-width=".1" opacity=".6" fill="none"/>` : "") });
  /* Schneidezähne unter der Nase, kleiner unterer Eckzahn vor dem Säbel */
  s += F([[190.8, -82], [193.2, -82.4], [193.4, -81.6], [192.2, -81], [191, -81.2]], "#e8dcc4", ` stroke="#7a6a50" stroke-width=".15"`);
  s += F([[182.6, -79.4], [184.2, -80], [184, -77.8]], "#e6dcc6", ` stroke="#7a6a50" stroke-width=".2"`);
  /* Auge: groß, nach vorn, bernsteingelb, runde Pupille; dunkler Lidstrich, heller Ring, Tränenstreifen */
  s += AUGE(T, 179.4, -99.4, 1.75, { iris: "#c8902e", iris2: "#6a3e12", offen: 0.68, winkel: -14, lid: "#120a05", pupille: "rund" });
  s += LI([[182, -97.8], [183.6, -95.6], [184.8, -93.4]], "#3a2410", 0.45, ` opacity=".3"`);
  s += LI([[174, -102.4], [179, -103.4], [183.6, -101.6]], "#5a3a1c", 0.5, ` opacity=".3"`);
  /* Tasthaare */
  if (fein) s += T.schnurrhaare(190, -86, 9, 17, 172, 36, "#f6efe2", 0.17) + T.schnurrhaare(179, -102.6, 3, 6, 215, 30, "#f6efe2", 0.13);

  s += "</g>";

  return { svg: s, box: [2.4, -106.2, 203.2, 0] };
}

/* =====================================================================
   DAS WOLLNASHORN (Coelodonta antiquitatis)
   RECHERCHE: Kopf-Rumpf 3,2–3,6 m, Schulterhöhe 1,45–1,6 m, bis 2 t. Kräftiger
   Schulterbuckel (trägt das schwere Horn, Fettspeicher). Kopf tief getragen (Grasfresser,
   breite eckige Oberlippe wie beim Breitmaulnashorn). Vorderes Horn 1–1,35 m lang,
   seitlich flach gedrückt, schräg nach vorn-oben, Vorderkante vom Schneeschieben
   abgeschliffen; hinteres Horn bis ~47 cm. Kleine Augen, kleine spitze Ohren mit
   Haarbüschel, kurzer Schwanz mit Quaste, kurze stämmige Beine mit drei Zehen (Hufnägel).
   Fell (Mumien aus Sibirien, Sasha 2015): dichte Unterwolle, darunter rotbraun bis
   dunkelbraun, langes Haar an Hals, Buckel und Bauch, kürzer an Beinen und Kopf.
   Chauvet: dunkles Band um die Körpermitte.
   ===================================================================== */
function wollnashorn(T) {
  GEN = 1;
  const fein = T.fein !== false;
  T._sz = 0.3; FLMIN = 0.35;
  const NF = fein ? 1 : 0.5;
  const fell = T.lg("fell", [[0, "#8a5a32"], [0.25, "#6e4426"], [0.6, "#4a2c18"], [1, "#24150b"]], 0, -160, 0, -40, UB);
  const beinF = T.lg("bein", [[0, "#4a2e1a"], [0.6, "#33200f"], [1, "#22150a"]], 0, -100, 0, 0, UB);
  const fern = T.lg("fern", [[0, "#2e1d10"], [1, "#160d06"]], 0, -100, 0, 0, UB);
  const horn = T.lg("horn", [[0, "#2c241e"], [0.55, "#4a3e34"], [1, "#7a6c5c"]], 0, 1, 1, 0);
  const DUN = "#120a04", MIT = "#40261a", ROT = "#7a4824", HELL = "#b8804a", SPITZ = "#d8a46c", W = "#fff3dc", S0 = "#000";
  let s = "";

  const oben = [[16, -112], [22, -128], [40, -138], [74, -142], [118, -140], [160, -146], [200, -156], [222, -159], [246, -152], [268, -138], [288, -122], [300, -112]];
  const tiefe = (x, y) => y - bei(oben, Math.max(16, Math.min(300, x)));
  const fluss = (x, y) => { const t = tiefe(x, y); return x > 250 ? 88 + 30 * Math.exp(-t / 16) - 10 : 97 + 50 * Math.exp(-t / 20); };
  const laenge = (x, y) => (x > 286 ? 10 : 10 + 30 * Math.min(1, Math.max(0, tiefe(x, y) / 90)) + (x > 190 && x < 285 ? 10 : 0));

  /* Bein: kurz, säulenartig, drei Zehen mit Hufnägeln */
  const bein = (x0, x1, v = 0) => [[x0 - 4, -110], [x1 + 4, -110], [x1 + 4 + v * 0.3, -70], [x1 + v * 0.7, -36], [x1 + 2 + v, -14], [x1 + 6 + v, 0, 1],
    [x0 - 5 + v, 0, 1], [x0 - 2 + v, -14], [x0 + v * 0.7, -36], [x0 - 3 + v * 0.3, -72]];
  const beinZ = (x0, x1, v, nah) => {
    let b = K(T, bein(x0, x1, v), nah ? beinF : fern, { rand: false, innen: modell(T, bein(x0, x1, v), nah ? SPITZ : ROT, nah ? 0.3 : 0.25, 0.35, -100, -10, 6) });
    const fu = K(T, [[x0 - 4 + v, 0, 1], [x0 - 4 + v, -5], [x0 + v, -11], [x0 + 10 + v, -14], [x1 - 10 + v, -14], [x1 + 1 + v, -11], [x1 + 5 + v, -5], [x1 + 6 + v, 0, 1]], nah ? "#3e342e" : "#1a1512", { rand: false,
      innen: fleck(T, x0 + 6 + v, -10, 14, 5, W, 0.18) + fleck(T, (x0 + x1) / 2 + v, -1, 30, 4, S0, 0.5) });
    b += RF(T, "fuss", { f: 0.7, tiefe: 0.3, okt: 2 }, fu);
    if (nah) {
      const nx = [x1 - 2, x1 - 15, x1 - 28].map((x) => x + v);
      const ng = T.lg("huf", [[0, "#6e6252"], [1, "#3a322a"]]);
      b += nx.map((x) => F([[x - 4.5, -0.5, 1], [x - 4.5, -3], [x - 2, -6.5], [x + 2, -6.5], [x + 4.5, -3], [x + 4.5, -0.5, 1]], ng, ` stroke="#1a1410" stroke-width=".6" stroke-opacity=".6"`)).join("");
      b += `<path d="${nx.map((x) => "M" + zf(x - 2, -6) + "q2-1 4 0").join("")}" stroke="#fff" stroke-opacity=".35" stroke-width=".7" fill="none"/>`;
    }
    b += H(T, [[x0 - 4, -105], [x1 + 4, -105], [x1 + 2 + v * 0.8, -26], [x0 - 2 + v * 0.8, -26]], nah ? 90 : 40, 93, (x, y) => 10 + (y + 105) * 0.06,
      { farben: nah ? [[DUN, 3, 1.4, 0.7], [MIT, 3, 1.3, 0.7], [ROT, 2, 1.1, 0.6], [HELL, 1, 0.9, 0.5]] : [[DUN, 2, 1.4, 0.6], [MIT, 1, 1.2, 0.5]], szene: nah ? 0.2 : 0 });
    return b;
  };

  /* --- ferne Beine --- */
  s += beinZ(196, 236, -8, false) + beinZ(68, 108, 8, false);
  /* --- Schwanz mit Quaste --- */
  s += K(T, [[22, -122], [14, -116], [9, -100], [8, -86], [13, -86], [15, -100], [22, -110]], "#2e1b0e", { rand: false });
  s += H(T, [[6, -92], [15, -92], [15, -84], [6, -84]], 30, 98, 18, { farben: [[DUN, 2, 1.3, 0.75], [MIT, 1, 1.1, 0.65]], kruemmung: 0.12, szene: 0.4 });
  /* --- nahe Beine --- */
  s += beinZ(206, 248, 6, true) + beinZ(44, 92, -6, true);

  /* --- Rumpf mit Hals und Kopf (Kopf tief, Buckel hoch), zottiger Bauch --- */
  const bauch = [[296, -56], [276, -64], [252, -70], [210, -70], [160, -66], [110, -68], [76, -74], [52, -80]];
  const lang = (t) => (t < 0.3 ? 26 : 18 + 8 * Math.sin(t * Math.PI));
  s += F([...bauch.slice().reverse().map(([x, y]) => [x, y - 14]), ...fransen(T, bauch, Math.round(18 * NF), (t) => lang(t) + 4, -0.18, 0.8)], "#170c05");
  const rumpf = [...oben, [312, -106], [324, -96], [334, -84], [344, -72], [352, -60], [355, -48], [352, -40], [344, -36], [330, -38], [314, -44], [300, -50],
    ...fransen(T, bauch, Math.round(26 * NF), lang, -0.14, 0.85), [40, -84], [26, -96], [18, -104]];
  const BX = [0, -170, 360, -30];
  s += K(T, rumpf, fell, { rw: 0.9, randA: 0.18, innen:
    TX(T, "wolle", { fx: 0.4, fy: 0.045, farbe: "#d9a466", staerke: 2.2, schwelle: 0.6, okt: 3 }, 8, 0.28, BX) +
    TX(T, "straehne", { fx: 0.26, fy: 0.024, farbe: "#000", staerke: 2.4, schwelle: 0.52, okt: 2, seed: 11 }, 10, 0.38, BX) +
    /* Licht auf Buckel, Rücken, Kruppe; dunkles Band um die Mitte (Chauvet); Schulter, Keule */
    fleck(T, 200, -150, 60, 14, SPITZ, 0.5, -10) + fleck(T, 80, -136, 70, 12, SPITZ, 0.4) + fleck(T, 140, -100, 26, 50, S0, 0.3) +
    fleck(T, 230, -110, 26, 34, SPITZ, 0.18) + fleck(T, 196, -86, 22, 30, S0, 0.3) + fleck(T, 70, -108, 30, 26, SPITZ, 0.2) + fleck(T, 104, -84, 20, 26, S0, 0.28) +
    fleck(T, 170, -64, 120, 12, S0, 0.4) + fleck(T, 300, -70, 40, 30, S0, 0.25) + fleck(T, 160, -60, 100, 8, ROT, 0.35) });

  /* Haar für Haar */
  const innen = [[22, -124], [74, -138], [160, -142], [222, -155], [266, -136], [290, -116], [300, -100], [296, -60], [210, -66], [110, -64], [52, -78], [20, -104]];
  s += H(T, innen, 360, fluss, laenge, { farben: [[DUN, 5, 1.6, 0.5], [MIT, 4, 1.4, 0.55], [ROT, 3, 1.2, 0.5]], szene: 0.2 });
  const licht = [[26, -128], [74, -141], [160, -145], [222, -158], [262, -140], [240, -132], [160, -128], [74, -126], [30, -114]];
  s += H(T, licht, 170, fluss, (x, y) => laenge(x, y) * 0.8, { farben: [[HELL, 3, 1.1, 0.5], [SPITZ, 2, 0.9, 0.45], [ROT, 2, 1, 0.45]], szene: 0.2 });
  const kamm = oben.slice(1, 11);
  s += H(T, [...kamm.map(([x, y]) => [x, y + 4]), ...kamm.slice().reverse().map(([x, y]) => [x, y + 1])], 60, (x) => (x > 200 && x < 260 ? 220 : 175), 8,
    { farben: [[ROT, 2, 1, 0.55], [HELL, 1, 0.9, 0.5]], streuung: 22, szene: 0.15 });
  /* Bauch- und Halsmähne: lange Strähnen über der Kante */
  const rz = [...bauch.map(([x, y]) => [x, y - 22]), ...bauch.slice().reverse().map(([x, y]) => [x, y + 4])];
  s += H(T, rz, 150, 94, (x) => (x > 250 ? 32 : 26), { farben: [[DUN, 4, 1.7, 0.85], [MIT, 3, 1.5, 0.85], [ROT, 2, 1.2, 0.8]], kruemmung: 0.14, szene: 0.2 });

  /* --- Hörner: Keratin, faserig, seitlich flach; vorderes lang, erst flach nach vorn, dann aufwärts geschwungen,
     Vorderkante vom Schneeschieben abgeschliffen; hinteres auf der Stirn --- */
  const h2 = [[312, -96], [314, -106], [316, -116], [315, -126]];
  s += K(T, rohr(h2, 20, 3), horn, { randA: 0.4, innen: LI(quer(h2, 20, 3, 0.3), "#9a8c7a", 1, ` opacity=".35"`) + LI(quer(h2, 20, 3, -0.4), "#1a1410", 0.8, ` opacity=".4"`) });
  const h1 = [[334, -62], [352, -72], [368, -86], [382, -102], [394, -120], [404, -138], [412, -154]];
  let fasern = "";
  if (fein) for (const q of [-0.6, -0.3, 0, 0.3, 0.6]) fasern += LI(quer(h1, 34, 5, q), q > 0 ? "#a09080" : "#1a1410", 0.7, ` opacity="${q > 0 ? 0.3 : 0.35}"`);
  s += K(T, rohr(h1, 34, 5, true, 0.75), horn, { randA: 0.4, innen: fasern + LI(quer(h1, 34, 5, 0.75).slice(1, 6), "#d8ccb8", 1.6, ` opacity=".45"`) +
    LI(quer(h1, 34, 5, -0.85).slice(0, 5), "#8a7c6a", 2.4, ` opacity=".55"`) + fleck(T, 340, -68, 16, 10, S0, 0.5) });

  /* --- Kopf: kurzes Haar (wächst über die Hornbasis), kleines Auge, Ohr mit Büschel, breite Oberlippe --- */
  s += H(T, [[290, -118], [312, -104], [326, -84], [338, -64], [340, -46], [304, -56], [292, -90]], 160, (x, y) => 70 + (x - 290) * 0.2, 8,
    { farben: [[DUN, 2, 1, 0.55], [MIT, 2, 1, 0.55], [ROT, 2, 0.9, 0.5]], szene: 0.2 });
  s += H(T, [[306, -100], [320, -100], [320, -92], [306, -92]], 20, 80, 6, { farben: [[MIT, 1, 0.9, 0.6], [ROT, 1, 0.8, 0.55]], szene: 0 });
  /* Ohr: klein, tütenförmig, aufgestellt, Haarbüschel an der Spitze */
  s += K(T, [[280, -118], [278, -128], [280, -138], [284, -141], [289, -134], [292, -120]], T.lg("ohr", [[0, "#6e4426"], [1, "#3a2414"]]), { randA: 0.15,
    innen: fleck(T, 285, -128, 3, 8, S0, 0.45) + fleck(T, 281, -132, 2, 6, SPITZ, 0.3) });
  s += H(T, [[277, -142], [281, -138], [285, -136], [280, -140]], 16, 255, 6, { farben: [[MIT, 1, 0.9, 0.7], [ROT, 1, 0.8, 0.6]], szene: 0 });
  /* Maul: breite, eckige Oberlippe (Grasfresser), Maulspalte, Nasenloch; nackte, runzlige Haut */
  s += RF(T, "haut", { f: 0.5, tiefe: 0.4, okt: 2 }, F([[334, -58], [346, -60], [353, -54], [355, -46], [352, -40], [338, -40], [330, -48]], "#3a2c24", ` opacity=".45"`));
  s += fleck(T, 344, -52, 8, 5, W, 0.15);
  s += LI([[330, -41], [342, -42], [351, -41]], "#0e0805", 1, ` opacity=".7"`);
  s += `<path d="M343-60q4-3 7 1q-3 2-7-1z" fill="#0c0705"/>`;
  /* Auge: klein, tief, mit Lidfalten und Wimpern */
  s += fleck(T, 312, -84, 7, 4, "#1a120c", 0.8);
  s += AUGE(T, 312, -84, 1.9, { iris: "#5a3a1e", iris2: "#24140a", offen: 0.55, winkel: 20, lid: "#100a06", wimpern: 9, wimpernLaenge: 1.2 });
  s += `<path d="M306-89q6-3 12 2M307-79q5 2 10 0" fill="none" stroke="#0c0603" stroke-width=".7" opacity=".5"/>`;

  return { svg: s, box: [6, -160, 416, 0] };
}

/* =====================================================================
   DER RIESENHIRSCH (Megaloceros giganteus, „Irischer Elch")
   RECHERCHE: Schulterhöhe bis 2,1 m, 450–700 kg, Kopf-Rumpf ~3,1 m. Geweih der Hirsche
   bis 3,6 m Spannweite und ~40 kg: breite Schaufeln, hinten/oben eine Reihe Sprossen,
   vorn eine kurze, oft schaufelige Augsprosse. Starker Hals (trägt das Geweih), lange
   schlanke Läufe, Paarhufer mit Afterklauen. Höhlenbilder (Cougnac, Lascaux, Chauvet)
   zeigen immer einen dunklen, runden Fettbuckel über dem Widerrist, einen dunklen
   Streifen von der Schulter schräg nach unten, eine dunkle Flankenlinie, ein dunkles
   Halsband an der Kehle und einen hellen Hals und Kopf (Naish, Tetrapod Zoology).
   Kurzer Schwanz, Spiegel hell. Ohren lang-oval, großes dunkles Auge mit Voraugendrüse.
   ===================================================================== */
function riesenhirsch(T) {
  GEN = 1;
  const fein = T.fein !== false;
  T._sz = 0.2; FLMIN = 0.33;
  const fell = T.lg("fell", [[0, "#6e5236"], [0.18, "#8c6a46"], [0.4, "#a4825a"], [0.6, "#b89a72"], [0.8, "#cdb894"], [1, "#4a3826"]], 0, -215, 0, 0, UB);
  const fern = T.lg("fern", [[0, "#6a5034"], [1, "#2e2216"]], 0, -170, 0, 0, UB);
  const gew = T.lg("geweih", [[0, "#5a4630"], [0.5, "#8e7452"], [1, "#d6c6a4"]], 0, 1, 0, 0);
  const gewF = T.lg("geweihF", [[0, "#4a3a28"], [0.6, "#6e5a40"], [1, "#a8977a"]], 0, 1, 0, 0);
  const D = "#3a2818", M = "#7a5c3c", L = "#d8c4a0", W = "#f2e8d6", S0 = "#000", HL = "#fff4e0";
  let s = "";

  /* --- Teile --- */
  const rumpf = [[8, -168], [24, -182], [60, -189], [110, -190], [160, -196], [188, -206], [204, -217], [220, -223], [236, -219], [250, -211], [266, -220], [282, -236], [296, -256],
    [306, -268], [314, -270], [326, -266], [340, -256], [354, -246], [364, -239], [369, -233], [368, -226], [364, -221], [356, -219], [342, -222], [328, -228], [318, -232],
    [310, -220], [302, -202], [292, -180], [280, -158], [266, -138], [250, -121], [226, -113], [200, -114], [160, -117], [120, -119], [96, -125], [80, -133], [60, -139],
    [30, -143], [10, -150], [4, -158]];
  const vbein = (dx) => [[212, -160], [244, -164], [252, -140], [248, -118], [244, -96], [241, -72], [240, -58], [242, -48], [241, -34], [242, -21], [246, -12], [250, -4],
    [252, 0, 1], [232, 0, 1], [233, -6], [231, -14], [230, -24], [229, -40], [228, -54], [227, -64], [226, -80], [224, -100], [220, -114], [212, -124], [206, -140]].map(([x, y, h]) => [x + dx, y, h]);
  const hbein = (dx) => [[18, -160], [70, -168], [92, -150], [100, -128], [94, -112], [82, -98], [68, -84], [56, -72], [52, -60], [52, -40], [52, -22], [55, -12], [58, -4],
    [60, 0, 1], [42, 0, 1], [42, -6], [40, -14], [38, -24], [37, -44], [36, -62], [34, -72], [30, -80], [24, -96], [16, -116], [10, -134], [8, -150]].map(([x, y, h]) => [x + dx, y, h]);
  const huf = (x0, x1, dunkel) => F([[x0, 0, 1], [x0 + 1, -6], [x0 + 4, -10], [x1 - 5, -10], [x1 - 1, -4], [x1 + 1, 0, 1]], dunkel ? "#141008" : T.lg("huf", [[0, "#4a3e30"], [1, "#16110c"]])) +
    `<path d="M${zf((x0 + x1) / 2 + 1, -9)}l1 9" stroke="#0a0806" stroke-width=".9" opacity=".7"/>`;
  const afterklaue = (x, y) => F([[x, y], [x - 4, y + 4], [x - 1, y + 6], [x + 2, y + 2]], "#1e1810");

  /* --- fernes Geweih (zeigt nach vorn, liegt hinter dem Kopf) --- */
  /* Schaufel: von der Stange aus weit nach hinten (nahes Geweih) bzw. nach vorn (fernes, perspektivisch) ausladend,
     oben eine Reihe kräftiger Sprossen, hinten die Endsprosse */
  /* Sprossen: spitz zulaufend (harte Spitze, weiche Flanken), unterschiedlich lang, die hinteren nach hinten geneigt */
  const schaufel = [[306, -270], [300, -290], [296, -312], [298, -334, 1], [290, -326], [281, -330], [278, -354, 1], [268, -334], [258, -336],
    [255, -363, 1], [246, -338], [236, -338], [229, -358, 1], [223, -338], [212, -336], [202, -352, 1], [199, -333], [188, -330],
    [174, -342, 1], [177, -325], [166, -320], [145, -320, 1], [162, -307], [182, -299], [210, -298], [240, -296], [264, -292], [282, -286],
    [292, -278], [296, -268]];
  const fernG = schaufel.map(([x, y]) => [310 + (310 - x) * 0.72, y - 6 + (x - 300) * 0.03]);   // perspektivisch verkürzt
  s += K(T, fernG, gewF, { randA: 0.35, rw: 0.7, innen: fleck(T, 320, -290, 14, 16, S0, 0.35) +
    LI([[316, -284], [330, -300], [360, -310], [400, -314]], "#2a2014", 1.2, ` opacity=".3"`) });

  /* --- ferne Beine (Schatten) --- */
  s += K(T, vbein(-16), fern, { rw: 0.5, randA: 0.25, innen: modell(T, vbein(-16), HL, 0.22, 0.32, -150, -6, 10) + LI([[213, -54], [214, -30], [215, -18]], "#000", 0.7, ` opacity=".3"`) });
  s += huf(216, 236, true);
  s += K(T, hbein(16), fern, { rw: 0.5, randA: 0.25, innen: modell(T, hbein(16), HL, 0.22, 0.32, -150, -6, 10) + LI([[53, -70], [54, -40], [56, -20]], "#000", 0.7, ` opacity=".3"`) });
  s += huf(58, 76, true);

  /* --- Körper, nahe Beine, Hals und Kopf als EINE Fläche --- */
  const BX = [0, -275, 372, 0];
  /* weicher Streifen: Kette weicher Flecken entlang einer Linie (wie mit Kohle gewischt) */
  const band = (pts, w, op) => {
    let o = "";
    for (let i = 0; i <= 20; i++) { const p = entlang(pts, i / 20), q = entlang(pts, Math.min(1, i / 20 + 0.02)); o += fleck(T, p[0], p[1], w * 1.6, w, D, op, Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI); }
    return o;
  };
  const innen =
    TX(T, "kurzfell", { fx: 0.7, fy: 0.1, farbe: "#3a2614", staerke: 2.2, schwelle: 0.6, okt: 3 }, 80, 0.2, BX) +
    TX(T, "kurzfellH", { fx: 0.6, fy: 0.08, farbe: "#fbecd0", staerke: 2.2, schwelle: 0.62, okt: 2, seed: 9 }, 80, 0.22, BX) +
    /* heller Hals und Kopf, heller Bauch, dunkle Beine unten */
    fleck(T, 288, -214, 40, 58, "#e4d2b0", 0.55, -40) + fleck(T, 336, -246, 30, 16, "#e4d2b0", 0.5, 30) + fleck(T, 160, -122, 80, 10, W, 0.45) +
    /* Höhlenbild-Zeichnung: dunkler Buckel, Schulterstreifen, Flankenlinie, Halsband */
    fleck(T, 220, -214, 32, 14, D, 0.9) + fleck(T, 218, -206, 44, 22, D, 0.4) +
    band([[232, -206], [228, -186], [220, -164], [212, -146]], 7, 0.3) + band([[212, -148], [170, -144], [120, -146], [80, -152]], 5, 0.22) +
    band([[278, -158], [286, -176], [296, -196], [306, -214]], 8, 0.3) +
    /* Licht von links oben, Rumpf rund, Muskeln (Schulter, Keule, Unterarm) */
    fleck(T, 120, -184, 80, 10, HL, 0.4, -3) + fleck(T, 50, -170, 34, 14, HL, 0.35) + fleck(T, 236, -150, 16, 22, HL, 0.25) +
    fleck(T, 160, -126, 90, 12, S0, 0.3) + fleck(T, 258, -150, 8, 22, S0, 0.25) + fleck(T, 214, -118, 10, 18, S0, 0.3) + fleck(T, 86, -122, 10, 18, S0, 0.3) +
    fleck(T, 24, -120, 12, 26, HL, 0.2) + fleck(T, 312, -232, 14, 6, S0, 0.25) +
    /* Läufe unten dunkler, Sehnen */
    fleck(T, 240, -30, 14, 36, D, 0.45) + fleck(T, 50, -36, 14, 40, D, 0.45) +
    LI([[37, -70], [38, -40], [40, -20]], "#1e140a", 0.8, ` opacity=".4"`) + LI([[229, -54], [230, -30], [231, -18]], "#1e140a", 0.7, ` opacity=".4"`) +
    LI([[226, -80], [222, -100], [220, -112]], "#1e140a", 0.7, ` opacity=".3"`) +
    /* Spiegel (heller Fleck am Hinterteil) */
    fleck(T, 10, -160, 8, 14, W, 0.55) +
    /* Schnauze dunkler */
    fleck(T, 360, -232, 10, 8, "#4a3a2c", 0.6) + modell(T, vbein(0), HL, 0.2, 0.25, -110, -6, 9) + modell(T, hbein(0), HL, 0.2, 0.25, -110, -6, 9);
  s += silhouette(T, [rumpf, vbein(0), hbein(0)], fell, innen, "#1e140a", 0.8);
  s += huf(232, 252, false) + huf(42, 60, false) + afterklaue(231, -14) + afterklaue(41, -14);

  /* --- Fell: kurz, im Strich; am Buckel und an der Kehle länger (Mähne) --- */
  const fl = (x, y) => {
    if (x > 250 && y < -170) return 120;                   // Hals: nach unten-hinten
    if (y > -118 && (x < 100 || (x > 205 && x < 255))) return 94;
    return 176 + (y + 160) * 0.3;
  };
  s += H(T, [[10, -165], [60, -186], [190, -203], [246, -202], [300, -262], [366, -238], [356, -222], [300, -226], [258, -140], [246, -10], [232, -10], [220, -116],
    [96, -126], [56, -62], [56, -10], [42, -10], [10, -134]], 900, fl, 3, { farben: [[M, 3, 0.3, 0.28], [D, 1, 0.28, 0.25], [L, 3, 0.26, 0.32]], streuung: 14, szene: 0.15 });
  s += H(T, [[188, -205], [204, -216], [220, -222], [236, -218], [250, -210], [236, -213], [220, -217], [204, -211], [188, -201]], 80, 196, 8, { farben: [[D, 2, 0.6, 0.7], [M, 1, 0.5, 0.6]], streuung: 30, szene: 0.2 });
  s += H(T, [[272, -160], [288, -184], [304, -210], [314, -226], [304, -208], [282, -160]], 80, 108, 11, { farben: [[D, 2, 0.6, 0.65], [M, 1, 0.5, 0.6], [L, 1, 0.45, 0.5]], szene: 0.2 });
  s += H(T, [[120, -122], [210, -118], [210, -112], [120, -116]], 50, 96, 5, { farben: [[W, 1, 0.35, 0.6]], szene: 0.1 });

  /* --- Kopf: Ohr, Auge mit Voraugendrüse, Nase, Maul --- */
  s += LI([[337, -250.6], [341, -248.6], [345, -245.6]], "#1e140a", 1, ` opacity=".7"`);
  s += AUGE(T, 331, -253, 2.7, { iris: "#3a2410", iris2: "#140a04", offen: 0.66, winkel: 14, lid: "#0e0904", wimpern: 10, wimpernLaenge: 1, weiss: false });
  s += K(T, [[363.6, -239], [367.6, -236], [369.4, -232], [366.6, -229.6], [363, -232]], T.lg("nase", [[0, "#3a3028"], [1, "#0e0a08"]]), { rw: 0.4, randA: 0.5, vol: false,
    innen: fleck(T, 365, -237, 2, 1, HL, 0.6) + `<path d="M368-232q-2 0-3-3" stroke="#000" stroke-width=".9" fill="none"/>` });
  s += LI([[365, -224], [358, -223], [350, -224]], "#140c06", 0.8, ` opacity=".7"`);
  if (fein) s += T.schnurrhaare(362, -228, 4, 5, 170, 30, "#3a2a1a", 0.15);

  /* --- nahes Geweih: Rosenstock, kurze Augsprosse vorn, breite Schaufel mit Sprossen nach hinten-oben --- */
  const nahG = schaufel;
  let rillen = "";
  if (fein) for (let i = 0; i < 8; i++) rillen += LI([[298, -280], [286, -296 - i * 1.5], [250, -302 - i * 3], [200 - i * 4, -302 - i * 2.6], [160 + i * 4, -304 - i * 2]], i % 2 ? "#fff4dc" : "#3a2a1a", 0.8, ` opacity="${i % 2 ? 0.22 : 0.26}"`);
  s += K(T, nahG, gew, { randA: 0.4, rw: 0.8, innen: rillen + fleck(T, 298, -282, 10, 14, S0, 0.4) + fleck(T, 230, -330, 70, 16, HL, 0.3) +
    fleck(T, 230, -298, 80, 6, S0, 0.25) });
  /* Augsprosse (schaufelig, nach vorn) und Rose am Rosenstock */
  s += K(T, [[305, -276], [316, -280], [328, -288], [336, -298], [331, -299], [326, -294], [324, -300], [319, -299], [314, -290], [303, -285]], gew, { randA: 0.4, rw: 0.7 });
  s += F([[297, -268], [301, -272.5], [306, -273], [311, -270], [309, -266.5], [302, -266]], "#4a3a28", ` stroke="#2a1e12" stroke-width=".6" stroke-dasharray="1.2 .8"`);
  /* Ohr: lang-oval, nach hinten-oben gerichtet, vor dem Geweih sichtbar */
  s += K(T, [[302, -262], [288, -266], [272, -273], [262, -279, 1], [270, -282.6], [288, -280], [304, -270]], T.lg("ohr", [[0, "#b8966a"], [1, "#6e5236"]]), { rw: 0.5, randA: 0.3,
    innen: LI([[298, -268], [284, -273], [270, -279]], "#3a2818", 1.2, ` opacity=".3"`) + H(T, [[272, -280], [290, -276], [300, -270]], 12, 195, 4, { farben: [[W, 1, 0.3, 0.6]], szene: 0 }) });

  /* Schwanz: kurz, oben dunkel */
  s += K(T, [[12, -170], [5, -166], [1, -154], [2, -142], [7, -144], [10, -156]], T.lg("schwanz", [[0, "#3a2818"], [1, "#6e5236"]]), { rw: 0.4, randA: 0.3 });

  return { svg: s, box: [-2, -366, 432, 0] };
}

/* =====================================================================
   DER HÖHLENBÄR (Ursus spelaeus)
   RECHERCHE: Männchen 350–600 kg, Weibchen 225–250 kg; Kopf-Rumpf 2,5–3 m, Schulterhöhe
   auf allen vieren ~1,3–1,5 m. Kennzeichen: sehr breiter, gewölbter Schädel mit steiler
   Stirn und deutlichem Stirnabsatz („frontal stop") – das unterscheidet ihn vom Braunbären;
   Rücken fällt von der hohen Schulter nach hinten ab (lange Vorderbeine, kurze
   Schienbeine), massige Vorderbeine, Sohlengänger mit langen, gebogenen Krallen,
   kurzer Schwanz, kleine runde Ohren, kleine Augen. Fell (angenommen) dicht und lang,
   dunkelbraun, an Rücken und Schulter heller bereift. Lebte und überwinterte in Höhlen
   (Chauvet: Kratzspuren, Schädel).
   ===================================================================== */
function hoehlenbaer(T) {
  GEN = 1;
  const fein = T.fein !== false;
  T._sz = 0.25; FLMIN = 0.32;
  const NF = fein ? 1 : 0.5;
  const fell = T.lg("fell", [[0, "#7a5434"], [0.25, "#5a3a22"], [0.6, "#3a2414"], [1, "#1e120a"]], 0, -145, 0, 0, UB);
  const fern = T.lg("fern", [[0, "#2e1d10"], [1, "#140c06"]], 0, -110, 0, 0, UB);
  const DUN = "#120a04", MIT = "#3a2414", ROT = "#6a4428", HELL = "#a87a50", SPITZ = "#cfa47a", W = "#fff3dc", S0 = "#000";
  let s = "";

  /* --- Teile: abfallender Rücken, hoher Schulterbuckel, Kopf mit steiler Stirn --- */
  const oben = [[6, -92], [12, -104], [28, -114], [60, -121], [100, -128], [140, -138], [168, -143], [190, -140], [210, -132], [224, -124]];
  const bauch = [[200, -74], [172, -64], [130, -60], [92, -62], [66, -70]];
  const rumpf = [...oben, [236, -126], [238, -116], [230, -96], [222, -84], ...fransen(T, bauch, Math.round(16 * NF), 12, -0.12, 0.8), [44, -78], [22, -80], [8, -84]];
  /* Kopf: hohe, gewölbte Stirn, steiler Stirnabsatz, kürzere Schnauze als beim Braunbären */
  const kopf = [[220, -116], [228, -128], [240, -134], [251, -131], [257, -122], [260, -111], [266, -105], [280, -100], [294, -95], [301, -91], [304, -85], [302, -79],
    [294, -75], [284, -72], [270, -70], [254, -72], [240, -78], [226, -90], [219, -104]];
  /* Vorderbein: Säule, Ellbogen hinten, Handgelenk, flache Tatze (Sohlengänger) */
  const vbein = (dx) => [[168, -116], [200, -118], [212, -100], [210, -80], [204, -60], [202, -40], [204, -24], [210, -14], [220, -8], [224, -3], [222, 0, 1],
    [176, 0, 1], [173, -6], [175, -18], [174, -34], [172, -50], [166, -64], [160, -84], [160, -100]].map(([x, y, h]) => [x + dx, y, h]);
  /* Hinterbein: kräftiger Oberschenkel, kurzes Schienbein, ganze Sohle am Boden */
  const hbein = (dx) => [[10, -100], [56, -112], [76, -96], [80, -76], [74, -58], [66, -40], [64, -24], [68, -12], [78, -6], [82, -2], [80, 0, 1], [26, 0, 1],
    [22, -6], [24, -18], [22, -34], [16, -50], [10, -66], [6, -82]].map(([x, y, h]) => [x + dx, y, h]);
  /* Krallen: lang, gebogen, hell an der Spitze */
  const krallen = (x, n, l) => {
    let d = "";
    for (let i = 0; i < n; i++) { const xx = x - i * 4.2, yy = -3.4 - i * 0.9; d += "M" + zf(xx, yy - 1.6) + "q" + zf(l * 0.65, -0.6, l, 3.4 + i * 0.3) + "q" + zf(-l * 0.4, -1.4, -l, 0.2) + "z"; }
    return `<path d="${d}" fill="${T.lg("kralle", [[0, "#2a221c"], [0.7, "#6e6050"], [1, "#c8b89c"]], 0, 0, 1, 0)}" stroke="#120c08" stroke-width=".4" stroke-opacity=".6"/>`;
  };

  /* --- ferne Beine --- */
  s += K(T, vbein(-18), fern, { rand: false, innen: modell(T, vbein(-18), ROT, 0.3, 0.35, -110, -6, 8) });
  s += krallen(218 - 18, 4, 10);
  s += K(T, hbein(18), fern, { rand: false, innen: modell(T, hbein(18), ROT, 0.3, 0.35, -100, -6, 8) });
  s += H(T, [[150, -100], [194, -100], [190, -14], [156, -14]], 50, 94, 10, { farben: [[DUN, 2, 1.2, 0.6], [MIT, 1, 1, 0.5]], szene: 0 });
  s += H(T, [[30, -90], [90, -90], [84, -12], [40, -12]], 50, 94, 10, { farben: [[DUN, 2, 1.2, 0.6], [MIT, 1, 1, 0.5]], szene: 0 });
  /* kurzer Schwanz */
  s += H(T, [[6, -100], [12, -100], [10, -92], [4, -92]], 26, 150, 9, { farben: [[MIT, 1, 1.2, 0.7], [DUN, 1, 1.2, 0.7]], szene: 0.3 });

  /* --- Körper, nahe Beine und Kopf als EINE Fläche --- */
  const BX = [0, -150, 310, 0];
  const innen =
    TX(T, "wolle", { fx: 0.5, fy: 0.06, farbe: "#c9955a", staerke: 2.2, schwelle: 0.6, okt: 3 }, 6, 0.22, BX) +
    /* Licht: Schulterbuckel, Rücken, Kruppe, Stirn; Schatten: Bauch, hinter dem Ellbogen, vor der Keule, Kehle */
    fleck(T, 160, -132, 50, 12, SPITZ, 0.45, -8) + fleck(T, 70, -118, 50, 10, SPITZ, 0.35) + 
    fleck(T, 186, -100, 18, 16, SPITZ, 0.22) + fleck(T, 40, -96, 22, 16, SPITZ, 0.22) +
    fleck(T, 130, -66, 70, 12, S0, 0.4) + fleck(T, 162, -82, 8, 22, S0, 0.35) + fleck(T, 84, -78, 8, 22, S0, 0.3) + fleck(T, 240, -82, 18, 10, S0, 0.35) +
    modell(T, vbein(0), SPITZ, 0.22, 0.28, -60, -8, 7) + modell(T, hbein(0), SPITZ, 0.22, 0.28, -60, -8, 7) +
    /* Schnauze heller, Nasenrücken */
    fleck(T, 286, -86, 16, 8, "#8a6a50", 0.5) + fleck(T, 276, -100, 10, 3, SPITZ, 0.35) + fleck(T, 244, -128, 12, 5, SPITZ, 0.4) + fleck(T, 262, -108, 4, 6, S0, 0.3);
  s += silhouette(T, [rumpf, vbein(0), hbein(0), kopf], fell, innen, "#120a04", 0.6);

  /* --- Fell Haar für Haar: lang, strähnig, nach hinten-unten; Kopf kurz --- */
  const tiefe = (x, y) => y - bei(oben, Math.max(6, Math.min(224, x)));
  const fluss = (x, y) => (x > 222 ? 185 - (y + 100) * 0.6 : (y > -64 && (x < 84 || (x > 160 && x < 214)) ? 92 : 100 + 55 * Math.exp(-tiefe(x, y) / 18)));
  const laenge = (x, y) => (x > 226 ? 5 : y > -50 ? 9 : 10 + 10 * Math.min(1, tiefe(x, y) / 50));
  const alles = [[10, -102], [60, -120], [168, -141], [222, -122], [222, -84], [214, -100], [204, -12], [176, -10], [162, -80], [80, -74], [66, -12], [28, -12], [8, -84]];
  s += H(T, alles, 700, fluss, laenge, { farben: [[DUN, 5, 1.2, 0.6], [MIT, 4, 1.1, 0.7], [ROT, 3, 1, 0.65]], szene: 0.2 });
  s += H(T, [[14, -106], [60, -121], [168, -142], [214, -130], [180, -124], [100, -116], [40, -104]], 260, fluss, (x, y) => laenge(x, y) * 0.8,
    { farben: [[HELL, 3, 0.9, 0.5], [SPITZ, 2, 0.8, 0.45], [ROT, 2, 0.9, 0.45]], szene: 0.2 });
  s += H(T, [...oben.map(([x, y]) => [x, y + 3]), ...oben.slice().reverse().map(([x, y]) => [x, y + 0.5])], 80, (x) => 172, 6, { farben: [[ROT, 2, 0.9, 0.55], [HELL, 1, 0.8, 0.5]], streuung: 24, szene: 0.15 });
  /* Bauch- und Ellbogenzotteln über der Kante */
  s += H(T, [...bauch.map(([x, y]) => [x, y - 12]), ...bauch.slice().reverse().map(([x, y]) => [x, y + 2])], 110, 95, 14, { farben: [[DUN, 3, 1.3, 0.85], [MIT, 2, 1.2, 0.85]], szene: 0.2 });
  s += H(T, [[160, -80], [170, -72], [168, -60], [158, -66]], 30, 110, 12, { farben: [[DUN, 2, 1.2, 0.8], [MIT, 1, 1.1, 0.75]], szene: 0.2 });
  /* Kopf: kurzes Haar, Stirn nach hinten gekämmt */
  s += H(T, [[224, -122], [240, -130], [252, -128], [262, -106], [296, -94], [300, -82], [266, -72], [240, -80], [224, -100]], 220, (x, y) => (x > 260 ? 182 : 196 + (y + 120) * 1.2), 4,
    { farben: [[DUN, 2, 0.7, 0.5], [MIT, 2, 0.7, 0.5], [ROT, 2, 0.6, 0.45], [HELL, 1, 0.5, 0.4]], streuung: 20, szene: 0.2 });
  /* Wangenbart */
  s += H(T, [[236, -96], [254, -88], [250, -72], [234, -80]], 50, 120, 9, { farben: [[MIT, 2, 1, 0.7], [ROT, 1, 0.9, 0.6]], szene: 0.2 });

  /* --- Ohren: klein, rund, weit hinten-oben --- */
  s += K(T, [[222, -124], [222, -134], [228, -140], [235, -138], [237, -130]], T.lg("ohr", [[0, "#3a2414"], [1, "#6a4428"]]), { rand: false,
    innen: fleck(T, 230, -133, 3, 4, S0, 0.5) });
  s += H(T, [[221, -126], [222, -136], [229, -141], [236, -138], [237, -130], [230, -128]], 60, (x) => 230 + (x - 228) * 4, 4.5, { farben: [[ROT, 2, 0.6, 0.7], [HELL, 1, 0.55, 0.6], [MIT, 1, 0.6, 0.7]], streuung: 30, szene: 0 });
  /* Flaum an Stirn und Nasenrücken (keine glatte Kante) */
  const kk = [[228, -128], [240, -134], [251, -131], [257, -122], [260, -111], [266, -105], [280, -100], [294, -95]];
  s += H(T, [...kk.map(([x, y]) => [x, y + 3]), ...kk.slice().reverse().map(([x, y]) => [x, y + 0.6])], 70, (x) => (x < 258 ? 200 : 170), 3.4, { farben: [[ROT, 2, 0.55, 0.6], [HELL, 1, 0.5, 0.55]], streuung: 25, szene: 0.1 });

  /* --- Gesicht: Nase, Maul, Auge --- */
  s += K(T, [[296, -95], [302.6, -92.6], [306, -87], [304, -82], [298, -82], [295, -87.4]], T.lg("nase", [[0, "#3a302a"], [1, "#0c0806"]]), { rw: 0.4, randA: 0.6, vol: false,
    innen: fleck(T, 300, -91.4, 2.4, 1.2, W, 0.6) + `<path d="M305-86q-3 0-4 3" stroke="#000" stroke-width="1" fill="none"/>` });
  s += LI([[302, -79.4], [294, -76.4], [284, -74.6], [276, -75.4]], "#0c0806", 0.9, ` opacity=".7"`);
  s += AUGE(T, 259, -108.6, 1.5, { iris: "#4a2c14", iris2: "#1a0e06", offen: 0.62, winkel: 8, lid: "#0c0704" });
  s += `<path d="M255-112.4q4-2.4 8 0" stroke="#0c0603" stroke-width=".6" fill="none" opacity=".35"/>`;
  if (fein) s += T.schnurrhaare(292, -80, 3, 5, 175, 30, "#2a1a0e", 0.2);

  /* --- Krallen der nahen Tatzen --- */
  s += krallen(218, 5, 12) + krallen(76, 5, 9);
  s += `<path d="M180-8q10 3 20 0M30-6q14 3 32 0" stroke="#0c0704" stroke-width=".8" fill="none" opacity=".45"/>`;

  return { svg: s, box: [2, -144, 308, 0] };
}

module.exports = [
  { id: "mammut", de: "das Mammut", syl: "MAM-mut", it: "il mammut", itSyl: "MAM-mut", en: "mammoth",
    gruppe: "Eiszeit", lebensraum: "Eiszeit", laenge: 6.03, hoehe: 3.55, zeichne: mammut },
  { id: "saebelzahnkatze", de: "die Säbelzahnkatze", syl: "SÄ-bel-zahn-kat-ze", it: "la tigre dai denti a sciabola", itSyl: "TI-gre dai DEN-ti a SCIA-bo-la", en: "sabre-toothed cat",
    gruppe: "Eiszeit", lebensraum: "Eiszeit", laenge: 2.01, hoehe: 1.06, zeichne: saebelzahn },
  { id: "wollnashorn", de: "das Wollnashorn", syl: "WOLL-nas-horn", it: "il rinoceronte lanoso", itSyl: "ri-no-ce-RON-te la-NO-so", en: "woolly rhinoceros",
    gruppe: "Eiszeit", lebensraum: "Eiszeit", laenge: 4.1, hoehe: 1.6, zeichne: wollnashorn },
  { id: "riesenhirsch", de: "der Riesenhirsch", syl: "RIE-sen-hirsch", it: "il megacero", itSyl: "me-GA-ce-ro", en: "giant deer",
    gruppe: "Eiszeit", lebensraum: "Eiszeit", laenge: 4.34, hoehe: 3.66, zeichne: riesenhirsch },
  { id: "hoehlenbaer", de: "der Höhlenbär", syl: "HÖH-len-bär", it: "l'orso delle caverne", itSyl: "OR-so del-le ca-VER-ne", en: "cave bear",
    gruppe: "Eiszeit", lebensraum: "Eiszeit", laenge: 3.06, hoehe: 1.44, zeichne: hoehlenbaer },
];
