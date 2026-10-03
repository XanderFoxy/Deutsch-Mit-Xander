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
   o.kiel: Kiel je Schuppe (Grat: Licht oben, Schatten unten); o.ton: Anteil Schuppen mit eigenem Farbton (hell/dunkel);
   o.versatz: Ziegelverband (jede 2. Zeile halb versetzt); o.jit: Wackeln der Spalten */
const gitter = (T, Rr, ts, vs, o = {}) => {
  let dG = "", dL = "", dK = "", dKL = "", dH = "", dD = "";
  const g = o.g || 0.35, jit = o.jit || 0;
  const t0 = ts[0], t1 = ts[ts.length - 1], nP = Math.max(3, Math.round(Rr.len * (t1 - t0) / (o.schritt || 14)));
  for (const v of vs) {
    const p = Rr.zug(v, t0, t1, nP);
    dG += T.glatt(p, false);
    if (o.licht !== false) dL += T.glatt(p.map(([x, y]) => [x + g * 0.3, y + g]), false);
  }
  for (let j = 0; j < vs.length - 1; j++) {
    const v0 = vs[j], v1 = vs[j + 1], halb = o.versatz && j % 2;
    const sp = ts.map((t, i) => (halb ? (i < ts.length - 1 ? (t + ts[i + 1]) / 2 : null) : t) + (jit ? (T.rnd() - 0.5) * jit : 0)).filter((t) => !isNaN(t) && t !== null);
    for (let i = 0; i < sp.length; i++) {
      const t = sp[i], a = Rr.P(t, v0), b = Rr.P(t, v1);
      if (!(halb && false)) dG += `M${R(a[0])} ${R(a[1])}L${R(b[0])} ${R(b[1])}`;
      if (o.licht !== false) dL += `M${R(a[0] + g)} ${R(a[1] + g * 0.6)}L${R(b[0] + g)} ${R(b[1] - g * 0.2)}`;
      if (i === sp.length - 1) continue;
      const tn = sp[i + 1];
      if (o.ton && T.rnd() < o.ton) {
        const q = [Rr.P(t, v0), Rr.P(tn, v0), Rr.P(tn, v1), Rr.P(t, v1)];
        const dd = `M${q.map(([x, y]) => R(x) + " " + R(y)).join("L")}Z`;
        if (T.rnd() < 0.5) dH += dd; else dD += dd;
      }
      if (o.kiel && (!o.kielZeilen || o.kielZeilen.includes(j))) {
        const vm = v0 + (v1 - v0) * (o.kielV || 0.5);
        const k0 = Rr.P(t + (tn - t) * 0.16, vm), k1 = Rr.P(t + (tn - t) * 0.86, vm - (v1 - v0) * 0.06);
        dK += `M${R(k0[0])} ${R(k0[1] + g * 0.55)}L${R(k1[0])} ${R(k1[1] + g * 0.55)}`;
        dKL += `M${R(k0[0])} ${R(k0[1] - g * 0.15)}L${R(k1[0])} ${R(k1[1] - g * 0.15)}`;
      }
    }
  }
  const w = o.w || 0.3;
  return (dH ? `<path d="${dH}" fill="${o.tonHell || "#fff"}" fill-opacity="${o.opTH || 0.07}"/>` : "") + (dD ? `<path d="${dD}" fill="#000" fill-opacity="${o.opTD || 0.12}"/>` : "") +
    (dL ? `<path d="${dL}" fill="none" stroke="${o.hell || "#efe4bf"}" stroke-width="${R2(w * 0.8)}" stroke-opacity="${o.opL || 0.28}" stroke-linecap="round"/>` : "") +
    `<path d="${dG}" fill="none" stroke="${o.dunkel || "#14120a"}" stroke-width="${w}" stroke-opacity="${o.opS || 0.6}" stroke-linecap="round" stroke-linejoin="round"/>` +
    (dK ? `<path d="${dK}" fill="none" stroke="#0f0d07" stroke-width="${R2(o.kw || w * 1.4)}" stroke-opacity="${o.opK || 0.5}" stroke-linecap="round"/><path d="${dKL}" fill="none" stroke="${o.kielHell || o.hell || "#efe4bf"}" stroke-width="${R2((o.kw || w * 1.4) * 0.8)}" stroke-opacity="${o.opKL || 0.42}" stroke-linecap="round"/>` : "");
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
/* Punkte (Sinnesorgane, Poren, Sprenkel): n Punkte in Fläche pts */
const punkte = (T, pts, n, r0, farbe, op, o = {}) => {
  const [x0, y0, x1, y1] = T.box(pts);
  let d = "", k = 0, v = 0;
  while (k < n && v < n * 20) {
    v++;
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!T.inPoly(x, y, pts)) continue;
    const rr = r0 * (0.6 + T.rnd() * 0.8) * (o.groesse ? o.groesse(x, y) : 1);
    d += `M${R2(x - rr)} ${R2(y)}a${R2(rr)} ${R2(rr * (o.flach || 1))} 0 1 0 ${R2(2 * rr)} 0a${R2(rr)} ${R2(rr * (o.flach || 1))} 0 1 0 ${R2(-2 * rr)} 0`;
    k++;
  }
  return `<path d="${d}" fill="${farbe}" fill-opacity="${op}"/>`;
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
  /* ---------- Rumpf + Schwanz als Rohr ---------- */
  const sp = [[0, -0.55, 0.25, 0.25], [15, -1.5, 1.3, 1.4], [30, -2.65, 2.3, 2.55], [45, -4.1, 3.3, 3.5], [60, -6.2, 4.3, 4.4], [75, -8.8, 5.3, 5.4], [90, -11.4, 6.3, 6.3],
    [105, -14.2, 7.3, 7.1], [120, -17, 8.4, 7.9], [135, -19.6, 9.6, 8.7], [150, -21.8, 11, 9.5], [165, -23.4, 12.6, 10.5], [180, -24.4, 13.6, 11.5], [195, -24.9, 14, 12],
    [210, -25.1, 13.8, 11.7], [222, -25.4, 13, 10.6], [234, -25.9, 11.6, 9.4], [246, -26.6, 10, 8.8], [258, -27, 9.4, 8.8]];
  const Rr = rohr(sp, 5);
  const tx = (x) => { /* t zu einem x (Rumpf ist in x monoton) */ let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (Rr.P(m, 0)[0] < x) lo = m; else hi = m; } return (lo + hi) / 2; };
  const tH = tx(150), tS = tx(222);   // Hüfte, Schulter
  const umriss = Rr.zug(-1, 0, 1, 40).concat(Rr.zug(1, 0, 1, 40).reverse());

  /* ---------- ferne Beine (dunkler, dahinter) ---------- */
  const fern = "#2e2c1a";
  h += teil(T, [[232, -20], [240, -21], [244, -13], [246, -6], [250, -3.2], [256, -1.6], [259, -0.2, 1], [244, -0.2, 1], [241, -2.8], [238, -9], [233, -14]], fern, { rw: 0.25, randA: 0.5,
    innen: fleck(T, "l", 240, -15, 2.5, 4, 10, 0.25) + (F ? schuppenFeld(T, [[234, -19], [242, -20], [245, -7], [256, -1], [244, -1], [238, -9]], 1.3, { opS: 0.5, opL: 0.12 }) : "") });
  h += teil(T, [[128, -18], [140, -20], [146, -12], [145, -5], [146, -2.4], [152, -1.6], [154, -0.2, 1], [133, -0.2, 1], [134, -3], [137, -6], [134, -12]], fern, { rw: 0.25, randA: 0.5,
    innen: fleck(T, "l", 138, -14, 3, 4, 0, 0.2) + (F ? schuppenFeld(T, [[130, -17], [140, -19], [145, -6], [152, -1], [134, -1], [136, -7]], 1.4, { opS: 0.5, opL: 0.12 }) : "") });
  h += krallen(T, [[258, -0.9, 1.6, 0.5, 15, 0.4], [255.6, -0.6, 1.4, 0.45, 20, 0.4], [153.6, -0.8, 1.6, 0.5, 12, 0.4]], "#1d1a10");

  /* ---------- Körperfarbe in Zonen (weich), Muster, Licht ---------- */
  const basis = "#59562f";
  let inn = "";
  /* Farbzonen quer zum Rohr: Rücken dunkel-olivbronze, Flanke gelboliv, Bauch cremegelb */
  inn += `<g filter="${weich(T, "z", 1.6)}">` +
    T.form(Rr.band(-1.2, -0.45, 0, 1, 30), "#3a3820") +
    T.form(Rr.band(-0.1, 0.42, 0.1, 1, 30), "#857c45", ' opacity=".9"') +
    T.form(Rr.band(0.42, 1.2, 0.08, 1, 30), "#cdbf88") +
    T.form(Rr.band(0.25, 1.2, 0, 0.12, 8), "#8e8552", ' opacity=".8"') + "</g>";
  /* Schwanz-Querbinden und Flankenflecken (dunkel, folgen den Schuppenringen) */
  let bd = "";
  const binden = [0.05, 0.11, 0.17, 0.23, 0.29, 0.35, 0.41, 0.47];
  for (const b of binden) { const w = 0.018 + b * 0.012; bd += T.glatt([Rr.P(b, -1.2), Rr.P(b + w, -1.2), Rr.P(b + w * 1.25, 0.2), Rr.P(b + w * 0.9, 0.75), Rr.P(b - w * 0.1, 0.7), Rr.P(b - w * 0.2, 0.1)]); }
  /* Flanke: schräge, unregelmäßige dunkle Flecken */
  const fl = [[0.58, -0.25, 0.012, 0.55], [0.62, -0.05, 0.01, 0.45], [0.66, -0.3, 0.014, 0.6], [0.7, 0.05, 0.012, 0.4], [0.74, -0.2, 0.01, 0.5], [0.79, -0.32, 0.012, 0.55], [0.83, 0, 0.011, 0.4], [0.87, -0.25, 0.012, 0.5], [0.55, 0.1, 0.01, 0.35]];
  for (const [t, v, w, hh] of fl) bd += T.glatt([Rr.P(t - w, v - hh * 0.5), Rr.P(t + w, v - hh * 0.55), Rr.P(t + w * 1.6, v + hh * 0.5), Rr.P(t - w * 0.4, v + hh * 0.45)]);
  inn += `<path d="${bd}" fill="#1f1d10" opacity=".55" filter="${weich(T, "b", 0.5)}"/>`;
  /* feine Sprenkel auf der Flanke (Rauschen) */
  if (F) inn += T.textur(T.glatt(Rr.band(-0.4, 0.5, 0.45, 1, 20)), T.rauschen("spr", { fx: 0.35, fy: 0.5, okt: 2, staerke: 3, schwelle: 0.58, farbe: "#1c1a0e" }), 0, 0.55, [140, -45, 262, -10]);
  /* Licht: Rückenkante hell (Licht von oben links), Kernschatten unter der Mitte, Reflexlicht am Bauchrand */
  inn += `<g filter="${weich(T, "l", 1.4)}">` +
    T.form(Rr.band(-1.1, -0.65, 0.02, 0.98, 30), "#fff6d8", ' opacity=".18"') +
    T.form(Rr.band(0.35, 0.82, 0.05, 0.98, 30), "#000", ' opacity=".34"') +
    T.form(Rr.band(0.9, 1.1, 0.5, 0.97, 16), "#f4e8c0", ' opacity=".25"') + "</g>";
  /* Schuppen: Rücken (Osteoderme, gekielt), Flanke (oval), Bauch (rechteckig), Schwanzringe */
  const tsR = []; for (let i = 0; i <= 17; i++) tsR.push(tH - 0.02 + (tx(238) - tH + 0.02) * i / 17);
  const tsS = []; { let t = 0.012; while (t < tH - 0.02) { tsS.push(t); t += 0.0105 + t * 0.012; } tsS.push(tH - 0.02); }
  if (F) {
    /* Rückenschild: 3 sichtbare Längsreihen (nach oben verkürzt), stark gekielt */
    inn += gitter(T, Rr, tsR, [-1.05, -0.86, -0.66, -0.44], { kiel: true, w: 0.32, g: 0.32, opS: 0.7, opL: 0.3, opK: 0.6, opKL: 0.5, kw: 0.5 });
    /* Flankenschuppen (oval, unregelmäßig) zwischen Rückenschild und Bauch */
    inn += schuppenFeld(T, Rr.band(-0.44, 0.5, tH + 0.01, tx(236), 24), 2.1, { flach: 0.75, opS: 0.55, opL: 0.25, w: 0.11, groesse: () => 1 });
    /* Bauchschilde: Querreihen kleiner Rechtecke */
    const tsB = []; for (let t = tH - 0.03; t < tx(240); t += 0.0075) tsB.push(t);
    inn += gitter(T, Rr, tsB, [0.5, 0.64, 0.78, 0.92, 1.05], { w: 0.2, g: 0.22, opS: 0.45, opL: 0.3, hell: "#fff4d2" });
    /* Schwanzringe: obere Reihen gekielt, untere glatt */
    inn += gitter(T, Rr, tsS, [-1.05, -0.72, -0.4, -0.08, 0.24, 0.56, 0.85, 1.05], { kiel: true, kielZeilen: [0, 1, 2], w: 0.3, g: 0.3, opS: 0.65, opL: 0.28, opK: 0.45, opKL: 0.4, kw: 0.42 });
  } else {
    /* Szene: nur die wichtigsten Linien */
    inn += gitter(T, Rr, tsR.filter((_, i) => i % 2 === 0), [-1.05, -0.8, -0.5], { w: 0.5, g: 0.5, opS: 0.5, opL: 0.2, licht: false });
    inn += gitter(T, Rr, tsS.filter((_, i) => i % 2 === 0), [-0.6, 0.5], { w: 0.5, opS: 0.4, licht: false });
  }
  h += teil(T, T.glatt(umriss), basis, { innen: inn, rw: 0.35, randA: 0.55 });

  /* ---------- Schwanzkamm (zwei Reihen, ab der Mitte eine) und Rückenkiele ---------- */
  let kam = "", kamL = "", kamF = "";
  for (let i = 0; i < tsS.length - 1; i++) {
    const t0 = tsS[i], t1 = tsS[i + 1], [x0, y0, nx, ny] = Rr.at(t0), Hh = (0.6 + 2.6 * Math.sin(Math.PI * Math.min(1, (t0 / tH) * 0.9 + 0.05))) * (t0 < 0.1 ? 0.6 + t0 * 4 : 1);
    const a = Rr.P(t0, -1), b = Rr.P(t1, -1), m = Rr.P(t0 + (t1 - t0) * 0.62, -1);
    const sp2 = [m[0] + nx * Hh - 0.3, m[1] + ny * Hh];
    kam += `M${R(a[0])} ${R(a[1] + 0.4)}L${R(sp2[0])} ${R(sp2[1])}L${R(b[0])} ${R(b[1] + 0.4)}Z`;
    if (F) kamL += `M${R(a[0] + 0.3)} ${R(a[1])}L${R(sp2[0])} ${R(sp2[1] + 0.2)}`;
    /* ferne Kammreihe (vordere Schwanzhälfte): halb versetzt, dunkler */
    if (t0 > 0.24) { const mm = Rr.P(t0 + (t1 - t0) * 0.15, -1); kamF += `M${R(a[0] - 0.8)} ${R(a[1] + 0.4)}L${R(mm[0] + nx * Hh * 0.85 - 0.6)} ${R(mm[1] + ny * Hh * 0.85)}L${R(mm[0] + 0.6)} ${R(mm[1] + 0.4)}Z`; }
  }
  /* Rückenkiele (paravertebrale Platten) als flache Höcker auf der Rückenlinie */
  for (let i = 0; i < tsR.length - 1; i++) {
    const t0 = tsR[i], t1 = tsR[i + 1], a = Rr.P(t0 + (t1 - t0) * 0.1, -1), b = Rr.P(t1 - (t1 - t0) * 0.1, -1), m = Rr.P((t0 + t1) / 2, -1);
    const H2 = 0.9 + 0.3 * Math.sin(i);
    kam += `M${R(a[0])} ${R(a[1] + 0.4)}Q${R(m[0] - 0.4)} ${R(m[1] - H2 * 1.6)} ${R(b[0])} ${R(b[1] + 0.4)}Z`;
    if (F) kamL += `M${R(a[0] + 0.2)} ${R(a[1] - 0.1)}Q${R(m[0] - 0.6)} ${R(m[1] - H2 * 1.3)} ${R(m[0] + 0.3)} ${R(m[1] - H2 * 0.7)}`;
  }
  h += `<path d="${kamF}" fill="#25231a" stroke="#0f0e08" stroke-width=".2" stroke-opacity=".5"/>`;
  h += `<path d="${kam}" fill="${T.lg("kamm", [[0, "#6b6640"], [0.6, "#45422a"], [1, "#2c2a1a"]], 0, -42, 0, -18, US)}" stroke="#12100a" stroke-width=".22" stroke-opacity=".6" stroke-linejoin="round"/>`;
  if (kamL) h += `<path d="${kamL}" fill="none" stroke="#efe4bf" stroke-width=".22" stroke-opacity=".38" stroke-linecap="round"/>`;

  /* ---------- nahes Hinterbein: kräftiger Oberschenkel, Knie vorn, Unterschenkel, langer Fuß mit 4 Zehen ---------- */
  const hb = [[136, -30], [148, -33.4], [158, -31], [165, -24], [167.6, -15.4], [166, -10.6], [162.6, -7.4], [162, -4.2], [164.6, -2.8], [171, -2.2], [176, -1.4], [178.6, -0.2, 1],
    [150.6, -0.2, 1], [149.4, -1.6], [151.4, -4.6], [154, -8.4], [153.8, -11.8], [148, -15.4], [140, -19], [134.4, -24]];
  let hi = "";
  hi += fleck(T, "l", 153, -26, 9, 5, -20, 0.55) + fleck(T, "l", 161, -16, 2.6, 5, 15, 0.35) + fleck(T, "d", 143, -18, 8, 4, -25, 0.55) + fleck(T, "d", 157, -6, 3, 3, 0, 0.4) + fleck(T, "d", 162, -1.4, 12, 1.4, 0, 0.5);
  if (F) {
    hi += schuppenFeld(T, [[138, -29], [150, -32], [159, -29], [165, -20], [165, -12], [160, -8], [154, -10], [146, -16], [138, -22]], 1.5, { flach: 0.8, opS: 0.55, opL: 0.25 });
    hi += schuppenFeld(T, [[152, -8], [161, -8], [163, -3], [176, -1.4], [151, -1], [151, -4]], 1, { flach: 0.7, opS: 0.5, opL: 0.22 });
    /* Saum gekielter Schuppen hinten am Unterschenkel */
    hi += reihe(T, [[154, -11.4], [152.4, -7.6], [150.4, -3.4]], 6, 1.2, "#120f08", 0.3, 0.5, -0.2);
  }
  hi += linien(T, [[[137, -27.4], [146, -22], [151, -16.4]], [[156.6, -9.6], [160, -9], [163.4, -10.4]]], "#120f08", 0.35, 0.4);
  h += teil(T, hb, "#575330", { innen: hi, rw: 0.3, randA: 0.5, kante: [hb.slice(2, 12), hb.slice(13, 19)] });
  /* Zehen (von nah IV bis fern II), Schwimmhaut */
  h += teil(T, [[166, -2.8], [172, -2.9], [178, -2.3], [182.6, -1.2], [183.4, -0.2, 1], [170, -0.2, 1], [166, -0.9]], "#4a462a", { rw: 0.25, randA: 0.45, innen: F ? reihe(T, [[167, -2.4], [174, -2.4], [182, -1]], 10, 1.6, "#120f08", 0.15, 0.45) : "" });
  h += T.form([[169, -2.6], [176, -3.2], [181, -2.6], [178, -1.8]], "#3a3722", ' opacity=".6"');
  h += krallen(T, [[182.6, -0.9, 2, 0.6, 12, 0.4], [178.4, -1.9, 1.8, 0.55, 22, 0.4], [175.6, -2.6, 1.4, 0.45, 28, 0.4]], "#241f15");

  /* ---------- nahes Vorderbein: Oberarm nach hinten-unten, Ellbogen hinten, Unterarm nach vorn, Hand mit 5 Fingern ---------- */
  const vb = [[216, -28], [225, -30.4], [231, -24], [230, -17], [229.6, -11], [231, -6], [233.6, -3.2], [238, -2], [241.6, -1.2], [242.4, -0.2, 1], [224, -0.2, 1], [223.6, -2.6], [224.4, -6.4],
    [221.6, -10.4], [217.4, -13.4], [215, -18]];
  let vi = fleck(T, "l", 222, -23, 5, 4, -30, 0.5) + fleck(T, "l", 227.6, -9, 1.6, 4, 10, 0.35) + fleck(T, "d", 219.4, -13, 3.4, 2.6, 0, 0.55) + fleck(T, "d", 231, -1.4, 9, 1.2, 0, 0.5);
  if (F) vi += schuppenFeld(T, [[217, -27], [225, -29.4], [230, -23], [229, -12], [231, -6], [240, -1.3], [225, -1], [223, -8], [218, -14], [216, -20]], 1.2, { flach: 0.8, opS: 0.55, opL: 0.25 });
  vi += linien(T, [[[223.4, -12], [226.6, -10.6], [229.4, -11.2]], [[224.6, -4.6], [228, -4], [231, -5]]], "#120f08", 0.3, 0.4);
  h += teil(T, vb, "#5a5632", { innen: vi, rw: 0.3, randA: 0.5, kante: [vb.slice(1, 10), vb.slice(11, 16)] });
  /* Finger (gespreizt, nach vorn-außen), Krallen an I–III */
  h += teil(T, [[232, -2.6], [236.4, -3.4], [240.4, -3], [243.4, -1.6], [244.2, -0.2, 1], [238, -0.2, 1], [233, -0.8]], "#4d492c", { rw: 0.22, randA: 0.45 });
  h += krallen(T, [[243.6, -0.9, 1.8, 0.55, 14, 0.4], [241.2, -1.8, 1.6, 0.5, 24, 0.4], [238.4, -2.6, 1.3, 0.45, 32, 0.4]], "#241f15");

  /* ---------- Kopf ---------- */
  /* Hals-/Kehlhaut unter dem Kopf (Falten) */
  const kehle = [[244, -19], [252, -17.4], [258, -16.6], [262, -17.6], [258, -22], [250, -25], [244, -24]];
  h += teil(T, kehle, "#a59a62", { rand: false, innen: fleck(T, "d", 250, -18, 6, 2, 0, 0.4) + linien(T, [[[247, -18.8], [250, -21.2], [254, -21.6]], [[250.6, -17.8], [253.6, -20], [257, -20.4]]], "#1a160c", 0.25, 0.35) });
  /* Unterkiefer */
  const uk = [[300, -22.6], [300.4, -21.2], [299.4, -19.6], [295, -18.4], [288, -17.8], [280, -17.2], [270, -16.6], [262, -16.3], [256, -16.6], [251.6, -18.2], [248.4, -20.6], [248.6, -23], [251.6, -24.6], [256, -25.2], [262, -23.6], [272, -23.1], [284, -22.6], [292, -22.9]];
  let ui = "";
  ui += `<g filter="${weich(T, "k", 0.8)}">` + T.form([[251, -19], [262, -17], [280, -17.8], [298, -19.6], [298, -21.4], [280, -21], [262, -21.4], [252, -22.4]], "#d7cb98", ' opacity=".55"') + "</g>";
  ui += fleck(T, "d", 272, -16.8, 24, 1.6, 0, 0.6) + fleck(T, "l", 262, -21.6, 10, 1.4, 0, 0.35) + fleck(T, "d", 252, -21, 3.6, 3, 0, 0.45);
  /* dunkle Flecken am Unterkiefer (Nilkrokodil) */
  ui += `<path d="${[[257, -21], [263.5, -20.6], [270, -21.4], [276, -20.4], [283, -21.1], [289.4, -20.2], [295, -20.8]].map(([x, y], i) => `M${x} ${y}a${R(0.9 + (i % 2) * 0.4)} ${R(0.7 + (i % 3) * 0.2)} 0 1 0 ${R(1.8 + (i % 2) * 0.8)} 0a${R(0.9 + (i % 2) * 0.4)} ${R(0.7 + (i % 3) * 0.2)} 0 1 0 ${R(-1.8 - (i % 2) * 0.8)} 0`).join("")}" fill="#2b2714" opacity=".5"/>`;
  if (F) {
    ui += platten(T, uk, 1.15, { opS: 0.42, opL: 0.22 });
    ui += punkte(T, [[256, -23], [298, -22], [298, -19.6], [256, -18]], 70, 0.12, "#1a160a", 0.6);
    ui += reihe(T, [[252, -24.2], [262, -23.2], [272, -22.8], [284, -22.3], [292, -22.6], [299.4, -22.2]], 26, 1.1, "#18140a", 0.14, 0.45, -0.2);
  }
  h += teil(T, uk, "#9d9259", { innen: ui, rw: 0.28, randA: 0.5, kante: [uk.slice(1, 13)] });
  /* untere Zähne: ragen außen am Oberkiefer hoch (Spitzen nach oben), der große 4. greift in die Kerbe */
  const ukZ = [[298.6, -22.4, 1.3, 0.75, 0.05], [295.6, -22.8, 1.1, 0.65, 0], [293.2, -23.2, 1.3, 0.7, 0], [290.8, -23.3, 2.9, 1.05, -0.06], [287.2, -22.6, 0.9, 0.55, 0], [284.6, -22.3, 1.1, 0.6, 0],
    [281.8, -22.2, 1.2, 0.65, 0], [279, -22.3, 1.3, 0.65, 0], [276.2, -22.5, 1.25, 0.65, 0], [273.4, -22.7, 1.2, 0.62, 0], [270.6, -22.9, 1.1, 0.6, 0], [267.8, -23, 1, 0.58, 0], [265, -23.2, 0.95, 0.55, 0], [262.3, -23.4, 0.8, 0.5, 0]];
  /* Kopf (Schädel + Oberkiefer) */
  const ko = [[247.6, -36.4], [252, -37.2], [256.6, -37.6], [262, -37.8], [265.2, -38.5], [268, -39.4], [271, -38.9], [273.2, -37.2], [278, -34.6], [284, -32], [289, -30.3], [292.8, -29.6], [295.4, -29.9], [298, -29.3], [299.8, -27.6], [300.6, -25.4], [299.8, -23.6, 1],
    [297.6, -22.8], [295, -23.1], [292.6, -24.1], [290.6, -24.2], [288.6, -23.2], [286, -22.4], [282, -22.3], [277, -22.6], [271, -23], [265, -23.3], [260, -24], [256.4, -25.4], [253.6, -27.4], [251.6, -30.6], [248.4, -32.6]];
  let ki = "";
  /* Licht auf der Oberseite, Schatten an den Kieferseiten */
  ki += `<g filter="${weich(T, "h", 0.9)}">` + T.form([[250, -36.6], [262, -37.4], [272, -37.4], [284, -32.4], [296, -29.6], [299, -27.4], [292, -28.4], [280, -31.4], [268, -33.6], [256, -34]], "#ece0b0", ' opacity=".26"') +
    T.form([[254, -26.4], [262, -24.4], [280, -23.2], [296, -23.6], [296, -25], [280, -25.4], [264, -27.4], [256, -29.6]], "#000", ' opacity=".3"') + "</g>";
  ki += fleck(T, "d", 263, -32.4, 5, 3.2, 0, 0.45) + fleck(T, "d", 255, -29, 3, 4, 0, 0.45) + fleck(T, "l", 286, -28.2, 9, 1.6, -18, 0.3);
  /* Augenhöhle: Mulde unter und vor dem erhöhten Auge; Wulst darüber */
  ki += fleck(T, "d", 269.6, -35.6, 4.6, 2, -4, 0.55) + fleck(T, "l", 268.4, -38.4, 3.2, 0.9, -4, 0.55);
  /* Sprenkel auf der Schnauzenseite */
  ki += `<path d="${[[262, -27.6], [267.4, -28.8], [273, -27.2], [277.8, -29.2], [282, -26.4], [287, -27.8], [291.8, -26.2], [271, -25.2], [259.6, -30.6]].map(([x, y], i) => `M${x} ${y}a${R(0.7 + (i % 3) * 0.25)} ${R(0.55 + (i % 2) * 0.2)} 0 1 0 ${R(1.4 + (i % 3) * 0.5)} 0a${R(0.7 + (i % 3) * 0.25)} ${R(0.55 + (i % 2) * 0.2)} 0 1 0 ${R(-1.4 - (i % 3) * 0.5)} 0`).join("")}" fill="#22200f" opacity=".5"/>`;
  if (F) {
    /* Schnauze: unregelmäßige Hautschilde, Lippenschuppen, Sinnesorgane; Schädeldach: grob sculptiert */
    ki += platten(T, [[274, -35.6], [284, -31.8], [296, -29.4], [300, -26], [298, -23.4], [286, -23], [272, -23.6], [262, -24.4], [262, -30], [268, -33.4]], 1.25, { opS: 0.42, opL: 0.22 });
    ki += platten(T, [[249, -36], [262, -37.4], [266, -35], [262, -31], [256, -30], [251, -31]], 1.05, { opS: 0.5, opL: 0.25 });
    ki += punkte(T, [[262, -29], [298, -26.6], [298, -23.8], [262, -24.6]], 110, 0.11, "#14120a", 0.6);
    ki += reihe(T, [[257, -25.6], [265, -23.9], [275, -23.2], [286, -23], [290.6, -24.6], [297.6, -23.4]], 30, -0.9, "#16130a", 0.14, 0.45, 0.2);
    /* Längsfalten am Schnauzenrücken */
    ki += linien(T, [[[276, -35.2], [284, -31.6], [292, -29.8]], [[275, -33.6], [283, -30.6], [291, -28.8]]], "#16130a", 0.18, 0.3);
  }
  /* Kerbe hinter der Schnauzenspitze (Schatten), Lippenkante */
  ki += fleck(T, "d", 291, -24.6, 1.8, 1.2, 0, 0.6);
  ki += linien(T, [[[256.4, -25.6], [262, -24.2], [271, -23.4], [282, -22.8], [286, -22.8], [288.4, -23.8], [290.6, -24.6], [292.6, -24.5], [295, -23.6], [298.8, -23.6]]], "#efe2b2", 0.4, 0.3);
  h += teil(T, ko, "#57542f", { innen: ki, rw: 0.3, randA: 0.55, kante: [ko.slice(0, 18), ko.slice(28)] });
  /* obere Zähne: hängen außen über den Unterkiefer (Spitzen nach unten), größter am Oberkiefer-Buckel */
  const okZ = [[299.2, -23.4, 1.1, 0.6, 0], [296.8, -22.8, 1.5, 0.75, -0.04], [294.4, -23.1, 1.2, 0.65, 0], [287.6, -23, 1.2, 0.62, 0], [285.6, -22.5, 2.1, 0.9, -0.05], [283.2, -22.3, 1.6, 0.75, 0],
    [280.4, -22.3, 1.3, 0.66, 0], [277.6, -22.5, 1.2, 0.64, 0], [274.8, -22.7, 1.3, 0.64, 0], [272, -22.9, 1.25, 0.62, 0], [269.2, -23.1, 1.15, 0.6, 0], [266.4, -23.2, 1.05, 0.56, 0], [263.6, -23.5, 0.95, 0.52, 0], [261, -23.8, 0.8, 0.48, 0]];
  h += zaehne(T, okZ, 1, { n: "o" });
  h += zaehne(T, ukZ, -1, { n: "u" });
  /* Nackenschild: kleine Hinterhauptschilde + große gekielte Nackenplatten (Höcker) */
  let nk = "";
  for (const [x, y, w, hh] of [[251, -36.6, 2.2, 1.0], [244.4, -36.2, 3.2, 2.1], [239.6, -36.6, 3, 1.8]]) nk += `M${R(x - w / 2)} ${R(y + 0.5)}Q${R(x - w * 0.15)} ${R(y - hh * 1.6)} ${R(x + w / 2)} ${R(y + 0.5)}Z`;
  h += `<path d="${nk}" fill="#4a4729" stroke="#12100a" stroke-width=".22" stroke-opacity=".6"/>`;
  if (F) h += linien(T, [[[243.4, -36.4], [244.4, -37.6]], [[238.6, -36.8], [239.4, -37.8]]], "#efe4bf", 0.25, 0.45);

  /* ---------- Relief über alles (Haut, nur fein) ---------- */
  let s = F ? `<g filter="${T.relief("haut", { f: 1.1, tiefe: 0.55, okt: 2 })}">${h}</g>` : h;
  /* ---------- Auge: erhöht, knöchernes Oberlid, Schlitzpupille, Nickhaut halb vorgezogen ---------- */
  s += reptilAuge(T, 268.6, -36.9, 1.08, { iris: "#c9b43c", iris2: "#5f5918", offen: 0.58, winkel: -6, nick: 0.32, netzFarbe: "#3d360c" });
  /* Oberlid (Palpebrale): schwerer, rauer Wulst über dem Auge */
  s += `<path d="M266.4 -38.2Q268.6 -39.8 271.2 -38.4Q268.8 -38.9 266.4 -38.2Z" fill="#46432a" stroke="#12100a" stroke-width=".15" stroke-opacity=".6"/>`;
  if (F) s += linien(T, [[[266.6, -38.6], [268.6, -39.4], [270.6, -38.8]]], "#efe4bf", 0.18, 0.5);
  /* Ohr: Schlitz mit Ohrklappe hinter dem Auge */
  s += `<path d="M258.4 -34.8Q261 -35.6 263.4 -35.2Q261 -34.4 258.4 -34.8Z" fill="#14120a" opacity=".8"/>` + linien(T, [[[258.2, -35.2], [260.8, -36.1], [263.6, -35.6]]], "#e8dcb0", 0.22, 0.35);
  /* Nasenscheibe mit Nasenloch (Schlitz, feucht glänzend) */
  s += `<path d="M296.6 -29.7Q297.6 -30.6 298.8 -29.8Q297.8 -29.3 296.6 -29.7Z" fill="#0f0d07"/>` + (F ? linien(T, [[[296.2, -30.1], [297.6, -30.9], [299.2, -30.2]]], "#f4ead0", 0.15, 0.55) : "");
  return fertig(1.5, s, [0, -42.2, 301, 0]);
}

module.exports = [
  { id: "krokodil", de: "das Krokodil", syl: "Kro-ko-DIL", it: "il coccodrillo", itSyl: "coc-co-DRIL-lo", en: "crocodile",
    gruppe: "Reptilien", lebensraum: "Fluss", laenge: 4.5, hoehe: 0.63, schwimmt: false, zeichne: krokodil },
];
