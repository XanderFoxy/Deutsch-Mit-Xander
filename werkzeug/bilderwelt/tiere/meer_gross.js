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
function mach(T) {
  const F = T.fein;
  const f = (n) => String(Math.round(n * 10) / 10);
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
  H.rumpf = (oben, unten) => {
    const um = oben.concat(unten.slice(1).reverse());
    const dd = H.dicht(um, true, 12), no = oben.length - 1;
    const top = dd.filter((p) => p[2] < no), bot = dd.filter((p) => p[2] > no);
    const yo = lin(top), yu = lin(bot);
    const P = (x, t) => [x, yo(x) + t * (yu(x) - yo(x))];
    const tf = (t) => (typeof t === "function" ? t : () => t);
    const band = (x0, x1, t0, t1, n = 20) => {
      const a = tf(t0), b = tf(t1), A = [], B = [];
      for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; A.push(P(x, a(x, i / n))); B.push(P(x, b(x, i / n))); }
      return A.concat(B.reverse());
    };
    /* Linse: Band mit spitz zulaufenden Enden (Glanz, Schatten). tm = Mitte (Zahl oder f(x, u)), w = halbe Dicke in t */
    const linse = (x0, x1, tm, w, n = 16) => {
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
    const stil = `fill="none" stroke="${o.rand || "#06080a"}" stroke-opacity="${o.randA != null ? o.randA : 0.45}" stroke-width="${o.rw || 0.9}" stroke-linejoin="round" stroke-linecap="round"`;
    if (o.randD) s += `<path d="${o.randD}" ${stil}/>`;
    else if (o.rand !== false) s += `<use href="#${id}" ${stil}/>`;
    return s;
  };
  H.clip = (d) => { const id = T.id("c" + nr++); T.def(`<clipPath id="${id}"><path d="${d}"/></clipPath>`); return `clip-path="url(#${id})"`; };
  /* weiche Kante: Gauß-Unschärfe mit eigenem Bereich (Box der Form + 3σ) */
  H.weich = (std, box) => {
    const id = T.id("w" + nr++), m = std * 3;
    T.def(`<filter id="${id}" filterUnits="userSpaceOnUse" x="${f(box[0] - m)}" y="${f(box[1] - m)}" width="${f(box[2] - box[0] + 2 * m)}" height="${f(box[3] - box[1] + 2 * m)}"><feGaussianBlur stdDeviation="${std}"/></filter>`);
    return `url(#${id})`;
  };
  /* weiche Fläche (Glanz, Schatten, Muster mit unscharfem Rand). pts = Punkte oder fertiger Pfad mit box */
  H.weichF = (pts, farbe, op, std, box) => {
    const d = typeof pts === "string" ? pts : G(pts);
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
  /* Kratzer/Narben: Gruppen paralleler heller Linien (Zahnharken), auf Körperkoordinaten R */
  H.narben = (R, n, x0, x1, t0, t1, len, farbe, w, op, o = {}) => {
    if (!F) return "";
    const z = [];
    for (let i = 0; i < n; i++) {
      const x = x0 + T.rnd() * (x1 - x0), t = t0 + T.rnd() * (t1 - t0);
      const a = (o.winkel != null ? o.winkel : -20) + (T.rnd() - 0.5) * (o.streu != null ? o.streu : 50);
      const k = o.parallel ? 1 + Math.floor(T.rnd() * o.parallel) : 1;
      const L = len * (0.5 + T.rnd());
      const [px, py] = R.P(x, t);
      const ar = a * Math.PI / 180, nx = -Math.sin(ar), ny = Math.cos(ar);
      for (let j = 0; j < k; j++) {
        const ox = px + nx * j * (o.abstand || 3), oy = py + ny * j * (o.abstand || 3);
        const bog = (T.rnd() - 0.5) * L * 0.15;
        z.push([[ox, oy], [ox + Math.cos(ar) * L / 2 + nx * bog, oy + Math.sin(ar) * L / 2 + ny * bog], [ox + Math.cos(ar) * L * (0.8 + T.rnd() * 0.3), oy + Math.sin(ar) * L * (0.8 + T.rnd() * 0.3)]]);
      }
    }
    return H.L(z, farbe, w, op);
  };
  /* Walauge (Seitenansicht): kleine Lidspalte, Hautfalten, dunkle Iris, Pupille, nasser Glanz.
     x, y = Mitte, r = halbe Breite, o: { winkel, iris, haut (Farbe der Falten), hell (Faltenlicht) } */
  H.walAuge = (x, y, rr, o = {}) => {
    const id = T.id("wa" + nr++);
    const W = rr, Ho = rr * (o.offen || 0.55), Hu = Ho * 0.8;
    const spalt = `M${f(-W)} 0C${f(-W * 0.5)} ${f(-Ho * 1.25)} ${f(W * 0.45)} ${f(-Ho * 1.3)} ${f(W)} ${f(-Ho * 0.1)}C${f(W * 0.45)} ${f(Hu * 1.15)} ${f(-W * 0.45)} ${f(Hu * 1.2)} ${f(-W)} 0Z`;
    T.def(`<clipPath id="${id}"><path d="${spalt}"/></clipPath>`);
    const ig = T.rg("waIris" + (o.iris || "3a2516").slice(1), [[0, o.iris || "#3a2516"], [0.62, o.iris || "#3a2516"], [0.9, "#120a06"], [1, "#050302"]], 0.5, 0.45, 0.55);
    let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${o.winkel || 0})">`;
    /* Augenhöhle: weiche Vertiefung, Wulst darüber, Falten */
    s += `<ellipse cx="0" cy="${f(rr * 0.05)}" rx="${f(W * 2.1)}" ry="${f(rr * 1.5)}" fill="${T.rg("waHoehle", [[0, "#000", 0.55], [0.55, "#000", 0.25], [1, "#000", 0]])}"/>`;
    s += `<path d="M${f(-W * 1.7)} ${f(-Ho * 0.6)}C${f(-W * 0.7)} ${f(-Ho * 2.6)} ${f(W * 0.9)} ${f(-Ho * 2.5)} ${f(W * 1.8)} ${f(-Ho * 0.8)}" fill="none" stroke="${o.hell || "#9fb2c2"}" stroke-opacity=".35" stroke-width="${f(rr * 0.22)}" stroke-linecap="round"/>`;
    if (F) s += `<path d="M${f(-W * 1.5)} ${f(Hu * 0.9)}C${f(-W * 0.6)} ${f(Hu * 2.2)} ${f(W * 0.7)} ${f(Hu * 2.1)} ${f(W * 1.5)} ${f(Hu * 0.7)}M${f(-W * 2)} ${f(-Ho * 0.2)}C${f(-W * 1.4)} ${f(-Ho * 1.1)} ${f(-W * 1.1)} ${f(-Ho * 1.6)} ${f(-W * 0.6)} ${f(-Ho * 2)}M${f(W * 1.3)} ${f(Hu * 1.6)}C${f(W * 1.8)} ${f(Hu * 1.2)} ${f(W * 2.1)} ${f(Hu * 0.6)} ${f(W * 2.3)} 0" fill="none" stroke="#000" stroke-opacity=".4" stroke-width="${f(rr * 0.1)}" stroke-linecap="round"/>`;
    s += `<path d="${spalt}" fill="#070504"/><g clip-path="url(#${id})">`;
    s += `<circle cx="${f(W * 0.08)}" cy="${f(-Ho * 0.1)}" r="${f(rr * 0.78)}" fill="${ig}"/>`;
    s += `<ellipse cx="${f(W * 0.1)}" cy="${f(-Ho * 0.1)}" rx="${f(rr * 0.3)}" ry="${f(rr * 0.24)}" fill="#020101"/>`;
    s += `<rect x="${f(-W)}" y="${f(-rr)}" width="${f(2 * W)}" height="${f(rr * 0.95)}" fill="${T.lg("waLid", [[0, "#000", 0.85], [0.6, "#000", 0.35], [1, "#000", 0]])}"/>`;
    s += `<ellipse cx="${f(W * 0.32)}" cy="${f(-Ho * 0.42)}" rx="${f(rr * 0.17)}" ry="${f(rr * 0.11)}" fill="#fff" opacity=".9"/>`;
    s += `<circle cx="${f(-W * 0.3)}" cy="${f(Hu * 0.35)}" r="${f(rr * 0.06)}" fill="#cfe0ea" opacity=".55"/></g>`;
    s += `<path d="M${f(-W)} 0C${f(-W * 0.5)} ${f(-Ho * 1.25)} ${f(W * 0.45)} ${f(-Ho * 1.3)} ${f(W)} ${f(-Ho * 0.1)}" fill="none" stroke="#020101" stroke-width="${f(rr * 0.2)}" stroke-linecap="round"/>`;
    s += `<path d="M${f(W * 0.85)} ${f(Hu * 0.3)}C${f(W * 0.3)} ${f(Hu * 1.3)} ${f(-W * 0.4)} ${f(Hu * 1.3)} ${f(-W * 0.9)} ${f(Hu * 0.35)}" fill="none" stroke="#e8f2f8" stroke-opacity=".45" stroke-width="${f(rr * 0.07)}"/>`;
    return s + `</g>`;
  };
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
  /* Rumpf: Rückenlinie / Bauchlinie ab Schnauzenspitze (7 m Bulle, Spitze bei x = 700) */
  const R = H.rumpf(
    [[700, -203], [699, -217], [694, -232], [684, -248], [668, -264], [645, -279], [612, -292], [570, -302], [520, -309], [460, -313], [400, -313], [340, -309], [285, -301], [230, -289], [178, -274], [130, -259], [92, -246], [56, -236, 1]],
    [[700, -203], [698, -193], [692, -182], [680, -172], [660, -163], [632, -156], [598, -150], [556, -145], [508, -142], [455, -142], [400, -145], [345, -152], [292, -163], [240, -178], [190, -194], [145, -207], [105, -216], [76, -222], [56, -227, 1]]);
  const P = R.P;
  let s = "";
  /* ferne Brustflosse (hinter dem Körper, dunkler) */
  s += teil(G([[585, -160], [565, -138], [540, -116], [518, -103], [505, -106], [512, -124], [532, -148], [556, -166]]), "#0c0e10", { randA: 0.3, innen: weichF([[575, -150], [550, -126], [522, -108], [530, -122], [556, -144]], "#8ea2b2", 0.25, 3) });
  /* Fluke: leicht von oben gesehen – obere Hälfte = fern, untere = nah; Kerbe hinten in der Mitte; EINE Form */
  const fluke = [[86, -244], [58, -247], [30, -255], [2, -266], [-24, -277], [-40, -283], [-46, -280, 1], [-36, -266], [-22, -250], [-10, -238], [-3, -231, 1], [-10, -224], [-22, -212], [-36, -195], [-46, -181, 1], [-40, -178], [-24, -184], [2, -196], [30, -208], [58, -218], [86, -221]];
  const flG = T.lg("flu", [[0, "#323a42"], [0.42, SCHWARZ], [0.58, "#0d0f12"], [1, "#07080a"]]);
  let fl = weichF([[70, -244], [30, -253], [-10, -268], [-40, -281], [-14, -264], [26, -248]], "#b3c6d4", 0.4, 2);
  fl += weichF([[70, -222], [30, -210], [-10, -196], [-40, -180], [-16, -196], [26, -214]], "#b3c6d4", 0.3, 2);
  fl += weichF([[60, -240], [10, -240], [-3, -231], [10, -224], [60, -226]], "#000", 0.5, 4);
  s += teil(G(fluke), flG, { innen: fl, randA: 0.5 });
  /* Rückenfinne (Bulle: hoch, gerade dreieckig; Basis taucht in den Rumpf) */
  const fRand = [[440, -300], [433, -320], [421, -360], [405, -402], [387, -440], [370, -468], [360, -481], [352, -483], [347, -476], [344, -440], [339, -396], [333, -352], [324, -318], [312, -300]];
  let fi = weichF([[432, -322], [418, -362], [402, -404], [384, -442], [364, -474], [356, -480], [372, -462], [392, -424], [408, -384], [422, -344]], "#c2d2de", 0.55, 2.2);
  fi += weichF([[358, -476], [350, -440], [345, -390], [339, -345], [328, -305], [318, -302], [332, -350], [338, -400], [346, -455]], "#000", 0.55, 5);
  fi += weichF([[418, -340], [402, -385], [384, -430], [366, -462], [362, -440], [374, -400], [390, -355], [400, -330]], "#8296a8", 0.2, 10);
  if (F) fi += H.narben({ P: (x, t) => [x, -305 - t * 165] }, 4, 350, 415, 0.15, 0.8, 26, "#c9d3da", 0.5, 0.3, { winkel: 18, streu: 20, parallel: 3, abstand: 2.4 });
  s += teil(G(fRand.concat([[372, -282]])), SCHWARZ, { innen: fi, randD: G(fRand, false), randA: 0.55 });
  /* ---- Rumpf mit Zeichnung ---- */
  let k = "";
  /* Kinn/Kehle weiß: Grenze dicht unter der Maullinie, hinter dem Mundwinkel steil nach unten zur Brustflosse */
  const kinn = G([[712, -204], ...[[700, 0.5], [692, 0.51], [672, 0.53], [650, 0.555], [632, 0.575], [620, 0.6], [612, 0.66], [604, 0.76], [594, 0.86], [582, 0.94], [568, 1.0]].map((q) => P(q[0], q[1])), [560, -120, 1], [712, -120, 1]]);
  k += `<path d="${kinn}" fill="${WEISS}" filter="${H.weich(0.7, [555, -215, 702, -140])}"/>`;
  /* schmales Bauchband und Flankenfleck (vom Bauch schräg nach oben-hinten, Spitze nach hinten) */
  const flanke = R.muster([[575, 0.985], [530, 0.965], [470, 0.955], [415, 0.95], [388, 0.92], [366, 0.84], [348, 0.73], [330, 0.62], [310, 0.53], [288, 0.46], [264, 0.42], [238, 0.41], [212, 0.43], [188, 0.46], [168, 0.5], [184, 0.55], [206, 0.6], [228, 0.68], [246, 0.78], [258, 0.9], [264, 1.08], [575, 1.08]]);
  k += `<path d="${flanke}" fill="${WEISS}" filter="${H.weich(0.8, [160, -265, 580, -135])}"/>`;
  /* Sattelfleck: hellgrau, weich, hinter der Finne, unter deren Hinterkante beginnend */
  const sattel = R.muster([[350, -0.08], [342, 0.03], [328, 0.11], [306, 0.18], [276, 0.225], [244, 0.235], [214, 0.2], [190, 0.12], [176, 0.03], [170, -0.08]]);
  k += `<path d="${sattel}" fill="#a4acb2" filter="${H.weich(2.2, [165, -320, 360, -265])}"/>`;
  if (F) k += `<path d="${sattel}" fill="none" stroke="#2a3036" stroke-width="5" stroke-opacity=".35" filter="${H.weich(3, [160, -325, 365, -260])}"/>`;
  /* Augenfleck: über und hinter dem Auge, vorn stumpf, hinten schmal und ansteigend */
  const auge = P(605, 0.6);
  const af = [[607, -230], [603, -241], [592, -249], [574, -255], [552, -259], [530, -262], [513, -264], [503, -262], [508, -256], [524, -248], [548, -240], [572, -233], [592, -228]];
  k += `<path d="${G(af)}" fill="${WEISS}" filter="${H.weich(0.6, T.box(af))}"/>`;
  /* Licht von oben: Himmelslicht am Rücken, Kernschatten, bläuliches Reflexlicht der Flanke, Schatten auf Weiß */
  k += weichF(R.band(56, 698, -0.05, 0.3), "#b9cbd8", 0.17, 15);
  k += weichF(R.band(80, 660, 0.5, 0.78), "#000", 0.35, 14);
  k += weichF(R.band(300, 600, 0.72, 0.9), "#3a4b5b", 0.35, 8);
  k += weichF(R.band(260, 640, 0.86, 1.05), "#56677a", 0.38, 7);
  k += weichF(R.band(160, 650, 0.96, 1.08), "#b4c3cc", 0.3, 3);
  /* Glanz der nassen Haut: gebrochene Glanzlinsen entlang des Rückens, Bogen um die Melone */
  k += weichF(R.linse(452, 590, 0.075, 0.02), "#f4f9fc", 0.7, 1.4);
  k += weichF(R.linse(380, 440, 0.085, 0.012), "#f4f9fc", 0.4, 1.2);
  k += weichF(R.linse(176, 300, 0.085, 0.018), "#f4f9fc", 0.5, 1.4);
  k += weichF(R.linse(92, 168, 0.1, 0.022), "#f4f9fc", 0.4, 1.4);
  k += weichF(R.saum(600, 700, 4, 13), "#ffffff", 0.75, 1.6);
  k += weichF(R.saum(560, 640, 3, 7), "#ffffff", 0.35, 1.2);
  k += weichF(R.linse(300, 580, 0.27, 0.06), "#b8cad8", 0.13, 6);
  k += weichF(R.linse(95, 240, 0.22, 0.08), "#b8cad8", 0.15, 6);
  k += H.kaustik([56, -318, 700, -230], R.band(56, 700, -0.1, 0.36), { op: 0.07, fx: 0.022, fy: 0.04, seed: 23, blur: 1.4, exp: 4 });
  if (F) {
    /* Zahnharken-Narben (hell, in Gruppen parallel) und feine Hautfalten an der Brustflosse */
    k += H.narben(R, 6, 330, 520, 0.15, 0.45, 34, "#cfd8de", 0.4, 0.22, { winkel: -8, streu: 16, parallel: 4, abstand: 2.2 });
    k += H.narben(R, 3, 160, 300, 0.2, 0.4, 30, "#cfd8de", 0.4, 0.18, { winkel: 6, streu: 16, parallel: 3, abstand: 2.2 });
    const falten = [];
    for (let i = 0; i < 5; i++) { const x = 552 - i * 7 + T.rnd() * 3; falten.push([P(x + 5, 0.6 + T.rnd() * 0.04), P(x, 0.7), P(x - 1 - T.rnd() * 3, 0.79)]); }
    k += L(falten, "#000", 1.2, 0.22) + L(falten.map((z) => z.map((p) => [p[0] + 1.5, p[1]])), "#9fb1c0", 0.6, 0.12);
  }
  /* Maullinie: fast gerade, am Mundwinkel leicht abwärts; Lippenlicht darunter */
  const maul = [[700, -203], [684, -202.5], [662, -201.5], [642, -200], [628, -198], [619, -194.5]];
  k += L([maul], "#030405", 1.4, 0.95) + L([maul.slice(0, 5).map((p) => [p[0], p[1] + 1.8])], "#ffffff", 0.7, 0.4);
  s += teil(R.d, SCHWARZ, { innen: k, randA: 0.55 });
  /* nahe Brustflosse: großes, rundes Paddel nach hinten-unten, über dem Körper */
  const flosse = [[586, -168], [582, -150], [570, -130], [550, -110], [526, -96], [500, -88], [480, -88], [470, -95], [474, -108], [490, -124], [510, -142], [532, -160], [556, -174]];
  let fo = weichF([[580, -160], [566, -134], [546, -112], [520, -98], [496, -92], [516, -104], [546, -124], [568, -146]], "#a9bccb", 0.45, 3.5);
  fo += weichF([[476, -96], [492, -116], [514, -136], [538, -156], [528, -164], [504, -146], [484, -124]], "#000", 0.6, 5);
  fo += weichF([[590, -180], [545, -178], [530, -160], [575, -150]], "#000", 0.6, 7);
  s += teil(G(flosse), SCHWARZ, { innen: fo, randA: 0.55 });
  /* Fluke nah */
  /* Auge */
  s += H.walAuge(auge[0], auge[1], 4.2, { winkel: -6 });
  const box = [-46, -483, 700, -88];
  return { svg: `<g transform="translate(0 ${-box[3]})">${s}</g>`, box: [box[0], box[1] - box[3], box[2], 0] };
}

module.exports = [
  { id: "orca", de: "der Orca", syl: "OR-ca", it: "l'orca", itSyl: "OR-ca", en: "orca",
    gruppe: "Meer", lebensraum: "Meer", laenge: 7.46, hoehe: 3.95, schwimmt: true, zeichne: orca },
];
