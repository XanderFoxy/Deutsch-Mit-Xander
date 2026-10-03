/* =====================================================================
   TIER-BIBLIOTHEK — RAUBSAURIER & FLUGSAURIER (FASSUNG 854)
   Tyrannosaurus, Velociraptor, Spinosaurus, Allosaurus, Pteranodon.
   XANDER: „perfekte Dinosaurier unmissverständlich auf höchstem Niveau wie in Jurassic Park".
   Jede Art wird in einem eigenen „Zeichenraum" (Einheiten, ~200 breit) entworfen und
   mit scale(f) in Zentimeter gebracht – kurze Zahlen, kleine SVGs. Boden y = 0.
   ===================================================================== */
"use strict";
/* Genauigkeit der Koordinaten: fein 0,1 Einheiten; eine Art darf in der Szene gröber rechnen (GEN = 2 → 0,5) */
let GEN = 10;
const R = (n) => Math.round(n * GEN) / GEN;

/* ---------- Hilfen ---------- */
/* mehrere offene Linien in EINEM Pfad */
const mehr = (T, arr) => arr.map((p) => T.glatt(p, false)).join("");
const linien = (T, arr, farbe, w, op) => `<path d="${mehr(T, arr)}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round" stroke-linejoin="round"/>`;
/* weiches Licht / weicher Schatten (Muskelvolumen) */
const LICHT = (T) => T.rg("licht", [[0, "#fff", 0.55], [1, "#fff", 0]]);
const DUNKEL = (T) => T.rg("dunkel", [[0, "#000", 0.6], [1, "#000", 0]]);
const fleck = (T, art, cx, cy, rx, ry, rot, op) => !T.fein && op < 0.4 ? "" :
  `<ellipse${rot ? ` transform="rotate(${rot} ${R(cx)} ${R(cy)})"` : ""} cx="${R(cx)}" cy="${R(cy)}" rx="${R(rx)}" ry="${R(ry)}" fill="${art === "l" ? LICHT(T) : DUNKEL(T)}" opacity="${String(op).replace(/^0\./, ".")}"/>`;
/* Schuppen-Muster (Kieselschuppen), userSpace im Zeichenraum */
const schuppen = (T, n, w, h, farbe = "#000", op = 0.3, rot = -6) => {
  const id = T.id("m" + n);
  const a = w / 2, b = h / 2, rr = w * 0.24;
  T.def(`<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse" patternTransform="rotate(${rot})">` +
    `<path d="M${R(a / 2 - rr)} ${R(b / 2)}a${R(rr)} ${R(rr * 0.85)} 0 1 0 ${R(rr * 2)} 0a${R(rr)} ${R(rr * 0.85)} 0 1 0 ${R(-rr * 2)} 0M${R(a * 1.5 - rr)} ${R(b * 1.5)}a${R(rr)} ${R(rr * 0.85)} 0 1 0 ${R(rr * 2)} 0a${R(rr)} ${R(rr * 0.85)} 0 1 0 ${R(-rr * 2)} 0" fill="#fff" fill-opacity=".05" stroke="${farbe}" stroke-opacity="${op}" stroke-width="${R(w * 0.07) || 0.1}"/></pattern>`);
  return `url(#${id})`;
};
/* Körperteil: Pfad EINMAL in defs, Füllung/Muster/Innenzeichnung/Volumen/Rand per <use> (klein!).
   o: { muster, innen, vol:false, rw, randA, rand, kante: [[pts…], …] (nur diese Kanten zeichnen) } */
const teil = (T, pts, fill, o = {}) => {
  const d = typeof pts === "string" ? pts : T.glatt(pts);
  const id = T.id("q" + (T._n = (T._n || 0) + 1));
  T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  const b = o.box || T.box(pts), rect = (f) => `<rect x="${R(b[0] - 2)}" y="${R(b[1] - 2)}" width="${R(b[2] - b[0] + 4)}" height="${R(b[3] - b[1] + 4)}" fill="${f}"/>`;
  const innen = (o.muster ? rect(o.muster) : "") + (o.innen || "") + (o.vol !== false ? rect(T.VOL()) : "");
  return `<use href="#${id}" fill="${fill}"/>` + (innen ? `<g clip-path="url(#${id}c)">${innen}</g>` : "") +
    (o.kante ? linien(T, o.kante, o.rand || "#000", o.rw || 0.3, o.randA != null ? o.randA : 0.4) : o.rand !== false ? `<use href="#${id}" fill="none" stroke="${o.rand || "#000"}" stroke-opacity="${o.randA != null ? o.randA : 0.4}" stroke-width="${o.rw || 0.3}" stroke-linejoin="round"/>` : "");
};
/* Polylinie mit Bogenlänge: at(t) → [x, y, nx, ny] (t 0…1, Normale zeigt links der Laufrichtung) */
const polyl = (pts) => {
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const len = L[L.length - 1];
  return { len, at: (t) => {
    const d = Math.max(0, Math.min(1, t)) * len; let i = 1;
    while (i < L.length - 1 && L[i] < d) i++;
    const a = pts[i - 1], b = pts[i], u = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1), dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
    return [a[0] + dx * u, a[1] + dy * u, dy / n, -dx / n];
  } };
};
/* Schuppenfeld (nur fein): Kieselschuppen in der Fläche pts – je Schuppe Schattenbogen unten, Lichtbogen oben (Licht links oben) */
const schuppenFeld = (T, pts, g, o = {}) => {
  if (!T.fein) return "";
  const [x0, y0, x1, y1] = T.box(pts);
  let dS = "", dL = "", z = 0;
  for (let y = y0 + g * 0.4; y < y1; y += g * (o.dy || 0.78), z++) for (let x = x0 + (z % 2) * g / 2; x < x1; x += g) {
    const jx = x + (T.rnd() - 0.5) * g * 0.35, jy = y + (T.rnd() - 0.5) * g * 0.3;
    if (!T.inPoly(jx, jy, pts) || (o.dichte && T.rnd() > o.dichte)) continue;
    const r = g * 0.43 * (0.8 + T.rnd() * 0.4), h = r * (o.flach || 0.9);
    dS += `M${R(jx - r)} ${R(jy)}q${R(r)} ${R(h * 1.25)} ${R(2 * r)} 0`;
    dL += `M${R(jx - r * 0.85)} ${R(jy - h * 0.15)}q${R(r * 0.8)} ${R(-h * 1.1)} ${R(r * 1.6)} 0`;
  }
  const w = R(g * (o.w || 0.12)) || 0.1;
  return `<path d="${dS}" fill="none" stroke="${o.dunkel || "#140f08"}" stroke-width="${w}" stroke-opacity="${o.opS || 0.45}"/>` +
    `<path d="${dL}" fill="none" stroke="${o.hell || "#f2e6c8"}" stroke-width="${w}" stroke-opacity="${o.opL || 0.22}"/>`;
};
/* Schildernetz (nur fein): unregelmäßige Platten wie bei Krokodil-Gesichtern – Risslinien eines verwackelten Gitters,
   dazu ein heller Grat oben links an jeder Platte */
const platten = (T, pts, g, o = {}) => {
  if (!T.fein) return "";
  const [x0, y0, x1, y1] = T.box(pts), nx = Math.ceil((x1 - x0) / g) + 2, ny = Math.ceil((y1 - y0) / (g * 0.8)) + 2, V = [];
  for (let j = 0; j < ny; j++) { V.push([]); for (let i = 0; i < nx; i++) V[j].push([x0 - g + i * g + (j % 2) * g * 0.5 + (T.rnd() - 0.5) * g * 0.55, y0 - g * 0.8 + j * g * 0.8 + (T.rnd() - 0.5) * g * 0.45]); }
  const drin = (p) => T.inPoly(p[0], p[1], pts);
  let d = "", dl = "";
  const kante = (a, b) => { if (drin(a) && drin(b)) { d += `M${R(a[0])} ${R(a[1])}L${R(b[0])} ${R(b[1])}`; dl += `M${R(a[0] + 0.12 * g)} ${R(a[1] + 0.14 * g)}L${R(b[0] + 0.12 * g)} ${R(b[1] + 0.14 * g)}`; } };
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    if (i + 1 < nx) kante(V[j][i], V[j][i + 1]);
    if (j + 1 < ny) kante(V[j][i], V[j + 1][i]);
    if (j + 1 < ny && T.rnd() < 0.5) { const k = i + (j % 2 ? 1 : -1); if (k >= 0 && k < nx) kante(V[j][i], V[j + 1][k]); }
  }
  const w = R(g * (o.w || 0.09)) || 0.1;
  return `<path d="${dl}" stroke="#f3e7c8" stroke-width="${w}" stroke-opacity="${o.opL || 0.22}"/><path d="${d}" stroke="#120d07" stroke-width="${w}" stroke-opacity="${o.opS || 0.5}" stroke-linejoin="round"/>`;
};
/* Reihe entlang einer Linie: n Trennstriche quer (Lippenschuppen, Fußschilde) */
const reihe = (T, pts, n, tiefe, farbe, w, op, versatz = 0) => {
  const P = polyl(pts); let d = "";
  for (let i = 0; i <= n; i++) { const [x, y, nx, ny] = P.at(i / n); d += `M${R(x + nx * versatz)} ${R(y + ny * versatz)}l${R(nx * tiefe)} ${R(ny * tiefe)}`; }
  return `<path d="${d}" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round"/>`;
};
/* Kralle: Basis (x, y), Länge L, Breite b, Richtung w (Grad, 0 = rechts, 90 = unten), krumm: Krümmung nach rechts der Richtung */
const krallenPfad = (x, y, L, b, w, krumm = 0.5) => {
  const a = w * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
  const P = (u, v) => `${R(x + u * c - v * sn)} ${R(y + u * sn + v * c)}`;
  return `M${P(0, -b / 2)}Q${P(L * 0.62, -b * 0.55)} ${P(L, b * krumm * 2)}Q${P(L * 0.5, b * 0.1)} ${P(0, b / 2)}Z`;
};
const krallen = (T, liste, farbe = "#2a2117") => {
  const g = T.lg("kralle", [[0, "#000", 0], [0.5, "#000", 0.1], [1, "#fff", 0.25]]);
  const d = liste.map((k) => krallenPfad(...k)).join("");
  let gl = "";
  if (T.fein) for (const [x, y, L, b, w] of liste) { const a = w * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a), P = (u, v) => `${R(x + u * c - v * sn)} ${R(y + u * sn + v * c)}`; gl += `M${P(L * 0.12, -b * 0.25)}Q${P(L * 0.5, -b * 0.35)} ${P(L * 0.8, b * 0.2)}`; }
  return `<path d="${d}" fill="${farbe}"/><path d="${d}" fill="${g}"/>` + (gl ? `<path d="${gl}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="${R(liste[0][3] * 0.12) || 0.1}" stroke-linecap="round"/>` : "");
};
/* Zahnreihe: Liste [x, y, L, b] – Basis an (x, y), Spitze nach unten (dir 1) oder oben (dir -1), leicht nach hinten (links) gebogen */
const zaehne = (T, liste, dir = 1) => {
  let d = "", gl = "";
  for (const [x, y, L, b] of liste) {
    const t = y + dir * L;
    d += `M${R(x - b / 2)} ${R(y)}Q${R(x - b * 0.45)} ${R(y + dir * L * 0.6)} ${R(x - b * 0.25)} ${R(t)}Q${R(x + b * 0.5)} ${R(y + dir * L * 0.45)} ${R(x + b / 2)} ${R(y)}Z`;
    if (T.fein) gl += `M${R(x - b * 0.12)} ${R(y + dir * L * 0.15)}Q${R(x - b * 0.15)} ${R(y + dir * L * 0.55)} ${R(x - b * 0.24)} ${R(y + dir * L * 0.85)}`;
  }
  const g = T.lg("zahn" + dir, [[0, dir > 0 ? "#9c8458" : "#e8dcc0"], [0.4, "#d6c8a2"], [1, dir > 0 ? "#ece0c4" : "#9c8458"]]);
  return `<path d="${d}" fill="${g}" stroke="#4a3e2c" stroke-width=".07" stroke-opacity=".8"/>` + (gl ? `<path d="${gl}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".1"/>` : "");
};
/* Federstrahlen/Daunen: n Striche in der Fläche pts, Richtung winkel (Grad; Zahl oder f(x, y)), Länge L.
   farben: [[farbe, anteil, breite, deckkraft], …]; in der Szene nur ein Drittel. Kompakt: relative Kurven, 0,1 genau. */
const federn = (T, pts, n, winkel, L, farben, o = {}) => {
  if (!T.fein && !o.szene) return "";
  const [x0, y0, x1, y1] = T.box(pts), wf = typeof winkel === "function" ? winkel : () => winkel;
  const ziel = Math.round(n * (T.fein ? 1 : o.szene)), summe = farben.reduce((a, f) => a + f[1], 0), eimer = farben.map(() => "");
  for (let v = 0, g = 0; g < ziel && v < ziel * 12; v++) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!T.inPoly(x, y, pts)) continue;
    const a = (wf(x, y) + (T.rnd() - 0.5) * (o.streuung || 16)) * Math.PI / 180, l = L * (0.6 + T.rnd() * 0.8);
    const ex = Math.cos(a) * l, ey = Math.sin(a) * l, kr = (o.kr != null ? o.kr : 0.18) * l * (T.rnd() - 0.3);
    let u = T.rnd() * summe, i = 0;
    while (i < farben.length - 1 && u > farben[i][1]) { u -= farben[i][1]; i++; }
    eimer[i] += `M${R(x)} ${R(y)}q${R(ex / 2 - Math.sin(a) * kr)} ${R(ey / 2 + Math.cos(a) * kr)} ${R(ex)} ${R(ey)}`;
    g++;
  }
  return eimer.map((d, i) => d ? `<path d="${d}" fill="none" stroke="${farben[i][0]}" stroke-width="${farben[i][2]}" stroke-opacity="${farben[i][3]}" stroke-linecap="round"/>` : "").join("");
};
/* Federkanten (nur fein): die Spitzen der Deckfedern als feine Bögen, gewölbt in Wuchsrichtung; dunkler Saum + heller Rand */
const federkanten = (T, pts, g, winkel, o = {}) => {
  if (!T.fein) return "";
  const [x0, y0, x1, y1] = T.box(pts), wf = typeof winkel === "function" ? winkel : () => winkel;
  let d = "", dl = "", z = 0;
  for (let y = y0 + g * 0.3; y < y1; y += g * 0.62, z++) for (let x = x0 + (z % 2) * g / 2; x < x1; x += g) {
    const px = x + (T.rnd() - 0.5) * g * 0.4, py = y + (T.rnd() - 0.5) * g * 0.3;
    if (!T.inPoly(px, py, pts) || (o.dichte && T.rnd() > o.dichte)) continue;
    const a = wf(px, py) * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a), w = g * 0.5 * (0.8 + T.rnd() * 0.4);
    d += `M${R(px - uy * w)} ${R(py + ux * w)}q${R(uy * w + ux * w * 0.9)} ${R(-ux * w + uy * w * 0.9)} ${R(2 * uy * w)} ${R(-2 * ux * w)}`;
    dl += `M${R(px - uy * w * 0.8 - ux * 0.3)} ${R(py + ux * w * 0.8 - uy * 0.3)}q${R(uy * w * 0.8 + ux * w * 0.7)} ${R(-ux * w * 0.8 + uy * w * 0.7)} ${R(1.6 * uy * w)} ${R(-1.6 * ux * w)}`;
  }
  const sw = R(g * (o.w || 0.07)) || 0.1;
  return `<path d="${dl}" fill="none" stroke="${o.hell || "#f0e2c4"}" stroke-width="${sw}" stroke-opacity="${o.opL || 0.3}"/><path d="${d}" fill="none" stroke="${o.dunkel || "#1a120a"}" stroke-width="${sw}" stroke-opacity="${o.opS || 0.45}"/>`;
};
/* Schwungfeder/Steuerfeder: von Basis (bx, by) zur Spitze (sx, sy), Breite b (Außenfahne schmal, Innenfahne breit), Schaft, Äste */
const feder = (T, bx, by, sx, sy, b, fill, o = {}) => {
  const dx = sx - bx, dy = sy - by, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux, s = o.seite || 1;
  const P = (t, q) => `${R(bx + dx * t + nx * q * s)} ${R(by + dy * t + ny * q * s)}`;
  let out = `<path d="M${P(0, b * 0.25)}Q${P(0.5, b * 0.42)} ${P(0.92, b * 0.2)}Q${P(1.01, 0)} ${P(0.94, -b * 0.3)}Q${P(0.5, -b * 0.62)} ${P(0, -b * 0.35)}Z" fill="${fill}"${o.deck != null ? ` fill-opacity="${o.deck}"` : ""}${o.rand !== false ? ` stroke="#120c06" stroke-opacity=".45" stroke-width="${R(b * 0.05) || 0.1}"` : ""}/>`;
  if (o.binden) { let d = ""; for (const t of o.binden) d += `M${P(t, b * 0.36)}L${P(t + 0.05, -b * 0.55)}`; out += `<path d="${d}" stroke="${o.bindFarbe || "#e8d6b0"}" stroke-width="${R(L * 0.035)}" stroke-opacity=".45"/>`; }
  if (T.fein) {
    let d = "";
    for (let t = 0.06; t < 0.92; t += o.dichte || 0.045) d += `M${P(t, 0)}L${P(t + 0.05, -b * 0.52 * (1 - t * 0.4))}M${P(t, 0)}L${P(t + 0.04, b * 0.3 * (1 - t * 0.4))}`;
    out += `<path d="${d}" stroke="#000" stroke-width="${R(b * 0.03) || 0.05}" stroke-opacity=".25"/>`;
  }
  out += `<path d="M${P(0, 0)}Q${P(0.5, 0.06 * b)} ${P(0.97, 0)}" fill="none" stroke="${o.schaft || "#d9c9a8"}" stroke-width="${R(b * 0.06) || 0.06}" stroke-opacity=".7"/>`;
  return out;
};
/* Formlicht für große Körper: Glanz oben, Kernschatten im unteren Drittel, Reflexlicht ganz unten (objectBoundingBox) */
const FORM = (T) => T.lg("form", [[0, "#fff", 0.2], [0.22, "#fff", 0.04], [0.5, "#000", 0], [0.78, "#000", 0.3], [0.92, "#000", 0.16], [1, "#fff", 0.06]]);
const formRect = (T, b) => `<rect x="${R(b[0])}" y="${R(b[1])}" width="${R(b[2] - b[0])}" height="${R(b[3] - b[1])}" fill="${FORM(T)}"/>`;
/* fertige Art: Zeichenraum → Zentimeter */
const fertig = (f, svg, box) => ({ svg: `<g transform="scale(${f})">${svg}</g>`, box: box.map((v) => Math.round(v * f)) });

/* =====================================================================
   TYRANNOSAURUS
   RECHERCHE: Tyrannosaurus rex (Maastricht, 68–66 Mio. J., Nordamerika). Erwachsen 12–13 m lang,
   Hüfthöhe (Darmbein) ~3,7 m, ~8 t. Schädel ~1,4–1,5 m, hinten sehr breit → Augen nach vorn
   gerichtet (Raumsehen), dicke Knochenwülste über/vor dem Auge (Postorbitale, Lacrimale).
   Kurzer, dicker S-Hals, massiger Rumpf, Schwanz ~ halbe Körperlänge, waagerecht getragen
   (M. caudofemoralis: riesiger Schwanz-Oberschenkel-Muskel). Arme ~1 m, zwei Finger, Handflächen
   nach innen. Beine: Oberschenkel 1,3 m, Schienbein 1,2 m, langer Mittelfuß, drei tragende Zehen.
   Haut: Hautabdrücke zeigen kleine Kieselschuppen (keine großen Federn beim Erwachsenen).
   Lippen: Cullen et al. 2023 (Science) – Zähne wohl von schuppigen Lippen bedeckt (umstritten,
   Carr) → hier Lippen, nur die Spitzen der oberen Zähne schauen heraus.
   Farbe unbekannt → glaubwürdig wie ein großer Bodenräuber: olivbraun-grau, Bauch heller.
   Zeichenraum: 1 Einheit = 6,2 cm (200 Einheiten ≈ 12,4 m).
   ===================================================================== */
function tyrannosaurus(T) {
  const US = ' gradientUnits="userSpaceOnUse"', F = T.fein;
  /* Haut: EIN Verlauf im Zeichenraum für alle nahen Teile → nahtlose Übergänge; Rücken dunkel, Bauch hell (Gegenschattierung) */
  const haut = T.lg("haut", [[0, "#33291c"], [0.2, "#4a3c2a"], [0.48, "#6e5a3f"], [0.7, "#917a56"], [0.86, "#ab936b"], [1, "#7c6a4b"]], 0, -71, 0, 0, US);
  const hautF = T.lg("hautf", [[0, "#251e15"], [0.5, "#3a3024"], [1, "#2e261c"]], 0, -71, 0, 0, US);
  const falte = (arr, op = 0.38, w = 0.32) => linien(T, arr, "#1a140c", w, op);
  const glanz = (arr, op = 0.16, w = 0.3) => linien(T, arr, "#fff4dc", w, op);
  /* Falte mit Licht: dunkle Rinne + heller Grat darüber (Licht links oben) */
  const runzel = (arr, op = 0.4, w = 0.3) => !F ? "" : falte(arr, op, w) + (F ? glanz(arr.map((p) => p.map(([x, y]) => [x - 0.35, y - 0.35])), op * 0.45, w * 0.8) : "");
  let h = "";
  /* ---- fernes Bein (Schritt nach hinten, Ferse gehoben) und ferner Arm ---- */
  const fb = [[86, -58], [102, -62], [107, -50], [105.4, -38], [102, -31], [97.4, -24], [92.4, -17.6], [93.6, -9], [96.6, -3.4], [101.6, -1.8], [104, -0.2, 1], [91.4, -0.2, 1], [90.8, -2.4], [87.6, -9.4], [86.4, -16], [88.6, -24], [90.6, -31], [86, -42], [82, -50]];
  h += teil(T, fb, hautF, { innen: fleck(T, "d", 92, -22, 6, 11, 10, 0.5) + fleck(T, "l", 98, -48, 6, 7, 10, 0.3) + fleck(T, "l", 99, -30, 2, 5, 40, 0.3) + runzel([[[87.4, -16.6], [91.6, -17.4]], [[88.4, -12.4], [92.4, -12.6]]], 0.3, 0.25), rw: 0.25 });
  h += teil(T, [[141, -42], [144.6, -39.6], [148.6, -37.6], [150.4, -36.6], [149.6, -35.6], [146.4, -36.4], [142, -38.6]], hautF, { rw: 0.2 });

  /* ---- Rumpf, Hals, Schwanz (Mund leicht geöffnet → Kehle tiefer) ---- */
  const leib = [[0.2, -47.9], [10, -49.6], [24, -52.5], [42, -56], [62, -59.4], [80, -61.8], [98, -62.8], [114, -61.4], [128, -59], [140, -57.4], [149, -58], [156, -61.4], [162, -65.6], [168, -68],
    [170, -52], [166, -40.8], [159, -38], [152, -34.4], [146, -30.8], [138, -27.4], [126, -25.6], [114, -27.6], [104, -32], [94, -38.6], [84, -42.6], [70, -44.4], [52, -45.6], [32, -46.2], [14, -46.6], [4, -46.6], [0.6, -46.9]];
  let innen = "";
  /* Licht auf der Rückenlinie, Reflexlicht vom Boden an der Unterkante */
  innen += linien(T, [[[2, -47.8], [24, -52.7], [62, -59.6], [98, -63], [128, -59.2], [149, -58.2], [162, -65.8]]], "#e4d5ae", 3.2, 0.2);
  innen += linien(T, [[[14, -46.6], [52, -45.6], [84, -42.6]], [[118, -26.8], [138, -27.4], [146, -30.8], [152, -34.4], [159, -38]]], "#c9b48a", 1.4, 0.3);
  innen += formRect(T, [100, -69, 172, -25.6]) + formRect(T, [0, -64, 100, -42]);
  /* Fleckung (Rauschen, an Rücken und Flanken) */
  if (F) innen += `<rect x="0" y="-72" width="180" height="50" fill="#1c140b" filter="${T.rauschen("fleck", { fx: 0.09, fy: 0.22, okt: 2, staerke: 3.2, schwelle: 0.52, farbe: "#1c140b" })}" opacity=".4"/>`;
  /* weiche Querbänder (Tarnzeichnung) auf Rücken und Schwanz */
  for (const [x, y, hh] of [[14, -48.6, 2.6], [24, -51.4, 3.4], [35, -53.8, 4.4], [47, -56.2, 5.4], [60, -58.4, 6.4], [74, -60.4, 7.2], [119, -60, 6.6], [131, -57.8, 6], [143, -56.6, 5], [154, -60, 4.6]])
    innen += fleck(T, "d", x, y, 2.2, hh, x < 100 ? 12 : -8, 0.4);
  /* Muskelpakete: Schwanzwurzel (M. caudofemoralis), Rumpf, Schulter, Halsmuskeln; Kernschatten am Bauch */
  innen += fleck(T, "l", 60, -55, 26, 4.5, -6, 0.5) + fleck(T, "l", 124, -53, 16, 9, -4, 0.42) + fleck(T, "l", 153, -56, 6, 6, -40, 0.5) + fleck(T, "l", 160, -60, 4, 5.4, -30, 0.4) + fleck(T, "l", 143, -47, 6, 7, 0, 0.3);
  innen += fleck(T, "d", 130, -29, 20, 4.4, -3, 0.55) + fleck(T, "d", 50, -46.4, 34, 2.4, -2, 0.45) + fleck(T, "d", 161, -43, 7, 6, 25, 0.55) + fleck(T, "d", 144, -40, 4, 4, 0, 0.5) + fleck(T, "d", 166, -48, 3, 8, 0, 0.5);
  /* Schlagschatten des Oberschenkels auf den Bauch */
  innen += fleck(T, "d", 114, -40, 6, 12, 10, 0.55) + fleck(T, "d", 149, -33.4, 5, 1.6, 20, 0.7);
  /* Halsfalten, Kehlfalten, Achselfalten, Bauchfalten */
  innen += runzel([[[155, -59], [157.4, -51], [155.4, -41]], [[159.5, -61], [162, -53], [160.6, -43.6]], [[151, -57], [152.6, -49], [150, -37.6]],
    [[165, -43.4], [159, -40.8], [152, -37]], [[164.6, -46.6], [158, -43.6], [151.6, -40.2]], [[145.6, -44.6], [147, -41], [146.6, -37]], [[140.6, -44.2], [142.4, -40.4]]], 0.32, 0.3);
  innen += runzel([[[121, -49], [123.4, -40], [122, -28]], [[127, -50], [129.6, -40], [128.6, -27]], [[133, -50], [135.6, -40], [134.6, -29]], [[139, -50], [141.4, -42], [140.6, -32]]], 0.22, 0.34);
  if (F) {
    /* Bauchschilde (Querreihen) und Schwanz-Unterseite */
    innen += reihe(T, [[112, -27.6], [126, -25.8], [138, -27.6], [146, -31], [152, -34.6]], 18, -2.6, "#2a2014", 0.18, 0.35);
    innen += reihe(T, [[6, -47], [30, -46.3], [60, -45.2], [84, -42.8]], 40, -1.6, "#2a2014", 0.14, 0.3);
  }
  h += teil(T, leib, haut, { innen, rw: 0.3 });
  /* Rückenkamm: gekielte Schuppen, an Hüfte und Nacken größer */
  const dors = polyl([[6, -47.7], [24, -52.5], [42, -56], [62, -59.4], [80, -61.8], [98, -62.8], [114, -61.4], [128, -59], [140, -57.4], [149, -58], [156, -61.4], [162, -65.6]]);
  let hk = "", hkL = "";
  const nK = F ? 72 : 0;
  for (let i = 0; i < nK; i++) {
    const t = (i + 0.5) / nK, [x, y] = dors.at(t), g = (0.3 + 0.4 * Math.sin(Math.PI * Math.min(1, t * 1.15))) * (F ? 1 : 1.6);
    hk += `M${R(x - g)} ${R(y + 0.25)}q${R(g * 0.7)} ${R(-g * 1.5)} ${R(g * 2)} 0`;
    if (F) hkL += `M${R(x - g * 0.8)} ${R(y)}q${R(g * 0.4)} ${R(-g * 1.1)} ${R(g * 0.8)} ${R(-g * 0.9)}`;
  }
  h += `<path d="${hk}" fill="#3d3424" stroke="#1a140c" stroke-width=".12" stroke-opacity=".5"/>` + (hkL ? `<path d="${hkL}" fill="none" stroke="#e8d9b2" stroke-width=".14" stroke-opacity=".4"/>` : "");

  /* ---- naher Arm: zwei Finger, Handfläche nach innen ---- */
  const arm = [[140, -46], [143.8, -45.4], [145.4, -41.4], [145.8, -38.8], [148.4, -37.8], [151.2, -36.8], [152.6, -35.8], [151.6, -34.8], [148, -35], [144.2, -35.4], [142, -37.4], [141.2, -41.4]];
  h += teil(T, arm, haut, { rw: 0.24, randA: 0.38, innen: fleck(T, "l", 142.8, -42, 1.4, 3, 0, 0.7) + fleck(T, "l", 147.6, -37.4, 2.4, 0.8, 15, 0.5) + fleck(T, "d", 145, -35.6, 3, 1, 0, 0.6) + falte([[[143.2, -37.6], [144.6, -36.8], [146, -37.6]], [[149.4, -37.2], [149.6, -35.4]]], 0.45, 0.18) });

  /* ---- nahes Bein: Oberschenkel ohne harte Kante, dicker Unterschenkel, Mittelfuß mit Schilden, drei Zehen ---- */
  const bein = [[80, -58], [94, -64.6], [108, -63], [115.8, -54], [116.2, -43], [113.8, -35.6], [112.4, -30], [110.4, -23], [107.4, -16.6], [106.6, -13.6], [107.8, -8], [110.6, -4.4], [116.6, -2.6], [120.4, -1.2], [121.4, -0.2, 1], [101.6, -0.2, 1],
    [101.2, -2.6], [102.2, -7.4], [101.6, -13.6], [100.4, -17.4], [99.4, -23], [100.4, -28], [102, -32], [95, -38], [86.6, -45]];
  /* Muskelgruppen: M. iliotibialis (vorn), M. caudofemoralis/ilofibularis (hinten), Wade (Gastrocnemius) oben am Unterschenkel */
  let bin = fleck(T, "l", 106, -54, 8, 6, 20, 0.5) + fleck(T, "l", 95, -55, 6, 5, 0, 0.35) + fleck(T, "l", 111.6, -44, 2.2, 7, 6, 0.35) + fleck(T, "l", 105.4, -27, 2.6, 5, 14, 0.45) + fleck(T, "l", 104.4, -10, 1.2, 4, 10, 0.3);
  bin += fleck(T, "d", 89, -46, 8, 9, 30, 0.55) + fleck(T, "d", 101.6, -13, 2, 6, 6, 0.4) + fleck(T, "d", 108, -33.4, 6, 2.2, 0, 0.45) + fleck(T, "d", 114.6, -50, 2.6, 10, 0, 0.35) + fleck(T, "d", 104, -2.6, 8, 2, 0, 0.5) + fleck(T, "d", 101.4, -50, 2, 9, 12, 0.35);
  bin += runzel([[[99.6, -58], [101.6, -50], [104.6, -42]]], 0.22, 0.4);
  /* Sehne hinten am Unterschenkel (Achillessehne), Knie, Sprunggelenk */
  bin += runzel([[[101.6, -33.2], [106.4, -32], [111.6, -34.6]], [[103.4, -29.8], [108, -29]], [[100.4, -12.2], [104.6, -12], [107.6, -12.8]], [[100.2, -14.6], [104, -14.6]]], 0.4, 0.28);
  bin += glanz([[[101, -28], [100.2, -22], [101.4, -16]]], 0.3, 0.35);
  if (F) {
    /* Fußschilde (wie bei Vögeln) vorn am Mittelfuß und auf den Zehen */
    bin += reihe(T, [[106.8, -13.6], [107.8, -8], [110.6, -4.4], [116.6, -2.6], [120.2, -1.3]], 18, 1.5, "#1a140c", 0.2, 0.55, -1.6);
    bin += reihe(T, [[101.8, -12.6], [102.2, -7.4], [101.4, -2.6]], 6, 1.3, "#1a140c", 0.16, 0.4, 0.2);
  }
  h += teil(T, bein, haut, { innen: bin, rand: false });
  /* Kante nur dort, wo das Bein vor dem Bauch bzw. vor dem Hintergrund liegt */
  h += falte([[[115.8, -47], [116.2, -43], [113.8, -35.6], [112.4, -30], [110.4, -23], [107.4, -16.6], [106.6, -13.6], [107.8, -8], [110.6, -4.4], [116.6, -2.6], [120.4, -1.2]], [[101.6, -0.4], [101.2, -2.6], [102.2, -7.4], [101.6, -13.6], [100.4, -17.4], [99.4, -23], [100.4, -28], [102, -32], [95, -38], [86.6, -45], [83, -50]]], 0.42, 0.3);
  /* zweite Zehe (innen, etwas dahinter) und Zehenballen */
  h += teil(T, [[104, -3.2], [108.6, -2.8], [113.4, -1.6], [114.6, -0.2, 1], [104.6, -0.2, 1]], hautF, { rw: 0.18, vol: false });

  /* ---- Kopf: Maulhöhle, Unterkiefer, Zähne, Schädel (als Gruppe 6 Einheiten nach hinten gerückt: kurzer, dicker Hals) ---- */
  const k0 = h.length;
  const maul = [[174.6, -51.2], [185, -52.6], [196, -53.6], [201.6, -54.4], [201, -50], [199.6, -45.4], [192, -46.8], [183, -48.8]];
  /* Maulhöhle: hinten tiefdunkel, Gaumen, Zunge; Zähne der anderen Kieferseite dunkler (Tiefe) */
  h += teil(T, maul, T.lg("maul", [[0, "#0a0403"], [0.6, "#1e0c09"], [1, "#2a110d"]], 0, 0, 1, 0), { vol: false, rand: false, innen:
    T.form([[177, -50.2], [186, -49.6], [196.6, -46.8], [198.6, -47.6], [191, -48.4]], "#4e231c", ' opacity=".7"') + linien(T, [[[178, -51.4], [190, -52.6], [200.6, -53.6]]], "#3e1a14", 1.2, 0.8) + (!F ? "" :
    zaehne(T, [[183.6, -52.6, 1.2, 0.6], [188, -53, 1.5, 0.66], [192.4, -53.4, 1.6, 0.7], [196.4, -53.8, 1.4, 0.62]], 1).replace(/fill="url\([^)]*\)"/, 'fill="#6e6250"')) });
  const kiefer = [[170.4, -51.2], [175, -50.8, 1], [182, -49.4], [189, -47.8], [195, -46.5], [199.8, -45.6, 1], [200.7, -44.8], [200.6, -42.8], [199.4, -41.8], [196, -41.2], [189, -39.8], [182, -38.6], [176.6, -38.6], [172.4, -40.8], [170.2, -45]];
  let kj = fleck(T, "d", 186, -39.6, 16, 2.6, 6, 0.85) + fleck(T, "l", 186, -46.4, 11, 1.8, 12, 0.55) + fleck(T, "d", 173, -45.6, 3, 5, 0, 0.5) + fleck(T, "l", 177, -44, 4, 3, 0, 0.35);
  kj += runzel([[[173.6, -48.4], [183, -46.4], [197, -43.6]], [[171.6, -47], [173.4, -41.4]], [[176, -41.6], [186, -41], [196, -42.4]]], 0.28, 0.24);
  kj += linien(T, [[[175.4, -50.6], [182, -49.2], [189, -47.6], [199.6, -45.4]]], "#b5a077", 0.8, 0.45);
  if (F) kj += reihe(T, [[176, -50.2], [182, -48.8], [189, -47.2], [199.4, -45]], 13, 1.4, "#1a140c", 0.15, 0.55, 0.35) + platten(T, kiefer, 1.5, { opS: 0.42, opL: 0.2 });
  h += teil(T, kiefer, haut, { innen: kj, rw: 0.28, randA: 0.45, kante: [kiefer.slice(1, 13)] });
  /* Zahnfleisch und untere Zähne (Spitzen nach oben) */
  h += linien(T, [[[177, -50.5], [184, -49], [191, -47.4], [199.4, -45.6]]], "#6e3a30", 0.35, 0.9);
  h += zaehne(T, [[179.4, -50.1, 0.9, 0.55], [181.8, -49.5, 1.1, 0.62], [184.2, -48.9, 1.3, 0.7], [186.6, -48.4, 1.45, 0.74], [189, -47.8, 1.5, 0.75], [191.4, -47.3, 1.45, 0.74], [193.8, -46.8, 1.35, 0.7], [196.1, -46.3, 1.15, 0.62], [198.3, -45.9, 0.85, 0.5]], -1);
  const kopf = [[167.6, -56], [168, -63], [170.4, -68.6], [174.6, -71.1], [177.4, -71.6], [179.6, -71.9], [181.8, -71.3], [183.4, -70.9], [185.6, -71.4], [187.4, -70.9], [189.4, -69.6], [193, -67.6], [197.6, -64.9], [201, -62.4], [202.8, -59.6], [203.1, -56.6], [202.2, -54.4, 1],
    [197, -53.9], [191, -53.4], [185, -52.8], [179, -52], [175, -51.4, 1], [172.4, -52.6], [170.2, -54.4]];
  let kin = `<rect x="166" y="-72" width="38" height="20" fill="#b9a57c" opacity=".16"/>` + linien(T, [[[170, -68.6], [175, -71.3], [181, -71.6], [188.6, -70], [197.6, -65.1], [201.6, -62.4]]], "#e8dab4", 2.4, 0.3);
  kin += fleck(T, "l", 191, -65, 11, 2.6, 22, 0.6) + fleck(T, "l", 175, -66, 4.5, 3, 0, 0.45) + fleck(T, "d", 175.4, -55, 6, 4.4, 0, 0.55) + fleck(T, "d", 192, -55, 12, 2.4, 3, 0.5) + fleck(T, "d", 170, -60, 2.4, 7, 0, 0.45);
  /* Augenwulst wirft Schatten aufs Auge; Mulde vor dem Auge (Antorbitalfenster); Wangen; Schnauzenkanten */
  kin += fleck(T, "d", 180, -66.7, 3.2, 1.8, -5, 0.7);
  kin += `<path d="M183.4 -62.6c3.6-2.2 8.8-1.6 11.4 1.3c-3.3 1.7-8.3 1.7-11.4-1.3z" fill="#1a140c" opacity=".2"/>`;
  kin += runzel([[[171.6, -64.6], [174.6, -60.4], [174.8, -55]], [[176.6, -58.4], [183, -57.6], [191, -58.2]], [[194, -59.4], [200, -57.4]], [[196, -65], [199, -63]], [[172.6, -59.4], [173.6, -55.4]]], 0.34, 0.26);
  /* Oberlippe: glatter, heller Saum mit Lippenschuppen */
  kin += linien(T, [[[175.6, -51.8], [185, -53], [191, -53.6], [202, -54.6]]], "#b5a077", 1, 0.45);
  if (F) {
    kin += reihe(T, [[177, -51.8], [185, -52.8], [191, -53.4], [201.6, -54.4]], 15, -1.6, "#1a140c", 0.15, 0.55, -0.1);
    kin += platten(T, [[183, -60.4], [190, -67.6], [197.6, -64.6], [202.4, -60], [203, -56.2], [200, -55.4], [186, -55]], 1.6, { opS: 0.5, opL: 0.25 });
    kin += platten(T, [[170, -60], [174, -70], [182, -71], [190, -69.2], [195, -66.4], [186, -61.4], [178, -56.4], [171, -56]], 1.3, { opS: 0.42, opL: 0.2 });
  }
  h += teil(T, kopf, haut, { innen: kin, rw: 0.3, randA: 0.5, kante: [kopf.slice(2, 21)] });
  /* Zahnfleisch und obere Zähne (Spitzen nach unten; die größten vorn im Oberkiefer) */
  h += linien(T, [[[177, -51.8], [185, -52.7], [191, -53.3], [201.4, -54.3]]], "#6e3a30", 0.32, 0.85);
  h += zaehne(T, [[178.6, -51.8, 0.9, 0.55], [180.8, -52.1, 1.15, 0.65], [183, -52.4, 1.4, 0.74], [185.2, -52.7, 1.65, 0.82], [187.4, -52.9, 1.85, 0.88], [189.6, -53.1, 2.05, 0.92], [191.8, -53.3, 2.25, 0.96], [194, -53.5, 2.2, 0.95], [196.1, -53.7, 1.85, 0.86], [198.2, -53.9, 1.15, 0.66], [199.8, -54.1, 1, 0.6], [201.1, -54.25, 0.85, 0.52]], 1);
  /* raue Hornhöcker über dem Auge (Postorbitale) und davor (Lacrimale) */
  /* raue Knochenhöcker (Postorbitale über dem Auge, Lacrimale davor): flache, rissige Buckel */
  h += fleck(T, "l", 179.6, -70.6, 2.6, 1, 0, 0.7) + fleck(T, "l", 186, -70.3, 2.2, 0.9, 0, 0.6) + runzel([[[177.6, -70], [179.6, -70.6], [181.6, -70.2]], [[184.6, -70], [186.2, -70.4], [187.8, -69.8]], [[178.4, -69.4], [180.8, -69.6]]], 0.45, 0.18);
  h = h.slice(0, k0) + `<g transform="translate(-6 .4)">` + h.slice(k0) + "</g>";
  let s = F ? `<g filter="${T.relief("haut", { f: 3.2, tiefe: 0.26, okt: 3 })}">${h}</g>` : h;
  s += `<g transform="translate(-6 .4)">`;
  /* Auge: nach vorn gerichtet → hoch und weit hinten; Reptilienauge ohne Wimpern, mit Schuppenring */
  s += fleck(T, "d", 179.8, -66.4, 2.6, 1.9, -4, 0.55) + T.augeReal(179.8, -66.6, 1.12, { iris: "#e2a93c", iris2: "#6a3c12", offen: 0.62, lid: "#17120b", winkel: -4, pupille: "rund" });
  s += runzel([[[177.2, -67.9], [179.8, -68.8], [182.6, -67.8]], [[177.8, -64.8], [180, -64.3], [182.2, -64.9]]], 0.5, 0.22);
  if (F) s += reihe(T, [[177.4, -67], [178.6, -68.2], [180.6, -68.5], [182.4, -67.6]], 7, -0.5, "#140f08", 0.12, 0.6);
  /* Nasenloch mit Rand und feuchtem Glanz */
  s += `<path d="M199.8 -61.2c1-.8 2.2-.5 2.4.4c-.8 0-1.6 0-2.4-.4z" fill="#0e0b07"/>` + (F ? `<path d="M199.6 -61.7c1.1-.7 2.3-.5 2.7.2" fill="none" stroke="#e8d9b2" stroke-width=".14" stroke-opacity=".5"/>` : "");
  s += "</g>";
  /* Krallen: Hand (2), naher Fuß (3), ferner Fuß */
  s += krallen(T, [[152.2, -36, 2.2, 0.55, 75, 0.6], [151.2, -35.2, 2, 0.5, 85, 0.6], [120.6, -1.4, 3, 1.1, 10, 0.4], [114, -1.2, 2.4, 0.9, 12, 0.4], [101.6, -1.8, 2.2, 0.85, 165, -0.4], [103.6, -1.1, 2.6, 0.95, 8, 0.4], [104, -1.1, 2.6, 0.9, 6, 0.4], [91.2, -2, 2, 0.85, 160, -0.4]]);
  return fertig(6.2, s, [0, -71.6, 197.2, 0]);
}


/* =====================================================================
   VELOCIRAPTOR
   RECHERCHE: Velociraptor mongoliensis (Kreide, 75–71 Mio. J., Mongolei). Erwachsen bis ~2 m lang (davon ~1 m
   Schwanz), Hüfthöhe ~0,5 m, bis 15 kg – truthahngroß, NICHT menschengroß wie im Film. Gefiedert: Federkiel-Höcker
   an der Elle (Turner et al. 2007) → große Armschwingen (~14 Armfedern); Körper mit Konturfedern, Schwanz mit
   Steuerfedern (Wedel/Fächer am Schwanzende). Schädel ~25 cm, lang und flach, Schnauzenoberkante leicht
   eingesenkt (konkav), große Augenhöhle; kleine, gesägte Zähne (wohl von Lippen bedeckt). Schwanz durch
   verknöcherte Wirbelfortsätze steif und waagerecht. Hände: drei Finger mit großen Krallen, gefaltet wie ein
   Vogelflügel, Handflächen nach innen. Zweite Zehe mit ~6,5 cm Sichelkralle, beim Gehen hochgehalten – er läuft
   auf den Zehen III und IV. Mittelfuß und Zehen beschuppt (Schilde wie beim Vogel). Farbe unbekannt → wie ein
   Bodenvogel der Steppe: braun mit dunkler Bänderung, Bauch hell, dunkler Augenstreif.
   Zeichenraum: 1 Einheit = 1 cm.
   ===================================================================== */
function velociraptor(T) {
  const US = ' gradientUnits="userSpaceOnUse"', F = T.fein;
  GEN = F ? 10 : 2;
  const kleid = T.lg("kleid", [[0, "#3c2c1d"], [0.3, "#5a4430"], [0.58, "#7f6346"], [0.82, "#bba27c"], [1, "#d6c4a0"]], 0, -71, 0, -32, US);
  const glied = T.lg("glied", [[0, "#5a4430"], [0.5, "#6e5439"], [1, "#4a3826"]], 0, -56, 0, -14, US);
  const kleidF = T.lg("kleidf", [[0, "#2a1f15"], [0.6, "#3e2f20"], [1, "#4a3a2a"]], 0, -71, 0, 0, US);
  const haut = T.lg("haut", [[0, "#74665a"], [1, "#3c332a"]]);
  const dunkel = "#22180f", hell = "#e9dab8";
  const falte = (arr, op = 0.4, w = 0.2) => linien(T, arr, "#1a120a", w, op);
  const fed3 = [["#1a120a", 0.8, 0.2, 0.32], ["#8a6c4c", 1, 0.2, 0.38], [hell, 0.4, 0.14, 0.42]];
  /* Wuchsrichtung: nach hinten, Flanken nach hinten-unten, Hals entlang zum Körper */
  const rich = (x, y) => x > 138 ? 140 + Math.max(0, x - 138) * 0.2 : 180 - Math.max(0, y + 50) * 1.4;
  let s = "";

  /* ---- fernes Bein (Schritt nach hinten) und ferner Flügel ---- */
  const fb = [[88, -50], [100, -54], [105, -44], [103, -34], [97.6, -25], [92, -17.6], [92.4, -9], [95.6, -3.4], [100, -1.8], [101, -0.2, 1], [89, -0.2, 1], [88.6, -3], [86.6, -11], [87, -17], [91.4, -27], [93, -36], [88, -44]];
  s += teil(T, fb, kleidF, { rw: 0.2, randA: 0.4, innen: federn(T, fb.slice(0, 6).concat([[87, -18], [91.4, -27], [93, -36], [88, -44]]), 70, 110, 2.6, [["#120c06", 1, 0.25, 0.5], ["#6a5440", 0.6, 0.2, 0.35]]) +
    (F ? reihe(T, [[92.2, -12], [93.6, -6], [96.2, -3], [100, -2]], 8, 1, "#100a05", 0.14, 0.5, -0.9) : "") });
  s += teil(T, [[136, -50], [141, -44], [141.6, -39.4], [130, -38.4], [116, -40.6], [126, -45]], kleidF, { rw: 0.15, vol: false });

  /* ---- Schwanzwedel: Steuerfedern oben und unten am hinteren Schwanz, an der Spitze am längsten; Grundfläche = Hülle der Federspitzen ---- */
  const steuer = [], oben = [], unten = [];
  const nSt = 11;
  for (let i = 0; i < nSt; i++) {
    const t = i / (nSt - 1), x = 70 - t * 62, L = 8 + t * 12, b = 3.6 + t * 1.6, sx = x - L * 0.94, sp = 1 + 5.8 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 0.98)), 0.8);
    const so = -49.6 - sp, su = -47.4 + sp * 0.9;
    steuer.push([x, -49.4, sx, so, b, 1], [x, -47.6, sx, su, b, -1]);
    oben.push([sx, so - b * 0.3]); unten.push([sx, su + b * 0.3]);
  }
  steuer.push([10, -48.6, -10.4, -48.8, 5.6, 1]);
  const wedelF = [[74, -50.4], [70, -50.8]].concat(oben, [[-11, -49.2]], unten.reverse(), [[70, -46.4], [74, -47.6]]);
  let wedel = teil(T, wedelF, T.lg("wedel", [[0, "#5e4732"], [0.5, "#4a3826"], [1, "#2e2216"]]), { rw: 0.15, randA: 0.4, vol: false });
  const stG = T.lg("steuer", [[0, "#5a4430"], [1, "#3a2a1b"]]);
  if (F) for (const [bx, by, sx, sy, b, sd] of steuer) wedel += feder(T, bx, by, sx, sy, b, stG, { seite: sd, schaft: "#b8a27c", dichte: 0.16 });
  else wedel += linien(T, steuer.filter((_, i) => i % 2 === 0).map(([bx, by, sx, sy]) => [[bx, by], [sx, sy]]), "#140d07", 0.3, 0.5);
  /* Binden quer über den ganzen Fächer (wie bei Greifvogelschwänzen) */
  wedel += teil(T, wedelF, "none", { rand: false, vol: false, innen:
    `<path d="M58 -62l3 26h4.4l-3-26zM42 -62l3 26h4.8l-3-26zM26 -62l3 26h5.2l-3-26zM10 -62l3 26h5.6l-3-26zM-6 -62l3 26h5.4l-3-26z" fill="#1c130b" opacity=".5"/>` });
  s += wedel;

  /* ---- Rumpf, Hals, Schwanzkern ---- */
  const leib = [[6, -49.8], [30, -51.6], [60, -53.6], [84, -55.6], [100, -56.8], [114, -56.6], [126, -55.4], [134, -55.4], [140, -58], [145, -62.4], [150, -66.2], [155, -68.6],
    [157.6, -62.6], [153.6, -58.6], [148.6, -53.4], [144, -46.4], [139, -40.4], [130, -35.6], [120, -35], [110, -38], [98, -44], [82, -46.6], [56, -47], [30, -47.4], [8, -47.8]];
  let innen = "";
  /* Bänderung: dunkle Querbinden über Rücken und Schwanz, folgen der Rundung */
  for (const [x, w] of [[14, 3], [26, 3.2], [38, 3.4], [50, 3.8], [62, 4.2], [75, 4.4]])
    innen += `<path d="M${x} -59q${R(w * 0.5)} 5 ${R(-w * 0.3)} 13.6l${w} .4q${R(w * 0.7)} -7.6 ${R(-w * 0.1)} -14z" fill="${dunkel}" opacity=".4"/>`;
  /* dunkler Sattel auf dem Rücken, feine Fleckenreihen */
  innen += linien(T, [[[84, -55], [100, -56], [116, -55.6], [132, -54.6], [140, -57]]], dunkel, 5, 0.35);
  innen += formRect(T, [96, -70, 160, -34]) + formRect(T, [0, -58, 96, -46]);
  innen += fleck(T, "l", 120, -38, 14, 2.6, -4, 0.55) + fleck(T, "l", 148, -53, 2.6, 6, 40, 0.5) + fleck(T, "l", 110, -53.6, 16, 2.6, -2, 0.5) + fleck(T, "l", 146, -61, 4, 3, -40, 0.45);
  innen += federn(T, leib, 400, rich, 2.2, fed3, { szene: 0.1 });
  innen += federkanten(T, [[60, -52.6], [100, -55.4], [130, -54.4], [140, -57], [146, -61], [140, -53], [120, -50], [90, -50], [60, -49.6]], 2.1, rich, { dichte: 0.5, opS: 0.3, opL: 0.18 });
  s += teil(T, leib, kleid, { innen, rw: 0.2, randA: 0.35 });
  /* ---- nahes Bein: gefiederter Oberschenkel, „Hosen" bis über den Knöchel, beschuppter Fuß, Sichelkralle hoch ---- */
  const fuss = [[97.6, -16], [102, -15.6], [102.6, -10], [104.4, -4.6], [107, -3], [111.6, -1.8], [114.2, -0.2, 1], [98.4, -0.2, 1], [99.4, -2.6], [98.2, -8], [97, -13]];
  s += teil(T, fuss, haut, { rw: 0.18, randA: 0.5, innen: fleck(T, "l", 101, -9, 1, 4, -15, 0.5) + (F ? reihe(T, [[102.4, -14.6], [103, -9], [104.4, -4.6], [107.6, -2.8], [113.4, -1.1]], 16, 1.2, "#100a05", 0.12, 0.6, -1.1) +
    schuppenFeld(T, [[97.6, -14], [101.6, -14], [103.6, -4.8], [100, -2.4], [98.4, -8]], 0.75, { opS: 0.4, opL: 0.2 }) : "") });
  /* zweite Zehe, hochgeklappt, mit Sichelkralle */
  s += teil(T, [[102.4, -4.4], [105, -6.8], [107, -7.4], [107.4, -5.6], [105, -3.4]], haut, { rw: 0.15, randA: 0.5, innen: F ? reihe(T, [[103, -4.6], [105, -6.4], [107, -6.8]], 4, 1, "#100a05", 0.1, 0.5, -0.5) : "" });
  const un = [[103.4, -34], [110.6, -32.4], [109.4, -26], [105.4, -19], [103.6, -15], [98.6, -14.2], [96.8, -17], [99, -24], [101.6, -30]];
  s += teil(T, un, glied, { rw: 0.18, randA: 0.35, kante: [un.slice(1, 8)], innen: fleck(T, "l", 106, -26, 2, 5, 25, 0.5) + federn(T, un, 80, 104, 2.2, fed3) });
  /* Federsaum der „Hose" am Knöchel */
  s += federn(T, [[97, -18.6], [103.8, -17.4], [104, -15.6], [97.8, -15.8]], 24, 100, 2, [["#4a3826", 1, 0.2, 0.75]], { szene: 0.5 });
  const ob = [[84, -51], [100, -56], [111, -50], [113, -41], [110.6, -32.6], [104.6, -30.4], [99, -34], [92, -42]];
  s += teil(T, ob, glied, { rand: false, innen: fleck(T, "l", 101, -50, 8, 4, 10, 0.6) + fleck(T, "d", 98, -36, 6, 4, 0, 0.5) + fleck(T, "d", 88, -45, 4, 6, 30, 0.45) +
    federn(T, ob, 160, (x, y) => 105 + (x - 96) * 0.9, 2.6, fed3) + federkanten(T, ob, 2.2, 110, { dichte: 0.45, opS: 0.3, opL: 0.18 }) });
  s += falte([[[112.6, -44], [113, -41], [110.6, -32.6], [104.6, -30.4], [100, -33]]], 0.35, 0.2);

  /* ---- gefalteter Flügel: liegt an der Flanke; vorn Deckfedern, dahinter Arm- und Handschwingen, Spitze zur Hüfte ---- */
  const fluegel = [[131, -54], [138.6, -52.4], [142.8, -47], [143.6, -41], [141.4, -37.2], [133, -37.8], [124, -39.4], [114, -42.2], [104, -46.4], [113, -48.2], [122, -51]];
  let fin = fleck(T, "l", 134, -50, 8, 2.4, -15, 0.55) + fleck(T, "d", 124, -40, 14, 2, -10, 0.5);
  /* Schwingen: Fahnenkanten (dunkle Linie + heller Saum), laufen zur Spitze zusammen; Binden quer */
  let sw = "", swl = "";
  for (let i = 0; i < 9; i++) {
    const t = i / 8, x0 = 140 - t * 4, y0 = -38.4 - t * 8.6, xe = 104.6 + t * 4, ye = -46 - t * 1.2 + (1 - t) * 1.6;
    sw += `M${R(x0)} ${R(y0)}Q${R((x0 + xe) / 2)} ${R((y0 + ye) / 2 + 1.2 - t)} ${R(xe)} ${R(ye)}`;
    swl += `M${R(x0)} ${R(y0 - 0.25)}Q${R((x0 + xe) / 2)} ${R((y0 + ye) / 2 + 0.95 - t)} ${R(xe + 0.6)} ${R(ye - 0.2)}`;
  }
  fin += `<path d="${swl}" fill="none" stroke="#d8c39c" stroke-width=".22" stroke-opacity=".45"/><path d="${sw}" fill="none" stroke="#120c06" stroke-width=".25" stroke-opacity=".6"/>`;
  fin += `<path d="M124 -54l-2 18h3l2-18zM116 -54l-2 18h3l2-18zM108 -54l-2 18h2.6l2-18z" fill="#1a120a" opacity=".38"/>`;
  /* Federspitzen am Unterrand (Bögen) */
  let fsp = "";
  for (let i = 0; i < 7; i++) { const x = 140 - i * 4.6, y = -37.6 - i * 0.7 - (i > 3 ? (i - 3) * 0.6 : 0); fsp += `M${R(x)} ${R(y - 1.6)}q-1.2 2.1 -3.6 1.3`; }
  fin += `<path d="${fsp}" fill="none" stroke="#120c06" stroke-width=".22" stroke-opacity=".55"/>`;
  /* Deckfedern in Reihen vorn */
  fin += federn(T, [[131, -53.6], [138.6, -52], [142.6, -47], [143, -42], [134, -42.6], [126, -47], [124, -51]], 70, (x, y) => 192 - (y + 46) * 1.5, 1.8, fed3) +
    federkanten(T, [[131, -53], [138, -51.6], [142, -47], [142.4, -43], [134, -43.6], [127, -47.6], [126, -51]], 1.8, 190, { opS: 0.4, opL: 0.25 });
  s += teil(T, fluegel, T.lg("schwinge", [[0, "#5c4632"], [0.5, "#4a3826"], [1, "#2e2216"]]), { innen: fin, rw: 0.18, randA: 0.45 });
  /* Hand: drei Finger, Handfläche nach innen */
  s += teil(T, [[140, -38.8], [143.4, -38.6], [145.6, -36.2], [144.8, -34.8], [141.6, -36.4]], haut, { rw: 0.12, vol: false });

  /* ---- Kopf: lang, flach, Schnauze oben leicht eingesenkt ---- */
  const kiefer = [[155.4, -60.6], [164, -60.8], [172, -61.2], [180.4, -61.6], [180.2, -60.6], [175, -59.8], [167, -59.2], [160, -59], [155.8, -59.6]];
  s += teil(T, kiefer, T.lg("kehle", [[0, "#7a644a"], [1, "#b49e7a"]]), { rw: 0.18, randA: 0.45, innen: federn(T, kiefer, 40, 175, 1.4, [["#5a4430", 1, 0.13, 0.4]]) });
  const kopf = [[153, -63], [154.2, -68], [158.4, -70.4], [164, -70.2], [169, -68.2], [173.6, -66.4], [177.6, -65.6], [180.6, -64.8], [182.2, -63.6], [181.8, -62, 1], [175, -61.4], [167, -61], [160.4, -60.8], [155.4, -61.2]];
  let kin = fleck(T, "l", 165, -68.6, 7, 1.6, 10, 0.55) + fleck(T, "d", 161, -62.2, 7, 1.6, 0, 0.4);
  kin += `<path d="M156.6 -66.4q5.2-1.6 10.4-.4q-5.2 1.4-10.4 2.8z" fill="${dunkel}" opacity=".55"/>`;
  kin += federn(T, [[153, -63], [154.2, -68], [158.4, -70.4], [164, -70.2], [169, -68.2], [169, -63.6], [161, -61.6], [155, -61.6]], 90, 182, 1.3, [["#1a120a", 0.8, 0.13, 0.45], ["#9a7a58", 1, 0.12, 0.45], [hell, 0.4, 0.1, 0.45]]);
  if (F) kin += schuppenFeld(T, [[169, -68], [177.6, -65.4], [182, -63.6], [181.6, -62.2], [173, -61.8], [169, -63.2]], 0.75, { opS: 0.4, opL: 0.22 }) + reihe(T, [[161, -61.1], [169, -61.2], [177, -61.6], [181.4, -62.1]], 16, -0.6, "#1a120a", 0.07, 0.6);
  kin += linien(T, [[[157, -61.2], [167, -61.2], [177, -61.6], [181.6, -62.2]]], "#2a1d12", 0.3, 0.55);
  s += teil(T, kopf, kleid, { innen: kin, rw: 0.2, randA: 0.45, kante: [kopf.slice(1, 14)] });
  if (F) s += zaehne(T, [[170, -61.25, 0.45, 0.32], [172, -61.35, 0.5, 0.34], [174, -61.45, 0.5, 0.34], [176, -61.55, 0.45, 0.32], [178, -61.7, 0.4, 0.3], [179.8, -61.85, 0.35, 0.28]], 1);
  s += T.augeReal(162.6, -66.8, 1.1, { iris: "#d9a23a", iris2: "#6a3a10", offen: 0.72, lid: "#140c06", winkel: -3, pupille: "rund" });
  s += falte([[[160.6, -68.3], [162.8, -69.1], [165, -68.2]]], 0.5, 0.16);
  s += `<path d="M178 -64.4c.7-.5 1.6-.4 1.9.2c-.6.1-1.2.1-1.9-.2z" fill="#0d0905"/>`;
  /* Krallen: Hand (3), Sichelkralle (groß, hochgehalten), Zehen III/IV, ferner Fuß */
  s += krallen(T, [[145, -35.4, 2.8, 0.8, 100, 0.7], [143.8, -35.4, 2.4, 0.72, 108, 0.7], [142.6, -36.2, 2.1, 0.62, 118, 0.7],
    [106.8, -6.6, 6.4, 1.5, -46, 0.9], [113.4, -1.2, 1.8, 0.7, 20, 0.4], [98.6, -1.2, 1.6, 0.6, 165, -0.4], [95, -2.6, 3.8, 1.1, -50, 0.9], [100.4, -1.2, 1.4, 0.5, 15, 0.4]], "#1e1610");
  GEN = 10;
  return fertig(1, s, [-11.6, -71, 182.4, 0]);
}

module.exports = [
  { id: "tyrannosaurus", de: "der Tyrannosaurus", syl: "Ty-ran-no-SAU-rus", it: "il tirannosauro", itSyl: "ti-ran-no-SAU-ro", en: "Tyrannosaurus rex",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 12.2, hoehe: 4.45, zeichne: tyrannosaurus },
  { id: "velociraptor", de: "der Velociraptor", syl: "Ve-lo-ci-RAP-tor", it: "il velociraptor", itSyl: "ve-lo-ci-RAP-tor", en: "velociraptor",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 1.94, hoehe: 0.71, zeichne: velociraptor },
];
