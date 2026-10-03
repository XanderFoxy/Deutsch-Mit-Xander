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
  /* fein: Filter nach Stärke und auf ein 12er-Raster gerundetem Bereich teilen (gleiche Wirkung, weniger Bytes) */
  const m = s * 3, q = 12, x0 = Math.floor((b[0] - m) / q) * q, y0 = Math.floor((b[1] - m) / q) * q, x1 = Math.ceil((b[2] + m) / q) * q, y1 = Math.ceil((b[3] + m) / q) * q;
  const key = s + "_" + x0 + "_" + y0 + "_" + x1 + "_" + y1;
  T._wf = T._wf || {};
  if (!T._wf[key]) { const id = T.id("w" + (T._w = (T._w || 0) + 1)); T.def(`<filter id="${id}" filterUnits="userSpaceOnUse" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${s}"/></filter>`); T._wf[key] = `url(#${id})`; }
  return T._wf[key];
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

/* ---------- Runde 3: Volumen je Körperteil, Schuppen als echte Formen, Reptilienauge ---------- */
/* kompakte Zahl für Pfade (".4" statt "0.4") */
const zk = (n) => String(R(n)).replace(/^(-?)0\./, "$1.");
/* Volumen (T.volumen) in weich überblendeten Zonen entlang x: EIN Inhalt (in defs), je Zone eine <use> mit eigenem
   Weichzeichner; die erste Zone liegt ganz darunter, jede weitere wird mit einer Verlaufsmaske darübergeblendet –
   so bekommt der dünne Schwanz eine engere Rundung als der dicke Rumpf, ohne Naht. zonen: [[von, bis, name, { weich,
   tiefe, umgebung }], …]. In der Szene (T.fein = false) wird der Inhalt direkt ausgegeben. */
const volZonen = (T, name, inhalt, b, zonen, u = 8) => {
  if (!T.fein) return inhalt;
  const id = T.id("vz" + name);
  T.def(`<g id="${id}">${inhalt}</g>`);
  const W = b[2] - b[0], f = (x) => R(Math.max(0, Math.min(1, (x - b[0]) / W)) * 1000) / 1000;
  let s = "";
  zonen.forEach(([von, bis, n, o], i) => {
    const fl = T.volumen(name + n, o);
    if (i === 0) { s += `<use href="#${id}" filter="${fl}"/>`; return; }
    const g = T.id("vm" + name + n);
    const st = [[0, 0], [f(von - u / 2), 0], [f(von + u / 2), 1], [f(bis - u / 2), 1], [f(bis + u / 2), 0], [1, 0]];
    T.def(`<linearGradient id="${g}g" gradientUnits="userSpaceOnUse" x1="${R(b[0])}" y1="0" x2="${R(b[2])}" y2="0">${st.map(([o2, c]) => `<stop offset="${o2}" stop-color="${c ? "#fff" : "#000"}"/>`).join("")}</linearGradient>` +
      `<mask id="${g}" maskUnits="userSpaceOnUse" x="${R(b[0] - 9)}" y="${R(b[1] - 9)}" width="${R(W + 18)}" height="${R(b[3] - b[1] + 18)}"><rect x="${R(b[0] - 9)}" y="${R(b[1] - 9)}" width="${R(W + 18)}" height="${R(b[3] - b[1] + 18)}" fill="url(#${g}g)"/></mask>`);
    s += `<use href="#${id}" filter="${fl}" mask="url(#${g})"/>`;
  });
  return s;
};
/* senkrechte Ausblend-Maske (oben unsichtbar bis yVon, ab yBis voll): Unterschenkel wachsen nahtlos aus dem Rumpf */
const maskeY = (T, name, b, yVon, yBis) => {
  const g = T.id("my" + name), f = (y) => R(Math.max(0, Math.min(1, (y - b[1]) / (b[3] - b[1]))) * 1000) / 1000;
  T.def(`<linearGradient id="${g}g" gradientUnits="userSpaceOnUse" x1="0" y1="${R(b[1])}" x2="0" y2="${R(b[3])}"><stop offset="${f(yVon)}" stop-color="#000"/><stop offset="${f(yBis)}" stop-color="#fff"/></linearGradient>` +
    `<mask id="${g}" maskUnits="userSpaceOnUse" x="${R(b[0] - 6)}" y="${R(b[1] - 6)}" width="${R(b[2] - b[0] + 12)}" height="${R(b[3] - b[1] + 12)}"><rect x="${R(b[0] - 6)}" y="${R(b[1] - 6)}" width="${R(b[2] - b[0] + 12)}" height="${R(b[3] - b[1] + 12)}" fill="url(#${g}g)"/></mask>`);
  return `url(#${g})`;
};
/* Abdunkeln (ferne Gliedmaßen: gleiche Form, nur dunkler) */
const dunkler = (T, k) => {
  const id = T.id("dk" + String(k).replace(".", "_"));
  if (!(T._dk = T._dk || {})[id]) { T._dk[id] = 1; T.def(`<filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix values="${k} 0 0 0 0 0 ${k} 0 0 0 0 0 ${k} 0 0 0 0 0 1 0"/></filter>`); }
  return `url(#${id})`;
};
/* Schuppen als echte Formen (nur fein): jede Schuppe ein kleiner Buckel – dunkle Fuge unten rechts, Hautfarbe in der
   Mitte (haut = Verlauf im Zeichenraum), Licht oben links. pkt: [[x, y, r], …]. Je Größenklasse ein Pfad aus
   Punkten mit runder Linienkappe (sehr klein). haut = null → nur Fuge + Licht (zwei Lagen, für feine Tuberkel). */
const buckel = (T, pkt, haut, o = {}) => {
  if (!T.fein || !pkt.length) return "";
  const kl = {};
  for (const [x, y, r] of pkt) { const k = Math.max(0.1, Math.round(r * 10) / 10); (kl[k] = kl[k] || []).push([x, y]); }
  let a = "", b = "", c = "";
  for (const [k, l] of Object.entries(kl)) {
    const r = +k;
    l.sort((p, q) => p[1] - q[1] || p[0] - q[0]);
    /* lang > 0: flache, quer liegende Schuppe (Kapsel) statt runder Buckel; flach: Licht breit und schwach (flache Schilde) */
    const hlen = o.lang ? R(r * o.lang) : 0, hl = `h${zk(hlen)}`, fl = o.flach || 0;
    const d = (dx, dy) => { let s = "", px = 0, py = 0; l.forEach(([x, y], i) => { const X = R(x + dx - hlen / 2), Y = R(y + dy); s += (i ? `m${zk(X - px)} ${zk(Y - py)}` : `M${zk(X)} ${zk(Y)}`) + hl; px = X + hlen; py = Y; }); return s.replace(/ -/g, "-"); };
    a += `<path d="${d(r * 0.12, r * 0.16)}" stroke-width="${zk(r * 2)}"/>`;
    if (haut) b += `<path d="${d(0, 0)}" stroke-width="${zk(r * 1.72)}"/>`;
    c += `<path d="${d(-r * (0.26 - fl * 0.12), -r * (0.3 - fl * 0.14))}" stroke-width="${zk(r * (haut ? 0.8 + fl * 0.5 : 0.9))}"/>`;
  }
  return `<g stroke-linecap="round" fill="none"><g stroke="${o.fuge || "#120c06"}" stroke-opacity="${OP(o.opF != null ? o.opF : 0.4)}">${a}</g>` +
    (haut ? `<g stroke="${haut}">${b}</g>` : "") + `<g stroke="${o.licht || "#fff2d6"}" stroke-opacity="${OP(o.opL != null ? o.opL : 0.2)}">${c}</g></g>`;
};
/* Punkte für Tuberkel in Reihen zwischen Oberkante yO(x) und Unterkante yU(x) (Reihen folgen der Körperrundung).
   lagen: [[v0, v1, abstand, rmin, rmax, dichte], …] (v = 0 oben … 1 unten). x0/x1: Bereich. */
const yBei = (pl) => (x) => { for (let i = 1; i < pl.length; i++) if (x <= pl[i][0]) { const a = pl[i - 1], b = pl[i], t = (x - a[0]) / ((b[0] - a[0]) || 1); return a[1] + (b[1] - a[1]) * t; } return pl[pl.length - 1][1]; };
const tuberkelReihen = (T, oben, unten, x0, x1, lagen) => {
  if (!T.fein) return [];
  const yO = yBei(oben), yU = yBei(unten), out = [];
  for (const [v0, v1, g, rmin, rmax, dichte] of lagen) {
    let z = 0;
    for (let v = v0; v <= v1; v += 0.001, z++) {
      /* Reihenabstand in v so, dass er etwa g Einheiten bei der dicksten Stelle entspricht */
      let x = x0 + (z % 2) * g * 0.5;
      let dvMin = 1;
      while (x < x1) {
        const top = yO(x), bot = yU(x), th = bot - top;
        if (th > 0.5) {
          const dv = g * 0.86 / th; dvMin = Math.min(dvMin, dv);
          const y = top + th * (v + (T.rnd() - 0.5) * dv * 0.3);
          if (T.rnd() < dichte * Math.min(1, th / 8)) out.push([x + (T.rnd() - 0.5) * g * 0.35, y, rmin + (rmax - rmin) * T.rnd()]);
        }
        x += g * (0.85 + T.rnd() * 0.3);
      }
      v += Math.max(0.02, dvMin) - 0.001;
    }
  }
  return out;
};
/* Punkte in einer Fläche (Gesichtsschilde: dicht gepackt, Fugen entstehen von selbst) */
const flaechenPunkte = (T, pts, g, rmin, rmax, dichte = 1) => {
  if (!T.fein) return [];
  const [x0, y0, x1, y1] = T.box(pts), out = [];
  let z = 0;
  for (let y = y0 + g * 0.4; y < y1; y += g * 0.84, z++) for (let x = x0 + (z % 2) * g / 2; x < x1; x += g) {
    const px = x + (T.rnd() - 0.5) * g * 0.3, py = y + (T.rnd() - 0.5) * g * 0.25;
    if (T.inPoly(px, py, pts) && T.rnd() < dichte) out.push([px, py, rmin + (rmax - rmin) * T.rnd()]);
  }
  return out;
};
/* Reptilien-/Vogelauge: Augenhöhle als weiche Mulde, mandelförmige Lidspalte, Iris mit dunklem Außenring, Pupille,
   harte Schattenkante der Braue über dem oberen Irisdrittel, Glanzpunkt oben links, dicker dunkler Oberlidrand, feiner
   heller Unterlidrand, Knochenbraue mit Lichtkante. Keine Wimpern, keine Karunkel. */
const reptilAuge = (T, x, y, r, o = {}) => {
  const W = r * 1.45, Ho = r * 0.8, Hu = r * 0.62, id = T.id("ra" + (T._a = (T._a || 0) + 1));
  const oben = `M${R(x - W)} ${R(y)}C${R(x - W * 0.5)} ${R(y - Ho * 1.25)} ${R(x + W * 0.45)} ${R(y - Ho * 1.3)} ${R(x + W)} ${R(y - Ho * 0.15)}`;
  const unten = `C${R(x + W * 0.5)} ${R(y + Hu * 1.1)} ${R(x - W * 0.45)} ${R(y + Hu * 1.15)} ${R(x - W)} ${R(y)}`;
  T.def(`<clipPath id="${id}"><path d="${oben}${unten}Z"/></clipPath>`);
  let s = ell(x, y - r * 0.1, r * (o.hoehle || 2.5), r * 1.9, 0, T.rg("hoehle", [[0, "#000", 0.62], [0.55, "#000", 0.34], [1, "#000", 0]]));
  s += `<path d="${oben}${unten}Z" fill="#120a04"/>`;
  const iris = T.rg("iris" + (o.n || ""), [[0, o.hell || "#e8b84c"], [0.5, o.iris || "#c08a2c"], [0.82, o.rand || "#6a3c12"], [1, "#1a0c04"]], 0.4, 0.4, 0.62);
  s += `<g clip-path="url(#${id})"><circle cx="${R(x + r * 0.06)}" cy="${R(y - r * 0.08)}" r="${R(r)}" fill="${iris}"/>`;
  s += o.pupille === "schlitz" ? ell(x + r * 0.1, y - r * 0.08, r * 0.17, r * 0.78, 0, "#060302") : `<circle cx="${R(x + r * 0.1)}" cy="${R(y - r * 0.08)}" r="${R(r * 0.42)}" fill="#060302"/>`;
  /* harte Schattenkante der Braue */
  s += `<path d="M${R(x - W)} ${R(y - Ho * 0.28)}Q${R(x)} ${R(y - Ho * 0.6)} ${R(x + W)} ${R(y - Ho * 0.48)}V${R(y - r * 2)}H${R(x - W)}Z" fill="#000" opacity=".55"/>`;
  s += ell(x - r * 0.32, y - r * 0.12, r * 0.2, r * 0.14, -20, "#fffaf0", 0.92) + ell(x + r * 0.4, y + r * 0.36, r * 0.08, r * 0.06, 0, "#fff", 0.4) + `</g>`;
  s += `<path d="${oben}" fill="none" stroke="#120a04" stroke-width="${R(r * 0.32) || 0.1}" stroke-linecap="round"/>`;
  s += `<path d="M${R(x + W)} ${R(y - Ho * 0.15)}${unten}" fill="none" stroke="#1a1008" stroke-width="${R(r * 0.16) || 0.1}"/>`;
  s += `<path d="M${R(x + W * 0.8)} ${R(y + Hu * 0.5)}C${R(x + W * 0.3)} ${R(y + Hu * 1.3)} ${R(x - W * 0.4)} ${R(y + Hu * 1.3)} ${R(x - W * 0.85)} ${R(y + Hu * 0.4)}" fill="none" stroke="${o.lidHell || "#e8d6b0"}" stroke-width="${R(r * 0.11) || 0.1}" stroke-opacity=".55"/>`;
  /* überhängender Knochenwulst: weiche Lichtkuppe darüber (keine Linie) */
  s += weichG(T, R(r * 0.35) || 0.1, [x - W * 2, y - r * 3, x + W * 2, y], ell(x + r * 0.1, y - Ho * 1.7, W * 1.2, r * 0.5, -3, "#fff0d0", 0.22));
  return s;
};
/* Kontaktschatten unter Zehen/Ballen: schmal, weich, sehr dunkel. liste: [[x0, x1], …] */
const kontakt = (T, liste) => weichG(T, 0.3, [Math.min(...liste.map((l) => l[0])) - 2, -1.5, Math.max(...liste.map((l) => l[1])) + 2, 1.5],
  liste.map(([a, b]) => ell((a + b) / 2, 0.05, (b - a) / 2, 0.3, 0, "#0a0604", 0.75)).join(""));

/* Schildernetz (nur fein): unregelmäßige Gesichtsschilde – NUR dunkle, leicht weiche Fugen (keine hellen Linien), dazu je
   Schild ein schwacher Lichtfleck oben links (flache Wölbung). */
const schildNetz = (T, pts, g, o = {}) => {
  if (!T.fein) return "";
  const [x0, y0, x1, y1] = T.box(pts), nx = Math.ceil((x1 - x0) / g) + 3, ny = Math.ceil((y1 - y0) / (g * 0.82)) + 3, V = [];
  for (let j = 0; j < ny; j++) { V.push([]); for (let i = 0; i < nx; i++) V[j].push([x0 - g + i * g + (j % 2) * g * 0.5 + (T.rnd() - 0.5) * g * 0.5, y0 - g * 0.8 + j * g * 0.82 + (T.rnd() - 0.5) * g * 0.42]); }
  const drin = (p) => T.inPoly(p[0], p[1], pts);
  let d = "", lc = [];
  const kante = (a, b) => { if (drin(a) || drin(b)) d += `M${zk(a[0])} ${zk(a[1])}L${zk(b[0])} ${zk(b[1])}`; };
  for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    /* Vierecke statt Dreiecke: waagerechte Fugen + je Zelle EINE schräge Fuge (versetzt) → unregelmäßige Schilde */
    const a = V[j][i], b = V[j][i + 1], c = V[j + 1][i + (j % 2)], e = V[j + 1][Math.min(nx - 1, i + (j % 2) + 1)];
    if (j % 2 === 0 || i % 2 === 0) kante(a, b);
    kante(a, c);
    const m = [(a[0] + b[0] + c[0] + e[0]) / 4, (a[1] + b[1] + c[1] + e[1]) / 4];
    if (drin(m)) lc.push([m[0] - g * 0.1, m[1] - g * 0.1, g * 0.4]);
  }
  return weichG(T, R(g * 0.05) || 0.05, [x0 - g, y0 - g, x1 + g, y1 + g], `<path d="${d.replace(/ -/g, "-")}" stroke="${o.fuge || "#120c06"}" stroke-width="${zk(g * (o.w || 0.11))}" stroke-opacity="${OP(o.opF || 0.45)}" stroke-linejoin="round" fill="none"/>`) +
    buckel(T, lc, null, { opF: 0, opL: o.opL || 0.1 });
};

/* ---------- Runde 4: Glieder als Z, Schilde ohne Netz ---------- */
/* Glied von a nach b mit Breite wa → wb; vorn/hinten eine Wölbung (bv/bh) mit Scheitel bei tp (0–1).
   „hinten" = die Seite rechts der Laufrichtung a→b (bei einem nach unten laufenden Bein: hinten). */
const glied = (a, b, wa, wb, bv = 0, bh = 0, tp = 0.5, n = 8, kappe = false) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), px = -dy / l, py = dx / l;
  const bump = (t) => Math.sin(Math.PI * (t < tp ? t / tp * 0.5 : 0.5 + (t - tp) / (1 - tp) * 0.5));
  const v = [], h = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, w = wa + (wb - wa) * t, x = a[0] + dx * t, y = a[1] + dy * t;
    v.push([x - px * (w / 2 + bv * bump(t)), y - py * (w / 2 + bv * bump(t))]);
    h.push([x + px * (w / 2 + bh * bump(t)), y + py * (w / 2 + bh * bump(t))]);
  }
  if (!kappe) return v.concat(h.reverse());
  /* runde Kappen an beiden Enden */
  const ux = dx / l, uy = dy / l, cap = (c, w, s) => { const o = []; for (let k = 1; k < 4; k++) { const ph = Math.PI * k / 4, c1 = Math.cos(ph), s1 = Math.sin(ph); o.push([c[0] - px * w / 2 * c1 * s + ux * w / 2 * s1 * s, c[1] - py * w / 2 * c1 * s + uy * w / 2 * s1 * s]); } return o; };
  return v.concat(cap(b, wb, 1), h.reverse(), cap(a, wa, -1));
};
/* Hinterbein als Z: Hüfte H, Knie K (vor der Hüfte), Ferse F (hinter dem Knie), Ballen B (am Boden).
   o: { wH, wK, wF, wB, schenkelV, schenkelH (Caudofemoralis), wade } → { schenkel, unter } (unter = Schienbein + Mittelfuß in einem Umriss) */
const beinZ = (H, K, Fe, B, o) => {
  const schenkel = glied(H, K, o.wH, o.wK, o.schenkelV || 1.5, o.schenkelH || 3, 0.4, 10, true);
  const sch = glied(K, Fe, o.wK, o.wF, 0.4, o.wade || 2, 0.3, 8), mf = glied(Fe, B, o.wF * 1.05, o.wB, 0, 0, 0.5, 5);
  /* Umriss Unterbein: vorn Schienbein (Knie → Ferse), vorn Mittelfuß (Ferse → Ballen), Sohle, hinten Mittelfuß, Fersenknoten, hinten Schienbein */
  const n1 = 9, n2 = 6;
  const unter = sch.slice(0, n1).concat(mf.slice(1, n2), mf.slice(n2, n2 * 2 - 1), [[Fe[0] + (sch[n1 + 1][0] - Fe[0]) * 1.15, Fe[1] + (sch[n1 + 1][1] - Fe[1]) * 1.15]], sch.slice(n1 + 2));
  return { schenkel, unter, mf: mf };
};
/* flache Schilde in einer Fläche (Gesicht, Mittelfuß): unregelmäßig, dicht, Licht oben schwach, Fuge unten weich */
const schilde = (T, pts, g, haut, o = {}) => buckel(T, flaechenPunkte(T, pts, g, g * 0.42, g * 0.56, o.dichte || 1), haut, { opF: o.opF || 0.26, opL: o.opL || 0.12, flach: 1, lang: o.lang || 0 });
/* Punkte in Gruppen (Höckergruppen mit Lücken) */
const gruppen = (T, pkt, f = 0.35, schwelle = 0.2) => pkt.filter(([x, y]) => Math.sin(x * f + 1.3) * Math.cos(y * f * 0.8 + 0.4) + (T.rnd() - 0.5) * 0.6 > schwelle);

/* Gesichtsplatten als echtes Mosaik (Voronoi): unregelmäßige, flache Schilde mit dunklen Fugen dazwischen und einem
   schwachen Licht oben links je Schild. pts = Fläche, g = Schildgröße. Nur fein. */
const mosaik = (T, pts, g, haut, o = {}) => {
  if (!T.fein) return "";
  const [x0, y0, x1, y1] = T.box(pts), sd = [];
  let z = 0;
  for (let y = y0 - g * 0.5; y < y1 + g; y += g * 0.86, z++) for (let x = x0 - g * 0.5 + (z % 2) * g / 2; x < x1 + g; x += g)
    sd.push([x + (T.rnd() - 0.5) * g * 0.55, y + (T.rnd() - 0.5) * g * 0.5]);
  const clip = (poly, a, b) => { /* Halbebene: näher an a als an b */
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, nx = b[0] - a[0], ny = b[1] - a[1], f = (p) => (p[0] - mx) * nx + (p[1] - my) * ny, out = [];
    for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length], fp = f(p), fq = f(q);
      if (fp <= 0) out.push(p); if ((fp < 0) !== (fq < 0)) { const t = fp / (fp - fq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); } }
    return out;
  };
  let d = "", dl = "";
  for (const a of sd) {
    if (!T.inPoly(a[0], a[1], pts) && !pts.some(([px, py]) => Math.hypot(px - a[0], py - a[1]) < g)) continue;
    let c = [[a[0] - g * 1.5, a[1] - g * 1.5], [a[0] + g * 1.5, a[1] - g * 1.5], [a[0] + g * 1.5, a[1] + g * 1.5], [a[0] - g * 1.5, a[1] + g * 1.5]];
    for (const b of sd) if (b !== a && Math.abs(b[0] - a[0]) < g * 2.6 && Math.abs(b[1] - a[1]) < g * 2.6) c = clip(c, a, b);
    if (c.length < 3) continue;
    const cx = c.reduce((s2, p) => s2 + p[0], 0) / c.length, cy = c.reduce((s2, p) => s2 + p[1], 0) / c.length, k = o.fuge || 0.84;
    const sh = c.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]);
    d += glatt(sh);
    dl += glatt(sh.map(([x, y]) => [cx - g * 0.12 + (x - cx) * 0.55, cy - g * 0.14 + (y - cy) * 0.5]));
  }
  return flaeche(T, pts, o.dunkel || "#140e08", o.opF || 0.32) + `<path d="${d}" fill="${haut}"/>` + weichG(T, R(g * 0.12) || 0.1, [x0 - g, y0 - g, x1 + g, y1 + g], `<path d="${dl}" fill="#fff4dc" opacity="${OP(o.opL || 0.14)}"/>`);
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
   Hüfthöhe (Darmbein) ~3,7–3,9 m, ~8 t. Schädel ~1,4–1,5 m, hoch und stumpf, Schnauze vorn breit und hoch (≈ 65 %
   der Höhe am Auge), hinten sehr breit → Augen nach vorn (Raumsehen), raue flache Knochenhöcker über/hinter dem Auge
   (Postorbitale) und davor (Lacrimale). Unterkiefer hinten am tiefsten, mit Kiefermuskel-Wölbung. Kurzer, dicker
   S-Hals mit konkaver Kehle und Nackenwulst bündig zum Hinterkopf, massiger Rumpf, tiefster Punkt am Schambeinfuß
   vor dem Oberschenkel. Schwanz ~ halbe Länge, waagerecht mit leichter S-Biegung, Wurzel unten voll
   (M. caudofemoralis), Spitze stumpf. Arme ~1 m: Oberarm mit Bizeps, Ellbogen ~90°, zwei Finger (I größer).
   Beine massig und digitigrad: Oberschenkel 1,3 m, Schienbein 1,2 m mit Wade und Achillessehne, Fersengelenk ~0,8 m
   über dem Boden, Mittelfuß steil (~70°) und eigenes Segment, drei tragende Zehen mit je drei Ballen, breite
   stumpfe Krallen. Haut: Hautabdrücke zeigen kleine Kieselschuppen mit einzelnen größeren Höckern (keine großen
   Federn beim Erwachsenen); Gesicht mit großen Schilden; Bauch mit Querschilden.
   Lippen: Cullen et al. 2023 (Science) – Zähne wohl von schuppigen Lippen bedeckt (umstritten, Carr) → Lippenwulst
   verdeckt die Zahnbasen; Maul 12° geöffnet; Zähne dicke, gekrümmte Kegel, größte an Position 3–5 im Oberkiefer.
   Farbe unbekannt → olivbraun wie ein großer Bodenräuber, Fleckung, Bauch etwas heller.
   Zeichenraum: 1 Einheit = 6,2 cm.
   ===================================================================== */
function tyrannosaurus(T) {
  const F = T.fein, US = ' gradientUnits="userSpaceOnUse"';
  GEN = F ? 10 : 2; T._ganz = [-1, -72, 201, 1];
  const st = F ? 0.8 : 1;                        // gemalte Licht-/Schattenstärke (fein: T.volumen macht die Rundung)
  const haut = T.lg("haut", [[0, "#4c4230"], [0.45, "#62563f"], [0.75, "#76684c"], [1, "#7e6f52"]], 0, -70, 0, 0, US);
  const LI = "#fff2d4", SC = "#100c06", RF = "#e8cf9e";
  const fl = () => "";
  const L = (arr, farbe, w, op) => linien(T, arr, farbe, w, op * st);

  /* ---------- Umrisse ---------- */
  const oben = [[0.2, -49.4], [2, -50.4], [8, -51.4], [18, -52.6], [30, -54.2], [44, -56.2], [58, -58.4], [72, -60.6], [86, -62.2], [98, -62.8], [110, -62], [122, -60.4], [134, -58.6], [144, -57.8],
    [152, -58.8], [159, -61.6], [165, -64.6], [170, -66.2], [173.6, -66.4]];
  const unten = [[0.4, -48], [2, -47.4], [8, -46.6], [18, -46], [30, -45.6], [46, -45], [62, -43.8], [76, -41.8], [84, -39], [90, -35.4], [95, -31], [100, -27.4], [106, -25.6], [114, -26.4], [122, -28.2],
    [134, -30.2], [144, -32.6], [150, -35.6], [157, -40.6], [163, -45.2], [168, -48.2], [172, -50.2]];
  const leib = oben.concat([[176.6, -62], [177, -55], [175.4, -51.6]], unten.slice().reverse());
  /* Schädel: hoch, stumpf, Oberkante leicht konvex, flache Höcker in der Kontur (keine Kerbe dazwischen) */
  const lippe = [[198.2, -56.6], [196, -56.5], [192, -56.7], [188, -57], [184, -57.3], [180, -57.5], [177, -57.7]];
  const schaedel = [[171.4, -61.6], [172, -65.4], [173.6, -67.2], [175.6, -68.2], [177.6, -68.8], [179.6, -68.7], [181.4, -68.5], [183.4, -69], [185.4, -68.8], [187.2, -67.5], [189.4, -66.3], [191.2, -65.4],
    [194.2, -64.4], [196.4, -63.6], [197.8, -62.4], [198.6, -60.4], [199.1, -58.4], [199, -56.9]].concat(lippe, [[174.6, -58.2], [172.6, -59.4]]);
  const H = [174.4, -57.4], AUF = 12;
  const kieferZu = [[174.8, -57.6], [177, -57.4], [180, -57.2], [184, -57], [188, -56.7], [192, -56.4], [196, -56.2], [197.6, -56], [198.1, -54.9], [197.3, -53.3], [195, -52.4], [192, -51.8], [189, -51.2], [185, -50.4],
    [181, -49.6], [177, -49.5], [174.2, -50.4], [172.8, -52.6], [173, -55.6]];
  const kiefer = drehe(kieferZu, H[0], H[1], AUF);
  const kOben = kiefer.slice(0, 8);
  /* Hinterbein als Z: Hüfte, Knie 10 E vor der Hüfte, Schienbein 22° zurück, Ferse hoch, Mittelfuß 68° nach vorn */
  const HI = [100, -48], KN = [110.6, -30.4], FE = [104.2, -13.2], BA = [108.6, -1.6];
  const bz = beinZ(HI, KN, FE, BA, { wH: 25, wK: 11.4, wF: 5.8, wB: 5.6, schenkelV: 1.6, schenkelH: 4.2, wade: 2.4 });
  const ub = bz.unter, dzx = BA[0] - 102.6;
  const z3 = [[104.6, -4.4], [108.6, -3.8], [112, -2.6], [115.4, -1.5], [116.8, -0.9], [116.6, -0.3], [114.2, -0.2], [112.2, -0.8], [110.2, -0.25], [107.8, -0.9], [105.6, -0.4]].map(([x, y]) => [x + dzx, y]);
  const z4 = [[102, -3.6], [105.2, -3.7], [108.2, -2.9], [111, -1.9], [112.9, -1.1], [112.8, -0.3], [110.8, -0.1], [109.4, -0.7], [107.8, -0.1], [106, -0.7], [104.2, -0.1], [102.4, -0.6]].map(([x, y]) => [x + dzx, y]);
  const arm = [[139.8, -46.2], [143.4, -46.2], [145.4, -43.8], [146, -41.4], [147.4, -40.6], [150, -40], [150.8, -38.6], [149.6, -37.3], [145.6, -37.1], [143.2, -37.5], [141.6, -39.3], [140.6, -42.4]];

  /* ---------- Unterbein (Schienbein + Mittelfuß) ---------- */
  let ubIn = teil(T, z3, "#5e523c", { innen: F ? reihe(T, z3.slice(0, 5), 9, 1.5, "#120c06", 0.12, 0.4, -0.05) : "", mal: L([z3.slice(0, 5)], LI, 0.5, 0.4) });
  const iU = pfad(T, ub);
  ubIn += fuell(iU, haut);
  /* Schienbein zur Rückseite −20 %, Achillessehne als gerade helle Kante, Fersenknoten, Mittelfuß 10 % dunkler mit gewölbten Querschilden */
  const sehne = [[KN[0] - 9.6, KN[1] + 6], [FE[0] - 2.6, FE[1] - 1]];
  let ubM = weichG(T, 0.9, [94, -16, 114, 0], flaeche(T, bz.mf, "#000", 0.12));
  ubM += weichG(T, 1.4, [92, -36, 118, 0], L([[[KN[0] + 3, KN[1] + 2], [FE[0] + 4, FE[1] - 2]]], LI, 2.4, 0.3) + L([[[KN[0] - 7, KN[1] + 4], [FE[0] - 3, FE[1] - 2]]], SC, 3, 0.45) +
    L([[[FE[0] + 2, FE[1] + 1], [BA[0] + 2, BA[1] - 2]]], LI, 1.2, 0.3) + L([[[FE[0] - 2, FE[1] + 2], [BA[0] - 2.4, BA[1] - 1]]], SC, 1.4, 0.4));
  ubM += weichG(T, 0.35, [92, -30, 112, -8], L([sehne], LI, 0.6, 0.7) + L([verschiebe(sehne, 0.8, 0.2)], SC, 0.45, 0.5)) +
    weichG(T, 0.8, [92, -18, 112, -8], ell(FE[0] - 2.8, FE[1], 1.3, 1.5, 0, LI, 0.32 * st) + ell(FE[0] + 2.4, FE[1] + 0.4, 0.9, 1.2, 0, SC, 0.32 * st));
  if (F) {
    /* gewölbte Querschilde auf der Vorderseite des Mittelfußes */
    const P = polyl([[FE[0] + 2.4, FE[1] + 0.6], [BA[0] + 2.4, BA[1] - 0.6]]); let qs = [];
    for (let i = 0; i < 8; i++) { const [x, y] = P.at((i + 0.5) / 8); qs.push([x - 1, y, 0.5]); }
    ubM += buckel(T, qs, haut, { opF: 0.22, opL: 0.12, lang: 1.6, flach: 1 });
    ubM += buckel(T, gruppen(T, flaechenPunkte(T, glied(KN, FE, 10, 5, 0, 2, 0.3, 4), 1.4, 0.2, 0.3, 0.7)), null, { opF: 0.2, opL: 0.1 });
  }
  ubIn += geklippt(T, [iU], ubM);
  ubIn += teil(T, z4, "#6a5c46", { innen: F ? reihe(T, z4.slice(0, 5), 9, 1.8, "#120c06", 0.12, 0.42, -0.05) : "", mal: L([z4.slice(5).reverse()], SC, 0.6, 0.8) + L([z4.slice(0, 5)], LI, 0.5, 0.5) });
  const iUB = T.id("unterbein");
  T.def(`<g id="${iUB}">${volZonen(T, "ubv", ubIn, [92, -36, 124, 0], [[0, 0, "a", { weich: 2.4, tiefe: 4, umgebung: 0.35 }]])}</g>`);
  /* Oberschenkel-Keule: reicht bis über die halbe Rumpfhöhe in die Flanke (Oberkante weich ausgeblendet), Caudofemoralis-Wulst nach hinten */
  const iSch = pfad(T, bz.schenkel);
  let schIn = fuell(iSch, haut);
  schIn += geklippt(T, [iSch], weichG(T, 2, [80, -66, 122, -20], ell(96, -46, 9, 7, -20, LI, 0.4 * st) + L([[[113, -50], [116, -40], [113, -31]]], SC, 4, 0.5 * st) + L([[[90, -40], [98, -32], [106, -28]]], SC, 3.2, 0.42 * st) + ell(110, -32, 3, 2.4, 0, LI, 0.2 * st)) +
    (F ? buckel(T, gruppen(T, flaechenPunkte(T, bz.schenkel, 1.5, 0.22, 0.34, 0.6)), null, { opF: 0.2, opL: 0.1 }) : ""));
  const iSG = T.id("schenkel");
  T.def(`<g id="${iSG}" mask="${maskeY(T, "sch", [80, -66, 124, -20], -58, -47)}">${volZonen(T, "schv", schIn, [80, -66, 124, -20], [[0, 0, "a", { weich: 5, tiefe: 4.5, umgebung: 0.32 }]])}</g>`);

  /* ---------- Arm (nah und fern) ---------- */
  let armIn = teil(T, arm, haut, { innen: fl([139, -47, 151, -36]), weich: 0.6,
    mal: L([[[141, -44.6], [141.6, -41], [143.4, -38.8]]], LI, 1, 0.5) + ell(144.6, -44, 1.2, 1.6, 0, LI, 0.25 * st) + L([[[143.6, -37.6], [148.6, -37.6]]], SC, 1, 0.55) + ell(146.2, -40.2, 0.8, 0.6, 0, SC, 0.4 * st),
    mal2: F ? L([[[144.8, -39.8], [146, -39]]], SC, 0.2, 0.9) : "", weich2: 0.1 });
  armIn += teil(T, [[149.4, -39.9], [151.2, -39.8], [152.8, -39.2], [153.6, -38.3], [153, -37.8], [151.4, -38.4], [149.6, -38.6]], haut, { klein: 1, mal: L([[[149.8, -39.6], [152.6, -39]]], LI, 0.35, 0.5) + L([[[150, -38.6], [153, -38]]], SC, 0.3, 0.6), weich: 0.15 });
  armIn += teil(T, [[149.2, -38.2], [150.6, -37.8], [151.8, -37], [152, -36.3], [151.3, -36.2], [150.2, -37], [149, -37.3]], "#5c5038", { klein: 1, mal: L([[[149.4, -38], [151.6, -36.8]]], LI, 0.25, 0.4), weich: 0.12 });
  const iA = T.id("arm");
  T.def(`<g id="${iA}">${volZonen(T, "armv", armIn, [139, -47, 154, -35], [[0, 0, "a", { weich: 0.9, tiefe: 3, umgebung: 0.35 }]])}</g>`);

  let h = "";
  /* fernes Bein: gleiche Form, ein wenig nach hinten gestellt, 25 % dunkler; ferner Arm */
  h += `<g transform="rotate(10 100 -48) translate(-2 -1.4)" filter="${dunkler(T, 0.72)}"><use href="#${iUB}"/><use href="#${iSG}"/></g>`;
  h += `<use href="#${iA}" transform="translate(1.6 1.4)" filter="${dunkler(T, 0.68)}"/>`;

  /* ---------- Rumpf, Hals, Schwanz und Kopf: EIN Inhalt mit Volumen in Zonen ---------- */
  const iL = pfad(T, leib), iK = pfad(T, kiefer), iS = pfad(T, schaedel);
  let k = fuell(iL, haut);
  /* Rachen: hinten schwarz, Zunge; untere Zähne (30 % kleiner); Unterkiefer; obere Zähne; Schädel; Lippenwulst */
  k += teil(T, [[176, -57.6]].concat(lippe.slice().reverse(), [[198.6, -56.4]], kOben.slice().reverse()), T.lg("rachen", [[0, "#060202"], [0.55, "#1c0a07"], [1, "#3a1712"]], 0, 0, 1, 0), {
    innen: flaeche(T, drehe([[178, -56.4], [184, -55.8], [190, -55.6], [194, -55.8], [190, -56.6], [183, -57]], H[0], H[1], AUF), "#6e3328", 0.85) + L([lippe.slice().reverse()], "#000", 1.2, 0.6) });
  const uzL = [[196.2, 0.9], [193.4, 1.4], [190.6, 1.8], [187.6, 1.7], [184.4, 1.4], [181.6, 1.1], [179, 0.8]];
  k += zaehne(T, uzL.map(([x, Lz]) => { const p = drehe([[x, -56.7 + (x - 177) * 0.012]], H[0], H[1], AUF)[0]; return [p[0], p[1] + 0.35, Lz, Lz * 0.48, -0.22]; }), -1);
  k += fuell(iK, haut);
  const ozL = [[196.4, 1.2], [193.6, 2], [190.5, 2.6], [187.8, 2.4], [184.5, 2], [181.9, 1.6], [179.3, 1.2], [177.4, 0.8]];
  k += zaehne(T, ozL.map(([x, Lz]) => [x, -57.2 + (198 - x) * 0.022, Lz + 0.4, (Lz + 0.4) * 0.45, 0.32]), 1, "o");
  /* Prämaxillarzähne: klein, eng, D-förmig an der Schnauzenspitze; vorn im Unterkiefer 2–3 Spitzen */
  k += zaehne(T, [[198.5, -57, 1.1, 0.5, 0.15], [197.6, -56.9, 1.2, 0.52, 0.2], [196.7, -56.8, 1, 0.48, 0.25]], 1, "o");
  k += fuell(iS, haut);

  /* gemeinsame Malschicht (über Rumpf, Kiefer, Schädel) */
  let inn = fl([0, -72, 200, -24]);
  let bd = "";
  for (const [x, w, hh] of [[16, 2, 2.6], [27, 2.4, 3.4], [39, 2.6, 4.4], [52, 3, 5.4], [66, 3.2, 6.4], [81, 3.4, 7.2], [118, 3.4, 8], [131, 3.2, 7], [143, 2.8, 5.6], [155, 2.4, 4.4]]) {
    const y = yBei(oben)(x);
    bd += `M${R(x - w / 2)} ${R(y - 1)}q${R(w * 0.9)} ${R(hh * 0.5)} ${R(w * 0.3)} ${hh}l${R(w * 0.45)} 0q${R(w * 0.9)} ${R(-hh * 0.55)} ${R(w * 0.25)} ${-hh}z`;
  }
  inn += weichG(T, 0.6, [0, -72, 170, -30], `<path d="${bd}" fill="#1e180e" opacity=".3"/>`);
  /* Licht: Rücken hell, Terminator auf ~55 % der Höhe, unteres Drittel dunkel, schmaler warmer Bodenreflex */
  const yO = yBei(oben), yU = yBei(unten), band = (v, x0, x1) => { const p = []; for (let x = x0; x <= x1; x += 6) p.push([x, yO(x) + (yU(x) - yO(x)) * v]); return p; };
  let mal = L([band(0.1, 2, 172)], LI, 4, 0.34) + L([band(0.78, 4, 170)], SC, 9, 0.5) + L([band(0.97, 6, 170)], RF, 1.6, 0.4);
  /* Oberschenkel: nur oben und hinten heller, Vorderkante als Kernschatten in den Bauch – keine geschlossene Ellipse */
  /* Okklusion: Bauch unter der Oberschenkel-Vorderkante, Flanke über dem Schenkel */
  mal += L([[[116, -50], [118, -40], [114, -31]]], SC, 4, 0.5) + L([[[86, -50], [96, -58], [106, -58]]], SC, 2, 0.2);
  /* Schlagschatten: Unterkiefer auf Hals, Arm auf Brust; Okklusion an Arm- und Beinansatz */
  mal += L([drehe([[172, -50], [180, -49], [190, -50.6]], H[0], H[1], AUF).map(([x, y]) => [x - 3, y + 1.2])], SC, 3.4, 0.55) + ell(146.4, -35.6, 4.2, 1.4, 8, SC, 0.4) + ell(141.6, -46.6, 2.6, 1.2, 0, SC, 0.4);
  /* Kopf: Oberseite hell, Kiefermuskel-Wölbung, Antorbitalmulde, Schatten unter der Lippe, Kinn rund */
  let mk = L([[[172.2, -65], [175, -67.8], [180, -68.4], [186, -68], [192, -65.2], [197.4, -62]]], LI, 2.6, 0.5) + ell(174.8, -61.4, 2.2, 3, 0, LI, 0.3 * st) + L([[[173, -58.8], [175.2, -59.4], [177.2, -61]]], SC, 1.2, 0.5);
  mk += ell(189, -61.4, 4.4, 1.6, -15, SC, 0.4 * st) + L([[[178, -58.4], [186, -58], [196, -57.8]]], SC, 1, 0.5) + L([drehe([[176, -51], [184, -51.2], [194, -53]], H[0], H[1], AUF)], SC, 2.2, 0.6);
  mk += L([drehe([[176.4, -56.4], [184, -56.2], [194, -55.6]], H[0], H[1], AUF)], RF, 0.8, 0.4);
  /* Falten: Kehle (vom Kieferwinkel in den Hals), Achsel, Kniekehle */
  const falten = [[[173.4, -50.4], [169, -48.2], [164, -45.4]], [[146, -43.4], [147.4, -40.2], [147, -36.6]], [[99, -33.4], [103.6, -32.6], [108.4, -34]]];
  let fa = linien(T, falten, SC, 0.45, 0.32) + (F ? linien(T, falten.map((p) => verschiebe(p, -0.45, -0.4)), LI, 0.35, 0.2) : "");
  inn += weichG(T, 2.4, [0, -72, 200, 0], mal) + weichG(T, 0.7, [168, -72, 200, -44], mk) + weichG(T, 0.25, [90, -60, 180, -30], fa);
  /* Haut als echte Formen: Rückenmittellinie flache Schilde, Rücken Kieselschuppen mit Höckergruppen, Flanke fein,
     Bauch Querschilde; Gesicht große Schilde mit dunklen Fugen */
  if (F) {
    const rueckenPkt = [];
    for (let x = 6; x < 170; x += 1.6 + T.rnd() * 1.2) if (T.rnd() > 0.18) rueckenPkt.push([x - 0.4, yO(x) + 0.6, 0.5 + 0.22 * Math.sin(Math.PI * x / 170) + T.rnd() * 0.12]);
    inn += buckel(T, gruppen(T, rueckenPkt, 0.22, -0.4), haut, { opF: 0.3, opL: 0.16, lang: 1.4, flach: 1 });
    /* Kiesel nur an Rücken und Schulter, in Gruppen; Flanke ausgedünnt */
    inn += buckel(T, gruppen(T, tuberkelReihen(T, oben, unten, 20, 168, [[0.06, 0.32, 1.5, 0.2, 0.32, 0.6]])), null, { opF: 0.18, opL: 0.1 });
    inn += buckel(T, gruppen(T, tuberkelReihen(T, oben, unten, 40, 150, [[0.08, 0.24, 3.2, 0.42, 0.54, 0.25]]), 0.25, 0.3), haut, { opF: 0.26, opL: 0.12, flach: 0.6 });
    inn += reihe(T, band(0.92, 96, 168), 30, 2.4, "#1e160c", 0.14, 0.22, -0.8) + reihe(T, band(0.92, 4, 90), 40, 1.2, "#1e160c", 0.1, 0.16, -0.4);
    /* Gesicht: große flache Platten auf Schnauze/Oberkiefer, längliche Lippenschuppen am Unterkiefer, Kiesel hinter dem Auge */
    inn += mosaik(T, [[180, -61.4], [181, -66.6], [188.6, -66.6], [193.8, -64.6], [198.2, -60.8], [198.8, -58.2], [194, -57.6], [186, -58.2], [181, -59]], 2.3, haut, { opF: 0.4, opL: 0.16 });
    inn += buckel(T, flaechenPunkte(T, [[171.4, -62], [172.2, -66], [175.6, -67.2], [176.2, -61], [173.4, -59.6]], 0.9, 0.24, 0.34), null, { opF: 0.22, opL: 0.12 });
    { const lk = drehe([[176.6, -55.6], [181, -55.2], [186, -54.8], [191, -54.6], [195.6, -54.6]], H[0], H[1], AUF), P = polyl(lk), q = [];
      for (let i = 0; i < 9; i++) { const [x, y] = P.at((i + 0.5) / 9); q.push([x - 0.9, y + 0.3, 0.55]); }
      inn += mosaik(T, kiefer, 1.9, haut, { opF: 0.34, opL: 0.12 }) + buckel(T, q, haut, { opF: 0.3, opL: 0.14, lang: 3, flach: 1 }); }
    inn += buckel(T, flaechenPunkte(T, [[150, -57.4], [160, -61], [170, -65], [172, -58], [168, -52], [158, -48], [150, -46]], 1.3, 0.2, 0.3, 0.5), null, { opF: 0.2, opL: 0.1 });
    /* raue Höcker (Lacrimale, Postorbitale): dicht gepackte kleine Knochenbuckel, Schlagschatten aufs obere Auge */
    /* raue Knochenhöcker: flache Erhebung mit unregelmäßigem Rand, Licht oben, harte Schattenkante darunter */
    for (const [hx, hy] of [[184.4, -67.6], [178, -68]]) {
      const hp = [[hx - 2, hy + 0.5], [hx - 1.2, hy - 0.5], [hx, hy - 0.8], [hx + 1.3, hy - 0.4], [hx + 2, hy + 0.5], [hx + 0.4, hy + 0.9]];
      inn += flaeche(T, verschiebe(hp, 0.3, 0.7), SC, 0.4) + flaeche(T, hp, haut) + weichG(T, 0.3, [hx - 3, hy - 2, hx + 3, hy + 2], L([hp.slice(0, 4)], LI, 0.5, 0.6)) +
        linien(T, [[[hx - 1, hy], [hx - 0.2, hy - 0.2]], [[hx + 0.3, hy + 0.1], [hx + 1.1, hy - 0.1]]], SC, 0.12, 0.5);
    }
  }
  /* Lippenwulst über den Zahnbasen: Licht oben, Schatten unten */
  /* Lippe: weiche, über jedem Zahn leicht nach oben gedellte Kante – Licht oben, Schattenfuge auf dem Zahn */
  const welle = []; lippe.slice().reverse().forEach(([x, y], i, a) => { welle.push([x, y]); const n = a[i + 1]; if (n) welle.push([(x + n[0]) / 2, (y + n[1]) / 2 - 0.3]); });
  inn += weichG(T, 0.3, [170, -62, 200, -50], L([verschiebe(welle, 0, 0.4)], SC, 0.5, 0.65) + L([verschiebe(welle, 0, -0.5)], LI, 0.5, 0.35));
  k += geklippt(T, [iL, iK, iS], inn);
  /* Nasenloch in flacher Grube; Kehle unter dem offenen Kiefer */
  k += weichG(T, 0.3, [194, -62, 199, -59], ell(196.4, -60.6, 1.3, 0.7, -25, SC, 0.4)) + ell(196.5, -60.7, 0.72, 0.32, -25, "#160e06", 0.9);

  let s = h + volZonen(T, "leib", k, [0, -72, 200, 0], [[0, 0, "r", { weich: 6.5, tiefe: 5, umgebung: 0.3 }], [-10, 72, "s", { weich: 2.6, tiefe: 4, umgebung: 0.3 }],
    [148, 171, "h", { weich: 4, tiefe: 4.5, umgebung: 0.3 }], [171, 210, "k", { weich: 2.2, tiefe: 3.5, umgebung: 0.35 }]], 10);
  s += `<use href="#${iUB}"/>` + `<use href="#${iSG}"/>` + `<use href="#${iA}"/>`;
  s += kontakt(T, [[100, 104], [105.4, 108.4], [109.6, 112.6], [111.6, 116], [101, 107]]);
  if (F) s = `<g filter="${T.relief("haut", { f: 3, tiefe: 0.045, okt: 2 })}">${s}</g>`;
  s += reptilAuge(T, 179.6, -64.6, 0.95, { n: "r" });
  /* Krallen: Hand (I größer), Zehen breit, stumpf, in den Boden gerichtet */
  s += krallen(T, [[153.4, -38.4, 2.2, 0.72, 55, 0.6], [151.7, -36.5, 1.5, 0.52, 75, 0.6], [116.4, -0.9, 3, 1.5, 28, 0.25], [112.6, -0.9, 2.8, 1.4, 30, 0.25], [101.2, -0.6, 2, 1.1, 160, -0.25]]);
  GEN = 10;
  return Object.assign(fertig(6.2, s, [-0.4, -69.4, 199.6, 0]), { fuesse: [100 * 6.2, 108 * 6.2], kopf: [169 * 6.2, -71 * 6.2, 201 * 6.2, -44 * 6.2] });
}

/* =====================================================================
   VELOCIRAPTOR
   RECHERCHE: Velociraptor mongoliensis (Kreide, 75–71 Mio. J., Mongolei). Erwachsen bis ~2 m lang (davon ~1 m
   Schwanz), Hüfthöhe ~0,5 m, bis 15 kg – truthahngroß, NICHT menschengroß wie im Film. Gefiedert: Federkiel-Höcker
   an der Elle (Turner et al. 2007) → große Armschwingen; Körper mit Konturfedern in Federfluren (Nacken, Schulter,
   Flanke, Brust, „Hose" am Oberschenkel), Schwanz mit Steuerfedern in Blattform (schmal an der Wurzel, breit im
   hinteren Drittel, Spitze rund). Schädel ~25 cm, lang und niedrig, Oberkante leicht konkav, Schnauze leicht
   aufgebogen, große Augenhöhle, Antorbitalmulde, Jochbogen; ~13 obere / ~14 untere gekrümmte Zähne, von Lippen
   weitgehend bedeckt. Schwanzwurzel kräftig, Schwanz durch verknöcherte Wirbelfortsätze steif und gerade.
   Hände: drei Finger (der zweite am längsten und kräftigsten) mit großen, stark gebogenen Krallen, gefaltet wie ein
   Vogelflügel, Handflächen nach innen. Beine: Oberschenkel (~16 cm) mit Knie vor der Hüfte, Schienbein (~23 cm)
   mit Wade, Fersengelenk, kurzer Mittelfuß; zweite Zehe mit ~6,5 cm Sichelkralle (seitlich flach), beim Gehen
   hochgehalten – er läuft auf den Zehen III und IV. Mittelfuß und Zehen beschuppt.
   Farbe unbekannt → wie ein Bodenvogel der Steppe: Rücken dunkelbraun, Bauch und Kehle hell (Gegenschattierung),
   dunkle Bänderung am Schwanz, dunkler Augenstreif.
   Zeichenraum: 1 Einheit = 1 cm.
   ===================================================================== */
function velociraptor(T) {
  const F = T.fein, US = ' gradientUnits="userSpaceOnUse"';
  GEN = F ? 10 : 2; T._ganz = [-10, -66, 186, 1];
  const st = F ? 0.55 : 1;
  const kleid = T.lg("kleid", [[0, "#4a3726"], [0.3, "#624a34"], [0.55, "#86694a"], [0.78, "#b89b74"], [1, "#d2bd96"]], 0, -62, 0, -30, US);
  const schw = T.lg("schwanzf", [[0, "#6a5038"], [1, "#58432f"]], 0, -56, 0, -40, US);
  const haut = T.lg("rhaut", [[0, "#7a6c5a"], [1, "#544838"]]);
  const hoseF = T.lg("hose", [[0, "#7a5e44"], [1, "#5e4834"]], 0, -31, 0, -15, US);
  const LI = "#fff0d0", SC = "#140e08", RF = "#ecd6ac", DK = "#2a1d12";
  const L = (arr, farbe, w, op) => linien(T, arr, farbe, w, op * st);
  /* Federspitzen-Reihe entlang einer Linie (Federflur-Unterkante oder Silhouette): kleine, nach hinten-unten zeigende
     Zungen; Licht oben, darunter eine dunkle Schattenfuge */
  /* rund-zungenförmige Federspitzen (breite Basis, runde Spitze), Farbe = Gefiederverlauf → fügen sich ein; nur fein */
  const spitzen = (pts, n, len, winkel, farbe, op = 1, o2 = {}) => {
    if (!F) return "";
    const P = polyl(pts); let d = "", ds = "";
    for (let i = 0; i < n; i++) {
      const t = (i + 0.3 + T.rnd() * 0.4) / n, [x, y] = P.at(t), a = (winkel + (T.rnd() - 0.5) * 16) * Math.PI / 180, l = len * (0.7 + T.rnd() * 0.5), b = l * (o2.breit || 0.5);
      const ux = Math.cos(a), uy = Math.sin(a), nx = -uy * b, ny = ux * b, ex = x + ux * l, ey = y + uy * l;
      d += `M${zk(x + nx)} ${zk(y + ny)}C${zk(ex + nx * 0.9 - ux * l * 0.15)} ${zk(ey + ny * 0.9 - uy * l * 0.15)} ${zk(ex + ux * l * 0.2 + nx * 0.3)} ${zk(ey + uy * l * 0.2 + ny * 0.3)} ${zk(ex)} ${zk(ey)}` +
        `C${zk(ex + ux * l * 0.2 - nx * 0.3)} ${zk(ey + uy * l * 0.2 - ny * 0.3)} ${zk(ex - nx * 0.9 - ux * l * 0.15)} ${zk(ey - ny * 0.9 - uy * l * 0.15)} ${zk(x - nx)} ${zk(y - ny)}Z`;
      ds += `M${zk(ex - nx * 0.6)} ${zk(ey - ny * 0.6)}Q${zk(ex + ux * l * 0.15)} ${zk(ey + uy * l * 0.15)} ${zk(ex + nx * 0.6)} ${zk(ey + ny * 0.6)}`;
    }
    return `<path d="${d.replace(/ -/g, "-")}" fill="${farbe}"${op < 1 ? ` opacity="${OP(op)}"` : ""}/><path d="${ds.replace(/ -/g, "-")}" fill="none" stroke="#1a120a" stroke-width=".14" stroke-opacity="${OP(o2.rand || 0.22)}"/>`;
  };
  /* Federflur als weicher Lappen: Unterkante als Spitzenreihe mit Schattenfuge darunter, Licht über der Kante */
  const flur = (kante, n, len, winkel) => !F ? "" : weichG(T, 0.6, T.box(kante).map((v, i) => v + (i < 2 ? -3 : 3)), L([verschiebe(kante, 0.4, 1)], SC, 0.9, 0.32)) +
    spitzen(kante, n, len, winkel, kleid) + weichG(T, 1, T.box(kante).map((v, i) => v + (i < 2 ? -4 : 4)), L([verschiebe(kante, -0.6, -1.5)], LI, 1.6, 0.26));

  /* ---------- Umrisse ---------- */
  /* Schwanz: Wurzel kräftig, 3° über der Rückenlinie angesetzt, dann gerade (Steifschwanz) */
  const sOben = [[96, -50.6], [88, -51], [80, -50.9], [60, -50.5], [40, -50.1], [20, -49.7], [6, -49.4], [2, -49.2]];
  const sUnten = [[1.4, -48.5], [4, -48.4], [10, -48.2], [26, -47.6], [44, -46.8], [62, -45.6], [80, -43.6], [92, -41.2]];
  const ruecken = [[96, -50.6], [106, -51.2], [120, -50.8], [134, -49.4], [142, -49], [148, -50.6], [152, -53.4], [155.4, -56.6], [158.4, -59], [160.6, -60.2]];
  /* Unterkante mit der Oberschenkel-Keule („Hose"), Knie vor der Hüfte bei (112 −27) */
  const unten = [[163.4, -54.4], [160.6, -51.6], [157.4, -48.2], [154.4, -44.4], [151, -40.2], [146, -35.8], [136, -32.2], [126, -31.4], [119, -31.8], [115.4, -31], [113.8, -28.6], [111.6, -26.6], [108.6, -26.2],
    [105.4, -27.6], [102, -31], [99, -36], [96, -40.2], [92, -41.2]];
  const leib = sOben.slice().reverse().concat(ruecken.slice(1), [[163.4, -59.4], [164.4, -56.4]], unten, sUnten.slice().reverse());
  const lippe = [[179.8, -57.3], [176, -57.2], [171, -57.2], [167, -56.8], [164.4, -56.2], [163, -55.6]];
  const kopf = [[158.2, -57.4], [158.8, -60.8], [161.4, -62.6], [164.6, -62.9], [167.2, -62], [170.4, -61.1], [173.8, -60.8], [176.8, -60.7], [179, -60.2], [180.4, -59.2], [180.7, -58.1]].concat(lippe, [[160.6, -55.6]]);
  const kiefer = [[162.6, -55.8], [164.4, -56.6], [167, -57.2], [171, -57.6], [176, -57.6], [180, -57.7], [180.6, -56.8], [177.6, -55.6], [170, -54.6], [164, -53.8], [161, -53.4], [159.2, -54.4]];
  /* Unterschenkel: oben 8 breit (Wade), zur Ferse auf 3,5 verjüngt; Mittelfuß schräg nach vorn */
  const ub = [[105, -30.6], [112.8, -30.2], [112.6, -26], [110.6, -22.4], [107.8, -18.2], [105, -14.6], [103.2, -12.6], [103.8, -10], [104.7, -6.6], [105.7, -4.2], [107, -2.8], [106, -1.2], [103.2, -0.6], [100.6, -0.6],
    [99.6, -2], [99.6, -4.8], [99.2, -8], [99, -11], [99.3, -12.9], [99.1, -14.6], [99.8, -18], [101.4, -22], [103, -26.4]];
  const mf = [[103.3, -12.9], [103.8, -10], [104.7, -6.6], [105.7, -4.2], [107, -2.8], [106, -1.2], [103.2, -0.6], [100.6, -0.6], [99.6, -2], [99.6, -4.8], [99.2, -8], [99, -11], [99.2, -13]];
  const z3 = [[103.4, -3.2], [106.6, -2.8], [109.6, -1.8], [111.8, -1], [112, -0.3], [109.8, -0.2], [108.4, -0.7], [106.8, -0.2], [105, -0.7], [103.6, -0.3]];
  const z4 = [[101, -2.8], [104, -2.6], [106.8, -1.8], [108.8, -1], [108.8, -0.3], [107, -0.2], [105.8, -0.6], [104.4, -0.2], [102.8, -0.6], [101.2, -0.2]];
  const z2 = [[102.4, -3.6], [104, -5.4], [105.8, -6.8], [107.4, -7.1], [107.6, -5.8], [105.8, -4.8], [104, -3.2]];

  /* ---------- Unterbein-Gruppe (nah, fern als dunkle Kopie): Hose mit unregelmäßigem Saum, Ferse frei, Schuppenfuß ---------- */
  let ubIn = teil(T, z3, "#4e443a", { klein: 1, oben: F ? reihe(T, z3.slice(0, 5), 6, 1.1, "#0e0a06", 0.08, 0.45, -0.05) : "" });
  ubIn += teil(T, z2, haut, { klein: 1, oben: F ? reihe(T, z2.slice(0, 4), 3, 1.3, "#0e0a06", 0.08, 0.45, -0.5) : "" });
  const iU = pfad(T, ub);
  ubIn += fuell(iU, haut);
  let um = weichG(T, 0.6, [97, -32, 114, 0], L([[[110.6, -26], [108.6, -20], [105.4, -15]]], SC, 1.8, 0.5) + L([[[103.6, -26], [101, -21], [100, -16]]], LI, 1.4, 0.4) + L([[[100.2, -10], [101, -4]]], LI, 0.7, 0.4) + L([[[103.4, -10], [105, -4.4]]], SC, 0.7, 0.4));
  um += weichG(T, 0.4, [97, -16, 106, -9], ell(99.6, -12.8, 0.8, 1, 0, LI, 0.4 * st) + ell(103, -12.6, 0.6, 0.9, 0, SC, 0.35 * st));
  if (F) um += reihe(T, [[103.8, -10], [104.7, -6.6], [105.6, -4.4]], 7, 1.9, "#0e0a06", 0.08, 0.5, -1.9) + buckel(T, flaechenPunkte(T, [[99.4, -12], [103.4, -12], [105, -5], [100, -2]], 0.6, 0.12, 0.18, 0.7), null, { opF: 0.3, opL: 0.15 });
  /* Federhose bis über die Ferse: Federstruktur nur im Schatten, unregelmäßiger Saum schräg nach hinten-unten */
  const hose = [[103.4, -31], [112.8, -30.6], [112.4, -25.6], [110, -21], [107, -17.4], [104.6, -15.8], [101.6, -15.6], [99.6, -16.6], [100.2, -21], [101.8, -26]];
  um += flaeche(T, hose, hoseF) + (F ? federn(T, [[106, -26], [112, -27], [109, -19], [105, -16.4], [102, -17]], 40, 105, 1.6, [["#2a1d12", 1, 0.16, 0.08]]) : "");
  um += weichG(T, 0.7, [97, -32, 114, -14], L([[[103, -28], [101, -22], [100.6, -18]]], LI, 1.4, 0.36) + L([[[111.4, -28], [109.4, -21], [106, -17]]], SC, 1.8, 0.5));
  ubIn += geklippt(T, [iU], um);

  ubIn += teil(T, z4, "#62584a", { klein: 1, mal: L([[[101.2, -0.4], [105, -0.4], [108.6, -0.3]]], SC, 0.5, 0.8) + L([[[101.2, -2.5], [104.6, -2.3], [108.4, -1.2]]], LI, 0.35, 0.5), weich: 0.25,
    oben: F ? reihe(T, z4.slice(0, 5), 6, 1.4, "#0e0a06", 0.08, 0.5, -0.05) : "" });
  /* Sichelkralle: Basis 3, seitlich flach, stark gebogen, dunkles Horn mit heller Spitze; Zehenkrallen */
  ubIn += krallen(T, [[107.2, -6.6, 6.4, 3, -48, 1.05], [111.8, -0.7, 1.6, 0.7, 18, 0.4], [108.6, -0.7, 1.5, 0.65, 18, 0.4], [103.4, -0.5, 1.2, 0.5, 170, -0.3]]);
  const iUB = T.id("unterbein");
  T.def(`<g id="${iUB}" mask="${maskeY(T, "ub", [97, -32, 116, 0], -31.6, -29.6)}">${volZonen(T, "ubv", ubIn, [97, -32, 116, 0], [[0, 0, "a", { weich: 1.3, tiefe: 3.5, umgebung: 0.35 }]])}</g>`);

  /* ---------- Flügel-Gruppe: kleine Deckfedern, große Deckfedern, gestaffelte Schwungfedern; Hand vorn ---------- */
  let wi = "";
  const sF = T.lg("schwung", [[0, "#5a4430"], [0.6, "#463424"], [1, "#33261a"]], 0, 0, 1, 0);
  for (let i = F ? 9 : 4; i >= 0; i--) {
    const t = i / (F ? 9 : 4), bx = 141 - t * 12, by = -41.6 + t * 0.4, tx = 117.6 + t * 4.4 + (i % 2) * 1.2, ty = -37.4 - t * 2.2;
    wi += feder(T, bx, by, tx, ty, 2.6 - t * 0.4, sF, { seite: -1, schaft: "#d8c8a8", dichte: 0.24, rand: false });
    if (F) wi += weichG(T, 0.25, [116, -44, 143, -34], L([[[tx + 1, ty + 0.9], [(tx + bx) / 2, (ty + by) / 2 + 1.2]]], SC, 0.4, 0.5));
  }
  /* große Deckfedern (Reihe über den Schwungfeder-Basen) */
  const gD = [];
  for (let i = 0; i < 9; i++) gD.push([140.6 - i * 1.6, -41.4 + i * 0.1]);
  wi += spitzen(gD, 8, 3, 172, "#5e4834") + spitzen(gD.map(([x, y]) => [x - 0.6, y - 1.6]), 8, 2.4, 172, "#6a5240");
  /* kleine Deckfedern als Schuppenreihe an der Vorderkante */
  wi += spitzen([[142, -44.2], [138, -44.6], [133, -44.4], [128.6, -43.6]], 8, 1.4, 168, "#7a6048");
  const fl = [[128, -43], [134, -45.2], [140, -45.2], [143.2, -43], [143.6, -40.4], [141, -39.4], [136, -40.2], [130, -40.6]];
  wi = teil(T, fl, "#6a5240", { klein: 0, mal: L([[[130, -44], [136, -45], [142, -44]]], LI, 1.2, 0.4) }) + wi;
  /* Hand: Finger II am längsten und kräftigsten, I kurz mit großer Kralle, III dünn; Gelenkpolster */
  const fing = [[[141.8, -40.4], [144.8, -39.8], [148.4, -38.4], [151.2, -36.8], [151, -35.8], [148, -36.8], [144.6, -38], [141.6, -39]],
    [[141.6, -38.6], [143.6, -38.4], [145.6, -37.6], [145.4, -36.8], [143.4, -37.2], [141.4, -37.4]],
    [[141.2, -39], [144.4, -37.6], [147.2, -35.8], [149.2, -34.2], [148.8, -33.6], [146.6, -34.8], [143.6, -36.4], [141, -37.8]]];
  fing.forEach((p, i) => { wi += teil(T, p, i === 2 ? "#4e443a" : haut, { klein: 1, weich: 0.15, mal: L([p.slice(0, 4)], LI, 0.25, 0.5) + L([p.slice(4)], SC, 0.25, 0.5),
    oben: F ? `<path d="${p.slice(1, 3).map(([x, y]) => `M${zk(x)} ${zk(y + 0.2)}h0`).join("")}" stroke="#2a1d12" stroke-width=".7" stroke-linecap="round" stroke-opacity=".35"/>` : "" }); });
  wi += krallen(T, [[150.8, -36.4, 4.2, 1.2, 40, 1.1], [145.2, -37.2, 3.4, 1.05, 60, 1.1], [148.8, -34, 3, 0.9, 72, 1.1]]);
  const iW = T.id("fluegel");
  T.def(`<g id="${iW}">${volZonen(T, "wiv", wi, [115, -47, 156, -28], [[0, 0, "a", { weich: 1, tiefe: 3, umgebung: 0.4 }]])}</g>`);

  /* ---------- Steuerfedern: Blattform – schmal ab x ≈ 50, im hinteren Drittel ~13 breit, Spitze rund ---------- */
  const sp = (x) => x > 50 ? 0.6 : 0.6 + 6.2 * Math.pow(Math.sin(Math.PI * Math.min(1, (50 - x) / 62)), 0.9);
  const steuer = [], tipsO = [], tipsU = [];
  for (let i = 0; i < 12; i++) {
    const t = i / 11, x = 52 - t * 57, L2 = 4 + t * 9, yo = -50.2 + t * 0.6, yu = -47.4 - t * 0.4;
    const ex = x - L2 * 0.96, eo = -48.8 - sp(ex) - 0.4, eu = -48.8 + sp(ex) + 0.2;
    steuer.push([x, yo, ex, eo, 1.8 + t * 1.2, 1], [x, yu, ex, eu, 1.8 + t * 1.2, -1]);
    tipsO.push([ex, eo - 0.5]); tipsU.push([ex, eu + 0.5]);
  }
  steuer.push([6, -48.6, -8.6, -48.8, 3.6, 1]);
  const wedel = [[62, -50.2], [56, -50.6]].concat(tipsO, [[-9.4, -48.8]], tipsU.slice().reverse(), [[56, -46.6], [62, -46.6]]);
  const iWd = pfad(T, wedel);
  let tw = fuell(iWd, T.lg("wedelf", [[0, "#806246"], [1, "#6a5038"]]));
  const stG = T.lg("steuer", [[0, "#7a5e44"], [1, "#5c4632"]]);
  if (F) for (const [bx, by, sx, sy, b, sd] of steuer) tw += feder(T, bx, by, sx, sy, b, stG, { seite: sd, schaft: "#2a1d12", dichte: 0.3, rand: false }) + weichG(T, 0.2, [-12, -58, 56, -38], L([[[sx + 0.4, sy + sd * 0.5], [(sx + bx) / 2, (sy + by) / 2 + sd * 0.8]]], SC, 0.3, 0.45));
  else tw += linien(T, steuer.filter((_, i) => i % 2 === 0).map(([bx, by, sx, sy]) => [[bx, by], [sx, sy]]), "#2a1d12", 0.3, 0.25);
  /* Bänder leicht gebogen, zu den Federspitzen weich auslaufend; Kontrast in der Szene kleiner */
  let bd = "";
  for (const x of [46, 34, 22, 10, -1]) bd += `M${x} -56q-1.2 7.2 0 16h3.6q-1.2-8.8 0-16z`;
  tw += geklippt(T, [iWd], weichG(T, 0.6, [-10, -58, 56, -38], `<path d="${bd}" fill="${DK}" opacity="${OP(F ? 0.4 : 0.24)}"/>`) +
    weichG(T, 1.2, [-12, -58, 56, -38], linien(T, [tipsO.slice(4)], "#e0ccaa", 1.6, 0.3) + linien(T, [tipsU.slice(4)], "#e0ccaa", 1.6, 0.3) + linien(T, [[[50, -48.8], [20, -48.8], [-6, -48.8]]], SC, 1.2, 0.25)));

  /* ---------- Zusammensetzen ---------- */
  let h = `<use href="#${iUB}" transform="rotate(12 104 -40) translate(-1.4 -.4)" filter="${dunkler(T, 0.68)}"/>` + `<use href="#${iW}" transform="translate(2 -1.6)" filter="${dunkler(T, 0.62)}"/>`;
  h += volZonen(T, "wedel", tw, [-12, -58, 64, -38], [[0, 0, "a", { weich: 1.2, tiefe: 2.5, umgebung: 0.45 }]]);
  const iL = pfad(T, leib), iK = pfad(T, kiefer), iH = pfad(T, kopf);
  let k = fuell(iL, kleid) + fuell(iK, "#a08868");
  const uz = [[178.4, 0.5], [176.2, 0.6], [173.4, 0.5], [170.8, 0.65], [168.2, 0.55], [166, 0.4]];
  if (F) k += zaehne(T, uz.map(([x, Lz]) => [x, yBei(lippe.slice().reverse())(x) - 0.2, Lz + 0.25, (Lz + 0.25) * 0.5, 0.35]), 1);
  k += fuell(iH, kleid);
  const yO = yBei(sOben.slice().reverse().concat(ruecken.slice(1))), yU = yBei(sUnten.concat(unten.slice().reverse())), band = (v, x0, x1) => { const p = []; for (let x = x0; x <= x1; x += 4) p.push([x, yO(x) + (yU(x) - yO(x)) * v]); return p; };
  /* Schwanzbänder auf dem Schwanzkern, deckungsgleich mit dem Fächer */
  let inn = weichG(T, 0.6, [-10, -58, 70, -38], `<path d="M46 -56q-1.2 7.2 0 16h3.6q-1.2-8.8 0-16zM34 -56q-1.2 7.2 0 16h3.6q-1.2-8.8 0-16zM22 -56q-1.2 7.2 0 16h3.6q-1.2-8.8 0-16zM10 -56q-1.2 7.2 0 16h3.6q-1.2-8.8 0-16zM58 -56q-1.2 7.2 0 16h3.4q-1.2-8.8 0-16z" fill="${DK}" opacity="${OP(F ? 0.4 : 0.24)}"/>`);
  /* Gegenschattierung + EIN Licht oben links: Rücken/Nacken dunkler im Ton, aber im Licht; Terminator auf 55 %; Bauch, Kehle hell mit warmem Reflex */
  let mal = L([band(0.1, 92, 162)], LI, 2.6, 0.4) + L([band(0.8, 96, 160)], SC, 5, 0.42) + L([band(0.96, 100, 160)], RF, 1, 0.45) + L([band(0.15, 4, 94)], LI, 1.2, 0.3) + L([band(0.85, 4, 94)], SC, 1.6, 0.35);
  mal += L([[[154, -46], [158, -50.6], [162, -53.6]]], SC, 2.2, 0.45) + ell(100.6, -40, 4, 4, 0, SC, 0.3) + ell(146, -37, 3, 2, 0, SC, 0.35);
  /* Kopf: Antorbitalmulde, Jochbogen-Lichtgrat unter dem Auge, Kiefermuskel hinter dem Auge, Augenstreif */
  let mk = L([[[159.2, -60.6], [161.6, -62.4], [165, -62.6], [170, -61], [177, -60.4], [180.4, -59.2]]], LI, 1, 0.45);
  mk += ell(170.6, -59.2, 3, 1, -6, SC, 0.5 * st) + L([[[162.6, -57.6], [166, -58], [169, -57.8]]], LI, 0.45, 0.5) + ell(160.6, -59.2, 1.4, 1.6, 0, LI, 0.3 * st) + L([[[159.6, -57.2], [161.4, -56.4]]], SC, 0.6, 0.5);
  mk += `<path d="M157.6 -59.2q3.4-1.4 6.8-1.2q2.8 0 5.2.6q-2.6.6-5.2.3q-3.4 0-6.8 1.4z" fill="${DK}" opacity=".55"/>`;
  mk += L([[[161, -53.6], [168, -54.4], [178, -55.6]]], SC, 1, 0.5) + L([lippe.map(([x, y]) => [x, y + 0.3])], SC, 0.3, 0.6);
  inn += weichG(T, 1.4, [-2, -64, 166, 0], mal) + weichG(T, 0.35, [156, -64, 182, -52], mk);
  /* Federfluren als weiche Lappen (Schulterdecke, Flanke, Nacken, Brust), feine Striche nur im Schatten */
  inn += flur([[148, -47.6], [142, -46.4], [134, -45.6], [126, -45.6], [118, -46.6]], 10, 2.2, 160);
  inn += flur([[146, -40.4], [138, -38.8], [128, -38], [118, -38.6], [110, -40]], 11, 2.4, 150);
  inn += flur([[160, -55.4], [157, -52], [154, -49.4], [151, -47.4]], 6, 1.8, 140);
  inn += flur([[160.4, -51.4], [157.6, -47.6], [154.6, -43.6], [150.6, -39.6]], 6, 1.8, 120);
  inn += flur([[114, -44.4], [108, -42.6], [103, -40], [99.6, -36.4]], 7, 2, 140);
  if (F) inn += federn(T, [[98, -40], [150, -37.4], [158, -48], [162, -53.4], [158, -52], [150, -38.4], [120, -32.4], [110, -30], [100, -34]], 90, 175, 1.8, [["#2a1d12", 1, 0.18, 0.08]]);
  /* Schnauze: Schuppen der Kopfform folgend, zur Lippe größer, Kontrast −40 %; Federn auf Hinterkopf */
  if (F) inn += buckel(T, flaechenPunkte(T, [[167.6, -61.4], [174, -60.5], [179, -60], [180.6, -58.4], [179.6, -57.6], [172, -57.6], [167.6, -58]], 0.5, 0.12, 0.18, 0.9), null, { opF: 0.22, opL: 0.1 }) +
    buckel(T, flaechenPunkte(T, [[165, -57.8], [179.6, -57.7], [179.6, -57.3], [165, -57.1]], 0.7, 0.2, 0.26), null, { opF: 0.24, opL: 0.1 }) + reihe(T, lippe, 14, -0.45, "#140e08", 0.05, 0.3);
  inn += spitzen([[158.6, -60], [161, -62], [164, -62.6]], 5, 1, 190, kleid);
  k += geklippt(T, [iL, iK, iH], inn);
  /* Silhouette mit Federspitzen aufbrechen: Nacken, Rücken, Brust, Hose */
  /* Silhouette aufbrechen: schmale, flach anliegende Federspitzen, Basis innen */
  /* Silhouette aufbrechen: weicher Federrand (Fransen aus kurzen Federstrahlen über die Kontur) statt harter Zacken */
  /* weicher, gewellter Federrand: kleine runde Federenden entlang der Kontur, halb über der Silhouette, in Gefiederfarbe
     (dieselbe Volumen-Gruppe → gleiches Licht) */
  const wellen = (kante, a, r, farbe) => {
    if (!F) return "";
    const P = polyl(kante), n = Math.round(P.len / a);
    let d = "";
    for (let i = 0; i <= n; i++) { const [x, y, nx, ny] = P.at(i / n), o = r * (0.15 + T.rnd() * 0.4); d += `M${zk(x + nx * o)} ${zk(y + ny * o)}h0`; }
    return `<path d="${d.replace(/ -/g, "-")}" stroke="${farbe}" stroke-width="${zk(r * 2)}" stroke-linecap="round"/>`;
  };
  k += wellen([[161.4, -60], [158.6, -59.2], [155.6, -56.8], [152.6, -53.8], [148.6, -51], [140, -49.4], [128, -49.8], [112, -51.2], [96, -50.8], [80, -51], [60, -50.6]], 0.9, 0.55, kleid);
  k += wellen([[147.6, -38], [151.8, -42.2], [155.6, -47.4], [158.8, -51.4], [161.6, -54.6]], 0.9, 0.5, kleid);
  k += wellen([[60, -46], [72, -45], [84, -43.4], [92, -41.4], [99, -36], [102.8, -31.4], [105.6, -28.4], [108.6, -27.1], [111.6, -27.8], [114, -31]], 0.9, 0.5, kleid);
  k += ell(178.6, -59.3, 0.5, 0.26, -10, "#0d0905", 0.95);

  let s = h + volZonen(T, "leib", k, [-4, -66, 184, -24], [[0, 0, "r", { weich: 3.6, tiefe: 4, umgebung: 0.35 }], [-10, 92, "s", { weich: 1.2, tiefe: 3, umgebung: 0.35 }],
    [150, 160, "h", { weich: 2.2, tiefe: 3.5, umgebung: 0.35 }], [160, 190, "k", { weich: 1.2, tiefe: 3, umgebung: 0.4 }]], 6);
  s += `<use href="#${iUB}"/>` + `<use href="#${iW}"/>`;
  s += kontakt(T, [[100.6, 103.6], [104, 107], [107.6, 110.8], [109.4, 112], [98, 103]]);
  s += reptilAuge(T, 164.4, -59.9, 1.38, { n: "v", hell: "#f0c85a", iris: "#c8902e" });
  /* in der Szene: heller Augenpunkt, helle Sichelkralle (bleiben auch klein lesbar) */
  if (!F) s += ell(164.2, -60.2, 0.5, 0.4, 0, "#ffe9a0", 0.9);
  GEN = 10;
  return Object.assign(fertig(1, s, [-9.6, -63.6, 180.8, 0]), { fuesse: [101, 108], kopf: [154, -66, 183, -50] });
}

/* =====================================================================
   SPINOSAURUS
   RECHERCHE: Spinosaurus aegyptiacus (Kreide, ~99–93 Mio. J., Nordafrika). Größter bekannter Raubsaurier:
   ~14–15 m lang, ~7 t. Rückensegel aus Dornfortsätzen bis 1,65 m Höhe, am höchsten über dem hinteren Rumpf (≈ 60 %
   der Segellänge von vorn); die Dornen stehen unregelmäßig und neigen sich leicht nach hinten, die Haut dazwischen ist
   gespannt und leicht eingesunken. Ibrahim et al. 2020 (Nature): Schwanz mit hohen, dünnen Dornen oben und tiefen
   Chevrons unten – ein tiefes, flexibles Ruder („Paddelschwanz") wie bei Molch/Aal, erst im letzten Drittel
   verjüngt; Muskelkern in der Mitte, oben und unten flache Flossensäume. Kurze, kräftige Hinterbeine mit Wade,
   Fersengelenk und langen, breiten, flachen Zehen (Waten), langer Rumpf, S-Hals mit kräftigem Ansatz.
   Schädel lang und flach wie beim Krokodil; Maullinie S-förmig: Kerbe im Oberkiefer hinter der verbreiterten,
   nach unten gewölbten Schnauzenspitze („Rosette"), passende Aufwölbung im Unterkiefer; kegelförmige Zähne, vorn
   2–3× länger und nach vorn geneigt, greifen ineinander. Nasenlöcher weit nach hinten verlegt, flacher Kamm
   zwischen Auge und Nasenloch. Arme kräftig, große, stark gebogene Daumenkralle (Fischfang). Haltung: zweibeinig
   an Land (Sereno 2022). Farbe unbekannt → grau-braun wie ein Krokodil, Bauch heller, Segel rostbraun.
   Zeichenraum: 1 Einheit = 7,8 cm (≈ 179 Einheiten ≈ 14 m).
   ===================================================================== */
function spinosaurus(T) {
  const F = T.fein, US = ' gradientUnits="userSpaceOnUse"';
  GEN = F ? 10 : 2; T._ganz = [-2, -66, 181, 1];
  const st = F ? 0.55 : 1;
  const haut = T.lg("haut", [[0, "#4e4a38"], [0.4, "#625b45"], [0.7, "#766c52"], [1, "#7c7258"]], 0, -56, 0, 0, US);
  const LI = "#fff0d0", SC = "#0e0d08", RF = "#dccaa0";
  const fl = (b) => fleckung(T, "fleck", b, "#16140c", 0.2, 0.12, 0.28);
  const L = (arr, farbe, w, op) => linien(T, arr, farbe, w, op * st);

  /* ---------- Schwanz: Mittellinie mit leichter S-Biegung, tief bis weit nach hinten, runde schmale Spitze ---------- */
  const cT = yBei([[0, -34.2], [4, -33.6], [12, -32.8], [25, -32], [40, -32.6], [60, -34.4], [80, -35.6]]);
  const dT = yBei([[0, 1.2], [4, 2.6], [12, 4.6], [25, 6.4], [40, 7.4], [60, 8.6], [80, 10.4]]);
  const sOben = [], sUnten = [];
  for (let x = 2; x <= 80; x += F ? 3 : 6) { sOben.push([x, cT(x) - dT(x) - (F ? 0.4 * Math.sin(x * 1.3) : 0)]); sUnten.push([x, cT(x) + dT(x)]); }
  /* ---------- Rumpf, Hals ---------- */
  const ruecken = [[84, -44.2], [92, -42.4], [104, -41.4], [116, -41.2], [126, -41.8], [132, -43.2], [136.4, -45.2], [140.4, -47.4], [143, -48], [146, -49.4], [150, -51.2], [153.6, -52.4]];
  const unten = [[154.4, -43.6], [151, -42.6], [147, -40], [142.6, -35.6], [137.6, -30.6], [131, -25.8], [120, -22], [108, -20.6], [96, -21.6], [88, -24.2], [83, -26]];
  const leib = [[-0.6, -34.2]].concat(sOben, ruecken, [[156.6, -52.4], [157.4, -46]], unten, sUnten.slice().reverse());
  /* ---------- Kopf: Maullinie S-förmig mit Kerbe hinter der Rosette ---------- */
  const lippe = [[178.4, -45.8], [176.6, -45.4], [174.4, -45.6], [172.2, -46.4], [170.4, -47.4], [168.6, -47.8], [166.6, -47.4], [164, -46.9], [160, -46.7], [157, -46.6], [155.6, -46.2]];
  const schaedel = [[154.4, -49.4], [155, -52.6], [157, -54.4], [159.4, -55], [161.4, -54.8], [163.6, -55], [165.6, -54.4], [167.4, -53.4], [170, -52.2], [173, -51.2], [175.6, -50.6], [177.4, -49.9], [178.7, -48.6],
    [179.1, -47.2], [178.8, -46.2]].concat(lippe, [[154.6, -46.6]]);
  const kiefer = [[155.2, -47], [158, -47.2], [162, -47.4], [166, -47.8], [168.6, -48.2], [171, -47.8], [173.6, -46.8], [176, -46.2], [178.2, -46.1], [178.6, -44.6], [177.2, -43.4], [174.4, -43.4], [172, -44],
    [168, -43.8], [163, -43.2], [159, -42.4], [156.4, -42], [154.6, -43], [154.2, -45]];
  /* ---------- Hinterbein: Wade, Achillessehne, Fersenknoten, Mittelfuß, lange gespreizte Zehen ---------- */
  const ub = [[80, -27], [86, -28.4], [90.2, -24.6], [91.2, -20.6], [90.4, -17], [88.6, -14.2], [86.8, -12], [86.5, -10.2], [86.9, -8.6], [87.8, -6], [89, -3.8], [88, -1.6], [85.6, -0.6], [83.4, -0.4],
    [82, -1.6], [81.4, -4], [80.6, -6.6], [80, -8.8], [79.4, -10.4], [79.8, -12], [79.6, -15.6], [78.4, -18.6], [78.6, -21.8], [79.6, -24.6]];
  const mf = [[86.6, -10.6], [86.9, -8.6], [87.8, -6], [89, -3.8], [88, -1.6], [85.6, -0.6], [83.4, -0.4], [82, -1.6], [81.4, -4], [80.6, -6.6], [80, -8.8], [79.6, -10.6], [83, -11.6]];
  const z2 = [[86.4, -4.6], [89.6, -4.9], [93, -4.6], [95.6, -4.1], [96, -3.5], [93, -3.4], [89.6, -3.5]];
  const z3 = [[86, -4], [89.8, -3.6], [93.6, -2.6], [97.2, -1.6], [99.4, -1.1], [99.4, -0.5], [97, -0.3], [95, -0.8], [92.8, -0.4], [90.4, -1], [88, -0.8]];
  const z4 = [[83.6, -3.2], [86.8, -3.4], [90, -2.6], [93.2, -1.6], [95.8, -1], [95.8, -0.3], [93.6, -0.1], [92, -0.6], [90.2, -0.1], [88.2, -0.6], [86.2, -0.1], [84, -0.6]];
  const arm = [[124.4, -36], [129.6, -35], [131.2, -30], [131, -26.4], [133.4, -23], [136.4, -19.8], [137.8, -18], [136.6, -16.6], [133.8, -17.6], [130.4, -20.4], [127.8, -24.4], [125.8, -29], [124.4, -33]];

  /* ---------- Segel: Dornen unregelmäßig (±25 %), 11° nach hinten geneigt, Haut eingesunken, wellige Kante ---------- */
  /* Vorderkante flach-konkav ansteigend, breite runde Krone um x ≈ 96, Hinterkante steiler */
  const hoehe = (xb) => xb >= 96 ? -42 - 20.6 * Math.sin(Math.PI / 2 * Math.pow(Math.max(0, (128 - xb) / 32), 1.5)) : -62.6 + 17.6 * Math.pow((96 - xb) / 20, 1.8);
  const dornen = [];
  for (let xb = 127, i = 0; xb > 75; i++) { const top = hoehe(xb) - (T.rnd() - 0.5) * 1; dornen.push([xb, top, xb - (-40 - top) * 0.19]); xb -= 2.6 * (0.75 + T.rnd() * 0.5); }
  const kante = [];
  dornen.forEach(([xb, top, xt], i) => { kante.push([xt, top]); const n = dornen[i + 1]; if (n) kante.push([(xt + n[2]) / 2, (top + n[1]) / 2 + 0.2 + T.rnd() * 0.6]); });
  const segel = [[129, -41]].concat(kante, [[72, -44.6], [74, -40], [100, -38]]);
  const segelF = T.lg("segel", [[0, "#7a3f22"], [0.4, "#8e5230"], [0.78, "#6e5038"], [0.92, "#5e5442"], [1, "#625b45"]], 0, -64, 0, -40, US);
  let si = "", dl = "", dd = "", sm = "";
  for (const [xb, top, xt] of dornen) {
    /* Dorn als schmaler Zylinder: Licht links, Schatten rechts, nach oben auf 50 % verjüngt */
    dl += `M${R(xb - 0.35)} -40L${R(xt - 0.18)} ${R(top + 0.6)}`; dd += `M${R(xb + 0.35)} -40L${R(xt + 0.18)} ${R(top + 0.6)}`;
  }
  for (let i = 0; i < dornen.length - 1; i++) { const a = dornen[i], b = dornen[i + 1]; sm += `M${R((a[0] + b[0]) / 2)} -40.6L${R((a[2] + b[2]) / 2)} ${R((a[1] + b[1]) / 2 + 1.6)}`; }
  if (F) si += weichG(T, 0.6, [70, -66, 131, -38], `<path d="${sm}" stroke="${SC}" stroke-width="1.3" stroke-opacity=".22"/>`) + `<path d="${dl}" stroke="#f2c8a0" stroke-width=".42" stroke-opacity=".3"/>`;
  si += `<path d="${dd}" stroke="#1e0e06" stroke-width=".55" stroke-opacity=".35"/>`;
  si += weichG(T, 2, [70, -66, 131, -38], L([[[124, -45], [112, -53], [100, -58], [90, -58]]], LI, 4, 0.22) + L([[[126, -41], [100, -40.6], [78, -42]]], SC, 4, 0.45) + (F ? L([kante.map(([x, y]) => [x + 0.4, y + 1.6])], "#2a1408", 1.6, 0.3) : ""));
  if (F) si += linien(T, [[[124, -42.6], [110, -46], [96, -48], [84, -46.6]], [[122, -44.6], [108, -50], [96, -52.6], [86, -50]]], "#3a1e0e", 0.12, 0.25);
  let h = teil(T, segel, segelF, { innen: si });

  /* ---------- Unterbein (nah und fern) ---------- */
  let ubIn = teil(T, z2, "#4e4836", { klein: 1 }) + teil(T, z3, "#5e5642", { innen: F ? reihe(T, z3.slice(0, 5), 4, 1.3, "#100c06", 0.14, 0.5, -0.05) : "", mal: L([[[86.6, -3.6], [93, -2.4], [98.6, -1]]], LI, 0.4, 0.4) });
  const iU = pfad(T, ub);
  ubIn += fuell(iU, haut);
  let ubM = weichG(T, 0.7, [78, -12, 91, 0], flaeche(T, mf, "#000", 0.12));
  ubM += weichG(T, 0.9, [76, -30, 93, 0], L([[[90, -24], [90.2, -18], [87.6, -13]]], SC, 2, 0.5) + L([[[81.6, -24], [79.8, -20], [79.6, -16]]], LI, 1.6, 0.36) + L([[[83, -8.4], [84.4, -3]]], LI, 0.9, 0.3) + L([[[86.4, -8.4], [88.2, -3.6]]], SC, 0.9, 0.35));
  ubM += weichG(T, 0.3, [77, -18, 90, -8], L([[[79.4, -15.4], [80, -11.6]]], LI, 0.4, 0.7) + L([[[80.4, -15.4], [80.8, -11.8]]], SC, 0.32, 0.55)) + weichG(T, 0.6, [77, -13, 90, -7], ell(79.8, -10.4, 0.9, 1.1, 0, LI, 0.3 * st) + ell(86.4, -10.2, 0.7, 1, 0, SC, 0.3 * st));
  if (F) ubM += reihe(T, [[86.6, -9.6], [87.6, -6.4], [88.8, -4]], 7, 1.8, "#100c06", 0.12, 0.45, -1.8) + buckel(T, flaechenPunkte(T, [[80, -26], [90, -24], [89, -16], [86, -12.6], [80, -12.6], [79, -20]], 1.1, 0.16, 0.24, 0.5), null, { opF: 0.22, opL: 0.1 });
  ubIn += geklippt(T, [iU], fl([77, -30, 92, 0]) + ubM);
  /* Zehe IV vorn, mit Gelenkfalten */
  ubIn += teil(T, z4, "#6c6450", { innen: F ? reihe(T, z4.slice(0, 5), 4, 1.6, "#100c06", 0.14, 0.5, -0.05) : "", mal: L([[[84, -0.4], [90, -0.4], [95.4, -0.3]]], SC, 0.55, 0.8) + L([[[84, -3], [89, -2.8], [95, -1.2]]], LI, 0.45, 0.5) });
  const iUB = T.id("unterbein");
  T.def(`<g id="${iUB}" mask="${maskeY(T, "ub", [76, -30, 102, 0], -26.6, -23)}">${volZonen(T, "ubv", ubIn, [76, -30, 102, 0], [[0, 0, "a", { weich: 1.8, tiefe: 4, umgebung: 0.35 }]])}</g>`);

  /* ---------- Arm: Muskelkeule mit Schulteransatz, kräftiger Unterarm, große Daumenkralle ---------- */
  let armIn = teil(T, arm, haut, { innen: fl([123, -37, 139, -15]), weich: 0.8,
    mal: L([[[125.4, -34.4], [126.4, -30], [128.6, -25.4]]], LI, 1.2, 0.5) + ell(127.6, -32, 1.4, 2.2, 0, LI, 0.12 * st) + L([[[128.4, -23.6], [132.6, -19.6], [136.4, -17]]], SC, 1.1, 0.55) + ell(130.6, -27, 1, 0.8, 0, SC, 0.4 * st),
    mal2: F ? L([[[129.6, -27.2], [131, -26.2]]], SC, 0.22, 0.9) : "", weich2: 0.1 });
  const finger = [[[136.2, -19.6], [137.8, -19.8], [138.8, -19], [138.2, -18.4], [136.6, -18.6]], [[136.2, -18.2], [138.4, -17.2], [139.8, -15.8], [139.2, -15.2], [137.6, -16.2], [135.8, -17]],
    [[135.6, -17.2], [137, -15.8], [137.6, -14.4], [136.8, -14.2], [135.6, -15.4], [134.8, -16.6]]];
  finger.forEach((p, i) => { armIn += teil(T, p, i === 2 ? "#5a523e" : haut, { klein: 1, weich: 0.15, mal: L([p.slice(0, 3)], LI, 0.3, 0.5) }); });
  const iA = T.id("arm");
  T.def(`<g id="${iA}">${volZonen(T, "armv", armIn, [123, -37, 141, -13], [[0, 0, "a", { weich: 1, tiefe: 3, umgebung: 0.35 }]])}</g>`);
  h += `<use href="#${iUB}" transform="rotate(8 84 -30) translate(-1 -.6)" filter="${dunkler(T, 0.66)}"/>` + `<use href="#${iA}" transform="translate(1.6 1.4)" filter="${dunkler(T, 0.66)}"/>`;

  /* ---------- Rumpf, Hals, Schwanz und Kopf ---------- */
  const iL = pfad(T, leib), iK = pfad(T, kiefer), iS = pfad(T, schaedel);
  let k = fuell(iL, haut) + fuell(iK, haut);
  /* obere Zähne über dem Unterkiefer: Rosette groß und nach vorn geneigt, hinten klein und leicht zurückgebogen */
  const oz = [[177.6, 2.1, -0.3], [175.8, 2.3, -0.25], [173.8, 1.5, -0.1], [167.6, 1, 0.25], [164.8, 1.2, 0.3], [162.2, 1.1, 0.3], [159.4, 1, 0.3], [156.8, 0.8, 0.3]].slice(0, F ? 8 : 3);
  k += zaehne(T, oz.map(([x, Lz, kr]) => [x, yBei(lippe.slice().reverse())(x) - 0.25, Lz + 0.3, (Lz + 0.3) * 0.4, kr]), 1, "s");
  k += fuell(iS, haut);
  /* untere Rosettenzähne greifen außen über den Oberkiefer in die Kerbe */
  k += zaehne(T, [[170.6, -47.5, 1.7, 0.7, 0.1], [168.6, -47.9, 1.4, 0.6, -0.05], [166.4, -47.5, 0.9, 0.42, -0.1]], -1, "u");
  let inn = fl([0, -66, 180, -18]);
  /* Schwanz: Muskelkern (mittlere 40 %) mit Lichtkante oben und Kernschatten unten; Flossensäume oben/unten heller,
     wärmer, mit feinen schrägen Rippen; Querbänder auf den Säumen schwächer */
  const kernO = [], kernU = [];
  for (let x = 2; x <= 84; x += 4) { kernO.push([x, cT(x) - dT(x) * 0.4]); kernU.push([x, cT(x) + dT(x) * 0.4]); }
  if (F) {
    inn += flaeche(T, [[-1, -40]].concat(kernO, [[86, -38], [86, -60], [-1, -60]]), "#c09a68", 0.13) + flaeche(T, [[-1, -28]].concat(kernU, [[86, -28], [86, -10], [-1, -10]]), "#c09a68", 0.13);
    let rp = "";
    for (let x = 4; x < 82; x += 1.3) {
      const o1 = cT(x) - dT(x) * 0.42, o2 = cT(x) - dT(x) * 0.95, u1 = cT(x) + dT(x) * 0.42, u2 = cT(x) + dT(x) * 0.95;
      rp += `M${zk(x)} ${zk(o1)}L${zk(x - (o1 - o2) * 0.22)} ${zk(o2)}M${zk(x)} ${zk(u1)}L${zk(x - (u2 - u1) * 0.3)} ${zk(u2)}`;
    }
    inn += `<path d="${rp.replace(/ -/g, "-")}" stroke="#2a2010" stroke-width=".2" stroke-opacity=".2"/>`;
  }
  let bd = "";
  for (const x of [10, 21, 32, 43, 54, 65, 76]) { const y0 = cT(x) - dT(x), y1 = cT(x) + dT(x); bd += `M${R(x)} ${R(y0)}l${R(-0.6)} ${R(y1 - y0)}h2.4l${R(0.6)} ${R(y0 - y1)}z`; }
  inn += weichG(T, 0.8, [0, -50, 86, -20], `<path d="${bd}" fill="#1c1a10" opacity=".24"/>`);
  const yO = yBei(sOben.concat(ruecken)), yU = yBei(sUnten.concat(unten.slice().reverse())), band = (v, x0, x1) => { const p = []; for (let x = x0; x <= x1; x += 5) p.push([x, yO(x) + (yU(x) - yO(x)) * v]); return p; };
  /* Licht: obere Flanke hell, Terminator auf 55–60 %, unteres Drittel dunkel, Bodenreflex; Muskelkern des Schwanzes */
  let mal = L([band(0.12, 84, 152)], LI, 3.4, 0.36) + L([band(0.8, 84, 152)], SC, 7, 0.5) + L([band(0.97, 88, 150)], RF, 1.2, 0.4);
  mal += F ? L([kernO.map(([x, y]) => [x, y + 0.4])], LI, 1.2, 0.36) + L([kernU.map(([x, y]) => [x, y - 0.4])], SC, 1.4, 0.45) : L([sUnten], SC, 2.2, 0.4);
  /* Okklusion an der Segelbasis, Kopf auf Hals, Arm, Bein; Oberschenkel nur oben/hinten hell */
  mal += L([[[84, -43.4], [100, -41.2], [126, -41.4]]], SC, 1.6, 0.4) + ell(128, -24, 3, 3, 0, SC, 0.4) + ell(81, -31, 6, 4, -10, LI, 0.24 * st) + L([[[89.4, -28], [91.6, -23], [88, -20]]], SC, 2.4, 0.45);
  mal += L([[[151.6, -43.6], [146, -42.8], [143.4, -40]]], SC, 2.6, 0.5);
  /* Hals: Nackenmuskel unter dem Segel-Vorderrand, Kehlfalten */
  mal += L([[[131, -40.6], [138, -43.6], [146, -46.4]]], LI, 1.8, 0.24);
  const falten = [[[150.6, -43.2], [148.4, -40.6], [148.8, -38.6]], [[147, -41.2], [144.6, -38], [145, -36]], [[143.2, -38.6], [140.8, -35], [141.2, -33]]];
  let fa = linien(T, falten, SC, 0.4, 0.28) + (F ? linien(T, falten.map((p) => verschiebe(p, -0.35, -0.3)), LI, 0.3, 0.18) : "");
  /* Kopf: Oberseite +10 % hell, Kamm als Lichtgrat mit Schattenkante, Mundwinkel-Falte am Kiefergelenk, Schatten unter Lippe und Kiefer */
  let mk = L([[[155.2, -52.6], [157.4, -54.4], [161.4, -54.6], [166, -54], [172, -51.6], [178, -49.4]]], LI, 1.6, 0.48) + L([[[158.6, -54.4], [161.4, -54.6], [164.6, -54.2]]], LI, 0.5, 0.6) + L([[[159, -53.4], [161.6, -53.6], [165, -53]]], SC, 0.45, 0.5);
  mk += L([[[155.6, -46.4], [156.2, -44.4], [155.8, -43]]], SC, 0.6, 0.6) + L([lippe.map(([x, y]) => [x, y - 0.5])], SC, 0.7, 0.4) + L([[[155, -42.4], [163, -43.4], [172, -44.2], [178, -44.8]]], SC, 1.6, 0.55);
  inn += weichG(T, 2, [0, -66, 180, 0], mal) + weichG(T, 0.5, [152, -57, 180, -41], mk) + weichG(T, 0.22, [136, -46, 154, -30], fa);
  if (F) {
    /* große Scuta auf der Rückenlinie und der Schnauzenoberseite, mittlere Flanke, feine Bauchschilde */
    const rp2 = [];
    for (let x = 4; x < 154; x += 1.6) rp2.push([x - 0.4, yO(x) + 0.5, 0.36 + 0.1 * Math.sin(Math.PI * x / 154) + T.rnd() * 0.06]);
    inn += buckel(T, rp2.filter(([x]) => x > 82 || x < 74), haut, { opF: 0.34, opL: 0.18, lang: 1.2, flach: 1 });
    inn += buckel(T, tuberkelReihen(T, ruecken, unten.slice().reverse(), 86, 152, [[0.06, 0.3, 1.4, 0.2, 0.32, 0.5], [0.3, 0.62, 1.3, 0.15, 0.2, 0.28]]), null, { opF: 0.2, opL: 0.1 });
    inn += reihe(T, band(0.92, 90, 150), 28, 1.8, "#1c1a10", 0.12, 0.22, -0.6);
    inn += schildNetz(T, [[160, -54.4], [166, -54], [172, -51.8], [178, -49.6], [178.6, -47], [172, -47.4], [164, -47.6], [158, -48.6]], 1.4, { opF: 0.4, w: 0.13, opL: 0.06 });
    inn += schildNetz(T, kiefer, 1.2, { opF: 0.34, w: 0.13, opL: 0.05 });
  }
  /* Lippe über den Zahnbasen */
  inn += `<path d="${glatt(lippe, false)}" fill="none" stroke="${haut}" stroke-width=".6" stroke-linecap="round"/>` + L([lippe.map(([x, y]) => [x, y + 0.32])], SC, 0.22, 0.75);
  k += geklippt(T, [iL, iK, iS], inn);
  /* Nasenloch weit hinten, in flacher Grube */
  k += weichG(T, 0.25, [163, -53, 168, -50], ell(165.6, -51.5, 1.1, 0.5, -15, SC, 0.4)) + ell(165.7, -51.6, 0.66, 0.26, -15, "#160e06", 0.9);

  let s = h + volZonen(T, "leib", k, [-2, -60, 181, 0], [[0, 0, "r", { weich: 5, tiefe: 5, umgebung: 0.3 }], [-10, 78, "s", { weich: 2.6, tiefe: 4, umgebung: 0.3 }],
    [134, 155, "h", { weich: 3, tiefe: 4.5, umgebung: 0.3 }], [155, 190, "k", { weich: 1.8, tiefe: 3.5, umgebung: 0.35 }]], 8);
  s += `<use href="#${iUB}"/>` + `<use href="#${iA}"/>`;
  s += kontakt(T, [[82, 86], [86.6, 90], [92, 95.4], [96, 99.4], [84, 90]]);
  if (F) s = `<g filter="${T.relief("haut", { f: 4, tiefe: 0.04, okt: 2 })}">${s}</g>`;
  s += reptilAuge(T, 157.8, -51.5, 1.1, { n: "s", hell: "#e2b44a", iris: "#b8862c" });
  s += krallen(T, [[138.6, -19.1, 4.5, 1.3, 48, 0.95], [139.6, -15.6, 2.5, 0.85, 62, 0.85], [137.4, -14.4, 2.5, 0.85, 80, 0.85], [99.2, -0.8, 2.2, 0.9, 10, 0.2], [95.6, -0.6, 2, 0.85, 10, 0.2], [95.6, -3.7, 1.8, 0.7, 5, 0.2], [82.4, -0.8, 1.6, 0.8, 165, -0.2]]);
  GEN = 10;
  return Object.assign(fertig(7.8, s, [-0.6, -64.6, 179.1, 0]), { fuesse: [83 * 7.8, 92 * 7.8], kopf: [150 * 7.8, -58 * 7.8, 181 * 7.8, -38 * 7.8] });
}

/* =====================================================================
   ALLOSAURUS
   RECHERCHE: Allosaurus fragilis (Oberjura, 155–145 Mio. J., Morrison-Formation, USA). Durchschnittlich ~8,5 m
   lang (größte sichere Funde ~9,7 m), ~2,3–2,5 m Hüfthöhe, 1,7–2,3 t – deutlich leichter gebaut als T. rex.
   Schädel ~85 cm (bei 7,9 m Länge), lang, niedrig und schmal (Höhe ≤ 55 % der Länge), Oberkante fällt nur flach zur
   Nase ab, Schnauze vorn kastenförmig; paarige raue Knochenleisten auf der Schnauze (Nasalia) bis zu je einem
   flachen, rauen, dreieckigen Hörnchen (Lacrimale) über dem Vorderrand der Augenhöhle; große Antorbitalöffnung
   (Mulde zwischen Auge und Nase); Mundwinkel hinter dem Auge nach unten gezogen; Kiefermuskel hinter dem Auge.
   Viele klingenartige Zähne, kleiner als beim T. rex, unter Lippen (nur Spitzen sichtbar). S-Hals mit Nackenwulst,
   schlanker Rumpf, langer Schwanz waagerecht mit leichter S-Biegung. Kräftige Greifarme, deutlich länger als beim
   T. rex: DREI Finger mit großen, stark gebogenen Krallen (Daumenkralle ~20 cm), Handflächen nach innen.
   Beine digitigrad und länger: Oberschenkel als Keule, Schienbein mit Wade und Achillessehne, Fersengelenk,
   Mittelfuß als eigenes Segment, drei tragende Zehen (III am längsten) mit Ballen, kleine Afterzehe innen.
   Farbe unbekannt → sandbraun mit dunklen Rückenquerstreifen, Bauch hell, Hörnchen leicht rötlich, Augenstreif.
   Zeichenraum: 1 Einheit = 4,25 cm (200 Einheiten ≈ 8,5 m).
   ===================================================================== */
function allosaurus(T) {
  const F = T.fein, US = ' gradientUnits="userSpaceOnUse"';
  GEN = F ? 10 : 2; T._ganz = [-1, -68, 202, 1];
  const st = F ? 0.55 : 1;
  const haut = T.lg("haut", [[0, "#6a563e"], [0.4, "#816b4c"], [0.7, "#97805c"], [1, "#a28c68"]], 0, -66, 0, 0, US);
  const LI = "#fff2d4", SC = "#120d07", RF = "#ecd2a2";
  const fl = (b) => fleckung(T, "fleck", b, "#1e160c", 0.2);
  const L = (arr, farbe, w, op) => linien(T, arr, farbe, w, op * st);

  /* ---------- Umrisse ---------- */
  const oben = [[0.2, -41], [3, -41.6], [10, -42.4], [20, -43.6], [32, -45.4], [44, -48], [58, -51.2], [72, -54], [86, -56.2], [97, -57.2], [112, -57], [128, -55.8], [140, -54.8], [150, -54.6],
    [156, -56.6], [162, -59.4], [168, -62.2], [172.6, -63.2], [176.2, -62.6]];
  const unten = [[0.6, -39.8], [3, -40.1], [10, -40.2], [20, -40.4], [32, -41], [46, -42], [62, -43], [76, -42.4], [86, -39.6], [92, -35.4], [98, -30.6], [105, -28.8], [112, -28.8], [118, -29.8], [124, -31.2], [134, -32.6],
    [142, -34.8], [148, -37.6], [153, -41], [158, -44.6], [164, -48.6], [170, -51.2], [175, -52.6]];
  const leib = oben.concat([[178.6, -61], [179, -55.4], [177.4, -53.4]], unten.slice().reverse());
  /* Schädel lang und niedrig: Oberkante fällt flach (~15°), Hörnchen in der Kontur, Schnauze vorn rund-kastenförmig */
  const lippe = [[200.2, -56.9], [196, -56.5], [190, -56.3], [185, -56.2], [182.4, -55.9], [180.4, -55.2], [178.8, -54.6]];
  const schaedel = [[177.4, -57.6], [177.8, -61.6], [179.4, -63.4], [181.4, -64.4], [183, -64.9], [184.2, -66], [185.2, -66.6, 1], [186.4, -65.9], [188, -65.1], [189.6, -64.8], [192.8, -63.8], [196.2, -62.4],
    [198.8, -61], [200.2, -59.4], [200.8, -58.1]].concat(lippe, [[177.6, -54.6]]);
  const kiefer = [[177.4, -55], [178.8, -55.2], [180.4, -55.8], [182.4, -56.5], [185, -56.8], [190, -56.9], [196, -57.1], [200, -57.4], [200.5, -56.2], [199.6, -55.2], [197, -54.4], [192, -53.6], [186, -52.8],
    [181, -52.2], [178, -52.6], [176.6, -53.4]];
  /* Unterbein: Schienbein mit Wade, Achillessehne, Fersenknoten, Mittelfuß als eigenes Segment */
  const ub = [[100, -38], [104.6, -38.6], [108.6, -34.6], [109.6, -30.4], [109, -26.6], [107.4, -23], [105.4, -19.6], [103.4, -16.4], [102, -14], [102.5, -12.6], [102.3, -11.2], [103.1, -8.2], [104.1, -5.4], [105.2, -3.6],
    [103.8, -1.4], [101.6, -0.5], [100, -0.3], [98.6, -1.4], [97.8, -4], [96.8, -7.2], [95.8, -10.2], [95.1, -12.2], [95.5, -14], [95.4, -19], [94.6, -22.4], [95.2, -25.4], [96.8, -28.8], [99, -33]];
  const mf = [[102.4, -12.4], [103.1, -8.2], [104.1, -5.4], [105.2, -3.6], [103.8, -1.4], [101.6, -0.5], [100, -0.3], [98.6, -1.4], [97.8, -4], [96.8, -7.2], [95.8, -10.2], [95.3, -12.2], [98.8, -13.6]];
  const z3 = [[103.4, -4.1], [106.8, -3.5], [109.8, -2.5], [112.4, -1.5], [113.6, -0.8], [113.4, -0.3], [111.4, -0.2], [109.8, -0.7], [108, -0.2], [106, -0.8], [104.4, -0.3]];
  const z4 = [[101.4, -3.4], [104.2, -3.4], [106.8, -2.6], [109.2, -1.7], [110.6, -1], [110.5, -0.3], [108.8, -0.1], [107.6, -0.6], [106.2, -0.1], [104.6, -0.6], [103, -0.1], [101.6, -0.6]];
  const arm = [[143.6, -47.6], [149, -47], [150.8, -43], [150.8, -39.6], [153, -37.2], [156.4, -34.4], [158.2, -32.6], [157.4, -31], [155, -31.6], [151.6, -33.6], [148.4, -35.8], [146.4, -38.6], [145, -42.4]];

  /* ---------- Unterbein (nah und fern) ---------- */
  let ubIn = teil(T, z3, "#7a664c", { innen: F ? reihe(T, z3.slice(0, 5), 9, 1.3, "#120c06", 0.11, 0.4, -0.05) : "", mal: L([[[104, -3.8], [109, -3], [113, -1.2]]], LI, 0.45, 0.4) });
  /* Afterzehe (Hallux): klein, innen, Kralle nach unten-hinten, im Schatten */
  ubIn += teil(T, [[97.6, -7.8], [96.4, -6.8], [95.6, -5.6], [96.2, -5.2], [97.6, -6.2]], "#5c4a36", { klein: 1 });
  const iU = pfad(T, ub);
  ubIn += fuell(iU, haut);
  let ubM = weichG(T, 0.8, [94, -15, 107, 0], flaeche(T, mf, "#000", 0.12));
  ubM += weichG(T, 1, [93, -40, 112, 0], L([[[108.6, -33], [108.6, -26], [106, -20]]], SC, 2.2, 0.5) + L([[[98, -31], [96, -25], [95.8, -20]]], LI, 1.8, 0.36) +
    L([[[103.8, -17.4], [102.2, -14]]], SC, 1.2, 0.4) + L([[[98.6, -10], [99.8, -4]]], LI, 1, 0.3) + L([[[102, -10], [103.8, -4.6]]], SC, 1, 0.36));
  ubM += weichG(T, 0.3, [93, -22, 106, -9], L([[[95, -19.6], [95.9, -13.8]]], LI, 0.45, 0.7) + L([[[96, -19.6], [96.8, -14]]], SC, 0.35, 0.55)) +
    weichG(T, 0.7, [93, -16, 106, -9], ell(95.8, -12.6, 1, 1.2, 0, LI, 0.3 * st) + ell(102.2, -12.4, 0.7, 1, 0, SC, 0.3 * st));
  if (F) ubM += reihe(T, [[102.3, -11.2], [103.1, -8.2], [104.1, -5.4], [105, -3.8]], 10, 2.1, "#120c06", 0.12, 0.45, -2.1) + reihe(T, [[102.3, -11.2], [103.1, -8.2], [104.1, -5.4]], 10, -0.4, "#f4e4c0", 0.1, 0.35, -0.2) +
    buckel(T, flaechenPunkte(T, [[97, -30], [109, -30], [106.6, -20], [103, -15.6], [95.6, -15.6], [95, -23]], 1.1, 0.16, 0.24, 0.5), null, { opF: 0.22, opL: 0.1 });
  ubIn += geklippt(T, [iU], fl([93, -40, 112, 0]) + ubM);
  ubIn += teil(T, z4, "#86714f", { innen: F ? reihe(T, z4.slice(0, 5), 9, 1.6, "#120c06", 0.11, 0.42, -0.05) : "", mal: L([[[101.8, -0.4], [106.6, -0.4], [110.2, -0.3]]], SC, 0.55, 0.8) + L([[[101.8, -3.2], [106, -2.9], [110, -1.3]]], LI, 0.45, 0.5) });
  const iUB = T.id("unterbein");
  T.def(`<g id="${iUB}" mask="${maskeY(T, "ub", [92, -40, 116, 0], -34, -29)}">${volZonen(T, "ubv", ubIn, [92, -40, 116, 0], [[0, 0, "a", { weich: 2, tiefe: 4, umgebung: 0.35 }]])}</g>`);

  /* ---------- Arm (kräftig, drei Finger) ---------- */
  let armIn = teil(T, arm, haut, { innen: fl([143, -48, 159, -30]), weich: 0.7,
    mal: L([[[145, -45], [146, -41], [148, -37.6]]], LI, 1.2, 0.5) + ell(147.6, -44, 1.4, 2.2, 0, LI, 0.24 * st) + L([[[148, -35.6], [152, -33], [156, -31.2]]], SC, 1.1, 0.55) + ell(150.6, -38.6, 1, 0.8, 0, SC, 0.4 * st),
    mal2: F ? L([[[149.4, -38.8], [151, -37.8]]], SC, 0.22, 0.9) : "", weich2: 0.1 });
  const finger = [[[156.6, -33.2], [159, -32.4], [161.4, -31.4], [162, -30.6], [161.2, -30.2], [158.8, -31.2], [156.4, -31.8]],
    [[156.2, -31.6], [158.2, -30.4], [159.8, -29], [160, -28.2], [159.2, -28.2], [157.6, -29.4], [155.8, -30.6]],
    [[156.8, -33.8], [158.4, -34.1], [159.6, -33.5], [159.2, -32.8], [157.4, -32.8]]];
  finger.forEach((p, i) => { armIn += teil(T, p, i === 1 ? "#6e5a42" : haut, { klein: 1, weich: 0.15, mal: L([p.slice(0, 3)], LI, 0.3, 0.5) + L([p.slice(4)], SC, 0.3, 0.5) }); });
  const iA = T.id("arm");
  T.def(`<g id="${iA}">${volZonen(T, "armv", armIn, [143, -48, 163, -27], [[0, 0, "a", { weich: 1, tiefe: 3, umgebung: 0.35 }]])}</g>`);

  let h = `<use href="#${iUB}" transform="rotate(10 98 -44) translate(-1 -1)" filter="${dunkler(T, 0.7)}"/>` + `<use href="#${iA}" transform="translate(1.8 1.6)" filter="${dunkler(T, 0.68)}"/>`;

  /* ---------- Rumpf, Hals, Schwanz und Kopf ---------- */
  const iL = pfad(T, leib), iK = pfad(T, kiefer), iS = pfad(T, schaedel);
  let k = fuell(iL, haut) + fuell(iK, haut);
  /* nur die Spitzen der Zähne unter der Lippe: unregelmäßig, vorn größer, schräg nach hinten */
  k += zaehne(T, [[199.2, 1.2], [196.6, 1.05], [194.2, 0.95], [191.4, 0.85], [188.8, 0.8], [186.2, 0.7], [183.8, 0.6]].map(([x, Lz]) => [x, -57.1 + (200 - x) * 0.012, Lz * 1.35 + 0.5, (Lz * 1.35 + 0.5) * 0.42, 0.42]), 1, "a");
  k += fuell(iS, haut);
  let inn = fl([0, -68, 202, -28]);
  const yO = yBei(oben), yU = yBei(unten), band = (v, x0, x1) => { const p = []; for (let x = x0; x <= x1; x += 6) p.push([x, yO(x) + (yU(x) - yO(x)) * v]); return p; };
  /* Querstreifen: der Rundung folgend, oben breit, zur Flanke schmal auslaufend, nach hinten enger und schmaler */
  let bd = "";
  for (let i = 0, x = 172; x > 6; i++) {
    const t = x / 172, w = 1.2 + 2.6 * t, y = yO(x), hh = (yU(x) - y) * 0.56, sk = 0.25 * hh;
    bd += `M${R(x - w / 2)} ${R(y - 1)}q${R(-sk * 0.5)} ${R(hh * 0.5)} ${R(-sk)} ${R(hh)}q${R(w * 0.3)} ${R(hh * 0.12)} ${R(w * 0.5)} 0q${R(w * 0.3)} ${R(-hh * 0.6)} ${R(w * 0.8 + sk)} ${R(-hh)}z`;
    x -= 7 + 6 * t;
  }
  inn += weichG(T, 0.7, [0, -68, 180, -30], `<path d="${bd}" fill="#2c1e12" opacity=".4"/>`);
  let mal = L([band(0.1, 2, 174)], LI, 3.4, 0.34) + L([band(0.78, 4, 172)], SC, 7, 0.5) + L([band(0.97, 6, 172)], RF, 1.2, 0.4);
  mal += ell(97, -48, 8, 5, -15, LI, 0.3 * st) + L([[[109, -52], [111, -44], [109.6, -36], [104, -31], [98, -29]]], SC, 3, 0.55) + L([[[86, -44], [92, -37], [98, -32]]], SC, 1.8, 0.35);
  mal += L([[[174, -51.6], [180, -51.2], [188, -52.2]].map(([x, y]) => [x - 2.4, y + 1.2])], SC, 2.8, 0.55) + ell(152, -32.6, 4.2, 1.4, 12, SC, 0.4) + ell(146, -47.6, 2.6, 1.2, 0, SC, 0.4);
  /* Kopf: Oberseite hell, Nasenleiste als Lichtgrat mit Schattenkante, Antorbitalmulde, Kiefermuskel, Augenstreif */
  let mk = L([[[178.4, -62], [181, -64.4], [186, -65.6], [192, -63.8], [199, -60.6]]], LI, 1.8, 0.45) + ell(179.6, -59.4, 1.8, 2.4, 0, LI, 0.3 * st) + L([[[178.6, -55.6], [180.6, -56.6], [182.2, -58.6]]], SC, 1, 0.5);
  mk += ell(190.4, -60, 3.6, 1.5, -12, SC, 0.5 * st) + L([[[187.2, -61.6], [191, -61.4], [194, -60.4]]], LI, 0.6, 0.35) + L([[[181, -55.6], [190, -55.4], [199, -55.8]]], SC, 1, 0.5) + L([[[178, -52.8], [186, -53.2], [196, -54.4]]], SC, 1.6, 0.55);
  mk += `<path d="M184 -62.6q-3 .2-6.4 1.6q3.2.4 6.6-.6z" fill="#2a1a0e" opacity="${OP(0.45)}"/>`;
  /* Hörnchen leicht rötlich, Lichtkante oben, Schlagschatten nach hinten-unten */
  mk += flaeche(T, [[182.4, -64.6], [184.2, -65.6], [185.2, -66.2], [186.6, -65.6], [188.4, -65], [185.4, -64.2]], "#9a4e2c", F ? 0.4 : 0.55) + L([[[183.4, -65.2], [185.2, -66], [187.6, -65.2]]], LI, 0.4, 0.6) + L([[[182, -64], [184, -63.8]]], SC, 0.6, 0.5);
  /* Nasenleiste: rauer Lichtgrat bis zum Hörnchen, darunter Schattenkante */
  mk += L([[[188, -64.4], [192.8, -63.2], [196.2, -61.8], [199, -60.2]]], LI, 0.5, 0.6) + L([[[188, -63.6], [192.8, -62.4], [196.2, -61], [198.8, -59.6]]], SC, 0.4, 0.45);
  const falten = [[[176.8, -53.2], [171, -51], [165, -48.4]], [[149, -45], [150.4, -41.6], [150, -38]], [[98, -31.4], [102.6, -30.8], [107.4, -32.4]]];
  let fa = linien(T, falten, SC, 0.42, 0.3) + (F ? linien(T, falten.map((p) => verschiebe(p, -0.4, -0.35)), LI, 0.32, 0.2) : "");
  inn += weichG(T, 2, [0, -68, 202, 0], mal) + weichG(T, 0.5, [174, -68, 202, -50], mk) + weichG(T, 0.22, [90, -60, 180, -28], fa);
  if (F) {
    const rueckenPkt = [];
    for (let x = 6; x < 174; x += 1.5) rueckenPkt.push([x - 0.4, yO(x) + 0.45, 0.32 + 0.12 * Math.sin(Math.PI * x / 174) + T.rnd() * 0.05]);
    inn += buckel(T, rueckenPkt, haut, { opF: 0.34, opL: 0.18, lang: 1.2, flach: 1 });
    inn += buckel(T, tuberkelReihen(T, oben, unten, 4, 172, [[0.06, 0.3, 1.4, 0.2, 0.32, 0.5], [0.3, 0.62, 1.3, 0.15, 0.2, 0.28]]), null, { opF: 0.2, opL: 0.1 });
    inn += buckel(T, tuberkelReihen(T, oben, unten, 20, 150, [[0.08, 0.24, 3, 0.36, 0.48, 0.12]]), haut, { opF: 0.3, opL: 0.14, flach: 0.6 });
    inn += reihe(T, band(0.92, 98, 172), 32, 2, "#1e160c", 0.13, 0.22, -0.7) + reihe(T, band(0.92, 4, 92), 40, 1, "#1e160c", 0.09, 0.16, -0.3);
    inn += schildNetz(T, [[188, -61.4], [192.8, -63.2], [198.6, -60.6], [200.6, -58.2], [200, -57.2], [194, -57], [187, -57.4]], 1.7, { opF: 0.4, w: 0.13, opL: 0.06 });
    inn += schildNetz(T, [[177.8, -59], [178.6, -62.4], [182, -64.2], [187.6, -64.4], [186.6, -61.4], [182, -58], [178.6, -56.8]], 1.2, { opF: 0.36, w: 0.13, opL: 0.05 });
    inn += schildNetz(T, kiefer, 1.4, { opF: 0.34, w: 0.13, opL: 0.05 });
    inn += buckel(T, flaechenPunkte(T, [[182.6, -64.6], [184.4, -65.6], [185.2, -66.2], [186.6, -65.6], [188.4, -65], [185.4, -64.6]], 0.42, 0.2, 0.28), haut, { opF: 0.55, opL: 0.32 });
    inn += buckel(T, flaechenPunkte(T, [[152, -53.4], [162, -57.4], [170, -61.6], [176, -61], [174, -54], [164, -49], [154, -44]], 1.2, 0.18, 0.28, 0.5), null, { opF: 0.2, opL: 0.1 });
  }
  /* Lippenwulst mit Schattenlinie */
  inn += `<path d="${glatt(lippe, false)}" fill="none" stroke="${haut}" stroke-width=".9" stroke-linecap="round"/>` + L([verschiebe(lippe, 0, -0.32)], LI, 0.2, 0.25) + L([verschiebe(lippe, 0, 0.45)], SC, 0.3, 0.8);
  if (F) inn += reihe(T, lippe, 16, 0.8, "#120c06", 0.1, 0.42, -0.4);
  k += geklippt(T, [iL, iK, iS], inn);
  /* Nasenloch: Oval innerhalb der Kontur in flacher Grube, Lichtkante oben */
  k += weichG(T, 0.25, [196, -61, 201, -58], ell(198.4, -59.6, 1.1, 0.55, -20, SC, 0.4)) + ell(198.5, -59.7, 0.6, 0.26, -20, "#160e06", 0.9) + `<path d="M197.4 -60.4q1.1-.6 2.2-.2" fill="none" stroke="${LI}" stroke-width=".14" stroke-opacity=".5"/>`;

  let s = h + volZonen(T, "leib", k, [0, -68, 202, 0], [[0, 0, "r", { weich: 5, tiefe: 5, umgebung: 0.3 }], [-10, 76, "s", { weich: 2.2, tiefe: 4, umgebung: 0.3 }],
    [150, 177, "h", { weich: 3, tiefe: 4.5, umgebung: 0.3 }], [177, 210, "k", { weich: 1.8, tiefe: 3.5, umgebung: 0.35 }]], 9);
  s += `<use href="#${iUB}"/>` + `<use href="#${iA}"/>`;
  s += kontakt(T, [[99, 103], [104.2, 107.6], [108.2, 111], [110, 113.6], [103, 108]]);
  if (F) s = `<g filter="${T.relief("haut", { f: 3.4, tiefe: 0.045, okt: 2 })}">${s}</g>`;
  s += reptilAuge(T, 183.2, -61.9, 1.12, { n: "a", hell: "#f0c25a", iris: "#c4902e" });
  s += krallen(T, [[159.2, -33.4, 5, 1.5, 42, 0.95], [161.8, -30.8, 3.2, 1, 62, 0.9], [159.8, -28.4, 2.6, 0.85, 78, 0.9], [113.4, -0.9, 2.4, 1.15, 26, 0.25], [110.4, -0.9, 2.2, 1.05, 28, 0.25],
    [99.8, -0.6, 1.8, 0.95, 160, -0.25], [96, -5.6, 1.2, 0.5, 120, -0.5]]);
  GEN = 10;
  return Object.assign(fertig(4.25, s, [-0.4, -66.4, 200.8, 0]), { fuesse: [99 * 4.25, 107 * 4.25], kopf: [175 * 4.25, -68 * 4.25, 202 * 4.25, -50 * 4.25] });
}

/* =====================================================================
   PTERANODON – ein FLUGSAURIER (Pterosaurier), KEIN Dinosaurier! (für den Tipp: „Der Pteranodon ist kein
   Dinosaurier, sondern ein Flugsaurier – ein Verwandter, der mit Hautflügeln flog.")
   RECHERCHE: Pteranodon longiceps (Oberkreide, ~86–84 Mio. J., Niobrara-Meer, Kansas). Spannweite 3,8–5,6 m
   (Männchen bis ~6 m), nur ~20–25 kg: kurzer, kompakter Rumpf mit breiter Brust (Schulter–Becken ~35 cm bei 4 m
   Spannweite), kurzer Schwanzstummel. Schädel mit Kamm ≈ ¼ der Spannweite: zahnloser, langer, spitzer Schnabel
   (Hornscheide/Rhamphotheka mit Längsmaserung, Unterkieferspitze leicht aufgebogen); Männchen mit langem, nach
   hinten gerichtetem Knochenkamm, der ohne Kante aus der Schädeloberkante wächst. Flügel: Oberarm kräftig mit
   Deltopektoral-Kamm, Unterarm, lange Mittelhand (~1,3× Unterarm), sehr langer 4. Finger (Flugfinger); Flughaut
   (Brachiopatagium) bis zum Knöchel, gespannt, mit Aktinofibrillen im Außenflügel (fast parallel zum Flugfinger),
   durchscheinender Hinterkantensaum; vorn eine schmale Vorflughaut (Propatagium) vom Halsansatz zum Handgelenk,
   gestützt vom Pteroid; drei kleine Krallenfinger am Ende der Mittelhand. Körper mit Pyknofasern („Fell"),
   Rücken dunkler, Brust heller. Füße klein, Zehen gebündelt.
   Gezeichnet im Gleitflug, schräg von oben: ferner Flügel (oben) verkürzt, naher größer; der Kopf ist um die
   Halsachse gedreht (blickt etwas nach unten), so dass die Seitenansicht lesbar bleibt.
   Zeichenraum: 1 Einheit = 2 cm.
   ===================================================================== */
function pteranodon(T) {
  const F = T.fein;
  GEN = F ? 10 : 2; T._ganz = [-48, -92, 78, 114];
  const LI = "#fff2d8", SC = "#120c08";
  const st = F ? 0.6 : 1;
  const L = (arr, farbe, w, op) => linien(T, arr, farbe, w, op * st);
  /* Gegenschattierung: Oberseite (ferner Flügel) dunkler, Unterseite (naher Flügel, Brust) heller */
  const hautO = T.lg("fhaut", [[0, "#3e3028"], [0.5, "#4e3e34"], [1, "#5a483c"]], 0, 0, 1, 0);
  const hautU = T.lg("fhautu", [[0, "#5a4638"], [0.5, "#6a5444"], [1, "#7a6250"]], 0, 0, 1, 0);
  const fell = T.lg("fell", [[0, "#5a4636"], [0.55, "#7a6450"], [1, "#a28c72"]]);

  /* Flügel: Profilwölbung (hinter der Vorderkante heller, zur Hinterkante dunkler), Spannungsfalten radial zum Knöchel,
     durchscheinender, hellerer und wärmerer Hinterkantensaum (leicht gebuchtet), Aktinofibrillen nur außen. */
  const fluegel = (vorn, hinten, fill, sgn, b, knoechel) => {
    const pts = vorn.concat(hinten.slice().reverse().slice(1));
    const A = polyl(vorn), B = polyl(hinten);
    const zwischen = (u, t0 = 0.02, t1 = 0.98) => { const p = []; for (let i = 0; i <= 14; i++) { const t = t0 + (t1 - t0) * i / 14, a = A.at(t), q = B.at(t); p.push([a[0] + (q[0] - a[0]) * u, a[1] + (q[1] - a[1]) * u]); } return p; };
    let inn = "";
    if (F) {
      let fa = ["", "", ""];
      for (let k = 0; k < 16; k++) {
        const t = 0.45 + 0.52 * (k + T.rnd() * 0.6) / 16, a = A.at(t), q = B.at(Math.min(1, t + 0.04)), u = 0.15 + T.rnd() * 0.25, v = u + 0.35 + T.rnd() * 0.3;
        fa[k % 3] += `M${zk(a[0] + (q[0] - a[0]) * u)} ${zk(a[1] + (q[1] - a[1]) * u)}Q${zk(a[0] + (q[0] - a[0]) * (u + v) / 2 + sgn)} ${zk(a[1] + (q[1] - a[1]) * (u + v) / 2)} ${zk(a[0] + (q[0] - a[0]) * v)} ${zk(a[1] + (q[1] - a[1]) * v)}`;
      }
      inn += fa.map((d, i) => `<path d="${d.replace(/ -/g, "-")}" fill="none" stroke="#1a120c" stroke-width=".22" stroke-opacity="${[0.1, 0.07, 0.04][i]}"/>`).join("");
    }
    let mal = L([zwischen(0.18)], LI, 6, 0.26) + L([zwischen(0.75)], SC, 7, 0.24) + L([zwischen(0.97)], "#e8c8a0", 2.6, 0.4);
    /* Spannungsfalten radial zum Knöchel */
    for (const t of [0.35, 0.55, 0.72]) { const a = A.at(t); mal += L([[[a[0] + (knoechel[0] - a[0]) * 0.15, a[1] + (knoechel[1] - a[1]) * 0.15], [a[0] + (knoechel[0] - a[0]) * 0.75, a[1] + (knoechel[1] - a[1]) * 0.75]]], SC, 1.6, 0.12); }
    /* Kontaktschatten des Rumpfes auf der Flügelwurzel */
    mal += ell(-4, sgn * 6, 10, 4, 0, SC, 0.35);
    return teil(T, pts, fill, { innen: inn, mal, weich: 1.4, box: b });
  };
  /* Armknochen als Grat mit Lichtkante oben links und Schattenseite; Breite je Abschnitt */
  const knochen = (vorn, breiten, sgn) => {
    let s = "";
    for (let i = 0; i < vorn.length - 1; i++) {
      const a = vorn[i], b = vorn[i + 1], w0 = breiten[i], w1 = breiten[i + 1] != null ? breiten[i + 1] : breiten[i] * 0.5;
      const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy), nx = -dy / n, ny = dx / n;
      s += `M${zk(a[0] + nx * w0 / 2)} ${zk(a[1] + ny * w0 / 2)}L${zk(b[0] + nx * w1 / 2)} ${zk(b[1] + ny * w1 / 2)}L${zk(b[0] - nx * w1 / 2)} ${zk(b[1] - ny * w1 / 2)}L${zk(a[0] - nx * w0 / 2)} ${zk(a[1] - ny * w0 / 2)}Z`;
    }
    const iK = pfad(T, s.replace(/ -/g, "-"));
    return fuell(iK, "#56463a") + geklippt(T, [iK], weichG(T, 0.4, [-50, -95, 20, 116], L([verschiebe(vorn, -0.5, -0.7)], LI, 0.9, 0.55) + L([verschiebe(vorn, 0.5, 0.8)], SC, 0.9, 0.5)));
  };
  const gelenke = (liste) => liste.map(([x, y, r]) => ell(x, y, r, r * 0.85, 0, "#5a4a3c") + ell(x - r * 0.3, y - r * 0.32, r * 0.42, r * 0.32, 0, LI, 0.4)).join("");

  /* ---------- ferner Flügel (oben, verkürzt): Oberarm (6,−5)→(2,−14), Unterarm →(8,−25), Mittelhand →(9,−50), Flugfinger ---------- */
  const fV = [[6, -5], [2, -14], [8, -25], [9.4, -50], [-6, -64], [-22, -76], [-44, -90]];
  const fH = [[-12, -6], [-16, -18], [-20, -34], [-22, -50], [-26, -64], [-34, -78], [-44, -90]];
  let s = fluegel(fV, fH, hautO, -1, [-46, -92, 12, -2], [-12, -6]);
  /* Vorflughaut: flaches Dreieck vom Halsansatz zum Handgelenk, ohne Kontur, Pteroid als dunkler Strich */
  s += flaeche(T, [[12, -3], [11.6, -14], [9.4, -26], [8, -25], [2, -14], [6, -5]], "#54443a", 0.95) + L([[[9.6, -25.6], [11, -22.6]]], SC, 0.4, 0.8);
  s += knochen(fV, [3, 2.4, 1.8, 1.4, 0.9, 0.6, 0.4], -1) + gelenke([[2, -14, 1.3], [8, -25, 1.2], [9.4, -50, 1.1]]);
  s += weichG(T, 1.2, [-2, -20, 14, 0], ell(4.6, -9, 1.6, 4, 15, LI, 0.25 * st));

  /* ---------- Beine (zwei, leicht gespreizt), Fuß klein in Körperfarbe, Schwanzstummel ---------- */
  for (const sgn of [-1, 1]) {
    const bein = [[-10, sgn * 2.6], [-14, sgn * 4.4], [-18, sgn * 5.8], [-21, sgn * 6.8], [-21.6, sgn * 5.6], [-18, sgn * 4], [-14, sgn * 2.4], [-10.6, sgn * 1]];
    s += teil(T, bein, sgn > 0 ? "#7a6450" : "#56463a", { klein: 1, mal: L([[[-11, sgn * 1.8], [-16, sgn * 4], [-20.6, sgn * 6]]], LI, 0.5, 0.35), weich: 0.3 });
    let z = "";
    for (let i = 0; i < 4; i++) z += `M${zk(-21.2)} ${zk(sgn * (6 + i * 0.25))}l${zk(-2.2)} ${zk(sgn * (0.3 + i * 0.35))}`;
    s += `<path d="${z.replace(/ -/g, "-")}" stroke="${sgn > 0 ? "#7a6450" : "#56463a"}" stroke-width=".55" stroke-linecap="round" fill="none"/>`;
    s += `<path d="M${zk(-23.4)} ${zk(sgn * 6.4)}l-.5 ${zk(sgn * 0.1)}M${zk(-23.4)} ${zk(sgn * 7.4)}l-.5 ${zk(sgn * 0.2)}" stroke="#1e1610" stroke-width=".35" stroke-linecap="round"/>`;
  }
  s += teil(T, [[-12, -1.2], [-18, -0.6], [-18.8, 0.2], [-18, 1], [-12, 1.4]], fell, { klein: 1 });

  /* ---------- Rumpf (kompakte Tropfenform, Brustmuskel an der Flügelwurzel) und Hals mit Pyknofasern ---------- */
  const rumpf = [[10, -5], [4, -7], [-3, -7], [-8, -5], [-11, -3], [-12.4, 0], [-11, 3], [-8, 5], [-3, 7], [4, 7], [10, 5]];
  const hals = [[8, -3.2], [16, -3], [24, -2.8], [32, -2.6], [33, 1.4], [24, 1.8], [16, 2.4], [8, 3.6]];
  const iR = pfad(T, rumpf), iH = pfad(T, hals);
  let r = fuell(iH, fell) + fuell(iR, fell);
  let fe = "";
  if (F) {
    /* feine dichte Haarsträhnen in Wuchsrichtung Kopf → Schwanz, Kontrast gering */
    fe += federn(T, rumpf, 260, (x, y) => 180 + y * 2.4, 1.4, [["#3a2a1e", 1, 0.16, 0.18], ["#d0b896", 0.6, 0.14, 0.18]], { kr: 0.3, streuung: 10 });
    fe += federn(T, hals, 140, 180, 1.1, [["#3a2a1e", 1, 0.14, 0.18], ["#d0b896", 0.6, 0.12, 0.18]], { kr: 0.3, streuung: 8 });
  }
  let rm = L([[[9, -4.2], [0, -5.6], [-9, -3.6]]], "#3a2a1e", 3, 0.4) + L([[[9, 4.2], [0, 5.6], [-9, 3.4]]], "#e0caa6", 3, 0.32) + ell(5, -3, 3.4, 2.6, 0, LI, 0.25 * st);
  rm += L([[[9, -1.8], [20, -1.8], [31, -1.6]]], "#3a2a1e", 1.2, 0.35) + L([[[9, 2.2], [20, 1.4], [31, 0.8]]], "#e0caa6", 1, 0.3);
  /* Hals dreht zum Kopf: Licht/Schatten-Grenze wandert von der Ober- zur Seitenfläche */
  rm += L([[[22, -0.4], [28, -1.4], [32, -2]]], SC, 1, 0.3);
  r += geklippt(T, [iR, iH], fe + weichG(T, 0.8, [-14, -9, 35, 9], rm));
  /* weicher Flaumrand direkt an der Haut */
  if (F) r += federn(T, rumpf.map(([x, y]) => [x * 1.06, y * 1.12]), 120, (x, y) => 180 + y * 2, 0.8, [["#7a6450", 1, 0.14, 0.4]], { kr: 0.3 }) + federn(T, hals.map(([x, y]) => [x, y * 1.2]), 60, 182, 0.7, [["#7a6450", 1, 0.12, 0.4]]);
  s += volZonen(T, "rumpf", r, [-14, -9, 35, 9], [[0, 0, "a", { weich: 1.4, tiefe: 3, umgebung: 0.4 }]]);

  /* ---------- naher Flügel (unten, größer) ---------- */
  const nV = [[6, 5], [2, 16], [9, 29], [10.6, 58], [-6, 76], [-24, 92], [-47, 112]];
  const nH = [[-12, 6], [-16, 20], [-21, 38], [-23, 58], [-27, 76], [-36, 94], [-47, 112]];
  s += fluegel(nV, nH, hautU, 1, [-48, 2, 13, 114], [-12, 6]);
  s += flaeche(T, [[12, 3], [12, 16], [10.8, 30], [9, 29], [2, 16], [6, 5]], "#6e5848", 0.95) + L([[[11, 29.6], [12.4, 26]]], SC, 0.4, 0.8);
  s += knochen(nV, [3.2, 2.6, 2, 1.5, 1, 0.7, 0.4], 1) + gelenke([[2, 16, 1.4], [9, 29, 1.3], [10.6, 58, 1.2]]);
  /* drei Krallenfinger am Ende der Mittelhand, Schatten nur auf der Flughaut */
  s += weichG(T, 0.5, [6, 52, 16, 64], ell(12.4, 60.6, 2.6, 1.1, 30, SC, 0.4));
  s += krallen(T, [[11, 57, 5.2, 1.4, -15, 0.75], [11.4, 58.6, 5.6, 1.45, 12, 0.75], [10.8, 60, 5, 1.35, 38, 0.75], [10, -49, 4.4, 1.2, 15, -0.7], [10.2, -50.6, 4.6, 1.2, -12, -0.7], [9.6, -52, 4.2, 1.1, -38, -0.7]]);

  /* ---------- Kopf: Kamm wächst aus dem Schädel, Hornschnabel mit Längsmaserung, Auge oben im Schädel ---------- */
  const kopfO = [[32, -1.4], [33, -4], [35.6, -5.4], [39, -5.8], [44, -5], [52, -3.8], [62, -2.4], [74.6, -0.6], [74.2, 0], [62, -0.2], [52, 0.4], [44, 1], [38.4, 1.8], [34, 2]];
  const kamm = [[30.4, -3.4], [26, -5.6], [20, -7.6], [14, -9.4], [11.4, -10.2], [11, -9.4], [14, -7.6], [20, -5.4], [26, -3], [31, -0.8]];
  const unterK = [[38, 1.2], [46, 0.8], [58, 0], [70, -0.9], [74, -1.2], [73.6, -0.2], [58, 1.4], [46, 2.2], [38, 2.8]];
  /* Kamm: breite Basis vom Auge bis zum Hinterkopf, Oberkante leicht konvex, Spitze stumpf-rund */
  const iKa = pfad(T, [[40, -5.6], [34, -6.4], [27, -8], [20, -9.6], [14.6, -10.8], [12.2, -11], [11.6, -10.2], [13, -9.2], [18, -7.4], [24, -5.4], [29, -3.2], [33, -1.2], [37, -3.6]]), iKo = pfad(T, kopfO), iU = pfad(T, unterK);
  const horn = T.lg("schnabel", [[0, "#4e3e30"], [0.3, "#6e5a44"], [0.75, "#5e4c3a"], [1, "#2e241c"]], 0, 0, 1, 0);
  let k = fuell(iU, "#5a4836") + fuell(iKa, T.lg("kamm", [[0, "#6a3a24"], [0.5, "#7a4630"], [1, "#5e4c3c"]], 0, 0, 1, 0)) + fuell(iKo, horn);
  let km = L([[[33.4, -4.6], [40, -5.4], [52, -3.8], [72, -0.8]]], LI, 0.8, 0.55) + L([[[37, 0.6], [52, -0.4], [70, -0.4]]], SC, 0.7, 0.45);
  /* schmaler heller Streifen der Schädeloberseite (Kopf leicht gedreht), Mulde vor dem Auge, Kiefergelenk, Hautfalte am Mundwinkel */
  km += L([[[34, -5.2], [40, -5.6], [48, -4.6]]], "#c8b090", 0.5, 0.5) + ell(42.6, -2.2, 2.4, 1, -8, SC, 0.32) + ell(36.6, 1.2, 1, 0.6, 0, SC, 0.45) + L([[[35.6, 1.4], [37.4, 0.6]]], SC, 0.25, 0.6);
  km += L([[[33, -6], [24, -8.2], [14, -10.4]]], LI, 0.6, 0.45) + L([[[30, -2.6], [22, -5.6], [14, -8.8]]], SC, 0.6, 0.4);
  let ki = "";
  if (F) ki += linien(T, [[[46, -2.6], [60, -1.6], [72, -0.6]], [[48, -1.2], [62, -0.8], [72, -0.2]], [[44, -3.8], [56, -2.8], [68, -1.4]], [[30, -5.4], [22, -7.6], [15, -9.6]], [[30, -4], [22, -6.4], [15, -8.8]]], "#2a1e14", 0.1, 0.25);
  k += geklippt(T, [iU, iKa, iKo], ki + weichG(T, 0.4, [10, -12, 76, 4], km));
  /* Schneidekante leicht S-förmig, Unterkieferspitze aufgebogen */
  k += L([[[38, 1], [48, 0.5], [60, -0.1], [70, -0.7], [74, -0.8]]], SC, 0.35, 0.8);
  s += volZonen(T, "kopf", k, [10, -12, 76, 4], [[0, 0, "a", { weich: 0.8, tiefe: 2.5, umgebung: 0.4 }]]);
  s += reptilAuge(T, 37.8, -3.4, 1.15, { n: "p", hell: "#9a4a2a", iris: "#6a2e18", rand: "#2a1008", lidHell: "#d8c8a8" });
  GEN = 10;
  return Object.assign(fertig(2, `<g transform="translate(0 -113)">${s}</g>`, [-47.4, -205, 75, 0]), { kopf: [8 * 2, -124 * 2, 78 * 2, -104 * 2] });
}

const ARTEN = [
  { id: "tyrannosaurus", de: "der Tyrannosaurus", syl: "Ty-ran-no-SAU-rus", it: "il tirannosauro", itSyl: "ti-ran-no-SAU-ro", en: "Tyrannosaurus rex",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 12.38, hoehe: 4.3, f: typeof tyrannosaurus === "function" && tyrannosaurus },
  { id: "velociraptor", de: "der Velociraptor", syl: "Ve-lo-ci-RAP-tor", it: "il velociraptor", itSyl: "ve-lo-ci-RAP-tor", en: "velociraptor",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 1.9, hoehe: 0.64, f: typeof velociraptor === "function" && velociraptor },
  { id: "spinosaurus", de: "der Spinosaurus", syl: "Spi-no-SAU-rus", it: "lo spinosauro", itSyl: "spi-no-SAU-ro", en: "Spinosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 14, hoehe: 5.04, f: typeof spinosaurus === "function" && spinosaurus },
  { id: "allosaurus", de: "der Allosaurus", syl: "Al-lo-SAU-rus", it: "l'allosauro", itSyl: "al-lo-SAU-ro", en: "Allosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 8.55, hoehe: 2.82, f: typeof allosaurus === "function" && allosaurus },
  /* Pteranodon: Flugsaurier, KEIN Dinosaurier (gruppe „Dinosaurier" nur für die Sortierung der Urzeit-Tiere; der Tipp sagt es) */
  { id: "pteranodon", de: "der Pteranodon", syl: "Pte-ra-NO-don", it: "lo pteranodonte", itSyl: "pte-ra-no-DON-te", en: "pteranodon",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 2.45, hoehe: 4.1, fliegt: true, f: typeof pteranodon === "function" && pteranodon,
    tipp: "Der Pteranodon ist kein Dinosaurier, sondern ein Flugsaurier. Er flog mit Flügeln aus Haut." },
];
module.exports = ARTEN.filter((a) => a.f).map(({ f, ...a }) => Object.assign(a, { zeichne: f }));
