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
const mehr = (T, arr) => arr.map((p) => (T.fein ? T.glatt(p, false) : "M" + p.map((q) => R(q[0]) + " " + R(q[1])).join("L"))).join("");
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
  if (!T.fein) s = s < 0.7 ? 0.4 : 1.2;             // Szene: nur zwei Stärken (weniger Filter)
  n = String(s).replace(".", "_");                 // gleiche Stärke → derselbe Filter (spart Bytes)
  const id = T.id("bl" + n);
  if (!T["_bl" + n]) { T["_bl" + n] = 1; T.def(`<filter id="${id}" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${s}"/></filter>`); }
  return `url(#${id})`;
};
/* Volumen je Körperteil wie T.volumen (kern.js, ANLEITUNG Punkt 13: Silhouette weich geblurrt und von links oben
   beleuchtet), aber das Licht wird danach leicht geglättet (≈ weich/3) – sonst zeigen große, flache Teile
   (Krokodilbauch) sichtbare Stufenringe (8-Bit-Normalen). o: { weich, tiefe, umgebung, hoehe, glatt } */
const rund = (T, n, o = {}) => {
  if (!T.fein) return "none";
  const w = o.weich || 6, el = o.hoehe || 50, amb = o.umgebung != null ? o.umgebung : 0.32;
  const id = T.id("rd" + n + "_" + String(w).replace(".", "_"));
  if (!T["_" + id]) {
    T["_" + id] = 1;
    T.def(`<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">` +
      `<feGaussianBlur in="SourceAlpha" stdDeviation="${w}" result="b"/>` +
      `<feDiffuseLighting in="b" surfaceScale="${o.tiefe || 4}" diffuseConstant="1" lighting-color="#fff" result="d0"><feDistantLight azimuth="225" elevation="${el}"/></feDiffuseLighting>` +
      `<feGaussianBlur in="d0" stdDeviation="${R2(o.glatt || Math.max(0.2, w / 3))}" result="d"/>` +
      `<feComposite in="d" in2="SourceGraphic" operator="arithmetic" k1="${Math.round((1 - amb) / Math.sin(el * Math.PI / 180) * 1e4) / 1e4}" k2="0" k3="${amb}" k4="0" result="m"/>` +
      `<feComposite in="m" in2="SourceGraphic" operator="in"/></filter>`);
  }
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
/* Platten mit eigenem Verlauf (objectBoundingBox): jede Schuppe ein kurzer Pfad in einer Gruppe, die Füllung und Rundung
   erbt – so bekommt jede Platte ihr eigenes Licht (oben hell, Kiel mit Grat, unten Schatten). ts/vs wie kacheln.
   o: { grad: (j) → Verlauf-URL je Zeile, jit, fuge, sw (Rundung) } */
const plattenG = (T, Rr, ts, vs, o = {}) => {
  const gruppen = {};
  let linsen = null;
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
      const sv = o.var ? 1 + (T.rnd() - 0.5) * o.var * 4 : 1, dt = a1 - a0, f = (o.fuge || 0.09) * sv, fv = (o.fugeV || f * 1.2) * sv, ta = a0 + dt * f, tb = a1 - dt * f * 0.7, va = v0 + dv * fv, vb = v1 - dv * fv * 0.8;
      const A = Rr.P(ta, va), B = Rr.P(tb, va), C = Rr.P(tb, vb), D = Rr.P(ta, vb);
      const g = o.grad(j, T.rnd());
      if (o.oval) (gruppen[g] = gruppen[g] || []).push(`<ellipse cx="${R((A[0] + C[0]) / 2 - ox)}" cy="${R((A[1] + C[1]) / 2 - oy)}" rx="${R(Math.abs(B[0] - A[0]) * 0.56)}" ry="${R(Math.abs(D[1] - A[1]) * 0.56)}"/>`);
      else (gruppen[g] = gruppen[g] || []).push(`<path d="M${R(A[0] - ox)} ${R(A[1] - oy)}${rel(A, B)}${rel(B, C)}${rel(C, D)}z"/>`);
      /* Kiel: kurzer Grat in der oberen Plattenhälfte (Licht oben, Schatten darunter) */
      if (o.linse && o.linse.includes(j) && T.fein) {
        /* Längskiel als erhabene Linse: Lichtkante oben, Schattenseite unten (Verlauf je Linse) */
        const vm = va + (vb - va) * 0.45, k0 = Rr.P(ta + dt * 0.16, vm), k1 = Rr.P(tb - dt * 0.12, vm), hk = Math.abs(Rr.P(ta, vb)[1] - Rr.P(ta, va)[1]) * (o.linseH || 0.32);
        (linsen = linsen || []).push(`<path d="M${R(k0[0] - ox)} ${R(k0[1] - oy)}q${R((k1[0] - k0[0]) / 2)} ${R((k1[1] - k0[1]) / 2 - hk)} ${R(k1[0] - k0[0])} ${R(k1[1] - k0[1])}q${R(-(k1[0] - k0[0]) / 2)} ${R(-(k1[1] - k0[1]) / 2 + hk)} ${R(k0[0] - k1[0])} ${R(k0[1] - k1[1])}z"/>`);
      }
      if (o.kiel && o.kiel.includes(j) && T.fein && o.kielStrich !== false) {
        const vm = va + (vb - va) * 0.42, k0 = Rr.P(ta + dt * (0.22 + T.rnd() * 0.08), vm), k1 = Rr.P(tb - dt * (0.12 + T.rnd() * 0.08), vm - dv * 0.04);
        kL += `M${R(k0[0] - ox)} ${R(k0[1] - oy)}${rel(k0, k1)}`;
        kS += `M${R(k0[0] - ox + 0.1)} ${R(k0[1] - oy + (o.kw || 0.4) * 0.8)}${rel(k0, k1)}`;
      }
    }
  }
  const kG = linsen ? T.lg("kielL", [[0, "#fff6d8", 0.42], [0.45, "#fff6d8", 0.08], [0.55, "#000", 0.12], [1, "#000", 0.4]]) : "";
  return `<g transform="translate(${ox} ${oy})">` + Object.entries(gruppen).map(([g, l]) => `<g fill="${g}" stroke="${g}" stroke-width="${o.sw || 0.5}" stroke-linejoin="round">${l.join("")}</g>`).join("") +
    (linsen ? `<g fill="${kG}">${linsen.join("")}</g>` : "") +
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
/* Vieleck-Schuppenmuster (feine Schnauzen-/Kopfschuppen, Bauchkörner): leicht verzogenes Sechseck-Netz als Kachel,
   dunkle Fuge mit heller Kante daneben – wenige Bytes. g = Schuppengröße, o: { rot, op, opL, w } */
const musterNetz = (T, n, g, o = {}) => {
  const id = T.id("mn" + n);
  if (!T["_mn" + n]) {
    T["_mn" + n] = 1;
    const W = g * 1.5 * 2, H = g * 0.866 * 2;
    /* zwei Reihen Sechsecke je Kachel, Ecken leicht verzogen (bleibt kachelbar, weil nur innere Punkte wackeln) */
    const hx = (cx, cy) => { let d = ""; for (let i = 0; i <= 6; i++) { const a = i / 6 * Math.PI * 2, j = i % 6 === 0 || i === 3 ? 0 : (T.rnd() - 0.5) * g * 0.18; d += (i ? "L" : "M") + R2(cx + Math.cos(a) * (g + j)) + " " + R2(cy + Math.sin(a) * (g * 0.98 + j)); } return d; };
    const d = hx(0, 0) + hx(W / 2, H / 2) + hx(W, 0) + hx(0, H) + hx(W, H);
    T.def(`<pattern id="${id}" width="${R2(W)}" height="${R2(H)}" patternUnits="userSpaceOnUse"${o.rot ? ` patternTransform="rotate(${o.rot})"` : ""}>` +
      `<path d="${d}" fill="none" stroke="${o.hell || "#f4ecd0"}" stroke-width="${R2(g * (o.w || 0.09))}" stroke-opacity="${o.opL || 0.14}" transform="translate(${R2(g * 0.08)} ${R2(g * 0.1)})"/>` +
      `<path d="${d}" fill="none" stroke="${o.dunkel || "#100d06"}" stroke-width="${R2(g * (o.w || 0.09))}" stroke-opacity="${o.op || 0.22}"/></pattern>`);
  }
  return `url(#${id})`;
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
  const q = (P0, C, P1) => `q${R(C[0] - P0[0])} ${R(C[1] - P0[1])} ${R(P1[0] - P0[0])} ${R(P1[1] - P0[1])}`;
  for (const [x, y, L, b, k = 0] of liste) {
    const tx = x + k * L, ty = y + dir * L, A = [x - b / 2, y], S = [tx, ty], E = [x + b / 2, y];
    d += `M${R(A[0])} ${R(A[1])}${q(A, [x - b * 0.45 + k * L * 0.4, y + dir * L * 0.62], S)}${q(S, [x + b * 0.5 + k * L * 0.5, y + dir * L * 0.45], E)}z`;
    if (T.fein) {
      const g0 = [x - b * 0.18, y + dir * L * 0.15];
      gl += `M${R(g0[0])} ${R(g0[1])}${q(g0, [x - b * 0.2 + k * L * 0.4, y + dir * L * 0.55], [tx - b * 0.08, ty - dir * L * 0.12])}`;
    }
  }
  const g = T.lg("zahn" + dir + (o.n || ""), [[0, dir > 0 ? (o.basis || "#b7a072") : (o.spitze || "#f1e9d2")], [0.45, o.mitte || "#e2d6b4"], [1, dir > 0 ? (o.spitze || "#f1e9d2") : (o.basis || "#b7a072")]]);
  return `<path d="${d}" fill="${g}" stroke="#3a3020" stroke-width="${o.rw || 0.06}" stroke-opacity=".75"/>` +
    (sch ? `<path d="${sch}" fill="none" stroke="#6a5a3a" stroke-opacity=".45" stroke-width="${o.gw || 0.12}" stroke-linecap="round"/>` : "") +
    (gl ? `<path d="${gl}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="${o.gw || 0.1}" stroke-linecap="round"/>` : "");
};
/* Bein aus EINER durchgehenden Silhouette (keine Glied-Nähte/„Manschetten“): kette = [[x, y, Breite], …] von der
   Schulter/Hüfte bis zum Fußende; die Gelenke zeigen sich nur als Beugefalten. Füllung als userSpace-Verlauf (Licht oben
   links, Kernschatten unten rechts), Schuppenmuster durchgehend. Zehen/Finger einzeln: ziffern = [[x, y, Länge, Winkel°,
   Breite, Kralle?], …]; schwimm = Vieleck (Schwimmhaut, halbtransparent). o: { n, farben, muster, maske [y0, y1], falten,
   ferse: [x, y, rx, ry], krallenFarbe } */
const gliedBein = (T, o) => {
  const F = T.fein, [hell, mittel, dunkel] = o.farben, K = o.kette;
  const L = [], Rt = [];
  for (let i = 0; i < K.length; i++) {
    const p = K[i], a = K[Math.max(0, i - 1)], b = K[Math.min(K.length - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const n = Math.hypot(dx, dy) || 1; dx /= n; dy /= n;
    L.push([p[0] + dy * p[2] / 2, p[1] - dx * p[2] / 2]); Rt.push([p[0] - dy * p[2] / 2, p[1] + dx * p[2] / 2]);
  }
  const e = K[K.length - 1], umr = L.concat([[e[0] + e[2] * 0.35, e[1]]], Rt.reverse());
  const xs = umr.map((p) => p[0]), ys = umr.map((p) => p[1]), bx0 = Math.min(...xs), by0 = Math.min(...ys), bx1 = Math.max(...xs), by1 = Math.max(...ys);
  const gid = T.id("gb" + o.n);
  if (!T["_" + gid]) { T["_" + gid] = 1; T.def(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${R(bx0)}" y1="${R(by0)}" x2="${R(bx0 + (by1 - by0) * 0.35)}" y2="${R(by1)}"><stop offset="0" stop-color="${hell}"/><stop offset=".5" stop-color="${mittel}"/><stop offset="1" stop-color="${dunkel}"/></linearGradient>`); }
  /* Kernschatten an der Hinterkante, Licht an der Vorderkante (zylindrisch) */
  let inn = "";
  if (o.muster) inn += `<rect x="${R(bx0 - 1)}" y="${R(by0 - 1)}" width="${R(bx1 - bx0 + 2)}" height="${R(by1 - by0 + 2)}" fill="${o.muster}"/>`;
  if (F) inn += `<path d="${T.glatt(Rt.slice().reverse(), false)}" fill="none" stroke="#000" stroke-width="${R(K[1][2] * 0.5)}" stroke-opacity=".22" filter="${weich(T, "gbs", 0.8)}"/>` +
    `<path d="${T.glatt(L, false)}" fill="none" stroke="#fff" stroke-width="${R(K[1][2] * 0.3)}" stroke-opacity=".12" filter="${weich(T, "gbs", 0.8)}"/>`;
  if (o.innen) inn += o.innen;
  let s = "";
  if (o.schwimm) s += form(T, o.schwimm, dunkel, ' opacity=".55"');
  let bein = teil(T, umr, `url(#${gid})`, { innen: inn, rand: false });
  if (o.ferse) bein += `<ellipse cx="${o.ferse[0]}" cy="${o.ferse[1]}" rx="${o.ferse[2]}" ry="${o.ferse[3]}" fill="url(#${gid})"/>`;
  if (o.maske) {
    const id = T.id("gm" + o.n);
    T.def(`<linearGradient id="${id}g" gradientUnits="userSpaceOnUse" x1="0" y1="${o.maske[0]}" x2="0" y2="${o.maske[1]}"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>` +
      `<mask id="${id}" maskUnits="userSpaceOnUse" x="${R(bx0 - 4)}" y="${R(by0 - 4)}" width="${R(bx1 - bx0 + 8)}" height="${R(by1 - by0 + 8)}"><rect x="${R(bx0 - 4)}" y="${R(by0 - 4)}" width="${R(bx1 - bx0 + 8)}" height="${R(by1 - by0 + 8)}" fill="url(#${id}g)"/></mask>`);
    bein = `<g mask="url(#${id})">${bein}</g>`;
  }
  s += bein;
  if (o.falten) s += linien(T, o.falten, "#0d0c07", o.fw || 0.22, 0.32);
  /* Zehen/Finger einzeln: verjüngte Glieder mit Oberlicht, Gelenkfalten, Krallen */
  if (o.ziffern) {
    let d = "", dQ = "", dL = "";
    const kr = [];
    for (const [x, y, l, w, b, kl] of o.ziffern) {
      const a = w * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a), P = (u, v) => [x + c * u - sn * v, y + sn * u + c * v];
      const Q = (u, v) => { const q = P(u, v); return R(q[0]) + " " + R(q[1]); };
      d += `M${Q(0, -b / 2)}Q${Q(l * 0.8, -b * 0.56)} ${Q(l, 0)}Q${Q(l * 0.8, b * 0.56)} ${Q(0, b / 2)}Z`;
      if (F) { for (const u of [0.38, 0.7]) { const q0 = P(l * u, -b * 0.4), q1 = P(l * u + b * 0.12, b * 0.1); dQ += `M${R(q0[0])} ${R(q0[1])}L${R(q1[0])} ${R(q1[1])}`; } const l0 = P(l * 0.1, -b * 0.22), l1 = P(l * 0.82, -b * 0.14); dL += `M${R(l0[0])} ${R(l0[1])}L${R(l1[0])} ${R(l1[1])}`; }
      if (kl) { const t = P(l * 0.96, 0); kr.push([t[0], t[1], b * 1.25, b * 0.42, w + 12, 0.45]); }
    }
    s += `<path d="${d}" fill="url(#${gid})" stroke="${dunkel}" stroke-width=".18" stroke-opacity=".7"/>` + (dL ? `<path d="${dL}" stroke="${hell}" stroke-width=".22" stroke-opacity=".5" stroke-linecap="round"/><path d="${dQ}" stroke="#0d0c07" stroke-width=".12" stroke-opacity=".45"/>` : "");
    if (kr.length) s += krallen(T, kr, o.krallenFarbe || "#2a2418");
  }
  return s;
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
  if (o.falten) s += linien(T, o.falten, "#0d0c07", o.fw || 0.22, 0.28) + (T.fein && o.faltenLicht !== false ? linien(T, o.falten.map((p) => p.map(([x, y]) => [x - 0.15, y - 0.2])), hell, (o.fw || 0.22) * 0.7, 0.3) : "");
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
/* Schlangenschuppen-Muster: glatte, glänzende, dachziegelartige Rautenschuppen in Schrägreihen (eine Kachel = 2 Schuppen).
   g = Schuppenbreite, o: { rot, hell, dunkel, rand } */
const musterRauten = (T, n, g, o = {}) => {
  const id = T.id("mr" + n);
  if (!T["_mr" + n]) {
    T["_mr" + n] = 1;
    const W = g, H = g * (o.hoch || 0.9), gr = T.lg("mrg" + n, [[0, "#fff", o.hell != null ? o.hell : 0.22], [0.5, "#fff", 0.02], [1, "#000", o.dunkel != null ? o.dunkel : 0.22]], 0, 0, 0.3, 1);
    /* Raute mit runder Spitze hinten (Schuppen überlappen nach hinten) */
    const sch = (cx, cy) => `M${R2(cx - W * 0.5)} ${R2(cy)}Q${R2(cx - W * 0.1)} ${R2(cy - H * 0.52)} ${R2(cx + W * 0.42)} ${R2(cy - H * 0.06)}Q${R2(cx + W * 0.1)} ${R2(cy + H * 0.5)} ${R2(cx - W * 0.5)} ${R2(cy)}Z`;
    const d = sch(W * 0.5, H * 0.5) + sch(W, H) + sch(0, H) + sch(W, 0) + sch(0, 0);
    T.def(`<pattern id="${id}" width="${R2(W)}" height="${R2(H)}" patternUnits="userSpaceOnUse"${o.rot ? ` patternTransform="rotate(${o.rot})"` : ""}>` +
      `<rect width="${R2(W)}" height="${R2(H)}" fill="#000" fill-opacity="${o.rand != null ? o.rand : 0.2}"/><path d="${d}" fill="${gr}" stroke="#000" stroke-opacity=".12" stroke-width="${R2(g * 0.04)}"/></pattern>`);
  }
  return `url(#${id})`;
};
/* Schlangenkörper als Rohr: sp = [[x, y, r], …] (Radius r); o: { farbe, bauch (Farbe), bauchSeite (+1 | −1: Seite des Bauches
   in v), licht (+1 | −1: beleuchtete Seite in v), muster (URL), innen, binden: [[t, breite], …], schuppen: Bauchschilde } */
const schlangenRohr = (T, sp, o = {}) => {
  const Rr = rohr(sp.map(([x, y, r]) => [x, y, r, r]), 6);
  const L = o.licht || -1, B = o.bauchSeite || 1;
  const umr = Rr.zug(-1, 0, 1, o.n || 16).concat(Rr.zug(1, 0, 1, o.n || 16).reverse());
  let inn = "";
  /* Bauchschilde (hell) auf der Bauchseite */
  if (o.bauch) inn += `<g filter="${weich(T, "sb", 0.5)}">` + form(T, poly(Rr.band(B * 0.62, B * 1.3, 0, 1, 12)), o.bauch) + "</g>";
  /* Querbinden umlaufen den Körper als Ring: in der Mitte nach vorn gewölbt (Ellipsenkrümmung), Ränder unscharf */
  if (o.binden) inn += `<path d="${o.binden.map(([t, w]) => { const b = w * (o.bindenBogen || 1.1); return pfad(T, [Rr.P(t - w, -1.25), Rr.P(t + w, -1.25), Rr.P(t + w + b, 0), Rr.P(t + w, 1.25), Rr.P(t - w, 1.25), Rr.P(t - w + b, 0)]); }).join("")}" fill="${o.bindenFarbe || "#2a1e10"}" opacity="${o.bindenOp || 0.35}" filter="${weich(T, "bi", 0.9)}"/>`;
  if (o.muster) inn += `<path d="${pfad(T, umr)}" fill="${o.muster}"/>`;
  if (o.innen) inn += o.innen(Rr);
  /* Licht: Glanzband auf der Lichtseite, Kernschatten, Reflex auf der Schattenseite */
  const kS = o.kern != null ? o.kern : 0.46;
  inn += `<g filter="${weich(T, "sl", o.weich || 0.9)}">` + form(T, poly(Rr.band(L * 1.2, L * 0.5, 0, 1, 12)), "#fff", ` opacity="${o.glanz || 0.24}"`) +
    form(T, poly(Rr.band(L * 0.1, -L * 0.3, 0, 1, 12)), "#000", ` opacity="${R2(kS * 0.26)}"`) +
    form(T, poly(Rr.band(-L * 0.25, -L * 0.88, 0, 1, 12)), "#000", ` opacity="${kS}"`) + form(T, poly(Rr.band(-L * 0.9, -L * 1.1, 0, 1, 12)), "#fff", ' opacity=".12"') + "</g>";
  /* seidiges Glanzband, das in einzelne Schuppenlichter zerfällt (fein) */
  if (T.fein && o.glanzband) { let d = ""; const n = Math.round(Rr.len / (o.glanzband || 2)); for (let i = 0; i < n; i++) { const t = (i + T.rnd() * 0.6) / n, v = L * (0.5 + T.rnd() * 0.18); if (T.rnd() < 0.25) continue; const [x, y] = Rr.P(t, v), [x2, y2] = Rr.P(t + 0.35 / n, v - L * 0.04); d += `M${R(x)} ${R(y)}L${R(x2)} ${R(y2)}`; } inn += `<path d="${d}" stroke="#fff8e8" stroke-width="${o.glanzW || 0.5}" stroke-opacity="${o.glanzOp || 0.3}" stroke-linecap="round" filter="${weich(T, "gb", 0.15)}"/>`; }
  /* glänzender Lichtstreif (Glanz glatter Schuppen) */
  if (T.fein && o.streif !== false) inn += linien(T, [Rr.zug(L * 0.55, o.s0 || 0.04, o.s1 || 0.96, 10)], "#fffaf0", o.streifW || 0.5, o.streifOp || 0.42).replace("/>", ` stroke-dasharray="${o.strich || "14 3 6 5 22 4 9 6"}"/>`);
  /* Bauchschilde: Querfugen */
  if (T.fein && o.schilde) { let d = ""; for (let t = 0.02; t < 0.99; t += o.schilde) { const a = Rr.P(t, B * 0.62), b = Rr.P(t, B * 1.05); d += `M${R(a[0])} ${R(a[1])}L${R(b[0])} ${R(b[1])}`; } inn += `<path d="${d}" stroke="#3a2a14" stroke-width=".16" stroke-opacity=".25"/>`; }
  /* o.offen: nur die beiden Längskanten zeichnen (Teilstücke einer Windung ohne sichtbare Schnittkanten) */
  const rk = o.offen ? { kante: [Rr.zug(-1, 0, 1, o.n || 16), Rr.zug(1, 0, 1, o.n || 16)] } : {};
  return { svg: teil(T, umr, o.farbe, Object.assign({ innen: inn, rand: o.rand || "#1a1008", randA: o.randA != null ? o.randA : 0.3, rw: o.rw || 0.3 }, rk)), Rr };
};
/* Echsenkörper (Rumpf + Schwanz) als Rohr mit Farbzonen quer zum Körper, Muster, Schuppen und Licht von links oben.
   sp: [[x, y, hOben, hUnten], …] vom Schwanzende zum Hals. o: { zonen: [[v0, v1, Farbe, Deckkraft, t0, t1], …], basis,
   muster: (Rr, tx) → svg, licht: Deckkraft, schatten, rand, ringe: { ts, vs, … } (Schwanzwirtel) } */
const echsenKoerper = (T, sp, o = {}) => {
  const Rr = rohr(sp, 5);
  const tx = (x) => { let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (Rr.P(m, 0)[0] < x) lo = m; else hi = m; } return (lo + hi) / 2; };
  const umr = Rr.zug(-1, 0, 1, o.n || 20).concat(Rr.zug(1, 0, 1, o.n || 20).reverse());
  let inn = `<g filter="${weich(T, "ez" + (o.id || ""), o.blur || 0.8)}">` + o.zonen.map(([v0, v1, f, op, t0 = 0, t1 = 1]) => form(T, poly(Rr.band(v0, v1, t0, t1, 10)), f, op != null && op < 1 ? ` opacity="${op}"` : "")).join("") + "</g>";
  if (o.muster) inn += o.muster(Rr, tx);
  inn += `<g filter="${weich(T, "el" + (o.id || ""), o.blurL || 0.8)}">` + form(T, poly(Rr.band(-1.15, -0.6, 0.02, 0.99, 10)), "#fff", ` opacity="${o.licht || 0.16}"`) +
    form(T, poly(Rr.band(0.3, 0.85, 0.02, 0.99, 10)), "#000", ` opacity="${o.schatten || 0.32}"`) + form(T, poly(Rr.band(0.88, 1.12, 0.3, 0.99, 8)), "#fff", ' opacity=".14"') + "</g>";
  if (o.nachLicht) inn += o.nachLicht(Rr, tx);
  return { svg: teil(T, umr, o.basis, { innen: inn, rand: o.rand || "#14100a", randA: o.randA != null ? o.randA : 0.3, rw: o.rw || 0.3 }), Rr, tx };
};
/* Reptilienauge (eigene Zeichnung, ohne Säugetier-Lidfalte): Augenhöhle, Augapfel mit Iris (Fasern + Netz + dunkler
   Rand), Pupille, Schatten von Lid/Brauenwulst auf dem oberen Drittel, nasser Glanzpunkt oben links, Lidränder aus
   Körnerschuppen (bei Schlangen keine Lider: kreisrund unter der glasigen Brillenschuppe).
   o: { iris, iris2, pupille: "schlitz"|"rund", offen (0–1, Lidspalte), schlange, nick (Nickhaut 0–1), haut, winkel,
        netz (Farbe), wulst (Brauenwulst-Farbe) } */
const echsAuge = (T, x, y, r, o = {}) => {
  const F = T.fein, id = T.id("ea" + (T._n = (T._n || 0) + 1));
  const W = r * (o.schlange ? 1 : 1.3), off = o.schlange ? 1 : (o.offen || 0.62), Ho = r * off, Hu = r * off * 0.8;
  const spalt = o.schlange ? `M${R2(-r)} 0a${R2(r)} ${R2(r)} 0 1 0 ${R2(2 * r)} 0a${R2(r)} ${R2(r)} 0 1 0 ${R2(-2 * r)} 0Z`
    : `M${R2(-W)} ${R2(Ho * 0.1)}C${R2(-W * 0.55)} ${R2(-Ho * 1.12)} ${R2(W * 0.5)} ${R2(-Ho * 1.15)} ${R2(W)} ${R2(-Ho * 0.05)}C${R2(W * 0.5)} ${R2(Hu * 1.15)} ${R2(-W * 0.5)} ${R2(Hu * 1.15)} ${R2(-W)} ${R2(Ho * 0.1)}Z`;
  T.def(`<clipPath id="${id}"><path d="${spalt}"/></clipPath>`);
  const gI = T.rg("ei" + (o.iris || "").slice(1) + (o.iris2 || "").slice(1), [[0, mische(o.iris, 0.25)], [0.45, o.iris], [0.82, o.iris2], [1, mische(o.iris2, -0.5)]], 0.42, 0.42, 0.6);
  let s = `<g transform="translate(${R2(x)} ${R2(y)}) rotate(${R2(o.winkel || 0)})">`;
  /* Augenhöhle: weiche dunkle Mulde um das Auge */
  s += `<ellipse cx="0" cy="${R2(r * 0.1)}" rx="${R2(W * 1.45)}" ry="${R2(r * 1.25)}" fill="${T.rg("ehoe", [[0, "#000", 0.45], [0.6, "#000", 0.2], [1, "#000", 0]])}"/>`;
  s += `<path d="${spalt}" fill="#0c0805"/><g clip-path="url(#${id})">`;
  const cx = o.schlange ? 0 : r * 0.08, ri = o.schlange ? r * 0.98 : r * 0.92;
  s += `<circle cx="${R2(cx)}" cy="0" r="${R2(ri)}" fill="${gI}"/>`;
  if (F) {
    let d = "";
    for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, a2 = a + (T.rnd() - 0.5) * 0.3, r0 = ri * 0.32, r1 = ri * (0.8 + T.rnd() * 0.15); d += `M${R2(cx + Math.cos(a) * r0)} ${R2(Math.sin(a) * r0)}Q${R2(cx + Math.cos(a2) * ri * 0.55 + (T.rnd() - 0.5) * ri * 0.15)} ${R2(Math.sin(a2) * ri * 0.55)} ${R2(cx + Math.cos(a2) * r1)} ${R2(Math.sin(a2) * r1)}`; }
    s += `<path d="${d}" fill="none" stroke="${o.netz || mische(o.iris2, -0.3)}" stroke-width="${R2(ri * 0.045)}" stroke-opacity=".5"/>`;
    s += `<circle cx="${R2(cx)}" cy="0" r="${R2(ri * 0.62)}" fill="none" stroke="${mische(o.iris, 0.35)}" stroke-width="${R2(ri * 0.05)}" stroke-opacity=".35"/>`;
  }
  s += `<circle cx="${R2(cx)}" cy="0" r="${R2(ri * 0.96)}" fill="none" stroke="#0a0604" stroke-width="${R2(ri * 0.1)}" stroke-opacity=".7"/>`;
  if ((o.pupille || "schlitz") === "schlitz") s += `<path d="M${R2(cx)} ${R2(-ri * 0.86)}Q${R2(cx + ri * 0.17)} 0 ${R2(cx)} ${R2(ri * 0.86)}Q${R2(cx - ri * 0.17)} 0 ${R2(cx)} ${R2(-ri * 0.86)}Z" fill="#030202"/>`;
  else s += `<circle cx="${R2(cx + ri * 0.02)}" cy="0" r="${R2(ri * (o.pupR || 0.4))}" fill="#030202"/>`;
  /* Schatten von Oberlid/Brauenwulst auf dem oberen Drittel */
  s += `<rect x="${R2(-W)}" y="${R2(-r * 1.2)}" width="${R2(2 * W)}" height="${R2(r * 1.05)}" fill="${T.lg("eschat", [[0, "#000", 0.7], [0.6, "#000", 0.2], [1, "#000", 0]])}"/>`;
  /* Nickhaut von vorn (rechts) */
  if (o.nick) { const nx = W - 2 * W * o.nick; s += `<path d="M${R2(W * 1.1)} ${R2(-r * 1.2)}L${R2(nx + r * 0.15)} ${R2(-r * 1.2)}Q${R2(nx - r * 0.3)} 0 ${R2(nx + r * 0.1)} ${R2(r * 1.2)}L${R2(W * 1.1)} ${R2(r * 1.2)}Z" fill="${T.lg("nick2", [[0, "#e4ebe4", 0.25], [0.5, "#c9d2c8", 0.5], [1, "#a8b2a6", 0.65]], 0, 0, 1, 0)}"/>`; }
  /* nasser Glanz: Hauptlicht oben links, schwacher Gegenglanz unten rechts; Schlange: große weiche Brillenreflexion */
  if (o.schlange) s += `<ellipse cx="${R2(-r * 0.32)}" cy="${R2(-r * 0.38)}" rx="${R2(r * 0.42)}" ry="${R2(r * 0.3)}" fill="#fff" opacity=".35" transform="rotate(-30 ${R2(-r * 0.32)} ${R2(-r * 0.38)})"/>`;
  s += `<ellipse cx="${R2(-r * 0.22)}" cy="${R2(-r * 0.32)}" rx="${R2(r * 0.17)}" ry="${R2(r * 0.12)}" fill="#fff" opacity=".92"/><ellipse cx="${R2(r * 0.42)}" cy="${R2(r * 0.42)}" rx="${R2(r * 0.12)}" ry="${R2(r * 0.07)}" fill="#fff" opacity=".35"/>`;
  s += `</g>`;
  if (o.schlange) {
    /* Augenschilde-Ring (Supra-, Prä-, Postocularia): feine Fuge mit Lichtkante */
    s += `<circle cx="0" cy="0" r="${R2(r * 1.06)}" fill="none" stroke="#120a05" stroke-width="${R2(r * 0.1)}" stroke-opacity=".7"/>`;
    s += `<path d="M${R2(-r * 1.2)} ${R2(-r * 0.6)}A${R2(r * 1.25)} ${R2(r * 1.25)} 0 0 1 ${R2(r * 1.15)} ${R2(-r * 0.7)}" fill="none" stroke="${o.haut || "#a07a46"}" stroke-width="${R2(r * 0.3)}"/>` +
      `<path d="M${R2(-r * 1.25)} ${R2(-r * 0.75)}A${R2(r * 1.35)} ${R2(r * 1.35)} 0 0 1 ${R2(r * 1.2)} ${R2(-r * 0.85)}" fill="none" stroke="#fff" stroke-width="${R2(r * 0.08)}" stroke-opacity=".35"/>`;
  } else {
    /* Lidränder aus Körnerschuppen: dunkler Rand, darauf helle Körner; Oberlid dicker */
    const ob = `M${R2(-W)} ${R2(Ho * 0.1)}C${R2(-W * 0.55)} ${R2(-Ho * 1.12)} ${R2(W * 0.5)} ${R2(-Ho * 1.15)} ${R2(W)} ${R2(-Ho * 0.05)}`;
    const ub = `M${R2(W)} ${R2(-Ho * 0.05)}C${R2(W * 0.5)} ${R2(Hu * 1.15)} ${R2(-W * 0.5)} ${R2(Hu * 1.15)} ${R2(-W)} ${R2(Ho * 0.1)}`;
    s += `<path d="${ob}" fill="none" stroke="${o.lid || "#2a2416"}" stroke-width="${R2(r * 0.28)}" stroke-linecap="round"/><path d="${ub}" fill="none" stroke="${o.lid || "#2a2416"}" stroke-width="${R2(r * 0.18)}" stroke-linecap="round"/>`;
    if (F) s += `<path d="${ob}" fill="none" stroke="${o.korn || "#d8cfa8"}" stroke-width="${R2(r * 0.12)}" stroke-opacity=".45" stroke-dasharray="${R2(r * 0.07)} ${R2(r * 0.14)}" transform="translate(0 ${R2(-r * 0.08)})"/><path d="${ub}" fill="none" stroke="${o.korn || "#d8cfa8"}" stroke-width="${R2(r * 0.09)}" stroke-opacity=".4" stroke-dasharray="${R2(r * 0.06)} ${R2(r * 0.12)}" transform="translate(0 ${R2(r * 0.06)})"/>`;
    /* feuchter Unterlidrand */
    s += `<path d="M${R2(W * 0.7)} ${R2(Hu * 0.62)}C${R2(W * 0.25)} ${R2(Hu * 0.95)} ${R2(-W * 0.35)} ${R2(Hu * 0.95)} ${R2(-W * 0.75)} ${R2(Hu * 0.5)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="${R2(r * 0.05)}"/>`;
    /* Brauen-/Lidwulst über dem Auge mit Lichtkante oben */
    if (o.wulst) s += `<path d="M${R2(-W * 1.25)} ${R2(-Ho * 0.6)}C${R2(-W * 0.6)} ${R2(-Ho * 1.9)} ${R2(W * 0.6)} ${R2(-Ho * 1.95)} ${R2(W * 1.25)} ${R2(-Ho * 0.7)}C${R2(W * 0.6)} ${R2(-Ho * 1.35)} ${R2(-W * 0.6)} ${R2(-Ho * 1.3)} ${R2(-W * 1.25)} ${R2(-Ho * 0.6)}Z" fill="${o.wulst}"/>` +
      `<path d="M${R2(-W * 1.15)} ${R2(-Ho * 0.85)}C${R2(-W * 0.6)} ${R2(-Ho * 1.85)} ${R2(W * 0.6)} ${R2(-Ho * 1.9)} ${R2(W * 1.15)} ${R2(-Ho * 0.85)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="${R2(r * 0.1)}"/>`;
  }
  return s + "</g>";
};
/* Lippenschilde: Reihe gewölbter Platten entlang einer Linie (Lippe), Höhe h nach oben (h > 0) oder unten (h < 0);
   jede Platte mit Lichtkante oben und Fuge; n Platten. o: { farbe, op } */
const lippen = (T, pts, n, h, o = {}) => {
  const P = polyl(pts);
  let dF = "", dL = "";
  for (let i = 0; i < n; i++) {
    const [x0, y0, nx, ny] = P.at(i / n), [x1, y1] = P.at((i + 1) / n), hh = h * (o.var ? 0.8 + T.rnd() * 0.4 : 1);
    dF += `M${R(x0)} ${R(y0)}l${R(nx * hh)} ${R(ny * hh)}`;
    if (T.fein) dL += `M${R(x0 + nx * hh * 0.85 + (x1 - x0) * 0.15)} ${R(y0 + ny * hh * 0.85)}l${R((x1 - x0) * 0.7)} ${R((y1 - y0) * 0.7)}`;
  }
  return `<path d="${dF}" stroke="${o.fuge || "#1a140a"}" stroke-width="${o.w || 0.12}" stroke-opacity="${o.op || 0.45}" stroke-linecap="round"/>` +
    (dL ? `<path d="${dL}" stroke="${o.licht || "#f4ecd0"}" stroke-width="${o.lw || o.w || 0.12}" stroke-opacity="${o.opL || 0.35}" stroke-linecap="round"/>` : "");
};
/* Schuppenreihen im Rohr: gewölbte ovale Schuppen in Längsreihen (folgen dem Körper), Größe je Reihe; jede mit eigenem
   Radialverlauf (Licht oben links). reihen: [[v, Breite (Einheiten), Höhe, Dichte], …], t0…t1 */
const schuppenReihen = (T, Rr, t0, t1, reihen, grads, o = {}) => {
  if (!T.fein) return "";
  const gr = {}, fl = o.flach || 0.66, kl = [];
  const ox = Math.round(Rr.P(t0, 0)[0]), oy = Math.round(Rr.P(t0, 0)[1]);
  for (const [v, b, , dichte = 1] of reihen) {
    const dt = b / Rr.len;
    for (let t = t0 + T.rnd() * dt; t < t1; t += dt * (0.95 + T.rnd() * 0.25)) {
      if (T.rnd() > dichte) continue;
      const [x, y] = Rr.P(t, v + (T.rnd() - 0.5) * 0.04), g = grads[Math.floor(T.rnd() * grads.length)];
      if (o.ohne && o.ohne.some((p) => T.inPoly(x, y, p))) continue;
      /* Kreis im gestauchten Raum = quer gestreckte Ellipse */
      const rr = b * (o.r || 0.47) * (0.92 + T.rnd() * 0.14);
      (gr[g] = gr[g] || []).push(`<circle cx="${R(x - ox)}" cy="${R((y - oy) / fl)}" r="${R(rr)}"/>`);
      if (o.kiel) kl.push(`<ellipse cx="${R(x - ox)}" cy="${R((y - oy) / fl - rr * 0.1)}" rx="${R(rr * 0.6)}" ry="${R(rr * 0.15)}"/>`);
    }
  }
  return `<g transform="translate(${ox} ${oy}) scale(1 ${fl})">` + Object.entries(gr).map(([g, l]) => `<g fill="${g}">${l.join("")}</g>`).join("") +
    (kl.length ? `<g fill="${T.lg("kielL", [[0, "#fff6d8", 0.42], [0.45, "#fff6d8", 0.08], [0.55, "#000", 0.12], [1, "#000", 0.4]])}">${kl.join("")}</g>` : "") + "</g>";
};
/* fertige Art: Zeichenraum → Zentimeter; fuesse (x der Fußmitten) und kopf (Ausschnitt) ebenfalls in Einheiten */
const fertig = (f, svg, box, fuesse, kopf) => {
  const z = { svg: `<g transform="scale(${f})">${svg}</g>`, box: box.map((v) => Math.round(v * f)) };
  if (fuesse) z.fuesse = fuesse.map((v) => Math.round(v * f));
  if (kopf) z.kopf = kopf.map((v) => Math.round(v * f));
  return z;
};

/* =====================================================================
   PANZERECHSEN (Krokodil und Alligator): gemeinsamer Bauplan für Rumpf, Panzer, Schwanz und Beine – aber jede Art mit
   EIGENER Silhouette, Haltung, Beinstellung, Kamm und Farbe (Kritiker R1/R2: „Krokodil und Alligator sind dieselbe
   Figur“). A: { sp (Wirbelsäule), tH/tS (x von Hüfte/Schulter), farben, kamm (Höhenfaktor), beine (Ketten, Ziffern),
   kopf (fertiger Kopf-SVG-String), binden (Deckkraft) }
   ===================================================================== */
function panzer(T, A) {
  const F = T.fein, US = ' gradientUnits="userSpaceOnUse"', C = A.farben;
  let h = "";
  const Rr = rohr(A.sp, 5);
  const tx = (x) => { let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (Rr.P(m, 0)[0] < x) lo = m; else hi = m; } return (lo + hi) / 2; };
  const tH = tx(A.tH), tS = tx(A.tS);
  const umriss = Rr.zug(-1, 0, 1, 18).concat(Rr.zug(1, 0, 1, 18).reverse());
  /* ---------- ferne Beine (Körperton −20 %, kühler), Zehen als einzelne Fächer ---------- */
  const mB = F ? musterNetz(T, "b", 0.7, { op: 0.22, opL: 0.14, rot: 15 }) : "";
  for (const b of A.beine.fern) h += `<g filter="${rund(T, "kb", { weich: 1.6, tiefe: 3.4 })}">` + gliedBein(T, Object.assign({ farben: C.fern, muster: mB, krallenFarbe: "#2a2418" }, b, { maske: null })) + "</g>";
  /* ---------- Rumpf: Farbzonen, Binden, Flecken (scharf, färben die Schuppen), Schuppenhierarchie ---------- */
  let inn = `<g filter="${weich(T, "z", 1.4)}">` + form(T, poly(Rr.band(-1.3, -0.42, 0, 1, 8)), C.ruecken) + form(T, poly(Rr.band(-0.12, 0.5, 0.1, 1, 8)), C.flanke, ' opacity=".8"') +
    form(T, poly(Rr.band(0.52, 1.3, 0.12, 1, 8)), C.bauch) + form(T, poly(Rr.band(0.3, 1.3, 0, 0.16, 4)), C.ruecken, ' opacity=".55"') + "</g>";
  if (A.zacken) {
    /* unregelmäßige Grenze dunkle Flanke / heller Bauch: Zungen der Flankenfarbe in wechselnder Breite */
    /* unregelmäßig: kurze Zungen wechselnder Breite, dazwischen abgerissene Flecken, die in die helle Seite auslaufen */
    let z = ""; for (let t = tH - 0.04; t < 0.99; t += 0.008 + T.rnd() * 0.022) { const w = 0.003 + T.rnd() * 0.009, l = 0.02 + T.rnd() * T.rnd() * 0.2, q = (T.rnd() - 0.5) * w;
      z += poly([Rr.P(t - w, 0.4), Rr.P(t + w, 0.4), Rr.P(t + w * 0.5 + q, 0.5 + l), Rr.P(t - w * 0.4 + q, 0.5 + l * 0.8)]);
      if (T.rnd() < 0.45) { const u = t + (T.rnd() - 0.5) * 0.01, v = 0.6 + l + T.rnd() * 0.12, rr = 0.002 + T.rnd() * 0.004; z += poly([Rr.P(u - rr, v), Rr.P(u + rr, v - 0.02), Rr.P(u + rr * 0.6, v + 0.05), Rr.P(u - rr * 0.8, v + 0.04)]); } }
    inn += `<path d="${z}" fill="${C.flanke}" opacity=".8" filter="${weich(T, "zg", 0.5)}"/>`;
  }
  let bd = "";
  for (const b of A.bindenT) { const w = 0.018 + b * 0.014, j = () => (T.rnd() - 0.5) * w * 0.35, vs = [-1.3, -0.8, -0.3, 0.2, 0.62]; bd += poly(vs.map((v) => Rr.P(b + w + j() + v * w * 0.25, v)).concat(vs.slice().reverse().map((v) => Rr.P(b + j() + v * w * 0.25, v)))); }
  if (A.flecken) for (let i = 0; i < (F ? 19 : 7); i++) { const t = tH - 0.02 + (tS + 0.06 - tH) * (i + T.rnd() * 0.8) / (F ? 19 : 7), v = -0.4 + T.rnd() * 0.62, [x, y] = Rr.P(t, v), r = 0.7 + T.rnd() * 1.1, Q = []; for (let k = 0; k < 6; k++) { const a = (k + T.rnd() * 0.5) / 6 * Math.PI * 2, rr = r * (0.5 + T.rnd() * 0.8); Q.push([x + Math.cos(a) * rr * 1.5, y + Math.sin(a) * rr * 0.9]); } bd += poly(Q); }
  const binden = `<path d="${bd}" fill="${C.binde}" opacity="${A.binden}" filter="${weich(T, "b", 0.2)}"/>`;
  const tsR = []; for (let i = 0; i <= 17; i++) tsR.push(tH + (tS - tH) * i / 17);
  const tsS = []; { let t = 0.014; while (t < tH - 0.01) { tsS.push(t); t += 0.0114 + t * 0.012; } tsS.push(tH); }
  /* Rückenpanzer: Reihen nach oben perspektivisch gestaucht; Schwanzringe zum Rand hin verkürzt (Zylinderwölbung) */
  const vR = [-1.03, -0.93, -0.8, -0.64, -0.44], vS = [-1.03, -0.9, -0.7, -0.42, -0.08, 0.28, 0.6, 0.84, 0.97, 1.04];
  const beinOhne = A.beinOhne;
  if (F) {
    const pK = plattenGrad(T, "k", false, 0.8), pK2 = plattenGrad(T, "k2", false, 1.05), pR = plattenGrad(T, "r", false, 0.45);
    const bF = T.rg("bfl", [[0, "#fff", 0.1], [0.6, "#fff", 0], [0.86, "#000", 0.05], [1, "#000", 0.16]], 0.4, 0.32, 0.7), bF2 = T.rg("bfl2", [[0, "#fff", 0.05], [0.6, "#fff", 0], [0.86, "#000", 0.07], [1, "#000", 0.2]], 0.4, 0.32, 0.7);
    inn += form(T, poly(Rr.band(-1.05, -0.43, tH - 0.004, tS + 0.004, 12)), "#000", ' opacity=".14"');
    inn += plattenG(T, Rr, tsR, vR, { oval: true, jit: 0.35, var: 0.15, sw: 0.9, fuge: 0.05, fugeV: 0.06, linse: [0, 1, 2], linseH: A.kielH, kielStrich: false, grad: () => pR });
    /* Flanke: oben zwei Reihen gekielter Höcker (unregelmäßig), darunter flache, quer gestreckte Schuppen in Reihen */
    inn += schuppenReihen(T, Rr, tH - 0.02, tS - 0.01, [[-0.35, 3.4, 0, 0.6], [-0.2, 3, 0, 0.5]], [bF, bF2], { ohne: beinOhne, flach: 0.6, kiel: true });
    /* flache, quer gestreckte Schuppen (Flanke und Hals) als Muster: wenig Tonwert, keine Kugeln */
    const mF = musterBeulen(T, "fl", 2.2, { flach: 0.55, hell: 0.1, dunkel: 0.16, grund: 0.07 });
    inn += form(T, poly(Rr.band(-0.42, 0.5, tH - 0.02, tS, 12)), mF) + form(T, poly(Rr.band(-0.95, 0.5, tS, 1, 6)), mF);
    /* Bauchschilde (helle Fugen) */
    const tsB = []; for (let t = tH; t < 1; t += 0.032) tsB.push(t);
    inn += gitter(T, Rr, tsB, [0.55, 0.72, 0.88, 1.02], { versatz: true, w: 0.14, opS: 0.2, opL: 0.36, hell: "#fff8e0", dunkel: "#3a3420", schritt: 70, lichtQuer: false });
    /* Schwanz: helle Fugen (30 % heller), gewölbte Kacheln, obere Reihen mit Kiel-Linse */
    inn += gitter(T, Rr, tsS, vS.slice(1, -1), { licht: false, w: 0.26, opS: 0.32, dunkel: C.fuge, schritt: 30 });
    inn += plattenG(T, Rr, tsS.filter((t) => t > 0.06), vS.slice(1, 3), { sw: 0.4, fuge: 0.1, var: 0.1, linse: [0], linseH: A.kielH * 0.8, kielStrich: false, grad: (j, z) => z < 0.4 ? pK2 : pK });
  } else {
    inn += gitter(T, Rr, tsR.filter((_, i) => i % 2 === 0), [-1.02, -0.8, -0.45], { w: 0.5, opS: 0.4, licht: false, schritt: 40 });
    inn += gitter(T, Rr, tsS.filter((_, i) => i % 2 === 0), [-0.55, 0.45], { w: 0.5, opS: 0.3, dunkel: C.fuge, licht: false, schritt: 40 });
  }
  inn += binden;
  /* Kernschatten im unteren Flankendrittel, Reflexlicht am Bauchrand, feuchte Lichtkante auf dem Rücken */
  inn += `<g filter="${weich(T, "kl", 1.2)}">` + form(T, poly(Rr.band(0.2, 0.62, tH - 0.03, 0.99, 10)), "#000", ' opacity=".26"') + form(T, poly(Rr.band(0.86, 1.1, 0.45, 0.97, 6)), "#f8f0d0", ' opacity=".22"') +
    form(T, poly(Rr.band(-1.06, -0.9, 0.2, 0.97, 10)), "#fff8e0", ' opacity=".14"') + "</g>";
  h += `<g filter="${rund(T, "krumpf", { weich: 4.5, tiefe: 4, umgebung: 0.36 })}">` + teil(T, umriss, C.ol, { innen: inn, rw: 0.3, randA: 0.3 }) + "</g>";
  /* ---------- Rückenkiele (äußere Reihe, unregelmäßig) → Doppelkamm (vordere Schwanzhälfte) → einfacher Kamm ---------- */
  let kam = "", kamL = "", kamF = "";
  const zahn = (t0, t1, Hh, dx, dy) => {
    const [, , nx, ny] = Rr.at((t0 + t1) / 2), a = Rr.P(t0 + (t1 - t0) * 0.1, -1), b = Rr.P(t1 - (t1 - t0) * 0.1, -1);
    const c = [a[0] + (b[0] - a[0]) * 0.28 + nx * Hh + dx, a[1] + (b[1] - a[1]) * 0.28 + ny * Hh + dy], d2 = [a[0] + (b[0] - a[0]) * 0.74 + nx * Hh * 0.9 + dx, a[1] + (b[1] - a[1]) * 0.74 + ny * Hh * 0.9 + dy];
    return [`M${R(a[0] + dx)} ${R(a[1] + 0.6 + dy)}L${R(c[0])} ${R(c[1])}L${R(d2[0])} ${R(d2[1] + 0.15)}L${R(b[0] + dx)} ${R(b[1] + 0.6 + dy)}Z`, `M${R(a[0] + dx + 0.3)} ${R(a[1] + dy)}L${R(c[0] - 0.05)} ${R(c[1] + 0.4)}`];
  };
  const sch = F ? 1 : 3;
  for (let i = 0; i < tsS.length - 1; i += sch) {
    const t0 = tsS[i], t1 = tsS[Math.min(tsS.length - 1, i + sch)], u = t0 / tH;
    const Hh = A.kamm * (0.55 + 2.4 * Math.sin(Math.PI * Math.min(1, u * 0.75 + 0.18))) * Math.min(1, 0.4 + t0 * 6) * (u > 0.9 ? 1 - (u - 0.9) * 4 : 1);
    if (u > 0.5) { const [z2] = zahn(t0, t1, Hh * 0.95, -1.4, -0.9); kamF += z2; }
    const [z1, l1] = zahn(t0, t1, Hh, 0, 0); kam += z1; if (F && t0 > 0.3) kamL += l1;
  }
  for (let i = 0; i < tsR.length - 1; i++) {
    const H2 = A.kamm * (0.45 + 0.5 * T.rnd());
    const [z1] = zahn(tsR[i], tsR[i + 1], H2, 0, 0); kam += z1;
    if (F) { const [z2] = zahn(tsR[i], tsR[i + 1], H2 * 0.8, -1.4, -0.9); kamF += z2; }
  }
  if (kamF) h += `<path d="${kamF}" fill="${C.kammF}" stroke="#12120a" stroke-width=".18" stroke-opacity=".45"/>`;
  h += `<path d="${kam}" fill="${T.lg("kamm", [[0, C.kamm[0]], [0.55, C.kamm[1]], [1, C.kamm[2]]], 0, -40, 0, -10, US)}" stroke="#14140c" stroke-width=".2" stroke-opacity=".5" stroke-linejoin="round"/>`;
  if (kamL) h += `<path d="${kamL}" fill="none" stroke="#f0e8c4" stroke-width=".24" stroke-opacity=".38" stroke-linecap="round"/>`;
  /* ---------- nahe Beine (eine Silhouette je Bein, Beugefalten statt Nähte, Finger/Zehen einzeln) ---------- */
  for (const b of A.beine.nah) {
    /* Flecken auf Ober- und Unterschenkel (färben die Schuppen) */
    let fl = "";
    if (A.beinFlecken && F) { for (let i = 0; i < b.kette.length - 2; i++) { const [x, y, w] = b.kette[i], Q = []; for (let k = 0; k < 6; k++) { const a = (k + T.rnd() * 0.5) / 6 * Math.PI * 2, r = w * (0.1 + T.rnd() * 0.12); Q.push([x + (T.rnd() - 0.5) * w * 0.5 + Math.cos(a) * r, y + Math.sin(a) * r * 0.8]); } fl += poly(Q); } fl = `<path d="${fl}" fill="${C.binde}" opacity=".4"/>`; }
    h += `<g filter="${rund(T, "kb", { weich: 1.6, tiefe: 3.4 })}">` + gliedBein(T, Object.assign({ farben: C.bein, muster: mB, krallenFarbe: "#2a2418", innen: fl }, b)) + "</g>";
  }
  /* Rumpf wirft Schatten auf die Oberseite von Oberarm und Oberschenkel */
  h += `<path d="${A.beinSchatten}" fill="none" stroke="#000" stroke-width="2.4" stroke-opacity=".24" filter="${weich(T, "bs", 0.9)}"/>`;
  return h + A.kopf;
}
/* Nackenschild: 2 kleine Hinterhauptschilde, Hautlücke, 4 große + 2 kleine gekielte Platten (kompakte Gruppe) */
const nackenSchild = (T, x0, y0, f, op = 1, dyH = 0) => {
  if (!T.fein) return "";
  const g = plattenGrad(T, "nk", false, 0.85), kG = T.lg("kielL", [[0, "#fff6d8", 0.42], [0.45, "#fff6d8", 0.08], [0.55, "#000", 0.12], [1, "#000", 0.4]]);
  const pl = [[12.4, -0.6 + dyH, 1.6, 1.1], [14.4, -0.8 + dyH, 1.4, 1], [0, 0, 3.2, 2.5], [3.6, -0.3, 3.2, 2.5], [0.4, 2.8, 2.8, 2.1], [3.8, 2.4, 2.8, 2.1], [6.6, 0.4, 1.8, 1.6], [6.6, 2.6, 1.6, 1.4]];
  let p = "", k = "";
  for (const [dx, dy, w, hh] of pl) {
    const x = x0 + dx * f, y = y0 + dy * f, W = w * f, H = hh * f;
    p += `<path d="M${R(x - W / 2)} ${R(y)}q${R(W * 0.06)} ${R(-H * 0.55)} ${R(W / 2)} ${R(-H * 0.6)}q${R(W * 0.44)} 0 ${R(W / 2)} ${R(H * 0.6)}q0 ${R(H * 0.42)} ${R(-W / 2)} ${R(H * 0.42)}q${R(-W / 2)} 0 ${R(-W / 2)} ${R(-H * 0.42)}z"/>`;
    k += `<ellipse cx="${R(x)}" cy="${R(y - H * 0.1)}" rx="${R(W * 0.34)}" ry="${R(H * 0.05 * op)}"/>`;
  }
  return `<g fill="${g}" stroke="${g}" stroke-width=".3" stroke-linejoin="round">${p}</g><g fill="${kG}">${k}</g>`;
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
function kopfKrokodil(T) {
  const F = T.fein;
  /* ---------- Kopf: ≈ 14 % der Länge, 3° angehoben ---------- */
  let k = "";
  /* Unterkiefer: vorn schlank, hinten tief, geht weich in die Kehle über; dunkle Flecken; Unterkante cremegelb */
  const uk = [[300.2, -22.2], [300.5, -21], [299.6, -19.9], [296.6, -19.2], [290, -18.8], [282, -18.3], [274, -17.8], [266, -17.4], [260, -17.2], [254, -17.3], [247, -17.6], [242.6, -18.8], [241.6, -22.4], [244, -25.2], [251, -25.8], [255, -25.8], [258, -24.6], [266, -23.4], [276, -23], [286, -23.2], [292, -24.4], [297, -23.6]];
  let ui = `<g filter="${weich(T, "k", 0.6)}">` + form(T, poly([[244, -17.4], [262, -17.4], [280, -18.4], [298, -19.6], [298, -20.6], [280, -20], [262, -19.6], [250, -19.8], [244, -20.2]]), "#d6cc9c") + "</g>";
  if (F) ui += `<path d="${[[258, -21.4, 0.9], [263.6, -20.8, 0.7], [268.4, -21.5, 1], [274, -21, 0.75], [279.4, -21.4, 0.95], [285, -20.9, 0.7], [290.4, -21.2, 0.85], [295.6, -21, 0.6]].map(([x, y, g], i) => `M${R(x - g)} ${y}a${R(g)} ${R(g * 0.55)} ${(i * 37) % 50 - 25} 1 0 ${R(2 * g)} 0a${R(g)} ${R(g * 0.55)} ${(i * 37) % 50 - 25} 1 0 ${R(-2 * g)} 0`).join("")}" fill="#2b2816" opacity=".5" filter="${weich(T, "f", 0.2)}"/>`;
  if (F) {
    ui += `<rect x="252" y="-26" width="49" height="9" fill="${musterNetz(T, "s", 0.62, { op: 0.2, opL: 0.12 })}"/>`;
    { const qs = []; for (let x = 246.4; x < 258; x += 1.5) qs.push([[x, -17.8], [x + 0.3, -20.4]]); ui += linien(T, qs, "#5a5030", 0.14, 0.35); }
    ui += punkte(T, [[256, -23.2], [298, -22.2], [298, -21], [256, -21.4]], 12, 0.12, "#14120a", 0.7) + punkte(T, [[256, -21.4], [298, -21], [298, -19.8], [256, -19.6]], 10, 0.11, "#14120a", 0.55);
    ui += lippen(T, [[253, -24.8], [262, -23.6], [274, -23], [288, -23], [297, -23.4]], 9, 1.2, { w: 0.1, op: 0.35, opL: 0.3 });
  }
  /* Oberkopf: flaches, grubiges Schädeldach, erhöhter Augenhöcker, lange Schnauze mit Einschnürung hinter dem Nasen-
     buckel (Kerbe für den 4. Unterkieferzahn) und Ausbuchtung über Oberkieferzahn 4–5 → gewellte Lippenlinie */
  const ko = [[246, -34.6], [252, -35.4], [257, -35.8], [262.6, -35.8], [265.4, -37.2], [268.6, -38.6], [271.8, -37.8], [273.8, -35.6], [278, -32.6], [284, -30.2], [289, -29], [292.4, -28.8], [294.8, -29.4], [297, -29.2], [299.2, -28], [300.8, -25.8], [301, -23.4], [300.2, -22, 1],
    [298, -21.2], [295.8, -21.8], [293.8, -23.4], [291.8, -23.6], [289.8, -22.2], [287, -20.9], [284, -20.8], [280, -21.4], [274, -22], [268, -22.4], [262, -22.9], [258.4, -23.8], [256, -25.2], [253.8, -27.6], [251.8, -30.6], [248, -32]];
  let ki = "";
  ki += `<g filter="${weich(T, "kz", 1)}">` + form(T, poly([[257, -25.2], [264, -23.2], [280, -22.2], [296, -22.4], [296, -23.8], [280, -24.4], [264, -25.8], [258, -27.8]]), "#000", ' opacity=".2"') +
    form(T, poly([[250, -34.6], [262, -35.4], [272, -35.4], [284, -30.4], [296, -28.6], [299, -27], [292, -27.2], [280, -29.4], [268, -32], [256, -32.6]]), "#e6dcb0", ' opacity=".16"') + "</g>";
  if (F) ki += `<path d="${[[262.4, -27, 0.8], [267.4, -27.8, 0.95], [273, -26.6, 0.7], [278, -27.8, 0.9], [282.6, -25.8, 0.7], [287.4, -26.4, 0.8], [292, -25.6, 0.6], [270.8, -25, 0.6], [259.6, -29, 0.8], [276.4, -24.8, 0.6]].map(([x, y, g], i) => `M${R(x - g)} ${y}a${R(g)} ${R(g * 0.55)} ${(i * 37) % 50 - 25} 1 0 ${R(2 * g)} 0a${R(g)} ${R(g * 0.55)} ${(i * 37) % 50 - 25} 1 0 ${R(-2 * g)} 0`).join("")}" fill="#22200f" opacity=".42" filter="${weich(T, "f", 0.2)}"/>`;
  if (F) {
    /* Schädeldach und Schnauzenrücken: raue, grubige Haut auf dem Knochen (Grübchen + feine Rillen, ~10 % Kontrast) */
    ki += punkte(T, [[248, -34.6], [272, -36], [290, -29.4], [299, -28.4], [296, -27], [282, -28.4], [266, -31.6], [250, -32]], 24, 0.2, "#14120a", 0.2) + punkte(T, [[248, -34.6], [270, -35.6], [266, -32.6], [250, -32.4]], 14, 0.14, "#f4ecc8", 0.2);
    let ri = ""; for (let i = 0; i < 10; i++) { const x = 250 + T.rnd() * 46, yo = x < 272 ? -35 : -35 + (x - 272) * 0.27; const y = yo + 0.6 + T.rnd() * 2.6, l = 0.6 + T.rnd() * 1.4, a = (T.rnd() - 0.5) * 1.2; ri += `M${R(x)} ${R(y)}l${R(Math.cos(a) * l)} ${R(Math.sin(a) * l)}`; }
    ki += `<path d="${ri}" stroke="#14120a" stroke-width=".14" stroke-opacity=".25" stroke-linecap="round"/>`;
    /* Schnauzenseite: feine vieleckige Schuppen, Sinnesorgane (ISOs) zum Kieferrand hin dichter */
    ki += form(T, poly([[258, -27], [262, -29.6], [276, -31], [292, -28.2], [301, -26], [301, -21], [286, -20.4], [270, -22.2], [256, -24.4]]), musterNetz(T, "s", 0.62, { op: 0.2, opL: 0.12 }));
    ki += punkte(T, [[262, -25.6], [298, -24.4], [298, -22.6], [262, -23.6]], 24, 0.12, "#0e0d07", 0.75) + punkte(T, [[264, -28], [296, -26.6], [298, -24.4], [262, -25.6]], 12, 0.11, "#0e0d07", 0.55);
    ki += lippen(T, [[257.4, -24.8], [264, -23.2], [274, -22.3], [284, -21.1], [287, -21.2], [289.8, -22.5], [291.8, -23.8], [293.8, -23.6], [295.8, -22.1], [298.4, -21.6]], 13, -1.15, { w: 0.1, op: 0.32, opL: 0.3 });
  }
  /* zwei flache Längswülste vor den Augen (Präorbitalgrate) */
  ki += linien(T, [[[273, -35.6], [279, -32.8], [285, -30.6]], [[272.4, -34.2], [278.4, -31.6], [284.4, -29.6]]], "#f2eac8", 0.5, 0.18) + linien(T, [[[273.2, -35], [279.2, -32.2], [285.2, -30]]], "#14120a", 0.35, 0.22);
  /* Augenhöcker: Licht oben, Mulde davor und darunter */
  ki += fleck(T, "l", 268.6, -37.6, 3.4, 1.2, -4, 0.4) + fleck(T, "d", 270.4, -34.4, 4.4, 1.8, -4, 0.4) + fleck(T, "d", 292.8, -24.2, 1.5, 1, 0, 0.45);
  const mid = T.id("kmask");
  T.def(`<linearGradient id="${mid}g" gradientUnits="userSpaceOnUse" x1="241" y1="0" x2="251.5" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>` +
    `<mask id="${mid}" maskUnits="userSpaceOnUse" x="230" y="-45" width="80" height="35"><rect x="230" y="-45" width="80" height="35" fill="url(#${mid}g)"/></mask>`);
  const uid = T.id("ukmask");
  T.def(`<linearGradient id="${uid}g" gradientUnits="userSpaceOnUse" x1="245" y1="0" x2="249.5" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>` +
    `<mask id="${uid}" maskUnits="userSpaceOnUse" x="230" y="-45" width="80" height="35"><rect x="230" y="-45" width="80" height="35" fill="url(#${uid}g)"/></mask>`);
  const unten = `<g mask="url(#${uid})"><g filter="${rund(T, "kkopf", { weich: 3.2, tiefe: 4, umgebung: 0.4 })}">` + teil(T, uk, "#8a845c", { innen: ui, rw: 0.26, randA: 0.32, kante: [uk.slice(1, 10)] }) + "</g></g>";
  let kopf = "";
  /* weicher Schlagschatten des überstehenden Oberkieferrandes auf dem Unterkiefer */
  kopf += `<path d="M257 -24.8Q270 -21.8 284 -20.4Q290 -20.6 298 -21" fill="none" stroke="#000" stroke-width="1.1" stroke-opacity=".38" filter="${weich(T, "ls", 0.4)}"/>`;
  kopf += teil(T, ko, "#5c5a3a", { innen: ki, rw: 0.26, randA: 0.32, kante: [ko.slice(0, 18)] });
  k += unten + `<g mask="url(#${mid})"><g filter="${rund(T, "kkopf", { weich: 3.2, tiefe: 4, umgebung: 0.4 })}">${kopf}</g></g>`;
  /* Zähne: kegelig, nach hinten gekrümmt, Elfenbein mit dunklerer Basis; Größen wechseln (vordere und Oberkieferzahn 4–5
     groß); Zahnfleisch verdeckt die Basis; untere Zähne greifen außen am Oberkiefer hoch, der 4. liegt in der Kerbe */
  const okZ = [[299.4, -21.9, 1.6, 0.66, -0.06], [297.4, -21.4, 2.4, 0.86, -0.08], [295.2, -22, 1.5, 0.7, -0.05], [289.4, -22.2, 1.3, 0.62, -0.04], [287.2, -21.1, 3.2, 1.06, -0.08], [284.6, -21, 2.6, 0.92, -0.07],
    [281.6, -21.2, 1.5, 0.72, -0.04], [278.8, -21.6, 1.3, 0.66, -0.04], [276, -21.8, 1.8, 0.76, -0.05], [273.2, -22, 1.4, 0.7, -0.04], [270.4, -22.2, 1.6, 0.72, -0.04], [267.6, -22.4, 1.2, 0.62, -0.03], [264.8, -22.6, 1.25, 0.6, -0.03], [262.2, -22.9, 0.95, 0.52, -0.03], [259.8, -23.4, 0.8, 0.46, -0.02]];
  const ukZ = [[298.6, -21.6, 1.4, 0.66, 0.05], [296.6, -21.9, 1.6, 0.68, 0.02], [294.8, -22.6, 1, 0.56, 0], [292.8, -23.4, 4.4, 1.2, -0.1], [288.4, -22.2, 1.1, 0.56, 0], [285.8, -21.3, 1.1, 0.58, 0],
    [283, -21.3, 1.5, 0.66, 0], [280.2, -21.6, 1.3, 0.64, 0], [277.4, -21.9, 1.6, 0.68, 0], [274.6, -22.1, 1.3, 0.64, 0], [271.8, -22.3, 1.5, 0.66, 0], [269, -22.5, 1.2, 0.6, 0], [266.2, -22.7, 1.2, 0.58, 0], [263.4, -22.9, 1, 0.54, 0], [260.8, -23.4, 0.85, 0.48, 0]];
  const zf = { spitze: "#f2e9d2", mitte: "#ddcfac", basis: "#b9a57e", rw: 0.09 };
  k += zaehne(T, F ? okZ : okZ.filter((_, i) => i % 2 === 0), 1, Object.assign({ n: "o" }, zf));
  k += zaehne(T, F ? ukZ : ukZ.filter((_, i) => i % 2 === 1 || i === 3), -1, Object.assign({ n: "u" }, zf));
  /* Zahnfleisch-/Lippensaum über den Zahnbasen (oben und unten) */
  k += linien(T, [[[258.4, -23.6], [264, -22.8], [272, -22.1], [280, -21.4], [284, -20.95], [287, -21], [289.8, -22.3], [291.8, -23.5]], [[293.8, -23.4], [295.8, -22], [298, -21.4], [300, -21.9]]], "#7a6c48", 0.42, 0.75);
  
  /* Nackenschild: 2 Hinterhauptschilde, Hautlücke, 4 + 2 gekielte Platten */
  k += nackenSchild(T, 236.6, -34.6, 1);
  /* Auge: im erhabenen Augenhöcker, schuppiger knöcherner Oberlidwulst beschattet die obere Iris, grünlich-gelbe Iris mit
     Netz, senkrechter Schlitz, Nickhaut halb vorgezogen, nasser Glanz */
  k += echsAuge(T, 268.6, -35.7, 1.65, { iris: "#cdbf52", iris2: "#5a5a1c", netz: "#3c3a10", pupille: "schlitz", offen: 0.6, winkel: -5, nick: 0.24, wulst: "#5c5a3a", lid: "#2c2a1a", korn: "#cfc79c" });
  /* Ohr: dunkler waagerechter Spalt unter einer überhängenden Hautklappe (Länge ≈ Augenlänge) mit heller Oberkante */
  k += `<path d="M258.6 -33.4Q261 -33.1 263.2 -33.6L263 -33.1Q261 -32.6 258.6 -33Z" fill="#0b0a05" opacity=".9"/>` +
    linien(T, [[[258.2, -33.7], [260.8, -34.3], [263.6, -33.9]]], "#e6dcb0", 0.18, 0.3) + linien(T, [[[258.6, -33.35], [261, -33.65], [263.2, -33.5]]], "#000", 0.35, 0.45);
  /* Nasenscheibe mit Nasenloch (Spalt mit Glanz) */
  k += `<ellipse cx="297.6" cy="-29" rx="2.5" ry="1.1" fill="#6a6844"/>` + fleck(T, "l", 297.4, -29.8, 1.8, 0.8, 0, 0.5) + `<path d="M296.2 -29.4q.6 -.9 1.1 0q-.5 -.3 -1.1 0ZM297.8 -29.5q.6 -.9 1.1 0q-.5 -.3 -1.1 0Z" fill="#0f0d07"/>`;
  /* Kopf 3° angehoben (um das Kiefergelenk), leicht verkürzt */
  return `<g transform="rotate(-3 252 -26) translate(252 -26) scale(.92) translate(-252 26)">${k}</g>`;
}
function krokodil(T) {
  /* Rumpf + Schwanz als Rohr: hoher Gang („High Walk“), Bauch zwischen den Beinen durchhängend; Rumpfhöhe ≈ 9–10 % */
  const sp = [[0, -0.6, 0.25, 0.25], [15, -1.5, 1.2, 1.3], [30, -2.7, 2.1, 2.5], [45, -4.2, 3, 3.4], [60, -6.2, 4, 4.4], [75, -8.8, 5, 5.4], [90, -11.6, 6.1, 6.4],
    [105, -14.6, 7.3, 7.4], [120, -17.4, 8.6, 8.4], [135, -19.8, 10, 9.4], [150, -21.6, 11.6, 10.6], [165, -22.8, 12.8, 12.2], [180, -23.4, 13.6, 13.4], [195, -23.6, 14, 14],
    [207, -23.6, 13.8, 14.2], [218, -23.8, 13.2, 12.8], [228, -24.2, 12.2, 10.8], [238, -25, 10.6, 9.2], [248, -26, 9.6, 8.4], [258, -26.6, 9.2, 8.2]];
  /* Beine: schlank und lang (Krokodil), Sohlen liegen auf y = 0; Hinterfuß 4 Zehen mit Schwimmhaut, Vorderhand 5 Finger,
     Krallen nur an den inneren drei (beim nahen Fuß die hinteren/ferneren) */
  const beine = {
    fern: [
      { n: "kfh", kette: [[128, -17, 9], [134, -10.5, 5.6], [130.6, -3, 3.6], [134.4, -1.6, 2.8], [137.4, -1.2, 2.4]], maske: [-22, -15],
        ziffern: [[137.6, -0.7, 5.6, 3, 1, 0], [137.8, -1.3, 6.8, -5, 1, 1], [137.6, -1.9, 6, -13, 0.95, 1], [137.2, -2.3, 4.4, -22, 0.9, 0]], schwimm: [[138, -0.8], [141.4, -0.8], [142, -2.2], [140.6, -3.2], [138, -2.6]] },
      { n: "kfv", kette: [[236, -16, 8], [233, -10, 5], [236, -4.4, 3.8], [238.6, -1.6, 3.2], [241, -1.2, 2.4]], maske: [-20, -14],
        ziffern: [[241.2, -0.5, 3, 6, 1, 0], [241.4, -0.95, 3.6, -6, 1, 0], [241.2, -1.4, 3.4, -18, 1, 1], [240.8, -1.85, 3, -32, 0.95, 0], [240.2, -2.2, 2.4, -48, 0.9, 0]] }],
    nah: [
      { n: "knh", kette: [[144, -24, 15], [152, -20, 12], [160, -13.5, 7], [157.5, -8, 5.4], [154.6, -3.2, 4.4], [158.6, -1.7, 3.4], [162.6, -1.3, 2.6]], maske: [-29, -21],
        falten: [[[156, -14.8], [158.2, -12.6], [158.4, -10.4]], [[152.6, -4.6], [155.4, -3.4], [156.2, -1.8]], [[150, -18.6], [153, -17.4], [155.8, -17.4]]],
        ziffern: [[162, -0.65, 7.2, 4, 1.25, 0], [162.4, -1.25, 9.2, -2, 1.25, 1], [162.6, -1.9, 8.6, -7, 1.2, 1], [162.2, -2.4, 6.4, -12, 1.1, 1]],
        schwimm: [[162.6, -0.7], [166.6, -0.5], [167.2, -1.8], [166.6, -3.2], [162.6, -2.8]] },
      { n: "knv", kette: [[226, -24, 13], [222.5, -18.5, 9.4], [219.2, -12.5, 6.8], [220.6, -7.5, 5], [222.6, -2.8, 3.8], [225.2, -1.5, 3]], maske: [-28, -20],
        falten: [[[221.4, -14.8], [221.2, -12.2], [222.4, -10]], [[220.8, -3.8], [222.8, -2.4], [224.6, -2.6]]],
        ziffern: [[226, -0.62, 3.6, 6, 1.25, 0], [226.2, -1.1, 4.4, -5, 1.25, 0], [226, -1.6, 4.2, -16, 1.2, 1], [225.6, -2.1, 3.6, -30, 1.15, 1], [225, -2.5, 2.8, -46, 1.1, 1]] }]
  };
  let h = panzer(T, { sp, tH: 146, tS: 236, kielH: 0.42, kamm: 1, binden: 0.62, flecken: true, beine,
    bindenT: [0.035, 0.1, 0.165, 0.23, 0.295, 0.36, 0.425],
    farben: { ol: "#6b6a3e", ruecken: "#4e4f2c", flanke: "#8a8452", bauch: "#d6cc9c", fern: ["#727254", "#5c5c44", "#3e3e2e"], bein: ["#8c8858", "#726f49", "#4c4a32"],
      binde: "#24240f", fuge: "#9a9668", kamm: ["#7a7850", "#55553a", "#3a3a26"], kammF: "#4a4a30" },
    beinOhne: [[[136, -30], [160, -30], [168, -12], [140, -12]], [[218, -26], [232, -26], [232, -8], [218, -8]]],
    beinSchatten: "M218 -24.6Q225 -22.4 231 -24.6M138 -25.6Q148 -22.6 158 -24.8", kopf: "" });
  /* Kontaktschatten direkt an den Sohlen (ohne Lichtspalt), so breit wie die aufliegende Fläche */
  const ks = T.rg("ksohle", [[0, "#000", 0.6], [1, "#000", 0]]);
  h = [[139, 0, 5], [243, 0, 3.6], [160, 0, 9], [228, 0, 5]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry=".5" fill="${ks}"/>`).join("") + h;
  h += kopfKrokodil(T);
  return fertig(1.5, h, [0, -40.4, 297.6, 0], [139, 161, 228, 243], [242, -42, 299, -15]);
}

/* =====================================================================
   ALLIGATOR (Mississippi-Alligator, Alligator mississippiensis)
   RECHERCHE: Erwachsen 3,4–4,5 m (Männchen), hier 3,8 m; schwerer gebaut als das Nilkrokodil. Schnauze breit, vorn
   U-förmig gerundet (von der Seite: stumpfe, gerundete Spitze, Nasenlöcher auf einem Höcker). Der Oberkiefer ist breiter
   als der Unterkiefer: bei geschlossenem Maul stehen nur die OBEREN Zähne außen sichtbar, die unteren (auch der große
   4. Unterkieferzahn) sitzen in Gruben des Oberkiefers und sind verdeckt – das wichtigste Unterscheidungsmerkmal.
   Kieferrand kaum gewellt. Farbe erwachsen: dunkel olivgrau bis fast schwarz, Bauch cremeweiß, Querbinden nur schwach
   (Jungtiere gelb gebändert). Iris olivgrün-gelblich, senkrechte Schlitzpupille, Nickhaut. Rückenschild aus gekielten
   Osteodermen, Nackenschild getrennt, Schwanz mit doppeltem, später einfachem Kamm; Hinterfuß mit Schwimmhäuten.
   Zeichenraum wie beim Krokodil (300 Einheiten = 3,8 m). Eigener Körper: Rumpf ≈ 20 % höher als beim Krokodil, Bauch
   stärker durchhängend (Bodenabstand ≈ halb so groß), Ellbogen/Knie seitlich ausgestellt, Beine kürzer und kräftiger,
   Kamm niedrig und stumpf, Rückenkiele niedriger und runder.
   ===================================================================== */
function kopfAlligator(T) {
  const F = T.fein;
  let k = "";
  const uk = [[296.2, -21.6], [296.4, -20.2], [295.4, -18.9], [292, -18.3], [286, -17.9], [278, -17.5], [270, -17.3], [262, -17.1], [254, -17.1], [248, -17.3], [244, -18], [243.6, -21], [246.6, -24.4], [251, -25.8], [255, -25.8], [258, -24.6], [266, -23], [276, -22.4], [288, -22.2], [294.4, -22.2]];
  let ui = `<g filter="${weich(T, "k", 0.6)}">` + form(T, poly([[243, -17.3], [262, -17.2], [280, -17.9], [295, -18.8], [295, -20.2], [280, -19.6], [262, -19.6], [250, -20.8], [243, -20.6]]), "#d9d0b0", ' opacity=".8"') + "</g>";
  if (F) {
    ui += `<rect x="256" y="-26" width="42" height="9" fill="${musterNetz(T, "s", 0.62, { op: 0.16, opL: 0.05 })}"/>`;
    { const qs = []; for (let x = 245; x < 258; x += 1.4) qs.push([[x, -17.4], [x + 0.3, -20]]); ui += linien(T, qs, "#4a4636", 0.14, 0.35); }
    ui += punkte(T, [[256, -22.6], [295, -22], [295, -20.8], [256, -21.2]], 18, 0.12, "#0b0b08", 0.7);
    ui += lippen(T, [[253, -24.8], [262, -23.4], [274, -22.6], [288, -22.4], [294.6, -22.4]], 14, 1.1, { w: 0.1, op: 0.3, opL: 0.25 });
  }
  const ko = [[246, -34.6], [252, -35.4], [257, -35.8], [262.6, -35.8], [265.4, -37.2], [268.6, -38.6], [271.8, -37.8], [273.8, -35.6], [278, -33.2], [283, -31.8], [288, -31], [291.4, -30.9], [293.4, -31.6], [295, -31.4], [296.6, -30], [297.6, -27.8], [297.8, -25.2], [297.2, -22.8], [296.2, -21.6, 1],
    [293, -21], [288, -20.8], [282, -20.9], [276, -21.2], [270, -21.6], [264, -22.2], [259.4, -23.2], [256, -25.2], [253.8, -27.6], [251.8, -30.6], [248, -32]];
  let ki = "";
  ki += `<g filter="${weich(T, "kz", 1)}">` + form(T, poly([[257, -25.2], [264, -22.8], [280, -21.6], [296, -21.8], [296, -23.4], [280, -23.8], [264, -25.4], [258, -27.6]]), "#000", ' opacity=".2"') +
    form(T, poly([[250, -34.6], [262, -35.4], [272, -35.4], [284, -31.6], [295, -30.6], [297, -28.6], [290, -29], [280, -30.4], [268, -32], [256, -32.6]]), "#f0ecd8", ' opacity=".2"') + "</g>";
  if (F) {
    ki += punkte(T, [[248, -34.6], [272, -36], [290, -30.6], [296, -30.4], [294, -29], [282, -29.8], [266, -31.6], [250, -32]], 22, 0.14, "#050504", 0.16);
    let ri = ""; for (let i = 0; i < 14; i++) { const x = 250 + T.rnd() * 42, yo = x < 272 ? -35 : -35 + (x - 272) * 0.2; const y = yo + 0.6 + T.rnd() * 2.6, l = 0.6 + T.rnd() * 1.4, a = (T.rnd() - 0.5) * 1.2; ri += `M${R(x)} ${R(y)}l${R(Math.cos(a) * l)} ${R(Math.sin(a) * l)}`; }
    ki += `<path d="${ri}" stroke="#050504" stroke-width=".14" stroke-opacity=".25" stroke-linecap="round"/>`;
    ki += form(T, poly([[258, -27], [262, -29.6], [276, -31.6], [292, -30.6], [298, -27], [298, -21], [286, -20.4], [270, -21.4], [256, -24.4]]), musterNetz(T, "s", 0.62, { op: 0.16, opL: 0.05 }));
    /* Sinnesorgane nur an den Kiefern */
    ki += punkte(T, [[262, -25], [296, -24], [296, -22], [262, -23]], 30, 0.12, "#050504", 0.7) + punkte(T, [[264, -27.4], [294, -26.6], [296, -24], [262, -25]], 14, 0.11, "#050504", 0.5);
    ki += lippen(T, [[257.4, -24.8], [262, -22.9], [270, -21.8], [280, -21.1], [290, -20.9], [295.8, -21.3]], 24, -1.1, { w: 0.1, op: 0.3, opL: 0.22 });
  }
  ki += fleck(T, "l", 268.6, -37.6, 3.4, 1.2, -4, 0.3) + fleck(T, "d", 270.4, -34.4, 4.4, 1.8, -4, 0.4);
  const mid = T.id("kmask");
  T.def(`<linearGradient id="${mid}g" gradientUnits="userSpaceOnUse" x1="241" y1="0" x2="251.5" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>` +
    `<mask id="${mid}" maskUnits="userSpaceOnUse" x="230" y="-45" width="80" height="35"><rect x="230" y="-45" width="80" height="35" fill="url(#${mid}g)"/></mask>`);
  let kopf = teil(T, uk, "#6c6a58", { innen: ui, rw: 0.26, randA: 0.32, kante: [uk.slice(1, 11)] });
  /* weicher Schlagschatten des überstehenden Oberkieferrandes auf dem Unterkiefer */
  kopf += `<path d="M257.4 -24.2Q268 -21.4 282 -20.2Q290 -20 296 -20.6" fill="none" stroke="#000" stroke-width="1.3" stroke-opacity=".45" filter="${weich(T, "ls", 0.4)}"/>`;
  kopf += teil(T, ko, "#35362d", { innen: ki, rw: 0.26, randA: 0.32, kante: [ko.slice(0, 19)] });
  k += `<g mask="url(#${mid})"><g filter="${rund(T, "kkopf", { weich: 3.2, tiefe: 4, umgebung: 0.4 })}">${kopf}</g></g>`;
  /* obere Zähne: stumpfer als beim Krokodil, gelblich-elfenbein, viele zur Hälfte vom Lippenrand verdeckt; der 4. und
     der 9.–10. größer; vorderste Spitze ohne Zähne */
  const okZ = [[293.8, -21.2, 0.9, 0.6, -0.03], [291.8, -21.05, 1.2, 0.66, -0.04], [289.8, -20.95, 0.6, 0.54, -0.02], [287.6, -20.9, 2.1, 0.92, -0.06], [285.2, -20.85, 1, 0.62, -0.03],
    [282.8, -20.9, 0.55, 0.54, -0.02], [280.4, -21, 1.1, 0.64, -0.03], [278, -21.1, 0.7, 0.58, -0.02], [275.6, -21.2, 1.9, 0.86, -0.05], [273.2, -21.35, 1.7, 0.82, -0.05], [270.8, -21.5, 0.6, 0.54, -0.02],
    [268.4, -21.7, 1, 0.6, -0.03], [266, -21.9, 0.5, 0.5, -0.02], [263.6, -22.15, 0.8, 0.5, -0.02], [261.4, -22.5, 0.45, 0.44, -0.02]];
  if (F) k += `<path d="${okZ.map(([x, y, l]) => `M${R(x - 0.1)} ${R(y + l + 0.3)}h.5`).join("")}" stroke="#000" stroke-width=".4" stroke-opacity=".3" stroke-linecap="round" filter="${weich(T, "zs", 0.2)}"/>`;
  k += zaehne(T, F ? okZ : okZ.filter((_, i) => i % 2 === 1), 1, { n: "o", spitze: "#efe6cf", mitte: "#dccfaa", basis: "#b5a27a", rw: 0.09 });
  k += linien(T, [[[259.6, -23], [264, -22.2], [270, -21.6], [276, -21.2], [282, -20.95], [288, -20.85], [293, -21], [296, -21.5]]], "#4a4636", 0.4, 0.75);
  /* Auge: im Augenhöcker unter schwerem schuppigem Oberlidwulst, Iris olivgrün-gelb mit Netz, Schlitzpupille, Nickhaut */
  k += echsAuge(T, 268.6, -35.7, 1.65, { iris: "#a8a24a", iris2: "#3e4418", netz: "#2a2e0c", pupille: "schlitz", offen: 0.58, winkel: -5, nick: 0.2, wulst: "#35362d", lid: "#1a1b15", korn: "#a8a690" });
  /* Ohr: dunkler Spalt unter überhängender Hautklappe */
  k += `<path d="M258.6 -33.4Q261 -33.1 263.2 -33.6L263 -33.1Q261 -32.6 258.6 -33Z" fill="#050504" opacity=".9"/>` +
    linien(T, [[[258.2, -33.7], [260.8, -34.3], [263.6, -33.9]]], "#c8c4ae", 0.18, 0.3) + linien(T, [[[258.6, -33.35], [261, -33.65], [263.2, -33.5]]], "#000", 0.35, 0.45);
  /* Nasenbuckel mit Nasenloch vorn oben */
  k += `<ellipse cx="294.6" cy="-31" rx="2.4" ry="1" fill="#4a4b40"/>` + fleck(T, "l", 294.4, -31.4, 2, 0.7, 0, 0.35) + `<path d="M293.6 -31q.6 -.8 1.1 0q-.5 -.3 -1.1 0ZM295 -31.1q.6 -.8 1.1 0q-.5 -.3 -1.1 0Z" fill="#050504"/>` + (F ? linien(T, [[[293, -31.5], [294.6, -32.2], [296.2, -31.5]]], "#e8e4d0", 0.14, 0.45) : "");
  /* Kopf flach gehalten (tiefe Haltung) */
  /* Kopf flach gehalten (tiefe Haltung) */
  return `<g transform="translate(0 4.6) rotate(-1 252 -26)">${k}</g>`;
}
function alligator(T) {
  const sp = [[0, -0.6, 0.25, 0.25], [15, -1.3, 1.3, 1.4], [30, -2.3, 2.4, 2.8], [45, -3.6, 3.6, 4], [60, -5.4, 4.9, 5.3], [75, -7.6, 6.3, 6.6], [90, -10, 7.8, 8], [105, -12.6, 9.4, 9.4],
    [120, -15, 11, 10.8], [135, -17.2, 12.8, 12.2], [150, -18.8, 14.6, 13.6], [165, -20, 16, 15.2], [180, -20.8, 16.8, 16.2], [195, -21.2, 17.2, 16.8], [207, -21.2, 17, 16.6], [218, -21.4, 16.2, 15],
    [228, -21.8, 14.6, 12.6], [238, -22.6, 12, 10.6], [248, -23.4, 9.4, 9.6], [258, -24, 7, 8.8]];
  /* Beine kurz und kräftig, Ellbogen nach hinten-außen (Unterarm schräg), Hinterfuß vorgeschoben; Sohlen auf y = 0 */
  const beine = {
    fern: [
      { n: "afh", kette: [[132, -17, 10], [137, -11, 6.4], [134, -4.2, 4.4], [138.6, -1.8, 3.4], [141.4, -1.3, 2.6]],
        ziffern: [[141.6, -0.7, 5, 3, 1.1, 0], [141.8, -1.3, 6, -5, 1.1, 1], [141.6, -1.9, 5.4, -13, 1.05, 1], [141.2, -2.4, 4, -22, 1, 0]], schwimm: [[142, -0.8], [145, -0.8], [145.6, -2.2], [144.4, -3.2], [142, -2.6]] },
      { n: "afv", kette: [[236, -17, 9], [233, -11, 6], [235, -4.6, 4.4], [237.6, -1.8, 3.4], [240, -1.3, 2.6]],
        ziffern: [[240.2, -0.55, 2.8, 6, 1.1, 0], [240.4, -1, 3.4, -6, 1.1, 0], [240.2, -1.5, 3.2, -18, 1.1, 1], [239.8, -1.95, 2.8, -32, 1, 0], [239.2, -2.3, 2.2, -48, 0.95, 0]] }],
    nah: [
      { n: "anh", kette: [[150, -24, 17], [157, -19, 13], [166, -13, 8.6], [163, -7.5, 6.4], [159.6, -3, 5], [165, -1.8, 3.6], [168, -1.5, 3]], maske: [-28, -19],
        falten: [[[161.4, -15], [163.6, -12.8], [163.6, -10.4]], [[157.6, -4.6], [160.4, -3.2], [161, -1.8]], [[154, -20.6], [157.6, -18.8], [161, -18.8]]],
        ziffern: [[167.4, -0.75, 6, 4, 1.45, 0], [167.8, -1.4, 7.6, -2, 1.45, 1], [168, -2.1, 7.2, -7, 1.4, 1], [167.6, -2.7, 5.4, -12, 1.3, 1]],
        schwimm: [[168, -0.8], [171.6, -0.6], [172.2, -2], [171.6, -3.4], [168, -3]] },
      { n: "anv", kette: [[224, -26, 14], [219, -18, 10], [213.6, -12.4, 7.4], [218, -6.6, 5.6], [222, -2.6, 4.4], [225, -1.6, 3.2]], maske: [-30, -21],
        falten: [[[216.6, -15], [216.4, -12.4], [218, -10.2]], [[219.8, -3.8], [222, -2.4], [224, -2.6]]],
        ziffern: [[225.8, -0.7, 3.2, 6, 1.4, 0], [226, -1.2, 3.8, -5, 1.4, 0], [225.8, -1.75, 3.6, -16, 1.35, 1], [225.4, -2.3, 3.1, -30, 1.3, 1], [224.8, -2.7, 2.4, -46, 1.2, 1]] }]
  };
  let h = panzer(T, { sp, tH: 150, tS: 226, kielH: 0.3, kamm: 0.55, binden: 0.25, zacken: true, beine,
    bindenT: [0.04, 0.11, 0.18, 0.25, 0.32, 0.39],
    farben: { ol: "#35362d", ruecken: "#23241e", flanke: "#484940", bauch: "#d9d0b0", fern: ["#3e3f35", "#2e2f28", "#1c1c18"], bein: ["#525347", "#3d3e34", "#23241e"],
      binde: "#0e0f0b", fuge: "#4a4b40", kamm: ["#5a5b4c", "#36372d", "#23241e"], kammF: "#292a23" },
    beinOhne: [[[140, -32], [164, -32], [172, -12], [144, -12]], [[212, -30], [230, -30], [230, -10], [212, -10]]],
    beinSchatten: "M214 -23Q222 -20 230 -22.6M141 -25Q153 -21.4 164 -24", kopf: "" });
  /* Kontaktschatten direkt an den Sohlen; Bauchschatten eng und dunkel (tiefe Haltung) */
  const ks = T.rg("ksohle", [[0, "#000", 0.6], [1, "#000", 0]]);
  h = `<ellipse cx="190" cy="0" rx="34" ry="1.2" fill="${ks}" opacity=".7"/>` + [[142, 0, 5], [241, 0, 3.6], [165, 0, 9], [227, 0, 5]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry=".5" fill="${ks}"/>`).join("") + h;
  /* Nackenschild im Körperraum (Hinterhauptschilde liegen über dem Kopfansatz) */
  h += nackenSchild(T, 231.6, -33.6, 0.95, 0.8, 2);
  h += kopfAlligator(T);
  return fertig(3.8 / 3, h, [0, -41, 297.4, 0], [142, 168, 226, 241], [242, -38, 299, -12]);
}

/* =====================================================================
   KOBRA (Brillenschlange, Indische Kobra, Naja naja)
   RECHERCHE: 1–1,5 m (bis 2 m), Körper ~3,5–4 cm dick. Abwehrhaltung: vorderes Drittel aufgerichtet (40–60 cm),
   Nackenrippen gespreizt → breiter Nackenschild (≈ 12–15 cm), am breitesten zwischen oberem Drittel und Mitte, unten
   konkav in den Hals verjüngt. Auf der RÜCKSEITE des Schildes die „Brille“: zwei helle, schwarz gerandete Ringflecken
   (Ocellen) mit dunklem Kern, verbunden durch einen nach unten durchhängenden hellen, schwarz gesäumten Bügel –
   Namensgeber „Brillenschlange“. Glatte, glänzende Rückenschuppen in Schrägreihen, breite cremefarbene Bauchschilde;
   schwache, unscharfe Querbinden. Färbung (Südindien): gelblich- bis olivbraun. Kopf leicht abgeflacht, gerundete
   Schnauze, kaum vom Hals abgesetzt (~4,5 cm), große symmetrische Kopfschilde der Giftnattern (Rostrale, Internasalia,
   Präfrontalia, Frontale, Supraocularia, Parietalia), 7 hohe Oberlippenschilde (3. und 4. berühren das Auge),
   Prä- und Postocularia, Temporalia. Schlangen haben KEINE Lider: Auge kreisrund unter der glasigen Brillenschuppe,
   Iris dunkelbraun mit feinem goldbraunem Ring, runde Pupille. Zunge schwarz-violett, tief gegabelt.
   Ansicht (Kritiker Variante A): Schild in Dreiviertel-Rückansicht (Brille sichtbar), Kopf im Profil nach rechts über
   der Schildoberkante, wirft Schatten auf den Schild; Körper in einem Ring in leichter Aufsicht, Schwanz vorn.
   Zeichenraum: 1 Einheit = 0,3 cm.
   ===================================================================== */
function kobra(T) {
  const F = T.fein;
  let h = "";
  const bauch = "#e2d3a4";
  const mS = F ? musterRauten(T, "k", 2.2, { hell: 0.1, dunkel: 0.12, rand: 0.12, rot: -10 }) : "";
  const opt = (x) => Object.assign({ bauch, muster: mS, streif: false, glanz: 0.3, bindenOp: 0.18, bindenFarbe: "#3a2812", weich: 1.1 }, x);
  const R6 = (n) => Math.round(n * 6);
  /* 1) hintere Ringhälfte (weiter weg: höher im Bild, 12 % dunkler, Licht von links oben fällt auf die Außenkante) */
  const hinten = [[166, -11, 6.2], [162, -21, 6.3], [150, -26.4, 6.3], [126, -28.6, 6.4], [96, -29.6, 6.4], [66, -28.4, 6.4], [44, -24.6, 6.4], [33, -18.6, 6.5], [33.6, -13, 6.6]];
  h += `<g filter="${rund(T, "kw", { weich: 2.2, tiefe: 3.5 })}">` + schlangenRohr(T, hinten, opt({ farbe: "#7f5f36", bauchSeite: -1, licht: 1, binden: [[0.3, 0.025], [0.72, 0.025]] })).svg + "</g>";
  /* 2) Hals: steigt aus der hinteren Ringhälfte rechts auf, unter dem Schild am dünnsten */
  const hals = [[167, -10, 6.2], [170, -24, 6], [167, -42, 5.7], [156, -58, 5.3], [136, -68, 4.9], [122, -74, 4.5], [115.6, -80, 4.3], [114.4, -94, 4.3]];
  h += `<g filter="${rund(T, "kw", { weich: 2.2, tiefe: 3.5 })}">` + schlangenRohr(T, hals, opt({ farbe: "#9a7444", bauchSeite: 1, licht: -1, binden: [[0.38, 0.02]], schilde: 0.016 })).svg + "</g>";
  /* Berührungsfuge: wo der Hals auf der hinteren Hälfte aufliegt */
  h += `<path d="M156 -28Q164 -31 172 -26" fill="none" stroke="#000" stroke-width="2.4" stroke-opacity=".35" filter="${weich(T, "fu", 0.8)}"/>`;
  /* 3) vordere Ringhälfte + Schwanz (am nächsten, liegt am Boden; Schwanz erst auf den letzten ~15 % dünner) */
  const vorn = [[31.4, -17, 6.6], [35.4, -11, 6.7], [46, -8, 6.8], [70, -7.2, 6.9], [100, -7, 6.9], [128, -7.2, 6.8], [150, -7.4, 6.4], [168, -6.2, 5.4], [182, -4.2, 3.8], [193, -2.6, 2], [200, -1.4, 0.6]];
  /* tiefe Berührungsfuge zur hinteren Hälfte (dunkel, nach außen weich) */
  h += `<path d="M44 -15.6Q100 -16.4 150 -15.4" fill="none" stroke="#000" stroke-width="3" stroke-opacity=".3" filter="${weich(T, "fu2", 1.6)}"/>`;
  h += `<g filter="${rund(T, "kw", { weich: 2.2, tiefe: 3.5 })}">` + schlangenRohr(T, vorn, opt({ farbe: "#9a7444", bauchSeite: 1, licht: -1, binden: [[0.22, 0.02], [0.5, 0.02], [0.78, 0.018]], schilde: 0.014 })).svg + "</g>";
  /* durchgehender Kontaktschatten unter der vorderen Windung */
  h += `<path d="M30 -0.6L196 -0.4" stroke="#000" stroke-width="1.6" stroke-opacity=".45" filter="${weich(T, "ko", 0.8)}"/>`;

  /* 4) Nackenschild, Dreiviertel-Rückansicht: Rückenhaut braun, Brille, Rippenwülste, Schuppenreihen */
  /* Dreiviertel-Rückansicht: nahe (linke) Schildhälfte breit, ferne (rechte) stark verkürzt */
  const q = (x) => (x < 0 ? x * 0.9 : x * 0.34), Q = (p) => p.map(([x, y]) => [q(x), y]);
  const hs = Q([[0, -31], [10.4, -29.8], [19.6, -25], [25.6, -16], [27.6, -6], [26.2, 4], [22, 12], [16, 20], [10.6, 27], [7.4, 34], [6.2, 42], [-6.2, 42], [-7.4, 34], [-10.6, 27], [-16, 20], [-22, 12], [-26.2, 4], [-27.6, -6], [-25.6, -16], [-19.6, -25], [-10.4, -29.8]]);
  let hi = "";
  /* Ränder biegen nach hinten weg → dunkler; Mittellinie (Wirbelsäule) erhaben */
  hi += `<path d="${T.glatt(hs.slice(12).concat(hs.slice(0, 9)), false)}" fill="none" stroke="#3a2812" stroke-width="6" stroke-opacity=".32" filter="${weich(T, "hr", 1.8)}"/>`;
  hi += `<path d="M0 -28L0 36" stroke="#f2dcae" stroke-width="3" stroke-opacity=".12" filter="${weich(T, "hm", 1.4)}"/>`;
  /* gespreizte Halsrippen: feine, radiale, leicht gebogene Wülste (Streiflicht, ~8 % Kontrast) */
  let rip = "";
  for (let i = 0; i < 9; i++) for (const sx of [-1, 1]) {
    const a = (-62 + i * 15) * Math.PI / 180, x0 = q(sx * 3), y0 = 6 + i * 2, x1 = q(sx * (4 + Math.cos(a) * 21)), y1 = y0 + Math.sin(a) * 21 - 6;
    rip += `M${R(x0)} ${R(y0)}Q${R((x0 + x1) / 2 + q(sx * 2))} ${R((y0 + y1) / 2 + 2)} ${R(x1)} ${R(y1)}`;
  }
  hi += `<path d="${rip}" fill="none" stroke="#000" stroke-width="1.2" stroke-opacity=".08"/><path d="${rip}" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".08" transform="translate(-.6 -.5)"/>`;
  /* Brille: zwei unregelmäßige Ringflecken, nach außen offen-oval, dunkler Kern seitlich versetzt; schmaler Bügel
     setzt innen-unten an und hängt nur leicht durch – gedämpfte Farben, Schuppen darüber */
  const cre = "#ccb47e", sw = "#2a1b0d";
  hi += `<g opacity=".8">` +
    `<path d="${T.glatt(Q([[-8, -3.4], [-4.4, 3], [0, 4.2], [4.4, 3], [8, -3.4], [6.6, -3.8, 1], [3.6, 1], [0, 2], [-3.6, 1], [-6.6, -3.8, 1]]))}" fill="${cre}" stroke="${sw}" stroke-width=".7" stroke-linejoin="round"/>` +
    [-1, 1].map((sx) => `<path stroke-width="1.1" d="${T.glatt(Q([[sx * 7.6, -14.6], [sx * 11.8, -15.6], [sx * 15.6, -12.4], [sx * 16, -7.6], [sx * 13.2, -4], [sx * 8.8, -4.2], [sx * 6.8, -8.6]]))}" fill="${cre}" stroke="${sw}"/>` +
      `<path d="${T.glatt(Q([[sx * 11.6, -12], [sx * 14.2, -11.6], [sx * 14.6, -8.6], [sx * 13, -6.4], [sx * 11.2, -8.4]]))}" fill="#2c1e10"/>`).join("") + "</g>";
  if (F) hi += `<rect x="-30" y="-32" width="60" height="72" fill="${musterRauten(T, "kh", 2, { hell: 0.14, dunkel: 0.18, rand: 0.2, rot: 28 })}"/>`;
  /* Schlagschatten des Kopfes auf der Schildoberkante */
  hi += `<ellipse cx="4" cy="-27" rx="13" ry="5" fill="#000" opacity=".32" filter="${weich(T, "hk", 1.6)}"/>`;
  let hood = teil(T, hs, "#9a7444", { innen: hi, rand: "#1a1008", randA: 0.25, rw: 0.45 });
  hood += linien(T, [hs.slice(3, 8).map(([x, y]) => [x - 1.2, y])], "#f0dcae", 0.8, 0.16);
  h += `<g filter="${rund(T, "kh", { weich: 6, tiefe: 4, umgebung: 0.38 })}"><g transform="translate(120 -124) rotate(4)">${hood}</g></g>`;

  /* Hals schiebt sich vorn über den unteren Schildansatz (kein „Flaschenhals“) */
  { const mk = T.id("hm");
    T.def(`<linearGradient id="${mk}g" gradientUnits="userSpaceOnUse" x1="0" y1="-94" x2="0" y2="-84"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${mk}" maskUnits="userSpaceOnUse" x="100" y="-100" width="45" height="40"><rect x="100" y="-100" width="45" height="40" fill="url(#${mk}g)"/></mask>`);
    h += `<g mask="url(#${mk})"><g filter="${rund(T, "kw", { weich: 2.2, tiefe: 3.5 })}">` + schlangenRohr(T, [[136, -68, 4.9], [122, -74, 4.5], [115.6, -80, 4.3], [114.6, -88, 4.4], [115, -95, 4.8]], opt({ farbe: "#9a7444", bauchSeite: 1, licht: -1, schilde: 0.05, randA: 0 })).svg + "</g></g>"; }
  /* 5) Kopf im Profil nach rechts über der Schildoberkante (lokal: x 0…15 = Hinterkopf…Schnauze) */
  const kp = [[0, -2.2], [1.6, -3.3], [4, -3.8], [7, -3.9], [10, -3.5], [12.6, -2.7], [14.4, -1.5], [15.1, 0], [14.7, 1.2], [13, 1.9], [10, 2.3], [6, 2.7], [2.4, 2.9], [0, 2.3]];
  let ki = `<g filter="${weich(T, "kk", 0.4)}">` + form(T, poly([[0.6, -2.6], [4, -3.6], [10, -3.3], [14, -1.4], [10, -2], [4, -2.2], [1, -1.4]]), "#f2ddae", ' opacity=".3"') +
    form(T, poly([[0.4, 2], [6, 2.4], [12, 1.8], [14.6, 1], [10, 0.8], [4, 1], [0.6, 1]]), "#000", ' opacity=".26"') + "</g>";
  /* Kopfschilde: Oberlippenschilde (7), Prä-/Postocularia, Nasale, Temporalia, Kanten der Oberseitenschilde, Unterlippe */
  const sch = [[[14.6, 0], [12.8, -0.1], [11.2, 0.25], [10.4, 0.3]], [[8.8, 0.3], [7.6, 0.1], [5.6, 0.35], [3.6, 0.7], [2.2, 1.1]],
    [[13.2, -0.05], [13.1, 1.3]], [[11.6, 0.15], [11.5, 1.4]], [[10.2, 0.3], [10.1, 1.45]], [[8.8, 0.3], [8.7, 1.5]], [[7.2, 0.15], [7.1, 1.6]], [[5.4, 0.35], [5.2, 1.7]],
    [[11, -2.6], [11.2, -0.4]], [[12.3, -2.7], [12.5, 0]], [[14.3, -1.9], [14.5, -0.1]], [[8, -2.3], [7.8, -0.9], [8.1, 0.2]], [[7.8, -0.9], [6.8, -1]],
    [[7, -2.7], [5.4, -1.4], [5.6, 0.4]], [[5.4, -1.4], [3, -1.6]], [[3, -1.6], [2.2, 0.6]],
    [[12.7, -2.7], [12.3, -3.2]], [[10, -3.5], [10.2, -3.9]], [[6.8, -3.9], [6.2, -2.8]], [[8, -2.4], [11.2, -2.6]],
    [[13, 1.4], [12.8, 2]], [[11, 1.5], [10.8, 2.2]], [[9, 1.6], [8.8, 2.4]], [[7, 1.7], [6.8, 2.6]]];
  ki += linien(T, sch, "#2a1a0a", 0.1, 0.55) + (F ? linien(T, sch.map((p) => p.map(([x, y]) => [x + 0.08, y + 0.1])), "#f6e6bc", 0.07, 0.4) : "");
  /* glänzende Schilde: kleine Lichter je Schild */
  if (F) ki += `<path d="M1.6 -2.8l1.4 -.4M4.4 -3.3l1.6 -.2M7.8 -3.4l1.6 0M11 -3l1.2 .3M13.2 -2l.6 .4M12 -.1l.8 0M9 .6l.8 0M6.2 .8l.8 0" stroke="#fff6dc" stroke-width=".22" stroke-opacity=".5" stroke-linecap="round"/>`;
  let kopf = teil(T, kp, "#a07a46", { innen: ki, rand: "#1a1008", randA: 0.28, rw: 0.12 });
  kopf += linien(T, [[[14.9, 0.9], [13, 1.2], [10, 1.3], [6.6, 1.5], [3.2, 1.9]]], "#120a04", 0.14, 0.8);
  /* Auge: kreisrund, ohne Lider, unter der Brillenschuppe; Supraoculare überhängt mit Schatten */
  kopf += echsAuge(T, 9.6, -0.95, 1.05, { schlange: true, iris: "#4a3018", iris2: "#140a05", pupille: "rund", pupR: 0.42, haut: "#a07a46" });
  kopf += `<path d="M8.2 -2.4Q9.8 -2.9 11.2 -2.4Q9.8 -2.1 8.2 -2.4Z" fill="#000" opacity=".25"/>`;
  kopf += `<ellipse cx="13.5" cy="-1.1" rx=".42" ry=".34" fill="#120a04"/>`;
  /* Zunge: schwarz-violett, an der Basis breit, verjüngt, Gabel 25 %, leicht nach unten gebogen, mit feuchter Kante */
  kopf += `<path d="M14.9 .62C16.6 .5 18.4 .8 20 1.3L20.1 1.6C18.4 1.2 16.6 1 14.9 1.08Z" fill="#2a1420"/>` +
    `<path d="M20 1.3Q21.2 1.1 22.4 .3M20.1 1.6Q21.3 2 22.5 2.8" fill="none" stroke="#2a1420" stroke-width=".18" stroke-linecap="round"/>` +
    (F ? `<path d="M15.2 .66C16.8 .58 18.4 .84 19.8 1.28" fill="none" stroke="#fff" stroke-width=".07" stroke-opacity=".5"/>` : "");
  h += `<g filter="${rund(T, "kk", { weich: 1.2, tiefe: 3, umgebung: 0.4 })}"><g transform="translate(117.4 -150.4) rotate(5)">${kopf}</g></g>`;
  return fertig(0.3, h, [24.8, -154.6, 200, 0], null, [112, -158, 142, -136]);
}

/* =====================================================================
   PYTHON (Tigerpython, hier Dunkler Tigerpython / Burmapython, Python bivittatus)
   RECHERCHE: meist 3–5 m (hier ~4 m), Rumpf bis ~15–20 cm dick, liegt ruhend in Schlaufen; der Querschnitt sackt am
   Boden etwas ab. Kopf ~14 cm, länglich-keilförmig, deutlich vom Hals abgesetzt, Oberseite flach, Schnauzenkante.
   Zeichnung: große, unregelmäßige, schwarz gesäumte, dunkel-olivbraune Sattelflecken auf dem Rücken und kleinere,
   versetzte Seitenflecken (oft mit hellem Kern) auf gelblich-hellbraunem Grund – dazwischen nur ein schmales helles
   Netz; Bauch weißlich. Kopf: dunkelbraune Speerspitze auf dem Oberkopf (Spitze nach vorn zwischen die Augen, heller
   Saum), dunkler Streif Nasenloch → Auge → Mundwinkel, dunkler Keil unter dem Auge, Lippen cremeweiß. Wärmegruben als
   schräge Schlitze im Rostrale und in den ersten Oberlippenschilden sowie in den hinteren Unterlippenschilden.
   Schlangen haben KEINE Lider: rundes Auge unter der Brillenschuppe, Iris goldbraun (obere Hälfte heller, untere im
   Augenstreif dunkel), senkrechte Schlitzpupille. Glatte, schillernde Schuppen. Schwanz kurz (~12 %), kegelig.
   Ansicht: in leichter Aufsicht (~28°) in Schlaufen ruhend, Kopf liegt oben vorn rechts auf den Windungen.
   Zeichenraum: 1 Einheit = 1,4 cm.
   ===================================================================== */
function python(T) {
  const F = T.fein;
  let h = "";
  const mS = F ? musterRauten(T, "p", 1.3, { hell: 0.08, dunkel: 0.1, rand: 0.1, rot: -6 }) : "";
  /* Körper als Spirale (Ellipse in Aufsicht): außen beginnt der Schwanz vorn links, innen endet die Windung hinten */
  const cx = 80, cy = -27.6, n = 150, th0 = Math.PI / 2 + 0.55, dth = 2 * Math.PI * 1.38;
  const P = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, th = th0 + dth * u, rx = 58 - 18 * u, ry = 21.5 - 6.7 * u;
    const r = 6.2 * Math.min(1, 0.12 + u / 0.13) * (1 - 0.08 * u);
    P.push([cx + rx * Math.cos(th), cy + ry * Math.sin(th) + (1 - Math.sin(th)) * 0, Math.max(0.6, r), Math.sin(th)]);
  }
  /* Teilstücke: hinten (sin < 0) zuerst, von außen nach innen; dann vorn von innen nach außen */
  const stuecke = [];
  let cur = [P[0]];
  for (let i = 1; i < P.length; i++) { if ((P[i][3] < 0) !== (P[i - 1][3] < 0)) { cur.push(P[i]); stuecke.push(cur); cur = [P[i - 1], P[i]]; } else cur.push(P[i]); }
  stuecke.push(cur);
  /* hintere Stücke über die Umkehrpunkte hinaus verlängern (die vorderen blenden dort weich darüber) */
  const idx = new Map(P.map((p, i) => [p, i]));
  const hinten = stuecke.filter((p) => p[Math.floor(p.length / 2)][3] < 0).map((p) => { const a = idx.get(p[0]), b = idx.get(p[p.length - 1]); return P.slice(Math.max(0, a - 5), Math.min(P.length, b + 6)); }), vorn = stuecke.filter((p) => p[Math.floor(p.length / 2)][3] >= 0).reverse();
  /* Fleckenzeichnung, auf die Rundung projiziert (zum Rand gestaucht); u = Vorzeichen der Oberseite in v */
  const flecken = (u) => (Rr) => {
    let dS = "", dL = "", dK = "";
    const proj = (a) => Math.sin(a * Math.PI / 2) * 1.08;
    const fl = (t, a0, a1, w, j, nn = F ? 11 : 7) => { const Q = []; for (let i = 0; i < nn; i++) { const b = i / nn * Math.PI * 2, c = Math.cos(b), sn = Math.sin(b), rr = 1 + (T.rnd() - 0.5) * j + (i % 3 === 0 ? -0.16 : 0.05); Q.push(Rr.P(t + Math.sign(c) * Math.pow(Math.abs(c), 0.55) * w * rr, u * proj((a0 + a1) / 2 + Math.sign(sn) * Math.pow(Math.abs(sn), 0.7) * (a1 - a0) / 2 * rr))); } return Q; };
    const dt = (F ? 13 : 16) / Rr.len;
    for (let t = T.rnd() * dt * 0.5; t < 1; t += dt * (0.82 + T.rnd() * 0.36)) {
      const g = 0.8 + T.rnd() * 0.4;
      dS += pfad(T, fl(t, 0.05, 1.12, dt * 0.42 * g, 0.34));
      const tl = t + dt * (0.45 + T.rnd() * 0.1), Ql = fl(tl, -0.62, -0.08, dt * 0.24 * g, 0.36, F ? 9 : 6);
      dL += pfad(T, Ql);
      if (T.rnd() < 0.6) { const [x, y] = Rr.P(tl, u * proj(-0.34)); dK += `M${R(x - 0.5)} ${R(y)}a.6 .4 0 1 0 1.2 0a.6 .4 0 1 0 -1.2 0`; }
    }
    return `<g filter="${weich(T, "pf", 0.18)}"><path d="${dS}" fill="#4f3c26" stroke="#20160c" stroke-width="${F ? 0.8 : 0.5}" stroke-linejoin="round"/><path d="${dL}" fill="#4a3822" stroke="#20160c" stroke-width="${F ? 0.6 : 0.4}" stroke-linejoin="round"/></g>` +
      (dK ? `<path d="${dK}" fill="#c9ae7e" opacity=".75"/>` : "");
  };
  const opt = (u, x = {}) => Object.assign({ farbe: "#b39a68", bauch: "#e6dcc2", bauchSeite: -u, licht: u, muster: mS, innen: flecken(u), n: F ? 14 : 8, streif: false, kern: 0.5, glanz: 0.26, weich: 1.2, randA: 0.22, offen: true }, x);
  const rohrteil = (p, u, x) => schlangenRohr(T, p.map(([a, b, r]) => [a, b, r]), opt(u, x)).svg;
  /* weicher Bodenschatten / Kontaktschatten entlang der vorderen Auflage */
  h += `<path d="${poly(P.filter((_, i) => i % 6 === 0).map(([x, y, r]) => [x, y + r * 0.7]))}" fill="none" stroke="#000" stroke-width="9" stroke-opacity=".16" stroke-linejoin="round" filter="${weich(T, "bs", 2.4)}"/>`;
  let kb = "";
  for (const p of hinten) kb += rohrteil(p, -1, { farbe: "#a68d5e" });
  /* Hals: steigt aus der inneren Windung hinten auf, liegt über den Windungen, Kopf vorn rechts */
  const e = P[P.length - 1];
  const e0 = P[P.length - 9];
  const hals = [[e0[0], e0[1], e0[2]], [e[0], e[1], e[2]], [e[0] + 8, e[1] - 4.6, 5], [e[0] + 26, e[1] - 6.4, 4.2], [e[0] + 48, e[1] - 3, 3.4], [e[0] + 66, e[1] + 4.6, 2.7], [e[0] + 76, e[1] + 8.6, 2.5]];
  /* vordere Teilstücke laufen an den Umkehrpunkten (y ≈ cy) weich in die hinteren über (Maske statt Schnittkante) */
  const mv = T.id("pmv");
  T.def(`<linearGradient id="${mv}g" gradientUnits="userSpaceOnUse" x1="0" y1="${cy - 2}" x2="0" y2="${cy + 4}"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${mv}" maskUnits="userSpaceOnUse" x="0" y="-80" width="260" height="90"><rect x="0" y="-80" width="260" height="90" fill="url(#${mv}g)"/></mask>`);
  let kv = "";
  for (const p of vorn) {
    /* Berührungsfuge: dunkle, weiche Fuge über jeder vorderen Windung (auf der dahinterliegenden) */
    kb += `<path d="${poly(p.filter((_, i) => i % 3 === 0).map(([x, y, r]) => [x, y - r * 0.9]))}" fill="none" stroke="#000" stroke-width="3.2" stroke-opacity=".32" stroke-linejoin="round" filter="${weich(T, "fu", 1)}"/>`.replace(/Z"/, '"');
    kv += rohrteil(p, 1);
  }
  kb += `<g mask="url(#${mv})">${kv}</g>`;
  h += `<g filter="${rund(T, "pw", { weich: 2, tiefe: 2.6 })}">${kb}</g>`;
  h += `<path d="M${R(hals[2][0])} ${R(hals[2][1] + 5)}Q${R(hals[4][0])} ${R(hals[4][1] + 6)} ${R(hals[6][0])} ${R(hals[6][1] + 4.4)}" fill="none" stroke="#000" stroke-width="3.4" stroke-opacity=".3" filter="${weich(T, "hs", 1)}"/>`;
  const mh = T.id("pmh");
  T.def(`<linearGradient id="${mh}g" gradientUnits="userSpaceOnUse" x1="${R(e0[0])}" y1="0" x2="${R(e[0] + 2)}" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${mh}" maskUnits="userSpaceOnUse" x="0" y="-80" width="260" height="90"><rect x="0" y="-80" width="260" height="90" fill="url(#${mh}g)"/></mask>`);
  h += `<g mask="url(#${mh})"><g filter="${rund(T, "pw", { weich: 2, tiefe: 2.6 })}">` + rohrteil(hals, -1, { schilde: 0.03 }) + "</g></g>";
  /* Kopf (lokal: x 0 = Hinterkopf, Schnauze bei x 10,6), keilförmig, Profil nach rechts, leicht von oben gesehen */
  const kp = [[0, -1.4], [0.8, -2.6], [2.6, -3.1], [5.4, -3.1], [8, -2.7], [10, -2], [11, -1.1], [11.2, -0.3], [10.8, 0.4], [9.6, 0.8], [7, 1.1], [4, 1.6], [1.6, 2.2], [0.2, 1.8], [-0.4, 0.4]];
  let ki = "";
  ki += `<g filter="${weich(T, "pk", 0.3)}">` + form(T, poly([[0.4, 1.8], [4, 1.4], [8, 0.9], [10.8, 0.3], [8, 0.4], [4, 0.9], [0.6, 1.1]]), "#000", ' opacity=".2"') + "</g>";
  /* heller Saum unter der Speerspitze, Speerspitze (Oberkopf, Spitze nach vorn zwischen die Augen) */
  ki += form(T, [[0, -1.2], [2.6, -2], [5.2, -2.4], [7.6, -2.85], [9.6, -2.3], [6, -1.9], [3, -1.4], [0.4, -0.5]], "#e4d2a4");
  ki += form(T, [[0, -1.8], [1, -2.9], [3, -3.15], [5.6, -3.1], [7.6, -2.95], [5.2, -2.45], [2.6, -2.05], [0.6, -1.2]], "#4c3620");
  /* Augenstreif Nasenloch → Auge → Mundwinkel, cremefarbene Lippen, dunkler Keil unter dem Auge */
  ki += form(T, [[10.7, -1.55], [8, -1.5], [6, -1.4], [3, -0.95], [0.4, -0.1], [0.2, 0.8], [3, 0.2], [6, -0.45], [8.2, -0.85], [10.8, -0.95]], "#45301a");
  ki += form(T, [[0.6, 1.15], [4, 0.45], [8, -0.25], [10.9, -0.45], [11, 0.3], [8, 0.75], [4, 1.35], [1, 1.85]], "#ece0c0");
  ki += form(T, [[6.1, -0.55], [7, -0.6], [6.8, 0.7], [6.2, 0.8]], "#45301a");
  if (F) ki += lippen(T, [[1.4, 1.35], [4, 0.85], [7, 0.45], [9.6, 0.2], [11, 0.05]], 11, -0.8, { w: 0.05, op: 0.45, opL: 0.3, fuge: "#2a1a0a" }) + lippen(T, [[0.8, 1.7], [4, 1.2], [7, 0.85], [9.6, 0.6]], 9, 0.6, { w: 0.05, op: 0.35, opL: 0.2, fuge: "#2a1a0a" });
  /* Wärmegruben: schräge Schlitze in Rostrale und vorderen Oberlippenschilden, Reihe in den hinteren Unterlippenschilden */
  ki += `<path d="M10.75 -.1l.14 .26M10.05 .08l.14 .26M9.3 .2l.14 .26M2.7 1.48l.1 .22M2 1.6l.1 .22M1.3 1.75l.1 .22" stroke="#1a0e06" stroke-width=".22" stroke-linecap="round"/>`;
  let kopf = teil(T, kp, "#bba270", { innen: ki, rand: "#1a1008", randA: 0.25, rw: 0.1 });
  kopf += linien(T, [[[11, 0.25], [8.6, 0.55], [5, 0.95], [2, 1.45], [0.6, 1.65]]], "#140a04", 0.09, 0.75);
  kopf += echsAuge(T, 6.6, -1.15, 0.6, { schlange: true, iris: "#c29646", iris2: "#3a2410", netz: "#2a1808", pupille: "schlitz", haut: "#45301a" });
  kopf += `<path d="M6 -1.1a.6 .6 0 0 0 1.2 0Z" fill="#000" opacity=".3"/>`;
  kopf += `<ellipse cx="10.5" cy="-1.85" rx=".26" ry=".18" fill="#140a04"/>`;
  const hE = hals[hals.length - 1], kx = hE[0] - 1.2, ky = hE[1] + 0.9;
  h += `<path d="M${R(kx + 0.5)} ${R(ky + 2.4)}l10 -.6" stroke="#000" stroke-width="2" stroke-opacity=".3" filter="${weich(T, "ks", 0.7)}"/>`;
  h += `<g filter="${rund(T, "pkk", { weich: 0.9, tiefe: 3, umgebung: 0.4 })}"><g transform="translate(${R(kx)} ${R(ky)}) rotate(6) scale(1.32)">${kopf}</g></g>`;
  const xs = P.map((p) => p[0]), ys = P.map((p) => p[1] - p[2]);
  return fertig(1.4, h, [Math.min(...xs) - 7, Math.min(...ys, ky - 4.5), Math.max(...xs, kx + 14.6) + 1, 0], null, [kx - 4, ky - 7, kx + 16, ky + 5]);
}

/* =====================================================================
   EIDECHSE (Zauneidechse, Lacerta agilis), Männchen im Frühjahr
   RECHERCHE: Gesamtlänge 18–24 cm (hier 22 cm); Schwanz ≈ 58–60 % der Gesamtlänge (1,4–1,5 × Kopf-Rumpf); gedrungen,
   kurze Beine, Spreizgang (Oberarm/Oberschenkel stehen seitlich ab, Ellbogen und Knie etwa auf Bauchhöhe, Bauch nah am
   Boden). Kopf des Männchens kräftig, Höhe ≈ 50–55 % der Kopflänge, Oberkopf flach, Schnauze stumpf-spitz, Schläfen-
   und Wangenregion geschwollen; sichtbarer Hals. Männchen im Frühjahr: Flanken, Kopfseiten und Vorderbeine leuchtend
   grün, Rücken und Schwanz braun; braunes Rückenband mit heller, unterbrochener Mittellinie und zwei hellen Seitenlinien,
   dazwischen 2–3 Reihen unregelmäßiger dunkelbrauner Flecken, etwa die Hälfte mit weißem Strich-Kern; Flanke mit wenigen
   kleineren Flecken; Bauch grünlich-gelb mit schwarzen Punkten. Rückenschuppen schmal und deutlich gekielt, Flanken-
   schuppen etwas größer, glatt; Bauchschilde rechteckig in 6–8 Längsreihen; Schwanz mit Ringen langer gekielter Schuppen.
   Kopfschilde: Rostrale, Internasale, Präfrontalia, Frontale, Parietalia, Supraocularia; seitlich Loreale, hohes
   Suboculare unter dem Auge, Oberlippenschilde, Massetericum auf der Schläfe, Ohröffnung (Trommelfell) auf Höhe der
   Mundlinie. Halsband aus vergrößerten Schuppen mit gezähntem Hinterrand. Auge: Lidränder aus Körnerschuppen, Iris
   rötlich-orangebraun, runde Pupille. Fünf lange, dünne Zehen mit feinen, hellen Krallen (Hinterfuß: 4. Zehe sehr lang).
   Zeichenraum: 1 Einheit = 0,1 cm (221 Einheiten = 22 cm).
   ===================================================================== */
function eidechse(T) {
  const F = T.fein;
  let h = "";
  const braun = ["#8c7752", "#6e5a3a", "#463822"], gruen = ["#86bc54", "#62983a", "#3a5e22"];
  /* ---------- ferne Beine: nur Zehenfächer und Unterarm/Unterschenkel, Körperton −25 % ---------- */
  const fernB = ["#6c5c3e", "#54462e", "#342a1a"], fernG = ["#5c8a3c", "#46702c", "#2c4818"];
  const zehen = (x, y, L, a0, da, b) => L.map((l, i) => { const a = (a0 + da * i) * Math.PI / 180; return [x, y - 0.25 * i, x + Math.cos(a) * l, Math.min(-0.35, y - 0.25 * i + Math.sin(a) * l), b]; });
  const zf1 = zehen(158.6, -1.2, [3.4, 5, 6.6, 8.6, 3.6], 6, -6, 0.62), zf2 = zehen(201.4, -1.2, [2.8, 3.8, 4.6, 4, 2.6], 10, -9, 0.6);
  h += `<g filter="${rund(T, "eb", { weich: 0.9, tiefe: 3 })}">` +
    reptilBein(T, { n: "ef1", ton: "efb", farben: fernB, ticks: false, glieder: [[[149, -7], [153.4, -7], [157.6, -3], [160.4, -1.6], [160.4, -0.3], [154.6, -0.3], [154.4, -2.2], [150.4, -4.4]]], zehen: zf1, krallen: zf1.slice(0, 4).map(([, , x, y]) => [x, y, 0.8, 0.22, 12, 0.4]), krallenFarbe: "#8a7a5a" }) +
    reptilBein(T, { n: "ef2", ton: "efg", farben: fernG, ticks: false, glieder: [[[195.4, -7.4], [199.4, -7.6], [201.6, -3.4], [203, -1.4], [202.6, -0.3], [197.6, -0.3], [197.6, -2.2], [196, -4.6]]], zehen: zf2, krallen: zf2.slice(0, 4).map(([, , x, y]) => [x, y, 0.7, 0.2, 14, 0.4]), krallenFarbe: "#8a7a5a" }) + "</g>";
  /* ---------- Rumpf + Schwanz (Schwanz ≈ 59 %, ruht in leichter Wellenlinie), Bauch nah am Boden ---------- */
  const sp = [[0, -0.5, 0.3, 0.3], [15, -1.1, 0.8, 0.8], [30, -1.2, 1.3, 1.3], [45, -1.7, 1.75, 1.75], [60, -2.6, 2.2, 2.2], [75, -3, 2.65, 2.65], [90, -3.6, 3.2, 3.1],
    [104, -4.8, 3.9, 3.7], [117, -6.4, 4.8, 4.5], [129, -8.4, 6, 5.4], [141, -9.8, 7, 6.1], [155, -10.4, 7.5, 6.5], [169, -10.6, 7.5, 6.5], [181, -10.8, 7, 6.2], [191, -11.4, 6, 5.6], [198, -12.4, 4.9, 4.6]];
  const zonenRand = (Rr, v, t0, t1, a, n = 30) => { const z = []; for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; z.push(Rr.P(t, v + Math.sin(i * 2.3) * a + (T.rnd() - 0.5) * a)); } return z; };
  const K = echsenKoerper(T, sp, { id: "e", basis: "#7e6a46", blur: 1.6, licht: 0.1, schatten: 0.24,
    zonen: [[-1.4, -0.42, "#7a6440"], [0.5, 1.4, "#b8a876"]],
    muster: (Rr, tx) => {
      const tB = tx(122), tS = tx(194);
      let s = "";
      /* grüne Flanke mit ausgefranstem Rand (läuft über dem Oberschenkel aus), gelbgrüner Bauch; Schwanzbasis graubraun */
      s += `<g filter="${weich(T, "eg", 0.9)}"><path d="${poly(zonenRand(Rr, -0.44, tB - 0.03, 0.995, 0.06).concat(zonenRand(Rr, 0.56, tB + 0.02, 0.995, 0.05).reverse()))}" fill="#6aa83c"/>` +
        `<path d="${poly(zonenRand(Rr, 0.56, tB, 0.995, 0.05).concat([Rr.P(0.995, 1.4), Rr.P(tB, 1.4)]))}" fill="#c4cf7c"/>` +
        `<path d="${poly([Rr.P(tB - 0.08, -0.3), Rr.P(tB, -0.4), Rr.P(tB + 0.02, 0.5), Rr.P(tB - 0.08, 0.4)])}" fill="#7d8a52" opacity=".6"/></g>`;
      /* helle, unterbrochene Mittellinie und zwei helle Seitenlinien */
      let dl = "";
      for (const v of [-0.94, -0.46]) for (let t = tB - 0.12; t < tS; t += 0.03 + T.rnd() * 0.012) { const a = Rr.P(t, v), b = Rr.P(t + 0.022 + T.rnd() * 0.008, v + (T.rnd() - 0.5) * 0.04); dl += `M${R(a[0])} ${R(a[1])}L${R(b[0])} ${R(b[1])}`; }
      s += `<path d="${dl}" stroke="#d8cea8" stroke-width=".8" stroke-opacity=".55" stroke-linecap="round" filter="${weich(T, "el", 0.2)}"/>`;
      /* unregelmäßige dunkelbraune Flecken, Größe 40–100 %, nur etwa die Hälfte mit weißem Strich-Kern */
      let dD = "", dW = "";
      const fl = (t, v, r, kern) => { const [x, y] = Rr.P(t, v), Q = []; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + T.rnd() * 0.6, rr = r * (0.65 + T.rnd() * 0.6); Q.push([x + Math.cos(a) * rr * 1.25, y + Math.sin(a) * rr * 0.8]); } dD += pfad(T, Q); if (kern) { const l = r * (0.25 + T.rnd() * 0.3); dW += `M${R(x - l / 2)} ${R(y + (T.rnd() - 0.5) * r * 0.3)}h${R(l)}`; } };
      for (let t = tB - 0.1; t < tS; t += 0.016 + T.rnd() * 0.02) { if (T.rnd() < 0.85) fl(t, -0.74 + (T.rnd() - 0.5) * 0.1, 1 + T.rnd() * 0.9, T.rnd() < 0.5); if (T.rnd() < 0.6) fl(t + 0.01, -0.62, 0.7 + T.rnd() * 0.6, T.rnd() < 0.4); }
      for (let t = tB + 0.03; t < tS - 0.02; t += 0.04 + T.rnd() * 0.02) if (T.rnd() < 0.7) fl(t, -0.1 + (T.rnd() - 0.5) * 0.4, 0.6 + T.rnd() * 0.5, T.rnd() < 0.6);
      for (let t = 0.32; t < tB; t += 0.04 + T.rnd() * 0.02) fl(t, -0.6 + (T.rnd() - 0.5) * 0.2, 0.6 + T.rnd() * 0.5, false);
      s += `<path d="${dD}" fill="#2e2010" opacity=".78"/><path d="${dW}" stroke="#f2eedc" stroke-width=".55" stroke-linecap="round" stroke-opacity=".9"/>`;
      if (F) {
        s += punkte(T, Rr.band(0.66, 1, tB + 0.02, tS, 8), 16, 0.45, "#1a1a0a", 0.6);
        /* Schuppen: Rücken schmal und gekielt, Flanke etwas größer und glatt, Bauchschilde mit hellen Fugen, Schwanzringe */
        s += form(T, poly(Rr.band(-1.2, -0.4, tB - 0.05, 1, 8)), musterBeulen(T, "ed", 0.95, { flach: 0.42, grund: 0.2, hell: 0.3, dunkel: 0.32 }));
        s += form(T, poly(Rr.band(-0.4, 0.6, tB - 0.03, 1, 8)), musterBeulen(T, "ef", 1.1, { flach: 0.75, grund: 0.12, hell: 0.2, dunkel: 0.26 }));
        const tsB = []; for (let t = tB; t < 0.99; t += 0.021) tsB.push(t);
        s += gitter(T, Rr, tsB, [0.6, 0.78, 0.94, 1.06], { versatz: true, w: 0.16, opS: 0.22, opL: 0.4, hell: "#f6f4d8", dunkel: "#3a3a1a", lichtQuer: false, schritt: 30 });
        const tsS = []; { let t = 0.02; while (t < tB + 0.02) { tsS.push(t); t += 0.0085 + t * 0.008; } }
        s += gitter(T, Rr, tsS, [-1.02, -0.6, -0.2, 0.2, 0.6, 1.02], { w: 0.12, opS: 0.4, licht: false, schritt: 30 });
        s += plattenG(T, Rr, tsS, [-1.02, -0.6, -0.2, 0.2], { sw: 0.12, fuge: 0.12, kiel: [0, 1, 2, 3], kw: 0.12, opK: 0.25, opKL: 0.38, grad: (j, z) => z < 0.4 ? plattenGrad(T, "eg2", false, 1.1) : plattenGrad(T, "eg", false, 0.8) });
      }
      return s;
    } });
  h += `<g filter="${rund(T, "er", { weich: 3.4, tiefe: 3.6, umgebung: 0.36 })}">${K.svg}</g>`;
  /* ---------- nahe Beine im Spreizgang: Oberschenkel/Oberarm als deckender Muskelwulst seitlich am Rumpf,
     Knie/Ellbogen auf Bauchhöhe, Unterschenkel schräg nach hinten-unten, Unterarm schräg nach vorn ---------- */
  const mE = F ? musterBeulen(T, "eb", 0.75, { grund: 0.12, hell: 0.22, dunkel: 0.28 }) : "";
  const zh = zehen(146.4, -1.4, [3.6, 5.4, 7.4, 10.6, 4.2], 4, -6, 0.68), zv = zehen(190, -1.3, [3, 4.4, 5.4, 4.8, 3], 14, -10, 0.64);
  h += `<g filter="${rund(T, "eb", { weich: 0.9, tiefe: 3 })}">` + reptilBein(T, { n: "eh", ton: "nh", farben: braun, muster: mE,
    glieder: [[[127, -12.4], [133, -14.4], [141, -13.4], [147.6, -9.6], [149, -6.4], [146.4, -5], [140, -6.4], [132, -8.2], [127.6, -9.6]],
      [[144.4, -7.4], [149.2, -7], [147.8, -4.2], [145.6, -2.2], [142.4, -2.2], [142.8, -4.4]],
      [[141, -3], [145.8, -3], [148.4, -1.8], [148.6, -0.3], [140.6, -0.3], [140.4, -1.8]]],
    innen: [fleck(T, "l", 136, -12, 5, 1.6, 10, 0.3) + fleck(T, "d", 140, -7, 6, 1.4, 10, 0.3), "", ""],
    zehen: zh, krallen: zh.map(([, , x, y], i) => [x, y, 0.95, 0.26, 10 - i * 3, 0.45]), krallenFarbe: "#b4a27c",
    kanten: [[[141, -13.4], [147.6, -9.6], [149, -6.4]], [[127.6, -9.6], [132, -8.2], [140, -6.4]]],
    falten: [[[127.6, -12.2], [129, -10.6]], [[144, -7.2], [146.4, -6.4], [148.8, -6.8]]] }) + "</g>";
  h += `<g filter="${rund(T, "eb", { weich: 0.9, tiefe: 3 })}">` + reptilBein(T, { n: "ev", ton: "nv", farben: gruen, muster: mE,
    glieder: [[[180, -13], [186.4, -13.4], [188.4, -10.4], [185, -6.8], [181.4, -5.6], [179.4, -7.4], [179.6, -10.4]],
      [[179.6, -7.8], [183.8, -8], [186.6, -4.6], [188.2, -2.4], [185, -2], [183, -4.4]],
      [[184.4, -2.8], [188.8, -2.9], [191, -1.6], [191.2, -0.3], [184, -0.3], [183.8, -1.6]]],
    innen: [fleck(T, "l", 183, -11.4, 3, 1.4, -20, 0.3), "", ""],
    zehen: zv, krallen: zv.map(([, , x, y], i) => [x, y, 0.8, 0.24, 18 - i * 6, 0.45]), krallenFarbe: "#b4a27c",
    kanten: [[[186.4, -13.4], [188.4, -10.4], [185, -6.8]], [[179.6, -10.4], [179.4, -7.4], [181.4, -5.6]]],
    falten: [[[180.2, -6.6], [182.4, -5.8], [184.6, -6.4]], [[185, -3], [186.8, -2.6], [188.6, -2.9]]] }) + "</g>";
  /* Rumpf wirft Schatten auf die Oberseite der Beine */
  h += `<path d="M128 -13.4Q138 -12 146 -13.4M180 -13.6Q185 -12.6 189 -13.6" fill="none" stroke="#000" stroke-width="1.4" stroke-opacity=".22" filter="${weich(T, "es", 0.6)}"/>`;

  /* ---------- Kopf: flach (Höhe ≈ 52 % der Länge), stumpf-spitze Schnauze, geschwollene Wange, Hals sichtbar ---------- */
  const kp = [[195.6, -17.2], [199, -19.4], [204, -20.4], [210, -20.2], [215, -19], [219, -17.2], [221, -15.2], [221.3, -13.4], [220.2, -12.2], [216, -11.4], [210, -10.6], [205, -9.6], [200.6, -9.2], [197, -9.8], [195, -12.6]];
  let ki = `<g filter="${weich(T, "ek", 0.8)}">` + form(T, poly([[195.6, -14], [202, -15.6], [210, -15.4], [219, -14.6], [220.6, -12.6], [214, -11.6], [204, -10], [197, -10.6]]), "#6aa83c", ' opacity=".85"') +
    form(T, poly([[197, -10.4], [205, -10.2], [214, -11.6], [220, -12.4], [216, -11.2], [205, -9.4], [199, -9.2]]), "#c6d07e", ' opacity=".7"') + "</g>";
  /* Kopfschilde (Seitenansicht): Supraocularrand, Canthus, Loreale, Nasale, hohes Suboculare, Oberlippenschilde,
     Massetericum auf der Schläfe, Kanten der Oberseitenschilde; jede Naht dunkel mit heller Kante */
  const sch = [[[206.4, -17.8], [208.4, -18.7], [211, -18.8], [213.2, -18]], [[213.2, -18], [216.4, -17.4], [219.4, -16.4]], [[213.6, -17.8], [213.4, -14.4]], [[216.6, -17.2], [216.4, -14]],
    [[218.4, -16.4], [218.2, -14]], [[207.8, -13.6], [208.4, -11.6]], [[212.8, -13.8], [212.4, -11.6]], [[207.8, -13.6], [210.4, -13.3], [212.8, -13.8]],
    [[215, -14.2], [215, -12.2]], [[217.4, -14], [217.4, -12.4]], [[219.4, -13.8], [219.6, -12.6]], [[205.6, -13.2], [205.4, -11]], [[203.2, -12.8], [203, -10.6]],
    [[204, -20.4], [204.4, -19.2]], [[209.4, -20.3], [209.2, -19.2]], [[214.6, -19.1], [214.2, -18.2]], [[199.6, -19.2], [200.6, -17.8]]];
  ki += linien(T, sch, "#1e1a0c", 0.16, 0.45) + (F ? linien(T, sch.map((p) => p.map(([x, y]) => [x + 0.15, y + 0.18])), "#f4f0d2", 0.12, 0.35) : "");
  ki += `<circle cx="202.4" cy="-14.4" r="1.3" fill="${beulenGrad(T, "em", 0.16, 0.18)}" stroke="#1e1a0c" stroke-width=".12" stroke-opacity=".35"/>`;
  if (F) ki += lippen(T, [[201.6, -11.6], [206, -11.4], [211, -11.8], [216, -12.2], [220.6, -12.8]], 9, -1.6, { w: 0.14, op: 0.4, opL: 0.35 }) + lippen(T, [[201, -10.6], [206, -10.4], [212, -11.1], [218, -11.8]], 8, 1.2, { w: 0.12, op: 0.3, opL: 0.25 });
  const mk = T.id("ekm");
  T.def(`<linearGradient id="${mk}g" gradientUnits="userSpaceOnUse" x1="193.4" y1="0" x2="197.4" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${mk}" maskUnits="userSpaceOnUse" x="186" y="-25" width="40" height="20"><rect x="186" y="-25" width="40" height="20" fill="url(#${mk}g)"/></mask>`);
  h += `<g mask="url(#${mk})"><g filter="${rund(T, "ek", { weich: 2.2, tiefe: 3.4, umgebung: 0.38 })}">` + teil(T, kp, "#806a44", { innen: ki, rand: "#14100a", randA: 0.28, rw: 0.18, kante: [kp.slice(0, 13)] }) + "</g></g>";
  /* Mundspalte: endet unter der Schläfe mit leichter Abwärtsbiegung */
  h += linien(T, [[[221, -12.8], [216, -12.2], [211, -11.7], [206, -11.3], [202.4, -11], [200.2, -10.2]]], "#120c06", 0.24, 0.75);
  /* Ohröffnung: eingesenktes Trommelfell auf Höhe der Mundlinie, Innenschatten oben, Lichtkante unten */
  h += `<ellipse cx="197.8" cy="-12.2" rx="1.05" ry="1.5" fill="#4a3c22"/><ellipse cx="197.8" cy="-12.6" rx=".95" ry="1.05" fill="#000" opacity=".4"/>` + linien(T, [[[196.9, -11.2], [197.8, -10.75], [198.7, -11.2]]], "#e8e0c0", 0.18, 0.5);
  /* Halsband: Querreihe vergrößerter Schuppen mit gezähntem Hinterrand an der Kehlkontur */
  let hb = "";
  for (let i = 0; i < 5; i++) { const x = 191.2 + i * 1.3, y = -7.9 - i * 0.38; hb += `M${R(x)} ${R(y - 0.6)}l1.3 -.25l-.1 .9l-.55 .35l-.65 -.2Z`; }
  h += `<path d="${hb}" fill="#9cac62" stroke="#2a2a14" stroke-width=".12" stroke-opacity=".4"/>`;
  h += `<ellipse cx="219.2" cy="-15.6" rx=".55" ry=".45" fill="#120c06"/>`;
  h += echsAuge(T, 210.2, -15.8, 1.5, { iris: "#b6622a", iris2: "#4a1e08", netz: "#5a2808", pupille: "rund", pupR: 0.42, offen: 0.74, wulst: "#7a6440", lid: "#2a2414", korn: "#c8c094" });
  return fertig(0.1, h, [0, -20.6, 221.3, 0], [144, 152, 187, 200], [192, -23, 223, -6]);
}

/* =====================================================================
   LEGUAN (Grüner Leguan, Iguana iguana), erwachsenes Männchen
   RECHERCHE: 1,2–1,8 m (hier 1,5 m), Schwanz ≈ 2/3 der Länge (seitlich abgeflacht, peitschenartig, 6–10 schwarzbraune
   Ringe), Schwanzbasis beim Männchen verdickt. Körper kräftig, Bauch rundlich; Kamm aus langen, flachen, leicht nach
   hinten gebogenen Stachelschuppen, am höchsten im Nacken/an der Schulter (~6–7 % der Kopf-Rumpf-Länge), zum Becken
   kleiner, auf dem Schwanz als kleine Zähne bis zur Mitte. Hinter dem Kopf 3–6 große kegelige Nackenhöcker und
   verstreute große Höckerschuppen seitlich am Hals. Große, halbrunde, senkrecht herabhängende Kehlwamme (Männchen,
   ≈ 0,8 × Kopflänge tief) mit 10–14 dreieckigen Stachelschuppen an der Vorderkante. Kopf: Höhe ≈ 65 % der Länge, flacher
   Oberkopf, kurz abfallende stumpfe Schnauze, kräftige Kiefermuskeln (Hängebacken), Brauenwulst über dem Auge, große
   Schilde auf der Schnauze, Scheitelauge; großes rundes Nasenloch nahe der Spitze. Großes, glattes, leicht eingesenktes
   Trommelfell; darunter, hinter dem Mundwinkel, der große, flache, rund-ovale Subtympanalschild (Ø ≈ 22 % der
   Kopflänge, perlmuttgrau-grünlich) – Kennzeichen der Art. Auge mit runder Pupille, Iris goldorange, Lider aus
   Körnerschuppen. Beine kräftig, Spreizhaltung, lange Finger/Zehen mit langen, stark gebogenen dunklen Kletterkrallen,
   Hinterfuß 4. Zehe sehr lang. Farbe: grün mit grau- und blaugrünen Tönen (#5E8C4A / #7FA36A), 3–5 schwache schräge
   dunkle Querbinden auf dem Rumpf, Kopf und Kehle heller; Männchen mit leichtem Orangeton an Beinen und Kammspitzen.
   Zeichenraum: 1 Einheit = 0,5 cm (300 Einheiten = 1,5 m).
   ===================================================================== */
function leguan(T) {
  const F = T.fein;
  let h = "";
  const sp = [[0, -3.2, 0.4, 0.4], [30, -4.2, 1, 1], [60, -5.4, 1.8, 1.8], [95, -7.4, 2.8, 2.7], [130, -10, 3.9, 3.7], [160, -12.8, 5.2, 4.9], [184, -15.6, 6.8, 6.4], [200, -18.4, 8.4, 8],
    [214, -21, 10.4, 9.8], [230, -22.4, 11.6, 11.4], [246, -23, 11.6, 11.2], [258, -23.6, 10.4, 9.4], [268, -24.6, 8.6, 7.8], [279, -25.6, 7.4, 7]];
  const zehen = (x, y, L, a0, da, b) => L.map((l, i) => { const a = (a0 + da * i) * Math.PI / 180; return [x, y - 0.3 * i, x + Math.cos(a) * l, Math.min(-0.5, y - 0.3 * i + Math.sin(a) * l), b]; });
  /* ---------- ferne Beine: gleiche Bauart, Körperton −25 %, als Zehenfächer mit Krallen ---------- */
  const fernF = ["#557a46", "#43633a", "#2a4026"];
  const zf1 = zehen(273.4, -1.6, [4, 6, 7, 5.4, 3.4], 18, -12, 1), zf2 = zehen(212, -1.6, [4.4, 7, 9.4, 13, 5], 8, -6, 1.05);
  h += `<g filter="${rund(T, "lb", { weich: 1.6, tiefe: 3.2 })}">` +
    reptilBein(T, { n: "lf1", ton: "lf", farben: fernF, ticks: false, glieder: [[[262, -18], [268.6, -18.4], [270.4, -12], [273.6, -4], [274.6, -1.6], [270, -1], [268, -4.4], [264, -12]]],
      zehen: zf1, krallen: zf1.slice(0, 4).map(([, , x, y], i) => [x, y, 1.6, 0.42, 40 - i * 8, 0.6]), krallenFarbe: "#2a2418" }) +
    reptilBein(T, { n: "lf2", ton: "lf", farben: fernF, ticks: false, glieder: [[[202, -16], [209, -15], [210.6, -9], [212.4, -3], [213, -1.4], [207.6, -1], [206.4, -4.6], [203.6, -10]]],
      zehen: zf2, krallen: zf2.slice(0, 4).map(([, , x, y], i) => [x, y, 1.7, 0.45, 30 - i * 6, 0.6]), krallenFarbe: "#2a2418" }) + "</g>";
  /* ---------- Rücken-/Nackenkamm: lange flache Stachelschuppen, am höchsten an Nacken und Schulter ---------- */
  const K0 = rohr(sp, 5);
  const tx0 = (x) => { let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (K0.P(m, 0)[0] < x) lo = m; else hi = m; } return (lo + hi) / 2; };
  {
    let d = "", dL = "";
    const t0 = tx0(95), t1 = tx0(281);
    for (let t = t0; t < t1; t += 0.0046 + T.rnd() * 0.0022) {
      const x = K0.P(t, 0)[0], u = x < 200 ? (x - 95) / 105 * 0.4 : x < 262 ? 0.4 + (x - 200) / 62 * 0.6 : 1 - (x - 262) / 19 * 0.25;
      const H = (x < 200 ? 0.8 + u * 3.6 : 2.2 + u * 3.8) * (0.82 + 0.36 * T.rnd());
      const [, , nx, ny] = K0.at(t), a = K0.P(t, -0.95), b = K0.P(t + 0.004, -0.95);
      const sx = a[0] + nx * H - H * 0.42, sy = a[1] + ny * H;
      d += `M${R(a[0])} ${R(a[1])}Q${R((a[0] + sx) / 2 + 0.1)} ${R((a[1] + sy) / 2 - 0.2)} ${R(sx)} ${R(sy)}Q${R((b[0] + sx) / 2 + 0.5)} ${R((b[1] + sy) / 2 + 0.2)} ${R(b[0])} ${R(b[1])}Z`;
      if (F && x > 180) dL += `M${R(a[0] + 0.1)} ${R(a[1] - 0.3)}L${R(sx + 0.1)} ${R(sy + 0.4)}`;
    }
    h += `<path d="${d}" fill="${T.lg("lkamm", [[0, "#c8b47a"], [0.35, "#7e9c5c"], [1, "#4a6e38"]])}" stroke="#1e2a12" stroke-width=".14" stroke-opacity=".4"/>` + (dL ? `<path d="${dL}" stroke="#f4f0cc" stroke-width=".16" stroke-opacity=".5"/>` : "");
  }
  /* ---------- Rumpf + Schwanz ---------- */
  const K = echsenKoerper(T, sp, { id: "l", basis: "#5e8c4a", blur: 1.6, licht: 0.1, schatten: 0.22,
    zonen: [[-1.4, -0.4, "#4f7a40"], [0.5, 1.4, "#a8bc8a"], [-1.4, 1.4, "#6e8a6a", 0.35, 0, 0.6], [-0.2, 0.6, "#7fa36a", 0.7, 0.62, 1]],
    muster: (Rr, tx) => {
      let s = "", d = "";
      /* Schwanzringe (schwarzbraun), umlaufend gebogen */
      for (const t of [0.06, 0.13, 0.2, 0.27, 0.34, 0.41, 0.48, 0.55]) { const w = 0.011 + t * 0.012; d += pfad(T, [Rr.P(t - w, -1.3), Rr.P(t + w, -1.3), Rr.P(t + w * 2, 0), Rr.P(t + w, 1.3), Rr.P(t - w, 1.3), Rr.P(t + w * 0.1, 0)]); }
      s += `<path d="${d}" fill="#22281a" opacity=".6" filter="${weich(T, "lr", 0.6)}"/>`;
      /* schwache schräge Querbinden auf dem Rumpf */
      let b = "";
      for (const x of [214, 228, 242, 256]) { const t = tx(x); b += pfad(T, [Rr.P(t - 0.008, -1.2), Rr.P(t + 0.01, -1.2), Rr.P(t + 0.024, 0.5), Rr.P(t + 0.006, 0.5)]); }
      s += `<path d="${b}" fill="#2a4422" opacity=".3" filter="${weich(T, "lb", 1)}"/>`;
      if (F) {
        s += `<path d="${pfad(T, Rr.band(-1.1, 0.55, tx(150), 1, 12))}" fill="${musterBeulen(T, "lg", 0.85, { flach: 0.75, grund: 0.12, hell: 0.2, dunkel: 0.26 })}"/>`;
        /* Bauch: glatte Schuppen in Querreihen */
        const tsB = []; for (let t = tx(200); t < 0.99; t += 0.009) tsB.push(t);
        s += gitter(T, Rr, tsB, [0.56, 0.74, 0.9, 1.04], { versatz: true, w: 0.12, opS: 0.24, opL: 0.3, hell: "#f0f6d8", lichtQuer: false, schritt: 30 });
        /* Schwanz: Ringe gekielter Schuppen; Oberkante hell, Unterkante dunkler (seitlich abgeflacht) */
        const tsS = []; for (let t = 0.02; t < tx(200); t += 0.0072) tsS.push(t);
        s += gitter(T, Rr, tsS, [-1.02, -0.5, 0, 0.5, 1.02], { w: 0.12, opS: 0.3, licht: false, schritt: 40 });
        s += plattenG(T, Rr, tsS.filter((_, i) => i % 2 === 0), [-1.02, -0.5, 0], { sw: 0.12, fuge: 0.12, kiel: [0, 1], kw: 0.14, opK: 0.25, opKL: 0.3, grad: () => plattenGrad(T, "lp", false, 0.9) });
      }
      s += `<path d="${poly(Rr.band(-1.1, -0.82, 0, 0.66, 12))}" fill="#e8f4c8" opacity=".14" filter="${weich(T, "lo", 0.5)}"/><path d="${poly(Rr.band(0.78, 1.1, 0, 0.66, 12))}" fill="#000" opacity=".16" filter="${weich(T, "lo", 0.5)}"/>`;
      return s;
    } });
  h += `<g filter="${rund(T, "lr", { weich: 4, tiefe: 3.6, umgebung: 0.36 })}">${K.svg}</g>`;
  /* große Höckerschuppen seitlich am Hals und 3–6 kegelige Nackenhöcker hinter dem Kopf */
  if (F) h += beulen(T, [[266, -28], [276, -30], [280, -20], [268, -17]], 2.6, { flach: 0.9, dichte: 0.5, grads: [beulenGrad(T, "lh", 0.38, 0.36)], groesse: () => 0.8 });
  { let d = ""; for (const [x, y, r] of [[272.6, -33.2, 1.4], [270, -32.4, 1.2], [275, -31.8, 1.1], [268.4, -30.6, 1]]) d += `M${R(x - r)} ${R(y + r * 0.5)}Q${R(x - r * 0.2)} ${R(y - r * 1.6)} ${R(x + r)} ${R(y + r * 0.5)}Z`; h += `<path d="${d}" fill="${T.lg("lnh", [[0, "#d6e4b0"], [1, "#4e7a3c"]])}" stroke="#1e2a12" stroke-width=".15" stroke-opacity=".4"/>`; }

  /* ---------- Kehlwamme: senkrechter, halbrunder Hautfächer vom Kinn bis zur Brust, Stachelreihe vorn ---------- */
  const wv = polyl([[295.6, -19.8], [294.8, -16], [292.6, -12], [289, -8.8], [284.4, -7.2]]);
  const wamme = [[295.6, -19.8], [294.8, -16], [292.6, -12], [289, -8.8], [284.4, -7.2], [280.4, -8], [277.4, -10.8], [275.6, -14.6], [276.4, -18], [284, -19.2]];
  let wi = `<path d="M276 -12Q282 -9.6 290 -9.6" fill="none" stroke="#000" stroke-width="3" stroke-opacity=".18" filter="${weich(T, "wf", 1)}"/>`;
  wi += linien(T, [[[293, -17.6], [288.6, -12.6], [282.6, -9]], [[290, -18.6], [285, -14.4], [278.6, -12.2]], [[286, -19], [281.4, -16.4], [277, -15.6]]], "#2a3a1e", 0.2, 0.3) + linien(T, [[[292.6, -17.9], [288.2, -12.9], [282.2, -9.3]], [[289.6, -18.9], [284.6, -14.7], [278.2, -12.5]]], "#eef6d8", 0.16, 0.25);
  if (F) wi += `<path d="${pfad(T, wamme)}" fill="${musterBeulen(T, "lw", 0.55, { grund: 0.1, hell: 0.2, dunkel: 0.24 })}"/>`;
  h += `<g filter="${rund(T, "lw", { weich: 1.4, tiefe: 2.6, umgebung: 0.42 })}">` + teil(T, wamme, "#8ab06a", { innen: wi, rand: "#1e2a12", randA: 0.25, rw: 0.2 }) + "</g>";
  let st = "";
  for (let i = 0; i < 12; i++) { const [x, y, nx, ny] = wv.at((i + 0.5) / 12), H = 1.9 - i * 0.1, b = 0.9 - i * 0.03; st += `M${R(x - ny * b * 0.5)} ${R(y + nx * b * 0.5)}L${R(x - nx * H + 0.4)} ${R(y - ny * H)}L${R(x + ny * b * 0.5)} ${R(y - nx * b * 0.5)}Z`; }
  h += `<path d="${st}" fill="${T.lg("lst", [[0, "#eef4d4"], [1, "#9ab878"]], 1, 0, 0, 0)}" stroke="#1e2a12" stroke-width=".12" stroke-opacity=".45"/>`;
  /* Schatten der Wamme auf Brust und Vorderbein */
  h += `<path d="M275 -14Q272 -9 268 -7" fill="none" stroke="#000" stroke-width="3" stroke-opacity=".2" filter="${weich(T, "ws", 1)}"/>`;

  /* ---------- nahe Beine: Spreizhaltung, Muskelwulst, lange Finger/Zehen mit dunklen Kletterkrallen ---------- */
  const mL = F ? musterBeulen(T, "lb", 0.75, { grund: 0.12, hell: 0.2, dunkel: 0.26 }) : "";
  const nahF = ["#8ab26a", "#6a904e", "#3c5a2e"];
  const zh = zehen(219, -1.8, [5, 8, 11, 16, 6], 6, -5, 1.15), zv = zehen(267.6, -1.8, [4.6, 6.6, 8, 6.4, 4], 16, -11, 1.1);
  h += `<g filter="${rund(T, "lb", { weich: 1.6, tiefe: 3.2 })}">` + reptilBein(T, { n: "lh", ton: "lh", farben: nahF, muster: mL, maske: [-24, -18],
    glieder: [[[200, -22], [210, -25.4], [220, -22.4], [226, -16], [226.4, -11.4], [222.4, -9.6], [214, -12.4], [205, -15.4], [199.6, -18]],
      [[219.6, -14.4], [226.6, -13.2], [223, -6.6], [221.6, -2.6], [216.4, -2.4], [216.6, -6.6]],
      [[214.6, -3.6], [220.6, -3.6], [224, -2.2], [224.4, -0.4], [214.2, -0.4], [214, -2]]],
    innen: [fleck(T, "l", 213, -21, 7, 2.4, -14, 0.3) + fleck(T, "d", 214, -13.6, 8, 1.8, -14, 0.35), "", ""],
    zehen: zh, krallen: zh.map(([, , x, y], i) => [x, y, 2, 0.5, 28 - i * 5, 0.7]), krallenFarbe: "#2a2418",
    kanten: [[[220, -22.4], [226, -16], [226.4, -11.4], [223, -6.6], [221.6, -2.8]], [[205, -15.4], [214, -12.4], [222.4, -9.6]]],
    falten: [[[220.4, -12.6], [222.8, -11.6], [225.6, -12.4]], [[216.6, -3.6], [218.8, -3], [221, -3.6]]] }) + "</g>";
  h += `<g filter="${rund(T, "lb", { weich: 1.6, tiefe: 3.2 })}">` + reptilBein(T, { n: "lv", ton: "lv", farben: nahF, muster: mL, maske: [-26, -20],
    glieder: [[[256, -27], [266, -26], [266.4, -20], [261.4, -13], [257.6, -11], [254.6, -13.4], [256, -19]],
      [[255.2, -13.4], [260.2, -14.2], [264, -8], [267.4, -3], [263.4, -2.2], [259.4, -7.4]],
      [[262.6, -3.4], [267.6, -3.4], [270.4, -2], [270.6, -0.4], [262.2, -0.4], [262, -1.8]]],
    innen: [fleck(T, "l", 261, -22, 4, 2.6, -30, 0.3), "", ""],
    zehen: zv, krallen: zv.map(([, , x, y], i) => [x, y, 1.8, 0.48, 40 - i * 8, 0.7]), krallenFarbe: "#2a2418",
    kanten: [[[266.4, -20], [261.4, -13], [260.2, -14.2], [264, -8], [267.4, -3.2]], [[254.6, -13.4], [259.4, -7.4], [262.4, -3.4]]],
    falten: [[[255.6, -12.4], [258, -11.4], [260.6, -12.4]], [[263.4, -3.4], [265.4, -2.8], [267.4, -3.4]]] }) + "</g>";

  /* ---------- Kopf: Höhe ≈ 65 % der Länge, flacher Oberkopf, stumpfe Schnauze, Hängebacken ---------- */
  const kp = [[275.6, -29.6], [280.4, -33.2], [286.6, -34], [292, -32.8], [296.6, -30], [299.6, -26.6], [300.8, -23.8], [300, -21.6], [296.2, -20.2], [290, -19.4], [285, -18.6], [280.6, -17.4], [276.6, -18.6], [275, -23.6]];
  let ki = `<g filter="${weich(T, "lk", 0.8)}">` + form(T, poly([[277, -30.6], [282, -33.4], [292, -32.6], [299, -26.6], [292, -28], [284, -29.6], [278, -28]]), "#fff", ' opacity=".16"') +
    form(T, poly([[277, -18.6], [288, -19.6], [298, -20.6], [294, -22.4], [284, -21.6], [278, -21]]), "#000", ' opacity=".16"') + "</g>";
  /* große Schnauzen- und Kopfschilde, Lippenschilde als gewölbte Reihe, Brauenwulst */
  const fu = [[[285.6, -33.8], [286.2, -31.4], [290.4, -31.2], [291.4, -33.2]], [[291.4, -33.2], [293, -31], [296, -29.6]], [[290.4, -31.2], [292.6, -28.6]], [[293, -31], [295.8, -28.6], [298.6, -26.2]],
    [[294.4, -27.2], [296.6, -25.2]], [[296.6, -25.2], [299.6, -24.6]], [[281.4, -32.8], [282.6, -30.4], [286.2, -31.4]], [[278.4, -30.8], [280.4, -29.2]]];
  ki += linien(T, fu, "#1e2a12", 0.16, 0.42) + (F ? linien(T, fu.map((p) => p.map(([x, y]) => [x + 0.16, y + 0.18])), "#eef6d8", 0.12, 0.32) : "");
  if (F) ki += lippen(T, [[284.6, -21.4], [289, -21.6], [293, -21.9], [297, -22.3], [300.4, -22.8]], 9, -2, { w: 0.14, op: 0.4, opL: 0.35, fuge: "#1e2a12" }) + lippen(T, [[284.6, -20.6], [289, -20.4], [293, -20.6], [297, -20.8]], 7, 1.2, { w: 0.12, op: 0.3, opL: 0.25, fuge: "#1e2a12" });
  if (F) ki += `<path d="${pfad(T, kp)}" fill="${musterBeulen(T, "lkb", 0.55, { grund: 0.06, hell: 0.14, dunkel: 0.16 })}"/>`;
  /* Scheitelauge als heller Punkt */
  ki += `<ellipse cx="282.6" cy="-33.2" rx=".7" ry=".35" fill="#dfe8c8" opacity=".8"/>`;
  /* Trommelfell: groß, glatt, rund, leicht eingesenkt mit Innenschatten oben */
  ki += `<ellipse cx="279.6" cy="-26.2" rx="2.2" ry="2.4" fill="#7e9468"/><ellipse cx="279.6" cy="-26.8" rx="2" ry="1.7" fill="#000" opacity=".22" filter="${weich(T, "lt", 0.4)}"/><path d="M277.8 -24.6Q279.6 -23.4 281.4 -24.6" fill="none" stroke="#f4f8e6" stroke-width=".2" stroke-opacity=".5"/>`;
  /* Subtympanalschild: flach, groß, rund-oval, perlmutt grau-grünlich, weicher Glanz oben links; 2–3 kleinere Schilde */
  ki += `<ellipse cx="280.6" cy="-20.9" rx="2.7" ry="2.35" fill="${T.rg("subt", [[0, "#cdd6be"], [0.6, "#a8b896"], [1, "#86a070"]], 0.34, 0.3, 0.8)}" stroke="#1e2a12" stroke-width=".18" stroke-opacity=".4"/>` +
    `<ellipse cx="279.6" cy="-21.9" rx="1.3" ry=".6" fill="#fff" opacity=".14" filter="${weich(T, "lsg", 0.3)}"/>` +
    `<circle cx="283.8" cy="-21.6" r=".9" fill="#9eb488" stroke="#1e2a12" stroke-width=".1" stroke-opacity=".3"/><circle cx="277.4" cy="-19.6" r=".8" fill="#9eb488" stroke="#1e2a12" stroke-width=".1" stroke-opacity=".3"/><circle cx="282.6" cy="-18.8" r=".7" fill="#9eb488" stroke="#1e2a12" stroke-width=".1" stroke-opacity=".3"/>`;
  const mk = T.id("lkm");
  T.def(`<linearGradient id="${mk}g" gradientUnits="userSpaceOnUse" x1="272.6" y1="0" x2="277.4" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${mk}" maskUnits="userSpaceOnUse" x="265" y="-40" width="40" height="28"><rect x="265" y="-40" width="40" height="28" fill="url(#${mk}g)"/></mask>`);
  h += `<g mask="url(#${mk})"><g filter="${rund(T, "lk", { weich: 3, tiefe: 3.4, umgebung: 0.38 })}">` + teil(T, kp, "#86ae66", { innen: ki, rand: "#1e2a12", randA: 0.28, rw: 0.2, kante: [kp.slice(0, 12)] }) + "</g></g>";
  h += linien(T, [[[300.4, -22.4], [296, -21.4], [291, -21], [286.6, -20.8], [284.6, -21.4]]], "#121a0a", 0.26, 0.75);
  /* großes rundes Nasenloch nahe der Spitze in einem Ring aus Nasenschild */
  h += `<circle cx="298.2" cy="-27" r="1.1" fill="#9cba7c" stroke="#1e2a12" stroke-width=".16" stroke-opacity=".4"/><circle cx="298.3" cy="-27" r=".55" fill="#121a0a"/>`;
  h += echsAuge(T, 289, -28.4, 1.65, { iris: "#d88a2c", iris2: "#6a3810", netz: "#7a3c10", pupille: "rund", pupR: 0.4, offen: 0.74, wulst: "#7aa25a", lid: "#2a3018", korn: "#cfd8b0" });
  return fertig(0.5, h, [0, -35, 300.8, 0], [212, 270, 219, 266], [266, -37, 303, -3]);
}

/* =====================================================================
   KOMODOWARAN (Varanus komodoensis)
   RECHERCHE: größte Echse; Männchen ~2,6–3 m, 80–90 kg (hier 2,9 m). Schwanz etwa so lang wie Kopf + Rumpf, seitlich
   abgeflacht, niedriger Doppelkiel oben im hinteren Drittel, Spitze schleift. Körper gegliedert: Erhebung über dem
   Becken, leicht durchhängender Rücken, Erhebung an der Schulter, dann ein LANGER, kräftiger Hals (≈ 1,0–1,2 ×
   Kopflänge), der zum Kopf abfällt (Kopfoberkante ≈ 75 % der Schulterhöhe). Kopf lang, flach und breit, gerundete
   Schnauze, Nasenloch nahe der Spitze, kräftiger Kiefermuskelwulst hinter dem Auge, Kehlfalten; die gesägten Zähne
   liegen bei geschlossenem Maul im Zahnfleisch verborgen; lange Mundspalte, Mundwinkel weit hinter dem Auge, leicht
   abwärts. Lange, tief gegabelte, gelb-orange Zunge (rosa Ansatz). Auge klein, tief unter dem Brauenwulst, Iris
   dunkel braun-gelb, runde Pupille, Lidränder aus Körnerschuppen; Trommelfell flach eingesenkt hinter/über dem
   Mundwinkel. Haut wie ein Kettenhemd: kleine gewölbte Perlschuppen mit Knochenplättchen (Osteoderme), am Hals in
   Ringreihen, an den Beinen größer, am Kopf flache vieleckige Schildchen, am Schwanz längliche Schuppen in Ringen;
   tiefe Querfalten am Hals, hängende faltige Kehle, Schulter- und Flankenfalte. Spreizgang: Oberarm schräg nach
   hinten-außen, Ellbogen hinten, Hand flach nach außen-vorn, 5 lange Finger mit großen gebogenen dunklen Krallen;
   Hinterbein mit kräftigem Oberschenkel, Knie vorn-außen, langer Fuß. Farbe: graubraun bis schiefergrau, Ocker-/Rost-
   anflug an Kopf, Kehle und Hals (#7A6A4F), Unterseite heller graugelb, Beine erdverschmutzt, leichte helle Sprenkel.
   Zeichenraum: 1 Einheit = 1 cm.
   ===================================================================== */
function komodowaran(T) {
  const F = T.fein;
  let h = "";
  const sp = [[0, -1, 0.4, 0.4], [25, -2.4, 1.6, 1.6], [50, -4.6, 3, 3], [75, -8, 4.6, 4.4], [100, -13, 6.4, 6], [122, -19, 8.6, 8], [140, -25, 11.6, 10.6], [152, -27.6, 13, 12],
    [168, -28.6, 13.4, 13.6], [184, -28.8, 13.6, 14.2], [200, -29.6, 14, 13.6], [214, -31, 13.4, 12], [226, -31, 11, 10.6], [238, -30, 9, 10.2], [249, -29.4, 8.2, 8.6]];
  const zehen = (x, y, L, a0, da, b) => L.map((l, i) => { const a = (a0 + da * i) * Math.PI / 180; return [x, y - 0.4 * i, x + Math.cos(a) * l, Math.min(-0.8, y - 0.4 * i + Math.sin(a) * l), b]; });
  const kr = (z, s = 1) => z.map(([, , x, y], i) => [x, y, 3.2 * s, 1.1 * s, 40 - i * 7, 0.7]);
  /* ---------- ferne Beine: Körperton −28 %, Zehenfächer mit Krallen ---------- */
  const fernF = ["#5e584a", "#4a453a", "#2e2b24"];
  const zf1 = zehen(210, -2, [5, 7.4, 8.6, 7.6, 5], 28, -14, 1.8), zf2 = zehen(126, -2, [6, 8.4, 10.4, 11, 6], 16, -9, 1.9);
  h += `<g filter="${rund(T, "kb", { weich: 2.4, tiefe: 3.2 })}">` +
    reptilBein(T, { n: "kf1", ton: "kf", farben: fernF, ticks: false, glieder: [[[198, -24], [206, -24], [207, -15], [210.6, -5], [211.6, -2], [205.4, -1.2], [203.6, -6], [200.4, -15]]], zehen: zf1, krallen: kr(zf1), krallenFarbe: "#1a1712" }) +
    reptilBein(T, { n: "kf2", ton: "kf", farben: fernF, ticks: false, glieder: [[[118, -22], [128, -21], [129, -12], [127.6, -5], [128, -1.6], [120, -1.2], [120.4, -6], [119.6, -13]]], zehen: zf2, krallen: kr(zf2), krallenFarbe: "#1a1712" }) + "</g>";
  /* Schatten unter dem schleifenden Schwanz */
  h += `<path d="M2 -.4Q50 -1 104 -3.6" fill="none" stroke="#000" stroke-width="2" stroke-opacity=".22" filter="${weich(T, "ks", 1)}"/>`;
  /* ---------- Rumpf, Hals, Schwanz ---------- */
  const K = echsenKoerper(T, sp, { id: "k", basis: "#6e6556", blur: 2.4, licht: 0.1, schatten: 0.26,
    zonen: [[-1.4, -0.5, "#5e584a"], [0.45, 1.4, "#9a917a"], [-1.4, 1.4, "#7a6a4f", 0.7, 0.86, 1], [-1.4, 1.4, "#575144", 0.5, 0, 0.35]],
    muster: (Rr, tx) => {
      let s = "";
      /* leichte helle Sprenkel auf dem Rücken, unregelmäßige dunklere Flecken */
      let d = "", l = "";
      for (let i = 0; i < 40; i++) { const t = 0.3 + T.rnd() * 0.66, v = -1 + T.rnd() * 0.9, [x, y] = Rr.P(t, v), r = 0.5 + T.rnd() * 1.1; if (i % 3) l += `M${R(x - r)} ${R(y)}a${R(r)} ${R(r * 0.6)} 0 1 0 ${R(2 * r)} 0a${R(r)} ${R(r * 0.6)} 0 1 0 ${R(-2 * r)} 0`; else d += `M${R(x - r * 2)} ${R(y)}a${R(r * 2)} ${R(r * 1.2)} 0 1 0 ${R(4 * r)} 0a${R(r * 2)} ${R(r * 1.2)} 0 1 0 ${R(-4 * r)} 0`; }
      s += `<g filter="${weich(T, "kmf", 0.5)}"><path d="${d}" fill="#2e2a22" opacity=".18"/><path d="${l}" fill="#d8ccaa" opacity=".26"/></g>`;
      if (F) {
        /* Kettenhemd: Perlschuppen am Rumpf, Ringreihen am Hals, längliche Schuppen in Ringen am Schwanz */
        s += `<path d="${pfad(T, Rr.band(-1.1, 1.1, tx(136), 1, 14))}" fill="${musterBeulen(T, "kr", 1.15, { flach: 0.85, grund: 0.2, hell: 0.26, dunkel: 0.32 })}"/>`;
        /* Hals: Perlschuppen in Ringreihen um die Falten (feine dunkle Ringfugen) */
        const tsH = []; for (let t = tx(222); t < 1; t += 0.0036) tsH.push(t);
        s += gitter(T, Rr, tsH, [-1.05, 1.05], { w: 0.25, opS: 0.22, licht: false, schritt: 40 });
        const tsS = []; for (let t = 0.02; t < tx(136); t += 0.0058) tsS.push(t);
        s += gitter(T, Rr, tsS, [-1.02, -0.66, -0.3, 0.06, 0.42, 0.78, 1.02], { versatz: true, w: 0.22, opS: 0.36, opL: 0.22, hell: "#e8dcc0", schritt: 40, lichtQuer: false });
        /* Bauch: helle Querreihen */
        const tsB = []; for (let t = tx(150); t < tx(222); t += 0.007) tsB.push(t);
        s += gitter(T, Rr, tsB, [0.7, 0.88, 1.04], { versatz: true, w: 0.2, opS: 0.2, opL: 0.26, hell: "#f4ecd2", lichtQuer: false, schritt: 40 });
      }
      /* Falten: Hals 5 tiefe Querfalten + Längsfalte, Schulterfalte vor dem Vorderbein, Flankenfalte über dem Bauch */
      const fa = [];
      for (const [x, v0, v1, k] of [[229, -0.75, 0.85, 0.006], [233.6, -0.6, 0.9, -0.005], [238, -0.7, 0.85, 0.006], [242.4, -0.55, 0.9, -0.004], [246.6, -0.6, 0.9, 0.005]]) { const t = tx(x); fa.push([Rr.P(t, v0), Rr.P(t + k, (v0 + v1) / 2), Rr.P(t - k * 0.5, v1)]); }
      fa.push([Rr.P(tx(226), 0.2), Rr.P(tx(236), 0.32), Rr.P(tx(248), 0.26)]);
      fa.push([Rr.P(tx(228), 0.62), Rr.P(tx(238), 0.78), Rr.P(tx(249), 0.7)]);
      fa.push([Rr.P(tx(219), -0.5), Rr.P(tx(217), 0.1), Rr.P(tx(219), 0.75)]);
      fa.push([Rr.P(tx(160), 0.48), Rr.P(tx(180), 0.56), Rr.P(tx(200), 0.5)]);
      s += linien(T, fa, "#1a1712", 1, 0.32) + linien(T, fa.map((p) => p.map(([x, y]) => [x - 0.5, y - 0.6])), "#e0d6b8", 0.55, 0.25);
      /* niedriger Doppelkiel auf dem hinteren Schwanzdrittel */
      s += linien(T, [Rr.zug(-0.9, 0.04, 0.32, 8)], "#e4dac0", 0.5, 0.3);
      return s;
    } });
  h += `<g filter="${rund(T, "kr", { weich: 6, tiefe: 3.6, umgebung: 0.36 })}">${K.svg}</g>`;
  /* ---------- nahe Beine im Spreizgang ---------- */
  const mK = F ? musterBeulen(T, "kb", 1.25, { grund: 0.18, hell: 0.24, dunkel: 0.3 }) : "";
  const nahF = ["#8c8470", "#6c6556", "#403c32"];
  const zh = zehen(144, -2.4, [6.4, 9.6, 12.4, 14, 7], 12, -8, 2.1), zv = zehen(222, -2.4, [6, 8.4, 9.6, 8.4, 5.4], 30, -14, 2);
  h += `<g filter="${rund(T, "kb", { weich: 2.4, tiefe: 3.2 })}">` + reptilBein(T, { n: "kh", ton: "kh", farben: nahF, muster: mK, maske: [-33, -27],
    glieder: [[[132, -29.6], [142, -33], [155, -32], [165, -25], [166, -19], [161.6, -16.4], [150, -19], [138, -22.6], [132.6, -25]],
      [[156, -21], [166.4, -19.4], [160, -10], [152.4, -4], [146, -4], [149.6, -10]],
      [[141.6, -5.4], [151.6, -5.4], [157, -3.4], [157.6, -0.8], [141, -0.8], [140.4, -3]]],
    innen: [fleck(T, "l", 146, -28, 9, 3, -10, 0.3) + fleck(T, "d", 145, -21, 12, 2.4, -12, 0.35), "", fleck(T, "l", 150, -3, 6, 1.4, 0, 0.3)],
    zehen: zh, krallen: kr(zh, 1.1), krallenFarbe: "#1a1712",
    kanten: [[[156, -35], [165, -26], [166, -19], [160, -10], [152.4, -4.2]], [[136, -22.6], [150, -19], [161.6, -16.4]], [[149.6, -10], [146, -4.2]]],
    falten: [[[157.6, -18.6], [161.6, -17.2], [165.6, -18.4]], [[146, -5.2], [149.6, -4.4], [153, -5]], [[126, -27], [138, -22.4], [152, -19.4]]] }) + "</g>";
  h += `<g filter="${rund(T, "kb", { weich: 2.4, tiefe: 3.2 })}">` + reptilBein(T, { n: "kv", ton: "kv", farben: nahF, muster: mK, maske: [-38, -30],
    glieder: [[[206, -38], [220, -38], [218, -28], [210, -21], [204, -19.6], [201.6, -22.6], [203.6, -30]],
      [[202, -22.6], [208.6, -24], [214.6, -15], [219.6, -6], [214, -4.4], [207.4, -13]],
      [[213, -5.6], [221, -5.8], [226, -3.4], [226.6, -0.8], [212.4, -0.8], [212, -3]]],
    innen: [fleck(T, "l", 211, -32, 5, 4, -30, 0.3), "", fleck(T, "l", 219, -3, 5, 1.2, 0, 0.3)],
    zehen: zv, krallen: kr(zv), krallenFarbe: "#1a1712",
    kanten: [[[218, -28], [210, -21], [208.6, -24], [214.6, -15], [219.6, -6.2]], [[201.6, -22.6], [207.4, -13], [214, -4.6]]],
    falten: [[[202.4, -21], [205.4, -19.4], [208.4, -20.8]], [[214, -5.6], [217, -4.8], [220, -5.4]]] }) + "</g>";
  /* Rumpf und Hals werfen Schatten auf Oberarm/Oberschenkel */
  h += `<path d="M204 -38Q213 -35.4 221 -37.6M136 -29.6Q147 -28 158 -31.6" fill="none" stroke="#000" stroke-width="3" stroke-opacity=".22" filter="${weich(T, "bs", 1.2)}"/>`;
  /* ---------- Kopf: lang, flach, breit, gerundete Schnauze, Kiefermuskelwulst ---------- */
  const kp = [[247, -31.6], [252, -35.4], [258, -36.8], [266, -36.4], [273, -34.4], [278.4, -31.6], [280.6, -29], [280.4, -27], [278.6, -25.6], [272, -24.8], [264, -24.2], [256, -23.4], [250, -22.8], [246.4, -24.6], [245.6, -28]];
  let ki = `<g filter="${weich(T, "kk", 1)}">` + form(T, poly([[248, -32], [254, -36], [266, -36], [278, -31.4], [268, -32.6], [256, -32.8]]), "#fff", ' opacity=".14"') +
    form(T, poly([[248, -24], [262, -24.4], [278, -26], [270, -27.4], [256, -27]]), "#000", ' opacity=".2"') + form(T, poly([[246, -30], [252, -30.6], [256, -26], [249, -24.4]]), "#7a6a4f", ' opacity=".7"') + "</g>";
  /* Kiefermuskelwulst hinter dem Auge, Brauenwulst */
  ki += fleck(T, "l", 252, -30.4, 4, 3, 0, 0.3) + fleck(T, "d", 253, -26.6, 4.4, 1.6, 0, 0.3);
  if (F) ki += `<path d="${pfad(T, kp)}" fill="${musterNetz(T, "kk", 0.62, { op: 0.26, opL: 0.18 })}"/>`;
  /* Lippenschuppen oben und unten (hellere Ränder), lange Mundspalte */
  if (F) ki += lippen(T, [[255, -26.2], [262, -26.4], [270, -26.7], [276, -27.1], [280, -27.6]], 18, -1.2, { w: 0.14, op: 0.4, opL: 0.35, fuge: "#14120e", licht: "#e8dcc0" }) + lippen(T, [[254, -25.6], [262, -25.4], [270, -25.6], [278, -26.2]], 14, 1, { w: 0.12, op: 0.3, opL: 0.28, fuge: "#14120e", licht: "#e8dcc0" });
  const mk = T.id("kkm");
  T.def(`<linearGradient id="${mk}g" gradientUnits="userSpaceOnUse" x1="243" y1="0" x2="249" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${mk}" maskUnits="userSpaceOnUse" x="236" y="-44" width="50" height="26"><rect x="236" y="-44" width="50" height="26" fill="url(#${mk}g)"/></mask>`);
  h += `<g mask="url(#${mk})"><g filter="${rund(T, "kk", { weich: 2.6, tiefe: 3.4, umgebung: 0.38 })}">` + teil(T, kp, "#6e6352", { innen: ki, rand: "#14120e", randA: 0.28, rw: 0.3, kante: [kp.slice(0, 12)] }) + "</g></g>";
  h += linien(T, [[[280.2, -27.4], [274, -26.6], [266, -26], [258, -25.6], [252.4, -25], [249.4, -23.8]]], "#100d0a", 0.3, 0.75);
  /* Trommelfell: flach eingesenkt, Innenschatten am Oberrand, hinter und über dem Mundwinkel */
  h += `<ellipse cx="247.8" cy="-28" rx="1.4" ry="1.9" fill="#5a5244"/><ellipse cx="247.8" cy="-28.6" rx="1.3" ry="1.2" fill="#000" opacity=".3"/>` + linien(T, [[[246.8, -26.6], [247.8, -26.1], [248.8, -26.6]]], "#e0d6b8", 0.2, 0.4);
  h += `<ellipse cx="277.2" cy="-31.2" rx="1" ry=".7" fill="#100d0a"/>` + linien(T, [[[276.2, -31.9], [277.2, -32.3], [278.2, -31.9]]], "#e0d6b8", 0.18, 0.4);
  /* Auge: klein, tief unter dem Brauenwulst */
  h += echsAuge(T, 261.6, -32.4, 1.15, { iris: "#8a6a2a", iris2: "#2a1a0a", netz: "#3a240e", pupille: "rund", pupR: 0.42, offen: 0.64, wulst: "#6e6352", lid: "#24201a", korn: "#bcb294" });
  /* Zunge: gelb-orange, rosa Ansatz, geschwungen, letzte 35 % tief gegabelt, Spitzen auf 1 px auslaufend */
  h += `<path d="M280 -27.3C283 -27.6 286 -27.8 289 -27.2L289 -26.6C286 -27 283 -26.8 280 -26.5Z" fill="${T.lg("kz", [[0, "#d88a7a"], [0.3, "#e0a040"], [1, "#e8b830"]], 0, 0, 1, 0)}"/>` +
    `<path d="M289 -27.2Q291.6 -27.9 294 -29.6M289 -26.6Q291.8 -26.2 294.2 -24.8" fill="none" stroke="#e8b830" stroke-width=".45" stroke-linecap="round"/>` +
    (F ? `<path d="M280.6 -27.4C283 -27.6 286 -27.8 288.6 -27.3" fill="none" stroke="#fff6d0" stroke-width=".18" stroke-opacity=".6"/>` : "");
  return fertig(1, h, [0, -44.6, 294.2, 0], [150, 220, 126, 211], [242, -40, 296, -18]);
}

/* =====================================================================
   CHAMÄLEON (Pantherchamäleon, Furcifer pardalis), Männchen
   RECHERCHE: Madagaskar; Männchen 40–50 cm (hier ~42 cm mit eingerolltem Greifschwanz). Körper seitlich stark
   abgeflacht, Rücken hoch gewölbt, kleiner Rückenkamm aus Kegelschuppen (auf dem ersten Schwanzdrittel weiter),
   Kehlkamm aus kleinen weißen Kegelschuppen auf der Kehlmittellinie. Kopf ≈ 25–28 % der Kopf-Rumpf-Länge: niedriger,
   nach hinten spitz auslaufender Helm (Casque) mit Scheitelkante; vom Augenturm laufen Brauenleisten nach vorn und bilden
   den kurzen, nach vorn ragenden, leicht nach unten gebogenen Schnauzenvorsprung (Männchen). Mundlinie hinten nach unten
   gezogen. Augen: kegelförmige „Turmaugen“ aus konzentrischen Ringen feiner Körnerschuppen, nur kleine Öffnung (in
   Blickrichtung versetzt), schmaler goldoranger Irisring, schwarze Pupille. Füße zangenförmig: vorn 3 Finger innen /
   2 außen, hinten 2 Zehen innen / 3 außen, zu Bündeln verwachsen, kleine Krallen. Greifschwanz eingerollt, Basis beim
   Männchen durch die Hemipenistaschen verdickt. Haut aus feinen Grundkörnern mit verstreuten größeren flachen
   Tuberkeln in lockeren Längsreihen. Färbung Männchen (z. B. Ambilobe): Türkis/Blaugrün mit rot-orangen, leicht
   gebogenen Querbändern mit dunklerem Saum, scharf begrenzter weißer Seitenstreif vom Mundwinkel über die untere Flanke,
   weiße Lippenschuppen, rote Linien am Kopf.
   Zeichenraum: 1 Einheit = 0,15 cm. Sitzt auf einem am Boden liegenden Ast.
   ===================================================================== */
function chamaeleon(T) {
  const F = T.fein;
  let h = "";
  const tu = "#1f8f7f", tuH = "#4cbfa8", tuD = "#136456", rot = "#c4502a";
  /* ---------- Ast (dünner, Rinde mit Längsrissen, zylindrisch schattiert) ---------- */
  const ast = [[28, -8.6], [70, -9.2], [120, -8.8], [170, -8.4], [222, -8.2], [234, -8], [235.6, -4.2], [234, -0.2, 1], [180, -0.3], [120, -0.4], [70, -0.2], [28, 0, 1], [26.6, -4.4]];
  let ai = `<path d="M20 -10L240 -10L240 0L20 0Z" fill="${T.lg("astl", [[0, "#fff", 0.2], [0.35, "#fff", 0.03], [0.75, "#000", 0.25], [1, "#000", 0.5]])}"/>`;
  if (F) { let d = ""; for (let i = 0; i < 40; i++) { const x = 30 + T.rnd() * 200, y = -8 + T.rnd() * 7, l = 6 + T.rnd() * 16; d += `M${R(x)} ${R(y)}q${R(l / 2)} ${R((T.rnd() - 0.5) * 0.6)} ${R(l)} ${R((T.rnd() - 0.5) * 0.4)}`; } ai += `<path d="${d}" fill="none" stroke="#2a1c10" stroke-width=".5" stroke-opacity=".4" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#e6caa0" stroke-width=".3" stroke-opacity=".25" stroke-linecap="round" transform="translate(0 -.5)"/>`; }
  h += teil(T, ast, "#86684a", { innen: ai, rand: "#1e140a", randA: 0.3, rw: 0.3 });
  h += `<ellipse cx="234.8" cy="-4.2" rx="1.6" ry="4.1" fill="#c8a678" stroke="#5a4028" stroke-width=".4"/><ellipse cx="234.8" cy="-4.2" rx=".7" ry="2.2" fill="none" stroke="#7a5a38" stroke-width=".3"/>`;
  /* Schatten von Körper und Füßen auf dem Ast */
  h += `<path d="M64 -8.4Q110 -10 158 -8.2" stroke="#000" stroke-width="2.2" stroke-opacity=".28" fill="none" filter="${weich(T, "as", 1)}"/>`;
  /* ---------- ferne Beine (dunkler, setzen an Schulter bzw. Hüfte an), ferne Greifbündel nur als Kante oben ---------- */
  const fernF = ["#1a7a68", "#126052", "#0a3a32"];
  h += `<g filter="${rund(T, "cb", { weich: 1.2, tiefe: 3 })}">` + reptilBein(T, { n: "cf1", ton: "cf", farben: fernF, glieder: [[[148, -44], [152.6, -43], [152, -32], [154.4, -20], [155, -10.4], [151.4, -10.2], [150.6, -20], [148.4, -31]]] }) +
    reptilBein(T, { n: "cf2", ton: "cf", farben: fernF, glieder: [[[70, -34], [75, -33], [74.6, -22], [71.4, -10.4], [67.8, -10.2], [70, -22]]] }) + "</g>";
  h += `<path d="M150.6 -10.2Q153.4 -11.4 156.6 -9.6Q153.6 -9.2 150.6 -9.6ZM67 -10.2Q70 -11.4 73 -9.6Q70 -9.2 67 -9.6Z" fill="#0f4a40"/>`;
  /* ---------- Greifschwanz: ohne Stufe aus dem Becken, Basis kräftig, nach unten eingerollt ---------- */
  const sw = [[70, -34, 6.6, 7.2], [56, -32, 5.6, 5.8], [44, -28.4, 4.6, 4.6], [35, -22.6, 3.8, 3.8], [30, -15.4, 3.2, 3.2], [31, -9.2, 2.7, 2.7], [36.4, -6.4, 2.3, 2.3], [41, -8.6, 1.9, 1.9], [40.4, -12.6, 1.5, 1.5], [36.6, -13.2, 1.2, 1.2], [35.4, -10.6, 0.8, 0.8]];
  const Rs = rohr(sw, 6);
  let si = `<g filter="${weich(T, "cs", 0.9)}">` + form(T, poly(Rs.band(-1.2, -0.5, 0, 1, 10)), tuH, ' opacity=".55"') + form(T, poly(Rs.band(0.35, 1.2, 0, 1, 10)), tuD, ' opacity=".7"') + "</g>";
  let sb = "";
  for (const t of [0.1, 0.22, 0.35, 0.49, 0.64]) { const w = 0.022; sb += pfad(T, [Rs.P(t - w, -1.25), Rs.P(t + w, -1.25), Rs.P(t + w * 1.4, 0), Rs.P(t + w, 1.25), Rs.P(t - w, 1.25), Rs.P(t - w * 0.6, 0)]); }
  si += `<path d="${sb}" fill="${rot}" opacity=".78" filter="${weich(T, "cb2", 0.5)}"/>`;
  if (F) si += `<path d="${pfad(T, Rs.zug(-1.1, 0, 1, 12).concat(Rs.zug(1.1, 0, 1, 12).reverse()))}" fill="${musterBeulen(T, "cg", 0.75, { grund: 0.1, hell: 0.22, dunkel: 0.26 })}"/>`;
  /* Rückenkamm auf dem ersten Schwanzdrittel */
  let rkS = ""; for (let t = 0.02; t < 0.3; t += 0.03) { const [x, y, nx, ny] = Rs.at(t), a = Rs.P(t, -1), H = 1 - t * 2; rkS += `M${R(a[0] - 0.6)} ${R(a[1] + 0.3)}L${R(a[0] + nx * H)} ${R(a[1] + ny * H)}L${R(a[0] + 0.6)} ${R(a[1] + 0.3)}Z`; }
  h += `<g filter="${rund(T, "cw", { weich: 1.8, tiefe: 3.2 })}">` + teil(T, Rs.zug(-1, 0, 1, 16).concat(Rs.zug(1, 0, 1, 16).reverse()), tu, { innen: si, rand: "#0c2a22", randA: 0.25, rw: 0.3 }) + `<path d="${rkS}" fill="${tu}"/>` + "</g>";
  /* Hemipenis-Verdickung unter der Schwanzbasis */
  h += `<g filter="${weich(T, "hp", 0.6)}"><ellipse cx="63" cy="-28.4" rx="5" ry="2.4" fill="${tu}"/><ellipse cx="63" cy="-27.4" rx="4.4" ry="1.5" fill="#000" opacity=".2"/></g>`;
  /* ---------- Rumpf: seitlich flach, hoch gewölbt; Bänder folgen den Rippen; Seitenstreif; Körner + Tuberkel ---------- */
  const rp = [[62, -30], [66, -40], [76, -52], [92, -61], [108, -64.4], [124, -62.4], [138, -57.4], [148, -52.4], [154, -48], [156, -41], [152, -34], [144, -29], [128, -26.4], [108, -25.6], [88, -26.2], [72, -27.4]];
  let ri = "";
  ri += `<g filter="${weich(T, "cz", 2.4)}">` + form(T, poly([[60, -34], [86, -62], [124, -66], [156, -50], [130, -52], [96, -54], [70, -40]]), tuH, ' opacity=".45"') + "</g>";
  /* rot-orange Querbänder: leicht gebogen, oben nach hinten geneigt, unregelmäßige Ränder, dunklerer Saum */
  const baender = [[78, 5.4], [96, 6.6], [115, 7.2], [134, 6.6], [149, 4.6]];
  let qb = "", qs = "";
  for (const [x0, w] of baender) {
    const p = [[x0 - w * 0.5 - 3.6, -68], [x0 + w * 0.5 - 3.2, -68], [x0 + w * 0.62 - 1.2, -52], [x0 + w * 0.5 + 0.6, -40], [x0 + w * 0.42 + 1, -24], [x0 - w * 0.5 + 1, -24], [x0 - w * 0.6 + 0.4, -38], [x0 - w * 0.5 - 1.4, -52]].map(([x, y]) => [x + (T.rnd() - 0.5) * 1.2, y]);
    qb += pfad(T, p); qs += T.glatt(p);
  }
  ri += `<path d="${qb}" fill="${rot}" opacity=".88" filter="${weich(T, "cq", 0.35)}"/><path d="${qs}" fill="none" stroke="#6a1e10" stroke-width=".8" stroke-opacity=".4" filter="${weich(T, "cq2", 0.4)}"/>`;
  /* Rippen als leichte senkrechte Wellen (~5 % Kontrast) */
  let rip = ""; for (let x = 84; x < 146; x += 5.2) rip += `M${x} -56Q${x - 1.6} -42 ${x + 0.6} -28`;
  ri += `<path d="${rip}" fill="none" stroke="#000" stroke-width="1.2" stroke-opacity=".06"/><path d="${rip}" fill="none" stroke="#fff" stroke-width=".6" stroke-opacity=".06" transform="translate(-1 0)"/>`;
  /* scharf begrenzter weißer Seitenstreif mit welligen Rändern (Mundwinkel → untere Flanke) */
  const stp = []; for (let x = 158; x >= 92; x -= 6) stp.push([x, -33.6 - (158 - x) * 0.012 + Math.sin(x * 0.5) * 0.35]);
  ri += `<path d="${T.glatt(stp.concat(stp.slice().reverse().map(([x, y]) => [x, y + 2.5 + Math.cos(x * 0.6) * 0.3])))}" fill="#eef4ea" opacity=".92"/>`;
  if (F) {
    ri += `<path d="${pfad(T, rp)}" fill="${musterBeulen(T, "cr", 0.8, { grund: 0.12, hell: 0.2, dunkel: 0.24 })}"/>`;
    const tub = beulenGrad(T, "ct", 0.42, 0.34);
    ri += beulen(T, [[72, -42], [94, -58], [126, -59], [148, -48], [140, -34], [100, -32], [76, -34]], 5.4, { flach: 0.85, dichte: 0.55, grads: [tub], groesse: () => 0.5, jit: 0.15 });
  }
  /* Licht: Rückenkante hell, Unterbauch im Kernschatten, Bodenreflex */
  ri += `<g filter="${weich(T, "cl", 2.2)}">` + form(T, poly([[64, -40], [92, -62], [126, -64], [104, -57], [78, -46]]), "#fff", ' opacity=".2"') + form(T, poly([[60, -29], [110, -24], [156, -36], [140, -33], [100, -30]]), "#000", ' opacity=".3"') + "</g>";
  h += `<g filter="${rund(T, "cr", { weich: 5, tiefe: 3.6, umgebung: 0.36 })}">` + teil(T, rp, tu, { innen: ri, rand: "#0c2a22", randA: 0.25, rw: 0.35 }) + "</g>";
  /* Rückenkamm: kleine kegelförmige Schuppen (2–3 % der Rumpfhöhe), wie das Band darunter gefärbt, helle Spitze */
  let rk = "", rkL = "";
  const rl = polyl([[66, -40.6], [76, -52.4], [92, -61.4], [108, -64.8], [124, -62.8], [138, -57.8], [148, -52.8]]);
  for (let i = 0; i < 30; i++) { const [x, y, nx, ny] = rl.at(i / 30), H = 0.9 + 0.6 * Math.sin(Math.PI * i / 30) + (i > 24 ? 0.4 : 0); rk += `M${R(x - 0.9)} ${R(y + 0.5)}L${R(x + nx * H - 0.2)} ${R(y + ny * H)}L${R(x + 0.9)} ${R(y + 0.5)}Z`; if (F) rkL += `M${R(x + nx * H * 0.6 - 0.2)} ${R(y + ny * H * 0.6)}l${R(nx * H * 0.35)} ${R(ny * H * 0.35)}`; }
  h += `<path d="${rk}" fill="${tu}"/>` + (rkL ? `<path d="${rkL}" stroke="#d8f4e8" stroke-width=".4" stroke-opacity=".6" stroke-linecap="round"/>` : "");
  /* ---------- nahe Beine: deckend, Oberarm/Oberschenkel mit Licht und Kernschatten, keine Bänder, keine Manschetten ---------- */
  const nahF = ["#3fae94", "#1f8f7f", "#105a4c"];
  const mC = F ? musterBeulen(T, "cb", 0.7, { grund: 0.12, hell: 0.2, dunkel: 0.26 }) : "";
  h += `<g filter="${rund(T, "cb", { weich: 1.2, tiefe: 3 })}">` + reptilBein(T, { n: "ch", ton: "ch", farben: nahF, muster: mC,
    glieder: [[[72, -38], [80, -37.6], [88.6, -28], [89, -24.6], [86, -23.6], [76.4, -30.4]], [[84.6, -26.6], [89.2, -25.6], [86.6, -17], [84.4, -10.6], [80.6, -10.4], [82.4, -17.4]]],
    kanten: [[[80, -37.6], [88.6, -28], [89, -24.6]], [[76.4, -30.4], [86, -23.6]]], falten: [[[85.4, -24.8], [87.4, -24], [88.8, -24.6]]] }) +
    reptilBein(T, { n: "cv", ton: "cv", farben: nahF, muster: mC,
    glieder: [[[138, -46], [145, -46.6], [142, -36], [139.4, -29.4], [135.4, -28.6], [134.6, -32], [137.4, -40]], [[134.6, -31.4], [139, -31.6], [142.6, -22], [144.6, -11], [140.8, -10.6], [139, -21]]],
    kanten: [[[145, -46.6], [142, -36], [139.4, -29.4]], [[134.6, -32], [135.4, -28.6]]], falten: [[[135, -29.8], [137, -28.8], [139, -29.4]]] }) + "</g>";
  /* Zangenfüße: das uns zugewandte Bündel umgreift die Astvorderseite bis unter die Mitte (vorn 2, hinten 3 Zehen),
     vom fernen Bündel nur die Kante oben auf dem Ast; kleine helle Krallen */
  const buendel = (x, n, b) => {
    const g = T.lg("czb", [[0, nahF[0]], [0.6, nahF[1]], [1, nahF[2]]], 0, 0, 1, 1);
    let s = `<path d="M${R(x - 3.4)} -9.4Q${R(x + 1.6)} -11.6 ${R(x + 3.8)} -9.2Q${R(x + 2.6)} -8.6 ${R(x - 2.6)} -8.8Z" fill="#0f4a40"/>`;
    s += `<path d="M${R(x - b)} -11.4Q${R(x + b * 1.2)} -12 ${R(x + b)} -9Q${R(x + b * 0.8)} -6 ${R(x + b * 0.5)} -3.8Q${R(x)} -3.2 ${R(x - b * 0.4)} -3.9Q${R(x - b * 0.6)} -6.6 ${R(x - b)} -9.6Z" fill="${g}" stroke="#0c2a22" stroke-width=".25" stroke-opacity=".5"/>`;
    let d = ""; for (let i = 1; i < n; i++) { const u = i / n - 0.5; d += `M${R(x + u * b * 1.6)} -10.6Q${R(x + u * b * 1.4)} -6.6 ${R(x + u * b * 0.9)} -4.2`; }
    s += `<path d="${d}" fill="none" stroke="#0a3028" stroke-width=".3" stroke-opacity=".6"/>`;
    s += krallen(T, Array.from({ length: n }, (_, i) => [x + (i / (n - 1 || 1) - 0.5) * b * 0.9, -4.1, 0.9, 0.36, 100, -0.3]), "#d8ceb0");
    return s;
  };
  h += buendel(84.6, 3, 2.6) + buendel(142.6, 2, 2.2);
  /* ---------- Kopf: 25 % kleiner, niedriger spitzer Helm, Schnauzenvorsprung, Mund hinten nach unten gezogen ---------- */
  const kp = [[146, -47], [149.4, -55], [153.6, -62.8, 1], [156.6, -62.2], [160.4, -60.2], [166, -57.2], [174, -54.4], [182, -51.6], [188, -49.6], [190.6, -48.6], [190.2, -47.2], [188.4, -46.6], [189.4, -44.6], [188, -41.6], [183, -39.4], [176, -37.4], [168, -34.4], [161, -32], [154, -33], [148.6, -38]];
  let ki = `<g filter="${weich(T, "ck", 1.2)}">` + form(T, poly([[150, -52], [156, -60], [166, -56.6], [182, -51.4], [174, -51.4], [160, -52.6]]), "#fff", ' opacity=".22"') + form(T, poly([[150, -40], [160, -36], [176, -40.6], [186, -43], [176, -43.4], [160, -41]]), "#000", ' opacity=".24"') + "</g>";
  ki += `<path d="M160 -49Q172 -46.4 186 -46M158 -44.6Q168 -42.6 180 -42.6" fill="none" stroke="${rot}" stroke-width="1.2" stroke-opacity=".55" stroke-linecap="round"/>`;
  /* weiße Lippenschuppen als Reihe */
  let lp = ""; for (let i = 0; i < 12; i++) { const u = i / 11, x = 187.8 - u * 22, y = -42.6 + u * 2.4 + (u > 0.7 ? (u - 0.7) * 7 : 0); lp += `M${R(x)} ${R(y)}a.9 .6 0 1 0 -1.8 0a.9 .6 0 1 0 1.8 0`; }
  ki += `<path d="${lp}" fill="#eef2e2" stroke="#3a5a4a" stroke-width=".18" stroke-opacity=".4"/>`;
  if (F) ki += `<path d="${pfad(T, kp)}" fill="${musterBeulen(T, "ck2", 0.75, { grund: 0.12, hell: 0.22, dunkel: 0.26 })}"/>`;
  /* Schatten des Augenturms nach rechts unten auf den Kopf */
  ki += `<ellipse cx="172.6" cy="-45.4" rx="7.6" ry="5.4" fill="#000" opacity=".26" filter="${weich(T, "cts", 1.4)}"/>`;
  h += `<g filter="${rund(T, "ck", { weich: 3, tiefe: 3.4, umgebung: 0.38 })}">` + teil(T, kp, "#2a9c86", { innen: ki, rand: "#0c2a22", randA: 0.28, rw: 0.3 }) + "</g>";
  /* Helmkante und Brauenleiste als Lichtkante; Schnauzenvorsprung */
  h += linien(T, [[[150, -55.4], [153.6, -62.4], [156.6, -61.9], [160.4, -60.2], [166, -57.4], [174, -54.6], [182, -51.8], [188.4, -49.8]]], "#e8f8ee", 0.6, 0.35);
  /* Mundlinie: hinten nach unten gezogen, Mundwinkel unter dem hinteren Turmrand */
  h += linien(T, [[[188.8, -43.8], [182, -42.6], [174, -41.2], [167.6, -38.6], [163.4, -36]]], "#0a1a12", 0.42, 0.8);
  h += `<ellipse cx="186.8" cy="-47.6" rx=".7" ry=".55" fill="#0a1a12"/>`;
  /* Kehlkamm: kleine gefüllte weiße Kegelschuppen auf der Kehlmittellinie, nach hinten kleiner */
  let kk = ""; const kl = polyl([[186.6, -40.6], [183, -39.2], [176, -37.2], [168, -34.2], [161, -31.8], [156, -32.4]]); for (let i = 0; i < 10; i++) { const u = i / 9, [x, y] = kl.at(u), H = 1.6 - u * 0.9; kk += `M${R(x - H * 0.5)} ${R(y - 0.3)}l${R(H * 0.4)} ${R(H)}l${R(H * 0.6)} ${R(-H)}Z`; }
  h += `<path d="${kk}" fill="#eceada"/><path d="${kk}" fill="#000" opacity=".15" transform="translate(.3 .4)"/>`;
  /* Augenturm: Kegel ragt aus der Kopfkontur, Ringe feiner Körner zur Öffnung hin kleiner, Öffnung nach vorn versetzt */
  const ax = 168.6, ay = -50, ox = ax + 3, oy = ay + 0.2;
  let au = `<circle cx="${ax}" cy="${ay}" r="8.2" fill="${T.rg("turm", [[0, "#6ad6b4"], [0.5, "#2a9c86"], [1, "#0e5446"]], 0.68, 0.42, 0.7)}"/>`;
  au += `<g fill="none" stroke-linecap="round">` + [7.2, 5.9, 4.6, 3.4].map((r, i) => { const k = 1 - r / 8.2, cx = ax + (ox - ax) * k, cy = ay + (oy - ay) * k; return `<circle cx="${R(cx)}" cy="${R(cy)}" r="${r}" stroke="#08302a" stroke-width=".42" stroke-opacity=".3" stroke-dasharray="${R(0.5 + i * 0.05)} ${R(0.32)}"/>`; }).join("") + "</g>";
  if (F) au += `<circle cx="${ax}" cy="${ay}" r="8" fill="${musterBeulen(T, "ca", 0.6, { grund: 0.06, hell: 0.2, dunkel: 0.18 })}"/>`;
  /* orange Strahlen als Bögen, die der Kegelwölbung folgen und auf der Kopfhaut weiterlaufen */
  let rad = "";
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + 0.4, x0 = ox + Math.cos(a) * 2.6, y0 = oy + Math.sin(a) * 2.6, x1 = ax + Math.cos(a) * 8, y1 = ay + Math.sin(a) * 8; rad += `M${R(x0)} ${R(y0)}Q${R((x0 + x1) / 2 - Math.sin(a) * 1.4)} ${R((y0 + y1) / 2 + Math.cos(a) * 1.4)} ${R(x1)} ${R(y1)}`; }
  au += `<path d="${rad}" fill="none" stroke="${rot}" stroke-width=".8" stroke-opacity=".32" stroke-linecap="round"/>`;
  /* Licht oben links auf dem Kegel, rechte untere Hälfte dunkler */
  au += `<circle cx="${ax}" cy="${ay}" r="8.2" fill="${T.lg("turml", [[0, "#fff", 0.28], [0.45, "#fff", 0], [0.6, "#000", 0], [1, "#000", 0.32]], 0.2, 0.1, 0.8, 0.9)}"/>`;
  au += `<circle cx="${R(ox)}" cy="${R(oy)}" r="2" fill="#0a2a22"/><circle cx="${R(ox)}" cy="${R(oy)}" r="1.55" fill="#d08a2a"/><circle cx="${R(ox + 0.1)}" cy="${R(oy)}" r="1.2" fill="#040302"/><circle cx="${R(ox - 0.4)}" cy="${R(oy - 0.5)}" r=".38" fill="#fff" opacity=".92"/>`;
  h += au;
  return fertig(0.15, h, [25.8, -67, 237.2, 0], null, [144, -70, 194, -30]);
}

/* =====================================================================
   SCHILDKRÖTE (Griechische Landschildkröte, Testudo hermanni)
   RECHERCHE: Panzerlänge 15–20 cm (hier ~16 cm, mit Kopf ~21 cm). Rückenpanzer hoch gewölbt, am höchsten HINTER der
   Mitte, Seiten steil, hinterer Rand leicht aufgebogen und gesägt. Schilde: kleiner Nackenschild, 5 sechseckige, breiter
   als lange Wirbelschilde (Naht zu den Rippenschilden im Zickzack), je 4 Rippenschilde, je 11 Randschilde (vorn über dem
   Hals bis hinten über dem Schwanz), Schwanzschild meist geteilt. Wachstumsringe exzentrisch um die Areola (bei den
   Rippenschilden nach oben-hinten verschoben). Farbe: leuchtend gelb-ocker (#D8B24A–#E6C463) mit scharf begrenzter
   schwarzer Zeichnung entlang der vorderen und unteren Naht jedes Schildes; Randschilde gelb mit schwarzem Dreieck an
   der vorderen Naht. Bauchpanzer gelb mit zwei schwarzen Längsbändern (seitlich nur als Brücke im Schatten sichtbar).
   Kopf keilförmig (Höhe ≈ 50 % der Länge), Oberkopf flach mit großem Präfrontal- und Frontalschild, kurze stumpfe
   Schnauze; Hornschnabel an Ober- und Unterkiefer, oben vorn leicht hakig, Schneide fein gezähnt; kleiner gelblicher
   Wangenfleck. Auge rund, dunkel, feiner goldener Ring, dicke schuppige Lider (großes Unterlid). Hals mit loser,
   faltiger Haut. Vorderbein abgeflacht mit großen, dachziegelartigen Hornschuppen, 5 Krallen; Hinterbein säulenförmig
   („Elefantenfuß“) mit Ferse, 2–3 größeren Hornhöckern, 4 Krallen; KEINE Schenkelsporne (die hat T. graeca).
   Schwanz kurz, dick, mit verhorntem Endnagel.
   Zeichenraum: 1 Einheit = 0,1 cm.
   ===================================================================== */
function schildkroete(T) {
  const F = T.fein;
  let h = "";
  const haut = ["#cdbd92", "#a89a70", "#6a6044"], hautF = ["#a49670", "#857a58", "#524a34"];
  const hautG = (n, f) => T.lg("skh" + n, [[0, f[0]], [0.55, f[1]], [1, f[2]]], 0.2, 0, 0.8, 1);
  /* ---------- ferne Beine (unter dem Panzer, dunkler, mit Krallen) ---------- */
  h += `<g filter="${rund(T, "skb", { weich: 3, tiefe: 3 })}">` + teil(T, [[150, -28], [164, -28], [167, -14], [170, -4], [170, -0.3, 1], [154, -0.3, 1], [153, -8]], hautG("f", hautF), { rand: "#2a2414", randA: 0.25, rw: 0.4 }) +
    teil(T, [[46, -26], [62, -26], [63, -10], [65, -0.3, 1], [46, -0.3, 1], [47, -10]], hautG("f", hautF), { rand: "#2a2414", randA: 0.25, rw: 0.4 }) + "</g>";
  h += krallen(T, [[169, -1.6, 3, 1.4, 30, 0.4], [165, -1.2, 3, 1.4, 45, 0.4], [64, -1.4, 2.6, 1.3, 30, 0.4], [60, -1.2, 2.6, 1.3, 45, 0.4]], "#3a3020");
  /* ---------- Schwanz: kurz, kegelig, dicke Basis, dunkler Hornnagel ---------- */
  h += `<g filter="${rund(T, "sks", { weich: 2, tiefe: 3 })}">` + teil(T, [[28, -38], [20, -34.4], [14.6, -31], [12, -29.4], [15, -28], [22, -28.6], [30, -30.6]], hautG("s", haut), { rand: "#2a2414", randA: 0.3, rw: 0.35 }) + "</g>";
  h += `<path d="M13.2 -30.6L9 -29L13 -27.8Z" fill="#2e2618"/><path d="M12.4 -29.9L9.6 -29.1" stroke="#a89a70" stroke-width=".3" stroke-opacity=".5"/>`;
  /* ---------- Hinterbein: kommt UNTER dem Panzer hervor (Oberkante verdeckt), Säule mit Oberschenkelwulst, Ferse
     hinten, kurze stumpfe Sohle, flache rundliche Schuppen, 2–3 größere Hornhöcker an der Ferse, 4 Krallen ---------- */
  const bh = [[32, -32], [50, -32], [52.6, -22], [52.4, -12], [55, -4], [56, -0.3, 1], [33, -0.3, 1], [31.6, -3.6], [34, -10], [33, -18], [31, -25]];
  let bhi = fleck(T, "l", 38, -18, 6, 9, 0, 0.3) + fleck(T, "d", 53, -12, 5, 10, 0, 0.35);
  if (F) bhi += `<path d="${pfad(T, bh)}" fill="${musterBeulen(T, "skh", 2.4, { grund: 0.1, hell: 0.22, dunkel: 0.28, flach: 0.85 })}"/>` + linien(T, [[[33, -6], [44, -5], [54, -6]], [[32.4, -3], [44, -2.2], [55, -2.8]]], "#4a3e24", 0.45, 0.35);
  bhi += `<circle cx="34.6" cy="-8" r="2" fill="${beulenGrad(T, "skt", 0.35, 0.35)}"/><circle cx="34" cy="-12.4" r="1.6" fill="${beulenGrad(T, "skt", 0.35, 0.35)}"/>`;
  h += `<g filter="${rund(T, "skb", { weich: 3, tiefe: 3 })}">` + teil(T, bh, hautG("n", haut), { innen: bhi, rand: "#2a2414", randA: 0.3, rw: 0.4 }) + "</g>";
  h += krallen(T, [[55, -1.2, 3.2, 1.6, 25, 0.4], [51.4, -0.9, 3, 1.5, 38, 0.4], [47.6, -0.8, 2.8, 1.4, 50, 0.4], [44, -0.7, 2.4, 1.2, 62, 0.4]], "#3a3020");
  /* ---------- Hals (lose, faltig) und Kopf (keilförmig) – zuerst, der Panzerrand liegt darüber ---------- */
  const hals = [[156, -52], [168, -56.4], [180, -55.6], [188, -50.4], [190, -42], [184, -35.6], [170, -33.4], [158, -38]];
  let hi = fleck(T, "d", 174, -52, 14, 4.4, 0, 0.5) + fleck(T, "d", 172, -36, 12, 3, 0, 0.35);
  const fal = [[[168, -55], [171, -46], [168.6, -36]], [[174.4, -55.6], [178, -46], [176.4, -35.6]], [[180.6, -54.6], [184, -46], [182.6, -37]], [[163, -50], [174, -47.4], [187.6, -48.4]], [[163, -42], [175, -41.4], [188.4, -42.4]]];
  hi += linien(T, fal, "#3a3020", 0.6, 0.38) + linien(T, fal.map((p) => p.map(([x, y]) => [x + 0.5, y + 0.6])), "#f2ead0", 0.4, 0.28);
  if (F) hi += `<path d="${pfad(T, hals)}" fill="${musterBeulen(T, "skn", 1.2, { grund: 0.08, hell: 0.16, dunkel: 0.2 })}"/>`;
  h += `<g filter="${rund(T, "skn", { weich: 3.4, tiefe: 3 })}">` + teil(T, hals, hautG("h", haut), { innen: hi, rand: "#2a2414", randA: 0.28, rw: 0.4 }) + "</g>";
  const kp = [[184, -54], [189, -59.4], [196, -61.4], [203, -61], [208.6, -58.6], [212.4, -55], [214, -51], [213.2, -47.6], [210.4, -45], [204, -43.4], [196, -43.4], [189, -45], [184.6, -48.4]];
  let ki = `<g filter="${weich(T, "skk", 1)}">` + form(T, poly([[187, -55], [194, -60.6], [204, -60.2], [211, -54.4], [204, -55.6], [194, -55]]), "#fff", ' opacity=".22"') + form(T, poly([[187, -46], [198, -44], [210, -45.6], [204, -48.4], [192, -48]]), "#000", ' opacity=".22"') + "</g>";
  if (F) ki += `<path d="${pfad(T, kp)}" fill="${musterNetz(T, "skk", 1, { op: 0.12, opL: 0.08 })}"/>`;
  /* große Kopfschilde oben: Präfrontale und Frontale als zwei klar umrandete Platten; Schläfenschilde */
  const ks = [[[200, -61.2], [200.8, -58.4], [206.4, -57.6], [208.6, -58.6]], [[200.8, -58.4], [195.6, -58.8], [192, -60.4]], [[206.4, -57.6], [210.4, -55], [212.6, -54.6]], [[192, -60.4], [190.6, -56.6], [188, -54.4]]];
  ki += `<path d="${T.glatt([[200.8, -58.4], [206.4, -57.6], [208.6, -58.6], [204, -60.8], [200, -61.2]])}" fill="#e2d4a6" opacity=".35"/>`;
  ki += linien(T, ks, "#3a3020", 0.42, 0.55) + linien(T, ks.map((p) => p.map(([x, y]) => [x + 0.35, y + 0.4])), "#f6ecc8", 0.28, 0.4);
  /* gelblicher Wangenfleck, klein und klar umrissen */
  ki += `<ellipse cx="194" cy="-50" rx="2.2" ry="1.5" fill="#dcc85e" opacity=".8"/>`;
  /* Augenhöhle: Schatten unter dem Brauenbogen */
  ki += fleck(T, "d", 201, -53.6, 5.4, 3.4, 0, 0.5);
  h += `<g filter="${rund(T, "skk", { weich: 3, tiefe: 3.2, umgebung: 0.4 })}">` + teil(T, kp, "#b9aa7c", { innen: ki, rand: "#2a2414", randA: 0.3, rw: 0.35 }) + "</g>";
  /* Hornschnabel: Oberkiefer vorn leicht hakig, fein gezähnte Schneide, Unterkieferschnabel greift darunter */
  h += `<path d="M213.8 -51.2Q214.6 -47.6 212.6 -45.2Q210.6 -44.6 208 -45.6L208.4 -47.4Q211 -47.2 212.4 -48.6Z" fill="${T.lg("skbs", [[0, "#5a4c30"], [1, "#2e261a"]])}"/>`;
  h += `<path d="M211.8 -45.4Q208 -44 203.4 -44.6L203.8 -45.8Q208 -45.4 211.4 -46.6Z" fill="#4a3e28"/>`;
  if (F) h += `<path d="M212 -45.6l-.5 .4l-.5 -.3l-.5 .4l-.5 -.3l-.5 .4l-.5 -.3" fill="none" stroke="#d8c8a0" stroke-width=".2" stroke-opacity=".6"/>`;
  /* Mundlinie leicht nach unten geschwungen, Mundwinkel unter dem hinteren Augenrand */
  h += linien(T, [[[212.4, -46.8], [208, -46.6], [203, -46.6], [199, -46.2], [197, -45.4]]], "#1a140a", 0.45, 0.8);
  h += `<ellipse cx="211.4" cy="-55.2" rx=".75" ry=".55" fill="#1a140a"/>`;
  /* Auge: rund, dunkel, feiner goldener Ring, dicke Lider (großes Unterlid), Glanzpunkt */
  h += echsAuge(T, 201.4, -53, 2.15, { iris: "#3e2a16", iris2: "#120a04", netz: "#0a0604", pupille: "rund", pupR: 0.44, offen: 0.78, wulst: "#a89a70", lid: "#4a4028", korn: "#dccfa8" });
  h += `<path d="M198.6 -50.4Q201.4 -48.4 204.4 -50.6" fill="none" stroke="#6a6044" stroke-width=".8" stroke-opacity=".7"/>`;

  /* ---------- Bauchpanzer-Brücke: nur schmal zwischen den Beinen, im Schatten ---------- */
  h += `<path d="M58 -31L150 -31.4L148 -26.6L60 -26.4Z" fill="#a08640"/><path d="M58 -31L150 -31.4L148 -26.6L60 -26.4Z" fill="#000" opacity=".38"/>`;
  /* ---------- Rückenpanzer ---------- */
  const D = polyl([[14, -36], [19, -52], [31, -71], [51, -87], [77, -96], [104, -97], [128, -91], [150, -78], [166, -61], [175, -47], [178, -37]]);
  const Rm = polyl([[14, -36], [17, -31.4], [30, -29.6], [60, -28.4], [100, -27.8], [140, -28.4], [164, -30.2], [174, -33], [178, -37]]);
  const P = (u, w) => { const a = Rm.at(u), b = D.at(u); return [a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w]; };
  const kurve = (u0, u1, w0, w1, n = 4) => { const p = []; for (let i = 0; i <= n; i++) p.push(P(u0 + (u1 - u0) * i / n, w0 + (w1 - w0) * i / n)); return p; };
  /* Schildgeometrie: Randschilde (12 inkl. Schwanz-/Nackenschild), 4 Rippenschilde, 5 Wirbelschilde mit Zickzack-Naht */
  const vs = [0.1, 0.27, 0.43, 0.59, 0.75, 0.9], vm = vs.slice(0, -1).map((v, i) => (v + vs[i + 1]) / 2);
  const zz = (u) => { for (let i = 0; i < vs.length - 1; i++) if (u >= vs[i] && u <= vs[i + 1]) { const k = Math.abs((u - vm[i]) / ((vs[i + 1] - vs[i]) / 2)); return 0.72 + 0.08 * k; } return 0.8; };
  const naht = (u0, u1, n = 8) => { const p = []; for (let i = 0; i <= n; i++) { const u = u0 + (u1 - u0) * i / n; p.push(P(u, zz(u))); } return p; };
  const rw = 0.17;
  const schilde = [];
  const mb = []; for (let i = 0; i <= 12; i++) mb.push(i / 12);
  for (let i = 0; i < 12; i++) schilde.push({ typ: "r", u0: mb[i], u1: mb[i + 1], p: kurve(mb[i], mb[i + 1], 0, 0, 3).concat(kurve(mb[i + 1], mb[i], rw, rw, 3)) });
  const cb = [0.03, vm[0], vm[1], vm[2], vm[3], 0.97];
  for (let i = 0; i < 4; i++) { const a = i === 0 ? 0.05 : cb[i], b = i === 3 ? 0.955 : cb[i + 1]; schilde.push({ typ: "c", u0: a, u1: b, p: kurve(a, b, rw, rw, 4).concat(naht(b, a, 8)) }); }
  for (let i = 0; i < 5; i++) schilde.push({ typ: "v", u0: vs[i], u1: vs[i + 1], p: naht(vs[i], vs[i + 1], 6).concat(kurve(vs[i + 1], vs[i], 1.01, 1.01, 3)) });
  /* Zeichnung: gelber Grund (Panzerfüllung), schwarze Bereiche an vorderer (rechter) und unterer Naht, Ringe, Wölbung */
  let dS = "", dG = "", dR = "", dRL = "", dF = "";
  const ctr = (sc) => { const xs = sc.p.map((q) => q[0]), ys = sc.p.map((q) => q[1]); return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2]; };
  for (const sc of schilde) {
    const [cx, cy] = ctr(sc);
    /* Areola-Zentrum: Rippenschilde nach oben-hinten, Wirbelschilde nach hinten, Randschilde nach oben-hinten */
    const az = sc.typ === "c" ? [cx - (sc.p[sc.p.length - 1][0] - sc.p[0][0]) * 0.18 - 3, cy - 6] : sc.typ === "v" ? [cx - 3, cy - 1] : [cx - 2, cy - 1.4];
    if (sc.typ === "r") {
      /* schwarzes Dreieck an der vorderen Naht (unregelmäßig) */
      const du = sc.u1 - sc.u0, a = P(sc.u1, rw * 0.98), b = P(sc.u1, rw * (0.15 + T.rnd() * 0.25)), c = P(sc.u1 - du * (0.35 + T.rnd() * 0.2), rw * 0.98);
      dS += `M${R(a[0])} ${R(a[1])}L${R(b[0])} ${R(b[1])}L${R(c[0])} ${R(c[1])}Z`;
    } else {
      /* schwarzer Bereich entlang der vorderen und unteren Naht: ganzer Schild dunkel, darüber das gelbe Feld, das die
         hintere/obere Naht erreicht und vorn/unten eingezogen ist */
      dS += poly(sc.p);
      const k = 0.58 + T.rnd() * 0.08;
      dG += pfad(T, sc.p.map(([x, y]) => ((x - az[0]) * 0.8 + (y - az[1]) * 0.6 > 0 ? [az[0] + (x - az[0]) * k, az[1] + (y - az[1]) * k] : [x, y])));
    }
    if (F) for (const f of sc.typ === "r" ? [0.7] : [0.8, 0.6]) {
      const ring = sc.p.map(([x, y]) => [az[0] + (x - az[0]) * f + (T.rnd() - 0.5) * 0.5, az[1] + (y - az[1]) * f + (T.rnd() - 0.5) * 0.5]);
      dR += T.glatt(ring); dRL += T.glatt(ring.map(([x, y]) => [x + 0.35, y + 0.45]));
    }
    dF += poly(sc.p);
  }
  const gW = T.rg("skw", [[0, "#fff", 0.2], [0.55, "#fff", 0], [0.85, "#000", 0.08], [1, "#000", 0.32]], 0.4, 0.4, 0.62);
  let si = `<path d="${dS}" fill="#2a2015"/><path d="${dG}" fill="#dcb54c"/>`;
  si += `<g fill="${gW}">` + schilde.map((sc) => `<path d="${poly(sc.p)}"/>`).join("") + "</g>";
  if (dR) si += `<path d="${dRL}" fill="none" stroke="#fff4c8" stroke-width=".45" stroke-opacity=".35"/><path d="${dR}" fill="none" stroke="#3a2c10" stroke-width=".5" stroke-opacity=".5"/>`;
  si += `<path d="${dF}" fill="none" stroke="#1a1208" stroke-width="1.2" stroke-opacity=".85" stroke-linejoin="round"/>`;
  if (F) si += `<path d="${dF}" fill="none" stroke="#f8e8b0" stroke-width=".5" stroke-opacity=".4" transform="translate(.6 .7)"/>`;
  /* Licht: halbmatter Glanz auf der Kuppel, Kernschatten unten rechts, Reflex an der Unterkante */
  si += `<g filter="${weich(T, "skp", 5)}">` + form(T, poly([[44, -82], [72, -98], [104, -100], [96, -88], [70, -80], [48, -70]]), "#fff", ' opacity=".26"') + form(T, poly([[120, -28], [178, -34], [180, -70], [150, -54], [120, -38]]), "#000", ' opacity=".28"') + "</g>";
  si += `<ellipse cx="82" cy="-90" rx="12" ry="3.4" fill="#fff" opacity=".35" transform="rotate(-14 82 -90)" filter="${weich(T, "skg", 1.2)}"/>`;
  si += `<path d="${poly(kurve(0.04, 0.96, 0.02, 0.02, 10).concat(kurve(0.96, 0.04, 0.09, 0.09, 10)))}" fill="#fff" opacity=".1" filter="${weich(T, "skr", 0.8)}"/>`;
  const umr = [];
  for (let i = 0; i <= 16; i++) umr.push(P(i / 16, 1.01));
  for (let i = 16; i >= 0; i--) { const [x, y] = P(i / 16, 0); umr.push([x, y + ((i % 1.33) < 0.6 && i < 4 ? 0.8 : 0)]); }
  h += `<g filter="${rund(T, "skp", { weich: 9, tiefe: 3.6, umgebung: 0.4 })}">` + teil(T, umr, "#dcb54c", { innen: si, rand: "#1e1408", randA: 0.5, rw: 0.6 }) + "</g>";
  /* Panzerrand wirft Schatten auf Hals, Kopfansatz und Beine */
  h += `<path d="M150 -30Q164 -33 176 -40M30 -30Q42 -29 52 -29" fill="none" stroke="#000" stroke-width="3" stroke-opacity=".3" filter="${weich(T, "skrs", 1.4)}"/>`;
  /* ---------- Vorderbein: leicht gebeugt, Unterarm senkrecht und abgeflacht, große überlappende Hornschuppen in
     unregelmäßigen Reihen (nach vorn-außen größer), 5 Krallen ---------- */
  const bv = [[152, -30], [164, -31], [170, -24], [171, -15], [172.4, -7], [175, -2.6], [175.4, -0.3, 1], [156, -0.3, 1], [156.6, -6], [154, -14], [151, -22]];
  let bvi = fleck(T, "l", 158, -20, 6, 8, -10, 0.3) + fleck(T, "d", 154, -6, 6, 5, 0, 0.3);
  let sch = "", schS = "";
  for (let r = 0; r < (F ? 7 : 0); r++) for (let c = 0; c < 4; c++) {
    const g = 2.6 + c * 0.6 + (T.rnd() - 0.5) * 0.9, x = 155 + c * 4.2 + r * 0.6 + (T.rnd() - 0.5) * 1.6, y = -27 + r * 3.7 + (T.rnd() - 0.5) * 1.2;
    if (x > 168 + r * 0.6) continue;
    sch += `M${R(x)} ${R(y)}q${R(g * 0.5)} ${R(-g * 0.45)} ${R(g)} 0q${R(-0.1)} ${R(g * 0.6)} ${R(-g * 0.5)} ${R(g * 0.75)}q${R(-g * 0.4)} ${R(-g * 0.15)} ${R(-g * 0.5)} ${R(-g * 0.75)}Z`;
    schS += `M${R(x + 0.1)} ${R(y + g * 0.7)}q${R(g * 0.4)} ${R(g * 0.2)} ${R(g * 0.9)} ${R(-g * 0.05)}`;
  }
  if (sch) bvi += `<path d="${schS}" fill="none" stroke="#000" stroke-width=".9" stroke-opacity=".3" filter="${weich(T, "sks2", 0.3)}"/><path d="${sch}" fill="${T.lg("sksch", [[0, "#e6d8ae"], [1, "#a8986a"]])}" stroke="#4a3e24" stroke-width=".25" stroke-opacity=".4"/>`;
  h += `<g filter="${rund(T, "skb", { weich: 3, tiefe: 3 })}">` + teil(T, bv, hautG("n", haut), { innen: bvi, rand: "#2a2414", randA: 0.3, rw: 0.4 }) + "</g>";
  h += krallen(T, [[175, -1.6, 3.4, 1.5, 30, 0.4], [171.6, -1.2, 3.4, 1.5, 42, 0.4], [168, -1, 3.2, 1.4, 52, 0.4], [164.2, -0.8, 3, 1.3, 62, 0.4], [160.4, -0.7, 2.6, 1.2, 72, 0.4]], "#3a3020");
  return fertig(0.1, h, [9, -97.4, 214.4, 0], [44, 60, 162, 166], [180, -66, 217, -38]);
}

module.exports = [
  { id: "krokodil", de: "das Krokodil", syl: "Kro-ko-DIL", it: "il coccodrillo", itSyl: "coc-co-DRIL-lo", en: "crocodile",
    gruppe: "Reptilien", lebensraum: "Fluss", laenge: 4.46, hoehe: 0.61, zeichne: krokodil },
  { id: "alligator", de: "der Alligator", syl: "Al-li-GA-tor", it: "l'alligatore", itSyl: "al-li-ga-TO-re", en: "alligator",
    gruppe: "Reptilien", lebensraum: "Sumpf", laenge: 3.77, hoehe: 0.46, zeichne: alligator },
  { id: "kobra", de: "die Kobra", syl: "KO-bra", it: "il cobra", itSyl: "CO-bra", en: "cobra",
    gruppe: "Reptilien", lebensraum: "Wald", laenge: 0.52, hoehe: 0.47, zeichne: kobra },
  { id: "python", de: "der Python", syl: "PY-thon", it: "il pitone", itSyl: "pi-TO-ne", en: "python",
    gruppe: "Reptilien", lebensraum: "Regenwald", laenge: 2.02, hoehe: 0.74, zeichne: python },
  { id: "eidechse", de: "die Eidechse", syl: "EI-dech-se", it: "la lucertola", itSyl: "lu-CER-to-la", en: "lizard",
    gruppe: "Reptilien", lebensraum: "Wiese", laenge: 0.221, hoehe: 0.021, zeichne: eidechse },
  { id: "chamaeleon", de: "das Chamäleon", syl: "Cha-MÄ-le-on", it: "il camaleonte", itSyl: "ca-ma-le-ON-te", en: "chameleon",
    gruppe: "Reptilien", lebensraum: "Regenwald", laenge: 0.317, hoehe: 0.1, zeichne: chamaeleon },
  { id: "leguan", de: "der Leguan", syl: "LE-gu-an", it: "l'iguana", itSyl: "i-GUA-na", en: "iguana",
    gruppe: "Reptilien", lebensraum: "Regenwald", laenge: 1.5, hoehe: 0.175, zeichne: leguan },
  { id: "schildkroete", de: "die Schildkröte", syl: "SCHILD-krö-te", it: "la tartaruga", itSyl: "tar-ta-RU-ga", en: "tortoise",
    gruppe: "Reptilien", lebensraum: "Garten", laenge: 0.205, hoehe: 0.097, zeichne: schildkroete },
  { id: "komodowaran", de: "der Komodowaran", syl: "Ko-mo-do-wa-RAN", it: "il drago di Komodo", itSyl: "DRA-go di KO-mo-do", en: "Komodo dragon",
    gruppe: "Reptilien", lebensraum: "Insel", laenge: 2.94, hoehe: 0.45, zeichne: komodowaran },
];
