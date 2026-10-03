/* =====================================================================
   TIER-BIBLIOTHEK — RAUBSAURIER & FLUGSAURIER (FASSUNG 854, MASSSTAB 2, Runde 2)
   Tyrannosaurus, Velociraptor, Spinosaurus, Allosaurus, Pteranodon (Flugsaurier, KEIN Dinosaurier).
   XANDER: „perfekte Dinosaurier unmissverständlich auf höchstem Niveau wie in Jurassic Park … fast fotorealistisch".
   Jede Art wird in einem eigenen Zeichenraum (~200 Einheiten breit) entworfen und mit scale(f) in Zentimeter
   gebracht.
   Runde 2 (Kritik Runde 1): EIN Licht oben links – Licht und Schatten werden je Körperteil als weich geblurrte
   Pinselstriche entlang der Form gemalt (Rückenlicht, Kernschattenband im unteren Drittel, Bodenreflex, Okklusion an
   den Ansätzen), keine Umrisslinien, keine zufälligen Lichtflecken. Beine digitigrad als Z (Knie vorn, Ferse hoch,
   Mittelfuß steil, nur Zehen am Boden). Struktur in Hierarchie (große Schilde an Kopf und Rücken, feines Relief an
   der Flanke, Querschilde am Bauch), Relief nur halb so stark. Zähne als gekrümmte Kegel, Lippen verdecken die Basis.
   Augen in einer Höhle mit Brauenschatten. zeichne() liefert fuesse (Bodenschatten) und kopf (Kopf-Ausschnitt).
   Feinheit (T.fein): Relief, Schuppen, Federstrahlen, Schilde nur fein; Formen, Farben und Licht sind gleich.
   ===================================================================== */
"use strict";
/* Genauigkeit der Koordinaten: fein 0,1 Einheiten; in der Szene darf eine Art gröber rechnen */
let GEN = 10;
const R = (n) => Math.round(n * GEN) / GEN;
const OP = (n) => String(Math.round(n * 100) / 100).replace(/^0\./, ".");

/* ---------- Grundformen ---------- */
const mehr = (T, arr) => arr.map((p) => T.glatt(p, false)).join("");
const linien = (T, arr, farbe, w, op) => `<path d="${mehr(T, arr)}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${OP(op)}" stroke-linecap="round" stroke-linejoin="round"/>`;
const flaeche = (T, pts, fill, op = 1) => `<path d="${typeof pts === "string" ? pts : T.glatt(pts)}" fill="${fill}"${op < 1 ? ` opacity="${OP(op)}"` : ""}/>`;
const ell = (cx, cy, rx, ry, rot, fill, op = 1) => `<ellipse${rot ? ` transform="rotate(${rot} ${R(cx)} ${R(cy)})"` : ""} cx="${R(cx)}" cy="${R(cy)}" rx="${R(rx)}" ry="${R(ry)}" fill="${fill}"${op < 1 ? ` opacity="${OP(op)}"` : ""}/>`;
const verschiebe = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy]);
const drehe = (pts, cx, cy, grad) => {
  const a = grad * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  return pts.map((p) => { const x = p[0] - cx, y = p[1] - cy, q = [cx + x * c - y * s, cy + x * s + y * c]; if (p[2]) q.push(1); return q; });
};
/* Polylinie mit Bogenlänge: at(t) → [x, y, nx, ny] (Normale links der Laufrichtung) */
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

/* ---------- Malschicht: weicher Gauß-Filter, Bereich passend zum Teil ---------- */
const weich = (T, s, b) => {
  const id = T.id("w" + (T._w = (T._w || 0) + 1)), m = s * 3;
  T.def(`<filter id="${id}" filterUnits="userSpaceOnUse" x="${R(b[0] - m)}" y="${R(b[1] - m)}" width="${R(b[2] - b[0] + 2 * m)}" height="${R(b[3] - b[1] + 2 * m)}"><feGaussianBlur stdDeviation="${s}"/></filter>`);
  return `url(#${id})`;
};
/* Körperteil: Pfad EINMAL in defs; Füllung, dann geklippt: Innenzeichnung (scharf), Malschicht (weich), oben drauf
   scharfe Details (oben). Keine Umrisslinie (Kritik: „Aufkleber"); auf Wunsch nur einzelne Kanten (kante). */
const teil = (T, pts, fill, o = {}) => {
  const d = typeof pts === "string" ? pts : T.glatt(pts);
  const id = T.id("q" + (T._n = (T._n || 0) + 1));
  T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  const b = o.box || T.box(pts);
  let innen = o.innen || "";
  if (o.mal) innen += `<g filter="${weich(T, o.weich || 1.5, b)}">${o.mal}</g>`;
  if (o.mal2) innen += `<g filter="${weich(T, o.weich2 || 0.5, b)}">${o.mal2}</g>`;
  innen += o.oben || "";
  return `<use href="#${id}" fill="${fill}"/>` + (innen ? `<g clip-path="url(#${id}c)">${innen}</g>` : "") +
    (o.kante ? linien(T, o.kante, o.rand || "#1a1208", o.rw || 0.3, o.randA != null ? o.randA : 0.35) : "");
};
/* freie weiche Schicht (außerhalb eines Teils, z. B. Schlagschatten über mehrere Teile) */
const weichG = (T, s, b, inhalt) => `<g filter="${weich(T, s, b)}">${inhalt}</g>`;
/* Fleckung (Rauschen) als Tarnzeichnung – auch in der Szene (gleiche Farbwerte groß und klein) */
const fleckung = (T, n, b, farbe, op, fx = 0.1, fy = 0.24) =>
  `<rect x="${R(b[0])}" y="${R(b[1])}" width="${R(b[2] - b[0])}" height="${R(b[3] - b[1])}" fill="${farbe}" filter="${T.rauschen(n, { fx, fy, okt: 2, staerke: 3, schwelle: 0.55, farbe })}" opacity="${OP(op)}"/>`;

/* ---------- Schuppen und Schilde (nur fein) ---------- */
/* Kieselschuppen im Feld pts: Schattenbogen unten, Lichtbogen oben */
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
  return `<path d="${dS}" fill="none" stroke="${o.dunkel || "#140f08"}" stroke-width="${w}" stroke-opacity="${OP(o.opS || 0.4)}"/>` +
    `<path d="${dL}" fill="none" stroke="${o.hell || "#f2e6c8"}" stroke-width="${w}" stroke-opacity="${OP(o.opL || 0.16)}"/>`;
};
/* Schildernetz (Gesichtsschilde): verwackeltes Gitter, dunkle Fugen, dezenter Lichtgrat */
const platten = (T, pts, g, o = {}) => {
  if (!T.fein) return "";
  const [x0, y0, x1, y1] = T.box(pts), nx = Math.ceil((x1 - x0) / g) + 2, ny = Math.ceil((y1 - y0) / (g * 0.8)) + 2, V = [];
  for (let j = 0; j < ny; j++) { V.push([]); for (let i = 0; i < nx; i++) V[j].push([x0 - g + i * g + (j % 2) * g * 0.5 + (T.rnd() - 0.5) * g * 0.5, y0 - g * 0.8 + j * g * 0.8 + (T.rnd() - 0.5) * g * 0.4]); }
  const drin = (p) => T.inPoly(p[0], p[1], pts);
  let d = "", dl = "";
  const kante = (a, b) => { if (drin(a) && drin(b)) { d += `M${R(a[0])} ${R(a[1])}L${R(b[0])} ${R(b[1])}`; dl += `M${R(a[0] + 0.1 * g)} ${R(a[1] + 0.12 * g)}L${R(b[0] + 0.1 * g)} ${R(b[1] + 0.12 * g)}`; } };
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    if (i + 1 < nx) kante(V[j][i], V[j][i + 1]);
    if (j + 1 < ny) kante(V[j][i], V[j + 1][i]);
    if (j + 1 < ny && T.rnd() < 0.45) { const k = i + (j % 2 ? 1 : -1); if (k >= 0 && k < nx) kante(V[j][i], V[j + 1][k]); }
  }
  const w = R(g * (o.w || 0.08)) || 0.1;
  return `<path d="${dl}" stroke="${o.hell || "#efe2c2"}" stroke-width="${w}" stroke-opacity="${OP(o.opL || 0.1)}"/><path d="${d}" stroke="${o.dunkel || "#120d07"}" stroke-width="${w}" stroke-opacity="${OP(o.opS || 0.35)}" stroke-linejoin="round"/>`;
};
/* Querstriche entlang einer Linie (Lippenschuppen, Fußschilde, Bauchschilde) */
const reihe = (T, pts, n, tiefe, farbe, w, op, versatz = 0) => {
  const P = polyl(pts); let d = "";
  for (let i = 0; i <= n; i++) { const [x, y, nx, ny] = P.at(i / n); d += `M${R(x + nx * versatz)} ${R(y + ny * versatz)}l${R(nx * tiefe)} ${R(ny * tiefe)}`; }
  return `<path d="${d}" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${OP(op)}" stroke-linecap="round"/>`;
};
/* flache Schilde auf der Rückenmittellinie (Scuta): unregelmäßig, an Hüfte/Nacken größer; Licht oben links */
const rueckenSchilde = (T, pts, n, gmin, gmax, farbe) => {
  if (!T.fein) return "";
  const P = polyl(pts); let d = "", dl = "";
  for (let i = 0; i < n; i++) {
    const t = (i + 0.3 + T.rnd() * 0.4) / n, [x, y, nx, ny] = P.at(t), g = (gmin + (gmax - gmin) * Math.sin(Math.PI * t)) * (0.8 + T.rnd() * 0.4);
    const ux = -ny, uy = nx;  /* Tangente */
    const ax = x - ux * g, ay = y - uy * g, bx = x + ux * g, by = y + uy * g, hx = nx * g * 0.55, hy = ny * g * 0.55;
    d += `M${R(ax)} ${R(ay)}Q${R(x + hx * 1.6)} ${R(y + hy * 1.6)} ${R(bx)} ${R(by)}Q${R(x - hx * 0.6)} ${R(y - hy * 0.6)} ${R(ax)} ${R(ay)}Z`;
    dl += `M${R(ax + ux * g * 0.2)} ${R(ay + uy * g * 0.2)}Q${R(x + hx * 1.3)} ${R(y + hy * 1.3)} ${R(x + ux * g * 0.3)} ${R(y + uy * g * 0.3 + hy * 0.6)}`;
  }
  return `<path d="${d}" fill="${farbe}" stroke="#120c06" stroke-width=".1" stroke-opacity=".35"/><path d="${dl}" fill="none" stroke="#f4e6c4" stroke-width=".14" stroke-opacity=".35"/>`;
};

/* ---------- Zähne, Krallen, Auge ---------- */
/* Zahnreihe: [x, y, L, b, k] – Basis-Mitte (x, y) liegt INNEN (wird von Lippe/Kiefer verdeckt), Länge L, Basisbreite b,
   Krümmung k nach hinten (links). dir 1 = Spitze nach unten (Oberkiefer), -1 = nach oben (Unterkiefer).
   Elfenbein mit bräunlicher Basis, Glanzkante auf der Lichtseite (links). */
const zaehne = (T, liste, dir = 1, ton = "") => {
  let d = "", gl = "";
  for (const [x, y, L, b, k = 0.28] of liste) {
    const tx = x - L * k, ty = y + dir * L;
    d += `M${R(x + b / 2)} ${R(y)}Q${R(x + b * 0.5 - L * k * 0.15)} ${R(y + dir * L * 0.7)} ${R(tx)} ${R(ty)}Q${R(x - b * 0.55 - L * k * 0.45)} ${R(y + dir * L * 0.4)} ${R(x - b / 2)} ${R(y)}Z`;
    if (T.fein) gl += `M${R(x - b * 0.22)} ${R(y + dir * L * 0.25)}Q${R(x - b * 0.3 - L * k * 0.35)} ${R(y + dir * L * 0.62)} ${R(tx + b * 0.08)} ${R(ty - dir * L * 0.1)}`;
  }
  const g = T.lg("zahn" + dir + ton, dir > 0 ? [[0, "#6e5638"], [0.3, "#b9a47c"], [0.65, "#e2d6b4"], [1, "#f1e8d0"]] : [[0, "#f1e8d0"], [0.35, "#e2d6b4"], [0.7, "#b9a47c"], [1, "#6e5638"]]);
  return `<path d="${d}" fill="${g}" stroke="#3a2c1c" stroke-width=".06" stroke-opacity=".7"/>` + (gl ? `<path d="${gl}" fill="none" stroke="#fffaf0" stroke-opacity=".7" stroke-width=".09" stroke-linecap="round"/>` : "");
};
/* Kralle: Basis (x, y), Länge L, Basisbreite b, Richtung w (Grad, 0 = rechts, 90 = unten), krumm: Krümmung */
const krallenPfad = (x, y, L, b, w, krumm = 0.5) => {
  const a = w * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
  const P = (u, v) => `${R(x + u * c - v * sn)} ${R(y + u * sn + v * c)}`;
  return `M${P(-b * 0.1, -b / 2)}Q${P(L * 0.55, -b * 0.62)} ${P(L, b * krumm * 2)}Q${P(L * 0.55, b * 0.15)} ${P(-b * 0.1, b / 2)}Z`;
};
const krallen = (T, liste) => {
  const g = T.lg("horn", [[0, "#2e251c"], [0.55, "#4a3e30"], [1, "#8a7a60"]], 0, 0, 1, 0);
  const d = liste.map((k) => krallenPfad(...k)).join("");
  let gl = "";
  for (const [x, y, L, b, w, kr = 0.5] of liste) { const a = w * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a), P = (u, v) => `${R(x + u * c - v * sn)} ${R(y + u * sn + v * c)}`; gl += `M${P(L * 0.08, -b * 0.3)}Q${P(L * 0.5, -b * 0.4)} ${P(L * 0.85, b * kr * 1.2)}`; }
  return `<path d="${d}" fill="${g}" stroke="#140e08" stroke-width="${R(liste[0][3] * 0.06) || 0.05}" stroke-opacity=".6"/><path d="${gl}" fill="none" stroke="#f6ead0" stroke-opacity=".55" stroke-width="${R(liste[0][3] * 0.13) || 0.06}" stroke-linecap="round"/>`;
};
/* Auge in einer Höhle: Augenhöhle (weicher Schatten), echtes Auge (ohne rosa Karunkel – Reptil/Vogel), dicker Lidrand,
   Brauenwulst mit Lichtkante, dessen Schatten das obere Drittel des Auges deckt. */
const augeHoehle = (T, x, y, r, o = {}) => {
  let s = `<ellipse cx="${R(x)}" cy="${R(y + r * 0.1)}" rx="${R(r * 2.1)}" ry="${R(r * 1.55)}" fill="${T.rg("hoehle", [[0, "#000", 0.55], [0.6, "#000", 0.3], [1, "#000", 0]])}"/>`;
  s += T.augeReal(x, y, r, Object.assign({ offen: 0.7, pupille: "rund" }, o)).replace(/<ellipse[^>]*fill="#b0605a"[^>]*\/>/g, "");
  /* dicker Lidrand unten (Schuppenring) */
  s += `<path d="M${R(x - r * 1.4)} ${R(y + r * 0.05)}Q${R(x)} ${R(y + r * 1.05)} ${R(x + r * 1.4)} ${R(y - r * 0.1)}" fill="none" stroke="#1a120a" stroke-width="${R(r * 0.22)}" stroke-opacity=".7"/>`;
  /* Brauenschatten über dem oberen Drittel */
  s += `<path d="M${R(x - r * 1.5)} ${R(y - r * 0.2)}Q${R(x - r * 0.2)} ${R(y - r * 0.55)} ${R(x + r * 1.5)} ${R(y - r * 0.35)}L${R(x + r * 1.6)} ${R(y - r * 1.3)}Q${R(x)} ${R(y - r * 1.7)} ${R(x - r * 1.6)} ${R(y - r * 1.1)}Z" fill="#0c0804" opacity=".5"/>`;
  return s;
};

/* ---------- Federn ---------- */
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
/* fertige Art: Zeichenraum → Zentimeter */
const fertig = (f, svg, box) => ({ svg: `<g transform="scale(${f})">${svg}</g>`, box: box.map((v) => Math.round(v * f)) });

/* =====================================================================
   TYRANNOSAURUS
   RECHERCHE: Tyrannosaurus rex (Maastricht, 68–66 Mio. J., Nordamerika). Erwachsen 12–13 m lang,
   Hüfthöhe (Darmbein) ~3,7–3,9 m, ~8 t. Schädel ~1,4 m (≈ 11,5 % der Körperlänge, Länge : Höhe ≈ 1,6), hinten
   sehr breit → Augen nach vorn (Raumsehen), raue Knochenhöcker über/hinter dem Auge (Postorbitale) und davor
   (Lacrimale). Unterkiefer hinten am tiefsten. Kurzer, dicker S-Hals mit konkaver Kehle, massiger Rumpf, tiefster
   Punkt am Schambeinfuß vor dem Oberschenkel. Schwanz ~ halbe Länge, waagerecht, Wurzel unten voll
   (M. caudofemoralis). Arme ~1 m: Oberarm, Ellbogen ~90°, zwei Finger (I größer), Handflächen nach innen.
   Beine digitigrad: Oberschenkel 1,3 m schräg nach vorn, Schienbein 1,2 m schräg zurück, Ferse ~0,6 m über dem
   Boden, Mittelfuß steil, drei tragende Zehen mit Ballen, breite stumpfe Krallen.
   Haut: Hautabdrücke zeigen kleine Kieselschuppen (keine großen Federn beim Erwachsenen); Gesicht mit Schilden.
   Lippen: Cullen et al. 2023 (Science) – Zähne wohl von schuppigen Lippen bedeckt (umstritten, Carr) → Lippen
   verdecken die Zahnbasen, Maul leicht geöffnet, größte Zähne an Position 3–5 im Oberkiefer.
   Farbe unbekannt → olivbraun-grau wie ein großer Bodenräuber, Rücken dunkler, Bauch heller, Fleckung.
   Zeichenraum: 1 Einheit = 6,2 cm.
   ===================================================================== */
function tyrannosaurus(T) {
  const F = T.fein, US = ' gradientUnits="userSpaceOnUse"';
  const haut = T.lg("haut", [[0, "#3a3224"], [0.25, "#4c4230"], [0.5, "#685a42"], [0.72, "#857254"], [0.88, "#9a8664"], [1, "#8c7a5a"]], 0, -70, 0, -24, US);
  const hautN = T.lg("hautn", [[0, "#40372a"], [0.3, "#554a36"], [0.6, "#726249"], [0.85, "#86735a"], [1, "#6a5c46"]], 0, -64, 0, 0, US);
  const hautF = T.lg("hautf", [[0, "#2e281d"], [0.4, "#3c3427"], [0.75, "#4a4030"], [1, "#3a3226"]], 0, -64, 0, 0, US);
  const LI = "#fff2d4", SC = "#140d06", RF = "#e2c79c";
  let h = "";

  /* ---- fernes Bein (Schritt nach hinten, Ferse hoch) ---- */
  const fb = [[86, -56], [100, -60], [105, -50], [104.4, -40], [102.6, -33], [99.6, -27], [95.6, -20.4], [92.6, -15], [93, -9.4], [94.4, -4.8], [97.2, -3], [100.6, -1.4], [101.2, -0.2, 1], [90.8, -0.2, 1], [89.8, -1.6],
    [88.2, -6], [86.8, -11], [86.6, -14.4], [87.8, -19.4], [90.6, -26], [93.6, -31.4], [88, -38], [83, -46]];
  h += teil(T, fb, hautF, { weich: 1.4,
    mal: linien(T, [[[88, -52], [98, -57], [103, -50]]], LI, 4, 0.18) + linien(T, [[[104, -46], [103, -38], [100, -30]], [[100, -26], [96, -18], [93.8, -10]]], SC, 2.6, 0.35) +
      linien(T, [[[89, -24], [88.4, -18]]], LI, 1.4, 0.18) + ell(95, -2, 6, 1.6, 0, SC, 0.5),
    oben: F ? reihe(T, [[93.4, -9], [94.6, -4.8], [97.2, -3], [100.4, -1.4]], 7, 1.1, "#120c06", 0.16, 0.45, -1) : "" });

  /* ---- ferner Arm ---- */
  h += teil(T, [[140.6, -42.6], [143.2, -41.6], [144.2, -39.2], [147.4, -38.4], [148.8, -37.2], [147, -36.2], [143.6, -36.4], [141.4, -38.6]], hautF, { mal: ell(146, -36.8, 3, 1, 0, SC, 0.4), weich: 0.6 });

  /* ---- Rumpf, Hals, Schwanz ---- */
  const oben = [[2, -48.9], [12, -49.9], [26, -51.9], [44, -55.6], [62, -58.6], [80, -61.2], [96, -62.6], [112, -61.6], [126, -59.6], [138, -57.8], [148, -58], [156, -60.6], [163, -64], [170, -66.6], [175, -67.6]];
  const bauch = [[105, -25.4], [112, -26.6], [122, -28.6], [134, -30.4], [144, -32.6], [150, -35.6], [156, -40.4], [162, -44.4], [168, -47.4], [174, -49.6]];
  const sUnten = [[4, -46.4], [14, -46.3], [30, -46.3], [46, -45.9], [62, -44.7], [74, -42.5], [84, -39.4]];
  const leib = [[-0.4, -47.4]].concat(oben, [[178, -60], [177.4, -52]], bauch.slice().reverse(), [[99, -28], [92, -34]], sUnten.slice().reverse(), [[0.6, -46.6]]);
  let inn = fleckung(T, "fleck", [0, -70, 178, -24], "#1a120a", 0.3);
  /* Querbänder (Tarnzeichnung) auf Rücken und Schwanz, laufen an der Flanke aus */
  let bd = "";
  for (const [x, w, hh] of [[16, 2, 3], [27, 2.4, 4], [39, 2.6, 5], [52, 3, 6.4], [66, 3.2, 7.6], [81, 3.4, 8.4], [118, 3.4, 9], [131, 3.2, 8], [143, 2.8, 6.4], [155, 2.4, 5]]) {
    const y = x < 96 ? -48.9 - (x / 96) * 13.7 : x < 148 ? -62.6 + (x - 96) * 0.1 : -58 - (x - 148) * 0.33;
    bd += `M${R(x - w / 2)} ${R(y - 1)}q${R(w * 0.9)} ${R(hh * 0.5)} ${R(w * 0.3)} ${hh}l${R(w * 0.45)} 0q${R(w * 0.9)} ${R(-hh * 0.55)} ${R(w * 0.25)} ${-hh}z`;
  }
  inn += `<path d="${bd}" fill="#22180e" opacity=".32"/>`;
  if (F) {
    inn += reihe(T, bauch.slice(0, 8), 20, -2.4, "#22180e", 0.16, 0.28) + reihe(T, sUnten, 34, -1.4, "#22180e", 0.12, 0.22);
    inn += schuppenFeld(T, [[136, -54], [150, -56.4], [160, -62], [168, -64.6], [170, -58], [164, -50], [154, -44], [144, -40], [136, -44]], 0.9, { opS: 0.22, opL: 0.1, dichte: 0.55 });
  }
  /* Licht oben links: Rückenlicht, Kernschattenband im unteren Drittel, Bodenreflex, Okklusion an den Ansätzen */
  let mal = linien(T, [verschiebe(oben.slice(0, 14), 0, 2)], LI, 5, 0.34);
  mal += linien(T, [verschiebe(bauch.slice(0, 7), 0, -6.4)], SC, 9, 0.42) + linien(T, [verschiebe(sUnten, 0, -2.6)], SC, 4.2, 0.36);
  mal += linien(T, [verschiebe(bauch, 0, 0.8)], RF, 2.4, 0.3) + linien(T, [verschiebe(sUnten, 0, 0.6)], RF, 1.4, 0.24);
  mal += ell(114, -40, 5, 13, 8, SC, 0.5) + ell(86, -45, 6, 4, 0, SC, 0.45) + ell(144, -37.6, 4.6, 3.4, 0, SC, 0.55) + ell(172, -51, 4, 3.4, 0, SC, 0.55) + ell(167, -45.6, 6, 2.6, 30, SC, 0.4);
  /* Halsmuskeln: Licht auf dem oberen Hals, Rinne darunter; Schulter */
  mal += linien(T, [[[150, -55], [158, -56.6], [166, -60.4]]], LI, 3, 0.2) + linien(T, [[[148, -48], [158, -50], [168, -55]]], SC, 1.6, 0.22) + linien(T, [[[136, -52], [142, -47], [143, -42]]], LI, 2.4, 0.16);
  /* Falten: Halsbasis, Achsel, Schwanzwurzel (weich) */
  const falten = [[[157, -57], [158.4, -50], [157, -43]], [[146, -43.4], [147.4, -40.2], [147, -36.6]]];
  let fa = linien(T, falten, SC, 0.5, 0.3);
  if (F) fa += linien(T, falten.map((p) => verschiebe(p, -0.5, -0.4)), LI, 0.4, 0.2);
  h += teil(T, leib, haut, { innen: inn, mal, weich: 2.4, mal2: fa, weich2: 0.25,
    oben: rueckenSchilde(T, oben.slice(1, 14), 64, 0.35, 0.95, "#3c3324") });

  /* ---- naher Arm: Oberarm, Ellbogen ~90°, Unterarm, zwei Finger ---- */
  const arm = [[140.2, -45.2], [143.8, -45], [144.8, -41.4], [145.4, -39.6], [147.6, -39.4], [149.8, -38.6], [150, -37.2], [147.6, -36.6], [144.6, -36.4], [142.6, -37.2], [141.8, -39.8], [140.8, -42.6]];
  h += teil(T, arm, hautN, { weich: 0.7, mal: linien(T, [[[141.4, -43.6], [142.4, -40.2], [144, -38.4], [148.4, -38.4]]], LI, 1.2, 0.35) + linien(T, [[[143.6, -37], [147.8, -36.8]], [[144.6, -44], [145, -41]]], SC, 1, 0.4) + ell(144.8, -39.4, 0.8, 0.6, 0, SC, 0.4),
    mal2: F ? linien(T, [[[144.2, -39.4], [145.4, -38.6]]], SC, 0.2, 0.5) : "", weich2: 0.1 });
  h += teil(T, [[148.8, -38.6], [150.8, -38.2], [152.2, -37], [151.8, -36.2], [149.6, -36.8]], hautN, { mal: linien(T, [[[149.4, -38.2], [151.4, -37.6]]], LI, 0.5, 0.3), weich: 0.25 });
  h += teil(T, [[148.6, -37.2], [150.4, -36.4], [151, -35.2], [150.2, -35], [148.6, -36.2]], hautF, {});
  /* Schlagschatten des Arms auf der Brust */
  h += weichG(T, 0.8, [143, -38, 154, -32], ell(148, -35, 4, 1.2, 10, SC, 0.4));

  /* ---- nahes Bein: Z-Form, Ferse hoch, Mittelfuß steil, Zehen einzeln ---- */
  /* Zehe III (mittlere, längste) liegt hinter Zehe IV */
  const z3 = [[103.2, -3.6], [107, -3.2], [111, -2.4], [114.4, -1.6], [117, -1], [117.4, -0.3, 1], [111.4, -0.2], [108, -0.6], [105, -1.4]];
  h += teil(T, z3, hautF, { weich: 0.4, mal: linien(T, [[[104, -3], [110, -2.4], [116, -1.2]]], LI, 0.5, 0.22),
    oben: F ? reihe(T, [[104, -3.4], [108, -2.9], [112, -2], [116.4, -1]], 9, 1.6, "#120c06", 0.12, 0.4, -0.1) : "" });
  const bein = [[78, -56], [92, -59.6], [105, -58.6], [112.6, -52], [114.2, -45], [112.6, -37.6], [110.6, -31.6], [108.6, -26], [105.4, -18], [103.2, -12.6], [104, -8], [105.4, -4.4], [106.6, -3],
    [103, -1.2], [101.4, -1.6], [99.8, -4.8], [97.6, -9.6], [96.8, -12.6], [97.4, -16], [98.2, -22], [99.4, -27], [100, -31], [94, -36], [88, -42], [84, -50]];
  let bmal = ell(104, -44, 7, 9, 10, LI, 0.16) + linien(T, [[[111.6, -55], [113.4, -46], [112, -38.4]]], SC, 5, 0.42);
  bmal += linien(T, [[[100, -56], [103.4, -46], [106.4, -36]]], SC, 1.8, 0.3) + linien(T, [[[98.4, -55], [101.8, -46], [104.4, -37]]], LI, 1.4, 0.2);
  bmal += ell(108.4, -33.2, 2, 1.6, 0, LI, 0.25) + ell(103.4, -31, 4, 1.6, -10, SC, 0.4);
  bmal += linien(T, [[[100.4, -28], [99.4, -21]]], LI, 2.6, 0.3) + linien(T, [[[108.6, -27], [104.8, -15]]], SC, 2.2, 0.38);
  bmal += linien(T, [[[97.9, -20], [97.6, -13.4]]], LI, 0.9, 0.38) + linien(T, [[[99.6, -19.4], [99.2, -13]]], SC, 0.7, 0.32);
  bmal += linien(T, [[[98.4, -10], [101, -3]]], LI, 1.2, 0.28) + linien(T, [[[103.8, -11], [105.4, -4.6]]], SC, 1.4, 0.32) + ell(104, -1.6, 4, 1.4, 0, SC, 0.5);
  h += teil(T, bein, haut, { mal: bmal, weich: 1.5,
    mal2: (F ? linien(T, [[[100, -32], [104.4, -31.2], [109.4, -33]], [[99, -16], [102.6, -15.4]]], SC, 0.4, 0.4) : ""), weich2: 0.25,
    oben: F ? reihe(T, [[103.4, -12.6], [104.2, -8], [105.4, -4.4], [106.4, -3.2]], 8, 2.2, "#120c06", 0.14, 0.42, -2.2) + reihe(T, [[103.4, -12.4], [104.2, -8], [105.4, -4.4]], 8, -0.5, "#f4e4c0", 0.14, 0.3, -0.3) : "" });
  /* Zehe IV (vorn, nächste zum Betrachter) mit Ballen */
  const z4 = [[101.4, -3.4], [104.8, -3.6], [108.4, -2.8], [111.6, -1.8], [113.6, -1], [113.8, -0.3, 1], [110.6, -0.2], [109, -0.8], [107.4, -0.3], [105.4, -0.9], [103.6, -0.3], [101.6, -1]];
  h += teil(T, z4, hautN, { weich: 0.45, mal: linien(T, [[[102, -3.2], [108, -2.8], [113, -1.2]]], LI, 0.7, 0.28) + linien(T, [[[102, -0.6], [108, -0.6], [113, -0.4]]], SC, 0.8, 0.45),
    oben: F ? reihe(T, [[102, -3.4], [105, -3.4], [108.4, -2.8], [112, -1.6]], 9, 2, "#120c06", 0.12, 0.42, -0.1) : "" });

  /* ---- Kopf: Maulhöhle, Zähne, Unterkiefer (9° geöffnet), Schädel ---- */
  const scharnier = [175, -57.4];
  const kieferZu = [[173.4, -57.8], [176.8, -57.4], [180.2, -57.1], [185, -56.6], [190, -56.1], [194.6, -55.7], [195.8, -55.1], [195.6, -53.8], [193.6, -52.8], [189, -52.4], [184, -52.2], [179.4, -52], [176, -52.2], [173.6, -53.4], [172.6, -55.6]];
  const kiefer = drehe(kieferZu, scharnier[0], scharnier[1], 6.5);
  const kOben = drehe([[176.8, -57.4], [180.2, -57.1], [185, -56.6], [190, -56.1], [194.6, -55.7]], scharnier[0], scharnier[1], 6.5);
  const lippeO = [[176.8, -57.5], [180.2, -57.1], [185, -56.5], [190, -55.9], [194.8, -55.5]];
  /* Rachen: hinten schwarz, Zunge */
  h += teil(T, [[174.4, -57.6]].concat(lippeO, [[196, -55.3]], kOben.slice().reverse()), T.lg("rachen", [[0, "#050202"], [0.45, "#1c0907"], [1, "#3a1610"]], 0, 0, 1, 0), {
    innen: flaeche(T, drehe([[177.6, -56.2], [183, -55.4], [189, -55], [192, -55.2], [188, -55.8], [182, -56.6]], scharnier[0], scharnier[1], 6.5), "#6a3028", 0.85), mal: linien(T, [lippeO], "#000", 1.2, 0.5), weich: 0.4 });
  /* untere Zähne (Spitzen nach oben), Basis im Kiefer */
  h += zaehne(T, drehe([[180, -56.4, 1.1, 0.62], [182.4, -56.2, 1.3, 0.7], [184.8, -55.9, 1.45, 0.76], [187.2, -55.6, 1.5, 0.78], [189.6, -55.3, 1.45, 0.76], [192, -55.1, 1.3, 0.7], [194.2, -54.9, 1.05, 0.6]], scharnier[0], scharnier[1], 6.5).map((p, i) => [p[0], p[1] + 0.3, [1.1, 1.3, 1.45, 1.5, 1.45, 1.3, 1.05][i] * 1.05, [0.62, 0.7, 0.76, 0.78, 0.76, 0.7, 0.6][i], -0.2]), -1);
  let kj = fleckung(T, "fleckk", [170, -58, 198, -44], "#1a120a", 0.25, 0.3, 0.5);
  if (F) kj += platten(T, kiefer, 1.5, { opS: 0.32 }) + reihe(T, kOben, 14, 1.1, "#140e08", 0.14, 0.5, 0.25);
  h += teil(T, kiefer, haut, { innen: kj, weich: 0.9,
    mal: linien(T, [verschiebe(kOben, 0, 0.9)], RF, 1.2, 0.35) + linien(T, [drehe([[176, -52.8], [184, -52.6], [193.6, -53.4]], scharnier[0], scharnier[1], 6.5)], SC, 3.4, 0.55) + ell(174.6, -54.4, 2.4, 2.4, 0, SC, 0.45),
    oben: linien(T, [kOben], "#2a1c10", 0.4, 0.5) });
  /* obere Zähne: größte an Position 3–5, vorn klein; Basis steckt unter der Lippe (30–50 % verdeckt) */
  const oz = [[178.4, 0.9, 0.56], [180.6, 1.25, 0.66], [182.9, 1.7, 0.8], [185.3, 2.05, 0.9], [187.7, 2.2, 0.94], [190, 2, 0.88], [192.2, 1.6, 0.78], [194.2, 1.15, 0.64], [195.6, 0.8, 0.5]];
  h += zaehne(T, oz.map(([x, L, b]) => [x, -57.9 + (x - 176) * 0.11, L * 1.05, b * 1.05, 0.3]), 1, "o");
  const schaedel = [[171.6, -61.4], [172.4, -65.2], [174.6, -67.2], [177.2, -68], [179.6, -68.1], [181.8, -67.3], [183.8, -67.2], [186.4, -65.8], [189.6, -63.8], [192.6, -61.6], [195, -59.6], [196.4, -57.8], [196.6, -56.2],
    [195.6, -55.3], [190, -55.8], [185, -56.4], [180.2, -57], [176.8, -57.4], [174.2, -58.3], [172.4, -59.8]];
  let ks = fleckung(T, "fleckk", [170, -70, 198, -54], "#1a120a", 0.25, 0.3, 0.5);
  if (F) {
    /* Gesichtsschilde: groß auf der Schnauze, mittel um das Auge, Lippenschuppen-Reihe */
    ks += platten(T, [[184, -62.6], [188, -64.6], [192.6, -61.8], [196.2, -58.4], [196.4, -56.6], [193, -57.2], [186, -58.2]], 2.1, { opS: 0.38 });
    ks += platten(T, [[172, -61], [173.4, -66], [177, -67.6], [182, -67], [186, -65.4], [184, -62.6], [178, -60.4], [173, -59.4]], 1.5, { opS: 0.32 });
    ks += reihe(T, lippeO, 15, -1.3, "#140e08", 0.14, 0.5, 0.15);
  }
  /* Licht: Oberseite des Schädels hell, Kiefermuskel-Wulst hinter dem Auge, Antorbitalmulde, Schatten unter der Lippe */
  let km = linien(T, [[[172, -64.6], [175, -67.4], [180, -67.8], [186, -65.6], [192, -62], [196, -58.6]]], LI, 3, 0.36);
  km += ell(174.4, -61.6, 2.2, 3.2, 0, LI, 0.22) + linien(T, [[[172.6, -58.6], [175, -59], [177, -60.6]]], SC, 1.4, 0.4);
  km += ell(188.6, -60.6, 4.4, 1.6, -18, SC, 0.32) + linien(T, [[[177, -58.4], [186, -57.6], [195.6, -56.6]]], SC, 1.6, 0.42);
  km += linien(T, [verschiebe(lippeO, 0, -0.3)], RF, 0.9, 0.3);
  h += teil(T, schaedel, haut, { innen: ks, mal: km, weich: 0.8,
    oben: linien(T, [[[173.6, -58.6], [175.4, -61], [175.6, -64]]], SC, 0.4, F ? 0.3 : 0) });
  /* Tränenbein-Buckel vor/über dem Auge und Postorbital-Wulst – raue Knochenhöcker mit Schlagschatten nach rechts unten */
  const hoecker = [[[181.4, -67.2], [182.8, -68.1], [184.8, -68.3], [186.6, -67.3], [185.6, -66.6], [182.8, -66.6]], [[176, -67.6], [177.6, -68.6], [179.8, -68.7], [181, -68.1], [180.2, -67.2], [177.6, -67.1]]];
  h += weichG(T, 0.35, [176, -69, 187, -65], hoecker.map((p) => flaeche(T, verschiebe(p, 0.5, 0.6), SC, 0.45)).join(""));
  for (const p of hoecker) h += teil(T, p, T.lg("hoecker", [[0, "#5a4e3a"], [1, "#3e3426"]]), { innen: F ? platten(T, p, 0.7, { opS: 0.45 }) : "", mal: linien(T, [verschiebe(p.slice(0, 3), 0.2, 0.3)], LI, 0.6, 0.4), weich: 0.25 });
  /* Nasenloch: Oval in flacher Grube nahe der Schnauzenspitze */
  h += weichG(T, 0.3, [192, -61.4, 197, -58.6], ell(194.6, -59.8, 1.4, 0.7, -25, SC, 0.4)) + ell(194.7, -59.9, 0.75, 0.32, -25, "#1a1008", 0.9);

  let s = F ? `<g filter="${T.relief("haut", { f: 3, tiefe: 0.13, okt: 3 })}">${h}</g>` : h;
  s += augeHoehle(T, 179.6, -64.8, 1.05, { iris: "#d7a03a", iris2: "#6a3c12", offen: 0.62, lid: "#17120b", winkel: -4 });
  /* Krallen: Hand (2, Finger I größer), Zehen breit und stumpf, dunkles Horn */
  s += krallen(T, [[151.8, -36.8, 1.7, 0.6, 70, 0.6], [150.6, -35.4, 1.3, 0.5, 85, 0.6], [117, -0.8, 2.4, 1.15, 12, 0.3], [113.4, -0.8, 2.2, 1.1, 14, 0.3], [100.6, -0.8, 2, 1, 10, 0.3]]);
  return Object.assign(fertig(6.2, s, [-0.4, -69.2, 198.8, 0]), { fuesse: [97 * 6.2, 109 * 6.2], kopf: [170 * 6.2, -70 * 6.2, 199 * 6.2, -45 * 6.2] });
}

const ARTEN = [
  { id: "tyrannosaurus", de: "der Tyrannosaurus", syl: "Ty-ran-no-SAU-rus", it: "il tirannosauro", itSyl: "ti-ran-no-SAU-ro", en: "Tyrannosaurus rex",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 12.35, hoehe: 4.29, f: typeof tyrannosaurus === "function" && tyrannosaurus },
  { id: "velociraptor", de: "der Velociraptor", syl: "Ve-lo-ci-RAP-tor", it: "il velociraptor", itSyl: "ve-lo-ci-RAP-tor", en: "velociraptor",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 1.94, hoehe: 0.71, f: typeof velociraptor === "function" && velociraptor },
  { id: "spinosaurus", de: "der Spinosaurus", syl: "Spi-no-SAU-rus", it: "lo spinosauro", itSyl: "spi-no-SAU-ro", en: "Spinosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 13.9, hoehe: 4.9, f: typeof spinosaurus === "function" && spinosaurus },
  { id: "allosaurus", de: "der Allosaurus", syl: "Al-lo-SAU-rus", it: "l'allosauro", itSyl: "al-lo-SAU-ro", en: "Allosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 8.58, hoehe: 2.97, f: typeof allosaurus === "function" && allosaurus },
  /* Pteranodon: Flugsaurier, KEIN Dinosaurier (gruppe „Dinosaurier" nur für die Sortierung der Urzeit-Tiere; der Tipp sagt es) */
  { id: "pteranodon", de: "der Pteranodon", syl: "Pte-ra-NO-don", it: "lo pteranodonte", itSyl: "pte-ra-no-DON-te", en: "pteranodon",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 2.42, hoehe: 2.75, fliegt: true, f: typeof pteranodon === "function" && pteranodon,
    tipp: "Der Pteranodon ist kein Dinosaurier, sondern ein Flugsaurier. Er flog mit Flügeln aus Haut." },
];
module.exports = ARTEN.filter((a) => a.f).map(({ f, ...a }) => Object.assign(a, { zeichne: f }));
