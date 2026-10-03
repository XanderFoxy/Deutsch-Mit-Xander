/* =====================================================================
   TIER-BIBLIOTHEK — HAUSTIERE (FASSUNG 854, MASSSTAB 2, Runde 2)
   Hund, Katze, Kaninchen, Meerschweinchen, Hamster, Wellensittich,
   Goldfisch, Maus. Maße in Zentimetern, Blick nach rechts, Boden y = 0,
   EIN Licht von links oben vorn. Werkzeug T: siehe kern.js.
   Aufbau je Tier: ferne Glieder (Körperton, 12–25 % dunkler) → Schwanz →
   Leib mit nahen Beinen als EIN Umriss → Muskel-Wülste → Kopf → Ohr.
   Plastizität ohne Airbrush: jede Form bekommt „Formlicht“ (ihre eigene
   Kontur, zum Licht hin versetzt und weich gezeichnet: Kernschatten-Band
   auf der Schattenseite mit Reflexlicht am Rand, Lichtkante oben links),
   Schlagschatten der überdeckenden Teile, und das Fell Haar für Haar in
   Strähnen, deren Farbe aus einem Licht-Feld (aufgeblasene Silhouette,
   Normale · Licht) kommt. Keine Umrisslinien, Haarspitzen über die Kontur.
   ===================================================================== */
"use strict";

/* ---------- Zahlen und Pfade ---------- */
const r = (n) => Math.round(n * 10) / 10;
const zahl = (n, dez = 2) => {
  const f = dez === 1 ? 10 : dez === 3 ? 1000 : 100;
  let s = String(Math.round(n * f) / f);
  if (s === "-0") s = "0";
  return s.replace(/^(-?)0\./, "$1.");
};
/* Zahlenfolge so kurz wie möglich (SVG erlaubt „.5.3“ und „1-2“) */
const folge = (zs, dez = 2) => {
  let s = "", punkt = false;
  zs.forEach((n, i) => {
    const t = zahl(n, dez);
    s += i === 0 || t[0] === "-" || (t[0] === "." && punkt) ? t : " " + t;
    punkt = t.includes(".");
  });
  return s;
};
const klemm = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
function mix(a, b, t) {
  const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
}
/* Schlauch um eine Mittellinie; kappe = runde Enden */
function schlauch(c, w, kappe = false) {
  const L = [], R = [];
  const W = (i) => (Array.isArray(w) ? w[i] : w) / 2;
  for (let i = 0; i < c.length; i++) {
    const a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const h = W(i), nx = -dy / l * h, ny = dx / l * h;
    L.push([c[i][0] + nx, c[i][1] + ny]); R.push([c[i][0] - nx, c[i][1] - ny]);
  }
  if (kappe) {
    const n = c.length - 1, a = c[n - 1], b = c[n], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return L.concat([[b[0] + (b[0] - a[0]) / l * W(n) * 0.9, b[1] + (b[1] - a[1]) / l * W(n) * 0.9]], R.reverse());
  }
  return L.concat(R.reverse());
}
const schieb = (pts, dx, dy = 0) => pts.map((p) => [p[0] + dx, p[1] + dy].concat(p[2] ? [1] : []));
/* Punkte der geschlossenen Catmull-Rom-Kurve (wie T.glatt) */
function kurve(pts, schritte = 6) {
  const n = pts.length, P = (i) => pts[(i + n) % n], out = [];
  for (let i = 0; i < n; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let k = 0; k < schritte; k++) {
      const t = k / schritte, u = 1 - t;
      out.push([0, 1].map((j) => u * u * u * p1[j] + 3 * u * u * t * c1[j] + 3 * u * t * t * c2[j] + t * t * t * p2[j]));
    }
  }
  return out;
}
/* Abschnitt einer Mittellinie (Bogenlänge t0…t1) als Schlauch – Ringe, Bänder, Streifen */
function abschnitt(c, w, t0, t1, k = 5) {
  const L = [0];
  for (let i = 1; i < c.length; i++) L.push(L[i - 1] + Math.hypot(c[i][0] - c[i - 1][0], c[i][1] - c[i - 1][1]));
  const ges = L[L.length - 1];
  const bei = (t) => {
    const d = klemm(t) * ges; let i = 1;
    while (i < c.length - 1 && L[i] < d) i++;
    const u = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
    const wi = Array.isArray(w) ? w[i - 1] + (w[i] - w[i - 1]) * u : w;
    return [[c[i - 1][0] + (c[i][0] - c[i - 1][0]) * u, c[i - 1][1] + (c[i][1] - c[i - 1][1]) * u], wi];
  };
  const pts = [], ws = [];
  for (let j = 0; j <= k; j++) { const [p, wi] = bei(t0 + (t1 - t0) * j / k); pts.push(p); ws.push(wi); }
  return schlauch(pts, ws);
}

/* ---------- Filter (einmal je Art) ---------- */
const STUFEN = [0.06, 0.1, 0.15, 0.22, 0.3, 0.45, 0.65, 0.9, 1.3, 1.8, 2.6, 3.6, 5];
function weich(T, sd) {
  sd = STUFEN.reduce((b, v) => (Math.abs(Math.log(v / sd)) < Math.abs(Math.log(b / sd)) ? v : b), STUFEN[0]);
  const id = T.id("bl" + String(sd).replace(".", "_"));
  T._f = T._f || {};
  if (!T._f[id]) { T._f[id] = 1; T.def(`<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${sd}"/></filter>`); }
  return `url(#${id})`;
}
const mal = (T, sd, inhalt) => `<g filter="${weich(T, sd)}">${inhalt}</g>`;
/* Kanten in Wuchsrichtung aufrauen (Haarspitzen in Zeichnung/Streifen); nur fein */
function zottel(T, f, k) {
  if (!T.fein) return "";
  const id = T.id("zt" + String(k).replace(".", "_"));
  T._f = T._f || {};
  if (!T._f[id]) { T._f[id] = 1; T.def(`<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="${f}" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${k}" xChannelSelector="R" yChannelSelector="G"/></filter>`); }
  return ` filter="url(#${id})"`;
}

/* ---------- Formen ---------- */
/* glatte geschlossene Kurve (Catmull-Rom wie T.glatt), aber relativ und kompakt; [x, y, 1] = Ecke. T.dez = Stellen */
function glatt(T, pts, zu = true) {
  const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const dez = T.dez || 1;
  let d = "M" + folge([pts[0][0], pts[0][1]], dez), cx = +zahl(pts[0][0], dez), cy = +zahl(pts[0][1], dez);
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    const z = [c1[0] - cx, c1[1] - cy, c2[0] - cx, c2[1] - cy, p2[0] - cx, p2[1] - cy].map((v) => +zahl(v, dez));
    d += "c" + folge(z, dez);
    cx += z[4]; cy += z[5];
  }
  return d + (zu ? "z" : "");
}
const form = (T, pts, fill, extra = "") => `<path d="${typeof pts === "string" ? pts : glatt(T, pts)}" fill="${fill}"${extra}/>`;
/* Pfad einmal in den defs (mit Clip); liefert die id */
function pfad(T, pts) {
  const d = typeof pts === "string" ? pts : glatt(T, pts);
  T._n = (T._n || 0) + 1;
  const id = T.id("t" + T._n);
  T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}k"><use href="#${id}"/></clipPath>`);
  return id;
}
const LICHT = [-0.5, -0.86];          // Richtung zum Licht (links oben)
/* Formlicht: Kontur zum Licht hin versetzt → Kernschatten-Band auf der Schattenseite (Rand bleibt als Reflexlicht frei);
   vom Licht weg versetzt → Lichtkante oben links. f: { a, w, b, s: [Farbe, Deckkraft], al, wl, l: [Farbe, Deckkraft], ar, wr, r: [...] } */
function formlicht(T, id, f) {
  const [dx, dy] = f.dir || LICHT;
  const u = (k, farbe, op, w) => `<use href="#${id}" fill="none" stroke="${farbe}" stroke-opacity="${op}" stroke-width="${zahl(w)}" transform="translate(${folge([dx * k, dy * k])})"/>`;
  let s = "";
  if (f.s) s += u(f.a, f.s[0], f.s[1], f.w);
  if (f.r) s += u(f.ar != null ? f.ar : f.w * 0.15, f.r[0], f.r[1], f.wr || f.w * 0.3);
  if (f.l) s += u(-(f.al != null ? f.al : f.a * 0.6), f.l[0], f.l[1], f.wl || f.w);
  return `<g filter="${weich(T, f.b)}">${s}</g>`;
}
/* Körperteil. o: { innen, form, vol (Verlauf oben hell/unten dunkel), ueber (ungeklippt danach), rand: [Farbe, Deckkraft, Breite] } */
function teil(T, pts, fill, o = {}) {
  const id = typeof pts === "string" && pts.startsWith("#") ? pts.slice(1) : pfad(T, pts);
  const u = (a) => `<use href="#${id}"${a}/>`;
  let s = u(` fill="${fill}"`);
  const innen = (o.innen || "") + (o.vol ? u(` fill="${T.VOL()}"`) : "") + (o.form ? formlicht(T, id, o.form) : "") + (o.nach || "");
  if (innen) s += `<g clip-path="url(#${id}k)">${innen}</g>`;
  if (o.rand) s += u(` fill="none" stroke="${o.rand[0]}" stroke-opacity="${o.rand[1]}" stroke-width="${o.rand[2]}"`);
  s += o.ueber || "";
  /* Übergang weich ausblenden (z. B. Hinterkopf in den Hals): o.blende = [x1, y1, x2, y2, a, b] in Box-Einheiten */
  if (o.blende) {
    const [x1, y1, x2, y2, a = 0, b = 1] = o.blende;
    const g = T.lg("bl" + o.blende.join("_").replace(/\./g, "p").replace(/-/g, "m"), [[a, "#000"], [b, "#fff"]], x1, y1, x2, y2);
    T.def(`<mask id="${id}b" maskContentUnits="objectBoundingBox"><rect x="-.1" y="-.1" width="1.2" height="1.2" fill="${g}"/></mask>`);
    s = `<g mask="url(#${id}b)">${s}</g>`;
  }
  return s;
}
/* Muskel-/Knochenwulst: eigenes Formlicht einer Teilform, weich maskiert (keine Kante) */
function wulst(T, pts, f) {
  const id = pfad(T, pts);
  T.def(`<mask id="${id}m"><use href="#${id}" fill="#fff" filter="${weich(T, f.m || 0.8)}"/></mask>`);
  return `<g mask="url(#${id}m)">${formlicht(T, id, f)}</g>`;
}
/* Schlagschatten einer Form (id) auf die darunterliegende: versetzt und weich (innerhalb eines Clips verwenden) */
const schlag = (T, id, dx, dy, b, farbe, op) => `<use href="#${id}" fill="${farbe}" opacity="${op}" transform="translate(${folge([dx, dy])})" filter="${weich(T, b)}"/>`;
/* weiche Licht-/Schattenflecken (nur für kleine Stellen: Augenhöhle, Nasenlicht) */
function fleck(T, x, y, rx, ry, farbe, op, rot = 0) {
  const f = farbe === "hell" ? T.rg("fleck", [[0, "#fff", 1], [0.5, "#fff", 0.42], [1, "#fff", 0]])
    : farbe === "dunkel" ? T.rg("fleckd", [[0, "#000", 1], [0.5, "#000", 0.42], [1, "#000", 0]]) : farbe;
  return `<ellipse cx="${zahl(x)}" cy="${zahl(y)}" rx="${zahl(rx)}" ry="${zahl(ry)}" fill="${f}" opacity="${op}"${rot ? ` transform="rotate(${rot} ${zahl(x)} ${zahl(y)})"` : ""}/>`;
}
const falte = (T, pts, farbe, w, op) => T.linie(pts, farbe, w, ` stroke-opacity="${op}"`);

/* ---------- Licht-Feld: aufgeblasene Silhouette, Normale · Licht ----------
   R = Wölbungsradius (cm). Liefert f(x, y) → −1 … 1 (0,55 = Fläche zum Betrachter). */
function feld(pts, R, extra) {
  const k = kurve(pts, 5);
  const L = [-0.45, -0.7, 0.55];
  return (x, y) => {
    let best = 1e12, cx = x, cy = y;
    for (const p of k) { const dd = (p[0] - x) ** 2 + (p[1] - y) ** 2; if (dd < best) { best = dd; cx = p[0]; cy = p[1]; } }
    const d = Math.sqrt(best) || 1e-6, t = klemm(1 - d / R);
    const nx = (cx - x) / d * t, ny = (cy - y) / d * t, nz = Math.sqrt(Math.max(0, 1 - t * t));
    let v = nx * L[0] + ny * L[1] + nz * L[2];
    if (ny > 0.3) v += (ny - 0.3) * 0.25;                  // Reflexlicht vom Boden an der Unterkante
    return v + (extra ? extra(x, y) : 0);
  };
}

/* ---------- Haare ----------
   Strähnen: je Strähne b Haare, die von nah beieinander liegenden Wurzeln zu einer gemeinsamen Spitze laufen
   (so wirken sie spitz zulaufend). Farbe je Strähne aus wahl(x, y, z) → Eimer-Index. Ausgabe je Eimer EIN Pfad,
   Haare nach Zeilen sortiert und relativ verkettet (klein). o: { n, b, L, flow, streu, wahl, eimer, lf, wo, kr, dez, szene } */
function ausgabe(eimer, listen, dez) {
  return listen.map((h, i) => {
    if (!h.length) return "";
    h.sort((a, b) => (Math.round(a[1] * 2) - Math.round(b[1] * 2)) || (a[0] - b[0]));
    let d = "", px = 0, py = 0;
    const e = eimer[i];
    for (const hh of h) {
      const [x0, y0, x1, y1] = hh;
      if (hh.length === 6 && hh[4] === "s") {
        /* spitze Strähne: Dreieck Wurzel links – Spitze – Wurzel rechts (wirkt wie zulaufende Haare) */
        const w = hh[5], l = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / l * w / 2, ny = (x1 - x0) / l * w / 2;
        const ax = x0 + nx, ay = y0 + ny;
        d += (d ? "m" + folge([ax - px, ay - py], dez) : "M" + folge([ax, ay], dez)) + "l" + folge([x1 - ax, y1 - ay, -nx * 2 - (x1 - ax), -ny * 2 - (y1 - ay)], dez);
        px = ax - nx * 2; py = ay - ny * 2;
        continue;
      }
      const [, , , , cx, cy] = hh;
      d += (d ? "m" + folge([x0 - px, y0 - py], dez) : "M" + folge([x0, y0], dez));
      d += cx == null ? "l" + folge([x1 - x0, y1 - y0], dez) : "q" + folge([cx - x0, cy - y0, x1 - x0, y1 - y0], dez);
      px = x1; py = y1;
    }
    if (e[4] === "s") return `<path d="${d}" fill="${e[0]}" fill-opacity="${e[2]}"/>`;
    return `<path d="${d}" fill="none" stroke="${e[0]}" stroke-width="${e[1]}" stroke-opacity="${e[2]}"${e[3] ? "" : ` stroke-linecap="round"`}/>`;
  }).join("");
}
function haar(T, pts, o) {
  const [x0, y0, x1, y1] = T.box(pts);
  const listen = o.eimer.map(() => []);
  const ziel = Math.round(o.n * (T.fein ? 1 : (o.szene || 0)));
  if (!ziel) return "";
  const b = o.b || 3, dez = o.dez || 2;
  let v = 0, g = 0;
  while (g < ziel && v < ziel * 20) {
    v++;
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!T.inPoly(x, y, pts) || (o.wo && !o.wo(x, y))) continue;
    const a = (o.flow(x, y) + (T.rnd() - 0.5) * (o.streu != null ? o.streu : 12)) * Math.PI / 180;
    const L = o.L * (0.6 + T.rnd() * 0.8) * (o.lf ? o.lf(x, y) : 1);
    const ca = Math.cos(a), sa = Math.sin(a);
    const tx = x + ca * L, ty = y + sa * L;
    const idx0 = o.wahl(x, y, T.rnd());
    if (o.spitz) { listen[klemm(idx0, 0, o.eimer.length - 1)].push([x - ca * L * 0.1, y - sa * L * 0.1, tx, ty, "s", o.spitz * (0.7 + T.rnd() * 0.6)]); g++; continue; }
    const kr = (o.kr || 0) * L * (T.rnd() - 0.5) * 2;
    for (let j = 0; j < b; j++) {
      const q = (j - (b - 1) / 2) * L * (o.spread != null ? o.spread : 0.09) + (T.rnd() - 0.5) * L * 0.04;
      const rx = x - sa * q - ca * L * 0.15 * T.rnd(), ry = y + ca * q - sa * L * 0.15 * T.rnd();
      const ex = tx - sa * q * 0.15, ey = ty + ca * q * 0.15;
      const idx = klemm(idx0 + (T.rnd() < 0.25 ? (T.rnd() < 0.5 ? -1 : 1) : 0), 0, o.eimer.length - 1);
      if (o.kr) listen[idx].push([rx, ry, ex, ey, (rx + ex) / 2 - sa * kr, (ry + ey) / 2 + ca * kr]);
      else listen[idx].push([rx, ry, ex, ey]);
    }
    g++;
  }
  return ausgabe(o.eimer, listen, dez);
}
/* Haare über die Kontur hinaus (weicher Fellrand). o: { n, L, flow, ab (Anteil nach außen), wo, eimer, wahl, dez, kr, szene } */
function randhaar(T, pts, o) {
  const k = kurve(pts, 8), m = k.length;
  const listen = o.eimer.map(() => []);
  const ziel = Math.round(o.n * (T.fein ? 1 : (o.szene || 0)));
  if (!ziel) return "";
  for (let j = 0; j < ziel; j++) {
    const i = Math.floor(T.rnd() * m), p = k[i], a = k[(i + m - 1) % m], b = k[(i + 1) % m];
    if (o.wo && !o.wo(p[0], p[1])) continue;
    let tx = b[0] - a[0], ty = b[1] - a[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    let nx = ty, ny = -tx;
    if (T.inPoly(p[0] + nx * 0.05, p[1] + ny * 0.05, k)) { nx = -nx; ny = -ny; }
    const fa = o.flow(p[0], p[1]) * Math.PI / 180, ab = o.ab != null ? o.ab : 0.4;
    let dx = nx * ab + Math.cos(fa) * (1 - ab), dy = ny * ab + Math.sin(fa) * (1 - ab);
    const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
    const l = o.L * (0.5 + T.rnd() * 0.9);
    const sx = p[0] - nx * l * 0.45 - dx * l * 0.2, sy = p[1] - ny * l * 0.45 - dy * l * 0.2;
    const idx = klemm(o.wahl(p[0], p[1], T.rnd()), 0, o.eimer.length - 1);
    const kr = (o.kr != null ? o.kr : 0.15) * l * (T.rnd() - 0.5) * 2;
    if (o.spitz) listen[idx].push([sx, sy, sx + dx * l, sy + dy * l, "s", o.spitz * (0.7 + T.rnd() * 0.6)]);
    else listen[idx].push([sx, sy, sx + dx * l, sy + dy * l, sx + dx * l / 2 - dy * kr, sy + dy * l / 2 + dx * kr]);
  }
  return ausgabe(o.eimer, listen, o.dez || 2);
}
/* Licht → Eimer-Index (n Stufen) mit Zufall */
const stufe = (v, z, n, streu = 0.3) => Math.round(klemm(v + (z - 0.5) * streu) * (n - 1));

/* ---------- Auge ----------
   Runde/ovale Lidspalte (keine Mandel, keine Karunkel), dicker dunkler Lidrand, Iris mit Fasern und Limbus,
   Oberlid-Schatten, Fenster-Glanzlicht oben links + Himmelsreflex, feuchter Unterlidrand, gewölbte Hornhaut,
   Augenhöhle (Schatten unter dem Brauenwulst), Wimpern. o: { iris, iris2, mitte (Pupillenhof), pupille: "rund"|"schlitz"|"voll",
   pr (Pupillenradius × r), ratio (Breite/Höhe), winkel, lid, lidw, wimpern: [n, länge, farbe], unten: [n, länge], nick: Farbe,
   hoehle: Deckkraft, ring: [Farbe, Breite, Deckkraft] (Fellring), spitz (0–1: Lidwinkel) } */
function auge(T, x, y, rr, o = {}) {
  T._n = (T._n || 0) + 1;
  const id = T.id("au" + T._n);
  const W = rr * (o.ratio || 1.15), H = rr, sp = o.spitz || 0;
  /* Lidspalte: vorn (rechts, nasal) und hinten leicht spitz je nach sp */
  const P = [[-W, 0, sp > 0.5 ? 1 : 0], [-W * 0.62, -H * 0.86], [0, -H * 1.02], [W * 0.62, -H * 0.84], [W, H * 0.02, sp > 0.5 ? 1 : 0], [W * 0.6, H * 0.8], [0, H * 0.96], [-W * 0.62, H * 0.78]];
  const spalt = (s) => glatt({ dez: rr < 0.5 ? 3 : 2 }, P.map((p) => [p[0] * s, p[1] * s].concat(p[2] ? [1] : [])));
  T.def(`<clipPath id="${id}"><path d="${spalt(1)}"/></clipPath>`);
  const lw = o.lidw || 0.14;
  let s = `<g transform="translate(${folge([x, y])})${o.winkel ? ` rotate(${o.winkel})` : ""}">`;
  if (o.hoehle) s += mal(T, rr * 0.35, `<ellipse cx="${zahl(-W * 0.1)}" cy="${zahl(-H * 0.55)}" rx="${zahl(W * 1.7)}" ry="${zahl(H * 1.15)}" fill="#000" opacity="${o.hoehle}"/>`);
  if (o.ring) s += mal(T, rr * 0.18, `<path d="${spalt(1 + o.ring[1])}" fill="${o.ring[0]}" opacity="${o.ring[2]}"/>`);
  s += `<path d="${spalt(1 + lw)}" fill="${o.lid || "#120a06"}"/>`;
  s += `<g clip-path="url(#${id})">`;
  const iris = o.iris || "#7a4a18", iris2 = o.iris2 || "#2e1806";
  const ir = (o.ir || 1.08) * H;
  const g = T.rg("ir" + iris.slice(1) + iris2.slice(1), [[0, o.mitte || mix(iris, "#ffffff", 0.18)], [0.42, iris], [0.82, iris2], [1, "#0c0604"]], 0.5, 0.5, 0.5);
  s += `<rect x="${zahl(-W)}" y="${zahl(-H * 1.1)}" width="${zahl(2 * W)}" height="${zahl(H * 2.2)}" fill="${o.sklera || "#2a1a10"}"/>`;
  s += `<circle cx="${zahl(W * 0.06)}" cy="${zahl(H * 0.04)}" r="${zahl(ir)}" fill="${g}"/>`;
  if (T.fein && o.fasern !== false) {
    let fa = "";
    for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, a2 = a + (T.rnd() - 0.5) * 0.25; fa += `M${folge([W * 0.06 + Math.cos(a) * ir * 0.42, H * 0.04 + Math.sin(a) * ir * 0.42])}L${folge([W * 0.06 + Math.cos(a2) * ir * 0.9, H * 0.04 + Math.sin(a2) * ir * 0.9])}`; }
    s += `<path d="${fa}" stroke="${iris2}" stroke-width="${zahl(rr * 0.035, 3)}" stroke-opacity=".4" fill="none"/>`;
  }
  const pu = o.pupille || "rund", pr = (o.pr || 0.42) * H;
  if (pu === "rund") s += `<circle cx="${zahl(W * 0.08)}" cy="${zahl(H * 0.04)}" r="${zahl(pr)}" fill="#050302"/>`;
  if (pu === "schlitz") s += `<path d="M${folge([W * 0.08, -H * 0.95])}Q${folge([W * 0.08 + pr * 0.5, 0, W * 0.08, H * 0.95])}Q${folge([W * 0.08 - pr * 0.5, 0, W * 0.08, -H * 0.95])}Z" fill="#050302"/>`;
  /* Oberlid-Schatten auf dem Augapfel */
  s += `<rect x="${zahl(-W)}" y="${zahl(-H * 1.1)}" width="${zahl(2 * W)}" height="${zahl(H * 1.2)}" fill="${T.lg("lidsch", [[0, "#000", 0.7], [0.45, "#000", 0.3], [1, "#000", 0]])}"/>`;
  /* Himmelsreflex (breit, schwach) und Fenster-Glanzlicht oben links */
  s += `<path d="M${folge([-W * 0.75, -H * 0.1])}Q${folge([0, -H * 0.85, W * 0.75, -H * 0.15])}Q${folge([0, -H * 0.55, -W * 0.75, -H * 0.1])}Z" fill="#fff" opacity=".13"/>`;
  /* Fensterlicht: gebogen, weiche Ecken (kein Quader) */
  const gl = (o.glanz || 1);
  s += mal(T, rr * 0.035, `<path d="M${folge([-W * 0.56 * gl, -H * 0.26 * gl])}Q${folge([-W * 0.46 * gl, -H * 0.62 * gl, -W * 0.12 * gl, -H * 0.68 * gl])}L${folge([-W * 0.1 * gl, -H * 0.46 * gl])}Q${folge([-W * 0.36 * gl, -H * 0.44 * gl, -W * 0.42 * gl, -H * 0.18 * gl])}Z" fill="#fff" opacity=".85"/>`);
  if (o.zweit !== false) s += `<circle cx="${zahl(W * 0.4)}" cy="${zahl(H * 0.42)}" r="${zahl(rr * 0.07)}" fill="#fff" opacity=".35"/>`;
  s += `</g>`;
  /* feuchter Unterlidrand, Hornhaut-Wölbung vorn */
  s += `<path d="M${folge([W * 0.7, H * 0.62])}Q${folge([0, H * 1.08, -W * 0.72, H * 0.6])}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="${zahl(rr * 0.05, 3)}"/>`;
  s += `<path d="M${folge([W * 0.55, -H * 0.82])}Q${folge([W * 1.12, -H * 0.1, W * 0.6, H * 0.78])}" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="${zahl(rr * 0.07, 3)}"/>`;
  if (o.nick) s += `<path d="M${folge([W * 0.98, -H * 0.15])}Q${folge([W * 0.62, H * 0.05, W * 0.9, H * 0.3])}Q${folge([W * 1.05, H * 0.1, W * 0.98, -H * 0.15])}Z" fill="${o.nick}" opacity=".6"/>`;
  if (o.wimpern && T.fein) {
    const [n, l, fw] = o.wimpern;
    let d = "";
    for (let i = 0; i < n; i++) {
      const t = 0.12 + 0.84 * i / Math.max(1, n - 1);          // von vorn (rechts) nach hinten (links)
      const bx = W * (1 - 2 * t) * 0.98, by = -H * (1 + lw) * Math.sin(Math.PI * (0.08 + 0.84 * t)) * 0.98;
      const L = rr * l * (0.6 + 0.6 * t) * (0.85 + T.rnd() * 0.3);
      const a = -Math.PI / 2 - 0.35 - 0.9 * t;                 // hinten flacher nach hinten-oben
      d += `M${folge([bx, by])}q${folge([Math.cos(a) * L * 0.5, Math.sin(a) * L * 0.7, Math.cos(a - 0.35) * L, Math.sin(a - 0.35) * L * 0.75])}`;
    }
    s += `<path d="${d}" fill="none" stroke="${fw || "#1a120c"}" stroke-width="${zahl(rr * 0.045, 3)}" stroke-linecap="round"/>`;
  }
  if (o.unten && T.fein) {
    const [n, l] = o.unten;
    let d = "";
    for (let i = 0; i < n; i++) { const t = 0.1 + 0.4 * i / Math.max(1, n - 1), bx = W * (1 - 2 * t) * 0.95, by = H * (1 + lw) * 0.9 * Math.sin(Math.PI * (0.1 + 0.8 * t)); d += `M${folge([bx, by])}l${folge([rr * l * 0.5, rr * l * 0.6])}`; }
    s += `<path d="${d}" fill="none" stroke="${o.lid || "#1a120c"}" stroke-width="${zahl(rr * 0.035, 3)}" stroke-linecap="round" opacity=".7"/>`;
  }
  return s + `</g>`;
}

/* ---------- Tasthaare: aus Follikelreihen, spitz zulaufend, leicht gebogen ----------
   feld = [x, y, breite, hoehe, reihen, spalten] (Follikel), a0/a1 = Winkelbereich (Grad, oben→unten), L = Länge,
   farben = [Wurzelfarbe…], w = Wurzelbreite, op = Deckkraft, punkte = Follikelpunkt-Farbe */
function tasthaar(T, fe, a0, a1, L, farben, w, op = 0.85, punkte) {
  const [fx, fy, fb, fh, nr, nc] = fe;
  let d = Array(farben.length).fill(""), dots = "";
  for (let i = 0; i < nr; i++) for (let j = 0; j < nc; j++) {
    const sx = fb / Math.max(1, nc - 1), sy = fh / Math.max(1, nr - 1);
    const x = fx - sx * j - (i % 2) * sx * 0.5 + (T.rnd() - 0.5) * sx * 0.45 + i * sx * 0.15, y = fy + sy * i + (T.rnd() - 0.5) * sy * 0.4 - j * sy * 0.12;
    if (punkte && T.fein) dots += `M${folge([x, y])}h.01`;
    if (((i + j) % 2 && T.rnd() < 0.3) || (!T.fein && (i + j) % 2)) continue;
    const t = (i + T.rnd() * 0.6) / Math.max(1, nr), a = (a0 + (a1 - a0) * t + (T.rnd() - 0.5) * 8) * Math.PI / 180;
    const l = L * (0.55 + 0.45 * (1 - j / nc)) * (0.75 + T.rnd() * 0.35);
    const ex = x + Math.cos(a) * l, ey = y + Math.sin(a) * l + l * 0.1;
    const cx = x + Math.cos(a) * l * 0.5, cy = y + Math.sin(a) * l * 0.5 - l * 0.04;
    const nx = -Math.sin(a) * w / 2, ny = Math.cos(a) * w / 2;
    const k = Math.floor(T.rnd() * farben.length);
    d[k] += `M${folge([x + nx, y + ny])}Q${folge([cx + nx * 0.4, cy + ny * 0.4, ex, ey])}Q${folge([cx - nx * 0.4, cy - ny * 0.4, x - nx, y - ny])}Z`;
  }
  return (dots ? `<path d="${dots}" stroke="${punkte}" stroke-width="${zahl(w * 1.6, 3)}" stroke-linecap="round" opacity=".7"/>` : "") +
    d.map((dd, k) => dd ? `<path d="${dd}" fill="${farben[k]}" opacity="${op}"/>` : "").join("");
}
/* Zeichnung (Streifen, Ringe, Bänder): liste = [[mittellinie, breiten, t0, t1], …].
   Fein: spitz zulaufende Flächen, alle in EINEM Pfad; Szene: einfache Linien (klein). */
function zeichnung(T, liste, farbe, op) {
  if (T.fein) return `<path d="${liste.map(([m, w, a = 0, b = 1]) => glatt(T, abschnitt(m, w, a, b, 4))).join("")}" fill="${farbe}" opacity="${op}"/>`;
  let d = "";
  for (const [m, w, a = 0, b = 1] of liste) {
    const k = abschnitt(m, 0.01, a, b, 3).slice(0, 4);
    d += "M" + folge(k[0], 1) + "l" + folge([].concat(...k.slice(1).map((p, i) => [p[0] - k[i][0], p[1] - k[i][1]])), 1);
  }
  const wm = liste.reduce((s, [, w]) => s + (Array.isArray(w) ? Math.max(...w) : w), 0) / liste.length;
  return `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${zahl(wm * 0.7)}" stroke-opacity="${op}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
/* Kralle: gebogen, Horn, mit Glanz. (x, y) = Ansatz, l = Länge, a = Richtung (Grad) */
function kralle(T, x, y, l, a, farbe = "#2a2018", dicke = 0.32) {
  const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
  const P = (u, v) => [x + c * u - s * v, y + s * u + c * v];
  const pts = [P(0, -dicke * l), P(l * 0.55, -dicke * l * 0.75), P(l, l * 0.18, 1), P(l * 0.5, dicke * l * 0.55), P(0, dicke * l)];
  return T.form(pts, farbe) + `<path d="M${folge(P(l * 0.1, -dicke * l * 0.45))}Q${folge(P(l * 0.5, -dicke * l * 0.5).concat(P(l * 0.8, -dicke * l * 0.05)))}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="${zahl(l * 0.07, 3)}" stroke-linecap="round"/>`;
}

/* ---------- Fell als Instanzen (Marker) – Runde 3 ----------
   Ein Büschel aus k spitz zulaufenden, leicht gebogenen Haaren wird EINMAL als <marker> definiert. Jeder Punkt eines
   Pfades bekommt ein Büschel, gedreht in Laufrichtung (orient=auto). Pro Büschel nur ≈ 7 Bytes → 5–8-mal dichteres
   Fell als einzeln geschriebene Haare, und es folgt dem Flussfeld. Nur fein (Szene: nichts).
   fellSatz(T, key, o): o = { L (Haarlänge cm), w (Wurzelbreite), k (Haare je Büschel), dunkel, hell, od: [Deckkraft je
   Stufe], oh: [...], krumm } → { d: [marker-ids], h: [marker-ids], L } */
function fellSatz(T, key, o) {
  if (!T.fein) return null;
  const L = o.L, w = o.w || L * 0.075, k = o.k || 6, formen = o.formen || 2, dez = 2;
  const sh = [];
  for (let f = 0; f < formen; f++) {
    let d = "";
    for (let i = 0; i < k; i++) {
      const x = -L * 0.45 + (T.rnd() - 0.5) * L * 0.5, y = (T.rnd() - 0.5) * L * (o.breit || 0.42);
      const len = L * (0.45 + T.rnd() * 0.9), a = (T.rnd() - 0.5) * (o.facher || 0.3), ww = w * (0.6 + T.rnd() * 0.7);
      const tx = x + Math.cos(a) * len, ty = y + Math.sin(a) * len, nx = -Math.sin(a) * ww / 2, ny = Math.cos(a) * ww / 2;
      const cb = (T.rnd() - 0.5) * (o.krumm != null ? o.krumm : 0.14) * len;
      const mx = (x + tx) / 2 - Math.sin(a) * cb, my = (y + ty) / 2 + Math.cos(a) * cb;
      const ax = x + nx, ay = y + ny;
      d += "M" + folge([ax, ay], dez) + "q" + folge([mx + nx * 0.45 - ax, my + ny * 0.45 - ay, tx - ax, ty - ay], dez) +
        "q" + folge([mx - nx * 0.45 - tx, my - ny * 0.45 - ty, x - nx - tx, y - ny - ty], dez) + "z";
    }
    const id = T.id("fs" + key + f);
    T.def(`<path id="${id}" d="${d}"/>`);
    sh.push(id);
  }
  const mk = (ton, farbe, ops) => ops.map((op, s) => sh.map((sid, f) => {
    const id = T.id("fm" + key + ton + s + f);
    T.def(`<marker id="${id}" orient="auto" overflow="visible"><use href="#${sid}" fill="${farbe}" fill-opacity="${op}"/></marker>`);
    return id;
  }));
  return { d: o.dunkel ? mk("d", o.dunkel, o.od || [0.12, 0.2, 0.28]) : null, m: o.mittel ? mk("m", o.mittel, o.om || [0.12, 0.2, 0.28]) : null,
    h: o.hell ? mk("h", o.hell, o.oh || [0.08, 0.18, 0.3]) : null, L };
}
/* Büschel-Pfade ausgeben: liste = [[markerId, x, y, ux, uy], …] → ein Pfad je Marker (m … l …) */
function bueschelPfade(liste) {
  const by = {};
  for (const e of liste) (by[e[0]] = by[e[0]] || []).push(e);
  return Object.keys(by).map((m) => {
    const L = by[m].sort((p, q) => (Math.round(p[2]) - Math.round(q[2])) || (p[1] - q[1]));
    let d = "", px = 0, py = 0;
    for (const [, x, y, u, v] of L) {
      const X = +zahl(x, 1), Y = +zahl(y, 1), U = +zahl(u, 1), V = +zahl(v, 1);
      if (!U && !V) continue;
      d += (d ? "m" + folge([X - px, Y - py], 1) : "M" + folge([X, Y], 1)) + "l" + folge([U, V], 1);
      px = X + U; py = Y + V;
    }
    return d ? `<path d="${d}" fill="none" style="marker:url(#${m})"/>` : "";
  }).join("");
}
/* weiche Form (Licht-/Schattenfläche, Okklusion) */
const weichform = (T, pts, farbe, op, b) => mal(T, b, form(T, pts, farbe, ` opacity="${op}"`));
/* Fläche füllen. o = { n (Büschelpaare je Ton), flow(x,y) Grad, licht(x,y) 0…1, st (Abstand der 2 Büschel, cm), streu (Grad),
   wo(x,y), hell (Anteil heller Büschel, Standard 1 = gleich viele) } */
function fell(T, pts, satz, o) {
  if (!T.fein || !o.n || !satz) return "";
  const [x0, y0, x1, y1] = T.box(pts), liste = [];
  const st = o.st || satz.L * 0.6, nh = Math.round(o.n * (o.hell != null ? o.hell : 1)), nm = Math.round(o.n * (o.mittel != null ? o.mittel : 0.5));
  for (const [ton, n] of [["d", o.n], ["m", nm], ["h", nh]]) {
    const ids = satz[ton]; if (!ids) continue;
    let g = 0, v = 0;
    while (g < n && v < n * 30) {
      v++;
      const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
      if (!T.inPoly(x, y, pts) || (o.wo && !o.wo(x, y))) continue;
      const li = o.licht ? klemm(o.licht(x, y)) : 0.5;
      const s = stufe(ton === "h" ? li : ton === "m" ? 0.5 : 1 - li * 0.6, T.rnd(), ids.length, ton === "m" ? 1 : 0.5);
      const a = (o.flow(x, y) + (T.rnd() - 0.5) * (o.streu != null ? o.streu : 14)) * Math.PI / 180, l = st * (0.7 + T.rnd() * 0.6);
      liste.push([ids[s][Math.floor(T.rnd() * ids[s].length)], x, y, Math.cos(a) * l, Math.sin(a) * l]);
      g++;
    }
  }
  return bueschelPfade(liste);
}
/* Fellsaum: Büschel entlang der Kontur als Polylinie (je Büschel ≈ 6 Bytes). Der Marker zeigt schräg nach außen –
   „mit“ (Haar läuft in Pfadrichtung) oder „gegen“ (Haar läuft gegen die Pfadrichtung); gewählt nach dem Flussfeld.
   randSatz(T, key, o): o = { L, w, k, winkel (Grad nach außen), tief (Wurzel innen × L), dunkel, hell, od, oh } */
function randSatz(T, key, o) {
  if (!T.fein) return null;
  const L = o.L, w = o.w || L * 0.08, k = o.k || 5, al = (o.winkel || 28) * Math.PI / 180, tief = (o.tief != null ? o.tief : 0.3) * L;
  const ids = {};
  for (const [r, sg] of [["m", 1], ["g", -1]]) {
    const sh = [];
    for (let f = 0; f < (o.formen || 1); f++) {
      let d = "";
      for (let i = 0; i < k; i++) {
        const a = sg > 0 ? -al * (0.5 + T.rnd()) : Math.PI + al * (0.5 + T.rnd());
        const x = (T.rnd() - 0.5) * L * 0.5, y = tief * (0.5 + T.rnd() * 0.8), len = L * (0.55 + T.rnd() * 0.75), ww = w * (0.6 + T.rnd() * 0.7);
        const tx = x + Math.cos(a) * len, ty = y + Math.sin(a) * len, nx = -Math.sin(a) * ww / 2, ny = Math.cos(a) * ww / 2;
        const cb = (T.rnd() - 0.5) * 0.15 * len, mx = (x + tx) / 2 - Math.sin(a) * cb, my = (y + ty) / 2 + Math.cos(a) * cb, ax = x + nx, ay = y + ny;
        d += "M" + folge([ax, ay]) + "q" + folge([mx + nx * 0.45 - ax, my + ny * 0.45 - ay, tx - ax, ty - ay]) + "q" + folge([mx - nx * 0.45 - tx, my - ny * 0.45 - ty, x - nx - tx, y - ny - ty]) + "z";
      }
      const id = T.id("rs" + key + r + f);
      T.def(`<path id="${id}" d="${d}"/>`);
      sh.push(id);
    }
    for (const [ton, farbe, ops] of [["d", o.dunkel, o.od || [0.8, 1]], ["h", o.hell, o.oh || [0.8, 1]]]) {
      if (!farbe) continue;
      ids[r + ton] = ops.map((op, lv) => sh.map((sid, f) => {
        const id = T.id("rm" + key + r + ton + lv + f);
        T.def(`<marker id="${id}" orient="auto" overflow="visible"><use href="#${sid}" fill="${farbe}" fill-opacity="${op}"/></marker>`);
        return id;
      }));
    }
  }
  return { L, ids };
}
/* o = { abstand, flow(x,y) Grad, licht(x,y) 0…1, wo(x,y), lauf (Büschel je Lauf, Standard 7) } */
function saum(T, pts, satz, o) {
  if (!T.fein || !satz) return "";
  const k = kurve(pts, 12), m = k.length;
  /* Umlaufsinn: „links der Laufrichtung“ muss außen sein (Bildschirm: im Uhrzeigersinn) */
  let fl = 0;
  for (let i = 0; i < m; i++) { const a = k[i], b = k[(i + 1) % m]; fl += a[0] * b[1] - b[0] * a[1]; }
  const P = fl > 0 ? k : k.slice().reverse();
  /* gleichmäßig abtasten */
  const pkt = [];
  let acc = 0, ziel = o.abstand * (0.7 + T.rnd() * 0.6);
  for (let i = 0; i < m; i++) {
    const p = P[i], q = P[(i + 1) % m], l = Math.hypot(q[0] - p[0], q[1] - p[1]);
    acc += l;
    if (acc >= ziel) { acc = 0; ziel = o.abstand * (0.7 + T.rnd() * 0.6); const tx = (q[0] - p[0]) / (l || 1), ty = (q[1] - p[1]) / (l || 1); pkt.push([p[0], p[1], tx, ty]); }
  }
  const lauf = o.lauf || 7, wahl = [];
  let cur = null;
  for (const [x, y, tx, ty] of pkt) {
    if (o.wo && !o.wo(x, y)) { cur = null; continue; }
    const fa = o.flow(x, y) * Math.PI / 180, r = Math.cos(fa) * tx + Math.sin(fa) * ty >= 0 ? "m" : "g";
    const li = o.licht ? klemm(o.licht(x, y)) : 0.5, ton = li > 0.5 && satz.ids[r + "h"] ? "h" : "d";
    const key = r + ton;
    if (!cur || cur.key !== key || cur.p.length >= lauf) {
      const ids = satz.ids[key], lv = stufe(ton === "h" ? (li - 0.5) * 2 : 1 - li * 2, T.rnd(), ids.length, 0.4);
      cur = { key, id: ids[lv][Math.floor(T.rnd() * ids[lv].length)], p: [] };
      wahl.push(cur);
    }
    cur.p.push([x, y]);
  }
  const by = {};
  for (const c of wahl) if (c.p.length > 1) (by[c.id] = by[c.id] || []).push(c.p);
  return Object.keys(by).map((id) => {
    let d = "", px = 0, py = 0;
    for (const lst of by[id]) {
      const X = +zahl(lst[0][0], 1), Y = +zahl(lst[0][1], 1);
      d += (d ? "m" + folge([X - px, Y - py], 1) : "M" + folge([X, Y], 1)) + "l";
      px = X; py = Y;
      const z = [];
      for (const [x, y] of lst.slice(1)) { const U = +zahl(x - px, 1), W = +zahl(y - py, 1); z.push(U, W); px += U; py += W; }
      d += folge(z, 1);
    }
    return `<path d="${d}" fill="none" style="marker:url(#${id})"/>`;
  }).join("");
}
/* ---------- Volumen je Körperteil (wie T.volumen in kern.js, ANLEITUNG Punkt 13) ----------
   Gleiche Technik (Innen-Schatten unten rechts, Innen-Glanz oben links aus der weich verschobenen eigenen Silhouette),
   aber mit größerem Filterbereich: bei T.volumen (Bereich −5 %…110 %) wird die geblurrte Silhouette am Bereichsrand
   abgeschnitten; um den Versatz (0,9 × weich) verschoben, ergibt das bei flachen Teilen (Rumpf eines Meerschweinchens,
   Kopf, Fuß) eine harte senkrechte bzw. waagerechte Schattenkante 0,9 × weich vor dem rechten/unteren Rand. */
function vol(T, n, o = {}) {
  if (!T.fein) return "none";
  const w = o.weich || 6, st = Math.min(1, 0.09 * (o.tiefe || 5)), amb = o.umgebung != null ? o.umgebung : 0.3;
  const d = w * 0.9, sch = zahl(st * (1 - amb) * 0.95, 3), gl = zahl(st * (1 - amb) * 0.38, 3);
  const id = T.id("vo" + n + "_" + String(w).replace(".", "_"));
  T._f = T._f || {};
  if (!T._f[id]) {
    T._f[id] = 1;
    T.def(`<filter id="${id}" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">` +
      `<feGaussianBlur in="SourceAlpha" stdDeviation="${w}" result="b"/>` +
      `<feOffset in="b" dx="${zahl(-d, 3)}" dy="${zahl(-d, 3)}" result="bu"/><feOffset in="b" dx="${zahl(d * 0.8, 3)}" dy="${zahl(d * 0.8, 3)}" result="bo"/>` +
      `<feComposite in="SourceAlpha" in2="bu" operator="out" result="ms"/><feComposite in="SourceAlpha" in2="bo" operator="out" result="mg"/>` +
      `<feFlood flood-color="#1a1008" flood-opacity="${sch}"/><feComposite in2="ms" operator="in" result="s"/>` +
      `<feFlood flood-color="#fff6e6" flood-opacity="${gl}"/><feComposite in2="mg" operator="in" result="g"/>` +
      `<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="s"/><feMergeNode in="g"/></feMerge><feComposite in2="SourceGraphic" operator="in"/></filter>`);
  }
  return `url(#${id})`;
}

module.exports = [
  /* =================================================================
     HUND — Labrador Retriever, gelb
     RECHERCHE: FCI-Standard Nr. 122 / KC / CKC: Widerrist Rüden 56–57 cm; Rumpf (Bug bis Sitzbein) gleich oder
     wenig länger als die Widerristhöhe; Ellbogen bis Boden ≈ ½ Widerristhöhe; Brust tief bis zum Ellbogen, Vorbrust
     vor den Vorderläufen; Rücken waagerecht, Kruppe leicht abfallend, kaum aufgezogen; Schulter ≈ 45° zurückgelegt;
     Vorderläufe gerade, Vordermittelfuß ≈ 12° schräg, Afterkralle innen; Hinterhand gut gewinkelt (Knie ≈ 115°),
     Sprunggelenk tief (≈ 28 % der Höhe), Hintermittelfuß senkrecht, Sitzbeinhöcker als Ecke hinten; Pfoten rund und
     kompakt („Katzenpfote“), Zehen gewölbt (3 Knöchelbögen im Profil), Krallen dunkel; Kopf ≈ 42 % der Widerrist-
     höhe, Schädel breit und etwas gewölbt, mäßiger Stopp mit Brauenwulst, Fang kräftig und kastenförmig (vorn fast
     so tief wie am Stopp), Lefzen hängen leicht über (schwarzer Lefzenrand), Mundwinkel unter dem vorderen Augen-
     winkel; Ohren weit hinten angesetzt, hängend, dreieckig, an der Basis gefaltet, Spitze etwa auf Höhe des Mund-
     winkels; Augen mittelgroß, braun; Nase schwarz, breit, kaum überstehend; Otterrute: an der Wurzel sehr dick
     (≈ 6,5 cm), gleichmäßig verjüngt (≈ 2,3 cm), stumpf, aus der Kruppe abfallend, unten etwas büschelig;
     kurzes, dichtes Stockhaar, Wuchs von der Nase über Schädel und Rücken zur Rute, am Hals abwärts, an den Läufen
     nach unten, Wirbel an der Vorbrust.
     Runde 3: Volumen je Körperteil (T.volumen), Fell als Büschel-Instanzen (5–8-fach dichter), Fellsaum alle
     ≈ 0,25 cm, Muskel-Wülste ersetzt durch Lichtflächen (Schulterblatt, Keule als Kugel, Ellbogen).
     ================================================================= */
  { id: "hund", de: "der Hund", syl: "HUND", it: "il cane", itSyl: "CA-ne", en: "dog",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.903, hoehe: 0.706,
    zeichne(T) {
      T.dez = 1;
      const SCH = "#8a5a28", TIEF = "#5e3812", HELL = "#fff4da";
      const EIMER = [["#93612c", 0, 0.42, 0, "s"], ["#b5843f", 0, 0.36, 0, "s"], ["#d2a462", 0, 0.3, 0, "s"], ["#e6c58a", 0, 0.3, 0, "s"], ["#f4dfb4", 0, 0.32, 0, "s"]];
      /* Fell-Sätze: Körper (lang), Kopf (kurz); Saum deckend in Körperfarbe */
      const FK = fellSatz(T, "k", { L: 1.05, k: 8, w: 0.075, dunkel: "#6a3c10", od: [0.07, 0.14], mittel: "#b67a30", om: [0.07, 0.12], hell: "#fff3d2", oh: [0.06, 0.2] });
      const FKo = fellSatz(T, "o", { L: 0.55, k: 7, w: 0.05, dunkel: "#6a3c10", od: [0.07, 0.14], mittel: "#b67a30", om: [0.07, 0.12], hell: "#fff3d2", oh: [0.06, 0.2] });
      const FS = randSatz(T, "s", { L: 0.62, k: 5, w: 0.06, winkel: 16, dunkel: "#b8884a", od: [0.75, 0.95], hell: "#e4c48c", oh: [0.8, 1] });
      const FSo = randSatz(T, "so", { L: 0.4, k: 4, w: 0.045, winkel: 22, dunkel: "#bf904f", od: [0.75, 0.95], hell: "#e6c890", oh: [0.8, 1] });
      const FSb = randSatz(T, "sb", { L: 0.95, k: 5, w: 0.06, winkel: 40, dunkel: "#b8884a", od: [0.75, 0.95] });
      /* Silhouette: Rumpf, Hals und die nahen Beine als EIN Umriss.
         Vorderlauf: Ellbogen als Rundung hinten, Unterarm verjüngt, Handwurzel verdickt, Mittelfuß 12°, Pfote mit 3 Knöchelbögen */
      const vorne = [[17.2, -29.4], [16.9, -24], [16.55, -17], [16.3, -12.8], [16.75, -11.2], [16.85, -9.6], [17.25, -7.6], [17.9, -6.15],
        [18.6, -5.6], [19.3, -5.4], [19.8, -4.7], [20.45, -4.4], [20.8, -3.55], [21.35, -2.9], [21.6, -1.6], [21.35, -0.6], [20.8, -0.08], [20.2, 0, 1],
        [14.2, 0, 1], [13.35, -0.25], [13.0, -0.9], [12.85, -2.6], [12.75, -4.8], [12.1, -7.2], [11.35, -9.2], [11.15, -10.6], [11.45, -12.2], [11.25, -15], [10.6, -21], [9.9, -25.2], [9.15, -27.8], [9.4, -29.6]];
      /* Hinterlauf: Knie als Spitze vorn, Unterschenkel schräg nach hinten, Sprunggelenk tief, Mittelfuß senkrecht */
      const hinten = [[-13.8, -33.2], [-13.3, -30.2], [-13.7, -27.6], [-15.6, -25], [-18.8, -21.6], [-22.2, -18.4], [-24.4, -15.6], [-25.3, -13.2], [-25.3, -9], [-25.05, -6.3],
        [-24.4, -5.65], [-23.7, -5.4], [-23.2, -4.7], [-22.55, -4.4], [-22.2, -3.55], [-21.65, -2.9], [-21.4, -1.6], [-21.65, -0.6], [-22.2, -0.08], [-22.8, 0, 1],
        [-28.9, 0, 1], [-29.75, -0.3], [-30.05, -1.1], [-30.1, -3], [-30.2, -6], [-30.3, -10], [-30.6, -13.4], [-31.7, -15.9], [-30.9, -18], [-30.3, -21.5], [-30.7, -26.5], [-31.6, -31.5], [-32.6, -36.5]];
      const leib = [[-31.4, -53.4], [-25, -55.6], [-19.5, -56.2], [-12, -55.6], [-4, -55.4], [5, -55.8], [11, -56.8], [14.5, -57.6], [17.5, -60.4], [20.2, -64.4], [22.6, -67.4], [25.6, -69.2], [28.6, -68.6], [29.9, -65.2],
        [29.8, -58], [29.2, -55.6], [28.2, -52.2], [26.6, -46.8], [24.4, -41.6], [22.8, -38.2], [20.9, -35], [18.7, -32.2]].concat(vorne,
        [[5, -28.6], [-1, -29.4], [-6, -31.2], [-10, -33.4], [-12.6, -34.6]], hinten, [[-33.7, -41.2], [-34.7, -45.4], [-34.3, -49.2], [-33.2, -51.8]]);
      const leibId = pfad(T, leib);
      /* Kopf: Schädel höher und gewölbt, Stopp mit Stufe, Fang kastenförmig (vorn ≥ 90 % so tief wie am Stopp),
         Unterkiefer tiefer, Nase bündig mit dem Nasenrücken (Überstand ≈ 0,4 cm) */
      const kopf = [[24.2, -69.4], [25.4, -72.4], [28, -74], [31.6, -74.4], [34.5, -73.6], [36.3, -72.3], [37.1, -70.6], [38.3, -69.2], [41.5, -68.75], [44.6, -68.45], [46.6, -68.25],
        [48.4, -68.05], [49.25, -67.3], [49.45, -65.9], [49.25, -64.8], [48.85, -64.35], [48.95, -63], [48.95, -61.2], [48.75, -59.9], [47.7, -59.25], [45.4, -58.95], [42.6, -58.55], [39, -58], [35, -57.4],
        [31.6, -57.8], [28.9, -59.8], [26.6, -63.2]];
      const kopfId = pfad(T, kopf);
      /* Ohr: Dreieck (Breite oben 100 %, Mitte 80 %, unten 45 %), Basis angehoben und gefaltet, Spitze gerundet */
      const ohr = [[26, -71.2], [28.4, -72.6], [31.6, -72.7], [33.3, -71.7, 1], [33.25, -69.4], [32.9, -66.6], [32.2, -64], [31.4, -62.1], [30.6, -61.1], [29.8, -61.2], [29.1, -62.4], [28.1, -64.6], [26.9, -67.6], [26.2, -69.8]];
      const ohrId = pfad(T, ohr);
      /* Licht-Feld und Wuchsrichtung */
      const lf = feld(leib, 8, (x, y) => (y < -50 ? 0.08 : 0) - (y > -42 && y < -28 && x > -14 && x < 10 ? 0.2 : 0));
      const lic = (x, y) => (lf(x, y) + 0.35) / 1.1;
      const flow = (x, y) => {
        if (x > 9 && x < 23 && y > -30) return 92;                                            // Vorderlauf
        if (x < -12 && y > -32) return x < -28 ? 92 : 104 + (y < -18 ? 12 : 0);               // Hinterlauf
        if (x > 19 && y > -50 && y < -31) return 90 + Math.atan2(y + 41, x - 21) * 57;         // Wirbel Vorbrust
        if (x > 15 && y < -45) return 128;                                                     // Hals abwärts
        if (x < -24) return x < -31 ? 100 : 122;                                               // Keule, „Hose“
        return 180 - 38 * klemm((y + 54) / 24);                                                 // Rumpf: nach hinten, unten schräg
      };
      const wahl = (x, y, z) => stufe(lic(x, y), z, 5);
      const V = (n, w, t, u) => vol(T, n, { weich: w, tiefe: t, umgebung: u });
      let s = "";
      /* Pfote: 3 Knöchelbögen mit Furchen, Knöchellicht, Haarbüschel zwischen den Zehen, Krallen 100/85/60 %, Sohlenlinie */
      const pfote = (x, w, fern) => {
        if (!T.fein) return "";
        let t = "";
        const kn = [[x + w * 0.75, -5.1], [x + w * 0.9, -4.1], [x + w * 1.02, -2.6]];
        kn.forEach(([zx, y], i) => {
          t += weichform(T, [[zx - 0.5, y + 0.1], [zx - 0.05, y - 0.3], [zx + 0.4, y + 0.2], [zx, y + 0.7]], HELL, 0.32, 0.15);
          if (i < 2) t += falte(T, [[zx + 0.45, y + 0.35], [zx + 0.6, y + 1.2], [zx + 0.55, y + 1.9]], TIEF, 0.14, 0.4);
        });
        t += `<path d="M${zahl(x + w * 0.05)} -.1H${zahl(x + w * 0.96)}" stroke="#2a1d14" stroke-width=".16" stroke-opacity=".75"/>`;
        return t;
      };
      const krallen = (x, w, fern) => T.fein ? [2, 1, 0].map((i) => kralle(T, x + w * [1.0, 0.88, 0.76][i], -1.45 + i * 0.2, 1.15 * [1, 0.85, 0.6][i], 62 - i * 6, fern ? "#3a322c" : "#2a2622", 0.36)).join("") : "";
      /* --- ferne Beine: gleiche Winkel, Körperton 15 % dunkler, Form und Fell --- */
      const fernV = schieb([[9, -36], [16, -36]].concat(vorne.slice(0, -1)), -4.4);
      const fernH = schieb([[-5, -38], [-12.6, -34.6]].concat(hinten, [[-31.6, -33], [-24, -40]]), 5.6);
      const fernF = T.lg("hfern", [[0, "#a0703a"], [0.4, "#bf9256"], [1, "#cba270"]]);
      for (const [P, x, w] of [[fernH, -29.5 + 5.6, 7.3], [fernV, 13.5 - 4.4, 7.7]]) {
        const fl = feld(P, 3);
        s += `<g filter="${V("bein", 1.4, 5, 0.3)}">` + teil(T, P, fernF, {
          innen: weichform(T, schieb(P, 0.9, 0.4), TIEF, 0.22, 0.9) + fell(T, P, FK, { n: 34, flow: () => 94, licht: (xx, yy) => (fl(xx, yy) + 0.2) / 1.4 - 0.2, hell: 0.6 }),
          ueber: saum(T, P, FSo, { abstand: 0.3, flow: () => 94, wo: (xx, yy) => yy < -1.2, licht: () => 0.2 }),
        }) + krallen(x, w, 1) + "</g>";
      }
      /* --- Otterrute: fällt aus der Kruppe ab, 6,5 → 2,3 cm, stumpf, unten büschelig --- */
      const rc = [[-29.6, -50.6], [-33.6, -48.6], [-36.6, -45], [-38.6, -40], [-39.7, -34], [-40, -28], [-39.7, -23.2]];
      const rute = schlauch(rc, [6.5, 6.1, 5.4, 4.6, 3.8, 3, 2.3], true);
      const rflow = (x, y) => (y < -46 ? 150 : y < -40 ? 118 : 96);
      const rl = feld(rute, 2.4);
      s += `<g filter="${V("bein", 1.4, 5, 0.3)}">` + teil(T, rute, T.lg("rute", [[0, "#dcb072"], [0.6, "#d4a564"], [1, "#b8884a"]], 0, 0, 1, 0), {
        innen: fell(T, rute, FK, { n: 60, flow: rflow, licht: (x, y) => (rl(x, y) + 0.3) / 1.1 }),
        ueber: saum(T, rute, FS, { abstand: 0.26, flow: rflow, licht: (x, y) => (rl(x, y) + 0.3) / 1.1, wo: (x, y) => !(x > -39.5 && y > -45) }) +
          saum(T, rute, FSb, { abstand: 0.2, flow: rflow, licht: () => 0.3, wo: (x, y) => x > -39.5 && y > -45 }),
      }) + "</g>";
      /* --- Leib --- */
      const kopfVers = (pts) => schieb(pts, -1.5, 3.8);
      s += `<g filter="${V("leib", 2.6, 5, 0.32)}">` + teil(T, "#" + leibId, T.lg("hfell", [[0, "#e0b979"], [0.17, "#ecd09c"], [0.3, "#e6c58a"], [0.43, "#c99a5a"], [0.5, "#c4945a"], [0.555, "#d3a96c"], [0.62, "#dcb57a"], [1, "#e4c28c"]]), {
        innen:
          /* Schulterblatt als eigene Lichtfläche (45°), Schattenkante hinten; Keule als Kugel (Glanz oben vorn, Sichel hinten unten);
             Ellbogen als Volumen; Kernschatten-Band bei 65 % Rumpftiefe kommt aus dem Verlauf */
          weichform(T, [[12.4, -56.4], [16.4, -57.2], [21.2, -51], [24.4, -44.4], [22.6, -42.4], [18.6, -46], [13.8, -51.6]], HELL, 0.16, 1.8) +
          weichform(T, [[11.4, -55.6], [12.6, -55.8], [16.4, -49.6], [15.6, -47.6]], SCH, 0.18, 0.7) +
          weichform(T, [[-29.6, -50.4], [-22.4, -52.6], [-17.4, -48.6], [-19.6, -43], [-25.6, -42.6], [-29.4, -45.6]], HELL, 0.38, 1.6) +
          weichform(T, [[-33.6, -42.4], [-27.6, -35.6], [-19.4, -32.8], [-15.6, -34.6], [-18.6, -30.4], [-27.4, -30.2], [-32.8, -35.6]], SCH, 0.42, 1.2) +
          weichform(T, [[8.6, -30.6], [11.6, -31.4], [12.6, -28.6], [10.6, -26.4], [9.2, -27.4]], HELL, 0.3, 0.5) +
          weichform(T, [[9.4, -27], [12.2, -27.6], [12.4, -25.6], [10.2, -24.8]], SCH, 0.3, 0.45) +
          /* Okklusion: unter Kopf und Kinn (Schlagschatten), zwischen Vorderlauf und Brust, Kniefalte, Leiste */
          schlag(T, kopfId, 0.7 - 1.5, 1.4 + 3.8, 1.1, TIEF, 0.45) +
          weichform(T, [[17.6, -33], [20.6, -34.6], [19.4, -30.6], [17.4, -28.6]], TIEF, 0.35, 0.7) +
          weichform(T, [[-12.4, -36], [-10.6, -33.6], [-13.2, -30.6], [-14.4, -33.4]], TIEF, 0.3, 0.6) +
          /* Fell */
          fell(T, leib, FK, { n: 280, hell: 0.75, mittel: 0.35, flow, licht: lic, wo: (x, y) => y < -6 }) +
          fell(T, leib, FKo, { n: 70, hell: 0.7, flow, licht: lic, wo: (x, y) => y > -14 && y < -2 }) +
          pfote(-29.5, 7.3) + pfote(13.5, 7.7),
        ueber: saum(T, leib, FS, { abstand: 0.3, flow, licht: lic, wo: (x, y) => y < -6.5 && !(x > 24 && y < -57) && !(y > -35 && y < -27.5 && x > -12.5 && x < 9) }) +
          /* Pfoten fein, Büschel zwischen den Zehen; Bauch etwas länger und hängend */
          saum(T, leib, FSo, { abstand: 0.22, flow: () => 98, licht: lic, wo: (x, y) => y < -0.6 && y > -6.5 }) +
          saum(T, leib, FSb, { abstand: 0.2, flow: () => 175, licht: () => 0.3, wo: (x, y) => y > -35 && y < -27.5 && x > -12.5 && x < 9 }),
      }) + krallen(-29.5, 7.3) + krallen(13.5, 7.7) +
        /* Afterkralle: innen am Vordermittelfuß, halb im Fell */
        (T.fein ? kralle(T, 12.95, -6.9, 0.5, 118, "#3a2e26", 0.45) + `<path d="M12.6 -7.7q.5 .4 .45 1.1" fill="none" stroke="#c99a5a" stroke-width=".22" stroke-linecap="round"/>` : "") + "</g>";
      /* --- Kopf (Gruppe: etwas tiefer und zurück getragen) --- */
      s += `<g transform="translate(-1.5 3.8)">`;
      const kl = feld(kopf, 3.4, (x, y) => (x > 39 && y > -62 ? 0.1 : 0));
      const klic = (x, y) => (kl(x, y) + 0.35) / 1.1;
      const kflow = (x, y) => (y > -61 ? 168 : x > 38 ? 184 : x < 31 && y > -66 ? 140 : 182);
      s += `<g filter="${V("kopf", 1.5, 5, 0.32)}">` + teil(T, "#" + kopfId, T.lg("hkopf", [[0, "#e0b778"], [0.35, "#e6c48c"], [0.7, "#ddb87e"], [1, "#d2a96c"]]), {
        innen:
          /* Brauenwulst (Licht oben, Schatten in der Stopp-Stufe), höherer Schädel, Wange, Fang-Kiste mit Lichtfläche oben */
          weichform(T, [[31.4, -73.6], [35.2, -73.2], [36.8, -71.4], [35.2, -70.8], [32.4, -71.6]], HELL, 0.45, 0.4) +
          weichform(T, [[36.6, -70.6], [38.2, -69.6], [38.4, -68.6], [37.2, -68.4]], TIEF, 0.35, 0.35) +
          weichform(T, [[38.8, -68.5], [46.6, -68.1], [46.6, -66.9], [39.2, -67.3]], HELL, 0.35, 0.5) +
          weichform(T, [[30.6, -66.4], [35.4, -66.6], [37.6, -63.6], [35.4, -60.6], [31.6, -61.4]], HELL, 0.16, 1) +
          weichform(T, [[29.6, -61.4], [36.6, -60], [38.6, -58.2], [31.6, -58]], TIEF, 0.3, 0.8) +
          /* Lefze: hängt 0,6 cm über, Schatten darunter, schwarzer Lefzenrand, Mundwinkel-Falte unter dem vorderen Augenwinkel */
          /* Unterkiefer unter der Lefze im Schatten; Lefzenrand fast gerade nach hinten ansteigend (kastenförmiger Fang) */
          mal(T, 0.3, `<path d="M48.5 -60.1Q45 -59.9 41.5 -60.4Q39.2 -60.8 37.7 -61.5Q38.6 -59.3 41 -58.6Q44.6 -58.6 47.8 -59.4Z" fill="${TIEF}" opacity=".5"/>`) +
          `<path d="M48.75 -60.3Q47.9 -60.05 46.2 -60.05Q43.4 -60.1 41.2 -60.5Q39.2 -60.9 37.8 -61.55" fill="none" stroke="#1c120a" stroke-width=".24" stroke-linecap="round"/>` +
          `<path d="M48.4 -60.7Q45.5 -60.6 42.6 -60.9Q40.2 -61.2 38.4 -61.9" fill="none" stroke="${HELL}" stroke-width=".4" stroke-opacity=".1"/>` +
          `<path d="M37.9 -61.5q-.45 -.35 -.55 -1.15" fill="none" stroke="#5a3818" stroke-width=".14" stroke-opacity=".45" stroke-linecap="round"/>` +
          schlag(T, ohrId, 0.6, 0.9, 0.45, TIEF, 0.5) +
          fell(T, kopf, FKo, { n: 150, hell: 0.75, flow: kflow, licht: klic, wo: (x, y) => !(x > 48 && y < -63.5) }),
        blende: [0, 0.5, 0.24, 0.5, 0.12, 1],
        ueber: saum(T, kopf, FSo, { abstand: 0.2, flow: kflow, licht: klic, wo: (x, y) => (x < 46.5 && y < -61.5) || (y > -59.5 && x < 46) }),
      });
      /* Auge: 1,3 : 1, Oberlid deckt 15 % der Iris, Schatten im oberen Drittel, Unterlidlinie, kleine Nickhaut-Sichel */
      s += auge(T, 35.3, -69.2, 0.78, { ratio: 1.3, spitz: 0.35, winkel: 6, iris: "#8a541e", iris2: "#3a1d08", mitte: "#b47a34", pr: 0.4, ir: 0.92, lid: "#1a0f08", lidw: 0.16, wimpern: [9, 0.5, "#4a3018"], nick: "#6a5048" });
      s += `<path d="M34.4 -68.3q1 .45 1.9 .1" fill="none" stroke="#7a5228" stroke-width=".1" stroke-opacity=".35"/>`;
      s += tasthaar(T, [36.2, -71.4, 0.6, 0.2, 1, 4], -112, -80, 2.6, ["#3a2814", "#c9a874"], 0.05, 0.7);
      /* Nase: oben bündig, vorn fast senkrecht, Philtrum als Kerbe in der Nase, Komma-Nasenloch mit hellem Flügelrand,
         kleiner scharfer Glanz + Mikroglanz auf dem Pflaster */
      const nase = [[46.3, -68.3], [48.4, -68.12], [49.2, -67.45], [49.42, -66.1], [49.3, -64.95], [48.95, -64.45], [48.65, -64.75], [48.3, -64.45], [47.5, -64.55], [47, -65.3], [46.5, -66.6]];
      s += teil(T, nase, T.lg("nase", [[0, "#4a3e38"], [0.4, "#221a16"], [1, "#0c0908"]]), {
        innen: (T.fein ? `<rect x="46" y="-68.4" width="3.6" height="4.2" fill="#2e2622" filter="${T.relief("nase", { f: 3.4, tiefe: 0.4, okt: 2 })}" opacity=".45"/>` : "") +
          `<path d="M49.45 -66.15C48.85 -66.3 48.35 -66 48.2 -65.55C48.05 -65.15 47.85 -64.95 47.5 -64.95C47.9 -64.75 48.4 -64.9 48.65 -65.25C48.85 -65.55 49.1 -65.7 49.45 -65.7Z" fill="#000"/>` +
          `<path d="M47.75 -65.1Q48 -66.5 49.4 -66.55" fill="none" stroke="#6a5a52" stroke-width=".09" opacity=".6"/>` +
          `<path d="M48.62 -64.75v-.5" stroke="#000" stroke-width=".14" opacity=".8"/>` +
          `<path d="M47.6 -67.75q.5 -.12 .9 -.05" stroke="#fff" stroke-width=".16" stroke-linecap="round" opacity=".75" fill="none"/>` +
          (T.fein ? `<path d="M46.8 -67.3h.01M47.3 -67.05h.01M46.9 -66.55h.01M47.75 -66.85h.01M48.6 -67.5h.01M48.9 -67.1h.01" stroke="#fff" stroke-width=".08" stroke-linecap="round" opacity=".5"/>` : ""),
      }) + "</g>";
      /* Schnurrhaare: aus 4 versetzten Follikelreihen auf dem Lefzenpolster, nach vorn-außen und leicht abwärts */
      s += tasthaar(T, [47.6, -63.6, 2.8, 1.8, 4, 5], -14, 26, 6, ["#3a2814", "#5a4026", "#e6cfa0"], 0.075, 0.8, "#7a5530");
      /* --- Ohr: gleichmäßig 8 % dunkler, Faltung an der Basis, Fell, Schlagschatten (oben im Kopf) --- */
      const ol = feld(ohr, 1.6);
      s += `<g filter="${V("ohr", 0.8, 5, 0.32)}">` + teil(T, "#" + ohrId, T.lg("hohr", [[0, "#d2a462"], [0.5, "#c99a58"], [1, "#c29152"]]), {
        innen: weichform(T, [[26.6, -71.4], [29, -72.4], [32.6, -71.4], [33, -70.2], [29.6, -70.6], [27, -70]], TIEF, 0.3, 0.3) +
          fell(T, ohr, FKo, { n: 70, flow: () => 98, licht: (x, y) => (ol(x, y) + 0.2) / 1.2 - 0.1 }),
        ueber: saum(T, ohr, FSo, { abstand: 0.2, flow: () => 98, licht: () => 0.35, wo: (x, y) => y > -70.5 }),
      }) + "</g>";
      s += "</g>";
      return { svg: s, box: [-42.4, -70.6, 47.9, 0], fuesse: [-25.6, -19.9, 13.6, 17.2], kopf: [22.5, -71, 48.5, -53] };
    } },
  /* =================================================================
     KATZE — Hauskatze (Europäisch Kurzhaar), braun getigert (Mackerel Tabby)
     RECHERCHE: Kopf-Rumpf ≈ 46 cm, Schwanz ≈ 28 cm, Schulterhöhe 23–25 cm; Rumpflänge ≈ 1,5 × Widerristhöhe;
     Zehengänger; Hinterbeine länger (Kruppe 4–6 % höher als der Widerrist), Lendenbogen, Bauchlinie hinter dem
     Ellbogen am tiefsten, zur Kniefalte ansteigend; Hals 40–45° geneigt, Kinn etwa auf Widerristhöhe.
     Hinterbein als Z: großer Oberschenkel (≈ 45 % der Rumpftiefe), Knie vorn auf ≈ 45 % der Beinhöhe, Unterschenkel
     schräg nach hinten zum Fersenhöcker auf ≈ 30 % der Beinhöhe (spitze Ecke hinten), Mittelfuß fast senkrecht und
     30 % schmaler, Sitzbeinbogen hinten ausgebaucht. Vorderbein: Ellbogen als Spitze hinten an der Brust, Unterarm zur
     Handwurzel auf 80 % verjüngt, Karpalballen hinten auf ≈ 18 % der Beinhöhe, Mittelhand 10–15° nach vorn.
     Pfoten oval, 25–30 % breiter als das Handgelenk, 3–4 Zehenwölbungen, Krallen eingezogen, Sohlenkante schmal.
     Kopf rund, kurzer Fang, leichter Stopp, Schnurrhaarkissen als Wölbung, kleines rundes Kinn, Backenkrause; Ohren
     groß, Öffnung nach vorn, rosa nur tief in der Muschel, cremefarbene Ohrbüschel, Henry-Tasche hinten unten;
     Augen grün-gelb, Lidspalte im Profil ≈ 1,4 : 1, Hornhaut wölbt sich vor die Lidlinie, Spindelpupille;
     Nasenspiegel ziegelrosa (#c48478), bündig, Komma-Nasenloch; 10–12 weiße Schnurrhaare je Seite in 4 Reihen.
     Mackerel Tabby (CFA/WCF): „M“ auf der Stirn, Linien vom Augenwinkel über die Wange, helle Augenumrandung, Aalstrich
     auf der Wirbelsäule, 12–14 schmale Streifen rechtwinklig zum Rücken (Abstand und Breite unregelmäßig), über den
     Rippen gebogen, unten in Tupfen aufgelöst, zum Bauch blasser; Bögen entlang der Schulterblattkante und an der
     Keule; zwei „Halsketten“ quer über Kehle und Vorbrust; Beine je Bein geringelt (Ringe gebogen, zur Pfote enger);
     Schwanz geringelt, Ringe zur Spitze breiter und dunkler, Spitze dunkel; Agouti: dunkle Haarspitzen; Bauch,
     Brust, Kehle, Lippen und Kinn cremefarben.
     Runde 3: Beine neu (Z-Hinterbein mit Fersenhöcker, Ellbogen, Karpalballen, Zehenwölbungen), Volumen je Teil,
     Büschel-Fell und Fellsaum, Kopf ohne Skalierung neu gezeichnet.
     ================================================================= */
  { id: "katze", de: "die Katze", syl: "KAT-ze", it: "il gatto", itSyl: "GAT-to", en: "cat",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.712, hoehe: 0.362,
    zeichne(T) {
      T.dez = 1;
      const DK = "#2b2118", SCH = "#5e4426", TIEF = "#3a2a18", HELL = "#fff6e4";
      const V = (n, w, t, u) => vol(T, n, { weich: w, tiefe: t, umgebung: u });
      const FK = fellSatz(T, "k", { L: 0.6, k: 7, w: 0.045, dunkel: "#241a10", od: [0.1, 0.2], mittel: "#8a6a44", om: [0.08, 0.14], hell: "#fff4dc", oh: [0.06, 0.22] });
      const FKo = fellSatz(T, "o", { L: 0.36, k: 6, w: 0.03, dunkel: "#241a10", od: [0.07, 0.14], hell: "#fff4dc", oh: [0.05, 0.16] });
      const FS = randSatz(T, "s", { L: 0.42, k: 5, w: 0.035, winkel: 20, dunkel: "#8a7050", od: [0.75, 0.95], hell: "#c9b08a", oh: [0.8, 1] });
      const FSc = randSatz(T, "c", { L: 0.5, k: 5, w: 0.035, winkel: 35, dunkel: "#cbb894", od: [0.9], hell: "#ece0c6", oh: [0.95] });
      const FSk = randSatz(T, "kr", { L: 0.62, k: 5, w: 0.04, winkel: 30, dunkel: "#9a8060", od: [0.9], hell: "#c6ae86", oh: [0.95] });
      /* ---------- Silhouette mit nahen Beinen ---------- */
      const vorn = [[14.4, -11.5], [14.0, -8.5], [13.7, -5.6], [13.6, -4.0], [13.85, -3.1], [14.15, -2.3], [14.75, -1.95], [15.35, -1.95], [15.7, -1.6], [16.15, -1.6], [16.5, -1.25], [16.9, -1.05],
        [17.15, -0.55], [17.0, -0.12], [16.5, 0, 1], [12.0, 0, 1], [11.6, -0.3], [11.4, -0.95], [11.15, -1.75], [10.85, -2.5], [10.95, -3.2], [10.85, -4.6], [10.75, -7.5], [10.3, -10], [9.5, -11.9, 1], [8.6, -12]];
      const hinten = [[-6.4, -13.2], [-7.6, -12.6], [-8.5, -11.6, 1], [-10.2, -9.6], [-12.4, -7.6], [-13.7, -6.3], [-14.15, -5.1], [-14.25, -3.4], [-13.9, -2.3], [-13.3, -1.95], [-12.7, -1.95], [-12.35, -1.6], [-11.9, -1.6], [-11.55, -1.25], [-11.15, -1.05],
        [-10.9, -0.55], [-11.05, -0.12], [-11.5, 0, 1], [-15.8, 0, 1], [-16.25, -0.3], [-16.45, -1.0], [-16.55, -3], [-16.6, -5.4], [-17.9, -7.4, 1], [-17.25, -8.8], [-17.45, -10.2], [-18.7, -12.4], [-20.6, -14.8], [-21.6, -17.4], [-21.5, -19.6], [-20.8, -21.4]];
      const leib = [[-19.6, -23.2], [-16.6, -25], [-12.2, -25.6], [-7, -25], [-1.5, -24], [3.5, -23.6], [7, -23.9], [9.6, -25], [11.8, -26.6], [13.4, -28.6], [15.2, -29.6], [17, -28.4], [17.6, -26.4],
        [17.9, -24.6], [17.8, -21.6], [17.4, -18.6], [16.4, -15.8], [15.1, -13.6]].concat(vorn, [[5, -11.6], [1, -11.8], [-3, -12.4]], hinten);
      const leibId = pfad(T, leib);
      /* ---------- Kopf (in Endkoordinaten): runder Schädel, kurzer Fang, Kissen, kleines Kinn ---------- */
      const kopf = [[13.9, -30.4], [15.0, -32.8], [17.0, -34.0], [19.3, -34.1], [20.9, -33.3], [21.8, -32.1], [22.35, -30.9], [23.0, -30.0], [23.55, -29.3], [23.85, -28.6], [23.8, -28.0],
        [23.7, -27.4], [23.35, -26.85], [22.9, -26.55], [22.65, -26.15], [21.9, -25.45], [20.6, -24.95], [19, -24.7], [17.2, -24.6], [15.4, -25.4], [14.2, -27.4]];
      const kopfId = pfad(T, kopf);
      const ohr = [[15.4, -32.7], [15.75, -34.3], [15.55, -34.75], [16.0, -36.4], [16.9, -38.3], [17.45, -38.75], [17.9, -38.2], [18.9, -36.6], [19.9, -34.6], [20.3, -33.5], [18.2, -33.5], [16.4, -33.1]];
      const ohrId = pfad(T, ohr);
      /* ---------- Licht und Wuchsrichtung ---------- */
      const lf = feld(leib, 4, (x, y) => (y < -22 ? 0.06 : 0) - (y > -16 && y < -10.5 && x > -6 && x < 9 ? 0.15 : 0));
      const lic = (x, y) => (lf(x, y) + 0.3) / 1.05;
      const flow = (x, y) => {
        if (y > -11.5 && (x > 8 || (x < -6 && x > -18))) return 93;        // Läufe abwärts
        if (x > 12 && y < -17) return 115;                                  // Hals, Brust
        if (x < -15) return 112;                                            // Keule, Hose
        return 180 - 35 * klemm((y + 25) / 13);                             // Rumpf
      };
      let s = "";
      /* Ringe quer über ein Bein: Achse (oben→unten), Breiten, Lagen t, nach unten konvex (10 % der Breite), hinten auslaufend */
      const ringe = (achse, br, lagen, op) => {
        let d = "";
        for (const [t, bw] of lagen) {
          const i = Math.min(achse.length - 2, Math.floor(t * (achse.length - 1))), u = t * (achse.length - 1) - i;
          const p = [achse[i][0] + (achse[i + 1][0] - achse[i][0]) * u, achse[i][1] + (achse[i + 1][1] - achse[i][1]) * u];
          const dx = achse[i + 1][0] - achse[i][0], dy = achse[i + 1][1] - achse[i][1], l = Math.hypot(dx, dy) || 1, ax = dx / l, ay = dy / l, nx = ay, ny = -ax;
          const w = br[i] + (br[i + 1] - br[i]) * u, a = [p[0] - nx * w * 0.42, p[1] - ny * w * 0.42], b = [p[0] + nx * w * 0.6, p[1] + ny * w * 0.6];
          const k = w * 0.1;
          d += `M${folge(a)}Q${folge([p[0] + ax * k * 2, p[1] + ay * k * 2, b[0], b[1]])}l${folge([ax * bw, ay * bw])}Q${folge([p[0] + ax * (k * 2 + bw * 1.4), p[1] + ay * (k * 2 + bw * 1.4), a[0] + ax * bw * 0.3, a[1] + ay * bw * 0.3])}z`;
        }
        return `<path d="${d}" fill="${DK}" opacity="${op}"${zottel(T, "1.4 .7", 0.22)}/>`;
      };
      /* Pfote: Zehenwölbungen mit Fugen, Licht auf den Wölbungen, schmale dunkle Sohlenkante */
      const pfote = (x, fern) => {
        if (!T.fein) return "";
        let t = "";
        [[0, -1.95], [0.8, -1.6], [1.55, -1.05]].forEach(([dx, y], i) => {
          t += weichform(T, [[x + dx - 0.35, y + 0.1], [x + dx, y - 0.12], [x + dx + 0.3, y + 0.15], [x + dx, y + 0.45]], HELL, fern ? 0.12 : 0.35, 0.1);
          if (i < 2) t += falte(T, [[x + dx + 0.38, y + 0.22], [x + dx + 0.42, y + 0.75]], TIEF, 0.06, 0.5);
        });
        return t + `<path d="M${zahl(x - 3)} -.08h${zahl(4.6)}" stroke="#3a2a20" stroke-width=".12" stroke-opacity=".7" stroke-linecap="round"/>`;
      };
      /* ---------- ferne Beine: gleiche Winkel, 15 % dunkler, eigene Ringe ---------- */
      const fernV = schieb([[8, -15], [14.6, -15]].concat(vorn.slice(0, -1)), -2.0);
      const fernH = schieb([[-6, -16], [-6.4, -12.8]].concat(hinten.slice(1), [[-18.6, -16], [-12, -17]]), 1.7);
      const fernF = T.lg("kfern", [[0, "#7a6650"], [0.6, "#8e7a60"], [1, "#a4927a"]]);
      for (const [P, ach, br, lagen, px] of [
        [fernH, [[-13.2, -11.6], [-12.4, -8.8], [-14.0, -6.6], [-13.7, -3.6], [-13.4, -2]], [3.2, 2.9, 2.4, 2.2, 2.2], [[0.28, 0.5], [0.52, 0.42], [0.74, 0.34]], -11.3],
        [fernV, [[10.4, -11], [10.3, -8], [10.2, -5], [10.3, -3], [10.7, -2]], [3.3, 3.1, 2.8, 2.7, 2.7], [[0.2, 0.5], [0.42, 0.44], [0.62, 0.36], [0.8, 0.28]], 12.8]]) {
        const fl = feld(P, 1.6);
        s += `<g filter="${V("bein", 0.6, 5, 0.3)}">` + teil(T, P, fernF, {
          innen: ringe(ach, br, lagen, 0.6) + weichform(T, schieb(P, 0.5, 0.2), TIEF, 0.25, 0.45) + fell(T, P, FKo, { n: 45, flow: () => 93, licht: (x, y) => (fl(x, y) + 0.2) / 1.4 - 0.2, hell: 0.5 }),
          ueber: saum(T, P, FS, { abstand: 0.2, flow: () => 93, licht: () => 0.2, wo: (x, y) => y < -0.5 }),
        }) + "</g>";
      }
      /* ---------- Schwanz: aus der Kruppe, Ringe als gebogene Bänder (zur Spitze breiter, dunkler), dunkle Spitze ---------- */
      const sc = [[-18.2, -22.6], [-21, -20.2], [-23.6, -17.2], [-25.6, -13.8], [-27.4, -10.2], [-29.4, -6.6], [-31.8, -4.2], [-34.8, -3], [-37.6, -3.2], [-39.6, -4.6]];
      const sw = [3.4, 3.2, 3, 2.9, 2.85, 2.75, 2.65, 2.55, 2.45, 2.3];
      const schw = schlauch(sc, sw, true);
      const sl = feld(schw, 1.3);
      const sflow = (x, y) => (y < -17 ? 130 : y < -6 ? 115 : x > -34 ? 160 : 200);
      /* Ringe: gekrümmte Bänder quer zur Achse (Bogenhöhe 10 % der Breite) */
      const sring = (t, bw, op) => {
        const L = []; for (let i = 1; i < sc.length; i++) L.push(Math.hypot(sc[i][0] - sc[i - 1][0], sc[i][1] - sc[i - 1][1]));
        const ges = L.reduce((a, b) => a + b, 0); let d = t * ges, i = 0; while (i < L.length - 1 && d > L[i]) { d -= L[i]; i++; }
        const u = d / L[i], p = [sc[i][0] + (sc[i + 1][0] - sc[i][0]) * u, sc[i][1] + (sc[i + 1][1] - sc[i][1]) * u];
        const ax = (sc[i + 1][0] - sc[i][0]) / L[i], ay = (sc[i + 1][1] - sc[i][1]) / L[i], nx = -ay, ny = ax, w = sw[i] * 0.62, k = sw[i] * 0.1;
        const a = [p[0] - nx * w, p[1] - ny * w], b = [p[0] + nx * w, p[1] + ny * w];
        return `M${folge(a)}Q${folge([p[0] + ax * k * 2, p[1] + ay * k * 2, b[0], b[1]])}l${folge([ax * bw, ay * bw])}Q${folge([p[0] + ax * (k * 2 + bw), p[1] + ay * (k * 2 + bw), a[0] + ax * bw, a[1] + ay * bw])}z`;
      };
      const sr = [[0.27, 0.95], [0.375, 1.05], [0.48, 1.15], [0.585, 1.25], [0.69, 1.35], [0.79, 1.45], [0.885, 1.6]].map(([t, b]) => sring(t, b, 0)).join("");
      s += `<g filter="${V("schw", 0.7, 5, 0.3)}">` + teil(T, schw, T.lg("kschw", [[0, "#b29a72"], [0.55, "#a88e66"], [1, "#8a7254"]], 0, 0, 0.3, 1), {
        innen: schlag(T, leibId, 0.4, 0.7, 0.45, TIEF, 0.45) + `<path d="${sr}" fill="${DK}" opacity=".82"${zottel(T, "1.6 .8", 0.25)}/>` +
          form(T, abschnitt(sc, sw.map((w) => w * 1.2), 0.94, 1.05, 3), DK, ` opacity=".9"`) +
          fell(T, schw, FKo, { n: 80, flow: sflow, licht: (x, y) => (sl(x, y) + 0.25) / 1.1 }),
        ueber: saum(T, schw, FS, { abstand: 0.21, flow: sflow, licht: (x, y) => (sl(x, y) + 0.3) / 1.1 }),
      }) + "</g>";
      /* ---------- Tabby-Zeichnung ---------- */
      const ruecken = (x) => {
        const k = kurve(leib.slice(0, 9), 4);
        let best = k[0];
        for (const p of k) if (Math.abs(p[0] - x) < Math.abs(best[0] - x)) best = p;
        return best[1];
      };
      const Z = [], Zu = [], tupf = [];
      const aal = [];
      for (let x = -18.5; x <= 8.5; x += 1.5) aal.push([x, ruecken(x) + 0.5]);
      Z.push([aal, aal.map((p, i) => (i === 0 || i === aal.length - 1 ? 0.4 : 1.05))]);
      /* 13 Flankenstreifen, Abstand 70–130 %, Breite 60–140 %, über den Rippen gebogen, unten in Tupfen */
      let x0 = -14.6;
      for (let i = 0; i < 13; i++) {
        x0 += 1.62 * (0.6 + T.rnd() * 0.9);
        if (x0 > 6.6) break;
        const top = ruecken(x0) + 0.9, unten = -13.4 - (x0 > -2 && x0 < 4 ? 0.6 : 0);
        const bog = 1.0 + T.rnd() * 1.1 + (x0 > -6 && x0 < 4 ? 0.7 : 0), rueck = -1.6 - T.rnd() * 1.0;
        const m = [];
        for (let j = 0; j <= 5; j++) { const t = j / 5; m.push([x0 + bog * Math.sin(Math.PI * t * 0.9) + rueck * t * t * t + (T.rnd() - 0.5) * 0.3, top + (unten - top) * t]); }
        const b0 = 0.42 * (0.5 + T.rnd() * 1.0);
        const ws = m.map((p, j) => b0 * (j === 0 ? 0.6 : j === 5 ? 0.15 : 0.7 + T.rnd() * 0.6));
        Z.push([m, ws, 0, 0.55 + T.rnd() * 0.08]);
        if (T.fein) { Zu.push([m, ws, 0.66, 0.8]); for (let q = 0; q < 1 + (i % 2); q++) tupf.push(fleck(T, m[4][0] + (T.rnd() - 0.5) * 0.8, m[4][1] + 0.8 + q * 1.1 + T.rnd() * 0.4, 0.26, 0.16, DK, 1, -25)); }
      }
      /* Schulter: 3 Bögen entlang der Schulterblattkante; Keule: unterbrochene Bögen */
      for (let i = 0; i < 3; i++) Z.push([[[7.2 + i * 0.9, -23.6 + i * 0.2], [9.6 + i * 0.9, -20.4 + i * 0.3], [11.6 + i * 0.8, -16.8 + i * 0.4]], [0.15, 0.38, 0.12]]);
      for (let i = 0; i < 3; i++) {
        const rr = 2.9 + i * 1.6, cx = -16.2, cy = -16.4, pts = [];
        for (let a = -80; a <= 70; a += 30) pts.push([cx + Math.cos(a * Math.PI / 180) * rr * 1.05 + (T.rnd() - 0.5) * 0.3, cy + Math.sin(a * Math.PI / 180) * rr]);
        const ws = pts.map((p, j) => (j === 0 || j === pts.length - 1 ? 0.12 : 0.34 + 0.1 * i));
        Z.push([pts, ws, 0.05, 0.42 + 0.1 * i]); Z.push([pts, ws, 0.52 + 0.08 * i, 0.95]);
      }
      /* zwei Halsketten quer über Kehle und Vorbrust, nach unten konvex */
      Z.push([[[14.2, -24.6], [16, -22.6], [17.9, -23.2]], [0.2, 0.5, 0.25]]);
      Z.push([[[13.2, -21.6], [15.6, -19.2], [17.6, -19.8]], [0.18, 0.45, 0.22]]);
      const mus = zeichnung(T, Z, DK, 0.66) + (T.fein ? zeichnung(T, Zu, DK, 0.42) + `<g opacity=".38">${tupf.join("")}</g>` : "");
      /* Beinringe je Bein (nahe Beine) und Sohlenstreif hinten */
      const ringN = ringe([[12.4, -11.4], [12.2, -8], [12.1, -5], [12.3, -3], [12.9, -2]], [3.9, 3.4, 3.0, 2.9, 3], [[0.2, 0.55], [0.4, 0.5], [0.58, 0.4], [0.76, 0.3]], 0.7) +
        ringe([[-11.2, -11.2], [-13.4, -9.2], [-15.4, -6.8], [-15.4, -4.2], [-15.2, -2]], [4.4, 3.8, 2.6, 2.3, 2.3], [[0.16, 0.5], [0.38, 0.45], [0.6, 0.36], [0.8, 0.28]], 0.68) +
        form(T, [[-16.6, -6.4], [-16.0, -6.5], [-15.95, -0.1], [-16.45, -0.1]], DK, ` opacity=".55"`);
      s += `<g filter="${V("leib", 1.6, 5, 0.32)}">` + teil(T, "#" + leibId, T.lg("kfell", [[0, "#ad9068"], [0.12, "#b99d74"], [0.3, "#b0946a"], [0.46, "#8e7452"], [0.56, "#a88f6a"], [0.62, "#cbb894"], [1, "#d8c8a6"]]), {
        innen:
          `<g${zottel(T, "1.3 .55", 0.4)}>${mus}${ringN}</g>` +
          /* Schulterblatt-Lichtfläche mit Schattenkante hinten; Keule als Kugel; Okklusion Achsel, Kniefalte, Kinn/Hals, Schwanzansatz */
          weichform(T, [[7.6, -24.2], [10.4, -25.4], [14.6, -19.6], [15.2, -15.6], [13, -15.4], [9.6, -20]], HELL, 0.26, 0.5) +
          weichform(T, [[7.0, -23.8], [8.0, -24], [11.6, -17.6], [11.2, -16.4]], SCH, 0.22, 0.4) +
          weichform(T, [[-19.6, -21.6], [-15.4, -24.2], [-11, -21.6], [-11.6, -17.6], [-16, -17.4], [-19.4, -19]], HELL, 0.3, 0.8) +
          weichform(T, [[-20.6, -17], [-16.6, -13.4], [-11.4, -12.4], [-9.6, -13.4], [-12.6, -11.2], [-18, -11.6], [-20.4, -14]], SCH, 0.35, 0.55) +
          weichform(T, [[14.6, -15.4], [16.6, -16], [15.6, -12.6], [14.4, -12.2]], TIEF, 0.35, 0.4) +
          weichform(T, [[-6.6, -13.6], [-5.2, -12.4], [-7.4, -11], [-8.2, -12.2]], TIEF, 0.3, 0.3) +
          weichform(T, [[-20.2, -23.4], [-17.6, -24.6], [-17.8, -22.4], [-19.8, -21.6]], TIEF, 0.3, 0.35) +
          `<g transform="matrix(.88 0 0 .88 .9 -1.9)">${schlag(T, kopfId, 0.4, 0.8, 0.55, TIEF, 0.5)}</g>` +
          fell(T, leib, FK, { n: 215, hell: 0.8, mittel: 0.4, flow, licht: lic, wo: (x, y) => y < -3 }) +
          fell(T, leib, FKo, { n: 70, flow, licht: lic, wo: (x, y) => y > -5 }) +
          pfote(14.75, 0) + pfote(-13.3, 0),
        ueber: saum(T, leib, FS, { abstand: 0.24, flow, licht: lic, wo: (x, y) => y < -0.4 && !(y > -14 && x > -6 && x < 9.4) && !(x > 16 && y > -27 && y < -16) }) +
          saum(T, leib, FSc, { abstand: 0.15, flow: (x, y) => (x > 15 ? 100 : 170), licht: () => 0.3, wo: (x, y) => (y > -14 && x > -6 && x < 9.4) || (x > 16 && y > -27 && y < -16) }),
      }) + "</g>";
      s += `<g transform="matrix(.88 0 0 .88 .9 -1.9)">`;
      /* ---------- fernes Ohr: weiche Kante, Haarspitzen, 10 % dunkler, Innenseite als schmaler rosagrauer Streifen ---------- */
      const fohr = [[18.6, -33.8], [19.3, -36.6], [19.8, -37.6], [20.2, -37.2], [20.9, -35], [21.2, -33.6]];
      s += `<g filter="${V("ohr", 0.3, 5, 0.3)}">` + teil(T, fohr, "#7e6a50", { innen: form(T, [[19.9, -37], [20.6, -35.2], [20.9, -33.8], [20.5, -34.2], [20.1, -35.6]], "#a08880", ` opacity=".7"`), ueber: saum(T, fohr, FS, { abstand: 0.12, flow: () => 270, licht: () => 0.2 }) }) + "</g>";
      /* ---------- nahes Ohr: Öffnung nach vorn, Außenseite mit Kopffell, rosa nur tief in der Muschel, Ohrbüschel, Henry-Tasche ---------- */
      s += `<g filter="${V("ohr", 0.3, 5, 0.3)}">` + teil(T, "#" + ohrId, T.lg("kohr", [[0, "#8e7656"], [1, "#a68e6c"]]), {
        innen: form(T, [[17.7, -37.4], [18.6, -36.1], [19.7, -34.1], [19.9, -33.6], [19.1, -33.9], [18.4, -35.3], [17.8, -36.6]], "#6e5848", ` opacity=".7"`) +
          mal(T, 0.15, form(T, [[18.9, -34.9], [19.5, -34.0], [19.7, -33.7], [19.1, -33.85]], "#c99a92", ` opacity=".8"`)) +
          tasthaar(T, [19.7, -33.9, 1.3, 0.5, 2, 6], -150, -100, 1.6, ["#f2e8d6", "#e6d8c0"], 0.035, 0.9) +
          `<path d="M15.62 -34.5q.25 -.15 .2 -.5" fill="none" stroke="${TIEF}" stroke-width=".07" opacity=".7"/>` +
          fell(T, ohr, FKo, { n: 22, flow: () => 280, licht: () => 0.4, wo: (x, y) => x < 17.6 }),
        ueber: saum(T, ohr, FS, { abstand: 0.12, flow: () => 275, licht: () => 0.4, wo: (x, y) => x < 17.6 }),
      }) + "</g>";
      /* ---------- Kopf ---------- */
      const kl = feld(kopf, 2.2, (x, y) => (y > -27.5 && x > 20.5 ? 0.12 : 0));
      const klic = (x, y) => (kl(x, y) + 0.3) / 1.05;
      const kflow = (x, y) => {
        const dx = x - 21, dy = y - 30.3 * -1;
        if (Math.hypot(x - 21.1, y + 30.3) < 1.3) return Math.atan2(y + 30.3, x - 21.1) * 57;   // Brillenring: radial
        if (x > 21.8 && y > -29) return 150 + (y > -27 ? 20 : 0);                                 // Kissen
        return x < 16 ? 140 : y > -26.6 ? 160 : 186;
      };
      /* „M“ (im Profil drei kurze Linien), Scheitellinien, Linien vom Augenwinkel über die Wange */
      const km = falte(T, [[20.5, -33.6], [20.4, -32.8], [20.35, -32.1]], DK, 0.22, 0.8) + falte(T, [[19.6, -34.0], [19.45, -33.0], [19.55, -32.3]], DK, 0.22, 0.8) + falte(T, [[21.2, -32.8], [21.05, -32.2]], DK, 0.18, 0.75) +
        falte(T, [[18.6, -34.1], [17, -33.8], [15.4, -32.8], [14.3, -31.2]], DK, 0.24, 0.75) + falte(T, [[18.7, -33.2], [17.1, -32.8], [15.7, -31.6]], DK, 0.2, 0.65) +
        falte(T, [[20, -30.4], [18.8, -29.9], [17.5, -29.8], [16.4, -29]], DK, 0.24, 0.85) + falte(T, [[20.2, -28.9], [19.1, -28.5], [18, -27.9], [17, -27.2]], DK, 0.2, 0.7);
      s += `<g filter="${V("kopf", 1.1, 5, 0.32)}">` + teil(T, "#" + kopfId, T.lg("kkopf", [[0, "#a88c62"], [0.5, "#b49a74"], [1, "#d2bf9a"]]), {
        innen: `<g${zottel(T, "2.4 1", 0.16)}>${km}</g>` +
          /* Lippen, Kinn cremeweiß; Schnurrhaarkissen gewölbt (Licht oben, Schatten unten); Wangenwölbung; Okklusion unter dem Kiefer */
          mal(T, 0.22, form(T, [[21.9, -28.1], [23.5, -27.9], [23.55, -27.1], [22.9, -26.4], [22.4, -25.7], [21.0, -25.2], [20.2, -25.8], [21.0, -26.9]], "#efe4cc", ` opacity=".92"`)) +
          weichform(T, [[21.9, -28.3], [23.3, -28.1], [23.0, -27.4], [22.0, -27.5]], HELL, 0.5, 0.15) +
          weichform(T, [[21.6, -27.0], [23.2, -26.9], [22.7, -26.3], [21.6, -26.3]], SCH, 0.3, 0.15) +
          weichform(T, [[16.6, -29.4], [19.4, -29.6], [20.4, -27.4], [18.6, -25.8], [16.4, -26.4]], HELL, 0.18, 0.6) +
          weichform(T, [[15.6, -26.2], [19.6, -25.6], [20.8, -25.2], [16.4, -24.8]], TIEF, 0.3, 0.35) +
          schlag(T, ohrId, 0.25, 0.4, 0.22, TIEF, 0.35) +
          fell(T, kopf, FKo, { n: 125, flow: kflow, licht: klic, hell: 0.5 }),
        ueber: saum(T, kopf, FS, { abstand: 0.16, flow: kflow, licht: klic, wo: (x, y) => x > 15.6 && y < -29.5 && x < 22.2 }) +
          /* Backenkrause: Haare nach hinten unten über den Hals */
          saum(T, kopf, FSk, { abstand: 0.13, flow: () => 120, licht: (x, y) => 0.3, wo: (x, y) => (x < 16.6 && y > -32) || (y > -25.4 && x < 21.4) }),
      }) + "</g>";
      /* heller Fellring um das Auge (radiale Haare, unten 5–6 px, oben 2 px) */
      if (T.fein) {
        let d = "";
        for (let i = 0; i < 34; i++) {
          const a = i / 34 * Math.PI * 2, rx = 1.05, ry = 0.78, bx = 21.1 + Math.cos(a) * rx * 0.86, by = -30.3 + Math.sin(a) * ry * 0.86;
          const l = Math.sin(a) > 0 ? 0.3 + Math.sin(a) * 0.12 : 0.13, ex = bx + Math.cos(a) * l, ey = by + Math.sin(a) * l * 0.9;
          const nx = -Math.sin(a) * 0.035, ny = Math.cos(a) * 0.035;
          d += `M${folge([bx + nx, by + ny], 2)}L${folge([ex, ey], 2)}L${folge([bx - nx, by - ny], 2)}z`;
        }
        s += `<path d="${d}" fill="#efe2c4" opacity=".85"/>`;
      }
      /* Auge: 1,4 : 1, Hornhaut wölbt sich vor, Lidrand oben 2 px / unten 1 px, Oberlid-Schatten auf dem oberen Drittel */
      s += auge(T, 21.1, -30.3, 0.6, { ratio: 1.4, spitz: 0.6, winkel: -4, iris: "#b4ae46", iris2: "#7e7020", mitte: "#8aa046", sklera: "#9a9030", ir: 1.12, pupille: "schlitz", pr: 0.24, lid: "#1e1610", lidw: 0.1, nick: "#6a5048", fasern: true });
      s += `<path d="M21.85 -30.85Q22.35 -30.35 21.95 -29.75" fill="none" stroke="#fff" stroke-width=".12" stroke-opacity=".35"/>`;
      /* Nasenspiegel: bündig, schmaler Keil im Profil, ziegelrosa, 1 px dunkler Rand, Komma-Nasenloch, matter Glanz */
      const nase = [[23.3, -29.05], [23.75, -28.75], [23.88, -28.25], [23.7, -27.95], [23.3, -28.15]];
      s += form(T, nase, "#c48478") + `<path d="${T.glatt(nase)}" fill="none" stroke="#4a2820" stroke-width=".05" opacity=".8"/>`;
      s += `<path d="M23.72 -28.2q-.2 -.08 -.32 .08q.08 .06 .2 .02" fill="#2a1410"/><path d="M23.45 -28.85q.18 -.04 .28 .04" stroke="#fff" stroke-width=".08" stroke-opacity=".2" fill="none" stroke-linecap="round"/>`;
      s += `<path d="M23.55 -27.95Q23.5 -27.5 23.5 -27.2Q23.1 -26.85 22.6 -26.9" fill="none" stroke="#3a2418" stroke-width=".06" stroke-linecap="round" opacity=".8"/>`;
      /* Tasthaare: 4 versetzte Reihen auf dem Kissen, Fächer −30° … +25°, leicht nach unten gebogen; Brauen-Tasthaare */
      s += tasthaar(T, [23.0, -27.85, 1.6, 1.0, 4, 3], -30, 25, 6.4, ["#fbf8f0", "#f2ece0", "#d8cfc0"], 0.06, 0.8, "#5a4430");
      s += tasthaar(T, [21.6, -31.6, 0.3, 0.2, 1, 3], -100, -62, 2.6, ["#f6f2ea"], 0.035, 0.8);
      s += "</g>";
      return { svg: s, box: [-41, -36.2, 30.4, 0], fuesse: [-13.6, -11.4, 12.0, 14.4], kopf: [12.8, -36.3, 22.6, -23.4] };
    } },
  /* =================================================================
     KANINCHEN — Hauskaninchen, wildfarben (agouti), sitzend
     RECHERCHE: Oryctolagus cuniculus: Kopf-Rumpf 36–40 cm, gedrungener als der Hase (geduckt sitzend Länge zu
     Rückenhöhe ≈ 1,4 : 1, höchster Punkt über der Keule), Ohren nicht länger als der Kopf mit Hals (≈ 11–12 cm),
     löffelförmig (Basis schmal und gerollt, breiteste Stelle bei ⅔ der Höhe, Spitze rund), außen dicht und kurz
     wildfarben behaart, innen nur vorn rosa mit hellem Haarsaum, Spitze im oberen Fünftel dunkel gesäumt; Kopf
     keilförmig mit leichter Ramsnase, stumpfe Schnauze, volle Backe (Kaumuskel); Augen groß, seitlich, fast schwarz-
     braun, echter cremefarbener Fellring (hinten breiter), Oberlid mit Wimpern nach hinten-oben, Unterlid vorn kurze
     Wimpern, Nickhaut nur als schmale Sichel im vorderen Winkel; Nase behaart, Nasenlöcher kommaförmige Schlitze,
     gespaltene Oberlippe (Y), pralles Schnurrhaarkissen, kleines Kinn; im Sitzen liegen die langen Hinterfüße flach
     am Boden (Ferse ≈ 2,4 cm hoch unter der Keule, Zehen ≈ 1,6 cm), Sohlen dicht behaart ohne Ballen, Krallen aus
     Fellbüscheln; Vorderläufe kurz und gerade, Zehen dicht cremefarben behaart; Blume oben dunkel, unten weiß;
     Fell: Grannenhaare mit grauer Unterwolle, ockergelbem Band (#c4a26a) und schwarzer Spitze („Pfeffer und Salz“),
     Rücken und Keule dunkler (40–50 % schwarze Spitzen), Flanke 20–25 %, Nacken hinter den Ohren rostrot (#b0683a),
     Kinn, Kehle, Brust, Bauch (untere 25 %) und Blumen-Unterseite cremeweiß (#e8dcc4).
     Runde 3: Rumpf um 15 % gekürzt, Volumen je Teil, Büschel-Fell in Agouti-Tönen mit Farbzonen, Keilfuß mit
     Ferse und Sohlenfell, echter Fellring um das Auge, Kissen als Wölbung, Fellsaum an jeder Kontur.
     ================================================================= */
  { id: "kaninchen", de: "das Kaninchen", syl: "Ka-NIN-chen", it: "il coniglio", itSyl: "co-NI-glio", en: "rabbit",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.387, hoehe: 0.308,
    zeichne(T) {
      T.dez = 1;
      const SCH = "#4a3a2a", TIEF = "#2a1e14", HELL = "#fff4e0", CREME = "#e8dcc4";
      const V = (n, w, t, u) => vol(T, n, { weich: w, tiefe: t, umgebung: u });
      /* Agouti-Fell: schwarze Spitzen, ockergelbes Band, helle Lichthaare; creme für Bauch und Kehle */
      const FK = fellSatz(T, "k", { L: 0.85, k: 7, w: 0.06, dunkel: "#1e1812", od: [0.16, 0.3], mittel: "#c4a26a", om: [0.16, 0.26], hell: "#efe2c6", oh: [0.06, 0.18] });
      const FKo = fellSatz(T, "o", { L: 0.42, k: 5, w: 0.035, breit: 0.7, facher: 0.45, krumm: 0.25, dunkel: "#1e1812", od: [0.12, 0.22], mittel: "#c4a26a", om: [0.12, 0.2], hell: "#efe2c6", oh: [0.05, 0.14] });
      const FKc = fellSatz(T, "c", { L: 0.7, k: 6, w: 0.05, dunkel: "#8a7a60", od: [0.08, 0.14], hell: "#fffaf0", oh: [0.2, 0.35] });
      const FS = randSatz(T, "s", { L: 0.62, k: 5, w: 0.05, winkel: 26, dunkel: "#4e3e2c", od: [0.8, 1], hell: "#9a8462", oh: [0.8, 1] });
      const FSc = randSatz(T, "sc", { L: 0.62, k: 5, w: 0.05, winkel: 40, dunkel: "#c8bca2", od: [0.9], hell: "#f2eadc", oh: [0.95] });
      const FSo = randSatz(T, "so", { L: 0.22, k: 4, w: 0.025, winkel: 30, dunkel: "#6e5a42", od: [0.9], hell: "#a28c6a", oh: [0.9] });
      /* ---------- Formen (Rumpf 15 % kürzer als in Runde 2) ---------- */
      const leib = [[-12.4, -1.25], [-14.6, -1.4], [-15.9, -2.6], [-17.3, -5.2], [-17.8, -9], [-17, -13.2], [-14.6, -17], [-10.4, -19.6], [-5.6, -19.4], [-1.6, -18.4], [1.6, -17.6], [3.4, -18.2], [5.4, -13],
        [5.0, -10.4], [6.9, -9], [8.9, -8.1], [10.1, -7], [10.35, -5.4], [10.25, -3.4], [10.5, -2.2], [11.2, -1.75], [11.75, -1.25], [12.0, -0.5], [11.65, 0, 1], [8.6, 0, 1],
        [8.35, -0.9], [8.4, -3.2], [8.0, -4.4], [5.5, -3.5], [1, -2.7], [-3, -2.4], [-5.6, -2.15], [-8.4, -1.7], [-10.6, -1.35]];
      const leibId = pfad(T, leib);
      /* Hinterfuß als Keil: Ferse 2,4 cm (runder Höcker hinten), Zehen 1,6 cm, flache Zehenwölbungen */
      const fuss = [[-15.3, -0.25], [-15.65, -1.3], [-15.2, -2.4], [-13.4, -2.45], [-10, -2.1], [-7.5, -1.8], [-6.6, -1.72], [-6.15, -1.5], [-5.65, -1.42], [-5.2, -1.05], [-4.95, -0.45], [-5.3, 0, 1], [-14.8, 0, 1]];
      const fussId = pfad(T, fuss);
      const kopf = [[5.2, -17.4], [6.6, -19.6], [8.6, -20.5], [11.4, -20], [13.4, -18.9], [14.9, -17.2], [15.95, -15.6], [16.35, -14.3], [16.2, -13.1], [15.7, -12.35], [15.3, -11.8],
        [14.5, -11], [13.4, -10.3], [11.6, -9.55], [9.6, -9.5], [7.6, -10.3], [6.2, -12.2], [5.3, -14.8]];
      const kopfId = pfad(T, kopf);
      const ohrN = [[6.8, -18.2], [6.5, -21.6], [5.6, -25], [4.7, -28.2], [4.3, -30.3], [4.7, -31.5], [5.8, -31.6], [7.2, -30.2], [8.2, -27.4], [8.8, -24.2], [9.1, -21.4], [9.2, -18.4]];
      const ohrNId = pfad(T, ohrN);
      /* ---------- Licht und Wuchsrichtung ---------- */
      const lf = feld(leib, 6, (x, y) => (y < -15 ? 0.06 : 0));
      const lic = (x, y) => (lf(x, y) + 0.3) / 1.05;
      const flow = (x, y) => {
        if (x > 7.8 && y > -8) return 92;                                                   // Vorderlauf
        if (x < -4 && y > -17 && Math.hypot(x + 10.5, y + 9.5) < 7.2 && Math.hypot(x + 10.5, y + 9.5) > 2.2) return Math.atan2(y + 9.5, x + 10.5) * 57 + 95;   // Wirbel um die Keule
        return 180 - 30 * klemm((y + 18) / 14);                                             // Nase → Rücken → Blume
      };
      const ruecken = (x, y) => y < -13.5 - (x > -2 ? (x + 2) * 0.35 : 0);
      const bauch = (x, y) => x > -6.5 && y > -6.4 + (x > 4 ? (x - 4) * 0.3 : 0) + (x < -2 ? (-2 - x) * 0.5 : 0);
      let s = "";
      /* ---------- ferne Glieder: Hinterfuß, Vorderlauf; 15–20 % dunkler ---------- */
      const fussF = schieb(fuss, 0.9, -0.05);
      s += `<g filter="${V("bein", 0.5, 5, 0.3)}">` + teil(T, fussF, "#8a7860", { innen: fell(T, fussF, FKo, { n: 30, flow: () => 178, licht: () => 0.3, hell: 0.4 }) }) + "</g>";
      const fernV = schieb([[7.1, -9], [9.9, -9], [10.1, -6.2], [10.25, -3.4], [10.5, -2.2], [11.2, -1.75], [11.75, -1.25], [12.0, -0.5], [11.65, 0, 1], [8.6, 0, 1], [8.35, -0.9], [8.4, -3.2], [8.0, -6]], -1.5);
      s += `<g filter="${V("bein", 0.5, 5, 0.3)}">` + teil(T, fernV, T.lg("knfern", [[0, "#7e6a54"], [1, "#b8aa90"]]), {
        innen: fell(T, fernV, FKo, { n: 26, flow: () => 92, licht: () => 0.3, hell: 0.5 }),
        ueber: saum(T, fernV, FSo, { abstand: 0.15, flow: () => 92, licht: () => 0.3, wo: (x, y) => y < -0.4 }),
      }) + "</g>";
      /* ---------- Blume: Puschel an die Keule gedrückt, oben dunkel, unten rein weiß ---------- */
      const blume = [[-16.2, -9.6], [-17.6, -9.9], [-19, -9.2], [-19.6, -7.6], [-19.2, -6], [-18, -5.2], [-16.6, -5.6]];
      s += `<g filter="${V("blume", 0.5, 4, 0.35)}">` + teil(T, blume, T.lg("blume", [[0, "#4e3e2c"], [0.5, "#6e5c44"], [0.58, "#f6f2ea"], [1, "#fffdf8"]], 0.2, 0, 0.8, 1), {
        innen: fell(T, blume, FKo, { n: 14, flow: (x, y) => (y < -7.4 ? 200 : 150), licht: () => 0.4, wo: (x, y) => y < -7.6, hell: 0.3 }),
        ueber: saum(T, blume, FS, { abstand: 0.14, flow: () => 190, licht: () => 0.2, wo: (x, y) => y < -7.4 }) + saum(T, blume, FSc, { abstand: 0.11, flow: () => 170, licht: () => 0.9, wo: (x, y) => y >= -7.4 }),
      }) + "</g>";
      /* ---------- naher Hinterfuß: vor dem Leib gezeichnet, damit die Keule ihn oben überlappt ---------- */
      const fl = feld(fuss, 1.2);
      s += `<g filter="${V("fuss", 0.55, 5, 0.3)}">` + teil(T, "#" + fussId, T.lg("kfuss", [[0, "#7e6a52"], [0.55, "#94806a"], [0.8, "#bfae90"], [1, "#d8ccb0"]]), {
        innen: fell(T, fuss, FKo, { n: 60, flow: () => 178, licht: (x, y) => (fl(x, y) + 0.3) / 1.1, hell: 0.8 }) +
          (T.fein ? [0, 1].map((i) => falte(T, [[-6.35 + i * 0.5, -1.62 + i * 0.12], [-6.2 + i * 0.5, -0.9]], TIEF, 0.06, 0.4)).join("") : "") +
          mal(T, 0.3, form(T, [[-15, -2.5], [-6, -2], [-6.4, -1.4], [-14.6, -1.7]], TIEF, ` opacity=".45"`)),
        ueber: saum(T, fuss, FSo, { abstand: 0.11, flow: () => 175, licht: (x, y) => (fl(x, y) + 0.3) / 1.1, wo: (x, y) => y < -0.3 }) +
          /* Sohlenfell: heller, büscheliger Saum unter dem Fuß */
          saum(T, fuss, FSc, { abstand: 0.12, flow: () => 175, licht: () => 0.9, wo: (x, y) => y > -0.3 && x < -5.6 }),
      }) + (T.fein ? [[-5.0, -0.55, 0.42], [-5.4, -0.42, 0.36]].map(([x, y, l]) => kralle(T, x, y, l, 52, "#5a4a3c", 0.3)).join("") : "") + "</g>";
      /* ---------- Leib ---------- */
      s += `<g filter="${V("leib", 1.6, 5, 0.32)}">` + teil(T, "#" + leibId, T.lg("kanf", [[0, "#6a563c"], [0.3, "#76614a"], [0.48, "#86705a"], [0.66, "#6c5a46"], [0.8, "#6e5e4a"], [1, "#8a7a62"]]), {
        innen:
          /* Farbzonen: cremeweiße Unterseite (untere 25 %) mit ausgefranster Kante, rostroter Nacken hinter dem Ohransatz */
          `<g${zottel(T, "1.2 .6", 0.5)}>` + mal(T, 0.2, form(T, [[-6.4, -2.2], [-2, -3.4], [2, -4.6], [5.6, -6.2], [6.6, -9.2], [5.6, -12.6], [6.6, -12], [8.4, -8.6], [8.4, -3.4], [5.6, -2.8], [0, -2.2]], CREME, ` opacity=".95"`)) +
          mal(T, 0.4, form(T, [[0.6, -18.2], [3.4, -18.6], [4.6, -16.4], [3.6, -15.2], [1.2, -15.8]], "#b0683a", ` opacity=".7"`)) + "</g>" +
          /* Keule als Kugel: Glanz oben vorn, Schattensichel vorn unten; Terminator bei ≈ 55 % der Flankenhöhe kommt aus dem Verlauf */
          weichform(T, [[-14.6, -15.6], [-10.4, -18.4], [-6.4, -16.4], [-8.4, -13], [-12.6, -12.6]], "#c2ad88", 0.35, 0.9) +
          weichform(T, [[-4.8, -14.6], [-3.6, -9.6], [-5, -4.6], [-7.6, -3.6], [-6.6, -7], [-6.4, -11.6]], SCH, 0.35, 0.7) +
          /* Okklusion: Halsschatten unter dem Kiefer, Kontaktschatten über dem Fuß, zwischen Vorderlauf und Bauch */
          `<g transform="translate(-3.5 1)">${schlag(T, kopfId, 0.3, 1.2, 0.5, TIEF, 0.42)}</g>` +
          weichform(T, [[8.0, -4.6], [5.6, -3.6], [6.2, -6.6], [8.4, -7.4]], TIEF, 0.3, 0.4) +
          weichform(T, [[-15.4, -2.6], [-6.4, -2.4], [-6.6, -3.2], [-14.4, -3.6]], TIEF, 0.3, 0.4) +
          /* Fell: Rücken und Keule mit 40–50 % schwarzen Spitzen, Flanke 20–25 %, Unterseite creme */
          fell(T, leib, FK, { n: 190, flow, licht: (x, y) => lic(x, y) * 0.6, hell: 0.5, mittel: 0.6, wo: (x, y) => ruecken(x, y) }) +
          fell(T, leib, FK, { n: 170, flow, licht: lic, hell: 0.7, mittel: 0.8, wo: (x, y) => !ruecken(x, y) && !bauch(x, y) }) +
          fell(T, leib, FKc, { n: 70, flow: (x, y) => (x > 4 ? 100 : 170), licht: lic, wo: bauch }) +
          (T.fein ? [0, 1].map((i) => falte(T, [[10.95 - i * 0.55, -1.65 + i * 0.1], [11.15 - i * 0.55, -0.6]], TIEF, 0.06, 0.4)).join("") : ""),
        ueber: saum(T, leib, FS, { abstand: 0.15, flow, licht: lic, wo: (x, y) => !bauch(x, y) && y < -0.3 && !(x > 3.4 && y < -12) }) +
          saum(T, leib, FSc, { abstand: 0.13, flow: (x, y) => (x > 7.9 ? 92 : 165), licht: () => 0.9, wo: (x, y) => bauch(x, y) && y < -0.3 }),
      }) + (T.fein ? [[11.75, -0.5, 0.36], [11.25, -0.4, 0.3]].map(([x, y, l]) => kralle(T, x, y, l, 55, "#5a4a3c", 0.3)).join("") + saum(T, [[10.6, -2.1], [11.3, -1.7], [11.9, -1.15], [12.05, -0.55], [11.5, -0.9], [10.8, -1.4]], FSc, { abstand: 0.08, flow: () => 45, licht: () => 0.9 }) : "") + "</g>";
      /* ---------- Kopf, Ohren (um 3,5 cm nach hinten gerückt) ---------- */
      s += `<g transform="translate(-3.5 1)">`;
      /* fernes Ohr: eigene Form, zeigt die rosa Innenseite mit hellem Haarsaum an der Öffnung */
      const ohrF = [[8.4, -19.6], [7.9, -22.4], [7.2, -25.4], [6.6, -28.2], [6.6, -29.8], [7.4, -30.4], [8.4, -29.4], [9.3, -26.8], [9.8, -23.8], [10, -20.8]];
      s += `<g filter="${V("ohr", 0.4, 5, 0.3)}">` + teil(T, ohrF, "#66543e", {
        innen: mal(T, 0.15, form(T, [[8.6, -21], [8.2, -24.2], [7.6, -27.4], [7.5, -29.4], [8.4, -28.8], [9.2, -26], [9.5, -22.6]], "#a87e74", ` opacity=".7"`)) +
          tasthaar(T, [9.4, -22.6, 1.2, 4.8, 6, 2], -150, -110, 0.7, ["#efe4d0"], 0.025, 0.6) +
          weichform(T, [[6.6, -28.6], [7.4, -30.4], [8.4, -29.4], [8.0, -28.6], [7.2, -29.4]], "#1e1812", 0.45, 0.2),
        ueber: saum(T, ohrF, FSo, { abstand: 0.12, flow: () => 260, licht: () => 0.3 }),
      }) + "</g>";
      /* nahes Ohr: außen dicht kurz wildfarben behaart, rosa nur als schmaler Streifen vorn, Spitze im oberen 20 % dunkel gesäumt */
      const ol = feld(ohrN, 1.4);
      s += `<g filter="${V("ohr", 0.4, 5, 0.3)}">` + teil(T, "#" + ohrNId, T.lg("kohrn", [[0, "#6e5a42"], [0.5, "#86704f"], [1, "#94805f"]], 0, 0, 1, 0.2), {
        innen: mal(T, 0.12, form(T, [[8.1, -21], [8.3, -24.4], [7.8, -27.6], [7, -29.8], [7.5, -29.4], [8.4, -27.2], [8.75, -24.2], [8.7, -21]], "#c49a90", ` opacity=".6"`)) +
          tasthaar(T, [8.6, -21.4, 0.4, 8, 10, 1], -150, -125, 0.75, ["#efe4d0"], 0.025, 0.7) +
          weichform(T, [[4.3, -29.4], [4.5, -31.2], [5.6, -31.8], [7.0, -30.6], [6.2, -30.4], [5.2, -30.6], [4.8, -29.4]], "#1e1812", 0.6, 0.25) +
          weichform(T, [[6.6, -19.8], [9.2, -19.6], [9.2, -18.2], [6.8, -18.2]], TIEF, 0.35, 0.3) +
          fell(T, ohrN, FKo, { n: 70, flow: () => 255, licht: (x, y) => (ol(x, y) + 0.3) / 1.1, hell: 0.7 }),
        ueber: saum(T, ohrN, FSo, { abstand: 0.09, flow: () => 255, licht: (x, y) => (ol(x, y) + 0.3) / 1.1, wo: (x, y) => y < -19 }),
      }) + "</g>";
      /* Kopf */
      const kl = feld(kopf, 2.6, (x, y) => (y > -13 && x > 12 ? 0.12 : 0));
      const klic = (x, y) => (kl(x, y) + 0.3) / 1.05;
      const kflow = (x, y) => {
        if (Math.hypot(x - 10.5, y + 16.3) < 1.6) return Math.atan2(y + 16.3, x - 10.5) * 57;    // Augenring radial
        return x > 13.5 ? 195 : y > -12.5 ? 160 : 182;
      };
      s += `<g filter="${V("kopf", 1.0, 5, 0.32)}">` + teil(T, "#" + kopfId, T.lg("kkopfn", [[0, "#6e5a40"], [0.45, "#86704f"], [0.75, "#a2906e"], [1, "#c8b898"]]), {
        innen:
          /* Kinn und Kehle creme, volle Backe (Kaumuskel) als Kugel, Schnurrhaarkissen prall (Licht oben, Schattenbogen unten) */
          `<g${zottel(T, "1.4 .7", 0.35)}>` + mal(T, 0.2, form(T, [[12.4, -11.6], [15.4, -12.2], [15.2, -11.4], [13.4, -10.2], [11.4, -9.5], [9.4, -9.4], [8.6, -10.2], [10.6, -10.8]], CREME, ` opacity=".95"`)) + "</g>" +
          weichform(T, [[7.4, -15.2], [10.6, -15.0], [12.4, -13], [11.2, -10.6], [8.4, -10.6], [7.2, -12.6]], "#c2ad88", 0.22, 0.6) +
          weichform(T, [[7.2, -11.6], [11.6, -11.2], [12.6, -10.2], [8.6, -9.8]], SCH, 0.3, 0.4) +
          weichform(T, [[13.2, -14.6], [15.4, -14.7], [15.9, -13.4], [14.6, -13.1], [13.2, -13.4]], HELL, 0.35, 0.2) +
          weichform(T, [[13.0, -12.6], [15.2, -12.5], [14.8, -11.9], [13.2, -11.9]], SCH, 0.4, 0.15) +
          /* echter Fellring um das Auge: creme, innen scharf, außen ausgefranst, hinten 20 % breiter */
          `<path d="M${folge([10.5 - 1.42, -16.35])}a1.36 1.12 0 1 0 2.72 0a1.36 1.12 0 1 0 -2.72 0zM${folge([10.5 - 0.98, -16.3])}a.92 .8 0 1 1 1.84 0a.92 .8 0 1 1 -1.84 0z" fill="#e6d9bf" fill-rule="evenodd" opacity=".9"${zottel(T, "2 1", 0.12)}/>` +
          fell(T, kopf, FKo, { n: 120, flow: kflow, licht: klic, hell: 0.7, wo: (x, y) => Math.hypot(x - 10.5, y + 16.3) > 1.5 }),
        blende: [0, 0.5, 0.2, 0.5, 0.15, 1],
        ueber: saum(T, kopf, FS, { abstand: 0.12, flow: kflow, licht: klic, wo: (x, y) => x > 9 && y < -12 && !(x > 15.4 && y > -15.8) }) +
          /* Hinterkopf, Wange und Kehle laufen mit langem Haarsaum über Nacken und Brust */
          saum(T, kopf, FS, { abstand: 0.1, flow: (x, y) => (y > -12 ? 120 : 150), licht: () => 0.35, wo: (x, y) => x < 11 && y > -17.4 }) +
          saum(T, kopf, FSc, { abstand: 0.12, flow: () => 120, licht: () => 0.3, wo: (x, y) => y > -11.2 && x > 11 && x < 14.4 }) +
          /* Haare vom Auge weg an der Außenkante des Rings */
          (T.fein ? saum(T, [[9.12, -16.35], [9.5, -17.3], [10.5, -17.5], [11.5, -17.3], [11.86, -16.35], [11.5, -15.4], [10.5, -15.2], [9.5, -15.4]], FSo, { abstand: 0.12, flow: (x, y) => Math.atan2(y + 16.3, x - 10.5) * 57, licht: () => 0.3 }) : ""),
      }) + "</g>";
      /* Nasenspitze behaart, 10 % dunkler, winziger Feuchtglanz; Nasenloch als Komma-Schlitz 45°, innen #2a1812 */
      s += weichform(T, [[15.2, -15.3], [16.2, -15], [16.3, -14.2], [15.6, -13.9], [15.1, -14.4]], "#7a5e4c", 0.5, 0.15);
      s += mal(T, 0.04, `<ellipse cx="15.75" cy="-15.05" rx=".12" ry=".07" fill="#fff" opacity=".4"/>`);
      s += `<path d="M16.28 -14.95C16 -14.85 15.78 -14.6 15.64 -14.3C15.56 -14.1 15.42 -14 15.3 -13.98C15.5 -14.32 15.78 -14.92 16.26 -15.06Z" fill="#2a1812"/><path d="M15.4 -14.15Q15.7 -14.8 16.25 -15.12" fill="none" stroke="#c8b8a0" stroke-width=".035" opacity=".7"/>`;
      s += `<path d="M15.55 -13.85Q15.7 -13.2 15.62 -12.6M15.62 -12.62Q15.35 -12.35 15 -12.38" fill="none" stroke="#3a2418" stroke-width=".05" stroke-linecap="round" opacity=".7"/>`;
      /* Auge: fast nur Pupille, Wimpern nach hinten-oben, 5–7 Unterlid-Wimpern vorn, Nickhaut als schmale Sichel außerhalb der Hornhaut */
      s += auge(T, 10.5, -16.3, 0.72, { ratio: 1.25, winkel: -6, iris: "#3a2210", iris2: "#140a04", mitte: "#4a2c16", pr: 0.82, lid: "#140c08", lidw: 0.14, wimpern: [16, 0.62, "#1a120c"], unten: [6, 0.32], zweit: false });
      s += `<path d="M11.36 -16.45q-.14 .2 -.02 .42q.12 -.14 .1 -.42z" fill="#b89088" opacity=".6"/>`;
      /* Tasthaare: aus 3–4 versetzten Follikelreihen des Kissens; Tasthaare über dem Auge */
      s += tasthaar(T, [15.2, -13.8, 1.8, 1.4, 4, 4], -16, 28, 6.4, ["#2a2018", "#4a3a2a", "#8a7a68"], 0.05, 0.8, "#4a3426");
      s += tasthaar(T, [11, -17.9, 0.6, 0.2, 1, 4], -125, -95, 3.2, ["#2a2018"], 0.035, 0.75);
      s += "</g>";
      return { svg: s, box: [-20, -30.8, 18.7, 0], fuesse: [-9.6, -8.8, 9.1, 10.1], kopf: [-0.5, -31, 18.5, -8.5] };
    } },
  /* =================================================================
     MEERSCHWEINCHEN — Hausmeerschweinchen, Glatthaar, dreifarbig (schwarz-rot-weiß)
     RECHERCHE: MSD/Merck Vet Manual u. a.: Körperlänge 20–25 cm, 0,7–1,2 kg; gedrungener Rumpf ohne sichtbaren
     Schwanz und ohne abgesetzten Hals, Masse hinten schwerer (Hinterteil rund, Bauchfell hinten bis zum Boden, zur
     Brust ansteigend); Oberschenkel und Schulter nur als Wölbung im Fell, Beine verschwinden fast ganz im Bauchfell;
     großer, stumpfer Kopf mit hoher, gewölbter „Ramsnase“, Front fast senkrecht, darunter springt die Oberlippe
     zurück, kleine Mundkerbe, kleines rundes Kinn deutlich hinter der Nasenspitze, konkave Kehle, volle Backen;
     Augen groß, rund, vorstehend, fast schwarz, schmaler Fellring; „Rosenohren“: dünn, fast nackt, blütenblattförmig
     mit welligem Rand, der vordere obere Rand nach vorn unten umgeschlagen (konkave Mulde), Rand durchscheinend,
     nur knapp über die Kopfkontur ragend; Nasenlöcher kommaförmige Schlitze, Nasenhaut kaum behaart, gespaltene
     Oberlippe; lange Tasthaare aus 4–5 Reihen; Vorderfuß ≈ 2,4 cm mit 4 Zehen (3 sichtbar), Hinterfuß ≈ 5 cm
     sohlengängig mit 3 Zehen und Fersenballen, Krallen hornfarben, Fußrücken weiß behaart, nackt rosa nur Sohlenrand
     und Zehenballen; Glatthaar 2–3 cm, glänzend, in flachen Strähnen von vorn nach hinten, an der Flanke schräg nach
     hinten unten; Dreifarbig: unregelmäßige Platten Schwarz, Rot und Weiß, Ränder durch Haare verzahnt (Haare der
     vorderen Platte liegen über der hinteren), weiße Blesse auf der Nase.
     Runde 3: ganz neu – Körper mit schwerem Hinterteil, Ramsnase mit Lippenstufe und Kinn, Füße aus Fell, Zehen-
     lappen und Krallen, Rosenohr als Blütenblatt, Volumen, Büschel-Fell in Strähnen je Platte, Fellsaum statt Strichen.
     ================================================================= */
  { id: "meerschweinchen", de: "das Meerschweinchen", syl: "MEER-schwein-chen", it: "la cavia", itSyl: "CA-via", en: "guinea pig",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.305, hoehe: 0.131,
    zeichne(T) {
      T.dez = 2;
      const TIEF = "#2a2420", W1 = "#f6f2ea", W2 = "#d9d3c8", W3 = "#a8a7aa";
      const V = (n, w, t, u) => vol(T, n, { weich: w, tiefe: t, umgebung: u });
      /* Fell je Platte: flache, lange Strähnen (2–3 cm), Kontrast höchstens ±12 % */
      const satz = (k, d, od, h, oh, L = 1.4) => fellSatz(T, k, { L, k: 5, w: 0.055, breit: 0.28, facher: 0.12, krumm: 0.08, dunkel: d, od, hell: h, oh });
      const FW = satz("w", "#8a8478", [0.05, 0.1], "#ffffff", [0.12, 0.26]);
      const FR = satz("r", "#8a4416", [0.14, 0.24], "#f0b070", [0.12, 0.22]);
      const FB = satz("b", "#000000", [0.18, 0.32], "#5a6070", [0.08, 0.16]);
      const FWk = satz("wk", "#8a8478", [0.05, 0.1], "#ffffff", [0.12, 0.26], 0.6), FBk = satz("bk", "#000000", [0.18, 0.32], "#5a6070", [0.07, 0.14], 0.6);
      const rs = (k, d, h, L = 0.42, wi = 22) => randSatz(T, k, { L, k: 4, w: 0.04, winkel: wi, dunkel: d, od: [0.9], hell: h, oh: [0.95] });
      const SW = rs("w", "#cfc9be", "#f8f5ee"), SR = rs("r", "#9a5020", "#c87a40"), SB = rs("b", "#0e0c0b", "#34363c"), SP = rs("p", "#9a5020", "#c87a40", 0.5, 14), SPb = rs("pb", "#0e0c0b", "#2a2c30", 0.45, 14);
      /* ---------- Silhouette: schweres Hinterteil, kein Hals, Ramsnase, Lippenstufe, kleines Kinn, konkave Kehle ---------- */
      const leib = [[-10.6, -1.0], [-12.3, -2.6], [-13.2, -5.2], [-12.9, -8.0], [-11.4, -10.4], [-8.6, -11.9], [-4.6, -12.5], [-0.4, -12.4], [2.6, -11.9], [4.0, -11.75], [5.6, -11.95], [7.0, -11.75], [8.6, -11.1], [10.1, -9.7],
        [11.35, -8.3], [12.15, -6.9], [12.5, -5.7], [12.48, -4.95], [12.2, -4.55], [11.9, -4.3], [11.92, -3.75], [11.7, -3.48], [11.78, -3.2], [11.55, -2.85], [11.0, -2.62], [10.3, -2.35], [9.5, -1.75],
        [8.2, -1.2], [4, -0.85], [0, -0.62], [-3, -0.42], [-4.3, -0.15], [-5.3, -0.55], [-7.5, -0.8], [-9.4, -0.95]];
      const leibId = pfad(T, leib);
      /* Platten */
      const rot = [[-6.4, -12.9], [-3.4, -13], [-0.4, -12.7], [1.2, -12.4], [2.2, -11], [2.9, -9.6], [2.3, -8.4], [2.7, -7.1], [1.8, -5.9], [1.2, -4.6], [0.1, -4.1], [-0.9, -4.9],
        [-1.6, -4.2], [-2.8, -4.8], [-3.8, -6.2], [-4.6, -6.9], [-5.6, -6.4], [-6.3, -7.8], [-6.2, -9.6], [-7, -10.6]];
      const schwarzH = [[-14.2, -7.4], [-13, -11], [-9.8, -12.8], [-7.8, -12.6], [-7.2, -11], [-7.8, -9.6], [-7.2, -8.4], [-8.4, -7], [-8.1, -5.4], [-9.4, -4.4], [-10.4, -2.6], [-12.4, -1.8], [-14.2, -2]];
      const schwarzK = [[4.2, -12.6], [7, -12.4], [9.4, -11.4], [10.3, -9.9], [9.6, -8.7], [10.2, -7.4], [9.8, -6.1], [10.2, -4.9], [9.3, -3.4], [7.6, -2.6], [6.1, -3.4], [5.2, -4.9],
        [4.4, -5.6], [4.6, -7.2], [3.6, -8.6], [4.2, -10.2]];
      const platte = (x, y) => (T.inPoly(x, y, schwarzK) || T.inPoly(x, y, schwarzH) ? 2 : T.inPoly(x, y, rot) ? 1 : 0);
      /* Rosenohr: Blütenblatt mit welligem Rand, nur 35–45 % über der Kopfkontur */
      const ohr = [[4.3, -11.0], [4.15, -11.8], [4.55, -12.55], [5.25, -13.0], [5.75, -12.95], [6.15, -13.1], [6.8, -12.8], [7.15, -12.2], [7.0, -11.5], [6.55, -11.0], [5.9, -10.72], [5.1, -10.7]];
      const ohrId = pfad(T, ohr);
      /* ---------- Licht und Wuchsrichtung ---------- */
      const lf = feld(leib, 4.2, (x, y) => (y > -2 ? 0.1 : 0));
      const lic = (x, y) => (lf(x, y) + 0.3) / 1.05;
      const flow = (x, y) => {
        if (x > 9.6) return 196;
        return 180 + (y > -7 ? 14 * klemm((y + 7) / 5) : -4 * klemm((-y - 9) / 3));            // Rumpf ±5°, Flanke nach hinten unten
      };
      let s = "";
      /* ---------- Füße: Zehenlappen mit Krallen (dunklere Wurzel), Fußrücken weiß behaart, rosa nur Sohlenrand und Ballen ---------- */
      const zehen = (x, n, l, f, kl) => {
        let t = "";
        for (let i = 0; i < n; i++) {
          const zx = x + i * l * 0.85;
          t += form(T, [[zx, -0.55], [zx + l * 0.55, -0.62], [zx + l, -0.36], [zx + l * 0.95, -0.05], [zx + l * 0.1, -0.05]], f);
          if (T.fein) t += kralle(T, zx + l * 0.98, -0.3, kl, 52, "#cdbfa8", 0.3) + `<path d="M${folge([zx + l * 0.95, -0.38])}l.06 .05" stroke="#8a7a68" stroke-width=".08" opacity=".6"/>`;
        }
        return t;
      };
      const fuss = (x, len, n, l, kl, fern) => {
        const P = [[x, -0.12], [x - 0.18, -0.55], [x + 0.15, -0.95], [x + len * 0.5, -1.05], [x + len * 0.85, -0.85], [x + len, -0.55], [x + len * 0.98, -0.1]];
        const tint = fern ? 0.22 : 0;
        return `<g filter="${V("fuss", 0.25, 4, 0.35)}">` + form(T, P, mix(W2, "#000000", tint)) +
          form(T, [[x + 0.05, -0.08], [x + len * 0.9, -0.08], [x + len * 0.9, -0.24], [x + 0.1, -0.26]], mix("#d6a39a", "#000000", tint)) +
          zehen(x + len - n * l * 0.85 + 0.1, n, l, mix("#d6a39a", "#000000", tint), kl) +
          /* weißes Fell über den Zehenwurzeln */
          saum(T, [[x + 0.3, -0.92], [x + len * 0.5, -1.0], [x + len * 0.85, -0.66], [x + len * 0.6, -0.55], [x + 0.35, -0.65]], SW, { abstand: 0.12, flow: () => 15, licht: () => (fern ? 0.1 : 0.8) }) + "</g>";
      };
      /* ferne Füße: 20–25 % dunkler, halb verdeckt */
      s += fuss(-9.5, 4.8, 2, 0.42, 0.32, 1) + fuss(7.4, 2.2, 2, 0.4, 0.26, 1);
      s += fuss(-10.3, 5.3, 3, 0.44, 0.34, 0) + fuss(8.0, 2.4, 3, 0.4, 0.27, 0);
      /* ---------- Leib ---------- */
      const lichtW = T.lg("mw", [[0, W1], [0.5, "#efebe2"], [0.74, W2], [0.86, W3], [0.95, "#c4bcae"], [1, "#cfc8bb"]]);
      s += `<g filter="${V("leib", 2.4, 5, 0.32)}">` + teil(T, "#" + leibId, lichtW, {
        innen:
          /* Platten mit verzahnten Rändern; Rot −10 % Sättigung, Helligkeit folgt der Wölbung */
          `<g${zottel(T, "2.6 1.2", 0.4)}>` + form(T, rot, T.lg("mr", [[0, "#be7038"], [0.5, "#a85e2a"], [1, "#8a4a20"]])) + form(T, schwarzH, T.lg("mb", [[0, "#24221f"], [1, "#0c0b0a"]], 0, 0, 1, 0.3)) + form(T, schwarzK, T.lg("mb2", [[0, "#22201e"], [1, "#0c0b0a"]])) + "</g>" +
          /* drei Formen: Hinterteil-Kugel (Licht oben links, Kernschatten unten rechts), Schulterwölbung, Backe; Oberschenkel-Falte; Kehlfalte */
          weichform(T, [[-12.4, -8], [-10.6, -10.8], [-7, -11.8], [-5, -10], [-7.6, -7.6], [-11, -6.4]], "#ffffff", 0.22, 0.9) +
          weichform(T, [[-12.2, -6.6], [-8.2, -6.6], [-5.4, -4.4], [-6.4, -1.4], [-10.6, -1.6], [-12.4, -3.6]], "#ffffff", 0.12, 0.6) +
          weichform(T, [[-6.2, -5.6], [-5.2, -3.6], [-5.8, -1.4], [-6.8, -1.6], [-6.6, -4]], TIEF, 0.16, 0.35) +
          weichform(T, [[5.6, -6.4], [8.6, -5.8], [9.6, -3.4], [7.6, -1.6], [5.4, -2.6]], "#ffffff", 0.14, 0.45) +
          weichform(T, [[9.6, -2.8], [11.0, -2.9], [10.6, -1.9], [9.6, -1.7]], TIEF, 0.3, 0.2) +
          /* Backe als ovale Masse (Lichtkante oben, weicher Kernschatten unten), Schatten unter dem Kiefer */
          weichform(T, [[6.0, -6.2], [9.0, -6.6], [10.4, -5.2], [9.2, -4.4], [6.6, -4.6]], "#5a6070", 0.35, 0.35) +
          weichform(T, [[5.6, -3.8], [9.6, -3.6], [11.2, -3.0], [9.8, -2.4], [6.4, -2.6]], "#000000", 0.35, 0.35) +
          weichform(T, [[10.4, -9.4], [11.8, -7.6], [12.3, -6.0], [11.4, -6.4], [10.6, -8.2]], "#ffffff", 0.35, 0.3) +
          /* Glanz auf Schwarz als Bogen entlang der Wölbung */
          `<path d="M-12.5 -6.4Q-11.6 -10.4 -8 -11.8M5.6 -11.9Q8.8 -11.2 10.4 -9.2" fill="none" stroke="#4d5058" stroke-width=".7" stroke-opacity=".32" stroke-linecap="round" filter="${weich(T, 0.3)}"/>` +
          schlag(T, ohrId, 0.25, 0.3, 0.2, TIEF, 0.3) +
          /* Fell je Platte in Strähnen */
          fell(T, leib, FW, { n: 150, flow, licht: lic, hell: 1.1, mittel: 0, wo: (x, y) => platte(x, y) === 0 && x < 9.4 }) +
          fell(T, leib, FR, { n: 75, flow, licht: lic, hell: 1, mittel: 0, wo: (x, y) => platte(x, y) === 1 }) +
          fell(T, leib, FB, { n: 120, flow, licht: lic, hell: 0.8, mittel: 0, wo: (x, y) => platte(x, y) === 2 && x < 4.6 }) +
          fell(T, leib, FBk, { n: 120, flow, licht: lic, hell: 0.6, mittel: 0, wo: (x, y) => platte(x, y) === 2 && x >= 4.6 }) +
          fell(T, leib, FWk, { n: 60, flow, licht: lic, hell: 0.8, mittel: 0, wo: (x, y) => platte(x, y) === 0 && x >= 9.4 }) +
          /* Haare der vorderen Platte liegen über der hinteren */
          saum(T, rot, SP, { abstand: 0.16, flow: () => 186, licht: () => 0.6, wo: (x, y) => x < -2 && y < -0.8 }) +
          saum(T, schwarzK, SPb, { abstand: 0.14, flow: () => 186, licht: () => 0.3, wo: (x, y) => x < 6 && y < -1.5 && T.inPoly(x, y, leib) }),
        /* Fellsaum: alle 0,15–0,25 cm eine Haarspitze in Flussrichtung (keine Querstriche) */
        ueber: saum(T, leib, SW, { abstand: 0.17, flow, licht: lic, wo: (x, y) => platte(x, y) === 0 && y < -0.35 && x < 11.6 }) +
          saum(T, leib, SR, { abstand: 0.17, flow, licht: lic, wo: (x, y) => platte(x, y) === 1 }) +
          saum(T, leib, SB, { abstand: 0.15, flow, licht: lic, wo: (x, y) => platte(x, y) === 2 && y < -0.35 }),
      }) + "</g>";
      /* ---------- Rosenohr: Außenseite dunkelgrau mit feinen Härchen, durchscheinender Rand, Umschlag als konkave Mulde ---------- */
      s += `<g filter="${V("ohr", 0.3, 4, 0.35)}">` + teil(T, "#" + ohrId, "#3b3534", {
        innen: `<use href="#${ohrId}" fill="none" stroke="#a07e78" stroke-width=".24" stroke-opacity=".75"/>` +
          /* Umschlag: nach vorn unten gekippte Mulde, Faltkante */
          form(T, [[5.6, -12.95], [6.15, -13.1], [6.8, -12.8], [7.15, -12.2], [7.0, -11.6], [6.6, -11.9], [6.1, -12.3]], T.lg("mohri", [[0, "#8c6f6c"], [1, "#5a4644"]], 0, 0, 1, 1)) +
          (T.fein ? `<path d="M4.6 -11.3q.8 -.5 1.6 -.4M4.7 -11.8q.6 -.3 1.3 -.3" fill="none" stroke="#6a5652" stroke-width=".03" opacity=".5"/>` : ""),
        ueber: `<path d="M4.5 -12.5Q5.2 -13.2 6.1 -13.12Q6.8 -12.95 7.12 -12.3" fill="none" stroke="#d8b8b0" stroke-width=".05" stroke-opacity=".7"/>` +
          `<path d="M6.1 -12.3Q6.6 -12.0 7.0 -11.6" fill="none" stroke="#2a2220" stroke-width=".05" stroke-opacity=".5"/>` +
          saum(T, ohr, SB, { abstand: 0.1, flow: () => 200, licht: () => 0.6, wo: (x, y) => x < 5.6 }),
      }) + "</g>";
      /* ---------- Nase und Mund ---------- */
      s += weichform(T, [[12.0, -5.55], [12.48, -5.45], [12.5, -4.9], [12.1, -4.85], [11.95, -5.2]], "#b89a94", 0.85, 0.06);
      s += `<path d="M12.45 -5.36Q12.15 -5.25 12.0 -4.96Q11.94 -4.84 11.84 -4.86" fill="none" stroke="#5a3c36" stroke-width=".07" stroke-linecap="round"/>`;
      s += mal(T, 0.03, `<ellipse cx="12.25" cy="-5.45" rx=".09" ry=".05" fill="#fff" opacity=".55"/>`);
      s += `<path d="M12.2 -4.85Q12.15 -4.3 11.95 -3.72" fill="none" stroke="#6a4a44" stroke-width=".035" stroke-linecap="round"/><path d="M11.95 -3.72q-.15 .02 -.3 .12" fill="none" stroke="#6a4a44" stroke-width=".03" stroke-linecap="round" opacity=".7"/>`;
      s += weichform(T, [[11.25, -3.45], [11.75, -3.42], [11.7, -3.0], [11.3, -3.05]], "#ffffff", 0.6, 0.06);
      /* ---------- Auge: Fellring 4–6 px (oben dunkler, unten heller, braungrau), weiches Fensterlicht, kühler Umgebungsreflex unten ---------- */
      s += mal(T, 0.06, `<ellipse cx="7.7" cy="-7.45" rx=".72" ry=".68" fill="#3a302a" opacity=".9"/>`) + mal(T, 0.05, `<path d="M7.05 -7.2a.68 .6 0 0 0 1.3 0" fill="none" stroke="#6a5a4e" stroke-width=".1" opacity=".6"/>`);
      s += auge(T, 7.7, -7.5, 0.5, { ratio: 1.1, iris: "#2a1a10", iris2: "#120a06", mitte: "#2a1a10", pr: 0.7, lid: "#0a0706", lidw: 0.12, fasern: false, zweit: false });
      s += `<path d="M7.25 -7.2Q7.7 -6.95 8.15 -7.2" fill="none" stroke="#8a9aa8" stroke-width=".12" stroke-opacity=".22"/>`;
      /* ---------- Tasthaare: 4–5 versetzte Reihen, leicht gebogen; weiße mit dunklem Schatten-Strich ---------- */
      const th = tasthaar(T, [11.75, -4.75, 1.1, 1.1, 5, 3], -18, 34, 5, ["#f6f2ea", "#ece6da", "#1e1a18"], 0.05, 0.85, "#6a5a52");
      s += `<g transform="translate(.025 .045)" opacity=".18">${th.replace(/fill="#(f6f2ea|ece6da)"/g, 'fill="#000"')}</g>` + th;
      s += tasthaar(T, [7.9, -8.3, 0.3, 0.1, 1, 3], -120, -80, 1.8, ["#1e1a18"], 0.025, 0.8);
      return { svg: s, box: [-13.4, -13.1, 17.1, 0], fuesse: [-7.6, -6.9, 8.6, 9.2], kopf: [3.6, -13.4, 17.2, -1.5] };
    } },
  /* =================================================================
     HAMSTER — Goldhamster (Syrischer Hamster, Mesocricetus auratus), Wildfarbe
     RECHERCHE: MSD/Merck Vet Manual, Wikipedia „Golden hamster“: Kopf-Rumpf 15–18 cm, 110–140 g, Stummelschwanz im
     Fell verborgen; birnenförmig: höchster Punkt über der Hüfte, Hinterteil schwer, Brust schmaler, flache Nacken-
     senke hinter den Ohren, Bauchlinie weich durchhängend; runder Kopf mit gewölbter Stirnkuppe, stumpfe runde
     Schnauze (Nase auf ≈ 45 % der Kopfhöhe), gewölbtes Schnurrhaarpolster, kleines zurückgesetztes Kinn; große
     Backentaschen: Kopf unten breiter als oben, Unterkontur als voller Bogen; Augen groß, schwarz, rund (1,1 : 1);
     Ohren groß, rund, dünn, grau, am Rand gegen das Licht rosa durchscheinend, Innenmuschel dunkler mit Gegenleiste,
     unteres Viertel im Kopffell; rosa Nase als Kuppe mit Kommanasenlöchern, Y-Lippenspalte, gelbe Schneidezähne;
     Beine bis zu den Zehen cremeweiß behaart, nackt rosa nur Zehenkuppen und Ballen; Vorderpfote ≈ 1 cm mit 4
     schlanken, gespreizten Fingern, Hinterpfote ≈ 2 cm sohlengängig mit 5 Zehen, Ferse aufliegend, Krallen hell
     hornfarben; Fell dicht und weich: oben rotgold mit dunklen Haarspitzen (Agouti) und grauer Unterwolle, Bauch
     elfenbeinweiß, Grenze an der Flanke als Haarübergang; dunkle Wangenbinde als Sichel (vorn breit, hinten spitz)
     von der Wange zur Schulter, darüber ein cremeweißer Halbmond; Tasthaare lang, hell und graubraun.
     Runde 3: ganz neu – Birnenform, Kopf mit Stirnkuppe/stumpfer Schnauze/Backentasche, Pfoten aus Fell und Fingern,
     Volumen, Büschel-Fell, Zeichnung aus Haaren, Fellsaum, dünne Ohren.
     ================================================================= */
  { id: "hamster", de: "der Hamster", syl: "HAMS-ter", it: "il criceto", itSyl: "cri-CE-to", en: "hamster",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.2, hoehe: 0.093,
    zeichne(T) {
      T.dez = 2;
      const TIEF = "#3a2614", WEISS = "#f4eee4";
      const V = (n, w, t, u) => vol(T, n, { weich: w, tiefe: t, umgebung: u });
      const FG = fellSatz(T, "g", { L: 0.5, k: 7, w: 0.032, breit: 0.5, facher: 0.35, dunkel: "#3a2210", od: [0.2, 0.34], mittel: "#b06a2c", om: [0.14, 0.24], hell: "#ffe6bc", oh: [0.1, 0.24] });
      const FW = fellSatz(T, "w", { L: 0.45, k: 6, w: 0.03, breit: 0.5, facher: 0.35, dunkel: "#9a8e7c", od: [0.06, 0.12], hell: "#ffffff", oh: [0.25, 0.42] });
      const FD = fellSatz(T, "d", { L: 0.35, k: 6, w: 0.03, breit: 0.5, facher: 0.3, dunkel: "#2a2420", od: [0.4, 0.6] });
      const SG = randSatz(T, "g", { L: 0.3, k: 4, w: 0.025, winkel: 24, dunkel: "#a8662c", od: [0.9], hell: "#e2ae70", oh: [0.95] });
      const SW = randSatz(T, "w", { L: 0.32, k: 4, w: 0.025, winkel: 30, dunkel: "#d0c6b4", od: [0.9], hell: "#faf6ee", oh: [0.95] });
      const SD = randSatz(T, "d", { L: 0.18, k: 4, w: 0.02, winkel: 26, dunkel: "#3a3430", od: [0.85] });
      const SM = randSatz(T, "m", { L: 0.16, k: 4, w: 0.02, winkel: 26, dunkel: "#ece4d6", od: [0.85] });
      const SB = randSatz(T, "b", { L: 0.42, k: 5, w: 0.028, winkel: 55, dunkel: "#d8cfbe", od: [0.95] });
      /* ---------- Silhouette: Birne, Nackensenke, Stirnkuppe, stumpfe runde Schnauze, Polster, Kinn, Backentaschen-Bogen ---------- */
      const leib = [[-7.0, -0.9], [-8.3, -2.4], [-8.85, -4.6], [-8.4, -6.7], [-7.0, -8.1], [-5.0, -8.75], [-3.2, -8.7], [-1.2, -8.1], [0.6, -7.4], [1.8, -7.05], [2.8, -7.2],
        [4.0, -7.5], [5.2, -7.45], [6.2, -7.0], [7.0, -6.2], [7.45, -5.4], [7.65, -4.75], [7.62, -4.2], [7.45, -3.85], [7.3, -3.55], [7.36, -3.25], [7.08, -2.95], [6.82, -2.72],
        [6.3, -2.2], [5.3, -1.55], [4.2, -1.32], [3.0, -1.2], [1.4, -0.95], [-0.6, -0.72], [-2.8, -0.66], [-4.8, -0.72], [-6.0, -0.8]];
      const leibId = pfad(T, leib);
      /* Zonen: Grenze Gold/Weiß, Wangenbinde (Sichel), Halbmond */
      const grenze = (x) => -2.95 - 0.3 * Math.sin((x + 8.5) / 16 * Math.PI) + (x > 3.6 ? -(x - 3.6) * 0.42 : 0);
      const binde = [[5.25, -4.15], [4.5, -4.2], [3.7, -3.9], [3.0, -3.4], [2.3, -2.75], [3.0, -3.0], [3.75, -3.32], [4.5, -3.55], [5.2, -3.6]];
      const mond = [[5.4, -4.5], [4.3, -4.5], [3.2, -4.12], [2.4, -3.45], [2.0, -2.85], [2.4, -2.85], [3.05, -3.38], [3.85, -3.88], [4.6, -4.18], [5.35, -4.2]];
      const weiss = (x, y) => y > grenze(x) || (x > 6.6 && y > -3.9);
      const lf = feld(leib, 3.0, (x, y) => (y > -1.6 ? 0.1 : 0));
      const lic = (x, y) => (lf(x, y) + 0.3) / 1.05;
      const flow = (x, y) => {
        if (x > 5.6 && y > -4.6) return Math.atan2(y + 3.6, x - 7.3) * 57;               // Wange strahlenförmig vom Polster
        if (x > 4.6 && y < -4.6) return 192;                                              // Stirn
        if (x < -6) return 240 + 30 * klemm((-6 - x) / 2.6);                              // Hinterteil 240–270°
        if (y > grenze(x) - 0.2) return 205;                                              // Bauch nach hinten unten
        return 180 + 40 * klemm((y + 7.6) / 4.4);                                          // Rücken 180° → Flanke 220°
      };
      let s = "";
      /* ---------- Pfoten: weiß behaart bis zu den Zehen, Finger schlank und gespreizt, Kuppen und Ballen rosa ---------- */
      const finger = (x, n, l, w, gap, dunkel) => {
        let t = "";
        for (let i = 0; i < n; i++) {
          const zx = x + i * (w + gap), f = mix("#e7b3aa", "#000000", dunkel);
          t += form(T, [[zx, -0.22], [zx + l * 0.6, -0.24], [zx + l, -0.12], [zx + l * 0.9, -0.03], [zx + 0.02, -0.03]], f);
          t += `<path d="M${folge([zx + l * 0.45, -0.22])}v.18" stroke="#b98078" stroke-width=".02" opacity=".7"/>`;
          if (T.fein) t += kralle(T, zx + l * 0.92, -0.1, 0.1, 50, "#e8dcc8", 0.3);
        }
        return t;
      };
      const pfote = (x, len, n, l, w, gap, dunkel) => {
        const P = [[x, -0.08], [x - 0.12, -0.4], [x + 0.1, -0.85], [x + len * 0.55, -0.95], [x + len * 0.9, -0.55], [x + len, -0.2], [x + len, -0.06]];
        return `<g filter="${V("pf", 0.15, 4, 0.35)}">` + form(T, P, mix("#efe7da", "#000000", dunkel)) +
          form(T, [[x, -0.06], [x + len * 0.7, -0.06], [x + len * 0.7, -0.14], [x + 0.05, -0.16]], mix("#d9a098", "#000000", dunkel)) +
          finger(x + len - 0.05, n, l, w, gap, dunkel) + saum(T, P, SW, { abstand: 0.06, flow: () => 15, licht: () => (dunkel ? 0.2 : 0.8), wo: (xx, yy) => yy < -0.3 }) + "</g>";
      };
      s += pfote(-5.7, 1.4, 3, 0.3, 0.08, 0.04, 0.2) + pfote(3.6, 0.55, 3, 0.26, 0.07, 0.05, 0.2);
      s += pfote(-6.6, 1.6, 4, 0.32, 0.08, 0.035, 0) + pfote(3.2, 0.6, 4, 0.28, 0.07, 0.05, 0);
      /* ---------- Ohren (vor dem Leib: unteres Viertel liegt im Kopffell) ---------- */
      const ohrF = [[3.3, -7.0], [3.4, -8.1], [3.9, -8.85], [4.45, -8.85], [4.75, -8.1], [4.6, -7.1]];
      s += `<g filter="${V("ohr", 0.2, 4, 0.35)}">` + form(T, ohrF, "#75686a") + `<path d="${T.glatt(ohrF)}" fill="none" stroke="#a8847e" stroke-width=".07" stroke-opacity=".6"/></g>`;
      const ohr = [[2.2, -6.8], [2.0, -7.8], [2.35, -8.75], [3.05, -9.2], [3.85, -9.1], [4.35, -8.45], [4.4, -7.5], [4.0, -6.7]];
      s += `<g filter="${V("ohr", 0.2, 4, 0.35)}">` + teil(T, ohr, "#8a7a78", {
        innen: mal(T, 0.06, form(T, [[2.55, -7.4], [2.55, -8.35], [3.05, -8.8], [3.7, -8.7], [4.0, -8.1], [3.85, -7.35], [3.2, -7.05]], "#5e4e4c", ` opacity=".8"`)) +
          mal(T, 0.03, `<path d="M2.95 -7.35Q2.8 -8.15 3.3 -8.5" fill="none" stroke="#c8aaa4" stroke-width=".07" stroke-opacity=".55"/>`) +
          `<use href="#${pfad(T, ohr)}" fill="none" stroke="#6a5a58" stroke-width=".05"/>` +
          `<path d="M2.0 -7.6Q2.1 -8.75 3.05 -9.12Q4.0 -9.15 4.38 -8.3" fill="none" stroke="#c8a09a" stroke-width=".12" stroke-opacity=".65"/>` +
          `<path d="M3.95 -6.95q.15 -.25 .05 -.5" fill="none" stroke="#4a3a38" stroke-width=".04" opacity=".6"/>`,
        ueber: saum(T, ohr, SD, { abstand: 0.08, flow: () => 270, licht: () => 0.2, wo: (x, y) => y < -8.6 && x < 3 }),
      }) + "</g>";
      /* ---------- Leib mit Kopf ---------- */
      const goldW = T.lg("hfell", [[0, "#cf9050"], [0.3, "#c98a4a"], [0.55, "#a8703a"], [0.62, "#c9bfae"], [0.8, "#ece5d8"], [0.94, "#e2d8c6"], [1, "#e8dcc6"]]);
      const zone = form(T, [[-9, grenze(-9)], [-7, grenze(-7)], [-5, grenze(-5)], [-3, grenze(-3)], [-1, grenze(-1)], [1, grenze(1)], [2.6, grenze(2.6)], [3.6, grenze(3.6)], [5, grenze(5)], [6.2, grenze(6.2)], [6.6, -3.9], [7.4, -3.95], [8.2, -3.8], [8.2, 0.2], [-9, 0.2]], WEISS);
      s += `<g filter="${V("leib", 1.3, 5, 0.32)}">` + teil(T, "#" + leibId, goldW, {
        innen:
          `<g${zottel(T, "4 1.6", 0.18)}>${zone}</g>` +
          /* Halbmond und Wangenbinde (Sichel, vorn breit, hinten spitz) aus Haaren */
          `<g${zottel(T, "4 1.6", 0.12)}>` + form(T, mond, "#f3ece0") + form(T, binde, "#4a423e") + "</g>" +
          /* Volumen: Hinterteil-Kugel (Glanz oben), Oberschenkel nur über Licht, Schulter über der Vorderpfote heller;
             Okklusion: Ohransatz, Augenhöhlen-Ring, unter der Backentasche, Bauchfell über den Pfoten */
          weichform(T, [[-8.2, -6.4], [-6.6, -8.2], [-3.6, -8.5], [-2.6, -7.2], [-5.2, -6.2], [-7.6, -5.2]], "#fff2dc", 0.28, 0.5) +
          weichform(T, [[-6.6, -3.6], [-4.4, -3.8], [-3.6, -2.4], [-4.6, -1.2], [-6.4, -1.4]], "#ffffff", 0.18, 0.3) +
          weichform(T, [[1.6, -3.4], [3.4, -3.0], [3.6, -1.6], [2.0, -1.4]], "#ffffff", 0.2, 0.25) +
          weichform(T, [[1.9, -7.1], [3.0, -6.8], [4.4, -6.9], [3.4, -6.3], [2.2, -6.5]], TIEF, 0.35, 0.12) +
          `<ellipse cx="5.2" cy="-5.28" rx=".55" ry=".52" fill="#4a2e18" opacity=".35" filter="${weich(T, 0.1)}"/>` +
          weichform(T, [[3.6, -2.2], [6.0, -2.6], [6.6, -2.2], [5.2, -1.4], [3.6, -1.4]], "#5a4a3a", 0.18, 0.2) +
          weichform(T, [[-7.0, -1.2], [-4.6, -1.15], [-1, -1.0], [3, -1.5], [4.4, -1.4], [3, -0.9], [-1, -0.62], [-4.6, -0.6], [-6.6, -0.75]], "#5a4a3a", 0.22, 0.12) +
          /* Fell: Gold mit dunklen Spitzen (obere 40 % mehr), Weiß, Wangenbinde dunkel */
          fell(T, leib, FG, { n: 260, flow, licht: (x, y) => lic(x, y) * (y < -5.2 ? 0.7 : 1), hell: 0.9, mittel: 0.6, wo: (x, y) => !weiss(x, y) && !T.inPoly(x, y, mond) }) +
          fell(T, leib, FW, { n: 150, flow, licht: lic, hell: 1, mittel: 0, wo: (x, y) => weiss(x, y) || T.inPoly(x, y, mond) }) +
          fell(T, binde, FD, { n: 16, flow: () => 205, licht: () => 0.5, mittel: 0 }) +
          /* Haarübergang Gold über Weiß (nach hinten unten), Binde und Halbmond mit Haarrand */
          fell(T, leib, FG, { n: 60, flow: () => 214, licht: () => 0.5, hell: 0.6, mittel: 1, wo: (x, y) => Math.abs(y - grenze(x) + 0.12) < 0.22 && x < 6 }) +
          saum(T, binde, SD, { abstand: 0.07, flow: () => 205, licht: () => 0.2 }) + saum(T, mond, SM, { abstand: 0.09, flow: () => 205, licht: () => 0.8 }),
        ueber: saum(T, leib, SG, { abstand: 0.08, flow, licht: lic, wo: (x, y) => !weiss(x, y) && !(x > 7.3 && y > -4.6) }) +
          saum(T, leib, SW, { abstand: 0.07, flow, licht: lic, wo: (x, y) => weiss(x, y) && y < -1.0 && !(x > 7.2 && y < -3.4) }) +
          /* Bauchsaum: lang und hängend, über den Pfoten */
          saum(T, leib, SB, { abstand: 0.055, flow: () => 175, licht: () => 0.3, wo: (x, y) => y >= -1.0 && x < 5 }),
      }) + "</g>";
      /* ---------- Nase, Mund, Schneidezähne ---------- */
      s += weichform(T, [[7.3, -4.95], [7.62, -4.9], [7.72, -4.45], [7.6, -4.1], [7.32, -4.15], [7.2, -4.55]], T.lg("hnase", [[0, "#e6a9a0"], [1, "#b9776f"]]), 1, 0.015);
      s += `<path d="M7.69 -4.4q-.15 -.02 -.22 .14q-.02 .05 -.07 .06" fill="none" stroke="#5a2a28" stroke-width=".045" stroke-linecap="round"/>` + mal(T, 0.015, `<ellipse cx="7.46" cy="-4.78" rx=".06" ry=".035" fill="#fff" opacity=".7"/>`);
      s += `<path d="M7.52 -4.12Q7.52 -3.85 7.4 -3.62M7.4 -3.62Q7.33 -3.52 7.22 -3.5M7.4 -3.62Q7.45 -3.5 7.42 -3.42" fill="none" stroke="#9a6a62" stroke-width=".022" stroke-linecap="round" opacity=".75"/>`;
      s += form(T, [[7.16, -3.46], [7.24, -3.46], [7.23, -3.3], [7.17, -3.3]], "#e8d5a0") + form(T, [[7.26, -3.45], [7.33, -3.45], [7.31, -3.31], [7.25, -3.31]], "#dcc48c");
      s += `<path d="M7.1 -3.48q.15 -.04 .32 0" fill="none" stroke="#e6a9a0" stroke-width=".05"/>`;
      /* ---------- Auge: rund (1,1 : 1), einheitlich, unten feine Aufhellung, 1 px Lidrand, kurze Haare radial ---------- */
      s += auge(T, 5.2, -5.3, 0.38, { ratio: 1.08, iris: "#0d0805", iris2: "#0d0805", mitte: "#0d0805", pr: 0.6, lid: "#0a0604", lidw: 0.06, fasern: false, zweit: true, glanz: 1.1 });
      s += `<path d="M4.9 -5.02Q5.2 -4.88 5.5 -5.02" fill="none" stroke="#3a2a20" stroke-width=".06" opacity=".7"/>`;
      if (T.fein) { let d = ""; for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, bx = 5.2 + Math.cos(a) * 0.45, by = -5.3 + Math.sin(a) * 0.43, l = 0.1 + T.rnd() * 0.06; d += `M${folge([bx, by], 2)}l${folge([Math.cos(a - 0.5) * l, Math.sin(a - 0.5) * l], 2)}`; } s += `<path d="${d}" stroke="#c48a4c" stroke-width=".018" fill="none" opacity=".8"/>`; }
      /* ---------- Tasthaare: versetzte Reihen auf dem Polster, Fächer −25° … +40°, weiße mit dunkler Schattenkante ---------- */
      const th = tasthaar(T, [7.25, -3.95, 0.7, 0.55, 4, 4], -25, 40, 3.6, ["#f4efe8", "#f4efe8", "#5a4a40"], 0.025, 0.85, "#4a3a32");
      s += `<g transform="translate(.012 .02)" opacity=".3">${th.replace(/fill="#f4efe8"/g, 'fill="#2a2018"')}</g>` + th;
      return { svg: s, box: [-8.9, -9.3, 11.2, 0], fuesse: [-5.6, -4.8, 3.6, 3.9], kopf: [1.6, -9.4, 11.2, -1.2] };
    } },
  /* =================================================================
     MAUS — Hausmaus (Mus musculus)
     RECHERCHE: Wikipedia „House mouse“, Grinnell/Storer, Illinois DNR: Kopf-Rumpf (KRL) 7,5–10 cm, Schwanz etwa
     körperlang, fast nackt mit feinen Schuppenringen und kurzen Borsten, oben dunkler, hintere Hälfte liegt auf;
     Rumpftiefe ≈ ⅓ KRL, Bauch frei über dem Boden, Rücken über der Hüfte am höchsten, Keule als ovales Volumen auf der
     Flanke (≈ 27 % KRL lang), Unterschenkel schmal schräg nach hinten zur leicht angehobenen Ferse, Hinterfuß
     ≈ 20 % KRL, schmal, Zehen mit 2–3 Gliedern und winzigen Ballen; Vorderbein im Fell bis zum Handgelenk, Hand ≈ 8 %
     KRL mit 4 dünnen, leicht gespreizten Fingern und Daumenstummel; Kopf mit gewölbter Stirn- und Nasenlinie (über dem
     Auge ≥ 1 Augendurchmesser Fell), Nasenspiegel (≈ 3 % KRL) bildet selbst die Spitze, Komma-Nasenloch seitlich,
     Philtrum zur kurzen Mundspalte, rundes Schnurrhaarkissen, kleines zurückgesetztes Kinn (3–4 % KRL hinter der
     Nasenspitze), gelb-orange Schneidezähne halb unter der Lippe; Auge rund (Ø ≈ 5–6 % KRL), vorstehend, schwarz;
     Ohren groß (11–14 mm), rund, dünn, fast nackt, grau-rosa durchscheinend, unteres Viertel im Fell; Fell oben
     graubraun agouti mit ockerfarbenen Spitzen, Bauch heller grau bis gelblich-grau ohne scharfe Grenze; Wuchs vom
     Nasenspiegel radial nach hinten, um das Auge ringförmig, Flanke 190–200°, unten 210–230°, um die Keule 240–260°;
     Tasthaare bis ⅓ KRL lang, in 4–5 Reihen, dazu 2 über dem Auge und 1–2 an der Wange.
     Runde 3: Keule, Unterschenkel, Fuß und Hand neu, Nase als Spitze, Volumen, Büschel-Fell, Fellsaum, Schwanz liegt auf.
     ================================================================= */
  { id: "maus", de: "die Maus", syl: "MAUS", it: "il topo", itSyl: "TO-po", en: "mouse",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.21, hoehe: 0.047,
    zeichne(T) {
      T.dez = 2;
      const TIEF = "#1e1814";
      const V = (n, w, t, u) => vol(T, n, { weich: w, tiefe: t, umgebung: u });
      const FK = fellSatz(T, "k", { L: 0.28, k: 6, w: 0.016, breit: 0.5, facher: 0.35, dunkel: "#1e1814", od: [0.13, 0.22], mittel: "#a68e60", om: [0.12, 0.2], hell: "#e8dcc4", oh: [0.05, 0.13] });
      const FKo = fellSatz(T, "o", { L: 0.16, k: 5, w: 0.012, breit: 0.5, facher: 0.35, dunkel: "#1e1814", od: [0.12, 0.2], mittel: "#a68e60", om: [0.1, 0.18], hell: "#e8dcc4", oh: [0.05, 0.12] });
      const FB = fellSatz(T, "b", { L: 0.24, k: 6, w: 0.014, breit: 0.5, facher: 0.35, dunkel: "#5a5040", od: [0.1, 0.16], hell: "#f0e8d6", oh: [0.12, 0.24] });
      const RS = randSatz(T, "s", { L: 0.16, k: 4, w: 0.012, winkel: 24, dunkel: "#5e5040", od: [0.9], hell: "#9a8c78", oh: [0.95] });
      const RB = randSatz(T, "b", { L: 0.16, k: 4, w: 0.012, winkel: 34, dunkel: "#a8a08c", od: [0.9] });
      /* ---------- Silhouette: Rücken über der Hüfte am höchsten, gewölbte Stirn, Nasenspiegel als Spitze, Kinn zurückgesetzt ---------- */
      const leib = [[-3.5, -0.95], [-4.3, -1.45], [-4.66, -2.35], [-4.3, -3.2], [-3.2, -3.75], [-1.8, -3.88], [-0.2, -3.62], [1, -3.2], [1.65, -3.1], [2.3, -3.26],
        [3.1, -3.22], [3.75, -2.92], [4.25, -2.46], [4.56, -2.06], [4.72, -1.82], [4.86, -1.68], [4.82, -1.52], [4.64, -1.45], [4.52, -1.37], [4.44, -1.27], [4.47, -1.16],
        [4.1, -1.04], [3.4, -0.98], [2.6, -0.95], [2.0, -0.92], [1.2, -0.86], [0, -0.82], [-1.2, -0.86], [-2.2, -0.94]];
      const leibId = pfad(T, leib);
      const lf = feld(leib, 1.4, (x, y) => (y > -1.3 ? 0.12 : 0));
      const lic = (x, y) => (lf(x, y) + 0.3) / 1.05;
      const keule = (x, y) => ((x + 2.34) / 1.3) ** 2 + ((y + 2.1) / 0.88) ** 2 < 1;
      const flow = (x, y) => {
        if (Math.hypot(x - 3.5, y + 2.25) < 0.45) return Math.atan2(y + 2.25, x - 3.5) * 57 + 90;      // ringförmig um das Auge
        if (x > 2.4) return Math.atan2(y + 1.68, x - 4.86) * 57;                                         // vom Nasenspiegel radial nach hinten
        if (keule(x, y)) return 245 + 15 * klemm((y + 2.1) / 0.8);                                       // um die Keule
        return y > -1.7 ? 220 : 195;                                                                      // Flanke, untere Flanke
      };
      let s = "";
      /* ---------- Schwanz: Ansatz auf ≈ 40 % Rumpfhöhe, Bogen zum Boden, hintere Hälfte liegt auf ---------- */
      const sw = [0.44, 0.34, 0.27, 0.22, 0.17, 0.13, 0.09, 0.06];
      const sc = [[-4.2, -2.05], [-5.4, -1.8], [-6.6, -1.15], [-7.8, -0.5], [-9.0, -0.18], [-10.4, -0.12], [-11.8, -0.1], [-13.2, -0.09]].map((p, i) => [p[0], Math.min(p[1], -sw[i] / 2 - 0.01)]);
      const schw = schlauch(sc, sw, true);
      let ringe = "";
      if (T.fein) for (let i = 2; i < 150; i++) {
        const k = abschnitt(sc, sw.map((w) => w * 1.1), i / 150, i / 150 + 0.001, 1), a = k[0], b = k[k.length - 1];
        ringe += `M${folge(a)}Q${folge([(a[0] + b[0]) / 2 - 0.03, (a[1] + b[1]) / 2, b[0], b[1]])}`;
      }
      s += `<g filter="${V("schw", 0.06, 4, 0.35)}">` + teil(T, schw, T.lg("mschw", [[0, "#6e6058"], [0.55, "#9c887c"], [1, "#b8a49a"]], 0, 0, 0, 1), {
        innen: (ringe ? `<path d="${ringe}" fill="none" stroke="#4a3a32" stroke-width=".01" stroke-opacity=".2"/>` : "") + schlag(T, leibId, 0.05, 0.1, 0.08, TIEF, 0.4),
        ueber: randhaar(T, schw, { n: 70, spitz: 0.006, L: 0.07, flow: () => 180, ab: 0.6, eimer: [["#6a5a50", 0, 0.5, 0, "s"]], wahl: () => 0, szene: 0 }),
      }) + "</g>";
      /* ---------- Beine ---------- */
      /* Zehen mit 2–3 Gliedern (Gelenkkerben), winzige Ballen, Krallen #bdb3a8 */
      const zehen = (x, y, n, l, f, k = 0) => {
        let t = "";
        for (let i = 0; i < n; i++) {
          const zx = x + i * 0.07, zy = y + i * 0.012, ang = 0.05 + i * 0.08;
          const P = (u, v) => [zx + Math.cos(ang) * u - Math.sin(ang) * v, zy + Math.sin(ang) * u + Math.cos(ang) * v];
          t += form(T, [P(0, -0.045), P(l * 0.5, -0.04), P(l, -0.015), P(l * 0.98, 0.02), P(l * 0.5, 0.035), P(0, 0.04)], f);
          if (T.fein) t += `<path d="M${folge(P(l * 0.35, -0.04), 3)}l.004 .06M${folge(P(l * 0.68, -0.035), 3)}l.004 .05" stroke="#6a5450" stroke-width=".008" opacity=".5"/>` + kralle(T, P(l, 0)[0], P(l, 0)[1] + 0.005, 0.07, 35, "#bdb3a8", 0.3).replace('fill="#bdb3a8"', 'fill="#bdb3a8" fill-opacity=".7"');
        }
        return t;
      };
      /* ferne Beine: 30 % dunkler, teilweise verdeckt, versetzt */
      const hlauf = [[-1.95, -1.35], [-1.55, -1.2], [-2.3, -0.58], [-2.42, -0.36], [-1.75, -0.28], [-1.2, -0.2], [-0.95, -0.1], [-1.05, -0.02], [-2.68, -0.02], [-2.86, -0.24], [-2.72, -0.48], [-2.25, -1.1]];
      const vlauf = [[2.0, -1.1], [2.38, -1.05], [2.4, -0.45], [2.55, -0.28], [2.85, -0.16], [2.8, -0.05], [2.25, -0.04], [2.12, -0.3], [2.05, -0.6]];
      s += `<g filter="${V("bein", 0.06, 4, 0.35)}">` + form(T, schieb(hlauf, 0.3, 0), "#6e605a") + zehen(-1.0 + 0.3, -0.1, 3, 0.22, "#7e6c66") +
        form(T, schieb(vlauf, -0.28, 0), "#6e605a") + zehen(2.65 - 0.28, -0.1, 3, 0.15, "#7e6c66") + "</g>";
      /* ---------- Ohren hinter dem Kopf: fernes mit feiner Behaarung, nahes rund und durchscheinend ---------- */
      const fohr = [[2.25, -3.1], [2.3, -3.85], [2.65, -4.3], [3.1, -4.35], [3.35, -3.9], [3.2, -3.2]];
      s += `<g filter="${V("ohr", 0.05, 4, 0.35)}">` + teil(T, fohr, "#5e5048", { innen: fell(T, fohr, FKo, { n: 14, flow: () => 280, licht: () => 0.4, mittel: 0 }), ueber: saum(T, fohr, RS, { abstand: 0.04, flow: () => 280, licht: () => 0.3 }) }) + "</g>";
      const ohr = [[1.3, -2.9], [1.15, -3.55], [1.35, -4.15], [1.85, -4.48], [2.45, -4.45], [2.82, -4.05], [2.88, -3.45], [2.6, -2.95]];
      s += `<g filter="${V("ohr", 0.05, 4, 0.35)}">` + teil(T, ohr, T.lg("mohr", [[0, "#6e5c56"], [0.35, "#b89a92"], [1, "#a8887e"]], 0, 0, 1, 1), {
        innen: mal(T, 0.06, form(T, [[1.55, -3.15], [1.45, -3.7], [1.75, -4.2], [2.3, -4.3], [2.6, -3.95], [2.55, -3.35], [2.1, -3.05]], "#7e6660", ` opacity=".45"`) +
            `<ellipse cx="1.75" cy="-4.15" rx=".45" ry=".25" fill="#e0b0a8" opacity=".4"/>`) +
          (T.fein ? `<path d="M2.1 -3.2Q1.9 -3.7 2 -4.1M2 -3.8Q1.75 -3.95 1.6 -4.1M2.05 -3.55Q2.35 -3.8 2.45 -4.1" fill="none" stroke="#9a6a62" stroke-width=".012" opacity=".3"/>` : "") +
          `<path d="M2.6 -3.1Q2.35 -3.35 2.45 -3.65" fill="none" stroke="#5a4440" stroke-width=".04" opacity=".5"/>`,
        ueber: saum(T, ohr, randSatz(T, "o", { L: 0.05, k: 3, w: 0.006, winkel: 40, dunkel: "#8a7470", od: [0.7] }), { abstand: 0.03, flow: () => 270, licht: () => 0.3 }),
      }) + "</g>";
      /* ---------- Leib mit Kopf ---------- */
      s += `<g filter="${V("leib", 0.6, 5, 0.32)}">` + teil(T, "#" + leibId, T.lg("mfell", [[0, "#625444"], [0.4, "#76685a"], [0.6, "#8a7e6a"], [0.72, "#7a6e5c"], [0.86, "#aaa088"], [1, "#bcb098"]]), {
        innen:
          /* Keule als Oval: Glanz oben, Kernschatten unten hinten, Schattensichel vorn; Schulter; Kopf; Polster als Wölbung */
          weichform(T, [[-3.5, -2.5], [-2.8, -2.95], [-1.7, -2.8], [-1.5, -2.3], [-2.4, -2.2], [-3.2, -2.1]], "#d8ccb4", 0.3, 0.12) +
          weichform(T, [[-3.6, -1.6], [-2.4, -1.25], [-1.4, -1.5], [-1.2, -1.2], [-2.4, -1.0], [-3.5, -1.2]], TIEF, 0.3, 0.1) +
          weichform(T, [[-1.1, -2.6], [-0.95, -1.9], [-1.15, -1.25], [-1.4, -1.6], [-1.35, -2.3]], TIEF, 0.22, 0.08) +
          weichform(T, [[2.6, -3.0], [3.6, -3.05], [4.2, -2.5], [3.4, -2.6], [2.8, -2.7]], "#d8ccb4", 0.3, 0.08) +
          weichform(T, [[4.12, -1.82], [4.6, -1.8], [4.62, -1.55], [4.2, -1.5]], "#e8dcc6", 0.5, 0.04) +
          weichform(T, [[4.1, -1.48], [4.55, -1.42], [4.4, -1.3], [4.1, -1.34]], TIEF, 0.35, 0.03) +
          /* Okklusion: unter Kinn und Kehle, um den Ohransatz, zwischen Keule und Bauch, hinter dem Vorderbein */
          weichform(T, [[3.0, -1.3], [4.4, -1.25], [4.2, -1.02], [3.0, -0.98]], TIEF, 0.35, 0.06) +
          weichform(T, [[1.2, -3.1], [2.9, -3.15], [2.7, -2.85], [1.4, -2.85]], TIEF, 0.3, 0.07) +
          weichform(T, [[-1.6, -1.35], [-0.9, -1.25], [-1.0, -0.88], [-1.8, -0.95]], TIEF, 0.3, 0.07) +
          weichform(T, [[1.75, -1.3], [2.05, -1.25], [2.0, -0.92], [1.75, -0.95]], TIEF, 0.3, 0.05) +
          /* Fell */
          fell(T, leib, FK, { n: 190, flow, licht: lic, hell: 0.8, mittel: 0.7, wo: (x, y) => x < 2.6 && y < -1.5 }) +
          fell(T, leib, FB, { n: 60, flow, licht: lic, hell: 1, mittel: 0, wo: (x, y) => x < 3 && y >= -1.5 }) +
          fell(T, leib, FKo, { n: 130, flow, licht: lic, hell: 0.8, mittel: 0.7, wo: (x, y) => x >= 2.6 && x < 4.7 }),
        ueber: saum(T, leib, RS, { abstand: 0.06, flow, licht: lic, wo: (x, y) => y < -1.4 && x < 4.6 }) +
          saum(T, leib, RB, { abstand: 0.05, flow, licht: () => 0.3, wo: (x, y) => y >= -1.4 && x < 4.4 }),
      }) + "</g>";
      /* naher Hinterlauf (Unterschenkel schmal, Ferse leicht angehoben, Fuß 20 % KRL) und Vorderlauf (Hand mit 4 Fingern) */
      s += `<g filter="${V("bein", 0.06, 4, 0.35)}">` + teil(T, hlauf, T.lg("mfuss", [[0, "#7e7062"], [0.5, "#b0a096"], [1, "#a8948c"]]), {
        innen: fell(T, [[-1.95, -1.35], [-1.55, -1.2], [-2.3, -0.58], [-2.72, -0.48], [-2.25, -1.1]], FKo, { n: 10, flow: () => 120, licht: () => 0.5, mittel: 0 }),
        ueber: saum(T, [[-1.95, -1.35], [-1.55, -1.2], [-2.3, -0.58], [-2.72, -0.48], [-2.25, -1.1]], RS, { abstand: 0.04, flow: () => 120, licht: () => 0.5 }),
      }) + zehen(-1.05, -0.1, 4, 0.24, "#b8a49c") + "</g>";
      s += `<g filter="${V("bein", 0.06, 4, 0.35)}">` + teil(T, vlauf, T.lg("mvl", [[0, "#8a7e6a"], [0.55, "#a89a8c"], [1, "#b8a49c"]]), {
        ueber: saum(T, [[2.0, -1.1], [2.38, -1.05], [2.42, -0.55], [2.12, -0.5]], RB, { abstand: 0.04, flow: () => 95, licht: () => 0.5 }),
      }) + zehen(2.62, -0.1, 4, 0.16, "#b8a49c") + "</g>";
      /* Nasenspiegel bildet die Spitze (Fell endet davor weich), feuchtes Licht oben, Komma-Nasenloch seitlich, Philtrum, Mund, Schneidezähne */
      s += weichform(T, [[4.66, -1.86], [4.86, -1.72], [4.88, -1.56], [4.74, -1.47], [4.6, -1.55], [4.6, -1.74]], "#c09088", 1, 0.012);
      s += mal(T, 0.008, `<ellipse cx="4.75" cy="-1.79" rx=".045" ry=".022" fill="#e6c0b8"/>`);
      s += `<path d="M4.84 -1.6q-.06 -.01 -.08 .04q-.01 .03 -.03 .03" fill="none" stroke="#5a3430" stroke-width=".016" stroke-linecap="round"/><path d="M4.74 -1.5L4.62 -1.36Q4.55 -1.3 4.46 -1.3" fill="none" stroke="#6a4a44" stroke-width=".01"/>`;
      s += form(T, [[4.47, -1.29], [4.505, -1.29], [4.5, -1.22], [4.47, -1.22]], "#d9a24a") + form(T, [[4.51, -1.29], [4.54, -1.29], [4.535, -1.23], [4.51, -1.23]], "#c8902e") +
        `<path d="M4.45 -1.3h.11" stroke="#6a4a44" stroke-width=".01"/>`;
      /* Auge: rund (1 : 0,9), Ø ≈ 5,7 % KRL, oben tiefschwarz, unten Umgebungsreflex, weiches Fensterlicht, Schlagschatten unter dem Oberlid */
      s += auge(T, 3.5, -2.25, 0.25, { ratio: 1.08, iris: "#3e3229", iris2: "#2a2018", mitte: "#3e3229", pr: 0.62, lid: "#0a0604", lidw: 0.1, fasern: false, zweit: true, glanz: 0.85 });
      s += `<path d="M3.27 -2.12Q3.5 -1.98 3.73 -2.12" fill="none" stroke="#8a8078" stroke-width=".02" opacity=".5"/>`;
      /* Tasthaare: 4–5 versetzte Reihen auf dem Polster, beginnen hinter der Nase; 2 über dem Auge, 1–2 an der Wange */
      s += tasthaar(T, [4.4, -1.7, 0.38, 0.28, 5, 4], -22, 30, 2.9, ["#2a221c", "#3e342c", "#8a7e70"], 0.02, 0.8, "#2a221c");
      s += tasthaar(T, [3.55, -2.6, 0.1, 0.05, 1, 2], -115, -90, 0.8, ["#2a221c"], 0.01, 0.7) + tasthaar(T, [3.2, -1.6, 0.1, 0.05, 1, 2], 160, 175, 0.6, ["#2a221c"], 0.008, 0.6);
      return { svg: s, box: [-13.4, -4.7, 7.6, 0], fuesse: [-2.0, -1.6, 2.5, 2.7], kopf: [0.8, -4.8, 7.6, -0.6] };
    } },
  /* =================================================================
     WELLENSITTICH — Wildfarbe grün (Hahn), am Boden
     RECHERCHE: Wikipedia, birdsinbackyards, Omlet, birds-online: Gesamtlänge ≈ 18 cm, Schwanz 8–9 cm (≈ 45–50 %);
     am Boden (Futtersuche) mit flach geneigtem Körper; der Schwanz setzt die Körperlinie fort (≤ 10° Knick) und wird
     knapp über dem Boden getragen; Stirn, Gesicht und Kehle gelb („Maske“), Wangenfleck blauviolett, länglich entlang
     der Gesichtskante, je Kehlseite drei schwarze Punkte; Hinterkopf, Nacken und Mantel gelb mit schwarzer Wellen-
     zeichnung (vorn fein und eng, nach hinten kräftiger), die am Nacken in kleine Schuppen übergeht; Flügeldecken
     schwarz mit gelbem Saum als Sichel am Federende (Dachziegel parallel zur Vorderkante: kleine, mittlere, große
     Decken), Schirmfedern breit gelbgrün gesäumt, Handschwingen einzeln gestuft, grünlich-schwarz mit grünem Außen-
     saum, Spitzen kreuzen über dem Schwanz (25–35 % seiner Länge); Brust, Bauch, Bürzel und Unterschwanzdecken grün;
     Wachshaut beim Hahn königsblau, matt, in die Kopfrundung eingebettet, von Stirnfedern überlappt; Schnabel kurz,
     stark gebogen, zur Hälfte von Bartfedern verdeckt; Auge: schmaler weißgrauer Irisring, große Pupille, dunkler
     matter Lidrand; Schwanz kobaltblau, mittleres Paar am längsten und spitz, seitliche gestuft je 8–10 % kürzer,
     äußere mit gelbem Streif; Lauf kurz, blaugrau, genetzt, Zehen zygodaktyl mit Querschildern und Ballen, Krallen
     stark gebogen (≈ 120°), dunkel.
     Runde 3: Haltung neu (Körperachse 20°, Schwanz 8°, Spitze über dem Boden), Flügel aus einzelnen Federn,
     Kopfwellen gestaffelt, Wangenfleck gefiedert, Wachshaut eingebettet, Schnabel kürzer, Füße mit Schildern.
     ================================================================= */
  { id: "wellensittich", de: "der Wellensittich", syl: "WEL-len-sit-tich", it: "il pappagallino", itSyl: "pap-pa-gal-LI-no", en: "budgie",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.175, hoehe: 0.0745,
    zeichne(T) {
      T.dez = 2;
      const SW = "#1c1f1c", WELLE = "#2a2a20";
      const V = (n, w, t, u) => vol(T, n, { weich: w, tiefe: t, umgebung: u });
      /* Körperachse 30° (Kopf vorn oben), Koordinaten P(s, t): s entlang der Achse, t quer (+ = Bauchseite) */
      const ang = 30 * Math.PI / 180, ux = Math.cos(ang), uy = -Math.sin(ang), nx = -uy, ny = ux, C = [0.5, -3.0];
      const P = (s, t) => [C[0] + ux * s + nx * t, C[1] + uy * s + ny * t];
      const ss = [-3.65, -3.0, -2.2, -1.2, 0, 1.2, 2.3, 3.2, 3.7];
      const tb = [0.55, 0.85, 1.15, 1.35, 1.42, 1.42, 1.38, 1.3, 1.22], tv = [0.4, 0.8, 1.3, 1.7, 1.86, 1.78, 1.45, 1.05, 0.9];
      const Hc = P(4.55, -0.78), R = 1.32;
      const H = (a, r = 1) => [Hc[0] + Math.cos(a * Math.PI / 180) * R * r, Hc[1] + Math.sin(a * Math.PI / 180) * R * r];
      const leib = ss.map((s, i) => P(s, -tb[i])).concat([P(4.1, -1.38)], [214, 240, 266, 292, 316, 338].map((a) => H(a)), [H(0, 1.02), H(24, 1.0), H(48, 0.98), H(70, 0.95)],
        ss.slice().reverse().map((s, i) => P(s, tv[ss.length - 1 - i])));
      const leibId = pfad(T, leib);
      /* Kopf und Nacken gelb (gewellt); Maske = ungezeichnetes Gesicht (Stirn, Wange, Kehle) */
      const gelbK = [H(150, 1.05), H(185, 1.06), H(220, 1.06), H(255, 1.06), H(290, 1.06), H(325, 1.06), H(0, 1.06), H(35, 1.06), H(70, 1.0), [Hc[0] - 0.1, Hc[1] + 1.3], P(3.2, 0.9), P(3.0, 0), P(3.1, -1.1)];
      /* Maske (gelb): Stirn, Gesicht, Kehle */
      const maske = [H(275, 1.05), H(300, 1.05), H(325, 1.05), H(350, 1.05), H(15, 1.05), H(48, 1.05), H(80, 1.0), [Hc[0] - 0.2, Hc[1] + 1.25], [Hc[0] - 0.3, Hc[1] + 0.8], [Hc[0] - 0.05, Hc[1] + 0.25], [Hc[0] + 0.05, Hc[1] - 0.45], [Hc[0] + 0.0, Hc[1] - 1.0]];
      /* Flügel (in s,t): Vorderkante am Rücken, Handschwingen-Spitzen kreuzen über dem Schwanz */
      const flST = [[3.0, -0.95], [2.2, -1.28], [1.0, -1.42], [-0.4, -1.38], [-1.8, -1.18], [-3.0, -0.92], [-4.2, -0.78], [-5.4, -0.64], [-6.05, -0.52], [-5.7, -0.32], [-4.5, -0.12], [-3.2, 0.12], [-1.6, 0.42], [0.2, 0.58], [1.6, 0.48], [2.6, 0.2], [3.15, -0.3]];
      const fl = flST.map(([a, b]) => P(a, b));
      const flId = pfad(T, fl);
      let s = "";
      /* ---------- Schwanz: 8° (≤ 10° zur Körperachse), mittleres Paar am längsten und spitz, seitliche gestuft, äußere mit gelbem Streif ---------- */
      const ta = 5 * Math.PI / 180, tx = -Math.cos(ta), ty = Math.sin(ta), B = P(-3.55, -0.05);
      const feder = (L, w, dv, f, gelb) => {
        const qx = -ty, qy = tx, b = [B[0] + qx * dv, B[1] + qy * dv];
        const m = [b, [b[0] + tx * L * 0.35, b[1] + ty * L * 0.35], [b[0] + tx * L * 0.78 + qx * dv * 0.12, b[1] + ty * L * 0.78 + qy * dv * 0.12], [b[0] + tx * L + qx * dv * 0.18, b[1] + ty * L + qy * dv * 0.18]];
        const k = schlauch(m, [w, w, w * 0.75, 0.03]);
        return form(T, k, f) + (gelb ? form(T, abschnitt(m, [w * 0.28, w * 0.32, w * 0.25, 0.02], 0.25, 0.75, 3), "#e8d050", ` opacity=".6"`) : "") +
          (T.fein ? `<path d="M${folge(m[0])}L${folge(m[2])}" stroke="#a8c8f0" stroke-width=".022" opacity=".2"/>` + form(T, abschnitt(m, [w * 0.18, w * 0.18, w * 0.12, 0.01], 0.05, 0.9, 3).map(([x, y]) => [x - qx * w * 0.22, y - qy * w * 0.22]), "#5a8ad8", ` opacity=".18"`) : "");
      };
      s += `<g filter="${V("schw", 0.22, 4, 0.35)}">` + feder(6.9, 0.62, 0.3, "#1a3070", true) + feder(7.5, 0.66, 0.2, "#1c3678") + feder(8.1, 0.7, 0.1, "#1e3d84") +
        feder(8.75, 0.72, -0.05, T.lg("wmitte", [[0, "#1f3f8a"], [1, "#2a5aa8"]], 0, 0, 1, 0)) + feder(8.6, 0.68, 0.04, "#21468f") +
        /* grüne Unterschwanzdecken als Keil zur Schwanzbasis */
        form(T, [P(-2.6, 0.95), P(-3.3, 0.55), [B[0] - 1.2, B[1] + 0.32], [B[0] - 0.6, B[1] + 0.05], P(-3.4, 0.1)], "#3f8a2a") + "</g>";
      /* ---------- Beine (Lauf kurz, oben vom Bauchgefieder bedeckt) ---------- */
      const fuss = (x, f, d, nah) => {
        const k = (a) => mix(f, "#000000", a);
        let t = form(T, [[x - 0.17, -1.3], [x + 0.13, -1.3], [x + 0.14, -0.55], [x + 0.18, -0.36], [x - 0.12, -0.34], [x - 0.15, -0.6]], f);
        if (T.fein) {
          /* Netzschuppen am Lauf */
          let d2 = "";
          for (let i = 0; i < 4; i++) d2 += `M${folge([x - 0.15, -1.15 + i * 0.18], 3)}l.28 .06M${folge([x - 0.02, -1.12 + i * 0.18], 3)}l-.06 .16`;
          t += `<path d="${d2}" stroke="${d}" stroke-width=".012" opacity=".45" fill="none"/>`;
        }
        for (const [dx, l, ri] of [[1, 1.05, 1], [1, 0.8, 1], [-1, 0.62, -1], [-1, 0.45, -1]]) {
          const ex = x + dx * l, ey = -0.12;
          const toe = [[x + 0.02, -0.46], [x + dx * l * 0.5, -0.28], [ex, ey]];
          t += T.linie(toe, f, 0.17) + (T.fein ? T.linie(toe.map(([a, b]) => [a, b + 0.05]), k(0.2), 0.07, ` stroke-opacity=".7"`) : "");
          if (T.fein) t += `<circle cx="${zahl(x + dx * l * 0.5)}" cy="-.24" r=".1" fill="${f}"/><circle cx="${zahl(ex - dx * 0.08)}" cy="${zahl(ey - 0.02)}" r=".085" fill="${f}"/>`;
          if (T.fein) {
            t += `<path d="M${folge([x + dx * l * 0.3, -0.42])}v.12M${folge([x + dx * l * 0.68, -0.27])}v.12M${folge([x + dx * l * 0.85, -0.21])}v.11" stroke="${d}" stroke-width=".012" opacity=".45"/>`;
            t += kralle(T, ex + dx * 0.02, ey + 0.01, 0.22, ri > 0 ? 82 : 98, "#2a2a30", 0.5);
          }
        }
        return t;
      };
      s += fuss(0.85, "#8a92a6", "#4a5060", 0);
      /* ---------- Körper mit Kopf ---------- */
      /* Wellenzeichnung: vorn dünn und eng, nach hinten und unten kräftiger, Abstand ±15 %, vordere Enden gestaffelt und weich */
      const W = [];
      let rr = 0.45;
      for (let i = 0; i < 9; i++) {
        rr += (0.15 + i * 0.012) * (0.85 + T.rnd() * 0.3);
        const a0 = -100 + i * 4 - T.rnd() * 14, a1 = -205 - i * 4, pts = [];
        for (let j = 0; j <= 6; j++) { const t = a0 + (a1 - a0) * j / 6 + (T.rnd() - 0.5) * 5; pts.push([Hc[0] + 0.15 + Math.cos(t * Math.PI / 180) * rr * 1.04, Hc[1] + 0.02 + Math.sin(t * Math.PI / 180) * rr]); }
        const w0 = 0.028 + i * 0.008;
        W.push([pts, pts.map((p, j) => (j === 0 ? 0.004 : j === 6 ? 0.012 : w0 * (j < 2 ? 0.55 : 1) * (0.8 + T.rnd() * 0.4))), 0.06 + T.rnd() * 0.08, i % 3 === 1 ? 0.55 : 0.97]);
        if (i % 3 === 1) W.push([pts, pts.map((p, j) => (j === 0 ? 0.004 : j === 6 ? 0.012 : w0)), 0.62, 0.97]);
      }
      /* Mantel: kleine Schuppen (40–55 % der kleinen Decken) vom Nacken bis an den Flügel */
      let mantel = "";
      const reihenM = T.fein ? 6 : 0;
      for (let r = 0; r < reihenM; r++) for (let j = 0; j < 9; j++) {
        const [x, y] = P(4.0 - j * 0.17 - (r % 2) * 0.085, -1.25 + r * 0.17);
        if (!T.inPoly(x, y, leib) || T.inPoly(x, y, maske) || T.inPoly(x, y, fl)) continue;
        const w = 0.065 + r * 0.006;
        mantel += form(T, [[x - w, y - w], [x + w, y - w], [x + w * 0.9, y + w * 0.1], [x, y + w * 0.7], [x - w * 0.9, y + w * 0.1]], "#e6d058") + form(T, [[x - w * 0.85, y - w * 1.1], [x + w * 0.85, y - w * 1.1], [x + w * 0.75, y - w * 0.05], [x, y + w * 0.32], [x - w * 0.75, y - w * 0.05]], WELLE);
      }
      /* Brustgefieder: Bögen an der Kehle klein, zur Flanke größer, Reihen versetzt entlang der Körperwölbung, 3–5 % Kontrast */
      let brust = "";
      if (T.fein) for (let r = 0; r < 13; r++) for (let j = 0; j < 9; j++) {
        const sP = 3.3 - r * 0.52, tP = 1.7 - j * 0.33 + (r % 2) * 0.16, [x, y] = P(sP, tP), w = 0.07 + (1 - Math.max(0, sP) / 3.3) * 0.13;
        if (!T.inPoly(x, y, leib) || T.inPoly(x, y, fl) || T.inPoly(x, y, maske)) continue;
        brust += `M${folge([x - w, y - w * 0.3])}q${folge([w, w * 0.9, w * 2, 0])}`;
      }
      const lic = feld(leib, 1.4);
      s += `<g filter="${V("leib", 0.9, 5, 0.32)}">` + teil(T, "#" + leibId, T.lg("wkoerper", [[0, "#8ed05a"], [0.45, "#6cc23a"], [0.75, "#4c9e2c"], [1, "#3a7e22"]], 0, 0, 0.3, 1), {
        innen:
          form(T, gelbK, T.rg("wkopf", [[0, "#fbf08a"], [0.6, "#f2db4a"], [1, "#d8b832"]], 0.65, 0.3, 0.8)) +
          weichform(T, [[Hc[0] - 0.4, Hc[1] + 0.7], [Hc[0] + 0.5, Hc[1] + 0.95], [Hc[0] + 0.9, Hc[1] + 1.25], [Hc[0] - 0.2, Hc[1] + 1.3]], "#8a7a10", 0.3, 0.15) +
          `<g${zottel(T, "8 4", 0.035)}>` + zeichnung(T, W, WELLE, 0.92) + mantel + "</g>" +
          (brust ? `<path d="${brust}" fill="none" stroke="#2e6a1e" stroke-width=".026" stroke-opacity=".16"/><path d="${brust}" fill="none" stroke="#c8f090" stroke-width=".018" stroke-opacity=".13" transform="translate(0 -.035)"/>` : "") +
          /* Schatten unter der Flügelkante auf Grün und Gelb, Okklusion am Hals unter dem Kopf */
          `<use href="#${flId}" fill="#0e2a08" opacity=".5" transform="translate(.1 .18)" filter="${weich(T, 0.15)}"/>` +
          weichform(T, [P(3.3, 0.5), P(3.9, 0.3), P(3.8, 1.0), P(3.2, 1.0)], "#1e4a12", 0.25, 0.2),
        /* Kontur in Federspitzen aufgelöst */
        ueber: saum(T, leib, randSatz(T, "f", { L: 0.06, k: 2, w: 0.05, winkel: 14, dunkel: "#3e8a28", od: [0.9], hell: "#7cc848", oh: [0.9] }), { abstand: 0.08, flow: (x, y) => 200, licht: (x, y) => (lic(x, y) + 0.3) / 1.1, wo: (x, y) => !T.inPoly(x, y, maske) && y > -6.6 }) +
          saum(T, leib, randSatz(T, "y", { L: 0.055, k: 2, w: 0.045, winkel: 14, dunkel: "#e2c440", od: [0.9] }), { abstand: 0.08, flow: () => 200, licht: () => 0.3, wo: (x, y) => T.inPoly(x, y, maske) && x < Hc[0] + 0.9 }),
      }) + "</g>";
      /* ---------- Flügel: Handschwingen einzeln gestuft, Schirmfedern, Deckfedern als Dachziegel (Sichel nur am Ende) ---------- */
      let fw = "";
      /* Handschwingen (7): unter den Decken hervor, Spitzen je ≈ 7 % gestaffelt und rund, grüner Saum nur außen, Schaft heller */
      for (let i = 6; i >= 0; i -= T.fein ? 1 : 2) {
        const sT = -6.0 + i * 0.42, tT = -0.5 + i * 0.07, m = [P(-1.4 - i * 0.1, -0.2 + i * 0.05), P((-1.4 + sT) / 2, tT * 0.8 + 0.05), P(sT, tT)];
        const k = schlauch(m, [0.5, 0.48, 0.34], true);
        fw += form(T, k, i % 2 ? "#232823" : "#282d28") + T.linie(k.slice(Math.floor(k.length / 2)), "#5a9a3a", 0.05, ` stroke-opacity=".85"`) + T.linie(m, "#5e665c", 0.016, ` stroke-opacity=".5"`);
      }
      /* Schirmfedern (3) mit breitem gelbgrünem Saum */
      for (let i = 2; i >= 0; i--) {
        const m = [P(-1.2 - i * 0.35, -0.95 + i * 0.32), P(-2.2 - i * 0.35, -0.75 + i * 0.32), P(-3.0 - i * 0.3, -0.55 + i * 0.3)];
        fw += form(T, schlauch(m, [0.66, 0.6, 0.38], true), "#a0ac3e") + form(T, schlauch(m.map(([x, y]) => [x + 0.05, y - 0.1]), [0.5, 0.46, 0.26], true), SW);
      }
      /* Deckfedern: Reihen parallel zur Vorderkante; an der Schulter klein (55 %), mittlere 80 %, große 100 % und gestreckt (1,4 : 1);
         gelbe Sichel nur am unteren Federende (12–18 %), innen weich ins Schwarz */
      const reihen = T.fein ? 8 : 3;
      for (let r = reihen - 1; r >= 0; r--) {
        const t = r / (reihen - 1), gr = 0.55 + 0.45 * t, n = T.fein ? 9 - Math.floor(r / 2) : 3;
        for (let j = 0; j < n; j++) {
          const sP = 2.8 - (j + (r % 2) * 0.5) * (4.6 / n) - t * 0.6, tP = -1.25 + t * 1.45;
          const [x, y] = P(sP, tP);
          if (!T.inPoly(x, y, fl)) continue;
          const w = 0.2 * gr * (T.fein ? 1 : 1.6), h = w * (1 + 0.4 * t);
          const F = [[x - w, y - h], [x + w, y - h], [x + w * 0.95, y + h * 0.15], [x + w * 0.2, y + h * 0.8], [x - w * 0.6, y + h * 0.6]];
          fw += form(T, F, "#dcc850") + form(T, F.map(([px, py]) => [x + (px - x) * 0.92, y - h * 0.16 + (py - y) * 0.92]), SW);
        }
      }
      s += `<g filter="${V("fluegel", 0.45, 5, 0.32)}">` + teil(T, "#" + flId, SW, {
        innen: fw + weichform(T, [P(2.4, -1.2), P(0.6, -1.35), P(0.4, -0.9), P(2.2, -0.75)], "#4a5258", 0.3, 0.2),
      }) + "</g>";
      /* ---------- Gesicht ---------- */
      /* Wangenfleck: länglich entlang der Gesichtskante nach unten hinten (1,6 : 1), Rand in Federspitzen, irisierende Federstruktur */
      const wx = Hc[0] + 0.5, wy = Hc[1] + 0.42;
      const wange = [[wx - 0.32, wy - 0.3], [wx + 0.1, wy - 0.32], [wx + 0.28, wy - 0.05], [wx + 0.2, wy + 0.32], [wx - 0.05, wy + 0.5], [wx - 0.28, wy + 0.3]];
      s += form(T, wange, T.lg("wange", [[0, "#6a5ad8"], [1, "#4c48c4"]])) + saum(T, wange, randSatz(T, "w", { L: 0.05, k: 2, w: 0.04, winkel: 20, dunkel: "#4c48c4", od: [0.9] }), { abstand: 0.07, flow: () => 120, licht: () => 0.3 }) +
        (T.fein ? `<path d="M${folge([wx - 0.18, wy - 0.12])}q.15 -.06 .3 0M${folge([wx - 0.16, wy + 0.04])}q.15 -.06 .3 0M${folge([wx - 0.12, wy + 0.2])}q.13 -.05 .26 0" fill="none" stroke="#8a9ae8" stroke-width=".025" opacity=".35"/>` : "");
      /* Kehlpunkte: Tropfen, nach vorn kleiner, der äußere am unteren Ende des Wangenflecks */
      const tropfen = (x, y, r) => `<path d="M${folge([x, y - r])}C${folge([x + r * 1.1, y - r, x + r * 0.7, y + r * 0.6, x, y + r * 1.3])}C${folge([x - r * 0.7, y + r * 0.6, x - r * 1.1, y - r, x, y - r])}Z" fill="#151515"/>`;
      s += tropfen(wx - 0.12, wy + 0.62, 0.09) + tropfen(wx + 0.2, wy + 0.7, 0.075) + tropfen(wx + 0.48, wy + 0.72, 0.06);
      /* Auge: dunkler matter Lidrand (6–8 %), schmaler hellgrauer Irisring, große Pupille, gelbe Federchen bis an den Lidrand */
      const ex = Hc[0] + 0.22, ey = Hc[1] - 0.2;
      s += auge(T, ex, ey, 0.24, { ratio: 1.02, iris: "#d4d2ca", iris2: "#a8a69e", mitte: "#e2e0d8", sklera: "#b8b6ae", ir: 1.02, pr: 0.62, lid: "#3a3428", lidw: 0.08, fasern: false, glanz: 0.8 });
      if (T.fein) { let d = ""; for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, bx = ex + Math.cos(a) * 0.3, by = ey + Math.sin(a) * 0.3; d += `M${folge([bx, by], 3)}q${folge([Math.cos(a) * 0.04 - Math.sin(a) * 0.02, Math.sin(a) * 0.04 + Math.cos(a) * 0.02, Math.cos(a) * 0.08, Math.sin(a) * 0.08], 3)}`; } s += `<path d="${d}" stroke="#d8bc3a" stroke-width=".02" fill="none" opacity=".8"/>`; }
      /* Wachshaut: in die Kopfrundung eingebettet, matt-wachsig, breiter weicher Glanz, rundes Nasenloch; Stirnfedern überlappen die Oberkante */
      const cx0 = Hc[0] + R * 0.86, cy0 = Hc[1] - R * 0.5;
      const wachs = [[cx0 - 0.28, cy0 - 0.06], [cx0, cy0 - 0.2], [cx0 + 0.32, cy0 - 0.04], [cx0 + 0.36, cy0 + 0.26], [cx0 + 0.08, cy0 + 0.36], [cx0 - 0.24, cy0 + 0.28]];
      s += form(T, wachs, T.lg("wachs", [[0, "#4a6ad0"], [1, "#2e47a0"]])) + mal(T, 0.06, form(T, [[cx0 - 0.15, cy0 - 0.05], [cx0 + 0.15, cy0 - 0.12], [cx0 + 0.2, cy0 + 0.02], [cx0 - 0.1, cy0 + 0.05]], "#fff", ` opacity=".18"`)) +
        `<circle cx="${zahl(cx0 + 0.12)}" cy="${zahl(cy0 + 0.06)}" r=".05" fill="#1a2a60"/>` +
        form(T, [[cx0 - 0.34, cy0 - 0.02], [cx0 - 0.05, cy0 - 0.24], [cx0 + 0.24, cy0 - 0.12], [cx0 + 0.1, cy0 - 0.08], [cx0 - 0.1, cy0 - 0.12], [cx0 - 0.22, cy0 + 0.04]], "#f2dc58");
      /* Schnabel: 25 % kürzer, stärker gekrümmt, Spitze auf Höhe der Wangenfleck-Mitte, Glanzlinie auf dem First, Spitze dunkler */
      const sx0 = cx0 + 0.02, sy0 = cy0 + 0.34;
      s += form(T, [[sx0 - 0.08, sy0 - 0.02], [sx0 + 0.28, sy0 - 0.06], [sx0 + 0.44, sy0 + 0.2], [sx0 + 0.36, sy0 + 0.52], [sx0 + 0.14, wy + 0.04, 1], [sx0 + 0.2, sy0 + 0.42], [sx0 + 0.04, sy0 + 0.24]], T.lg("schnabel", [[0, "#c2b284"], [0.65, "#a89a6c"], [1, "#7c7254"]]));
      s += `<path d="M${folge([sx0 + 0.1, sy0])}Q${folge([sx0 + 0.42, sy0 + 0.08, sx0 + 0.38, sy0 + 0.42])}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".035"/>`;
      /* Bartfedern als Büschel mit welliger Kante, verdecken 40–50 % der Schnabelseite */
      const bart = [[sx0 - 0.14, sy0 + 0.05], [sx0 + 0.16, sy0 + 0.12], [sx0 + 0.22, sy0 + 0.3], [sx0 + 0.12, sy0 + 0.5], [sx0 - 0.1, sy0 + 0.46]];
      s += form(T, bart, "#e2c844") + saum(T, bart, randSatz(T, "ba", { L: 0.09, k: 3, w: 0.05, winkel: 30, dunkel: "#e8d050", od: [0.95] }), { abstand: 0.045, flow: () => 60, licht: () => 0.3, wo: (x) => x > sx0 + 0.05 }) +
        `<path d="M${folge([sx0 - 0.04, sy0 + 0.16])}q.12 .05 .2 .01M${folge([sx0 - 0.03, sy0 + 0.32])}q.12 .05 .2 .01" fill="none" stroke="#b8a030" stroke-width=".02" opacity=".55"/>`;
      /* naher Fuß vor dem Bauch */
      s += fuss(1.45, "#9aa2b6", "#5a6074", 1);
      /* Bauchgefieder überdeckt den oberen Lauf mit weicher Federkante */
      s += saum(T, [P(-0.2, 1.5), P(0.6, 1.8), P(1.4, 1.75), P(1.0, 1.4), P(0.2, 1.3)], randSatz(T, "bk", { L: 0.14, k: 3, w: 0.05, winkel: 50, dunkel: "#3e8a28", od: [0.95] }), { abstand: 0.06, flow: () => 120, licht: () => 0.3 });
      return { svg: s, box: [-11.4, -7.45, 6.1, 0], fuesse: [0.9, 1.5], kopf: [Hc[0] - 1.5, Hc[1] - 1.5, Hc[0] + 2.1, Hc[1] + 1.8] };
    } },
  /* =================================================================
     GOLDFISCH — Komet (Carassius auratus)
     RECHERCHE: FishBase (Carassius auratus), Animal Diversity Web, about-goldfish.com „Comet“, Animal-World,
     Morphometrie-Studie: Körper wie die Giebel, aber schlanker (Höhe ≈ 32 % SL), Rücken- und Bauchlinie gleichmäßig
     gewölbt; Kopf ≈ 28 % SL, Schnauze länger als das Auge (Auge ≈ 25 % der Kopflänge), endständiges kleines Maul
     ohne Barteln, Doppel-Nasenloch; 25–31 Rundschuppen entlang der Seitenlinie in schrägen, versetzten Reihen
     (Rautengitter), zu Rücken, Bauch und Schwanzstiel kleiner, Stiel bis kurz vor die Flosse beschuppt; sichtbar ist
     nur der freie Hinterrand jeder Schuppe; Seitenlinie als Porenreihe (eine Pore je Schuppe), leicht nach unten
     gebogen; lange Rückenflosse (> 15 Strahlen, vorn am höchsten, Rand leicht konkav, vorn ein gesägter Hartstrahl),
     Beginn bei ≈ 48 % SL; Afterflosse mit Hartstrahl; Weichstrahlen im äußeren Drittel gegabelt; Bauchflossen unter
     dem Rückenflossenbeginn, Brustflossen tief (≈ 80 % der Körperhöhe) direkt hinter dem Kiemendeckel, fächerförmig;
     Komet: einfache, tief gegabelte, lange Schwanzflosse (≈ 60 % SL und mehr), Lappen schmal, leicht S-förmig,
     oberer Lappen etwas länger; Farbe metallisch orange-gold: durchgehendes Glanzband auf der oberen Flanke, an
     jeder Schuppe gebrochen, Kernschatten unten, Reflexlicht an der Bauchkante; Flossen an der Basis satt, zum Rand
     durchscheinend; Auge mit goldener Iris, Goldring um die Pupille, dunkler Limbus, Hautrand oben.
     Runde 3: Schuppen als Rautengitter (26 auf der Seitenlinie), Glanzband statt Noppen, Stiel ohne Kappe, Auge
     kleiner und metallisch, Gesicht ohne Nähte, Volumen, Flossen mit gegabelten Strahlen und gesägtem Hartstrahl.
     ================================================================= */
  { id: "goldfisch", de: "der Goldfisch", syl: "GOLD-fisch", it: "il pesce rosso", itSyl: "PE-sce ROS-so", en: "goldfish",
    gruppe: "Haustiere", lebensraum: "Zuhause", schwimmt: true,
    laenge: 0.155, hoehe: 0.06,
    zeichne(T) {
      T.dez = 2;
      const V = (n, w, t, u) => vol(T, n, { weich: w, tiefe: t, umgebung: u });
      let s = `<g transform="translate(0 .75)">`;
      /* Flosse: Verlauf Basis (satt) → Rand (durchscheinend), Strahlen verjüngt (innen kräftig, außen fein) und im äußeren Drittel Y-gegabelt */
      const flosse = (pts, basis, rand, n, o = {}) => {
        const [bx0, by0, bx1, by1] = T.box(pts);
        const g = T.lg("fl" + (T._fn = (T._fn || 0) + 1), [[0, "#ee7418", 0.9], [0.6, "#f39a40", 0.6], [1, "#f6b870", 0.35]],
          zahl((basis[0][0] - bx0) / ((bx1 - bx0) || 1)), zahl((basis[0][1] - by0) / ((by1 - by0) || 1)), zahl((rand[0][0] - bx0) / ((bx1 - bx0) || 1)), zahl((rand[0][1] - by0) / ((by1 - by0) || 1)));
        let st = "", st2 = "";
        for (let i = 0; i <= n; i++) {
          if (!T.fein && i % 2) continue;
          const t = i / n, ax = basis[0][0] + (basis[1][0] - basis[0][0]) * t, ay = basis[0][1] + (basis[1][1] - basis[0][1]) * t;
          const ex = rand[0][0] + (rand[1][0] - rand[0][0]) * t, ey = rand[0][1] + (rand[1][1] - rand[0][1]) * t;
          const mx = ax + (ex - ax) * 0.66, my = ay + (ey - ay) * 0.66, k = (o.kr || 0) * Math.sin(Math.PI * t);
          st += `M${folge([ax, ay])}Q${folge([(ax + mx) / 2 + k, (ay + my) / 2 - k, mx, my])}`;
          const nx = -(ey - ay) * 0.035, ny = (ex - ax) * 0.035;
          st2 += `M${folge([mx, my])}L${folge([ex + nx, ey + ny])}M${folge([mx, my])}L${folge([ex - nx, ey - ny])}`;
        }
        return teil(T, pts, g, {
          innen: `<path d="${st}" fill="none" stroke="#c0500e" stroke-width=".045" stroke-opacity=".45"/>` + (T.fein ? `<path d="${st2}" fill="none" stroke="#c0500e" stroke-width=".016" stroke-opacity=".4"/>` : "") + (o.extra || ""),
        });
      };
      /* gesägter Hartstrahl: feine Zähne an der Hinterkante alle ≈ 0,07 cm */
      const hart = (a, b) => {
        let z = "";
        if (T.fein) { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.floor(L / 0.07); for (let i = 1; i < n; i++) { const t = i / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; z += `M${folge([x, y])}l${folge([-0.03, 0.015])}`; } }
        return `<path d="M${folge(a)}L${folge(b)}" stroke="#9a3a0a" stroke-width=".07"/>` + (z ? `<path d="${z}" stroke="#9a3a0a" stroke-width=".025"/>` : "");
      };
      /* ferne Brustflosse: 0,25 cm nach vorn, verkürzt, 35 % */
      s += `<g opacity=".35">` + flosse([[4.3, -2.35], [3.75, -1.95], [3.25, -1.6], [3.4, -2.05], [3.95, -2.45]], [[4.25, -2.38], [3.95, -2.48]], [[3.3, -1.62], [3.45, -2.05]], 6) + "</g>";
      /* Schwanzflosse (Komet): Lappen leicht S-förmig, Saum leicht wellig, oberer Lappen 5 % länger, Strahlen beginnen unter der letzten Schuppenreihe */
      const schwanz = [[-2.4, -4.0], [-3.8, -4.75], [-5.3, -5.4], [-6.9, -6.15], [-8.85, -6.75, 1], [-7.85, -5.8], [-6.5, -4.85], [-4.95, -3.62, 1], [-6.3, -2.68], [-7.5, -1.82], [-8.45, -0.9, 1], [-7.2, -1.12], [-5.45, -1.95], [-3.85, -2.6], [-2.4, -3.1]];
      /* Rückenflosse: Basis ab ≈ 48 % SL, vorn am höchsten (≈ 50 % der Körperhöhe), Rand leicht konkav, Hartstrahl gesägt */
      const ruecken = [[2.05, -5.15], [1.78, -6.0], [1.55, -6.62, 1], [0.8, -5.98], [0.0, -5.42], [-0.6, -4.95], [-0.95, -4.45, 1], [0.4, -4.76], [1.3, -4.98]];
      s += flosse(ruecken, [[1.95, -5.1], [-0.85, -4.5]], [[1.52, -6.58], [-0.9, -4.55]], 17, { extra: hart([2.0, -5.12], [1.55, -6.6]) });
      /* Afterflosse mit Hartstrahl, Bauchflosse unter dem Rückenflossenbeginn */
      s += flosse([[-0.35, -2.8], [-0.8, -2.1], [-1.25, -1.55, 1], [-1.3, -2.3], [-1.25, -3.02]], [[-0.4, -2.78], [-1.2, -3]], [[-1.2, -1.6], [-1.28, -2.4]], 6, { extra: hart([-0.38, -2.8], [-1.2, -1.62]) });
      s += flosse([[2.25, -2.15], [1.8, -1.4], [1.25, -0.75, 1], [1.4, -1.4], [1.6, -2.05]], [[2.2, -2.12], [1.65, -2.05]], [[1.3, -0.8], [1.4, -1.35]], 7);
      /* Körper: Stiel läuft oben und unten konkav in die Flosse aus (keine Kappe) */
      const leib = [[6.6, -3.7], [6.45, -4.15], [6, -4.55], [5, -4.95], [3.8, -5.15], [2.9, -5.2], [1.6, -5.1], [0.4, -4.75], [-0.8, -4.25], [-1.7, -3.97], [-2.45, -3.93], [-2.95, -4.08], [-3.2, -4.22],
        [-3.2, -2.86], [-2.95, -3.0], [-2.45, -3.17], [-1.7, -3.2], [-0.8, -2.85], [0.4, -2.4], [1.6, -2.1], [2.9, -2.05], [3.8, -2.1], [5, -2.35], [5.9, -2.75], [6.35, -3.15], [6.58, -3.48]];
      const leibId = pfad(T, leib);
      const kO = kurve(leib.slice(0, 13), 5), kU = kurve(leib.slice(13).concat([leib[0]]), 5);
      const naechst = (k, x) => { let b = k[0]; for (const p of k) if (Math.abs(p[0] - x) < Math.abs(b[0] - x)) b = p; return b[1]; };
      const oben = (x) => naechst(kO, x), unten = (x) => naechst(kU, x);
      /* Schuppen als Rautengitter: 13 Reihen, versetzt, ≈ 0,26 cm Abstand (26 auf der Seitenlinie); nur freier Hinterrand + helle Innenkante;
         im Glanzband heller (an jeder Schuppe gebrochen); eine Pore je Schuppe auf der leicht gebogenen Seitenlinie */
      let rand = "", innen = "", glanzK = "", poren = "";
      const nR = 13, sx = 0.26;
      const vSL = (x) => 0.42 + 0.06 * Math.sin(Math.PI * klemm((3.8 - x) / 6.9));
      if (T.fein) for (let j = 0; j < nR; j++) for (let i = 0; i < 30; i++) {
        const x = 3.62 - (i + (j % 2) * 0.5) * sx;
        if (x < -2.95) break;
        const o = oben(x), u = unten(x), h = u - o, v = (j + 0.5) / nR, y = o + v * h;
        const kante = Math.abs(v - 0.45) * 2, k = Math.min(sx * 0.62, (h / nR) * 1.25) * (1 - 0.3 * kante * kante);
        rand += `M${folge([x, y - k])}Q${folge([x - k * 1.1, y, x, y + k])}`;
        const band = v > 0.27 && v < 0.43;
        (band ? glanzK : (innen += "", null));
        if (band) glanzK += `M${folge([x + 0.04, y - k * 0.75])}Q${folge([x - k * 0.9 + 0.04, y, x + 0.04, y + k * 0.75])}`;
        else if (v < 0.75) innen += `M${folge([x + 0.035, y - k * 0.75])}Q${folge([x - k * 0.9 + 0.035, y, x + 0.035, y + k * 0.75])}`;
      }
      if (T.fein) for (let i = 0; i < 28; i++) { const x = 3.62 - i * sx - sx * 0.35; if (x < -2.9) break; const o = oben(x), u = unten(x); poren += `M${folge([x, o + vSL(x) * (u - o)])}h.035`; }
      const lf = feld(leib, 1.4);
      s += `<g filter="${V("leib", 0.65, 5, 0.3)}">` + teil(T, "#" + leibId, T.lg("gold", [[0, "#c0420e"], [0.28, "#e0661a"], [0.5, "#ef7a12"], [0.72, "#d8641a"], [0.86, "#f2a050"], [1, "#f8cf8a"]]), {
        innen:
          /* Glanzband auf der oberen Flanke (30–40 % von oben), Kernschatten bei 70–80 %, Reflexlicht an der Bauchkante */
          mal(T, 0.18, `<path d="M4.2 -4.62Q1.2 -4.86 -2.3 -3.86L-2.3 -3.7Q1.2 -4.42 4.2 -4.2Z" fill="#ffe9b0" opacity=".4"/>`) +
          mal(T, 0.22, `<path d="M4.2 -2.75Q1.2 -2.55 -2.3 -3.3L-2.3 -3.22Q1.2 -2.3 4.2 -2.45Z" fill="#b8551a" opacity=".35"/>`) +
          (rand ? `<path d="${rand}" fill="none" stroke="#8a2e08" stroke-width=".022" stroke-opacity=".24"/><path d="${innen}" fill="none" stroke="#ffe2a8" stroke-width=".026" stroke-opacity=".3"/><path d="${glanzK}" fill="none" stroke="#fff2c8" stroke-width=".032" stroke-opacity=".42"/>` : "") +
          (poren ? `<path d="${poren}" stroke="#6a2006" stroke-width=".03" stroke-opacity=".45"/><path d="${poren}" stroke="#ffe6c0" stroke-width=".018" stroke-opacity=".45" transform="translate(0 .03)"/>` : "") +
          /* Kopf ohne Schuppen; Wange über Licht und Schatten; Kiemendeckel-Hinterrand als ein konvexer, sich verjüngender Bogen,
             dahinter heller Hautsaum und Schlagschatten auf die erste Schuppenreihe; Präoperculum als schwache L-Kurve */
          form(T, [[6.6, -3.7], [6.45, -4.15], [6, -4.55], [5, -4.95], [4.05, -5.1], [3.85, -4.2], [3.85, -3.2], [4.15, -2.2], [5, -2.35], [5.9, -2.75], [6.35, -3.15]], T.lg("fkopf", [[0, "#cc5214"], [0.45, "#ef7f1e"], [0.85, "#f6b468"], [1, "#f8cc8c"]])) +
          weichform(T, [[4.6, -4.7], [5.8, -4.6], [6.2, -4.1], [5.4, -4.0], [4.7, -4.2]], "#fff0c8", 0.35, 0.2) +
          weichform(T, [[4.6, -3.55], [5.6, -3.6], [5.8, -3.1], [4.9, -2.85]], "#a8400c", 0.25, 0.2) +
          mal(T, 0.05, `<path d="M3.98 -4.95Q3.55 -3.7 4.08 -2.25L3.84 -2.3Q3.3 -3.7 3.76 -4.9Z" fill="#8a2e08" opacity=".3"/>`) +
          `<path d="M4.1 -4.98Q3.6 -3.7 4.16 -2.22" fill="none" stroke="#9a3a0a" stroke-width=".045" stroke-linecap="round" stroke-opacity=".65"/><path d="M4.15 -4.9Q3.68 -3.7 4.2 -2.3" fill="none" stroke="#ffd8a0" stroke-width=".015" stroke-opacity=".6"/>` +
          `<path d="M4.95 -4.3Q4.78 -3.6 5.0 -3.15Q5.15 -3.05 5.35 -3.08" fill="none" stroke="#9a3a0a" stroke-width=".02" stroke-opacity=".13"/>`,
        /* Kontur: auf der Schattenseite unten eine dunklere Orange-Braun-Kante, auf der Lichtseite verliert sie sich */
        ueber: `<use href="#${leibId}" fill="none" stroke="${T.lg("fkontur", [[0, "#8a2e08", 0], [0.55, "#8a2e08", 0], [1, "#8a2e08", 0.35]], 0, 0, 0, 1)}" stroke-width=".02"/>`,
      }) + "</g>";
      /* Schwanzflosse über dem Stielende: Basis blendet weich ein (keine Kappe, die Strahlen beginnen unter der letzten Schuppenreihe) */
      s += `<g mask="url(#${T.id("fsm")})">` + flosse(schwanz, [[-2.45, -4.05], [-2.45, -3.05]], [[-8.75, -6.6], [-8.35, -0.98]], 20, { kr: 0.12 }) + "</g>";
      T.def(`<mask id="${T.id("fsm")}" maskUnits="userSpaceOnUse" x="-10" y="-8" width="10" height="9"><rect x="-10" y="-8" width="10" height="9" fill="${T.lg("fsmv", [[0, "#fff"], [0.7, "#fff"], [0.76, "#000"]], 0, 0, 1, 0)}"/></mask>`);
      /* Maul endständig: Oberlippe als hellerer Wulst, dünner sich verjüngender Spalt nach vorn leicht steigend, Unterlippe mit hellem Rand */
      s += weichform(T, [[6.12, -3.8], [6.48, -3.78], [6.52, -3.68], [6.16, -3.66]], "#f7b060", 0.8, 0.012);
      s += `<path d="M6.6 -3.62L6.45 -3.585Q6.36 -3.57 6.3 -3.57" fill="none" stroke="#6a2006" stroke-width=".025" stroke-opacity=".6" stroke-linecap="round"/><path d="M6.55 -3.53Q6.42 -3.5 6.32 -3.52" fill="none" stroke="#ffd09a" stroke-width=".02" stroke-opacity=".6"/>`;
      s += `<ellipse cx="6.12" cy="-4.27" rx=".07" ry=".05" fill="#4a1604"/><ellipse cx="6.12" cy="-4.24" rx=".07" ry=".03" fill="none" stroke="#ffd0a0" stroke-width=".015" opacity=".7"/>`;
      /* Auge (−15 %): Hautrand weich, deckt oben 15 % der Iris; Iris metallisch mit Goldring um die Pupille und dunklem Limbus;
         Fensterlicht bei 10–11 Uhr über der Grenze Iris/Pupille, Hornhaut-Reflexsichel unten rechts */
      const ex = 5.5, ey = -4.05, er = 0.36;
      s += `<circle cx="${ex}" cy="${ey}" r="${zahl(er + 0.05)}" fill="#b04a10" opacity=".5" filter="${weich(T, 0.03)}"/>`;
      s += `<circle cx="${ex}" cy="${ey}" r="${er}" fill="${T.rg("firis", [[0, "#e0b050"], [0.55, "#c8902a"], [0.85, "#a8701e"], [1, "#6a3a0a"]])}"/><circle cx="${ex}" cy="${ey}" r="${zahl(er - 0.015)}" fill="none" stroke="#6a3a0a" stroke-width=".03"/>`;
      s += `<circle cx="${ex}" cy="${ey}" r=".2" fill="#f2d27a"/><circle cx="${ex}" cy="${ey}" r=".16" fill="${T.rg("fpup", [[0, "#0a1418"], [1, "#020304"]])}"/>`;
      if (T.fein) s += `<path d="M${zahl(ex - 0.29)} ${zahl(ey - 0.1)}Q${zahl(ex - 0.2)} ${zahl(ey - 0.3)} ${zahl(ex - 0.02)} ${zahl(ey - 0.33)}" fill="none" stroke="#f6dc90" stroke-width=".05" opacity=".45"/>`;
      s += `<path d="M${zahl(ex - er * 0.95)} ${zahl(ey - er * 0.45)}A${er} ${er} 0 0 1 ${zahl(ex + er * 0.95)} ${zahl(ey - er * 0.45)}" fill="#b04a10" opacity=".45" filter="${weich(T, 0.03)}"/>`;
      s += mal(T, 0.012, `<path d="M${folge([ex - 0.2, ey - 0.06])}Q${folge([ex - 0.18, ey - 0.17, ex - 0.07, ey - 0.19])}L${folge([ex - 0.05, ey - 0.12])}Q${folge([ex - 0.13, ey - 0.11, ex - 0.14, ey - 0.04])}Z" fill="#fff" opacity=".9"/>`);
      s += `<path d="M${zahl(ex + 0.05)} ${zahl(ey + 0.29)}Q${zahl(ex + 0.27)} ${zahl(ey + 0.18)} ${zahl(ex + 0.31)} ${zahl(ey - 0.04)}" fill="none" stroke="#fff" stroke-width=".045" opacity=".15"/>`;
      /* nahe Brustflosse: tief (≈ 80 % der Körperhöhe) direkt hinter der Unterkante des Kiemendeckels, Fächer, runder Rand, endet vor der Bauchflosse */
      s += `<g opacity=".85">` + flosse([[4.05, -2.55], [3.4, -2.2], [2.75, -1.75], [2.55, -1.45], [2.85, -1.4], [3.5, -1.85], [4.0, -2.35]], [[4.02, -2.56], [3.98, -2.38]], [[2.6, -1.48], [2.9, -1.42]], 8) + "</g>";
      s += "</g>";
      return { svg: s, box: [-8.95, -6.05, 6.65, 0], kopf: [3.6, -4.65, 6.8, -1.25] };
    } },
];
