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
    if (!T._wg[s]) { const id = T.id("wg" + String(s).replace(".", "_")), g = T._ganz, m = s * 3; T.def(`<filter id="${id}" filterUnits="userSpaceOnUse" x="${R(g[0] - m)}" y="${R(g[1] - m)}" width="${R(g[2] - g[0] + 2 * m)}" height="${R(g[3] - g[1] + 2 * m)}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${s}"/></filter>`); T._wg[s] = `url(#${id})`; }
    return T._wg[s];
  }
  const id = T.id("w" + (T._w = (T._w || 0) + 1)), m = s * 3;
  T.def(`<filter id="${id}" filterUnits="userSpaceOnUse" x="${R(b[0] - m)}" y="${R(b[1] - m)}" width="${R(b[2] - b[0] + 2 * m)}" height="${R(b[3] - b[1] + 2 * m)}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${s}"/></filter>`);
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
  s += weichG(T, R(r * 0.22) || 0.1, [x - r * 2, y - r * 2.2, x + r * 2, y], `<path d="M${R(x - r * 1.5)} ${R(y - r * 0.15)}Q${R(x - r * 0.2)} ${R(y - r * 0.5)} ${R(x + r * 1.5)} ${R(y - r * 0.3)}L${R(x + r * 1.5)} ${R(y - r * 1.2)}Q${R(x)} ${R(y - r * 1.6)} ${R(x - r * 1.5)} ${R(y - r * 1.05)}Z" fill="#0c0804" opacity=".55"/>`);
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
  const fl = (b) => fleckung(T, "fleck", b, "#17160c", 0.3);
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
    [103, -1.2], [101.4, -1.6], [99.8, -4.8], [97.6, -9.6], [96.8, -12.6], [97, -16.4], [97.4, -22], [98.2, -27], [99.6, -31], [94, -36], [88, -42], [84, -50]];
  const scharnier = [175.2, -56.6], AUF = 5;
  const kieferZu = [[173.2, -57.2], [177, -56], [181, -55.5], [186, -55.2], [191, -55.3], [195, -55.5], [196.4, -55.2], [196.2, -53.4], [194.2, -52.2], [189, -51.6], [184, -51.4], [179.4, -51.2], [175.6, -51.6], [173.2, -53], [172.4, -55.4]];
  const kiefer = drehe(kieferZu, scharnier[0], scharnier[1], AUF);
  const kOben = drehe([[177, -56], [181, -55.5], [186, -55.2], [191, -55.3], [195, -55.5]], scharnier[0], scharnier[1], AUF);
  /* Oberlippe: unten leicht gewölbt (Oberkiefer), Mundwinkel nicht höher als vorn (kein „Lächeln") */
  const lippeO = [[176.6, -56.2], [181, -55.6], [186, -55.3], [191, -55.4], [195.2, -55.7]];
  const schaedel = [[171, -61.4], [171.8, -65.2], [174, -67.3], [176.8, -68.2], [179.6, -68.4], [182.2, -67.8], [184.6, -67.5], [187.6, -66.4], [191, -64.6], [194.2, -62.6], [196.4, -61.2], [197.8, -59.8], [198.5, -57.8], [198.4, -56.2],
    [197.4, -55.7], [195.2, -55.7], [191, -55.4], [186, -55.3], [181, -55.6], [176.6, -56.2], [174, -57.2], [172, -59.2]];

  /* ---- Füllungen in der richtigen Reihenfolge ---- */
  const iL = pfad(T, leib), iB = pfad(T, bein), iK = pfad(T, kiefer), iS = pfad(T, schaedel);
  h += fuell(iL, haut) + fuell(iB, haut);
  /* Rachen: hinten schwarz, Zunge */
  const rachen = [[176.2, -56.4]].concat(lippeO, [[196.6, -55.6]], kOben.slice().reverse());
  h += teil(T, rachen, T.lg("rachen", [[0, "#050202"], [0.5, "#1a0907"], [1, "#331410"]], 0, 0, 1, 0), {
    innen: flaeche(T, drehe([[178, -55.2], [183, -54.6], [189, -54.4], [192, -54.6], [188, -55.2], [182, -55.8]], scharnier[0], scharnier[1], AUF), "#5e2a22", 0.8) });
  /* untere Zähne (Spitzen nach oben), Basis im Kiefer */
  const uz = [[180, 1], [182.8, 1.2], [185.6, 1.35], [188.4, 1.35], [191.2, 1.2], [193.8, 1]];
  h += zaehne(T, drehe(uz.map(([x]) => [x, -55.2 - (x - 177) * 0.005]), scharnier[0], scharnier[1], AUF).map((p, i) => [p[0], p[1] + 0.25, uz[i][1], 0.4 + uz[i][1] * 0.4, -0.15]), -1);
  h += fuell(iK, haut);
  /* obere Zähne: größte an Position 3–5, vorn klein; Basis steckt unter der Lippe */
  const oz = [[178.8, 0.9], [181.4, 1.3], [184.2, 1.75], [187, 2], [189.8, 1.85], [192.4, 1.45], [194.6, 1.05], [196.4, 0.75]];
  h += zaehne(T, oz.map(([x, L]) => [x, -55.9 + Math.abs(x - 187) * 0.012 - 0.5, L * 1.05 + 0.5, 0.45 + L * 0.42, 0.32]), 1, "o");
  h += fuell(iS, haut);

  /* ---- gemeinsame Malschicht über Rumpf, Bein, Kiefer, Schädel (EIN Licht oben links) ---- */
  let inn = fl([0, -70, 199, 0]);
  let bd = "";
  for (const [x, w, hh] of [[16, 2, 3], [27, 2.4, 4], [39, 2.6, 5], [52, 3, 6.4], [66, 3.2, 7.6], [81, 3.4, 8.4], [118, 3.4, 9], [131, 3.2, 8], [143, 2.8, 6.4], [155, 2.4, 5]]) {
    const y = x < 96 ? -48.9 - (x / 96) * 13.7 : x < 148 ? -62.6 + (x - 96) * 0.1 : -58 - (x - 148) * 0.33;
    bd += `M${R(x - w / 2)} ${R(y - 1)}q${R(w * 0.9)} ${R(hh * 0.5)} ${R(w * 0.3)} ${hh}l${R(w * 0.45)} 0q${R(w * 0.9)} ${R(-hh * 0.55)} ${R(w * 0.25)} ${-hh}z`;
  }
  inn += `<path d="${bd}" fill="#1c1a10" opacity=".3"/>`;
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
  malK += linien(T, [[[170, -50], [176, -50.4], [184, -50.4], [192, -51.6]]], SC, 2.2, 0.5) + ell(173.2, -53.6, 1.2, 1.6, 0, SC, 0.3);
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
  const hoecker = [[[181.6, -67.6], [183, -68.3, 1], [184.4, -68.9, 1], [185.6, -68.4], [187.2, -67.3, 1], [185.4, -66.9], [183, -67]], [[175.6, -67.8], [177.4, -68.9], [179.8, -69], [181, -68.3], [180.2, -67.4], [177.4, -67.3]]];
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

/* =====================================================================
   VELOCIRAPTOR
   RECHERCHE: Velociraptor mongoliensis (Kreide, 75–71 Mio. J., Mongolei). Erwachsen bis ~2 m lang (davon ~1 m
   Schwanz), Hüfthöhe ~0,5 m, bis 15 kg – truthahngroß, NICHT menschengroß wie im Film. Gefiedert: Federkiel-Höcker
   an der Elle (Turner et al. 2007) → große Armschwingen; Körper mit Konturfedern, Schwanz mit Steuerfedern
   (Fächer am Schwanzende). Schädel ~25 cm, lang und niedrig, Oberkante leicht konkav, Schnauze leicht aufgebogen,
   große Augenhöhle; ~13 obere / ~14 untere gekrümmte Zähne (von Lippen weitgehend bedeckt). Schwanzwurzel kräftig,
   Schwanz durch verknöcherte Wirbelfortsätze steif und waagerecht. Hände: drei schlanke Finger (der zweite am
   längsten) mit großen, stark gebogenen Krallen, gefaltet wie ein Vogelflügel, Handflächen nach innen.
   Beine: Schienbein (~23 cm) länger als Oberschenkel (~16 cm), Mittelfuß kurz; zweite Zehe mit ~6,5 cm
   Sichelkralle, beim Gehen hochgehalten – er läuft auf den Zehen III und IV. Mittelfuß und Zehen beschuppt.
   Farbe unbekannt → wie ein Bodenvogel der Steppe: braun mit dunkler Bänderung, Bauch hell, dunkler Augenstreif.
   Zeichenraum: 1 Einheit = 1 cm.
   ===================================================================== */
function velociraptor(T) {
  const F = T.fein, US = ' gradientUnits="userSpaceOnUse"';
  GEN = F ? 10 : 2; T._ganz = [-12, -68, 188, 1];
  const kleid = T.lg("kleid", [[0, "#3e2e1f"], [0.28, "#56412d"], [0.52, "#735940"], [0.74, "#9a7f5e"], [0.88, "#b39c78"], [1, "#9a8262"]], 0, -64, 0, -28, US);
  const kleidF = T.lg("kleidf", [[0, "#4a3828"], [0.5, "#5a4632"], [1, "#4a3a2a"]], 0, -56, 0, 0, US);
  const haut = T.lg("rhaut", [[0, "#6a5e50"], [1, "#433a30"]]);
  const LI = "#fff0d0", SC = "#140e08", RF = "#e8d2a8", DK = "#2a1d12";
  /* Federstriche: wenige, kontrastarm (−50 %), Wuchs nach hinten-unten */
  const fed = [["#2a1d12", 0.8, 0.2, 0.22], ["#9a7c5a", 1, 0.18, 0.24], ["#f0e0bc", 0.35, 0.14, 0.26]];
  let h = "";

  /* ---- fernes Bein: gleiche Z-Form, Schritt nach hinten, 25–30 % dunkler ---- */
  const fb = [[100, -42], [107, -43], [110.6, -37], [111, -31], [107, -24], [101.6, -17], [98.6, -12.4], [98.4, -7.6], [99.6, -3], [103, -1.6], [105.8, -0.6], [106, -0.2, 1], [96.6, -0.2, 1], [95.6, -1.6],
    [94.2, -6], [93.6, -10.4], [95.6, -15.4], [100.6, -23], [104.4, -30], [104.6, -36], [103, -40]];
  h += teil(T, fb, kleidF, { weich: 0.9, innen: federn(T, fb.slice(0, 7).concat([[100.6, -23], [104.4, -30], [104.6, -36], [103, -40]]), 40, 120, 2.2, fed),
    mal: linien(T, [[[109, -40], [106, -30], [100, -20]]], SC, 2.4, 0.35) + linien(T, [[[100, -44], [104, -40]]], LI, 2, 0.15) + ell(100.6, -1.6, 4, 1.2, 0, SC, 0.5),
    oben: F ? reihe(T, [[97.8, -9], [98.4, -5], [100, -2.6], [104, -1.2]], 8, 0.9, "#120c06", 0.12, 0.45, -0.8) : "" });
  /* ferner Flügel angedeutet */
  h += teil(T, [[136, -43], [141, -40], [141.6, -36], [130, -36.4], [118, -38.4], [126, -41.6]], kleidF, { klein: 1 });

  /* ---- Umrisse ---- */
  const ruecken = [[82, -49.6], [94, -50.2], [106, -50.8], [120, -50.2], [134, -48.8], [142, -48.6], [148, -50.4], [152, -53.2], [155.4, -56.2], [158.6, -58.8], [161.6, -60.6]];
  const unten = [[161.6, -53.4], [158.4, -50.6], [155.2, -46.8], [152, -42.6], [148.8, -38.8], [144, -35], [136, -31.8], [124, -31], [114, -33.2], [106, -36.6], [98, -40.6], [90, -42.4], [82, -44]];
  const leib = ruecken.concat([[163.6, -59.6], [164, -56]], unten);
  /* Schwanz: Wurzel kräftig (7–8 cm), gleichmäßig verjüngt */
  const sOben = [[96, -50.2], [86, -49.8], [80, -49.4], [62, -49.6], [44, -49.8], [26, -49.8], [10, -49.5], [1, -49.1]];
  const sUnten = [[0.6, -48.3], [10, -47.9], [26, -47.4], [44, -46.6], [62, -45.4], [80, -43.2], [92, -41.4]];
  const schwanz = sOben.concat(sUnten);
  /* Fächer aus Steuerfedern: lanzettlich, Breite −30 %, Spitze rund */
  const steuer = [], fo = [], fu = [];
  /* Federn entlang des GANZEN Schwanzes: an der Wurzel kurz und anliegend, zum Ende länger und gespreizt */
  for (let i = 0; i < 14; i++) {
    const t = i / 13, x = 86 - t * 80, L = 5 + t * 12, sp = 0.2 + 4 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + t * 0.78)), 1.6), sx = x - L * 0.95;
    const yo = -49.6 + t * 0.4, yu = -46 - t * 1.6 + (1 - t) * 0;
    const so = yo - sp, su = yu + sp * 0.9;
    steuer.push([x, yo + 0.4, sx, so, 2.2 + t * 1.4, 1], [x, yu - 0.4, sx, su, 2.2 + t * 1.4, -1]);
    fo.push([sx, so - 0.6]); fu.push([sx, su + 0.6]);
  }
  steuer.push([8, -48.4, -7.6, -48.6, 3.8, 1]);
  const faecher = [[88, -50]].concat(fo, [[-8.6, -48.4]], fu.slice().reverse(), [[90, -41.8]]);
  const kopf = [[158.2, -57.4], [158.8, -60.8], [161.4, -62.6], [164.6, -62.9], [167.2, -62], [170.4, -61.1], [173.8, -60.8], [176.8, -60.7], [179, -60.2], [180.4, -59.2], [180.7, -58.1], [179.8, -57.3, 1],
    [176, -57.1], [170, -56.9], [165, -56.7], [162.4, -56.5], [159.6, -56.2]];
  const kiefer = [[159.6, -56.5], [164, -56.8], [170, -57], [176, -57.2], [179.4, -57.4], [180, -56.6], [177.6, -55.6], [170, -54.6], [164, -53.8], [161, -53.4], [159.2, -54.4]];
  const ob = [[92, -46], [102, -50], [112, -47.6], [116, -40.6], [115, -33], [111.6, -27.6], [108, -26.8], [104, -30.6], [98, -36], [93, -41]];
  /* Unterschenkel lang (Schienbein), schräg zurück; Federhose bis kurz über das Fersengelenk */
  const un = [[109, -32], [114.6, -30.4], [112, -23], [107.6, -16], [104.6, -11.4], [100.4, -10.6], [99.6, -13.4], [103, -20], [106, -27]];
  /* Mittelfuß schräg nach vorn, Zehen III/IV am Boden */
  const mf = [[100.2, -12.4], [104.8, -12.2], [105.6, -8], [107, -4.6], [109, -2.8], [107.6, -1.2], [104.4, -1.6], [102.8, -4.4], [101, -8.4]];

  const iL = pfad(T, leib), iS = pfad(T, schwanz), iF = pfad(T, faecher), iK = pfad(T, kiefer), iH = pfad(T, kopf), iO = pfad(T, ob), iU = pfad(T, un);
  /* Fächer zuerst (liegt seitlich am Schwanz), Federn einzeln */
  h += fuell(iF, T.lg("wedel", [[0, "#6a5038"], [0.5, "#58432f"], [1, "#46352a"]]));
  const stG = T.lg("steuer", [[0, "#6e5440"], [1, "#4c3a2a"]]);
  if (F) for (const [bx, by, sx, sy, b, sd] of steuer) h += feder(T, bx, by, sx, sy, b, stG, { seite: sd, schaft: "#b8a27c", dichte: 0.16, rand: false });
  else h += linien(T, steuer.filter((_, i) => i % 2 === 0).map(([bx, by, sx, sy]) => [[bx, by], [sx, sy]]), "#140d07", 0.3, 0.4);
  h += fuell(iS, kleid) + fuell(iL, kleid);

  /* ---- gemeinsame Malschicht über Schwanz, Fächer, Rumpf; Bänderung deckungsgleich über Schwanz und Fächer ---- */
  let bd = "";
  for (const [x, w] of [[2, 3.2], [14, 3.4], [26, 3.6], [38, 3.8], [50, 4], [62, 4.2], [74, 4.4]]) bd += `M${x} -60l3 22h${w}l-3-22z`;
  let inn = `<path d="${bd}" fill="${DK}" opacity=".5"/>`;
  inn += federn(T, leib, 150, (x, y) => x > 146 ? 150 + (x - 146) * 0.6 : 182 - Math.max(0, y + 46) * 1.3, 2, fed, { szene: 0.08 });
  inn += weichG(T, 0.12, [96, -60, 162, -34], federkanten(T, [[98, -49.4], [134, -48], [144, -47.4], [148, -46], [146, -40], [136, -37], [112, -38], [98, -42]], 2.8, (x, y) => 186 - Math.max(0, y + 46) * 1.5, { dichte: 0.85, opS: 0.26, opL: 0.18, w: 0.07 }) +
    federkanten(T, [[146, -48.2], [150, -50.4], [156, -55.6], [160, -58.6], [158, -52], [153, -46], [148, -40]], 1.5, 148, { dichte: 0.8, opS: 0.16, opL: 0.12, w: 0.07 }));
  /* dunkler Sattel, heller Bauch */
  let mal = linien(T, [[[96, -48], [110, -49.2], [126, -48.4], [140, -47]]], DK, 4, 0.3);
  mal += linien(T, [verschiebe(ruecken, 0, 1.4)], LI, 2.6, 0.3) + linien(T, [verschiebe(sOben.slice(0, 6), 0, 1)], LI, 1.4, 0.24);
  mal += linien(T, [verschiebe(unten.slice(3, 11), 0, -4)], SC, 6, 0.42) + linien(T, [verschiebe(sUnten.slice(2), 0, -1.2)], SC, 2, 0.32);
  mal += linien(T, [verschiebe(unten.slice(4, 10), 0, 0.6)], RF, 1.6, 0.35);
  mal += ell(147, -40.4, 3, 3, 0, SC, 0.4) + ell(158.6, -53.4, 3, 1.6, 30, SC, 0.4) + ell(97, -43, 4, 3, 0, SC, 0.35);
  h += geklippt(T, [iS, iF, iL], inn + weichG(T, 1.4, [-10, -64, 166, -28], mal));

  /* ---- Kopf: Unterkiefer in Hautfarbe, Zähne, Schädel; Übergang zum Hals weich ---- */
  const uz = [];
  for (let i = 0; i < 14; i++) { const x = 165.4 + i * 1.0, s = 0.32 + 0.16 * Math.sin(Math.PI * (i + 2) / 16); uz.push([x, -56.6 - (x - 164) * 0.022, s, s * 0.7, -0.2]); }
  if (F) h += zaehne(T, uz.filter((_, i) => i % 2), -1);
  h += fuell(iK, kleid);
  const oz = [];
  for (let i = 0; i < 13; i++) { const x = 165.6 + i * 1.08, s = 0.34 + 0.2 * Math.sin(Math.PI * (i + 2) / 15); oz.push([x, -57.25 - (x - 164) * 0.016, s + 0.22, s * 0.7, 0.3]); }
  h += F ? zaehne(T, oz, 1) : "";
  h += fuell(iH, kleid);
  let ki = federn(T, [[158.2, -57.4], [158.8, -60.6], [161.4, -62.4], [164.6, -62.7], [167.2, -61.8], [168, -58.4], [164, -57], [159.6, -56.4]], 60, 182, 1.2, fed);
  /* Schnauze: Schuppen, die der Kopfform folgen, zur Lippe größer; Lippenschuppen */
  if (F) ki += schuppenFeld(T, [[167.4, -61.6], [174, -60.6], [179, -60], [180.6, -58.4], [179.6, -57.8], [174, -58.2], [168, -58.4]], 0.55, { opS: 0.3, opL: 0.14, dy: 0.8 }) +
    schuppenFeld(T, [[166, -58], [179.6, -58], [179.6, -57.4], [166, -57.2]], 0.8, { opS: 0.32, opL: 0.14 }) +
    reihe(T, [[164, -56.8], [170, -57], [176, -57.2], [179.6, -57.4]], 16, -0.5, "#140e08", 0.05, 0.3);
  /* Augenstreif: dunkel vom Nasenloch über das Auge zum Hinterkopf, darüber helle Braue */
  ki += `<path d="M159 -59.4q3.4-1.3 7-1.2q3.8.1 6.4.7q-3.4.5-6.4.2q-3.6.1-7 1.2z" fill="${DK}" opacity=".45"/>`;
  let km = linien(T, [[[159.2, -60.6], [161.6, -62.2], [165, -62.4], [170, -60.6], [177, -60], [181, -59]]], LI, 1.2, 0.35) + linien(T, [[[160, -54.4], [168, -55], [178, -56.2]]], SC, 1.4, 0.45);
  km += linien(T, [[[162, -56.8], [170, -57.2], [180, -57.6]]], SC, 0.6, 0.35) + ell(160, -55.4, 2.4, 2, 0, SC, 0.25);
  h += geklippt(T, [iH, iK], ki + weichG(T, 0.5, [156, -64, 183, -52], km));

  /* ---- Beine: Oberschenkel nach vorn-unten (Knie vor der Hüfte), langes Schienbein schräg zurück, Ferse, Mittelfuß nach vorn ---- */
  /* Zehe III (dahinter), Mittelfuß, Zehe IV, zweite Zehe hochgeklappt mit Sichelkralle */
  const z3 = [[105.6, -2.8], [108.6, -2.4], [111.6, -1.4], [113.6, -0.8], [113.8, -0.2, 1], [109, -0.2], [106.6, -0.8]];
  h += teil(T, z3, "#4a4036", { klein: 1, oben: F ? reihe(T, [[106, -2.6], [109, -2.2], [112.6, -1.2]], 7, 1.3, "#0e0a06", 0.08, 0.5, -0.05) : "" });
  h += teil(T, mf, haut, { weich: 0.4, mal: linien(T, [[[101.4, -11], [103, -5.6], [105.4, -2.2]]], LI, 0.8, 0.3) + linien(T, [[[104.8, -11], [106.4, -5]]], SC, 0.8, 0.35),
    oben: F ? reihe(T, [[104.6, -11.8], [105.4, -8], [106.8, -4.6], [108.4, -3]], 10, 2.2, "#0e0a06", 0.08, 0.45, -2.2) + reihe(T, [[104.6, -11.8], [105.4, -8], [106.8, -4.6]], 10, -0.4, "#f2e2c0", 0.08, 0.3, -0.25) : "" });
  const z4 = [[103.8, -2.6], [107, -2.4], [110, -1.6], [112, -0.8], [112, -0.2, 1], [108.4, -0.2], [107, -0.7], [105.6, -0.2], [104, -0.8]];
  h += teil(T, z4, haut, { weich: 0.3, mal: linien(T, [[[104.6, -0.5], [111, -0.4]]], SC, 0.5, 0.5) + linien(T, [[[104.4, -2.3], [110, -1.8]]], LI, 0.4, 0.3),
    oben: F ? reihe(T, [[104.4, -2.5], [107, -2.3], [110, -1.5]], 7, 1.6, "#0e0a06", 0.08, 0.5, -0.05) : "" });
  const z2 = [[104.6, -3.4], [106.6, -5.2], [108.6, -6.4], [110, -6.4], [110, -5.2], [108.2, -4.2], [106.2, -2.6]];
  h += teil(T, z2, haut, { weich: 0.3, mal: linien(T, [[[105.4, -4.2], [108.4, -6]]], LI, 0.4, 0.35), oben: F ? reihe(T, [[105.2, -3.8], [107.4, -5.4], [109.6, -6.2]], 4, 1.4, "#0e0a06", 0.08, 0.5, -0.6) : "" });
  /* Unterschenkel und Oberschenkel mit gemeinsamer Malschicht (Federhose), Fersengelenk sichtbar */
  h += fuell(iU, kleid) + fuell(iO, kleid);
  let bm = linien(T, [[[95, -45], [103, -48.6], [110, -46]]], LI, 3, 0.28) + linien(T, [[[114.6, -44], [114, -36], [110.6, -29]]], SC, 3.4, 0.42) + ell(108, -31, 3, 2, 0, SC, 0.35);
  bm += linien(T, [[[106.6, -27], [102.6, -20]]], LI, 1.6, 0.28) + linien(T, [[[113, -27], [108, -17]]], SC, 2, 0.38) + ell(103, -11.4, 3, 1.2, 0, SC, 0.4);
  h += geklippt(T, [iO, iU], federn(T, ob, 70, (x, y) => 100 + (x - 98) * 0.9, 2.2, fed) + federn(T, un, 60, 104, 2, fed) +
    weichG(T, 0.12, [90, -52, 118, -26], federkanten(T, ob, 2.6, 110, { dichte: 0.75, opS: 0.2, opL: 0.14, w: 0.07 })) + weichG(T, 1, [90, -52, 118, -9], bm));
  /* Federsaum der Hose am Fersengelenk (Ferse frei) */
  h += federn(T, [[99.6, -14.4], [105.6, -13.2], [105.2, -11.4], [100.4, -11.2]], 20, 100, 1.6, [["#4a3826", 1, 0.18, 0.7]], { szene: 0.5 });

  /* ---- gefalteter Flügel: schmal am Unterarm, Schwungfedern gestaffelt nach hinten; Hand vorn mit drei Krallenfingern ---- */
  const fl = [[136, -42.6], [142.4, -40.4], [148.6, -36.8], [149.2, -33.8], [144, -33], [136, -33.4], [126, -34.4], [118, -36.6], [124, -38.6], [130, -40.6]];
  let fi = federn(T, [[136, -42], [142, -40], [148, -36.6], [147, -35.4], [138, -37.6], [132, -40]], 50, 185, 1.6, fed);
  /* gestaffelte Federspitzen und Fahnenkanten */
  let fs = "", fk = "";
  for (let i = 0; i < 9; i++) {
    const t = i / 8, x0 = 147 - t * 9, y0 = -35.2 - t * 4.4, xe = 118.6 + t * 6 + (i % 2) * 1.2, ye = -36.6 - t * 2.6;
    fk += `M${R(x0)} ${R(y0)}Q${R((x0 + xe) / 2)} ${R((y0 + ye) / 2 + 0.8)} ${R(xe)} ${R(ye)}`;
    fs += `M${R(xe + 2.6)} ${R(ye + 0.9)}q-1.4.3-2.6-.9`;
  }
  if (F) fi += `<path d="${fk}" fill="none" stroke="#120c06" stroke-width=".18" stroke-opacity=".45"/><path d="${fk.replace(/M(\S+) (\S+)Q/g, (m, a, b) => `M${a} ${R(+b - 0.25)}Q`)}" fill="none" stroke="#e8d4ae" stroke-width=".12" stroke-opacity=".3"/>`;
  fi += `<path d="${fs}" fill="none" stroke="#120c06" stroke-width=".2" stroke-opacity=".5"/>`;
  fi += `<path d="M129 -44l-1.6 12h2.4l1.6-12zM122 -42l-1.6 10h2.4l1.6-10z" fill="${DK}" opacity=".45"/>`;
  h += teil(T, fl, T.lg("schwinge", [[0, "#5a4430"], [0.6, "#463424"], [1, "#33261a"]]), { innen: fi, weich: 0.8,
    mal: linien(T, [[[132, -40.6], [140, -39.6], [147, -36.4]]], LI, 1.4, 0.3) + linien(T, [[[122, -35], [136, -34], [148, -34]]], SC, 1.6, 0.4) });
  h += weichG(T, 0.8, [116, -36, 150, -29], linien(T, [[[120, -34.4], [134, -32.6], [146, -32]]], SC, 1.2, 0.4));
  /* Finger: lang und schlank, der zweite am längsten, Handflächen nach innen */
  for (const p of [[[146.6, -35.6], [150.6, -34.8], [154.2, -33.8], [154.6, -33], [150.6, -33.6], [146.6, -34.2]], [[146.4, -34.6], [151, -33], [155.6, -31.4], [155.8, -30.6], [151, -31.8], [146.4, -33.4]], [[146.2, -33.6], [150.4, -31.6], [153.6, -29.8], [153.4, -29], [149.8, -30.6], [146, -32.4]]])
    h += teil(T, p, haut, { klein: 1, weich: 0.2, mal: linien(T, [p.slice(0, 3)], LI, 0.3, 0.35) });

  let s = h;
  s += augeHoehle(T, 164.4, -59.9, 1.2, { iris: "#d3a03a", iris2: "#6a3a10", offen: 0.7, lid: "#140c06", winkel: -3 });
  s += `<path d="M178.4 -59.2c.6-.4 1.4-.3 1.6.2c-.5.1-1 .1-1.6-.2z" fill="#0d0905"/>`;
  /* Krallen: Hand (groß, stark gebogen), Sichelkralle (dick, seitlich flach, Glanzkante), Zehen III/IV, ferner Fuß */
  s += krallen(T, [[154.2, -33.4, 3, 1, 70, 0.9], [155.4, -30.8, 3.4, 1.05, 75, 0.9], [153.2, -29.4, 2.6, 0.9, 85, 0.9],
    [109.6, -6, 6.4, 2.1, -52, 0.95], [113.4, -0.6, 1.8, 0.75, 15, 0.4], [111.6, -0.6, 1.6, 0.7, 15, 0.4], [105.6, -0.6, 1.5, 0.6, 15, 0.4], [96.4, -3, 3.6, 1.3, -50, 0.9]]);
  GEN = 10;
  return Object.assign(fertig(1, s, [-8.8, -63, 180.8, 0]), { fuesse: [99, 108], kopf: [154, -65, 184, -51] });
}

/* =====================================================================
   SPINOSAURUS
   RECHERCHE: Spinosaurus aegyptiacus (Kreide, ~99–93 Mio. J., Nordafrika). Größter bekannter Raubsaurier:
   ~14–15 m lang, ~7 t. Rückensegel aus Dornfortsätzen bis 1,65 m Höhe, am höchsten über Rumpfmitte/Hüfte; die Dornen
   stehen unregelmäßig und neigen sich leicht nach hinten. Ibrahim et al. 2020 (Nature): Schwanz mit hohen, dünnen
   Dornen oben und tiefen Chevrons unten – bis weit nach hinten tief, ein flexibles Ruder („Paddelschwanz") wie bei
   Molch/Aal. Kurze, kräftige Hinterbeine mit langen, breiten, flachen Zehen (Waten), langer Rumpf, langer S-Hals.
   Schädel lang und flach wie beim Krokodil, Maullinie S-förmig mit Kerbe hinter der verbreiterten Schnauzenspitze
   („Rosette"); kegelförmige Zähne, vorn 2–3× länger, greifen ineinander. Nasenlöcher weit nach hinten verlegt,
   flacher Kamm vor den Augen. Arme kräftig, große Daumenkralle (Fischfang). Haltung: zweibeinig an Land (Sereno
   2022). Farbe unbekannt → grau-braun wie ein Krokodil, Bauch heller, Segel rostbraun mit dunklen Dornenstreifen.
   Zeichenraum: 1 Einheit = 7,8 cm (178 Einheiten ≈ 13,9 m).
   ===================================================================== */
function spinosaurus(T) {
  const F = T.fein, US = ' gradientUnits="userSpaceOnUse"';
  GEN = F ? 10 : 2; T._ganz = [-1, -64, 179, 1];
  const haut = T.lg("haut", [[0, "#3c3628"], [0.3, "#4f4836"], [0.5, "#655b44"], [0.64, "#7d7055"], [0.78, "#8e8062"], [1, "#5e5440"]], 0, -56, 0, 0, US);
  const hautF = T.lg("hautf", [[0, "#3c3529"], [0.5, "#4a4232"], [1, "#3e3729"]], 0, -46, 0, 0, US);
  const segelF = T.lg("segel", [[0, "#6a3620"], [0.35, "#8a4c2c"], [0.7, "#6e4a32"], [1, "#4e4434"]], 0, -64, 0, -38, US);
  const LI = "#fff0d0", SC = "#100f0a", RF = "#dccaa0";
  const fl = (b) => fleckung(T, "fleck", b, "#16140c", 0.26, 0.12, 0.28);
  let h = "";

  /* ---- ferne Beine (60 % Helligkeit, Form sichtbar) ---- */
  const fb = [[72, -32], [84, -34], [88, -27], [86.6, -20], [82.6, -14.6], [78, -9.6], [77.6, -5.6], [79.6, -2.6], [84, -1.4], [88.4, -0.6], [88.8, -0.2, 1], [74.6, -0.2, 1], [73.8, -1.8], [73.2, -5.4], [73.4, -9.6], [76.8, -15], [80, -20.4], [77.6, -26]];
  h += teil(T, fb, hautF, { weich: 1, innen: fl([70, -36, 90, 0]), mal: linien(T, [[[86, -27], [83, -18], [78, -11]]], SC, 2.4, 0.35) + linien(T, [[[76, -28], [80, -32]]], LI, 1.6, 0.16) + ell(81, -1.2, 6, 1.2, 0, SC, 0.45) });
  h += teil(T, [[124.6, -27], [128.4, -25.6], [128.2, -21], [131.6, -17.8], [133.6, -16.6], [132.4, -15.6], [128.6, -16.8], [125.4, -20], [123.8, -24]], hautF, { klein: 1 });

  /* ---- Segel: Dornen unregelmäßig, nach hinten geneigt, Haut dazwischen eingesunken (wellige Kante) ---- */
  const dornen = [];
  for (let i = 0; i < 20; i++) {
    const t = i / 19, x = 127 - t * 49 + (T.rnd() - 0.5) * 1.2;
    const top = -41.4 - 21.4 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.06 + t * 0.92)), 0.9) * (0.94 + T.rnd() * 0.1) - (t > 0.8 ? (t - 0.8) * 20 : 0);
    dornen.push([x, top]);
  }
  const segelKante = [];
  dornen.forEach(([x, y], i) => { const n = dornen[i + 1]; segelKante.push([x - 1.2, y]); if (n) segelKante.push([(x + n[0]) / 2 - 1.2, (y + n[1]) / 2 + 0.45 + T.rnd() * 0.4]); });
  const segel = [[128, -40.6]].concat(segelKante, [[76, -44], [74, -40], [100, -38.6]]);
  let si = "";
  let dD = "", dL = "";
  for (const [x, y] of dornen) { dD += `M${R(x + 0.4)} -38.6L${R(x - 1.1)} ${R(y + 0.6)}`; dL += `M${R(x - 0.3)} -38.6L${R(x - 1.8)} ${R(y + 0.6)}`; }
  si += `<path d="${dL}" stroke="#f0caa0" stroke-width=".4" stroke-opacity=".22"/><path d="${dD}" stroke="#1c0f08" stroke-width=".7" stroke-opacity=".42"/>`;
  /* Haut zwischen den Dornen eingesunken: weiche Schatten zwischen den Rippen; Licht oben links; fleischige Basis */
  let sm = "";
  for (let i = 0; i < dornen.length - 1; i++) { const [x, y] = dornen[i], [x2] = dornen[i + 1]; sm += `M${R((x + x2) / 2 - 0.6)} -40L${R((x + x2) / 2 - 1.6)} ${R(y + 2)}`; }
  si += weichG(T, 0.7, [72, -64, 130, -38], `<path d="${sm}" stroke="${SC}" stroke-width="1.2" stroke-opacity=".28"/>` + linien(T, [verschiebe(segelKante, 0.6, 1.2)], LI, 1.2, 0.2));
  si += weichG(T, 2, [72, -64, 130, -38], linien(T, [[[126, -41], [100, -41], [78, -42]]], SC, 5, 0.45) + linien(T, [[[124, -46], [110, -54], [98, -57], [86, -55]]], LI, 4, 0.12) + linien(T, [[[124, -43.6], [112, -50], [100, -53], [86, -51], [78, -46]]], "#2a1408", 2, 0.3));
  h += teil(T, segel, segelF, { innen: fl([72, -64, 130, -38]) + si });

  /* ---- Umrisse: Rumpf + Hals + Schwanz (tief bis ~60 % der Länge, dann verjüngt; leichte S-Biegung) ---- */
  const sOben = [[0, -29.6], [3, -31.6], [12, -35.6], [25, -39.4], [40, -42.4], [58, -44.8], [72, -46.2], [80, -44]];
  const ruecken = [[86, -40.6], [100, -40.2], [114, -40], [126, -40.8], [132, -42.4], [138, -45.2], [143, -48.4], [147.6, -50.6], [151.4, -51.6]];
  const unten = [[152, -43], [148.6, -42], [145.4, -38.6], [141.6, -34], [136.6, -29], [130, -24.6], [120, -21.4], [108, -20.2], [96, -21.6], [88, -24]];
  const sUnten = [[84, -24.4], [72, -24.6], [58, -24.8], [44, -24.8], [30, -25.2], [18, -26.2], [8, -27.6], [2, -28.6]];
  const leib = sOben.concat(ruecken, [[155, -50], [155.4, -45]], unten, sUnten);
  const bein = [[70, -36], [80, -38.4], [90, -35.6], [93.4, -29], [92.6, -22.6], [90.6, -18.4], [87.6, -14], [85.6, -9.6], [86.4, -5.2], [88.4, -2.8], [86, -1.2], [84.4, -1.8], [82.4, -5], [80.4, -9.6], [80.6, -13.6], [82.2, -18.6], [84.4, -22], [78, -27], [72, -31]];
  const scharnier = [153.4, -46];
  const kiefer = [[152.2, -47.4], [156, -47.3], [160, -47.4], [166, -47.2], [169.6, -47.8], [172.4, -47.1], [175.4, -46.2], [177, -45.8], [177.2, -43.8], [175.6, -43.4], [172, -43.8], [166, -43.6], [160, -43], [155.4, -42], [152.2, -42.6], [151.4, -44.6]];
  const kOben = [[156, -46.6], [160, -46.6], [166, -46.4], [169.6, -47], [172.4, -46.4], [175.4, -45.6], [177, -45.2]];
  const lippeO = [[154.4, -46.8], [160, -46.9], [166, -46.8], [169.6, -47.5], [173, -46.8], [176.2, -45.9], [177.6, -45.6]];
  const schaedel = [[151, -47.6], [151.4, -51.4], [153.4, -53.2], [156, -53.8], [158.4, -53.6], [160.6, -53.9], [163, -53.5], [165.2, -52.4], [167.4, -51.2], [170.4, -50.2], [174, -49.6], [176.2, -49.4], [177.6, -48.6], [178.4, -47.2], [178.2, -45.8], [177.4, -45.5]].concat(lippeO.slice().reverse().slice(1), [[152.6, -46.8]]);

  const iL = pfad(T, leib), iB = pfad(T, bein), iK = pfad(T, kiefer), iS = pfad(T, schaedel);
  h += fuell(iL, haut) + fuell(iB, haut);
  /* Zähne: kegelförmig, vorn (Rosette) 2–3× länger, nach hinten kleiner, greifen über den Kieferrand */
  const uzL = [[175.8, 2.2], [173.6, 2.4], [171.4, 1.4], [168.6, 0.8], [165.4, 0.75], [162.4, 0.7], [159.4, 0.65], [156.6, 0.6]];
  h += zaehne(T, uzL.map(([x, L]) => [x, -46.4 + (x > 170 ? (x - 170) * 0.12 : 0) + (x < 169 ? 0.2 : 0), L * 0.8 + 0.3, 0.32 + L * 0.13, -0.2]), -1, "s");
  h += fuell(iK, haut);
  const ozL = [[176.8, 2.6], [174.8, 2.8], [172.4, 1.6], [167.8, 0.8], [164.6, 0.9], [161.4, 0.85], [158.4, 0.8], [155.6, 0.7]];
  h += zaehne(T, ozL.map(([x, L]) => [x, (x > 169 ? -47 + (x - 169.6) * 0.18 : -46.9) - 0.2, L * 0.8 + 0.3, 0.32 + L * 0.13, 0.25]), 1, "s");
  h += fuell(iS, haut);

  /* ---- gemeinsame Malschicht: EIN Licht oben links ---- */
  let inn = fl([0, -56, 179, 0]);
  /* Paddelschwanz: Dornenlinien oben, Chevron-Saum unten, Querbänder */
  let st = "", ch = "";
  for (let x = 4; x < 80; x += 2.4) {
    const t = x / 80, oy = -29.6 - (t < 0.9 ? 16.6 * Math.pow(Math.sin(Math.PI / 2 * Math.min(1, t / 0.9)), 0.7) : 16.6), ky = -30.4 - t * 4.6;
    st += `M${R(x)} ${R(ky - 1.6)}L${R(x - 1.8)} ${R(Math.max(oy + 1, ky - 14))}`;
    const uy = -25 - (1 - t) * 3.4;
    ch += `M${R(x)} ${R(ky + 2.6)}L${R(x - 1.4)} ${R(uy - 0.4)}`;
  }
  inn += `<path d="${st}" stroke="#1a140c" stroke-width=".32" stroke-opacity=".3"/><path d="${ch}" stroke="#1a140c" stroke-width=".3" stroke-opacity=".26"/>`;
  let bd = "";
  for (const x of [10, 22, 34, 46, 58, 70]) bd += `M${x} -46l2.2 22h2.6l-2.2-22z`;
  inn += `<path d="${bd}" fill="#1c1a10" opacity=".28"/>`;
  /* grob: Rückenlicht, Kernschatten im unteren Drittel, Bodenreflex, Okklusion an Segelbasis, Hals/Kopf, Arm, Bein */
  let mal = linien(T, [verschiebe(ruecken.slice(4), 0, 1.4)], LI, 3, 0.3) + linien(T, [verschiebe(sOben.slice(1, 7), 0.4, 1.6)], LI, 2.6, 0.24);
  mal += linien(T, [verschiebe(unten.slice(3, 10), 0, -4.4)], SC, 7, 0.5) + linien(T, [verschiebe(sUnten, 0, -2.4)], SC, 3.4, 0.38);
  mal += linien(T, [verschiebe(unten.slice(3, 10), 0, 0.6)], RF, 1.8, 0.3) + linien(T, [verschiebe(sUnten, 0, 0.4)], RF, 1.2, 0.2);
  mal += linien(T, [[[84, -40.4], [100, -40], [114, -39.8], [126, -40.6]]], SC, 2.6, 0.4) + ell(127, -27, 3, 3, 0, SC, 0.45) + ell(150, -43, 3, 2.2, 20, SC, 0.4);
  /* Schwanz-Kern (Muskel) hell oben, Flosse etwas durchscheinend dunkler */
  mal += linien(T, [[[4, -30.8], [20, -32.4], [40, -34.6], [60, -35.6], [78, -35]]], LI, 3.4, 0.14);
  /* Oberschenkel: Licht oben-hinten, Kernschatten vorn-unten, Falte zum Bauch, hinten Okklusion */
  mal += ell(80, -33, 6, 4, -10, LI, 0.26) + linien(T, [[[90.6, -36], [93, -29], [91, -22], [86, -19]]], SC, 3.2, 0.45);
  mal += linien(T, [[[84.6, -21], [83, -14.6]]], LI, 1.6, 0.26) + linien(T, [[[90.6, -19], [87, -11]]], SC, 1.6, 0.36) + ell(87, -1.4, 4, 1, 0, SC, 0.5);
  let ok = linien(T, [[[92.6, -36], [94.4, -29], [92.6, -22], [90.4, -18.6]]], SC, 0.9, 0.5) + linien(T, [[[84.6, -21.6], [78.6, -26.4], [72.4, -31]]], SC, 1.2, 0.42) + linien(T, [[[83.6, -22.4], [78.2, -27.8], [73.4, -32]]], LI, 0.8, 0.26);
  /* Kopf: Oberseite hell, Kiefermuskel, Kehle, Schatten unter Kiefer und Lippe */
  let mk = linien(T, [[[151.8, -51.4], [154, -53.4], [158.6, -53.2], [166, -51.2], [174, -49.6], [177.6, -48.4]]], LI, 1.6, 0.34);
  mk += ell(153.4, -49.6, 1.8, 2, 0, LI, 0.18) + linien(T, [[[152.4, -42.8], [160, -43.2], [170, -43.8], [176.6, -43.6]]], SC, 1.8, 0.5) + linien(T, [[[155, -47.6], [163, -47.6], [170, -48.2], [177, -46.4]]], SC, 0.9, 0.35);
  mk += linien(T, [[[147, -43.4], [151, -42.4], [155, -41.6]]], SC, 2, 0.45);
  h += geklippt(T, [iL, iB, iK, iS], inn + weichG(T, 2, [0, -56, 179, 0], mal) + weichG(T, 0.6, [70, -40, 100, -16], ok) + weichG(T, 0.5, [146, -56, 179, -40], mk) +
    rueckenSchilde(T, [[2, -29.8], [12, -35.4], [25, -39.2], [40, -42.2], [58, -44.6]], 26, 0.25, 0.5, "#3c3628"));

  /* ---- Einzelheiten (scharf): Schilde auf Schnauze und Rücken groß, Flanke mittel, Bauch quer ---- */
  if (F) {
    h += geklippt(T, [iL], reihe(T, unten.slice(3, 10), 20, -1.8, "#1c1a10", 0.14, 0.24) + reihe(T, sUnten.slice(0, 6), 26, -1, "#1c1a10", 0.1, 0.18) +
      schuppenFeld(T, [[126, -40.6], [138, -45], [148, -50.4], [150, -46], [144, -40], [136, -34], [126, -36]], 0.8, { opS: 0.2, opL: 0.1, dichte: 0.45 }) +
      reihe(T, ruecken.slice(0, 5), 30, 1.2, "#1c1a10", 0.12, 0.3));
    h += geklippt(T, [iB], reihe(T, [[85.4, -9.6], [86.2, -5.2], [88, -3]], 6, 1.6, "#120c06", 0.12, 0.4, -1.6));
    h += geklippt(T, [iS], platten(T, [[158, -53], [166, -51.2], [174, -49.4], [177.6, -48.2], [177.6, -46.6], [170, -48.4], [160, -49.4]], 1.4, { opS: 0.34 }) +
      platten(T, [[151.4, -48], [152, -52], [156, -53.4], [158, -51], [154, -48.4]], 0.9, { opS: 0.3 }) + reihe(T, lippeO, 20, -0.8, "#140e08", 0.1, 0.4, 0.1));
    h += geklippt(T, [iK], platten(T, kiefer, 1.1, { opS: 0.28 }));
  }
  /* flacher Nasenkamm vor den Augen, Nasenloch weit hinten */
  h += weichG(T, 0.3, [158, -54, 167, -50], linien(T, [[[159, -52.6], [161.6, -52.8], [164.4, -51.8]]], SC, 0.6, 0.35)) + linien(T, [[[158.6, -53.6], [160.8, -53.9], [163, -53.5]]], LI, 0.3, 0.4);
  h += weichG(T, 0.25, [164, -52, 169, -49], ell(166.6, -50.5, 1.2, 0.5, -15, SC, 0.4)) + ell(166.7, -50.6, 0.7, 0.26, -15, "#1a1008", 0.9);

  /* ---- naher Arm: Rumpffarbe, Schultermuskel, kräftiger Unterarm, große Daumenkralle ---- */
  const arm = [[123, -33], [128.4, -32], [129.6, -27.6], [129, -24], [131.6, -21], [135, -18.6], [136, -17], [134.4, -16.2], [131, -17.6], [127.4, -20.4], [125, -24.6], [122.6, -29]];
  h += teil(T, arm, haut, { weich: 0.9, innen: fl([121, -34, 137, -15]),
    mal: ell(125.4, -29.6, 2.4, 3.4, 0, LI, 0.24) + linien(T, [[[128.6, -27], [128.4, -23], [131, -20]]], SC, 1.2, 0.42) + linien(T, [[[124, -25], [127, -20.6], [131.4, -17.6]]], SC, 1.2, 0.36) + ell(123, -32.6, 3, 1.4, 0, SC, 0.4),
    oben: F ? linien(T, [[[127, -23.6], [129, -22.8]]], SC, 0.3, 0.5) : "" });
  h += weichG(T, 0.8, [126, -20, 140, -12], ell(133, -15.6, 3.4, 1, 0, SC, 0.35));

  /* ---- Zehen: lang, gespreizt, flache Krallen ---- */
  const z3 = [[85.4, -2.6], [89, -2.4], [93, -1.6], [96.6, -0.9], [97.2, -0.3, 1], [91.4, -0.2], [87.6, -0.6]];
  h += teil(T, z3, hautF, { klein: 1, mal: linien(T, [[[86, -2.2], [92, -1.6], [96, -0.8]]], LI, 0.4, 0.2), weich: 0.3, oben: F ? reihe(T, [[86, -2.4], [90, -2.1], [94, -1.3]], 7, 1.2, "#100c06", 0.1, 0.4, -0.05) : "" });
  const z4 = [[83.4, -2.4], [86.4, -2.6], [89.6, -2], [92.6, -1.2], [94.4, -0.7], [94.4, -0.2, 1], [90.6, -0.2], [89.2, -0.6], [87.8, -0.2], [85.8, -0.6], [84, -0.2], [83, -1]];
  h += teil(T, z4, "#6a5e48", { klein: 1, weich: 0.3, mal: linien(T, [[[84, -0.5], [92, -0.4]]], SC, 0.6, 0.45) + linien(T, [[[84, -2.3], [90, -2]]], LI, 0.4, 0.26), oben: F ? reihe(T, [[84, -2.4], [87, -2.5], [90, -1.9], [93, -1]], 9, 1.4, "#100c06", 0.1, 0.4, -0.05) : "" });

  let s = F ? `<g filter="${T.relief("haut", { f: 4, tiefe: 0.1, okt: 3 })}">${h}</g>` : h;
  s += augeHoehle(T, 155.4, -51.3, 1.1, { iris: "#c8a03a", iris2: "#5a3a12", offen: 0.6, lid: "#16120b", winkel: -6 });
  /* Krallen: Daumenkralle groß, gebogen; flache Zehenkrallen */
  s += krallen(T, [[135.4, -17.2, 3.2, 1.05, 70, 0.8], [134.2, -16.4, 1.8, 0.65, 90, 0.6], [131.6, -17, 1.5, 0.55, 100, 0.6], [97, -0.6, 2.2, 0.75, 8, 0.25], [94.2, -0.5, 2, 0.7, 8, 0.25], [88.6, -0.5, 1.8, 0.65, 8, 0.25], [74.4, -1.2, 1.8, 0.7, 170, -0.25]]);
  GEN = 10;
  return Object.assign(fertig(7.8, s, [0, -63, 178.4, 0]), { fuesse: [81 * 7.8, 89 * 7.8], kopf: [148 * 7.8, -57 * 7.8, 180 * 7.8, -40 * 7.8] });
}

/* =====================================================================
   ALLOSAURUS
   RECHERCHE: Allosaurus fragilis (Oberjura, 155–145 Mio. J., Morrison-Formation, USA). Durchschnittlich ~8,5 m
   lang (größte sichere Funde ~9,7 m), ~2,3–2,5 m Hüfthöhe, 1,7–2,3 t. Schädel ~85 cm (bei 7,9 m Länge), schmal
   und lang, mit paarigen rauen Knochenleisten auf der Schnauze (Nasalia) bis zu je einem flachen, nach vorn
   geneigten dreieckigen Hörnchen (Lacrimale) vor dem Auge; große Antorbitalöffnung (Mulde zwischen Auge und
   Nase); Mundwinkel hinter dem Auge nach unten gezogen. Viele klingenartige Zähne, kleiner als beim T. rex,
   unter Lippen. S-förmiger Hals; schlanker Rumpf; langer Schwanz waagerecht. Arme deutlich länger als beim
   T. rex, DREI Finger mit großen, gebogenen Krallen (Daumenkralle am größten), Handflächen nach innen.
   Beine digitigrad: Oberschenkel als dicke Keule, Schienbein schräg zurück, Ferse sichtbar, drei tragende Zehen
   (III am längsten) und eine kleine Afterzehe innen.
   Farbe unbekannt → sandbraun mit dunklen Rückenquerstreifen, Bauch hell, Hörnchen leicht rötlich (Signal).
   Zeichenraum: 1 Einheit = 4,25 cm (200 Einheiten ≈ 8,5 m).
   ===================================================================== */
function allosaurus(T) {
  const F = T.fein, US = ' gradientUnits="userSpaceOnUse"';
  GEN = F ? 10 : 2; T._ganz = [-1, -68, 201, 1];
  const haut = T.lg("haut", [[0, "#4a3a28"], [0.18, "#5e4a34"], [0.38, "#7c6448"], [0.52, "#957a58"], [0.62, "#a88d68"], [0.8, "#8e7656"], [1, "#6a5842"]], 0, -68, 0, 0, US);
  const hautF = T.lg("hautf", [[0, "#463828"], [0.4, "#5a4834"], [0.75, "#6a563e"], [1, "#4e4030"]], 0, -60, 0, 0, US);
  const LI = "#fff2d4", SC = "#14100a", RF = "#e6cc9e";
  const fl = (b) => fleckung(T, "fleck", b, "#1c160c", 0.24);
  let h = "";

  /* ---- fernes Bein: gleiche Form, 30 % dunkler, Schritt nach hinten ---- */
  const fb = [[84, -50], [98, -54], [103, -44], [101.6, -34], [98.6, -28.4], [94, -22], [89.6, -15.6], [89.6, -9.4], [91.4, -4.6], [94.6, -2.8], [98.4, -1.2], [98.8, -0.2, 1], [86.8, -0.2, 1], [85.8, -1.8],
    [84.2, -6.4], [83.4, -11], [84.6, -16], [88.4, -23], [91.4, -29.6], [86, -36], [81, -44]];
  h += teil(T, fb, hautF, { weich: 1.2, innen: fl([80, -56, 100, 0]),
    mal: linien(T, [[[86, -48], [96, -52], [101, -46]]], LI, 3.4, 0.2) + linien(T, [[[102, -42], [100, -32], [96, -25]], [[96, -23], [91.6, -16], [90, -9]]], SC, 2.4, 0.36) + linien(T, [[[86.4, -20], [85.6, -13]]], LI, 1.2, 0.18) + ell(92, -1.4, 5.4, 1.4, 0, SC, 0.5),
    oben: F ? reihe(T, [[89.8, -9], [91.4, -4.6], [94.6, -2.8], [98, -1.4]], 7, 1, "#120c06", 0.14, 0.42, -0.9) : "" });
  /* ferner Arm */
  h += teil(T, [[146, -43], [149.4, -42], [150.2, -37], [153.6, -33.4], [156.4, -31], [155.4, -30], [151.6, -32.4], [148.4, -36], [146.6, -39.6]], hautF, { klein: 1 });

  /* ---- Umrisse ---- */
  const oben = [[2, -40.9], [12, -42.8], [26, -45.8], [42, -49.2], [60, -53], [78, -56], [95, -57.4], [112, -57.2], [128, -56], [140, -54.6], [150, -54.6], [157, -57], [163, -60.4], [169, -62.8], [175, -63.6], [179.6, -63]];
  const bauch = [[106, -29.4], [114, -30.2], [124, -30.6], [134, -31.6], [142, -33.6], [150, -37.4], [156, -41.8], [162, -46.2], [168, -49.6], [174, -51.6], [180, -52.6]];
  const sUnten = [[4, -39.6], [16, -39.8], [32, -40.8], [48, -42.2], [62, -43.4], [76, -42.8], [86, -40.6]];
  const leib = [[-0.4, -40.2]].concat(oben, [[182, -58], [181.4, -53]], bauch.slice().reverse(), [[100, -32], [92, -37]], sUnten.slice().reverse(), [[0.6, -39.4]]);
  /* Oberschenkel als dicke Keule, Knie auf Bauchhöhe, Schienbein schräg zurück, Ferse sichtbar, Mittelfuß 20° nach vorn */
  const bein = [[78, -54], [92, -58.6], [106, -56.4], [113.4, -49], [114.6, -41], [112.2, -33.6], [109.4, -29], [106.8, -24], [103.2, -17.6], [100.2, -12.6], [100.6, -8.4], [102, -4.6], [103.4, -2.6],
    [100, -1.2], [98.4, -1.6], [96.8, -4.6], [95, -9], [94.2, -12.6], [94.4, -16.4], [96, -22], [98.4, -26.6], [100.6, -30.4], [94, -35], [87, -41], [82, -48]];
  const lippeO = [[179.4, -54.6], [181, -55.4], [183.6, -56], [188, -56.3], [194, -56.5], [198.6, -56.7], [199.8, -56.8]];
  const kiefer = [[178.6, -54.8], [181, -55.9], [184, -56.5], [188, -56.8], [194, -57], [198.6, -57.2], [199.8, -56.8], [199.6, -55.2], [197.6, -54.4], [193, -53.8], [188, -53.2], [184, -52.6], [180.6, -52.2], [178.6, -52.6], [177.8, -53.6]];
  const schaedel = [[177.8, -58.8], [178.4, -62.4], [179.8, -64.4], [181.8, -65.6], [184.2, -65.9], [186.8, -65.3], [189.6, -64.2], [192.8, -62.8], [196.2, -61], [198.8, -59.4], [200.2, -58], [200.4, -57.1]].concat(lippeO.slice().reverse(), [[178.2, -56.4]]);

  const iL = pfad(T, leib), iB = pfad(T, bein), iK = pfad(T, kiefer), iS = pfad(T, schaedel);
  h += fuell(iL, haut) + fuell(iB, haut) + fuell(iK, haut);
  /* obere Zähne: Spitzen unter der wulstigen Lippe, vorn größer, nach hinten gebogen */
  const oz = [];
  for (let i = 0; i < 13; i++) { const x = 198.4 - i * 1.32, L = 1.25 - i * 0.05; oz.push([x, -56.95 + (199 - x) * 0.012 - 0.15, L, 0.36 + L * 0.22, 0.3]); }
  h += zaehne(T, oz, 1, "a");
  h += fuell(iS, haut);

  /* ---- gemeinsame Malschicht ---- */
  let inn = fl([0, -68, 201, 0]);
  /* dunkle Querstreifen über Rücken und Schwanz, folgen der Rundung, laufen an der Flanke aus */
  let bd = "";
  for (const [x, w, hh] of [[10, 2, 4], [20, 2.4, 5], [31, 2.8, 6], [43, 3, 7], [56, 3.4, 8], [70, 3.6, 9], [85, 3.8, 10], [110, 3.8, 11], [124, 3.6, 10.6], [137, 3.2, 10], [149, 2.8, 8], [160, 2.4, 6], [170, 2, 5]]) {
    const y = x < 95 ? -40.9 - (x / 95) * 16.5 : x < 150 ? -57.4 + (x - 95) * 0.05 : -54.6 - (x - 150) * 0.38;
    bd += `M${R(x - w / 2)} ${R(y - 1)}q${R(w * 0.8)} ${R(hh * 0.5)} ${R(w * 0.2)} ${hh}l${R(w * 0.5)} 0q${R(w * 0.9)} ${R(-hh * 0.55)} ${R(w * 0.3)} ${-hh}z`;
  }
  inn += `<path d="${bd}" fill="#2c1e12" opacity=".42"/>`;
  let mal = linien(T, [verschiebe(oben.slice(0, 15), 0, 1.8)], LI, 4.4, 0.32);
  mal += linien(T, [verschiebe(bauch.slice(0, 8), 0, -5.6)], SC, 8.4, 0.5) + linien(T, [verschiebe(sUnten, 0, -2.2)], SC, 3.6, 0.4);
  mal += linien(T, [verschiebe(bauch, 0, 0.7)], RF, 2, 0.3) + linien(T, [verschiebe(sUnten, 0, 0.5)], RF, 1.2, 0.22);
  mal += ell(86, -46, 5, 3.4, 0, SC, 0.42) + ell(150, -40.6, 4.4, 3.4, 0, SC, 0.5) + ell(172, -50.6, 5, 2.4, 25, SC, 0.42);
  mal += linien(T, [[[156, -55], [164, -58.6], [172, -61]]], LI, 2.6, 0.2) + linien(T, [[[154, -48], [164, -52], [174, -56]]], SC, 1.4, 0.2);
  /* Oberschenkel-Keule: Licht oben-hinten, Kernschatten vorn-unten, Knie, Wade, Schienbein, Achillessehne */
  mal += ell(96, -49, 9, 6, -10, LI, 0.3) + linien(T, [[[111.6, -52], [113.6, -43], [111.6, -35], [106, -31]]], SC, 4, 0.46);
  mal += ell(102.6, -30, 3.6, 1.4, -10, SC, 0.36) + linien(T, [[[98.6, -26], [96.6, -19]]], LI, 2.2, 0.28) + linien(T, [[[106.6, -26], [101.6, -15]]], SC, 2, 0.36);
  mal += linien(T, [[[95, -11], [97.4, -3]]], LI, 1, 0.26) + linien(T, [[[100.6, -10.4], [102, -4.2]]], SC, 1.2, 0.3) + ell(100, -1.6, 4, 1.2, 0, SC, 0.5);
  let ok = linien(T, [[[113.6, -52], [115.4, -43], [113.2, -35], [110.4, -29.6]]], SC, 1.1, 0.5) + linien(T, [[[101.4, -29.6], [94.4, -34.6], [87.4, -40.6], [82.4, -48]]], SC, 1.5, 0.45) +
    linien(T, [[[100.4, -31.6], [94.4, -36], [88.6, -41], [84.6, -48.4]]], LI, 1.1, 0.28) + linien(T, [[[95, -15], [97.6, -14.6]]], SC, 0.5, F ? 0.4 : 0);
  /* Kopf: Nasenleiste als Lichtgrat mit Schattenkante, Antorbitalmulde, Kiefermuskel hinter dem Auge, Schatten unter Lippe und Kiefer */
  let mk = linien(T, [[[178.6, -62.4], [181, -65], [186, -65.4], [192, -63], [198.6, -59.6]]], LI, 1.8, 0.34);
  mk += linien(T, [[[187.4, -64.2], [192.4, -62.2], [198, -59.4]]], SC, 0.7, 0.42) + ell(190.8, -60.4, 3.2, 1.4, -14, SC, 0.32);
  mk += ell(179.8, -59.6, 1.8, 2.6, 0, LI, 0.2) + linien(T, [[[179, -56.6], [181.2, -58], [182.4, -60.2]]], SC, 1.1, 0.36);
  mk += linien(T, [[[182, -57.2], [190, -57.2], [199, -57.6]]], SC, 1, 0.4) + linien(T, [[[179.4, -52.6], [188, -53.4], [197.6, -54.6]]], SC, 1.8, 0.5) + linien(T, [verschiebe(lippeO.slice(2), 0, -0.3)], RF, 0.6, 0.28);
  mk += linien(T, [[[174, -50.8], [180, -51.6], [188, -52.2]]], SC, 1.8, 0.48);
  const falten = [[[160, -56.6], [161.6, -50], [160, -45]], [[148, -45], [149.4, -41.6], [149, -38]]];
  let fa = linien(T, falten, SC, 0.45, 0.3);
  if (F) fa += linien(T, falten.map((p) => verschiebe(p, -0.45, -0.35)), LI, 0.35, 0.18);
  h += geklippt(T, [iL, iB, iK, iS], inn + weichG(T, 2.1, [0, -68, 201, 0], mal) + weichG(T, 0.6, [80, -56, 117, -10], ok) + weichG(T, 0.55, [174, -68, 201, -50], mk) + weichG(T, 0.22, [140, -60, 166, -36], fa) +
    rueckenSchilde(T, oben.slice(1, 14), 56, 0.3, 0.8, "#4a3a28"));

  if (F) {
    h += geklippt(T, [iL], reihe(T, bauch.slice(0, 9), 22, -2, "#2a1e12", 0.14, 0.24) + reihe(T, sUnten, 30, -1.2, "#2a1e12", 0.1, 0.2) +
      schuppenFeld(T, [[140, -53], [152, -54.6], [162, -59], [170, -61.4], [172, -55], [164, -48], [154, -42], [144, -38], [138, -44]], 0.8, { opS: 0.2, opL: 0.1, dichte: 0.5 }));
    h += geklippt(T, [iB], reihe(T, [[100.4, -12.4], [100.8, -8.4], [102, -4.6], [103.2, -2.8]], 8, 1.9, "#120c06", 0.13, 0.42, -1.9) + reihe(T, [[100.4, -12.2], [100.8, -8.4], [102, -4.6]], 8, -0.45, "#f4e4c0", 0.12, 0.26, -0.25));
    h += geklippt(T, [iK], platten(T, kiefer, 1.2, { opS: 0.28 }) + reihe(T, kiefer.slice(1, 6), 14, 0.9, "#140e08", 0.1, 0.4, 0.2));
    h += geklippt(T, [iS], platten(T, [[187, -63.6], [192.6, -62.2], [198.6, -59.2], [200, -57.6], [196, -57.4], [189, -58.2]], 1.6, { opS: 0.34 }) +
      platten(T, [[178.6, -59], [179.6, -63.8], [183, -65.4], [187, -64.8], [185, -61], [181, -58.4]], 1.1, { opS: 0.3 }) + reihe(T, lippeO.slice(1), 18, -1, "#140e08", 0.11, 0.42, 0.1));
  }
  /* Lacrimal-Hörnchen: flach, nach vorn geneigt, rau, nur leicht rötlich; Schlagschatten nach hinten-unten */
  const horn = [[182.8, -65.6], [184.6, -66.4], [186.6, -67, 1], [187.2, -66.6], [188, -65.2], [186.8, -64.9]];
  h += weichG(T, 0.3, [182, -68, 189, -63], flaeche(T, verschiebe(horn, -0.3, 0.7), SC, 0.4));
  h += F ? teil(T, horn, T.lg("horn2", [[0, "#7a5c44"], [1, "#58432f"]]), { innen: platten(T, horn, 0.55, { opS: 0.5 }), mal: linien(T, [horn.slice(0, 3)], LI, 0.4, 0.4), weich: 0.2 }) : flaeche(T, horn, "#7a5a42");
  /* Nasenloch: Oval innerhalb der Kontur, ~8 % hinter der Spitze, in flacher Grube mit Lichtkante oben */
  h += weichG(T, 0.25, [196, -60.4, 200, -57.6], ell(197.8, -58.8, 1.1, 0.55, -20, SC, 0.4)) + ell(197.9, -58.9, 0.6, 0.26, -20, "#1a1008", 0.9) + `<path d="M196.8 -59.6q1.1-.6 2.2-.2" fill="none" stroke="${LI}" stroke-width=".14" stroke-opacity=".5"/>`;

  /* ---- naher Arm: Körperfarbe, Schultermuskel, drei Finger, Daumenkralle groß ---- */
  const arm = [[144.4, -46.4], [149.6, -45.4], [150.6, -40.4], [151, -37.2], [154.2, -34.8], [157.6, -32.6], [159.2, -31], [158, -30], [154.6, -31.4], [150.6, -33.6], [148, -37], [146.2, -41.6]];
  h += teil(T, arm, haut, { weich: 0.7, innen: fl([143, -47, 160, -29]),
    mal: ell(146.8, -42.6, 2, 3.2, 0, LI, 0.26) + linien(T, [[[150.4, -40], [150.4, -36.8], [154, -34]]], SC, 1.1, 0.4) + linien(T, [[[147.6, -37.4], [151, -33.4], [155.6, -31]]], SC, 1, 0.34) + ell(145, -46, 2.6, 1.2, 0, SC, 0.4) });
  for (const p of [[[157, -32.4], [159.6, -31.6], [160.8, -30.4], [160, -29.8], [157.6, -30.6]], [[156.4, -31.2], [158.6, -29.8], [159.2, -28.6], [158.4, -28.4], [156, -29.8]], [[155.4, -30.4], [157, -28.8], [157.2, -27.8], [156.4, -27.8], [154.8, -29.4]]])
    h += teil(T, p, haut, { klein: 1, weich: 0.2, mal: linien(T, [p.slice(0, 3)], LI, 0.3, 0.3) });
  h += weichG(T, 0.8, [148, -34, 162, -26], ell(156, -29, 4, 1.2, 10, SC, 0.32));

  /* ---- Zehen: III (längste) dahinter, IV vorn, kleine Afterzehe innen ---- */
  const z3 = [[100.4, -3], [104, -2.8], [108, -2], [111.4, -1.2], [112.6, -0.6], [112.8, -0.2, 1], [107.4, -0.2], [104.4, -0.6], [101.6, -1.2]];
  h += teil(T, z3, hautF, { klein: 1, weich: 0.35, mal: linien(T, [[[101, -2.6], [107, -2], [111.6, -1]]], LI, 0.5, 0.2), oben: F ? reihe(T, [[101, -2.9], [105, -2.6], [109, -1.7], [112, -0.9]], 9, 1.4, "#120c06", 0.11, 0.42, -0.05) : "" });
  const z4 = [[98.4, -2.8], [101.6, -3], [104.6, -2.4], [107.2, -1.4], [109, -0.8], [109.2, -0.2, 1], [106, -0.2], [104.6, -0.7], [103.2, -0.2], [101.2, -0.7], [99.4, -0.2], [98.2, -0.9]];
  h += teil(T, z4, "#7e6a50", { klein: 1, weich: 0.35, mal: linien(T, [[[99, -0.5], [106, -0.5], [108.6, -0.4]]], SC, 0.7, 0.5) + linien(T, [[[99, -2.6], [104, -2.3], [108, -1.2]]], LI, 0.5, 0.26), oben: F ? reihe(T, [[99, -2.8], [102, -2.9], [105, -2.3], [108, -1.2]], 9, 1.7, "#120c06", 0.11, 0.42, -0.05) : "" });
  h += teil(T, [[96.6, -7.4], [95, -6.4], [93.8, -5], [94.4, -4.6], [96.2, -5.4], [97.2, -6.4]], "#5e4c38", { klein: 1 });

  let s = F ? `<g filter="${T.relief("haut", { f: 3.2, tiefe: 0.12, okt: 3 })}">${h}</g>` : h;
  s += augeHoehle(T, 183, -62.6, 1.02, { iris: "#cf9d3a", iris2: "#5e3812", offen: 0.6, lid: "#16110a", winkel: -5 });
  s += krallen(T, [[160.4, -30.4, 3, 1, 70, 0.85], [158.8, -28.8, 2.2, 0.75, 85, 0.7], [156.8, -28.2, 1.9, 0.65, 95, 0.7], [112.4, -0.7, 2.4, 1.05, 12, 0.35], [108.8, -0.6, 2.2, 1, 14, 0.35], [98.4, -1, 1.8, 0.9, 170, -0.3], [94, -4.8, 1.4, 0.6, 140, -0.4]]);
  GEN = 10;
  return Object.assign(fertig(4.25, s, [-0.4, -67.8, 200.6, 0]), { fuesse: [92 * 4.25, 105 * 4.25], kopf: [176 * 4.25, -69 * 4.25, 202 * 4.25, -50 * 4.25] });
}

/* =====================================================================
   PTERANODON – ein FLUGSAURIER (Pterosaurier), KEIN Dinosaurier! (für den Tipp: „Der Pteranodon ist kein
   Dinosaurier, sondern ein Flugsaurier – ein Verwandter, der mit Hautflügeln flog.")
   RECHERCHE: Pteranodon longiceps (Oberkreide, ~86–84 Mio. J., Niobrara-Meer, Kansas). Spannweite 3,8–5,6 m
   (Männchen bis ~6 m), nur ~20–25 kg, sehr kleiner Rumpf, kurzer Schwanzstummel. Schädel mit Kamm ≈ ¼ der
   Spannweite: zahnloser, langer, spitzer Schnabel („Flügel ohne Zahn"); Männchen mit langem, nach hinten gerichtetem
   Knochenkamm mit breiter Basis. Flügel: Flughaut (Brachiopatagium) vom stark verlängerten 4. Finger bis zum
   Fußknöchel, vorn eine schmale Vorflughaut (Propatagium) vom Hals zum Handgelenk; drei kleine Krallenfinger am
   Knick der Vorderkante (Ende der Mittelhand); Flughaut mit Versteifungsfasern (Aktinofibrillen), die außen fast
   parallel zum Flugfinger laufen. Körper mit haarähnlichen Pyknofasern („Fell"). Zwei kleine Beine mit vier Zehen.
   Gezeichnet im Gleitflug, schräg von oben: ferner Flügel (oben) perspektivisch verkürzt, naher Flügel (unten)
   größer, Flügelspitzen etwa auf Höhe der Füße, Vorderkante als flaches „M".
   Zeichenraum: 1 Einheit = 2 cm.
   ===================================================================== */
function pteranodon(T) {
  const F = T.fein;
  GEN = F ? 10 : 2; T._ganz = [-48, -91, 76, 112];
  const LI = "#fff2d8", SC = "#120c08";
  const hautO = T.lg("fhaut", [[0, "#3c2e26"], [0.45, "#54423a"], [1, "#6e5a4a"]], 0, 0, 1, 0);
  const hautU = T.lg("fhautu", [[0, "#44352c"], [0.45, "#5e4a3e"], [1, "#7a6452"]], 0, 0, 1, 0);
  const fell = T.lg("fell", [[0, "#5a4636"], [0.6, "#7a6450"], [1, "#9c866c"]]);
  let s = "";

  /* Flügel: Vorderkante = Knochen (Oberarm, Unterarm, Mittelhand, Flugfinger) mit Grat, Lichtkante und Gelenkknoten;
     Haut leicht durchhängend (Verlauf über die Flügeltiefe); Hinterkante dünner, heller, leicht gebuchtet;
     Aktinofibrillen außen fast parallel zum Flugfinger, zum Arm hin steiler, Abstand unregelmäßig, Deckkraft nach außen abnehmend. */
  const fluegel = (vorn, hinten, fill, sgn, b) => {
    const pts = vorn.concat(hinten.slice().reverse().slice(1));
    const A = polyl(vorn.slice(3)), B = polyl(hinten);
    let fa = ["", "", ""];
    if (F) for (let k = 0; k < 22; k++) {
      const t = (k + 0.3 + T.rnd() * 0.5) / 22, [ax, ay] = A.at(t), [bx, by] = B.at(Math.min(1, t + 0.1 + 0.12 * t));
      const g = t < 0.35 ? 0 : t < 0.7 ? 1 : 2;
      fa[g] += `M${R(ax)} ${R(ay)}Q${R(ax + (bx - ax) * 0.5 + sgn * 1.5)} ${R(ay + (by - ay) * 0.5)} ${R(ax + (bx - ax) * 0.85)} ${R(ay + (by - ay) * 0.85)}`;
    }
    let inn = fa.map((d, i) => d ? `<path d="${d}" fill="none" stroke="#1a120c" stroke-width=".2" stroke-opacity="${[0.28, 0.2, 0.12][i]}"/>` : "").join("");
    /* Durchhang: Mitte der Haut etwas dunkler, Nähe der Knochen heller; Licht oben links */
    const mitte = vorn.slice(3).map((p, i) => { const q = B.at(i / (vorn.length - 4)); return [p[0] + (q[0] - p[0]) * 0.55, p[1] + (q[1] - p[1]) * 0.55]; });
    let mal = linien(T, [mitte], SC, 7, 0.22) + linien(T, [verschiebe(vorn, -1.2, sgn * 1.4)], LI, 3, 0.2) + linien(T, [hinten], "#c8b49c", 1.6, 0.3) +
      (sgn < 0 ? linien(T, [[[2, -7], [-6, -10], [-16, -11]]], SC, 4, 0.3) : linien(T, [[[2, 7], [-8, 9], [-20, 9.6]]], SC, 4, 0.3));
    return teil(T, pts, fill, { innen: inn, mal, weich: 1.6, box: b });
  };
  const knochen = (vorn, sgn) => {
    const P = polyl(vorn); let d = "";
    for (let i = 0; i < 24; i++) { const t = i / 23, [x, y, nx, ny] = P.at(t), w = 1.1 * (1 - t) + 0.3; d += `${i ? "L" : "M"}${R(x + nx * w * sgn)} ${R(y + ny * w * sgn)}`; }
    for (let i = 23; i >= 0; i--) { const t = i / 23, [x, y, nx, ny] = P.at(t), w = 1.1 * (1 - t) + 0.3; d += `L${R(x - nx * w * sgn * 0.6)} ${R(y - ny * w * sgn * 0.6)}`; }
    return `<path d="${d}Z" fill="#4a3a30"/>` + linien(T, [verschiebe(vorn, -0.4, -0.4 * sgn)], LI, 0.5, 0.45) + linien(T, [verschiebe(vorn, 0.3, 0.5 * sgn)], SC, 0.5, 0.4);
  };
  const gelenke = (liste) => liste.map(([x, y, r]) => ell(x, y, r, r * 0.8, 0, "#4e3e32") + ell(x - r * 0.3, y - r * 0.3, r * 0.45, r * 0.35, 0, LI, 0.35)).join("");

  /* ---- ferner Flügel (oben): verkürzt ---- */
  const fV = [[2, -4], [-2, -15], [8, -29], [8.6, -45], [-2, -58], [-16, -70.6], [-31, -80.6], [-44, -89.4]];
  const fH = [[-38, -7], [-33.6, -17], [-28, -30], [-23.6, -43], [-23.2, -55], [-27, -68], [-35, -80.6], [-44, -89.4]];
  s += fluegel(fV, fH, hautO, -1, [-46, -91, 12, -2]);
  s += flaeche(T, [[5.6, -4], [8.6, -16], [9.6, -27], [8.4, -29.4], [5, -16]], "#4e3e34", 0.85);
  s += knochen(fV, -1) + gelenke([[-2, -15, 1.4], [8, -29, 1.5], [8.6, -45, 1.2]]);
  /* Schlagschatten von Hals und Kamm auf den fernen Flügel */


  /* ---- Beine (zwei, gespreizt), Schwanzstummel ---- */
  const beinPfad = (sgn) => [[-19, sgn * 2], [-27, sgn * 5.6], [-34, sgn * 8.6], [-39, sgn * 10.4], [-40, sgn * 9], [-33.6, sgn * 6.6], [-26.6, sgn * 3.4], [-20, sgn * 0.4]];
  for (const sgn of [-1, 1]) {
    s += teil(T, beinPfad(sgn), sgn > 0 ? fell : "#4e3e30", { klein: 1, mal: linien(T, [[[-20, sgn * 1.6], [-30, sgn * 6], [-38, sgn * 9.4]]], LI, 0.6, 0.25), weich: 0.4 });
    /* Fuß mit vier Zehen */
    let z = "";
    for (let i = 0; i < 4; i++) z += `M${R(-39.4)} ${R(sgn * (9.4 + i * 0.5))}l${R(-3.2 - (i === 1 || i === 2 ? 0.6 : 0))} ${R(sgn * (0.6 + i * 0.8))}`;
    s += `<path d="${z}" stroke="#3a2c22" stroke-width=".7" stroke-linecap="round" fill="none"/>`;
  }
  s += teil(T, [[-22, -1.6], [-30.6, -0.6], [-31.4, 0.4], [-30.6, 1.2], [-22, 1.8]], fell, { klein: 1 });

  /* ---- Rumpf (klein) und Hals mit Pyknofasern ---- */
  const rumpf = [[8, -3.4], [2, -5.6], [-8, -6], [-18, -4.2], [-24, -1.6], [-25.4, 0], [-24, 1.8], [-18, 4.6], [-8, 6.4], [2, 6.2], [8, 3.6]];
  const hals = [[4, -2.4], [14, -2.6], [24, -2.6], [32, -2.4], [33, 1.4], [24, 1.6], [14, 1.8], [4, 2.6]];
  const iR = pfad(T, rumpf), iH = pfad(T, hals);
  /* Kontaktschatten Rumpf/Flügel */
  s += weichG(T, 1.4, [-30, -10, 14, 10], flaeche(T, verschiebe(rumpf, 0.8, 1.2), SC, 0.4));
  s += fuell(iH, fell) + fuell(iR, fell);
  let fe = F ? federn(T, rumpf, 220, (x, y) => 180 + y * 3, 1.8, [["#2a1d14", 1, 0.25, 0.4], ["#c8b298", 0.7, 0.2, 0.4], ["#5a4636", 0.6, 0.3, 0.4]], { kr: 0.3 }) +
    federn(T, hals, 90, 180, 1.4, [["#2a1d14", 1, 0.22, 0.4], ["#c8b298", 0.6, 0.18, 0.4]], { kr: 0.3 }) : "";
  let rm = linien(T, [[[6, -3], [-6, -4.4], [-20, -2.6]]], LI, 2.6, 0.32) + linien(T, [[[6, 3.4], [-6, 5], [-20, 3]]], SC, 2.6, 0.42) + linien(T, [[[6, -1.2], [20, -1.4], [31, -1.2]]], LI, 1, 0.3) + linien(T, [[[6, 1.8], [20, 1.2], [31, 0.8]]], SC, 1, 0.35);
  s += geklippt(T, [iR, iH], fe + weichG(T, 1, [-27, -8, 35, 8], rm));
  /* Flaum bricht die Silhouette (Hals, Hinterkopf, Flügelwurzel) */
  s += federn(T, [[-20, -4.6], [0, -6.4], [8, -4], [32, -3.2], [32, -2], [8, -2.6], [0, -5], [-20, -3.6]], 60, (x) => x > 6 ? 185 : 175, 1.2, [["#6a5442", 1, 0.2, 0.6]], { szene: 0.3, kr: 0.4 });

  /* ---- naher Flügel (unten): größer ---- */
  const nV = [[2, 4.6], [-2, 18], [8, 36], [8.6, 56], [-3, 72], [-18, 87], [-34, 100], [-47, 110.6]];
  const nH = [[-40, 8], [-35, 20], [-29, 36], [-24.4, 52], [-24, 66], [-28.6, 82], [-37, 97], [-47, 110.6]];
  s += fluegel(nV, nH, hautU, 1, [-48, 2, 12, 112]);
  /* Vorflughaut: schmales Dreieck, 5 % dunkler, ohne eigene Kontur */
  s += flaeche(T, [[5.6, 4.4], [9, 19.6], [10.2, 33.6], [8.6, 36.4], [5, 19]], "#5a483c", 0.85);
  s += knochen(nV, 1) + gelenke([[-2, 18, 1.6], [8, 36, 1.7], [8.6, 56, 1.4]]);
  /* drei Krallenfinger am Knick der Vorderkante (Ende der Mittelhand), Schlagschatten auf der Haut */
  s += weichG(T, 0.6, [6, 50, 18, 62], ell(12, 57.6, 3, 1.2, 20, SC, 0.4)) + weichG(T, 0.6, [6, -52, 18, -40], ell(12, -44, 2.6, 1, -20, SC, 0.35));
  s += krallen(T, [[9.6, 55, 5, 1.3, -10, 0.7], [9.8, 56.6, 5.4, 1.35, 15, 0.7], [9.4, 58, 4.8, 1.25, 40, 0.7], [9.6, -44, 4.4, 1.15, 10, -0.7], [9.8, -45.6, 4.6, 1.2, -15, -0.7], [9.4, -47, 4.2, 1.1, -40, -0.7]]);

  /* ---- Kopf (schräg von oben): schlanker Keil, Oberkante Schnabel → Kamm fast gerade, Kammbasis breit ---- */
  const kamm = [[37, -5.6], [29, -7.2], [21, -8.6], [13.6, -9.8], [11.4, -9.4], [15, -7.6], [22, -5.2], [28, -2.6], [32.6, -1.4]];
  s += teil(T, kamm, T.lg("kamm", [[0, "#7e5236"], [0.55, "#6e4c36"], [1, "#5e4c3c"]], 0, 0, 1, 0), { weich: 0.6, mal: linien(T, [[[34, -5], [24, -6.8], [14, -8.8]]], LI, 0.8, 0.3) + linien(T, [[[32, -3], [22, -5], [14, -7.6]]], SC, 0.8, 0.3) });
  const schnabelU = [[37, 0.6], [46, 0.4], [58, -0.2], [73.8, -0.7], [73.4, 0.2], [58, 1.4], [46, 2.2], [38, 2.6]];
  s += teil(T, schnabelU, "#6e5c46", { klein: 1 });
  const schaedel = [[31.6, -1.6], [33.4, -4.4], [38, -5.6], [44, -4.8], [52, -3.6], [62, -2.2], [74.6, -0.5], [74, 0], [62, -0.2], [52, 0.4], [44, 1], [38.4, 1.8], [34, 1.8]];
  const horn = T.lg("schnabel", [[0, "#5e4c3c"], [0.35, "#8a765a"], [0.8, "#76644c"], [1, "#3a2e24"]], 0, 0, 1, 0);
  s += teil(T, schaedel, horn, { weich: 0.5,
    mal: linien(T, [[[34, -3.6], [44, -4.2], [60, -2.4], [73, -0.6]]], LI, 1, 0.35) + linien(T, [[[38, 0.6], [52, -0.2], [70, -0.4]]], SC, 0.8, 0.4) + ell(41.6, -2.2, 2.6, 1.1, -8, SC, 0.32) + ell(35.4, -1.6, 2, 2, 0, "#5a4636", 0.6),
    oben: F ? linien(T, [[[46, -0.6], [60, -0.9], [72, -0.6]]], SC, 0.18, 0.35) : "" });
  /* Kiefergelenk unter dem Auge, Mulde für das Schädelfenster vor dem Auge */
  s += weichG(T, 0.3, [34, 0, 40, 3], ell(37, 1.4, 1, 0.6, 0, SC, 0.4));
  s += augeHoehle(T, 37.6, -3, 1.05, { iris: "#3a2410", iris2: "#120a04", offen: 0.75, lid: "#120c08", winkel: -6 });
  /* Fußpunkt der Box (Unterkante) auf y = 0 */
  GEN = 10;
  return Object.assign(fertig(2, `<g transform="translate(0 -110.8)">${s}</g>`, [-47.4, -200.6, 75, 0]), { kopf: [8 * 2, -124 * 2, 78 * 2, -104 * 2] });
}

const ARTEN = [
  { id: "tyrannosaurus", de: "der Tyrannosaurus", syl: "Ty-ran-no-SAU-rus", it: "il tirannosauro", itSyl: "ti-ran-no-SAU-ro", en: "Tyrannosaurus rex",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 12.35, hoehe: 4.29, f: typeof tyrannosaurus === "function" && tyrannosaurus },
  { id: "velociraptor", de: "der Velociraptor", syl: "Ve-lo-ci-RAP-tor", it: "il velociraptor", itSyl: "ve-lo-ci-RAP-tor", en: "velociraptor",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 1.9, hoehe: 0.63, f: typeof velociraptor === "function" && velociraptor },
  { id: "spinosaurus", de: "der Spinosaurus", syl: "Spi-no-SAU-rus", it: "lo spinosauro", itSyl: "spi-no-SAU-ro", en: "Spinosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 13.9, hoehe: 4.9, f: typeof spinosaurus === "function" && spinosaurus },
  { id: "allosaurus", de: "der Allosaurus", syl: "Al-lo-SAU-rus", it: "l'allosauro", itSyl: "al-lo-SAU-ro", en: "Allosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 8.54, hoehe: 2.88, f: typeof allosaurus === "function" && allosaurus },
  /* Pteranodon: Flugsaurier, KEIN Dinosaurier (gruppe „Dinosaurier" nur für die Sortierung der Urzeit-Tiere; der Tipp sagt es) */
  { id: "pteranodon", de: "der Pteranodon", syl: "Pte-ra-NO-don", it: "lo pteranodonte", itSyl: "pte-ra-no-DON-te", en: "pteranodon",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 2.45, hoehe: 4.01, fliegt: true, f: typeof pteranodon === "function" && pteranodon,
    tipp: "Der Pteranodon ist kein Dinosaurier, sondern ein Flugsaurier. Er flog mit Flügeln aus Haut." },
];
module.exports = ARTEN.filter((a) => a.f).map(({ f, ...a }) => Object.assign(a, { zeichne: f }));
