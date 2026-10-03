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
/* glatte Kurve (Catmull-Rom) mit eigener Genauigkeit (GEN) und kompakter Schreibweise; [x, y, 1] = harte Ecke */
const zahlen = (arr) => arr.map((n) => R(n)).join(" ").replace(/ -/g, "-");
const glatt = (pts, zu = true) => {
  const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = "M" + zahlen([pts[0][0], pts[0][1]]);
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += "C" + zahlen([c1[0], c1[1], c2[0], c2[1], p2[0], p2[1]]);
  }
  return d + (zu ? "Z" : "");
};
const mehr = (T, arr) => arr.map((p) => glatt(p, false)).join("");
const linien = (T, arr, farbe, w, op) => `<path d="${mehr(T, arr)}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${OP(op)}" stroke-linecap="round" stroke-linejoin="round"/>`;
const flaeche = (T, pts, fill, op = 1) => `<path d="${typeof pts === "string" ? pts : glatt(pts)}" fill="${fill}"${op < 1 ? ` opacity="${OP(op)}"` : ""}/>`;
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
  /* in der Szene (klein) teilen sich alle Teile je Stärke EINEN Filter über die ganze Art (spart Bytes) */
  if (!T.fein && T._ganz) {
    T._wg = T._wg || {};
    s = s < 0.55 ? 0.4 : s < 1.2 ? 0.8 : s < 2 ? 1.5 : 2.4;
    if (!T._wg[s]) { const id = T.id("wg" + String(s).replace(".", "_")), g = T._ganz, m = s * 3; T.def(`<filter id="${id}" filterUnits="userSpaceOnUse" x="${R(g[0] - m)}" y="${R(g[1] - m)}" width="${R(g[2] - g[0] + 2 * m)}" height="${R(g[3] - g[1] + 2 * m)}"><feGaussianBlur stdDeviation="${s}"/></filter>`); T._wg[s] = `url(#${id})`; }
    return T._wg[s];
  }
  const id = T.id("w" + (T._w = (T._w || 0) + 1)), m = s * 3;
  T.def(`<filter id="${id}" filterUnits="userSpaceOnUse" x="${R(b[0] - m)}" y="${R(b[1] - m)}" width="${R(b[2] - b[0] + 2 * m)}" height="${R(b[3] - b[1] + 2 * m)}"><feGaussianBlur stdDeviation="${s}"/></filter>`);
  return `url(#${id})`;
};
/* Körperteil: Pfad EINMAL in defs; Füllung, dann geklippt: Innenzeichnung (scharf), Malschicht (weich), oben drauf
   scharfe Details (oben). Keine Umrisslinie (Kritik: „Aufkleber"); auf Wunsch nur einzelne Kanten (kante). */
const teil = (T, pts, fill, o = {}) => {
  if (o.klein && !T.fein) return flaeche(T, pts, fill);   /* kleine Teile in der Szene: nur Fläche */
  const d = typeof pts === "string" ? pts : glatt(pts);
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
/* Mehrere Teile mit EINER gemeinsamen Malschicht (Clip = Vereinigung): nahtlose Übergänge (Oberschenkel → Rumpf,
   Kopf → Hals). pfad() legt den Pfad an, fuell() füllt ihn, geklippt() malt über die Vereinigung mehrerer Pfade. */
const pfad = (T, pts) => {
  const id = T.id("q" + (T._n = (T._n || 0) + 1));
  T.def(`<path id="${id}" d="${typeof pts === "string" ? pts : glatt(pts)}"/>`);
  return id;
};
const fuell = (id, fill) => `<use href="#${id}" fill="${fill}"/>`;
const geklippt = (T, ids, inhalt) => {
  const id = T.id("u" + (T._n = (T._n || 0) + 1));
  T.def(`<clipPath id="${id}">${ids.map((i) => `<use href="#${i}"/>`).join("")}</clipPath>`);
  return inhalt ? `<g clip-path="url(#${id})">${inhalt}</g>` : "";
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
  GEN = F ? 10 : 2; T._ganz = [-1, -72, 200, 1];
  const haut = T.lg("haut", [[0, "#3a3224"], [0.18, "#4c4230"], [0.38, "#665840"], [0.52, "#806e50"], [0.62, "#8e7b5a"], [0.8, "#7a6a4e"], [1, "#5e523e"]], 0, -70, 0, 0, US);
  const hautF = T.lg("hautf", [[0, "#2e281d"], [0.4, "#3c3427"], [0.75, "#4a4030"], [1, "#3a3226"]], 0, -64, 0, 0, US);
  const LI = "#fff2d4", SC = "#12100a", RF = "#e2c79c";
  const fl = (b) => fleckung(T, "fleck", b, "#1a120a", 0.3);
  let h = "";

  /* ---- fernes Bein (Schritt nach hinten, Ferse hoch) ---- */
  const fb = [[86, -56], [100, -60], [105, -50], [104.4, -40], [102.6, -33], [99.6, -27], [95.6, -20.4], [92.6, -15], [93, -9.4], [94.4, -4.8], [97.2, -3], [100.6, -1.4], [101.2, -0.2, 1], [90.8, -0.2, 1], [89.8, -1.6],
    [88.2, -6], [86.8, -11], [86.6, -14.4], [87.8, -19.4], [90.6, -26], [93.6, -31.4], [88, -38], [83, -46]];
  h += teil(T, fb, hautF, { weich: 1.4, innen: fl([84, -60, 106, 0]),
    mal: linien(T, [[[88, -52], [98, -57], [103, -50]]], LI, 4, 0.16) + linien(T, [[[104, -46], [103, -38], [100, -30]], [[100, -26], [96, -18], [93.8, -10]]], SC, 2.6, 0.32) +
      linien(T, [[[89, -24], [88.4, -18]]], LI, 1.4, 0.16) + ell(95, -1.6, 6, 1.6, 0, SC, 0.5),
    oben: F ? reihe(T, [[93.4, -9], [94.6, -4.8], [97.2, -3], [100.4, -1.4]], 7, 1.1, "#120c06", 0.16, 0.45, -1) : "" });
  /* ---- ferner Arm ---- */
  h += teil(T, [[140.6, -42.6], [143.2, -41.6], [144.2, -39.2], [147.4, -38.4], [148.8, -37.2], [147, -36.2], [143.6, -36.4], [141.4, -38.6]], hautF, { klein: 1, mal: ell(146, -36.8, 3, 1, 0, SC, 0.4), weich: 0.6 });

  /* ---- Umrisse ---- */
  const oben = [[2, -48.9], [12, -49.9], [26, -51.9], [44, -55.6], [62, -58.6], [80, -61.2], [96, -62.6], [112, -61.6], [126, -59.6], [138, -57.8], [148, -58], [156, -60.4], [163, -62.6], [169, -63.6], [173, -63.4]];
  const bauch = [[105, -25.4], [112, -26.6], [122, -28.6], [134, -30.4], [144, -32.6], [150, -35.6], [156, -40.4], [162, -44.4], [168, -47.4], [174, -49.6]];
  const sUnten = [[4, -46.4], [14, -46.3], [30, -46.3], [46, -45.9], [62, -44.7], [74, -42.5], [84, -39.4]];
  const leib = [[-0.4, -47.4]].concat(oben, [[176, -60], [177.4, -52]], bauch.slice().reverse(), [[99, -28], [92, -34]], sUnten.slice().reverse(), [[0.6, -46.6]]);
  const bein = [[78, -56], [92, -59.6], [105, -58.6], [112.6, -52], [114.2, -45], [112.6, -37.6], [110.6, -31.6], [108.6, -26], [105.4, -18], [103.2, -12.6], [104, -8], [105.4, -4.4], [106.6, -3],
    [103, -1.2], [101.4, -1.6], [99.8, -4.8], [97.6, -9.6], [96.8, -12.6], [97.4, -16], [98.2, -22], [99.4, -27], [100, -31], [94, -36], [88, -42], [84, -50]];
  const scharnier = [175.2, -56.6], AUF = 5;
  const kieferZu = [[173.2, -57.2], [177, -56], [181, -55.5], [186, -55.2], [191, -55.3], [195, -55.5], [196.4, -55.2], [196.2, -53.4], [194.2, -52.2], [189, -51.6], [184, -51.4], [179.4, -51.2], [175.6, -51.6], [173.2, -53], [172.4, -55.4]];
  const kiefer = drehe(kieferZu, scharnier[0], scharnier[1], AUF);
  const kOben = drehe([[177, -56], [181, -55.5], [186, -55.2], [191, -55.3], [195, -55.5]], scharnier[0], scharnier[1], AUF);
  /* Oberlippe: unten leicht gewölbt (Oberkiefer), Mundwinkel nicht höher als vorn (kein „Lächeln") */
  const lippeO = [[176.6, -56.2], [181, -55.6], [186, -55.3], [191, -55.4], [195.2, -55.7]];
  const schaedel = [[171, -61.4], [171.8, -65.2], [174, -67.3], [176.8, -68.2], [179.6, -68.4], [182.2, -67.8], [184.6, -67.5], [187.6, -66.4], [191, -64.6], [194.2, -62.6], [196.8, -60.6], [198, -58.6], [198, -56.6],
    [196.6, -55.8], [195.2, -55.7], [191, -55.4], [186, -55.3], [181, -55.6], [176.6, -56.2], [174, -57.2], [172, -59.2]];

  /* ---- Füllungen in der richtigen Reihenfolge ---- */
  const iL = pfad(T, leib), iB = pfad(T, bein), iK = pfad(T, kiefer), iS = pfad(T, schaedel);
  h += fuell(iL, haut) + fuell(iB, haut);
  /* Rachen: hinten schwarz, Zunge */
  const rachen = [[176.2, -56.4]].concat(lippeO, [[196.6, -55.6]], kOben.slice().reverse());
  h += teil(T, rachen, T.lg("rachen", [[0, "#050202"], [0.5, "#1a0907"], [1, "#331410"]], 0, 0, 1, 0), {
    innen: flaeche(T, drehe([[178, -55.2], [183, -54.6], [189, -54.4], [192, -54.6], [188, -55.2], [182, -55.8]], scharnier[0], scharnier[1], AUF), "#5e2a22", 0.8) });
  /* untere Zähne (Spitzen nach oben), Basis im Kiefer */
  const uz = [[179.6, 1], [182, 1.2], [184.4, 1.35], [186.8, 1.4], [189.2, 1.35], [191.6, 1.2], [193.8, 1]];
  h += zaehne(T, drehe(uz.map(([x]) => [x, -55.2 - (x - 177) * 0.005]), scharnier[0], scharnier[1], AUF).map((p, i) => [p[0], p[1] + 0.25, uz[i][1], 0.55 + uz[i][1] * 0.12, -0.15]), -1);
  h += fuell(iK, haut);
  /* obere Zähne: größte an Position 3–5, vorn klein; Basis steckt unter der Lippe */
  const oz = [[178.6, 0.85, 0.56], [180.8, 1.15, 0.66], [183.1, 1.55, 0.78], [185.5, 1.85, 0.88], [187.9, 1.95, 0.9], [190.2, 1.75, 0.84], [192.4, 1.4, 0.74], [194.3, 1.05, 0.62], [195.7, 0.75, 0.5]];
  h += zaehne(T, oz.map(([x, L, b]) => [x, -55.9 + Math.abs(x - 187) * 0.012 - 0.5, L * 1.08 + 0.5, b, 0.3]), 1, "o");
  h += fuell(iS, haut);

  /* ---- gemeinsame Malschicht über Rumpf, Bein, Kiefer, Schädel (EIN Licht oben links) ---- */
  let inn = fl([0, -70, 199, 0]);
  let bd = "";
  for (const [x, w, hh] of [[16, 2, 3], [27, 2.4, 4], [39, 2.6, 5], [52, 3, 6.4], [66, 3.2, 7.6], [81, 3.4, 8.4], [118, 3.4, 9], [131, 3.2, 8], [143, 2.8, 6.4], [155, 2.4, 5]]) {
    const y = x < 96 ? -48.9 - (x / 96) * 13.7 : x < 148 ? -62.6 + (x - 96) * 0.1 : -58 - (x - 148) * 0.33;
    bd += `M${R(x - w / 2)} ${R(y - 1)}q${R(w * 0.9)} ${R(hh * 0.5)} ${R(w * 0.3)} ${hh}l${R(w * 0.45)} 0q${R(w * 0.9)} ${R(-hh * 0.55)} ${R(w * 0.25)} ${-hh}z`;
  }
  inn += `<path d="${bd}" fill="#22180e" opacity=".3"/>`;
  /* grob: Rückenlicht, Kernschatten im unteren Drittel, Bodenreflex, Okklusion; Oberschenkel als Muskelkante */
  let mal = linien(T, [verschiebe(oben.slice(0, 14), 0, 2)], LI, 5, 0.32);
  mal += linien(T, [verschiebe(bauch.slice(0, 8), 0, -6)], SC, 10, 0.55) + linien(T, [verschiebe(sUnten, 0, -2.6)], SC, 4.4, 0.44);
  mal += linien(T, [verschiebe(bauch, 0, 0.8)], RF, 2.4, 0.3) + linien(T, [verschiebe(sUnten, 0, 0.6)], RF, 1.4, 0.24);
  mal += ell(86, -45, 6, 4, 0, SC, 0.42) + ell(144, -37.6, 4.6, 3.4, 0, SC, 0.5) + ell(167, -45.6, 6, 2.6, 30, SC, 0.4);
  mal += linien(T, [[[150, -55], [158, -56.6], [166, -60.4]]], LI, 3, 0.2) + linien(T, [[[148, -48], [158, -50], [166, -54]]], SC, 1.6, 0.2) + linien(T, [[[136, -52], [142, -47], [143, -42]]], LI, 2.4, 0.14);
  /* Oberschenkel: Licht oben-hinten, Kernschatten vorn-unten, Kante zum Bauch (Okklusion), Knie, Wade, Schienbein */
  mal += ell(97, -51, 10, 6.4, -10, LI, 0.3) + linien(T, [[[111, -56], [113.2, -46], [111.4, -38], [106, -33]]], SC, 4.4, 0.44);
  mal += linien(T, [[[100, -56], [103.4, -46], [106.4, -37]]], SC, 1.8, 0.26) + linien(T, [[[98.4, -55], [101.8, -46], [104.4, -38]]], LI, 1.4, 0.18);
  mal += ell(103.4, -31, 4, 1.6, -10, SC, 0.38) + linien(T, [[[100.4, -28], [99.4, -21]]], LI, 2.6, 0.3) + linien(T, [[[108.6, -27], [104.8, -15]]], SC, 2.2, 0.36);
  mal += linien(T, [[[98.4, -10], [101, -3]]], LI, 1.2, 0.26) + linien(T, [[[103.8, -11], [105.4, -4.6]]], SC, 1.4, 0.3) + ell(104, -1.6, 4, 1.4, 0, SC, 0.5);
  /* fein: Kopf – Oberseite hell, Kiefermuskel hinter dem Auge, Antorbitalmulde, Schatten unter der Lippe und unter dem Kiefer */
  let malK = linien(T, [[[171.4, -64.6], [174.4, -67.4], [180, -67.9], [186, -66.4], [192, -63.2], [197, -59.4]]], LI, 3, 0.34);
  malK += ell(174.2, -61.6, 2.2, 3.4, 0, LI, 0.2) + linien(T, [[[172.4, -58.4], [175, -58.8], [177.4, -60.6]]], SC, 1.4, 0.36);
  malK += ell(189.2, -61, 4.6, 1.7, -18, SC, 0.3) + linien(T, [[[178, -57.4], [186, -56.6], [196, -56.6]]], SC, 1.4, 0.4) + linien(T, [verschiebe(lippeO, 0, -0.3)], RF, 0.9, 0.26);
  malK += linien(T, [drehe([[176, -52.2], [184, -52], [193.6, -52.8]], scharnier[0], scharnier[1], AUF)], SC, 3, 0.5) + linien(T, [verschiebe(kOben, 0, 0.9)], RF, 1.1, 0.3);
  malK += linien(T, [[[170, -50], [176, -50.4], [184, -50.4], [192, -51.6]]], SC, 2.2, 0.5) + ell(174.2, -54.4, 2.2, 2.2, 0, SC, 0.4);
  /* Falten: Halsbasis und Achsel (fein, mit Lichtgrat) */
  const falten = [[[157, -57], [158.4, -50], [157, -43]], [[146, -43.4], [147.4, -40.2], [147, -36.6]], [[100, -32], [104.4, -31.2], [109.4, -33]]];
  /* Kanten des Oberschenkels: vorn Falte zum Bauch, hinten Licht auf dem Muskel und Okklusion auf der Schwanzwurzel */
  let ok = linien(T, [[[113.6, -55], [115, -46], [113.2, -38], [111, -33]]], SC, 1.2, 0.5) + linien(T, [[[101.4, -29.4], [94, -34.6], [87.6, -40.6], [83.4, -49]]], SC, 1.6, 0.45) +
    linien(T, [[[100.4, -31.6], [94.6, -36], [89.4, -41], [86, -48.6]]], LI, 1.2, 0.3) + linien(T, [[[84, -57.4], [92, -59.4], [102, -59.2]]], LI, 1.2, 0.2);
  let fa = linien(T, falten, SC, 0.5, 0.3);
  if (F) fa += linien(T, falten.map((p) => verschiebe(p, -0.5, -0.4)), LI, 0.4, 0.18);
  h += geklippt(T, [iL, iB, iK, iS], inn + weichG(T, 2.4, [0, -70, 199, 0], mal) + weichG(T, 0.7, [168, -70, 199, -46], malK) + weichG(T, 0.25, [80, -60, 160, -30], fa) + weichG(T, 0.7, [80, -62, 118, -28], ok) +
    rueckenSchilde(T, oben.slice(1, 13), 60, 0.35, 0.95, "#3c3324"));

  /* ---- Einzelheiten je Teil (scharf) ---- */
  if (F) {
    h += geklippt(T, [iL], reihe(T, bauch.slice(0, 8), 20, -2.4, "#22180e", 0.16, 0.26) + reihe(T, sUnten, 34, -1.4, "#22180e", 0.12, 0.2) +
      schuppenFeld(T, [[136, -54], [150, -56.4], [160, -62], [168, -64.6], [170, -58], [164, -50], [154, -44], [144, -40], [136, -44]], 0.9, { opS: 0.2, opL: 0.09, dichte: 0.5 }));
    h += geklippt(T, [iB], reihe(T, [[103.4, -12.6], [104.2, -8], [105.4, -4.4], [106.4, -3.2]], 8, 2.2, "#120c06", 0.14, 0.42, -2.2) + reihe(T, [[103.4, -12.4], [104.2, -8], [105.4, -4.4]], 8, -0.5, "#f4e4c0", 0.14, 0.28, -0.3));
    h += geklippt(T, [iK], platten(T, kiefer, 1.6, { opS: 0.3 }) + reihe(T, kOben, 14, 1.1, "#140e08", 0.14, 0.45, 0.25));
    h += geklippt(T, [iS], platten(T, [[184, -62.6], [188.6, -65.4], [193, -62.6], [197.4, -59], [197.8, -56.6], [193, -56.6], [186, -57.6]], 2.2, { opS: 0.36 }) +
      platten(T, [[171.6, -61], [172.8, -66], [177, -67.8], [182, -67.4], [186.6, -66], [184, -62.6], [178, -60.4], [173, -59.4]], 1.5, { opS: 0.3 }) + reihe(T, lippeO, 15, -1.3, "#140e08", 0.14, 0.45, 0.15));
  }
  /* raue Knochenhöcker: Tränenbein-Buckel vor/über dem Auge, Postorbital-Wulst – flach, mit Schlagschatten nach rechts unten */
  const hoecker = [[[181.8, -67.6], [183.2, -68.5], [185.2, -68.6], [187, -67.5], [185.8, -66.9], [183, -66.9]], [[175.6, -67.8], [177.4, -68.9], [179.8, -69], [181, -68.3], [180.2, -67.4], [177.4, -67.3]]];
  h += weichG(T, 0.35, [175, -70, 188, -65], hoecker.map((p) => flaeche(T, verschiebe(p, 0.4, 0.6), SC, 0.4)).join(""));
  for (const p of hoecker) h += F ? teil(T, p, T.lg("hoecker", [[0, "#5a4e3a"], [1, "#3e3426"]]), { innen: platten(T, p, 0.7, { opS: 0.45 }), mal: linien(T, [verschiebe(p.slice(0, 3), 0.2, 0.3)], LI, 0.6, 0.35), weich: 0.25 }) : flaeche(T, p, "#4a4030");
  /* Nasenloch: Oval in flacher Grube nahe der Schnauzenspitze */
  h += weichG(T, 0.3, [193, -61.6, 198, -58.4], ell(195.4, -60, 1.4, 0.7, -25, SC, 0.4)) + ell(195.5, -60.1, 0.75, 0.32, -25, "#1a1008", 0.9);

  /* ---- naher Arm: Oberarm, Ellbogen ~90°, Unterarm, zwei Finger ---- */
  const arm = [[140.2, -45.2], [143.8, -45], [144.8, -41.4], [145.4, -39.6], [147.6, -39.4], [149.8, -38.6], [150, -37.2], [147.6, -36.6], [144.6, -36.4], [142.6, -37.2], [141.8, -39.8], [140.8, -42.6]];
  h += teil(T, arm, haut, { weich: 0.7, innen: fl([139, -46, 151, -35]),
    mal: linien(T, [[[141.4, -43.6], [142.4, -40.2], [144, -38.4], [148.4, -38.4]]], LI, 1.2, 0.3) + linien(T, [[[143.6, -37], [147.8, -36.8]], [[144.6, -44], [145, -41]]], SC, 1, 0.4) + ell(144.8, -39.4, 0.8, 0.6, 0, SC, 0.35) + ell(141, -44.6, 2, 1, 0, SC, 0.4) });
  h += teil(T, [[148.8, -38.6], [150.8, -38.2], [152.2, -37], [151.8, -36.2], [149.6, -36.8]], haut, { klein: 1, mal: linien(T, [[[149.4, -38.2], [151.4, -37.6]]], LI, 0.5, 0.26) + linien(T, [[[149.6, -36.8], [151.6, -36.4]]], SC, 0.5, 0.4), weich: 0.25 });
  h += teil(T, [[148.6, -37.2], [150.4, -36.4], [151, -35.2], [150.2, -35], [148.6, -36.2]], hautF, { klein: 1 });
  h += weichG(T, 0.8, [143, -38, 154, -32], ell(148, -35, 4, 1.2, 10, SC, 0.38));

  /* ---- Zehen: III (längste, dahinter) und IV (vorn) mit Ballen und Querschilden ---- */
  const z3 = [[103.2, -3.6], [107, -3.2], [111, -2.4], [114.4, -1.6], [117, -1], [117.4, -0.3, 1], [111.4, -0.2], [108, -0.6], [105, -1.4]];
  h += teil(T, z3, hautF, { klein: 1, weich: 0.4, mal: linien(T, [[[104, -3], [110, -2.4], [116, -1.2]]], LI, 0.5, 0.2),
    oben: F ? reihe(T, [[104, -3.4], [108, -2.9], [112, -2], [116.4, -1]], 9, 1.6, "#120c06", 0.12, 0.4, -0.1) : "" });
  const z4 = [[101.4, -3.4], [104.8, -3.6], [108.4, -2.8], [111.6, -1.8], [113.6, -1], [113.8, -0.3, 1], [110.6, -0.2], [109, -0.8], [107.4, -0.3], [105.4, -0.9], [103.6, -0.3], [101.6, -1]];
  h += teil(T, z4, "#6a5c46", { klein: 1, weich: 0.45, mal: linien(T, [[[102, -3.2], [108, -2.8], [113, -1.2]]], LI, 0.7, 0.24) + linien(T, [[[102, -0.6], [108, -0.6], [113, -0.4]]], SC, 0.8, 0.5),
    oben: F ? reihe(T, [[102, -3.4], [105, -3.4], [108.4, -2.8], [112, -1.6]], 9, 2, "#120c06", 0.12, 0.42, -0.1) : "" });

  let s = F ? `<g filter="${T.relief("haut", { f: 3, tiefe: 0.13, okt: 3 })}">${h}</g>` : h;
  s += augeHoehle(T, 179.4, -64.9, 1, { iris: "#c08a2c", iris2: "#5a3410", offen: 0.55, lid: "#17120b", winkel: -4 });
  /* Krallen: Hand (2, Finger I größer), Zehen breit und stumpf, dunkles Horn */
  s += krallen(T, [[151.8, -36.8, 1.7, 0.6, 70, 0.6], [150.6, -35.4, 1.3, 0.5, 85, 0.6], [117, -0.8, 2.4, 1.15, 12, 0.3], [113.4, -0.8, 2.2, 1.1, 14, 0.3], [100.6, -0.8, 2, 1, 10, 0.3]]);
  GEN = 10;
  return Object.assign(fertig(6.2, s, [-0.4, -69.2, 198.8, 0]), { fuesse: [97 * 6.2, 109 * 6.2], kopf: [169 * 6.2, -71 * 6.2, 200 * 6.2, -46 * 6.2] });
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
