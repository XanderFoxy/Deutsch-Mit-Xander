/* =====================================================================
   TIER-BIBLIOTHEK — PFLANZENFRESSENDE DINOSAURIER (FASSUNG 854)
   ---------------------------------------------------------------------
   XANDER (Auftrag vom 03.10., Antwort Funk 290): „Ich möchte perfekte
   Dinosaurier unmissverständlich auf höchstem Niveau wie in Jurassic Park".
   Arten: Triceratops, Brachiosaurus, Diplodocus, Stegosaurus, Ankylosaurus,
   Parasaurolophus. Gruppe „Dinosaurier", Lebensraum „Urzeit".

   Zeichnen in Einheiten von ~1 dm (eine <g transform="scale(k)">, k = 10–11,4,
   macht daraus Zentimeter, wie kern.js es will) – so bleiben die Pfade kurz.
   Blick nach rechts, Boden y = 0, EIN Licht oben links (Rückenkante hell,
   Kernschatten im unteren Rumpfdrittel, Bodenreflex). Keine Rausch-Textur:
   Schuppen als gezeichnete Felder in Zonen (Rücken grob, Bauch fein).
   Köpfe an echten Schädellängen gemessen (skal()). zeichne() liefert
   fuesse (Bodenschatten) und kopf (Ausschnitt für -kopf.png).
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
/* ferne Beine oben kappen: ihr oberes Ende liegt immer verdeckt im Rumpf und darf nie über den Umriss ragen */
const kappen = (pts, ymin) => pts.map((p) => { const q = [p[0], Math.max(p[1], ymin)]; if (p[2]) q.push(1); return q; });
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
  liste = liste.map(([x, y, b, h]) => [x - b * 0.08, y, b * 1.16, h * 0.82]);
  const d = liste.map(([x, y, b, h]) => `M${r(x)} ${r(y)}h${r(b)}c${r(b * 0.12)} ${r(-h * 0.5)} ${r(-b * 0.1)} ${r(-h)} ${r(-b * 0.45)} ${r(-h)}s${r(-b * 0.55)} ${r(h * 0.4)} ${r(-b * 0.55)} ${r(h)}z`).join("");
  const g = liste.map(([x, y, b, h]) => `M${r(x + b * 0.35)} ${r(y - h * 0.75)}q${r(b * 0.2)} ${r(-h * 0.1)} ${r(b * 0.35)} ${r(h * 0.15)}`).join("");
  return `<path d="${d}" fill="${farbe}" stroke="#1a140c" stroke-width=".1" stroke-opacity=".6"/><path d="${g}" fill="none" stroke="#fff" stroke-width=".1" stroke-opacity=".5" stroke-linecap="round"/>`;
}
/* weiche Farb-/Licht-/Schattenzone: bei voller Feinheit mit Weichzeichner (keine harten Kanten), in Szenen ohne */
function weichFilter(T) {
  const sd = T._weich || 0.7, id = T.id("weich" + Math.round(sd * 10));
  if (!T["_wf" + sd]) {
    T["_wf" + sd] = 1;
    T.def(`<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${sd}"/></filter>`);
  }
  return `url(#${id})`;
}
const fl = (T, pts, farbe, op) => T.form(pts, farbe, ` opacity="${op}"` + (T.fein && op < 1 ? ` filter="${weichFilter(T)}"` : ""));
/* EIN Licht oben links: helle Rückenkante, Kernschatten-Band im unteren Rumpfdrittel, Bodenreflex an der Bauchkante –
   folgt den Leitlinien oben/unten (Polylinien, x aufsteigend); weich gezeichnet. */
function lichtModell(T, oben, unten, x0, x1, o = {}) {
  const xs = [];
  for (let x = x0; x <= x1 + 0.01; x += (x1 - x0) / (T.fein ? 20 : 10)) xs.push(x);
  const band = (t0, t1) => [...xs.map((x) => { const a = yBei(oben, x), b = yBei(unten, x); return [x, a + (b - a) * t0]; }),
    ...xs.slice().reverse().map((x) => { const a = yBei(oben, x), b = yBei(unten, x); return [x, a + (b - a) * t1]; })];
  return (T.fein ? fl(T, band(-0.05, 0.14), "#fff6dc", o.rand != null ? o.rand : 0.16) : "") +
    fl(T, band(0.58, 0.93), "#0c0904", o.kern != null ? o.kern : 0.34) +
    (T.fein ? fl(T, band(0.94, 1.05), "#d8c49a", o.reflex != null ? o.reflex : 0.16) : "");
}
/* Kopf um einen Drehpunkt skalieren (Kopfgröße nach echter Schädellänge) */
const skal = (svg, cx, cy, f) => `<g transform="translate(${r(cx)} ${r(cy)}) scale(${f}) translate(${r(-cx)} ${r(-cy)})">${svg}</g>`;
/* Auge in einer Augenhöhle: weiche Mulde, Knochenwulst mit Licht darüber, Schlagschatten der Braue auf dem oberen Drittel */
function augeHoehle(T, x, y, rr, o = {}) {
  const w = o.winkel || 0;
  let s = schatten(T, x, y + rr * 0.1, rr * 2.2, rr * 1.7, w, 0.5) + licht(T, x - rr * 0.3, y - rr * 1.75, rr * 2.4, rr * 0.75, w - 6, 0.7);
  s += T.augeReal ? T.augeReal(x, y, rr, Object.assign({ iris: "#a8742c", iris2: "#46280c", offen: 0.62, lid: "#1d160d" }, o)) : T.auge(x, y, rr, o.iris || "#6b4a1c");
  s += `<ellipse cx="${r(x)}" cy="${r(y - rr * 0.78)}" rx="${r(rr * 1.6)}" ry="${r(rr * 0.5)}"${w ? ` transform="rotate(${w} ${r(x)} ${r(y)})"` : ""} fill="${T.rg("braue", [[0, "#000", 0.55], [0.7, "#000", 0.2], [1, "#000", 0]])}"/>`;
  s += `<path d="M${r(x - rr * 1.45)} ${r(y - rr * 0.15)}Q${r(x)} ${r(y - rr * 1.25)} ${r(x + rr * 1.5)} ${r(y - rr * 0.05)}"${w ? ` transform="rotate(${w} ${r(x)} ${r(y)})"` : ""} fill="none" stroke="#120c06" stroke-width="${r(rr * 0.28) || 0.1}" stroke-opacity=".55" stroke-linecap="round"/>`;
  return s;
}
/* weiches Licht / weicher Schatten als Ellipse mit Radialverlauf (Muskelpakete, Kernschatten) */
function licht(T, cx, cy, rx, ry, rot, op, dunkel) {
  if (!T.fein && op < 0.4) return "";   // in Szenen nur die kräftigen Licht-/Schattenformen
  const f = dunkel ? T.rg("dunkel", [[0, "#000", 0.6], [0.6, "#000", 0.25], [1, "#000", 0]]) : T.rg("licht", [[0, "#fff8e8", 0.32], [0.55, "#fff8e8", 0.14], [1, "#fff8e8", 0]]);
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
      const ya = yBei(oben, x), yb = yBei(unten, x), k = Math.min(groesse(x, t), Math.abs(yb - ya) / n * 1.1) * (0.75 + T.rnd() * 0.5);
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
    innen: licht(T, x0 + 0.55 * w, y0 + 0.32 * hh, 0.32 * w, 0.2 * hh, -8, 0.32 * k) + schatten(T, x0 + 0.16 * w, y0 + 0.62 * hh, 0.14 * w, 0.3 * hh, -6, 0.45) +
      (T.fein ? licht(T, x0 + 0.68 * w, y0 + 0.56 * hh, 0.12 * w, 0.06 * hh, 0, 0.28 * k) + licht(T, x1 - 0.1 * w, y0 + 0.78 * hh, 0.07 * w, 0.16 * hh, 0, 0.22 * k) +
        schatten(T, x0 + 0.5 * w, y1 - 0.02 * hh, 0.45 * w, 0.05 * hh, 0, 0.35) : "") +
      falten(T, ringe, "#0c0905", Math.max(0.12, w * 0.012), 0.3) +
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
  /* Umrisslinien wirken wie Aufkleber: nur die Hauptsilhouette bekommt eine sehr feine Kante (randSzene), Teile keine */
  const mitRand = o.rand !== false && o.randSzene === true;
  const strich = mitRand ? ` stroke="${rs}" stroke-opacity="${Math.min(0.22, o.randA != null ? o.randA : 0.22)}" stroke-width="${o.rw || 0.1}" stroke-linejoin="round"` : "";
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
   WERKZEUG RUNDE 2 (Kritik Runde 1: „Sack auf Säulen", „Fischschuppen-Tapete", „Aufkleber-Kanten", „kein Licht")
   - masse(): EIN Körper aus mehreren Formen (Rumpf + nahe Beine + Hals + Kopf) als gemeinsamer Clip – keine Nähte,
     keine halbtransparenten Teile, keine Umrisslinien. Füllung mit Verlauf in Nutzerkoordinaten.
   - Licht: EIN Licht oben links. Glanzband an der Rückenkante, Schattengrenze bei ~60 % der Höhe, Kernschatten
     im unteren Drittel (−40 %), schmaler warmer Bodenreflex; Okklusion an allen Ansätzen. Alles weichgezeichnet.
   - Haut: nicht überlappende, gefüllte Vieleck-Tuberkel (Licht oben links, dunkle Fuge unten rechts) als
     kachelbares Muster in Zonen (Rücken grob, Flanke mittel, Bauch/Gelenke/Gesicht fein), im Kernschatten
     ausgeblendet; in Szenen (T.fein = false) keine Textur.
   ===================================================================== */
/* kompakte Zahl: 0,1 genau, ohne führende Null */
let PR = 10;   // Genauigkeit: 1/PR Einheiten (fein 1 cm, in Szenen 5 cm – dort unsichtbar, spart Bytes)
const genau = (T) => { PR = T.fein ? 10 : 2; };
const n1 = (v) => { const a = Math.round(v * PR) / PR; return (a < 0 ? "-" : "") + String(Math.abs(a)).replace(/^0\./, "."); };
const zug = (arr) => arr.map(n1).join(" ").replace(/ -/g, "-");
/* glatte Kurve (Catmull-Rom wie T.glatt), aber mit RELATIVEN Zügen und kompakten Zahlen – etwa 40 % kürzer.
   [x, y, 1] = harte Ecke. Gerundet wird kumulativ, damit sich keine Fehler aufsummieren. */
function gl(pts, zu = true) {
  const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const rd = (v) => Math.round(v * PR) / PR;
  let cx = rd(pts[0][0]), cy = rd(pts[0][1]), d = "M" + zug([cx, cy]) + "c";
  const teile = [];
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    const ex = rd(p2[0]), ey = rd(p2[1]);
    teile.push(zug([c1[0] - cx, c1[1] - cy, c2[0] - cx, c2[1] - cy, ex - cx, ey - cy]));
    cx = ex; cy = ey;
  }
  return d + teile.join(" ").replace(/ -/g, "-") + (zu ? "z" : "");
}
/* Weichzeichner (mit sRGB-Farbraum, sonst Farbstich) – sd in Zeicheneinheiten */
function weich(T, sd) {
  sd = [0.06, 0.12, 0.2, 0.3, 0.45, 0.65, 0.9, 1.3, 1.8, 2.6, 3.6].reduce((a, b) => (Math.abs(b - sd) < Math.abs(a - sd) ? b : a));
  const k = String(sd).replace(".", "_"), id = T.id("w" + k);
  if (!T["_w" + k]) {
    T["_w" + k] = 1;
    T.def(`<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${sd}"/></filter>`);
  }
  return `url(#${id})`;
}
/* Verlauf in Nutzerkoordinaten (für mehrere Formen derselbe Farbverlauf) */
const ulg = (T, name, stops, x1, y1, x2, y2) => T.lg(name, stops, x1, y1, x2, y2, ` gradientUnits="userSpaceOnUse"`);
/* weiche Fläche (Licht, Schatten, Farbzone) */
const blob = (T, pts, farbe, op, sd) => (!T.fein && op < 0.25 ? "" : `<path d="${gl(pts)}" fill="${farbe}" opacity="${op}" filter="${weich(T, sd || 0.8)}"/>`);
/* weiche Linie (Muskelkante, Falte, Glanzgrat) */
const strich = (T, listen, farbe, w, op, sd) => (!T.fein && op < 0.3) ? "" : `<path d="${listen.map((p) => gl(p, false)).join("")}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round"${sd ? ` filter="${weich(T, sd)}"` : ""}/>`;
/* weiche Ellipse (Muskelpaket, Okklusion) */
const oval = (T, cx, cy, rx, ry, rot, farbe, op, sd) => (!T.fein && op < 0.3) ? "" :
  `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(rx)}" ry="${n1(ry)}"${rot ? ` transform="rotate(${rot} ${n1(cx)} ${n1(cy)})"` : ""} fill="${farbe}" opacity="${op}" filter="${weich(T, sd || Math.max(0.3, Math.min(rx, ry) * 0.6))}"/>`;
const HELL = "#fff3d6", DUNKEL = "#0a0703";
/* Volumen (kern.js T.volumen, ANLEITUNG 13): Rundungs-Licht aus der Silhouette (links oben Licht, Kernschatten zur
   Unterkante, Reflex). Als eigene Licht-Ebene: die Silhouette in neutralem Grau mit T.volumen gefiltert und per
   „soft-light" über das Teil gelegt – so wird das Schuppenmuster nicht mitgefiltert (kein Moiré), und der ganze
   Körper (Rumpf + Beine + Hals) bleibt EINE Form ohne Naht. weich in Zeicheneinheiten (≈ 20–30 % der Teildicke).
   In Szenen (T.fein = false) entfällt sie (kern liefert „none"). */
function volLage(T, name, formen, weichE, tiefe = 5, op = 1) {
  if (!T.fein) return "";
  /* wie T.volumen (kern.js), aber die Lichtkarte wird nach dem Beleuchten noch einmal weichgezeichnet –
     sonst zeichnet die 8-Bit-Stufung des geblurrten Alphas „Holzmaserung" (Höhenlinien) in große Flächen */
  const id = T.id("vl" + name), el = 50, amb = 0.3;
  if (!T["_vl" + name]) {
    T["_vl" + name] = 1;
    T.def(`<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">` +
      `<feGaussianBlur in="SourceAlpha" stdDeviation="${weichE}" result="b"/>` +
      `<feDiffuseLighting in="b" surfaceScale="${tiefe}" diffuseConstant="1" lighting-color="#fff" result="d"><feDistantLight azimuth="225" elevation="${el}"/></feDiffuseLighting>` +
      `<feGaussianBlur in="d" stdDeviation="${n1(weichE * 0.35)}" result="d2"/>` +
      `<feComposite in="d2" in2="SourceGraphic" operator="arithmetic" k1="${Math.round((1 - amb) / Math.sin(el * Math.PI / 180) * 1e4) / 1e4}" k2="0" k3="${amb}" k4="0" result="m"/>` +
      `<feComposite in="m" in2="SourceGraphic" operator="in"/></filter>`);
  }
  return `<g filter="url(#${id})" style="mix-blend-mode:soft-light" opacity="${op}">${formen.map((q) => `<path d="${typeof q === "string" ? q : gl(q)}" fill="#808080"/>`).join("")}</g>`;
}
/* Körpermasse: Formen (Punktlisten oder Pfade) als gemeinsamer Clip; Grundfarbe als Rechteck; innen = Licht/Haut */
function masse(T, formen, fill, innen) {
  T._m = (T._m || 0) + 1;
  const id = T.id("m" + T._m), alle = [];
  const ds = formen.map((f) => { if (typeof f === "string") return f; alle.push(...f); return gl(f); });
  T.def(`<clipPath id="${id}">${ds.map((d) => `<path d="${d}"/>`).join("")}</clipPath>`);
  const [x0, y0, x1, y1] = T.box(alle);
  return `<g clip-path="url(#${id})"><rect x="${n1(x0 - 2)}" y="${n1(y0 - 2)}" width="${n1(x1 - x0 + 4)}" height="${n1(y1 - y0 + 4)}" fill="${fill}"/>${innen || ""}</g>`;
}
/* Licht eines liegenden Zylinders (Rumpf, Hals, Schwanz) zwischen Oberkante und Unterkante (Polylinien, x aufsteigend) */
function rumpfLicht(T, oben, unten, x0, x1, o = {}) {
  const xs = [];
  const st = T.fein ? 22 : 9;
  for (let i = 0; i <= st; i++) xs.push(x0 + (x1 - x0) * i / st);
  const band = (t0, t1) => [...xs.map((x) => { const a = yBei(oben, x), b = yBei(unten, x); return [x, a + (b - a) * t0]; }),
    ...xs.slice().reverse().map((x) => { const a = yBei(oben, x), b = yBei(unten, x); return [x, a + (b - a) * t1]; })];
  const tief = o.tiefe || 10, sd = Math.max(0.5, tief * 0.07), f = T.fein ? 0.75 : 1;   // fein: Volumen-Ebene trägt mit
  return blob(T, band(-0.1, 0.2), HELL, (o.glanz != null ? o.glanz : 0.3) * f, sd) +
    blob(T, band(0.62, 0.99), DUNKEL, (o.kern != null ? o.kern : 0.48) * f, sd * 1.3) +
    (T.fein ? blob(T, band(0.88, 0.99), "#c9a874", o.reflex != null ? o.reflex : 0.2, sd * 0.4) : "");
}
/* Licht eines stehenden Zylinders (Bein): Achse von oben nach unten [[x, y, breite], …]; Licht oben links */
function beinLicht(T, achse, o = {}) {
  const lin = (u) => achse.map(([x, y, w]) => [x + u * w, y]);
  const w = achse.reduce((a, q) => a + q[2], 0) / achse.length;
  return strich(T, [lin(-0.12)], HELL, w * 0.32, o.glanz != null ? o.glanz : 0.28, w * 0.14) +
    strich(T, [lin(0.42)], DUNKEL, w * 0.38, o.kern != null ? o.kern : 0.5, w * 0.12) +
    strich(T, [lin(-0.5)], DUNKEL, w * 0.12, 0.25, w * 0.06);
}
/* Bein als Zylinder: das Bein (unter der Bauchlinie ycut abgeschnitten) als weich gezeichnete Fläche mit
   waagerechtem Verlauf – links Licht, rechts Kernschatten, ganz links leichter Randabfall; oben im Bauchschatten. */
function zylinder(T, pts, ycut, o = {}) {
  const g = T.lg("zyl", [[0, "#000", 0.22], [0.16, "#fff3d6", 0.2], [0.4, "#fff3d6", 0.02], [0.68, "#000", 0.26], [1, "#000", 0.6]], 0, 0, 1, 0);
  const [x0, , x1] = T.box(pts), sd = Math.max(0.2, (x1 - x0) * 0.05);
  /* oben weich einblenden (keine waagerechte Kante am Bauch) */
  const m = T.id("zylM");
  if (!T._zylM) {
    T._zylM = 1;
    T.def(`<linearGradient id="${m}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".22" stop-color="#fff"/></linearGradient>` +
      `<mask id="${m}" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#${m}g)"/></mask>`);
  }
  /* die Einblendung liegt über der Bauchlinie (im Körper), damit unter dem Bauch kein helles Band bleibt */
  return `<path d="${gl(kappen(pts, ycut * 1.3))}" fill="${g}" opacity="${o.op || 1}" mask="url(#${m})" filter="${weich(T, sd)}"/>`;
}
/* Hautfalten als Paar: dunkle Kerbe + Lichtkante darunter */
function falten2(T, listen, w, op = 1) {
  if (!T.fein) return "";
  const unter = listen.map((p) => p.map(([x, y]) => [x + w * 0.3, y + w * 1.1]));
  return strich(T, listen, DUNKEL, w, 0.42 * op, w * 0.35) + strich(T, unter, HELL, w * 0.7, 0.22 * op, w * 0.3);
}
/* kachelbares Tuberkel-Muster (Einheitskachel, Zellradius 1): Sechseck-Raster mit Zufall, je Zelle gefüllt (heller),
   Lichtkante oben links, dunkle Fuge unten rechts. EINMAL je Art in den defs; Zonen leiten davon ab (href) und
   skalieren/drehen nur – so kostet jede weitere Zone ein paar Bytes. */
function tub(T, name, R, o = {}) {
  if (!T.fein) return "";
  const basis = T.id("tubK");
  if (!T._tubK) {
    T._tubK = 1;
    const sp = 9, ze = 8, dx = Math.sqrt(3), dy = 1.5, W = sp * dx, H = ze * dy, zellen = [];
    for (let j = 0; j < ze; j++) for (let i = 0; i < sp; i++) {
      const g = 0.72 + T.rnd() * 0.42, cx = i * dx + (j % 2) * dx / 2 + (T.rnd() - 0.5) * 0.55, cy = j * dy + (T.rnd() - 0.5) * 0.5;
      const nE = T.rnd() < 0.35 ? 5 : 6;
      zellen.push([cx, cy, Array.from({ length: 6 }, (_, k) => { const kk = Math.min(k, nE - 1), a = (kk * 360 / nE - 90 + (T.rnd() - 0.5) * 26) * Math.PI / 180, q = g * (0.74 + T.rnd() * 0.3); return [Math.cos(a) * q, Math.sin(a) * q]; })]);
    }
    let fz = "", lk = "", fu = "";
    const rel = (P) => P.slice(1).map((q, k) => zug([q[0] - P[k][0], q[1] - P[k][1]])).join(" ");
    for (const [cx, cy, v] of zellen) for (const ox of [-W, 0, W]) for (const oy of [-H, 0, H]) {
      const x = cx + ox, y = cy + oy;
      if (x < -1.2 || x > W + 1.2 || y < -1.2 || y > H + 1.2) continue;
      const P = v.map(([a2, b2]) => [x + a2, y + b2]);
      fz += "M" + zug(P[0]) + "l" + rel(P) + "z";
      const L = [P[3], P[4], P[5], P[0]], U = [P[0], P[1], P[2], P[3]];
      lk += "M" + zug(L[0]) + "l" + rel(L);
      fu += "M" + zug(U[0]) + "l" + rel(U);
    }
    T.def(`<pattern id="${basis}" patternUnits="userSpaceOnUse" width="${n1(W)}" height="${n1(H)}">` +
      `<path d="${fz}" fill="#fff1d0" fill-opacity=".07"/>` +
      `<path d="${fu}" fill="none" stroke="#0a0703" stroke-opacity=".5" stroke-width=".24" stroke-linejoin="round"/>` +
      `<path d="${lk}" fill="none" stroke="#fff1d0" stroke-opacity=".26" stroke-width=".14" stroke-linejoin="round"/></pattern>`);
  }
  const id = T.id(name);
  if (!T["_p" + name]) {
    T["_p" + name] = 1;
    T.def(`<pattern id="${id}" href="#${basis}" patternTransform="${o.drehung ? `rotate(${o.drehung}) ` : ""}scale(${n1(R * 100) / 100}${o.sy ? " " + Math.round(R * o.sy * 100) / 100 : ""})"/>`);
  }
  return `url(#${id})`;
}
/* Textur in eine Zone legen: weiche Maske aus der Zonenform (Deckkraft op), optional Schattenzone, in der die Textur
   ausgeblendet wird (Kernschatten). Nur bei voller Feinheit. */
function haut(T, muster, zone, op, o = {}) {
  if (!T.fein) return "";
  T._h = (T._h || 0) + 1;
  const id = T.id("h" + T._h), [x0, y0, x1, y1] = T.box(zone), sd = o.sd || 0.35;
  T.def(`<mask id="${id}" maskUnits="userSpaceOnUse" x="${n1(x0 - 3)}" y="${n1(y0 - 3)}" width="${n1(x1 - x0 + 6)}" height="${n1(y1 - y0 + 6)}">` +
    `<path d="${gl(zone)}" fill="#fff" fill-opacity="${op}" filter="${weich(T, sd)}"/>` +
    (o.schatten ? `<path d="${gl(o.schatten)}" fill="#000" fill-opacity="${o.schattenOp || 0.75}" filter="${weich(T, sd * 2)}"/>` : "") + `</mask>`);
  return `<rect x="${n1(x0 - 1)}" y="${n1(y0 - 1)}" width="${n1(x1 - x0 + 2)}" height="${n1(y1 - y0 + 2)}" fill="${muster}" mask="url(#${id})"/>`;
}
/* Band zwischen zwei Leitlinien (für Zonen): t0..t1 der Höhe, x0..x1 */
function zoneBand(oben, unten, x0, x1, t0, t1, n = 12) {
  const xs = Array.from({ length: n + 1 }, (_, i) => x0 + (x1 - x0) * i / n);
  return [...xs.map((x) => { const a = yBei(oben, x), b = yBei(unten, x); return [x, a + (b - a) * t0]; }),
    ...xs.slice().reverse().map((x) => { const a = yBei(oben, x), b = yBei(unten, x); return [x, a + (b - a) * t1]; })];
}
/* Merkmals-Schuppen (Rosetten): große Kegelschuppe mit Kranz kleiner Schuppen, Licht oben links. Nur fein. */
function rosetten(T, liste, farbe) {
  if (!T.fein) return "";
  let kz = "", kl = "", ks = "", sch = "";
  for (const [x, y, R] of liste) {
    const P = Array.from({ length: 6 }, (_, k) => { const a = (k * 60 - 90 + (T.rnd() - 0.5) * 22) * Math.PI / 180, q = R * (0.85 + T.rnd() * 0.25); return [x + Math.cos(a) * q, y + Math.sin(a) * q * 0.85]; });
    kz += "M" + P.map(zug).join("L") + "Z";
    sch += "M" + P.map(([a, b]) => zug([a + R * 0.22, b + R * 0.28])).join("L") + "Z";
    ks += "M" + [P[0], P[1], P[2], P[3]].map(zug).join("L");
    kl += "M" + [P[3], P[4], P[5], P[0]].map(zug).join("L");
  }
  return `<path d="${sch}" fill="${DUNKEL}" opacity=".2" filter="${weich(T, liste[0][2] * 0.2)}"/>` +
    `<path d="${kz}" fill="${T.rg("rosette", [[0, "#f2e2bc", 0.42], [0.5, farbe, 0.36], [1, "#3a2c1c", 0.22]], 0.32, 0.28, 0.8)}"/>` +
    `<path d="${ks}" fill="none" stroke="${DUNKEL}" stroke-opacity=".32" stroke-width="${n1(liste[0][2] * 0.13) || 0.1}" stroke-linejoin="round"/>` +
    `<path d="${kl}" fill="none" stroke="${HELL}" stroke-opacity=".3" stroke-width="${n1(liste[0][2] * 0.1) || 0.1}" stroke-linejoin="round"/>`;
}
/* Hufe: breite, flache, gerundet-dreieckige Hornkappen, matt; hellere abgenutzte Unterkante, dunkler Hautwulst oben,
   Kontaktschatten. liste: [x (Mitte), breite, höhe, neigung]  */
function hufe(T, liste, horn = "#5a4e3c") {
  let d = "", k = "", h = "";
  for (const [x, b, hh, ng = 0] of liste) {
    d += `M${n1(x - b / 2)} 0C${n1(x - b * 0.5)} ${n1(-hh * 0.7)} ${n1(x - b * 0.15 + ng)} ${n1(-hh)} ${n1(x + ng)} ${n1(-hh)}C${n1(x + b * 0.25 + ng)} ${n1(-hh)} ${n1(x + b * 0.52)} ${n1(-hh * 0.5)} ${n1(x + b * 0.55)} 0Z`;
    k += `M${n1(x - b * 0.42)} ${n1(-hh * 0.12)}L${n1(x + b * 0.48)} ${n1(-hh * 0.1)}`;
    h += `M${n1(x - b * 0.42)} ${n1(-hh * 0.82)}Q${n1(x + ng)} ${n1(-hh * 1.18)} ${n1(x + b * 0.4)} ${n1(-hh * 0.75)}`;
  }
  const w0 = liste[0][2];
  return `<path d="${d}" fill="${horn}"/>` + (T.fein ? `<path d="${d}" fill="${T.lg("hufL", [[0, "#000", 0.45], [0.5, "#000", 0.1], [0.85, "#fff", 0.04], [1, "#cdbb96", 0.22]])}"/>` : "") +
    `<path d="${k}" stroke="#c8b796" stroke-opacity=".4" stroke-width="${n1(w0 * 0.14) || 0.1}"/>` +
    `<path d="${h}" fill="none" stroke="${DUNKEL}" stroke-opacity=".45" stroke-width="${n1(w0 * 0.22) || 0.1}" stroke-linecap="round"/>`;
}
/* Kontaktschatten unter einem Fuß (eng, dunkel, weich) */
const kontakt = (T, x, b) => `<ellipse cx="${n1(x)}" cy="0" rx="${n1(b * 0.6)}" ry="${n1(Math.max(0.15, b * 0.07))}" fill="#000" opacity=".55" filter="${weich(T, Math.max(0.12, b * 0.05))}"/>`;
/* Auge in der Augenhöhle: dunkler Höhlenring, knöcherner Brauenwulst mit Lichtkante, Schlagschatten auf das
   obere Drittel, dicke beschuppte Lider, Reptilienauge (T.augeReal), Lidschuppen-Kranz. */
function auge2(T, x, y, rr, o = {}) {
  const w = o.winkel || 0, rot = w ? ` transform="rotate(${w} ${n1(x)} ${n1(y)})"` : "";
  let s = oval(T, x, y + rr * 0.1, rr * 2.3, rr * 1.8, w, DUNKEL, 0.42, rr * 0.5);
  /* Brauenwulst: helle Oberkante, darunter tiefer Schatten */
  s += `<path d="M${n1(x - rr * 2)} ${n1(y - rr * 0.6)}Q${n1(x - rr * 0.2)} ${n1(y - rr * 2.4)} ${n1(x + rr * 2.1)} ${n1(y - rr * 0.9)}"${rot} fill="none" stroke="${HELL}" stroke-opacity=".22" stroke-width="${n1(rr * 0.5)}" stroke-linecap="round" filter="${weich(T, rr * 0.18)}"/>`;
  s += T.augeReal ? T.augeReal(x, y, rr, Object.assign({ iris: "#b07a2e", iris2: "#3e240c", offen: 0.56, lid: "#1a130b" }, o)) : T.auge(x, y, rr, o.iris || "#6b4a1c");
  s += `<ellipse cx="${n1(x)}" cy="${n1(y - rr * 0.62)}" rx="${n1(rr * 1.5)}" ry="${n1(rr * 0.42)}"${rot} fill="#000" opacity=".5" filter="${weich(T, rr * 0.16)}"/>`;
  /* dicke Lidwülste */
  s += `<path d="M${n1(x - rr * 1.5)} ${n1(y - rr * 0.1)}Q${n1(x)} ${n1(y - rr * 1.3)} ${n1(x + rr * 1.55)} ${n1(y - rr * 0.05)}M${n1(x - rr * 1.4)} ${n1(y + rr * 0.15)}Q${n1(x)} ${n1(y + rr * 1.05)} ${n1(x + rr * 1.45)} ${n1(y + rr * 0.1)}"${rot} fill="none" stroke="#2a2014" stroke-opacity=".55" stroke-width="${n1(rr * 0.32)}" stroke-linecap="round"/>`;
  if (T.fein) {
    let d = "";
    for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, px = x + Math.cos(a) * rr * 1.75, py = y + Math.sin(a) * rr * 1.35; d += `M${n1(px - rr * 0.16)} ${n1(py)}a${n1(rr * 0.16)} ${n1(rr * 0.14)} 0 1 0 ${n1(rr * 0.32)} 0a${n1(rr * 0.16)} ${n1(rr * 0.14)} 0 1 0 ${n1(-rr * 0.32)} 0`; }
    s += `<path d="${d}"${rot} fill="none" stroke="${DUNKEL}" stroke-opacity=".3" stroke-width="${n1(rr * 0.06) || 0.1}"/>`;
  }
  return s;
}

/* Horn (Kegel mit Zylinderlicht): Basis (bx, by), Richtung winkel (Grad, 0 = nach rechts, −90 = nach oben), Länge L,
   Basisbreite B, Krümmung kr (>0 Spitze nach unten), Spitzenbreite sp. Liefert { pts, svg }. Material: raues
   dunkles Keratin an der Basis → elfenbeinhelle Spitze, Längsriefen, Glanz bei 25 % (oben), Kernschatten bei 75 %. */
function hornForm(T, name, bx, by, winkel, L, B, kr = 0, sp = 0.04, farben) {
  const a = winkel * Math.PI / 180, d = [Math.cos(a), Math.sin(a)], nv = [Math.sin(a), -Math.cos(a)];   // nv: „oben"
  const P = (t, u) => { const w = B / 2 * Math.max(sp, Math.pow(1 - t, 0.62) * (1 - 0.15 * t)), c = [bx + d[0] * L * t - nv[0] * kr * L * t * t, by + d[1] * L * t - nv[1] * kr * L * t * t]; return [c[0] + nv[0] * w * u, c[1] + nv[1] * w * u]; };
  const ts = [0, 0.18, 0.36, 0.54, 0.7, 0.84, 0.94, 1];
  const pts = [...ts.map((t) => P(t, 1)), ...ts.slice().reverse().map((t) => P(t, -1))];
  pts[ts.length - 1].push(1);
  const lin = (u, t0 = 0.02, t1 = 0.96) => ts.filter((t) => t >= t0 && t <= t1).map((t) => P(t, u));
  const g = ulg(T, name, farben || [[0, "#3d3427"], [0.3, "#7d7058"], [0.7, "#cfc3a3"], [1, "#e4dbc2"]], bx, by, bx + d[0] * L, by + d[1] * L);
  const innen = (T.fein ? strich(T, [lin(0.5)], HELL, B * 0.16, 0.5, B * 0.05) : "") + strich(T, [lin(-0.48)], DUNKEL, B * 0.3, 0.5, B * 0.08) +
    (T.fein ? strich(T, [lin(-0.88, 0.05, 0.9)], "#e8dcc0", B * 0.07, 0.3, B * 0.03) : "") +
    (T.fein ? strich(T, [-0.6, -0.25, 0.1, 0.4, 0.7].map((u) => lin(u, 0.04, 0.75)), DUNKEL, B * 0.025, 0.25) : "");
  return { pts, svg: masse(T, [pts], g, innen) };
}
/* =====================================================================
   TRICERATOPS
   RECHERCHE: Triceratops horridus/prorsus, Oberkreide (Maastricht,
   Hell-Creek-Formation), 66 Mio. Jahre. Größte Tiere 7,9–9 m lang,
   6–12 t, Rücken über der Hüfte ~2,8–3 m. Schädel bis 2,5 m (mit Schild).
   Kurzer, massiver, GESCHLOSSENER Nackenschild (ohne Fenster) mit 19–26
   flachen, breiten Randzacken (Epoccipitalia) bei Erwachsenen; zwei
   Stirnhörner bis ~1 m über den Augen, kurzes Nasenhorn auf einem Nasen-
   wulst, papageienartiger Hornschnabel (Rostrale hakt über das Prädentale),
   hautbedecktes Wangenhorn (Epijugale) nach unten-hinten, Ornithischier-
   Wangen (Mundlinie steigt zum Auge an). Stellung zwischen aufrecht und
   gespreizt: Ellbogen gebeugt und leicht nach außen, Unterarm schräg nach
   vorn (wie beim Nashorn); Vorderbeine kürzer, Hand mit drei behuften Fingern
   (IV/V klein), Fuß mit vier behuften Zehen, fleischige Ferse. Hüfte höchster
   Punkt, Rücken fällt zur Schulter ab; Schwanz mittellang, frei getragen,
   spitz auslaufend. Haut („Lane", HMNS): kleine sechseckige Tuberkel und
   in lockeren Reihen große (>10 cm) Merkmals-Schuppen mit Kegelmitte.
   ===================================================================== */
function triceratops(T) {
  genau(T);
  const F = T.fein;
  let s = "";
  /* ---------- Formen (1 Einheit = 10 cm) ---------- */
  const OBEN = [[0, -11.4], [4, -13.1], [8, -15.2], [12, -17.6], [16, -20.4], [20, -23.4], [24, -26], [28, -27.7], [32, -28.3], [36, -28.1],
    [40, -27.2], [44, -25.9], [48, -24.4], [52, -23], [56, -21.9], [59.5, -21.2], [63, -19.6], [66.5, -16.8], [69.5, -13.4]];
  const UNTEN = [[0, -11.3], [2.5, -11.5], [6, -12.4], [10, -13.6], [14, -14.6], [18, -15.4], [21.5, -15.2], [24, -14.2], [27, -13.4], [31, -13],
    [36, -12.1], [42, -11.6], [48, -11.7], [54, -12.4], [58, -12.6], [61, -11.8], [64.6, -10.4], [68.4, -9.2], [71.6, -9]];
  const RUMPF = [[0, -11.35, 1], ...OBEN.slice(1), [72.4, -10.4], ...UNTEN.slice().reverse().slice(0, -1)];
  /* Hinterbein: Oberschenkel-Muskelbauch, Knie vorn, Unterschenkel schräg nach hinten, fleischige Ferse, vier Hufzehen */
  const HB = [[24, -22], [24.4, -17.6], [26, -14], [28.6, -11.4], [30.2, -8.6], [30.9, -5.8], [31, -3.8], [30.6, -2], [31.2, -0.6], [32.2, 0, 1], [40.4, 0, 1],
    [40.6, -0.8], [39.2, -1.9], [37, -2.7], [35.4, -4.2], [35.6, -7], [36.8, -9.4], [38.4, -11.2], [38.6, -13.4], [38, -17.2], [36.4, -21.6], [32, -24]];
  /* Vorderbein (kürzer): Oberarm nach hinten-unten, Ellbogen-Knick nach hinten-außen, Unterarm schräg nach vorn */
  const VB = [[51.5, -19.5], [50.6, -15], [50.9, -11.6], [52.2, -9.4], [53.4, -6.6], [54, -3.8], [53.6, -1.5], [53.8, 0, 1], [60.2, 0, 1],
    [60.5, -0.9], [59.3, -1.9], [58.3, -3.7], [58.2, -6.8], [57.4, -9.8], [58, -12.6], [59.2, -15.8], [58.8, -20.4]];
  const schieb = (p, dx) => p.map((q) => { const z = [q[0] + dx, q[1]]; if (q[2]) z.push(1); return z; });
  const hbF = schieb(HB, 3.6), vbF = schieb(VB, -3.4);

  /* ---------- ferne Beine (andere Körperseite): 20 % dunkler, weniger gesättigt, modelliert ---------- */
  const fernF = ulg(T, "fern", [[0, "#3e3122"], [0.6, "#45382a"], [1, "#2a2219"]], 0, -14, 0, 0);
  s += masse(T, [kappen(hbF, -16), kappen(vbF, -15)], fernF,
    zylinder(T, hbF, -12.5) + zylinder(T, vbF, -12.5) +
    blob(T, [[30, -15], [62, -15], [62, -9], [30, -9]], DUNKEL, 0.5, 1.4) +
    haut(T, tub(T, "tL", 0.19), [[33, -14], [42, -14], [42, 0], [33, 0]], 0.35) + haut(T, tub(T, "tL"), [[48, -14], [58, -14], [58, 0], [48, 0]], 0.35));
  s += hufe(T, [[38.3, 2, 1.1], [40.3, 2.1, 1.2], [42.3, 1.9, 1.1]], "#3a3226") + hufe(T, [[51.6, 1.7, 1], [53.3, 1.8, 1.1], [55, 1.7, 1]], "#3a3226");

  /* ---------- Körper: Rumpf + nahe Beine + Hals als EINE Masse ---------- */
  const grund = ulg(T, "haut", [[0, "#4e3c25"], [0.45, "#6b5536"], [0.8, "#7c6643"], [1, "#6e5a3c"]], 0, -28.5, 0, -8);
  const kernZone = zoneBand(OBEN, UNTEN, 0, 72, 0.62, 1.1);
  let k = "";
  /* Gegenschattierung + unregelmäßige dunkle Rückenflecken (keine Bänder) */
  k += F ? [[18, -22.6, 3.4, 1.4, -24], [27, -26.2, 3, 1.3, -8], [35.4, -26.6, 2.6, 1.2, 4], [43, -24.8, 3.2, 1.3, 12], [50.6, -22.6, 2.4, 1.1, 14], [13, -18.6, 2.2, 0.9, -30]]
    .map(([x, y, a, b, w]) => oval(T, x, y, a, b, w, "#2a2012", 0.32, 0.5)).join("") : "";
  /* EIN Licht oben links: Glanzband, Kernschatten, Bodenreflex */
  k += rumpfLicht(T, OBEN, UNTEN, 0, 72, { tiefe: 16, glanz: 0.42, kern: 0.62 });
  /* Muskelmassen: Schwanzwurzel (Caudofemoralis), Oberschenkel-Muskelbauch, Rippenwölbung, Schulterblattwulst */
  k += oval(T, 31.4, -19.4, 6.2, 5.6, -10, HELL, 0.28, 1.6) + oval(T, 22, -21.4, 6, 2.2, -36, HELL, 0.22, 1) +
    oval(T, 45, -21.6, 7, 3.6, -8, HELL, 0.2, 1.6) + oval(T, 55.6, -18.6, 3.4, 2.6, -20, HELL, 0.24, 1);
  /* Muskelkanten und Okklusion: Oberschenkel vorn/unten, Leiste, Kniekehle (Schwanz–Oberschenkel), Achsel, Ellbogen */
  /* Oberschenkel als Muskelbauch: weicher Kernschatten an der unteren Vorderkante (Sichel), Knie mit Lichtpunkt */
  k += strich(T, [[[37.4, -21.6], [38.8, -17.6], [38.4, -14], [36, -12.6], [32.4, -12.8]]], DUNKEL, 1.6, 0.34, 0.7) +
    strich(T, [[[26.2, -21.6], [25.2, -18], [26.2, -14.6]]], DUNKEL, 1.2, 0.22, 0.6) +
    oval(T, 25.6, -14.4, 2, 1.4, -20, DUNKEL, 0.6, 0.6) + oval(T, 39, -12.6, 1.6, 1.4, 0, DUNKEL, 0.55, 0.6) +
    oval(T, 50.2, -12.6, 1.4, 2.2, 10, DUNKEL, 0.6, 0.6) + oval(T, 59, -13, 1.3, 1.6, 0, DUNKEL, 0.5, 0.6);
  /* Beine als Zylinder: Licht links, Kernschatten rechts; oberes Beindrittel im Schatten des Bauchs */
  k += zylinder(T, HB, -12.6) + zylinder(T, VB, -12.6) + oval(T, 37.4, -10.6, 1.3, 1, 0, HELL, 0.3, 0.4) + oval(T, 31.6, -2.4, 1, 1.2, 0, HELL, 0.18, 0.3) +
    blob(T, [[28, -13.6], [40, -12.6], [40, -10], [29, -10.6]], DUNKEL, 0.35, 0.8) + blob(T, [[51, -12.6], [59, -12.6], [59, -10.2], [51.4, -10]], DUNKEL, 0.35, 0.8);
  /* Schlagschatten des Nackenschilds auf Hals und Schulter */
  k += blob(T, [[59.4, -27], [61.6, -21], [63.6, -17.4], [66.6, -14.6], [70, -12.8], [68, -18], [65, -24]], DUNKEL, 0.55, 0.9);
  /* Kehle: rund, hängend, Querfalten mit Okklusion, fließend in Brust und Vorderbein */
  k += oval(T, 66, -10.8, 4.4, 1.4, -10, DUNKEL, 0.35, 0.6) +
    falten2(T, [[[61.2, -13.8], [62.2, -12.2], [62.4, -11]], [[63.8, -13.4], [64.8, -11.8], [65, -10.2]], [[66.6, -12.6], [67.4, -11], [67.6, -9.6]]], 0.4, 0.8) +
    /* Gelenkfalten: Knöchel, Knie, Ellbogen, Handgelenk (keine Ringe) */
    falten2(T, [[[31.2, -4.4], [32.8, -3.8], [34.4, -4.2]], [[31.6, -2.6], [33.4, -2.2], [35.2, -2.6]], [[36.4, -9.6], [37.2, -8.6], [36.8, -7.4]],
      [[52.2, -10.6], [53, -9.6], [53.6, -9.8]], [[54.6, -4.4], [56, -4], [57.6, -4.4]], [[54.6, -2.8], [56.2, -2.4], [58, -2.8]], [[28.6, -12], [30, -10.6]]], 0.18);
  /* Haut: Tuberkel in Zonen (Rücken grob, Flanke mittel, Bauch/Beine fein), am Umriss gestaucht, im Kernschatten aus */
  k += haut(T, tub(T, "tR", 0.3, { sy: 0.82 }), zoneBand(OBEN, UNTEN, 2, 70, -0.1, 0.16), 0.8, { schatten: kernZone }) +
    haut(T, tub(T, "tM", 0.24), zoneBand(OBEN, UNTEN, 2, 70, 0.16, 0.6), 0.8, { schatten: kernZone }) +
    haut(T, tub(T, "tB", 0.19, {}), zoneBand(OBEN, UNTEN, 2, 70, 0.6, 1.05), 0.7, { schatten: kernZone, schattenOp: 0.6 }) +
    haut(T, tub(T, "tL"), [[24.5, -13], [41, -12], [41, 0], [30, 0]], 0.75) + haut(T, tub(T, "tL"), [[50.5, -13], [60, -13], [60.6, 0], [53, 0]], 0.75);
  /* Merkmals-Schuppen in Rosetten: 2–3 lockere Reihen über Schulter, Rücken, obere Flanke */
  k += rosetten(T, [[24, -22.6, 0.55], [30, -24.2, 0.62], [36.4, -24.4, 0.66], [42.6, -23.4, 0.62], [48.6, -21.6, 0.58], [54, -19.8, 0.52],
    [27.4, -19.6, 0.5], [34, -20.4, 0.56], [40.4, -19.8, 0.56], [46.4, -18.6, 0.52], [52, -16.8, 0.46], [38, -16, 0.44], [44, -15.4, 0.42],
    [21, -20.6, 0.44], [32.6, -22.2, 0.5], [39.4, -22.4, 0.52], [45.8, -21, 0.5], [51.4, -19.4, 0.44], [30.6, -17.6, 0.4], [36, -18.4, 0.42], [42.4, -17.6, 0.42], [48.8, -16.6, 0.4]]
    .map(([x, y, R]) => [x + (T.rnd() - 0.5) * 1.2, y + (T.rnd() - 0.5) * 0.8, R * (1 + T.rnd() * 0.5)]), "#9a8460");
  s += masse(T, [RUMPF, HB, VB], grund, k) + volLage(T, "rumpf", [RUMPF, HB, VB], 2.4, 6);
  s += hufe(T, [[34.8, 2.2, 1.25, 0.2], [37.1, 2.4, 1.4, 0.3], [39.4, 2.2, 1.3, 0.3]]) + hufe(T, [[55.3, 1.9, 1.2], [57.3, 2, 1.3], [59.2, 1.8, 1.15]]);
  s += kontakt(T, 37, 7) + kontakt(T, 57, 5.6);

  /* ---------- Kopf: Schädel mit geschlossenem Nackenschild, Wangenhorn, Hakenschnabel ---------- */
  const K = [[85.9, -8.7, 1], [85.9, -10.8], [85.3, -12.4], [84.2, -13.8], [83, -14.8], [81.4, -15.8], [79.4, -16.6], [77.4, -17.4], [75.6, -18.6], [74, -20.1],
    [72.4, -21.8], [70.8, -23.8], [69, -25.8], [67.2, -27.4], [65.4, -28.3], [63.6, -28.4], [62.2, -27.4], [61.3, -25.4], [61, -22.8], [61.4, -20.2],
    [62.4, -17.8], [64, -15.8], [65.8, -14.4], [68, -13.4], [69.6, -12.6], [69.4, -10.6], [69.9, -8.4, 1], [71.4, -9.2], [72.8, -10], [73.8, -9.2],
    [76.2, -7.8], [79.8, -7.3], [83.2, -7.6], [84.6, -8.3], [85.3, -9]];
  const RAND = [[67.6, -27.1], [65.4, -28.3], [63.6, -28.4], [62.2, -27.4], [61.3, -25.4], [61, -22.8], [61.4, -20.2], [62.4, -17.8], [64, -15.8], [65.8, -14.4]];
  /* Epoccipitalia: 10 flache, breitbasige Dreiecke, heller Knochen-/Hornton, Licht- und Schattenseite */
  let ep = "", epS = "";
  for (let i = 0; i < 11; i++) {
    const t = (i + 0.5) / 11, j = t * (RAND.length - 1), a0 = RAND[Math.floor(j)], b0 = RAND[Math.min(RAND.length - 1, Math.floor(j) + 1)], u = j - Math.floor(j);
    const x = a0[0] + (b0[0] - a0[0]) * u, y = a0[1] + (b0[1] - a0[1]) * u, tx = b0[0] - a0[0], ty = b0[1] - a0[1], l = Math.hypot(tx, ty);
    let nx = ty / l, ny = -tx / l;
    if (nx * (x - 66) + ny * (y + 21) < 0) { nx = -nx; ny = -ny; }
    const A = [x - tx / l * 0.85, y - ty / l * 0.85], B = [x + tx / l * 0.85, y + ty / l * 0.85], S = [x + nx * 0.42 + tx / l * 0.1, y + ny * 0.42 + ty / l * 0.1];
    ep += `M${zug(A)}L${zug(S)} ${zug(B)}Z`;
    epS += `M${zug(S)}L${zug(B)} ${zug([x, y])}Z`;
  }
  s += `<path d="${ep}" fill="#8a7553" stroke="#8a7553" stroke-width=".25" stroke-linejoin="round"/><path d="${epS}" fill="${DUNKEL}" opacity=".32"/>`;
  /* fernes Stirnhorn: 6 % nach hinten versetzt, 25 % dunkler */
  const hornFern = hornForm(T, "hornF", 73.2, -21.2, -31, 9.4, 3, 0.11);
  s += `<g opacity=".97">${hornFern.svg}</g>` + `<path d="${T.glatt(hornFern.pts)}" fill="${DUNKEL}" opacity=".3"/>`;
  /* Nasenhorn: breite Basis auf dem Nasenwulst, stumpfe Spitze; Stirnhorn: kegelförmig, ~1 m, aus Knochenwulst über
     dem Auge mit Hautfaltenringen; beide werfen Schlagschatten auf das Schädeldach */
  const nh = hornForm(T, "hornN", 81.4, -15.6, -60, 3, 2.7, 0.1, 0.07);
  s += nh.svg;
  const hs = hornForm(T, "hornS", 74.2, -19.8, -31, 9.8, 3.1, 0.11);
  s += hs.svg;
  const kopfF = ulg(T, "kopf", [[0, "#5a4830"], [0.5, "#705b3e"], [1, "#5e4c34"]], 0, -28.5, 0, -7);
  const schildZone = [[73, -22.2], [70.6, -18], [69.8, -13.8], [64, -14.6], [60.6, -22], [63.6, -29], [68, -27]];
  let kk = "";
  /* Schild: Mitte wärmer (Displayfläche), Licht oben, zum Gesicht im Schatten; erhabener Randwulst mit Lichtkante */
  kk += blob(T, [[63.6, -26.6], [67, -25.4], [68.4, -21], [66.4, -17], [63, -17.6], [62.4, -22.4]], "#8a5a34", 0.28, 1.2) +
    blob(T, [[61, -29], [68.6, -27.6], [66, -24], [62.4, -24.6]], HELL, 0.24, 1) +
    blob(T, [[73.4, -22.6], [71, -17.6], [70.4, -13], [67.4, -13.4], [68.4, -18.4], [70.4, -22.4]], DUNKEL, 0.26, 1.2) +
    strich(T, [[[68, -27.2], [65.4, -28], [63.4, -28], [62, -26.8], [61.6, -24.6], [61.4, -22.4], [61.8, -20], [62.8, -17.8], [64.4, -15.8]]], DUNKEL, 0.9, 0.28, 0.4) +
    strich(T, [[[68.2, -26.6], [65.6, -27.4], [63.6, -27.4], [62.6, -26.4]]], HELL, 0.4, 0.4, 0.15) +
    /* Gefäßrillen: fein, verzweigt, schwach */
    (F ? strich(T, [[[70, -20], [67.4, -22.6], [65.2, -25.2], [64.2, -27]], [[67.4, -22.6], [66.4, -25.4]], [[69.6, -18], [66.2, -19.8], [63.4, -22.4]],
      [[66.2, -19.8], [64.6, -18.6]], [[69.6, -16], [66.6, -16.6], [63.4, -18.2]], [[71, -21.6], [69.4, -24.8], [67.8, -26.6]], [[63.4, -22.4], [62.2, -24.2]],
      [[65.2, -25.2], [63.2, -26.4]], [[66.6, -16.6], [64.8, -15.6]]], DUNKEL, 0.1, 0.18) : "") +
    haut(T, tub(T, "tS", 0.19, { sy: 0.8 }), schildZone, 0.45);
  /* Schlagschatten der Hörner auf dem Schädeldach */
  kk += blob(T, [[74.6, -19.6], [77.4, -18.8], [79.8, -17.4], [77.2, -17.2], [75, -18.2]], DUNKEL, 0.42, 0.35) + blob(T, [[82.4, -15.2], [84, -14.4], [83, -13.8]], DUNKEL, 0.35, 0.25);
  /* Gesicht: Nasengrat (Licht), Nasenwulst, Brauenwulst, Kaumuskel unter dem Schildrand, Wange, Unterkiefer-Stufe */
  kk += strich(T, [[[75.6, -18.4], [78.6, -17], [81.4, -15.8], [83.6, -14.4]]], HELL, 0.7, 0.36, 0.3) +
    oval(T, 81.6, -15.6, 1.4, 0.7, -22, HELL, 0.3, 0.3) +
    oval(T, 70.8, -14.6, 2.2, 2, 0, HELL, 0.2, 0.6) + oval(T, 71, -12.2, 2.4, 1, 0, DUNKEL, 0.45, 0.5) +
    /* Mundlinie steigt vom Schnabel zum Bereich unter dem Auge, darüber fleischige Wangenfalte */
    strich(T, [[[84.4, -9.8], [81.6, -10.4], [78.8, -11.2], [76.6, -12]]], DUNKEL, 0.26, 0.7, 0.05) +
    strich(T, [[[83.2, -10.8], [80.4, -11.6], [77.8, -12.6], [76.2, -13.4]]], HELL, 0.4, 0.3, 0.18) +
    strich(T, [[[82.6, -10.2], [79.6, -10.8], [77, -11.6]]], DUNKEL, 0.6, 0.25, 0.3) +
    blob(T, [[73.6, -9.8], [78, -8.6], [83.4, -8.4], [84.6, -8.6], [83, -7.4], [76, -7.6]], DUNKEL, 0.5, 0.5) +
    /* Gesichtsschuppen: Platten auf dem Nasenrücken, zum Kiefer hin feiner */
    haut(T, tub(T, "tN", 0.26), [[74, -20], [78, -17.8], [83.4, -14.8], [82.4, -13], [77, -15.2], [73.6, -17]], 0.7) +
    haut(T, tub(T, "tG", 0.19), [[70.4, -19], [76, -16], [84, -12.4], [84, -8.4], [74, -8.6], [70.2, -12]], 0.6);
  s += masse(T, [K], kopfF, kk) + volLage(T, "kopf", [K], 1.4, 5);
  /* Hakenschnabel: Rostrale schmal mit Haken über dem Prädentale; mattes Braun-Grau, abgenutzte hellere Schneide,
     erhabener beschuppter Hautrand */
  const ROS = [[83.6, -14.4], [84.6, -13.4], [85.3, -12.3], [85.9, -10.8], [85.9, -8.7, 1], [85.2, -9.5], [84.3, -10.3], [83.4, -11.2], [82.8, -12.8]];
  const PRE = [[83.2, -8.85], [85.2, -9.1, 1], [84.4, -8.5], [83.2, -8.05], [82.6, -8.2]];
  const horn = ulg(T, "schnabel", [[0, "#5e5444"], [0.6, "#3e362b"], [1, "#2a241c"]], 0, -14.5, 0, -7.5);
  s += masse(T, [ROS, PRE], horn, strich(T, [[[84.4, -13.6], [85.3, -12.2], [85.7, -10.6]]], HELL, 0.22, 0.35, 0.08) +
    strich(T, [[[84.2, -10.4], [85.2, -9.5], [85.8, -8.9]], [[83.2, -8.8], [84.8, -9]]], "#b8a888", 0.14, 0.55) +
    blob(T, [[83, -12], [85.4, -9.6], [84.6, -9.4], [83, -10.6]], DUNKEL, 0.3, 0.3));
  s += strich(T, [[[83.4, -14.6], [82.6, -12.8], [83.2, -11.2]], [[82.3, -8], [83, -8.9]]], "#2a2016", 0.3, 0.45, 0.06) +
    strich(T, [[[83, -14.8], [82.2, -12.8], [82.8, -11]]], HELL, 0.2, 0.3, 0.06);
  /* Nasenloch: ovale Vertiefung vor/unter dem Nasenhorn, innen dunkel, Unterrand angeleuchtet */
  s += `<ellipse cx="82.4" cy="-13.4" rx="1.05" ry=".62" transform="rotate(-30 82.4 -13.4)" fill="${T.rg("nloch", [[0, "#080604"], [0.65, "#1c150d"], [1, "#3a2e1e", 0.4]])}"/>` +
    strich(T, [[[81.6, -12.6], [82.6, -12.7], [83.4, -13.3]]], HELL, 0.16, 0.45, 0.04);
  /* Wangenhorn: hautbedeckt (Kopfhaut), nur die Spitze als stumpfer grau-ockerner Knochenknubbel; Licht oben,
     Rückseite im Kernschatten */
  s += `<path d="M69.45 -9.7L69.9 -8.4 70.85 -9.1Z" fill="#4e4434"/>` + strich(T, [[[72.6, -10.2], [71.4, -9.6], [70.4, -9]]], DUNKEL, 0.6, 0.45, 0.2);
  /* Hautfaltenringe am Hornansatz (Horn wächst aus dem Knochenwulst über dem Auge) */
  s += strich(T, [[[72.6, -20.6], [74, -21.6], [75.8, -21.1]], [[73, -20.1], [74.4, -20.9], [76, -20.5]]], DUNKEL, 0.16, 0.45, 0.04) +
    strich(T, [[[72.4, -20.8], [73.6, -21.9], [75, -22]]], HELL, 0.22, 0.4, 0.08);
  /* Auge: 20 % größer, in der Höhle unter dem Brauenwulst */
  s += auge2(T, 74.6, -16.3, 0.6, { iris: "#b6802f", iris2: "#40250b", winkel: -8 });
  const kk2 = 10, box = [0, -28.4, 85.9, 0];
  const fuss = (p) => { const u = p.filter((q) => q[1] > -0.6); return Math.round(u.reduce((a, q) => a + q[0], 0) / u.length * kk2); };
  return { svg: DM(s, kk2), box: box.map((v) => Math.round(v * kk2)), fuesse: [fuss(HB), fuss(VB), fuss(hbF), fuss(vbF)], kopf: [600, -300, 875, -60] };
}

/* =====================================================================
   STEGOSAURUS
   RECHERCHE: Stegosaurus (S. stenops/S. ungulatus), Oberjura, Morrison-
   Formation (Nordamerika), ~155–150 Mio. Jahre. S. stenops ~6,5 m („Sophie",
   NHM London: Hals länger, Rumpf kürzer als früher gezeigt), große Tiere bis
   ~8,5–9 m, 5–7 t. Darmbein-Kuppe höchster Punkt, Rücken fällt steil zu
   Schulter und Hals; Schädel lang, niedrig, schmal und sehr klein (~6–7 % der
   Länge), zahnloser Hornschnabel vorn, Brauenknochen (Palpebrale) über dem
   Auge, Ornithischier-Wange; Kopf tief getragen. ZWEI Reihen dünner, flacher
   Knochenplatten, VERSETZT (alternierend), in der Haut verankert, mit
   verzweigten Gefäßrinnen; die größten über Becken und Schwanzwurzel. Vier
   Schwanzstacheln („Thagomizer", 2 Paare, Hornscheide) nach hinten-außen und
   nur leicht nach oben – echte Waffe. Kehle mit Mosaik kleiner Knochen-
   plättchen (Ossikel). Vorderbeine kurz, säulenartig, Hand mit 5 kurzen
   Fingern im Halbkreis (nur die inneren zwei mit kleinen Krallen); Hinterbeine
   lang, Fuß mit 3 kurzen Zehen und hufartigen Krallen. Haut: nicht über-
   lappende Tuberkel. Farbe unbekannt → Rücken dunkler braun-oliv, Bauch heller
   ocker (Gegenschattierung), weiche Querflecken; Platten ocker-oliv mit
   rotbraunem Rand (Imponierfarbe).
   ===================================================================== */
function stegosaurus(T) {
  genau(T);
  const F = T.fein;
  let s = "";
  /* ---------- Formen (1 Einheit = 10 cm) ---------- */
  const OBEN = [[3.8, -14.4], [6, -15.6], [12, -18], [18, -20.6], [24, -22.8], [30, -24.4], [34, -25], [38, -24.6], [43, -23.3], [47, -22.2], [51, -20.9],
    [54.6, -19.9], [57, -18.2], [60, -15.8], [63, -13.2], [65.8, -11], [68.2, -9.6], [70.4, -9]];
  const UNTEN = [[3.8, -13], [6, -13.5], [12, -14.6], [18, -15.6], [22, -15.8], [25, -15], [28, -14], [32, -13], [36, -12], [40, -11.1], [44, -10.3],
    [48, -9.7], [51, -9.5], [54, -9.9], [57, -10.5], [60, -10.1], [63, -9.1], [66, -8.1], [68.6, -7.5], [70.4, -7.1]];
  /* Kopf: lang, niedrig, schmal (L:H ≈ 2,9), flache Oberlinie mit kleiner Senke vor dem Auge, tiefste Stelle am Kiefergelenk */
  const KOPF = [[70.4, -9], [71.6, -8.85], [72.8, -8.82], [73.5, -8.62], [74.6, -8.2], [75.9, -7.4, 1], [75.5, -6.98], [74.4, -6.82], [73, -6.8], [71.6, -6.86], [70.4, -7.05]];
  const RUMPF = [[3.1, -13.75], ...OBEN, ...KOPF.slice(1), ...UNTEN.slice().reverse()];
  /* Hinterbein: Oberschenkel oben breit, Knie bei ~55 % der Höhe als Wölbung, Unterschenkel verjüngt, Fuß breiter */
  const HB = [[27.4, -20], [27.2, -15.6], [28.4, -12.4], [30, -9.6], [30.6, -6.6], [30.9, -3.9], [30.4, -1.6], [30.8, 0, 1], [38.4, 0, 1], [38.6, -1],
    [37.4, -2], [36, -3.7], [36.1, -6.4], [37.1, -8.8], [38.1, -10.6], [38.4, -13], [38.2, -17], [36.6, -21], [32, -22.5]];
  /* Vorderbein: kurz, säulenartig, Ellbogen-Wölbung hinten, Unterarm, Hand mit Fingern im Halbkreis */
  const VB = [[52.6, -14.6], [52.4, -10.8], [53, -8.2], [53.9, -6], [54.2, -3.4], [53.8, -1.4], [54, 0, 1], [58.8, 0, 1], [59, -1.2], [58.2, -2.6],
    [58.2, -5.6], [58.6, -8.2], [59.4, -11], [59.6, -14.4]];
  const schieb = (p, dx) => p.map((q) => { const z = [q[0] + dx, q[1]]; if (q[2]) z.push(1); return z; });
  const hbF = schieb(HB, 3.4), vbF = schieb(VB, -3);
  const RUECKEN = OBEN.slice(0, 17);
  /* Platten: flach, leicht unsymmetrisch; Basis eingeschnürt und in die Haut gesenkt; breiteste Stelle bei 40–50 %;
     Spitze gerundet, 10–15° nach hinten geneigt; Rand leicht gewellt */
  const plattePts = (bx, H, W) => {
    const by = yBei(RUECKEN, bx) + 0.5, j = () => (T.rnd() - 0.5) * 0.05;
    const loc = [[-0.3, 0], [-0.44, -0.17 + j()], [-0.5, -0.42], [-0.4 + j(), -0.66], [-0.17, -0.89], [0.01, -1], [0.19, -0.9 + j()], [0.38, -0.67],
      [0.5, -0.45 + j()], [0.45, -0.2], [0.3, 0]];
    return dreh(loc.map(([u, v]) => [bx + u * W, by + v * H]), bx, by, -12);
  };
  const PL = [ // [x, H, W, Reihe 1 = nah, 0 = fern] – größte über Becken und Schwanzwurzel
    [10, 2.8, 2.8, 0], [13.6, 4, 3.8, 1], [17.4, 5.2, 4.8, 0], [21.4, 6.2, 5.6, 1], [25.6, 7, 6.2, 0], [30, 7.4, 6.6, 1], [34.4, 7.5, 6.6, 0],
    [38.8, 7.2, 6.4, 1], [43, 6.6, 5.9, 0], [47, 5.8, 5.2, 1], [50.8, 4.9, 4.5, 0], [54.2, 3.9, 3.7, 1], [57.2, 3, 2.9, 0], [59.9, 2.3, 2.3, 1],
    [62.4, 1.7, 1.7, 0], [64.7, 1.2, 1.2, 1]];
  const formen = PL.map((p) => plattePts(p[0], p[1], p[2]));
  const rinnen = (x, H, W, op) => {
    if (!F) return "";
    const by = yBei(RUECKEN, x) + 0.5, l = [];
    for (const u of [-0.2, 0.02, 0.22]) {
      const a = [[x + u * W * 0.4, by - H * 0.05], [x + u * W * 0.9, by - H * 0.42], [x + u * W * 0.7 - 0.08 * W, by - H * 0.78]];
      l.push(dreh(a, x, by, -12));
      l.push(dreh([a[1], [x + u * W * 1.3 + 0.06 * W, by - H * 0.6]], x, by, -12));
      l.push(dreh([a[1], [x + u * W * 0.5 - 0.12 * W, by - H * 0.6]], x, by, -12));
    }
    return strich(T, l, "#3a1e0c", 0.07, op);
  };
  const platteF = T.rg("platte", [[0, "#857446"], [0.55, "#7e663c"], [0.82, "#6e4426"], [1, "#56301a"]], 0.45, 0.6, 0.62);
  const platteH = T.rg("platteH", [[0, "#5c5232"], [0.55, "#564628"], [0.82, "#4a2e1a"], [1, "#3a2212"]], 0.45, 0.6, 0.62);

  /* ---------- ferne Platten (25–35 % dunkler, Schatten der vorderen Platten darauf) ---------- */
  PL.forEach((p, i) => {
    if (p[3]) return;
    if (!F) { s += `<path d="${gl(formen[i])}" fill="${platteH}"/>`; return; }
    const nb = [i - 1, i + 1].filter((q) => q >= 0 && q < PL.length && PL[q][3]).map((q) => formen[q].map(([x, y]) => [x + 0.7, y + 0.5]));
    s += masse(T, [formen[i]], platteH, nb.map((f) => blob(T, f, DUNKEL, 0.45, 0.35)).join("") + rinnen(p[0], p[1], p[2], 0.12) +
      strich(T, [formen[i].slice(1, 9)], "#2a160a", 0.5, 0.35, 0.15));
  });
  /* ---------- Thagomizer: fernes Paar (teils hinter dem Schwanz) ---------- */
  const sFarben = [[0, "#3e352a"], [0.45, "#5e5444"], [1, "#958a72"]];
  const stF1 = hornForm(T, "stF1", 9.4, -17.6, -150, 7.2, 2.1, -0.04, 0.05, sFarben), stF2 = hornForm(T, "stF2", 5.2, -15.6, -163, 7, 2, -0.03, 0.05, sFarben);
  s += stF1.svg + stF2.svg + `<path d="${gl(stF1.pts)}${gl(stF2.pts)}" fill="${DUNKEL}" opacity=".28"/>`;

  /* ---------- ferne Beine: Körperton, ~25 % dunkler, modelliert, im Schatten des nahen Beins ---------- */
  const fernF = ulg(T, "fern", [[0, "#3c3a24"], [0.6, "#45422a"], [1, "#2a281a"]], 0, -14, 0, 0);
  s += masse(T, [kappen(hbF, -14), kappen(vbF, -11)], fernF, zylinder(T, hbF, -11.5) + zylinder(T, vbF, -9.8) +
    blob(T, [[28, -13], [62, -11], [62, -7.6], [28, -9]], DUNKEL, 0.5, 1.2) +
    haut(T, tub(T, "tL", 0.19), [[30, -12], [42, -12], [42, 0], [30, 0]], 0.3) + haut(T, tub(T, "tL"), [[49, -11], [57, -11], [57, 0], [49, 0]], 0.3));
  s += hufe(T, [[35.6, 1.9, 0.9], [37.6, 2.1, 1], [39.6, 1.9, 0.9]], "#3a3226") + hufe(T, [[52.6, 1.3, 0.6], [53.9, 1.4, 0.65], [55.2, 1.3, 0.6]], "#3a3226");

  /* ---------- Körper: Rumpf + Schwanz + Hals + Kopf + nahe Beine als EINE Masse ---------- */
  const grund = ulg(T, "haut", [[0, "#4a4228"], [0.3, "#655b38"], [0.52, "#7f7048"], [0.62, "#655a3a"], [1, "#4a4430"]], 0, -25, 0, 0);
  const kernZone = zoneBand(OBEN, UNTEN, 2, 79, 0.62, 1.1);
  let k = "";
  /* weiche Querflecken auf Flanke und Schwanz (10–15 % dunkler) */
  k += F ? [[9, -16.6, 1.6, 2.4, 8], [15.4, -18.6, 1.8, 3, 6], [22, -20.2, 2, 3.6, 4], [29, -20.6, 2.2, 4.2, 0], [36.4, -20.6, 2.2, 4.4, -4], [43.6, -19.2, 2, 4.2, -6],
    [50.4, -17, 1.8, 3.6, -8], [64, -12.4, 1.2, 2, -14], [70, -10.6, 1, 1.6, -18]].map(([x, y, a, b, w]) => oval(T, x, y, a, b, w, "#2a2210", 0.18, 0.7)).join("") : "";
  /* EIN Licht oben links: Glanz an Rückenlinie, Darmbein- und Schulterkuppe; Kernschatten unten; Bodenreflex */
  k += rumpfLicht(T, OBEN, UNTEN, 2, 79, { tiefe: 14, glanz: 0.46, kern: 0.64 });
  k += oval(T, 34, -21.6, 5, 2.2, -4, HELL, 0.26, 1) + oval(T, 55.4, -17.2, 2.6, 1.8, -20, HELL, 0.26, 0.6) + oval(T, 20.4, -19.4, 5, 1.6, -22, HELL, 0.2, 0.8) +
    /* Muskelmassen: Oberschenkel (Licht oben, Sichel-Schatten vorn unten), Schwanzwurzel-Wulst, Schulter */
    oval(T, 32.4, -17.6, 5, 4.4, -10, HELL, 0.24, 1.4) + strich(T, [[[37.2, -20.6], [38.6, -16.6], [38.2, -13.4], [35.4, -12.2], [31.6, -12.6]]], DUNKEL, 1.4, 0.32, 0.6) +
    oval(T, 23, -16.4, 3.6, 1.2, -12, DUNKEL, 0.35, 0.6) + oval(T, 55.6, -13.6, 2.6, 2.6, 0, HELL, 0.18, 0.8) +
    /* Okklusion an den Beinansätzen, Achsel, Leiste; Hängebauch hinter den Vorderbeinen */
    oval(T, 27.6, -14.2, 1.6, 1.2, -20, DUNKEL, 0.55, 0.5) + oval(T, 38.8, -11.6, 1.4, 1.2, 0, DUNKEL, 0.55, 0.5) + oval(T, 52.6, -10.4, 1.2, 1.6, 0, DUNKEL, 0.5, 0.5) +
    oval(T, 59.6, -10.6, 1.2, 1.4, 0, DUNKEL, 0.5, 0.5) +
    zylinder(T, HB, -11.6) + zylinder(T, VB, -9.6) + oval(T, 37.4, -9.6, 1.1, 0.9, 0, HELL, 0.3, 0.35) +
    /* Kopf: Schlagschatten auf den Hals, Wange, Unterkiefer */
    blob(T, [[68.8, -9.2], [71, -7.2], [70.4, -6.4], [68, -7.2]], DUNKEL, 0.42, 0.4) + oval(T, 72.8, -8.5, 1.6, 0.4, -10, HELL, 0.3, 0.25) +
    oval(T, 72.8, -6.9, 2.2, 0.35, 0, DUNKEL, 0.4, 0.2) +
    /* Hautfalten: Halsansatz, Schulter, Knie, Leiste, Fuß-/Handgelenk */
    falten2(T, [[[60.2, -14.6], [61, -12.6], [61.2, -10.8]], [[62.4, -13.6], [63.2, -11.6], [63.4, -10]], [[64.8, -12.6], [65.6, -10.8], [65.6, -9.6]],
      [[56.6, -15.6], [57.4, -13.6]], [[36.4, -9.4], [37.2, -8.4], [36.8, -7.2]], [[29.6, -13.4], [31, -12]], [[31.6, -4.6], [33, -4.1], [34.2, -4.3]],
      [[55, -3.6], [56.2, -3.3], [57.2, -3.5]], [[53.8, -7.6], [54.6, -6.6]], [[66.4, -10.2], [67, -8.8], [67, -8]]], 0.22) +
    /* Haut: Tuberkel in Zonen (Rücken/Becken grob, Flanke mittel, Hals/Gelenke/Gesicht fein), im Kernschatten aus */
    haut(T, tub(T, "tR", 0.34, { sy: 0.82 }), zoneBand(OBEN, UNTEN, 4, 66, -0.1, 0.18), 0.85, { schatten: kernZone }) +
    haut(T, tub(T, "tM", 0.24), zoneBand(OBEN, UNTEN, 4, 70, 0.18, 0.6), 0.8, { schatten: kernZone }) +
    haut(T, tub(T, "tB", 0.19, {}), zoneBand(OBEN, UNTEN, 4, 79, 0.6, 1.05), 0.7, { schatten: kernZone, schattenOp: 0.6 }) +
    haut(T, tub(T, "tK", 0.19), [[60, -15], [70.4, -9.2], [75.8, -7.6], [74.4, -6.6], [64, -8.6], [58, -10]], 0.6) +
    haut(T, tub(T, "tL"), [[27, -12.6], [39, -11.6], [39, 0], [30, 0]], 0.75) + haut(T, tub(T, "tL"), [[52.4, -10], [60, -10], [59.2, 0], [53.6, 0]], 0.75) +
    /* Leitschuppen in lockeren Rosetten auf Becken und Flanke */
    rosetten(T, [[30, -19.6, 0.42], [35.6, -19.8, 0.46], [41.6, -18.8, 0.42], [27, -17, 0.38], [33, -16.4, 0.4], [39.2, -15.8, 0.38], [45.6, -16.4, 0.38], [24.6, -19.6, 0.36]], "#9a8a5e") +
    /* Kehle: Mosaik aus kleinen, flach eingebetteten Knochenplättchen hinter dem Unterkiefer */
    (() => {
      if (!F) return "";
      let d = "", u = "";
      for (let i = 0; i < 30; i++) {
        const a = T.rnd() * Math.PI * 2, rr = Math.sqrt(T.rnd()), x = 67.4 + Math.cos(a) * rr * 2.2, y = -8.2 + Math.sin(a) * rr * 0.55, g = 0.11 + (1 - rr) * 0.1;
        d += `M${n1(x - g)} ${n1(y)}a${n1(g)} ${n1(g * 0.8)} 0 1 0 ${n1(2 * g)} 0a${n1(g)} ${n1(g * 0.8)} 0 1 0 ${n1(-2 * g)} 0`;
        u += `M${n1(x - g)} ${n1(y + 0.03)}a${n1(g)} ${n1(g * 0.8)} 0 0 0 ${n1(2 * g)} 0`;
      }
      return `<path d="${d}" fill="#a49468" opacity=".42"/><path d="${u}" fill="none" stroke="${DUNKEL}" stroke-opacity=".3" stroke-width=".05"/>`;
    })() +
    /* Schatten der vorderen Platten auf dem Rücken */
    (F ? PL.filter((p) => p[3]).map((p) => oval(T, p[0] + 1, yBei(RUECKEN, p[0]) + 0.9, p[2] * 0.42, 0.5, -8, DUNKEL, 0.45, 0.3)).join("") : "");
  s += masse(T, [RUMPF, HB, VB], grund, k) + volLage(T, "rumpf", [RUMPF, HB, VB], 2.2, 6);
  s += hufe(T, [[32.8, 2, 0.95, 0.2], [34.9, 2.2, 1.05, 0.25], [37, 2, 0.95, 0.25]]) + hufe(T, [[55.1, 1.3, 0.6], [56.4, 1.4, 0.68], [57.7, 1.3, 0.6]]);
  s += kontakt(T, 34.6, 7) + kontakt(T, 56.4, 4.6);
  /* Hornschnabel: schmal, scharfe Schneide, Ober- über Unterschnabel, dunkles Horn; heller Saum am Hautübergang */
  const SCHN = [[74.6, -8.22], [75.9, -7.4, 1], [75.48, -6.96], [74.9, -7.15], [74.4, -7.7]], PRE = [[75, -7.02], [75.48, -6.9, 1], [74.8, -6.76], [74.2, -6.84]];
  s += masse(T, [SCHN, PRE], ulg(T, "schnabel", [[0, "#5e5646"], [1, "#352e24"]], 0, -8.4, 0, -6.7), strich(T, [[[75, -8], [75.7, -7.4]]], "#c8b994", 0.07, 0.6)) +
    strich(T, [[[74.5, -8.28], [74.35, -7.7], [74.7, -7.15]]], "#d8c9a2", 0.08, 0.45);
  /* Nasenloch: groß, oval, oben vorn direkt hinter dem Schnabel; Maullinie gerade bis hinter das Auge mit Wangenfalte */
  s += `<ellipse cx="74.2" cy="-7.95" rx=".36" ry=".2" transform="rotate(-20 74.2 -7.95)" fill="${T.rg("nloch", [[0, "#080604"], [0.7, "#1c150d"], [1, "#3a2e1e", 0.4]])}"/>` +
    strich(T, [[[73.8, -8.15], [74.3, -8.22], [74.6, -8.1]]], HELL, 0.06, 0.45) +
    strich(T, [[[74.5, -7.2], [73.2, -7.25], [71.8, -7.38], [71, -7.5]]], DUNKEL, 0.1, 0.65) + strich(T, [[[74, -7.45], [71.8, -7.6], [71, -7.72]]], HELL, 0.12, 0.25, 0.04);
  /* nahe Platten mit Hautkragen an der Basis, Rinnen, dunklem Rand */
  PL.forEach((p, i) => {
    if (!p[3]) return;
    if (!F) { s += `<path d="${gl(formen[i])}" fill="${platteF}" stroke="#3a1a0c" stroke-width=".4" stroke-opacity=".6"/>`; return; }
    s += masse(T, [formen[i]], platteF, rinnen(p[0], p[1], p[2], 0.24) + blob(T, formen[i].map(([x, y]) => [x - 0.25 * p[2] * 0.2, y - 0.2]), HELL, 0.08, 0.3) +
      strich(T, [formen[i].slice(1, 10)], "#3a1a0c", 0.42, 0.5, 0.12));
  });
  s += strich(T, [RUECKEN.slice(3, 16).map(([x, y]) => [x, y + 0.45])], "#6a6242", 0.9, 0.6, 0.3);
  /* Thagomizer: nahes Paar (perspektivisch 15–20 % kürzer), Basis in Hautkragen */
  const st1 = hornForm(T, "st1", 9.6, -17.2, -150, 6, 2.2, -0.04, 0.05, sFarben), st2 = hornForm(T, "st2", 5.4, -15.2, -162, 5.8, 2.1, -0.03, 0.05, sFarben);
  s += st1.svg + st2.svg + oval(T, 9.4, -17, 1.3, 0.8, -20, "#5a5236", 1, 0.25) + oval(T, 5.2, -15, 1.2, 0.75, -15, "#544c32", 1, 0.25);
  /* Auge mit Brauenknochen (Palpebrale) */
  s += auge2(T, 71.9, -8.15, 0.32, { iris: "#a8742c", iris2: "#3e240c", winkel: -6 });
  const kk = 10, box = [Math.min(...stF2.pts.map((q) => q[0]), ...st2.pts.map((q) => q[0])), Math.min(...formen.map((f) => Math.min(...f.map((q) => q[1])))), 75.9, 0];
  const fuss = (p) => { const u = p.filter((q) => q[1] > -0.6); return Math.round(u.reduce((a, q) => a + q[0], 0) / u.length * kk); };
  return { svg: DM(s, kk), box: box.map((v) => Math.round(v * kk)), fuesse: [fuss(HB), fuss(VB), fuss(hbF), fuss(vbF)], kopf: [665, -105, 765, -55] };
}

/* =====================================================================
   ANKYLOSAURUS
   RECHERCHE: Ankylosaurus magniventris, Oberkreide (Maastricht, Hell Creek/
   Lance/Scollard), ~68–66 Mio. Jahre. Länge ~6–8 m (Arbour & Mallon 2017,
   FACETS), 5–8 t, sehr breit und niedrig, großer Bauch („magniventris").
   Schädel breiter als lang (64,5 × 74,5 cm), flach-dreieckig, Schädeldach als
   geschlossenes Mosaik gewölbter Hornplatten (Caputegulae), Brauenplatte über
   dem Auge; vier pyramidenförmige Hörner: Squamosalhörner an den oberen
   Hinterecken nach hinten-außen, Quadratojugalhörner an den unteren Hinterecken
   (Kiefergelenk) nach hinten-unten; breiter Hornschnabel; Nasenlöcher SEITLICH,
   unter einer überhängenden Nasenplatte. Zwei Halb-Ringe aus großen gekielten
   Platten über dem kurzen, dicken Hals. Rückenpanzer aus gekielten Osteodermen
   in QUERREIHEN, dazwischen kleine runde Knöchelchen; seitlich gekielte Rand-
   stacheln (an der Schulter am größten). Schwanz: hintere Hälfte durch
   verknöcherte Sehnen steif („Griff"); Keule ~60 cm lang, 49 cm breit, aus zwei
   großen seitlichen + zwei kleinen End-Osteodermen. Kurze, kräftige Beine,
   Hinterbeine länger; Fuß mit 3 hufartigen Zehen, Hand mit 5 kurzen Fingern im
   Halbkreis. Farbe unbekannt → dunkles Erdbraun, Panzer heller (Horn).
   ===================================================================== */
function ankylosaurus(T) {
  genau(T);
  const F = T.fein;
  let s = "";
  /* ---------- Formen (1 Einheit = 10 cm) ---------- */
  const OBEN = [[6.6, -8.6], [12, -10.6], [17, -12.6], [22, -14.7], [26, -15.9], [30, -16.6], [36, -17], [42, -16.7], [47, -15.9], [51, -14.6],
    [53.6, -13.4], [56, -12.6], [58.4, -12.1]];
  const UNTEN = [[6.6, -7], [12, -8.7], [17, -10.4], [20.6, -11.6], [23, -11.3], [26, -9.6], [29, -8.2], [33, -7.2], [38, -6.6], [44, -6.8], [49, -7.4],
    [52.4, -7.7], [55.6, -7.8], [58.4, -8.2]];
  /* Kopf: flach-dreieckig, Schädeldach fast gerade, 11° zur Schnauze abfallend, eckige Hinterecken */
  const KOPF = [[58.4, -12.1], [60.8, -11.6], [63.2, -11.1], [65, -10.6], [65.6, -9.9], [65.7, -8.9], [65.2, -8.2], [63.2, -7.95], [60.8, -8], [58.8, -8.3]];
  const RUMPF = [...OBEN, ...KOPF.slice(1), ...UNTEN.slice().reverse()];
  /* Hinterbein (länger): Oberschenkel quillt unter der Flanke hervor, Knie leicht vorn, Unterschenkel verjüngt */
  const HB = [[23.2, -12.6], [23.4, -9.4], [24.6, -7], [26, -5], [26.8, -3], [26.8, -1.6], [27.2, 0, 1], [33.8, 0, 1], [34, -0.8], [32.8, -1.6],
    [31.6, -2.6], [31.4, -4.2], [32.2, -6.2], [32.6, -8.4], [32.2, -11.4], [30, -13.4], [26, -13.6]];
  /* Vorderbein: Ellbogen leicht nach hinten-außen, Unterarm verjüngt, Handgelenk-Knick, breite runde Hand */
  const VB = [[47, -10], [46.4, -7.4], [46.8, -5.4], [47.8, -3.8], [48.2, -2.2], [47.8, -0.9], [48.2, 0, 1], [53.8, 0, 1], [54, -0.9], [53.2, -1.8],
    [52.6, -2.6], [52.6, -4.4], [53.2, -6.4], [53.6, -8.6], [53, -10.6]];
  const schieb = (p, dx, dy = 0) => p.map((q) => { const z = [q[0] + dx, q[1] + dy]; if (q[2]) z.push(1); return z; });
  /* ferne Beine in anderer Schrittphase: fernes Hinterbein vorgesetzt, fernes Vorderbein angehoben */
  const hbF = schieb(HB, 3.4), vbF = schieb(dreh(VB, 50, -9, 8), -3.6, -0.7);

  /* ---------- Schwanzkeule: zwei große seitliche + zwei kleine End-Osteoderme, matter rauer Knochen ---------- */
  const knopf = (cx, cy, a, b) => Array.from({ length: 10 }, (_, i) => { const w = i / 10 * Math.PI * 2; return [cx + Math.cos(w) * a * (0.94 + T.rnd() * 0.1), cy + Math.sin(w) * b * (0.94 + T.rnd() * 0.1)]; });
  const K1 = knopf(4.7, -7.4, 2, 1.6), K2 = knopf(2.5, -7.25, 1.55, 1.3), K3 = knopf(1, -7.3, 0.7, 0.62), K4 = knopf(1.2, -7.1, 0.3, 0.3);
  const knochen = ulg(T, "keule", [[0, "#8a785a"], [0.45, "#6a5840"], [1, "#30261a"]], 0, -9.2, 0, -5.6);
  s += masse(T, [K2, K3, K4], knochen, `<rect x="-1" y="-10" width="6" height="5" fill="${DUNKEL}" opacity=".3"/>` + oval(T, 2, -6.2, 2.4, 0.7, 0, DUNKEL, 0.5, 0.3) +
    haut(T, tub(T, "tP", 0.19), [[-1, -10], [5, -10], [5, -5], [-1, -5]], 0.75));

  /* ---------- ferne Beine: 35 % dunkler, weniger Kontrast ---------- */
  const fernF = ulg(T, "fern", [[0, "#2e2419"], [0.6, "#352a1e"], [1, "#221a12"]], 0, -10, 0, 0);
  s += masse(T, [kappen(hbF, -10), kappen(vbF, -9)], fernF, zylinder(T, hbF, -7.4, { op: 0.6 }) + zylinder(T, vbF, -7, { op: 0.6 }) +
    blob(T, [[24, -9], [56, -9], [56, -5.6], [24, -6.4]], DUNKEL, 0.5, 0.9));
  s += hufe(T, [[31.8, 1.7, 0.75], [33.6, 1.95, 0.85], [35.4, 1.7, 0.75]], "#2e261c") +
    `<g transform="translate(${n1(vbF[7][0] - 48.2)} -.7)">` + hufe(T, [[45.6, 1.3, 0.6], [46.9, 1.4, 0.65], [48.2, 1.3, 0.6]], "#2e261c") + `</g>`;

  /* ---------- Körper: Rumpf + Schwanz + Hals + Kopf + nahe Beine ---------- */
  const grund = ulg(T, "haut", [[0, "#7e6c4e"], [0.3, "#6a5940"], [0.55, "#4a3c2a"], [0.8, "#33291c"], [1, "#3c3022"]], 0, -17, 0, -6.6);
  const kernZone = zoneBand(OBEN, UNTEN, 6.6, 58.4, 0.55, 1.1);
  let k = "";
  k += rumpfLicht(T, OBEN, UNTEN, 6.6, 58.4, { tiefe: 9, glanz: 0.42, kern: 0.6, reflex: 0.24 });
  /* Kernschatten-Band direkt unter der Stachelreihe; der überstehende Panzer verschattet Oberschenkel und Oberarm */
  const RAND = OBEN.map(([x, y]) => [x, y + (yBei(UNTEN, x) - y) * 0.52]);
  k += strich(T, [RAND.slice(2, 12).map(([x, y]) => [x, y + 0.8])], "#1e1710", 1.8, 0.6, 0.5) +
    blob(T, [[22.6, -11.6], [33, -10], [33, -7.6], [23, -8.4]], DUNKEL, 0.42, 0.7) + blob(T, [[46, -9.6], [54, -9.6], [54, -7.2], [46, -7.2]], DUNKEL, 0.42, 0.6) +
    /* Oberschenkelmasse, Knie, Okklusion an den Beinansätzen */
    oval(T, 28.6, -8.4, 3.4, 2.2, -10, HELL, 0.16, 0.8) + oval(T, 31.8, -5.8, 0.9, 0.8, 0, HELL, 0.25, 0.3) +
    oval(T, 23.4, -10.4, 1.2, 1.2, 0, DUNKEL, 0.55, 0.4) + oval(T, 33, -7, 1, 1, 0, DUNKEL, 0.5, 0.4) + oval(T, 46.4, -7.4, 0.9, 1.2, 0, DUNKEL, 0.5, 0.4) +
    zylinder(T, HB, -7) + zylinder(T, VB, -7.2) +
    /* Hängebauch: tiefster Punkt zwischen den Beinen, Bodenreflex */
    falten2(T, [[[26.4, -3.6], [28.8, -3], [31.4, -3.4]], [[26.6, -2.2], [29, -1.7], [31.8, -2]], [[48, -3.2], [50.2, -2.7], [52.6, -3]], [[47.8, -4.6], [49.6, -4.2], [52.4, -4.6]],
      [[31.4, -6.8], [32.2, -5.8]], [[46.8, -6], [47.8, -5.2]]], 0.18) +
    /* Haut: feine Kieselschuppen, oben auf der Flanke größer, zu Bauch und Beinen feiner, Kontrast niedrig */
    haut(T, tub(T, "tM", 0.19), zoneBand(OBEN, UNTEN, 8, 58, 0.45, 0.7), 0.5, { schatten: kernZone, schattenOp: 0.5 }) +
    haut(T, tub(T, "tB", 0.19, {}), zoneBand(OBEN, UNTEN, 8, 58, 0.7, 1.05), 0.45, { schatten: kernZone, schattenOp: 0.4 }) +
    haut(T, tub(T, "tL", 0.19), [[23, -9], [34, -8], [34, 0], [26, 0]], 0.5) + haut(T, tub(T, "tL"), [[46, -8], [54, -8], [54, 0], [47, 0]], 0.5);
  /* Kopf: eigener mittlerer Hautton (oben im Licht), Schlagschatten auf den Hals, Wange, Unterkiefer, feine Wangenschuppen */
  k += blob(T, [[58.6, -12.1], [63.2, -11.1], [65.6, -9.9], [65.5, -8.6], [62, -8.4], [58.8, -9.4]], "#7c6a4c", 0.75, 0.35) +
    blob(T, [[58.6, -12.2], [63.2, -11.2], [65.4, -10.4], [62.6, -10.4], [58.6, -11.2]], HELL, 0.22, 0.3) + blob(T, [[57.4, -12], [59.2, -8.6], [58.4, -7.8], [56.4, -8.8]], DUNKEL, 0.5, 0.35) + oval(T, 62.4, -8.5, 2.6, 0.4, 0, DUNKEL, 0.42, 0.2) +
    haut(T, tub(T, "tG", 0.19), [[58.4, -10.6], [65.2, -9.6], [65.2, -8.2], [58.6, -8.4]], 0.5);
  /* Rückenpanzer: 8 Querreihen gekielter Platten vom Nacken bis zum Becken; Reihen folgen der Wölbung, oben
     perspektivisch gestaucht, je Reihe zum Schwanz hin ~12 % kleiner; Knöchelchen dazwischen; Schatten nach rechts unten */
  /* gekielte Platte: obere Facette (Licht) und untere Facette (Schatten) getrennt durch den Längskiel; dunkle Fuge,
     Schlagschatten nach rechts unten auf die Haut */
  let plO = "", plU = "", plR = "", plS = "", kiL = "", kn = "";
  const platte = (x, y, rx, ry, kh = 0.15) => {
    if (!F) {   // Szene: kurze Bogen-Züge – ganze Platte dunkel, obere Hälfte hell
      plU += `M${n1(x - rx)} ${n1(y)}a${n1(rx)} ${n1(ry)} 0 1 0 ${n1(2 * rx)} 0a${n1(rx)} ${n1(ry)} 0 1 0 ${n1(-2 * rx)} 0`;
      plO += `M${n1(x - rx)} ${n1(y)}a${n1(rx)} ${n1(ry)} 0 0 1 ${n1(2 * rx)} 0z`;
      return;
    }
    const yk = y - ry * kh;
    plO += `M${n1(x - rx)} ${n1(y)}Q${n1(x - rx)} ${n1(y - ry)} ${n1(x)} ${n1(y - ry)}Q${n1(x + rx)} ${n1(y - ry)} ${n1(x + rx)} ${n1(y)}L${n1(x)} ${n1(yk)}Z`;
    plU += `M${n1(x - rx)} ${n1(y)}L${n1(x)} ${n1(yk)}L${n1(x + rx)} ${n1(y)}Q${n1(x + rx)} ${n1(y + ry)} ${n1(x)} ${n1(y + ry)}Q${n1(x - rx)} ${n1(y + ry)} ${n1(x - rx)} ${n1(y)}Z`;
    plR += `M${n1(x - rx)} ${n1(y)}Q${n1(x - rx)} ${n1(y - ry)} ${n1(x)} ${n1(y - ry)}Q${n1(x + rx)} ${n1(y - ry)} ${n1(x + rx)} ${n1(y)}Q${n1(x + rx)} ${n1(y + ry)} ${n1(x)} ${n1(y + ry)}Q${n1(x - rx)} ${n1(y + ry)} ${n1(x - rx)} ${n1(y)}Z`;
    plS += `M${n1(x - rx + 0.35)} ${n1(y + 0.3)}Q${n1(x + rx + 0.35)} ${n1(y + ry + 0.5)} ${n1(x + rx + 0.4)} ${n1(y + 0.25)}`;
    kiL += `M${n1(x - rx * 0.85)} ${n1(y - 0.02)}L${n1(x)} ${n1(yk)}L${n1(x + rx * 0.85)} ${n1(y - 0.02)}`;
  };
  const reihen = [52, 48.2, 44.4, 40.6, 36.8, 33, 29.2, 25.6, 22.2, 19, 16, 13.2, 10.6];
  reihen.forEach((x0, ri) => {
    const g = 1.18 * Math.pow(0.88, Math.max(0, ri - 5)), nPl = ri < 9 ? 4 : 2;
    for (let j = 0; j < nPl; j++) {
      const t = 0.04 + j / nPl * 0.5, x = x0 - j * 0.35 + (T.rnd() - 0.5) * 0.3, ya = yBei(OBEN, x), yb = yBei(UNTEN, x), y = ya + (yb - ya) * t + 0.35;
      const rx = g * (0.85 + 0.1 * j), ry = rx * (j === 0 ? 0.3 : 0.44);
      platte(x, y, rx, ry);
      if (F && ri < 10) for (let q = 0; q < 2; q++) { const xx = x + 1.75 * g + (T.rnd() - 0.5) * 0.4, yy = y + (T.rnd() - 0.5) * ry * 2, rr = g * (0.16 + T.rnd() * 0.07); kn += `M${n1(xx - rr)} ${n1(yy)}a${n1(rr)} ${n1(rr * 0.8)} 0 1 0 ${n1(2 * rr)} 0a${n1(rr)} ${n1(rr * 0.8)} 0 1 0 ${n1(-2 * rr)} 0`; }
    }
  });
  const osO = "#9a876a", osU = "#5e4e38";
  const panzer = () => (F ? `<path d="${plS}" fill="none" stroke="#000" stroke-opacity=".42" stroke-width=".35" filter="${weich(T, 0.12)}"/>` : "") +
    (F ? `<path d="${plO}" fill="${osO}"/><path d="${plU}" fill="${osU}"/>` : `<path d="${plU}" fill="${osU}"/><path d="${plO}" fill="${osO}"/>`) +
    (F ? `<path d="${plR}" fill="none" stroke="#1e160e" stroke-opacity=".55" stroke-width=".08"/>` : "") +
    (F ? `<path d="${kiL}" fill="none" stroke="#d8c8a2" stroke-opacity=".55" stroke-width=".08" stroke-linejoin="round"/>` : "");
  k += (F ? `<path d="${kn}" fill="#5e4e38"/><path d="${kn}" fill="none" stroke="#1e160e" stroke-opacity=".5" stroke-width=".06"/>` : "") + panzer();
  /* zwei Halb-Ringe über dem Hals: große gekielte Platten, dazwischen tiefe Hautfalten mit Schattenspalt */
  plO = plU = plR = plS = kiL = "";
  for (const [x, y, a2, b2] of [[53.6, -12.3, 1.2, 0.55], [53.9, -10.95, 1.3, 0.66], [54.1, -9.6, 1.15, 0.55], [56.4, -11.75, 1.05, 0.5], [56.6, -10.55, 1.15, 0.6], [56.8, -9.3, 1, 0.5]]) platte(x, y, a2, b2, 0.25);
  k += strich(T, [[[52.2, -13.8], [52.3, -11], [52.6, -8.2]], [[55.1, -13], [55.2, -10.4], [55.4, -8.2]], [[57.9, -12.4], [58, -10.2], [58.2, -8.4]]], "#140e08", 0.45, 0.75, 0.12) + panzer();
  s += masse(T, [RUMPF, HB, VB], grund, k) + volLage(T, "rumpf", [RUMPF, HB, VB], 1.8, 5);
  /* Hufe: hinten 3 breite, flache Schaufelhufe (mittlerer 15 % größer), leicht gefächert; vorn kürzer, im Halbkreis */
  s += hufe(T, [[28.4, 1.8, 0.8, -0.1], [30.4, 2.1, 0.92, 0], [32.4, 1.8, 0.8, 0.15]], "#3a3026") + hufe(T, [[49.4, 1.3, 0.62], [50.8, 1.45, 0.68], [52.2, 1.35, 0.62]], "#3a3026");
  s += kontakt(T, 30.4, 6) + kontakt(T, 50.8, 5) + kontakt(T, 33.6, 5);
  /* ---------- Keule vorn (großer Knauf) + Griff-Übergang ---------- */
  s += masse(T, [K1], knochen, oval(T, 4.8, -6.2, 2.2, 0.9, 0, DUNKEL, 0.55, 0.35) + oval(T, 4, -8.3, 1.1, 0.5, -10, HELL, 0.22, 0.3) +
    haut(T, tub(T, "tP", 0.19), [[2, -10], [7, -10], [7, -5], [2, -5]], 0.75) + strich(T, [[[2.9, -8.8], [2.6, -7.4], [2.9, -6]]], DUNKEL, 0.25, 0.5, 0.08));
  /* ---------- seitliche Randstacheln: gekielte Pyramiden, Basis eingebettet; Schulter groß, Becken mittel, Schwanz klein ---------- */
  let za = "", zaS = "", zaD = "";
  const stacheln = [[50.6, 2.4], [47.3, 2.25], [43.9, 2], [40.4, 1.85], [37, 1.7], [33.5, 1.6], [30, 1.5], [26.6, 1.35], [22.8, 1.05], [19, 0.9], [15.4, 0.75], [12, 0.65], [8.8, 0.55]];
  stacheln.forEach(([x0, b], i) => {
    const x = x0 + (T.rnd() - 0.5) * 0.6, y = yBei(RAND, x) + 0.15, L = b * 0.9;
    const w = (158 + i * 0.8) * Math.PI / 180, d = [Math.cos(w), Math.sin(w)], nn = [-d[1], d[0]];
    const A = [x + nn[0] * b / 2, y + nn[1] * b / 2], B = [x - nn[0] * b / 2, y - nn[1] * b / 2], S2 = [x + d[0] * L, y + d[1] * L];
    const lo = A[1] > B[1] ? A : B, hi = A[1] > B[1] ? B : A;
    za += `M${zug(A)}L${zug(S2)} ${zug(B)}Z`;
    zaD += `M${zug([x, y])}L${zug(S2)} ${zug(lo)}Z`;
    zaS += `M${zug([hi[0] + 0.25, hi[1] + 0.35])}L${zug([S2[0] + 0.3, S2[1] + 0.45])} ${zug([lo[0] + 0.25, lo[1] + 0.35])}Z`;
  });
  s += `<path d="${zaS}" fill="#000" opacity=".4" filter="${weich(T, 0.3)}"/><path d="${za}" fill="#8c7a5a"/><path d="${zaD}" fill="#3a2e20" opacity=".72"/>` +
    `<path d="${za}" fill="none" stroke="#241a10" stroke-opacity=".5" stroke-width=".1" stroke-linejoin="round"/>`;
  /* ---------- Kopf-Details: Hornschnabel, seitliches Nasenloch unter Nasenplatte, Schädelplatten-Mosaik, vier Hörner ---------- */
  s += masse(T, [[[64.8, -10.5], [65.35, -10.35, 1], [65.72, -9.6], [65.75, -8.6, 1], [65.25, -8.18, 1], [64.75, -8.25], [64.65, -9.3]]],
    ulg(T, "schnabel", [[0, "#3e3428"], [0.7, "#6e6250"], [1, "#a39274"]], 64.6, 0, 65.8, 0), strich(T, [[[65.7, -9.6], [65.75, -8.6], [65.3, -8.2]]], "#d8c8a4", 0.06, 0.55));
  let mo = "";
  if (F) {
    for (const [x, y, g] of [[59.2, -11.55, 0.78], [60.75, -11.35, 0.78], [62.3, -11.05, 0.76], [63.75, -10.65, 0.66], [64.85, -10.2, 0.5], [59.9, -10.55, 0.6],
      [63.1, -9.95, 0.55], [64.3, -9.75, 0.45], [58.7, -10.65, 0.5]]) {
      const P = Array.from({ length: 6 }, (_, i) => { const a = (i * 60 - 90 + (T.rnd() - 0.5) * 24) * Math.PI / 180, q = g * (0.92 + T.rnd() * 0.16); return [x + Math.cos(a) * q, y + Math.sin(a) * q * 0.52]; });
      mo += "M" + P.map(zug).join("L") + "Z";
    }
  }
  s += (F ? `<path d="${mo}" fill="${T.lg("cap", [[0, "#8e7c5c"], [1, "#4e4030"]])}" fill-opacity=".85" stroke="#1a130b" stroke-width=".1" stroke-opacity=".8" stroke-linejoin="round"/>` : "") +
    /* Nasenplatte über dem seitlichen Nasenloch (wirft Schatten), Nasenloch innen dunkel, unten Lichtkante */
    `<ellipse cx="64.15" cy="-9.2" rx=".38" ry=".24" fill="#1c1610"/>` + oval(T, 64.15, -9.38, 0.42, 0.1, 0, DUNKEL, 0.6, 0.06) +
    strich(T, [[[63.8, -8.97], [64.45, -8.99]]], HELL, 0.05, 0.45);
  /* Squamosalhorn (obere Hinterecke, nach hinten, Oberseite bündig mit dem Schädeldach) und Quadratojugalhorn
     (untere Hinterecke, 30° nach hinten-unten): zwei Facetten, Schlagschatten auf den Hals */
  s += `<path d="M59 -12.1L56.7 -12.6 58.6 -10.9Z" fill="#8a7656"/><path d="M56.7 -12.6L58.6 -10.9 58.8 -11.6Z" fill="#3a2e20" opacity=".7"/>` +
    `<path d="M59.4 -8.9L57.9 -7.4 59.3 -7.9Z" fill="#8a7656"/><path d="M57.9 -7.4L59.3 -7.9 59.5 -8.3Z" fill="#3a2e20" opacity=".7"/>`;
  /* Auge: weiter hinten und höher (~55 % der Schädellänge), unter knöchernem Brauenwulst */
  s += auge2(T, 61.5, -10.1, 0.36, { iris: "#a8742c", iris2: "#3e240c", winkel: -8 });
  const kk = 10, box = [0, -17, 65.75, 0];
  const fuss = (p) => { const u = p.filter((q) => q[1] > -0.6); return Math.round(u.reduce((a, q) => a + q[0], 0) / u.length * kk); };
  return { svg: DM(s, kk), box: box.map((v) => Math.round(v * kk)), fuesse: [fuss(HB), fuss(VB), fuss(hbF)], kopf: [555, -135, 665, -65] };
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
  genau(T);
  const F = T.fein;
  let s = "";
  /* ---------- Formen (1 Einheit = 10 cm) ---------- */
  const OBEN = [[0.6, -21.8], [6, -22.9], [12, -24.2], [18, -25.5], [24, -26.6], [30, -27.4], [36, -27.8], [41, -27.5], [46, -26.6], [50, -25.4], [54, -24],
    [57.4, -23.2], [60.4, -23.4], [63, -24.6], [65.6, -26.6], [67.8, -28.6], [69.6, -30.2], [71.2, -31.1]];
  const UNTEN = [[0.6, -20.6], [6, -20], [12, -19.2], [18, -18.4], [24, -17.6], [28, -16.9], [32, -16.2], [36, -15.4], [40, -14.8], [46, -14.4], [50, -14.1],
    [54, -14.3], [58, -14.9], [61.6, -16.6], [64, -19.4], [66.4, -22.6], [68.8, -25], [71, -26.4]];
  /* Kopf + Röhrenkamm: Schnauzenprofil geht ohne Stufe in die Kamm-Oberkante über; Kamm 30–35° über der Waagerechten,
     weit über den Hinterkopf hinaus, Spitze als leicht verdickter Kolben; Kopf 10–15° nach unten geneigt */
  const KOPF = [[72.2, -32.5], [71, -33.3], [69, -34.7], [66.8, -35.8], [65.2, -36.3], [64.6, -37.1], [65, -38], [66, -38.3], [67.2, -37.7], [69.2, -36.5],
    [71.8, -34.9], [74.4, -33], [76.6, -31.4], [78.4, -30.2], [80.6, -29.1], [82.3, -28.2], [82.85, -27.2], [82.6, -26.5], [82.1, -26.1], [81.3, -25.75],
    [79.8, -25.8], [77.8, -26.1], [75.6, -26.5], [73.4, -26.7], [72, -26.5]];
  const RUMPF = [[0, -21.6], ...OBEN, ...KOPF, ...UNTEN.slice().reverse()];
  /* Hinterbein als Z: Oberschenkel (Muskelpaket) schräg nach vorn zum Knie, Unterschenkel nach hinten zur Ferse,
     Mittelfuß steil nach vorn, nur die Zehen am Boden */
  const HB = [[32.4, -25.5], [31.8, -20.4], [33, -16.4], [35, -13.4], [37.4, -11.4], [36.6, -9], [35.6, -6.8], [35.4, -5.6], [36.6, -4], [38.6, -2.2], [40, -0.8],
    [40.6, 0, 1], [46.6, 0, 1], [46.8, -0.8], [45.2, -1.4], [43.4, -2], [41.6, -3.4], [40.2, -5], [40.6, -7], [42.2, -9], [44, -10.8], [45, -12.6],
    [45.2, -15.6], [44.4, -20], [42.4, -24], [39, -27.4]];
  /* Vorderbein: schlank (≈ 45–50 % des Hinterbeins), Deltopectoral-Beule vorn oben, Ellbogen nach hinten, Fäustling */
  const VB = [[54.4, -20.4], [53.6, -16.6], [53.4, -13.4], [54, -11.4], [54.8, -8.6], [55.4, -5.6], [55.6, -3.4], [55.2, -1.6], [55.6, -0.4], [56, 0, 1],
    [59.8, 0, 1], [60, -0.8], [59.2, -1.6], [58.6, -2.8], [58.2, -5], [57.8, -8.2], [57.6, -11], [58, -13.8], [59.2, -16.4], [59.6, -19], [58.6, -21.4]];
  const schieb = (p, dx) => p.map((q) => { const z = [q[0] + dx, q[1]]; if (q[2]) z.push(1); return z; });
  const hbF = schieb(HB, 4.6), vbF = schieb(VB, -3.2);

  /* ---------- ferne Beine: gleiches Z, Körperton −20 %, mit vollständigem Fuß ---------- */
  const fernF = ulg(T, "fern", [[0, "#4a3e27"], [0.6, "#43382a"], [1, "#2c2519"]], 0, -14, 0, 0);
  s += masse(T, [kappen(hbF, -18), kappen(vbF, -16)], fernF, zylinder(T, hbF, -15, { op: 0.8 }) + zylinder(T, vbF, -14.4, { op: 0.8 }) +
    blob(T, [[34, -16.4], [64, -15], [64, -12], [34, -13.4]], DUNKEL, 0.45, 1.2) +
    haut(T, tub(T, "tL", 0.19), [[36, -14], [52, -14], [52, 0], [36, 0]], 0.3));
  s += hufe(T, [[45.6, 1.7, 0.8], [47.6, 2, 0.95], [49.5, 1.7, 0.8]], "#2e271c") + hufe(T, [[54.2, 1.1, 0.5], [55.3, 1.2, 0.55], [56.4, 1.1, 0.5]], "#2e271c");

  /* ---------- Körper + Kopf + Kamm + nahe Beine als EINE Masse ---------- */
  const grund = ulg(T, "haut", [[0, "#5a4a2e"], [0.3, "#73613f"], [0.5, "#857250"], [0.7, "#6e5d40"], [1, "#4a3e2c"]], 0, -29, 0, 0);
  const kernZone = zoneBand(OBEN, UNTEN, 0.6, 71, 0.62, 1.1);
  let k = "";
  /* EIN Muster für beide Größen: 10 dunkle Rücken-Sättel, die bis zur Flankenmitte auslaufen, weiche Kanten */
  k += [5.4, 11.4, 17.4, 23.4, 29.6, 35.8, 42, 48, 53.8, 59.6, 64.8].map((x, i) => {
    const yo = yBei(OBEN, x), yu = yBei(UNTEN, x), L = (yu - yo) * (x > 30 && x < 58 ? 0.48 : 0.56), b = 2.3 - Math.abs(i - 5) * 0.1;
    return blob(T, [[x - b * 0.7, yo - 0.6], [x + b * 0.7, yo - 0.6], [x + b * 0.4 - L * 0.05, yo + L * 0.5], [x - L * 0.12, yo + L], [x - b * 0.5 - L * 0.08, yo + L * 0.5]], "#2a1e0e", 0.46, 0.5);
  }).join("");
  /* Gegenschattierung: Bauch, Kehle und Schwanzunterseite wärmer und heller */
  k += blob(T, [[30, -17.2], [40, -15.4], [50, -14.6], [58, -15.2], [64, -19.4], [69, -25.4], [71.6, -26.6], [66, -21.8], [58, -17], [46, -16.8], [36, -18]], "#c8b48a", 0.3, 0.8);
  /* EIN Licht oben links: Glanzband, Kernschatten, Bodenreflex; Okklusion an den Ansätzen */
  k += rumpfLicht(T, OBEN, UNTEN, 0.6, 71, { tiefe: 16, glanz: 0.42, kern: 0.6 }) +
    oval(T, 44.6, -15.2, 1.2, 1.4, 0, DUNKEL, 0.3, 0.6) + oval(T, 53.8, -14.8, 0.9, 1.4, 0, DUNKEL, 0.3, 0.6) + oval(T, 59.4, -15.4, 1, 1.3, 0, DUNKEL, 0.28, 0.6) +
    /* Oberschenkel-Muskelbauch: weicher unterer Schattenrand, läuft in den Schwanzansatz (Caudofemoralis) */
    strich(T, [[[31.6, -19.4], [34, -16.4], [37.6, -14.2], [41, -14], [44, -15.2]]], DUNKEL, 1.4, 0.3, 0.6) + oval(T, 38.6, -21, 4.4, 3.6, -10, HELL, 0.18, 1) +
    oval(T, 44.2, -11.4, 0.9, 0.8, 0, HELL, 0.32, 0.3) + oval(T, 35.8, -5.8, 0.6, 0.7, 0, HELL, 0.22, 0.25) +
    zylinder(T, HB, -14.6) + zylinder(T, VB, -14.2) +
    /* Schlagschatten: Vorderbein auf die Brust, Kopf auf den Hals, Kamm auf den Hinterkopf */
    blob(T, [[59.6, -18], [61.6, -15.6], [61.2, -13.4], [59.4, -14.6]], DUNKEL, 0.35, 0.5) +
    blob(T, [[70.6, -31], [72.4, -30.4], [72.6, -27], [70.6, -26.4], [69.6, -28.6]], DUNKEL, 0.42, 0.45) +
    blob(T, [[72.4, -32.4], [74.6, -32.2], [76, -31], [73.2, -30.8]], DUNKEL, 0.4, 0.35);
  /* Röhrenkamm: Rotbraun, zur Basis entsättigt; Zylinderlicht (Glanz oben, Kernschatten unten, Reflex an der Unterkante);
     seitliche Längsrinne (Röhrengrenze) bis 80 % der Länge */
  const KAMM = [[76.4, -31.6], [74.4, -33], [71.8, -34.9], [69.2, -36.5], [67.2, -37.7], [66, -38.3], [65, -38], [64.6, -37.1], [65.2, -36.3], [66.8, -35.8],
    [69, -34.7], [71, -33.3], [72.6, -32.2], [74.8, -31.4]];
  k += blob(T, KAMM, ulg(T, "kamm", [[0, "#8a6a48"], [0.45, "#94512e"], [1, "#a85a34"]], 76, 0, 65, 0), 0.92, 0.15) +
    strich(T, [[[75.4, -32.2], [72.6, -34.2], [69.6, -36], [67.2, -37.3], [65.8, -37.7]]], HELL, 0.5, 0.36, 0.15) +
    strich(T, [[[73.8, -31.9], [71.2, -33.6], [68.6, -35.1], [66.2, -36.2]]], DUNKEL, 0.6, 0.42, 0.18) +
    strich(T, [[[72.2, -32.4], [69.6, -34.2], [67, -35.6], [65.4, -36.2]]], "#d8a070", 0.2, 0.3, 0.08) +
    strich(T, [[[75, -32.4], [72.4, -34.4], [69.6, -35.9], [67.4, -36.9]]], DUNKEL, 0.12, 0.3) +
    strich(T, [[[75, -32.6], [72.4, -34.6], [69.6, -36.1], [67.4, -37.1]]], "#f0c898", 0.1, 0.4) +
    haut(T, tub(T, "tK", 0.19), KAMM, 0.35);
  /* Kopf: Wangenwulst über der hinteren Mundlinie, Unterkieferkontur, Kehlfalte, Kaumuskel, Nasengrube */
  k += oval(T, 77.6, -28, 1.8, 0.7, -12, HELL, 0.32, 0.35) + strich(T, [[[74.6, -27], [77, -26.9], [79.6, -26.6]]], DUNKEL, 0.5, 0.3, 0.2) +
    oval(T, 74, -29, 1.4, 1.6, 0, HELL, 0.16, 0.5) + oval(T, 79.8, -28.4, 1, 0.5, -20, DUNKEL, 0.28, 0.25) +
    falten2(T, [[[71.6, -26.2], [72.4, -25.4], [72.6, -24.4]], [[64.6, -25.6], [65.4, -23], [65.6, -20.6]], [[66.8, -27.4], [67.6, -25], [67.8, -22.6]],
      [[62.6, -24.2], [63.2, -21.8], [63.2, -19.4]], [[60.4, -22.6], [61, -20.4]], [[58.6, -22.4], [59.2, -20.4], [59.4, -18.4]], [[57.2, -22], [57.8, -20.2]],
      [[42.4, -25.2], [43.6, -21.6]], [[29.4, -24.8], [30.6, -22]], [[27.4, -24.6], [28.4, -21.8]], [[41.6, -3.6], [42.6, -3.1], [43.6, -3.3]],
      [[42.4, -9.4], [43.4, -10.4]], [[36.4, -6.6], [37.6, -6.2]], [[56, -2.6], [57, -2.3], [58.2, -2.5]]], 0.2) +
    /* Schwanz-Oberkante: Reihe etwas größerer Tuberkel; 6–8 leichte Segmentbänder */
    rosetten(T, [[4, -22.4, 0.3], [8.6, -23.4, 0.32], [13.2, -24.5, 0.34], [17.8, -25.6, 0.36], [22.4, -26.6, 0.38], [27, -27.4, 0.4], [31.6, -27.9, 0.42], [36.2, -28.1, 0.42],
      [40.8, -27.9, 0.42], [45.2, -27.1, 0.4], [49.4, -25.9, 0.38], [53.4, -24.6, 0.34], [38, -22, 0.4], [41.6, -20, 0.38], [35.2, -19.2, 0.36]], "#9a8460") +
    /* Haut: dichtes Tuberkel-Mosaik, Rücken/Oberschenkel etwas gröber, Hals/Gesicht/Gelenke fein */
    haut(T, tub(T, "tR", 0.3, { sy: 0.82 }), zoneBand(OBEN, UNTEN, 1, 66, -0.1, 0.18), 0.8, { schatten: kernZone }) +
    haut(T, tub(T, "tM", 0.24), zoneBand(OBEN, UNTEN, 1, 71, 0.18, 0.62), 0.8, { schatten: kernZone }) +
    haut(T, tub(T, "tB", 0.19), zoneBand(OBEN, UNTEN, 1, 71, 0.62, 1.05), 0.65, { schatten: kernZone, schattenOp: 0.6 }) +
    haut(T, tub(T, "tG", 0.19), [[71.6, -31], [76.6, -31.2], [82.6, -27.6], [82, -25.8], [72, -26.2]], 0.55) +
    haut(T, tub(T, "tL"), [[32, -16], [45, -14], [46.6, 0], [37, 0]], 0.7) + haut(T, tub(T, "tL"), [[53.4, -13], [59.4, -13], [60, 0], [55.4, 0]], 0.7);
  s += masse(T, [RUMPF, HB, VB], grund, k) + volLage(T, "rumpf", [RUMPF, HB, VB], 2.2, 6);
  /* Hufe: Hinterfuß 3 Zehen (mittlere 1,2× größer) mit breiten, flachen, gerundeten Hufen; Hand als Fäustling mit drei
     kleinen Hufnägeln vorn und Finger V als kurzem Stummel hinten außen */
  s += hufe(T, [[42.2, 1.9, 0.85, -0.1], [44.3, 2.3, 1, 0], [46.4, 1.9, 0.85, 0.15]], "#3e3528") + hufe(T, [[57.3, 1.1, 0.5], [58.4, 1.2, 0.55], [59.5, 1.05, 0.5]], "#3e3528") +
    oval(T, 55.8, -0.9, 0.5, 0.35, 0, "#5e4e34", 1, 0.08);
  s += kontakt(T, 44, 5.4) + kontakt(T, 58, 3.6) + kontakt(T, 48.4, 4.6);
  /* Hornschnabel: Ober- und Unterschnabel getrennt (schmaler Spalt), Schneidkante mit feinen Kerben, Horn oliv-grau → dunkle Spitze */
  const OS = [[80.6, -29.05], [82.3, -28.2], [82.85, -27.2], [82.6, -26.5, 1], [81.6, -26.85], [80.5, -27.3]], US = [[80.6, -26.65], [82.15, -26.2, 1], [81.3, -25.75], [80.3, -25.8]];
  s += masse(T, [OS, US], ulg(T, "schnabel", [[0, "#6e6652"], [0.6, "#4a4236"], [1, "#22201a"]], 80.4, 0, 82.9, 0),
    (F ? strich(T, [[[81, -28.6], [82.4, -27.8]], [[80.9, -28.2], [82.5, -27.3]], [[80.8, -27.8], [82.4, -26.9]]], "#d8cdb0", 0.05, 0.15) : "") +
    oval(T, 81.8, -28, 0.3, 0.16, -30, HELL, 0.45, 0.06)) +
    (F ? `<path d="M81.2 -26.95l.1 .14M81.6 -26.8l.1 .15M82 -26.66l.1 .14" stroke="#1a1610" stroke-width=".06" stroke-opacity=".7"/>` : "");
  /* Nasenloch: längliches Schlitz-Oval auf der fleischigen Schnauze hinter/über dem Schnabelrand */
  s += `<ellipse cx="79.9" cy="-28.55" rx=".6" ry=".26" transform="rotate(-24 79.9 -28.55)" fill="${T.rg("nloch", [[0, "#080604"], [0.7, "#1c150d"], [1, "#3a2e1e", 0.4]])}"/>` +
    strich(T, [[[79.3, -28.85], [80, -29.05], [80.6, -28.85]]], HELL, 0.08, 0.5);
  /* Mundlinie: gerade, leicht abfallend, endet unter dem vorderen Augenrand */
  s += strich(T, [[[80.5, -27.05], [79, -27.3], [77.4, -27.55], [76.6, -27.65]]], DUNKEL, 0.12, 0.7) + strich(T, [[[80.2, -26.8], [78.4, -27.05], [76.8, -27.3]]], HELL, 0.12, 0.25, 0.04);
  /* Auge: 1,4× größer, unter der Kammbasis bei ~58 % der Kopflänge, Brauenwulst, Hautfalten am Augenwinkel */
  s += auge2(T, 76.3, -29.55, 0.5, { iris: "#b07a2e", iris2: "#46280c", winkel: -14 }) +
    falten2(T, [[[75.2, -29.4], [74.4, -29.2], [73.6, -29.4]], [[75.2, -29.9], [74.4, -30.1]]], 0.08);
  const kk = 10, box = [0, -38.3, 82.85, 0];
  const fuss = (p) => { const u = p.filter((q) => q[1] > -0.6); return Math.round(u.reduce((a, q) => a + q[0], 0) / u.length * kk); };
  return { svg: DM(s, kk), box: box.map((v) => Math.round(v * kk)), fuesse: [fuss(HB), fuss(VB), fuss(hbF), fuss(vbF)], kopf: [630, -395, 840, -245] };
}


/* Sauropoden-Fuß: säulenartig, Ballen; vorn nur Daumenkralle, hinten drei große Krallen (Klauen nach vorn-innen) */
function krallen(T, liste, farbe) {
  const d = liste.map(([x, y, l, h]) => `M${r(x)} ${r(y)}c${r(l * 0.4)} ${r(-h * 0.2)} ${r(l * 0.9)} ${r(h * 0.1)} ${r(l)} ${r(h * 0.75)}c${r(-l * 0.35)} ${r(-h * 0.25)} ${r(-l * 0.75)} ${r(-h * 0.25)} ${r(-l)} ${r(-h * 0.2)}z`).join("");
  return `<path d="${d}" fill="${farbe}" stroke="#120d08" stroke-width=".12" stroke-opacity=".7"/>`;
}

/* Sauropoden-Krallen: sichelförmig, kegelig, mit Volumen (dunkle Basis, helle Kante entlang der Krümmung), aus einer
   Hautfalte wachsend. liste: [x, y, länge, höhe, richtung (1 = nach vorn, −1 = nach hinten)] */
function krallen2(T, liste) {
  let d = "", k = "", h = "";
  for (const [x, y, l, hh, rr = 1] of liste) {
    d += `M${n1(x)} ${n1(y - hh)}c${n1(rr * l * 0.5)} ${n1(-hh * 0.1)} ${n1(rr * l * 0.95)} ${n1(hh * 0.3)} ${n1(rr * l)} ${n1(hh)}c${n1(-rr * l * 0.3)} ${n1(-hh * 0.25)} ${n1(-rr * l * 0.7)} ${n1(-hh * 0.15)} ${n1(-rr * l)} 0z`;
    k += `M${n1(x + rr * l * 0.1)} ${n1(y - hh * 0.95)}c${n1(rr * l * 0.4)} ${n1(-hh * 0.05)} ${n1(rr * l * 0.75)} ${n1(hh * 0.3)} ${n1(rr * l * 0.85)} ${n1(hh * 0.7)}`;
    h += `M${n1(x - rr * l * 0.05)} ${n1(y - hh * 1.05)}q${n1(rr * l * 0.12)} ${n1(hh * 0.5)} 0 ${n1(hh)}`;
  }
  return `<path d="${d}" fill="${T.lg("kralle", [[0, "#3a3226"], [1, "#8c806a"]], 0, 0, 1, 0)}"/>` +
    `<path d="${k}" fill="none" stroke="#d8ccb0" stroke-opacity=".55" stroke-width="${n1(liste[0][3] * 0.12) || 0.1}" stroke-linecap="round"/>` +
    `<path d="${h}" fill="none" stroke="${DUNKEL}" stroke-opacity=".5" stroke-width="${n1(liste[0][3] * 0.25) || 0.1}" stroke-linecap="round"/>`;
}
/* Elefantenfalten an einem Gelenk: 3–5 unregelmäßige, wellige, quer laufende Falten (Kerbe dunkel, Kante hell) */
function gelenkFalten(T, x0, x1, y, n, abst, w) {
  const l = [];
  for (let i = 0; i < n; i++) {
    const yy = y + i * abst + (T.rnd() - 0.5) * abst * 0.4, a = x0 + (x1 - x0) * (0.05 + T.rnd() * 0.15), b = x1 - (x1 - x0) * (0.05 + T.rnd() * 0.2);
    const m1 = a + (b - a) * 0.33, m2 = a + (b - a) * 0.66;
    l.push([[a, yy - abst * 0.25], [m1, yy + abst * (0.15 + T.rnd() * 0.3)], [m2, yy - abst * T.rnd() * 0.25], [b, yy + abst * (T.rnd() - 0.2) * 0.5]]);
  }
  return falten2(T, l, w, 0.45);
}
/* =====================================================================
   BRACHIOSAURUS
   RECHERCHE: Brachiosaurus altithorax, Oberjura (Kimmeridge–Tithon, Morrison-
   Formation, Nordamerika), ~154–150 Mio. Jahre. 18–22 m lang (Holotyp
   subadult), 28–47 t; Kopf ~12–13 m hoch. VORDERBEINE LÄNGER als die
   Hinterbeine (Oberarm 2,04 m ≈ Oberschenkel 2,03 m, aber Elle/Speiche und
   Mittelhand länger) → Rumpf steigt nach vorn steil an, Schulter ~1,35× so hoch
   wie die Hüfte; langer, tiefer Brustkorb („altithorax"); Hals tritt steil aus
   dem Rumpf (Taylor 2009), leichtes S; Schwanz verhältnismäßig kurz, kräftig,
   stumpf endend. Schädel camarasaurusähnlich, Nasenbogen (Knochenbogen über
   den Nasenöffnungen) vor/über dem Auge, niedriger und runder als bei
   Giraffatitan; Schnauze stumpf und hoch; spatelförmige Zähne; fleischiges
   Nasenloch vorn-oben an der Schnauze (Witmer 2001). Hand röhrenförmig
   („Hufeisen"), nur EINE Kralle (Daumen, innen, nach hinten-innen); Fuß kurz
   und breit mit Fersenpolster, drei Krallen (innere am größten) nach vorn-
   außen. Haut: nicht überlappende Höckerschuppen, Falten vor allem an Schulter,
   Hüfte und Gelenken. Farbe unbekannt → Rücken kühles Graugrün mit dunkleren
   Flecken, Bauch/Kehle sandoliv (Gegenschattierung), Schlamm an den Füßen.
   ===================================================================== */
function brachiosaurus(T) {
  genau(T);
  const F = T.fein;
  let s = "";
  /* ---------- Formen (1 Einheit = 10 cm) ---------- */
  const OBEN = [[0, -35.6], [10, -39.4], [22, -43.6], [34, -47], [44, -49], [52, -50.1], [56, -50.6], [60, -50.2], [66, -50.8], [76, -53.8], [88, -57.8],
    [100, -62.2], [108, -65.2], [114, -67.8], [122, -73], [130, -80.6], [138, -89.4], [145, -98.6], [151, -107.4], [156, -115], [160, -120.6], [163.6, -124.2], [165.6, -125.6]];
  const UNTEN = [[0, -32.6], [10, -34.6], [20, -36.2], [30, -37.2], [38, -36.6], [44, -34.6], [48, -31.4], [52, -29.6], [56, -28.4], [66, -28.6], [78, -30.2],
    [90, -32.6], [100, -35.2], [108, -37], [116, -40.4], [121, -46.4], [126, -53.6], [131, -62], [137, -72.4], [143, -83], [149, -94], [154, -104],
    [158, -111.6], [162, -117.4], [165.2, -120.6], [168.2, -121.4]];
  /* Kopf: Nasenbogen vor/über dem Auge, Schnauze stumpf und hoch, Hals setzt hinten unten an, Kopf leicht geneigt */
  const KOPF = [[166.8, -126.4], [168.6, -127.4], [169.4, -127.3], [170.6, -127.9], [172, -128.5], [173.4, -127.9], [174.6, -126.9], [176.2, -126.5],
    [177.6, -126.3], [178.4, -125.5], [178.6, -124.1], [178.2, -123], [177, -122.5], [174.8, -122.2], [172.4, -121.9], [170.2, -121.5], [168.8, -121.3]];
  const RUMPF = [[-0.6, -34.1], ...OBEN, ...KOPF, ...UNTEN.slice().reverse()];
  /* Hinterbein: Oberschenkel, Knie leicht vorn (45 % der Beinlänge), Unterschenkel, Fußgelenk, kurzer breiter Fuß mit Fersenpolster */
  const HB = [[48, -40], [47.2, -32], [48.4, -24], [49.6, -18], [50.2, -12], [50.2, -6.4], [49.2, -3.2], [48.4, -1], [48.8, 0, 1], [59.4, 0, 1], [59.8, -1],
    [58.6, -2.2], [57.6, -4], [57.8, -8.4], [58.4, -14], [59.6, -18.4], [60.4, -22], [60.8, -28], [60, -36], [56.6, -42]];
  /* Vorderbein: länger, 15 % schlanker; Ellbogen-Knick nach hinten, Handgelenk-Verdickung, Hufeisen-Säule */
  const VB = [[100, -52], [99.6, -42], [100.2, -33], [100.8, -27.4], [101.6, -21], [102, -13], [102, -6.4], [101.6, -4.4], [101.6, -1.6], [101.4, 0, 1],
    [108.8, 0, 1], [108.8, -1.6], [108.6, -4.4], [108.4, -6.6], [108.4, -13], [108.6, -20], [109.2, -26.4], [110.2, -33], [111, -42], [110.6, -50], [106.6, -55]];
  const schieb = (p, dx) => p.map((q) => { const z = [q[0] + dx, q[1]]; if (q[2]) z.push(1); return z; });
  const hbF = schieb(HB, 6), vbF = schieb(VB, -6);
  const HALS_O = OBEN.slice(13), HALS_U = UNTEN.slice(15);

  /* ---------- ferne Beine: Körperton −20 %, modelliert ---------- */
  const fernF = ulg(T, "fern", [[0, "#3e4231"], [0.6, "#383b2c"], [1, "#24261c"]], 0, -40, 0, 0);
  s += masse(T, [kappen(hbF, -30), kappen(vbF, -36)], fernF, zylinder(T, hbF, -28, { op: 0.8 }) + zylinder(T, vbF, -35, { op: 0.8 }) +
    blob(T, [[54, -31], [104, -37], [104, -31], [54, -25]], DUNKEL, 0.5, 2) +
    gelenkFalten(T, hbF[3][0], hbF[16][0], -6.6, 4, 1.2, 0.35) + gelenkFalten(T, vbF[6][0] + 0.4, vbF[13][0], -6.4, 4, 1.2, 0.3) +
    blob(T, [[52, -5], [70, -5], [70, 0.5], [52, 0.5]], "#5a4428", 0.22, 0.8) + blob(T, [[92, -5], [106, -5], [106, 0.5], [92, 0.5]], "#5a4428", 0.22, 0.8));
  s += krallen2(T, [[64.6, 0, 3, 1.5], [62.6, 0, 2.6, 1.3], [60.8, 0, 2.2, 1.1]]) + krallen2(T, [[96.2, 0, 1.4, 1, -1]]);

  /* ---------- Körper + Hals + Kopf + nahe Beine als EINE Masse ---------- */
  const grund = ulg(T, "haut", [[0, "#4c5240"], [0.35, "#626a50"], [0.5, "#757858"], [0.7, "#5e6248"], [1, "#4a4c3a"]], 0, -68, 0, 0);
  const kernZone = zoneBand(OBEN, UNTEN, 0, 120, 0.6, 1.1);
  let k = "";
  /* Gegenschattierung (Bauch, Kehle wärmer und heller), große dunklere Flecken auf Rücken und Flanke */
  k += blob(T, [[52, -32], [80, -32.4], [104, -38], [118, -44], [130, -60], [146, -84], [160, -108], [166, -118], [158, -104], [140, -76], [120, -48], [100, -40], [70, -34]], "#c8bf94", 0.32, 1.4) +
    (F ? [[30, -42, 4, 1.6, -16], [46, -46, 3.6, 1.6, -6], [62, -47, 4.2, 1.8, -8], [78, -51, 4.6, 2, -14], [92, -55, 4, 1.8, -18], [104, -58.6, 3.6, 1.6, -20], [70, -42, 3.4, 1.4, -6],
      [88, -47, 3.2, 1.4, -10], [126, -70, 2.6, 1.3, -50], [138, -84, 2.2, 1.1, -50]].map(([x, y, a, b, w]) => oval(T, x, y, a, b, w, "#2a3020", 0.3, 0.8)).join("") : "");
  /* EIN Licht oben vorn links: Glanzband Rücken und Halsoberseite, Kernschatten unten, Bodenreflex; kühles Kantenlicht hinten am Hals */
  k += rumpfLicht(T, OBEN.slice(0, 15), UNTEN.slice(0, 15), 0, 122, { tiefe: 24, glanz: 0.45, kern: 0.62 }) +
    rumpfLicht(T, HALS_O, HALS_U, 122, 166, { tiefe: 10, glanz: 0.4, kern: 0.48 }) +
    strich(T, [[[118, -70.4], [130, -79], [142, -91], [152, -103], [160, -115]]], "#dce6e4", 0.5, 0.3, 0.2);
  /* Muskelmassen: Schulter (Oberarm-Ansatz), Oberschenkel, Schwanzwurzel (Caudofemoralis), Kreuzbein-Höcker */
  k += oval(T, 106, -46, 7, 6, -10, HELL, 0.2, 2) + oval(T, 54.4, -34, 6, 6, 0, HELL, 0.18, 2) + oval(T, 42, -42, 7, 2.6, -16, HELL, 0.18, 1.4) +
    strich(T, [[[61, -36], [61.6, -28], [60.6, -22]]], DUNKEL, 2, 0.3, 0.9) + strich(T, [[[111.4, -46], [111, -36], [109.8, -28]]], DUNKEL, 2, 0.32, 0.9) +
    /* Okklusion, wo die Beine in den Körper gehen (Sichel), Bauchschatten auf dem oberen Beindrittel */
    strich(T, [[[47, -30], [54, -28], [61.4, -30.6]], [[99.4, -36], [105, -36.6], [111.4, -39]]], DUNKEL, 2.6, 0.5, 1) +
    zylinder(T, HB, -29) + zylinder(T, VB, -36.6) +
    /* Brustfalte, wo Halsunterseite und Schulterbogen zusammentreffen (scharfkantig), Achsel- und Leistenfalten */
    falten2(T, [[[114.6, -42], [117.6, -46], [119, -51]], [[96, -36], [97.4, -40.4], [97.8, -46]], [[62.6, -32], [64, -36], [64.4, -40]], [[44.4, -40.6], [46.6, -37]]], 0.7) +
    /* Halsfalten: 5–8 wellige Hautfalten an der Unterseite, dichter an Basis und Kehle; Muskelschatten längs bei ~60 % */
    falten2(T, [119, 124, 129, 136, 144, 151, 157, 162].map((x, i) => { const y = yBei(HALS_U, x); return [[x - 2.2, y - 1.4], [x - 1.4, y - 3.4 + i * 0.1], [x - 0.2, y - 5]]; }), 0.5) +
    strich(T, [[[122, -60], [132, -71], [142, -83], [151, -95], [158, -106]]], DUNKEL, 1.2, 0.18, 0.6) +
    /* Gelenkfalten (Elefantenfalten) an Knie, Fußgelenk, Ellbogen, Handgelenk */
    gelenkFalten(T, 48.6, 59.6, -7, 4, 1.25, 0.4) + gelenkFalten(T, 49.6, 60, -20, 3, 1.4, 0.45) + gelenkFalten(T, 101.8, 108.6, -6.8, 4, 1.2, 0.36) +
    gelenkFalten(T, 100.6, 109.2, -27, 3, 1.4, 0.4) +
    /* Schlamm an den Unterschenkeln */
    blob(T, [[47, -6], [60, -6], [61, 0.6], [47, 0.6]], "#5e4a2c", 0.22, 0.8) + blob(T, [[100.6, -6], [109.6, -6], [109.6, 0.6], [100.6, 0.6]], "#5e4a2c", 0.22, 0.8) +
    /* Haut: Höckerschuppen in Zonen (Flanke/Schulter/Oberschenkel grob, Hals/Gesicht fein, Gelenke sehr fein) */
    haut(T, tub(T, "tR", 0.7), zoneBand(OBEN, UNTEN, 4, 120, -0.1, 0.6), 0.7, { schatten: kernZone }) +
    haut(T, tub(T, "tB", 0.4), zoneBand(OBEN, UNTEN, 4, 120, 0.6, 1.05), 0.55, { schatten: kernZone, schattenOp: 0.5 }) +
    haut(T, tub(T, "tN", 0.36), zoneBand(HALS_O, HALS_U, 120, 166, -0.1, 1.1), 0.6) +
    haut(T, tub(T, "tL", 0.32), [[46, -26], [62, -26], [62, 0], [46, 0]], 0.6, { sd: 1.6 }) + haut(T, tub(T, "tL"), [[98, -33], [112, -33], [112, 0], [98, 0]], 0.6, { sd: 1.6 }) +
    haut(T, tub(T, "tG", 0.19), [[166, -128], [178.8, -128], [178.8, -121], [166, -121]], 0.5) +
    rosetten(T, [[60, -45, 0.9], [66, -46.4, 1], [72, -47.6, 1], [78, -49.4, 0.95], [84, -51.4, 0.9], [90, -53.4, 0.9], [96, -55.4, 0.85], [74, -43, 0.85], [86, -46.6, 0.8]], "#8e9070") +
    /* Kopf: Narialgrube (vom Nasenloch zum Bogen), Kaumuskelwölbung hinter dem Auge, Wange, Kehlfalte */
    blob(T, [[173.2, -127.4], [176.6, -126], [176.8, -124.8], [174, -125.6]], DUNKEL, 0.22, 0.25) + oval(T, 172, -127.6, 1.4, 0.6, -10, HELL, 0.35, 0.3) +
    oval(T, 168.2, -123.6, 1.4, 1.4, 0, HELL, 0.2, 0.4) + strich(T, [[[167.2, -125.4], [167.6, -123.4], [168.6, -122.2]]], DUNKEL, 0.3, 0.4, 0.15) +
    strich(T, [[[177.6, -123.3], [175.4, -123.1], [173, -122.8], [171, -122.6]]], DUNKEL, 0.14, 0.7) + strich(T, [[[177.2, -123], [174.8, -122.8], [172.4, -122.5]]], HELL, 0.12, 0.25, 0.04) +
    oval(T, 172.4, -121.9, 3.4, 0.4, 0, DUNKEL, 0.4, 0.2) + falten2(T, [[[167.4, -121], [168.6, -120.4], [170, -120.6]]], 0.2) +
    (F ? `<path d="M177.9 -123.3l.06 .3M177.2 -123.25l.06 .32M176.5 -123.2l.06 .3" stroke="#e2d8bc" stroke-width=".14" stroke-linecap="round" stroke-opacity=".5"/>` : "");
  s += masse(T, [RUMPF, HB, VB], grund, k) + volLage(T, "rumpf", [RUMPF, HB, VB], 3.6, 6);
  /* Füße: hinten Fersenpolster und drei sichelförmige Krallen nach vorn-außen; vorn Hufeisen-Säule ohne Zehenvorsprung */
  s += krallen2(T, [[58.4, 0, 3.2, 1.6], [56.2, 0, 2.8, 1.4], [54.2, 0, 2.4, 1.2]]) + oval(T, 49.4, -0.5, 1.4, 0.5, 0, DUNKEL, 0.4, 0.2) +
    strich(T, [[[101.6, -0.4], [105, -0.6], [108.6, -0.4]]], DUNKEL, 0.5, 0.45, 0.15);
  s += kontakt(T, 54, 11) + kontakt(T, 105, 7.6) + kontakt(T, 60, 10) + kontakt(T, 99, 7);
  /* Nasenloch: länglicher Tropfen-Schlitz im vorderen oberen Drittel der Schnauze */
  s += `<ellipse cx="176.5" cy="-125.3" rx=".62" ry=".22" transform="rotate(-12 176.5 -125.3)" fill="${T.rg("nloch", [[0, "#080604"], [0.7, "#1c150d"], [1, "#3a2e1e", 0.4]])}"/>` +
    strich(T, [[[175.8, -125.6], [176.6, -125.75], [177.3, -125.5]]], HELL, 0.08, 0.45);
  /* Auge: Mandelform ~9–10 % der Kopflänge, unter Brauenwulst, Lidfalten */
  s += auge2(T, 170.1, -125.6, 0.55, { iris: "#a8742c", iris2: "#3e240c", winkel: -10 });
  const kk = 10, box = [-0.6, -128.5, 178.6, 0];
  const fuss = (p) => { const u = p.filter((q) => q[1] > -0.6); return Math.round(u.reduce((a, q) => a + q[0], 0) / u.length * kk); };
  return { svg: DM(s, kk), box: box.map((v) => Math.round(v * kk)), fuesse: [fuss(HB), fuss(VB), fuss(hbF), fuss(vbF)], kopf: [1640, -1300, 1800, -1195] };
}

/* =====================================================================
   DIPLODOCUS
   RECHERCHE: Diplodocus carnegii/D. hallorum, Oberjura (Morrison-Formation),
   ~154–152 Mio. Jahre. D. carnegii 24–26 m (eines der längsten vollständigen
   Skelette), 12–15 t. Vorderbeine etwas KÜRZER als die Hinterbeine → Rücken
   fast waagerecht, Hüfte höchster Punkt; Hals ~6–7 m, eher WAAGERECHT
   getragen (Bänder trugen ihn), leichtes S; der Kopf sitzt mit 30–40° Knick
   nach unten am Hals – das typische Diplodocus-Profil. Schwanz ~80 Wirbel,
   frei getragen, mit dünner PEITSCHE; Schwanzwurzel mit kräftigem M.
   caudofemoralis. Schädel lang und niedrig (L:H ≈ 2,8), Schnauze vorn eckig
   und stumpf, stiftförmige Zähne nur vorn; knöcherne Nasenöffnung hoch
   zwischen den Augen, das fleischige Nasenloch aber vorn an der Schnauze
   (Witmer 2001). Keratin-Rückendornen bis ~18 cm, vor allem am Schwanz
   (Czerkas 1992). Haut (Mother's Day Quarry, Gallagher et al. 2021): nicht
   überlappende Tuberkel – polygonal, oval, kuppelförmig. Hand: Säule, nur eine
   Daumenkralle (innen, nach hinten); Fuß mit Fersenpolster und drei Sichel-
   krallen (die erste am größten) nach vorn-außen. Farbe unbekannt → warmes
   Graubraun, Rücken dunkler mit weicher Fleckung, Bauch heller.
   ===================================================================== */
function diplodocus(T) {
  genau(T);
  const F = T.fein;
  let s = "";
  /* ---------- Formen (1 Einheit = 10 cm) ---------- */
  const OBEN = [[0, -35.2], [14, -33.7], [30, -33.8], [46, -35.4], [62, -37.6], [78, -39.8], [92, -41.6], [104, -42.8], [112, -43.4], [124, -43], [136, -41.4],
    [148, -39.2], [158, -37.6], [166, -37.4], [174, -38.8], [184, -41], [196, -42.6], [208, -43.6], [220, -44.2], [228, -44.1], [233, -43.3], [236.6, -42.3]];
  const UNTEN = [[0, -34.7], [14, -32.9], [30, -32.5], [46, -33], [62, -33.9], [78, -34.3], [90, -33.6], [100, -31.8], [106, -29.4], [112, -26], [120, -24.4],
    [132, -22.6], [146, -22.2], [156, -23.4], [164, -26.4], [170, -29.6], [176, -32.6], [186, -35.2], [198, -37.2], [210, -38.6], [222, -39.6], [230, -40], [235.4, -40.1]];
  /* Kopf: lang und niedrig, 35° nach unten geknickt; lokale Koordinaten (u längs, v nach oben) → Welt */
  const kw = 35 * Math.PI / 180, d = [Math.cos(kw), Math.sin(kw)], nv = [Math.sin(kw), -Math.cos(kw)], C = [236.1, -41.2];
  const W2 = (u, v) => [C[0] + u * d[0] + v * nv[0], C[1] + u * d[1] + v * nv[1]];
  const KOPF = [[0.2, 1.2], [1.2, 1.26], [2.2, 1.32], [3.4, 1.12], [4.6, 0.94], [5.8, 0.8], [6.5, 0.72], [6.72, 0.3], [6.7, -0.3], [6.5, -0.66], [5, -0.8],
    [3.4, -0.96], [2, -1.1], [0.8, -1.2]].map(([u, v]) => W2(u, v));
  const RUMPF = [[-0.3, -34.95], ...OBEN, ...KOPF, ...UNTEN.slice().reverse()];
  /* Hinterbein: Oberschenkel 120 %, Knie bei 45 % mit Vorwölbung, Unterschenkel 80 %, Knöchel bei 15 %, Fuß breiter mit Fersenpolster */
  const HB = [[107, -34], [106.6, -26], [108, -19], [109.6, -14.4], [110.2, -10], [110.2, -5.8], [109.6, -3.2], [108.6, -1.2], [108.8, 0, 1], [118.4, 0, 1],
    [118.8, -1], [117.6, -2.2], [116.4, -3.6], [116, -5.8], [116.4, -9.6], [117.4, -13], [118, -16.4], [118, -22], [117.4, -30], [114, -36]];
  /* Vorderbein: schlanker, gerade Säule, Ellbogen-Höcker hinten bei 40 %, Handgelenk bei 15 %, Sohle ausgestellt */
  const VB = [[157.6, -30], [157.4, -23], [156.8, -14.6], [157.4, -12.2], [158, -8], [158.2, -5.4], [157.8, -2.8], [157.4, -0.6], [157.6, 0, 1], [164.2, 0, 1],
    [164.4, -0.6], [163.8, -2.8], [163.4, -5.4], [163.6, -8], [163.8, -12], [164.2, -18], [165, -24], [164.6, -30], [161, -33]];
  const schieb = (p, dx) => p.map((q) => { const z = [q[0] + dx, q[1]]; if (q[2]) z.push(1); return z; });
  const hbF = schieb(HB, 5.4), vbF = schieb(VB, -5);
  const HALS_O = OBEN.slice(14), HALS_U = UNTEN.slice(16);

  /* ---------- ferne Beine: −15 % Helligkeit, weniger Kontrast ---------- */
  const fernF = ulg(T, "fern", [[0, "#4a3d2e"], [0.6, "#433829"], [1, "#2e271c"]], 0, -28, 0, 0);
  s += masse(T, [kappen(hbF, -27), kappen(vbF, -26)], fernF, zylinder(T, hbF, -22, { op: 0.75 }) + zylinder(T, vbF, -20, { op: 0.75 }) +
    blob(T, [[110, -24], [168, -24], [168, -19], [110, -19]], DUNKEL, 0.42, 1.6) +
    gelenkFalten(T, hbF[5][0], hbF[14][0], -6.6, 3, 1.2, 0.32) + gelenkFalten(T, vbF[4][0], vbF[14][0], -6.2, 3, 1.1, 0.28));
  s += krallen2(T, [[127.4, 0, 2.6, 1.3], [125.6, 0, 2.2, 1.1], [124, 0, 1.8, 0.9]]) + krallen2(T, [[152.6, 0, 1.4, 1, -1]]);

  /* ---------- Körper + Schwanz + Hals + Kopf + nahe Beine als EINE Masse ---------- */
  const grund = ulg(T, "haut", [[0, "#5a4a36"], [0.3, "#76624a"], [0.42, "#847055"], [0.5, "#64543f"], [1, "#4a3e30"]], 0, -44, 0, 0);
  const kernZone = zoneBand(OBEN, UNTEN, 0, 236, 0.6, 1.1);
  let k = "";
  /* Gegenschattierung + weiche, unregelmäßige Fleckung (keine Dreiecke, keine Bänder) */
  k += blob(T, [[100, -30], [130, -24], [156, -24.4], [176, -33.4], [210, -39.2], [234, -40.4], [210, -40.6], [176, -35.4], [156, -27.4], [130, -27], [104, -33]], "#d2bf98", 0.26, 1) +
    (F ? [[24, -34.6, 3, 0.7, -2], [44, -35.6, 3.6, 0.9, -4], [64, -37.6, 4.2, 1.2, -6], [84, -40, 4.8, 1.5, -5], [100, -41.4, 5, 1.6, -3], [118, -41.4, 5, 1.6, 2], [136, -39.2, 4.6, 1.5, 6],
      [150, -37, 4, 1.3, 4], [180, -39.2, 3.6, 0.9, -10], [198, -41.2, 3.6, 0.8, -6], [216, -42.6, 3.2, 0.7, -3], [110, -36, 3.4, 1.3, 0], [128, -35.4, 3.4, 1.3, 4]]
      .map(([x, y, a, b, w]) => oval(T, x, y, a, b, w, "#2e2214", 0.28, 0.9)).join("") : "");
  /* EIN Licht oben links je Zylinder (Schwanz, Rumpf, Hals): Glanz oben, Grenze bei 60–65 %, Kernschatten am Bauch, Reflexsaum */
  k += rumpfLicht(T, OBEN.slice(0, 16), UNTEN.slice(0, 17), 0, 174, { tiefe: 16, glanz: 0.45, kern: 0.62 }) +
    rumpfLicht(T, HALS_O, HALS_U, 170, 236, { tiefe: 6, glanz: 0.4, kern: 0.5 });
  /* Muskeln: Schwanzwurzel (Caudofemoralis), Oberschenkel, Schulter; Okklusion an den Beinansätzen; Hängeschatten auf die Beine */
  k += oval(T, 100, -36, 8, 3, -10, HELL, 0.2, 1.4) + oval(T, 112.6, -31, 5, 5, 0, HELL, 0.16, 1.6) + oval(T, 161, -31, 4.4, 3.6, 0, HELL, 0.16, 1.2) +
    strich(T, [[[105.6, -25.6], [112, -24.2], [119.6, -25.8]], [[156, -24.8], [161, -24.2], [166, -25.8]]], DUNKEL, 2.4, 0.32, 1.2) +
    strich(T, [[[119.6, -30], [120, -22], [119, -17]]], DUNKEL, 1.6, 0.26, 0.7) +
    zylinder(T, HB, -24) + zylinder(T, VB, -22.6) +
    /* Hals: Längsrinne oben (gespaltene Dornfortsätze), Kehlkante, Falten am Halsansatz */
    strich(T, [[[176, -38.2], [190, -41.2], [206, -42.8], [222, -43.4], [230, -43]]], DUNKEL, 0.4, 0.22, 0.12) +
    strich(T, [[[176, -38.6], [190, -41.6], [206, -43.2], [222, -43.8]]], HELL, 0.3, 0.25, 0.1) +
    strich(T, [[[180, -34.4], [196, -37], [212, -38.8], [228, -39.8]]], "#e2d0a8", 0.35, 0.28, 0.12) +
    falten2(T, [[[166.4, -35], [167.2, -31.4], [167, -27.8]], [[169.4, -35.6], [170.2, -32.4], [170.2, -29.8]], [[172.6, -36.4], [173.2, -33.8], [173.2, -32]],
      [[176, -37.4], [176.4, -35.2]], [[103.4, -34.6], [104.6, -31]], [[99.6, -36.4], [100.4, -33.4]]], 0.4) +
    /* Gelenkfalten nur an Knöchel, Knie, Handgelenk, Ellbogen */
    gelenkFalten(T, 110.2, 116.4, -6.8, 3, 1.2, 0.34) + gelenkFalten(T, 109.8, 117.8, -15.6, 2, 1.3, 0.36) + gelenkFalten(T, 158.2, 163.6, -6.4, 3, 1.1, 0.3) +
    gelenkFalten(T, 157.4, 164, -13.6, 2, 1.2, 0.3) +
    /* Haut: Tuberkel-Mosaik gestaffelt (Flanke 100 %, Rücken 80 %, Hals 60 %, Bauch/Gelenke 45 %, Kopf 30 %), läuft auf der Peitsche aus */
    haut(T, tub(T, "tR", 0.42), zoneBand(OBEN, UNTEN, 40, 172, -0.1, 0.22), 0.7, { schatten: kernZone }) +
    haut(T, tub(T, "tM", 0.52), zoneBand(OBEN, UNTEN, 40, 172, 0.22, 0.62), 0.75, { schatten: kernZone }) +
    haut(T, tub(T, "tB", 0.26), zoneBand(OBEN, UNTEN, 40, 172, 0.62, 1.05), 0.6, { schatten: kernZone, schattenOp: 0.55 }) +
    haut(T, tub(T, "tP", 0.3), zoneBand(OBEN, UNTEN, 0, 44, -0.1, 1.1), 0.35) +
    haut(T, tub(T, "tN", 0.32), zoneBand(HALS_O, HALS_U, 170, 236, -0.1, 1.1), 0.6) +
    haut(T, tub(T, "tL", 0.24), [[106, -21], [119, -21], [119, 0], [106, 0]], 0.6, { sd: 1.2 }) + haut(T, tub(T, "tL"), [[156, -20], [166, -20], [166, 0], [156, 0]], 0.6, { sd: 1.2 }) +
    haut(T, tub(T, "tG", 0.19), KOPF, 0.45) +
    rosetten(T, [[104, -38.6, 0.8], [112, -39.2, 0.85], [120, -38.6, 0.85], [128, -37.6, 0.8], [136, -36.2, 0.75], [116, -34.4, 0.75], [130, -33.6, 0.7], [92, -37.4, 0.7]], "#9a8466");
  /* Kopf: Stirnerhebung über den Augen (Lichtkante), Unterkiefer, Kehle; gleiche Farbe wie der Hals */
  k += strich(T, [[W2(0.8, 1.3), W2(2.2, 1.36), W2(3.4, 1.16)]], HELL, 0.3, 0.35, 0.1) + blob(T, [W2(0.4, -0.5), W2(5.6, -0.6), W2(6.2, -0.75), W2(3, -1.1), W2(0.4, -1.2)], DUNKEL, 0.35, 0.2) +
    blob(T, [[233, -43.4], [236.6, -42.4], [236.4, -40.4], [234, -39.8]], DUNKEL, 0.3, 0.3) +
    strich(T, [[W2(6.55, -0.36), W2(4.4, -0.5), W2(2.3, -0.64)]], DUNKEL, 0.1, 0.7) + strich(T, [[W2(6.3, -0.52), W2(4.4, -0.64), W2(2.6, -0.76)]], HELL, 0.1, 0.25, 0.03) +
    (F ? `<path d="${[6.3, 5.95, 5.6, 5.25].map((u) => `M${zug(W2(u, -0.38))}L${zug(W2(u + 0.03, -0.52))}`).join("")}" stroke="#e8dcc0" stroke-width=".08" stroke-linecap="round" stroke-opacity=".5"/>` : "");
  s += masse(T, [RUMPF, HB, VB], grund, k) + volLage(T, "rumpf", [RUMPF, HB, VB], 2.4, 6);
  /* Füße: hinten Fersenpolster + drei Sichelkrallen nach vorn-außen (erste am größten); vorn Säule mit Sohlenkante */
  s += krallen2(T, [[121.6, 0, 3, 1.5], [119.8, 0, 2.4, 1.2], [118.2, 0, 2, 1]]) + oval(T, 109.6, -0.6, 1.4, 0.55, 0, DUNKEL, 0.4, 0.2) +
    strich(T, [[[157.6, -0.4], [161, -0.6], [164.2, -0.4]]], DUNKEL, 0.5, 0.45, 0.15);
  s += kontakt(T, 113.6, 9.6) + kontakt(T, 161, 6.6) + kontakt(T, 119, 9) + kontakt(T, 156, 6.4);
  /* Rückendornen (Keratin): unregelmäßig, am Hals winzig, über dem Rücken mittel, am größten über dem vorderen/mittleren
     Schwanz (~18 cm), auf der Peitsche klein; seitlich flach, Spitze leicht nach hinten, Lichtseite links, Basis in Hautfalte */
  let dn = "", dnL = "";
  for (let x = 22; x < 176;) {
    const g = (x < 50 ? 0.2 + (x - 22) / 28 * 0.5 : x < 110 ? 0.7 + Math.max(0, 1 - Math.abs(x - 78) / 32) * 0.75 : 0.62 - (x - 110) / 66 * 0.42) * (0.65 + T.rnd() * 0.6);
    const y = yBei(OBEN, x) + 0.15, b = g * 1.1;
    dn += `M${n1(x - b * 0.6)} ${n1(y)}Q${n1(x - b * 0.2)} ${n1(y - g * 0.7)} ${n1(x - b * 0.45)} ${n1(y - g)}Q${n1(x + b * 0.25)} ${n1(y - g * 0.5)} ${n1(x + b * 0.55)} ${n1(y)}Z`;
    dnL += `M${n1(x - b * 0.5)} ${n1(y - 0.05)}Q${n1(x - b * 0.25)} ${n1(y - g * 0.6)} ${n1(x - b * 0.45)} ${n1(y - g * 0.95)}`;
    x += (x < 50 ? 4.6 : 3.8) * (0.7 + T.rnd() * 0.6);
  }
  s += `<path d="${dn}" fill="${T.lg("dorn", [[0, "#5a4834"], [0.6, "#7e6a50"], [1, "#b29c78"]], 0, 1, 0, 0)}"/>` +
    (F ? `<path d="${dnL}" fill="none" stroke="#e8d8b4" stroke-opacity=".45" stroke-width=".12"/>` : "");
  /* Nasenloch: kleiner ovaler Schlitz 10–15 % hinter der Schnauzenspitze im oberen Drittel */
  const NL = W2(5.8, 0.36);
  s += `<ellipse cx="${n1(NL[0])}" cy="${n1(NL[1])}" rx=".26" ry=".13" transform="rotate(35 ${n1(NL[0])} ${n1(NL[1])})" fill="#120e09"/>`;
  /* Auge: im hinteren Drittel, 35 % unter der Oberkante, Brauenschatten, Lidrand */
  const AU = W2(1.95, 0.4);
  s += auge2(T, AU[0], AU[1], 0.34, { iris: "#a8742c", iris2: "#3e240c", winkel: 35 });
  const hx = Math.max(...KOPF.map((q) => q[0])), kk = 10, box = [-0.3, -44.2, hx, 0];
  const fuss = (p) => { const u = p.filter((q) => q[1] > -0.6); return Math.round(u.reduce((a, q) => a + q[0], 0) / u.length * kk); };
  return { svg: DM(s, kk), box: box.map((v) => Math.round(v * kk)), fuesse: [fuss(HB), fuss(VB), fuss(hbF), fuss(vbF)], kopf: [2280, -455, 2440, -360] };
}

module.exports = [
  { id: "triceratops", de: "der Triceratops", syl: "Tri-ZE-ra-tops", it: "il triceratopo", itSyl: "tri-che-RA-to-po", en: "triceratops",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 8.59, hoehe: 2.84, zeichne: triceratops },
  { id: "brachiosaurus", de: "der Brachiosaurus", syl: "Bra-chi-o-SAU-rus", it: "il brachiosauro", itSyl: "bra-chio-SAU-ro", en: "brachiosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 17.92, hoehe: 12.85, zeichne: brachiosaurus },
  { id: "diplodocus", de: "der Diplodocus", syl: "Di-PLO-do-kus", it: "il diplodoco", itSyl: "di-PLO-do-co", en: "diplodocus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 25.26, hoehe: 4.54, zeichne: diplodocus },
  { id: "stegosaurus", de: "der Stegosaurus", syl: "Ste-go-SAU-rus", it: "lo stegosauro", itSyl: "ste-go-SAU-ro", en: "stegosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 7.75, hoehe: 3.18, zeichne: stegosaurus },
  { id: "ankylosaurus", de: "der Ankylosaurus", syl: "An-ky-lo-SAU-rus", it: "l'anchilosauro", itSyl: "an-chi-lo-SAU-ro", en: "ankylosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 6.58, hoehe: 1.7, zeichne: ankylosaurus },
  { id: "parasaurolophus", de: "der Parasaurolophus", syl: "Pa-ra-sau-RO-lo-phus", it: "il parasaurolofo", itSyl: "pa-ra-sau-RO-lo-fo", en: "parasaurolophus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 8.29, hoehe: 3.83, zeichne: parasaurolophus },
];
