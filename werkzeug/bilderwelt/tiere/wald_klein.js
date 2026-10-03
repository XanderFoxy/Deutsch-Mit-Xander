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
/* Weichzeichner: Stärken auf wenige Stufen gerundet → wenige Filter (Bytes) */
const STUFEN = [0.02, 0.04, 0.06, 0.09, 0.12, 0.16, 0.2, 0.25, 0.3, 0.4, 0.5, 0.65, 0.8, 1, 1.3, 1.7, 2.2, 3, 4, 5.5, 7.5, 10];
const stufig = (v) => STUFEN.reduce((b, x) => (Math.abs(Math.log(x / v)) < Math.abs(Math.log(b / v)) ? x : b), STUFEN[0]);
const weich = (T, sd) => { sd = stufig(sd); return filt(T, "bl" + kz(sd), `<feGaussianBlur stdDeviation="${zahl(sd, 3)}"/>`); };
const mal = (T, sd, inhalt) => (inhalt ? `<g filter="${weich(T, sd)}">${inhalt}</g>` : "");
/* Volumen-Licht je Körperteil (wie T.volumen in kern.js, ANLEITUNG Punkt 13): die eigene Silhouette, weichgezeichnet,
   ist die Höhenkarte; diffuses Licht von links oben (Azimut 225°) → Lichtkante oben links, Kernschatten unten rechts,
   weicher Terminator. Zusätzlich wird die Lichtkarte leicht geglättet – sonst zeichnen sich bei kleinen Teilen die
   8-Bit-Stufen der Höhenkarte als Höhenlinien („Fingerabdruck“) auf hellem Fell ab (mit T.volumen am Großbild gesehen).
   Normierung wie kern: flache Mitte = Grundfarbe. In Szenen (T.fein = false) ohne Filter, wie T.volumen.
   sd = weich (cm, ≈ 20–30 % der Dicke), ss = tiefe, el = Lichthöhe, amb = Umgebungslicht */
function volumen(T, sd, ss = sd, el = 50, amb = 0.3) {
  if (!T.fein) return "none";
  /* auf wenige Stufen runden → wenige Filter */
  const r = Math.round(ss / sd * 4) / 4;
  sd = stufig(sd); ss = sd * r; amb = Math.round(amb * 20) / 20; el = Math.round(el / 5) * 5;
  const k1 = (1 - amb) / Math.sin(el * RAD);
  return filt(T, "vl" + kz(sd) + "_" + kz(r) + "_" + el + "_" + kz(amb),
    `<feGaussianBlur in="SourceAlpha" stdDeviation="${zahl(sd, 3)}"/>` +
    `<feDiffuseLighting surfaceScale="${zahl(ss, 3)}" lighting-color="#fff"><feDistantLight azimuth="225" elevation="${el}"/></feDiffuseLighting>` +
    `<feGaussianBlur stdDeviation="${zahl(sd * 0.15, 3)}"/>` +
    `<feComposite in2="SourceGraphic" operator="arithmetic" k1="${zahl(k1, 3)}" k3="${amb}"/><feComposite in2="SourceAlpha" operator="in"/>`,
    `x="-12%" y="-12%" width="124%" height="124%"`);
}
/* v = [weich (cm), tiefe, lichthöhe, umgebung]; box = [x0, y0, x1, y1, rand] der Form (enge Filterregion) */
const licht = (T, v, inhalt) => {
  if (!v) return inhalt;
  const url = volumen(T, v[0], v[1], v[2], v[3]);
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
  if (typeof pts !== "string") { T._pts = T._pts || {}; T._pts[id] = pts; }
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
  /* Volumen-Licht nur auf Grundfarbe + Innenzeichnung (einfache Formen → schnell); Fell (Textur, Haare) liegt darüber
     und trägt sein Licht selbst (Farbe aus dem Licht-Feld) – Rauschen/tausend Haare im Filter kosten das Zehnfache */
  s = licht(T, o.licht, s);
  const fell = (o.haare || "") + (o.nachInnen || "");
  if (fell) s += `<g clip-path="url(#${id}k)">${fell}</g>`;
  s += (o.ueber || "") + (o.nach || "");
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
    let wechsel = false;
    for (let [x0, y0, x1, y1, w, k] of h) {
      if (strich) {
        /* jedes zweite Haar rückwärts zeichnen: der Stift springt dann nur zum Nachbarn (kürzere Zahlen) */
        if ((wechsel = !wechsel)) { [x0, y0, x1, y1] = [x1, y1, x0, y0]; k = -k; }
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
/* Fellstruktur: zwei Rauschlagen (dunkle Haarzwischenräume, helle Haarschäfte), in Wuchsrichtung gestreckt – billig
   und dicht wie echtes Fell; die Filter sind je Art EINMAL da (o.f = [fx, fy] je cm), Teile drehen nur das Rechteck.
   b = Box, winkel = Wuchsrichtung (Grad), opD/opH = Deckkraft dunkel/hell. Nur fein. */
function fellgrund(T, n, b, winkel, opD, opH = opD * 0.7, o = {}) {
  if (!T.fein) return "";
  const [fx, fy] = o.f || T.fellF || [10, 1.2];
  const k = kz(fx) + "_" + kz(fy);
  const dU = T.rauschen("fd" + k, { fx, fy, farbe: o.dunkel || T.fellD || "#1e0c04", staerke: 3, schwelle: 0.55, okt: 3, seed: 3 });
  const hU = T.rauschen("fh" + k, { fx, fy, farbe: o.hell || T.fellH || "#f0c090", staerke: 3, schwelle: 0.6, okt: 3, seed: 9 });
  /* Rechteck im gedrehten System gerade so groß, dass es die Box deckt (kleine Filterfläche = schnell) */
  const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, th = (winkel - 90) * RAD, c = Math.abs(Math.cos(th)), sn = Math.abs(Math.sin(th));
  const w = (b[2] - b[0]) * c + (b[3] - b[1]) * sn + 0.4, h = (b[2] - b[0]) * sn + (b[3] - b[1]) * c + 0.4;
  const r = `x="${zahl(cx - w / 2, 1)}" y="${zahl(cy - h / 2, 1)}" width="${zahl(w, 1)}" height="${zahl(h, 1)}"`;
  return `<g transform="rotate(${Math.round(winkel - 90)} ${folge([cx, cy], 1)})"><rect ${r} filter="${dU}" opacity="${opD}"/>` + (opH ? `<rect ${r} filter="${hU}" opacity="${opH}"/>` : "") + `</g>`;
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
    const kk = (o.kr != null ? o.kr : 0.12) * (T.rnd() - 0.3) * -seite;
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

/* Haarpinsel (Ohrpinsel, Schwanzquaste): Haare von Wurzeln entlang einer Linie (wurzeln) laufen zu einer gemeinsamen
   Spitze (spitze) zusammen, mit Streuung st (cm) – ergibt einen spitzen, dichten Pinsel. */
function pinsel(T, wurzeln, spitze, n, o) {
  const k = kurve(wurzeln, 6, false), listen = o.eimer.map(() => []);
  const ziel = Math.round(n * (T.fein ? 1 : (o.szene != null ? o.szene : 0.3)));
  for (let j = 0; j < ziel; j++) {
    const p = k[Math.floor(T.rnd() * k.length)], u = T.rnd();
    const ex = spitze[0] + (T.rnd() - 0.5) * 2 * (o.st || 0.4) * (0.3 + u), ey = spitze[1] + (T.rnd() - 0.5) * (o.st || 0.4) + u * (o.kurz || 0.8);
    const tl = 0.7 + T.rnd() * 0.35;
    listen[klemm(o.wahl(u, T.rnd()), 0, o.eimer.length - 1)].push([p[0], p[1], p[0] + (ex - p[0]) * tl, p[1] + (ey - p[1]) * tl, (o.w || 0.05) * (0.7 + T.rnd() * 0.6) * (T.fein ? 1 : 1.8), (o.kr != null ? o.kr : 0.06) * (T.rnd() - 0.5) * 2]);
  }
  return ausgabe(o.eimer, listen, hq(T, o), 0);
}

/* Stacheln (Igel): jeder Stachel EINMAL als Strich in den defs, dann dreimal per <use> gezeichnet – heller Grund, dunkles
   Band (stroke-dasharray, beginnt in jedem Teilpfad neu), helle Spitze (dünner → spitz zulaufend). Gruppen von hinten nach
   vorn (vordere Stacheln liegen wie Dachziegel auf den hinteren), je Gruppe Licht- und Schattenseite getrennt gefärbt.
   wurzeln: Liste [x, y, winkel, laenge]; o: { gruppen, licht(x, y) → 0…1, farben: { grund, band, spitze } je [hell, dunkel],
   w (Strichbreite), band: [von, bis], spitze: von (Anteile der Länge) } */
function stacheln(T, liste, o) {
  const G = o.gruppen || 4, q = T.fein ? 0.03 : 0.06;
  const xs = liste.map((p) => p[0]), x0 = Math.min(...xs), x1 = Math.max(...xs) + 0.01;
  const eimer = [];
  for (let g = 0; g < G; g++) eimer.push([[], []]);
  for (const p of liste) {
    const g = Math.floor((p[0] - x0) / (x1 - x0) * G), hell = o.licht(p[0], p[1]) > 0.5 ? 0 : 1;
    eimer[g][hell].push(p);
  }
  const L = o.L, w = o.w || 0.1;
  const [b0, b1] = o.band || [0.32, 0.78], sp = o.spitze || 0.8;
  let s = "";
  eimer.forEach((paar) => paar.forEach((ps, hell) => {
    if (!ps.length) return;
    ps.sort((a, b) => (Math.round(a[1] * 2) - Math.round(b[1] * 2)) || (a[0] - b[0]));
    let d = "", px = 0, py = 0;
    const zu = (x, y) => { const dx = Math.round(x / q) - px, dy = Math.round(y / q) - py; px += dx; py += dy; return [dx, dy]; };
    const ganz = (zs) => zs.map((n, i) => (i && n >= 0 ? " " : "") + n).join("");
    for (const [x, y, a, l] of ps) {
      const ex = x + Math.cos(a * RAD) * l, ey = y + Math.sin(a * RAD) * l;
      d += (d ? "m" : "M") + ganz(zu(x, y)) + "l" + ganz(zu(ex, ey));
    }
    T._st = (T._st || 0) + 1;
    const id = T.id("st" + T._st);
    T.def(`<path id="${id}" transform="scale(${zahl(q, 3)})" d="${d}"/>`);
    const f = (k) => o.farben[k][hell];
    const u = (farbe, breite, da, off, cap) => `<use href="#${id}" fill="none" stroke="${farbe}" stroke-width="${zahl(breite / q, 2)}"${da ? ` stroke-dasharray="${zahl(da[0] / q, 1)} ${zahl(da[1] / q, 1)}" stroke-dashoffset="${zahl(-off / q, 1)}"` : ""}${cap ? ` stroke-linecap="round"` : ""}/>`;
    s += u(f("grund"), w, null, 0, true) + u(f("band"), w * 0.95, [(b1 - b0) * L, 9 * L], b0 * L, true) +
      (T.fein || hell === 0 ? u(f("spitze"), w * 0.62, [(0.94 - sp) * L, 9 * L], sp * L, true) : "") + (T.fein ? u(f("spitze"), w * 0.32, [0.2 * L, 9 * L], 0.9 * L, true) : "");
  }));
  return s;
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
  const s1 = form(T, pts, farbe) + (T.fein ? `<path d="M${folge(P(l * 0.08, -dicke * l * 0.45), 3)}Q${folge(P(l * 0.5, -dicke * l * 0.45 + bieg * l * 0.2).concat(P(l * 0.82, bieg * l * 0.7)), 3)}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="${zahl(l * 0.06, 3)}" stroke-linecap="round"/>` : "");
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
    laenge: 0.28, hoehe: 0.245,
    zeichne(T) {
      T.dez = 1; T.hq = 0.03; T.fellF = [11, 1.4]; T.fellD = "#1e0a02"; T.fellH = "#f2b47a";
      const TIEF = "#2a1206", CREME = "#f8e9cc";
      /* Eimer: [Farbe, Deckkraft, Breitenfaktor] – Unterwolle, Deckhaar dunkel/mittel/hell, Spitzen, Wintergrau, Creme */
      const EI = [["#2e1408", 0.5, 1], ["#6a3418", 0.5, 1], ["#94502a", 0.5, 1], ["#b46a3a", 0.5, 1], ["#d69c6a", 0.5, 0.9], ["#8a7e74", 0.45, 0.9], ["#fcf3e2", 0.45, 1], ["#dcc4a0", 0.45, 1]];
      const lichtwahl = (v, z, grau = 0.1) => (z < grau ? 5 : z < grau + 0.1 ? 0 : klemm(1 + Math.round(v * 2.8 + (z - 0.5) * 1.1 - 0.3), 1, 4));
      let s = "";
      /* ---------- Formen (cm) ---------- */
      const leib = [[1.8, -0.4], [0.3, -1.6], [-0.4, -3.8], [-0.4, -6.2], [0.1, -8.6], [1, -10.8], [2.3, -12.9], [3.9, -14.8], [5.6, -16.1], [7.3, -16.75], [8.6, -16.8],
        [9.7, -15.1], [10.5, -13.5], [10.6, -11.6], [10.2, -9.8], [9.4, -8.2], [8.9, -6.8], [8.7, -5.2], [8, -3.6], [6.8, -2.2], [4.6, -1]];
      const bauchP = [[10.2, -16.4], [9, -15.4], [8.6, -13.4], [8.5, -11.4], [8.2, -9.6], [7.7, -8.2], [7.5, -6.8], [7.5, -5.2], [7, -3.8], [6.2, -2.6], [7.6, -2.9], [8.8, -5.2], [9.2, -6.9], [10, -8.6], [10.8, -10], [11, -13.6]];
      const keule = [[0.4, -1.2], [-0.15, -3.6], [0.2, -6.1], [1.7, -7.7], [3.9, -8.1], [5.9, -7.4], [7.5, -6.3], [8.1, -4.9], [7.6, -3.4], [6, -2], [3.6, -1.2]];
      const fuss = [[1.8, -0.05], [1.6, -0.8], [2.4, -1.5], [4.2, -1.7], [6, -1.35], [7.4, -0.9], [8.2, -0.55], [8.55, -0.2], [8.4, 0, 1], [2.1, 0, 1]];
      const kopf = [[8.3, -16.6], [8.6, -17.9], [9.4, -18.9], [10.6, -19.45], [12, -19.55], [13.3, -19.15], [14.2, -18.45], [14.85, -17.6], [15.25, -16.9], [15.4, -16.4],
        [15.3, -15.95], [15, -15.65], [14.55, -15.45], [13.9, -15.15], [13, -14.9], [11.9, -14.8], [10.7, -14.9], [9.6, -15.25], [8.8, -15.85]];
      const ohr = [[9.8, -18.7], [9.6, -19.9], [9.75, -21], [10.1, -21.8], [10.5, -22.05], [10.85, -21.7], [11.15, -20.9], [11.45, -19.95], [11.75, -19.2]];
      const ohrF = schieb(ohr, 1.25, 0.25);
      /* Schwanz (Knochen 19 cm + Haarspitze): S-Bogen hinter dem Rücken, Spitze nach hinten eingerollt */
      const sm = [[0.8, -1.2], [-1.6, -1.6], [-3.4, -3], [-4.4, -5.4], [-4.6, -8.4], [-4.3, -11.4], [-4, -14.4], [-4.3, -17], [-5.4, -19], [-7.2, -20], [-9, -19.5], [-10, -18]];
      const HB = [0.7, 2.2, 3, 3.4, 3.6, 3.6, 3.5, 3.3, 3, 2.5, 1.6];
      const hb = (t) => { const x = klemm(t) * 10, i = Math.min(9, Math.floor(x)); return HB[i] + (HB[i + 1] - HB[i]) * (x - i); };
      const smf = laeufer(sm), su1 = [], su2 = [];
      for (let i = 0; i <= 20; i++) { const t = i / 20, [x, y, tx, ty] = smf(t), h = hb(t) * (0.45 + 0.2 * (1 - t)); su1.push([x - ty * h, y + tx * h]); su2.push([x + ty * h, y - tx * h]); }
      const schwanz = su1.concat(su2.reverse());
      const TUFT = [["#1e0c06", 0.7], ["#3e1a0c", 0.65], ["#6a3018", 0.55]];
      /* ---------- ferne Glieder (Körperton, ~28 % dunkler): Hinterfuß-Zehen, fernes Ohr ---------- */
      const FERN = "#74381c";
      s += teil(T, schieb(fuss, 0.75, -0.12), FERN, {
        licht: [0.45, 0.6],
        haare: haar(T, schieb(fuss, 0.75, -0.12), { n: 40, L: 0.4, strich: 0.04, flow: () => 175, eimer: EI, wahl: (x, y, z) => (z < 0.5 ? 1 : 2), szene: 0 }),
      });
      s += [[9.25, -0.32], [8.75, -0.24]].map(([x, y]) => kralle(T, x, y, 0.5, 40, "#1e140c", 0.24, 0.25)).join("");
      s += teil(T, ohrF, "#62301a", {
        licht: [0.3, 0.4],
        innen: mal(T, 0.15, form(T, schieb([[10.2, -19.2], [10.05, -20.2], [10.25, -21.2], [10.55, -21.4], [10.85, -20.6], [11.1, -19.5]], 1.25, 0.25), "#b07a66", ` opacity=".4"`)),
        ueber: pinsel(T, schieb([[9.75, -21], [10.1, -21.8], [10.5, -22.05], [10.85, -21.7], [11.1, -21.1]], 1.25, 0.25), [11.4, -24.1], 55, { eimer: TUFT, wahl: (u, z) => (z < 0.5 ? 0 : 1), st: 0.45, w: 0.05, kr: 0.001, szene: 0.3, q: 0.04 }),
      });
      /* ---------- Schwanz: weicher dunkler Kern (Rand unscharf), Locken nach außen, durchscheinender Haarsaum ---------- */
      const sw = (t, seite, rel, z) => {
        if (z < 0.12) return 0;
        if (rel > 0.6 && z > 0.8) return 4;
        if (seite > 0 && t < 0.8) return z < 0.55 ? 1 : 2;                 // Innenseite (zum Rücken) dunkler
        return z < 0.32 ? 1 : z < 0.7 ? 2 : 3;
      };
      s += mal(T, 0.3, teil(T, schwanz, T.lg("ehsw", [[0, "#7e3e1c"], [0.55, "#6a3014"], [1, "#4e220c"]], 0, 0, 1, 0.25), { licht: [1.2, 1.8, 50, 0.34], rand: 1 }));
      /* Locken (breite, spitz zulaufende Strähnen) bilden die Masse, darüber feine Haare und ein durchscheinender Saum */
      s += mal(T, 0.06, schweif(T, sm, (t) => hb(t) * 0.95, { n: 135, b: 1, eimer: [["#3e1a0a", 0.55], ["#6a3014", 0.55], ["#8e4620", 0.55], ["#b0602e", 0.5]], wahl: (t, s2, rel, z) => (s2 > 0 && t < 0.8 ? (z < 0.4 ? 0 : 1) : z < 0.2 ? 0 : z < 0.55 ? 1 : z < 0.85 ? 2 : 3), winkel: 30, kr: 0.12, w: 0.5, lang: 0.92, verteil: 0.9, szene: 0.35, q: 0.06 }));
      s += schweif(T, sm, hb, { n: 105, b: 3, eimer: EI, wahl: sw, winkel: 32, strich: 0.04, lang: 0.98, szene: 0.12, q: 0.06 }) +
        schweif(T, sm, (t) => hb(t) * 1.1, { n: 88, b: 2, eimer: [["#4a2210", 0.4], ["#7a3a1a", 0.42], ["#a2582c", 0.42], ["#c47e4a", 0.42], ["#dca878", 0.42]], wahl: (t, s2, rel, z) => (z < 0.25 ? 1 : z < 0.62 ? 2 : z < 0.9 ? 3 : 4), winkel: 28, kr: 0, w: 0.05, lang: 1.12, verteil: 0.35, szene: 0.1, q: 0.05 });
      /* ---------- Leib ---------- */
      const lf = feld(leib, 4);
      const bauch = (x, y) => T.inPoly(x, y, bauchP);
      const leibId = pfad(T, leib), kopfId = pfad(T, kopf), keuleId = pfad(T, keule);
      const wahlL = (x, y, z) => (bauch(x, y) ? (z < 0.7 ? 6 : 7) : lichtwahl((lf(x, y) + 0.4) / 1.2, z, 0.12));
      const lflow = (x, y) => (bauch(x, y) ? 96 : 112 + (y < -11 ? 10 : 0));
      s += teil(T, "#" + leibId, T.lg("ehleib", [[0, "#86442a"], [0.5, "#9a5230"], [1, "#a85c32"]], 0, 0, 1, 0), {
        licht: [2.2, 3, 50, 0.34],
        innen: `<g${zottel(T, 1.2, 0.35)}>` + form(T, bauchP, T.lg("ehbauch", [[0, "#fbefda"], [0.6, "#f6e2bc"], [1, "#efcf9c"]])) + "</g>" +
          /* Okklusion: unter dem Kopf, am Keulenrand */
          schlag(T, kopfId, 0.25, 0.9, 0.45, TIEF, 0.45),
        nachInnen: mal(T, 0.6, linie(T, [[10.3, -14.6], [10.4, -12], [10, -9.6], [9.1, -7.6], [8.5, -5.2], [7.6, -3.2]], "#ffe2b8", 0.9, 0.35)),
        haare: fellgrund(T, "leib", [-1, -17, 11, 0], 112, 0.45, 0.3) +
          haar(T, leib, { n: 180, L: 0.6, strich: 0.032, flow: lflow, eimer: EI, wahl: wahlL, szene: 0 }),
        ueber: randhaar(T, leib, { n: 145, L: 0.55, strich: 0.032, flow: lflow, ab: 0.45, eimer: EI, wahl: wahlL, szene: 0, wo: (x, y) => y < -1.5 && y > -16.2 }),
      });
      /* ---------- Keule: Oberschenkel-Masse, oben weich in den Rumpf übergehend, Fell nach hinten-unten ---------- */
      const kl = feld(keule, 2.6);
      const kflow0 = (x, y) => 150 - klemm((x - 1) / 6) * 50;
      s += teil(T, "#" + keuleId, T.lg("ehkeule", [[0, "#985030"], [0.8, "#924a28"], [1, "#c8b69c"]], 0, 0, 0, 1), {
        licht: [1.4, 1.1, 50, 0.4],
        blende: [0, 0, 0.25, 0.5, 0, 1],
        innen: mal(T, 0.4, form(T, [[1, -1], [7, -2.2], [7.2, -3.2], [1, -2.4]], TIEF, ` opacity=".25"`)),
        haare: fellgrund(T, "keule", [-0.5, -9, 7.5, -1], 140, 0.45, 0.3) +
          haar(T, keule, { n: 110, L: 0.55, strich: 0.032, flow: kflow0, eimer: EI, wahl: (x, y, z) => (y > -2.5 && x > 3.2 ? 7 : lichtwahl((kl(x, y) + 0.4) / 1.2, z, 0.1)), szene: 0 }),
        ueber: randhaar(T, keule, { n: 75, L: 0.45, strich: 0.032, flow: kflow0, ab: 0.55, eimer: EI, wahl: (x, y, z) => (z < 0.3 ? 1 : z < 0.7 ? 2 : 3), szene: 0, wo: (x, y) => y < -2.4 && x > 3.5 }),
      });
      /* ---------- naher Hinterfuß: lang, flach, oben behaart, Zehen mit langen Krallen ---------- */
      const fl = feld(fuss, 0.9);
      s += teil(T, fuss, T.lg("ehfuss", [[0, "#9a5230"], [1, "#7e4024"]]), {
        licht: [0.5, 0.7],
        innen: (T.fein ? [0, 1, 2, 3].map((i) => linie(T, [[6.2 + i * 0.55, -1.15 + i * 0.16], [6.45 + i * 0.55, -0.22]], TIEF, 0.05, 0.4)).join("") : "") +
          mal(T, 0.25, form(T, [[2, -0.05], [8.4, -0.05], [7.8, -0.42], [2.2, -0.55]], TIEF, ` opacity=".38"`)),
        haare: fellgrund(T, "fuss", [1.5, -2, 8.6, 0], 178, 0.35, 0.25) +
          haar(T, fuss, { n: 100, L: 0.38, strich: 0.03, flow: (x, y) => (x > 6.5 ? 172 : 185), eimer: EI, wahl: (x, y, z) => klemm(1 + Math.round((fl(x, y) + 0.3) * 2 + z - 0.5), 1, 4), szene: 0 }),
        ueber: randhaar(T, fuss, { n: 60, L: 0.34, strich: 0.03, flow: () => 175, ab: 0.4, eimer: EI, wahl: (x, y, z) => 2 + (z > 0.6 ? 1 : 0), wo: (x, y) => y < -0.5, szene: 0 }),
      });
      s += [[8.35, -0.36], [7.85, -0.28], [7.3, -0.22]].map(([x, y]) => kralle(T, x, y, 0.55, 38, "#1e140c", 0.24, 0.25)).join("");
      /* ---------- Nuss + Hände ---------- */
      const nuss = [[14.65, -13.6], [15.5, -13.75], [15.95, -14.4], [15.85, -15.1], [15.25, -15.3], [14.5, -15.2], [14.15, -14.7], [14.2, -14.05]];
      s += teil(T, nuss, T.rg("nuss", [[0, "#c69458"], [0.55, "#94602e"], [1, "#5c3616"]], 0.32, 0.3, 0.8), {
        licht: [0.35, 0.5, 55, 0.35],
        innen: (T.fein ? [0, 1, 2, 3, 4].map((i) => linie(T, [[14.35 + i * 0.36, -13.7], [14.45 + i * 0.38, -14.5], [14.55 + i * 0.36, -15.25]], "#5a3010", 0.04, 0.35)).join("") : "") +
          form(T, [[14.85, -15.3], [15.4, -15.35], [15.85, -15.0], [15.35, -15.05]], "#dcc08a", ` opacity=".8"`) +
          fleck(T, 14.6, -14.75, 0.42, 0.3, "hell", 0.45, -30),
      });
      /* Vorderarm: Ellbogen am Körper, Unterarm schräg nach vorn-oben, außen rotbraun, innen creme */
      const arm = [[9.3, -10.2], [9.2, -11.3], [10, -12.2], [11.3, -12.95], [12.6, -13.5], [13.6, -13.8], [14.3, -13.75], [14.45, -13.3], [13.8, -12.95], [12.7, -12.5], [11.5, -11.7], [10.5, -10.6], [10, -9.9]];
      const al = feld(arm, 0.7);
      s += teil(T, arm, T.lg("eharm", [[0, "#9e5430"], [0.6, "#a85c32"], [1, "#d8c8ae"]], 0, 0, 0.25, 1), {
        licht: [0.45, 0.7],
        haare: fellgrund(T, "arm", [9, -14, 14.5, -9.8], 150, 0.35, 0.25) +
          haar(T, arm, { n: 90, L: 0.34, strich: 0.028, flow: (x, y) => (x < 12.4 ? 140 : 165), eimer: EI, wahl: (x, y, z) => (y > -11.4 + (x - 10.5) * 0.55 ? (z < 0.6 ? 6 : 7) : klemm(1 + Math.round((al(x, y) + 0.3) * 2 + z - 0.5), 1, 4)), szene: 0 }),
        ueber: randhaar(T, arm, { n: 60, L: 0.3, strich: 0.028, flow: () => 145, ab: 0.5, eimer: EI, wahl: (x, y, z) => (y > -11.2 ? 6 : 2), wo: (x, y) => x < 13.6, szene: 0 }),
      });
      /* Finger: drei sichtbare (der vierte verdeckt), schlank, behaart, um die Nuss gelegt, mit dunklen Sichelkrallen */
      for (const [x0, y0, x1, y1] of [[14.1, -13.75, 15.55, -14.3], [14.3, -13.5, 15.7, -13.9], [14.45, -13.25, 15.6, -13.52]]) {
        s += linie(T, [[x0, y0], [(x0 + x1) / 2 + 0.1, (y0 + y1) / 2 + 0.13], [x1, y1]], "#6a3418", 0.2) + (T.fein ? linie(T, [[x0, y0 - 0.05], [(x0 + x1) / 2 + 0.1, (y0 + y1) / 2 + 0.07]], "#b06a3c", 0.07, 0.6) : "");
        s += kralle(T, x1 + 0.02, y1 - 0.02, 0.26, -128, "#1a100a", 0.24, 0.3);
      }
      /* ---------- Kopf: kurze stumpfe Schnauze, gewölbte Stirn, volle Wange ---------- */
      const kfl = feld(kopf, 2);
      const kflow = (x, y) => (x > 13.8 ? 168 : y > -15.6 ? 160 : 180);
      const kinnP = [[15.35, -15.9], [14.6, -15.35], [13.4, -14.95], [11.9, -14.75], [10.4, -14.95], [9.5, -15.5], [10.8, -15.4], [12.4, -15.25], [13.8, -15.45], [14.9, -15.85]];
      const kwahl = (x, y, z) => (T.inPoly(x, y, kinnP) ? 6 : lichtwahl((kfl(x, y) + 0.4) / 1.2, z, 0.06));
      s += teil(T, "#" + kopfId, T.lg("ehkopf", [[0, "#9a5230"], [0.6, "#a85c32"], [1, "#a0582f"]], 0, 0, 0, 1), {
        licht: [1.1, 1.8, 50, 0.34],
        blende: [0, 0.6, 0.16, 0.5, 0, 1],
        innen:
          /* Wange (Kaumuskel) als weicher Wulst; Lippe, Kinn und Kehle creme als Sichel entlang der Unterkante */
          wulst(T, [[10.4, -17.4], [12.6, -17], [13.6, -15.7], [12.2, -15], [10.4, -15.4]], { a: 0.45, w: 0.65, b: 0.22, m: 0.35, s: [TIEF, 0.25], l: ["#c88450", 0.3], al: 0.2, wl: 0.5 }) +
          `<g${zottel(T, 1.8, 0.2)}>` + form(T, kinnP, CREME) + `</g>` +
          mal(T, 0.12, `<ellipse cx="12.6" cy="-17.5" rx=".92" ry=".7" fill="${CREME}" opacity=".45" transform="rotate(-6 12.6 -17.5)"/>`),
        haare: fellgrund(T, "kopf", [8, -19.8, 15.6, -14.6], 178, 0.4, 0.25, { f: [16, 2.2] }) +
          haar(T, kopf, { n: 165, L: 0.3, strich: 0.026, flow: kflow, eimer: EI, wahl: kwahl, szene: 0, lf: (x, y) => (x > 14 ? 0.6 : 1) }),
        ueber: randhaar(T, kopf, { n: 130, L: 0.28, strich: 0.026, flow: kflow, ab: 0.45, eimer: EI, wahl: kwahl, szene: 0, wo: (x, y) => !(x > 14.6 && y > -17.2) && x > 8.8 }),
      });
      /* Nase: Rhinarium klein, dunkel-rosa, kommaförmige Nasenlöcher, feuchter Glanz; Lippenspalte (Y) */
      s += `<path d="M15.48 -16.95C15.36 -17.23 15 -17.26 14.83 -17.03C14.72 -16.79 14.85 -16.46 15.13 -16.37C15.36 -16.31 15.54 -16.61 15.48 -16.95Z" fill="${T.rg("ehnase", [[0, "#7a5248"], [1, "#3e2420"]], 0.35, 0.3, 0.7)}"/>`;
      s += `<path d="M15.44 -16.9Q15.2 -16.79 15.1 -16.57" fill="none" stroke="#1a0c08" stroke-width=".065" stroke-linecap="round"/>`;
      s += `<ellipse cx="15.08" cy="-17.03" rx=".12" ry=".055" fill="#fff" opacity=".55"/>`;
      s += `<path d="M15.2 -16.38Q15.15 -16.05 15 -15.88M15 -15.88Q14.7 -15.68 14.3 -15.68" fill="none" stroke="#3a1a10" stroke-width=".045" stroke-linecap="round" opacity=".75"/>`;
      /* Nagezähne: orange, Spitzen hell, unter der Oberlippe sichtbar, auf der Nuss */
      s += nagezahn(T, 14.98, -15.72, 0.42, 98, 0.18, "#d27e2a") + nagezahn(T, 14.84, -15.72, 0.36, 100, 0.16, "#b06422");
      /* Auge */
      s += auge(T, 12.6, -17.5, 0.56, { ratio: 1.22, winkel: -8, iris: "#2a160a", iris2: "#0e0703", mitte: "#3a2212", pr: 0.62, lid: "#120804", lidw: 0.15, hoehle: 0.25, fasern: true, ring: [CREME, 0.2, 0.3], unten: [5, 0.25], nick: "#8a5a50" });
      /* ---------- nahes Ohr: blattförmig, innen heller mit Haarbüscheln; Winterpinsel dunkel, spitz ---------- */
      const ol = feld(ohr, 0.6);
      s += teil(T, ohr, T.lg("ehohr", [[0, "#7e3e1e"], [1, "#a05a30"]], 0, 0, 1, 0), {
        licht: [0.3, 0.45],
        innen: mal(T, 0.12, form(T, [[10.2, -19.2], [10.05, -20.2], [10.25, -21.2], [10.55, -21.4], [10.85, -20.6], [11.1, -19.5]], "#c8907a", ` opacity=".42"`)),
        haare: fellgrund(T, "ohr", [9.5, -22.2, 11.9, -18.7], -95, 0.35, 0.2, { f: [16, 2.2] }) +
          haar(T, ohr, { n: 60, L: 0.26, strich: 0.024, flow: () => -95, eimer: EI, wahl: (x, y, z) => klemm(1 + Math.round((ol(x, y) + 0.3) * 2 + z - 0.5), 1, 4), szene: 0 }),
        ueber: pinsel(T, [[9.72, -21], [10.05, -21.75], [10.5, -22.05], [10.85, -21.7], [11.1, -21.1]], [10.1, -24.6], 95, { eimer: TUFT, wahl: (u, z) => (z < 0.45 ? 0 : z < 0.85 ? 1 : 2), st: 0.45, w: 0.055, kr: 0.001, szene: 0, q: 0.04 }) +
          randhaar(T, ohr, { n: 60, L: 0.3, strich: 0.026, flow: () => -95, ab: 0.5, eimer: EI, wahl: (x, y, z) => (z < 0.5 ? 2 : 3), szene: 0, wo: (x, y) => y > -21.2 }),
      });
      /* ---------- Tasthaare: Schnauze (lang, schwarz), über dem Auge, Wange ---------- */
      s += tasthaar(T, [14.85, -16.35, 1.1, 0.75, 3, 4], -22, 34, 4.2, ["#140a06", "#2a1a10"], 0.05, 0.85, "#3a1a10");
      s += tasthaar(T, [13.1, -18.7, 0.3, 0.1, 1, 3], -120, -80, 1.9, ["#140a06"], 0.035, 0.8);
      s += tasthaar(T, [11.5, -16.1, 0.2, 0.1, 1, 2], 160, 200, 1.5, ["#140a06"], 0.03, 0.6);
      return { svg: s, box: [-12.4, -24.6, 15.5, 0], fuesse: [4.5, 5.4], kopf: [8, -24.8, 17, -12.8] };
    } },
  /* =================================================================
     IGEL — Braunbrustigel (Erinaceus europaeus), gehend, Schnauze schnuppernd vorgestreckt
     RECHERCHE (Fachwissen; Macdonald „Säugetiere Europas“, Pro Igel e. V.): Kopf-Rumpf 22–28 cm (hier 25),
     Schwanz 2–3 cm (unter den Stacheln verborgen), 800–1500 g; beim Gehen Rückenhöhe 11–13 cm, Bauch 2–3 cm über
     dem Boden. 6000–8000 Stacheln, je 2–2,5 cm lang, 1 mm dick, gebändert: Grund hell (cremeweiß), breites
     dunkelbraunes Band, helle gelblich-weiße Spitze; der Stachelmantel beginnt auf der Stirn knapp hinter den Augen
     (mittiger Scheitel) und endet als Saum über den Flanken. Gesicht, Kehle, Brust, Bauch und Beine mit grobem,
     graubraunem Haar; Braunbrustigel: Brust und Kehle braun (kein weißer Kehlfleck), dunkle Augenbinde.
     Schnauze spitz, beweglich, Nasenspiegel schwarz und feucht, ragt über den Unterkiefer; Auge rund, schwarz,
     knopfartig (Ø ≈ 6 mm); Ohr klein, rund (≈ 2 cm), liegt hinter dem Auge am Mantelrand. Sohlengänger: Hand und
     Fuß fünfzehig, nackte dunkle Sohlen, lange gebogene Krallen (am Hinterfuß länger).
     ================================================================= */
  { id: "igel", de: "der Igel", syl: "I-gel", it: "il riccio", itSyl: "RIC-cio", en: "hedgehog",
    gruppe: "Wald und Wiese", lebensraum: "Wiese",
    laenge: 0.255, hoehe: 0.135,
    zeichne(T) {
      T.dez = 1; T.hq = 0.03; T.fellF = [9, 1.1]; T.fellD = "#120a04"; T.fellH = "#e8d4b0";
      const TIEF = "#1a120a";
      const EI = [["#1c140c", 0.55, 1], ["#3e3022", 0.55, 1], ["#64503a", 0.55, 1], ["#8c7458", 0.55, 1], ["#b49a78", 0.5, 0.9], ["#d4c0a0", 0.5, 0.9]];
      let s = "";
      /* ---------- Formen ---------- */
      const mantel = [[20.9, -7.3], [20.2, -8.6], [18.6, -10.3], [16.2, -11.7], [13.2, -12.4], [10, -12.4], [7, -11.7], [4.3, -10.3], [2.1, -8.3], [0.7, -5.9], [0.3, -3.6], [0.9, -2.2],
        [2.6, -2.5], [5.6, -3.1], [9.2, -3.4], [12.8, -3.6], [15.8, -4.2], [17.8, -5.3], [18.9, -6.2], [19.9, -6.7]];
      const leib = [[1.4, -3.4], [1.6, -2], [3.2, -1.5], [6.4, -1.3], [10, -1.25], [13.6, -1.35], [16.6, -1.8], [18.6, -2.6], [19.6, -3.6], [19.2, -5.4], [17, -5.6], [10, -4.6], [4, -4]];
      const kopf = [[18.6, -7.4], [20.2, -7.6], [21.4, -7], [22.5, -6.15], [23.5, -5.35], [24.15, -4.95], [24.45, -4.6], [24.25, -4.2], [23.5, -3.95], [22.4, -3.6],
        [21.1, -3.2], [19.8, -3], [18.5, -3.3], [17.6, -4.3], [17.5, -6]];
      const ohr = [[19.25, -6.35], [19.05, -7.2], [19.4, -7.85], [19.95, -7.95], [20.35, -7.45], [20.25, -6.6]];
      /* Beine (Sohlengänger, kurz, meist unter dem Fellsaum): nah vorn vorgesetzt, fern zurück; Sohle flach am Boden */
      const vbein = (x, dx) => [[x - 0.6, -2.6], [x + 0.7, -2.7], [x + 0.85, -1.4], [x + 1.5 + dx, -0.65], [x + 1.95 + dx, -0.15], [x + 1.6 + dx, 0, 1], [x - 0.3 + dx * 0.6, 0, 1], [x - 0.45 + dx * 0.4, -0.8]];
      const hbein = (x, dx) => [[x - 1, -2.5], [x + 0.8, -2.6], [x + 0.9, -1.4], [x + 2.4 + dx, -0.6], [x + 2.85 + dx, -0.12], [x + 2.5 + dx, 0, 1], [x - 0.9 + dx * 0.5, 0, 1], [x - 1.1 + dx * 0.3, -0.8]];
      const zehen = (x, y, n, l, a) => { let z = ""; for (let i = 0; i < n; i++) z += kralle(T, x - i * 0.2, y + i * 0.03, l * (1 - i * 0.12), a + i * 4, "#2a2018", 0.26, 0.28); return z; };
      const beinTeil = (pts, farbe, licht2) => teil(T, pts, farbe, {
        licht: licht2,
        haare: haar(T, pts, { n: 50, L: 0.3, strich: 0.03, flow: (x, y) => (y < -0.8 ? 95 : 10), eimer: EI, wahl: (x, y, z) => klemm(Math.round(1 + z * 2.6), 1, 3), szene: 0 }),
        ueber: randhaar(T, pts, { n: 30, L: 0.28, strich: 0.028, flow: () => 100, ab: 0.4, eimer: EI, wahl: (x, y, z) => klemm(Math.round(1 + z * 2.5), 1, 3), wo: (x, y) => y < -0.6, szene: 0 }),
      });
      /* ---------- ferne Beine (25–30 % dunkler) ---------- */
      s += beinTeil(hbein(6.4, 0.4), "#3e3022", [0.3, 0.45]) + zehen(9.5, -0.12, 3, 0.45, 25);
      s += beinTeil(vbein(15.4, -0.2), "#3e3022", [0.3, 0.45]) + zehen(17.25, -0.1, 3, 0.4, 20);
      /* ---------- Leib (grobes Fell unter dem Mantel: Flanke, Brust, Bauch) – zottiger Saum ---------- */
      const lf = feld(leib, 2);
      const leibId = pfad(T, leib);
      s += teil(T, "#" + leibId, T.lg("igleib", [[0, "#6a5640"], [0.6, "#58462f"], [1, "#3e3022"]]), {
        licht: [0.8, 1, 50, 0.35],
        haare: fellgrund(T, "leib", [1.4, -5.6, 19.6, -1.2], 100, 0.4, 0.25) +
          haar(T, leib, { n: 220, L: 0.6, strich: 0.034, flow: (x, y) => (x > 17 ? 115 : 98), eimer: EI, wahl: (x, y, z) => klemm(Math.round((lf(x, y) + 0.4) * 2.6 + (z - 0.5) * 1.5), 0, 4), szene: 0 }),
        ueber: randhaar(T, leib, { n: 260, L: 0.75, strich: 0.034, flow: () => 95, ab: 0.35, eimer: EI, wahl: (x, y, z) => klemm(Math.round(1 + z * 2.4), 0, 3), wo: (x, y) => y > -2.4, szene: 0.15 }),
      });
      /* ---------- nahe Beine ---------- */
      s += beinTeil(hbein(3.8, -0.3), "#5a4834", [0.35, 0.5]) + zehen(6.55, -0.12, 4, 0.5, 25);
      s += beinTeil(vbein(17.2, 0.3), "#5a4834", [0.35, 0.5]) + zehen(19.45, -0.1, 4, 0.42, 20);
      /* ---------- Kopf: spitze Schnauze, graubraunes grobes Haar, dunkle Augenbinde (Stirn unter dem Mantel) ---------- */
      const kfl = feld(kopf, 1.4);
      const kflow = (x, y) => (x > 21 ? 185 + (y + 5.2) * 8 : 160);
      const kwahl = (x, y, z) => (y > -4 + (x - 20) * 0.12 ? (z < 0.5 ? 3 : 4) : klemm(Math.round((kfl(x, y) + 0.4) * 2.8 + (z - 0.5) * 1.4), 1, 5));
      const kopfId = pfad(T, kopf);
      s += teil(T, "#" + kopfId, T.lg("igkopf", [[0, "#7c6850"], [0.55, "#6c5842"], [1, "#4e3e2c"]]), {
        licht: [0.7, 1, 50, 0.35],
        innen: mal(T, 0.3, form(T, [[20, -6.1], [21.2, -6.85], [23.3, -5.55], [23.9, -5], [22.6, -4.95], [20.8, -5.3]], "#2e2216", ` opacity=".5"`)) +
          mal(T, 0.35, form(T, [[18.8, -4.1], [21.6, -4.3], [23.6, -4.25], [22.4, -3.75], [19.8, -3.3]], "#a08a6c", ` opacity=".5"`)),
        haare: fellgrund(T, "kopf", [17.5, -7.6, 24.5, -3], 175, 0.35, 0.2, { f: [14, 1.8] }) +
          haar(T, kopf, { n: 200, L: 0.38, strich: 0.028, flow: kflow, eimer: EI, wahl: kwahl, szene: 0 }),
        ueber: randhaar(T, kopf, { n: 110, L: 0.38, strich: 0.028, flow: kflow, ab: 0.4, eimer: EI, wahl: kwahl, wo: (x, y) => x < 23.7 && y > -6.6, szene: 0.1 }),
      });
      /* Ohr: klein, rund, fast nackt, am Mantelrand halb verdeckt */
      s += teil(T, ohr, T.lg("igohr", [[0, "#8a7462"], [1, "#5a4636"]]), {
        licht: [0.22, 0.3],
        innen: mal(T, 0.1, form(T, [[19.55, -6.6], [19.45, -7.3], [19.8, -7.65], [20.05, -7.25], [19.95, -6.7]], "#b89a8a", ` opacity=".55"`)),
        ueber: randhaar(T, ohr, { n: 30, L: 0.2, strich: 0.02, flow: () => -90, ab: 0.6, eimer: EI, wahl: () => 3, szene: 0 }),
      });
      /* ---------- Stachelmantel: dunkler Grund mit Volumen, darauf gebänderte Stacheln (vorn über hinten) ---------- */
      const mantelId = pfad(T, mantel);
      const ml = feld(mantel, 4);
      s += teil(T, "#" + mantelId, T.lg("igmantel", [[0, "#5a4a3a"], [0.5, "#3a2e22"], [1, "#22180e"]]), {
        licht: [2, 2.4, 50, 0.32],
        haare: fellgrund(T, "mantel", [0.3, -12.4, 20.9, -2.2], 155, 0.6, 0.45, { f: [5, 0.6] }),
      });
      const liste = [], fo = [20, -4.2];
      const richt = (x, y) => Math.atan2(y - fo[1], x - fo[0]) / RAD - 10 * klemm((-y - 8) / 3);
      const [mx0, my0, mx1, my1] = T.box(mantel);
      const N = T.fein ? 1500 : 280;
      let versuche = 0;
      while (liste.length < N && versuche < N * 30) {
        versuche++;
        const x = mx0 + T.rnd() * (mx1 - mx0), y = my0 + T.rnd() * (my1 - my0);
        if (!T.inPoly(x, y, mantel)) continue;
        const a = richt(x, y) + (T.rnd() - 0.5) * 30, l = 2.1 * (0.82 + T.rnd() * 0.3) * (x > 18.5 ? 0.6 : 1);
        const ex = x + Math.cos(a * RAD) * l * 0.75, ey = y + Math.sin(a * RAD) * l * 0.75;
        if (!T.inPoly(ex, ey, mantel) && T.rnd() < 0.85) continue;
        liste.push([x, y, a, l]);
      }
      /* Randstacheln: über die Kontur hinaus (borstiger Umriss) */
      const k = kurve(mantel.slice(0, 13), 10, false);
      for (let i = 0; i < (T.fein ? 280 : 70); i++) {
        const p = k[Math.floor(T.rnd() * k.length)];
        const a = richt(p[0], p[1]) + (T.rnd() - 0.5) * 28, l = 2.1 * (0.8 + T.rnd() * 0.3) * (p[0] > 18.5 ? 0.6 : 1);
        liste.push([p[0] - Math.cos(a * RAD) * l * 0.55, p[1] - Math.sin(a * RAD) * l * 0.55, a, l]);
      }
      s += stacheln(T, liste, {
        L: 2.1, w: T.fein ? 0.075 : 0.13, gruppen: 5, band: [0.32, 0.78], spitze: 0.8,
        licht: (x, y) => (ml(x, y) + 0.3) / 1.1 + (T.rnd() - 0.5) * 0.3,
        farben: { grund: ["#d6cab2", "#8a7c66"], band: ["#4a3826", "#241a10"], spitze: ["#f4ead4", "#ab9a7c"] },
      });
      /* Schatten des Mantelsaums auf Flanke und Wange */
      s += `<g clip-path="url(#${leibId}k)">` + mal(T, 0.4, `<path d="${glatt(T, [[1.4, -2.6], [6, -3.4], [13, -3.8], [17.6, -5.3], [18, -4.2], [13, -2.9], [6, -2.4], [2, -1.9]])}" fill="${TIEF}" opacity=".45"/>`) + `</g>`;
      s += `<g clip-path="url(#${kopfId}k)">` + mal(T, 0.3, `<path d="${glatt(T, [[18, -6.6], [19.9, -6.8], [20.9, -7.4], [20.3, -7.9], [18, -7.8]])}" fill="${TIEF}" opacity=".55"/>`) + `</g>`;
      /* Nase: schwarzer, feuchter Nasenspiegel, ragt vor; Nasenloch-Schlitz; Glanz; Maulspalte */
      s += `<path d="M24.8 -4.6C24.75 -4.95 24.4 -5.13 24.1 -5C23.87 -4.87 23.85 -4.45 24.05 -4.27C24.3 -4.07 24.83 -4.23 24.8 -4.6Z" fill="${T.rg("ignase", [[0, "#3a302c"], [0.6, "#141010"], [1, "#050404"]], 0.35, 0.3, 0.7)}"/>`;
      s += `<path d="M24.75 -4.45Q24.57 -4.4 24.45 -4.27" fill="none" stroke="#000" stroke-width=".07" stroke-linecap="round"/><ellipse cx="24.3" cy="-4.83" rx=".16" ry=".07" fill="#fff" opacity=".6" transform="rotate(-15 24.3 -4.83)"/>`;
      s += `<path d="M24.1 -4.15Q23.4 -3.92 22.5 -3.9" fill="none" stroke="#1a120c" stroke-width=".05" stroke-linecap="round" opacity=".7"/>`;
      /* Auge: rund, schwarz, glänzend, leicht vorstehend */
      s += auge(T, 21.25, -6.0, 0.32, { ratio: 1.08, winkel: -10, iris: "#1a120c", iris2: "#050302", mitte: "#2a1e16", pr: 0.7, lid: "#0e0806", lidw: 0.18, hoehle: 0.2, fasern: false });
      /* Tasthaare */
      s += tasthaar(T, [23.85, -4.55, 0.9, 0.5, 3, 3], -12, 30, 2.6, ["#1a120c", "#3a3026"], 0.035, 0.75, "#2a1e16");
      return { svg: s, box: [-0.8, -13.4, 25, 0], fuesse: [5.5, 17.8], kopf: [17, -9.5, 25.5, -2.4] };
    } },
];
