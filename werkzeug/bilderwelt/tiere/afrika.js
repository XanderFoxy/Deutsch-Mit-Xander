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
  const fd = (n) => String(Math.round(n * m) / m), f = fd;
  const f1 = (n) => String(Math.round(n * 10) / 10);
  /* glatte Kurve wie T.glatt, aber mit eigener Rundung (große Tiere: ganze cm) */
  const G = (pts, zu = true, sp = 1, genau) => {
    const f = genau ? f1 : fd;
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
    const d = typeof pts === "string" ? pts : G(pts, true, o.sp || 1, o.genau);
    if (!F && !o.innen && !o.unter && !o.oben && !(o.ov || []).length) return `<path d="${d}" fill="${fill}"/>`;
    const id = T.id("t" + nr++);
    T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
    const u = (a) => `<use href="#${id}" ${a}/>`;
    let s = u(`fill="${fill}"`);
    const ov = o.ov || [];
    const fell = F && o.fell ? o.fell.map((g) => Array.isArray(g) ? u(`fill="${g[0]}" opacity="${g[1]}"`) : u(`fill="${g}"`)).join("") : "";
    const rimStil = () => `fill="none" stroke="${o.rimG || H.RIM()}" stroke-width="${f(o.rim)}" filter="${H.weich(o.rim * 0.22)}"`;
    const rim = o.rim && F ? (o.rimD ? `<path d="${o.rimD}" ${rimStil()}/>` : u(rimStil())) : "";
    const randA = o.randA != null ? o.randA : 0;
    const randStil = `fill="none" stroke="${o.rand || "#1a140e"}" stroke-opacity="${randA}" stroke-width="${f(2 * (o.rw || RW))}" stroke-linejoin="round"`;
    const rand = randA > 0 && o.rand !== false ? (o.randD ? `<path d="${o.randD}" ${randStil}/>` : u(randStil)) : "";
    const innen = (o.unter || "") + fell + (o.innen || "") + ov.map((g) => u(`fill="${g}"`)).join("") + rim + (o.oben || "") + rand;
    if (innen) s += `<g clip-path="url(#${id}c)">${innen}</g>`;
    return H.vol(s, o.vol);
  };
  /* Volumen je Körperteil (T.volumen, ANLEITUNG 13): Gruppe mit Rundungsfilter (Licht links oben), nur bei Feinheit */
  H.vol = (s, v) => {
    if (!v || !F || !T.volumen) return s;
    const [w, ti, um] = Array.isArray(v) ? v : [v];
    const tt = ti || 4, uu = um != null ? um : 0.35;
    return `<g filter="${T.volumen("v" + Math.round(tt * 10) + "_" + Math.round(uu * 100), { weich: w, tiefe: tt, umgebung: uu })}">${s}</g>`;
  };
  /* mehrere offene Linien in EINEM Pfad */
  H.L = (zuege, farbe, w, op = 1, extra = "", genau) => zuege.length ?
    `<path d="${zuege.map((p) => G(p, false, 1, genau)).join("")}" fill="none" stroke="${farbe}" stroke-width="${f1(w)}"${op < 1 ? ` stroke-opacity="${Math.round(op * 100) / 100}"` : ""} stroke-linecap="round" stroke-linejoin="round"${extra}/>` : "";
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
    if (!F) return H.L(zuege, farbe, w * 0.45, op * 0.8, "", w < 3);
    let d = "";
    for (let z of zuege) {
      if (z.length === 2) z = [z[0], [(z[0][0] + z[1][0]) / 2, (z[0][1] + z[1][1]) / 2], z[1]];
      if (z.length === 3) {
        const [a, mi, e] = z, dx = e[0] - a[0], dy = e[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l * w, ny = dx / l * w;
        const c = (s) => [2 * mi[0] - (a[0] + e[0]) / 2 + nx * s, 2 * mi[1] - (a[1] + e[1]) / 2 + ny * s];
        const c1 = c(0.5), c2 = c(-0.5);
        const g = w < 3 ? f1 : f;
        d += `M${g(a[0])} ${g(a[1])}Q${g(c1[0])} ${g(c1[1])} ${g(e[0])} ${g(e[1])}Q${g(c2[0])} ${g(c2[1])} ${g(a[0])} ${g(a[1])}Z`;
        continue;
      }
      const n = z.length;
      d += G(H.kette(z.map((p, i) => { const q = w * (0.12 + 0.88 * Math.sin(Math.PI * i / (n - 1))) / 2; return [p[0], p[1], q, q]; })).pts, true, 1, w < 3);
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
    return `M${f1(x + nx)} ${f1(y + ny)}Q${f1(cx + nx * 0.5)} ${f1(cy + ny * 0.5)} ${f1(ex)} ${f1(ey)}Q${f1(cx - nx * 0.5)} ${f1(cy - ny * 0.5)} ${f1(x - nx)} ${f1(y - ny)}Z`;
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
        const mx = (xx + ex) / 2 - Math.sin(a) * kk * l, my = (yy + ey) / 2 + Math.cos(a) * kk * l;
        eimer[j] += `M${f1(xx)} ${f1(yy)}Q${f1(mx)} ${f1(my)} ${f1(ex)} ${f1(ey)}`;
      }
    }
    T.def(`<pattern id="${id}" width="${W}" height="${W}" patternUnits="userSpaceOnUse" patternTransform="rotate(${winkel})"><g fill="none" stroke-linecap="round">` +
      eimer.map((d, j) => d ? `<path d="${d}" stroke="${farben[j][0]}" stroke-width="${farben[j][2]}" stroke-opacity="${farben[j][3]}"/>` : "").join("") + `</g></pattern>`);
    return `url(#${id})`;
  };
  /* Rissnetz der Haut als kachelbares Muster: Zellgröße z (cm), Rille w; dunkle Rille + helle Kante unten rechts */
  H.rissMuster = (name, z, w, op, o = {}) => {
    const id = T.id("rm" + name);
    if (weichSchon.has(id)) return `url(#${id})`;
    weichSchon.add(id);
    const N = o.n || 5, W = N * z, s = o.seed || 1;
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
      eimer[j] += `M${f1(x + nx * b)} ${f1(y + ny * b)}C${f1(c1x + nx * b)} ${f1(c1y + ny * b)} ${f1(c2x + nx * b * 0.4)} ${f1(c2y + ny * b * 0.4)} ${f1(ex)} ${f1(ey)}C${f1(c2x - nx * b * 0.4)} ${f1(c2y - ny * b * 0.4)} ${f1(c1x - nx * b)} ${f1(c1y - ny * b)} ${f1(x - nx * b)} ${f1(y - ny * b)}Z`;
    }
    return eimer.map((d, j) => d ? `<path d="${d}" fill="${farben[j][0]}" fill-opacity="${farben[j][3]}"/>` : "").join("");
  };
  /* Auge (Seitenansicht, Blick nach rechts): Augenhöhle mit Brauenwulst und Schlagschatten, Lidhaut, gewölbter Augapfel,
     Iris mit Fasern und dunklem Rand, artgerechte Pupille, Himmelsreflex, Fensterglanz + Zweitreflex, dicker Oberlidwulst,
     feuchter Unterlidrand, dunkle Bindehautfalte vorn, natürliche Wimpern (nach vorn-unten hängend, unregelmäßig).
     (T.augeReal als Vorbild – eigene Fassung, weil die Wimpern dort als Kamm stehen.) */
  H.auge = (x, y, r, o = {}) => {
    const off = o.offen != null ? o.offen : 0.7, W = r * 1.32, Ho = r * off, Hu = Ho * 0.72;
    if (!F) return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(W * 1.15)}" ry="${f1(Ho * 1.1)}" fill="#120a06"/><circle cx="${f1(x + r * 0.3)}" cy="${f1(y - Ho * 0.4)}" r="${f1(r * 0.22)}" fill="#fff" opacity=".8"/>`;
    const id = T.id("ag" + nr++);
    const spalt = `M${f1(-W)} 0C${f1(-W * 0.5)} ${f1(-Ho * 1.15)} ${f1(W * 0.45)} ${f1(-Ho * 1.2)} ${f1(W)} ${f1(-Ho * 0.1)}C${f1(W * 0.5)} ${f1(Hu * 1.1)} ${f1(-W * 0.4)} ${f1(Hu * 1.15)} ${f1(-W)} 0Z`;
    T.def(`<clipPath id="${id}"><path d="${spalt}"/></clipPath>`);
    const bez = (t, p0, p1, p2, p3) => { const u = 1 - t; return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]; };
    const ob = (t) => bez(t, [-W, 0], [-W * 0.5, -Ho * 1.15], [W * 0.45, -Ho * 1.2], [W, -Ho * 0.1]);
    const un = (t) => bez(t, [W, -Ho * 0.1], [W * 0.5, Hu * 1.1], [-W * 0.4, Hu * 1.15], [-W, 0]);
    const iris = T.rg("ir" + (o.iris || "#3a2212").slice(1), [[0, o.iris2 || "#120804"], [0.28, o.iris2 || "#120804"], [0.32, o.iris || "#3a2212"], [0.8, o.iris || "#3a2212"], [1, "#0a0503"]], 0.5, 0.5, 0.5);
    let s = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${o.winkel || 0})">`;
    /* Augenhöhle: weiche Mulde, Brauenwulst mit Licht, sein Schatten fällt aufs Oberlid */
    s += H.wf([[-W * 1.9, r * 0.2], [-W * 1.2, -r * 1.5], [W * 0.4, -r * 1.75], [W * 1.8, -r * 0.7], [W * 1.4, r * 1.1], [-W * 0.6, r * 1.3]], o.hoehle || "#000", o.hoehleA != null ? o.hoehleA : 0.2, r * 0.45);
    s += H.wf([[-W * 1.5, -r * 1.2], [-W * 0.2, -r * 2.05], [W * 1.4, -r * 1.35]], "#fff", 0.22, r * 0.22, false, r * 0.5);
    s += H.wf([[-W * 1.15, -r * 0.8], [0, -r * 1.35], [W * 1.15, -r * 0.6]], "#000", 0.35, r * 0.18, false, r * 0.45);
    /* Lidhaut, Spalt, Augapfel */
    s += `<path d="${spalt}" transform="scale(1.2 1.32)" fill="${o.lidHaut || "#2a1f18"}"/>`;
    s += `<path d="${spalt}" fill="#0b0705"/><g clip-path="url(#${id})">`;
    s += `<circle cx="${f1(r * 0.12)}" cy="0" r="${f1(r * 0.95)}" fill="${iris}"/>`;
    if (F) {
      let fa = "";
      for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2 + T.rnd() * 0.15; fa += `M${f1(r * 0.12 + Math.cos(a) * r * 0.36)} ${f1(Math.sin(a) * r * 0.36)}L${f1(r * 0.12 + Math.cos(a) * r * 0.86)} ${f1(Math.sin(a) * r * 0.86)}`; }
      s += `<path d="${fa}" stroke="${o.faser || "#6b4428"}" stroke-width="${f1(Math.max(0.05, r * 0.035))}" stroke-opacity=".35" fill="none"/>`;
    }
    const p = o.pupille || "quer";
    if (p === "quer") s += `<rect x="${f1(r * 0.12 - r * 0.55)}" y="${f1(-r * 0.22)}" width="${f1(r * 1.1)}" height="${f1(r * 0.44)}" rx="${f1(r * 0.2)}" fill="#050302" opacity=".85"/>`;
    else s += `<circle cx="${f1(r * 0.14)}" cy="0" r="${f1(r * 0.4)}" fill="#050302" opacity=".85"/>`;
    /* Himmelsreflex oben, Lidschatten, Glanz */
    s += `<ellipse cx="${f1(r * 0.1)}" cy="${f1(-r * 0.45)}" rx="${f1(r * 0.9)}" ry="${f1(r * 0.38)}" fill="#9aa6b0" opacity=".22"/>`;
    s += `<rect x="${f1(-W)}" y="${f1(-r * 1.2)}" width="${f1(2 * W)}" height="${f1(r * 1.25)}" fill="${T.lg("lidsch", [[0, "#000", 0.85], [0.55, "#000", 0.25], [1, "#000", 0]])}"/>`;
    s += `<rect x="${f1(r * 0.28)}" y="${f1(-r * 0.55)}" width="${f1(r * 0.32)}" height="${f1(r * 0.24)}" rx="${f1(r * 0.08)}" fill="#fff" opacity=".88"/>`;
    s += `<ellipse cx="${f1(-r * 0.3)}" cy="${f1(r * 0.36)}" rx="${f1(r * 0.16)}" ry="${f1(r * 0.07)}" fill="#cfd8de" opacity=".35"/></g>`;
    /* Oberlidwulst (dick), Lidfalte darüber, Unterlid mit feuchtem Rand, Bindehautfalte vorn (dunkel) */
    const obP = [0, 0.15, 0.32, 0.5, 0.68, 0.85, 1].map(ob);
    s += `<path d="M${f1(-W)} 0C${f1(-W * 0.5)} ${f1(-Ho * 1.15)} ${f1(W * 0.45)} ${f1(-Ho * 1.2)} ${f1(W)} ${f1(-Ho * 0.1)}" fill="none" stroke="${o.lid || "#120a06"}" stroke-width="${f1(r * 0.26)}" stroke-linecap="round"/>`;
    s += H.L([obP.map((q) => [q[0] * 1.02, q[1] - r * 0.24 - Math.abs(q[0]) * 0.02])], o.lidLicht || "#8a7a6a", Math.max(0.05, r * 0.07), 0.5, "", 1);
    s += H.L([obP.slice(1, 6).map((q) => [q[0] * 1.08, q[1] * 1.55 - r * 0.42])], "#000", Math.max(0.05, r * 0.06), 0.45, "", 1);
    s += `<path d="M${f1(W)} ${f1(-Ho * 0.1)}C${f1(W * 0.5)} ${f1(Hu * 1.1)} ${f1(-W * 0.4)} ${f1(Hu * 1.15)} ${f1(-W)} 0" fill="none" stroke="${o.lid || "#120a06"}" stroke-width="${f1(r * 0.1)}"/>`;
    s += H.L([[0.15, 0.4, 0.65, 0.85].map(un).map((q) => [q[0], q[1] + r * 0.09])], o.feucht || "#c9b0a0", Math.max(0.05, r * 0.05), 0.55, "", 1);
    s += `<path d="M${f1(W * 0.82)} ${f1(-Ho * 0.35)}Q${f1(W * 1.12)} ${f1(-Ho * 0.08)} ${f1(W * 0.85)} ${f1(Hu * 0.25)}" fill="none" stroke="#1a0d0a" stroke-width="${f1(r * 0.12)}" stroke-linecap="round"/>`;
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
        d += `M${f1(q[0] - b)} ${f1(q[1] - r * 0.1)}Q${f1(cx)} ${f1(cy)} ${f1(ex)} ${f1(ey)}Q${f1(cx + b)} ${f1(cy + b * 0.5)} ${f1(q[0] + b)} ${f1(q[1] - r * 0.1)}Z`;
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
    if (!F) return `<path d="${G(p, true, 1, 1)}" fill="${farbe}"/>`;
    if (spalt) s += H.teil(p.map((q) => [q[0] + h * 0.18, q[1] - h * 0.03, q[2]]), o.fern || "#0f0c0a", { ov: [hg], genau: 1 });
    const rillen = [];
    if (F) for (let k = 1; k <= 3; k++) { const t = k / 4; rillen.push([[x - lh * 0.95 + (lv * 1.65 + lh * 0.95) * t, -h * 0.98], [x - lh * 1.05 + (lv + sp * 0.85 + lh * 1.05) * t + sp * 0.3, -h * 0.05]]); }
    s += H.teil(p, farbe, { ov: [hg], genau: 1,
      innen: H.L(rillen, "#000", h * 0.05, 0.25, "", 1) + (spalt ? H.L([[[x + lv * 0.2, -h * 0.98], [x + lv * 0.5 + sp * 0.5, -h * 0.45], [x + lv * 0.75 + sp * 0.7, -h * 0.02]]], "#000", h * 0.07, 0.6, "", 1) : "") +
        H.L([[[x + lv * 0.75, -h * 0.9], [x + lv + sp * 0.75, -h * 0.25]]], "#fff", h * 0.07, 0.3, "", 1) });
    /* Kronrand: heller Haarsaum */
    s += H.L([[[x - lh * 1.0, -h * 1.0], [x, -h * 1.08], [x + lv * 0.8, -h * 1.02]]], o.saum || "#d8c8a6", h * 0.12, 0.55, "", 1);
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
      fell: rissB, vol: [14, 4, 0.4],
      innen: zyl(kk, 1, 62, 0.8) + falte(querfalten(kk, 3.1, 4.2, 0.2, 0.15, 0.85, 3), 2.6, 0.3) +
        wf([[kk.R[1][0] - 5, -150], [J[1][0], -142], [kk.L[1][0] + 5, -150]], "#000", 0.45, 8, false, 30) + `<rect x="${H.f(kk.R[m][0] - 5)}" y="-95" width="90" height="95" fill="${staub}"/>`,
    }) + naegel(kk.L[m][0], kk.R[m][0], 2);
  };
  k += beinF([[284, -250, 38, 38], [284, -175, 36, 34], [286, -122, 29, 28], [287, -82, 25.5, 25], [287, -62, 27, 26.5], [288, -30, 29.5, 28.5], [289, -11, 33, 31.5], [289, 0, 34.5, 33, 3]]);
  k += beinF([[112, -240, 44, 42], [118, -170, 38, 36], [116, -122, 30, 33], [110, -98, 27, 35, 2], [107, -74, 26, 27.5], [106, -32, 27.5, 27], [106, -11, 30.5, 29.5], [106, 0, 32, 30.5, 3]]);
  /* nahe Beine unter dem Rumpf (der Rumpf deckt Schulter und Keule); Gelenke ausgeformt, je Bein eigenes Volumen */
  const beinN = (J, i0, mod, n) => {
    const kk = kette(J), m = J.length - 1;
    return teil(kk.pts, haut, {
      fell: rissB,
      ov: [licht], innen: mod + zyl(kk, i0, 64) + `<rect x="${H.f(kk.R[m][0] - 5)}" y="-95" width="90" height="95" fill="${staub}"/>` +
        falte(querfalten(kk, 3.2, 4.3, 0.17, 0.12, 0.88, 3.4), 2.8, 0.34) + (F ? falte(querfalten(kk, m - 1.6, m - 0.8, 0.3, 0.2, 0.8, 2.5), 2.4, 0.24) : "") +
        `<path d="M${H.f(kk.L[m][0] + 1)} -3L${H.f(kk.R[m][0] - 1)} -3" stroke="#241b13" stroke-width="5" stroke-opacity=".45"/>`,
      vol: [15, 4, 0.4], randD: H.seiten(kk, i0),
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
  /* Schwanz: tiefer an der Kruppenrundung, Wurzel dick, Ende eine flache Doppelreihe drahtiger Haare (bis zur Ferse) */
  const sk = kette([[30, -264, 7, 7], [18, -238, 6, 6], [11, -205, 4.4, 4.4], [8, -170, 3.1, 3.1], [6, -132, 2.3, 2.3]]);
  const sw = [[6, -132], [6.5, -126]];
  k += teil(sk.pts, haut, { fell: rissB, ov: [lichtX], vol: [2, 4, 0.4], innen: wf([[26, -262], [14, -200], [8, -140]], "#fff", 0.15, 1.5, false) }) +
    H.straehnen(sw, 13, 30, (x, y, t) => 88 + (t - 0.5) * 30, [["#16110d", 3, 1.2, 0.95], ["#3d342c", 1, 1, 0.9]], { streu: 16, welle: 0.08, szene: 0.5 });
  /* Rumpf: Schulter (Widerrist) am höchsten, Sattel, Kruppe tiefer; Bauch hinter dem Vorderbein am tiefsten, zur Flanke ansteigend */
  const rumpf = [[24, -262], [40, -292], [76, -314], [118, -318], [165, -305], [210, -315], [244, -331], [268, -336], [300, -330], [336, -310],
    [350, -262], [351, -212], [341, -172], [318, -148], [290, -142], [274, -136], [254, -140], [232, -143], [196, -150], [158, -160], [128, -168], [96, -172], [58, -176], [30, -192], [14, -220], [12, -244]];
  /* Ohr: Umriss wie Afrika – oben breit, hinten Ausbuchtung mit Golf und Kerben, unten ein nach vorn zeigender Lappen */
  const ohr = [[356, -326], [322, -334], [286, -334], [256, -327], [238, -309], [228, -284], [231, -262], [238, -254], [236, -246], [244, -229], [241, -222], [252, -205],
    [266, -184], [281, -168], [294, -153], [305, -145], [313, -150], [326, -166], [341, -186], [357, -214], [367, -246], [369, -286], [364, -314]];
  const ohrD = G(ohr);
  const ohrSchatten = F ? `<path d="${ohrD}" transform="translate(11 12)" fill="#000" opacity=".3" filter="${H.weich(6)}"/>` : "";
  k += teil(rumpf, haut, {
    fell: rissR, ov: [licht, lichtX], vol: [40, 4, 0.4], rim: 20,
    innen: /* Rückenlicht, große Hängefalten hinter der Schulter und vor der Flanke als weiche Volumen */
      wf([[40, -286], [78, -308], [118, -312], [165, -299], [210, -309], [244, -324], [268, -329], [300, -324]], "#fff", 0.2, 6, false) +
      wf([[226, -300], [220, -250], [226, -196], [240, -162]], "#000", 0.22, 8, false) + wf([[238, -296], [234, -250], [240, -200]], "#fff", 0.1, 6, false) +
      wf([[156, -290], [148, -240], [150, -184]], "#000", 0.16, 9, false) + wf([[168, -286], [162, -240], [164, -190]], "#fff", 0.08, 7, false) +
      wf([[290, -150], [240, -150], [196, -158], [158, -168]], "#d9c7aa", 0.16, 2.2, false) +
      kerben([[[230, -248], [226, -206], [234, -170]], [[150, -228], [146, -196], [150, -170]]], 3.4, 0.22) +
      ohrSchatten + wf([[300, -160], [282, -150], [268, -150]], "#000", 0.4, 6, false) + wf([[32, -262], [24, -220], [20, -190]], "#000", 0.3, 3, false, 8),
  });
  /* Kopf und Rüssel in einem Umriss (Scheitel unter dem Widerrist), Rüssel mit leichter S-Kurve, unten schlanker */
  const kopf = [[300, -322], [326, -330], [350, -328], [378, -318], [402, -298], [418, -272], [428, -242], [434, -205], [438, -160], [440, -112], [438, -72], [439, -46], [444, -28], [451, -18], [459, -13], [465, -10.5], [466, -8], [461, -7.5], [458, -6.5],
    [459, -4], [455, -3], [449, -5], [442, -10], [434, -26], [428, -60], [426, -100], [422, -145], [414, -182], [404, -196], [396, -186], [384, -180], [362, -192], [338, -212], [318, -248]];
  const rk = kette([[419, -240, 15, 24], [424, -200, 14, 20], [428, -155, 11.5, 12.5], [431, -108, 9, 9.5], [432, -68, 7, 7], [436, -38, 6, 6], [444, -18, 5.5, 5.5], [455, -8, 4.5, 4.5]]);
  k += teil(kopf, haut, {
    fell: rissK, ov: [lichtK, lichtX], vol: [12, 4, 0.4], rim: 14, rimD: G(kopf.slice(2, 22), false),
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
    fell: rissO, vol: [10, 3, 0.45], rim: 12,
    innen: wf([[352, -250], [356, -210], [346, -190]], "#000", 0.25, 8, false) + wf([[266, -292], [300, -300], [330, -296]], "#fff", 0.18, 10, false) +
      wf([[260, -190], [282, -170], [300, -158]], "#000", 0.35, 6, false) +
      wf(adern.map((z) => G(z.map((p) => [p[0] - 0.8, p[1] - 0.8]), false)).join(""), "#fff", 0.06, 0.75, false, 2) + wf(adern.map((z) => G(z.map((p) => [p[0] + 0.9, p[1] + 1]), false)).join(""), "#000", 0.07, 0.75, false, 1.8) +
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
  const H = mach(T, 0, 0.8), { teil, L, kette, kerben, falte, G, wf, zyl, drin } = H, F = H.F, US = H.US;
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
  const fHals = F ? H.fellMuster("h", 62, haarF, { tile: 9, n: 30, len: 2.6 }) : "";
  const fRumpf = F ? H.fellMuster("r", 168, haarF, { tile: 10, n: 30, len: 3 }) : "";
  const fBein = F ? H.fellMuster("b", 92, haarF, { tile: 7, n: 24, len: 2.2 }) : "";
  const fKopf = F ? H.fellMuster("k", 200, [["#fff6e2", 2, 0.2, 0.3], ["#3a1d0a", 2, 0.2, 0.28]], { tile: 6, n: 26, len: 1.5 }) : "";
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
    return "M" + pts.map((p) => fm(p[0]) + " " + fm(p[1])).join("L") + "Z";
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
      if (o.nur && !o.nur(c)) continue;
      const imm = drin(poly, c.x, c.y);
      if (!imm && !(o.rand && poly.some((p) => Math.abs(p[0] - c.x) < c.g && Math.abs(p[1] - c.y) < c.g))) continue;
      let zelle = [[c.x - c.g * 1.5, c.y - c.g * 1.5], [c.x + c.g * 1.5, c.y - c.g * 1.5], [c.x + c.g * 1.5, c.y + c.g * 1.5], [c.x - c.g * 1.5, c.y + c.g * 1.5]];
      let k = 0;
      for (const n of zentren) {
        if (n === c || Math.abs(n.x - c.x) > c.g * 2.2 || Math.abs(n.y - c.y) > c.g * 2.2) continue;
        const vx = n.x - c.x, vy = n.y - c.y, l = Math.hypot(vx, vy), nx = vx / l, ny = vy / l;
        const fu = (c.fuge + n.fuge) / 4 * (0.5 + 1.1 * c.r[k++ % 40]) + (F ? 1.1 : 0);
        zelle = halbebene(zelle, nx, ny, nx * (c.x + vx / 2) + ny * (c.y + vy / 2) - fu);
        if (zelle.length < 3) break;
      }
      if (zelle.length < 3) continue;
      /* gelappte Seiten: jede Kante mit 1–2 Zwischenpunkten, leicht nach innen/außen versetzt */
      const pts = [];
      for (let i = 0; i < zelle.length; i++) {
        const a = zelle[i], b = zelle[(i + 1) % zelle.length], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
        pts.push(a);
        if (l > c.g * 0.22 && F) { const am = (c.r[(i * 3 + 7) % 40] - 0.45) * c.g * 0.12; pts.push([a[0] + dx * 0.5 - dy / l * am, a[1] + dy * 0.5 + dx / l * am]); }
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
      kl[Math.floor(c.r[39] * 3)].push(qr(fin, c.g > 11 || !F ? 1 : 2));
    }
    return kl;
  };
  const fleckFarben = [T.lg("f1", [[0, "#5e2e10"], [0.5, "#74391a"], [1, "#9a6236"]], 0, -540, 0, -100, US), T.lg("f2", [[0, "#673512"], [0.5, "#7e431c"], [1, "#a46a3a"]], 0, -540, 0, -100, US),
    T.lg("f3", [[0, "#55290d"], [0.5, "#6c3516"], [1, "#94592e"]], 0, -540, 0, -100, US)];
  /* Ecken rund über einen gleichfarbigen Strich mit runden Ecken (klein in Bytes) */
  const fleckSVG = (kl, fern) => kl.map((d, i) => d.length ? `<path d="${d.join("")}" fill="${fern ? "#5c3418" : fleckFarben[i]}"${F ? ` stroke="${fern ? "#5c3418" : fleckFarben[i]}" stroke-width="2.2" stroke-linejoin="round"` : ""}${fern ? ` opacity=".85"` : ""}/>` : "").join("");
  /* ---- Umrisse ---- */
  /* Rumpf + Hals: Widerrist deutlich höchster Rückenpunkt, Rücken fällt ~24° zur Kruppe, Hüfthöcker, Brust weit vor dem Vorderbein */
  const rumpf = [[40, -292], [62, -300], [80, -304], [92, -309], [106, -306], [140, -322], [180, -343], [214, -362], [234, -374], [262, -410], [300, -460], [328, -496], [346, -516],
    [366, -486], [358, -470], [346, -452], [330, -422], [314, -386], [300, -344], [292, -304], [289, -268], [282, -238], [268, -216], [246, -206], [214, -202], [180, -199], [150, -202],
    [126, -212], [110, -220], [94, -226], [66, -238], [46, -258], [38, -276]];
  /* Zellen: Rumpf groß, Hals mittel, Beine klein (nach unten kleiner), Kopf winzig */
  const halsSeite = (x, y) => 80 * (y + 365) - 80 * (x - 225) < 0;
  feld(20, -380, 300, -190, 33, 3.8, (x, y) => !halsSeite(x, y));
  feld(200, -540, 380, -280, 22, 3, (x, y) => halsSeite(x, y));
  const beinZellen = (x0, x1, yEnde) => {
    for (let y = -200, z = 0; y < yEnde + 20; z++) {
      const g = Math.max(5, 16 - Math.max(0, (y - (yEnde - 70)) / 70) * 11);
      for (let x = x0 + (z % 2) * g / 2; x < x1; x += g) {
        const c = { x: x + (T.rnd() - 0.5) * g * 0.45, y: y + (T.rnd() - 0.5) * g * 0.45, g, fuge: 2.6, r: Array.from({ length: 40 }, () => T.rnd()) };
        if (c.y < yEnde - 22 + c.r[5] * 44 && c.r[6] > Math.max(0, (c.y - (yEnde - 30)) / 60)) zentren.push(c);
      }
      y += g * 0.85;
    }
  };
  beinZellen(186, 280, -112); beinZellen(70, 150, -128);
  let s = "";
  /* ---- Beine (unter dem Rumpf; der Rumpf deckt Schulter und Keule) ---- */
  const vorder = (x) => [[x + 6, -300, 26, 26], [x + 2, -228, 21, 20], [x + 1, -180, 13, 12.5], [x, -140, 10, 9.5], [x, -119, 9.5, 9], [x, -109, 11.5, 10.5], [x, -97, 7.6, 7.6], [x + 0.5, -62, 6.2, 6.8], [x + 1, -42, 6, 6.4], [x + 2, -31, 8, 8], [x + 6, -22.5, 6.6, 6.6], [x + 9.5, -17, 6.6, 6.2]];
  const hinter = (x) => [[x + 18, -280, 12, 40], [x + 26, -225, 26, 24], [x + 20, -185, 15, 16], [x + 5, -140, 9.5, 12], [x - 1, -124, 8, 14, 2], [x, -108, 7.2, 7.8], [x + 2, -62, 6.2, 6.8], [x + 3, -42, 6, 6.4], [x + 4, -31, 8, 8], [x + 8, -22.5, 6.6, 6.6], [x + 11.5, -17, 6.6, 6.2]];
  const huf = (x, fern) => H.huf(x, 17, 7, 6.6, T.lg(fern ? "hufd" : "hufg", fern ? [[0, "#2a221c"], [1, "#130f0c"]] : [[0, "#40342a"], [1, "#1c1611"]]), true, { saum: fern ? "#a99a7e" : "#e8dcc0" });
  const bein = (J, fern, vorn) => {
    const kk = kette(J), m = J.length - 1;
    const fl = fleckSVG(flecken(kk.pts, { ymin: -235, r0: 5, nur: fern || !F ? (c) => c.g > 9 : null }), fern);
    const knie = vorn ? H.wf([[J[5][0] - 9, J[5][1] - 4], [J[5][0] + 11, J[5][1] - 1], [J[5][0] + 9, J[5][1] + 6], [J[5][0] - 8, J[5][1] + 5]], "#8a8070", 0.35, 1.2) : "";
    return teil(kk.pts, fern ? laufFern : lauf, {
      fell: [fBein], vol: [3.2, 4, 0.4],
      innen: fl + knie +

        /* Beugesehne hinten am Röhrbein; beim Hinterbein die Achillessehne über dem Fersenhöcker */
        wf(G(H.laengs(kk, 0.2, vorn ? 6 : 5, m - 2), false), "#000", 0.22, 0.5, false, 1.2) +
        (vorn ? "" : wf(G(H.laengs(kk, 0.12, 2, 5), false), "#000", 0.22, 0.6, false, 1.4)) +
        (fern ? wf([[J[0][0] - 30, -210], [J[0][0] + 30, -210]], "#000", 0.45, 6, false, 20) : wf([[J[0][0] - 30, -204], [J[0][0] + 30, -204]], "#3a2410", 0.35, 4, false, 12)),
    }) + huf(J[m][0], fern);
  };
  s += bein(vorder(208), 1, 1) + bein(hinter(118), 1, 0);
  s += bein(vorder(246), 0, 1) + bein(hinter(80), 0, 0);
  /* ---- Schwanz: Rübe dick (oben gefleckt), verjüngt, Quaste dicht und voluminös, endet auf Höhe des Sprunggelenks ---- */
  const sk = kette([[42, -290, 4.6, 4.6], [36, -258, 3.4, 3.4], [30, -220, 2.4, 2.4], [26, -186, 1.9, 1.9], [24, -168, 1.8, 1.8]]);
  s += teil(sk.pts, creme, { fell: [fRumpf], ov: [lichtX], vol: [1, 4, 0.4], innen: `<path d="M38 -286Q42 -278 39 -268Q34 -276 38 -286Z" fill="${fleckFarben[0]}"/><path d="M34 -258Q37 -250 34 -242Q31 -250 34 -258Z" fill="${fleckFarben[1]}"/>` });
  s += H.straehnen([[24, -178], [24, -166]], 36, (t) => 34 + t * 6, (x, y, t) => 92 + (t - 0.5) * 24, [["#1a120b", 3, 0.9, 0.95], ["#3a2a1e", 2, 0.8, 0.9], ["#5a4535", 1, 0.7, 0.85]], { streu: 18, welle: 0.35, szene: 0.4 });
  /* ---- Rumpf und Hals ---- */
  const halsZone = [[200, -340], [240, -380], [300, -470], [350, -530], [400, -470], [330, -300], [300, -230], [260, -330]];
  const fl = fleckSVG(flecken(rumpf, { umriss: rumpf, r0: 20 }));
  s += teil(rumpf, creme, {
    ov: [licht, lichtX], vol: [16, 4, 0.4], rim: 10, rimD: G(rumpf.slice(0, 22), false),
    innen: fl + (F ? `<path d="${G(halsZone)}" fill="${fHals}"/><path d="M0 -380H260L230 -190H0Z" fill="${fRumpf}"/>` : "") +
      /* Licht: Widerrist, Schulter, Kruppe; Hals: Mähnenseite hell, Kehlseite dunkel; Okklusion an den Beinansätzen */
      wf([[58, -296], [92, -304], [140, -317], [180, -338], [214, -356], [234, -368], [262, -404], [300, -454], [328, -490]], "#fff", 0.22, 4, false) +

      wf([[358, -470], [344, -448], [328, -418], [312, -382], [298, -342], [290, -300]], "#4a2c12", 0.32, 4, false, 16) +
      wf([[284, -300], [270, -250], [254, -218]], "#3a2410", 0.2, 6, false) +
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
  s += teil(maehne, T.lg("mae", [[0, "#6a3c1c"], [1, "#9a6438"]], 0, 0, 0.6, 0.6), {
    fell: F ? [H.fellMuster("m", -138, [["#2e1608", 2, 0.45, 0.8], ["#c0905c", 1, 0.4, 0.6]], { tile: 6, n: 24, len: 5, streu: 0.25 })] : [],
    oben: H.straehnen(aussen.map((p, i) => { const n = nAch(i); return [p[0] - n[0] * 2.5, p[1] - n[1] * 2.5]; }), F ? 45 : 0, 5, (x, y) => -140 + (x - 280) * 0.02, [["#2e1608", 2, 0.5, 0.9], ["#8a5a32", 2, 0.45, 0.85]], { streu: 22, welle: 0.15, szene: 1 }) });
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
    fell: [fKopf], ov: [lichtX], vol: [5, 4, 0.4], rim: 4, rimD: G(kopf.slice(0, 21), false),
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
    let o = teil(pts, fern ? "#a88c68" : T.lg("ossf", [[0, "#ead9b8"], [1, "#b48d62"]], 0, 0, 1, 0), { fell: [fKopf], vol: [1.2, 4, 0.4] });
    const wurzeln = []; for (let i = 0; i <= 8; i++) { const q = i / 8 * Math.PI * 1.2 - Math.PI * 0.1; wurzeln.push([tp[0] + Math.cos(a + q - Math.PI / 2) * 2.4, tp[1] + Math.sin(a + q - Math.PI / 2) * 2.4]); }
    o += H.straehnen(wurzeln, 18, 3.6, (x, y) => Math.atan2(y - tp[1] + Math.sin(a) * 1.2, x - tp[0] + Math.cos(a) * 1.2) * 180 / Math.PI, [[fern ? "#120b06" : "#1c130c", 3, 0.5, 0.95], ["#4e3a2a", 1, 0.45, 0.85]], { streu: 18, welle: 0.25, szene: 0.4 });
    return o;
  };
  /* Ohr: lanzettlich (3 : 1), spitz, seitlich nach hinten, 15° unter der Waagrechten; innen Creme mit Haarbüscheln */
  const ohr = (fern) => {
    const b = K(5, -6.5), a = (180 + 16) * Math.PI / 180, l = fern ? 16 : 23, w = 4, nx = -Math.sin(a), ny = Math.cos(a), P = (t, q) => [b[0] + Math.cos(a) * l * t + nx * w * q, b[1] + Math.sin(a) * l * t + ny * w * q];
    const pts = [P(0, -0.8), P(0.3, -1.05), P(0.65, -0.8), P(1, 0, 1), P(0.65, 0.85), P(0.3, 1.1), P(0, 0.8)];
    return teil(pts, fern ? "#9c8462" : "#d9c39c", { fell: [fKopf], vol: [1.2, 3, 0.45],
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
  const H = mach(T, T.fein ? 1 : 0, 0.5), { teil, L, kette, G, wf, kerben, falte } = H, F = H.F, US = H.US;
  const weiss = T.lg("weiss", [[0, "#fbfaf6"], [0.5, "#f1ede4"], [1, "#e2dccf"]], 0, -200, 0, 0, US);
  const fernW = T.lg("fernw", [[0, "#cfc8bb"], [1, "#b6ae9f"]], 0, -110, 0, 0, US);
  /* Rumpf als Walze: Lichtband oben, Kernschatten im unteren Viertel, warmes Bodenreflexlicht an der Bauchkante */
  const licht = T.lg("licht", [[0, "#fff", 0.1], [0.3, "#fff", 0], [0.6, "#3a3226", 0.06], [0.82, "#3a3226", 0.26], [0.93, "#3a3226", 0.18], [1, "#cfc4b0", 0.2]], 0, -135, 0, -60, US);
  const SW = "#141110", SWf = "#1d1a17";
  /* Fell: kurze Haare in Wuchsrichtung, als Muster; die Streifenkanten fransen über einen Haarstrich-Rand aus */
  const hf = [["#000", 2, 0.14, 0.09], ["#fff", 1, 0.14, 0.25]];
  const fHals = F ? H.fellMuster("h", 58, hf, { tile: 6, n: 20, len: 1.4, streu: 0.6 }) : "";
  const fRumpf = F ? H.fellMuster("r", 172, hf, { tile: 6, n: 20, len: 1.6, streu: 0.6 }) : "";
  const fBein = F ? H.fellMuster("b", 92, hf, { tile: 4, n: 18, len: 1, streu: 0.6 }) : "";
  const fKopf = F ? H.fellMuster("k", 52, hf, { tile: 3, n: 12, len: 0.8, streu: 0.6 }) : "";
  const kanteR = F ? H.fellMuster("kr", 172, [[SW, 1, 0.25, 0.9]], { tile: 3, n: 14, len: 1.2, streu: 0.5 }) : "";
  const kanteH = F ? H.fellMuster("kh", 58, [[SW, 1, 0.25, 0.9]], { tile: 3, n: 14, len: 1.1, streu: 0.5 }) : "";
  const kanteB = F ? H.fellMuster("kb", 92, [[SW, 1, 0.2, 0.9]], { tile: 3, n: 14, len: 0.8, streu: 0.5 }) : "";
  /* Streifen: Mittellinie + halbe Breiten → Band; alle Bänder gleich orientiert (keine Löcher, keine Schachbrett-Kreuzungen) */
  const flaeche = (p) => p.reduce((a, q, i) => { const n = p[(i + 1) % p.length]; return a + q[0] * n[1] - n[0] * q[1]; }, 0);
  const f1 = (v) => String(Math.round(v * (F ? 10 : 1)) / (F ? 10 : 1));
  const band = (z, b) => {
    if (z.length === 3) { /* Linse aus zwei Bögen, immer gleich orientiert (oben hin, unten zurück) */
      let [a, mi, e] = z; if (e[0] < a[0]) [a, e] = [e, a];
      const dx = e[0] - a[0], dy = e[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l * 2 * b[1], ny = dx / l * 2 * b[1];
      const cx = 2 * mi[0] - (a[0] + e[0]) / 2, cy = 2 * mi[1] - (a[1] + e[1]) / 2;
      return `M${f1(a[0])} ${f1(a[1])}Q${f1(cx - nx)} ${f1(cy - ny)} ${f1(e[0])} ${f1(e[1])}Q${f1(cx + nx)} ${f1(cy + ny)} ${f1(a[0])} ${f1(a[1])}Z`;
    }
    let p = kette(z.map((q, i) => [q[0], q[1], b[i], b[i]])).pts; if (flaeche(p) < 0) p = p.slice().reverse(); return G(p, true, 1, F);
  };
  const baender = (liste) => liste.map(([z, b]) => band(z, b)).join("");
  const streifenSVG = (d, kante, farbe = SW) => `<path d="${d}" fill="${farbe}"${F && kante ? ` stroke="${kante}" stroke-width="1"` : ""}/>`;
  const bog = (cx, cy, rx, ry, a0, a1, n) => { const p = []; for (let i = 0; i < n; i++) { const a = (a0 + (a1 - a0) * i / (n - 1)) * Math.PI / 180; p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return p; };
  /* ---- Beine: Unterarm kräftig, Vorderfußwurzel als Block, Röhrbein mit Beugesehne, Fesselkopf, Fessel 55°, Huf.
     Hinten Z: Knie vorn, Unterschenkel schräg nach hinten, Sprunggelenk mit Fersenhöcker ---- */
  const vorder = (x) => [[x + 5, -104, 11, 11], [x + 2, -70, 8.8, 8.2], [x + 1, -56, 6.5, 6], [x, -46.5, 6.3, 6.3], [x, -40, 4.7, 4.9], [x, -24, 4.3, 4.9], [x + 0.5, -15, 5.5, 5.5], [x + 3, -10, 4.2, 4], [x + 6, -7, 4.3, 4]];
  const hinter = (x) => [[x + 2, -104, 10, 16], [x + 9, -74, 10, 12], [x - 3, -57, 8.5, 8.6], [x - 12, -38, 6.4, 8.2, 2], [x - 10, -31, 4.6, 4.8], [x - 9, -20, 4.3, 4.8], [x - 8.5, -14, 5.5, 5.5], [x - 6, -9.5, 4.2, 4], [x - 3, -7, 4.3, 4]];
  const beinStreifen = (J, phase, vorn) => {
    const kk = kette(J), z = [];
    let y = -100 + phase, i = 0;
    while (y < -12) {
      const t = Math.max(0, (y + 100) / 88), w = (1.35 - t * 0.75) * (F ? 1 : 1.3), dy = (5.4 - t * 2.4) * (F ? 1 : 1.35);
      /* Mitte der Kette bei Höhe y */
      let m = J[0][0];
      for (let k = 0; k < J.length - 1; k++) if (J[k][1] <= y && J[k + 1][1] >= y) { const u = (y - J[k][1]) / (J[k + 1][1] - J[k][1]); m = J[k][0] + (J[k + 1][0] - J[k][0]) * u; }
      const gel = vorn ? Math.abs(y + 46) < 6 : Math.abs(y + 37) < 6;
      const v = gel ? 1.6 : 0.7;
      z.push([[[m - 12, y + 1.2], [m, y + v], [m + 12, y - (gel ? 1.4 : 0.6)]], [0, w * (0.75 + ((i * 53 + phase * 10) % 10) / 20), 0]]);
      y += dy * (0.92 + ((i * 37) % 10) / 60); i++;
    }
    return { kk, d: baender(z) };
  };
  const huf = (x, fern) => H.huf(x, 7.5, 4.6, 4.2, T.lg(fern ? "hufd" : "hufg", fern ? [[0, "#2a2724"], [1, "#151311"]] : [[0, "#3e3a35"], [1, "#1d1a17"]]), false, { schraeg: 0.62, saum: fern ? "#8a8478" : "#cfc8ba" });
  const bein = (J, fern, vorn, phase) => {
    const st = beinStreifen(J, phase, vorn), m = J.length - 1;
    return teil(st.kk.pts, fern ? fernW : weiss, {
      fell: [fBein], vol: [2.6, 4, 0.4],
      innen: `<g${fern ? ` opacity=".75"` : ""}>${streifenSVG(st.d, kanteB, fern ? SWf : SW)}</g>` +
        /* Beugesehne hinten am Röhrbein, Okklusion unter dem Rumpf, Fesselkopf */
        wf(G(H.laengs(st.kk, 0.2, 4, m - 2), false), "#000", 0.2, 0.35, false, 0.8) +
        wf([[J[0][0] - 14, -66], [J[0][0] + 14, -66]], "#000", fern ? 0.45 : 0.3, 3, false, 8) +
        (fern ? `<rect x="${J[0][0] - 30}" y="-110" width="60" height="110" fill="#000" opacity=".12"/>` : ""),
    }) + huf(J[m][0], fern);
  };
  let s = "";
  /* ---- Schwanz: Rübe am Ende der Kruppe, dick, verjüngt, mit Aalstrich und Querstreifen, schwarze Haarquaste ---- */
  const sk = kette([[55.4, -121, 3.8, 3.8], [51.4, -106, 3, 3], [49, -92, 2.6, 2.6], [48.2, -80, 2.3, 2.3]]);
  const sQuer = []; for (let y = -116, i = 0; y < -82; y += 4.4 - i * 0.2, i++) sQuer.push([[[44.2, y + 1], [49.8, y + 1.6], [58.6, y]], [0, 1.1 - i * 0.05, 0]]);
  s += wf([[53.8, -116], [51.4, -100], [50.6, -84]], "#000", 0.3, 1.5, false, 4);
  s += teil(sk.pts, weiss, { fell: [fRumpf], vol: [1.4, 4, 0.4], innen: streifenSVG(baender(sQuer) + band([[56.2, -122], [52.2, -106], [49.8, -90], [49, -80]], [1.2, 1, 0.9, 0.8])) });
  s += H.straehnen([[48.2, -83], [48.6, -78]], 34, (t) => 18 + t * 4, (x, y, t) => 93 + (t - 0.5) * 18, [[SW, 3, 0.45, 0.95], ["#3a3632", 2, 0.4, 0.9]], { streu: 12, welle: 0.35, szene: 0.3 });
  /* ---- Beine (ferne versetzt, dunkler, eigene Streifenfolge) ---- */
  s += bein(vorder(150), 1, 1, 2.1) + bein(hinter(79), 1, 0, 1.3);
  s += bein(vorder(162), 0, 1, 0) + bein(hinter(66), 0, 0, 0.8);
  /* ---- Rumpf mit Hals: kompakt (Rumpflänge ≈ Widerristhöhe), Widerrist, Bug vorstehend, runder Bauch hinter dem Ellbogen am tiefsten ---- */
  const rumpf = [[55.4, -121], [66.6, -127], [77.8, -128.5], [97, -126], [121, -125], [140, -129], [152, -133], [166, -146], [182, -162], [196, -176], [205, -183],
    [210, -170], [206, -156], [198, -138], [189, -117], [183, -104], [177, -94], [171, -84], [163, -74], [150, -66], [134, -64], [113, -64], [95.4, -67], [82.6, -71], [74.6, -73],
    [68.2, -70], [57, -74], [50.6, -84], [48.2, -97], [49.8, -110]];
  const st = [];
  /* Hals: quer zur Halsachse, vom Mähnenkamm zur Kehle, unten leicht nach hinten gebogen */
  const kamm = (t) => [150 + 55 * t, -132 - 51 * t], kehle = (t) => [170 + 38 * t, -94 - 72 * t];
  const halsT = [0.1, 0.18, 0.3, 0.42, 0.54, 0.66, 0.78, 0.89];
  halsT.forEach((t, i) => {
    const a = kamm(t), b = kehle(Math.max(0, t - 0.08)), m = [(a[0] + b[0]) / 2 - 2.5, (a[1] + b[1]) / 2 + 1.5];
    st.push([[[a[0] - 1, a[1] - 3], m, [b[0] + 2, b[1] + 2]], [3, 3.1 - i * 0.12, 1.6]]);
  });
  /* Schulter: schräg mit dem Schulterblatt, unten nach vorn auf den Oberarm (Winkel über dem Vorderbein) */
  st.push([[[146, -132], [150, -114], [158, -98], [166, -88], [172, -84]], [2.6, 3.2, 3.2, 2.4, 1]]);
  st.push([[[136, -129], [138, -110], [143, -92], [151, -79], [160, -72]], [2.4, 3.3, 3.3, 2.6, 1]]);
  /* Rumpf: senkrecht, unten 10–15° nach vorn und schmaler, in den Bauchstreif; eine Gabel */
  st.push([[[125, -126], [125, -104], [127, -84], [131, -67]], [2.6, 3.4, 2.8, 1.6]]);
  st.push([[[115.4, -125], [114.6, -104], [116.2, -84], [119.4, -66]], [2.6, 3.4, 2.8, 1.6]]);
  st.push([[[105.8, -125], [105, -105], [105.8, -90], [107.4, -78], [109.8, -66]], [2.6, 3.2, 2.8, 2.2, 1.4]]);
  st.push([[[105.4, -99], [104.2, -90], [101.8, -80], [100.2, -69]], [2.6, 2.2, 1.8, 1.2]]);
  /* Sattel: die hinteren Flankenstreifen biegen oben nach hinten und laufen als breite Bänder über die Keule;
     die oberen steigen zur Schwanzwurzel, die unteren biegen hinten auf den Oberschenkel nach unten */
  st.push([[[95.4, -68], [93.8, -86], [90.6, -104], [84.2, -113], [73, -117.5], [61.8, -118.5], [55.4, -118]], [1.4, 2.4, 2.8, 2.8, 2.8, 2.4, 1.4]]);
  st.push([[[87.4, -72], [84.2, -86], [77.8, -98], [68.2, -104], [57, -105], [49.8, -104]], [1.4, 2.6, 3.6, 4, 3.8, 2]]);
  st.push([[[79.4, -76], [74.6, -84], [66.6, -88], [57, -89], [49.8, -88]], [1.4, 3, 3.8, 3.8, 2]]);
  st.push([[[74.6, -73], [66.6, -74], [57.8, -74], [51.4, -72], [49, -66]], [1.2, 3, 3.6, 3.2, 1.6]]);
  st.push([[[71.4, -66], [63.4, -63], [56.2, -60], [52.2, -56]], [1, 2.8, 3, 2]]);
  /* Schattenstreifen mittig in den weißen Lücken der Keule */
  const schatten = [[[89, -100], [81, -108], [69.8, -112], [58.6, -112]], [[81, -92], [73, -96], [61.8, -97], [52.2, -97]], [[73, -82], [65, -81.5], [55.4, -81], [49.8, -80]]];
  /* Aalstrich (Rücken 2–2,5 cm, Kruppe 3,5–4 cm) und Bauchstreif */
  const aal = band([[55.4, -121.5], [66.6, -127], [77.8, -128], [97, -125.5], [121, -124.5], [140, -128.5], [152, -132.5]], [1.6, 2, 2, 1.4, 1.2, 1.2, 0.8]);
  const bauch = band([[87.4, -69.5], [105, -65.5], [125, -64.5], [148, -68]], [0.8, 1.5, 1.5, 0.8]);
  s += teil(rumpf, weiss, {
    ov: [licht], vol: [15, 4, 0.4], rim: 5, rimD: G(rumpf.slice(0, 11), false),
    innen: (F ? `<path d="M100 -140L200 -140L230 -200L150 -200L120 -140Z" fill="${fHals}"/><path d="M0 -140H175V-50H0Z" fill="${fRumpf}"/>` : "") +
      streifenSVG(baender(st) + aal + bauch, kanteR) + (F ? wf(schatten.map((z) => G(z, false)).join(""), "#a8957d", 0.42, 0.5, false, 1.8) : L(schatten, "#a8957d", 1.4, 0.4)) +
      /* Licht: Kruppe, Schulterblatt; Schatten: Ellbogen, Hinterkante der Keule; Halsunterseite dunkler; Kopf-Schlagschatten */
      wf([[61.8, -122], [74.6, -124], [85.8, -121]], "#fff", 0.35, 3, false) + wf([[140, -126], [150, -112], [160, -98]], "#fff", 0.2, 3, false) +
      wf([[150, -72], [146, -82]], "#000", 0.3, 2.5, false) + wf([[51.4, -108], [49.8, -94], [52.2, -80]], "#000", 0.2, 2.5, false) +
      wf([[206, -158], [198, -138], [186, -118], [176, -104]], "#2a2218", 0.3, 3, false, 10) + wf([[200, -170], [204, -158], [210, -148]], "#2a2218", 0.32, 3, false, 10) +
      wf([[74.6, -76], [69.8, -80]], "#000", 0.25, 1.5, false) + wf([[89, -66], [113, -62], [140, -63]], "#d5c9b2", 0.25, 1.2, false),
  });
  /* ---- Stehmähne: setzt die Halsstreifen fort (gleiche Zahl, gleicher Winkel), Spitzen dunkel, Oberkante gefranst ---- */
  const kammP = [[150, -132], [162, -142], [176, -155], [190, -167], [201, -177], [206, -182]];
  const mh = [3, 7, 11, 12, 10, 7];
  const mn = (i) => { const a = kammP[Math.max(0, i - 1)], b = kammP[Math.min(5, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [dy / l, -dx / l]; };
  const aussen = kammP.map((p, i) => [p[0] + mn(i)[0] * mh[i], p[1] + mn(i)[1] * mh[i]]);
  const maehne = aussen.concat(kammP.slice().reverse().map((p) => [p[0] + 0.8, p[1] + 2]));
  /* Mähnenbänder: gerade Vierecke vom Hals über die ganze Mähnenhöhe (gleiche Lage wie die Halsstreifen) */
  const mStr = halsT.map((t, i) => {
    const a = kamm(t), n = mn(Math.min(5, Math.round(t * 5))), d = [-n[1], n[0]], w = 3 - i * 0.12;
    const P = (s, q) => [a[0] + n[0] * s + d[0] * q, a[1] + n[1] * s + d[1] * q];
    return "M" + [P(-3, -w), P(20, -w * 0.9), P(20, w * 0.9), P(-3, w)].map((p) => H.f(p[0]) + " " + H.f(p[1])).join("L") + "Z";
  }).join("");
  s += teil(maehne, T.lg("mg", [[0, "#f3efe6"], [1, "#d9d2c4"]], 0, 0, 1, 1), {
    fell: F ? [H.fellMuster("m", -132, [["#000", 2, 0.2, 0.18], ["#fff", 1, 0.2, 0.35]], { tile: 4, n: 18, len: 4, streu: 0.15 })] : [],
    innen: `<path d="${mStr}" fill="${SW}"/>` + wf(aussen.map((p, i) => [p[0] - mn(i)[0] * 0.8, p[1] - mn(i)[1] * 0.8]), "#1a1512", 0.55, 0.6, false, 1.8) +
      wf(kammP.map((p) => [p[0] + 0.5, p[1] + 1]), "#000", 0.35, 1, false, 2.5) + wf(aussen.map((p, i) => [p[0] - mn(i)[0] * 4, p[1] - mn(i)[1] * 4]), "#fff", 0.18, 1.5, false, 3),
    oben: H.straehnen(aussen.map((p, i) => [p[0] - mn(i)[0] * 1.5, p[1] - mn(i)[1] * 1.5]), F ? 45 : 0, 3, (x) => -132 + (x - 180) * 0.1, [[SW, 2, 0.3, 0.9], ["#d8d2c6", 1, 0.25, 0.7]], { streu: 22 }),
  });
  /* ---- Kopf: Achse 50° nach unten, ~52 cm; große runde Ganasche, Kehlgang, Gesichtsleiste, stumpfes Maul mit Nüster und Lippen ---- */
  const wa = 50 * Math.PI / 180, P0 = [205, -183];
  const K = (u, v) => [P0[0] + u * Math.cos(wa) - v * Math.sin(wa), P0[1] + u * Math.sin(wa) + v * Math.cos(wa)];
  const kopfL = [[0, -3], [6, -8], [14, -9], [22, -9], [32, -8.2], [42, -7.2], [48, -6.2], [51.4, -3.4], [52.2, 0.6], [51.2, 4.4], [48.4, 5.6], [49, 7.4], [46.5, 9.6], [41, 10.4],
    [32, 11.6], [24, 14], [16, 17], [9, 16.6], [4, 12.5], [0.5, 7], [-1.5, 2]];
  const kopf = kopfL.map((p) => K(p[0], p[1]));
  /* Gesichtsstreifen: Stirn/Nasenrücken längs, über dem Auge Bögen, Backe parallel zum Unterkiefer, zum Maul schmal und bräunlich */
  const gs = [];
  [-7.4, -5.2, -3, -0.8].forEach((v, i) => gs.push([[K(19 + i * 1.5, v), K(30, v + 0.3), K(40, v * 0.8), K(45, v * 0.55)], [0.5, 0.9, 0.75, 0.45]]));
  [[2, -6.8], [5, -5], [8, -3]].forEach(([u, v]) => gs.push([[K(u, v), K(u + 4, v - 1.6), K(u + 9, v - 1.8), K(u + 14, v - 0.6)], [0.4, 0.9, 0.9, 0.5]]));
  [[11, 4.4], [14, 7.2], [17, 10]].forEach(([u, v], i) => gs.push([[K(u - 9, v - 3), K(u, v), K(u + 12, v - 0.6), K(u + 24, v - 1.6 - i * 0.4)], [0.6, 1, 0.9, 0.4]]));
  [[2, 9], [6, 13.5]].forEach(([u, v]) => gs.push([[K(u, v - 5), K(u + 4, v), K(u + 10, v + 2.5)], [0.6, 1, 0.6]]));
  gs.push([bog(...K(17, -4), 3.6, 3, 180, 330, 5), [0.3, 0.7, 0.8, 0.7, 0.3]]);
  gs.push([[K(22, 2.6), K(30, 3.4), K(40, 3.4)], [0.5, 0.8, 0.4]]);
  let k = "";
  k += teil(kopf, weiss, {
    fell: [fKopf], vol: [5, 4, 0.4], rim: 3, rimD: G(kopf.slice(0, 17), false),
    innen: streifenSVG(baender(gs), F ? H.fellMuster("kk", 52, [[SW, 1, 0.15, 0.9]], { tile: 2, n: 24, len: 0.6, streu: 0.5 }) : "") +
      /* dunkle Haut ums Auge, schwarzes samtiges Maul mit leichtem Glanz */
      wf([K(14, -4.5), K(17, -7), K(21, -4), K(17, -1.8)], "#1c1714", 0.85, 0.8) +
      `<path d="${G([K(43, -6.5), K(48, -6.4), K(51.6, -3), K(52.2, 1), K(51, 4.6), K(49, 7.6), K(46, 9.8), K(41.5, 10.4), K(40, 4), K(41, -2)])}" fill="#1b1817"/>` +
      wf([K(38, -6.8), K(42, -7), K(41, 10.6), K(37, 10)], "#3a2e26", 0.6, 1.2) +
      wf([K(45, -5.5), K(49, -5.4), K(51, -2)], "#fff", 0.22, 0.6, false) +
      /* Ganasche: Licht oben-vorn, Kernschatten unten-hinten; Kehlgang; Gesichtsleiste */
      wf([K(14, 6), K(24, 4), K(26, 12)], "#fff", 0.2, 2) + wf([K(6, 15.5), K(16, 16.5), K(25, 13.6)], "#000", 0.3, 1.6, false) +
      wf([K(22, 1), K(34, 1.2)], "#fff", 0.3, 0.6, false) +
      /* Nüster (C-Form, innen fast schwarz, Flügel mit Glanz), Maulspalte, Kinn */
      `<path d="${G([K(45, -3.4), K(47.6, -4.4), K(49.6, -2.4), K(48.6, 0.2), K(46.6, -0.6), K(47.4, -2.2)])}" fill="#0b0908"/>` +
      wf([K(45.4, -4.6), K(48, -5.2), K(50.2, -3.4)], "#9aa0a4", 0.4, 0.3, false, 0.8) +
      kerben([[K(51.2, 4.6), K(48.6, 5.6), K(44.5, 6.1), K(41, 6.4)]], 0.8, 0.9, "#000") + wf([K(46, 8.4), K(48.6, 9)], "#4a4440", 0.4, 0.4, false) +
      (F ? T.schnurrhaare(...K(49.5, 6), 8, 3.5, 115, 70, "#2a2522", 0.07) : ""),
  });
  /* Auge: in dunkler Lidhaut, Brauenwulst, waagrechte Pupille, feine Wimpern nach vorn */
  const [ax, ay] = K(17, -4);
  k += H.auge(ax, ay, 1.8, { iris: "#3a2416", iris2: "#1d130d", offen: 0.72, pupille: "quer", wimpern: 22, wl: 1.5, lid: "#0e0a08", lidHaut: "#231d1a", winkel: 30, hoehleA: 0.18, feucht: "#9a8a82", wimpernFarbe: "#1a1512" });

  /* Ohren: Blattform, breiteste Stelle in der Mitte, Ansatz eingeschnürt, Spitze rund; außen weiß mit schwarzem Band an der Basis
     und schwarzer Spitze; nahes Ohr zeigt die Muschel mit langem weißem Innenhaar */
  const ohr = (u, v, dreh, gr, fern) => {
    const [bx, by] = K(u, v), a = dreh * Math.PI / 180, l = 19 * gr, w = 5 * gr, nx = -Math.sin(a), ny = Math.cos(a);
    const P = (t, q) => [bx + Math.cos(a) * l * t + nx * w * q, by + Math.sin(a) * l * t + ny * w * q];
    const pts = [P(0, -0.42), P(0.18, -0.85), P(0.45, -1.05), P(0.72, -0.85), P(0.9, -0.42), P(1, 0, 1), P(0.9, 0.38), P(0.72, 0.85), P(0.45, 1.05), P(0.2, 0.85), P(0, 0.42)];
    const spitze = G([P(0.74, -0.9), P(0.9, -0.6), P(1, 0.05), P(0.92, 0.55), P(0.73, 0.95), P(0.78, 0.1)]);
    const basis = G([P(0.06, -0.8), P(0.22, -1.1), P(0.24, 1.1), P(0.08, 0.8)]);
    return teil(pts, fern ? "#bdb5a8" : "#f4f0e8", { vol: [1.2, 4, 0.4], fell: [fKopf],
      innen: `<path d="${spitze + basis}" fill="${SW}"${fern ? ` opacity=".9"` : ""}/>` +
        (fern ? "" : `<path d="${G([P(0.12, 0.1), P(0.4, -0.45), P(0.7, -0.4), P(0.84, 0.05), P(0.68, 0.5), P(0.35, 0.55)])}" fill="#4a4540"/>` +
          H.straehnen([P(0.14, 0.2), P(0.4, 0.05), P(0.65, 0)], 18, 5, dreh - 8, [["#fbf8f2", 1, 0.25, 0.9]], { streu: 22, welle: 0.2, szene: 0.4 })) +
        wf([P(0.05, -0.9), P(0.5, -1.1), P(0.95, -0.4)], "#fff", 0.2, 0.5, false) });
  };
  s += ohr(1.5, -6.5, -104, 0.9, 1) + k + ohr(4, -7.5, -80, 1, 0);
  return { svg: s, box: [40, -210, 245, 0], fuesse: [170.5, 158.5, 65.5, 78.5], kopf: [190, -210, 248, -128] };
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
  const H = mach(T, T.fein ? 1 : 0, 0.8), { teil, L, kette, kerben, falte, querfalten, G, wf } = H, F = H.F, US = H.US;
  /* Grundton schiefergrau, nach unten wärmer (Staub/Schlamm), ferne Teile kühler und dunkler */
  const haut = T.lg("haut", [[0, "#9a958c"], [0.35, "#857f76"], [0.62, "#757067"], [0.82, "#6d655a"], [1, "#6a5e4e"]], 0, -200, 0, 0, US);
  const fern = T.lg("fern", [[0, "#67625b"], [0.6, "#5a554e"], [1, "#544c42"]], 0, -160, 0, 0, US);
  const licht = T.lg("licht", [[0, "#fff", 0.16], [0.3, "#fff", 0.04], [0.55, "#000", 0], [0.78, "#2a2218", 0.24], [0.9, "#2a2218", 0.3], [1, "#d8c4a4", 0.12]], 0, -192, 0, -52, US);
  const staub = T.lg("staub", [[0, "#7a6446", 0], [0.5, "#7a6446", 0.18], [1, "#6b5638", 0.34]], 0, -70, 0, 0, US);
  const R = "#1f1912";
  /* Rissnetz: an Rücken und Flanke schwach und grob, an Hals, Beinen und Gesicht feiner und kräftiger */
  const basis = F ? H.rissMuster("r", 3.4, 0.36, 0.5, { n: 8, seed: 21 }) : "";
  const rissR = F ? [[basis, 0.22], [H.muster("r2", basis, "rotate(31) scale(1.5)"), 0.1]] : [];
  const rissB = F ? [[H.muster("b", basis, "scale(.55 .45)"), 0.6], [H.muster("b2", basis, "rotate(-20) scale(.7 .55)"), 0.25]] : [];
  const rissK = F ? [[H.muster("k", basis, "scale(.45)"), 0.55], [H.muster("k2", basis, "rotate(40) scale(.6)"), 0.2]] : [];
  /* Fuß: drei Zehen mit Hufen – vorn der große Mittelhuf, dahinter seitlich ein kleinerer; Sohle als Ballen; matt, dunkler als die Haut */
  const fuss = (kk, fern2) => {
    const m = kk.L.length - 1, xv = kk.L[m][0], xh = kk.R[m][0], w = xv - xh;
    const huf = (x0, x1, h) => `M${H.f(x0)} -1Q${H.f(x0 - 0.5)} ${H.f(-h * 0.8)} ${H.f((x0 + x1) / 2)} ${H.f(-h)}Q${H.f(x1 + 1.5)} ${H.f(-h * 0.85)} ${H.f(x1 + 1.5)} -1Q${H.f((x0 + x1) / 2)} 0.6 ${H.f(x0)} -1Z`;
    const d = huf(xv - w * 0.44, xv - w * 0.02, 6.2) + huf(xh + w * 0.18, xh + w * 0.48, 4.8);
    return `<path d="${d}" fill="${fern2 ? "#3e3830" : "#544b40"}"/>` + (F ? `<path d="${d}" fill="none" stroke="#c2b8a6" stroke-width=".6" stroke-opacity=".2" transform="translate(-.4 -.6)"/>` + wf([[xh + w * 0.1, -7], [xv - w * 0.05, -8.5]], "#000", 0.3, 1, false) : "");
  };
  const bein = (J, fern2, mod) => {
    const kk = kette(J), m = J.length - 1;
    return teil(kk.pts, fern2 ? fern : haut, {
      fell: rissB, vol: [9, 4, 0.4],
      innen: (mod || "") + `<rect x="${H.f(kk.R[m][0] - 6)}" y="-70" width="70" height="70" fill="${staub}"/>` +
        /* Falten gebündelt über Fußwurzel und Fessel, dazwischen ruhig */
        falte(querfalten(kk, m - 2.7, m - 1.6, 0.2, 0.12, 0.88, 2.6), 2.4, fern2 ? 0.26 : 0.34) + (F ? falte(querfalten(kk, m - 1.1, m - 0.5, 0.25, 0.15, 0.85, 2), 2, 0.25) : "") +
        wf([[kk.R[0][0], J[0][1] + 34], [J[0][0], J[0][1] + 40], [kk.L[0][0], J[0][1] + 34]], "#000", fern2 ? 0.45 : 0.32, 6, false, 16) +
        (fern2 ? `<rect x="${H.f(kk.R[0][0] - 8)}" y="-140" width="80" height="140" fill="#1a1612" opacity=".12"/>` : "") +
        `<path d="M${H.f(kk.L[m][0])} -2.5L${H.f(kk.R[m][0])} -2.5" stroke="#1e1812" stroke-width="5" stroke-opacity=".35"/>`,
    }) + fuss(kk, fern2);
  };
  /* Beine: kurze Säulen mit Gelenken – vorn Ellbogen hinten auf Bauchhöhe, Fußwurzel bei 30 % leicht verdickt;
     hinten Knie vorn mit Falte zur Flanke, Sprunggelenk bei 55 % stumpf nach hinten, darunter schmaler, Fuß breiter */
  const vorder = (x) => [[x - 4, -118, 28, 28], [x - 1, -80, 24, 25], [x, -62, 21, 26], [x + 1, -40, 18, 18.5], [x + 1.5, -26, 19, 19], [x + 2, -12, 18, 17.5], [x + 2.5, -3, 20.5, 19], [x + 3, 0, 21, 19.5, 3]];
  const hinter = (x) => [[x - 2, -126, 22, 22], [x + 4, -88, 24, 34], [x + 2, -64, 21, 30], [x - 4, -42, 17, 25, 2], [x - 2, -28, 16, 17], [x - 1, -12, 17, 16.5], [x - 0.5, -3, 19.5, 18.5], [x, 0, 20, 19, 3]];
  let s = "", k = "";
  k += bein(vorder(248).map((p) => [p[0], p[1] - (p[1] > -3 ? 0 : 0), p[2] * 0.95, p[3] * 0.95, p[4]]), 1);
  k += bein(hinter(108).map((p) => [p[0], p[1], p[2] * 0.95, p[3] * 0.95, p[4]]), 1);
  k += bein(vorder(272), 0, wf([[296, -58], [288, -52]], "#000", 0.3, 2.5, false));
  k += bein(hinter(82), 0, wf([[84, -40], [70, -44]], "#fff", 0.15, 2, false));
  /* Schwanz: oben an der Kruppe, flach, dicht am Gesäß, verjüngt, am Ende seitlich gefächerte Borsten */
  const sk = kette([[50, -150, 3.6, 3.6], [45, -132, 3.1, 3.1], [42, -112, 2.6, 2.6], [41, -96, 2.2, 2.2]]);
  /* Rumpf: Nackenbuckel als eigene Kuppel hinter den Ohren, Senke, flacher Rücken, gerundete Kruppe; Bauch hinter dem Ellbogen am tiefsten */
  const rumpf = [[48, -152], [62, -164], [90, -171], [118, -170], [130, -166], [160, -162], [210, -167], [244, -176], [266, -180], [282, -183], [296, -194], [310, -200], [324, -197],
    [336, -186], [346, -170], [354, -146], [356, -118], [350, -100], [338, -86], [324, -74], [306, -66], [286, -60], [262, -56], [226, -55], [180, -56], [146, -58], [124, -64],
    [104, -76], [86, -86], [64, -96], [50, -106], [44, -122], [44, -138]];
  k += teil(rumpf, haut, {
    fell: rissR, ov: [licht], vol: [24, 4, 0.4], rim: 10, rimD: G(rumpf.slice(30).concat(rumpf.slice(0, 14)), false),
    innen: `<rect x="40" y="-90" width="320" height="40" fill="${staub}"/>` +
      /* Glanz auf Buckel, Schulterblatt, Hüfthöcker, Rippenbogen; Kernschatten unten */
      wf([[296, -190], [310, -195], [322, -192]], "#fff", 0.3, 3, false) + wf([[118, -165], [128, -162]], "#fff", 0.28, 3, false) +
      wf([[236, -160], [248, -130], [252, -108]], "#fff", 0.12, 7, false) + wf([[174, -140], [196, -110]], "#fff", 0.08, 10, false) +
      wf([[140, -68], [200, -62], [262, -64]], "#000", 0.2, 6, false) + wf([[338, -150], [346, -120], [340, -96]], "#000", 0.22, 5, false) +
      /* Kopf-Schlagschatten auf Hals und Brust */
      wf([[340, -168], [352, -150], [354, -120], [346, -98]], "#000", 0.35, 5, false, 14) +
      /* Schulterfalte (Widerrist → hinter dem Ellbogen), Flanken-/Kniefalte (Hüfte → Knie), Halsfalten bis zur Wamme */
      falte([[[262, -176], [256, -150], [250, -118], [252, -90], [262, -64]], [[132, -160], [124, -130], [118, -100], [118, -72]]], 3.4, 0.42) +
      falte([[[312, -188], [306, -160], [312, -128], [326, -96]], [[322, -186], [320, -164], [326, -140], [338, -116], [344, -96]], [[302, -194], [294, -170], [296, -150]]], 2.8, 0.36) +
      falte([[[272, -150], [268, -128]], [[290, -150], [286, -128]]], 2, 0.2),
  });
  /* Schwanz vor dem Gesäß, wirft Schatten auf die Hinterbacke */
  k += wf([[52, -146], [47, -126], [46, -104]], "#000", 0.35, 2, false, 6);
  k += teil(sk.pts, haut, { fell: rissK, vol: [2, 4, 0.4], innen: wf([[48, -146], [42, -116]], "#fff", 0.15, 1, false) });
  k += H.straehnen([[38, -98], [42, -96], [44, -99]], 18, 7, (x, y, t) => 70 + t * 40, [["#2a231c", 2, 0.5, 0.95], ["#5a4a3a", 1, 0.45, 0.85]], { streu: 10, welle: 0.2, szene: 0.4 });
  /* Kopf: lang, tief getragen; Maul vorn fast senkrecht und flach (Breitmaul), Oberlippe eckig, Kinn als eigene Masse */
  const kopf = [[324, -194], [338, -188], [352, -176], [364, -162], [374, -150], [386, -136], [394, -128], [402, -119], [414, -105], [424, -96], [430, -91, 1], [432, -78], [432.5, -62], [432, -54, 1],
    [427, -51], [422, -46], [416, -42], [406, -39], [392, -39], [378, -42], [362, -49], [348, -59], [336, -74], [328, -96], [322, -126], [318, -160]];
  k += teil(kopf, haut, {
    fell: rissK, ov: [T.lg("kl", [[0, "#fff", 0.1], [0.5, "#000", 0], [1, "#000", 0.2]], 0, 0, 0.3, 1)], vol: [10, 4, 0.4], rim: 8, rimD: G(kopf.slice(0, 22), false),
    innen: `<rect x="320" y="-60" width="120" height="30" fill="${staub}" opacity=".6"/>` +
      /* Nasenrücken-Glanz, Jochbeinwölbung unter dem Auge, Unterkieferwinkel als Wulst mit Glanz, Kaumuskel */
      wf([[352, -174], [372, -150], [392, -128]], "#fff", 0.22, 2.5, false) + wf([[338, -112], [356, -116], [370, -106]], "#fff", 0.16, 3, false) +
      wf([[332, -84], [342, -68], [356, -60]], "#fff", 0.18, 3, false) + wf([[328, -96], [336, -74], [350, -60]], "#000", 0.25, 2.5, false, 4) +
      /* Augenpolster mit konzentrischen Falten */
      falte([[[343, -147], [349, -151], [357, -150]], [[342, -128], [350, -124], [357, -125]], [[336, -140], [335, -133]], [[340, -155], [350, -160], [362, -157]], [[362, -128], [368, -133]]], 1.5, 0.36) +
      /* Wangen- und Lippenfalten, Maulspalte unter der eckigen Oberlippe, Unterlippe/Kinn als eigene Masse */
      falte([[[384, -90], [394, -84]]], 1.6, 0.25) + wf([[428, -90], [432, -76], [432, -60]], "#fff", 0.16, 1.2, false) +
      wf([[431, -59], [418, -56], [402, -54], [390, -53]], "#000", 0.35, 1.2, false, 3) + kerben([[[430.5, -58], [420, -55.5], [406, -54], [394, -53]]], 1.6, 0.85, "#120d09") +
      wf([[426, -52], [418, -48], [404, -46]], "#fff", 0.16, 1.2, false) + wf([[422, -44], [408, -40]], "#000", 0.25, 1.5, false) +
      /* Nasenloch: schräger Kommaschlitz mit Randwulst, oben Glanz */
      `<path d="M414.5 -88.5Q418 -90 420 -88.5Q419 -85 416.5 -81.5Q416.5 -85 414.5 -88.5Z" fill="#17110c"/>` + wf([[412, -88], [417, -92], [422, -90]], "#fff", 0.3, 0.6, false) + wf([[413, -86], [416, -80]], "#000", 0.3, 0.8, false) +
      /* Kehlfalten mit leichter Wamme */
      falte([[[334, -80], [330, -96], [332, -112]], [[344, -64], [338, -76]]], 2, 0.3),
  });
  /* Hörner: Vorderhorn mit breiter Basis, erst leicht vorgeneigt, dann nach hinten gebogen; Hinterhorn niedriger, breiter Kegel.
     Keratin seidenmatt mit Längsfasern, an der Basis dunkel und aufgefasert, vorne poliert heller, Spitze abgenutzt */
  const hornG = T.lg("horn", [[0, "#3e362d"], [0.35, "#5f5547"], [1, "#8d8170"]], 0, -100, 0, -180, US);
  const faser = (zz) => F ? L(zz, "#241e17", 0.35, 0.3, "", 1) + L(zz.map((z) => z.map((p) => [p[0] - 0.8, p[1]])), "#c4b8a4", 0.25, 0.18, "", 1) : "";
  const hinterHorn = [[369, -155], [371, -164], [375, -171], [379, -172.5], [382, -166], [386, -150], [392, -132], [384, -136], [376, -146]];
  k += teil(hinterHorn, hornG, { vol: [2, 3, 0.45],
    innen: faser([[[374, -152], [377, -167]], [[379, -146], [380, -166]], [[384, -140], [382, -158]]]) + wf([[370, -157], [374, -168]], "#fff", 0.18, 0.8, false) });
  const vorderHorn = [[397, -123], [399, -140], [399, -158], [397, -172], [396.5, -178], [399, -181], [403, -177], [410, -164], [417, -148], [422, -128], [423, -110], [421, -100], [414, -104], [406, -112]];
  k += teil(vorderHorn, hornG, { vol: [3.5, 3, 0.45],
    innen: faser([[[402, -116], [403, -140], [401, -168]], [[408, -110], [410, -138], [404, -170]], [[414, -106], [416, -130], [410, -160]], [[419, -104], [420, -122], [416, -142]]]) +
      wf([[420, -104], [421, -126], [414, -152], [404, -172]], "#d8ccb6", 0.3, 1, false) + wf([[398, -126], [400, -150]], "#000", 0.25, 1.4, false) });
  /* aufgefaserter Hornsaum und Kontaktschatten an beiden Basen */
  k += (F ? L([[[397, -121], [398, -123]], [[402, -115], [403, -117.5]], [[407, -110], [408, -113]], [[412, -105], [413, -108]], [[417, -101], [417.5, -103.5]], [[370, -152], [371, -154.5]], [[375, -146], [376, -148.5]], [[380, -140], [381, -142.5]], [[385, -134], [385.5, -136.5]]], "#4a4035", 0.5, 0.5, "", 1) : "") +
    wf([[395, -120], [406, -108], [420, -98]], "#000", 0.35, 1.2, false) + wf([[368, -152], [378, -140], [390, -130]], "#000", 0.35, 1.2, false);
  /* Auge: klein, tief, weit hinten unter dem Hinterhorn, im gewölbten Polster; dicke ledrige Lider, wenige Wimpern */
  k += H.auge(352, -137, 2.6, { iris: "#3a2214", iris2: "#140a05", offen: 0.6, pupille: "quer", wimpern: 8, wl: 1.4, lid: "#1c150f", lidHaut: "#3e382f", winkel: 32, hoehleA: 0.3, feucht: "#9a8676", wimpernFarbe: "#3a3128" });
  /* Ohren: lange, spitz zulaufende Trichter, nach hinten gekippt; Öffnung als dunkler Schlitz zur Seite; Borsten an der Spitze; Ringfalten an der Basis */
  const ohr = (bx, by, dreh, fern2) => {
    const a = (dreh - 90) * Math.PI / 180, l = fern2 ? 24 : 29, nx = -Math.sin(a), ny = Math.cos(a), P = (t, q) => [bx + Math.cos(a) * l * t + nx * q, by + Math.sin(a) * l * t + ny * q];
    const pts = [P(0, -5), P(0.3, -6), P(0.65, -5.4), P(0.9, -2.6), P(1, 0, 1), P(0.86, 2.6), P(0.55, 4.4), P(0.25, 4.6), P(0, 4.2)];
    return teil(pts, fern2 ? "#6f6960" : haut, { fell: rissK, vol: [1.6, 4, 0.4],
      innen: (fern2 ? "" : `<path d="${G([P(0.3, 2), P(0.55, 1.2), P(0.82, 0.8), P(0.92, 1.4), P(0.75, 2.6), P(0.45, 3.4)])}" fill="#3a332b" opacity=".85"/>` + wf([P(0.3, -3), P(0.8, -2)], "#fff", 0.2, 0.6, false)) +
        falte([[P(0.1, -5), P(0.12, 0), P(0.1, 4.4)], [P(0.2, -5.6), P(0.22, 0), P(0.2, 4.6)]], 0.8, 0.35) },
    ) + H.straehnen([P(0.85, -2.6), P(1, 0), P(0.86, 2.6)], 14, 3.2, dreh - 90, [["#2a2219", 1, 0.3, 0.85]], { streu: 40, szene: 0.4 });
  };
  s += ohr(322, -193, -46, 1) + k + ohr(333, -188, -34, 0);
  return { svg: s, box: [36, -217, 433, 0], fuesse: [275, 251, 82, 108], kopf: [300, -222, 436, -34] };
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
  const H = mach(T, T.fein ? 1 : 0, 0.8), { teil, L, kette, kerben, falte, querfalten, G, wf } = H, F = H.F, US = H.US;
  /* nackte Haut: Rücken schiefergrau-braun, Flanke rötlicher, Bauch/Falten rosa-fleischfarben; glatt und glänzend */
  const haut = T.lg("haut", [[0, "#6b605b"], [0.3, "#776a64"], [0.55, "#8c7570"], [0.78, "#a98378"], [1, "#c99585"]], 0, -170, 0, -28, US);
  const kopfH = T.lg("kopfh", [[0, "#6f625c"], [0.4, "#7e6c66"], [0.7, "#9c7a70"], [1, "#c08e80"]], 0, -176, 0, -44, US);
  const fern = T.lg("fern", [[0, "#5b4f4b"], [0.6, "#635250"], [1, "#6e5a54"]], 0, -90, 0, 0, US);
  const beinH = T.lg("beinh", [[0, "#8c7570"], [0.5, "#937a72"], [1, "#8a746a"]], 0, -90, 0, 0, US);
  const licht = T.lg("licht", [[0, "#fff", 0.12], [0.3, "#fff", 0], [0.55, "#000", 0], [0.75, "#3a2420", 0.22], [0.88, "#3a2420", 0.28], [1, "#e8c2b0", 0.18]], 0, -158, 0, -28, US);
  const ROSA = "#c98e80", R = "#2a1c1b";
  /* Haut: feines Faltennetz (schwach), Poren als Punkte */
  const basis = F ? H.rissMuster("n", 3, 0.22, 0.35, { n: 8, seed: 31 }) : "";
  const netzR = F ? [[basis, 0.22], [H.muster("n2", basis, "rotate(35) scale(1.3)"), 0.1]] : [];
  const netzK = F ? [[H.muster("k", basis, "scale(.5)"), 0.4]] : [];
  const netzB = F ? [[H.muster("b", basis, "scale(.6 .4)"), 0.4]] : [];
  /* Füße: vier Zehen, von der Seite zwei nahe und die Andeutung einer dritten; breite, kurze Hufnägel mit hellem Oberrand */
  const zehen = (kk, fern2) => {
    const m = kk.L.length - 1, xv = kk.L[m][0], xh = kk.R[m][0], w = xv - xh;
    let d = "", sp = "";
    [[0.04, 0.34, 6], [0.36, 0.66, 6.6], [0.7, 0.92, 4.6]].forEach(([a, b, h]) => {
      const x0 = xv - w * b, x1 = xv - w * a;
      d += `M${H.f(x0)} -.6Q${H.f(x0)} ${H.f(-h)} ${H.f((x0 + x1) / 2)} ${H.f(-h - 0.6)}Q${H.f(x1 + 1)} ${H.f(-h)} ${H.f(x1 + 1)} -.6Z`;
      sp += `M${H.f(x0 - 0.5)} -.5L${H.f(x0)} ${H.f(-h * 0.9)}`;
    });
    return `<path d="${d}" fill="${fern2 ? "#5e4e48" : "#8d8379"}"/>` + (F ? `<path d="${d}" fill="none" stroke="#efe2d6" stroke-width=".6" stroke-opacity=".35" transform="translate(-.4 -.6)"/><path d="${sp}" stroke="#1e1513" stroke-width="1.2" stroke-opacity=".6"/>` +
      `<path d="M${H.f(xh)} -1.2L${H.f(xv + 1)} -1.2" stroke="#5a4636" stroke-width="2" stroke-opacity=".35"/>` : "");
  };
  const bein = (J, fern2, mod) => {
    const kk = kette(J), m = J.length - 1;
    return teil(kk.pts, fern2 ? fern : beinH, {
      fell: netzB, vol: [8, 4, 0.4],
      innen: (mod || "") + (F ? falte(querfalten(kk, m - 1.7, m - 0.7, 0.24, 0.12, 0.88, 2.4), 2, fern2 ? 0.25 : 0.32) + falte(querfalten(kk, 0.8, 1.4, 0.3, 0.2, 0.8, 2), 1.6, 0.2) : "") +
        wf([[kk.R[0][0], J[0][1] + 26], [J[0][0], J[0][1] + 32], [kk.L[0][0], J[0][1] + 26]], "#000", fern2 ? 0.5 : 0.35, 5, false, 14) +
        (fern2 ? `<rect x="${H.f(kk.R[0][0] - 8)}" y="-110" width="70" height="110" fill="#1a1215" opacity=".14"/>` : "") +
        `<path d="M${H.f(kk.L[m][0])} -2L${H.f(kk.R[m][0])} -2" stroke="#2a1d1a" stroke-width="4" stroke-opacity=".3"/>`,
    }) + zehen(kk, fern2);
  };
  /* kurze Säulen; vorn Ellbogenwulst, Unterarm vorn konvex, zum Fuß 15 % breiter; hinten Fersenknick bei ~22 % */
  const vorder = (x) => [[x - 2, -90, 25, 25], [x, -60, 22, 22], [x + 1, -36, 20, 20], [x + 1.5, -16, 21, 20.5], [x + 2, -4, 23, 22], [x + 2, 0, 23.5, 22.5, 3]];
  const hinter = (x) => [[x - 4, -100, 26, 26], [x + 2, -64, 23, 25], [x, -36, 19.5, 22, 2], [x, -20, 19, 19], [x + 0.5, -5, 21.5, 21], [x + 0.5, 0, 22, 21.5, 3]];
  let s = "", k = "";
  k += bein(vorder(246).map((p) => [p[0], p[1], p[2] * 0.92, p[3] * 0.92, p[4]]), 1) + bein(hinter(110).map((p) => [p[0], p[1], p[2] * 0.92, p[3] * 0.92, p[4]]), 1);
  k += bein(vorder(272), 0, wf([[248, -62], [252, -50]], "#000", 0.25, 2, false)) + bein(hinter(84), 0);
  /* Schwanz: kurz, seitlich abgeflacht, Basis doppelt so breit wie die Spitze, wächst aus der Rundung; spärliche Borsten */
  const sk = kette([[34, -118, 5.2, 5.2], [29, -106, 4, 4], [26, -96, 3, 3], [25, -90, 2.4, 2.4]]);
  /* Rumpf: Fass; Schulterwölbung, leichte Senke dahinter, kugeliges Hinterteil, Bauch zwischen den Beinen durchhängend */
  const rumpf = [[34, -118], [46, -136], [66, -148], [96, -154], [130, -153], [160, -150], [196, -153], [236, -158], [264, -160], [286, -158], [304, -156], [324, -152],
    [336, -132], [334, -102], [326, -80], [312, -64], [296, -56], [276, -49], [250, -40], [210, -32], [168, -31], [138, -34], [118, -42], [102, -54], [80, -62], [54, -76], [40, -94]];
  k += wf([[38, -112], [32, -100], [30, -90]], "#000", 0.35, 1.5, false, 5);
  let rk = teil(rumpf, haut, {
    fell: netzR, ov: [licht], rim: 6, rimD: G(rumpf.slice(24).concat(rumpf.slice(0, 13)), false),
    innen: /* Glanz entlang der Rückenlinie, oben scharf, unten weich, dazu breites Glanzband */
      wf([[48, -132], [70, -145], [100, -151], [130, -150.5], [160, -148], [196, -151], [236, -155.5], [264, -157.5], [290, -155]], "#f2eeea", 0.5, 0.8, false, 2.2) +
      wf([[60, -126], [110, -140], [170, -139], [240, -144], [290, -144]], "#fff", 0.15, 6, false) +
      /* Schulter- und Hinterteilwölbung, Kernschatten, warmes Bodenreflexlicht */
      wf([[250, -140], [262, -110], [258, -80]], "#fff", 0.12, 8, false) + wf([[80, -140], [70, -110]], "#fff", 0.1, 8, false) +
      wf([[150, -40], [210, -36], [262, -46]], "#d8a898", 0.3, 2.5, false) +
      /* Blutschweiß (rot-orange Lasuren) */
      wf([[290, -140], [300, -120], [296, -100]], "#b4552e", 0.14, 4, false) + wf([[90, -110], [110, -96]], "#b4552e", 0.1, 5, false) +
      /* Narben: spitz zulaufend, der Wölbung folgend, erhaben (heller Kern, dunkle Unterkante) */
      (F ? [[[[150, -120], [168, -112], [184, -108]], 1.4], [[[200, -100], [214, -104], [228, -102]], 1.2], [[[96, -96], [108, -88], [118, -86]], 1.2], [[[260, -128], [272, -122]], 1],
        [[[60, -100], [70, -92], [76, -90]], 1], [[[230, -128], [244, -134]], 1], [[[176, -84], [196, -82]], 1.1], [[[284, -96], [292, -88]], 0.9], [[[124, -126], [134, -130]], 0.9]].map(([z, w]) =>
        kerben([z.map((p) => [p[0] + 0.5, p[1] + 0.7])], w * 1.1, 0.35, "#4a2c26") + kerben([z], w, 0.7, "#b9a39c")).join("") : "") +
      /* Falten: Schulter, Achsel, Flanke */
      falte([[[300, -152], [306, -116], [300, -76]], [[314, -148], [320, -114], [316, -80]], [[118, -48], [110, -70], [104, -94]], [[262, -62], [280, -56], [298, -58]]], 2.6, 0.3),
  });
  k += teil(sk.pts, haut, { fell: netzK, vol: [2, 4, 0.4], innen: wf([[36, -116], [28, -100]], "#fff", 0.2, 1, false) + wf([[30, -112], [24, -96]], "#000", 0.3, 1, false) });
  k += H.straehnen([[23, -92], [25, -88], [28, -92]], 12, 4, 95, [["#4a3b36", 1, 0.35, 0.8]], { streu: 40, szene: 0.3 });
  /* Kopf: massiv, kastenförmig; Augen-, Ohr- und Nasenhöcker oben auf einer Ebene; Hals so tief wie die Brust mit Ringfalten */
  const kopf = [[292, -154], [312, -160], [334, -166], [350, -173], [360, -178], [372, -175], [380, -162], [392, -150], [408, -146], [420, -146], [428, -150], [438, -151], [446, -146],
    [452, -138, 1], [458, -122], [460, -100], [460, -84], [458, -72], [452, -62], [442, -56], [426, -52], [404, -50], [382, -51], [360, -55], [338, -61], [320, -70], [308, -88], [302, -120]];
  rk += teil(kopf, haut, {
    fell: netzK, rim: 8, rimD: G(kopf.slice(0, 26), false),
    innen: /* Glanz auf Scheitel, Augenhöcker, Nasenhöcker, Wangenwulst */
      wf([[322, -158], [340, -164], [356, -170]], "#f2eeea", 0.45, 0.9, false, 2) + wf([[366, -172], [374, -168]], "#f2eeea", 0.5, 0.7, false, 1.6) +
      wf([[400, -146], [418, -143], [430, -146]], "#f2eeea", 0.4, 0.8, false, 1.8) + wf([[452, -130], [457, -112]], "#fff", 0.25, 1.4, false) +
      wf([[400, -118], [430, -112]], "#fff", 0.14, 6, false) + wf([[330, -128], [350, -112]], "#fff", 0.1, 6, false) +
      /* rosa Partien: Wange, Maulwinkel, um Auge und Ohr; Blutschweiß unter dem Auge und hinter dem Ohr */
      wf([[350, -100], [380, -84], [420, -76], [450, -72], [446, -60], [410, -54], [370, -57], [346, -72]], ROSA, 0.4, 3) +
      wf([[356, -160], [366, -164], [376, -158]], ROSA, 0.4, 2, false) + wf([[360, -150], [364, -136]], "#b4552e", 0.2, 2, false) + wf([[326, -158], [322, -146]], "#b4552e", 0.18, 2, false) +
      /* Kernschatten unter dem Kiefer, Okklusion hinter dem Ohr */
      wf([[330, -72], [370, -58], [420, -54], [446, -58]], "#000", 0.25, 3, false) + wf([[324, -150], [318, -132]], "#000", 0.22, 3, false) +
      /* Lippenlinie: flaches S, Oberlippe dick und überhängend, Mundwinkel als tiefe weiche Falte */
      wf([[459, -86], [440, -81], [410, -79], [382, -79.5], [364, -78]], "#000", 0.3, 1.6, false, 4) + kerben([[[459.5, -85], [440, -80], [410, -78], [384, -78.5], [366, -77]]], 1.8, 0.75, "#2a1514") +
      wf([[440, -76], [410, -73]], "#fff", 0.15, 1.5, false) +
      wf([[366, -78], [358, -76], [354, -72]], "#8a4e46", 0.4, 1.2, false) + kerben([[[367, -77], [360, -75.5], [355, -71]]], 1.2, 0.45) +
      /* Eckzahnwulst vorn am Unterkiefer, Kinn */
      wf([[430, -70], [446, -64], [452, -70]], "#fff", 0.18, 1.6, false) + wf([[426, -62], [444, -56]], "#000", 0.2, 1.4, false) +
      /* Halsfalten ringsum, nach vorn gewölbt */
      falte([[[322, -160], [330, -120], [326, -76]], [[312, -150], [318, -116], [314, -82]]], 2.6, 0.38) +
      /* Borsten aus Poren an Oberlippe und Kinn */
      (F ? H.straehnen([[446, -98], [458, -94], [460, -80], [452, -72]], 34, 2.2, (x, y) => (y < -82 ? 20 : 70), [["#4a3b36", 1, 0.25, 0.7]], { streu: 30 }) +
        H.straehnen([[420, -56], [446, -58]], 12, 2, 90, [["#4a3b36", 1, 0.25, 0.6]], { streu: 30 }) : ""),
  });
  k += H.vol(rk, [18, 4, 0.38]);
  /* unterer Eckzahn: Spitze schaut hinter dem Lippenrand hervor */
  k += teil([[439, -78.6], [440.5, -83.5], [443, -85.5], [443.8, -82], [443, -78.4]], T.lg("zahn", [[0, "#f2e9d4"], [1, "#cdbb95"]], 0, 0, 0, 1), { innen: wf([[441.5, -83], [442.8, -84.8]], "#fff", 0.6, 0.25, false) + `<ellipse cx="441.6" cy="-80" rx=".8" ry=".6" fill="#b48a4a" opacity=".5"/>` });
  /* Nasenhöcker mit schrägem Schlitz-Nasenloch, zweites angeschnitten */
  k += teil([[430, -150], [434, -155], [442, -155.5], [448, -150], [446, -146], [436, -146]], kopfH, { vol: [1.6, 4, 0.4], innen: `<path d="M436 -150.5Q441 -153.5 445 -151.5Q441 -150 438 -148Z" fill="#2a1e1c"/>` + wf([[434, -154], [444, -155]], "#fff", 0.35, 0.5, false) });
  k += `<path d="M428 -151.5Q431 -153 433 -152Q431 -151 429.5 -150Z" fill="#2a1e1c" opacity=".6"/>`;
  s += k;
  /* Augenhöcker: erhabener Ring (oben Licht, unten Schatten) mit strahlenförmigen Falten; Auge gewölbt, dicker Oberlidwulst */
  s += falte([[[356, -164], [352, -158]], [[372, -166], [378, -160]], [[364, -158], [366, -152]], [[358, -170], [354, -174]]], 1, 0.35);
  s += H.auge(365.5, -166, 3.4, { iris: "#6b3a1e", iris2: "#3a2015", offen: 0.6, pupille: "quer", wimpern: 4, wl: 0.7, lid: "#2a1a16", lidHaut: "#5a3e38", winkel: 4, hoehleA: 0.18, feucht: "#b97a72", wimpernFarbe: "#4a3830" });
  /* Ohr: klein, abgerundet-oval, dicker fleischiger Rand, innen dunkles Rosa, Höhlung zur Basis verschattet, feine Randhaare */
  s += teil([[334, -164], [330, -172], [331, -180], [335, -183], [339, -178], [340, -170], [339, -163]], "#6e5e5a", { vol: [1.2, 4, 0.4],
    innen: `<ellipse cx="335" cy="-172" rx="2.2" ry="5.2" fill="#a86e68"/>` + wf([[334.5, -168], [335, -164]], "#3a1e1c", 0.6, 0.8, false),
    oben: H.straehnen([[331, -178], [335, -183], [339, -178]], 10, 1.2, -90, [["#4a3b36", 1, 0.15, 0.7]], { streu: 60, szene: 0 }) });
  s += wf([[330, -164], [342, -162]], "#000", 0.3, 1, false);
  return { svg: s, box: [20, -184, 461, 0], fuesse: [274.5, 248.5, 84.5, 110.5], kopf: [296, -190, 464, -44] };
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
  const H = mach(T, 1, 0.25), { teil, L, kette, G, wf, kerben, falte } = H, F = H.F, US = H.US;
  /* Fell: Rücken rötlich-zimtbraun, zur Flanke sandbraun; ferne Teile kühler und dunkler */
  const fell = T.lg("fell", [[0, "#a8673a"], [0.45, "#b97d4a"], [1, "#c89464"]], 0, -72, 0, -48, US);
  const fern = T.lg("fern", [[0, "#8a5a36"], [1, "#94704c"]], 0, -70, 0, 0, US);
  const lauf = T.lg("lauf", [[0, "#b98250"], [1, "#c99a6a"]], 0, -45, 0, 0, US);
  const licht = T.lg("licht", [[0, "#fff", 0.18], [0.3, "#fff", 0.03], [0.55, "#000", 0], [0.8, "#2a1608", 0.2], [1, "#2a1608", 0.1]], 0, -72, 0, -40, US);
  const WS = "#f3efe8", SW = "#120c08";
  const hf = (dunkel) => [[dunkel || "#5a3618", 2, 0.1, 0.16], ["#f4dcb4", 2, 0.09, 0.2]];
  const fR = F ? H.fellMuster("r", 172, hf(), { tile: 7, n: 110, len: 1.2, streu: 0.3 }) : "";
  const fH = F ? H.fellMuster("h", 64, hf(), { tile: 7, n: 110, len: 1.1, streu: 0.3 }) : "";
  const fB = F ? H.fellMuster("b", 92, hf(), { tile: 4, n: 50, len: 0.8, streu: 0.25 }) : "";
  const fK = F ? H.fellMuster("k", 205, hf("#4a2c14"), { tile: 4, n: 50, len: 0.6, streu: 0.35 }) : "";
  const fW = F ? H.fellMuster("w", 172, [["#8a8478", 1, 0.1, 0.12]], { tile: 3, n: 20, len: 1, streu: 0.3 }) : "";
  const fS = F ? H.fellMuster("s", 172, [["#6a4a30", 1, 0.12, 0.16]], { tile: 3, n: 20, len: 1, streu: 0.3 }) : "";
  /* ---- Beine: vorn Ellbogen, Vorderfußwurzel als flacher Knoten (vorn Haarbürste), Röhrbein, Fesselkopf, schräge Fessel, schmaler spitzer Huf.
     Hinten Z: Oberschenkel zum Knie vorn, Unterschenkel schräg nach hinten zum Sprunggelenk mit Fersenhöcker, senkrechter Mittelfuß ---- */
  const vorder = (x) => [[x + 1, -50, 4.6, 4.2], [x, -40, 3.4, 3], [x - 0.5, -29, 2.3, 2.2], [x - 0.5, -25, 2.5, 2.3], [x - 0.5, -21.5, 1.8, 1.8], [x - 0.3, -7.5, 1.45, 1.6], [x, -5.2, 1.85, 1.85], [x + 1.2, -3.2, 1.5, 1.35], [x + 2.2, -2.4, 1.4, 1.3]];
  const hinter = (x) => [[x + 8, -56, 7, 9], [x + 14, -44, 4.6, 5.5], [x + 10, -36, 3, 3.6], [x + 1, -24, 1.9, 3.2, 2], [x + 1, -20, 1.7, 1.8], [x + 1.5, -7.5, 1.45, 1.6], [x + 1.8, -5.2, 1.85, 1.85], [x + 3, -3.2, 1.5, 1.35], [x + 4, -2.4, 1.4, 1.3]];
  const huf = (x, fernB) => H.huf(x, 3, 1.5, 1.4, T.lg(fernB ? "hd" : "hg", fernB ? [[0, "#1a1512"], [1, "#0c0a08"]] : [[0, "#2a2420"], [1, "#100d0b"]]), true, { schraeg: 0.9, saum: "#c8a478" });
  const bein = (J, fernB, vorn) => {
    const kk = kette(J), m = J.length - 1;
    const buerste = vorn ? H.straehnen([[J[3][0] + 2.2, -27.5], [J[3][0] + 2.6, -25], [J[3][0] + 2.2, -22.5]], F ? 26 : 6, 1.6, 110, [["#1e140e", 2, 0.3, 0.9], ["#3a2616", 1, 0.25, 0.85]], { streu: 25, szene: 1 }) : "";
    return teil(kk.pts, fernB ? fern : lauf, {
      fell: [fB], vol: [1, 4, 0.4],
      innen: (vorn ? "" : `<path d="${G(kk.R.slice(0, 3).map((p) => [p[0] + 0.6, p[1]]).concat(kk.R.slice(0, 3).reverse().map((p) => [p[0] - 3, p[1]])))}" fill="${WS}" opacity=".85"/>`) +
        wf(G(H.laengs(kk, 0.25, vorn ? 4 : 4, m - 2), false), "#000", 0.22, 0.25, false, 0.5) + wf(G(H.laengs(kk, 0.9, 2, m - 2), false), "#fff", 0.2, 0.2, false, 0.5) +
        wf([[J[0][0] - 8, -48], [J[0][0] + 8, -48]], "#000", fernB ? 0.45 : 0.3, 2, false, 5) + (fernB ? `<rect x="${H.f(J[0][0] - 12)}" y="-60" width="26" height="60" fill="#000" opacity=".12"/>` : ""),
      oben: buerste,
    }) + (F ? `<path d="M${H.f(J[m - 2][0] - 1.6)} -6.8l-.9 1.1l.8.5Z" fill="#1e1814"/>` : "") + huf(J[m][0], fernB);
  };
  let s = "";
  s += bein(vorder(80), 1, 1) + bein(hinter(29), 1, 0);
  /* ---- Rumpf mit Hals: Widerrist, Hüfthöcker, Wespentaille (Bauch steigt zur Leiste), Vorbrust vor dem Vorderbein ---- */
  const rumpf = [[23, -68], [32, -71.5], [40, -71], [52, -69.5], [66, -70], [78, -71], [86, -74], [92, -79], [98, -86], [103, -95], [106, -101],
    [114, -96], [112, -89], [107, -78], [104, -68], [102, -60], [97, -52], [90, -46], [82, -42], [70, -41.5], [60, -44], [52, -48.5], [46, -50], [40, -49], [34, -44], [27, -46], [22, -54]];
  const rumpfFl = teil(rumpf, fell, {
    fell: F ? [] : [], ov: [licht], rim: 2.5, rimD: G(rumpf.slice(0, 12), false),
    innen: (F ? `<path d="M80 -110L120 -110L120 -60L95 -60Z" fill="${fH}"/><path d="M15 -80H100V-35H15Z" fill="${fR}"/>` : "") +
      /* helles Band über dem schwarzen, schwarzer Flankenstreif vom Oberarm bis vor den Oberschenkel, weißer Bauch */
      wf([[50, -50.5], [62, -53], [76, -53.5], [88, -52.5], [92, -50], [88, -48.6], [76, -50], [62, -49.5], [52, -47.5]], "#e0c290", 0.95, 0.4) +
      `<path d="${G([[51, -48.6], [62, -50.6], [76, -51.2], [88, -50.4], [92.5, -48], [90, -46.3], [80, -45.2], [68, -45], [58, -45.8], [52, -47]])}" fill="${SW}"/>` +
      wf([[54, -49.4], [66, -50.4], [80, -50.4], [90, -49]], "#5a4a3a", 0.5, 0.25, false, 0.6) +
      (F ? `<path d="${G([[52, -47.5], [62, -50.5], [76, -51.5], [88, -50], [90, -48]])}" fill="none" stroke="#3a2e24" stroke-width=".8" stroke-opacity=".4"/>` : "") +
      `<path d="${G([[50, -47.2], [58, -45.6], [70, -45.4], [82, -45.6], [92, -47.2], [100, -48], [100, -30], [44, -30]])}" fill="${T.lg("bauch", [[0, "#e9e5dc"], [1, "#a9a69f"]], 0, -48, 0, -40, US)}"/>` +
      (F ? `<path d="M44 -52H100V-30H44Z" fill="${fW}"/>` : "") +
      /* Kehle weiß, nach unten beige */
      `<path d="${G([[112, -95], [114, -92], [111, -86], [107, -78], [104, -70], [103, -76], [108, -86]])}" fill="${T.lg("kehle", [[0, "#f3efe8"], [1, "#e3cfb0"]], 0, -96, 0, -70, US)}"/>` +
      /* Licht: Kruppe, Rücken, Schulterblatt, Vorbrust-Glanz; Schatten: hinter dem Ellbogen, Flankenmulde, Kehlrinne */
      wf([[26, -68.5], [40, -70], [60, -68.5], [78, -70], [88, -75], [100, -92]], "#fff", 0.35, 0.6, false, 1.6) +
      wf([[84, -70], [92, -60], [98, -54]], "#fff", 0.18, 1.5, false) + wf([[100, -60], [101, -55]], "#fff", 0.3, 1, false) +
      wf([[82, -60], [80, -50]], "#000", 0.2, 1.5, false) + wf([[48, -62], [44, -54]], "#000", 0.18, 2, false) + wf([[110, -90], [106, -80]], "#000", 0.15, 1, false) +
      kerben([[[47, -66], [44, -58], [46, -51]]], 1, 0.25, "#3a2410"),
  });
  /* Oberschenkel: kräftige Masse von der Kruppe nach vorn-unten zum Knie, Hinterkante konvex bis knapp über das Sprunggelenk */
  const keule = [[24, -66], [36, -70], [46, -66], [50, -56], [49, -46], [45, -41], [40, -37], [35, -33], [29, -35], [24, -41], [21, -52]];
  const keuleFl = teil(keule, fell, { ov: [licht], fell: [fR],
    innen: `<path d="${G([[20, -66], [25.4, -66.5], [27, -58], [26.6, -50], [24.6, -44.5], [20, -43]])}" fill="${T.lg("spiegel", [[0, "#f2eee6"], [1, "#bdb8ae"]], 0, -66, 0, -43, US)}"/>` + `<path d="${G([[26.6, -62], [27.8, -57], [27.6, -52], [26.2, -48], [26, -53], [26.2, -58]])}" fill="${SW}"/>` +
      wf([[30, -66], [40, -66], [46, -60]], "#fff", 0.25, 1.4, false) + wf([[48, -50], [42, -40], [34, -32]], "#000", 0.22, 1.2, false) });
  s += H.vol(rumpfFl + keuleFl, [5, 4, 0.4]);
  s += bein(vorder(88), 0, 1) + bein(hinter(24), 0, 0);
  /* ---- Schwanz: an der Oberlinie, hängt über das Weiß, schwarz und buschig ---- */
  s += H.straehnen([[22.5, -68], [21.5, -66], [21, -64]], F ? 40 : 10, (t) => 10 + t * 4, (x, y, t) => 98 + (t - 0.5) * 18, [[SW, 3, 0.35, 0.95], ["#3a2a1e", 1, 0.3, 0.9]], { streu: 10, welle: 0.25, szene: 1 });
  /* ---- Kopf: Achse 34° nach unten, schmal, Nasenrücken leicht konvex, Augenbogen hebt die Kontur ---- */
  const wa = 34 * Math.PI / 180, P0 = [105, -102];
  const K = (u, v) => [P0[0] + u * Math.cos(wa) - v * Math.sin(wa), P0[1] + u * Math.sin(wa) + v * Math.cos(wa)];
  const kopfL = [[-1, -1], [3, -4.6], [8, -5.2], [10.5, -5.8], [13, -5.2], [17, -4.4], [21, -3.6], [23.6, -2.2], [24.6, -0.4], [24.4, 1.2], [23, 1.8], [23.4, 2.6], [22, 3.4], [18, 3.6],
    [13, 4.6], [8, 6], [4, 6.2], [0.5, 4.5]];
  const kopf = kopfL.map((p) => K(p[0], p[1]));
  let k = "";
  k += teil(kopf, fell, {
    fell: [fK], vol: [1.6, 4, 0.4], rim: 1.2, rimD: G(kopf.slice(0, 15), false),
    innen: /* helle graubeige Stirn, rotbrauner Streif Hornbasis→Nase, weißer Streif Augenring→Nase, schwarzer Streif vorderer Augenwinkel→Mundwinkel */
      `<path d="${G([K(2, -4.8), K(9, -6), K(13, -5.4), K(12, -3.6), K(6, -3.4)])}" fill="#c9b49a"/>` +
      `<path d="${G([K(9, -5.8), K(15, -5), K(21, -3.9), K(24, -2), K(22.5, -1.6), K(18, -2.6), K(13, -3.6), K(10, -4)])}" fill="#9a5a2c"/>` +
      `<path d="${G([K(7.5, -3.2), K(12, -2.8), K(17, -2.1), K(22.5, -1.1), K(23, -0.3), K(17, -0.9), K(12, -1.5), K(9, -1.6)])}" fill="${WS}"/>` +
      `<path d="${G([K(10.8, -1.1), K(14, -0.9), K(18, -0.3), K(22.4, 0.6), K(22.2, 1.6), K(18, 1.3), K(14, 0.8), K(11, 0.5)])}" fill="${SW}"/>` +
      /* dunkler Nasenfleck auf dem Nasenrücken; Kinn und Lippen weiß; Kaumuskel */
      wf([K(19.4, -3.5), K(21.4, -3), K(21, -2), K(19.2, -2.5)], "#3a2a20", 0.85, 0.3) +
      `<path d="${G([K(23.2, 2.4), K(22, 3.4), K(18, 3.6), K(14, 4.4), K(16, 2.6), K(20, 2.4)])}" fill="${WS}"/>` +
      wf([K(4, 1), K(9, 3), K(8, 5)], "#000", 0.15, 0.8) + wf([K(6, -1), K(10, 0.6)], "#fff", 0.15, 0.6, false) +
      /* Nasenspiegel feucht, Komma-Nasenloch, Oberlippe überhängend, Mundwinkel als kurze Schattenfalte */
      wf([K(23.2, -1.4), K(24.6, -0.4), K(24, 1)], "#2a2420", 0.7, 0.3) + `<path d="${G([K(22.3, -0.9), K(23.3, -1.2), K(23.6, -0.2), K(23, 0.3)])}" fill="#1a1410"/>` +
      wf([K(23.6, -1.5), K(24.4, -1)], "#fff", 0.5, 0.15, false, 0.3) + kerben([[K(24.2, 1.6), K(22.8, 2), K(21, 2)]], 0.35, 0.8, "#1a1410") + wf([K(20.5, 2), K(19.8, 2.6)], "#000", 0.3, 0.2, false) +
      (F ? T.schnurrhaare(...K(23.5, 1.5), 5, 2, 120, 50, "#1a1410", 0.04) : ""),
  });
  /* Auge: groß, rund; weißer Fellring, Lidwulst, Voraugendrüse als dunkle Schlitzfalte vom vorderen Winkel nach vorn-unten */
  const [ax, ay] = K(9.2, -2.2);
  k += wf([[ax - 2.2, ay], [ax, ay - 1.9], [ax + 2.2, ay], [ax, ay + 1.7]], WS, 0.95, 0.25);
  k += `<path d="${G([K(10.8, -1.5), K(12.6, -0.6), K(13.8, 0.4), K(12.4, 0.3), K(10.8, -0.8)])}" fill="#2a1c14"/>`;
  k += H.auge(ax, ay, 1.45, { iris: "#2a1810", iris2: "#120a06", offen: 0.75, pupille: "quer", wimpern: 11, wl: 1.1, lid: "#0e0906", lidHaut: "#3a2416", winkel: 30, hoehleA: 0.15, feucht: "#d8cfc4", wimpernFarbe: "#1a120b" });
  /* Hörner: geringelt (unten dicht), lyraförmig – erst nach hinten-oben, Spitzen nach vorn; obere 25 % glatt und heller */
  const horn = (dx, fernB) => {
    const b = K(5.2 + dx, -4.8);
    const J = [[b[0], b[1], 1.5, 1.5], [b[0] - 3, b[1] - 9, 1.35, 1.35], [b[0] - 5.4, b[1] - 18, 1.1, 1.1], [b[0] - 6, b[1] - 25, 0.85, 0.85], [b[0] - 4.6, b[1] - 30.5, 0.6, 0.6], [b[0] - 2.2, b[1] - 33.5, 0.2, 0.2]];
    const kk = kette(J), ringe = [];
    for (let t = 0.12, i = 0; t < 3.2; t += (F ? 0.17 : 0.4) * (1 + t * 0.25), i++) { const [p, q] = H.an(kk, t); ringe.push([[p[0] + 0.25, p[1] - 0.1], [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + 0.35], [q[0] - 0.25, q[1] - 0.1]]); }
    return teil(kk.pts, fernB ? "#1a1612" : T.lg("horn", [[0, "#2a231c"], [0.65, "#3b3128"], [1, "#5a524a"]], b[0], b[1], b[0], b[1] - 33, US), { vol: [0.6, 4, 0.4],
      innen: L(ringe, "#000", 0.32, 0.55, "", 1) + L(ringe.map((z) => z.map((p) => [p[0], p[1] - 0.25])), "#a09280", 0.18, 0.4, "", 1) + wf([[b[0] - 4.2, b[1] - 26], [b[0] - 3.2, b[1] - 31]], "#fff", 0.45, 0.15, false, 0.3) });
  };
  /* Ohren: lanzettförmig, ~60 % der Kopflänge; Muschel mit Kernschatten und weißen Haarlinien */
  const ohr = (dreh, fernB) => {
    const b = K(1.4, -3.2), a = dreh * Math.PI / 180, l = fernB ? 11.5 : 13.5, nx = -Math.sin(a), ny = Math.cos(a), P = (t, q) => [b[0] + Math.cos(a) * l * t + nx * q, b[1] + Math.sin(a) * l * t + ny * q];
    const pts = [P(0, -1.6), P(0.35, -2.4), P(0.7, -2), P(1, 0, 1), P(0.7, 1.8), P(0.35, 2.2), P(0, 1.5)];
    return teil(pts, fernB ? "#8a5e3a" : "#c48b55", { fell: [fK], vol: [0.6, 4, 0.4],
      innen: fernB ? "" : `<path d="${G([P(0.12, -0.3), P(0.45, -1.4), P(0.82, -0.8), P(0.9, 0.2), P(0.5, 0.6)])}" fill="#5a3a24"/>` + L([0, 1, 2, 3].map((i) => [P(0.15 + i * 0.05, -0.2 - i * 0.25), P(0.5 + i * 0.06, -0.6 - i * 0.2), P(0.8, -0.3 - i * 0.12)]), "#f6efe4", 0.12, 0.8, "", 1) +
        wf([P(0.85, -1.2), P(1, 0), P(0.85, 1.2)], "#2a1a0e", 0.4, 0.3, false) });
  };
  s += ohr(-150, 1) + horn(-1.2, 1) + k + horn(0) + ohr(-158);
  return { svg: s, box: [17, -141, 125, 0], fuesse: [87, 79, 28, 33], kopf: [90, -142, 126, -82] };
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
  const H = mach(T, 1, 0.35), { teil, L, kette, G, wf, kerben, falte } = H, F = H.F, US = H.US;
  /* Fell: schiefergraues Silber mit Braunstich, unten dunkler; Beine graubraun */
  const fell = T.lg("fell", [[0, "#8a8784"], [0.4, "#77726d"], [0.75, "#625a54"], [1, "#5a524b"]], 0, -158, 0, -64, US);
  const fern = T.lg("fern", [[0, "#5a5450"], [1, "#4a433e"]], 0, -120, 0, 0, US);
  const lauf = T.lg("lauf", [[0, "#5e544c"], [1, "#4f463f"]], 0, -90, 0, 0, US);
  const licht = T.lg("licht", [[0, "#fff", 0.16], [0.3, "#fff", 0.02], [0.55, "#000", 0], [0.8, "#1a1410", 0.22], [1, "#a89a8a", 0.12]], 0, -156, 0, -66, US);
  const SW = "#110e0c";
  const hf = [["#2a2522", 2, 0.12, 0.22], ["#9a9ea2", 2, 0.11, 0.22]];
  const fR = F ? H.fellMuster("r", 168, hf, { tile: 7, n: 110, len: 1.6, streu: 0.3 }) : "";
  const fH = F ? H.fellMuster("h", 70, hf, { tile: 7, n: 110, len: 1.5, streu: 0.3 }) : "";
  const fB = F ? H.fellMuster("b", 92, [["#2a2420", 1, 0.1, 0.2], ["#8a8078", 1, 0.1, 0.18]], { tile: 4, n: 40, len: 1, streu: 0.25 }) : "";
  const fK = F ? H.fellMuster("k", 240, [["#000", 1, 0.1, 0.25], ["#6a605a", 1, 0.1, 0.22]], { tile: 4, n: 40, len: 0.8, streu: 0.35 }) : "";
  /* ---- Beine: schlank; vorn Vorderfußwurzel als kantige Verdickung, Röhrbein mit Sehnenrinne, Fesselgelenk, Afterklauen, gespaltener Huf.
     hinten Sprunggelenk mit Fersenhöcker, Achillessehne als Kante ---- */
  const vorder = (x) => [[x + 3, -96, 9.5, 9.5], [x + 1, -70, 6.6, 6], [x, -52, 4.3, 4.2], [x, -46, 4.6, 4.4], [x, -41, 3.6, 3.6], [x + 0.3, -14, 3.1, 3.4], [x + 0.6, -9.5, 4, 4], [x + 2.6, -5.6, 3.3, 3], [x + 4, -4.5, 3.2, 3]];
  const hinter = (x) => [[x + 6, -100, 12, 14], [x + 14, -74, 7.5, 8], [x + 8, -58, 5, 6], [x - 1, -42, 3.4, 5.6, 2], [x - 0.5, -36, 3.3, 3.4], [x + 0.5, -14, 3.1, 3.4], [x + 1, -9.5, 4, 4], [x + 3, -5.6, 3.3, 3], [x + 4.4, -4.5, 3.2, 3]];
  const huf = (x, fernB) => H.huf(x, 5, 3.4, 3, T.lg(fernB ? "hd" : "hg", fernB ? [[0, "#1d1916"], [1, "#0e0c0a"]] : [[0, "#2c2723"], [1, "#12100e"]]), true, { schraeg: 0.85, saum: "#7a7068" });
  const bein = (J, fernB, vorn) => {
    const kk = kette(J), m = J.length - 1;
    return teil(kk.pts, fernB ? fern : lauf, {
      fell: [fB], vol: [2, 4, 0.4],
      innen: wf(G(H.laengs(kk, 0.22, 4, m - 2), false), "#000", 0.25, 0.4, false, 0.9) + wf(G(H.laengs(kk, 0.88, 3, m - 2), false), "#fff", 0.14, 0.4, false, 0.9) +
        (vorn ? wf([[J[3][0] + 3.5, -48], [J[3][0] + 4, -45]], "#fff", 0.25, 0.6, false) : wf(G(H.laengs(kk, 0.1, 1, 4), false), "#000", 0.25, 0.6, false, 1.3)) +
        wf([[J[0][0] - 12, -70], [J[0][0] + 12, -70]], "#000", fernB ? 0.45 : 0.3, 3, false, 9) + (fernB ? `<rect x="${H.f(J[0][0] - 20)}" y="-110" width="40" height="110" fill="#000" opacity=".1"/>` : ""),
    }) + (F ? `<path d="M${H.f(J[m - 3][0] - 3.2)} -11.5q-1.6 1.2 -.9 2.6q1.2-.4 1.6-1.6ZM${H.f(J[m - 3][0] - 2.4)} -10.6q-1.4 1.4-.4 2.6q1-.6 1.1-1.8Z" fill="#141110"/>` : "") + huf(J[m][0], fernB);
  };
  let s = "";
  s += bein(vorder(140), 1, 1) + bein(hinter(66), 1, 0);
  /* ---- Schwanz: Ansatz auf der Rückenlinie an der Kruppe; kurzhaarige graue Rübe, dann langes schwarzes Pferdehaar bis unter das Sprunggelenk ---- */
  const sk = kette([[30, -128, 3.4, 3.4], [25, -120, 3, 3], [22, -110, 2.6, 2.6]]);
  s += wf([[30, -122], [24, -100], [24, -70]], "#000", 0.3, 2, false, 6);
  s += teil(sk.pts, fell, { fell: [fR], vol: [1.4, 4, 0.4], innen: wf([[29, -127], [23, -112]], SW, 0.6, 0.6, false, 1.6) });
  s += H.straehnen([[23.5, -114], [21.5, -110], [21, -106]], F ? 110 : 30, (t) => 48 + t * 14, (x, y, t) => 96 - (t - 0.5) * 16, [[SW, 3, 0.7, 0.95], ["#2a221c", 2, 0.6, 0.9], ["#4a3e34", 1, 0.5, 0.7]], { streu: 9, welle: 0.25, szene: 1 });
  /* ---- Rumpf mit Hals: Widerristbuckel, Rücken fällt gerade zur Kruppe, Hüfthöcker; tiefe Brust, Bugspitze vor dem Vorderbein,
     Bauch hinter dem Ellbogen am tiefsten und zur Flanke stark aufgezogen; kurzer, dicker Hals ---- */
  const rumpf = [[30, -128], [44, -130], [66, -133], [80, -136], [100, -142], [124, -150], [140, -156], [152, -157], [166, -154], [182, -150], [192, -146],
    [198, -128], [196, -118], [186, -104], [178, -94], [170, -84], [160, -74], [148, -68], [130, -66], [110, -70], [90, -76], [74, -80], [66, -84], [52, -86], [40, -84],
    [30, -92], [24, -104], [24, -118]];
  /* Streifen: am Hals am kräftigsten, über Schulter und vordere Rippen, nach hinten auslaufend; unregelmäßig, gegabelt, leicht gebogen */
  const baender = [];
  for (let x = 196, i = 0; x > 92; i++) {
    const st = Math.max(0, Math.min(1, (x - 92) / 60)), w = 1.1 + ((i * 53) % 10) / 10 * 1.6, top = x > 150 ? -150 + (x - 150) * 0.1 : -136 - (x - 92) * 0.25;
    const unten = x > 160 ? -100 - (x - 170) * 0.2 : -84 - st * 4;
    baender.push([[[x + 3, top], [x - 1, (top + unten) / 2], [x - 4 - (x > 150 ? 4 : 0), unten]], w * (0.4 + 0.6 * st), 0.25 + 0.5 * st]);
    x -= 4 + ((i * 37) % 10) / 10 * 4.5;
  }
  const bandD = (sel) => baender.filter(sel).map(([z, w]) => G(kette(z.map((p, j) => [p[0], p[1], [0.25, 1, 0.35][j] * w, [0.25, 1, 0.35][j] * w])).pts, true, 1, 1)).join("");
  s += teil(rumpf, fell, {
    ov: [licht], vol: [12, 4, 0.4], rim: 5, rimD: G(rumpf.slice(25).concat(rumpf.slice(0, 11)), false),
    innen: (F ? `<path d="M140 -170H210V-90H140Z" fill="${fH}"/><path d="M10 -150H140V-60H10Z" fill="${fR}"/>` : "") +
      `<path d="${bandD((b) => b[2] > 0.55)}" fill="#2b2420" opacity=".55"${F ? ` stroke="${H.fellMuster("bs", 90, [["#2b2420", 1, 0.25, 0.8]], { tile: 3, n: 16, len: 1.4, streu: 0.4 })}" stroke-width="1.4"` : ""}/>` +
      `<path d="${bandD((b) => b[2] <= 0.55)}" fill="#2b2420" opacity=".28"/>` +
      /* Licht: Widerrist, Schulterblatt, Hüfthöcker, Kruppe; Kernschatten hinter dem Ellbogen, Flanke, unter dem Hals */
      wf([[40, -129], [80, -134], [124, -148], [146, -154], [170, -151]], "#fff", 0.3, 1, false, 2.5) + wf([[150, -140], [160, -120], [170, -100]], "#fff", 0.12, 4, false) +
      wf([[60, -130], [70, -131]], "#fff", 0.25, 2, false) + wf([[150, -74], [146, -86]], "#000", 0.3, 3, false) + wf([[80, -100], [74, -86]], "#000", 0.2, 3, false) +
      wf([[198, -126], [190, -108], [180, -96]], "#000", 0.3, 3, false, 8) + wf([[178, -92], [176, -86]], "#fff", 0.2, 2, false) +
      /* Aalstrich, der aus der Mähne kommt */
      wf([[44, -129.5], [80, -135], [110, -144]], SW, 0.5, 0.6, false, 2),
  });
  /* Oberschenkel / Hosenmuskulatur mit Knie vorn an der Bauchlinie und Kniefalte zur Flanke */
  const keule = [[26, -122], [40, -128], [56, -126], [68, -114], [74, -96], [76, -84], [72, -76], [66, -70], [58, -64], [46, -60], [36, -64], [28, -76], [24, -96]];
  s += teil(keule, fell, { ov: [licht], fell: [fR], vol: [7, 4, 0.4],
    innen: wf([[34, -124], [52, -124], [64, -112]], "#fff", 0.22, 2, false) + kerben([[[74, -86], [70, -100], [62, -114]]], 1.6, 0.3, "#1a1410") + wf([[60, -66], [44, -60]], "#000", 0.25, 2, false) });
  s += bein(vorder(152), 0, 1) + bein(hinter(52), 0, 0);
  /* ---- Mähne: struppig aufrecht, vom Genick bis knapp hinter den Widerrist, dort schmal in den Aalstrich ---- */
  const kammP = [[118, -147], [134, -154], [150, -157], [166, -154], [180, -150], [190, -147]];
  const mh = [3, 7, 9, 10, 9, 7];
  s += H.straehnen(kammP, F ? 260 : 60, (t) => 3 + Math.sin(Math.min(1, t * 1.25) * Math.PI) * 7, (x, y, t) => -92 + (t - 0.5) * 30, [[SW, 3, 0.55, 0.95], ["#2a221c", 2, 0.5, 0.9], ["#4a3f36", 1, 0.45, 0.8]], { streu: 18, welle: 0.3, szene: 1 });
  /* ---- Kopf: Achse 63° nach unten, ~50 cm; Ramsnase, eckiges breites Maul, Nüster, Lippen, Kinn; Gesicht schwarzbraun, Wangen heller ---- */
  const wa = 63 * Math.PI / 180, P0 = [188, -150];
  const K = (u, v) => [P0[0] + u * Math.cos(wa) - v * Math.sin(wa), P0[1] + u * Math.sin(wa) + v * Math.cos(wa)];
  const kopfL = [[-1, -4], [5, -8.5], [14, -9.4], [24, -10.6], [32, -11.4], [40, -11.2], [46, -10.4], [50, -8.6, 1], [52, -4], [52.4, 2], [51.6, 6.6, 1], [48, 8.6], [44, 9.2], [38, 9.6],
    [30, 11.2], [24, 14.4], [17, 17.4], [10, 17], [4, 13], [0, 7], [-2.5, 1]];
  const kopf = kopfL.map((p) => K(p[0], p[1]));
  let k = "";
  /* Bart: beginnt an der Kehle unter dem Unterkiefer, zieht als Saum die Halsunterseite entlang, Haare fallen senkrecht */
  const bartW = [K(18, 17), K(10, 19), [192, -114], [188, -106], [182, -98]];
  k += H.straehnen(bartW, F ? 170 : 40, (t) => 10 + Math.sin(t * Math.PI) * 6, (x, y) => 92 + (x - 190) * 0.2, [[SW, 3, 0.55, 0.9], ["#3e342c", 1, 0.45, 0.8], ["#1e1916", 2, 0.4, 0.5]], { streu: 10, welle: 0.3, szene: 1 });
  k += wf([[196, -116], [190, -104], [182, -94]], "#000", 0.3, 3, false, 6);
  k += teil(kopf, T.lg("kopf", [[0, "#3d3733"], [0.5, "#2c2623"], [1, "#1c1816"]], 0, 0, 0.3, 1), {
    fell: [fK], vol: [5, 4, 0.4], rim: 2.5, rimD: G(kopf.slice(0, 19), false),
    innen: /* Stirn/Nasenrücken tief schwarzbraun, Wangen/Ganaschen heller graubraun */
      wf([K(4, -8), K(30, -10.6), K(48, -9.6), K(48, -3), K(30, -4), K(8, -3)], "#141110", 0.7, 1.2) +
      wf([K(6, 4), K(22, 4), K(30, 9), K(18, 15), K(8, 12)], "#4a423d", 0.6, 2) +
      /* Kaumuskelplatte: Lichtkante oben, Kernschatten unten; Kehlmulde */
      wf([K(8, 3), K(24, 3.6)], "#8a8078", 0.3, 0.8, false) + wf([K(12, 15.5), K(26, 13.4)], "#000", 0.35, 1.2, false) +
      /* Ramsnasen-Glanz */
      wf([K(26, -10.6), K(36, -11.2), K(44, -10.4)], "#8a8580", 0.45, 0.6, false) +
      /* Nüster: groß, kommaförmig, schräg; Flügel mit Lichtkante */
      `<path d="${G([K(45.5, -6.5), K(48.4, -8), K(51, -5.6), K(50.6, -1.2), K(48.6, 0.4), K(47.6, -3), K(46, -4.4)])}" fill="#0a0807"/>` +
      wf([K(45, -8), K(48.6, -9.4), K(51.8, -6.4)], "#9a9690", 0.5, 0.3, false, 0.8) +
      /* Maulspalte, überstehende Oberlippe, Kinnwulst, Mundwinkel-Grübchen; Tasthaare */
      kerben([[K(52, 4.6), K(48.6, 5.6), K(44, 6), K(40, 6.6)]], 0.9, 0.9, "#000") + wf([K(40, 6.8), K(38.6, 7.6)], "#000", 0.45, 0.5, false) +
      wf([K(50.4, 7.6), K(46, 8.6)], "#5a524c", 0.4, 0.4, false) + wf([K(51.6, 0), K(51.8, 4)], "#fff", 0.2, 0.3, false) +
      /* Voraugendrüse: dunkler feuchter Fleck vor/unter dem vorderen Augenwinkel */
      wf([K(19, -4), K(22, -3), K(21, -1.6), K(18.6, -2.4)], "#050403", 0.85, 0.4) + `<circle cx="${H.f(K(20, -3)[0])}" cy="${H.f(K(20, -3)[1])}" r=".3" fill="#fff" opacity=".7"/>` +
      (F ? T.schnurrhaare(...K(50, 5), 8, 3.5, 115, 60, "#2a2420", 0.07) : ""),
  });
  /* Auge: Mandel, groß; Knochenbogen darüber, waagrechte Pupille, Wimpern nach vorn-unten */
  const [ax, ay] = K(13, -4.6);
  k += H.auge(ax, ay, 2, { iris: "#3b2414", iris2: "#140a05", offen: 0.62, pupille: "quer", wimpern: 14, wl: 1.3, lid: "#0a0706", lidHaut: "#1e1a17", winkel: 50, hoehleA: 0.25, feucht: "#8a7a70", wimpernFarbe: "#2a221c" });
  /* Hörner: Basen als breiter rauer Stirnwulst; nahes Horn erst seitlich-abwärts zum Betrachter (verkürzt), dann nach oben-innen; fernes dahinter */
  const wulst = [K(-2, -6), K(2, -12.5), K(8, -13), K(11, -9), K(6, -7)];
  const horn = (dx, dy, fernB) => {
    const b = K(4 + dx, -10 + dy);
    const J = [[b[0], b[1], 2.8, 2.8], [b[0] + 5, b[1] + 3, 2.6, 2.6], [b[0] + 10, b[1] + 2, 2.2, 2.2], [b[0] + 13, b[1] - 3, 1.8, 1.8], [b[0] + 13.5, b[1] - 10, 1.3, 1.3], [b[0] + 11, b[1] - 16, 0.7, 0.7], [b[0] + 8.5, b[1] - 19, 0.15, 0.15]];
    const kk = kette(J);
    return teil(kk.pts, fernB ? "#1c1815" : T.lg("horn", [[0, "#2a2420"], [0.6, "#3c342e"], [1, "#6b625a"]], b[0], b[1], b[0] + 10, b[1] - 18, US), { vol: [1, 4, 0.4],
      innen: wf(G(H.laengs(kk, 0.75, 2, 6), false), "#fff", fernB ? 0.1 : 0.35, 0.3, false, 0.7) + (F ? L([[J[0], J[1]], [[J[0][0] + 1, J[0][1] - 1], [J[1][0] + 1, J[1][1] - 1]]], "#000", 0.25, 0.3, "", 1) : "") });
  };
  /* Ohr: spitz-blattförmig, unter und hinter der Hornbasis, seitlich abstehend; Innenmuschel heller mit weißen Härchen am Rand */
  const ohr = (fernB) => {
    const b = K(3, -2), a = (180 + (fernB ? 20 : 8)) * Math.PI / 180, l = fernB ? 13 : 15, nx = -Math.sin(a), ny = Math.cos(a), P = (t, q) => [b[0] + Math.cos(a) * l * t + nx * q, b[1] + Math.sin(a) * l * t + ny * q];
    const pts = [P(0, -2.4), P(0.35, -3.6), P(0.72, -2.8), P(1, 0, 1), P(0.72, 2.4), P(0.35, 3), P(0, 2.2)];
    return teil(pts, fernB ? "#3a3430" : "#4c4440", { vol: [0.8, 4, 0.4], fell: [fK],
      innen: fernB ? "" : `<path d="${G([P(0.12, -0.6), P(0.45, -2), P(0.82, -1.1), P(0.9, 0.3), P(0.5, 0.8)])}" fill="#8a8480"/>` + L([0, 1, 2].map((i) => [P(0.2 + i * 0.1, -1.6 - i * 0.3), P(0.55 + i * 0.08, -2.4 - i * 0.1)]), "#e8e4de", 0.15, 0.8, "", 1) +
        wf([P(0.85, -1.4), P(1, 0), P(0.85, 1.2)], "#000", 0.35, 0.3, false) });
  };
  s += ohr(1) + horn(-2, -1.5, 1) + k + teil(wulst, "#3a3430", { vol: [1, 4, 0.4], innen: F ? L([[wulst[0], wulst[2]], [wulst[4], wulst[1]]], "#000", 0.25, 0.4, "", 1) : "" }) + horn(0, 0) + ohr(0);
  return { svg: s, box: [14, -175, 216, 0], fuesse: [157, 145, 57, 70], kopf: [170, -178, 218, -84] };
}

module.exports = [
  { id: "elefant", de: "der Elefant", syl: "e-le-FANT", it: "l'elefante", itSyl: "e-le-FAN-te", en: "elephant",
    gruppe: "Rüsseltiere", lebensraum: "Savanne", laenge: 5.15, hoehe: 3.36, zeichne: elefant },
  { id: "giraffe", de: "die Giraffe", syl: "gi-RAF-fe", it: "la giraffa", itSyl: "gi-RAF-fa", en: "giraffe",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 4.23, hoehe: 5.6, zeichne: giraffe },
  { id: "zebra", de: "das Zebra", syl: "ZE-bra", it: "la zebra", itSyl: "ZE-bra", en: "zebra",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 2.05, hoehe: 2.1, zeichne: zebra },
  { id: "nashorn", de: "das Nashorn", syl: "NAS-horn", it: "il rinoceronte", itSyl: "ri-no-ce-RON-te", en: "rhinoceros",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 3.97, hoehe: 2.17, zeichne: nashorn },
  { id: "nilpferd", de: "das Nilpferd", syl: "NIL-pferd", it: "l'ippopotamo", itSyl: "ip-po-PO-ta-mo", en: "hippopotamus",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 4.42, hoehe: 1.81, zeichne: nilpferd },
  { id: "gazelle", de: "die Gazelle", syl: "ga-ZEL-le", it: "la gazzella", itSyl: "gaz-ZEL-la", en: "gazelle",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 1.25, hoehe: 1.49, zeichne: gazelle },
  { id: "gnu", de: "das Gnu", syl: "GNU", it: "lo gnu", itSyl: "GNU", en: "wildebeest",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 1.99, hoehe: 1.63, zeichne: gnu },
];
