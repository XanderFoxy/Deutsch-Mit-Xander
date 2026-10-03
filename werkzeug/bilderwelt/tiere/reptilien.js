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
  if (o.binden) inn += `<path d="${o.binden.map(([t, w]) => poly([Rr.P(t - w, -1.2), Rr.P(t + w, -1.2), Rr.P(t + w * 1.3, 1.2), Rr.P(t - w * 0.7, 1.2)])).join("")}" fill="${o.bindenFarbe || "#2a1e10"}" opacity="${o.bindenOp || 0.35}" filter="${weich(T, "bi", 0.9)}"/>`;
  if (o.muster) inn += `<path d="${pfad(T, umr)}" fill="${o.muster}"/>`;
  if (o.innen) inn += o.innen(Rr);
  /* Licht: Glanzband auf der Lichtseite, Kernschatten, Reflex auf der Schattenseite */
  inn += `<g filter="${weich(T, "sl", o.weich || 0.9)}">` + form(T, poly(Rr.band(L * 1.2, L * 0.5, 0, 1, 12)), "#fff", ` opacity="${o.glanz || 0.24}"`) +
    form(T, poly(Rr.band(L * 0.1, -L * 0.3, 0, 1, 12)), "#000", ' opacity=".12"') +
    form(T, poly(Rr.band(-L * 0.25, -L * 0.88, 0, 1, 12)), "#000", ' opacity=".46"') + form(T, poly(Rr.band(-L * 0.9, -L * 1.1, 0, 1, 12)), "#fff", ' opacity=".12"') + "</g>";
  /* glänzender Lichtstreif (Glanz glatter Schuppen) */
  if (T.fein && o.streif !== false) inn += linien(T, [Rr.zug(L * 0.55, o.s0 || 0.04, o.s1 || 0.96, 10)], "#fffaf0", o.streifW || 0.5, o.streifOp || 0.42).replace("/>", ` stroke-dasharray="${o.strich || "14 3 6 5 22 4 9 6"}"/>`);
  /* Bauchschilde: Querfugen */
  if (T.fein && o.schilde) { let d = ""; for (let t = 0.02; t < 0.99; t += o.schilde) { const a = Rr.P(t, B * 0.62), b = Rr.P(t, B * 1.05); d += `M${R(a[0])} ${R(a[1])}L${R(b[0])} ${R(b[1])}`; } inn += `<path d="${d}" stroke="#3a2a14" stroke-width=".16" stroke-opacity=".25"/>`; }
  return { svg: teil(T, umr, o.farbe, { innen: inn, rand: o.rand || "#1a1008", randA: o.randA != null ? o.randA : 0.3, rw: o.rw || 0.3 }), Rr };
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
    inn += form(T, Rr.band(-0.42, 0.12, tH, tS + 0.01, 8), musterBeulen(T, "fl", 2.2, { flach: 0.66, grund: 0.16, hell: 0.15, dunkel: 0.3, rot: -1 }));
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

/* =====================================================================
   ALLIGATOR (Mississippi-Alligator, Alligator mississippiensis)
   RECHERCHE: Erwachsen 3,4–4,5 m (Männchen), hier 3,8 m; schwerer gebaut als das Nilkrokodil. Schnauze breit, vorn
   U-förmig gerundet (von der Seite: stumpfe, gerundete Spitze, Nasenlöcher auf einem Höcker). Der Oberkiefer ist breiter
   als der Unterkiefer: bei geschlossenem Maul stehen nur die OBEREN Zähne außen sichtbar, die unteren (auch der große
   4. Unterkieferzahn) sitzen in Gruben des Oberkiefers und sind verdeckt – das wichtigste Unterscheidungsmerkmal.
   Kieferrand kaum gewellt. Farbe erwachsen: dunkel olivgrau bis fast schwarz, Bauch cremeweiß, Querbinden nur schwach
   (Jungtiere gelb gebändert). Iris olivgrün-gelblich, senkrechte Schlitzpupille, Nickhaut. Rückenschild aus gekielten
   Osteodermen, Nackenschild getrennt, Schwanz mit doppeltem, später einfachem Kamm; Hinterfuß mit Schwimmhäuten.
   Zeichenraum wie beim Krokodil (300 Einheiten = 3,8 m), Rumpf 6 % kräftiger.
   ===================================================================== */
function alligator(T) {
  const F = T.fein, US = ' gradientUnits="userSpaceOnUse"';
  let h = "";
  /* ---------- Rumpf + Schwanz als Rohr (Wirbelsäule mit Höhe oben/unten) ---------- */
  const sp = [[0, -0.5, 0.27, 0.27], [15, -1.4, 1.27, 1.38], [30, -2.5, 2.23, 2.54], [45, -3.8, 3.18, 3.5], [60, -5.6, 4.13, 4.35], [75, -7.8, 5.09, 5.3], [90, -10.1, 6.15, 6.25], [105, -12.5, 7.21, 7.1], [120, -14.9, 8.37, 7.95], [135, -17.1, 9.54, 8.8], [150, -18.9, 11.02, 9.75], [165, -20.1, 12.3, 10.81], [180, -20.8, 13.36, 11.77], [195, -21.1, 13.78, 12.19], [210, -21.3, 13.57, 11.87], [222, -21.6, 12.72, 11.02], [234, -22.2, 11.45, 9.75], [246, -23.2, 10.18, 8.06], [258, -24.0, 9.54, 8.27]];
  const Rr = rohr(sp, 5);
  const tx = (x) => { let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (Rr.P(m, 0)[0] < x) lo = m; else hi = m; } return (lo + hi) / 2; };
  const tH = tx(147), tS = tx(237);
  const umriss = Rr.zug(-1, 0, 1, 22).concat(Rr.zug(1, 0, 1, 22).reverse());

  /* ---------- ferne Beine: gleiche Bauart, im Körperton ~25 % dunkler, Schuppen sichtbar ---------- */
  const mB = "";
  const fernF = ["#45443a", "#35342c", "#22211b"];
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
    form(T, poly(Rr.band(-1.3, -0.42, 0, 1, nZ)), "#22221d") +
    form(T, poly(Rr.band(-0.15, 0.45, 0.12, 1, nZ)), "#535146", ' opacity=".85"') +
    form(T, poly(Rr.band(0.45, 1.3, 0.1, 1, nZ)), "#d4cfb7") +
    form(T, poly(Rr.band(0.2, 1.3, 0, 0.14, 4)), "#45443a", ' opacity=".8"') + "</g>";
  let bd = "";
  for (const b of [0.03, 0.085, 0.14, 0.195, 0.25, 0.305, 0.36, 0.415, 0.465]) { const w = 0.016 + b * 0.012; bd += T.glatt([Rr.P(b, -1.3), Rr.P(b + w, -1.3), Rr.P(b + w * 1.2, 0.1), Rr.P(b + w * 0.8, 0.6), Rr.P(b - w * 0.1, 0.5), Rr.P(b - w * 0.25, 0)]); }
  [[0.56, -0.2, 0.011, 0.5], [0.6, 0.12, 0.009, 0.32], [0.64, -0.28, 0.012, 0.55], [0.685, 0.05, 0.011, 0.4], [0.725, -0.22, 0.01, 0.48], [0.77, -0.3, 0.012, 0.5], [0.81, 0.02, 0.01, 0.38], [0.85, -0.24, 0.011, 0.46], [0.53, 0.15, 0.009, 0.3], [0.9, -0.1, 0.01, 0.4]]
    .filter((_, i) => F || i % 2 === 0).forEach(([t, v, w, hh], i) => { const [x, y] = Rr.P(t, v), rx = w * Rr.len * 1.3, ry = hh * 6; bd += `M${R(x - rx)} ${R(y)}a${R(rx)} ${R(ry)} ${12 + (i % 3) * 14} 1 0 ${R(2 * rx)} 0a${R(rx)} ${R(ry)} ${12 + (i % 3) * 14} 1 0 ${R(-2 * rx)} 0`; });
  inn += `<path d="${bd}" fill="#111110" opacity=".32" filter="${weich(T, "b", 0.6)}"/>`;
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
    inn += form(T, Rr.band(-0.42, 0.12, tH, tS + 0.01, 8), musterBeulen(T, "fl", 2.2, { flach: 0.66, grund: 0.16, hell: 0.15, dunkel: 0.3, rot: -1 }));
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
  h += teil(T, T.glatt(umriss), "#3e3d33", { innen: inn, rw: 0.35, randA: 0.32 });

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
  if (kamF) h += `<path d="${kamF}" fill="#1c1b17" stroke="#0f0e08" stroke-width=".2" stroke-opacity=".5"/>`;
  h += `<path d="${kam}" fill="${T.lg("kamm", [[0, "#55544a"], [0.55, "#36352d"], [1, "#22211c"]], 0, -36, 0, -12, US)}" stroke="#12110a" stroke-width=".22" stroke-opacity=".65" stroke-linejoin="round"/>`;
  if (kamL) h += `<path d="${kamL}" fill="none" stroke="#efe6c6" stroke-width=".24" stroke-opacity=".4" stroke-linecap="round"/>`;

  /* ---------- nahe Beine: Glieder mit Gelenken (Hüfte → Knie vorn → Unterschenkel zurück → Fuß flach; Schulter →
     Ellbogen hinten → Unterarm vor → Hand gespreizt), oberes Glied blendet weich in den Rumpf ---------- */
  const nahF = ["#5b5a4d", "#434237", "#292821"];
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
  const uk = [[299.8, -21.8], [300, -20.8], [299, -19.9], [296, -19.4], [290, -19], [282, -18.5], [274, -18], [266, -17.6], [260, -17.3], [254, -17.2], [248, -17.4], [244, -18], [243.6, -21], [246.6, -24.4], [251, -25.8], [255, -25.8], [258, -24.6], [266, -23], [276, -22.4], [288, -22.2], [296, -22.2]];
  let ui = "";
  ui += `<g filter="${weich(T, "k", 0.6)}">` + form(T, [[243, -17.4], [262, -17.4], [280, -18.4], [298, -19.6], [298, -20.4], [280, -19.8], [262, -19.6], [250, -20.6], [243, -20.4]], "#d8d2ba", ' opacity=".6"') + form(T, [[243, -21], [252, -25], [256, -24.8], [252, -21]], "#000", ' opacity=".25"') + "</g>";
  ui += fleck(T, "d", 264, -23, 14, 1.3, 0, 0.5) + fleck(T, "l", 254.6, -21.6, 3.2, 2.2, 0, 0.3);
  if (F) ui += flecken([[258, -21.2, 0.9], [263.6, -20.6, 0.7], [268.4, -21.4, 1], [274, -20.8, 0.75], [279.4, -21.3, 0.95], [285, -20.7, 0.7], [290.4, -21.1, 0.85], [295.6, -20.8, 0.6]], "#2a2920", 0.35);
  if (F) {
    ui += `<rect x="243" y="-26" width="58" height="9" fill="${musterBeulen(T, "kg", 1.45, { flach: 0.62, grund: 0.05, hell: 0.05, dunkel: 0.14 })}"/>`;

    ui += punkte(T, [[256, -23.4], [298, -22.2], [298, -20.2], [256, -19.4]], 32, 0.12, "#1a160a", 0.6);
  }
  /* Kopf geht hinten weich in den Hals über (Maske statt harter Kante) */
  const mid = T.id("kmask");
  T.def(`<linearGradient id="${mid}g" gradientUnits="userSpaceOnUse" x1="241" y1="0" x2="251.5" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>` +
    `<mask id="${mid}" maskUnits="userSpaceOnUse" x="230" y="-45" width="80" height="35"><rect x="230" y="-45" width="80" height="35" fill="url(#${mid}g)"/></mask>`);
  k += `<g mask="url(#${mid})">` + teil(T, uk, "#66634f", { innen: ui, rw: 0.28, randA: 0.32, kante: [uk.slice(1, 11)] });
  /* Oberkopf: flaches Schädeldach, erhöhte Augenhöhle, lange Schnauze, Nasenscheibe, gewellter Kieferrand mit Kerbe */
  const ko = [[246, -34.4], [252, -35.2], [257, -35.6], [263, -35.6], [265.2, -36.9], [268.4, -38.2], [271.4, -37.4], [273.4, -35.4], [278, -32.6], [284, -30.4], [290, -29], [294.6, -28.4], [297.4, -28.8], [299.4, -27.8], [300.8, -25.8], [301.1, -23.6], [300.4, -22.2, 1],
    [298, -21.5], [294, -21.4], [288, -21.2], [282, -21.2], [276, -21.4], [270, -21.8], [264, -22.3], [260, -23.2], [257, -24.8], [254.6, -27.2], [252.4, -30.2], [248, -31.8]];
  let ki = "";
  /* große Licht- und Schattenformen: Schnauzenrücken hell, Kieferseite unten dunkel, Mulde unter dem Auge,
     Kaumuskel hinter dem Maulwinkel gewölbt, Augenwulst */
  ki += `<g filter="${weich(T, "h", 0.9)}">` + form(T, [[250, -34.4], [262, -35.2], [272, -35], [284, -30], [296, -27.2], [299, -26], [292, -26.4], [280, -29.6], [268, -32], [256, -32.6]], "#ece2bb", ' opacity=".26"') +
    form(T, [[257, -25.4], [264, -23.4], [280, -22.6], [296, -22.8], [296, -24], [280, -24.4], [264, -26], [258, -28]], "#000", ' opacity=".24"') +
    form(T, [[260, -31.6], [266, -32.6], [274, -32], [280, -29.4], [276, -28.4], [266, -29.6]], "#000", ' opacity=".2"') + "</g>";
  ki += fleck(T, "l", 254, -29.4, 3, 3.2, 0, 0.32) + fleck(T, "l", 287, -26.4, 9, 1.4, -14, 0.22) + fleck(T, "l", 268.6, -37.2, 3.4, 1.3, -4, 0.45);
  if (F) ki += flecken([[262.4, -26.8, 0.8], [267.4, -27.6, 0.95], [273, -26.4, 0.7], [278, -27.6, 0.9], [282.6, -25.6, 0.7], [287.4, -26.2, 0.8], [292, -25.2, 0.6], [270.8, -24.8, 0.6], [259.6, -29, 0.8], [276.4, -24.6, 0.6]], "#1a1913", 0.3);
  if (F) {
    /* fein gekörnte Haut (gezeichnete Körnchen, schwach), Schädeldach gröber; Lippenschuppen; Sinnesorgane */
    ki += fleck(T, "d", 256, -32.6, 7, 2, 0, 0.25);
    ki += `<rect x="243" y="-38" width="58" height="17" fill="${musterBeulen(T, "kg", 1.45, { flach: 0.62, grund: 0.05, hell: 0.05, dunkel: 0.14 })}"/>`;
    ki += punkte(T, [[262, -26.4], [298, -25.4], [298, -22.6], [262, -23.6]], 34, 0.11, "#14120a", 0.6);
    ki += reihe(T, [[257.4, -25], [265, -22.8], [275, -22], [286, -21.8], [297.6, -22]], 30, -1.1, "#16130a", 0.12, 0.36, 0.25);
  }
  k += teil(T, ko, "#3c3b32", { innen: ki, rw: 0.3, randA: 0.32, kante: [ko.slice(0, 17)] }) + "</g>";
  /* Maulspalte: dunkle Linie zwischen den Kiefern */
  k += linien(T, [[[256.6, -25.2], [260, -23.4], [264, -22.4], [270, -21.9], [276, -21.5], [282, -21.3], [288, -21.3], [294, -21.5], [298, -21.6], [300.4, -22.1]]], "#0b0a08", 0.42, 0.85);
  /* obere Zähne: der breitere Oberkiefer überdeckt den Unterkiefer – nur die oberen Zähne stehen außen sichtbar */
  const okZ = [[299.2, -21.9, 1, 0.55, -0.04], [297.2, -21.6, 1.3, 0.64, -0.05], [294.9, -21.5, 1.65, 0.74, -0.06], [292.5, -21.4, 1.2, 0.6, -0.04], [290.2, -21.3, 1.4, 0.66, -0.04], [287.9, -21.2, 1.95, 0.82, -0.06],
    [285.5, -21.2, 1.6, 0.72, -0.05], [283.1, -21.2, 1.45, 0.68, -0.04], [280.7, -21.25, 1.4, 0.66, -0.04], [278.3, -21.3, 1.5, 0.68, -0.04], [275.9, -21.4, 1.6, 0.7, -0.04], [273.5, -21.55, 1.5, 0.68, -0.04],
    [271.1, -21.7, 1.4, 0.64, -0.03], [268.7, -21.85, 1.3, 0.6, -0.03], [266.3, -22, 1.15, 0.56, -0.03], [263.9, -22.25, 1, 0.52, -0.02], [261.7, -22.6, 0.85, 0.46, -0.02]];
  k += zaehne(T, F ? okZ : okZ.filter((_, i) => i % 2 === 0), 1, { n: "o", spitze: "#faf6ea", mitte: "#efe8d2", basis: "#c8b48c", rw: 0.1 });
  /* untere Zähne: beim Alligator in Gruben des breiteren Oberkiefers versenkt – bei geschlossenem Maul unsichtbar */
  /* Nackenschild: Hinterhauptschilde + große gekielte Nackenplatten */
  let nk = "";
  for (const [x, y, w, hh] of [[251, -35.1, 2.2, 0.9], [244, -34.6, 3.4, 2], [239.2, -34, 3, 1.7]]) nk += `M${R(x - w / 2)} ${R(y + 0.5)}Q${R(x - w * 0.15)} ${R(y - hh * 1.6)} ${R(x + w / 2)} ${R(y + 0.5)}Z`;
  k += `<path d="${nk}" fill="#34332b" stroke="#12110a" stroke-width=".22" stroke-opacity=".6"/>`;
  if (F) k += linien(T, [[[243, -34.9], [244, -36.3]], [[238.4, -34.3], [239, -35.5]], [[250.4, -34.9], [250.8, -35.5]]], "#efe6c6", 0.26, 0.45);
  /* Auge: erhöht im Augenwulst, Schlitzpupille, Nickhaut halb vorgezogen, knöchernes Oberlid als heller Wulst mit Lidfalte */
  k += fleck(T, "d", 268.4, -35, 2.8, 2, -5, 0.45);
  k += reptilAuge(T, 268.5, -35.3, 1.55, { iris: "#b9a44c", iris2: "#4b4318", offen: 0.6, winkel: -6, nick: 0.27, netzFarbe: "#3d370e", haut: "#3c3b32" });
  k += linien(T, [[[265, -36.6], [267, -37.5], [269.6, -37.6], [272.2, -36.6]]], "#14120a", 0.28, 0.5);
  /* Ohrschlitz mit Ohrklappe hinter dem Auge */
  k += `<path d="M257.6 -33.6Q260.4 -34.3 263 -33.9Q260.4 -33.1 257.6 -33.6Z" fill="#14120a" opacity=".7"/>` + linien(T, [[[257.4, -34], [260.2, -34.9], [263.2, -34.4]]], "#ebe2c0", 0.2, 0.2);
  /* Nasenscheibe (erhabener Ring) mit Nasenloch */
  k += fleck(T, "l", 297.8, -27.9, 1.6, 0.7, 0, 0.5) + `<path d="M296.9 -27.7Q297.9 -28.4 298.9 -27.7Q297.9 -27.4 296.9 -27.7Z" fill="#0f0d07"/>` + (F ? linien(T, [[[296.4, -28.1], [297.9, -28.8], [299.4, -28.1]]], "#f4ead0", 0.14, 0.5) : "");
  h += `<g transform="translate(0 2)">${k}</g>`;
  return fertig(3.8 / 3, h, [0, -36.4, 301, 0], [138, 162, 228, 245], [243, -38, 302, -14]);
}

/* =====================================================================
   KOBRA (Brillenschlange, Indische Kobra, Naja naja)
   RECHERCHE: 1–1,5 m (bis 2 m), Körper ~3,5–4 cm dick. Abwehrhaltung: vorderes Drittel aufgerichtet (40–60 cm), Nacken-
   rippen gespreizt → breiter Nackenschild (12–14 cm breit, ~16 cm hoch); Schild vorn leicht hohl, der Rand zeigt die
   braune Rückenhaut. Bauchseite des Schildes blass gelblich, Mittelstreif aus breiten Bauchschilden, seitlich je ein
   dunkler Fleck, darunter ein dunkles Kehlband. Rückseite: die „Brille“ (zwei Ocellen mit Bogen). Glatte, glänzende
   Rückenschuppen in Schrägreihen. Färbung (Südindien): gelblich- bis olivbraun, fein dunkel gesprenkelt. Kopf breit-
   oval, ~4,5 cm lang, kaum vom Hals abgesetzt; große Kopfschilde, 7 Oberlippenschilde (3. und 4. berühren das Auge);
   Auge mittelgroß, RUNDE Pupille, Iris dunkelbraun; gespaltene schwarze Zunge.
   Ansicht: schräg von vorn links (Schild ~50° gedreht) – Kopf nach rechts, Schild dahinter, Rumpf in einer Schlinge.
   Zeichenraum: 1 Einheit = 0,3 cm.
   ===================================================================== */
function kobra(T) {
  const F = T.fein;
  let h = "";
  const braun = "#9a7444", bauch = "#e0cf9c";
  const mS = F ? musterRauten(T, "k", 2.2, { hell: 0.2, dunkel: 0.24, rand: 0.18, rot: -10 }) : "";
  const spr = (Rr) => F ? punkte(T, Rr.band(-0.9, 0.5, 0.05, 0.95, 10), 36, 0.35, "#3a2610", 0.3) : "";
  /* 1) hintere Hälfte der Schlinge (läuft nach links: Bauch/Licht-Seiten in v gespiegelt) */
  h += schlangenRohr(T, [[150, -15, 6.6], [140, -21.5, 6.8], [115, -24.5, 7], [85, -24.5, 7], [60, -22, 6.8], [46, -17, 6.6], [43, -12.6, 6.4]],
    { farbe: "#86643a", bauch, bauchSeite: -1, licht: 1, muster: mS, binden: [[0.35, 0.03], [0.7, 0.03]], innen: spr, s0: 0.1, s1: 0.85 }).svg;
  /* 2) Schwanz und vordere Schlingenhälfte */
  h += schlangenRohr(T, [[10, -1.4, 0.7], [28, -3, 2.8], [48, -5.2, 5.2], [75, -6.6, 6.6], [105, -7.2, 7], [130, -8, 7], [147, -11, 6.8], [152, -16.4, 6.6]],
    { farbe: braun, bauch, bauchSeite: 1, licht: -1, muster: mS, binden: [[0.3, 0.02], [0.58, 0.02], [0.84, 0.02]], innen: spr, schilde: 0.018 }).svg;
  /* 3) Körper kreuzt oben über die Schlinge und steigt in sanftem S zum Schild auf; dunkles Kehlband unter dem Schild */
  h += schlangenRohr(T, [[42, -14, 6.6], [60, -15.6, 7], [85, -17.2, 7], [104, -19.2, 7], [118, -23.4, 7], [124.6, -33, 7], [122.6, -48, 6.8], [116.6, -64, 6.8], [114.4, -80, 7], [117.6, -92, 7], [120.6, -104, 7]],
    { farbe: braun, bauch, bauchSeite: 1, licht: -1, muster: mS, binden: [[0.18, 0.015], [0.36, 0.015], [0.955, 0.02]], bindenOp: 0.45, innen: spr, schilde: 0.016, s1: 0.97 }).svg;
  h += `<path d="M48 -8.4Q90 -10.6 116 -12.4" stroke="#000" stroke-width="3" stroke-opacity=".2" fill="none" filter="${weich(T, "ks", 1)}"/>`;

  /* 4) Nackenschild von vorn (schräg): blasse Unterseite, Bauchschild-Mittelstreif, dunkle Seitenflecken, Kehlband,
        brauner Randsaum (Rückenhaut am hohlen Rand), Licht von links, Schatten des Kopfes */
  const hs = [[0, -27], [10, -26], [18.6, -21.6], [24, -12.6], [25.4, -2.4], [23, 7.4], [17.4, 15.6], [12.6, 22.6], [9.6, 30], [-9.6, 30], [-12.6, 22.6], [-17.4, 15.6], [-23, 7.4], [-25.4, -2.4], [-24, -12.6], [-18.6, -21.6], [-10, -26]];
  let hi = "";
  hi += form(T, poly(hs.map(([x, y]) => [x * 0.84, y * 0.9 + 1.4])), "#d5bd8a");
  if (F) hi += `<rect x="-24" y="-30" width="48" height="62" fill="${musterRauten(T, "kh", 2.4, { hell: 0.14, dunkel: 0.16, rand: 0.12, rot: 62 })}"/>`;
  /* Mittelstreif: breite Bauchschilde, nach oben schmaler */
  hi += `<g filter="${weich(T, "ms", 0.5)}">` + form(T, poly([[-5, 30], [-4, 6], [-2.6, -14], [0, -20], [2.6, -14], [4, 6], [5, 30]]), "#e6d6a8", ' opacity=".8"') + "</g>";
  if (F) { let d = ""; for (let y = -16; y < 30; y += 2.1) { const w = 2.6 + (y + 18) * 0.04; d += `M${R(-w)} ${R(y)}Q0 ${R(y + 0.7)} ${R(w)} ${R(y)}`; } hi += `<path d="${d}" fill="none" stroke="#6a5030" stroke-width=".22" stroke-opacity=".55"/>`; }
  /* dunkle Seitenflecken und Kehlband */
  hi += `<g filter="${weich(T, "kf", 0.7)}"><ellipse cx="-15.6" cy="12" rx="2.8" ry="4" fill="#3a2612" opacity=".55"/><ellipse cx="15.6" cy="12" rx="2.8" ry="4" fill="#3a2612" opacity=".55"/>` +
    "</g>" + `<path d="M-12 21Q0 24 12 21L11 27Q0 29.6 -11 27Z" fill="#2e1e0e" opacity=".7" filter="${weich(T, "kb", 1.1)}"/>`;
  /* Licht: linker Flügel hell, rechter im Schatten, Mitte leicht hohl; Schatten von Kopf und Kinn */
  hi += `<g filter="${weich(T, "hs", 1.6)}">` + form(T, poly([[-28, -32], [-9, -32], [-12, 32], [-28, 32]]), "#fff", ' opacity=".18"') + form(T, poly([[9, -32], [28, -32], [28, 32], [7, 32]]), "#000", ' opacity=".28"') +
    form(T, poly([[-3, -30], [16, -30], [14, -14], [-2, -15]]), "#000", ' opacity=".3"') + "</g>";
  /* brauner Randsaum (Rückenhaut am aufgewölbten Rand) */
  hi += `<path d="${T.glatt(hs.slice(11).concat(hs.slice(0, 7)), false)}" fill="none" stroke="#7a5630" stroke-width="3.6" stroke-opacity=".8" filter="${weich(T, "rs", 0.5)}"/>`;
  let hood = teil(T, hs, "#c9ad78", { innen: hi, rand: "#1a1008", randA: 0.3, rw: 0.45 });
  hood += linien(T, [hs.slice(10).concat([hs[0]]).map(([x, y]) => [x * 1.0, y * 1.0])], "#f2e2bc", 0.6, 0.3);
  h += `<g transform="matrix(.78 .05 0 1 121 -126)">${hood}</g>`;

  /* 5) Kopf vor dem Schild, nach rechts gewendet (Gruppe leicht vergrößert, sitzt oben vorn am Schild) */
  h += `<g transform="translate(124.6 -142.4) scale(1.12) translate(-124 153)">` + (() => {
    let h = "";
    const kp = [[118.4, -153.2], [119.6, -156.2], [122.6, -158.2], [127, -159.2], [131.4, -158.9], [134.2, -157.6], [136.3, -155.8], [137.4, -153.8], [137.2, -152.2], [135.8, -151], [131.6, -150.2], [126.4, -149.8], [121.6, -150], [119, -151]];
    let ki = "";
    /* Licht: Oberkopf und Überaugenschild hell, Kehle/Unterkiefer dunkel; feiner Glanz */
    ki += `<g filter="${weich(T, "kk", 0.5)}">` + form(T, poly([[119.4, -155], [123, -158], [127, -158.8], [132, -158.4], [136, -155.4], [131, -156.4], [125, -156.4], [120.4, -154.4]]), "#f4e2b4", ' opacity=".4"') +
      form(T, poly([[119.4, -150.6], [127, -150], [134.4, -150.8], [137, -152.2], [131, -152.8], [124, -152.6], [120, -152.6]]), "#000", ' opacity=".3"') + "</g>";
    /* Kopfschilde: Oberlippenschilde (7, hoch), Unterlippenschilde, Prä-/Postocularia, Schläfenschilde, Kopfoberseite */
    const fugen = [[[123.4, -152.4], [123, -154.2]], [[125.6, -152.5], [125.4, -154.6]], [[127.8, -152.5], [128, -154.4]], [[130.4, -152.6], [130.6, -153.8]], [[132.6, -152.6], [133.2, -154.2]], [[134.8, -152.8], [135.4, -154.2]],
      [[121.2, -154.8], [123, -154.2], [125.4, -154.6], [128, -154.4], [129.4, -154]], [[132.6, -156], [133.2, -154.2], [135.4, -154.2], [136.6, -154.8]], [[129.6, -157], [129, -155.2], [129.4, -154]], [[132.4, -156.6], [134.6, -156.4], [136.3, -155.8]],
      [[124, -158.4], [125.4, -156.6], [128.6, -156.8]], [[128.6, -156.8], [129.6, -157]], [[121.6, -157.2], [123.6, -156.2], [124.6, -154.8]], [[124.6, -151.2], [125, -150]], [[128.4, -151.2], [128.8, -150.2]], [[132.2, -151.4], [132.6, -150.4]]];
    ki += linien(T, fugen, "#2a1a0a", 0.14, 0.42) + (F ? linien(T, fugen.map((p) => p.map(([x, y]) => [x + 0.14, y + 0.16])), "#f6e6bc", 0.1, 0.32) : "");
    if (F) ki += punkte(T, kp, 14, 0.18, "#3a2610", 0.28);
    h += teil(T, kp, "#a07a46", { innen: ki, rand: "#1a1008", randA: 0.3, rw: 0.2 });
    /* Maulspalte */
    h += linien(T, [[[137, -152.4], [133, -152.6], [128, -152.5], [123.6, -152.3], [121.2, -151.6]]], "#120a04", 0.24, 0.75);
    /* Überaugenschild-Wulst wirft Schatten, Auge rund, dunkelbraun mit goldenem Pupillenring */
    h += fleck(T, "l", 131.2, -157.4, 2.6, 0.8, 0, 0.5);
    h += reptilAuge(T, 131, -155, 1.08, { iris: "#6a4520", iris2: "#1a0e06", pupille: "rund", offen: 0.95, netz: false, haut: "#a07a46", lidRand: "#2a1a0a" });
    h += `<ellipse cx="136.1" cy="-154.5" rx=".46" ry=".36" fill="#120a04"/>`;
    /* Zunge: schwarz, fein gespalten, leicht geschwungen */
    h += `<path d="M137.3 -152.6C139.6 -152.7 141.8 -153.2 143.6 -153M143.6 -153Q145 -153.9 146.4 -154.8M143.6 -153Q145.1 -152.7 146.5 -151.8" fill="none" stroke="#141010" stroke-width=".3" stroke-linecap="round"/>` +
      (F ? `<path d="M138 -152.8C140 -152.9 141.8 -153.3 143.2 -153.2" fill="none" stroke="#fff" stroke-width=".08" stroke-opacity=".5"/>` : "");
    return h;
  })() + "</g>";
  h += fleck(T, "d", 127, -138.6, 10, 2.2, 0, 0.28);
  return fertig(0.3, h, [9, -156, 160, 0], [30, 95, 145], [116, -158, 158, -134]);
}

/* =====================================================================
   PYTHON (Tigerpython, hier Dunkler Tigerpython / Burmapython, Python bivittatus)
   RECHERCHE: meist 3–5 m (hier 4 m), Rumpf bis ~20 cm dick, Kopf ~14 cm, deutlich vom Hals abgesetzt, Schnauze breit-
   gerundet. Grundfarbe hellbraun/gelblich-hellbraun, darauf große, unregelmäßige, schwarz gesäumte, kastanienbraune
   Sattelflecken auf dem Rücken und kleinere Seitenflecken – dazwischen bleibt nur ein schmales helles Netz; Bauch
   weißlich. Kopf: dunkle Pfeilspitzen-Zeichnung auf dem Oberkopf (Spitze zur Schnauze), dunkler Streif von der Nase
   durchs Auge zum Mundwinkel, darunter ein heller Streif, unter dem Auge ein dunkler Keil. Wärmegruben in den vorderen
   Ober- und hinteren Unterlippenschilden. Auge mit SENKRECHTER Pupille, Iris goldbraun. Kleine glatte, leicht
   irisierende Schuppen. Ansicht: schräg von oben-seitlich, Körper in einer lockeren Schlinge, Kopf vorn rechts.
   Zeichenraum: 1 Einheit = 1,4 cm.
   ===================================================================== */
function python(T) {
  const F = T.fein;
  let h = "";
  const mS = F ? musterRauten(T, "p", 1.5, { hell: 0.18, dunkel: 0.2, rand: 0.12, rot: -6 }) : "";
  /* Fleckenzeichnung im Rohr (oben = v-Seite „oben“): große Sattelflecken, versetzte Seitenflecken, schwarz gesäumt */
  const flecken = (oben, dt) => (Rr) => {
    let dS = "", dL = "";
    const fl = (t, v0, v1, w, j, n = 12) => {
      const P = [];
      for (let i = 0; i < n; i++) {
        const a = i / n * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a);
        /* unregelmäßig gelappt: Grundform abgerundetes Rechteck, Ränder mit Zacken und Buchten */
        const rr = 1 + (T.rnd() - 0.5) * j + (i % 3 === 0 ? -0.18 : 0.06);
        P.push(Rr.P(t + Math.sign(c) * Math.pow(Math.abs(c), 0.5) * w * rr, -oben * ((v0 + v1) / 2 + Math.sign(sn) * Math.pow(Math.abs(sn), 0.7) * (v1 - v0) / 2 * rr)));
      }
      return P;
    };
    for (let t = 0.04 + T.rnd() * dt * 0.3; t < 0.97; t += dt * (0.8 + T.rnd() * 0.4)) {
      const gr = 0.85 + T.rnd() * 0.35;
      dS += pfad(T, fl(t, -1.4, -0.12 - T.rnd() * 0.12, dt * 0.4 * gr, 0.34));
      dL += pfad(T, fl(t + dt * (0.45 + T.rnd() * 0.1), 0.04, 0.74, dt * 0.26 * gr, 0.34, 9));
    }
    return `<path d="${dS}" fill="#6c4524" stroke="#1a0d05" stroke-width="${F ? 0.55 : 0.4}" stroke-opacity=".7" stroke-linejoin="round"/><path d="${dL}" fill="#5e3c1e" stroke="#1a0d05" stroke-width="${F ? 0.45 : 0.35}" stroke-opacity=".65" stroke-linejoin="round"/>`;
  };
  const opt = (oben, dt, extra = {}) => Object.assign({ farbe: "#b39a68", bauch: "#e8dcc0", bauchSeite: oben === -1 ? 1 : -1, licht: oben, muster: mS, innen: flecken(oben, dt), n: 18, streifW: 0.7, streifOp: 0.3 }, extra);
  const schatten = (sp) => { const Rr = rohr(sp.map(([x, y, r]) => [x, y, r, r]), 6); return `<path d="${poly(Rr.band(0.6, 1.3, 0.02, 0.98, 14))}" fill="#000" opacity=".28" filter="${weich(T, "ps", 1.4)}"/>`; };
  /* Körper in Ruhe eingerollt (von schräg oben-seitlich): untere Schlinge als Ring (hintere Hälfte, vordere Hälfte mit
     Schwanz), darauf die obere Windung, die als Hals zum Kopf aufsteigt; Kopf liegt oben vorn rechts */
  const fern = [[168, -18, 7.6], [154, -23.6, 7.8], [118, -24.8, 8], [82, -24.6, 8], [52, -22.4, 7.6], [40, -18.6, 7.4]];
  h += schlangenRohr(T, fern, opt(1, 14 / 150, { farbe: "#a68c5c", n: 20 })).svg;
  const nah = [[2, -1.4, 0.6], [16, -3.4, 2.6], [32, -6.2, 5.4], [52, -8.2, 7.6], [82, -8.1, 8], [116, -8.1, 8], [150, -8.7, 8], [166, -11.4, 7.8]];
  h += schatten(nah) + schlangenRohr(T, nah, opt(-1, 14 / 175, { n: 22 })).svg;
  /* rechtes Schlingenende: Körper biegt nach hinten weg – gerundetes Ende, von der oberen Windung überdeckt */
  h += `<ellipse cx="166" cy="-11.6" rx="7.4" ry="8" fill="#b09664"/><ellipse cx="166" cy="-11.6" rx="7.4" ry="8" fill="${T.lg("pkap", [[0, "#fff", 0.24], [0.35, "#fff", 0.03], [0.7, "#000", 0.3], [1, "#000", 0.45]], 0, 0, 0.35, 1)}"/>` +
    (F ? `<ellipse cx="166" cy="-11.6" rx="7.2" ry="7.8" fill="${mS}" opacity=".85"/>` : "") + `<path d="M166 -19.6A7.4 8 0 0 1 166 -3.6" fill="none" stroke="#1a1008" stroke-width=".3" stroke-opacity=".3"/>` +
    `<path d="M164.6 -17Q170.4 -17.4 172.4 -13Q170.4 -10.2 166.4 -11Q164.2 -13.6 164.6 -17Z" fill="#6a4322" stroke="#140a04" stroke-width=".5" stroke-opacity=".7"/>`;
  const oben = [[36, -15.6, 7.4], [42, -20.8, 7.2], [58, -21.6, 7.2], [88, -21, 7], [118, -20.6, 6.8], [146, -19.8, 6.4], [166, -20.4, 5.8], [178, -24, 5], [185, -30, 4.2], [190, -35.4, 3.7], [195, -38.6, 3.4]];
  h += `<path d="M44 -14.2Q100 -12.2 172 -13" stroke="#000" stroke-width="3.6" stroke-opacity=".25" fill="none" filter="${weich(T, "ks", 1.2)}"/>`;
  h += schlangenRohr(T, oben, opt(-1, 14 / 165, { n: 20, s0: 0.05, s1: 0.95 })).svg;
  h += `<g transform="translate(22 -16.6)">` + (() => { let h = "";
  /* Kopf: deutlich abgesetzt, lang, breit gerundete Schnauze, Profil nach rechts */
  const kp = [[169.4, -21.4], [171.6, -24.2], [176, -26], [181.6, -26.6], [186.6, -25.8], [190, -24.2], [191.8, -22.4], [192, -20.8], [190.8, -19.6], [187, -19], [181.6, -18.6], [176.4, -18.6], [172.2, -19.2]];
  let ki = "";
  ki += `<g filter="${weich(T, "pk", 0.4)}">` + form(T, poly([[171, -22.8], [176, -25.4], [183, -25.8], [190.6, -23], [183, -23.4], [176, -23]]), "#fff3d2", ' opacity=".3"') +
    form(T, poly([[172, -19.2], [180, -18.8], [189, -19.4], [191.6, -20.4], [184, -20.8], [176, -20.6]]), "#000", ' opacity=".25"') + "</g>";
  /* Pfeilspitze seitlich (dunkel, weich gerandet), heller Saum, Augenstreif Nase→Auge→Mundwinkel, Unteraugenkeil */
  ki += `<g filter="${weich(T, "pz", 0.25)}">` + form(T, [[169, -23.6], [172.4, -25.8], [178, -27], [185.6, -26.8], [190.4, -24.6], [186, -24.4], [180, -24.6], [174.6, -24]], "#5a3a1c", ' opacity=".9"') +
    form(T, [[169.6, -21.8], [174, -22.4], [179.6, -22.6], [186, -22.6], [190.8, -22.8], [186.6, -21.8], [180, -21.6], [174.4, -21.2]], "#45301a", ' opacity=".85"') +
    form(T, [[170.6, -20.6], [176, -20.9], [181.6, -21.1], [184.6, -20.8], [180.6, -20.2], [175, -20]], "#efe2c2", ' opacity=".7"') +
    form(T, [[180.4, -21.6], [182.4, -21.6], [181.6, -19.4], [180.6, -19.2]], "#45301a", ' opacity=".8"') + "</g>";
  /* Lippenschilde mit Wärmegruben (kleine Schlitze in den Schilden, vorn oben, hinten unten) */
  ki += reihe(T, [[172.6, -20.2], [178, -20.3], [184, -20.3], [191, -20.8]], 13, -1.2, "#2a1a0a", 0.09, 0.4, 0);
  ki += `<path d="M190.2 -20.7h.15M188.9 -20.6h.15M187.6 -20.5h.15M186.3 -20.4h.15M176.4 -19.3h.15M174.9 -19.4h.15M173.4 -19.5h.15" stroke="#1a0e06" stroke-width=".42" stroke-linecap="round"/>`;
  if (F) ki += `<rect x="168" y="-28" width="25" height="10" fill="${musterRauten(T, "pk", 0.75, { hell: 0.14, dunkel: 0.14, rand: 0.06 })}"/>`;
  h += teil(T, kp, "#bba06e", { innen: ki, rand: "#1a1008", randA: 0.3, rw: 0.2 });
  h += linien(T, [[[191.6, -20.6], [186, -20.2], [180, -20], [175, -20.2], [172.6, -20.6]]], "#140a04", 0.18, 0.7);
  h += reptilAuge(T, 181.6, -22.5, 0.82, { iris: "#b48c40", iris2: "#3a2410", pupille: "schlitz", offen: 0.85, netzFarbe: "#3a2410", haut: "#45301a", lidRand: "#2a1a0a" });
  h += `<ellipse cx="190.4" cy="-23.4" rx=".42" ry=".28" fill="#140a04"/>`;
  return h; })() + "</g>";
  return fertig(1.4, h, [1, -43.4, 214, 0], [20, 80, 150], [188, -45, 215, -33]);
}

/* =====================================================================
   EIDECHSE (Zauneidechse, Lacerta agilis), Männchen im Frühjahr
   RECHERCHE: Gesamtlänge 18–24 cm (hier 22 cm), Kopf-Rumpf ~10 cm, Schwanz etwas länger; gedrungen, kurze Beine,
   großer, hoher Kopf (Männchen). Männchen im Frühjahr: Flanken und Vorderbeine leuchtend grün, Kopfseiten grünlich,
   Rücken und Schwanz braun; dunkles Rückenband mit Reihen dunkler Flecken mit weißem Kern (Ocellen), an den Flanken
   dunkle Augenflecken; Bauch grünlich-gelb mit schwarzen Punkten. Rückenschuppen klein, schmal, gekielt; Flanken-
   schuppen glatt, körnig; Bauch mit großen rechteckigen Bauchschilden in Längsreihen; Schwanz mit Wirteln (Ringen)
   gekielter Schuppen. Kopf mit großen Kopfschilden, Unteraugenschild, großes Ohrloch (Trommelfell) hinter dem Mundwinkel,
   Halsband aus vergrößerten Schuppen unter der Kehle. Auge mit runder Pupille, rotbraun-goldene Iris, bewegliche Lider.
   Füße: fünf lange, dünne Zehen mit Krallen (am Hinterfuß die 4. Zehe am längsten).
   Zeichenraum: 1 Einheit = 0,1 cm (221 Einheiten = 22 cm).
   ===================================================================== */
function eidechse(T) {
  const F = T.fein;
  let h = "";
  const sp = [[0, -1.2, 0.4, 0.4], [20, -2.2, 1.2, 1.2], [45, -3.6, 2.2, 2.2], [70, -5.6, 3.2, 3.2], [95, -8.4, 4.4, 4.2], [115, -11.6, 5.8, 5.2], [130, -14.8, 7.6, 7], [150, -16, 8.4, 8.4], [168, -16.4, 8, 7.8], [182, -17, 7.2, 6.6], [194, -18.4, 6.4, 5.8], [202, -19.4, 6.2, 5.8]];
  /* ferne Beine (Körperton, 25 % dunkler) */
  const fernG = ["#5d7a36", "#4a6229", "#30401a"], fernH = ["#6a6440", "#544f33", "#363221"];
  h += reptilBein(T, { n: "ef1", ton: "ef", farben: fernG, ticks: false,
    glieder: [[[184, -12], [189, -12], [190, -7], [191.6, -3], [188.6, -2.4], [187, -6]], [[187.4, -3], [191.4, -3], [193.4, -1.6], [193.6, -0.2, 1], [187, -0.2, 1]]],
    zehen: [[192, -1.4, 196.4, -0.9, 0.75], [192.4, -1.1, 198.4, -0.6, 0.75], [192.4, -0.8, 197.6, -0.45, 0.75]], krallen: [[196.4, -0.9, 0.9, 0.3, 20, 0.4], [198.4, -0.6, 1, 0.3, 15, 0.4], [197.6, -0.45, 1, 0.3, 10, 0.4]] });
  h += reptilBein(T, { n: "ef2", ton: "eh", farben: fernH, ticks: false,
    glieder: [[[110, -12], [115, -11], [114, -6], [113, -2.6], [109.6, -2.4], [110, -6]], [[107.6, -3], [113, -2.8], [116, -1.6], [116.2, -0.2, 1], [107, -0.2, 1]]],
    zehen: [[114.6, -1.4, 120, -1, 0.8], [115, -1.1, 123, -0.7, 0.8], [115, -0.8, 126.4, -0.5, 0.8]], krallen: [[123, -0.7, 1, 0.3, 15, 0.4], [126.4, -0.5, 1, 0.3, 10, 0.4]] });
  /* Rumpf + Schwanz */
  const K = echsenKoerper(T, sp, { id: "e", basis: "#7a5f3c",
    zonen: [[-1.4, -0.42, "#6e5233"], [-0.42, 0.55, "#6aa83c", 1, 0.55, 1], [-0.42, 0.55, "#7f7450", 1, 0, 0.55], [0.55, 1.4, "#c6cf78", 1, 0.52, 1], [0.4, 1.4, "#a69a72", 1, 0, 0.53], [-1.4, -0.85, "#5a4228", 0.8, 0, 1]],
    muster: (Rr, tx) => {
      let s = "";
      const tH = tx(118);
      /* weißliche Rückenseitenlinie (unterbrochen) */
      s += linien(T, [Rr.zug(-0.48, tH, 0.97, 8)], "#efe9cf", 1.1, 0.35);
      /* Ocellen: dunkle Flecken mit weißem Kern – Rückenreihe und Flankenreihen */
      let dD = "", dW = "";
      const oc = (t, v, r, weiss = true) => {
        const [x, y] = Rr.P(t, v), P = [];
        for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + T.rnd() * 0.5, rr = r * (0.7 + T.rnd() * 0.55); P.push([x + Math.cos(a) * rr * 1.15, y + Math.sin(a) * rr * 0.8]); }
        dD += poly(P);
        if (weiss && T.rnd() < 0.85) { const l = r * (0.1 + T.rnd() * 0.3); dW += `M${R(x - l / 2)} ${R(y + (T.rnd() - 0.5) * r * 0.3)}h${R(l)}`; }
      };
      for (let t = tH + 0.01; t < 0.96; t += 0.026 + T.rnd() * 0.01) { oc(t, -0.72 + (T.rnd() - 0.5) * 0.1, 1.4 + T.rnd() * 0.6); oc(t + 0.013, -1.02, 1.1 + T.rnd() * 0.4, false); }
      for (let t = tH + 0.03; t < 0.94; t += 0.04 + T.rnd() * 0.012) { oc(t, -0.08 + (T.rnd() - 0.5) * 0.15, 1.1 + T.rnd() * 0.5); if (T.rnd() < 0.7) oc(t + 0.02, 0.3, 0.9 + T.rnd() * 0.4); }
      for (let t = 0.2; t < tH; t += 0.05) oc(t, -0.6, 1, false);
      s += `<path d="${dD}" fill="#24180a" opacity=".85"/><path d="${dW}" stroke="#f2eed8" stroke-width=".75" stroke-linecap="round" stroke-opacity=".9"/>`;
      /* Bauchpunkte */
      if (F) s += punkte(T, Rr.band(0.62, 1, tH, 0.97, 8), 18, 0.5, "#1a1a0a", 0.7);
      if (F) {
        /* Schuppen: Rücken fein gekielt (längs), Flanke körnig, Bauchschilde, Schwanzwirtel */
        s += form(T, poly(Rr.band(-1.2, -0.42, tH, 1, 8)), musterBeulen(T, "ed", 1.25, { flach: 0.5, grund: 0.2, hell: 0.26, dunkel: 0.36 }));
        s += form(T, poly(Rr.band(-0.42, 0.58, tH, 1, 8)), musterBeulen(T, "ef", 1.05, { flach: 0.8, grund: 0.16, hell: 0.26, dunkel: 0.32 }));
        const tsB = []; for (let t = tH; t < 0.98; t += 0.022) tsB.push(t);
        s += gitter(T, Rr, tsB, [0.58, 0.8, 1.02], { versatz: true, w: 0.18, opS: 0.4, opL: 0.3, hell: "#f6f4d8", lichtQuer: false, schritt: 20 });
        const tsS = []; { let t = 0.02; while (t < tH) { tsS.push(t); t += 0.011 + t * 0.012; } }
        s += gitter(T, Rr, tsS, [-1.02, -0.5, 0, 0.5, 1.02], { w: 0.22, opS: 0.5, opL: 0.3, licht: false, schritt: 30 });
        s += plattenG(T, Rr, tsS, [-1.02, -0.5, 0, 0.5], { sw: 0.2, fuge: 0.1, kiel: [0, 1, 2], kw: 0.22, opK: 0.35, opKL: 0.35, grad: (j, z) => z < 0.4 ? plattenGrad(T, "eg2", false, 1.1) : plattenGrad(T, "eg", false, 0.8) });
      }
      return s;
    } });
  h += K.svg;
  /* nahe Beine: Vorderbein grün (Männchen), Hinterbein bräunlich; fünf lange Zehen mit Krallen */
  const mE = F ? musterBeulen(T, "eb", 0.9, { grund: 0.12, hell: 0.2, dunkel: 0.28 }) : "";
  h += reptilBein(T, { n: "eh", ton: "nh", farben: ["#9a9262", "#7a7448", "#4a4628"], muster: mE, maske: [-17, -13],
    glieder: [[[116, -16], [124, -17.4], [132, -14.4], [135.4, -10.6], [134.6, -8.2], [131, -8.8], [125, -10.4], [118.4, -12]], [[131.6, -10.6], [135.6, -9.4], [133.4, -5], [131, -2.6], [127.8, -2.4], [128.6, -5.6]], [[126.6, -3.2], [131.8, -3], [136, -1.8], [136.4, -0.2, 1], [126, -0.2, 1], [125.6, -1.6]]],
    zehen: [[134, -1.6, 140, -1.2, 0.9], [134.6, -1.3, 143.4, -0.8, 0.9], [135, -1, 147, -0.6, 0.9], [135, -0.7, 150, -0.5, 0.9], [133, -0.6, 137.6, -0.5, 0.9]],
    krallen: [[140, -1.2, 1.2, 0.35, 15, 0.4], [143.4, -0.8, 1.2, 0.35, 12, 0.4], [147, -0.6, 1.3, 0.36, 10, 0.4], [150, -0.5, 1.3, 0.36, 8, 0.4]],
    falten: [[[131.4, -9.6], [133.2, -8.8], [135, -9.4]], [[128.6, -3.4], [130.4, -2.8], [132.2, -3.2]]] });
  h += reptilBein(T, { n: "ev", ton: "nv", farben: ["#8cc05a", "#6aa03e", "#3d6424"], muster: mE, maske: [-17, -13.6],
    glieder: [[[172, -15.6], [180, -16], [181, -12], [178.4, -9.6], [175, -8.4], [172.6, -10.4]], [[173.6, -10], [177.6, -9.8], [179.6, -5.6], [180.6, -2.6], [177.4, -2.2], [176.4, -5.4]], [[176.4, -3], [180.6, -3.2], [183, -1.8], [183.4, -0.2, 1], [175.8, -0.2, 1], [175.6, -1.6]]],
    zehen: [[181, -1.6, 185.6, -1, 0.85], [181.4, -1.3, 187.6, -0.75, 0.85], [181.6, -1, 188.6, -0.55, 0.85], [181.4, -0.7, 187.6, -0.5, 0.85], [180.6, -0.6, 184.4, -0.48, 0.85]],
    krallen: [[185.6, -1, 1, 0.32, 18, 0.4], [187.6, -0.75, 1.1, 0.32, 14, 0.4], [188.6, -0.55, 1.1, 0.32, 10, 0.4], [187.6, -0.5, 1, 0.3, 8, 0.4]],
    falten: [[[174.4, -9.4], [176.4, -8.6], [178.4, -9.2]], [[176.6, -3.2], [178.4, -2.6], [180.2, -3]]] });
  /* Kopf: kurz, hoch (Männchen), große Kopfschilde, Unteraugenschild, Ohrloch, Halsband */
  const kp = [[193, -24.4], [199, -26.8], [205, -27.4], [211, -26.4], [216, -24], [219.4, -21], [220.8, -18.4], [220.4, -16.6], [218.4, -15.4], [213, -14.2], [206, -13.2], [200, -12.8], [195.4, -13.6], [191.6, -16.6], [191.4, -21]];
  let ki = "";
  ki += `<g filter="${weich(T, "ek", 0.7)}">` + form(T, poly([[192, -20], [200, -21], [210, -20.4], [219, -18], [219, -15.6], [210, -14], [200, -13.6], [193, -15]]), "#6aa83c", ' opacity=".9"') +
    form(T, poly([[194, -24], [204, -27], [212, -26], [218, -22.6], [212, -23], [204, -24], [196, -22.6]]), "#fff", ' opacity=".18"') +
    form(T, poly([[194, -14], [206, -13.4], [216, -15], [210, -16.4], [200, -16.4]]), "#c9d27c", ' opacity=".7"') + "</g>";
  /* Kopfschilde: Fugen mit Lichtkante */
  const fu = [[[199, -26.6], [200.4, -24.4], [204.6, -24.2], [205.4, -27.2]], [[205.4, -27.2], [206.6, -24.6], [210.8, -24.4], [211.2, -26.4]], [[211.2, -26.4], [212.6, -24.2], [214.4, -22.2]],
    [[214.4, -22.2], [216.4, -21.6], [219.4, -21]], [[204.6, -24.2], [204.2, -21.6]], [[210.8, -24.4], [212.2, -21.6]], [[200, -15.6], [203, -16.2], [206.4, -16.6], [210, -16.8], [213.6, -16.8], [217, -16.6], [219.8, -16.6]], [[203, -16.2], [203.4, -14.4]], [[206.4, -16.6], [206.6, -14.4]], [[210, -16.8], [210.2, -14.8]], [[213.6, -16.8], [213.6, -15.2]], [[217, -16.6], [216.8, -15.6]],
    [[201, -23.4], [199.4, -20.6], [200.8, -17]], [[196, -22.6], [197.6, -20.6]]];
  ki += linien(T, fu, "#1a140a", 0.16, 0.4) + (F ? linien(T, fu.map((p) => p.map(([x, y]) => [x + 0.16, y + 0.18])), "#f4f0d2", 0.12, 0.32) : "");
  h += teil(T, kp, "#7a6038", { innen: ki, rand: "#14100a", randA: 0.3, rw: 0.22 });
  /* Ohrloch (Trommelfell), Halsband unter der Kehle, Maulspalte, Nasenloch */
  h += `<ellipse cx="196.4" cy="-18.4" rx="1.2" ry="1.7" fill="#6b5a36" stroke="#1e160a" stroke-width=".35" stroke-opacity=".7"/>` + fleck(T, "d", 196.8, -17.8, 0.9, 1.2, 0, 0.35) + fleck(T, "l", 196, -19.2, 0.6, 0.8, 0, 0.35);
  h += `<path d="M186.4 -10.8q1.1 1.1 2.2 0q1.1 1.1 2.2 0q1.1 1.1 2.2 0q1.1 1 2.2 0" fill="#b4c070" stroke="#14100a" stroke-width=".2" stroke-opacity=".35"/>`;
  h += linien(T, [[[220.4, -16.9], [215, -16.6], [209.6, -16.4], [204.6, -16.2], [202, -15.8]]], "#120c06", 0.28, 0.75);
  h += `<ellipse cx="217.6" cy="-21.4" rx=".6" ry=".5" fill="#120c06"/>`;
  /* Auge: rund, rotbraun-gold, Lider beschuppt, Glanz */
  h += reptilAuge(T, 208.4, -21.4, 1.2, { iris: "#b86a28", iris2: "#4a2208", pupille: "rund", offen: 0.8, netzFarbe: "#5a2c0c", haut: "#7a6038", lidRand: "#2a2414" });
  return fertig(0.1, h, [0, -27.6, 221, 0], [128, 180, 112, 190], [188, -30, 223, -10]);
}

/* =====================================================================
   LEGUAN (Grüner Leguan, Iguana iguana)
   RECHERCHE: 1,2–1,8 m (hier 1,5 m), davon ist der Schwanz ~2/3 (peitschenartig, mit 6–10 dunklen Ringen). Körper seitlich
   abgeflacht; vom Nacken bis zur Schwanzwurzel ein Kamm aus langen, kammartigen Hautstacheln (im Nacken bis ~3 cm),
   auf dem Schwanz kleiner werdend. Große hängende Kehlwamme (Männchen) mit einer Reihe kleiner Stacheln an der
   Vorderkante. Unter dem Trommelfell der große, runde, glänzende Subtympanalschild – das Kennzeichen des Grünen Leguans;
   seitlich am Hals verstreute große Höckerschuppen. Kopf kurz, Schnauze stumpf, große Kopfschilde; Auge mit runder
   Pupille, Iris goldorange, Lider. Haut mit sehr kleinen, dicht stehenden Schuppen. Farbe: grün bis graugrün, Bauch heller,
   dunkle Querbänder auf Schultern und Rumpf. Lange Zehen mit spitzen Krallen (Kletterer), Hinterfuß 4. Zehe sehr lang.
   Zeichenraum: 1 Einheit = 0,5 cm (300 Einheiten = 1,5 m).
   ===================================================================== */
function leguan(T) {
  const F = T.fein;
  let h = "";
  const sp = [[0, -2.4, 0.3, 0.3], [30, -3.2, 0.9, 0.9], [60, -4.4, 1.6, 1.6], [95, -6.2, 2.5, 2.4], [130, -8.4, 3.4, 3.3], [165, -10.6, 4.4, 4.2], [195, -12.8, 5.4, 5], [212, -14.2, 6.2, 5.6], [226, -16, 8, 7.4], [245, -17, 9.2, 8.6], [260, -17.6, 8.6, 8], [272, -19, 7.6, 7], [282, -20.6, 6.6, 6.2]];
  /* ferne Beine */
  const fernF = ["#5c7c3e", "#4a6631", "#2f4220"];
  h += reptilBein(T, { n: "lf1", ton: "lf", farben: fernF, ticks: false,
    glieder: [[[263, -14], [270, -14], [271, -8], [273, -3], [269.6, -2.4], [267.6, -7]], [[268.4, -3.2], [273.4, -3.2], [276, -1.6], [276.2, -0.2, 1], [268, -0.2, 1]]],
    zehen: [[274.4, -1.5, 280, -1, 0.9], [275, -1.2, 282.4, -0.7, 0.9], [275, -0.9, 281.6, -0.5, 0.9]], krallen: [[280, -1, 1.3, 0.35, 25, 0.5], [282.4, -0.7, 1.3, 0.35, 20, 0.5], [281.6, -0.5, 1.3, 0.35, 15, 0.5]] });
  h += reptilBein(T, { n: "lf2", ton: "lf", farben: fernF, ticks: false,
    glieder: [[[202, -12], [208, -11], [207, -6], [205.6, -2.8], [202, -2.4], [202.6, -6]], [[199.6, -3.2], [205.6, -3], [208.6, -1.6], [208.8, -0.2, 1], [199, -0.2, 1]]],
    zehen: [[207, -1.5, 213, -1, 0.9], [207.4, -1.2, 216.4, -0.7, 0.9], [207.4, -0.9, 220.6, -0.5, 0.9]], krallen: [[216.4, -0.7, 1.3, 0.35, 18, 0.5], [220.6, -0.5, 1.4, 0.35, 12, 0.5]] });
  /* Rückenkamm (hinter dem Körper ansetzend: Basis vom Rumpf verdeckt) */
  const kamm = (Rr, tx) => {
    let d = "", dL = "";
    const t0 = tx(130), t1 = tx(281);
    for (let t = t0; t < t1; t += 0.0062) {
      const u = (t - t0) / (t1 - t0), H = (1.2 + 5.4 * Math.pow(u, 2.2)) * (0.85 + 0.3 * T.rnd()) * (u > 0.93 ? 1 - (u - 0.93) * 6 : 1);
      const [x, y, nx, ny] = Rr.at(t), a = Rr.P(t, -0.94), b = Rr.P(t + 0.0055, -0.94);
      const sx = a[0] + nx * H - H * 0.32, sy = a[1] + ny * H;
      d += `M${R(a[0])} ${R(a[1])}Q${R((a[0] + sx) / 2 - 0.2)} ${R((a[1] + sy) / 2)} ${R(sx)} ${R(sy)}Q${R((b[0] + sx) / 2 + 0.3)} ${R((b[1] + sy) / 2)} ${R(b[0])} ${R(b[1])}Z`;
      if (F) dL += `M${R(a[0] + 0.15)} ${R(a[1] - 0.2)}L${R(sx + 0.05)} ${R(sy + 0.3)}`;
    }
    return `<path d="${d}" fill="${T.lg("lkamm", [[0, "#9ab86c"], [0.6, "#6e8e48"], [1, "#4a6a30"]])}" stroke="#1e2a12" stroke-width=".18" stroke-opacity=".55"/>` + (dL ? `<path d="${dL}" stroke="#e8f0c8" stroke-width=".18" stroke-opacity=".45"/>` : "");
  };
  const K0 = rohr(sp, 5);
  const tx0 = (x) => { let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (K0.P(m, 0)[0] < x) lo = m; else hi = m; } return (lo + hi) / 2; };
  h += kamm(K0, tx0);
  /* Rumpf + Schwanz: grün, Bauch heller, dunkle Schulterbänder, Schwanzringe, winzige Schuppen */
  const K = echsenKoerper(T, sp, { id: "l", basis: "#6f9a4a",
    zonen: [[-1.4, -0.4, "#557d38"], [0.5, 1.4, "#b2c68a"], [-1.4, 1.4, "#7f9060", 0.6, 0, 0.55]],
    muster: (Rr, tx) => {
      let s = "", d = "";
      /* Schwanzringe (schwarz), Schulter-/Rumpfbänder (dunkler grün) */
      for (const t of [0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56, 0.635]) { const w = 0.012 + t * 0.012; d += poly([Rr.P(t - w, -1.3), Rr.P(t + w, -1.3), Rr.P(t + w * 1.2, 1.3), Rr.P(t - w * 0.8, 1.3)]); }
      s += `<path d="${d}" fill="#1e2616" opacity=".62" filter="${weich(T, "lr", 0.6)}"/>`;
      let b = "";
      for (const x of [232, 246, 262]) { const t = tx(x); b += poly([Rr.P(t - 0.01, -1.2), Rr.P(t + 0.012, -1.2), Rr.P(t + 0.016, 0.4), Rr.P(t - 0.006, 0.4)]); }
      s += `<path d="${b}" fill="#2e4a1e" opacity=".35" filter="${weich(T, "lb", 1)}"/>`;
      if (F) {
        s += `<path d="${pfad(T, Rr.band(-1.1, 1.1, 0, 1, 16).concat())}" fill="${musterBeulen(T, "lg", 0.85, { flach: 0.75, grund: 0.14, hell: 0.22, dunkel: 0.28 })}"/>`;
        const tsB = []; for (let t = tx(212); t < 0.99; t += 0.009) tsB.push(t);
        s += gitter(T, Rr, tsB, [0.62, 0.82, 1.02], { versatz: true, w: 0.14, opS: 0.3, opL: 0.25, hell: "#f0f6d8", lichtQuer: false, schritt: 30 });
        const tsS = []; for (let t = 0.03; t < tx(212); t += 0.0085) tsS.push(t);
        s += gitter(T, Rr, tsS, [-1.02, 1.02], { w: 0.14, opS: 0.3, licht: false, schritt: 40 });
      }
      return s;
    } });
  h += K.svg;
  /* Hals: verstreute große Höckerschuppen */
  if (F) h += beulen(T, [[270, -24], [282, -26], [284, -16], [272, -12]], 2.4, { flach: 0.9, dichte: 0.55, grads: [beulenGrad(T, "lh", 0.35, 0.35)] });
  /* nahe Beine */
  const mL = F ? musterBeulen(T, "lb", 0.8, { grund: 0.12, hell: 0.2, dunkel: 0.26 }) : "";
  const nahF = ["#8fb664", "#6e9448", "#3e5a26"];
  h += reptilBein(T, { n: "lh", ton: "lh", farben: nahF, muster: mL, maske: [-20, -14.6],
    glieder: [[[208, -19], [218, -20.6], [227, -16.8], [229.6, -11.6], [228.4, -8.8], [224, -9.6], [216, -12], [209, -14]], [[224.6, -11.6], [229.8, -10.4], [227.6, -5.4], [225, -2.8], [221, -2.6], [222, -6.4]], [[219.6, -3.4], [225.4, -3.2], [229.6, -1.8], [230, -0.2, 1], [219, -0.2, 1], [218.6, -1.8]]],
    zehen: [[227.6, -1.8, 234, -1.3, 1.05], [228.4, -1.5, 238, -1, 1.05], [229, -1.2, 242, -0.7, 1.05], [229, -0.9, 247.6, -0.55, 1.05], [227, -0.7, 232, -0.55, 1.05]],
    krallen: [[234, -1.3, 1.5, 0.42, 20, 0.5], [238, -1, 1.5, 0.42, 16, 0.5], [242, -0.7, 1.6, 0.42, 12, 0.5], [247.6, -0.55, 1.6, 0.42, 10, 0.5]],
    falten: [[[224.6, -10.6], [226.8, -9.8], [229, -10.4]], [[221.6, -3.6], [223.6, -3], [225.6, -3.4]]] });
  h += reptilBein(T, { n: "lv", ton: "lv", farben: nahF, muster: mL, maske: [-20, -15],
    glieder: [[[258, -19], [267, -19.6], [268.6, -14], [266, -10.4], [262, -9.2], [259.6, -12]], [[260.4, -11], [265, -11], [266.6, -6], [268, -3], [264.4, -2.4], [263, -6]], [[263.4, -3.2], [268.2, -3.4], [271, -1.8], [271.4, -0.2, 1], [262.8, -0.2, 1], [262.6, -1.8]]],
    zehen: [[269, -1.8, 274.4, -1.2, 0.95], [269.6, -1.5, 277.2, -0.9, 0.95], [269.8, -1.2, 278.6, -0.6, 0.95], [269.6, -0.9, 277.4, -0.5, 0.95], [268.6, -0.7, 273, -0.5, 0.95]],
    krallen: [[274.4, -1.2, 1.4, 0.4, 25, 0.5], [277.2, -0.9, 1.5, 0.4, 20, 0.5], [278.6, -0.6, 1.5, 0.4, 15, 0.5], [277.4, -0.5, 1.4, 0.38, 10, 0.5]],
    falten: [[[261.4, -10.2], [263.4, -9.4], [265.4, -10]], [[264, -3.4], [266, -2.8], [268, -3.2]]] });
  /* Kehlwamme mit Stachelreihe an der Vorderkante */
  const wamme = [[272, -13], [278, -11.4], [284, -9.6], [289, -9.2], [292.6, -11], [294, -14.6], [288, -15.8], [280, -15.6]];
  let wi = fleck(T, "d", 283, -10.4, 9, 2.2, 0, 0.4) + fleck(T, "l", 288, -13.4, 4, 1.4, 0, 0.4);
  if (F) wi += `<rect x="270" y="-17" width="26" height="9" fill="${musterBeulen(T, "lw", 0.7, { grund: 0.1, hell: 0.2, dunkel: 0.24 })}"/>`;
  h += teil(T, wamme, "#94b070", { innen: wi, rand: "#1e2a12", randA: 0.3, rw: 0.22 });
  let st = "";
  for (let i = 0; i < 8; i++) { const u = i / 7, x = 293.6 - u * 9, y = -13.4 + Math.sin(u * Math.PI) * 3.6 + u * 1.2; st += `M${R(x - 0.3)} ${R(y)}l${R(0.6)} ${R(0.6)}l${R(-0.05)} ${R(-0.8)}Z`; }
  h += `<path d="${st}" fill="#c8d8a4" stroke="#1e2a12" stroke-width=".12" stroke-opacity=".5"/>`;
  /* Kopf: kurz, stumpfe Schnauze, große Kopfschilde */
  const kp = [[278.4, -24.6], [284, -27.6], [290, -28], [295, -26.6], [298.6, -24], [300.4, -21.4], [300.2, -19.2], [298.4, -17.8], [294, -17], [289, -16.4], [285, -15], [280.6, -15.6], [278, -19.6]];
  let ki = `<g filter="${weich(T, "lk", 0.6)}">` + form(T, poly([[280, -24.6], [286, -27.4], [294, -26.8], [299, -22.6], [292, -23.6], [284, -23.8]]), "#fff", ' opacity=".2"') + form(T, poly([[280, -16], [290, -16.6], [298, -18], [294, -19.6], [286, -19.4]]), "#000", ' opacity=".22"') + "</g>";
  const fu = [[[284.6, -27.4], [285.6, -25], [289.6, -24.8], [290.6, -27.8]], [[290.6, -27.8], [292.2, -25.2], [295.6, -24.6], [296, -26]], [[295.6, -24.6], [297.4, -22.4], [300, -21.6]], [[285.6, -25], [285.2, -22.6]],
    [[288, -19.6], [291, -19.4], [294, -19.4], [297, -19.6], [299.8, -19.6]], [[291, -19.4], [291, -17.4]], [[294, -19.4], [294, -17.4]], [[297, -19.6], [297.2, -18]]];
  ki += linien(T, fu, "#1e2a12", 0.16, 0.42) + (F ? linien(T, fu.map((p) => p.map(([x, y]) => [x + 0.16, y + 0.18])), "#eef6d8", 0.12, 0.32) : "");
  h += teil(T, kp, "#7ca656", { innen: ki, rand: "#1e2a12", randA: 0.3, rw: 0.22 });
  /* Trommelfell und Subtympanalschild (groß, rund, glänzend) */
  h += `<ellipse cx="283" cy="-21.8" rx="1.6" ry="2.2" fill="#7a8a5a" stroke="#1e2a12" stroke-width=".3" stroke-opacity=".6"/>`;
  h += `<ellipse cx="284.8" cy="-17.4" rx="2.2" ry="2.1" fill="${T.rg("subt", [[0, "#d6e2bc"], [0.6, "#aabf86"], [1, "#82985e"]], 0.4, 0.36, 0.72)}" stroke="#1e2a12" stroke-width=".22" stroke-opacity=".45"/>` + `<ellipse cx="284.1" cy="-18.3" rx=".8" ry=".4" fill="#fff" opacity=".35"/>`;
  h += linien(T, [[[300, -19.6], [296, -19.2], [291, -19], [287, -18.8], [285.6, -19.6]]], "#121a0a", 0.26, 0.75);
  h += `<ellipse cx="298.2" cy="-23.4" rx=".75" ry=".6" fill="#121a0a"/>`;
  h += reptilAuge(T, 291.4, -23.2, 1.05, { iris: "#d88a2c", iris2: "#6a3810", pupille: "rund", offen: 0.78, netzFarbe: "#7a3c10", haut: "#7ca656", lidRand: "#2a3018" });
  return fertig(0.5, h, [0, -34, 301, 0], [225, 270, 205, 275], [276, -30, 302, -8]);
}

/* =====================================================================
   KOMODOWARAN (Varanus komodoensis)
   RECHERCHE: größte Echse; Männchen ~2,6 m, 80–90 kg (hier 2,6 m). Massiger, tief gebauter Rumpf, langer kräftiger Hals,
   Schwanz ~ halbe Länge, seitlich abgeflacht, Spitze schleift. Kopf lang, flach, Schnauze gerundet; Nasenlöcher weit
   vorn; lange Maulspalte, die Zähne (gezähnt, haiartig) sind von dicken Lippen/Zahnfleisch fast verdeckt. Lange, tief
   gespaltene GELBE Zunge. Auge klein mit runder Pupille, dunkle Iris, kräftiger Brauenwulst; Ohröffnung hinter dem
   Mundwinkel. Haut aus kleinen, nicht überlappenden Perlschuppen mit Knochenplättchen (Kettenhemd), am Hals lose Falten
   und Kehlfalte. Erwachsene einheitlich grau- bis lehmbraun, Kopf und Schwanz dunkler graubraun. Beine kräftig, breite
   Füße mit langen, gebogenen, dunklen Krallen. Gang: halb aufgerichtet, Bauch frei.
   Zeichenraum: 1 Einheit = 1 cm.
   ===================================================================== */
function komodowaran(T) {
  const F = T.fein;
  let h = "";
  const sp = [[0, -0.8, 0.4, 0.4], [20, -1.6, 1.4, 1.4], [40, -3, 2.8, 2.8], [62, -6, 4.6, 4.6], [85, -11.4, 6.4, 6.4], [105, -18, 8.2, 8], [122, -24.2, 10.4, 9.6], [140, -28.6, 13.4, 12], [162, -30.8, 15.6, 13.8], [182, -31.6, 15, 13], [198, -33, 12, 10.6], [212, -35, 9, 9], [224, -35.4, 7.2, 8]];
  const fernF = ["#5c574a", "#4a463b", "#302d26"];
  h += reptilBein(T, { n: "kf1", ton: "kf", farben: fernF, ticks: false,
    glieder: [[[190, -22], [199, -22], [200, -12], [202, -4], [197, -3], [194.6, -12]], [[195.4, -4.4], [202.4, -4.4], [206.4, -2.2], [206.8, -0.2, 1], [194.8, -0.2, 1], [194.4, -2.2]]],
    zehen: [[203.6, -2.2, 208.4, -1.6, 1.6], [204.4, -1.8, 210.6, -1.2, 1.6], [204.4, -1.3, 210, -0.8, 1.6]], krallen: [[208.4, -1.6, 2.6, 0.8, 35, 0.6], [210.6, -1.2, 2.8, 0.85, 30, 0.6], [210, -0.8, 2.8, 0.85, 25, 0.6]], krallenFarbe: "#1e1a14" });
  h += reptilBein(T, { n: "kf2", ton: "kf", farben: fernF, ticks: false,
    glieder: [[[112, -22], [123, -21], [121, -12], [119, -4], [113.6, -3.2], [114, -12]], [[110.4, -4.6], [119.4, -4.4], [124, -2.2], [124.4, -0.2, 1], [110, -0.2, 1], [109.6, -2.2]]],
    zehen: [[121, -2.2, 127, -1.6, 1.7], [121.6, -1.8, 129.4, -1.2, 1.7], [121.6, -1.3, 128.6, -0.8, 1.7]], krallen: [[127, -1.6, 2.8, 0.85, 30, 0.6], [129.4, -1.2, 3, 0.9, 25, 0.6], [128.6, -0.8, 3, 0.9, 20, 0.6]], krallenFarbe: "#1e1a14" });
  const K = echsenKoerper(T, sp, { id: "k", basis: "#77705e", schatten: 0.36,
    zonen: [[-1.4, -0.5, "#625c4c"], [0.45, 1.4, "#9c947a"], [-1.4, 1.4, "#5c5648", 0.7, 0, 0.3]],
    muster: (Rr, tx) => {
      let s = "";
      /* unregelmäßige hellere/dunklere Flecken (Erwachsene fast einfarbig) */
      let d = "", l = "";
      for (let i = 0; i < 26; i++) { const t = 0.08 + T.rnd() * 0.88, v = -1 + T.rnd() * 1.5, [x, y] = Rr.P(t, v), r = 2 + T.rnd() * 3; (i % 2 ? d : l) !== null; if (i % 2) d += `M${R(x - r)} ${R(y)}a${R(r)} ${R(r * 0.6)} 0 1 0 ${R(2 * r)} 0a${R(r)} ${R(r * 0.6)} 0 1 0 ${R(-2 * r)} 0`; else l += `M${R(x - r)} ${R(y)}a${R(r)} ${R(r * 0.6)} 0 1 0 ${R(2 * r)} 0a${R(r)} ${R(r * 0.6)} 0 1 0 ${R(-2 * r)} 0`; }
      s += `<g filter="${weich(T, "kmf", 1.2)}"><path d="${d}" fill="#2e2a22" opacity=".25"/><path d="${l}" fill="#c8bfa0" opacity=".14"/></g>`;
      if (F) {
        /* Perlschuppen (nicht überlappend), am Rücken etwas größer */
        s += `<path d="${pfad(T, Rr.band(-1.1, -0.3, 0, 1, 16))}" fill="${musterBeulen(T, "kr", 1.05, { flach: 0.85, grund: 0.2, hell: 0.26, dunkel: 0.34 })}"/>`;
        s += `<path d="${pfad(T, Rr.band(-0.3, 1.1, 0, 1, 16))}" fill="${musterBeulen(T, "ks", 0.85, { flach: 0.85, grund: 0.18, hell: 0.22, dunkel: 0.3 })}"/>`;
        /* Halsfalten und Achselfalten */
        const fa = [];
        for (const [x, v0, v1, k] of [[199, -0.2, 0.75, 0.006], [204.6, -0.5, 0.55, -0.004], [209.6, 0.05, 0.85, 0.005], [214.4, -0.35, 0.4, -0.003], [218.4, 0.2, 0.9, 0.004]]) { const t = tx(x); fa.push([Rr.P(t, v0), Rr.P(t + k, (v0 + v1) / 2), Rr.P(t - k * 0.5, v1)]); }
        fa.push([Rr.P(tx(197), 0.62), Rr.P(tx(206), 0.74), Rr.P(tx(216), 0.7)]);
        s += linien(T, fa, "#1a1712", 0.6, 0.3) + linien(T, fa.map((p) => p.map(([x, y]) => [x - 0.35, y - 0.4])), "#d8d0b4", 0.4, 0.2);
      }
      return s;
    } });
  h += K.svg;
  const mK = F ? musterBeulen(T, "kb", 0.85, { grund: 0.16, hell: 0.22, dunkel: 0.3 }) : "";
  const nahF = ["#948b74", "#757060", "#46423a"];
  h += reptilBein(T, { n: "kh", ton: "kh", farben: nahF, muster: mK, maske: [-30, -22],
    glieder: [[[118, -30], [132, -32], [143, -26], [147, -18], [145.6, -14], [140, -14.6], [130, -18.6], [120, -22]], [[139, -18], [147.4, -16.4], [145, -9], [141.4, -4.4], [135.6, -4], [136.4, -10]], [[133, -5], [142, -4.8], [147.4, -2.6], [148, -0.2, 1], [132.4, -0.2, 1], [131.8, -2.4]]],
    zehen: [[144.4, -2.6, 151, -2, 1.9], [145.4, -2.1, 154, -1.4, 1.9], [145.8, -1.6, 155.6, -1, 1.9], [145.4, -1.1, 154, -0.95, 1.9], [143.6, -1, 148.6, -0.95, 1.9]],
    krallen: [[151, -2, 3, 0.95, 35, 0.6], [154, -1.4, 3.2, 1, 30, 0.6], [155.6, -1, 3.2, 1, 25, 0.6], [154, -0.95, 3, 0.95, 20, 0.6]], krallenFarbe: "#1e1a14",
    falten: [[[139.6, -16.4], [143, -15.2], [146.6, -16]], [[136.4, -5.2], [139.4, -4.4], [142.6, -5]], [[121, -21.6], [130, -18.2], [140, -15]]] });
  h += reptilBein(T, { n: "kv", ton: "kv", farben: nahF, muster: mK, maske: [-31, -24],
    glieder: [[[178, -31], [192, -31.6], [193.4, -23], [188.6, -16.6], [183, -14.4], [178.4, -19]], [[179.6, -18], [187, -18.6], [190.6, -10], [193, -4.6], [187.6, -3.6], [185, -9]], [[185.6, -5], [193, -5.2], [197.4, -2.6], [198, -0.2, 1], [185, -0.2, 1], [184.6, -2.4]]],
    zehen: [[194.4, -2.6, 199.6, -2, 1.8], [195.4, -2.2, 202, -1.4, 1.8], [195.8, -1.7, 203, -1, 1.8], [195.4, -1.2, 201.6, -0.95, 1.8], [194, -1, 198.4, -0.95, 1.8]],
    krallen: [[199.6, -2, 2.8, 0.9, 38, 0.6], [202, -1.4, 3, 0.95, 32, 0.6], [203, -1, 3, 0.95, 26, 0.6], [201.6, -0.95, 2.8, 0.9, 20, 0.6]], krallenFarbe: "#1e1a14",
    falten: [[[181, -17], [184.4, -15.8], [188, -16.6]], [[186.4, -5.4], [189.4, -4.6], [192.6, -5.2]], [[178, -26], [181.6, -21], [184, -17.6]]] });
  /* Kopf: lang und flach, gerundete Schnauze, Nasenloch vorn, dicke Lippen über den Zähnen */
  const kp = [[219, -40.6], [226, -43.4], [234, -44], [242, -42.6], [249, -40.4], [254, -37.8], [256.4, -35.2], [256.4, -33], [254.4, -31.4], [248, -30.2], [240, -29.4], [232, -28.8], [225, -28.2], [219.4, -29.6], [216.6, -34.4]];
  let ki = `<g filter="${weich(T, "kk", 0.9)}">` + form(T, poly([[220, -40], [230, -43.4], [242, -42.4], [254, -37.4], [244, -38.4], [232, -39.4], [222, -37.4]]), "#e8e0c4", ' opacity=".2"') +
    form(T, poly([[219, -30], [232, -29.2], [246, -30.2], [255, -32], [246, -33.2], [232, -32.8], [220, -32.4]]), "#000", ' opacity=".28"') + form(T, poly([[236, -38.6], [242, -39.8], [246, -38], [240, -36.6]]), "#000", ' opacity=".18"') + "</g>";
  if (F) ki += `<path d="${pfad(T, kp)}" fill="${musterBeulen(T, "kk", 0.75, { grund: 0.14, hell: 0.2, dunkel: 0.26 })}"/>`;
  /* Kehlfalte, Lippenschuppenreihe */
  ki += linien(T, [[[219, -31.4], [224, -30.4], [229, -30.2]], [[217.6, -36], [220.4, -33.6], [224.4, -32.4]]], "#1a1712", 0.4, 0.35);
  ki += reihe(T, [[226, -31.6], [236, -32], [246, -32.6], [254.6, -33.6]], 22, -1.6, "#1a1712", 0.16, 0.38, 0);
  const mid = T.id("kmm");
  T.def(`<linearGradient id="${mid}g" gradientUnits="userSpaceOnUse" x1="215" y1="0" x2="223" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${mid}" maskUnits="userSpaceOnUse" x="210" y="-50" width="50" height="25"><rect x="210" y="-50" width="50" height="25" fill="url(#${mid}g)"/></mask>`);
  h += `<g mask="url(#${mid})">` + teil(T, kp, "#696253", { innen: ki, rand: "#14120e", randA: 0.3, rw: 0.3 }) + "</g>";
  /* Maulspalte lang, Lippe mit hellerem Saum; Zahnspitzen kaum sichtbar */
  h += linien(T, [[[256, -33.4], [250, -33], [242, -32.6], [234, -32.2], [227, -31.8], [222.4, -31]]], "#100d0a", 0.4, 0.8) + linien(T, [[[255, -32.6], [247, -32.2], [238, -31.6], [229, -31.2]]], "#c4b898", 0.3, 0.35);
  if (F) h += zaehne(T, [[250, -32.9, 0.6, 0.45, -0.1], [245, -32.7, 0.6, 0.45, -0.1], [240, -32.5, 0.55, 0.42, -0.1]], 1, { n: "k", spitze: "#efe6d0", mitte: "#ddd2b6", basis: "#b8a888", rw: 0.06 });
  /* Ohröffnung, Nasenloch, Brauenwulst, Auge */
  h += `<ellipse cx="220.6" cy="-36.4" rx="1.3" ry="1.8" fill="#2a2620" opacity=".8"/>`;
  h += `<ellipse cx="252.2" cy="-38.6" rx=".9" ry=".6" fill="#100d0a"/>`;
  h += fleck(T, "l", 238.6, -41.6, 3.6, 1, -6, 0.45) + fleck(T, "d", 238.6, -39.2, 3, 1.4, 0, 0.45);
  h += reptilAuge(T, 238.8, -38.8, 1.25, { iris: "#7a5426", iris2: "#2a1a0a", pupille: "rund", offen: 0.72, netzFarbe: "#3a240e", haut: "#696253", lidRand: "#24201a" });
  /* gelbe, tief gespaltene Zunge */
  h += `<path d="M256 -33.2C259.6 -33.4 262.6 -32.6 265.4 -32.2M265.4 -32.2Q267.8 -33.4 270.2 -34.8M265.4 -32.2Q268 -31.4 270.6 -30.8" fill="none" stroke="#c89a22" stroke-width=".8" stroke-linecap="round"/><path d="M256 -33.2C259.6 -33.4 262.6 -32.6 265.4 -32.2M265.4 -32.2Q267.8 -33.4 270.2 -34.8M265.4 -32.2Q268 -31.4 270.6 -30.8" fill="none" stroke="#f0c840" stroke-width=".5" stroke-linecap="round"/>` +
    `<path d="M256.6 -33.5C259.6 -33.6 262.4 -32.9 265 -32.5" fill="none" stroke="#fff4c0" stroke-width=".25" stroke-opacity=".6"/>`;
  return fertig(1, h, [0, -48.4, 271, 0], [130, 190, 115, 200], [214, -47, 272, -26]);
}

/* =====================================================================
   CHAMÄLEON (Pantherchamäleon, Furcifer pardalis), Männchen
   RECHERCHE: Madagaskar; Männchen 40–50 cm (hier 42 cm mit eingerolltem Greifschwanz), Körper seitlich stark
   abgeflacht, Rücken gewölbt mit gezähntem Rückenkamm, Kehl-/Bauchkamm aus weißen Schuppen. Kopf mit niedrigem Helm
   (Casque) und nach vorn vorstehendem Schnauzenkamm über den Nasenlöchern; Maulspalte nach unten gezogen. Augen:
   kegelförmige, fast ganz geschlossene „Turmaugen“ aus feinkörniger Haut, nur ein kleines Loch für die Pupille,
   unabhängig beweglich. Füße zangenförmig (zygodactyl): vorne 2 Finger innen / 3 außen, hinten 3 innen / 2 außen,
   zu zwei Bündeln verwachsen, kleine Krallen. Greifschwanz eingerollt. Haut körnig mit verstreuten größeren Tuberkeln.
   Färbung Männchen (z. B. Ambilobe): türkis- bis smaragdgrün mit roten/orangen Querbändern, weißer Seitenstreif vom
   Maul bis zur Körpermitte, Lippen hell, Kopf mit roten Linien. Sitzt auf einem Ast.
   Zeichenraum: 1 Einheit = 0,15 cm.
   ===================================================================== */
function chamaeleon(T) {
  const F = T.fein;
  let h = "";
  /* Ast mit Rinde (liegt unten im Bild) */
  const ast = [[48, -13.6], [90, -14.6], [140, -14], [190, -13.2], [234, -12.6], [236, -6], [234, 0.2, 1], [190, -0.4], [140, -0.6], [90, -0.2], [48, 0.2, 1], [46.4, -6.6]];
  let ai = `<path d="M40 -14L240 -14L240 0L40 0Z" fill="${T.lg("astl", [[0, "#fff", 0.16], [0.4, "#fff", 0], [1, "#000", 0.4]])}"/>`;
  if (F) { let d = ""; for (let i = 0; i < 26; i++) { const x = 50 + T.rnd() * 182, y = -12 + T.rnd() * 10, l = 6 + T.rnd() * 14; d += `M${R(x)} ${R(y)}q${R(l / 2)} ${R((T.rnd() - 0.5) * 1.6)} ${R(l)} ${R((T.rnd() - 0.5) * 1.2)}`; } ai += `<path d="${d}" fill="none" stroke="#2a1c10" stroke-width=".7" stroke-opacity=".45" stroke-linecap="round"/>`; }
  h += teil(T, ast, "#8a6a48", { innen: ai, rand: "#1e140a", randA: 0.35, rw: 0.4 });
  h += `<ellipse cx="234.6" cy="-6.2" rx="2.2" ry="6.4" fill="#c8a678" stroke="#5a4028" stroke-width=".5"/><ellipse cx="234.6" cy="-6.2" rx="1" ry="3.4" fill="none" stroke="#7a5a38" stroke-width=".4"/>`;
  /* Greifschwanz: vom Rumpf nach hinten, nach unten eingerollt (Spirale) */
  const sw = [[66, -40, 9, 8], [48, -36, 7, 6.4], [34, -30, 5.4, 5], [24, -22, 4.2, 4], [20, -13, 3.4, 3.4], [23, -6.6, 2.8, 2.8], [30, -4.6, 2.4, 2.4], [35, -8, 2, 2], [33, -12.4, 1.6, 1.6], [28.4, -12.4, 1.2, 1.2], [27.6, -9.6, 0.8, 0.8]];
  const Rs = rohr(sw, 6);
  let si = `<g filter="${weich(T, "cs", 0.9)}">` + form(T, poly(Rs.band(-1.2, -0.5, 0, 1, 10)), "#fff", ' opacity=".2"') + form(T, poly(Rs.band(0.3, 0.9, 0, 1, 10)), "#000", ' opacity=".3"') + "</g>";
  for (const t of [0.12, 0.26, 0.4, 0.56, 0.72]) si += form(T, poly([Rs.P(t - 0.025, -1.2), Rs.P(t + 0.025, -1.2), Rs.P(t + 0.03, 1.2), Rs.P(t - 0.03, 1.2)]), "#c85a2e", ' opacity=".55"');
  if (F) si += `<path d="${pfad(T, Rs.zug(-1.1, 0, 1, 12).concat(Rs.zug(1.1, 0, 1, 12).reverse()))}" fill="${musterBeulen(T, "cg", 0.9, { grund: 0.12, hell: 0.22, dunkel: 0.28 })}"/>`;
  h += teil(T, Rs.zug(-1, 0, 1, 16).concat(Rs.zug(1, 0, 1, 16).reverse()), "#3a9a7a", { innen: si, rand: "#10241c", randA: 0.3, rw: 0.35 });
  /* ferne Beine (Zangenfüße hinter dem Ast) */
  const fernF = ["#3a8068", "#2c6652", "#1a4234"];
  h += reptilBein(T, { n: "cf1", ton: "cf", farben: fernF, ticks: false, glieder: [[[150, -40], [156, -38], [160, -26], [162, -17], [158, -16], [154, -26]]] });
  h += reptilBein(T, { n: "cf2", ton: "cf", farben: fernF, ticks: false, glieder: [[[62, -36], [70, -34], [68, -24], [66, -17], [61.4, -16.4], [62.4, -25]]] });
  const zg = T.lg("czf2", [[0, fernF[0]], [1, fernF[2]]]);
  h += `<path d="M158 -17.4Q164 -18.6 166 -14.4Q164.6 -13 162.4 -14Q161 -15.6 158.6 -15Z M63 -17.4Q57 -18.4 55.6 -14.2Q57 -13 59 -14Q60.4 -15.6 62.6 -15.2Z" fill="${zg}" stroke="#10241c" stroke-width=".3" stroke-opacity=".45"/>`;
  /* Rumpf: seitlich flach, Rücken gewölbt; Querbänder, weißer Seitenstreif, Körnerschuppen, Tuberkel, Rückenkamm */
  const rp = [[60, -34], [66, -44], [78, -56], [94, -66], [110, -70], [126, -68], [140, -63], [152, -58], [160, -54], [160, -42], [154, -36], [144, -32], [128, -30], [110, -29], [90, -29.6], [72, -31]];
  let ri = "";
  ri += `<g filter="${weich(T, "cz", 2)}">` + form(T, poly([[56, -46], [100, -74], [150, -64], [164, -54], [120, -52], [80, -44]]), "#2a8a6a", ' opacity=".7"') + form(T, poly([[60, -32], [100, -28], [150, -32], [160, -38], [120, -36], [80, -35]]), "#a8d8b0", ' opacity=".45"') + "</g>";
  /* rote Querbänder (folgen der Körperwölbung) */
  let qb = "";
  for (const [x0, w] of [[74, 7], [92, 8], [111, 8.6], [130, 8], [147, 6.6]]) qb += pfad(T, [[x0 - w * 0.4, -72], [x0 + w * 0.6, -72], [x0 + w * 0.7, -50], [x0 + w * 0.4, -28], [x0 - w * 0.6, -28], [x0 - w * 0.5, -50]]);
  ri += `<path d="${qb}" fill="#d0562c" opacity=".78" filter="${weich(T, "cq", 1.2)}"/>`;
  /* weißer Seitenstreif */
  ri += `<path d="M84 -38Q112 -42.4 140 -41Q152 -40.6 162 -42L162 -38.4Q150 -36.6 138 -37Q112 -38 86 -35Z" fill="#eef4e6" opacity=".85" filter="${weich(T, "cw", 0.6)}"/>`;
  if (F) {
    ri += `<rect x="56" y="-72" width="108" height="46" fill="${musterBeulen(T, "cr", 1.1, { grund: 0.14, hell: 0.24, dunkel: 0.3 })}"/>`;
    ri += beulen(T, [[70, -50], [100, -66], [140, -60], [150, -46], [110, -44], [80, -40]], 6, { flach: 0.9, dichte: 0.6, grads: [beulenGrad(T, "ct", 0.45, 0.4)], groesse: () => 0.5 });
  }
  ri += `<g filter="${weich(T, "cl", 2.2)}">` + form(T, poly([[64, -44], [96, -66], [126, -67], [104, -58], [76, -46]]), "#fff", ' opacity=".22"') + form(T, poly([[60, -33], [110, -30], [156, -36], [140, -40], [100, -38]]), "#000", ' opacity=".3"') + "</g>";
  h += teil(T, rp, "#3aa080", { innen: ri, rand: "#10241c", randA: 0.32, rw: 0.4 });
  /* Rückenkamm (kleine Zacken) und Bauchkamm (weiß) */
  let rk = "";
  const rl = polyl([[64, -42.6], [78, -55], [94, -65], [110, -69], [126, -67.2], [140, -62.4], [152, -57.4]]);
  for (let i = 0; i < 24; i++) { const [x, y, nx, ny] = rl.at(i / 24), H = 0.8 + 1 * Math.sin(Math.PI * i / 24); rk += `M${R(x - 1.3)} ${R(y + 0.5)}Q${R(x + nx * H * 0.6 - 0.8)} ${R(y + ny * H * 0.8)} ${R(x + nx * H - 0.3)} ${R(y + ny * H)}L${R(x + 1.3)} ${R(y + 0.5)}Z`; }
  h += `<path d="${rk}" fill="#2e8c6c" stroke="#10241c" stroke-width=".3" stroke-opacity=".5"/>`;
  let bk = "";
  for (let x = 150; x < 180; x += 2.2) { const y = x < 160 ? -33.6 - (x - 150) * 0.1 : x < 172 ? -34.6 - (x - 160) * 0.5 : -40.6 - (x - 172) * 0.2; bk += `M${R(x - 0.7)} ${R(y - 1)}l.7 1.7l.7 -1.7Z`; }
  const kehlKamm = `<path d="${bk}" fill="#f0f2e6" stroke="#10241c" stroke-width=".2" stroke-opacity=".35"/>`;
  /* nahe Beine: dünn, kantig, Ellbogen/Knie spitz, Zangenfuß um den Ast */
  const nahF = ["#62c09a", "#3aa080", "#1e6a52"];
  const mC = F ? musterBeulen(T, "cb", 0.8, { grund: 0.12, hell: 0.22, dunkel: 0.28 }) : "";
  h += reptilBein(T, { n: "ch", ton: "ch", farben: nahF, muster: mC, maske: [-44, -36],
    glieder: [[[72, -46], [86, -44], [96, -32], [96.6, -27], [92, -26], [80, -34]], [[90, -28.4], [97, -28.4], [94, -20], [90.6, -15], [86, -15.6], [88.4, -21]]],
    falten: [[[90.6, -27.6], [93.4, -26.4], [96.4, -27.4]]] });
  h += reptilBein(T, { n: "cv", ton: "cv", farben: nahF, muster: mC, maske: [-42, -35],
    glieder: [[[136, -44], [148, -43], [146, -34], [140, -27], [135.4, -26.6], [136.4, -34]], [[135.4, -28.4], [141.4, -28.6], [145, -20], [146.6, -15.4], [142, -15], [140, -21]]],
    falten: [[[136.2, -27.6], [138.6, -26.2], [141, -27]]] });
  /* Zangenfüße: vorderes Bündel über den Ast nach vorn, hinteres nach hinten; kleine Krallen */
  const zange = (x, y, vorn, hinten) => {
    const g = T.lg("cz" + "f", [[0, nahF[0]], [1, nahF[2]]]);
    return `<path d="M${x - 2} ${y}Q${x + vorn * 0.5} ${y - 2.4} ${x + vorn} ${y + 4}Q${x + vorn - 0.6} ${y + 6.4} ${x + vorn - 2.6} ${y + 5.2}Q${x + vorn * 0.4} ${y + 1.4} ${x + 1} ${y + 2.6}Z" fill="${g}" stroke="#10241c" stroke-width=".3" stroke-opacity=".5"/>` +
      `<path d="M${x + 1} ${y}Q${x - hinten * 0.5} ${y - 2} ${x - hinten} ${y + 3.6}Q${x - hinten + 0.6} ${y + 6} ${x - hinten + 2.4} ${y + 5}Q${x - hinten * 0.4} ${y + 1.6} ${x - 1.6} ${y + 2.6}Z" fill="${g}" stroke="#10241c" stroke-width=".3" stroke-opacity=".5"/>` +
      krallen(T, [[x + vorn - 0.4, y + 4.8, 1.2, 0.5, 120, 0.4], [x - hinten + 0.4, y + 4.6, 1.2, 0.5, 60, -0.4]], "#2a2418");
  };
  h += zange(88.4, -16.4, 9, 7) + zange(144, -16.2, 8, 7.4);
  h += kehlKamm;
  /* Kopf: niedriger Helm, Schnauzenkamm, nach unten gezogene Maulspalte, Turmauge */
  const kp = [[150, -58], [156, -66], [164, -72], [172, -71], [180, -68.4], [190, -64], [198, -59], [203, -54.6], [204.4, -51], [202.6, -47.6], [197, -44.6], [188, -42.6], [178, -42], [168, -41], [160, -40], [155, -44]];
  let ki = `<g filter="${weich(T, "ck", 1.1)}">` + form(T, poly([[152, -58], [164, -70], [180, -67], [198, -58], [186, -58], [168, -60]]), "#fff", ' opacity=".22"') + form(T, poly([[156, -42], [180, -42], [200, -46.4], [192, -48], [170, -47]]), "#000", ' opacity=".25"') + "</g>";
  /* Kopfzeichnung: rote Linien, helle Lippe */
  ki += `<path d="M162 -60Q176 -56 196 -53M166 -52Q180 -50 198 -50" fill="none" stroke="#d0562c" stroke-width="1.6" stroke-opacity=".6" stroke-linecap="round"/>`;
  ki += `<path d="M160 -44Q180 -44.6 202.6 -48.2L201 -46.4Q180 -42.6 160 -42Z" fill="#eef2e2" opacity=".75"/>`;
  if (F) ki += `<rect x="148" y="-74" width="58" height="34" fill="${musterBeulen(T, "ck2", 0.9, { grund: 0.12, hell: 0.24, dunkel: 0.28 })}"/>`;
  h += teil(T, kp, "#46aa86", { innen: ki, rand: "#10241c", randA: 0.32, rw: 0.35 });
  /* Helmkante und Schnauzenkamm als Grate mit Lichtkante */
  h += linien(T, [[[154, -63], [162, -70.6], [172, -70.6], [184, -66.6], [196, -60], [203.4, -54]]], "#10241c", 0.5, 0.35) + linien(T, [[[155, -64], [163, -71.4], [172, -71.4], [184, -67.4], [196, -60.8]]], "#e6f6e8", 0.5, 0.35);
  /* Maulspalte: nach unten gezogen */
  h += linien(T, [[[203.2, -48.6], [196, -46.6], [186, -45.2], [176, -44.6], [168, -44.2], [163, -42.6]]], "#0c1a12", 0.45, 0.8);
  h += `<ellipse cx="199.4" cy="-54.6" rx=".9" ry=".7" fill="#0c1a12"/>`;
  /* Turmauge: kegelförmiges Lid aus Körnchenhaut mit konzentrischen Ringen, kleine Öffnung mit Pupille */
  const ax = 180, ay = -57;
  let au = `<circle cx="${ax}" cy="${ay}" r="8.4" fill="${T.rg("turm", [[0, "#6ad0a8"], [0.55, "#3aa080"], [1, "#1a5c46"]], 0.4, 0.34, 0.72)}" stroke="#10241c" stroke-width=".35" stroke-opacity=".4"/>`;
  /* Lidkegel: radiale Farbstreifen und feine Körnchenringe (schwach), Licht oben links */
  let rad = "";
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + 0.3; rad += `M${R(ax + 1.6 + Math.cos(a) * 2.6)} ${R(ay + Math.sin(a) * 2.6)}L${R(ax + 0.6 + Math.cos(a) * 8)} ${R(ay + Math.sin(a) * 8)}`; }
  au += `<path d="${rad}" stroke="#d0562c" stroke-width="1" stroke-opacity=".38" stroke-linecap="round"/>`;
  au += `<g fill="none" stroke="#0c2018" stroke-opacity=".16" stroke-width=".3">` + [6.8, 5.2, 3.8].map((r) => `<circle cx="${R(ax + (7.4 - r) * 0.2)}" cy="${ay}" r="${r}"/>`).join("") + "</g>";
  if (F) au += `<circle cx="${ax}" cy="${ay}" r="8.2" fill="${musterBeulen(T, "ca", 0.7, { grund: 0.08, hell: 0.2, dunkel: 0.2 })}"/>`;
  au += `<circle cx="${ax - 2.4}" cy="${ay - 3}" r="3.4" fill="${T.rg("turml", [[0, "#fff", 0.35], [1, "#fff", 0]])}"/>`;
  au += `<circle cx="${ax + 1.6}" cy="${ay}" r="2" fill="#2a4a3a"/><circle cx="${ax + 1.7}" cy="${ay}" r="1.5" fill="#b8862e"/><circle cx="${ax + 1.8}" cy="${ay}" r="0.95" fill="#050302"/><circle cx="${ax + 1.3}" cy="${ay - 0.6}" r=".38" fill="#fff" opacity=".9"/>`;
  h += au;
  return fertig(0.15, h, [17, -76, 237, 0.4], [92, 146], [148, -78, 208, -38]);
}

/* =====================================================================
   SCHILDKRÖTE (Griechische Landschildkröte, Testudo hermanni)
   RECHERCHE: Panzerlänge 15–20 cm (hier 17 cm, mit Kopf und Schwanz ~21 cm). Rückenpanzer hoch gewölbt, am höchsten
   HINTER der Mitte, Seiten steil abfallend, hinterer Rand leicht nach unten gebogen und gesägt. Schilde: Nackenschild
   vorn, 5 Wirbelschilde (Vertebralia) auf der Mittellinie, je 4 Rippenschilde (Costalia), je 11 Randschilde, Schwanz-
   schild meist geteilt. Jeder Schild mit Wachstumsringen um ein Areola-Feld. Färbung: kräftiges Gelb bis Gelbolive mit
   schwarzen Flecken (auf dem 5. Wirbelschild „Schlüsselloch“), Bauchpanzer gelb mit zwei schwarzen Längsbändern.
   Kopf stumpf, Hornschnabel mit gezähnelter Schneide, Auge dunkel, gelblicher Fleck auf der Wange; Haut gelblich-grau,
   faltig. Vorderbeine mit großen, dachziegelartigen Schuppen und 5 Krallen, Hinterbeine säulenförmig („Elefantenfüße“)
   mit 4 Krallen. Schwanz mit verhorntem Endnagel (Unterschied zur Maurischen Landschildkröte mit Schenkelsporn).
   Zeichenraum: 1 Einheit = 0,1 cm.
   ===================================================================== */
function schildkroete(T) {
  const F = T.fein;
  let h = "";
  const haut = ["#c8b98e", "#a89a70", "#6e6346"], hautF = ["#a49670", "#857a58", "#544c36"];
  /* ferne Beine (hinter dem Panzer, dunkler) */
  h += teil(T, [[148, -22], [162, -24], [166, -12], [169, -3], [167, -0.2, 1], [153, -0.2, 1], [151, -6]], T.lg("skf", [[0, hautF[0]], [1, hautF[2]]], 0.2, 0, 0.8, 1), { rand: "#2a2414", randA: 0.3, rw: 0.4 });
  h += teil(T, [[44, -18], [62, -18], [62, -8], [64, -0.2, 1], [44, -0.2, 1], [46, -8]], T.lg("skf", [[0, hautF[0]], [1, hautF[2]]], 0.2, 0, 0.8, 1), { rand: "#2a2414", randA: 0.3, rw: 0.4 });
  h += krallen(T, [[167, -1.6, 3, 1.4, 40, 0.4], [163, -1.2, 3, 1.4, 50, 0.4], [63, -1.2, 2.6, 1.3, 40, 0.4]], "#3a3020");
  let g9 = "";
  /* Schwanz mit Endnagel */
  g9 += teil(T, [[24, -34], [16, -30], [8, -25], [4.4, -23.4], [8, -22.6], [16, -24], [26, -26]], T.lg("sks", [[0, haut[0]], [1, haut[2]]]), { rand: "#2a2414", randA: 0.35, rw: 0.35 });
  g9 += `<path d="M5.6 -24.6L1.6 -23.2L5.6 -22.4Z" fill="#4a3e28"/>`;
  /* Hals und Kopf (vor dem Panzerrand) */
  const hals = [[160, -54], [172, -58], [184, -56], [190, -50], [190, -40], [182, -32], [168, -30], [160, -36]];
  let hi = fleck(T, "d", 170, -34, 12, 4, 0, 0.4) + fleck(T, "l", 176, -52, 8, 3, -10, 0.35);
  if (F) hi += linien(T, [[[166, -52], [170, -44], [168, -36]], [[172, -55], [176, -46], [175, -36]], [[178, -55], [182, -46], [182, -36]], [[164, -44], [174, -44.6], [186, -44]]], "#4a4028", 0.5, 0.35) +
    linien(T, [[[166.4, -52.4], [170.4, -44.4], [168.4, -36.4]], [[172.4, -55.4], [176.4, -46.4], [175.4, -36.4]]], "#f2ead0", 0.35, 0.3);
  g9 += teil(T, hals, T.lg("skh", [[0, haut[0]], [0.6, haut[1]], [1, haut[2]]]), { innen: hi, rand: "#2a2414", randA: 0.3, rw: 0.4 });
  const kp = [[180, -58], [186, -63.4], [194, -65.4], [202, -64], [208, -60], [211, -54.6], [211, -50], [208.6, -46.2], [203, -43.4], [195, -42.6], [187, -44], [181, -48]];
  let ki = `<g filter="${weich(T, "skk", 1)}">` + form(T, poly([[183, -59], [192, -64.4], [203, -63.4], [209, -57], [200, -58], [190, -57]]), "#fff", ' opacity=".28"') + form(T, poly([[184, -46], [196, -43.4], [208, -46.4], [204, -49], [192, -48.6]]), "#000", ' opacity=".25"') + "</g>";
  /* große Kopfschilde, gelber Wangenfleck */
  ki += `<ellipse cx="189.4" cy="-51" rx="3.4" ry="2.2" fill="#d8c464" opacity=".5" filter="${weich(T, "skw", 0.8)}"/>`;
  const fu = [[[190, -63.8], [193, -59], [199, -58.6], [202.6, -63.8]], [[199, -58.6], [204, -56], [209.6, -57]], [[193, -59], [189, -55]], [[186.6, -62], [189, -58]]];
  ki += linien(T, fu, "#3a3020", 0.35, 0.45) + linien(T, fu.map((p) => p.map(([x, y]) => [x + 0.3, y + 0.35])), "#f6ecc8", 0.25, 0.35);
  if (F) ki += `<path d="${pfad(T, kp)}" fill="${musterBeulen(T, "skk", 1.6, { grund: 0.08, hell: 0.16, dunkel: 0.2 })}"/>`;
  g9 += teil(T, kp, "#b5a678", { innen: ki, rand: "#2a2414", randA: 0.35, rw: 0.4 });
  /* Hornschnabel: dunkle Schneide, leicht gezähnelt; Maulspalte; Nasenloch */
  g9 += `<path d="M211 -50.6Q210.4 -46.6 208.4 -45.2Q205 -44 201 -44.8L201.6 -46.6Q205.4 -46.6 207.6 -48.4Z" fill="#5a4c30"/>`;
  g9 += linien(T, [[[210.6, -50.4], [206.6, -48.6], [201, -47.6], [195.6, -47.2], [191.6, -46.6]]], "#1a140a", 0.5, 0.8);
  g9 += `<ellipse cx="209.2" cy="-58.4" rx=".8" ry=".6" fill="#1a140a"/>`;
  g9 += fleck(T, "d", 198.4, -56.4, 4.4, 3.2, 0, 0.4);
  g9 += reptilAuge(T, 198.6, -56, 2.3, { iris: "#3a2a18", iris2: "#100a05", pupille: "rund", offen: 0.66, netz: false, haut: "#b5a678", lidRand: "#3a3020" });
  /* Rückenpanzer: Abbildung Rand (u, w = 0) → Rückenlinie (w = 1) */
  const D = polyl([[16, -31], [20, -48], [32, -70], [52, -88], [78, -99], [104, -100.4], [128, -94], [150, -79], [166, -61], [174, -46], [176, -37]]);
  const Rm = polyl([[16, -31], [30, -29.4], [60, -28.2], [100, -27.6], [140, -28.4], [166, -30.4], [176, -37]]);
  const P = (u, w) => { const a = Rm.at(u), b = D.at(u); return [a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w]; };
  const vier = (u0, u1, w0, w1, n = 3) => { const p = []; for (let i = 0; i <= n; i++) p.push(P(u0 + (u1 - u0) * i / n, w0)); for (let i = n; i >= 0; i--) p.push(P(u0 + (u1 - u0) * i / n, w1)); return p; };
  /* Bauchpanzer (Brücke zwischen den Beinen) unter dem Rand */
  g9 += teil(T, [[44, -29], [150, -29.6], [148, -22.4], [120, -21], [80, -21], [50, -22.6]], "#d4b860", { innen: `<path d="M44 -26L150 -26.4L150 -24L44 -23.6Z" fill="#2a1e0e" opacity=".55"/>` + fleck(T, "d", 100, -21, 60, 3, 0, 0.4), rand: "#2a1e0e", randA: 0.4, rw: 0.4 });
  const schilde = [];
  /* Randschilde (11), Rippenschilde (4), Wirbelschilde (5, nur ihre Flanke sichtbar) */
  for (let i = 0; i < 11; i++) schilde.push([vier(i / 11, (i + 1) / 11, 0, 0.15, 2), 0.3 + (i % 3) * 0.1]);
  const cs = [0.06, 0.29, 0.51, 0.73, 0.94];
  for (let i = 0; i < 4; i++) schilde.push([vier(cs[i], cs[i + 1], 0.15, 0.76, 4), 0.5]);
  const vs = [0.1, 0.27, 0.43, 0.59, 0.75, 0.9];
  for (let i = 0; i < 5; i++) schilde.push([vier(vs[i], vs[i + 1], 0.76, 1.02, 3), 0.4]);
  let pz = "";
  /* gelbe Schilde mit schwarzen Flecken (vorne/oben im Schild), Wachstumsringe um die Areola */
  let dDunkel = "", dRing = "", dLicht = "", dFuge = "";
  for (const [p, dk] of schilde) {
    const cx = p.reduce((s, q) => s + q[0], 0) / p.length, cy = p.reduce((s, q) => s + q[1], 0) / p.length;
    const ax = cx - (cx - 100) * 0.06, ay = cy + 1.5;
    /* schwarzer Bereich an der vorderen/oberen Schildkante (Hermanns Landschildkröte), Areola gelb */
    const vorn = p.map(([x, y]) => [x, y]).filter(([x, y]) => x > cx - 2 || y < cy - 2);
    dDunkel += T.glatt(p.map(([x, y]) => { const k = (x > cx || y < cy - 3) ? 0.98 : 0.5 + T.rnd() * 0.15; return [ax + (x - ax) * k, ay + (y - ay) * k]; }));
    if (F) for (const f of [0.84, 0.68, 0.52]) dRing += T.glatt(p.map(([x, y]) => [ax + (x - ax) * f, ay + (y - ay) * f]));
    dLicht += T.glatt(p.filter((_, i) => i % 2 === 0).map(([x, y]) => [ax + (x - ax) * (0.3 + T.rnd() * 0.12) - 0.6, ay + (y - ay) * (0.32 + T.rnd() * 0.12) - 0.6]));
    dFuge += poly(p);
  }
  let si = `<path d="${dDunkel}" fill="#24180a" opacity=".55" filter="${weich(T, "skd", 0.9)}"/>`;
  if (dRing) si += `<path d="${dRing}" fill="none" stroke="#5a4418" stroke-width=".45" stroke-opacity=".5" stroke-linejoin="round"/>`;
  si += `<path d="${dLicht}" fill="#f2dc84" opacity=".55" filter="${weich(T, "skl", 0.8)}"/>`;
  si += `<path d="${dFuge}" fill="none" stroke="#1e1408" stroke-width="1.1" stroke-opacity=".75" stroke-linejoin="round"/>`;
  if (F) si += `<path d="${dFuge}" fill="none" stroke="#f8e8b0" stroke-width=".45" stroke-opacity=".35" transform="translate(.5 .6)"/>`;
  /* Wölbung: Licht oben links, Schatten unten rechts, Randschilde leicht aufgebogen */
  si += `<g filter="${weich(T, "skp", 5)}">` + form(T, poly([[40, -80], [70, -100], [110, -102], [100, -84], [70, -70], [44, -60]]), "#fff", ' opacity=".28"') + form(T, poly([[140, -30], [180, -40], [180, -80], [150, -60], [120, -40]]), "#000", ' opacity=".25"') +
    form(T, poly([[14, -28], [180, -28], [180, -40], [100, -38], [14, -36]]), "#000", ' opacity=".22"') + "</g>";
  const umr = [[16, -31], [20, -48], [32, -70], [52, -88], [78, -99], [104, -100.4], [128, -94], [150, -79], [166, -61], [174, -46], [176.6, -37], [166, -29.6], [140, -27.6], [100, -26.8], [60, -27.4], [30, -28.6]];
  g9 += teil(T, umr, "#c7a448", { innen: si, rand: "#1e1408", randA: 0.5, rw: 0.6 });
  h += `<g transform="translate(0 9)">${g9}</g>`;
  /* nahe Beine: Vorderbein mit großen Schuppen und 5 Krallen, Hinterbein säulenförmig („Elefantenfuß“) mit 4 Krallen */
  const bv = [[146, -26], [158, -28.4], [168, -24], [173.4, -16], [174.6, -9], [177, -3.6], [177.4, -0.2, 1], [155, -0.2, 1], [154.4, -5], [151, -12], [147, -18]];
  let bvi = fleck(T, "l", 158, -20, 6, 7, -10, 0.35) + fleck(T, "d", 152, -5, 6, 5, 0, 0.35);
  let sch = "";
  for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { const x = 149 + c * 5 + r * 1.8, y = -24.4 + r * 4.6; if (x > 172 + r * 1.2) continue; sch += `M${R(x)} ${R(y)}q2.5 -2 5 0q-.5 2.8 -2.5 3.4q-2 -.6 -2.5 -3.4Z`; }
  bvi += `<path d="${sch}" fill="${T.lg("sksch", [[0, "#ebdcae"], [1, "#9a8a60"]])}" stroke="#4a3e24" stroke-width=".3" stroke-opacity=".55"/>`;
  h += teil(T, bv, T.lg("skb", [[0, haut[0]], [0.6, haut[1]], [1, haut[2]]], 0.2, 0, 0.8, 1), { innen: bvi, rand: "#2a2414", randA: 0.35, rw: 0.4 });
  h += krallen(T, [[176.4, -1.6, 3.4, 1.6, 35, 0.4], [172.6, -1.2, 3.4, 1.6, 45, 0.4], [168.6, -1, 3.2, 1.5, 55, 0.4], [164.6, -0.8, 3, 1.4, 65, 0.4]], "#3a3020");
  const bh = [[27, -21], [50, -21], [53.6, -14], [54.6, -7], [57.6, -2.4], [58, -0.2, 1], [30, -0.2, 1], [29.4, -4], [31, -10], [27.6, -15]];
  let bhi = fleck(T, "l", 36, -14, 6, 7, 0, 0.3) + fleck(T, "d", 52, -8, 5, 7, 0, 0.35);
  if (F) bhi += `<path d="${pfad(T, bh)}" fill="${musterBeulen(T, "skh", 2.6, { grund: 0.12, hell: 0.24, dunkel: 0.3 })}"/>` + linien(T, [[[31, -8], [42, -7], [54, -8]], [[30, -4], [42, -3], [56, -4]]], "#4a3e24", 0.5, 0.4);
  h += teil(T, bh, T.lg("skb", [[0, haut[0]], [0.6, haut[1]], [1, haut[2]]], 0.2, 0, 0.8, 1), { innen: bhi, rand: "#2a2414", randA: 0.35, rw: 0.4 });
  h += krallen(T, [[57.6, -1.4, 3, 1.5, 30, 0.4], [53, -1, 3, 1.5, 40, 0.4], [48.4, -0.8, 2.8, 1.4, 50, 0.4]], "#3a3020");
  return fertig(0.1, h, [1.6, -91.4, 211, 0], [44, 60, 160, 168], [176, -59, 214, -31]);
}

module.exports = [
  { id: "krokodil", de: "das Krokodil", syl: "Kro-ko-DIL", it: "il coccodrillo", itSyl: "coc-co-DRIL-lo", en: "crocodile",
    gruppe: "Reptilien", lebensraum: "Fluss", laenge: 4.5, hoehe: 0.55, zeichne: krokodil },
  { id: "alligator", de: "der Alligator", syl: "Al-li-GA-tor", it: "l'alligatore", itSyl: "al-li-ga-TO-re", en: "alligator",
    gruppe: "Reptilien", lebensraum: "Sumpf", laenge: 3.8, hoehe: 0.47, zeichne: alligator },
  { id: "kobra", de: "die Kobra", syl: "KO-bra", it: "il cobra", itSyl: "CO-bra", en: "cobra",
    gruppe: "Reptilien", lebensraum: "Wald", laenge: 0.45, hoehe: 0.5, zeichne: kobra },
  { id: "python", de: "der Python", syl: "PY-thon", it: "il pitone", itSyl: "pi-TO-ne", en: "python",
    gruppe: "Reptilien", lebensraum: "Regenwald", laenge: 2.98, hoehe: 0.61, zeichne: python },
  { id: "eidechse", de: "die Eidechse", syl: "EI-dech-se", it: "la lucertola", itSyl: "lu-CER-to-la", en: "lizard",
    gruppe: "Reptilien", lebensraum: "Wiese", laenge: 0.22, hoehe: 0.028, zeichne: eidechse },
  { id: "chamaeleon", de: "das Chamäleon", syl: "Cha-MÄ-le-on", it: "il camaleonte", itSyl: "ca-ma-le-ON-te", en: "chameleon",
    gruppe: "Reptilien", lebensraum: "Regenwald", laenge: 0.33, hoehe: 0.115, zeichne: chamaeleon },
  { id: "leguan", de: "der Leguan", syl: "LE-gu-an", it: "l'iguana", itSyl: "i-GUA-na", en: "iguana",
    gruppe: "Reptilien", lebensraum: "Regenwald", laenge: 1.5, hoehe: 0.17, zeichne: leguan },
  { id: "schildkroete", de: "die Schildkröte", syl: "SCHILD-krö-te", it: "la tartaruga", itSyl: "tar-ta-RU-ga", en: "tortoise",
    gruppe: "Reptilien", lebensraum: "Garten", laenge: 0.21, hoehe: 0.092, zeichne: schildkroete },
  { id: "komodowaran", de: "der Komodowaran", syl: "Ko-mo-do-wa-RAN", it: "il drago di Komodo", itSyl: "DRA-go di KO-mo-do", en: "Komodo dragon",
    gruppe: "Reptilien", lebensraum: "Insel", laenge: 2.71, hoehe: 0.48, zeichne: komodowaran },
];
