/* =====================================================================
   TIER-BIBLIOTHEK — HAUSTIERE (FASSUNG 854, MASSSTAB 2)
   Hund, Katze, Kaninchen, Meerschweinchen, Hamster, Wellensittich,
   Goldfisch, Maus. Maße in Zentimetern, Blick nach rechts, Boden y = 0,
   Licht von links oben. Werkzeug T: siehe kern.js.
   Aufbau je Tier: ferne Glieder (dunkler) → Schwanz → Leib mit nahen Beinen
   als EIN Umriss (Form-Licht, Rauschtextur, Haar für Haar in Wuchsrichtung,
   Haare über die Kontur) → Kopf (Auge T.augeReal, Nase, Tasthaare) → Ohr.
   ===================================================================== */
"use strict";

/* ---------- eigene Hilfen ---------- */
const r = (n) => Math.round(n * 10) / 10;
/* kompakte Zahl: 0,1 oder 0,01 genau, ohne führende Null */
const zahl = (n, dez) => {
  const f = dez === 1 ? 10 : 100;
  let s = String(Math.round(n * f) / f);
  if (s === "-0") s = "0";
  return s.replace(/^(-?)0\./, "$1.");
};
/* Zahlenfolge kompakt verketten (kein Leerzeichen vor „-“) */
const folge = (zs, dez) => zs.map((n, i) => { const s = zahl(n, dez); return i && s[0] !== "-" ? " " + s : s; }).join("");
/* Farbe mischen: mix("#aabbcc", "#000", 0.3) */
function mix(a, b, t) {
  const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
}
/* Schlauch um eine Mittellinie (Schwanz, Streifen, Beine): c = Punkte, w = Breite(n) */
function schlauch(c, w) {
  const L = [], R = [];
  for (let i = 0; i < c.length; i++) {
    const a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const h = (Array.isArray(w) ? w[i] : w) / 2, nx = -dy / l * h, ny = dx / l * h;
    L.push([c[i][0] + nx, c[i][1] + ny]); R.push([c[i][0] - nx, c[i][1] - ny]);
  }
  return L.concat(R.reverse());
}
const schieb = (pts, dx, dy = 0) => pts.map((p) => [p[0] + dx, p[1] + dy].concat(p[2] ? [1] : []));
/* Punkte der geschlossenen Catmull-Rom-Kurve (wie T.glatt) – für Konturhaare */
function kurve(pts, schritte = 6) {
  const n = pts.length, P = (i) => pts[(i + n) % n], out = [];
  for (let i = 0; i < n; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let k = 0; k < schritte; k++) {
      const t = k / schritte, u = 1 - t;
      out.push([0, 1].map((j) => u * u * u * p1[j] + 3 * u * u * t * c1[j] + 3 * u * t * t * c2[j] + t * t * t * p2[j]));
    }
  }
  return out;
}
/* weiche Licht-/Schattenflecken (Muskeln, Rundungen) */
function fleck(T, x, y, rx, ry, farbe, op, rot = 0) {
  const f = farbe === "hell" ? T.rg("fleck", [[0, "#fff", 1], [0.5, "#fff", 0.42], [1, "#fff", 0]])
    : farbe === "dunkel" ? T.rg("fleckd", [[0, "#000", 1], [0.5, "#000", 0.42], [1, "#000", 0]]) : farbe;
  return `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rx)}" ry="${r(ry)}" fill="${f}" opacity="${op}"${rot ? ` transform="rotate(${rot} ${r(x)} ${r(y)})"` : ""}/>`;
}
/* weiche Linie (Falte, Muskelkante, Sehne) */
const falte = (T, pts, farbe, w, op) => T.linie(pts, farbe, w, ` stroke-opacity="${op}"`);
/* Körperteil: Pfad EINMAL in den defs, Füllung/Volumen/Rand/Clip per <use>. o: { innen, vol, volx, rand, randA, rw, nach } */
function teil(T, pts, fill, o = {}) {
  const d = typeof pts === "string" ? pts : T.glatt(pts);
  T._n = (T._n || 0) + 1;
  const id = T.id("t" + T._n);
  T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}k"><use href="#${id}"/></clipPath>`);
  const u = (a) => `<use href="#${id}"${a}/>`;
  let s = u(` fill="${fill}"`);
  const innen = (o.innen || "") + (o.vol !== false ? u(` fill="${T.VOL()}"`) : "") + (o.volx ? u(` fill="${T.VOLX()}"`) : "") + (o.nach || "");
  if (innen) s += `<g clip-path="url(#${id}k)">${innen}</g>`;
  if (o.rand !== false) s += u(` fill="none" stroke="${o.rand || "#000"}" stroke-opacity="${(o.randA != null ? o.randA : 0.3) * 0.6}" stroke-width="${o.rw || T.RW || 0.3}" stroke-linejoin="round"`);
  return s;
}
/* Rauschtextur (Fellgrund) als gedrehtes Rechteck – innerhalb eines geklippten teil() benutzen.
   winkel = Wuchsrichtung in Grad (0 = rechts, 90 = unten) */
function tex(T, n, o, winkel, op, b) {
  if (!T.fein && !o.immer) return "";
  const url = T.rauschen(n, o);
  const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, R = Math.hypot(b[2] - b[0], b[3] - b[1]) / 2 + 1;
  return `<rect x="${r(cx - R)}" y="${r(cy - R)}" width="${r(2 * R)}" height="${r(2 * R)}" filter="${url}" opacity="${op}" transform="rotate(${r(winkel - 90)} ${r(cx)} ${r(cy)})"/>`;
}
/* Fell Haar für Haar mit Licht: n Haare in pts, Wuchsrichtung flow(x, y) in Grad, Länge L.
   eimer = [[farbe, breite, deckkraft], …] (dunkel → hell); wahl(x, y, z) → Eimer-Index (z = Zufall 0–1).
   o: { streu, kr (Krümmung), lf(x, y) (Längenfaktor), wo(x, y) (nur dort), dez (1 | 2) } */
function fell(T, pts, n, flow, L, eimer, wahl, o = {}) {
  const [x0, y0, x1, y1] = T.box(pts);
  const ds = eimer.map(() => "");
  const ziel = Math.round(n * (T.fein ? 1 : o.szene || 0)), dez = o.dez || 2;
  if (!ziel) return "";
  let v = 0, g = 0;
  while (g < ziel && v < ziel * 14) {
    v++;
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!T.inPoly(x, y, pts) || (o.wo && !o.wo(x, y))) continue;
    const a = (flow(x, y) + (T.rnd() - 0.5) * (o.streu != null ? o.streu : 16)) * Math.PI / 180;
    const l = L * (0.55 + T.rnd() * 0.9) * (o.lf ? o.lf(x, y) : 1);
    const dx = Math.cos(a) * l, dy = Math.sin(a) * l, k = (o.kr != null ? o.kr : 0.18) * l * (T.rnd() - 0.5) * 2;
    const i = Math.max(0, Math.min(eimer.length - 1, wahl(x, y, T.rnd())));
    ds[i] += "M" + folge([x, y], dez) + "q" + folge([dx / 2 - Math.sin(a) * k, dy / 2 + Math.cos(a) * k, dx, dy], dez);
    g++;
  }
  return ds.map((d, i) => d ? `<path d="${d}" fill="none" stroke="${eimer[i][0]}" stroke-width="${eimer[i][1]}" stroke-opacity="${eimer[i][2]}" stroke-linecap="round"/>` : "").join("");
}
/* Haare über die Kontur hinaus (weicher Fellrand statt harter Linie).
   o: { n, L, flow(x, y), ab (0–1: Anteil „nach außen“), wo(x, y), eimer, wahl, dez, kr } */
function randhaare(T, pts, o) {
  const k = kurve(pts, 8), m = k.length;
  const ds = o.eimer.map(() => "");
  const ziel = Math.round(o.n * (T.fein ? 1 : o.szene || 0)), dez = o.dez || 2;
  if (!ziel) return "";
  for (let j = 0; j < ziel; j++) {
    const i = Math.floor(T.rnd() * m), p = k[i], a = k[(i + m - 1) % m], b = k[(i + 1) % m];
    if (o.wo && !o.wo(p[0], p[1])) continue;
    let tx = b[0] - a[0], ty = b[1] - a[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    let nx = ty, ny = -tx;
    if (T.inPoly(p[0] + nx * 0.05, p[1] + ny * 0.05, k)) { nx = -nx; ny = -ny; }
    const fa = o.flow(p[0], p[1]) * Math.PI / 180, ab = o.ab != null ? o.ab : 0.45;
    let dx = nx * ab + Math.cos(fa) * (1 - ab), dy = ny * ab + Math.sin(fa) * (1 - ab);
    const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
    const l = o.L * (0.5 + T.rnd() * 0.9);
    const sx = p[0] - nx * l * 0.4, sy = p[1] - ny * l * 0.4;
    const kr = (o.kr != null ? o.kr : 0.2) * l * (T.rnd() - 0.5) * 2;
    const idx = Math.max(0, Math.min(o.eimer.length - 1, o.wahl(p[0], p[1], T.rnd())));
    ds[idx] += "M" + folge([sx, sy], dez) + "q" + folge([dx * l / 2 - dy * kr, dy * l / 2 + dx * kr, dx * l, dy * l], dez);
  }
  return ds.map((d, i) => d ? `<path d="${d}" fill="none" stroke="${o.eimer[i][0]}" stroke-width="${o.eimer[i][1]}" stroke-opacity="${o.eimer[i][2]}" stroke-linecap="round"/>` : "").join("");
}
/* weich gezeichnete Malschicht (Licht/Schatten wie mit dem Pinsel): Gaussian-Blur in Zentimetern */
function weich(T, n, sd) {
  const id = T.id("bl" + n);
  T._bl = T._bl || {};
  if (!T._bl[id]) { T._bl[id] = 1; T.def(`<filter id="${id}" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="${sd}"/></filter>`); }
  return `url(#${id})`;
}
/* in der Szene (T.fein = false) entfällt die Malschicht – außer sie ist als „immer“ markiert (Zeichnung/Muster) */
const mal = (T, n, sd, inhalt, immer) => (T.fein || immer ? `<g filter="${weich(T, n, sd)}">${inhalt}</g>` : "");
/* Fellkante: verwirbelt die Kanten einer Gruppe (Zeichnung, Umriss) in Wuchsrichtung – wie Haarspitzen.
   f = Frequenz (fx fy), k = Stärke in cm. Nur bei T.fein. */
function zottel(T, n, f, k) {
  if (!T.fein) return "";
  const id = T.id("zt" + n);
  T._bl = T._bl || {};
  if (!T._bl[id]) {
    T._bl[id] = 1;
    T.def(`<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="${f}" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${k}" xChannelSelector="R" yChannelSelector="G"/></filter>`);
  }
  return ` filter="url(#${id})"`;
}
/* Abschnitt einer Mittellinie (nach Bogenlänge, t0…t1 von 0 bis 1) als Schlauch – Ringe, Bänder */
function abschnitt(c, w, t0, t1, k = 5) {
  const L = [0];
  for (let i = 1; i < c.length; i++) L.push(L[i - 1] + Math.hypot(c[i][0] - c[i - 1][0], c[i][1] - c[i - 1][1]));
  const ges = L[L.length - 1];
  const bei = (t) => {
    const d = t * ges; let i = 1;
    while (i < c.length - 1 && L[i] < d) i++;
    const u = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
    const wi = Array.isArray(w) ? w[i - 1] + (w[i] - w[i - 1]) * u : w;
    return [[c[i - 1][0] + (c[i][0] - c[i - 1][0]) * u, c[i - 1][1] + (c[i][1] - c[i - 1][1]) * u], wi];
  };
  const pts = [], ws = [];
  for (let j = 0; j <= k; j++) { const [p, wi] = bei(t0 + (t1 - t0) * j / k); pts.push(p); ws.push(wi); }
  return schlauch(pts, ws);
}
/* Streifen/Band: fein = verjüngte Fläche, Szene = einfache Linie (klein) */
function streif(T, mitte, w, farbe, op, a = 0, b = 1) {
  if (T.fein) return T.form(abschnitt(mitte, w, a, b, 4), farbe, ` opacity="${op}"`);
  const k = abschnitt(mitte, 0.01, a, b, 3).slice(0, 4);
  return T.linie(k, farbe, Array.isArray(w) ? w[1] : w, ` stroke-opacity="${op}"`);
}
/* Nagerfuß von der Seite: Ballen/Sohle als schmale Form, n Zehen nach vorn mit hellen Krallen.
   x = Ferse, l = Fußlänge, h = Höhe, farbe = Haut */
function nagerfuss(T, x, l, h, n, farbe, kfarbe = "#efe4da") {
  let s = T.form([[x, -h * 0.6], [x + l * 0.55, -h], [x + l * 0.75, -h * 0.55], [x + l * 0.7, 0, 1], [x - l * 0.05, 0, 1]], farbe);
  for (let i = 0; i < n; i++) {
    const zx = x + l * (0.5 + i * 0.5 / n), zl = l * (0.3 + 0.08 * (n - i));
    s += T.form([[zx, -h * (0.62 - i * 0.08)], [zx + zl * 0.6, -h * (0.55 - i * 0.07)], [zx + zl, -h * 0.18], [zx + zl * 0.9, 0, 1], [zx + zl * 0.1, 0, 1]], mix(farbe, "#000000", 0.06 * i));
    if (T.fein) s += kralle(T, zx + zl * 0.9, -h * 0.12, l * 0.14, 50, kfarbe, 0.3);
  }
  return s;
}
/* Lichtwert → Eimer: v (0 = Schatten, 1 = Licht) plus Zufall */
const stufe = (v, z, n, streu = 0.35) => Math.round(Math.max(0, Math.min(1, v + (z - 0.5) * streu)) * (n - 1));
/* Gaußhügel für Lichtkarten: [x, y, rx, ry, gewicht] */
const huegel = (x, y, liste) => liste.reduce((s, [hx, hy, rx, ry, w]) => s + w * Math.exp(-(((x - hx) / rx) ** 2 + ((y - hy) / ry) ** 2)), 0);
/* Kralle: gebogen, dunkel, mit Glanz. (x, y) = Ansatz, l = Länge, a = Richtung in Grad */
function kralle(T, x, y, l, a, farbe = "#2a2018", dicke = 0.32) {
  const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
  const P = (u, v) => [x + c * u - s * v, y + s * u + c * v];
  const pts = [P(0, -dicke * l), P(l * 0.55, -dicke * l * 0.75), P(l, l * 0.18, 1), P(l * 0.5, dicke * l * 0.55), P(0, dicke * l)];
  return T.form(pts, farbe) + `<path d="M${folge(P(l * 0.1, -dicke * l * 0.45), 2)}Q${folge(P(l * 0.5, -dicke * l * 0.5), 2)} ${folge(P(l * 0.8, -dicke * l * 0.05), 2)}" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="${zahl(l * 0.08, 2)}" stroke-linecap="round"/>`;
}

module.exports = [
  /* =================================================================
     HUND — Labrador Retriever, gelb
     RECHERCHE: Widerrist Rüden 56–57 cm (KC), 57–62 cm (CKC); Rumpf (Bug bis Sitzbein) gleich
     oder etwas länger als die Widerristhöhe; Brust tief bis zum Ellbogen; kaum aufgezogener Bauch;
     breiter Oberkopf, deutlicher Stopp, Fang etwa so lang wie der Schädel, kräftige Lefzen mit
     schwarzem Lefzenrand; Hängeohren, eng anliegend, nicht groß, hinten am Kopf angesetzt; braune
     Augen; schwarze Nase (gelber Lab); „Otterrute“: am Ansatz sehr dick, rund, dicht kurz behaart,
     verjüngt, nicht über Rückenhöhe getragen; kurzes, dichtes, gerades Stockhaar (Wuchs vom Kopf
     zum Schwanz, an den Seiten schräg nach unten, an den Läufen abwärts); kompakte runde Pfoten
     mit gewölbten Zehen und dunklen Krallen; Vorderläufe gerade, Hinterhand gut gewinkelt (Knie,
     tief gestelltes Sprunggelenk).
     ================================================================= */
  { id: "hund", de: "der Hund", syl: "HUND", it: "il cane", itSyl: "CA-ne", en: "dog",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 1.01, hoehe: 0.76,
    zeichne(T) {
      T.RW = 0.3;
      const D = "#9c6f37", DD = "#5e3f1c";
      const EIMER = [["#8a6030", 0.08, 0.3], ["#ad7f45", 0.075, 0.28], ["#c99b5c", 0.07, 0.28], ["#e2bd80", 0.07, 0.3], ["#f6e2b8", 0.065, 0.3]];
      const fell1 = T.lg("fell", [[0, "#dcae66"], [0.3, "#e2b978"], [0.55, "#e6c690"], [0.8, "#dcbb86"], [1, "#b99464"]]);
      const fellF = T.lg("fellf", [[0, "#c8a06a"], [1, "#94704a"]]);
      /* Licht: oben hell, unten dunkel, Muskelbuckel heller, Achsel/Flanke dunkler */
      const licht = (x, y) => {
        const t = Math.max(0, Math.min(1, (-y - 20) / 40));
        return 0.18 + 0.55 * t + huegel(x, y, [[21, -50, 6, 10, 0.25], [-18, -44, 10, 9, 0.28], [26, -60, 5, 6, 0.2], [-2, -55, 18, 3, 0.15], [22, -18, 2.5, 8, 0.12], [-16, -20, 3, 6, 0.1]])
          - huegel(x, y, [[14.5, -33, 3, 6, 0.3], [4, -32, 14, 3, 0.25], [-10, -37, 3, 6, 0.22], [-24, -18, 2.5, 6, 0.2]]);
      };
      /* Wuchsrichtung */
      const flow = (x, y) => {
        if (x > 26 && y < -40) return 125;                                   // Hals: schräg nach unten-hinten
        if (y > -30) return 92;                                               // Läufe
        if (x > 12 && x < 30) return 105;                                     // Schulter, Oberarm
        if (x < -14) return 115;                                              // Keule
        return 180 - 45 * Math.max(0, Math.min(1, (-y - 56) / -24));          // Rumpf: nach hinten, unten schräg
      };
      const wahlL = (x, y, z) => stufe(licht(x, y), z, 5);
      /* Pfote von der Seite: x = Ballenende hinten; Zehenfurchen, Knöchellicht, Ballen, Krallen */
      const pfote = (x, w, dunkel = 0) => {
        let t = "";
        for (let i = 0; i < 3; i++) {
          const zx = x + w * (0.42 + i * 0.22);
          if (i) t += falte(T, [[zx - 0.7, -3.6 + i * 0.5], [zx - 0.2, -2 + i * 0.3], [zx, -0.7]], "#4a321a", 0.3, 0.5 - dunkel * 0.2);
          t += fleck(T, zx + 0.9, -2.8 + i * 0.5, 1.2, 0.9, "#fff3d8", 0.3 - dunkel * 0.15);
        }
        t += T.form([[x, -1.2], [x + w + 0.4, -1.2], [x + w + 0.4, 0], [x, 0]], "#3a2410", ` opacity=".25"`);
        return t + T.form([[x + 0.5, -0.05], [x + 0.9, -0.8], [x + 2.6, -0.9], [x + 3.4, -0.05]], "#2b2018", ` opacity=".6"`);
      };
      const naegel = (x, w) => [0, 1, 2].map((i) => kralle(T, x + w * (0.42 + i * 0.22) + 0.5, -1.05 + (i === 2 ? -0.2 : 0), 1.05, 66 - i * 6, "#26201b", 0.46)).join("");
      let s = "";
      /* ferne Beine (dunkler, versetzt) */
      const fernH = [[-5, -38], [-7, -31.5], [-10.5, -24], [-14.5, -16], [-16, -10.5], [-16, -5.5], [-15, -3.8], [-13.4, -3], [-11.6, -2], [-10.6, -0.8], [-11, 0, 1], [-19.4, 0, 1], [-20.3, -1.4], [-20.6, -3.4], [-20.9, -7], [-22.6, -12.8], [-20.8, -17.5], [-21.4, -24], [-22, -36]];
      const fernV = [[11, -40], [19.5, -38], [18.8, -24], [18.1, -14], [17.4, -8.4], [18, -5.8], [19.5, -4.4], [21.1, -3.4], [22.1, -1.9], [21.9, -0.6], [21.1, 0, 1], [12.3, 0, 1], [11.5, -1.2], [11.8, -3.2], [12.3, -5.6], [11.4, -7.4], [11.1, -9], [10.9, -14], [10.1, -25]];
      for (const P of [fernH, fernV]) {
        s += teil(T, P, fellF, { rand: DD, randA: 0.2, volx: true,
          innen: mal(T, "f", 1, fleck(T, P[0][0] - 2, -36, 8, 5, "#4a2c10", 0.4)) + fell(T, P, 70, () => 92, 1.1, EIMER, (x, y, z) => stufe(licht(x, y) - 0.25, z, 5), { dez: 1 }) });
      }
      if (T.fein) s += `<g opacity=".8">${pfote(-19.4, 8.8, 1) + pfote(12.3, 9.8, 1)}</g>` + naegel(-19.4, 8.8) + naegel(12.3, 9.8);
      /* Rute: Fortsetzung der Kruppe, dick und rund; Licht oben links, Schatten unten rechts */
      const rc = [[-23, -51.4], [-30, -51.2], [-35.5, -48], [-39, -42.5], [-40.8, -35.5], [-41.2, -28]];
      const rute = schlauch(rc, [8, 7.2, 6, 4.6, 3.2, 1.4]);
      const seite = (c, w, off) => schlauch(c.map((p, i) => {
        const a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
        return [p[0] - dy / l * off[i], p[1] + dx / l * off[i]];
      }), w);
      const rflow = (x, y) => (y < -47 ? 175 : y < -40 ? 120 : 98);
      s += teil(T, rute, T.lg("rute", [[0, "#e2bb7b"], [1, "#b48a4e"]], 0, 0, 1, 0.3), { rand: false,
        innen: tex(T, "h", { fx: 2.4, fy: 0.3, farbe: DD, staerke: 2, schwelle: 0.6, okt: 2 }, 100, 0.16, [-46, -56, -20, -26]) +
          mal(T, "r", 0.9, T.form(seite(rc, [3, 3, 2.6, 2, 1.4, 0.6], [3, 2.8, 2.3, 1.8, 1.2, 0.4]), "#5e3a14", ` opacity=".5"`) +
            T.form(seite(rc, [2.4, 2.2, 1.8, 1.4, 1, 0.4], [-2.6, -2.4, -2, -1.5, -1, -0.3]), "#fff3d8", ` opacity=".45"`)) +
          fell(T, rute, 110, rflow, 1.3, EIMER, (x, y, z) => stufe(0.6 - (x + 40) / -14 - (-y - 30) / 60, z, 5), { dez: 1 }),
        nach: randhaare(T, rute, { n: 70, L: 0.8, flow: rflow, eimer: EIMER, wahl: (x, y, z) => stufe(0.45, z, 5), dez: 1 }),
      });
      /* Körper mit nahen Beinen als EIN Umriss */
      const leib = [[-27, -53], [-20, -55.6], [-8, -55], [5, -56], [15, -58.6], [22, -64], [27, -70.5], [31.6, -74.6], [36.4, -75.9], [40.6, -73.6], [40.6, -62], [37, -57.4], [35.4, -52.4], [35.2, -46.4], [34.2, -40.8], [31.4, -36],
        [27.2, -31], [25.4, -25], [24.6, -18], [24.2, -13], [23.9, -8.6], [24.5, -5.8], [26, -4.4], [27.6, -3.4], [28.6, -1.9], [28.4, -0.6], [27.6, 0, 1], [18.8, 0, 1], [18, -1.2], [18.3, -3.2], [19, -5.6], [18.5, -7.4], [18.6, -9.4], [18.2, -14], [17.4, -22], [16.2, -27.6], [15.4, -29.2],
        [9, -29.4], [0, -30.8], [-5.5, -33.4], [-8.4, -35.4], [-10.6, -30], [-13.6, -25], [-19, -18], [-21.6, -12.4], [-22, -5.5], [-21, -3.8], [-19.4, -3], [-17.6, -2], [-16.6, -0.8], [-17, 0, 1],
        [-25.4, 0, 1], [-26.3, -1.4], [-26.6, -3.4], [-26.9, -7], [-28.6, -12.8], [-26.8, -17.5], [-27.4, -24], [-30.4, -31], [-31.8, -39], [-31.4, -47]];
      s += teil(T, leib, fell1, {
        rand: DD, randA: 0.16,
        innen:
          fleck(T, 0, -6, 40, 9, "dunkel", 0.2) +
          tex(T, "l", { fx: 2.6, fy: 0.35, farbe: DD, staerke: 2, schwelle: 0.6, okt: 2 }, 160, 0.16, [-32, -76, 41, 0]) +
          /* Malschicht: Schatten (Bauch, Brust vorn, Trizepsfurche, Achsel, Flanke, Kehle, Vorderkante der Läufe, Bodennähe) */
          mal(T, "a", 1.4,
            T.form([[30, -36], [24, -31], [15, -28.6], [0, -30], [-6, -33.6], [-9, -32], [-12, -38], [-4, -36.6], [8, -34.8], [18, -35], [27, -38.4]], "#6a4318", ` opacity=".36"`) +
            T.form([[37.4, -58], [35.4, -50], [34.8, -44.5], [33.6, -39.5], [30.5, -34.5], [28.4, -38], [31.4, -45], [33, -52], [33.4, -58]], "#6a4318", ` opacity=".32"`) +
            T.form([[13, -48], [12.4, -42], [13.8, -36], [16, -31], [17.4, -33], [15.4, -38], [14.4, -43]], "#6a4318", ` opacity=".14"`) +
            fleck(T, 15.6, -32, 3, 4.6, "#6a4318", 0.32) +
            T.form([[-5, -33.8], [-8.6, -35.6], [-10.8, -30], [-13.6, -25.4], [-11.4, -26], [-8, -30.6]], "#6a4318", ` opacity=".42"`) +
            T.form([[-9.4, -50], [-10.6, -42], [-8.8, -36], [-7.6, -38], [-8.4, -43], [-8, -50]], "#6a4318", ` opacity=".18"`) +
            T.form([[28, -67], [34, -61], [37, -57.4], [35.6, -52], [31, -55], [26, -61]], "#6a4318", ` opacity=".2"`) +
            T.form([[26.8, -30], [25.2, -24], [24.4, -16], [23.8, -8.6], [22.6, -8.6], [23, -16], [23.4, -24], [24.6, -30]], "#6a4318", ` opacity=".3"`) +
            T.form([[-10.6, -30], [-13.6, -25], [-19, -18], [-21.6, -12.4], [-22, -6], [-20.4, -6], [-20, -12], [-17.6, -18], [-12.4, -25], [-9.4, -29.4]], "#6a4318", ` opacity=".36"`) +
            fleck(T, -25, -19.5, 1.1, 3.4, "#6a4318", 0.42, 10) +
            T.form([[-27, -9], [-16, -9], [-16, 0], [-27, 0]], "#6a4318", ` opacity=".14"`) + T.form([[17, -9], [29, -9], [29, 0], [17, 0]], "#6a4318", ` opacity=".14"`) +
            /* Licht: Glanz auf dem Rücken, Kruppe/Keule, Schulterblattgrat, Rippen, Kniescheibe, Lichtkanten hinten an den Läufen */
            T.form([[-26, -54], [-10, -54.4], [5, -55.2], [15, -57.6], [21, -62], [26, -68.6], [24, -64.8], [17, -59.6], [6, -53.6], [-6, -52.2], [-22, -51.4]], "#fff3d8", ` opacity=".5"`) +
            T.form([[-30, -47], [-25, -52], [-16, -51.4], [-11.6, -47], [-16, -47.6], [-24, -47], [-29, -42]], "#fff3d8", ` opacity=".32"`) +
            fleck(T, 22, -52, 7, 5, "#fff3d8", 0.22, -30) +
            fleck(T, 2, -46, 12, 5, "#fff3d8", 0.14) + fleck(T, -11.4, -29.2, 1.8, 2.4, "#fff3d8", 0.38) +
            T.form([[17, -26], [18.2, -14], [18.8, -9.6], [19.8, -9.6], [19.4, -14], [18.4, -26]], "#fff3d8", ` opacity=".32"`) +
            T.form([[-28.4, -12.8], [-27, -17.5], [-27.6, -24], [-30.6, -31], [-29, -31], [-26.4, -24], [-26, -17.5], [-27.4, -12.8]], "#fff3d8", ` opacity=".32"`)) +
          /* Haar für Haar */
          fell(T, leib, 520, flow, 1.4, EIMER, wahlL, { dez: 1, szene: 0.12, lf: (x, y) => (y > -28 ? 0.6 : 1) }) +
          /* Pfoten: Zehen, Ballen, Fußwurzelballen */
          (T.fein ? pfote(18.8, 9.8) + pfote(-25.4, 8.8) + `<path d="M18.7 -8.1q-.7 .6 -.3 1.4" fill="none" stroke="#2b2018" stroke-width=".55" stroke-linecap="round" opacity=".7"/>` : ""),
        nach: randhaare(T, leib, { n: 240, L: 0.8, flow, ab: 0.4, eimer: EIMER, wahl: (x, y, z) => stufe(licht(x, y) + 0.05, z, 5), dez: 1, wo: (x, y) => y < -2 }),
      });
      s += naegel(-25.4, 8.8) + naegel(18.8, 9.8);
      /* Kopf: Gruppe über der Brust, Hals ca. 45° */
      s += `<g transform="translate(-6 -3)">`;
      const kopf = [[40.6, -69], [41.6, -72.6], [44.5, -73], [49.4, -72.2], [52.4, -70.4], [54, -67.8], [57.5, -66.4], [61.4, -65.6], [63.6, -64.2], [64.6, -62], [64.1, -60], [62.8, -59.3],
        [62.6, -57.3], [61.2, -55.7], [58, -55], [55.4, -55.3], [53.6, -55.8], [52.8, -54.4], [48, -53.6], [43, -54.2], [40.8, -58.5]];
      const kflow = (x, y) => (x > 53 ? 186 : y > -60 ? 150 : 190);
      const klicht = (x, y) => 0.5 + 0.5 * Math.max(0, Math.min(1, (-y - 56) / 16)) + huegel(x, y, [[45, -70, 5, 3, 0.25], [58, -64, 4, 1.6, 0.2]]) - huegel(x, y, [[50, -64.5, 3, 1.6, 0.35], [47, -56.5, 6, 2.5, 0.3], [54, -59, 2.5, 2, 0.15]]);
      s += teil(T, kopf, T.lg("kopf", [[0, "#efcf97"], [0.6, "#d9ae68"], [1, "#b0844a"]]), {
        rand: false,
        innen: fleck(T, 45, -69, 7, 4, "hell", 0.4) + fleck(T, 58.5, -63.4, 5, 2.4, "hell", 0.3) +
          fleck(T, 50, -64.5, 3, 1.8, "dunkel", 0.2) + fleck(T, 47, -56.5, 7, 3, "dunkel", 0.22) + fleck(T, 54.5, -60.5, 3, 2.5, "dunkel", 0.12) +
          tex(T, "k", { fx: 3.2, fy: 0.6, farbe: DD, staerke: 2, schwelle: 0.6, okt: 2 }, 180, 0.14, [36, -74, 65, -53]) +
          fell(T, kopf, 260, kflow, 0.6, EIMER, (x, y, z) => stufe(klicht(x, y), z, 5), { dez: 1 }) +
          /* Lefze: Oberlippe hängt über den Unterkiefer, schwarzer Lefzenrand */
          T.form([[62.6, -59.1], [58.5, -58.1], [54.4, -57.8], [53.8, -56.4], [55.4, -55.4], [58.8, -55.1], [62.2, -57]], "#b98a51", ` opacity=".55"`) +
          `<path d="M62.7 -59.2L57.6 -58.4Q55.4 -58.1 54.5 -58.7" fill="none" stroke="#24170d" stroke-width=".38" stroke-opacity=".85" stroke-linecap="round"/>` +
          /* Tasthaar-Poren in Reihen */
          `<path d="M56.8 -61.4h.01M58.3 -61.7h.01M59.8 -61.9h.01M61 -62h.01M57.4 -60.3h.01M58.9 -60.5h.01M60.4 -60.6h.01" stroke="#6a4a28" stroke-width=".26" stroke-opacity=".7" stroke-linecap="round"/>`,
        nach: randhaare(T, kopf, { n: 90, L: 0.45, flow: kflow, ab: 0.35, eimer: EIMER, wahl: (x, y, z) => stufe(klicht(x, y), z, 5), wo: (x, y) => x > 44 && x < 60 }),
      });
      s += falte(T, [[44.5, -73], [49.4, -72.2], [52.4, -70.4], [54, -67.8], [57.5, -66.4], [61.4, -65.6]], DD, 0.3, 0.22) + falte(T, [[62.6, -57.3], [61.2, -55.7], [58, -55], [55.4, -55.3], [53.6, -55.8], [52.8, -54.4], [48, -53.6], [44, -54.2]], DD, 0.3, 0.25);
      /* Auge mit Brauenbogen und Überaugen-Tasthaaren */
      s += fleck(T, 50.6, -69.8, 2.8, 1.2, "hell", 0.45) + fleck(T, 50.8, -67.2, 2.4, 1.6, "dunkel", 0.25);
      s += `<ellipse cx="50.8" cy="-67.4" rx="1.7" ry=".95" fill="#2a1a0e" opacity=".55" transform="rotate(6 50.8 -67.4)"/>` + T.augeReal(50.8, -67.4, 1.08, { iris: "#7a4718", iris2: "#2e1806", offen: 0.66, winkel: 6, lid: "#1a0f08" });
      s += T.schnurrhaare(51.4, -69.8, 3, 2.4, -120, 30, "#4a3420", 0.06);
      /* Nase: feucht, Nasenlöcher, Pflastertextur */
      const nase = [[60.6, -65.1], [63.4, -64.6], [64.75, -62.6], [64.2, -60.2], [62.2, -59.9], [60.9, -61.4]];
      s += teil(T, nase, T.lg("nase", [[0, "#55443a"], [0.5, "#241a15"], [1, "#0b0807"]]), { vol: false, rand: false,
        innen: (T.fein ? `<rect x="60" y="-66" width="5" height="7" fill="#3a2e28" filter="${T.relief("nase", { f: 3.6, tiefe: 0.5, okt: 2 })}" opacity=".35"/>` : "") +
          `<path d="M64.6 -61.6q-.7 .5 -1.6 -.2q-.5 -.5 -.1 -1" fill="#050302"/>` +
          `<path d="M62.4 -60.1q.2 -.9 .9 -1.3" fill="none" stroke="#000" stroke-width=".25" opacity=".6"/>` +
          `<ellipse cx="62.3" cy="-64.2" rx="1.2" ry=".34" fill="#fff" opacity=".42" transform="rotate(8 62.3 -64.2)"/><ellipse cx="64.3" cy="-63.1" rx=".24" ry=".5" fill="#fff" opacity=".3"/>` });
      /* Tasthaare */
      s += T.schnurrhaare(58.6, -61, 7, 6.5, 172, 34, "#5b4127", 0.07);
      /* Hängeohr: etwas unter der Schädellinie angesetzt, Vorderkante eingerollt, Hinterkante im Licht */
      const ohr = [[40.4, -70], [44.6, -70.8], [47.2, -68.8], [47.6, -64.4], [46.8, -60], [45.2, -56.8], [43.6, -57], [41.4, -61.4], [39.8, -66]];
      s += fleck(T, 48.2, -61.6, 1.8, 5.4, "dunkel", 0.28, -10) + fleck(T, 44.4, -56, 3, 1.4, "dunkel", 0.3);
      const oflow = () => 98;
      s += teil(T, ohr, T.lg("ohr", [[0, "#dcae66"], [0.55, "#c8964f"], [1, "#a8773a"]]), {
        rand: false,
        innen: mal(T, "o", 0.6, T.form([[46.4, -69.6], [47.8, -64.4], [46.8, -59.6], [45.4, -57], [44.6, -59.6], [45.8, -64.4]], "#5e3a14", ` opacity=".45"`) +
            T.form([[40.2, -69], [41, -64], [42.6, -59.8], [43.6, -60.4], [42.4, -64.4], [41.8, -69]], "#fff3d8", ` opacity=".4"`) +
            fleck(T, 43.6, -69.8, 3.4, 1.2, "#fff3d8", 0.5)) +
          fell(T, ohr, 130, oflow, 0.6, EIMER, (x, y, z) => stufe(0.75 - (-y - 58) / -20 - (x - 41) / 14, z, 5)),
        nach: randhaare(T, ohr, { n: 50, L: 0.45, flow: oflow, ab: 0.5, eimer: EIMER, wahl: (x, y, z) => stufe(0.35, z, 5), wo: (x, y) => y > -68 }),
      });
      s += "</g>";
      return { svg: s, box: [-42.6, -76.1, 58.8, 0], fuesse: [-21.2, -15.2, 16.7, 23.2], kopf: [33, -76.2, 59, -55] };
    } },
  /* =================================================================
     KATZE — Hauskatze, braun getigert (Mackerel Tabby)
     RECHERCHE: Kopf-Rumpf ca. 46 cm, Schwanz ca. 28–30 cm, Schulterhöhe 23–25 cm; Zehengänger,
     schlanke Läufe, Hinterbeine länger als die Vorderbeine (Rücken zur Hüfte leicht ansteigend),
     hohes Sprunggelenk, langer Mittelfuß; runder Kopf, kurzer Fang, große dreieckige Ohren (Öffnung
     nach vorn) mit hellen Haarbüscheln innen; große Augen grün-gelb, Pupille bei Tageslicht
     senkrechter Schlitz, Hornhaut von der Seite deutlich gewölbt; ziegelroter Nasenspiegel mit
     dunklem Rand; Tasthaare weiß, länger als der Kopf breit; Tabby-Zeichnung: „M“ auf der Stirn,
     Linien vom äußeren Augenwinkel über die Wange, helle Augenumrandung, Linien über Scheitel und
     Nacken, Aalstrich auf dem Rücken, schmale senkrechte, leicht gebogene Streifen an den Flanken
     („Fischgräte“), unten in Striche/Flecken aufgelöst, zwei Halsbänder über der Brust, gestreifte
     Beine, geringelter Schwanz mit dunkler Spitze, Hinterfuß hinten dunkel („Sohlenstreif“);
     Grundfarbe agouti (gebänderte Haare) warm graubraun, Bauch, Kinn und Lippen heller; Krallen
     eingezogen (von der Seite nicht sichtbar).
     ================================================================= */
  { id: "katze", de: "die Katze", syl: "KAT-ze", it: "il gatto", itSyl: "GAT-to", en: "cat",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.58, hoehe: 0.357,
    zeichne(T) {
      T.RW = 0.1;
      const DK = "#2a1f15";
      const EIMER = [["#3a2a1c", 0.055, 0.45], ["#6d5638", 0.05, 0.4], ["#9a8058", 0.05, 0.38], ["#c3aa80", 0.045, 0.42], ["#ece0c4", 0.04, 0.5]];
      const licht = (x, y) => {
        const t = Math.max(0, Math.min(1, (-y - 9) / 15));
        return 0.12 + 0.62 * t + huegel(x, y, [[11.6, -20, 3, 4, 0.18], [-15, -19, 5, 4, 0.2], [-4, -24, 10, 1.6, 0.15]])
          - huegel(x, y, [[11, -13, 2, 2.4, 0.25], [-11, -12.6, 2.4, 2, 0.25]]);
      };
      const flow = (x, y) => {
        if (y > -12) return 92;
        if (x > 14 && y > -21) return 96;
        if (x < -13) return 118;
        return 180 - 50 * Math.max(0, Math.min(1, (-y - 24) / -11));
      };
      let s = "";
      /* Rumpf leicht gestaucht (Länge Brust–Sitzbein ≈ 1,5 × Schulterhöhe) */
      s += `<g transform="matrix(.8 0 0 1 3.6 0)">`;
      /* ferne Beine (dunkler, mit Ringen und Sohlenstreif) */
      const fernH = schieb([[-7.6, -15], [-8.8, -11.6], [-10.6, -9.6], [-13, -8], [-14.6, -6.4], [-14.4, -2.6], [-13.4, -1.8], [-12, -1], [-11.8, -0.3], [-12.3, 0, 1], [-15.4, 0, 1], [-15.8, -1], [-16, -3.6], [-16.8, -6.6], [-15.8, -8.4], [-15.2, -10.4], [-15.8, -13]], 2.4);
      const fernV = [[6, -14], [10.6, -14], [10.6, -10], [10.3, -6.5], [10.1, -3.6], [11.1, -2.2], [12.4, -1.4], [12.7, -0.5], [12.2, 0, 1], [7, 0, 1], [6.7, -0.8], [6.9, -2.6], [7.3, -3.6], [7, -7], [6.4, -11]];
      const fern = T.lg("fernk", [[0, "#8e7756"], [1, "#6a5640"]]);
      for (const P of [fernH, fernV]) {
        const xb = P[0][0];
        s += teil(T, P, fern, { rand: DK, randA: 0.2, volx: true,
          innen: `<g${zottel(T, "a", "1.4 .6", 0.25)}>` + (xb > 0 ? [-11, -8.8, -6.6, -4.4].map((y) => T.form([[5, y], [13, y + 0.4], [13, y + 0.85], [5, y + 0.45]], DK, ` opacity=".6"`)).join("")
            : T.form([[-14.2, -7.4], [-12.8, -7.4], [-12.6, 0], [-14.2, 0]], DK, ` opacity=".75"`) + [-11.4, -9.2].map((y) => T.form([[-15, y], [-6, y + 1.4], [-6, y + 2], [-15, y + 0.6]], DK, ` opacity=".5"`)).join("")) + "</g>" +
            mal(T, "fb", 0.35, T.form(P.slice(Math.floor(P.length / 2)).map(([x, y]) => [x + 0.5, y]), "#f4e6c8", ` opacity=".28"`) + T.form(P.slice(1, Math.floor(P.length / 2)).map(([x, y]) => [x - 0.5, y]), "#1a120a", ` opacity=".3"`)) +
            fell(T, P, 30, () => 95, 0.5, EIMER, (x, y, z) => stufe(0.3, z, 5)) });
      }
      /* Schwanz: hängt in sanftem Bogen, Spitze leicht gehoben; geringelt, dunkle Spitze */
      const sc = [[-19.4, -23], [-23, -20.6], [-25.8, -16.4], [-27.6, -11.6], [-29.4, -7.4], [-31.8, -4.6], [-34.8, -3.4], [-37.2, -3.6], [-38.9, -4.6]];
      const sw = [3.2, 2.9, 2.7, 2.6, 2.5, 2.45, 2.4, 2.3, 2];
      const schw = schlauch(sc, sw).concat([]);
      const sflow = (x, y) => (y < -18 ? 140 : y < -8 ? 112 : x > -34 ? 160 : 205);
      let ringe = "";
      for (const [a, b] of [[0.24, 0.29], [0.36, 0.415], [0.48, 0.54], [0.6, 0.66], [0.71, 0.77], [0.81, 0.87], [0.91, 1.04]]) ringe += T.form(abschnitt(sc, sw.map((w) => w + 1), a, b, T.fein ? 5 : 1), DK, ` opacity=".85"`);
      s += teil(T, schw, T.lg("schw", [[0, "#a68c66"], [1, "#6f5a3e"]], 0, 0, 1, 0.4), { rand: false,
        innen: `<g${zottel(T, "a", "1.4 .6", 0.25)}>${ringe}${T.form(abschnitt(sc, 1.1, 0, 0.24, 4), DK, ` opacity=".7"`)}</g>` +
          mal(T, "s", 0.5, T.form(abschnitt(sc.map((p) => [p[0] + 0.7, p[1] + 0.5]), 1.2, 0, 1, 12), "#20160e", ` opacity=".4"`) + T.form(abschnitt(sc.map((p) => [p[0] - 0.6, p[1] - 0.5]), 0.8, 0, 1, 12), "#f4ead4", ` opacity=".35"`)) +
          fell(T, schw, 50, sflow, 0.7, EIMER, (x, y, z) => stufe(0.45, z, 5)),
        nach: randhaare(T, schw, { n: 60, L: 0.55, flow: sflow, ab: 0.55, eimer: EIMER, wahl: (x, y, z) => stufe(0.4, z, 5) }),
      });
      /* Leib mit nahen Beinen */
      const leib = [[-19.8, -23.2], [-16.6, -25.4], [-12, -25.8], [-5, -24.8], [1, -24], [6, -23.7], [8.2, -24.3], [11.4, -24.8], [14.8, -26.4], [17.8, -28.2], [21, -24.6], [19.8, -21.8], [19, -19.6], [18.5, -17.2], [17.6, -15.2], [16.2, -13.6],
        [15.4, -11.8], [15.3, -7], [15.1, -3.8], [16.3, -2.4], [17.5, -1.5], [17.8, -0.6], [17.3, 0, 1], [11.8, 0, 1], [11.5, -0.8], [11.7, -2.6], [12.1, -3.6], [11.8, -7], [11.3, -10.8], [10.6, -12.2],
        [7, -12.6], [1, -12.4], [-4, -12.6], [-8.4, -11.2], [-10.8, -11.2], [-11.6, -10.4], [-13, -9], [-15.6, -7.6], [-17.8, -6.4], [-18.2, -5.4], [-17.8, -3], [-16.2, -1.9], [-14.8, -1.1], [-14.5, -0.3], [-15, 0, 1],
        [-20.2, 0, 1], [-20.6, -1], [-20.8, -3.6], [-21.3, -6.6], [-20.1, -8.2], [-19.3, -10], [-20.4, -13], [-21.8, -16.4], [-22.2, -19], [-21.7, -21.4]];
      /* Tabby-Zeichnung */
      let mus = T.form([[-21, -22.6], [-15, -25], [-7, -24.2], [1, -23], [7.6, -23.4], [12.4, -25], [12.6, -24.2], [7.6, -22.6], [1, -22.2], [-7, -23.4], [-15, -24], [-20.6, -21.8]], DK, ` opacity=".85"`);
      for (let i = 0; i < 12; i++) {
        const x0 = -13.4 + i * 2.25 + (T.rnd() - 0.5) * 0.5;
        const ende = x0 > 9 ? -14.6 : x0 < -11 ? -14 : -14.4;
        const kr = x0 > 9 ? 0.9 : x0 < -12 ? -1.4 : -0.5;
        const w1 = (T.rnd() - 0.5) * 0.7, w2 = (T.rnd() - 0.5) * 0.7;
        const mitte = [[x0, -23.6], [x0 + w1, -21.2], [x0 - 0.3 + kr * 0.4 - w1, -18.8], [x0 - 0.5 + kr * 0.8 + w2, -16.6], [x0 - 0.8 + kr * 1.2, ende]];
        const brw = [0.55, 0.5 + T.rnd() * 0.15, 0.48, 0.42, 0.28];
        const teile = !T.fein ? [[0, 0.7]] : i % 3 === 0 ? [[0, 0.78], [0.86, 1]] : i % 3 === 1 ? [[0, 0.5], [0.58, 0.74], [0.84, 0.96]] : [[0, 0.64], [0.72, 0.86]];
        for (const [a, b] of teile) mus += streif(T, mitte, brw.map((w) => w * 0.85), DK, 0.55, a, b);
      }
      /* Schenkelbögen */
      for (let i = 0; i < 4; i++) mus += streif(T, [[-22.4, -20.6 + i * 2.2], [-19.6, -21 + i * 2.3], [-16.6, -20.6 + i * 2.5], [-14.2, -19.4 + i * 2.6]], [0.3, 0.5, 0.5, 0.25], DK, 0.66);
      mus += streif(T, [[-17, -24.6], [-16.6, -23], [-17.4, -21.6]], [0.4, 0.5, 0.2], DK, 0.6);
      /* Beinringe vorn und hinten, Sohlenstreif */
      for (const y of [-11.4, -9.2, -7, -4.8]) mus += T.form([[11, y], [17, y + 0.4], [17, y + 0.8], [11, y + 0.4]], DK, ` opacity=".62"`);
      for (const y of [-10.6, -8.4]) mus += T.form([[-22, y], [-12, y + 2.2], [-12, y + 2.7], [-22, y + 0.5]], DK, ` opacity=".6"`);
      mus += T.form([[-21.5, -7.2], [-20.2, -7.4], [-19.9, 0], [-20.8, 0]], DK, ` opacity=".85"`);
      /* Halsbänder und Schulterlinien */
      mus += streif(T, [[20.2, -22.4], [19.2, -20.2], [18.2, -18.6]], 0.6, DK, 0.65) + streif(T, [[18.8, -17.8], [17.6, -16], [16.2, -14.8]], 0.5, DK, 0.6);
      mus += streif(T, [[13.6, -24.8], [12.8, -21.8], [12, -18.8], [11.4, -16.2]], [0.5, 0.5, 0.42, 0.25], DK, 0.6) + streif(T, [[15.8, -26], [15.2, -23.4], [14.6, -21]], [0.4, 0.4, 0.25], DK, 0.55);
      s += teil(T, leib, T.lg("katzfell", [[0, "#97805c"], [0.45, "#b09a76"], [0.8, "#cbb996"], [1, "#d6c6a4"]]), {
        rand: DK, randA: 0.12,
        innen:
          tex(T, "kl", { fx: 3.4, fy: 0.5, farbe: DK, staerke: 2.2, schwelle: 0.58, okt: 2 }, 165, 0.22, [-23, -28, 21, 0]) +
          `<g${zottel(T, "b", "1.3 .5", 0.45)} opacity=".9">${mus}</g>` +
          mal(T, "k", 0.6,
            T.form([[17, -15.4], [12, -12.8], [4, -12.8], [-4, -12.2], [-9, -11.4], [-12, -12.6], [-9, -14], [0, -14.4], [8, -14.6], [15, -16.4]], "#2a1e12", ` opacity=".38"`) +
            fleck(T, 11.4, -13, 1.4, 2.4, "#2a1e12", 0.4) + fleck(T, -10.8, -12.6, 1.6, 2, "#2a1e12", 0.4) + (T.fein ? T.form([[17.6, -15.4], [16.2, -13.8], [15.2, -12], [14.6, -12.6], [15.6, -14.4], [16.8, -15.8]], "#2a1e12", ` opacity=".35"`) : "") +
            fleck(T, -13, -10.4, 1.6, 1.4, "#fff4dc", 0.3) + falte(T, [[-11.8, -10.2], [-13.2, -8.8], [-15.8, -7.4], [-18, -6.2]], "#1a120a", 0.5, 0.35) + T.form([[-12.2, -11], [-14.4, -9.2], [-17, -7.4], [-17.6, -6.2], [-18.4, -7.4], [-16, -9.6], [-13.4, -11.8]], "#2a1e12", ` opacity=".3"`) + fleck(T, -19.2, -10, 0.8, 1.8, "#2a1e12", 0.35) + T.form([[-20.4, -11.4], [-20.6, -9], [-21.2, -7.2], [-20.2, -7.4], [-19.8, -9.2], [-19.6, -11.2]], "#fff4dc", ` opacity=".3"`) +
            T.form([[19.8, -21.4], [18.4, -18.2], [17.4, -15.6], [16.2, -13.6], [15.4, -15.4], [16.8, -18.4], [18, -21.2]], "#2a1e12", ` opacity=".25"`) +
            T.form([[15.2, -10], [14.8, -6.5], [14.6, -3.6], [13.8, -3.6], [14, -6.5], [14.4, -10]], "#2a1e12", ` opacity=".25"`) +
            T.form([[-15, -25], [-6, -24.2], [4, -23], [10, -24], [4, -21.8], [-6, -22.4], [-15, -22.8]], "#fff4dc", ` opacity=".32"`) + T.form([[-19, -12], [-8, -12.4], [4, -13.4], [16, -15], [16, -18], [4, -17], [-8, -16.4], [-19, -16]], "#2a1e12", ` opacity=".12"`) +
            fleck(T, -15.6, -18.6, 4, 3.2, "#fff4dc", 0.2) + fleck(T, 12, -19.6, 2.2, 3.2, "#fff4dc", 0.18) +
            T.form([[12.4, -10], [12.6, -4], [13.2, -4], [13.1, -10]], "#fff4dc", ` opacity=".25"`)) +
          fell(T, leib, 250, flow, 0.95, EIMER, (x, y, z) => stufe(licht(x, y), z, 5), { lf: (x, y) => (y > -11 ? 0.55 : 1) }) +
          (T.fein ? T.form([[11.9, -0.05], [12.1, -0.6], [13.8, -0.7], [14.3, -0.05]], "#4a2c22", ` opacity=".7"`) + T.form([[-19.6, -0.05], [-19.3, -0.6], [-18.1, -0.7], [-17.6, -0.05]], "#4a2c22", ` opacity=".7"`) +
            falte(T, [[15.6, -1.9], [15.9, -0.4]], DK, 0.14, 0.5) + falte(T, [[14.6, -2.2], [14.7, -0.3]], DK, 0.14, 0.5) + falte(T, [[-16.2, -1.8], [-15.9, -0.4]], DK, 0.14, 0.5) + falte(T, [[-17.2, -2], [-17, -0.3]], DK, 0.14, 0.5) : ""),
        nach: randhaare(T, leib, { n: 140, L: 0.65, flow, ab: 0.5, eimer: EIMER, wahl: (x, y, z) => stufe(licht(x, y), z, 5), wo: (x, y) => y < -1.5 }),
      });
      s += "</g>";
      /* Kopf (Gruppe 1,12-fach um den Halsansatz: Katzenkopf groß und rund) */
      s += `<g transform="matrix(1.12 0 0 1.12 -2.16 3)">`;
      const kopf = [[17.2, -27], [18.8, -29.2], [21.2, -30.2], [23.8, -29.8], [25.4, -28.6], [26.4, -27.1], [27.5, -25.8], [28.1, -24.9], [27.8, -24.2], [27.5, -23.6], [27.6, -23],
        [27.1, -22.2], [25.8, -21.6], [24, -21.4], [21.8, -21.6], [19.8, -22.4], [18, -24.4]];
      const kflow = (x, y) => (x > 24.6 && y > -25.6 ? 165 : y > -24.2 ? 140 : 188);
      const klicht = (x, y) => 0.42 + 0.5 * Math.max(0, Math.min(1, (-y - 21.4) / 8)) - huegel(x, y, [[22, -22, 3, 1.2, 0.3], [25, -25.4, 1.4, 0.8, 0.2]]) + huegel(x, y, [[26.8, -23.2, 1, 1, 0.3]]);
      let km = "";
      /* „M“ auf der Stirn (von der Seite: Bogenlinien), Scheitellinien, Linien vom Augenwinkel über die Wange */
      if (T.fein) km += falte(T, [[24.6, -29.2], [24.1, -28.4], [23.8, -27.7]], DK, 0.28, 0.85) + falte(T, [[23.6, -29.9], [23.2, -28.9], [23.2, -28]], DK, 0.26, 0.85) + falte(T, [[25.4, -28.4], [24.9, -27.8]], DK, 0.24, 0.8);
      if (T.fein) km += falte(T, [[22.4, -30.1], [20.6, -29.8], [18.8, -29], [17.4, -27.8]], DK, 0.3, 0.8) + falte(T, [[22.8, -29.3], [21, -28.8], [19.2, -27.6]], DK, 0.26, 0.7);
      km += falte(T, [[23.6, -26.3], [22.4, -25.8], [21, -25.6], [19.8, -24.6]], DK, 0.3, 0.85) + falte(T, [[24.1, -24.6], [22.9, -24.2], [21.7, -23.6], [20.5, -22.8]], DK, 0.26, 0.75);
      s += teil(T, kopf, T.lg("kopfk", [[0, "#9a7f5a"], [0.5, "#b29a74"], [1, "#d5c4a2"]]), { rand: false,
        innen: tex(T, "kk", { fx: 4.6, fy: 0.8, farbe: DK, staerke: 2, schwelle: 0.6, okt: 2 }, 185, 0.2, [16, -31, 28.2, -21]) +
          `<g${zottel(T, "c", "2.4 1", 0.2)}>${km}</g>` +
          mal(T, "kk", 0.35, T.form([[25.6, -23.5], [27.5, -23.7], [27.4, -22.5], [26.6, -21.8], [24.8, -21.5], [23, -21.7], [23.8, -22.9]], "#efe6d2", ` opacity=".85"`) +
            fleck(T, 24.8, -26.7, 1.4, 1.1, "#f2e8d2", 0.75) + (T.fein ? fleck(T, 22, -22.4, 2.6, 1, "#2a1e12", 0.25) + fleck(T, 22, -29.4, 3, 1, "#fff4dc", 0.25) : ""), true) +
          fell(T, kopf, 140, kflow, 0.42, EIMER, (x, y, z) => stufe(klicht(x, y), z, 5)) +
          `<path d="M26.4 -23.6h.01M25.8 -23.4h.01M25.2 -23.2h.01M26.1 -22.9h.01M25.5 -22.7h.01" stroke="#3a2a1c" stroke-width=".15" stroke-linecap="round"/>`,
        nach: randhaare(T, kopf, { n: 130, L: 0.32, flow: kflow, ab: 0.5, eimer: EIMER, wahl: (x, y, z) => stufe(klicht(x, y), z, 5), wo: (x, y) => x < 26.6 }),
      });
      /* Nasenspiegel (ziegelrot, dunkel gerandet), Mundlinie */
      s += T.form([[27.5, -25.15], [28, -25], [28.18, -24.55], [27.92, -24.1], [27.6, -24.3]], "#b47a6a") + falte(T, [[27.5, -25.15], [28, -25], [28.18, -24.55], [27.92, -24.1]], "#3a2018", 0.09, 0.7);
      s += `<ellipse cx="27.8" cy="-24.9" rx=".16" ry=".05" fill="#fff" opacity=".35"/><path d="M28 -24.2q-.25 .05 -.35 -.15" fill="none" stroke="#1a0c08" stroke-width=".09"/>`;
      s += falte(T, [[27.85, -23.95], [27.6, -23.35], [27.1, -22.85], [26.5, -22.7]], "#2a1812", 0.1, 0.85);
      /* Auge: groß, Hornhaut gewölbt, senkrechte Schlitzpupille, helle Umrandung */
      s += T.augeReal(24.7, -26.6, 0.8, { iris: "#c4c24c", iris2: "#6f7a24", pupille: "schlitz", offen: 0.86, winkel: -8, lid: "#1a120c" });
      s += `<path d="M25.6 -27.2q.45 .45 .2 1" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".06"/>`;
      /* Ohren: fernes (nur Spitze) dunkler; nahes mit Öffnung nach vorn und hellem Innenhaar */
      s += teil(T, [[21.6, -30.4], [22.4, -33.2], [22.9, -33.4], [24, -30.2]], "#6a5640", { rand: false, vol: false });
      const ohr = [[19.2, -29.2], [20.2, -32.2], [21.1, -34.1], [21.7, -34.4], [22.4, -33.2], [23.4, -31], [24.3, -29.6]];
      s += teil(T, ohr, T.lg("ohrk", [[0, "#6a5438"], [1, "#a68b62"]]), { rand: DK, randA: 0.22,
        innen: T.form([[21.8, -34], [22.6, -32.8], [23.5, -30.9], [24.2, -29.7], [23.2, -30.2], [22.2, -32.2]], "#c08f82", ` opacity=".7"`) +
          T.schnurrhaare(23.2, -30.4, 7, 1.6, -70, 50, "#efe6d6", 0.04) +
          fell(T, ohr, 50, () => 100, 0.3, EIMER, (x, y, z) => stufe(0.35, z, 5)) });
      /* Tasthaare: weiß, lang; Überaugen-Tasthaare */
      s += T.schnurrhaare(26.4, -23.1, T.fein ? 7 : 3, 6.6, 12, 46, "#f6f2ea", 0.055) + (T.fein ? T.schnurrhaare(26, -22.9, 5, 5.4, 168, 36, "#f6f2ea", 0.045) + T.schnurrhaare(24.8, -27.9, 3, 2.4, -75, 30, "#f6f2ea", 0.04) : "");
      s += "</g>";
      return { svg: s, box: [-28.3, -35.7, 29.6, 0], fuesse: [-10.5, -5.6, 11.3, 15.2], kopf: [17, -35.8, 29.7, -20.4] };
    } },
  /* =================================================================
     KANINCHEN — Hauskaninchen, wildfarben (agouti), sitzend
     RECHERCHE: mittelgroße Rassen 35–45 cm Körperlänge, 2–4 kg; Ohren aufrecht 10–12 cm, löffelförmig,
     an der Spitze gerundet, Rand bei Wildfarbe dunkel gesäumt; große, seitlich stehende Augen (Rundum-
     blick), dunkelbraun mit hellem Augenring; gespaltene Oberlippe, Nasenlöcher als schräge Schlitze,
     lange Tasthaare; Hinterläufe lang und kräftig, in Ruhe liegt der ganze Hinterfuß flach am Boden
     (Ferse hinten), die Keule bildet eine große Rundung; Vorderläufe kurz; Stummelschwanz („Blume“) oben
     dunkel, unten weiß; Fell dicht und weich, Agouti-Haare (graue Basis, gelbbraunes Band, schwarze
     Spitze), Rücken dunkler gestichelt, Nacken rostbraun, Bauch, Kinn und Schwanzunterseite weiß.
     ================================================================= */
  { id: "kaninchen", de: "das Kaninchen", syl: "Ka-NIN-chen", it: "il coniglio", itSyl: "co-NI-glio", en: "rabbit",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.4, hoehe: 0.34,
    zeichne(T) {
      T.RW = 0.08;
      const DK = "#2a2018";
      const EIMER = [["#3e3227", 0.045, 0.32], ["#5f4e3c", 0.045, 0.3], ["#85704f", 0.04, 0.3], ["#a99674", 0.04, 0.32], ["#cfc0a2", 0.035, 0.34]];
      const licht = (x, y) => 0.15 + 0.65 * Math.max(0, Math.min(1, (-y - 3) / 16)) + huegel(x, y, [[-9, -12, 5, 4, 0.2], [-6, -18, 8, 2, 0.15]]) - huegel(x, y, [[10, -6, 4, 2, 0.3], [-2, -4, 5, 2, 0.25]]);
      const flow = (x, y) => (y > -5 ? (x > 10 ? 95 : 175) : x < -8 ? 120 : 175 - 40 * Math.max(0, Math.min(1, (-y - 18) / -12)));
      const wahl = (x, y, z) => stufe(licht(x, y), z, 5);
      let s = "";
      /* fernes Vorderbein und ferner Hinterfuß (dunkler) */
      const fernV = [[10, -8], [12.6, -8.4], [12.6, -3.4], [13.6, -1.6], [15, -0.6], [14.8, 0, 1], [10.6, 0, 1], [10.4, -2], [10.4, -5]];
      s += teil(T, fernV, "#6e5c48", { rand: DK, randA: 0.2, volx: true, innen: fell(T, fernV, 30, () => 95, 0.5, EIMER, (x, y, z) => stufe(0.2, z, 5)) });
      const fernH = [[-8, -4], [4, -3], [5.4, -1.6], [5.6, -0.4], [5, 0, 1], [-9, 0, 1], [-9.6, -2]];
      s += teil(T, fernH, "#7a6852", { rand: DK, randA: 0.2, innen: fell(T, fernH, 30, () => 178, 0.6, EIMER, (x, y, z) => stufe(0.25, z, 5)) });
      /* Leib */
      const leib = [[-14.8, -2.2], [-17.2, -6.4], [-17.9, -10], [-16.8, -14], [-14.4, -16.8], [-11, -18.6], [-4, -19.8], [3, -18.8], [8, -17.4], [13, -15], [15.4, -10.8], [15.4, -7.4], [15.2, -3.4], [16.2, -1.7], [17.8, -0.7], [17.6, 0, 1],
        [12.8, 0, 1], [12.6, -2], [12.8, -5], [12, -6.6], [9, -6], [5, -4.2], [3.4, -2.4], [3.9, -0.8], [3.4, 0, 1], [-12.4, 0, 1]];
      const keule = [[-15.6, -4], [-16.4, -9], [-14.6, -14], [-9.6, -15.4], [-4.6, -13.4], [-2.4, -9], [-3, -5.2], [-7, -3.2], [-12, -2.8]];
      s += teil(T, leib, T.lg("kan", [[0, "#7c6750"], [0.45, "#94805f"], [0.75, "#a99576"], [1, "#c9bba2"]]), {
        rand: DK, randA: 0.1,
        innen: tex(T, "kn", { fx: 5, fy: 0.9, farbe: DK, staerke: 2.2, schwelle: 0.58, okt: 3 }, 170, 0.18, [-18, -20, 18, 0]) +
          mal(T, "kn", 0.7,
            /* Nacken rostbraun, Rücken dunkler gestichelt, Keule als Rundung, Bauch weiß, Schatten unten */
            T.form([[4, -18.4], [9, -17.4], [11, -15.6], [7, -15.4], [3, -16.6]], "#b07a48", ` opacity=".55"`) +
            T.form([[-15.6, -14.6], [-10.6, -18.6], [-4, -19.8], [3, -18.6], [2, -17], [-4, -18], [-10.4, -16.8], [-14.4, -13]], "#3a2c20", ` opacity=".35"`) +
            T.form([[-15, -12], [-12, -15], [-8, -15.2], [-5.6, -13.4], [-9, -13.6], [-13, -11.4]], "#f6ecd6", ` opacity=".35"`) +
            T.form([[-4.6, -13.4], [-2.4, -9], [-3, -5.2], [-1, -4], [0.4, -8], [-1.6, -13]], "#2a1e14", ` opacity=".28"`) + T.form([[-16.6, -8], [-15, -13], [-10.4, -15.2], [-6, -14], [-9.6, -13.2], [-14, -10.6]], "#f6ecd6", ` opacity=".22"`) +
            T.form([[9.6, -6.6], [12, -7], [15.2, -8.6], [15.2, -10.4], [12, -9.4], [8, -8.4], [4, -6.4], [3.4, -4.4]], "#efe6d6", ` opacity=".55"`) +
            T.form([[3.4, -2], [5, -4.2], [9, -6], [12, -6.6], [12.8, -5], [9, -4.2], [5, -2.6]], "#2a1e14", ` opacity=".35"`) +
            T.form([[-12.4, -0.2], [3, -0.2], [3.4, -1.6], [-11, -2]], "#2a1e14", ` opacity=".18"`) + T.form([[-9, -3.2], [-4, -3.8], [0, -3.6], [2.6, -2.8], [0, -2.6], [-4, -2.7], [-9, -2.4]], "#2a1e14", ` opacity=".4"`) + T.form([[-6, -2.4], [0, -2.5], [3, -2], [3.6, -1], [1.6, -1.6], [-4, -1.8]], "#e6dac4", ` opacity=".35"`) +
            T.form([[13, -8], [15.2, -7.4], [15, -3.4], [13.6, -3.6]], "#2a1e14", ` opacity=".25"`), true) +
          fell(T, leib, 590, flow, 0.6, EIMER, wahl, { kr: 0.15, szene: 0.1 }) +
          fell(T, keule, 160, () => 150, 0.8, EIMER, (x, y, z) => stufe(licht(x, y) + 0.15, z, 5)) +
          (T.fein ? [0, 1].map((i) => falte(T, [[16 - i * 1.1, -1.6], [16.4 - i * 1.1, -0.3]], DK, 0.1, 0.4)).join("") : ""),
        nach: randhaare(T, leib, { n: 300, L: 0.8, flow, ab: 0.55, eimer: EIMER, wahl, wo: (x, y) => y < -0.8, szene: 0.1 }),
      });
      /* Blume (Schwanz): rundes Wollknäuel, oben graubraun, unten weiß, flauschiger Rand */
      const blume = [[-16.4, -10.4], [-18.2, -10.6], [-19.4, -9.2], [-19.5, -7.2], [-18.4, -5.8], [-16.6, -5.8]];
      s += teil(T, blume, T.lg("blume", [[0, "#7a6650"], [0.38, "#9c8a72"], [0.5, "#e8e2d8"], [1, "#fbf8f2"]]), { rand: false,
        innen: mal(T, "bl", 0.4, fleck(T, -18.4, -8.6, 1.2, 0.9, "#ffffff", 0.6)) + fell(T, blume, 50, (x, y) => (y < -8.6 ? 200 : 160), 0.5, EIMER, (x, y, z) => (y > -8.4 ? 4 : stufe(0.4, z, 5))),
        nach: randhaare(T, blume, { n: 90, L: 0.7, flow: () => 190, ab: 0.75, eimer: [["#8a7660", 0.05, 0.6], ["#f6f2ea", 0.05, 0.8]], wahl: (x, y) => (y > -8.4 ? 1 : 0), kr: 0.3 }) });
      if (T.fein) s += kralle(T, 3.3, -0.45, 0.7, 62, "#4a3a2e", 0.3) + kralle(T, 2.1, -0.4, 0.65, 66, "#4a3a2e", 0.3);
      /* Kopf */
      const kopf = [[7.8, -20.6], [11, -22.2], [14.6, -21.6], [18.4, -19], [20.4, -17], [21.3, -15.4], [21.2, -14.3], [20.6, -13.5], [19.6, -12.7], [17.6, -12.2], [15.2, -12.6],
        [12.4, -13.2], [10, -14.6], [8.2, -17]];
      const kflow = (x, y) => (x > 16 ? 192 : y > -15 ? 150 : 185);
      const klicht = (x, y) => 0.4 + 0.5 * Math.max(0, Math.min(1, (-y - 12.5) / 9)) - huegel(x, y, [[12, -14, 3, 1.4, 0.3]]) + huegel(x, y, [[19.6, -15.6, 1.4, 1.4, 0.2]]);
      s += teil(T, kopf, T.lg("kopfkn", [[0, "#7e6a52"], [0.5, "#9c8768"], [1, "#cdbfa6"]]), { rand: false,
        innen: tex(T, "knk", { fx: 4.6, fy: 0.8, farbe: DK, staerke: 2.2, schwelle: 0.58, okt: 2 }, 185, 0.22, [7, -23, 22, -12]) +
          mal(T, "knk", 0.45, fleck(T, 14.4, -18.4, 2.4, 1.9, "#efe2c8", 0.7) + T.form([[18, -14.8], [21, -14.6], [20.6, -13.4], [18.6, -12.6], [16.4, -12.6], [16.8, -13.8]], "#efe6d6", ` opacity=".7"`) +
            fleck(T, 12.4, -14, 3.6, 1.4, "#2a1e14", 0.3) + fleck(T, 11.6, -21.4, 3, 0.9, "#f6ecd6", 0.3)) +
          fell(T, kopf, 380, kflow, 0.45, EIMER, (x, y, z) => stufe(klicht(x, y), z, 5)),
        nach: randhaare(T, kopf, { n: 120, L: 0.4, flow: kflow, ab: 0.5, eimer: EIMER, wahl: (x, y, z) => stufe(klicht(x, y), z, 5), wo: (x, y) => x < 20 }),
      });
      /* Nase: Nasenloch-Schlitz, gespaltene Oberlippe */
      s += `<path d="M21.05 -15.35q-.45 .1 -.75 .55M20.9 -14.5q-.2 .35 -.55 .5" fill="none" stroke="#2a1812" stroke-width=".13" stroke-linecap="round"/>`;
      s += `<path d="M20.4 -14.1q-.1 .4 -.4 .7q-.4 .2 -1 .1" fill="none" stroke="#2a1812" stroke-width=".11" stroke-linecap="round" opacity=".8"/>`;
      s += `<ellipse cx="20.6" cy="-15.9" rx=".5" ry=".22" fill="#fff" opacity=".25"/>`;
      /* Auge: groß, seitlich, fast schwarz, heller Augenring */
      s += T.augeReal(14.4, -18.4, 0.95, { iris: "#3a2210", iris2: "#140a04", offen: 0.9, winkel: -6, lid: "#140c08" });
      /* Tasthaare */
      s += T.schnurrhaare(19.6, -14.4, 7, 6, 10, 46, "#2a2018", 0.04) + T.schnurrhaare(19.2, -14.2, 4, 5, 172, 30, "#efe8dc", 0.04);
      s += T.schnurrhaare(14.6, -19.8, 3, 1.8, -80, 30, "#2a2018", 0.035);
      /* Ohren: fernes dunkler; nahes mit rosa Innenseite vorn, dunkler Saum an der Spitze */
      const ohrN = [[8.6, -20.4], [7.8, -24.6], [7, -28.6], [6.8, -31.6], [7.6, -33.3], [9, -33], [10.2, -30.6], [11.6, -26], [12.8, -21.4]];
      const ohrF = ohrN.map(([x, y]) => { const a = -0.2, dx = x - 11, dy = y + 21; return [11 + 1.2 + dx * Math.cos(a) - dy * Math.sin(a), -21 + 0.4 + dx * Math.sin(a) + dy * Math.cos(a)]; });
      s += teil(T, ohrF, T.lg("ohrf", [[0, "#3c2e22"], [1, "#6a5642"]]), { rand: false, vol: true });
      s += teil(T, ohrN, T.lg("ohrn", [[0, "#55432f"], [0.3, "#7e6a50"], [1, "#9a8466"]]), { rand: DK, randA: 0.25,
        innen: mal(T, "oi", 0.25, T.form([[9.1, -32.4], [10, -30.4], [11.3, -26], [12.4, -21.8], [11.2, -22.8], [10.2, -26.2], [9.3, -29.8]], "#c49a90", ` opacity=".55"`)) +
          falte(T, [[6.9, -30.4], [7.1, -32.4], [7.8, -33.2], [8.9, -33], [9.8, -31.6]], "#1e1610", 0.35, 0.75) +
          mal(T, "on", 0.3, T.form([[7.8, -30], [8.6, -25], [9.6, -21.4], [9, -21.2], [8, -25], [7.4, -29]], "#f2e6d0", ` opacity=".35"`)) +
          fell(T, ohrN, 90, () => 100, 0.4, EIMER, (x, y, z) => stufe(0.35 + (x < 9 ? 0.2 : 0), z, 5)) +
          T.schnurrhaare(11.6, -23, 5, 1.2, -70, 40, "#f2ece2", 0.03) });
      return { svg: s, box: [-19.7, -33.5, 21.4, 0], fuesse: [-8, 1.5, 12.7, 15.2], kopf: [6.5, -33.6, 21.6, -12] };
    } },
  /* =================================================================
     MEERSCHWEINCHEN — Hausmeerschweinchen, Glatthaar, dreifarbig (schildpatt-weiß)
     RECHERCHE: Körperlänge 20–25 cm, 0,7–1,2 kg, walzenförmiger Körper ohne sichtbaren Schwanz und
     ohne abgesetzten Hals; großer Kopf mit stumpfer, gewölbter Nase (Ramsnase), Nasenlöcher schräg,
     Oberlippe gespalten, lange Tasthaare; Augen dunkel, groß, leicht vorstehend, seitlich; Ohren als
     „Rosenohren“ – dünne, fast nackte, blütenblattförmige Ohrmuscheln, nach unten geklappt; kurze
     Beine, vorn 4 Zehen, hinten 3 Zehen mit Krallen, nackte rosa Sohlen; Glatthaar 2–3 cm, glänzend,
     liegt vom Kopf zum Hinterteil an; Dreifarbig: unregelmäßige Platten in Schwarz, Rot (Orange) und
     Weiß, oft weiße Blesse auf der Nase.
     ================================================================= */
  { id: "meerschweinchen", de: "das Meerschweinchen", syl: "MEER-schwein-chen", it: "la cavia", itSyl: "CA-via", en: "guinea pig",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.265, hoehe: 0.125,
    zeichne(T) {
      T.RW = 0.05;
      const DK = "#1a1512";
      /* Lichtwert und Farbe der Platte am Ort (x, y): 0 = weiß, 1 = rot, 2 = schwarz */
      const rot = [[-6.4, -12.4], [-2, -12.4], [1.8, -12.2], [2.6, -10.4], [3.4, -8.6], [2.2, -6.8], [1.6, -4.6], [-0.6, -3.6], [-2.6, -4.4], [-4, -6], [-5.8, -7.2], [-6.6, -9.6]];
      const schwarzH = [[-14, -7], [-12.6, -10.6], [-9.4, -12.4], [-7.6, -11.4], [-7.2, -9.6], [-8.4, -7.6], [-8, -5.6], [-9.6, -4], [-11.2, -2.6], [-14, -2.4]];
      const schwarzK = [[4.4, -12.4], [8.4, -11.6], [10.4, -10.4], [10.8, -9.2], [10.3, -8], [10.8, -6.4], [10.2, -5], [9.6, -3.4], [7.4, -2.8], [5.6, -3.6], [4.6, -5.4], [3.6, -7.6], [4.2, -9.8]];
      const platte = (x, y) => (T.inPoly(x, y, schwarzK) ? 2 : T.inPoly(x, y, schwarzH) ? 2 : T.inPoly(x, y, rot) ? 1 : 0);
      const licht = (x, y) => 0.2 + 0.7 * Math.max(0, Math.min(1, (-y - 2) / 9)) - huegel(x, y, [[0, -2.6, 8, 1.4, 0.3]]) + huegel(x, y, [[-4, -10, 6, 1.4, 0.15]]);
      const FARB = [
        [["#9a948a", 0.035, 0.35], ["#c9c3b6", 0.03, 0.32], ["#fbf8f2", 0.03, 0.3]],
        [["#7a3c16", 0.035, 0.42], ["#a8561a", 0.03, 0.38], ["#e09a52", 0.03, 0.3]],
        [["#050404", 0.035, 0.5], ["#2a2622", 0.03, 0.4], ["#5a5652", 0.028, 0.3]],
      ];
      const EIMER = FARB[0].concat(FARB[1], FARB[2]);
      const wahl = (x, y, z) => platte(x, y) * 3 + Math.round(Math.max(0, Math.min(1, licht(x, y) + (z - 0.5) * 0.4)) * 2);
      const flow = (x, y) => (y > -3.4 ? 160 : 178 - 30 * Math.max(0, Math.min(1, (-y - 11) / -8)));
      let s = "";
      /* ferne Füße */
      s += nagerfuss(T, 5.8, 2, 1, 3, "#9a7a72", "#e4d8cc") + nagerfuss(T, -7.4, 2.6, 1, 3, "#94746c", "#e4d8cc");
      /* nahe Füße: rosa Sohlen, Zehen mit Krallen */
      s += nagerfuss(T, 7.8, 2.1, 1.1, 4, "#ad8a80", "#e8dcd0") + nagerfuss(T, -5.8, 2.6, 1.1, 3, "#a5847a", "#e8dcd0");
      /* Leib + Kopf als ein Umriss (kein abgesetzter Hals) */
      const leib = [[-13.4, -4.4], [-13.3, -7.8], [-11.4, -10.6], [-7, -12.2], [-2, -12.5], [3, -11.8], [7, -11], [9.8, -9.9], [11.8, -8.3], [12.8, -6.6], [13.15, -5.5], [12.85, -4.8],
        [13, -4.25], [12.5, -3.75], [12, -3.3], [10.8, -2.7], [8.4, -1.6], [4, -0.7], [-2, -0.6], [-8, -0.6], [-12, -0.9]];
      s += teil(T, leib, "#d8d0c2", {
        rand: DK, randA: 0.15,
        innen: `<g${zottel(T, "a", "1.8 .8", 0.6)}>` + mal(T, "pl", 0.22, T.form(rot, "#c46a24") + T.form(schwarzH, "#1c1816") + T.form(schwarzK, "#1c1816"), true) + "</g>" +
          tex(T, "ms", { fx: 4, fy: 0.7, farbe: "#000", staerke: 2, schwelle: 0.6, okt: 2 }, 175, 0.18, [-13, -12, 13, -1]) +
          mal(T, "ms", 0.5, T.form([[-11.6, -2.4], [-4, -2.8], [4, -2.8], [10, -3.4], [10, -2.2], [4, -1.4], [-4, -1.2], [-11, -1.4]], "#000", ` opacity=".32"`) +
            T.form([[-11, -9.2], [-6, -11], [2, -11], [7, -10.4], [2, -9.8], [-6, -9.8], [-10.4, -8]], "#fff", ` opacity=".3"`) +
            fleck(T, 6.2, -5, 2.4, 1.6, "#000", 0.25) + T.form([[11.4, -7.6], [11.9, -6], [11.6, -4.6], [11.1, -3.6], [10.8, -4.8], [10.9, -6.4]], "#000", ` opacity=".14"`) + fleck(T, 12.3, -6.2, 0.8, 0.9, "#fff", 0.3)) +
          fell(T, leib, 1000, flow, 0.6, EIMER, wahl, { kr: 0.1, szene: 0.1 }),
        nach: randhaare(T, leib, { n: 260, L: 0.6, flow, ab: 0.45, eimer: EIMER, wahl, wo: (x, y) => y < -1.8 && x < 11.6, szene: 0.1 }),
      });
      /* Nase, Mund */
      s += `<path d="M13 -5.9q-.35 .05 -.6 .4" fill="none" stroke="#3a2420" stroke-width=".09" stroke-linecap="round"/>`;
      s += `<path d="M12.85 -4.8q-.25 .2 -.3 .5M12.45 -3.8q-.4 .1 -.9 -.05" fill="none" stroke="#3a2420" stroke-width=".07" stroke-linecap="round"/><ellipse cx="12.5" cy="-6.4" rx=".35" ry=".14" fill="#fff" opacity=".3"/>`;
      /* Auge: dunkel, rund, vorstehend */
      s += T.augeReal(8.6, -7.9, 0.62, { iris: "#3a2214", iris2: "#100804", offen: 0.95, lid: "#0a0706" });
      
      /* Rosenohr: dünn, fast nackt, nach unten geklappt */
      const ohr = [[4.6, -11.4], [6, -12.3], [7.3, -11.9], [7.4, -10.8], [6.6, -10.1], [5.4, -10.4]];
      s += teil(T, ohr, T.lg("ohrm", [[0, "#5a4a48"], [1, "#2a2220"]]), { rand: DK, randA: 0.3,
        innen: T.form([[5.3, -11.8], [7, -11.9], [6.9, -11.1], [5.8, -10.9]], "#8a6e6c", ` opacity=".5"`) + `<path d="M5 -11.1q1.1 -.6 2.3 -.5" fill="none" stroke="#000" stroke-width=".07" opacity=".55"/>` });
      /* Tasthaare */
      s += T.schnurrhaare(11.8, -4.9, 6, 3.8, 15, 46, "#1a1512", 0.03) + T.schnurrhaare(11.6, -4.8, 4, 3.4, 165, 30, "#efe8dc", 0.03);
      return { svg: s, box: [-13.45, -12.55, 13.05, 0], fuesse: [-6.1, -4.5, 6.8, 8.9], kopf: [3.5, -12.6, 13.2, -2] };
    } },
  /* =================================================================
     HAMSTER — Goldhamster (Syrischer Hamster), Wildfarbe
     RECHERCHE: Kopf-Rumpf 15–18 cm, 110–140 g, Stummelschwanz ca. 1 cm (im Fell verborgen); gedrungener,
     rundlicher Körper, kurze Beine, Bauch nah am Boden; Rücken goldbraun (agouti, dunkle Haarspitzen),
     Bauch und Kehle weiß bis cremefarben, scharfe Grenze an der Flanke; dunkelgraue bis schwarze
     „Backenbinde“ vom Wangenbereich nach hinten zur Schulter, darunter ein weißer Halbmond; große
     Backentaschen; runde, aufrechte, fast nackte graue Ohren; große, schwarze, vorstehende Augen;
     rosa Nase, weiße Schnauze, lange Tasthaare; rosa Pfoten, vorn 4, hinten 5 Zehen mit hellen Krallen.
     ================================================================= */
  { id: "hamster", de: "der Hamster", syl: "HAMS-ter", it: "il criceto", itSyl: "cri-CE-to", en: "hamster",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.17, hoehe: 0.098,
    zeichne(T) {
      T.RW = 0.03;
      const DK = "#2a1a10";
      const bauch = (x, y) => y > -3.3 + 0.9 * Math.exp(-(((x + 1) / 5) ** 2)) * -1 - (x > 5 ? (x - 5) * 0.5 : 0);
      const backe = [[6.2, -3.9], [4.8, -4.2], [3.2, -4], [1.8, -3.5], [0.8, -2.8], [1.8, -2.95], [3.2, -3.35], [4.8, -3.55]];
      const licht = (x, y) => 0.2 + 0.7 * Math.max(0, Math.min(1, (-y - 1.5) / 6)) - huegel(x, y, [[-1, -1.6, 5, 0.8, 0.3]]);
      const FARB = [[["#7a4a1c", 0.03, 0.45], ["#b5722e", 0.028, 0.38], ["#e0aa66", 0.026, 0.32]], [["#b8b0a4", 0.028, 0.35], ["#e2dcd0", 0.026, 0.35], ["#fdfaf4", 0.025, 0.35]], [["#1a1412", 0.03, 0.5], ["#3a3230", 0.028, 0.4], ["#5a524e", 0.026, 0.35]]];
      const EIMER = FARB[0].concat(FARB[1], FARB[2]);
      const zone = (x, y) => (T.inPoly(x, y, backe) ? 2 : bauch(x, y) ? 1 : 0);
      const wahl = (x, y, z) => zone(x, y) * 3 + Math.round(Math.max(0, Math.min(1, licht(x, y) + (z - 0.5) * 0.45)) * 2);
      const flow = (x, y) => (x > 4.6 ? (y > -3.4 ? 150 : 192) : y > -2.6 ? 165 : 182 - 30 * Math.max(0, Math.min(1, (-y - 7.6) / -5)));
      let s = "";
      /* ferne Pfoten */
      s += nagerfuss(T, 3.2, 1.6, 0.8, 3, "#b98580") + nagerfuss(T, -4.6, 2, 0.8, 3, "#b2807a");
      /* nahe Pfoten (vom Fell überdeckt) */
      s += nagerfuss(T, 4.5, 1.7, 0.9, 4, "#d29890") + nagerfuss(T, -5.4, 2.3, 0.9, 4, "#cc938b");
      /* Ohren: rund, fast nackt, grau; fernes dahinter */
      const ohrF = [[4.1, -6.9], [4.4, -8.3], [4.95, -8.7], [5.4, -8.3], [5.3, -6.7]];
      s += teil(T, ohrF, "#5e504c", { rand: false });
      const ohr = [[2.4, -7.2], [2.45, -8.7], [3, -9.5], [3.75, -9.55], [4.4, -8.9], [4.7, -7]];
      s += teil(T, ohr, T.lg("ohrh", [[0, "#6e5e5a"], [1, "#9a827c"]]), { rand: DK, randA: 0.18,
        innen: mal(T, "oh", 0.08, T.form([[3.05, -9.25], [3.8, -9.3], [4.3, -8.7], [4.45, -7.5], [3.8, -7.9], [3.3, -8.6]], "#cfa49c", ` opacity=".6"`)) + T.schnurrhaare(4, -7.8, 5, 0.6, -80, 60, "#d8ccc4", 0.015) });
      /* Leib */
      const leib = [[-8.2, -2.6], [-8.6, -4.8], [-7.6, -6.9], [-5.2, -8.3], [-2, -8.6], [1, -8.1], [3.2, -7.4], [5, -6.6], [6.6, -5.4], [7.5, -4.6], [8.05, -3.95], [8.32, -3.35], [8.2, -2.85], [7.85, -2.5],
        [7.2, -2.1], [6, -1.55], [4.6, -1], [1, -0.7], [-3, -0.7], [-6.4, -0.95]];
      s += teil(T, leib, T.lg("ham", [[0, "#c47f36"], [0.5, "#cf9048"], [0.62, "#ead9bf"], [1, "#f4eee4"]]), {
        rand: DK, randA: 0.1,
        innen: `<g${zottel(T, "a", "2.4 1", 0.22)}>` + mal(T, "hb", 0.08,
            T.form([[-8.6, -2.2], [-6, -2.8], [-2, -3.3], [1.4, -3.1], [4, -3], [6.2, -3.6], [8.4, -3.4], [8.6, 0], [-8.6, 0]], "#f6f1e8") +
            T.form(backe, "#2e2826") + T.form([[1.2, -2.6], [2.8, -2.9], [4.4, -3.25], [6, -3.5], [5.6, -2.9], [4, -2.4], [2.2, -2.2]], "#ffffff"), true) + "</g>" +
          tex(T, "hm", { fx: 7, fy: 1.2, farbe: DK, staerke: 2.2, schwelle: 0.58, okt: 2 }, 175, 0.22, [-8.4, -8, 8.3, -0.8]) +
          mal(T, "hm", 0.35, T.form([[-7, -1.2], [-2, -1.4], [3, -1.4], [6, -1.8], [6, -1], [3, -0.8], [-2, -0.8], [-7, -0.9]], "#000", ` opacity=".25"`) +
            T.form([[-6.4, -6.6], [-3.6, -7.6], [0, -7.6], [-0.6, -6.8], [-3.6, -6.8]], "#fff2d8", ` opacity=".4"`) +
            fleck(T, 7, -3.4, 1.1, 0.7, "#fff", 0.6) + fleck(T, 5.3, -5.3, 0.8, 0.7, "#3a2010", 0.15) + T.form([[-6.4, -7.2], [-3.6, -8.3], [0, -8.2], [-0.6, -7.4], [-3.6, -7.4]], "#fff2d8", ` opacity=".25"`)) +
          fell(T, leib, 1100, flow, 0.42, EIMER, wahl, { kr: 0.15, szene: 0.1 }),
        nach: randhaare(T, leib, { n: 300, L: 0.35, flow, ab: 0.5, eimer: EIMER, wahl, wo: (x, y) => y < -0.9 && x < 7.8, szene: 0.1 }),
      });
      /* Nase rosa, Mund */
      s += T.form([[7.95, -3.95], [8.22, -3.8], [8.33, -3.45], [8.12, -3.27], [7.92, -3.5]], "#d39088") + `<path d="M8.25 -3.5q-.12 .03 -.2 .16" fill="none" stroke="#5a2a28" stroke-width=".045"/>`;
      s += `<path d="M8.1 -3.28q0 .2 -.12 .32M7.98 -2.96q-.15 .1 -.35 .08" fill="none" stroke="#7a4a44" stroke-width=".04" stroke-linecap="round"/>`;
      /* Auge: schwarz, groß, vorstehend */
      s += T.augeReal(5.4, -5.3, 0.46, { iris: "#1a0e08", iris2: "#050302", offen: 0.98, lid: "#0a0604" });
      /* Tasthaare */
      s += T.schnurrhaare(7.7, -3.2, 7, 3, 12, 50, "#f4efe8", 0.018) + T.schnurrhaare(7.6, -3.1, 4, 2.6, 168, 30, "#3a2a20", 0.016);
      return { svg: s, box: [-8.65, -9.8, 8.36, 0], fuesse: [-4.2, -3.6, 4, 5.3], kopf: [1.8, -9.8, 8.4, -1.5] };
    } },
  /* =================================================================
     MAUS — Hausmaus (Mus musculus)
     RECHERCHE: Kopf-Rumpf 7,5–10 cm, Schwanz 5–10 cm (etwa körperlang), 12–30 g; spitze Schnauze,
     große, runde, dünne und fast nackte Ohren (grau-rosa, durchscheinend), große schwarze vorstehende
     Augen, lange Tasthaare; Fell oben graubraun (agouti), Bauch etwas heller grau bis gelblichgrau,
     ohne scharfe Grenze; Schwanz fast nackt mit Schuppenringen, oben etwas dunkler; Hinterfüße lang
     und schmal, rosa-grau, vorn 4, hinten 5 Zehen; Körperhaltung geduckt, Rücken gerundet.
     ================================================================= */
  { id: "maus", de: "die Maus", syl: "MAUS", it: "il topo", itSyl: "TO-po", en: "mouse",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.175, hoehe: 0.05,
    zeichne(T) {
      T.RW = 0.015;
      const DK = "#1e1814";
      const EIMER = [["#2a221c", 0.016, 0.45], ["#4e4338", 0.015, 0.4], ["#766a5a", 0.014, 0.38], ["#a09482", 0.013, 0.4], ["#cfc6b6", 0.012, 0.42]];
      const licht = (x, y) => 0.15 + 0.75 * Math.max(0, Math.min(1, (-y - 0.6) / 3.2)) - huegel(x, y, [[0, -0.7, 3, 0.4, 0.25]]);
      const flow = (x, y) => (x > 2.6 ? (y > -1.6 ? 160 : 192) : y > -1.2 ? 170 : 180 - 25 * Math.max(0, Math.min(1, (-y - 3.6) / -2.6)));
      const wahl = (x, y, z) => stufe(licht(x, y), z, 5);
      let s = "";
      /* Schwanz: lang, fast nackt, Schuppenringe */
      const sc = [[-3.8, -1.1], [-5.6, -0.62], [-7.6, -0.34], [-9.6, -0.42], [-11.1, -0.9], [-12.5, -1.15]];
      const sw = [0.5, 0.38, 0.3, 0.24, 0.18, 0.1];
      const schw = schlauch(sc, sw);
      let ringe = "";
      if (T.fein) for (let i = 1; i < 40; i++) { const k = abschnitt(sc, sw.map((w) => w * 1.2), i / 40, i / 40 + 0.004, 1); ringe += `M${folge(k[0], 2)}L${folge(k[k.length - 1], 2)}`; }
      s += teil(T, schw, T.lg("mschw", [[0, "#8a7468"], [0.5, "#b0948a"], [1, "#c8aca2"]]), { rand: DK, randA: 0.2, rw: 0.01,
        innen: (ringe ? `<path d="${ringe}" stroke="#5a463e" stroke-width=".012" stroke-opacity=".6" fill="none"/>` : "") +
          T.form(abschnitt(sc.map((p) => [p[0], p[1] - 0.06]), sw.map((w) => w * 0.3), 0, 1, 10), "#fff", ` opacity=".25"`) });
      /* Füße */
      s += nagerfuss(T, 0.9, 0.7, 0.26, 3, "#b8948c") + nagerfuss(T, -2.6, 1.3, 0.26, 3, "#b08c84") + nagerfuss(T, 1.8, 0.85, 0.3, 4, "#cba79f") + nagerfuss(T, -3.7, 1.7, 0.32, 4, "#c4a098");
      /* Ohren (hinter der Kopfkontur): groß, rund, dünn, durchscheinend */
      const ohrF = [[2.1, -3.2], [2.2, -3.95], [2.6, -4.35], [3, -4.15], [3.1, -3.5], [2.9, -3]];
      s += teil(T, ohrF, T.lg("mohrf", [[0, "#8e726a"], [1, "#6a5650"]]), { rand: false });
      const ohr = [[0.9, -3.3], [0.75, -4.2], [1.15, -4.85], [1.9, -5], [2.5, -4.55], [2.6, -3.7], [2.3, -3.05]];
      s += teil(T, ohr, T.lg("mohr", [[0, "#b49088"], [0.6, "#a07e76"], [1, "#7a605a"]]), { rand: DK, randA: 0.25, rw: 0.012,
        innen: mal(T, "mo", 0.06, T.form([[1.1, -4.3], [1.4, -4.75], [2, -4.8], [2.35, -4.4], [2.35, -3.7], [1.8, -3.6], [1.3, -3.8]], "#d8aaa2", ` opacity=".7"`)) +
          `<path d="M1.3 -4.2q.5 .2 .9 .7M1.5 -4.55q.4 .1 .7 .45" fill="none" stroke="#8a5e58" stroke-width=".02" opacity=".5"/>` });
      /* Leib */
      const leib = [[-4.6, -1.7], [-4.6, -3], [-3.4, -3.95], [-1.4, -4.2], [0.6, -3.8], [2, -3.25], [3.2, -2.7], [4.1, -2.1], [4.65, -1.65], [4.78, -1.38], [4.45, -1.15], [3.8, -0.92],
        [2.6, -0.6], [1, -0.42], [-1.6, -0.38], [-3.2, -0.46], [-4.2, -0.85]];
      s += teil(T, leib, T.lg("maus", [[0, "#6a5c4c"], [0.55, "#857664"], [0.8, "#a89c8a"], [1, "#bdb2a2"]]), {
        rand: DK, randA: 0.12,
        innen: tex(T, "mm", { fx: 14, fy: 2.4, farbe: DK, staerke: 2.2, schwelle: 0.56, okt: 2 }, 175, 0.25, [-4.6, -4, 4.8, -0.5]) +
          mal(T, "mm", 0.1, T.form([[-3.6, -0.7], [0, -0.8], [3, -1], [3, -0.6], [0, -0.5], [-3.6, -0.6]], "#000", ` opacity=".3"`) +
            T.form([[-3.4, -3.2], [-1.4, -3.75], [0.6, -3.5], [0, -3.1], [-1.6, -3.2]], "#fff", ` opacity=".25"`) + fleck(T, 3.9, -1.6, 0.4, 0.3, "#d8cfc0", 0.6)) +
          fell(T, leib, 900, flow, 0.26, EIMER, wahl, { kr: 0.15, szene: 0.1 }),
        nach: randhaare(T, leib, { n: 260, L: 0.2, flow, ab: 0.5, eimer: EIMER, wahl, wo: (x, y) => y < -0.6 && x < 4.4, szene: 0.1 }),
      });
      /* Nase rosa, Mund */
      s += T.form([[4.55, -1.72], [4.78, -1.62], [4.84, -1.42], [4.68, -1.3], [4.52, -1.45]], "#d09088") + `<path d="M4.62 -1.33q.02 .12 -.08 .2" fill="none" stroke="#6a3c36" stroke-width=".02"/>`;
      /* Auge: schwarz, groß, vorstehend */
      s += T.augeReal(3, -2.42, 0.27, { iris: "#140c08", iris2: "#040202", offen: 1, lid: "#0a0604" });
      /* Tasthaare */
      s += T.schnurrhaare(4.3, -1.4, 8, 2.8, 10, 50, "#2a221c", 0.01) + T.schnurrhaare(4.2, -1.35, 5, 2.4, 170, 30, "#d8d0c4", 0.009);
      return { svg: s, box: [-12.6, -5.02, 4.86, 0], fuesse: [-2.85, -1.95, 1.25, 2.2], kopf: [0.5, -5.1, 4.9, -0.8] };
    } },
  /* =================================================================
     WELLENSITTICH — Wildfarbe grün (Hahn)
     RECHERCHE: Gesamtlänge ca. 18 cm (davon Schwanz 8–9 cm), 30–40 g; Bauch, Brust und Bürzel
     hellgrün; Stirn, Gesicht und Kehle gelb („Maske“); Hinterkopf, Nacken und Rücken gelb mit feiner
     schwarzer Wellenzeichnung; Flügeldecken schwarz mit gelben Säumen (Schuppenmuster); Schwungfedern
     schwärzlich mit grünlichen Säumen; violettblauer Wangenfleck, an der Kehle je Seite drei schwarze
     Kehlpunkte (der äußere am Wangenfleck); Wachshaut über dem Schnabel beim Hahn blau, bei der Henne
     braun; kleiner, stark gebogener, oliv-gelblicher Schnabel, größtenteils von Federn umgeben; Auge
     dunkel mit hellem Irisring (erwachsen); Schwanz lang, gestuft, dunkel kobaltblau, äußere Federn mit
     gelbem Fleck; Füße blaugrau, Zehen paarig (2 vorn, 2 hinten).
     ================================================================= */
  { id: "wellensittich", de: "der Wellensittich", syl: "WEL-len-sit-tich", it: "il pappagallino", itSyl: "pap-pa-gal-LI-no", en: "budgie",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.12, hoehe: 0.143,
    zeichne(T) {
      T.RW = 0.03;
      const DK = "#141410";
      let s = "";
      /* Schwanz: lang, gestuft, kobaltblau */
      const sc = [[-2.2, -3.8], [-3.8, -2.6], [-5.6, -1.45], [-7.2, -0.6]];
      for (const [d, f, w] of [[0.5, "#1c2f6a", 1.1], [0, "#24408c", 0.9], [-0.35, "#2e56a8", 0.7]]) {
        const c = sc.map((p, i) => [p[0] + d * 0.4 * i / 3, p[1] - d * 0.35 * i / 3 + (d > 0 ? 0.25 * i / 3 : 0)]);
        const k = schlauch(c, [w, w * 0.95, w * 0.85, w * 0.5]);
        s += teil(T, k, f, { rand: DK, randA: 0.35, rw: 0.02, innen: falte(T, c, "#0e1a40", 0.04, 0.6) + T.form(abschnitt(c, w * 0.25, 0, 1, 4).map((p) => [p[0] - 0.12, p[1] - 0.1]), "#7ab0e8", ` opacity=".3"`) });
      }
      /* Füße: blaugrau, 2 Zehen vorn, 2 hinten, dunkle Krallen */
      const fuss = (x, f) => T.linie([[x - 0.1, -1.7], [x, -1.1], [x + 0.1, -0.5]], f, 0.42) +
        T.linie([[x, -0.45], [x + 0.9, -0.25], [x + 1.7, -0.18]], f, 0.26) + T.linie([[x, -0.45], [x + 0.6, -0.15], [x + 1.25, -0.12]], f, 0.24) +
        T.linie([[x, -0.45], [x - 0.6, -0.2], [x - 1.05, -0.14]], f, 0.24) +
        kralle(T, x + 1.65, -0.2, 0.32, 70, "#2a2a30", 0.28) + kralle(T, x + 1.2, -0.14, 0.28, 75, "#2a2a30", 0.28) + kralle(T, x - 1.0, -0.17, 0.26, 115, "#2a2a30", 0.28);
      s += fuss(0.9, "#7d8496") + fuss(0.2, "#9aa2b6");
      if (T.fein) s += `<path d="M.05 -1.5l.32 .08M.1 -1.1l.3 .06M.15 -.75l.3 .04" stroke="#6a7084" stroke-width=".04" opacity=".7"/>`;
      /* Leib + Kopf */
      const leib = [[-1.8, -2.2], [0.4, -1.5], [2.2, -3], [3.4, -5.8], [3.75, -8.2], [3.65, -9.4], [3.9, -10.3], [4.25, -11], [4.45, -11.8], [4.05, -12.9], [3, -13.9], [1.6, -14.15],
        [0.2, -13.45], [-0.6, -12], [-1.4, -10], [-2.6, -6.4], [-3.1, -3.8]];
      const maske = [[3.7, -9.2], [3.4, -9.6], [2.4, -9.4], [1.4, -10.2], [0.8, -11.6], [1.2, -12.9], [2.2, -13.7], [3.2, -13.6], [4.3, -12.6], [4.5, -11.4], [4.1, -10.2]];
      /* Schuppenreihen der Brust (Federspitzen) */
      let schuppen = "";
      if (T.fein) for (let i = 0; i < 260; i++) {
        const x = -2.6 + T.rnd() * 6.4, y = -9.4 + T.rnd() * 7.2;
        if (!T.inPoly(x, y, leib) || T.inPoly(x, y, maske)) continue;
        schuppen += `M${folge([x - 0.22, y], 2)}q${folge([0.22, 0.2, 0.44, 0], 2)}`;
      }
      /* Wellenzeichnung Hinterkopf/Nacken: feine schwarze Bögen */
      let wellen = "";
      for (let i = 0; i < 18; i++) {
        const y = -13.95 + i * 0.25, x0 = 0.4 - i * 0.07, x1 = Math.min(2.2, 1.3 + i * 0.09) - (i > 10 ? (i - 10) * 0.2 : 0);
        wellen += `M${folge([x0 - 0.8, y + 0.12], 2)}Q${folge([(x0 + x1) / 2 - 0.3, y - 0.12], 2)} ${folge([(x0 + x1) / 2 + 0.2, y + 0.04], 2)}T${folge([x1, y + 0.02], 2)}`;
      }
      s += teil(T, leib, T.lg("welli", [[0, "#f2e04a"], [0.3, "#e8dc3c"], [0.42, "#7ccc3a"], [0.75, "#58b432"], [1, "#4a9c2c"]]), {
        rand: DK, randA: 0.12,
        innen: mal(T, "w", 0.25, T.form(maske, "#f4e24c") + T.form([[-1.4, -10], [-0.6, -12], [0.4, -12.4], [0.6, -10.4], [-0.6, -8]], "#d8d040", ` opacity=".6"`) +
            fleck(T, 2.8, -6, 1.6, 2.6, "#c8f0a0", 0.35) + fleck(T, 0.4, -3.6, 2.4, 1.2, "#1a4a10", 0.3)) +
          `<path d="${wellen}" fill="none" stroke="#1a1a12" stroke-width=".075" stroke-linecap="round"/>` +
          (schuppen ? `<path d="${schuppen}" fill="none" stroke="#2e7a1e" stroke-width=".04" stroke-opacity=".28"/>` : "") +
          fell(T, leib, 260, (x, y) => (y < -9 ? 110 : 100), 0.35, [["#3a8a24", 0.03, 0.35], ["#8ad84a", 0.03, 0.35], ["#e8d438", 0.03, 0.3]], (x, y, z) => (T.inPoly(x, y, maske) ? 2 : z < 0.5 ? 0 : 1), { kr: 0.2 }),
        nach: randhaare(T, leib, { n: 90, L: 0.22, flow: () => 100, ab: 0.6, eimer: [["#4a9c2c", 0.03, 0.5], ["#efdc48", 0.03, 0.5]], wahl: (x, y) => (y < -9.4 ? 1 : 0), szene: 0.2 }),
      });
      /* Wangenfleck violettblau, Kehlpunkte */
      s += `<ellipse cx="3.05" cy="-10.45" rx=".55" ry=".42" fill="#5a46b4" transform="rotate(-20 3.05 -10.45)"/><ellipse cx="2.95" cy="-10.55" rx=".28" ry=".18" fill="#9a8ae6" opacity=".6"/>`;
      s += [[2.85, -9.75, 0.2], [3.45, -9.45, 0.17], [2.25, -9.95, 0.15]].map(([x, y, rr]) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="#111"/>`).join("");
      /* Flügel: Deckfedern schwarz mit gelben Säumen (Schuppenmuster), Schwingen dunkel mit grünen Säumen */
      const fluegel = [[-0.3, -11], [0.9, -10.4], [1.7, -8.6], [1.6, -6.4], [0.8, -4.4], [-0.6, -3], [-2.4, -2.2], [-3.7, -1.9, 1], [-3.3, -3.2], [-2.6, -5.6], [-1.9, -8.2], [-1.2, -10.2]];
      let fl = "";
      /* Schwungfedern (unten, lang) */
      for (let i = 0; i < 6; i++) {
        const t = i / 5, x0 = -1.6 + t * 2.6, y0 = -6.2 + t * 0.4;
        const k = schlauch([[x0, y0], [x0 - 1.2 - t * 0.4, y0 + 2.2], [x0 - 2.3 - t * 0.5, y0 + 4 - t * 0.5]], [0.9, 0.85, 0.3]);
        fl += T.form(k, i % 2 ? "#1e2420" : "#262c26") + falte(T, k.slice(0, 3), "#6aa848", 0.06, 0.6);
      }
      /* Deckfedern in Reihen, von unten nach oben (obere überdecken die unteren) */
      const reihen = T.fein ? 10 : 6;
      for (let reihe = reihen - 1; reihe >= 0; reihe--) {
        const n = (T.fein ? 7 : 4) - Math.floor(reihe / 4);
        const q = 7 / reihen;
        for (let j = 0; j < n; j++) {
          const cx = -1.5 + j * (2.9 / n) + (reihe % 2) * 0.2 + reihe * 0.04 * q, cy = -10.1 + reihe * 0.6 * q + j * 0.16;
          if (!T.inPoly(cx, cy, fluegel)) continue;
          const w = 0.42 * q, h = 0.48 * q;
          const f = [[cx - w, cy - h], [cx + w, cy - h], [cx + w * 0.9, cy + h * 0.2], [cx, cy + h * 0.75], [cx - w * 0.9, cy + h * 0.2]];
          fl += T.form(f, "#e8d24a") + T.form(f.map(([x, y]) => [cx + (x - cx) * 0.8, cy - h * 0.12 + (y - cy) * 0.8]), "#161812");
        }
      }
      s += teil(T, fluegel, "#1e221c", { rand: DK, randA: 0.3, vol: true, innen: fl + mal(T, "fl", 0.3, fleck(T, -0.6, -9.6, 1.4, 1, "#fff", 0.15)) });
      /* Schnabel: klein, stark gebogen, oliv-gelblich; Wachshaut blau */
      s += T.form([[4.05, -11.3], [4.55, -11.35], [4.78, -10.95], [4.68, -10.45], [4.45, -10.15, 1], [4.38, -10.55], [4.1, -10.75]], "#c8b88e") +
        T.form([[4.42, -10.2], [4.3, -10.55], [4.05, -10.65], [4.15, -10.35]], "#8a7a5a") + `<path d="M4.2 -11.15q.38 .15 .45 .6" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width=".05"/>`;
      s += T.form([[4.0, -11.85], [4.42, -11.95], [4.62, -11.6], [4.52, -11.3], [4.05, -11.3]], "#4a6ad0") + `<circle cx="4.42" cy="-11.65" r=".06" fill="#1a2a60"/><ellipse cx="4.25" cy="-11.8" rx=".15" ry=".05" fill="#fff" opacity=".45"/>`;
      /* Auge mit hellem Irisring */
      s += `<circle cx="2.65" cy="-12.25" r=".42" fill="#f2efe2"/>` + T.augeReal(2.68, -12.25, 0.3, { iris: "#d8d2c0", iris2: "#8a8270", offen: 1, lid: "#3a3a2a" });
      return { svg: s, box: [-7.4, -14.3, 4.87, 0], fuesse: [0.5, 1.2], kopf: [0, -14.4, 4.9, -9] };
    } },
  /* =================================================================
     GOLDFISCH — gewöhnlicher Goldfisch (Carassius auratus), Kometen-/Normalform
     RECHERCHE: im Aquarium/Teich meist 10–20 cm; Körper wie die Giebel (Karausche): seitlich
     abgeflacht, gestreckt-hochrückig, Rücken- und Bauchlinie gleichmäßig gebogen, kleiner Kopf ohne
     Barteln, endständiges kleines Maul; lange Rückenflosse (über 15 Strahlen, vorn ein kräftiger
     Hartstrahl), einfache, tief gegabelte Schwanzflosse, kurze Afterflosse, Bauchflossen unter der
     Brustflossen-Mitte, Brustflossen hinter dem Kiemendeckel; große Rundschuppen in schrägen Reihen,
     Seitenlinie; Farbe orange-gold mit hellerem Bauch, Flossen durchscheinend orange; Auge groß mit
     goldener Iris.
     ================================================================= */
  { id: "goldfisch", de: "der Goldfisch", syl: "GOLD-fisch", it: "il pesce rosso", itSyl: "PE-sce ROS-so", en: "goldfish",
    gruppe: "Haustiere", lebensraum: "Zuhause", schwimmt: true,
    laenge: 0.153, hoehe: 0.077,
    zeichne(T) {
      T.RW = 0.03;
      const DK = "#5a2008";
      let s = "";
      const flosse = (pts, strahlen, op = 0.55) => teil(T, pts, T.lg("flosse", [[0, "#f08a2a", 0.85], [0.6, "#f4a850", 0.6], [1, "#f8d0a0", 0.35]]), { rand: "#b8500e", randA: 0.3, rw: 0.015, vol: false,
        innen: `<path d="${strahlen}" fill="none" stroke="#c0500e" stroke-width=".028" stroke-opacity="${op}"/>` });
      const strahlen = (a, b, n, kr = 0.1) => {
        let d = "";
        for (let i = 0; i <= n; i++) {
          const t = i / n, ax = a[0][0] + (a[1][0] - a[0][0]) * t, ay = a[0][1] + (a[1][1] - a[0][1]) * t;
          const bx = b[0][0] + (b[1][0] - b[0][0]) * t, by = b[0][1] + (b[1][1] - b[0][1]) * t;
          d += `M${folge([ax, ay], 2)}Q${folge([(ax + bx) / 2 + kr, (ay + by) / 2 - kr], 2)} ${folge([bx, by], 2)}`;
        }
        return d;
      };
      /* ferne Brust- und Bauchflosse (blasser) */
      s += `<g opacity=".55">` + flosse([[2.8, -2.3], [1.4, -1.2], [0.6, -0.6], [1, -1.5], [2, -2.5]], strahlen([[2.8, -2.3], [2, -2.5]], [[1.2, -1], [0.6, -0.6]], 4)) + "</g>";
      /* Schwanzflosse: tief gegabelt */
      const schwanz = [[-5.2, -4.3], [-6.6, -5.4], [-8.2, -6.4], [-8.7, -6.2, 1], [-8.1, -5.1], [-7.3, -3.7, 1], [-8.1, -2.2], [-8.7, -1, 1], [-8.2, -0.8], [-6.6, -1.8], [-5.2, -2.8]];
      s += flosse(schwanz, strahlen([[-5.3, -4.2], [-5.3, -3.6]], [[-8.6, -6.2], [-7.4, -3.75]], 9, 0.15) + strahlen([[-5.3, -3.5], [-5.3, -2.9]], [[-7.4, -3.65], [-8.6, -1]], 9, -0.15));
      /* Rückenflosse: lang, vorn hoch */
      const ruecken = [[2, -5.9], [1.4, -7.1], [0.9, -7.7, 1], [-0.4, -7.3], [-1.8, -6.6], [-3, -5.9], [-2.8, -5.6], [0, -5.9]];
      s += flosse(ruecken, strahlen([[1.8, -5.9], [-2.8, -5.7]], [[0.95, -7.65], [-2.9, -5.95]], 12, 0.05));
      /* Afterflosse, Bauchflosse */
      s += flosse([[-2, -2.1], [-2.9, -1.2], [-3.9, -0.7, 1], [-3.8, -1.4], [-3.4, -2.3]], strahlen([[-2, -2.1], [-3.4, -2.3]], [[-2.9, -1.2], [-3.85, -0.75]], 5));
      s += flosse([[1.9, -1.6], [1.2, -0.7], [0.4, 0, 1], [0.5, -0.8], [0.9, -1.6]], strahlen([[1.9, -1.6], [0.9, -1.6]], [[1.2, -0.6], [0.45, -0.05]], 5));
      /* Körper */
      const leib = [[6.65, -3.5], [6.2, -4.4], [5.4, -5.05], [3.4, -5.8], [1.6, -6.05], [-1.6, -5.85], [-3.6, -5.1], [-4.8, -4.45], [-5.7, -4.05], [-5.75, -2.95], [-4.8, -2.6],
        [-2.6, -2], [0.6, -1.55], [2.4, -1.65], [4.4, -2.15], [5.8, -2.75], [6.55, -3.15]];
      /* Schuppen: Bögen (hinterer Rand) in schrägen Reihen */
      let schuppen = "";
      const sw = 0.62;
      for (let c = 0; c < 18; c++) for (let rI = 0; rI < 9; rI++) {
        const x = 4 - c * sw * 0.85, y = -6 + rI * sw * 0.72 + (c % 2) * sw * 0.36;
        if (!T.inPoly(x, y, leib) || x > 4.2) continue;
        if (!T.fein && (c + rI) % 2) continue;
        schuppen += `M${folge([x, y - sw * 0.42], 2)}Q${folge([x - sw * 0.55, y], 2)} ${folge([x, y + sw * 0.42], 2)}`;
      }
      /* Rundschuppen einzeln (fein): vom Schwanz zum Kopf gelegt, jede vordere überdeckt die hintere –
         sichtbar bleibt der hintere Teil mit dunklem Rand und hellem Glanz */
      let platten = "";
      if (T.fein) {
        const g = T.rg("schuppe", [[0, "#f7a440", 0], [0.6, "#ffe6b0", 0.16], [0.8, "#f39030", 0.05], [0.93, "#b8480e", 0.4], [1, "#8a3008", 0.55]], 0.62, 0.5, 0.52);
        for (let c = 18; c >= 0; c--) for (let rI = -1; rI < 11; rI++) {
          const x = 4 - c * sw * 0.8, y = -6.4 + rI * sw * 0.7 + (c % 2) * sw * 0.35 - c * 0.04;
          if (!T.inPoly(x, y, leib) || x > 4.2) continue;
          const k = 0.75 + 0.25 * Math.min(1, (4.4 - x) / 2.5) - Math.max(0, (y + 2.6) * 0.18) - Math.max(0, (-x - 3.4) * 0.08);
          platten += `<circle cx="${zahl(x + sw * 0.1, 2)}" cy="${zahl(y, 2)}" r="${zahl(sw * 0.66 * k, 2)}" fill="${g}"/>`;
        }
        schuppen = "";
      }
      s += teil(T, leib, T.lg("gold", [[0, "#b8461a"], [0.25, "#e2701e"], [0.55, "#f3962e"], [0.8, "#f8c070"], [1, "#fbe0b0"]]), {
        rand: DK, randA: 0.25, vol: false,
        innen: (schuppen ? `<path d="${schuppen}" fill="none" stroke="#a8400c" stroke-width=".045" stroke-opacity=".4"/>` : "") + platten +
          mal(T, "gf", 0.25, T.form([[-5.6, -2.95], [-2.6, -2], [0.6, -1.55], [3, -1.7], [3, -1.95], [0, -1.85], [-3, -2.3]], "#7a3010", ` opacity=".25"`) + T.form([[5.2, -5], [3.2, -5.7], [0, -5.85], [-3, -5.2], [-2.6, -4.7], [0, -5.1], [3, -5], [4.8, -4.3]], "#fff1d0", ` opacity=".45"`) +
            T.form([[-5.6, -3], [-2.6, -2.1], [0.6, -1.6], [3, -1.8], [3, -2.4], [0, -2.3], [-3, -2.8]], "#ffe6c0", ` opacity=".35"`)) +
          falte(T, [[4.4, -4.6], [2, -4.3], [-0.5, -4.1], [-3, -3.9], [-5.4, -3.6]], "#8a2e08", 0.06, 0.45) +
          (T.fein ? `<path d="M3.8 -4.5h.01M3.2 -4.42h.01M2.6 -4.36h.01M2 -4.3h.01M1.4 -4.24h.01M.8 -4.18h.01M.2 -4.12h.01M-.4 -4.06h.01M-1 -4h.01M-1.6 -3.96h.01M-2.2 -3.92h.01M-2.8 -3.86h.01M-3.4 -3.8h.01M-4 -3.72h.01M-4.6 -3.66h.01" stroke="#6a2006" stroke-width=".09" stroke-linecap="round" opacity=".55"/>` : "") +
          /* Kopf ohne Schuppen, Kiemendeckel */
          T.form([[6.7, -3.5], [6.2, -4.45], [5.4, -5.1], [4.6, -5.4], [4.3, -4], [4.5, -2.4], [5.8, -2.7], [6.6, -3.1]], T.lg("fkopf", [[0, "#d2601c"], [0.45, "#f08a28"], [0.85, "#f6b060"], [1, "#f8c888"]])) +
          mal(T, "gk", 0.15, fleck(T, 5.6, -4.9, 0.9, 0.35, "#fff2d8", 0.6) + T.form([[4.6, -5.2], [4.3, -4], [4.5, -2.6], [5, -2.8], [4.8, -4], [5, -5]], "#8a3008", ` opacity=".25"`) + fleck(T, 5.6, -3, 0.8, 0.3, "#ffe6c0", 0.5)) +
          falte(T, [[4.7, -5.3], [4.3, -4.4], [4.25, -3.4], [4.55, -2.4]], "#9a3a0a", 0.06, 0.5) + falte(T, [[4.9, -5.1], [4.5, -4.3], [4.45, -3.4], [4.75, -2.5]], "#ffd6a0", 0.05, 0.5),
      });
      /* Maul */
      s += `<path d="M6.7 -3.35q-.25 .05 -.5 0" fill="none" stroke="#7a2a08" stroke-width=".05" stroke-linecap="round"/>`;
      /* Auge: groß, goldene Iris */
      s += `<circle cx="5.2" cy="-4.05" r=".56" fill="#d8a040"/>` + `<circle cx="5.2" cy="-4.05" r=".5" fill="${T.rg("fiauge", [[0, "#f8d880"], [0.7, "#d09030"], [1, "#7a4a10"]], 0.4, 0.4, 0.6)}"/>` +
        `<circle cx="5.25" cy="-4.05" r=".27" fill="#050302"/><ellipse cx="5.07" cy="-4.2" rx=".12" ry=".08" fill="#fff" opacity=".9"/><circle cx="5.36" cy="-3.9" r=".04" fill="#fff" opacity=".5"/>`;
      /* nahe Brustflosse, durchscheinend */
      s += flosse([[3.6, -2.9], [2.4, -2.2], [1.2, -1.2], [1.6, -2.1], [2.9, -3.1]], strahlen([[3.6, -2.9], [2.9, -3.1]], [[2, -1.8], [1.25, -1.25]], 5), 0.55);
      return { svg: s, box: [-8.75, -7.75, 6.72, 0], kopf: [3.4, -6.2, 6.8, -1.9] };
    } },
];
