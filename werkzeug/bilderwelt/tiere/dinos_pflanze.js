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
const DM = (svg) => `<g transform="scale(10)">${svg}</g>`;

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
function teil(T, pts, fill, o = {}) {
  const d = typeof pts === "string" ? pts : T.glatt(pts);
  T._n = (T._n || 0) + 1;
  const id = T.id("t" + T._n);
  T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  const [x0, y0, x1, y1] = o.box || T.box(pts);
  const re = (f, ex = "") => `<rect x="${r(x0 - 0.5)}" y="${r(y0 - 0.5)}" width="${r(x1 - x0 + 1)}" height="${r(y1 - y0 + 1)}" fill="${f}"${ex}/>`;
  let s = `<use href="#${id}" fill="${fill}"/>`;
  const innen = (o.muster ? re(o.muster) : "") + (o.innen || "") + (o.vol !== false ? re(T.VOL()) : "") + (o.volx ? re(T.VOLX()) : "");
  if (innen) s += `<g clip-path="url(#${id}c)">${innen}</g>`;
  /* randAb: Rand erst ab diesem Anteil der Höhe (Beine: oben im Rumpf kein Rand) */
  const rs = o.randAb != null ? T.lg("ra" + Math.round(o.randAb * 100), [[0, "#000", 0], [o.randAb, "#000", 0], [Math.min(1, o.randAb + 0.12), "#000", 1], [1, "#000", 1]]) : (o.rand || "#000");
  if (o.rand !== false) s += `<use href="#${id}" fill="none" stroke="${rs}" stroke-opacity="${o.randA != null ? o.randA : 0.35}" stroke-width="${o.rw || 0.1}" stroke-linejoin="round"/>`;
  return s;
}
/* Schuppenmuster (in den defs, beliebig oft wiederverwendbar): Sechseck-Raster aus Schattenbögen */
function muster(T, name, w, h, farbe, op, sw, drehung = 0) {
  const id = T.id(name);
  if (T["_" + name]) return `url(#${id})`;
  T["_" + name] = 1;
  const k = w / 4;
  let d = "";
  for (const [x, y] of [[0, h / 2], [w / 2, h / 2], [w, h / 2], [w / 4, h], [w * 3 / 4, h], [w / 4, 0], [w * 3 / 4, 0]])
    d += `M${r(x - k)} ${r(y)}a${r(k)} ${r(h / 3)} 0 0 0 ${r(2 * k)} 0`;
  T.def(`<pattern id="${id}" patternUnits="userSpaceOnUse" width="${w}" height="${h}" patternTransform="rotate(${drehung})">` +
    `<path d="${d}" fill="none" stroke="${farbe}" stroke-opacity="${op}" stroke-width="${sw}"/></pattern>`);
  return `url(#${id})`;
}
/* Schuppen: je Schuppe unten ein Schattenbogen (große Einzelschuppen), EIN Pfad */
function schuppen(T, n, x0, y0, x1, y1, s, farbe, op, w) {
  let d = "";
  for (let i = 0; i < n; i++) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0), k = s * (0.6 + T.rnd() * 0.8);
    d += `M${r(x - k)} ${r(y)}a${r(k)} ${r(k * 0.75)} 0 0 0 ${r(2 * k)} 0`;
  }
  return `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${w || s * 0.35}" stroke-opacity="${op}" stroke-linecap="round"/>`;
}
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
  return `<path d="${listen.map((p) => T.glatt(p, false, 1)).join("")}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round"/>`;
}
/* Hufkrallen: gerundete Hornkappen vorn an den Zehen [x, y, Breite, Höhe] – heller Horn, dunkle Kante, Glanzpunkt */
function naegel(liste, farbe) {
  const d = liste.map(([x, y, b, h]) => `M${r(x)} ${r(y)}h${r(b)}c${r(b * 0.12)} ${r(-h * 0.5)} ${r(-b * 0.1)} ${r(-h)} ${r(-b * 0.45)} ${r(-h)}s${r(-b * 0.55)} ${r(h * 0.4)} ${r(-b * 0.55)} ${r(h)}z`).join("");
  const g = liste.map(([x, y, b, h]) => `M${r(x + b * 0.35)} ${r(y - h * 0.75)}q${r(b * 0.2)} ${r(-h * 0.1)} ${r(b * 0.35)} ${r(h * 0.15)}`).join("");
  return `<path d="${d}" fill="${farbe}" stroke="#1a140c" stroke-width=".1" stroke-opacity=".6"/><path d="${g}" fill="none" stroke="#fff" stroke-width=".1" stroke-opacity=".5" stroke-linecap="round"/>`;
}
/* weiche Licht-/Schattenfläche (für Muskeln), ohne Rand */
const fl = (T, pts, farbe, op) => T.form(pts, farbe, ` opacity="${op}"`);
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
   Je Schuppe ein Schattenbogen unten und ein Lichtbogen oben – zwei Pfade. Nur bei T.fein. */
function schuppenFeld(T, oben, unten, x0, x1, n, groesse, o = {}) {
  if (!T.fein) return "";
  let dd = "", hh = "", px = null, py = null, qx = null, qy = null;
  for (let i = 0; i < n; i++) {
    const t = (1 - Math.cos(Math.PI * (i + 0.5) / n)) / 2, sk = 0.35 + 0.65 * Math.sin(Math.PI * (i + 0.5) / n);
    let x = x0 + (i % 2) * groesse(x0, t) * 0.9 + T.rnd() * 0.5;
    while (x < x1) {
      const ya = yBei(oben, x), yb = yBei(unten, x), y = ya + (yb - ya) * t, k = groesse(x, t) * (0.85 + T.rnd() * 0.3);
      const ky = k * 0.8 * sk;
      /* relative Züge (m/a) halten den Pfad kurz */
      const ax = r(x - k), ay = r(y);
      dd += px === null ? `M${ax} ${ay}` : `m${r(ax - px)} ${r(ay - py)}`;
      dd += `a${r(k)} ${r(ky) || 0.1} 0 0 0 ${r(2 * k)} 0`; px = ax + r(2 * k); py = ay;
      const bx = r(x - k * 0.7), by = r(y - ky * 0.35);
      hh += qx === null ? `M${bx} ${by}` : `m${r(bx - qx)} ${r(by - qy)}`;
      hh += `a${r(k * 0.7)} ${r(ky * 0.6) || 0.1} 0 0 1 ${r(k * 1.4)} 0`; qx = bx + r(k * 1.4); qy = by;
      x += k * 2.05;
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
/* Relief-Gruppe (Poren/Schuppen als echtes Licht) nur bei voller Feinheit */
const relief = (T, inhalt, o) => T.fein ? `<g filter="${T.relief("haut", o)}">${inhalt}</g>` : inhalt;

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
  const fern = T.lg("fern", [[0, "#3a3122", 0], [0.3, "#3a3122", 0.9], [0.5, "#30291c"], [1, "#1f1a11"]]);
  const nahB = T.lg("bein", [[0, "#6a5a3c", 0], [0.3, "#6a5a3c", 0.6], [0.5, "#615237"], [0.8, "#4f4430"], [1, "#382f21"]]);
  const schild = T.lg("schild", [[0, "#ad8b5a"], [0.4, "#8a6a42"], [0.8, "#5a4229"], [1, "#46351f"]], 0, 0, 1, 1);
  const horn = T.lg("horn", [[0, "#4f4436"], [0.22, "#93866a"], [0.6, "#d3c8aa"], [0.9, "#b2a687"], [1, "#6f644f"]], 1, 1, 0, 0);
  const schnabel = T.lg("schnabel", [[0, "#7a705f"], [0.35, "#4a4237"], [1, "#1c1813"]], 0, 0, 0.4, 1);
  let s = "", h = "";

  /* Beine: Hüfte bei 41/-22, Schulter bei 61/-19. Hinten säulenartig (Knie vorn, kurzer Mittelfuß, vier Zehen mit
     Hufkrallen), vorn kürzer, Ellbogen nach hinten-außen, Unterarm schräg nach vorn, Hand mit drei Hufkrallen */
  const HB = [[34, -25], [33, -17], [35.2, -11.2], [37.4, -6.6], [37.6, -3.4], [36.8, -1.2], [37.4, 0, 1], [46.4, 0, 1], [46.9, -1.1],
    [44.8, -2.5], [43.2, -3.8], [42.8, -7], [44.4, -11.2], [46.6, -17], [46, -25]];
  const VB = [[56, -22], [55.4, -15], [55.8, -10.6], [57.4, -7.6], [59, -4.6], [59.2, -2.6], [58.6, -0.6], [59, 0, 1], [65.4, 0, 1],
    [65.8, -1.3], [64.2, -2.8], [63.4, -4.6], [62.8, -8.4], [63.6, -12.6], [65.4, -20], [61, -24]];
  const hbF = boden(dreh(HB, 41, -22, -11, 3.5)), vbF = boden(dreh(VB, 61, -19, 10, -2.6));
  const zehen = (x, b, n, farbe) => naegel(Array.from({ length: n }, (_, i) => [x + i * b * 1.02, 0, b, b * 0.7]), farbe);
  h += teil(T, hbF, fern, { vol: false, randAb: 0.5, randA: 0.3 });
  h += teil(T, vbF, fern, { vol: false, randAb: 0.5, randA: 0.3 });
  h += zehen(hbF[6][0] + 3.4, 1.9, 3, "#4d4434") + zehen(vbF[6][0] + 2.6, 1.5, 3, "#4d4434");

  /* Rumpf + Schwanz + Hals unter dem Schild: EIN Umriss; Hüfte höchster Punkt, Rücken fällt zur Schulter ab */
  const R = [[8.4, -13.9], [13, -16.6], [19, -19.8], [26, -23.5], [33, -26.8], [39, -28.6], [44, -29], [49, -28.3], [54, -26.8],
    [59, -24.8], [63.5, -23.2], [67, -21], [70, -15.6], [71.6, -10.8], [70.2, -8.4], [65.4, -8.6], [60, -8.4], [52, -7.8],
    [45, -8.6], [40, -11], [35.4, -14.6], [29, -16.8], [22, -15.9], [15.5, -14], [10.6, -12.3], [8, -12.2]];
  const oben = [[8, -13.9], [19, -19.8], [33, -26.8], [44, -29], [54, -26.8], [63.5, -23.2], [70, -18]];
  const unten = [[8, -12.2], [15.5, -14], [22, -15.9], [29, -16.8], [35.4, -14.6], [40, -11], [45, -8.6], [52, -7.8], [60, -8.4], [70, -8.6]];
  const flanke = [[38, -26], [50, -26], [62, -21], [64, -12], [52, -10], [42, -12], [34, -18]];
  h += teil(T, R, haut, {
    innen:
      /* dunkler Rückensattel mit unregelmäßigen Querbändern, heller Bauch (Gegenschattierung) */
      fl(T, [[8, -14.6], [20, -21.6], [36, -29.6], [50, -29], [63, -24.8], [60.5, -21.2], [55, -22.6], [52, -20.2], [47.5, -22.4], [43, -20.6],
        [38, -22.8], [33.5, -19.8], [28, -19.4], [22, -17], [15, -14.6]], "#261d10", 0.45) +
      fl(T, [[34, -11.6], [44, -7.4], [58, -7.2], [68, -8.6], [60, -11.8], [46, -11.4]], "#c4ad82", 0.32) +
      /* Kernschatten am Bauch und unter dem Schwanz, Reflexlicht an der Unterkante */
      fl(T, [[37, -13], [46, -11.8], [58, -12], [67, -13], [67, -10.6], [58, -9.4], [46, -9.2], [37, -11]], "#140f08", 0.25) +
      fl(T, [[9, -12.8], [16, -14.4], [23, -16.2], [30, -17], [35, -15.6], [33, -14.4], [28, -15.6], [22, -14.8], [15, -13.2], [9, -12]], "#140f08", 0.35) +
      falten(T, [[[40, -10], [46, -8.2], [54, -7.9], [62, -8.3], [69, -8.8]]], "#dcc9a0", 0.4, 0.22) +
      /* Muskeln: Schwanzbasis (Caudofemoralis), Rippenwölbung, Schulter */
      licht(T, 29, -22.8, 10, 3, -26, 0.6) + licht(T, 50, -21.5, 10, 5, -8, 0.5) + licht(T, 62, -20.6, 4.6, 3, -20, 0.45) +
      schatten(T, 34, -17.8, 6, 2, -24, 0.35) +
      schuppenFeld(T, oben, unten, 18, 71, 12, (x, t) => 0.42 + 0.34 * Math.sin(Math.PI * t) * (x > 32 ? 1 : 0.5), { opD: 0.42, opH: 0.24 }) +
      hoecker(T, streu(T, flanke, 24, 0.5, 0.9), "#9e8c66", { op: 0.55 }) +
      /* Hautfalten nur an Gelenken: Leiste, Schwanzansatz, Achsel, Hals */
      falten(T, [[[31, -17.6], [33.8, -14.8], [36.2, -12.2]], [[29, -18.8], [31.4, -16.2]], [[24, -18], [27.4, -20.8], [30.4, -22.6]],
        [[64.8, -12], [67.6, -11], [70.4, -11.6]], [[64, -9.6], [67.4, -9], [70.6, -9.6]], [[65.6, -14.2], [68.4, -13.4], [70.6, -14]],
        [[54.6, -14.6], [55.6, -11.8], [57.6, -10]], [[62.6, -17.2], [65.6, -15.8], [68.6, -16]]], "#1a150c", 0.14, 0.5),
    randA: 0.45,
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
  h += zehen(39.2, 2.3, 3, "#5a4f3d");

  /* nahes Vorderbein: Schultermuskel (Deltoideus/Triceps), Ellbogen, Handgelenk */
  h += teil(T, VB, nahB, {
    vol: false, randAb: 0.5, randA: 0.4,
    innen: licht(T, 60.4, -17, 4.4, 4.4, -10, 0.5) + licht(T, 58.6, -9.6, 2.4, 1.6, -30, 0.35) + schatten(T, 57.2, -6.2, 1.6, 4, -24, 0.45) +
      schatten(T, 62, -1, 4.6, 1.2, 0, 0.35) +
      schuppenFeld(T, [[55, -20], [66, -20]], [[55, -2], [66, -2]], 55, 66, 9, () => 0.42, { opD: 0.35, opH: 0.2 }) +
      falten(T, [[[56, -10.8], [59.4, -9.2], [63.4, -9.8]], [[59.4, -3.6], [61.6, -3.2], [63.6, -3.6]], [[59.4, -5.6], [61.4, -5.2], [63.2, -5.6]],
        [[61.8, -1.8], [62, -0.2]], [[63.4, -1.8], [63.6, -0.2]]], "#16120b", 0.13, 0.55),
  });
  h += zehen(60.6, 1.7, 3, "#5a4f3d");

  /* Schädel mit Nackenschild – EIN Umriss; Schild geschlossen (ohne Fenster), Randzacken ringsum */
  const K = [[89.9, -10, 1], [89.5, -11.6], [88.3, -13.4], [86.6, -15.1], [84.6, -16.2], [82, -17.2], [78.8, -18.4], [75.8, -20.2], [72.2, -22.4],
    [68, -25.4], [63.6, -28], [60.8, -28.9], [58.6, -27.8], [57.4, -25], [57.1, -21.6], [57.8, -18.2], [59.6, -15.6], [62.6, -14.2],
    [66.4, -13.4], [69.2, -12.2], [71.4, -9.8], [74.6, -8], [79.6, -7.3], [84, -7.5], [86.4, -8.1], [88.2, -9.1], [88.8, -9.7, 1]];
  const RZ = [[70, -24], [68, -25.4], [65.8, -26.8], [63.6, -28], [60.8, -28.9], [58.6, -27.8], [57.4, -25], [57.1, -21.6], [57.8, -18.2], [59.6, -15.6], [62.6, -14.2]];
  let z = "";
  for (let i = 0; i < RZ.length - 1; i++) {
    const [ax, ay] = RZ[i], [bx, by] = RZ[i + 1], mx = (ax + bx) / 2, my = (ay + by) / 2;
    let nx = -(by - ay), ny = bx - ax; const l = Math.hypot(nx, ny);
    if (nx * (mx - 65) + ny * (my + 20) < 0) { nx = -nx; ny = -ny; }
    z += `M${r(ax)} ${r(ay)}Q${r(mx + nx / l * 1.5)} ${r(my + ny / l * 1.5)} ${r(bx)} ${r(by)}`;
  }
  h += `<path d="${z}" fill="#5e4a30" stroke="#21190f" stroke-width=".12" stroke-opacity=".55" stroke-linejoin="round"/>`;
  /* fernes Stirnhorn (andere Kopfseite: etwas weiter vorn und dunkler) */
  h += T.form([[74, -21.6], [76.2, -24.4], [79.2, -26.8], [82.6, -28.2], [85, -28.4, 1], [82, -26.4], [79.4, -23.6], [77.4, -20]], "#5e5443");
  h += teil(T, K, T.lg("kopf", [[0, "#76664a"], [0.55, "#806f50"], [1, "#56482f"]]), {
    innen:
      /* Schildfläche: oben im Licht, zum Kopf hin im Eigenschatten; Randsaum; Gefäßrinnen strahlenförmig */
      fl(T, [[73, -22.8], [70.8, -17.6], [69.6, -12.6], [55, -12], [55, -31], [64, -31]], schild, 1) +
      falten(T, [[[67, -26.6], [63.6, -28.6], [60.4, -28.8], [58.1, -26], [57.6, -21.6], [58.4, -17.8], [60.6, -15.2], [63, -14.4]]], "#24190d", 1.4, 0.42) +
      falten(T, [[[70.4, -19.6], [66.4, -23], [62.4, -26.8]], [[69.8, -17.6], [65, -20.2], [59.8, -24]], [[69.4, -15.6], [64, -17], [59, -19.8]],
        [[69.4, -14], [64.4, -14.8], [60, -16.2]], [[71.2, -21.2], [68, -24.8], [65.4, -27.2]]], "#3a2a16", 0.14, 0.5) +
      licht(T, 63, -24, 5, 3, -40, 0.55) + schatten(T, 69.5, -15, 3, 6, 10, 0.6) +
      (F ? tupfen(T, 14, 59, -27, 68, -15.5, 0.4, "#c2a472", 0.3) : "") +
      /* Gesicht: Wangenwulst, Maulspalte, Kinnfalten, Augenhöhle */
      licht(T, 78, -15.6, 5.4, 2.4, -12, 0.5) + schatten(T, 79, -8.6, 8, 1.6, 0, 0.5) +
      schuppenFeld(T, [[70, -21], [88, -15]], [[70, -8], [88, -8]], 70, 86, 9, () => 0.34, { opD: 0.35, opH: 0.2 }) +
      falten(T, [[[85.2, -10.8], [81, -11], [77.4, -11.5], [74.4, -12.4]], [[77.4, -13.6], [74.6, -14.2], [72.2, -13.6]], [[80.5, -8.5], [76.5, -8.7], [73.6, -9.5]],
        [[81.4, -16.6], [78.4, -15.6]], [[73.6, -19.6], [76, -19.9], [78.2, -18.8]]], "#120e08", 0.14, 0.55) +
      schatten(T, 75.6, -17.5, 1.8, 1.3, 0, 0.55) +
      /* Schnabel: Hornscheiden oben (Rostrale, Hakenspitze) und unten (Prädentale), glänzend */
      teilInnen(T, [[85.9, -15.5], [88.3, -13.4], [89.5, -11.6], [89.9, -10, 1], [88.8, -10.5], [87.4, -11.1], [85.8, -12.2], [85, -13.6]], schnabel) +
      teilInnen(T, [[85.2, -10.9], [88.8, -9.7, 1], [88, -8.9], [86.2, -8], [84.8, -8.4], [84.2, -9.8]], schnabel) +
      falten(T, [[[86.6, -14.8], [88.4, -12.9], [89.3, -11]], [[85.8, -10.2], [87.6, -9.6]]], "#fff", 0.18, 0.5),
    randA: 0.45,
  });
  s += relief(T, h, { f: 3, tiefe: 0.12, okt: 2 });
  /* Nasenloch groß, unter dem Nasenhorn */
  s += `<ellipse cx="84.3" cy="-13.9" rx=".85" ry=".52" fill="#120e09" transform="rotate(-28 84.3 -13.9)"/>` +
    falten(T, [[[83.4, -14.8], [84.6, -14.9], [85.5, -14.3]]], "#c9b892", 0.12, 0.4);
  /* Nasenhorn kurz nach vorn-oben; Wangenhorn (Epijugale) nach unten-hinten; nahes Stirnhorn ~1 m, kegelförmig */
  const hornIn = (l) => F ? falten(T, l, "#3a3226", 0.08, 0.35) : "";
  s += teil(T, [[83, -16.7], [83.9, -18.4], [84.6, -19.9, 1], [85.6, -17.4], [86.5, -15.6]], horn, { vol: false, randA: 0.45, rw: 0.08 });
  s += teil(T, [[71, -12.4], [70.3, -9.8], [70.3, -8.2, 1], [71.8, -9.6], [73, -11.6]], horn, { vol: false, randA: 0.45, rw: 0.08 });
  s += teil(T, [[72.8, -21.8], [74.7, -24.4], [77.6, -26.8], [80.8, -28.4], [83, -29, 1], [80.3, -26.9], [77.8, -24.1], [75.6, -20.6]], horn, {
    innen: hornIn([[[73.8, -21.6], [76.3, -24.4], [79.6, -27]], [[74.8, -21.2], [77.3, -23.9], [80.6, -26.9]]]) +
      falten(T, [[[74, -22.6], [76.7, -25.3], [80.2, -27.7]]], "#fff", 0.16, 0.45) +
      falten(T, [[[73, -22.2], [74.4, -21.6], [75.8, -21]]], "#2a2218", 0.35, 0.45),
    vol: false, randA: 0.5, rw: 0.08,
  });
  /* Auge: seitlich unter dem Hornansatz; Reptilienauge ohne Wimpern, runde Pupille, Lidwulst darüber */
  s += T.augeReal ? T.augeReal(75.6, -17.4, 0.58, { iris: "#b07a2e", iris2: "#4a2c0e", offen: 0.66, lid: "#1d160d", winkel: -6 })
    : T.auge(75.6, -17.4, 0.5, "#6b4a1c", { flach: 0.8 });
  s += falten(T, [[[74.1, -18.5], [75.7, -19.1], [77.3, -18.4]]], "#0f0b06", 0.18, 0.55);

  return { svg: DM(s), box: [80, -290, 899, 0] };
}
/* Fläche innerhalb eines Körperteils (z. B. Schnabel): Füllung + Volumenlicht, ohne eigenen Clip */
function teilInnen(T, pts, fill) {
  return T.form(pts, fill) + T.form(pts, T.VOL());
}

module.exports = [
  { id: "triceratops", de: "der Triceratops", syl: "Tri-ZE-ra-tops", it: "il triceratopo", itSyl: "tri-che-RA-to-po", en: "triceratops",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 8.19, hoehe: 2.9, zeichne: triceratops },
];
