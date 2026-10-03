/* =====================================================================
   TIER-BIBLIOTHEK — PFLANZENFRESSENDE DINOSAURIER (FASSUNG 854)
   ---------------------------------------------------------------------
   XANDER (Auftrag vom 03.10., Antwort Funk 290): „Ich möchte perfekte
   Dinosaurier unmissverständlich auf höchstem Niveau wie in Jurassic Park".
   Arten: Triceratops, Brachiosaurus, Diplodocus, Stegosaurus, Ankylosaurus,
   Parasaurolophus. Gruppe „Dinosaurier", Lebensraum „Urzeit".

   Zeichnen in DEZIMETERN (eine <g transform="scale(10)"> macht daraus
   Zentimeter, wie kern.js es will) – so bleiben die Pfade kurz.
   Blick nach rechts, Boden y = 0, Licht von links oben.
   ===================================================================== */
"use strict";

const r = (n) => Math.round(n * 10) / 10;
const DM = (svg, k = 10) => `<g transform="scale(${k})">${svg}</g>`;

/* Punkte um (cx, cy) drehen (Grad) und verschieben – für Beine im Schritt */
function dreh(pts, cx, cy, grad, dx = 0, dy = 0) {
  const a = grad * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  return pts.map((p) => {
    const x = p[0] - cx, y = p[1] - cy;
    const q = [cx + x * c - y * s + dx, cy + x * s + y * c + dy];
    if (p[2]) q.push(1);
    return q;
  });
}
/* Fußpunkte nach dem Drehen wieder genau auf den Boden setzen */
function boden(pts) {
  const m = Math.max(...pts.map((p) => p[1]));
  return pts.map((p) => { const q = [p[0], p[1] - m]; if (p[2]) q.push(1); return q; });
}

/* Körperteil, sparsam: Pfad EINMAL in den defs, dann <use> für Füllung, Clip und Rand.
   o: { muster, innen, vol, volx, rand, randA, rw } – muster/vol/volx als Rechteck über der Box (geklippt). */
/* Flecken / Höcker, EIN Pfad */
function tupfen(T, n, x0, y0, x1, y1, s, farbe, op) {
  let d = "";
  for (let i = 0; i < n; i++) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0), k = s * (0.5 + T.rnd());
    d += `M${r(x - k)} ${r(y)}a${r(k)} ${r(k * 0.8)} 0 1 0 ${r(2 * k)} 0a${r(k)} ${r(k * 0.8)} 0 1 0 ${r(-2 * k)} 0`;
  }
  return `<path d="${d}" fill="${farbe}" opacity="${op}"/>`;
}
/* Hautfalten / Muskelkanten: mehrere offene Kurven in EINEM Pfad */
function falten(T, listen, farbe, w, op) {
  if (!T.fein && w < 0.2) return "";   // feine Falten nur bei voller Feinheit
  return `<path d="${listen.map((p) => T.glatt(p, false, 1)).join("")}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round"/>`;
}
/* Hufkrallen: gerundete Hornkappen vorn an den Zehen [x, y, Breite, Höhe] – heller Horn, dunkle Kante, Glanzpunkt */
function naegel(liste, farbe) {
  const d = liste.map(([x, y, b, h]) => `M${r(x)} ${r(y)}h${r(b)}c${r(b * 0.12)} ${r(-h * 0.5)} ${r(-b * 0.1)} ${r(-h)} ${r(-b * 0.45)} ${r(-h)}s${r(-b * 0.55)} ${r(h * 0.4)} ${r(-b * 0.55)} ${r(h)}z`).join("");
  const g = liste.map(([x, y, b, h]) => `M${r(x + b * 0.35)} ${r(y - h * 0.75)}q${r(b * 0.2)} ${r(-h * 0.1)} ${r(b * 0.35)} ${r(h * 0.15)}`).join("");
  return `<path d="${d}" fill="${farbe}" stroke="#1a140c" stroke-width=".1" stroke-opacity=".6"/><path d="${g}" fill="none" stroke="#fff" stroke-width=".1" stroke-opacity=".5" stroke-linecap="round"/>`;
}
/* weiche Farb-/Licht-/Schattenzone: bei voller Feinheit mit Weichzeichner (keine harten Kanten), in Szenen ohne */
function weichFilter(T) {
  const sd = T._weich || 0.7, id = T.id("weich" + Math.round(sd * 10));
  if (!T["_wf" + sd]) {
    T["_wf" + sd] = 1;
    T.def(`<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${sd}"/></filter>`);
  }
  return `url(#${id})`;
}
const fl = (T, pts, farbe, op) => T.form(pts, farbe, ` opacity="${op}"` + (T.fein && op < 1 ? ` filter="${weichFilter(T)}"` : ""));
/* weiches Licht / weicher Schatten als Ellipse mit Radialverlauf (Muskelpakete, Kernschatten) */
function licht(T, cx, cy, rx, ry, rot, op, dunkel) {
  const f = dunkel ? T.rg("dunkel", [[0, "#000", 0.6], [0.6, "#000", 0.25], [1, "#000", 0]]) : T.rg("licht", [[0, "#fff", 0.5], [0.6, "#fff", 0.2], [1, "#fff", 0]]);
  return `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(rx)}" ry="${r(ry)}"${rot ? ` transform="rotate(${rot} ${r(cx)} ${r(cy)})"` : ""} fill="${f}" opacity="${op}"/>`;
}
const schatten = (T, cx, cy, rx, ry, rot, op) => licht(T, cx, cy, rx, ry, rot, op, true);
/* y einer Polylinie an der Stelle x (x aufsteigend) */
function yBei(pl, x) {
  if (x <= pl[0][0]) return pl[0][1];
  for (let i = 1; i < pl.length; i++) if (x <= pl[i][0]) { const [ax, ay] = pl[i - 1], [bx, by] = pl[i]; return ay + (by - ay) * (x - ax) / (bx - ax); }
  return pl[pl.length - 1][1];
}
/* Schuppenreihen, die der Körperrundung folgen: zwischen Leitlinie oben und unten (Polylinien, x aufsteigend),
   n Reihen; am Rand (oben/unten) verkürzt wie auf einem Zylinder. groesse(x, t) → Schuppenradius.
   Je Schuppe ein Schattenbogen unten und (im Licht, obere Körperhälfte) ein Lichtbogen oben links. Nur bei T.fein. */
function schuppenFeld(T, oben, unten, x0, x1, n, groesse, o = {}) {
  if (!T.fein) return "";
  let dd = "", hh = "", px = null, py = null, qx = null, qy = null;
  for (let i = 0; i < n; i++) {
    const t = (1 - Math.cos(Math.PI * (i + 0.5) / n)) / 2, sk = 0.35 + 0.65 * Math.sin(Math.PI * (i + 0.5) / n);
    let x = x0 + (i % 2) * groesse(x0, t) * 0.9 + T.rnd() * 0.5;
    while (x < x1) {
      const ya = yBei(oben, x), yb = yBei(unten, x), k = groesse(x, t) * (0.75 + T.rnd() * 0.5);
      const y = ya + (yb - ya) * t + (T.rnd() - 0.5) * Math.abs(yb - ya) / n * 0.8;
      const ky = k * 0.8 * sk;
      /* relative Züge (m/a) halten den Pfad kurz */
      const ax = r(x - k), ay = r(y);
      dd += px === null ? `M${ax} ${ay}` : `m${r(ax - px)} ${r(ay - py)}`;
      dd += `a${r(k)} ${r(ky) || 0.1} 0 0 0 ${r(2 * k)} 0`; px = ax + r(2 * k); py = ay;
      const bx = r(x - k * 0.75), by = r(y - ky * 0.1);
      if (t < (o.lichtBis || 0.6)) {
        hh += (qx === null ? `M${bx} ${by}` : `m${r(bx - qx)} ${r(by - qy)}`) + `a${r(k * 0.8)} ${r(ky * 0.7) || 0.1} 0 0 1 ${r(k * 0.8)} ${r(-ky * 0.52)}`;
        qx = bx + r(k * 0.8); qy = by + r(-ky * 0.52);
      }
      x += k * (1.9 + T.rnd() * 0.4);
    }
  }
  return `<path d="${dd}" fill="none" stroke="${o.dunkel || "#140f08"}" stroke-width="${o.w || 0.12}" stroke-opacity="${o.opD || 0.45}"/>` +
    `<path d="${hh}" fill="none" stroke="${o.hell || "#e8dcc0"}" stroke-width="${(o.w || 0.12) * 0.8}" stroke-opacity="${o.opH || 0.3}" stroke-linecap="round"/>`;
}
/* große Höckerschuppen (Rosetten): Kuppel mit Licht oben links und Schatten unten rechts. Nur bei T.fein. */
function hoecker(T, liste, farbe, o = {}) {
  if (!T.fein) return "";
  let f = "", d = "", h = "";
  for (const [x, y, k] of liste) {
    f += `M${r(x - k)} ${r(y)}a${r(k)} ${r(k * 0.85)} 0 1 0 ${r(2 * k)} 0a${r(k)} ${r(k * 0.85)} 0 1 0 ${r(-2 * k)} 0`;
    d += `M${r(x - k)} ${r(y)}a${r(k)} ${r(k * 0.85)} 0 0 0 ${r(2 * k)} 0`;
    h += `M${r(x - k * 0.55)} ${r(y - k * 0.3)}a${r(k * 0.5)} ${r(k * 0.4)} 0 0 1 ${r(k * 0.8)} ${r(-k * 0.2)}`;
  }
  return `<path d="${f}" fill="${farbe}" opacity="${o.op || 0.5}"/><path d="${d}" fill="none" stroke="#000" stroke-width="${o.w || 0.12}" stroke-opacity=".35"/>` +
    `<path d="${h}" fill="none" stroke="#fff" stroke-width="${o.w || 0.12}" stroke-opacity=".4" stroke-linecap="round"/>`;
}
/* Punkte zufällig in einem Polygon (für Höcker-Rosetten) */
function streu(T, poly, n, k0, k1) {
  const [x0, y0, x1, y1] = T.box(poly), out = [];
  let v = 0;
  while (out.length < n && v++ < n * 20) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (T.inPoly(x, y, poly)) out.push([x, y, k0 + T.rnd() * (k1 - k0)]);
  }
  return out;
}
/* Bein auf der Schattenseite: dunkler, aber modelliert (Muskel-Licht, Kernschatten hinten, Reflexlicht vorn,
   Knie-/Ellbogenlicht, Hautringe am Fußgelenk) – aus der Box der Beinpunkte berechnet. */
function fernBein(T, pts, fill, o = {}) {
  const [x0, y0, x1, y1] = T.box(pts), w = x1 - x0, hh = y1 - y0, k = o.staerke || 1;
  const ringe = [0.07, 0.13, 0.2].map((f) => [[x0 + 0.22 * w, y1 - f * hh], [x0 + 0.48 * w, y1 - f * hh + 0.02 * hh], [x0 + 0.76 * w, y1 - f * hh]]);
  return teil(T, pts, fill, {
    vol: false, randAb: o.randAb != null ? o.randAb : 0.45, randA: 0.3,
    innen: licht(T, x0 + 0.55 * w, y0 + 0.32 * hh, 0.32 * w, 0.2 * hh, -8, 0.32 * k) + licht(T, x0 + 0.68 * w, y0 + 0.56 * hh, 0.12 * w, 0.06 * hh, 0, 0.28 * k) +
      schatten(T, x0 + 0.16 * w, y0 + 0.62 * hh, 0.14 * w, 0.3 * hh, -6, 0.45) + licht(T, x1 - 0.1 * w, y0 + 0.78 * hh, 0.07 * w, 0.16 * hh, 0, 0.22 * k) +
      schatten(T, x0 + 0.5 * w, y1 - 0.02 * hh, 0.45 * w, 0.05 * hh, 0, 0.35) +
      falten(T, ringe, "#0c0905", Math.max(0.12, w * 0.012), 0.45) +
      (o.schuppen ? schuppenFeld(T, [[x0, y0 + 0.4 * hh], [x1, y0 + 0.4 * hh]], [[x0, y1 - 0.04 * hh], [x1, y1 - 0.04 * hh]], x0, x1, o.schuppen[0], () => o.schuppen[1], { opD: 0.35, opH: 0.12 }) : ""),
  });
}

function teil(T, pts, fill, o = {}) {
  const d = typeof pts === "string" ? pts : T.glatt(pts);
  const [x0, y0, x1, y1] = o.box || T.box(pts);
  const re = (f, ex = "") => `<rect x="${r(x0 - 0.5)}" y="${r(y0 - 0.5)}" width="${r(x1 - x0 + 1)}" height="${r(y1 - y0 + 1)}" fill="${f}"${ex}/>`;
  const innen = (o.muster ? re(o.muster) : "") + (o.innen || "") + (o.vol !== false ? re(T.VOL()) : "") + (o.volx ? re(T.VOLX()) : "");
  /* randAb: Rand erst ab diesem Anteil der Höhe (Beine: oben im Rumpf kein Rand) */
  const rs = o.randAb != null ? T.lg("ra" + Math.round(o.randAb * 100), [[0, "#000", 0], [o.randAb, "#000", 0], [Math.min(1, o.randAb + 0.12), "#000", 1], [1, "#000", 1]]) : (o.rand || "#000");
  const mitRand = o.rand !== false && (T.fein || o.randSzene);
  const strich = mitRand ? ` stroke="${rs}" stroke-opacity="${o.randA != null ? o.randA : 0.35}" stroke-width="${o.rw || 0.1}" stroke-linejoin="round"` : "";
  /* ohne Innenzeichnung: ein einziger Pfad (Füllung + Rand) */
  if (!innen) return `<path d="${d}" fill="${fill}"${strich}/>`;
  T._n = (T._n || 0) + 1;
  const id = T.id("t" + T._n);
  T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  return `<use href="#${id}" fill="${fill}"/><g clip-path="url(#${id}c)">${innen}</g>` + (mitRand ? `<use href="#${id}" fill="none"${strich}/>` : "");
}
/* Fläche innerhalb eines Körperteils (z. B. Schnabel): Füllung + Volumenlicht, ohne eigenen Clip */
function teilInnen(T, pts, fill) {
  return T.form(pts, fill) + T.form(pts, T.VOL());
}

/* =====================================================================
   TRICERATOPS
   RECHERCHE: Triceratops horridus/prorsus, Oberkreide (Maastricht,
   Hell-Creek-Formation), 66 Mio. Jahre. Größte Tiere 7,9–9 m lang,
   6–12 t, Hüfthöhe ~2,0 m, Rücken über der Hüfte ~2,8–3 m. Schädel bis
   2,5 m (mit Schild) – einer der größten Landtier-Schädel. Kurzer, massiver
   und GESCHLOSSENER Nackenschild (ohne Fenster, anders als Torosaurus) mit
   Randzacken (Epoccipitalia), zwei Stirnhörner bis ~1 m über den Augen,
   kurzes Nasenhorn, papageienartiger Hornschnabel (Rostrale/Prädentale),
   Wangenhorn (Jugale) unter dem Auge. Vierbeiner: Hinterbeine säulenartig,
   Vorderbeine kürzer, Ellbogen leicht nach außen; Hände mit hufartigen
   Krallen an den ersten drei Fingern, Füße mit vier Zehen. Hüfte höchster
   Punkt, Rücken fällt zur Schulter ab; Schwanz kurz-mittellang, frei
   getragen. Haut („Lane", HMNS): große polygonale Schuppen bis 10 cm mit
   spitzen Mittelhöckern in Rosetten, dazwischen kleine Schuppen.
   ===================================================================== */
function triceratops(T) {
  const F = T.fein;
  const haut = T.lg("haut", [[0, "#4c3f27"], [0.35, "#6a5838"], [0.72, "#7f6d49"], [1, "#6c5d40"]]);
  const fern = T.lg("fern", [[0, "#4a3f2c", 0], [0.3, "#4a3f2c", 0.9], [0.5, "#3e3424"], [1, "#2a2318"]]);
  const nahB = T.lg("bein", [[0, "#6a5a3c", 0], [0.3, "#6a5a3c", 0.6], [0.5, "#615237"], [0.8, "#4f4430"], [1, "#382f21"]]);
  const schild = T.lg("schild", [[0, "#ad8b5a"], [0.4, "#8a6a42"], [0.8, "#5a4229"], [1, "#46351f"]], 0, 0, 1, 1);
  const horn = T.lg("horn", [[0, "#4f4436"], [0.22, "#93866a"], [0.6, "#d3c8aa"], [0.9, "#b2a687"], [1, "#6f644f"]], 1, 1, 0, 0);
  const schnabel = T.lg("schnabel", [[0, "#6e6555"], [0.4, "#40382d"], [1, "#221d17"]], 0, 0, 0.4, 1);
  let s = "", h = "";

  /* Beine: Hüfte bei 41/-22, Schulter bei 61/-19. Hinten säulenartig (Knie vorn, kurzer Mittelfuß, vier Zehen mit
     Hufkrallen), vorn kürzer, Ellbogen nach hinten-außen, Unterarm schräg nach vorn, Hand mit drei Hufkrallen */
  const HB = [[34, -25], [33, -17], [35.2, -11.2], [37.4, -6.6], [37.6, -3.4], [36.8, -1.2], [37.4, 0, 1], [46.4, 0, 1], [46.9, -1.1],
    [44.8, -2.5], [43.2, -3.8], [42.8, -7], [44.4, -11.2], [46.6, -17], [46, -25]];
  const VB = [[56, -22], [55.4, -15], [55.8, -10.6], [57.4, -7.6], [59, -4.6], [59.2, -2.6], [58.6, -0.6], [59, 0, 1], [65.4, 0, 1],
    [65.8, -1.3], [64.2, -2.8], [63.4, -4.6], [62.8, -8.4], [63.6, -12.6], [65.4, -20], [61, -24]];
  const hbF = boden(dreh(HB, 41, -22, -11, 3.5)), vbF = boden(dreh(VB, 61, -19, 10, -2.6));
  const zehen = (x, b, n, farbe) => naegel(Array.from({ length: n }, (_, i) => [x + i * b * 1.02, 0, b, b * 0.48]), farbe);
  h += fernBein(T, hbF, fern, { randAb: 0.5 });
  h += fernBein(T, vbF, fern, { randAb: 0.5 });
  h += zehen(hbF[6][0] + 3.4, 1.9, 3, "#4d4434") + zehen(vbF[6][0] + 2.6, 1.5, 3, "#4d4434");

  /* Rumpf + Schwanz + Hals unter dem Schild: EIN Umriss; Hüfte höchster Punkt, Rücken fällt zur Schulter ab */
  const R = [[10.9, -14.6], [14.6, -17], [19, -19.8], [26, -23.5], [33, -26.8], [39, -28.6], [44, -29], [49, -28.3], [54, -26.8],
    [59, -24.8], [63.5, -23.2], [67, -21], [70, -15.6], [71.6, -10.8], [70.2, -8.4], [65.4, -8.6], [60, -8.4], [52, -7.8],
    [45, -8.6], [40, -11], [35.4, -14.6], [29, -16.8], [22, -15.9], [16.4, -14.4], [12.6, -13], [10.4, -13]];
  const oben = [[10, -14.6], [19, -19.8], [33, -26.8], [44, -29], [54, -26.8], [63.5, -23.2], [70, -18]];
  const unten = [[10, -13], [16.4, -14.4], [22, -15.9], [29, -16.8], [35.4, -14.6], [40, -11], [45, -8.6], [52, -7.8], [60, -8.4], [70, -8.6]];
  const flanke = [[38, -26], [50, -26], [62, -21], [64, -12], [52, -10], [42, -12], [34, -18]];
  h += teil(T, R, haut, {
    innen:
      /* dunkler Rückensattel mit unregelmäßigen Querbändern, heller Bauch (Gegenschattierung) */
      fl(T, [[10, -15], [20, -21.6], [36, -29.6], [50, -29], [63, -24.8], [60.5, -21.2], [55, -22.6], [52, -20.2], [47.5, -22.4], [43, -20.6],
        [38, -22.8], [33.5, -19.8], [28, -19.4], [22, -17], [15, -15.4]], "#261d10", 0.45) +
      fl(T, [[34, -11.6], [44, -7.4], [58, -7.2], [68, -8.6], [60, -11.8], [46, -11.4]], "#c4ad82", 0.32) +
      fl(T, [[30, -18], [38, -15.6], [46, -14.4], [56, -14.6], [66, -16], [72, -14], [72, -6], [30, -6]], "#120d06", 0.22) +
      falten(T, [[[14, -17.4], [24, -23.2], [34, -27.6], [44, -28.6], [54, -26.4], [62, -23.4]]], "#f0e2c0", 0.7, 0.18) +
      /* Kernschatten am Bauch und unter dem Schwanz, Reflexlicht an der Unterkante */
      fl(T, [[37, -13], [46, -11.8], [58, -12], [67, -13], [67, -10.6], [58, -9.4], [46, -9.2], [37, -11]], "#140f08", 0.25) +
      fl(T, [[10, -13.4], [16, -14.8], [23, -16.2], [30, -17], [35, -15.6], [33, -14.4], [28, -15.6], [22, -14.8], [15, -13.6], [10, -12.6]], "#140f08", 0.35) +
      falten(T, [[[40, -10], [46, -8.2], [54, -7.9], [62, -8.3], [69, -8.8]]], "#dcc9a0", 0.4, 0.22) +
      /* Muskeln: Schwanzbasis (Caudofemoralis), Rippenwölbung, Schulter */
      licht(T, 29, -22.8, 10, 3, -26, 0.6) + licht(T, 50, -21.5, 10, 5, -8, 0.5) + licht(T, 62, -20.6, 4.6, 3, -20, 0.45) +
      schatten(T, 34, -17.8, 6, 2, -24, 0.35) +
      schuppenFeld(T, oben, unten, 18, 71, 11, (x, t) => 0.42 + 0.34 * Math.sin(Math.PI * t) * (x > 32 ? 1 : 0.5), { opD: 0.42, opH: 0.24 }) +
      hoecker(T, streu(T, flanke, 30, 0.32, 0.55), "#6e5d40", { op: 0.4 }) +
      falten(T, [[[38, -24.6], [41, -19], [44.8, -14.6], [47.4, -12.2]]], "#140f08", 0.5, 0.18) +
      /* Hautfalten nur an Gelenken: Leiste, Schwanzansatz, Achsel, Hals */
      falten(T, [[[31, -17.6], [33.8, -14.8], [36.2, -12.2]], [[29, -18.8], [31.4, -16.2]], [[24, -18], [27.4, -20.8], [30.4, -22.6]],
        [[64.8, -12], [67.6, -11], [70.4, -11.6]], [[64, -9.6], [67.4, -9], [70.6, -9.6]], [[65.6, -14.2], [68.4, -13.4], [70.6, -14]],
        [[54.6, -14.6], [55.6, -11.8], [57.6, -10]], [[62.6, -17.2], [65.6, -15.8], [68.6, -16]]], "#1a150c", 0.14, 0.5),
    randA: 0.45, randSzene: true,
  });

  /* nahes Hinterbein: Oberschenkelmuskel, Kniescheibe, ringförmige Hautfalten am Fußgelenk */
  h += teil(T, HB, nahB, {
    vol: false, randAb: 0.55, randA: 0.4,
    innen: licht(T, 41, -18.5, 5.4, 4.6, -10, 0.55) + licht(T, 44.4, -11.6, 1.8, 1.4, 0, 0.4) +
      schatten(T, 35, -9, 1.8, 6, -14, 0.5) + schatten(T, 41, -1.2, 6, 1.4, 0, 0.35) + schatten(T, 40, -9.2, 6, 1.2, 0, 0.35) +
      schuppenFeld(T, [[33, -22], [47, -22]], [[33, -3], [47, -3]], 33, 47, 10, () => 0.46, { opD: 0.35, opH: 0.2 }) +
      falten(T, [[[35.2, -10.4], [38.6, -9.2], [43.4, -9.6]], [[37.6, -4.8], [40.2, -4.2], [43.2, -4.6]], [[37.4, -2.8], [40.6, -2.2], [44.4, -2.8]],
        [[45.4, -12.6], [43.2, -14.2], [41.6, -17.5]], [[38.4, -7.4], [40.4, -6.8], [42.6, -7.2]], [[40.8, -1.8], [41, -0.2]], [[42.8, -2], [43.2, -0.2]]],
        "#16120b", 0.13, 0.55),
  });
  h += zehen(39.2, 2.3, 3, "#433a2d");

  /* nahes Vorderbein: Schultermuskel (Deltoideus/Triceps), Ellbogen, Handgelenk */
  h += teil(T, VB, nahB, {
    vol: false, randAb: 0.5, randA: 0.4,
    innen: licht(T, 60.4, -17, 4.4, 4.4, -10, 0.5) + licht(T, 58.6, -9.6, 2.4, 1.6, -30, 0.35) + schatten(T, 57.2, -6.2, 1.6, 4, -24, 0.45) +
      schatten(T, 62, -1, 4.6, 1.2, 0, 0.35) +
      schuppenFeld(T, [[55, -20], [66, -20]], [[55, -2], [66, -2]], 55, 66, 9, () => 0.42, { opD: 0.35, opH: 0.2 }) +
      falten(T, [[[56, -10.8], [59.4, -9.2], [63.4, -9.8]], [[59.4, -3.6], [61.6, -3.2], [63.6, -3.6]], [[59.4, -5.6], [61.4, -5.2], [63.2, -5.6]],
        [[61.8, -1.8], [62, -0.2]], [[63.4, -1.8], [63.6, -0.2]]], "#16120b", 0.13, 0.55),
  });
  h += zehen(60.6, 1.7, 3, "#433a2d");

  /* Schädel mit Nackenschild – EIN Umriss; Schild geschlossen (ohne Fenster), Randzacken ringsum */
  const K = [[89.4, -9.5, 1], [88.9, -11.4], [87.8, -13.4], [86.4, -15], [84.6, -16.2], [82, -17.2], [78.8, -18.4], [75.8, -20.2], [72.2, -22.4],
    [68, -25.4], [63.6, -28], [60.8, -28.9], [58.6, -27.8], [57.4, -25], [57.1, -21.6], [57.8, -18.2], [59.6, -15.6], [62.6, -14.2],
    [66.4, -13.4], [69.2, -12.2], [71.4, -9.8], [74.6, -8], [79.6, -7.3], [84, -7.5], [86.2, -7.9], [87.7, -8.6], [88.5, -9.2, 1]];
  const RZ = [[70, -24], [68, -25.4], [65.8, -26.8], [63.6, -28], [60.8, -28.9], [58.6, -27.8], [57.4, -25], [57.1, -21.6], [57.8, -18.2], [59.6, -15.6], [62.6, -14.2]];
  let z = "";
  for (let i = 0; i < RZ.length - 1; i++) {
    const [ax, ay] = RZ[i], [bx, by] = RZ[i + 1], mx = (ax + bx) / 2, my = (ay + by) / 2;
    let nx = -(by - ay), ny = bx - ax; const l = Math.hypot(nx, ny);
    if (nx * (mx - 65) + ny * (my + 20) < 0) { nx = -nx; ny = -ny; }
    z += `M${r(ax)} ${r(ay)}Q${r(mx + nx / l * 1.5)} ${r(my + ny / l * 1.5)} ${r(bx)} ${r(by)}`;
  }
  s += h; h = "";
  /* fernes Stirnhorn (andere Kopfseite: etwas weiter vorn, im Schatten) */
  s += T.form([[73.8, -21.9], [75.9, -24.6], [78.8, -27], [82, -28.5], [84.3, -28.9, 1], [81.6, -26.8], [79.2, -24], [76.8, -20.4]], T.lg("hornF", [[0, "#3a3327"], [0.5, "#7a6f59"], [1, "#5a5040"]], 1, 1, 0, 0));
  h += `<path d="${z}" fill="#5e4a30" stroke="#21190f" stroke-width=".12" stroke-opacity=".55" stroke-linejoin="round"/>`;
  h += teil(T, K, T.lg("kopf", [[0, "#76664a"], [0.55, "#806f50"], [1, "#56482f"]]), {
    innen:
      /* Schildfläche: oben im Licht, zum Kopf hin im Eigenschatten; Randsaum; Gefäßrinnen strahlenförmig */
      fl(T, [[73, -22.8], [70.8, -17.6], [69.6, -12.6], [55, -12], [55, -31], [64, -31]], schild, 1) +
      falten(T, [[[68, -25.4], [63.6, -28], [60.8, -28.9], [58.6, -27.8], [57.4, -25], [57.1, -21.6], [57.8, -18.2], [59.6, -15.6], [62.6, -14.2]]], "#24190d", 1.6, 0.4) +
      falten(T, [[[70.4, -19.6], [66.4, -23], [62.4, -26.8]], [[69.8, -17.6], [65, -20.2], [59.8, -24]], [[69.4, -15.6], [64, -17], [59, -19.8]],
        [[69.4, -14], [64.4, -14.8], [60, -16.2]], [[71.2, -21.2], [68, -24.8], [65.4, -27.2]]], "#3a2a16", 0.14, 0.5) +
      licht(T, 63, -24, 5, 3, -40, 0.55) + schatten(T, 69.5, -15, 3, 6, 10, 0.6) +
      (F ? tupfen(T, 14, 59, -27, 68, -15.5, 0.4, "#c2a472", 0.3) : "") +
      /* Gesicht: Wangenwulst, Maulspalte, Kinnfalten, Augenhöhle */
      licht(T, 78, -15.6, 5.4, 2.4, -12, 0.5) + schatten(T, 79, -8.6, 8, 1.6, 0, 0.5) +
      schuppenFeld(T, [[70, -21], [88, -15]], [[70, -8], [88, -8]], 70, 86, 8, () => 0.34, { opD: 0.35, opH: 0.2 }) +
      falten(T, [[[85.6, -10.5], [82.4, -10.4], [79.2, -10.3]], [[80.5, -8.5], [76.5, -8.7], [73.6, -9.5]], [[81.4, -16.6], [78.4, -15.6]]], "#120e08", 0.13, 0.5) +
      licht(T, 76.4, -19.4, 2.4, 0.9, -15, 0.5) +
      schatten(T, 75.6, -17.5, 1.8, 1.3, 0, 0.55) +
      /* Schnabel: Hornscheiden oben (Rostrale, Hakenspitze) und unten (Prädentale), glänzend */
      teilInnen(T, [[86.3, -15.2], [87.8, -13.4], [88.9, -11.4], [89.4, -9.5, 1], [88.4, -10.1], [87.3, -11], [86.1, -12.4], [85.5, -14]], schnabel) +
      teilInnen(T, [[85.8, -10.7], [88.5, -9.2, 1], [87.7, -8.6], [86.2, -7.9], [85.1, -8.3], [84.8, -9.6]], schnabel) +
      falten(T, [[[86.8, -14.6], [88.2, -12.6], [88.9, -10.6]], [[86.2, -10.1], [87.8, -9.4]]], "#e8dcc4", 0.16, 0.5),
    randA: 0.45, randSzene: true,
  });
  s += h;
  /* Nasenloch groß, unter dem Nasenhorn */
  s += `<ellipse cx="84.4" cy="-14.3" rx=".7" ry=".42" fill="${T.rg("nase", [[0, "#0a0806"], [0.7, "#1e1810"], [1, "#3a2f20", 0]])}" transform="rotate(-30 84.4 -14.3)"/>` +
    falten(T, [[[83.6, -15], [84.6, -15.2], [85.4, -14.8]]], "#d2c19a", 0.12, 0.4);
  /* Nasenhorn kurz nach vorn-oben; Wangenhorn (Epijugale) nach unten-hinten; nahes Stirnhorn ~1 m, kegelförmig */
  const hornIn = (l) => F ? falten(T, l, "#3a3226", 0.08, 0.35) : "";
  s += teil(T, [[83, -16.7], [83.9, -18.4], [84.6, -19.9, 1], [85.6, -17.4], [86.5, -15.6]], horn, { vol: false, randA: 0.45, rw: 0.08 });
  s += teil(T, [[71, -12.4], [70.3, -9.8], [70.3, -8.2, 1], [71.8, -9.6], [73, -11.6]], horn, { vol: false, randA: 0.45, rw: 0.08 });
  s += teil(T, [[72.8, -21.8], [74.7, -24.4], [77.6, -26.8], [80.8, -28.4], [83, -29, 1], [80.3, -26.9], [77.8, -24.1], [75.6, -20.6]], horn, {
    innen: hornIn([[[73.8, -21.6], [76.3, -24.4], [79.6, -27]], [[74.8, -21.2], [77.3, -23.9], [80.6, -26.9]]]) +
      falten(T, [[[74, -22.6], [76.7, -25.3], [80.2, -27.7]]], "#fff", 0.16, 0.45) +
      schatten(T, 74.2, -21.2, 2.2, 0.8, -24, 0.55),
    vol: false, randA: 0.5, rw: 0.08,
  });
  /* Auge: seitlich unter dem Hornansatz; Reptilienauge ohne Wimpern, runde Pupille, Lidwulst darüber */
  s += T.augeReal ? T.augeReal(75.6, -17.4, 0.58, { iris: "#b07a2e", iris2: "#4a2c0e", offen: 0.66, lid: "#1d160d", winkel: -6 })
    : T.auge(75.6, -17.4, 0.5, "#6b4a1c", { flach: 0.8 });

  return { svg: DM(s, 10.8), box: [111, -313, 971, 0] };
}

/* =====================================================================
   STEGOSAURUS
   RECHERCHE: Stegosaurus (S. stenops/S. ungulatus), Oberjura, Morrison-
   Formation (Nordamerika), ~155–150 Mio. Jahre. S. stenops ~6,5 m, große
   Tiere (S. ungulatus) bis ~9 m, 5–7 t. Hüfthöhe ~2,5 m; Rücken bogenförmig,
   höchster Punkt über Hüfte/Schwanzwurzel, kurzer Hals, Kopf tief und klein
   (schmaler, langer Schädel, Hornschnabel vorn, Backenzähne klein). Vorderbeine
   kurz und kräftig (fünf Finger, nur die inneren zwei mit stumpfem Huf),
   Hinterbeine lang und säulenartig (drei Zehen). ZWEI Reihen großer
   Knochenplatten, VERSETZT angeordnet (Gelenkfunde der 1960er und „Sophie"),
   in der Haut verankert, nicht am Rückgrat; die größten über der Hüfte
   (~60–76 cm hoch und breit), dünn, mit Gefäßrinnen (Thermoregulation/
   Imponieren). Schwanzende mit VIER Stacheln („Thagomizer", 60–90 cm) – echte
   Waffe (Allosaurus-Wirbel mit Stichwunden). Kehle mit kleinen Knochenplättchen
   (Gularossikel). Haut: kleine polygonale Schuppen; Farbe unbekannt →
   gedeckte Oliv-/Brauntöne, Platten zur Spitze hin rötlich (Imponierfarbe).
   ===================================================================== */
function stegosaurus(T) {
  const F = T.fein;
  const haut = T.lg("haut", [[0, "#3d3e28"], [0.35, "#5c5b39"], [0.72, "#7a7550"], [1, "#686143"]]);
  const fern = T.lg("fern", [[0, "#444129", 0], [0.3, "#444129", 0.9], [0.5, "#38351f"], [1, "#23210f"]]);
  const nahB = T.lg("bein", [[0, "#625f3c", 0], [0.3, "#625f3c", 0.6], [0.55, "#5a5638"], [0.8, "#4a4630"], [1, "#333020"]]);
  const platte = T.lg("platte", [[0, "#4a4a2c"], [0.3, "#76673b"], [0.65, "#a8703c"], [0.9, "#a24e2c"], [1, "#7e3a20"]], 0, 1, 0, 0);
  const platteF = T.lg("platteF", [[0, "#2c2a18"], [0.4, "#544628"], [1, "#62331d"]], 0, 1, 0, 0);
  const stachel = T.lg("stachel", [[0, "#4e4636"], [0.3, "#a69a7c"], [0.7, "#ddd4ba"], [1, "#655c48"]], 0, 1, 1, 0);
  let s = "", h = "";

  /* Rückenlinie: stark gewölbt, höchster Punkt über Hüfte/Schwanzwurzel, steil abfallend zu Schulter und Hals */
  const RUECKEN = [[1.4, -18], [8, -20], [15, -22.6], [22, -25.4], [29, -27.4], [35, -28], [41, -27.4], [47, -25.2], [53, -22],
    [58, -19.2], [62, -16.9], [66, -15], [70, -13.6], [73.6, -12.2]];
  /* Platte: Fuß auf der Rückenlinie, Höhe H, Breite W, Neigung (Grad; negativ = Spitze nach hinten), leicht unregelmäßig */
  const plattePts = (bx, H, W, neig) => {
    const by = yBei(RUECKEN, bx) + Math.min(1.4, H * 0.2);
    const spitz = H > 3 ? -0.12 : 0, j = () => (T.rnd() - 0.5) * 0.08;
    /* Fuß schmaler (verdickte Basis), breiteste Stelle unten, zur Spitze verjüngt, leicht asymmetrisch */
    const pts = [[-0.34, 0], [-0.58, -0.22 + j()], [-0.6, -0.42 + j()], [-0.4 + j(), -0.7], [spitz, -1, H > 3 ? 1 : 0], [0.3 + j(), -0.66],
      [0.56, -0.36 + j()], [0.52, -0.16], [0.36, 0]].map(([u, v, e]) => { const q = [bx + u * W, by + v * H]; if (e) q.push(1); return q; });
    return dreh(pts, bx, by, neig);
  };
  const PL = [ // [x, H, W, Reihe 0 = fern, 1 = nah] – größte Platten über Hüfte und Schwanzwurzel
    [71.6, 1.3, 1.6, 0], [69.2, 1.8, 2, 1], [66.6, 2.3, 2.4, 0], [63.8, 2.9, 2.9, 1], [60.8, 3.5, 3.4, 0], [57.4, 4.2, 4, 1],
    [53.6, 5, 4.6, 0], [49.4, 5.8, 5.4, 1], [45, 6.4, 6, 0], [40.2, 6.9, 6.6, 1], [35.2, 7.2, 6.8, 0], [30.2, 7, 6.6, 1],
    [25.2, 6.2, 5.8, 0], [20.4, 5, 4.8, 1], [16, 3.8, 3.6, 0], [12.2, 2.6, 2.6, 1]];
  const neig = (x) => -4 - Math.max(0, 42 - x) * 0.5;
  const platten = (reihe) => PL.filter((p) => p[3] === reihe).map(([x, H, W]) => {
    const pts = plattePts(x, H, W, neig(x)), by = yBei(RUECKEN, x);
    const rinnen = F ? falten(T, [-0.32, -0.12, 0.08, 0.28].map((u) => dreh([[x + u * W, by], [x + u * W * 1.1 - H * 0.04, by - H * 0.5], [x + u * W * 0.8 - H * 0.08, by - H * 0.88]], x, by, neig(x))),
      reihe ? "#3a2412" : "#1a1008", 0.1, 0.3) : "";
    return teil(T, pts, reihe ? platte : platteF, {
      innen: rinnen + (reihe && F ? falten(T, [[pts[1], pts[2], pts[3]]], "#fff", 0.22, 0.25) + falten(T, [[pts[3], pts[4], pts[5], pts[6], pts[7]]], "#3a1a0c", 0.8, 0.3) +
        schatten(T, x, by, W * 0.6, H * 0.3, 0, 0.5) : ""),
      vol: F && !!reihe, randA: reihe ? 0.5 : 0.35, rw: 0.1, randSzene: !!reihe,
    });
  }).join("");
  /* Thagomizer: vier Stacheln (zwei Paare) am Schwanzende, kräftige Basis, nach hinten-oben-außen */
  const stachelPts = (x, y, l, w, a) => {
    const c = Math.cos(a * Math.PI / 180), sn = Math.sin(a * Math.PI / 180), nx = -sn, ny = c;
    const P = (t, o) => [x + c * l * t + nx * o, y + sn * l * t + ny * o];
    return [P(-0.05, -w / 2), P(0.4, -w * 0.34), P(0.82, -w * 0.12), [...P(1, 0), 1], P(0.8, w * 0.14), P(0.4, w * 0.36), P(-0.05, w / 2)];
  };

  /* Beine: Hinterbein lang (Knie vorn), Vorderbein kurz und kräftig */
  const HB = [[32, -24], [31.6, -17.6], [33, -10.6], [35.4, -6], [35.8, -3.2], [35, -1.1], [35.6, 0, 1], [43.2, 0, 1], [43.6, -1.2],
    [41.6, -2.6], [40.8, -4.6], [41.8, -9.2], [43.8, -14], [44.4, -20], [41, -26]];
  const VB = [[58, -17], [57.4, -12], [58, -8.2], [59.4, -5], [59.6, -2.6], [59, -0.7], [59.4, 0, 1], [64.8, 0, 1], [65.2, -1.2],
    [64, -2.6], [63.6, -5.4], [64, -9], [65.2, -13], [64.6, -17]];
  const hbF = boden(dreh(HB, 37, -19, -10, 3.5)), vbF = boden(dreh(VB, 61, -14, 9, -2.4));
  const zehen = (x, b, n, farbe) => naegel(Array.from({ length: n }, (_, i) => [x + i * b * 1.02, 0, b, b * 0.5]), farbe);
  s += platten(0);
  const stF = T.lg("stF", [[0, "#2e2a20"], [0.35, "#6a6250"], [0.75, "#8d846c"], [1, "#4a4436"]], 0, 1, 1, 0);
  s += teil(T, stachelPts(11.4, -20.2, 6.6, 1.7, -110), stF, { vol: false, randA: 0.4, randSzene: true });
  s += teil(T, stachelPts(7, -19, 6.4, 1.6, -144), stF, { vol: false, randA: 0.4, randSzene: true });
  h += fernBein(T, hbF, fern, { randAb: 0.5 }) + fernBein(T, vbF, fern, { randAb: 0.5 });
  h += zehen(hbF[6][0] + 3.2, 1.9, 3, "#3d3826") + zehen(vbF[6][0] + 2.4, 1.4, 3, "#3d3826");

  /* Rumpf + Schwanz + Hals: EIN Umriss */
  const R = [[0.6, -17], ...RUECKEN.slice(1), [76.2, -11.4], [76.6, -9.4], [74.4, -8.4], [70, -8.2], [64, -7.8], [58, -7.6], [52, -8], [45, -9.2],
    [39.4, -12.2], [33.4, -15.6], [26, -17.4], [18, -17.4], [10, -16.4], [3.6, -15.8], [1.2, -16]];
  const unten = [[1, -16], [10, -16.4], [18, -17.4], [26, -17.4], [33.4, -15.6], [39.4, -12.2], [45, -9.2], [52, -8], [58, -7.6], [64, -7.8], [70, -8.4], [75, -9]];
  h += teil(T, R, haut, {
    innen:
      /* dunkler Rücken mit Querbändern, heller Bauch, Kernschatten unten */
      fl(T, [[1, -17.6], [12, -21.6], [28, -28], [42, -28.4], [55, -21.6], [66, -15.6], [75, -12.6], [74, -11.2], [68, -12.6], [63, -13],
        [59, -15], [55, -14.2], [51, -17], [46.4, -16.4], [42, -19.6], [37, -18.8], [32, -21], [27, -19.8], [21, -20.6], [15, -19], [7, -18.2]], "#211e0c", 0.45) +
      fl(T, [[34, -13.4], [44, -8.2], [58, -7], [70, -7.8], [76, -9.4], [66, -10.6], [54, -10.8], [44, -11.6]], "#cbbd8c", 0.3) +
      fl(T, [[30, -18], [40, -15.4], [52, -13.2], [64, -12.8], [76, -11], [76, -5], [30, -5]], "#120f06", 0.24) +
      fl(T, [[2, -16.4], [10, -17.2], [20, -18.2], [30, -17.6], [35, -16], [26, -16.6], [16, -16.6], [6, -15.8]], "#120f06", 0.32) +
      falten(T, [[[6, -19], [16, -22.6], [28, -26.6], [38, -27.4], [50, -23.6], [60, -18.2], [70, -14]]], "#f4ecc8", 0.7, 0.16) +
      falten(T, [[[40, -10.6], [48, -8.6], [58, -8], [68, -8.4], [74, -9.4]]], "#e2d6a8", 0.4, 0.2) +
      /* Muskeln: Schwanzwurzel, Rippen, Schulter, Hals */
      licht(T, 25, -22.6, 9, 2.6, -22, 0.55) + licht(T, 47, -18.6, 8.6, 4.6, -18, 0.45) + licht(T, 62, -13.6, 3.6, 2.4, -24, 0.4) +
      licht(T, 69, -11.6, 3.2, 1.2, -16, 0.35) + schatten(T, 33, -17.6, 5, 1.8, -24, 0.35) +
      schuppenFeld(T, RUECKEN.map(([x, y]) => [x, y + 0.6]), unten, 5, 76, 10, (x, t) => 0.38 + 0.26 * Math.sin(Math.PI * t) * (x > 24 ? 1 : 0.5), { opD: 0.4, opH: 0.22, lichtBis: 0.45 }) +
      /* Kehle: Gularossikel (Knochenplättchen) */
      hoecker(T, [[68, -8.6, 0.4], [69.6, -8.5, 0.45], [71.2, -8.6, 0.4], [72.8, -8.8, 0.36], [74.2, -9.1, 0.32], [70.4, -9.6, 0.3], [72.6, -9.8, 0.28]], "#8c835e", { op: 0.7 }) +
      falten(T, [[[31, -18.6], [33.6, -15.6], [36, -13]], [[55.8, -12.4], [56.8, -10], [58.6, -8.6]], [[63.6, -11], [66, -10.4], [68.4, -10.8]],
        [[65, -12.8], [67.6, -12.2], [70.2, -12.6]], [[20, -19.4], [23, -21.8]], [[12, -18], [14.6, -20.2]]], "#15120a", 0.13, 0.5),
    randA: 0.45, randSzene: true,
  });

  /* nahes Hinterbein: Oberschenkelmuskel, Knie, Sehnen am Unterschenkel, Fußgelenkfalten */
  h += teil(T, HB, nahB, {
    vol: false, randAb: 0.5, randA: 0.4,
    innen: licht(T, 37.6, -17.6, 5, 4.6, -10, 0.55) + licht(T, 42.8, -11.8, 1.6, 1.4, 0, 0.4) +
      schatten(T, 32.6, -10, 1.6, 5.4, -16, 0.5) + schatten(T, 38.6, -1.2, 5, 1.2, 0, 0.35) +
      schuppenFeld(T, [[30, -22], [44, -22]], [[30, -3], [44, -3]], 30, 44, 8, () => 0.44, { opD: 0.35, opH: 0.2 }) +
      falten(T, [[[32.6, -10.8], [36.4, -9.4], [41.8, -10]], [[35.8, -4.8], [38.4, -4.2], [41, -4.6]], [[35.6, -2.8], [38.6, -2.2], [41.6, -2.8]],
        [[43.2, -13], [41.2, -14.8], [39.8, -17.4]], [[36.8, -7.6], [37.6, -5.6]], [[38.6, -1.8], [38.8, -0.2]], [[40.6, -2], [41, -0.2]]], "#16120b", 0.13, 0.55) +
      falten(T, [[[38, -26], [40.8, -19.6], [43.4, -14.4]]], "#120e06", 0.4, 0.2),
  });
  h += zehen(37.2, 2.1, 3, "#433d2b");
  /* nahes Vorderbein: kurz und kräftig, Ellbogen hinten, säulenartige Hand */
  h += teil(T, VB, nahB, {
    vol: false, randAb: 0.4, randA: 0.4,
    innen: licht(T, 61, -13.2, 3.6, 3.4, -10, 0.5) + schatten(T, 58.4, -6, 1.4, 3.6, -14, 0.45) + schatten(T, 62, -1, 4, 1.1, 0, 0.35) +
      schuppenFeld(T, [[57, -16], [65, -16]], [[57, -2], [65, -2]], 57, 65, 7, () => 0.4, { opD: 0.35, opH: 0.2 }) +
      falten(T, [[[57.8, -8.4], [60.6, -7.6], [63.8, -8.4]], [[59.6, -3.6], [61.6, -3.2], [63.6, -3.6]], [[61.6, -1.8], [61.8, -0.2]], [[63.2, -1.8], [63.4, -0.2]]], "#16120b", 0.13, 0.55),
  });
  h += zehen(60.2, 1.5, 3, "#433d2b");

  /* Kopf: klein, lang und schmal, tief gehalten, geht weich in den Hals über; Hornschnabel vorn */
  const K = [[74.4, -12], [76.4, -11.9], [78.6, -11.5], [80.6, -10.5], [82.2, -9.2], [82.9, -8.3, 1], [82.1, -7.7], [80, -7.4], [77.8, -7.5],
    [75.8, -8], [74.2, -9], [73.6, -10.6]];
  h += teil(T, K, T.lg("kopf", [[0, "#6a6642"], [0.6, "#756f49"], [1, "#4d482e"]]), {
    innen: licht(T, 78.4, -10.6, 3, 1, -14, 0.5) + schatten(T, 78.6, -7.6, 3.6, 0.7, -4, 0.5) + schatten(T, 74.4, -10, 1, 2, 0, 0.35) +
      schuppenFeld(T, [[74, -12], [83, -8.8]], [[74, -7.4], [83, -7.4]], 74, 82.6, 5, () => 0.2, { opD: 0.35, opH: 0.2 }) +
      teilInnen(T, [[81, -10], [82.2, -9.2], [82.9, -8.3, 1], [82.1, -7.7], [80.8, -7.6], [80.4, -8.7]], T.lg("schnabel", [[0, "#6a604c"], [0.5, "#3a3328"], [1, "#1e1a14"]])) +
      falten(T, [[[80.6, -8.4], [78.4, -8.5], [76.2, -8.9]], [[81.4, -9.7], [82.4, -8.7]]], "#120e08", 0.1, 0.55) +
      falten(T, [[[81.4, -9.9], [82.5, -8.9]]], "#fff", 0.1, 0.4) + schatten(T, 78.4, -10.1, 0.8, 0.55, 0, 0.5),
    randA: 0.45, randSzene: true,
  });
  s += h;
  /* nahe Platten über dem Rumpf, nahe Stacheln */
  s += platten(1);
  /* Stachelbasis in der Haut verankert: Hautwulst + Schatten */
  s += schatten(T, 9.6, -19.4, 2.2, 1.2, -20, 0.5) + schatten(T, 5, -18.2, 2, 1.1, -20, 0.5);
  s += teil(T, stachelPts(10, -19.8, 6.8, 1.9, -118), stachel, { innen: falten(T, [[[9.4, -20.6], [8.2, -23], [7.2, -25.4]]], "#fff", 0.14, 0.4) + schatten(T, 10, -19.8, 1.6, 1.2, 0, 0.5), vol: false, randA: 0.5 });
  s += teil(T, stachelPts(5.4, -18.6, 6.6, 1.8, -152), stachel, { innen: falten(T, [[[5, -19.4], [2.6, -20.6], [0.4, -21.6]]], "#fff", 0.14, 0.4) + schatten(T, 5.4, -18.6, 1.6, 1.2, 0, 0.5), vol: false, randA: 0.5 });
  s += T.augeReal ? T.augeReal(78.4, -10.1, 0.3, { iris: "#9a6a26", iris2: "#3e240c", offen: 0.66, lid: "#1d160d", winkel: -10 }) : T.auge(78.4, -10.1, 0.28, "#6b4a1c");
  s += `<ellipse cx="81.7" cy="-9.2" rx=".28" ry=".17" fill="#120e09" transform="rotate(-34 81.7 -9.2)"/>`;
  const k = 10.6, box = [-1.2, -35.4, 83.8, 0];
  return { svg: DM(s, k), box: box.map((v) => Math.round(v * k)) };
}

/* =====================================================================
   ANKYLOSAURUS
   RECHERCHE: Ankylosaurus magniventris, Oberkreide (Maastricht, Hell Creek/
   Lance/Scollard), ~68–66 Mio. Jahre. Länge ~6–8 m (neuere Schätzung
   Arbour & Mallon 2017: 6–8 m), 5–8 t, Hüfthöhe ~1,7 m, sehr breit und
   niedrig. Schädel breiter als lang (64,5 × 74,5 cm), oben mit Hornschuppen-
   Mosaik (Caputegulae); vier pyramidenförmige Hörner an den hinteren Ecken:
   Squamosalhörner nach hinten-außen, Quadratojugalhörner an der Wange nach
   unten-hinten; schmaler Hornschnabel, kleine Augen. Panzer aus Osteodermen
   in QUERREIHEN: große flache, gekielte Ovalplatten, dazwischen kleine
   runde Knöchelchen; zwei Halbringe über dem Hals; seitlich dreieckige
   Randstacheln. Schwanz: hintere Hälfte durch verknöcherte Sehnen steif
   („Griff"), Keule ~60 cm lang, 49 cm breit aus zwei großen Osteodermen je
   Seite + kleinen an der Spitze. Kurze, kräftige, leicht gespreizte Beine,
   breite Füße mit stumpfen Hufkrallen. Farbe unbekannt → dunkles Erdbraun,
   Platten heller (Horn), Unterseite heller.
   ===================================================================== */
function ankylosaurus(T) {
  const F = T.fein;
  const haut = T.lg("haut", [[0, "#3e3122"], [0.4, "#55432c"], [0.8, "#6a5739"], [1, "#5a4a33"]]);
  const fern = T.lg("fern", [[0, "#3a2e20", 0], [0.3, "#3a2e20", 0.9], [0.5, "#2e2418"], [1, "#1c160e"]]);
  const nahB = T.lg("bein", [[0, "#5a4830", 0], [0.3, "#5a4830", 0.6], [0.55, "#4e3f2a"], [1, "#30271a"]]);
  const os = T.rg("os", [[0, "#9a8460"], [0.45, "#715d43"], [0.85, "#4a3a28"], [1, "#33281a"]], 0.35, 0.3, 0.75);
  const osL = T.lg("osL", [[0, "#9a8662"], [0.45, "#76624a"], [1, "#3a2d1e"]]);
  const osD = T.rg("osD", [[0, "#9a8662"], [0.5, "#6e5c40"], [1, "#3a2d1c"]], 0.35, 0.3, 0.75);
  let s = "", h = "";

  const RUECKEN = [[6, -8.6], [12, -10.2], [17, -12.4], [22, -14.6], [27, -16.4], [32, -17.2], [37, -17.4], [42, -16.6], [46.5, -15],
    [50.4, -13], [53.4, -11.8]];
  const FLANKE = [[6, -6.8], [12, -7.6], [18, -8.6], [24, -9], [30, -8.4], [36, -8.2], [42, -8.4], [48, -8.8], [53, -9]];
  /* Osteoderm-Platten in Querreihen: Spalten entlang x, Reihen von der Rückenmitte zur Flanke; gekielt */
  const platten = (x0, x1, dx, reihen, gr, fill, nurFein) => {
    if (nurFein && !F) return "";
    let e = "", kl = "", ks = "";
    for (let x = x0; x <= x1; x += dx) {
      for (let i = 0; i < reihen; i++) {
        const t = (i + 0.5) / reihen, ya = yBei(RUECKEN, x), yb = yBei(FLANKE, x), y = ya + (yb - ya) * (0.08 + 0.92 * t);
        const sk = 0.4 + 0.6 * Math.sin(Math.PI * (0.12 + 0.76 * t)), rx = gr * (0.75 + 0.5 * Math.sin(Math.PI * t)) * (0.8 + T.rnd() * 0.4), ry = rx * 0.66 * sk;
        const xx = x + (i % 2) * dx * 0.45 + (T.rnd() - 0.5) * 0.5, yy = y + (T.rnd() - 0.5) * 0.3;
        e += `<ellipse cx="${r(xx)}" cy="${r(yy)}" rx="${r(rx)}" ry="${r(ry) || 0.1}"/>`;
        kl += `M${r(xx - rx * 0.8)} ${r(yy - ry * 0.1)}q${r(rx * 0.8)} ${r(-ry * 0.25)} ${r(rx * 1.6)} 0`;
        ks += `M${r(xx - rx * 0.8)} ${r(yy + ry * 0.55)}q${r(rx * 0.8)} ${r(ry * 0.6)} ${r(rx * 1.7)} ${r(-ry * 0.2)}`;
      }
    }
    return (F ? `<path d="${ks}" fill="none" stroke="#0e0904" stroke-width=".35" stroke-opacity=".35" stroke-linecap="round"/>` : "") +
      `<g fill="${fill}" stroke="#1a120a" stroke-width=".06" stroke-opacity=".45">${e}</g>` +
      (F ? `<path d="${kl}" fill="none" stroke="#e8d6ae" stroke-width=".1" stroke-opacity=".55" stroke-linecap="round"/>` : "");
  };
  /* Randstacheln: dreieckige Osteoderme an der Flanke, nach unten-hinten */
  const zacken = (liste, fill) => {
    let g = "", sch = "", kiel = "";
    for (const [x, y, b, l, a] of liste) {
      const c = Math.cos(a * Math.PI / 180), sn = Math.sin(a * Math.PI / 180), tx = x + c * l, ty = y + sn * l;
      g += `<path d="M${r(x - b / 2)} ${r(y)}Q${r(x - b * 0.3 + c * l * 0.5)} ${r(y + sn * l * 0.55)} ${r(tx)} ${r(ty)}Q${r(x + b * 0.3 + c * l * 0.4)} ${r(y + sn * l * 0.4)} ${r(x + b / 2)} ${r(y)}Z"/>`;
      sch += `M${r(x - b * 0.3)} ${r(y + 0.4)}L${r(tx + 0.5)} ${r(ty + 0.5)}L${r(x + b * 0.6)} ${r(y + 0.2)}Z`;
      kiel += `M${r(x - b * 0.15)} ${r(y + 0.1)}L${r(tx)} ${r(ty)}`;
    }
    return (F ? `<path d="${sch}" fill="#0a0603" opacity=".3"/>` : "") + `<g fill="${fill}" stroke="#1a130b" stroke-width=".07" stroke-opacity=".6">${g}</g>` +
      (F ? `<path d="${kiel}" stroke="#e8d8b4" stroke-width=".1" stroke-opacity=".5"/>` : "");
  };

  /* Beine: kurz, kräftig, leicht gespreizt; breite Füße mit stumpfen Hufkrallen */
  const HB = [[24, -12], [23.2, -8.6], [24.4, -5.6], [25.6, -3.4], [25.4, -1.4], [25, -0.4], [25.4, 0, 1], [31.6, 0, 1], [32, -1],
    [30.6, -2.2], [30, -3.6], [30.8, -6.4], [31.8, -9.6], [31, -13]];
  const VB = [[44.4, -11], [43.8, -7.6], [44.4, -5], [45.4, -3], [45.2, -1.2], [44.8, -0.3], [45.2, 0, 1], [50.8, 0, 1], [51.2, -1],
    [49.8, -2.2], [49.2, -3.6], [49.6, -6], [50.6, -9], [49.8, -11.6]];
  const hbF = boden(dreh(HB, 28, -10, -8, 2.6)), vbF = boden(dreh(VB, 47, -9, 8, -2));
  const zehen = (x, b, n, farbe) => naegel(Array.from({ length: n }, (_, i) => [x + i * b * 1.02, 0, b, b * 0.5]), farbe);
  h += fernBein(T, hbF, fern, { randAb: 0.4 }) + fernBein(T, vbF, fern, { randAb: 0.4 });
  h += zehen(hbF[6][0] + 2.4, 1.3, 3, "#3a2f20") + zehen(vbF[6][0] + 2, 1.1, 3, "#3a2f20");

  /* Rumpf + Schwanzgriff + Hals: EIN Umriss, breit und niedrig gewölbt; Panzer liegt geklippt darin */
  const R = [[6.8, -8.6], ...RUECKEN.slice(1), [55, -9], [54.6, -6.6], [51, -5.8], [48, -5.2], [42, -4.8], [35, -5], [29, -5.8], [25, -7.8],
    [20, -8.6], [14, -7.8], [9, -7], [6.6, -7]];
  h += teil(T, R, haut, {
    innen:
      fl(T, [[24, -7.6], [34, -4.4], [46, -4.4], [55, -6], [50, -7.4], [36, -7.2]], "#b49c74", 0.3) +
      licht(T, 36, -14, 10, 3.4, -4, 0.5) + licht(T, 18, -11.4, 6, 1.6, -22, 0.4) +
      schuppenFeld(T, [[6, -8.6], [56, -9]], [[6, -4.4], [56, -4.4]], 6, 55, 6, () => 0.26, { opD: 0.4, opH: 0.2 }) +
      /* Panzer: kleine Knöchelchen, große gekielte Platten in Querreihen, zwei Halbringe am Hals */
      (F ? tupfen(T, 150, 8, -17.6, 54, -8.4, 0.2, "#7c6748", 0.6) : "") +
      platten(21.4, 47, 2.9, 6, 1.25, osL, false) + platten(9, 20, 2.4, 3, 0.85, osL, false) +
      `<g fill="${os}" stroke="#20180e" stroke-width=".08" stroke-opacity=".6">` +
      [[49.4, -14.2, 1.3, 0.75], [49.8, -12.3, 1.4, 0.85], [50.2, -10.4, 1.3, 0.8], [52.2, -12.2, 1.1, 0.7], [52.6, -10.6, 1.2, 0.75], [52.9, -9.2, 1, 0.6]]
        .map(([x, y, a, b]) => `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}"/>`).join("") + `</g>` +
      (F ? falten(T, [[[48.6, -14.6], [50, -14.4], [51.2, -14.1]], [[48.6, -12.6], [50, -12.4], [51.4, -12.1]], [[51.4, -12.4], [52.4, -12.3], [53.4, -12]]], "#f2e6c8", 0.14, 0.5) : "") +
      /* Kernschatten unten an der Flanke (unter dem Panzerrand) */
      fl(T, [[18, -8], [30, -7.2], [42, -7.4], [55, -8.2], [56, -4], [18, -4]], "#120c06", 0.28) +
      "",
    randA: 0.45, randSzene: true,
  });
  /* Randstacheln am Schwanzgriff und am Flankenrand ragen über den Umriss hinaus */
  h += zacken([[20.6, -9.4, 2, 1.5, 158], [17.4, -8.9, 1.9, 1.4, 160], [14.4, -8.3, 1.7, 1.3, 162], [11.6, -7.8, 1.5, 1.1, 164]], osL);

  /* nahes Hinterbein / Vorderbein */
  h += teil(T, HB, nahB, {
    vol: false, randAb: 0.45, randA: 0.4,
    innen: licht(T, 28, -8.6, 3.6, 2.6, -10, 0.45) + schatten(T, 25, -4, 1.2, 3, -10, 0.5) + schatten(T, 28.6, -0.8, 3.6, 0.9, 0, 0.35) +
      schuppenFeld(T, [[23, -10], [32, -10]], [[23, -2], [32, -2]], 23, 32, 6, () => 0.3, { opD: 0.35, opH: 0.2 }) +
      falten(T, [[[24.6, -5.4], [27.4, -4.6], [30.6, -5]], [[25.6, -2.6], [28, -2.2], [30.6, -2.6]], [[27.8, -1.4], [28, -0.2]], [[29.6, -1.4], [29.8, -0.2]]], "#16120b", 0.12, 0.55),
  });
  h += zehen(26.6, 1.6, 3, "#43372a");
  h += teil(T, VB, nahB, {
    vol: false, randAb: 0.45, randA: 0.4,
    innen: licht(T, 47.4, -8, 3, 2.4, -10, 0.45) + schatten(T, 45, -4, 1.1, 2.6, -10, 0.5) + schatten(T, 48, -0.8, 3.4, 0.9, 0, 0.35) +
      schuppenFeld(T, [[44, -10], [51, -10]], [[44, -2], [51, -2]], 44, 51, 6, () => 0.28, { opD: 0.35, opH: 0.2 }) +
      falten(T, [[[44.6, -5], [47.2, -4.4], [49.8, -4.8]], [[45.4, -2.6], [47.6, -2.2], [49.6, -2.6]], [[47.4, -1.4], [47.6, -0.2]], [[49, -1.4], [49.2, -0.2]]], "#16120b", 0.12, 0.55),
  });
  h += zehen(46.2, 1.4, 3, "#43372a");
  /* seitliche Randstacheln an der Panzerkante (über den Beinen sichtbar): gekielte Kegel nach außen-unten, mit Schlagschatten */
  h += zacken([[24, -9.4, 2.2, 1.9, 150], [27.4, -9, 2.4, 2, 148], [30.8, -8.8, 2.5, 2.1, 146], [34.2, -8.7, 2.5, 2.1, 145], [37.6, -8.7, 2.5, 2.1, 144],
    [41, -8.8, 2.4, 2, 143], [44.4, -9, 2.3, 1.9, 142], [47.6, -9.3, 2.1, 1.7, 140], [50.4, -9.6, 1.8, 1.4, 138]], osL);

  /* Schwanzkeule: zwei große Osteoderme je Seite + kleine an der Spitze; Griff mit paarigen Seitenplatten */
  const KEULE = [[8.4, -8.8], [7, -9.3], [5.2, -9.5], [3.6, -9.2], [2.5, -8.5], [2.2, -7.6], [2.7, -6.8], [4, -6.4], [5.8, -6.3], [7.4, -6.6], [8.6, -7.2]];
  h += teil(T, KEULE, T.lg("keule", [[0, "#8e7854"], [0.5, "#6a563c"], [1, "#352a1c"]]), {
    innen: licht(T, 4.6, -8.8, 2.2, 0.9, -10, 0.5) + schatten(T, 5.2, -6.4, 3, 0.8, 0, 0.5) +
      `<g fill="${osL}" stroke="#1a120a" stroke-width=".07" stroke-opacity=".5"><ellipse cx="5.9" cy="-7.9" rx="2" ry="1.35"/><ellipse cx="3.3" cy="-7.8" rx="1.1" ry="1"/><ellipse cx="8" cy="-8.4" rx="0.7" ry="0.5"/></g>` +
      falten(T, [[[4.6, -8.3], [5.9, -8.8], [7.3, -8.5]], [[2.6, -8], [3.3, -8.5], [3.9, -8.2]]], "#e8d6ae", 0.12, 0.5) +
      falten(T, [[[6.8, -9.1], [4.6, -9.3], [2.6, -8.9]], [[4.4, -8.8], [3.8, -8.4]]], "#f2e6c8", 0.2, 0.4),
    randA: 0.5, randSzene: true,
  });

  /* Kopf: breit, kurz, dreieckig; Hornschuppen-Mosaik oben, Squamosal- und Quadratojugalhorn, schmaler Schnabel */
  const K = [[53.4, -12.2], [55.6, -12.5], [58.4, -12.3], [61, -11.4], [62.8, -10.2], [63.4, -9], [63.4, -7.2], [62.9, -6.3, 1], [60.4, -5.7],
    [57.6, -5.6], [55.2, -6.3], [53.8, -8.4], [53.2, -10.6]];
  h += teil(T, K, T.lg("kopf", [[0, "#6c5a3e"], [0.6, "#5c4b33"], [1, "#3e3222"]]), {
    innen: licht(T, 58.6, -11.4, 4, 1.2, -10, 0.55) + schatten(T, 58.6, -6, 4.6, 1, 0, 0.55) +
      /* Caputegulae: polygonale Hornschuppen auf Schädeldach und Schnauze */
      (F ? (() => {
        let d = "";
        for (const [x, y, g] of [[54.4, -11.6, 1], [55.9, -11.9, 1.1], [57.5, -11.9, 1.1], [59.1, -11.6, 1], [60.6, -11, 0.9], [61.9, -10.1, 0.8],
          [62.7, -9, 0.7], [55, -10.3, 0.9], [56.5, -10.6, 0.9], [60.2, -9.8, 0.8], [61.5, -8.8, 0.7], [62.4, -7.8, 0.6]]) {
          const j = () => (T.rnd() - 0.5) * 0.3 * g, n = 5 + Math.floor(T.rnd() * 2);
          d += Array.from({ length: n }, (_, i) => { const w = i / n * Math.PI * 2 + T.rnd() * 0.4; return `${i ? "L" : "M"}${r(x + Math.cos(w) * 0.7 * g + j())} ${r(y + Math.sin(w) * 0.5 * g + j())}`; }).join("") + "Z";
        }
        return `<path d="${d}" fill="#7e6a48" fill-opacity=".45" stroke="#1a130a" stroke-width=".06" stroke-opacity=".5" stroke-linejoin="round"/>`;
      })() : "") +
      teilInnen(T, [[62.2, -8.6], [63.3, -8.4], [63.4, -7.4], [62.8, -6.2, 1], [61.8, -6.3], [61.6, -7.5]], T.lg("schnabel", [[0, "#6a604c"], [0.5, "#3a3328"], [1, "#1e1a14"]])) +
      falten(T, [[[61.8, -6.9], [59.4, -7], [57, -7.3]], [[57.4, -10.4], [58.8, -10.8], [60.2, -10.4]]], "#120e08", 0.12, 0.55) +
      schatten(T, 58.8, -9.6, 0.8, 0.6, 0, 0.55),
    randA: 0.45, randSzene: true,
  });
  /* Hörner: Squamosalhorn hinten oben nach hinten, Quadratojugalhorn an der Wange nach unten-hinten */
  const hornF = T.lg("horn", [[0, "#3e3222"], [0.5, "#9c8768"], [1, "#c9b894"]], 1, 1, 0, 0);
  h += teil(T, [[55.4, -12.4], [53.4, -13], [52, -13.4, 1], [53.2, -12], [54.6, -11.2], [56, -11.4]], hornF, { vol: false, randA: 0.5, rw: 0.08 });
  h += teil(T, [[55, -7.6], [54.4, -5.6], [54.2, -4.6, 1], [55.6, -5.4], [56.8, -6.6]], hornF, { vol: false, randA: 0.5, rw: 0.08 });
  s += h;
  s += T.augeReal ? T.augeReal(58.8, -9.6, 0.3, { iris: "#8a5a22", iris2: "#3a220a", offen: 0.6, lid: "#1d160d", winkel: -6 }) : T.auge(58.8, -9.6, 0.28, "#6b4a1c");
  s += `<ellipse cx="62.6" cy="-8.8" rx=".3" ry=".22" fill="#120e09"/>`;
  const k = 11, box = [2.2, -17.4, 63.4, 0];
  return { svg: DM(s, k), box: box.map((v) => Math.round(v * k)) };
}

/* =====================================================================
   PARASAUROLOPHUS
   RECHERCHE: Parasaurolophus walkeri (u. a.), Oberkreide (Campan, Dinosaur
   Park Formation, Kanada; Kirtland/Fruitland, USA), ~76–73 Mio. Jahre.
   Hadrosaurier (Entenschnabelsaurier, Lambeosaurinae). Typusexemplar ~9,5 m
   lang, ~2,5 t+. Schädel mit Kamm ~1,6 m; langer, hohler, RÖHRENFÖRMIGER
   Knochenkamm nach hinten (bis ~1–1,8 m), innen Luftröhren von den Nasen-
   löchern bis zur Kammspitze und zurück (Resonanzrohr: tiefe Rufe).
   Breiter, flacher Hornschnabel (Entenschnabel), dahinter Hunderte Backen-
   zähne (Zahnbatterien). Geht auf zwei oder vier Beinen: frisst meist
   vierbeinig, läuft zweibeinig. Hohe Dornfortsätze über der Hüfte → Rücken
   dort am höchsten; tiefer, seitlich flacher Schwanz, durch verknöcherte
   Sehnen steif und waagerecht getragen. Vorderbeine schlank (beim
   Parasaurolophus relativ kurz), Finger zu einem „Fäustling" mit Hufen
   verbunden; Füße mit drei Zehen und Hufen. Haut (P. walkeri): gleichmäßige
   kleine Höckerschuppen (Tuberkel), keine großen Strukturen. Farbe
   unbekannt → Oliv-/Braun mit dunklen Querbändern, heller Bauch, Kamm als
   mögliches Signal etwas kräftiger gefärbt.
   ===================================================================== */
function parasaurolophus(T) {
  const F = T.fein;
  const haut = T.lg("haut", [[0, "#4b3f27"], [0.35, "#6a5a39"], [0.72, "#85744e"], [1, "#706245"]]);
  const fern = T.lg("fern", [[0, "#463b26", 0], [0.3, "#463b26", 0.9], [0.5, "#3a3020"], [1, "#241d12"]]);
  const nahB = T.lg("bein", [[0, "#6a5a3a", 0], [0.3, "#6a5a3a", 0.6], [0.55, "#5e4f33"], [0.8, "#4a3e2a"], [1, "#30281b"]]);
  const kamm = T.lg("kamm", [[0, "#a8653a"], [0.5, "#80462a"], [1, "#4e2c18"]], 0, 0, 0.3, 1);
  let s = "", h = "";

  /* Beine: Hinterbein kräftig (Knie vorn, Ferse hinten, drei Hufzehen), Vorderbein schlank mit Huf-„Fäustling" */
  const HB = [[31.6, -28], [30.8, -20], [33, -14], [36.4, -9.6], [37.6, -5.8], [37, -2.8], [36.4, -0.9], [37, 0, 1], [46.6, 0, 1],
    [47, -1], [44.6, -2], [42, -2.8], [41.6, -5.4], [43.2, -9.8], [46.6, -13.6], [48, -19.6], [46.4, -28]];
  const VB = [[56.8, -21], [56, -15], [56.6, -10.6], [58, -7], [59, -3.2], [58.8, -1.1], [59.2, 0, 1], [63, 0, 1], [63.2, -1.1],
    [62.2, -2.4], [61.4, -5.6], [61, -10], [62, -14.6], [62.6, -21]];
  const hbF = boden(dreh(HB, 40, -22, -12, 4)), vbF = boden(dreh(VB, 59.6, -18, 12, -2.6));
  const zehen = (x, b, n, farbe) => naegel(Array.from({ length: n }, (_, i) => [x + i * b * 1.02, 0, b, b * 0.55]), farbe);
  h += fernBein(T, hbF, fern, { randAb: 0.5 }) + fernBein(T, vbF, fern, { randAb: 0.5 });
  h += zehen(hbF[7][0] + 3.6, 1.9, 3, "#3e3424") + zehen(vbF[6][0] + 0.4, 1.4, 2, "#3e3424");

  /* Rumpf (tief), Schwanz (hoch, seitlich flach, waagerecht steif), Hals kurz und S-förmig: EIN Umriss */
  const RUECKEN = [[0, -21.4], [6, -23], [14, -25.2], [22, -27.4], [30, -29], [37, -29.6], [43, -29], [49, -27.4], [54, -25.6], [58, -24.2],
    [62, -24.4], [65.6, -25.6], [68.4, -26.6], [71, -27.4]];
  const R = [...RUECKEN, [73.2, -25.4], [71.8, -22.8], [69.6, -19.6], [66.8, -16.4], [63.4, -13], [59.6, -10.8], [52, -10], [45, -10.8], [39, -13.2],
    [34, -15], [30, -16.6], [24, -18], [16, -18.8], [8, -19.6], [1.6, -20.2]];
  const unten = [[0, -20.6], [8, -19.6], [16, -18.8], [24, -18], [30, -16.6], [34, -15], [39, -13.2], [45, -10.8], [52, -10], [59.6, -10.8], [64, -13.6]];
  /* Querbänder: verjüngt, leicht nach hinten geneigt, folgen der Rundung */
  const baender = () => {
    let d = "";
    for (const [x, b] of [[5, 1.4], [10, 1.8], [15.6, 2.1], [21.4, 2.3], [27.4, 2.5], [33.6, 2.6], [40, 2.6], [46.2, 2.4], [52, 2.1], [57.2, 1.8], [62.4, 1.5], [66.4, 1.2]]) {
      const yo = yBei(RUECKEN, x) - 0.6, yu = yBei(unten, x), L = (yu - yo) * (x > 30 && x < 56 ? 0.48 : 0.62);
      d += T.glatt([[x - b * 0.55, yo], [x + b * 0.55, yo], [x + b * 0.3 - L * 0.06, yo + L * 0.55], [x - b * 0.05 - L * 0.12, yo + L], [x - b * 0.45 - L * 0.08, yo + L * 0.5]]);
    }
    return `<path d="${d}" fill="#24190c" opacity=".36"/>`;
  };
  h += teil(T, R, haut, {
    innen:
      baender() +
      fl(T, [[34, -16.4], [44, -10.2], [58, -9.6], [66, -13], [71, -19], [73, -25], [70, -22], [64, -16.4], [56, -13.6], [44, -14.6]], "#d2c096", 0.32) +
      fl(T, [[30, -20.6], [40, -17.6], [50, -15], [60, -14.4], [68, -16], [70, -8], [30, -8]], "#120d06", 0.24) +
      fl(T, [[1, -20.8], [10, -20.2], [20, -19.6], [30, -19.4], [35, -17.8], [26, -18.8], [16, -19.4], [6, -20.4]], "#120d06", 0.3) +
      falten(T, [[[4, -22.6], [14, -24.8], [26, -27.8], [38, -29], [50, -26.6], [58, -24], [64, -24.8], [68.6, -27.6]]], "#f4e6c4", 0.7, 0.16) +
      /* Muskeln: Schwanzwurzel (Caudofemoralis), Rippen, Schulter, Halsmuskeln */
      licht(T, 24, -24, 10, 3, -12, 0.5) + licht(T, 47, -21, 9, 5, -10, 0.45) + licht(T, 59.6, -19.6, 3.6, 2.8, -20, 0.4) +
      licht(T, 67, -22.6, 3.6, 1.6, -52, 0.4) + schatten(T, 33, -19.6, 6, 2.2, -20, 0.35) + schatten(T, 70.6, -24.4, 1.2, 2.6, -30, 0.4) +
      schuppenFeld(T, RUECKEN.slice(0, 11), unten, 2, 64, 11, (x, t) => 0.3 + 0.2 * Math.sin(Math.PI * t), { opD: 0.38, opH: 0.22 }) +
      schuppenFeld(T, [[60, -24.4], [64, -25.4], [68, -27.2], [71, -28.6]], [[60, -11], [64, -13.4], [68, -17.4], [71, -21]], 60, 72, 7, () => 0.26, { opD: 0.35, opH: 0.2 }) +
      falten(T, [[[30, -20.6], [33, -17.8], [36, -15.6]], [[55.6, -16.4], [56.4, -13.4], [58.4, -11.6]], [[62.6, -15], [65, -16.4], [66.6, -19]],
        [[65, -14.4], [67.6, -16.2], [69.2, -19]], [[68.4, -19.8], [70.2, -22.6]], [[18, -19.6], [21, -22.2]]], "#15110a", 0.13, 0.5),
    randA: 0.45, randSzene: true,
  });

  /* nahes Hinterbein: mächtiger Oberschenkel, Knie, Unterschenkel nach hinten, Mittelfuß nach vorn */
  h += teil(T, HB, nahB, {
    vol: false, randAb: 0.45, randA: 0.4,
    innen: licht(T, 39.6, -20, 6, 5.4, -10, 0.55) + licht(T, 46, -13.6, 1.6, 1.4, 0, 0.4) + schatten(T, 33.6, -12, 1.8, 5.4, -20, 0.5) +
      schatten(T, 42, -1.2, 5.4, 1.2, 0, 0.35) +
      schuppenFeld(T, [[31, -26], [48, -26]], [[31, -3], [48, -3]], 31, 48, 9, () => 0.4, { opD: 0.35, opH: 0.2 }) +
      falten(T, [[[34, -13], [38.6, -11.2], [44.6, -12.2]], [[38, -6.2], [40, -5.4], [42, -5.6]], [[37.6, -3.4], [40.2, -2.8], [43, -3]],
        [[46.6, -14.8], [44.2, -16.8], [42.6, -19.6]], [[40.6, -1.8], [40.8, -0.2]], [[43.2, -1.8], [43.4, -0.2]]], "#16120b", 0.13, 0.55) +
      falten(T, [[[38.4, -28], [43, -21], [46.8, -15]]], "#120e06", 0.45, 0.2),
  });
  h += zehen(38.8, 2.4, 3, "#43382a");
  /* nahes Vorderbein (schlank, Ellbogen hinten, Fäustling mit Huf) */
  h += teil(T, VB, nahB, {
    vol: false, randAb: 0.4, randA: 0.4,
    innen: licht(T, 59.4, -16.6, 3, 3.4, -10, 0.5) + schatten(T, 57.2, -7.6, 1.2, 3.8, -14, 0.45) +
      schuppenFeld(T, [[55, -20], [63, -20]], [[55, -2], [63, -2]], 55, 63, 8, () => 0.3, { opD: 0.35, opH: 0.2 }) +
      falten(T, [[[56.6, -10.8], [58.8, -10.2], [61.4, -10.8]], [[58.8, -3.4], [60.6, -3], [62.2, -3.4]]], "#16120b", 0.13, 0.55),
  });
  h += zehen(59.6, 1.7, 2, "#43382a");

  /* Kopf + Kamm als EIN Umriss: das Schnauzenprofil steigt in den Röhrenkamm über, der weit über den Hinterkopf
     hinausragt; breiter flacher Entenschnabel */
  const K = [[81.6, -23], [81, -24.6], [79.6, -26.2], [77.8, -27.8], [75.6, -29.8], [72.6, -32], [69.4, -33.6], [67.2, -34.4], [66, -34.3, 1],
    [66.4, -33.4], [68.8, -32.2], [71.2, -30.8], [72, -29.6], [71.2, -28], [71.2, -26.2], [72.4, -24.4], [75.4, -22.8], [78.8, -22], [81, -22.2]];
  h += teil(T, K, T.lg("kopf", [[0, "#7a6a48"], [0.6, "#7e6e4c"], [1, "#54472e"]]), {
    innen:
      /* Kamm farbig (mögliches Signal), Röhrenwulst mit Licht oben und Schatten unten */
      fl(T, [[65, -35], [70, -34.4], [74.6, -31.4], [76.2, -29.4], [74.6, -29.2], [72.6, -29.8], [70, -31], [66, -33]], kamm, 1) +
      licht(T, 71, -32.6, 5, 0.7, -26, 0.6) + schatten(T, 70.4, -31.4, 5, 0.6, -28, 0.45) +
      falten(T, [[[75.6, -29.6], [71.6, -32], [67.4, -33.8]]], "#2a1408", 0.12, 0.45) +
      licht(T, 76, -27, 3, 1.1, -26, 0.5) + schatten(T, 76.6, -23, 4, 0.9, -16, 0.5) + licht(T, 74.6, -25, 2, 1, -20, 0.3) +
      schuppenFeld(T, [[66, -34.4], [72, -32], [78, -27.6], [82, -24.4]], [[66, -33], [72, -28], [78, -23], [82, -22.4]], 66, 81, 6, () => 0.2, { opD: 0.35, opH: 0.2 }) +
      /* Hornschnabel (Entenschnabel), Maulspalte bis unter das Auge, Wange über der Zahnbatterie */
      teilInnen(T, [[78.2, -26.6], [80, -25.6], [81, -24.6], [81.6, -23], [81, -22.4], [79.2, -22.6], [78.4, -23.6], [77.8, -25.2]], T.lg("schnabel", [[0, "#7a6e5a"], [0.5, "#4e4536"], [1, "#2a241c"]])) +
      falten(T, [[[78.6, -23.4], [76.4, -24], [74.4, -24.8]], [[79.2, -26], [80.8, -24.4]], [[72.4, -26.4], [73.4, -24.6], [75, -23.6]]], "#120e08", 0.12, 0.55) +
      falten(T, [[[79.4, -26.2], [80.9, -24.6]]], "#fff", 0.12, 0.45) + schatten(T, 74.8, -27.2, 0.9, 0.6, 0, 0.5),
    randA: 0.45, randSzene: true,
  });
  s += h;
  s += T.augeReal ? T.augeReal(74.8, -27.2, 0.36, { iris: "#a66e28", iris2: "#46280c", offen: 0.66, lid: "#1d160d", winkel: -26 }) : T.auge(74.8, -27.2, 0.32, "#6b4a1c");
  s += `<ellipse cx="79.4" cy="-25.4" rx=".6" ry=".2" fill="#120e09" transform="rotate(-36 79.4 -25.4)"/>`;
  const k = 11.4, box = [0, -34.4, 81.6, 0];
  return { svg: DM(s, k), box: box.map((v) => Math.round(v * k)) };
}

/* Sauropoden-Fuß: säulenartig, Ballen; vorn nur Daumenkralle, hinten drei große Krallen (Klauen nach vorn-innen) */
function krallen(T, liste, farbe) {
  const d = liste.map(([x, y, l, h]) => `M${r(x)} ${r(y)}c${r(l * 0.4)} ${r(-h * 0.2)} ${r(l * 0.9)} ${r(h * 0.1)} ${r(l)} ${r(h * 0.75)}c${r(-l * 0.35)} ${r(-h * 0.25)} ${r(-l * 0.75)} ${r(-h * 0.25)} ${r(-l)} ${r(-h * 0.2)}z`).join("");
  return `<path d="${d}" fill="${farbe}" stroke="#120d08" stroke-width=".12" stroke-opacity=".7"/>`;
}

/* =====================================================================
   BRACHIOSAURUS
   RECHERCHE: Brachiosaurus altithorax, Oberjura (Kimmeridge–Tithon, Morrison-
   Formation, Nordamerika), ~154–150 Mio. Jahre. 18–22 m lang (Holotyp
   subadult), 28–47 t; konnte den Kopf ~12–13 m hoch tragen. VORDERBEINE
   LÄNGER als die Hinterbeine (Oberarm 2,04 m ≈ Oberschenkel 2,03 m, dazu
   lange Mittelhand) → Rumpf steil nach vorn ansteigend, Schulter deutlich
   höher als die Hüfte; Hals tritt steil aus dem Rumpf (einer der wenigen
   Sauropoden mit hoch erhobenem Hals, Taylor 2009). Schwanz verhältnismäßig
   kurz, frei getragen. Kopf mit Knochenbogen (Nasenkuppel) über den großen
   Nasenöffnungen vor den Augen, breite Schnauze, spatelförmige Zähne.
   Säulenbeine; Hand röhrenförmig mit nur EINER Kralle (Daumen), Fuß mit drei
   großen Krallen, die übrigen Zehen in der Haut verborgen. Haut: Runzeln vor
   allem um Schulter und Hüfte, kleine Höckerschuppen. Farbe unbekannt →
   graugrün/graubraun wie große Pflanzenfresser heute, Rücken dunkler.
   ===================================================================== */
function brachiosaurus(T) {
  const F = T.fein;
  const haut = T.lg("haut", [[0, "#464a38"], [0.35, "#5f6449"], [0.75, "#767a5c"], [1, "#6a6c52"]]);
  const fern = T.lg("fern", [[0, "#40432f", 0], [0.12, "#40432f", 1], [0.5, "#363927"], [1, "#22241a"]]);
  const nahB = T.lg("bein", [[0, "#62664a", 0], [0.12, "#62664a", 1], [0.55, "#595c42"], [0.8, "#4a4c36"], [1, "#303224"]]);
  let s = "", h = "";

  /* Beine: vorn lang (Ellbogen hinten, röhrenförmige Hand), hinten kürzer (Knie vorn) */
  const HB = [[76, -46], [73.4, -38.6], [72.8, -30], [75.8, -22], [77, -14], [76.6, -6], [75.6, -1.6], [76.2, 0, 1], [90.4, 0, 1], [90.8, -1.4],
    [87.4, -3.2], [85.6, -6.4], [86, -14], [88, -24], [90, -34], [90.4, -44], [86, -50]];
  const VB = [[120.6, -62], [119.6, -50], [120.4, -38], [122, -27], [123.6, -15], [123.8, -6], [123.2, -1.4], [123.8, 0, 1], [133, 0, 1],
    [133.4, -1.4], [132, -4], [131.6, -10], [132, -20], [133.4, -32], [135, -46], [134.6, -60]];
  const hbF = boden(dreh(HB, 80, -44, -8, 7)), vbF = boden(dreh(VB, 128, -56, 7, -6));
  h += fernBein(T, hbF, fern, { randAb: 0.4 }) + fernBein(T, vbF, fern, { randAb: 0.4 });
  h += krallen(T, [[hbF[8][0] - 3.4, -1.6, 3.4, 1.6], [hbF[8][0] - 6.6, -1.4, 3.2, 1.4]], "#2a2418");

  /* Rumpf (steil ansteigend) + kurzer Schwanz + steil erhobener Hals: EIN Umriss */
  const RUECKEN = [[12, -38.4], [18, -40.4], [28, -44], [42, -48.6], [58, -52.8], [72, -55.6], [82, -56.8], [94, -59], [106, -62.2], [118, -65.8],
    [128, -69], [134, -71]];
  const R = [...RUECKEN, [142, -75.4], [152, -82.4], [162, -90.6], [172, -99.4], [180, -107], [185.6, -112.6], [188.6, -116.4],
    [191, -111], [186.4, -105.4], [178.4, -96.6], [168.4, -85.6], [158.6, -73.4], [150.6, -61.6], [144.6, -50.4], [139.6, -42.6], [132, -37.6],
    [120, -33.6], [108, -31.4], [96, -32.2], [88, -34.4], [82, -37], [76, -40], [68, -42.2], [58, -42.4], [48, -40.6], [34, -38], [24, -36.4], [16, -36.6], [12.6, -37.2]];
  const HALS_O = [[134, -71], [142, -75.4], [152, -82.4], [162, -90.6], [172, -99.4], [180, -107], [186, -112.6]];
  const HALS_U = [[144.6, -50.4], [150.6, -61.6], [158.6, -73.4], [168.4, -85.6], [178.4, -96.6], [186.4, -105.4], [191, -111]];
  /* Querfalten an der Halsunterseite: entlang der Unterkante, quer zur Halsachse */
  const halsFalten = () => {
    const l = [];
    for (let i = 0; i < 16; i++) {
      const t = 0.06 + i / 17, a = HALS_U[Math.floor(t * 6)], b2 = HALS_U[Math.min(6, Math.floor(t * 6) + 1)], u = t * 6 - Math.floor(t * 6);
      const x = a[0] + (b2[0] - a[0]) * u, y = a[1] + (b2[1] - a[1]) * u;
      l.push([[x - 1.6, y - 1.2], [x - 0.6, y - 3.4], [x + 0.6, y - 5]]);
    }
    return falten(T, l, "#1a1a10", 0.22, 0.32);
  };
  h += teil(T, R, haut, {
    innen:
      /* Rücken und Halsoberseite dunkler mit großen Flecken, Bauch/Kehle heller */
      fl(T, [[12, -39], [30, -45.6], [70, -57], [100, -61.6], [134, -72.4], [160, -90.4], [188, -117.4], [186, -110], [168, -92.4], [150, -77.6],
        [134, -66], [110, -57], [86, -51.6], [60, -48.4], [30, -40.6], [14, -38]], "#22251a", 0.42) +
      (F ? tupfen(T, 22, 40, -62, 140, -54, 2.2, "#262a1c", 0.14) : "") +
      fl(T, [[86, -37.4], [100, -31], [124, -32], [140, -40.6], [150, -58], [166, -80], [184, -101], [190, -110], [184, -104], [164, -82], [146, -60],
        [132, -42], [112, -38], [96, -38.6]], "#c7c39e", 0.3) +
      /* Kernschatten unten, unter dem Schwanz */
      fl(T, [[80, -44], [100, -38], [120, -38.6], [138, -44.6], [140, -30], [80, -30]], "#0f1008", 0.26) +
      fl(T, [[13, -37.4], [24, -37.2], [40, -39.4], [62, -43.4], [76, -42.6], [60, -41.6], [40, -38.6], [24, -36.6]], "#0f1008", 0.3) +
      falten(T, [[[16, -39.6], [40, -46.6], [72, -54.6], [100, -59.4], [130, -68.4], [150, -79.6], [170, -96], [184, -110]]], "#f2efd2", 1.2, 0.14) +
      /* Muskeln: Schwanzwurzel, Rumpf, mächtige Schulter, Halsansatz */
      licht(T, 50, -46, 18, 3.4, -16, 0.45) + licht(T, 104, -52, 20, 8, -10, 0.45) + licht(T, 128, -58, 9, 7, -14, 0.45) +
      licht(T, 156, -76, 12, 3, -50, 0.4) + licht(T, 172, -96, 10, 2.4, -48, 0.35) + schatten(T, 80, -40, 10, 3, -10, 0.35) +
      halsFalten() +
      /* Achselfalte hinter dem Vorderbein, Bauchfalte, Flankenfalten */
      falten(T, [[[118, -36], [116, -40], [116.6, -46], [119, -52]], [[92, -33.6], [104, -31.6], [116, -32.4]], [[100, -40], [106, -45], [110, -52]],
        [[88, -40], [93, -46], [96, -54]]], "#14150c", 0.3, 0.3) +
      falten(T, [[[20, -40.2], [50, -50], [80, -56.2], [110, -62.6], [134, -70.4], [160, -88.6], [184, -112]]], "#f6f4dc", 0.5, 0.22) +
      /* Runzeln an Schulter und Hüfte (laut Abdrücken dort am stärksten) */
      falten(T, [[[120, -42], [124, -38.6], [128, -36.6]], [[118, -46], [123, -42.6], [128, -41]], [[136, -44], [138.6, -40], [139.4, -36.6]],
        [[70, -46], [72.6, -42.6], [76, -40]], [[66, -44], [69, -41]], [[88, -36.6], [92, -34.4], [96, -33.6]], [[142, -56], [146, -60], [148, -64.6]],
        [[144, -62], [149, -66], [152, -70.6]]], "#16170e", 0.2, 0.42) +
      /* große Höckerschuppen nur angedeutet (bei 20 m Länge sind Einzelschuppen kleiner als ein Bildpunkt) */
      (F ? tupfen(T, 90, 30, -66, 150, -36, 0.5, "#8e9070", 0.18) : ""),
    randA: 0.45, randSzene: true, rw: 0.16,
  });

  /* nahes Hinterbein: Oberschenkel, Knie, Säulenbein mit Hautringen, drei Krallen */
  h += teil(T, HB, nahB, {
    vol: false, randAb: 0.4, randA: 0.4, rw: 0.16,
    innen: licht(T, 81, -36, 6, 8, -6, 0.3) + licht(T, 86.6, -24, 2.6, 2.4, 0, 0.35) + schatten(T, 73, -24, 2.6, 10, -10, 0.5) +
      schatten(T, 83, -2, 8, 2, 0, 0.35) +
      falten(T, [[[73.6, -27], [79.6, -25.4], [87.4, -26.4]], [[76, -15], [80.6, -14], [85.6, -14.6]], [[76.4, -11], [80.6, -10.2], [85.4, -10.8]],
        [[76.4, -7], [81, -6.4], [85.6, -7]], [[76.2, -3.6], [81.4, -3], [87, -3.6]], [[88.6, -26], [85.6, -30], [83, -36]],
        [[79.6, -20], [79.2, -14], [79.6, -8]], [[83.4, -19], [83.6, -12], [83.2, -6]]], "#16170e", 0.2, 0.45) +
      (F ? tupfen(T, 40, 72, -40, 90, -2, 0.35, "#8e9272", 0.2) : ""),
  });
  h += krallen(T, [[86.2, -1.8, 4.2, 1.8], [82.4, -1.6, 3.8, 1.6], [78.8, -1.2, 3.2, 1.2]], "#3a3324");
  /* nahes Vorderbein: langer Oberarm, Ellbogen hinten, röhrenförmige Hand mit Daumenkralle */
  h += teil(T, VB, nahB, {
    vol: false, randAb: 0.35, randA: 0.4, rw: 0.16,
    innen: licht(T, 128, -50, 5, 6, -6, 0.32) + licht(T, 126.4, -30, 2.6, 3, 0, 0.35) + schatten(T, 121.6, -30, 2, 9, -6, 0.5) +
      schatten(T, 128.6, -2, 6, 2, 0, 0.35) +
      falten(T, [[[121, -38], [126, -36.6], [132.4, -38]], [[123.4, -15], [127.6, -14.4], [131.6, -15]], [[123.6, -10.4], [127.6, -9.8], [131.6, -10.4]],
        [[123.6, -6], [127.6, -5.4], [131.8, -6]], [[123.4, -3], [128, -2.6], [132.6, -3]], [[126.4, -24], [126.8, -16], [126.4, -8]],
        [[129.6, -26], [129.4, -18], [129.8, -10]]], "#16170e", 0.2, 0.45) +
      (F ? tupfen(T, 40, 120, -56, 134, -2, 0.35, "#8e9272", 0.2) : ""),
  });
  h += krallen(T, [[131.6, -2.4, 3.2, 2]], "#3a3324");

  /* Kopf: hohe Nasenkuppel (Knochenbogen) über und vor den Augen, lange breite Schnauze; Hals setzt hinten unten an */
  const K = [[184, -118.6], [186.4, -121.6], [188.4, -123.8], [190, -124.4], [191.6, -123.4], [193, -120.8], [195.4, -119.2], [198, -118],
    [199.6, -116.6], [199.6, -115], [198.2, -114], [193.6, -113.3], [189.6, -113.5], [186.6, -114.5], [184.6, -116]];
  h += teil(T, K, T.lg("kopf", [[0, "#74775c"], [0.55, "#6a6d52"], [1, "#4a4c38"]]), {
    innen: licht(T, 189.6, -122.6, 2, 1.4, -10, 0.6) + licht(T, 195.6, -118.2, 3, 0.9, -14, 0.45) + schatten(T, 192, -113.8, 6, 0.9, 0, 0.5) +
      schatten(T, 192.4, -121, 1.2, 1.6, -20, 0.4) + schatten(T, 186, -116.6, 1.6, 1.8, 0, 0.35) +
      falten(T, [[[199.2, -114.8], [195.4, -114.7], [191.6, -114.9], [189.4, -115.4]], [[185.6, -119.4], [186.8, -117.4], [186.4, -115.4]],
        [[188.6, -123.2], [190.8, -122.8], [192.4, -121.4]], [[190.6, -120.6], [192.2, -119.8]]], "#141410", 0.14, 0.5) +
      (F ? `<path d="M198.8 -114.9l.06 .32M198 -114.85l.06 .34M197.2 -114.8l.06 .34" stroke="#d8d0b0" stroke-width=".18" stroke-linecap="round" stroke-opacity=".45"/>` : "") +
      (F ? tupfen(T, 30, 184, -124, 199, -114, 0.22, "#9a9c7c", 0.25) : "") +
      schatten(T, 187.6, -119.4, 1.1, 0.8, 0, 0.5),
    randA: 0.45, randSzene: true,
  });
  s += h;
  /* Nasenloch: fleischige Öffnung vorn-unten an der Schnauze (Witmer 2001), darüber der Knochenbogen */
  s += `<ellipse cx="196.6" cy="-117.6" rx=".55" ry=".3" fill="#11120c" transform="rotate(-20 196.6 -117.6)"/>`;
  s += T.augeReal ? T.augeReal(187.6, -119.4, 0.6, { iris: "#9a6a26", iris2: "#3e240c", offen: 0.62, lid: "#1d160d", winkel: -8 }) : T.auge(187.6, -119.4, 0.55, "#6b4a1c");
  const k = 10.8, box = [12, -124.4, 199.6, 0];
  return { svg: DM(s, k), box: box.map((v) => Math.round(v * k)) };
}

/* =====================================================================
   DIPLODOCUS
   RECHERCHE: Diplodocus carnegii/D. hallorum, Oberjura (Morrison-Formation),
   ~154–152 Mio. Jahre. D. carnegii 24–26 m (eines der längsten vollständigen
   Skelette), 12–15 t; D. hallorum noch länger. Vorderbeine etwas KÜRZER als
   die Hinterbeine → Rücken fast waagerecht, höchster Punkt über der Hüfte;
   Hals lang (~6–7 m) und eher WAAGERECHT getragen (Bänder trugen ihn ohne
   Muskelkraft), leicht über die Rückenlinie gehoben. Schwanz extrem lang
   (~80 Wirbel) mit dünner PEITSCHE am Ende, frei in der Luft getragen. Kleiner,
   langer, flacher Kopf, Nasenöffnung weit oben zwischen den Augen, stiftförmige
   Zähne nur vorn im Maul. Reihe kleiner Hornstacheln auf der Rückenmitte
   (Czerkas 1992, Hautfunde). Säulenbeine; Hand mit Daumenkralle, Fuß mit drei
   Krallen. Farbe unbekannt → warmes Graubraun, Rücken dunkler, Bänder an
   Hals und Schwanz, heller Bauch.
   ===================================================================== */
function diplodocus(T) {
  const F = T.fein;
  const haut = T.lg("haut", [[0, "#4a3c2b"], [0.35, "#6a5841"], [0.75, "#86735a"], [1, "#776650"]]);
  const fern = T.lg("fern", [[0, "#463826", 0], [0.12, "#463826", 1], [0.5, "#3a2e20"], [1, "#231b12"]]);
  const nahB = T.lg("bein", [[0, "#6a5840", 0], [0.12, "#6a5840", 1], [0.55, "#5e4e38"], [0.8, "#4c3f2e"], [1, "#30271c"]]);
  let s = "", h = "";

  const HB = [[116.6, -38], [114.8, -30], [116.6, -22], [119.6, -15], [120.4, -8], [119.8, -3], [118.8, -1], [119.4, 0, 1], [131.6, 0, 1],
    [132, -1.2], [129, -2.8], [127.6, -5.6], [128.2, -13], [130.2, -21], [132.2, -30], [131.4, -40]];
  const VB = [[166.4, -32], [165.6, -24], [166.4, -16], [167.8, -8], [167.4, -2.4], [166.8, -0.8], [167.2, 0, 1], [175, 0, 1], [175.4, -1.2],
    [174.2, -3], [173.8, -8], [174.6, -16], [176.2, -24], [176.8, -33]];
  const hbF = boden(dreh(HB, 124, -32, -8, 6)), vbF = boden(dreh(VB, 171, -28, 8, -5));
  h += fernBein(T, hbF, fern, { randAb: 0.4 }) + fernBein(T, vbF, fern, { randAb: 0.4 });
  h += krallen(T, [[hbF[8][0] - 3.2, -1.4, 3.2, 1.5], [hbF[8][0] - 6.2, -1.2, 3, 1.3]], "#2a2418");

  /* Rumpf + Peitschenschwanz + waagerechter Hals: EIN Umriss */
  const RUECKEN = [[0, -27.4], [20, -29.2], [40, -31.6], [60, -34.4], [80, -37.6], [100, -40.8], [114, -42.6], [122, -43.2], [134, -42.6],
    [146, -40.4], [158, -37.8], [168, -36.2], [176, -36.4], [190, -38], [206, -40], [222, -42], [236, -43.4], [246, -44]];
  const R = [...RUECKEN, [248.4, -40.6], [238, -38.6], [222, -36.2], [206, -33.6], [192, -30.2], [182, -25.8], [174, -21.6], [160, -19.6],
    [146, -20.4], [134, -22.4], [124, -24.6], [114, -26], [104, -28], [92, -30.2], [80, -31.6], [60, -31.4], [40, -30.2], [20, -28.6], [1, -27]];
  const UNTEN = [[0, -27], [20, -28.6], [40, -30.2], [60, -31.4], [80, -31.6], [92, -30.2], [104, -28], [114, -26], [124, -24.6], [134, -22.4],
    [146, -20.4], [160, -19.6], [174, -21.6], [182, -25.8], [192, -30.2], [206, -33.6], [222, -36.2], [238, -38.6], [248, -40.6]];
  /* Querbänder an Hals und Schwanz, folgen der Rundung */
  const baender = () => {
    let d = "";
    for (const x of [30, 44, 58, 72, 86, 99, 196, 208, 220, 232]) {
      const yo = yBei(RUECKEN, x) - 0.5, yu = yBei(UNTEN, x), L = (yu - yo) * 0.7, b2 = x < 120 ? 3 + x * 0.02 : 3.4;
      d += T.glatt([[x - b2 * 0.5, yo], [x + b2 * 0.5, yo], [x + b2 * 0.25 - L * 0.1, yo + L * 0.6], [x - L * 0.18, yo + L], [x - b2 * 0.45 - L * 0.1, yo + L * 0.5]]);
    }
    return `<path d="${d}" fill="#2a1e10" opacity=".3"/>`;
  };
  h += teil(T, R, haut, {
    innen:
      baender() +
      fl(T, [[0, -28], [60, -35.4], [122, -44.4], [168, -37.4], [246, -45], [246, -42.6], [206, -38.6], [176, -34.4], [150, -36], [122, -38.6],
        [90, -35.6], [60, -32.8], [20, -28.6]], "#2a2014", 0.42) +
      fl(T, [[120, -26], [140, -20], [170, -20.4], [184, -26.4], [206, -34.4], [248, -40.6], [222, -38], [196, -33.6], [176, -26.6], [150, -24], [130, -26.4]], "#d4c29c", 0.3) +
      fl(T, [[116, -30], [140, -25.6], [166, -25.4], [182, -29], [184, -18], [116, -18]], "#100c06", 0.26) +
      fl(T, [[2, -27.2], [40, -30.6], [80, -32.4], [104, -30.2], [118, -27.4], [100, -29.8], [80, -31.8], [40, -30], [2, -26.8]], "#100c06", 0.3) +
      falten(T, [[[10, -28.4], [60, -34.8], [100, -40.2], [122, -42.4], [150, -39.4], [176, -35.6], [210, -39.6], [244, -43.2]]], "#f6ead0", 0.9, 0.14) +
      /* Muskeln: Schwanzwurzel (Caudofemoralis), Rumpf, Schulter, Halsansatz */
      licht(T, 100, -36, 18, 3, -8, 0.5) + licht(T, 146, -32, 18, 6, -4, 0.45) + licht(T, 174, -30, 7, 4, -6, 0.4) +
      licht(T, 200, -36, 14, 2, -8, 0.35) + schatten(T, 120, -28, 8, 3, -6, 0.35) +
      (F ? tupfen(T, 110, 70, -42, 240, -24, 0.4, "#a8957a", 0.16) : "") +
      falten(T, [[[110, -31], [114, -28.6], [118, -27]], [[162, -24], [166, -22.4], [170, -22]], [[178, -26.6], [182, -28.4], [184, -31]],
        [[184, -29], [188, -31], [190, -33.6]], [[192, -31.2], [195, -33.2], [196.6, -35.4]], [[200, -33], [203, -34.8], [204, -37]]], "#16120b", 0.2, 0.4),
    randA: 0.45, randSzene: true, rw: 0.16,
  });
  /* Hornstacheln auf der Rückenmitte (Czerkas 1992): an der Schwanzwurzel am größten */
  h += (() => {
    let d = "";
    for (let x = 36; x < 236; x += (x < 130 ? 3 : 4.2) + T.rnd() * 0.8) {
      const g = (x < 130 ? 0.4 + (x - 36) / 94 * 0.9 : Math.max(0.25, 1.3 - (x - 130) / 60)) * (0.8 + T.rnd() * 0.4), y = yBei(RUECKEN, x) + 0.25;
      d += `M${r(x - g * 0.6)} ${r(y)}L${r(x - g * 0.15)} ${r(y - g)}L${r(x + g * 0.6)} ${r(y)}`;
    }
    return `<path d="${d}" fill="#4a3b29" stroke="#1a130a" stroke-width=".1" stroke-opacity=".6" stroke-linejoin="round"/>`;
  })();

  /* nahes Hinterbein / Vorderbein: Säulenbeine mit Hautringen */
  h += teil(T, HB, nahB, {
    vol: false, randAb: 0.4, randA: 0.4, rw: 0.16,
    innen: licht(T, 123, -28, 5, 7, -6, 0.32) + licht(T, 128.6, -20, 2.2, 2, 0, 0.35) + schatten(T, 117, -18, 2.2, 8, -10, 0.5) +
      schatten(T, 125, -2, 7, 1.8, 0, 0.35) +
      falten(T, [[[117, -22], [123, -20.6], [130, -21.6]], [[120, -12], [124.4, -11.2], [128.4, -12]], [[120.4, -8], [124.4, -7.4], [128.4, -8]],
        [[120, -4.2], [124.6, -3.6], [129.4, -4.2]], [[131, -22], [128.4, -26], [126.4, -31]]], "#16120b", 0.2, 0.45),
  });
  h += krallen(T, [[128.6, -1.6, 3.6, 1.6], [125, -1.4, 3.4, 1.4], [121.6, -1, 2.8, 1]], "#3a3022");
  h += teil(T, VB, nahB, {
    vol: false, randAb: 0.35, randA: 0.4, rw: 0.16,
    innen: licht(T, 171, -26, 4, 5, -6, 0.32) + schatten(T, 166.8, -14, 1.6, 7, -6, 0.5) + schatten(T, 171, -2, 5, 1.6, 0, 0.35) +
      falten(T, [[[166.4, -16], [170.4, -15], [174.6, -16]], [[167.6, -8.6], [171, -8], [174, -8.6]], [[167.4, -4.6], [171, -4], [174.4, -4.6]]], "#16120b", 0.2, 0.45),
  });
  h += krallen(T, [[173.4, -2.2, 2.6, 1.6]], "#3a3022");

  /* Kopf: klein, lang und flach; Nasenöffnung oben zwischen den Augen; Stiftzähne nur vorn */
  const K = [[245.8, -44.2], [248.4, -45.2], [251, -45], [253.6, -44.2], [255.8, -43.2], [256.6, -42], [256.4, -41], [255, -40.6], [251.6, -40.5],
    [248.4, -40.8], [246.2, -41.8]];
  h += teil(T, K, T.lg("kopf", [[0, "#857258"], [0.55, "#7a6850"], [1, "#55463a"]]), {
    innen: licht(T, 251, -44.2, 3, 0.8, -6, 0.55) + schatten(T, 252, -40.8, 4, 0.6, 0, 0.5) + schatten(T, 249.2, -43.4, 1, 0.7, 0, 0.5) +
      falten(T, [[[256, -41.5], [253, -41.5], [250.2, -41.8]], [[247.2, -43.6], [247.8, -42.2], [247.4, -41]]], "#141008", 0.12, 0.5) +
      (F ? `<path d="M255.9 -41.6l.04 .32M255.3 -41.6l.04 .34M254.7 -41.55l.04 .34M254.1 -41.5l.04 .32" stroke="#e2d8bc" stroke-width=".12" stroke-linecap="round" stroke-opacity=".55"/>` : ""),
    randA: 0.45, randSzene: true,
  });
  s += h;
  s += `<ellipse cx="249.8" cy="-44.9" rx=".42" ry=".18" fill="#120e09"/>`;
  s += T.augeReal ? T.augeReal(249.2, -43.4, 0.4, { iris: "#9a6a26", iris2: "#3e240c", offen: 0.62, lid: "#1d160d", winkel: -4 }) : T.auge(249.2, -43.4, 0.36, "#6b4a1c");
  const k = 10, box = [0, -45.4, 256.6, 0];
  return { svg: DM(s, k), box: box.map((v) => Math.round(v * k)) };
}

module.exports = [
  { id: "triceratops", de: "der Triceratops", syl: "Tri-ZE-ra-tops", it: "il triceratopo", itSyl: "tri-che-RA-to-po", en: "triceratops",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 8.6, hoehe: 3.13, zeichne: triceratops },
  { id: "brachiosaurus", de: "der Brachiosaurus", syl: "Bra-chi-o-SAU-rus", it: "il brachiosauro", itSyl: "bra-chio-SAU-ro", en: "brachiosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 20.26, hoehe: 13.44, zeichne: brachiosaurus },
  { id: "diplodocus", de: "der Diplodocus", syl: "Di-PLO-do-kus", it: "il diplodoco", itSyl: "di-PLO-do-co", en: "diplodocus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 25.66, hoehe: 4.54, zeichne: diplodocus },
  { id: "stegosaurus", de: "der Stegosaurus", syl: "Ste-go-SAU-rus", it: "lo stegosauro", itSyl: "ste-go-SAU-ro", en: "stegosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 8.99, hoehe: 3.75, zeichne: stegosaurus },
  { id: "ankylosaurus", de: "der Ankylosaurus", syl: "An-ky-lo-SAU-rus", it: "l'anchilosauro", itSyl: "an-chi-lo-SAU-ro", en: "ankylosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 6.73, hoehe: 1.91, zeichne: ankylosaurus },
  { id: "parasaurolophus", de: "der Parasaurolophus", syl: "Pa-ra-sau-RO-lo-phus", it: "il parasaurolofo", itSyl: "pa-ra-sau-RO-lo-fo", en: "parasaurolophus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 9.3, hoehe: 3.92, zeichne: parasaurolophus },
];
