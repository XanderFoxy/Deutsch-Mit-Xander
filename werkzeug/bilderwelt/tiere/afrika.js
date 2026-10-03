/* =====================================================================
   TIER-BIBLIOTHEK — AFRIKA / SAVANNE (FASSUNG 854)
   Elefant, Giraffe, Zebra, Nashorn, Nilpferd, Gazelle, Gnu.
   Maße in Zentimetern, Blick nach rechts, Boden y = 0, Licht von links oben.
   ===================================================================== */
"use strict";

/* ---------- gemeinsame Helfer (nur für diese Datei) ---------- */
function mach(T, dez, RW) {
  const F = T.fein !== false;
  const m = Math.pow(10, dez);
  const f = (n) => String(Math.round(n * m) / m);
  /* glatte Kurve wie T.glatt, aber mit eigener Rundung (große Tiere: ganze cm) */
  const G = (pts, zu = true, sp = 1) => {
    const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    for (let i = 0; i < (zu ? n : n - 1); i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6 * sp, p1[1] + (p2[1] - p0[1]) / 6 * sp];
      const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6 * sp, p2[1] - (p3[1] - p1[1]) / 6 * sp];
      d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
    }
    return d + (zu ? "Z" : "");
  };
  let nr = 0;
  const H = { f, G, F };
  H.US = ' gradientUnits="userSpaceOnUse"';
  /* zufällig, aber fest je (a, b, c) – für kachelbare Muster */
  const hz = (a, b, c) => { let h = (a * 73856093) ^ (b * 19349663) ^ (c * 83492791); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  /* Randlicht/Randschatten: oben links hell, unten rechts dunkel (Licht von links oben) */
  H.RIM = () => T.lg("rim", [[0, "#fff", 0.3], [0.42, "#fff", 0], [0.58, "#000", 0], [1, "#000", 0.45]], 0, 0, 1, 1);
  const weichSchon = new Set();
  /* Weichzeichner (sRGB, sonst Farbstich) */
  H.weich = (sd) => {
    sd = Math.max(0.3, Math.round(sd * 2) / 2);
    const id = T.id("bl" + String(sd).replace(".", "_"));
    if (!weichSchon.has(id)) { weichSchon.add(id); T.def(`<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${sd}"/></filter>`); }
    return `url(#${id})`;
  };
  /* weiche Form (Muskel, Kernschatten, Glanz): unscharf, nur bei voller Feinheit. zu = false → weicher Strich */
  /* EIN Filter je Unschärfe, Bereich = ganzes Tier (Benutzerraum) – spart je weicher Form ~200 Bytes */
  H.bereich = [-60, -620, 620, 60];
  H.wf = (pts, farbe, op, sd, zu = true, breite) => {
    if (!F) return "";
    const d = typeof pts === "string" ? pts : G(pts, zu);
    sd = Math.max(0.3, Math.round(sd * 4) / 4);
    const id = T.id("wb" + String(sd).replace(".", "_")), [bx0, by0, bx1, by1] = H.bereich;
    if (!weichSchon.has(id)) { weichSchon.add(id); T.def(`<filter id="${id}" filterUnits="userSpaceOnUse" x="${bx0}" y="${by0}" width="${bx1 - bx0}" height="${by1 - by0}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${sd}"/></filter>`); }
    const sw = breite || sd * 2.5;
    return `<path d="${d}" ${zu ? `fill="${farbe}"` : `fill="none" stroke="${farbe}" stroke-width="${f(sw)}" stroke-linecap="round" stroke-linejoin="round"`} opacity="${Math.round(op * 100) / 100}" filter="url(#${id})"/>`;
  };
  /* Körperteil: Pfad EINMAL in defs, dann Füllung / Innenzeichnung / Licht / Fell / Randlicht per <use>.
     Keine Umrisslinie (Kanten entstehen über Licht und Schatten); nur in der Szene ein Hauch Rand. */
  H.teil = (pts, fill, o = {}) => {
    const d = typeof pts === "string" ? pts : G(pts, true, o.sp || 1);
    const id = T.id("t" + nr++);
    T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
    const u = (a) => `<use href="#${id}" ${a}/>`;
    let s = u(`fill="${fill}"`);
    const ov = o.ov || [];
    const fell = F && o.fell ? o.fell.map((g) => Array.isArray(g) ? u(`fill="${g[0]}" opacity="${g[1]}"`) : u(`fill="${g}"`)).join("") : "";
    const rimStil = () => `fill="none" stroke="${o.rimG || H.RIM()}" stroke-width="${f(o.rim)}" filter="${H.weich(o.rim * 0.22)}"`;
    const rim = o.rim && F ? (o.rimD ? `<path d="${o.rimD}" ${rimStil()}/>` : u(rimStil())) : "";
    const randA = o.randA != null ? o.randA : (F ? 0 : 0.22);
    const randStil = `fill="none" stroke="${o.rand || "#1a140e"}" stroke-opacity="${randA}" stroke-width="${f(2 * (o.rw || RW))}" stroke-linejoin="round"`;
    const rand = randA > 0 && o.rand !== false ? (o.randD ? `<path d="${o.randD}" ${randStil}/>` : u(randStil)) : "";
    const innen = (o.unter || "") + fell + (o.innen || "") + ov.map((g) => u(`fill="${g}"`)).join("") + rim + (o.oben || "") + rand;
    if (innen) s += `<g clip-path="url(#${id}c)">${innen}</g>`;
    return s;
  };
  /* mehrere offene Linien in EINEM Pfad */
  H.L = (zuege, farbe, w, op = 1, extra = "") => zuege.length ?
    `<path d="${zuege.map((p) => G(p, false)).join("")}" fill="none" stroke="${farbe}" stroke-width="${w}"${op < 1 ? ` stroke-opacity="${op}"` : ""} stroke-linecap="round" stroke-linejoin="round"${extra}/>` : "";
  /* weicher Licht-/Schattenfleck (Verlauf, ohne Filter – auch in der Szene) */
  H.fl = (x, y, rx, ry, rot, hell, op = 1) => {
    const g = hell ? T.rg("hl", [[0, "#fff", 0.32], [1, "#fff", 0]]) : T.rg("dk", [[0, "#000", 0.34], [1, "#000", 0]]);
    return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}"${rot ? ` transform="rotate(${rot} ${f(x)} ${f(y)})"` : ""} fill="${g}"${op < 1 ? ` opacity="${op}"` : ""}/>`;
  };
  /* Kette (Bein, Rüssel, Schwanz): J = [x, y, vorne, hinten, ecke] → Umriss; Seiten L (vorn) / R (hinten) */
  H.kette = (J) => {
    const n = J.length, Lp = [], Rp = [];
    for (let i = 0; i < n; i++) {
      const a = J[Math.max(0, i - 1)], b = J[Math.min(n - 1, i + 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1];
      const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
      const p = J[i], e = p[4] || 0;
      Lp.push([p[0] + dy * p[2], p[1] - dx * p[2], e & 1]);
      Rp.push([p[0] - dy * p[3], p[1] + dx * p[3], e & 2]);
    }
    return { L: Lp, R: Rp, J, pts: Lp.concat(Rp.slice().reverse()) };
  };
  /* offene Seitenlinien einer Kette ab Glied i0 */
  H.seiten = (k, i0, i1) => G(k.L.slice(i0, i1).map((p) => [p[0], p[1]]), false) + G(k.R.slice(i0, i1).map((p) => [p[0], p[1]]), false);
  /* Linie quer durch die Kette bei Anteil t (0 = hinten/R, 1 = vorn/L), ab Glied i0 */
  H.laengs = (k, t, i0 = 0, i1) => k.L.slice(i0, i1).map((p, j) => { const q = k.R[i0 + j]; return [q[0] + (p[0] - q[0]) * t, q[1] + (p[1] - q[1]) * t]; });
  /* Zylinder-Schattierung eines Glieds (Licht von links oben): Lichtband hinten-links, Kernschatten vorn-rechts,
     schmales Reflexlicht an der Vorderkante. b = mittlere Breite (cm), st = Stärke */
  H.zyl = (k, i0, b, st = 1, o = {}) => !F ? "" :
    H.wf(H.laengs(k, 0.26, i0), o.licht || "#fff", 0.2 * st, b * 0.13, false, b * 0.32) +
    H.wf(H.laengs(k, 0.8, i0), "#000", 0.3 * st, b * 0.12, false, b * 0.3) +
    H.wf(H.laengs(k, 0.97, i0), o.reflex || "#d8c8b4", 0.16 * st, b * 0.03, false, b * 0.07);
  /* Querfalten-Hilfe */
  H.an = (k, t) => {
    const i = Math.max(0, Math.min(k.L.length - 2, Math.floor(t))), u = t - i;
    const mm = (A) => [A[i][0] + (A[i + 1][0] - A[i][0]) * u, A[i][1] + (A[i + 1][1] - A[i][1]) * u];
    return [mm(k.L), mm(k.R)];
  };
  H.querfalten = (k, t0, t1, dt, a0, a1, bauch) => {
    const z = [];
    for (let t = t0; t < t1; t += dt * (0.7 + T.rnd() * 0.6)) {
      const [p, q] = H.an(k, t), s0 = a0 + T.rnd() * 0.15, s1 = a1 - T.rnd() * 0.25;
      const P = (s) => [p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s + Math.sin(Math.PI * s) * bauch * (0.6 + T.rnd() * 0.8)];
      z.push([P(s0), P((s0 + s1) / 2), P(s1)]);
    }
    return z;
  };
  /* Kerbe (Hautfalte) als spitz zulaufende Linse; Lichtkante darunter-rechts */
  H.kerben = (zuege, w, op, farbe = "#1d150f") => {
    if (!zuege.length) return "";
    if (!F) return H.L(zuege, farbe, w * 0.45, op * 0.8);
    let d = "";
    for (let z of zuege) {
      if (z.length === 2) z = [z[0], [(z[0][0] + z[1][0]) / 2, (z[0][1] + z[1][1]) / 2], z[1]];
      if (z.length === 3) {
        const [a, mi, e] = z, dx = e[0] - a[0], dy = e[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l * w, ny = dx / l * w;
        const c = (s) => [2 * mi[0] - (a[0] + e[0]) / 2 + nx * s, 2 * mi[1] - (a[1] + e[1]) / 2 + ny * s];
        const c1 = c(0.5), c2 = c(-0.5);
        d += `M${f(a[0])} ${f(a[1])}Q${f(c1[0])} ${f(c1[1])} ${f(e[0])} ${f(e[1])}Q${f(c2[0])} ${f(c2[1])} ${f(a[0])} ${f(a[1])}Z`;
        continue;
      }
      const n = z.length;
      d += G(H.kette(z.map((p, i) => { const q = w * (0.12 + 0.88 * Math.sin(Math.PI * i / (n - 1))) / 2; return [p[0], p[1], q, q]; })).pts);
    }
    const id = T.id("kb" + nr++);
    T.def(`<path id="${id}" d="${d}"/>`);
    return `<use href="#${id}" transform="translate(${f(w * 0.55)} ${f(w * 0.75)})" fill="#fff" fill-opacity="${op * 0.22}"/><use href="#${id}" fill="${farbe}" fill-opacity="${op}"/>`;
  };
  /* Hautfalte dreiteilig: weicher Schlagschatten darunter, dunkle Rille, heller Grat darüber */
  H.falte = (zuege, w, op, farbe = "#1d150f") => !zuege.length ? "" :
    (F ? H.wf(zuege.map((z) => G(z.map((p) => [p[0] + w * 0.9, p[1] + w * 1.3]), false)).join(""), "#000", op * 0.45, w * 1.1, false, w * 2.4) +
      H.wf(zuege.map((z) => G(z.map((p) => [p[0] - w * 0.7, p[1] - w * 0.9]), false)).join(""), "#fff", op * 0.35, w * 0.5, false, w * 1.2) : "") +
    H.kerben(zuege, w, op, farbe);
  /* Haare wie T.haare, Koordinaten auf 1 Nachkommastelle */
  H.haare = (...a) => T.haare(...a).replace(/(-?\d+\.\d)\d/g, "$1").replace(/\.0(?=\D)/g, "");
  /* spitz zulaufendes Haar als Fläche (Wurzel b breit, Spitze 0) */
  const haarFl = (x, y, a, l, b, kr) => {
    const ex = x + Math.cos(a) * l, ey = y + Math.sin(a) * l, nx = -Math.sin(a) * b / 2, ny = Math.cos(a) * b / 2;
    const cx = (x + ex) / 2 + nx * kr * 8, cy = (y + ey) / 2 + ny * kr * 8;
    return `M${f(x + nx)} ${f(y + ny)}Q${f(cx + nx * 0.5)} ${f(cy + ny * 0.5)} ${f(ex)} ${f(ey)}Q${f(cx - nx * 0.5)} ${f(cy - ny * 0.5)} ${f(x - nx)} ${f(y - ny)}Z`;
  };
  /* Fell als kachelbares Muster (dichtes Haar für wenig Bytes): Wuchsrichtung winkel (Grad), farben [[farbe, anteil, breite, deckkraft]] */
  H.fellMuster = (name, winkel, farben, o = {}) => {
    const id = T.id("fm" + name);
    if (weichSchon.has(id)) return `url(#${id})`;
    weichSchon.add(id);
    const W = o.tile || 12, n = o.n || 60, len = o.len || 2, kr = o.kr != null ? o.kr : 0.15;
    const summe = farben.reduce((s, x) => s + x[1], 0), eimer = farben.map(() => "");
    for (let i = 0; i < n; i++) {
      const x = T.rnd() * W, y = T.rnd() * W, a = (T.rnd() - 0.5) * (o.streu || 0.35), l = len * (0.6 + T.rnd() * 0.8);
      let u = T.rnd() * summe, j = 0;
      while (j < farben.length - 1 && u > farben[j][1]) { u -= farben[j][1]; j++; }
      const kk = (T.rnd() - 0.5) * kr;
      for (const dx of [-W, 0, W]) for (const dy of [-W, 0, W]) {
        const xx = x + dx, yy = y + dy, ex = xx + Math.cos(a) * l, ey = yy + Math.sin(a) * l;
        if (Math.max(xx, ex) < -0.5 || Math.min(xx, ex) > W + 0.5 || Math.max(yy, ey) < -0.5 || Math.min(yy, ey) > W + 0.5) continue;
        eimer[j] += haarFl(xx, yy, a, l, farben[j][2], kk);
      }
    }
    T.def(`<pattern id="${id}" width="${W}" height="${W}" patternUnits="userSpaceOnUse" patternTransform="rotate(${winkel})">` +
      eimer.map((d, j) => d ? `<path d="${d}" fill="${farben[j][0]}" fill-opacity="${farben[j][3]}"/>` : "").join("") + `</pattern>`);
    return `url(#${id})`;
  };
  /* Rissnetz der Haut als kachelbares Muster: Zellgröße z (cm), Rille w; dunkle Rille + helle Kante unten rechts */
  H.rissMuster = (name, z, w, op, o = {}) => {
    const id = T.id("rm" + name);
    if (weichSchon.has(id)) return `url(#${id})`;
    weichSchon.add(id);
    const N = o.n || 5, W = N * z, s = o.seed || 1, f1 = (v) => String(Math.round(v * 10) / 10);
    const P = (i, j) => { const a = ((i % N) + N) % N, b = ((j % N) + N) % N; return [i * z + (hz(a, b, s) - 0.5) * z * 0.85, j * z * (o.dehn || 1) + (hz(a, b, s + 7) - 0.5) * z * 0.85]; };
    let d = "";
    const kante = (p, q, k) => {
      const mx = (p[0] + q[0]) / 2 + (hz(k, 3, s) - 0.5) * z * 0.42, my = (p[1] + q[1]) / 2 + (hz(k, 5, s) - 0.5) * z * 0.42;
      d += `M${f1(p[0])} ${f1(p[1])}Q${f1(mx)} ${f1(my)} ${f1(q[0])} ${f1(q[1])}`;
    };
    for (let i = -1; i <= N; i++) for (let j = -1; j <= N; j++) {
      const a = ((i % N) + N) % N, b = ((j % N) + N) % N, k = a * 131 + b * 7;
      if (hz(a, b, s + 11) > 0.17) kante(P(i, j), P(i + 1, j), k + 1);
      if (hz(a, b, s + 13) > 0.17) kante(P(i, j), P(i, j + 1), k + 2);
      const dg = hz(a, b, s + 17);
      if (dg < 0.3) kante(P(i, j), P(i + 1, j + 1), k + 3); else if (dg > 0.72) kante(P(i + 1, j), P(i, j + 1), k + 4);
    }
    const H2 = W * (o.dehn || 1);
    T.def(`<pattern id="${id}" width="${f1(W)}" height="${f1(H2)}" patternUnits="userSpaceOnUse"${o.dreh ? ` patternTransform="rotate(${o.dreh})"` : ""}><g fill="none" stroke-linecap="round" stroke-linejoin="round">` +
      `<use href="#${id}p" stroke="#fff" stroke-opacity="${Math.round(op * 45) / 100}" stroke-width="${f1(w * 0.7)}" transform="translate(${f1(w * 0.5)} ${f1(w * 0.6)})"/>` +
      `<g stroke="${o.farbe || "#1a120c"}" stroke-opacity="${op}" stroke-width="${f1(w)}"><path id="${id}p" d="${d}"/></g></g></pattern>`);
    return `url(#${id})`;
  };
  /* abgeleitetes Muster (erbt Inhalt per href): andere Größe/Drehung für wenige Bytes */
  H.muster = (name, basis, transform) => {
    const id = T.id("ma" + name);
    if (!weichSchon.has(id)) { weichSchon.add(id); T.def(`<pattern id="${id}" href="${basis.slice(4, -1)}" patternTransform="${transform}"/>`); }
    return `url(#${id})`;
  };
  /* Haarsaum entlang einer Kontur P (offene Punktliste): n Haare, Wuchsrichtung winkel (Grad oder f(x, y)) */
  H.saum = (P, n, len, winkel, farben, o = {}) => {
    if (!F || !n) return "";
    const seg = []; let tot = 0;
    for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(l); tot += l; }
    const summe = farben.reduce((s, x) => s + x[1], 0), eimer = farben.map(() => "");
    for (let k = 0; k < n; k++) {
      let u = T.rnd() * tot, i = 0;
      while (i < seg.length - 1 && u > seg[i]) { u -= seg[i]; i++; }
      const t = seg[i] ? u / seg[i] : 0, x = P[i][0] + (P[i + 1][0] - P[i][0]) * t, y = P[i][1] + (P[i + 1][1] - P[i][1]) * t;
      const a = ((typeof winkel === "function" ? winkel(x, y) : winkel) + (T.rnd() - 0.5) * (o.streu || 20)) * Math.PI / 180;
      const l = len * (0.5 + T.rnd() * 0.9);
      let v = T.rnd() * summe, j = 0;
      while (j < farben.length - 1 && v > farben[j][1]) { v -= farben[j][1]; j++; }
      eimer[j] += haarFl(x - Math.cos(a) * l * 0.45, y - Math.sin(a) * l * 0.45, a, l, farben[j][2], (T.rnd() - 0.5) * 0.2);
    }
    return eimer.map((d, j) => d ? `<path d="${d}" fill="${farben[j][0]}" fill-opacity="${farben[j][3]}"/>` : "").join("");
  };
  /* Büschel (Quaste, Mähne, Bart): n Strähnen von Wurzelpunkten W (Liste) in Richtung winkel, Länge len */
  H.straehnen = (wurzeln, n, len, winkel, farben, o = {}) => {
    const summe = farben.reduce((s, x) => s + x[1], 0), eimer = farben.map(() => "");
    const N = F ? n : Math.ceil(n * (o.szene || 0.3));
    for (let k = 0; k < N; k++) {
      const t = T.rnd() * (wurzeln.length - 1), i = Math.min(wurzeln.length - 2, Math.floor(t)), v = t - i;
      const x = wurzeln[i][0] + (wurzeln[i + 1][0] - wurzeln[i][0]) * v, y = wurzeln[i][1] + (wurzeln[i + 1][1] - wurzeln[i][1]) * v;
      const w0 = (typeof winkel === "function" ? winkel(x, y, t / (wurzeln.length - 1)) : winkel);
      const a = (w0 + (T.rnd() - 0.5) * (o.streu || 14)) * Math.PI / 180, l = (typeof len === "function" ? len(t / (wurzeln.length - 1)) : len) * (0.6 + T.rnd() * 0.6);
      const welle = (T.rnd() - 0.5) * (o.welle || 0.3) * l;
      const ex = x + Math.cos(a) * l, ey = y + Math.sin(a) * l, nx = -Math.sin(a), ny = Math.cos(a);
      let j = 0, q = T.rnd() * summe;
      while (j < farben.length - 1 && q > farben[j][1]) { q -= farben[j][1]; j++; }
      const b = farben[j][2] / 2;
      const c1x = x + Math.cos(a) * l * 0.35 + nx * welle, c1y = y + Math.sin(a) * l * 0.35 + ny * welle;
      const c2x = x + Math.cos(a) * l * 0.7 - nx * welle, c2y = y + Math.sin(a) * l * 0.7 - ny * welle;
      eimer[j] += `M${f(x + nx * b)} ${f(y + ny * b)}C${f(c1x + nx * b)} ${f(c1y + ny * b)} ${f(c2x + nx * b * 0.4)} ${f(c2y + ny * b * 0.4)} ${f(ex)} ${f(ey)}C${f(c2x - nx * b * 0.4)} ${f(c2y - ny * b * 0.4)} ${f(c1x - nx * b)} ${f(c1y - ny * b)} ${f(x - nx * b)} ${f(y - ny * b)}Z`;
    }
    return eimer.map((d, j) => d ? `<path d="${d}" fill="${farben[j][0]}" fill-opacity="${farben[j][3]}"/>` : "").join("");
  };
  /* Auge (Seitenansicht, Blick nach rechts): Augenhöhle mit Brauenwulst und Schlagschatten, Lidhaut, gewölbter Augapfel,
     Iris mit Fasern und dunklem Rand, artgerechte Pupille, Himmelsreflex, Fensterglanz + Zweitreflex, dicker Oberlidwulst,
     feuchter Unterlidrand, dunkle Bindehautfalte vorn, natürliche Wimpern (nach vorn-unten hängend, unregelmäßig).
     (T.augeReal als Vorbild – eigene Fassung, weil die Wimpern dort als Kamm stehen.) */
  H.auge = (x, y, r, o = {}) => {
    const off = o.offen != null ? o.offen : 0.7, W = r * 1.32, Ho = r * off, Hu = Ho * 0.72;
    const id = T.id("ag" + nr++);
    const spalt = `M${f(-W)} 0C${f(-W * 0.5)} ${f(-Ho * 1.15)} ${f(W * 0.45)} ${f(-Ho * 1.2)} ${f(W)} ${f(-Ho * 0.1)}C${f(W * 0.5)} ${f(Hu * 1.1)} ${f(-W * 0.4)} ${f(Hu * 1.15)} ${f(-W)} 0Z`;
    T.def(`<clipPath id="${id}"><path d="${spalt}"/></clipPath>`);
    const bez = (t, p0, p1, p2, p3) => { const u = 1 - t; return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]; };
    const ob = (t) => bez(t, [-W, 0], [-W * 0.5, -Ho * 1.15], [W * 0.45, -Ho * 1.2], [W, -Ho * 0.1]);
    const un = (t) => bez(t, [W, -Ho * 0.1], [W * 0.5, Hu * 1.1], [-W * 0.4, Hu * 1.15], [-W, 0]);
    const iris = T.rg("ir" + (o.iris || "#3a2212").slice(1), [[0, o.iris2 || "#120804"], [0.28, o.iris2 || "#120804"], [0.32, o.iris || "#3a2212"], [0.8, o.iris || "#3a2212"], [1, "#0a0503"]], 0.5, 0.5, 0.5);
    let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${o.winkel || 0})">`;
    /* Augenhöhle: weiche Mulde, Brauenwulst mit Licht, sein Schatten fällt aufs Oberlid */
    s += H.wf([[-W * 1.9, r * 0.2], [-W * 1.2, -r * 1.5], [W * 0.4, -r * 1.75], [W * 1.8, -r * 0.7], [W * 1.4, r * 1.1], [-W * 0.6, r * 1.3]], o.hoehle || "#000", o.hoehleA != null ? o.hoehleA : 0.2, r * 0.45);
    s += H.wf([[-W * 1.5, -r * 1.2], [-W * 0.2, -r * 2.05], [W * 1.4, -r * 1.35]], "#fff", 0.22, r * 0.22, false, r * 0.5);
    s += H.wf([[-W * 1.15, -r * 0.8], [0, -r * 1.35], [W * 1.15, -r * 0.6]], "#000", 0.35, r * 0.18, false, r * 0.45);
    /* Lidhaut, Spalt, Augapfel */
    s += `<path d="${spalt}" transform="scale(1.2 1.32)" fill="${o.lidHaut || "#2a1f18"}"/>`;
    s += `<path d="${spalt}" fill="#0b0705"/><g clip-path="url(#${id})">`;
    s += `<circle cx="${f(r * 0.12)}" cy="0" r="${f(r * 0.95)}" fill="${iris}"/>`;
    if (F) {
      let fa = "";
      for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2 + T.rnd() * 0.15; fa += `M${f(r * 0.12 + Math.cos(a) * r * 0.36)} ${f(Math.sin(a) * r * 0.36)}L${f(r * 0.12 + Math.cos(a) * r * 0.86)} ${f(Math.sin(a) * r * 0.86)}`; }
      s += `<path d="${fa}" stroke="${o.faser || "#6b4428"}" stroke-width="${f(Math.max(0.05, r * 0.035))}" stroke-opacity=".35" fill="none"/>`;
    }
    const p = o.pupille || "quer";
    if (p === "quer") s += `<rect x="${f(r * 0.12 - r * 0.55)}" y="${f(-r * 0.22)}" width="${f(r * 1.1)}" height="${f(r * 0.44)}" rx="${f(r * 0.2)}" fill="#050302" opacity=".85"/>`;
    else s += `<circle cx="${f(r * 0.14)}" cy="0" r="${f(r * 0.4)}" fill="#050302" opacity=".85"/>`;
    /* Himmelsreflex oben, Lidschatten, Glanz */
    s += `<ellipse cx="${f(r * 0.1)}" cy="${f(-r * 0.45)}" rx="${f(r * 0.9)}" ry="${f(r * 0.38)}" fill="#9aa6b0" opacity=".22"/>`;
    s += `<rect x="${f(-W)}" y="${f(-r * 1.2)}" width="${f(2 * W)}" height="${f(r * 1.25)}" fill="${T.lg("lidsch", [[0, "#000", 0.85], [0.55, "#000", 0.25], [1, "#000", 0]])}"/>`;
    s += `<rect x="${f(r * 0.28)}" y="${f(-r * 0.55)}" width="${f(r * 0.32)}" height="${f(r * 0.24)}" rx="${f(r * 0.08)}" fill="#fff" opacity=".88"/>`;
    s += `<ellipse cx="${f(-r * 0.3)}" cy="${f(r * 0.36)}" rx="${f(r * 0.16)}" ry="${f(r * 0.07)}" fill="#cfd8de" opacity=".35"/></g>`;
    /* Oberlidwulst (dick), Lidfalte darüber, Unterlid mit feuchtem Rand, Bindehautfalte vorn (dunkel) */
    const obP = [0, 0.15, 0.32, 0.5, 0.68, 0.85, 1].map(ob);
    s += `<path d="M${f(-W)} 0C${f(-W * 0.5)} ${f(-Ho * 1.15)} ${f(W * 0.45)} ${f(-Ho * 1.2)} ${f(W)} ${f(-Ho * 0.1)}" fill="none" stroke="${o.lid || "#120a06"}" stroke-width="${f(r * 0.26)}" stroke-linecap="round"/>`;
    s += H.L([obP.map((q) => [q[0] * 1.02, q[1] - r * 0.24 - Math.abs(q[0]) * 0.02])], o.lidLicht || "#8a7a6a", Math.max(0.05, r * 0.07), 0.5);
    s += H.L([obP.slice(1, 6).map((q) => [q[0] * 1.08, q[1] * 1.55 - r * 0.42])], "#000", Math.max(0.05, r * 0.06), 0.45);
    s += `<path d="M${f(W)} ${f(-Ho * 0.1)}C${f(W * 0.5)} ${f(Hu * 1.1)} ${f(-W * 0.4)} ${f(Hu * 1.15)} ${f(-W)} 0" fill="none" stroke="${o.lid || "#120a06"}" stroke-width="${f(r * 0.1)}"/>`;
    s += H.L([[0.15, 0.4, 0.65, 0.85].map(un).map((q) => [q[0], q[1] + r * 0.09])], o.feucht || "#c9b0a0", Math.max(0.05, r * 0.05), 0.55);
    s += `<path d="M${f(W * 0.82)} ${f(-Ho * 0.35)}Q${f(W * 1.12)} ${f(-Ho * 0.08)} ${f(W * 0.85)} ${f(Hu * 0.25)}" fill="none" stroke="#1a0d0a" stroke-width="${f(r * 0.12)}" stroke-linecap="round"/>`;
    /* Wimpern: aus dem Oberlid, nach vorn-außen, Spitzen nach unten gebogen, unregelmäßig, gruppiert */
    const nw = F ? (o.wimpern || 0) : Math.round((o.wimpern || 0) * 0.3);
    if (nw) {
      let d = "";
      for (let i = 0; i < nw; i++) {
        const t = 0.22 + 0.74 * (i / Math.max(1, nw - 1)) + (T.rnd() - 0.5) * 0.06, q = ob(Math.min(0.98, t));
        const L = r * (o.wl || 1.2) * (0.45 + 0.55 * Math.sin(Math.PI * Math.min(1, t * 1.1)) + (T.rnd() - 0.5) * 0.35);
        const a = (-70 + 62 * t + (T.rnd() - 0.5) * 14) * Math.PI / 180;
        const ex = q[0] + Math.cos(a) * L, ey = q[1] - r * 0.1 + Math.sin(a) * L + L * 0.3;
        const cx = q[0] + Math.cos(a) * L * 0.6, cy = q[1] - r * 0.1 + Math.sin(a) * L * 0.6 - L * 0.08;
        const b = r * 0.05;
        d += `M${f(q[0] - b)} ${f(q[1] - r * 0.1)}Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}Q${f(cx + b)} ${f(cy + b * 0.5)} ${f(q[0] + b)} ${f(q[1] - r * 0.1)}Z`;
      }
      s += `<path d="${d}" fill="${o.wimpernFarbe || "#2b211b"}" fill-opacity=".9"/>`;
    }
    return s + "</g>";
  };
  /* Huf (Paarhufer: zwei Klauen; Einhufer: eine Wand): x = Kronrand-Mitte, h = Höhe, lv/lh = halbe Breite vorn/hinten.
     Kronrand mit Haarsaum, Hornrillen, Glanz an der Lichtseite, Zehe rund, Ballen hinten. */
  H.huf = (x, h, lv, lh, farbe, spalt, o = {}) => {
    const sp = h * (o.schraeg || 0.55);
    const p = [[x - lh * 0.95, -h, 1], [x + lv * 0.7, -h * 1.02], [x + lv + sp * 0.8, -h * 0.35], [x + lv + sp, -h * 0.08], [x + lv + sp * 0.85, 0, 1], [x - lh * 1.05, 0, 1], [x - lh * 1.18, -h * 0.35], [x - lh * 1.1, -h * 0.7]];
    const hg = T.lg("hufl", [[0, "#fff", 0.2], [0.35, "#fff", 0], [1, "#000", 0.3]], 0, 0, 1, 0);
    let s = "";
    if (spalt) s += H.teil(p.map((q) => [q[0] + h * 0.18, q[1] - h * 0.03, q[2]]), o.fern || "#0f0c0a", { ov: [hg], randA: 0 });
    const rillen = [];
    if (F) for (let k = 1; k <= 3; k++) { const t = k / 4; rillen.push([[x - lh * 0.95 + (lv * 1.65 + lh * 0.95) * t, -h * 0.98], [x - lh * 1.05 + (lv + sp * 0.85 + lh * 1.05) * t + sp * 0.3, -h * 0.05]]); }
    s += H.teil(p, farbe, { ov: [hg],
      innen: H.L(rillen, "#000", h * 0.05, 0.25) + (spalt ? H.L([[[x + lv * 0.2, -h * 0.98], [x + lv * 0.5 + sp * 0.5, -h * 0.45], [x + lv * 0.75 + sp * 0.7, -h * 0.02]]], "#000", h * 0.07, 0.6) : "") +
        H.L([[[x + lv * 0.75, -h * 0.9], [x + lv + sp * 0.75, -h * 0.25]]], "#fff", h * 0.07, 0.3) });
    /* Kronrand: heller Haarsaum */
    s += H.L([[[x - lh * 1.0, -h * 1.0], [x, -h * 1.08], [x + lv * 0.8, -h * 1.02]]], o.saum || "#d8c8a6", h * 0.12, 0.55);
    return s;
  };
  /* Punkt in Vieleck */
  H.drin = (poly, x, y) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  /* alte Helfer (Kompatibilität) */
  H.kontakt = () => "";
  H.runzeln = (n, x0, y0, x1, y1, len, farbe, w, op) => {
    let d = "";
    for (let i = 0; i < n; i++) {
      const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
      const a = (T.rnd() - 0.5) * 1.2, l = len * (0.5 + T.rnd());
      d += `M${f(x)} ${f(y)}l${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)}l${f(Math.cos(a + 0.9) * l * 0.6)} ${f(Math.sin(a + 0.9) * l * 0.6)}`;
    }
    return `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  H.risse = (n, poly, len, winkel, w, op, farbe = "#1d150f") => {
    let d = "";
    const [x0, y0, x1, y1] = T.box(poly);
    for (let i = 0, v = 0; i < n && v < n * 8; v++) {
      const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
      if (!H.drin(poly, x, y)) continue;
      i++;
      let a = (typeof winkel === "function" ? winkel(x, y) : winkel) * Math.PI / 180 + (T.rnd() - 0.5) * 0.8;
      d += `M${f(x)} ${f(y)}`;
      const mm = 2 + Math.floor(T.rnd() * 3);
      for (let j = 0; j < mm; j++) { const l = len * (0.35 + T.rnd() * 0.65); a += (T.rnd() - 0.5) * 1.3; d += `l${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)}`; }
    }
    return `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  return H;
}

/* =====================================================================
   ELEFANT
   ===================================================================== */
/* RECHERCHE Elefant (Afrikanischer Steppenelefant, Loxodonta africana):
   Bulle Schulterhöhe ~3,2 m (Kuh ~2,6 m), Kopf-Rumpf 6–7,5 m inkl. Rüssel. Höchster Punkt ist die Schulter,
   der Rücken ist deutlich eingesenkt (konkav), Kruppe fällt ab. Ohren riesig (bis 2 × 1,5 m), Umriss wie die
   Landkarte Afrikas, oben am Kopf breit, unten in einen Zipfel auslaufend; sie bedecken Hals und Schulter.
   Rüssel geringelt, an der Spitze ZWEI Finger (Asiat: einer). Stoßzähne bei Bulle und Kuh. Säulenbeine:
   Ellbogen auf Bauchhöhe, Vorderfußwurzel („Knie“) tief, Hinterknie tief an der Vorderseite, Fuß rund mit
   Nägeln (vorn 4–5, hinten 3–4). Haut graubraun, faltig/rissig, Schwanz mit Haarquaste. */
function elefant(T) {
  const H = mach(T, 0, 1.1), { teil, L, kette, kerben, falte, querfalten, G, wf, zyl } = H, F = H.F, US = H.US;
  /* EINE Hautfarbe (Benutzerraum) für Rumpf, nahe Beine, Kopf: keine Nähte. Unten warmer Staub. */
  const haut = T.lg("haut", [[0, "#988d80"], [0.45, "#837a6e"], [0.62, "#786e62"], [0.8, "#6f6457"], [1, "#6a5c4b"]], 0, -340, 0, 0, US);
  const fern = T.lg("fern", [[0, "#6a6156"], [0.6, "#5d554b"], [1, "#55493c"]], 0, -300, 0, 0, US);
  /* Licht auf dem Rumpf: Glanz oben, Kernschatten im unteren Drittel, warmes Bodenreflexlicht ganz unten */
  const licht = T.lg("licht", [[0, "#fff", 0.2], [0.28, "#fff", 0.04], [0.5, "#000", 0.02], [0.68, "#000", 0.16], [0.86, "#000", 0.28], [1, "#000", 0.12]], 0, -336, 0, -136, US);
  const lichtK = T.lg("lichtk", [[0, "#fff", 0.18], [0.25, "#fff", 0], [0.6, "#000", 0.05], [1, "#000", 0.12]]);
  const lichtX = T.lg("lichtx", [[0, "#fff", 0.07], [0.45, "#fff", 0], [1, "#000", 0.12]], 0, 0, 1, 0);
  const staub = T.lg("staub", [[0, "#3a2c1c", 0], [0.55, "#3a2c1c", 0.1], [1, "#2e2216", 0.3]], 0, -95, 0, 0, US);
  const R = "#1f160e";
  /* Rissnetz statt Rauschen: Rumpf grob und schwach, Beine/Rüssel/Gesicht fein und kräftiger, Ohr fast glatt */
  const basis = F ? H.rissMuster("r", 4, 0.42, 0.55, { n: 8, seed: 3 }) : "";
  const rissR = F ? [[basis, 0.34], [H.muster("r2", basis, "rotate(27) scale(1.4)"), 0.16]] : [];
  const rissB = F ? [[H.muster("b", basis, "scale(.6 .48)"), 0.8], [H.muster("b2", basis, "rotate(-24) scale(.8 .6)"), 0.3]] : [];
  const rissK = F ? [[H.muster("k", basis, "scale(.42)"), 0.75], [H.muster("k2", basis, "rotate(40) scale(.6)"), 0.25]] : [];
  const rissO = F ? [[H.muster("o", basis, "rotate(70) scale(.8 1.2)"), 0.18]] : [];
  /* Fußnägel: flach (Breite : Höhe 1,6 : 1), glatt, grau-elfenbein mit Schmutz und Glanz */
  const naegel = (xv, xh, n) => {
    let d = "", gl = "";
    for (let i = 0; i < n; i++) {
      const x = xv - 10 - i * (xv - xh) * 0.24, w = 7 - i * 0.5, h = w * 1.25;
      d += `M${H.f(x - w)} -2.5Q${H.f(x - w)} ${H.f(-h * 0.85)} ${H.f(x)} ${H.f(-h)} ${H.f(x + w)} ${H.f(-h * 0.85)} ${H.f(x + w)} -2.5Q${H.f(x)} -1.2 ${H.f(x - w)} -2.5Z`;
      gl += `M${H.f(x - w * 0.6)} ${H.f(-h * 0.7)}Q${H.f(x - w * 0.1)} ${H.f(-h * 0.92)} ${H.f(x + w * 0.4)} ${H.f(-h * 0.8)}`;
    }
    return `<path d="${d}" fill="${T.lg("nagel", [[0, "#998e7a"], [0.7, "#82765f"], [1, "#655845"]])}"/>` + (F ? `<path d="${gl}" fill="none" stroke="#e6dccb" stroke-width=".8" stroke-opacity=".35" stroke-linecap="round"/>` : "");
  };
  /* Stoßzähne: gleichmäßiger Bogen nach vorn-oben, Spitze stumpf abgenutzt; Wurzel ocker verfärbt, zur Spitze Elfenbein */
  const zahn = (dx, dy, q, dunkel) => {
    const z = kette([[398 + dx, -194 + dy, 10.8 * q, 10.8 * q], [424 + dx, -172 + dy, 10 * q, 10 * q], [452 + dx, -159 + dy, 8.4 * q, 8.4 * q], [480 + dx, -160 + dy, 6.6 * q, 6.6 * q], [502 + dx, -172 + dy, 4.6 * q, 4.6 * q], [513 + dx, -188 + dy, 2.6 * q, 2.6 * q], [515 + dx, -194 + dy, 1.4, 1.4]]);
    const farbe = T.lg("elf" + (dunkel ? "d" : ""), dunkel ? [[0, "#5b4a33"], [0.35, "#857455"], [1, "#a99c80"]] : [[0, "#7e6440"], [0.22, "#a68a5c"], [0.42, "#d9cba8"], [1, "#f6efdf"]], 398 + dx, -194 + dy, 515 + dx, -194 + dy, US);
    return teil(z.pts, farbe, {
      ov: [T.lg("zv", [[0, "#fff", 0.3], [0.32, "#fff", 0], [0.6, "#000", 0.1], [1, "#000", 0.35]])],
      innen: F ? L([[[414 + dx, -183 + dy], [442 + dx, -166 + dy], [474 + dx, -163 + dy], [498 + dx, -172 + dy]], [[420 + dx, -176 + dy], [452 + dx, -161 + dy], [482 + dx, -164 + dy]], [[416 + dx, -188 + dy], [446 + dx, -172 + dy], [478 + dx, -170 + dy], [503 + dx, -180 + dy]]], "#6a5636", 0.4, 0.3) +
        L([[[420 + dx, -186 + dy], [450 + dx, -170.5 + dy], [482 + dx, -168.5 + dy], [505 + dx, -180 + dy]]], "#fff", 1.3, dunkel ? 0.2 : 0.55) : "",
    });
  };
  let s = zahn(-16, -6, 0.86, 1), k = "";
  /* ferne Beine: im Körperton, gut 20 % dunkler, modelliert, zur Hälfte vom nahen Bein verdeckt */
  const beinF = (J) => {
    const kk = kette(J), m = J.length - 1;
    return teil(kk.pts, fern, {
      fell: rissB, rim: 10,
      innen: zyl(kk, 1, 62, 0.8) + falte(querfalten(kk, 3.1, 4.2, 0.2, 0.15, 0.85, 3), 2.6, 0.3) +
        wf([[kk.R[1][0] - 5, -150], [J[1][0], -142], [kk.L[1][0] + 5, -150]], "#000", 0.45, 8, false, 30) + `<rect x="${H.f(kk.R[m][0] - 5)}" y="-95" width="90" height="95" fill="${staub}"/>`,
    }) + naegel(kk.L[m][0], kk.R[m][0], 2);
  };
  k += beinF([[284, -250, 38, 38], [284, -175, 36, 34], [286, -122, 29, 28], [287, -82, 25.5, 25], [287, -62, 27, 26.5], [288, -30, 29.5, 28.5], [289, -11, 33, 31.5], [289, 0, 34.5, 33, 3]]);
  k += beinF([[112, -240, 44, 42], [118, -170, 38, 36], [116, -122, 30, 33], [110, -98, 27, 35, 2], [107, -74, 26, 27.5], [106, -32, 27.5, 27], [106, -11, 30.5, 29.5], [106, 0, 32, 30.5, 3]]);
  /* Rumpf: Schulter (Widerrist) am höchsten, Sattel, Kruppe tiefer; Bauch hinter dem Vorderbein am tiefsten, zur Flanke ansteigend */
  const rumpf = [[24, -262], [40, -292], [76, -314], [118, -318], [165, -305], [210, -315], [244, -331], [268, -336], [300, -330], [336, -310],
    [350, -262], [351, -212], [341, -172], [318, -148], [290, -142], [274, -136], [254, -140], [232, -143], [196, -150], [158, -160], [128, -168], [96, -172], [58, -176], [30, -192], [14, -220], [12, -244]];
  /* Ohr: Umriss wie Afrika – oben breit, hinten Ausbuchtung mit Golf und Kerben, unten ein nach vorn zeigender Lappen */
  const ohr = [[356, -326], [322, -334], [286, -334], [256, -327], [238, -309], [228, -284], [231, -262], [238, -254], [236, -246], [244, -229], [241, -222], [252, -205],
    [266, -184], [281, -168], [294, -153], [305, -145], [313, -150], [326, -166], [341, -186], [357, -214], [367, -246], [369, -286], [364, -314]];
  const ohrD = G(ohr);
  const ohrSchatten = F ? `<path d="${ohrD}" transform="translate(11 12)" fill="#000" opacity=".3" filter="${H.weich(6)}"/>` : "";
  k += teil(rumpf, haut, {
    fell: rissR, ov: [licht, lichtX], rim: 30,
    innen: /* Rückenlicht, große Hängefalten hinter der Schulter und vor der Flanke als weiche Volumen */
      wf([[40, -286], [78, -308], [118, -312], [165, -299], [210, -309], [244, -324], [268, -329], [300, -324]], "#fff", 0.2, 6, false) +
      wf([[226, -300], [220, -250], [226, -196], [240, -162]], "#000", 0.22, 8, false) + wf([[238, -296], [234, -250], [240, -200]], "#fff", 0.1, 6, false) +
      wf([[156, -290], [148, -240], [150, -184]], "#000", 0.16, 9, false) + wf([[168, -286], [162, -240], [164, -190]], "#fff", 0.08, 7, false) +
      wf([[290, -150], [240, -150], [196, -158], [158, -168]], "#d9c7aa", 0.16, 2.2, false) +
      kerben([[[230, -248], [226, -206], [234, -170]], [[150, -228], [146, -196], [150, -170]]], 3.4, 0.22) +
      ohrSchatten + wf([[300, -160], [282, -150], [268, -150]], "#000", 0.4, 6, false) + wf([[32, -262], [24, -220], [20, -190]], "#000", 0.3, 3, false, 8),
  });
  /* Schwanz: tiefer an der Kruppenrundung, Wurzel dick, Ende eine flache Doppelreihe drahtiger Haare (bis zur Ferse) */
  const sk = kette([[40, -266, 7, 7], [26, -246, 6, 6], [16, -210, 4.2, 4.2], [10, -170, 3, 3], [7, -132, 2.3, 2.3]]);
  const sw = [[6, -132], [6.5, -126]];
  k += teil(sk.pts, haut, { fell: rissB, ov: [lichtX], rim: 3, innen: wf([[26, -262], [14, -200], [8, -140]], "#fff", 0.15, 1.5, false) }) +
    H.straehnen(sw, 13, 30, (x, y, t) => 88 + (t - 0.5) * 30, [["#16110d", 3, 1.2, 0.95], ["#3d342c", 1, 1, 0.9]], { streu: 16, welle: 0.08, szene: 0.5 });
  /* nahe Beine über dem Rumpf (gleiche Hautfarbe): oben unsichtbar, Kante erst ab dem Bauch; Gelenke ausgeformt */
  const beinN = (J, i0, mod, n) => {
    const kk = kette(J), m = J.length - 1;
    return teil(kk.pts, haut, {
      fell: rissB,
      ov: [licht], innen: mod + zyl(kk, i0, 64) + `<rect x="${H.f(kk.R[m][0] - 5)}" y="-95" width="90" height="95" fill="${staub}"/>` +
        falte(querfalten(kk, 3.2, 4.3, 0.17, 0.12, 0.88, 3.4), 2.8, 0.34) + falte(querfalten(kk, m - 1.6, m - 0.8, 0.3, 0.2, 0.8, 2.5), 2.4, 0.24) +
        `<path d="M${H.f(kk.L[m][0] + 1)} -3L${H.f(kk.R[m][0] - 1)} -3" stroke="#241b13" stroke-width="5" stroke-opacity=".45"/>`,
      oben: F ? `<path d="${H.seiten(kk, i0)}" fill="none" stroke="${H.RIM()}" stroke-width="14" filter="${H.weich(3)}"/>` : "",
      randD: H.seiten(kk, i0),
    }) + naegel(kk.L[m][0], kk.R[m][0], n);
  };
  /* Hinterbein: Oberschenkel geht in die Kruppe über, Knie vorn auf Höhe der Flanke, Ferse hinten bei ~30 % Höhe */
  k += beinN([[84, -270, 16, 52], [92, -205, 40, 50], [100, -160, 42, 40], [92, -124, 32, 35], [84, -100, 28.5, 39, 2], [77, -76, 27, 29], [73, -34, 28.5, 28.5], [71, -12, 32, 31], [70, 0, 34, 32.5, 3]], 2,
    wf([[50, -250], [78, -268], [104, -252]], "#fff", 0.16, 9, false) + wf([[138, -170], [126, -196], [108, -232]], "#000", 0.22, 6, false) +
    falte([[[142, -160], [132, -190], [114, -226], [94, -262]], [[134, -146], [140, -158]]], 3, 0.32) + wf([[50, -102], [44, -88]], "#000", 0.22, 3, false), 2);
  /* Vorderbein: Ellbogen als Wulst hinten knapp über der Bauchlinie, Unterarm gerade, Handgelenk mit Taille, Fuß breit */
  k += beinN([[310, -290, 40, 44], [310, -215, 44, 46], [311, -165, 38, 46], [312, -132, 32, 33], [313, -104, 29.5, 28.5], [314, -82, 27, 26.5], [314, -64, 28.5, 28], [315, -32, 31.5, 30.5], [316, -12, 35.5, 34], [316, 0, 37, 35, 3]], 2,
    wf([[278, -270], [306, -280], [334, -266]], "#fff", 0.14, 9, false) + wf([[268, -162], [264, -190]], "#000", 0.25, 6, false) +
    wf([[262, -166], [270, -152], [282, -150]], "#fff", 0.12, 3, false) + falte([[[264, -150], [258, -190], [266, -240], [280, -280]]], 3, 0.3), 3);
  /* Kopf und Rüssel in einem Umriss (Scheitel unter dem Widerrist), Rüssel mit leichter S-Kurve, unten schlanker */
  const kopf = [[300, -322], [326, -330], [350, -328], [378, -318], [402, -298], [418, -272], [428, -242], [434, -205], [438, -160], [440, -112], [438, -72], [439, -46], [444, -28], [451, -18], [459, -13], [465, -10.5], [466, -8], [461, -7.5], [458, -6.5],
    [459, -4], [455, -3], [449, -5], [442, -10], [434, -26], [428, -60], [426, -100], [422, -145], [414, -182], [404, -196], [396, -186], [384, -180], [362, -192], [338, -212], [318, -248]];
  const rk = kette([[419, -240, 15, 24], [424, -200, 14, 20], [428, -155, 11.5, 12.5], [431, -108, 9, 9.5], [432, -68, 7, 7], [436, -38, 6, 6], [444, -18, 5.5, 5.5], [455, -8, 4.5, 4.5]]);
  k += teil(kopf, haut, {
    fell: rissK, ov: [lichtK, lichtX], rim: 22, rimD: G(kopf.slice(2, 22), false),
    innen: wf([[350, -320], [384, -310], [404, -292]], "#fff", 0.22, 6, false) + wf([[424, -150], [428, -100], [430, -60]], "#fff", 0.12, 3, false) +
      wf([[438, -170], [438, -110], [436, -70]], "#000", 0.22, 3, false) +
      /* Schläfengrube mit Schläfendrüse und dunklem Sekretstreif (Bulle) */
      wf([[356, -268], [372, -262], [374, -236], [360, -226], [350, -242]], "#000", 0.2, 5) + `<ellipse cx="362" cy="-242" rx="2.2" ry="1.6" fill="#1a120b" opacity=".7"/>` +
      wf([[362, -240], [360, -226], [357, -206]], "#140d08", 0.55, 1.4, false) +
      /* Rüsselfalten: unregelmäßig, nicht über die ganze Breite, innen an der Biegung dichter */
      kerben(querfalten(rk, 0.25, 6.6, 0.11, 0.02, 0.8, 2.4).concat(querfalten(rk, 0.4, 6.4, 0.2, 0.3, 0.98, 2)), 2.2, 0.42) +
      /* Krähenfüße um das Auge, Falten der Stirn und Wange */
      falte([[[372, -252], [366, -248]], [[372, -260], [365, -262]], [[402, -262], [410, -266]], [[400, -252], [408, -250]], [[380, -246], [386, -243]], [[394, -244], [401, -247]],
        [[398, -306], [410, -286], [420, -264]], [[378, -228], [392, -216], [402, -202]], [[348, -296], [356, -276]]], 2.4, 0.3) +
      wf([[396, -196], [414, -184]], "#000", 0.3, 4, false),
  });
  /* Rüsselspitze: leicht eingerollt, zwei Finger (oben und unten), Nasenlöcher */
  k += `<path d="M456.5 -8.2Q459.5 -9.6 462 -8.4Q459 -6.6 456.5 -8.2Z" fill="#140d08" opacity=".85"/>` + L([[[449, -6], [454, -6.8], [458, -6.4]]], "#140d08", 0.6, 0.5);
  /* Unterlippe: kurz, rund, grau, im Schatten unter dem Rüsselansatz */
  k += teil([[377, -186], [386, -188], [393, -183], [390, -177], [384, -175], [378, -178]], "#5d5148", { rim: 3, innen: wf([[377, -185], [388, -186]], "#fff", 0.12, 1.2, false) + wf([[376, -176], [390, -176]], "#000", 0.3, 1.4, false) });
  s += k;
  /* naher Stoßzahn, darüber die röhrenförmige Zahnscheide (wächst bündig aus der Wange, konisch, mit Ringfalten) */
  s += zahn(0, 0, 1);
  /* Zahnscheide: kurzer Hautkragen, wo der Zahn aus der Wange tritt (dicht am Zahn, mit Ringfalte) */
  const schP = [[384, -214], [400, -208], [412, -199], [417, -190], [412, -181], [400, -176], [390, -182], [382, -197]];
  s += teil(schP, haut, { fell: rissK, ov: [lichtK, lichtX], rim: 5, rimD: G(schP.slice(2, 7), false),
    innen: wf([[388, -184], [400, -179], [410, -182]], "#000", 0.35, 2, false) + wf([[394, -207], [404, -202], [412, -196]], "#fff", 0.08, 1.6, false) +
      falte([[[398, -206], [402, -196], [400, -184]]], 1.2, 0.28) + wf([[414, -197], [417, -189], [411, -181]], "#fff", 0.18, 0.8, false) });
  s += L([[[413, -198], [417.5, -189.5], [411.5, -180.5], [401, -176]]], "#140d08", 1.1, 0.6);
  /* Auge: tief in der Höhle, schwerer Oberlidwulst, lange Wimpern hängen nach vorn-unten */
  s += H.auge(388, -256, 3, { iris: "#6a3f1a", iris2: "#1c0e06", offen: 0.55, pupille: "rund", wimpern: 12, wl: 2.4, lid: "#21180f", lidHaut: "#3a3027", hoehleA: 0.3, winkel: 8, feucht: "#b7867a", wimpernFarbe: "#3a332c" });
  /* Ohr: Rand oben und vorn als gerollter Wulst (heller Streif, darunter dunkler Saum), Adern, fast glatte Haut */
  const ohrG = T.lg("ohr", [[0, "#a49a8d"], [0.45, "#8c8275"], [1, "#665c50"]], 0, 0, 1, 0.7);
  const adern = [[[352, -300], [330, -284], [304, -276], [282, -262], [262, -246]], [[330, -284], [318, -258], [310, -230], [300, -200]], [[304, -276], [290, -300], [272, -306]],
    [[318, -258], [296, -244], [276, -226]], [[310, -230], [326, -210], [334, -192]]];
  const o = teil(ohr, ohrG, {
    fell: rissO, rim: 20,
    innen: wf([[352, -250], [356, -210], [346, -190]], "#000", 0.25, 8, false) + wf([[266, -292], [300, -300], [330, -296]], "#fff", 0.18, 10, false) +
      wf([[260, -190], [282, -170], [300, -158]], "#000", 0.35, 6, false) +
      wf(adern.map((z) => G(z.map((p) => [p[0] - 0.8, p[1] - 0.8]), false)).join(""), "#fff", 0.08, 0.75, false, 2) + wf(adern.map((z) => G(z.map((p) => [p[0] + 0.9, p[1] + 1]), false)).join(""), "#000", 0.09, 0.75, false, 1.8) +
      wf([[300, -290], [284, -262], [278, -230]], "#000", 0.1, 2, false) + wf([[302, -292], [287, -263], [281, -231]], "#fff", 0.08, 1.5, false) + wf([[340, -270], [338, -236], [330, -204]], "#000", 0.1, 2, false) +
      /* gerollter Rand oben/vorn */
      wf([[358, -322], [322, -330], [286, -330], [258, -323], [242, -309]], "#fff", 0.3, 1.4, false, 7) + wf([[356, -315], [322, -322], [286, -322], [260, -316]], "#000", 0.32, 1.6, false, 3) +
      wf([[364, -310], [366, -280], [364, -250], [356, -220]], "#fff", 0.2, 1.4, false, 5) +
      /* Vorderkante zum Kopf: dicke Hautfalte mit Schatten */
      wf([[366, -306], [360, -260], [352, -220], [340, -190]], "#000", 0.25, 2.5, false, 6),
  });
  s += o;
  return { svg: s, box: [0, -336, 515, 0], fuesse: [316, 289, 70, 106], kopf: [330, -340, 520, -150] };
}

/* =====================================================================
   GIRAFFE
   ===================================================================== */
/* RECHERCHE Giraffe (Giraffa, Massai-Giraffe als Vorbild):
   Bulle bis 5,5 m hoch (Schulter ~3,3 m), Kuh ~4,5 m. Hals mit nur SIEBEN stark verlängerten Wirbeln (~2 m),
   Vorderbeine länger als Hinterbeine → Rücken fällt vom Widerrist zur Kruppe deutlich ab. Kurzer Rumpf, Brust tief.
   Kopf ~60 cm, zwei mit Fell überzogene Ossikone mit schwarzem Haarbüschel (Kuh) bzw. kahl (Bulle), Stirnbuckel.
   Kurze braune Stehmähne vom Hinterhaupt bis Widerrist. Flecken: unregelmäßig gezackte, kastanienbraune Platten
   auf cremefarbenem Netz, an Beinen kleiner, unten fast weiß. Große dunkle Augen mit langen Wimpern, seitlich.
   Paarhufer mit großen gespaltenen Hufen (~30 cm), Schwanz lang mit schwarzer Quaste. */
function giraffe(T) {
  const H = mach(T, T.fein ? 1 : 0, 0.8), { teil, L, kette, kerben, falte, G, wf, zyl, drin } = H, F = H.F, US = H.US;
  /* Farben: Creme-Netz, Unterbeine heller (cremeweiß), Flecken kastanienbraun, zum Bauch heller */
  const creme = T.lg("creme", [[0, "#efe3c7"], [0.6, "#e8d9b6"], [1, "#e4d3ad"]], 0, -560, 0, -100, US);
  const creFern = T.lg("crf", [[0, "#cdbf9f"], [1, "#c3b392"]], 0, -330, 0, 0, US);
  const lauf = T.lg("lauf", [[0, "#e6d6b2"], [0.4, "#efe4cc"], [0.6, "#f3ead6"], [1, "#e2d3b4"]], 0, -200, 0, -20, US);
  const laufFern = T.lg("lauff", [[0, "#c5b796"], [0.5, "#cfc4ac"], [1, "#bdb095"]], 0, -200, 0, -20, US);
  const licht = T.lg("licht", [[0, "#fff", 0.22], [0.25, "#fff", 0.04], [0.45, "#000", 0], [0.62, "#4a2e16", 0.24], [0.8, "#4a2e16", 0.38], [0.92, "#4a2e16", 0.2], [1, "#e8d2a8", 0.14]], 0, -372, 0, -196, US);
  const lichtX = T.lg("lichtx", [[0, "#fff", 0.08], [0.5, "#fff", 0], [1, "#000", 0.1]], 0, 0, 1, 0);
  const SW = "#1a120b";
  /* Fell als Muster (dicht, Haar für Haar), je Körperzone eigene Wuchsrichtung */
  const haarF = [["#fff6e2", 2, 0.28, 0.32], ["#3a1d0a", 2, 0.3, 0.3]];
  const fHals = F ? H.fellMuster("h", 62, haarF, { tile: 9, n: 46, len: 2.6 }) : "";
  const fRumpf = F ? H.fellMuster("r", 168, haarF, { tile: 10, n: 46, len: 3 }) : "";
  const fBein = F ? H.fellMuster("b", 92, haarF, { tile: 7, n: 36, len: 2.2 }) : "";
  const fKopf = F ? H.fellMuster("k", 200, [["#fff6e2", 2, 0.2, 0.3], ["#3a1d0a", 2, 0.2, 0.28]], { tile: 6, n: 40, len: 1.5 }) : "";
  /* ---- Fleckenmosaik: echte Voronoi-Zellen, Fugen unterschiedlich breit, Ränder gelappt, Ecken rund,
     zum Umriss hin verkürzt (Rundung), zum Bauch kleiner und heller ---- */
  const zentren = [];
  const feld = (x0, y0, x1, y1, g, fuge, ok) => {
    for (let y = y0, z = 0; y < y1; y += g * 0.87, z++) for (let x = x0 + (z % 2) * g / 2; x < x1; x += g) {
      const c = { x: x + (T.rnd() - 0.5) * g * 0.5, y: y + (T.rnd() - 0.5) * g * 0.5, g, fuge, r: Array.from({ length: 40 }, () => T.rnd()) };
      if (!ok || ok(c.x, c.y)) zentren.push(c);
    }
  };
  const halbebene = (poly, nx, ny, d) => { /* behalte Punkte mit nx*x + ny*y <= d */
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], da = nx * a[0] + ny * a[1] - d, db = nx * b[0] + ny * b[1] - d;
      if (da <= 0) out.push(a);
      if (da * db < 0) { const t = da / (da - db); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out;
  };
  const qr = (pts, q) => { /* gerundetes Vieleck: Mittelpunkte verbunden, Ecken als Bögen (klein) */
    const fm = (v) => String(Math.round(v * q) / q), n = pts.length, M = (i) => { const a = pts[i % n], b = pts[(i + 1) % n]; return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; };
    const A = (i, t) => { const a = pts[(i + n) % n], b = pts[(i + 1) % n]; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; };
    let p0 = A(-1, 0.75), d = `M${fm(p0[0])} ${fm(p0[1])}`;
    for (let i = 0; i < n; i++) { const p = pts[i], a = A(i, 0.25), b = A(i, 0.75); d += `Q${fm(p[0])} ${fm(p[1])} ${fm(a[0])} ${fm(a[1])}L${fm(b[0])} ${fm(b[1])}`; }
    return d + "Z";
  };
  const umrisse = [];
  const flecken = (poly, o = {}) => {
    const kl = [[], [], []];
    const rand = umrisse.length ? umrisse : [];
    for (const c of zentren) {
      if (o.ymin != null && c.y < o.ymin) continue;
      const imm = drin(poly, c.x, c.y);
      if (!imm && !(o.rand && poly.some((p) => Math.abs(p[0] - c.x) < c.g && Math.abs(p[1] - c.y) < c.g))) continue;
      let zelle = [[c.x - c.g * 1.5, c.y - c.g * 1.5], [c.x + c.g * 1.5, c.y - c.g * 1.5], [c.x + c.g * 1.5, c.y + c.g * 1.5], [c.x - c.g * 1.5, c.y + c.g * 1.5]];
      let k = 0;
      for (const n of zentren) {
        if (n === c || Math.abs(n.x - c.x) > c.g * 2.2 || Math.abs(n.y - c.y) > c.g * 2.2) continue;
        const vx = n.x - c.x, vy = n.y - c.y, l = Math.hypot(vx, vy), nx = vx / l, ny = vy / l;
        const fu = (c.fuge + n.fuge) / 4 * (0.5 + 1.1 * c.r[k++ % 40]);
        zelle = halbebene(zelle, nx, ny, nx * (c.x + vx / 2) + ny * (c.y + vy / 2) - fu);
        if (zelle.length < 3) break;
      }
      if (zelle.length < 3) continue;
      /* gelappte Seiten: jede Kante mit 1–2 Zwischenpunkten, leicht nach innen/außen versetzt */
      const pts = [];
      for (let i = 0; i < zelle.length; i++) {
        const a = zelle[i], b = zelle[(i + 1) % zelle.length], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
        pts.push(a);
        if (l > c.g * 0.22 && F && c.g > 10) { const am = (c.r[(i * 3 + 7) % 40] - 0.45) * c.g * 0.12; pts.push([a[0] + dx * 0.5 - dy / l * am, a[1] + dy * 0.5 + dx / l * am]); }
      }
      /* Verkürzung zum Umriss: senkrecht zum nächsten Randpunkt stauchen */
      let best = 1e9, bx = 0, by = 0;
      for (const p of (o.umriss || poly)) { const dd = Math.hypot(p[0] - c.x, p[1] - c.y); if (dd < best) { best = dd; bx = p[0]; by = p[1]; } }
      const R0 = o.r0 || c.g * 1.2;
      let fin = pts;
      if (best < R0 && best > 0.01) {
        const nx = (bx - c.x) / best, ny = (by - c.y) / best, sq = 0.55 + 0.45 * (best / R0);
        fin = pts.map((p) => { const dx = p[0] - c.x, dy = p[1] - c.y, a = dx * nx + dy * ny; return [p[0] - nx * a * (1 - sq), p[1] - ny * a * (1 - sq)]; });
      }
      kl[Math.floor(c.r[39] * 3)].push(qr(fin, c.g > 14 || !F ? 1 : 10));
    }
    return kl;
  };
  const fleckFarben = [T.lg("f1", [[0, "#5e2e10"], [0.5, "#74391a"], [1, "#9a6236"]], 0, -540, 0, -100, US), T.lg("f2", [[0, "#673512"], [0.5, "#7e431c"], [1, "#a46a3a"]], 0, -540, 0, -100, US),
    T.lg("f3", [[0, "#55290d"], [0.5, "#6c3516"], [1, "#94592e"]], 0, -540, 0, -100, US)];
  const fleckSVG = (kl, fern) => kl.map((d, i) => d.length ? `<path d="${d.join("")}" fill="${fern ? "#5c3418" : fleckFarben[i]}"${F ? ` stroke="#2e1406" stroke-width=".7" stroke-opacity=".35"` : ""}${fern ? ` opacity=".85"` : ""}/>` : "").join("");
  /* ---- Umrisse ---- */
  /* Rumpf + Hals: Widerrist deutlich höchster Rückenpunkt, Rücken fällt ~24° zur Kruppe, Hüfthöcker, Brust weit vor dem Vorderbein */
  const rumpf = [[40, -292], [62, -300], [80, -304], [92, -309], [106, -306], [140, -322], [180, -343], [214, -362], [234, -374], [262, -410], [300, -460], [328, -496], [346, -516],
    [366, -486], [358, -470], [346, -452], [330, -422], [314, -386], [300, -344], [292, -304], [289, -268], [282, -238], [268, -216], [246, -206], [214, -202], [180, -199], [150, -202],
    [126, -212], [110, -220], [94, -226], [66, -238], [46, -258], [38, -276]];
  /* Zellen: Rumpf groß, Hals mittel, Beine klein (nach unten kleiner), Kopf winzig */
  const halsSeite = (x, y) => 80 * (y + 365) - 80 * (x - 225) < 0;
  feld(20, -380, 300, -190, 31, 3.6, (x, y) => !halsSeite(x, y));
  feld(200, -540, 380, -280, 22, 3, (x, y) => halsSeite(x, y));
  const beinZellen = (x0, x1, yEnde) => {
    for (let y = -200, z = 0; y < yEnde; z++) {
      const g = 13 - Math.max(0, (y - (yEnde - 45)) / 45) * 7;
      for (let x = x0 + (z % 2) * g / 2; x < x1; x += g) {
        const c = { x: x + (T.rnd() - 0.5) * g * 0.45, y: y + (T.rnd() - 0.5) * g * 0.45, g, fuge: 2.6, r: Array.from({ length: 40 }, () => T.rnd()) };
        if (c.y < yEnde - 18 + c.r[5] * 36) zentren.push(c);
      }
      y += g * 0.85;
    }
  };
  beinZellen(186, 280, -128); beinZellen(70, 150, -138);
  let s = "";
  /* ---- Beine (unter dem Rumpf; der Rumpf deckt Schulter und Keule) ---- */
  const vorder = (x) => [[x + 6, -300, 26, 26], [x + 2, -228, 21, 20], [x + 1, -180, 13, 12.5], [x, -140, 10, 9.5], [x, -119, 9.5, 9], [x, -109, 11.5, 10.5], [x, -97, 7.6, 7.6], [x + 0.5, -62, 6.2, 6.8], [x + 1, -42, 6, 6.4], [x + 2, -31, 8, 8], [x + 6, -22.5, 6.6, 6.6], [x + 9.5, -17, 6.6, 6.2]];
  const hinter = (x) => [[x + 18, -280, 12, 40], [x + 26, -225, 26, 24], [x + 20, -185, 15, 16], [x + 5, -140, 9.5, 12], [x - 1, -124, 8, 14, 2], [x, -108, 7.2, 7.8], [x + 2, -62, 6.2, 6.8], [x + 3, -42, 6, 6.4], [x + 4, -31, 8, 8], [x + 8, -22.5, 6.6, 6.6], [x + 11.5, -17, 6.6, 6.2]];
  const huf = (x, fern) => H.huf(x, 17, 7, 6.6, T.lg(fern ? "hufd" : "hufg", fern ? [[0, "#2a221c"], [1, "#130f0c"]] : [[0, "#40342a"], [1, "#1c1611"]]), true, { saum: fern ? "#a99a7e" : "#e8dcc0" });
  const bein = (J, fern, vorn) => {
    const kk = kette(J), m = J.length - 1;
    const fl = fleckSVG(flecken(kk.pts, { ymin: -235, r0: 5 }), fern);
    const knie = vorn ? H.wf([[J[5][0] - 9, J[5][1] - 4], [J[5][0] + 11, J[5][1] - 1], [J[5][0] + 9, J[5][1] + 6], [J[5][0] - 8, J[5][1] + 5]], "#8a8070", 0.35, 1.2) : "";
    return teil(kk.pts, fern ? laufFern : lauf, {
      fell: [fBein],
      innen: fl + knie +
        zyl(kk, 1, 14, fern ? 1.3 : 1) +
        /* Beugesehne hinten am Röhrbein; beim Hinterbein die Achillessehne über dem Fersenhöcker */
        wf(G(H.laengs(kk, 0.18, vorn ? 6 : 5, m - 2), false), "#000", 0.2, 0.5, false, 1.2) + wf(G(H.laengs(kk, 0.3, vorn ? 6 : 5, m - 2), false), "#fff", 0.25, 0.4, false, 0.9) +
        (vorn ? "" : wf(G(H.laengs(kk, 0.12, 2, 5), false), "#000", 0.22, 0.6, false, 1.4)) +
        wf([[J[m - 2][0] - 8, J[m - 2][1] + 2], [J[m - 2][0] + 8, J[m - 2][1] + 2]], "#000", 0.18, 1, false) +
        (fern ? wf([[J[0][0] - 30, -210], [J[0][0] + 30, -210]], "#000", 0.45, 6, false, 20) : wf([[J[0][0] - 30, -204], [J[0][0] + 30, -204]], "#3a2410", 0.35, 4, false, 12)),
    }) + huf(J[m][0], fern);
  };
  s += bein(vorder(208), 1, 1) + bein(hinter(118), 1, 0);
  s += bein(vorder(246), 0, 1) + bein(hinter(80), 0, 0);
  /* ---- Schwanz: Rübe dick (oben gefleckt), verjüngt, Quaste dicht und voluminös, endet auf Höhe des Sprunggelenks ---- */
  const sk = kette([[42, -290, 4.6, 4.6], [36, -258, 3.4, 3.4], [30, -220, 2.4, 2.4], [26, -186, 1.9, 1.9], [24, -168, 1.8, 1.8]]);
  s += teil(sk.pts, creme, { fell: [fRumpf], ov: [lichtX], rim: 1.5, innen: `<path d="M38 -286Q42 -278 39 -268Q34 -276 38 -286Z" fill="${fleckFarben[0]}"/><path d="M34 -258Q37 -250 34 -242Q31 -250 34 -258Z" fill="${fleckFarben[1]}"/>` });
  s += H.straehnen([[24, -178], [24, -166]], 50, (t) => 34 + t * 6, (x, y, t) => 92 + (t - 0.5) * 24, [["#1a120b", 3, 0.9, 0.95], ["#3a2a1e", 2, 0.8, 0.9], ["#5a4535", 1, 0.7, 0.85]], { streu: 18, welle: 0.35, szene: 0.4 });
  /* ---- Rumpf und Hals ---- */
  const halsZone = [[200, -340], [240, -380], [300, -470], [350, -530], [400, -470], [330, -300], [300, -230], [260, -330]];
  const fl = fleckSVG(flecken(rumpf, { umriss: rumpf, r0: 20 }));
  s += teil(rumpf, creme, {
    fell: F ? [] : [], ov: [licht, lichtX], rim: 18, rimD: G(rumpf.slice(0, 22), false),
    innen: fl + (F ? `<path d="${G(halsZone)}" fill="${fHals}"/><path d="M0 -380H260L230 -190H0Z" fill="${fRumpf}"/>` : "") +
      /* Licht: Widerrist, Schulter, Kruppe; Hals: Mähnenseite hell, Kehlseite dunkel; Okklusion an den Beinansätzen */
      wf([[58, -296], [92, -304], [140, -317], [180, -338], [214, -356], [234, -368], [262, -404], [300, -454], [328, -490]], "#fff", 0.22, 4, false) +
      wf([[226, -350], [250, -320], [262, -280], [270, -246]], "#fff", 0.12, 7, false) + wf([[70, -290], [96, -298]], "#fff", 0.14, 8, false) +
      wf([[358, -470], [344, -448], [328, -418], [312, -382], [298, -342], [290, -300]], "#4a2c12", 0.32, 4, false, 16) +
      wf([[284, -300], [270, -250], [254, -218]], "#3a2410", 0.25, 6, false) + wf([[110, -222], [124, -246], [128, -270]], "#3a2410", 0.18, 5, false) +
      kerben([[[120, -214], [116, -236], [110, -262]], [[268, -222], [272, -252], [276, -280]]], 1.6, 0.18, "#3a2410") +
      /* Schlagschatten des Kopfes auf den oberen Hals */
      wf([[340, -500], [354, -486], [362, -470]], "#2a1808", 0.35, 4, false, 14),
  });
  /* ---- Stehmähne: aufrechter Kamm auf der Halsoberkante, gebändert, gezackt, flach auslaufend am Widerrist ---- */
  const kamm = [[214, -362], [234, -374], [262, -410], [300, -460], [328, -496], [346, -516]];
  const hoehe = [2, 7, 11.5, 12.5, 12, 9];
  const nAch = (i) => { const a = kamm[Math.max(0, i - 1)], b = kamm[Math.min(kamm.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [dy / l, -dx / l]; };
  const aussen = kamm.map((p, i) => { const n = nAch(i); return [p[0] + n[0] * hoehe[i], p[1] + n[1] * hoehe[i]]; });
  const maehne = aussen.concat(kamm.slice().reverse().map((p) => [p[0] + 0.5, p[1] + 1.5]));
  const mWurzel = kamm.map((p) => [p[0], p[1] + 1]);
  s += teil(maehne, T.lg("mae", [[0, "#6a3c1c"], [1, "#9a6438"]], 0, 0, 0.6, 0.6), { rim: 2,
    oben: H.straehnen(mWurzel, F ? 260 : 50, (t) => 4 + Math.sin(Math.min(1, t * 1.3) * Math.PI) * 8, (x, y) => -142 + (x - 280) * 0.02, [["#3a1c0a", 2, 0.5, 0.9], ["#8a5a32", 3, 0.45, 0.85], ["#c0905c", 1, 0.4, 0.75]], { streu: 16, welle: 0.15, szene: 1 }) });
  /* ---- Kopf: Kopfachse 24° nach unten; Ramsnase, stumpfes Maul mit überhängender Oberlippe, Kinn, Kaumuskel, Kehlgang ---- */
  const wa = 24 * Math.PI / 180, P0 = [350, -520];
  const K = (u, v) => [P0[0] + u * Math.cos(wa) - v * Math.sin(wa), P0[1] + u * Math.sin(wa) + v * Math.cos(wa)];
  const kopfL = [[0, -2], [6, -9], [16, -11], [23, -11.5], [26, -12.6], [30, -11.4], [44, -9.2], [56, -7.6], [66, -6], [72.5, -3.6], [76.5, 1], [76.2, 5.4], [73, 6.8], [74.2, 8.6], [72, 11], [66, 12],
    [52, 13.6], [40, 15.6], [28, 18.2], [19, 19], [12, 15], [5, 10], [0, 6], [-2, 1]];
  const kopf = kopfL.map((p) => K(p[0], p[1]));
  let k = "";
  zentren.length = 0;
  feld(340, -545, 420, -470, 8.5, 1.8, (x, y) => true);
  const kf = flecken(kopf, { umriss: kopf, r0: 6 });
  const kopfMaske = [K(0, -12), K(30, -14), K(32, 20), K(0, 20)];
  k += teil(kopf, creme, {
    fell: [fKopf], ov: [lichtX, T.lg("kl", [[0, "#fff", 0.16], [0.4, "#fff", 0], [1, "#000", 0.14]])], rim: 6, rimD: G(kopf.slice(0, 21), false),
    innen: `<g clip-path="url(#${T.id("km")})">${fleckSVG(kf)}</g>` +
      /* warmer Hauch auf Stirn und Nasenrücken, warmes Maul */
      wf([K(22, -10), K(46, -8), K(64, -5)].concat([K(64, 2), K(30, 0)]), "#b5814e", 0.35, 2.5) +
      wf([K(62, -5), K(76, 0), K(74, 9), K(64, 11), K(58, 4)], "#b49a78", 0.75, 1.6) +
      /* Kaumuskelplatte, Kehlgang, Augenhöhlenwulst */
      wf([K(18, 6), K(34, 4), K(40, 12), K(24, 16)], "#fff", 0.14, 2.4) + wf([K(12, 17), K(30, 18.5), K(48, 14.5)], "#000", 0.22, 2, false) +
      wf([K(4, 12), K(12, 16)], "#000", 0.3, 1.8, false) +
      /* Nasenloch: schräger Schlitz mit erhabenem Rand; Maulspalte, Kinnfalte */
      wf([K(59.5, -3), K(66, -5.5)], "#fff", 0.35, 0.6, false, 2.2) + kerben([[K(59, -1.5), K(62.5, -2.6), K(66.5, -4.2)]], 1.4, 0.85, "#140d08") +
      kerben([[K(76, 5.6), K(73.5, 6.5), K(68, 6.8), K(62, 7.4)]], 0.9, 0.75, "#140d08") + wf([K(70, 9.5), K(73, 10.5)], "#000", 0.25, 0.7, false) +
      (F ? T.schnurrhaare(...K(73, 7), 8, 4, 110, 60, "#2a1d12", 0.12) : ""),
  });
  T.def(`<clipPath id="${T.id("km")}"><path d="${G(kopfMaske)}"/></clipPath>`);
  /* Auge: groß, vorstehend, fast schwarz, waagrechte Pupille, lange Wimpern oben, kurze unten */
  const [ax, ay] = K(29, -3.2);
  k += H.auge(ax, ay, 3.2, { iris: "#3a2010", iris2: "#120804", offen: 0.8, pupille: "quer", wimpern: 16, wl: 1.7, lid: "#160d07", lidHaut: "#3c2614", winkel: 14, hoehleA: 0.22, feucht: "#a07a68", wimpernFarbe: "#1a120b" });
  if (F) k += L([0.25, 0.4, 0.55, 0.7, 0.85].map((t, i) => { const x = ax - 3.6 + t * 7.6, y = ay + 2.4 - Math.sin(t * Math.PI) * 0.6; return [[x, y], [x + 0.6, y + 1.3 + (i % 2) * 0.4]]; }), "#2a1d12", 0.18, 0.7);
  /* Ossikone: nach hinten gekippt, leicht verjüngt, oben ein Knauf mit strahlenförmigem Haarbüschel, mit Kopffell überzogen */
  const oss = (u, fern) => {
    const b = K(u, -11.2), a = (-90 - 22 + 24) * Math.PI / 180, h = 17, tp = [b[0] + Math.cos(a) * h, b[1] + Math.sin(a) * h], nx = -Math.sin(a), ny = Math.cos(a);
    const pts = [[b[0] + nx * 3.4, b[1] + ny * 3.4], [b[0] + Math.cos(a) * h * 0.55 + nx * 2.7, b[1] + Math.sin(a) * h * 0.55 + ny * 2.7], [tp[0] + nx * 3.2, tp[1] + ny * 3.2],
      [tp[0] + Math.cos(a) * 2.6, tp[1] + Math.sin(a) * 2.6], [tp[0] - nx * 3.2, tp[1] - ny * 3.2], [b[0] + Math.cos(a) * h * 0.55 - nx * 2.7, b[1] + Math.sin(a) * h * 0.55 - ny * 2.7], [b[0] - nx * 3.4, b[1] - ny * 3.4]];
    let o = teil(pts, fern ? "#a88c68" : T.lg("ossf", [[0, "#ead9b8"], [1, "#b48d62"]], 0, 0, 1, 0), { fell: [fKopf], rim: 1.5, ov: [T.lg("ossv", [[0, "#fff", 0.2], [0.5, "#fff", 0], [1, "#000", 0.25]], 0, 0, 1, 0)] });
    const wurzeln = []; for (let i = 0; i <= 8; i++) { const q = i / 8 * Math.PI * 1.2 - Math.PI * 0.1; wurzeln.push([tp[0] + Math.cos(a + q - Math.PI / 2) * 2.4, tp[1] + Math.sin(a + q - Math.PI / 2) * 2.4]); }
    o += H.straehnen(wurzeln, 34, 3.6, (x, y) => Math.atan2(y - tp[1] + Math.sin(a) * 1.2, x - tp[0] + Math.cos(a) * 1.2) * 180 / Math.PI, [[fern ? "#120b06" : "#1c130c", 3, 0.5, 0.95], ["#4e3a2a", 1, 0.45, 0.85]], { streu: 18, welle: 0.25, szene: 0.4 });
    return o;
  };
  /* Ohr: lanzettlich (3 : 1), spitz, seitlich nach hinten, 15° unter der Waagrechten; innen Creme mit Haarbüscheln */
  const ohr = (fern) => {
    const b = K(5, -6.5), a = (180 + 16) * Math.PI / 180, l = fern ? 16 : 23, w = 4, nx = -Math.sin(a), ny = Math.cos(a), P = (t, q) => [b[0] + Math.cos(a) * l * t + nx * w * q, b[1] + Math.sin(a) * l * t + ny * w * q];
    const pts = [P(0, -0.8), P(0.3, -1.05), P(0.65, -0.8), P(1, 0, 1), P(0.65, 0.85), P(0.3, 1.1), P(0, 0.8)];
    return teil(pts, fern ? "#9c8462" : "#d9c39c", { fell: [fKopf], rim: 1.5,
      innen: fern ? "" : `<path d="${G([P(0.08, 0.1), P(0.35, -0.55), P(0.72, -0.35), P(0.95, 0.02), P(0.7, 0.45), P(0.3, 0.6)])}" fill="#f4e8d2"/>` + wf([P(0.15, 0.25), P(0.55, 0.1)], "#6a4a2a", 0.4, 0.8, false) +
        H.straehnen([P(0.1, 0.2), P(0.5, 0.1)], 18, 3.5, (a * 180 / Math.PI) + 8, [["#fffaf0", 1, 0.25, 0.85]], { streu: 25, szene: 0.3 }) });
  };
  s += ohr(1) + k + oss(18, 1) + oss(21.5) + ohr(0);
  return { svg: s, box: [12, -560, 435, 0], fuesse: [258, 220, 94, 132], kopf: [328, -566, 444, -452] };
}

/* =====================================================================
   ZEBRA
   ===================================================================== */
/* RECHERCHE Zebra (Steppenzebra, Equus quagga):
   Schulterhöhe 1,1–1,4 m, Kopf-Rumpf 2,2–2,5 m, Schwanz ~50 cm, 230–320 kg. Gedrungener als ein Pferd, kurze
   Beine, großer Kopf, große runde Ohren, kurze STEHMÄHNE (gestreift). Streifen breit, am Rumpf senkrecht bis zum
   Bauch (dort Bauchstreifen), an der Kruppe waagerecht/schräg nach hinten gebogen, auf den Beinen quer und
   nach unten schmaler; im Süden hellbraune SCHATTENSTREIFEN zwischen den schwarzen am Hinterteil. Maul schwarz
   (Flotzmaul). Einhufer mit festem Huf. Schwanz mit schwarzer Quaste. */
function zebra(T) {
  const H = mach(T, T.fein ? 1 : 0, 0.5), { teil, L, kette, G, wf, kerben } = H, F = T.fein, US = H.US;
  const weiss = T.lg("weiss", [[0, "#f8f5ee"], [0.6, "#ece6da"], [1, "#d9d1c2"]], 0, -200, 0, 0, US);
  const fernW = T.lg("fernw", [[0, "#cbc4b6"], [1, "#a9a193"]], 0, -100, 0, 0, US);
  const licht = T.lg("licht", [[0, "#fff", 0.2], [0.4, "#fff", 0], [0.65, "#000", 0.08], [1, "#000", 0.28]], 0, -200, 0, 0, US);
  const SW = "#17120f", SWf = "#0f0c0a";
  /* spitz zulaufender Streifen: Mittellinie z, halbe Breiten b je Punkt */
  const band = (z, b) => {
    if (z.length !== 3) return G(kette(z.map((p, i) => [p[0], p[1], b[i], b[i]])).pts);
    /* drei Punkte: Linse aus zwei Bögen (klein) */
    const [a, m, e] = z, dx = e[0] - a[0], dy = e[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l * 2 * b[1], ny = dx / l * 2 * b[1], f = H.f;
    const cx = 2 * m[0] - (a[0] + e[0]) / 2, cy = 2 * m[1] - (a[1] + e[1]) / 2;
    return `M${f(a[0])} ${f(a[1])}Q${f(cx + nx)} ${f(cy + ny)} ${f(e[0])} ${f(e[1])}Q${f(cx - nx)} ${f(cy - ny)} ${f(a[0])} ${f(a[1])}Z`;
  };
  const bandG = (liste) => liste.map(([z, b]) => band(z, b)).join("");
  const bog = (cx, cy, rx, ry, a0, a1, n) => { const p = []; for (let i = 0; i < n; i++) { const a = (a0 + (a1 - a0) * i / (n - 1)) * Math.PI / 180; p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return p; };
  /* Querstreifen über ein Bein (in dessen Clip): nach unten enger und schmaler */
  const beinStreifen = (J, y0, y1) => {
    const kk = kette(J), z = [];
    let y = y0, i = 0;
    while (y < y1) {
      const t = (y - y0) / (y1 - y0), w = 2.7 - t * 1.8, dy = 6.6 - t * 2.6;
      const xm = J.reduce((a, p) => (Math.abs(p[1] - y) < Math.abs(a[1] - y) ? p : a))[0];
      z.push([[[xm - 16, y + 1.8], [xm, y + 2.4 + (i % 2) * 0.7], [xm + 16, y - 0.4]], w]);
      y += dy * (0.9 + T.rnd() * 0.2); i++;
    }
    return { d: z.map(([p, w]) => band(p, [w * 0.45, w, w * 0.45])).join(""), kk };
  };
  let s = "";
  /* Schwanz: oben gestreift, schwarze Quaste */
  const sk = kette([[44, -118, 2.6, 2.6], [38, -102, 2.1, 2.1], [35, -84, 1.7, 1.7], [34, -70, 1.5, 1.5]]);
  const quaste = []; for (let i = 0; i < (F ? 22 : 8); i++) { const a = -0.5 + i / 21, l = 14 + T.rnd() * 12; quaste.push([[34.5, -76], [34 + a * 2.5, -76 + l * 0.5], [33 + a * 7, -76 + l]]); }
  s += teil(sk.pts, weiss, { ov: [licht], rw: 0.3, innen: L([[[32, -114], [46, -112]], [[31, -106], [43, -104]], [[31, -98], [41, -97]], [[31, -90], [39, -89]]], SW, 2.4) }) + L(quaste, SW, 0.7, 0.95);
  /* Beine (Kronrand bei y = -8): Unterarm kräftig, Vorderfußwurzel, schlankes Röhrbein mit Beugesehne, Fesselkopf, schräge Fessel */
  const vorder = (x) => [[x + 3, -96, 12, 12], [x + 1, -66, 8, 7.2], [x, -50, 5.8, 5.6], [x, -44, 6, 6], [x, -38, 4.6, 4.8], [x, -21, 4.2, 4.8], [x + 0.5, -16, 5.2, 5.4], [x + 2, -12, 4.4, 4.2], [x + 3.5, -8, 4.2, 4]];
  const hinter = (x) => [[x + 10, -100, 16, 18], [x + 12, -76, 11, 11], [x + 6, -60, 7.5, 8.5], [x, -45, 5, 7.6, 2], [x + 0.5, -37, 4.6, 5], [x + 2, -21, 4.2, 4.8], [x + 2.5, -16, 5.2, 5.4], [x + 4, -12, 4.4, 4.2], [x + 5.5, -8, 4.2, 4]];
  const huf = (x) => H.huf(x, 8, 4.4, 4, T.lg("hufg", [[0, "#3c3833"], [1, "#1d1a17"]]), false) +
    (F ? `<path d="M${H.f(x - 4)} -8.4Q${H.f(x)} -9.6 ${H.f(x + 4.2)} -8.6" fill="none" stroke="#7d7568" stroke-width=".8" stroke-opacity=".7"/>` : "");
  const bein = (J, fill, fern) => {
    const st = beinStreifen(J, -98, -15);
    return teil(st.kk.pts, fill, { ov: [licht], rim: 5,
      innen: `<path d="${st.d}" fill="${fern ? SWf : SW}"/>` +
        wf(G(st.kk.R.slice(1).map((p) => [p[0], p[1]]), false), "#000", 0.22, 1.6, false) + wf(G(st.kk.L.slice(2).map((p) => [p[0], p[1]]), false), "#fff", 0.2, 1.2, false) +
        wf([[J[4][0] + 3, -36], [J[5][0] + 3.5, -22]], "#000", 0.18, 0.8, false) +
        (F ? H.haare(st.kk.pts.slice(1, -2), 40, 95, 1.4, { farben: [["#000", 1, 0.12, 0.2]], streuung: 12 }) : ""),
    }) + huf(J[J.length - 1][0]);
  };
  s += bein(vorder(165), fernW, 1) + bein(hinter(78), fernW, 1);
  s += bein(vorder(181), weiss) + bein(hinter(62), weiss);
  /* Rumpf mit Hals: gedrungen (Rumpf ~1,5 m), Rücken gerade, Kruppe rund */
  const rumpf = [[44, -118], [66, -128], [100, -123], [126, -122], [150, -131], [170, -148], [190, -166], [206, -180], [216, -186],
    [222, -168], [217, -148], [210, -126], [203, -104], [197, -88], [190, -76], [176, -68], [150, -64], [120, -64], [100, -68], [90, -74], [74, -80], [56, -88], [42, -104]];
  const st = [];
  /* Hals: vom Kamm zur Kehle, quer zur Halsachse, unten schmaler */
  const kammP = (t) => [150 + 66 * t, -131 - 55 * t], kehP = (t) => [198 + 22 * t, -88 - 80 * t];
  [0.04, 0.16, 0.28, 0.4, 0.52, 0.64, 0.76, 0.88].forEach((t, i) => {
    const a = kammP(t), b = kehP(Math.max(0, t - 0.06)), m = [(a[0] + b[0]) / 2 - 3, (a[1] + b[1]) / 2 + 1];
    st.push([[[a[0] - 2, a[1] - 4], m, [b[0] + 2, b[1] + 2]], [3.6 - i * 0.12, 4.2 - i * 0.18, 1.2]]);
  });
  /* Schulter: biegen unten nach vorn auf den Oberarm */
  st.push([[[146, -134], [143, -112], [150, -92], [166, -80], [186, -76]], [3.2, 4.2, 4, 3, 1.2]]);
  st.push([[[134, -127], [131, -104], [137, -86], [151, -72], [166, -66]], [3, 4.4, 4.2, 3, 1]]);
  st.push([[[154, -134], [160, -114], [172, -100], [188, -92], [198, -90]], [2.4, 3.8, 3.8, 3, 1]]);
  st.push([[[152, -122], [156, -106], [166, -94], [180, -86], [192, -82]], [1, 3, 3.4, 2.6, 1]]);
  /* Rumpf: senkrecht zur Bauchlinie, unten nach vorn; einer gegabelt */
  st.push([[[121, -124], [122, -104], [126, -82], [131, -64]], [2.8, 4.6, 4.2, 1]]);
  st.push([[[108, -124], [108, -104], [112, -84], [118, -65]], [2.6, 4.4, 4, 1]]);
  st.push([[[96, -124], [95, -108], [97, -92]], [2.4, 3.6, 2.4]]);
  st.push([[[95, -100], [99, -84], [106, -66]], [1, 3.6, 1]]);
  st.push([[[90, -104], [89, -92], [93, -78], [97, -70]], [1, 3, 3, 1]]);
  /* Sattel: die hinteren Rumpfstreifen biegen oben nach hinten und laufen als breite Bänder waagerecht über die Kruppe */
  st.push([[[86, -124], [82, -112], [70, -104], [54, -102], [42, -106]], [2.4, 3.6, 4, 3.6, 1.6]]);
  st.push([[[84, -98], [76, -92], [62, -90], [48, -92], [40, -96]], [1, 3.6, 4, 3.4, 1.4]]);
  st.push([[[86, -86], [76, -80], [62, -78], [50, -80], [44, -84]], [1, 3.4, 3.8, 3, 1.2]]);
  st.push([[[60, -127], [54, -118], [46, -114]], [1.6, 2.8, 1.2]]);
  st.push([[[74, -126], [66, -116], [56, -112], [46, -112]], [1, 2.6, 2.4, 1]]);
  /* Keule: Bänder biegen hinten nach unten (Oberschenkel), gehen in die Beinstreifen über */
  st.push([[[88, -76], [80, -70], [70, -68], [62, -70], [56, -74]], [1, 3, 3.4, 2.8, 1]]);
  const schatten = [[[82, -118], [70, -110], [54, -108]], [[80, -96], [64, -96], [48, -98]], [[80, -84], [64, -84], [50, -86]], [[82, -73], [68, -73], [58, -76]]];
  /* Rücken- und Bauchstreif */
  const dorsal = band([[42, -119], [66, -127.5], [100, -122.5], [126, -121.5], [150, -130.5]], [1, 2.2, 2.2, 2, 1.2]) + band([[94, -69], [120, -64.5], [150, -64.5], [180, -70]], [1, 3, 3, 1]);
  s += teil(rumpf, weiss, {
    ov: [licht], rim: 10, randD: G(rumpf.slice(20).concat(rumpf.slice(0, 15)), false) + G(rumpf.slice(16, 19), false),
    innen: `<path d="${bandG(st) + dorsal}" fill="${SW}"/>` + L(schatten, "#8a7660", 2, 0.5) +
      wf([[60, -122], [100, -118], [140, -126], [180, -156], [205, -176]], "#fff", 0.25, 4, false) +
      wf([[110, -70], [150, -68], [180, -74]], "#000", 0.25, 4, false) + wf([[150, -126], [145, -100], [156, -82]], "#000", 0.12, 4, false) +
      wf([[88, -112], [80, -92], [76, -80]], "#000", 0.12, 5, false) + wf([[206, -150], [200, -120], [198, -96]], "#000", 0.16, 3, false) +
      wf([[50, -112], [44, -100]], "#fff", 0.2, 4, false) +
      (F ? H.haare(rumpf, 150, (x, y) => (x > 150 ? 115 : 175), 2, { farben: [["#000", 1, 0.16, 0.18], ["#fff", 1, 0.16, 0.25]], streuung: 16 }) : ""),
  });
  /* Stehmähne: steif, gestreift (Fortsetzung der Halsstreifen), dunkle Spitzen */
  const kamm = [[148, -131], [168, -147], [188, -165], [204, -179], [215, -188]];
  const aussen = kamm.map((p, i) => { const h = [3, 12, 14, 13, 9][i]; return [p[0] - h * 0.62, p[1] - h * 0.78]; });
  const maehne = aussen.concat(kamm.slice().reverse().map((p) => [p[0] + 1.5, p[1] + 1.5]));
  const mStreifen = [0.04, 0.16, 0.28, 0.4, 0.52, 0.64, 0.76, 0.88].map((t) => { const a = kammP(t); return [[[a[0] + 1, a[1] + 1], [a[0] - 9, a[1] - 14]], [3.6, 3]]; });
  s += teil(maehne, "#eee8dc", { ov: [T.lg("mvol", [[0, "#000", 0.3], [0.5, "#000", 0], [1, "#000", 0.1]], 0, 0, 1, 1)], rw: 0.3,
    innen: `<path d="${mStreifen.map(([z, b]) => band(z, b)).join("")}" fill="${SW}"/>` + L([aussen.map((p) => [p[0] + 1, p[1] + 1.2])], "#111", 2.6, 0.85),
    oben: F ? H.haare(maehne, 220, -128, 5, { farben: [["#111", 1, 0.3, 0.5], ["#fff", 1, 0.25, 0.5]], streuung: 10 }) : "" });
  /* Kopf (~50 cm): gerades Profil, kräftige Ganasche, dunkles Maul */
  let k = "";
  const kopf = [[210, -190], [218, -192], [225, -188], [231, -178], [236, -167], [240, -157], [243, -149], [245, -142], [244, -137], [240, -134], [235, -134], [231, -136],
    [227, -139], [220, -143], [212, -147], [206, -154], [203, -165], [204, -180]];
  /* Gesichtsstreifen: quer zur Kopfachse vom Nasenrücken zur Unterkante, zur Nase hin schmaler; ums Auge herum frei */
  const vorn = [[218, -192], [225, -188], [231, -178], [236, -167], [240, -157], [243, -149], [245, -142]], unten = [[204, -182], [203, -167], [206, -155], [212, -148], [220, -143], [227, -139], [231, -136], [235, -134]];
  const auf = (P, u) => { const x = u * (P.length - 1), i = Math.min(P.length - 2, Math.floor(x)), v = x - i; return [P[i][0] + (P[i + 1][0] - P[i][0]) * v, P[i][1] + (P[i + 1][1] - P[i][1]) * v]; };
  const kz = [];
  [[0.08, 1.4], [0.2, 1.5], [0.42, 1.6], [0.53, 1.5], [0.63, 1.35], [0.72, 1.15], [0.8, 0.9]].forEach(([u, w]) => {
    const a = auf(vorn, u), e = auf(unten, Math.min(1, u * 0.92 + 0.02)), m = [(a[0] + e[0]) / 2 + 1.6, (a[1] + e[1]) / 2 + 1.4];
    kz.push([[[a[0] + 1.5, a[1] - 1], m, [e[0] - 1.5, e[1] + 1]], [0.4, w, 0.5]]);
  });
  kz.push([bog(221, -179, 6, 5.2, 60, 140, 3), [0.3, 0.8, 0.3]]);
  k += teil(kopf, weiss, {
    ov: [licht], rim: 6, randD: G(kopf.slice(0, 16), false), rimD: G(kopf.slice(0, 16), false),
    innen: `<path d="${bandG(kz)}" fill="${SW}"/>` +
      wf([[238, -154], [244, -146], [246, -138], [241, -133], [233, -135], [232, -145]], "#2a221d", 0.95, 1.4) +
      wf([[212, -149], [205, -160], [206, -172]], "#000", 0.2, 2.5, false) + wf([[220, -190], [230, -178], [238, -162]], "#fff", 0.3, 1.6, false) +
      kerben([[[240, -148], [243, -146], [245, -146.5]], [[244, -136], [239, -135.5], [235, -136.5]]], 0.9, 0.8) +
      (F ? H.haare(kopf, 60, (x, y) => (x > 228 ? 120 : 150), 1.1, { farben: [["#000", 1, 0.1, 0.2]], streuung: 16 }) + T.schnurrhaare(242, -136, 6, 4, 110, 50, "#1a1410", 0.12) : ""),
  });
  /* Auge: quergestellte Pupille, Wimpern, oben seitlich */
  k += wf([[216, -182], [221, -185], [226, -183]], "#000", 0.3, 0.7, false);
  k += T.augeReal(221, -179, 1.9, { iris: "#3e2412", iris2: "#140a04", offen: 0.72, pupille: "quer", wimpern: 9, wimpernLaenge: 1, lid: "#0e0a08", haut: "#3a302a", winkel: 52 });
  /* Ohren: groß, oval mit runder Spitze, aufrecht; außen weiß mit schwarzem Querband und dunkler Spitze */
  const ohr = (dx, dy, fill, nah) => teil([[207 + dx, -190 + dy], [203.5 + dx, -198 + dy], [204 + dx, -206 + dy], [207.5 + dx, -213 + dy], [211 + dx, -217 + dy], [214 + dx, -212 + dy], [216.5 + dx, -204 + dy], [217 + dx, -195 + dy], [216 + dx, -190 + dy]], fill,
    { rw: 0.4, rim: 2, innen: `<path d="M${203 + dx} ${-205 + dy}Q${210 + dx} ${-201 + dy} ${218 + dx} ${-204 + dy}L${218 + dx} ${-200 + dy}Q${210 + dx} ${-197 + dy} ${203 + dx} ${-201 + dy}Z" fill="${SW}"/>` +
      `<path d="M${204 + dx} ${-210 + dy}Q${210 + dx} ${-208 + dy} ${217 + dx} ${-211 + dy}L${217 + dx} ${-219 + dy}L${204 + dx} ${-219 + dy}Z" fill="${SW}"/>` +
      (nah && F ? H.haare([[208 + dx, -204 + dy], [211 + dx, -210 + dy], [214 + dx, -203 + dy], [214 + dx, -191 + dy], [209 + dx, -191 + dy]], 26, -80, 2.6, { farben: [["#fff", 1, 0.22, 0.8]], streuung: 20 }) : "") });
  k += `<g transform="rotate(-14 212 -190)">${ohr(-4, 1, "#d9d2c5")}</g>` + `<g transform="rotate(6 212 -190)">${ohr(0, 0, "#f3efe6", 1)}</g>`;
  s += k;
  return { svg: s, box: [29, -220, 246, 0], fuesse: [184.5, 168.5, 67.5, 83.5], kopf: [194, -220, 248, -128] };
}

/* =====================================================================
   NASHORN
   ===================================================================== */
/* RECHERCHE Nashorn (Breitmaulnashorn, Ceratotherium simum):
   Größtes Nashorn: Kopf-Rumpf 3,4–4 m, Schwanz ~70 cm, Schulterhöhe 1,6–1,86 m, bis 2,3 t. Langer, tief getragener
   Kopf (Grasfresser), breites, gerades „eckiges“ Maul, ausgeprägter NACKENBUCKEL (Muskel/Bänder für den schweren
   Kopf), zwei Hörner hintereinander, vorderes deutlich länger (~60 cm). Kleine Augen tief hinter dem hinteren Horn,
   lange röhrenförmige Ohren mit Haarsaum. Haut grau, dicke Falten hinter Schulter und vor dem Oberschenkel, kurze
   Säulenbeine mit drei Zehen (Nägel). */
function nashorn(T) {
  const H = mach(T, T.fein ? 1 : 0, 0.8), { teil, L, kette, kerben, querfalten, G, risse, wf } = H, F = T.fein, US = H.US;
  const haut = T.lg("haut", [[0, "#a39d93"], [0.4, "#8a8379"], [0.75, "#6d665d"], [1, "#5c554c"]], 0, -192, 0, 0, US);
  const fern = T.lg("fern", [[0, "#6c655c"], [1, "#4c463f"]], 0, -120, 0, 0, US);
  const licht = T.lg("licht", [[0, "#fff", 0.24], [0.35, "#fff", 0.03], [0.55, "#000", 0.06], [0.8, "#000", 0.2], [1, "#000", 0.26]], 0, -192, 0, 0, US);
  const R = "#1f1912";
  const relief = (inh) => F ? `<g filter="${T.relief("haut", { f: 1.2, tiefe: 0.07, okt: 2, seed: 9 })}">${inh}</g>` : inh;
  /* Zehen: drei breite Nägel (vorn, Mitte, hinten) */
  const zehen = (kk) => {
    const m = kk.L.length - 1, xv = kk.L[m][0], xh = kk.R[m][0];
    let d = "";
    [[0.14, 7], [0.48, 7.5]].forEach(([q, w]) => { const x = xv - (xv - xh) * q; d += `M${H.f(x - w)} -1Q${H.f(x - w + 0.5)} -6.5 ${H.f(x)} -7 ${H.f(x + w - 0.5)} -6.5 ${H.f(x + w)} -1Z`; });
    return `<path d="${d}" fill="#6f675c" stroke="#231c15" stroke-width=".7" stroke-opacity=".6"/>` + (F ? `<path d="${d}" fill="none" stroke="#c9bfad" stroke-opacity=".25" stroke-width=".6" transform="translate(-.5 -.8)"/>` : "");
  };
  const bein = (J, fill, fern2) => {
    const kk = kette(J), m = J.length - 1;
    return teil(kk.pts, fill, {
      ov: fern2 ? [] : [licht], rim: 10,
      innen: kerben(querfalten(kk, 1.2, m - 0.3, F ? 0.28 : 0.7, 0.05, 0.95, 2.4), 3, fern2 ? 0.28 : 0.34) +
        wf(G(kk.R.map((p) => [p[0], p[1]]), false), "#000", fern2 ? 0.2 : 0.28, 4, false) + wf(G(kk.L.slice(1).map((p) => [p[0], p[1]]), false), "#fff", fern2 ? 0.08 : 0.14, 3, false) +
        wf([[kk.R[0][0], J[0][1] + 34], [J[0][0], J[0][1] + 40], [kk.L[0][0], J[0][1] + 34]], "#000", 0.3, 6, false) +
        `<path d="M${H.f(kk.L[m][0])} -3L${H.f(kk.R[m][0])} -3" stroke="#2e261e" stroke-width="6" stroke-opacity=".3"/>` +
        (F ? risse(30, kk.pts.slice(2, -2), 4, 0, 0.45, 0.22, R) : ""),
    }) + zehen(kk);
  };
  let s = "", k = "";
  /* Schwanz: abgeflacht, Borsten an der Spitze */
  const borsten = []; for (let i = 0; i < (F ? 14 : 5); i++) { const a = -0.5 + i / 13, l = 8 + T.rnd() * 6; borsten.push([[39, -98], [38.5 + a * 2, -98 + l * 0.5], [38 + a * 5, -98 + l]]); }
  k += teil(kette([[50, -150, 3.6, 3.6], [43, -128, 3, 3], [39, -100, 2.6, 2.6]]).pts, haut, { ov: [licht], rw: 0.5, rim: 3 }) + L(borsten, "#1d1712", 0.9, 0.9);
  /* Beine: kurz, säulig; vorn Ellbogen auf Bauchhöhe, hinten Knie vorn, Ferse hinten */
  const vorder = (x) => [[x - 2, -112, 30, 30], [x, -70, 23, 21], [x + 1, -46, 19, 18], [x + 2, -30, 17, 17], [x + 3, -12, 19, 18], [x + 4, 0, 21, 19, 3]];
  const hinter = (x) => [[x - 6, -122, 34, 36], [x, -82, 26, 24], [x - 4, -56, 19, 22, 2], [x - 3, -34, 17, 17], [x - 2, -12, 18, 17], [x - 1, 0, 20, 18, 3]];
  k += bein(vorder(234), fern, 1) + bein(hinter(126), fern, 1);
  k += bein(vorder(264), haut) + bein(hinter(96), haut);
  /* Rumpf: Kruppe rund, Rücken leicht durchgesenkt, hoher Nackenbuckel */
  const rumpf = [[50, -150], [74, -168], [120, -162], [170, -157], [215, -165], [252, -176], [288, -190], [316, -184], [336, -172],
    [344, -140], [340, -104], [330, -84], [310, -76], [296, -64], [270, -56], [240, -58], [180, -53], [150, -55], [126, -62], [104, -70], [70, -82], [46, -104], [36, -130]];
  k += teil(rumpf, haut, {
    ov: [licht], rim: 22, randD: G(rumpf.slice(20).concat(rumpf.slice(0, 14)), false) + G(rumpf.slice(15, 18), false),
    innen: wf([[66, -160], [120, -156], [170, -152], [215, -160], [252, -170], [288, -183], [312, -178]], "#fff", 0.22, 7, false) +
      wf([[270, -156], [300, -168]], "#fff", 0.18, 9, false) + wf([[76, -138], [100, -146]], "#fff", 0.16, 10, false) +
      wf([[130, -70], [180, -64], [240, -68]], "#000", 0.34, 8, false) + wf([[60, -100], [80, -80], [110, -72]], "#000", 0.2, 7, false) + wf([[226, -168], [218, -128], [224, -92]], "#000", 0.22, 6, false) +
      wf([[128, -150], [118, -110], [124, -72]], "#000", 0.18, 7, false) + wf([[318, -150], [322, -110], [316, -84]], "#000", 0.2, 6, false) +
      wf([[150, -56.5], [180, -55], [240, -59]], "#d9cbb6", 0.2, 1.5, false) +
      kerben([[[242, -172], [232, -132], [236, -98], [250, -66]], [[252, -170], [244, -140], [246, -112]], [[130, -64], [122, -106], [110, -150]], [[120, -66], [112, -96]],
        [[310, -182], [318, -146], [322, -108], [314, -80]], [[322, -178], [330, -140], [332, -100]], [[300, -186], [304, -160]], [[170, -156], [166, -120]]], 5, 0.32) +
      (F ? risse(80, rumpf, 7, (x, y) => (y < -130 ? 0 : 80), 0.5, 0.2, R) : ""),
  });
  /* Kopf: lang, tief getragen, breites eckiges Maul */
  const kopf = [[312, -186], [334, -176], [350, -160], [362, -142], [372, -132], [392, -110], [408, -92], [417, -82], [422, -72], [424.5, -60], [424.5, -47, 1], [419, -42], [408, -40.5], [390, -44],
    [368, -54], [348, -66], [330, -82], [318, -110], [308, -150]];
  k += teil(kopf, haut, {
    ov: [licht], rim: 14, randD: G(kopf.slice(0, 18), false), rimD: G(kopf.slice(0, 18), false),
    innen: wf([[338, -170], [356, -150], [372, -130], [392, -106]], "#fff", 0.22, 4, false) + wf([[346, -80], [370, -60], [396, -48]], "#000", 0.26, 5, false) +
      wf([[356, -118], [368, -112]], "#000", 0.22, 4, false) + wf([[404, -86], [418, -66], [419, -48]], "#000", 0.16, 3, false) +
      kerben([[[338, -164], [334, -130], [338, -100]], [[350, -150], [348, -120], [352, -90]], [[363, -124], [354, -116], [349, -104]], [[372, -118], [362, -110]],
        [[372, -96], [388, -82], [404, -76]], [[386, -64], [400, -58], [414, -56]], [[352, -74], [366, -66]]], 3.6, 0.36) +
      kerben([[[417, -77], [414, -71], [415, -65]], [[422, -48], [413, -46.5], [403, -47.5]]], 1.6, 0.75) +
      (F ? risse(30, kopf, 4, 30, 0.45, 0.2, R) : ""),
  });
  s += relief(k);
  /* Auge: klein, tief hinter dem hinteren Horn */
  s += wf([[354, -119], [360, -122], [366, -119]], "#000", 0.3, 1, false);
  s += T.augeReal(360, -115, 2.1, { iris: "#4a2a12", iris2: "#1c0e05", offen: 0.6, wimpern: 7, wimpernLaenge: 1, lid: "#241b13", haut: "#3e372f", winkel: 40 });
  /* Hörner: vorn lang, leicht zurückgebogen; hinten kurz; Faserstruktur */
  const hornG = T.lg("horn", [[0, "#4f463c"], [0.5, "#7c705f"], [1, "#a8998a"]], 0, 1, 0, 0);
  const faser = (z) => F ? L(z, "#2a231c", 0.5, 0.35) : "";
  s += teil([[370, -131], [373, -142], [378, -151], [384, -156], [385, -146], [388, -130], [392, -119], [381, -118]], hornG, { rw: 0.6, rim: 3, ov: [],
    innen: faser([[[376, -127], [379, -146]], [[382, -125], [383.5, -150]], [[387, -122], [385.5, -140]]]) });
  s += teil([[396, -103], [402, -125], [407, -148], [410, -172], [413, -192], [416, -197, 1], [421, -188], [426, -166], [427, -140], [424, -114], [418, -92], [412, -86], [403, -92]], hornG, { rw: 0.6, rim: 5, ov: [],
    innen: faser([[[404, -98], [410, -130], [414, -180]], [[410, -92], [417, -130], [418, -184]], [[416, -90], [422, -120], [423, -150]]]) + wf([[403, -110], [408, -140], [411, -172]], "#fff", 0.35, 1.4, false) });
  /* Ohren: röhrenförmig, aufrecht, Haarsaum an der Spitze */
  /* Ohren: trichterförmig, schmal am Ansatz, oben offen mit spitzem Rand und Haarsaum, leicht nach hinten gekippt */
  const ohr = (x, y, fill, nah) => `<g transform="rotate(-18 ${x} ${y})">` + teil([[x - 3, y + 2], [x - 4.5, y - 8], [x - 7.5, y - 18], [x - 8, y - 25], [x - 4, y - 30, 1], [x + 2, y - 26], [x + 6.5, y - 18], [x + 6, y - 8], [x + 4, y + 2]], fill,
    { rw: 0.5, rim: 3, innen: `<path d="M${x - 5} ${y - 24}Q${x - 3} ${y - 28} ${x + 1} ${y - 25}Q${x + 5} ${y - 19} ${x + 4} ${y - 13}Q${x - 1} ${y - 16} ${x - 5} ${y - 24}Z" fill="#3a332c" opacity=".75"/>` +
      wf([[x - 3, y - 4], [x - 5, y - 16]], "#000", 0.3, 1.4, false) + wf([[x + 3, y - 6], [x + 4, y - 14]], "#fff", 0.2, 1.2, false) +
      (nah && F ? H.haare([[x - 8, y - 25], [x - 4, y - 31], [x + 2, y - 27], [x - 2, y - 24]], 24, -110, 2.4, { farben: [["#2a221a", 1, 0.25, 0.8]], streuung: 40 }) : "") }) + "</g>";
  s += relief(ohr(324, -172, "#7c766d") + ohr(336, -170, "#8f897f", 1));
  return { svg: s, box: [35, -203, 427, 0], fuesse: [268, 238, 95, 125], kopf: [298, -205, 428, -30] };
}

/* =====================================================================
   NILPFERD
   ===================================================================== */
/* RECHERCHE Nilpferd (Flusspferd, Hippopotamus amphibius; Duden: das Nilpferd):
   Kopf-Rumpf 3–4,3 m (Schwanz 35–56 cm), Schulterhöhe ~1,5 m, bis 3 t. Tonnenförmiger Rumpf, sehr kurze Beine
   (Bauch knapp über dem Boden), vier Zehen mit Nägeln. Riesiger Kopf mit breiter, kastenförmiger Schnauze;
   Augen, Ohren und Nasenlöcher liegen auf einer Ebene oben auf dem Kopf (Augen auf Höckern, kleine Ohren).
   Haut nackt, oben schiefer-/purpurgraubraun, unten rosa; rosa Stellen um Augen, Ohren, Wangen. Kurzer Schwanz. */
function nilpferd(T) {
  const H = mach(T, T.fein ? 1 : 0, 0.8), { teil, L, kette, kerben, querfalten, G, wf } = H, F = T.fein, US = H.US;
  /* nackte Haut: oben schiefer-/purpurgraubraun, unten rosa */
  const haut = T.lg("haut", [[0, "#6b5b5e"], [0.35, "#7a6465"], [0.65, "#9a7670"], [0.85, "#b48a80"], [1, "#a8807a"]], 0, -175, 0, 0, US);
  const fern = T.lg("fern", [[0, "#5a4a4c"], [1, "#6e5653"]], 0, -90, 0, 0, US);
  const licht = T.lg("licht", [[0, "#fff", 0.2], [0.35, "#fff", 0], [0.6, "#000", 0.06], [0.85, "#000", 0.2], [1, "#000", 0.28]], 0, -175, 0, 0, US);
  const R = "#2a1c1b", ROSA = "#c9928a";
  const relief = (inh) => F ? `<g filter="${T.relief("haut", { f: 1.1, tiefe: 0.06, okt: 2, seed: 4 })}">${inh}</g>` : inh;
  /* Zehen: vier kurze Zehen mit Nägeln, von der Seite drei sichtbar */
  const zehen = (kk) => {
    const m = kk.L.length - 1, xv = kk.L[m][0], xh = kk.R[m][0];
    let d = "";
    [[0.12, 5.5], [0.42, 6], [0.72, 5]].forEach(([q, w]) => { const x = xv - (xv - xh) * q; d += `M${H.f(x - w)} -.8Q${H.f(x - w + 0.5)} -6 ${H.f(x)} -6.5 ${H.f(x + w - 0.5)} -6 ${H.f(x + w)} -.8Z`; });
    return `<path d="${d}" fill="#5e4a47" stroke="#2a1d1a" stroke-width=".6" stroke-opacity=".45"/>` + (F ? `<path d="${d}" fill="none" stroke="#e8cfc6" stroke-opacity=".18" stroke-width=".6" transform="translate(-.5 -.7)"/>` : "");
  };
  const bein = (J, fill, fern2) => {
    const kk = kette(J), m = J.length - 1;
    return teil(kk.pts, fill, {
      ov: fern2 ? [] : [licht], rim: 10,
      innen: kerben(querfalten(kk, 1, m - 0.2, F ? 0.3 : 0.7, 0.06, 0.94, 2.2), 2.8, fern2 ? 0.25 : 0.3) +
        wf(G(kk.R.map((p) => [p[0], p[1]]), false), "#000", fern2 ? 0.2 : 0.26, 4, false) + wf(G(kk.L.slice(1).map((p) => [p[0], p[1]]), false), "#fff", fern2 ? 0.08 : 0.14, 3, false) +
        wf([[kk.R[0][0], J[0][1] + 30], [J[0][0], J[0][1] + 36], [kk.L[0][0], J[0][1] + 30]], "#000", 0.3, 6, false) +
        `<path d="M${H.f(kk.L[m][0])} -2.5L${H.f(kk.R[m][0])} -2.5" stroke="#2e2020" stroke-width="5" stroke-opacity=".3"/>`,
    }) + zehen(kk);
  };
  let s = "", k = "";
  /* kurzer, abgeplatteter Schwanz mit Borsten */
  const borsten = []; for (let i = 0; i < (F ? 12 : 4); i++) { const a = -0.5 + i / 11, l = 6 + T.rnd() * 5; borsten.push([[24, -84], [23.5 + a * 2, -84 + l * 0.5], [23 + a * 5, -84 + l]]); }
  k += teil(kette([[32, -116, 4.5, 4.5], [27, -100, 3.6, 3.6], [24, -86, 2.8, 2.8]]).pts, haut, { ov: [licht], rw: 0.5, rim: 3 }) + L(borsten, "#241a18", 0.8, 0.9);
  /* Beine: sehr kurz und dick */
  const vorder = (x) => [[x - 2, -86, 25, 25], [x, -48, 21, 20], [x + 1, -22, 19.5, 19], [x + 2, -8, 20.5, 19.5], [x + 2.5, 0, 21.5, 20, 3]];
  const hinter = (x) => [[x - 4, -96, 31, 31], [x, -56, 23, 23], [x - 1, -24, 19.5, 19.5], [x, -8, 20, 19.5], [x + 0.5, 0, 21, 19.5, 3]];
  k += bein(vorder(246), fern, 1) + bein(hinter(106), fern, 1);
  k += bein(vorder(274), haut) + bein(hinter(80), haut);
  /* Rumpf: Tonne, Bauch hängt fast bis zum Boden */
  const rumpf = [[30, -112], [50, -132], [90, -146], [150, -153], [210, -154], [262, -152], [300, -150], [326, -146],
    [336, -120], [332, -86], [320, -66], [304, -58], [282, -49], [250, -37], [200, -29], [150, -31], [124, -40], [104, -50], [76, -60], [46, -78], [32, -96]];
  k += teil(rumpf, haut, {
    ov: [licht], rim: 20, randD: G(rumpf.slice(19).concat(rumpf.slice(0, 12)), false) + G(rumpf.slice(13, 17), false),
    innen: wf([[56, -130], [90, -143], [150, -150], [210, -151], [262, -149], [300, -147]], "#fff", 0.4, 2, false) + wf([[120, -146], [180, -149]], "#fff", 0.35, 1, false) + wf([[90, -126], [200, -132], [280, -134]], "#fff", 0.12, 9, false) +
      wf([[130, -46], [200, -42], [260, -48]], "#000", 0.22, 7, false) + wf([[150, -32.5], [200, -30.5], [250, -38.5]], "#f0c8bc", 0.3, 1.5, false) +
      wf([[236, -140], [230, -100], [238, -70]], "#000", 0.14, 7, false) + wf([[112, -132], [104, -96], [112, -60]], "#000", 0.14, 7, false) +
      wf([[70, -120], [96, -128]], "#fff", 0.14, 9, false) +
      wf([[60, -110], [100, -80], [160, -60], [240, -58], [300, -70]], "#000", 0.16, 12, false) +
      (F ? L([[[150, -120], [178, -112]], [[200, -96], [214, -100], [230, -98]], [[90, -110], [104, -100]], [[250, -120], [262, -126]]], "#e9cfc4", 0.7, 0.35) : "") +
      kerben([[[300, -148], [306, -112], [300, -74]], [[314, -144], [320, -110], [316, -78]], [[288, -142], [290, -116]], [[240, -60], [262, -52], [280, -54]], [[110, -58], [104, -86], [100, -110]]], 4, 0.28),
  });
  /* Kopf: riesig, Kastenschnauze; Augen, Ohren und Nasenlöcher oben auf einer Linie */
  const kopf = [[300, -153], [320, -160], [338, -165], [352, -172], [364, -174], [375, -168], [382, -155], [398, -147], [418, -143], [430, -147], [442, -147], [451, -140], [457, -130], [461, -114],
    [462, -96], [459, -80], [452, -68], [442, -60], [428, -54], [408, -50], [386, -50], [362, -54], [340, -60], [322, -68], [310, -88], [302, -120]];
  k += teil(kopf, haut, {
    ov: [licht], rim: 14, randD: G(kopf.slice(0, 24), false), rimD: G(kopf.slice(0, 24), false),
    innen: wf([[350, -94], [390, -84], [430, -76], [455, -72], [446, -58], [410, -52], [370, -54], [346, -70]], ROSA, 0.35, 3) +
      wf([[330, -150], [346, -128], [352, -104]], ROSA, 0.4, 5, false) + wf([[358, -168], [372, -158]], ROSA, 0.45, 4, false) +
      wf([[386, -151], [420, -141], [446, -139]], "#fff", 0.4, 1.6, false) + wf([[454, -128], [460, -106]], "#fff", 0.25, 2, false) + wf([[340, -162], [356, -170], [370, -170]], "#fff", 0.4, 1.4, false) +
      wf([[350, -60], [400, -50], [440, -56]], "#000", 0.22, 4, false) + wf([[366, -122], [400, -110], [430, -104]], "#000", 0.1, 6, false) + wf([[400, -126], [430, -118]], "#fff", 0.16, 6, false) + wf([[318, -130], [330, -100]], "#fff", 0.1, 6, false) +
      kerben([[[358, -90], [376, -84], [400, -80], [430, -76], [455, -72]], [[322, -146], [330, -118], [326, -86]], [[312, -136], [316, -104]], [[356, -90], [352, -82], [356, -70], [366, -62]]], 2.8, 0.45) + wf([[372, -80], [410, -74], [446, -68]], "#000", 0.22, 2, false) + wf([[380, -60], [420, -56]], "#fff", 0.12, 3, false) + `<path d="M432 -143.5C436 -146.5 444 -146.5 448 -143.5 444 -141.5 436 -141.5 432 -143.5Z" fill="#2a1a18" opacity=".75"/>` + wf([[430, -148], [444, -148.5]], "#fff", 0.3, 0.8, false) + wf([[428, -138], [448, -137]], "#000", 0.15, 1.5, false) + wf([[356, -158], [366, -155], [378, -159]], "#000", 0.25, 1.4, false) + wf([[358, -172], [368, -175]], "#fff", 0.3, 1, false) + kerben([[[356, -160], [364, -156], [374, -157]], [[354, -155], [362, -151], [372, -152]], [[380, -164], [383, -158]]], 1.4, 0.3) +
      kerben([[[350, -86], [346, -78], [350, -68]]], 2, 0.3) +
      (F ? H.haare([[440, -100], [458, -100], [458, -70], [440, -70]], 22, 30, 2.2, { farben: [["#1c1412", 1, 0.25, 0.7]], streuung: 40 }) +
        H.haare([[400, -64], [450, -64], [440, -52], [400, -50]], 14, 80, 2, { farben: [["#1c1412", 1, 0.25, 0.6]], streuung: 40 }) : ""),
  });
  s += relief(k);
  /* Augen auf Höckern, rosa umrandet */
  s += wf([[359, -169], [366, -172.5], [373, -169]], "#2a1a18", 0.35, 0.9, false);
  s += T.augeReal(366.5, -165, 3, { iris: "#5a3418", iris2: "#21110a", offen: 0.62, pupille: "quer", wimpern: 6, wimpernLaenge: 0.8, lid: "#3a2420", haut: ROSA, winkel: 6 });
  /* kleine Ohren, innen rosa */
  s += relief(teil([[334, -162], [330, -172], [332, -180], [338, -178], [341, -169], [340, -161]], "#7a6264", { rw: 0.4, rim: 2, innen: `<ellipse cx="335.5" cy="-172" rx="2.2" ry="5" fill="${ROSA}" opacity=".85"/>` }));
  return { svg: s, box: [20, -181, 462, 0], fuesse: [276.5, 248.5, 80.5, 106.5], kopf: [296, -183, 463, -44] };
}

/* =====================================================================
   GAZELLE
   ===================================================================== */
/* RECHERCHE Gazelle (Thomson-Gazelle, Eudorcas thomsonii):
   Kopf-Rumpf 80–120 cm, Schwanz 15–27 cm (schwarz, ständig wedelnd), Schulterhöhe 55–82 cm, 15–30 kg.
   Fell sandbraun bis rötlich, darunter hellbraunes Band, dann der breite SCHWARZE FLANKENSTREIF vom Ellbogen
   bis vor den Oberschenkel, Bauch weiß. Weißer Spiegel am Hinterteil, schwarz gerandet. Gesicht: weißer
   Augenring, schwarzer Streif vom Augenwinkel zur Nase, rotbrauner Streif darüber, dunkler Nasenfleck.
   Hörner (Bock 25–43 cm) stark geringelt, leicht leierförmig nach hinten, Spitzen nach vorn. Schlanke Läufe. */
function gazelle(T) {
  const H = mach(T, 1, 0.25), { teil, L, kette, G, wf, kerben } = H, F = T.fein, US = H.US;
  const fell = T.lg("fell", [[0, "#b9783f"], [0.5, "#c7884c"], [1, "#c99460"]], 0, -80, 0, -40, US);
  const fern = T.lg("fern", [[0, "#a06c3e"], [1, "#8c6646"]], 0, -60, 0, 0, US);
  const licht = T.lg("licht", [[0, "#fff", 0.2], [0.35, "#fff", 0], [0.6, "#000", 0.06], [1, "#000", 0.24]], 0, -118, 0, 0, US);
  const WS = "#f3eee4", SW = "#16110d";
  const haar = (pts, n, w, l, farben) => (F ? H.haare(pts, n, w, l, { farben, streuung: 14, kruemmung: 0.12 }) : "");
  /* Beine: schlank; vorn Ellbogen, Vorderfußwurzel mit schwarzer Haarbürste; hinten Z: Knie vorn, Sprunggelenk hinten, langer Mittelfuß */
  const vorder = (x) => [[x + 2, -58, 5.2, 5.2], [x, -42, 3.6, 3.2], [x - 0.5, -27, 2.4, 2.3], [x - 0.5, -23, 2.7, 2.6], [x - 0.5, -19, 1.9, 1.9], [x - 0.2, -6.5, 1.55, 1.65], [x + 0.3, -4.4, 1.95, 1.95], [x + 1.6, -2.4, 1.5, 1.4]];
  const hinter = (x) => [[x + 4, -60, 8.5, 8.5], [x + 12, -45, 5.4, 4.6], [x + 7, -34, 3, 3.6], [x, -23, 1.7, 3, 2], [x + 0.4, -19, 1.6, 1.7], [x + 1.2, -6.5, 1.5, 1.6], [x + 1.6, -4.4, 1.95, 1.95], [x + 3, -2.4, 1.5, 1.4]];
  const huf = (x) => H.huf(x, 2.6, 1.6, 1.4, T.lg("hufg", [[0, "#2e2620"], [1, "#120e0b"]]), true);
  const bein = (J, fill, fern2, vorn) => {
    const kk = kette(J);
    return teil(kk.pts, fill, {
      ov: fern2 ? [] : [licht], rim: 2,
      innen: wf(G(kk.R.map((p) => [p[0], p[1]]), false), "#000", 0.25, 0.6, false) + wf(G(kk.L.slice(1).map((p) => [p[0], p[1]]), false), "#fff", 0.2, 0.5, false) +
        `<path d="${G(kk.R.slice(3).map((p) => [p[0] + 0.6, p[1]]).concat(kk.R.slice(3).reverse().map((p) => [p[0] - 1.6, p[1]])))}" fill="${WS}" opacity=".55"/>` +
        (vorn ? `<path d="M${H.f(J[3][0] + 2.8)} -25.5Q${H.f(J[3][0] + 1)} -22 ${H.f(J[3][0] + 2.4)} -19.5L${H.f(J[3][0] + 0.6)} -20.5Q${H.f(J[3][0])} -23 ${H.f(J[3][0] + 1.2)} -26Z" fill="${SW}" opacity=".8"/>` : "") +
        haar(kk.pts.slice(1, -2), 50, 95, 1.2, [["#5a3a1c", 1, 0.12, 0.35], ["#f1d8b0", 1, 0.1, 0.3]]),
    }) + huf(J[J.length - 1][0]);
  };
  let s = "";
  /* Schwanz: kurz, schwarz, buschig, leicht abgespreizt */
  s += teil([[24.5, -70], [21.2, -67], [18.8, -61], [18, -55], [19.6, -52], [21.2, -57], [23.7, -63], [26.9, -68]], SW, { ov: [], rand: false,
    oben: haar([[24.5, -70], [18.8, -61], [18, -54], [21.2, -57]], 30, 110, 2.4, [["#000", 1, 0.25, 0.8], ["#4a3a2e", 1, 0.2, 0.7]]) });
  s += bein(vorder(78), fern, 1, 1) + bein(hinter(36), fern, 1);
  s += bein(vorder(86), fell, 0, 1) + bein(hinter(27), fell);
  /* Rumpf mit Hals */
  const rumpf = [[24.5, -70], [34.9, -75], [55.9, -72], [78, -72], [90, -78], [100, -88], [110, -100], [116, -110],
    [123, -102], [116, -88], [106, -72], [100, -60], [96, -47], [90, -41], [80, -39], [65.6, -42], [52.7, -43], [43, -47], [34.9, -50], [26.9, -50], [20.4, -55], [18, -62]];
  s += teil(rumpf, fell, {
    ov: [licht], rim: 4, randD: G(rumpf.slice(19).concat(rumpf.slice(0, 13)), false) + G(rumpf.slice(14, 18), false),
    innen:
      /* weißer Bauch, schwarzer Flankenstreif, helles Band darüber */
      `<path d="M40 -45C52 -48 66 -49 82 -47 92 -46 98 -44 100 -38L100 -30 30 -30Z" fill="${WS}"/>` +
      `<path d="${G([[38.2, -48.5], [49.4, -52.5], [63.9, -54], [80, -52.5], [90, -50], [91, -47], [80, -47.5], [63.9, -48.5], [49.4, -47.6], [39.8, -46]])}" fill="${SW}"/>` +
      `<path d="${G([[39.8, -51], [51.1, -55.5], [65.6, -57], [82, -55.5], [88, -53.5], [82, -52.5], [65.6, -54], [51.1, -52.6], [40.6, -49]])}" fill="#e3c597" opacity=".9"/>` +
      /* Spiegel: weiß, vorn schwarz gesäumt */
      `<path d="M17 -70C23 -70 27 -66 28.5 -59 29.5 -55 28 -52 24 -50L16 -50Z" fill="${WS}"/>` + L([[[23.7, -69], [26.1, -62], [26.5, -55], [24.5, -49]]], SW, 1.4, 0.9) +
      /* Kehle und Brust heller */
      `<path d="${G([[118, -104], [124, -100], [118, -88], [110, -74], [104, -62], [100, -56], [104, -66], [110, -80]])}" fill="${WS}" opacity=".75"/>` +
      wf([[30.1, -72], [55.9, -70], [78, -70], [92, -80], [110, -102]], "#fff", 0.3, 1.4, false) + wf([[46.2, -50], [63.9, -50.5], [82, -49.5]], "#000", 0.15, 2, false) +
      wf([[84, -66], [92, -58], [94, -50]], "#000", 0.18, 2, false) + wf([[86, -64], [76, -56]], "#fff", 0.12, 3, false) + wf([[50, -50], [70, -48]], "#000", 0.2, 3, false) + wf([[38.2, -66], [44.6, -56], [43, -48]], "#000", 0.12, 2.4, false) + wf([[82, -70], [90, -64]], "#fff", 0.16, 2.4, false) +
      wf([[28.5, -66], [36.6, -70]], "#fff", 0.18, 2.4, false) +
      haar(rumpf, 650, (x, y) => (x > 90 ? 115 : 168), 1.8, [["#6a4220", 3, 0.13, 0.35], ["#f4dcb4", 2, 0.11, 0.35], ["#3a2410", 1, 0.12, 0.3]]),
  });
  /* Kopf: klein, spitz zulaufend, große Augen */
  let k = "";
  const kopf = [[114, -111], [119, -114.5], [125, -114.5], [131, -110.5], [136, -105], [139.5, -100.5], [140.6, -97.4], [139.4, -95.2], [136, -94.4], [131, -95], [125, -96.4], [120, -99], [115.5, -104]];
  k += teil(kopf, fell, {
    ov: [licht], rim: 2, randD: G(kopf.slice(0, 12), false), rimD: G(kopf.slice(0, 12), false),
    innen:
      /* weißer Streif vom Auge zur Nase, darunter der schwarze, rotbrauner Nasenrücken, dunkler Nasenfleck, weißes Kinn */
      (F ? wf([[123, -109.5], [129, -106.8], [135.5, -102.6], [139, -99.6], [137.5, -98.8], [134, -101], [128, -104.4], [122.5, -106.8]], WS, 1, 0.25) : `<path d="${G([[123, -109.5], [129, -106.8], [135.5, -102.6], [139, -99.6], [137.5, -98.8], [134, -101], [128, -104.4], [122.5, -106.8]])}" fill="${WS}"/>`) +
      (F ? wf([[123.5, -106], [129, -103.4], [134.5, -100.2], [138, -98.2], [136.5, -97.4], [133, -98.6], [128, -101], [123, -103.6]], SW, 0.9, 0.25) : `<path d="${G([[123.5, -106], [129, -103.4], [134.5, -100.2], [138, -98.2], [136.5, -97.4], [133, -98.6], [128, -101], [123, -103.6]])}" fill="${SW}" opacity=".92"/>`) +
      wf([[121, -114], [128, -112.3], [134, -108.2], [138.4, -103.6], [137, -103], [131, -107.2], [125.5, -110.8]], "#8a4c22", 0.8, 0.6) +
      `<ellipse cx="137.6" cy="-102.4" rx="2" ry="1.3" transform="rotate(40 137.6 -102.4)" fill="#2a1a10" opacity=".75"/>` +
      `<path d="${G([[139.6, -96.4], [138, -94.6], [134, -94.4], [128, -95.6], [124, -97.4], [130, -97.2], [136, -96.4]])}" fill="${WS}"/>` +
      kerben([[[139.6, -98.4], [140.2, -97.3], [139.7, -96.1]], [[140, -95.6], [137.8, -95.4], [135.5, -95.7]]], 0.4, 0.8) +
      wf([[118, -100], [126, -97.5]], "#000", 0.22, 0.8, false) + wf([[117, -104], [121, -100.5]], "#000", 0.15, 1.2, false) + wf([[126, -113.5], [133, -110]], "#fff", 0.25, 0.6, false) +
      haar(kopf, 110, (x, y) => (x > 128 ? 150 : 175), 0.9, [["#5a3a1c", 1, 0.08, 0.35], ["#fff", 1, 0.07, 0.3]]) +
      (F ? T.schnurrhaare(139.5, -96, 5, 2.4, 110, 50, "#1a1410", 0.06) : ""),
  });
  /* Auge: groß, dunkel, weißer Ring, Brauenschatten */
  k += wf([[121, -110.5], [125, -111.6], [129, -110]], "#2a1a0e", 0.35, 0.5, false);
  k += T.augeReal(125.2, -107.6, 1.55, { iris: "#3a2210", iris2: "#120904", offen: 0.8, pupille: "quer", wimpern: 8, wimpernLaenge: 0.7, lid: "#0d0805", haut: "#f2ece0", winkel: 24 });
  /* Hörner: stark geringelt, leierförmig – erst nach hinten, Spitzen nach vorn */
  const horn = (dx, fill) => {
    const J = [[120.6 + dx, -114, 1.5, 1.5], [119.6 + dx, -122, 1.4, 1.4], [117.4 + dx, -131, 1.15, 1.15], [116.4 + dx, -139, 0.85, 0.85], [117.6 + dx, -145, 0.5, 0.5], [119.4 + dx, -148.5, 0.15, 0.15]];
    const kk = kette(J), ringe = [];
    for (let t = 0.2; t < 3; t += F ? 0.24 : 0.5) { const [p, q] = H.an(kk, t); ringe.push([[p[0] + 0.2, p[1] + 0.1], [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + 0.45], [q[0] - 0.2, q[1] + 0.1]]); }
    return teil(kk.pts, fill, { rw: 0.12, randA: 0.5, ov: [T.lg("hornv", [[0, "#fff", 0.25], [0.5, "#fff", 0], [1, "#000", 0.3]], 0, 0, 1, 0)],
      innen: kerben(ringe, 0.5, 0.65, "#000") + wf([[J[1][0] - 0.6, J[1][1]], [J[3][0] - 0.4, J[3][1]]], "#fff", 0.3, 0.3, false) });
  };
  k += horn(-1.6, "#1f1913") + horn(0, "#2f261d");
  /* Ohren: lang, spitz, nach oben-hinten; außen bräunlich mit dunklem Rand, innen weiße Haare */
  const ohr = (dx, dy, fill, nah) => teil([[117 + dx, -111 + dy], [113 + dx, -115 + dy], [109 + dx, -120 + dy], [106.5 + dx, -124.5 + dy, 1], [109.8 + dx, -123 + dy], [114 + dx, -119.5 + dy], [118.5 + dx, -114 + dy]], fill,
    { rw: 0.12, rim: 0.8, innen: L([[[106.8 + dx, -124.2 + dy], [110 + dx, -122.6 + dy], [114 + dx, -119 + dy]]], "#3a2412", 0.5, 0.7) +
      (nah ? `<path d="M${109 + dx} ${-121 + dy}Q${113 + dx} ${-118.5 + dy} ${117 + dx} ${-113 + dy}" stroke="${WS}" stroke-width=".9" fill="none" opacity=".8"/>` : "") });
  k += ohr(1.5, -1, "#a8713e") + ohr(0, 0, "#c48b55", 1);
  s += k;
  return { svg: s, box: [16, -149, 141, 0], fuesse: [88, 80, 30, 39], kopf: [104, -150, 142, -92] };
}

/* =====================================================================
   GNU
   ===================================================================== */
/* RECHERCHE Gnu (Streifengnu, Connochaetes taurinus):
   Bulle Schulterhöhe ~1,5 m (Kuh 1,35 m), Kopf-Rumpf 2–2,4 m, Schwanz 60–100 cm, 180–250 kg. Vorne schwer, Rücken
   fällt vom Widerrist-Buckel zur Kruppe ab. Großer Kopf mit breiter Schnauze und Ramsnase, Gesicht schwarz.
   Hörner bei beiden Geschlechtern: erst seitlich, dann nach unten, dann nach oben-innen gebogen. Schwarze Stehmähne,
   hängender Bart (beim Streifengnu dunkel, beim Weißbartgnu weiß), langer schwarzer Pferdeschwanz. Fell
   schiefergrau mit bläulichem Schimmer, an Hals und Schulter dunkle senkrechte Querbänder. */
function gnu(T) {
  const H = mach(T, 1, 0.35), { teil, L, kette, G, wf, kerben } = H, F = T.fein, US = H.US;
  const fell = T.lg("fell", [[0, "#8a827c"], [0.45, "#726a65"], [0.8, "#5c5550"], [1, "#544c47"]], 0, -160, 0, -50, US);
  const fern = T.lg("fern", [[0, "#5d5550"], [1, "#4a433f"]], 0, -80, 0, 0, US);
  const licht = T.lg("licht", [[0, "#fff", 0.2], [0.35, "#fff", 0], [0.6, "#000", 0.08], [1, "#000", 0.26]], 0, -165, 0, 0, US);
  const SW = "#141110";
  const haar = (pts, n, w, l, farben, o = {}) => (F ? H.haare(pts, n, w, l, Object.assign({ farben, streuung: 14, kruemmung: 0.14 }, o)) : "");
  /* Beine: schlank, dunkel graubraun; vorn Ellbogen + Vorderfußwurzel, hinten Z mit Sprunggelenk */
  const vorder = (x) => [[x + 2, -90, 10.5, 10.5], [x, -54, 6.6, 6], [x, -40, 4.6, 4.5], [x, -35, 5, 4.9], [x, -30, 3.8, 3.8], [x + 0.3, -12, 3.3, 3.5], [x + 0.8, -8.5, 4.2, 4.2], [x + 2.6, -4.6, 3.5, 3.2]];
  const hinter = (x) => [[x + 4, -92, 14, 14], [x + 15, -68, 8.6, 7.6], [x + 9, -52, 5.2, 6.2], [x, -38, 3.5, 5.6, 2], [x + 0.5, -32, 3.4, 3.4], [x + 1.5, -12, 3.3, 3.4], [x + 2, -8.5, 4.2, 4.2], [x + 4, -4.6, 3.5, 3.2]];
  const huf = (x) => H.huf(x, 4.6, 3.5, 3.2, T.lg("hufg", [[0, "#2a2420"], [1, "#100d0b"]]), true);
  const bein = (J, fill, fern2) => {
    const kk = kette(J);
    return teil(kk.pts, fill, {
      ov: fern2 ? [] : [licht], rim: 3,
      innen: wf(G(kk.R.map((p) => [p[0], p[1]]), false), "#000", 0.28, 1, false) + wf(G(kk.L.slice(1).map((p) => [p[0], p[1]]), false), "#fff", 0.16, 0.8, false) +
        wf([[J[3][0] + 2.6, J[3][1] - 2], [J[5][0] + 2.6, J[5][1]]], "#000", 0.15, 0.7, false) +
        haar(kk.pts.slice(1, -2), 30, 95, 1.5, [["#2a2420", 1, 0.14, 0.35], ["#a39a92", 1, 0.12, 0.25]]),
    }) + huf(J[J.length - 1][0]);
  };
  let s = "";
  /* Schwanz: lang, schwarz, Pferdehaar */
  const schweif = [[30, -126], [28, -112], [26, -94], [23, -74], [20, -56], [21, -46], [26, -46], [29, -60], [31, -80], [32, -100], [33, -116], [34, -125]];
  s += teil(schweif, SW, { ov: [], rand: false, oben: haar(schweif, 70, (x, y) => (y < -100 ? 112 : 100), 7, [["#000", 2, 0.3, 0.8], ["#4a403a", 1, 0.25, 0.7]], { streuung: 8 }) });
  s += bein(vorder(128), fern, 1) + bein(hinter(56), fern, 1);
  s += bein(vorder(140), fell) + bein(hinter(42), fell);
  /* Rumpf: vorn hoch und schwer, Rücken fällt zur Kruppe */
  const rumpf = [[30, -127], [46, -133], [90, -141], [124, -151], [150, -149], [166, -142], [182, -131],
    [186, -108], [176, -98], [166, -90], [158, -81], [152, -72], [138, -69], [100, -71], [72, -75], [56, -79], [40, -86], [30, -102], [28, -118]];
  const baender = []; for (let x = 92; x < 176; x += 4.6 + T.rnd() * 4) { const h = x > 150 ? 4 : 0, u = -78 - (x < 110 ? (110 - x) * 0.9 : 0); baender.push([[x + 5 + h, -150 + h], [x + 1 + (T.rnd() - 0.5) * 2, -118], [x - 3 + h * 0.6, u]]); }
  s += teil(rumpf, fell, {
    ov: [licht], rim: 6, randD: G(rumpf.slice(16).concat(rumpf.slice(0, 11)), false) + G(rumpf.slice(12, 15), false),
    innen: `<path d="${baender.map((b, i) => G(kette(b.map((p, j) => [p[0], p[1], [0.4, 1.3 + (i % 3) * 0.35, 0.3][j], [0.4, 1.3 + (i % 3) * 0.35, 0.3][j]])).pts)).join("")}" fill="#1f1a18" opacity=".42"${F ? ` filter="${H.weich(0.5)}"` : ""}/>` +
      wf([[40, -128], [90, -138], [124, -147], [150, -147]], "#fff", 0.2, 3, false) + wf([[110, -132], [134, -140]], "#fff", 0.14, 6, false) +
      wf([[80, -66], [110, -65], [140, -66]], "#000", 0.26, 4, false) + wf([[124, -136], [118, -100], [126, -72]], "#000", 0.14, 5, false) +
      wf([[64, -120], [56, -96], [58, -76]], "#000", 0.14, 4, false) + wf([[44, -118], [54, -126]], "#fff", 0.14, 5, false) +
      haar(rumpf, 270, (x, y) => (x > 150 ? 100 : 172), 2.2, [["#2e2825", 3, 0.16, 0.32], ["#a69d95", 2, 0.13, 0.2], ["#5a4e45", 1, 0.15, 0.3]]),
  });
  /* Stehmähne schwarz, Bart hängend (Streifengnu: dunkel) */
  const maehne = [[100, -143], [116, -152], [134, -158], [152, -156], [166, -149], [182, -139], [182, -131], [166, -142], [150, -148], [126, -151], [104, -142]];
  s += teil(maehne, SW, { ov: [], rand: false, oben: haar(maehne, 230, -95, 5, [["#000", 2, 0.35, 0.85], ["#5a4e46", 1, 0.3, 0.7]], { streuung: 10 }) });
  const bart = [[190, -103], [183, -106], [175, -95], [166, -87], [160, -79], [157, -71], [161, -68], [168, -76], [177, -86], [185, -95], [193, -99]];
  s += teil(bart, SW, { ov: [], rand: false, oben: haar(bart, 100, 100, 8, [["#000", 2, 0.35, 0.85], ["#4f4540", 1, 0.3, 0.75]], { streuung: 12 }) });
  if (F) s += H.haare([[182, -100], [170, -88], [160, -75], [157, -66], [163, -66], [176, -82]], 30, 100, 6, { farben: [["#000", 1, 0.3, 0.8]], streuung: 16, kruemmung: 0.25 });
  /* Kopf: lang, Ramsnase, breites Maul, schwarzes Gesicht */
  let k = "";
  const kopf = [[170, -142], [178, -148], [186, -148], [192, -140], [198, -127], [204, -113], [209, -101], [213, -94], [217, -89], [219, -83], [219, -77], [216, -73.5], [209, -72.5], [201, -76],
    [194, -83], [188, -92], [183, -102], [178, -112], [172, -122], [168, -132]];
  k += teil(kopf, T.lg("kopf", [[0, "#3c3532"], [0.5, "#2a2422"], [1, "#1a1615"]], 0, 0, 1, 1), {
    ov: [licht], rim: 3, randD: G(kopf.slice(0, 19), false), rimD: G(kopf.slice(0, 19), false),
    innen: wf([[184, -147], [194, -134], [202, -118], [209, -104]], "#8a7f78", 0.45, 1.2, false) + wf([[176, -126], [186, -112], [192, -100]], "#000", 0.25, 2.4, false) +
      wf([[208, -96], [217, -86], [218, -77], [209, -74], [204, -84]], "#000", 0.35, 1.2) +
      kerben([[[213, -91], [216.5, -88.5], [219, -88]], [[218.5, -77.5], [212, -76.6], [205, -77.5]]], 1, 0.85) + wf([[200, -80], [206, -78]], "#000", 0.3, 0.8, false) + wf([[188, -112], [196, -98], [202, -88]], "#fff", 0.08, 2, false) +
      haar(kopf, 100, (x, y) => (x > 196 ? 118 : 150), 1.4, [["#000", 2, 0.12, 0.4], ["#7a706a", 1, 0.1, 0.35]]) +
      (F ? T.schnurrhaare(216, -76, 6, 3.4, 110, 50, "#0d0b0a", 0.08) : ""),
  });
  /* Auge mit Brauenwulst */
  k += wf([[180, -133.5], [185, -135.5], [190, -133]], "#000", 0.4, 0.7, false);
  k += T.augeReal(184.8, -130.6, 1.55, { iris: "#3b2010", iris2: "#110804", offen: 0.75, pupille: "quer", wimpern: 8, wimpernLaenge: 0.8, lid: "#0a0706", haut: "#2a2421", winkel: 50 });
  /* Ohr */
  k += teil([[176, -143], [170, -148], [163, -151], [161, -149], [165, -144], [172, -140]], "#4c4440", { rw: 0.15, rim: 1, innen: L([[[163, -149.5], [169, -146]]], "#c9c0b8", 0.8, 0.5) });
  /* Hörner: seitlich heraus (fast waagerecht), dann nach oben und innen gebogen; dunkel, an der Basis gerippt */
  const horn = (dx, dy, fill) => {
    const kk = kette([[180 + dx, -149 + dy, 3.4, 3.4], [188 + dx, -150 + dy, 3, 3], [195 + dx, -147.5 + dy, 2.5, 2.5], [200 + dx, -151 + dy, 2, 2], [201.5 + dx, -159 + dy, 1.5, 1.5], [199 + dx, -167 + dy, 0.9, 0.9], [195 + dx, -171 + dy, 0.2, 0.2]]);
    const ringe = []; for (let t = 0.15; t < 1.6; t += F ? 0.3 : 0.6) { const [p, q] = H.an(kk, t); ringe.push([p, [(p[0] + q[0]) / 2 + 0.4, (p[1] + q[1]) / 2], q]); }
    return teil(kk.pts, fill, { rw: 0.15, ov: [T.lg("hv", [[0, "#fff", 0.28], [0.5, "#fff", 0], [1, "#000", 0.3]])], innen: kerben(ringe, 0.6, 0.5, "#000") });
  };
  k += horn(-3, -3, "#1f1a17") + horn(0, 0, T.lg("horn", [[0, "#2c2622"], [1, "#4f4740"]], 0, 0, 1, 0));
  s += `<g transform="translate(182 -131) scale(.82) translate(-176 142)">${k}</g>`;
  return { svg: s, box: [19, -163, 218, 0], fuesse: [143, 131, 46, 60], kopf: [164, -160, 218, -58] };
}

module.exports = [
  { id: "elefant", de: "der Elefant", syl: "e-le-FANT", it: "l'elefante", itSyl: "e-le-FAN-te", en: "elephant",
    gruppe: "Rüsseltiere", lebensraum: "Savanne", laenge: 4.95, hoehe: 3.49, zeichne: elefant },
  { id: "giraffe", de: "die Giraffe", syl: "gi-RAF-fe", it: "la giraffa", itSyl: "gi-RAF-fa", en: "giraffe",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 4.25, hoehe: 5.55, zeichne: giraffe },
  { id: "zebra", de: "das Zebra", syl: "ZE-bra", it: "la zebra", itSyl: "ZE-bra", en: "zebra",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 2.17, hoehe: 2.2, zeichne: zebra },
  { id: "nashorn", de: "das Nashorn", syl: "NAS-horn", it: "il rinoceronte", itSyl: "ri-no-ce-RON-te", en: "rhinoceros",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 3.92, hoehe: 2.03, zeichne: nashorn },
  { id: "nilpferd", de: "das Nilpferd", syl: "NIL-pferd", it: "l'ippopotamo", itSyl: "ip-po-PO-ta-mo", en: "hippopotamus",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 4.42, hoehe: 1.81, zeichne: nilpferd },
  { id: "gazelle", de: "die Gazelle", syl: "ga-ZEL-le", it: "la gazzella", itSyl: "gaz-ZEL-la", en: "gazelle",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 1.25, hoehe: 1.49, zeichne: gazelle },
  { id: "gnu", de: "das Gnu", syl: "GNU", it: "lo gnu", itSyl: "GNU", en: "wildebeest",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 1.99, hoehe: 1.63, zeichne: gnu },
];
