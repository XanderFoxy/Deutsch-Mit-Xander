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
   Je Schuppe ein Schattenbogen unten und (im Licht, obere Körperhälfte) ein Lichtbogen oben links. Nur bei T.fein. */
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
      const bx = r(x - k * 0.75), by = r(y - ky * 0.1);
      if (t < (o.lichtBis || 0.6)) {
        hh += (qx === null ? `M${bx} ${by}` : `m${r(bx - qx)} ${r(by - qy)}`) + `a${r(k * 0.8)} ${r(ky * 0.7) || 0.1} 0 0 1 ${r(k * 0.8)} ${r(-ky * 0.52)}`;
        qx = bx + r(k * 0.8); qy = by + r(-ky * 0.52);
      }
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
  h += teil(T, hbF, fern, { vol: false, randAb: 0.5, randA: 0.3 });
  h += teil(T, vbF, fern, { vol: false, randAb: 0.5, randA: 0.3 });
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
  s += relief(T, h, { f: 3, tiefe: 0.12, okt: 2 }); h = "";
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
  s += relief(T, h, { f: 3, tiefe: 0.12, okt: 2 });
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
  const RUECKEN = [[1.6, -17.2], [8, -19.6], [15, -22.6], [22, -25.4], [29, -27.4], [35, -28], [41, -27.4], [47, -25.2], [53, -22],
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
  const HB = [[31, -24], [30, -16], [32.4, -10.2], [35.4, -6], [35.8, -3.2], [35, -1.1], [35.6, 0, 1], [43.2, 0, 1], [43.6, -1.2],
    [41.6, -2.6], [40.8, -4.6], [41.8, -9.2], [43.8, -14], [44.4, -20], [41, -26]];
  const VB = [[58, -17], [57.4, -12], [58, -8.2], [59.4, -5], [59.6, -2.6], [59, -0.7], [59.4, 0, 1], [64.8, 0, 1], [65.2, -1.2],
    [64, -2.6], [63.6, -5.4], [64, -9], [65.2, -13], [64.6, -17]];
  const hbF = boden(dreh(HB, 37, -19, -10, 3.5)), vbF = boden(dreh(VB, 61, -14, 9, -2.4));
  const zehen = (x, b, n, farbe) => naegel(Array.from({ length: n }, (_, i) => [x + i * b * 1.02, 0, b, b * 0.5]), farbe);
  s += platten(0);
  const stF = T.lg("stF", [[0, "#3a3426"], [1, "#6f6650"]]);
  s += teil(T, stachelPts(11, -19.6, 6.6, 1.7, -112), stF, { vol: false, randA: 0.3 });
  s += teil(T, stachelPts(6.6, -18.4, 6.4, 1.6, -146), stF, { vol: false, randA: 0.3 });
  h += teil(T, hbF, fern, { vol: false, randAb: 0.5, randA: 0.3 }) + teil(T, vbF, fern, { vol: false, randAb: 0.5, randA: 0.3 });
  h += zehen(hbF[6][0] + 3.2, 1.9, 3, "#3d3826") + zehen(vbF[6][0] + 2.4, 1.4, 3, "#3d3826");

  /* Rumpf + Schwanz + Hals: EIN Umriss */
  const R = [[1, -16.6], ...RUECKEN.slice(1), [76.2, -11.4], [76.6, -9.4], [74.4, -8.4], [70, -8.2], [64, -7.8], [58, -7.6], [52, -8], [45, -9.2],
    [39.4, -12.2], [33.4, -15.6], [26, -17.4], [18, -17.6], [10, -16.8], [3.6, -16]];
  const unten = [[1, -16], [10, -16.8], [18, -17.6], [26, -17.4], [33.4, -15.6], [39.4, -12.2], [45, -9.2], [52, -8], [58, -7.6], [64, -7.8], [70, -8.4], [75, -9]];
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
      schuppenFeld(T, RUECKEN.map(([x, y]) => [x, y + 0.6]), unten, 5, 76, 11, (x, t) => 0.32 + 0.22 * Math.sin(Math.PI * t) * (x > 24 ? 1 : 0.5), { opD: 0.4, opH: 0.22 }) +
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
      schuppenFeld(T, [[30, -22], [44, -22]], [[30, -3], [44, -3]], 30, 44, 9, () => 0.4, { opD: 0.35, opH: 0.2 }) +
      falten(T, [[[32.6, -10.8], [36.4, -9.4], [41.8, -10]], [[35.8, -4.8], [38.4, -4.2], [41, -4.6]], [[35.6, -2.8], [38.6, -2.2], [41.6, -2.8]],
        [[43.2, -13], [41.2, -14.8], [39.8, -17.4]], [[36.8, -7.6], [37.6, -5.6]], [[38.6, -1.8], [38.8, -0.2]], [[40.6, -2], [41, -0.2]]], "#16120b", 0.13, 0.55) +
      falten(T, [[[38, -26], [40.8, -19.6], [43.4, -14.4]]], "#120e06", 0.4, 0.2),
  });
  h += zehen(37.2, 2.1, 3, "#433d2b");
  /* nahes Vorderbein: kurz und kräftig, Ellbogen hinten, säulenartige Hand */
  h += teil(T, VB, nahB, {
    vol: false, randAb: 0.4, randA: 0.4,
    innen: licht(T, 61, -13.2, 3.6, 3.4, -10, 0.5) + schatten(T, 58.4, -6, 1.4, 3.6, -14, 0.45) + schatten(T, 62, -1, 4, 1.1, 0, 0.35) +
      schuppenFeld(T, [[57, -16], [65, -16]], [[57, -2], [65, -2]], 57, 65, 8, () => 0.36, { opD: 0.35, opH: 0.2 }) +
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
  s += relief(T, h, { f: 3.2, tiefe: 0.12, okt: 2 });
  /* nahe Platten über dem Rumpf, nahe Stacheln */
  s += platten(1);
  s += teil(T, stachelPts(10, -19.4, 6.8, 1.8, -118), stachel, { innen: falten(T, [[[9.4, -20.2], [8.2, -22.6], [7.2, -25]]], "#fff", 0.14, 0.4), vol: false, randA: 0.5 });
  s += teil(T, stachelPts(5.4, -18, 6.6, 1.7, -152), stachel, { innen: falten(T, [[[5, -18.8], [2.6, -20], [0.4, -21]]], "#fff", 0.14, 0.4), vol: false, randA: 0.5 });
  s += T.augeReal ? T.augeReal(78.4, -10.1, 0.3, { iris: "#9a6a26", iris2: "#3e240c", offen: 0.66, lid: "#1d160d", winkel: -10 }) : T.auge(78.4, -10.1, 0.28, "#6b4a1c");
  s += `<ellipse cx="81.7" cy="-9.2" rx=".28" ry=".17" fill="#120e09" transform="rotate(-34 81.7 -9.2)"/>`;
  const k = 10.6, box = [-1, -35.4, 83.8, 0];
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
  const os = T.rg("os", [[0, "#a38c66"], [0.5, "#7a654a"], [0.9, "#4e3e2a"], [1, "#3a2d1e"]], 0.35, 0.3, 0.75);
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
        kl += `M${r(xx - rx * 0.75)} ${r(yy - ry * 0.05)}q${r(rx * 0.6)} ${r(-ry * 0.55)} ${r(rx * 1.5)} ${r(-ry * 0.1)}`;
        ks += `M${r(xx - rx * 0.8)} ${r(yy + ry * 0.55)}q${r(rx * 0.8)} ${r(ry * 0.6)} ${r(rx * 1.7)} ${r(-ry * 0.2)}`;
      }
    }
    return (F ? `<path d="${ks}" fill="none" stroke="#0e0904" stroke-width=".35" stroke-opacity=".35" stroke-linecap="round"/>` : "") +
      `<g fill="${fill}" stroke="#1a120a" stroke-width=".06" stroke-opacity=".45">${e}</g>` +
      (F ? `<path d="${kl}" fill="none" stroke="#efe0bc" stroke-width=".16" stroke-opacity=".45" stroke-linecap="round"/>` : "");
  };
  /* Randstacheln: dreieckige Osteoderme an der Flanke, nach unten-hinten */
  const zacken = (liste, fill) => `<path d="${liste.map(([x, y, b, l, a]) => {
    const c = Math.cos(a * Math.PI / 180), sn = Math.sin(a * Math.PI / 180);
    return `M${r(x - b / 2)} ${r(y)}Q${r(x - b * 0.2 + c * l * 0.5)} ${r(y + sn * l * 0.5)} ${r(x + c * l)} ${r(y + sn * l)}Q${r(x + b * 0.2 + c * l * 0.4)} ${r(y + sn * l * 0.4)} ${r(x + b / 2)} ${r(y)}Z`;
  }).join("")}" fill="${fill}" stroke="#1a130b" stroke-width=".08" stroke-opacity=".7"/>`;

  /* Beine: kurz, kräftig, leicht gespreizt; breite Füße mit stumpfen Hufkrallen */
  const HB = [[24, -12], [23.2, -8.6], [24.4, -5.6], [25.6, -3.4], [25.4, -1.4], [25, -0.4], [25.4, 0, 1], [31.6, 0, 1], [32, -1],
    [30.6, -2.2], [30, -3.6], [30.8, -6.4], [31.8, -9.6], [31, -13]];
  const VB = [[44.4, -11], [43.8, -7.6], [44.4, -5], [45.4, -3], [45.2, -1.2], [44.8, -0.3], [45.2, 0, 1], [50.8, 0, 1], [51.2, -1],
    [49.8, -2.2], [49.2, -3.6], [49.6, -6], [50.6, -9], [49.8, -11.6]];
  const hbF = boden(dreh(HB, 28, -10, -8, 2.6)), vbF = boden(dreh(VB, 47, -9, 8, -2));
  const zehen = (x, b, n, farbe) => naegel(Array.from({ length: n }, (_, i) => [x + i * b * 1.02, 0, b, b * 0.5]), farbe);
  h += teil(T, hbF, fern, { vol: false, randAb: 0.4, randA: 0.3 }) + teil(T, vbF, fern, { vol: false, randAb: 0.4, randA: 0.3 });
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
      platten(21.4, 47, 2.9, 6, 1.25, os, false) + platten(9, 20, 2.4, 3, 0.85, os, false) +
      `<g fill="${os}" stroke="#20180e" stroke-width=".08" stroke-opacity=".6">` +
      [[49.4, -14.2, 1.3, 0.75], [49.8, -12.3, 1.4, 0.85], [50.2, -10.4, 1.3, 0.8], [52.2, -12.2, 1.1, 0.7], [52.6, -10.6, 1.2, 0.75], [52.9, -9.2, 1, 0.6]]
        .map(([x, y, a, b]) => `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}"/>`).join("") + `</g>` +
      (F ? falten(T, [[[48.6, -14.6], [50, -14.4], [51.2, -14.1]], [[48.6, -12.6], [50, -12.4], [51.4, -12.1]], [[51.4, -12.4], [52.4, -12.3], [53.4, -12]]], "#f2e6c8", 0.14, 0.5) : "") +
      /* Kernschatten unten an der Flanke (unter dem Panzerrand) */
      fl(T, [[18, -8.8], [30, -7.8], [42, -8], [55, -8.8], [56, -4], [18, -4]], "#120c06", 0.32) +
      /* seitliche Randstacheln an der Panzerkante: kurze gekielte Kegel nach außen-unten, mit Schlagschatten */
      (F ? falten(T, [[[22, -7.4], [30, -6.4], [38, -6.3], [48, -7.2]]], "#0c0804", 1.2, 0.25) : "") +
      zacken([[23.4, -8.6, 1.9, 1.5, 120], [26.6, -8.2, 2, 1.6, 115], [29.8, -8, 2.1, 1.7, 110], [33, -7.9, 2.1, 1.7, 106], [36.2, -7.9, 2.1, 1.7, 104],
        [39.4, -8, 2.1, 1.7, 102], [42.6, -8.1, 2, 1.6, 100], [45.8, -8.4, 1.9, 1.5, 98], [48.8, -8.7, 1.7, 1.3, 96]], T.lg("zacke", [[0, "#8a7552"], [0.45, "#6a573c"], [1, "#2a2014"]])),
    randA: 0.45, randSzene: true,
  });
  /* Randstacheln am Schwanzgriff und am Flankenrand ragen über den Umriss hinaus */
  h += zacken([[20.4, -9, 1.9, 1.4, 150], [17, -8.5, 1.8, 1.4, 155], [13.8, -7.9, 1.6, 1.2, 158], [10.8, -7.3, 1.4, 1, 160]], T.lg("zacke"));

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

  /* Schwanzkeule: zwei große Osteoderme je Seite + kleine an der Spitze; Griff mit paarigen Seitenplatten */
  const KEULE = [[8.2, -8.8], [6.6, -9.4], [4.4, -9.6], [2.4, -9.3], [1, -8.4], [0.6, -7.4], [1.2, -6.4], [2.8, -5.9], [5, -5.8], [7, -6.2], [8.4, -7]];
  h += teil(T, KEULE, T.lg("keule", [[0, "#a48e68"], [0.5, "#7a6546"], [1, "#3e3121"]]), {
    innen: licht(T, 3.6, -8.6, 2.6, 1.2, -10, 0.6) + schatten(T, 4.6, -5.6, 3.6, 1, 0, 0.5) +
      `<g fill="${os}" stroke="#1a120a" stroke-width=".07" stroke-opacity=".5"><ellipse cx="5.4" cy="-7.7" rx="2.5" ry="1.7"/><ellipse cx="2.2" cy="-7.6" rx="1.5" ry="1.3"/><ellipse cx="7.8" cy="-8.4" rx="0.9" ry="0.6"/></g>` +
      falten(T, [[[3.8, -7.9], [5.4, -8.7], [7.2, -8.3]], [[1.4, -7.8], [2.2, -8.4], [3, -8]]], "#efe0bc", 0.2, 0.45) +
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
          [62.7, -9, 0.7], [55, -10.3, 0.9], [56.5, -10.6, 0.9], [60.2, -9.8, 0.8], [61.5, -8.8, 0.7], [62.4, -7.8, 0.6]])
          d += `M${r(x - 0.7 * g)} ${r(y)}l${r(0.4 * g)} ${r(-0.5 * g)} ${r(0.7 * g)} 0 ${r(0.4 * g)} ${r(0.5 * g)} ${r(-0.4 * g)} ${r(0.45 * g)} ${r(-0.7 * g)} 0z`;
        return `<path d="${d}" fill="#8a7550" fill-opacity=".5" stroke="#1a130a" stroke-width=".07" stroke-opacity=".6"/>`;
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
  s += relief(T, h, { f: 4, tiefe: 0.07, okt: 2 });
  s += T.augeReal ? T.augeReal(58.8, -9.6, 0.3, { iris: "#8a5a22", iris2: "#3a220a", offen: 0.6, lid: "#1d160d", winkel: -6 }) : T.auge(58.8, -9.6, 0.28, "#6b4a1c");
  s += `<ellipse cx="62.6" cy="-8.8" rx=".3" ry=".22" fill="#120e09"/>`;
  const k = 11, box = [0, -17.4, 63.4, 0];
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
  h += teil(T, hbF, fern, { vol: false, randAb: 0.5, randA: 0.3 }) + teil(T, vbF, fern, { vol: false, randAb: 0.5, randA: 0.3 });
  h += zehen(hbF[7][0] + 3.6, 1.9, 3, "#3e3424") + zehen(vbF[6][0] + 0.4, 1.4, 2, "#3e3424");

  /* Rumpf (tief), Schwanz (hoch, seitlich flach, waagerecht steif), Hals kurz und S-förmig: EIN Umriss */
  const RUECKEN = [[0, -21.6], [6, -23], [14, -25.2], [22, -27.4], [30, -29], [37, -29.6], [43, -29], [49, -27.4], [54, -25.6], [58, -24.2],
    [62, -24.4], [65.6, -26], [68, -27.2], [69.8, -28.6]];
  const R = [...RUECKEN, [72.6, -25.6], [71.6, -22.8], [69.6, -19.6], [66.8, -16.4], [63.4, -13], [59.6, -10.8], [52, -10], [45, -10.8], [39, -13.2],
    [34, -15], [30, -16.6], [24, -18], [16, -18.8], [8, -19.6], [1.4, -20.6]];
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
      schuppenFeld(T, [[31, -26], [48, -26]], [[31, -3], [48, -3]], 31, 48, 11, () => 0.36, { opD: 0.35, opH: 0.2 }) +
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
    [66.4, -33.4], [68.8, -32.2], [71.4, -30.6], [72, -29.6], [71.4, -28.4], [71.6, -26.6], [72.6, -25.2], [75.6, -23.8], [78.8, -22.8], [81, -22.4]];
  h += teil(T, K, T.lg("kopf", [[0, "#7a6a48"], [0.6, "#7e6e4c"], [1, "#54472e"]]), {
    innen:
      /* Kamm farbig (mögliches Signal), Röhrenwulst mit Licht oben und Schatten unten */
      fl(T, [[65, -35], [70, -34.4], [75.4, -30.6], [77.2, -28.2], [75.4, -27.6], [72.6, -29.4], [70, -31], [66, -33]], kamm, 1) +
      licht(T, 71, -32.6, 5, 0.7, -26, 0.6) + schatten(T, 70.4, -31.4, 5, 0.6, -28, 0.45) +
      falten(T, [[[75.6, -29.6], [71.6, -32], [67.4, -33.8]]], "#2a1408", 0.12, 0.45) +
      licht(T, 76, -27, 3, 1.1, -26, 0.5) + schatten(T, 76.6, -23.6, 4, 0.8, -16, 0.5) +
      schuppenFeld(T, [[66, -34.4], [72, -32], [78, -27.6], [82, -24.4]], [[66, -33], [72, -28], [78, -23], [82, -22.4]], 66, 81, 6, () => 0.2, { opD: 0.35, opH: 0.2 }) +
      /* Hornschnabel (Entenschnabel), Maulspalte bis unter das Auge, Wange über der Zahnbatterie */
      teilInnen(T, [[78.2, -26.6], [80, -25.6], [81, -24.6], [81.6, -23], [81, -22.4], [79.2, -22.6], [78.4, -23.6], [77.8, -25.2]], T.lg("schnabel", [[0, "#5e5444"], [0.5, "#3a3328"], [1, "#1e1a14"]])) +
      falten(T, [[[78.6, -23.4], [76.4, -24], [74.4, -25]], [[79.2, -26], [80.8, -24.4]]], "#120e08", 0.12, 0.55) +
      falten(T, [[[79.4, -26.2], [80.9, -24.6]]], "#fff", 0.12, 0.45) + schatten(T, 74.8, -27.2, 0.9, 0.6, 0, 0.5),
    randA: 0.45, randSzene: true,
  });
  s += relief(T, h, { f: 3.4, tiefe: 0.1, okt: 2 });
  s += T.augeReal ? T.augeReal(74.8, -27.2, 0.36, { iris: "#a66e28", iris2: "#46280c", offen: 0.66, lid: "#1d160d", winkel: -26 }) : T.auge(74.8, -27.2, 0.32, "#6b4a1c");
  s += `<ellipse cx="79.4" cy="-25.4" rx=".6" ry=".2" fill="#120e09" transform="rotate(-36 79.4 -25.4)"/>`;
  const k = 11.4, box = [0, -34.4, 81.6, 0];
  return { svg: DM(s, k), box: box.map((v) => Math.round(v * k)) };
}

module.exports = [
  { id: "triceratops", de: "der Triceratops", syl: "Tri-ZE-ra-tops", it: "il triceratopo", itSyl: "tri-che-RA-to-po", en: "triceratops",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 8.6, hoehe: 3.13, zeichne: triceratops },
  { id: "stegosaurus", de: "der Stegosaurus", syl: "Ste-go-SAU-rus", it: "lo stegosauro", itSyl: "ste-go-SAU-ro", en: "stegosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 8.99, hoehe: 3.75, zeichne: stegosaurus },
  { id: "ankylosaurus", de: "der Ankylosaurus", syl: "An-ky-lo-SAU-rus", it: "l'anchilosauro", itSyl: "an-chi-lo-SAU-ro", en: "ankylosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 6.97, hoehe: 1.91, zeichne: ankylosaurus },
  { id: "parasaurolophus", de: "der Parasaurolophus", syl: "Pa-ra-sau-RO-lo-phus", it: "il parasaurolofo", itSyl: "pa-ra-sau-RO-lo-fo", en: "parasaurolophus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 9.3, hoehe: 3.92, zeichne: parasaurolophus },
];
