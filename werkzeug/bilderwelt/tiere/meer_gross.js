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
      if (!wSchon[k]) { wSchon[k] = 1; T.def(`<filter id="${id}" x="-.3" y="-.8" width="1.6" height="2.6"><feGaussianBlur stdDeviation="${std}"/></filter>`); }
      return `url(#${id})`;
    }
    const id = T.id("w" + nr++), m = std * 3;
    T.def(`<filter id="${id}" filterUnits="userSpaceOnUse" x="${f(box[0] - m)}" y="${f(box[1] - m)}" width="${f(box[2] - box[0] + 2 * m)}" height="${f(box[3] - box[1] + 2 * m)}"><feGaussianBlur stdDeviation="${std}"/></filter>`);
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
  /* Narbengruppen an festen Stellen: [x, y, winkel, länge, anzahl, abstand, biegung] */
  H.narbenG = (gruppen, farbe, w, op) => {
    if (!F) return "";
    const z = [];
    for (const [x, y, wi, len, n, ab, bg] of gruppen) {
      const a = wi * Math.PI / 180, cx = Math.cos(a), cy = Math.sin(a), nx = -cy, ny = cx;
      for (let j = 0; j < n; j++) {
        const o = ab * (j - (n - 1) / 2) + (T.rnd() - 0.5) * ab * 0.25, v = (T.rnd() - 0.5) * len * 0.14, Lj = len * (0.8 + T.rnd() * 0.25);
        const ox = x + nx * o + cx * v, oy = y + ny * o + cy * v, b = bg * len * 0.06;
        z.push([[ox, oy], [ox + cx * Lj / 2 + nx * b, oy + cy * Lj / 2 + ny * b], [ox + cx * Lj, oy + cy * Lj]]);
      }
    }
    return H.L(z, farbe, w, op);
  };
  /* Knoten (Tuberkel) auf der Haut: runde Beule, Licht oben links, Schatten unten rechts, mittig ein Tasthaar.
     Einmal als Vorlage (Einheitskreis) angelegt, je Knoten nur <use>. liste: [[x, y, r], …] */
  const vorlage = {};
  const r2 = (n) => String(Math.round(n * 100) / 100);
  H.knoten = (liste, haut = "#2a3036") => {
    const id = T.id("kn" + haut.slice(1));
    if (!vorlage[id]) {
      vorlage[id] = 1;
      /* ohne eigene Füllfarbe: nur Licht (oben links) und Schatten (unten rechts) – die Beule wächst aus der Haut */
      T.def(`<g id="${id}"><ellipse cx=".3" cy=".42" rx="1.25" ry="1" fill="${T.rg("knS", [[0, "#000", 0.55], [0.6, "#000", 0.26], [1, "#000", 0]])}"/>` +
        `<ellipse cx="-.12" cy="-.16" rx="1" ry=".86" fill="${T.rg("knL", [[0, haut, 0.9], [0.4, haut, 0.5], [1, haut, 0]], 0.45, 0.45, 0.5)}"/>` +
        `<ellipse cx="-.22" cy="-.3" rx=".7" ry=".55" fill="${T.rg("knH", [[0, "#ffffff", 0.42], [1, "#ffffff", 0]])}"/>` +
        (F ? `<path d="M.05 -.05q.18 -.35 .5 -.62" fill="none" stroke="#cfc8b8" stroke-width=".05" stroke-opacity=".6"/>` : "") + `</g>`);
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
        `<path d="${pfad(kr)}" fill="${T.rg("spG", [[0, "#dcd8cc"], [0.55, "#bdb6a4"], [1, "#7b7363"]], 0.36, 0.3, 0.75)}"/>` +
        (F ? `<path d="${pl}" stroke="#8a806b" stroke-width=".07" stroke-opacity=".6" fill="none"/>` : "") +
        `<path d="${pfad(mi)}" fill="#3a3630"/><path d="M-.36 -.12A.4 .36 0 0 1 .3 -.26" fill="none" stroke="#000" stroke-opacity=".5" stroke-width=".1"/></g>`);
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
    const iris = o.iris || "#2c1c12";
    const ig = T.rg("waIris" + iris.slice(1), [[0, iris], [0.55, iris], [0.85, "#0e0806"], [1, "#030202"]], 0.5, 0.45, 0.55);
    let s = `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${o.winkel || 0})">`;
    /* Augenhöhle: weiche Vertiefung; Lidwulst oben mit mattem Licht; feine Fältchen an den Winkeln */
    s += `<ellipse cx="0" cy="${f2(rr * 0.05)}" rx="${f2(W * 2.2)}" ry="${f2(rr * 1.4)}" fill="${T.rg("waHoehle", [[0, "#000", 0.5], [0.6, "#000", 0.2], [1, "#000", 0]])}"/>`;
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
  const H = mach(T), { G, L, teil, weichF, weichL, F } = H;
  const SCHWARZ = "#15181c", WEISS = "#eef1ee";
  /* Rumpf: Rückenlinie / Bauchlinie ab Schnauzenspitze (7 m Bulle, Spitze bei x = 700);
     die Fluke (leicht von oben gesehen: obere Hälfte fern, untere nah, Kerbe in der Mitte) gehört zum Umriss */
  const R = H.rumpf(
    [[700, -203], [699, -217], [694, -232], [684, -248], [668, -264], [645, -279], [612, -292], [570, -302], [520, -309], [460, -313], [400, -313], [340, -309], [285, -301], [230, -289], [178, -274], [130, -259], [96, -248]],
    [[700, -203], [698, -193], [692, -182], [680, -172], [660, -163], [632, -156], [598, -150], [556, -145], [508, -142], [455, -142], [400, -145], [345, -152], [292, -163], [240, -178], [190, -194], [145, -207], [112, -214], [96, -217]],
    [[70, -249], [40, -252], [10, -256], [-20, -261], [-42, -266], [-50, -265, 1], [-40, -256], [-26, -246], [-14, -238], [-6, -233, 1], [-16, -225], [-32, -213], [-50, -199], [-64, -187, 1], [-54, -185], [-24, -193], [10, -203], [40, -210], [70, -214]]);
  const P = R.P;
  let s = "";
  /* Rückenfinne (Bulle: hoch, gerade dreieckig; Basis taucht in den Rumpf) */
  const fRand = [[442, -300], [434, -320], [422, -360], [406, -402], [388, -440], [371, -468], [361, -481], [353, -483], [348, -476], [345, -440], [340, -396], [334, -352], [325, -318], [312, -300]];
  let fi = weichF([[433, -322], [419, -362], [403, -404], [385, -442], [365, -474], [357, -480], [373, -462], [393, -424], [409, -384], [423, -344]], "#c2d2de", 0.55, 2.2);
  fi += weichF([[359, -476], [351, -440], [346, -390], [340, -345], [329, -305], [319, -302], [333, -350], [339, -400], [347, -455]], "#000", 0.55, 5);
  fi += weichF([[419, -340], [403, -385], [385, -430], [367, -462], [363, -440], [375, -400], [391, -355], [401, -330]], "#8296a8", 0.2, 10);
  fi += weichF([[440, -296], [400, -318], [360, -318], [316, -300], [360, -292]], "#000", 0.35, 6);
  if (F) fi += H.narbenG([[402, -380, 62, 38, 3, 2.2, 1.5], [380, -424, 58, 26, 2, 2.2, -1], [366, -340, 70, 30, 3, 2.4, 1]], "#c9d3da", 0.45, 0.28);
  s += teil(G(fRand.concat([[372, -282]])), SCHWARZ, { innen: fi, randD: G(fRand, false), randA: 0.28 });
  /* ---- Rumpf mit Zeichnung ---- */
  let k = "";
  /* Kinn/Kehle weiß: Grenze dicht unter der Maullinie, hinter dem Mundwinkel steil nach unten zur Brustflosse */
  const kinn = G([[712, -204], ...[[700, 0.5], [692, 0.51], [672, 0.53], [650, 0.555], [632, 0.575], [620, 0.6], [612, 0.66], [604, 0.76], [594, 0.86], [582, 0.94], [568, 1.0]].map((q) => P(q[0], q[1])), [560, -120, 1], [712, -120, 1]]);
  k += `<path d="${kinn}" fill="${WEISS}" filter="${H.weich(0.7, [555, -215, 712, -120])}"/>`;
  /* schmales Bauchband und Flankenfleck (vom Bauch schräg nach oben-hinten, Spitze nach hinten) */
  const flanke = R.muster([[575, 0.985], [530, 0.965], [470, 0.955], [415, 0.95], [388, 0.92], [366, 0.84], [348, 0.73], [330, 0.62], [310, 0.53], [288, 0.46], [264, 0.42], [238, 0.41], [212, 0.43], [188, 0.46], [168, 0.5], [184, 0.55], [206, 0.6], [228, 0.68], [246, 0.78], [258, 0.9], [264, 1.08], [575, 1.08]]);
  k += `<path d="${flanke}" fill="${WEISS}" filter="${H.weich(0.8, [160, -265, 580, -135])}"/>`;
  /* Sattelfleck: hellgrau, hinter der Finne, unter deren Hinterkante beginnend */
  const sattel = R.muster([[350, -0.08], [342, 0.03], [328, 0.11], [306, 0.18], [276, 0.225], [244, 0.235], [214, 0.2], [190, 0.12], [176, 0.03], [170, -0.08]]);
  k += `<path d="${sattel}" fill="#a4acb2" filter="${H.weich(2.2, [165, -320, 360, -265])}"/>`;
  if (F) k += `<path d="${sattel}" fill="none" stroke="#2a3036" stroke-width="5" stroke-opacity=".35" filter="${H.weich(3, [160, -325, 365, -260])}"/>`;
  /* Augenfleck: über und hinter dem Auge, vorn stumpf, hinten schmal und ansteigend */
  const auge = P(605, 0.6);
  const af = [[606, -225], [602, -236], [591, -245], [573, -252], [551, -257], [530, -261], [513, -263], [503, -261], [508, -255], [524, -246], [548, -237], [572, -229], [591, -223]];
  k += `<path d="${G(af)}" fill="${WEISS}" filter="${H.weich(0.6, T.box(af))}"/>`;
  /* Fluke: Kante am Schwanzstiel, Licht auf den Vorderkanten */
  k += weichF([[96, -250], [70, -248], [56, -236], [52, -230], [56, -224], [70, -214], [96, -214], [80, -231]], "#000", 0.45, 5);
  k += weichF([[80, -250], [40, -253], [0, -258], [-46, -266], [-10, -259], [36, -251]], "#b3c6d4", 0.25, 1.8);
  k += weichF([[80, -213], [40, -209], [0, -201], [-60, -188], [-14, -199], [36, -208]], "#b3c6d4", 0.38, 1.8);
  k += weichF([[-50, -265], [-40, -256], [-20, -242], [-6, -234], [-20, -240], [-40, -254]], "#000", 0.4, 2.5);
  k += weichL([[[60, -231], [30, -232], [6, -233], [-6, -233]]], "#000", 3, 0.55, 1.6) + weichL([[[60, -228], [30, -229], [4, -230]]], "#9fb3c3", 1.2, 0.3, 0.8);
  /* Licht von oben: Himmelslicht am Rücken, Kernschatten, bläuliches Reflexlicht der Flanke, Schatten auf Weiß */
  k += weichF(R.band(96, 698, -0.05, 0.3), "#b9cbd8", 0.17, 15);
  k += weichF(R.band(100, 660, 0.5, 0.78), "#000", 0.35, 14);
  k += weichF(R.band(300, 600, 0.72, 0.9), "#3a4b5b", 0.35, 8);
  k += weichF(R.band(260, 640, 0.86, 1.05), "#56677a", 0.38, 7);
  k += weichF(R.band(160, 650, 0.96, 1.08), "#b4c3cc", 0.3, 3);
  /* Glanz der nassen Haut: gebrochene Glanzlinsen entlang des Rückens, Bogen um die Melone */
  k += weichF(R.linse(452, 590, 0.075, 0.02), "#f4f9fc", 0.7, 1.4);
  k += weichF(R.linse(380, 440, 0.085, 0.012), "#f4f9fc", 0.4, 1.2);
  k += weichF(R.linse(176, 300, 0.085, 0.018), "#f4f9fc", 0.5, 1.4);
  k += weichF(R.linse(100, 168, 0.1, 0.022), "#f4f9fc", 0.4, 1.4);
  k += weichF(R.saum(600, 700, 4, 13), "#ffffff", 0.75, 1.6);
  k += weichF(R.saum(560, 640, 3, 7), "#ffffff", 0.35, 1.2);
  k += weichF(R.linse(300, 580, 0.27, 0.06), "#b8cad8", 0.13, 6);
  k += H.kaustik([90, -318, 700, -230], R.band(90, 700, -0.1, 0.36), { op: 0.07, fx: 0.022, fy: 0.04, seed: 23, blur: 1.4, exp: 4 });
  if (F) {
    /* Zahnharken-Narben (hell, parallel) und weiche Hautfalten an der Brustflosse */
    k += H.narbenG([[500, -272, -6, 44, 4, 2.3, 1.2], [440, -258, -14, 38, 3, 2.3, -1], [470, -215, 8, 30, 2, 2.4, 0.8], [270, -262, 10, 40, 3, 2.3, 1], [215, -248, 4, 28, 2, 2.2, -0.8]], "#cfd8de", 0.42, 0.24);
    const falten = [[[566, -186], [559, -176], [556, -166]], [[556, -190], [548, -178], [546, -168]], [[544, -188], [538, -180]]];
    k += weichL(falten, "#000", 2.2, 0.3, 1.1) + weichL(falten.map((z) => z.map((p) => [p[0] + 2.2, p[1]])), "#8fa3b4", 1.2, 0.14, 0.8);
  }
  /* Maullinie: fast gerade, am Mundwinkel leicht abwärts; Lippenlicht darunter */
  const maul = [[700, -203], [684, -202.5], [662, -201.5], [642, -200], [628, -198], [619, -194.5]];
  k += L([maul], "#030405", 1.4, 0.95) + L([maul.slice(0, 5).map((p) => [p[0], p[1] + 1.8])], "#ffffff", 0.7, 0.4);
  s += teil(R.d, SCHWARZ, { innen: k, randA: 0.28 });
  /* nahe Brustflosse: großes, rundes Paddel nach hinten-unten, über dem Körper */
  const flosse = [[586, -168], [582, -150], [570, -130], [550, -110], [526, -96], [500, -88], [480, -88], [470, -95], [474, -108], [490, -124], [510, -142], [532, -160], [556, -174]];
  let fo = weichF([[580, -160], [566, -134], [546, -112], [520, -98], [496, -92], [516, -104], [546, -124], [568, -146]], "#a9bccb", 0.45, 3.5);
  fo += weichF([[476, -96], [492, -116], [514, -136], [538, -156], [528, -164], [504, -146], [484, -124]], "#000", 0.6, 5);
  fo += weichF([[590, -180], [545, -178], [530, -160], [575, -150]], "#000", 0.6, 7);
  fo += weichF([[540, -140], [520, -120], [498, -104], [486, -100], [500, -114], [522, -132]], "#46586a", 0.35, 5);
  s += teil(G(flosse), SCHWARZ, { innen: fo, randA: 0.28 });
  /* Auge */
  s += H.walAuge(auge[0], auge[1], 4.2, { winkel: -6 });
  return H.ende(s, [-64, -483, 700, -88], [560, -320, 702, -150]);
}

/* =====================================================================
   DELFIN (GROSSER TÜMMLER)
   ===================================================================== */
/* RECHERCHE Großer Tümmler (Tursiops truncatus):
   2,5–3,8 m (hier 2,8 m), kräftig gebaut. Kurzer, stumpfer Schnabel (~4 % der Länge), durch eine deutliche
   Kerbe von der runden Melone getrennt; Unterkiefer minimal länger. Maullinie leicht nach oben gebogen,
   Mundwinkel ~10 % hinter der Spitze; Auge knapp dahinter und darüber (~13 %), Blasloch ~14 %. Brustflossen
   mittellang (~14 %), spitz, nach hinten gelegt, Ansatz ~20 % im unteren Drittel. Rückenfinne hoch, sichelförmig
   (falkat, ~9 % hoch), Mitte des Rückens. Schwanzstiel seitlich abgeflacht mit Kielen, Fluke ~22 % Spannweite,
   Kerbe in der Mitte. Färbung: dunkelgrauer „Umhang“ (Cape) von der Melone bis zur Finne, hinter der Finne
   schmal; Flanken heller grau, Bauch weiß bis rosa; unscharfe Grenzen, schwacher dunkler Streifen Auge–Flosse,
   heller Unterkiefer. Viele helle Zahnharken-Narben (parallele Linien) von Artgenossen; Haut glatt, nass glänzend. */
function delfin(T) {
  const H = mach(T), { G, L, teil, weichF, weichL, F } = H;
  const R = H.rumpf(
    [[281, -46.5], [279.6, -49.4], [276.5, -51.4], [272.5, -52.5], [269.5, -53.4, 1], [268.2, -57], [266.6, -61], [263.8, -65.2], [259, -69.4], [252, -72.8], [243, -75.4], [232, -77.4], [215, -80.2], [195, -82.3], [172, -83.4], [150, -83.4], [128, -82.2], [108, -79.8], [88, -75.6], [68, -69.8], [50, -63.6], [36, -59], [24, -56]],
    [[281, -46.5], [280.4, -44], [278, -42], [273, -40.4], [266, -39.1], [257, -37.7], [246, -35.4], [232, -32.2], [215, -29.2], [195, -27.4], [172, -27], [150, -27.8], [128, -29.8], [108, -33], [88, -37.5], [68, -42], [50, -45.8], [36, -48], [24, -49.2]],
    [[12, -58], [0, -60.2], [-10, -62.4], [-18, -64.2], [-21.5, -63.8, 1], [-16, -60.4], [-9, -57], [-3, -54.4], [-0.5, -52.8, 1], [-4, -51], [-11, -47.8], [-19, -43.8], [-25, -40.2, 1], [-20.5, -39.8], [-8, -43.4], [4, -46.4], [14, -48]]);
  const P = R.P;
  const RUECKEN = "#434b55", FLANKE = "#949da5", BAUCH = "#ece9e4";
  let s = "";
  /* Rückenfinne: hoch, sichelförmig, Spitze nach hinten */
  const fRand = [[170, -80.5], [163, -85.5], [154, -91.5], [144, -98], [133, -104], [122, -108.6], [113, -110.8], [107.5, -111, 1], [109.5, -107.4], [113.5, -102], [116.4, -95.6], [117.6, -89.4], [117.2, -85], [115, -81.6], [110, -79]];
  let fi = weichF([[166, -83], [154, -90.5], [140, -99], [126, -106], [113, -110], [124, -105], [138, -97], [152, -88.5]], "#d2dee6", 0.55, 0.9);
  fi += weichF([[110, -108], [114, -101], [117, -93], [118, -85], [114, -82], [113, -92], [111, -101]], "#000", 0.35, 2);
  fi += weichF([[170, -79], [150, -86], [128, -86], [117, -80], [140, -77]], "#000", 0.3, 3);
  if (F) fi += H.narbenG([[146, -92, 18, 16, 3, 0.9, 1], [128, -100, 30, 10, 2, 0.9, -1]], "#dfe6ea", 0.22, 0.4);
  s += teil(G(fRand.concat([[145, -74]])), RUECKEN, { innen: fi, randD: G(fRand, false), randA: 0.22, rw: 0.4 });
  /* ---- Rumpf ---- */
  let k = "";
  /* Flankengrau, darüber der dunkle Umhang (Cape), unten der helle Bauch – alles weich verlaufend */
  k += `<path d="${R.muster([[300, 0.38], [262, 0.42], [244, 0.42], [225, 0.4], [200, 0.38], [175, 0.38], [150, 0.36], [126, 0.32], [104, 0.34], [80, 0.4], [50, 0.42], [20, 0.4], [-40, 0.3], [-40, 1.2], [300, 1.2]])}" fill="${FLANKE}" filter="${H.weich(5, [-40, -85, 300, -25])}"/>`;
  /* heller Schimmer („Blaze“) über der Brustflosse, schräg zur Finne ansteigend */
  k += `<path d="${R.muster([[232, 0.62], [212, 0.52], [190, 0.44], [170, 0.4], [152, 0.42], [168, 0.5], [190, 0.58], [214, 0.66]])}" fill="#b4bbc1" opacity=".3" filter="${H.weich(3.5, [140, -75, 240, -30])}"/>`;
  k += `<path d="${G([[300, -40], ...[[268, 0.52], [258, 0.58], [248, 0.66], [236, 0.7], [222, 0.74], [205, 0.76], [180, 0.75], [155, 0.73], [130, 0.74], [108, 0.78], [90, 0.84], [76, 0.94], [66, 1.1]].map((q) => P(q[0], q[1])), [60, -20, 1], [300, -20, 1]])}" fill="${BAUCH}" filter="${H.weich(3.4, [55, -60, 300, -20])}"/>`;
  /* Unterkiefer hell, Oberkiefer grau */
  k += `<path d="${G([[285, -47], [276, -46.8], [266, -47.8], [258, -48.4], [252, -50.4], [248, -49], [252, -44], [262, -38], [285, -38]])}" fill="#dcdcd8" filter="${H.weich(0.6, [245, -53, 285, -37])}"/>`;
  /* Augenstreifen (schwach) Auge → Brustflosse, heller „Blaze“ über der Flosse */
  k += weichF([[246, -60], [236, -55.5], [228, -50], [222, -45], [218, -41], [222, -40], [230, -46], [240, -53], [247, -57.5]], "#3c444c", 0.4, 1.6);
  k += weichF(R.linse(150, 214, (x, u) => 0.52 - u * 0.04, 0.05), "#c7cdd2", 0.35, 3);
  /* Licht von oben: Himmelslicht, Eigenschatten der unteren Hälfte, Reflexlicht am Bauchrand */
  k += H.rampe(R, 20, 280, [-0.1, -0.1, -0.1], 0.14, "#dce8f0", 0.06, 3) + H.rampe(R, 20, 280, [-0.1, -0.1], 0.26, "#dce8f0", 0.05, 5);
  k += H.rampe(R, 24, 268, [0.4, 0.5, 0.6, 0.7, 0.8], 0.98, "#16202a", 0.045, 5);
  k += weichF(R.band(60, 262, 0.86, 1.06), "#6f7d89", 0.3, 2.4);
  if (F) k += weichF(R.band(70, 262, 0.96, 1.06), "#f2f2ee", 0.22, 1);
  /* Form: Schatten unter der Melone zum Schnabel, Hals leicht eingezogen, Brustkorb gewölbt, Kiel am Schwanzstiel */
  k += weichF([[270, -54], [266, -58], [262, -60], [258, -56], [260, -50], [268, -49]], "#1c252e", 0.3, 1.6);
  if (F) k += weichF(R.linse(205, 245, 0.3, 0.12), "#1c252e", 0.1, 3) + weichF(R.linse(130, 200, 0.42, 0.14), "#ffffff", 0.08, 4);
  k += weichF(R.linse(24, 100, 0.12, 0.03), "#e6eff5", 0.3, 0.8);
  k += weichF(R.linse(30, 95, 0.62, 0.2), "#16202a", 0.15, 2.5);
  /* Glanzlinsen der nassen Haut: Melone, Rücken, Flanke */
  k += weichF(R.saum(230, 281, 1.4, 4.2), "#ffffff", 0.75, 0.6);
  k += weichF(R.linse(172, 226, 0.09, 0.022), "#ffffff", 0.7, 0.6);
  if (F) k += weichF(R.linse(122, 166, 0.085, 0.016), "#ffffff", 0.45, 0.5);
  k += weichF(R.linse(40, 112, 0.1, 0.022), "#ffffff", 0.55, 0.6);
  k += weichF(R.linse(150, 240, 0.3, 0.05), "#eaf2f7", 0.2, 2);
  k += weichF(R.linse(255, 278, (x, u) => 0.18 + u * 0.08, 0.06), "#ffffff", 0.5, 0.5);
  k += H.kaustik([20, -86, 282, -55], R.band(20, 282, -0.1, 0.38), { op: 0.06, fx: 0.07, fy: 0.12, seed: 5, blur: 0.6, exp: 5, mblur: 4 });
  /* Fluke: Kante am Stiel, Licht auf den Vorderkanten, Schatten der nahen auf die ferne Hälfte */
  k += weichF([[26, -57], [12, -58], [2, -55], [-1, -52.8], [2, -50], [12, -48], [26, -49], [18, -53]], "#000", 0.35, 1.8);
  k += weichF([[22, -57.5], [8, -59], [-6, -61.6], [-20, -64], [-8, -60.4], [6, -57.4]], "#e3edf3", 0.4, 0.6);
  k += weichF([[22, -48.6], [8, -47.4], [-6, -44.6], [-23, -40.6], [-9, -43.8], [6, -46.4]], "#e3edf3", 0.4, 0.6);
  if (F) k += weichF([[-21, -63.6], [-16, -60.2], [-8, -56.4], [-1, -53], [-8, -55], [-16, -58.8]], "#000", 0.35, 0.9);
  /* Narben: helle Zahnharken in Gruppen (fast gerade, parallel), einzelne ältere Kratzer */
  if (F) {
    k += H.narbenG([[212, -67, -12, 15, 3, 0.85, 0.4], [190, -58, 4, 12, 4, 0.8, -0.3], [170, -71, -6, 16, 3, 0.85, 0.3], [138, -55, -10, 13, 3, 0.8, -0.3], [100, -66, 12, 12, 3, 0.8, 0.3], [228, -48, 22, 8, 2, 0.7, 0.3], [76, -60, -6, 10, 2, 0.7, 0]], "#e4eaee", 0.2, 0.38);
    k += H.narbenG([[184, -66, 2, 7, 1, 1, 0.5], [150, -72, -6, 6, 1, 1, 0.5], [118, -50, 8, 8, 1, 1, -0.5]], "#f4f6f7", 0.35, 0.3);
  }
  /* Kerbe Schnabel/Melone, Maullinie (leicht ansteigend), Lippenlicht, Blasloch, Ohröffnung */
  k += weichL([[[269.6, -53.6], [268.6, -52.2], [266.4, -50.8], [263, -49.4]]], "#1b2228", 0.6, 0.55, 0.35);
  k += weichL([[[268.4, -56.4], [267.4, -60.4], [265.2, -64.6]]], "#ffffff", 0.6, 0.35, 0.4);
  const maul = [[281, -46.6], [276, -46.7], [268, -47.1], [261, -47.7], [256, -48.6], [253, -49.6], [251.6, -50.6]];
  k += L([maul], "#141a1f", 0.55, 0.95) + L([maul.slice(0, 5).map((p) => [p[0], p[1] + 0.7])], "#ffffff", 0.35, 0.5);
  k += L([[[241, -76.2], [238.5, -76.6], [236, -76.5]]], "#20272d", 0.6, 0.6);
  s += teil(R.d, RUECKEN, { innen: k, randA: 0.22, rw: 0.4 });
  /* Brustflosse: spitz, nach hinten-unten, über dem Körper */
  const flosse = [[228, -38], [225, -31.5], [219.5, -25.6], [212, -20.4], [204, -16.2], [197.6, -13.8], [194, -13.4, 1], [197, -16.6], [201.5, -21], [206.5, -26.2], [211.5, -31.4], [216.5, -36.6], [221, -40]];
  let fo = weichF([[226, -35], [220, -27.6], [212, -21.6], [203, -16.6], [196.5, -14.2], [204, -19], [213, -25.6], [221, -32]], "#dbe6ed", 0.5, 0.9);
  fo += weichF([[196.6, -15.6], [202, -21.6], [208, -28], [214, -35], [210, -36], [204, -28.6], [199, -21.6]], "#000", 0.35, 1.4);
  fo += weichF([[230, -42], [214, -41], [208, -35], [224, -31]], "#000", 0.45, 2.4);
  s += teil(G(flosse), "#5d6771", { innen: fo, randA: 0.22, rw: 0.4 });
  s += weichF([[249, -58], [244, -61.5], [237, -61], [232, -58], [236, -55], [244, -54.6]], "#20282f", 0.35, 1.2);
  s += H.walAuge(244, -58.2, 1.3, { winkel: -8, hell: "#dbe5ec" });
  return H.ende(s, [-25, -111, 281, -13.4], [222, -82, 283, -30]);
}

/* =====================================================================
   WEISSER HAI
   ===================================================================== */
/* RECHERCHE Weißer Hai (Carcharodon carcharias):
   4–6 m (hier 4,5 m), schwerer Spindelkörper, größte Höhe ~21 % an der ersten Rückenflosse. Schnauze kegelig,
   stumpf zugespitzt, Vorderende des Mauls (unterständig) ~8 % hinter der Spitze, etwa unter dem Auge; Mundwinkel
   ~16 %. Auge rund, schwarz (Iris sehr dunkelblau), ohne sichtbare Nickhaut. Oberkieferzähne breit dreieckig,
   gesägt, ragen bei geschlossenem Maul über die Unterlippe; Unterkieferzähne schmaler. Fünf LANGE Kiemenspalten,
   alle VOR dem Brustflossenansatz. Lorenzinische Ampullen: dunkle Poren, dicht an Schnauzenspitze und -unterseite,
   Reihen unter und vor dem Auge. Brustflossen groß, sichelförmig (~18 % der Länge), Spitzen unterseits schwarz,
   schwarzer Achselfleck. Erste Rückenflosse groß, dreieckig, Ursprung über dem Innenrand der Brustflosse; zweite
   Rücken- und Afterflosse winzig. Schwanzstiel abgeflacht mit kräftigem Seitenkiel bis auf die Schwanzflosse;
   Schwanzflosse halbmondförmig, fast symmetrisch (oberer Lappen etwas länger). Färbung: oben schiefergrau bis
   bronzegrau, scharfe, unregelmäßig gezackte Grenze zum weißen Bauch (jedes Tier eigen); Haut matt-samtig
   (Hautzähnchen), wenig Glanz, oft helle Narben. */
function weisser_hai(T) {
  const H = mach(T), { G, L, teil, weichF, weichL, F, f } = H;
  const GRAU = "#596166", WEISS = "#eeede8";
  const R = H.rumpf(
    [[450, -90], [448, -95.5], [443.5, -101.5], [435, -108.5], [421, -116], [402, -123.5], [378, -130.5], [350, -136.5], [320, -141.5], [290, -144], [258, -143.6], [224, -139.8], [190, -133], [156, -124], [128, -116.5], [108, -111.5], [92, -108.5]],
    [[450, -90], [449, -85.5], [446, -81.5], [440.5, -77.6], [432, -73.8], [424, -71.2], [418.5, -70], [412, -66.4], [404, -62.2], [392, -58.8], [378, -56.6], [362, -54.6], [340, -52.2], [315, -50.1], [285, -48.6], [255, -49.4], [225, -53.4], [195, -60.4], [165, -69.4], [140, -78.4], [120, -86], [104, -91.6], [92, -94.4]],
    [[80, -113], [64, -124], [48, -137], [32, -151], [18, -164], [8, -172], [2, -175.5, 1], [8, -166], [16, -152], [26, -136], [36, -120], [43, -108], [46.5, -101.5, 1], [43, -93], [35, -80], [26, -66], [17, -53], [10, -44.5, 1], [22, -49], [38, -61], [56, -75], [72, -86], [82, -91]]);
  const P = R.P;
  let s = "";
  /* erste Rückenflosse: groß, dreieckig, Spitze leicht gerundet, Hinterrand konkav, freie Hinterspitze */
  const r1 = [[316, -139], [309, -150], [300, -164], [290, -178], [280, -190], [272, -198], [266.5, -200.5], [263, -198.4], [262, -192], [259.5, -180], [254.5, -167], [248, -155.5], [242.5, -148.5], [238.5, -145.6, 1], [246, -144.6], [254, -142.6]];
  let ri = weichF([[310, -147], [298, -165], [286, -181], [274, -194], [268, -199], [280, -186], [293, -170], [304, -153]], "#c9d2d8", 0.4, 1.4);
  ri += weichF([[264, -196], [262, -185], [258, -172], [252, -160], [246, -150], [252, -151], [258, -164], [262, -178]], "#000", 0.4, 2.4);
  ri += weichF([[318, -136], [290, -150], [260, -150], [240, -142], [280, -134]], "#000", 0.28, 4);
  if (F) ri += H.narbenG([[292, -170, 60, 16, 2, 1.4, 0.6]], "#d7dde0", 0.35, 0.35);
  s += teil(G(r1.concat([[280, -130]])), GRAU, { innen: ri, randD: G(r1, false), randA: 0.25, rw: 0.5 });
  /* ---- Rumpf ---- */
  let k = "";
  /* Bauchweiß mit scharfer, unregelmäßig gezackter Grenze: über dem Maul, unter dem Auge, durch die Kiemenspalten,
     hinter der Brustflosse helle Zungen nach oben, dann zum Schwanzstiel hin abfallend */
  const grenze = [[456, 0.72], [447, 0.7], [440, 0.665, 1], [434, 0.69], [428, 0.675], [423, 0.645, 1], [418, 0.665], [411, 0.635, 1], [404, 0.65], [398, 0.62, 1], [392, 0.635], [385, 0.6, 1], [379, 0.625], [372, 0.6, 1], [366, 0.63], [359, 0.615, 1], [352, 0.645], [345, 0.66, 1], [339, 0.695], [333, 0.665, 1], [329, 0.6], [326, 0.545, 1], [323, 0.575], [319, 0.61, 1], [315, 0.585, 1], [311, 0.635], [305, 0.645, 1], [298, 0.675], [291, 0.665, 1], [286, 0.62, 1], [282, 0.665], [274, 0.695, 1], [266, 0.685], [259, 0.705, 1], [252, 0.675], [248, 0.65, 1], [244, 0.69], [236, 0.715, 1], [228, 0.725], [220, 0.71, 1], [212, 0.745], [203, 0.755, 1], [194, 0.77], [186, 0.75, 1], [180, 0.775], [168, 0.8], [154, 0.84], [138, 0.875], [124, 0.92], [112, 0.98], [102, 1.15], [96, 1.4]];
  k += `<path d="${G(grenze.map((q) => { const p = P(q[0], q[1]); if (q[2]) p.push(1); return p; }).concat([[90, -40, 1], [460, -40, 1]]))}" fill="${WEISS}" filter="${H.weich(0.3, [85, -130, 462, -40])}"/>`;
  if (F) k += H.narbenG([[316, -84, 8, 3, 1, 1, 0], [300, -82, -10, 2.5, 1, 1, 0], [262, -80, 4, 3, 1, 1, 0]], WEISS, 1.4, 0.8);
  /* Maul fast geschlossen: Oberkieferzähne (breit, dreieckig, leicht nach hinten geneigt, unregelmäßig) ragen über
     die Unterlippe, Basis von der Oberlippe verdeckt; schmaler dunkler Spalt; Lippenfurche am Mundwinkel */
  const U = [[419, -70.2], [411, -69.7], [402, -70.1], [393, -71.3], [385.5, -73.3], [379.5, -75.8]];
  const Lu = U.map((p, i) => [p[0] - 0.3, p[1] + 1.2 - i * 0.18]);
  k += `<path d="${G(U.concat(Lu.slice().reverse()))}" fill="#1e0f0d"/>`;
  let zg = "", zb = "";
  const zd = H.dicht(U, false, 8);
  for (let i = 0; i < 12; i++) {
    if (i === 4 || i === 9) continue;
    const u = (i + 0.3 + T.rnd() * 0.4) / 12, p = zd[Math.min(zd.length - 1, Math.round(u * (zd.length - 1)))];
    const h = (2.9 - 1.6 * u) * (0.75 + T.rnd() * 0.4), b = 2.7 - 1.3 * u, x = p[0], y = p[1] + 0.2, kp = b * (0.08 + T.rnd() * 0.12);
    zg += `M${f(x + b / 2)} ${f(y)}C${f(x + b * 0.38)} ${f(y + h * 0.5)} ${f(x + b * 0.02 - kp)} ${f(y + h * 0.85)} ${f(x - b * 0.1 - kp)} ${f(y + h)}C${f(x - b * 0.24 - kp)} ${f(y + h * 0.7)} ${f(x - b * 0.44)} ${f(y + h * 0.35)} ${f(x - b / 2)} ${f(y)}Z`;
    zb += `M${f(x + b / 2)} ${f(y)}L${f(x + b * 0.3)} ${f(y + h * 0.42)}L${f(x - b * 0.34)} ${f(y + h * 0.42)}L${f(x - b / 2)} ${f(y)}Z`;
  }
  k += `<path d="${zg}" fill="#efe8d6" stroke="#5e5444" stroke-width=".18" stroke-opacity=".5"/>`;
  if (F) k += `<path d="${zb}" fill="#9a8a6a" opacity=".5"/>`;
  if (F) k += `<path d="${zg}" fill="none" stroke="#fff" stroke-width=".22" stroke-opacity=".55" transform="translate(.3 -.1)"/>`;
  /* Oberlippe (Hautfalte) deckt die Zahnbasis; Lippenfurche hinter dem Mundwinkel */
  k += `<path d="${G(U.concat(U.slice().reverse().map((p) => [p[0] + 0.4, p[1] - 1.3])))}" fill="${WEISS}"/>`;
  k += L([U], "#3b3f42", 0.5, 0.55) + weichL([[[379.5, -75.8], [375, -78.4], [371, -80.6]], [[380, -74.4], [376, -75.6]]], "#3b4146", 0.8, 0.35, 0.4);
  k += weichL([Lu.map((p) => [p[0], p[1] + 2.2])], "#3b4146", 1.2, 0.18, 0.7);
  /* Licht: ein Licht von oben vorn – helle Rückenkante, Kernschatten im unteren Drittel, Reflexlicht am Bauch */
  k += H.rampe(R, 90, 452, [-0.1, -0.1], 0.2, "#e7eef2", 0.07, 4) + H.rampe(R, 90, 452, [-0.1], 0.38, "#e7eef2", 0.05, 7);
  k += H.rampe(R, 90, 448, [0.5, 0.6, 0.68, 0.76], 0.97, "#1b2731", 0.07, 4);
  k += weichF(R.band(130, 420, 0.92, 1.06), "#ffffff", 0.2, 2.2);
  k += weichF(R.linse(170, 400, 0.075, 0.03), "#eef4f7", 0.32, 1.6);
  k += weichF(R.saum(398, 452, 1.5, 6), "#eef4f7", 0.42, 1.2);
  k += weichF(R.linse(96, 170, 0.12, 0.05), "#eef4f7", 0.22, 1.6);
  if (F) k += [[350, 0.3, 30, 9, "#000", 0.06], [250, 0.22, 40, 10, "#000", 0.05], [180, 0.4, 26, 8, "#fff", 0.05], [300, 0.45, 34, 8, "#fff", 0.04], [140, 0.25, 20, 6, "#000", 0.05]].map(([x, t, rx, ry, c, o]) => { const [px, py] = P(x, t); return weichF([[px - rx, py], [px, py - ry], [px + rx, py], [px, py + ry]], c, o, 5); }).join("");
  /* Okklusion unter der Schnauze, Schatten der Brustflosse auf dem Bauch */
  k += weichF([[440, -82], [425, -76], [404, -68], [395, -62], [420, -66], [442, -76]], "#2a333a", 0.18, 2.4);
  k += weichF([[338, -60], [320, -52], [300, -50], [292, -58], [318, -62]], "#1b2731", 0.28, 3.5);
  /* Kiemenspalten: fünf lange, leicht geschwungene Spalten (spitz auslaufend), vorn Schatten, hinten heller Lappen */
  const kiemen = [];
  for (let i = 0; i < 5; i++) {
    const x = 373 - i * 8.2 + i * i * 0.25, a = 0.26 + i * 0.015, b = 0.79 - i * 0.02;
    kiemen.push([P(x + 2.4, a), P(x + 0.4, a + (b - a) * 0.3), P(x - 0.6, a + (b - a) * 0.62), P(x + 1.2, b)]);
  }
  if (F) {
    k += weichL(kiemen.map((z) => z.map((p) => [p[0] + 2.2, p[1]])), "#000", 3.6, 0.16, 1.6);
    k += weichL(kiemen.map((z) => z.map((p) => [p[0] - 1.8, p[1]])), "#ffffff", 2.4, 0.16, 1);
    const spalt = (z, w) => { const d = H.dicht(z, false, 6); return G(H.saum(d.map((p) => [p[0], p[1]]), -w, w)); };
    k += `<path d="${kiemen.map((z) => spalt(z, 0.75)).join("")}" fill="#171b1e" opacity=".72"/>`;
    k += L(kiemen.map((z) => z.map((p) => [p[0] - 0.9, p[1]])), "#e9eef1", 0.4, 0.18);
  } else k += L(kiemen, "#171b1e", 1.4, 0.7);
  /* Seitenkiel am Schwanzstiel: schmale Lichtkante, Schatten darunter */
  k += weichL([[P(120, 0.49), P(104, 0.48), P(92, 0.47), [74, -102.5], [60, -103.2]]], "#eef3f6", 0.9, 0.2, 0.6);
  k += weichL([[P(120, 0.58), P(104, 0.58), P(92, 0.58), [74, -99.5], [60, -100.8]]], "#000", 1.8, 0.2, 1);
  /* Schwanzflosse: Licht auf den Vorderkanten, dunkler Hinterrand */
  k += weichF([[82, -112], [62, -125], [44, -140], [24, -157], [4, -174], [16, -162], [36, -146], [56, -128], [72, -117]], "#d5dde2", 0.28, 1.4);
  k += weichF([[2, -175], [9, -163], [18, -148], [30, -130], [41, -112], [46, -102], [38, -110], [26, -128], [14, -148], [6, -164]], "#000", 0.3, 1.6);
  k += weichF([[80, -90], [60, -79], [40, -63], [22, -49.6], [12, -45], [28, -54], [46, -67], [64, -80]], "#d5dde2", 0.22, 1.4);
  /* Narben (hell, alt) */
  if (F) k += H.narbenG([[330, -118, -8, 22, 2, 1.6, 0.5], [262, -112, 10, 28, 3, 1.5, -0.4], [210, -102, -4, 16, 1, 1, 0.6]], "#d9dfe2", 0.4, 0.35);
  /* Lorenzinische Ampullen: feine dunkle Poren in Feldern und Reihen */
  if (F) {
    let po = "";
    const feld = (n, x0, x1, t0, t1, reihe) => {
      for (let i = 0; i < n; i++) {
        const x = x0 + T.rnd() * (x1 - x0), t = t0 + T.rnd() * (t1 - t0), [px, py] = P(x, t);
        if (Math.hypot(px - 414, py + 99) < 5) continue;
        po += `M${f(px)} ${f(py)}h.01`;
      }
    };
    feld(40, 437, 450, 0.34, 0.88); feld(18, 422, 438, 0.55, 0.82); feld(14, 398, 424, 0.56, 0.66); feld(5, 416, 432, 0.3, 0.42);
    k += `<path d="${po}" stroke="#14191c" stroke-width=".55" stroke-linecap="round" stroke-opacity=".5" fill="none"/>`;
  }
  /* Nasenloch (Unterseite der Schnauze, von der Seite als Schlitz) */
  k += weichL([[[442, -82.6], [438.5, -81.6], [435, -81.8]]], "#1a1e22", 1.1, 0.45, 0.3);
  s += teil(R.d, GRAU, { innen: k, randA: 0.22, rw: 0.5 });
  /* zweite Rückenflosse und Afterflosse: winzig */
  s += teil(G([[126, -114.5], [118, -121], [112, -123.6], [108.6, -122.6], [108, -117], [105, -112.2], [116, -111]]), GRAU, { innen: weichF([[124, -116], [116, -121], [111, -122.6], [116, -119]], "#d5dde2", 0.3, 0.8) + weichF([[126, -112], [112, -115], [104, -111], [116, -109]], "#000", 0.25, 1.5), randA: 0.22, rw: 0.4 });
  s += teil(G([[122, -88.6], [116, -83.4], [111, -81], [108.4, -81.6], [108, -85.4], [105.6, -90.6], [114, -91]]), "#6a7277", { innen: weichF([[124, -90], [110, -88], [104, -92], [116, -93]], "#000", 0.25, 1.5), randA: 0.22, rw: 0.4 });
  /* Bauchflosse */
  s += teil(G([[208, -59.6], [198, -50], [186, -41.6], [176, -36.4], [170.5, -36.6, 1], [173, -42], [176.5, -50], [184, -62]]), "#788086", { innen: weichF([[205, -56], [190, -46], [176, -38.4], [184, -46], [196, -55]], "#e9eef1", 0.32, 1) + weichF([[176, -40], [180, -50], [186, -60], [178, -58]], "#000", 0.3, 2) + weichF([[212, -64], [190, -62], [182, -56], [200, -52]], "#000", 0.35, 2.4), randA: 0.22, rw: 0.4 });
  /* Brustflosse: groß, sichelförmig nach hinten-unten; Vorderkante im Licht, Spitze dunkel, Achselfleck */
  const bf = [[343, -70], [339, -59], [331, -46], [319, -33], [305, -22.4], [292, -15.4], [283, -12.6, 1], [287.6, -17.4], [294, -25.6], [300.5, -35.6], [307.5, -46.6], [314.5, -58], [321, -67]];
  let bi = weichF([[340, -64], [331, -48], [318, -34], [302, -21.6], [288, -14.4], [300, -22.6], [315, -35], [328, -50], [336, -62]], "#dbe3e8", 0.45, 1.3);
  bi += weichF([[302, -24], [292, -17], [283.4, -12.8], [289, -19], [297, -27]], "#0b0e10", 0.6, 2);
  bi += weichF([[286, -16], [296, -30], [305, -44], [313, -56], [320, -66], [313, -64], [303, -50], [293, -34]], "#000", 0.35, 2.2);
  bi += weichF([[348, -78], [324, -75], [318, -65], [338, -60]], "#000", 0.42, 3);
  s += `<path d="${G([[324, -68], [318.6, -63.8], [315, -61], [317.6, -67]])}" fill="#0b0d0f" opacity=".6" filter="${H.weich(1, [311, -71, 327, -58])}"/>`;
  s += teil(G(bf), GRAU, { innen: bi, randA: 0.22, rw: 0.5 });
  /* Auge: in einer flachen Höhle, Wulst darüber wirft Schatten; schwarz mit sehr dunkelblauer Iris, Glanzpunkt */
  const ax = 414, ay = -99, ar = 2.4;
  s += `<ellipse cx="${ax}" cy="${f(ay - 0.6)}" rx="${f(ar * 2.6)}" ry="${f(ar * 2.1)}" fill="${T.rg("haiHoehle", [[0, "#000", 0.42], [0.55, "#000", 0.16], [1, "#000", 0]])}"/>`;
  s += weichF([[ax - ar * 2.2, ay - ar * 1.5], [ax, ay - ar * 2.3], [ax + ar * 2.2, ay - ar * 1.4], [ax + ar * 1.4, ay - ar * 0.9], [ax - ar * 1.4, ay - ar * 0.9]], "#dfe6ea", 0.22, 0.8);
  s += `<circle cx="${ax}" cy="${ay}" r="${f(ar * 1.14)}" fill="#2b3236" filter="${H.weich(0.25, [ax - 3, ay - 3, ax + 3, ay + 3])}"/>`;
  s += `<circle cx="${ax}" cy="${ay}" r="${ar}" fill="${T.rg("haiAuge", [[0, "#030407"], [0.5, "#06090e"], [0.82, "#121b27"], [1, "#04060a"]], 0.5, 0.5, 0.5)}"/>`;
  if (F) s += `<circle cx="${f(ax + 0.12)}" cy="${ay}" r="${f(ar * 0.5)}" fill="#010203"/>`;
  s += `<path d="M${f(ax - ar)} ${f(ay - ar * 0.15)}A${f(ar)} ${f(ar)} 0 0 1 ${f(ax + ar)} ${f(ay - ar * 0.15)}" fill="${T.lg("haiLid", [[0, "#000", 0.6], [1, "#000", 0]])}"/>`;
  s += `<ellipse cx="${f(ax + ar * 0.38)}" cy="${f(ay - ar * 0.36)}" rx="${f(ar * 0.22)}" ry="${f(ar * 0.15)}" fill="#fff" opacity=".85"/>`;
  s += `<path d="M${f(ax - ar * 0.9)} ${f(ay + ar * 0.55)}A${f(ar * 1.05)} ${f(ar * 1.05)} 0 0 0 ${f(ax + ar * 0.9)} ${f(ay + ar * 0.55)}" fill="none" stroke="#b9cad6" stroke-width=".3" stroke-opacity=".45"/>`;
  return H.ende(s, [2, -200.5, 450, -12.6], [372, -136, 452, -56]);
}

/* =====================================================================
   BUCKELWAL
   ===================================================================== */
/* RECHERCHE Buckelwal (Megaptera novaeangliae):
   12–16 m (hier 14 m), massig; Kopf flach, von oben gesehen schmal-rund, ~¼ der Länge; Oberseite der Schnauze,
   Oberkieferrand und Unterkiefer mit faustgroßen KNOTEN (Tuberkel, je ein Tasthaar), am Unterkieferende ein
   runder Kinnhöcker mit Seepocken. Maullinie stark gewölbt, Auge knapp hinter/über dem Mundwinkel. 14–35 breite
   KEHLFURCHEN vom Kinn bis zum Nabel (~½ der Länge), dazwischen oft weiß. BRUSTFLOSSEN riesig, ~⅓ der Länge,
   schmal, Vorderkante mit großen Höckern, im Atlantik meist weiß. Kleine Rückenfinne auf einem Buckel bei ~⅔ der
   Länge, dahinter eine Reihe Höcker („Knöchel“) auf dem Schwanzstiel. Fluke bis ⅓ der Länge breit, Hinterrand
   unregelmäßig gezackt, Unterseite individuell schwarz-weiß. Oberseite schwarz bis dunkelgrau, Bauch/Kehle weiß
   gefleckt. SEEPOCKEN (Coronula) an Kinn, Kehle, Flossenkanten, Fluke, Genitalregion; helle Narben. */
function buckelwal(T) {
  const H = mach(T, 0), { G, L, teil, weichF, weichL, F, f } = H;
  const DUNKEL = "#22272d", WEISS = "#e6e7e2";
  const R = H.rumpf(
    [[1398, -226], [1395, -234], [1382, -242], [1352, -252], [1302, -264], [1242, -276], [1182, -287], [1124, -296], [1092, -303], [1074, -306], [1040, -311], [980, -320], [910, -329], [830, -336], [750, -339], [670, -338], [600, -335], [548, -336], [512, -337], [470, -330], [420, -320], [370, -306], [318, -289], [262, -270], [206, -252], [156, -237], [116, -228], [84, -222]],
    [[1398, -226], [1401, -213], [1397, -199], [1385, -186], [1364, -174], [1330, -160], [1280, -143], [1220, -127], [1160, -114], [1090, -103], [1010, -97], [940, -94], [860, -95], [780, -100], [700, -110], [620, -124], [540, -142], [460, -161], [380, -178], [300, -191], [226, -196], [160, -194], [116, -190], [84, -187]],
    [[62, -226], [36, -232], [10, -239], [-16, -246], [-38, -251], [-50, -252, 1], [-43, -246], [-37, -241], [-35, -236], [-27, -230], [-26, -225], [-17, -219], [-14, -213], [-7, -207], [-3, -204, 1], [-9, -199], [-16, -193], [-16, -188], [-26, -181], [-27, -176], [-38, -168], [-40, -162], [-51, -154], [-60, -148, 1], [-46, -150], [-20, -158], [10, -167], [40, -176], [64, -182]]);
  const P = R.P;
  let s = "";
  /* Rückenfinne: klein, auf einem Buckel */
  const rf = [[548, -334], [536, -344], [520, -356], [504, -366], [491, -371], [484, -369, 1], [486, -361], [484, -350], [476, -339], [466, -332]];
  s += teil(G(rf.concat([[510, -320]])), DUNKEL, { innen: weichF([[540, -342], [520, -356], [500, -367], [490, -370], [506, -360], [526, -348]], "#b4c4d0", 0.4, 2) + weichF([[490, -362], [484, -348], [474, -336], [486, -340]], "#000", 0.4, 3), randD: G(rf, false), randA: 0.25, rw: 1.2 });
  /* ---- Rumpf ---- */
  let k = "";
  /* weiße, gefleckte Kehle/Bauch (Kehlfurchenfeld), Grenze unregelmäßig */
  const bauch = [[1390, 0.8], [1360, 0.78], [1320, 0.74], [1280, 0.72], [1240, 0.73], [1200, 0.7], [1160, 0.71], [1120, 0.68], [1080, 0.7], [1040, 0.72], [1000, 0.7], [960, 0.73], [920, 0.75], [880, 0.74], [840, 0.77], [800, 0.8], [760, 0.84], [720, 0.88], [680, 0.92], [640, 0.98], [600, 1.2]];
  k += `<path d="${G(bauch.map((q) => P(q[0], q[1])).concat([[590, -60, 1], [1420, -60, 1]]))}" fill="${WEISS}" filter="${H.weich(2, [580, -260, 1420, -60])}"/>`;
  /* dunkle Flecken im Weiß (individuelles Muster) */
  if (F) k += [[1300, 0.86, 22, 8], [1210, 0.82, 30, 7], [1120, 0.9, 18, 6], [1010, 0.8, 26, 9], [930, 0.86, 16, 6], [860, 0.92, 22, 6], [760, 0.9, 14, 5]].map(([x, t, rx, ry]) => { const [px, py] = P(x, t); return weichF([[px - rx, py], [px - rx * 0.3, py - ry], [px + rx, py - ry * 0.2], [px + rx * 0.2, py + ry]], DUNKEL, 0.7, 2); }).join("");
  /* Kehlfurchen: lange Furchen vom Kinn bis zum Nabel (dunkle Rinne + helle Kante) */
  const furchen = [];
  for (let i = 0; i < 10; i += F ? 1 : 2) {
    const t = 0.7 + i * 0.03, xe = 760 + i * 6 - (i % 3) * 14;
    const z = [];
    for (let j = 0; j <= 8; j++) { const x = 1372 - (1372 - xe) * j / 8; z.push(P(x, t + (1 - t) * 0.08 * Math.sin(j / 8 * Math.PI) + (T.rnd() - 0.5) * 0.008 - (j === 0 ? 0.06 : 0))); }
    furchen.push(z);
  }
  k += L(furchen, "#2d3238", 2.4, 0.4) + (F ? L(furchen.map((z) => z.map((p) => [p[0], p[1] + 2.4])), "#ffffff", 1.6, 0.28) + weichL(furchen.filter((z, i) => i % 2).map((z) => z.map((p) => [p[0], p[1] + 5])), "#000", 4, 0.08, 2) : "");
  /* Licht von oben: Himmelslicht, Kernschatten im unteren Drittel, Reflexlicht am Bauch */
  k += H.rampe(R, 84, 1398, [-0.1, -0.1, -0.1], 0.2, "#c4d4e0", 0.09, 12) + H.rampe(R, 84, 1398, [-0.1, -0.1], 0.42, "#c4d4e0", 0.06, 22);
  k += H.rampe(R, 84, 1390, [0.45, 0.55, 0.64, 0.72], 0.96, "#0d151d", 0.08, 14);
  k += weichF(R.band(400, 1360, 0.94, 1.06), "#cfd8dd", 0.3, 6);
  /* Glanz: Kopfoberseite, Rücken, Buckel */
  k += weichF(R.saum(1040, 1398, 5, 16), "#eef5f9", 0.5, 3);
  k += weichF(R.linse(620, 1000, 0.06, 0.018), "#eef5f9", 0.55, 3);
  k += weichF(R.linse(380, 560, 0.07, 0.02), "#eef5f9", 0.45, 3);
  k += weichF(R.linse(130, 360, 0.09, 0.025), "#eef5f9", 0.4, 3);
  k += H.kaustik([84, -345, 1400, -240], R.band(84, 1400, -0.1, 0.32), { op: 0.06, fx: 0.012, fy: 0.02, seed: 31, blur: 2, exp: 4, mblur: 30 });
  /* Fluke: Kante am Stiel, Licht auf den Vorderkanten */
  k += weichF([[96, -228], [64, -226], [40, -212], [36, -204], [40, -196], [64, -184], [96, -186], [80, -205]], "#000", 0.45, 9);
  k += weichF([[80, -226], [30, -234], [-20, -246], [-48, -252], [-10, -242], [40, -230]], "#b9c8d2", 0.35, 3);
  k += weichF([[80, -185], [30, -172], [-20, -158], [-58, -149], [-24, -160], [40, -178]], "#b9c8d2", 0.35, 3);
  k += weichF([[-50, -251], [-30, -236], [-10, -214], [-3, -205], [-14, -214], [-34, -232]], "#000", 0.4, 4);
  /* Knöchel (Höckerreihe) auf dem Schwanzstiel, hinter der Finne */
  if (F) {
    const kn = [];
    for (let i = 0; i < 7; i++) { const x = 440 - i * 36; kn.push([x, R.yo(x) + 6, 6 - i * 0.4]); }
    k += kn.map(([x, y, r]) => weichF([[x - r * 2, y + r], [x, y - r * 0.8], [x + r * 2, y + r]], "#c4d4e0", 0.3, 2.5) + weichF([[x - r * 2, y + r * 1.6], [x + r * 2, y + r * 1.2], [x + r * 1.5, y + r * 2.5], [x - r * 1.5, y + r * 2.6]], "#000", 0.25, 3)).join("");
  }
  /* helle Narbenflecken und graue Marmorierung an der Flanke (typisch für ältere Tiere) */
  if (F) k += [[880, 0.62, 30, 8, -6], [700, 0.7, 22, 6, 10], [1150, 0.6, 18, 5, -4], [520, 0.55, 26, 6, 8], [380, 0.6, 16, 5, 4]].map(([x, t, rx, ry, w]) => { const [px, py] = P(x, t); return `<ellipse cx="${f(px)}" cy="${f(py)}" rx="${rx}" ry="${ry}" transform="rotate(${w} ${f(px)} ${f(py)})" fill="#8d979e" opacity=".35" filter="${H.weich(3, [px - rx - 4, py - rx - 4, px + rx + 4, py + rx + 4])}"/>`; }).join("");
  /* Narben (hell), einzelne Kratzer */
  if (F) k += H.narbenG([[820, -280, -6, 60, 3, 4, 0.6], [640, -300, 8, 50, 2, 4, -0.4], [300, -240, -14, 40, 3, 3.5, 0.5], [1180, -230, 4, 34, 2, 3, 0.4]], "#cfd6da", 1.1, 0.35);
  /* Maullinie (stark gewölbt) mit Lippenlicht; Unterkieferwulst; Blasloch mit Spritzschutz */
  const maul = [[1395, -233], [1362, -242], [1306, -251], [1240, -256], [1176, -255], [1118, -248], [1078, -236], [1054, -222], [1046, -212]];
  k += L([maul], "#0b0e11", 3.4, 0.9) + L([maul.slice(0, 7).map((p) => [p[0], p[1] + 3.4])], "#c8d6df", 1.6, 0.35);
  k += weichF([[1390, -228], [1300, -246], [1200, -250], [1120, -242], [1080, -226], [1110, -224], [1200, -236], [1300, -236]], "#000", 0.2, 8);
  k += weichL([[[1100, -304], [1086, -306], [1070, -305]]], "#000", 3, 0.6, 1) + weichL([[[1108, -310], [1090, -312], [1068, -310]]], "#e4edf2", 3, 0.35, 1.5);
  /* Knoten: Reihe auf dem Oberkiefer über der Lippe, Reihe auf der Schnauzenoberseite, verstreut am Unterkiefer */
  const kn = [];
  for (let i = 0; i < 11; i++) { const x = 1376 - i * 30, y = G ? maul.reduce((a, p) => (Math.abs(p[0] - x) < Math.abs(a[0] - x) ? p : a))[1] : 0; kn.push([x + (T.rnd() - 0.5) * 6, y - 13 - (i % 2) * 4, 4.6 + T.rnd() * 1.4]); }
  for (let i = 0; i < 8; i++) { const x = 1368 - i * 40; kn.push([x, R.yo(x) + 9 + (i % 2) * 3, 4.4 + T.rnd()]); }
  for (let i = 0; i < 9; i++) { const x = 1370 - i * 32 + (T.rnd() - 0.5) * 10, [px, py] = P(x, 0.62 + T.rnd() * 0.1); kn.push([px, py, 4.2 + T.rnd() * 1.2]); }
  k += H.knoten(F ? kn : kn.filter((q, i) => i % 2 === 0), "#3a434b");
  /* Seepocken: Kinnhöcker, Kehle vorn, Genitalregion */
  const sp = [];
  const haufen = (n, x, y, rx, ry, r0) => { for (let i = 0; i < n; i++) sp.push([x + (T.rnd() - 0.5) * 2 * rx, y + (T.rnd() - 0.5) * 2 * ry, r0 * (0.6 + T.rnd() * 0.6)]); };
  haufen(F ? 9 : 4, 1386, -205, 10, 12, 5); haufen(F ? 6 : 3, 1352, -182, 14, 8, 4.4); haufen(F ? 5 : 2, 520, -150, 16, 6, 4);
  k += H.seepocken(sp);
  s += teil(R.d, DUNKEL, { innen: k, randA: 0.25, rw: 1.4 });
  /* Brustflosse: riesig (~⅓ der Länge), schmal, weiß, Vorderkante (unten) mit großen Höckern und Seepocken */
  const B = [985, -128], E = [570, 48], dx = E[0] - B[0], dy = E[1] - B[1], Lg = Math.hypot(dx, dy), ux = dx / Lg, uy = dy / Lg, nx = -uy, ny = ux;
  const breite = (u) => (u < 0.25 ? 70 + (u / 0.25) * 12 : 82 * Math.pow(1 - (u - 0.25) / 0.75, 0.75));
  const vorn = [], hinten = [];
  for (let i = 0; i <= 40; i++) {
    const u = i / 40, w = breite(u), hoeck = u > 0.06 && u < 0.92 ? 5.5 * (1 - u * 0.5) * Math.pow(Math.abs(Math.sin(u * Math.PI * 9.5)), 0.6) : 0;
    const cx = B[0] + dx * u, cy = B[1] + dy * u;
    vorn.push([cx - nx * (w * 0.42 + hoeck), cy - ny * (w * 0.42 + hoeck)]);
    hinten.push([cx + nx * w * 0.58, cy + ny * w * 0.58]);
  }
  const flo = vorn.concat(hinten.slice().reverse());
  let fo = "";
  fo += weichF(hinten.slice(0, 36).map((p, i) => [p[0] - nx * 14 * (1 - i / 40), p[1] - ny * 14 * (1 - i / 40)]).concat(hinten.slice(0, 36).reverse()), "#000", 0.22, 6);
  fo += weichF(vorn.slice(2, 38).map((p, i) => [p[0] + nx * 10, p[1] + ny * 10]).concat(vorn.slice(2, 38).reverse()), "#ffffff", 0.45, 4);
  fo += weichF([[1010, -160], [960, -150], [940, -118], [980, -104], [1000, -120]], "#000", 0.35, 14);
  /* Schatten des Körpers auf der Flossenwurzel, dunkle Marmorierung nur an der Wurzel */
  fo += weichF([hinten[0], hinten[6], hinten[10], vorn[8], vorn[3], vorn[0]].map((p) => [p[0], p[1]]), "#1c232a", 0.55, 10);
  if (F) fo += [[0.2, 0.25, 26, 7, -24], [0.27, -0.1, 14, 5, -22], [0.33, 0.3, 10, 4, -20]].map(([u, v, rx, ry, w]) => { const cx = B[0] + dx * u + nx * v * 80, cy = B[1] + dy * u + ny * v * 80; return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${rx}" ry="${ry}" transform="rotate(${w} ${f(cx)} ${f(cy)})" fill="#3c454c" opacity=".55" filter="${H.weich(1.5, [cx - rx - 2, cy - rx - 2, cx + rx + 2, cy + rx + 2])}"/>`; }).join("");
  const sp2 = [];
  for (let i = 0; i < (F ? 7 : 3); i++) { const u = 0.55 + i * 0.05, p = vorn[Math.round(u * 40)]; sp2.push([p[0] + nx * 4, p[1] + ny * 4, 3.4 + T.rnd() * 1.6]); }
  s += teil(G(flo), "#dfe2e0", { innen: fo + H.seepocken(sp2), randA: 0.3, rw: 1.2 });
  /* Auge knapp über/hinter dem Mundwinkel */
  s += H.walAuge(1028, -229, 5.2, { winkel: -10, hell: "#b4c4d0" });
  return H.ende(s, [-60, -371, 1400, 48], [1010, -330, 1402, -160]);
}

/* =====================================================================
   HAMMERHAI (GROSSER HAMMERHAI)
   ===================================================================== */
/* RECHERCHE Großer Hammerhai (Sphyrna mokarran):
   3,5–6 m (hier 4,5 m). Kopf zum „Hammer“ (Cephalofoil) verbreitert, Breite 23–27 % der Länge; Vorderrand fast
   GERADE mit kleiner Kerbe in der Mitte (Unterschied zu anderen Hammerhaien); Augen an den Seitenenden, Nasenfurchen
   am Vorderrand. Mund klein, bogenförmig, unter dem Kopf. Erste Rückenflosse SEHR hoch und sichelförmig (Spitze nach
   hinten gebogen), Ursprung über dem Brustflossenansatz; zweite Rückenflosse relativ groß mit stark konkavem
   Hinterrand, Afterflosse ebenso tief ausgeschnitten; Bauchflossen sichelförmig. Schwanzflosse heterozerk: langer
   oberer Lappen mit Endlappen und Kerbe, kurzer unterer Lappen. Fünf Kiemenspalten, die letzte über dem
   Brustflossenansatz. Färbung oben graubraun bis olivgrau (bronzefarben), unten weiß, ohne Zeichnung.
   Darstellung: Körper seitlich, Kopf leicht zum Betrachter gedreht und von schräg oben gesehen, damit der Hammer
   als Querbalken erkennbar ist (nahes Auge vorn unten, fernes hinten oben). */
function hammerhai(T) {
  const H = mach(T), { G, L, teil, weichF, weichL, F, f } = H;
  const GRAU = "#6b716c", WEISS = "#ecebe5";
  const R = H.rumpf(
    [[412, -100], [408, -106], [398, -112], [382, -118], [360, -124], [336, -128.5], [310, -130.5], [282, -130], [250, -127], [218, -122], [184, -115], [150, -107.5], [122, -101], [104, -97.5], [90, -95.5]],
    [[412, -100], [409, -94], [401, -89], [387, -84], [368, -79], [344, -74.5], [316, -71], [286, -70], [254, -71.5], [220, -74.5], [186, -79], [152, -83.5], [124, -87], [104, -89], [90, -90]],
    [[76, -100], [60, -108], [44, -118], [29, -129], [16, -140], [6, -148], [0.5, -152, 1], [1.5, -146.5], [6, -142], [10.5, -140, 1], [16, -134], [26, -123], [37, -112], [47, -104], [54, -98.5, 1], [51, -89], [45, -79], [39, -70], [34, -63, 1], [44, -69], [58, -79], [74, -86]]);
  const P = R.P;
  let s = "";
  /* erste Rückenflosse: sehr hoch, sichelförmig */
  const r1 = [[344, -126], [338, -142], [329, -163], [317, -184], [303, -200], [290, -209], [281.5, -211.5, 1], [283, -204], [286.5, -188], [289.5, -169], [291, -153], [290, -141], [285.5, -133.5, 1], [296, -131.5], [310, -130.5]];
  let ri = weichF([[338, -140], [327, -164], [314, -186], [298, -202], [285, -210], [300, -199], [315, -182], [328, -160]], "#d3d8d2", 0.4, 1.4);
  ri += weichF([[284, -206], [287, -189], [290, -170], [290, -152], [288, -140], [293, -144], [294, -164], [291, -186]], "#000", 0.35, 2.2);
  ri += weichF([[346, -122], [320, -134], [292, -134], [282, -128], [310, -122]], "#000", 0.25, 4);
  s += teil(G(r1.concat([[316, -120]])), GRAU, { innen: ri, randD: G(r1, false), randA: 0.22, rw: 0.5 });
  /* ---- Rumpf ---- */
  let k = "";
  const grenze = [[430, 0.6], [400, 0.6], [380, 0.62], [360, 0.6], [330, 0.62], [300, 0.64], [270, 0.66], [240, 0.68], [210, 0.7], [180, 0.74], [150, 0.8], [125, 0.88], [104, 1.0], [96, 1.3]];
  k += `<path d="${G(grenze.map((q) => P(q[0], q[1])).concat([[90, -40, 1], [440, -40, 1]]))}" fill="${WEISS}" filter="${H.weich(1.6, [85, -120, 442, -40])}"/>`;
  k += H.rampe(R, 90, 416, [-0.1, -0.1], 0.2, "#eef1ec", 0.07, 4) + H.rampe(R, 90, 416, [-0.1], 0.38, "#eef1ec", 0.05, 6);
  k += H.rampe(R, 90, 414, [0.48, 0.58, 0.68, 0.76], 0.97, "#1e2622", 0.07, 4);
  k += weichF(R.band(130, 400, 0.92, 1.06), "#ffffff", 0.2, 2);
  k += weichF(R.linse(150, 380, 0.07, 0.025), "#f2f4f0", 0.3, 1.4);
  k += weichF(R.linse(96, 150, 0.12, 0.04), "#f2f4f0", 0.2, 1.4);
  /* Kiemenspalten (die letzte über dem Brustflossenansatz) */
  const kiemen = [];
  for (let i = 0; i < 5; i++) { const x = 402 - i * 5.6, a = 0.3 + i * 0.01, b = 0.74 - i * 0.015; kiemen.push([P(x + 1.6, a), P(x, (a + b) / 2), P(x + 0.8, b)]); }
  if (F) k += weichL(kiemen.map((z) => z.map((p) => [p[0] + 1.5, p[1]])), "#000", 2.4, 0.15, 1) + weichL(kiemen.map((z) => z.map((p) => [p[0] - 1.2, p[1]])), "#fff", 1.6, 0.14, 0.8);
  k += L(kiemen, "#1c201e", 0.7, 0.7);
  /* Schwanzflosse: Licht auf der Vorderkante, dunkler Hinterrand */
  k += weichF([[80, -99], [62, -108], [44, -119], [24, -134], [3, -151], [16, -140], [34, -126], [56, -111]], "#d8ddd6", 0.28, 1.2);
  k += weichF([[2, -150], [10, -141], [22, -128], [36, -113], [48, -102], [53, -99], [42, -108], [26, -124], [14, -137]], "#000", 0.28, 1.4);
  k += weichF([[96, -95], [76, -96], [60, -97], [54, -98], [60, -93], [76, -91], [96, -91]], "#000", 0.2, 2);
  if (F) k += H.narbenG([[300, -112, -6, 18, 2, 1.2, 0.5], [210, -104, 8, 14, 1, 1, 0.4]], "#d9ddd6", 0.35, 0.35);
  s += teil(R.d, GRAU, { innen: k, randA: 0.22, rw: 0.5 });
  /* zweite Rückenflosse (relativ groß, Hinterrand stark konkav), Afterflosse, Bauchflosse */
  const fl = (pts, farbe, licht) => teil(G(pts), farbe, { innen: weichF(licht, "#e3e7e1", 0.3, 0.8) + weichF(pts.slice(-3).concat([[pts[0][0] + 6, pts[0][1] + 3]]), "#000", 0.25, 1.8), randA: 0.22, rw: 0.4 });
  s += fl([[154, -106], [148, -115], [141, -122.5], [135.5, -124.5, 1], [135, -119], [131, -111], [124, -104.5, 1], [138, -103]], GRAU, [[152, -108], [144, -118], [137, -123.5], [143, -116]]);
  s += fl([[160, -84], [154, -75], [147, -68.5], [142, -67.5, 1], [142.5, -73], [139, -80], [132, -87.5, 1], [148, -86]], "#7a807b", [[158, -82], [150, -72], [144, -68.5], [150, -75]]);
  s += fl([[226, -74], [218, -64], [208, -56], [200, -53.5, 1], [201.5, -60], [198, -68], [190, -77, 1], [208, -76]], "#7a807b", [[224, -72], [214, -61], [203, -54.5], [211, -62]]);
  /* Brustflosse */
  const bf = [[392, -84], [386, -73], [376, -60], [363, -49], [350, -42], [344.5, -40.5, 1], [348, -46], [353, -55], [358, -66], [362, -78]];
  s += teil(G(bf), GRAU, { innen: weichF([[389, -80], [378, -64], [364, -51], [349, -42.5], [360, -52], [373, -65]], "#dfe3dd", 0.4, 1) + weichF([[348, -45], [354, -57], [360, -69], [364, -79], [358, -75], [352, -61]], "#000", 0.3, 1.6) + weichF([[398, -89], [378, -87], [370, -79], [390, -75]], "#000", 0.35, 2.5), randA: 0.22, rw: 0.45 });
  /* ---- Hammer (Cephalofoil), schräg von oben, Kopf ~40° zum Betrachter gedreht ---- */
  const ps = 30 * Math.PI / 180, el = 46 * Math.PI / 180;
  const fu = [Math.cos(ps), Math.sin(ps) * Math.sin(el)], fv = [-Math.sin(ps), Math.cos(ps) * Math.sin(el)], dz = Math.cos(el);
  const K0 = [424, -101];
  const pr = (u, v, z = 0) => [K0[0] + u * fu[0] + v * fv[0], K0[1] + u * fu[1] + v * fv[1] - z * dz];
  /* Umriss in Draufsicht (u nach vorn, v zum Betrachter): gerader Vorderrand mit Mittelkerbe, runde Seitenenden */
  const plan = [[-12, -58], [-5, -59], [0, -55.5], [1, -45], [1, -30], [0.6, -15], [-1.2, -4.5], [-2.6, 0], [-1.2, 4.5], [0.6, 15], [1, 30], [1, 45], [0, 55.5], [-5, 59], [-12, 58.5], [-17, 54], [-20, 45], [-24, 34], [-29, 24], [-34, 19], [-40, 17], [-40, -17], [-34, -19], [-29, -24], [-24, -34], [-20, -45], [-17, -54]];
  const oben = plan.map(([u, v]) => pr(u, v, 4)), unten = plan.map(([u, v]) => pr(u, v, -4));
  /* sichtbare Kante (Vorderrand und nahe Seitenspitze): Band zwischen Ober- und Unterkante */
  const kv = plan.slice(1, 16);
  const kante = kv.map(([u, v]) => pr(u, v, 4)).concat(kv.slice().reverse().map(([u, v]) => pr(u, v, -4)));
  let ka = weichF(kv.map(([u, v]) => pr(u, v, -4)).concat(kv.slice().reverse().map(([u, v]) => pr(u, v, -1))), "#000", 0.25, 1.2);
  if (F) {
    /* Nasenfurchen am Vorderrand nahe den Augen, Ampullenporen auf der Kante */
    ka += L([[pr(-1, 49, 0.5), pr(0.4, 42, 0.6), pr(0.8, 35, 0.4)], [pr(-1, -49, 0.5), pr(0.4, -42, 0.6), pr(0.8, -35, 0.4)]], "#1c201e", 0.6, 0.6);
    let po = "";
    for (let i = 0; i < 46; i++) { const v = -52 + T.rnd() * 104, [px, py] = pr(1, v, -2.6 + T.rnd() * 4.6); po += `M${f(px)} ${f(py)}h.01`; }
    ka += `<path d="${po}" stroke="#1c201e" stroke-width=".5" stroke-linecap="round" stroke-opacity=".45" fill="none"/>`;
  }
  s += teil(G(kante), "#c9ccc5", { innen: ka, randA: 0.25, rw: 0.45 });
  /* Oberseite: Licht von oben, zur nahen Spitze hin etwas dunkler (Krümmung), Rückenlinie läuft auf den Kopf */
  let ob = weichF([pr(-2, -40, 4), pr(-1, 0, 4), pr(-2, 40, 4), pr(-12, 40, 4), pr(-14, 0, 4), pr(-12, -40, 4)], "#f3f5f1", 0.28, 2);
  ob += weichF([pr(-16, 50, 4), pr(-22, 30, 4), pr(-34, 19, 4), pr(-40, 17, 4), pr(-40, 8, 4), pr(-26, 12, 4), pr(-12, 40, 4)], "#000", 0.25, 3);
  ob += weichL([[pr(-40, 0, 4), pr(-22, 0, 4), pr(-6, 0, 4)]], "#000", 1.6, 0.1, 1.5);
  ob += weichF([pr(-1, -50, 4), pr(0, 0, 4), pr(-1, 50, 4), pr(-4, 50, 4), pr(-3, 0, 4), pr(-4, -50, 4)], "#ffffff", 0.35, 0.8);
  /* Übergang Kopf → Rumpf: Rückenton weich über die Nackenkante */
  ob += weichF([pr(-44, -18, 4), pr(-30, -14, 4), pr(-30, 14, 4), pr(-44, 18, 4)], GRAU, 0.9, 3);
  s += teil(G(oben), GRAU, { innen: ob, randA: 0.22, rw: 0.45 });
  /* nahes Auge am Seitenende (seitlich nach außen gerichtet), fernes nur als Wulst */
  const [ex, ey] = pr(-6.5, 59.1, 0);
  s += `<ellipse cx="${f(ex)}" cy="${f(ey)}" rx="3.8" ry="3.1" fill="${T.rg("hhH", [[0, "#000", 0.45], [1, "#000", 0]])}"/>`;
  s += `<ellipse cx="${f(ex)}" cy="${f(ey)}" rx="1.9" ry="1.65" fill="${T.rg("hhA", [[0, "#050608"], [0.7, "#0d1419"], [0.9, "#3a3a22"], [1, "#0a0b0a"]], 0.5, 0.5, 0.5)}"/>`;
  s += `<ellipse cx="${f(ex + 0.55)}" cy="${f(ey - 0.6)}" rx=".45" ry=".3" fill="#fff" opacity=".85"/>`;
  s += `<path d="M${f(ex - 1.8)} ${f(ey - 0.7)}Q${f(ex)} ${f(ey - 2.4)} ${f(ex + 1.8)} ${f(ey - 0.8)}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".5"/>`;
  /* fernes Auge: nur als Wölbung an der Außenkante (Rückseite), dunkle Kante */
  s += L([[pr(-3, -59, 2), pr(-6.5, -60, 1), pr(-10, -59, 2)]], "#202422", 1.2, 0.5);
  return H.ende(s, [0.5, -211.5, 470, -40.5], [370, -140, 472, -64]);
}

/* =====================================================================
   MANTAROCHEN (RIESENMANTA)
   ===================================================================== */
/* RECHERCHE Riesenmanta (Mobula birostris, früher Manta birostris):
   Spannweite meist 4–7 m (hier 5,5 m), Scheibe rautenförmig, ~2,2-mal so breit wie lang; Brustflossen („Flügel“)
   mit leicht gewölbter Vorderkante, spitzen, nach hinten gezogenen Enden und konkaver Hinterkante. Vorn zwei
   KOPFFLOSSEN (Cephalic lobes), beim Fressen entrollt nach vorn gerichtet, beim Schwimmen oft eingerollt („Hörner“).
   Maul endständig und sehr breit zwischen den Kopfflossen; Augen seitlich am Kopf hinter den Kopfflossen. Kleine
   Rückenflosse an der Schwanzwurzel, Schwanz peitschenartig, etwa so lang wie die Scheibe. Oberseite schwarz mit
   großen weißen SCHULTERFLECKEN, deren Vorderränder gerade verlaufen und mit dem schwarzen Kopf ein „T“ bilden;
   nach hinten grau auslaufend. Unterseite weiß mit dunklen Flecken. Haut matt, rau.
   Darstellung: schwimmend nach rechts, von schräg oben (ein Rochen ist nur so erkennbar), Flügel im Abschlag leicht
   nach oben gebogen; naher Flügel unten, ferner oben. */
function mantarochen(T) {
  const H = mach(T), { G, L, teil, weichF, weichL, F, f } = H;
  const SCHW = "#17191c", WEISS = "#e9e9e4";
  const ps = 18 * Math.PI / 180, el = 40 * Math.PI / 180, se = Math.sin(el), ce = Math.cos(el);
  const O = [330, -160];
  /* z: Flügelbiegung (Spitzen hoch) + Rumpfwölbung in der Mitte */
  const zf = (u, v) => 40 * Math.pow(Math.min(1, Math.abs(v) / 277), 2) + (Math.abs(v) < 120 && u > -150 && u < 100 ? 20 * Math.pow(Math.cos(Math.abs(v) / 120 * Math.PI / 2), 1.5) * Math.sin(Math.max(0, Math.min(1, (u + 150) / 250)) * Math.PI) : 0);
  const pr = (u, v, z) => { const zz = z == null ? zf(u, v) : z; return [O[0] + u * Math.cos(ps) - v * Math.sin(ps), O[1] + (u * Math.sin(ps) + v * Math.cos(ps)) * se - zz * ce]; };
  /* halbe Scheibe (v > 0 = naher, linker Flügel): Kopf → Vorderkante → Spitze → Hinterkante → Becken */
  const halb = [[100, 42], [94, 50], [84, 62], [76, 74], [66, 90], [48, 130], [26, 175], [2, 220], [-20, 254], [-36, 274], [-48, 286, 1], [-50, 270], [-56, 238], [-68, 196], [-86, 148], [-106, 104], [-122, 70], [-132, 58], [-146, 50], [-153, 30], [-152, 10]];
  const ganz = halb.map(([u, v, e]) => (e ? [u, v, e] : [u, v])).concat(halb.slice().reverse().map(([u, v, e]) => (e ? [u, -v, e] : [u, -v])));
  const um = ganz.map(([u, v, e]) => { const p = pr(u, v, Math.abs(v) < 45 ? zf(u, v) * 0.4 : null); if (e) p.push(1); return p; });
  let s = "";
  /* Schwanz (peitschenartig, gleichmäßig verjüngt) */
  const sw = [];
  for (let i = 0; i <= 12; i++) { const u = -148 - i * 23, v = Math.sin(i * 0.45) * 7; sw.push(pr(u, v, 8 - i * 0.4)); }
  const sbr = (i) => 4.5 * Math.pow(1 - i / 12, 1.3) + 0.4;
  const swU = sw.map((p, i) => [p[0], p[1] - sbr(i)]).concat(sw.slice().reverse().map((p, j) => [p[0], p[1] + sbr(12 - j)]));
  s += weichF(sw.map((p, i) => [p[0], p[1] + 6 + sbr(i)]).concat(sw.slice().reverse().map((p) => [p[0], p[1] + 9])), "#000", 0.12, 3);
  s += teil(G(swU), "#1e2125", { innen: weichL([sw.slice(0, 9).map((p, i) => [p[0], p[1] - sbr(i) * 0.4])], "#9eb0bd", 1.2, 0.45, 0.6), randA: 0.25, rw: 0.4 });
  /* Scheibe */
  let k = "";
  /* weiße Schulterflecken: gerade Vorderränder (bilden mit dem schwarzen Kopf ein „T“), nach hinten grau auslaufend */
  const fleck = (sg) => [[58, 60, 1], [44, 104], [28, 150], [10, 188], [-4, 206], [-22, 196], [-40, 160], [-52, 118], [-56, 84], [-50, 64], [-30, 58]].map(([u, v, e]) => { const p = pr(u, v * sg); if (e) p.push(1); return p; });
  for (const sg of [1, -1]) {
    const pts = fleck(sg), b = T.box(pts);
    k += `<path d="${G(pts)}" fill="${T.lg("schulter" + (sg > 0 ? "n" : "f"), [[0, WEISS], [0.6, "#d6d8d6"], [1, "#5d6267"]], 1, 0, 0, 0)}" filter="${H.weich(0.8, b)}"/>`;
  }
  /* Licht: Rumpfwulst in der Mitte, Vorderkanten der Flügel, Spitzen dunkler; Hinterkanten dünn */
  k += weichF([pr(80, -40), pr(40, -80), pr(-60, -90), pr(-140, -40), pr(-140, 40), pr(-60, 90), pr(40, 80), pr(80, 40)], "#9fb0bd", 0.16, 18);
  k += weichF([pr(70, -18), pr(10, -40), pr(-90, -34), pr(-130, -6), pr(-90, 4), pr(10, 6), pr(70, 2)], "#d6e2ea", 0.14, 9);
  /* Flügel zu den Spitzen dunkler, matte graue Marmorierung */
  k += weichF([pr(10, 200), pr(-38, 274), pr(-50, 282), pr(-60, 230), pr(-30, 180)], "#000", 0.3, 12) + weichF([pr(10, -200), pr(-38, -274), pr(-50, -282), pr(-60, -230), pr(-30, -180)], "#000", 0.25, 12);
  if (F) k += [[-20, 90, 26, 12], [-80, 60, 20, 9], [-60, -110, 24, 10], [-100, -60, 18, 8], [10, -150, 20, 8], [-30, 230, 14, 6]].map(([u, v, rx, ry]) => { const [x, y] = pr(u, v); return weichF([[x - rx, y], [x, y - ry], [x + rx, y], [x, y + ry]], "#5d6a74", 0.22, 4); }).join("");
  const vk = (sg) => [[86, 48], [70, 86], [52, 126], [30, 170], [6, 214], [-16, 250], [-34, 270]].map(([u, v]) => pr(u, v * sg));
  for (const sg of [1, -1]) {
    const a = vk(sg), b = a.map(([x, y]) => [x - 9 * Math.sign(sg) * 0 - 6, y + (sg > 0 ? -10 : 10)]);
    k += weichF(a.concat(b.reverse()), "#dbe6ee", sg > 0 ? 0.32 : 0.42, 3) + weichL([a], "#e8f0f5", 1.4, sg > 0 ? 0.35 : 0.5, 0.6);
  }
  k += weichF([pr(-20, 230), pr(-44, 277), pr(-56, 250), pr(-50, 200)], "#000", 0.35, 8) + weichF([pr(-20, -230), pr(-44, -277), pr(-56, -250), pr(-50, -200)], "#000", 0.3, 8);
  k += weichF([pr(-60, 228), pr(-94, 132), pr(-122, 66), pr(-100, 70), pr(-70, 130), pr(-46, 220)], "#000", 0.3, 6);
  /* Augen seitlich am Kopf (nahes Auge sichtbar), Spritzlöcher dahinter, Maul vorn als dunkler Spalt */
  if (F) {
    k += H.narbenG([[pr(-20, 120)[0], pr(-20, 120)[1], -30, 26, 3, 2.4, 0.5], [pr(-70, -150)[0], pr(-70, -150)[1], 40, 22, 2, 2.2, -0.4]], "#cfd6da", 0.6, 0.3);
  }
  s += teil(G(um), SCHW, { innen: k, randA: 0.25, rw: 0.8 });
  /* Kopffront: breiter, endständiger Maulspalt mit hellem Lippenrand */
  const oL = [pr(98, 40, 12), pr(102, 20, 14), pr(103.5, 0, 14), pr(102, -20, 14), pr(98, -40, 12)];
  const uL = [pr(99, -38, 0), pr(104, -18, -3), pr(105.5, 0, -3), pr(104, 18, -3), pr(99, 38, 0)];
  s += teil(G(oL.concat(uL)), "#0a0b0d", { innen: weichF([pr(103, 30, 4), pr(105, 0, 4), pr(103, -30, 4), pr(104, 0, 1)], "#3a1f22", 0.5, 1.4), randA: 0.3, rw: 0.5 });
  s += L([oL], "#aab8c2", 1.3, 0.45) + L([uL.slice(1, 4)], "#5d6a74", 1, 0.5);
  /* Kopfflossen: fleischige, eingerollte „Hörner“ beidseits des Mauls, nach vorn gerichtet */
  const kf = (sg) => {
    const w = (u) => 9 - (u - 98) * 0.06;
    const mitte = [[96, 44], [110, 45], [124, 44], [138, 41], [150, 36], [158, 31]];
    const aussen = mitte.map(([u, v]) => pr(u, (v + w(u)) * sg, 8 + (u - 96) * 0.1)), innen = mitte.map(([u, v]) => pr(u, (v - w(u)) * sg, 12 + (u - 96) * 0.12));
    const spitze = pr(163, 26 * sg, 16);
    const pts = aussen.concat([spitze], innen.slice().reverse());
    let ii = weichF(innen.concat([spitze], mitte.slice().reverse().map(([u, v]) => pr(u, v * sg, 13 + (u - 96) * 0.12))), "#cfdbe3", 0.38, 1.6);
    ii += weichF(aussen.concat(mitte.slice().reverse().map(([u, v]) => pr(u, v * sg, 9))), "#000", 0.4, 2);
    if (F) ii += L([mitte.map(([u, v]) => pr(u, v * sg, 11 + (u - 96) * 0.11))], "#000", 1, 0.4) + L([mitte.slice(1).map(([u, v]) => pr(u, (v - 3) * sg, 12 + (u - 96) * 0.11))], "#9fb2be", 0.6, 0.3);
    return teil(G(pts), "#1f2226", { innen: ii, randA: 0.3, rw: 0.6 });
  };
  s = kf(-1) + s + kf(1);
  /* nahes Auge seitlich am Kopf, hinter der Kopfflosse */
  const [ex, ey] = pr(84, 56, 4);
  s += `<ellipse cx="${f(ex)}" cy="${f(ey)}" rx="4" ry="3" fill="${T.rg("mH", [[0, "#000", 0.6], [1, "#000", 0]])}"/>`;
  s += `<ellipse cx="${f(ex)}" cy="${f(ey)}" rx="2.3" ry="1.8" fill="${T.rg("mA", [[0, "#0a0807"], [0.65, "#24180f"], [0.9, "#0c0907"], [1, "#000"]], 0.5, 0.5, 0.5)}"/>`;
  s += `<ellipse cx="${f(ex + 0.6)}" cy="${f(ey - 0.6)}" rx=".5" ry=".35" fill="#fff" opacity=".85"/>`;
  s += `<path d="M${f(ex - 2.6)} ${f(ey - 0.8)}Q${f(ex)} ${f(ey - 3)} ${f(ex + 2.6)} ${f(ey - 0.9)}" fill="none" stroke="#7e8d98" stroke-opacity=".35" stroke-width=".6"/>`;
  /* kleine Rückenflosse */
  s += teil(G([pr(-136, 0, 18), pr(-150, 0, 34), pr(-158, 0, 36), pr(-160, 0, 26), pr(-162, 0, 14)]), "#1d2024", { innen: weichF([pr(-138, 0, 20), pr(-150, 0, 33), pr(-156, 0, 33), pr(-148, 0, 24)], "#c5d2db", 0.3, 1), randA: 0.25, rw: 0.5 });
  const alle = um.concat(sw);
  const bx = T.box(alle);
  return H.ende(s, [Math.floor(bx[0] - 3), Math.floor(bx[1] - 2), Math.ceil(pr(163, -26, 16)[0] + 2), Math.ceil(bx[3] + 2)], T.box([pr(60, -70), pr(60, 80), pr(165, -40), pr(165, 50), pr(110, 0, 20)]));
}

/* =====================================================================
   MEERESSCHILDKRÖTE (GRÜNE MEERESSCHILDKRÖTE)
   ===================================================================== */
/* RECHERCHE Grüne Meeresschildkröte (Chelonia mydas):
   Panzer 80–120 cm (hier 100 cm), oval, flach gewölbt, glatt; Schilde NEBENEINANDER (nicht dachziegelig):
   5 Wirbelschilde (Mittelreihe), je 4 Rippenschilde, Randschilde ringsum, Nackenschild vorn. Farbe olivbraun mit
   strahlenförmigen gelben, braunen und dunklen Streifen. Kopf klein, rundlich, kurze stumpfe Schnauze; NUR EIN Paar
   langgestreckter Präfrontalschuppen zwischen den Augen (Kennzeichen), 4 Postorbitalschuppen hinter dem Auge;
   Kopfschuppen braun mit hellen Rändern; Hornschneide, Unterkiefer gesägt. Vorderflossen lang, paddelförmig, je EINE
   sichtbare Kralle an der Vorderkante, große Schuppen mit hellen Rändern, heller Hinterrand; Hinterflossen kurz und
   rund. Bauchpanzer gelblich weiß. Darstellung: schwimmend nach rechts, schräg von oben (Rückenpanzer sichtbar),
   naher Vorderflügel im Abschlag nach hinten unten, ferner angehoben. */
function meeresschildkroete(T) {
  const H = mach(T), { G, L, teil, weichF, weichL, F, f } = H;
  const PANZER = "#5f4d31";
  /* Mittelpunkt des Panzers */
  const M = (x, y) => [x + 95, y - 72];
  const pm = (pts) => pts.map(([x, y, e]) => { const p = M(x, y); if (e) p.push(1); return p; });
  let s = "";
  /* Flosse aus Mittellinie (Punkte) und Breiten (vorn = Vorderkante, hinten = Hinterkante) */
  const flosse = (mitte, bv, bh) => {
    const n = mitte.length, vorn = [], hinten = [];
    for (let i = 0; i < n; i++) {
      const a = mitte[Math.max(0, i - 1)], b = mitte[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      const nx = dy / l, ny = -dx / l;
      vorn.push([mitte[i][0] - nx * bv[i], mitte[i][1] - ny * bv[i]]);
      hinten.push([mitte[i][0] + nx * bh[i], mitte[i][1] + ny * bh[i]]);
    }
    return { vorn, hinten, pts: vorn.concat(hinten.slice().reverse()) };
  };
  const schuppenFlosse = (fl, n, farbe, reihen = 2) => {
    /* Schuppenmosaik: Zellen entlang der Flosse (n Spalten × reihen), Ränder leicht verzogen, helle Fugen */
    const P2 = (t, q) => {
      const x = Math.max(0, Math.min(0.999, t)) * (fl.vorn.length - 1), i = Math.min(fl.vorn.length - 2, Math.floor(x)), u = x - i;
      const a = [fl.vorn[i][0] + (fl.vorn[i + 1][0] - fl.vorn[i][0]) * u, fl.vorn[i][1] + (fl.vorn[i + 1][1] - fl.vorn[i][1]) * u];
      const b = [fl.hinten[i][0] + (fl.hinten[i + 1][0] - fl.hinten[i][0]) * u, fl.hinten[i][1] + (fl.hinten[i + 1][1] - fl.hinten[i][1]) * u];
      return [a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q];
    };
    const tz = [], qz = [];
    for (let i = 0; i <= n; i++) tz.push(Math.pow(i / n, 0.85) * 0.92 + 0.02);
    for (let j = 0; j <= reihen; j++) qz.push(0.06 + j / reihen * 0.78);
    let d = "";
    const J = () => (T.rnd() - 0.5) * 0.09;
    for (let i = 0; i < n; i++) for (let j = 0; j < reihen; j++) {
      const v = (j % 2) * 0.5 / n;
      const ecken = [P2(tz[i] + v + J(), qz[j]), P2(tz[i + 1] + v + J(), qz[j] + J()), P2(tz[i + 1] + v + J(), qz[j + 1]), P2(tz[i] + v + J(), qz[j + 1] + J())];
      d += H.vieleck(ecken);
    }
    return `<path d="${d}" fill="none" stroke="${farbe}" stroke-width=".65" stroke-opacity=".45" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#000" stroke-width=".4" stroke-opacity=".25" stroke-linejoin="round" transform="translate(.3 .35)"/>`;
  };
  /* ferne Vorderflosse: angehoben, hinter dem Panzer, im Schatten */
  const ff = flosse(pm([[30, -22], [22, -36], [12, -50], [0, -62], [-12, -71], [-22, -76]]), [7, 8, 7, 5, 3, 0.5], [9, 11, 10, 7, 4, 0.5]);
  s += teil(G(ff.pts), "#3e3224", { innen: weichF(ff.hinten.slice(1).concat(ff.hinten.slice(1).reverse().map((p) => [p[0] - 1.5, p[1] + 2])), "#bfae84", 0.45, 0.8) + (F ? schuppenFlosse(ff, 6, "#a8966c", 2) : ""), randA: 0.3, rw: 0.4 });
  /* ferne Hinterflosse */
  const fh = flosse(pm([[-42, -14], [-50, -17], [-57, -19], [-62, -20]]), [3, 3.6, 3, 0.5], [3.6, 4.4, 3.6, 0.5]);
  s += teil(G(fh.pts), "#3e3224", { randA: 0.3, rw: 0.4 });
  /* Hals (faltige Haut) und Kopf im Profil, leicht von oben */
  s += teil(G(pm([[36, -14], [50, -14], [60, -10], [64, -2], [62, 6], [52, 8], [40, 8]])), "#9c8b6c", { innen: weichF(pm([[40, 4], [60, 2], [62, 8], [40, 10]]), "#000", 0.3, 2) + (F ? L([pm([[46, -10], [48, 0], [46, 6]]), pm([[52, -11], [54, -1], [52, 6]]), pm([[57, -9], [58, 0], [57, 5]])], "#3e3324", 0.55, 0.45) : ""), randA: 0.3, rw: 0.4 });
  const K = (x, y) => M(58 + x, -6 + y);
  const kopf = [K(-2, -6.6), K(2.6, -9.8), K(9, -11.6), K(16, -11.4), K(21.6, -9.2), K(25, -6), K(26.5, -2.6), K(26.2, 0.6), K(24.6, 3.4), K(20, 5.4), K(12, 6.8), K(4, 7.2), K(-2, 6.4)];
  const kk = (pts) => pts.map(([x, y]) => K(x, y));
  /* Kopfschuppen (lückenlos, unregelmäßige Vielecke): Präfrontale (lang, EIN Paar), Frontale, Supraoculare,
     Frontoparietale, Parietale, 4 Postorbitalia, Temporal- und Tympanalschuppen, Suborbitale, Präoculare */
  const sch = [
    [[17, -11.3], [22, -9.6], [21.4, -6.6], [16.2, -7.8]],
    [[10.4, -11.6], [17, -11.3], [16.2, -7.8], [11.6, -8.4]],
    [[10.6, -8.4], [16.6, -7.7], [17.6, -7], [16, -6.9], [12.2, -7.2]],
    [[4.6, -10.6], [10.4, -11.6], [11.6, -8.4], [10.6, -8.4], [9.2, -7.6], [5, -7.6]],
    [[-1.8, -7.8], [4.6, -10.6], [5, -7.6], [2.6, -5.6], [-2.2, -4.8]],
    [[9.2, -7.6], [10.9, -7.3], [10.6, -5.7], [8.8, -5.9]], [[8.8, -5.9], [10.6, -5.7], [10.4, -4.1], [8.6, -4.3]],
    [[8.6, -4.3], [10.4, -4.1], [10.6, -2.5], [8.6, -2.7]], [[8.6, -2.7], [10.6, -2.5], [11.4, -1], [8.8, -0.8]],
    [[2.6, -5.6], [5, -7.6], [9.2, -7.6], [8.8, -5.9], [8.6, -4.3], [4.4, -3.4]],
    [[4.4, -3.4], [8.6, -4.3], [8.6, -2.7], [8.8, -0.8], [5.2, 0.4], [3, -1.2]],
    [[-2.2, -4.8], [2.6, -5.6], [4.4, -3.4], [3, -1.2], [1.4, 1.6], [-2.4, 1.2]],
    [[3, -1.2], [5.2, 0.4], [8.8, -0.8], [11.4, -1], [12.6, 1.4], [8, 2.8], [3.2, 3.4], [1.4, 1.6]],
    [[-2.4, 1.2], [1.4, 1.6], [3.2, 3.4], [0.6, 5.4], [-2.4, 4.8]],
    [[11.4, -1], [14.4, -1.1], [17.8, -1.7], [19, 0.2], [15, 1.6], [12.6, 1.4]],
    [[17.6, -6.6], [21.4, -6.6], [22.6, -3.6], [19, -2.4], [17.8, -3.8]],
    [[21.4, -6.6], [22, -9.6], [24.6, -6.6], [26.2, -3.4], [22.6, -3.6]],
  ];
  let ki = weichF(kk([[-1, 3], [12, 4.6], [24, 2.6], [24.6, 6.2], [12, 8], [-1, 8]]), "#e6d6aa", 0.8, 0.6);
  const schD = sch.map((q) => H.vieleck(kk(q))).join("");
  ki += `<path d="${schD}" fill="#4d3c25"/>`;
  /* Schuppenmitte etwas heller/oliv, Ränder hell */
  if (F) ki += sch.map((q) => { const c = q.reduce((a, p) => [a[0] + p[0] / q.length, a[1] + p[1] / q.length], [0, 0]); return H.vieleck(kk(q.map(([x, y]) => [c[0] + (x - c[0]) * 0.55, c[1] + (y - c[1]) * 0.55]))); }).reduce((a, d) => a + d, "").replace(/^(.*)$/, (d) => `<path d="${d}" fill="#665232" opacity=".45"/>`);
  ki += `<path d="${schD}" fill="none" stroke="#d2be8a" stroke-width=".38" stroke-linejoin="round"/>`;
  /* Licht von oben auf dem Schädel, Schatten unter der Wange */
  ki += weichF(kk([[2, -9], [12, -11], [21, -9], [14, -7.6], [4, -7]]), "#ffffff", 0.22, 1.2);
  ki += weichF(kk([[-2, 2], [8, 3], [12, 3.6], [6, 5.4], [-2, 5]]), "#000", 0.2, 1.4);
  /* Hornschneiden: Oberkiefer (horngelb, dunklere Kante), Maulspalt, Unterkiefer fein gesägt; Nasenloch */
  ki += `<path d="${G([[...K(26.6, -2.4), 1], K(26.4, 0.8), K(24.2, 3), K(19, 4.2), [...K(12.4, 4.4), 1], K(13.2, 2.4), K(19, 0.6), K(22.8, -1.6)])}" fill="#cbb685"/>`;
  ki += weichL([kk([[26.4, -2.2], [23, -1.4], [19, 0.6], [13.2, 2.4]])], "#3a2d1c", 0.6, 0.45, 0.3);
  ki += L([kk([[26.4, 0.9], [23.6, 3.2], [18, 4.3], [12.2, 4.5]])], "#2a2118", 0.7, 0.9);
  if (F) { let z = ""; for (let i = 0; i < 9; i++) { const [x, y] = K(24 - i * 1.3, 4.2 + i * 0.04); z += `M${f(x)} ${f(y)}l-.3 .45`; } ki += `<path d="${z}" fill="none" stroke="#7b6643" stroke-width=".22" stroke-opacity=".7"/>`; }
  ki += weichF(kk([[25.8, -4.4], [24.8, -3], [24.2, -4]]), "#1d1712", 0.6, 0.25);
  s += teil(G(kopf), "#a38e66", { innen: ki, randA: 0.3, rw: 0.4 });
  /* Auge: groß, dunkel, in einer Höhle; Lidwulst oben, feuchtes Unterlid */
  const [ax, ay] = K(14.2, -4.4);
  s += `<ellipse cx="${f(ax)}" cy="${f(ay)}" rx="3.8" ry="3" fill="${T.rg("skH", [[0, "#1a120a", 0.9], [0.7, "#2a1f12", 0.6], [1, "#2a1f12", 0]])}"/>`;
  s += `<ellipse cx="${f(ax)}" cy="${f(ay + 0.2)}" rx="2.6" ry="2.05" fill="${T.rg("skA", [[0, "#040302"], [0.5, "#1c140c"], [0.82, "#3b2b19"], [1, "#0a0705"]], 0.55, 0.5, 0.5)}"/>`;
  s += `<path d="M${f(ax - 3.2)} ${f(ay - 0.4)}Q${f(ax)} ${f(ay - 3.7)} ${f(ax + 3.3)} ${f(ay - 0.6)}" fill="none" stroke="#231a11" stroke-width="1.1" stroke-opacity=".9"/>`;
  s += `<path d="M${f(ax - 2.8)} ${f(ay + 1.6)}Q${f(ax)} ${f(ay + 3)} ${f(ax + 2.8)} ${f(ay + 1.3)}" fill="none" stroke="#d6c393" stroke-width=".45" stroke-opacity=".6"/>`;
  s += `<ellipse cx="${f(ax + 0.9)}" cy="${f(ay - 0.7)}" rx=".55" ry=".38" fill="#fff" opacity=".85"/>`;
  /* Panzer (Rückenpanzer schräg von oben): Umriss oval, vorn runder, hinten etwas zugespitzt, Nackenkerbe */
  const um = pm([[50, -6], [47, -15], [38, -24], [24, -30], [6, -32], [-14, -30], [-32, -25], [-45, -17], [-52, -7], [-53, 3], [-47, 13], [-34, 21], [-16, 26], [4, 27], [22, 25], [37, 19], [47, 10], [51, 2]]);
  /* Seitenkante/Bauchpanzer (nahe Seite, schmal, hell) */
  s += teil(G(pm([[-48, 12], [-34, 22], [-16, 27], [4, 28], [22, 26], [38, 20], [46, 12], [44, 18], [32, 26], [14, 31], [-6, 31], [-24, 29], [-40, 22]])), "#d8c698", { innen: weichF(pm([[-40, 24], [0, 31], [40, 20], [0, 34]]), "#000", 0.35, 2), randA: 0.3, rw: 0.4 });
  let k = "";
  /* Schildfelder: Wirbelreihe auf dem Scheitel, Rippenschilde nah (groß) und fern (verkürzt), Randring */
  const wirbel = [[44, -12], [28, -14], [10, -16], [-8, -16], [-26, -14], [-42, -10]];
  const ws = (x, y, sg) => [x, y + sg * 8.5];
  const linien = [];
  /* Wirbelschild-Ränder (Sechsecke) */
  const ob = [], un = [];
  for (let i = 0; i < wirbel.length - 1; i++) {
    const [x1, y1] = wirbel[i], [x2, y2] = wirbel[i + 1], mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    ob.push([x1, y1 - 6], [mx, my - 9.5]); un.push([x1, y1 + 6], [mx, my + 9.5]);
    if (i > 0) linien.push(pm([[x1, y1 - 6, 1], [x1 + 0.6, y1], [x1, y1 + 6, 1]]));
  }
  ob.push([-42, -15]); un.push([-42, -5]);
  linien.push(pm(ob.map(([x, y]) => [x, y, 1])), pm(un.map(([x, y]) => [x, y, 1])));
  /* Randring (Innenkante der Randschilde) */
  const ring = [[46, -4], [42, -14], [33, -21], [20, -26], [4, -27.5], [-14, -26], [-30, -21.5], [-41, -14], [-46, -5], [-46, 4], [-41, 11], [-30, 17], [-14, 21], [4, 22], [21, 20], [34, 15], [42, 7], [46, -4]];
  linien.push(pm(ring));
  /* Rippenschild-Grenzen: nahe Seite (lang, schräg), ferne Seite (kurz) */
  for (const [xo, xu] of [[19, 14], [1, -3], [-17, -22]]) {
    linien.push(pm([[xo, 6.5, 1], [xo - 2, 13], [xu, 21.5, 1]]));
  }
  linien.push(pm([[37, 6], [40, 11]]));
  for (const x of [19, 1, -17]) linien.push(pm([[x, -22], [x + 1, -26.5]]));
  /* Randschilde: kurze Fugen zum Rand */
  for (let i = 0; i < 17; i++) {
    const a = i / 17 * Math.PI * 2, rx = 49, ry = 29;
    const x = Math.cos(a) * rx, y = Math.sin(a) * ry * (Math.sin(a) > 0 ? 0.95 : 1.05) - 2;
    linien.push(pm([[x * 0.93, y * 0.88], [x * 1.04, y * 1.05]]));
  }
  /* Strahlenzeichnung: unscharfe helle und dunkle Streifen vom Wachstumszentrum jedes Schildes */
  /* je Schild: Ursprung (obere hintere Ecke), Richtung und Länge des Strahlenfächers */
  const faecher = [[38, -18, 200, 12], [22, -21, 200, 14], [4, -22, 200, 14], [-14, -22, 200, 13], [-32, -19, 195, 11],
    [32, -2, 150, 18], [14, -3, 140, 19], [-4, -3, 135, 19], [-22, -2, 130, 17], [32, -22, 150, 6], [14, -25, 160, 7], [-4, -25, 165, 7], [-22, -24, 160, 6]];
  let hell = "", dunkel = "";
  for (const [x0, y0, w0, r0] of faecher) {
    const [cx, cy] = M(x0, y0);
    for (let j = 0; j < (F ? 15 : 7); j++) {
      const w = (w0 - 60 + j * (F ? 8.5 : 18) + (T.rnd() - 0.5) * 8) * Math.PI / 180, rr = r0 * (0.5 + T.rnd() * 0.6), kr = (T.rnd() - 0.5) * 0.35;
      const ex = cx - Math.cos(w) * rr, ey = cy + Math.sin(w) * rr * 0.75;
      const d = `M${f(cx)} ${f(cy)}Q${f((cx + ex) / 2 + Math.sin(w) * rr * kr)} ${f((cy + ey) / 2 + Math.cos(w) * rr * kr)} ${f(ex)} ${f(ey)}`;
      if (j % 3 === 1) dunkel += d; else hell += d;
    }
  }
  k += `<path d="${hell}" stroke="#c9a65e" stroke-width="${F ? 0.9 : 1.8}" stroke-opacity=".4" stroke-linecap="round" fill="none" filter="${H.weich(0.3, T.box(um))}"/>`;
  k += `<path d="${dunkel}" stroke="#1f170d" stroke-width="${F ? 1.2 : 2.2}" stroke-opacity=".35" stroke-linecap="round" fill="none" filter="${H.weich(0.35, T.box(um))}"/>`;
  /* Wölbung: Licht auf dem Scheitel, Schatten zum nahen Rand, Randschilde nah heller */
  k += weichF(pm([[36, -18], [10, -22], [-20, -20], [-38, -12], [-20, -8], [10, -8], [32, -10]]), "#f5e9c8", 0.25, 5);
  k += weichF(pm([[44, 6], [30, 18], [4, 24], [-24, 21], [-42, 10], [-20, 14], [4, 16], [30, 12]]), "#000", 0.28, 5);
  k += weichF(pm([[46, 10], [30, 20], [4, 26], [-30, 22], [-46, 10], [-30, 18], [4, 23], [30, 17]]), "#e0c890", 0.18, 2);
  k += L(linien, "#1e160c", 0.9, 0.55) + (F ? L(linien.map((z) => z.map((p) => [p[0] + 0.45, p[1] + 0.55, p[2]])), "#ead8a4", 0.45, 0.32) : "");
  k += weichF(pm([[22, -20], [10, -21], [-2, -21], [10, -18]]), "#ffffff", 0.35, 1.2);
  s += teil(G(um), PANZER, { innen: k, randA: 0.4, rw: 0.6 });
  /* nahe Hinterflosse */
  const hn = flosse(pm([[-38, 16], [-48, 22], [-58, 27], [-66, 30]]), [5, 6, 5, 0.6], [6, 7.5, 6, 0.6]);
  s += teil(G(hn.pts), "#594830", { innen: weichF(hn.hinten.concat(hn.hinten.slice().reverse().map((p) => [p[0] + 1, p[1] - 1.8])), "#e6d6aa", 0.55, 0.6) + (F ? schuppenFlosse(hn, 3, "#d9c79a", 2) : ""), randA: 0.3, rw: 0.4 });
  /* nahe Vorderflosse: lang, nach hinten unten im Schlag, große Schuppen, heller Hinterrand, eine Kralle */
  const vn = flosse(pm([[30, 16], [24, 28], [14, 38], [1, 46], [-14, 52], [-30, 56], [-44, 58]]), [7, 8, 7.5, 6, 4.5, 2.5, 0.4], [7, 9, 9, 8, 6, 3.5, 0.4]);
  let vi = weichF(vn.hinten.slice(1).concat(vn.hinten.slice(1).reverse().map((p) => [p[0] + 1.6, p[1] - 2.4])), "#efe2bf", 0.8, 0.7);
  vi += weichF(vn.vorn.slice(0, 6).concat(vn.vorn.slice(0, 6).reverse().map((p) => [p[0] - 1, p[1] - 3.4])), "#e6d6a8", 0.3, 1.2);
  vi += weichF(pm([[34, 12], [28, 24], [20, 22], [26, 12]]), "#000", 0.4, 2.4);
  if (F) vi += schuppenFlosse(vn, 9, "#e6d4a2", 3);
  s += teil(G(vn.pts), "#4b3c27", { innen: vi, randA: 0.32, rw: 0.45 });
  const [kx, ky] = vn.vorn[2];
  s += `<path d="M${f(kx)} ${f(ky)}c1 .3 2 1.2 2.4 2.6c-1 -.7 -1.9 -.8 -2.7 -.4z" fill="#d6c79e" stroke="#4a3b26" stroke-width=".3"/>`;
  const alle = um.concat(ff.pts, vn.pts, hn.pts, fh.pts, kopf);
  const bx = T.box(alle);
  return H.ende(s, [Math.floor(bx[0]), Math.floor(bx[1]), Math.ceil(bx[2]), Math.ceil(bx[3])], [M(52, 0)[0], M(0, -24)[1], M(88, 0)[0], M(0, 8)[1]]);
}

/* =====================================================================
   POTTWAL
   ===================================================================== */
/* RECHERCHE Pottwal (Physeter macrocephalus), Bulle:
   bis 16–18 m (hier 15 m). Riesiger, kastenförmiger Kopf (¼–⅓ der Länge, Walrat-Organ), Stirn stumpf und fast
   senkrecht, ragt weit über den Unterkiefer; Unterkiefer lang, SCHMAL, unterständig, mit 18–26 Paar kegelförmiger
   Zähne (Oberkiefer zahnlos), Lippen und Mundwinkel weiß. EIN S-förmiges Blasloch vorn LINKS oben am Kopf (Blas
   schräg nach vorn links). Auge klein, knapp hinter/über dem Mundwinkel. Statt Finne ein niedriger, gerundeter
   Höcker bei ~⅔ der Länge, dahinter eine Reihe „Knöchel“ bis zur Fluke. Haut hinter dem Kopf runzelig wie eine
   Backpflaume, Kopf glatter mit hellen Narben und kreisrunden Saugnapfnarben von Riesenkalmaren. Brustflossen klein,
   paddelförmig. Fluke breit dreieckig, gerade Hinterkante, tiefe Kerbe. Farbe dunkelgrau bis bräunlich grau, Bauch
   mit weißen Flecken. */
function pottwal(T) {
  const H = mach(T, 0), { G, L, teil, weichF, weichL, F, f } = H;
  const HAUT = "#3c3d3f";
  const R = H.rumpf(
    [[1500, -240], [1499, -276], [1492, -306], [1476, -326], [1446, -337], [1390, -342], [1300, -345], [1200, -346], [1110, -343], [1040, -336], [970, -331], [890, -333], [800, -337], [710, -339], [630, -337], [570, -343], [528, -352], [492, -351], [460, -340], [410, -324], [350, -302], [290, -279], [230, -258], [170, -240], [122, -229], [92, -223]],
    [[1500, -240], [1497, -205], [1488, -176], [1472, -156], [1446, -143], [1412, -136], [1386, -130], [1352, -120], [1290, -111], [1210, -104], [1130, -100], [1060, -98], [980, -96], [900, -95], [820, -97], [740, -104], [660, -118], [580, -138], [500, -160], [420, -181], [340, -197], [260, -207], [186, -211], [130, -212], [92, -212]],
    [[66, -226], [40, -232], [12, -239], [-16, -246], [-40, -251], [-58, -253, 1], [-48, -244], [-36, -233], [-22, -222], [-10, -218, 1], [-24, -212], [-40, -202], [-56, -190], [-68, -178, 1], [-52, -178], [-24, -186], [10, -196], [40, -203], [66, -208]]);
  const P = R.P;
  let s = "";
  /* Höcker (statt Finne): niedrig, gerundet – gehört zum Rücken, als eigene Form mit weichem Fuß */
  s += teil(G([[600, -336], [565, -350], [535, -366], [508, -370], [486, -362], [470, -346], [452, -334], [520, -326]]), HAUT, { innen: weichF([[580, -344], [540, -364], [508, -368], [520, -358], [556, -348]], "#c7d0d6", 0.3, 4) + weichF([[490, -360], [472, -344], [456, -334], [480, -336]], "#000", 0.35, 5), randD: G([[600, -336], [565, -350], [535, -366], [508, -370], [486, -362], [470, -346], [452, -334]], false), randA: 0.25, rw: 1.2 });
  let k = "";
  /* weiße Flecken am Bauch, weiße Lippen (Unterkiefer, Mundwinkel) */
  k += [[960, 0.93, 40, 9], [820, 0.95, 30, 7], [700, 0.92, 22, 6], [880, 0.88, 12, 4], [1010, 0.9, 10, 4]].map(([x, t, rx, ry]) => { const [px, py] = P(x, t); return weichF([[px - rx, py + ry * 0.2], [px - rx * 0.6, py - ry * 0.8], [px - rx * 0.1, py - ry * 0.4], [px + rx * 0.4, py - ry], [px + rx, py - ry * 0.1], [px + rx * 0.5, py + ry * 0.7], [px - rx * 0.2, py + ry * 0.4]], "#d9d8d2", 0.85, 1.2); }).join("");
  /* Kopf etwas heller und glatter; Rumpf dunkler */
  k += weichF([[1500, -330], [1300, -345], [1120, -340], [1100, -150], [1300, -120], [1500, -200]], "#6a6c6e", 0.35, 40);
  /* Licht von oben, Kernschatten, Reflexlicht */
  k += H.rampe(R, 92, 1500, [-0.1, -0.1, -0.1], 0.2, "#c8d2da", 0.08, 14) + H.rampe(R, 92, 1500, [-0.1, -0.1], 0.42, "#c8d2da", 0.05, 24);
  k += H.rampe(R, 92, 1495, [0.5, 0.6, 0.68, 0.76], 0.96, "#0e1216", 0.08, 14);
  k += weichF(R.band(500, 1440, 0.94, 1.06), "#b8c2c8", 0.3, 6);
  /* Stirn: breite Rundung oben vorn, Licht auf der Kopfkante */
  k += weichF(R.saum(1150, 1500, 6, 22), "#e9eff3", 0.4, 4);
  k += weichF([[1497, -290], [1500, -240], [1496, -200], [1486, -175], [1470, -200], [1478, -260]], "#000", 0.25, 8);
  /* Runzelhaut hinter dem Kopf (Backpflaume): gewellte Längsfalten in Reihen, unterbrochen; dunkle Rinne + helle
     Kante darunter; zum Kopf und zum Bauch hin auslaufend */
  if (F) {
    let d = "";
    for (let t = 0.1; t < 0.84; t += 0.032) {
      let x = 300 + T.rnd() * 60;
      const xe = 1000 - Math.abs(t - 0.45) * 260 + T.rnd() * 120;
      while (x < xe) {
        if (x > xe - 200 && T.rnd() < (x - (xe - 200)) / 200) { x += 40 + T.rnd() * 40; continue; }
        const l = 40 + T.rnd() * 90, n = Math.max(2, Math.round(l / 14));
        let seg = "";
        for (let j = 0; j <= n; j++) { const xx = x + l * j / n, [px, py] = P(xx, t + Math.sin((xx + t * 900) / 11) * 0.004 + (T.rnd() - 0.5) * 0.003); seg += (j ? "L" : "M") + f(px) + " " + f(py); }
        d += seg; x += l + 8 + T.rnd() * 30;
      }
    }
    const id = T.id("runzel");
    T.def(`<path id="${id}" d="${d}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
    k += `<use href="#${id}" stroke="#000" stroke-width="2" stroke-opacity=".22"/><use href="#${id}" y="2.2" stroke="#c4cdd3" stroke-width="1.3" stroke-opacity=".16"/>`;
  }
  /* Kopfnarben: helle Kratzer und kreisrunde Saugnapfnarben von Riesenkalmaren */
  if (F) {
    k += H.narbenG([[1380, -300, -8, 60, 3, 4, 0.5], [1260, -250, 12, 50, 2, 4, -0.4], [1440, -230, 80, 40, 2, 3, 0.3], [1180, -300, -4, 40, 1, 3, 0.4], [1320, -200, 6, 46, 2, 3.5, -0.3]], "#d6dbde", 1.4, 0.4);
    let ri = "";
    for (const [x, y, n] of [[1350, -232, 5], [1236, -204, 4], [1420, -282, 3]]) for (let i = 0; i < n; i++) { const r = 3.5 + T.rnd() * 4.5, cx = x + i * 19 + T.rnd() * 8, cy = y + Math.sin(i * 1.3) * 9, a0 = T.rnd() * 6, a1 = a0 + 3.6 + T.rnd() * 2; ri += `M${f(cx + Math.cos(a0) * r)} ${f(cy + Math.sin(a0) * r)}A${f(r)} ${f(r)} 0 1 1 ${f(cx + Math.cos(a1) * r)} ${f(cy + Math.sin(a1) * r)}`; }
    k += `<path d="${ri}" fill="none" stroke="#d6dbde" stroke-width="1.1" stroke-opacity=".32"/>`;
  }
  /* Knöchel auf dem Schwanzstiel */
  {
    const kn = [];
    for (let i = 0; i < 7; i++) { const x = 430 - i * 44; kn.push([x, R.yo(x) + 8, 9 - i * 0.6]); }
    k += kn.map(([x, y, r]) => weichF([[x - r * 2, y + r], [x, y - r * 0.6], [x + r * 2, y + r]], "#c8d2da", 0.28, 3) + weichF([[x - r * 2, y + r * 1.6], [x + r * 2, y + r * 1.2], [x + r * 1.5, y + r * 2.6], [x - r * 1.5, y + r * 2.6]], "#000", 0.3, 4)).join("");
  }
  /* Fluke: Kante am Stiel, Licht vorn */
  k += weichF([[100, -228], [66, -226], [44, -216], [40, -210], [44, -204], [66, -208], [100, -208], [80, -217]], "#000", 0.45, 9);
  k += weichF([[80, -229], [30, -236], [-20, -247], [-56, -252], [-10, -244], [40, -232]], "#c8d2da", 0.3, 3);
  k += weichF([[80, -207], [30, -199], [-20, -188], [-66, -179], [-24, -190], [40, -202]], "#c8d2da", 0.3, 3);
  /* Mund: schmaler, unterständiger Unterkiefer weit hinter der Stirn; Maullinie leicht gebogen; Lippen weiß, nach
     hinten schmaler; Mundwinkel weiß; Kehle im Schatten */
  const maul = [[1392, -141], [1340, -134], [1270, -128], [1200, -124], [1140, -122], [1100, -124], [1082, -129]];
  const unten = [[1392, -141], [1384, -132], [1340, -122], [1270, -114], [1200, -109], [1140, -108], [1100, -112], [1082, -129]];
  k += weichF(maul.concat(unten.slice(1, -1).reverse()), "#e2e1db", 0.88, 1);
  k += weichF([[1110, -136], [1086, -134], [1078, -126], [1090, -120], [1112, -124]], "#e2e1db", 0.8, 1.5);
  k += weichF(unten.slice(1, -1).map((p) => [p[0], p[1] + 2]).concat(unten.slice(1, -1).reverse().map((p) => [p[0], p[1] + 12])), "#000", 0.3, 4);
  k += L([maul], "#0c0d0e", 3, 0.9) + L([maul.slice(0, 6).map((p) => [p[0], p[1] - 3])], "#e7e6e0", 2, 0.5);
  k += weichF([[1440, -150], [1400, -142], [1300, -140], [1200, -138], [1120, -134], [1200, -150], [1400, -160]], "#000", 0.25, 8);
  /* Blasloch: S-förmig vorn links oben */
  k += L([[[1478, -332], [1470, -336], [1462, -333], [1454, -336], [1446, -339]]], "#0b0c0d", 3.4, 0.85) + L([[[1478, -328], [1470, -332], [1462, -329], [1454, -332]]], "#d6dde2", 1.6, 0.45);
  s += teil(R.d, HAUT, { innen: k, randA: 0.25, rw: 1.4 });
  /* Brustflosse: klein, paddelförmig */
  s += teil(G([[1010, -112], [990, -86], [962, -64], [930, -54], [912, -60], [920, -78], [944, -98], [972, -116]]), "#36373a", { innen: weichF([[1004, -106], [982, -82], [956, -64], [936, -58], [956, -72], [980, -94]], "#c8d2da", 0.3, 3) + weichF([[1020, -120], [980, -122], [970, -104], [1004, -100]], "#000", 0.45, 6), randA: 0.25, rw: 1.2 });
  /* Auge: klein, knapp hinter und über dem Mundwinkel */
  s += H.walAuge(1050, -160, 6.4, { winkel: -4, hell: "#b4c0c8" });
  return H.ende(s, [-68, -370, 1500, -54], [1000, -360, 1502, -90]);
}

/* =====================================================================
   NARWAL
   ===================================================================== */
/* RECHERCHE Narwal (Monodon monoceros), Bulle:
   Körper 4–5,5 m (hier 4,5 m) plus STOSSZAHN bis 3 m (hier 2,3 m): der linke obere Eckzahn wächst durch die
   Oberlippe nach vorn, gerade, spitz zulaufend, LINKSGEDREHT spiralig gefurcht, an der Wurzel oft gelblich-grün
   (Algen), Spitze glatt und hell. Kopf klein und rund mit vorgewölbter Melone, KEIN Schnabel, Maul klein; Auge
   klein über dem Mundwinkel. Beweglicher Hals mit Hautfalte. KEINE Rückenfinne, nur ein niedriger, unregelmäßiger
   Rückenkamm (~5 cm) auf der hinteren Rückenhälfte. Brustflossen kurz, rund, Spitzen nach oben gebogen. Fluke bei
   alten Bullen mit konkaver Vorderkante und konvexer Hinterkante („verkehrt herum“), tiefe Kerbe. Färbung:
   gesprenkelt – dunkle graubraune Flecken auf grauweißem Grund, am Rücken dicht bis fast geschlossen, am Bauch
   weiß; Kopf dunkler. */
function narwal(T) {
  const H = mach(T), { G, L, teil, weichF, weichL, F, f } = H;
  const GRUND = "#c9ccc9", FLECK = "#3a3c3e";
  const R = H.rumpf(
    [[460, -80], [458.5, -95], [451, -110], [438, -121], [420, -128], [400, -130.5], [380, -128.5], [356, -129.5], [322, -135], [284, -138.5], [244, -138], [204, -133.5], [164, -125], [124, -113], [88, -100], [60, -91], [36, -85]],
    [[460, -80], [457.5, -68], [449, -58], [434, -50], [415, -45], [392, -42], [362, -40], [322, -38.5], [282, -38.5], [242, -41], [202, -47], [162, -55], [122, -64], [88, -72], [60, -78], [36, -81]],
    [[20, -88], [4, -93], [-10, -99], [-22, -106], [-30, -112, 1], [-38, -109], [-44, -103], [-46, -96], [-42, -89], [-34, -84.5, 1], [-42, -80], [-50, -73], [-54, -64], [-50, -55], [-42, -50, 1], [-30, -57], [-14, -66], [4, -73], [22, -78]]);
  const P = R.P;
  let s = "";
  let k = "";
  /* Fleckung: Grundton hell, darüber dunkle Flecken (oben dicht, unten spärlich), Rücken fast geschlossen dunkel */
  k += weichF(R.band(-60, 470, -0.3, (x) => 0.3 + 0.06 * Math.sin(x / 23) + 0.04 * Math.sin(x / 7)), "#2f3134", 0.95, 2.5);
  k += weichF(R.band(-60, 470, 0.2, (x) => 0.5 + 0.05 * Math.sin(x / 17)), FLECK, 0.3, 6);
  {
    /* Flecken als gedrehte Ellipsen (je Fleck zwei überlappende → unregelmäßig), leicht weich */
    let d = "";
    const n = F ? 310 : 80;
    for (let i = 0; i < n; i++) {
      const x = -40 + T.rnd() * 505, t = 0.12 + Math.pow(T.rnd(), 1.3) * 0.75, dicht = 1 - (t - 0.12) / 0.75;
      if (T.rnd() > 0.25 + dicht) continue;
      const [px, py] = P(x, t), r = (1.4 + T.rnd() * (F ? 4.2 : 6)) * (0.6 + dicht * 0.7);
      for (let j = 0; j < (r > 3.5 ? 2 : 1); j++) {
        const rx = r * (0.7 + T.rnd() * 0.5), ry = rx * (0.45 + T.rnd() * 0.35), w = Math.round(T.rnd() * 180), ox = px + (j ? (T.rnd() - 0.5) * r : 0), oy = py + (j ? (T.rnd() - 0.5) * r * 0.6 : 0);
        const c = Math.cos(w * Math.PI / 180), sn = Math.sin(w * Math.PI / 180);
        const g1 = (v) => String(Math.round(v * 2) / 2);
        d += `M${f(ox - c * rx)} ${f(oy - sn * rx)}a${g1(rx)} ${g1(ry)} ${w} 1 0 ${g1(2 * c * rx)} ${g1(2 * sn * rx)}a${g1(rx)} ${g1(ry)} ${w} 1 0 ${g1(-2 * c * rx)} ${g1(-2 * sn * rx)}`;
      }
    }
    k += `<path d="${d}" fill="${FLECK}" opacity=".72"${F ? ` filter="${H.weich(0.35, [-60, -150, 470, -30])}"` : ""}/>`;
  }
  /* Kopf und Hals dunkler, Bauch weiß */
  k += weichF([[470, -140], [400, -135], [380, -60], [430, -40], [470, -60]], FLECK, 0.45, 10);
  k += weichF(R.band(60, 420, 0.8, 1.1), "#f2f2ee", 0.6, 5);
  /* Licht: nasser Glanz oben, Kernschatten unten, Reflexlicht */
  k += H.rampe(R, 30, 460, [-0.1], 0.2, "#dfe8ee", 0.08, 4) + H.rampe(R, 30, 460, [-0.1], 0.42, "#dfe8ee", 0.04, 8);
  k += H.rampe(R, 30, 456, [0.5, 0.6, 0.7, 0.78], 0.98, "#1a2027", 0.07, 5);
  k += weichF(R.band(80, 440, 0.95, 1.06), "#ffffff", 0.25, 1.5);
  k += weichF(R.saum(380, 460, 1.5, 5), "#ffffff", 0.55, 1);
  k += weichF(R.linse(240, 370, 0.07, 0.02), "#ffffff", 0.45, 1);
  k += weichF(R.linse(80, 220, 0.09, 0.022), "#ffffff", 0.35, 1);
  /* Halsfalte hinter dem Kopf, Rückenkamm (niedrig, unregelmäßig) */
  k += weichL([[P(388, 0.12), P(384, 0.4), P(386, 0.66)]], "#000", 3.4, 0.22, 2.2) + weichL([[P(383, 0.14), P(379, 0.4), P(381, 0.64)]], "#fff", 2, 0.12, 1.6);
  if (F) {
    const kamm = [];
    for (let i = 0; i < 9; i++) { const x = 270 - i * 18 - T.rnd() * 6; kamm.push([x, R.yo(x) + 3, 2.4 + T.rnd() * 1.6]); }
    k += kamm.map(([x, y, r]) => weichF([[x - r * 2, y + r], [x, y - r * 0.5], [x + r * 2, y + r]], "#eef3f6", 0.3, 1) + weichF([[x - r * 2, y + r * 1.5], [x + r * 2, y + r * 1.3], [x, y + r * 2.6]], "#000", 0.3, 1.2)).join("");
  }
  /* Fluke: Kante am Stiel, Licht */
  k += weichF([[40, -90], [20, -88], [8, -84], [6, -80], [10, -77], [20, -78], [40, -80]], "#000", 0.35, 3);
  k += weichF([[36, -90], [0, -96], [-30, -112], [-48, -96], [-36, -84], [-54, -64], [-42, -50], [0, -72], [36, -80]], FLECK, 0.75, 2);
  k += weichF([[24, -89], [4, -95], [-14, -103], [-28, -110], [-16, -104], [4, -97]], "#eef3f6", 0.3, 1);
  /* Maul (klein, leicht nach oben gebogen), Narben */
  k += L([[[459, -70], [452, -63], [444, -58.5], [437, -57]]], "#14171a", 0.9, 0.85) + L([[[456, -66], [450, -60.5], [443, -57.5]]], "#ffffff", 0.5, 0.35);
  if (F) k += H.narbenG([[330, -110, -6, 20, 2, 1.4, 0.5], [210, -100, 8, 16, 2, 1.3, -0.4], [400, -90, 30, 10, 1, 1, 0.3]], "#e6eaec", 0.4, 0.4);
  s += teil(R.d, GRUND, { innen: k, randA: 0.22, rw: 0.5 });
  /* Brustflosse: kurz, rund, Spitze nach oben gebogen */
  s += teil(G([[408, -50], [400, -40], [388, -33], [374, -31], [366, -34], [364, -40], [372, -42], [384, -45], [394, -52]]), "#4a4d50", { innen: weichF([[404, -48], [392, -38], [378, -33], [388, -40]], "#e4ebef", 0.3, 1) + weichF([[412, -56], [396, -56], [392, -46], [406, -44]], "#000", 0.35, 2), randA: 0.25, rw: 0.45 });
  /* Stoßzahn: linker Eckzahn durch die Oberlippe, gerade, spitz, linksgedreht gefurcht ("/" auf der sichtbaren Seite) */
  const z0 = [450, -67], z1 = [690, -55.5], zl = Math.hypot(z1[0] - z0[0], z1[1] - z0[1]), ux = (z1[0] - z0[0]) / zl, uy = (z1[1] - z0[1]) / zl, nx = -uy, ny = ux;
  const rz = (t) => 4 * (1 - t) + 0.6 * t;
  const zp = (t, q) => [z0[0] + ux * zl * t + nx * rz(t) * q, z0[1] + uy * zl * t + ny * rz(t) * q];
  const zumriss = [];
  for (let i = 0; i <= 12; i++) zumriss.push(zp(i / 12, -1));
  zumriss.push([z1[0] + ux * 1.2, z1[1] + uy * 1.2, 1]);
  for (let i = 12; i >= 0; i--) zumriss.push(zp(i / 12, 1));
  let zi = `<path d="${G(zumriss)}" fill="${T.lg("zahnL", [[0, "#9c8a55"], [0.18, "#c8b98a"], [0.5, "#e8e0c8"], [1, "#f6f3ea"]], 0, 0, 1, 0)}" opacity=".9"/>`;
  /* Spiralfurchen: Schraubenlinie auf dem Zylinder, sichtbare Hälfte; Steigung ~8 cm */
  let fu = "", gr = "";
  for (let i = 0; i < 30; i++) {
    const tm = (i + 0.5) / 30, pts = [];
    for (let j = 0; j <= 6; j++) { const a = -Math.PI / 2 + j / 6 * Math.PI, q = Math.sin(a), t = tm + (j / 6 - 0.5) * 0.026; pts.push(zp(t, -q * 0.98)); }
    const dd = "M" + pts.map((p) => f(p[0]) + " " + f(p[1])).join("L");
    fu += dd;
  }
  zi += `<path d="${fu}" fill="none" stroke="#6b5a35" stroke-width=".5" stroke-opacity=".45"/>`;
  if (F) zi += `<path d="${fu}" fill="none" stroke="#fffaf0" stroke-width=".4" stroke-opacity=".5" transform="translate(1.1 .1)"/>`;
  zi += weichF([zp(0.02, -0.75), zp(0.6, -0.65), zp(0.98, -0.5), zp(0.6, -0.3), zp(0.02, -0.4)], "#ffffff", 0.55, 0.5);
  zi += weichF([zp(0.02, 0.5), zp(0.7, 0.4), zp(0.98, 0.6), zp(0.7, 1), zp(0.02, 1)], "#3a2f1c", 0.35, 0.6);
  zi += weichF([zp(0, -1), zp(0.12, -1), zp(0.12, 1), zp(0, 1)], "#5e6b3a", 0.3, 1.5);
  s += teil(G(zumriss), "#d9cfb0", { innen: zi, randA: 0.3, rw: 0.35 });
  /* Zahnaustritt: Lippenwulst um die Zahnbasis */
  s += weichF([[456, -73], [448, -72], [445, -66], [450, -61], [458, -63]], "#2b2e31", 0.5, 1.2);
  /* Auge: klein, über dem Mundwinkel */
  s += H.walAuge(427, -69, 1.5, { winkel: -8, hell: "#dbe4ea" });
  return H.ende(s, [-50, -139, 692, -31], [380, -140, 470, -40]);
}

module.exports = [
  { id: "orca", de: "der Orca", syl: "OR-ca", it: "l'orca", itSyl: "OR-ca", en: "orca",
    gruppe: "Meer", lebensraum: "Meer", laenge: 7.64, hoehe: 3.95, schwimmt: true, zeichne: orca },
  { id: "delfin", de: "der Delfin", syl: "DEL-fin", it: "il delfino", itSyl: "del-FI-no", en: "dolphin",
    gruppe: "Meer", lebensraum: "Meer", laenge: 3.06, hoehe: 0.98, schwimmt: true, zeichne: delfin },
  { id: "weisser_hai", de: "der Weiße Hai", syl: "WEI-ße HAI", it: "lo squalo bianco", itSyl: "SQUA-lo BIAN-co", en: "great white shark",
    gruppe: "Meer", lebensraum: "Meer", laenge: 4.48, hoehe: 1.88, schwimmt: true, zeichne: weisser_hai },
  { id: "buckelwal", de: "der Buckelwal", syl: "BU-ckel-wal", it: "la megattera", itSyl: "me-GAT-te-ra", en: "humpback whale",
    gruppe: "Meer", lebensraum: "Meer", laenge: 14.6, hoehe: 4.19, schwimmt: true, zeichne: buckelwal },
  { id: "hammerhai", de: "der Hammerhai", syl: "HAM-mer-hai", it: "lo squalo martello", itSyl: "SQUA-lo mar-TEL-lo", en: "hammerhead shark",
    gruppe: "Meer", lebensraum: "Meer", laenge: 4.7, hoehe: 1.71, schwimmt: true, zeichne: hammerhai },
  { id: "mantarochen", de: "der Mantarochen", syl: "MAN-ta-ro-chen", it: "la manta", itSyl: "MAN-ta", en: "manta ray",
    gruppe: "Meer", lebensraum: "Meer", laenge: 5.71, hoehe: 3.55, schwimmt: true, zeichne: mantarochen },
  { id: "meeresschildkroete", de: "die Meeresschildkröte", syl: "MEE-res-schild-krö-te", it: "la tartaruga marina", itSyl: "tar-ta-RU-ga ma-RI-na", en: "sea turtle",
    gruppe: "Meer", lebensraum: "Meer", laenge: 1.52, hoehe: 1.37, schwimmt: true, zeichne: meeresschildkroete },
  { id: "pottwal", de: "der Pottwal", syl: "POTT-wal", it: "il capodoglio", itSyl: "ca-po-DO-glio", en: "sperm whale",
    gruppe: "Meer", lebensraum: "Meer", laenge: 15.68, hoehe: 3.16, schwimmt: true, zeichne: pottwal },
  { id: "narwal", de: "der Narwal", syl: "NAR-wal", it: "il narvalo", itSyl: "NAR-va-lo", en: "narwhal",
    gruppe: "Meer", lebensraum: "Meer", laenge: 7.42, hoehe: 1.08, schwimmt: true, zeichne: narwal },
];
