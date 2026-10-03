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
  /* Szene (klein): ganze Zentimeter genügen */
  const f = F ? (n) => String(Math.round(n * 10) / 10) : (n) => String(Math.round(n));
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
    const stil = `fill="none" stroke="${o.rand || "#06080a"}" stroke-opacity="${o.randA != null ? o.randA : 0.45}" stroke-width="${o.rw || 0.9}" stroke-linejoin="round" stroke-linecap="round"`;
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
    const d = typeof pts === "string" ? pts : (std >= 2.5 && pts.length > 12 ? H.vieleck(pts) : G(pts));
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
  /* Walauge (Seitenansicht): kleine Lidspalte, Hautfalten, dunkle Iris, Pupille, nasser Glanz.
     x, y = Mitte, r = halbe Breite, o: { winkel, iris, haut (Farbe der Falten), hell (Faltenlicht) } */
  H.walAuge = (x, y, rr, o = {}) => {
    const id = T.id("wa" + nr++);
    const W = rr, Ho = rr * (o.offen || 0.55), Hu = Ho * 0.8;
    const spalt = `M${f(-W)} 0C${f(-W * 0.5)} ${f(-Ho * 1.25)} ${f(W * 0.45)} ${f(-Ho * 1.3)} ${f(W)} ${f(-Ho * 0.1)}C${f(W * 0.45)} ${f(Hu * 1.15)} ${f(-W * 0.45)} ${f(Hu * 1.2)} ${f(-W)} 0Z`;
    T.def(`<clipPath id="${id}"><path d="${spalt}"/></clipPath>`);
    const iris = o.iris || "#2c1c12";
    const ig = T.rg("waIris" + iris.slice(1), [[0, iris], [0.55, iris], [0.85, "#0e0806"], [1, "#030202"]], 0.5, 0.45, 0.55);
    let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${o.winkel || 0})">`;
    /* Augenhöhle: weiche Vertiefung; Lidwulst oben mit mattem Licht; feine Fältchen an den Winkeln */
    s += `<ellipse cx="0" cy="${f(rr * 0.05)}" rx="${f(W * 2.2)}" ry="${f(rr * 1.4)}" fill="${T.rg("waHoehle", [[0, "#000", 0.5], [0.6, "#000", 0.2], [1, "#000", 0]])}"/>`;
    if (F) {
      s += `<path d="M${f(-W * 1.4)} ${f(-Ho * 1.2)}C${f(-W * 0.6)} ${f(-Ho * 2.4)} ${f(W * 0.7)} ${f(-Ho * 2.4)} ${f(W * 1.5)} ${f(-Ho * 1.1)}" fill="none" stroke="${o.hell || "#a9bccb"}" stroke-opacity=".12" stroke-width="${f(rr * 0.5)}" stroke-linecap="round" filter="${H.weich(rr * 0.12, [-W * 1.6, -Ho * 2.6, W * 1.7, -Ho])}"/>`;
      s += `<path d="M${f(-W * 1.05)} ${f(Ho * 0.15)}l${f(-W * 0.5)} ${f(Ho * 0.35)}M${f(-W * 1.05)} ${f(-Ho * 0.1)}l${f(-W * 0.55)} ${f(-Ho * 0.15)}M${f(W * 1.05)} ${f(Hu * 0.05)}l${f(W * 0.4)} ${f(Hu * 0.45)}M${f(-W * 0.3)} ${f(Hu * 1.45)}c${f(W * 0.4)} ${f(Hu * 0.3)} ${f(W * 0.8)} ${f(Hu * 0.2)} ${f(W * 1.1)} ${f(-Hu * 0.2)}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="${f(rr * 0.08)}" stroke-linecap="round"/>`;
    }
    s += `<path d="${spalt}" fill="#050403"/><g clip-path="url(#${id})">`;
    s += `<circle cx="${f(W * 0.08)}" cy="${f(-Ho * 0.1)}" r="${f(rr * 0.8)}" fill="${ig}"/>`;
    s += `<ellipse cx="${f(W * 0.1)}" cy="${f(-Ho * 0.05)}" rx="${f(rr * 0.34)}" ry="${f(rr * 0.22)}" fill="#010101"/>`;
    s += `<rect x="${f(-W)}" y="${f(-rr)}" width="${f(2 * W)}" height="${f(rr * 0.95)}" fill="${T.lg("waLid", [[0, "#000", 0.85], [0.6, "#000", 0.4], [1, "#000", 0]])}"/>`;
    s += `<ellipse cx="${f(W * 0.3)}" cy="${f(-Ho * 0.4)}" rx="${f(rr * 0.15)}" ry="${f(rr * 0.1)}" fill="#fff" opacity=".9"/>`;
    s += `<ellipse cx="${f(-W * 0.35)}" cy="${f(Hu * 0.3)}" rx="${f(rr * 0.22)}" ry="${f(rr * 0.05)}" fill="#bcd0dc" opacity=".35"/></g>`;
    s += `<path d="M${f(-W)} 0C${f(-W * 0.5)} ${f(-Ho * 1.25)} ${f(W * 0.45)} ${f(-Ho * 1.3)} ${f(W)} ${f(-Ho * 0.1)}" fill="none" stroke="#010101" stroke-width="${f(rr * 0.22)}" stroke-linecap="round"/>`;
    s += `<path d="M${f(W * 0.85)} ${f(Hu * 0.3)}C${f(W * 0.3)} ${f(Hu * 1.3)} ${f(-W * 0.4)} ${f(Hu * 1.3)} ${f(-W * 0.9)} ${f(Hu * 0.35)}" fill="none" stroke="#dfeaf1" stroke-opacity=".3" stroke-width="${f(rr * 0.07)}"/>`;
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
  s += teil(G(fRand.concat([[372, -282]])), SCHWARZ, { innen: fi, randD: G(fRand, false), randA: 0.55 });
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
  k += H.riefen(R, 110, 600, 0.08, 0.3, 90, 0.3, 0.1, "#a9bccb");
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
  s += teil(R.d, SCHWARZ, { innen: k, randA: 0.55 });
  /* nahe Brustflosse: großes, rundes Paddel nach hinten-unten, über dem Körper */
  const flosse = [[586, -168], [582, -150], [570, -130], [550, -110], [526, -96], [500, -88], [480, -88], [470, -95], [474, -108], [490, -124], [510, -142], [532, -160], [556, -174]];
  let fo = weichF([[580, -160], [566, -134], [546, -112], [520, -98], [496, -92], [516, -104], [546, -124], [568, -146]], "#a9bccb", 0.45, 3.5);
  fo += weichF([[476, -96], [492, -116], [514, -136], [538, -156], [528, -164], [504, -146], [484, -124]], "#000", 0.6, 5);
  fo += weichF([[590, -180], [545, -178], [530, -160], [575, -150]], "#000", 0.6, 7);
  fo += weichF([[540, -140], [520, -120], [498, -104], [486, -100], [500, -114], [522, -132]], "#46586a", 0.35, 5);
  s += teil(G(flosse), SCHWARZ, { innen: fo, randA: 0.55 });
  /* Auge */
  s += H.walAuge(auge[0], auge[1], 4.2, { winkel: -6 });
  const box = [-64, -483, 700, -88];
  return { svg: `<g transform="translate(0 ${-box[3]})">${s}</g>`, box: [box[0], box[1] - box[3], box[2], 0] };
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
    [[281, -46.5], [279.6, -49.4], [276.5, -51.4], [272.5, -52.5], [269.5, -53.4, 1], [268.2, -57], [266.6, -61], [263.8, -65.2], [259, -69.4], [252, -72.8], [243, -75.4], [232, -77.4], [215, -79.8], [195, -81.7], [172, -83], [150, -83.3], [128, -82.2], [108, -79.8], [88, -75.6], [68, -69.8], [50, -63.6], [36, -59], [24, -56]],
    [[281, -46.5], [280.4, -44], [278, -42], [273, -40.4], [266, -39.1], [257, -37.7], [246, -35.7], [232, -33], [215, -30.2], [195, -28.3], [172, -27.5], [150, -28], [128, -29.8], [108, -33], [88, -37.5], [68, -42], [50, -45.8], [36, -48], [24, -49.2]],
    [[12, -58], [0, -60.2], [-10, -62.4], [-18, -64.2], [-21.5, -63.8, 1], [-16, -60.4], [-9, -57], [-3, -54.4], [-0.5, -52.8, 1], [-4, -51], [-11, -47.8], [-19, -43.8], [-25, -40.2, 1], [-20.5, -39.8], [-8, -43.4], [4, -46.4], [14, -48]]);
  const P = R.P;
  const RUECKEN = "#434b55", FLANKE = "#949da5", BAUCH = "#ece9e4";
  let s = "";
  /* Rückenfinne: hoch, sichelförmig, Spitze nach hinten */
  const fRand = [[170, -80.5], [163, -85.5], [154, -91.5], [144, -98], [133, -104], [122, -108.6], [113, -110.8], [107.5, -111, 1], [109.5, -107.4], [113.5, -102], [116.4, -95.6], [117.6, -89.4], [117.2, -85], [115, -82], [111, -80.6]];
  let fi = weichF([[166, -83], [154, -90.5], [140, -99], [126, -106], [113, -110], [124, -105], [138, -97], [152, -88.5]], "#d2dee6", 0.55, 0.9);
  fi += weichF([[110, -108], [114, -101], [117, -93], [118, -85], [114, -82], [113, -92], [111, -101]], "#000", 0.35, 2);
  fi += weichF([[170, -79], [150, -86], [128, -86], [117, -80], [140, -77]], "#000", 0.3, 3);
  if (F) fi += H.narbenG([[146, -92, 18, 16, 3, 0.9, 1], [128, -100, 30, 10, 2, 0.9, -1]], "#dfe6ea", 0.22, 0.4);
  s += teil(G(fRand.concat([[145, -74]])), RUECKEN, { innen: fi, randD: G(fRand, false), randA: 0.45, rw: 0.4 });
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
  k += weichF(R.band(70, 262, 0.96, 1.06), "#f2f2ee", 0.22, 1);
  /* Form: Schatten unter der Melone zum Schnabel, Hals leicht eingezogen, Brustkorb gewölbt, Kiel am Schwanzstiel */
  k += weichF([[270, -54], [266, -58], [262, -60], [258, -56], [260, -50], [268, -49]], "#1c252e", 0.3, 1.6);
  k += weichF(R.linse(205, 245, 0.3, 0.12), "#1c252e", 0.1, 3);
  k += weichF(R.linse(130, 200, 0.42, 0.14), "#ffffff", 0.08, 4);
  k += weichF(R.linse(24, 100, 0.12, 0.03), "#e6eff5", 0.3, 0.8);
  k += weichF(R.linse(30, 95, 0.62, 0.2), "#16202a", 0.15, 2.5);
  /* Glanzlinsen der nassen Haut: Melone, Rücken, Flanke */
  k += weichF(R.saum(230, 281, 1.4, 4.2), "#ffffff", 0.75, 0.6);
  k += weichF(R.linse(172, 226, 0.09, 0.022), "#ffffff", 0.7, 0.6);
  k += weichF(R.linse(122, 166, 0.085, 0.016), "#ffffff", 0.45, 0.5);
  k += weichF(R.linse(40, 112, 0.1, 0.022), "#ffffff", 0.55, 0.6);
  k += weichF(R.linse(150, 240, 0.3, 0.05), "#eaf2f7", 0.2, 2);
  k += weichF(R.linse(255, 278, (x, u) => 0.18 + u * 0.08, 0.06), "#ffffff", 0.5, 0.5);
  k += H.riefen(R, 40, 236, 0.1, 0.32, 110, 0.14, 0.07, "#e8f0f5") + H.riefen(R, 120, 236, 0.3, 0.55, 60, 0.14, 0.06, "#e8f0f5");
  k += H.kaustik([20, -86, 282, -55], R.band(20, 282, -0.1, 0.38), { op: 0.06, fx: 0.07, fy: 0.12, seed: 5, blur: 0.6, exp: 5, mblur: 4 });
  /* Fluke: Kante am Stiel, Licht auf den Vorderkanten, Schatten der nahen auf die ferne Hälfte */
  k += weichF([[26, -57], [12, -58], [2, -55], [-1, -52.8], [2, -50], [12, -48], [26, -49], [18, -53]], "#000", 0.35, 1.8);
  k += weichF([[22, -57.5], [8, -59], [-6, -61.6], [-20, -64], [-8, -60.4], [6, -57.4]], "#e3edf3", 0.4, 0.6);
  k += weichF([[22, -48.6], [8, -47.4], [-6, -44.6], [-23, -40.6], [-9, -43.8], [6, -46.4]], "#e3edf3", 0.4, 0.6);
  k += weichF([[-21, -63.6], [-16, -60.2], [-8, -56.4], [-1, -53], [-8, -55], [-16, -58.8]], "#000", 0.35, 0.9);
  /* Narben: helle Zahnharken in Gruppen (fast gerade, parallel), einzelne ältere Kratzer */
  if (F) {
    k += H.narbenG([[212, -67, -12, 15, 3, 0.85, 0.4], [190, -58, 4, 12, 4, 0.8, -0.3], [170, -71, -6, 16, 3, 0.85, 0.3], [138, -55, -10, 13, 3, 0.8, -0.3], [100, -66, 12, 12, 3, 0.8, 0.3], [228, -48, 22, 8, 2, 0.7, 0.3], [76, -60, -6, 10, 2, 0.7, 0]], "#e4eaee", 0.2, 0.38);
    k += H.narbenG([[184, -66, 2, 7, 1, 1, 0.5], [150, -72, -6, 6, 1, 1, 0.5], [118, -50, 8, 8, 1, 1, -0.5]], "#f4f6f7", 0.35, 0.3);
  }
  /* Kerbe Schnabel/Melone, Maullinie (leicht ansteigend), Lippenlicht, Blasloch, Ohröffnung */
  k += weichL([[[269.6, -53.6], [268.6, -52.2], [266.4, -50.8], [263, -49.4]]], "#1b2228", 0.6, 0.55, 0.35);
  k += weichL([[[268.4, -56.4], [267.4, -60.4], [265.2, -64.6]]], "#ffffff", 0.6, 0.35, 0.4);
  const maul = [[281, -46.6], [276, -46.7], [268, -47.1], [261, -47.8], [255.5, -49], [252.4, -50.6], [251.2, -51.8]];
  k += L([maul], "#141a1f", 0.55, 0.95) + L([maul.slice(0, 5).map((p) => [p[0], p[1] + 0.7])], "#ffffff", 0.35, 0.5);
  k += L([[[241, -76.2], [238.5, -76.6], [236, -76.5]]], "#20272d", 0.6, 0.6);
  s += teil(R.d, RUECKEN, { innen: k, randA: 0.45, rw: 0.4 });
  /* Brustflosse: spitz, nach hinten-unten, über dem Körper */
  const flosse = [[228, -38], [225, -31.5], [219.5, -25.6], [212, -20.4], [204, -16.2], [197.6, -13.8], [194, -13.4, 1], [197, -16.6], [201.5, -21], [206.5, -26.2], [211.5, -31.4], [216.5, -36.6], [221, -40]];
  let fo = weichF([[226, -35], [220, -27.6], [212, -21.6], [203, -16.6], [196.5, -14.2], [204, -19], [213, -25.6], [221, -32]], "#dbe6ed", 0.5, 0.9);
  fo += weichF([[196.6, -15.6], [202, -21.6], [208, -28], [214, -35], [210, -36], [204, -28.6], [199, -21.6]], "#000", 0.35, 1.4);
  fo += weichF([[230, -42], [214, -41], [208, -35], [224, -31]], "#000", 0.45, 2.4);
  s += teil(G(flosse), "#5d6771", { innen: fo, randA: 0.45, rw: 0.4 });
  s += weichF([[249, -58], [244, -61.5], [237, -61], [232, -58], [236, -55], [244, -54.6]], "#20282f", 0.35, 1.2);
  s += H.walAuge(244, -58.2, 1.3, { winkel: -8, hell: "#dbe5ec" });
  const box = [-25, -111, 281, -13.4];
  return { svg: `<g transform="translate(0 ${-box[3]})">${s}</g>`, box: [box[0], box[1] - box[3], box[2], 0] };
}

module.exports = [
  { id: "orca", de: "der Orca", syl: "OR-ca", it: "l'orca", itSyl: "OR-ca", en: "orca",
    gruppe: "Meer", lebensraum: "Meer", laenge: 7.64, hoehe: 3.95, schwimmt: true, zeichne: orca },
  { id: "delfin", de: "der Delfin", syl: "DEL-fin", it: "il delfino", itSyl: "del-FI-no", en: "dolphin",
    gruppe: "Meer", lebensraum: "Meer", laenge: 3.06, hoehe: 0.98, schwimmt: true, zeichne: delfin },
];
