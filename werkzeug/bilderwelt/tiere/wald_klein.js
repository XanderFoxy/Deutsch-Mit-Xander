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
/* Volumen je Körperteil über T.volumen (kern.js, ANLEITUNG Punkt 13); in Szenen liefert er "none" → ohne Filter.
   v = [weich (cm), tiefe, lichthöhe, umgebung] */
const licht = (T, v, inhalt) => {
  if (!v) return inhalt;
  const [sd, ss, el = 50, amb = 0.3] = v;
  const url = T.volumen ? T.volumen("w" + kz(sd) + "_" + kz(ss) + "_" + el + "_" + kz(amb), { weich: sd, tiefe: ss, hoehe: el, umgebung: amb }) : volumen(T, sd, ss, el);
  return url === "none" ? inhalt : `<g filter="${url}">${inhalt}</g>`;
};
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
   Zwei Arten: (1) spitz zulaufende, leicht gebogene Strähnen (Wurzel breit → Spitze) für lange Haare;
   (2) Strichhaare (o.strich = Strichbreite) für kurzes Deckhaar – billig. Je Farbe EIN Pfad, nach Zeilen sortiert
   und relativ verkettet (klein). Eimer: [farbe, deckkraft]. */
function ausgabe(eimer, listen, q, strich) {
  /* Koordinaten in ganzen Vielfachen von q (cm) und relativ → sehr kurz; Pfad mit scale(q) */
  const ganz = (zs) => zs.map((n, i) => (i && n >= 0 ? " " : "") + n).join("");
  return listen.map((h, i) => {
    if (!h.length) return "";
    h.sort((a, b) => (Math.round(a[1] * 2) - Math.round(b[1] * 2)) || (a[0] - b[0]));
    /* Stift: relative Schritte werden gegen die GERUNDETE Stiftposition gerechnet → keine Drift */
    let d = "", px = 0, py = 0;
    const zu = (x, y) => { const dx = Math.round(x / q) - px, dy = Math.round(y / q) - py; px += dx; py += dy; return [dx, dy]; };
    const rel = (x, y) => [Math.round(x / q) - px, Math.round(y / q) - py];
    for (const [x0, y0, x1, y1, w, k] of h) {
      if (strich) {
        d += (d ? "m" : "M") + ganz(zu(x0, y0));
        if (k) {
          const l = Math.hypot(x1 - x0, y1 - y0);
          const c = rel((x0 + x1) / 2 - (y1 - y0) / l * k * l, (y0 + y1) / 2 + (x1 - x0) / l * k * l);
          d += "q" + ganz(c.concat(zu(x1, y1)));
        } else d += "l" + ganz(zu(x1, y1));
        continue;
      }
      const l = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / l * w / 2, ny = (x1 - x0) / l * w / 2;
      d += (d ? "m" : "M") + ganz(zu(x0 + nx, y0 + ny));
      if (k) {
        /* gebogen: Kontrollpunkt seitlich versetzt (k = Biegung in Anteilen der Länge) */
        const mx = (x0 + x1) / 2 + nx / w * 2 * k * l, my = (y0 + y1) / 2 + ny / w * 2 * k * l;
        const c1 = rel(mx, my), e1 = zu(x1, y1), c2 = rel(mx, my), e2 = zu(x0 - nx, y0 - ny);
        d += "q" + ganz(c1.concat(e1)) + "q" + ganz(c2.concat(e2));
      } else { const e1 = zu(x1, y1); d += "l" + ganz(e1.concat(zu(x0 - nx, y0 - ny))); }
    }
    const sc = ` transform="scale(${zahl(q, 3)})"`;
    if (strich) return `<path${sc} d="${d}" fill="none" stroke="${eimer[i][0]}" stroke-width="${zahl(strich * (eimer[i][2] || 1) / q, 2)}"${eimer[i][1] < 1 ? ` stroke-opacity="${eimer[i][1]}"` : ""} stroke-linecap="round"/>`;
    return `<path${sc} d="${d}" fill="${eimer[i][0]}"${eimer[i][1] < 1 ? ` fill-opacity="${eimer[i][1]}"` : ""}/>`;
  }).join("");
}
/* Haar-Raster: T.hq (cm) je Art, in der Szene doppelt so grob */
const hq = (T, o) => (o.q || T.hq || 0.04) * (T.fein ? 1 : 2);
/* Haare in einer Fläche. o: { n, L, w (Wurzelbreite) | strich, flow(x, y) Grad, streu, kr (Biegung), lf(x, y) Längenfaktor,
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
  return ausgabe(o.eimer, listen, hq(T, o), o.strich ? o.strich * (T.fein ? 1 : 1.7) : 0);
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
  return ausgabe(o.eimer, listen, hq(T, o), o.strich ? o.strich * (T.fein ? 1 : 1.7) : 0);
}
/* Fellstruktur (Rauschen, in Wuchsrichtung gestreckt) – nur fein, schwach. b = Box, winkel = Wuchsrichtung */
function fellgrund(T, n, b, winkel, op, o = {}) {
  if (!T.fein) return "";
  const url = T.rauschen(n, Object.assign({ fx: 2.2, fy: 0.25, farbe: "#000", staerke: 2.6, schwelle: 0.55, okt: 2 }, o));
  const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, R = Math.hypot(b[2] - b[0], b[3] - b[1]) / 2 + 1;
  return `<rect x="${zahl(cx - R, 1)}" y="${zahl(cy - R, 1)}" width="${zahl(2 * R, 1)}" height="${zahl(2 * R, 1)}" filter="${url}" opacity="${op}" transform="rotate(${Math.round(winkel - 90)} ${folge([cx, cy], 1)})"/>`;
}
/* Licht → Eimer-Index (n Stufen) mit Zufall */
const stufe = (v, z, n, streu = 0.3) => Math.round(klemm(v + (z - 0.5) * streu) * (n - 1));
/* buschiger Schweif (Eichhörnchen-Schwanz, Pinsel): Locken aus b Haaren wachsen aus der Mittellinie schräg nach
   außen zur Spitze, die Haare einer Locke laufen zu einer gemeinsamen Spitze zusammen (Strähnen statt Gleichverteilung).
   c = Mittellinie, hb(t) = halbe Breite bei t, o: { n (Locken), b (Haare je Locke), eimer, wahl(t, seite, rel, z),
   winkel (Grad gegen die Achse), kr, w | strich, lang, szene, t0, t1 } */
function schweif(T, c, hb, o) {
  const f = laeufer(c), listen = o.eimer.map(() => []);
  const ziel = Math.round(o.n * (T.fein ? 1 : (o.szene != null ? o.szene : 0.15)));
  const b = T.fein ? (o.b || 1) : Math.max(1, Math.round((o.b || 1) / 2));
  for (let j = 0; j < ziel; j++) {
    const t = (o.t0 || 0) + T.rnd() * ((o.t1 || 1) - (o.t0 || 0)), [x, y, tx, ty] = f(t), seite = T.rnd() < 0.5 ? -1 : 1;
    const rel = Math.pow(T.rnd(), o.verteil || 0.7);                      // Wurzel: 0 = Achse … 1 = Rand
    const h = hb(t), wa = (o.winkel || 38) * (0.75 + T.rnd() * 0.5) * RAD;
    const nx = -ty * seite, ny = tx * seite;
    const rx = x + nx * h * rel * 0.6, ry = y + ny * h * rel * 0.6;
    const dx = tx * Math.cos(wa) + nx * Math.sin(wa), dy = ty * Math.cos(wa) + ny * Math.sin(wa);
    const L = h * (1 - rel * 0.5) / Math.max(0.35, Math.sin(wa)) * (0.8 + T.rnd() * 0.4) * (o.lang || 1);
    const idx0 = o.wahl(t, seite, rel, T.rnd());
    const kk = (o.kr || 0.12) * (T.rnd() - 0.3) * -seite;
    const ex = rx + dx * L, ey = ry + dy * L;
    for (let i = 0; i < b; i++) {
      const q = (i - (b - 1) / 2) * L * 0.07 + (T.rnd() - 0.5) * L * 0.04;
      const sx = rx + tx * q - dx * L * 0.12 * T.rnd(), sy = ry + ty * q - dy * L * 0.12 * T.rnd();
      const idx = klemm(idx0 + (b > 1 && T.rnd() < 0.3 ? (T.rnd() < 0.5 ? -1 : 1) : 0), 0, o.eimer.length - 1);
      const tl = 0.82 + T.rnd() * 0.18;
      listen[idx].push([sx, sy, sx + (ex - sx) * tl, sy + (ey - sy) * tl, (o.w || 0.12) * (0.7 + T.rnd() * 0.6) * (T.fein ? 1 : 1.8), kk]);
    }
  }
  return ausgabe(o.eimer, listen, hq(T, o), o.strich ? o.strich * (T.fein ? 1 : 1.8) : 0);
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
    laenge: 0.31, hoehe: 0.31,
    zeichne(T) {
      T.dez = 2;
      const TIEF = "#2e1206", CREME = "#efe5d3";
      /* Strich-Eimer: [Farbe, Deckkraft, Breitenfaktor] – Unterwolle, Deckhaar dunkel/mittel/hell, Spitzen, Wintergrau, Creme */
      const EI = [["#3a1808", 0.55, 1], ["#6e3214", 0.6, 1], ["#9a4c22", 0.6, 1], ["#bf6c36", 0.6, 1], ["#dc9a64", 0.55, 0.9], ["#8e8278", 0.45, 0.9], ["#f6eee2", 0.7, 1], ["#c9b79c", 0.6, 1]];
      const lichtwahl = (v, z, grau = 0.1) => (z < grau ? 5 : z < grau + 0.1 ? 0 : klemm(1 + Math.round(v * 2.6 + (z - 0.5) * 1.3), 1, 4));
      let s = "";
      /* ---------- Formen ---------- */
      const leib = [[1.6, -0.4], [0, -1.6], [-0.6, -3.8], [-0.5, -6.6], [0.2, -9.4], [1.3, -12.2], [2.9, -14.8], [4.8, -16.9], [6.8, -18.4], [8.6, -19.2],
        [10, -17.9], [10.25, -16.2], [10.3, -14], [10, -11.4], [9.4, -8.6], [8.6, -5.8], [7.6, -3.4], [6.4, -1.7], [4.2, -0.7]];
      const keule = [[0.3, -1.2], [-0.35, -3.6], [0.2, -6.4], [1.8, -8.4], [4.2, -9], [6.4, -8], [7.4, -6], [7.2, -3.8], [5.8, -2.2], [3.6, -1.3]];
      const fuss = [[1.8, -0.05], [1.6, -0.8], [2.4, -1.5], [4.2, -1.7], [6, -1.35], [7.4, -0.9], [8.2, -0.55], [8.55, -0.2], [8.4, 0, 1], [2.1, 0, 1]];
      const kopf = [[8.4, -19.1], [8.8, -20.5], [9.7, -21.5], [11, -22.1], [12.5, -22.1], [13.8, -21.6], [14.75, -20.7], [15.35, -19.75], [15.6, -18.95],
        [15.55, -18.35], [15.2, -17.95], [14.6, -17.75], [13.7, -17.6], [12.6, -17.55], [11.4, -17.7], [10.1, -18.1], [9, -18.6]];
      const ohr = [[9.85, -21.2], [9.75, -22.7], [10, -24], [10.45, -24.75], [10.95, -24.35], [11.4, -23.2], [11.75, -21.9]];
      const ohrF = [[11.1, -21.9], [11.15, -23.2], [11.45, -24.3], [11.8, -24.65], [12.2, -24.1], [12.45, -22.9], [12.5, -21.7]];
      /* Schwanz: S-Bogen hinter dem Rücken (2–3 cm Abstand), Spitze nach hinten eingerollt */
      const sm = [[0.8, -1], [-1.8, -1.4], [-4, -2.8], [-5.4, -5.4], [-5.9, -8.8], [-5.7, -12.6], [-5.1, -16.4], [-4.7, -20], [-5, -23], [-6.3, -25.4], [-8.5, -26.6], [-10.8, -26.2], [-12.2, -24.6], [-12.4, -22.8]];
      const HB = [0.8, 2.5, 3.3, 3.7, 3.9, 3.9, 3.8, 3.6, 3.2, 2.6, 1.5];
      const hb = (t) => { const x = klemm(t) * 10, i = Math.min(9, Math.floor(x)); return HB[i] + (HB[i + 1] - HB[i]) * (x - i); };
      const smf = laeufer(sm), su1 = [], su2 = [];
      for (let i = 0; i <= 20; i++) { const t = i / 20, [x, y, tx, ty] = smf(t), h = hb(t) * 0.78; su1.push([x - ty * h, y + tx * h]); su2.push([x + ty * h, y - tx * h]); }
      const schwanz = su1.concat(su2.reverse());
      const FERN = "#7a3c1e";
      /* ---------- ferne Glieder (Körperton, ~28 % dunkler): Hinterfuß-Zehen, fernes Ohr ---------- */
      s += teil(T, schieb(fuss, 0.75, -0.12), FERN, {
        licht: [0.5, 0.45],
        innen: haar(T, schieb(fuss, 0.75, -0.12), { n: 60, L: 0.4, strich: 0.045, flow: () => 175, eimer: EI, wahl: (x, y, z) => (z < 0.5 ? 1 : 2), szene: 0.2 }),
      });
      s += [[9.25, -0.32], [8.75, -0.24]].map(([x, y]) => kralle(T, x, y, 0.55, 40, "#2a1a10", 0.24, 0.25)).join("");
      s += teil(T, ohrF, "#6e3416", {
        licht: [0.35, 0.3],
        innen: mal(T, 0.15, form(T, [[11.5, -22.1], [11.55, -23.3], [11.85, -24.1], [12.1, -23.5], [12.15, -22.2]], "#b88068", ` opacity=".55"`)),
        ueber: randhaar(T, [[11.5, -24.3], [11.8, -24.7], [12.2, -24.2]], { n: 45, L: 2.2, w: 0.055, flow: () => -93, ab: 0.15, offen: true, eimer: EI, wahl: (x, y, z) => (z < 0.6 ? 0 : 1), kr: 0.05, szene: 0.4 }),
      });
      /* ---------- Schwanz: dunkler Kern, Locken nach außen, durchscheinender Haarsaum ---------- */
      const sw = (t, seite, rel, z) => {
        if (z < 0.14) return 0;
        if (rel > 0.7 && z > 0.8) return 4;
        if (seite > 0 && t < 0.8) return z < 0.55 ? 1 : 2;                 // Innenseite (zum Rücken) dunkler
        return z < 0.35 ? 1 : z < 0.72 ? 2 : 3;
      };
      s += teil(T, schwanz, T.lg("ehsw", [[0, "#94481e"], [0.55, "#7c3814"], [1, "#5a260c"]], 0, 0, 1, 0.25), {
        licht: [2, 1.8, 48, 1.25],
        innen: fellgrund(T, "sw", [-14, -31, 2, -0.5], 60, 0.22, { fx: 1.6, fy: 0.18 }) +
          schweif(T, sm, hb, { n: 170, b: 4, eimer: EI, wahl: sw, winkel: 33, kr: 0.1, w: 0.1, lang: 1, szene: 0.25 }),
        ueber: schweif(T, sm, (t) => hb(t) * 1.08, { n: 110, b: 3, eimer: EI, wahl: (t, s2, rel, z) => (z < 0.25 ? 1 : z < 0.65 ? 2 : z < 0.9 ? 3 : 4), winkel: 30, kr: 0.16, w: 0.075, lang: 1.08, verteil: 0.4, szene: 0.2 }),
      });
      /* ---------- Leib ---------- */
      const lf = feld(leib, 4);
      const bauch = (x, y) => y < -2.6 && x > 8.6 - (y + 17) * 0.1 - Math.max(0, -y - 15) * 0.6;   // cremeweiße Unterseite
      const leibId = pfad(T, leib), kopfId = pfad(T, kopf), keuleId = pfad(T, keule);
      const wahlL = (x, y, z) => (bauch(x, y) ? (z < 0.72 ? 6 : 7) : lichtwahl((lf(x, y) + 0.4) / 1.2, z, 0.1));
      const lflow = (x, y) => (bauch(x, y) ? 96 : 112 + (y < -13 ? 8 : 0));
      s += teil(T, "#" + leibId, T.lg("ehleib", [[0, "#8a4220"], [0.5, "#a3532a"], [0.72, "#ad5c2e"], [0.82, "#e8dcc6"], [1, "#efe4d1"]], 0, 0, 1, 0), {
        licht: [2.2, 1.9, 50, 1.22],
        innen: fellgrund(T, "leib", [-1, -20, 11, 0], 105, 0.18) +
          /* Bauch/Brust cremeweiß, Grenze mit Haarspitzen verzahnt */
          `<g${zottel(T, 1.2, 0.35)}>` + form(T, [[10.6, -19], [9.4, -18.2], [9, -15], [8.9, -11.6], [8.3, -8], [7.4, -4.8], [6.4, -2.8], [7.9, -3], [9.4, -6], [10.6, -11], [11, -16]], CREME) + "</g>" +
          /* Okklusion: unter dem Kopf, am Keulenrand */
          schlag(T, kopfId, 0.25, 0.9, 0.45, TIEF, 0.5) + schlag(T, keuleId, 0.35, -0.2, 0.4, TIEF, 0.3) +
          haar(T, leib, { n: 850, L: 0.6, strich: 0.042, flow: lflow, eimer: EI, wahl: wahlL, szene: 0.1, kr: 0.12 }),
        ueber: randhaar(T, leib, { n: 260, L: 0.55, strich: 0.04, flow: lflow, ab: 0.45, eimer: EI, wahl: wahlL, kr: 0.15, szene: 0.1, wo: (x, y) => y < -1.5 && y > -18.6 }),
      });
      /* ---------- Keule: runde Oberschenkel-Masse, Haarwirbel ---------- */
      const kl = feld(keule, 2.8);
      const kflow0 = (x, y) => Math.atan2(y + 5, x - 3.6) / RAD + 105;
      s += teil(T, "#" + keuleId, T.lg("ehkeule", [[0, "#9e4e24"], [0.78, "#9a4a22"], [1, "#cdb99c"]], 0, 0, 0, 1), {
        licht: [1.6, 1.2, 50, 1.22],
        innen: fellgrund(T, "keule", [-0.5, -9, 7.5, -1], 120, 0.15) +
          haar(T, keule, { n: 420, L: 0.52, strich: 0.042, flow: kflow0, eimer: EI, wahl: (x, y, z) => (y > -2.6 && x > 3.2 ? 7 : lichtwahl((kl(x, y) + 0.4) / 1.2, z, 0.08)), szene: 0.1, kr: 0.15 }) +
          mal(T, 0.4, form(T, [[1, -1], [7.4, -2.2], [7.6, -3.2], [1, -2.4]], TIEF, ` opacity=".28"`)),
        ueber: randhaar(T, keule, { n: 150, L: 0.5, strich: 0.04, flow: kflow0, ab: 0.55, eimer: EI, wahl: (x, y, z) => (z < 0.3 ? 1 : z < 0.7 ? 2 : 3), szene: 0.1, wo: (x, y) => y < -2.4 && x > 0.6 }),
      });
      /* ---------- naher Hinterfuß: lang, flach, oben behaart, Zehen mit langen Krallen ---------- */
      const fl = feld(fuss, 0.9);
      s += teil(T, fuss, T.lg("ehfuss", [[0, "#a0522a"], [1, "#844020"]]), {
        licht: [0.55, 0.5],
        innen: haar(T, fuss, { n: 150, L: 0.4, strich: 0.04, flow: (x, y) => (x > 6.5 ? 172 : 185), eimer: EI, wahl: (x, y, z) => klemm(1 + Math.round((fl(x, y) + 0.3) * 2 + z - 0.5), 1, 4), szene: 0.15 }) +
          (T.fein ? [0, 1, 2, 3].map((i) => linie(T, [[6.2 + i * 0.55, -1.15 + i * 0.16], [6.45 + i * 0.55, -0.22]], TIEF, 0.05, 0.4)).join("") : "") +
          mal(T, 0.25, form(T, [[2, -0.05], [8.4, -0.05], [7.8, -0.42], [2.2, -0.55]], TIEF, ` opacity=".38"`)),
        ueber: randhaar(T, fuss, { n: 60, L: 0.36, strich: 0.04, flow: () => 175, ab: 0.4, eimer: EI, wahl: (x, y, z) => 2 + (z > 0.6 ? 1 : 0), wo: (x, y) => y < -0.5, szene: 0.15 }),
      });
      s += [[8.35, -0.36], [7.85, -0.28], [7.3, -0.22]].map(([x, y]) => kralle(T, x, y, 0.6, 38, "#24160c", 0.24, 0.25)).join("");
      /* ---------- Nuss + Hände ---------- */
      const nuss = [[14.05, -15.75], [14.9, -15.8], [15.45, -16.4], [15.4, -17.15], [14.8, -17.55], [14.05, -17.4], [13.65, -16.85], [13.7, -16.15]];
      s += teil(T, [[14.9, -16.9], [15.55, -17.25], [15.75, -16.95], [15.25, -16.55]], "#5e2c14", { licht: [0.2, 0.2] });   // ferne Fingerspitzen
      s += teil(T, nuss, T.rg("nuss", [[0, "#c69458"], [0.55, "#94602e"], [1, "#5c3616"]], 0.32, 0.3, 0.8), {
        licht: [0.4, 0.4, 55, 1.2],
        innen: (T.fein ? [0, 1, 2, 3, 4].map((i) => linie(T, [[13.85 + i * 0.36, -15.85], [13.95 + i * 0.38, -16.6], [14.05 + i * 0.36, -17.4]], "#5a3010", 0.04, 0.35)).join("") : "") +
          form(T, [[14.35, -17.5], [14.9, -17.55], [15.35, -17.15], [14.85, -17.2]], "#dcc08a", ` opacity=".8"`) +
          fleck(T, 14.1, -16.9, 0.42, 0.3, "hell", 0.45, -30),
      });
      /* Vorderarm: vom Ellbogen (an der Bauchseite) schräg nach vorn-oben, außen rotbraun, innen creme */
      const arm = [[8.6, -10.4], [8.4, -11.6], [9.2, -12.9], [10.6, -14.1], [12, -15], [13.2, -15.5], [14, -15.6], [14.3, -15.1], [13.6, -14.5], [12.4, -13.9], [11, -12.8], [9.8, -11.2], [9.3, -10.2]];
      const al = feld(arm, 0.7);
      s += teil(T, arm, T.lg("eharm", [[0, "#a8562a"], [0.6, "#b0602e"], [1, "#dccbb0"]], 0, 0, 0.25, 1), {
        licht: [0.55, 0.5],
        innen: haar(T, arm, { n: 160, L: 0.36, strich: 0.038, flow: (x, y) => (x < 12.4 ? 140 : 165), eimer: EI, wahl: (x, y, z) => (y > -12.4 + (x - 10) * 0.55 ? (z < 0.6 ? 6 : 7) : klemm(1 + Math.round((al(x, y) + 0.3) * 2 + z - 0.5), 1, 4)), szene: 0.15 }),
        ueber: randhaar(T, arm, { n: 60, L: 0.32, strich: 0.036, flow: () => 145, ab: 0.5, eimer: EI, wahl: (x, y, z) => (y > -12 ? 6 : 2), wo: (x, y) => x < 13.4, szene: 0.15 }),
      });
      /* Finger: vier schlanke, um die Nuss gelegt, mit langen dunklen Krallen */
      for (const [x0, y0, x1, y1] of [[13.85, -15.6, 15.1, -16.45], [14, -15.35, 15.3, -16.05], [14.15, -15.1, 15.35, -15.62]]) {
        s += teil(T, schlauch([[x0, y0], [(x0 + x1) / 2 + 0.12, (y0 + y1) / 2 + 0.18], [x1, y1]], [0.3, 0.25, 0.18], true), "#8e4620", { licht: [0.1, 0.1] });
        s += kralle(T, x1 + 0.02, y1 + 0.02, 0.36, -100, "#1e140c", 0.26, -0.25);
      }
      /* ---------- Kopf ---------- */
      const kfl = feld(kopf, 2);
      const kflow = (x, y) => (x > 14.3 ? 168 : y > -18.3 ? 155 : 178);
      const kinn = (x, y) => y > -18.15 + (x - 12) * 0.13 && x > 11;
      const kwahl = (x, y, z) => (kinn(x, y) ? 6 : lichtwahl((kfl(x, y) + 0.4) / 1.2, z, 0.06));
      s += teil(T, "#" + kopfId, T.lg("ehkopf", [[0, "#a4562a"], [0.68, "#b2622f"], [0.8, "#e2d2b8"], [1, "#efe5d3"]], 0, 0, 0, 1), {
        licht: [1.3, 1.1, 50, 1.22],
        blende: [0, 0.6, 0.16, 0.5, 0, 1],
        innen: fellgrund(T, "kopf", [8, -22.5, 16, -17], 175, 0.14, { fx: 3, fy: 0.4 }) +
          /* Wange (Kaumuskel) als weicher Wulst; Augenring cremeweiß; Lippe/Kinn creme */
          wulst(T, [[10.4, -20.2], [12.8, -20], [14, -18.5], [12.4, -17.6], [10.4, -18.2]], { a: 0.45, w: 0.65, b: 0.22, m: 0.35, s: [TIEF, 0.3], l: ["#d08a50", 0.35], al: 0.2, wl: 0.5 }) +
          `<g${zottel(T, 1.8, 0.22)}>` + form(T, [[15.6, -18.4], [15.2, -17.9], [14, -17.55], [12.2, -17.5], [11, -17.9], [11.8, -18.25], [13.8, -18.35], [15.1, -18.7]], CREME) + `</g>` +
          mal(T, 0.1, `<ellipse cx="12.55" cy="-20.05" rx=".98" ry=".8" fill="${CREME}" opacity=".8" transform="rotate(-8 12.55 -20.05)"/>`) +
          haar(T, kopf, { n: 400, L: 0.32, strich: 0.034, flow: kflow, eimer: EI, wahl: kwahl, szene: 0.1, kr: 0.1, lf: (x, y) => (x > 14.6 ? 0.6 : 1) }) +
          haar(T, [[11.6, -20.6], [12.6, -21], [13.6, -20.3], [13.2, -19.25], [11.9, -19.3]], { n: 45, L: 0.2, strich: 0.03, flow: (x, y) => Math.atan2(y + 20.05, x - 12.55) / RAD, eimer: EI, wahl: (x, y, z) => (z < 0.7 ? 6 : 7), szene: 0 }),
        ueber: randhaar(T, kopf, { n: 220, L: 0.3, strich: 0.032, flow: kflow, ab: 0.45, eimer: EI, wahl: kwahl, kr: 0.1, szene: 0.1, wo: (x, y) => !(x > 14.9 && y > -19.4) && x > 8.8 }),
      });
      /* Nase: Rhinarium klein, dunkel-rosa, kommaförmige Nasenlöcher, feuchter Glanz; Lippenspalte (Y) */
      s += mal(T, 0.05, `<path d="M15.68 -19.02C15.56 -19.3 15.2 -19.33 15.03 -19.1C14.92 -18.86 15.05 -18.53 15.33 -18.44C15.56 -18.38 15.74 -18.68 15.68 -19.02Z" fill="#5e3a32"/>`);
      s += `<path d="M15.64 -18.97Q15.4 -18.86 15.3 -18.64" fill="none" stroke="#1a0c08" stroke-width=".065" stroke-linecap="round"/>`;
      s += `<ellipse cx="15.28" cy="-19.1" rx=".12" ry=".055" fill="#fff" opacity=".55"/>`;
      s += `<path d="M15.4 -18.48Q15.33 -18.1 15.2 -17.92M15.2 -17.92Q14.85 -17.74 14.45 -17.78" fill="none" stroke="#3a1a10" stroke-width=".045" stroke-linecap="round" opacity=".75"/>`;
      /* Nagezähne: orange, Spitzen hell, unter der Oberlippe sichtbar, auf der Nuss */
      s += nagezahn(T, 15.0, -17.82, 0.5, 100, 0.19, "#d27e2a") + nagezahn(T, 14.86, -17.84, 0.44, 102, 0.17, "#b06422");
      /* Auge */
      s += auge(T, 12.55, -20.05, 0.55, { ratio: 1.22, winkel: -8, iris: "#2a160a", iris2: "#0e0703", mitte: "#3a2212", pr: 0.62, lid: "#120804", lidw: 0.15, hoehle: 0.25, fasern: true, ring: [CREME, 0.22, 0.45], unten: [5, 0.25], nick: "#8a5a50" });
      /* ---------- nahes Ohr mit Pinsel ---------- */
      const ol = feld(ohr, 0.6);
      s += teil(T, ohr, T.lg("ehohr", [[0, "#86401c"], [1, "#a85a2c"]], 0, 0, 1, 0), {
        licht: [0.35, 0.3],
        innen: mal(T, 0.12, form(T, [[10.35, -21.6], [10.25, -22.8], [10.5, -23.9], [10.85, -23.7], [11.1, -22.7], [11.2, -21.8]], "#c8907a", ` opacity=".5"`)) +
          haar(T, ohr, { n: 90, L: 0.28, strich: 0.03, flow: () => -95, eimer: EI, wahl: (x, y, z) => klemm(1 + Math.round((ol(x, y) + 0.3) * 2 + z - 0.5), 1, 4), szene: 0.1 }),
        ueber: randhaar(T, [[9.85, -23.9], [10.15, -24.6], [10.5, -24.95], [10.9, -24.55], [11.15, -23.9]], { n: 130, L: 2.5, w: 0.06, flow: (x, y) => -97 + (x - 10.5) * 12, ab: 0.12, offen: true, eimer: EI, wahl: (x, y, z) => (z < 0.42 ? 0 : z < 0.85 ? 1 : 2), kr: 0.07, szene: 0.35 }) +
          randhaar(T, ohr, { n: 70, L: 0.32, strich: 0.032, flow: () => -95, ab: 0.5, eimer: EI, wahl: (x, y, z) => (z < 0.5 ? 2 : 3), szene: 0.1, wo: (x, y) => y > -24.2 }),
      });
      /* ---------- Tasthaare: Schnauze (lang, schwarz), über dem Auge, Wange ---------- */
      s += tasthaar(T, [14.9, -18.75, 1.1, 0.8, 3, 4], -24, 34, 4.4, ["#140a06", "#2a1a10"], 0.05, 0.85, "#3a1a10");
      s += tasthaar(T, [13.1, -21.2, 0.3, 0.1, 1, 3], -120, -80, 2, ["#140a06"], 0.035, 0.8);
      s += tasthaar(T, [11.4, -18.6, 0.2, 0.1, 1, 2], 160, 200, 1.6, ["#140a06"], 0.03, 0.6);
      return { svg: s, box: [-16.2, -30.9, 15.7, 0], fuesse: [4.5, 5.4], kopf: [8, -27.5, 17.5, -14.5] };
    } },
];
