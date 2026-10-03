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
/* weicher Schleier (Farbzonen, Licht) – Gaußfilter, Stärke in Einheiten */
const weich = (T, n, s) => {
  const id = T.id("bl" + n);
  if (!T["_bl" + n]) { T["_bl" + n] = 1; T.def(`<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${s}"/></filter>`); }
  return `url(#${id})`;
};
/* Körperteil: Pfad EINMAL in defs, Füllung + geklippte Innenzeichnung + Rand per <use> */
const teil = (T, pts, fill, o = {}) => {
  const d = typeof pts === "string" ? pts : T.glatt(pts);
  const id = T.id("q" + (T._n = (T._n || 0) + 1));
  T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  const innen = (o.innen || "") + (o.vol ? `<use href="#${id}" fill="${T.VOL()}"/>` : "");
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
    }
  }
  return `<g transform="translate(${ox} ${oy})">` + Object.entries(gruppen).map(([g, l]) => `<g fill="${g}" stroke="${g}" stroke-width="${o.sw || 0.5}" stroke-linejoin="round">${l.join("")}</g>`).join("") + "</g>";
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
      for (const dx of cx + rx > W ? [0, -W] : [0]) e += `<ellipse cx="${R2(cx + dx)}" cy="${R2(cy)}" rx="${R2(rx)}" ry="${R2(ry)}"/>`;
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
  const g = T.lg("kralle", [[0, "#fff", 0.28], [0.5, "#000", 0], [1, "#000", 0.3]]);
  const d = liste.map((k) => krallenPfad(...k)).join("");
  let gl = "";
  if (T.fein) for (const [x, y, L, b, w] of liste) { const a = w * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a), P = (u, v) => `${R2(x + u * c - v * sn)} ${R2(y + u * sn + v * c)}`; gl += `M${P(L * 0.12, -b * 0.22)}Q${P(L * 0.5, -b * 0.32)} ${P(L * 0.78, b * 0.15)}`; }
  return `<path d="${d}" fill="${farbe}"/><path d="${d}" fill="${g}"/>` + (gl ? `<path d="${gl}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="${R2(liste[0][3] * 0.14) || 0.05}" stroke-linecap="round"/>` : "");
};
/* kegelförmige Zähne: [x, y, L, b, neigung] Basis (x, y), Spitze nach unten (dir 1) oder oben (dir −1) */
const zaehne = (T, liste, dir = 1, o = {}) => {
  let d = "", gl = "", sch = "";
  for (const [x, y, L, b, k = 0] of liste) {
    const tx = x + k * L, ty = y + dir * L;
    d += `M${R2(x - b / 2)} ${R2(y)}Q${R2(x - b * 0.45 + k * L * 0.4)} ${R2(y + dir * L * 0.62)} ${R2(tx)} ${R2(ty)}Q${R2(x + b * 0.5 + k * L * 0.5)} ${R2(y + dir * L * 0.45)} ${R2(x + b / 2)} ${R2(y)}Z`;
    if (T.fein) {
      gl += `M${R2(x - b * 0.18)} ${R2(y + dir * L * 0.15)}Q${R2(x - b * 0.2 + k * L * 0.4)} ${R2(y + dir * L * 0.55)} ${R2(tx - b * 0.08)} ${R2(ty - dir * L * 0.12)}`;
      sch += `M${R2(x + b * 0.28)} ${R2(y + dir * L * 0.1)}Q${R2(x + b * 0.3 + k * L * 0.45)} ${R2(y + dir * L * 0.45)} ${R2(tx + b * 0.05)} ${R2(ty - dir * L * 0.2)}`;
    }
  }
  const g = T.lg("zahn" + dir + (o.n || ""), [[0, dir > 0 ? (o.basis || "#b7a072") : (o.spitze || "#f1e9d2")], [0.45, o.mitte || "#e2d6b4"], [1, dir > 0 ? (o.spitze || "#f1e9d2") : (o.basis || "#b7a072")]]);
  return `<path d="${d}" fill="${g}" stroke="#3a3020" stroke-width="${o.rw || 0.06}" stroke-opacity=".75"/>` +
    (sch ? `<path d="${sch}" fill="none" stroke="#6a5a3a" stroke-opacity=".45" stroke-width="${o.gw || 0.12}" stroke-linecap="round"/>` : "") +
    (gl ? `<path d="${gl}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="${o.gw || 0.1}" stroke-linecap="round"/>` : "");
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
  z += `</g></g>`;
  return s + z;
};
/* fertige Art: Zeichenraum → Zentimeter */
const fertig = (f, svg, box) => ({ svg: `<g transform="scale(${f})">${svg}</g>`, box: box.map((v) => Math.round(v * f)) });

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
    [210, -21.3, 12.8, 11.2], [222, -21.6, 12.0, 10.4], [234, -22.2, 10.8, 9.3], [246, -23.2, 9.6, 8.4], [258, -24.0, 9.0, 8.2]];
  const Rr = rohr(sp, 5);
  const tx = (x) => { let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (Rr.P(m, 0)[0] < x) lo = m; else hi = m; } return (lo + hi) / 2; };
  const tH = tx(147), tS = tx(237);
  const umriss = Rr.zug(-1, 0, 1, 28).concat(Rr.zug(1, 0, 1, 28).reverse());

  /* ---------- ferne Beine (im Schatten, dahinter) ---------- */
  const fern = "#3d3b2c";
  h += teil(T, [[235, -15], [240.6, -15.6], [242.2, -10.6], [243, -6.4], [246, -3.2], [251.4, -1.6], [254, -0.2, 1], [242, -0.2, 1], [240.6, -2.4], [239.6, -7], [236.4, -10.4]], fern, { rw: 0.25, randA: 0.5,
    innen: fleck(T, "l", 239, -11, 2.4, 4, 10, 0.3) + fleck(T, "l", 246, -2.6, 4, 1, 0, 0.3) + fleck(T, "d", 238, -4, 4, 3, 0, 0.35) + (F ? T.form([[234, -16], [244, -16], [256, 0], [240, 0]], musterBeulen(T, "bu", 1.15)) : "") });
  h += teil(T, [[129, -14], [139, -15.4], [141.8, -10.6], [141, -5.6], [141.8, -2.6], [147.4, -1.6], [149.4, -0.2, 1], [130.6, -0.2, 1], [131.4, -2.8], [133.4, -6], [131.6, -9.6]], fern, { rw: 0.25, randA: 0.5,
    innen: fleck(T, "l", 136, -11, 3, 3.6, 0, 0.28) + fleck(T, "l", 143, -2.4, 4, 1, 0, 0.3) + fleck(T, "d", 136, -4, 5, 3, 0, 0.35) + (F ? T.form([[128, -16], [142, -16], [150, 0], [130, 0]], musterBeulen(T, "bu", 1.15)) : "") });
  h += krallen(T, [[253.4, -0.9, 1.5, 0.5, 14, 0.4], [251, -0.7, 1.3, 0.45, 20, 0.4], [149, -0.8, 1.5, 0.5, 12, 0.4], [146.4, -0.7, 1.2, 0.45, 18, 0.4]], "#1b1810");

  /* ---------- Körper: Farbzonen, Binden, Flecken, Licht, Schuppen ---------- */
  let inn = "";
  const nZ = F ? 10 : 6;
  inn += `<g filter="${weich(T, "z", 1.5)}">` +
    T.form(Rr.band(-1.3, -0.42, 0, 1, nZ), "#36352a") +
    T.form(Rr.band(-0.15, 0.45, 0.12, 1, nZ), "#857e58", ' opacity=".85"') +
    T.form(Rr.band(0.45, 1.3, 0.1, 1, nZ), "#cbc4a2") +
    T.form(Rr.band(0.2, 1.3, 0, 0.14, 4), "#736d4c", ' opacity=".8"') + "</g>";
  let bd = "";
  for (const b of [0.03, 0.085, 0.14, 0.195, 0.25, 0.305, 0.36, 0.415, 0.465]) { const w = 0.016 + b * 0.012; bd += T.glatt([Rr.P(b, -1.3), Rr.P(b + w, -1.3), Rr.P(b + w * 1.2, 0.1), Rr.P(b + w * 0.8, 0.6), Rr.P(b - w * 0.1, 0.5), Rr.P(b - w * 0.25, 0)]); }
  for (const [t, v, w, hh] of [[0.56, -0.2, 0.011, 0.5], [0.6, 0.12, 0.009, 0.32], [0.64, -0.28, 0.012, 0.55], [0.685, 0.05, 0.011, 0.4], [0.725, -0.22, 0.01, 0.48], [0.77, -0.3, 0.012, 0.5], [0.81, 0.02, 0.01, 0.38], [0.85, -0.24, 0.011, 0.46], [0.53, 0.15, 0.009, 0.3], [0.9, -0.1, 0.01, 0.4]].filter((_, i) => F || i % 2 === 0))
    bd += T.glatt([Rr.P(t - w, v - hh * 0.5), Rr.P(t + w, v - hh * 0.55), Rr.P(t + w * 1.7, v + hh * 0.5), Rr.P(t - w * 0.3, v + hh * 0.45)]);
  inn += `<path d="${bd}" fill="#1c1b12" opacity=".5" filter="${weich(T, "b", 0.6)}"/>`;
  inn += `<g filter="${weich(T, "l", 1.3)}">` +
    T.form(Rr.band(-1.1, -0.62, 0.02, 0.98, nZ), "#fff3d0", ' opacity=".14"') +
    T.form(Rr.band(0.3, 0.8, 0.04, 0.98, nZ), "#000", ' opacity=".3"') +
    T.form(Rr.band(0.9, 1.1, 0.5, 0.97, 6), "#f6edcc", ' opacity=".28"') + "</g>";
  const tsR = []; for (let i = 0; i <= 17; i++) tsR.push(tH + (tS - tH) * i / 17);
  const tsS = []; { let t = 0.014; while (t < tH - 0.012) { tsS.push(t); t += 0.0108 + t * 0.012; } tsS.push(tH); }
  const vR = [-1.02, -0.86, -0.66, -0.42], vS = [-1.02, -0.68, -0.35, -0.03, 0.3, 0.62, 0.88, 1.04];
  /* Schuppen: Fugen dunkel, darauf Platten/Beulen mit eigenem Licht */
  if (F) {
    const pK = plattenGrad(T, "k", true), pK2 = plattenGrad(T, "k2", true, 1.35), pG = plattenGrad(T, "g", false), pG2 = plattenGrad(T, "g2", false, 1.35);
    const bN = beulenGrad(T, "n", 0.28, 0.34), bH = beulenGrad(T, "h", 0.42, 0.26), bD = T.rg("beuled", [[0, "#3a3418", 0.25], [0.5, "#1a170c", 0.45], [1, "#000", 0.6]], 0.36, 0.3, 0.78);
    /* Rückenschild: drei sichtbare Längsreihen gekielter Osteoderme (Knochenplatten) über dunklen Fugen */
    inn += T.form(Rr.band(-1.05, -0.41, tH - 0.004, tS + 0.004, 8), "#000", ' opacity=".3"');
    inn += plattenG(T, Rr, tsR, vR, { jit: 0.16, sw: 0.35, fuge: 0.12, fugeV: 0.1, grad: (j, z) => z < 0.35 ? pK2 : pK });
    /* Flanke: gewölbte ovale Schuppen in lockeren Reihen, nach unten kleiner, manche dunkel (Fleckung) */
    inn += T.form(Rr.band(-0.41, 0.5, tH, tS + 0.01, 8), "#000", ' opacity=".12"');
    inn += beulen(T, Rr.band(-0.4, 0.5, tH + 0.005, tS + 0.008, 12), 2.1, { flach: 0.64, grads: [bN, bN, bN, bH, bD], groesse: (x, y) => 1.05 - Math.max(0, (y + 22) / 34) });
    /* Hals: Nackenschilde seitlich, dazwischen kleinere Höcker */
    inn += beulen(T, Rr.band(-0.95, 0.4, tS + 0.008, 1, 4), 2.1, { flach: 0.8, dichte: 0.85, grads: [bN, bH, bN] });
    /* Bauchschilde in Querreihen */
    const tsB = []; for (let t = tH - 0.02; t < 1; t += 0.0098) tsB.push(t);
    inn += gitter(T, Rr, tsB, [0.5, 0.66, 0.82, 0.98], { versatz: true, w: 0.16, g: 0.2, opS: 0.34, opL: 0.26, hell: "#fff6da", schritt: 40, lichtQuer: false });
    /* Schwanzringe: Fugen, obere vier Reihen als Platten (drei gekielt), untere glatte Rechtecke */
    inn += T.form(Rr.band(-1.05, 0.3, 0, tH, 14), "#000", ' opacity=".22"');
    inn += gitter(T, Rr, tsS, vS, { licht: false, w: 0.4, opS: 0.55, dunkel: "#0e0d08", schritt: 30 });
    inn += plattenG(T, Rr, tsS, vS.slice(0, 4), { sw: 0.35, fuge: 0.1, grad: (j, z) => j < 3 ? (z < 0.35 ? pK2 : pK) : (z < 0.35 ? pG2 : pG) });
    inn += linien(T, [[Rr.P(tx(246), 0.45), Rr.P(tx(245.4), 0.95)], [Rr.P(tx(250.4), 0.4), Rr.P(tx(250), 0.95)]], "#14120a", 0.22, 0.25);
  } else {
    inn += gitter(T, Rr, tsR.filter((_, i) => i % 2 === 0), [-1.02, -0.8, -0.45], { w: 0.5, opS: 0.45, licht: false, schritt: 40 });
    inn += gitter(T, Rr, tsS.filter((_, i) => i % 2 === 0), [-0.55, 0.45], { w: 0.5, opS: 0.35, licht: false, schritt: 40 });
  }
  h += teil(T, T.glatt(umriss), "#5a5739", { innen: inn, rw: 0.35, randA: 0.55 });

  /* ---------- Schwanzkamm (zwei Reihen, ab der Mitte eine) und Rückenkiele ---------- */
  let kam = "", kamL = "", kamF = "";
  for (let i = 0; i < tsS.length - 1; i++) {
    const t0 = tsS[i], t1 = tsS[i + 1], [, , nx, ny] = Rr.at(t0);
    const Hh = (0.7 + 2.2 * Math.sin(Math.PI * Math.min(1, (t0 / tH) * 0.85 + 0.08))) * Math.min(1, 0.45 + t0 * 6);
    const a = Rr.P(t0, -1), b = Rr.P(t1, -1), m = Rr.P(t0 + (t1 - t0) * 0.6, -1);
    const s2 = [m[0] + nx * Hh - 0.25, m[1] + ny * Hh];
    kam += `M${R(a[0])} ${R(a[1] + 0.5)}Q${R(a[0] + (s2[0] - a[0]) * 0.55 - 0.3)} ${R(a[1] + (s2[1] - a[1]) * 0.6)} ${R(s2[0])} ${R(s2[1])}L${R(b[0])} ${R(b[1] + 0.5)}Z`;
    if (F) kamL += `M${R(a[0] + 0.35)} ${R(a[1] - 0.1)}L${R(s2[0] - 0.05)} ${R(s2[1] + 0.25)}`;
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

  /* ---------- nahes Hinterbein: Oberschenkel schräg nach vorn zum Knie, Unterschenkel zurück, Fuß flach ---------- */
  const hb = [[141, -21.4], [150, -23.2], [157.4, -21.6], [162.6, -16.8], [164.8, -12.4], [164, -9.2], [161.4, -6.4], [160.8, -3.8], [164, -2.6], [170, -2], [175, -1.2], [176.8, -0.2, 1],
    [151, -0.2, 1], [150.2, -1.6], [152.2, -4.2], [153.6, -7.4], [154.4, -10.2], [150.4, -11.8], [144.6, -13.8], [140.4, -16.8]];
  let hi = "";
  hi += fleck(T, "l", 152, -19.4, 7, 3, -24, 0.45) + fleck(T, "l", 161.4, -13.4, 1.8, 3.4, 18, 0.32) + fleck(T, "d", 146, -13.6, 5.4, 2.2, -20, 0.5) + fleck(T, "d", 155.6, -5.6, 2.2, 2.6, 0, 0.35) + fleck(T, "d", 163, -1.2, 12, 1.2, 0, 0.5) + fleck(T, "l", 158, -4.6, 1.2, 2.4, 10, 0.25);
  hi += fleck(T, "d", 146, -21.6, 6, 2.2, -10, 0.35);
  if (F) {
    hi += T.form([[140, -24], [158, -24], [166, -14], [161, -8], [153, -11], [140, -14]], musterBeulen(T, "bo", 1.7, { rot: -20, grund: 0.2 }));
    hi += T.form([[152, -11], [161, -9], [162, -4], [178, -2], [178, 0], [149, 0], [150, -5]], musterBeulen(T, "bu", 1.15, { rot: 5, grund: 0.18 }));
    hi += reihe(T, [[154.4, -9.8], [153, -6.6], [151, -3.4]], 6, 1.1, "#120f08", 0.28, 0.5, -0.2);
  }
  hi += linien(T, [[[155.6, -10.2], [159.4, -9.6], [163, -10.6]]], "#120f08", 0.28, 0.38);
  h += teil(T, hb, "#5a573b", { innen: hi, rw: 0.3, randA: 0.5, kante: [hb.slice(2, 12), hb.slice(12, 20)] });
  /* Zehen II–IV mit Schwimmhaut */
  h += T.form([[167, -2.4], [174.6, -2.9], [180, -2.1], [177.6, -1.4], [171, -1.6]], "#3a3826", ' opacity=".7"');
  h += teil(T, [[172.6, -2.5], [177, -2.7], [180.2, -1.7], [181, -0.9], [177.6, -1.1], [173.6, -1.6]], "#45432e", { rw: 0.2, randA: 0.45 });
  h += teil(T, [[165, -2.5], [171, -2.6], [176.2, -2], [179.8, -1], [180.6, -0.2, 1], [169, -0.2, 1], [165, -0.9]], "#4e4b33", { rw: 0.24, randA: 0.45, innen: fleck(T, "l", 172, -2, 6, 0.6, 0, 0.35) + (F ? reihe(T, [[166, -2.2], [173, -2.2], [179.6, -0.8]], 11, 1.4, "#120f08", 0.13, 0.45) : "") });
  h += krallen(T, [[180.2, -0.8, 2, 0.6, 14, 0.4], [180.4, -1.5, 1.8, 0.55, 22, 0.4], [177.6, -2.4, 1.4, 0.45, 26, 0.4]], "#231f16");

  /* ---------- nahes Vorderbein: Oberarm nach hinten-unten, Ellbogen hinten, Unterarm nach vorn ---------- */
  const vb = [[221.4, -22.6], [229, -23.2], [230, -18.4], [228.4, -14.6], [227.2, -12], [228.6, -8.4], [229.6, -4.8], [230.6, -3], [233.8, -2.1], [237.8, -1.4], [240, -0.6], [240.6, -0.2, 1],
    [223.8, -0.2, 1], [223.6, -2.2], [223.8, -4.6], [222, -7.4], [220.2, -9.8], [220.6, -14], [221.8, -18.4]];
  let vi = fleck(T, "l", 225, -18.6, 3.4, 3, -30, 0.45) + fleck(T, "l", 227.4, -7.6, 1.2, 3, 8, 0.3) + fleck(T, "d", 221.6, -10.4, 2.4, 1.8, 0, 0.5) + fleck(T, "d", 230.4, -1.3, 9, 1.1, 0, 0.5) + fleck(T, "d", 228.4, -13.2, 2, 1.4, 0, 0.4) + fleck(T, "d", 225, -22.4, 5, 2, 0, 0.3);
  if (F) vi += T.form([[219, -24], [231, -24], [231, -13], [221, -11]], musterBeulen(T, "bo", 1.7)) + T.form([[221, -11], [231, -13], [233, -3], [241, 0], [222, 0]], musterBeulen(T, "bu", 1.15));
  vi += linien(T, [[[222.4, -10.4], [225.2, -9.6], [227.8, -10.6]], [[224.4, -4.2], [227.4, -3.6], [230, -4.4]]], "#120f08", 0.26, 0.4);
  h += teil(T, vb, "#5b583c", { innen: vi, rw: 0.3, randA: 0.5, kante: [vb.slice(1, 12), vb.slice(12, 19)] });
  h += teil(T, [[231.4, -2.3], [235.6, -2.9], [239.4, -2.5], [242.2, -1.3], [243, -0.2, 1], [237, -0.2, 1], [232.4, -0.8]], "#4e4b33", { rw: 0.22, randA: 0.45, innen: fleck(T, "l", 237.4, -2, 4, 0.6, 0, 0.3) });
  h += krallen(T, [[242.4, -0.9, 1.8, 0.55, 14, 0.4], [240, -1.7, 1.6, 0.5, 24, 0.4], [237.2, -2.4, 1.3, 0.45, 32, 0.4]], "#231f16");

  /* ---------- Kopf (als Gruppe 2 Einheiten tiefer: leicht gesenkt) ---------- */
  let k = "";
  /* Unterkiefer: vorn schlank, hinten tief; Seite mittelhell mit dunklen Flecken, Unterkante hell */
  const uk = [[300.2, -22.2], [300.5, -21], [299.6, -19.9], [296.6, -19.2], [290, -18.8], [282, -18.3], [274, -17.8], [266, -17.4], [260, -17.2], [254, -17.2], [248, -17.4], [244, -18], [243.6, -21], [246.6, -24.4], [251, -25.8], [255, -25.8], [258, -24.6], [266, -22.8], [276, -22.2], [288, -21.8], [296, -22.4]];
  let ui = "";
  ui += `<g filter="${weich(T, "k", 0.6)}">` + T.form([[243, -17.4], [262, -17.4], [280, -18.4], [298, -19.6], [298, -20.4], [280, -19.8], [262, -19.6], [250, -20.6], [243, -20.4]], "#d6ceaa", ' opacity=".6"') + T.form([[243, -21], [252, -25], [256, -24.8], [252, -21]], "#000", ' opacity=".25"') + "</g>";
  ui += fleck(T, "d", 262, -23, 12, 1.4, 0, 0.5) + fleck(T, "l", 254.6, -21.6, 3.2, 2.2, 0, 0.35) + linien(T, [[[246, -18], [248.4, -20.6], [252.6, -21.6]], [[249.8, -17.6], [252.4, -19.6], [256.6, -20.4]]], "#1a160c", 0.2, 0.3);
  ui += `<path d="${[[257, -21.4], [262.4, -20.8], [268, -21.4], [273.6, -20.8], [279, -21.2], [284.6, -20.6], [290, -21], [295, -20.6]].map(([x, y], i) => `M${x} ${y}h${R(0.7 + (i % 2) * 0.6)}`).join("")}" stroke="#2b2816" stroke-width="1.1" stroke-linecap="round" opacity=".45"/>`;
  if (F) {
    ui += `<rect x="248" y="-26" width="53" height="9" fill="${musterBeulen(T, "kf", 0.95, { flach: 0.7, grund: 0.05, hell: 0.13, dunkel: 0.18 })}"/>`;
    ui += reihe(T, [[253, -24.6], [262, -23.2], [274, -22.2], [288, -21.8], [299.6, -22.2]], 26, 2.2, "#18140a", 0.12, 0.38, -0.2);
    ui += punkte(T, [[256, -23.4], [298, -22.2], [298, -20.2], [256, -19.4]], 60, 0.12, "#1a160a", 0.65);
  }
  k += teil(T, uk, "#88815c", { innen: ui, rw: 0.28, randA: 0.55, kante: [uk.slice(1, 10)] });
  /* Oberkopf: flaches Schädeldach, erhöhte Augenhöhle, lange Schnauze, Nasenscheibe, gewellter Kieferrand mit Kerbe */
  const ko = [[246, -34.4], [252, -35.2], [257, -35.6], [263, -35.6], [265.6, -36.3], [268.2, -37.1], [271, -36.6], [273, -35.2], [278, -31.8], [284, -29.4], [290, -27.8], [294, -27.1], [296.2, -27.4], [298.6, -27.2], [300.2, -25.8], [300.8, -23.6], [300.2, -22.4, 1],
    [298, -21.8], [295.6, -22.2], [293.4, -23.2], [291.4, -23.2], [289.2, -22.2], [286.4, -21.4], [282, -21.5], [276, -21.9], [270, -22.2], [264, -22.6], [260, -23.4], [257, -24.8], [254.6, -27.2], [252.4, -30.2], [248, -31.8]];
  let ki = "";
  ki += `<g filter="${weich(T, "h", 0.9)}">` + T.form([[250, -34.4], [262, -35.2], [272, -35], [284, -30], [296, -27.2], [299, -26], [292, -26.4], [280, -29.6], [268, -32], [256, -32.6]], "#ece2bb", ' opacity=".24"') +
    T.form([[257, -25.4], [264, -23.4], [280, -22.6], [296, -22.8], [296, -24], [280, -24.4], [264, -26], [258, -28]], "#000", ' opacity=".22"') + "</g>";
  ki += fleck(T, "d", 262.4, -30.4, 5, 2.6, 0, 0.35) + fleck(T, "l", 287, -26.6, 9, 1.4, -14, 0.25) + fleck(T, "l", 254.4, -29.4, 2.6, 3, 0, 0.3);
  ki += fleck(T, "d", 269.4, -33.8, 4.4, 1.8, -4, 0.5);
  ki += `<path d="${[[262, -26.6], [267.4, -27.8], [273, -26.2], [277.8, -27.8], [282.2, -25.4], [287.4, -26.4], [292, -25], [270.6, -24.6], [259.6, -29.2], [276, -24.4]].map(([x, y], i) => `M${x} ${y}h${R(0.6 + (i % 3) * 0.4)}`).join("")}" stroke="#22200f" stroke-width="1.05" stroke-linecap="round" opacity=".4"/>`;
  if (F) {
    /* feine Körnung der Haut (Rauschen), Schädeldach gröber; Lippenschuppen; Sinnesorgane; Falten auf dem Schnauzenrücken */
    ki += `<rect x="246" y="-38" width="55" height="17" fill="${musterBeulen(T, "kf", 0.95, { flach: 0.7, grund: 0.05, hell: 0.13, dunkel: 0.18 })}"/>`;
    ki += T.form([[247, -34.2], [262, -35.2], [266, -33.6], [262, -30.4], [255, -30], [249, -31]], musterBeulen(T, "sd", 1.5, { flach: 0.85, grund: 0.22, hell: 0.3, dunkel: 0.45 }));
    ki += punkte(T, [[262, -27.4], [298, -25.4], [298, -23.4], [262, -24.2]], 75, 0.11, "#14120a", 0.62);
    ki += reihe(T, [[257.4, -25], [265, -23.2], [275, -22.4], [286.4, -22], [289.6, -22.8], [291.6, -23.8], [293.6, -23.8], [297.6, -22.4]], 30, -1.1, "#16130a", 0.12, 0.4, 0.25);
    ki += linien(T, [[[276, -33.4], [284, -30], [292, -28.2]], [[275, -32], [283, -29.2], [291, -27.4]], [[277, -30.4], [284, -28.2]]], "#16130a", 0.16, 0.26);
    ki += linien(T, [[[276.2, -33.7], [284.2, -30.3], [292.2, -28.5]], [[275.2, -32.3], [283.2, -29.5], [291.2, -27.7]]], "#efe6c6", 0.14, 0.2);
  }
  ki += fleck(T, "d", 292.4, -23.8, 1.6, 1.1, 0, 0.55);
  k += teil(T, ko, "#58553a", { innen: ki, rw: 0.3, randA: 0.55, kante: [ko.slice(0, 17)] });
  /* Maulspalte: dunkle Linie zwischen den Kiefern */
  k += linien(T, [[[256.6, -25.2], [260, -23.8], [264, -23], [270, -22.6], [276, -22.3], [282, -21.9], [286.4, -21.8], [289.2, -22.6], [291.4, -23.6], [293.4, -23.6], [295.6, -22.6], [298, -22.2], [300.2, -22.3]]], "#0b0904", 0.45, 0.85);
  /* obere Zähne: außen über den Unterkiefer; größter am Oberkiefer-Buckel */
  const okZ = [[299.4, -22.5, 1.2, 0.6, -0.05], [297.4, -22, 1.6, 0.74, -0.06], [295.2, -22.4, 1.3, 0.66, -0.04], [289, -22.5, 1.5, 0.7, -0.04], [286.8, -21.8, 2.7, 1, -0.07], [284.2, -21.6, 2.1, 0.86, -0.05],
    [281.4, -21.7, 1.7, 0.76, -0.04], [278.6, -21.9, 1.6, 0.74, -0.04], [275.8, -22.1, 1.8, 0.76, -0.04], [273, -22.2, 1.7, 0.74, -0.04], [270.2, -22.4, 1.55, 0.7, -0.04], [267.4, -22.6, 1.4, 0.66, -0.03], [264.6, -22.8, 1.25, 0.62, -0.03], [262, -23.1, 1.05, 0.56, -0.03], [259.6, -23.6, 0.85, 0.48, -0.02]];
  k += zaehne(T, F ? okZ : okZ.filter((_, i) => i % 2 === 0), 1, { n: "o", spitze: "#faf6ea", mitte: "#efe8d2", basis: "#c8b48c", rw: 0.1 });
  /* untere Zähne: außen am Oberkiefer hoch; der große 4. greift in die Kerbe */
  const ukZ = [[298.6, -22.3, 1.3, 0.66, 0.05], [296.2, -22.5, 1.1, 0.6, 0.02], [294.6, -22.9, 1.1, 0.6, 0], [292.4, -23.4, 3.3, 1.12, -0.08], [288, -22.2, 1.1, 0.58, 0], [285.4, -21.9, 1.25, 0.62, 0],
    [282.8, -21.9, 1.4, 0.66, 0], [280, -22, 1.55, 0.68, 0], [277.2, -22.2, 1.5, 0.68, 0], [274.4, -22.3, 1.45, 0.66, 0], [271.6, -22.5, 1.35, 0.64, 0], [268.8, -22.6, 1.25, 0.62, 0], [266, -22.8, 1.15, 0.58, 0], [263.3, -23, 1.05, 0.54, 0], [260.8, -23.5, 0.85, 0.48, 0]];
  k += zaehne(T, F ? ukZ : ukZ.filter((_, i) => i % 2 === 1 || i === 3), -1, { n: "u", spitze: "#faf6ea", mitte: "#efe8d2", basis: "#c8b48c", rw: 0.1 });
  /* Nackenschild: Hinterhauptschilde + große gekielte Nackenplatten */
  let nk = "";
  for (const [x, y, w, hh] of [[251, -35.1, 2.2, 0.9], [244, -34.6, 3.4, 2], [239.2, -34, 3, 1.7]]) nk += `M${R(x - w / 2)} ${R(y + 0.5)}Q${R(x - w * 0.15)} ${R(y - hh * 1.6)} ${R(x + w / 2)} ${R(y + 0.5)}Z`;
  k += `<path d="${nk}" fill="#4c4a32" stroke="#12110a" stroke-width=".22" stroke-opacity=".6"/>`;
  if (F) k += linien(T, [[[243, -34.9], [244, -36.3]], [[238.4, -34.3], [239, -35.5]], [[250.4, -34.9], [250.8, -35.5]]], "#efe6c6", 0.26, 0.45);
  /* Auge: erhöht, schweres Oberlid, Schlitzpupille, Nickhaut halb vorgezogen */
  k += fleck(T, "d", 268.2, -35, 2.6, 1.9, -5, 0.5);
  k += reptilAuge(T, 268.4, -35.2, 1.4, { iris: "#d4bf4a", iris2: "#5e5a1d", offen: 0.62, winkel: -6, nick: 0.28, netzFarbe: "#3d370e" });
  k += `<path d="M265 -36.3Q268.4 -38.6 272.2 -36.5Q268.6 -37.2 265 -36.3Z" fill="#4a4831" stroke="#12110a" stroke-width=".15" stroke-opacity=".6"/>`;
  if (F) k += linien(T, [[[265.4, -36.9], [268.4, -38.1], [271.6, -37.1]]], "#efe6c6", 0.2, 0.5);
  /* Ohrschlitz mit Ohrklappe hinter dem Auge */
  k += `<path d="M257.6 -33.6Q260.4 -34.3 263 -33.9Q260.4 -33.1 257.6 -33.6Z" fill="#14120a" opacity=".7"/>` + linien(T, [[[257.4, -34], [260.2, -34.9], [263.2, -34.4]]], "#ebe2c0", 0.24, 0.35);
  /* Nasenscheibe mit Nasenloch */
  k += `<path d="M296.6 -27.6Q297.8 -28.5 299 -27.6Q297.8 -27.2 296.6 -27.6Z" fill="#0f0d07"/>` + (F ? linien(T, [[[296.2, -28], [297.8, -28.8], [299.4, -28]]], "#f4ead0", 0.15, 0.55) : "");
  h += `<g transform="translate(0 2)">${k}</g>`;
  return fertig(1.5, h, [0, -36.6, 301, 0]);
}

module.exports = [
  { id: "krokodil", de: "das Krokodil", syl: "Kro-ko-DIL", it: "il coccodrillo", itSyl: "coc-co-DRIL-lo", en: "crocodile",
    gruppe: "Reptilien", lebensraum: "Fluss", laenge: 4.5, hoehe: 0.55, zeichne: krokodil },
];
