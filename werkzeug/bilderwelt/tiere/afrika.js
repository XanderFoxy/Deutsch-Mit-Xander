/* =====================================================================
   TIER-BIBLIOTHEK — AFRIKA / SAVANNE (FASSUNG 854)
   Elefant, Giraffe, Zebra, Nashorn, Nilpferd, Gazelle, Gnu.
   Maße in Zentimetern, Blick nach rechts, Boden y = 0, Licht von links oben.
   ===================================================================== */
"use strict";

/* ---------- gemeinsame Helfer (nur für diese Datei) ---------- */
function mach(T, dez, RW) {
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
  const H = { f, G };
  H.RIM = () => T.lg("rim", [[0, "#fff", 0.32], [0.42, "#fff", 0], [0.58, "#000", 0], [1, "#000", 0.42]], 0, 0, 1, 1);
  H.US = ' gradientUnits="userSpaceOnUse"';
  const weichSchon = new Set();
  /* weichzeichnen (nur volle Feinheit): Randlicht/-schatten ohne harte Stufen */
  H.weich = (sd) => {
    sd = Math.max(0.3, Math.round(sd * 2) / 2);
    const id = T.id("bl" + String(sd).replace(".", "_"));
    if (!weichSchon.has(id)) { weichSchon.add(id); T.def(`<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${sd}"/></filter>`); }
    return `url(#${id})`;
  };
  /* Körperteil: Pfad EINMAL in defs, dann Füllung / Innenzeichnung / Licht / Rand per <use> */
  H.teil = (pts, fill, o = {}) => {
    const d = typeof pts === "string" ? pts : G(pts, true, o.sp || 1);
    const id = T.id("t" + nr++);
    T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
    const u = (a) => `<use href="#${id}" ${a}/>`;
    let s = u(`fill="${fill}"`);
    const ov = o.ov === undefined ? [T.lg("vol", [[0, "#fff", 0.2], [0.4, "#fff", 0], [0.7, "#000", 0.06], [1, "#000", 0.3]])] : o.ov;
    /* Randschatten/Randlicht: breiter Strich mit Schräg-Verlauf (links oben hell, rechts unten dunkel), nach innen geklippt */
    const rim = o.rim && T.fein ? u(`fill="none" stroke="${o.rimG || H.RIM()}" stroke-width="${f(o.rim)}" filter="${H.weich(o.rim * 0.22)}"`) : "";
    /* Rand nur nach innen (geklippt): keine helle Säumung außen */
    const randStil = `fill="none" stroke="${o.rand || "#1a140e"}" stroke-opacity="${o.randA != null ? o.randA : 0.45}" stroke-width="${f(2 * (o.rw || RW))}" stroke-linejoin="round" stroke-linecap="round"`;
    const rand = o.randD ? `<path d="${o.randD}" ${randStil}/>` : o.rand !== false ? u(randStil) : "";
    const innen = (o.innen || "") + ov.map((g) => u(`fill="${g}"`)).join("") + rim + (o.oben || "") + rand;
    if (innen) s += `<g clip-path="url(#${id}c)">${innen}</g>`;
    return s;
  };
  /* mehrere offene Linien in EINEM Pfad */
  H.L = (zuege, farbe, w, op = 1, extra = "") =>
    `<path d="${zuege.map((p) => G(p, false)).join("")}" fill="none" stroke="${farbe}" stroke-width="${w}"${op < 1 ? ` stroke-opacity="${op}"` : ""} stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  /* weicher Licht-/Schattenfleck */
  H.fl = (x, y, rx, ry, rot, hell, op = 1) => {
    const g = hell ? T.rg("hl", [[0, "#fff", 0.32], [1, "#fff", 0]]) : T.rg("dk", [[0, "#000", 0.34], [1, "#000", 0]]);
    return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}"${rot ? ` transform="rotate(${rot} ${f(x)} ${f(y)})"` : ""} fill="${g}"${op < 1 ? ` opacity="${op}"` : ""}/>`;
  };
  /* Kette (Bein, Rüssel, Schwanz): J = [x, y, vorne, hinten, ecke] → Umriss; Seiten L/R */
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
    return { L: Lp, R: Rp, pts: Lp.concat(Rp.slice().reverse()) };
  };
  /* offene Seitenlinien einer Kette ab Glied i0 (für Beine, die oben in den Rumpf übergehen) */
  H.seiten = (k, i0, i1) => G(k.L.slice(i0, i1).map((p) => [p[0], p[1]]), false) + G(k.R.slice(i0, i1).map((p) => [p[0], p[1]]), false);
  H.bein = (J, fill, o = {}) => H.teil(H.kette(J).pts, fill, Object.assign({ ov: [T.lg("bx", [[0, "#fff", 0.12], [0.45, "#fff", 0], [1, "#000", 0.28]], 0, 0, 1, 0)] }, o));
  /* Huf: x = Kronrand-Mitte, h = Höhe, lv/lh = halbe Breite vorn/hinten */
  H.huf = (x, h, lv, lh, farbe, spalt) => {
    const p = [[x - lh * 0.9, -h, 1], [x + lv * 0.75, -h * 1.02, 1], [x + lv + h * 0.55, -0.4], [x + lv + h * 0.5, 0, 1], [x - lh * 1.05, 0, 1], [x - lh * 1.1, -h * 0.45]];
    let s = H.teil(p, farbe, { ov: [T.lg("hufl", [[0, "#fff", 0.18], [1, "#fff", 0]], 0, 0, 1, 0)], rw: RW * 0.8, randA: 0.5 });
    if (spalt) s += H.L([[[x + lv * 0.45, -h * 0.98], [x + lv * 0.6 + h * 0.3, -h * 0.1]]], "#000", RW * 0.6, 0.45);
    return s;
  };
  /* Bodenkontakt */
  H.kontakt = (xs, rx, ry) => xs.map((x) => `<ellipse cx="${f(x)}" cy="0" rx="${f(rx)}" ry="${f(ry)}" fill="#000" opacity=".22"/>`).join("");
  /* zufällige Runzeln (Elefant, Nashorn): n kurze Knicklinien in einem Feld */
  H.runzeln = (n, x0, y0, x1, y1, len, farbe, w, op) => {
    let d = "";
    for (let i = 0; i < n; i++) {
      const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
      const a = (T.rnd() - 0.5) * 1.2, l = len * (0.5 + T.rnd());
      d += `M${f(x)} ${f(y)}l${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)}l${f(Math.cos(a + 0.9) * l * 0.6)} ${f(Math.sin(a + 0.9) * l * 0.6)}`;
    }
    return `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  /* Hautfalte: dunkle Kerbe + Lichtkante darunter/rechts (Licht von links oben) */
  H.falte = (zuege, w, op, farbe = "#1d150f") => H.L(zuege, farbe, w, op) +
    (T.fein ? H.L(zuege.map((z) => z.map((p) => [p[0] + w * 0.7, p[1] + w * 0.9])), "#fff", w * 0.6, op * 0.45) : "");
  /* weiche Form (Muskel, Kernschatten, Glanz): unscharf gezeichnet, nur bei voller Feinheit */
  let wfNr = 0;
  H.wf = (pts, farbe, op, sd, zu = true) => {
    if (!T.fein) return "";
    const d = typeof pts === "string" ? pts : G(pts, zu);
    /* Filterbereich im Benutzerraum: Kontur ± (Strichbreite + 3 × Unschärfe) – sonst schneidet der Filter gerade Kanten ab */
    const z = d.match(/-?[0-9.]+/g).map(Number), xs = z.filter((_, i) => i % 2 === 0), ys = z.filter((_, i) => i % 2 === 1);
    const rd = sd * (zu ? 3 : 4.5) + 2, id = T.id("wf" + wfNr++);
    T.def(`<filter id="${id}" filterUnits="userSpaceOnUse" x="${f(Math.min(...xs) - rd)}" y="${f(Math.min(...ys) - rd)}" width="${f(Math.max(...xs) - Math.min(...xs) + 2 * rd)}" height="${f(Math.max(...ys) - Math.min(...ys) + 2 * rd)}"><feGaussianBlur stdDeviation="${sd}"/></filter>`);
    return `<path d="${d}" ${zu ? `fill="${farbe}"` : `fill="none" stroke="${farbe}" stroke-width="${f(sd * 2.5)}" stroke-linecap="round"`} opacity="${op}" filter="url(#${id})"/>`;
  };
  /* Kerben/Falten als spitz zulaufende Flächen (natürlicher als gleich breite Striche); Lichtkante versetzt darunter */
  H.kerben = (zuege, w, op, farbe = "#1d150f") => {
    if (!T.fein) return H.L(zuege, farbe, w * 0.5, op);
    let d = "";
    for (let z of zuege) {
      if (z.length === 2) z = [z[0], [(z[0][0] + z[1][0]) / 2, (z[0][1] + z[1][1]) / 2], z[1]];
      if (z.length === 3) {                 /* Linse: zwei Bögen durch den Mittelpunkt ± halbe Breite */
        const [a, m, e] = z, dx = e[0] - a[0], dy = e[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l * w, ny = dx / l * w;
        const c = (s) => [2 * m[0] - (a[0] + e[0]) / 2 + nx * s, 2 * m[1] - (a[1] + e[1]) / 2 + ny * s];
        const c1 = c(0.5), c2 = c(-0.5);
        d += `M${f(a[0])} ${f(a[1])}Q${f(c1[0])} ${f(c1[1])} ${f(e[0])} ${f(e[1])}Q${f(c2[0])} ${f(c2[1])} ${f(a[0])} ${f(a[1])}Z`;
        continue;
      }
      const n = z.length;
      d += G(H.kette(z.map((p, i) => { const q = w * (0.12 + 0.88 * Math.sin(Math.PI * i / (n - 1))) / 2; return [p[0], p[1], q, q]; })).pts);
    }
    const id = T.id("kb" + nr++);
    T.def(`<path id="${id}" d="${d}"/>`);
    return `<use href="#${id}" transform="translate(${f(w * 0.55)} ${f(w * 0.75)})" fill="#fff" fill-opacity="${op * 0.45}"/><use href="#${id}" fill="${farbe}" fill-opacity="${op}"/>`;
  };
  /* Risse (rissige Haut): kurze Zickzack-Linien, Grundrichtung winkel (Grad) */
  H.risse = (n, poly, len, winkel, w, op, farbe = "#1d150f") => {
    let d = "";
    const [x0, y0, x1, y1] = T.box(poly);
    for (let i = 0, v = 0; i < n && v < n * 8; v++) {
      let x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
      if (!H.drin(poly, x, y)) continue;
      i++;
      let a = (typeof winkel === "function" ? winkel(x, y) : winkel) * Math.PI / 180 + (T.rnd() - 0.5) * 0.8;
      d += `M${f(x)} ${f(y)}`;
      const m = 2 + Math.floor(T.rnd() * 3);
      for (let j = 0; j < m; j++) {
        const l = len * (0.35 + T.rnd() * 0.65);
        a += (T.rnd() - 0.5) * 1.3;
        d += `l${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)}`;
      }
    }
    return `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  /* Punkt quer über eine Kette an Stelle t (0 … Anzahl-1): [linker Rand, rechter Rand] */
  H.an = (k, t) => {
    const i = Math.max(0, Math.min(k.L.length - 2, Math.floor(t))), u = t - i;
    const m = (A) => [A[i][0] + (A[i + 1][0] - A[i][0]) * u, A[i][1] + (A[i + 1][1] - A[i][1]) * u];
    return [m(k.L), m(k.R)];
  };
  /* Querfalten über eine Kette (Rüssel, Beine): von t0 bis t1, Abstand dt, Anteil der Breite a0–a1, Durchhang */
  H.querfalten = (k, t0, t1, dt, a0, a1, bauch) => {
    const z = [];
    for (let t = t0; t < t1; t += dt * (0.7 + T.rnd() * 0.6)) {
      const [p, q] = H.an(k, t), s0 = a0 + T.rnd() * 0.15, s1 = a1 - T.rnd() * 0.25;
      const P = (s) => [p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s + Math.sin(Math.PI * s) * bauch * (0.6 + T.rnd() * 0.8)];
      z.push([P(s0), P((s0 + s1) / 2), P(s1)]);
    }
    return z;
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
  const H = mach(T, 0, 1.1), { teil, L, fl, kette, kerben, querfalten, G, risse, wf } = H, F = T.fein;
  const US = H.US;
  /* EINE Hautfarbe für alle nahen Teile (Benutzerraum) → keine Nähte zwischen Rumpf, Bein, Kopf */
  const haut = T.lg("haut", [[0, "#968b7d"], [0.4, "#7f7468"], [0.8, "#695f54"], [1, "#5f5448"]], 0, -346, 0, 0, US);
  const fern = T.lg("fern", [[0, "#5a5148"], [1, "#3d362f"]], 0, -300, 0, 0, US);
  const licht = T.lg("licht", [[0, "#fff", 0.22], [0.3, "#fff", 0.03], [0.5, "#000", 0.06], [0.75, "#000", 0.2], [1, "#000", 0.32]], 0, -346, 0, 0, US);
  const R = "#1f160e";
  const relief = (inh) => F ? `<g filter="${T.relief("haut", { f: 0.5, tiefe: 0.36, okt: 2, seed: 5 })}">${inh}</g>` : inh;
  const weich = (d, farbe, w, op) => wf(d, farbe, op, w * 0.4, false);
  const offen = (P) => G(P.map((p) => [p[0], p[1]]), false);
  /* Fußnägel: breit, flach, halb in der Sohle, darüber ein Hautwulst; nur vorn am Fuß */
  const naegel = (xv, xh, n) => {
    let d = "", w2 = "";
    for (let i = 0; i < n; i++) {
      const x = xv - 9 - i * (xv - xh) * 0.25, w = 8 - i * 0.7;
      d += `M${H.f(x - w)} -2Q${H.f(x - w + 1)} -9 ${H.f(x)} -9.5 ${H.f(x + w - 1)} -9 ${H.f(x + w)} -2Z`;
      w2 += `M${H.f(x - w - 1)} -9Q${H.f(x)} -13.5 ${H.f(x + w + 1)} -9`;
    }
    return `<path d="${d}" fill="#857967" stroke="#2e261e" stroke-width=".9" stroke-opacity=".5"/>` +
      (F ? `<path d="${d}" fill="none" stroke="#d8cdb9" stroke-opacity=".25" stroke-width=".8" transform="translate(-.6 -1)"/><path d="${w2}" fill="none" stroke="#2a221a" stroke-width="1.2" stroke-opacity=".45"/>` : "");
  };
  const fuss = (kk, n) => { const m = kk.L.length - 1; return naegel(kk.L[m][0], kk.R[m][0], n); };
  /* Stoßzähne: Elfenbein, an der Wurzel verfärbt */
  const zahnK = (dx, dy, q) => kette([[405 + dx, -190 + dy, 9 * q, 9 * q], [424 + dx, -172 + dy, 8.2 * q, 8.2 * q], [450 + dx, -159 + dy, 6.8 * q, 6.8 * q], [471 + dx, -160 + dy, 5 * q, 5 * q], [485 + dx, -170 + dy, 3 * q, 3 * q], [491 + dx, -182 + dy, 0.6, 0.6]]);
  const zahn = (dx, dy, q, fill) => teil(zahnK(dx, dy, q).pts, fill, { rw: 0.7, randA: 0.6, ov: [T.lg("zvol", [[0, "#fff", 0.45], [0.3, "#fff", 0], [0.75, "#000", 0.12], [1, "#000", 0.35]])],
    innen: F ? L([[[414 + dx, -183 + dy], [440 + dx, -166 + dy], [470 + dx, -163 + dy]], [[420 + dx, -176 + dy], [452 + dx, -161 + dy], [476 + dx, -166 + dy]]], "#7d6a48", 0.6, 0.3) +
      L([[[416 + dx, -188 + dy], [446 + dx, -171 + dy], [474 + dx, -168 + dy], [484 + dx, -175 + dy]]], "#fff", 1.6, 0.6) : "" });
  let s = H.kontakt([310, 240, 66, 124], 40, 6), k = "";
  s += zahn(-16, -6, 0.86, T.lg("elfen2", [[0, "#6f5f45"], [1, "#b3a585"]], 0, 0, 1, 0));
  /* Schwanz mit Quaste aus drahtigen Haaren */
  const quaste = [];
  for (let i = 0; i < (F ? 16 : 6); i++) { const a = -0.5 + i / 15, l = 22 + T.rnd() * 14; quaste.push([[4, -168], [3 + a * 4, -168 + l * 0.55], [2 + a * 10, -168 + l]]); }
  k += teil(kette([[20, -270, 3.8, 3.8], [11, -238, 3.1, 3.1], [6, -198, 2.6, 2.6], [4, -165, 2.3, 2.3]]).pts, haut, { rw: 0.7, ov: [licht], rim: 4 }) + L(quaste, "#1c1612", 1.1, 0.9);
  /* ferne Beine (dunkler, ganz umrandet) */
  const beinF = (J) => {
    const kk = kette(J);
    return teil(kk.pts, fern, { ov: [], rim: 16, innen: kerben(querfalten(kk, 2.2, 5.6, F ? 0.3 : 0.9, 0.1, 0.9, 3), 3.4, 0.3) }) + fuss(kk, 2);
  };
  k += beinF([[260, -240, 40, 38], [255, -170, 35, 31], [249, -98, 28, 27], [248, -74, 29.5, 28.5], [245, -44, 27, 27], [242, -14, 31, 29], [241, 0, 33, 30, 3]]);
  k += beinF([[118, -230, 48, 46], [122, -160, 38, 36], [124, -98, 30, 31], [124, -60, 28, 29], [124, -28, 28, 27], [125, -10, 30, 29], [126, 0, 32, 30, 3]]);
  /* Rumpf: Rücken eingesenkt, Schulter am höchsten, Kruppe fällt steil ab */
  const rumpf = [[20, -268], [46, -295], [95, -303], [160, -290], [215, -299], [256, -316], [300, -313], [342, -298], [352, -244], [348, -196], [334, -160],
    [300, -150], [240, -148], [182, -142], [140, -150], [114, -166], [70, -160], [22, -186], [8, -230]];
  /* Ohr: Umriss wie Afrika (oben breit, hinten Ausbuchtung und Golf, unten Zipfel), Hinterrand leicht zerfranst */
  const ohr = [[350, -331], [318, -345], [280, -348], [248, -341], [229, -324], [221, -300], [224, -276], [236, -262], [242, -248], [244, -232], [251, -214], [263, -196],
    [276, -178], [288, -162], [297, -150], [305, -146], [313, -153], [326, -172], [342, -192], [357, -216], [366, -252], [367, -292], [361, -320]].map((p, i) =>
    (i > 3 && i < 15 ? [p[0] + (T.rnd() - 0.5) * 3, p[1] + (T.rnd() - 0.5) * 3] : p));
  const ohrD = G(ohr);
  const ohrSchatten = `<path d="${ohrD}" transform="translate(9 10)" fill="#000" opacity="${F ? 0.32 : 0.2}"${F ? ` filter="${H.weich(5)}"` : ""}/>`;
  k += teil(rumpf, haut, {
    ov: [licht], rim: 34,
    innen: fl(165, -262, 80, 38, 0, true) + fl(205, -200, 40, 60, 0, false, 0.5) + fl(180, -156, 90, 24, 0, false, 0.8) + fl(120, -200, 26, 50, 10, false, 0.6) +
      wf([[40, -278], [100, -284], [160, -272], [215, -282], [260, -294]], "#fff", 0.2, 10, false) +
      wf([[232, -300], [226, -250], [234, -196], [250, -160]], "#000", 0.2, 8, false) + wf([[150, -280], [148, -240]], "#000", 0.14, 10, false) +
      wf([[300, -164], [240, -160], [182, -155], [140, -162]], "#000", 0.28, 7, false) + wf([[290, -153], [240, -151], [182, -146]], "#e8d8c0", 0.2, 2, false) +
      ohrSchatten +
      kerben([[[198, -294], [192, -250], [196, -200], [206, -158]], [[150, -286], [146, -240], [150, -190]], [[176, -152], [210, -158], [240, -154]], [[228, -296], [222, -262], [224, -230]]], 5, 0.26) +
      (F ? risse(90, rumpf, 8, (x, y) => (y < -250 ? 0 : 75), 0.6, 0.22, R) : ""),
  });
  /* nahe Beine liegen über dem Rumpf; oben unsichtbar (gleiche Farbe), Umriss erst ab dem Rumpfrand */
  const beinN = (J, i0, model, n) => {
    const kk = kette(J), m = J.length - 1;
    return teil(kk.pts, haut, {
      ov: [licht], randD: H.seiten(kk, i0),
      innen: model + kerben(querfalten(kk, 2.4, m - 0.5, F ? 0.24 : 0.7, 0.04, 0.96, 3), 3.6, 0.34) + kerben(querfalten(kk, 3.1, 4.3, F ? 0.11 : 0.4, 0.1, 0.9, 4), 4, 0.36) +
        (F ? risse(45, kk.pts.slice(2, -2), 5, 0, 0.55, 0.24, R) : ""),
      oben: (F ? weich(offen(kk.R), "#000", 30, 0.3) + weich(offen(kk.L.slice(i0)), "#fff", 16, 0.14) : "") +
        wf([[kk.R[1][0], J[2][1] + 6], [J[2][0], J[2][1] + 14], [kk.L[2][0], J[2][1] + 8]], "#000", 0.3, 8, false) +
        `<path d="M${H.f(kk.L[m][0])} -4L${H.f(kk.R[m][0])} -4" stroke="#2e261e" stroke-width="8" stroke-opacity=".3"/>`,
    }) + fuss(kk, 3);
  };
  /* Hinterbein: Oberschenkel geht in die Kruppe über, Knie vorn tief (Kniefalte zur Flanke), Ferse hinten */
  k += beinN([[78, -262, 16, 60], [92, -196, 38, 48], [101, -150, 41, 40], [90, -100, 32, 34], [80, -66, 29, 32], [73, -30, 29, 28], [70, -10, 31, 30], [69, 0, 33, 31, 3]], 2,
    fl(66, -236, 54, 42, 0, true) + fl(132, -190, 22, 50, 0, false, 0.7) + wf([[40, -250], [70, -262], [100, -250]], "#fff", 0.18, 10, false) +
    kerben([[[140, -150], [130, -186], [112, -224], [92, -262]], [[134, -138], [120, -150], [110, -146]]], 6, 0.34));
  /* Vorderbein: Oberarm/Schulter, Ellbogen hinten auf Bauchhöhe, „Knie“ (Handwurzel) tief */
  k += beinN([[300, -282, 40, 42], [300, -212, 46, 46], [302, -152, 38, 34], [305, -98, 30, 28.5], [306, -74, 32, 30], [307, -44, 29, 28], [309, -14, 33, 31], [310, 0, 35, 32, 3]], 2,
    fl(290, -262, 50, 40, 0, true) + fl(258, -190, 20, 40, 0, false, 0.8) + wf([[262, -270], [290, -278], [318, -266]], "#fff", 0.16, 10, false) +
    kerben([[[262, -158], [255, -196], [262, -240], [276, -280]], [[338, -168], [345, -200]], [[270, -160], [286, -152], [300, -154]]], 6, 0.32));
  /* Kopf und Rüssel in einem Umriss */
  const kopf = [[305, -318], [340, -333], [372, -329], [398, -311], [418, -283], [430, -250], [437, -212], [441, -162], [443, -110], [443, -62], [445, -30], [451, -16], [459, -9],
    [462, -3], [455, 0, 1], [446, -2], [434, -7], [425, -38], [420, -80], [416, -120], [411, -160], [403, -192], [396, -184], [390, -172], [380, -176], [360, -190], [335, -212], [315, -252]];
  const rk = kette([[421, -238, 16, 30], [425, -195, 16, 24], [428, -150, 13, 15], [431, -100, 12, 12], [433, -55, 10.5, 10.5], [438, -22, 8, 8], [448, -8, 6, 6]]);
  k += teil(kopf, haut, {
    ov: [licht], rim: 24,
    innen: fl(384, -306, 30, 20, 0, true, 0.8) + fl(370, -282, 15, 12, 0, false) + fl(398, -228, 18, 28, 0, false, 0.6) + fl(422, -150, 8, 80, 0, true, 0.55) + fl(438, -120, 6, 100, 0, false, 0.6) +
      wf([[374, -258], [389, -269], [404, -258], [389, -249]], "#000", 0.24, 4) + wf([[372, -292], [360, -262], [364, -228]], "#000", 0.2, 5, false) +
      wf([[400, -300], [418, -268], [428, -230]], "#fff", 0.14, 6, false) +
      ohrSchatten +
      kerben(querfalten(rk, 0.3, 5.8, F ? 0.1 : 0.3, 0.02, 0.98, 2.4), 3.6, 0.46) +
      kerben([[[377, -272], [390, -277], [403, -271]], [[373, -265], [370, -252], [378, -242]], [[377, -240], [392, -236], [405, -243]], [[398, -306], [414, -280], [421, -262]],
        [[405, -312], [421, -290]], [[380, -230], [394, -221], [404, -206]], [[371, -238], [383, -226]], [[359, -270], [365, -238]], [[382, -284], [396, -290], [410, -286]],
        [[379, -248], [389, -246], [399, -249]]], 4.2, 0.4) +
      `<path d="M366 -262C369 -250 371 -236 368 -226" stroke="#3b2f25" stroke-width="3.5" stroke-opacity=".4" fill="none" stroke-linecap="round"/>` +
      (F ? risse(40, kopf.slice(0, 7).concat([[400, -200], [360, -200]]), 5, 20, 0.5, 0.22, R) + risse(45, rk.pts, 4, 0, 0.5, 0.26, R) : ""),
  });
  /* Rüsselspitze: zwei Finger, Nasenöffnung */
  k += L([[[447, -5], [452, -2.5], [456, -1]]], R, 1.6, 0.6) + `<ellipse cx="452" cy="-5" rx="2.6" ry="1.4" fill="#2a2018" opacity=".7"/>`;
  /* Unterlippe */
  k += teil([[374, -181], [390, -186], [401, -183], [405, -176], [398, -170], [386, -170], [377, -174]], "#5f5049", { rw: 0.5, ov: [], rim: 4, innen: wf([[380, -180], [396, -182]], "#fff", 0.12, 2, false) }) +
    L([[[372, -182], [388, -187], [402, -184]]], "#1a120b", 1.2, 0.5);
  s += relief(k);
  /* naher Stoßzahn, Hautmanschette um die Zahnwurzel */
  s += zahn(0, 0, 1, T.lg("elfen", [[0, "#9c8459"], [0.2, "#ddcfae"], [1, "#f8f2e5"]], 0, 0, 1, 0));
  s += relief(teil([[384, -207], [398, -206], [408, -199], [415, -189], [411, -181], [401, -181], [390, -186], [382, -196]], haut, {
    ov: [licht], rim: 8, rw: 0.55, randA: 0.5, randD: G([[400, -206], [409, -199], [415, -189], [411, -181], [402, -180]], false),
    innen: wf([[396, -208], [410, -197]], "#000", 0.22, 3, false) + wf([[392, -196], [404, -190]], "#fff", 0.12, 3, false) + kerben([[[396, -194], [404, -188], [409, -183]]], 2, 0.28) }));
  /* Augenhöhle und Auge mit langen Wimpern */
  s += T.augeReal(389, -258, 2.7, { iris: "#7d4c20", iris2: "#2e1709", offen: 0.55, wimpern: 12, wimpernLaenge: 2, lid: "#271c14", haut: "#3f382f", winkel: 8 });
  /* Ohr */
  const ohrG = T.lg("ohr", [[0, "#9d9488"], [0.55, "#837a6e"], [1, "#5e564c"]], 0, 0, 1, 0.5);
  const o = teil(ohr, ohrG, {
    ov: [], rim: 22, rand: "#120c08", randA: 0.62, rw: 0.9,
    innen: fl(352, -252, 26, 82, 0, false) + fl(266, -290, 52, 38, 0, true) + fl(300, -186, 30, 34, 0, false, 0.6) +
      wf([[234, -320], [228, -290], [236, -262], [246, -236], [262, -200], [290, -160]], "#fff", 0.14, 6, false) +
      kerben([[[300, -302], [283, -268], [277, -228], [285, -188]], [[323, -294], [307, -252], [303, -206]], [[268, -270], [254, -234]], [[341, -296], [339, -244], [331, -202]],
        [[356, -308], [357, -246], [347, -208]], [[251, -304], [239, -272]], [[316, -314], [290, -307], [262, -293]], [[348, -250], [350, -224]]], 5, 0.3) +
      (F ? risse(70, ohr, 6, (x, y) => 90 + (x - 300) * 0.4, 0.55, 0.24, R) : ""),
    oben: teil([[352, -332], [318, -346], [280, -349], [247, -342], [228, -324], [233, -321], [252, -334], [280, -339], [318, -337], [352, -323]], ohrG, { ov: [], rim: 4, rw: 0.6 }) +
      weich(offen([[352, -320], [318, -334], [280, -336], [250, -329], [234, -317]]), "#000", 5, 0.3),
  });
  s += relief(o);
  return { svg: s, box: [-4, -349, 491, 0] };
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
  const H = mach(T, 1, 0.8), { teil, L, fl, kette, kerben, G, wf, drin } = H, F = T.fein, US = H.US;
  const creme = T.lg("creme", [[0, "#efe2c4"], [0.6, "#e6d4ad"], [1, "#d9c59c"]], 0, -550, 0, 0, US);
  const fern = T.lg("fern", [[0, "#c2ad86"], [1, "#a38d68"]], 0, -300, 0, 0, US);
  const licht = T.lg("licht", [[0, "#fff", 0.16], [0.35, "#fff", 0], [0.62, "#000", 0.08], [1, "#000", 0.26]], 0, -550, 0, 0, US);
  const fleckF = T.lg("fleck", [[0, "#57290e"], [0.45, "#6f3614"], [0.7, "#83461d"], [1, "#9a5e2e"]], 0, -550, 0, -100, US);
  const fleckFern = T.lg("fleckf", [[0, "#4a250e"], [1, "#6a3c1d"]], 0, -300, 0, -100, US);
  const SW = "#1a120b";
  /* ---- Fleckenmuster als Voronoi-Mosaik: Zellgrenze in jede Richtung = nächste Mittelsenkrechte, minus cremefarbene Fuge ---- */
  const zentren = [];
  const feld = (x0, y0, x1, y1, g, fuge, dez, ok) => {
    for (let y = y0, z = 0; y < y1; y += g * 0.87, z++) for (let x = x0 + (z % 2) * g / 2; x < x1; x += g) {
      const c = [x + (T.rnd() - 0.5) * g * 0.55, y + (T.rnd() - 0.5) * g * 0.55, g, fuge, dez, Array.from({ length: 28 }, () => T.rnd())];
      if (!ok || ok(c[0], c[1])) zentren.push(c);
    }
  };
  const flecken = (poly, rand = 0) => {
    let d = "";
    for (const c of zentren) {
      if (!drin(poly, c[0], c[1]) && !rand) continue;
      if (rand && !poly.some((p) => Math.abs(p[0] - c[0]) < c[2] * 1.5 && Math.abs(p[1] - c[1]) < c[2] * 1.5) && !drin(poly, c[0], c[1])) continue;
      const nb = zentren.filter((n) => n !== c && Math.abs(n[0] - c[0]) < c[2] * 2.2 && Math.abs(n[1] - c[1]) < c[2] * 2.2);
      const m = 14, pts = [];
      for (let k = 0; k < m; k++) {
        const a = (k / m) * Math.PI * 2;
        let rr = c[2] * 0.75;
        for (const n of nb) {
          const vx = n[0] - c[0], vy = n[1] - c[1], dd = Math.hypot(vx, vy), cs = (vx * Math.cos(a) + vy * Math.sin(a)) / dd;
          if (cs > 0.05) rr = Math.min(rr, (dd / 2) / cs);
        }
        rr = Math.max(0.5, rr - c[3] * (0.75 + c[5][k] * 0.6) - (k % 2 ? c[3] * 0.6 * c[5][k + 14] : 0));
        pts.push([c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr]);
      }
      const q = Math.pow(10, c[4]), rd = (v) => Math.round(v * q) / q;
      let lx = rd(pts[0][0]), ly = rd(pts[0][1]);
      d += `M${lx} ${ly}`;
      for (let k = 1; k < m; k++) { const X = rd(pts[k][0]), Y = rd(pts[k][1]); d += `l${rd(X - lx)} ${rd(Y - ly)}`; lx = X; ly = Y; }
      d += "z";
    }
    return d;
  };
  /* Rumpf + Hals (ein Umriss) */
  const rumpf = [[16, -284], [40, -300], [110, -316], [180, -336], [212, -354], [262, -406], [318, -463], [356, -498], [372, -510],
    [394, -474], [376, -456], [340, -416], [304, -362], [284, -312], [274, -266], [262, -232], [242, -212], [200, -203], [150, -200], [110, -206], [80, -214], [40, -226], [16, -244], [8, -266]];
  /* Zellen: Rumpf groß, Hals mittel, Beine klein, Kopf winzig */
  feld(-10, -350, 300, -190, 31, 2.3, 0);
  feld(190, -520, 410, -350, 22, 1.8, 0);
  feld(180, -300, 300, -100, 12, 1.1, 1, (x, y) => y > -235);
  feld(20, -300, 150, -100, 12, 1.1, 1, (x, y) => y > -225);
  const fRumpf = flecken(rumpf);
  let s = H.kontakt([248, 208, 68, 101], 14, 3);
  /* Schwanz mit Quaste (bis zum Sprunggelenk) */
  const quaste = [];
  for (let i = 0; i < (F ? 26 : 8); i++) { const a = -0.5 + i / 25, l = 30 + T.rnd() * 22; quaste.push([[0, -150], [-1 + a * 4, -150 + l * 0.5], [-2 + a * 12, -150 + l]]); }
  s += teil(kette([[14, -282, 2.6, 2.6], [8, -240, 2, 2], [3, -195, 1.6, 1.6], [0, -150, 1.6, 1.6]]).pts, creme, { ov: [licht], rw: 0.5 }) + L(quaste, SW, 1, 0.92) +
    (F ? L(quaste.slice(0, 8).map((z) => z.map((p) => [p[0] + 1, p[1]])), "#4a3a2c", 0.6, 0.7) : "");
  /* Beine: lange Vorderbeine, Handwurzel als Knubbel, langes Röhrbein, Fesselkopf; hinten Sprunggelenk spitz */
  const vorder = (x) => [[x + 6, -300, 28, 30], [x + 4, -238, 22, 22], [x + 1, -190, 12.5, 11.5], [x, -150, 9.5, 8.5], [x, -114, 7.5, 7], [x, -104, 9, 8.5], [x, -92, 6.5, 6.5], [x + 1, -42, 5.4, 5.4], [x + 2, -31, 7.2, 7], [x + 6, -14, 6, 5.6]];
  const hinter = (x) => [[x, -282, 6, 40], [x + 10, -226, 30, 30], [x + 12, -198, 22, 20], [x + 4, -160, 12.5, 13], [x - 4, -124, 7.5, 9.5, 2], [x - 3, -110, 6.5, 6.8], [x, -42, 5.4, 5.4], [x + 2, -31, 7.2, 7], [x + 6, -14, 6, 5.6]];
  const huf = (x) => H.huf(x, 14, 6.5, 6, T.lg("hufg", [[0, "#3a2e25"], [1, "#1c1510"]]), true) +
    (F ? `<path d="M${H.f(x - 6)} -14.5Q${H.f(x)} -16.5 ${H.f(x + 5.5)} -14.6" fill="none" stroke="#d8c8a6" stroke-width="1.2" stroke-opacity=".6"/>` : "");
  const beinF = (J) => {
    const kk = kette(J);
    return teil(kk.pts, fern, { ov: [], rim: 10, innen: `<path d="${flecken(kk.pts.filter((p) => p[1] < -110), 1)}" fill="${fleckFern}"/>` + wf([[J[5][0] - 9, J[5][1]], [J[5][0] + 9, J[5][1]]], "#000", 0.2, 2, false) }) + huf(J[J.length - 1][0]);
  };
  s += beinF(vorder(203)) + beinF(hinter(96));
  /* Rumpf */
  s += teil(rumpf, creme, {
    ov: [licht], rim: 16,
    innen: `<path d="${fRumpf}" fill="${fleckF}"/>` +
      wf([[30, -296], [110, -310], [180, -328], [214, -348], [264, -398], [318, -455], [356, -490]], "#fff", 0.22, 6, false) +
      wf([[150, -212], [200, -214], [244, -222]], "#000", 0.3, 7, false) + wf([[286, -320], [300, -362], [340, -412], [376, -452]], "#000", 0.2, 5, false) +
      wf([[96, -300], [120, -260], [126, -222]], "#000", 0.14, 8, false) +
      (F ? T.haare(rumpf, 900, (x, y) => (y < -340 ? 125 : 168), 3.2, { farben: [["#2a170a", 2, 0.35, 0.22], ["#fff6e0", 1, 0.3, 0.22]], streuung: 18 }) : ""),
  });
  /* nahe Beine über dem Rumpf (gleiche Farben im Benutzerraum → keine Naht), Umriss erst unterhalb des Rumpfs */
  const beinN = (J, i0, model) => {
    const kk = kette(J);
    return teil(kk.pts, creme, {
      ov: [licht], randD: H.seiten(kk, i0),
      innen: `<path d="${flecken(kk.pts, 1)}" fill="${fleckF}"/>` + model +
        wf(G(kk.R.slice(1).map((p) => [p[0], p[1]]), false), "#000", 0.2, 4, false) + wf(G(kk.L.slice(2).map((p) => [p[0], p[1]]), false), "#fff", 0.16, 3, false) +
        wf([[J[5][0] - 9, J[5][1] - 1], [J[5][0] + 9, J[5][1] - 1]], "#000", 0.16, 1.6, false) +
        (F ? T.haare(kk.pts.slice(3, -3), 160, 95, 2.2, { farben: [["#2a170a", 1, 0.25, 0.2]], streuung: 10 }) : ""),
    }) + huf(J[J.length - 1][0]);
  };
  s += beinN(hinter(62), 3, wf([[40, -270], [70, -284], [96, -270]], "#fff", 0.2, 8, false) + kerben([[[98, -222], [92, -250], [80, -276]]], 2.4, 0.25));
  s += beinN(vorder(242), 2, wf([[236, -300], [262, -310], [284, -296]], "#fff", 0.18, 8, false) + kerben([[[226, -214], [222, -240], [230, -270]]], 2.4, 0.3));
  /* Stehmähne: kurz, braun, Spitzen dunkel */
  const maehne = [[372, -513], [350, -500], [300, -450], [250, -398], [205, -351], [196, -342], [212, -347], [258, -394], [306, -443], [356, -492], [375, -505]];
  const mh = []; for (let t = 0; t <= 1.0001; t += F ? 0.012 : 0.04) {
    const x = 372 - t * 172, y = -511 + t * 166, l = 7 + Math.sin(t * 40) * 1.2;
    mh.push([[x + 2, y + 6], [x - l * 0.55, y - l * 0.5]]);
  }
  s += teil(maehne, "#7d4b25", { ov: [], rw: 0.4, innen: L(mh, "#3a1f0d", 1.1, 0.75) });
  s += L(mh.map((z) => [z[1], [z[1][0] - 1.5, z[1][1] - 1.6]]), "#2a170b", 1.4, 0.8);
  /* Kopf: lang, Ramsnase angedeutet, tiefe Wange, bewegliche Lippen */
  const kopf = [[362, -506], [374, -520], [394, -526], [412, -520], [424, -510], [434, -499], [441, -490], [446, -482], [446, -475], [441, -470], [433, -468], [422, -464], [410, -462],
    [398, -464], [386, -470], [372, -482]];
  feld(360, -530, 450, -460, 6.5, 0.6, 1, (x, y) => x < 425 && y > -522);
  s += teil(kopf, creme, {
    ov: [licht], rim: 8,
    innen: `<path d="${flecken(kopf)}" fill="${fleckF}" opacity=".85"/>` +
      `<path d="M432 -496C443 -492 448 -484 446 -476 442 -470 432 -469 426 -474 424 -483 426 -492 432 -496Z" fill="#5b3c25" opacity=".55"/>` +
      wf([[378, -520], [398, -524], [418, -514]], "#fff", 0.3, 3, false) + wf([[390, -476], [412, -468], [430, -470]], "#000", 0.25, 3, false) + wf([[404, -492], [420, -486]], "#000", 0.12, 4, false) +
      kerben([[[436, -488], [440, -486.5], [443, -487]], [[446, -476], [438, -474.5], [428, -476]]], 1.2, 0.7) +
      (F ? T.haare(kopf, 220, (x, y) => (x > 420 ? 160 : 180), 1.6, { farben: [["#2a170a", 1, 0.18, 0.25]], streuung: 16 }) +
        T.schnurrhaare(440, -472, 7, 5, 100, 50, "#2a1d12", 0.15) : ""),
  });
  /* Auge: groß, dunkel, lange Wimpern */
  s += T.augeReal(407, -502, 2.5, { iris: "#4b2a12", iris2: "#1a0d05", offen: 0.75, wimpern: 14, wimpernLaenge: 1.5, lid: "#1d120a", haut: "#6b4a2c", winkel: 12 });
  /* Ossikone mit schwarzem Haarbüschel (hinterer etwas versetzt), Ohren */
  const oss = (x, fill, dunkel) => teil([[x - 4.5, -517], [x - 3.6, -531], [x - 5, -540], [x + 1, -545], [x + 6, -538], [x + 4.2, -530], [x + 5, -517]], fill, { rw: 0.5, ov: [T.lg("ossv", [[0, "#fff", 0.2], [1, "#000", 0.2]], 0, 0, 1, 0)] }) +
    teil([[x - 6.5, -538], [x - 4, -547], [x + 2, -550], [x + 7.5, -543], [x + 6, -536], [x, -535]], dunkel ? "#120b06" : SW, { ov: [], rw: 0.3,
      innen: F ? L([[[x - 4, -540], [x - 3, -546]], [[x, -539], [x + 1, -548]], [[x + 4, -539], [x + 5, -545]]], "#5a4636", 0.5, 0.7) : "" });
  s += oss(379, "#b49773", 1) + oss(389, "#d7c39b");
  const ohr = (dx, dy, fill, innen) => teil([[378 + dx, -515 + dy], [366 + dx, -521 + dy], [351 + dx, -528 + dy], [347 + dx, -525 + dy], [352 + dx, -518 + dy], [364 + dx, -511 + dy], [376 + dx, -508 + dy]], fill,
    { rw: 0.4, innen: innen ? `<path d="M${352 + dx} ${-524 + dy}C${360 + dx} ${-521 + dy} ${368 + dx} ${-516 + dy} ${375 + dx} ${-512 + dy}" stroke="#f6ecd8" stroke-width="2.4" fill="none" opacity=".8"/>` +
      `<path d="M${349 + dx} ${-526 + dy}L${356 + dx} ${-526 + dy}" stroke="${SW}" stroke-width="1.6" opacity=".7"/>` : "" });
  s += ohr(4, -6, "#a98c66") + ohr(0, 0, "#dcc8a2", 1);
  return { svg: s, box: [-9, -550, 447, 0] };
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
  const H = mach(T, 1, 0.9), { teil, L, fl, kette, G } = H;
  const weiss = T.lg("weiss", [[0, "#f7f4ec"], [1, "#e6e0d3"]]);
  const SW = "#191512";
  const band = (pts, w0, w1, w2) => {           /* spitz zulaufender Streifen entlang einer Mittellinie */
    const n = pts.length, J = pts.map((p, i) => { const t = i / (n - 1), w = t < 0.5 ? w0 + (w1 - w0) * t * 2 : w1 + (w2 - w1) * (t - 0.5) * 2; return [p[0], p[1], w, w]; });
    return G(kette(J).pts);
  };
  let s = H.kontakt([180, 165, 37, 50], 7, 1.5);
  /* Schwanz */
  s += teil(kette([[10, -118, 2.4, 2.4], [4, -100, 1.8, 1.8], [1, -80, 1.4, 1.4]]).pts, "#e9e3d6", { innen: L([[[0, -112], [16, -110]], [[0, -102], [12, -100]], [[0, -92], [10, -91]]], SW, 2.4), rw: 0.5 });
  s += teil([[-1, -84], [3, -83], [5, -66], [1, -56], [-4, -66]], SW, { ov: [], rw: 0.4 });
  /* Beine (Kronrand bei y = -7) */
  const vorder = (x) => [[x + 2, -92, 11, 11], [x, -60, 7.5, 6.5], [x, -46, 5.6, 5.6], [x, -40, 4.6, 4.6], [x, -20, 4.2, 4.2], [x + 1, -15, 5, 5], [x + 3, -7, 4.2, 3.8]];
  const hinter = (x) => [[x + 14, -88, 15, 15], [x + 8, -62, 8, 9], [x, -44, 4.8, 7.5, 2], [x + 1, -36, 4.6, 4.6], [x + 3, -19, 4.2, 4.2], [x + 4, -14, 5, 5], [x + 6, -7, 4.2, 3.8]];
  const quer = (x, y0, y1, dy) => { const z = []; for (let y = y0; y < y1; y += dy) z.push([[x - 20, y + 2], [x + 20, y - 1.5]]); return z; };
  const bein = (J, fill, dunkel) => teil(kette(J).pts, fill, {
    innen: L(quer(J[0][0], -84, -26, 6.2), SW, 2.8, dunkel ? 0.85 : 1) + L(quer(J[0][0], -24, -14, 4.5), SW, 1.6, 0.8),
    ov: [T.lg("bx", [[0, "#fff", 0.1], [0.45, "#fff", 0], [1, "#000", 0.3]], 0, 0, 1, 0)],
  }) + H.huf(J[J.length - 1][0], 7, 4.2, 3.8, "#2a2622", false);
  s += bein(vorder(162), T.lg("fern", [[0, "#cfc9bd"], [1, "#bdb6a8"]]), 1) + bein(hinter(46), T.lg("fern", []), 1);
  s += bein(vorder(179), weiss) + bein(hinter(30), weiss);
  /* Rumpf mit Hals und Stehmähne */
  const rumpf = [[10, -118], [34, -128], [70, -123], [110, -121], [148, -131], [160, -138], [168, -146], [175, -154], [183, -162], [191, -170], [200, -177], [208, -183], [216, -186],
    [224, -168], [218, -152], [206, -128], [198, -104], [192, -86], [190, -72], [176, -64], [160, -70], [130, -66], [90, -67], [64, -70], [60, -58], [40, -54], [20, -62], [5, -88], [5, -108]];
  /* Streifen */
  let st = "";
  /* Hals: quer zur Halsachse, von der Mähne zur Kehle */
  const D = (t) => [150 + 70 * t, -134 - 54 * t], F = (t) => [192 + 32 * t, -80 - 82 * t];
  [0.05, 0.19, 0.33, 0.47, 0.6, 0.73, 0.85, 0.95].forEach((t, i) => {
    const a = D(t), b = F(t - 0.03);
    st += band([[a[0] - 1, a[1] - 14], [a[0] + (b[0] - a[0]) * 0.5 - 2, a[1] + (b[1] - a[1]) * 0.5], [b[0] + 3, b[1] + 3]], 3.4 - i * 0.12, 3.8 - i * 0.2, 1.8);
  });
  /* Schulter: biegen unten nach vorn aufs Bein */
  st += band([[146, -136], [150, -110], [160, -88], [176, -78]], 3.6, 4, 1.5) + band([[134, -128], [138, -102], [146, -82], [160, -70]], 3.6, 4.4, 1.5);
  /* Rumpf: senkrecht bis zum Bauch */
  [120, 106, 92, 78].forEach((x, i) => { st += band([[x, -126], [x + 2, -100], [x + 7, -70], [x + 10, -62]], 3.6, 4.4 - i * 0.2, 0.8); });
  /* Kruppe: Bögen um den Oberschenkel, nach hinten waagerecht */
  const C = [56, -66];
  let schatten = [];
  [20, 30, 40, 50, 61].forEach((rr, i) => {
    const pts = []; for (let a = -78; a >= -192; a -= 19) pts.push([C[0] + Math.cos(a * Math.PI / 180) * rr * 1.08, C[1] + Math.sin(a * Math.PI / 180) * rr]);
    st += band(pts, 1.2, 3.6 + i * 0.15, 2.6);
    const p2 = []; for (let a = -88; a >= -185; a -= 24) p2.push([C[0] + Math.cos(a * Math.PI / 180) * (rr + 5) * 1.08, C[1] + Math.sin(a * Math.PI / 180) * (rr + 5)]);
    schatten.push(p2);
  });
  /* Rückenstreifen und Bauchlinie */
  const ruecken = L([[[8, -118], [34, -127], [70, -122], [110, -120], [148, -130]]], SW, 3.6) + L([[[64, -67], [100, -65], [140, -64], [176, -64]]], SW, 4);
  s += teil(rumpf, weiss, {
    innen: `<path d="${st}" fill="${SW}"/>` + L(schatten, "#8a7560", 1.8, 0.55) + ruecken +
      fl(150, -110, 22, 18, 0, true) + fl(40, -110, 22, 14, 0, true) + fl(110, -78, 40, 12, 0, false),
  });
  /* Mähnenhaare (Stehmähne, Spitzen dunkel) */
  s += L([[[150, -133], [160, -141]], [[160, -138], [168, -147]], [[168, -146], [175, -155]], [[175, -154], [183, -163]], [[183, -162], [191, -171]], [[191, -170], [200, -178]], [[200, -177], [208, -184]], [[208, -183], [216, -187]]], SW, 1, 0.5);
  /* Kopf */
  const kopf = [[208, -180], [218, -184], [228, -180], [238, -170], [250, -150], [258, -134], [264, -122], [266, -114], [262, -108], [254, -106], [246, -110], [238, -120], [228, -136], [218, -150], [210, -164]];
  const kz = L([[[220, -182], [232, -168], [246, -148]], [[216, -178], [226, -162], [240, -140], [252, -124]], [[226, -176], [236, -166]], [[214, -170], [222, -154], [234, -134]],
    [[212, -162], [224, -146], [236, -126]], [[216, -150], [230, -134]], [[236, -176], [244, -160]]], SW, 1.9);
  s += teil(kopf, weiss, {
    innen: kz + `<path d="M248 -132C256 -128 266 -122 267 -114 266 -106 256 -104 248 -110 242 -116 242 -128 248 -132Z" fill="#2a2420"/>` + fl(232, -172, 10, 7, 0, true) + fl(246, -126, 8, 14, 30, false, 0.6) +
      L([[[257, -122], [262, -124]], [[263, -109], [255, -110]]], "#000", 0.8, 0.8),
  });
  s += T.auge(232, -164, 1.6, "#2a1a0e", { flach: 0.8 });
  /* Ohren: groß, rund, aufrecht */
  const ohr = (dx, fill) => teil([[210 + dx, -180], [206 + dx, -194], [208 + dx, -205], [214 + dx, -207], [219 + dx, -198], [218 + dx, -184]], fill,
    { innen: L([[[212 + dx, -203], [214 + dx, -190]]], SW, 2.5, 0.8) + `<path d="M206 -201L214 -208 219 -200" transform="translate(${dx} 0)" fill="none" stroke="${SW}" stroke-width="2.6"/>`, rw: 0.6 });
  s += ohr(-5, "#d9d3c6") + ohr(0, "#f4f0e6");
  return { svg: s, box: [-4, -208, 267, 0] };
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
  const H = mach(T, 0, 1.6), { teil, L, fl, kette } = H;
  const haut = T.lg("haut", [[0, "#a29d93"], [0.55, "#878177"], [1, "#686259"]]);
  const fern = T.lg("fern", [[0, "#6d685f"], [1, "#565048"]]);
  const R = "#2a241d";
  let s = H.kontakt([270, 235, 60, 92], 24, 4);
  s += teil(kette([[10, -150, 3.5, 3.5], [3, -125, 3, 3], [0, -98, 2.5, 2.5]]).pts, "#7a746b", { rw: 1 }) + teil([[-3, -104], [3, -102], [3, -88], [-1, -82], [-5, -90]], "#2d2721", { ov: [], rw: 0.8 });
  const vorder = (x) => [[x - 3, -100, 27, 27], [x, -58, 21, 19], [x + 1, -36, 17, 16], [x + 2, -12, 19, 18], [x + 3, 0, 22, 19, 3]];
  const hinter = (x) => [[x + 8, -100, 32, 32], [x + 4, -58, 20, 22], [x, -36, 16, 17], [x + 1, -12, 18, 17], [x + 2, 0, 21, 18, 3]];
  const zehen = (x, w) => [0.92, 0.45].map((k) => `<path d="M${H.f(x + w * k - 6)} 0Q${H.f(x + w * k)} -11 ${H.f(x + w * k + 6)} 0Z" fill="#b3aa98" stroke="#3b342c" stroke-width=".8" stroke-opacity=".6"/>`).join("");
  const bein = (J, fill) => teil(kette(J).pts, fill, { ov: [T.lg("bx", [[0, "#fff", 0.1], [0.5, "#fff", 0], [1, "#000", 0.3]], 0, 0, 1, 0)],
    innen: L([[[J[1][0] - 18, J[1][1] + 2], [J[1][0], J[1][1] + 6], [J[1][0] + 18, J[1][1] + 1]], [[J[2][0] - 14, J[2][1] + 4], [J[2][0] + 14, J[2][1] + 2]]], R, 1.6, 0.35) }) + zehen(J[4][0] - J[4][3], J[4][2] + J[4][3]);
  s += bein(vorder(238), fern) + bein(hinter(92), fern);
  s += bein(vorder(268), haut) + bein(hinter(58), haut);
  const rumpf = [[8, -150], [40, -168], [100, -164], [160, -160], [215, -168], [255, -178], [288, -190], [312, -186], [330, -170], [338, -142], [330, -112], [318, -92],
    [300, -82], [292, -66], [268, -56], [246, -60], [236, -72], [205, -58], [140, -54], [110, -60], [100, -54], [76, -48], [40, -54], [18, -75], [4, -105], [3, -130]];
  s += teil(rumpf, haut, {
    innen: fl(260, -150, 50, 30, 0, true) + fl(60, -140, 50, 25, 0, true) + fl(130, -75, 70, 18, 0, false) + fl(228, -110, 18, 50, 10, false, 0.8) +
      L([[[232, -170], [222, -135], [226, -100], [238, -72]], [[110, -162], [104, -120], [110, -64]], [[300, -186], [304, -150], [312, -110], [306, -86]], [[316, -180], [322, -140], [326, -110]],
        [[40, -160], [80, -120], [104, -64]], [[262, -92], [276, -84], [292, -80]]], R, 2, 0.35) + H.runzeln(40, 20, -165, 320, -70, 6, R, 1, 0.25),
  });
  /* Kopf, tief getragen */
  const kopf = [[316, -186], [334, -178], [350, -160], [372, -132], [394, -104], [414, -84], [426, -64], [430, -44], [428, -32], [414, -28], [398, -32], [384, -38], [362, -52], [338, -74], [318, -100], [308, -140]];
  s += teil(kopf, haut, {
    innen: fl(350, -150, 22, 14, 40, true) + fl(380, -70, 30, 22, 30, false, 0.8) +
      L([[[426, -46], [412, -48], [398, -44]], [[404, -66], [410, -62]], [[340, -150], [348, -120], [362, -96]], [[330, -130], [340, -96], [356, -70]]], R, 1.6, 0.45),
  });
  s += T.auge(360, -116, 2.4, "#3a2412", { flach: 0.7, lid: "#2b241c" });
  /* Hörner */
  s += teil([[372, -126], [366, -144], [362, -158], [368, -154], [378, -140], [386, -122]], T.lg("horn", [[0, "#5d5246"], [1, "#9b8d77"]], 1, 0, 0, 1), { rw: 1 });
  s += teil([[392, -104], [398, -132], [404, -160], [406, -176], [412, -162], [418, -126], [422, -96], [412, -88]], T.lg("horn", []), { rw: 1, innen: fl(400, -130, 4, 20, -10, true) });
  /* Ohren: röhrenförmig mit Haarsaum */
  const ohr = (x, fill) => teil([[x, -170], [x - 6, -188], [x - 4, -204], [x + 4, -196], [x + 12, -180], [x + 10, -168]], fill, { rw: 1.2, innen: L([[[x - 3, -201], [x - 7, -205]], [[x + 1, -199], [x - 1, -205]]], R, 0.8, 0.6) });
  s += ohr(316, "#77716a") + ohr(328, "#8d877d");
  return { svg: s, box: [-5, -205, 430, 0] };
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
  const H = mach(T, 0, 1.5), { teil, L, fl, kette } = H;
  const haut = T.lg("haut", [[0, "#776669"], [0.5, "#86706e"], [0.85, "#a9827a"], [1, "#b98e84"]]);
  const fern = T.lg("fern", [[0, "#5d4e51"], [1, "#6f5a57"]]);
  const R = "#2b1e1c";
  let s = H.kontakt([270, 240, 62, 92], 24, 4);
  s += teil(kette([[8, -118, 4, 4], [2, -100, 3, 3], [-1, -86, 2, 2]]).pts, "#6e5e5f", { rw: 1 }) + teil([[-4, -92], [2, -90], [2, -78], [-2, -74], [-6, -80]], "#2e2424", { ov: [], rw: 0.6 });
  const vorder = (x) => [[x - 2, -80, 26, 26], [x, -44, 21, 20], [x + 1, -14, 21, 20], [x + 2, 0, 23, 21, 3]];
  const hinter = (x) => [[x + 6, -80, 28, 28], [x + 2, -44, 21, 21], [x, -14, 20, 19], [x + 1, 0, 22, 20, 3]];
  const zehen = (x, w) => [0.92, 0.6, 0.28].map((k) => `<path d="M${H.f(x + w * k - 5)} 0Q${H.f(x + w * k)} -9 ${H.f(x + w * k + 5)} 0Z" fill="#c9b2a2" stroke="#3b2a26" stroke-width=".8" stroke-opacity=".6"/>`).join("");
  const bein = (J, fill) => teil(kette(J).pts, fill, { ov: [T.lg("bx", [[0, "#fff", 0.08], [0.5, "#fff", 0], [1, "#000", 0.3]], 0, 0, 1, 0)],
    innen: L([[[J[1][0] - 16, J[1][1] + 6], [J[1][0] + 16, J[1][1] + 4]]], R, 1.5, 0.3) }) + zehen(J[3][0] - J[3][3], J[3][2] + J[3][3]);
  s += bein(vorder(240), fern) + bein(hinter(92), fern);
  s += bein(vorder(270), haut) + bein(hinter(58), haut);
  const rumpf = [[8, -118], [40, -140], [110, -146], [190, -146], [260, -150], [300, -150], [330, -144], [340, -120], [330, -84], [312, -60], [296, -50], [276, -44], [250, -46],
    [210, -34], [150, -32], [112, -38], [94, -34], [76, -30], [40, -36], [14, -62], [3, -92]];
  s += teil(rumpf, haut, {
    innen: fl(250, -130, 70, 22, 0, true) + fl(70, -120, 50, 20, 0, true) + fl(150, -60, 80, 18, 0, false, 0.6) +
      L([[[300, -146], [306, -110], [300, -70]], [[316, -140], [322, -110], [318, -76]], [[262, -84], [282, -74], [300, -70]]], R, 1.8, 0.3) +
      L([[[60, -138], [180, -142], [280, -144]]], "#fff", 3, 0.18),
  });
  /* Kopf: Kasten-Schnauze, Augen/Ohren/Nüstern oben */
  const kopf = [[300, -150], [330, -156], [352, -160], [366, -168], [380, -164], [390, -146], [414, -136], [432, -134], [444, -136], [452, -126], [456, -104], [454, -80],
    [446, -64], [432, -52], [414, -44], [392, -44], [368, -50], [344, -60], [322, -72], [306, -96], [298, -126]];
  s += teil(kopf, haut, {
    innen: `<path d="M342 -96C370 -88 400 -76 446 -66 452 -58 440 -48 420 -44 390 -42 360 -52 338 -70Z" fill="#c49184" opacity=".7"/>` +
      fl(370, -152, 14, 10, 0, false, 0.7) + `<ellipse cx="370" cy="-152" rx="12" ry="8" fill="#c08e86" opacity=".55"/>` + fl(420, -120, 28, 12, 0, true) + fl(380, -100, 30, 20, 0, false, 0.5) +
      L([[[350, -88], [396, -76], [450, -70]], [[342, -110], [346, -96]], [[436, -128], [444, -126]]], R, 1.8, 0.5) + L([[[428, -132], [434, -128], [442, -130]]], "#1a1010", 2.5, 0.8),
  });
  s += T.auge(372, -156, 2.6, "#3b2414", { flach: 0.7, lid: "#4a2f2a" });
  /* Ohren klein */
  s += teil([[338, -158], [334, -170], [338, -178], [344, -172], [346, -160]], "#8a6a66", { rw: 0.9, innen: `<ellipse cx="340" cy="-169" rx="2.5" ry="5" fill="#c38c86"/>` });
  return { svg: s, box: [-6, -178, 456, 0] };
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
  const H = mach(T, 1, 0.45), { teil, L, fl, kette } = H;
  const fell = T.lg("fell", [[0, "#c69058"], [1, "#b37a44"]]);
  const fern = T.lg("fern", [[0, "#9a6d42"], [1, "#7e5a38"]]);
  let s = H.kontakt([84, 76, 13, 18], 3, 0.7);
  const vorder = (x) => [[x + 1, -50, 4.8, 4.8], [x, -36, 2.8, 2.6], [x, -25, 2, 2], [x, -21, 1.6, 1.6], [x, -8, 1.3, 1.3], [x + 0.3, -6, 1.7, 1.7], [x + 1.5, -2.6, 1.4, 1.3]];
  const hinter = (x) => [[x + 7, -50, 7, 7], [x + 4, -36, 3, 3.4], [x, -23, 1.6, 2.6, 2], [x + 0.5, -18, 1.4, 1.4], [x + 1.5, -8, 1.3, 1.3], [x + 1.8, -6, 1.7, 1.7], [x + 3, -2.6, 1.4, 1.3]];
  const bein = (J, fill) => teil(kette(J).pts, fill, { ov: [T.lg("bx", [[0, "#fff", 0.15], [0.45, "#fff", 0], [1, "#000", 0.28]], 0, 0, 1, 0)] }) + H.huf(J[J.length - 1][0], 2.6, 1.6, 1.4, "#1f1813", true);
  /* Schwanz schwarz */
  s += teil([[6, -66], [8, -63], [5, -54], [3, -50], [2, -56], [3, -63]], "#1c1612", { ov: [], rw: 0.3 });
  s += bein(vorder(76), fern) + bein(hinter(17), fern);
  s += bein(vorder(84), fell) + bein(hinter(10), fell);
  const rumpf = [[6, -66], [20, -72], [45, -69], [72, -70], [80, -73], [88, -80], [96, -90], [104, -100], [110, -103], [114, -92], [106, -78], [98, -64], [94, -54], [90, -46],
    [80, -42], [72, -45], [55, -42], [35, -43], [24, -46], [22, -40], [10, -42], [3, -52]];
  s += teil(rumpf, fell, {
    innen: `<path d="M20 -44C35 -50 60 -50 78 -50 88 -48 92 -44 92 -40L20 -36Z" fill="#f4efe6"/>` +
      `<path d="M24 -48C40 -55 62 -55 80 -52 88 -50 88 -47 80 -47 62 -48 40 -47 24 -44Z" fill="#1b1511"/>` +
      `<path d="M26 -52C42 -58 64 -58 82 -55L80 -52C62 -55 42 -55 26 -50Z" fill="#dcbf91" opacity=".8"/>` +
      `<path d="M2 -66C8 -62 12 -55 13 -45L-2 -45Z" fill="#f4efe6"/>` + L([[[7, -64], [11, -56], [12, -46]]], "#1b1511", 1.2, 0.85) +
      `<path d="M94 -62C99 -70 104 -82 110 -92L118 -88 104 -60Z" fill="#f1e7d6" opacity=".55"/>` +
      fl(78, -62, 10, 8, 0, true) + fl(18, -62, 10, 7, 0, true) + T.striche(40, 10, -70, 90, -55, 3, 1.2, "#7a4e26", 0.35, 0.4),
  });
  /* Kopf */
  const kopf = [[104, -100], [110, -106], [118, -108], [126, -103], [132, -97], [137, -92], [139, -88], [137, -85], [132, -84], [126, -85], [118, -88], [110, -92], [104, -95]];
  s += teil(kopf, fell, {
    innen: `<path d="M118 -97L136 -90 138 -86 130 -87 116 -94Z" fill="#1d1612" opacity=".9"/>` + `<path d="M114 -101L134 -93 136 -91 118 -98Z" fill="#f2ebe0" opacity=".9"/>` +
      `<ellipse cx="135" cy="-93" rx="3" ry="2.2" fill="#2a1d14" opacity=".8"/>` + `<path d="M110 -92C116 -88 124 -86 134 -85L132 -83 118 -86Z" fill="#f4efe6"/>` + fl(116, -104, 6, 3, 0, true),
  });
  s += `<ellipse cx="119" cy="-99.5" rx="2.1" ry="1.7" fill="#f4efe6"/>` + T.auge(119, -99.5, 1.25, "#24150b", { flach: 0.85 });
  /* Hörner, geringelt */
  const horn = (dx, fill) => {
    const J = [[112 + dx, -106, 1.6, 1.6], [110.5 + dx, -116, 1.5, 1.5], [108 + dx, -126, 1.2, 1.2], [107 + dx, -134, 0.9, 0.9], [108.5 + dx, -140, 0.35, 0.35]];
    const k = kette(J), ringe = [];
    for (let i = 0; i < 3; i++) for (let t = 0.15; t < 1; t += 0.3) ringe.push([[k.L[i][0] + (k.L[i + 1][0] - k.L[i][0]) * t, k.L[i][1] + (k.L[i + 1][1] - k.L[i][1]) * t], [k.R[i][0] + (k.R[i + 1][0] - k.R[i][0]) * t, k.R[i][1] + (k.R[i + 1][1] - k.R[i][1]) * t]]);
    return teil(k.pts, fill, { rw: 0.3, ov: [], innen: L(ringe, "#000", 0.5, 0.5) });
  };
  s += horn(-2, "#2a221b") + horn(0, "#3b3027");
  /* Ohr */
  s += teil([[106, -104], [100, -110], [96, -116], [100, -116], [108, -110], [110, -106]], "#b98654", { rw: 0.3, innen: `<path d="M99 -114L106 -108" stroke="#f1e2c8" stroke-width="1.2"/>` });
  return { svg: s, box: [-2, -142, 139.6, 0] };
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
  const H = mach(T, 1, 0.8), { teil, L, fl, kette } = H;
  const fell = T.lg("fell", [[0, "#857c76"], [0.6, "#6a625d"], [1, "#4e4743"]]);
  const fern = T.lg("fern", [[0, "#4f4844"], [1, "#3c3532"]]);
  const SW = "#1a1513";
  let s = H.kontakt([138, 128, 22, 32], 5, 1.2);
  /* Schwanz: langes schwarzes Haar */
  s += teil([[8, -124], [4, -116], [0, -96], [-4, -74], [-6, -56], [-1, -52], [2, -66], [4, -90], [8, -112], [12, -122]], SW, { ov: [], rw: 0.5, innen: L([[[3, -110], [-2, -80], [-4, -60]], [[6, -110], [2, -80], [0, -60]]], "#4a403a", 0.6, 0.6) });
  const vorder = (x) => [[x + 2, -80, 10, 10], [x, -52, 6.5, 6], [x, -40, 4.8, 4.8], [x, -34, 3.8, 3.8], [x, -14, 3.3, 3.3], [x + 0.5, -10, 4.2, 4.2], [x + 2.5, -5, 3.5, 3.1]];
  const hinter = (x) => [[x + 12, -82, 14, 14], [x + 7, -60, 6.5, 8], [x, -40, 3.6, 6, 2], [x + 1, -32, 3.4, 3.4], [x + 3, -13, 3.3, 3.3], [x + 3.5, -9, 4.2, 4.2], [x + 5.5, -5, 3.5, 3.1]];
  const bein = (J, fill) => teil(kette(J).pts, fill, { ov: [T.lg("bx", [[0, "#fff", 0.1], [0.45, "#fff", 0], [1, "#000", 0.3]], 0, 0, 1, 0)] }) + H.huf(J[J.length - 1][0], 5, 3.5, 3.1, "#1d1714", true);
  s += bein(vorder(125), fern) + bein(hinter(30), fern);
  s += bein(vorder(136), fell) + bein(hinter(18), fell);
  const rumpf = [[8, -124], [26, -130], [60, -134], [95, -142], [122, -151], [140, -150], [158, -146], [172, -140], [176, -120], [168, -104], [160, -88], [156, -76], [148, -66],
    [132, -62], [126, -70], [100, -68], [62, -72], [44, -74], [42, -62], [24, -60], [10, -68], [2, -90], [3, -112]];
  const baender = []; for (let x = 92; x < 172; x += 6.5) baender.push([[x + 6, -150], [x + 2, -120], [x - 2, -88]]);
  s += teil(rumpf, fell, {
    innen: L(baender, "#2b2421", 2.6, 0.45) + fl(120, -120, 30, 22, 0, true) + fl(40, -112, 26, 16, 0, true) + fl(90, -78, 40, 12, 0, false) +
      T.striche(50, 10, -128, 130, -76, 2, 3, "#3a3330", 0.4, 0.35),
  });
  /* Stehmähne schwarz */
  s += teil([[88, -142], [100, -152], [116, -160], [134, -162], [152, -158], [166, -152], [176, -150], [174, -142], [160, -146], [140, -150], [120, -150], [100, -144]], SW,
    { ov: [], rw: 0.4, innen: L([[[100, -150], [102, -145]], [[112, -157], [114, -150]], [[124, -160], [125, -152]], [[136, -161], [137, -152]], [[148, -158], [149, -151]], [[160, -154], [161, -148]]], "#4b423c", 0.8, 0.8) });
  /* Bart */
  s += teil([[170, -112], [162, -104], [158, -94], [154, -82], [160, -78], [166, -86], [172, -96], [180, -104]], SW, { ov: [], rw: 0.4, innen: L([[[168, -106], [160, -88], [158, -80]], [[172, -104], [166, -90], [162, -82]]], "#4b423c", 0.6, 0.7) });
  /* Kopf (Ramsnase, schwarzes Gesicht) */
  const kopf = [[164, -140], [174, -148], [184, -148], [192, -140], [200, -128], [208, -114], [214, -102], [218, -93], [218, -86], [213, -82], [205, -82], [196, -88], [186, -98], [176, -110], [166, -124]];
  s += teil(kopf, T.lg("kopf", [[0, "#3a332f"], [1, "#1e1916"]], 0, 0, 1, 1), {
    innen: fl(178, -136, 9, 6, 0, true) + fl(204, -100, 10, 6, 50, true, 0.5) + L([[[214, -94], [210, -91]], [[217, -86], [206, -85]]], "#000", 0.9, 0.8),
  });
  s += T.auge(182, -128, 1.5, "#2a170b", { flach: 0.85, lid: "#0e0a08" });
  /* Hörner: seitlich, abwärts, dann aufwärts nach innen */
  const horn = (dx, dy, fill) => teil(kette([[176 + dx, -146 + dy, 3.2, 3.2], [186 + dx, -150 + dy, 2.8, 2.8], [194 + dx, -146 + dy, 2.3, 2.3], [198 + dx, -154 + dy, 1.7, 1.7], [194 + dx, -164 + dy, 1, 1], [189 + dx, -168 + dy, 0.3, 0.3]]).pts, fill, { rw: 0.4 });
  s += horn(-6, -2, "#2a2420") + horn(0, 0, T.lg("horn", [[0, "#3a332d"], [1, "#6a5f55"]], 0, 0, 1, 0));
  /* Ohr */
  s += teil([[172, -146], [164, -152], [158, -154], [160, -148], [168, -142]], "#4a423d", { rw: 0.4 });
  return { svg: s, box: [-6, -170, 218, 0] };
}

module.exports = [
  { id: "elefant", de: "der Elefant", syl: "e-le-FANT", it: "l'elefante", itSyl: "e-le-FAN-te", en: "elephant",
    gruppe: "Rüsseltiere", lebensraum: "Savanne", laenge: 4.93, hoehe: 3.38, zeichne: elefant },
  { id: "giraffe", de: "die Giraffe", syl: "gi-RAF-fe", it: "la giraffa", itSyl: "gi-RAF-fa", en: "giraffe",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 4.54, hoehe: 5.48, zeichne: giraffe },
  { id: "zebra", de: "das Zebra", syl: "ZE-bra", it: "la zebra", itSyl: "ZE-bra", en: "zebra",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 2.71, hoehe: 2.08, zeichne: zebra },
  { id: "nashorn", de: "das Nashorn", syl: "NAS-horn", it: "il rinoceronte", itSyl: "ri-no-ce-RON-te", en: "rhinoceros",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 4.35, hoehe: 2.05, zeichne: nashorn },
  { id: "nilpferd", de: "das Nilpferd", syl: "NIL-pferd", it: "l'ippopotamo", itSyl: "ip-po-PO-ta-mo", en: "hippopotamus",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 4.62, hoehe: 1.78, zeichne: nilpferd },
  { id: "gazelle", de: "die Gazelle", syl: "ga-ZEL-le", it: "la gazzella", itSyl: "gaz-ZEL-la", en: "gazelle",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 1.42, hoehe: 1.42, zeichne: gazelle },
  { id: "gnu", de: "das Gnu", syl: "GNU", it: "lo gnu", itSyl: "GNU", en: "wildebeest",
    gruppe: "Huftiere", lebensraum: "Savanne", laenge: 2.24, hoehe: 1.7, zeichne: gnu },
];
