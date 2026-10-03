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
function weich(T, sd) {
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
  const spalt = (s) => T.glatt(P.map((p) => [p[0] * s, p[1] * s].concat(p[2] ? [1] : [])));
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
  s += `<rect x="${zahl(-W * 0.42)}" y="${zahl(-H * 0.62)}" width="${zahl(rr * 0.36)}" height="${zahl(rr * 0.26)}" rx="${zahl(rr * 0.08)}" fill="#fff" opacity=".9" transform="rotate(-12 ${folge([-W * 0.24, -H * 0.5])})"/>`;
  s += `<circle cx="${zahl(W * 0.4)}" cy="${zahl(H * 0.42)}" r="${zahl(rr * 0.07)}" fill="#fff" opacity=".35"/>`;
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
    const x = fx - fb * j / Math.max(1, nc - 1) + (i % 2) * fb * 0.12, y = fy + fh * i / Math.max(1, nr - 1);
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
  const L = o.L, w = o.w || L * 0.075, k = o.k || 6, formen = o.formen || 2, dez = 2;
  const sh = [];
  for (let f = 0; f < formen; f++) {
    let d = "";
    for (let i = 0; i < k; i++) {
      const x = -L * 0.45 + (T.rnd() - 0.5) * L * 0.5, y = (T.rnd() - 0.5) * L * (o.breit || 0.42);
      const len = L * (0.55 + T.rnd() * 0.75), a = (T.rnd() - 0.5) * 0.2, ww = w * (0.6 + T.rnd() * 0.7);
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
    T.def(`<marker id="${id}" markerUnits="userSpaceOnUse" orient="auto" overflow="visible" markerWidth="1" markerHeight="1"><use href="#${sid}" fill="${farbe}" fill-opacity="${op}"/></marker>`);
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
    return d ? `<path d="${d}" fill="none" marker-start="url(#${m})" marker-mid="url(#${m})" marker-end="url(#${m})"/>` : "";
  }).join("");
}
/* weiche Form (Licht-/Schattenfläche, Okklusion) */
const weichform = (T, pts, farbe, op, b) => mal(T, b, form(T, pts, farbe, ` opacity="${op}"`));
/* Fläche füllen. o = { n (Büschelpaare je Ton), flow(x,y) Grad, licht(x,y) 0…1, st (Abstand der 2 Büschel, cm), streu (Grad),
   wo(x,y), hell (Anteil heller Büschel, Standard 1 = gleich viele) } */
function fell(T, pts, satz, o) {
  if (!T.fein || !o.n) return "";
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
/* Fellsaum über die Kontur: alle `abstand` cm ein Büschel, Wurzel innen, Spitze nach außen in Flussrichtung.
   o = { abstand, flow, ab (0…1 nach außen), wo(x,y), tief (Wurzel innen, × L), licht } – satz mit deckenden Farben */
function saum(T, pts, satz, o) {
  if (!T.fein) return "";
  const k = kurve(pts, 10), m = k.length, liste = [];
  let acc = 0;
  for (let i = 0; i < m; i++) {
    const p = k[i], q = k[(i + 1) % m];
    acc += Math.hypot(q[0] - p[0], q[1] - p[1]);
    if (acc < o.abstand * (0.6 + T.rnd() * 0.8)) continue;
    acc = 0;
    if (o.wo && !o.wo(p[0], p[1])) continue;
    let tx = q[0] - p[0], ty = q[1] - p[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    let nx = ty, ny = -tx;
    if (T.inPoly(p[0] + nx * 0.05, p[1] + ny * 0.05, pts)) { nx = -nx; ny = -ny; }
    const fa = (o.flow(p[0], p[1]) + (T.rnd() - 0.5) * 16) * Math.PI / 180, ab = o.ab != null ? o.ab : 0.35;
    let dx = nx * ab + Math.cos(fa) * (1 - ab), dy = ny * ab + Math.sin(fa) * (1 - ab);
    const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
    const t = satz.L * (o.tief != null ? o.tief : 0.25), l = satz.L * 0.35;
    const li = o.licht ? klemm(o.licht(p[0], p[1])) : 0.5, ids = li > 0.5 && satz.h ? satz.h : satz.d;
    const s = stufe(li > 0.5 ? (li - 0.5) * 2 : 1 - li * 2, T.rnd(), ids.length, 0.4);
    liste.push([ids[s][Math.floor(T.rnd() * ids[s].length)], p[0] - nx * t - dx * l * 0.3, p[1] - ny * t - dy * l * 0.3, dx * l, dy * l]);
  }
  return bueschelPfade(liste);
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
      const FK = fellSatz(T, "k", { L: 1.25, k: 7, w: 0.1, dunkel: "#6a3c10", od: [0.1, 0.16, 0.24], mittel: "#b67a30", om: [0.1, 0.16, 0.22], hell: "#fff0c8", oh: [0.05, 0.16, 0.3] });
      const FS = fellSatz(T, "s", { L: 0.9, k: 5, w: 0.09, breit: 0.3, dunkel: "#b88a4c", od: [0.7, 0.85, 1], hell: "#e6c48a", oh: [0.75, 0.9, 1] });
      const FKo = fellSatz(T, "o", { L: 0.6, k: 6, w: 0.065, dunkel: "#6a3c10", od: [0.1, 0.16, 0.24], mittel: "#b67a30", om: [0.1, 0.16, 0.2], hell: "#fff0c8", oh: [0.06, 0.16, 0.28] });
      const FSo = fellSatz(T, "so", { L: 0.5, k: 4, w: 0.06, breit: 0.3, dunkel: "#c0924f", od: [0.7, 0.85, 1], hell: "#e8c88e", oh: [0.75, 0.9, 1] });
      /* Silhouette: Rumpf, Hals und die nahen Beine als EIN Umriss.
         Vorderlauf: Ellbogen als Rundung hinten, Unterarm verjüngt, Handwurzel verdickt, Mittelfuß 12°, Pfote mit 3 Knöchelbögen */
      const vorne = [[17.2, -29.4], [16.9, -24], [16.55, -17], [16.3, -12.8], [16.75, -11.2], [16.85, -9.6], [17.25, -7.6], [17.9, -6.15],
        [18.75, -5.45], [19.45, -5.05], [19.75, -4.75], [20.35, -4.2], [20.6, -3.75], [21.1, -2.95], [21.45, -1.9], [21.35, -0.75], [20.8, -0.08], [20.2, 0, 1],
        [13.5, 0, 1], [13.0, -0.7], [12.85, -2.6], [12.75, -4.8], [12.1, -7.2], [11.35, -9.2], [11.15, -10.6], [11.45, -12.2], [11.25, -15], [10.6, -21], [9.9, -25.2], [9.15, -27.8], [9.4, -29.6]];
      /* Hinterlauf: Knie als Spitze vorn, Unterschenkel schräg nach hinten, Sprunggelenk tief, Mittelfuß senkrecht */
      const hinten = [[-13.8, -33.2], [-13.3, -30.2], [-13.7, -27.6], [-15.6, -25], [-18.8, -21.6], [-22.2, -18.4], [-24.4, -15.6], [-25.3, -13.2], [-25.3, -9], [-25.05, -6.3],
        [-24.3, -5.5], [-23.65, -5.1], [-23.3, -4.85], [-22.7, -4.3], [-22.45, -3.85], [-21.95, -3.05], [-21.6, -2], [-21.7, -0.8], [-22.2, -0.08], [-22.8, 0, 1],
        [-29.5, 0, 1], [-30, -1], [-30.1, -3], [-30.2, -6], [-30.3, -10], [-30.6, -13.4], [-31.7, -15.9], [-30.9, -18], [-30.3, -21.5], [-30.7, -26.5], [-31.6, -31.5], [-32.6, -36.5]];
      const leib = [[-31.4, -53.4], [-25, -55.6], [-19.5, -56.2], [-12, -55.6], [-4, -55.4], [5, -55.8], [11, -56.8], [14.5, -57.6], [17.5, -60.4], [20.2, -64], [22.6, -66.4], [25.6, -67.6], [29.5, -65.2],
        [29.8, -58], [29.2, -55.6], [28.2, -52.2], [26.6, -46.8], [24.4, -41.6], [22.8, -38.2], [20.9, -35], [18.7, -32.2]].concat(vorne,
        [[5, -28.6], [-1, -29.4], [-6, -31.2], [-10, -33.4], [-12.6, -34.6]], hinten, [[-33.7, -41.2], [-34.7, -45.4], [-34.3, -49.2], [-33.2, -51.8]]);
      const leibId = pfad(T, leib);
      /* Kopf: Schädel höher und gewölbt, Stopp mit Stufe, Fang kastenförmig (vorn ≥ 90 % so tief wie am Stopp),
         Unterkiefer tiefer, Nase bündig mit dem Nasenrücken (Überstand ≈ 0,4 cm) */
      const kopf = [[24.2, -69.4], [25.4, -72.4], [28, -74], [31.6, -74.4], [34.5, -73.6], [36.3, -72.3], [37.1, -70.6], [38.3, -69.2], [41.5, -68.75], [44.6, -68.45], [46.6, -68.25],
        [48.4, -68.05], [49.25, -67.3], [49.45, -65.9], [49.25, -64.8], [48.85, -64.35], [48.95, -63], [48.85, -61.6], [48.35, -60.5], [46.8, -59.6], [44.6, -59.1], [42, -58.4], [38.6, -57.7], [35, -57.3],
        [31.6, -57.8], [28.9, -59.8], [26.6, -63.2]];
      const kopfId = pfad(T, kopf);
      /* Ohr: Dreieck (Breite oben 100 %, Mitte 80 %, unten 45 %), Basis angehoben und gefaltet, Spitze gerundet */
      const ohr = [[26.2, -71.4], [28.6, -72.9], [31.4, -72.9], [33.2, -71.6], [33.4, -69.6], [32.9, -67], [32.2, -64.4], [31.4, -62.4], [30.4, -61.2], [29.4, -61.3], [28.5, -62.6], [27.3, -65.6], [26.4, -68.8]];
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
      const V = (n, w, t, u) => T.volumen(n, { weich: w, tiefe: t, umgebung: u });
      let s = "";
      /* Pfote: 3 Knöchelbögen mit Furchen, Knöchellicht, Haarbüschel zwischen den Zehen, Krallen 100/85/60 %, Sohlenlinie */
      const pfote = (x, w, fern) => {
        if (!T.fein) return "";
        let t = "";
        const kn = [[0.57, -4.95], [0.74, -4.05], [0.9, -2.75]];
        kn.forEach(([f, y], i) => {
          const zx = x + w * f;
          t += weichform(T, [[zx - 0.5, y + 0.15], [zx, y - 0.25], [zx + 0.45, y + 0.25], [zx + 0.1, y + 0.7]], HELL, fern ? 0.12 : 0.3, 0.15);
          if (i < 2) t += falte(T, [[zx + 0.25, y + 0.05], [zx + 0.45, y + 1.4], [zx + 0.35, y + 2.6]], TIEF, 0.16, fern ? 0.25 : 0.4);
        });
        t += `<path d="M${zahl(x + w * 0.05)} -.1H${zahl(x + w * 0.96)}" stroke="#2a1d14" stroke-width=".16" stroke-opacity=".75"/>`;
        return t;
      };
      const krallen = (x, w, fern) => T.fein ? [0, 1, 2].map((i) => kralle(T, x + w * [0.97, 0.86, 0.72][i], -1.35 + i * 0.1, 0.85 * [1, 0.85, 0.6][i], 58 - i * 4, fern ? "#3a322c" : "#2a2622", 0.4)).join("") : "";
      /* --- ferne Beine: gleiche Winkel, Körperton 15 % dunkler, Form und Fell --- */
      const fernV = schieb([[9, -36], [16, -36]].concat(vorne.slice(0, -1)), -4.4);
      const fernH = schieb([[-5, -38], [-12.6, -34.6]].concat(hinten, [[-31.6, -33], [-24, -40]]), 5.6);
      const fernF = T.lg("hfern", [[0, "#a0703a"], [0.4, "#bf9256"], [1, "#cba270"]]);
      for (const [P, x, w] of [[fernH, -29.5 + 5.6, 7.3], [fernV, 13.5 - 4.4, 7.7]]) {
        const fl = feld(P, 3);
        s += `<g filter="${V("hf" + x, 1.4, 5, 0.3)}">` + teil(T, P, fernF, {
          innen: weichform(T, schieb(P, 0.9, 0.4), TIEF, 0.22, 0.9) + fell(T, P, FK, { n: 70, flow: () => 94, licht: (xx, yy) => (fl(xx, yy) + 0.2) / 1.4 - 0.2, hell: 0.6 }) + pfote(x, w, 1),
          ueber: saum(T, P, FS, { abstand: 0.35, flow: () => 94, ab: 0.3, wo: (xx, yy) => yy < -1.2, licht: () => 0.2 }),
        }) + krallen(x, w, 1) + "</g>";
      }
      /* --- Otterrute: fällt aus der Kruppe ab, 6,5 → 2,3 cm, stumpf, unten büschelig --- */
      const rc = [[-29.6, -50.6], [-33.6, -48.6], [-36.6, -45], [-38.6, -40], [-39.7, -34], [-40, -28], [-39.7, -23.2]];
      const rute = schlauch(rc, [6.5, 6.1, 5.4, 4.6, 3.8, 3, 2.3], true);
      const rflow = (x, y) => (y < -46 ? 150 : y < -40 ? 118 : 96);
      const rl = feld(rute, 2.4);
      s += `<g filter="${V("rute", 1.4, 5, 0.3)}">` + teil(T, rute, T.lg("rute", [[0, "#dcb072"], [0.6, "#d4a564"], [1, "#b8884a"]], 0, 0, 1, 0), {
        innen: fell(T, rute, FK, { n: 110, flow: rflow, licht: (x, y) => (rl(x, y) + 0.3) / 1.1 }),
        ueber: saum(T, rute, FS, { abstand: 0.22, flow: rflow, ab: 0.35, licht: (x, y) => (rl(x, y) + 0.3) / 1.1 }) +
          saum(T, rute, FS, { abstand: 0.3, flow: (x, y) => rflow(x, y) - 20, ab: 0.7, tief: 0.1, wo: (x, y) => x > -39 && y > -44, licht: () => 0.3 }),
      }) + "</g>";
      /* --- Leib --- */
      const kopfVers = (pts) => schieb(pts, -1.5, 3.8);
      s += `<g filter="${V("leib", 2.6, 5, 0.32)}">` + teil(T, "#" + leibId, T.lg("hfell", [[0, "#e0b979"], [0.17, "#ecd09c"], [0.3, "#e6c58a"], [0.43, "#c99a5a"], [0.5, "#c4945a"], [0.555, "#d3a96c"], [0.62, "#dcb57a"], [1, "#e4c28c"]]), {
        innen:
          /* Schulterblatt als eigene Lichtfläche (45°), Schattenkante hinten; Keule als Kugel (Glanz oben vorn, Sichel hinten unten);
             Ellbogen als Volumen; Kernschatten-Band bei 65 % Rumpftiefe kommt aus dem Verlauf */
          weichform(T, [[12.4, -56.4], [16.4, -57.2], [21.2, -51], [24.4, -44.4], [22.6, -42.4], [18.6, -46], [13.8, -51.6]], HELL, 0.32, 1.1) +
          weichform(T, [[11.4, -55.6], [12.6, -55.8], [17.4, -46.6], [21.6, -41.8], [20.4, -41], [15.6, -46.2]], SCH, 0.35, 0.45) +
          weichform(T, [[-29.6, -50.4], [-22.4, -52.6], [-17.4, -48.6], [-19.6, -43], [-25.6, -42.6], [-29.4, -45.6]], HELL, 0.38, 1.6) +
          weichform(T, [[-33.6, -42.4], [-27.6, -35.6], [-19.4, -32.8], [-15.6, -34.6], [-18.6, -30.4], [-27.4, -30.2], [-32.8, -35.6]], SCH, 0.42, 1.2) +
          weichform(T, [[8.6, -30.6], [11.6, -31.4], [12.6, -28.6], [10.6, -26.4], [9.2, -27.4]], HELL, 0.3, 0.5) +
          weichform(T, [[9.4, -27], [12.2, -27.6], [12.4, -25.6], [10.2, -24.8]], SCH, 0.3, 0.45) +
          /* Okklusion: unter Kopf und Kinn (Schlagschatten), zwischen Vorderlauf und Brust, Kniefalte, Leiste */
          schlag(T, kopfId, 0.7 - 1.5, 1.4 + 3.8, 1.1, TIEF, 0.45) +
          weichform(T, [[17.6, -33], [20.6, -34.6], [19.4, -30.6], [17.4, -28.6]], TIEF, 0.35, 0.7) +
          weichform(T, [[-12.4, -36], [-10.6, -33.6], [-13.2, -30.6], [-14.4, -33.4]], TIEF, 0.3, 0.6) +
          /* Fell */
          fell(T, leib, FK, { n: 620, flow, licht: lic, wo: (x, y) => y < -6 }) +
          fell(T, leib, FKo, { n: 160, flow, licht: lic, wo: (x, y) => y > -14 && y < -2 }) +
          pfote(-29.5, 7.3) + pfote(13.5, 7.7),
        ueber: saum(T, leib, FS, { abstand: 0.24, flow, ab: 0.32, licht: lic, wo: (x, y) => y < -6.5 && !(x > 24 && y < -57) }) +
          saum(T, leib, FSo, { abstand: 0.18, flow: () => 98, ab: 0.4, licht: lic, wo: (x, y) => y < -0.8 && y > -6.5 }) +
          /* Haarbüschel zwischen den Zehen */
          saum(T, [[19.5, -5.1], [20.5, -4.1], [21.25, -2.8], [21.4, -1.6]], FSo, { abstand: 0.2, flow: () => 70, ab: 0.6, tief: 0.05, licht: () => 0.6 }) +
          saum(T, [[-23.5, -5.0], [-22.6, -4.1], [-21.8, -2.9], [-21.65, -1.7]], FSo, { abstand: 0.2, flow: () => 70, ab: 0.6, tief: 0.05, licht: () => 0.6 }) +
          /* Saum am Bauch etwas länger und hängend */
          saum(T, [[-12.4, -34.6], [-6, -31.2], [-1, -29.4], [5, -28.6], [9.2, -29.4]], FS, { abstand: 0.2, flow: () => 100, ab: 0.8, tief: 0.15, licht: () => 0.3 }),
      }) + krallen(-29.5, 7.3) + krallen(13.5, 7.7) +
        /* Afterkralle: innen am Vordermittelfuß, halb im Fell */
        (T.fein ? kralle(T, 12.95, -6.8, 0.55, 118, "#3a2e26", 0.45) + saum(T, [[12.9, -7.6], [12.75, -6.3]], FSo, { abstand: 0.12, flow: () => 100, ab: 0.2, tief: 0, licht: () => 0.4 }) : "") + "</g>";
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
          mal(T, 0.22, `<path d="M48.7 -60.4Q46 -59.5 42.8 -59.4Q40 -59.6 37.6 -61Q38.4 -59.6 41 -58.9Q44.6 -58.3 48.2 -59.6Z" fill="${TIEF}" opacity=".55"/>`) +
          `<path d="M48.85 -61.2Q48.5 -60.5 47.6 -60.3Q45 -59.85 42.6 -59.9Q39.8 -60.2 37.7 -61.3" fill="none" stroke="#1c120a" stroke-width=".26" stroke-linecap="round"/>` +
          `<path d="M48.6 -61.6Q45.5 -61 42.6 -61.1Q40 -61.4 38 -62.2" fill="none" stroke="${HELL}" stroke-width=".5" stroke-opacity=".22"/>` +
          `<path d="M37.8 -61.2q-.55 .15 -.75 .85q0 .5 .35 .8" fill="none" stroke="#5a3818" stroke-width=".16" stroke-opacity=".55"/>` +
          schlag(T, ohrId, 0.6, 0.9, 0.45, TIEF, 0.5) +
          fell(T, kopf, FKo, { n: 300, flow: kflow, licht: klic, wo: (x, y) => !(x > 48 && y < -63.5) }),
        ueber: saum(T, kopf, FSo, { abstand: 0.2, flow: kflow, ab: 0.3, licht: klic, wo: (x, y) => (x < 46.5 && y < -61.5) || (y > -59.5 && x < 46) }),
      });
      /* Auge: 1,3 : 1, Oberlid deckt 15 % der Iris, Schatten im oberen Drittel, Unterlidlinie, kleine Nickhaut-Sichel */
      s += auge(T, 35.3, -69.2, 0.78, { ratio: 1.3, spitz: 0.35, winkel: 6, iris: "#8a541e", iris2: "#3a1d08", mitte: "#b47a34", pr: 0.4, ir: 0.92, lid: "#1a0f08", lidw: 0.16, wimpern: [9, 0.5, "#4a3018"], nick: "#6a5048" });
      s += `<path d="M34.3 -68.25q1.1 .55 2.1 .1" fill="none" stroke="#7a5228" stroke-width=".12" stroke-opacity=".6"/>`;
      s += tasthaar(T, [36.2, -71.4, 0.6, 0.2, 1, 4], -112, -80, 2.6, ["#3a2814", "#c9a874"], 0.05, 0.7);
      /* Nase: oben bündig, vorn fast senkrecht, Philtrum als Kerbe in der Nase, Komma-Nasenloch mit hellem Flügelrand,
         kleiner scharfer Glanz + Mikroglanz auf dem Pflaster */
      const nase = [[46.4, -68.3], [48.4, -68.1], [49.25, -67.35], [49.5, -66], [49.35, -64.9], [48.95, -64.45], [48.65, -64.75], [48.3, -64.45], [47.4, -64.65], [46.6, -65.4], [46.1, -66.8]];
      s += teil(T, nase, T.lg("nase", [[0, "#4a3e38"], [0.4, "#221a16"], [1, "#0c0908"]]), {
        innen: (T.fein ? `<rect x="46" y="-68.4" width="3.6" height="4.2" fill="#2e2622" filter="${T.relief("nase", { f: 3.4, tiefe: 0.4, okt: 2 })}" opacity=".45"/>` : "") +
          `<path d="M49.45 -66.15C48.85 -66.3 48.35 -66 48.2 -65.55C48.05 -65.15 47.85 -64.95 47.5 -64.95C47.9 -64.75 48.4 -64.9 48.65 -65.25C48.85 -65.55 49.1 -65.7 49.45 -65.7Z" fill="#000"/>` +
          `<path d="M47.7 -65.05Q47.95 -66.55 49.4 -66.6" fill="none" stroke="#8a7a72" stroke-width=".11" opacity=".8"/>` +
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
          `<path d="M26.8 -70.6Q29.6 -71.6 33 -70.4" fill="none" stroke="${HELL}" stroke-width=".35" stroke-opacity=".3"/>` +
          fell(T, ohr, FKo, { n: 70, flow: () => 98, licht: (x, y) => (ol(x, y) + 0.2) / 1.2 - 0.1 }),
        ueber: saum(T, ohr, FSo, { abstand: 0.2, flow: () => 98, ab: 0.4, licht: () => 0.35, wo: (x, y) => y > -70.5 }),
      }) + "</g>";
      s += "</g>";
      return { svg: s, box: [-42.4, -70.6, 47.9, 0], fuesse: [-25.6, -19.9, 13.6, 17.2], kopf: [22.5, -71, 48.5, -53] };
    } },
  /* =================================================================
     KATZE — Hauskatze (Europäisch Kurzhaar), braun getigert (Mackerel Tabby)
     RECHERCHE: Kopf-Rumpf ≈ 46 cm, Schwanz ≈ 28 cm, Schulterhöhe 23–25 cm; Rumpflänge ≈ 1,5 × Widerristhöhe;
     Zehengänger; Hinterbeine länger (Kruppe 4–6 % höher als der Widerrist), Rücken mit Lendenbogen, Bauchlinie
     hinter dem Ellbogen am tiefsten, zur Kniefalte ansteigend, kleiner Bauchbeutel (Primordialtasche); Hals 40–45°
     geneigt, Kinn etwa auf Widerristhöhe; Sprunggelenk hoch (≈ 28–30 % der Beinhöhe), Mittelfuß fast senkrecht;
     Karpalballen hinten am Handgelenk; ovale Pfoten, Krallen eingezogen; runder Kopf, kurzer Fang (Auge–Nasen-
     spitze ≈ eine Augenlänge), leichter Stopp, Schnurrhaarkissen, kleines rundes Kinn; große Ohren mit Öffnung
     nach vorn, helle Haarbüschel, Henry-Tasche hinten unten; Augen groß, grün-gelb, bei Tageslicht senkrechte
     spindelförmige Pupille, Hornhaut gewölbt; Nasenspiegel ziegelrosa mit dunklem Rand; 10–12 weiße Schnurrhaare
     je Seite in 4 Reihen, Brauen-Tasthaare. Mackerel Tabby (CFA/WCF): „M“ auf der Stirn, Linien vom Augenwinkel
     über die Wange, helle Augenumrandung, Aalstrich direkt auf der Wirbelsäule, schmale Streifen rechtwinklig zum
     Rücken, über den Rippen gebogen, unten in Striche/Flecken aufgelöst, Bögen an Schulter und Keule, zwei
     „Halsketten“, gebänderte Beine, gleichmäßig geringelter Schwanz mit dunkler Spitze, Sohlenstreif hinten;
     Grund agouti warm graubraun, Bauch, Brust, Kehle, Innenseiten, Lippen und Kinn cremefarben.
     ================================================================= */
  { id: "katze", de: "die Katze", syl: "KAT-ze", it: "il gatto", itSyl: "GAT-to", en: "cat",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.712, hoehe: 0.362,
    zeichne(T) {
      T.dez = 1;
      const DK = "#2b2118", SCH = "#5e4426", TIEF = "#3a2a18", HELL = "#fff6e4";
      const EIMER = [["#4a3826", 0, 0.42, 0, "s"], ["#7a6244", 0, 0.38, 0, "s"], ["#a48a62", 0, 0.34, 0, "s"], ["#c9b28a", 0, 0.36, 0, "s"], ["#efe2c6", 0, 0.42, 0, "s"]];
      /* Silhouette mit nahen Beinen */
      const vorn = [[13.4, -13.2], [12.95, -9.4], [12.6, -5.6], [12.9, -4.4], [13.3, -3.2], [13.9, -2.45], [14.4, -2.1], [14.85, -1.75], [15.3, -1.1], [15.35, -0.4], [14.9, 0, 1],
        [9.9, 0, 1], [9.55, -0.7], [9.8, -2.2], [10.2, -3.1], [10.15, -4.3], [9.75, -4.9], [9.95, -6.1], [9.6, -9.4], [8.6, -11.2], [7.6, -11.9]];
      const hinten = [[-6.6, -12.4], [-8.2, -9.8], [-10.6, -7.6], [-12.8, -6.1], [-13.4, -4.6], [-13.4, -3.2], [-12.9, -2.45], [-12.2, -2.15], [-11.6, -1.85], [-11, -1.2], [-10.85, -0.4], [-11.2, 0, 1],
        [-15.9, 0, 1], [-16.25, -0.8], [-16.1, -2.6], [-16.05, -5.6], [-16.4, -7.2], [-17, -8.1], [-16.4, -9.6], [-16.5, -12.4], [-18.6, -15.6]];
      const leib = [[-20.6, -22.6], [-17.4, -25.6], [-12.4, -27], [-7.6, -26.6], [-3, -25.4], [1.8, -25], [5.6, -25.6], [8.2, -25.8], [10.6, -27.4], [13.2, -28.4], [16.4, -30.2],
        [20, -28.6], [21.2, -24.6], [19.6, -21.4], [17.2, -18.6], [15, -16.2]].concat(vorn,
        [[4.6, -11.2], [0, -11.8], [-4.2, -12.6], [-5.6, -12.4]], hinten, [[-21.2, -18.8], [-21.9, -20.9]]);
      const leibId = pfad(T, leib);
      /* Kopf (rund, kurzer Fang, leichter Stopp, Schnurrhaarkissen, kleines Kinn) */
      const kopf = [[13.2, -31.2], [14.9, -33.5], [17, -34.6], [19.2, -34.4], [20.7, -33.1], [21.4, -31.6], [21.75, -30.5], [22.5, -29.6], [23.1, -28.75], [23.25, -28.2], [23.05, -27.7],
        [23.05, -27.2], [22.75, -26.6], [22.05, -26.2], [21.75, -25.5], [21.1, -24.95], [20, -24.8], [18.4, -25], [16.4, -24.6], [14, -25.4], [12.6, -28.2]];
      const kopfId = pfad(T, kopf);
      /* Ohr: wächst aus der Schädelkontur, Öffnung nach vorn, Henry-Tasche hinten unten */
      const ohr = [[15.2, -33.2], [15.5, -35.4], [16.3, -37.6], [16.9, -38.6], [17.4, -38.2], [18.6, -36.6], [19.8, -34.7], [20.3, -33.6], [18, -33.9], [16.2, -33.6], [15.6, -33.9], [15.25, -33.6]];
      const ohrId = pfad(T, ohr);
      /* Licht und Wuchsrichtung */
      const lf = feld(leib, 4.2, (x, y) => (y < -22 ? 0.05 : 0));
      const flow = (x, y) => {
        if (y > -11.5 && (x > 8 || (x < -6 && x > -17.5))) return 93;      // Läufe abwärts
        if (x > 12 && y < -18) return 120;                                  // Hals, Brust
        if (x < -14) return 112;                                            // Keule
        return 180 - 35 * klemm((y + 25) / 13);                             // Rumpf
      };
      const wahl = (x, y, z) => stufe((lf(x, y) + 0.3) / 1.05, z, 5);
      let s = "";
      /* --- ferne Beine: 15–20 % dunkler, kühler, mit Ringen und Sohlenstreif --- */
      const fernV = schieb([[6.8, -15], [12.6, -15]].concat(vorn.slice(0, -1)), -2.4);
      const fernH = schieb([[-6.4, -16], [-6.6, -12.4]].concat(hinten.slice(1), [[-16.8, -14]]), 2.8);
      const fernF = T.lg("kfern", [[0, "#7e6c58"], [1, "#a69680"]]);
      const ring = (x0, x1, y, w, kr, op) => `<path d="M${folge([x0, y])}q${folge([(x1 - x0) / 2, kr, x1 - x0, 0])}l0 ${zahl(w, 2)}q${folge([(x0 - x1) / 2, kr, x0 - x1, 0])}z" fill="${DK}" opacity="${op}"/>`;
      for (const P of [fernH, fernV]) {
        const fl = feld(P, 1.6), vornig = P === fernV;
        s += teil(T, P, fernF, {
          form: { a: 0.8, w: 1.1, b: 0.35, s: [TIEF, 0.45], l: [HELL, 0.18], al: 0.2, wl: 0.6 },
          innen: `<g${zottel(T, "1.4 .7", 0.25)} opacity=".75">` + (vornig ? [-9.6, -7.6, -5.6, -3.7].map((y) => ring(6, 13.4, y, 0.55, 0.35, 0.8)).join("")
            : ring(-14, -7, -9.4, 0.6, 0.5, 0.75) + ring(-14, -9, -6.9, 0.55, 0.4, 0.75) + T.form([[-13.6, -7.4], [-12.3, -7.4], [-12.2, 0], [-13.5, 0]], DK, ` opacity=".8"`)) + "</g>" +
            haar(T, P, { n: 70, spitz: 0.06, L: 0.4, dez: 1, flow: () => 93, eimer: EIMER, wahl: (x, y, z) => stufe((fl(x, y) + 0.2) / 1.2 - 0.2, z, 5) }),
        });
      }
      /* --- Schwanz: verschmilzt mit der Kruppe, Ringe als gebogene Bänder (zur Spitze breiter), dunkle runde Spitze --- */
      const sc = [[-18.4, -22.4], [-21, -20.2], [-23.6, -17.2], [-25.6, -13.8], [-27.4, -10.2], [-29.4, -6.6], [-31.8, -4.2], [-34.8, -3], [-37.6, -3.2], [-39.6, -4.6]];
      const sw = [3.6, 3.3, 3, 2.9, 2.85, 2.75, 2.65, 2.55, 2.45, 2.3];
      const schw = schlauch(sc, sw, true);
      const sl = feld(schw, 1.4);
      const sflow = (x, y) => (y < -17 ? 130 : y < -6 ? 115 : x > -34 ? 160 : 200);
      const ringe = zeichnung(T, [[0.27, 0.31], [0.38, 0.425], [0.49, 0.54], [0.6, 0.655], [0.7, 0.76], [0.8, 0.865], [0.9, 1.06]].map(([a, b]) => [sc, sw.map((w) => w * 1.15), a, b]), DK, 0.84);
      s += teil(T, schw, T.lg("kschw", [[0, "#a2875f"], [1, "#c3ad88"]], 0, 0, 1, 0.4), {
        form: { a: 0.9, w: 1.2, b: 0.35, s: [TIEF, 0.5], l: [HELL, 0.25], al: 0.25, wl: 0.8 },
        innen: schlag(T, leibId, 0.4, 0.7, 0.4, TIEF, 0.4) + `<g${zottel(T, "1.6 .8", 0.3)}>${ringe}</g>` +
          haar(T, schw, { n: 160, spitz: 0.07, L: 0.5, dez: 1, flow: sflow, eimer: EIMER, wahl: (x, y, z) => stufe((sl(x, y) + 0.25) / 1.1, z, 5) }),
        ueber: randhaar(T, schw, { n: 170, spitz: 0.05, L: 0.5, dez: 1, flow: sflow, ab: 0.55, eimer: EIMER, wahl: (x, y, z) => stufe((sl(x, y) + 0.3) / 1.1, z, 5), szene: 0.06 }),
      });
      /* --- Tabby-Zeichnung --- */
      const ruecken = (x) => {                      // Rückenkontur (oben) für die Streifenanfänge
        const k = kurve(leib.slice(0, 11), 4);
        let best = k[0];
        for (const p of k) if (Math.abs(p[0] - x) < Math.abs(best[0] - x)) best = p;
        return best[1];
      };
      const Z = [];                                   // Zeichnung: [Mittellinie, Breiten, t0, t1]
      /* Aalstrich auf der Wirbelsäule (Band) und eine begleitende Linie */
      const aal = [];
      for (let x = -19.5; x <= 9.5; x += 1.5) aal.push([x, ruecken(x) + 0.45]);
      Z.push([aal, aal.map((p, i) => (i === 0 || i === aal.length - 1 ? 0.5 : 1.2))]);
      Z.push([aal.map(([x, y]) => [x, y + 1.15]), aal.map((p, i) => (i === 0 || i === aal.length - 1 ? 0.1 : 0.32))]);
      /* Flankenstreifen: vom Aalstrich abzweigend, oben senkrecht, über den Rippen gebogen, unten nach hinten auslaufend */
      const flecken = [];
      for (let i = 0; i < 13; i++) {
        const x0 = -15.2 + i * 1.95 + (T.rnd() - 0.5) * 0.5, top = ruecken(x0) + 0.9;
        const unten = x0 > 7 ? -16 : x0 < -11 ? -15.6 : -13.6;
        const bog = x0 < -11 ? -1.2 : 0.9 + T.rnd() * 0.5, rueck = x0 < -11 ? -1.4 : -1.8 - T.rnd() * 0.6;
        const m = [];
        for (let j = 0; j <= 5; j++) { const t = j / 5; m.push([x0 + bog * Math.sin(Math.PI * t * 0.9) + rueck * t * t * t + (T.rnd() - 0.5) * 0.35, top + (unten - top) * t]); }
        const b0 = 0.32 + T.rnd() * 0.36;
        const ws = m.map((p, j) => b0 * (j === 0 ? 0.6 : j === 5 ? 0.12 : 0.65 + T.rnd() * 0.75));
        const lauf = i % 3 === 0 ? [[0, 0.72], [0.8, 0.9]] : i % 3 === 1 ? [[0, 0.48], [0.56, 0.74], [0.83, 0.92]] : [[0, 0.6], [0.68, 0.84]];
        for (const [a, b] of (T.fein ? lauf : [[0, 0.62]])) Z.push([m, ws, a, b]);
        if (T.fein && T.rnd() < 0.5) flecken.push(fleck(T, m[5][0] - 0.5 + T.rnd(), unten + 0.6 + T.rnd() * 1.2, 0.3, 0.2, DK, 0.5, -20));
      }
      /* Schulterbögen, Keulenbögen (unterbrochen) */
      for (let i = 0; i < 3; i++) Z.push([[[8.6 - i * 0.6, -24.2 + i * 0.4], [11.2 - i * 0.4, -21 + i * 0.6], [11.4 - i * 0.5, -17.4 + i * 0.5], [10.2 - i * 0.6, -14.6]], [0.3, 0.55, 0.5, 0.2]]);
      for (let i = 0; i < 3; i++) {
        const rr = 3.4 + i * 1.7, cx = -15.4, cy = -15.4, pts = [];
        for (let a = -75; a <= 75; a += 30) pts.push([cx + Math.cos(a * Math.PI / 180) * rr * 1.05 + (T.rnd() - 0.5) * 0.3, cy + Math.sin(a * Math.PI / 180) * rr]);
        const ws = pts.map((p, j) => (j === 0 || j === pts.length - 1 ? 0.12 : 0.38 + 0.12 * i));
        Z.push([pts, ws, 0.05, 0.42 + 0.1 * i]); Z.push([pts, ws, 0.52 + 0.08 * i, 0.95]);
      }
      /* zwei Halsketten über die Brust */
      Z.push([[[13.6, -24.4], [16.4, -22.8], [18.6, -22]], [0.2, 0.6, 0.3]]);
      Z.push([[[12.8, -21.2], [15.4, -19.4], [17.4, -18.6]], [0.2, 0.55, 0.25]]);
      let mus = zeichnung(T, Z, DK, 0.66) + flecken.join("");
      /* Beinringe als gebogene Bänder (zur Pfote enger), Sohlenstreif hinten */
      for (const [y, kr] of [[-10.2, 0.4], [-8.2, 0.35], [-6.3, 0.3], [-4.6, 0.3]]) mus += ring(9, 13.8, y, 0.5, kr, 0.72);
      for (const [y, kr] of [[-11.4, 0.6], [-9.2, 0.6], [-6.4, 0.4]]) mus += ring(-16.8, -8.6, y, 0.55, kr, 0.7);
      mus += form(T, [[-16.6, -7.3], [-15.4, -7.6], [-15.25, 0], [-16.4, 0]], DK, ` opacity=".85"`);
      s += teil(T, "#" + leibId, T.lg("kfell", [[0, "#a2845a"], [0.28, "#ae916a"], [0.55, "#c4ad86"], [0.72, "#e0cfae"], [1, "#e6d8bb"]]), {
        form: { a: 1.7, w: 2.3, b: 0.65, s: [SCH, 0.6], l: [HELL, 0.4], al: 0.4, wl: 1.4, r: ["#efe0c0", 0.3], ar: 0.15, wr: 0.5 },
        innen:
          /* Agouti-Tüpfelung (nur fein) */
          (T.fein ? `<rect x="-22" y="-28" width="42" height="18" fill="${TIEF}" filter="${T.rauschen("tick", { fx: 2.2, fy: 1.4, farbe: TIEF, staerke: 3, schwelle: 0.62, okt: 2 })}" opacity=".22"/>` : "") +
          `<g${zottel(T, "1.3 .55", 0.45)}>${mus}</g>` +
          /* Muskeln: Schulterblatt, Keule (großer Tropfen), Brustkorb; Okklusion Achsel und Kniefalte; Kopfschatten auf dem Hals */
          wulst(T, [[6.4, -25.6], [10.6, -26.6], [13.6, -21], [13.2, -15.4], [9.4, -14.6], [7.4, -19.4]], { a: 0.9, w: 1.2, b: 0.5, m: 0.9, s: [SCH, 0.32], l: [HELL, 0.22], al: 0.3, wl: 1 }) +
          wulst(T, [[-20.8, -22.4], [-14.4, -25], [-8.2, -21], [-6.6, -14.4], [-10.6, -11.6], [-16.4, -12.4], [-20.6, -17.4]], { a: 1.1, w: 1.5, b: 0.6, m: 1.1, s: [SCH, 0.34], l: [HELL, 0.28], al: 0.4, wl: 1.2 }) +
          
          `<g transform="matrix(.9 0 0 .9 4.4 -1.2)">` + schlag(T, kopfId, 0.5, 0.9, 0.6, TIEF, 0.45) + "</g>" +
          haar(T, leib, { n: 640, spitz: 0.08, L: 0.62, flow, eimer: EIMER, wahl, dez: 1, szene: 0.04, lf: (x, y) => (y > -11 ? 0.6 : 1) }) +
          /* Zehen: Wölbungen, Fugen, Sohlenkante */
          (T.fein ? [[9.9, 5.2], [-15.9, 5]].map(([x, w]) => [0.48, 0.66, 0.83].map((f, i) => (i ? falte(T, [[x + w * f - 0.2, -1.9], [x + w * f, -0.3]], TIEF, 0.1, 0.45) : "") + fleck(T, x + w * (f + 0.08), -1.35, w * 0.08, 0.5, HELL, 0.35)).join("") +
            `<path d="M${folge([x + 0.3, -0.12])}h${zahl(w - 0.5)}" stroke="#4a3426" stroke-width=".22" stroke-opacity=".7" stroke-linecap="round"/>`).join("") : ""),
        ueber: randhaar(T, leib, { n: 250, spitz: 0.05, L: 0.5, flow, ab: 0.5, eimer: EIMER, wahl, dez: 1, szene: 0.04, wo: (x, y) => y < -0.8 }),
      });
      /* Kopf etwas kleiner (0,9) und vor den Hals gesetzt */
      s += `<g transform="matrix(.9 0 0 .9 4.4 -1.2)">`;
      /* fernes Ohr: nur die Spitze, 10 % dunkler */
      s += form(T, [[18.2, -34.6], [18.9, -37.1], [19.3, -37.2], [20.1, -34.6]], "#7a634a");
      /* --- nahes Ohr: Öffnung nach vorn, rosa nur tief in der Muschel, helle Haarbüschel, Henry-Tasche --- */
      s += teil(T, "#" + ohrId, T.lg("kohr", [[0, "#8c7254"], [1, "#ae9672"]]), {
        form: { a: 0.45, w: 0.6, b: 0.18, s: [TIEF, 0.45], l: [HELL, 0.3], al: 0.12, wl: 0.4 },
        innen: mal(T, 0.1, form(T, [[17.6, -37.2], [18.5, -36], [19.5, -34.4], [19.8, -33.8], [19.2, -34.6], [18.4, -35.7]], "#9c7068", ` opacity=".7"`)) +
          tasthaar(T, [19, -34.3, 0.9, 0.4, 2, 5], -140, -95, 1.4, ["#f2e8d6", "#e6d8c0"], 0.03, 0.85) +
          `<path d="M16.15 -33.6q.15 -.45 .55 -.35" fill="none" stroke="${TIEF}" stroke-width=".07" opacity=".7"/>` +
          haar(T, ohr, { n: 60, spitz: 0.04, L: 0.28, flow: () => 280, eimer: EIMER, wahl: (x, y, z) => stufe(0.35, z, 5), dez: 2, szene: 0 }),
      });
      /* --- Kopf --- */
      const kl = feld(kopf, 2.2, (x, y) => (y > -27 && x > 19 ? 0.15 : 0));
      const kflow = (x, y) => (x > 20.8 && y > -29 ? 162 : y > -26.6 ? 150 : x < 15.5 ? 135 : 186);
      let km = "";
      /* „M“ auf der Stirn (im Profil: drei kurze senkrechte Linien), Scheitellinien, Linien vom Augenwinkel über die Wange */
      km += falte(T, [[20, -34], [19.85, -33.1], [19.8, -32.3]], DK, 0.26, 0.85) + falte(T, [[19.1, -34.4], [18.95, -33.3], [19.05, -32.5]], DK, 0.24, 0.85) + falte(T, [[20.7, -33.2], [20.5, -32.5]], DK, 0.22, 0.8);
      km += falte(T, [[18.2, -34.5], [16.6, -34.2], [15, -33.2], [13.9, -31.6]], DK, 0.26, 0.8) + falte(T, [[18.4, -33.6], [16.8, -33.2], [15.3, -32]], DK, 0.22, 0.7);
      km += falte(T, [[19.4, -30.2], [18.2, -29.7], [16.9, -29.6], [15.8, -28.8]], DK, 0.26, 0.85) + falte(T, [[19.6, -28.6], [18.5, -28.2], [17.4, -27.6], [16.4, -26.9]], DK, 0.22, 0.75);
      s += teil(T, "#" + kopfId, T.lg("kkopf", [[0, "#a2845a"], [0.5, "#b29872"], [1, "#d6c3a0"]]), {
        blende: [0, 0.9, 0.4, 0.5, 0.02, 0.75],
        form: { a: 1, w: 1.3, b: 0.4, s: [SCH, 0.4], l: [HELL, 0.28], al: 0.25, wl: 0.9 },
        innen: `<g${zottel(T, "2.4 1", 0.18)}>${km}</g>` +
          /* heller Fell-Brillenring (unten breiter), Lippen und Kinn cremeweiß, Schnurrhaarkissen gewölbt, Okklusion unter dem Kiefer */
          mal(T, 0.18, `<ellipse cx="20.35" cy="-30.05" rx="1.35" ry="1.05" fill="#efe2c6" opacity=".8"/>`) +
          mal(T, 0.25, form(T, [[21.4, -27.8], [22.9, -27.6], [22.85, -26.7], [22.1, -26.1], [21.6, -25.2], [20.4, -24.9], [19.6, -25.6], [20.4, -26.6]], "#f2e8d4", ` opacity=".9"`)) +
          wulst(T, [[20.9, -28.3], [22.85, -27.9], [22.75, -26.6], [21.4, -26.4]], { a: 0.25, w: 0.35, b: 0.12, m: 0.15, s: [SCH, 0.4], l: [HELL, 0.5], al: 0.1, wl: 0.3 }) +
          schlag(T, ohrId, 0.25, 0.4, 0.2, TIEF, 0.35) +
          haar(T, kopf, { n: 360, spitz: 0.045, L: 0.32, flow: kflow, eimer: EIMER, wahl: (x, y, z) => stufe((kl(x, y) + 0.3) / 1.05, z, 5), dez: 2, szene: 0.06 }),
        ueber: randhaar(T, kopf, { n: 150, spitz: 0.035, L: 0.32, flow: kflow, ab: 0.5, eimer: EIMER, wahl: (x, y, z) => stufe((kl(x, y) + 0.3) / 1.05, z, 5), dez: 2, wo: (x, y) => !(x > 22.6 && y < -26.8 && y > -29.2), szene: 0.06 }),
      });
      /* Nasenspiegel: klein, bündig, ziegelrosa, dunkler Rand, Komma-Nasenloch; Philtrum und kurze Oberlippe */
      s += form(T, [[22.6, -29.05], [23.05, -28.8], [23.28, -28.25], [23.1, -27.85], [22.7, -27.85], [22.5, -28.3]], "#a06a5c") + falte(T, [[22.6, -29.05], [23.05, -28.8], [23.3, -28.25], [23.1, -27.85]], "#3a2018", 0.06, 0.7);
      s += `<path d="M23.22 -28.05q-.2 -.05 -.32 .12" fill="none" stroke="#1a0c08" stroke-width=".07"/><ellipse cx="22.85" cy="-28.85" rx=".14" ry=".05" fill="#fff" opacity=".45"/>`;
      s += `<path d="M22.95 -27.82Q22.9 -27.4 22.95 -27.15Q22.6 -26.85 22.1 -26.95" fill="none" stroke="#3a2418" stroke-width=".07" stroke-linecap="round" opacity=".85"/>`;
      /* Auge: Iris füllt die Lidspalte, Spindelpupille, innen grünlich, außen amber-gelbgrün, Lidschatten, Nickhaut */
      s += auge(T, 20.35, -30.1, 0.62, { ratio: 1.22, winkel: -6, iris: "#b4ae46", iris2: "#7e7020", mitte: "#8aa046", sklera: "#9a9030", ir: 1.12, pupille: "schlitz", pr: 0.24, lid: "#1e1610", lidw: 0.14, hoehle: 0.18, nick: "#8a5a54", fasern: true });
      /* Tasthaare: 4 Reihen auf dem Kissen, weiß, an der Wurzel kräftig; Brauen-Tasthaare */
      s += tasthaar(T, [22.4, -27.75, 1.5, 0.9, 4, 4], -18, 30, 6.4, ["#fbf8f0", "#f2ece0", "#d8cfc0"], 0.06, 0.85, "#5a4430");
      s += tasthaar(T, [20.9, -31.4, 0.3, 0.2, 1, 4], -100, -62, 2.6, ["#f6f2ea"], 0.035, 0.8);
      s += "</g>";
      return { svg: s, box: [-41, -36.2, 30.4, 0], fuesse: [-13.3, -10.7, 9.9, 12.4], kopf: [15, -36.4, 26, -23] };
    } },
  /* =================================================================
     KANINCHEN — Hauskaninchen, wildfarben (agouti), sitzend
     RECHERCHE: Oryctolagus cuniculus: Kopf-Rumpf 36–40 cm, gedrungener als der Hase, Ohren nicht länger als der
     Kopf mit Hals (≈ 11–12 cm), löffelförmig (Basis schmal und gerollt, breiteste Stelle bei ⅔ der Höhe, Spitze rund),
     außen dicht behaart, innen nur vorn rosa mit hellem Haarsaum, Spitze schmal dunkel gesäumt; Kopf keilförmig mit
     leichter Ramsnase, stumpfe Schnauze, volle Backe; Augen groß, seitlich, fast schwarzbraun, heller Fellring,
     Oberlid mit vielen nach hinten gerichteten Wimpern, Unterlid nasal Wimpern, Tasthaare über dem Auge; Nase
     behaart mit kommaförmigen Nasenlöchern, gespaltene Oberlippe (Y), Schnurrhaarkissen, kleines Kinn; im Sitzen
     liegen die langen Hinterfüße flach am Boden (Ferse unter der Keule), Sohlen dicht behaart ohne Ballen; Vorder-
     läufe kurz und gerade; Blume oben dunkel, unten weiß; Fell weich und dicht, Agouti-Haare (graue Unterwolle,
     ockergelbes Band, schwarze Spitze → „Pfeffer und Salz“), Rücken dunkler, Nacken rostrot, Kinn, Bauch,
     Brust und Blumen-Unterseite weiß bis creme.
     ================================================================= */
  { id: "kaninchen", de: "das Kaninchen", syl: "Ka-NIN-chen", it: "il coniglio", itSyl: "co-NI-glio", en: "rabbit",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.422, hoehe: 0.308,
    zeichne(T) {
      T.dez = 1;
      const SCH = "#4a3a2a", TIEF = "#2e2418", HELL = "#fff4e0";
      /* Agouti: schwarze Spitzen, ockergelbes Band, graubraun, hell (Bauch) */
      const EIMER = [["#1e1812", 0, 0.55, 0, "s"], ["#4e3e2c", 0, 0.42, 0, "s"], ["#8a7254", 0, 0.38, 0, "s"], ["#c4a26a", 0, 0.42, 0, "s"], ["#e8dcc4", 0, 0.45, 0, "s"]];
      const leib = [[-15.4, -2.2], [-17, -5.4], [-17.6, -9], [-16.8, -13.2], [-14.2, -17], [-9.6, -19.9], [-4.2, -19.7], [0.8, -18.6], [5, -16.6], [7, -16.8], [8.8, -13],
        [8.4, -10.4], [10.4, -9], [12.4, -8.1], [13.6, -7], [13.85, -5.4], [13.75, -3.4], [14, -2.2], [14.7, -1.7], [15.25, -1.2], [15.5, -0.5], [15.15, 0, 1], [12.1, 0, 1],
        [11.85, -0.9], [11.9, -3.2], [11.5, -4.4], [9, -3.6], [3, -2.6], [-2, -2.4], [-5.6, -2.5], [-9, -2.1], [-13.4, -1.5]];
      const leibId = pfad(T, leib);
      const kopf = [[5.2, -17.4], [6.6, -19.6], [8.6, -20.5], [11.4, -20], [13.4, -18.9], [14.9, -17.2], [15.95, -15.6], [16.35, -14.3], [16.2, -13.1], [15.7, -12.35], [15.3, -11.8],
        [14.6, -11.2], [13.4, -10.7], [11.6, -10.2], [9.6, -10.25], [7.8, -11], [6.4, -12.6], [5.4, -14.8]];
      const kopfId = pfad(T, kopf);
      const fuss = [[-14.6, -0.1], [-14.9, -1.4], [-14.1, -2.5], [-11, -2.75], [-8, -2.4], [-6.5, -2], [-5.5, -1.4], [-5.15, -0.6], [-5.5, 0, 1], [-14, 0, 1]];
      const fussId = pfad(T, fuss);
      /* Löffelohr: Basis schmal und gerollt, breiteste Stelle bei ⅔, Spitze rund (nach hinten geneigt) */
      const ohrN = [[6.8, -18.2], [6.5, -21.6], [5.6, -25], [4.7, -28.2], [4.3, -30.3], [4.7, -31.5], [5.8, -31.6], [7.2, -30.2], [8.2, -27.4], [8.8, -24.2], [9.1, -21.4], [9.2, -18.4]];
      const ohrNId = pfad(T, ohrN);
      const lf = feld(leib, 6, (x, y) => (y < -16 ? 0.05 : 0));
      const zone = (x, y) => klemm((-y - 4) / 13);         // 0 Bauch … 1 Rücken
      const flow = (x, y) => {
        if (x > 11.4 && y > -8) return 92;                                        // Vorderlauf
        if (x < -6 && y > -17 && Math.hypot(x + 10, y + 9) < 7.5) return Math.atan2(y + 9, x + 10) * 57 + 95;   // Wirbel um die Keule
        return 180 - 30 * klemm((y + 18) / 14);
      };
      /* Agouti-Wahl: Licht bestimmt hell/dunkel, im Rückenbereich 40–50 % schwarze Spitzen, Flanke 20–25 %, unten creme */
      const wahl = (x, y, z) => {
        const v = (lf(x, y) + 0.3) / 1.05, zo = zone(x, y);
        if (zo < 0.25) return v < 0.25 ? 2 : 4;
        if (T.rnd() < 0.18 + 0.32 * zo) return 0;
        return klemm(1 + Math.round(v * 2.4 + (z - 0.5)), 1, 3);
      };
      let s = "";
      /* --- ferne Glieder: Hinterfuß (1 cm Zehe vor dem nahen), Vorderlauf; 15–20 % dunkler --- */
      s += teil(T, schieb(fuss, 0.9, -0.05), "#8a7660", { form: { a: 0.6, w: 0.9, b: 0.3, s: [TIEF, 0.4] } });
      const fernV = schieb([[10.6, -9], [13.4, -9], [13.6, -6.2], [13.75, -3.4], [14, -2.2], [14.7, -1.7], [15.25, -1.2], [15.5, -0.5], [15.15, 0, 1], [12.1, 0, 1], [11.85, -0.9], [11.9, -3.2], [11.5, -6]], -1.5);
      s += teil(T, fernV, T.lg("knfern", [[0, "#8c7660"], [1, "#b8a88e"]]), {
        form: { a: 0.6, w: 0.9, b: 0.3, s: [TIEF, 0.45], l: [HELL, 0.15], al: 0.15, wl: 0.4 },
        innen: haar(T, fernV, { n: 50, spitz: 0.07, L: 0.4, flow: () => 92, eimer: EIMER, wahl: (x, y, z) => stufe(0.35, z, 4) + (y > -3 ? 1 : 0) }),
      });
      /* --- Blume: flauschiger Puschel an die Keule gedrückt, oben dunkel, unten eine weiße Sichel --- */
      const blume = [[-16.2, -9.6], [-17.6, -9.9], [-19, -9.2], [-19.6, -7.6], [-19.2, -6], [-18, -5.2], [-16.6, -5.6]];
      s += teil(T, blume, T.lg("blume", [[0, "#5a4a36"], [0.55, "#7a6850"], [0.62, "#f2ece0"], [1, "#fbf8f2"]], 0.2, 0, 0.8, 1), {
        innen: haar(T, blume, { n: 60, spitz: 0.06, L: 0.45, flow: (x, y) => (y < -7.4 ? 200 : 150), eimer: EIMER, wahl: (x, y, z) => (y > -6.9 && x < -16.8 ? 4 : z < 0.4 ? 0 : 2), dez: 2 }),
        ueber: randhaar(T, blume, { n: 110, spitz: 0.06, L: 0.55, flow: () => 190, ab: 0.8, eimer: [["#4a3a2a", 0, 0.7, 0, "s"], ["#f6f1e8", 0, 0.85, 0, "s"]], wahl: (x, y) => (y > -7.2 ? 1 : 0), kr: 0.3, dez: 2, szene: 0.3 }),
      });
      /* --- Leib --- */
      s += teil(T, "#" + leibId, T.lg("kanf", [[0, "#6e5a40"], [0.3, "#86704f"], [0.55, "#9c8462"], [0.8, "#cdbd9e"], [1, "#e4d8c0"]]), {
        form: { a: 2.2, w: 2.8, b: 0.9, s: ["#4e3e2c", 0.62], l: ["#b8a07a", 0.3], al: 0.6, wl: 1.8, r: ["#d8c8a8", 0.3], ar: 0.2, wr: 0.7 },
        innen:
          /* Nacken rostrot direkt hinter dem Ohransatz */
          mal(T, 0.5, form(T, [[3.8, -18.4], [6.6, -18.8], [7.8, -17], [6.6, -15.6], [4.4, -16.4]], "#b0683a", ` opacity=".7"`)) +
          /* Keule als Kugel: Glanz oben vorn, Schattensichel vorn unten (weich, kein Band) */
          wulst(T, [[-16.6, -9], [-15.4, -14.6], [-10.4, -16.4], [-4.8, -13.6], [-3.6, -8], [-5.6, -3.4], [-11, -2.8], [-15.6, -4.6]], { a: 1.4, w: 2, b: 0.8, m: 1.2, s: [SCH, 0.45], l: ["#c6b08c", 0.45], al: 0.6, wl: 1.8 }) +
          /* Okklusion: unter dem Kopf, am Fuß, zwischen Vorderlauf und Bauch */
          schlag(T, kopfId, 0.4, 1.8, 0.6, TIEF, 0.5) + schlag(T, fussId, 0.3, -0.4, 0.4, TIEF, 0.4) +
          mal(T, 0.5, form(T, [[11.6, -4.6], [9, -3.6], [3, -2.6], [-2, -2.4], [-5.6, -2.5], [-5.6, -3.6], [0, -3.8], [6, -4.4], [11, -5.8]], TIEF, ` opacity=".35"`)) +
          (T.fein ? `<rect x="-18" y="-21" width="33" height="20" fill="${TIEF}" filter="${T.rauschen("tick", { fx: 3.4, fy: 1.6, farbe: "#1e1812", staerke: 3.2, schwelle: 0.6, okt: 2 })}" opacity=".18"/>` : "") +
          haar(T, leib, { n: 640, spitz: 0.085, L: 0.9, flow, eimer: EIMER, wahl, szene: 0.05, lf: (x, y) => (x > 11 && y > -8 ? 0.5 : 1) }) +
          (T.fein ? [0, 1].map((i) => falte(T, [[14.45 - i * 0.95, -1.7 + i * 0.1], [14.7 - i * 0.95, -0.4]], TIEF, 0.08, 0.45)).join("") : ""),
        ueber: randhaar(T, leib, { n: 250, spitz: 0.06, L: 0.75, flow, ab: 0.5, eimer: EIMER, wahl, szene: 0.04, wo: (x, y) => y < -0.8 && !(x > 6 && y < -14) }) +
          randhaar(T, leib, { n: 90, spitz: 0.07, L: 0.7, flow: () => 120, ab: 0.75, eimer: EIMER, wahl: (x, y, z) => (z < 0.5 ? 4 : 3), wo: (x, y) => x > 8.5 && y > -11 && y < -6.5, szene: 0.1 }),
      });
      if (T.fein) s += [[15.1, -0.45], [14.25, -0.35]].map(([x, y]) => kralle(T, x, y, 0.42, 55, "#4a3a2e", 0.32)).join("");
      /* --- naher Hinterfuß: lang, flach am Boden, dicht behaart, hell; Zehen vorn --- */
      const fl = feld(fuss, 1.2);
      s += teil(T, "#" + fussId, T.lg("kfuss", [[0, "#a8967a"], [1, "#d2c4a6"]]), {
        form: { a: 0.6, w: 0.9, b: 0.3, s: [SCH, 0.5], l: [HELL, 0.3], al: 0.15, wl: 0.5 },
        innen: haar(T, fuss, { n: 110, spitz: 0.06, L: 0.45, flow: () => 178, eimer: EIMER, wahl: (x, y, z) => stufe((fl(x, y) + 0.3) / 1.1, z, 3) + 1 }) +
          (T.fein ? [0, 1, 2].map((i) => falte(T, [[-7.4 + i * 0.75, -2.1 + i * 0.25], [-7.1 + i * 0.75, -0.4]], TIEF, 0.08, 0.4)).join("") : "") +
          mal(T, 0.3, form(T, [[-14.6, -0.1], [-5.3, -0.1], [-5.6, -0.8], [-14.2, -0.9]], TIEF, ` opacity=".35"`)),
        ueber: randhaar(T, fuss, { n: 90, spitz: 0.05, L: 0.4, flow: () => 175, ab: 0.4, eimer: EIMER, wahl: (x, y, z) => stufe(0.55, z, 3) + 1, wo: (x, y) => y < -0.6, szene: 0.1 }),
      });
      s += randhaar(T, [[-14, -2.2], [-6, -2.6], [-6, -1.8], [-14, -1.6]], { n: 70, spitz: 0.07, L: 0.8, flow: () => 100, ab: 0, eimer: EIMER, wahl: (x, y, z) => (z < 0.3 ? 2 : 3), szene: 0.1 });
      if (T.fein) s += [[-5.3, -0.55], [-6, -0.4]].map(([x, y]) => kralle(T, x, y, 0.4, 50, "#4a3a2e", 0.32)).join("");
      s += `<g transform="translate(0 1)">`;
      /* --- fernes Ohr: eigene Form, weiter nach hinten gedreht, schmaler, zeigt die rosa Innenseite mit hellem Saum --- */
      const ohrF = [[8.4, -19.6], [7.9, -22.4], [7.2, -25.4], [6.6, -28.2], [6.6, -29.8], [7.4, -30.4], [8.4, -29.4], [9.3, -26.8], [9.8, -23.8], [10, -20.8]];
      s += teil(T, ohrF, "#6e5c46", {
        form: { a: 0.4, w: 0.6, b: 0.2, s: [TIEF, 0.45] },
        innen: mal(T, 0.15, form(T, [[8.6, -21], [8.2, -24.2], [7.6, -27.4], [7.5, -29.4], [8.4, -28.8], [9.2, -26], [9.5, -22.6]], "#a87e74", ` opacity=".75"`)) +
          tasthaar(T, [9.4, -22.6, 1.2, 4.8, 6, 2], -150, -110, 0.7, ["#efe4d0"], 0.025, 0.6),
      });
      /* --- nahes Ohr: außen dicht behaart, rosa nur als schmaler Streifen am Vorderrand mit hellem Haarsaum, Spitze dunkel gesäumt --- */
      const ol = feld(ohrN, 1.4);
      s += teil(T, "#" + ohrNId, T.lg("kohrn", [[0, "#6e5a42"], [0.5, "#8a7456"], [1, "#9a8466"]], 0, 0, 1, 0.2), {
        form: { a: 0.6, w: 0.9, b: 0.25, s: [SCH, 0.5], l: ["#c8b490", 0.35], al: 0.15, wl: 0.6 },
        innen: mal(T, 0.12, form(T, [[8.1, -21], [8.3, -24.4], [7.8, -27.6], [7, -29.8], [7.5, -29.4], [8.4, -27.2], [8.75, -24.2], [8.7, -21]], "#c49a90", ` opacity=".7"`)) +
          tasthaar(T, [8.6, -21.4, 0.4, 8, 10, 1], -150, -125, 0.75, ["#efe4d0"], 0.025, 0.7) +
          falte(T, [[4.5, -29.6], [4.6, -30.9], [5.4, -31.5], [6.4, -31.1], [7.2, -30.1]], "#2a2018", 0.3, 0.6) +
          falte(T, [[7, -19.4], [7.5, -20.9]], TIEF, 0.12, 0.4) +
          haar(T, ohrN, { n: 120, spitz: 0.035, L: 0.3, flow: () => 255, eimer: EIMER, wahl: (x, y, z) => stufe((ol(x, y) + 0.3) / 1.1, z, 4), dez: 2, szene: 0.05 }),
        ueber: randhaar(T, ohrN, { n: 90, spitz: 0.025, L: 0.18, flow: () => 255, ab: 0.6, eimer: EIMER, wahl: (x, y, z) => stufe(0.5, z, 4), dez: 2, szene: 0 }),
      });
      /* --- Kopf --- */
      const kl = feld(kopf, 2.6, (x, y) => (y > -13 && x > 12 ? 0.12 : 0));
      const kflow = (x, y) => (x > 13.5 ? 195 : y > -12.5 ? 160 : 182);
      const kwahl = (x, y, z) => { const v = (kl(x, y) + 0.3) / 1.05; if (y > -12.6 && x > 11) return 4; if (T.rnd() < 0.25 && y < -14) return 0; return klemm(1 + Math.round(v * 2.4 + (z - 0.5)), 1, 3); };
      s += teil(T, "#" + kopfId, T.lg("kkopfn", [[0, "#7a6648"], [0.45, "#94805e"], [0.8, "#b8a684"], [1, "#d8cab0"]]), {
        blende: [0.08, 1, 0.42, 0.55, 0, 0.8],
        form: { a: 1.1, w: 1.5, b: 0.45, s: [SCH, 0.45], l: ["#cdb894", 0.4], al: 0.3, wl: 1 },
        innen:
          /* volle Backe, Schnurrhaarkissen (hell, gewölbt), Kinn creme, Augenring (echter Fellring, hinten breiter) */
          wulst(T, [[7.4, -15.4], [11.2, -15.4], [13.4, -12.6], [11.8, -10.6], [8.2, -11]], { a: 0.8, w: 1.1, b: 0.4, m: 0.6, s: [SCH, 0.38], l: ["#cdb894", 0.35], al: 0.3, wl: 0.8 }) +
          mal(T, 0.3, form(T, [[13.2, -14.4], [15.4, -14.6], [16.1, -13.2], [15.4, -11.9], [13.6, -11.6], [12.9, -12.8]], "#d8ccb4", ` opacity=".85"`) +
            form(T, [[12.8, -11.6], [14.6, -11.3], [14.4, -10.8], [12.6, -10.5]], "#efe6d6", ` opacity=".9"`)) +
          wulst(T, [[13, -14.6], [15.6, -14.7], [16.1, -13], [15.2, -11.9], [13.2, -12]], { a: 0.35, w: 0.5, b: 0.15, m: 0.25, s: [SCH, 0.4], l: [HELL, 0.45], al: 0.12, wl: 0.4 }) +
          mal(T, 0.12, `<ellipse cx="10.5" cy="-16.3" rx="1.42" ry="1.2" fill="#e6d9bf" opacity=".9"/>`) +
          haar(T, kopf, { n: 300, spitz: 0.045, L: 0.42, flow: kflow, eimer: EIMER, wahl: kwahl, dez: 2, szene: 0.05 }) +
          haar(T, [[9.1, -16.4], [10.5, -17.6], [11.9, -16.3], [10.5, -15]], { n: 40, spitz: 0.03, L: 0.3, flow: (x, y) => Math.atan2(y + 16.3, x - 10.5) * 57, eimer: EIMER, wahl: () => 4, dez: 2, szene: 0 }),
        ueber: randhaar(T, kopf, { n: 200, spitz: 0.035, L: 0.45, flow: kflow, ab: 0.45, eimer: EIMER, wahl: kwahl, dez: 2, wo: (x, y) => !(x > 15.5 && y > -15.8 && y < -12), szene: 0.05 }),
      });
      /* Nasenspitze: behaart, wärmer; Nasenloch-Schlitz (Komma, 45°) mit hellem Oberrand, Lippenspalte Y, kurzer Mund */
      s += mal(T, 0.15, `<ellipse cx="15.7" cy="-14.5" rx=".75" ry=".6" fill="#7a5e4c" opacity=".55"/>`) + `<ellipse cx="15.55" cy="-15" rx=".22" ry=".1" fill="#fff" opacity=".4"/>`;
      s += `<path d="M16.3 -14.9C16.02 -14.8 15.8 -14.55 15.66 -14.25C15.58 -14.05 15.42 -13.95 15.3 -13.98C15.5 -14.3 15.78 -14.9 16.28 -15.02Z" fill="#3a2418"/><path d="M15.35 -14.1Q15.65 -14.8 16.25 -15.1" fill="none" stroke="#e8dcc8" stroke-width=".04" opacity=".8"/>`;
      s += `<path d="M15.55 -13.85Q15.7 -13.2 15.62 -12.6M15.62 -12.62Q15.35 -12.35 15 -12.38" fill="none" stroke="#3a2418" stroke-width=".05" stroke-linecap="round" opacity=".7"/>`;
      /* Auge: rund-oval, dicker Oberlid-Rand, viele Wimpern nach hinten-oben, untere Wimpern nasal, fast nur Pupille */
      s += auge(T, 10.5, -16.3, 0.72, { ratio: 1.25, winkel: -6, iris: "#3a2210", iris2: "#140a04", mitte: "#4a2c16", pr: 0.82, lid: "#140c08", lidw: 0.16, wimpern: [16, 0.62, "#1a120c"], unten: [6, 0.32], hoehle: 0.25, nick: "#b89088" });
      /* Tasthaare: aus den Follikelreihen des Kissens, dunkel, spitz; Tasthaare über dem Auge */
      s += tasthaar(T, [15.2, -13.8, 1.8, 1.4, 3, 4], -16, 28, 6.4, ["#2a2018", "#4a3a2a", "#8a7a68"], 0.05, 0.8, "#4a3426");
      s += tasthaar(T, [11, -17.9, 0.6, 0.2, 1, 4], -125, -95, 3.2, ["#2a2018"], 0.035, 0.75);
      s += "</g>";
      return { svg: s, box: [-20, -30.8, 22.2, 0], fuesse: [-9.6, -8.8, 12.6, 13.6], kopf: [3, -31, 22, -8.5] };
    } },
  /* =================================================================
     MEERSCHWEINCHEN — Hausmeerschweinchen, Glatthaar, dreifarbig (schwarz-rot-weiß)
     RECHERCHE: MSD/Merck Vet Manual u. a.: Körperlänge 20–25 cm, 0,7–1,2 kg; gedrungener, walzenförmiger Rumpf
     ohne sichtbaren Schwanz und ohne abgesetzten Hals, Hinterteil rund und schwer; großer, stumpfer Kopf mit hoher,
     gewölbter „Ramsnase“, vorn fast senkrecht, kleines zurückgesetztes Kinn, volle Backen; Augen groß, rund,
     vorstehend, seitlich, fast schwarz; „Rosenohren“: dünn, fast nackt, blütenblattförmig, der vordere obere Rand
     nach unten umgeschlagen, hängen seitlich am Kopf; Nasenlöcher kommaförmig, gespaltene Oberlippe; lange Tast-
     haare; kurze Beine, vorn 4 Zehen, hinten 3 Zehen mit Krallen, Hinterfuß sohlengängig lang; Glatthaar 2–3 cm,
     glänzend, liegt von vorn nach hinten an; Dreifarbig: unregelmäßige Platten Schwarz, Rot und Weiß, Ränder durch
     Haare verzahnt, oft weiße Blesse auf der Nase.
     ================================================================= */
  { id: "meerschweinchen", de: "das Meerschweinchen", syl: "MEER-schwein-chen", it: "la cavia", itSyl: "CA-via", en: "guinea pig",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.305, hoehe: 0.126,
    zeichne(T) {
      T.dez = 2;
      const TIEF = "#2a2420";
      /* Platten (unregelmäßig gelappt): Schwarz hinten, Rot im Sattel, Schwarz am Kopf mit weißer Blesse */
      const rot = [[-6.4, -12.8], [-3.4, -12.9], [-0.4, -12.6], [1.2, -12.3], [2.2, -11], [2.9, -9.6], [2.3, -8.4], [2.7, -7.1], [1.8, -5.9], [1.2, -4.6], [0.1, -4.1], [-0.9, -4.9],
        [-1.6, -4.2], [-2.8, -4.8], [-3.8, -6.2], [-4.6, -6.9], [-5.6, -6.4], [-6.3, -7.8], [-6.2, -9.6], [-7, -10.6]];
      const schwarzH = [[-14.2, -7.4], [-13, -11], [-9.8, -12.8], [-7.8, -12.6], [-7.2, -11], [-7.8, -9.6], [-7.2, -8.4], [-8.4, -7], [-8.1, -5.4], [-9.4, -4.4], [-10.4, -2.6], [-12.4, -1.8], [-14.2, -2]];
      const schwarzK = [[4.2, -12.6], [7, -12.4], [9.4, -11.2], [9.8, -9.8], [9.2, -8.7], [9.9, -7.4], [9.5, -6.1], [9.9, -4.9], [9.1, -3.4], [7.6, -2.6], [6.1, -3.4], [5.2, -4.9],
        [4.4, -5.6], [4.6, -7.2], [3.6, -8.6], [4.2, -10.2]];
      const platte = (x, y) => (T.inPoly(x, y, schwarzK) || T.inPoly(x, y, schwarzH) ? 2 : T.inPoly(x, y, rot) ? 1 : 0);
      /* Silhouette: rundes schweres Hinterteil, kein Hals, hohe stumpfe Ramsnase, kleines Kinn, Bauch leicht konvex */
      const leib = [[-11.2, -1.3], [-12.6, -3.4], [-13.2, -6], [-12.6, -8.6], [-10.8, -10.6], [-8, -11.8], [-4, -12.3], [0, -12.1], [3.4, -11.7], [6, -11.3], [8.4, -10.3],
        [10.2, -8.9], [11.4, -7.4], [12.05, -6.2], [12.33, -5.1], [12.25, -4.2], [11.95, -3.65], [11.6, -3.38], [11.72, -3.05], [11.5, -2.7], [10.8, -2.35], [9.4, -1.7],
        [7.6, -1.25], [4, -0.75], [0, -0.5], [-3.6, -0.62], [-6.4, -1.2], [-7.6, -1.65], [-8.7, -1.4], [-10.2, -1.2]];
      const leibId = pfad(T, leib);
      const lf = feld(leib, 4.4, (x, y) => (y > -2 ? 0.12 : 0));
      const flow = (x, y) => (x > 9.8 ? 190 : y > -3.6 ? 196 : 180 + 16 * klemm((y + 8) / 5));
      /* Eimer je Platte: [dunkel, mittel, hell] (Weiß, Rot, Schwarz) + Glanz auf Schwarz */
      const EIMER = [["#a8a7aa", 0, 0.32, 0, "s"], ["#cfc9be", 0, 0.3, 0, "s"], ["#fbf8f2", 0, 0.3, 0, "s"],
        ["#8a4416", 0, 0.4, 0, "s"], ["#a85a26", 0, 0.32, 0, "s"], ["#e0a062", 0, 0.32, 0, "s"],
        ["#060505", 0, 0.45, 0, "s"], ["#26221f", 0, 0.35, 0, "s"], ["#4d5058", 0, 0.32, 0, "s"]];
      const wahl = (x, y, z) => { const p = platte(x, y), v = klemm((lf(x, y) + 0.3) / 1.05 + (z - 0.5) * 0.3); return p * 3 + (p === 2 ? (v > 0.78 && y < -8 ? 2 : v > 0.4 ? 1 : 0) : Math.round(v * 2)); };
      let s = "";
      /* ferne Füße: 20–25 % dunkler, halb verdeckt */
      const vfuss = (x, f) => form(T, [[x, -1.4], [x + 0.9, -1.5], [x + 1.6, -1.05], [x + 2.05, -0.5], [x + 2, -0.1], [x + 0.1, -0.1]], f);
      s += vfuss(6.8, "#8a6a64") + form(T, [[-8.4, -1.4], [-5.6, -1.6], [-4.4, -1.1], [-4.1, -0.4], [-4.3, -0.1], [-8.6, -0.1]], "#86665f");
      /* Füße: Vorderfuß 2 cm, 3 sichtbare Zehenlappen mit hornfarbenen Krallen; Hinterfuß 4,3 cm, ganze Sohle auf */
      const zehen = (x, n, f) => { let t = ""; for (let i = 0; i < n; i++) { const zx = x + i * 0.36; t += form(T, [[zx, -0.6], [zx + 0.32, -0.66], [zx + 0.46, -0.38], [zx + 0.42, -0.06], [zx + 0.05, -0.06]], f); if (T.fein) t += kralle(T, zx + 0.48, -0.32, 0.26, 40, "#d8cbb8", 0.32); } return t; };
      s += form(T, [[-10.5, -0.2], [-10.4, -1.5], [-8.4, -1.8], [-6.6, -1.4], [-6.1, -0.6], [-6.4, -0.1]], "#d8d2c8") + form(T, [[-10.5, -0.12], [-6.3, -0.12], [-6.3, -0.4], [-10.4, -0.45]], "#c99a90") + zehen(-6.8, 3, "#d0a39a");
      s += form(T, [[8, -0.15], [8.1, -1.3], [9.1, -1.45], [9.6, -0.9], [9.5, -0.1]], "#ddd6cc") + zehen(9.1, 3, "#d6a39a");
      s += haar(T, [[-10.4, -1.5], [-7.4, -1.85], [-6.8, -1.1], [-10.3, -0.6]], { n: 70, spitz: 0.05, L: 0.5, flow: () => 12, eimer: EIMER, wahl: (x, y, z) => (z < 0.4 ? 1 : 2), szene: 0.2 }) + haar(T, [[8.1, -1.4], [9.2, -1.5], [9.4, -0.9], [8.2, -0.8]], { n: 20, spitz: 0.04, L: 0.45, flow: () => 20, eimer: EIMER, wahl: (x, y, z) => (z < 0.4 ? 1 : 2), szene: 0.2 });
      if (T.fein) s += `<path d="M-10.3 -.12h3.9M8.1 -.1h1.5" stroke="#9a7068" stroke-width=".12" stroke-linecap="round" opacity=".7"/>`;
      /* Rosenohr (vorab für den Schlagschatten) */
      const ohr = [[4.3, -9.5], [4.3, -10.4], [4.8, -11.2], [5.5, -11.7], [6.35, -11.75], [6.95, -11.35], [7.1, -10.75], [6.7, -10.3], [5.9, -9.9], [5, -9.3]];
      const ohrId = pfad(T, ohr);
      s += teil(T, "#" + leibId, "#e9e4da", {
        form: { a: 1.6, w: 2, b: 0.6, s: ["#5a5048", 0.55], l: ["#fff", 0.45], al: 0.4, wl: 1.3, r: ["#c4bcae", 0.35], ar: 0.15, wr: 0.5 },
        innen:
          /* Platten mit haarig verzahnten Rändern */
          `<g${zottel(T, "2.6 1.2", 0.5)}>` + mal(T, 0.06, form(T, rot, "#b8662a") + form(T, schwarzH, "#141211") + form(T, schwarzK, "#141211")) + "</g>" +
          /* Volumen: Hinterteil-Kugel, Schulter, Backe, Kopf; Bauch-Reflexband; Schatten des Ohrs */
          wulst(T, [[-13, -6], [-11.6, -10], [-7, -11.8], [-3.4, -9.4], [-3.4, -3.4], [-7, -1.4], [-11.6, -2]], { a: 1.1, w: 1.5, b: 0.7, m: 1.4, s: ["#2a2420", 0.25], l: ["#fff", 0.32], al: 0.4, wl: 1.2 }) +
          wulst(T, [[4.6, -8.6], [8.6, -8.4], [10, -5.4], [8.6, -2.6], [5.2, -3.4]], { a: 0.6, w: 0.9, b: 0.5, m: 1, s: ["#2a2420", 0.18], l: ["#fff", 0.2], al: 0.25, wl: 0.7 }) +
          wulst(T, [[1.6, -11.4], [5.6, -11.6], [7, -6], [5.4, -2.4], [2, -3]], { a: 0.8, w: 1.1, b: 0.4, m: 0.7, s: ["#2a2420", 0.3], l: ["#fff", 0.2], al: 0.3, wl: 0.8 }) +
          /* Glanz auf Schwarz als Bogen der Wölbung */
          `<path d="M-12.4 -7.6Q-11 -11 -7.6 -11.9M6.4 -11.6Q8.6 -11 9.6 -9.6" fill="none" stroke="#5a6070" stroke-width=".5" stroke-opacity=".35" stroke-linecap="round" filter="${weich(T, 0.25)}"/>` +
          schlag(T, ohrId, 0.35, 0.55, 0.25, TIEF, 0.45) +
          haar(T, leib, { n: 1100, spitz: 0.05, L: 1.25, flow, eimer: EIMER, wahl, szene: 0.04, lf: (x, y) => (x > 9 ? 0.25 : y > -2.5 ? 0.6 : 1) }),
        ueber: randhaar(T, leib, { n: 380, spitz: 0.04, L: 0.26, flow, ab: 0.3, eimer: EIMER, wahl, wo: (x, y) => x < 11.4 && y < -2, szene: 0.05 }) +
          randhaar(T, leib, { n: 200, spitz: 0.07, L: 0.55, kr: 0.3, flow: () => 150, ab: 0.6, eimer: EIMER, wahl: (x, y, z) => (z < 0.5 ? 0 : 1), wo: (x, y) => y > -2.2 && x > -11 && x < 10.4, szene: 0.15 }),
      });
      /* Rosenohr: dünn, fast nackt, vorderer oberer Rand umgeschlagen (konkave rosagraue Innenseite), durchscheinender Saum */
      s += teil(T, "#" + ohrId, T.lg("mohr", [[0, "#4a4442"], [1, "#3b3534"]]), {
        form: { a: 0.25, w: 0.35, b: 0.1, s: ["#000", 0.4] },
        innen: (T.fein ? `<path d="M4.8 -10.4q.8 -.6 1.8 -.5M4.9 -9.8q.7 -.3 1.6 -.1M5.3 -11.2q.6 -.3 1.2 -.2" fill="none" stroke="#6a5652" stroke-width=".035" opacity=".55"/>` : ""),
        ueber: /* umgeschlagener vorderer oberer Rand: konkave rosagraue Innenseite, Faltkante im Gegenlicht */
          form(T, [[5.4, -11.65], [6.3, -11.78], [6.95, -11.4], [7.2, -10.75], [6.9, -10.3], [6.6, -10.75], [6.1, -11.05], [5.55, -11.15]], T.lg("mohri", [[0, "#9a7c78"], [1, "#5a4644"]], 0, 0, 1, 1)) +
          `<path d="M5.4 -11.65Q6.5 -11.95 7.05 -11.4Q7.35 -10.8 6.9 -10.3" fill="none" stroke="#b89690" stroke-width=".08" stroke-opacity=".7"/><path d="M5.55 -11.15Q6.4 -10.95 6.85 -10.4" fill="none" stroke="#2a2220" stroke-width=".06" stroke-opacity=".55"/>`,
      });
      /* Nase und Mund: Nasenhaut rosagrau, Komma-Nasenloch, feine Lippenspalte, kurzer Mundwinkel, weiße Unterlippe */
      s += mal(T, 0.08, `<ellipse cx="12" cy="-5.1" rx=".32" ry=".27" fill="#b89a94" opacity=".85"/>`);
      s += `<path d="M12.28 -5.3Q12 -5.2 11.85 -4.92Q11.78 -4.78 11.66 -4.82" fill="none" stroke="#5a3c36" stroke-width=".08" stroke-linecap="round"/>`;
      s += `<path d="M12.18 -4.85Q12.2 -4.2 11.95 -3.62M11.95 -3.62Q11.78 -3.45 11.58 -3.46" fill="none" stroke="#6a4a44" stroke-width=".035" stroke-linecap="round"/><ellipse cx="11.95" cy="-5.32" rx=".1" ry=".05" fill="#fff" opacity=".45"/>`;
      /* Auge: rund, vorstehend, fast schwarz, Lidrand, Fellring (unten heller) */
      s += mal(T, 0.06, `<ellipse cx="7.7" cy="-7.45" rx=".75" ry=".72" fill="#3a302a" opacity=".85"/>`);
      s += auge(T, 7.7, -7.5, 0.5, { ratio: 1.1, iris: "#2a1a10", iris2: "#120a06", mitte: "#2a1a10", pr: 0.7, lid: "#0a0706", lidw: 0.12, fasern: false, hoehle: 0.15 });
      /* Tasthaare: aus dem Polster, nach vorn/vorn-unten, meist weiß mit Schattenstrich; über dem Auge, an der Backe */
      s += tasthaar(T, [11.7, -4.7, 1, 1, 4, 3], -18, 36, 5, ["#f6f2ea", "#ece6da", "#1e1a18"], 0.04, 0.85, "#6a5a52");
      s += tasthaar(T, [7.9, -8.3, 0.3, 0.1, 1, 3], -120, -80, 1.8, ["#1e1a18"], 0.025, 0.8) + tasthaar(T, [9.2, -5.6, 0.2, 0.2, 1, 2], 5, 25, 1.8, ["#1e1a18"], 0.02, 0.7);
      return { svg: s, box: [-13.4, -12.7, 17.1, 0], fuesse: [-8.3, 7.5, 9], kopf: [3.6, -13, 17.2, -1.5] };
    } },
  /* =================================================================
     HAMSTER — Goldhamster (Syrischer Hamster, Mesocricetus auratus), Wildfarbe
     RECHERCHE: MSD/Merck Vet Manual, Wikipedia „Golden hamster“: Kopf-Rumpf 15–18 cm, 110–140 g, Stummelschwanz im
     Fell verborgen; gedrungen, birnenförmig, hinten schwer, kurze Beine, Bauch nah am Boden; runder Kopf mit kurzer,
     stumpfer Schnauze, Stirnkuppe, Schnurrhaarkissen, kleines Kinn; große Backentaschen bis zur Schulter (Kopf unten
     breiter als oben); Augen groß, schwarz, vorstehend, rund; Ohren groß, rund, dünn, fast nackt, grau, am Ansatz
     eingeschnürt; rosa Nase mit Kommanasenlöchern, Y-Lippenspalte, gelbe Schneidezähne; Vorderpfoten kurz mit
     4 Fingern, Hinterpfoten länger, sohlengängig mit 5 Zehen, Sohlen und Ballen nackt rosa, Oberseite behaart;
     Fell dicht und weich: Rücken rotgold mit dunklen Haarspitzen (Agouti) und grauer Unterwolle, Bauch elfenbeinweiß,
     Grenze an der Flanke recht scharf; dunkle Wangenbinde („cheek flash“) vom Wangenbereich bogenförmig zur Schulter,
     davor/darüber ein weißer Halbmond; Tasthaare lang, hell und graubraun.
     ================================================================= */
  { id: "hamster", de: "der Hamster", syl: "HAMS-ter", it: "il criceto", itSyl: "cri-CE-to", en: "hamster",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.2, hoehe: 0.092,
    zeichne(T) {
      T.dez = 2;
      const TIEF = "#3a2614";
      /* Silhouette: birnenförmig, hinten schwer, Nackensenke, runder Kopf mit Stirnkuppe, stumpfe Schnauze, volle Backentasche */
      const leib = [[-7.3, -1.3], [-8.45, -3.1], [-8.75, -5.3], [-7.95, -7.15], [-6.3, -8.1], [-4.5, -8.3], [-2.3, -8.05], [-0.2, -7.45], [1.6, -6.95], [2.4, -6.8], [3.4, -7.05],
        [4.6, -7.05], [5.7, -6.65], [6.6, -5.95], [7.3, -5.05], [7.68, -4.35], [7.76, -3.85], [7.6, -3.42], [7.36, -3.15], [7.18, -2.88], [6.85, -2.62], [6.2, -2.2], [5.3, -1.75],
        [4.2, -1.45], [3, -1.2], [1.2, -0.9], [-0.8, -0.72], [-2.8, -0.72], [-4.6, -0.86], [-6, -1.12]];
      const leibId = pfad(T, leib);
      const lf = feld(leib, 3.2, (x, y) => (y > -1.6 ? 0.1 : 0));
      /* Fellzonen: 0 gold, 1 weiß (Bauch, Kehle), 2 dunkle Wangenbinde, 3 cremeweißer Halbmond */
      const binde = [[5.1, -4], [4.4, -4.02], [3.6, -3.7], [2.9, -3.2], [2.35, -2.7], [2.95, -2.9], [3.7, -3.25], [4.5, -3.55], [5.1, -3.65]];
      const mond = [[5.3, -4.4], [4.2, -4.45], [3.1, -4.05], [2.25, -3.35], [1.85, -2.7], [2.3, -2.65], [2.95, -3.3], [3.7, -3.82], [4.5, -4.1], [5.25, -4.1]];
      const grenze = (x) => -2.9 - 0.25 * Math.sin((x + 8) / 16 * Math.PI) + (x > 4 ? -(x - 4) * 0.35 : 0);
      const zone = (x, y) => (T.inPoly(x, y, binde) ? 2 : T.inPoly(x, y, mond) ? 3 : y > grenze(x) || (x > 6 && y > -3.6) ? 1 : 0);
      const EIMER = [["#6e3c16", 0, 0.45, 0, "s"], ["#a8662c", 0, 0.38, 0, "s"], ["#d39a5a", 0, 0.38, 0, "s"], ["#ecc48a", 0, 0.4, 0, "s"],
        ["#b8b0a2", 0, 0.38, 0, "s"], ["#ddd6c8", 0, 0.36, 0, "s"], ["#fbf8f2", 0, 0.42, 0, "s"],
        ["#3a3430", 0, 0.55, 0, "s"], ["#5a524e", 0, 0.45, 0, "s"], ["#4a2e18", 0, 0.5, 0, "s"]];
      const wahl = (x, y, z) => {
        const zo = zone(x, y), v = klemm((lf(x, y) + 0.3) / 1.05 + (z - 0.5) * 0.3);
        if (zo === 2) return 7 + (v > 0.6 ? 1 : 0);
        if (zo === 1 || zo === 3) return 4 + Math.round(v * 2);
        if (y < -5 && T.rnd() < 0.22) return 9;                       // Agouti: dunkle Haarspitzen oben
        return Math.round(v * 3);
      };
      const flow = (x, y) => {
        if (x > 4.6 && y > -5.6) return 195 + (y > -3.6 ? 20 : 0);    // Wange strahlenförmig nach hinten
        if (x < -6) return 245;                                         // Hinterteil: um die Rundung nach unten
        if (y > -2.4) return 200;                                       // Bauch nach hinten-unten
        return 182 + 30 * klemm((y + 6.5) / 4);                          // Rücken → Flanke
      };
      let s = "";
      /* ferne Pfoten: 20 % dunkler und kühler, halb verdeckt */
      const finger = (x, n, l, w, f) => { let t = ""; for (let i = 0; i < n; i++) { const zx = x + i * w * 0.9; t += form(T, [[zx, -0.3], [zx + w * 0.7, -0.32], [zx + w, -0.15], [zx + w * 0.9, -0.03], [zx + w * 0.1, -0.03]], f); if (T.fein) t += kralle(T, zx + w * 0.9, -0.12, 0.13, 45, "#e8dcd0", 0.3); } return t; };
      s += form(T, [[3, -0.9], [3.8, -0.95], [4.1, -0.5], [4, -0.05], [3, -0.05]], "#a8867e") + finger(3.9, 3, 0.25, 0.13, "#b8918a");
      s += form(T, [[-5.6, -0.9], [-4, -1], [-3.5, -0.5], [-3.6, -0.05], [-5.7, -0.05]], "#a28078") + finger(-3.7, 4, 0.3, 0.13, "#b08a82");
      /* nahe Pfoten: Vorderpfote 1,1 cm mit 4 schlanken Fingern, Hinterpfote 2,2 cm sohlengängig mit 5 Zehen, Ferse hinten; Oberseite behaart */
      s += form(T, [[3.7, -0.15], [3.75, -1.05], [4.6, -1.1], [4.95, -0.55], [4.9, -0.1]], "#efe7da") + finger(4.6, 4, 0.3, 0.13, "#e7b3aa");
      s += form(T, [[-6.5, -0.12], [-6.6, -0.75], [-5.9, -1.3], [-4.6, -1.35], [-4.3, -0.7], [-4.4, -0.1]], "#efe7da") + form(T, [[-6.55, -0.06], [-4.6, -0.06], [-4.6, -0.16], [-6.5, -0.18]], "#c9908a") + finger(-4.55, 5, 0.32, 0.13, "#e7b3aa");
      s += haar(T, [[-6.5, -0.4], [-5.9, -1.3], [-4.5, -1.35], [-4.4, -0.5]], { n: 60, spitz: 0.03, L: 0.25, flow: () => 20, eimer: EIMER, wahl: (x, y, z) => 5 + (z > 0.5 ? 1 : 0), szene: 0.2 }) +
        haar(T, [[3.75, -0.5], [3.8, -1.05], [4.6, -1.1], [4.8, -0.5]], { n: 30, spitz: 0.03, L: 0.22, flow: () => 25, eimer: EIMER, wahl: (x, y, z) => 5 + (z > 0.5 ? 1 : 0), szene: 0.2 });
      /* Ohren (vorab, hinter dem Kopf: unteres Viertel vom Kopffell bedeckt) */
      const ohrF = [[3.6, -6.9], [3.75, -8], [4.3, -8.7], [4.9, -8.75], [5.2, -8.1], [5, -7]];
      s += form(T, ohrF, "#7e6e6a");
      const ohr = [[2.1, -6.7], [1.95, -7.7], [2.35, -8.6], [3.05, -9.05], [3.85, -8.95], [4.35, -8.3], [4.35, -7.4], [3.95, -6.6]];
      s += teil(T, ohr, T.lg("hohr", [[0, "#a08e8a"], [1, "#8a7672"]]), {
        form: { a: 0.18, w: 0.25, b: 0.07, s: ["#3a2e2c", 0.4] },
        innen: mal(T, 0.08, form(T, [[2.55, -7.4], [2.6, -8.3], [3.1, -8.7], [3.7, -8.6], [3.95, -8], [3.8, -7.3], [3.2, -7]], "#5e4e4c", ` opacity=".75"`)) +
          `<path d="M2.9 -7.3Q2.8 -8.1 3.3 -8.45" fill="none" stroke="#c8a8a2" stroke-width=".06" stroke-opacity=".6" filter="${weich(T, 0.03)}"/>`,
        ueber: `<path d="M1.98 -7.6Q2.1 -8.7 3.05 -9.07Q4 -9.1 4.38 -8.2" fill="none" stroke="#d8aaa2" stroke-width=".09" stroke-opacity=".75"/>` +
          randhaar(T, ohr, { n: 40, spitz: 0.012, L: 0.08, flow: () => 270, ab: 0.8, eimer: [["#d8ccc4", 0, 0.3, 0, "s"]], wahl: () => 0, szene: 0 }),
      });
      /* Leib mit Kopf */
      s += teil(T, "#" + leibId, T.lg("hfell", [[0, "#b8763e"], [0.35, "#c98c4e"], [0.6, "#d29a5c"], [0.66, "#ede4d4"], [1, "#f4eee4"]]), {
        form: { a: 1.2, w: 1.5, b: 0.5, s: ["#7a5232", 0.34], l: ["#fff2dc", 0.4], al: 0.3, wl: 1, r: ["#f0e6d4", 0.4], ar: 0.1, wr: 0.4 },
        innen:
          /* Farbzonen mit ineinandergreifenden Haarkanten */
          `<g${zottel(T, "4 1.6", 0.22)}>` + form(T, [[-9, grenze(-9)], [-7, grenze(-7)], [-5, grenze(-5)], [-3, grenze(-3)], [-1, grenze(-1)], [1, grenze(1)], [3, grenze(3)], [4.6, grenze(4.6)], [6.2, -3.85], [7.2, -3.5], [8.2, -3.3], [8.2, 0.2], [-9, 0.2]], "#f1eadc") +
          mal(T, 0.06, form(T, mond, "#f3ece0") + form(T, binde, "#5a524e")) + "</g>" +
          /* Volumen: Rumpfkugel hinten, Keule, Schulter, Backentasche, Kopfkugel; Okklusion */
          wulst(T, [[-8.6, -4.4], [-7.4, -7.6], [-4.2, -8.2], [-1, -6.6], [-1.4, -2.6], [-4, -1.2], [-7.4, -1.6]], { a: 0.8, w: 1.1, b: 0.5, m: 1.1, s: ["#4a2a12", 0.18], l: ["#fff2dc", 0.3], al: 0.3, wl: 0.9 }) +
          wulst(T, [[2.4, -4.4], [5.6, -4.8], [6.9, -3.4], [5.6, -1.9], [3, -1.6]], { a: 0.4, w: 0.55, b: 0.18, m: 0.3, s: ["#4a2a12", 0.3], l: ["#fff8ec", 0.3], al: 0.15, wl: 0.4 }) +
          mal(T, 0.15, `<ellipse cx="5.35" cy="-5.15" rx=".62" ry=".55" fill="${TIEF}" opacity=".3"/>`) +
          mal(T, 0.15, `<path d="M2.1 -6.9Q3.2 -6.5 4.3 -7Q3.2 -6.1 2.1 -6.4Z" fill="${TIEF}" opacity=".35"/>`) +
          (T.fein ? `<rect x="-9" y="-8.4" width="14" height="5" fill="#8a7d70" filter="${T.rauschen("unterwolle", { fx: 6, fy: 3, farbe: "#8a7d70", staerke: 3, schwelle: 0.66, okt: 2 })}" opacity=".25"/>` : "") +
          haar(T, leib, { n: 1350, spitz: 0.032, L: 0.4, flow, eimer: EIMER, wahl, szene: 0.05, lf: (x, y) => (x > 6.6 ? 0.45 : 1) }),
        ueber: randhaar(T, leib, { n: 600, spitz: 0.028, L: 0.32, flow, ab: 0.5, eimer: EIMER, wahl, wo: (x, y) => !(x > 7.2 && y < -3.2 && y > -4.8), szene: 0.05, lf: undefined }) +
          randhaar(T, leib, { n: 140, spitz: 0.035, L: 0.38, kr: 0.35, flow: () => 150, ab: 0.55, eimer: EIMER, wahl: (x, y, z) => 4 + (z > 0.5 ? 1 : 0), wo: (x, y) => y > -1.6 && x > -6.8 && x < 5.4, szene: 0.15 }),
      });
      /* Nase: eingebettete Kuppe, Komma-Nasenloch, Glanz, Mittelfurche → Y-Lippenspalte; Schneidezahn-Andeutung, Kinn */
      s += mal(T, 0.04, form(T, [[7.38, -4.38], [7.7, -4.35], [7.84, -3.95], [7.72, -3.6], [7.42, -3.62], [7.28, -3.98]], T.lg("hnase", [[0, "#e6a9a0"], [1, "#b9776f"]])));
      s += `<path d="M7.8 -3.88q-.16 0 -.22 .14" fill="none" stroke="#5a2a28" stroke-width=".05" stroke-linecap="round"/><ellipse cx="7.55" cy="-4.22" rx=".08" ry=".04" fill="#fff" opacity=".7"/>`;
      s += `<path d="M7.62 -3.6Q7.62 -3.4 7.5 -3.25M7.5 -3.25Q7.42 -3.14 7.3 -3.14" fill="none" stroke="#9a6a62" stroke-width=".025" stroke-linecap="round"/>`;
      s += form(T, [[7.3, -3.12], [7.42, -3.12], [7.4, -2.94], [7.3, -2.94]], "#e8d5a0", ` opacity=".85"`);
      /* Auge: rund, gewölbt, einheitlich schwarzbraun, großes weiches Fensterlicht */
      s += auge(T, 5.35, -5.18, 0.37, { ratio: 1.08, iris: "#1e120a", iris2: "#0d0805", mitte: "#1e120a", pr: 0.6, lid: "#0a0604", lidw: 0.1, fasern: false, hoehle: 0.3 });
      s += haar(T, [[4.6, -5.6], [5.35, -5.9], [6.1, -5.5], [5.35, -4.6]], { n: 24, spitz: 0.015, L: 0.14, flow: (x, y) => Math.atan2(y + 5.18, x - 5.35) * 57, eimer: EIMER, wahl: () => 2, szene: 0 });
      /* Tasthaare nach vorn, 60 % weißlich mit dunkler Basis, 40 % graubraun */
      s += tasthaar(T, [7.3, -3.85, 0.7, 0.55, 4, 4], -25, 40, 3.6, ["#f4efe8", "#f4efe8", "#5a4a40"], 0.025, 0.85, "#4a3a32");
      return { svg: s, box: [-8.9, -9.1, 11.2, 0], fuesse: [-5.2, -4.5, 4.1, 4.4], kopf: [1.6, -9.2, 11.2, -1.2] };
    } },
  /* =================================================================
     MAUS — Hausmaus (Mus musculus)
     RECHERCHE: Wikipedia „House mouse“, Grinnell/Storer, Illinois DNR: Kopf-Rumpf (KRL) 7,5–10 cm, Schwanz etwa
     körperlang, fast nackt mit feinen Schuppenringen und kurzen Borsten, oben dunkler; 12–30 g; Rumpftiefe ≈ ⅓ KRL,
     Bauch frei über dem Boden, Rücken über der Hüfte am höchsten, Hinterteil schräg gerundet, Schwanzansatz auf
     ≈ 40 % der Rumpfhöhe; Hinterfuß 15–19 mm (≈ 19 % KRL), schmal, 5 Zehen, Vorderfuß ≈ 8 % KRL mit 4 Fingern und
     Daumenstummel; spitze Schnauze, Nasenspiegel bildet die Spitze, Schnurrhaarkissen, kleines zurückgesetztes Kinn,
     gelb-orange Schneidezähne; Auge klein, aber vorstehend, schwarz; Ohren groß (11–14 mm), rund, dünn, fast nackt,
     grau-rosa durchscheinend; Fell oben graubraun agouti mit ockerfarbenen Spitzen, Bauch heller grau bis gelblich-
     grau ohne scharfe Grenze; Tasthaare bis ⅓ KRL lang.
     ================================================================= */
  { id: "maus", de: "die Maus", syl: "MAUS", it: "il topo", itSyl: "TO-po", en: "mouse",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.21, hoehe: 0.047,
    zeichne(T) {
      T.dez = 2;
      const TIEF = "#1e1814";
      const EIMER = [["#2e261e", 0, 0.42, 0, "s"], ["#54483a", 0, 0.38, 0, "s"], ["#7a6c5a", 0, 0.36, 0, "s"], ["#a29480", 0, 0.38, 0, "s"],
        ["#b3a27f", 0, 0.5, 0, "s"], ["#c8bca6", 0, 0.38, 0, "s"]];
      /* Silhouette: Rücken über der Hüfte am höchsten, Hinterteil schräg, Nackendelle, gewölbte Stirn, Nasenspiegel als Spitze */
      const leib = [[-3.5, -0.95], [-4.3, -1.45], [-4.66, -2.35], [-4.3, -3.2], [-3.2, -3.75], [-1.8, -3.88], [-0.2, -3.62], [1, -3.2], [1.65, -3.08], [2.3, -3.22],
        [3.2, -3.1], [3.9, -2.74], [4.4, -2.22], [4.68, -1.85], [4.78, -1.66], [4.68, -1.48], [4.45, -1.36], [4.25, -1.2], [3.75, -1.02], [3, -0.96], [2.2, -0.92],
        [1.2, -0.86], [0, -0.82], [-1.2, -0.84], [-2.2, -0.92]];
      const leibId = pfad(T, leib);
      const lf = feld(leib, 1.5, (x, y) => (y > -1.3 ? 0.12 : 0));
      const flow = (x, y) => {
        if (x > 2.6) return Math.abs(x - 3.5) < 0.5 && Math.abs(y + 2.25) < 0.5 ? Math.atan2(y + 2.25, x - 3.5) * 57 + 90 : 180;
        if (x < -2 && Math.hypot(x + 2.6, y + 1.9) < 1.5) return 245;   // um die Keule
        return y > -1.6 ? 220 : 192;
      };
      const wahl = (x, y, z) => {
        const v = klemm((lf(x, y) + 0.3) / 1.05 + (z - 0.5) * 0.3);
        if (y > -1.45) return v > 0.5 ? 5 : 3;                         // Bauch, Kehle heller
        if (y < -2.6 && T.rnd() < 0.15) return 4;                      // ockerfarbene Agouti-Spitzen
        return T.rnd() < 0.05 ? 0 : 1 + Math.round(v * 2);
      };
      let s = "";
      /* --- Schwanz: Ansatz auf ≈ 40 % Rumpfhöhe, Bogen zum Boden, feine Schuppenringe, Borsten, oben dunkler --- */
      const sc = [[-4.2, -2.05], [-5.6, -1.75], [-7, -1.05], [-8.6, -0.5], [-10.4, -0.28], [-12, -0.36], [-13.2, -0.6]];
      const sw = [0.44, 0.34, 0.27, 0.22, 0.17, 0.12, 0.06];
      const schw = schlauch(sc, sw, true);
      let ringe = "";
      if (T.fein) for (let i = 2; i < 150; i++) {
        const k = abschnitt(sc, sw.map((w) => w * 1.1), i / 150, i / 150 + 0.001, 1), a = k[0], b = k[k.length - 1];
        ringe += `M${folge(a)}Q${folge([(a[0] + b[0]) / 2 - 0.03, (a[1] + b[1]) / 2, b[0], b[1]])}`;
      }
      s += teil(T, schw, T.lg("mschw", [[0, "#7d6e64"], [0.6, "#a08c80"], [1, "#b8a49a"]], 0, 0, 0, 1), {
        form: { a: 0.08, w: 0.1, b: 0.03, s: ["#3a2e28", 0.4], l: ["#e8d8d0", 0.4], al: 0.03, wl: 0.06 },
        innen: (ringe ? `<path d="${ringe}" fill="none" stroke="#4a3a32" stroke-width=".01" stroke-opacity=".18"/>` : "") + schlag(T, leibId, 0.05, 0.1, 0.08, TIEF, 0.4),
        ueber: randhaar(T, schw, { n: 70, spitz: 0.006, L: 0.07, flow: () => 180, ab: 0.6, eimer: [["#6a5a50", 0, 0.5, 0, "s"]], wahl: () => 0, szene: 0 }),
      });
      /* ferne Füße: 30 % dunkler, teilweise verdeckt */
      const zehen = (x, n, w, l, f) => { let t = ""; for (let i = 0; i < n; i++) t += form(T, [[x + i * w * 0.85, -0.16], [x + i * w * 0.85 + l * 0.6, -0.17], [x + i * w * 0.85 + l, -0.05], [x + i * w * 0.85 + l * 0.9, -0.01], [x + i * w * 0.85, -0.01]], f) + (T.fein ? kralle(T, x + i * w * 0.85 + l * 0.92, -0.05, 0.06, 40, "#bdb3a8", 0.3) : ""); return t; };
      s += form(T, [[-2.6, -0.1], [-2.5, -0.3], [-1.3, -0.25], [-1, -0.08], [-1.2, -0.01], [-2.55, -0.01]], "#7e6c66") + zehen(1.95, 3, 0.1, 0.18, "#7e6c66");
      /* Ohren hinter dem Kopf: fernes (40 % sichtbar, behaarte Rückseite), nahes rund und durchscheinend */
      s += form(T, [[2.25, -3.1], [2.3, -3.85], [2.65, -4.3], [3.1, -4.35], [3.35, -3.9], [3.2, -3.2]], "#5e5048");
      const ohr = [[1.3, -2.9], [1.15, -3.55], [1.35, -4.15], [1.85, -4.48], [2.45, -4.45], [2.82, -4.05], [2.88, -3.45], [2.6, -2.95]];
      s += teil(T, ohr, T.lg("mohr", [[0, "#6e5c56"], [0.35, "#b89a92"], [1, "#a8887e"]], 0, 0, 1, 1), {
        form: { a: 0.12, w: 0.16, b: 0.05, s: ["#3a2a26", 0.35] },
        innen: mal(T, 0.06, form(T, [[1.55, -3.15], [1.45, -3.7], [1.75, -4.2], [2.3, -4.3], [2.6, -3.95], [2.55, -3.35], [2.1, -3.05]], "#7e6660", ` opacity=".45"`) +
            `<ellipse cx="1.75" cy="-4.15" rx=".45" ry=".25" fill="#e0b0a8" opacity=".4"/>`) +
          (T.fein ? `<path d="M2.1 -3.2Q1.9 -3.7 2 -4.1M2 -3.8Q1.75 -3.95 1.6 -4.1M2.05 -3.55Q2.35 -3.8 2.45 -4.1" fill="none" stroke="#9a6a62" stroke-width=".012" opacity=".3"/>` : "") +
          `<path d="M2.6 -3.1Q2.35 -3.35 2.45 -3.65" fill="none" stroke="#5a4440" stroke-width=".04" opacity=".5"/>`,
        ueber: randhaar(T, ohr, { n: 40, spitz: 0.006, L: 0.04, flow: () => 270, ab: 0.8, eimer: [["#8a7470", 0, 0.4, 0, "s"]], wahl: () => 0, szene: 0 }),
      });
      /* --- Leib mit Kopf --- */
      s += teil(T, "#" + leibId, T.lg("mfell", [[0, "#5e5040"], [0.4, "#76685a"], [0.62, "#8e826e"], [0.8, "#b4a890"], [1, "#bcb098"]]), {
        form: { a: 0.6, w: 0.8, b: 0.2, s: ["#2e261e", 0.5], l: ["#d8ccb4", 0.35], al: 0.15, wl: 0.5, r: ["#c4b8a2", 0.4], ar: 0.05, wr: 0.18 },
        innen:
          /* Keule als Volumen, Schulter, Kopf; Okklusion an Kinn, Ohransatz, Keule/Bauch */
          wulst(T, [[-4, -1.2], [-3.9, -2.6], [-2.6, -3.1], [-1.4, -2.4], [-1.3, -1.1], [-2.6, -0.85]], { a: 0.3, w: 0.42, b: 0.12, m: 0.2, s: ["#2e261e", 0.35], l: ["#d8ccb4", 0.3], al: 0.1, wl: 0.3 }) +
          wulst(T, [[2.4, -2.9], [3.6, -2.95], [4.5, -1.9], [3.9, -1.1], [2.6, -1.2]], { a: 0.2, w: 0.28, b: 0.08, m: 0.15, s: ["#2e261e", 0.3], l: ["#e0d4bc", 0.3], al: 0.08, wl: 0.2 }) +
          mal(T, 0.06, `<ellipse cx="4.35" cy="-1.55" rx=".3" ry=".24" fill="#cfc4ae" opacity=".8"/><ellipse cx="2.2" cy="-3" rx=".6" ry=".14" fill="${TIEF}" opacity=".4"/><ellipse cx="3.7" cy="-1.05" rx=".5" ry=".12" fill="${TIEF}" opacity=".35"/>`) +
          wulst(T, [[4.05, -1.85], [4.65, -1.75], [4.6, -1.38], [4.15, -1.35]], { a: 0.06, w: 0.08, b: 0.03, m: 0.04, s: ["#2e261e", 0.35], l: ["#fff", 0.4], al: 0.03, wl: 0.06 }) +
          (T.fein ? `<rect x="-4.8" y="-4" width="9.6" height="3.2" fill="#2e261e" filter="${T.rauschen("mtick", { fx: 9, fy: 5, farbe: "#2e261e", staerke: 1.2, schwelle: 0.6, okt: 2 })}" opacity=".18"/>` : "") +
          haar(T, leib, { n: 1450, spitz: 0.018, L: 0.2, flow, eimer: EIMER, wahl, szene: 0.05, lf: (x, y) => (x > 3.6 ? 0.5 : 1) }) +
          haar(T, [[3.15, -2.25], [3.5, -2.6], [3.85, -2.25], [3.5, -1.9]], { n: 30, spitz: 0.008, L: 0.09, flow: (x, y) => Math.atan2(y + 2.25, x - 3.5) * 57, eimer: EIMER, wahl: () => 2, szene: 0 }),
        ueber: randhaar(T, leib, { n: 520, spitz: 0.014, L: 0.12, flow, ab: 0.5, eimer: EIMER, wahl, wo: (x, y) => !(x > 4.5), szene: 0.05 }),
      });
      /* nahe Beine: Hinterlauf (Unterschenkel, Ferse leicht angehoben, langer schmaler Fuß, Zehen), Vorderlauf (Unterarm, Handgelenk, 4 Finger) */
      const hlauf = [[-2.2, -1.2], [-1.75, -1.05], [-2.15, -0.62], [-2.4, -0.38], [-1.7, -0.3], [-1.25, -0.22], [-1.1, -0.06], [-1.3, -0.01], [-3.1, -0.01], [-3.2, -0.12], [-2.95, -0.6]];
      s += teil(T, hlauf, T.lg("mfuss", [[0, "#8a7c6c"], [0.55, "#b8a49c"], [1, "#a8948c"]]), {
        form: { a: 0.08, w: 0.12, b: 0.03, s: ["#3a2e28", 0.4] },
        innen: haar(T, [[-2.2, -1.2], [-1.75, -1.05], [-2.15, -0.62], [-2.95, -0.6]], { n: 40, spitz: 0.014, L: 0.15, flow: () => 120, eimer: EIMER, wahl: (x, y, z) => 2 + (z > 0.5 ? 1 : 0), szene: 0.2 }) +
          (T.fein ? `<path d="M-1.65 -.28l.06 .25M-1.45 -.25l.05 .22" stroke="#7a6460" stroke-width=".015" opacity=".6"/>` : ""),
      });
      s += zehen(-1.45, 3, 0.09, 0.2, "#b8a49c");
      const vlauf = [[1.95, -1.05], [2.4, -1], [2.42, -0.45], [2.55, -0.25], [2.4, -0.1], [2.05, -0.06], [1.95, -0.4]];
      s += teil(T, vlauf, T.lg("mvl", [[0, "#8e826e"], [1, "#b8a49c"]]), { innen: haar(T, vlauf, { n: 20, spitz: 0.012, L: 0.12, flow: () => 95, eimer: EIMER, wahl: () => 3, szene: 0 }) });
      s += zehen(2.3, 4, 0.08, 0.16, "#b8a49c");
      /* Nasenspiegel (bildet die Spitze), feuchter Glanz, Komma-Nasenloch, Philtrum, kurzer Mund, Schneidezähne */
      s += form(T, [[4.55, -1.88], [4.74, -1.82], [4.84, -1.64], [4.76, -1.47], [4.58, -1.47], [4.5, -1.66]], "#c09088") + `<ellipse cx="4.68" cy="-1.78" rx=".05" ry=".025" fill="#e6c0b8"/>`;
      s += `<path d="M4.82 -1.6q-.06 -.01 -.09 .05" fill="none" stroke="#5a3430" stroke-width=".018"/><path d="M4.68 -1.47Q4.66 -1.36 4.6 -1.3Q4.5 -1.24 4.38 -1.26" fill="none" stroke="#6a4a44" stroke-width=".012"/>`;
      s += form(T, [[4.47, -1.3], [4.52, -1.3], [4.515, -1.22], [4.47, -1.22]], "#d8a456", ` opacity=".85"`);
      /* Auge: rund, vorstehend, schwarz, Lidrand, weiches Fensterlicht */
      s += auge(T, 3.5, -2.25, 0.25, { ratio: 1.12, iris: "#140c08", iris2: "#040202", mitte: "#1e140c", pr: 0.6, lid: "#0a0604", lidw: 0.12, fasern: false, hoehle: 0.25 });
      /* Tasthaare aus 4–5 Reihen auf dem Polster, spitz, dunkel → durchscheinend; über dem Auge, an der Wange */
      s += tasthaar(T, [4.42, -1.72, 0.32, 0.3, 4, 4], -22, 30, 2.9, ["#2a221c", "#3e342c", "#8a7e70"], 0.016, 0.8, "#2a221c");
      s += tasthaar(T, [3.55, -2.6, 0.1, 0.05, 1, 2], -115, -90, 0.8, ["#2a221c"], 0.01, 0.7) + tasthaar(T, [3.2, -1.6, 0.1, 0.05, 1, 2], 160, 175, 0.6, ["#2a221c"], 0.008, 0.6);
      return { svg: s, box: [-13.4, -4.7, 7.6, 0], fuesse: [-2.1, -1.7, 2.4, 2.6], kopf: [0.8, -4.8, 7.6, -0.6] };
    } },
  /* =================================================================
     WELLENSITTICH — Wildfarbe grün (Hahn), am Boden stehend
     RECHERCHE: Wikipedia, birdsinbackyards, Omlet, birds-online: Gesamtlänge ≈ 18 cm, Schwanz 8–9 cm (≈ 45–50 %);
     Stirn, Gesicht und Kehle gelb („Maske“), kleine blauviolette Wangenflecken, je Kehlseite drei schwarze Punkte
     (der äußere am unteren Ende des Wangenflecks); Hinterkopf, Nacken und Mantel gelb mit schwarzer Wellenzeichnung,
     die in Schuppen übergeht; Flügeldecken schwarz mit gelben Säumen (Dachziegel), Schirmfedern breit gesäumt, Schwingen
     grünlich-schwarz mit grünem Außensaum; Brust, Bauch und Bürzel grün; Wachshaut beim Hahn königsblau, sattelförmig;
     Schnabel olivgrau/hornfarben, stark gebogen, zum großen Teil von Bartfedern verdeckt; Auge des Altvogels: schmaler
     weiß-grauer Irisring um große schwarze Pupille, kein nackter Augenring; Schwanz kobaltblau, mittleres Paar am
     längsten und spitz, seitliche Federn gestuft mit gelbem Mittelfleck; Beine blaugrau, Zehen zygodaktyl (2 nach vorn,
     2 nach hinten), genetzte Laufschuppen, Querschilder an den Zehen.
     ================================================================= */
  { id: "wellensittich", de: "der Wellensittich", syl: "WEL-len-sit-tich", it: "il pappagallino", itSyl: "pap-pa-gal-LI-no", en: "budgie",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.146, hoehe: 0.109,
    zeichne(T) {
      T.dez = 2;
      const SW = "#1c1f1c";
      let s = `<g transform="translate(0 .9)">`;
      /* --- Schwanz: mittleres Paar am längsten und spitz (kobalt-türkis), seitliche gestuft, äußerste mit gelbem Streif --- */
      const V = [-1.1, -3.5], a = Math.PI * 16 / 180, ux = -Math.cos(a), uy = Math.sin(a);
      const feder = (L, w, dv, f, gelb) => {
        const nx = -uy, ny = ux, b = [V[0] + nx * dv, V[1] + ny * dv];
        const m = [b, [b[0] + ux * L * 0.35, b[1] + uy * L * 0.35], [b[0] + ux * L * 0.75 + nx * dv * 0.15, b[1] + uy * L * 0.75 + ny * dv * 0.15], [b[0] + ux * L + nx * dv * 0.2, b[1] + uy * L + ny * dv * 0.2]];
        const k = schlauch(m, [w, w, w * 0.8, 0.04]);
        return form(T, k, f) + (gelb ? form(T, abschnitt(m, [w * 0.25, w * 0.3, w * 0.25, 0.02], 0.3, 0.8, 3), "#e8d050", ` opacity=".6"`) : "") +
          `<path d="M${folge(m[0])}L${folge(m[3])}" stroke="#9ab8e8" stroke-width=".025" opacity=".25"/>` + form(T, abschnitt(m.map(([x, y]) => [x - nx * w * 0.2, y - ny * w * 0.2]), [w * 0.2, w * 0.2, w * 0.15, 0.01], 0, 0.95, 3), "#7ab0e8", ` opacity=".22"`);
      };
      s += feder(6.6, 0.75, -0.42, "#1a3070", true) + feder(7.2, 0.75, -0.28, "#1d3a80") + feder(7.8, 0.8, -0.12, "#203e88");
      s += feder(8.4, 0.85, 0.12, "#2a5aa8") + feder(8.9, 0.9, 0.02, "#1f4a98");
      /* --- Körper und Kopf als ein Umriss: Nackeneinbuchtung, Brust vorgewölbt (Birne), Bauch rund, Steiß zum Schwanz --- */
      const leib = [[-1, -3.3], [-1.7, -4.4], [-0.9, -6.6], [0.4, -8.6], [1.45, -9.85], [1.65, -10.85], [2.55, -11.6], [3.55, -11.6], [4.25, -11.05], [4.6, -10.35],
        [4.62, -9.9], [4.45, -9.3], [4.3, -8.75], [4.05, -8.1], [4.15, -7.05], [3.95, -5.7], [3.35, -4.3], [2.55, -3.05], [1.65, -2.35], [0.6, -2.2], [-0.3, -2.55]];
      const leibId = pfad(T, leib);
      const fl = [[0.9, -9.25], [1.9, -8.2], [2.3, -6.6], [2.05, -5.1], [1.4, -4.1], [0.4, -3.6], [-0.6, -3.8], [-1.25, -5.1], [-0.5, -7.4], [0.2, -8.7]];
      const flId = pfad(T, fl);
      const maske = [[1.4, -10.4], [1.7, -11.2], [2.6, -11.75], [3.7, -11.7], [4.4, -11], [4.7, -10.1], [4.5, -9.2], [4.15, -8.5], [3.6, -8.3], [3, -8.6], [2.4, -9.3], [1.8, -9.8]];
      /* Wellenzeichnung: Bögen um die Kopfwölbung (nach vorn konkav), vorn dünn, hinten kräftig, über den Scheitel bis über das Auge */
      const W = [];
      for (let i = 0; i < 9; i++) {
        const rr = 0.95 + i * 0.16, cx = 3.45, cy = -10.25, a0 = -112 + i * 4, a1 = -205 - i * 3, pts = [];
        for (let j = 0; j <= 6; j++) { const t = a0 + (a1 - a0) * j / 6 + (T.rnd() - 0.5) * 6; pts.push([cx + Math.cos(t * Math.PI / 180) * rr * 1.05, cy + Math.sin(t * Math.PI / 180) * rr]); }
        const w0 = 0.05 + i * 0.012;
        W.push([pts, pts.map((p, j) => (j === 0 ? 0.01 : j === 6 ? 0.015 : w0 * (0.8 + T.rnd() * 0.4))), 0.08, 0.96]);
      }
      /* Mantel: schwarze Federn mit gelben Spitzen (Schuppen) bis an den Flügel */
      let mantel = "";
      for (let r = 0; r < (T.fein ? 6 : 3); r++) for (let j = 0; j < 4; j++) {
        const x = 1.2 - r * 0.3 + j * 0.3 + (r % 2) * 0.15, y = -9.6 + r * 0.32 + j * 0.2;
        if (!T.inPoly(x, y, leib) || T.inPoly(x, y, maske) || T.inPoly(x, y, fl)) continue;
        const w = 0.17 + r * 0.02;
        mantel += form(T, [[x - w, y - w], [x + w, y - w], [x + w * 0.9, y + w * 0.1], [x, y + w * 0.7], [x - w * 0.9, y + w * 0.1]], "#ead458") + form(T, [[x - w * 0.85, y - w * 1.1], [x + w * 0.85, y - w * 1.1], [x + w * 0.75, y - w * 0.05], [x, y + w * 0.38], [x - w * 0.75, y - w * 0.05]], SW);
      }
      /* Brustgefieder: Federspitzen in Reihen (Dachziegel), an der Kehle klein, zur Flanke größer, 3–5 % Kontrast */
      let brust = "";
      if (T.fein) for (let r = 0; r < 12; r++) for (let j = 0; j < 8; j++) {
        const t = r / 11, x = 3.9 - j * 0.42 * (0.6 + t) - r * 0.08, y = -7.9 + r * 0.48, w = 0.1 + t * 0.12;
        if (!T.inPoly(x, y, leib) || T.inPoly(x, y, fl)) continue;
        brust += `M${folge([x - w, y - w * 0.3])}q${folge([w, w * 0.9, w * 2, 0])}`;
      }
      s += teil(T, "#" + leibId, T.rg("wkoerper", [[0, "#a8e070"], [0.45, "#6cc23a"], [0.8, "#4a9c2c"], [1, "#2f6a1c"]], 0.75, 0.25, 0.75), {
        form: { a: 0.75, w: 0.95, b: 0.25, s: ["#1e4a12", 0.5], l: ["#d8f0a0", 0.3], al: 0.2, wl: 0.6, r: ["#5a9c3a", 0.45], ar: 0.06, wr: 0.2 },
        innen:
          form(T, maske, T.rg("wkopf", [[0, "#fbf08a"], [0.55, "#f2db4a"], [1, "#cfae2e"]], 0.6, 0.25, 0.75)) +
          mal(T, 0.15, form(T, [[2.4, -9.2], [3.2, -8.5], [4.1, -8.45], [3.6, -8.1], [2.6, -8.6]], "#8a7a10", ` opacity=".35"`)) +
          `<g${zottel(T, "8 4", 0.04)}>` + zeichnung(T, W, "#141410", 0.9) + mantel + "</g>" +
          (brust ? `<path d="${brust}" fill="none" stroke="#2e6a1e" stroke-width=".03" stroke-opacity=".18"/><path d="${brust}" fill="none" stroke="#c8f090" stroke-width=".02" stroke-opacity=".15" transform="translate(0 -.04)"/>` : "") +
          schlag(T, flId, 0.25, 0.3, 0.2, "#0e2a08", 0.5),
        ueber: (T.fein ? (() => { let d = ""; for (let i = 0; i < 30; i++) { const t = i / 29, x = 4.15 - t * 3.2 + (t > 0.7 ? (t - 0.7) * 1.4 : 0), y = -7.3 + t * 5.0; d += `M${folge([x, y])}q${folge([-0.05, 0.12, -0.16, 0.18])}`; } return `<path d="${d}" fill="none" stroke="#3a7a22" stroke-width=".04" stroke-opacity=".5"/>`; })() : ""),
      });
      /* --- Flügel: Deckfedern (schwarz, gelbe Sichel am Ende, Dachziegel; Schulter klein, große Decken gestreckt), Schirmfedern, Schwingen gestuft --- */
      /* Schwingen: 7 einzelne Federn, unter den Decken hervor, Spitzen gestuft und rund, grüner Außensaum, Schaft */
      let schwingen = "";
      for (let i = 6; i >= 0; i--) {
        const t = i / 6, x0 = 1.3 - t * 1.6, y0 = -4.9 + t * 0.5, L = 3.3 - t * 1.0;
        const m = [[x0, y0], [x0 - L * 0.5, y0 + L * 0.42], [x0 - L * 0.9, y0 + L * 0.66]];
        const k = schlauch(m, [0.5, 0.5, 0.36], true);
        schwingen += form(T, k, i % 2 ? "#232823" : "#272c27") + T.linie(k.slice(0, 4), "#5a9a3a", 0.05, ` stroke-opacity=".85"`) + T.linie(m, "#4e564c", 0.018, ` stroke-opacity=".6"`);
      }
      s += schwingen;
      let fw = "";
      /* Schirmfedern (3) mit breitem gelbgrünem Saum */
      for (let i = 0; i < 3; i++) {
        const x0 = -0.1 - i * 0.35, y0 = -6.4 + i * 0.7, m = [[x0, y0], [x0 - 0.7, y0 + 1.1], [x0 - 1.05, y0 + 1.8]];
        fw += form(T, schlauch(m, [0.75, 0.7, 0.4], true), "#9aa83a") + form(T, schlauch(m.map(([x, y]) => [x + 0.05, y - 0.1]), [0.6, 0.56, 0.3], true), SW);
      }
      /* Deckfedern: Reihen parallel zur Flügelvorderkante, von unten nach oben gelegt (obere überdecken untere) */
      const reihen = T.fein ? 9 : 4;
      for (let r = reihen - 1; r >= 0; r--) {
        const t = r / (reihen - 1), gr = 0.5 + 0.45 * t, n = T.fein ? 7 - Math.floor(r / 3) : 3;
        for (let j = 0; j < n; j++) {
          const u = (j + (r % 2) * 0.5) / n;
          const x = 1.95 - u * 2.05 - t * 0.5, y = -8.7 + u * 1.25 + t * 3.0;
          if (!T.inPoly(x, y, fl)) continue;
          const w = 0.23 * gr * (T.fein ? 1 : 1.6), h = w * (1 + 0.4 * t);
          const F = [[x - w, y - h], [x + w, y - h], [x + w * 0.95, y + h * 0.15], [x + w * 0.2, y + h * 0.8], [x - w * 0.6, y + h * 0.6]];
          fw += form(T, F, "#dcc850") + form(T, F.map(([px, py]) => [x + (px - x) * 0.9, y - h * 0.14 + (py - y) * 0.9]), SW);
        }
      }
      s += teil(T, "#" + flId, SW, {
        innen: fw + mal(T, 0.2, `<ellipse cx="0.6" cy="-7.6" rx=".9" ry=".5" fill="#4a5258" opacity=".3" transform="rotate(-50 .6 -7.6)"/>`) +
          formlicht(T, flId, { a: 0.4, w: 0.5, b: 0.15, s: ["#000", 0.45], l: ["#6a7a70", 0.25], al: 0.1, wl: 0.3 }),
      });
      /* --- Gesicht: Wangenfleck (gestreckt, blauviolett, Federstruktur), Kehlpunkte (Tropfen, nach vorn kleiner) --- */
      s += `<g transform="rotate(58 3.72 -9.5)"><ellipse cx="3.72" cy="-9.5" rx=".46" ry=".27" fill="${T.lg("wange", [[0, "#6a5ad8"], [1, "#4c48c4"]])}"/>` +
        (T.fein ? `<path d="M3.4 -9.55q.3 -.12 .6 0M3.45 -9.42q.28 -.1 .55 0" fill="none" stroke="#8a9ae8" stroke-width=".03" opacity=".35"/>` : "") + `</g>`;
      const tropfen = (x, y, r) => `<path d="M${folge([x, y - r])}C${folge([x + r * 1.1, y - r, x + r * 0.7, y + r * 0.6, x, y + r * 1.3])}C${folge([x - r * 0.7, y + r * 0.6, x - r * 1.1, y - r, x, y - r])}Z" fill="#151515"/>`;
      s += tropfen(3.5, -9.05, 0.12) + tropfen(3.88, -8.82, 0.1) + tropfen(4.2, -8.68, 0.075);
      /* --- Auge: runder Lidrand, schmaler hellgrauer Irisring, große Pupille, kein nackter Ring --- */
      s += auge(T, 3.3, -10.42, 0.25, { ratio: 1.02, iris: "#d4d2ca", iris2: "#a8a69e", mitte: "#e2e0d8", sklera: "#b8b6ae", ir: 1.02, pr: 0.62, lid: "#3a3428", lidw: 0.1, fasern: false });
      /* --- Wachshaut (Sattel, matt königsblau, rundes Nasenloch) und Schnabel (stark gebogener Haken, zur Hälfte von Bartfedern verdeckt) --- */
      s += form(T, [[4.2, -10.85], [4.55, -10.9], [4.82, -10.62], [4.84, -10.28], [4.55, -10.12], [4.2, -10.2]], T.lg("wachs", [[0, "#4a6ad0"], [1, "#2e47a0"]]));
      s += `<circle cx="4.6" cy="-10.6" r=".055" fill="#1a2a60"/><path d="M4.3 -10.8q.25 -.1 .45 0" stroke="#fff" stroke-width=".08" opacity=".15" fill="none"/>`;
      s += form(T, [[4.48, -10.2], [4.86, -10.25], [4.98, -9.85], [4.82, -9.35], [4.55, -9.0, 1], [4.6, -9.45], [4.45, -9.8]], T.lg("schnabel", [[0, "#c2b284"], [0.7, "#a89a6c"], [1, "#8a8060"]]));
      s += `<path d="M4.6 -10.15Q4.92 -9.95 4.85 -9.45" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width=".04"/><path d="M4.62 -9.1l-.07 .1" stroke="#5a5444" stroke-width=".05"/>`;
      /* Bartfedern über der Schnabelbasis, Stirnfedern über der Wachshaut */
      s += form(T, [[4.22, -9.98], [4.52, -9.92], [4.6, -9.62], [4.5, -9.36], [4.26, -9.34]], "#e2c844", ` opacity=".92"`) + `<path d="M4.3 -9.85q.15 .08 .25 .02M4.32 -9.62q.14 .08 .24 .02M4.33 -9.42q.12 .06 .2 .01" fill="none" stroke="#b8a030" stroke-width=".025" opacity=".6"/>`;
      
      s += "</g>";
      /* --- Beine und Füße: kurzer Lauf mit Netzschuppen, Zehen 2 nach vorn / 2 nach hinten mit Ballen, Krallen stark gebogen --- */
      const fuss = (x, f, d) => {
        let t = T.linie([[x - 0.05, -1.25], [x, -0.85], [x + 0.06, -0.45]], f, 0.36);
        for (const [dx, l, ri] of [[1, 1.25, 1], [1, 0.95, 1], [-1, 0.75, -1], [-1, 0.55, -1]]) {
          const ex = x + dx * l, ey = -0.12;
          t += T.linie([[x + 0.05, -0.42], [x + dx * l * 0.5, -0.24], [ex, ey]], f, 0.2) + `<circle cx="${zahl(x + dx * l * 0.5)}" cy="-.22" r=".1" fill="${f}"/>`;
          if (T.fein) t += kralle(T, ex, ey + 0.02, 0.2, ri > 0 ? 75 : 105, "#3a3a42", 0.42);
        }
        if (T.fein) t += `<path d="M${zahl(x - 0.1)} -1.05h.24M${zahl(x - 0.08)} -.8h.24M${zahl(x - 0.06)} -.58h.22" stroke="${d}" stroke-width=".025" opacity=".5"/>`;
        return t;
      };
      s += fuss(1.55, "#7e8698", "#5a6070") + fuss(0.9, "#9aa2b6", "#6a7084");
      return { svg: s, box: [-9.6, -10.85, 5, 0], fuesse: [1, 1.6], kopf: [1.4, -11.1, 5.2, -7.1] };
    } },
  /* =================================================================
     GOLDFISCH — Komet (Carassius auratus)
     RECHERCHE: FishBase (Carassius auratus), Animal Diversity Web, about-goldfish.com „Comet“, Animal-World,
     Morphometrie-Studie: Körper wie die Giebel, aber schlanker (Höhe ≈ 32 % SL), Rücken- und Bauchlinie gleichmäßig
     gewölbt; Kopf ≈ 28 % SL, Schnauze länger als das Auge (Auge ≈ 27 % der Kopflänge), endständiges kleines Maul
     ohne Barteln, Doppel-Nasenloch; 25–31 Rundschuppen entlang der Seitenlinie in schrägen Reihen, zum Rücken, Bauch
     und Schwanzstiel kleiner; Seitenlinie als Porenreihe (eine Pore je Schuppe); lange Rückenflosse (> 15 Strahlen,
     vorn ein gesägter Hartstrahl), Beginn bei ≈ 48 % SL; Afterflosse mit Hartstrahl; Bauchflossen unter dem Rücken-
     flossenbeginn, Brustflossen tief hinter dem Kiemendeckel; Komet: einfache, tief gegabelte, lange Schwanzflosse
     (≈ 60 % SL und mehr), Lappen schmal und spitz; Farbe metallisch orange-gold, Rücken dunkler rot-orange, Bauch
     heller, Flossen durchscheinend orange; Auge mit goldener Iris.
     ================================================================= */
  { id: "goldfisch", de: "der Goldfisch", syl: "GOLD-fisch", it: "il pesce rosso", itSyl: "PE-sce ROS-so", en: "goldfish",
    gruppe: "Haustiere", lebensraum: "Zuhause", schwimmt: true,
    laenge: 0.155, hoehe: 0.06,
    zeichne(T) {
      T.dez = 2;
      let s = `<g transform="translate(0 .75)">`;
      /* Flosse: eigener Verlauf Basis → Rand, Strahlen verjüngt und außen Y-gegabelt, Saum dunkler */
      const flosse = (pts, basis, rand, n, o = {}) => {
        const [bx0, by0, bx1, by1] = T.box(pts);
        const g = T.lg("fl" + (T._fn = (T._fn || 0) + 1), [[0, "#f07a1a", 0.9], [0.65, "#f39a40", 0.6], [1, "#f6b870", 0.35]],
          zahl((basis[0][0] - bx0) / ((bx1 - bx0) || 1)), zahl((basis[0][1] - by0) / ((by1 - by0) || 1)), zahl((rand[0][0] - bx0) / ((bx1 - bx0) || 1)), zahl((rand[0][1] - by0) / ((by1 - by0) || 1)));
        let st = "", st2 = "";
        if (T.fein) for (let i = 0; i <= n; i++) {
          const t = i / n, ax = basis[0][0] + (basis[1][0] - basis[0][0]) * t, ay = basis[0][1] + (basis[1][1] - basis[0][1]) * t;
          const ex = rand[0][0] + (rand[1][0] - rand[0][0]) * t, ey = rand[0][1] + (rand[1][1] - rand[0][1]) * t;
          const mx = ax + (ex - ax) * 0.66, my = ay + (ey - ay) * 0.66, k = o.kr || 0;
          st += `M${folge([ax, ay])}Q${folge([(ax + mx) / 2 + k, (ay + my) / 2 - k, mx, my])}`;
          const nx = -(ey - ay) * 0.035, ny = (ex - ax) * 0.035;
          st2 += `M${folge([mx, my])}L${folge([ex + nx, ey + ny])}M${folge([mx, my])}L${folge([ex - nx, ey - ny])}`;
        }
        return teil(T, pts, g, {
          innen: (st ? `<path d="${st}" fill="none" stroke="#c0500e" stroke-width=".04" stroke-opacity=".5"/><path d="${st2}" fill="none" stroke="#c0500e" stroke-width=".018" stroke-opacity=".45"/>` : "") + (o.extra || ""),
          ueber: `<use href="#${T.id("t" + T._n)}" fill="none" stroke="#b8500e" stroke-width=".02" stroke-opacity=".35"/>`,
        });
      };
      /* ferne Brustflosse (nach vorn versetzt, blass) */
      s += `<g opacity=".35">` + flosse([[4.1, -2.6], [3.4, -2.1], [2.7, -1.5], [3.1, -2.2], [3.7, -2.75]], [[4.05, -2.65], [3.75, -2.8]], [[2.75, -1.55], [3.2, -2.25]], 6) + "</g>";
      /* Schwanzflosse (Komet): lang, tief gegabelt (≈ 66 %), schmale spitze Lappen, S-förmig, oberer Lappen etwas länger */
      const schwanz = [[-2.6, -4.02], [-3.8, -4.7], [-5.4, -5.45], [-7, -6.05], [-8.75, -6.6, 1], [-7.6, -5.55], [-6.3, -4.6], [-4.85, -3.62, 1], [-6.2, -2.75], [-7.4, -1.85], [-8.45, -0.95, 1], [-6.9, -1.3], [-5.3, -2.0], [-3.8, -2.55], [-2.6, -3.12]];
      s += flosse(schwanz, [[-2.7, -4.15], [-2.7, -3.05]], [[-8.6, -6.5], [-8.3, -1.0]], 18, { kr: 0.05 });
      /* Rückenflosse: Basis auf der Rückenkontur ab ≈ 48 % SL, vorn am höchsten (≈ 50 % Körperhöhe), Hartstrahl gesägt */
      const ruecken = [[2.05, -5.15], [1.75, -6.0], [1.5, -6.62, 1], [0.6, -6.25], [-0.2, -5.65], [-0.75, -4.95], [-0.95, -4.45, 1], [0.4, -4.76], [1.3, -4.98]];
      s += flosse(ruecken, [[1.95, -5.1], [-0.85, -4.5]], [[1.5, -6.6], [-0.9, -4.55]], 17, { extra: T.fein ? `<path d="M2 -5.12L1.52 -6.58" stroke="#9a3a0a" stroke-width=".07"/><path d="M1.9 -5.5l.07 -.03M1.8 -5.8l.07 -.03M1.7 -6.1l.07 -.03M1.6 -6.38l.06 -.03" stroke="#9a3a0a" stroke-width=".03"/>` : "" });
      /* Afterflosse mit Hartstrahl, Bauchflosse unter dem Rückenflossenbeginn */
      s += flosse([[-0.35, -2.8], [-0.8, -2.1], [-1.25, -1.55, 1], [-1.3, -2.3], [-1.25, -3.02]], [[-0.4, -2.78], [-1.2, -3]], [[-1.2, -1.6], [-1.28, -2.4]], 6, { extra: T.fein ? `<path d="M-.38 -2.8L-1.2 -1.62" stroke="#9a3a0a" stroke-width=".06"/>` : "" });
      s += flosse([[2.25, -2.15], [1.8, -1.4], [1.25, -0.75, 1], [1.4, -1.4], [1.6, -2.05]], [[2.2, -2.12], [1.65, -2.05]], [[1.3, -0.8], [1.4, -1.35]], 7);
      /* Körper */
      const leib = [[6.6, -3.7], [6.45, -4.15], [6, -4.55], [5, -4.95], [3.8, -5.15], [2.9, -5.2], [1.6, -5.1], [0.4, -4.75], [-0.8, -4.25], [-1.7, -3.97], [-2.5, -3.95], [-2.95, -4.05],
        [-2.95, -3.1], [-2.5, -3.2], [-1.7, -3.2], [-0.8, -2.85], [0.4, -2.4], [1.6, -2.1], [2.9, -2.05], [3.8, -2.1], [5, -2.35], [5.9, -2.75], [6.35, -3.15], [6.58, -3.48]];
      const leibId = pfad(T, leib);
      const oben = (x) => { const k = kurve(leib.slice(0, 13), 4); let b = k[0]; for (const p of k) if (Math.abs(p[0] - x) < Math.abs(b[0] - x)) b = p; return b[1]; };
      const unten = (x) => { const k = kurve(leib.slice(12).concat([leib[0]]), 4); let b = k[0]; for (const p of k) if (Math.abs(p[0] - x) < Math.abs(b[0] - x)) b = p; return b[1]; };
      /* Schuppen: nur der freie Hinterrand als feiner Bogen + helle Innenkante, schräge Reihen, zu Rücken/Bauch/Stiel kleiner;
         Glanzband auf der oberen Flanke an jeder Schuppe gebrochen; Seitenlinie: eine Pore je Schuppe */
      let rand = "", innen = "", glanz = "", poren = "";
      if (T.fein) for (let c = 0; c < 21; c++) {
        const x = 3.75 - c * 0.335;
        const o = oben(x), u = unten(x), h = u - o;
        const zeilen = Math.round(h / 0.3);
        for (let r = -2; r <= zeilen + 2; r++) {
          const y = o + ((r + (c % 2) * 0.5) / Math.max(1, zeilen)) * h + c * 0.07, v = (y - o) / h;
          if (v > 1.05 || v < -0.05) continue;
          const kante = Math.abs(v - 0.45) * 2, stiel = x < -1.6 ? 0.75 : 1;
          const k = 0.21 * (1 - 0.3 * kante) * stiel, st = v < 0.3 ? 0.45 : v > 0.72 ? 0.3 : 1;
          rand += `M${folge([x, y - k])}Q${folge([x - k * 1.15, y, x, y + k])}`;
          if (st > 0.5) innen += `M${folge([x + 0.035, y - k * 0.8])}Q${folge([x - k * 0.95 + 0.035, y, x + 0.035, y + k * 0.8])}`;
          if (v > 0.22 && v < 0.42) glanz += `<ellipse cx="${zahl(x + k * 0.5)}" cy="${zahl(y)}" rx="${zahl(k * 0.38)}" ry="${zahl(k * 0.6)}"/>`;
        }
        const lv = 0.42 + (c / 20) * 0.08, ly = o + lv * h;
        if (x > -2.3) poren += `M${folge([x + 0.12, ly])}h.08`;
      }
      const lf = feld(leib, 1.4);
      s += teil(T, "#" + leibId, T.lg("gold", [[0, "#c0420e"], [0.3, "#e0661a"], [0.55, "#ef7a12"], [0.82, "#f6b260"], [1, "#f8cf8a"]]), {
        form: { a: 0.6, w: 0.8, b: 0.22, s: ["#b8551a", 0.35], l: ["#ffe2a8", 0.3], al: 0.15, wl: 0.5, r: ["#ffd8a0", 0.35], ar: 0.05, wr: 0.18 },
        innen:
          /* Glanzband: weich darunter, an jeder Schuppe gebrochen darüber */
          mal(T, 0.25, `<path d="M4.4 -4.55Q1.2 -4.75 -2.2 -3.85L-2.2 -3.62Q1.2 -4.25 4.4 -4.05Z" fill="#ffe9b0" opacity=".35"/>`) +
          (glanz ? `<g fill="#ffe9b0" opacity=".22" filter="${weich(T, 0.03)}">${glanz}</g>` : "") +
          (rand ? `<path d="${rand}" fill="none" stroke="#8a2e08" stroke-width=".025" stroke-opacity=".3"/><path d="${innen}" fill="none" stroke="#ffe2a8" stroke-width=".03" stroke-opacity=".3"/>` : "") +
          (poren ? `<path d="${poren}" stroke="#6a2006" stroke-width=".035" stroke-opacity=".45"/><path d="${poren}" stroke="#ffe6c0" stroke-width=".02" stroke-opacity=".45" transform="translate(0 .035)"/>` : "") +
          /* Kopf ohne Schuppen; Kiemendeckel als konvexer Bogen (verjüngt), heller Hautsaum, Schlagschatten auf die erste Schuppenreihe; Präoperculum */
          form(T, [[6.6, -3.7], [6.45, -4.15], [6, -4.55], [5, -4.95], [4.05, -5.1], [3.85, -4.2], [3.85, -3.2], [4.15, -2.2], [5, -2.35], [5.9, -2.75], [6.35, -3.15]], T.lg("fkopf", [[0, "#cc5214"], [0.45, "#ef7f1e"], [0.85, "#f6b468"], [1, "#f8cc8c"]])) +
          wulst(T, [[4.3, -4.6], [5.9, -4.4], [6.4, -3.5], [5.6, -2.6], [4.4, -2.6]], { a: 0.3, w: 0.4, b: 0.2, m: 0.45, s: ["#a8400c", 0.22], l: ["#fff0c8", 0.3], al: 0.1, wl: 0.3 }) +
          mal(T, 0.08, `<path d="M4.02 -4.95Q3.55 -3.7 4.12 -2.25L3.9 -2.3Q3.35 -3.7 3.82 -4.9Z" fill="#8a2e08" opacity=".3"/>`) +
          `<path d="M4.1 -4.95Q3.62 -3.7 4.18 -2.25" fill="none" stroke="#9a3a0a" stroke-width=".05" stroke-linecap="round" stroke-opacity=".7"/><path d="M4.16 -4.85Q3.72 -3.7 4.24 -2.35" fill="none" stroke="#ffd8a0" stroke-width=".03" stroke-opacity=".6"/>` +
          `<path d="M4.85 -4.5Q4.65 -3.6 4.95 -2.75" fill="none" stroke="#9a3a0a" stroke-width=".03" stroke-opacity=".25"/>`,
        ueber: `<use href="#${leibId}" fill="none" stroke="${T.lg("fkontur", [[0, "#8a2e08", 0], [0.5, "#8a2e08", 0.05], [1, "#8a2e08", 0.4]], 0, 0, 0.3, 1)}" stroke-width=".03"/>`,
      });
      /* Maul: endständig, Oberlippe als heller Wulst, Spalt nach vorn leicht steigend; Doppel-Nasenloch */
      s += `<path d="M6.62 -3.62Q6.45 -3.55 6.3 -3.56" fill="none" stroke="#6a2006" stroke-width=".04" stroke-opacity=".65" stroke-linecap="round"/><path d="M6.6 -3.74Q6.45 -3.72 6.32 -3.66" fill="none" stroke="#f7b060" stroke-width=".05" stroke-opacity=".8"/>`;
      s += `<ellipse cx="6.12" cy="-4.27" rx=".07" ry=".05" fill="#4a1604"/><ellipse cx="6.12" cy="-4.24" rx=".07" ry=".03" fill="none" stroke="#ffd0a0" stroke-width=".015" opacity=".7"/>`;
      /* Auge: Hautrand (oben 15 % über der Iris), Iris flach metallisch, Goldring um die Pupille, dunkler Limbus, Fensterlicht, Hornhaut-Sichel */
      const ex = 5.5, ey = -4.05, er = 0.42;
      s += `<circle cx="${ex}" cy="${ey}" r="${zahl(er + 0.06)}" fill="#b04a10" opacity=".5" filter="${weich(T, 0.04)}"/>`;
      s += `<circle cx="${ex}" cy="${ey}" r="${er}" fill="#c8902a"/><circle cx="${ex}" cy="${ey}" r="${zahl(er - 0.02)}" fill="none" stroke="#6a3a0a" stroke-width=".04"/>`;
      s += `<circle cx="${ex}" cy="${ey}" r=".24" fill="#f2d27a"/><circle cx="${ex}" cy="${ey}" r=".19" fill="${T.rg("fpup", [[0, "#0a1418"], [1, "#020304"]])}"/>`;
      s += `<path d="M${zahl(ex - er * 0.9)} ${zahl(ey - er * 0.35)}A${er} ${er} 0 0 1 ${zahl(ex + er * 0.9)} ${zahl(ey - er * 0.35)}" fill="none" stroke="#a8400c" stroke-width=".13" opacity=".55" filter="${weich(T, 0.04)}"/>`;
      s += `<rect x="${zahl(ex - 0.22)}" y="${zahl(ey - 0.22)}" width=".14" height=".1" rx=".03" fill="#fff" opacity=".9"/><path d="M${zahl(ex + 0.05)} ${zahl(ey + 0.33)}Q${zahl(ex + 0.32)} ${zahl(ey + 0.2)} ${zahl(ex + 0.36)} ${zahl(ey - 0.05)}" fill="none" stroke="#fff" stroke-width=".05" opacity=".15"/>`;
      /* nahe Brustflosse: tief hinter dem Kiemendeckel, fächerförmige Strahlen, durchscheinend */
      s += `<g opacity=".8">` + flosse([[3.75, -2.6], [3.1, -2.05], [2.4, -1.45], [2.85, -2.2], [3.45, -2.75]], [[3.72, -2.62], [3.45, -2.72]], [[2.42, -1.5], [2.85, -2.2]], 7) + "</g>";
      s += "</g>";
      return { svg: s, box: [-8.85, -5.95, 6.65, 0], kopf: [3.6, -4.65, 6.8, -1.25] };
    } },
];
