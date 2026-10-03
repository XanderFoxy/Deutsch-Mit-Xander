/* =====================================================================
   TIER-BIBLIOTHEK — WALD UND WIESE, KLEINE TIERE (FASSUNG 854, MASSSTAB 2)
   Eichhörnchen, Igel, Feldhase, Maulwurf, Fledermaus (Großes Mausohr),
   Murmeltier, Wanderratte, Hermelin. Maße in Zentimetern, Blick nach rechts,
   Boden y = 0, EIN Licht von links oben vorn. Werkzeug T: siehe kern.js.
   XANDER (03.10.): „fast fotorealistisch … Augen, Wimpern, jedes einzelne Haar … Zähne, Krallen, Muskeln,
   Sehnen, Pupillen, Pfotenfell, Fellstruktur … Licht und Schatten realistisch plastisch massiv“.
   Aufbau je Tier: ferne Glieder (Körperton, 25–30 % dunkler) → Schwanz → Leib → Keule/Schulter → nahe
   Glieder → Kopf → Ohr → Auge, Nase, Tasthaare.
   Plastizität: jede große Form liegt in einem Volumen-Licht-Filter (aufgeblasene Silhouette als Höhenkarte,
   diffuses Licht von links oben – Lichtkante, Kernschatten, weicher Übergang; auflösungsunabhängig), dazu
   Bodenreflex, Okklusion an Ansätzen und Schlagschatten. Fell Haar für Haar als spitz zulaufende Strähnen in
   Wuchsrichtung (Unterwolle dunkel, Deckhaar, helle Spitzen), Haarspitzen über die Kontur; keine Umrisslinien.
   Alle eigenen Filter mit color-interpolation-filters="sRGB".
   ===================================================================== */
"use strict";

/* ---------- Zahlen und Pfade ---------- */
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
const RAD = Math.PI / 180;
function mix(a, b, t) {
  const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
}
const dunkler = (c, t) => mix(c, "#000000", t);
const heller = (c, t) => mix(c, "#ffffff", t);
/* Schlauch um eine Mittellinie; w = Breite (Zahl oder Liste); kappe = rundes Ende */
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
/* Punkte drehen/skalieren um (cx, cy) */
const dreh = (pts, cx, cy, grad, s = 1) => {
  const c = Math.cos(grad * RAD), sn = Math.sin(grad * RAD);
  return pts.map((p) => [cx + ((p[0] - cx) * c - (p[1] - cy) * sn) * s, cy + ((p[0] - cx) * sn + (p[1] - cy) * c) * s].concat(p[2] ? [1] : []));
};
/* Punkte der geschlossenen Catmull-Rom-Kurve (wie T.glatt) */
function kurve(pts, schritte = 6, zu = true) {
  const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]), out = [];
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let k = 0; k < schritte; k++) {
      const t = k / schritte, u = 1 - t;
      out.push([0, 1].map((j) => u * u * u * p1[j] + 3 * u * u * t * c1[j] + 3 * u * t * t * c2[j] + t * t * t * p2[j]));
    }
  }
  if (!zu) out.push(pts[n - 1].slice(0, 2));
  return out;
}
/* Mittellinie nach Bogenlänge: liefert f(t) → [x, y, tx, ty] (Punkt und Tangente), t = 0…1 */
function laeufer(c) {
  const L = [0];
  for (let i = 1; i < c.length; i++) L.push(L[i - 1] + Math.hypot(c[i][0] - c[i - 1][0], c[i][1] - c[i - 1][1]));
  const ges = L[L.length - 1];
  const f = (t) => {
    const d = klemm(t) * ges; let i = 1;
    while (i < c.length - 1 && L[i] < d) i++;
    const u = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
    const dx = c[i][0] - c[i - 1][0], dy = c[i][1] - c[i - 1][1], l = Math.hypot(dx, dy) || 1;
    return [c[i - 1][0] + dx * u, c[i - 1][1] + dy * u, dx / l, dy / l];
  };
  f.laenge = ges;
  return f;
}
/* Abschnitt einer Mittellinie (Bogenlänge t0…t1) als Schlauch – Ringe, Bänder, Streifen */
function abschnitt(c, w, t0, t1, k = 5) {
  const f = laeufer(c), wi = (t) => {
    if (!Array.isArray(w)) return w;
    const x = klemm(t) * (w.length - 1), i = Math.min(w.length - 2, Math.floor(x));
    return w[i] + (w[i + 1] - w[i]) * (x - i);
  };
  const pts = [], ws = [];
  for (let j = 0; j <= k; j++) { const t = t0 + (t1 - t0) * j / k, p = f(t); pts.push([p[0], p[1]]); ws.push(wi(t)); }
  return schlauch(pts, ws);
}

/* ---------- Filter (einmal je Art; alle mit sRGB, sonst kippt Braun nach Oliv) ---------- */
function filt(T, key, inhalt, region = `x="-30%" y="-30%" width="160%" height="160%"`) {
  T._f = T._f || {};
  const id = T.id(key);
  if (!T._f[id]) { T._f[id] = 1; T.def(`<filter id="${id}" ${region} color-interpolation-filters="sRGB">${inhalt}</filter>`); }
  return `url(#${id})`;
}
const kz = (n) => String(zahl(n, 3)).replace(".", "p").replace("-", "m");
const weich = (T, sd) => filt(T, "bl" + kz(sd), `<feGaussianBlur stdDeviation="${zahl(sd, 3)}"/>`);
const mal = (T, sd, inhalt) => (inhalt ? `<g filter="${weich(T, sd)}">${inhalt}</g>` : "");
/* Volumen-Licht: die eigene Silhouette, weichgezeichnet, ist die Höhenkarte; diffuses Licht von links oben
   (Azimut 235°) multipliziert die Farbe → Lichtkante oben links, Kernschatten unten rechts, weicher Terminator.
   sd = Wölbung (≈ halbe Dicke der Form / 2), ss = Höhe, el = Lichthöhe, k = Belichtung. */
function volumen(T, sd, ss = sd * 0.85, el = 50, k = 1.3) {
  return filt(T, "vl" + kz(sd) + "_" + kz(ss) + "_" + el + "_" + kz(k),
    `<feGaussianBlur in="SourceAlpha" stdDeviation="${zahl(sd, 3)}" result="h"/>` +
    `<feDiffuseLighting in="h" surfaceScale="${zahl(ss, 3)}" diffuseConstant="1" lighting-color="#fff" result="l"><feDistantLight azimuth="235" elevation="${el}"/></feDiffuseLighting>` +
    `<feGaussianBlur in="l" stdDeviation="${zahl(sd * 0.1, 3)}" result="b"/>` +
    `<feComposite in="b" in2="SourceGraphic" operator="arithmetic" k1="${k}" result="m"/><feComposite in="m" in2="SourceAlpha" operator="in"/>`,
    `x="-12%" y="-12%" width="124%" height="124%"`);
}
const licht = (T, v, inhalt) => (v ? `<g filter="${volumen(T, ...v)}">${inhalt}</g>` : inhalt);
/* Kanten in Wuchsrichtung aufrauen (Haarspitzen an Zeichnung/Farbgrenzen); nur fein */
function zottel(T, f, k) {
  if (!T.fein) return "";
  return ` filter="${filt(T, "zt" + kz(f) + "_" + kz(k), `<feTurbulence type="fractalNoise" baseFrequency="${f}" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${k}" xChannelSelector="R" yChannelSelector="G"/>`, `x="-10%" y="-10%" width="120%" height="120%"`)}"`;
}

/* ---------- Formen ---------- */
/* glatte geschlossene Kurve (Catmull-Rom wie T.glatt), relativ und kompakt; [x, y, 1] = Ecke. T.dez = Stellen */
function glatt(T, pts, zu = true) {
  const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const dez = T.dez || 2;
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
const linie = (T, pts, farbe, w, op = 1, extra = "") => `<path d="${glatt(T, pts, false)}" fill="none" stroke="${farbe}" stroke-width="${zahl(w, 3)}"${op < 1 ? ` stroke-opacity="${op}"` : ""} stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
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
  const u = (k, farbe, op, w) => `<use href="#${id}" fill="none" stroke="${farbe}" stroke-opacity="${op}" stroke-width="${zahl(w, 3)}" transform="translate(${folge([dx * k, dy * k], 3)})"/>`;
  let s = "";
  if (f.s) s += u(f.a, f.s[0], f.s[1], f.w);
  if (f.r) s += u(f.ar != null ? f.ar : f.w * 0.15, f.r[0], f.r[1], f.wr || f.w * 0.3);
  if (f.l) s += u(-(f.al != null ? f.al : f.a * 0.6), f.l[0], f.l[1], f.wl || f.w);
  return `<g filter="${weich(T, f.b)}">${s}</g>`;
}
/* Körperteil. o: { innen (geklippt), form (Formlicht), licht: [sd, ss, el, k] (Volumen-Filter über alles),
   ueber (ungeklippt, im Licht), nach (ungeklippt, nach dem Licht), blende: weicher Übergang } */
function teil(T, pts, fill, o = {}) {
  const id = typeof pts === "string" && pts.startsWith("#") ? pts.slice(1) : pfad(T, pts);
  const u = (a) => `<use href="#${id}"${a}/>`;
  let s = u(` fill="${fill}"`);
  const innen = (o.innen || "") + (o.form ? formlicht(T, id, o.form) : "");
  if (innen) s += `<g clip-path="url(#${id}k)">${innen}</g>`;
  s += o.ueber || "";
  s = licht(T, o.licht, s);
  if (o.nachInnen) s += `<g clip-path="url(#${id}k)">${o.nachInnen}</g>`;
  s += o.nach || "";
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
const schlag = (T, id, dx, dy, b, farbe, op) => `<use href="#${id}" fill="${farbe}" opacity="${op}" transform="translate(${folge([dx, dy], 3)})" filter="${weich(T, b)}"/>`;
/* weiche Licht-/Schattenflecken (kleine Stellen: Augenhöhle, Nasenlicht, Bodenreflex) */
function fleck(T, x, y, rx, ry, farbe, op, rot = 0) {
  const f = farbe === "hell" ? T.rg("fleck", [[0, "#fff", 1], [0.5, "#fff", 0.42], [1, "#fff", 0]])
    : farbe === "dunkel" ? T.rg("fleckd", [[0, "#000", 1], [0.5, "#000", 0.42], [1, "#000", 0]])
      : farbe[0] === "#" ? T.rg("fl" + farbe.slice(1), [[0, farbe, 1], [0.5, farbe, 0.42], [1, farbe, 0]]) : farbe;
  return `<ellipse cx="${zahl(x)}" cy="${zahl(y)}" rx="${zahl(rx)}" ry="${zahl(ry)}" fill="${f}"${op < 1 ? ` opacity="${op}"` : ""}${rot ? ` transform="rotate(${Math.round(rot)} ${folge([x, y])})"` : ""}/>`;
}

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
   Jede Strähne ist ein spitz zulaufendes, leicht gebogenes Haarbüschel (Wurzel breit → Spitze), je Farbe EIN Pfad,
   nach Zeilen sortiert und relativ verkettet (klein). Eimer: [farbe, deckkraft]. */
function ausgabe(eimer, listen, dez) {
  return listen.map((h, i) => {
    if (!h.length) return "";
    h.sort((a, b) => (Math.round(a[1] * 2) - Math.round(b[1] * 2)) || (a[0] - b[0]));
    let d = "", px = 0, py = 0;
    for (const [x0, y0, x1, y1, w, k] of h) {
      const l = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / l * w / 2, ny = (x1 - x0) / l * w / 2;
      const ax = x0 + nx, ay = y0 + ny;
      d += d ? "m" + folge([ax - px, ay - py], dez) : "M" + folge([ax, ay], dez);
      if (k) {
        /* gebogen: Kontrollpunkt seitlich versetzt (k = Biegung in Anteilen der Länge) */
        const mx = (x0 + x1) / 2 + nx / w * 2 * k * l, my = (y0 + y1) / 2 + ny / w * 2 * k * l;
        d += "q" + folge([mx - ax, my - ay, x1 - ax, y1 - ay], dez) + "q" + folge([mx - x1, my - y1, x0 - nx - x1, y0 - ny - y1], dez);
      } else d += "l" + folge([x1 - ax, y1 - ay, x0 - nx - x1, y0 - ny - y1], dez);
      px = x0 - nx; py = y0 - ny;
    }
    return `<path d="${d}" fill="${eimer[i][0]}"${eimer[i][1] < 1 ? ` fill-opacity="${eimer[i][1]}"` : ""}/>`;
  }).join("");
}
/* Haare in einer Fläche. o: { n, L, w (Wurzelbreite), flow(x, y) Grad, streu, kr (Biegung), lf(x, y) Längenfaktor,
   wo(x, y), eimer, wahl(x, y, z) → Index, dez, szene (Anteil in der Szene) } */
function haar(T, pts, o) {
  const [x0, y0, x1, y1] = T.box(pts);
  const listen = o.eimer.map(() => []);
  const ziel = Math.round(o.n * (T.fein ? 1 : (o.szene != null ? o.szene : 0.15)));
  if (!ziel) return "";
  let v = 0, g = 0;
  while (g < ziel && v < ziel * 20) {
    v++;
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!T.inPoly(x, y, pts) || (o.wo && !o.wo(x, y))) continue;
    const a = (o.flow(x, y) + (T.rnd() - 0.5) * (o.streu != null ? o.streu : 14)) * RAD;
    const L = o.L * (0.6 + T.rnd() * 0.8) * (o.lf ? o.lf(x, y) : 1);
    const ca = Math.cos(a), sa = Math.sin(a);
    const idx = klemm(o.wahl(x, y, T.rnd()), 0, o.eimer.length - 1);
    const k = o.kr ? o.kr * (T.rnd() - 0.5) * 2 : 0;
    listen[idx].push([x - ca * L * 0.15, y - sa * L * 0.15, x + ca * L, y + sa * L, (o.w || L * 0.08) * (0.7 + T.rnd() * 0.6) * (T.fein ? 1 : 1.6), k]);
    g++;
  }
  return ausgabe(o.eimer, listen, o.dez || 2);
}
/* Haare über die Kontur hinaus (weicher Fellrand). o wie haar, dazu ab (Anteil nach außen 0–1), offen (Linie statt Umriss) */
function randhaar(T, pts, o) {
  const k = kurve(pts, 8, !o.offen), m = k.length;
  const listen = o.eimer.map(() => []);
  const ziel = Math.round(o.n * (T.fein ? 1 : (o.szene != null ? o.szene : 0.15)));
  if (!ziel) return "";
  for (let j = 0; j < ziel; j++) {
    const i = Math.floor(T.rnd() * m), p = k[i], a = k[Math.max(0, i - 1)], b = k[Math.min(m - 1, i + 1)];
    if (o.wo && !o.wo(p[0], p[1])) continue;
    let tx = b[0] - a[0], ty = b[1] - a[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    let nx = ty, ny = -tx;
    if (o.offen ? o.innen : T.inPoly(p[0] + nx * 0.05, p[1] + ny * 0.05, k)) { nx = -nx; ny = -ny; }
    const fa = o.flow(p[0], p[1]) * RAD, ab = o.ab != null ? o.ab : 0.4;
    let dx = nx * ab + Math.cos(fa) * (1 - ab), dy = ny * ab + Math.sin(fa) * (1 - ab);
    const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
    const l = o.L * (0.5 + T.rnd() * 0.9) * (o.lf ? o.lf(p[0], p[1]) : 1);
    const sx = p[0] - nx * l * 0.4 - dx * l * 0.2, sy = p[1] - ny * l * 0.4 - dy * l * 0.2;
    const idx = klemm(o.wahl(p[0], p[1], T.rnd()), 0, o.eimer.length - 1);
    const kk = o.kr ? o.kr * (T.rnd() - 0.5) * 2 : 0;
    listen[idx].push([sx, sy, sx + dx * l, sy + dy * l, (o.w || l * 0.08) * (0.7 + T.rnd() * 0.6) * (T.fein ? 1 : 1.6), kk]);
  }
  return ausgabe(o.eimer, listen, o.dez || 2);
}
/* Licht → Eimer-Index (n Stufen) mit Zufall */
const stufe = (v, z, n, streu = 0.3) => Math.round(klemm(v + (z - 0.5) * streu) * (n - 1));
/* buschiger Schweif (Eichhörnchen-Schwanz, Pinsel, Mähne): Haare wachsen aus der Mittellinie schräg nach außen zur Spitze.
   c = Mittellinie, hb(t) = halbe Breite bei t, o: { n, eimer, wahl(t, seite, rel, z), winkel (Grad gegen die Achse), kr, w, szene } */
function schweif(T, c, hb, o) {
  const f = laeufer(c), listen = o.eimer.map(() => []);
  const ziel = Math.round(o.n * (T.fein ? 1 : (o.szene != null ? o.szene : 0.15)));
  for (let j = 0; j < ziel; j++) {
    const t = Math.pow(T.rnd(), o.potenz || 1) * (o.t1 || 1), [x, y, tx, ty] = f(t), seite = T.rnd() < 0.5 ? -1 : 1;
    const rel = Math.pow(T.rnd(), 0.7);                                   // Wurzel: 0 = Achse … 1 = Rand
    const h = hb(t), wa = (o.winkel || 38) * (0.75 + T.rnd() * 0.5) * RAD;
    const nx = -ty * seite, ny = tx * seite;
    const rx = x + nx * h * rel * 0.55, ry = y + ny * h * rel * 0.55;
    const dx = tx * Math.cos(wa) + nx * Math.sin(wa), dy = ty * Math.cos(wa) + ny * Math.sin(wa);
    const L = h * (1 - rel * 0.45) / Math.max(0.35, Math.sin(wa)) * (0.75 + T.rnd() * 0.45) * (o.lang || 1);
    const idx = klemm(o.wahl(t, seite, rel, T.rnd()), 0, o.eimer.length - 1);
    const kk = (o.kr || 0.12) * (T.rnd() - 0.3) * -seite;
    listen[idx].push([rx, ry, rx + dx * L, ry + dy * L, (o.w || 0.12) * (0.7 + T.rnd() * 0.6) * (T.fein ? 1 : 1.8), kk]);
  }
  return ausgabe(o.eimer, listen, o.dez || 2);
}

/* ---------- Auge ----------
   Lidspalte rund/oval, dicker dunkler Lidrand, Iris mit Fasern und Limbus, Oberlid-Schatten, Fenster-Glanzlicht oben
   links + Himmelsreflex, feuchter Unterlidrand, gewölbte Hornhaut, Augenhöhle (Schatten unter dem Brauenwulst),
   Wimpern. o: { iris, iris2, mitte, pupille: "rund"|"quer", pr, ratio, winkel, lid, lidw, wimpern: [n, länge, farbe],
   unten: [n, länge], nick: Farbe, hoehle: Deckkraft, ring: [Farbe, Breite, Deckkraft], spitz, fasern } */
function auge(T, x, y, rr, o = {}) {
  T._n = (T._n || 0) + 1;
  const id = T.id("au" + T._n);
  const W = rr * (o.ratio || 1.15), H = rr, sp = o.spitz || 0;
  const P = [[-W, 0, sp > 0.5 ? 1 : 0], [-W * 0.62, -H * 0.86], [0, -H * 1.02], [W * 0.62, -H * 0.84], [W, H * 0.02, sp > 0.5 ? 1 : 0], [W * 0.6, H * 0.8], [0, H * 0.96], [-W * 0.62, H * 0.78]];
  const dz = T.dez; T.dez = 3;
  const spalt = (s) => glatt(T, P.map((p) => [p[0] * s, p[1] * s].concat(p[2] ? [1] : [])));
  T.def(`<clipPath id="${id}"><path d="${spalt(1)}"/></clipPath>`);
  const lw = o.lidw || 0.14;
  let s = `<g transform="translate(${folge([x, y], 3)})${o.winkel ? ` rotate(${o.winkel})` : ""}">`;
  if (o.hoehle) s += mal(T, rr * 0.35, `<ellipse cx="${zahl(-W * 0.1, 3)}" cy="${zahl(-H * 0.55, 3)}" rx="${zahl(W * 1.7, 3)}" ry="${zahl(H * 1.15, 3)}" fill="#000" opacity="${o.hoehle}"/>`);
  if (o.ring) s += mal(T, rr * 0.2, `<path d="${spalt(1 + o.ring[1])}" fill="${o.ring[0]}" opacity="${o.ring[2]}"/>`);
  s += `<path d="${spalt(1 + lw)}" fill="${o.lid || "#120a06"}"/>`;
  s += `<g clip-path="url(#${id})">`;
  const iris = o.iris || "#3a2210", iris2 = o.iris2 || "#140a04";
  const ir = (o.ir || 1.08) * H;
  const g = T.rg("ir" + iris.slice(1) + iris2.slice(1), [[0, o.mitte || mix(iris, "#ffffff", 0.18)], [0.42, iris], [0.82, iris2], [1, "#0c0604"]], 0.5, 0.5, 0.5);
  s += `<rect x="${zahl(-W, 3)}" y="${zahl(-H * 1.1, 3)}" width="${zahl(2 * W, 3)}" height="${zahl(H * 2.2, 3)}" fill="${o.sklera || "#1a100a"}"/>`;
  s += `<circle cx="${zahl(W * 0.06, 3)}" cy="${zahl(H * 0.04, 3)}" r="${zahl(ir, 3)}" fill="${g}"/>`;
  if (T.fein && o.fasern !== false) {
    let fa = "";
    for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, a2 = a + (T.rnd() - 0.5) * 0.25; fa += `M${folge([W * 0.06 + Math.cos(a) * ir * 0.42, H * 0.04 + Math.sin(a) * ir * 0.42], 3)}L${folge([W * 0.06 + Math.cos(a2) * ir * 0.9, H * 0.04 + Math.sin(a2) * ir * 0.9], 3)}`; }
    s += `<path d="${fa}" stroke="${o.faser || iris2}" stroke-width="${zahl(rr * 0.035, 3)}" stroke-opacity=".4" fill="none"/>`;
  }
  const pr = (o.pr || 0.42) * H;
  if ((o.pupille || "rund") === "rund") s += `<circle cx="${zahl(W * 0.08, 3)}" cy="${zahl(H * 0.04, 3)}" r="${zahl(pr, 3)}" fill="#050302"/>`;
  else s += `<rect x="${zahl(W * 0.08 - pr * 1.4, 3)}" y="${zahl(H * 0.04 - pr * 0.4, 3)}" width="${zahl(pr * 2.8, 3)}" height="${zahl(pr * 0.8, 3)}" rx="${zahl(pr * 0.4, 3)}" fill="#050302"/>`;
  /* Oberlid-Schatten auf dem Augapfel */
  s += `<rect x="${zahl(-W, 3)}" y="${zahl(-H * 1.1, 3)}" width="${zahl(2 * W, 3)}" height="${zahl(H * 1.2, 3)}" fill="${T.lg("lidsch", [[0, "#000", 0.7], [0.45, "#000", 0.3], [1, "#000", 0]])}"/>`;
  /* Himmelsreflex (breit, schwach) und Fenster-Glanzlicht oben links */
  s += `<path d="M${folge([-W * 0.75, -H * 0.1], 3)}Q${folge([0, -H * 0.85, W * 0.75, -H * 0.15], 3)}Q${folge([0, -H * 0.55, -W * 0.75, -H * 0.1], 3)}Z" fill="#fff" opacity=".14"/>`;
  s += `<rect x="${zahl(-W * 0.42, 3)}" y="${zahl(-H * 0.62, 3)}" width="${zahl(rr * 0.36, 3)}" height="${zahl(rr * 0.26, 3)}" rx="${zahl(rr * 0.08, 3)}" fill="#fff" opacity=".9" transform="rotate(-12 ${folge([-W * 0.24, -H * 0.5], 3)})"/>`;
  s += `<circle cx="${zahl(W * 0.4, 3)}" cy="${zahl(H * 0.42, 3)}" r="${zahl(rr * 0.07, 3)}" fill="#fff" opacity=".35"/>`;
  s += `</g>`;
  /* feuchter Unterlidrand, Hornhaut-Wölbung vorn */
  s += `<path d="M${folge([W * 0.7, H * 0.62], 3)}Q${folge([0, H * 1.08, -W * 0.72, H * 0.6], 3)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="${zahl(rr * 0.05, 3)}"/>`;
  s += `<path d="M${folge([W * 0.55, -H * 0.82], 3)}Q${folge([W * 1.12, -H * 0.1, W * 0.6, H * 0.78], 3)}" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="${zahl(rr * 0.07, 3)}"/>`;
  if (o.nick) s += `<path d="M${folge([W * 0.98, -H * 0.15], 3)}Q${folge([W * 0.62, H * 0.05, W * 0.9, H * 0.3], 3)}Q${folge([W * 1.05, H * 0.1, W * 0.98, -H * 0.15], 3)}Z" fill="${o.nick}" opacity=".6"/>`;
  if (o.wimpern && T.fein) {
    const [n, l, fw] = o.wimpern;
    let d = "";
    for (let i = 0; i < n; i++) {
      const t = 0.12 + 0.84 * i / Math.max(1, n - 1);
      const bx = W * (1 - 2 * t) * 0.98, by = -H * (1 + lw) * Math.sin(Math.PI * (0.08 + 0.84 * t)) * 0.98;
      const L = rr * l * (0.6 + 0.6 * t) * (0.85 + T.rnd() * 0.3);
      const a = -Math.PI / 2 - 0.35 - 0.9 * t;
      d += `M${folge([bx, by], 3)}q${folge([Math.cos(a) * L * 0.5, Math.sin(a) * L * 0.7, Math.cos(a - 0.35) * L, Math.sin(a - 0.35) * L * 0.75], 3)}`;
    }
    s += `<path d="${d}" fill="none" stroke="${fw || "#1a120c"}" stroke-width="${zahl(rr * 0.045, 3)}" stroke-linecap="round"/>`;
  }
  if (o.unten && T.fein) {
    const [n, l] = o.unten;
    let d = "";
    for (let i = 0; i < n; i++) { const t = 0.1 + 0.4 * i / Math.max(1, n - 1), bx = W * (1 - 2 * t) * 0.95, by = H * (1 + lw) * 0.9 * Math.sin(Math.PI * (0.1 + 0.8 * t)); d += `M${folge([bx, by], 3)}l${folge([rr * l * 0.5, rr * l * 0.6], 3)}`; }
    s += `<path d="${d}" fill="none" stroke="${o.lid || "#1a120c"}" stroke-width="${zahl(rr * 0.035, 3)}" stroke-linecap="round" opacity=".7"/>`;
  }
  T.dez = dz;
  return s + `</g>`;
}

/* ---------- Tasthaare: aus Follikelreihen, spitz zulaufend, leicht gebogen ----------
   fe = [x, y, breite, hoehe, reihen, spalten] (Follikel), a0/a1 = Winkelbereich (Grad, oben→unten), L = Länge,
   farben = [Farbe…], w = Wurzelbreite, op = Deckkraft, punkte = Follikelpunkt-Farbe */
function tasthaar(T, fe, a0, a1, L, farben, w, op = 0.85, punkte) {
  const [fx, fy, fb, fh, nr, nc] = fe;
  const d = Array(farben.length).fill("");
  let dots = "";
  for (let i = 0; i < nr; i++) for (let j = 0; j < nc; j++) {
    const x = fx - fb * j / Math.max(1, nc - 1) + (i % 2) * fb * 0.12, y = fy + fh * i / Math.max(1, nr - 1);
    if (punkte && T.fein) dots += `M${folge([x, y], 3)}h.01`;
    if (((i + j) % 2 && T.rnd() < 0.3) || (!T.fein && (i + j) % 2)) continue;
    const t = (i + T.rnd() * 0.6) / Math.max(1, nr), a = (a0 + (a1 - a0) * t + (T.rnd() - 0.5) * 8) * RAD;
    const l = L * (0.55 + 0.45 * (1 - j / nc)) * (0.75 + T.rnd() * 0.35);
    const ex = x + Math.cos(a) * l, ey = y + Math.sin(a) * l + l * 0.1;
    const cx = x + Math.cos(a) * l * 0.5, cy = y + Math.sin(a) * l * 0.5 - l * 0.04;
    const nx = -Math.sin(a) * w / 2, ny = Math.cos(a) * w / 2;
    const k = Math.floor(T.rnd() * farben.length);
    d[k] += `M${folge([x + nx, y + ny], 3)}Q${folge([cx + nx * 0.4, cy + ny * 0.4, ex, ey], 3)}Q${folge([cx - nx * 0.4, cy - ny * 0.4, x - nx, y - ny], 3)}Z`;
  }
  return (dots ? `<path d="${dots}" stroke="${punkte}" stroke-width="${zahl(w * 1.6, 3)}" stroke-linecap="round" opacity=".7"/>` : "") +
    d.map((dd, k) => dd ? `<path d="${dd}" fill="${farben[k]}" opacity="${op}"/>` : "").join("");
}
/* Kralle: gebogen, Horn, mit Glanz. (x, y) = Ansatz, l = Länge, a = Richtung (Grad), bieg = Krümmung */
function kralle(T, x, y, l, a, farbe = "#2a2018", dicke = 0.3, bieg = 0.18) {
  const c = Math.cos(a * RAD), s = Math.sin(a * RAD);
  const P = (u, v) => [x + c * u - s * v, y + s * u + c * v];
  const pts = [P(0, -dicke * l), P(l * 0.55, -dicke * l * 0.7 + bieg * l * 0.3), P(l, bieg * l, 1), P(l * 0.5, dicke * l * 0.5 + bieg * l * 0.4), P(0, dicke * l)];
  const dz = T.dez; T.dez = 3;
  const s1 = form(T, pts, farbe) + (T.fein ? `<path d="M${folge(P(l * 0.08, -dicke * l * 0.45), 3)}Q${folge(P(l * 0.5, -dicke * l * 0.45 + bieg * l * 0.2).concat(P(l * 0.82, bieg * l * 0.7)), 3)}" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="${zahl(l * 0.07, 3)}" stroke-linecap="round"/>` : "");
  T.dez = dz;
  return s1;
}
/* Nagezahn (Schneidezahn): gebogener Meißel, orange Schmelz vorn, Spitze heller, Glanzkante.
   (x, y) = Austritt am Zahnfleisch, l = sichtbare Länge, a = Richtung (Grad), b = Breite */
function nagezahn(T, x, y, l, a, b, farbe = "#d88a2a") {
  const c = Math.cos(a * RAD), s = Math.sin(a * RAD);
  const P = (u, v) => [x + c * u - s * v, y + s * u + c * v];
  const dz = T.dez; T.dez = 3;
  const pts = [P(0, -b / 2), P(l * 0.55, -b * 0.42), P(l, -b * 0.2, 1), P(l * 0.96, b * 0.5, 1), P(l * 0.5, b * 0.52), P(0, b / 2)];
  const g = T.lg("zahn" + farbe.slice(1), [[0, dunkler(farbe, 0.25)], [0.45, farbe], [1, heller(farbe, 0.55)]], 0, 0, 1, 0);
  const s1 = `<g transform="rotate(0)">` + form(T, pts, g) + `<path d="M${folge(P(l * 0.15, -b * 0.25), 3)}L${folge(P(l * 0.9, -b * 0.1), 3)}" stroke="#fff" stroke-opacity=".5" stroke-width="${zahl(b * 0.14, 3)}" stroke-linecap="round"/></g>`;
  T.dez = dz;
  return s1;
}

/* =====================================================================
   DIE ARTEN
   ===================================================================== */
module.exports = [
  /* =================================================================
     EICHHÖRNCHEN — Europäisches Eichhörnchen (Sciurus vulgaris), rotbraune Form im Winterfell, aufrecht sitzend
     mit Haselnuss
     RECHERCHE (Fachwissen; Görner/Hackethal, Macdonald „Säugetiere Europas“): Kopf-Rumpf 18–25 cm (hier 22),
     Schwanz 15–20 cm (hier 19 Knochen, Haare seitlich 4–5 cm → buschig 8–9 cm breit, zweizeilig gescheitelt),
     250–350 g. Kopf ≈ 5,5–6 cm, rund, kurze stumpfe Schnauze; Auge groß (Lidspalte ≈ 1,1 cm), fast schwarz,
     hoch und seitlich, mit hellem Lidring; Ohr 2,5–3,5 cm, im Winter Ohrpinsel bis 3 cm (dunkel rotbraun);
     lange schwarze Tasthaare an Schnauze, über dem Auge und an der Wange; orange Nagezähne (Eisen im Schmelz).
     Hand 4 Finger mit langen gebogenen dunklen Krallen (Daumen nur Stummel), Fuß 5 Zehen, Hinterfuß 5–6 cm;
     sitzend liegt der Fuß flach (Ferse hinten), Oberschenkel als runde Keule. Fell oben rotbraun (Rücken etwas
     dunkler, Winter mit grauem Hauch), Bauch, Kehle und Brust scharf abgesetzt cremeweiß; Schwanz meist etwas
     dunkler rotbraun mit helleren Haarspitzen. Haltung: Männchen, Nuss mit beiden Händen vor dem Maul.
     ================================================================= */
  { id: "eichhoernchen", de: "das Eichhörnchen", syl: "EICH-hörn-chen", it: "lo scoiattolo", itSyl: "sco-IAT-to-lo", en: "squirrel",
    gruppe: "Wald und Wiese", lebensraum: "Wald",
    laenge: 0.33, hoehe: 0.31,
    zeichne(T) {
      T.dez = 2;
      const ROT = "#b0521c", ROTD = "#6e2c0c", ROTH = "#d47a3c", TIEF = "#3a1606", CREME = "#f1e6d2", CREMED = "#c8b496";
      /* Eimer: Unterwolle dunkel, Deckhaar rot, helle Spitzen, Grau-Hauch (Winter), Creme */
      const EI = [["#3e1a08", 0.6], ["#7a3412", 0.55], ["#a4501e", 0.55], ["#cc7238", 0.55], ["#e7a066", 0.5], ["#9a8a7c", 0.35], ["#f6eee0", 0.7], ["#d2c2a8", 0.6]];
      let s = "";
      /* ---------- Formen ---------- */
      const leib = [[2.2, -0.3], [-0.4, -1.3], [-1.5, -3.5], [-1.8, -6.4], [-1.2, -9.4], [0.1, -12.2], [1.9, -14.8], [4.1, -17], [6.3, -18.6], [8.4, -19.8],
        [10.4, -19.4], [11.7, -17.6], [12.3, -15.4], [12.5, -13], [12.2, -10.4], [11.5, -7.8], [10.6, -5.4], [9.5, -3.4], [7.8, -1.9], [5.2, -0.8]];
      const keule = [[-1.2, -2.2], [-1.6, -5.2], [-0.4, -8.4], [2.2, -10.2], [5.4, -10.2], [8.2, -8.8], [9.4, -6.6], [8.8, -4.2], [6.6, -2.2], [3.8, -1], [0.8, -0.8]];
      const fuss = [[1.4, -0.05], [1.2, -0.9], [2.2, -1.7], [4.4, -1.9], [6.6, -1.5], [8.4, -1], [9.7, -0.65], [10.3, -0.25], [10.2, 0, 1], [1.8, 0, 1]];
      const kopf = [[8.2, -19.2], [8.7, -21.2], [9.9, -22.6], [11.5, -23.3], [13.1, -23.1], [14.4, -22.3], [15.4, -21.1], [16.05, -19.9], [16.35, -18.85],
        [16.25, -18.1], [15.85, -17.6], [15.25, -17.3], [14.5, -17.1], [13.5, -16.85], [12.2, -16.9], [10.7, -17.4], [9.3, -18.2]];
      const ohr = [[10.2, -21.9], [10.05, -23.4], [10.3, -24.9], [10.75, -25.75], [11.3, -25.3], [11.85, -24], [12.25, -22.6]];
      const ohrF = [[11.6, -22.6], [11.8, -24], [12.25, -25.2], [12.75, -25.5], [13.05, -24.6], [13.15, -23.2]];
      /* Schwanz: S-Bogen hinter dem Rücken, Spitze nach hinten eingerollt */
      const sm = [[0.2, -1.6], [-2.6, -2.2], [-5, -4.2], [-6.4, -7.6], [-6.6, -11.6], [-6, -15.6], [-5.3, -19.4], [-5.4, -22.8], [-6.9, -25.4], [-9.4, -26.6], [-11.8, -26], [-12.9, -24.2]];
      const hb = (t) => 1.2 + 3.4 * Math.sin(Math.PI * Math.min(1, t * 1.25 + 0.05)) * (t > 0.85 ? 1 - (t - 0.85) * 2.2 : 1) + (t > 0.1 ? 0.5 : t * 5);
      const smf = laeufer(sm), sumriss = [], sumr2 = [];
      for (let i = 0; i <= 24; i++) { const t = i / 24, [x, y, tx, ty] = smf(t), h = hb(t); sumriss.push([x - ty * h, y + tx * h]); sumr2.push([x + ty * h, y - tx * h]); }
      const schwanz = sumriss.concat(sumr2.reverse());
      /* ---------- ferne Glieder: Hinterfuß (Zehen vor dem nahen), Hand hinter der Nuss, Ohr ---------- */
      const FERN = "#7a3a18";
      s += teil(T, schieb(fuss, 0.9, -0.15), FERN, {
        licht: [0.5, 0.45],
        innen: haar(T, schieb(fuss, 0.9, -0.15), { n: 70, L: 0.45, flow: () => 175, eimer: EI, wahl: (x, y, z) => (z < 0.5 ? 1 : 2), szene: 0.2 }),
      });
      if (T.fein) s += [[10.95, -0.35], [10.6, -0.25]].map(([x, y]) => kralle(T, x, y, 0.55, 40, "#2a1a10", 0.26, 0.25)).join("");
      /* fernes Ohr */
      s += teil(T, ohrF, "#7a3414", {
        licht: [0.35, 0.3],
        innen: mal(T, 0.15, form(T, [[11.95, -22.9], [12.1, -24.1], [12.55, -24.9], [12.85, -24.3], [12.85, -23]], "#c88a70", ` opacity=".6"`)),
        ueber: randhaar(T, [[12.4, -25.2], [12.75, -25.5], [13.05, -24.6]], { n: 50, L: 2.3, w: 0.06, flow: () => -95, ab: 0.2, offen: true, eimer: EI, wahl: (x, y, z) => (z < 0.6 ? 0 : 1), kr: 0.06, szene: 0.4 }),
      });
      /* ---------- Schwanz ---------- */
      const sw = (t, seite, rel, z) => {
        if (z < 0.16) return 0;
        if (rel > 0.75 && z > 0.78) return 4;
        if (seite > 0 && t < 0.75) return z < 0.5 ? 1 : 2;                 // innen (zum Rücken): dunkler
        return z < 0.35 ? 1 : z < 0.75 ? 2 : 3;
      };
      s += teil(T, schwanz, T.lg("ehsw", [[0, "#8e3e14"], [0.5, "#7a3210"], [1, "#5e260a"]], 0, 0, 1, 0.3), {
        licht: [2.2, 2, 48, 1.32],
        innen: mal(T, 0.8, linie(T, sm, "#3a1606", 1.6, 0.55)) +
          schweif(T, sm, hb, { n: 900, eimer: EI, wahl: sw, winkel: 34, kr: 0.14, w: 0.13, lang: 1.05, szene: 0.2 }),
        ueber: schweif(T, sm, (t) => hb(t) * 1.12, { n: 420, eimer: EI, wahl: (t, s2, rel, z) => (z < 0.3 ? 1 : z < 0.7 ? 2 : z < 0.92 ? 3 : 4), winkel: 30, kr: 0.18, w: 0.09, lang: 1.15, szene: 0.15 }),
      });
      /* ---------- Leib ---------- */
      const lf = feld(leib, 4.5);
      const flow = (x, y) => {
        if (x > 9.5 && y < -9) return 100;                                   // Brust: abwärts
        return -75 + klemm((-y - 2) / 16) * 0 + (x < 3 ? 10 : 0) - 180 + 360;  // Rücken: nach hinten-unten (gegen den Kopf)
      };
      const bauch = (x, y) => x > 9.3 - (y + 18) * 0.04 && y < -2.2;        // cremeweiße Unterseite (scharf abgesetzt)
      const leibId = pfad(T, leib);
      const kopfId = pfad(T, kopf);
      const keuleId = pfad(T, keule);
      const wahlL = (x, y, z) => {
        if (bauch(x, y)) return z < 0.75 ? 6 : 7;
        const v = (lf(x, y) + 0.4) / 1.2;
        if (z < 0.12) return 5;                                              // grauer Winterhauch
        if (z < 0.24) return 0;
        return klemm(1 + Math.round(v * 2.6 + (z - 0.5) * 1.2), 1, 4);
      };
      s += teil(T, "#" + leibId, T.lg("ehleib", [[0, "#9a4618"], [0.62, "#b4561e"], [0.7, "#e6d8c0"], [1, "#efe4d0"]], 0, 0, 1, 0), {
        licht: [2.4, 2.1, 50, 1.3],
        innen:
          /* Bauch/Brust cremeweiß, Grenze mit Haarspitzen verzahnt */
          `<g${zottel(T, 0.9, 0.5)}>` + form(T, [[13, -19], [10.4, -18.6], [9.6, -15], [9.4, -11], [9.6, -7], [9.6, -3.2], [11.2, -3.4], [13, -8]], CREME) + "</g>" +
          /* Okklusion: unter dem Kopf, am Keulenrand, über dem Fuß */
          schlag(T, kopfId, 0.3, 1.1, 0.5, TIEF, 0.5) + schlag(T, keuleId, 0.4, 0.2, 0.45, TIEF, 0.35) +
          haar(T, leib, { n: 760, L: 0.62, flow: (x, y) => (bauch(x, y) ? 95 : 118 + (y < -12 ? 10 : 0)), eimer: EI, wahl: wahlL, szene: 0.12, kr: 0.12 }),
        ueber: randhaar(T, leib, { n: 300, L: 0.6, flow: (x, y) => (x > 9 ? 95 : 120), ab: 0.45, eimer: EI, wahl: wahlL, kr: 0.15, szene: 0.1, wo: (x, y) => y < -1.5 }),
      });
      /* ---------- Keule (Oberschenkel) ---------- */
      const kl = feld(keule, 3);
      s += teil(T, "#" + keuleId, T.lg("ehkeule", [[0, "#a84e1c"], [0.75, "#9c4416"], [1, "#d4c0a0"]], 0, 0, 0, 1), {
        licht: [1.8, 1.6, 50, 1.32],
        innen: haar(T, keule, { n: 420, L: 0.55, flow: (x, y) => Math.atan2(y + 5.5, x - 3.8) / RAD + 100, eimer: EI, wahl: (x, y, z) => (y > -2.2 && x > 3 ? 7 : z < 0.15 ? 0 : klemm(1 + Math.round((kl(x, y) + 0.4) / 1.2 * 2.6 + (z - 0.5)), 1, 4)), szene: 0.12, kr: 0.15 }) +
          mal(T, 0.4, form(T, [[1, -1], [8, -2], [8.4, -3], [1, -2.6]], TIEF, ` opacity=".3"`)),
        ueber: randhaar(T, keule, { n: 160, L: 0.55, flow: (x, y) => Math.atan2(y + 5.5, x - 3.8) / RAD + 100, ab: 0.5, eimer: EI, wahl: (x, y, z) => (z < 0.3 ? 1 : 2 + (z > 0.7 ? 1 : 0)), szene: 0.1, wo: (x, y) => y < -2.5 }),
      });
      /* ---------- naher Hinterfuß: lang, flach, oben behaart, Zehen mit langen Krallen ---------- */
      const fl = feld(fuss, 0.9);
      s += teil(T, fuss, T.lg("ehfuss", [[0, "#a65020"], [1, "#8a3c14"]]), {
        licht: [0.55, 0.5],
        innen: haar(T, fuss, { n: 150, L: 0.42, flow: (x, y) => (x > 7.5 ? 172 : 185), eimer: EI, wahl: (x, y, z) => klemm(1 + Math.round((fl(x, y) + 0.3) * 2 + z - 0.5), 1, 4), szene: 0.15 }) +
          (T.fein ? [0, 1, 2, 3].map((i) => linie(T, [[7.6 + i * 0.62, -1.25 + i * 0.16], [7.9 + i * 0.62, -0.25]], TIEF, 0.06, 0.45)).join("") : "") +
          mal(T, 0.25, form(T, [[1.8, -0.05], [10.2, -0.05], [9.6, -0.45], [2, -0.6]], TIEF, ` opacity=".4"`)),
        ueber: randhaar(T, fuss, { n: 60, L: 0.4, flow: () => 175, ab: 0.4, eimer: EI, wahl: (x, y, z) => 2 + (z > 0.6 ? 1 : 0), wo: (x, y) => y < -0.5, szene: 0.15 }),
      });
      s += [[10.1, -0.42], [9.55, -0.3], [8.95, -0.22]].map(([x, y]) => kralle(T, x, y, 0.62, 38, "#24160c", 0.25, 0.25)).join("");
      /* ---------- Nuss + Hände ---------- */
      const nuss = [[14.35, -14.2], [15.35, -14.5], [16, -15.4], [15.95, -16.4], [15.3, -17], [14.4, -16.9], [13.75, -16.2], [13.7, -15]];
      const fernHand = [[14.6, -14.6], [15.6, -14.9], [16.2, -15.5], [16.1, -15.9], [15.4, -15.6], [14.6, -15.2]];
      s += teil(T, fernHand, "#6e3214", { licht: [0.3, 0.3] });
      s += teil(T, nuss, T.rg("nuss", [[0, "#c08a50"], [0.6, "#8e5a2c"], [1, "#5a3414"]], 0.35, 0.3, 0.8), {
        licht: [0.45, 0.45, 55, 1.25],
        innen: (T.fein ? [0, 1, 2, 3, 4].map((i) => linie(T, [[13.9 + i * 0.35, -14.4 - i * 0.05], [14.1 + i * 0.4, -15.6], [14.2 + i * 0.38, -16.9 + i * 0.05]], "#5a3010", 0.05, 0.4)).join("") : "") +
          form(T, [[15.2, -16.95], [15.9, -16.5], [16, -15.7], [15.6, -16.2]], "#e4c48a", ` opacity=".75"`) +
          fleck(T, 14.4, -16.2, 0.5, 0.35, "hell", 0.45, -30),
      });
      /* Vorderarm: vom Ellbogen (unter der Brust) schräg nach vorn-oben, Hand umfasst die Nuss von unten */
      const arm = [[10.6, -10.4], [10.2, -11.6], [10.9, -12.8], [12.3, -13.9], [13.6, -14.5], [14.6, -14.6], [15.4, -14.3], [15.3, -13.7], [14.2, -13.4], [13, -12.6], [12, -11.4], [11.4, -10.2]];
      const al = feld(arm, 0.7);
      s += teil(T, arm, T.lg("eharm", [[0, "#b25822"], [1, "#e4d4ba"]], 0, 0, 0.3, 1), {
        licht: [0.6, 0.55],
        innen: haar(T, arm, { n: 150, L: 0.38, flow: (x, y) => (x < 12.8 ? 145 : 170), eimer: EI, wahl: (x, y, z) => (y > -12.6 + (x - 11) * 0.3 ? 6 : klemm(1 + Math.round((al(x, y) + 0.3) * 2 + z - 0.5), 1, 4)), szene: 0.15 }),
        ueber: randhaar(T, arm, { n: 60, L: 0.35, flow: () => 150, ab: 0.5, eimer: EI, wahl: (x, y, z) => (y > -12 ? 6 : 2), wo: (x, y) => x < 13.6, szene: 0.15 }),
      });
      /* Finger: vier, schlank, um die Nuss gelegt, mit langen dunklen Krallen */
      const finger = [[14.2, -14.5, 16.0, -15.9], [14.7, -14.4, 16.2, -15.5], [15.1, -14.3, 16.25, -15.05]];
      for (const [x0, y0, x1, y1] of finger) {
        s += teil(T, schlauch([[x0, y0], [(x0 + x1) / 2 + 0.25, (y0 + y1) / 2 + 0.2], [x1, y1]], [0.36, 0.3, 0.22], true), "#9e4c1e", { licht: [0.12, 0.12] });
        s += kralle(T, x1 - 0.05, y1 + 0.05, 0.38, -110, "#1e140c", 0.26, -0.25);
      }
      /* ---------- Kopf ---------- */
      const kfl = feld(kopf, 2.2);
      const kflow = (x, y) => (x > 14.5 ? 165 : y > -18 ? 150 : 175);
      const kwahl = (x, y, z) => {
        if (y > -17.9 + (x - 12) * 0.12 && x > 11.2) return 6;             // Kinn, Lippe, Kehle creme
        const v = (kfl(x, y) + 0.4) / 1.2;
        if (z < 0.1) return 0;
        return klemm(1 + Math.round(v * 2.6 + (z - 0.5) * 1.1), 1, 4);
      };
      s += teil(T, "#" + kopfId, T.lg("ehkopf", [[0, "#b25620"], [0.7, "#c0642a"], [1, "#d8b490"]], 0, 0, 0.3, 1), {
        licht: [1.4, 1.3, 50, 1.3],
        blende: [0, 0.6, 0.18, 0.5, 0, 1],
        innen:
          /* Wange: leichter Wulst; Augenring (cremeweiß, hinten breiter); Lippe/Kinn creme */
          wulst(T, [[10.8, -20.4], [13.4, -20.6], [14.6, -18.6], [12.8, -17.4], [10.6, -18]], { a: 0.5, w: 0.7, b: 0.25, m: 0.35, s: [TIEF, 0.35], l: [ROTH, 0.4], al: 0.2, wl: 0.5 }) +
          `<g${zottel(T, 1.6, 0.25)}>` + form(T, [[16.3, -18.2], [15.8, -17.45], [14.5, -17.1], [12.6, -17], [11.4, -17.5], [12.2, -17.85], [14.4, -17.95], [15.7, -18.4]], CREME) + `</g>` +
          mal(T, 0.12, `<ellipse cx="13.05" cy="-20.45" rx=".98" ry=".82" fill="${CREME}" opacity=".85" transform="rotate(-8 13.05 -20.45)"/>`) +
          haar(T, kopf, { n: 380, L: 0.36, flow: kflow, eimer: EI, wahl: kwahl, szene: 0.1, kr: 0.1, lf: (x, y) => (x > 15 ? 0.6 : 1) }) +
          haar(T, [[12.1, -20.9], [13.1, -21.4], [14.1, -20.6], [13.6, -19.6], [12.4, -19.6]], { n: 40, L: 0.22, flow: (x, y) => Math.atan2(y + 20.45, x - 13.05) / RAD, eimer: EI, wahl: (x, y, z) => (z < 0.7 ? 6 : 7), szene: 0 }),
        ueber: randhaar(T, kopf, { n: 220, L: 0.32, flow: kflow, ab: 0.45, eimer: EI, wahl: kwahl, kr: 0.1, szene: 0.1, wo: (x, y) => !(x > 15.6 && y > -19.6) && x > 8.8 }),
      });
      /* Nase: Rhinarium klein, dunkel-rosa, kommaförmige Nasenlöcher, feuchter Glanz; Lippenspalte (Y) */
      s += mal(T, 0.06, `<path d="M16.42 -18.95C16.3 -19.25 15.9 -19.3 15.72 -19.05C15.6 -18.8 15.75 -18.45 16.05 -18.35C16.3 -18.3 16.48 -18.6 16.42 -18.95Z" fill="#6a3e34"/>`);
      s += `<path d="M16.38 -18.9Q16.12 -18.78 16.02 -18.55" fill="none" stroke="#1e0e08" stroke-width=".07" stroke-linecap="round"/>`;
      s += `<ellipse cx="15.98" cy="-19.05" rx=".13" ry=".06" fill="#fff" opacity=".55"/>`;
      s += `<path d="M16.12 -18.4Q16.05 -18 15.92 -17.75M15.92 -17.75Q15.55 -17.55 15.15 -17.6" fill="none" stroke="#3a1a10" stroke-width=".05" stroke-linecap="round" opacity=".75"/>`;
      /* Nagezähne: orange, Spitzen hell, knapp unter der Oberlippe sichtbar */
      s += nagezahn(T, 15.72, -17.68, 0.62, 98, 0.2, "#d4802a") + nagezahn(T, 15.58, -17.7, 0.55, 100, 0.18, "#b86a22");
      /* Auge */
      s += auge(T, 13.05, -20.45, 0.56, { ratio: 1.22, winkel: -8, iris: "#2a160a", iris2: "#0e0703", mitte: "#3a2212", pr: 0.62, lid: "#120804", lidw: 0.16, hoehle: 0.22, fasern: true, ring: [CREME, 0.25, 0.5], unten: [5, 0.25], nick: "#8a5a50" });
      /* ---------- nahes Ohr mit Pinsel ---------- */
      const ol = feld(ohr, 0.7);
      s += teil(T, ohr, T.lg("ehohr", [[0, "#8e3c14"], [1, "#b05a26"]], 0, 0, 1, 0), {
        licht: [0.4, 0.35],
        innen: mal(T, 0.12, form(T, [[10.75, -22.3], [10.65, -23.6], [10.9, -24.8], [11.3, -24.5], [11.6, -23.3], [11.7, -22.4]], "#d6a08a", ` opacity=".55"`)) +
          haar(T, ohr, { n: 90, L: 0.3, flow: () => -95, eimer: EI, wahl: (x, y, z) => klemm(1 + Math.round((ol(x, y) + 0.3) * 2 + z - 0.5), 1, 4), szene: 0.1 }),
        ueber: randhaar(T, [[10.1, -24.6], [10.5, -25.5], [10.85, -25.85], [11.3, -25.4], [11.6, -24.8]], { n: 140, L: 2.6, w: 0.07, flow: (x, y) => -98 + (x - 10.8) * 14, ab: 0.15, offen: true, eimer: EI, wahl: (x, y, z) => (z < 0.45 ? 0 : z < 0.85 ? 1 : 2), kr: 0.08, szene: 0.35 }) +
          randhaar(T, ohr, { n: 70, L: 0.35, flow: () => -95, ab: 0.5, eimer: EI, wahl: (x, y, z) => (z < 0.5 ? 2 : 3), szene: 0.1, wo: (x, y) => y > -24.8 }),
      });
      /* ---------- Tasthaare: Schnauze (lang, schwarz), über dem Auge, Wange ---------- */
      s += tasthaar(T, [15.6, -18.6, 1.2, 0.9, 3, 4], -24, 34, 4.6, ["#140a06", "#2a1a10"], 0.05, 0.85, "#3a1a10");
      s += tasthaar(T, [13.6, -21.4, 0.3, 0.1, 1, 3], -120, -80, 2.2, ["#140a06"], 0.035, 0.8);
      s += tasthaar(T, [12, -18.5, 0.2, 0.1, 1, 2], 160, 200, 1.8, ["#140a06"], 0.03, 0.6);
      return { svg: s, box: [-17.3, -30.6, 16.5, 0], fuesse: [5, 6], kopf: [8, -28.5, 17.5, -13] };
    } },
];
