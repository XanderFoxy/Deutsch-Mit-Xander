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
    T.def(`<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${sd}"/></filter>`);
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
/* Volumen (kern.js T.volumen, ANLEITUNG 13): Gruppe mit Rundungs-Licht aus der eigenen Silhouette (links oben Licht,
   Kernschatten zur Unterkante). weich in Zeicheneinheiten (≈ 20–30 % der Teildicke). In Szenen ohne Filter. */
const vol = (T, name, inhalt, weichE, tiefe = 5, umgebung = 0.32) => {
  const f = T.volumen ? T.volumen(name, { weich: weichE, tiefe, umgebung }) : "none";
  return f === "none" ? inhalt : `<g filter="${f}">${inhalt}</g>`;
};
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
  const tief = o.tiefe || 10, sd = Math.max(0.5, tief * 0.07);
  return blob(T, band(-0.1, 0.2), HELL, o.glanz != null ? o.glanz : 0.3, sd) +
    blob(T, band(0.62, 1.1), DUNKEL, o.kern != null ? o.kern : 0.48, sd * 1.3) +
    (T.fein ? blob(T, band(0.9, 1.08), "#c9a874", o.reflex != null ? o.reflex : 0.2, sd * 0.5) : "");
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
  return `<path d="${gl(kappen(pts, ycut))}" fill="${g}" opacity="${o.op || 1}" filter="${weich(T, sd)}"/>`;
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
  const id = T.id("h" + T._h), [x0, y0, x1, y1] = T.box(zone), sd = o.sd || 0.6;
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
    `<path d="${kz}" fill="${T.rg("rosette", [[0, "#f6e6c0", 0.3], [0.5, farbe, 0.18], [1, farbe, 0.05]], 0.32, 0.28, 0.8)}"/>` +
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
  s += `<path d="M${n1(x - rr * 2)} ${n1(y - rr * 0.6)}Q${n1(x - rr * 0.2)} ${n1(y - rr * 2.4)} ${n1(x + rr * 2.1)} ${n1(y - rr * 0.9)}"${rot} fill="none" stroke="${HELL}" stroke-opacity=".45" stroke-width="${n1(rr * 0.5)}" stroke-linecap="round" filter="${weich(T, rr * 0.18)}"/>`;
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
    haut(T, tub(T, "tL", 0.16), [[33, -14], [42, -14], [42, 0], [33, 0]], 0.35) + haut(T, tub(T, "tL"), [[48, -14], [58, -14], [58, 0], [48, 0]], 0.35));
  s += hufe(T, [[38.3, 2, 1.1], [40.3, 2.1, 1.2], [42.3, 1.9, 1.1]], "#3a3226") + hufe(T, [[51.6, 1.7, 1], [53.3, 1.8, 1.1], [55, 1.7, 1]], "#3a3226");

  /* ---------- Körper: Rumpf + nahe Beine + Hals als EINE Masse ---------- */
  const grund = ulg(T, "haut", [[0, "#4e3c25"], [0.45, "#6b5536"], [0.8, "#7c6643"], [1, "#6e5a3c"]], 0, -28.5, 0, -8);
  const kernZone = zoneBand(OBEN, UNTEN, 0, 72, 0.62, 1.1);
  let k = "";
  /* Gegenschattierung + unregelmäßige dunkle Rückenflecken (keine Bänder) */
  k += F ? [[18, -22.6, 3.4, 1.4, -24], [27, -26.2, 3, 1.3, -8], [35.4, -26.6, 2.6, 1.2, 4], [43, -24.8, 3.2, 1.3, 12], [50.6, -22.6, 2.4, 1.1, 14], [13, -18.6, 2.2, 0.9, -30]]
    .map(([x, y, a, b, w]) => oval(T, x, y, a, b, w, "#2a2012", 0.32, 0.5)).join("") : "";
  /* EIN Licht oben links: Glanzband, Kernschatten, Bodenreflex */
  k += rumpfLicht(T, OBEN, UNTEN, 0, 72, { tiefe: 16, glanz: 0.44, kern: 0.62 });
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
  k += haut(T, tub(T, "tR", 0.3, { sy: 0.6 }), zoneBand(OBEN, UNTEN, 2, 70, -0.1, 0.16), 0.8, { schatten: kernZone }) +
    haut(T, tub(T, "tM", 0.24), zoneBand(OBEN, UNTEN, 2, 70, 0.12, 0.62), 0.8, { schatten: kernZone }) +
    haut(T, tub(T, "tB", 0.17, { sy: 0.65 }), zoneBand(OBEN, UNTEN, 2, 70, 0.55, 1.05), 0.7, { schatten: kernZone, schattenOp: 0.6 }) +
    haut(T, tub(T, "tL"), [[24.5, -13], [41, -12], [41, 0], [30, 0]], 0.75) + haut(T, tub(T, "tL"), [[50.5, -13], [60, -13], [60.6, 0], [53, 0]], 0.75);
  /* Merkmals-Schuppen in Rosetten: 2–3 lockere Reihen über Schulter, Rücken, obere Flanke */
  k += rosetten(T, [[24, -22.6, 0.55], [30, -24.2, 0.62], [36.4, -24.4, 0.66], [42.6, -23.4, 0.62], [48.6, -21.6, 0.58], [54, -19.8, 0.52],
    [27.4, -19.6, 0.5], [34, -20.4, 0.56], [40.4, -19.8, 0.56], [46.4, -18.6, 0.52], [52, -16.8, 0.46], [38, -16, 0.44], [44, -15.4, 0.42],
    [21, -20.6, 0.44], [32.6, -22.2, 0.5], [39.4, -22.4, 0.52], [45.8, -21, 0.5], [51.4, -19.4, 0.44], [30.6, -17.6, 0.4], [36, -18.4, 0.42], [42.4, -17.6, 0.42], [48.8, -16.6, 0.4]]
    .map(([x, y, R]) => [x + (T.rnd() - 0.5) * 1.2, y + (T.rnd() - 0.5) * 0.8, R * (1 + T.rnd() * 0.5)]), "#9a8460");
  s += vol(T, "rumpf", masse(T, [RUMPF, HB, VB], grund, k), 2.4, 5);
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
    haut(T, tub(T, "tS", 0.17, { sy: 0.8 }), schildZone, 0.45);
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
    haut(T, tub(T, "tG", 0.13), [[70.4, -19], [76, -16], [84, -12.4], [84, -8.4], [74, -8.6], [70.2, -12]], 0.6);
  s += vol(T, "kopf", masse(T, [K], kopfF, kk), 1.4, 4);
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
  const OBEN = [[2.4, -13.8], [6, -15.6], [12, -18], [18, -20.6], [24, -22.8], [30, -24.4], [34, -25], [38, -24.6], [43, -23.3], [47, -22.2], [51, -20.9],
    [54.6, -19.9], [57, -18.2], [60, -15.8], [63, -13.2], [65.8, -11], [68.2, -9.6], [70.4, -9]];
  const UNTEN = [[2.4, -12.9], [6, -13.5], [12, -14.6], [18, -15.6], [22, -15.8], [25, -15], [28, -14], [32, -13], [36, -12], [40, -11.1], [44, -10.3],
    [48, -9.7], [51, -9.5], [54, -9.9], [57, -10.5], [60, -10.1], [63, -9.1], [66, -8.1], [68.6, -7.5], [70.4, -7.1]];
  /* Kopf: lang, niedrig, schmal (L:H ≈ 2,9), flache Oberlinie mit kleiner Senke vor dem Auge, tiefste Stelle am Kiefergelenk */
  const KOPF = [[70.4, -9], [71.6, -8.85], [72.8, -8.82], [73.5, -8.62], [74.6, -8.2], [75.9, -7.4, 1], [75.5, -6.98], [74.4, -6.82], [73, -6.8], [71.6, -6.86], [70.4, -7.05]];
  const RUMPF = [[1.6, -13.4], ...OBEN, ...KOPF.slice(1), ...UNTEN.slice().reverse()];
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
    haut(T, tub(T, "tL", 0.16), [[30, -12], [42, -12], [42, 0], [30, 0]], 0.3) + haut(T, tub(T, "tL"), [[49, -11], [57, -11], [57, 0], [49, 0]], 0.3));
  s += hufe(T, [[35.6, 1.9, 0.9], [37.6, 2.1, 1], [39.6, 1.9, 0.9]], "#3a3226") + hufe(T, [[52.6, 1.3, 0.6], [53.9, 1.4, 0.65], [55.2, 1.3, 0.6]], "#3a3226");

  /* ---------- Körper: Rumpf + Schwanz + Hals + Kopf + nahe Beine als EINE Masse ---------- */
  const grund = ulg(T, "haut", [[0, "#4a4228"], [0.4, "#655b38"], [0.75, "#7f7048"], [1, "#8e7c52"]], 0, -25, 0, -7);
  const kernZone = zoneBand(OBEN, UNTEN, 2, 79, 0.62, 1.1);
  let k = "";
  /* weiche Querflecken auf Flanke und Schwanz (10–15 % dunkler) */
  k += F ? [[9, -16.6, 1.6, 2.4, 8], [15.4, -18.6, 1.8, 3, 6], [22, -20.2, 2, 3.6, 4], [29, -20.6, 2.2, 4.2, 0], [36.4, -20.6, 2.2, 4.4, -4], [43.6, -19.2, 2, 4.2, -6],
    [50.4, -17, 1.8, 3.6, -8], [64, -12.4, 1.2, 2, -14], [70, -10.6, 1, 1.6, -18]].map(([x, y, a, b, w]) => oval(T, x, y, a, b, w, "#2a2210", 0.26, 0.6)).join("") : "";
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
      [[56.6, -15.6], [57.4, -13.6]], [[36.4, -9.4], [37.2, -8.4], [36.8, -7.2]], [[29.6, -13.4], [31, -12]], [[31.2, -4.4], [33.4, -3.9], [35.6, -4.2]],
      [[54.4, -3.6], [56.2, -3.2], [58, -3.6]], [[53.8, -7.6], [54.6, -6.6]], [[66.4, -10.2], [67, -8.8], [67, -8]]], 0.22) +
    /* Haut: Tuberkel in Zonen (Rücken/Becken grob, Flanke mittel, Hals/Gelenke/Gesicht fein), im Kernschatten aus */
    haut(T, tub(T, "tR", 0.34, { sy: 0.6 }), zoneBand(OBEN, UNTEN, 4, 66, -0.1, 0.18), 0.85, { schatten: kernZone }) +
    haut(T, tub(T, "tM", 0.24), zoneBand(OBEN, UNTEN, 4, 70, 0.14, 0.62), 0.8, { schatten: kernZone }) +
    haut(T, tub(T, "tB", 0.16, { sy: 0.65 }), zoneBand(OBEN, UNTEN, 4, 79, 0.55, 1.05), 0.7, { schatten: kernZone, schattenOp: 0.6 }) +
    haut(T, tub(T, "tK", 0.12), [[60, -15], [70.4, -9.2], [75.8, -7.6], [74.4, -6.6], [64, -8.6], [58, -10]], 0.6) +
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
    PL.filter((p) => p[3]).map((p) => oval(T, p[0] + 1, yBei(RUECKEN, p[0]) + 0.9, p[2] * 0.42, 0.5, -8, DUNKEL, 0.45, 0.3)).join("");
  s += masse(T, [RUMPF, HB, VB], grund, k);
  s += hufe(T, [[32.8, 2, 0.95, 0.2], [34.9, 2.2, 1.05, 0.25], [37, 2, 0.95, 0.25]]) + hufe(T, [[55.1, 1.3, 0.6], [56.4, 1.4, 0.68], [57.7, 1.3, 0.6]]);
  s += kontakt(T, 34.6, 7) + kontakt(T, 56.4, 4.6);
  /* Hornschnabel: schmal, scharfe Schneide, Ober- über Unterschnabel, dunkles Horn; heller Saum am Hautübergang */
  const SCHN = [[74.6, -8.22], [75.9, -7.4, 1], [75.48, -6.96], [74.9, -7.15], [74.4, -7.7]], PRE = [[75, -7.02], [75.48, -6.9, 1], [74.8, -6.76], [74.2, -6.84]];
  s += masse(T, [SCHN, PRE], ulg(T, "schnabel", [[0, "#5e5646"], [1, "#352e24"]], 0, -8.4, 0, -6.7), strich(T, [[[75, -8], [75.7, -7.4]]], "#c8b994", 0.07, 0.6)) +
    strich(T, [[[74.5, -8.28], [74.35, -7.7], [74.7, -7.15]]], "#d8c9a2", 0.08, 0.45);
  /* Nasenloch: groß, oval, oben vorn direkt hinter dem Schnabel; Maullinie gerade bis hinter das Auge mit Wangenfalte */
  s += `<ellipse cx="74.2" cy="-7.95" rx=".36" ry=".2" transform="rotate(-20 74.2 -7.95)" fill="${T.rg("nloch", [[0, "#080604"], [0.7, "#1c150d"], [1, "#3a2e1e", 0.4]])}"/>` +
    strich(T, [[[73.8, -8.15], [74.3, -8.22], [74.6, -8.1]]], HELL, 0.06, 0.45) +
    strich(T, [[[74.5, -7.2], [73.2, -7.25], [71.8, -7.35], [71, -7.55], [70.7, -7.9]]], DUNKEL, 0.1, 0.65) + strich(T, [[[74, -7.45], [71.8, -7.6], [71, -7.9]]], HELL, 0.12, 0.25, 0.04);
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
  const K1 = knopf(4.6, -7.4, 2, 1.65), K2 = knopf(2.2, -7.1, 1.4, 1.15), K3 = knopf(0.75, -7.7, 0.6, 0.5), K4 = knopf(0.9, -6.5, 0.55, 0.45);
  const knochen = ulg(T, "keule", [[0, "#8a785a"], [0.45, "#6a5840"], [1, "#30261a"]], 0, -9.2, 0, -5.6);
  s += masse(T, [K2, K3, K4], knochen, `<rect x="-1" y="-10" width="6" height="5" fill="${DUNKEL}" opacity=".3"/>` + oval(T, 2, -6.2, 2.4, 0.7, 0, DUNKEL, 0.5, 0.3) +
    haut(T, tub(T, "tP", 0.09), [[-1, -10], [5, -10], [5, -5], [-1, -5]], 0.75));

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
    haut(T, tub(T, "tM", 0.18), zoneBand(OBEN, UNTEN, 8, 58, 0.45, 0.7), 0.5, { schatten: kernZone, schattenOp: 0.5 }) +
    haut(T, tub(T, "tB", 0.12, { sy: 0.7 }), zoneBand(OBEN, UNTEN, 8, 58, 0.65, 1.05), 0.45, { schatten: kernZone, schattenOp: 0.4 }) +
    haut(T, tub(T, "tL", 0.11), [[23, -9], [34, -8], [34, 0], [26, 0]], 0.5) + haut(T, tub(T, "tL"), [[46, -8], [54, -8], [54, 0], [47, 0]], 0.5);
  /* Kopf: Schlagschatten auf den Hals, Wange, Unterkiefer, feine Wangenschuppen */
  k += blob(T, [[57.4, -12], [59.2, -8.6], [58.4, -7.8], [56.4, -8.8]], DUNKEL, 0.5, 0.35) + oval(T, 62.4, -8.5, 2.6, 0.4, 0, DUNKEL, 0.42, 0.2) +
    haut(T, tub(T, "tG", 0.09), [[58.4, -10.6], [65.2, -9.6], [65.2, -8.2], [58.6, -8.4]], 0.5);
  /* Rückenpanzer: 8 Querreihen gekielter Platten vom Nacken bis zum Becken; Reihen folgen der Wölbung, oben
     perspektivisch gestaucht, je Reihe zum Schwanz hin ~12 % kleiner; Knöchelchen dazwischen; Schatten nach rechts unten */
  let pl = "", plS = "", kiL = "", kiD = "", kn = "";
  const reihen = [52, 48.2, 44.4, 40.6, 36.8, 33, 29.2, 25.6, 22.2, 19, 16, 13.2, 10.6];
  reihen.forEach((x0, ri) => {
    const g = 1.25 * Math.pow(0.9, Math.max(0, 6 - ri) * 0) * Math.pow(0.88, Math.max(0, ri - 5)), nPl = ri < 9 ? 4 : 2;
    for (let j = 0; j < nPl; j++) {
      const t = (j + 0.5) / nPl * 0.52, x = x0 - j * 0.35 + (T.rnd() - 0.5) * 0.3, ya = yBei(OBEN, x), yb = yBei(UNTEN, x), y = ya + (yb - ya) * t + 0.15;
      const rx = g * (0.9 + 0.12 * j), ry = rx * (j === 0 ? 0.36 : 0.5);
      pl += `M${n1(x - rx)} ${n1(y)}a${n1(rx)} ${n1(ry)} 0 1 0 ${n1(2 * rx)} 0a${n1(rx)} ${n1(ry)} 0 1 0 ${n1(-2 * rx)} 0`;
      plS += `M${n1(x - rx + 0.3)} ${n1(y + 0.25)}a${n1(rx)} ${n1(ry)} 0 1 0 ${n1(2 * rx)} 0a${n1(rx)} ${n1(ry)} 0 1 0 ${n1(-2 * rx)} 0`;
      kiL += `M${n1(x - rx * 0.7)} ${n1(y - ry * 0.18)}q${n1(rx * 0.7)} ${n1(-ry * 0.2)} ${n1(rx * 1.4)} 0`;
      kiD += `M${n1(x - rx * 0.65)} ${n1(y + ry * 0.02)}q${n1(rx * 0.65)} ${n1(-ry * 0.12)} ${n1(rx * 1.3)} 0`;
      if (F && ri < 10) for (let q = 0; q < 2; q++) { const xx = x + 1.7 * g + (T.rnd() - 0.5) * 0.4, yy = y + (T.rnd() - 0.5) * ry * 2, rr = g * (0.17 + T.rnd() * 0.08); kn += `M${n1(xx - rr)} ${n1(yy)}a${n1(rr)} ${n1(rr * 0.8)} 0 1 0 ${n1(2 * rr)} 0a${n1(rr)} ${n1(rr * 0.8)} 0 1 0 ${n1(-2 * rr)} 0`; }
    }
  });
  const osF = "#806e50";
  /* je Platte: Grundton, Licht oben links (versetzte kleinere Ellipse), dunkler Rand unten rechts, Längskiel als Grat */
  const versetzt = (d, fx, fy, fs) => d.replace(/M([-\d.]+) ([-\d.]+)a([\d.]+) ([\d.]+) 0 1 0 ([\d.]+) 0a[^M]*/g, (m, x, y, rx, ry) => {
    const RX = +rx * fs, RY = +ry * fs, cx = +x + +rx + fx * +rx, cy = +y + fy * +ry;
    return `M${n1(cx - RX)} ${n1(cy)}a${n1(RX)} ${n1(RY)} 0 1 0 ${n1(2 * RX)} 0a${n1(RX)} ${n1(RY)} 0 1 0 ${n1(-2 * RX)} 0`;
  });
  k += `<path d="${plS}" fill="#000" opacity=".38" filter="${weich(T, 0.3)}"/>` + (F ? `<path d="${kn}" fill="#5e4e38"/>` : "") +
    `<path d="${pl}" fill="${osF}"/>` + `<path d="${pl}" fill="none" stroke="#241a10" stroke-opacity=".55" stroke-width=".14"/>` +
    `<path d="${versetzt(pl, -0.18, -0.25, 0.68)}" fill="#c4b28c" opacity=".38" filter="${weich(T, 0.12)}"/>` +
    `<path d="${kiD}" fill="none" stroke="#2a2016" stroke-opacity=".4" stroke-width=".12"/>` +
    `<path d="${kiL}" fill="none" stroke="#e0d0aa" stroke-opacity=".5" stroke-width=".1"/>`;
  /* zwei Halb-Ringe über dem Hals: große gekielte Platten, dazwischen tiefe Hautfalten mit Schattenspalt */
  let ring = "", ringK = "";
  for (const [x, y, a, b] of [[53.6, -12.3, 1.2, 0.6], [53.9, -10.9, 1.3, 0.72], [54.1, -9.5, 1.15, 0.6], [56.4, -11.7, 1.05, 0.55], [56.6, -10.5, 1.15, 0.65], [56.8, -9.2, 1, 0.55]]) {
    ring += `M${n1(x - a)} ${n1(y)}a${n1(a)} ${n1(b)} 0 1 0 ${n1(2 * a)} 0a${n1(a)} ${n1(b)} 0 1 0 ${n1(-2 * a)} 0`;
    ringK += `M${n1(x - a * 0.7)} ${n1(y - b * 0.18)}q${n1(a * 0.7)} ${n1(-b * 0.2)} ${n1(a * 1.4)} 0`;
  }
  k += strich(T, [[[52.2, -13.8], [52.3, -11], [52.6, -8.2]], [[55.1, -13], [55.2, -10.4], [55.4, -8.2]], [[57.9, -12.4], [58, -10.2], [58.2, -8.4]]], "#140e08", 0.45, 0.75, 0.12) +
    `<path d="${ring}" fill="${osF}"/><path d="${ring}" fill="none" stroke="#241a10" stroke-opacity=".55" stroke-width=".14"/>` +
    `<path d="${versetzt(ring, -0.18, -0.25, 0.68)}" fill="#c4b28c" opacity=".38" filter="${weich(T, 0.12)}"/>` +
    `<path d="${ringK}" fill="none" stroke="#e0d0aa" stroke-opacity=".5" stroke-width=".1"/>`;
  s += masse(T, [RUMPF, HB, VB], grund, k);
  /* Hufe: hinten 3 breite, flache Schaufelhufe (mittlerer 15 % größer), leicht gefächert; vorn kürzer, im Halbkreis */
  s += hufe(T, [[28.4, 1.8, 0.8, -0.1], [30.4, 2.1, 0.92, 0], [32.4, 1.8, 0.8, 0.15]], "#3a3026") + hufe(T, [[49.4, 1.3, 0.62], [50.8, 1.45, 0.68], [52.2, 1.35, 0.62]], "#3a3026");
  s += kontakt(T, 30.4, 6) + kontakt(T, 50.8, 5) + kontakt(T, 33.6, 5);
  /* ---------- Keule vorn (großer Knauf) + Griff-Übergang ---------- */
  s += masse(T, [K1], knochen, oval(T, 4.8, -6.2, 2.2, 0.9, 0, DUNKEL, 0.55, 0.35) + oval(T, 4, -8.3, 1.1, 0.5, -10, HELL, 0.22, 0.3) +
    haut(T, tub(T, "tP", 0.09), [[2, -10], [7, -10], [7, -5], [2, -5]], 0.75) + strich(T, [[[2.9, -8.8], [2.6, -7.4], [2.9, -6]]], DUNKEL, 0.25, 0.5, 0.08));
  /* ---------- seitliche Randstacheln: gekielte Pyramiden, Basis eingebettet; Schulter groß, Becken mittel, Schwanz klein ---------- */
  let za = "", zaS = "", zaD = "";
  const stacheln = [[50.6, 3.2], [47.2, 3], [43.8, 2.7], [40.2, 2.4], [36.8, 2.2], [33.2, 2.1], [29.8, 1.9], [26.4, 1.7], [22.6, 1.3], [18.8, 1.1], [15.2, 0.9], [11.8, 0.8], [8.6, 0.7]];
  stacheln.forEach(([x0, b], i) => {
    const x = x0 + (T.rnd() - 0.5) * 0.6, y = yBei(RAND, x) + 0.15, L = b * 0.9;
    const w = (148 + i * 1.5) * Math.PI / 180, d = [Math.cos(w), Math.sin(w)], nn = [-d[1], d[0]];
    const A = [x + nn[0] * b / 2, y + nn[1] * b / 2], B = [x - nn[0] * b / 2, y - nn[1] * b / 2], S2 = [x + d[0] * L, y + d[1] * L];
    const lo = A[1] > B[1] ? A : B, hi = A[1] > B[1] ? B : A;
    za += `M${zug(A)}L${zug(S2)} ${zug(B)}Z`;
    zaD += `M${zug([x, y])}L${zug(S2)} ${zug(lo)}Z`;
    zaS += `M${zug([hi[0] + 0.25, hi[1] + 0.35])}L${zug([S2[0] + 0.3, S2[1] + 0.45])} ${zug([lo[0] + 0.25, lo[1] + 0.35])}Z`;
  });
  s += `<path d="${zaS}" fill="#000" opacity=".4" filter="${weich(T, 0.3)}"/><path d="${za}" fill="#8c7a5a"/><path d="${zaD}" fill="#3a2e20" opacity=".72"/>` +
    `<path d="${za}" fill="none" stroke="#241a10" stroke-opacity=".5" stroke-width=".1" stroke-linejoin="round"/>`;
  /* ---------- Kopf-Details: Hornschnabel, seitliches Nasenloch unter Nasenplatte, Schädelplatten-Mosaik, vier Hörner ---------- */
  s += masse(T, [[[64.4, -10.7], [65, -10.6], [65.6, -9.9], [65.75, -8.9, 1], [65.2, -8.15], [64.4, -8.3], [64.2, -9.4]]],
    ulg(T, "schnabel", [[0, "#4e4434"], [1, "#7a6c54"]], 64.2, 0, 65.8, 0), strich(T, [[[65.7, -9.9], [65.75, -8.9], [65.3, -8.2]]], "#c8b894", 0.07, 0.5));
  let mo = "";
  if (F) {
    for (const [x, y, g] of [[59.4, -11.5, 0.72], [60.8, -11.3, 0.7], [62.2, -11, 0.68], [63.5, -10.6, 0.6], [64.4, -10.2, 0.45], [60, -10.35, 0.55],
      [61.4, -10.15, 0.55], [62.8, -9.85, 0.5], [58.9, -10.4, 0.45]]) {
      const P = Array.from({ length: 6 }, (_, i) => { const a = (i * 60 - 90 + (T.rnd() - 0.5) * 20) * Math.PI / 180; return [x + Math.cos(a) * g * 0.95, y + Math.sin(a) * g * 0.55]; });
      mo += "M" + P.map(zug).join("L") + "Z";
    }
  }
  s += (F ? `<path d="${mo}" fill="#8a7858" fill-opacity=".55" stroke="#20180f" stroke-width=".09" stroke-opacity=".7" stroke-linejoin="round"/>` +
      `<path d="${mo}" fill="none" stroke="#d8c8a2" stroke-width=".05" stroke-opacity=".35" transform="translate(-.04 -.05)"/>` : "") +
    /* Nasenplatte über dem seitlichen Nasenloch (wirft Schatten), Nasenloch innen dunkel, unten Lichtkante */
    `<ellipse cx="64.1" cy="-9.25" rx=".42" ry=".26" fill="#1c1610"/>` + strich(T, [[[63.3, -9.7], [64.1, -9.85], [64.9, -9.6]]], "#9a8866", 0.28, 0.9, 0.04) +
    oval(T, 64.1, -9.45, 0.45, 0.12, 0, DUNKEL, 0.5, 0.06) + strich(T, [[[63.75, -9], [64.4, -9.02]]], HELL, 0.05, 0.45);
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
  const F = T.fein;
  const haut = T.lg("haut", [[0, "#4b3f27"], [0.35, "#6a5a39"], [0.72, "#85744e"], [1, "#706245"]]);
  /* ferne Beine im Körperton ~28 % dunkler, nahe Beine gehen weich aus dem Rumpf hervor */
  const fern = T.lg("fern", [[0, "#4c4029", 0], [0.18, "#4c4029", 1], [0.6, "#433825"], [1, "#2e261a"]]);
  const nahB = T.lg("bein", [[0, "#5a4c32", 0], [0.28, "#5a4c32", 0.55], [0.48, "#665537", 1], [0.85, "#4e422d"], [1, "#352c1e"]]);
  const kamm = T.lg("kamm", [[0, "#a8653a"], [0.5, "#80462a"], [1, "#4e2c18"]], 0, 0, 0.3, 1);
  let s = "", h = "";

  /* Beine: Hinterbein kräftig (Knie vorn, Ferse hinten, drei Hufzehen), Vorderbein schlank mit Huf-„Fäustling" */
  /* Hinterbein als Z: Oberschenkel schräg nach vorn, Knie, Unterschenkel schräg nach hinten, Ferse hoch, Mittelfuß steil, nur Zehen am Boden */
  const HB = [[31.6, -28], [30.8, -20], [33, -14], [35.8, -10.6], [36.8, -8], [38, -5.6], [40, -2.8], [41.4, -1], [42, 0, 1], [47.8, 0, 1],
    [48, -1], [45.8, -1.8], [44, -2.8], [42.4, -6], [42.6, -9.8], [46.6, -13.6], [48, -19.6], [46.4, -28]];
  const VB = [[56.8, -21], [56, -15], [56.6, -10.6], [58, -7], [59, -3.2], [58.8, -1.1], [59.2, 0, 1], [63, 0, 1], [63.2, -1.1],
    [62.2, -2.4], [61.4, -5.6], [61, -10], [62, -14.6], [62.6, -21]];
  const hbF = kappen(boden(dreh(HB, 40, -22, -12, 4)), -21), vbF = kappen(boden(dreh(VB, 59.6, -18, 12, -2.6)), -17);
  const zehen = (x, b, n, farbe) => naegel(Array.from({ length: n }, (_, i) => [x + i * b * 1.02, 0, b, b * 0.55]), farbe);
  h += fernBein(T, hbF, fern) + fernBein(T, vbF, fern);
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
      const j = () => (T.rnd() - 0.5) * b * 0.5;
      d += T.glatt([[x - b * 0.7, yo], [x + b * 0.7, yo], [x + b * 0.5 + j() - L * 0.05, yo + L * 0.45], [x + b * 0.2 - L * 0.1, yo + L * 0.8],
        [x - b * 0.1 - L * 0.12, yo + L], [x - b * 0.45 + j() - L * 0.1, yo + L * 0.7], [x - b * 0.6 - L * 0.04, yo + L * 0.35]]);
    }
    return `<path d="${d}" fill="#24190c" opacity=".45"${F ? ` filter="${weichFilter(T)}"` : ""}/>`;
  };
  h += teil(T, R, haut, {
    innen:
      baender() +
      fl(T, [[34, -16.4], [44, -10.2], [58, -9.6], [66, -13], [71, -19], [73, -25], [70, -22], [64, -16.4], [56, -13.6], [44, -14.6]], "#d2c096", 0.32) +
      /* EIN Licht oben links: helle Rückenkante, Kernschatten im unteren Drittel, Bodenreflex am Bauch; Okklusion an Beinansätzen */
      lichtModell(T, RUECKEN.slice(0, 11), unten, 0, 64) + schatten(T, 47.4, -13.4, 2.4, 4, -10, 0.4) + schatten(T, 55.4, -13, 1.8, 3.4, 10, 0.4) +
      /* Muskeln: Schwanzwurzel (Caudofemoralis), Rippen, Schulter, Halsmuskeln */
      licht(T, 24, -24, 10, 3, -12, 0.5) + licht(T, 47, -21, 9, 5, -10, 0.45) + licht(T, 59.6, -19.6, 3.6, 2.8, -20, 0.4) +
      licht(T, 67, -22.6, 3.6, 1.6, -52, 0.4) + schatten(T, 33, -19.6, 6, 2.2, -20, 0.35) + schatten(T, 70.6, -24.4, 1.2, 2.6, -30, 0.4) +
      schuppenFeld(T, RUECKEN.slice(0, 11), unten, 2, 64, 9, (x, t) => (0.58 - 0.28 * t) * (x > 22 ? 1 : 0.75), { opD: 0.3, opH: 0.16 }) +
      schuppenFeld(T, [[60, -24.4], [64, -25.4], [68, -27.2], [71, -28.6]], [[60, -11], [64, -13.4], [68, -17.4], [71, -21]], 60, 72, 7, () => 0.26, { opD: 0.28, opH: 0.14 }) +
      falten(T, [[[30, -20.6], [33, -17.8], [36, -15.6]], [[55.6, -16.4], [56.4, -13.4], [58.4, -11.6]], [[62.6, -15], [65, -16.4], [66.6, -19]],
        [[65, -14.4], [67.6, -16.2], [69.2, -19]], [[68.4, -19.8], [70.2, -22.6]], [[18, -19.6], [21, -22.2]]], "#15110a", 0.13, 0.5),
    randA: 0.45, randSzene: true,
  });

  /* nahes Hinterbein: mächtiger Oberschenkel, Knie, Unterschenkel nach hinten, Mittelfuß nach vorn */
  h += teil(T, HB, nahB, {
    vol: false, randAb: 0.45, randA: 0.4,
    innen: licht(T, 39.6, -20, 6, 5.4, -10, 0.55) + licht(T, 46, -13.6, 1.6, 1.4, 0, 0.4) + schatten(T, 33.6, -12, 1.8, 5.4, -20, 0.5) +
      schatten(T, 42, -1.2, 5.4, 1.2, 0, 0.35) +
      schuppenFeld(T, [[31, -26], [48, -26]], [[31, -3], [48, -3]], 31, 48, 9, () => 0.4, { opD: 0.28, opH: 0.14 }) +
      falten(T, [[[34, -13], [38.6, -11.2], [44.6, -12.2]], [[38, -6.2], [40, -5.4], [42, -5.6]], [[37.6, -3.4], [40.2, -2.8], [43, -3]],
        [[46.6, -14.8], [44.2, -16.8], [42.6, -19.6]], [[40.6, -1.8], [40.8, -0.2]], [[43.2, -1.8], [43.4, -0.2]]], "#16120b", 0.13, 0.38) +
      falten(T, [[[38.4, -28], [43, -21], [46.8, -15]]], "#120e06", 0.9, 0.1),
  });
  h += zehen(42.2, 1.9, 3, "#43382a");
  /* nahes Vorderbein (schlank, Ellbogen hinten, Fäustling mit Huf) */
  h += teil(T, VB, nahB, {
    vol: false, randAb: 0.4, randA: 0.4,
    innen: licht(T, 59.4, -16.6, 3, 3.4, -10, 0.5) + schatten(T, 57.2, -7.6, 1.2, 3.8, -14, 0.45) +
      schuppenFeld(T, [[55, -20], [63, -20]], [[55, -2], [63, -2]], 55, 63, 8, () => 0.3, { opD: 0.28, opH: 0.14 }) +
      falten(T, [[[56.6, -10.8], [58.8, -10.2], [61.4, -10.8]], [[58.8, -3.4], [60.6, -3], [62.2, -3.4]]], "#16120b", 0.13, 0.38),
  });
  h += zehen(59.6, 1.7, 2, "#43382a");

  s += h; h = "";
  /* Kopf + Kamm als EIN Umriss: das Schnauzenprofil steigt in den Röhrenkamm über, der weit über den Hinterkopf
     hinausragt; breiter flacher Entenschnabel */
  const K = [[83.6, -22.5], [83.1, -23.6], [81.4, -24.6], [79.2, -25.9], [77.4, -27.7], [75.6, -29.8], [72.6, -32], [69.4, -33.6], [67.2, -34.4], [66, -34.3, 1],
    [66.4, -33.4], [68.8, -32.2], [71.2, -30.8], [72, -29.6], [71.2, -28], [71.2, -26.2], [72.4, -24.4], [75.4, -22.8], [78.8, -21.9], [81.6, -21.6], [83.1, -21.8]];
  h += teil(T, K, T.lg("kopf", [[0, "#7a6a48"], [0.6, "#7e6e4c"], [1, "#54472e"]]), {
    innen:
      /* Kamm farbig (mögliches Signal), Röhrenwulst mit Licht oben und Schatten unten */
      fl(T, [[65, -35], [70, -34.4], [74.6, -31.4], [76.2, -29.4], [74.6, -29.2], [72.6, -29.8], [70, -31], [66, -33]], kamm, 0.97) +
      licht(T, 71, -32.6, 5, 0.7, -26, 0.6) + schatten(T, 70.4, -31.4, 5, 0.6, -28, 0.45) +
      falten(T, [[[75.6, -29.6], [71.6, -32], [67.4, -33.8]]], "#2a1408", 0.12, 0.45) +
      licht(T, 76, -27, 3, 1.1, -26, 0.5) + schatten(T, 76.6, -23, 4, 0.9, -16, 0.5) + licht(T, 74.6, -25, 2, 1, -20, 0.3) +
      schuppenFeld(T, [[66, -34.4], [72, -32], [78, -27.6], [82, -24.4]], [[66, -33], [72, -28], [78, -23], [82, -22.4]], 66, 81, 6, () => 0.2, { opD: 0.28, opH: 0.14 }) +
      /* Hornschnabel (Entenschnabel), Maulspalte bis unter das Auge, Wange über der Zahnbatterie */
      /* breiter flacher Hornschnabel (Rhamphotheca) vorn, Maulspalte gerade bis unter das Auge */
      teilInnen(T, [[80.4, -25.2], [81.4, -24.6], [83.1, -23.6], [83.6, -22.5], [83.1, -21.8], [81.6, -21.6], [80.6, -22.2], [80.2, -23.6]], T.lg("schnabel", [[0, "#9a8e74"], [0.45, "#6a604e"], [1, "#3a3228"]])) +
      falten(T, [[[80.6, -22.6], [78.4, -22.9], [76, -23.6]], [[80.6, -25], [80.3, -23.4], [80.7, -22.2]]], "#120e08", 0.12, 0.5) +
      falten(T, [[[81.2, -24.4], [83, -23.3]]], "#fff", 0.12, 0.45) + licht(T, 78.4, -27, 1.8, 0.8, -30, 0.4),
    rand: false,
  });
  h += augeHoehle(T, 74.8, -27.2, 0.48, { iris: "#a66e28", iris2: "#46280c", offen: 0.64, winkel: -26 });
  h += `<ellipse cx="80.9" cy="-23.9" rx=".55" ry=".2" fill="#120e09" transform="rotate(-24 80.9 -23.9)"/>`;
  /* Kopf mit Kamm auf echte Länge (~1,6 m), Drehpunkt am Hals */
  s += skal(h, 72, -26, 0.86);
  const k = 11.4, box = [0, -33.2, 82, 0];
  const fuss = (p) => { const u = p.filter((q) => q[1] > -0.6); return r(u.reduce((a, q) => a + q[0], 0) / u.length * k); };
  return { svg: DM(s, k), box: box.map((v) => Math.round(v * k)), fuesse: [fuss(HB), fuss(VB), fuss(hbF), fuss(vbF)], kopf: [750, -386, 940, -236] };
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
  /* ferne Beine im Körperton ~28 % dunkler, nahe Beine gehen weich aus dem Rumpf hervor */
  const fern = T.lg("fern", [[0, "#464a36", 0], [0.12, "#464a36", 1], [0.55, "#3e412f"], [1, "#2a2c20"]]);
  const nahB = T.lg("bein", [[0, "#585c44", 0], [0.12, "#585c44", 0.7], [0.3, "#5e6247", 1], [0.8, "#4c4f38"], [1, "#333526"]]);
  const nahV = T.lg("beinV", [[0, "#55583f", 0], [0.3, "#55583f", 0.5], [0.46, "#5e6247", 1], [0.85, "#4c4f38"], [1, "#333526"]]);
  let s = "", h = "";

  /* Beine: vorn lang (Ellbogen hinten, röhrenförmige Hand), hinten kürzer (Knie vorn) */
  const HB = [[76, -46], [73.4, -38.6], [72.8, -30], [75.8, -22], [77, -14], [76.6, -6], [75.6, -1.6], [76.2, 0, 1], [90.4, 0, 1], [90.8, -1.4],
    [87.4, -3.2], [85.6, -6.4], [86, -14], [88, -24], [90, -34], [90.4, -44], [86, -50]];
  const VB = [[120.6, -62], [119.6, -50], [120.4, -38], [122, -27], [123.6, -15], [123.8, -6], [123.2, -1.4], [123.8, 0, 1], [133, 0, 1],
    [133.4, -1.4], [132, -4], [131.6, -10], [132, -20], [133.4, -32], [135, -46], [134.6, -60]];
  const hbF = kappen(boden(dreh(HB, 80, -44, -8, 7)), -40), vbF = kappen(boden(dreh(VB, 128, -56, 7, -6)), -48);
  h += fernBein(T, hbF, fern, { schuppen: [6, 0.9] }) + fernBein(T, vbF, fern, { schuppen: [6, 0.85] });
  h += krallen(T, [[hbF[8][0] - 3.4, -1.6, 3.4, 1.6], [hbF[8][0] - 6.6, -1.4, 3.2, 1.4]], "#2a2418");

  /* Rumpf (steil ansteigend) + kurzer Schwanz + steil erhobener Hals: EIN Umriss */
  const RUECKEN = [[12, -38.4], [18, -40.4], [28, -44], [42, -48.6], [58, -52.8], [72, -55.6], [82, -56.8], [94, -59], [106, -62.2], [118, -65.8],
    [128, -69], [134, -71]];
  const R = [...RUECKEN, [142, -75.4], [152, -82.4], [162, -90.6], [172, -99.4], [180, -107], [185.6, -112.6], [187.8, -116],
    [189.4, -113], [186, -106.4], [178.4, -96.6], [168.4, -85.6], [158.6, -73.4], [150.6, -61.6], [144.6, -50.4], [139.6, -42.6], [132, -37.6],
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
      /* EIN Licht oben links: helle Rückenkante, Kernschatten im unteren Drittel, Bodenreflex am Bauch; Okklusion an Beinansätzen */
      lichtModell(T, RUECKEN, [[12, -37.2], [24, -36.4], [34, -38], [48, -40.6], [58, -42.4], [68, -42.2], [76, -40], [82, -37], [88, -34.4], [96, -32.2],
        [108, -31.4], [120, -33.6], [132, -37.6], [139.6, -42.6]], 12, 140) +
      lichtModell(T, HALS_O, HALS_U, 136, 190, { kern: 0.26 }) +
      schatten(T, 90.6, -36, 3.4, 6, -8, 0.4) + schatten(T, 118.6, -38, 3, 6, 8, 0.4) +
      /* Muskeln: Schwanzwurzel, Rumpf, mächtige Schulter, Halsansatz */
      licht(T, 50, -46, 18, 3.4, -16, 0.45) + licht(T, 104, -52, 20, 8, -10, 0.45) + licht(T, 128, -58, 9, 7, -14, 0.45) +
      licht(T, 156, -76, 12, 3, -50, 0.4) + licht(T, 172, -96, 10, 2.4, -48, 0.35) + schatten(T, 80, -40, 10, 3, -10, 0.35) +
      halsFalten() +
      /* Achselfalte hinter dem Vorderbein, Bauchfalte, Flankenfalten */
      falten(T, [[[118, -36], [116, -40], [116.6, -46], [119, -52]], [[92, -33.6], [104, -31.6], [116, -32.4]], [[100, -40], [106, -45], [110, -52]],
        [[88, -40], [93, -46], [96, -54]]], "#14150c", 0.3, 0.3) +

      /* Runzeln an Schulter und Hüfte (laut Abdrücken dort am stärksten) */
      falten(T, [[[120, -42], [124, -38.6], [128, -36.6]], [[118, -46], [123, -42.6], [128, -41]], [[136, -44], [138.6, -40], [139.4, -36.6]],
        [[70, -46], [72.6, -42.6], [76, -40]], [[66, -44], [69, -41]], [[88, -36.6], [92, -34.4], [96, -33.6]], [[142, -56], [146, -60], [148, -64.6]],
        [[144, -62], [149, -66], [152, -70.6]]], "#16170e", 0.2, 0.42) +
      /* Höckerschuppen in Zonen: groß auf dem Rücken, fein am Bauch; eigenes Feld für den Hals */
      schuppenFeld(T, RUECKEN, [[12, -37.2], [24, -36.4], [34, -38], [48, -40.6], [58, -42.4], [68, -42.2], [76, -40], [82, -37], [88, -34.4], [96, -32.2],
        [108, -31.4], [120, -33.6], [132, -37.6], [139.6, -42.6]], 18, 140, 11, (x, t) => 1.3 - 0.6 * t, { opD: 0.26, opH: 0.14, w: 0.18 }) +
      schuppenFeld(T, HALS_O, HALS_U, 136, 190, 7, (x, t) => 0.95 - 0.35 * t, { opD: 0.26, opH: 0.14, w: 0.16 }),
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
  h += teil(T, VB, nahV, {
    vol: false, randAb: 0.35, randA: 0.4, rw: 0.16,
    innen: licht(T, 128, -50, 5, 6, -6, 0.32) + licht(T, 126.4, -30, 2.6, 3, 0, 0.35) + schatten(T, 121.6, -30, 2, 9, -6, 0.5) +
      schatten(T, 128.6, -2, 6, 2, 0, 0.35) +
      falten(T, [[[121, -38], [126, -36.6], [132.4, -38]], [[123.4, -15], [127.6, -14.4], [131.6, -15]], [[123.6, -10.4], [127.6, -9.8], [131.6, -10.4]],
        [[123.6, -6], [127.6, -5.4], [131.8, -6]], [[123.4, -3], [128, -2.6], [132.6, -3]], [[126.4, -24], [126.8, -16], [126.4, -8]],
        [[129.6, -26], [129.4, -18], [129.8, -10]]], "#16170e", 0.2, 0.45) +
      (F ? tupfen(T, 40, 120, -56, 134, -2, 0.35, "#8e9272", 0.2) : ""),
  });
  h += krallen(T, [[131.6, -2.4, 3.2, 2]], "#3a3324");

  s += h; h = "";
  /* Kopf: hohe Nasenkuppel (Knochenbogen) über und vor den Augen, lange breite Schnauze; Hals setzt hinten unten an */
  const K = [[184, -118.6], [186.4, -121.6], [188.4, -123.8], [190, -124.4], [191.6, -123.4], [193, -120.8], [195.4, -119.2], [198, -118],
    [199.6, -116.6], [199.6, -115], [198.2, -114], [193.6, -113.3], [189.6, -113.5], [186.6, -114.5], [184.6, -116]];
  h += teil(T, K, T.lg("kopf", [[0, "#74775c"], [0.55, "#6a6d52"], [1, "#4a4c38"]]), {
    innen: licht(T, 189.6, -122.6, 2, 1.4, -10, 0.6) + licht(T, 195.6, -118.2, 3, 0.9, -14, 0.45) + schatten(T, 192, -113.8, 6, 0.9, 0, 0.5) +
      schatten(T, 192.4, -121, 1.2, 1.6, -20, 0.4) + schatten(T, 186, -116.6, 1.6, 1.8, 0, 0.35) +
      falten(T, [[[199.2, -114.8], [195.4, -114.7], [191.6, -114.9], [189.4, -115.4]], [[185.6, -119.4], [186.8, -117.4], [186.4, -115.4]],
        [[188.6, -123.2], [190.8, -122.8], [192.4, -121.4]], [[190.6, -120.6], [192.2, -119.8]]], "#141410", 0.14, 0.5) +
      (F ? tupfen(T, 30, 184, -124, 199, -114, 0.22, "#9a9c7c", 0.25) : "") +
      "",
    rand: false,
  });
  /* Nasenloch: fleischige Öffnung vorn-unten an der Schnauze (Witmer 2001), darüber der Knochenbogen */
  h += `<ellipse cx="196.6" cy="-117.6" rx=".55" ry=".3" fill="#11120c" transform="rotate(-20 196.6 -117.6)"/>`;
  h += augeHoehle(T, 187.6, -119.4, 0.78, { iris: "#9a6a26", iris2: "#3e240c", offen: 0.6, winkel: -8 });
  /* Kopf auf echte Schädellänge (~1 m), Drehpunkt am Hals */
  s += skal(h, 185, -115, 0.62);
  const k = 10.8, box = [12, -120.8, 194.1, 0];
  const fuss = (p) => { const u = p.filter((q) => q[1] > -0.6); return r(u.reduce((a, q) => a + q[0], 0) / u.length * k); };
  return { svg: DM(s, k), box: box.map((v) => Math.round(v * k)), fuesse: [fuss(HB), fuss(VB), fuss(hbF), fuss(vbF)], kopf: [1980, -1310, 2100, -1215] };
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
  /* ferne Beine im Körperton ~28 % dunkler, nahe Beine gehen weich aus dem Rumpf hervor */
  const fern = T.lg("fern", [[0, "#4e4130", 0], [0.12, "#4e4130", 1], [0.55, "#45392a"], [1, "#2e261c"]]);
  const nahB = T.lg("bein", [[0, "#56473a", 0], [0.3, "#56473a", 0.5], [0.46, "#5c4d3b", 1], [0.85, "#4a3e30"], [1, "#30281f"]]);
  let s = "", h = "";

  const HB = [[116.6, -38], [114.8, -30], [116.6, -22], [119.6, -15], [120.4, -8], [119.8, -3], [118.8, -1], [119.4, 0, 1], [131.6, 0, 1],
    [132, -1.2], [129, -2.8], [127.6, -5.6], [128.2, -13], [130.2, -21], [132.2, -30], [131.4, -40]];
  const VB = [[166.4, -32], [165.6, -24], [166.4, -16], [167.8, -8], [167.4, -2.4], [166.8, -0.8], [167.2, 0, 1], [175, 0, 1], [175.4, -1.2],
    [174.2, -3], [173.8, -8], [174.6, -16], [176.2, -24], [176.8, -33]];
  const hbF = kappen(boden(dreh(HB, 124, -32, -8, 6)), -32), vbF = kappen(boden(dreh(VB, 171, -28, 8, -5)), -28);
  h += fernBein(T, hbF, fern, { schuppen: [3, 1] }) + fernBein(T, vbF, fern, { schuppen: [3, 0.95] });
  h += krallen(T, [[hbF[8][0] - 3.2, -1.4, 3.2, 1.5], [hbF[8][0] - 6.2, -1.2, 3, 1.3]], "#2a2418");

  /* Rumpf + Peitschenschwanz + waagerechter Hals: EIN Umriss */
  const RUECKEN = [[0, -27.4], [20, -29.2], [40, -31.6], [60, -34.4], [80, -37.6], [100, -40.8], [114, -42.6], [122, -43.2], [134, -42.6],
    [146, -40.4], [158, -37.8], [168, -36.2], [176, -36.4], [190, -38], [206, -40], [222, -42], [236, -43.4], [245, -43.8]];
  const R = [...RUECKEN, [247.2, -41.2], [238, -38.6], [222, -36.2], [206, -33.6], [192, -30.2], [182, -25.8], [174, -21.6], [160, -19.6],
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
    return `<path d="${d}" fill="#2a1e10" opacity=".28"${F ? ` filter="${weichFilter(T)}"` : ""}/>`;
  };
  h += teil(T, R, haut, {
    innen:
      baender() +
      fl(T, [[0, -28], [60, -35.4], [122, -44.4], [168, -37.4], [246, -45], [246, -42.6], [206, -38.6], [176, -34.4], [150, -36], [122, -38.6],
        [90, -35.6], [60, -32.8], [20, -28.6]], "#2a2014", 0.42) +
      fl(T, [[120, -26], [140, -20], [170, -20.4], [184, -26.4], [206, -34.4], [248, -40.6], [222, -38], [196, -33.6], [176, -26.6], [150, -24], [130, -26.4]], "#d4c29c", 0.3) +
      /* EIN Licht oben links: helle Rückenkante, Kernschatten im unteren Drittel, Bodenreflex am Bauch; Okklusion an Beinansätzen */
      lichtModell(T, RUECKEN, UNTEN, 2, 246) + schatten(T, 132, -24, 3, 5, -8, 0.4) + schatten(T, 165.6, -22, 2.4, 4.4, 8, 0.4) +
      /* Muskeln: Schwanzwurzel (Caudofemoralis), Rumpf, Schulter, Halsansatz */
      licht(T, 100, -36, 18, 3, -8, 0.5) + licht(T, 146, -32, 18, 6, -4, 0.45) + licht(T, 174, -30, 7, 4, -6, 0.4) +
      licht(T, 200, -36, 14, 2, -8, 0.35) + schatten(T, 120, -28, 8, 3, -6, 0.35) +
      schuppenFeld(T, RUECKEN, UNTEN, 56, 246, 10, (x, t) => 1.12 - 0.52 * t, { opD: 0.26, opH: 0.14, w: 0.16 }) +
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

  s += h; h = "";
  /* Kopf: klein, lang und flach; Nasenöffnung oben zwischen den Augen; Stiftzähne nur vorn */
  const K = [[245.8, -44.2], [248.4, -45.2], [251, -45], [253.6, -44.2], [255.8, -43.2], [256.6, -42], [256.4, -41], [255, -40.6], [251.6, -40.5],
    [248.4, -40.8], [246.2, -41.8]];
  h += teil(T, K, T.lg("kopf", [[0, "#857258"], [0.55, "#7a6850"], [1, "#55463a"]]), {
    innen: licht(T, 251, -44.2, 3, 0.8, -6, 0.55) + schatten(T, 252, -40.8, 4, 0.6, 0, 0.5) +
      falten(T, [[[256, -41.5], [253, -41.5], [250.2, -41.8]], [[247.2, -43.6], [247.8, -42.2], [247.4, -41]]], "#141008", 0.12, 0.5) +
      "",
    rand: false,
  });
  h += `<ellipse cx="249.8" cy="-44.9" rx=".42" ry=".18" fill="#120e09"/>`;
  h += augeHoehle(T, 249.2, -43.3, 0.58, { iris: "#9a6a26", iris2: "#3e240c", offen: 0.6, winkel: -4 });
  /* Kopf auf echte Schädellänge (~0,65 m), Drehpunkt am Hals */
  s += skal(h, 246, -42.6, 0.62);
  const k = 10, box = [0, -45.4, 252.6, 0];
  const fuss = (p) => { const u = p.filter((q) => q[1] > -0.6); return r(u.reduce((a, q) => a + q[0], 0) / u.length * k); };
  return { svg: DM(s, k), box: box.map((v) => Math.round(v * k)), fuesse: [fuss(HB), fuss(VB), fuss(hbF), fuss(vbF)], kopf: [2440, -460, 2535, -400] };
}

module.exports = [
  { id: "triceratops", de: "der Triceratops", syl: "Tri-ZE-ra-tops", it: "il triceratopo", itSyl: "tri-che-RA-to-po", en: "triceratops",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 8.59, hoehe: 2.84, zeichne: triceratops },
  { id: "brachiosaurus", de: "der Brachiosaurus", syl: "Bra-chi-o-SAU-rus", it: "il brachiosauro", itSyl: "bra-chio-SAU-ro", en: "brachiosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 19.67, hoehe: 13.05, zeichne: brachiosaurus },
  { id: "diplodocus", de: "der Diplodocus", syl: "Di-PLO-do-kus", it: "il diplodoco", itSyl: "di-PLO-do-co", en: "diplodocus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 25.26, hoehe: 4.54, zeichne: diplodocus },
  { id: "stegosaurus", de: "der Stegosaurus", syl: "Ste-go-SAU-rus", it: "lo stegosauro", itSyl: "ste-go-SAU-ro", en: "stegosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 7.75, hoehe: 3.18, zeichne: stegosaurus },
  { id: "ankylosaurus", de: "der Ankylosaurus", syl: "An-ky-lo-SAU-rus", it: "l'anchilosauro", itSyl: "an-chi-lo-SAU-ro", en: "ankylosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 6.58, hoehe: 1.7, zeichne: ankylosaurus },
  { id: "parasaurolophus", de: "der Parasaurolophus", syl: "Pa-ra-sau-RO-lo-phus", it: "il parasaurolofo", itSyl: "pa-ra-sau-RO-lo-fo", en: "parasaurolophus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 9.35, hoehe: 3.78, zeichne: parasaurolophus },
];
