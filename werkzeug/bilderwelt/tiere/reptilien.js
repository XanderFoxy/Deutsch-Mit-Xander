/* =====================================================================
   TIER-BIBLIOTHEK — REPTILIEN (FASSUNG 854)
   Krokodil, Alligator, Kobra, Python, Eidechse, Chamäleon, Leguan, Schildkröte, Komodowaran.
   XANDER (03.10.): „fast fotorealistisch … mehr Struktur, mehr Details, mehr Wiedererkennungswert … Ich will Augen sehen …
   jede Pore … Zähne, Augen, Glieder, Muskeln, Sehnen, Pupillen, Krallen … alles mit Licht und Schatten realistisch plastisch
   massiv“. Krokodil ausdrücklich genannt: Osteoderme auf dem Rücken, Schuppenreihen, Zahnreihe, gelbe Augen mit
   senkrechter Schlitzpupille, Nickhaut.
   Jede Art wird in einem eigenen Zeichenraum entworfen (Einheiten) und mit scale(f) in Zentimeter gebracht.
   Boden y = 0, Blick nach rechts, Licht von links oben.
   ===================================================================== */
"use strict";
const R = (n) => Math.round(n * 10) / 10;
const R2 = (n) => Math.round(n * 100) / 100;

/* ---------- allgemeine Hilfen ---------- */
const mehr = (T, arr) => arr.map((p) => T.glatt(p, false)).join("");
const linien = (T, arr, farbe, w, op) => arr.length ? `<path d="${mehr(T, arr)}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round" stroke-linejoin="round"/>` : "";
const LICHT = (T) => T.rg("licht", [[0, "#fff", 0.55], [1, "#fff", 0]]);
const DUNKEL = (T) => T.rg("dunkel", [[0, "#000", 0.6], [1, "#000", 0]]);
const fleck = (T, art, cx, cy, rx, ry, rot, op) =>
  `<ellipse${rot ? ` transform="rotate(${rot} ${R(cx)} ${R(cy)})"` : ""} cx="${R(cx)}" cy="${R(cy)}" rx="${R(rx)}" ry="${R(ry)}" fill="${art === "l" ? LICHT(T) : art === "d" ? DUNKEL(T) : art}" opacity="${String(op).replace(/^0\./, ".")}"/>`;
/* Farbe mischen: t > 0 Richtung Weiß, t < 0 Richtung Schwarz */
const mische = (c, t) => {
  const n = parseInt(c.slice(1), 16), z = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(t > 0 ? v + (255 - v) * t : v * (1 + t)));
  return "#" + z.map((v) => v.toString(16).padStart(2, "0")).join("");
};
/* Pfad aus Punkten: fein glatt (Catmull-Rom), in der Szene als Vieleck (kaum sichtbar, viel kleiner) */
const poly = (pts) => "M" + pts.map((p) => R(p[0]) + " " + R(p[1])).join("L") + "Z";
const pfad = (T, pts) => (typeof pts === "string" ? pts : T.fein ? T.glatt(pts) : poly(pts));
const form = (T, pts, fill, extra = "") => `<path d="${pfad(T, pts)}" fill="${fill}"${extra}/>`;
/* weicher Schleier (Farbzonen, Licht) – Gaußfilter, Stärke in Einheiten */
const weich = (T, n, s) => {
  const id = T.id("bl" + n);
  if (!T["_bl" + n]) { T["_bl" + n] = 1; T.def(`<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${s}"/></filter>`); }
  return `url(#${id})`;
};
/* Körperteil: Pfad EINMAL in defs, Füllung + geklippte Innenzeichnung + Rand per <use> */
const teil = (T, pts, fill, o = {}) => {
  const d = pfad(T, pts);
  const id = T.id("q" + (T._n = (T._n || 0) + 1));
  const innen = (o.innen || "") + (o.vol ? `<use href="#${id}" fill="${T.VOL()}"/>` : "");
  T.def(`<path id="${id}" d="${d}"/>` + (innen ? `<clipPath id="${id}c"><use href="#${id}"/></clipPath>` : ""));
  return `<use href="#${id}" fill="${fill}"/>` + (innen ? `<g clip-path="url(#${id}c)">${innen}</g>` : "") +
    (o.kante ? linien(T, o.kante, o.rand || "#000", o.rw || 0.3, o.randA != null ? o.randA : 0.4) : o.rand !== false ? `<use href="#${id}" fill="none" stroke="${o.rand || "#000"}" stroke-opacity="${o.randA != null ? o.randA : 0.4}" stroke-width="${o.rw || 0.3}" stroke-linejoin="round"/>` : "");
};
/* Polylinie mit Bogenlänge: at(t) → [x, y, nx, ny] (Normale zeigt bei Laufrichtung nach rechts nach OBEN) */
const polyl = (pts) => {
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const len = L[L.length - 1];
  return { len, L, at: (t) => {
    const d = Math.max(0, Math.min(1, t)) * len; let i = 1;
    while (i < L.length - 1 && L[i] < d) i++;
    const a = pts[i - 1], b = pts[i], u = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1), dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
    const w = [];
    for (let k = 2; k < a.length; k++) w.push(a[k] + (b[k] - a[k]) * u);
    return [a[0] + dx * u, a[1] + dy * u, dy / n, -dx / n, ...w];
  } };
};
/* Catmull-Rom dicht abtasten (alle Spalten werden mit interpoliert) */
const dicht = (pts, je = 6) => {
  const n = pts.length, out = [];
  const P = (i) => pts[Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < n - 1; i++) for (let s = 0; s < je; s++) {
    const u = s / je, p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2), q = [];
    for (let k = 0; k < p1.length; k++) {
      const a = p0[k], b = p1[k], c = p2[k], d = p3[k];
      q.push(0.5 * ((2 * b) + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u));
    }
    out.push(q);
  }
  out.push(pts[n - 1].slice());
  return out;
};
/* Rohr (Rumpf, Schwanz, Schlange): Wirbelsäule sp = [[x, y, hOben, hUnten], …] von hinten nach vorn.
   P(t, v): t 0…1 längs, v −1 = Rückenkante, 0 = Mittellinie, +1 = Bauchkante. */
const rohr = (sp, je = 6) => {
  const pl = polyl(dicht(sp, je));
  const P = (t, v) => { const [x, y, nx, ny, ho, hu] = pl.at(t); const d = v < 0 ? -v * ho : -v * hu; return [x + nx * d, y + ny * d]; };
  const zug = (v, t0 = 0, t1 = 1, n = 24) => { const a = []; for (let i = 0; i <= n; i++) a.push(P(t0 + (t1 - t0) * i / n, v)); return a; };
  const band = (v0, v1, t0 = 0, t1 = 1, n = 24) => zug(v0, t0, t1, n).concat(zug(v1, t0, t1, n).reverse());
  return { P, zug, band, len: pl.len, at: pl.at };
};
/* Schuppengitter im Rohr: Spalten bei ts (Liste), Zeilen bei vs (Liste). Rillen dunkel, Lichtkante unten rechts daneben.
   o.versatz: Ziegelverband (jede 2. Zeile halb versetzt); o.jit: Wackeln der Spalten; o.schritt: Stützpunktabstand der Zeilen */
const gitter = (T, Rr, ts, vs, o = {}) => {
  let dG = "", dL = "";
  const g = o.g || 0.35, jit = o.jit || 0;
  const t0 = ts[0], t1 = ts[ts.length - 1], nP = Math.max(2, Math.round(Rr.len * (t1 - t0) / (o.schritt || 30)));
  const rel = (A, B) => `l${R(B[0] - A[0])} ${R(B[1] - A[1])}`;
  for (const v of vs) {
    const p = Rr.zug(v, t0, t1, nP);
    dG += T.glatt(p, false);
    if (o.licht !== false) dL += T.glatt(p.map(([x, y]) => [x + g * 0.3, y + g]), false);
  }
  const ganz = !o.versatz && !jit;
  for (let j = 0; j < (ganz ? 1 : vs.length - 1); j++) {
    const v0 = vs[j], v1 = ganz ? vs[vs.length - 1] : vs[j + 1], halb = o.versatz && j % 2;
    const sp = halb ? ts.slice(0, -1).map((t, i) => (t + ts[i + 1]) / 2) : ts;
    for (const t0 of sp) {
      const t = t0 + (jit ? (T.rnd() - 0.5) * jit : 0), a = Rr.P(t, v0), b = Rr.P(t, v1);
      dG += `M${R(a[0])} ${R(a[1])}${rel(a, b)}`;
      if (o.licht !== false && o.lichtQuer !== false) dL += `M${R(a[0] + g)} ${R(a[1] + g * 0.6)}${rel(a, b)}`;
    }
  }
  const w = o.w || 0.3;
  return (dL ? `<path d="${dL}" fill="none" stroke="${o.hell || "#efe4bf"}" stroke-width="${R2(w * 0.8)}" stroke-opacity="${o.opL || 0.28}" stroke-linecap="round"/>` : "") +
    `<path d="${dG}" fill="none" stroke="${o.dunkel || "#14120a"}" stroke-width="${w}" stroke-opacity="${o.opS || 0.6}" stroke-linecap="round" stroke-linejoin="round"/>`;
};
/* Kacheln im Rohr (Osteoderme, Schwanzringe): je Schuppe Lichtkante oben/vorn-links, Schattenkante unten, optional
   kurzer Kiel (Grat: Licht oben, Schatten darunter) und Eigenton. ts: Spaltengrenzen, vs: Zeilengrenzen (t, v im Rohr).
   Kurze relative Pfade – viele Schuppen bleiben klein. */
const kacheln = (T, Rr, ts, vs, o = {}) => {
  if (!T.fein && !o.immer) return "";
  const farben = o.farben || [["#fff", 0.07], ["#000", 0.12], null, null];
  const eimer = farben.map(() => "");
  let dL = "", dS = "", dK = "", dKL = "";
  const rel = (A, B) => `l${R(B[0] - A[0])} ${R(B[1] - A[1])}`;
  for (let j = 0; j < vs.length - 1; j++) {
    const v0 = vs[j], v1 = vs[j + 1], dv = v1 - v0, halb = o.versatz && j % 2;
    const sp = halb ? ts.slice(0, -1).map((t, i) => (t + ts[i + 1]) / 2) : ts;
    for (let i = 0; i < sp.length - 1; i++) {
      let a0 = sp[i], a1 = sp[i + 1];
      const dt0 = a1 - a0;
      if (o.jit) { a0 += (T.rnd() - 0.5) * o.jit * dt0; a1 += (T.rnd() - 0.5) * o.jit * dt0; }
      const dt = a1 - a0, ta = a0 + dt * 0.08, tb = a1 - dt * 0.06, va = v0 + dv * 0.1, vb = v1 - dv * 0.08;
      const A = Rr.P(ta, va), B = Rr.P(tb, va), C = Rr.P(tb, vb), D = Rr.P(ta, vb);
      const f = Math.floor(T.rnd() * farben.length);
      if (farben[f]) eimer[f] += `M${R(A[0])} ${R(A[1])}${rel(A, B)}${rel(B, C)}${rel(C, D)}z`;
      if (o.kanten !== false) {
        dL += `M${R(D[0])} ${R(D[1])}${rel(D, A)}${rel(A, B)}`;
        dS += `M${R(B[0])} ${R(B[1])}${rel(B, C)}${rel(C, D)}`;
      }
      if (o.kiel && o.kiel.includes(j)) {
        const vm = va + (vb - va) * (o.kielV || 0.45), k0 = Rr.P(ta + dt * (0.2 + T.rnd() * 0.1), vm), k1 = Rr.P(tb - dt * 0.12, vm - dv * 0.05);
        dKL += `M${R(k0[0])} ${R(k0[1])}${rel(k0, k1)}`;
        dK += `M${R(k0[0] + 0.15)} ${R(k0[1] + (o.kw || 0.4) * 0.85)}${rel(k0, k1)}`;
      }
    }
  }
  const sw = o.sw || 0.45;
  let s = eimer.map((d, i) => d && farben[i] ? `<path d="${d}" fill="${farben[i][0]}" stroke="${farben[i][0]}" stroke-width="${sw}" stroke-linejoin="round" opacity="${farben[i][1]}"/>` : "").join("");
  if (dS) s += `<path d="${dS}" fill="none" stroke="#0c0b06" stroke-width="${o.lw || 0.3}" stroke-opacity="${o.opS || 0.45}" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (dL) s += `<path d="${dL}" fill="none" stroke="${o.hell || "#f0e8c8"}" stroke-width="${o.lw || 0.3}" stroke-opacity="${o.opL || 0.38}" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (dK) s += `<path d="${dK}" fill="none" stroke="#0c0b06" stroke-width="${o.kw || 0.4}" stroke-opacity="${o.opK || 0.42}" stroke-linecap="round"/><path d="${dKL}" fill="none" stroke="${o.hell || "#f0e8c8"}" stroke-width="${R2((o.kw || 0.4) * 0.75)}" stroke-opacity="${o.opKL || 0.5}" stroke-linecap="round"/>`;
  return s;
};
/* Platten mit eigenem Verlauf (objectBoundingBox): jede Schuppe ein kurzer Pfad in einer Gruppe, die Füllung und Rundung
   erbt – so bekommt jede Platte ihr eigenes Licht (oben hell, Kiel mit Grat, unten Schatten). ts/vs wie kacheln.
   o: { grad: (j) → Verlauf-URL je Zeile, jit, fuge, sw (Rundung) } */
const plattenG = (T, Rr, ts, vs, o = {}) => {
  const gruppen = {};
  let kL = "", kS = "";
  const rel = (A, B) => `l${R(B[0] - A[0])} ${R(B[1] - A[1])}`;
  const O = Rr.P(ts[0], vs[0]), ox = Math.round(O[0]), oy = Math.round(O[1]);   // Ursprung: kurze Zahlen
  for (let j = 0; j < vs.length - 1; j++) {
    const v0 = vs[j], v1 = vs[j + 1], dv = v1 - v0, halb = o.versatz && j % 2;
    const sp = halb ? ts.slice(0, -1).map((t, i) => (t + ts[i + 1]) / 2) : ts;
    for (let i = 0; i < sp.length - 1; i++) {
      let a0 = sp[i], a1 = sp[i + 1];
      const dt0 = a1 - a0;
      if (o.jit) { a0 += (T.rnd() - 0.5) * o.jit * dt0; a1 += (T.rnd() - 0.5) * o.jit * dt0; }
      const dt = a1 - a0, f = o.fuge || 0.09, fv = o.fugeV || f * 1.2, ta = a0 + dt * f, tb = a1 - dt * f * 0.7, va = v0 + dv * fv, vb = v1 - dv * fv * 0.8;
      const A = Rr.P(ta, va), B = Rr.P(tb, va), C = Rr.P(tb, vb), D = Rr.P(ta, vb);
      const g = o.grad(j, T.rnd());
      (gruppen[g] = gruppen[g] || []).push(`<path d="M${R(A[0] - ox)} ${R(A[1] - oy)}${rel(A, B)}${rel(B, C)}${rel(C, D)}z"/>`);
      /* Kiel: kurzer Grat in der oberen Plattenhälfte (Licht oben, Schatten darunter) */
      if (o.kiel && o.kiel.includes(j) && T.fein) {
        const vm = va + (vb - va) * 0.42, k0 = Rr.P(ta + dt * (0.22 + T.rnd() * 0.08), vm), k1 = Rr.P(tb - dt * (0.12 + T.rnd() * 0.08), vm - dv * 0.04);
        kL += `M${R(k0[0] - ox)} ${R(k0[1] - oy)}${rel(k0, k1)}`;
        kS += `M${R(k0[0] - ox + 0.1)} ${R(k0[1] - oy + (o.kw || 0.4) * 0.8)}${rel(k0, k1)}`;
      }
    }
  }
  return `<g transform="translate(${ox} ${oy})">` + Object.entries(gruppen).map(([g, l]) => `<g fill="${g}" stroke="${g}" stroke-width="${o.sw || 0.5}" stroke-linejoin="round">${l.join("")}</g>`).join("") +
    (kS ? `<path d="${kS}" fill="none" stroke="#0c0b06" stroke-width="${R2((o.kw || 0.4) * 1.3)}" stroke-opacity="${o.opK || 0.3}" stroke-linecap="round"/><path d="${kL}" fill="none" stroke="${o.hell || "#ece2bc"}" stroke-width="${R2((o.kw || 0.4) * 0.6)}" stroke-opacity="${o.opKL || 0.34}" stroke-linecap="round"/>` : "") + "</g>";
};
/* Beulen: einzelne gewölbte Schuppen mit eigenem Radialverlauf (Licht oben links) in der Fläche pts.
   o: { flach, dichte, groesse(x, y), grads: [URL, …] (zufällig verteilt), winkel } */
const beulen = (T, pts, g, o = {}) => {
  if (!T.fein && !o.immer) return "";
  const [x0, y0, x1, y1] = T.box(pts), fl = o.flach || 0.75, ox = Math.round(x0), oy = Math.round(y0);
  const gruppen = {};
  let z = 0;
  for (let y = y0 + g * 0.45; y < y1; y += g * (o.dy || 0.8), z++) for (let x = x0 + (z % 2) * g / 2; x < x1; x += g) {
    const jx = x + (T.rnd() - 0.5) * g * (o.jit != null ? o.jit : 0.3), jy = y + (T.rnd() - 0.5) * g * 0.22;
    if (!T.inPoly(jx, jy, pts) || (o.dichte && T.rnd() > o.dichte)) continue;
    const gg = o.groesse ? o.groesse(jx, jy) : 1;
    const rx = g * 0.42 * gg * (0.85 + T.rnd() * 0.3);
    const gr = o.grads[Math.floor(T.rnd() * o.grads.length)];
    /* Kreis im gestauchten Raum (scale(1 fl)) = Ellipse – kürzer als <ellipse> */
    (gruppen[gr] = gruppen[gr] || []).push(`<circle cx="${R(jx - ox)}" cy="${R((jy - oy) / fl)}" r="${R(rx)}"/>`);
  }
  return `<g transform="translate(${ox} ${oy}) scale(1 ${fl})">` + Object.entries(gruppen).map(([gr, l]) => `<g fill="${gr}">${l.join("")}</g>`).join("") + "</g>";
};
/* Schuppenmuster (Kachel mit gewölbten Einzelschuppen auf leicht dunklerem Grund) – für Beine, Kopfhaut, kleine
   Flächen: wenige Bytes für tausende Schuppen. g = Schuppenabstand, o: { rot, flach, grund (Deckkraft der Fugen), hell, dunkel } */
const musterBeulen = (T, n, g, o = {}) => {
  const id = T.id("mb" + n);
  if (!T["_mb" + n]) {
    T["_mb" + n] = 1;
    const nx = 4, ny = 3, W = nx * g, H = ny * g * 0.8;
    const gr = T.rg("mbg" + n, [[0, "#fff", o.hell != null ? o.hell : 0.3], [0.45, "#fff", 0.04], [0.78, "#000", 0.08], [1, "#000", o.dunkel != null ? o.dunkel : 0.38]], 0.36, 0.3, 0.78);
    let e = "";
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const cx = (i + 0.5 + (j % 2) * 0.5) * g + (T.rnd() - 0.5) * g * 0.16, cy = (j + 0.5) * g * 0.8 + (T.rnd() - 0.5) * g * 0.1;
      const rx = g * (0.38 + T.rnd() * 0.08), ry = rx * (o.flach || 0.78);
      for (const dx of cx + rx > W ? [0, -W] : [0]) e += `<ellipse cx="${R(cx + dx)}" cy="${R(cy)}" rx="${R(rx)}" ry="${R(ry)}"/>`;
    }
    T.def(`<pattern id="${id}" width="${R2(W)}" height="${R2(H)}" patternUnits="userSpaceOnUse"${o.rot ? ` patternTransform="rotate(${o.rot})"` : ""}>` +
      `<rect width="${R2(W)}" height="${R2(H)}" fill="#000" fill-opacity="${o.grund != null ? o.grund : 0.16}"/><g fill="${gr}">${e}</g></pattern>`);
  }
  return `url(#${id})`;
};
/* Standard-Verläufe für Schuppen (einmal je Art angelegt) */
const beulenGrad = (T, n, hell = 0.34, dunkel = 0.42) => T.rg("beule" + n, [[0, "#fff", hell], [0.42, "#fff", hell * 0.15], [0.75, "#000", dunkel * 0.25], [1, "#000", dunkel]], 0.36, 0.3, 0.78);
const plattenGrad = (T, n, kiel = true, k = 1, L = "#f3e9c4", D = "#120f06") => T.lg("platte" + n, kiel
  ? [[0, L, 0.24 * k], [0.12, L, 0.05 * k], [0.3, L, 0.16 * k], [0.38, L, 0.3 * k], [0.47, D, 0.24 * k], [0.62, D, 0.04 * k], [0.86, D, 0.12 * k], [1, D, 0.32 * k]]
  : [[0, L, 0.22 * k], [0.25, L, 0.04 * k], [0.7, D, 0.05 * k], [1, D, 0.3 * k]]);
/* einzelne ovale Schuppen (Flanke, Beine, Hals) als kurze runde Striche: Schatten (unten versetzt), Schuppe, Glanz oben.
   Je Schuppe ~40 Zeichen. o: { flach, dichte, groesse(x,y), opS, opL, opF, fill, dunkel, hell, winkel (Grad) } */
const ovale = (T, pts, g, o = {}) => {
  if (!T.fein && !o.immer) return "";
  const [x0, y0, x1, y1] = T.box(pts);
  const eimer = {};
  let z = 0;
  const wk = (o.winkel || 0) * Math.PI / 180;
  for (let y = y0 + g * 0.45; y < y1; y += g * (o.dy || 0.8), z++) for (let x = x0 + (z % 2) * g / 2; x < x1; x += g) {
    const jx = x + (T.rnd() - 0.5) * g * 0.3, jy = y + (T.rnd() - 0.5) * g * 0.22;
    if (!T.inPoly(jx, jy, pts) || (o.dichte && T.rnd() > o.dichte)) continue;
    const gg = o.groesse ? o.groesse(jx, jy) : 1;
    const rx = g * 0.4 * gg * (0.85 + T.rnd() * 0.3), ry = rx * (o.flach || 0.75);
    const kk = Math.max(0.2, Math.round(ry * 2 * 5) / 5);   // Strichbreite = Schuppenhöhe, auf 0,2 gerundet → wenige Pfade
    const L = Math.max(0.05, 2 * rx - kk), dx = R(Math.cos(wk) * L), dy = R(Math.sin(wk) * L);
    const e = (eimer[kk] = eimer[kk] || ["", "", ""]);
    e[0] += `M${R(jx - dx / 2)} ${R(jy - dy / 2 + kk * 0.3)}l${dx} ${dy}`;
    if (o.opF) e[1] += `M${R(jx - dx / 2)} ${R(jy - dy / 2)}l${dx} ${dy}`;
    e[2] += `M${R(jx - dx / 2 - kk * 0.05)} ${R(jy - dy / 2 - kk * 0.14)}l${R(dx * 0.8)} ${R(dy * 0.8)}`;
  }
  let s0 = "", s1 = "", s2 = "";
  for (const kk in eimer) {
    const [a, b, c] = eimer[kk];
    s0 += `<path d="${a}" stroke-width="${R2(kk * (o.schatten || 0.45))}"/>`;
    if (b) s1 += `<path d="${b}" stroke-width="${R2(kk * 0.84)}"/>`;
    s2 += `<path d="${c}" stroke-width="${R2(Math.max(0.08, kk * (o.glanz || 0.48)))}"/>`;
  }
  return `<g fill="none" stroke-linecap="round"><g stroke="${o.dunkel || "#0f0d07"}" stroke-opacity="${o.opS || 0.4}">${s0}</g>` +
    (o.opF ? `<g stroke="${o.fill || "#fff"}" stroke-opacity="${o.opF}">${s1}</g>` : "") + `<g stroke="${o.hell || "#f2e9cc"}" stroke-opacity="${o.opL || 0.3}">${s2}</g></g>`;
};
/* Kieselschuppen in einer Fläche (nur fein): je Schuppe Schattenbogen unten, Lichtbogen oben */
const schuppenFeld = (T, pts, g, o = {}) => {
  if (!T.fein && !o.immer) return "";
  const [x0, y0, x1, y1] = T.box(pts);
  let dS = "", dL = "", z = 0;
  for (let y = y0 + g * 0.4; y < y1; y += g * (o.dy || 0.78), z++) for (let x = x0 + (z % 2) * g / 2; x < x1; x += g * (o.dx || 1)) {
    const jx = x + (T.rnd() - 0.5) * g * (o.jit != null ? o.jit : 0.35), jy = y + (T.rnd() - 0.5) * g * 0.3;
    if (!T.inPoly(jx, jy, pts) || (o.dichte && T.rnd() > o.dichte)) continue;
    const gg = o.groesse ? o.groesse(jx, jy) : 1;
    const r = g * 0.43 * gg * (0.8 + T.rnd() * 0.4), h = r * (o.flach || 0.9);
    dS += `M${R(jx - r)} ${R(jy)}q${R(r)} ${R(h * 1.25)} ${R(2 * r)} 0`;
    dL += `M${R(jx - r * 0.85)} ${R(jy - h * 0.15)}q${R(r * 0.8)} ${R(-h * 1.1)} ${R(r * 1.6)} 0`;
  }
  const w = R2(g * (o.w || 0.12)) || 0.05;
  return `<path d="${dS}" fill="none" stroke="${o.dunkel || "#140f08"}" stroke-width="${w}" stroke-opacity="${o.opS || 0.45}"/>` +
    `<path d="${dL}" fill="none" stroke="${o.hell || "#f2e6c8"}" stroke-width="${w}" stroke-opacity="${o.opL || 0.22}"/>`;
};
/* Schildernetz (nur fein): unregelmäßige Platten (Kopfhaut, sculptierter Schädel) */
const platten = (T, pts, g, o = {}) => {
  if (!T.fein) return "";
  const [x0, y0, x1, y1] = T.box(pts), nx = Math.ceil((x1 - x0) / g) + 2, ny = Math.ceil((y1 - y0) / (g * 0.8)) + 2, V = [];
  for (let j = 0; j < ny; j++) { V.push([]); for (let i = 0; i < nx; i++) V[j].push([x0 - g + i * g + (j % 2) * g * 0.5 + (T.rnd() - 0.5) * g * 0.55, y0 - g * 0.8 + j * g * 0.8 + (T.rnd() - 0.5) * g * 0.45]); }
  const drin = (p) => T.inPoly(p[0], p[1], pts);
  let d = "", dl = "";
  const kante = (a, b) => { if (drin(a) && drin(b)) { d += `M${R(a[0])} ${R(a[1])}L${R(b[0])} ${R(b[1])}`; dl += `M${R(a[0] + 0.12 * g)} ${R(a[1] + 0.14 * g)}L${R(b[0] + 0.12 * g)} ${R(b[1] + 0.14 * g)}`; } };
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    if (i + 1 < nx) kante(V[j][i], V[j][i + 1]);
    if (j + 1 < ny) kante(V[j][i], V[j + 1][i]);
    if (j + 1 < ny && T.rnd() < 0.5) { const k = i + (j % 2 ? 1 : -1); if (k >= 0 && k < nx) kante(V[j][i], V[j + 1][k]); }
  }
  const w = R2(g * (o.w || 0.09)) || 0.05;
  return `<path d="${dl}" stroke="${o.hell || "#f3e7c8"}" stroke-width="${w}" stroke-opacity="${o.opL || 0.22}"/><path d="${d}" stroke="${o.dunkel || "#120d07"}" stroke-width="${w}" stroke-opacity="${o.opS || 0.5}" stroke-linejoin="round"/>`;
};
/* Punkte (Sinnesorgane, Poren, Sprenkel): n Punkte in Fläche pts, als runde Strichpunkte (klein!) */
const punkte = (T, pts, n, r0, farbe, op) => {
  const [x0, y0, x1, y1] = T.box(pts);
  let d = "", k = 0, v = 0;
  while (k < n && v < n * 20) {
    v++;
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!T.inPoly(x, y, pts)) continue;
    d += `M${R(x)} ${R(y)}h${R(r0 * T.rnd() * 0.8)}`;
    k++;
  }
  return `<path d="${d}" stroke="${farbe}" stroke-opacity="${op}" stroke-width="${R2(r0 * 2)}" stroke-linecap="round" fill="none"/>`;
};
/* Reihe entlang einer Linie: n Trennstriche quer */
const reihe = (T, pts, n, tiefe, farbe, w, op, versatz = 0) => {
  const P = polyl(pts); let d = "";
  for (let i = 0; i <= n; i++) { const [x, y, nx, ny] = P.at(i / n); d += `M${R(x + nx * versatz)} ${R(y + ny * versatz)}l${R(nx * tiefe)} ${R(ny * tiefe)}`; }
  return `<path d="${d}" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round"/>`;
};
/* Kralle: Basis (x, y), Länge L, Breite b, Richtung w (Grad), Krümmung */
const krallenPfad = (x, y, L, b, w, krumm = 0.5) => {
  const a = w * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
  const P = (u, v) => `${R2(x + u * c - v * sn)} ${R2(y + u * sn + v * c)}`;
  return `M${P(0, -b / 2)}Q${P(L * 0.62, -b * 0.55)} ${P(L, b * krumm * 2)}Q${P(L * 0.5, b * 0.1)} ${P(0, b / 2)}Z`;
};
const krallen = (T, liste, farbe = "#2a2117") => {
  const g = T.lg("kralle" + farbe.slice(1), [[0, mische(farbe, 0.3)], [0.5, farbe], [1, mische(farbe, -0.35)]]);
  const d = liste.map((k) => krallenPfad(...k)).join("");
  let gl = "";
  if (T.fein) for (const [x, y, L, b, w] of liste) { const a = w * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a), P = (u, v) => `${R2(x + u * c - v * sn)} ${R2(y + u * sn + v * c)}`; gl += `M${P(L * 0.12, -b * 0.22)}Q${P(L * 0.5, -b * 0.32)} ${P(L * 0.78, b * 0.15)}`; }
  return `<path d="${d}" fill="${g}"/>` + (gl ? `<path d="${gl}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="${R2(liste[0][3] * 0.14) || 0.05}" stroke-linecap="round"/>` : "");
};
/* kegelförmige Zähne: [x, y, L, b, neigung] Basis (x, y), Spitze nach unten (dir 1) oder oben (dir −1) */
const zaehne = (T, liste, dir = 1, o = {}) => {
  let d = "", gl = "", sch = "";
  const q = (P0, C, P1) => `q${R2(C[0] - P0[0])} ${R2(C[1] - P0[1])} ${R2(P1[0] - P0[0])} ${R2(P1[1] - P0[1])}`;
  for (const [x, y, L, b, k = 0] of liste) {
    const tx = x + k * L, ty = y + dir * L, A = [x - b / 2, y], S = [tx, ty], E = [x + b / 2, y];
    d += `M${R2(A[0])} ${R2(A[1])}${q(A, [x - b * 0.45 + k * L * 0.4, y + dir * L * 0.62], S)}${q(S, [x + b * 0.5 + k * L * 0.5, y + dir * L * 0.45], E)}z`;
    if (T.fein) {
      const g0 = [x - b * 0.18, y + dir * L * 0.15];
      gl += `M${R2(g0[0])} ${R2(g0[1])}${q(g0, [x - b * 0.2 + k * L * 0.4, y + dir * L * 0.55], [tx - b * 0.08, ty - dir * L * 0.12])}`;
    }
  }
  const g = T.lg("zahn" + dir + (o.n || ""), [[0, dir > 0 ? (o.basis || "#b7a072") : (o.spitze || "#f1e9d2")], [0.45, o.mitte || "#e2d6b4"], [1, dir > 0 ? (o.spitze || "#f1e9d2") : (o.basis || "#b7a072")]]);
  return `<path d="${d}" fill="${g}" stroke="#3a3020" stroke-width="${o.rw || 0.06}" stroke-opacity=".75"/>` +
    (sch ? `<path d="${sch}" fill="none" stroke="#6a5a3a" stroke-opacity=".45" stroke-width="${o.gw || 0.12}" stroke-linecap="round"/>` : "") +
    (gl ? `<path d="${gl}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="${o.gw || 0.1}" stroke-linecap="round"/>` : "");
};
/* Reptilienbein aus Gliedern (Oberarm/-schenkel, Unterarm/-schenkel, Fuß) mit eigenem Licht je Glied (oben links hell,
   unten rechts dunkel), Schuppenmuster, Gelenkfalten, Zehen als runde Glieder mit Glanzkante und Querschildern, Krallen.
   o: { glieder: [pts, …], kanten: [[pts…]], zehen: [[x0, y0, x1, y1, dicke], …], krallen: [[x, y, L, b, w, krumm], …],
        farben: [hell, mittel, dunkel], muster: URL | "", falten: [[pts…]], maske: [yOben, yVoll] (oberes Glied blendet in
        den Rumpf), schwimm: pts, n: Name } */
const reptilBein = (T, o) => {
  const [hell, mittel, dunkel] = o.farben;
  const gr = T.lg("bein" + (o.ton || ""), [[0, hell], [0.5, mittel], [1, dunkel]], 0.15, 0, 0.85, 1);
  let s = "";
  if (o.schwimm) s += form(T, o.schwimm, dunkel, ' opacity=".75"');
  if (!T.fein) {   // Szene: nur Formen mit Licht, Zehen, Krallen
    s += `<path d="${o.glieder.map(poly).join("")}" fill="${gr}"/>`;
    if (o.zehen) s += `<path d="${o.zehen.map(([x0, y0, x1, y1]) => `M${R(x0)} ${R(y0)}L${R(x1)} ${R(y1)}`).join("")}" stroke="${mittel}" stroke-width="${o.zehen[0][4]}" stroke-linecap="round"/>`;
    return s + (o.krallen ? krallen(T, o.krallen, o.krallenFarbe || "#2a2418") : "");
  }
  const glieder = o.glieder.map((p, i) => teil(T, p, gr, { rand: false, innen: (o.muster ? `<rect x="${R(T.box(p)[0] - 1)}" y="${R(T.box(p)[1] - 1)}" width="${R(T.box(p)[2] - T.box(p)[0] + 2)}" height="${R(T.box(p)[3] - T.box(p)[1] + 2)}" fill="${o.muster}"/>` : "") + ((o.innen && o.innen[i]) || "") }));
  if (o.maske) {
    const id = T.id("bm" + o.n);
    const b = T.box(o.glieder[0]);
    T.def(`<linearGradient id="${id}g" gradientUnits="userSpaceOnUse" x1="0" y1="${o.maske[0]}" x2="0" y2="${o.maske[1]}"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>` +
      `<mask id="${id}" maskUnits="userSpaceOnUse" x="${R(b[0] - 2)}" y="${R(b[1] - 2)}" width="${R(b[2] - b[0] + 4)}" height="${R(b[3] - b[1] + 4)}"><rect x="${R(b[0] - 2)}" y="${R(b[1] - 2)}" width="${R(b[2] - b[0] + 4)}" height="${R(b[3] - b[1] + 4)}" fill="url(#${id}g)"/></mask>`);
    s += `<g mask="url(#${id})">${glieder[0]}</g>` + glieder.slice(1).join("");
  } else s += glieder.join("");
  if (o.kanten) s += linien(T, o.kanten, "#0d0c07", o.kw || 0.26, o.ka || 0.28);
  if (o.falten) s += linien(T, o.falten, "#0d0c07", o.fw || 0.22, 0.38) + (T.fein ? linien(T, o.falten.map((p) => p.map(([x, y]) => [x - 0.15, y - 0.2])), hell, (o.fw || 0.22) * 0.7, 0.3) : "");
  /* Zehen: Grundton, Unterseite dunkel, Glanzkante oben, Querschilder */
  if (o.zehen) {
    let d = "", dS = "", dL = "", dQ = "";
    for (const [x0, y0, x1, y1, b] of o.zehen) {
      d += `M${R(x0)} ${R(y0)}L${R(x1)} ${R(y1)}`;
      dS += `M${R(x0)} ${R(y0 + b * 0.25)}L${R(x1)} ${R(y1 + b * 0.2)}`;
      dL += `M${R(x0 + 0.3)} ${R(y0 - b * 0.28)}L${R(x1 - b * 0.4)} ${R(y1 - b * 0.24)}`;
      if (T.fein && o.ticks !== false) { const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / (b * 0.75))); for (let i = 1; i < n; i++) { const u = i / n, x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u; dQ += `M${R(x)} ${R(y - b * 0.45)}l${R(-b * 0.12)} ${R(b * 0.5)}`; } }
    }
    const b0 = o.zehen[0][4];
    s += `<g fill="none" stroke-linecap="round"><path d="${d}" stroke="${mittel}" stroke-width="${b0}"/><path d="${dS}" stroke="${dunkel}" stroke-width="${R2(b0 * 0.5)}" stroke-opacity=".8"/>` +
      `<path d="${dL}" stroke="${hell}" stroke-width="${R2(b0 * 0.28)}" stroke-opacity=".7"/>` + (dQ ? `<path d="${dQ}" stroke="#0d0c07" stroke-width="${R2(b0 * 0.1)}" stroke-opacity=".45"/>` : "") + "</g>";
  }
  if (o.krallen) s += krallen(T, o.krallen, o.krallenFarbe || "#2a2418");
  return s;
};
/* Reptilienauge auf Basis von T.augeReal: Schlitz- oder Rundpupille, Iris mit Netzzeichnung, Nickhaut (halb vorgezogen,
   von vorn = rechts), beschuppte Lider statt Wimpern. o: { iris, iris2, pupille, offen, winkel, nick (0–1), lid, netz } */
const reptilAuge = (T, x, y, rr, o = {}) => {
  let s = T.augeReal(x, y, rr, { iris: o.iris, iris2: o.iris2, pupille: o.pupille || "schlitz", offen: o.offen || 0.6, winkel: o.winkel || 0, lid: o.lid || "#1a160c" });
  const W = rr * 1.35, off = o.offen || 0.6, Ho = rr * off, Hu = rr * off * 0.72;
  const id = T.id("ra" + (T._n = (T._n || 0) + 1));
  const spalt = `M${R2(-W)} 0C${R2(-W * 0.5)} ${R2(-Ho * 1.15)} ${R2(W * 0.45)} ${R2(-Ho * 1.2)} ${R2(W)} ${R2(-Ho * 0.1)}C${R2(W * 0.5)} ${R2(Hu * 1.1)} ${R2(-W * 0.4)} ${R2(Hu * 1.15)} ${R2(-W)} 0Z`;
  T.def(`<clipPath id="${id}"><path d="${spalt}"/></clipPath>`);
  let z = `<g transform="translate(${R2(x)} ${R2(y)}) rotate(${R2(o.winkel || 0)})"><g clip-path="url(#${id})">`;
  /* Netzzeichnung der Iris (dunkle Äderchen), nur fein */
  if (T.fein && o.netz !== false) {
    let d = "";
    for (let i = 0; i < 14; i++) {
      const a = T.rnd() * Math.PI * 2, r0 = rr * (0.35 + T.rnd() * 0.2), r1 = rr * (0.7 + T.rnd() * 0.2), a2 = a + (T.rnd() - 0.5) * 0.6;
      d += `M${R2(rr * 0.12 + Math.cos(a) * r0)} ${R2(Math.sin(a) * r0)}Q${R2(rr * 0.12 + Math.cos(a2) * (r0 + r1) / 2 + (T.rnd() - 0.5) * rr * 0.2)} ${R2(Math.sin(a2) * (r0 + r1) / 2)} ${R2(rr * 0.12 + Math.cos(a2) * r1)} ${R2(Math.sin(a2) * r1)}`;
    }
    z += `<path d="${d}" fill="none" stroke="${o.netzFarbe || "#3a2e0c"}" stroke-width="${R2(rr * 0.05)}" stroke-opacity=".55"/>`;
  }
  /* Nickhaut: durchscheinend, milchig-bläulich, von vorn (rechts) über das Auge gezogen */
  if (o.nick) {
    const nx = W - 2 * W * o.nick;
    z += `<path d="M${R2(W * 1.1)} ${R2(-rr * 1.2)}L${R2(nx + rr * 0.15)} ${R2(-rr * 1.2)}Q${R2(nx - rr * 0.25)} 0 ${R2(nx + rr * 0.1)} ${R2(rr * 1.2)}L${R2(W * 1.1)} ${R2(rr * 1.2)}Z" fill="${T.lg("nick", [[0, "#dfe6e0", 0.35], [0.5, "#c9d2c8", 0.55], [1, "#aab4a8", 0.7]], 0, 0, 1, 0)}"/>`;
    z += `<path d="M${R2(nx + rr * 0.15)} ${R2(-rr * 1.1)}Q${R2(nx - rr * 0.25)} 0 ${R2(nx + rr * 0.1)} ${R2(rr * 1.1)}" fill="none" stroke="#f4f7f2" stroke-opacity=".7" stroke-width="${R2(rr * 0.06)}"/>`;
  }
  /* Brauenwulst verschattet das obere Drittel */
  z += `<rect x="${R2(-W)}" y="${R2(-rr * 1.3)}" width="${R2(2 * W)}" height="${R2(rr * 0.9)}" fill="${T.lg("brau", [[0, "#000", 0.55], [1, "#000", 0]])}"/>`;
  z += `</g>`;
  /* rosa Tränenkarunkel der Säugetier-Vorlage gibt es bei Reptilien nicht: mit Haut überdecken; dicker, schuppiger Lidrand */
  z += `<ellipse cx="${R2(W * 0.98)}" cy="${R2(-Ho * 0.05)}" rx="${R2(rr * 0.24)}" ry="${R2(rr * 0.18)}" fill="${o.haut || "#4a4632"}"/>`;
  z += `<path d="${spalt}" fill="none" stroke="${o.lidRand || "#2a2618"}" stroke-width="${R2(rr * 0.16)}" stroke-opacity=".9"/>`;
  z += `<path d="M${R2(W * 0.75)} ${R2(Hu * 0.6)}C${R2(W * 0.3)} ${R2(Hu * 1.25)} ${R2(-W * 0.4)} ${R2(Hu * 1.25)} ${R2(-W * 0.85)} ${R2(Hu * 0.35)}" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="${R2(rr * 0.07)}"/>`;
  z += `</g>`;
  return s + z;
};
/* fertige Art: Zeichenraum → Zentimeter */
/* fertige Art: Zeichenraum → Zentimeter; fuesse (x der Fußmitten) und kopf (Ausschnitt) ebenfalls in Einheiten */
const fertig = (f, svg, box, fuesse, kopf) => {
  const z = { svg: `<g transform="scale(${f})">${svg}</g>`, box: box.map((v) => Math.round(v * f)) };
  if (fuesse) z.fuesse = fuesse.map((v) => Math.round(v * f));
  if (kopf) z.kopf = kopf.map((v) => Math.round(v * f));
  return z;
};

/* =====================================================================
   KROKODIL (Nilkrokodil, Crocodylus niloticus)
   RECHERCHE: Erwachsen 3,5–5 m (hier 4,5 m), Kopf ≈ 1/7 der Gesamtlänge, Schnauze ≈ 2/3 der Kopflänge, Schwanz ≈ 45 %
   der Länge, seitlich abgeflacht, oben zwei Reihen hoher dreieckiger Kammschuppen, die etwa in der Schwanzmitte zu EINER
   Reihe verschmelzen; Schwanzschuppen in Ringen (Wirteln, ~36). Rücken: Rückenschild aus gekielten Knochenplatten
   (Osteoderme) in 6–8 Längsreihen und ~16–17 Querreihen; davor Nackenschild (4 große + 2 kleine Platten) und eine
   Querreihe kleiner Hinterhauptschilde. Flanken: kleinere ovale, ungekielte Schuppen; Bauch: glatte, rechteckige Schilde
   in Querreihen (hell, cremegelb). Gang „high walk“: Bauch vom Boden gehoben, Beine halb gestreckt. Vorderfuß 5 Finger
   (innere 3 mit Krallen), Hinterfuß 4 Zehen mit Schwimmhäuten (innere 3 mit Krallen), Saum gekielter Schuppen hinten am
   Unterschenkel. Kopf: Augen oben, erhöht, mit knöchernem Oberlid; senkrechte Schlitzpupille, Iris grünlich-gelb mit
   dunklem Netz; Nickhaut (durchsichtiges drittes Lid, zieht von vorn nach hinten). Ohr: Schlitz hinter dem Auge mit
   Ohrklappe. Nasenlöcher auf erhabener Scheibe an der Schnauzenspitze. Oberkieferrand gewellt; Einkerbung hinter der
   Schnauzenspitze, in die der große 4. Unterkieferzahn greift – bei geschlossenem Maul SICHTBAR (Unterschied zum
   Alligator). Zähne: 5 + 13–14 oben, 15 unten je Seite, kegelförmig, verzahnen sich außen sichtbar. Sinnesorgane
   (ISOs) als dunkle Pünktchen auf den Kieferschuppen. Farbe erwachsen: dunkel olivbronze oben, Schwanz mit dunklen
   Querbinden, Flanken gelbgrün-oliv mit dunklen schrägen Flecken, Bauch cremegelb; Unterkiefer hell mit dunklen Flecken.
   Zeichenraum: 1 Einheit = 1,5 cm (300 Einheiten = 4,5 m).
   ===================================================================== */
function krokodil(T) {
  const F = T.fein, US = ' gradientUnits="userSpaceOnUse"';
  let h = "";
  /* ---------- Rumpf + Schwanz als Rohr (Wirbelsäule mit Höhe oben/unten) ---------- */
  const sp = [[0, -0.5, 0.25, 0.25], [15, -1.4, 1.2, 1.3], [30, -2.5, 2.1, 2.4], [45, -3.8, 3.0, 3.3], [60, -5.6, 3.9, 4.1], [75, -7.8, 4.8, 5.0], [90, -10.1, 5.8, 5.9],
    [105, -12.5, 6.8, 6.7], [120, -14.9, 7.9, 7.5], [135, -17.1, 9.0, 8.3], [150, -18.9, 10.4, 9.2], [165, -20.1, 11.6, 10.2], [180, -20.8, 12.6, 11.1], [195, -21.1, 13.0, 11.5],
    [210, -21.3, 12.8, 11.2], [222, -21.6, 12.0, 10.4], [234, -22.2, 10.8, 9.2], [246, -23.2, 9.6, 7.6], [258, -24.0, 9.0, 7.8]];
  const Rr = rohr(sp, 5);
  const tx = (x) => { let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (Rr.P(m, 0)[0] < x) lo = m; else hi = m; } return (lo + hi) / 2; };
  const tH = tx(147), tS = tx(237);
  const umriss = Rr.zug(-1, 0, 1, 22).concat(Rr.zug(1, 0, 1, 22).reverse());

  /* ---------- ferne Beine: gleiche Bauart, im Körperton ~25 % dunkler, Schuppen sichtbar ---------- */
  const mB = "";
  const fernF = ["#5a5640", "#47442f", "#2f2c1f"];
  h += reptilBein(T, { n: "fv", ton: "f", ticks: false, farben: fernF, muster: mB,
    glieder: [[[235.4, -14.6], [240.4, -14.6], [242.4, -8], [243.6, -3.4], [240, -2.4], [238.6, -6.6], [236, -11]], [[239.4, -3.6], [243.6, -3.8], [246.4, -2.2], [247, -0.2, 1], [239, -0.2, 1], [238.8, -1.8]]],
    zehen: [[244.6, -1.6, 248.8, -0.9, 1.2], [245.2, -1.2, 250.4, -0.66, 1.2], [245, -0.8, 249, -0.62, 1.2]],
    krallen: [[248.8, -0.9, 1.4, 0.48, 16, 0.42], [250.4, -0.66, 1.5, 0.5, 12, 0.42]], falten: [[[238.6, -4], [240.8, -3.4], [243, -3.8]]] });
  h += reptilBein(T, { n: "fh", ton: "f", ticks: false, farben: fernF, muster: mB,
    glieder: [[[134.4, -14], [140, -13.6], [138.6, -8], [136.4, -3.8], [132.4, -3.2], [133.4, -8]], [[131, -3.8], [136.4, -3.6], [139.6, -2.2], [140.2, -0.2, 1], [130.4, -0.2, 1], [130.2, -2]]],
    zehen: [[139.4, -1.7, 144.6, -1, 1.3], [140, -1.3, 146.2, -0.7, 1.3], [139.8, -0.9, 144.4, -0.66, 1.3]],
    krallen: [[144.6, -1, 1.5, 0.5, 16, 0.42], [146.2, -0.7, 1.6, 0.52, 12, 0.42]], falten: [[[132.6, -4], [135, -3.4], [137.4, -3.8]]] });

  /* ---------- Körper: Farbzonen, Binden, Flecken, Licht, Schuppen ---------- */
  let inn = "";
  const nZ = 8;
  inn += `<g filter="${weich(T, "z", 1.5)}">` +
    form(T, poly(Rr.band(-1.3, -0.42, 0, 1, nZ)), "#36352a") +
    form(T, poly(Rr.band(-0.15, 0.45, 0.12, 1, nZ)), "#857e58", ' opacity=".85"') +
    form(T, poly(Rr.band(0.45, 1.3, 0.1, 1, nZ)), "#cbc4a2") +
    form(T, poly(Rr.band(0.2, 1.3, 0, 0.14, 4)), "#736d4c", ' opacity=".8"') + "</g>";
  let bd = "";
  for (const b of [0.03, 0.085, 0.14, 0.195, 0.25, 0.305, 0.36, 0.415, 0.465]) { const w = 0.016 + b * 0.012; bd += T.glatt([Rr.P(b, -1.3), Rr.P(b + w, -1.3), Rr.P(b + w * 1.2, 0.1), Rr.P(b + w * 0.8, 0.6), Rr.P(b - w * 0.1, 0.5), Rr.P(b - w * 0.25, 0)]); }
  [[0.56, -0.2, 0.011, 0.5], [0.6, 0.12, 0.009, 0.32], [0.64, -0.28, 0.012, 0.55], [0.685, 0.05, 0.011, 0.4], [0.725, -0.22, 0.01, 0.48], [0.77, -0.3, 0.012, 0.5], [0.81, 0.02, 0.01, 0.38], [0.85, -0.24, 0.011, 0.46], [0.53, 0.15, 0.009, 0.3], [0.9, -0.1, 0.01, 0.4]]
    .filter((_, i) => F || i % 2 === 0).forEach(([t, v, w, hh], i) => { const [x, y] = Rr.P(t, v), rx = w * Rr.len * 1.3, ry = hh * 6; bd += `M${R(x - rx)} ${R(y)}a${R(rx)} ${R(ry)} ${12 + (i % 3) * 14} 1 0 ${R(2 * rx)} 0a${R(rx)} ${R(ry)} ${12 + (i % 3) * 14} 1 0 ${R(-2 * rx)} 0`; });
  inn += `<path d="${bd}" fill="#1c1b12" opacity=".5" filter="${weich(T, "b", 0.6)}"/>`;
  inn += `<g filter="${weich(T, "l", 1.3)}">` +
    form(T, poly(Rr.band(-1.1, -0.62, 0.02, 0.98, nZ)), "#fff3d0", ' opacity=".14"') +
    form(T, poly(Rr.band(0.3, 0.8, 0.04, 0.98, nZ)), "#000", ' opacity=".3"') +
    form(T, poly(Rr.band(0.9, 1.1, 0.5, 0.97, 6)), "#f6edcc", ' opacity=".28"') + "</g>";
  const tsR = []; for (let i = 0; i <= 17; i++) tsR.push(tH + (tS - tH) * i / 17);
  const tsS = []; { let t = 0.014; while (t < tH - 0.012) { tsS.push(t); t += 0.0108 + t * 0.012; } tsS.push(tH); }
  const vR = [-1.02, -0.86, -0.66, -0.42], vS = [-1.02, -0.68, -0.35, -0.03, 0.36, 0.76, 1.04];
  /* Schuppen: Fugen dunkel, darauf Platten/Beulen mit eigenem Licht */
  if (F) {
    const pG = plattenGrad(T, "g", false, 0.9), pG2 = plattenGrad(T, "g2", false, 1.2);
    const bN = beulenGrad(T, "n", 0.2, 0.26), bH = beulenGrad(T, "h", 0.3, 0.2), bD = T.rg("beuled", [[0, "#d8cfa0", 0.12], [0.4, "#1a170c", 0.22], [1, "#000", 0.42]], 0.36, 0.3, 0.78);
    /* Rückenschild: drei sichtbare Längsreihen gekielter Osteoderme (Knochenplatten) über dunklen Fugen */
    inn += form(T, poly(Rr.band(-1.05, -0.41, tH - 0.004, tS + 0.004, 16)), "#000", ' opacity=".3"');
    inn += plattenG(T, Rr, tsR, vR, { jit: 0.16, sw: 0.35, fuge: 0.12, fugeV: 0.1, kiel: [0, 1], kw: 0.42, opK: 0.32, opKL: 0.4, grad: (j, z) => z < 0.35 ? pG2 : pG });
    /* Flanke: gewölbte ovale Schuppen in lockeren Reihen, nach unten kleiner, manche dunkel (Fleckung) */
    inn += form(T, poly(Rr.band(-0.41, 0.5, tH, tS + 0.01, 16)), "#000", ' opacity=".12"');
    inn += form(T, Rr.band(-0.42, 0.12, tH, tS + 0.01, 8), musterBeulen(T, "fl", 2.2, { flach: 0.66, grund: 0.12, hell: 0.24, dunkel: 0.3, rot: -1 }));
    inn += form(T, Rr.band(0.12, 0.52, tH, tS + 0.01, 8), musterBeulen(T, "fl", 2.2));
    /* Hals: Nackenschilde seitlich, dazwischen kleinere Höcker */
    inn += beulen(T, Rr.band(-0.95, 0.4, tS + 0.008, 1, 4), 1.7, { flach: 0.7, dichte: 0.9, grads: [bN, bN, bD] });
    /* Bauchschilde in Querreihen */
    const tsB = []; for (let t = tH; t < 1; t += 0.015) tsB.push(t);
    inn += gitter(T, Rr, tsB, [0.5, 0.7, 0.9], { versatz: true, w: 0.16, g: 0.2, opS: 0.34, opL: 0.26, hell: "#fff6da", schritt: 40, lichtQuer: false });
    /* Schwanzringe: Fugen, obere vier Reihen als Platten (drei gekielt), untere glatte Rechtecke */
    inn += form(T, poly(Rr.band(-1.05, 0.3, 0, tH, 24)), "#000", ' opacity=".22"');
    inn += gitter(T, Rr, tsS, vS, { licht: false, w: 0.4, opS: 0.55, dunkel: "#0e0d08", schritt: 30 });
    inn += plattenG(T, Rr, tsS.filter((t) => t > 0.1), vS.slice(0, 3), { sw: 0.35, fuge: 0.1, kiel: [0], kw: 0.34, opK: 0.3, opKL: 0.3, grad: (j, z) => z < 0.35 ? pG2 : pG });
  } else {
    inn += gitter(T, Rr, tsR.filter((_, i) => i % 2 === 0), [-1.02, -0.8, -0.45], { w: 0.5, opS: 0.45, licht: false, schritt: 40 });
    inn += gitter(T, Rr, tsS.filter((_, i) => i % 2 === 0), [-0.55, 0.45], { w: 0.5, opS: 0.35, licht: false, schritt: 40 });
  }
  h += teil(T, T.glatt(umriss), "#5a5739", { innen: inn, rw: 0.35, randA: 0.32 });

  /* ---------- Schwanzkamm (zwei Reihen, ab der Mitte eine) und Rückenkiele ---------- */
  let kam = "", kamL = "", kamF = "";
  for (let i = 0; i < tsS.length - 1; i += F ? 1 : 2) {
    const t0 = tsS[i], t1 = tsS[Math.min(tsS.length - 1, i + (F ? 1 : 2))], [, , nx, ny] = Rr.at(t0);
    const Hh = (0.7 + 2.2 * Math.sin(Math.PI * Math.min(1, (t0 / tH) * 0.85 + 0.08))) * Math.min(1, 0.45 + t0 * 6);
    const a = Rr.P(t0, -1), b = Rr.P(t1, -1), m = Rr.P(t0 + (t1 - t0) * 0.6, -1);
    const s2 = [m[0] + nx * Hh - 0.25, m[1] + ny * Hh];
    kam += F ? `M${R(a[0])} ${R(a[1] + 0.5)}Q${R(a[0] + (s2[0] - a[0]) * 0.55 - 0.3)} ${R(a[1] + (s2[1] - a[1]) * 0.6)} ${R(s2[0])} ${R(s2[1])}L${R(b[0])} ${R(b[1] + 0.5)}Z` : `M${R(a[0])} ${R(a[1] + 0.5)}L${R(s2[0])} ${R(s2[1])}L${R(b[0])} ${R(b[1] + 0.5)}Z`;
    if (F && t0 > 0.08) kamL += `M${R(a[0] + 0.35)} ${R(a[1] - 0.1)}L${R(s2[0] - 0.05)} ${R(s2[1] + 0.25)}`;
    if (F && t0 > 0.23) { const mm = Rr.P(t0 + (t1 - t0) * 0.1, -1); kamF += `M${R(a[0] - 0.9)} ${R(a[1] + 0.5)}L${R(mm[0] + nx * Hh * 0.82 - 0.5)} ${R(mm[1] + ny * Hh * 0.82)}L${R(mm[0] + 0.7)} ${R(mm[1] + 0.5)}Z`; }
  }
  for (let i = 0; i < tsR.length - 1; i++) {
    const t0 = tsR[i], t1 = tsR[i + 1], a = Rr.P(t0 + (t1 - t0) * 0.08, -1), b = Rr.P(t1 - (t1 - t0) * 0.08, -1), m = Rr.P((t0 + t1) / 2, -1);
    const H2 = 0.7 + 0.22 * Math.sin(i * 1.7);
    kam += `M${R(a[0])} ${R(a[1] + 0.45)}Q${R(m[0] - 0.5)} ${R(m[1] - H2 * 1.7)} ${R(b[0])} ${R(b[1] + 0.45)}Z`;
    if (F) kamF += `M${R(m[0] - 1.6)} ${R(m[1] + 0.4)}Q${R(m[0] + 0.6)} ${R(m[1] - H2 * 1.5)} ${R(m[0] + 2.6)} ${R(m[1] + 0.4)}Z`;
    if (F) kamL += `M${R(a[0] + 0.2)} ${R(a[1] - 0.05)}Q${R(m[0] - 0.7)} ${R(m[1] - H2 * 1.35)} ${R(m[0] + 0.3)} ${R(m[1] - H2 * 0.75)}`;
  }
  if (kamF) h += `<path d="${kamF}" fill="#24231a" stroke="#0f0e08" stroke-width=".2" stroke-opacity=".5"/>`;
  h += `<path d="${kam}" fill="${T.lg("kamm", [[0, "#6c6849"], [0.55, "#47452f"], [1, "#2d2c1f"]], 0, -36, 0, -12, US)}" stroke="#12110a" stroke-width=".22" stroke-opacity=".65" stroke-linejoin="round"/>`;
  if (kamL) h += `<path d="${kamL}" fill="none" stroke="#efe6c6" stroke-width=".24" stroke-opacity=".4" stroke-linecap="round"/>`;

  /* ---------- nahe Beine: Glieder mit Gelenken (Hüfte → Knie vorn → Unterschenkel zurück → Fuß flach; Schulter →
     Ellbogen hinten → Unterarm vor → Hand gespreizt), oberes Glied blendet weich in den Rumpf ---------- */
  const nahF = ["#7c7754", "#605c41", "#3d3a28"];
  const mO = F ? musterBeulen(T, "bo", 1.6, { rot: -20, grund: 0.1, hell: 0.2, dunkel: 0.26 }) : "";
  h += reptilBein(T, { n: "nh", ton: "n", farben: nahF, muster: mO, maske: [-24.6, -19.6],
    glieder: [[[139.6, -22.6], [150, -24.4], [158, -21.6], [163.6, -15.2], [165, -11.6], [163.2, -9.2], [159.4, -9.6], [154, -12.4], [146.4, -14.8], [140.6, -17.4]],
      [[158.4, -12.6], [164.6, -11.4], [163.4, -7.2], [161, -4.4], [160.4, -2.6], [155.2, -2.4], [154.4, -4.6], [155.4, -8.4], [156.6, -11.2]],
      [[153.4, -3.8], [158.6, -3.6], [162.6, -2.8], [166, -2], [167.4, -0.9], [166.6, -0.2, 1], [152.8, -0.2, 1], [152.2, -1.8]]],
    innen: [fleck(T, "l", 154, -20, 6, 2.6, -25, 0.35) + fleck(T, "d", 150, -14.4, 7, 2, -15, 0.45), fleck(T, "l", 160.6, -9, 1.4, 2.8, 25, 0.3), fleck(T, "d", 158, -0.8, 7, 0.9, 0, 0.45)],
    schwimm: [[165, -2.2], [170, -1.7], [173.4, -1.2], [175, -0.9], [172, -0.6], [166, -0.6]],
    zehen: [[165, -2, 170.4, -1.4, 1.45], [165.6, -1.6, 173.6, -1.05, 1.45], [166, -1.2, 175, -0.8, 1.45], [165.6, -0.8, 171.2, -0.72, 1.45]],
    krallen: [[170.4, -1.4, 1.6, 0.55, 18, 0.45], [173.6, -1.05, 1.8, 0.6, 14, 0.45], [175, -0.8, 1.9, 0.62, 10, 0.45]],
    kanten: [[[158, -21.6], [163.6, -15.2], [165, -11.6], [163.2, -9.2]], [[164.6, -11.4], [163.4, -7.2], [161, -4.4], [160.4, -2.8]], [[155.4, -8.4], [154.4, -4.6], [153, -3.4]]],
    falten: [[[159.4, -11], [161.8, -10.2], [164.2, -10.8]], [[155.6, -4], [158, -3.4], [160.6, -3.8]], [[141, -17.2], [146.4, -15], [152, -13.2]]] });
  h += reptilBein(T, { n: "nv", ton: "n", farben: nahF, muster: mO, maske: [-23.6, -19.2],
    glieder: [[[221.6, -23], [229.4, -22.6], [229.6, -18.4], [227, -14], [224.4, -10.4], [220.4, -9], [219.2, -11.6], [220.2, -16.4], [221, -20.4]],
      [[219.4, -11.2], [224.6, -11.8], [227.4, -8], [228.8, -4.6], [229.2, -2.8], [224.8, -2], [223.6, -4], [221.4, -7]],
      [[223.8, -3.6], [228.4, -3.8], [231.4, -2.8], [233.2, -1.6], [233.4, -0.6], [232.4, -0.2, 1], [223.6, -0.2, 1], [223.2, -1.8]]],
    innen: [fleck(T, "l", 225, -18.6, 3.6, 2.6, -30, 0.35) + fleck(T, "d", 222, -10.6, 3, 1.6, 0, 0.4), fleck(T, "l", 223.6, -9, 1.2, 2.4, -30, 0.3), fleck(T, "d", 228, -0.8, 5, 0.9, 0, 0.45)],
    zehen: [[230.6, -2.2, 234.4, -1.5, 1.25], [231.4, -1.8, 236.6, -1.05, 1.25], [232, -1.4, 238, -0.8, 1.25], [232, -1, 237, -0.68, 1.25], [231.6, -0.7, 234.8, -0.63, 1.25]],
    krallen: [[234.4, -1.5, 1.4, 0.5, 20, 0.45], [236.6, -1.05, 1.6, 0.55, 16, 0.45], [238, -0.8, 1.7, 0.55, 12, 0.45]],
    kanten: [[[229.6, -18.4], [227, -14], [225.6, -12]], [[224.6, -11.8], [227.4, -8], [228.8, -4.6], [229.2, -2.8]], [[219.2, -11.6], [221.4, -7], [223.6, -4]]],
    falten: [[[221, -10.6], [223.6, -9.4], [226.2, -10.4]], [[224.4, -3.8], [226.6, -3.2], [229, -3.6]]] });

  /* ---------- Kopf (als Gruppe 2 Einheiten tiefer: leicht gesenkt) ---------- */
  let k = "";
  /* unregelmäßige dunkle Flecken (weich), je [x, y, Größe] */
  const flecken = (liste, farbe, op) => `<path d="${liste.map(([x, y, g], i) => `M${R(x - g)} ${y}a${R(g)} ${R(g * (0.45 + (i % 3) * 0.12))} ${(i * 37) % 50 - 25} 1 0 ${R(2 * g)} 0a${R(g)} ${R(g * (0.45 + (i % 3) * 0.12))} ${(i * 37) % 50 - 25} 1 0 ${R(-2 * g)} 0`).join("")}" fill="${farbe}" opacity="${op}" filter="${weich(T, "f", 0.22)}"/>`;
  /* Unterkiefer: vorn schlank, hinten tief, geht in die Kehle über; Seite mittelhell, dunkel gefleckt, Unterkante hell */
  const uk = [[300.2, -22.2], [300.5, -21], [299.6, -19.9], [296.6, -19.2], [290, -18.8], [282, -18.3], [274, -17.8], [266, -17.4], [260, -17.2], [254, -17.2], [248, -17.4], [244, -18], [243.6, -21], [246.6, -24.4], [251, -25.8], [255, -25.8], [258, -24.6], [266, -23.4], [276, -23], [286, -23.2], [292, -24.4], [297, -23.6]];
  let ui = "";
  ui += `<g filter="${weich(T, "k", 0.6)}">` + form(T, [[243, -17.4], [262, -17.4], [280, -18.4], [298, -19.6], [298, -20.4], [280, -19.8], [262, -19.6], [250, -20.6], [243, -20.4]], "#d6ceaa", ' opacity=".6"') + form(T, [[243, -21], [252, -25], [256, -24.8], [252, -21]], "#000", ' opacity=".25"') + "</g>";
  ui += fleck(T, "d", 264, -23, 14, 1.3, 0, 0.5) + fleck(T, "l", 254.6, -21.6, 3.2, 2.2, 0, 0.3);
  if (F) ui += flecken([[258, -21.2, 0.9], [263.6, -20.6, 0.7], [268.4, -21.4, 1], [274, -20.8, 0.75], [279.4, -21.3, 0.95], [285, -20.7, 0.7], [290.4, -21.1, 0.85], [295.6, -20.8, 0.6]], "#2b2816", 0.55);
  if (F) {
    ui += `<rect x="243" y="-26" width="58" height="9" fill="${musterBeulen(T, "kg", 1.45, { flach: 0.62, grund: 0.04, hell: 0.09, dunkel: 0.12 })}"/>`;

    ui += punkte(T, [[256, -23.4], [298, -22.2], [298, -20.2], [256, -19.4]], 32, 0.12, "#1a160a", 0.6);
  }
  /* Kopf geht hinten weich in den Hals über (Maske statt harter Kante) */
  const mid = T.id("kmask");
  T.def(`<linearGradient id="${mid}g" gradientUnits="userSpaceOnUse" x1="241" y1="0" x2="251.5" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>` +
    `<mask id="${mid}" maskUnits="userSpaceOnUse" x="230" y="-45" width="80" height="35"><rect x="230" y="-45" width="80" height="35" fill="url(#${mid}g)"/></mask>`);
  k += `<g mask="url(#${mid})">` + teil(T, uk, "#88815c", { innen: ui, rw: 0.28, randA: 0.32, kante: [uk.slice(1, 11)] });
  /* Oberkopf: flaches Schädeldach, erhöhte Augenhöhle, lange Schnauze, Nasenscheibe, gewellter Kieferrand mit Kerbe */
  const ko = [[246, -34.4], [252, -35.2], [257, -35.6], [263, -35.6], [265.2, -36.9], [268.4, -38.2], [271.4, -37.4], [273.4, -35.4], [278, -31.8], [284, -29.4], [290, -27.8], [294, -27.1], [296.2, -27.4], [298.6, -27.2], [300.2, -25.8], [300.8, -23.6], [300.2, -22.4, 1],
    [298, -21.8], [295.6, -22.2], [293.4, -23.2], [291.4, -23.2], [289.2, -22.2], [286.4, -21.4], [282, -21.5], [276, -21.9], [270, -22.2], [264, -22.6], [260, -23.4], [257, -24.8], [254.6, -27.2], [252.4, -30.2], [248, -31.8]];
  let ki = "";
  /* große Licht- und Schattenformen: Schnauzenrücken hell, Kieferseite unten dunkel, Mulde unter dem Auge,
     Kaumuskel hinter dem Maulwinkel gewölbt, Augenwulst */
  ki += `<g filter="${weich(T, "h", 0.9)}">` + form(T, [[250, -34.4], [262, -35.2], [272, -35], [284, -30], [296, -27.2], [299, -26], [292, -26.4], [280, -29.6], [268, -32], [256, -32.6]], "#ece2bb", ' opacity=".26"') +
    form(T, [[257, -25.4], [264, -23.4], [280, -22.6], [296, -22.8], [296, -24], [280, -24.4], [264, -26], [258, -28]], "#000", ' opacity=".24"') +
    form(T, [[260, -31.6], [266, -32.6], [274, -32], [280, -29.4], [276, -28.4], [266, -29.6]], "#000", ' opacity=".2"') + "</g>";
  ki += fleck(T, "l", 254, -29.4, 3, 3.2, 0, 0.32) + fleck(T, "l", 287, -26.4, 9, 1.4, -14, 0.22) + fleck(T, "l", 268.6, -37.2, 3.4, 1.3, -4, 0.45);
  if (F) ki += flecken([[262.4, -26.8, 0.8], [267.4, -27.6, 0.95], [273, -26.4, 0.7], [278, -27.6, 0.9], [282.6, -25.6, 0.7], [287.4, -26.2, 0.8], [292, -25.2, 0.6], [270.8, -24.8, 0.6], [259.6, -29, 0.8], [276.4, -24.6, 0.6]], "#22200f", 0.45);
  if (F) {
    /* fein gekörnte Haut (gezeichnete Körnchen, schwach), Schädeldach gröber; Lippenschuppen; Sinnesorgane */
    ki += fleck(T, "d", 256, -32.6, 7, 2, 0, 0.25);
    ki += `<rect x="243" y="-38" width="58" height="17" fill="${musterBeulen(T, "kg", 1.45, { flach: 0.62, grund: 0.04, hell: 0.09, dunkel: 0.12 })}"/>`;
    ki += punkte(T, [[262, -27.4], [298, -25.4], [298, -23.4], [262, -24.2]], 38, 0.11, "#14120a", 0.6);
    ki += reihe(T, [[257.4, -25], [265, -23.2], [275, -22.4], [286.4, -22], [289.6, -22.8], [291.6, -23.8], [293.6, -23.8], [297.6, -22.4]], 30, -1.1, "#16130a", 0.12, 0.36, 0.25);
  }
  ki += fleck(T, "d", 292.4, -23.8, 1.6, 1.1, 0, 0.5);
  k += teil(T, ko, "#58553a", { innen: ki, rw: 0.3, randA: 0.32, kante: [ko.slice(0, 17)] }) + "</g>";
  /* Maulspalte: dunkle Linie zwischen den Kiefern */
  k += linien(T, [[[256.6, -25.2], [260, -23.8], [264, -23], [270, -22.6], [276, -22.3], [282, -21.9], [286.4, -21.8], [289.2, -22.6], [291.4, -23.6], [293.4, -23.6], [295.6, -22.6], [298, -22.2], [300.2, -22.3]]], "#0b0904", 0.45, 0.85);
  /* obere Zähne: außen über den Unterkiefer; größter am Oberkiefer-Buckel */
  const okZ = [[299.4, -22.5, 1.2, 0.6, -0.05], [297.4, -22, 1.6, 0.74, -0.06], [295.2, -22.4, 1.3, 0.66, -0.04], [289, -22.5, 1.5, 0.7, -0.04], [286.8, -21.8, 2.7, 1, -0.07], [284.2, -21.6, 2.1, 0.86, -0.05],
    [281.4, -21.7, 1.7, 0.76, -0.04], [278.6, -21.9, 1.6, 0.74, -0.04], [275.8, -22.1, 1.8, 0.76, -0.04], [273, -22.2, 1.7, 0.74, -0.04], [270.2, -22.4, 1.55, 0.7, -0.04], [267.4, -22.6, 1.4, 0.66, -0.03], [264.6, -22.8, 1.25, 0.62, -0.03], [262, -23.1, 1.05, 0.56, -0.03], [259.6, -23.6, 0.85, 0.48, -0.02]];
  k += zaehne(T, F ? okZ : okZ.filter((_, i) => i % 2 === 0), 1, { n: "o", spitze: "#faf6ea", mitte: "#efe8d2", basis: "#c8b48c", rw: 0.1 });
  /* untere Zähne: außen am Oberkiefer hoch; der große 4. greift in die Kerbe */
  const ukZ = [[298.6, -22.3, 1.3, 0.66, 0.05], [296.2, -22.5, 1.1, 0.6, 0.02], [294.6, -22.9, 1.1, 0.6, 0], [292.4, -23.4, 3.1, 1.08, -0.08], [288, -22.2, 1.1, 0.58, 0], [285.4, -21.9, 1.25, 0.62, 0],
    [282.8, -21.9, 1.4, 0.66, 0], [280, -22, 1.55, 0.68, 0], [277.2, -22.2, 1.5, 0.68, 0], [274.4, -22.3, 1.45, 0.66, 0], [271.6, -22.5, 1.35, 0.64, 0], [268.8, -22.6, 1.25, 0.62, 0], [266, -22.8, 1.15, 0.58, 0], [263.3, -23, 1.05, 0.54, 0], [260.8, -23.5, 0.85, 0.48, 0]];
  k += zaehne(T, F ? ukZ : ukZ.filter((_, i) => i % 2 === 1 || i === 3), -1, { n: "u", spitze: "#faf6ea", mitte: "#efe8d2", basis: "#c8b48c", rw: 0.1 });
  /* Nackenschild: Hinterhauptschilde + große gekielte Nackenplatten */
  let nk = "";
  for (const [x, y, w, hh] of [[251, -35.1, 2.2, 0.9], [244, -34.6, 3.4, 2], [239.2, -34, 3, 1.7]]) nk += `M${R(x - w / 2)} ${R(y + 0.5)}Q${R(x - w * 0.15)} ${R(y - hh * 1.6)} ${R(x + w / 2)} ${R(y + 0.5)}Z`;
  k += `<path d="${nk}" fill="#4c4a32" stroke="#12110a" stroke-width=".22" stroke-opacity=".6"/>`;
  if (F) k += linien(T, [[[243, -34.9], [244, -36.3]], [[238.4, -34.3], [239, -35.5]], [[250.4, -34.9], [250.8, -35.5]]], "#efe6c6", 0.26, 0.45);
  /* Auge: erhöht im Augenwulst, Schlitzpupille, Nickhaut halb vorgezogen, knöchernes Oberlid als heller Wulst mit Lidfalte */
  k += fleck(T, "d", 268.4, -35, 2.8, 2, -5, 0.45);
  k += reptilAuge(T, 268.5, -35.3, 1.55, { iris: "#d6c24e", iris2: "#5e5a1d", offen: 0.6, winkel: -6, nick: 0.27, netzFarbe: "#3d370e", haut: "#58553a" });
  k += linien(T, [[[265, -36.6], [267, -37.5], [269.6, -37.6], [272.2, -36.6]]], "#14120a", 0.28, 0.5);
  /* Ohrschlitz mit Ohrklappe hinter dem Auge */
  k += `<path d="M257.6 -33.6Q260.4 -34.3 263 -33.9Q260.4 -33.1 257.6 -33.6Z" fill="#14120a" opacity=".7"/>` + linien(T, [[[257.4, -34], [260.2, -34.9], [263.2, -34.4]]], "#ebe2c0", 0.2, 0.2);
  /* Nasenscheibe (erhabener Ring) mit Nasenloch */
  k += fleck(T, "l", 297.8, -27.9, 1.6, 0.7, 0, 0.5) + `<path d="M296.9 -27.7Q297.9 -28.4 298.9 -27.7Q297.9 -27.4 296.9 -27.7Z" fill="#0f0d07"/>` + (F ? linien(T, [[[296.4, -28.1], [297.9, -28.8], [299.4, -28.1]]], "#f4ead0", 0.14, 0.5) : "");
  h += `<g transform="translate(0 2)">${k}</g>`;
  return fertig(1.5, h, [0, -36.6, 301, 0], [138, 162, 228, 245], [243, -38, 302, -14]);
}

module.exports = [
  { id: "krokodil", de: "das Krokodil", syl: "Kro-ko-DIL", it: "il coccodrillo", itSyl: "coc-co-DRIL-lo", en: "crocodile",
    gruppe: "Reptilien", lebensraum: "Fluss", laenge: 4.5, hoehe: 0.55, zeichne: krokodil },
];
