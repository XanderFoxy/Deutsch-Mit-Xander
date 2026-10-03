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
  const ziel = Math.round(n * (T.fein ? 1 : 0.25)), dez = o.dez || 2;
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
  const ziel = Math.round(o.n * (T.fein ? 1 : 0.3)), dez = o.dez || 2;
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
    laenge: 1.07, hoehe: 0.73,
    zeichne(T) {
      T.RW = 0.3;
      const D = "#9c6f37", DD = "#5e3f1c";
      const EIMER = [["#6e4a22", 0.11, 0.5], ["#9a6c36", 0.1, 0.45], ["#c08e4f", 0.09, 0.42], ["#ddb577", 0.09, 0.5], ["#f4dcae", 0.08, 0.55]];
      const fell1 = T.lg("fell", [[0, "#ebcb93"], [0.42, "#d9ae69"], [0.75, "#c79a58"], [1, "#a97d43"]]);
      const fellF = T.lg("fellf", [[0, "#c29454"], [1, "#94693a"]]);
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
      const zehen = (x, w) => {
        /* drei gewölbte Zehen von der Seite, darunter Krallen */
        let t = "";
        for (let i = 0; i < 3; i++) {
          const zx = x + 2.2 + i * 2.6;
          t += fleck(T, zx, -1.9, 1.5, 1.5, "hell", 0.2) + falte(T, [[zx + 1.25, -3.1], [zx + 1.35, -0.6]], DD, 0.4, 0.45);
        }
        return t + `<path d="M${zahl(x + 0.6, 1)} -.9h${zahl(w, 1)}" stroke="#000" stroke-opacity=".25" stroke-width=".8"/>`;
      };
      const kr = (x) => kralle(T, x + 3.4, -0.8, 1.2, 40) + kralle(T, x + 6, -0.9, 1.3, 32) + kralle(T, x + 8.6, -1.2, 1.25, 28);
      let s = "";
      /* ferne Beine (dunkler, versetzt) */
      const fernH = [[-5, -38], [-7, -31.5], [-10.5, -24], [-14.5, -16], [-16, -10.5], [-16, -5.5], [-13.4, -2.6], [-10.8, -1.4], [-10.9, 0, 1], [-19.4, 0, 1], [-20.4, -2.4], [-20.8, -7], [-22.4, -12.6], [-21.6, -16], [-19.8, -21], [-22, -36]];
      const fernV = [[11, -40], [19.5, -38], [18.6, -24], [18, -14], [17.6, -7.5], [19.4, -3.6], [21.6, -1.8], [21.4, 0, 1], [12, 0, 1], [11.2, -2.2], [11.5, -7], [11.2, -14], [10.4, -25]];
      for (const P of [fernH, fernV]) {
        s += teil(T, P, fellF, { rand: DD, randA: 0.25,
          innen: fell(T, P, 160, () => 92, 1.4, EIMER, (x, y, z) => stufe(licht(x, y) - 0.25, z, 5), { dez: 1 }) });
      }
      s += kr(-19.6) + kr(11.4);
      /* Rute: Fortsetzung der Kruppe, dick und rund */
      const rc = [[-23, -51.4], [-30, -51.2], [-35.5, -48], [-39, -42.5], [-40.8, -35.5], [-41.2, -28]];
      const rute = schlauch(rc, [8, 7.2, 6, 4.6, 3.2, 1.4]);
      const rflow = (x, y) => (y < -47 ? 175 : y < -40 ? 120 : 98);
      s += teil(T, rute, T.lg("rute", [[0, "#e2bb7b"], [1, "#a47840"]], 0, 0, 1, 0.3), {
        innen: tex(T, "h", { fx: 1.4, fy: 0.22, farbe: DD, staerke: 2.4, schwelle: 0.55, okt: 2 }, 100, 0.35, [-46, -56, -20, -26]) +
          fell(T, rute, 220, rflow, 1.6, EIMER, (x, y, z) => stufe(0.85 - (x + 40) / -12 - (-y - 30) / 60 + (x < -38 ? -0.3 : 0.1), z, 5), { dez: 1 }),
        nach: randhaare(T, rute, { n: 60, L: 1.1, flow: rflow, eimer: EIMER, wahl: (x, y, z) => stufe(0.5, z, 5), dez: 1 }),
      });
      /* Körper mit nahen Beinen als EIN Umriss */
      const leib = [[-27, -53], [-20, -55.6], [-8, -55], [5, -56], [15, -58.6], [24, -63], [31, -68], [40, -64], [40.5, -55.5], [37.6, -50.5], [35.6, -45], [34.4, -40.5], [31.4, -36],
        [27.2, -31], [25.2, -24], [24.5, -14], [24.1, -7.6], [25.8, -3.7], [28.1, -1.8], [27.9, 0, 1], [18.4, 0, 1], [17.6, -2.2], [17.9, -7], [17.6, -14], [16.8, -25], [15.4, -29.2],
        [9, -29.4], [0, -30.8], [-7, -34.5], [-11, -36.5], [-13, -31.5], [-16.5, -24], [-20.5, -16], [-22, -10.5], [-22, -5.5], [-19.4, -2.6], [-16.8, -1.4], [-16.9, 0, 1],
        [-25.4, 0, 1], [-26.4, -2.4], [-26.8, -7], [-28.4, -12.6], [-27.6, -16], [-25.8, -21], [-28.4, -29], [-31.6, -38], [-31.4, -47]];
      s += teil(T, leib, fell1, {
        rand: DD, randA: 0.22,
        innen:
          /* Form: Schulterblatt, Oberarm, Keule, Knie hell; Bauch, Achsel, Kniekehle dunkel */
          fleck(T, 21, -50, 7, 11, "hell", 0.34, -28) + fleck(T, -19, -43, 11, 9, "hell", 0.36, 20) + fleck(T, 28, -58, 5, 9, "hell", 0.2, 35) +
          fleck(T, 22.5, -18, 2.2, 8, "hell", 0.2) + fleck(T, -14.5, -28, 2.4, 3, "hell", 0.3) + fleck(T, -2, -54, 22, 2.6, "hell", 0.3, -3) +
          fleck(T, 4, -32, 16, 5, "dunkel", 0.2) + fleck(T, 14.5, -33, 3, 6, "dunkel", 0.2) + fleck(T, -10, -38, 4, 6, "dunkel", 0.16) + fleck(T, -23.5, -18, 2.4, 6, "dunkel", 0.18, 20) +
          fleck(T, 0, -6, 40, 9, "dunkel", 0.22) +
          tex(T, "l", { fx: 1.6, fy: 0.25, farbe: DD, staerke: 2.4, schwelle: 0.56, okt: 2 }, 160, 0.4, [-32, -69, 41, 0]) +
          /* Muskeln, Sehnen, Gelenke */
          falte(T, [[13.5, -50], [12.6, -42], [14, -34]], DD, 1.2, 0.16) +
          falte(T, [[34, -41], [30, -35.5], [27, -29]], DD, 1, 0.22) +
          falte(T, [[-9, -36], [-10, -41], [-9.2, -48]], DD, 1, 0.14) +
          falte(T, [[-12.4, -32], [-17.5, -35], [-21, -42]], DD, 0.9, 0.12) +
          falte(T, [[-27.2, -13.4], [-26, -18], [-25.2, -22]], DD, 0.5, 0.35) + falte(T, [[-26.6, -14.2], [-25.4, -18.5]], "#fff2d6", 0.4, 0.3) +
          falte(T, [[24, -10.6], [21, -9.8], [18.2, -10.6]], DD, 0.55, 0.25) +
          falte(T, [[31, -52], [35, -55], [39.5, -57]], DD, 0.8, 0.12) +
          /* Haar für Haar */
          fell(T, leib, 1500, flow, 1.9, EIMER, wahlL, { dez: 1, lf: (x, y) => (y > -28 ? 0.6 : 1) }) +
          /* Pfoten */
          zehen(18.4, 9) + zehen(-25.4, 8.4) +
          `<path d="M17.7 -7.4q-.9 1.4 -.2 2.6" fill="#7a5a3c" stroke="${DD}" stroke-width=".3" stroke-opacity=".5"/>`,
        nach: randhaare(T, leib, { n: 520, L: 1.2, flow, ab: 0.4, eimer: EIMER, wahl: (x, y, z) => stufe(licht(x, y) + 0.05, z, 5), dez: 1, wo: (x, y) => y < -2 }),
      });
      s += kr(-25.6) + kr(18.4);
      /* Kopf */
      const kopf = [[36.5, -67.5], [39.5, -71.6], [44.5, -73], [49, -71.8], [51.8, -69.6], [53.6, -67.5], [57.5, -66.4], [61.4, -65.6], [63.6, -64.2], [64.6, -62], [64.1, -60], [62.8, -59.3],
        [62.6, -57.3], [61.2, -55.7], [58, -55], [55.4, -55.3], [53.6, -55.8], [52.8, -54.4], [48, -53.6], [42.5, -54.4], [37.5, -58.5]];
      const kflow = (x, y) => (x > 53 ? 186 : y > -60 ? 150 : 190);
      const klicht = (x, y) => 0.5 + 0.5 * Math.max(0, Math.min(1, (-y - 56) / 16)) + huegel(x, y, [[45, -70, 5, 3, 0.25], [58, -64, 4, 1.6, 0.2]]) - huegel(x, y, [[50, -64.5, 3, 1.6, 0.35], [47, -56.5, 6, 2.5, 0.3], [54, -59, 2.5, 2, 0.15]]);
      s += teil(T, kopf, T.lg("kopf", [[0, "#efcf97"], [0.6, "#d9ae68"], [1, "#b0844a"]]), {
        rand: DD, randA: 0.25,
        innen: fleck(T, 45, -69, 7, 4, "hell", 0.4) + fleck(T, 58.5, -63.4, 5, 2.4, "hell", 0.3) +
          fleck(T, 50, -64.5, 3, 1.8, "dunkel", 0.2) + fleck(T, 47, -56.5, 7, 3, "dunkel", 0.22) + fleck(T, 54.5, -60.5, 3, 2.5, "dunkel", 0.12) +
          tex(T, "k", { fx: 2.4, fy: 0.5, farbe: DD, staerke: 2.2, schwelle: 0.56, okt: 2 }, 180, 0.3, [36, -74, 65, -53]) +
          fell(T, kopf, 520, kflow, 0.75, EIMER, (x, y, z) => stufe(klicht(x, y), z, 5)) +
          /* Lefze: Oberlippe hängt über den Unterkiefer, schwarzer Lefzenrand */
          T.form([[62.6, -59.1], [58.5, -58.1], [54.4, -57.8], [53.8, -56.4], [55.4, -55.4], [58.8, -55.1], [62.2, -57]], "#b98a51", ` opacity=".55"`) +
          `<path d="M62.7 -59.2C59.6 -58.2 56.4 -57.7 53.6 -57.9" fill="none" stroke="#1d130b" stroke-width=".55" stroke-linecap="round"/>` +
          `<path d="M53.7 -57.8q-.6 .9 .2 1.7" fill="none" stroke="#1d130b" stroke-width=".4" stroke-linecap="round" opacity=".7"/>` +
          /* Tasthaar-Poren in Reihen */
          `<path d="M56.8 -61.4h.01M58.3 -61.7h.01M59.8 -61.9h.01M61 -62h.01M57.4 -60.3h.01M58.9 -60.5h.01M60.4 -60.6h.01" stroke="#5a3e20" stroke-width=".42" stroke-linecap="round"/>` +
          falte(T, [[49.4, -70.6], [52.2, -68.8]], DD, 0.5, 0.3) + falte(T, [[53.6, -67.2], [56, -64.8], [57, -62.4]], DD, 0.6, 0.1),
        nach: randhaare(T, kopf, { n: 160, L: 0.6, flow: kflow, ab: 0.35, eimer: EIMER, wahl: (x, y, z) => stufe(klicht(x, y), z, 5), wo: (x, y) => x < 60 }),
      });
      /* Auge mit Brauenbogen und Überaugen-Tasthaaren */
      s += fleck(T, 50.6, -69.8, 2.8, 1.2, "hell", 0.45) + fleck(T, 50.8, -67.2, 2.4, 1.6, "dunkel", 0.25);
      s += T.augeReal(50.8, -67.4, 0.92, { iris: "#7a4718", iris2: "#2e1806", offen: 0.66, winkel: 6, lid: "#1a0f08" });
      s += T.schnurrhaare(51.2, -69.6, 3, 2.6, -60, 40, "#4a3420", 0.07);
      /* Nase: feucht, Nasenlöcher, Pflastertextur */
      const nase = [[60.6, -65.1], [63.4, -64.6], [64.75, -62.6], [64.2, -60.2], [62.2, -59.9], [60.9, -61.4]];
      s += teil(T, nase, T.lg("nase", [[0, "#55443a"], [0.5, "#241a15"], [1, "#0b0807"]]), { vol: false, rand: false,
        innen: (T.fein ? `<rect x="60" y="-66" width="5" height="7" fill="#3a2e28" filter="${T.relief("nase", { f: 2.4, tiefe: 0.9, okt: 2 })}" opacity=".55"/>` : "") +
          `<path d="M64.6 -61.6q-.7 .5 -1.6 -.2q-.5 -.5 -.1 -1" fill="#050302"/>` +
          `<path d="M62.4 -60.1q.2 -.9 .9 -1.3" fill="none" stroke="#000" stroke-width=".25" opacity=".6"/>` +
          `<ellipse cx="62.3" cy="-64.2" rx="1.2" ry=".34" fill="#fff" opacity=".42" transform="rotate(8 62.3 -64.2)"/><ellipse cx="64.3" cy="-63.1" rx=".24" ry=".5" fill="#fff" opacity=".3"/>` });
      /* Tasthaare */
      s += T.schnurrhaare(58.6, -61, 7, 6.5, 172, 34, "#5b4127", 0.07);
      /* Hängeohr */
      const ohr = [[40.6, -71.6], [45.6, -71.8], [47.8, -69], [47.6, -64], [46.4, -59.6], [44.8, -57.8], [43, -58.6], [41.2, -62.4], [40, -67]];
      s += fleck(T, 48.8, -63, 2.2, 5.4, "dunkel", 0.28, -10);
      const oflow = (x, y) => 98;
      s += teil(T, ohr, T.lg("ohr", [[0, "#d7a965"], [0.5, "#b88a4c"], [1, "#8c622d"]], 0, 0, 0.4, 1), {
        rand: DD, randA: 0.3,
        innen: fleck(T, 42.6, -65, 2.4, 5, "hell", 0.25) + falte(T, [[41, -70.6], [44.4, -70.2], [47.2, -68.4]], DD, 0.7, 0.3) +
          falte(T, [[46.8, -68.6], [46.6, -63.4], [45.2, -59]], DD, 0.9, 0.2) +
          fell(T, ohr, 200, oflow, 0.7, EIMER, (x, y, z) => stufe(0.75 - (-y - 58) / -20 - (x - 41) / 14, z, 5)),
        nach: randhaare(T, ohr, { n: 60, L: 0.55, flow: oflow, ab: 0.5, eimer: EIMER, wahl: (x, y, z) => stufe(0.4, z, 5), wo: (x, y) => y > -69 }),
      });
      return { svg: s, box: [-42.6, -73.1, 64.8, 0] };
    } },
];
