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
const kontakt = (T, liste) => !T.fein ? "" : weichG(T, 0.3, [Math.min(...liste.map((l) => l[0])) - 2, -1.5, Math.max(...liste.map((l) => l[1])) + 2, 1.5],
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
    const poly = (q) => "M" + q.map(([x, y]) => zk(x) + " " + zk(y)).join("L").replace(/ -/g, "-") + "Z";
    d += poly(sh);
    dl += poly(sh.map(([x, y]) => [cx - g * 0.12 + (x - cx) * 0.5, cy - g * 0.14 + (y - cy) * 0.45]));
  }
  return flaeche(T, pts, o.dunkel || "#140e08", o.opF || 0.32) + `<path d="${d}" fill="${haut}" stroke="${haut}" stroke-width="${zk(g * 0.12)}" stroke-linejoin="round"/>` + weichG(T, R(g * 0.12) || 0.1, [x0 - g, y0 - g, x1 + g, y1 + g], `<path d="${dl}" fill="#fff4dc" opacity="${OP(o.opL || 0.14)}"/>`);
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
  let ubIn = teil(T, z3, "#5e523c", { klein: 1, innen: F ? reihe(T, z3.slice(0, 5), 9, 1.5, "#120c06", 0.12, 0.4, -0.05) : "", mal: L([z3.slice(0, 5)], LI, 0.5, 0.4) });
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
  ubIn += teil(T, z4, "#6a5c46", { klein: 1, innen: F ? reihe(T, z4.slice(0, 5), 9, 1.8, "#120c06", 0.12, 0.42, -0.05) : "", mal: L([z4.slice(5).reverse()], SC, 0.6, 0.8) + L([z4.slice(0, 5)], LI, 0.5, 0.5) });
  const iUB = T.id("unterbein");
  T.def(`<g id="${iUB}">${volZonen(T, "ubv", ubIn, [92, -36, 124, 0], [[0, 0, "a", { weich: 2.4, tiefe: 4, umgebung: 0.35 }]])}</g>`);
  /* Oberschenkel-Keule: reicht bis über die halbe Rumpfhöhe in die Flanke (Oberkante weich ausgeblendet), Caudofemoralis-Wulst nach hinten */
  const iSch = pfad(T, bz.schenkel);
  let schIn = fuell(iSch, haut);
  schIn += geklippt(T, [iSch], weichG(T, 2, [80, -66, 122, -20], ell(94, -50, 8, 5, -20, LI, 0.22 * st) + L([[[113, -50], [116, -40], [113, -31]]], SC, 4, 0.5 * st) + L([[[90, -40], [98, -32], [106, -28]]], SC, 3.2, 0.42 * st) + ell(110, -32, 3, 2.4, 0, LI, 0.2 * st)) +
    (F ? buckel(T, gruppen(T, flaechenPunkte(T, bz.schenkel, 1.5, 0.22, 0.34, 0.6)), null, { opF: 0.2, opL: 0.1 }) : ""));
  const iSG = T.id("schenkel");
  T.def(`<g id="${iSG}" mask="${maskeY(T, "sch", [80, -66, 124, -20], -58, -47)}">${volZonen(T, "schv", schIn, [80, -66, 124, -20], [[0, 0, "a", { weich: 5, tiefe: 4.5, umgebung: 0.32 }]])}</g>`);

  /* ---------- Arm (nah und fern) ---------- */
  let armIn = teil(T, arm, haut, { innen: fl([139, -47, 151, -36]), weich: 0.6,
    mal: L([[[141, -44.6], [141.6, -41], [143.4, -38.8]]], LI, 1, 0.5) + ell(144.6, -44, 1.2, 1.6, 0, LI, 0.25 * st) + L([[[143.6, -37.6], [148.6, -37.6]]], SC, 1, 0.55) + ell(146.2, -40.2, 0.8, 0.6, 0, SC, 0.4 * st),
  });
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
  s += `<use href="#${iUB}" filter="${dunkler(T, 0.9)}"/>` + `<use href="#${iSG}"/>` + `<use href="#${iA}"/>`;
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
   RECHERCHE: Velociraptor mongoliensis (Kreide, 75–71 Mio. J., Mongolei). Erwachsen bis ~2 m lang (davon etwa die
   Hälfte Schwanz), Hüfthöhe ~0,5 m, bis 15 kg – truthahngroß, NICHT menschengroß wie im Film. Gefiedert: Federkiel-
   Höcker an der Elle (Turner et al. 2007) → große Armschwingen; Körper mit Konturfedern in Federfluren (Nacken,
   Schulterdecke, Flanke, Brust, „Hose" am Oberschenkel); Schwanz ab der Wurzel befiedert, Steuerfedern zum Ende hin
   länger, Fächer im hinteren Drittel am breitesten, Spitze rund. Schädel ~25 cm, lang und niedrig, Schnauzenoberkante
   vor dem Auge leicht eingedellt (konkav), große Augenhöhle, Antorbitalmulde, Jochbogen; Hinterkopf und Wangen
   befiedert, Schnauze beschuppt; gekrümmte Zähne, von Lippen weitgehend bedeckt, Mundlinie S-förmig. Schwanz steif
   und gerade (verknöcherte Wirbelfortsätze). Hände: drei Finger (II am längsten und kräftigsten) mit großen, stark
   gebogenen Krallen, gefaltet wie ein Vogelflügel, Handflächen nach innen. Beine: Oberschenkel als befiederte Keule,
   Knie vor der Hüfte, Schienbein länger als Oberschenkel und schräg zurück, Ferse hoch, kurzer Mittelfuß; zweite
   Zehe kurz, im Grundgelenk hochgeklappt, mit ~6,5 cm Sichelkralle (seitlich flach) – er läuft auf den Zehen III
   und IV. Farbe unbekannt → Steppenvogel: braun mit Gegenschattierung (Rücken dunkler, Bauch heller), dunkle
   Schwanzbänder, dunkler Augenstreif.
   Zeichenraum: 1 Einheit = 1 cm.
   ===================================================================== */
function velociraptor(T) {
  const F = T.fein, US = ' gradientUnits="userSpaceOnUse"';
  GEN = F ? 10 : 2; T._ganz = [4, -68, 192, 1];
  const st = F ? 0.8 : 1;
  /* EINE Grundfarbe mit Gegenschattierung; Beine nur 10–15 % dunkler */
  const kleid = T.lg("kleid", [[0, "#4e3a28"], [0.3, "#624a34"], [0.6, "#7c6246"], [0.85, "#9c8262"], [1, "#a88e6c"]], 0, -64, 0, -32, US);
  const bein = T.lg("beinf", [[0, "#5e4732"], [1, "#6c563e"]], 0, -46, 0, -10, US);
  const haut = T.lg("rhaut", [[0, "#6e5e4a"], [1, "#54463a"]]);
  const LI = "#fff0d0", SC = "#140e08", RF = "#e6cfa4", DK = "#2e2014";
  const L = (arr, farbe, w, op) => linien(T, arr, farbe, w, op * st);
  const fed = [["#2a1d12", 1, 0.16, 0.12], ["#d8c098", 0.5, 0.13, 0.14]];
  /* unregelmäßige Federspitzen über der Kontur (nicht im Rapport), Basis innen */
  const spitzen = (pts, n, len, winkel, farbe) => {
    if (!F) return "";
    const P = polyl(pts); let d = "";
    for (let i = 0; i < n; i++) {
      const t = T.rnd(), [x, y] = P.at(t), a = (winkel + (T.rnd() - 0.5) * 22) * Math.PI / 180, l = len * (0.6 + T.rnd() * 0.9), b = l * 0.28;
      const ux = Math.cos(a), uy = Math.sin(a), nx = -uy * b, ny = ux * b, ex = x + ux * l, ey = y + uy * l;
      d += `M${zk(x + nx - ux * 0.6)} ${zk(y + ny - uy * 0.6)}Q${zk(ex + nx * 0.5)} ${zk(ey + ny * 0.5)} ${zk(ex)} ${zk(ey)}Q${zk(ex - nx * 0.4)} ${zk(ey - ny * 0.4)} ${zk(x - nx - ux * 0.6)} ${zk(y - ny - uy * 0.6)}Z`;
    }
    return `<path d="${d.replace(/ -/g, "-")}" fill="${farbe}"/>`;
  };
  /* Federflur: große, weiche Lappen – gewellte Unterkante (Bögen 3–4 E) mit 0,6 E Schattenfuge, Oberseite heller */
  const flur = (kante, b) => {
    if (!F) return "";
    /* Bögen 4–6 E: jeder Lappen eine flache Rundung, darunter die Fuge */
    const P = polyl(kante), n = Math.max(2, Math.round(P.len / 5)), w = [];
    for (let i = 0; i <= n * 4; i++) { const t = i / (n * 4), [x, y, nx, ny] = P.at(t), o = Math.abs(Math.sin(Math.PI * t * n)) * (0.9 + 0.3 * Math.sin(i * 1.7)); w.push([x + nx * o, y + ny * o]); }
    return weichG(T, 0.5, b, L([w.map(([x, y]) => [x + 0.2, y + 0.5])], SC, 0.7, 0.3)) + weichG(T, 1.3, b, L([w.map(([x, y]) => [x - 0.4, y - 1.7])], LI, 2, 0.18));
  };

  /* ---------- Umrisse (Schwanz ~45 % der Länge, Hals kurz und durch Gefieder dick) ---------- */
  const oben = [[12, -48.8], [30, -49.6], [50, -50.4], [70, -51], [88, -51.8], [100, -52.4], [114, -52.2], [128, -51.2], [138, -50.8], [143.6, -52.4], [148, -55.2], [151.6, -58], [154.6, -60.2], [157.4, -61.2]];
  const unten = [[160.6, -54.6], [157.6, -51], [154.6, -47], [150.6, -42.8], [146, -39], [138, -35.6], [126, -33.6], [116, -33.6], [108, -35.6], [100, -39.4], [90, -43.4], [70, -46.4], [50, -47.4], [30, -47.8], [12, -48]];
  const leib = oben.concat([[160.6, -60.6], [161.6, -57.4]], unten);
  const lippe = [[186.2, -58.2], [185.4, -57.7], [181, -57.4], [176, -57.6], [171, -57.4], [167, -56.8], [163.6, -56.2], [162.6, -55.6]];
  const kopf = [[157, -57.8], [157.4, -61.2], [159.6, -63.2], [163, -63.8], [166.4, -63], [169.6, -61.8], [173.6, -61.6], [178, -61.4], [182, -60.9], [185, -60], [186.4, -58.9]].concat(lippe.slice(1), [[159.6, -55.8]]);
  const kiefer = [[162.6, -55.8], [163.6, -56.4], [167, -57], [171, -57.6], [176, -57.8], [181, -57.6], [185.4, -57.9], [184.8, -57], [180, -56], [172, -54.8], [165, -53.8], [161, -53.6], [159.4, -54.6]];
  /* Bein als Z: Hüfte, Knie vor der Hüfte, Schienbein 23° zurück, Ferse hoch, Mittelfuß 70° nach vorn */
  const HI = [100, -44], KN = [108.6, -29.4], FE = [100.6, -10.4], BA = [104.2, -1.6];
  const bz = beinZ(HI, KN, FE, BA, { wH: 13.5, wK: 6.2, wF: 3.4, wB: 3.2, schenkelV: 0.8, schenkelH: 1.6, wade: 1.4 });

  /* ---------- Unterbein-Gruppe: Federhose bis kurz über die Ferse, Schuppenfuß ab der Ferse ---------- */
  const z3 = [[104.8, -2.8], [107.8, -2.4], [110.8, -1.6], [112.8, -0.9], [113, -0.3], [110.8, -0.2], [109.4, -0.7], [107.8, -0.2], [106, -0.7], [104.8, -0.3]];
  const z4 = [[102.6, -2.6], [105.4, -2.4], [108, -1.7], [110, -1], [110, -0.3], [108.2, -0.2], [107, -0.6], [105.6, -0.2], [104, -0.6], [102.8, -0.2]];
  /* zweite Zehe: kurz, zwei Glieder, im Grundgelenk steil hochgeklappt */
  const z2 = [[104.6, -3], [105.6, -4.8], [106.6, -6.6], [107.8, -7.6], [108.8, -7.2], [108.2, -6], [107, -4.6], [106.2, -2.8]];
  let ubIn = teil(T, z3, "#4e4234", { klein: 1, oben: F ? reihe(T, z3.slice(0, 5), 6, 1.1, "#0e0a06", 0.08, 0.45, -0.05) : "" });
  const iU = pfad(T, bz.unter);
  ubIn += fuell(iU, bein);
  /* Schuppenfuß (Mittelfuß) in Hautfarbe, Übergang zur Hose über 2 E weich */
  let um = weichG(T, 0.9, [96, -18, 112, 0], flaeche(T, bz.mf, "#6a5a48"));
  um += weichG(T, 0.7, [94, -34, 116, 0], L([[[KN[0] + 1.6, KN[1] + 1.4], [FE[0] + 2.4, FE[1] - 1]]], LI, 1.2, 0.32) + L([[[KN[0] - 3.6, KN[1] + 2.4], [FE[0] - 1.6, FE[1] - 1]]], SC, 1.6, 0.45) +
    L([[[FE[0] + 1.2, FE[1] + 1], [BA[0] + 1.2, BA[1] - 1]]], LI, 0.6, 0.35) + L([[[FE[0] - 1.2, FE[1] + 1.4], [BA[0] - 1.4, BA[1] - 0.6]]], SC, 0.7, 0.4));
  um += weichG(T, 0.4, [94, -18, 110, -9], ell(FE[0] - 1.3, FE[1], 0.7, 0.9, 0, LI, 0.4 * st) + ell(FE[0] + 1.3, FE[1] + 0.3, 0.5, 0.8, 0, SC, 0.35 * st));
  if (F) {
    const P = polyl([[FE[0] + 1.4, FE[1] + 0.6], [BA[0] + 1.4, BA[1] - 0.4]]); const qs = [];
    for (let i = 0; i < 7; i++) { const [x, y] = P.at((i + 0.5) / 7); qs.push([x - 0.5, y, 0.3]); }
    um += buckel(T, qs, "#6a5a48", { opF: 0.3, opL: 0.16, lang: 1.4, flach: 1 });
    um += federn(T, glied(KN, [FE[0] + 0.6, FE[1] - 3], 6, 3.6, 0, 1.4, 0.3, 4), 50, 112, 1.6, fed);
  }
  ubIn += geklippt(T, [iU], um);
  /* unregelmäßiger Hosensaum: Federspitzen 0,6–1,2 E schräg nach hinten-unten */
  ubIn += spitzen([[FE[0] + 2.6, FE[1] - 4.6], [FE[0] + 1.4, FE[1] - 2.6], [FE[0] - 1, FE[1] - 2.4], [FE[0] - 2.4, FE[1] - 3.4]], 7, 1, 115, "#6c563e");
  ubIn += teil(T, z2, haut, { klein: 1, oben: F ? reihe(T, z2.slice(0, 4), 3, 1.2, "#0e0a06", 0.07, 0.5, -0.4) : "" });
  ubIn += teil(T, z4, "#5c5040", { klein: 1, mal: L([z4.slice(5).reverse()], SC, 0.5, 0.8) + L([z4.slice(0, 5)], LI, 0.35, 0.5), weich: 0.25,
    oben: F ? reihe(T, z4.slice(0, 5), 6, 1.4, "#0e0a06", 0.08, 0.5, -0.05) : "" });
  /* Sichelkralle: ~150°-Bogen, Spitze nach vorn-unten, über dem Boden gehalten; Basis 3 E, seitlich flach, Glanzkante außen */
  ubIn += krallen(T, [[108.4, -7.6, 6.4, 3, -14, 0.72], [112.8, -0.6, 1.6, 0.7, 18, 0.4], [109.8, -0.6, 1.5, 0.65, 18, 0.4], [104.6, -0.5, 1.1, 0.5, 170, -0.3]]);
  if (!F) ubIn += ell(111, -6.4, 1.2, 0.5, 20, "#e8dcc4", 0.9);
  const iUB = T.id("unterbein");
  T.def(`<g id="${iUB}">${volZonen(T, "ubv", ubIn, [94, -34, 118, 0], [[0, 0, "a", { weich: 1.2, tiefe: 3.5, umgebung: 0.35 }]])}</g>`);
  /* Oberschenkel-Keule (befiedert), reicht bis 60 % der Rumpfhöhe in die Flanke */
  const iSch = pfad(T, bz.schenkel);
  let schIn = fuell(iSch, kleid) + geklippt(T, [iSch], (F ? federn(T, bz.schenkel, 90, (x, y) => 100 + (x - 100) * 1.4, 2, fed) : "") +
    weichG(T, 1.2, [86, -56, 118, -24], ell(98, -44, 5, 3.4, -20, LI, 0.24 * st) + L([[[109.4, -42], [111, -35], [109, -30]]], SC, 2.2, 0.5 * st) + L([[[92, -36], [98, -30.4], [104, -28]]], SC, 1.8, 0.42 * st)) +
    flur([[110.6, -32], [106, -28.6], [101, -29.4], [96.4, -32.6]], [86, -40, 118, -22]));
  const iSG = T.id("schenkel");
  T.def(`<g id="${iSG}" mask="${maskeY(T, "sch", [86, -58, 118, -22], -50, -42)}">${volZonen(T, "schv", schIn, [86, -58, 118, -22], [[0, 0, "a", { weich: 2.6, tiefe: 4, umgebung: 0.35 }]])}</g>`);

  /* ---------- Flügel-Gruppe: Unterarm als Vorderkante, kleine und große Deckfedern, gestaffelte Schwungfedern ---------- */
  let wi = "";
  const sF = T.lg("schwung", [[0, "#5a4430"], [1, "#3e2e20"]], 0, 0, 1, 0);
  for (let i = F ? 9 : 4; i >= 0; i--) {
    const t = i / (F ? 9 : 4), bx = 145 - t * 13, by = -37.6 - t * 3.6, tx = 119.6 + t * 4.6 + (i % 2) * 1.2, ty = -35.8 - t * 3.4;
    wi += feder(T, bx, by, tx, ty, 2.8 - t * 0.5, sF, { seite: -1, schaft: "#3a2a1c", dichte: 0.3, rand: false });
    if (F) wi += weichG(T, 0.25, [116, -44, 148, -30], L([[[tx + 1.4, ty + 0.7], [(tx + bx) / 2, (ty + by) / 2 + 1]]], SC, 0.4, 0.45));
  }
  /* Deckfedern: zwei Reihen weicher, gestaffelter Federn über den Schwungfeder-Basen */
  const deck = [[146, -40.6], [142, -43.2], [137, -44.2], [131, -43.6], [127, -42.4], [130, -39.6], [136, -38.6], [142, -38], [146.6, -38.4]];
  wi = wi + teil(T, deck, "#664e38", { weich: 0.6, mal: L([[[129, -42.6], [136, -43.6], [143, -42.4]]], LI, 1, 0.4) +
    (F ? L([[[146, -39.6], [141, -40.4], [136, -40.8], [130.4, -40.4]], [[145.4, -41.8], [140, -42.4], [134, -42.6]]].map((p) => p), SC, 0.35, 0.3) : "") });
  /* Unterarm als Vorderkante aus der Schulter, Handgelenk */
  wi += L([[[138, -45.6], [142.6, -43], [146.4, -39.6]]], "#6a5240", 1.6, 1 / st) + weichG(T, 0.3, [134, -50, 150, -36], L([[[138.6, -46.2], [143, -43.6], [146.6, -40.4]]], LI, 0.5, 0.25));
  /* Hand: Finger in Hautfarbe, Basis von den Federn verdeckt; II am längsten und dicksten, Gelenkpolster */
  const fing = [[[145.4, -39.6], [148.4, -39], [151.6, -37.8], [154.4, -36.4], [154.2, -35.4], [151.4, -36.2], [148.2, -37.4], [145.2, -38]],
    [[145.2, -38.4], [147, -38.2], [148.8, -37.6], [148.6, -36.8], [146.8, -37], [145, -37.2]],
    [[144.8, -37.6], [147.4, -36.4], [150, -34.8], [151.6, -33.4], [151.2, -32.8], [149.4, -34], [146.8, -35.4], [144.6, -36.4]]];
  fing.forEach((p, i) => { wi += teil(T, p, i === 2 ? "#5a4c3e" : "#76644e", { klein: 1, weich: 0.15, mal: L([p.slice(0, 4)], LI, 0.25, 0.45) + L([p.slice(4)], SC, 0.25, 0.5),
    oben: F ? `<path d="${p.slice(1, 3).map(([x, y]) => `M${zk(x)} ${zk(y + 0.15)}h0`).join("")}" stroke="#3a2a1c" stroke-width=".7" stroke-linecap="round" stroke-opacity=".3"/>` : "" }); });
  wi += krallen(T, [[154, -36, 4, 1.2, 40, 1.1], [148.4, -37, 3.2, 1.05, 60, 1.1], [151.4, -33.2, 2.8, 0.9, 72, 1.1]]);
  const iW = T.id("fluegel");
  T.def(`<g id="${iW}">${volZonen(T, "wiv", wi, [114, -48, 158, -28], [[0, 0, "a", { weich: 1, tiefe: 3, umgebung: 0.4 }]])}</g>`);

  /* ---------- Schwanzfächer: ab der Wurzel befiedert, im hinteren Drittel 13 E breit, Spitze rund ---------- */
  const cy = yBei([[8, -48.4], [30, -48.7], [60, -48.6], [92, -47.2]]);
  const hw = (x) => x > 64 ? 4 + (92 - x) / 28 * 0.8 : x > 30 ? 4.8 + (64 - x) / 34 * 2.2 : 7 * Math.sqrt(Math.max(0, (x - 6) / 24));
  const fo = [], fu = [], kiele = [];
  for (let x = 92, i = 0; x > 6.6; x -= F ? 2.5 : 6, i++) {
    const tipp = (T.rnd() - 0.3) * 0.5 * Math.min(1, (92 - x) / 30);
    const z = 0.15 + 0.45 * Math.min(1, (92 - x) / 40);
    fo.push([x, cy(x) - hw(x)], [x - 1.25, cy(x - 1.25) - hw(x - 1.25) - z - tipp]);
    fu.push([x, cy(x) + hw(x)], [x - 1.25, cy(x - 1.25) + hw(x - 1.25) + z + tipp]);
    if (x < 80) kiele.push([[x + 4, cy(x) - hw(x) * 0.3], [x + 1.4, cy(x) - hw(x) * 0.7], [x - 1, cy(x) - hw(x) * 0.95]], [[x + 4, cy(x) + hw(x) * 0.3], [x + 1.4, cy(x) + hw(x) * 0.7], [x - 1, cy(x) + hw(x) * 0.95]]);
  }
  const faecher = [[94, cy(94) - 4.4]].concat(fo, [[5.8, cy(6) + 0.1]], fu.slice().reverse(), [[94, cy(94) + 4.4]]);
  const iFa = pfad(T, faecher);
  let fa = fuell(iFa, T.lg("faecher", [[0, "#5e4732"], [0.5, "#765c42"], [1, "#8a7052"]], 0, -56, 0, -40, US));
  let fin = (F ? linien(T, kiele, "#2a1d12", 0.12, 0.18) : "");
  /* Bänder der Wölbung nach gebogen, Kontrast −40 %, zu den Federspitzen weich auslaufend */
  let bd = "";
  for (const x of [78, 64, 50, 37, 25, 13]) bd += `M${x} -58q-2.2 9.6 0 19.4h3.4q-2.2-9.8 0-19.4z`;
  fin += weichG(T, 0.7, [0, -60, 96, -36], `<path d="${bd}" fill="${DK}" opacity="${OP(F ? 0.3 : 0.22)}"/>`);
  fin += weichG(T, 1.4, [0, -60, 96, -36], L([fo.filter((_, i) => i % 2)], "#e8d4ae", 1.6, 0.3) + L([fu.filter((_, i) => i % 2)], SC, 1.8, 0.3) + L([[[90, -48.4], [50, -49.8], [12, -49.2]]], LI, 1.4, 0.18));
  fa += geklippt(T, [iFa], fin);

  /* ---------- Zusammensetzen ---------- */
  let h = `<g transform="rotate(14 100 -44) translate(-1 -.6)" filter="${dunkler(T, 0.68)}"><use href="#${iUB}"/><use href="#${iSG}"/></g>` + `<use href="#${iW}" transform="translate(2.2 -1.4)" filter="${dunkler(T, 0.6)}"/>`;
  const iL = pfad(T, leib), iK = pfad(T, kiefer), iH = pfad(T, kopf);
  let k = fuell(iL, kleid) + fa + fuell(iK, kleid);
  /* Zähne: 7 Spitzen, unregelmäßig (Abstand ±30 %, Länge 0,4–0,8), nach hinten gekrümmt */
  if (F) k += zaehne(T, [[184.2, 0.7], [181.4, 0.5], [179.6, 0.75], [176.2, 0.6], [173.8, 0.45], [170.4, 0.65], [168, 0.4]].map(([x, Lz]) => [x, yBei(lippe.slice().reverse())(x) - 0.25, Lz + 0.25, (Lz + 0.25) * 0.5, 0.35]), 1);
  k += fuell(iH, kleid);
  const yO = yBei(oben), yU = yBei(unten.slice().reverse()), band = (v, x0, x1) => { const p = []; for (let x = x0; x <= x1; x += 4) p.push([x, yO(x) + (yU(x) - yO(x)) * v]); return p; };
  let inn = "";
  /* EIN Licht oben links: Rücken/Nacken heller, Terminator auf 55 %, Unterseite dunkler (Gegenschattierung bleibt im Schatten), Bodenreflex */
  let mal = L([band(0.1, 92, 156)], LI, 2.6, 0.38) + L([band(0.78, 96, 154)], SC, 6, 0.5) + L([band(0.96, 100, 152)], RF, 1.2, 0.4);
  mal += L([[[160, -53.4], [156, -50], [152.6, -45.6]]], SC, 2.4, 0.5) + ell(101, -40, 4, 3, 0, SC, 0.32) + ell(146, -37, 3, 2, 0, SC, 0.35);
  /* Kopf: Antorbitalmulde, Jochbogen-Lichtgrat, Kiefermuskel, Augenstreif, Schatten unter Kiefer */
  let mk = L([[[157.6, -61], [160, -63], [164, -63.4], [168, -62.2], [174, -61.6], [182, -61], [185.6, -59.6]]], LI, 1, 0.45);
  mk += ell(173, -59.4, 3, 1, -4, SC, 0.5) + L([[[174.4, -60.4], [171, -60.6]]], LI, 0.4, 0.4) + L([[[161.6, -57.8], [165, -58.2], [168.6, -58]]], LI, 0.45, 0.55) + ell(160.6, -59.4, 1.6, 1.4, 0, LI, 0.3 * st) + L([[[159.6, -57], [161.4, -56.2]]], SC, 0.6, 0.5);
  mk += `<path d="M157.6 -59.4q3.4-1.4 7-1.2q2.8 0 5.4.6q-2.6.6-5.4.3q-3.6 0-7 1.4z" fill="${DK}" opacity=".55"/>`;
  mk += L([[[161, -53.6], [168, -54.4], [178, -55.8]]], SC, 1, 0.5) + L([lippe.map(([x, y]) => [x, y + 0.3])], SC, 0.3, 0.55);
  inn += weichG(T, 1.4, [8, -66, 166, 0], mal) + weichG(T, 0.35, [155, -66, 188, -52], mk);
  /* Federfluren: Nacken, Schulterdecke, Flanke, Brust */
  inn += flur([[156.6, -56], [154, -52.4], [150.6, -49.4], [146.6, -47.4]], [140, -62, 162, -40]);
  inn += flur([[146, -46.6], [138, -45.4], [128, -45.4], [118, -46.6], [110, -47.8]], [104, -54, 152, -40]);
  inn += flur([[146, -38.6], [136, -37.4], [124, -37], [114, -38.6]], [108, -44, 152, -32]);
  inn += flur([[160.6, -51.4], [157.4, -47.2], [154, -43.2], [150, -39.6]], [144, -56, 166, -34]);
  if (F) inn += federn(T, [[100, -40], [150, -38], [158, -48], [161, -53.4], [157, -52], [150, -40], [124, -34], [110, -34.4], [102, -38]], 70, 175, 1.8, fed);
  /* Kopf befiedert bis 2 E hinter dem Auge; Schnauzenschuppen der Form folgend, zur Lippe größer, Kontrast −40 % */
  if (F) inn += federn(T, [[157, -57.8], [157.4, -61.2], [159.6, -63.2], [162.6, -63.6], [162.4, -60], [161.6, -56.4]], 50, 175, 1, fed) +
    buckel(T, flaechenPunkte(T, [[168, -61.8], [174, -61.4], [180, -61.1], [185.4, -59.6], [185.6, -58.6], [176, -59], [168, -59.6]], 0.5, 0.1, 0.15, 0.9), null, { opF: 0.16, opL: 0.08 }) +
    buckel(T, flaechenPunkte(T, [[166, -58.8], [185.4, -58.6], [185.4, -57.9], [166, -57.4]], 0.7, 0.2, 0.26), null, { opF: 0.18, opL: 0.08 });
  k += geklippt(T, [iL, iK, iH], inn);
  /* Kontur unregelmäßig aufbrechen: Nacken, Rücken, Brust */
  k += spitzen([[157.4, -61], [154.6, -60], [151.6, -57.8], [148, -55], [143.6, -52.2], [136, -51]], 9, 1.2, 205, "#58422e") + spitzen([[160.4, -53.6], [157.4, -49.8], [154, -45.8], [150, -41.4]], 6, 1.1, 130, "#94785a");
  k += ell(184.4, -59.8, 0.5, 0.26, -10, "#0d0905", 0.95);

  let s = h + volZonen(T, "leib", k, [4, -66, 190, -30], [[0, 0, "r", { weich: 3.4, tiefe: 4, umgebung: 0.35 }], [-10, 96, "s", { weich: 1.6, tiefe: 3, umgebung: 0.4 }],
    [148, 160, "h", { weich: 2.2, tiefe: 3.5, umgebung: 0.35 }], [160, 196, "k", { weich: 1.2, tiefe: 3, umgebung: 0.4 }]], 6);
  s += `<use href="#${iUB}" filter="${dunkler(T, 0.9)}"/>` + `<use href="#${iSG}"/>` + `<use href="#${iW}"/>`;
  s += kontakt(T, [[102.6, 105.6], [106, 109], [109.6, 112.8], [111.4, 113.6], [99, 104]]);
  s += reptilAuge(T, 165.2, -60.2, 1.5, { n: "v", hell: "#f0c85a", iris: "#c8902e" });
  if (!F) s += ell(165, -60.5, 0.6, 0.45, 0, "#ffe9a0", 0.95);
  GEN = 10;
  return Object.assign(fertig(1, s, [5.4, -64.4, 186.6, 0]), { fuesse: [102, 110], kopf: [154, -67, 189, -50] });
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
  const st = F ? 0.8 : 1;
  const haut = T.lg("haut", [[0, "#4e4a38"], [0.4, "#625b45"], [0.7, "#766c52"], [1, "#7c7258"]], 0, -56, 0, 0, US);
  const LI = "#fff0d0", SC = "#0e0d08", RF = "#dccaa0";
  const fl = () => "";
  const L = (arr, farbe, w, op) => linien(T, arr, farbe, w, op * st);

  /* ---------- Schwanz: Mittellinie mit leichter S-Biegung, tief bis weit nach hinten, runde schmale Spitze ---------- */
  const cT = yBei([[0, -34.2], [4, -33.6], [12, -32.8], [25, -32], [40, -32.6], [60, -34.4], [80, -35.6]]);
  const dT = yBei([[0, 1.2], [4, 2.6], [12, 4.6], [25, 6.4], [40, 7.4], [60, 8.6], [80, 10.4]]);
  const sOben = [], sUnten = [];
  for (let x = 2; x <= 80; x += F ? 3 : 8) { sOben.push([x, cT(x) - dT(x) - (F ? 0.4 * Math.sin(x * 1.3) : 0)]); sUnten.push([x, cT(x) + dT(x)]); }
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
  /* Hinterbein als Z, unter dem Schwerpunkt (14 E weiter vorn als in R3): Knie vorn, Schienbein 20° zurück, Ferse hoch */
  const HI = [95, -29], KN = [99.6, -17.4], FE = [96, -8], BA = [99.2, -1.2];
  const bz = beinZ(HI, KN, FE, BA, { wH: 15, wK: 7.2, wF: 4.2, wB: 4.1, schenkelV: 1, schenkelH: 2.4, wade: 1.6 });
  const ub = bz.unter, dzx = BA[0] - 84.6;
  const z2 = [[86.4, -4.6], [89.6, -4.9], [93, -4.6], [95.6, -4.1], [96, -3.5], [93, -3.4], [89.6, -3.5]].map(([x, y]) => [x + dzx, y]);
  const z3 = [[86, -4], [89.8, -3.6], [93.6, -2.6], [97.2, -1.6], [99.4, -1.1], [99.4, -0.5], [97, -0.3], [95, -0.8], [92.8, -0.4], [90.4, -1], [88, -0.8]].map(([x, y]) => [x + dzx, y]);
  const z4 = [[83.6, -3.2], [86.8, -3.4], [90, -2.6], [93.2, -1.6], [95.8, -1], [95.8, -0.3], [93.6, -0.1], [92, -0.6], [90.2, -0.1], [88.2, -0.6], [86.2, -0.1], [84, -0.6]].map(([x, y]) => [x + dzx, y]);
  /* kräftiger Arm: Oberarm mit Schulterwulst, kurzer dicker Unterarm */
  const arm = glied([127.6, -34], [130.8, -25.6], 7.4, 5.6, 0.8, 0.6, 0.4, 6, true).concat([]);
  const uarm = glied([130.8, -25.6], [135.4, -19.2], 5.4, 4, 0.3, 0.4, 0.5, 5, true);

  /* ---------- Segel: Dornen unregelmäßig (±25 %), 11° nach hinten geneigt, Haut eingesunken, wellige Kante ---------- */
  /* Vorderkante flach-konkav ansteigend, breite runde Krone um x ≈ 96, Hinterkante steiler */
  const hoehe = (xb) => xb >= 96 ? -42 - 20.6 * Math.sin(Math.PI / 2 * Math.pow(Math.max(0, (128 - xb) / 32), 1.5)) : -62.6 + 17.6 * Math.pow((96 - xb) / 20, 1.8);
  const dornen = [];
  for (let xb = 127, i = 0; xb > 75; i++) { const top = hoehe(xb) - (T.rnd() - 0.5) * 1; dornen.push([xb, top, xb - (-40 - top) * 0.19]); xb -= 2.6 * (0.75 + T.rnd() * 0.5); }
  const kante = [];
  dornen.forEach(([xb, top, xt], i) => { kante.push([xt, top]); const n = dornen[i + 1]; if (n && F) kante.push([(xt + n[2]) / 2, (top + n[1]) / 2 + 0.2 + T.rnd() * 0.6]); });
  const segel = [[129, -41]].concat(kante, [[72, -44.6], [74, -40], [100, -38]]);
  const segelF = T.lg("segel", [[0, "#7a3f22"], [0.4, "#8e5230"], [0.78, "#6e5038"], [0.92, "#5e5442"], [1, "#625b45"]], 0, -64, 0, -40, US);
  let si = "", dl = "", dd = "", sm = "";
  for (const [xb, top, xt] of dornen) {
    /* Dorn als schmaler Zylinder: Licht links, Schatten rechts, nach oben auf 50 % verjüngt */
    dl += `M${R(xb - 0.35)} -40L${R(xt - 0.18)} ${R(top + 0.6)}`; dd += `M${R(xb + 0.35)} -40L${R(xt + 0.18)} ${R(top + 0.6)}`;
  }
  for (let i = 0; i < dornen.length - 1; i++) { const a = dornen[i], b = dornen[i + 1]; sm += `M${R((a[0] + b[0]) / 2)} -40.6L${R((a[2] + b[2]) / 2)} ${R((a[1] + b[1]) / 2 + 1.6)}`; }
  if (F) si += weichG(T, 0.6, [70, -66, 131, -38], `<path d="${sm}" stroke="${SC}" stroke-width="1.3" stroke-opacity=".14"/>`) + `<path d="${dl}" stroke="#f2c8a0" stroke-width=".36" stroke-opacity=".18"/>`;
  si += F ? weichG(T, 0.15, [70, -66, 131, -38], `<path d="${dd}" stroke="#1e0e06" stroke-width=".5" stroke-opacity=".22"/>`) : `<path d="${dd}" stroke="#1e0e06" stroke-width=".5" stroke-opacity=".18"/>`;
  /* Dornspitzen als kleine Höcker knapp unter der Haut */
  if (F) si += buckel(T, dornen.map(([, top, xt]) => [xt, top + 0.7, 0.32]), segelF, { opF: 0.2, opL: 0.2 });
  /* Licht oben links, Okklusion an der Basis, Basis über 3 E in den Körperton überblenden */
  si += weichG(T, 2, [70, -66, 131, -38], L([[[124, -45], [112, -53], [100, -58], [90, -58]]], LI, 4, 0.2) + L([[[126, -40.6], [100, -40.4], [78, -41.6]]], SC, 3.4, 0.35) + L([[[126, -41.6], [100, -41.4], [78, -42.6]]], "#625b45", 4, 0.7));
  let h = teil(T, segel, segelF, { innen: si });

  /* ---------- Unterbein (nah und fern) ---------- */
  let ubIn = teil(T, z2, "#4e4836", { klein: 1 }) + teil(T, z3, "#5e5642", { klein: 1, innen: F ? reihe(T, z3.slice(0, 5), 4, 1.3, "#100c06", 0.14, 0.5, -0.05) : "", mal: L([z3.slice(0, 5)], LI, 0.4, 0.4) });
  const iU = pfad(T, ub);
  ubIn += fuell(iU, haut);
  const sehne = [[KN[0] - 5.4, KN[1] + 3], [FE[0] - 1.8, FE[1] - 0.6]];
  let ubM = weichG(T, 0.7, [90, -12, 104, 0], flaeche(T, bz.mf, "#000", 0.12));
  ubM += weichG(T, 0.9, [88, -22, 106, 0], L([[[KN[0] + 2, KN[1] + 1.6], [FE[0] + 2.6, FE[1] - 1.4]]], LI, 1.4, 0.3) + L([[[KN[0] - 4, KN[1] + 2.4], [FE[0] - 2, FE[1] - 1.4]]], SC, 2, 0.45) + L([[[FE[0] - 1.4, FE[1] + 1.6], [BA[0] - 1.8, BA[1] - 0.8]]], SC, 0.9, 0.35));
  ubM += weichG(T, 0.3, [88, -20, 104, -6], L([sehne], LI, 0.4, 0.7) + L([verschiebe(sehne, 0.5, 0.2)], SC, 0.32, 0.5)) + weichG(T, 0.6, [88, -12, 104, -5], ell(FE[0] - 1.9, FE[1], 0.9, 1.1, 0, LI, 0.3 * st) + ell(FE[0] + 1.8, FE[1] + 0.3, 0.7, 1, 0, SC, 0.3 * st));
  if (F) { const P = polyl([[FE[0] + 1.8, FE[1] + 0.6], [BA[0] + 1.8, BA[1] - 0.4]]); const qs = []; for (let i = 0; i < 5; i++) { const [x, y] = P.at((i + 0.5) / 5); qs.push([x - 0.7, y, 0.4]); } ubM += buckel(T, qs, haut, { opF: 0.22, opL: 0.12, lang: 1.5, flach: 1 }); }
  ubIn += geklippt(T, [iU], ubM);
  /* Zehe IV vorn, mit Gelenkfalten */
  ubIn += teil(T, z4, "#6c6450", { innen: F ? reihe(T, z4.slice(0, 5), 4, 1.6, "#100c06", 0.14, 0.5, -0.05) : "", mal: L([[[84, -0.4], [90, -0.4], [95.4, -0.3]]], SC, 0.55, 0.8) + L([[[84, -3], [89, -2.8], [95, -1.2]]], LI, 0.45, 0.5) });
  const iUB = T.id("unterbein");
  T.def(`<g id="${iUB}">${volZonen(T, "ubv", ubIn, [86, -22, 116, 0], [[0, 0, "a", { weich: 1.6, tiefe: 4, umgebung: 0.35 }]])}</g>`);
  const iSch = pfad(T, bz.schenkel);
  let schIn = fuell(iSch, haut) + geklippt(T, [iSch], weichG(T, 1.4, [80, -42, 110, -10], ell(91, -30, 5, 3, -20, LI, 0.2 * st) + L([[[103.6, -30], [105, -23], [102.6, -17]]], SC, 2.6, 0.5 * st) + L([[[86, -24], [92, -18], [97, -15.6]]], SC, 2, 0.4 * st)));
  const iSG = T.id("schenkel");
  T.def(`<g id="${iSG}" mask="${maskeY(T, "sch", [80, -42, 110, -10], -36, -28)}">${volZonen(T, "schv", schIn, [80, -42, 110, -10], [[0, 0, "a", { weich: 3, tiefe: 4.5, umgebung: 0.32 }]])}</g>`);

  /* ---------- Arm: Muskelkeule mit Schulteransatz, kräftiger Unterarm, große Daumenkralle ---------- */
  let armIn = teil(T, uarm, haut, { weich: 0.7, mal: L([[[129.4, -25], [133, -20.4]]], LI, 1, 0.45) + L([[[132, -27], [136.4, -20.6]]], SC, 1.2, 0.5) }) +
    teil(T, arm, haut, { weich: 0.9, mal: L([[[124.6, -33], [126.4, -28.6], [128.4, -25.4]]], LI, 1.4, 0.45) + L([[[131, -33], [133.4, -27.4]]], SC, 1.6, 0.5) + ell(127.6, -35.4, 3, 1.4, 0, SC, 0.4 * st) });
  const finger = [[[135.2, -20.6], [137.2, -20.4], [138.8, -19.4], [138.4, -18.6], [136.4, -19]], [[135.6, -18.8], [137.8, -17.8], [139.4, -16.4], [138.8, -15.8], [137, -16.8], [135.2, -17.6]],
    [[134.6, -17.8], [136.2, -16.4], [136.8, -15], [136, -14.8], [134.8, -16], [134, -17.2]]];
  finger.forEach((p) => { armIn += teil(T, p, "#6a604a", { klein: 1, weich: 0.15, mal: L([p.slice(0, 3)], LI, 0.3, 0.5) }); });
  const iA = T.id("arm");
  T.def(`<g id="${iA}">${volZonen(T, "armv", armIn, [121, -40, 141, -13], [[0, 0, "a", { weich: 1.4, tiefe: 3, umgebung: 0.35 }]])}</g>`);
  h += `<g transform="rotate(9 95 -29) translate(-1.4 -.8)" filter="${dunkler(T, 0.66)}"><use href="#${iUB}"/><use href="#${iSG}"/></g>` + `<use href="#${iA}" transform="translate(1.6 1.4)" filter="${dunkler(T, 0.66)}"/>`;

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
  mal += L([[[84, -43.4], [100, -41.2], [126, -41.4]]], SC, 1.6, 0.4) + ell(128, -24, 3, 3, 0, SC, 0.4) + L([[[105, -29], [106, -22]]], SC, 3, 0.45);
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
    for (let x = 4; x < 154; x += 1.6 + T.rnd() * 1.2) if ((x > 128 || x < 72) && T.rnd() > 0.2) rp2.push([x - 0.4, yO(x) + 0.6, 0.45 + 0.15 * Math.sin(Math.PI * x / 154) + T.rnd() * 0.1]);
    inn += buckel(T, gruppen(T, rp2, 0.22, -0.4), haut, { opF: 0.3, opL: 0.16, lang: 1.4, flach: 1 });
    inn += buckel(T, tuberkelReihen(T, ruecken, unten.slice().reverse(), 86, 152, [[0.06, 0.3, 1.4, 0.2, 0.32, 0.5], [0.3, 0.62, 1.3, 0.15, 0.2, 0.28]]), null, { opF: 0.2, opL: 0.1 });
    inn += reihe(T, band(0.92, 90, 150), 28, 1.8, "#1c1a10", 0.12, 0.22, -0.6);
    /* Schnauze: glatte, fein genarbte Haut (Krokodil), Sinnesgruben nur an der Schnauzenspitze */
    inn += buckel(T, flaechenPunkte(T, [[156, -53.4], [166, -54], [172, -51.8], [178, -49.6], [178.6, -47], [170, -48], [158, -48.4]], 0.7, 0.14, 0.2, 0.7), null, { opF: 0.16, opL: 0.1 });
    inn += buckel(T, flaechenPunkte(T, [[171, -51.6], [178.4, -49.4], [178.8, -46.6], [171, -47.6]], 0.8, 0.09, 0.12, 0.8).map(([x, y]) => [x, y, 0.1]), null, { opF: 0.5, opL: 0 });
    inn += buckel(T, flaechenPunkte(T, kiefer, 0.8, 0.14, 0.2, 0.6), null, { opF: 0.16, opL: 0.08 });
  }
  /* Lippe über den Zahnbasen */
  inn += weichG(T, 0.2, [152, -52, 180, -42], L([lippe.map(([x, y]) => [x, y + 0.3])], SC, 0.36, 0.7) + L([lippe.map(([x, y]) => [x, y - 0.4])], LI, 0.3, 0.3));
  k += geklippt(T, [iL, iK, iS], inn);
  /* Nasenloch weit hinten, in flacher Grube */
  k += weichG(T, 0.25, [163, -53, 168, -50], ell(165.6, -51.5, 1.1, 0.5, -15, SC, 0.4)) + ell(165.7, -51.6, 0.66, 0.26, -15, "#160e06", 0.9);

  let s = h + volZonen(T, "leib", k, [-2, -60, 181, 0], [[0, 0, "r", { weich: 5, tiefe: 5, umgebung: 0.3 }], [-10, 78, "s", { weich: 2.6, tiefe: 4, umgebung: 0.3 }],
    [134, 155, "h", { weich: 3, tiefe: 4.5, umgebung: 0.3 }], [155, 190, "k", { weich: 1.8, tiefe: 3.5, umgebung: 0.35 }]], 8);
  s += `<use href="#${iUB}" filter="${dunkler(T, 0.92)}"/>` + `<use href="#${iSG}"/>` + `<use href="#${iA}"/>`;
  s += kontakt(T, [[96, 100], [100.4, 104], [106, 109.4], [110, 113], [98, 104]]);
  if (F) s = `<g filter="${T.relief("haut", { f: 4, tiefe: 0.04, okt: 2 })}">${s}</g>`;
  s += reptilAuge(T, 157.8, -51.5, 1.1, { n: "s", hell: "#e2b44a", iris: "#b8862c" });
  s += krallen(T, [[138.6, -19.8, 4.5, 1.4, 45, 1], [139.2, -16.4, 2.5, 0.85, 62, 0.85], [136.6, -15, 2.5, 0.85, 80, 0.85], [113, -0.8, 2.2, 0.9, 10, 0.2], [109.4, -0.6, 2, 0.85, 10, 0.2], [109.4, -3.7, 1.8, 0.7, 5, 0.2], [96.2, -0.8, 1.6, 0.8, 165, -0.2]]);
  GEN = 10;
  return Object.assign(fertig(7.8, s, [-0.6, -64.6, 179.1, 0]), { fuesse: [97 * 7.8, 106 * 7.8], kopf: [150 * 7.8, -58 * 7.8, 181 * 7.8, -38 * 7.8] });
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
  const st = F ? 0.8 : 1;
  const haut = T.lg("haut", [[0, "#6a563e"], [0.4, "#816b4c"], [0.7, "#97805c"], [1, "#a28c68"]], 0, -66, 0, 0, US);
  const LI = "#fff2d4", SC = "#120d07", RF = "#ecd2a2";
  const fl = () => "";
  const L = (arr, farbe, w, op) => linien(T, arr, farbe, w, op * st);

  /* ---------- Umrisse ---------- */
  const oben = [[0.2, -41.4], [3, -42.6], [10, -43.6], [20, -45], [32, -46.6], [44, -48], [58, -51.2], [72, -54], [86, -56.2], [97, -57.2], [112, -57], [128, -55.8], [140, -54.8], [150, -54.6],
    [156, -56.6], [162, -59.4], [168, -62.2], [172.6, -63.2], [176.2, -62.6]];
  const unten = [[0.4, -40.2], [3, -39.6], [10, -39], [20, -38.8], [32, -39.2], [46, -40.2], [62, -41.4], [76, -41.2], [86, -38.8], [92, -35.4], [98, -32], [105, -30.8], [112, -31], [118, -31.8], [124, -32.8], [134, -34],
    [142, -36], [148, -38.4], [153, -41], [158, -44.6], [164, -48.6], [170, -51.2], [175, -52.6]];
  const leib = oben.concat([[178.6, -61], [179, -55.4], [177.4, -53.4]], unten.slice().reverse());
  /* Schädel lang und niedrig: Oberkante fällt flach (~15°), Hörnchen in der Kontur, Schnauze vorn rund-kastenförmig */
  const lippe = [[200.2, -56.9], [196, -56.5], [190, -56.3], [185, -56.2], [182.4, -55.9], [180.4, -55.2], [178.8, -54.6]];
  const schaedel = [[177.4, -57.6], [177.8, -61.6], [179.4, -63.4], [181.4, -64.4], [183, -64.9], [184.2, -66], [185.2, -66.6, 1], [186.4, -65.9], [188, -65.1], [189.6, -64.8], [192.8, -63.8], [196.2, -62.4],
    [198.8, -61], [200.2, -59.4], [200.8, -58.1]].concat(lippe, [[177.6, -54.6]]);
  const kiefer = [[177.4, -55], [178.8, -55.2], [180.4, -55.8], [182.4, -56.5], [185, -56.8], [190, -56.9], [196, -57.1], [200, -57.4], [200.5, -56.2], [199.6, -55.2], [197, -54.4], [192, -53.6], [186, -52.8],
    [181, -52.2], [178, -52.6], [176.6, -53.4]];
  /* Hinterbein als Z (länger und schlanker als beim T. rex): Knie vor der Hüfte, Schienbein 22° zurück, Mittelfuß 68° nach vorn */
  const HI = [97, -41], KN = [106.6, -25.6], FE = [100.6, -10.6], BA = [104.4, -1.4];
  const bz = beinZ(HI, KN, FE, BA, { wH: 19, wK: 8.6, wF: 4.4, wB: 4.3, schenkelV: 1.2, schenkelH: 3.2, wade: 1.7 });
  const ub = bz.unter, dzx = BA[0] - 101.4;
  const z3 = [[103.4, -4.1], [106.8, -3.5], [109.8, -2.5], [112.4, -1.5], [113.6, -0.8], [113.4, -0.3], [111.4, -0.2], [109.8, -0.7], [108, -0.2], [106, -0.8], [104.4, -0.3]].map(([x, y]) => [x + dzx, y]);
  const z4 = [[101.4, -3.4], [104.2, -3.4], [106.8, -2.6], [109.2, -1.7], [110.6, -1], [110.5, -0.3], [108.8, -0.1], [107.6, -0.6], [106.2, -0.1], [104.6, -0.6], [103, -0.1], [101.6, -0.6]].map(([x, y]) => [x + dzx, y]);
  const arm = [[143.6, -47.6], [149, -47], [150.8, -43], [150.8, -39.6], [153, -37.2], [156.4, -34.4], [158.2, -32.6], [157.4, -31], [155, -31.6], [151.6, -33.6], [148.4, -35.8], [146.4, -38.6], [145, -42.4]];

  /* ---------- Unterbein ---------- */
  let ubIn = teil(T, z3, "#6e5a42", { klein: 1, innen: F ? reihe(T, z3.slice(0, 5), 9, 1.3, "#120c06", 0.11, 0.4, -0.05) : "", mal: L([z3.slice(0, 5)], LI, 0.45, 0.4) });
  /* Afterzehe (Hallux): klein, eng am Mittelfuß innen, nach unten, im Schatten */
  ubIn += teil(T, [[FE[0] - 0.4, FE[1] + 4.6], [FE[0] - 1.2, FE[1] + 5.8], [FE[0] - 1.2, FE[1] + 7.2], [FE[0] - 0.4, FE[1] + 7], [FE[0] + 0.2, FE[1] + 5.6]], "#4e3e2e", { klein: 1 });
  const iU = pfad(T, ub);
  ubIn += fuell(iU, haut);
  const sehne = [[KN[0] - 7.4, KN[1] + 4.6], [FE[0] - 2, FE[1] - 0.8]];
  let ubM = weichG(T, 0.8, [94, -14, 110, 0], flaeche(T, bz.mf, "#000", 0.12));
  ubM += weichG(T, 1.2, [92, -32, 114, 0], L([[[KN[0] + 2.4, KN[1] + 2], [FE[0] + 3, FE[1] - 2]]], LI, 1.8, 0.3) + L([[[KN[0] - 5.4, KN[1] + 3.6], [FE[0] - 2.4, FE[1] - 2]]], SC, 2.4, 0.45) +
    L([[[FE[0] + 1.6, FE[1] + 1], [BA[0] + 1.6, BA[1] - 2]]], LI, 1, 0.3) + L([[[FE[0] - 1.6, FE[1] + 2], [BA[0] - 2, BA[1] - 1]]], SC, 1.1, 0.4));
  ubM += weichG(T, 0.3, [92, -28, 110, -7], L([sehne], LI, 0.5, 0.7) + L([verschiebe(sehne, 0.6, 0.2)], SC, 0.38, 0.5)) +
    weichG(T, 0.7, [92, -16, 110, -6], ell(FE[0] - 2.2, FE[1], 1, 1.2, 0, LI, 0.32 * st) + ell(FE[0] + 1.9, FE[1] + 0.4, 0.7, 1, 0, SC, 0.32 * st));
  if (F) {
    const P = polyl([[FE[0] + 1.9, FE[1] + 0.6], [BA[0] + 1.9, BA[1] - 0.5]]); const qs = [];
    for (let i = 0; i < 7; i++) { const [x, y] = P.at((i + 0.5) / 7); qs.push([x - 0.8, y, 0.42]); }
    ubM += buckel(T, qs, haut, { opF: 0.22, opL: 0.12, lang: 1.6, flach: 1 });
  }
  ubIn += geklippt(T, [iU], ubM);
  ubIn += teil(T, z4, "#7c6648", { klein: 1, innen: F ? reihe(T, z4.slice(0, 5), 9, 1.6, "#120c06", 0.11, 0.42, -0.05) : "", mal: L([z4.slice(5).reverse()], SC, 0.55, 0.8) + L([z4.slice(0, 5)], LI, 0.45, 0.5) });
  const iUB = T.id("unterbein");
  T.def(`<g id="${iUB}">${volZonen(T, "ubv", ubIn, [90, -32, 118, 0], [[0, 0, "a", { weich: 1.8, tiefe: 4, umgebung: 0.35 }]])}</g>`);
  /* Oberschenkel-Keule bis über die halbe Rumpfhöhe, Caudofemoralis-Wulst nach hinten */
  const iSch = pfad(T, bz.schenkel);
  let schIn = fuell(iSch, haut) + geklippt(T, [iSch], weichG(T, 1.6, [78, -58, 116, -16], ell(93, -43, 6.4, 4, -20, LI, 0.22 * st) + L([[[108, -44], [110.6, -35], [108, -27]]], SC, 3.2, 0.5 * st) + L([[[88, -34], [95, -27], [101, -24]]], SC, 2.6, 0.42 * st)) +
    (F ? buckel(T, gruppen(T, flaechenPunkte(T, bz.schenkel, 1.4, 0.2, 0.3, 0.6)), null, { opF: 0.2, opL: 0.1 }) : ""));
  const iSG = T.id("schenkel");
  T.def(`<g id="${iSG}" mask="${maskeY(T, "sch", [78, -58, 118, -16], -50, -41)}">${volZonen(T, "schv", schIn, [78, -58, 118, -16], [[0, 0, "a", { weich: 4, tiefe: 4.5, umgebung: 0.32 }]])}</g>`);

  /* ---------- Arm (kräftig, drei Finger) ---------- */
  let armIn = teil(T, arm, haut, { weich: 0.7,
    mal: L([[[145, -45], [146, -41], [148, -37.6]]], LI, 1.2, 0.5) + ell(147.6, -44, 1.4, 2.2, 0, LI, 0.24 * st) + L([[[148, -35.6], [152, -33], [156, -31.2]]], SC, 1.1, 0.55) + ell(150.6, -38.6, 1, 0.8, 0, SC, 0.4 * st) + ell(144.6, -47.6, 2.6, 1.2, 0, SC, 0.45 * st) });
  const finger = [[[156.6, -33.2], [159, -32.4], [161.4, -31.4], [162, -30.6], [161.2, -30.2], [158.8, -31.2], [156.4, -31.8]],
    [[156.2, -31.6], [158.2, -30.4], [159.8, -29], [160, -28.2], [159.2, -28.2], [157.6, -29.4], [155.8, -30.6]],
    [[156.8, -33.8], [158.4, -34.1], [159.6, -33.5], [159.2, -32.8], [157.4, -32.8]]];
  finger.forEach((p, i) => { armIn += teil(T, p, i === 1 ? "#6e5a42" : haut, { klein: 1, weich: 0.15, mal: L([p.slice(0, 3)], LI, 0.3, 0.5) + L([p.slice(4)], SC, 0.3, 0.5) }); });
  const iA = T.id("arm");
  T.def(`<g id="${iA}">${volZonen(T, "armv", armIn, [143, -48, 163, -27], [[0, 0, "a", { weich: 1, tiefe: 3, umgebung: 0.35 }]])}</g>`);

  let h = `<g transform="rotate(11 97 -41) translate(-1.6 -1.4)" filter="${dunkler(T, 0.72)}"><use href="#${iUB}"/><use href="#${iSG}"/></g>` + `<use href="#${iA}" transform="translate(1.8 1.6)" filter="${dunkler(T, 0.68)}"/>`;

  /* ---------- Rumpf, Hals, Schwanz und Kopf ---------- */
  const iL = pfad(T, leib), iK = pfad(T, kiefer), iS = pfad(T, schaedel);
  let k = fuell(iL, haut) + fuell(iK, haut);
  /* nur die Spitzen der Zähne unter der Lippe: unregelmäßig, vorn größer, schräg nach hinten */
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
  mal += L([[[111, -46], [113, -38], [110, -31]]], SC, 3.4, 0.5);
  mal += L([[[174, -51.6], [180, -51.2], [188, -52.2]].map(([x, y]) => [x - 2.4, y + 1.2])], SC, 2.8, 0.55) + ell(152, -32.6, 4.2, 1.4, 12, SC, 0.4) + ell(146, -47.6, 2.6, 1.2, 0, SC, 0.4);
  /* Kopf: Oberseite hell, Nasenleiste als Lichtgrat mit Schattenkante, Antorbitalmulde, Kiefermuskel, Augenstreif */
  let mk = L([[[178.4, -62], [181, -64.4], [186, -65.6], [192, -63.8], [199, -60.6]]], LI, 1.8, 0.45) + ell(179.6, -59.4, 1.8, 2.4, 0, LI, 0.3 * st) + L([[[178.6, -55.6], [180.6, -56.6], [182.2, -58.6]]], SC, 1, 0.5);
  mk += ell(191, -60.2, 3.6, 1.6, -12, SC, 0.6) + L([[[187.2, -61.6], [191, -61.4], [194, -60.4]]], LI, 0.6, 0.35) + L([[[181, -55.6], [190, -55.4], [199, -55.8]]], SC, 1, 0.5) + L([[[178, -52.8], [186, -53.2], [196, -54.4]]], SC, 1.6, 0.55);
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
    for (let x = 6; x < 174; x += 1.6 + T.rnd() * 1.2) if (T.rnd() > 0.18) rueckenPkt.push([x - 0.4, yO(x) + 0.55, 0.46 + 0.2 * Math.sin(Math.PI * x / 174) + T.rnd() * 0.1]);
    inn += buckel(T, gruppen(T, rueckenPkt, 0.22, -0.4), haut, { opF: 0.3, opL: 0.16, lang: 1.4, flach: 1 });
    inn += buckel(T, gruppen(T, tuberkelReihen(T, oben, unten, 30, 172, [[0.06, 0.32, 1.4, 0.18, 0.3, 0.6]])), null, { opF: 0.18, opL: 0.1 });
    inn += reihe(T, band(0.92, 98, 172), 32, 2, "#1e160c", 0.13, 0.22, -0.7) + reihe(T, band(0.92, 4, 92), 40, 1, "#1e160c", 0.09, 0.16, -0.3);
    inn += mosaik(T, [[186, -62.6], [189, -64.6], [196.2, -62.4], [200.2, -59.4], [200.6, -57.6], [194, -57.2], [187, -57.8]], 1.7, haut, { opF: 0.28, opL: 0.18, fuge: 0.76 });
    inn += buckel(T, flaechenPunkte(T, [[177.8, -59], [178.6, -62.4], [181, -63.8], [180.6, -59], [178.6, -56.8]], 0.8, 0.2, 0.3), null, { opF: 0.22, opL: 0.12 });
    inn += mosaik(T, kiefer, 1.6, haut, { opF: 0.24, opL: 0.14, fuge: 0.76 });
    /* Hörnchen: rauer Knochen mit 2–3 Furchen */
    inn += linien(T, [[[183.6, -64.8], [185, -65.8]], [[184.8, -64.6], [186.4, -65.6]], [[186.2, -64.8], [187.6, -65.2]]], SC, 0.14, 0.55);
    inn += buckel(T, flaechenPunkte(T, [[152, -53.4], [162, -57.4], [170, -61.6], [176, -61], [174, -54], [164, -49], [154, -44]], 1.2, 0.18, 0.28, 0.5), null, { opF: 0.2, opL: 0.1 });
  }
  /* Lippenwulst mit Schattenlinie */
  const welle = []; lippe.slice().reverse().forEach(([x, y], i, a) => { welle.push([x, y]); const n = a[i + 1]; if (n) welle.push([(x + n[0]) / 2, (y + n[1]) / 2 - 0.25]); });
  inn += weichG(T, 0.25, [176, -60, 202, -52], L([verschiebe(welle, 0, 0.35)], SC, 0.45, 0.7) + L([verschiebe(welle, 0, -0.45)], LI, 0.4, 0.3));
  k += geklippt(T, [iL, iK, iS], inn);
  k += zaehne(T, [[199.2, 1.2], [196.2, 1.0], [194.6, 0.7], [190.8, 0.9], [187.4, 0.6], [185.8, 0.5]].map(([x, Lz]) => [x, -57.4 + (200 - x) * 0.012, Lz + 0.35, (Lz + 0.35) * 0.45, 0.42]), 1, "a");
  /* Nasenloch: Oval innerhalb der Kontur in flacher Grube, Lichtkante oben */
  k += weichG(T, 0.25, [196, -61, 201, -58], ell(198.4, -59.6, 1.1, 0.55, -20, SC, 0.4)) + ell(198.5, -59.7, 0.6, 0.26, -20, "#160e06", 0.9) + `<path d="M197.4 -60.4q1.1-.6 2.2-.2" fill="none" stroke="${LI}" stroke-width=".14" stroke-opacity=".5"/>`;

  let s = h + volZonen(T, "leib", k, [0, -68, 202, 0], [[0, 0, "r", { weich: 5, tiefe: 5, umgebung: 0.3 }], [-10, 76, "s", { weich: 2.2, tiefe: 4, umgebung: 0.3 }],
    [150, 177, "h", { weich: 3, tiefe: 4.5, umgebung: 0.3 }], [177, 210, "k", { weich: 1.8, tiefe: 3.5, umgebung: 0.35 }]], 9);
  s += `<use href="#${iUB}" filter="${dunkler(T, 0.92)}"/>` + `<use href="#${iSG}"/>` + `<use href="#${iA}"/>`;
  s += kontakt(T, [[102, 106], [107, 110.6], [111, 114], [112.6, 116.4], [104, 108.6]]);
  if (F) s = `<g filter="${T.relief("haut", { f: 3.4, tiefe: 0.045, okt: 2 })}">${s}</g>`;
  s += reptilAuge(T, 183.2, -61.9, 1.12, { n: "a", hell: "#f0c25a", iris: "#c4902e" });
  s += krallen(T, [[159.2, -33.4, 5, 1.5, 42, 0.95], [161.8, -30.8, 3.2, 1, 62, 0.9], [159.8, -28.4, 2.6, 0.85, 78, 0.9], [116.4, -0.9, 2.4, 1.15, 26, 0.25], [113.4, -0.9, 2.2, 1.05, 28, 0.25],
    [102.8, -0.6, 1.8, 0.95, 160, -0.25], [99.6, -3.4, 1.1, 0.5, 100, -0.4]]);
  GEN = 10;
  return Object.assign(fertig(4.25, s, [-0.4, -66.4, 200.8, 0]), { fuesse: [100 * 4.25, 110 * 4.25], kopf: [175 * 4.25, -68 * 4.25, 202 * 4.25, -50 * 4.25] });
}

/* =====================================================================
   PTERANODON – ein FLUGSAURIER (Pterosaurier), KEIN Dinosaurier! (für den Tipp: „Der Pteranodon ist kein
   Dinosaurier, sondern ein Flugsaurier – ein Verwandter, der mit Hautflügeln flog.")
   RECHERCHE: Pteranodon longiceps (Oberkreide, ~86–84 Mio. J., Niobrara-Meer, Kansas). Männchen (langer Kamm)
   ~5,6 m Spannweite, Weibchen 3,5–4 m; nur ~20–25 kg. Kurzer, kompakter Rumpf mit breiter Brust, kurzer, kräftiger
   Hals (~12–14 % der Spannweite), Schwanzstummel. Schädel mit Kamm ≈ ¼ der Spannweite: zahnloser, langer Schnabel
   (Hornscheide mit Längsmaserung, Schneidekante leicht S-förmig, Unterkieferspitze leicht aufgebogen); Kamm als
   flache Klinge mit breiter Basis vom Auge bis zum Hinterkopf, nach hinten verjüngt, Spitze stumpf. Flügel mit
   großem Seitenverhältnis (≈ 9), nur leicht gepfeilt: Oberarm kurz und kräftig, Unterarm und die längere Mittelhand
   (~1,3×) bilden die Vorderkante, am Handgelenk 3 kleine Krallenfinger und das Pteroid (stützt die schmale
   Vorflughaut zum Hals); der lange Flugfinger läuft gerade zur Spitze. Flughaut bis zum Knöchel, größte Tiefe am
   Handgelenk, Aktinofibrillen im Außenflügel radial vom Flugfinger zur Hinterkante, durchscheinender Hinterkantensaum.
   Pyknofasern („Fell") auf Körper und Hals. Beine kurz, Zehen gebündelt.
   Gezeichnet im Gleitflug schräg von oben (ferner Flügel perspektivisch verkürzt), der Kopf um die Halsachse gedreht.
   Zeichenraum: 1 Einheit = 2,77 cm (Spannweite ≈ 5,5 m).
   ===================================================================== */
function pteranodon(T) {
  const F = T.fein;
  GEN = F ? 10 : 2; T._ganz = [-28, -94, 68, 110];
  const LI = "#fff2d8", SC = "#120c08";
  const st = F ? 0.8 : 1;
  const L = (arr, farbe, w, op) => linien(T, arr, farbe, w, op * st);
  /* Gegenschattierung: Oberflügel zur Vorderkante dunkler; Rumpf/Kopf heller */
  const hautO = T.lg("fhaut", [[0, "#5a483c"], [0.55, "#4c3c32"], [1, "#3e3028"]], 1, 0, 0, 0);
  const hautU = T.lg("fhautu", [[0, "#7a6452"], [0.55, "#6a5444"], [1, "#5a4638"]], 1, 0, 0, 0);
  const fell = T.lg("fell", [[0, "#6a5442"], [0.55, "#86705a"], [1, "#a8927a"]]);

  /* Flügel: Profilwölbung (hinter der Vorderkante +15 %, zur Hinterkante −10 %), Spannungsfalten im Innenflügel radial
     zum Körper, Aktinofibrillen im Außenflügel (vom Flugfinger zur Hinterkante, leicht gebogen, nach außen schwächer),
     durchscheinender Saum an der gebuchteten Hinterkante. */
  const fluegel = (vorn, hinten, fill, sgn, b) => {
    /* Hinterkante leicht gebuchtet zwischen Fibrillenbündeln */
    const HP = polyl(hinten), hk = [];
    for (let i = 0; i <= 28; i++) { const [x, y, nx, ny] = HP.at(i / 28), o = i % 2 ? -0.5 * sgn : 0; hk.push([x + nx * o, y + ny * o]); }
    const pts = vorn.concat(hk.slice().reverse().slice(1));
    const A = polyl(vorn.slice(3)), B = polyl(hinten);
    const zw = (u, t0, t1) => { const p = []; for (let i = 0; i <= 12; i++) { const t = t0 + (t1 - t0) * i / 12, a = A.at(t), q = B.at(t); p.push([a[0] + (q[0] - a[0]) * u, a[1] + (q[1] - a[1]) * u]); } return p; };
    let inn = "";
    if (F) {
      const fa = ["", "", ""];
      for (let k = 0; k < 18; k++) {
        const t = 0.25 + 0.72 * (k + T.rnd() * 0.6) / 18, a = A.at(t), q = B.at(Math.min(1, t + 0.03)), u = 0.08 + T.rnd() * 0.1, v = 0.75 + T.rnd() * 0.2;
        fa[Math.min(2, Math.floor(k / 6))] += `M${zk(a[0] + (q[0] - a[0]) * u)} ${zk(a[1] + (q[1] - a[1]) * u)}Q${zk(a[0] + (q[0] - a[0]) * (u + v) / 2 + 0.8)} ${zk(a[1] + (q[1] - a[1]) * (u + v) / 2)} ${zk(a[0] + (q[0] - a[0]) * v)} ${zk(a[1] + (q[1] - a[1]) * v)}`;
      }
      inn += fa.map((d, i) => `<path d="${d.replace(/ -/g, "-")}" fill="none" stroke="#1a120c" stroke-width=".2" stroke-opacity="${[0.1, 0.07, 0.04][i]}"/>`).join("");
    }
    let mal = L([zw(0.14, 0, 1)], LI, 3.4, 0.28) + L([zw(0.8, 0, 1)], SC, 4, 0.2) + L([hinten], "#f0d0a4", 2.4, 0.42);
    for (const t of [0.05, 0.14, 0.24]) { const a = A.at(t), q = B.at(t + 0.06); mal += L([[[a[0] * 0.6 + q[0] * 0.4, a[1] * 0.6 + q[1] * 0.4], [-8, sgn * 6]]], SC, 1.2, 0.12); }
    /* Kontaktschatten des Rumpfes auf dem Innenflügel (nach rechts unten) */
    mal += ell(-2, sgn * 7, 8, 3.4, 0, SC, 0.35);
    return teil(T, pts, fill, { innen: inn, mal, weich: 1.2, box: b });
  };
  /* Knochen der Vorderkante: Oberarm 3 mit Deltopektoral-Wulst, Unterarm 2,4, Mittelhand 1,8, Flugfinger 1,4 → 0,4;
     Gelenke als Verdickung der Kontur, Lichtkante oben links, Schattenseite */
  const knochen = (v, sgn) => {
    const br = [3, 2.4, 1.8, 1.4, 0.9, 0.4], seg = [];
    let s2 = "";
    for (let i = 0; i < v.length - 1; i++) {
      const w0 = br[i] * (i ? 1.25 : 1), w1 = br[i + 1] != null ? br[i + 1] * 1.25 : 0.4;
      seg.push(glied(v[i], v[i + 1], w0, i < 3 ? w1 : br[i + 1] || 0.3, i === 0 ? 0.8 : 0, 0, 0.35, 5, i < 3));
    }
    for (const g of seg) s2 += glatt(g);
    const iK = pfad(T, s2);
    return fuell(iK, "#5e4c3e") + geklippt(T, [iK], weichG(T, 0.35, [-30, -96, 30, 112], L([verschiebe(v, -0.4, -0.5)], LI, 0.8, 0.5) + L([verschiebe(v, 0.4, 0.6)], SC, 0.8, 0.45)));
  };

  /* ---------- ferner Flügel (oben, verkürzt) ---------- */
  const fV = [[5, -4], [10.6, -12], [15, -26], [14, -46], [9, -60], [3, -77], [-2, -92]];
  const fH = [[-20, -7], [-18, -20], [-15.4, -34], [-12, -50], [-8.4, -66], [-5, -80], [-2, -92]];
  let s = fluegel(fV, fH, hautO, -1, [-24, -94, 18, -2]);
  /* Vorflughaut: flaches Dreieck Halsansatz → Handgelenk, Vorderkante leicht konkav, Pteroid als dunkler Strich */
  s += flaeche(T, [[12, -3], [17, -12], [18.4, -24], [15, -26], [10.6, -12], [5, -4]], "#5c4a3e", 0.95) + L([[[15.6, -25.4], [17.6, -22.6]]], SC, 0.4, 0.8);
  s += knochen(fV, -1);
  s += krallen(T, [[16, -28.6, 1.6, 0.6, 20, 0.9], [16.4, -27.4, 1.7, 0.6, 0, 0.9], [16, -26.2, 1.5, 0.55, -25, 0.9]]);

  /* ---------- Beine: kurze, bepelzte Oberschenkel, schlanke Unterschenkel, Füße gebündelt; Schwanzstummel ---------- */
  for (const sgn of [-1, 1]) {
    const sk = glied([-7, sgn * 2], [-13.6, sgn * 6], 3.4, 2.2, 0.3, 0.3, 0.5, 4, true), us = glied([-13.6, sgn * 6], [-20, sgn * 7.6], 1.8, 1.2, 0, 0, 0.5, 4, true);
    s += teil(T, us, sgn > 0 ? "#86705a" : "#5e4c3e", { klein: 1 }) + teil(T, sk, sgn > 0 ? fell : "#5e4c3e", { klein: 1, mal: L([[[-8, sgn * 2.2], [-13, sgn * 5.4]]], LI, 0.6, 0.3), weich: 0.3 });
    let z = "";
    for (let i = 0; i < 4; i++) z += `M${zk(-20)} ${zk(sgn * 7.6)}l${zk(-2)} ${zk(sgn * (0.1 + i * 0.22))}`;
    s += `<path d="${z.replace(/ -/g, "-")}" stroke="${sgn > 0 ? "#86705a" : "#5e4c3e"}" stroke-width=".5" stroke-linecap="round" fill="none"/>`;
  }
  s += teil(T, [[-8, -1], [-12, -0.6], [-12.6, 0.2], [-12, 1], [-8, 1.2]], fell, { klein: 1 });

  /* ---------- Rumpf (kompakt) und kurzer, kräftiger Hals mit Pyknofasern ---------- */
  const rumpf = [[10, -5.6], [4, -7.2], [-3, -7], [-8, -4.6], [-10.4, -1.6], [-10.6, 0.6], [-8.4, 3.6], [-3, 6.8], [4, 7.4], [10, 5.6]];
  const hals = [[8, -3.6], [14, -3.4], [20, -2.8], [24, -2.4], [25, 1.8], [20, 2.4], [14, 3], [8, 3.8]];
  const iR = pfad(T, rumpf), iHa = pfad(T, hals);
  let r = fuell(iHa, fell) + fuell(iR, fell);
  let fe = "";
  if (F) {
    fe += federn(T, rumpf, 240, (x, y) => 180 + y * 2.4, 1.3, [["#3a2a1e", 1, 0.15, 0.16], ["#e0caa6", 0.6, 0.13, 0.16]], { kr: 0.3, streuung: 10 });
    fe += federn(T, hals, 110, 180, 1, [["#3a2a1e", 1, 0.13, 0.16], ["#e0caa6", 0.6, 0.11, 0.16]], { kr: 0.3, streuung: 8 });
  }
  /* Rücken dunkler, Brust heller; Halsunterseite im Kernschatten; die Licht/Schatten-Grenze wandert am Hals zur Seite (Drehung) */
  let rm = L([[[9, -4.6], [0, -6], [-8, -3.6]]], "#3a2a1e", 2.8, 0.42) + L([[[9, 4.6], [0, 6], [-8, 3]]], "#e8d2ae", 2.6, 0.3) + ell(5, -2.6, 3.6, 2.6, 0, LI, 0.24 * st);
  rm += L([[[9, -2.2], [15, -2.2], [20, -1.6], [24, -0.6]]], "#3a2a1e", 1.1, 0.35) + L([[[9, 2.6], [16, 2], [24, 1.2]]], SC, 1, 0.4);
  r += geklippt(T, [iR, iHa], fe + weichG(T, 0.8, [-12, -9, 27, 9], rm));
  if (F) r += federn(T, rumpf.map(([x, y]) => [x * 1.05, y * 1.1]), 100, (x, y) => 180 + y * 2, 0.7, [["#7a6450", 1, 0.13, 0.45]], { kr: 0.3 }) + federn(T, hals.map(([x, y]) => [x, y * 1.18]), 50, 182, 0.6, [["#7a6450", 1, 0.11, 0.45]]);
  s += volZonen(T, "rumpf", r, [-12, -9, 27, 9], [[0, 0, "a", { weich: 1.6, tiefe: 3, umgebung: 0.4 }]]);

  /* ---------- naher Flügel (unten) ---------- */
  const nV = [[5, 4], [11, 13.4], [16, 30], [15, 54], [9.6, 70], [3, 88], [-2, 108]];
  const nH = [[-20, 7.6], [-18, 22], [-15, 38], [-11.6, 56], [-8, 74], [-4.6, 92], [-2, 108]];
  s += fluegel(nV, nH, hautU, 1, [-24, 2, 19, 110]);
  s += flaeche(T, [[12, 3], [18, 13], [19.4, 27], [16, 30], [11, 13.4], [5, 4]], "#7a6452", 0.95) + L([[[16.6, 29.4], [18.8, 26]]], SC, 0.4, 0.8);
  s += knochen(nV, 1);
  /* drei kleine Krallenfinger am Handgelenk, nach vorn-innen, Schatten nur auf der Flughaut */
  s += weichG(T, 0.4, [12, 26, 22, 36], ell(17.6, 31.4, 1.6, 0.7, 20, SC, 0.35));
  s += krallen(T, [[16.6, 28.4, 1.8, 0.65, -20, 0.95], [17, 29.6, 1.9, 0.65, 0, 0.95], [16.6, 30.8, 1.7, 0.6, 25, 0.95]]);

  /* ---------- Kopf: um die Halsachse gedreht (schmaler Streifen der Schädeloberseite sichtbar) ---------- */
  const kamm = [[34, -6.6], [28, -8.8], [21, -10.4], [15, -11.4], [12.4, -11.6], [11.8, -10.8], [13.2, -9.8], [18, -8.4], [24, -6.2], [28.6, -3.6], [31.6, -1.4], [33.6, -2.8]];
  const kopfO = [[29.6, -1.2], [30.4, -4.4], [33, -6.2], [37, -6.4], [42, -5.4], [50, -3.8], [58, -2.4], [64, -1.2], [65.4, -0.7], [65.4, -0.2], [64, 0], [56, 0], [48, 0.5], [42, 0.9], [36, 1.6], [31.4, 1.6]];
  const unterK = [[34, 1], [42, 0.8], [50, 0.5], [57, 0.1], [63, -0.5], [65, -0.9], [65.2, -0.3], [63, 0.5], [56, 1.2], [46, 2], [38, 2.6], [33.6, 2.6]];
  const ober = [[31, -4.6], [33.4, -6.6], [37.4, -6.8], [42, -6], [50, -4.4], [58, -2.9], [64.4, -1.3], [58, -2.2], [50, -3.6], [42, -5.2], [37, -5.8], [33, -5.6]];
  const iKa = pfad(T, kamm), iKo = pfad(T, kopfO), iU = pfad(T, unterK), iOb = pfad(T, ober);
  const horn = T.lg("schnabel", [[0, "#3e3226"], [0.3, "#5a4a3a"], [0.75, "#4c3e30"], [1, "#241c14"]], 0, 0, 1, 0);
  let k = fuell(iU, "#463a2e") + fuell(iKa, T.lg("kamm", [[0, "#5e2e1a"], [0.45, "#6e3a22"], [1, "#6a5642"]], 0, 0, 1, 0)) + fuell(iKo, horn) + fuell(iOb, "#7a6a56");
  /* Licht: Glanzkante oben links am Schnabel, Kamm mit Längsrillen und Schatten auf den Hals, Kiefergelenk unter dem Auge, Hautfalte am Mundwinkel */
  let km = L([[[33.6, -5.2], [40, -5.6], [52, -3.6], [63, -1.4]]], LI, 0.6, 0.6) + L([[[36, 1.2], [48, 0.2], [62, -0.2]]], SC, 0.7, 0.45);
  km += ell(34.6, 1.4, 1, 0.6, 0, SC, 0.45) + L([[[33.8, 1.4], [35.4, 0.6]]], SC, 0.25, 0.6);
  km += L([[[32, -7.2], [24, -9.2], [15, -11]]], LI, 0.6, 0.4) + L([[[30, -3], [22, -6], [14, -9.6]]], SC, 0.6, 0.4);
  let ki = "";
  if (F) ki += linien(T, [[[44, -2.6], [56, -1.6], [63, -0.8]], [[46, -1.2], [58, -0.6]], [[42, -4], [54, -2.8]], [[30, -6.4], [22, -8.4], [15, -10.4]], [[30, -5], [22, -7.2], [15, -9.8]], [[29, -3.8], [21, -6.2]]], "#2a1e14", 0.1, 0.2);
  k += geklippt(T, [iU, iKa, iKo, iOb], ki + weichG(T, 0.4, [10, -13, 67, 4], km));
  /* Schneidekante leicht S-förmig, Unterkieferspitze aufgebogen, Spitze nicht nadelfein */
  k += L([[[34, 1], [42, 0.8], [50, 0.4], [57, 0], [62, -0.4], [65, -0.8]]], SC, 0.3, 0.8);
  /* Schlagschatten von Kamm und Kopf auf den Hals/fernen Flügel */
  s += weichG(T, 1, [6, -14, 34, 0], flaeche(T, verschiebe(kamm, 1.6, 2.4), SC, 0.25));
  s += volZonen(T, "kopf", k, [10, -13, 67, 4], [[0, 0, "a", { weich: 0.8, tiefe: 2.5, umgebung: 0.4 }]]);
  s += reptilAuge(T, 34.8, -4.2, 1.1, { n: "p", hell: "#9a4a2a", iris: "#6a2e18", rand: "#2a1008", lidHell: "#d8c8a8" });
  GEN = 10;
  const f = 2.77;
  return Object.assign(fertig(f, `<g transform="translate(0 -110.6)">${s}</g>`, [-22.6, -203.4, 65.6, 0]), { kopf: [8 * f, -124 * f, 68 * f, -98 * f] });
}

const ARTEN = [
  { id: "tyrannosaurus", de: "der Tyrannosaurus", syl: "Ty-ran-no-SAU-rus", it: "il tirannosauro", itSyl: "ti-ran-no-SAU-ro", en: "Tyrannosaurus rex",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 12.38, hoehe: 4.3, f: typeof tyrannosaurus === "function" && tyrannosaurus },
  { id: "velociraptor", de: "der Velociraptor", syl: "Ve-lo-ci-RAP-tor", it: "il velociraptor", itSyl: "ve-lo-ci-RAP-tor", en: "velociraptor",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 1.81, hoehe: 0.64, f: typeof velociraptor === "function" && velociraptor },
  { id: "spinosaurus", de: "der Spinosaurus", syl: "Spi-no-SAU-rus", it: "lo spinosauro", itSyl: "spi-no-SAU-ro", en: "Spinosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 14, hoehe: 5.04, f: typeof spinosaurus === "function" && spinosaurus },
  { id: "allosaurus", de: "der Allosaurus", syl: "Al-lo-SAU-rus", it: "l'allosauro", itSyl: "al-lo-SAU-ro", en: "Allosaurus",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 8.55, hoehe: 2.82, f: typeof allosaurus === "function" && allosaurus },
  /* Pteranodon: Flugsaurier, KEIN Dinosaurier (gruppe „Dinosaurier" nur für die Sortierung der Urzeit-Tiere; der Tipp sagt es) */
  { id: "pteranodon", de: "der Pteranodon", syl: "Pte-ra-NO-don", it: "lo pteranodonte", itSyl: "pte-ra-no-DON-te", en: "pteranodon",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 2.45, hoehe: 5.63, fliegt: true, f: typeof pteranodon === "function" && pteranodon,
    tipp: "Der Pteranodon ist kein Dinosaurier, sondern ein Flugsaurier. Er flog mit Flügeln aus Haut." },
];
module.exports = ARTEN.filter((a) => a.f).map(({ f, ...a }) => Object.assign(a, { zeichne: f }));
