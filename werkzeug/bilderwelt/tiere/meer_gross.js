/* =====================================================================
   TIER-BIBLIOTHEK — MEER, GROSSE TIERE (FASSUNG 854)
   Orca, Delfin, Weißer Hai, Buckelwal, Hammerhai, Mantarochen,
   Meeresschildkröte, Pottwal, Narwal.
   Maße in Zentimetern, Blick nach rechts, schwimmend (schwimmt: true, kein
   Bodenschatten), tiefster Punkt bei y = 0. Licht von oben aus dem Wasser:
   heller Glanz auf Rücken und Stirn, Bauch im Eigenschatten, Gegenschattierung.
   ===================================================================== */
"use strict";

/* ---------- gemeinsame Helfer (nur für diese Datei) ---------- */
function mach(T, dez = 1) {
  const F = T.fein;
  /* Szene (klein): ganze Zentimeter genügen; große Wale (dez = 0) auch fein in ganzen Zentimetern */
  const m10 = Math.pow(10, F ? dez : 0);
  const f = (n) => String(Math.round(n * m10) / m10);
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
  const H = { f, G, F };
  let nr = 0;
  H.US = ' gradientUnits="userSpaceOnUse"';
  /* dichte Punkte auf der Catmull-Rom-Kurve (für Profile); [x, y, segment] */
  H.dicht = (pts, zu = true, k = 8) => {
    const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    const out = [];
    for (let i = 0; i < (zu ? n : n - 1); i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      for (let j = 0; j < k; j++) {
        const t = j / k, u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, e = t * t * t;
        out.push([a * p1[0] + b * c1[0] + c * c2[0] + e * p2[0], a * p1[1] + b * c1[1] + c * c2[1] + e * p2[1], i]);
      }
    }
    if (!zu) out.push([pts[n - 1][0], pts[n - 1][1], n - 2]);
    return out;
  };
  /* y(x) aus einer Punktfolge (linear zwischen den dichten Punkten) */
  const lin = (poly) => {
    const s = poly.slice().sort((a, b) => a[0] - b[0]);
    return (x) => {
      if (x <= s[0][0]) return s[0][1];
      if (x >= s[s.length - 1][0]) return s[s.length - 1][1];
      let lo = 0, hi = s.length - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (s[m][0] <= x) lo = m; else hi = m; }
      const a = s[lo], b = s[hi], u = (x - a[0]) / ((b[0] - a[0]) || 1);
      return a[1] + (b[1] - a[1]) * u;
    };
  };
  /* Rumpf aus Rückenlinie (oben) und Bauchlinie (unten), beide von der Schnauzenspitze nach hinten.
     Liefert d (Umriss), P(x, t) (t = 0 Rücken … 1 Bauch: Punkt auf der Körperrundung), band(x0, x1, t0, t1). */
  H.rumpf = (oben, unten, hinten) => {
    const um0 = oben.concat(unten.slice(1).reverse());
    const dd = H.dicht(um0, true, 12), no = oben.length - 1;
    const top = dd.filter((p) => p[2] < no), bot = dd.filter((p) => p[2] > no);
    /* hinten: Punkte zwischen Rücken- und Bauchende (z. B. die Fluke) – gehören zum Umriss, nicht zum Profil */
    const um = hinten ? oben.concat(hinten, unten.slice(1).reverse()) : um0;
    const yo = lin(top), yu = lin(bot);
    const P = (x, t) => [x, yo(x) + t * (yu(x) - yo(x))];
    const tf = (t) => (typeof t === "function" ? t : () => t);
    const band = (x0, x1, t0, t1, n = F ? 18 : 10) => {
      const a = tf(t0), b = tf(t1), A = [], B = [];
      for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; A.push(P(x, a(x, i / n))); B.push(P(x, b(x, i / n))); }
      return A.concat(B.reverse());
    };
    /* Linse: Band mit spitz zulaufenden Enden (Glanz, Schatten). tm = Mitte (Zahl oder f(x, u)), w = halbe Dicke in t */
    const linse = (x0, x1, tm, w, n = F ? 16 : 10) => {
      const m = tf(tm), ww = tf(w);
      return band(x0, x1, (x, u) => m(x, u) - ww(x, u) * Math.pow(Math.sin(Math.PI * u), 0.7), (x, u) => m(x, u) + ww(x, u) * Math.pow(Math.sin(Math.PI * u), 0.7), n);
    };
    /* Muster in Körperkoordinaten [x, t(, ecke)] → glatter Pfad */
    const muster = (pts, zu = true) => G(pts.map((q) => { const p = P(q[0], q[1]); if (q[2]) p.push(1); return p; }), zu);
    /* Saum entlang der Rückenlinie (auch um die Stirn herum): Abstand d0 … d1 nach innen, spitz auslaufend */
    const obenD = top.slice().sort((a, b) => b[0] - a[0]);
    const saum = (x0, x1, d0, d1) => H.saum(obenD.filter((p) => p[0] >= x0 && p[0] <= x1).reverse(), d0, d1);
    return { d: G(um), um, P, yo, yu, band, linse, muster, saum, oben: top, unten: bot, xs: [Math.min(...um.map((p) => p[0])), Math.max(...um.map((p) => p[0]))] };
  };
  /* Versatz einer offenen Linie nach rechts (bei Lauf im Uhrzeigersinn = nach innen) */
  H.versatz = (poly, d) => poly.map((p, i) => {
    const a = poly[Math.max(0, i - 1)], b = poly[Math.min(poly.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, dd = typeof d === "function" ? d(i / (poly.length - 1)) : d;
    return [p[0] - dy / l * dd, p[1] + dx / l * dd];
  });
  /* Saum: Fläche zwischen zwei Versätzen (d0 außen, d1 innen), an den Enden spitz */
  H.saum = (poly, d0, d1) => {
    const k = (u) => Math.pow(Math.sin(Math.PI * u), 0.6), m = (d0 + d1) / 2, h = (d1 - d0) / 2;
    return H.versatz(poly, (u) => m - h * k(u)).concat(H.versatz(poly, (u) => m + h * k(u)).reverse());
  };
  /* Körperteil: Pfad EINMAL in defs, dann Füllung / Innenzeichnung (geklippt) / Rand per <use> */
  H.teil = (d, fill, o = {}) => {
    const id = T.id("t" + nr++);
    T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
    let s = `<use href="#${id}" fill="${fill}"/>`;
    if (o.innen) s += `<g clip-path="url(#${id}c)">${o.innen}</g>`;
    const stil = `fill="none" stroke="${o.rand || "#06080a"}" stroke-opacity="${o.randA != null ? o.randA : 0.22}" stroke-width="${o.rw || 0.6}" stroke-linejoin="round" stroke-linecap="round"`;
    if (o.randD) s += `<path d="${o.randD}" ${stil}/>`;
    else if (o.rand !== false) s += `<use href="#${id}" ${stil}/>`;
    return s;
  };
  H.clip = (d) => { const id = T.id("c" + nr++); T.def(`<clipPath id="${id}"><path d="${d}"/></clipPath>`); return `clip-path="url(#${id})"`; };
  /* weiche Kante: Gauß-Unschärfe mit eigenem Bereich (Box der Form + 3σ) */
  const wSchon = {};
  H.weich = (std, box) => {
    if (!F) {
      /* Szene: ein Filter je Unschärfe, Bereich relativ zur Form (spart Bytes) */
      const k = "ws" + String(std).replace(".", "_"), id = T.id(k);
      if (!wSchon[k]) { wSchon[k] = 1; T.def(`<filter id="${id}" x="-.3" y="-.8" width="1.6" height="2.6" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${std}"/></filter>`); }
      return `url(#${id})`;
    }
    const id = T.id("w" + nr++), m = std * 3;
    T.def(`<filter id="${id}" filterUnits="userSpaceOnUse" x="${f(box[0] - m)}" y="${f(box[1] - m)}" width="${f(box[2] - box[0] + 2 * m)}" height="${f(box[3] - box[1] + 2 * m)}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${std}"/></filter>`);
    return `url(#${id})`;
  };
  /* weiche Fläche (Glanz, Schatten, Muster mit unscharfem Rand). pts = Punkte oder fertiger Pfad mit box */
  /* Vieleck (für unscharfe Flächen genügen Geraden) */
  H.vieleck = (pts) => "M" + pts.map((p) => f(p[0]) + " " + f(p[1])).join(" ") + "Z";
  H.weichF = (pts, farbe, op, std, box) => {
    const d = typeof pts === "string" ? pts : (!F && std >= 2.5 && pts.length > 12 ? H.vieleck(pts) : G(pts));
    const b = box || T.box(pts);
    return `<path d="${d}" fill="${farbe}"${op < 1 ? ` opacity="${op}"` : ""}${std ? ` filter="${H.weich(std, b)}"` : ""}/>`;
  };
  /* weiche Linie(n) */
  H.weichL = (zuege, farbe, w, op, std) => {
    const alle = [].concat(...zuege);
    const b = T.box(alle);
    return `<path d="${zuege.map((z) => G(z, false)).join("")}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-linecap="round"${op < 1 ? ` stroke-opacity="${op}"` : ""}${std ? ` filter="${H.weich(std, [b[0] - w, b[1] - w, b[2] + w, b[3] + w])}"` : ""}/>`;
  };
  /* mehrere offene Linien in EINEM Pfad */
  H.L = (zuege, farbe, w, op = 1, extra = "") =>
    `<path d="${zuege.map((p) => G(p, false)).join("")}" fill="none" stroke="${farbe}" stroke-width="${w}"${op < 1 ? ` stroke-opacity="${op}"` : ""} stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  /* Rampe: gestapelte Bänder (von t bis tEnde) mit kleiner Deckkraft → weicher Verlauf entlang der Körperrundung.
     ts: Liste der Startwerte t, op: Deckkraft je Band, std: Unschärfe */
  H.rampe = (R, x0, x1, ts, tEnde, farbe, op, std) =>
    (F ? ts : ts.filter((t, i) => i % 2 === 0)).map((t) => H.weichF(R.band(x0, x1, t, tEnde), farbe, F ? op : op * 2, std)).join("");
  /* Lichtnetz (Kaustik) von der Wasseroberfläche: helle Netzlinien, nach unten ausgeblendet (Maske) */
  H.kaustik = (box, maskPts, o = {}) => {
    if (!F) return "";
    const id = T.id("ka" + nr++), mid = T.id("km" + nr++);
    const [x0, y0, x1, y1] = box;
    T.def(`<filter id="${id}" filterUnits="userSpaceOnUse" x="${f(x0)}" y="${f(y0)}" width="${f(x1 - x0)}" height="${f(y1 - y0)}" color-interpolation-filters="sRGB">` +
      `<feTurbulence type="turbulence" baseFrequency="${o.fx || 0.03} ${o.fy || 0.05}" numOctaves="2" seed="${o.seed || 11}"/>` +
      `<feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -3.2 0 0 0 1"/>` +
      `<feComponentTransfer><feFuncA type="gamma" amplitude="1" exponent="${o.exp || 3}" offset="0"/></feComponentTransfer>` +
      `<feGaussianBlur stdDeviation="${o.blur || 0.6}"/></filter>`);
    const mb = T.box(maskPts);
    T.def(`<mask id="${mid}" maskUnits="userSpaceOnUse" x="${f(x0)}" y="${f(y0)}" width="${f(x1 - x0)}" height="${f(y1 - y0)}"><path d="${G(maskPts)}" fill="#fff" filter="${H.weich(o.mblur || 12, mb)}"/></mask>`);
    return `<g mask="url(#${mid})" opacity="${o.op || 0.2}"><rect x="${f(x0)}" y="${f(y0)}" width="${f(x1 - x0)}" height="${f(y1 - y0)}" filter="url(#${id})"/></g>`;
  };
  /* Kratzer/Narben: Gruppen paralleler heller Linien (Zahnharken), auf Körperkoordinaten R.
     Je Gruppe gleiche Biegung und Länge; die Linien laufen parallel im Abstand o.abstand. */
  H.narben = (R, n, x0, x1, t0, t1, len, farbe, w, op, o = {}) => {
    if (!F) return "";
    const z = [];
    for (let i = 0; i < n; i++) {
      const x = x0 + T.rnd() * (x1 - x0), t = t0 + T.rnd() * (t1 - t0);
      const a = (o.winkel != null ? o.winkel : -20) + (T.rnd() - 0.5) * (o.streu != null ? o.streu : 50);
      const k = o.parallel ? 1 + Math.floor(T.rnd() * o.parallel) : 1;
      const L = len * (0.6 + T.rnd() * 0.8), bog = (T.rnd() - 0.5) * L * 0.12;
      const [px, py] = R.P(x, t);
      const ar = a * Math.PI / 180, nx = -Math.sin(ar), ny = Math.cos(ar), cx = Math.cos(ar), cy = Math.sin(ar);
      for (let j = 0; j < k; j++) {
        const ab = (o.abstand || 3) * (j + (T.rnd() - 0.5) * 0.3), v = (T.rnd() - 0.5) * L * 0.12;
        const ox = px + nx * ab + cx * v, oy = py + ny * ab + cy * v, LL = L * (0.85 + T.rnd() * 0.2);
        z.push([[ox, oy], [ox + cx * LL / 2 + nx * bog, oy + cy * LL / 2 + ny * bog], [ox + cx * LL, oy + cy * LL]]);
      }
    }
    return H.L(z, farbe, w, op);
  };
  /* feine Hautriefen (gezeichnet, quer zur Körperachse): n kurze, leicht gewellte Linien als Paar dunkel/hell */
  H.riefen = (R, x0, x1, t0, t1, n, w, op, hell = "#ffffff") => {
    if (!F) return "";
    let d = "";
    for (let i = 0; i < n; i++) {
      const x = x0 + (x1 - x0) * (i + T.rnd() * 0.6) / n, ta = t0 + T.rnd() * (t1 - t0) * 0.5, tb = ta + (t1 - t0) * (0.25 + T.rnd() * 0.4);
      const sch = (T.rnd() - 0.5) * (x1 - x0) / n * 0.6;
      const [ax, ay] = R.P(x, ta), [bx, by] = R.P(x + sch, tb);
      d += `M${f(ax)} ${f(ay)}q${f((bx - ax) / 2 + (T.rnd() - 0.5) * w * 4)} ${f((by - ay) / 2)} ${f(bx - ax)} ${f(by - ay)}`;
    }
    const id = T.id("rf" + nr++);
    T.def(`<path id="${id}" d="${d}" fill="none" stroke-linecap="round"/>`);
    return `<use href="#${id}" stroke="#000" stroke-width="${w}" stroke-opacity="${op}"/><use href="#${id}" x="${f(w * 1.1)}" y="${f(w * 0.3)}" stroke="${hell}" stroke-width="${f(w * 0.8)}" stroke-opacity="${op * 0.9}"/>`;
  };
  /* Narbengruppen an festen Stellen: [x, y, winkel, länge, anzahl, abstand, biegung]. Jede Narbe ist eine schmale,
     an beiden Enden spitz auslaufende Fläche mit wechselnder Breite (max. w); o.rand: dunkel verheilter Rand */
  H.narbenG = (gruppen, farbe, w, op, o = {}) => {
    if (!F) return "";
    let d = "";
    for (const [x, y, wi, len, n, ab, bg] of gruppen) {
      const a = wi * Math.PI / 180, cx = Math.cos(a), cy = Math.sin(a), nx = -cy, ny = cx;
      for (let j = 0; j < n; j++) {
        const o2 = ab * (j - (n - 1) / 2) + (T.rnd() - 0.5) * ab * 0.25, v = (T.rnd() - 0.5) * len * 0.14, Lj = len * (0.7 + T.rnd() * 0.45);
        const ox = x + nx * o2 + cx * v, oy = y + ny * o2 + cy * v, b = bg * len * 0.06, wj = w * (0.55 + T.rnd() * 0.6);
        const li = [], re = [];
        for (let i = 0; i <= 6; i++) {
          const t = i / 6, bb = 4 * t * (1 - t) * b, px = ox + cx * Lj * t + nx * bb, py = oy + cy * Lj * t + ny * bb;
          const h = wj / 2 * Math.pow(Math.sin(Math.PI * t), 0.8) * (0.8 + 0.4 * Math.sin(t * 9 + j));
          li.push([px + nx * h, py + ny * h]); re.push([px - nx * h, py - ny * h]);
        }
        d += H.vieleck(li.concat(re.reverse()));
      }
    }
    return (o.rand ? `<path d="${d}" fill="none" stroke="${o.rand}" stroke-width="${f(w * 0.5)}" stroke-opacity="${op * 0.6}" stroke-linejoin="round"/>` : "") + `<path d="${d}" fill="${farbe}" opacity="${op}"/>`;
  };
  /* Volumen je Körperteil (kern.js T.volumen): Licht von oben (leicht von hinten), Kernschatten, Reflex automatisch */
  /* wie T.volumen (kern.js), aber das Licht wird vor dem Mischen leicht weichgezeichnet: keine Stufen/Höhenlinien
     auf großen hellen Flächen (8-Bit-Quantisierung der Höhenkarte) */
  const volSchon = {};
  H.vol = (name, weich, inner, o = {}) => {
    if (!F) return inner;
    const el = o.hoehe || 52, amb = o.umgebung != null ? o.umgebung : 0.35, id = T.id("vl" + name);
    if (!volSchon[id]) {
      volSchon[id] = 1;
      T.def(`<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">` +
        `<feGaussianBlur in="SourceAlpha" stdDeviation="${weich}" result="b"/>` +
        `<feDiffuseLighting in="b" surfaceScale="${o.tiefe || 4}" diffuseConstant="1" lighting-color="#fff" result="d"><feDistantLight azimuth="${o.azimut || 248}" elevation="${el}"/></feDiffuseLighting>` +
        `<feGaussianBlur in="d" stdDeviation="${Math.max(0.3, Math.round(weich * 0.12 * 10) / 10)}" result="d2"/>` +
        `<feComposite in="d2" in2="SourceGraphic" operator="arithmetic" k1="${Math.round((1 - amb) / Math.sin(el * Math.PI / 180) * 1e4) / 1e4}" k2="0" k3="${amb}" k4="0" result="m"/>` +
        `<feComposite in="m" in2="SourceGraphic" operator="in"/></filter>`);
    }
    return `<g filter="url(#${id})">${inner}</g>`;
  };
  /* Masken (userSpace): X-Verlauf (unsichtbar bei xa → sichtbar bei xb), Kreis (Wurzel blendet aus), ohne Form */
  H.maskeX = (xa, xb, box) => {
    if (!F) return "";
    const id = T.id("mx" + nr++);
    T.def(`<linearGradient id="${id}g" gradientUnits="userSpaceOnUse" x1="${f(xa)}" y1="0" x2="${f(xb)}" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>` +
      `<mask id="${id}" maskUnits="userSpaceOnUse" x="${f(box[0])}" y="${f(box[1])}" width="${f(box[2] - box[0])}" height="${f(box[3] - box[1])}"><rect x="${f(box[0])}" y="${f(box[1])}" width="${f(box[2] - box[0])}" height="${f(box[3] - box[1])}" fill="url(#${id}g)"/></mask>`);
    return `mask="url(#${id})"`;
  };
  H.maskeR = (cx, cy, r0, r1, box) => {
    if (!F) return "";
    const id = T.id("mr" + nr++);
    T.def(`<radialGradient id="${id}g" gradientUnits="userSpaceOnUse" cx="${f(cx)}" cy="${f(cy)}" r="${f(r1)}"><stop offset="${Math.round(r0 / r1 * 100) / 100}" stop-color="#000"/><stop offset="1" stop-color="#fff"/></radialGradient>` +
      `<mask id="${id}" maskUnits="userSpaceOnUse" x="${f(box[0])}" y="${f(box[1])}" width="${f(box[2] - box[0])}" height="${f(box[3] - box[1])}"><rect x="${f(box[0])}" y="${f(box[1])}" width="${f(box[2] - box[0])}" height="${f(box[3] - box[1])}" fill="url(#${id}g)"/></mask>`);
    return `mask="url(#${id})"`;
  };
  H.maskeOhne = (d, dy, std, box) => {
    if (!F) return "";
    const id = T.id("mo" + nr++);
    T.def(`<mask id="${id}" maskUnits="userSpaceOnUse" x="${f(box[0])}" y="${f(box[1])}" width="${f(box[2] - box[0])}" height="${f(box[3] - box[1])}"><rect x="${f(box[0])}" y="${f(box[1])}" width="${f(box[2] - box[0])}" height="${f(box[3] - box[1])}" fill="#fff"/>` +
      `<path d="${d}" transform="translate(0 ${f(dy)})" fill="#000" filter="${H.weich(std, [box[0], box[1] - dy, box[2], box[3] - dy])}"/></mask>`);
    return `mask="url(#${id})"`;
  };
  /* Flosse aus Achse B → E mit Profil [[u, breite vorn, breite hinten], …] (vorn = Seite −n), krumm biegt die Achse
     (positiv = zur Hinterseite). Liefert { pts, vorn, hinten, n } */
  H.flosse = (B, E, prof, krumm = 0) => {
    const dx = E[0] - B[0], dy = E[1] - B[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, nx = -uy, ny = ux;
    const vorn = [], hinten = [];
    for (const [u, wv, wh] of prof) {
      const c = krumm * Math.sin(Math.PI * u), x = B[0] + dx * u + nx * c, y = B[1] + dy * u + ny * c;
      vorn.push([x - nx * wv, y - ny * wv]); hinten.push([x + nx * wh, y + ny * wh]);
    }
    return { pts: vorn.concat(hinten.slice().reverse()), vorn, hinten, n: [nx, ny], u: [ux, uy] };
  };
  /* Mundlinie als spitz auslaufende Fläche: pts (Linie), breiten [w0, wMitte, w1] */
  H.spaltLinie = (pts, w0, wm, w1) => {
    const dd = H.dicht(pts, false, 4).map((p) => [p[0], p[1]]);
    const n = dd.length - 1;
    const w = (i) => { const t = i / n; return t < 0.5 ? w0 + (wm - w0) * t * 2 : wm + (w1 - wm) * (t - 0.5) * 2; };
    return H.vieleck(H.versatz(dd, (u) => -w(Math.round(u * n)) / 2).concat(H.versatz(dd, (u) => w(Math.round(u * n)) / 2).reverse()));
  };
  /* Buckel in eine Kontur einbauen: pts (Kontrollpunkte, x fallend), liste [[x, höhe, halbe Breite], …] (höhe > 0 = nach oben) */
  H.buckel = (pts, liste) => {
    const yv = lin(H.dicht(pts, false, 10));
    const frei = pts.filter((p, i) => i === 0 || i === pts.length - 1 || !liste.some(([x, h, w]) => Math.abs(p[0] - x) < w * 1.2));
    const neu = [];
    for (const [x, h, w] of liste) neu.push([x + w, yv(x + w)], [x, yv(x) - h], [x - w, yv(x - w)]);
    return frei.concat(neu).sort((a, b) => b[0] - a[0]);
  };
  /* Glanz der nassen Haut: n kurze, unterbrochene, schmale Linsen entlang t (Kern weiß) */
  H.glanz = (R, x0, x1, t, n, b, op = 0.85, std = 0.6, farbe = "#ffffff") => {
    let s = "";
    const seg = (x1 - x0) / n;
    for (let i = 0; i < n; i++) {
      const xa = x0 + seg * i + seg * (0.08 + T.rnd() * 0.15), xb = x0 + seg * (i + 1) - seg * (0.08 + T.rnd() * 0.2);
      s += H.weichF(R.linse(xa, xb, t + (T.rnd() - 0.5) * b, b * (0.7 + T.rnd() * 0.5), F ? 12 : 6), farbe, op * (0.75 + T.rnd() * 0.25), std);
    }
    return s;
  };
  /* Fluke waagrecht, leicht von oben (Wale): Plan je Hälfte in (u/L nach hinten, v/S nach außen); naher Teil nach unten
     (Faktor k), ferner nach oben (k · fern) und am Ansatz vom Stiel verdeckt. o: { x0, y0, L, S, k, fern, plan, farbe,
     hell, dunkel, rand, zacken, weich }. Liefert { fern, nah } (fern vor dem Rumpf, nah danach zeichnen). */
  H.fluke = (o) => {
    const { x0, y0, L, S } = o, k = o.k || 0.2, kf = k * (o.fern || 0.55);
    const plan = o.plan || [[-0.12, 0.06], [0, 0.18], [0.25, 0.46], [0.5, 0.74], [0.75, 0.93], [0.92, 1.0], [1, 0.97, 1], [0.9, 0.78], [0.8, 0.52], [0.7, 0.27], [0.62, 0.1], [0.56, 0, 1], [-0.12, 0, 1]];
    const ispitze = plan.findIndex((q, i) => i > 0 && q[2]);
    const kerbe = plan.length - 2;
    const half = (nah) => {
      /* Schließkante (Kerbe → Ansatz) leicht gewölbt: die nahe Hälfte greift etwas über die Achse (Kiel des Stiels) */
      const un = plan[kerbe][0], ua = plan[plan.length - 1][0];
      const pl = plan.slice(0, -1).concat([[un * 0.7 + ua * 0.3, -0.03], [un * 0.35 + ua * 0.65, -0.035], plan[plan.length - 1]]);
      let pts = pl.map(([u, v, e]) => { const p = [x0 - u * L, y0 + (nah ? 1 : -1) * v * S * (nah ? k : kf)]; if (e) p.push(1); return p; });
      /* gezackter Hinterrand (Buckelwal): kleine Bögen zwischen Spitze und Kerbe */
      if (o.zacken && F) {
        const hin = H.dicht(pts.slice(ispitze, kerbe + 1).map((p) => [p[0], p[1]]), false, 6), z = [];
        const amp = (nah ? 1 : 0.4) * o.zacken;
        for (let i = 0; i < hin.length; i++) { const q = hin[i], ph = i / (hin.length - 1); z.push([q[0] - Math.abs(Math.sin(ph * Math.PI * (o.zN || 9))) * amp * (0.6 + 0.4 * Math.sin(i * 1.7)), q[1]]); }
        pts = pts.slice(0, ispitze).concat(z.map((q, i) => (i === 0 || i === z.length - 1 ? [q[0], q[1], 1] : q)), pts.slice(kerbe + 1));
      }
      return pts;
    };
    const mk = (nah) => {
      const pts = half(nah), d = G(pts), sg = nah ? 1 : -1, kk = nah ? k : kf;
      const grad = T.lg("flu" + (nah ? "N" : "F"), [[0, o.hell || "#3a4550"], [0.5, o.farbe || "#1d2126"], [1, o.dunkel || "#121418"]], f(x0 - 0.15 * L), f(y0 + sg * 0.2 * S * kk), f(x0 - 0.8 * L), f(y0 + sg * 0.5 * S * kk), H.US);
      const vk = plan.slice(1, ispitze + 1).map(([u, v]) => [x0 - u * L - 1.2 * L / 100, y0 + sg * v * S * kk - sg * 0.012 * S]);
      const hk = pts.slice(ispitze, pts.length - 3).map((p) => [p[0], p[1]]);
      let inn = H.weichL([vk], o.licht || "#9fb3c2", Math.max(0.6, S * 0.012), nah ? 0.45 : 0.3, Math.max(0.3, S * 0.006));
      inn += H.L([hk], "#000", Math.max(0.3, S * 0.0045), 0.6);
      if (o.extra) inn += o.extra(nah, pts);
      if (nah) inn += H.weichL([pts.slice(-3).map((p) => [p[0], p[1] + S * kk * 0.02])], "#000", Math.max(0.5, S * 0.012), 0.35, Math.max(0.3, S * 0.006));
      const teil = H.teil(d, grad, { innen: inn, randD: G(pts.slice(1, -3), false), randA: 0.2, rw: Math.max(0.3, S * 0.004) });
      const b = T.box(pts);
      return `<g ${H.maskeX(x0 - 0.1 * L * (nah ? -1 : -1), x0 - 0.06 * L, [b[0] - 5, b[1] - 5, b[2] + 5, b[3] + 5])}>${H.vol("flu" + (nah ? "n" : "f"), o.weich || Math.max(1, S * kk * 0.18), teil, { tiefe: 3 })}</g>`;
    };
    return { fern: mk(false), nah: mk(true) };
  };
  /* Knoten (Tuberkel) auf der Haut: runde Beule, Licht oben links, Schatten unten rechts, mittig ein Tasthaar.
     Einmal als Vorlage (Einheitskreis) angelegt, je Knoten nur <use>. liste: [[x, y, r], …] */
  const vorlage = {};
  const r2 = (n) => String(Math.round(n * 100) / 100);
  H.knoten = (liste, haut = "#2a3036") => {
    /* nur Relief im Hautton: Licht oben links, Schatten unten rechts, kein dunkler Kern, kein Spiegelpunkt */
    const id = T.id("kn");
    if (!vorlage[id]) {
      vorlage[id] = 1;
      T.def(`<g id="${id}"><ellipse cx=".28" cy=".42" rx="1.2" ry=".95" fill="${T.rg("knS", [[0, "#000", 0.38], [0.6, "#000", 0.18], [1, "#000", 0]])}"/>` +
        `<ellipse cx="-.18" cy="-.26" rx=".85" ry=".68" fill="${T.rg("knH", [[0, "#c4d4e0", 0.34], [1, "#c4d4e0", 0]])}"/>` +
        (F ? `<path d="M.05 -.05q.18 -.35 .5 -.62" fill="none" stroke="#cfc8b8" stroke-width=".05" stroke-opacity=".5"/>` : "") + `</g>`);
    }
    return liste.map(([x, y, r]) => `<use href="#${id}" transform="translate(${f(x)} ${f(y)}) scale(${r2(r)})"/>`).join("");
  };
  /* Seepocken (Coronula): Kranz aus Kalkplatten mit dunkler Öffnung, Schatten unten rechts. liste: [[x, y, r], …] */
  H.seepocken = (liste) => {
    const id = T.id("sp");
    if (!vorlage[id]) {
      vorlage[id] = 1;
      /* Krone: sechs Kalkplatten als unregelmäßiger Wellenkranz; Öffnung dunkel, eingesunken */
      const kr = [], mi = [];
      for (let i = 0; i < 18; i++) { const w = i / 18 * Math.PI * 2, rr = 1 + (i % 3 === 0 ? 0.1 : -0.04) + Math.sin(i * 2.7) * 0.04; kr.push([Math.cos(w) * rr, Math.sin(w) * rr * 0.92]); }
      for (let i = 0; i < 9; i++) { const w = i / 9 * Math.PI * 2, rr = 0.3 + (i % 2 ? 0.07 : -0.03); mi.push([Math.cos(w) * rr * 1.2 + 0.04, Math.sin(w) * rr * 0.7 + 0.03]); }
      const pfad = (pts) => "M" + pts.map((p) => r2(p[0]) + " " + r2(p[1])).join(" ") + "Z";
      let pl = "";
      for (let i = 0; i < 6; i++) { const w = i / 6 * Math.PI * 2 + 0.3; pl += `M${r2(Math.cos(w) * 0.48)} ${r2(Math.sin(w) * 0.44)}L${r2(Math.cos(w) * 0.92)} ${r2(Math.sin(w) * 0.85)}`; }
      T.def(`<g id="${id}"><ellipse cx=".28" cy=".38" rx="1.2" ry="1.05" fill="${T.rg("spS", [[0, "#000", 0.5], [0.75, "#000", 0.2], [1, "#000", 0]])}"/>` +
        `<path d="${pfad(kr)}" fill="${T.rg("spG", [[0, "#d6d4cb"], [0.55, "#c9c7bd"], [1, "#9a988f"]], 0.36, 0.3, 0.75)}"/>` +
        (F ? `<path d="${pl}" stroke="#8a806b" stroke-width=".07" stroke-opacity=".6" fill="none"/>` : "") +
        `<path d="${pfad(mi)}" fill="#24221f"/><path d="M-.36 -.12A.4 .36 0 0 1 .3 -.26" fill="none" stroke="#000" stroke-opacity=".5" stroke-width=".1"/></g>`);
    }
    return liste.map(([x, y, r]) => `<use href="#${id}" transform="translate(${f(x)} ${f(y)}) scale(${r2(r)}) rotate(${Math.round(x * 7 % 60)})"/>`).join("");
  };
  /* Walauge (Seitenansicht): kleine Lidspalte, Hautfalten, dunkle Iris, Pupille, nasser Glanz.
     x, y = Mitte, r = halbe Breite, o: { winkel, iris, haut (Farbe der Falten), hell (Faltenlicht) } */
  H.walAuge = (x, y, rr, o = {}) => {
    const f2 = (n) => String(Math.round(n * 100) / 100);
    const id = T.id("wa" + nr++);
    const W = rr, Ho = rr * (o.offen || 0.55), Hu = Ho * 0.8;
    const spalt = `M${f2(-W)} 0C${f2(-W * 0.5)} ${f2(-Ho * 1.25)} ${f2(W * 0.45)} ${f2(-Ho * 1.3)} ${f2(W)} ${f2(-Ho * 0.1)}C${f2(W * 0.45)} ${f2(Hu * 1.15)} ${f2(-W * 0.45)} ${f2(Hu * 1.2)} ${f2(-W)} 0Z`;
    T.def(`<clipPath id="${id}"><path d="${spalt}"/></clipPath>`);
    const iris = o.iris || "#4a2c18";
    const ig = T.rg("waIris" + iris.slice(1), [[0, iris], [0.55, iris], [0.85, "#0e0806"], [1, "#030202"]], 0.5, 0.45, 0.55);
    let s = `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${o.winkel || 0})">`;
    /* Augenhöhle: weiche Vertiefung; Lidwulst oben mit mattem Licht; feine Fältchen an den Winkeln */
    s += `<ellipse cx="0" cy="${f2(rr * 0.05)}" rx="${f2(W * 2.4)}" ry="${f2(rr * 1.6)}" fill="${T.rg("waHoehle", [[0, "#000", 0.55], [0.55, "#000", 0.25], [1, "#000", 0]])}"/>`;
    s += `<path d="M${f2(-W * 1.15)} ${f2(-Ho * 0.6)}C${f2(-W * 0.5)} ${f2(-Ho * 1.9)} ${f2(W * 0.5)} ${f2(-Ho * 1.95)} ${f2(W * 1.2)} ${f2(-Ho * 0.7)}" fill="none" stroke="${o.hell || "#9fb3c3"}" stroke-opacity=".32" stroke-width="${f2(rr * 0.13)}" stroke-linecap="round"/>`;
    if (F) {
      s += `<path d="M${f2(-W * 1.4)} ${f2(-Ho * 1.2)}C${f2(-W * 0.6)} ${f2(-Ho * 2.4)} ${f2(W * 0.7)} ${f2(-Ho * 2.4)} ${f2(W * 1.5)} ${f2(-Ho * 1.1)}" fill="none" stroke="${o.hell || "#a9bccb"}" stroke-opacity=".12" stroke-width="${f2(rr * 0.5)}" stroke-linecap="round" filter="${H.weich(Math.round(rr * 12) / 100, [-W * 1.6, -Ho * 2.6, W * 1.7, -Ho])}"/>`;
      s += `<path d="M${f2(-W * 1.05)} ${f2(Ho * 0.15)}l${f2(-W * 0.5)} ${f2(Ho * 0.35)}M${f2(-W * 1.05)} ${f2(-Ho * 0.1)}l${f2(-W * 0.55)} ${f2(-Ho * 0.15)}M${f2(W * 1.05)} ${f2(Hu * 0.05)}l${f2(W * 0.4)} ${f2(Hu * 0.45)}M${f2(-W * 0.3)} ${f2(Hu * 1.45)}c${f2(W * 0.4)} ${f2(Hu * 0.3)} ${f2(W * 0.8)} ${f2(Hu * 0.2)} ${f2(W * 1.1)} ${f2(-Hu * 0.2)}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="${f2(rr * 0.08)}" stroke-linecap="round"/>`;
    }
    s += `<path d="${spalt}" fill="#050403"/><g clip-path="url(#${id})">`;
    s += `<circle cx="${f2(W * 0.08)}" cy="${f2(-Ho * 0.1)}" r="${f2(rr * 0.8)}" fill="${ig}"/>`;
    s += `<ellipse cx="${f2(W * 0.1)}" cy="${f2(-Ho * 0.05)}" rx="${f2(rr * 0.34)}" ry="${f2(rr * 0.22)}" fill="#010101"/>`;
    s += `<rect x="${f2(-W)}" y="${f2(-rr)}" width="${f2(2 * W)}" height="${f2(rr * 0.95)}" fill="${T.lg("waLid", [[0, "#000", 0.85], [0.6, "#000", 0.4], [1, "#000", 0]])}"/>`;
    s += `<ellipse cx="${f2(W * 0.3)}" cy="${f2(-Ho * 0.4)}" rx="${f2(rr * 0.15)}" ry="${f2(rr * 0.1)}" fill="#fff" opacity=".9"/>`;
    s += `<ellipse cx="${f2(-W * 0.35)}" cy="${f2(Hu * 0.3)}" rx="${f2(rr * 0.22)}" ry="${f2(rr * 0.05)}" fill="#bcd0dc" opacity=".35"/></g>`;
    s += `<path d="M${f2(-W)} 0C${f2(-W * 0.5)} ${f2(-Ho * 1.25)} ${f2(W * 0.45)} ${f2(-Ho * 1.3)} ${f2(W)} ${f2(-Ho * 0.1)}" fill="none" stroke="#010101" stroke-width="${f2(rr * 0.22)}" stroke-linecap="round"/>`;
    s += `<path d="M${f2(W * 0.85)} ${f2(Hu * 0.3)}C${f2(W * 0.3)} ${f2(Hu * 1.3)} ${f2(-W * 0.4)} ${f2(Hu * 1.3)} ${f2(-W * 0.9)} ${f2(Hu * 0.35)}" fill="none" stroke="#dfeaf1" stroke-opacity=".3" stroke-width="${f2(rr * 0.07)}"/>`;
    return s + `</g>`;
  };
  /* Abschluss: tiefster Punkt auf y = 0 schieben; kopf (cm, gleiche Lage) für den Kopf-Ausschnitt */
  H.ende = (svg, box, kopf) => ({
    svg: `<g transform="translate(0 ${f(-box[3])})">${svg}</g>`,
    box: [box[0], box[1] - box[3], box[2], 0],
    kopf: kopf ? [kopf[0], kopf[1] - box[3], kopf[2], kopf[3] - box[3]] : undefined,
  });
  return H;
}

/* =====================================================================
   ORCA (SCHWERTWAL)
   ===================================================================== */
/* RECHERCHE Orca (Orcinus orca), erwachsener Bulle:
   Länge 6–8 m (hier 7 m), kräftiger Spindelkörper, größter Umfang knapp vor der Rückenfinne; Kopf kegelig-rund,
   kaum Schnabel; Maullinie fast gerade, am Mundwinkel leicht nach unten. Auge klein, knapp über und hinter dem
   Mundwinkel. AUGENFLECK: weißes, längliches Oval ÜBER und etwas HINTER dem Auge (Abstand zum Auge!), vorn
   stumpf, hinten schmaler und leicht ansteigend. Kinn und Kehle weiß, die Grenze läuft hinter dem Mundwinkel nach
   unten zur Brustflosse; Brustflossen groß, paddelförmig-rund (Bulle bis ~2 m), ganz schwarz. Bauch weiß;
   hinter der Rückenfinne zieht der weiße FLANKENFLECK vom Bauch schräg nach oben-hinten und endet in einer
   nach hinten zeigenden Spitze. SATTELFLECK: grau, hinter der Finne auf dem Rücken. Rückenfinne beim Bulle bis
   1,8 m, hoch, gerade dreieckig, Hinterkante gerade. Fluke ~2,7 m Spannweite, Unterseite weiß, Oberseite schwarz.
   Haut glatt, nass glänzend, feine Zahnharken-Narben (hell) von Artgenossen; Gegenschattierung. */
function orca(T) {
  const H = mach(T), { G, L, teil, weichF, weichL, F, f } = H;
  const SCHWARZ = "#15181c", WEISS = "#eef1ee";
  /* Rumpf (7 m Bulle, Schnauze x = 700): Kopf stumpf-kegelig, Blasloch als flache Mulde über dem Auge,
     Schwanzstiel bis zum Flukenansatz (x 60) */
  const oben = H.buckel([[700, -203], [699, -214], [694, -227], [684, -241], [668, -255], [645, -272], [612, -289], [570, -299], [520, -307], [460, -312], [400, -313], [340, -309], [285, -301], [230, -289], [178, -274], [130, -259], [96, -250], [70, -246], [50, -242], [34, -238.5], [20, -235.5], [8, -233.8]], [[592, -1.6, 8]]);
  const R = H.rumpf(oben,
    [[700, -203], [698, -193], [692, -182], [680, -172], [660, -163], [632, -156], [598, -150], [556, -145], [508, -142], [455, -142], [400, -145], [345, -152], [292, -163], [240, -178], [190, -194], [145, -207], [112, -215], [88, -219], [70, -221], [50, -224], [34, -227.5], [20, -230.5], [8, -232.4]]);
  const P = R.P;
  /* Fluke: waagrecht, 12–15° von oben; ferne Hälfte kurz und am Ansatz verdeckt */
  const FL = H.fluke({ x0: 64, y0: -233, L: 112, S: 135, k: 0.2, fern: 0.55, hell: "#3a4550", farbe: "#1b1f24", dunkel: "#121418",
    plan: [[-0.12, 0.05], [0, 0.15], [0.25, 0.42], [0.5, 0.72], [0.75, 0.93], [0.92, 1.0], [1, 0.98, 1], [0.9, 0.8], [0.8, 0.55], [0.7, 0.28], [0.62, 0.1], [0.56, 0, 1], [-0.12, 0, 1]] });
  let s = FL.fern;
  /* ---- Rumpf mit Zeichnung ---- */
  let k = "";
  /* Kinn/Kehle weiß: Grenze 2–3 cm UNTER der Maullinie (Oberkiefer schwarz), hinter dem Mundwinkel steil zur Brustflosse */
  const kinn = G([[712, -202], [700, -200.6], [690, -200], [672, -199], [650, -197.8], [632, -195.8], [622, -192.6], [613, -185], [604, -176], [593, -167], [581, -159], [568, -151], [556, -140, 1], [712, -140, 1]]);
  k += `<path d="${kinn}" fill="${WEISS}" filter="${H.weich(0.6, [550, -210, 714, -138])}"/>`;
  /* schmales Bauchband und Flankenfleck (vom Bauch schräg nach oben-hinten, Spitze nach hinten) */
  const flanke = R.muster([[575, 0.985], [530, 0.965], [470, 0.955], [415, 0.95], [388, 0.92], [366, 0.84], [348, 0.73], [330, 0.62], [310, 0.53], [288, 0.46], [264, 0.42], [238, 0.41], [212, 0.43], [188, 0.46], [168, 0.5], [184, 0.55], [206, 0.6], [228, 0.68], [246, 0.78], [258, 0.9], [264, 1.08], [575, 1.08]]);
  k += `<path d="${flanke}" fill="${WEISS}" filter="${H.weich(0.7, [160, -265, 580, -135])}"/>`;
  /* Sattelfleck: grau, beginnt direkt an der Hinterkante der Finnenbasis (vorn schärfer), läuft nach hinten weich aus */
  const sattel = R.muster([[316, -0.08], [312, 0.04], [300, 0.12], [280, 0.17], [252, 0.19], [222, 0.17], [196, 0.11], [178, 0.03], [170, -0.08]]);
  k += `<path d="${sattel}" fill="#8d969d" filter="${H.weich(2.5, [160, -320, 325, -265])}"/>`;
  k += `<path d="${R.muster([[316, -0.08], [312, 0.04], [300, 0.12], [280, 0.17], [262, 0.18], [262, -0.08]])}" fill="#8d969d" filter="${H.weich(1.2, [255, -320, 325, -270])}"/>`;
  if (F) k += weichL([[P(318, 0.0), P(306, 0.1), P(284, 0.16)]], "#2a3036", 3, 0.3, 1.5);
  /* Augenfleck: über und hinter dem Auge, vorn stumpf, hinten schmal und ansteigend */
  const af = [[606, -225], [602, -236], [591, -245], [573, -252], [551, -257], [530, -261], [513, -263], [503, -261], [508, -255], [524, -246], [548, -237], [572, -229], [591, -223]];
  k += `<path d="${G(af)}" fill="${WEISS}" filter="${H.weich(0.6, T.box(af))}"/>`;
  /* Licht von oben (Wasser): schwaches Himmelslicht, EIN weicher Kernschatten, bläulicher Schatten im Weiß, Reflex am Bauch */
  k += weichF(R.band(60, 698, -0.05, 0.25), "#b9cbd8", 0.08, 15);
  k += weichF(R.band(70, 660, 0.5, 0.95), "#000", 0.3, 14);
  k += weichF(R.band(260, 640, 0.76, 1.04), "#56677a", 0.32, 8);
  k += weichF(R.band(160, 650, 0.96, 1.08), "#b4c3cc", 0.28, 3);
  /* Schatten der Rückenfinne auf dem Rücken dahinter, Schatten der Brustflosse auf dem Bauchweiß */
  k += weichF([[332, -309], [300, -303], [270, -294], [262, -286], [300, -290], [330, -298]], "#000", 0.3, 6);
  /* nasser Glanz: kurze, unterbrochene, schmale Linsen auf der Rückenkuppe, kompakter Glanzfleck auf der Melone */
  k += H.glanz(R, 470, 610, 0.045, 2, 0.008, 0.6, 0.8);
  k += H.glanz(R, 150, 290, 0.06, 2, 0.007, 0.5, 0.8);
  k += weichF(R.saum(655, 688, 2, 5.5), "#ffffff", 0.6, 0.9);
  /* Blasloch: dunkle Kerbe in der Mulde, Lichtwulst dahinter */
  k += weichL([[[598, -293.5], [592, -292.6], [586, -293.6]]], "#000", 1.4, 0.7, 0.4) + weichL([[[586, -291], [578, -292.5]]], "#cfdbe4", 1.2, 0.35, 0.6);
  /* Zahnharken-Narben in Gruppen zu 3–4, spitz auslaufend */
  k += H.narbenG([[500, -272, -6, 44, 4, 2.5, 0.3], [440, -258, -14, 30, 3, 2.3, -0.3], [470, -215, 8, 24, 3, 2.6, 0.2], [270, -262, 10, 46, 4, 2.4, 0.3], [215, -248, 4, 22, 3, 2.2, -0.2], [560, -280, -18, 26, 3, 2.2, 0.2]], "#cfd8de", 0.9, 0.3);
  /* eine weiche Achselfalte vor der Brustflosse */
  k += weichL([[[594, -181], [578, -173], [563, -177]]], "#000", 3, 0.25, 1.5) + weichL([[[594, -178], [578, -170], [564, -174]]], "#8fa3b4", 1.6, 0.12, 1);
  /* Maullinie: vorn fein, Mitte kräftiger, zum Mundwinkel auslaufend; Oberlippe wirft weichen Schatten */
  const maul = [[700, -203], [684, -202.5], [662, -201.5], [642, -200], [628, -198], [619, -196.5]];
  k += weichL([maul.map((p) => [p[0], p[1] + 1.6])], "#000", 2, 0.25, 1.2);
  k += `<path d="${H.spaltLinie(maul, 0.9, 1.4, 0.6)}" fill="#030405"/>`;
  k += L([maul.slice(0, 5).map((p) => [p[0], p[1] + 1.7])], "#ffffff", 0.6, 0.35);
  s += H.vol("rumpf", 30, teil(R.d, SCHWARZ, { innen: k, randA: 0.28 }));
  /* Rückenfinne: hoch, gerade dreieckig; Fußverrundung vorn und hinten, Basis wächst aus dem Rücken (Maske) */
  const yo = R.yo;
  const fin = [[484, yo(484) + 2], [464, yo(464) + 0.3], [449, yo(449) - 2.6], [438, -328], [428, -346], [416, -372], [404, -404], [388, -440], [371, -468], [361, -481], [353, -483], [348, -476], [345, -440], [340, -396], [335, -356], [330, -334], [323, -320], [313, yo(313) - 2.2], [300, yo(300) + 0.3], [284, yo(284) + 2.2], [290, -280, 1], [480, -286, 1]];
  const fg = T.lg("orcaFin", [[0, "#22272d"], [0.55, SCHWARZ], [1, "#0f1114"]], 440, -380, 340, -380, H.US);
  let fi = weichF([[444, -318], [433, -333], [421, -362], [405, -404], [387, -442], [370, -470], [361, -480], [366, -468], [383, -436], [400, -398], [414, -360], [424, -332], [434, -318]], "#c2d2de", 0.5, 1.4);
  fi += weichF([[358, -476], [350, -440], [345, -390], [339, -345], [331, -318], [325, -316], [334, -350], [339, -400], [346, -455]], "#000", 0.45, 4);
  fi += H.narbenG([[402, -380, 62, 40, 3, 2.4, 0.4], [380, -424, 58, 28, 4, 2.2, -0.3], [366, -340, 70, 34, 3, 2.6, 0.3]], "#c9d3da", 0.9, 0.45);
  const finB = T.box(fin);
  s += `<g ${H.maskeOhne(R.d, 6, 2.5, [finB[0] - 10, finB[1] - 10, finB[2] + 10, finB[3] + 10])}>${H.vol("finne", 10, teil(G(fin), fg, { innen: fi, randD: G(fin.slice(3, 17), false), randA: 0.28 }))}</g>`;
  /* nahe Brustflosse: großes, fast rundes Paddel (≈ 20 % KL), Ansatz bei ¾ der Körperhöhe, Wurzel wächst aus dem Rumpf */
  const BF = H.flosse([588, -186], [470, -104], [[0, 26, 22], [0.12, 31, 27], [0.35, 37, 35], [0.55, 38, 36], [0.75, 32, 30], [0.9, 21, 19], [1, 4, 4]], -6);
  let fo = weichF(BF.vorn.slice(1, 6).concat(BF.vorn.slice(1, 6).reverse().map((p) => [p[0] + 9, p[1] - 3])), "#a9bccb", 0.4, 3);
  fo += weichF(BF.hinten.slice(1, 6).concat(BF.hinten.slice(1, 6).reverse().map((p) => [p[0] - 8, p[1] + 6])), "#000", 0.45, 4);
  fo += weichF([[592, -196], [560, -192], [548, -172], [584, -170]], "#000", 0.5, 7);
  const bfB = T.box(BF.pts);
  s += `<g ${H.maskeR(589, -187, 3, 16, [bfB[0] - 10, bfB[1] - 10, bfB[2] + 10, bfB[3] + 10])}>${H.vol("flosse", 10, teil(G(BF.pts), SCHWARZ, { innen: fo, randA: 0.28 }))}</g>`;
  s += FL.nah;
  /* Auge knapp über und hinter dem Mundwinkel, in einer flachen Mulde */
  s += H.walAuge(604, -208, 4.2, { winkel: -6 });
  return H.ende(s, [-48, -483, 700, -64], [560, -320, 702, -150]);
}

/* =====================================================================
   DELFIN (GROSSER TÜMMLER)
   ===================================================================== */
/* RECHERCHE Großer Tümmler (Tursiops truncatus):
   2,5–3,8 m (hier 2,8 m), kräftig gebaut. Kurzer, stumpfer Schnabel (~4 % der Länge), durch eine deutliche
   Kerbe von der runden Melone getrennt; Unterkiefer etwas länger als der Oberkiefer. Maullinie leicht nach oben
   gebogen, Mundwinkel ~10 % hinter der Spitze; Auge knapp dahinter und darüber (~13 %), Blasloch ~14 %. Brustflossen
   mittellang (~14 %), Wurzel breit (~⅓ der Flossenlänge), Vorderkante konvex, Hinterkante leicht konkav, spitz;
   Ansatz bei ~70 % der Körperhöhe. Rückenfinne hoch, sichelförmig (falkat, ~9 % hoch), Mitte des Rückens. Schwanzstiel
   seitlich abgeflacht, von der Seite HOCH, mit Rücken- und Bauchkiel; Fluke ~22 % Spannweite, waagrecht, Kerbe in der
   Mitte. Färbung: dunkelgrauer Umhang (Cape) von der Melone bis zur Finne, tiefster Punkt unter der Finne, dahinter
   steil ansteigend und schmal; Flanken heller grau, heller Schimmer über der Brustflosse zur Finne ansteigend; Bauch
   weiß bis rosa; schwacher dunkler Streifen Auge–Brustflosse und Auge–Melonenansatz. Helle Zahnharken-Narben in
   kurzen parallelen Gruppen (Kopf, Flanke, Finne); Haut glatt, nass glänzend. */
function delfin(T) {
  const H = mach(T), { G, L, teil, weichF, weichL, F, f } = H;
  const R = H.rumpf(
    [[281.6, -45.6], [281, -47.6], [279.6, -49.6], [276.5, -51.5], [272.5, -52.6], [269.5, -53.4, 1], [268.2, -57], [266.6, -61], [263.8, -65.2], [259, -69.4], [252, -72.8], [243, -75.4], [232, -77.4], [215, -80.2], [195, -82.3], [172, -83.4], [150, -83.4], [128, -82.2], [108, -79.8], [88, -75.2], [68, -69.5], [50, -64.5], [36, -61], [24, -57.6], [14, -55.4], [6, -53.6], [-2, -52.3], [-6, -51.8]],
    [[281.6, -45.6], [280.6, -43.6], [278, -41.8], [273, -40.3], [266, -39.1], [257, -37.6], [246, -35.4], [232, -32.2], [215, -29.2], [195, -27.4], [172, -27], [150, -27.8], [128, -29.8], [108, -33], [88, -38], [68, -42.5], [50, -44.2], [36, -45.2], [24, -46.2], [14, -47.6], [6, -49], [-2, -50.4], [-6, -50.9]]);
  const P = R.P, yo = R.yo;
  const RUECKEN = F ? "#3d454e" : "#353c44", FLANKE = "#9aa3ab", BAUCH = "#eeebe6";
  /* Fluke: waagrecht, leicht von oben; ferne Hälfte kurz und vom Stiel verdeckt */
  const FL = H.fluke({ x0: 9, y0: -51.4, L: 33, S: 32, k: 0.27, fern: 0.55, hell: "#7b8792", farbe: "#55606b", dunkel: "#3a424b", licht: "#e3edf3", weich: 1.2 });
  let s = FL.fern;
  let k = "";
  /* Cape-Grenze: an der Melone t 0,30, tiefster Punkt unter der Finnenvorderkante (0,42), dahinter steil hinauf, schmal */
  k += `<path d="${R.muster([[300, 0.3], [268, 0.3], [250, 0.32], [225, 0.36], [200, 0.4], [172, 0.42], [154, 0.4], [136, 0.32], [122, 0.24], [106, 0.19], [80, 0.19], [50, 0.2], [20, 0.22], [-10, 0.22], [-10, 1.2], [300, 1.2]])}" fill="${FLANKE}" filter="${H.weich(3, [-12, -86, 302, -25])}"/>`;
  /* heller Schimmer („Blaze“) über der Brustflosse, schräg zur Finne ansteigend */
  k += `<path d="${R.muster([[234, 0.62], [214, 0.52], [194, 0.45], [176, 0.42], [160, 0.44], [176, 0.52], [198, 0.6], [220, 0.67]])}" fill="#c3c9ce" opacity="${F ? 0.4 : 0.3}" filter="${H.weich(3, [150, -75, 245, -30])}"/>`;
  /* Bauchweiß: vorn hoch (0,52 am Mundwinkel), hinter der Flosse 0,70, zum Genitalbereich 0,82; hinten ein Hauch Rosa */
  k += `<path d="${G([[300, -40], ...[[268, 0.5], [251, 0.52], [240, 0.58], [226, 0.64], [205, 0.7], [180, 0.71], [150, 0.72], [125, 0.76], [100, 0.82], [84, 0.9], [72, 1.1]].map((q) => P(q[0], q[1])), [66, -20, 1], [300, -20, 1]])}" fill="${BAUCH}" filter="${H.weich(2, [60, -60, 302, -20])}"/>`;
  if (F) k += weichF(R.band(84, 170, 0.86, 1.05), "#efe0dc", 0.6, 3);
  /* Unterkiefer hell, Kehle */
  k += `<path d="${G([[285, -46.2], [276, -46.4], [266, -47.4], [258, -48.4], [252, -50.4], [248, -49], [252, -44], [262, -38], [285, -38]])}" fill="#e2e2de" filter="${H.weich(0.5, [245, -53, 286, -37])}"/>`;
  /* Augenumgebung (Mandel), Streifen Auge → Brustflosse und Auge → Melonenansatz */
  k += weichF([[249.5, -58.2], [246, -60.8], [242, -61.2], [238, -59.4], [240, -56.4], [245, -55.8]], "#20282f", 0.5, 0.9);
  k += weichF([[246, -60], [236, -55.5], [228, -50], [222, -45], [218, -41.5], [222, -40.5], [230, -46], [240, -53], [247, -57.5]], "#323a42", 0.55, 1.4);
  k += weichL([[[248, -60], [256, -62.5], [264, -63.5]]], "#2a3138", 1.6, 0.25, 0.8);
  /* Licht von oben: schwaches Himmelslicht, EIN weicher Kernschatten, Reflexlicht am Bauchrand */
  k += weichF(R.band(10, 280, -0.05, 0.22), "#dce8f0", 0.07, 4);
  k += weichF(R.band(20, 268, 0.55, 0.95), "#16202a", 0.24, 10);
  k += weichF(R.band(30, 260, 0.6, 0.72), "#16202a", 0.1, 5);
  k += weichF(R.band(60, 262, 0.95, 1.05), "#dfe9ef", 0.25, 1);
  /* Schatten der Finne auf dem Rücken, der Brustflosse auf Flanke und Bauch */
  k += weichF([[110, -79], [98, -76.5], [86, -73], [90, -70], [104, -74]], "#000", 0.28, 2.5);
  k += weichF([[226, -38], [214, -31], [202, -24], [194, -20], [204, -28], [216, -35]].map((p) => [p[0] - 3, p[1] - 1]), "#16202a", 0.25, 2.5);
  /* Schwanzstiel: Rückenkiel als Lichtkante, Bauchkiel als Schattenkante */
  k += weichL([[P(96, 0.05), P(60, 0.05), P(30, 0.06), P(8, 0.08)]], "#e6eff5", 0.8, 0.3, 0.4);
  k += weichL([[P(84, 0.95), P(56, 0.94), P(28, 0.92), P(8, 0.9)]], "#000", 1, 0.25, 0.6);
  /* nasser Glanz: kompakte Linse auf der Melonenkuppe, unterbrochene schmale Linsen auf der Rückenkuppe */
  k += weichF(R.saum(242, 274, 0.8, 2.2), "#ffffff", 0.45, 0.5);
  k += weichF(R.linse(252, 265, (x, u) => 0.12 + u * 0.08, 0.04), "#ffffff", 0.6, 0.5);
  k += H.glanz(R, 176, 232, 0.07, 2, 0.012, 0.5, 0.7);
  k += H.glanz(R, 40, 106, 0.09, 2, 0.014, 0.45, 0.7);
  /* Narben: helle Zahnharken in kurzen parallelen Gruppen (Kopf, Flanke vor der Finne) */
  k += H.narbenG([[226, -66, -10, 8, 4, 0.9, 0.2], [204, -60, 6, 7, 3, 0.85, -0.2], [188, -70, -6, 9, 5, 0.9, 0.2], [162, -58, 12, 6, 3, 0.8, 0.1], [254, -64, 20, 5, 3, 0.7, 0]], "#e4eaee", 0.4, 0.3);
  /* Kerbe Schnabel/Melone (Schattenkeil), Maullinie (leicht ansteigend, spitz auslaufend), Lippenlicht, Blasloch */
  k += weichF([[270.4, -53.6], [268.6, -51.6], [265.6, -50.3], [261, -49.4], [262, -51.8], [266, -53.4], [268.4, -57]], "#1b2228", 0.5, 0.45);
  k += weichL([[[268.4, -56.4], [267.4, -60.4], [265.2, -64.6]]], "#ffffff", 0.6, 0.3, 0.4);
  const maul = [[280.4, -46.9], [276, -46.9], [268, -47.2], [261, -47.8], [256, -48.6], [253, -49.5], [251.8, -50.3]];
  k += `<path d="${H.spaltLinie(maul, 0.35, 0.6, 0.3)}" fill="#141a1f"/>` + L([maul.slice(0, 5).map((p) => [p[0], p[1] + 0.7])], "#ffffff", 0.35, 0.45);
  k += L([[[241, -76.2], [238.5, -76.6], [236, -76.5]]], "#20272d", 0.6, 0.6);
  s += H.vol("rumpf", 6, teil(R.d, RUECKEN, { innen: k, randA: 0.2, rw: 0.35 }), { tiefe: 3.5 });
  /* Rückenfinne: hoch, sichelförmig; vorn Fußverrundung, die freie Hinterecke rund über dem Rücken geschlossen */
  const fin = [[182, yo(182) + 1.4], [170, yo(170) + 0.1], [161, -85.6], [154, -89.5], [144, -96], [133, -102.5], [122, -107.6], [113, -110.4], [107.5, -111, 1], [109.5, -107.4], [113.5, -102], [116.4, -95.6], [117.4, -89.6], [116.2, -85.4], [112.8, -82.6], [106, yo(106) - 0.4], [97, yo(97) + 1.4], [100, -70, 1], [180, -72, 1]];
  let fi = weichF([[168, -84], [155, -90.4], [141, -98.6], [127, -105.8], [114, -110.2], [125, -105], [139, -97], [153, -88.6]], "#d2dee6", 0.5, 0.8);
  fi += weichF([[110, -108], [114, -101], [116.6, -93], [116, -86], [112, -84], [112.4, -93], [111, -101]], "#000", 0.3, 1.6);
  fi += H.narbenG([[146, -92, 18, 8, 4, 0.8, 0.2], [128, -100, 30, 6, 3, 0.8, -0.2]], "#dfe6ea", 0.35, 0.35);
  const finB = T.box(fin);
  s += `<g ${H.maskeOhne(R.d, 2.5, 1, [finB[0] - 4, finB[1] - 4, finB[2] + 4, finB[3] + 4])}>${H.vol("finne", 2.5, teil(G(fin), RUECKEN, { innen: fi, randD: G(fin.slice(2, 15), false), randA: 0.2, rw: 0.35 }), { tiefe: 3 })}</g>`;
  /* Brustflosse: Wurzel breit (~⅓ der Länge), Vorderkante konvex, Hinterkante leicht konkav, spitz; Ansatz bei 0,72
     der Körperhöhe, Wurzel im Flankengrau verschmolzen, zur Spitze dunkler */
  const BF = H.flosse([228, -44.5], [197, -18], [[0, 6.2, 6.4], [0.18, 7.4, 5.4], [0.42, 7, 3.8], [0.68, 5.2, 2.4], [0.88, 2.6, 1.1], [1, 0.3, 0.3]], -1.5);
  const bg = T.lg("delfinBF", [[0, "#8a939b"], [0.35, "#5f6973"], [1, "#3f474f"]], 228, -44, 198, -18, H.US);
  let fo = weichF(BF.vorn.slice(1, 5).concat(BF.vorn.slice(1, 5).reverse().map((p) => [p[0] + 1.8, p[1] - 1.2])), "#dbe6ed", 0.45, 0.6);
  fo += weichF(BF.hinten.slice(1, 5).concat(BF.hinten.slice(1, 5).reverse().map((p) => [p[0] - 1.5, p[1] + 1.6])), "#000", 0.3, 1);
  fo += weichF([[234, -49], [222, -48], [218, -42], [230, -40]], "#16202a", 0.35, 2);
  const bfB = T.box(BF.pts);
  s += `<g ${H.maskeR(229, -45.5, 1, 6.5, [bfB[0] - 3, bfB[1] - 3, bfB[2] + 3, bfB[3] + 3])}>${H.vol("flosse", 2, teil(G(BF.pts), bg, { innen: fo, randA: 0.2, rw: 0.35 }), { tiefe: 3 })}</g>`;
  s += FL.nah;
  s += H.walAuge(244, -58.2, 1.35, { winkel: -8, hell: "#dbe5ec" });
  return H.ende(s, [-23, -111, 281.6, -15], [222, -82, 284, -30]);
}

/* =====================================================================
   WEISSER HAI
   ===================================================================== */
/* RECHERCHE Weißer Hai (Carcharodon carcharias):
   4–6 m (hier 4,5 m), schwerer Spindelkörper, größte Höhe ~21 % an der ersten Rückenflosse. Schnauze kegelig,
   stumpf zugespitzt, Vorderende des Mauls (unterständig) ~8 % hinter der Spitze, etwa unter dem Auge; Mundwinkel
   ~14 %. Auge rund, schwarz (Iris sehr dunkelblau), ohne sichtbare Nickhaut. Oberkieferzähne breit dreieckig,
   gesägt, dicht stehend, ragen bei geschlossenem Maul über die Unterlippe; Zahnfleischrand über der Zahnbasis.
   Fünf LANGE Kiemenspalten, alle VOR dem Brustflossenansatz, die hinteren etwas kürzer; hinter jeder ein leicht
   erhabener Hautlappen. Lorenzinische Ampullen: feine dunkle Poren in Bogenreihen unter und vor dem Auge, dicht an
   der Schnauzenspitze und -unterseite. Brustflossen groß, sichelförmig (~18 % der Länge), Spitzen unterseits schwarz,
   schwarzer Achselfleck. Erste Rückenflosse groß, dreieckig (~12 % KL hoch), Ursprung über dem Innenrand der
   Brustflosse; zweite Rücken- und Afterflosse winzig, die Afterflosse etwas hinter der zweiten Rückenflosse.
   Schwanzstiel abgeflacht mit kräftigem Seitenkiel bis auf die Schwanzflosse; Schwanzflosse halbmondförmig, fast
   symmetrisch. Färbung: oben schiefer- bis bronzegrau (Rücken wärmer, Flanke kühler), scharfe, unregelmäßig GEZACKTE
   Grenze zum weißen Bauch (jedes Tier eigen), mit grauen Inseln im Weiß; Haut matt-samtig (Hautzähnchen), kaum Glanz;
   oft helle, dunkel verheilte Narben, Bissnarben von Artgenossen. */
function weisser_hai(T) {
  const H = mach(T), { G, L, teil, weichF, weichL, F, f } = H;
  const WEISS = "#f0eee8";
  const R = H.rumpf(
    [[450, -90], [448, -95.5], [443.5, -101.5], [435, -108.5], [421, -116], [402, -123.5], [378, -130.5], [350, -136.5], [320, -141.5], [290, -144], [258, -143.6], [224, -139.8], [190, -133], [156, -124], [128, -116.5], [108, -111.5], [92, -108.5], [76, -106], [60, -104]],
    [[450, -90], [449, -85.5], [446, -81.5], [440.5, -77.6], [432, -73.8], [424, -71.2], [418.5, -70], [412, -66.4], [404, -62.2], [392, -58.8], [378, -56.6], [362, -54.6], [340, -52.2], [315, -50.1], [285, -48.6], [255, -49.4], [225, -53.4], [195, -60.4], [165, -69.4], [140, -78.4], [120, -86], [104, -91.6], [92, -94.4], [76, -97], [60, -99]]);
  const P = R.P, yo = R.yo;
  const GRAU = T.lg("haiRuecken", [[0, "#67665f"], [0.4, "#5e6366"], [1, "#59636a"]], 0, -144, 0, -90, H.US);
  const FINNE = T.lg("haiFinne", [[0, "#5f6467"], [1, "#565d62"]], 300, -190, 250, -150, H.US);
  let s = "";
  /* ---- Rumpf ---- */
  let k = "";
  /* Bauchweiß: scharfe, unregelmäßig gezackte Grenze (Zackenabstand 3–18 cm, Höhe wechselnd), lange Finger unter der
     Rückenflosse und hinter der Brustflosse */
  const finger = [[322, 0.1, 4], [286, 0.08, 3], [252, 0.06, 3], [372, 0.045, 2.5]];
  const spitzen = [];
  for (let x = 450; x > 110; x -= 6 + T.rnd() * 16) spitzen.push([x, (T.rnd() < 0.55 ? -1 : 1) * (0.012 + T.rnd() * 0.05), 1.5 + T.rnd() * 4]);
  const ph1 = T.rnd() * 6, ph2 = T.rnd() * 6;
  const tg = (x) => {
    let t = 0.71 - 0.1 * Math.max(0, Math.min(1, (430 - x) / 60)) + 0.16 * Math.max(0, (200 - x) / 100);
    t += 0.012 * Math.sin(x / 11 + ph1) + 0.008 * Math.sin(x / 4.7 + ph2);
    for (const [sx, sh, sw] of spitzen.concat(finger.map(([fx, fh, fw]) => [fx, -fh, fw]))) if (Math.abs(x - sx) < sw) t += sh * (1 - Math.abs(x - sx) / sw);
    return t;
  };
  const gr = [];
  const stuetz = new Set(spitzen.concat(finger).map((q) => Math.round(q[0])));
  for (let x = 456; x > 98; x -= F ? 1.6 : 4) { const p = P(x, Math.min(1.2, tg(x))); gr.push(p); }
  for (const [sx] of spitzen.concat(finger)) { const p = P(sx, tg(sx)); gr.push(p); }
  gr.sort((a2, b2) => b2[0] - a2[0]);
  gr.push(P(96, 1.4));
  k += `<path d="${H.vieleck(gr.concat([[90, -40], [462, -40]]))}" fill="${WEISS}" filter="${H.weich(0.3, [85, -130, 464, -40])}"/>`;
  if (F) {
    /* graue Inseln im Weiß knapp unter der Grenze, weiße Sprenkel im Grau knapp darüber */
    let ins = "", spr = "";
    for (const [x, r] of [[364, 1.8], [341, 2.6], [303, 2.2], [270, 3], [229, 1.8], [199, 2.2]]) { const [px, py] = P(x, tg(x) + 0.045 + T.rnd() * 0.02); const q = []; for (let j = 0; j < 6; j++) { const a = j / 6 * 6.28 + T.rnd(); q.push([px + Math.cos(a) * r * (0.6 + T.rnd() * 0.6), py + Math.sin(a) * r * 0.45 * (0.6 + T.rnd() * 0.6)]); } ins += H.vieleck(q); }
    for (const [x, r] of [[352, 1.2], [314, 0.9], [276, 1.4], [240, 1]]) { const [px, py] = P(x, tg(x) - 0.04); spr += H.vieleck([[px - r, py], [px, py - r * 0.5], [px + r * 1.2, py + 0.2], [px, py + r * 0.5]]); }
    k += `<path d="${ins}" fill="#5c6468" opacity=".75" filter="${H.weich(0.25, [180, -110, 380, -50])}"/><path d="${spr}" fill="${WEISS}" opacity=".7"/>`;
  }
  /* Licht: ein Licht von oben – schmale Lichtkante am Rücken, EIN weicher Kernschatten, Reflex am Bauch; zum Stiel dunkler */
  k += weichF(R.band(90, 452, -0.06, 0.04), "#eef4f7", 0.3, 1.6);
  k += weichF(R.band(90, 448, 0.5, 0.95), "#1b2731", 0.25, 9);
  k += weichF(R.band(130, 420, 0.93, 1.06), "#ffffff", 0.2, 2);
  k += weichF(R.band(60, 190, -0.1, 1.1), "#1b2731", 0.12, 14);
  /* samtige Haut (Hautzähnchen): sehr feine, schwache Körnung */
  if (F) k += T.textur(R.d, T.rauschen("haut", { fx: 1.4, fy: 1.4, okt: 2, farbe: "#000000", staerke: 2, schwelle: 0.5 }), 0, 0.04, [60, -146, 452, -46]);
  /* Okklusion unter der Schnauze, Schatten der Brustflosse auf dem Bauch, der Rückenflosse auf der Flanke */
  k += weichF([[440, -82], [425, -76], [404, -68], [395, -62], [420, -66], [442, -76]], "#2a333a", 0.16, 2.4);
  k += weichF([[336, -62], [318, -52], [298, -48], [292, -56], [318, -62]], "#1b2731", 0.25, 4);
  k += weichF([[262, -143.5], [240, -144.5], [226, -139], [238, -136], [256, -137]], "#000", 0.3, 4);
  /* Kiemenspalten: fünf lange Spalten, die hinteren kürzer; davor Schatten, dahinter erhabener Hautlappen mit Lichtkante */
  const kiemen = [];
  for (let i = 0; i < 5; i++) {
    const x = 373 - i * 8.2 * (0.9 + T.rnd() * 0.2) + i * i * 0.25, kz = i < 3 ? 1 : i === 3 ? 0.92 : 0.85;
    const a = 0.26 + i * 0.015, b = a + (0.79 - i * 0.02 - a) * kz;
    kiemen.push([P(x + 2.4, a), P(x + 0.4, a + (b - a) * 0.3), P(x - 0.6, a + (b - a) * 0.62), P(x + 1.2, b)]);
  }
  if (F) {
    k += weichL(kiemen.map((z) => z.map((p) => [p[0] + 1.6, p[1]])), "#000", 2.6, 0.14, 1.2);
    k += weichL(kiemen.map((z) => z.map((p) => [p[0] - 2.2, p[1]])), "#000", 2.6, 0.1, 1.4);
    k += L(kiemen.map((z) => z.map((p) => [p[0] - 0.7, p[1]])), "#e9eef1", 0.5, 0.25);
  }
  if (F) k += `<path d="${kiemen.map((z) => H.vieleck(H.saum(H.dicht(z, false, 5).map((p) => [p[0], p[1]]), -0.45, 0.45))).join("")}" fill="#15191c" opacity=".5"/>`;
  else k += L(kiemen, "#15191c", 1, 0.6);
  /* Seitenkiel am Schwanzstiel */
  k += weichL([[P(124, 0.49), P(104, 0.48), P(86, 0.47), [66, -102.6]]], "#eef3f6", 0.9, 0.2, 0.6);
  k += weichL([[P(124, 0.58), P(104, 0.58), P(86, 0.58), [66, -100]]], "#000", 1.8, 0.2, 1);
  /* Narben: deutlich, ungleich breit, dunkel verheilter Rand; eine Bissnarbe als Halbbogen kurzer Striche */
  k += H.narbenG([[330, -118, -8, 24, 2, 2.2, 0.3], [262, -114, 10, 30, 2, 2.4, -0.2], [206, -104, -4, 18, 1, 1.6, 0.3]], "#d9dfe2", 1.6, 0.42, { rand: "#30363a" });
  if (F) {
    const bis = [];
    for (let i = 0; i < 8; i++) { const a = Math.PI * (0.08 + i * 0.12), cx = 228, cy = -116; bis.push([cx + Math.cos(a) * 15, cy + Math.sin(a) * 9, (a * 180 / Math.PI) + 70 + (T.rnd() - 0.5) * 25, 4 + T.rnd() * 2, 1, 1, 0]); }
    k += H.narbenG(bis, "#d0d7da", 1.3, 0.3);
  }
  /* Lorenzinische Ampullen: feine Poren in Bogenreihen unter und vor dem Auge, dicht an der Schnauzenspitze,
     im Weiß nur an der Schnauzenunterseite */
  if (F) {
    let po = "";
    const pore = (px, py) => { if (Math.hypot(px - 414, py + 99) > 5) po += `M${f(px)} ${f(py)}h.01`; };
    for (let r = 0; r < 3; r++) for (let i = 0; i < 16; i++) { const u = i / 15, x = 400 + u * 40, t = 0.52 + r * 0.05 - u * u * 0.18 + (T.rnd() - 0.5) * 0.015; const [px, py] = P(x, t); pore(px, py); }
    for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++) { const u = i / 8, x = 418 + u * 18, t = 0.3 + r * 0.05 + u * 0.06 + (T.rnd() - 0.5) * 0.015; const [px, py] = P(x, t); pore(px, py); }
    for (let i = 0; i < 44; i++) { const x = 438 + T.rnd() * 12, t = 0.22 + T.rnd() * 0.66; const [px, py] = P(x, t); pore(px, py); }
    for (let i = 0; i < 18; i++) { const x = 426 + T.rnd() * 18, t = 0.8 + T.rnd() * 0.14; const [px, py] = P(x, t); pore(px, py); }
    k += `<path d="${po}" stroke="#14191c" stroke-width=".4" stroke-linecap="round" stroke-opacity=".3" fill="none"/>`;
  }
  /* Nasenloch (Unterseite der Schnauze, von der Seite als Schlitz) */
  k += weichL([[[442, -82.6], [438.5, -81.6], [435, -81.8]]], "#1a1e22", 1.1, 0.45, 0.3);
  /* Maul fast geschlossen: Oberkieferzähne breit dreieckig, dicht, vorn hoch, nach hinten kleiner, leicht nach hinten
     geneigt, Spitzen durchscheinend, vorn gesägt; Zahnfleisch über der Basis; Mundwinkel flach (x ≈ 388) */
  const U = [[419, -70.2], [411, -69.8], [403, -70.1], [396, -70.9], [391, -71.9], [388, -72.9]];
  const Lu = U.map((p, i) => [p[0] - 0.3, p[1] + 1.4 - i * 0.2]);
  k += `<path d="${G(U.concat(Lu.slice().reverse()))}" fill="#1e0f0d"/>`;
  const zd = H.dicht(U, false, 10);
  let zg = "", zs = "", sg = "";
  let u = 0.02, i = 0;
  while (u < 0.97) {
    const p = zd[Math.min(zd.length - 1, Math.round(u * (zd.length - 1)))];
    const h = (4.3 - 2.7 * u) * (0.9 + T.rnd() * 0.15), b = 3.0 - 1.2 * u, x = p[0], y = p[1] + 0.3, kp = b * (0.06 + T.rnd() * 0.08);
    zg += `M${f(x + b / 2)} ${f(y)}C${f(x + b * 0.36)} ${f(y + h * 0.5)} ${f(x + b * 0.04 - kp)} ${f(y + h * 0.85)} ${f(x - b * 0.08 - kp)} ${f(y + h)}C${f(x - b * 0.22 - kp)} ${f(y + h * 0.7)} ${f(x - b * 0.42)} ${f(y + h * 0.35)} ${f(x - b / 2)} ${f(y)}Z`;
    zs += `M${f(x + b * 0.18)} ${f(y + h * 0.62)}L${f(x - b * 0.08 - kp)} ${f(y + h)}L${f(x - b * 0.2)} ${f(y + h * 0.6)}Z`;
    if (F && i < 3) for (let j = 1; j < 5; j++) { const tt = j / 5; sg += `M${f(x + b / 2 - b * 0.55 * tt)} ${f(y + h * tt * 0.95)}l.25 .1`; }
    u += (b * (0.68 + T.rnd() * 0.1)) / 31; i++;
  }
  k += `<path d="${zg}" fill="#f5f3ec" stroke="#6b6253" stroke-width=".16" stroke-opacity=".5"/>`;
  k += `<path d="${zs}" fill="#d9d6cc" opacity=".8"/>`;
  if (sg) k += `<path d="${sg}" stroke="#7a705e" stroke-width=".14" fill="none"/>`;
  /* Zahnfleischrand und Oberlippe über der Zahnbasis, Lippenfurche hinter dem Mundwinkel */
  k += `<path d="${G(U.concat(U.slice().reverse().map((p) => [p[0] + 0.3, p[1] - 0.9])))}" fill="#8a6d6a" opacity=".6"/>`;
  k += `<path d="${G(U.map((p) => [p[0], p[1] - 0.5]).concat(U.slice().reverse().map((p) => [p[0] + 0.4, p[1] - 1.8])))}" fill="${WEISS}"/>`;
  k += L([U.map((p) => [p[0], p[1] - 0.5])], "#3b3f42", 0.45, 0.5) + weichL([[[388, -72.9], [383.5, -75.6], [379, -78]], [[388.5, -71.6], [384, -72.8]]], "#3b4146", 0.8, 0.5, 0.4);
  k += weichL([Lu.map((p) => [p[0], p[1] + 2.2])], "#3b4146", 1.2, 0.18, 0.7);
  s += H.vol("rumpf", 16, teil(R.d, GRAU, { innen: k, randA: 0.2, rw: 0.45 }), { tiefe: 3.5 });
  /* Schwanzflosse (halbmondförmig, fast symmetrisch), Wurzel aus dem Stiel; Vorderkanten mit Lichtgrat, Hinterrand dunkel */
  const sf = [[100, -110], [80, -113], [64, -124], [48, -137], [32, -151], [18, -164], [8, -172], [2, -175.5, 1], [8, -166], [16, -152], [26, -136], [36, -120], [43, -108], [46.5, -101.5, 1], [43, -93], [35, -80], [26, -66], [17, -53], [10, -44.5, 1], [22, -49], [38, -61], [56, -75], [72, -86], [82, -91], [100, -93]];
  let si = weichL([[[80, -112.5], [62, -124.6], [44, -139.6], [26, -155.6], [8, -171.2]], [[80, -91.6], [60, -78.6], [40, -64.6], [22, -50.6]]], "#e3e9ec", 2.2, 0.35, 0.8);
  si += L([[[3, -174], [9, -164], [17, -150], [27, -134], [37, -118], [44, -106]], [[45, -97], [38, -84], [29, -70], [20, -57], [12, -46]]], "#3d4448", 0.6, 0.6);
  si += weichF([[100, -112], [80, -110], [66, -103], [80, -94], [100, -92]], "#1b2731", 0.2, 4);
  const sfB = T.box(sf);
  s += `<g ${H.maskeX(102, 88, [sfB[0] - 4, sfB[1] - 4, sfB[2] + 6, sfB[3] + 4])}>${H.vol("schwanz", 3, teil(G(sf), "#5a6267", { innen: si, randD: G(sf.slice(1, -1), false), randA: 0.2, rw: 0.45 }), { tiefe: 3 })}</g>`;
  /* erste Rückenflosse: dreieckig, Spitze leicht gerundet, Hinterrand konkav; Fußverrundung vorn, Basis wächst aus
     dem Rücken; Vorderkante mit rundem Lichtgrat, Hinterkante als dunkler Saum */
  const r1 = [[334, yo(334) + 1.6], [323, yo(323) + 0.1], [315, yo(315) - 2.2], [309, -149.4], [300, -161.8], [290, -174.4], [280, -185.2], [272.5, -192], [268, -194.4], [265, -195], [262.6, -193.6], [262, -187], [259.5, -176.2], [254.5, -164.5], [248, -154.2], [242.5, -147.4], [239.5, -145.2, 1], [245, -143.9], [252, yo(252) + 0.2], [258, -128, 1], [326, -128, 1]];
  let ri = weichL([[[310, -149], [301, -162], [291, -175], [281, -186], [272, -192.6]]], "#d4dce1", 2.6, 0.4, 0.9);
  ri += L([[[262.4, -192.6], [261.6, -184], [258.8, -174], [253.8, -163.4], [247.6, -153.6], [242.4, -147.6], [239, -145.6]]], "#3d4448", 0.6, 0.6);
  ri += weichF([[263, -190], [261, -180], [256, -167], [249, -156], [244, -149], [252, -151], [257, -163], [261, -177]], "#000", 0.3, 2.4);
  ri += H.narbenG([[292, -168, 60, 14, 2, 1.4, 0.2]], "#d7dde0", 1, 0.45, { rand: "#2b3034" });
  const r1B = T.box(r1);
  s += `<g ${H.maskeOhne(R.d, 3, 1.4, [r1B[0] - 6, r1B[1] - 6, r1B[2] + 6, r1B[3] + 6])}>${H.vol("finne", 4, teil(G(r1), FINNE, { innen: ri, randD: G(r1.slice(2, 17), false), randA: 0.2, rw: 0.45 }), { tiefe: 3 })}</g>`;
  /* zweite Rückenflosse und Afterflosse: winzig; die Afterflosse etwas weiter hinten */
  const kl = (pts, farbe, licht, name) => H.vol(name, 1.2, teil(G(pts), farbe, { innen: weichF(licht, "#dfe5e8", 0.35, 0.6) + weichF(pts.slice(-3).concat([[pts[0][0] + 6, pts[0][1] + 3]]), "#000", 0.25, 1.4), randA: 0.2, rw: 0.35 }), { tiefe: 2.5 });
  s += kl([[126, -114.5], [118, -121], [112, -123.6], [108.6, -122.6], [108, -117], [105, -112.2], [116, -111]], "#5c6266", [[124, -116], [116, -121], [111, -122.6], [116, -119]], "rf2");
  s += kl([[117.5, -88.6], [111.5, -83.4], [106.5, -81], [103.9, -81.6], [103.5, -85.4], [101.1, -90.6], [110, -91]], "#6a7277", [[116, -88], [110, -84], [106, -82.2], [109, -85]], "af");
  /* Bauchflosse */
  s += kl([[208, -59.6], [198, -50], [186, -41.6], [176, -36.4], [170.5, -36.6, 1], [173, -42], [176.5, -50], [184, -62]], "#788086", [[205, -56], [190, -46], [176, -38.4], [184, -46], [196, -55]], "bauchfl");
  /* Brustflosse: Wurzel 10 % im Rumpf (Verlauf aus dem Körperton), Achselfleck; Spitze unterseits schwarz durchscheinend */
  const bf = [[350, -76], [343, -70], [339, -59], [331, -46], [319, -33], [305, -22.4], [292, -15.4], [283, -12.6, 1], [287.6, -17.4], [294, -25.6], [300.5, -35.6], [307.5, -46.6], [314.5, -58], [321, -67], [326, -76], [338, -80]];
  let bi = weichL([[[338, -56], [328, -43], [314, -30.4], [298, -19.4], [286, -13.6]]], "#dbe3e8", 2.4, 0.42, 0.8);
  bi += weichF([[304, -24], [292, -16], [283.4, -12.8], [289, -19], [298, -29], [308, -32]], "#0b0e10", 0.8, 1.6);
  bi += L([[[285, -13.6], [290, -19.6], [297, -28], [304, -38.6], [311, -50], [317.6, -61], [322, -68]]], "#3d4448", 0.6, 0.55);
  bi += weichF([[286, -16], [296, -30], [305, -44], [313, -56], [320, -66], [313, -64], [303, -50], [293, -34]], "#000", 0.3, 2.2);
  const bfB = T.box(bf);
  s += `<path d="${G([[326, -70], [319.6, -65], [315.6, -61.6], [318.6, -67.6]])}" fill="#0b0d0f" opacity=".55" filter="${H.weich(1, [312, -73, 329, -59])}"/>`;
  s += `<g ${H.maskeR(340, -78, 4, 14, [bfB[0] - 4, bfB[1] - 4, bfB[2] + 4, bfB[3] + 4])}>${H.vol("brustfl", 3, teil(G(bf), "#5b6368", { innen: bi, randA: 0.2, rw: 0.45 }), { tiefe: 3 })}</g>`;
  /* Auge in einer Höhle, Wulst darüber wirft Schatten; schwarz mit sehr dunkelblauem Irisrand; weiches Glanzfenster */
  const ax = 414, ay = -99, ar = 2.4;
  s += `<ellipse cx="${ax}" cy="${f(ay - 0.6)}" rx="${f(ar * 2.6)}" ry="${f(ar * 2.1)}" fill="${T.rg("haiHoehle", [[0, "#000", 0.55], [0.55, "#000", 0.2], [1, "#000", 0]])}"/>`;
  s += weichF([[ax - ar * 2.2, ay - ar * 1.5], [ax, ay - ar * 2.3], [ax + ar * 2.2, ay - ar * 1.4], [ax + ar * 1.4, ay - ar * 0.9], [ax - ar * 1.4, ay - ar * 0.9]], "#dfe6ea", 0.22, 0.8);
  s += `<circle cx="${ax}" cy="${ay}" r="${f(ar * 1.14)}" fill="#2b3236" filter="${H.weich(0.25, [ax - 3, ay - 3, ax + 3, ay + 3])}"/>`;
  s += `<circle cx="${ax}" cy="${ay}" r="${ar}" fill="${T.rg("haiAuge", [[0, "#030407"], [0.8, "#06090e"], [0.88, "#1a2a3a"], [1, "#0a0e14"]], 0.5, 0.5, 0.5)}"/>`;
  s += `<path d="M${f(ax - ar)} ${f(ay - ar * 0.1)}A${f(ar)} ${f(ar)} 0 0 1 ${f(ax + ar)} ${f(ay - ar * 0.1)}" fill="${T.lg("haiLid", [[0, "#000", 0.75], [1, "#000", 0]])}"/>`;
  s += `<ellipse cx="${f(ax + ar * 0.36)}" cy="${f(ay - ar * 0.34)}" rx="${f(ar * 0.3)}" ry="${f(ar * 0.2)}" fill="#fff" opacity=".6" filter="${H.weich(0.12, [ax - 1, ay - 2, ax + 2, ay])}"/>`;
  s += `<path d="M${f(ax - ar * 0.9)} ${f(ay + ar * 0.55)}A${f(ar * 1.05)} ${f(ar * 1.05)} 0 0 0 ${f(ax + ar * 0.9)} ${f(ay + ar * 0.55)}" fill="none" stroke="#b9cad6" stroke-width=".3" stroke-opacity=".45"/>`;
  return H.ende(s, [2, -195, 450, -12.6], [372, -136, 452, -56]);
}

/* =====================================================================
   BUCKELWAL
   ===================================================================== */
/* RECHERCHE Buckelwal (Megaptera novaeangliae):
   12–16 m (hier 14 m), massig und gedrungen (Körperhöhe ~21–24 % der Länge); Kopf flach, von der Seite vorn
   breit-stumpf gerundet, ~¼ der Länge; Unterkiefer etwas vorstehend, an seinem Ende ein runder Kinnhöcker mit
   Seepocken. Oberseite der Schnauze, Oberkieferrand und Unterkiefer mit faustgroßen KNOTEN (Tuberkel, je ein
   Tasthaar), auf der Schnauze brechen sie die Kontur. Maullinie stark gewölbt, Auge knapp hinter/über dem Mundwinkel.
   14–35 breite KEHLFURCHEN vom Kinn bis zum Nabel (~½ der Länge), zum Kinn zusammenlaufend, teils gegabelt; dazwischen
   oft weiß. BRUSTFLOSSEN riesig (~⅓ der Länge), schmal, leicht S-förmig, größte Breite bei ~¼ der Länge, Vorderkante
   mit unregelmäßigen großen Höckern, im Atlantik meist weiß. Kleine Rückenfinne auf einem breiten Buckel bei ~⅔ der
   Länge, dahinter eine Höckerreihe („Knöchel“) IN der Rückenkontur bis zur Fluke. Fluke ~⅓ der Länge breit, waagrecht,
   Hinterrand gewellt-gezackt, Unterseite individuell schwarz-weiß. Oberseite schwarz bis dunkelgrau, Bauch/Kehle weiß
   gefleckt. SEEPOCKEN (Coronula, grau-weiß) an Kinn, Kehle, Flossenkanten, Genitalregion; helle Orca-Harkennarben. */
function buckelwal(T) {
  const H = mach(T, 0), { G, L, teil, weichF, weichL, F, f } = H;
  const DUNKEL = "#22272d", WEISS = "#e6e7e2";
  /* Rückenlinie mit breitem Buckel unter der Finne, Knoten auf der Schnauze, Knöchelreihe auf dem Schwanzstiel */
  const oben = H.buckel([[1401, -226], [1399.5, -231.5], [1395, -235.6], [1384, -240.5], [1352, -250], [1302, -262], [1242, -274], [1182, -285], [1124, -294], [1092, -301], [1074, -305], [1040, -313], [980, -326], [910, -337], [830, -345], [750, -349], [680, -350], [640, -351], [600, -353], [560, -357], [522, -360], [490, -357], [452, -349], [410, -337], [370, -323], [330, -308], [280, -289], [230, -271], [180, -256], [130, -245], [90, -239], [60, -236], [32, -232], [8, -229.5]],
    [[1350, 2, 6], [1300, 2.6, 7], [1232, 3, 8], [1160, 2.6, 8], [1100, 2, 7], [434, 5, 15], [396, 4.6, 14], [358, 4.2, 13], [320, 3.8, 12], [282, 3.4, 12], [244, 3, 11], [206, 2.6, 10]]);
  const R = H.rumpf(oben,
    [[1401, -226], [1402.5, -216], [1400, -205], [1393, -196], [1382, -188], [1362, -176], [1332, -158], [1292, -136], [1242, -113], [1182, -90], [1112, -70], [1040, -56], [970, -49], [910, -49], [850, -55], [780, -67], [700, -85], [620, -108], [540, -132], [460, -155], [400, -169], [340, -182], [280, -192], [220, -200], [160, -206], [116, -210], [84, -213], [60, -216], [32, -221], [8, -226.5]]);
  const P = R.P;
  /* Fluke: waagrecht in leichter Aufsicht, ferne Hälfte kurz; Hinterrand gewellt-gezackt (nur nah deutlich) */
  const FL = H.fluke({ x0: 46, y0: -228, L: 150, S: 230, k: 0.2, fern: 0.55, hell: "#3c4650", farbe: "#20262c", dunkel: "#15191d", zacken: 4, zN: 10, weich: 3 });
  let s = FL.fern;
  let k = "";
  /* weiße, gefleckte Kehle/Bauch: Kehlfurchenfeld vom Kinn bis zum Nabel, Grenze unregelmäßig */
  const bauch = [[1392, 0.84], [1360, 0.8], [1320, 0.76], [1280, 0.73], [1240, 0.71], [1200, 0.68], [1160, 0.67], [1120, 0.64], [1080, 0.65], [1040, 0.62], [1000, 0.63], [960, 0.6], [920, 0.62], [880, 0.64], [840, 0.66], [800, 0.7], [760, 0.75], [720, 0.8], [680, 0.87], [650, 0.95], [630, 1.2]];
  k += `<path d="${G(bauch.map((q) => P(q[0], q[1])).concat([[600, -30, 1], [1420, -30, 1]]))}" fill="${WEISS}" filter="${H.weich(2, [590, -280, 1420, -30])}"/>`;
  /* dunkle Flecken im Weiß: unregelmäßig gezackt, mittlerer Kontrast */
  {
    let d = "";
    for (const [x, t, r] of [[1300, 0.86, 18], [1210, 0.8, 24], [1130, 0.88, 14], [1020, 0.76, 22], [940, 0.84, 13], [860, 0.9, 18], [770, 0.88, 11], [1080, 0.93, 9], [990, 0.9, 8]]) {
      const [px, py] = P(x, t), q = [];
      for (let j = 0; j < 9; j++) { const a = j / 9 * 6.28, rr = r * (0.55 + T.rnd() * 0.6) * (j % 2 ? 1 : 0.75); q.push([px + Math.cos(a) * rr, py + Math.sin(a) * rr * 0.4]); }
      d += H.vieleck(q);
    }
    k += `<path d="${d}" fill="${DUNKEL}" opacity=".5" filter="${H.weich(0.8, [700, -260, 1400, -40])}"/>`;
  }
  /* Kehlfurchen: zum Kinn zusammenlaufend, nach hinten weiter, Enden gestaffelt, einige gegabelt;
     dunkle Rinne mit breitem hellem Grat; laufen hinter der Brustflossenwurzel weiter */
  const furchen = [], nF = F ? 13 : 7;
  for (let i = 0; i < nF; i++) {
    const tr = 0.6 + i * (0.38 / (nF - 1)), tc = 0.86 + i * (0.13 / (nF - 1)), xe = 760 + (T.rnd() - 0.5) * 80 + i * 8;
    const z = [];
    for (let j = 0; j <= 9; j++) { const u = j / 9, x = 1378 - (1378 - xe) * u; z.push(P(x, tc + (tr - tc) * Math.pow(u, 0.7) + (T.rnd() - 0.5) * 0.006)); }
    furchen.push(z);
    if (F && (i === 3 || i === 7 || i === 10)) { const g = z.slice(5).map((p, j) => [p[0], p[1] + j * 2.4]); furchen.push(g); }
  }
  k += L(furchen, "#2d3238", 2.4, 0.3) + (F ? L(furchen.map((z) => z.map((p) => [p[0], p[1] + 2.6])), "#ffffff", 2.4, 0.3) : "");
  /* Licht von oben: Himmelslicht, EIN weicher Kernschatten, Reflexlicht am Bauch */
  k += weichF(R.band(60, 1398, -0.05, 0.28), "#c4d4e0", 0.1, 16);
  k += weichF(R.band(70, 1390, 0.5, 0.95), "#0d151d", 0.28, 22);
  k += weichF(R.band(420, 1360, 0.95, 1.05), "#cfd8dd", 0.3, 5);
  /* Glanz: schmale, unterbrochene Linien zwischen den Knoten auf der Kopfoberseite, Rücken, Buckel */
  k += H.glanz(R, 1060, 1380, 0.07, 4, 0.01, 0.4, 2.5);
  k += H.glanz(R, 640, 1000, 0.05, 3, 0.008, 0.35, 3);
  k += H.glanz(R, 300, 600, 0.06, 2, 0.009, 0.3, 3);
  /* Fluke-Ansatz: Kante am Stiel */
  k += weichF([[96, -238], [64, -236], [46, -230], [46, -224], [64, -217], [96, -214], [80, -226]], "#000", 0.35, 8);
  /* Narben: Orca-Harken (3–4 parallele weiße Linien) auf dem Schwanzstiel; einzelne Kratzer */
  k += H.narbenG([[300, -262, -12, 46, 4, 4.5, 0.3], [180, -236, -8, 36, 3, 4, -0.2], [820, -290, -6, 60, 3, 4, 0.3], [1180, -236, 4, 34, 2, 3, 0.2]], "#d5dade", 2.2, 0.5);
  /* Maullinie (stark gewölbt) mit Lippenlicht; Unterkieferwulst; Blasloch mit Spritzschutz */
  const maul = [[1396, -233], [1362, -242], [1306, -251], [1240, -256], [1176, -255], [1118, -248], [1078, -236], [1054, -222], [1046, -212]];
  k += `<path d="${H.spaltLinie(maul, 2.2, 3.6, 1.6)}" fill="#0b0e11" opacity=".9"/>` + L([maul.slice(0, 7).map((p) => [p[0], p[1] + 3.4])], "#c8d6df", 1.6, 0.32);
  k += weichF([[1390, -228], [1300, -246], [1200, -250], [1120, -242], [1080, -226], [1110, -224], [1200, -236], [1300, -236]], "#000", 0.2, 8);
  k += weichL([[[1100, -307], [1086, -309], [1070, -308]]], "#000", 3, 0.6, 1) + weichL([[[1108, -313], [1090, -315], [1068, -313]]], "#e4edf2", 3, 0.35, 1.5);
  /* Knoten: unregelmäßige Reihe auf dem Oberkiefer über der Lippe, auf der Schnauzenoberseite, verstreut am Unterkiefer */
  const kn = [];
  const mY = (x) => maul.reduce((a, p) => (Math.abs(p[0] - x) < Math.abs(a[0] - x) ? p : a))[1];
  for (let x = 1380; x > 1080; x -= 22 + T.rnd() * 18) kn.push([x + (T.rnd() - 0.5) * 6, mY(x) - 11 - T.rnd() * 7, 3 + T.rnd() * 3]);
  for (let x = 1372; x > 1110; x -= 26 + T.rnd() * 20) kn.push([x, R.yo(x) + 8 + T.rnd() * 6, 3.2 + T.rnd() * 2.6]);
  for (let i = 0; i < 10; i++) { const x = 1370 - i * 30 + (T.rnd() - 0.5) * 12, [px, py] = P(x, 0.66 + T.rnd() * 0.12); kn.push([px, py, 3 + T.rnd() * 3]); }
  k += H.knoten(F ? kn : kn.filter((q, i) => i % 2 === 0));
  /* Seepocken: Kinnhöcker (dicht), Kehle vorn, Genitalregion */
  const sp = [];
  const haufen = (n, x, y, rx, ry, r0) => { for (let i = 0; i < n; i++) sp.push([x + (T.rnd() - 0.5) * 2 * rx, y + (T.rnd() - 0.5) * 2 * ry, r0 * (0.6 + T.rnd() * 0.6)]); };
  haufen(F ? 13 : 5, 1392, -204, 8, 10, 4.6); haufen(F ? 6 : 3, 1356, -178, 14, 8, 4); haufen(F ? 5 : 2, 560, -140, 16, 6, 3.6);
  k += H.seepocken(sp);
  s += H.vol("rumpf", 40, teil(R.d, DUNKEL, { innen: k, randA: 0.25, rw: 1.3 }), { tiefe: 4 });
  /* Rückenfinne: klein, oben auf dem Buckel (Vorderkante bei ~65 % der Länge ab Schnauze) */
  const yo = R.yo;
  const rf = [[532, yo(532) + 2], [516, yo(516) - 1], [503, -369], [490, -379], [478, -385], [471, -383, 1], [472, -375], [469, -365], [460, yo(460) - 2], [448, yo(448) + 2], [450, -330, 1], [530, -330, 1]];
  const rfB = T.box(rf);
  s += `<g ${H.maskeOhne(R.d, 4, 2, [rfB[0] - 6, rfB[1] - 6, rfB[2] + 6, rfB[3] + 6])}>${H.vol("finne", 6, teil(G(rf), DUNKEL, { innen: weichF([[516, -362], [502, -372], [488, -381], [478, -385], [492, -376], [506, -366]], "#b4c4d0", 0.4, 2) + weichF([[476, -380], [472, -368], [466, -358], [472, -360]], "#000", 0.35, 3), randD: G(rf.slice(1, 9), false), randA: 0.25, rw: 1.2 }), { tiefe: 3 })}</g>`;
  /* Brustflosse: ~⅓ der Länge, leicht S-förmig, größte Breite bei ¼, Vorderkante (unten) mit unregelmäßigen Höckern,
     Hinterkante leicht gewellt; Wurzel wächst aus dem dunklen Körper (Schulter), Achselschatten */
  const B = [992, -132], E = [562, 40];
  const hoecker = [[0.08, 9], [0.17, 8.5], [0.26, 8], [0.34, 7], [0.43, 7], [0.51, 6], [0.6, 5.5], [0.67, 5], [0.75, 4.5], [0.82, 4], [0.88, 3]].map(([u, a]) => [u + (T.rnd() - 0.5) * 0.03, a * (0.8 + T.rnd() * 0.4)]);
  const prof = [];
  for (let i = 0; i <= 44; i++) {
    const u = i / 44;
    const w = u < 0.27 ? 64 + (u / 0.27) * 32 : 96 * Math.pow(1 - (u - 0.27) / 0.73, 0.7) + 4 * (1 - u);
    const h = hoecker.reduce((a, [hu, ha]) => a + ha * Math.max(0, 1 - Math.abs(u - hu) / 0.035), 0);
    prof.push([u, w * 0.42 + h, w * 0.58 + 2 * Math.sin(u * 14) * (u > 0.2 ? 1 : 0)]);
  }
  const BF = H.flosse(B, E, prof, -14);
  let fo = "";
  fo += weichF(BF.hinten.slice(4, 40).concat(BF.hinten.slice(4, 40).reverse().map((p) => [p[0] - BF.n[0] * 14, p[1] - BF.n[1] * 14])), "#000", 0.16, 6);
  fo += weichF(BF.vorn.slice(2, 40).map((p) => [p[0] - BF.n[0] * 10, p[1] - BF.n[1] * 10]).concat(BF.vorn.slice(2, 40).reverse()), "#ffffff", 0.45, 4);
  fo += weichF([[1010, -168], [960, -158], [930, -118], [970, -98], [1000, -116]], DUNKEL, 0.45, 18);
  if (F) fo += [[0.24, 0.2, 24, 7, -24], [0.3, -0.12, 12, 4, -22], [0.36, 0.26, 9, 3, -20]].map(([u, v, rx, ry, w]) => { const cx = B[0] + (E[0] - B[0]) * u + BF.n[0] * v * 80, cy = B[1] + (E[1] - B[1]) * u + BF.n[1] * v * 80; return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${rx}" ry="${ry}" transform="rotate(${w} ${f(cx)} ${f(cy)})" fill="#3c454c" opacity=".35" filter="${H.weich(1.5, [cx - rx - 2, cy - rx - 2, cx + rx + 2, cy + rx + 2])}"/>`; }).join("");
  const sp2 = [];
  for (let i = 0; i < (F ? 7 : 3); i++) { const u = 0.5 + i * 0.055, p = BF.vorn[Math.round(u * 44)]; sp2.push([p[0] + BF.n[0] * 4, p[1] + BF.n[1] * 4, 3.2 + T.rnd() * 1.6]); }
  const flG = T.lg("bwFlosse", [[0, "#e4e7e5"], [1, "#c3c8c9"]], B[0] + 30, B[1] + 60, B[0] + 50, B[1] - 20, H.US);
  const bfB = T.box(BF.pts);
  s += weichF([[1000, -150], [960, -150], [930, -110], [980, -100]], "#000", 0.35, 10);
  s += `<g ${H.maskeR(1000, -140, 20, 75, [bfB[0] - 10, bfB[1] - 10, bfB[2] + 10, bfB[3] + 10])}>${H.vol("flosse", 9, teil(G(BF.pts), flG, { innen: fo + H.seepocken(sp2), randA: 0.25, rw: 1.1 }), { tiefe: 3 })}</g>`;
  s += FL.nah;
  /* Auge knapp über/hinter dem Mundwinkel */
  s += H.walAuge(1028, -229, 5.2, { winkel: -10, hell: "#b4c4d0" });
  return H.ende(s, [-94, -385, 1402.5, 48], [1010, -330, 1404, -150]);
}

/* =====================================================================
   HAMMERHAI (GROSSER HAMMERHAI)
   ===================================================================== */
/* RECHERCHE Großer Hammerhai (Sphyrna mokarran):
   3,5–6 m (hier 4,7 m). Kopf zum „Hammer“ (Cephalofoil) verbreitert, Breite ~25 % der Länge; Vorderrand fast
   GERADE mit kleiner Kerbe in der Mitte (Unterschied zu anderen Hammerhaien); Flügel außen schmaler (Tiefe ~40 % der
   Mitte), Hinterränder nach hinten-innen geschwungen, organisch in die Kopfseiten übergehend; Augen an den
   Seitenenden, Nasenfurchen am Vorderrand. Mund klein, bogenförmig, unter dem Kopf. Kiemenspalten bei ~13–20 % der
   Länge, die letzte über dem Brustflossenansatz (~20 %). Erste Rückenflosse SEHR hoch und sichelförmig, Ursprung bei
   ~27 %; zweite Rückenflosse relativ groß mit tief konkavem Hinterrand und langer freier Hinterspitze, Afterflosse
   ebenso; Bauchflossen sichelförmig. Schwanzflosse heterozerk: langer oberer Lappen (~25 % der Länge) mit
   Subterminalkerbe und Endlappen, kürzerer, spitzer unterer Lappen. Färbung oben graubraun bis olivgrau (bronze),
   unten weiß. Darstellung: Körper seitlich, Hammer nur leicht gedreht (6°) und 24° von oben gesehen, damit er als
   schräger Querbalken lesbar ist; dazu oben ein schmaler Streifen Rückenfläche am Körper. */
function hammerhai(T) {
  const H = mach(T), { G, L, teil, weichF, weichL, F, f } = H;
  const GRAU = T.lg("hhKoerper", [[0, "#727166"], [0.35, "#6b716c"], [1, "#666c68"]], 0, -131, 0, -90, H.US), WEISS = "#ecebe5";
  const FINNE = T.lg("hhFinne", [[0, "#71726a"], [1, "#686e69"]], 330, -200, 280, -140, H.US);
  const R = H.rumpf(
    [[458, -101], [457, -108], [452, -113], [440, -116.5], [424, -118.6], [404, -120.4], [390, -121.8], [370, -124.5], [346, -127.5], [318, -129.8], [288, -130.6], [256, -129], [222, -124], [188, -117], [154, -109], [124, -102], [104, -98.5], [92, -97], [80, -96.5]],
    [[458, -101], [457, -94], [452, -89.5], [440, -86.6], [424, -84.4], [404, -82], [390, -80], [370, -77], [346, -74], [318, -72], [288, -71], [256, -72], [222, -75], [188, -79.5], [154, -84], [126, -87.5], [106, -90], [92, -91], [80, -91.5]]);
  const P = R.P, yo = R.yo;
  let s = "";
  /* ---- Rumpf ---- */
  let k = "";
  const grenze = [[430, 0.62], [400, 0.62], [380, 0.63], [360, 0.62], [330, 0.63], [300, 0.65], [270, 0.67], [240, 0.69], [210, 0.71], [180, 0.75], [150, 0.8], [125, 0.88], [104, 1.0], [96, 1.3]];
  k += `<path d="${G(grenze.map((q) => P(q[0], q[1])).concat([[86, -40, 1], [440, -40, 1]]))}" fill="${WEISS}" filter="${H.weich(1.4, [80, -120, 442, -40])}"/>`;
  /* schmaler Streifen Rückenfläche (leicht von oben gesehen), heller; EIN Kernschatten; Reflex am Bauch */
  k += weichF(R.band(84, 412, -0.08, 0.06), "#aaa99c", 0.35, 2);
  k += weichF(R.band(84, 412, 0.05, 0.075), "#3d4039", 0.25, 1.2);
  k += weichF(R.band(84, 410, 0.5, 0.95), "#1e2622", 0.22, 6);
  k += weichF(R.band(130, 400, 0.93, 1.06), "#ffffff", 0.2, 2);
  /* Kiemenspalten: fünf, die letzte über dem Brustflossenansatz; Spalt, Lichtkante dahinter, weicher Schatten */
  const kiemen = [];
  for (let i = 0; i < 5; i++) { const x = 406 - i * 7.6, a = 0.3, b = 0.7 - (i > 2 ? (i - 2) * 0.04 : 0); kiemen.push([P(x + 1.4, a), P(x, (a + b) / 2), P(x + 0.8, b)]); }
  if (F) k += weichL(kiemen.map((z) => z.map((p) => [p[0] + 1.6, p[1]])), "#000", 2.2, 0.14, 1) + L(kiemen.map((z) => z.map((p) => [p[0] - 0.6, p[1]])), "#f0f2ee", 0.45, 0.25);
  k += L(kiemen, "#1c201e", 0.45, 0.6);
  /* Schatten der Rückenflosse (unter der freien Hinterspitze), Narben */
  k += weichF([[320, -129], [300, -130.5], [292, -127], [306, -125]], "#000", 0.3, 3);
  k += H.narbenG([[300, -112, -6, 18, 2, 1.2, 0.2], [210, -104, 8, 14, 1, 1, 0.2]], "#d9ddd6", 0.8, 0.35);
  s += H.vol("rumpf", 10, teil(R.d, GRAU, { innen: k, randA: 0.2, rw: 0.45 }), { tiefe: 3.5 });
  /* Schwanzflosse: langer oberer Lappen mit Subterminalkerbe und Endlappen, spitzer sichelförmiger unterer Lappen */
  const sf = [[100, -99], [80, -100.5], [64, -107], [48, -116], [32, -127], [16, -139], [2, -150], [-10, -159], [-19, -165.5, 1], [-15, -159], [-9, -156.5], [-4, -156, 1], [-1, -151.5], [6, -144], [16, -133], [28, -119], [39, -107], [47, -100], [50.5, -97.5, 1], [47, -90], [41, -81], [34, -72], [27, -63.5, 1], [37, -70], [51, -79], [65, -86], [81, -90.5], [100, -92]];
  let si = weichL([[[80, -101], [62, -108.5], [44, -119], [26, -132], [8, -146], [-8, -158], [-17, -164]]], "#dfe3dd", 1.8, 0.35, 0.6);
  si += L([[[-14, -158.5], [-8, -156], [-4, -155.6]], [[0, -150], [8, -141.6], [20, -128], [32, -115], [42, -104.6], [48, -99.4]], [[46, -91], [40, -81.6], [33, -72.4], [28, -65]]], "#40463f", 0.55, 0.55);
  si += weichF([[100, -100], [80, -98.5], [70, -95.5], [80, -92], [100, -91]], "#1e2622", 0.2, 3);
  const sfB = T.box(sf);
  s += `<g ${H.maskeX(102, 88, [sfB[0] - 4, sfB[1] - 4, sfB[2] + 6, sfB[3] + 4])}>${H.vol("schwanz", 2.5, teil(G(sf), "#686e69", { innen: si, randD: G(sf.slice(1, -1), false), randA: 0.2, rw: 0.4 }), { tiefe: 3 })}</g>`;
  /* erste Rückenflosse: sehr hoch, sichelförmig, Ursprung bei ~27 % der Länge; Fußverrundung vorn, Basis wächst aus
     dem Rücken, flache Basisellipse (leichte Aufsicht) */
  const r1 = [[352, yo(352) + 1.5], [343, yo(343) - 0.4], [337, -134], [331, -144], [322, -163], [310, -184], [296, -200], [283, -209], [274.5, -211.5, 1], [276, -204], [279.5, -188], [282.5, -169], [284, -153], [283, -141], [280, -134.5], [276.5, -131.8, 1], [284, -131.4], [290, yo(290) + 0.4], [296, -112, 1], [348, -112, 1]];
  let ri = weichL([[[337, -136], [330, -146], [321, -164], [309, -185], [295, -201], [282, -209.4]]], "#d3d8d2", 2, 0.4, 0.8);
  ri += weichF([[277, -206], [280, -189], [283, -170], [283.4, -152], [281.4, -140], [286, -144], [287, -164], [284, -186]], "#000", 0.32, 2.2);
  ri += L([[[276.4, -205], [279.6, -188], [282.4, -169], [283.6, -153], [282.6, -141], [279.6, -134.4]]], "#40463f", 0.5, 0.5);
  ri += weichF([[352, -127], [320, -133], [290, -133], [280, -129], [320, -125]], "#000", 0.22, 3);
  const r1B = T.box(r1);
  s += `<g ${H.maskeOhne(R.d, 2.5, 1.2, [r1B[0] - 5, r1B[1] - 5, r1B[2] + 5, r1B[3] + 5])}>${H.vol("finne", 4, teil(G(r1), FINNE, { innen: ri, randD: G(r1.slice(2, 17), false), randA: 0.2, rw: 0.45 }), { tiefe: 3 })}</g>`;
  /* zweite Rückenflosse, Afterflosse (tief konkaver Hinterrand, lange freie Hinterspitze), Bauchflosse (sichelförmig) */
  const fl = (pts, farbe, licht, name, oben) => {
    const b = T.box(pts);
    const t = teil(G(pts), farbe, { innen: weichF(licht, "#e3e7e1", 0.3, 0.7) + weichF(pts.slice(-4, -2).concat([[pts[0][0] - 4, pts[0][1] + (oben ? 3 : -3)]]), "#000", 0.22, 1.6), randD: G(pts.slice(1, -2), false), randA: 0.2, rw: 0.35 });
    return `<g ${H.maskeOhne(R.d, oben ? 2 : -2, 0.8, [b[0] - 4, b[1] - 4, b[2] + 4, b[3] + 4])}>${H.vol(name, 1.4, t, { tiefe: 2.5 })}</g>`;
  };
  s += fl([[148, yo(148) + 1], [143, -112], [137, -119.5], [131.5, -122.5, 1], [130.5, -117], [127.5, -110], [121, -103.6], [113, -100.4, 1], [122, -101.6], [128, yo(128) + 0.6], [128, -96, 1], [148, -100, 1]], GRAU, [[146, -110], [139, -118], [133, -121.5], [138, -115]], "rf2", true);
  s += fl([[146, -86], [141, -79], [135, -72.4], [130, -70.6, 1], [129.8, -76], [126.6, -82], [120.6, -87.4], [112.6, -90.2, 1], [121, -89.2], [128, -88], [128, -92, 1], [146, -90, 1]], "#7a807b", [[144, -84], [138, -76], [132, -71.6], [137, -77]], "af", false);
  s += fl([[214, -76], [207, -66], [198, -57], [189, -51.5, 1], [190, -57.6], [187.6, -64.6], [181, -71.6], [172.6, -75.4, 1], [184, -76], [196, -77], [196, -82, 1], [214, -80, 1]], "#7a807b", [[212, -74], [204, -63], [193, -54.5], [200, -62]], "bauchfl", false);
  /* Brustflosse: Ursprung unter der letzten Kiemenspalte */
  const bf = [[384, -81], [377, -71], [367, -59], [354, -49], [342, -43.4], [336.5, -42, 1], [340, -47], [345, -55], [350, -65], [354, -77], [362, -84], [376, -86]];
  const bfB = T.box(bf);
  s += `<g ${H.maskeR(370, -82, 3, 11, [bfB[0] - 4, bfB[1] - 4, bfB[2] + 4, bfB[3] + 4])}>${H.vol("brustfl", 2.5, teil(G(bf), "#6b716c", { innen: weichL([[[378, -72], [368, -60], [355, -50], [341, -43.6]]], "#dfe3dd", 1.8, 0.4, 0.6) + weichF([[340, -45], [346, -56], [352, -68], [356, -78], [350, -76], [344, -62]], "#000", 0.3, 1.6), randA: 0.2, rw: 0.4 }), { tiefe: 3 })}</g>`;
  /* ---- Hammer (Cephalofoil): nur 6° gedreht, 24° von oben ---- */
  const ps = 6 * Math.PI / 180, el = 24 * Math.PI / 180;
  const fu = [Math.cos(ps), Math.sin(ps) * Math.sin(el)], fv = [-Math.sin(ps), Math.cos(ps) * Math.sin(el)], dz = Math.cos(el);
  const K0 = [466, -101];
  const pr = (u, v, z = 0) => [K0[0] + u * fu[0] + v * fv[0], K0[1] + u * fu[1] + v * fv[1] - z * dz];
  /* Draufsicht (u nach vorn, v zum Betrachter): gerader Vorderrand, Mittelkerbe 5, Flügel außen schmal (40 %),
     Hinterränder nach hinten-innen geschwungen in die Kopfseiten */
  const plan = [[-6, -53], [-1, -51], [0.6, -42], [0.8, -26], [0, -12], [-2.4, -3.6], [-5, 0, 1], [-2.4, 3.6], [0, 12], [0.8, 26], [0.6, 42], [-1, 51], [-6, 53], [-11.5, 51.5], [-15.5, 46], [-19.5, 37], [-25, 28], [-32, 22], [-42, 19], [-54, 18], [-54, -18], [-42, -19], [-32, -22], [-25, -28], [-19.5, -37], [-15.5, -46], [-11.5, -51.5]];
  /* Dicke: Mitte kräftig (Kopf), zu den Flügeln flach */
  const zt = (v) => 3.4 + 8 * Math.max(0, 1 - Math.abs(v) / 26);
  const oben = plan.map(([u, v, e]) => { const p = pr(u, v, zt(v)); if (e) p.push(1); return p; });
  /* sichtbare Vorderkante (Dicke) von der fernen bis zur nahen Spitze */
  const kv = plan.slice(0, 13);
  const kante = kv.map(([u, v]) => pr(u, v, zt(v))).concat(kv.slice().reverse().map(([u, v]) => pr(u, v, -zt(v))));
  let ka = weichF(kv.map(([u, v]) => pr(u, v, -zt(v))).concat(kv.slice().reverse().map(([u, v]) => pr(u, v, -zt(v) * 0.15))), "#000", 0.22, 1);
  ka += weichF([pr(-2.4, -3.6, 11), pr(-5, 0, 11.4), pr(-2.4, 3.6, 11), pr(-2.4, 3.6, -11), pr(-5, 0, -11.4), pr(-2.4, -3.6, -11)], "#1a1d1a", 0.5, 0.6);
  if (F) {
    /* Nasenfurchen am Vorderrand nahe den Flügelenden, Ampullenporen */
    ka += L([[pr(-1, 47, 0.4), pr(0.4, 41, 0.6), pr(0.8, 34, 0.4)], [pr(-1, -47, 0.4), pr(0.4, -41, 0.6), pr(0.8, -34, 0.4)]], "#1c201e", 0.6, 0.6);
    let po = "";
    for (let i = 0; i < 46; i++) { const v = -50 + T.rnd() * 100, [px, py] = pr(0.6, v, -2.6 + T.rnd() * 4.6); po += `M${f(px)} ${f(py)}h.01`; }
    ka += `<path d="${po}" stroke="#1c201e" stroke-width=".45" stroke-linecap="round" stroke-opacity=".35" fill="none"/>`;
  }
  const hm = T.box(oben.concat(kante));
  let hs = teil(G(kante), "#7d827c", { innen: ka, randA: 0.22, rw: 0.4 });
  /* Oberseite: Licht von oben wie am Rücken (gleiche Logik), Vorderkante oben als Lichtgrat, Mittelgrat schwach */
  let ob = weichF([pr(-2, -46, zt(46)), pr(-1, 0, 11.4), pr(-2, 46, zt(46)), pr(-10, 44, zt(44)), pr(-12, 0, 11.4), pr(-10, -44, zt(44))], "#e4e6dc", 0.25, 1.6);
  ob += weichL([kv.slice(1, 12).map(([u, v]) => pr(u - 0.8, v, zt(v)))], "#f3f4ee", 0.9, 0.55, 0.3);
  ob += weichF([pr(-14, 47, zt(47)), pr(-20, 30, zt(30)), pr(-32, 21, zt(21)), pr(-40, 19, zt(19)), pr(-40, 10, zt(10)), pr(-24, 13, zt(13)), pr(-11, 40, zt(40))], "#000", 0.18, 2.4);
  const OBERS = T.lg("hhOben", [[0, "#8f8f84"], [1, "#777970"]], K0[0], K0[1] - 20, K0[0] - 40, K0[1] + 10, H.US);
  hs += teil(G(oben), OBERS, { innen: ob, randD: G(oben.slice(0, 20), false), randA: 0.2, rw: 0.4 });
  s += `<g ${H.maskeX(K0[0] - 52, K0[0] - 36, [hm[0] - 4, hm[1] - 4, hm[2] + 4, hm[3] + 4])}>${H.vol("hammer", 2.2, hs, { tiefe: 2.5 })}</g>`;
  /* Maul: flacher dunkler Bogen unter dem Kopf hinter dem Hammer, Unterlippe als feine Lichtkante */
  s += L([[[448, -89.4], [442, -87.6], [435, -87.2]]], "#2a2220", 1, 0.6) + L([[[446, -88.2], [440, -86.6], [435, -86.3]]], "#f0efe8", 0.45, 0.45);
  /* nahes Auge am Flügelende, leicht vorgewölbt, goldbraune Iris, Lidstrich; fernes als kleiner Buckel mit Glanz */
  const [ex, ey] = pr(-6.5, 53.6, 0);
  s += `<ellipse cx="${f(ex)}" cy="${f(ey)}" rx="4" ry="3.3" fill="${T.rg("hhH", [[0, "#000", 0.45], [1, "#000", 0]])}"/>`;
  s += weichL([[[ex - 2.4, ey - 1.6], [ex, ey - 2.9], [ex + 2.4, ey - 1.7]]], "#f0f1ea", 0.8, 0.3, 0.3);
  s += `<ellipse cx="${f(ex)}" cy="${f(ey)}" rx="1.9" ry="1.65" fill="${T.rg("hhA", [[0, "#050608"], [0.62, "#0d1419"], [0.85, "#6b5a2a"], [1, "#2a2410"]], 0.5, 0.5, 0.5)}"/>`;
  s += `<ellipse cx="${f(ex + 0.5)}" cy="${f(ey - 0.6)}" rx=".4" ry=".26" fill="#fff" opacity=".75"/>`;
  s += `<path d="M${f(ex - 1.7)} ${f(ey + 1)}Q${f(ex)} ${f(ey + 2.1)} ${f(ex + 1.8)} ${f(ey + 0.9)}" fill="none" stroke="#1d201c" stroke-opacity=".5" stroke-width=".4"/>`;
  const [fx2, fy2] = pr(-6.5, -53.4, 1);
  s += `<ellipse cx="${f(fx2)}" cy="${f(fy2)}" rx="1.5" ry="1.1" fill="#3a3f3a" opacity=".7"/><ellipse cx="${f(fx2 + 0.4)}" cy="${f(fy2 - 0.4)}" rx=".4" ry=".25" fill="#fff" opacity=".5"/>`;
  const alle = sf.concat(r1, oben, kante, bf);
  const bx = T.box(alle);
  return H.ende(s, [Math.floor(bx[0]), Math.floor(bx[1]), Math.ceil(bx[2]), -42], [400, -134, 474, -70]);
}

/* =====================================================================
   MANTAROCHEN (RIESENMANTA)
   ===================================================================== */
/* RECHERCHE Riesenmanta (Mobula birostris, früher Manta birostris):
   Spannweite meist 4–7 m (hier 5,6 m), Scheibe rautenförmig, ~2,2-mal so breit wie lang; Brustflossen („Flügel“)
   mit dicker, gerundeter, leicht gewölbter Vorderkante, spitzen, nach hinten gezogenen Enden (bei ~55–60 % der
   Scheibenlänge hinter dem Kopf) und dünner, konkaver Hinterkante. Vorn zwei KOPFFLOSSEN (Cephalic lobes), beim
   Schwimmen eingerollt, nach vorn und leicht nach innen-unten gerichtet, zur Spitze schmaler. Maul endständig, sehr
   breit und flach zwischen den Kopfflossen; Augen seitlich am Kopf hinter den Kopfflossen (vorgewölbt). Kleine,
   niedrige Rückenflosse an der Schwanzwurzel, beidseits kleine Beckenflossen; Schwanz peitschenartig, etwa so lang
   wie die Scheibe. Oberseite schwarz mit großen weißen SCHULTERFLECKEN, deren Vorderränder gerade und fast
   rechtwinklig zum dunklen Mittelstreifen verlaufen („T“), nach hinten grau auslaufend; Unterseite weiß. Haut matt,
   fein gekörnt. Darstellung: schwimmend nach rechts, schräg von oben (7° gedreht, 40° Aufsicht, leichte Perspektive:
   der nahe Flügel ist größer), Flügel im Aufschlag nur leicht gebogen. */
function mantarochen(T) {
  const H = mach(T), { G, L, teil, weichF, weichL, F, f } = H;
  const SCHW = "#17191c", WEISS = "#ebebe6";
  const ps = 7 * Math.PI / 180, el = 40 * Math.PI / 180, se = Math.sin(el), ce = Math.cos(el);
  const O = [300, -170];
  /* z: leichte Flügelbiegung + kräftiger Rumpfwulst (Kopf/Kiemenregion) in der Mitte */
  const zf = (u, v) => 15 * Math.pow(Math.min(1, Math.abs(v) / 277), 2) + (Math.abs(v) < 130 && u > -155 && u < 104 ? 30 * Math.pow(Math.cos(Math.abs(v) / 130 * Math.PI / 2), 1.5) * Math.sin(Math.max(0, Math.min(1, (u + 155) / 260)) * Math.PI) : 0);
  const pr = (u, v, z) => {
    const zz = z == null ? zf(u, v) : z, sk = 1 + 0.1 * v / 280;
    return [O[0] + (u * Math.cos(ps) - v * Math.sin(ps)) * sk, O[1] + ((u * Math.sin(ps) + v * Math.cos(ps)) * se - zz * ce) * sk];
  };
  const pp = (pts, z) => pts.map(([u, v, e]) => { const p = pr(u, v, z); if (e) p.push(1); return p; });
  /* halbe Scheibe (v > 0 = naher Flügel): Kopf → Vorderkante → Spitze → Hinterkante → Becken; Schwanzwurzel breit */
  const halb = [[103, 48], [96, 58], [86, 70], [76, 82], [64, 98], [46, 136], [24, 180], [2, 223], [-18, 255], [-34, 275], [-46, 287, 1], [-49, 272], [-55, 240], [-67, 198], [-85, 150], [-105, 106], [-121, 73], [-131, 61], [-142, 50], [-150, 34], [-153, 17]];
  const ganz = halb.map(([u, v, e]) => (e ? [u, v, e] : [u, v])).concat(halb.slice().reverse().map(([u, v, e]) => (e ? [u, -v, e] : [u, -v])));
  const um = ganz.map(([u, v, e]) => { const p = pr(u, v, Math.abs(v) < 50 ? zf(u, v) * 0.4 : null); if (e) p.push(1); return p; });
  let s = "";
  /* Schwanz: peitschenartig, an der Wurzel breit und mit der Scheibe verschmolzen */
  const sw = [];
  for (let i = 0; i <= 12; i++) { const u = -146 - i * 23, v = Math.sin(i * 0.45) * 7; sw.push(pr(u, v, 9 - i * 0.5)); }
  const sbr = (i) => 8 * Math.pow(1 - i / 12, 1.6) + 0.4;
  const swU = sw.map((p, i) => [p[0], p[1] - sbr(i)]).concat(sw.slice().reverse().map((p, j) => [p[0], p[1] + sbr(12 - j)]));
  s += H.vol("schwanz", 1.5, teil(G(swU), "#1e2125", { innen: weichL([sw.slice(1, 9).map((p, i) => [p[0], p[1] - sbr(i + 1) * 0.45])], "#8e9fac", 1, 0.35, 0.6), randA: 0.25, rw: 0.4 }), { tiefe: 2.5 });
  /* Beckenflossen: zwei kleine Lappen beidseits der Schwanzwurzel */
  for (const sg of [-1, 1]) s += teil(G(pp([[-142, 26 * sg], [-152, 34 * sg], [-166, 33 * sg, 1], [-160, 22 * sg], [-150, 16 * sg]], 5)), sg > 0 ? "#202327" : "#1a1c20", { innen: weichF(pp([[-146, 28 * sg], [-156, 33 * sg], [-163, 31 * sg], [-154, 27 * sg]], 5), "#8e9fac", 0.18, 1.2), randA: 0.25, rw: 0.4 });
  /* ---- Scheibe ---- */
  let k = "";
  /* weiße Schulterflecken: gerader Vorderrand fast rechtwinklig zum dunklen Mittelstreifen (T), nach hinten-außen grau */
  for (const sg of [1, -1]) {
    const pts = pp([[54, 46, 1], [50, 80], [44, 118], [36, 156], [26, 186], [12, 204], [-6, 200], [-26, 178], [-42, 144], [-52, 106], [-55, 74], [-52, 52], [-30, 46, 1]].map(([u, v, e]) => [u, v * sg, e]));
    const g = T.lg("schulter" + (sg > 0 ? "N" : "F"), [[0, WEISS], [0.55, "#e2e3e0"], [0.82, "#a3a8ab"], [1, "#30353a"]], f(pr(50, 50 * sg)[0]), f(pr(50, 50 * sg)[1]), f(pr(-40, 190 * sg)[0]), f(pr(-40, 190 * sg)[1]), H.US);
    k += `<path d="${G(pts)}" fill="${g}" filter="${H.weich(0.6, T.box(pts))}"/>`;
  }
  /* feine, matte Körnung der Haut */
  if (F) k += T.textur(G(um), T.rauschen("haut", { fx: 1.2, fy: 1.2, okt: 2, farbe: "#ffffff", staerke: 2, schwelle: 0.55 }), 0, 0.04, T.box(um));
  /* Licht von oben links: ferner Flügel zum Licht gekippt (heller), naher zur Spitze dunkler; Rumpfwulst mit Licht
     oben und Schatten an der Grenze zu den Flügeln; Rumpf wirft Schatten auf den nahen Flügel */
  k += weichF(pp([[60, -60], [10, -150], [-20, -230], [-40, -270], [-60, -200], [-90, -120], [-60, -60]]), "#8696a2", 0.18, 14);
  k += weichF(pp([[10, 180], [-34, 275], [-46, 287], [-55, 240], [-30, 190]]), "#000", 0.35, 10);
  k += weichF(pp([[90, -26], [30, -44], [-60, -40], [-130, -16], [-130, 12], [-60, 18], [30, 16], [90, 10]]), "#c9d6df", 0.2, 6);
  k += weichF(pp([[80, 34], [20, 46], [-70, 50], [-136, 36], [-126, 58], [-60, 62], [20, 56], [70, 48]]), "#000", 0.3, 6);
  k += weichL([pp([[70, -52], [0, -68], [-80, -64], [-130, -40]])], "#d3dee6", 2, 0.18, 1.5);
  /* Vorderkanten dick und rund: Lichtgrat; naher Flügel mit Reflex von unten; Hinterkanten dünn, leicht durchscheinend */
  for (const sg of [1, -1]) {
    const a = pp([[88, 66], [72, 92], [54, 128], [32, 172], [8, 216], [-14, 250], [-32, 272]].map(([u, v]) => [u, v * sg]));
    k += weichL([a.map(([x, y]) => [x - 2, y + (sg > 0 ? -3 : 3)])], "#dbe6ee", 3.5, sg > 0 ? 0.32 : 0.45, 1.2);
    if (sg > 0) k += weichL([a.map(([x, y]) => [x + 1, y + 1.5])], "#9fb0bd", 1.6, 0.2, 0.6);
    const h = pp([[-48, 270], [-54, 240], [-66, 198], [-84, 150], [-104, 106], [-120, 73]].map(([u, v]) => [u, v * sg]));
    k += L([h], "#2a2e33", 1.4, 0.8);
  }
  k += H.narbenG([[pr(-20, 120)[0], pr(-20, 120)[1], -30, 22, 3, 2.4, 0.2], [pr(-70, -160)[0], pr(-70, -160)[1], 40, 20, 2, 2.2, -0.2]], "#cfd6da", 0.8, 0.25);
  s += H.vol("scheibe", 7, teil(G(um), SCHW, { innen: k, randA: 0.25, rw: 0.7 }), { tiefe: 2.5 });
  /* Rückenflosse: niedrig, dreieckig-gerundet, matt */
  s += teil(G([pr(-136, 0, 18), pr(-146, 0, 26), pr(-153, 0, 27), pr(-157, 0, 21), pr(-160, 0, 14)]), "#1d2024", { innen: weichF([pr(-138, 0, 19), pr(-146, 0, 25), pr(-151, 0, 25), pr(-146, 0, 21)], "#9fb0bd", 0.2, 1), randA: 0.25, rw: 0.5 });
  /* Kopffront: breiter, flacher Maulspalt; Oberlippe als feine Lichtkante, Unterlippe hell (weiße Unterseite) */
  const oL = pp([[100, 40], [103.5, 20], [104.5, 0], [103.5, -20], [100, -40]], 12);
  const uL = pp([[100, -38], [104, -18], [105, 0], [104, 18], [100, 38]], 4);
  s += teil(G(oL.concat(uL)), "#0c0d0f", { innen: weichF(pp([[103, 24], [105, 0], [103, -24], [104, 0]], 8), "#3a1f22", 0.5, 1.4), randA: 0.3, rw: 0.4 });
  s += L([oL], "#aab8c2", 1, 0.4) + L([pp([[101, 34], [104.5, 16], [105.5, 0], [104.5, -16], [101, -34]], 2.6)], "#cfd2d0", 1.6, 0.75);
  /* Kopfflossen: eingerollt, nach vorn und leicht nach innen-unten, zur Spitze schmaler (50 %); Rollkante als
     Spiralfuge an der Innenseite; matt */
  const kf = (sg) => {
    const mitte = [[96, 50], [110, 50], [124, 48.5], [138, 45.5], [150, 41.5], [158, 38]];
    const w = (u) => 9 - (u - 96) / 62 * 4.5, z = (u) => 9 - (u - 96) / 62 * 5;
    const aussen = mitte.map(([u, v]) => pr(u, (v + w(u)) * sg, z(u))), innen = mitte.map(([u, v]) => pr(u, (v - w(u)) * sg, z(u) + 3));
    const spitze = pr(163, 35 * sg, 3.5);
    const pts = aussen.concat([spitze], innen.slice().reverse());
    let ii = weichF(innen.concat([spitze], mitte.slice().reverse().map(([u, v]) => pr(u, v * sg, z(u) + 2))), "#c6d2da", sg > 0 ? 0.22 : 0.3, 1.4);
    ii += weichF(aussen.concat(mitte.slice().reverse().map(([u, v]) => pr(u, v * sg, z(u)))), "#000", 0.35, 2);
    if (F) {
      const fuge = mitte.map(([u, v], i) => pr(u, (v - w(u) * (0.35 - 0.12 * Math.sin(i * 1.3))) * sg, z(u) + 2.4));
      ii += L([fuge], "#000", 0.9, 0.4) + L([fuge.map(([x, y]) => [x + 0.6, y + (sg > 0 ? -0.8 : 0.8)])], "#9fb2be", 0.5, 0.3);
    }
    return H.vol("kopffl" + (sg > 0 ? "n" : "f"), 2, teil(G(pts), "#1f2226", { innen: ii, randA: 0.3, rw: 0.5 }), { tiefe: 2.5 });
  };
  s = kf(-1) + s + kf(1);
  /* nahes Auge: seitlich vorgewölbt hinter der Kopfflosse, Lichtkante oben, Schatten unten */
  const [ex, ey] = pr(86, 60, 4);
  s += `<ellipse cx="${f(ex)}" cy="${f(ey + 0.6)}" rx="6" ry="4" fill="#2a2e33"/>`;
  s += weichL([[[ex - 5, ey - 1.6], [ex, ey - 3.8], [ex + 5, ey - 1.8]]], "#c9d6df", 1.2, 0.3, 0.6) + weichL([[[ex - 4.6, ey + 3.4], [ex, ey + 4.6], [ex + 4.6, ey + 3.2]]], "#000", 1.4, 0.35, 0.6);
  s += `<ellipse cx="${f(ex)}" cy="${f(ey)}" rx="3" ry="2.3" fill="${T.rg("mA", [[0, "#060504"], [0.55, "#20150d"], [0.85, "#3a2616"], [1, "#0a0806"]], 0.5, 0.5, 0.5)}"/>`;
  s += `<ellipse cx="${f(ex + 0.8)}" cy="${f(ey - 0.7)}" rx=".55" ry=".35" fill="#fff" opacity=".7"/>`;
  const alle = um.concat(swU, [pr(163, -35, 3.5), pr(163, 35, 3.5)]);
  const bx = T.box(alle);
  return H.ende(s, [Math.floor(bx[0] - 1), Math.floor(bx[1] - 1), Math.ceil(bx[2] + 1), Math.ceil(bx[3] + 1)], T.box([pr(70, -70), pr(70, 80), pr(166, -45), pr(166, 50), pr(110, 0, 20)]));
}

/* =====================================================================
   MEERESSCHILDKRÖTE (GRÜNE MEERESSCHILDKRÖTE)
   ===================================================================== */
/* RECHERCHE Grüne Meeresschildkröte (Chelonia mydas):
   Panzer 80–120 cm (hier 100 cm), oval, flach gewölbt, glatt; Schilde NEBENEINANDER (nicht dachziegelig):
   5 sechseckige Wirbelschilde (Mittelreihe), je 4 Rippenschilde – deren Fugen treffen die Seitenecken der
   Wirbelschilde –, ~12 Randschilde je Seite, Nackenschild vorn. Farbe olivbraun mit strahlenförmigen Streifen
   (Ocker, Mahagoni, Oliv) vom Wachstumszentrum am hinteren oberen Schildrand aus. Kopf klein (~18–20 % der
   Panzerlänge), rundlich, kurze stumpfe Schnauze; NUR EIN Paar langgestreckter Präfrontalschuppen zwischen den Augen
   (Kennzeichen), 4 Postorbitalschuppen hinter dem Auge, Wangen- und Tympanalschilde; Schuppen braun mit hellen
   Rändern; Hornschneide, Unterkiefer gesägt. Hals beige-grau, faltig, fein beschuppt. Vorderflossen ~60–65 % der
   Panzerlänge, größte Breite bei ~⅓, rundlich-spitz, je EINE Kralle an der Vorderkante; Vorderkante mit einer Reihe
   großer länglicher Schuppen, dahinter kleinere, zur Spitze kleiner; heller Hinterrand. Hinterflossen kurz, rund.
   Bauchpanzer gelblich weiß. Darstellung: schwimmend nach rechts, schräg von oben; die nahe Vorderflosse im
   Abschlag nach hinten (Vorderkante mit Kralle außen, heller Hinterrand zum Panzer), die ferne angehoben. */
function meeresschildkroete(T) {
  const H = mach(T), { G, L, teil, weichF, weichL, F, f } = H;
  const PANZER = "#5f4d31";
  const M = (x, y) => [x + 95, y - 72];
  const pm = (pts) => pts.map(([x, y, e]) => { const p = M(x, y); if (e) p.push(1); return p; });
  let s = "";
  /* Flosse: Mittellinie mitte, Breiten zur Vorderkante bv und zur Hinterkante bh; vorn/hinten als eigene Seiten */
  const flosse = (mitte, bv, bh, seite) => {
    const n = mitte.length, vorn = [], hinten = [];
    for (let i = 0; i < n; i++) {
      const a = mitte[Math.max(0, i - 1)], b = mitte[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      const nx = dy / l * seite, ny = -dx / l * seite;
      vorn.push([mitte[i][0] + nx * bv[i], mitte[i][1] + ny * bv[i]]);
      hinten.push([mitte[i][0] - nx * bh[i], mitte[i][1] - ny * bh[i]]);
    }
    return { vorn, hinten, mitte, pts: vorn.concat(hinten.slice().reverse()) };
  };
  /* Schuppenmosaik auf einer Flosse: gemeinsames Eckpunkt-Gitter (jeder Punkt einmal verschoben), vorne eine Reihe
     großer länglicher Schuppen, dahinter kleinere; zur Spitze kleiner. Fugen hell, Schuppenmitten dunkler. */
  const schuppen = (fl, nGross, hell, dunkel) => {
    if (!F) return "";
    const P2 = (t, q) => {
      const x = Math.max(0, Math.min(0.999, t)) * (fl.vorn.length - 1), i = Math.min(fl.vorn.length - 2, Math.floor(x)), u = x - i;
      const a = [fl.vorn[i][0] + (fl.vorn[i + 1][0] - fl.vorn[i][0]) * u, fl.vorn[i][1] + (fl.vorn[i + 1][1] - fl.vorn[i][1]) * u];
      const b = [fl.hinten[i][0] + (fl.hinten[i + 1][0] - fl.hinten[i][0]) * u, fl.hinten[i][1] + (fl.hinten[i + 1][1] - fl.hinten[i][1]) * u];
      return [a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q];
    };
    const baender = [[0.04, 0.4, nGross], [0.4, 0.66, nGross * 2], [0.66, 0.88, nGross * 2]];
    let fugen = "", mitten = "";
    for (const [q0, q1, n] of baender) {
      const tz = [], gq = [];
      for (let i = 0; i <= n; i++) tz.push(0.03 + Math.pow(i / n, 0.8) * 0.9);
      const gitter = tz.map((t, i) => [q0, q1].map((q, j) => P2(t + (i > 0 && i < n ? (T.rnd() - 0.5) * 0.05 : 0), q + (T.rnd() - 0.5) * 0.06)));
      for (let i = 0; i < n; i++) {
        const z = [gitter[i][0], gitter[i + 1][0], gitter[i + 1][1], gitter[i][1]];
        fugen += H.vieleck(z);
        const c = z.reduce((a, p) => [a[0] + p[0] / 4, a[1] + p[1] / 4], [0, 0]);
        mitten += H.vieleck(z.map((p) => [c[0] + (p[0] - c[0]) * 0.62, c[1] + (p[1] - c[1]) * 0.62]));
      }
    }
    return `<path d="${mitten}" fill="${dunkel}" opacity=".45" filter="${H.weich(0.4, T.box(fl.pts))}"/><path d="${fugen}" fill="none" stroke="${hell}" stroke-width=".45" stroke-opacity=".38" stroke-linejoin="round"/>`;
  };
  /* ferne Vorderflosse: angehoben, kürzer (~60 % der Panzerlänge); heller Hinterrand zum Panzer; im Schatten */
  const ff = flosse(pm([[30, -22], [24, -32], [16, -42], [6, -51], [-3, -58], [-12, -64]]), [7, 9.6, 10, 8, 4.6, 1.5], [6, 7.6, 8, 6.4, 3.6, 1.5], -1);
  let fi = weichF(ff.hinten.slice(1).concat(ff.hinten.slice(1).reverse().map((p) => [p[0] + 1.4, p[1] + 1.8])), "#bfae84", 0.45, 0.6);
  fi += schuppen(ff, 5, "#a8966c", "#2c2318");
  s += H.vol("flosseF", 2, teil(G(ff.pts), "#3e3224", { innen: fi, randA: 0.3, rw: 0.4 }), { tiefe: 2.5 });
  /* ferne Hinterflosse: kurz, rund, gleiche Schuppung im Schatten */
  const fh = flosse(pm([[-41, -15], [-47, -18], [-53, -20], [-57, -21]]), [3.4, 4.4, 4, 1.8], [3.4, 4.4, 4, 1.8], 1);
  s += H.vol("hfF", 1.2, teil(G(fh.pts), "#3e3224", { innen: schuppen(fh, 2, "#9a8862", "#2c2318"), randA: 0.3, rw: 0.4 }), { tiefe: 2.5 });
  /* Hals: kürzer, beige-grau, faltig, fein beschuppt, unten heller; geht ohne Umrisslinie in den Kopf über */
  const hals = pm([[34, -14], [44, -13.4], [52, -10.6], [55, -4], [54, 3], [46, 6.4], [36, 6.6]]);
  let hi = weichF(pm([[38, 1], [54, 0], [54, 5], [38, 7]]), "#d8c9a4", 0.7, 1.2) + weichF(pm([[38, -12], [52, -10], [50, -7], [38, -8]]), "#fff", 0.15, 1.2);
  if (F) {
    hi += weichL([[36, 37.5, 39, 41, 43, 45.5, 48, 50.5][0]].length ? [0, 1, 2, 3, 4, 5, 6].map((i) => pm([[38 + i * 2.4, -12 + i * 0.3], [39.4 + i * 2.4, -4], [38.6 + i * 2.4, 5]])) : [], "#3e3324", 0.5, 0.2, 0.3);
    let sd = ""; for (let i = 0; i < 40; i++) { const x = 37 + T.rnd() * 16, y = -11 + T.rnd() * 16, [px, py] = M(x, y); sd += `M${f(px)} ${f(py)}h.01`; }
    hi += `<path d="${sd}" stroke="#efe4c4" stroke-width="1.1" stroke-linecap="round" stroke-opacity=".3" fill="none"/>`;
  }
  s += H.vol("hals", 1.5, teil(G(hals), "#b8a684", { innen: hi, randD: G(hals.slice(1, 6), false), randA: 0.25, rw: 0.35 }), { tiefe: 2.5 });
  /* Kopf (klein, ~19 % der Panzerlänge), Schnauze kurz und stumpf */
  const K = (x, y) => M(51 + 0.7 * x, -4.6 + 0.7 * y);
  const kk = (pts) => pts.map(([x, y]) => K(x, y));
  const kopf = kk([[-2, -6.6], [2.6, -9.8], [9, -11.6], [16, -11.4], [21, -9.6], [24, -6.8], [25.3, -3], [25.1, 0.6], [23.6, 3.4], [19.4, 5.4], [12, 6.8], [4, 7.2], [-2, 6.4]]);
  const sch = [
    [[16.6, -11.3], [21.2, -9.5], [20.6, -6.6], [15.8, -7.8]], [[10.4, -11.6], [16.6, -11.3], [15.8, -7.8], [11.6, -8.4]],
    [[10.6, -8.4], [16.2, -7.7], [17.4, -7], [16, -6.9], [12.2, -7.2]], [[4.6, -10.6], [10.4, -11.6], [11.6, -8.4], [10.6, -8.4], [9.2, -7.6], [5, -7.6]],
    [[-1.8, -7.8], [4.6, -10.6], [5, -7.6], [2.6, -5.6], [-2.2, -4.8]],
    [[9.2, -7.6], [10.9, -7.3], [10.6, -5.7], [8.8, -5.9]], [[8.8, -5.9], [10.6, -5.7], [10.4, -4.1], [8.6, -4.3]],
    [[8.6, -4.3], [10.4, -4.1], [10.6, -2.5], [8.6, -2.7]], [[8.6, -2.7], [10.6, -2.5], [11.4, -1], [8.8, -0.8]],
    [[2.6, -5.6], [5, -7.6], [9.2, -7.6], [8.8, -5.9], [8.6, -4.3], [4.4, -3.4]], [[4.4, -3.4], [8.6, -4.3], [8.6, -2.7], [8.8, -0.8], [5.2, 0.4], [3, -1.2]],
    [[-2.2, -4.8], [2.6, -5.6], [4.4, -3.4], [3, -1.2], [1.4, 1.6], [-2.4, 1.2]],
    [[3, -1.2], [5.2, 0.4], [8.8, -0.8], [11.4, -1], [12.6, 1.4], [8, 2.8], [3.2, 3.4], [1.4, 1.6]],
    [[11.4, -1], [14.4, -1.1], [17.4, -1.6], [18.6, 0.4], [15, 1.6], [12.6, 1.4]], [[14.4, -1.1], [16, -2.6], [17.4, -1.6]],
    [[17.4, -6.6], [20.6, -6.6], [21.8, -3.6], [18.6, -2.4], [17.6, -3.8]], [[20.6, -6.6], [21.2, -9.5], [23.6, -6.6], [24.6, -3.4], [21.8, -3.6]],
    [[-2.4, 1.2], [1.4, 1.6], [3.2, 3.4], [0.6, 5.4], [-2.4, 4.8]], [[3.2, 3.4], [8, 2.8], [9.4, 4.8], [5, 6.2], [0.6, 5.4]],
  ];
  let ki = weichF(kk([[-1, 3.6], [12, 4.8], [23, 2.8], [23.6, 6], [12, 8], [-1, 8]]), "#e6d6aa", 0.75, 0.6);
  const schD = sch.map((q) => H.vieleck(kk(q))).join("");
  ki += `<path d="${schD}" fill="#4d3c25"/>`;
  if (F) ki += `<path d="${sch.map((q) => { const c = q.reduce((a, p) => [a[0] + p[0] / q.length, a[1] + p[1] / q.length], [0, 0]); return H.vieleck(kk(q.map(([x, y]) => [c[0] + (x - c[0]) * 0.55, c[1] + (y - c[1]) * 0.55]))); }).join("")}" fill="#665232" opacity=".45"/>`;
  ki += `<path d="${schD}" fill="none" stroke="#d2be8a" stroke-width=".3" stroke-linejoin="round"/>`;
  /* Kehle: kleine helle Schuppen */
  if (F) { let ks = ""; for (let i = 0; i < 14; i++) { const [px, py] = K(1 + T.rnd() * 18, 4.6 + T.rnd() * 2.2); ks += `M${f(px)} ${f(py)}h.01`; } ki += `<path d="${ks}" stroke="#a8956a" stroke-width=".7" stroke-linecap="round" stroke-opacity=".45" fill="none"/>`; }
  ki += weichF(kk([[2, -9], [12, -11], [20, -9], [14, -7.6], [4, -7]]), "#ffffff", 0.2, 0.8);
  ki += weichF(kk([[-2, 2], [8, 3], [12, 3.6], [6, 5.4], [-2, 5]]), "#000", 0.18, 1);
  /* Hornschneiden, Maulspalt, gesägter Unterkiefer, Nasenloch */
  ki += `<path d="${G([[...K(25.2, -2.6), 1], K(25, 0.6), K(23, 2.8), K(18.4, 3.9), [...K(12.4, 4.2), 1], K(13.2, 2.4), K(18.6, 0.8), K(22.6, -1.4)])}" fill="#cbb685"/>`;
  ki += L([kk([[25, 0.7], [22.6, 3], [17.6, 4], [12.2, 4.3]])], "#2a2118", 0.55, 0.9);
  if (F) { let z = ""; for (let i = 0; i < 8; i++) { const [x, y] = K(22.8 - i * 1.3, 4.1 + i * 0.03); z += `M${f(x)} ${f(y)}l-.2 .32`; } ki += `<path d="${z}" fill="none" stroke="#7b6643" stroke-width=".18" stroke-opacity=".7"/>`; }
  ki += weichF(kk([[24.4, -4.6], [23.4, -3], [22.8, -4.2]]), "#1d1712", 0.8, 0.2);
  s += H.vol("kopf", 1.2, teil(G(kopf), "#a38e66", { innen: ki, randD: G(kopf.slice(0, 12), false), randA: 0.25, rw: 0.3 }), { tiefe: 2.5 });
  /* Auge: dunkel braun-oliv mit Pupille, geschuppter Lidrand (fein), weiches kleines Glanzfenster, feuchtes Unterlid */
  const [ax, ay] = K(14.2, -4.4), ar = 1.8;
  s += `<ellipse cx="${f(ax)}" cy="${f(ay)}" rx="${f(ar * 1.45)}" ry="${f(ar * 1.15)}" fill="${T.rg("skH", [[0, "#1a120a", 0.9], [0.7, "#2a1f12", 0.6], [1, "#2a1f12", 0]])}"/>`;
  s += `<ellipse cx="${f(ax)}" cy="${f(ay + 0.1)}" rx="${f(ar)}" ry="${f(ar * 0.78)}" fill="${T.rg("skA", [[0, "#050403"], [0.38, "#0b0805"], [0.45, "#3a2c18"], [0.85, "#4a3a20"], [1, "#120d07"]], 0.52, 0.5, 0.5)}"/>`;
  s += `<path d="M${f(ax - ar * 1.2)} ${f(ay - 0.2)}Q${f(ax)} ${f(ay - ar * 1.35)} ${f(ax + ar * 1.25)} ${f(ay - 0.3)}" fill="none" stroke="#231a11" stroke-width=".6" stroke-opacity=".85"/>`;
  if (F) { let lr = ""; for (let i = 0; i < 6; i++) { const t = (i + 0.5) / 6, x = ax - ar * 1.15 + t * ar * 2.4, y = ay - ar * 1.05 * Math.sin(Math.PI * t) - 0.2; lr += `M${f(x)} ${f(y)}l.15 -.5`; } s += `<path d="${lr}" stroke="#d2be8a" stroke-width=".25" stroke-opacity=".6" fill="none"/>`; }
  s += `<path d="M${f(ax - ar * 1.05)} ${f(ay + ar * 0.62)}Q${f(ax)} ${f(ay + ar * 1.2)} ${f(ax + ar * 1.05)} ${f(ay + ar * 0.52)}" fill="none" stroke="#e6d8b0" stroke-width=".35" stroke-opacity=".7"/>`;
  s += `<ellipse cx="${f(ax + ar * 0.35)}" cy="${f(ay - ar * 0.35)}" rx="${f(ar * 0.35)}" ry="${f(ar * 0.24)}" fill="#fff" opacity=".65" filter="${H.weich(0.08, [ax - 1, ay - 2, ax + 2, ay])}"/>`;
  /* ---- Panzer ---- */
  const cx = -1, cy = -2;
  const rand = (th, s0 = 1, s1 = 1) => [cx + (Math.cos(th) > 0 ? 50 : 52.5) * Math.cos(th) * s0, cy + (Math.sin(th) < 0 ? 30 : 28.5) * Math.sin(th) * s1];
  const UM = [], RING = [];
  for (let i = 0; i < 72; i++) { const th = i / 72 * Math.PI * 2; UM.push(rand(th)); RING.push(rand(th, 0.9, 0.84)); }
  const um = pm(UM);
  /* Bauchpanzer-Streifen (nahe Seite): in der Mitte 4, an den Enden 1; Schatten des Rückenpanzers darauf */
  const bauch = [];
  for (let i = 4; i <= 32; i++) { const th = i / 72 * Math.PI * 2, [x, y] = rand(th); bauch.push([x, y]); }
  const bauchU = bauch.map(([x, y], i) => [x - 0.4, y + 1 + 3 * Math.sin(Math.PI * i / (bauch.length - 1))]);
  s += teil(G(pm(bauch.concat(bauchU.reverse())), true), "#d8c698", { innen: weichF(pm(bauch.concat(bauch.slice().reverse().map(([x, y]) => [x, y + 2.2]))), "#3a2e1c", 0.35, 0.8), randA: 0.3, rw: 0.35 });
  /* Schildgeometrie: Wirbel-Sechsecke, Rippenschilde (nah/fern) bis zum Randring, Randschilde */
  const wx = [44, 28, 10, -8, -26, -42], wy = [-12, -14, -16, -16, -14, -10];
  const mid = (i) => [(wx[i] + wx[i + 1]) / 2, (wy[i] + wy[i + 1]) / 2];
  const wirbel = [];
  for (let i = 0; i < 5; i++) { const [mx, my] = mid(i); wirbel.push([[wx[i], wy[i] - 6], [mx, my - 9.5], [wx[i + 1], wy[i + 1] - 6], [wx[i + 1], wy[i + 1] + 6], [mx, my + 9.5], [wx[i], wy[i] + 6]]); }
  const unterK = [], oberK = [];
  for (let i = 0; i < 5; i++) { const [mx, my] = mid(i); unterK.push([wx[i], wy[i] + 6], [mx, my + 9.5]); oberK.push([wx[i], wy[i] - 6], [mx, my - 9.5]); }
  unterK.push([wx[5], wy[5] + 6]); oberK.push([wx[5], wy[5] - 6]);
  /* Ringpunkte nah (y > cy) von vorn nach hinten, fern ebenso */
  const ringNah = RING.filter((p, i) => i <= 36).slice(), ringFern = RING.filter((p, i) => i >= 36).concat([RING[0]]).reverse();
  const ringBei = (ring, x) => ring.reduce((a, p) => (Math.abs(p[0] - x) < Math.abs(a[0] - x) ? p : a));
  const ringIdx = (ring, x) => ring.indexOf(ringBei(ring, x));
  const fugeN = [1, 2, 3].map((i) => { const [mx, my] = mid(i); return [[mx, my + 9.5], ringBei(ringNah, mx - 4)]; });
  const fugeF = [1, 2, 3].map((i) => { const [mx, my] = mid(i); return [[mx, my - 9.5], ringBei(ringFern, mx + 1)]; });
  const kette = (A, x0, x1) => A.filter((p) => p[0] <= x0 + 0.01 && p[0] >= x1 - 0.01);
  const rippen = (K2, fugen, ring) => {
    const xs = [wx[0], ...fugen.map((q) => q[0][0]), wx[5]], polys = [];
    for (let j = 0; j < 4; j++) {
      const oben = kette(K2, xs[j], xs[j + 1]);
      const ra = j === 0 ? ringIdx(ring, wx[0] + 2) : ring.indexOf(fugen[j - 1][1]), rb = j === 3 ? ringIdx(ring, wx[5] - 4) : ring.indexOf(fugen[j][1]);
      const ringT = ring.slice(Math.min(ra, rb), Math.max(ra, rb) + 1);
      polys.push(oben.concat(ringT.slice().reverse()));
    }
    return polys;
  };
  const rippenN = rippen(unterK, fugeN, ringNah), rippenF = rippen(oberK, fugeF, ringFern);
  let k = "";
  /* Strahlenzeichnung je Schild: 6–9 breite Strahlen vom Wachstumszentrum (hinterer oberer Schildrand) bis an die
     Fuge, je Schild beschnitten; Ocker, Mahagoni, Oliv im Wechsel */
  const strahlen = (poly, zx, zy, w0, n) => {
    const cp = H.clip(H.vieleck(pm(poly)));
    let a = "", b = "", c = "";
    for (let j = 0; j < n; j++) {
      const w = (w0 - 75 + j * (150 / (n - 1)) + (T.rnd() - 0.5) * 12) * Math.PI / 180, L2 = 26;
      const [x0, y0] = M(zx, zy), d = `M${f(x0)} ${f(y0)}L${f(x0 + Math.cos(w) * L2)} ${f(y0 + Math.sin(w) * L2 * 0.7)}`;
      if (j % 3 === 0) a += d; else if (j % 3 === 1) b += d; else c += d;
    }
    const sw = (x) => f(F ? x : x * 1.4);
    const bl = F ? ` filter="${H.weich(0.35, T.box(pm(poly)))}"` : "";
    return `<g ${cp}><g${bl}><path d="${a}" stroke="#b8913f" stroke-width="${sw(1 + T.rnd() * 1.2)}" stroke-opacity=".42" fill="none"/><path d="${b}" stroke="#4a2e14" stroke-width="${sw(1.2 + T.rnd() * 1.4)}" stroke-opacity=".4" fill="none"/><path d="${c}" stroke="#6b5a2e" stroke-width="${sw(1.4 + T.rnd() * 1.4)}" stroke-opacity=".35" fill="none"/></g></g>`;
  };
  wirbel.forEach((q, i) => { const [mx] = mid(i); k += strahlen(q, mx - 6, wy[i] - 3, 0, F ? 12 : 3); });
  rippenN.forEach((q) => { const xs = q.map((p) => p[0]), zx = Math.min(...xs) + 3, zy = Math.min(...q.map((p) => p[1])) + 2; k += strahlen(q, zx, zy, 40, F ? 12 : 3); });
  rippenF.forEach((q) => { const xs = q.map((p) => p[0]), zx = Math.min(...xs) + 2, zy = Math.max(...q.map((p) => p[1])) - 1; k += strahlen(q, zx, zy, -30, F ? 8 : 3); });
  /* Wölbung: Panzer oben hell, zum nahen Rand Schatten; jedes Schild leicht gewölbt (Licht oben vorn, Schatten an
     der unteren hinteren Fuge) */
  k += weichF(pm([[36, -18], [10, -22], [-20, -20], [-38, -12], [-20, -8], [10, -8], [32, -10]]), "#f5e9c8", 0.18, 5);
  k += weichF(pm([[44, 6], [30, 18], [4, 24], [-24, 21], [-42, 10], [-20, 14], [4, 16], [30, 12]]), "#000", 0.25, 5);
  if (F) wirbel.concat(rippenN, rippenF).forEach((q) => {
    const c = q.reduce((a, p) => [a[0] + p[0] / q.length, a[1] + p[1] / q.length], [0, 0]);
    k += weichF(pm(q.map(([x, y]) => [c[0] + (x - c[0]) * 0.5 + 2, c[1] + (y - c[1]) * 0.5 - 1.5])), "#fff2cc", 0.12, 1.5);
  });
  /* Fugen als Rinne: dunkel, dahinter versetzte Lichtkante; Randschilde: 24 Fugen rundum, senkrecht zum Rand */
  const linien = [];
  for (const q of wirbel) linien.push(pm(q.concat([q[0]]).map(([x, y]) => [x, y, 1])));
  for (const q of fugeN.concat(fugeF)) linien.push(pm(q));
  const ringZ = pm(RING.concat([RING[0]]));
  for (let i = 0; i < 24; i++) { const th = (i + 0.5) / 24 * Math.PI * 2, a = rand(th, 0.9, 0.84), b = rand(th, 1.01, 1.02); linien.push(pm([a, b])); }
  linien.push(pm([[wx[0], wy[0] - 6], ringBei(ringFern, wx[0] + 2)]), pm([[wx[0], wy[0] + 6], ringBei(ringNah, wx[0] + 2)]));
  k += `<path d="${H.vieleck(F ? ringZ : ringZ.filter((p, i) => i % 2 === 0)).replace("Z", "")}" fill="none" stroke="#1e160c" stroke-width=".9" stroke-opacity=".5"/>`;
  const PL = (z) => z.map((q) => "M" + q.map((p) => f(p[0]) + " " + f(p[1])).join(" ")).join("");
  k += (F ? L(linien, "#1e160c", 0.9, 0.55) : `<path d="${PL(linien)}" fill="none" stroke="#1e160c" stroke-width="1.1" stroke-opacity=".55"/>`) + (F ? L(linien.map((z) => z.map((p) => [p[0] + 0.45, p[1] + 0.55, p[2]])), "#ead8a4", 0.45, 0.32) : "");
  k += weichF(pm([[22, -20], [10, -21], [-2, -21], [10, -18]]), "#ffffff", 0.3, 1.2);
  s += H.vol("panzer", 5, teil(G(um), PANZER, { innen: k, randA: 0.35, rw: 0.5 }), { tiefe: 3 });
  /* nahe Hinterflosse: kurz, rund-paddelförmig, heller Hinterrand */
  const hn = flosse(pm([[-37, 16], [-44, 21], [-51, 25], [-56, 27]]), [4.6, 5.6, 5, 2], [4.6, 5.6, 5, 2], 1);
  s += H.vol("hfN", 1.2, teil(G(hn.pts), "#594830", { innen: weichF(hn.vorn.concat(hn.vorn.slice().reverse().map((p) => [p[0] + 1, p[1] - 1.6])), "#e6d6aa", 0.55, 0.6) + schuppen(hn, 2, "#d9c79a", "#3f3222"), randA: 0.3, rw: 0.4 }), { tiefe: 2.5 });
  /* nahe Vorderflosse: ~62 % der Panzerlänge, im Abschlag nach hinten; Vorderkante (dunkel, gerade, mit Kralle) außen,
     heller Hinterrand zum Panzer; größte Breite (20) bei ⅓, Spitze rundlich-spitz */
  const vn = flosse(pm([[30, 16], [24, 26], [15, 35], [4, 42], [-8, 47], [-18, 50.5], [-25, 52]]), [7.6, 9.4, 9.6, 8, 5.6, 3, 0.8], [8, 10.4, 10.6, 9, 6.4, 3.4, 0.8], -1);
  let vi = weichF(vn.vorn.slice(1).concat(vn.vorn.slice(1).reverse().map((p) => [p[0] + 1.4, p[1] + 2.2])), "#efe2bf", 0.8, 0.6);
  vi += weichF(vn.hinten.slice(0, 6).concat(vn.hinten.slice(0, 6).reverse().map((p) => [p[0] - 1, p[1] - 2.4])), "#1f170e", 0.25, 1);
  vi += weichF(pm([[34, 12], [28, 24], [20, 22], [26, 12]]), "#000", 0.4, 2.4);
  vi += schuppen({ vorn: vn.hinten, hinten: vn.vorn, pts: vn.pts }, 6, "#d9c79a", "#3f3222");
  s += H.vol("flosseN", 2.2, teil(G(vn.pts), "#4b3c27", { innen: vi, randA: 0.32, rw: 0.45 }), { tiefe: 2.5 });
  /* Kralle an der Außenkante (Vorderkante) bei ~25 % der Flossenlänge: kurz, gebogen, hornfarben, halb im Hautsaum */
  const [kx, ky] = vn.hinten[2];
  s += `<path d="M${f(kx - 0.6)} ${f(ky - 0.6)}c1.2 .2 2.2 1 2.6 2.4c-.9 -.5 -1.8 -.6 -2.8 -.3z" fill="#8a7550" stroke="#3a2e1c" stroke-width=".25"/><path d="M${f(kx + 1.4)} ${f(ky + 1)}l.6 .8" stroke="#d8c8a0" stroke-width=".35"/>`;
  const alle = um.concat(ff.pts, vn.pts, hn.pts, fh.pts, kopf);
  const bx = T.box(alle);
  return H.ende(s, [Math.floor(bx[0]), Math.floor(bx[1]), Math.ceil(bx[2]), Math.ceil(bx[3])], [M(48, 0)[0], M(0, -14)[1], M(72, 0)[0], M(0, 6)[1]]);
}

/* =====================================================================
   POTTWAL
   ===================================================================== */
/* RECHERCHE Pottwal (Physeter macrocephalus), Bulle:
   bis 16–18 m (hier 15 m). Riesiger, kastenförmiger Kopf (¼–⅓ der Länge, Walrat-Organ), Stirn stumpf, fast
   senkrecht und flach, obere Kante gerundet; die Unterseite des Kopfes (Junk) weicht nach hinten zurück und ragt weit
   über den Unterkiefer. Unterkiefer lang, SCHMAL, eigener Stab unter dem Kopf, mit 18–26 Paar kegelförmiger, leicht
   nach hinten gebogener Zähne (Oberkiefer zahnlos, nur Zahngruben); Lippen und Mundwinkel weiß. EIN S-förmiges
   Blasloch vorn LINKS oben am Kopf in einer flachen Mulde. Auge klein, knapp hinter/über dem Mundwinkel, in einem
   flachen Wulst. Statt Finne ein niedriger, gerundeter Höcker bei ~⅔ der Länge, dahinter eine Reihe „Knöchel“ IN der
   Rückenkontur bis zur Fluke; Schwanzstiel seitlich abgeflacht und hoch. Haut hinter dem Kopf runzelig wie eine
   Backpflaume (unregelmäßiges Faltennetz), auf dem Kopf glatter mit hellen Kratzern und kreisrunden Saugnapfnarben
   (Reihen) von Riesenkalmaren. Brustflossen klein, paddelförmig. Fluke breit dreieckig, waagrecht, gerade
   Hinterkante, tiefe Kerbe. Farbe dunkelgrau bis bräunlich grau, Bauch mit grau-weißen, zerfransten Flecken. */
function pottwal(T) {
  const H = mach(T, 0), { G, L, teil, weichF, weichL, F, f } = H;
  const HAUT = "#3c3d3f";
  const oben = [[1496, -190], [1500, -215], [1502, -250], [1501, -285], [1497, -311], [1487, -331]].concat(H.buckel([[1476, -342], [1462, -349.5], [1448, -353], [1418, -357], [1300, -360], [1200, -360], [1110, -356], [1040, -351], [970, -348], [890, -351], [800, -355], [720, -357], [650, -357], [600, -360], [560, -368], [525, -375], [492, -373], [462, -362], [420, -346], [370, -326], [310, -303], [250, -281], [190, -262], [140, -249], [100, -241], [70, -236], [40, -232], [12, -229]],
    [[1466, -2.2, 10], [1442, 3, 10], [436, 6, 14], [394, 5.4, 13], [352, 4.8, 12], [310, 4.2, 12], [268, 3.6, 11], [226, 3, 10], [184, 2.6, 9]]));
  const R = H.rumpf(oben,
    [[1496, -190], [1488, -173], [1473, -160], [1452, -151], [1424, -144], [1396, -139], [1360, -129], [1300, -118], [1220, -108], [1140, -101], [1060, -96], [980, -92], [900, -91], [820, -94], [740, -102], [660, -116], [580, -136], [500, -158], [420, -180], [340, -197], [260, -208], [186, -214], [130, -217], [90, -220], [60, -223], [30, -226], [12, -228]]);
  const P = R.P;
  /* Fluke: waagrecht, breit dreieckig, gerade Hinterkante, tiefe Kerbe */
  const FL = H.fluke({ x0: 36, y0: -228, L: 150, S: 205, k: 0.18, fern: 0.55, hell: "#4a4d52", farbe: "#36383b", dunkel: "#2b2c2f", weich: 2.5,
    plan: [[-0.12, 0.06], [0, 0.2], [0.3, 0.5], [0.6, 0.78], [0.85, 0.95], [1, 1, 1], [0.93, 0.82], [0.85, 0.62], [0.77, 0.42], [0.69, 0.22], [0.62, 0.08], [0.5, 0, 1], [-0.12, 0, 1]] });
  let s = FL.fern;
  let k = "";
  /* grau-weiße, zerfranste Bauchflecken mit Spritzern */
  {
    let d = "";
    for (const [x, t, rx, ry] of [[960, 0.93, 40, 9], [820, 0.95, 30, 7], [700, 0.92, 22, 6], [880, 0.88, 12, 4], [1010, 0.9, 10, 4]]) {
      const [px, py] = P(x, t), q = [];
      for (let j = 0; j < 14; j++) { const a = j / 14 * 6.28, rr = (0.55 + T.rnd() * 0.55) * (j % 2 ? 1 : 0.7); q.push([px + Math.cos(a) * rx * rr, py + Math.sin(a) * ry * rr]); }
      d += H.vieleck(q);
      if (F) for (let j = 0; j < 4; j++) { const sx = px + (T.rnd() - 0.5) * rx * 2.6, sy = py + (T.rnd() - 0.5) * ry * 2.4, r = 1 + T.rnd() * 2; d += H.vieleck([[sx - r, sy], [sx, sy - r * 0.6], [sx + r, sy], [sx, sy + r * 0.6]]); }
    }
    k += `<path d="${d}" fill="#c9c8c2" opacity=".68" filter="${H.weich(0.6, [600, -150, 1080, -70])}"/>`;
  }
  /* Kopf etwas heller und glatter; Licht von oben, EIN weicher Kernschatten, Reflex unter dem Kopf */
  k += weichF([[1500, -330], [1300, -350], [1120, -345], [1100, -150], [1300, -125], [1500, -200]], "#6a6c6e", 0.32, 40);
  k += weichF(R.band(20, 1500, -0.06, 0.22), "#c8d2da", 0.1, 16);
  k += weichF(R.band(30, 1495, 0.5, 0.95), "#0e1216", 0.3, 22);
  k += weichF(R.band(500, 1440, 0.94, 1.06), "#b8c2c8", 0.28, 6);
  k += weichF([[1494, -186], [1470, -160], [1430, -146], [1396, -140], [1420, -152], [1470, -170]], "#b8c2c8", 0.2, 4);
  /* Stirn: flach, obere Kante gerundet mit schmalem, unterbrochenem Glanz */
  k += H.glanz(R, 1150, 1470, 0.035, 3, 0.012, 0.28, 2.5);
  k += weichF([[1497, -300], [1501, -250], [1497, -200], [1486, -176], [1470, -210], [1480, -270]], "#000", 0.22, 9);
  /* Runzelhaut (Backpflaume): unregelmäßiges Faltennetz, direkt hinter dem Kopf am stärksten, zu Bauch und Stiel
     auslaufend, auf dem Kopf fast unsichtbar; Rinne dunkel, Grat hell versetzt */
  if (F) {
    let st = "", sw = "";
    for (let t = 0.08 + T.rnd() * 0.02; t < 0.86; t += 0.02 + T.rnd() * 0.03) {
      let x = 1090 - T.rnd() * 40;
      while (x > 300) {
        const l = 15 + T.rnd() * 55, ang = (T.rnd() - 0.5) * 0.3, amp = 0.012 + T.rnd() * 0.008, n = 3;
        const staerke = Math.min(1, (x - 300) / 400) * Math.min(1, (1080 - x) / 60 + 0.3) * (1 - Math.max(0, t - 0.55) / 0.35);
        if (T.rnd() < staerke) {
          let seg = "";
          const pz = [];
          for (let j = 0; j <= n; j++) { const xx = x - l * j / n, [px, py] = P(xx, t + Math.sin(j * 1.3 + x) * amp * 0.5); pz.push([px, py + Math.tan(ang) * l * j / n]); }
          seg += G(pz, false);
          if (T.rnd() < 0.15) { const [qx, qy] = P(x - l * 0.5, t); seg += `M${f(qx)} ${f(qy + Math.tan(ang) * l * 0.5)}l${f(-8 - T.rnd() * 10)} ${f(6 + T.rnd() * 6)}`; }
          if (staerke > 0.55) st += seg; else sw += seg;
        }
        x -= l + 4 + T.rnd() * 22;
      }
    }
    const id = T.id("runzel"), id2 = T.id("runzel2");
    T.def(`<path id="${id}" d="${st}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path id="${id2}" d="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
    k += `<use href="#${id}" stroke="#000" stroke-width="2.2" stroke-opacity=".3"/><use href="#${id}" y="1.5" stroke="#c4cdd3" stroke-width="1.4" stroke-opacity=".22"/>`;
    k += `<use href="#${id2}" stroke="#000" stroke-width="2" stroke-opacity=".16"/><use href="#${id2}" y="1.5" stroke="#c4cdd3" stroke-width="1.2" stroke-opacity=".11"/>`;
  }
  /* Kopfnarben: lange parallele Kratzer, Saugnapfnarben als geschlossene Ringe in gebogenen Reihen (Tentakelspur) */
  k += H.narbenG([[1380, -300, -8, 70, 3, 4, 0.4], [1260, -250, 12, 56, 2, 4, -0.3], [1440, -232, 80, 40, 2, 3, 0.3], [1180, -300, -4, 44, 1, 3, 0.3]], "#d6dbde", 1.6, 0.4);
  if (F) {
    let ri = "";
    for (const [x0, y0, n, a0, kr] of [[1290, -238, 12, -0.25, 0.004], [1200, -205, 9, 0.15, -0.006], [1400, -286, 7, -0.6, 0.008]]) {
      for (let i = 0; i < n; i++) {
        const a = a0 + kr * i * 10, r = 1.5 + T.rnd() * 2 * (1 - i / n) + 0.4, cx = x0 + Math.cos(a) * i * 8, cy = y0 + Math.sin(a) * i * 8 + Math.sin(i * 0.5) * 3;
        ri += `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0`;
      }
    }
    k += `<path d="${ri}" fill="none" stroke="#d6dbde" stroke-width="1" stroke-opacity=".4"/>`;
  }
  /* Fluke-Ansatz */
  k += weichF([[86, -238], [56, -235], [36, -230], [36, -225], [56, -219], [86, -217], [70, -227]], "#000", 0.35, 8);
  /* Blasloch: S-Schlitz in der Mulde vorn oben, Wulst dahinter */
  k += L([[[1478, -350], [1472, -353], [1465, -351], [1458, -354], [1452, -356]]], "#0b0c0d", 3, 0.85) + L([[[1478, -346], [1471, -349], [1464, -347], [1457, -350]]], "#d6dde2", 1.4, 0.4);
  /* Zahngruben des Oberkiefers (Kopfunterseite), Schatten des Unterkiefers auf der Kehle */
  if (F) { let zg = ""; for (let i = 0; i < 12; i++) { const x = 1372 - i * 18, y = R.yu(x) - 2.5; zg += `M${f(x - 2.6)} ${f(y)}a2.6 1.4 0 1 0 5.2 0a2.6 1.4 0 1 0 -5.2 0`; } k += `<path d="${zg}" fill="#1a1012" opacity=".55"/>`; }
  s += H.vol("rumpf", 42, teil(R.d, HAUT, { innen: k, randA: 0.25, rw: 1.3 }), { tiefe: 4 });
  /* Unterkiefer: eigener schmaler Stab unter dem Kopf, Maul ~6° geöffnet; 12 kegelförmige, leicht nach hinten
     gebogene Zähne (vorn kleiner); Lippen weiß; dunkle Rinne zwischen Kopfunterseite und Kiefer */
  const rot = (pts) => { const a = 6 * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a), ox = 1090, oy = -128; return pts.map(([x, y]) => [ox + (x - ox) * c - (y - oy) * sn, oy + (x - ox) * sn + (y - oy) * c]); };
  const jTop = rot([[1394, -141], [1340, -136], [1270, -131], [1200, -128], [1140, -127], [1095, -128]]);
  const jBot = rot([[1394, -141], [1399, -134], [1395, -127], [1340, -120], [1270, -113], [1200, -108], [1140, -107], [1100, -111], [1088, -122]]);
  /* Maulinneres zwischen Kopfunterseite und Kiefer */
  const oberkiefer = [[1398, -138], [1340, -127], [1270, -117], [1200, -110], [1140, -106], [1095, -110]];
  s += `<path d="${G(oberkiefer.concat(jTop.slice().reverse()))}" fill="#2a1618"/>`;
  s += weichF(oberkiefer.concat(oberkiefer.slice().reverse().map(([x, y]) => [x, y + 6])), "#000", 0.5, 2);
  let zaehne = "", zl = "";
  const jd = H.dicht(jTop, false, 8);
  for (let i = 0; i < 12; i++) {
    const x = 1372 - i * 17, p = jd.reduce((a, q) => (Math.abs(q[0] - x) < Math.abs(a[0] - x) ? q : a)), h = 5 + Math.min(1, i / 4) * 3 * (0.85 + T.rnd() * 0.3), b = 3 + Math.min(1, i / 4) * 1.4;
    const bx = p[0], by = p[1] + 0.5;
    zaehne += `M${f(bx + b / 2)} ${f(by)}C${f(bx + b * 0.4)} ${f(by - h * 0.6)} ${f(bx + b * 0.05)} ${f(by - h * 0.95)} ${f(bx - b * 0.35)} ${f(by - h)}C${f(bx - b * 0.3)} ${f(by - h * 0.6)} ${f(bx - b * 0.45)} ${f(by - h * 0.3)} ${f(bx - b / 2)} ${f(by)}Z`;
    zl += `M${f(bx + b * 0.3)} ${f(by - h * 0.2)}Q${f(bx + b * 0.2)} ${f(by - h * 0.7)} ${f(bx - b * 0.2)} ${f(by - h * 0.92)}`;
  }
  s += `<path d="${zaehne}" fill="#e9e2cc" stroke="#6e6250" stroke-width=".4" stroke-opacity=".6"/>` + (F ? `<path d="${zl}" fill="none" stroke="#fffaf0" stroke-width=".7" stroke-opacity=".6"/>` : "");
  const kiefer = jTop.concat(jBot.slice(1, -1).reverse());
  const kG = T.lg("pwKiefer", [[0, "#e4e3dd"], [0.4, "#c9c9c4"], [0.7, "#5c5e61"], [1, "#46484b"]], 0, -132, 0, -104, H.US);
  s += H.vol("kiefer", 4, teil(G(kiefer), kG, { innen: weichF([[1404, -136], [1394, -144], [1384, -130], [1392, -120]].map(([x, y]) => rot([[x, y]])[0]), "#e4e3dd", 0.9, 2) + L([jTop.slice(0, 5)], "#ffffff", 1.2, 0.5), randA: 0.3, rw: 0.9 }), { tiefe: 2.5 });
  s += weichF(jBot.slice(2).concat(jBot.slice(2).reverse().map(([x, y]) => [x - 6, y + 10])), "#000", 0.3, 5);
  /* weißer Mundwinkel (klein, Abstand zum Auge) */
  s += weichF([[1100, -126], [1090, -128], [1084, -122], [1090, -116], [1102, -118]], "#e2e1db", 0.8, 1.2);
  /* Brustflosse: klein, paddelförmig */
  s += H.vol("flosse", 4, teil(G([[1010, -112], [990, -86], [962, -64], [930, -54], [912, -60], [920, -78], [944, -98], [972, -116]]), "#36373a", { innen: weichF([[1004, -106], [982, -82], [956, -64], [936, -58], [956, -72], [980, -94]], "#c8d2da", 0.3, 3) + weichF([[1020, -120], [980, -122], [970, -104], [1004, -100]], "#000", 0.45, 6), randA: 0.25, rw: 1.2 }), { tiefe: 3 });
  s += FL.nah;
  /* Auge in einem flachen Wulst mit Lichtkante oben, dunkle Umgebung */
  s += weichF([[1066, -162], [1050, -174], [1032, -166], [1036, -152], [1056, -150]], "#000", 0.3, 4);
  s += weichL([[[1036, -170], [1050, -176], [1066, -168]]], "#b4c0c8", 2, 0.3, 1.2);
  s += H.walAuge(1050, -161, 6.4, { winkel: -4, hell: "#b4c0c8" });
  const bx = T.box(R.um.concat([[36 - 150, -228], [1502, -60], [1399, -100]]));
  return H.ende(s, [Math.floor(bx[0]), Math.floor(bx[1]), 1502, -54], [1000, -380, 1504, -80]);
}

/* =====================================================================
   NARWAL
   ===================================================================== */
/* RECHERCHE Narwal (Monodon monoceros), Bulle:
   Körper 4–5,5 m (hier 4,5 m) plus STOSSZAHN bis 3 m (hier 2,4 m): der LINKE obere Eckzahn wächst durch die Oberlippe
   nach vorn – bei Blick auf die rechte Körperseite liegt seine Wurzel hinter der Schnauze –, gerade, spitz zulaufend,
   linksgedreht spiralig gefurcht, an der Wurzel gelblich-grün (Algen), Mitte elfenbein, die Spitze glatt und hell
   poliert. Kopf klein und rund mit vorgewölbter Melone, KEIN Schnabel, Maul klein; Auge klein über dem Mundwinkel.
   Beweglicher Hals mit leichter Hautfalte. KEINE Rückenfinne, nur ein niedriger, unregelmäßiger Rückenkamm (1–5 cm)
   von der Rückenmitte bis ~¾ der Länge. Brustflossen kurz, rund, Spitzen nach oben gebogen. Schwanzstiel seitlich
   abgeflacht mit Kielen. Fluke beim alten Bullen mit konkaver Vorderkante und konvexer Hinterkante, tiefe Kerbe.
   Färbung: gesprenkelt – unregelmäßige, zerlappte dunkle Flecken, nach oben dichter und zu einem Netz mit hellen
   Lücken verschmolzen, Rücken fast geschlossen dunkel; Bauch fast fleckenlos weiß; Kopf dunkler und fein gesprenkelt. */
function narwal(T) {
  const H = mach(T), { G, L, teil, weichF, weichL, F, f } = H;
  const GRUND = "#c9ccc9", FLECK = "#34373a";
  const oben = H.buckel([[460, -80], [458.5, -95], [451, -110], [438, -121], [420, -128], [400, -130.5], [380, -128.5], [356, -129.5], [322, -135], [284, -138.5], [244, -138], [204, -133.5], [164, -125], [124, -114], [100, -106], [80, -99], [60, -93], [40, -88.5], [24, -86.5], [12, -85.5]],
    [[206, 1.6, 4], [192, 2.6, 5], [174, 1.4, 4], [160, 2.8, 6], [141, 2, 4], [126, 1.2, 3], [112, 2.2, 5], [92, 1.4, 4], [74, 1, 3]]);
  const R = H.rumpf(oben,
    [[460, -80], [457.5, -68], [449, -58], [434, -50], [415, -45], [392, -42], [362, -40], [322, -38.5], [282, -38.5], [242, -41], [202, -47], [162, -55], [122, -63], [100, -68], [80, -73], [60, -77], [40, -80.5], [24, -83], [12, -84]]);
  const P = R.P;
  /* Flecken-Vorlagen: zerlappte, ausgefranste Formen (je 3 überlappende Teilformen), als <use> skaliert und gedreht */
  const vid = T.id("fleck");
  if (F) {
    let defs = "";
    for (let v = 0; v < 5; v++) {
      let d = "";
      for (let j = 0; j < 3; j++) {
        const cx = (T.rnd() - 0.5) * 0.9, cy = (T.rnd() - 0.5) * 0.6, q = [];
        for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28, rr = (0.45 + T.rnd() * 0.35) * (i % 2 ? 1 : 0.78); q.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.7]); }
        d += "M" + q.map((p) => (Math.round(p[0] * 100) / 100) + " " + (Math.round(p[1] * 100) / 100)).join(" ") + "Z";
      }
      defs += `<path id="${vid}${v}" d="${d}"/>`;
    }
    T.def(defs);
  }
  const flecken = (liste) => {
    const eimer = [[], [], []];
    for (const [x, y, r, ton] of liste) eimer[ton].push(`<use href="#${vid}${Math.floor(T.rnd() * 5)}" transform="translate(${f(x)} ${f(y)})rotate(${Math.round(T.rnd() * 180)})scale(${Math.round(r * 10) / 10})"/>`);
    return eimer.map((e, i) => (e.length ? `<g fill="${FLECK}" opacity="${[0.45, 0.65, 0.85][i]}">${e.join("")}</g>` : "")).join("");
  };
  /* Fluke: waagrecht, leicht von oben; Bullenform (Vorderkante konkav, Hinterkante konvex), oben gefleckt */
  const FL = H.fluke({ x0: 18, y0: -85, L: 46, S: 56, k: 0.3, fern: 0.55, hell: "#8d918f", farbe: "#6f7371", dunkel: "#4c5052", licht: "#eef3f6", weich: 1.5,
    plan: [[-0.12, 0.08], [0, 0.2], [0.3, 0.3], [0.6, 0.5], [0.86, 0.82], [1, 1, 1], [0.96, 0.8], [0.91, 0.56], [0.83, 0.33], [0.73, 0.15], [0.62, 0.05], [0.5, 0, 1], [-0.12, 0, 1]],
    extra: (nah, pts) => { if (!F) return ""; const b = T.box(pts), l = []; for (let i = 0; i < 26; i++) l.push([b[0] + T.rnd() * (b[2] - b[0]), b[1] + T.rnd() * (b[3] - b[1]), 1.2 + T.rnd() * 2.6, Math.floor(T.rnd() * 3)]); return flecken(l); } });
  /* Stoßzahn: hinter der Körperebene (linker Zahn), die ersten ~10 cm von der Schnauze verdeckt */
  const z0 = [438, -66.5], z1 = [692, -55], zl = Math.hypot(z1[0] - z0[0], z1[1] - z0[1]), ux = (z1[0] - z0[0]) / zl, uy = (z1[1] - z0[1]) / zl, nx = -uy, ny = ux;
  const rz = (t) => 4.2 * (1 - t) + 0.6 * t;
  const zp = (t, q) => [z0[0] + ux * zl * t + nx * rz(t) * q, z0[1] + uy * zl * t + ny * rz(t) * q];
  const zumriss = [];
  for (let i = 0; i <= 12; i++) zumriss.push(zp(i / 12, -1));
  zumriss.push([z1[0] + ux * 1.2, z1[1] + uy * 1.2, 1]);
  for (let i = 12; i >= 0; i--) zumriss.push(zp(i / 12, 1));
  let zi = `<path d="${G(zumriss)}" fill="${T.lg("zahnL", [[0, "#8f8a55"], [0.15, "#bdb68c"], [0.3, "#e3dcc4"], [0.85, "#ece6d4"], [1, "#f6f3ea"]], f(z0[0]), f(z0[1]), f(z1[0]), f(z1[1]), H.US)}"/>`;
  /* Spiralfurchen (linksgedreht, „/“): Rinne dunkel + Grat hell; zur Spitze flacher und feiner, die letzten 15 % glatt */
  let fu = "", gr = "";
  let tm = 0.04;
  while (tm < 0.85) {
    const pts = [], st = 0.022 + tm * 0.012;
    for (let j = 0; j <= 6; j++) { const a = -Math.PI / 2 + j / 6 * Math.PI, q = Math.sin(a), t = tm + (j / 6 - 0.5) * st; pts.push(zp(t, -q * 0.96)); }
    fu += "M" + pts.map((p) => f(p[0]) + " " + f(p[1])).join("L");
    tm += 0.028 + tm * 0.02;
  }
  zi += `<path d="${fu}" fill="none" stroke="#5e4e2c" stroke-width=".55" stroke-opacity=".45"/>`;
  if (F) zi += `<path d="${fu}" fill="none" stroke="#fffaf0" stroke-width=".45" stroke-opacity=".5" transform="translate(1.1 .1)"/>`;
  zi += weichF([zp(0.05, -0.75), zp(0.6, -0.65), zp(0.98, -0.5), zp(0.6, -0.3), zp(0.05, -0.4)], "#ffffff", 0.45, 0.5);
  zi += weichL([[zp(0.86, -0.45), zp(0.93, -0.42), zp(0.99, -0.3)]], "#ffffff", 0.5, 0.85, 0.2);
  zi += weichF([zp(0.02, 0.5), zp(0.7, 0.4), zp(0.98, 0.6), zp(0.7, 1), zp(0.02, 1)], "#3a2f1c", 0.35, 0.6);
  let s = FL.fern;
  s += H.vol("zahn", 1, teil(G(zumriss), "#d9cfb0", { innen: zi, randA: 0.3, rw: 0.3 }), { tiefe: 2 });
  let k = "";
  /* Fleckung: Rücken fast geschlossen dunkel, nach unten Netz mit hellen Lücken, dann einzelne Flecken; Bauch weiß;
     am Kopf feiner gesprenkelt */
  /* Fleckung als Muster aus derselben Rauschvorlage mit nach oben sinkender Schwelle: einzelne zerlappte Flecken
     unten, nach oben dichter und zu einem Netz mit hellen Lücken verschmolzen, Rücken fast geschlossen */
  const bx0 = [-60, -150, 470, -30];
  const zone = (t0, t1, sw, name, fx, op, x0 = -60, x1 = 470) => {
    const mid = T.id("nz" + name), band = R.band(x0, x1, t0, t1);
    T.def(`<mask id="${mid}" maskUnits="userSpaceOnUse" x="-80" y="-170" width="570" height="160"><path d="${F ? G(band) : H.vieleck(band)}" fill="#fff" filter="${H.weich(5, T.box(band))}"/></mask>`);
    const fu = T.rauschen("n" + name, { fx, fy: fx * 1.5, okt: 3, farbe: FLECK, staerke: 12, schwelle: sw, seed: 5 });
    return `<g mask="url(#${mid})" opacity="${op}"><rect x="${bx0[0]}" y="${bx0[1]}" width="${bx0[2] - bx0[0]}" height="${bx0[3] - bx0[1]}" filter="${fu}"/></g>`;
  };
  k += weichF(R.band(-60, 470, -0.3, 0.06), FLECK, 0.9, 2);
  k += (F ? zone(-0.3, 0.78, 0.6, "a", 0.13, 0.75) : "") + zone(-0.3, 0.5, 0.52, "b", 0.13, 0.8) + zone(-0.3, 0.26, 0.4, "c", 0.13, 0.9);
  if (F) k += zone(0.05, 0.75, 0.55, "k", 0.26, 0.7, 384, 470);
  /* Kopf dunkler, um Maul und Kinn heller; Bauch weiß */
  k += weichF([[470, -140], [400, -135], [384, -90], [400, -64], [440, -70], [470, -90]], "#000", 0.15, 8);
  k += weichF([[462, -76], [450, -62], [436, -52], [420, -48], [440, -60], [452, -70]], "#e8ecea", 0.5, 2);
  k += weichF(R.band(60, 430, 0.8, 1.1), "#f2f2ee", 0.6, 4);
  /* Licht: EIN weicher Kernschatten, schmaler unterbrochener Glanz, Glanzfleck auf der Melone, Reflex am Bauch */
  k += weichF(R.band(10, 458, -0.06, 0.2), "#dfe8ee", 0.08, 4);
  k += weichF(R.band(20, 456, 0.52, 0.95), "#1a2027", 0.26, 8);
  k += weichF(R.band(80, 440, 0.95, 1.06), "#ffffff", 0.18, 1.5);
  k += H.glanz(R, 240, 370, 0.07, 2, 0.008, 0.6, 0.6);
  k += H.glanz(R, 80, 220, 0.09, 2, 0.008, 0.5, 0.6);
  k += weichF(R.linse(410, 452, (x, u) => 0.1 + u * 0.12, 0.05), "#ffffff", 0.55, 0.7);
  /* Halsfalte: schwach, nach hinten gebogen, nur im mittleren Drittel; schwächere Parallelfalten */
  k += weichL([[P(384, 0.25), P(378, 0.42), P(382, 0.6)]], "#000", 3, 0.12, 2) + weichL([[P(372, 0.28), P(367, 0.43), P(370, 0.58)], [P(361, 0.3), P(357, 0.44), P(360, 0.56)]], "#000", 2.4, 0.07, 2);
  k += weichL([[P(380, 0.26), P(374, 0.42), P(378, 0.6)]], "#fff", 1.6, 0.08, 1.4);
  /* Schwanzstiel: Rücken- und Bauchkiel */
  k += weichL([[P(110, 0.06), P(70, 0.07), P(30, 0.09)]], "#e6eff5", 0.8, 0.25, 0.4) + weichL([[P(110, 0.94), P(70, 0.93), P(30, 0.9)]], "#000", 1, 0.25, 0.6);
  /* Maul: klein, leicht gebogen; Narben */
  k += L([[[459, -70], [454.5, -65.6], [448.5, -62.6], [443.5, -61.6]]], "#14171a", 0.8, 0.85) + L([[[456.6, -66.4], [451, -62.6], [445.6, -61.6]]], "#ffffff", 0.45, 0.35);
  k += H.narbenG([[330, -110, -6, 20, 2, 1.4, 0.2], [210, -100, 8, 16, 2, 1.3, -0.2], [400, -90, 30, 10, 1, 1, 0.2]], "#e6eaec", 0.7, 0.4);
  s += H.vol("rumpf", 9, teil(R.d, GRUND, { innen: k, randA: 0.22, rw: 0.5 }), { tiefe: 3.5 });
  /* Lippenwulst am Zahnaustritt: nur der obere Rand sichtbar */
  s += weichL([[[461, -74.5], [458, -71.6], [455.5, -70.6]]], "#2b2e31", 1.4, 0.4, 0.4);
  /* Brustflosse: kurz, rund, Spitze aufgebogen; oben fein gefleckt, Rand heller, Wurzel verschmolzen, Achselschatten */
  const bfp = [[408, -50], [400, -40], [388, -33], [374, -31], [366, -34], [364, -40], [372, -42], [384, -45], [394, -52]];
  let bfi = weichF([[404, -48], [392, -38], [378, -33], [388, -40]], "#e4ebef", 0.3, 1) + weichF([[412, -56], [396, -56], [392, -46], [406, -44]], "#000", 0.35, 2);
  bfi += weichL([[[372, -32], [366, -34.4], [364.6, -39]]], "#eef3f6", 1, 0.5, 0.3) + L([bfp.slice(1, 6)], "#8d9396", 0.8, 0.5);
  if (F) { const l = []; for (let i = 0; i < 14; i++) l.push([370 + T.rnd() * 34, -48 + T.rnd() * 14, 0.8 + T.rnd() * 1.6, Math.floor(T.rnd() * 3)]); bfi += flecken(l); }
  s += weichF([[414, -54], [400, -50], [392, -42], [404, -40]], "#000", 0.3, 3);
  const bfB = T.box(bfp);
  s += `<g ${H.maskeR(406, -50, 1.5, 7, [bfB[0] - 3, bfB[1] - 3, bfB[2] + 3, bfB[3] + 3])}>${H.vol("flosse", 1.5, teil(G(bfp), "#5a5e61", { innen: bfi, randA: 0.25, rw: 0.45 }), { tiefe: 2.5 })}</g>`;
  s += FL.nah;
  /* Auge: dunkle Umgebung, Lidfalte als Lichtkante, kleiner Glanzpunkt */
  s += weichF([[431, -69], [427.5, -72], [423, -70.6], [423.4, -67.4], [428, -66.6]], "#202326", 0.35, 0.8);
  s += H.walAuge(427, -69, 1.8, { winkel: -8, hell: "#dbe4ea" });
  return H.ende(s, [-30, -140, 694, -31], [380, -140, 470, -40]);
}

module.exports = [
  { id: "orca", de: "der Orca", syl: "OR-ca", it: "l'orca", itSyl: "OR-ca", en: "orca",
    gruppe: "Meer", lebensraum: "Meer", laenge: 7.48, hoehe: 4.19, schwimmt: true, zeichne: orca },
  { id: "delfin", de: "der Delfin", syl: "DEL-fin", it: "il delfino", itSyl: "del-FI-no", en: "dolphin",
    gruppe: "Meer", lebensraum: "Meer", laenge: 3.05, hoehe: 0.96, schwimmt: true, zeichne: delfin },
  { id: "weisser_hai", de: "der Weiße Hai", syl: "WEI-ße HAI", it: "lo squalo bianco", itSyl: "SQUA-lo BIAN-co", en: "great white shark",
    gruppe: "Meer", lebensraum: "Meer", laenge: 4.48, hoehe: 1.82, schwimmt: true, zeichne: weisser_hai },
  { id: "buckelwal", de: "der Buckelwal", syl: "BU-ckel-wal", it: "la megattera", itSyl: "me-GAT-te-ra", en: "humpback whale",
    gruppe: "Meer", lebensraum: "Meer", laenge: 14.97, hoehe: 4.33, schwimmt: true, zeichne: buckelwal },
  { id: "hammerhai", de: "der Hammerhai", syl: "HAM-mer-hai", it: "lo squalo martello", itSyl: "SQUA-lo mar-TEL-lo", en: "hammerhead shark",
    gruppe: "Meer", lebensraum: "Meer", laenge: 4.9, hoehe: 1.7, schwimmt: true, zeichne: hammerhai },
  { id: "mantarochen", de: "der Mantarochen", syl: "MAN-ta-ro-chen", it: "la manta", itSyl: "MAN-ta", en: "manta ray",
    gruppe: "Meer", lebensraum: "Meer", laenge: 5.84, hoehe: 3.66, schwimmt: true, zeichne: mantarochen },
  { id: "meeresschildkroete", de: "die Meeresschildkröte", syl: "MEE-res-schild-krö-te", it: "la tartaruga marina", itSyl: "tar-ta-RU-ga ma-RI-na", en: "sea turtle",
    gruppe: "Meer", lebensraum: "Meer", laenge: 1.27, hoehe: 1.2, schwimmt: true, zeichne: meeresschildkroete },
  { id: "pottwal", de: "der Pottwal", syl: "POTT-wal", it: "il capodoglio", itSyl: "ca-po-DO-glio", en: "sperm whale",
    gruppe: "Meer", lebensraum: "Meer", laenge: 16.16, hoehe: 3.21, schwimmt: true, zeichne: pottwal },
  { id: "narwal", de: "der Narwal", syl: "NAR-wal", it: "il narvalo", itSyl: "NAR-va-lo", en: "narwhal",
    gruppe: "Meer", lebensraum: "Meer", laenge: 7.24, hoehe: 1.09, schwimmt: true, zeichne: narwal },
];
