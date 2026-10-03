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

/* Arten aus Runde 1, die noch umgebaut werden (eigene alte Hilfen) */
const ALT = (() => {
/* ---------- eigene Hilfen ---------- */
const r = (n) => Math.round(n * 10) / 10;
/* kompakte Zahl: 0,1 oder 0,01 genau, ohne führende Null */
const zahl = (n, dez) => {
  const f = dez === 1 ? 10 : 100;
  let s = String(Math.round(n * f) / f);
  if (s === "-0") s = "0";
  return s.replace(/^(-?)0\./, "$1.");
};
/* Zahlenfolge kompakt verketten (kein Leerzeichen vor „-“) */
const folge = (zs, dez) => zs.map((n, i) => { const s = zahl(n, dez); return i && s[0] !== "-" ? " " + s : s; }).join("");
/* Farbe mischen: mix("#aabbcc", "#000", 0.3) */
function mix(a, b, t) {
  const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
}
/* Schlauch um eine Mittellinie (Schwanz, Streifen, Beine): c = Punkte, w = Breite(n) */
function schlauch(c, w) {
  const L = [], R = [];
  for (let i = 0; i < c.length; i++) {
    const a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const h = (Array.isArray(w) ? w[i] : w) / 2, nx = -dy / l * h, ny = dx / l * h;
    L.push([c[i][0] + nx, c[i][1] + ny]); R.push([c[i][0] - nx, c[i][1] - ny]);
  }
  return L.concat(R.reverse());
}
const schieb = (pts, dx, dy = 0) => pts.map((p) => [p[0] + dx, p[1] + dy].concat(p[2] ? [1] : []));
/* Punkte der geschlossenen Catmull-Rom-Kurve (wie T.glatt) – für Konturhaare */
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
/* weiche Licht-/Schattenflecken (Muskeln, Rundungen) */
function fleck(T, x, y, rx, ry, farbe, op, rot = 0) {
  const f = farbe === "hell" ? T.rg("fleck", [[0, "#fff", 1], [0.5, "#fff", 0.42], [1, "#fff", 0]])
    : farbe === "dunkel" ? T.rg("fleckd", [[0, "#000", 1], [0.5, "#000", 0.42], [1, "#000", 0]]) : farbe;
  return `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rx)}" ry="${r(ry)}" fill="${f}" opacity="${op}"${rot ? ` transform="rotate(${rot} ${r(x)} ${r(y)})"` : ""}/>`;
}
/* weiche Linie (Falte, Muskelkante, Sehne) */
const falte = (T, pts, farbe, w, op) => T.linie(pts, farbe, w, ` stroke-opacity="${op}"`);
/* Körperteil: Pfad EINMAL in den defs, Füllung/Volumen/Rand/Clip per <use>. o: { innen, vol, volx, rand, randA, rw, nach } */
function teil(T, pts, fill, o = {}) {
  const d = typeof pts === "string" ? pts : T.glatt(pts);
  T._n = (T._n || 0) + 1;
  const id = T.id("t" + T._n);
  T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}k"><use href="#${id}"/></clipPath>`);
  const u = (a) => `<use href="#${id}"${a}/>`;
  let s = u(` fill="${fill}"`);
  const innen = (o.innen || "") + (o.vol !== false ? u(` fill="${T.VOL()}"`) : "") + (o.volx ? u(` fill="${T.VOLX()}"`) : "") + (o.nach || "");
  if (innen) s += `<g clip-path="url(#${id}k)">${innen}</g>`;
  if (o.rand !== false) s += u(` fill="none" stroke="${o.rand || "#000"}" stroke-opacity="${(o.randA != null ? o.randA : 0.3) * 0.6}" stroke-width="${o.rw || T.RW || 0.3}" stroke-linejoin="round"`);
  return s;
}
/* Rauschtextur (Fellgrund) als gedrehtes Rechteck – innerhalb eines geklippten teil() benutzen.
   winkel = Wuchsrichtung in Grad (0 = rechts, 90 = unten) */
function tex(T, n, o, winkel, op, b) {
  if (!T.fein && !o.immer) return "";
  const url = T.rauschen(n, o);
  const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, R = Math.hypot(b[2] - b[0], b[3] - b[1]) / 2 + 1;
  return `<rect x="${r(cx - R)}" y="${r(cy - R)}" width="${r(2 * R)}" height="${r(2 * R)}" filter="${url}" opacity="${op}" transform="rotate(${r(winkel - 90)} ${r(cx)} ${r(cy)})"/>`;
}
/* Fell Haar für Haar mit Licht: n Haare in pts, Wuchsrichtung flow(x, y) in Grad, Länge L.
   eimer = [[farbe, breite, deckkraft], …] (dunkel → hell); wahl(x, y, z) → Eimer-Index (z = Zufall 0–1).
   o: { streu, kr (Krümmung), lf(x, y) (Längenfaktor), wo(x, y) (nur dort), dez (1 | 2) } */
function fell(T, pts, n, flow, L, eimer, wahl, o = {}) {
  const [x0, y0, x1, y1] = T.box(pts);
  const ds = eimer.map(() => "");
  const ziel = Math.round(n * (T.fein ? 1 : o.szene || 0)), dez = o.dez || 2;
  if (!ziel) return "";
  let v = 0, g = 0;
  while (g < ziel && v < ziel * 14) {
    v++;
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!T.inPoly(x, y, pts) || (o.wo && !o.wo(x, y))) continue;
    const a = (flow(x, y) + (T.rnd() - 0.5) * (o.streu != null ? o.streu : 16)) * Math.PI / 180;
    const l = L * (0.55 + T.rnd() * 0.9) * (o.lf ? o.lf(x, y) : 1);
    const dx = Math.cos(a) * l, dy = Math.sin(a) * l, k = (o.kr != null ? o.kr : 0.18) * l * (T.rnd() - 0.5) * 2;
    const i = Math.max(0, Math.min(eimer.length - 1, wahl(x, y, T.rnd())));
    ds[i] += "M" + folge([x, y], dez) + "q" + folge([dx / 2 - Math.sin(a) * k, dy / 2 + Math.cos(a) * k, dx, dy], dez);
    g++;
  }
  return ds.map((d, i) => d ? `<path d="${d}" fill="none" stroke="${eimer[i][0]}" stroke-width="${eimer[i][1]}" stroke-opacity="${eimer[i][2]}" stroke-linecap="round"/>` : "").join("");
}
/* Haare über die Kontur hinaus (weicher Fellrand statt harter Linie).
   o: { n, L, flow(x, y), ab (0–1: Anteil „nach außen“), wo(x, y), eimer, wahl, dez, kr } */
function randhaare(T, pts, o) {
  const k = kurve(pts, 8), m = k.length;
  const ds = o.eimer.map(() => "");
  const ziel = Math.round(o.n * (T.fein ? 1 : o.szene || 0)), dez = o.dez || 2;
  if (!ziel) return "";
  for (let j = 0; j < ziel; j++) {
    const i = Math.floor(T.rnd() * m), p = k[i], a = k[(i + m - 1) % m], b = k[(i + 1) % m];
    if (o.wo && !o.wo(p[0], p[1])) continue;
    let tx = b[0] - a[0], ty = b[1] - a[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    let nx = ty, ny = -tx;
    if (T.inPoly(p[0] + nx * 0.05, p[1] + ny * 0.05, k)) { nx = -nx; ny = -ny; }
    const fa = o.flow(p[0], p[1]) * Math.PI / 180, ab = o.ab != null ? o.ab : 0.45;
    let dx = nx * ab + Math.cos(fa) * (1 - ab), dy = ny * ab + Math.sin(fa) * (1 - ab);
    const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
    const l = o.L * (0.5 + T.rnd() * 0.9);
    const sx = p[0] - nx * l * 0.4, sy = p[1] - ny * l * 0.4;
    const kr = (o.kr != null ? o.kr : 0.2) * l * (T.rnd() - 0.5) * 2;
    const idx = Math.max(0, Math.min(o.eimer.length - 1, o.wahl(p[0], p[1], T.rnd())));
    ds[idx] += "M" + folge([sx, sy], dez) + "q" + folge([dx * l / 2 - dy * kr, dy * l / 2 + dx * kr, dx * l, dy * l], dez);
  }
  return ds.map((d, i) => d ? `<path d="${d}" fill="none" stroke="${o.eimer[i][0]}" stroke-width="${o.eimer[i][1]}" stroke-opacity="${o.eimer[i][2]}" stroke-linecap="round"/>` : "").join("");
}
/* weich gezeichnete Malschicht (Licht/Schatten wie mit dem Pinsel): Gaussian-Blur in Zentimetern */
function weich(T, n, sd) {
  const id = T.id("bl" + n);
  T._bl = T._bl || {};
  if (!T._bl[id]) { T._bl[id] = 1; T.def(`<filter id="${id}" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="${sd}"/></filter>`); }
  return `url(#${id})`;
}
/* in der Szene (T.fein = false) entfällt die Malschicht – außer sie ist als „immer“ markiert (Zeichnung/Muster) */
const mal = (T, n, sd, inhalt, immer) => (T.fein || immer ? `<g filter="${weich(T, n, sd)}">${inhalt}</g>` : "");
/* Fellkante: verwirbelt die Kanten einer Gruppe (Zeichnung, Umriss) in Wuchsrichtung – wie Haarspitzen.
   f = Frequenz (fx fy), k = Stärke in cm. Nur bei T.fein. */
function zottel(T, n, f, k) {
  if (!T.fein) return "";
  const id = T.id("zt" + n);
  T._bl = T._bl || {};
  if (!T._bl[id]) {
    T._bl[id] = 1;
    T.def(`<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="${f}" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${k}" xChannelSelector="R" yChannelSelector="G"/></filter>`);
  }
  return ` filter="url(#${id})"`;
}
/* Abschnitt einer Mittellinie (nach Bogenlänge, t0…t1 von 0 bis 1) als Schlauch – Ringe, Bänder */
function abschnitt(c, w, t0, t1, k = 5) {
  const L = [0];
  for (let i = 1; i < c.length; i++) L.push(L[i - 1] + Math.hypot(c[i][0] - c[i - 1][0], c[i][1] - c[i - 1][1]));
  const ges = L[L.length - 1];
  const bei = (t) => {
    const d = t * ges; let i = 1;
    while (i < c.length - 1 && L[i] < d) i++;
    const u = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
    const wi = Array.isArray(w) ? w[i - 1] + (w[i] - w[i - 1]) * u : w;
    return [[c[i - 1][0] + (c[i][0] - c[i - 1][0]) * u, c[i - 1][1] + (c[i][1] - c[i - 1][1]) * u], wi];
  };
  const pts = [], ws = [];
  for (let j = 0; j <= k; j++) { const [p, wi] = bei(t0 + (t1 - t0) * j / k); pts.push(p); ws.push(wi); }
  return schlauch(pts, ws);
}
/* Streifen/Band: fein = verjüngte Fläche, Szene = einfache Linie (klein) */
function streif(T, mitte, w, farbe, op, a = 0, b = 1) {
  if (T.fein) return T.form(abschnitt(mitte, w, a, b, 4), farbe, ` opacity="${op}"`);
  const k = abschnitt(mitte, 0.01, a, b, 3).slice(0, 4);
  return T.linie(k, farbe, Array.isArray(w) ? w[1] : w, ` stroke-opacity="${op}"`);
}
/* Nagerfuß von der Seite: Ballen/Sohle als schmale Form, n Zehen nach vorn mit hellen Krallen.
   x = Ferse, l = Fußlänge, h = Höhe, farbe = Haut */
function nagerfuss(T, x, l, h, n, farbe, kfarbe = "#efe4da") {
  let s = T.form([[x, -h * 0.6], [x + l * 0.55, -h], [x + l * 0.75, -h * 0.55], [x + l * 0.7, 0, 1], [x - l * 0.05, 0, 1]], farbe);
  for (let i = 0; i < n; i++) {
    const zx = x + l * (0.5 + i * 0.5 / n), zl = l * (0.3 + 0.08 * (n - i));
    s += T.form([[zx, -h * (0.62 - i * 0.08)], [zx + zl * 0.6, -h * (0.55 - i * 0.07)], [zx + zl, -h * 0.18], [zx + zl * 0.9, 0, 1], [zx + zl * 0.1, 0, 1]], mix(farbe, "#000000", 0.06 * i));
    if (T.fein) s += kralle(T, zx + zl * 0.9, -h * 0.12, l * 0.14, 50, kfarbe, 0.3);
  }
  return s;
}
/* Lichtwert → Eimer: v (0 = Schatten, 1 = Licht) plus Zufall */
const stufe = (v, z, n, streu = 0.35) => Math.round(Math.max(0, Math.min(1, v + (z - 0.5) * streu)) * (n - 1));
/* Gaußhügel für Lichtkarten: [x, y, rx, ry, gewicht] */
const huegel = (x, y, liste) => liste.reduce((s, [hx, hy, rx, ry, w]) => s + w * Math.exp(-(((x - hx) / rx) ** 2 + ((y - hy) / ry) ** 2)), 0);
/* Kralle: gebogen, dunkel, mit Glanz. (x, y) = Ansatz, l = Länge, a = Richtung in Grad */
function kralle(T, x, y, l, a, farbe = "#2a2018", dicke = 0.32) {
  const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
  const P = (u, v) => [x + c * u - s * v, y + s * u + c * v];
  const pts = [P(0, -dicke * l), P(l * 0.55, -dicke * l * 0.75), P(l, l * 0.18, 1), P(l * 0.5, dicke * l * 0.55), P(0, dicke * l)];
  return T.form(pts, farbe) + `<path d="M${folge(P(l * 0.1, -dicke * l * 0.45), 2)}Q${folge(P(l * 0.5, -dicke * l * 0.5), 2)} ${folge(P(l * 0.8, -dicke * l * 0.05), 2)}" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="${zahl(l * 0.08, 2)}" stroke-linecap="round"/>`;
}


return [
  /* =================================================================
     GOLDFISCH — gewöhnlicher Goldfisch (Carassius auratus), Kometen-/Normalform
     RECHERCHE: im Aquarium/Teich meist 10–20 cm; Körper wie die Giebel (Karausche): seitlich
     abgeflacht, gestreckt-hochrückig, Rücken- und Bauchlinie gleichmäßig gebogen, kleiner Kopf ohne
     Barteln, endständiges kleines Maul; lange Rückenflosse (über 15 Strahlen, vorn ein kräftiger
     Hartstrahl), einfache, tief gegabelte Schwanzflosse, kurze Afterflosse, Bauchflossen unter der
     Brustflossen-Mitte, Brustflossen hinter dem Kiemendeckel; große Rundschuppen in schrägen Reihen,
     Seitenlinie; Farbe orange-gold mit hellerem Bauch, Flossen durchscheinend orange; Auge groß mit
     goldener Iris.
     ================================================================= */
  { id: "goldfisch", de: "der Goldfisch", syl: "GOLD-fisch", it: "il pesce rosso", itSyl: "PE-sce ROS-so", en: "goldfish",
    gruppe: "Haustiere", lebensraum: "Zuhause", schwimmt: true,
    laenge: 0.153, hoehe: 0.077,
    zeichne(T) {
      T.RW = 0.03;
      const DK = "#5a2008";
      let s = "";
      const flosse = (pts, strahlen, op = 0.55) => teil(T, pts, T.lg("flosse", [[0, "#f08a2a", 0.85], [0.6, "#f4a850", 0.6], [1, "#f8d0a0", 0.35]]), { rand: "#b8500e", randA: 0.3, rw: 0.015, vol: false,
        innen: `<path d="${strahlen}" fill="none" stroke="#c0500e" stroke-width=".028" stroke-opacity="${op}"/>` });
      const strahlen = (a, b, n, kr = 0.1) => {
        let d = "";
        for (let i = 0; i <= n; i++) {
          const t = i / n, ax = a[0][0] + (a[1][0] - a[0][0]) * t, ay = a[0][1] + (a[1][1] - a[0][1]) * t;
          const bx = b[0][0] + (b[1][0] - b[0][0]) * t, by = b[0][1] + (b[1][1] - b[0][1]) * t;
          d += `M${folge([ax, ay], 2)}Q${folge([(ax + bx) / 2 + kr, (ay + by) / 2 - kr], 2)} ${folge([bx, by], 2)}`;
        }
        return d;
      };
      /* ferne Brust- und Bauchflosse (blasser) */
      s += `<g opacity=".55">` + flosse([[2.8, -2.3], [1.4, -1.2], [0.6, -0.6], [1, -1.5], [2, -2.5]], strahlen([[2.8, -2.3], [2, -2.5]], [[1.2, -1], [0.6, -0.6]], 4)) + "</g>";
      /* Schwanzflosse: tief gegabelt */
      const schwanz = [[-5.2, -4.3], [-6.6, -5.4], [-8.2, -6.4], [-8.7, -6.2, 1], [-8.1, -5.1], [-7.3, -3.7, 1], [-8.1, -2.2], [-8.7, -1, 1], [-8.2, -0.8], [-6.6, -1.8], [-5.2, -2.8]];
      s += flosse(schwanz, strahlen([[-5.3, -4.2], [-5.3, -3.6]], [[-8.6, -6.2], [-7.4, -3.75]], 9, 0.15) + strahlen([[-5.3, -3.5], [-5.3, -2.9]], [[-7.4, -3.65], [-8.6, -1]], 9, -0.15));
      /* Rückenflosse: lang, vorn hoch */
      const ruecken = [[2, -5.9], [1.4, -7.1], [0.9, -7.7, 1], [-0.4, -7.3], [-1.8, -6.6], [-3, -5.9], [-2.8, -5.6], [0, -5.9]];
      s += flosse(ruecken, strahlen([[1.8, -5.9], [-2.8, -5.7]], [[0.95, -7.65], [-2.9, -5.95]], 12, 0.05));
      /* Afterflosse, Bauchflosse */
      s += flosse([[-2, -2.1], [-2.9, -1.2], [-3.9, -0.7, 1], [-3.8, -1.4], [-3.4, -2.3]], strahlen([[-2, -2.1], [-3.4, -2.3]], [[-2.9, -1.2], [-3.85, -0.75]], 5));
      s += flosse([[1.9, -1.6], [1.2, -0.7], [0.4, 0, 1], [0.5, -0.8], [0.9, -1.6]], strahlen([[1.9, -1.6], [0.9, -1.6]], [[1.2, -0.6], [0.45, -0.05]], 5));
      /* Körper */
      const leib = [[6.65, -3.5], [6.2, -4.4], [5.4, -5.05], [3.4, -5.8], [1.6, -6.05], [-1.6, -5.85], [-3.6, -5.1], [-4.8, -4.45], [-5.7, -4.05], [-5.75, -2.95], [-4.8, -2.6],
        [-2.6, -2], [0.6, -1.55], [2.4, -1.65], [4.4, -2.15], [5.8, -2.75], [6.55, -3.15]];
      /* Schuppen: Bögen (hinterer Rand) in schrägen Reihen */
      let schuppen = "";
      const sw = 0.62;
      for (let c = 0; c < 18; c++) for (let rI = 0; rI < 9; rI++) {
        const x = 4 - c * sw * 0.85, y = -6 + rI * sw * 0.72 + (c % 2) * sw * 0.36;
        if (!T.inPoly(x, y, leib) || x > 4.2) continue;
        if (!T.fein && (c + rI) % 2) continue;
        schuppen += `M${folge([x, y - sw * 0.42], 2)}Q${folge([x - sw * 0.55, y], 2)} ${folge([x, y + sw * 0.42], 2)}`;
      }
      /* Rundschuppen einzeln (fein): vom Schwanz zum Kopf gelegt, jede vordere überdeckt die hintere –
         sichtbar bleibt der hintere Teil mit dunklem Rand und hellem Glanz */
      let platten = "";
      if (T.fein) {
        const g = T.rg("schuppe", [[0, "#f7a440", 0], [0.6, "#ffe6b0", 0.16], [0.8, "#f39030", 0.05], [0.93, "#b8480e", 0.4], [1, "#8a3008", 0.55]], 0.62, 0.5, 0.52);
        for (let c = 18; c >= 0; c--) for (let rI = -1; rI < 11; rI++) {
          const x = 4 - c * sw * 0.8, y = -6.4 + rI * sw * 0.7 + (c % 2) * sw * 0.35 - c * 0.04;
          if (!T.inPoly(x, y, leib) || x > 4.2) continue;
          const k = 0.75 + 0.25 * Math.min(1, (4.4 - x) / 2.5) - Math.max(0, (y + 2.6) * 0.18) - Math.max(0, (-x - 3.4) * 0.08);
          platten += `<circle cx="${zahl(x + sw * 0.1, 2)}" cy="${zahl(y, 2)}" r="${zahl(sw * 0.66 * k, 2)}" fill="${g}"/>`;
        }
        schuppen = "";
      }
      s += teil(T, leib, T.lg("gold", [[0, "#b8461a"], [0.25, "#e2701e"], [0.55, "#f3962e"], [0.8, "#f8c070"], [1, "#fbe0b0"]]), {
        rand: DK, randA: 0.25, vol: false,
        innen: (schuppen ? `<path d="${schuppen}" fill="none" stroke="#a8400c" stroke-width=".045" stroke-opacity=".4"/>` : "") + platten +
          mal(T, "gf", 0.25, T.form([[-5.6, -2.95], [-2.6, -2], [0.6, -1.55], [3, -1.7], [3, -1.95], [0, -1.85], [-3, -2.3]], "#7a3010", ` opacity=".25"`) + T.form([[5.2, -5], [3.2, -5.7], [0, -5.85], [-3, -5.2], [-2.6, -4.7], [0, -5.1], [3, -5], [4.8, -4.3]], "#fff1d0", ` opacity=".45"`) +
            T.form([[-5.6, -3], [-2.6, -2.1], [0.6, -1.6], [3, -1.8], [3, -2.4], [0, -2.3], [-3, -2.8]], "#ffe6c0", ` opacity=".35"`)) +
          falte(T, [[4.4, -4.6], [2, -4.3], [-0.5, -4.1], [-3, -3.9], [-5.4, -3.6]], "#8a2e08", 0.06, 0.45) +
          (T.fein ? `<path d="M3.8 -4.5h.01M3.2 -4.42h.01M2.6 -4.36h.01M2 -4.3h.01M1.4 -4.24h.01M.8 -4.18h.01M.2 -4.12h.01M-.4 -4.06h.01M-1 -4h.01M-1.6 -3.96h.01M-2.2 -3.92h.01M-2.8 -3.86h.01M-3.4 -3.8h.01M-4 -3.72h.01M-4.6 -3.66h.01" stroke="#6a2006" stroke-width=".09" stroke-linecap="round" opacity=".55"/>` : "") +
          /* Kopf ohne Schuppen, Kiemendeckel */
          T.form([[6.7, -3.5], [6.2, -4.45], [5.4, -5.1], [4.6, -5.4], [4.3, -4], [4.5, -2.4], [5.8, -2.7], [6.6, -3.1]], T.lg("fkopf", [[0, "#d2601c"], [0.45, "#f08a28"], [0.85, "#f6b060"], [1, "#f8c888"]])) +
          mal(T, "gk", 0.15, fleck(T, 5.6, -4.9, 0.9, 0.35, "#fff2d8", 0.6) + T.form([[4.6, -5.2], [4.3, -4], [4.5, -2.6], [5, -2.8], [4.8, -4], [5, -5]], "#8a3008", ` opacity=".25"`) + fleck(T, 5.6, -3, 0.8, 0.3, "#ffe6c0", 0.5)) +
          falte(T, [[4.7, -5.3], [4.3, -4.4], [4.25, -3.4], [4.55, -2.4]], "#9a3a0a", 0.06, 0.5) + falte(T, [[4.9, -5.1], [4.5, -4.3], [4.45, -3.4], [4.75, -2.5]], "#ffd6a0", 0.05, 0.5),
      });
      /* Maul */
      s += `<path d="M6.7 -3.35q-.25 .05 -.5 0" fill="none" stroke="#7a2a08" stroke-width=".05" stroke-linecap="round"/>`;
      /* Auge: groß, goldene Iris */
      s += `<circle cx="5.2" cy="-4.05" r=".56" fill="#d8a040"/>` + `<circle cx="5.2" cy="-4.05" r=".5" fill="${T.rg("fiauge", [[0, "#f8d880"], [0.7, "#d09030"], [1, "#7a4a10"]], 0.4, 0.4, 0.6)}"/>` +
        `<circle cx="5.25" cy="-4.05" r=".27" fill="#050302"/><ellipse cx="5.07" cy="-4.2" rx=".12" ry=".08" fill="#fff" opacity=".9"/><circle cx="5.36" cy="-3.9" r=".04" fill="#fff" opacity=".5"/>`;
      /* nahe Brustflosse, durchscheinend */
      s += flosse([[3.6, -2.9], [2.4, -2.2], [1.2, -1.2], [1.6, -2.1], [2.9, -3.1]], strahlen([[3.6, -2.9], [2.9, -3.1]], [[2, -1.8], [1.25, -1.25]], 5), 0.55);
      return { svg: s, box: [-8.75, -7.75, 6.72, 0], kopf: [3.4, -6.2, 6.8, -1.9] };
    } },
];
})();

module.exports = [
  /* =================================================================
     HUND — Labrador Retriever, gelb
     RECHERCHE: FCI-Standard Nr. 122 / KC / CKC: Widerrist Rüden 56–57 cm; Rumpf (Bug bis Sitzbein) gleich oder
     wenig länger als die Widerristhöhe; Ellbogen bis Boden ≈ ½ Widerristhöhe; Brust tief bis zum Ellbogen, Vorbrust
     vor den Vorderläufen; Rücken waagerecht, Kruppe leicht abfallend, kaum aufgezogen; Schulter ≈ 45° zurückgelegt;
     Vorderläufe gerade, Vordermittelfuß leicht schräg, Afterkralle; Hinterhand gut gewinkelt (Knie ≈ 115°), Sprung-
     gelenk tief (≈ 28 % der Höhe), Hintermittelfuß senkrecht; Pfoten rund und kompakt („Katzenpfote“), Zehen gewölbt,
     Ballen dick; Kopf ≈ 42 % der Widerristhöhe, Schädel breit, mäßiger Stopp mit Brauenwulst, Fang kräftig und
     kastenförmig (nicht spitz), Oberkopf und Fang etwa gleich lang; Lefzen hängen leicht über, Mundwinkel unter dem
     vorderen Augenwinkel; Ohren nicht groß, weit hinten angesetzt, hängend, Spitze etwa auf Höhe des Mundwinkels;
     Augen mittelgroß, braun; Nase schwarz, breit; Hals kräftig, mittellang, sauber („clean-cut“); Otterrute: an der
     Wurzel sehr dick, rund, gleichmäßig verjüngt, stumpfe Spitze, bis etwa zum Sprunggelenk; kurzes, dichtes,
     gerades Stockhaar, Wuchs von der Nase über Schädel und Rücken zur Rute, am Hals abwärts, an den Läufen nach
     unten, Wirbel an der Vorbrust; gelb: Rücken und Ohren etwas dunkler/wärmer, Brust, Bauch, Innenseiten cremig.
     ================================================================= */
  { id: "hund", de: "der Hund", syl: "HUND", it: "il cane", itSyl: "CA-ne", en: "dog",
    gruppe: "Haustiere", lebensraum: "Zuhause",
    laenge: 0.903, hoehe: 0.696,
    zeichne(T) {
      T.dez = 1;
      const SCH = "#9a6630", TIEF = "#6e4318", HELL = "#fff4da";
      const EIMER = [["#93612c", 0, 0.42, 0, "s"], ["#b5843f", 0, 0.36, 0, "s"], ["#d2a462", 0, 0.3, 0, "s"], ["#e6c58a", 0, 0.3, 0, "s"], ["#f4dfb4", 0, 0.32, 0, "s"]];
      /* Silhouette: Rumpf, Hals und die nahen Beine als EIN Umriss */
      const vorne = [[17, -29.4], [16.6, -24], [16.3, -17], [16.2, -12.6], [16.7, -10.6], [16.9, -9], [17.8, -6.9], [18.6, -5.7], [19.3, -5.25], [19.85, -4.85], [20.45, -4.2], [20.8, -3.4], [21.15, -2.4], [21.05, -1.1], [20.6, -0.3], [20.1, 0, 1],
        [13.4, 0, 1], [12.9, -0.8], [12.8, -2.6], [12.9, -5], [12.4, -7.4], [11.5, -9.2], [11.05, -10.2], [11.3, -11.6], [11.3, -14], [10.6, -21], [9.8, -26.4], [8.9, -29]];
      const hinten = [[-14.4, -32.6], [-14.6, -30], [-16.4, -26.4], [-19.2, -22.6], [-22.4, -18.8], [-24.6, -15.6], [-25.4, -13.2], [-25.3, -9], [-25, -6.2], [-24.2, -5.2], [-23.4, -4.75], [-22.8, -4.5], [-22.2, -3.9], [-21.6, -3.3],
        [-21.2, -2.3], [-21.15, -1], [-21.6, -0.3], [-22, 0, 1], [-29.4, 0, 1], [-29.9, -1], [-30, -3], [-30.2, -6], [-30.3, -10], [-30.6, -13.4], [-31.5, -15.8], [-30.7, -17.8], [-29.6, -20.6], [-29.7, -25], [-30.9, -30]];
      const leib = [[-31, -53.2], [-25, -55.6], [-19.5, -56.2], [-12, -55.5], [-4, -55.3], [5, -55.7], [11, -56.7], [14.5, -57.4], [17.5, -60.2], [20.2, -63.8], [22.6, -66.2], [25.6, -67.4], [29.5, -65],
        [29.6, -57.8], [29, -55.6], [28, -52.2], [26.4, -46.8], [24.2, -41.6], [22.6, -38.2], [20.8, -35], [18.6, -32.2]].concat(vorne,
        [[5, -28.4], [-1, -29.2], [-6, -31], [-10, -33.2], [-12.8, -35.4]], hinten, [[-32.6, -36], [-33.6, -41.5], [-33.9, -46.4], [-33.4, -49.6], [-32.4, -51.8]]);
      const leibId = pfad(T, leib);
      /* Kopf und Ohr vorab (für Schlagschatten) */
      const kopf = [[24, -69], [25.4, -71.6], [28, -73], [31.5, -73.4], [34.6, -72.3], [36.6, -70.3], [37.7, -69], [40.5, -68.4], [44, -68.05], [46, -67.85], [48.4, -67.4], [49.2, -66.3],
        [49.25, -64.7], [48.7, -64], [48.3, -63.2], [48.1, -61.4], [47.9, -59.6], [47.4, -58.6], [46.4, -57.6], [43.5, -56.8], [39.5, -56.8], [35.5, -57.5], [32, -59.2], [29.2, -62], [26.8, -65.4]];
      const kopfId = pfad(T, kopf);
      const ohr = [[26.4, -71.2], [29.4, -72.5], [32.4, -72.2], [33.5, -70.6], [33.2, -68.2], [32.1, -65.4], [30.9, -62.8], [29.9, -61.1], [29.2, -60.7], [28.5, -61.4], [27.5, -64.2], [26.6, -67.8]];
      const ohrId = pfad(T, ohr);
      /* Licht-Feld des Leibes, Wuchsrichtung */
      const lf = feld(leib, 8, (x, y) => (y < -50 ? 0.06 : 0) - (y > -34 && x > -12 && x < 9 ? 0.15 : 0));
      const flow = (x, y) => {
        if (x > 9 && x < 23 && y > -30) return 92;                                            // Vorderlauf
        if (x < -12 && y > -32) return x < -28 ? 92 : 102 + (y < -18 ? 12 : 0);               // Hinterlauf
        if (x > 19 && y > -50 && y < -31) return 90 + Math.atan2(y + 41, x - 21) * 57;         // Wirbel Vorbrust
        if (x > 15 && y < -45) return 128;                                                     // Hals abwärts
        if (x < -24) return x < -31 ? 98 : 118;                                                // Keule, „Hose“
        return 180 - 38 * klemm((y + 54) / 24);                                                 // Rumpf: nach hinten, unten schräg
      };
      const wahl = (x, y, z) => stufe((lf(x, y) + 0.35) / 1.1, z, 5);
      let s = "";
      /* --- ferne Beine: Körperton, 12–15 % dunkler, mit Form und Fell --- */
      const fernV = schieb([[9, -36], [16, -36]].concat(vorne.slice(0, -1)), -4.4);
      const fernH = schieb([[-5, -38], [-12.8, -35.4]].concat(hinten, [[-31.6, -33], [-24, -40]]), 5.6);
      const fernF = T.lg("hfern", [[0, "#a9783e"], [0.35, "#c99c5e"], [1, "#d8b47c"]]);
      for (const P of [fernH, fernV]) {
        const fl = feld(P, 3);
        s += teil(T, P, fernF, {
          form: { a: 1.6, w: 2.2, b: 0.7, s: [TIEF, 0.42], l: [HELL, 0.22], al: 0.4, wl: 1.2 },
          innen: haar(T, P, { n: 90, spitz: 0.11, L: 0.55, flow: () => 92, eimer: EIMER, wahl: (x, y, z) => stufe((fl(x, y) + 0.2) / 1.3 - 0.15, z, 5), dez: 1 }),
        });
      }
      const krallen = (x, w, f) => [0, 1, 2].map((i) => kralle(T, x + w * (0.72 + i * 0.12), -1.25 + i * 0.05 - (i === 2 ? 0.4 : 0), 0.8, 50 - i * 6, f, 0.42)).join("");
      if (T.fein) s += krallen(-23.8, 7.8, "#3a302a") + krallen(9, 7.4, "#3a302a");
      /* --- Otterrute: Fortsetzung der Kruppe, rund, stumpfe Spitze --- */
      const rc = [[-27.5, -50.8], [-32.5, -50.2], [-36.4, -47.6], [-38.8, -43], [-40, -36.6], [-40.2, -29.6], [-39.6, -23.4]];
      const rute = schlauch(rc, [7.2, 6.6, 6, 5.3, 4.6, 3.6, 2.4], true);
      const rflow = (x, y) => (y < -47 ? 172 : y < -40 ? 125 : 96);
      const rl = feld(rute, 2.6);
      s += teil(T, rute, T.lg("rute", [[0, "#d7a862"], [1, "#e0b97c"]], 0, 0, 1, 0.3), {
        form: { a: 1.4, w: 2, b: 0.6, s: [SCH, 0.5], l: [HELL, 0.3], al: 0.3, wl: 1.2 },
        innen: schlag(T, leibId, 0.8, 1.2, 0.9, TIEF, 0.45) + haar(T, rute, { n: 150, spitz: 0.13, L: 0.75, flow: rflow, eimer: EIMER, wahl: (x, y, z) => stufe((rl(x, y) + 0.3) / 1.1, z, 5), dez: 1 }),
        ueber: randhaar(T, rute, { n: 110, spitz: 0.08, L: 0.55, flow: rflow, ab: 0.45, eimer: EIMER, wahl: (x, y, z) => stufe((rl(x, y) + 0.3) / 1.1, z, 5), dez: 1, szene: 0.1 }),
      });
      /* --- Leib --- */
      const pfote = (x, w) => {
        /* drei gewölbte Zehen: Furchen (vom Haar überdeckt), Knöchellicht, dunkler Ballenstreifen am Boden */
        let t = "";
        for (let i = 0; i < 3; i++) {
          const zx = x + w * (0.5 + i * 0.17);
          if (i) t += falte(T, [[zx - 0.4, -3.9 + i * 0.5], [zx - 0.1, -2.2 + i * 0.3], [zx, -0.6]], "#6e4318", 0.22, 0.45);
          t += fleck(T, zx + w * 0.08, -3.1 + i * 0.55, w * 0.1, 0.9, HELL, 0.35);
        }
        return t + [0.12, 0.45, 0.66, 0.85].map((f, i) => `<ellipse cx="${zahl(x + w * f)}" cy="-.12" rx="${zahl(i ? w * 0.09 : w * 0.12)}" ry=".24" fill="#2a1d14" opacity=".8"/>`).join("");
      };
      s += teil(T, "#" + leibId, T.lg("hfell", [[0, "#d7a660"], [0.3, "#e2bc7e"], [0.62, "#e9cc98"], [1, "#e6c690"]]), {
        form: { a: 3.4, w: 4.6, b: 1.6, s: [SCH, 0.72], l: [HELL, 0.5], al: 0.9, wl: 3, r: ["#f3d39c", 0.3], ar: 0.3, wr: 1 },
        innen:
          /* Muskeln und Knochen: Schulterblatt (≈ 45°) mit Schattenkante bis zum Buggelenk, Oberarm, Brustkorb, Keule, Unterschenkel, Hals */
          wulst(T, [[9.5, -56.5], [15.5, -57.6], [19.8, -52], [23.4, -44], [22, -39.6], [17.4, -42.6], [12, -50]], { a: 1.5, w: 2, b: 0.6, m: 0.6, s: [SCH, 0.45], l: [HELL, 0.4], al: 0.5, wl: 1.6 }) +
          wulst(T, [[-31.6, -52.2], [-21, -55.2], [-14.4, -47], [-13.6, -36], [-17, -30.4], [-24.6, -30.4], [-31.2, -36], [-33.4, -45]], { a: 1.8, w: 2.4, b: 0.9, m: 1.4, s: [SCH, 0.3], l: [HELL, 0.42], al: 0.6, wl: 2 }) +
          wulst(T, [[-27.6, -31.6], [-17.2, -31], [-20.6, -21.6], [-25.8, -17], [-29.2, -22.4]], { a: 1, w: 1.4, b: 0.5, m: 0.5, s: [SCH, 0.4], l: [HELL, 0.3], al: 0.3, wl: 1 }) +
          wulst(T, [[15.5, -59], [21.5, -66.5], [26.6, -69.4], [29.2, -60.6], [26.6, -50], [22, -45.6]], { a: 1.6, w: 2.2, b: 0.8, m: 0.8, s: [SCH, 0.3], l: [HELL, 0.25], al: 0.4, wl: 1.6 }) +
          /* Schlagschatten von Kopf und Unterkiefer auf den Hals; Sehne/Achilles; Ellbogenfalte */
          schlag(T, kopfId, 0.7 - 1.5, 1.3 + 3.8, 1, TIEF, 0.42) +
          falte(T, [[9.6, -29.6], [11.2, -31.6], [14, -32.4]], TIEF, 0.35, 0.3) +
          /* Fell Haar für Haar */
          haar(T, leib, { n: 900, spitz: 0.17, L: 0.95, flow, eimer: EIMER, wahl, dez: 1, szene: 0.035, lf: (x, y) => (y > -28 ? 0.6 : 1) }) +
          (T.fein ? pfote(13.4, 7.4) + pfote(-29.4, 7.8) : ""),
        ueber: randhaar(T, leib, { n: 330, L: 0.6, spitz: 0.09, flow, ab: 0.42, eimer: EIMER, wahl, dez: 1, szene: 0.04, wo: (x, y) => y < -1.4 && !(x > 23 && y < -56) }) +
          randhaar(T, leib, { n: 70, L: 0.9, spitz: 0.1, flow: () => 100, ab: 0.75, eimer: EIMER, wahl: (x, y, z) => stufe(0.45, z, 5), dez: 1, wo: (x, y) => y > -36 && y < -27 && x > -13 && x < 9 }),
      });
      if (T.fein) {
        s += krallen(-29.4, 7.8, "#4a3c32") + krallen(13.4, 7.4, "#4a3c32");
        s += kralle(T, 12.6, -6.4, 0.8, 115, "#2a221c", 0.4);    // Afterkralle
      }
      /* --- Kopf (Gruppe: etwas tiefer und zurück getragen) --- */
      s += `<g transform="translate(-1.5 3.8)">`;
      const kl = feld(kopf, 3.6, (x, y) => (x > 39 && y > -61 ? 0.12 : 0));
      const kflow = (x, y) => (y > -60 ? 172 : x > 37 ? 186 : x < 31 && y > -66 ? 140 : 182);
      s += teil(T, "#" + kopfId, T.lg("hkopf", [[0, "#dcae68"], [0.5, "#e2bf84"], [1, "#e8cc9a"]]), {
        form: { a: 1.6, w: 2, b: 0.6, s: [SCH, 0.45], l: [HELL, 0.4], al: 0.4, wl: 1.4, r: ["#f6dcaa", 0.25], ar: 0.15, wr: 0.5 },
        innen:
          /* Brauenwulst, Stopp-Schatten, Wange, Fang als Kiste, Lefze */
          wulst(T, [[30.5, -72.8], [35.2, -72], [37.2, -69.6], [34.4, -69], [31, -70.2]], { a: 0.6, w: 0.9, b: 0.3, m: 0.3, s: [SCH, 0.35], l: [HELL, 0.55], al: 0.2, wl: 0.8 }) +
          wulst(T, [[27.4, -68], [33.4, -66.4], [36.6, -63], [34.6, -59.4], [29.6, -60.6]], { a: 1, w: 1.4, b: 0.7, m: 1, s: [SCH, 0.3] }) +
          wulst(T, [[38, -68.4], [48.2, -67.4], [48.1, -59.8], [38.4, -60.6]], { a: 0.9, w: 1.2, b: 0.5, m: 0.8, s: [SCH, 0.28], l: [HELL, 0.3], al: 0.2, wl: 0.8 }) +
          fleck(T, 37.8, -68.4, 1, 0.9, TIEF, 0.3) +
          schlag(T, ohrId, 0.5, 0.8, 0.35, TIEF, 0.4) +
          /* Lefze: hängt 3–4 % über den Unterkiefer, schwarzer Lefzenrand, Schatten darunter, Mundwinkel-Falte */
          mal(T, 0.25, `<path d="M48 -59.4Q45 -58.6 42 -59Q39.5 -59.5 37.4 -60.5L37.6 -59.4Q40 -58.5 43 -58.1Q46 -57.8 47.6 -58.4Z" fill="${TIEF}" opacity=".45"/>`) +
          `<path d="M48 -59.6Q45 -58.9 42 -59.3Q39.4 -59.8 37.4 -60.6" fill="none" stroke="#1c120a" stroke-width=".32" stroke-linecap="round"/>` +
          `<path d="M37.6 -60.5q-.5 .2 -.6 .9q.1 .5 .5 .7" fill="none" stroke="#3a2412" stroke-width=".2" stroke-opacity=".7"/>` +
          falte(T, [[48.2, -59.8], [44.5, -59.3], [41, -59.6]], HELL, 0.3, 0.35) +
          haar(T, kopf, { n: 400, spitz: 0.09, L: 0.45, flow: kflow, eimer: EIMER, wahl: (x, y, z) => stufe((kl(x, y) + 0.35) / 1.1, z, 5), dez: 1, szene: 0.08 }) +
          /* Tasthaar-Follikel in Reihen (werden unten mit den Tasthaaren gesetzt) */ "",
        ueber: randhaar(T, kopf, { n: 150, spitz: 0.06, dez: 1, L: 0.35, flow: kflow, ab: 0.4, eimer: EIMER, wahl: (x, y, z) => stufe((kl(x, y) + 0.35) / 1.1, z, 5), wo: (x, y) => x > 33 && x < 46 || y > -59, szene: 0.1 }),
      });
      /* Auge: Augenhöhle unter dem Brauenwulst, Lidrand, Wimpern, Iris bernsteinbraun */
      s += auge(T, 35.7, -68.25, 0.8, { ratio: 1.32, spitz: 0.3, winkel: 6, iris: "#8a541e", iris2: "#3a1d08", mitte: "#c48a3c", pr: 0.42, lid: "#1a0f08", lidw: 0.17, wimpern: [11, 0.55, "#2a1a0c"], hoehle: 0.32, nick: "#7a5048" });
      s += tasthaar(T, [36.4, -70.6, 0.6, 0.2, 1, 4], -112, -78, 2.8, ["#3a2814", "#c9a874"], 0.05, 0.75);
      /* Nase: breit, oben flach, vorn fast senkrecht, Philtrum, Komma-Nasenloch, Pflasterstruktur, kleiner Glanz */
      const nase = [[45.9, -67.7], [48.3, -67.6], [49.1, -66.95], [49.35, -65.6], [49.2, -64.6], [48.6, -64.1], [47.9, -64.3], [47.2, -64.55], [46.4, -64.65], [45.7, -65.6]];
      s += teil(T, nase, T.lg("nase", [[0, "#4a3e38"], [0.45, "#221a16"], [1, "#0c0908"]]), {
        innen: (T.fein ? `<rect x="45.5" y="-68" width="4" height="4.2" fill="#2e2622" filter="${T.relief("nase", { f: 3.2, tiefe: 0.45, okt: 2 })}" opacity=".5"/>` : "") +
          `<path d="M49.3 -65.95C48.8 -66.05 48.4 -65.8 48.3 -65.45C48.2 -65.15 48 -64.95 47.7 -64.95C48.05 -64.8 48.45 -64.95 48.65 -65.25C48.8 -65.5 49 -65.6 49.3 -65.55Z" fill="#020101"/>` +
          `<path d="M47.8 -65.1Q48.1 -66.4 49.25 -66.45" fill="none" stroke="#7a6a62" stroke-width=".09" opacity=".75"/>` +
          `<path d="M48.55 -64.15v.01" stroke="#000" stroke-width=".25"/>` +
          `<ellipse cx="48.1" cy="-67.25" rx=".55" ry=".16" fill="#fff" opacity=".6"/>` +
          (T.fein ? `<path d="M46.6 -66.9h.01M47.3 -67.1h.01M46.9 -66.3h.01M47.7 -66.6h.01M48.4 -66.8h.01" stroke="#fff" stroke-width=".09" stroke-linecap="round" opacity=".45"/>` : ""),
      });
      s += `<path d="M48.55 -64.1Q48.45 -63.2 48.3 -62.4" fill="none" stroke="#5a3a1e" stroke-width=".18" stroke-opacity=".6" stroke-linecap="round"/>`;
      /* Schnurrhaare: aus 4 Follikelreihen auf dem Oberlippenpolster, nach vorn-außen und leicht abwärts */
      s += tasthaar(T, [47.4, -63.4, 2.6, 1.7, 4, 5], -14, 26, 6.2, ["#3a2814", "#5a4026", "#e6cfa0"], 0.075, 0.8, "#7a5530");
      /* --- Ohr: dreieckig, Spitze gerundet, Ansatz angehoben und gefaltet --- */
      const ol = feld(ohr, 1.6);
      s += teil(T, "#" + ohrId, T.lg("hohr", [[0, "#d39e57"], [0.6, "#c58f4a"], [1, "#b98444"]]), {
        form: { a: 0.8, w: 1.2, b: 0.35, s: [TIEF, 0.45], l: [HELL, 0.3], al: 0.25, wl: 0.8 },
        innen: mal(T, 0.35, `<path d="M27 -71Q29.6 -72.1 33.1 -70.7Q32.6 -70 31.6 -70Q29.5 -70.6 27.2 -70.2Z" fill="${HELL}" opacity=".4"/><path d="M27.2 -69.8Q29.6 -70.4 31.8 -69.7Q30 -68.9 27.4 -69Z" fill="${TIEF}" opacity=".25"/>`) +
          haar(T, ohr, { n: 120, spitz: 0.08, L: 0.42, flow: () => 100, eimer: EIMER, wahl: (x, y, z) => stufe((ol(x, y) + 0.2) / 1.1 - 0.1, z, 5), dez: 1, szene: 0.06 }),
        ueber: randhaar(T, ohr, { n: 50, spitz: 0.05, dez: 1, L: 0.3, flow: () => 100, ab: 0.5, eimer: EIMER, wahl: (x, y, z) => stufe(0.35, z, 5), wo: (x, y) => y > -69.8, szene: 0 }),
      });
      s += "</g>";
      return { svg: s, box: [-42.4, -69.6, 47.9, 0], fuesse: [-25.4, -19.6, 13.8, 17.2], kopf: [22.5, -70, 48.5, -52.5] };
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
          haar(T, kopf, { n: 380, spitz: 0.045, L: 0.32, flow: kflow, eimer: EIMER, wahl: (x, y, z) => stufe((kl(x, y) + 0.3) / 1.05, z, 5), dez: 2, szene: 0.06 }),
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
    laenge: 0.145, hoehe: 0.118,
    zeichne(T) {
      T.dez = 2;
      const SW = "#1c1f1c";
      let s = "";
      /* --- Schwanz: mittleres Paar am längsten und spitz (kobalt-türkis), seitliche gestuft, äußerste mit gelbem Streif --- */
      const V = [-1.1, -3.5], a = Math.PI * 24 / 180, ux = -Math.cos(a), uy = Math.sin(a);
      const feder = (L, w, dv, f, gelb) => {
        const nx = -uy, ny = ux, b = [V[0] + nx * dv, V[1] + ny * dv];
        const m = [b, [b[0] + ux * L * 0.35, b[1] + uy * L * 0.35], [b[0] + ux * L * 0.75 + nx * dv * 0.15, b[1] + uy * L * 0.75 + ny * dv * 0.15], [b[0] + ux * L + nx * dv * 0.2, b[1] + uy * L + ny * dv * 0.2]];
        const k = schlauch(m, [w, w, w * 0.8, 0.04]);
        return form(T, k, f) + (gelb ? form(T, abschnitt(m, [w * 0.25, w * 0.3, w * 0.25, 0.02], 0.3, 0.8, 3), "#e8d050", ` opacity=".6"`) : "") +
          `<path d="M${folge(m[0])}L${folge(m[3])}" stroke="#9ab8e8" stroke-width=".025" opacity=".25"/>` + form(T, abschnitt(m.map(([x, y]) => [x - nx * w * 0.2, y - ny * w * 0.2]), [w * 0.2, w * 0.2, w * 0.15, 0.01], 0, 0.95, 3), "#7ab0e8", ` opacity=".22"`);
      };
      s += feder(6.6, 0.75, -0.42, "#1a3070", true) + feder(7.2, 0.75, -0.28, "#1d3a80") + feder(7.8, 0.8, -0.12, "#203e88");
      s += feder(8.4, 0.85, 0.12, "#2a5aa8") + feder(8.9, 0.9, 0.02, "#1f4a98");
      /* --- Beine und Füße: kurzer Lauf mit Netzschuppen, Zehen 2 nach vorn / 2 nach hinten mit Ballen, Krallen stark gebogen --- */
      const fuss = (x, f, d) => {
        let t = T.linie([[x - 0.05, -1.55], [x, -1], [x + 0.06, -0.45]], f, 0.36);
        for (const [dx, l, ri] of [[1, 1.25, 1], [1, 0.95, 1], [-1, 0.75, -1], [-1, 0.55, -1]]) {
          const ex = x + dx * l, ey = -0.12;
          t += T.linie([[x + 0.05, -0.42], [x + dx * l * 0.5, -0.24], [ex, ey]], f, 0.2) + `<circle cx="${zahl(x + dx * l * 0.5)}" cy="-.22" r=".1" fill="${f}"/>`;
          if (T.fein) t += kralle(T, ex, ey + 0.02, 0.28, ri > 0 ? 75 : 105, "#2a2a30", 0.42);
        }
        if (T.fein) t += `<path d="M${zahl(x - 0.12)} -1.3h.25M${zahl(x - 0.1)} -1.05h.24M${zahl(x - 0.08)} -.8h.24M${zahl(x - 0.06)} -.58h.22" stroke="${d}" stroke-width=".025" opacity=".5"/>`;
        return t;
      };
      s += fuss(1.55, "#7e8698", "#5a6070") + fuss(0.9, "#9aa2b6", "#6a7084");
      /* --- Körper und Kopf als ein Umriss: Nackeneinbuchtung, Brust vorgewölbt (Birne), Bauch rund, Steiß zum Schwanz --- */
      const leib = [[-1, -3.3], [-1.7, -4.4], [-0.9, -6.6], [0.4, -8.6], [1.45, -9.85], [1.65, -10.85], [2.55, -11.6], [3.55, -11.6], [4.25, -11.05], [4.6, -10.35],
        [4.62, -9.9], [4.45, -9.3], [4.3, -8.75], [4.05, -8.1], [4.15, -7.05], [3.95, -5.7], [3.35, -4.3], [2.55, -3.05], [1.65, -2.35], [0.6, -2.2], [-0.3, -2.55]];
      const leibId = pfad(T, leib);
      const fl = [[0.9, -9.25], [1.9, -8.2], [2.3, -6.6], [2, -5.1], [1.1, -3.8], [-0.3, -2.9], [-2.7, -2.3, 1], [-1.9, -3.6], [-1.25, -5.4], [-0.5, -7.4], [0.2, -8.7]];
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
      for (let r = 0; r < 5; r++) for (let j = 0; j < 4; j++) {
        const x = 0.95 - r * 0.38 + j * 0.42 + (r % 2) * 0.2, y = -9.55 + r * 0.42 + j * 0.25;
        if (!T.inPoly(x, y, leib) || T.inPoly(x, y, maske)) continue;
        const w = 0.26 + r * 0.03;
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
          (brust ? `<path d="${brust}" fill="none" stroke="#2e6a1e" stroke-width=".035" stroke-opacity=".3"/><path d="${brust}" fill="none" stroke="#c8f090" stroke-width=".02" stroke-opacity=".25" transform="translate(0 -.04)"/>` : "") +
          schlag(T, flId, 0.25, 0.3, 0.2, "#0e2a08", 0.5),
        ueber: (T.fein ? (() => { let d = ""; for (let i = 0; i < 30; i++) { const t = i / 29, x = 4.15 - t * 3.2 + (t > 0.7 ? (t - 0.7) * 1.4 : 0), y = -7.3 + t * 5.0; d += `M${folge([x, y])}q${folge([-0.05, 0.12, -0.16, 0.18])}`; } return `<path d="${d}" fill="none" stroke="#3a7a22" stroke-width=".04" stroke-opacity=".5"/>`; })() : ""),
      });
      /* --- Flügel: Deckfedern (schwarz, gelbe Sichel am Ende, Dachziegel; Schulter klein, große Decken gestreckt), Schirmfedern, Schwingen gestuft --- */
      let fw = "";
      /* Schwingen: 7 einzelne Federn mit gestuften runden Spitzen und grünem Außensaum */
      for (let i = 0; i < 7; i++) {
        const t = i / 6, x0 = 1.6 - t * 1.2, y0 = -5.4 + t * 0.6, L = 3.1 + t * 0.9 - (i > 4 ? (i - 4) * 0.5 : 0);
        const m = [[x0, y0], [x0 - L * 0.45, y0 + L * 0.42], [x0 - L * 0.8, y0 + L * 0.68]];
        const k = schlauch(m, [0.55, 0.52, 0.32], true);
        fw += form(T, k, i % 2 ? "#232823" : "#262a26") + T.linie(k.slice(0, 4), "#5a9a3a", 0.05, ` stroke-opacity=".8"`) + T.linie(m, "#4a5248", 0.02, ` stroke-opacity=".6"`);
      }
      /* Schirmfedern (3) mit breitem gelbgrünem Saum */
      for (let i = 0; i < 3; i++) {
        const x0 = -0.1 - i * 0.35, y0 = -6.4 + i * 0.7, m = [[x0, y0], [x0 - 0.7, y0 + 1.1], [x0 - 1.05, y0 + 1.8]];
        fw += form(T, schlauch(m, [0.75, 0.7, 0.4], true), "#c8d048") + form(T, schlauch(m.map(([x, y]) => [x + 0.06, y - 0.12]), [0.55, 0.5, 0.25], true), SW);
      }
      /* Deckfedern: Reihen parallel zur Flügelvorderkante, von unten nach oben gelegt (obere überdecken untere) */
      const reihen = T.fein ? 7 : 4;
      for (let r = reihen - 1; r >= 0; r--) {
        const t = r / (reihen - 1), gr = 0.55 + 0.45 * t, n = T.fein ? 6 - Math.floor(r / 3) : 3;
        for (let j = 0; j < n; j++) {
          const u = (j + (r % 2) * 0.5) / n;
          const x = 1.55 - u * 1.75 - t * 0.55, y = -8.6 + u * 1.2 + t * 3.0;
          if (!T.inPoly(x, y, fl)) continue;
          const w = 0.27 * gr * (T.fein ? 1 : 1.5), h = w * (1 + 0.4 * t);
          const F = [[x - w, y - h], [x + w, y - h], [x + w * 0.95, y + h * 0.15], [x + w * 0.2, y + h * 0.8], [x - w * 0.6, y + h * 0.6]];
          fw += form(T, F, "#f0dc5a") + form(T, F.map(([px, py]) => [x + (px - x) * 0.86, y - h * 0.18 + (py - y) * 0.86]), SW);
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
      s += auge(T, 3.3, -10.42, 0.27, { ratio: 1.02, iris: "#d8d6ce", iris2: "#b8b6ae", mitte: "#e6e4dc", sklera: "#c8c6be", ir: 1.02, pr: 0.6, lid: "#3a3428", lidw: 0.16, fasern: false });
      /* --- Wachshaut (Sattel, matt königsblau, rundes Nasenloch) und Schnabel (stark gebogener Haken, zur Hälfte von Bartfedern verdeckt) --- */
      s += form(T, [[4.2, -10.85], [4.55, -10.9], [4.82, -10.62], [4.84, -10.28], [4.55, -10.12], [4.2, -10.2]], T.lg("wachs", [[0, "#4a6ad0"], [1, "#2e47a0"]]));
      s += `<circle cx="4.6" cy="-10.6" r=".055" fill="#1a2a60"/><path d="M4.3 -10.8q.25 -.1 .45 0" stroke="#fff" stroke-width=".08" opacity=".15" fill="none"/>`;
      s += form(T, [[4.48, -10.2], [4.86, -10.25], [4.98, -9.85], [4.82, -9.35], [4.55, -9.0, 1], [4.6, -9.45], [4.45, -9.8]], T.lg("schnabel", [[0, "#c2b284"], [0.7, "#a89a6c"], [1, "#8a8060"]]));
      s += `<path d="M4.6 -10.15Q4.92 -9.95 4.85 -9.45" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width=".04"/><path d="M4.62 -9.1l-.07 .1" stroke="#5a5444" stroke-width=".05"/>`;
      /* Bartfedern über der Schnabelbasis, Stirnfedern über der Wachshaut */
      s += randhaar(T, [[4.1, -9.9], [4.5, -9.75], [4.45, -9.2], [4.1, -9.3]], { n: 26, spitz: 0.06, L: 0.22, flow: () => 20, ab: 0.2, eimer: [["#f0d848", 0, 0.9, 0, "s"]], wahl: () => 0, szene: 0.4 });
      s += randhaar(T, [[4, -11.2], [4.4, -11], [4.35, -10.8], [4, -10.95]], { n: 14, spitz: 0.05, L: 0.18, flow: () => 30, ab: 0.2, eimer: [["#f6e45a", 0, 0.9, 0, "s"]], wahl: () => 0, szene: 0.4 });
      return { svg: s, box: [-9.45, -11.75, 5, 0], fuesse: [1, 1.6], kopf: [1.4, -12, 5.2, -8] };
    } },
].concat(ALT);
