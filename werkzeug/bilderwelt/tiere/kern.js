/* =====================================================================
   TIER-BIBLIOTHEK — KERN (FASSUNG 854)
   ---------------------------------------------------------------------
   XANDER (Auftrag vom 03.10., Antwort Funk 290): „ich möchte, dass die großen Tiere und die anderen
   Kleintiere noch mal richtig überarbeitet werden … die sollen ihren
   natürlichen Original entsprechen … einen perfekten Löwen … perfekte
   Dinosaurier unmissverständlich auf höchstem Niveau wie in Jurassic Park".

   Jede Art liegt in werkzeug/bilderwelt/tiere/<gruppe>.js als Eintrag:
     { id, de, syl, it, itSyl, en,          // Wort wie in jeder Szene
       gruppe, lebensraum,                  // z. B. "Raubtiere", "Savanne"
       laenge, hoehe,                       // echte Maße in Metern (Umrissbox)
       zeichne(T) → { svg, box: [x0, y0, x1, y1] } }
   zeichne arbeitet in ZENTIMETERN: Blick nach rechts, Boden y = 0
   (box[3] = 0), Licht von links oben. T ist das Werkzeug unten.
   In eine Szene setzt man ein Tier mit setze(); auf ein Blatt mit blatt.js.
   ===================================================================== */
"use strict";
const r = (n) => Math.round(n * 10) / 10;
const r4 = (n) => Math.round(n * 10000) / 10000;

function zufall(seed) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

/* Werkzeug für EINE Art in EINER Szene. S kommt aus neueSzene (lg, rg, def, id). */
function werkzeug(S, praefix, seed = 4711) {
  const T = { r, S };
  const schon = new Set();
  let nr = 0;
  const name = (n) => praefix + "_" + n;
  /* Verläufe je Art nur einmal anlegen */
  T.lg = (n, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1, extra = "") => {
    const id = name(n);
    if (schon.has("l" + id)) return `url(#${S.id(id)})`;
    schon.add("l" + id); return S.lg(id, stops, x1, y1, x2, y2, extra);
  };
  T.rg = (n, stops, cx = 0.5, cy = 0.5, rr = 0.5, extra = "") => {
    const id = name(n);
    if (schon.has("r" + id)) return `url(#${S.id(id)})`;
    schon.add("r" + id); return S.rg(id, stops, cx, cy, rr, extra);
  };
  T.def = (svg) => S.def(svg);
  T.id = (n) => S.id(name(n));
  T.rnd = zufall(seed);
  /* glatte Linie durch Punkte (Catmull-Rom). [x, y, 1] = harte Ecke. sp: Spannung */
  T.glatt = (pts, zu = true, sp = 1) => {
    const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
    for (let i = 0; i < (zu ? n : n - 1); i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6 * sp, p1[1] + (p2[1] - p0[1]) / 6 * sp];
      const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6 * sp, p2[1] - (p3[1] - p1[1]) / 6 * sp];
      d += `C${r(c1[0])} ${r(c1[1])} ${r(c2[0])} ${r(c2[1])} ${r(p2[0])} ${r(p2[1])}`;
    }
    return d + (zu ? "Z" : "");
  };
  T.box = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
  /* Volumen: oben Licht, unten Schatten (über die Form gelegt) */
  T.VOL = () => T.lg("vol", [[0, "#fff", 0.22], [0.38, "#fff", 0], [0.68, "#000", 0.08], [1, "#000", 0.36]]);
  T.VOLX = () => T.lg("volx", [[0, "#fff", 0.1], [0.45, "#fff", 0], [1, "#000", 0.16]], 0, 0, 1, 0);
  /* Körperteil: Füllung, darin (geklippt) Zeichnung/Fell, Volumen, feiner Rand.
     pts: Punkte (glatt) ODER fertiger Pfad-String d. o: { vol, volx, rand, randA, rw, innen } */
  T.koerper = (pts, fill, o = {}) => {
    const d = typeof pts === "string" ? pts : T.glatt(pts);
    const id = T.id("k" + nr++);
    T.def(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);
    let s = `<path d="${d}" fill="${fill}"/>`;
    const innen = (o.innen || "") + (o.vol !== false ? `<path d="${d}" fill="${T.VOL()}"/>` : "") + (o.volx ? `<path d="${d}" fill="${T.VOLX()}"/>` : "");
    if (innen) s += `<g clip-path="url(#${id})">${innen}</g>`;
    if (o.rand !== false) s += `<path d="${d}" fill="none" stroke="${o.rand || "#000"}" stroke-opacity="${o.randA != null ? o.randA : 0.3}" stroke-width="${o.rw || 0.8}" stroke-linejoin="round"/>`;
    return s;
  };
  T.form = (pts, fill, extra = "") => `<path d="${typeof pts === "string" ? pts : T.glatt(pts)}" fill="${fill}"${extra}/>`;
  T.linie = (pts, farbe, w, extra = "") => `<path d="${T.glatt(pts, false)}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  /* Fell/Federn: n kurze Striche in einem Feld, Richtung (dx, dy), alle in EINEM Pfad (klein!) */
  T.striche = (n, x0, y0, x1, y1, dx, dy, farbe, w, op = 0.5) => {
    let d = "";
    for (let i = 0; i < n; i++) {
      const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0), s = 0.6 + T.rnd() * 0.8;
      d += `M${r(x)} ${r(y)}l${r(dx * s)} ${r(dy * s)}`;
    }
    return `<path d="${d}" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" fill="none" stroke-linecap="round"/>`;
  };
  /* Auge: Lid, Augapfel/Iris, Pupille (rund | schlitz | quer), Glanzlicht */
  T.auge = (x, y, rr, iris = "#3a2410", o = {}) => {
    const fl = o.flach || 1;
    let s = `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rr * 1.22)}" ry="${r(rr * 1.02 * fl)}" fill="${o.lid || "#15100c"}"/>`;
    s += `<ellipse cx="${r(x + rr * 0.06)}" cy="${r(y)}" rx="${r(rr * 0.98)}" ry="${r(rr * 0.86 * fl)}" fill="${iris}"/>`;
    const p = o.pupille || "rund";
    if (p === "rund") s += `<circle cx="${r(x + rr * 0.1)}" cy="${r(y)}" r="${r(rr * 0.46 * fl)}" fill="#070504"/>`;
    if (p === "schlitz") s += `<ellipse cx="${r(x + rr * 0.1)}" cy="${r(y)}" rx="${r(rr * 0.17)}" ry="${r(rr * 0.78 * fl)}" fill="#070504"/>`;
    if (p === "quer") s += `<ellipse cx="${r(x + rr * 0.1)}" cy="${r(y)}" rx="${r(rr * 0.62)}" ry="${r(rr * 0.24 * fl)}" fill="#070504"/>`;
    s += `<circle cx="${r(x + rr * 0.38)}" cy="${r(y - rr * 0.34 * fl)}" r="${r(rr * 0.24)}" fill="#fff" opacity=".9"/>`;
    return s;
  };
  return T;
}

/* Alle Arten aller Gruppen laden (ohne Doppel). */
function alleArten() {
  const fs = require("fs"), path = require("path");
  const dir = __dirname, arten = [], ids = new Set();
  for (const f of fs.readdirSync(dir).sort()) {
    if (!/\.js$/.test(f) || /^(kern|blatt|alt-blatt|zz_.*)\.js$/.test(f)) continue;
    /* eine halbfertige Gruppe (Helfer arbeiten parallel) darf die anderen nicht aufhalten */
    let liste;
    try { delete require.cache[require.resolve(path.join(dir, f))]; liste = require(path.join(dir, f)); }
    catch (e) { console.error("übersprungen: " + f + " – " + String(e.message).split("\n")[0]); continue; }
    for (const a of (Array.isArray(liste) ? liste : [])) {
      if (ids.has(a.id)) throw new Error("Art doppelt: " + a.id + " (" + f + ")");
      ids.add(a.id); arten.push(Object.assign({ datei: f }, a));
    }
  }
  return arten;
}

/* Eine Art in eine Szene setzen.
   x, y: Fußpunkt (Mitte unten) in Szeneneinheiten; epm: Szeneneinheiten je Meter an dieser Stelle;
   o: { dir: 1 | -1, schatten: true, seed }.  Liefert { svg, box } (box in Szeneneinheiten, relativ zu x/y). */
function setze(S, art, x, y, epm, o = {}) {
  const T = werkzeug(S, (o.praefix || art.id), o.seed || 4711);
  const z = art.zeichne(T);
  const [x0, y0, x1, y1] = z.box;
  const k = epm / 100;                       // Zentimeter → Szeneneinheiten
  const dir = o.dir === -1 ? -1 : 1;
  const mx = (x0 + x1) / 2;
  let svg = "";
  if (o.schatten !== false && !art.fliegt && !art.schwimmt) {
    const L = (x1 - x0) * k / 2;
    svg += `<ellipse cx="0" cy="${r(0.3 * k * 10)}" rx="${r(L * 0.92)}" ry="${r(Math.max(0.6, L * 0.11))}" fill="#000" opacity=".22"/>`;
  }
  svg += `<g transform="scale(${r4(dir * k)} ${r4(k)}) translate(${r(-mx)} 0)">${z.svg}</g>`;
  const box = [(dir === 1 ? x0 - mx : -(x1 - mx)) * k, y0 * k, (dir === 1 ? x1 - mx : -(x0 - mx)) * k, y1 * k];
  return { svg: `<g transform="translate(${r(x)} ${r(y)})">${svg}</g>`, box, roh: svg };
}

module.exports = { werkzeug, alleArten, setze, zufall, r };
