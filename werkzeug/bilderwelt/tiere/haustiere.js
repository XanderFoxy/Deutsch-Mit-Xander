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
  if (o.rand !== false) s += u(` fill="none" stroke="${o.rand || "#000"}" stroke-opacity="${o.randA != null ? o.randA : 0.3}" stroke-width="${o.rw || T.RW || 0.3}" stroke-linejoin="round"`);
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
const mal = (T, n, sd, inhalt) => `<g filter="${weich(T, n, sd)}">${inhalt}</g>`;
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
          fell(T, leib, 600, flow, 1.4, EIMER, wahlL, { dez: 1, szene: 0.12, lf: (x, y) => (y > -28 ? 0.6 : 1) }) +
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
          fell(T, kopf, 300, kflow, 0.6, EIMER, (x, y, z) => stufe(klicht(x, y), z, 5), { dez: 1 }) +
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
      return { svg: s, box: [-42.6, -76.1, 58.8, 0] };
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
    laenge: 0.61, hoehe: 0.345,
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
      s += `<g transform="matrix(.88 0 0 1 2.16 0)">`;
      /* ferne Beine (dunkler, mit Ringen und Sohlenstreif) */
      const fernH = [[-7.6, -15], [-9.4, -12.4], [-11, -9], [-12.4, -6.2], [-12.4, -2.6], [-11.6, -1.8], [-10.4, -1], [-10.2, -0.3], [-10.7, 0, 1], [-15, 0, 1], [-15.4, -1], [-15.6, -3.6], [-16.2, -7], [-15.6, -8.8], [-15.8, -13]];
      const fernV = [[6, -14], [10.6, -14], [10.6, -10], [10.2, -6.5], [10, -3.6], [10.8, -2.2], [12, -1.4], [12.3, -0.5], [11.8, 0, 1], [7.6, 0, 1], [7.3, -0.8], [7.6, -2.6], [7.9, -3.6], [7.6, -7], [7, -11]];
      const fern = T.lg("fernk", [[0, "#7c6748"], [1, "#54432e"]]);
      for (const P of [fernH, fernV]) {
        const xb = P[0][0];
        s += teil(T, P, fern, { rand: DK, randA: 0.2, volx: true,
          innen: `<g${zottel(T, "a", "1.4 .6", 0.25)}>` + (xb > 0 ? [-11, -8.8, -6.6, -4.4].map((y) => T.form([[5, y], [13, y + 0.4], [13, y + 0.85], [5, y + 0.45]], DK, ` opacity=".6"`)).join("")
            : T.form([[-16.6, -7.4], [-15.2, -7.4], [-15, 0], [-16.6, 0]], DK, ` opacity=".75"`) + [-12, -9.8].map((y) => T.form([[-17, y], [-8, y + 1.4], [-8, y + 2], [-17, y + 0.6]], DK, ` opacity=".5"`)).join("")) + "</g>" +
            fell(T, P, 30, () => 95, 0.5, EIMER, (x, y, z) => stufe(0.2, z, 5)) });
      }
      /* Schwanz: hängt in sanftem Bogen, Spitze leicht gehoben; geringelt, dunkle Spitze */
      const sc = [[-19.4, -23], [-23, -20.6], [-25.8, -16.4], [-27.6, -11.6], [-29.4, -7.4], [-31.8, -4.6], [-34.8, -3.4], [-37.2, -3.6], [-38.9, -4.6]];
      const sw = [3.2, 2.9, 2.7, 2.6, 2.5, 2.45, 2.4, 2.3, 2];
      const schw = schlauch(sc, sw).concat([]);
      const sflow = (x, y) => (y < -18 ? 140 : y < -8 ? 112 : x > -34 ? 160 : 205);
      let ringe = "";
      for (const [a, b] of [[0.24, 0.29], [0.36, 0.415], [0.48, 0.54], [0.6, 0.66], [0.71, 0.77], [0.81, 0.87], [0.91, 1.04]]) ringe += T.form(abschnitt(sc, sw.map((w) => w + 1), a, b), DK, ` opacity=".85"`);
      s += teil(T, schw, T.lg("schw", [[0, "#a68c66"], [1, "#6f5a3e"]], 0, 0, 1, 0.4), { rand: false,
        innen: `<g${zottel(T, "a", "1.4 .6", 0.25)}>${ringe}${T.form(abschnitt(sc, 1.1, 0, 0.24, 4), DK, ` opacity=".7"`)}</g>` +
          mal(T, "s", 0.5, T.form(abschnitt(sc.map((p) => [p[0] + 0.7, p[1] + 0.5]), 1.2, 0, 1, 12), "#20160e", ` opacity=".4"`) + T.form(abschnitt(sc.map((p) => [p[0] - 0.6, p[1] - 0.5]), 0.8, 0, 1, 12), "#f4ead4", ` opacity=".35"`)) +
          fell(T, schw, 70, sflow, 0.7, EIMER, (x, y, z) => stufe(0.45, z, 5)),
        nach: randhaare(T, schw, { n: 80, L: 0.55, flow: sflow, ab: 0.55, eimer: EIMER, wahl: (x, y, z) => stufe(0.4, z, 5) }),
      });
      /* Leib mit nahen Beinen */
      const leib = [[-19.8, -23.2], [-16.6, -25.2], [-12, -25.6], [-5, -24.4], [1, -23.4], [6, -23.7], [8.2, -24.3], [11.4, -24.8], [14.8, -26.4], [17.8, -28.2], [21, -24.6], [19.8, -21.8], [19, -19.6], [18.5, -17.2], [17.6, -15.2], [16.2, -13.9],
        [15.3, -12.2], [15, -7], [14.8, -3.8], [15.8, -2.4], [16.9, -1.5], [17.2, -0.6], [16.7, 0, 1], [12.4, 0, 1], [12.1, -0.8], [12.3, -2.6], [12.7, -3.6], [12.4, -7], [11.7, -11.2], [11, -12.8],
        [7, -13.6], [1, -13.6], [-4, -14], [-8.4, -12.2], [-10.4, -12], [-11.2, -12.4], [-12.2, -11], [-14.4, -9.2], [-17, -7.4], [-17.8, -6], [-17.6, -3], [-16.6, -1.9], [-15.3, -1.1], [-15.1, -0.3], [-15.6, 0, 1],
        [-19.8, 0, 1], [-20.2, -1], [-20.5, -3.6], [-21.5, -7], [-20, -9.2], [-19.8, -11.4], [-21.4, -14.4], [-22.4, -18], [-21.8, -21.6]];
      /* Tabby-Zeichnung */
      let mus = T.form([[-21, -22.6], [-15, -25], [-7, -24.2], [1, -23], [7.6, -23.4], [12.4, -25], [12.6, -24.2], [7.6, -22.6], [1, -22.2], [-7, -23.4], [-15, -24], [-20.6, -21.8]], DK, ` opacity=".85"`);
      for (let i = 0; i < 14; i++) {
        const x0 = -13.4 + i * 1.95 + (T.rnd() - 0.5) * 0.5;
        const ende = x0 > 9 ? -14.6 : x0 < -11 ? -14 : -14.4;
        const kr = x0 > 9 ? 0.9 : x0 < -12 ? -1.4 : -0.5;
        const w1 = (T.rnd() - 0.5) * 0.7, w2 = (T.rnd() - 0.5) * 0.7;
        const mitte = [[x0, -23.6], [x0 + w1, -21.2], [x0 - 0.3 + kr * 0.4 - w1, -18.8], [x0 - 0.5 + kr * 0.8 + w2, -16.6], [x0 - 0.8 + kr * 1.2, ende]];
        const brw = [0.55, 0.5 + T.rnd() * 0.15, 0.48, 0.42, 0.28];
        const teile = i % 3 === 0 ? [[0, 0.78], [0.86, 1]] : i % 3 === 1 ? [[0, 0.5], [0.58, 0.74], [0.84, 0.96]] : [[0, 0.64], [0.72, 0.86]];
        for (const [a, b] of teile) mus += streif(T, mitte, brw, DK, 0.62, a, b);
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
            fleck(T, 11.4, -13, 1.4, 2.4, "#2a1e12", 0.4) + fleck(T, -10.8, -12.6, 1.6, 2, "#2a1e12", 0.4) + T.form([[17.6, -15.4], [16.2, -13.8], [15.2, -12], [14.6, -12.6], [15.6, -14.4], [16.8, -15.8]], "#2a1e12", ` opacity=".35"`) +
            fleck(T, -13, -10.4, 1.6, 1.4, "#fff4dc", 0.3) + T.form([[-12.2, -11], [-14.4, -9.2], [-17, -7.4], [-17.6, -6.2], [-18.4, -7.4], [-16, -9.6], [-13.4, -11.8]], "#2a1e12", ` opacity=".3"`) + fleck(T, -19.2, -10, 0.8, 1.8, "#2a1e12", 0.35) + T.form([[-20.4, -11.4], [-20.6, -9], [-21.2, -7.2], [-20.2, -7.4], [-19.8, -9.2], [-19.6, -11.2]], "#fff4dc", ` opacity=".3"`) +
            T.form([[19.8, -21.4], [18.4, -18.2], [17.4, -15.6], [16.2, -13.6], [15.4, -15.4], [16.8, -18.4], [18, -21.2]], "#2a1e12", ` opacity=".25"`) +
            T.form([[15.2, -10], [14.8, -6.5], [14.6, -3.6], [13.8, -3.6], [14, -6.5], [14.4, -10]], "#2a1e12", ` opacity=".25"`) +
            T.form([[-15, -25], [-6, -24.2], [4, -23], [10, -24], [4, -21.8], [-6, -22.4], [-15, -22.8]], "#fff4dc", ` opacity=".32"`) + T.form([[-19, -12], [-8, -12.4], [4, -13.4], [16, -15], [16, -18], [4, -17], [-8, -16.4], [-19, -16]], "#2a1e12", ` opacity=".12"`) +
            fleck(T, -15.6, -18.6, 4, 3.2, "#fff4dc", 0.2) + fleck(T, 12, -19.6, 2.2, 3.2, "#fff4dc", 0.18) +
            T.form([[12.4, -10], [12.6, -4], [13.2, -4], [13.1, -10]], "#fff4dc", ` opacity=".25"`)) +
          fell(T, leib, 420, flow, 0.95, EIMER, (x, y, z) => stufe(licht(x, y), z, 5), { lf: (x, y) => (y > -11 ? 0.55 : 1) }) +
          (T.fein ? T.form([[12.4, -0.05], [12.6, -0.6], [13.8, -0.7], [14.3, -0.05]], "#4a2c22", ` opacity=".7"`) + T.form([[-19.6, -0.05], [-19.3, -0.6], [-18.1, -0.7], [-17.6, -0.05]], "#4a2c22", ` opacity=".7"`) +
            falte(T, [[15.6, -1.9], [15.9, -0.4]], DK, 0.14, 0.5) + falte(T, [[14.6, -2.2], [14.7, -0.3]], DK, 0.14, 0.5) + falte(T, [[-16.2, -1.8], [-15.9, -0.4]], DK, 0.14, 0.5) + falte(T, [[-17.2, -2], [-17, -0.3]], DK, 0.14, 0.5) : ""),
        nach: randhaare(T, leib, { n: 200, L: 0.65, flow, ab: 0.5, eimer: EIMER, wahl: (x, y, z) => stufe(licht(x, y), z, 5), wo: (x, y) => y < -1.5 }),
      });
      s += "</g>";
      /* Kopf */
      const kopf = [[17.2, -27], [18.8, -29.2], [21.2, -30.2], [23.8, -29.8], [25.4, -28.6], [26.4, -27.1], [27.5, -25.8], [28.1, -24.9], [27.8, -24.2], [27.5, -23.6], [27.6, -23],
        [27.1, -22.2], [25.8, -21.6], [24, -21.4], [21.8, -21.6], [19.8, -22.4], [18, -24.4]];
      const kflow = (x, y) => (x > 24.6 && y > -25.6 ? 165 : y > -24.2 ? 140 : 188);
      const klicht = (x, y) => 0.42 + 0.5 * Math.max(0, Math.min(1, (-y - 21.4) / 8)) - huegel(x, y, [[22, -22, 3, 1.2, 0.3], [25, -25.4, 1.4, 0.8, 0.2]]) + huegel(x, y, [[26.8, -23.2, 1, 1, 0.3]]);
      let km = "";
      /* „M“ auf der Stirn (von der Seite: Bogenlinien), Scheitellinien, Linien vom Augenwinkel über die Wange */
      km += falte(T, [[24.6, -29.2], [24.1, -28.4], [23.8, -27.7]], DK, 0.28, 0.85) + falte(T, [[23.6, -29.9], [23.2, -28.9], [23.2, -28]], DK, 0.26, 0.85) + falte(T, [[25.4, -28.4], [24.9, -27.8]], DK, 0.24, 0.8);
      km += falte(T, [[22.4, -30.1], [20.6, -29.8], [18.8, -29], [17.4, -27.8]], DK, 0.3, 0.8) + falte(T, [[22.8, -29.3], [21, -28.8], [19.2, -27.6]], DK, 0.26, 0.7);
      km += falte(T, [[23.6, -26.3], [22.4, -25.8], [21, -25.6], [19.8, -24.6]], DK, 0.3, 0.85) + falte(T, [[24.1, -24.6], [22.9, -24.2], [21.7, -23.6], [20.5, -22.8]], DK, 0.26, 0.75);
      s += teil(T, kopf, T.lg("kopfk", [[0, "#9a7f5a"], [0.5, "#b29a74"], [1, "#d5c4a2"]]), { rand: false,
        innen: tex(T, "kk", { fx: 4.6, fy: 0.8, farbe: DK, staerke: 2, schwelle: 0.6, okt: 2 }, 185, 0.2, [16, -31, 28.2, -21]) +
          `<g${zottel(T, "c", "2.4 1", 0.2)}>${km}</g>` +
          mal(T, "kk", 0.35, T.form([[25.6, -23.5], [27.5, -23.7], [27.4, -22.5], [26.6, -21.8], [24.8, -21.5], [23, -21.7], [23.8, -22.9]], "#efe6d2", ` opacity=".85"`) +
            fleck(T, 24.8, -26.7, 1.4, 1.1, "#f2e8d2", 0.75) + fleck(T, 22, -22.4, 2.6, 1, "#2a1e12", 0.25) + fleck(T, 22, -29.4, 3, 1, "#fff4dc", 0.25)) +
          fell(T, kopf, 220, kflow, 0.42, EIMER, (x, y, z) => stufe(klicht(x, y), z, 5)) +
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
      s += teil(T, [[22.4, -30.4], [23.2, -33.1], [23.5, -33.15], [24.6, -30]], "#5c4a34", { rand: false, vol: false });
      const ohr = [[19.2, -29.2], [20.4, -32.2], [21.5, -34.5, 1], [22.6, -32.6], [23.6, -30.8], [24.3, -29.6]];
      s += teil(T, ohr, T.lg("ohrk", [[0, "#6a5438"], [1, "#a68b62"]]), { rand: DK, randA: 0.22,
        innen: T.form([[21.6, -34], [22.6, -32.6], [23.6, -30.8], [24.2, -29.7], [23.2, -30.2], [22.2, -32.2]], "#c08f82", ` opacity=".75"`) +
          T.schnurrhaare(23.2, -30.4, 7, 1.6, -70, 50, "#efe6d6", 0.04) +
          fell(T, ohr, 50, () => 100, 0.3, EIMER, (x, y, z) => stufe(0.35, z, 5)) });
      /* Tasthaare: weiß, lang; Überaugen-Tasthaare */
      s += T.schnurrhaare(26.4, -23.1, 7, 6.6, 12, 46, "#f6f2ea", 0.055) + T.schnurrhaare(26, -22.9, 5, 5.4, 168, 36, "#f6f2ea", 0.045);
      s += T.schnurrhaare(24.8, -27.9, 3, 2.4, -75, 30, "#f6f2ea", 0.04);
      return { svg: s, box: [-32.4, -34.5, 28.3, 0] };
    } },
];
