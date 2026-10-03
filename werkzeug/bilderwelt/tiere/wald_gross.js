/* =====================================================================
   TIER-BIBLIOTHEK — WALD, GROSSE TIERE (FASSUNG 854, MASSSTAB 2)
   Reh, Rothirsch, Wildschwein, Elch, Wisent, Dachs, Biber, Fischotter.
   Maße in Zentimetern, Blick nach rechts, Boden y = 0, Licht von links oben.
   XANDER (03.10.): „fast fotorealistisch … Augen, Wimpern, jedes Haar … Zähne, Hufe, Muskeln, Sehnen …
   alles mit Licht und Schatten realistisch plastisch massiv“ – Reh, Hirsch, Wildschwein zuerst.
   Aufbau je Tier: ferne Beine (dunkler) → Körper als EIN Umriss (Rumpf + nahe Beine + Hals + Kopf), darin
   geklippt: Farbzonen, weiche Muskel-Licht-/Schattenformen, Rauschtextur, Haare in Wuchsrichtung → Hufe,
   Ohren, Geweih, Auge. Feinheiten (Haare, Textur, Weichzeichner) nur mit T.fein; Szene bleibt klein.
   ===================================================================== */
"use strict";

/* ---------- gemeinsame Helfer (nur für diese Datei) ---------- */
function kit(T, box = [-60, -320, 620, 40], grob = 0.5, feinQ = 10) {
  const F = T.fein;
  /* Zahlen: fein auf 1 mm (große Tiere 2 mm), in der Szene gröber (unsichtbar klein, spart Bytes) */
  const q = F ? feinQ : 1 / grob, f = (n) => String(Math.round(n * q) / q);
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
  const f2 = (n) => String(Math.round(n * 100) / 100);
  const H = { F, f, f2, G, US: ' gradientUnits="userSpaceOnUse"' };
  let nr = 0;
  const RAD = Math.PI / 180;
  /* lokales System (Kopf, Ohr, Geweih) → Tier: drehen um grad, skalieren, verschieben */
  H.tr = (pts, ox, oy, grad = 0, s = 1, sy = s) => {
    const c = Math.cos(grad * RAD), sn = Math.sin(grad * RAD);
    return pts.map((p) => [ox + p[0] * s * c - p[1] * sy * sn, oy + p[0] * s * sn + p[1] * sy * c, p[2], p[3], p[4]]);
  };
  H.pt = (ox, oy, grad = 0, s = 1) => (x, y) => H.tr([[x, y]], ox, oy, grad, s)[0].slice(0, 2);
  H.schieb = (pts, dx, dy = 0) => pts.map((p) => [p[0] + dx, p[1] + dy, p[2]]);
  /* Weichzeichner (nur fein) */
  const bl = new Set();
  H.blur = (sd) => {
    sd = [0.12, 0.25, 0.45, 0.8, 1.3, 2, 3, 4.5, 6.5].reduce((b, v) => (Math.abs(v - sd) < Math.abs(b - sd) ? v : b), 0.12);
    const id = T.id("b" + String(sd).replace(".", "_"));
    /* große Radien: Filterbereich im Tierraum (sonst schneidet der bbox-Bereich dünner Linien den Weichzeichner hart ab → Lichtblöcke) */
    const reg = sd >= 1.3 ? `filterUnits="userSpaceOnUse" x="${box[0]}" y="${box[1]}" width="${box[2] - box[0]}" height="${box[3] - box[1]}"` : `x="-.5" y="-.5" width="2" height="2"`;
    if (!bl.has(id)) { bl.add(id); T.def(`<filter id="${id}" ${reg} color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${sd}"/></filter>`); }
    return `url(#${id})`;
  };
  /* Fläche: Pfad EINMAL in defs, Füllung/Innenzeichnung/Rand per <use> */
  H.flaeche = (pts, sp = 1) => {
    const d = typeof pts === "string" ? pts : G(pts, true, sp);
    const id = T.id("t" + nr++);
    T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
    return { id, d, pts: typeof pts === "string" ? null : pts, use: (a) => `<use href="#${id}" ${a}/>`, clip: (inh) => (inh ? `<g clip-path="url(#${id}c)">${inh}</g>` : "") };
  };
  H.teil = (A, fill, innen = "", o = {}) => A.use(`fill="${fill}"`) + A.clip(innen) +
    (o.rand === false ? "" : A.use(`fill="none" stroke="${o.rand || "#140b05"}" stroke-opacity="${o.randA != null ? o.randA : 0.45}" stroke-width="${o.rw || 0.12}" stroke-linejoin="round"`));
  /* weicher Fleck (Licht/Schatten/Farbzone) mit Radialverlauf, ohne Filter */
  const flg = new Map();
  H.minFl = 1.2;
  H.fl = (x, y, rx, ry, rot, farbe, op = 1) => {
    if (!F && Math.max(rx, ry) < H.minFl) return "";
    if (!F) { const c = parseInt(farbe.length === 4 ? farbe.replace(/([0-9a-f])/gi, "$1$1").slice(1) : farbe.slice(1), 16); farbe = ((c >> 16) + ((c >> 8) & 255) + (c & 255)) > 450 ? "#fff" : "#000"; }
    let g = flg.get(farbe);
    if (!g) { g = T.rg("f" + farbe.slice(1), [[0, farbe, 0.9], [0.5, farbe, 0.45], [1, farbe, 0]]); flg.set(farbe, g); }
    return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}"${rot ? ` transform="rotate(${Math.round(rot)} ${f(x)} ${f(y)})"` : ""} fill="${g}"${op < 1 ? ` opacity="${op}"` : ""}/>`;
  };
  /* weiche Linie (Muskelfurche, Sehne, Lichtkante): mit Weichzeichner (fein) bzw. dünn (Szene) */
  H.wl = (zuege, farbe, w, op, sd) => {
    const d = zuege.map((p) => (sd >= 0.5 ? "M" + p.map((q) => f(q[0]) + " " + f(q[1])).join("L") : G(p, false))).join("");
    if (!F) return "";
    return `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${f(w)}" stroke-opacity="${op}" stroke-linecap="round"${sd ? ` filter="${H.blur(sd)}"` : ""}/>`;
  };
  /* weiche Fläche (Farbzone mit unscharfem Rand) */
  H.wf = (pts, farbe, op, sd) => !F && op < 0.3 ? "" : `<path d="${typeof pts === "string" ? pts : F && sd >= 0.5 ? H.poly(pts) : G(pts)}" fill="${farbe}"${op < 1 ? ` opacity="${op}"` : ""}${F && sd ? ` filter="${H.blur(sd)}"` : ""}/>`;
  /* Farbzone ohne Filter: Fläche mit Verlauf (userSpace) von a (unsichtbar) nach b (deckend) */
  H.zone = (n, pts, farbe, op, a, b) => `<path d="${G(pts)}" fill="${T.lg("z" + n, [[0, farbe, 0], [1, farbe, op]], a[0], a[1], b[0], b[1], H.US)}"/>`;
  /* Randlicht/Randschatten: breiter Strich am Umriss, Licht links oben, Schatten rechts unten (in der Fläche geklippt) */
  H.rim = (A, w, op = 1, g) => !F && w < 2 ? "" : A.use(`fill="none" stroke="${g || T.lg("rim", [[0, "#fff", 0.45], [0.4, "#fff", 0], [0.6, "#000", 0], [1, "#000", 0.55]], 0, 0, 0.6, 1)}" stroke-width="${f(w)}"${op < 1 ? ` opacity="${op}"` : ""}${F ? ` filter="${H.blur(w * 0.3)}"` : ""}`);
  /* Haare Haar für Haar: n Haare in poly, Wuchsrichtung winkel(x, y) (Grad, 0 = rechts, 90 = unten), Länge laenge(x, y).
     farben: [[farbe, anteil, breite (cm), deckkraft]]. Koordinaten in mm und relativ → klein. Szene: Anteil o.szene (0,25). */
  const haarPfade = (eimer, farben) => eimer.map((e, i) => {
    if (!e.length) return "";
    /* in Bändern sortieren (Schlangenlinie) → kurze relative Sprünge */
    e.sort((p, q) => (Math.floor(p[1] / 40) - Math.floor(q[1] / 40)) || ((Math.floor(p[1] / 40) % 2 ? -1 : 1) * (p[0] - q[0])));
    let d = "", cx = 0, cy = 0;
    e.forEach((h, j) => {
      d += j ? `m${h[0] - cx} ${h[1] - cy}` : `M${h[0]} ${h[1]}`;
      d += `q${h[2]} ${h[3]} ${h[4]} ${h[5]}`;
      cx = h[0] + h[4]; cy = h[1] + h[5];
    });
    d = d.replace(/ -/g, "-");
    const c = farben[i];
    return `<path transform="scale(.1)" d="${d}" fill="none" stroke="${c[0]}" stroke-width="${f(c[2] * 10)}" stroke-opacity="${c[3]}" stroke-linecap="round"/>`;
  }).join("");
  const haarWurf = (quelle, n, winkel, laenge, farben, o) => {
    const ziel = Math.round(n * (F ? 1 : (o.szene != null ? o.szene : 0)));
    const wf = typeof winkel === "function" ? winkel : () => winkel;
    const lf = typeof laenge === "function" ? laenge : () => laenge;
    const summe = farben.reduce((s, c) => s + c[1], 0);
    const eimer = farben.map(() => []), tips = [];
    const streu = o.streu != null ? o.streu : 16, kr = o.krumm != null ? o.krumm : 0.18;
    let v = 0, g = 0;
    while (g < ziel && v < ziel * 14) {
      v++;
      const q = quelle();
      if (!q) continue;
      const [x, y] = q;
      if (o.nur && !o.nur(x, y)) continue;
      const a = (wf(x, y) + (T.rnd() - 0.5) * streu) * RAD;
      const L = lf(x, y) * (0.6 + T.rnd() * 0.8);
      const ex = Math.cos(a) * L, ey = Math.sin(a) * L, k = kr * L * (T.rnd() - 0.5) * 2;
      let u = T.rnd() * summe, i = 0;
      while (i < farben.length - 1 && u > farben[i][1]) { u -= farben[i][1]; i++; }
      eimer[i].push([Math.round(x * 10), Math.round(y * 10), Math.round((ex / 2 - Math.sin(a) * k) * 10), Math.round((ey / 2 + Math.cos(a) * k) * 10), Math.round(ex * 10), Math.round(ey * 10)]);
      /* helle Haarspitze (zweiter Ton) auf dem letzten Drittel desselben Haars – im Licht häufiger */
      if (o.spitze && T.rnd() < (typeof o.spitze[1] === "function" ? o.spitze[1](x, y) : o.spitze[1])) {
        const sx = x + ex * 0.6 + Math.sin(a) * k * 0.3, sy = y + ey * 0.6 - Math.cos(a) * k * 0.3;
        tips.push([Math.round(sx * 10), Math.round(sy * 10), Math.round(ex * 2), Math.round(ey * 2), Math.round(ex * 4), Math.round(ey * 4)]);
      }
      g++;
    }
    return haarPfade(eimer, farben) + (tips.length ? haarPfade([tips], [o.spitze]) : "");
  };
  H.haare = (poly, n, winkel, laenge, farben, o = {}) => {
    const [x0, y0, x1, y1] = T.box(poly);
    return haarWurf(() => { const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0); return T.inPoly(x, y, poly) ? [x, y] : null; }, n, winkel, laenge, farben, o);
  };
  /* Haarsaum am Umriss: Haare, die über die Kante stehen (weiche Fell-Silhouette) */
  H.saum = (poly, n, winkel, laenge, farben, o = {}) => {
    const seg = [];
    let tot = 0;
    for (let i = 0; i < poly.length - (o.offen ? 1 : 0); i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; const l = Math.hypot(b[0] - a[0], b[1] - a[1]); seg.push([a, b, tot]); tot += l; }
    return haarWurf(() => {
      const t = T.rnd() * tot;
      let j = seg.length - 1;
      while (j > 0 && seg[j][2] > t) j--;
      const [a, b, t0] = seg[j], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, u = (t - t0) / l;
      return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
    }, n, winkel, laenge, farben, o);
  };
  /* Rauschtextur (Fellstruktur) – nur fein: Rechteck mit Filter, in Wuchsrichtung gedreht */
  H.tex = (n, o, winkel, box, op) => {
    if (!F) return "";
    const url = T.rauschen(n, o);
    const [a, b, c, d] = box, cx = (a + c) / 2, cy = (b + d) / 2, R = Math.hypot(c - a, d - b) / 2 + 1;
    return `<rect x="${f(cx - R)}" y="${f(cy - R)}" width="${f(2 * R)}" height="${f(2 * R)}" filter="${url}" opacity="${op}"${winkel ? ` transform="rotate(${Math.round(winkel)} ${f(cx)} ${f(cy)})"` : ""}/>`;
  };
  /* Fellmuster (nur fein): eine Kachel mit n Haaren (Länge len, Richtung 0° = nach rechts, leichte Streuung), als <pattern>.
     Zwei Kacheln mit ungleicher Größe übereinander lassen keine Wiederholung erkennen. Gedreht wird die Fläche, nicht das Muster. */
  H.fellMuster = (n, tile, anzahl, len, farbe, w, op, streu = 12) => {
    const id = T.id("fm" + n);
    let d = "";
    for (let i = 0; i < anzahl; i++) {
      const a = (T.rnd() - 0.5) * streu * RAD, l = len * (0.6 + T.rnd() * 0.7);
      const x = T.rnd() * (tile - l - 0.1), y = 0.1 + T.rnd() * (tile - 0.2), k = (T.rnd() - 0.5) * l * 0.12;
      d += `M${f2(x)} ${f2(y)}q${f2(Math.cos(a) * l / 2)} ${f2(Math.sin(a) * l / 2 + k)} ${f2(Math.cos(a) * l)} ${f2(Math.sin(a) * l)}`;
    }
    T.def(`<pattern id="${id}" width="${tile}" height="${tile}" patternUnits="userSpaceOnUse"><path d="${d.replace(/ -/g, "-")}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round"/></pattern>`);
    return `url(#${id})`;
  };
  /* Fellzone: Vieleck (Klippform), darin gedrehte Flächen mit den Fellmustern (Wuchsrichtung winkel) */
  H.fellZone = (poly, winkel, muster, op = 1) => {
    if (!F) return "";
    const Z = H.flaeche(H.poly(poly)), [a, b, c, d] = T.box(poly), cx = (a + c) / 2, cy = (b + d) / 2, R = Math.hypot(c - a, d - b) / 2 + 1;
    return Z.clip(`<g transform="rotate(${Math.round(winkel)} ${f(cx)} ${f(cy)})"${op < 1 ? ` opacity="${op}"` : ""}>` + muster.map((m) => `<rect x="${f(cx - R)}" y="${f(cy - R)}" width="${f(2 * R)}" height="${f(2 * R)}" fill="${Array.isArray(m) ? m[0] + `" opacity="${m[1]}` : m}"/>`).join("") + `</g>`);
  };
  /* Fellkorn aus Rauschen (nicht periodisch): feine Striche in Wuchsrichtung, Zone mit weicher Maske (keine harten Grenzen).
     schichten: [[name, farbe, deckkraft, seed]] – dunkle Unterwolle und helle Spitzen. */
  H.fellKorn = (n, poly, winkel, schichten, o = {}) => {
    if (!F) return "";
    const [a, b, c, d] = T.box(poly), Z = H.flaeche(H.poly(poly));
    const inn = schichten.map(([nm, farbe, op, seed]) => H.tex(nm, { fx: o.fx || 1.2, fy: o.fy || 9, farbe, staerke: 2.6, schwelle: o.schwelle || 0.56, okt: o.okt || 1, seed }, winkel, [a - 1, b - 1, c + 1, d + 1], op)).join("");
    if (!o.ein) return Z.clip(inn);
    /* weicher Einlauf (Verlaufsmaske statt Weichzeichner): von o.ein[0..1] (unsichtbar) nach o.ein[2..3] (voll) */
    const id = T.id("fm" + n), e = o.ein;
    T.def(`<mask id="${id}" maskUnits="userSpaceOnUse" x="${f(a - 2)}" y="${f(b - 2)}" width="${f(c - a + 4)}" height="${f(d - b + 4)}"><path d="${Z.d}" fill="${T.lg("fe" + n, [[0, "#fff", 0], [1, "#fff", 1]], e[0], e[1], e[2], e[3], H.US)}"/></mask>`);
    return `<g mask="url(#${id})">${inn}</g>`;
  };
  /* Vieleck ohne Glättung (Klippzonen) */
  H.poly = (pts) => "M" + pts.map((p) => f(p[0]) + " " + f(p[1])).join("L") + "Z";
  /* Punkte (Perlen, Höcker) als runde Strichenden: [[x, y, r]] → je Größe EIN Pfad */
  H.punkte = (liste, farbe, op = 1) => {
    const g = new Map();
    for (const [x, y, rr] of liste) { const k = Math.max(0.05, rr < 0.3 ? Math.round(rr * 20) / 20 : Math.round(rr * 8) / 8); g.set(k, (g.get(k) || "") + `M${f(x)} ${f(y)}h0`); }
    return [...g].map(([k, d]) => `<path d="${d}" stroke="${farbe}" stroke-width="${String(Math.round(k * 200) / 100)}" stroke-linecap="round"${op < 1 ? ` stroke-opacity="${op}"` : ""}/>`).join("");
  };
  /* Rauschtextur nur in einer Zone (eigene Klippform) */
  H.texR = (n, o, winkel, poly, op) => {
    if (!F) return "";
    const Z = H.flaeche(H.poly(poly));
    return Z.clip(H.tex(n, o, winkel, T.box(poly), op));
  };
  /* Kette (Bein, Geweihstange, Schwanz): J = [x, y, vorn, hinten, ecke] → Umriss L (vorn/links der Laufrichtung) und R */
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
  /* mehrere offene Linien in EINEM Pfad */
  H.L = (zuege, farbe, w, op = 1, extra = "") =>
    `<path d="${zuege.map((p) => G(p, false)).join("")}" fill="none" stroke="${farbe}" stroke-width="${f(w)}"${op < 1 ? ` stroke-opacity="${op}"` : ""} stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  /* Paarhufer-Schale (Seitenansicht): Ballen hinten bei xb, Spitze vorn bei xs, Kronrand-Höhe h, Vorderwand ≈ 52°.
     Zwei Klauen: die ferne ragt als schmaler Streifen vor/über der nahen hervor, dazwischen der dunkle Spalt; Glanz nur als
     feiner Streifen. o.stumpf: rundliche Rinderklaue (Wisent). */
  H.schale = (xb, xs, h, o = {}) => {
    const fa = o.farbe || "#2a2220", L = xs - xb, st = o.stumpf ? 1 : 0, vw = 1 - h * (o.stumpf ? 0.6 : 0.78) / L;
    const kl = (dx, dy) => {
      const X = (u) => f(xb + dx + L * u), Y = (v) => f(-h * v + dy);
      return `M${X(0.06)} ${Y(0.55)}Q${X(-0.02)} ${Y(0.18)} ${X(0.1)} ${Y(0.02)}L${X(0.9 - st * 0.1)} ${f(dy)}Q${X(1)} ${f(dy)} ${X(0.98 - st * 0.06)} ${Y(0.14 + st * 0.16)}` +
        `L${X(vw)} ${Y(1)}Q${X(vw * 0.6)} ${Y(1.08)} ${X(0.22)} ${Y(0.92)}Z`;
    };
    const rand = `stroke="#000" stroke-opacity=".6" stroke-width="${f2(L * 0.02)}"`;
    let s = F ? `<path d="${kl(L * 0.08, -h * 0.05)}" fill="${o.fern || "#0e0b0a"}" ${rand}/>` : "";
    s += `<path d="${kl(0, 0)}" fill="${fa}" ${rand}/>` + (H.fl(xb + L * 0.62, -h * 0.62, L * 0.26, h * 0.3, -50, "#fff", 0.2) + H.fl(xb + L * 0.2, -h * 0.25, L * 0.28, h * 0.4, 0, "#000", 0.4) +
      (F ? H.L([[[xb + L * vw + L * 0.05, -h * 0.9], [xs - L * 0.16, -h * 0.4], [xs - L * 0.05, -h * 0.12]]], "#fff", L * 0.022, 0.38) +
        H.L([[[xb + L * vw - L * 0.04, -h * 0.98], [xs - L * 0.24, -h * 0.4], [xs - L * 0.1, -h * 0.04]]], "#000", L * 0.028, 0.6) : ""));
    /* Kronrand mit Haarsaum */
    if (F) s += H.saum([[xb + L * 0.18, -h * 0.9], [xb + L * 0.5, -h * 1.02], [xb + L * vw + L * 0.02, -h * 0.98]], 20, 72, h * 0.3, [[o.haar || "#3a2a20", 1, L * 0.012, 0.7]], { offen: true, streu: 30, szene: 0 });
    return s;
  };
  /* Afterklaue: klein, spitz, nach hinten-unten, über dem Fesselgelenk */
  H.after = (x, y, g = 1, farbe = "#2a2220") => H.teil(H.flaeche([[x + 0.25 * g, y - 0.8 * g], [x + 0.5 * g, y + 0.1 * g], [x - 0.25 * g, y + 1.0 * g, 1], [x - 0.5 * g, y + 0.1 * g], [x - 0.3 * g, y - 0.5 * g]]),
    farbe, H.fl(x - 0.1 * g, y - 0.2 * g, 0.3 * g, 0.3 * g, 0, "#fff", 0.35), { rw: 0.05 * g, randA: 0.6 });
  /* Lauf als Zylinder: Lichtkante links, Kernschatten rechts, schmaler Reflex außen (gemeinsamer Verlauf, objektbezogen) */
  H.zyl = (pts, op = 1) => `<path d="${G(pts)}" fill="${T.lg("zyl", [[0, "#fff", 0.2], [0.22, "#fff", 0.04], [0.55, "#000", 0.1], [0.84, "#000", 0.32], [1, "#fff", 0.06]], 0, 0, 1, 0)}"${op < 1 ? ` opacity="${op}"` : ""}/>`;
  /* Volumen je Körperteil (kern.js T.volumen): Rundung, Kernschatten, Reflex aus der eigenen Silhouette */
  /* Volumen je Körperteil: kern.js T.volumen (stufenlos, Licht links oben, Kernschatten unten rechts) */
  H.vol = (n, weich, inn, o = {}) => (F ? `<g filter="${T.volumen(n, Object.assign({ weich }, o))}">${inn}</g>` : inn);
  /* Maske: unterhalb y1 voll, oberhalb y0 unsichtbar (weicher Übergang Bein → Rumpf) */
  H.maskeY = (n, y0, y1) => {
    const id = T.id("mk" + n);
    T.def(`<mask id="${id}" maskUnits="userSpaceOnUse" x="${box[0]}" y="${box[1]}" width="${box[2] - box[0]}" height="${box[3] - box[1]}"><rect x="${box[0]}" y="${box[1]}" width="${box[2] - box[0]}" height="${box[3] - box[1]}" fill="${T.lg("mg" + n, [[0, "#fff", 0], [1, "#fff", 1]], 0, y0, 0, y1, H.US)}"/></mask>`);
    return `url(#${id})`;
  };
  /* Auge eines Säugers (Seitenansicht): Augenhöhle mit Brauenwulst-Schatten, große Iris, Pupille, Oberlid-Schatten, dicker
     Lidrand, feuchter Unterlid-Saum, Glanzfenster + schwacher Zweitreflex, Wimpern nur am Oberlid (nach vorn-außen). */
  H.auge = (x, y, rr, o = {}) => {
    const w = o.winkel || 0, off = o.offen != null ? o.offen : 0.72, W = rr * 1.3, Ho = rr * off, Hu = rr * off * 0.78;
    const P = (t, a, b, c, d) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
    const ob = [[-W, 0], [-W * 0.5, -Ho * 1.2], [W * 0.4, -Ho * 1.25], [W, -Ho * 0.05]];
    const oben = `M${f2(-W)} 0C${f2(-W * 0.5)} ${f2(-Ho * 1.2)} ${f2(W * 0.4)} ${f2(-Ho * 1.25)} ${f2(W)} ${f2(-Ho * 0.05)}`;
    const sp = oben + `C${f2(W * 0.55)} ${f2(Hu * 1.15)} ${f2(-W * 0.4)} ${f2(Hu * 1.2)} ${f2(-W)} 0Z`;
    const A = H.flaeche(sp);
    const ir = T.rg("ir" + (o.iris || "#2a170b").slice(1), [[0, o.iris2 || "#5a3418"], [0.5, o.iris || "#2a170b"], [0.85, "#140a05"], [1, "#050302"]], 0.42, 0.5, 0.6);
    let s = `<g transform="translate(${f2(x)} ${f2(y)})${w ? ` rotate(${Math.round(w)})` : ""}">`;
    if (o.hoehle !== false) s += H.fl(0, -rr * 0.25, W * 1.8, rr * 1.6, 0, o.hoehle || "#1a0e06", 0.5) + H.fl(-rr * 0.1, -rr * 1.8, W * 1.3, rr * 0.55, 0, o.braue || "#e8c8a0", 0.28);
    s += A.use(`fill="#0a0604"`) + A.clip(
      `<circle cx="${f2(rr * 0.06)}" cy="${f2(rr * 0.04)}" r="${f2(rr)}" fill="${ir}"/>` +
      (o.pupille === "rund" ? `<circle cx="${f2(rr * 0.1)}" cy="0" r="${f2(rr * 0.36)}" fill="#030201"/>` : `<ellipse cx="${f2(rr * 0.08)}" cy="${f2(rr * 0.05)}" rx="${f2(rr * 0.52)}" ry="${f2(rr * 0.2)}" fill="#030201"/>`) +
      `<rect x="${f2(-W)}" y="${f2(-rr * 1.3)}" width="${f2(2 * W)}" height="${f2(rr * 1.3)}" fill="${T.lg("ls", [[0, "#000", 0.8], [0.6, "#000", 0.3], [1, "#000", 0]])}"/>` +
      `<rect x="${f2(rr * 0.16)}" y="${f2(-rr * 0.54)}" width="${f2(rr * 0.34)}" height="${f2(rr * 0.22)}" rx="${f2(rr * 0.05)}" fill="#fff" opacity=".9" transform="rotate(-8 ${f2(rr * 0.33)} ${f2(-rr * 0.43)})"/>` +
      `<ellipse cx="${f2(-rr * 0.42)}" cy="${f2(rr * 0.34)}" rx="${f2(rr * 0.2)}" ry="${f2(rr * 0.08)}" fill="#fff" opacity=".22"/>`);
    /* Lidrand: oben kräftig (Wulst), unten fein; feuchter Saum unter dem Unterlid; Lidfalte darüber */
    s += A.use(`fill="none" stroke="${o.lid || "#120a06"}" stroke-width="${f2(rr * 0.14)}"`) +
      `<path d="${oben}" fill="none" stroke="${o.lid || "#120a06"}" stroke-width="${f2(rr * 0.22)}" stroke-linecap="round"/>` +
      `<path d="M${f2(W * 0.75)} ${f2(Hu * 0.62)}C${f2(W * 0.2)} ${f2(Hu * 1.34)} ${f2(-W * 0.4)} ${f2(Hu * 1.34)} ${f2(-W * 0.85)} ${f2(Hu * 0.47)}" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="${f2(rr * 0.06)}"/>` +
      (F ? `<path d="M${f2(-W * 1.05)} ${f2(-Ho * 0.4)}C${f2(-W * 0.4)} ${f2(-Ho * 2)} ${f2(W * 0.5)} ${f2(-Ho * 1.95)} ${f2(W * 1.1)} ${f2(-Ho * 0.75)}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="${f2(rr * 0.09)}"/>` : "");
    /* Wimpern: nur Oberlid, dunkelbraun, nach vorn-außen geneigt */
    const n = F ? (o.wimpern || 0) : 0;
    if (n) {
      let d = "";
      const Lw = rr * (o.wimpernLaenge || 0.6);
      for (let i = 0; i < n; i++) {
        const t = 0.32 + 0.6 * i / Math.max(1, n - 1), bx = P(t, ob[0][0], ob[1][0], ob[2][0], ob[3][0]), by = P(t, ob[0][1], ob[1][1], ob[2][1], ob[3][1]);
        const a = (-112 + 62 * t) * Math.PI / 180, l = Lw * (0.75 + 0.5 * Math.sin(Math.PI * t));
        d += `M${f2(bx)} ${f2(by)}q${f2(Math.cos(a) * l * 0.4)} ${f2(Math.sin(a) * l * 0.6)} ${f2(Math.cos(a) * l + l * 0.25)} ${f2(Math.sin(a) * l * 0.85)}`;
      }
      s += `<path d="${d}" fill="none" stroke="${o.wimpernFarbe || "#2a1a10"}" stroke-width="${f2(rr * 0.05)}" stroke-linecap="round"/>`;
    }
    return s + `</g>`;
  };
  /* Bodenkontakt */
  H.kontakt = (xs, rx, ry) => xs.map((x) => `<ellipse cx="${f(x)}" cy="0" rx="${f(rx)}" ry="${f(ry)}" fill="#000" opacity=".28"/>`).join("");
  return H;
}

/* =====================================================================
   REH (Rehbock im Sommerfell)
   ===================================================================== */
/* RECHERCHE Reh (Capreolus capreolus):
   Schulterhöhe 60–75 (bis 90) cm, Kopf-Rumpf 100–135 cm, 15–30 kg; Hinterhand „überbaut“: Kruppe etwas höher als der
   Widerrist, schlanke lange Läufe, kurzer Rumpf, schlanker Hals. Schwanz nur 2–3 cm, im Spiegel verborgen.
   Sommerfell kurz, glatt, glänzend fuchsrot; Winterfell graubraun, dick. Spiegel (Analfleck) im Sommer klein und
   gelblich, im Winter weiß; Bauch und Innenseiten heller. Kopf graubraun, Stirn beim Bock dunkler.
   Gesicht: schwarzer, feuchter Nasenspiegel („Muffel“) mit schwarzem „Bart“ zu den Lippenwinkeln, dahinter eine
   helle Binde, Kinn weiß. Große, dunkle Augen seitlich mit langen schwarzen Wimpern, kleine Voraugendrüse.
   Lauscher groß (12–14 cm), oval, dunkel gesäumt, innen lange weiße Haare. Bock: Gehörn 20–25 cm, Sechser:
   Vorder- und Hintersprosse, Spitze; Rosenstock, Rose (Perlkranz), Stangen unten stark geperlt, dunkelbraun,
   Enden elfenbeinweiß gefegt. Paarhufer: zwei spitze schwarze Schalen, Afterklauen hinten am Fesselgelenk.
   Am Hinterlauf außen unter dem Sprunggelenk die Laufbürste (Haarbüschel der Mittelfußdrüse). */
function reh(T) {
  const H = kit(T, [0, -130, 130, 4]), { fl, wl, L, F, f } = H;
  H.minFl = 5;
  const DK = "#2a1206", HL = "#ffd2a0";
  /* ---- Kopf im lokalen System (Genick = 0, Nase bei x ≈ 20), um 33° nach unten geneigt ---- */
  const KX = 103.4, KY = -90.6, KW = 36;
  const KS = 1.14, K = H.pt(KX, KY, KW, KS), KT = (pts) => H.tr(pts, KX, KY, KW, KS);
  const kopf = KT([[-0.5, -1.4], [1.6, -2.6], [4.0, -3.3], [6.4, -3.3], [8.4, -2.7], [10.6, -1.4], [13.2, -0.1], [15.6, 1.0], [17.4, 1.8], [18.7, 2.7], [19.5, 3.9], [19.7, 5.1],
    [19.4, 6.2], [18.8, 6.9], [17.9, 7.4], [17.1, 7.7], [16.6, 8.3], [15.5, 8.9], [13.6, 9.3], [10.8, 9.4], [8.0, 10.0], [6.2, 10.7], [4.8, 10.6]]);
  /* ---- Läufe: Umriss vorn (oben → Huf) + hinten (Huf → oben) ---- */
  const vorne = [[89.6, -42], [88.6, -36], [88.1, -30], [88.1, -25.6], [87.4, -21.8], [86.8, -17], [86.8, -11], [87.5, -7.8], [88.7, -5.0], [89.8, -3.2],
    [89.6, -1.5], [87.0, -1.2], [85.6, -2.4], [84.4, -4.6], [83.4, -7.8], [84.1, -11.5], [84.3, -17], [84.2, -21], [83.3, -24.4], [83.6, -28.5], [83.0, -34], [81.8, -38.6]];
  const hinten = [[34.2, -46.2], [33.0, -44.2], [31.6, -41.6], [29.4, -37.8], [26.6, -33.6], [24.2, -29.8], [22.9, -27.4], [22.3, -24.6], [22.0, -18], [22.0, -11.5], [22.4, -8], [23.6, -5.3], [24.7, -3.3],
    [24.6, -1.5], [22.2, -1.2], [20.8, -2.4], [19.6, -4.8], [18.7, -8.2], [19.3, -11.5], [19.4, -18], [19.2, -23.5], [18.4, -26.8], [15.6, -30.4, 1], [16.6, -33.0], [17.0, -36], [16.2, -40.5], [14.7, -44.5]];
  /* ---- Gesamtumriss: Rücken → Widerrist → Hals → Kopf → Kehle → Brust → Vorderlauf → Bauch → Hinterlauf → Keule ---- */
  const ruecken = [[16, -73.6], [22, -76.0], [28.5, -76.6], [33, -75.8], [40, -74.6], [48, -73.4], [58, -71.8], [66, -71.6], [72, -72.6], [76, -74.6], [79.4, -76.6], [83, -77.8], [87, -80.2], [91.4, -83.6], [96.2, -87.6], [100.4, -90.6]];
  const kehle = [[100.2, -74.4], [98.8, -70.2], [97.4, -65.4], [96.6, -60.6], [96.8, -56.0], [96.4, -51.8], [94.8, -48.0], [92.4, -45.4]];
  const bauch = [[79.4, -42.4], [76, -41.4], [68, -40.8], [58, -41.2], [49, -42.6], [42, -44.6], [36.6, -46.8]];
  const keule = [[12.6, -49], [10.8, -54.5], [9.8, -59.8], [10.4, -64.2], [11.4, -67.4], [13, -70.6]];
  const rumpf = ruecken.concat(kopf).concat(kehle).concat(vorne).concat(bauch).concat(hinten).concat(keule);
  const A = H.flaeche(rumpf);
  /* ---- Lauscher: breit-oval (1,8 : 1), stumpfe Spitze, eingeschnürter Ansatz mit Tütenfalte; Farbe wie der Kopf ---- */
  const ohr = [[-1.5, 1.6], [-1.6, -1.6], [-2.3, -4.6], [-2.5, -7.8], [-2.0, -10.6], [-1.0, -12.4], [0.3, -13.0], [1.4, -12.2], [2.1, -10.2], [2.4, -7.2], [2.1, -4.0], [1.6, -1.0], [1.8, 1.8]];
  const ohrZ = (ox, oy, w, fern) => {
    const tr = (pts) => H.tr(pts, ox, oy, w);
    const P = tr(ohr), B = H.flaeche(P);
    let inn = H.wf(tr([[0.5, -1.0], [1.7, -3.6], [2.0, -7.0], [1.7, -10.0], [1.0, -11.8], [0.8, -8.4], [0.6, -4.2]]), fern ? "#2e2018" : "#3a2a20", 0.9, 0.5) +
      fl(...tr([[-1.0, -6.0]])[0].slice(0, 2), 2.2, 4.4, w, HL, fern ? 0.08 : 0.22);
    if (!fern) {
      /* Tütenfalte am Ansatz, helle Innenhaare nur im unteren Drittel, nach außen gekämmt */
      inn += wl([tr([[1.4, -0.4], [0.4, -2.2], [0.6, -4.4]])], "#140a06", 0.5, 0.6, 0.12) +
        H.haare(tr([[0.6, -0.6], [2.2, -1.8], [2.7, -4.6], [1.6, -4.8], [0.8, -3.0]]), 40, w - 40, 1.4, [["#f4eee4", 1, 0.035, 0.75], ["#cfc4b4", 0.5, 0.03, 0.55]], { streu: 22, krumm: 0.25, szene: 0 }) +
        H.haare(P, 40, w - 92, 0.55, [["#2a1c14", 1, 0.035, 0.45], ["#c0aa96", 0.7, 0.03, 0.4]], { szene: 0 });
    }
    inn += H.rim(B, 1.4, 0.9);
    /* Rand: 2-px-Saum aus dunklen Haaren statt Kontur */
    const saum = fern ? "" : H.saum(tr([[-2.4, -6.0], [-2.0, -10.6], [-1.0, -12.4], [0.3, -13.0], [1.4, -12.2], [2.1, -10.2], [2.4, -7.2]]), 46, (x, y) => w - 90 + (T.rnd() - 0.5) * 60, 0.35,
      [["#140a06", 1, 0.05, 0.7], ["#5a4434", 0.5, 0.04, 0.6]], { offen: true, streu: 40, szene: 0 });
    return H.teil(B, fern ? "#5a4636" : "#7a6352", inn, { rand: false }) + saum;
  };
  /* ---- Gehörn (Sechser): Stangen leicht nach hinten, oben S-förmig nach vorn; Vordersprosse bei 52 %, Hintersprosse bei 72 %;
     dunkles Schokoladenbraun, Längsrinnen mit hellem Grat, Perlung unten und an den Sprossenansätzen, nur die Enden elfenbeinhell ---- */
  const gehoern = (bx, by, s0, fern) => {
    const sw = F ? 1 : 1.6;     // klein in der Szene dicker, damit der Bock als Bock lesbar bleibt
    const P = (pts) => H.tr(pts.map((p) => [p[0], p[1], (p[2] || 0) * sw, (p[3] || 0) * sw]), bx, by, -4, s0);
    const stange = H.kette(P([[0, -0.9, 1.25, 1.25], [-0.6, -4, 1.12, 1.12], [-1.5, -8, 0.98, 0.98], [-2.3, -11.4, 0.84, 0.84], [-2.6, -14.6, 0.68, 0.68], [-2.0, -17.6, 0.5, 0.5], [-0.8, -20.0, 0.15, 0.15]]));
    const vorn = H.kette(P([[-2.2, -9.6, 0.9, 0.8], [-0.8, -10.6, 0.72, 0.64], [0.8, -11.8, 0.52, 0.48], [2.2, -13.8, 0.14, 0.14]]));
    const hint = H.kette(P([[-2.4, -13.8, 0.74, 0.7], [-3.6, -14.6, 0.56, 0.52], [-4.6, -15.8, 0.36, 0.34], [-5.2, -17.4, 0.12, 0.12]]));
    /* Zylinder: Licht links, Kernschatten rechts, schmaler Reflex außen */
    const braun = fern ? T.lg("ghf", [[0, "#4a3626"], [0.5, "#32241a"], [0.85, "#22180f"], [1, "#2e2218"]], 0, 0, 1, 0) :
      T.lg("gh", [[0, "#6e5038"], [0.25, "#563c26"], [0.6, "#34210f"], [0.85, "#1e1208"], [1, "#3a2818"]], 0, 0, 1, 0);
    const elfen = (t, r) => fern ? "" : fl(t[0], t[1], r * 1.2, r * 1.2, 0, "#e8dcc4", 0.95) + fl(t[0], t[1], r * 0.5, r * 0.5, 0, "#fffaf0", 0.7);
    const rinnen = (k, n) => !F || fern ? "" : H.L([0.32, 0.62].map((q) => k.L.slice(0, n).map((p, i) => [p[0] * (1 - q) + k.R[i][0] * q, p[1] * (1 - q) + k.R[i][1] * q])), "#0e0602", 0.08, 0.35) +
      H.L([0.4, 0.7].map((q) => k.L.slice(0, n).map((p, i) => [p[0] * (1 - q) + k.R[i][0] * q, p[1] * (1 - q) + k.R[i][1] * q])), "#a08060", 0.05, 0.3);
    const perlen = (k, bis, n, r0) => {
      if (!F || fern) return "";
      const dd = [], dh = [];
      for (let i = 0; i < n; i++) {
        const t = T.rnd() * bis, j = Math.floor(t), u = t - j, q = T.rnd() < 0.6 ? (T.rnd() < 0.5 ? 0.03 : 0.97) : 0.15 + T.rnd() * 0.7;
        const a = [k.L[j][0] + (k.L[j + 1][0] - k.L[j][0]) * u, k.L[j][1] + (k.L[j + 1][1] - k.L[j][1]) * u];
        const b = [k.R[j][0] + (k.R[j + 1][0] - k.R[j][0]) * u, k.R[j][1] + (k.R[j + 1][1] - k.R[j][1]) * u];
        const x = a[0] + (b[0] - a[0]) * q, y = a[1] + (b[1] - a[1]) * q, rr = r0 * (0.5 + T.rnd() * 0.8);
        dd.push([x + rr * 0.3, y + rr * 0.3, rr]); dh.push([x - rr * 0.28, y - rr * 0.32, rr * 0.5]);
      }
      return H.punkte(dd, "#160c04", 0.75) + H.punkte(dh, "#8a6a4c", 0.5);
    };
    const SV = H.flaeche(vorn.pts), SH = H.flaeche(hint.pts), SS = H.flaeche(stange.pts);
    let g = H.teil(SV, braun, elfen(P([[2.2, -13.8]])[0], 0.8) + perlen(vorn, 0.8, 6, 0.16) + H.rim(SV, 0.5, 0.9), { rw: 0.05, randA: 0.6 }) +
      H.teil(SH, braun, elfen(P([[-5.2, -17.2]])[0], 0.7) + H.rim(SH, 0.45, 0.9), { rw: 0.05, randA: 0.6 });
    g += H.teil(SS, braun, elfen(P([[-0.8, -20]])[0], 1.0) + rinnen(stange, 6) + perlen(stange, 1.6, 20, 0.16) + H.rim(SS, 0.9, 0.9), { rw: 0.05, randA: 0.6 });
    /* Rose: geschlossener, knotiger Ring (1,35 × Stangendurchmesser) auf dem kurzen, behaarten Rosenstock */
    if (F) {
      const [rx, ry] = P([[0, -0.4]])[0], rose = [];
      for (let i = 0; i < 24; i++) { const a = Math.PI * 2 * i / 24, q = 1 + (i % 2 ? 0.1 : -0.05) + (T.rnd() - 0.5) * 0.1; rose.push([rx + Math.cos(a) * 1.7 * s0 * q, ry + Math.sin(a) * 0.62 * s0 * q]); }
      const RO = H.flaeche(rose), kn = [];
      for (let i = 0; i < 9; i++) { const a = Math.PI * (1.05 + 0.9 * i / 8); kn.push([rx + Math.cos(a) * 1.5 * s0, ry + Math.sin(a) * 0.5 * s0, 0.2]); }
      g += H.teil(RO, fern ? "#24170e" : "#2a190c", fern ? "" : H.punkte(kn, "#5a4030", 0.7) + fl(rx, ry + 0.3, 1.6, 0.4, 0, "#000", 0.5), { rw: 0.05, randA: 0.7 });
    }
    return g;
  };
  const ohrBasis = K(-0.6, -1.4), gehBasis = K(4.6, -3.4);
  let s = "";
  /* ---- ferne Läufe: im Körperton, 15–20 % dunkler und kühler; ferner Hinterlauf oberhalb des Sprunggelenks hinter der Keule ---- */
  const fell = T.lg("fell", [[0, "#5e4434"], [0.19, "#7a4630"], [0.33, "#8e4e2a"], [0.47, "#9a5630"], [0.57, "#94603e"], [0.63, "#86624c"], [0.75, "#72543f"], [0.9, "#584232"], [1, "#382a20"]], 0, -112, 0, 0, H.US);
  const fernV = H.schieb(vorne, -6.5), fernH = hinten.map((p) => [p[0] + (p[1] > -27 ? 4.2 : p[1] < -36 ? 0.4 : 0.4 + (p[1] + 36) / 9 * 3.8), p[1], p[2]]);
  const laufDet = (dx, hint) => hint
    ? H.after(19.2 + dx, -6.4, 0.8) + wl([[[19.6 + dx, -24], [19.8 + dx, -12], [19.6 + dx, -9]]], "#e8c8a8", 0.3, 0.3, 0.12) + fl(17.6 + dx, -29.6, 1.3, 2.2, 0, HL, 0.25) + fl(21.2 + dx, -8.6, 2.2, 1.8, 0, DK, 0.35)
    : H.after(84.0 + dx, -6.2, 0.8) + wl([[[84.8 + dx, -21], [85.0 + dx, -12], [84.8 + dx, -9]]], "#e8c8a8", 0.3, 0.3, 0.12) + fl(87.4 + dx, -24.4, 1.1, 2, 0, HL, 0.25) + fl(86 + dx, -8.4, 2.2, 1.8, 0, DK, 0.35);
  const fernBein = (P, top, det) => {
    const Q = top.concat(P), B = H.flaeche(Q);
    fernDet += B.clip(det); det = "";
    return (H.teil(B, fell, `<rect x="${P[0][0] - 12}" y="-60" width="24" height="60" fill="${T.lg("fernl", [[0, "#1a100a", 0.75], [0.35, "#3a302c", 0.55], [1, "#3a302c", 0.5]], 0, -60, 0, 0, H.US)}"/>` +
      B.use(`fill="${T.lg("zyl", [[0, "#fff", 0.16], [0.3, "#fff", 0], [0.65, "#000", 0.14], [0.88, "#000", 0.3], [1, "#fff", 0.06]], 0, 0, 1, 0)}"`) + H.haare(Q, 22, 92, 0.5, [["#2a1a10", 1, 0.035, 0.35]], { streu: 10, spitze: ["#b89c80", 0.5, 0.03, 0.35] }) + det, { rand: false }));
  };
  let fernDet = "";
  s += H.vol("bein", 1.0, fernBein(fernH, [[17, -52], [30, -52]], laufDet(4.2, true)) + fernBein(fernV, [[77, -50], [88, -50]], laufDet(-6.5, false)), { tiefe: 3 }) + fernDet;
  s += H.schale(25.6, 30.8, 2.9, { farbe: "#241c18", fern: "#120e0c" }) + H.schale(79.9, 85.3, 3.0, { farbe: "#241c18", fern: "#120e0c" });
  /* fernes Gehörn (zu 30–40 % verdeckt, 1,4 cm nach hinten) und fernes Ohr hinter dem Kopf */
  s += ohrZ(ohrBasis[0] + 1.6, ohrBasis[1] - 0.6, -40, true) + gehoern(gehBasis[0] - 1.5, gehBasis[1] + 0.4, 0.97, true);
  /* ---- Körper: EIN Umriss, Volumen aus der Silhouette (T.volumen), darin Farbzonen, Anatomie, Haar ---- */
  const wuchs = (x, y) => {
    if (y > -40 || (x > 82 && x < 90 && y > -46) || (x < 34 && x > 14 && y > -43)) return 92;   // Läufe abwärts
    if (x > 101 && y < -74) return 216;                                                     // Gesicht: zur Stirn
    if (x > 77) return 116 + Math.max(0, (x - 92)) * 1.4;                                    // Träger: nach hinten-unten
    if (x < 22) return 104;                                                                   // Keule abwärts
    if (x > 32 && x < 42 && y > -64) return 150 + (y + 64) * 2.4;                            // Wirbel an der Flanke vor der Keule
    return 176 - Math.min(1, Math.max(0, (y + 68) / 28)) * 66;                               // Rumpf nach hinten, Flanke abwärts
  };
  const laenge = (x, y) => (y > -40 ? 0.55 : x > 101 && y < -74 ? 0.5 : x > 77 ? 1.1 : 1.0);
  const licht = (x, y) => (y < -62 ? 0.75 : y < -50 ? 0.45 : 0.15);       // helle Spitzen im Licht häufiger als im Schatten
  let inn = "", sch = "";
  /* Farbzonen (ohne Filter, damit das Volumen-Licht schnell bleibt): Kopf graubraun, Stirnfleck, Wange, Bauch, Spiegel, Läufe */
  inn += H.zone("kopf", [[94, -72], [100, -98], [118, -96], [128, -80], [124, -66], [110, -66], [98, -66]], "#7a6656", 0.62, [95, -76], [106, -86]);
  inn += fl(...K(4.8, -1.8), 4.2, 2.0, KW, "#2e1c10", 0.75) + fl(...K(7.6, -1.6), 2.6, 1.3, KW, "#3a2618", 0.5) + fl(...K(8.4, 6.6), 4.4, 2.8, KW, "#8a5a3a", 0.3);
  inn += fl(60, -41.6, 24, 3.4, 0, "#d2b494", 0.7);
  inn += H.wf([[13.4, -70.4], [11.2, -67.2], [10.2, -63.6], [9.9, -59.6], [10.9, -54.4], [12.6, -49.6], [14.4, -51], [12.8, -56], [12.2, -60.6], [12.8, -65], [15, -69]], "#d8c49e", 0.75, 0.8);
  inn += `<rect x="10" y="-40" width="84" height="40" fill="${T.lg("lauf", [[0, "#6e5040", 0], [0.35, "#6e5040", 0.5], [1, "#5a4436", 0.6]], 0, -40, 0, 0, H.US)}"/>`;
  /* Äser: schwarzer Windfang (flach nach vorn-unten), schwarze Lippenkante, weiße Muffelflecken an der Oberlippe, weißes Kinn mit Haar */
  inn += T.form(KT([[17.8, 2.4], [18.8, 3.0], [19.5, 4.0], [19.7, 5.2], [19.3, 6.3], [18.6, 7.0], [17.9, 7.4], [17.3, 7.6], [17.4, 6.4], [17.9, 5.2], [17.9, 3.6]]), "#0e0908");
  /* weiße Muffelflecken: klar begrenzt an der Oberlippe direkt hinter dem Windfang; Kinn und Unterlippe weiß */
  inn += T.form(KT([[16.0, 4.8], [17.3, 4.4], [17.5, 5.6], [17.0, 6.9], [16.1, 7.0], [15.7, 5.9]]), "#e6dfd2") + T.form(KT([[11.6, 8.4], [16.0, 8.1], [16.9, 8.5], [15.8, 9.5], [12, 10.0]]), "#ebe6dd");
  if (F) inn += H.haare(KT([[11.6, 8.0], [16.4, 8.0], [15.6, 9.6], [11.6, 10.0]]), 50, KW + 170, 0.4, [["#b8b0a4", 1, 0.03, 0.6], ["#7a6656", 0.5, 0.03, 0.5]], { streu: 20, szene: 0 }) +
    H.haare(KT([[15.4, 4.6], [17.2, 4.2], [16.8, 7.0], [15.6, 7.1]]), 30, KW + 190, 0.3, [["#a89e92", 1, 0.03, 0.5]], { streu: 20, szene: 0 }) +
    H.haare(KT([[17.9, 2.6], [19.2, 3.6], [19.5, 5.8], [18.6, 6.8], [17.6, 7.4]]), 18, 0, 0.08, [["#000", 1, 0.04, 0.5], ["#5a504a", 1, 0.035, 0.45]], { streu: 180, szene: 0 });
  inn += fl(...K(18.6, 3.2), 0.9, 0.3, KW + 30, "#fff", 0.6) + fl(...K(18.4, 3.0), 0.35, 0.14, KW + 30, "#fff", 0.9);
  /* Nasenloch: kommaförmiger Schlitz, nach hinten-oben auslaufend; Mundspalte */
  inn += L([KT([[19.35, 4.6], [18.9, 5.1], [18.6, 5.7], [18.5, 6.2]]), KT([[19.35, 4.6], [18.8, 4.2], [18.2, 3.8]])], "#000", 0.28, 0.95) + L([KT([[17.1, 7.85], [16.0, 8.25], [14.8, 8.3]])], "#000", 0.16, 0.55);
  /* Haar für Haar: dunkle Basis, helle Spitze (im Licht häufiger), Strich nach Anatomie; Kopf kurz und fein */
  /* feines Fellkorn (Rauschen in Wuchsrichtung, nicht periodisch) als dichte Grundstruktur, darüber einzelne Haare */
  inn += H.fellKorn("r1", [[6, -82], [86, -82], [92, -56], [92, -44], [80, -38], [30, -42], [6, -48]], 174, [["kd", "#2a1004", 0.2, 3], ["kh", "#ffe0b8", 0.1, 8]], { fx: 0.9, fy: 9 }) +
    H.fellKorn("r4", [[72, -82], [101, -94], [104, -86], [101, -76], [99, -56], [92, -44], [80, -52]], 118, [["kd", "#2a1004", 0.2, 3], ["kh", "#ffe0b8", 0.1, 8]], { fx: 0.9, fy: 9, ein: [76, -64, 86, -70] }) +
    H.fellKorn("r5", KT([[2.5, -4.6], [21, -4.6], [21, 11.5], [6.4, 11.5]]), KW + 184, [["kd", "#2a1a10", 0.35, 3], ["kh", "#f0e0cc", 0.25, 8]], { fx: 2.6, fy: 14 });
  inn += H.haare(rumpf, 172, wuchs, laenge, [["#3e1c0a", 1, 0.06, 0.34], ["#6e3414", 0.5, 0.065, 0.3]], { krumm: 0.06, streu: 10, nur: (x, y) => !(x > 100 && y < -76 && x > 96 + (y + 92) * -0.2) && y < -39, spitze: ["#f6c896", licht, 0.045, 0.45] });
  inn += H.haare(KT([[1, -3], [16, 0.6], [16.6, 7], [8, 9.6], [2, 9.4]]), 60, KW + 184, 0.42, [["#3a2a20", 1, 0.03, 0.3]], { streu: 12, spitze: ["#e8d4c0", 0.55, 0.028, 0.4], szene: 0 });
  /* Licht und Anatomie (über dem Volumen, weich): helle Rückenkante, Kernschatten-Band 3,5 cm über der Bauchlinie, Reflexlicht,
     Schulterblatt (Hinterkante dunkler), Buggelenk, Ellbogenwulst, Rippenbogen mit Querschatten, Flankenmulde, Hüfthöcker,
     Keule mit eigenem Glanz, Drosselrinne, Kniefalte, Kopfknochen, Schlagschatten des Kopfes */
  sch += wl([[[14, -74.6], [34, -75.6], [56, -71.6], [70, -71.2], [80, -75.6], [88, -81.6]]], "#4a2410", 3.4, 0.3, 1.6) + wl([[[20, -73.6], [34, -73.8], [50, -71.2], [66, -69.6], [77, -72.6]]], "#ffd8a8", 2.2, 0.22, 1.2) +
    wl([[[38, -49], [50, -46], [62, -44.6], [74, -45], [80, -46.6]]], DK, 3.2, 0.28, 1.6) + wl([[[46, -42.2], [58, -41.4], [70, -41.2], [77, -42.2]]], "#d8b08c", 0.8, 0.3, 0.4);
  sch += H.wf([[74, -72.6], [80, -74.4], [87, -66], [92, -57], [90, -53], [85, -56], [78, -63]], HL, 0.14, 4.5) +
    wl([[[74.4, -70], [76.2, -63], [79.4, -55.6], [82.6, -49]]], DK, 4, 0.16, 3) + wl([[[96.2, -61], [94.4, -56], [91, -50]]], DK, 2.4, 0.14, 2) +
    fl(80.4, -43.6, 2.6, 2.2, 0, HL, 0.14) + fl(79.6, -40.8, 2.4, 1.2, 0, DK, 0.24) +
    wl([[[56, -66], [59.4, -58], [60.6, -51]], [[64, -66], [66.4, -58], [67.4, -51.4]]], DK, 3, 0.06, 2) +
    wl([[[38, -66], [38.6, -58], [37.6, -50]]], DK, 6, 0.12, 4.5) + wl([[[13, -71], [22, -73], [29, -70.6], [32, -64]]], "#ffe0bc", 3, 0.16, 3) +
    wl([[[18.8, -70], [17.6, -60], [16.8, -51]]], "#6a3010", 1.4, 0.16, 0.9) + wl([[[99.6, -74], [97.8, -67], [96.6, -60]]], DK, 0.9, 0.24, 0.5) + wl([[[36.2, -47.4], [34, -52], [31.4, -57]]], DK, 1.0, 0.22, 0.6);
  sch += fl(...K(7.4, -2.0), 3.2, 1.0, KW, "#ffe6c8", 0.3) + fl(...K(5.0, 4.6), 4.2, 2.6, KW, HL, 0.2) +
    wl([KT([[3.8, 3.4], [5.8, 6.6], [6.4, 9.2], [4.8, 10.6]])], DK, 0.8, 0.35, 0.4) + wl([KT([[8, 10.4], [5.8, 11.2], [3.6, 10.8]])], DK, 1.2, 0.35, 0.6) +
    wl([KT([[10.6, -1.0], [14.0, 0.1], [17.2, 1.4]])], "#ffe6cc", 0.35, 0.45, 0.15) + fl(...K(12.2, 5.6), 3.8, 2.0, KW, DK, 0.18) + wl([KT([[8.6, 1.5], [10.6, 1.9]])], "#120a06", 0.3, 0.6, 0.1);
  sch += H.wf([K(6.2, 10.7), K(3.5, 11), [99.6, -72], [98.6, -68], [94.6, -72], [95, -80]], DK, 0.26, 2) + fl(...K(-0.4, -1.4), 2.4, 1.6, KW, DK, 0.35) + fl(...K(4.6, -3.0), 2.2, 1.0, KW, DK, 0.26);
  const koerper = H.teil(A, fell, inn, { rand: false }) +
    H.saum(ruecken.concat(kehle.slice(0, 6)), 50, wuchs, (x, y) => laenge(x, y) * 0.7, [["#6e3a1a", 1, 0.04, 0.5], ["#d8a070", 0.5, 0.035, 0.4]], { offen: true, szene: 0 }) +
    H.saum(bauch.concat(keule), 36, wuchs, (x, y) => laenge(x, y) * 0.7, [["#5a3a28", 1, 0.04, 0.5], ["#c8a07a", 0.5, 0.035, 0.4]], { offen: true, szene: 0 }) +
    /* Pinsel des Bocks: kleines dunkles Haarbüschel unter dem Bauch */
    H.saum([[50.6, -42.2], [51.4, -42.0]], F ? 16 : 3, 96, 1.4, [["#2a1a10", 1, 0.06, 0.8]], { offen: true, streu: 26, krumm: 0.25, szene: 0.5 });
  s += H.vol("rumpf", 6, koerper, { tiefe: 2.6, umgebung: 0.46 }) + A.clip(sch);
  /* ---- nahe Läufe als eigene Zylinder (Volumen), oben weich in den Rumpf übergehend: Gelenke, Sehnen, Laufbürste ---- */
  /* Volumen nur auf Fläche + Haar; Sehnen/Gelenke (mit Weichzeichner) danach geklippt darüber – keine verschachtelten Filter */
  const laufN = (pts) => {
    const B = H.flaeche(pts);
    return [B, H.teil(B, fell, `<rect x="10" y="-40" width="84" height="40" fill="${T.lg("lauf")}"/>` +
      B.use(`fill="${T.lg("zyl")}"`) +
      H.haare(pts, 36, 92, 0.6, [["#2a1a10", 1, 0.04, 0.34]], { streu: 10, spitze: ["#d8bc9c", 0.6, 0.035, 0.4] }), { rand: false })];
  };
  const vDet = wl([[[88.0, -36], [87.8, -28], [87.6, -22], [87.0, -12]]], "#ffe6c8", 0.5, 0.3, 0.25) + wl([[[84.9, -21], [85.1, -12], [84.9, -9]]], "#f0d0b0", 0.3, 0.32, 0.1) +
    wl([[[85.8, -21], [86.0, -11]]], DK, 0.4, 0.35, 0.12) + fl(87.6, -24.2, 1.0, 1.8, 0, HL, 0.3) + fl(83.8, -24.4, 0.8, 1.4, 0, DK, 0.4) +
    fl(86.0, -8.2, 2.2, 1.6, 0, DK, 0.4) + fl(86.9, -9.4, 0.8, 1.2, 0, "#fff", 0.22);
  const hDet = wl([[[31, -42], [27.8, -36.6], [24.6, -31], [22.8, -24], [22.4, -12]]], "#ffe6c8", 0.5, 0.3, 0.25) + wl([[[19.8, -24], [20.0, -12], [19.8, -9]]], "#f0d0b0", 0.3, 0.32, 0.1) +
    wl([[[20.7, -24], [20.9, -11]]], DK, 0.4, 0.35, 0.12) + wl([[[17.1, -40], [17.4, -34], [17.0, -31]]], "#ffe6c8", 0.4, 0.4, 0.15) +
    fl(17.6, -29.8, 1.2, 1.8, 0, HL, 0.3) + fl(22.0, -27.6, 1.0, 2.4, 0, DK, 0.32) + fl(21.0, -8.4, 2.2, 1.6, 0, DK, 0.4) + fl(21.8, -9.6, 0.8, 1.2, 0, "#fff", 0.22) +
    /* Laufbürste: abstehendes, helles Haarbüschel außen unter dem Sprunggelenk */
    fl(19.4, -22.6, 1.1, 2.2, 0, "#e4d2b0", 0.85) + fl(19.4, -22.4, 0.5, 1.1, 0, "#5a4030", 0.5);
  const [BV, lv] = laufN([[78, -48], [91, -48]].concat(vorne)), [BH, lh] = laufN([[12, -50], [36, -50]].concat(hinten));
  s += `<g mask="${H.maskeY("b", -45, -38)}">` + H.vol("bein", 1.0, lv + lh, { tiefe: 3 }) + BV.clip(vDet) + BH.clip(hDet) + `</g>`;
  if (F) s += H.saum([[19.3, -24.4], [19.2, -22.6], [19.3, -20.8]], 18, 120, 0.9, [["#e8d8bc", 1, 0.04, 0.7], ["#7a6048", 0.5, 0.04, 0.6]], { offen: true, streu: 30, szene: 0 });
  /* ---- Schalen und Geäfter (nah) ---- */
  s += H.schale(86.4, 91.8, 3.1, { haar: "#4a3a2e" }) + H.schale(21.4, 26.6, 3.0, { haar: "#4a3a2e" }) + H.after(83.6, -6.0, 0.9) + H.after(19.0, -6.2, 0.9);
  /* ---- nahes Gehörn (wirft feinen Schatten auf den Lauscher), nahes Ohr, Stirnhaar bis an die Rose ---- */
  s += ohrZ(ohrBasis[0], ohrBasis[1], -22, false);
  if (F) s += `<path d="${H.G([[gehBasis[0] - 1, gehBasis[1] - 1], [gehBasis[0] - 3.4, gehBasis[1] - 12], [gehBasis[0] - 5, gehBasis[1] - 11], [gehBasis[0] - 2.6, gehBasis[1] + 0.4]])}" fill="#000" opacity=".22" filter="${H.blur(0.45)}"/>`;
  s += gehoern(gehBasis[0], gehBasis[1], 1, false);
  s += H.haare([[gehBasis[0] - 2.2, gehBasis[1] + 1.4], [gehBasis[0] + 2.4, gehBasis[1] + 1.6], [gehBasis[0] + 1.6, gehBasis[1] - 0.1], [gehBasis[0] - 1.6, gehBasis[1] - 0.1]], 34, 252, 0.8,
    [["#3a2618", 1, 0.05, 0.75], ["#8a6a50", 0.5, 0.04, 0.6]], { szene: 0, streu: 40 });
  /* Auge: groß, tiefbraun, querovale Pupille kaum sichtbar, Augenhöhle mit Schatten vom Augenbogen, 8 Wimpern am Oberlid */
  const au = K(6.6, 1.0);
  s += H.auge(au[0], au[1], 1.38, { iris: "#24140a", iris2: "#4a2a14", offen: 0.78, winkel: KW - 14, wimpern: 8, wimpernLaenge: 0.55, braue: "#e8c8a0", hoehle: "#1e1008" });
  /* Tasthaare an Oberlippe und Kinn */
  if (F) s += T.schnurrhaare(...K(16.4, 7.2), 6, 2.0, KW + 25, 50, "#1a120c", 0.035) + T.schnurrhaare(...K(14.0, 9.0), 4, 1.5, KW + 80, 40, "#e8e0d0", 0.03);
  return { svg: s, box: [9.8, -111, 118.8, 0], fuesse: [24, 30, 83, 89], kopf: [96, -114, 122, -64] };
}

/* =====================================================================
   ROTHIRSCH (Zwölfender in der Brunft)
   ===================================================================== */
/* RECHERCHE Rothirsch (Cervus elaphus):
   Hirsch: Schulterhöhe 120–150 cm, Kopf-Rumpf 165–250 cm, 160–250 kg; Widerrist etwas höher als die Kruppe, tiefe Brust,
   langer Kopf (~45–50 cm), Lauscher spitz-oval (~20 cm). Sommerfell kurz rotbraun, Winterfell graubraun; Bauch und Läufe
   dunkler. Spiegel groß, gelblich-cremefarben bis über den Wedel (Schwanz 12–15 cm, oben dunkler).
   In der Brunft (Sept./Okt.) lange dunkelbraune Brunftmähne an Hals und Kehle, Hals dick. Große Voraugendrüse (Tränengrube)
   als dunkler Schlitz vor dem Auge; Windfang (Nasenspiegel) dunkelgrau-schwarz, Äser mit hellem Kinn.
   Geweih (Stangen bis ~1 m, je bis 5–8 kg): von unten Rose, Augsprosse (nach vorn), Eissprosse (dicht darüber, nach vorn),
   Mittelsprosse (in halber Höhe, nach vorn), oben die Krone (hier 3 Enden je Stange → Zwölfender: 6 Enden je Stange).
   Stange schwingt nach hinten oben, die Krone wieder nach vorn; unten geperlt, dunkelbraun, Enden elfenbeinweiß gefegt.
   Paarhufer: Schalen ~8 cm, Afterklauen hinten am Fesselgelenk. */
function hirsch(T) {
  const H = kit(T, [-10, -280, 250, 6], 1, 5), { fl, wl, L, F, f } = H, G2 = H.G;
  H.minFl = 8;
  const DK = "#1e0e06", HL = "#ffd2a0";
  /* ---- Kopf: lokales System (Genick = 0, Nase bei x ≈ 48), um 46° geneigt, Kopfhaltung abgesenkt (Träger ≈ 40°) ---- */
  const KX = 171, KY = -162, KW = 46, KS = 1.06;
  const K = H.pt(KX, KY, KW, KS), KT = (pts) => H.tr(pts, KX, KY, KW, KS);
  const kopf = KT([[-1, -3.4], [4, -6.0], [10, -7.4], [16, -7.2], [21, -5.8], [27, -3.4], [34, -1.2], [40, 0.6], [44, 2.0], [47, 4.0], [48.4, 6.8], [48.0, 9.6],
    [46.6, 11.4], [44.8, 12.4], [43.0, 13.0], [42.0, 14.2], [39.8, 15.4], [35, 16.2], [28, 17.2], [20, 19.6], [14, 21.4]]);
  /* ---- Läufe (Rothirsch: kräftiger als das Reh; Vorderfußwurzel bei ≈ 30 %, Sprunggelenk bei ≈ 40 % der Schulterhöhe) ---- */
  const vorne = [[153.4, -70], [152.6, -60], [151.8, -50], [152.4, -42.6], [151.4, -37], [150.8, -28], [150.8, -18], [151.8, -12], [154.2, -7.6], [156.2, -4.6],
    [156.0, -2.2], [152.2, -1.8], [150.0, -3.6], [148.2, -7.4], [146.8, -12], [147.4, -18], [147.4, -28], [147.0, -34], [145.6, -39.4], [146.4, -44.6], [145.4, -54], [143.4, -62], [140.4, -66.4]];
  const hinten = [[63, -80], [60.6, -72], [56.4, -63.6], [51.8, -56], [49.0, -50], [48.2, -44], [48.0, -30], [48.0, -18], [48.8, -12], [51.2, -7.6], [53.2, -4.6],
    [53.0, -2.2], [49.2, -1.8], [47.0, -3.6], [45.2, -7.4], [43.8, -12], [44.2, -18], [44.4, -30], [44.4, -42], [43.4, -47.6], [40.6, -51.4, 1], [41.4, -55.6], [41.2, -62], [39.6, -70], [36.2, -80], [31.2, -90]];
  const ruecken = [[24.4, -116], [32, -120.4], [44, -121.6], [60, -120.4], [78, -119.4], [96, -120.4], [110, -123.4], [120, -127.0], [128, -128.8], [135, -130.4], [142, -134.6],
    [149, -140.6], [156, -147.8], [163, -154.4], [168.4, -159.4]];
  const kehle = [[166.6, -142.0], [167.4, -132], [167.0, -120], [166.0, -108], [165.6, -96], [165.4, -86], [162.6, -77.6], [158.0, -72.0], [154.4, -70.4]];
  const bauch = [[140.4, -66.4], [134, -64.2], [120, -63.0], [104, -63.6], [88, -65.8], [75, -69.4], [67, -74.4]];
  const keule = [[26.6, -97], [23.6, -104], [22.8, -110]];
  const rumpf = ruecken.concat(kopf).concat(kehle).concat(vorne).concat(bauch).concat(hinten).concat(keule);
  const A = H.flaeche(rumpf);
  const wuchs = (x, y) => {
    if (y > -66 || (x > 144 && x < 156 && y > -72) || (x < 64 && x > 38 && y > -82)) return 92;
    if (x > 166 && y < -140) return 220;
    if (x > 128) return 108 + Math.max(0, x - 150) * 0.5;
    if (x < 36) return 102;
    if (x > 54 && x < 66 && y > -100) return 150 + (y + 100) * 1.6;
    return 178 - Math.min(1, Math.max(0, (y + 112) / 44)) * 70;
  };
  const laenge = (x, y) => (y > -66 ? 0.9 : x > 166 && y < -140 ? 0.8 : x > 132 ? 3.0 : 1.7);
  const licht = (x, y) => (y < -108 ? 0.75 : y < -90 ? 0.45 : 0.15);
  /* ---- Lauscher: länglich mit stumpfer Spitze (≈ 52 % der Kopflänge), eingeschnürte Basis, Farbe wie der Kopf ---- */
  const ohr = [[-2.2, 0], [-3.8, -2.6], [-5.0, -7.0], [-5.2, -12.0], [-4.2, -17.0], [-2.2, -21.4], [0.4, -23.4], [2.6, -21.6], [4.0, -17.0], [4.4, -11.4], [3.8, -6.0], [2.6, -2.2], [1.8, 0]];
  const ohrZ = (ox, oy, w, fern) => {
    const tr = (pts) => H.tr(pts, ox, oy, w);
    const P = tr(ohr), B = H.flaeche(P);
    let inn = H.wf(tr([[1.0, -1.8], [3.4, -6.0], [3.9, -11.4], [3.4, -16.8], [1.8, -21.0], [1.2, -15.6], [1.0, -8.0]]), fern ? "#2e2018" : "#3a2a20", 0.9, 0.8) +
      fl(...tr([[-1.6, -11]])[0].slice(0, 2), 3.2, 8, w, HL, fern ? 0.06 : 0.18);
    if (!fern) inn += H.haare(tr([[1.0, -1.0], [3.6, -3.6], [4.2, -8.6], [2.6, -9.0], [1.2, -5.0]]), 30, w - 40, 2.6, [["#f2ece2", 1, 0.06, 0.7], ["#c8bcaa", 0.5, 0.05, 0.5]], { streu: 22, krumm: 0.25, szene: 0 }) +
      H.haare(P, 20, w - 92, 1.0, [["#2a1c14", 1, 0.06, 0.45], ["#c0aa96", 0.7, 0.05, 0.4]], { szene: 0 });
    inn += H.rim(B, 2.4, 0.9) + H.L([tr([[-5.1, -12], [-4.2, -17.0], [-2.2, -21.4], [0.4, -23.4], [2.6, -21.6], [4.0, -17.0]])], "#140a06", 0.5, fern ? 0.45 : 0.7);
    return H.teil(B, fern ? "#4a3a2e" : "#6e5848", inn, { rand: false });
  };
  /* ---- Geweih (Kronenzwölfer): je Stange Aug-, Eis-, Mittelsprosse und dreiendige Krone. Stange von der Rose nach hinten-oben,
     ab der Mittelsprosse aufwärts und leicht nach vorn; Durchmesser an der Rose ≈ 12 % der Kopflänge, oben 60 %.
     Dunkelbraun mit Längsrinnen, Perlung unten und an den Sprossenansätzen, Enden elfenbeinhell poliert. ---- */
  const geweih = (bx, by, s0, w0, fern) => {
    const P = (pts) => H.tr(pts, bx, by, w0, s0);
    const braun = fern ? "#33261c" : T.lg("gw", [[0, "#24160c"], [0.45, "#3e2a1a"], [0.8, "#56402c"], [1, "#6a5038"]], 0, 0, 1, 1);
    const rinnen = (k, n) => !F || fern ? "" : H.L([0.36, 0.7].map((q) => k.L.slice(0, n).map((p, i) => [p[0] * (1 - q) + k.R[i][0] * q, p[1] * (1 - q) + k.R[i][1] * q])), "#0c0602", 0.22, 0.45) ;
    const perlen = (k, bis, n, r0) => {
      if (!F || fern) return "";
      const dd = [], dh = [];
      for (let i = 0; i < n; i++) {
        const t = Math.pow(T.rnd(), 1.6) * bis, j = Math.floor(t), u = t - j, q = T.rnd() < 0.3 ? (T.rnd() < 0.5 ? 0.04 : 0.96) : 0.08 + T.rnd() * 0.84;
        const a = [k.L[j][0] + (k.L[j + 1][0] - k.L[j][0]) * u, k.L[j][1] + (k.L[j + 1][1] - k.L[j][1]) * u];
        const b = [k.R[j][0] + (k.R[j + 1][0] - k.R[j][0]) * u, k.R[j][1] + (k.R[j + 1][1] - k.R[j][1]) * u];
        const x = a[0] + (b[0] - a[0]) * q, y = a[1] + (b[1] - a[1]) * q, rr = r0 * (0.5 + T.rnd() * 0.8);
        dd.push([x + rr * 0.3, y + rr * 0.3, rr]); dh.push([x - rr * 0.28, y - rr * 0.32, rr * 0.5]);
      }
      return H.punkte(dd, "#0c0602", 0.45) + H.punkte(dh, "#a88866", 0.3);
    };
    const ende = (t, r) => fern ? fl(t[0], t[1], r * 0.9, r * 0.9, 0, "#8a7a64", 0.7) : fl(t[0], t[1], r * 1.2, r * 1.2, 0, "#e6d8bc", 0.95) + fl(t[0], t[1], r * 0.5, r * 0.5, 0, "#fffaf0", 0.75);
    const ast = (J, spitze, rr) => {
      if (fern && !F) return "";
      const k = H.kette(P(J)), B = H.flaeche(k.pts), t = P([spitze])[0];
      return H.teil(B, braun, ende(t, rr * s0) + (F && !fern ? H.L([k.L.slice(0, -1).map((p, i) => [p[0] * 0.55 + k.R[i][0] * 0.45, p[1] * 0.55 + k.R[i][1] * 0.45])], "#0c0602", 0.2, 0.4) : "") + (fern ? "" : H.rim(B, 1.2, 0.9)), { rw: 0.1, randA: 0.6 });
    };
    let g = "";
    /* Sprossen zuerst – die Stange deckt ihre Ansätze (fern in der Szene nur die Stange) */
    const ast0 = ast;
    g += ast([[0.5, -3.0, 1.9, 1.8], [8, -4.6, 1.5, 1.4], [16, -6.4, 1.1, 1.05], [22.4, -9.6, 0.62, 0.6], [25.4, -13.6, 0.15, 0.15]], [24.8, -12.4], 3.4);     // Augsprosse
    g += ast([[-1.6, -8.4, 1.7, 1.6], [5.6, -10.6, 1.25, 1.2], [12.6, -13.0, 0.9, 0.9], [17.4, -16.6, 0.5, 0.5], [19.4, -19.8, 0.12, 0.12]], [19.0, -18.8], 2.8); // Eissprosse
    g += ast([[-19.4, -42, 1.5, 1.45], [-13.6, -47, 1.15, 1.1], [-8.8, -52.4, 0.75, 0.75], [-6.4, -57.4, 0.15, 0.15]], [-6.6, -56.4], 2.8);                   // Mittelsprosse
    g += ast([[-19.6, -66, 1.2, 1.2], [-15.6, -70.4, 0.85, 0.85], [-12.6, -75, 0.45, 0.45], [-11.4, -78.6, 0.12, 0.12]], [-11.6, -77.6], 2.4);                // Krone vorn
    g += ast([[-20.6, -66.6, 1.2, 1.2], [-24.4, -71, 0.85, 0.85], [-27.2, -76.2, 0.45, 0.45], [-28.2, -80.2, 0.12, 0.12]], [-28, -79.2], 2.4);                // Krone hinten
    /* Stange */
    const st = H.kette(P([[0, -1, 2.9, 2.9], [-3.4, -9, 2.65, 2.65], [-9, -20, 2.4, 2.4], [-14.6, -31, 2.2, 2.2], [-18.8, -42, 2.0, 2.0], [-21.0, -53, 1.85, 1.85], [-21.2, -63, 1.7, 1.7],
      [-20.0, -71, 1.25, 1.25], [-19.2, -78, 0.7, 0.7], [-18.6, -84, 0.15, 0.15]]));
    const SB = H.flaeche(st.pts), tip = P([[-18.7, -82.8]])[0];
    g += H.teil(SB, braun, ende(tip, 2.6 * s0) + (F && !fern ? H.tex("gwk", { fx: 0.25, fy: 2.6, farbe: "#0c0602", staerke: 2.6, schwelle: 0.52, okt: 2 }, w0 - 104, T.box(st.pts), 0.55) +
      H.tex("gwl", { fx: 0.3, fy: 3.2, farbe: "#b09070", staerke: 2.6, schwelle: 0.6, okt: 2, seed: 9 }, w0 - 104, T.box(st.pts), 0.3) : "") + perlen(st, 2.2, 18, 0.32) + H.rim(SB, 2.4, 0.9), { rw: 0.12, randA: 0.6 });
    /* Rose: knotiger Ring 1,3 × Stangendurchmesser auf kurzem behaartem Rosenstock */
    if (F) {
      const [rx, ry] = P([[0, -0.6]])[0], rose = [];
      for (let i = 0; i < 22; i++) { const a = Math.PI * 2 * i / 22, q = 1 + (i % 2 ? 0.1 : -0.05) + (T.rnd() - 0.5) * 0.1; rose.push([rx + Math.cos(a) * 3.8 * s0 * q, ry + Math.sin(a) * 1.4 * s0 * q]); }
      const kn = [];
      for (let i = 0; i < 9; i++) { const a = Math.PI * (1.05 + 0.9 * i / 8); kn.push([rx + Math.cos(a) * 3.4 * s0, ry + Math.sin(a) * 1.1 * s0, 0.45]); }
      g += H.teil(H.flaeche(rose), fern ? "#22170e" : "#2e1d0e", fern ? "" : H.punkte(kn, "#a08260", 0.6) + fl(rx, ry + 0.6, 3.6, 0.8, 0, "#000", 0.5), { rw: 0.1, randA: 0.7 });
    }
    return g;
  };
  const ohrBasis = K(1.0, -4.0), gehBasis = K(9.0, -7.2);
  let s = "";
  /* ---- ferne Läufe (Körperton, 15–20 % dunkler, kühler); ferner Hinterlauf oberhalb des Sprunggelenks hinter der Keule ---- */
  const fell = T.lg("fell", [[0, "#5e4434"], [0.2, "#704028"], [0.36, "#844a26"], [0.48, "#8c522c"], [0.58, "#7e5034"], [0.68, "#6a4a36"], [0.8, "#55402f"], [1, "#382a20"]], 0, -170, 0, 0, H.US);
  const fernV = H.schieb(vorne, -9), fernH = hinten.map((p) => [p[0] + (p[1] > -44 ? 8 : p[1] < -60 ? 1 : 1 + (p[1] + 60) / 16 * 7), p[1], p[2]]);
  const laufDet = (dx, hint) => hint
    ? H.after(44.6 + dx, -10.6, 1.5) + wl([[[44.8 + dx, -42], [45.2 + dx, -24], [45.0 + dx, -16]]], "#e8c8a8", 0.5, 0.26, 0.25) + fl(41.4 + dx, -52, 2.2, 3.4, 0, HL, 0.22) + fl(47 + dx, -12.4, 3.6, 3, 0, DK, 0.35)
    : H.after(147.6 + dx, -10.4, 1.5) + wl([[[147.8 + dx, -34], [148.0 + dx, -22], [147.8 + dx, -16]]], "#e8c8a8", 0.5, 0.26, 0.25) + fl(151.8 + dx, -40, 1.8, 3.2, 0, HL, 0.22) + fl(150 + dx, -12.4, 3.6, 3, 0, DK, 0.35);
  let fernDet = "";
  const fernBein = (P, top, det) => {
    const Q = top.concat(P), B = H.flaeche(Q);
    fernDet += B.clip(det);
    return H.teil(B, fell, `<rect x="${P[0][0] - 20}" y="-96" width="40" height="96" fill="${T.lg("fernl", [[0, "#1a100a", 0.75], [0.35, "#30241e", 0.55], [1, "#2e241e", 0.55]], 0, -96, 0, 0, H.US)}"/>` +
      H.haare(Q, 14, 92, 0.9, [["#1a100a", 1, 0.06, 0.35]], { streu: 10, spitze: ["#a88c70", 0.5, 0.05, 0.35] }), { rand: false });
  };
  s += H.vol("bein", 1.6, fernBein(fernH, [[36, -84], [56, -84]], laufDet(8, true)) + fernBein(fernV, [[132, -80], [152, -80]], laufDet(-9, false)), { tiefe: 3 }) + fernDet;
  s += H.schale(53.0, 61.4, 4.8, { farbe: "#241c18", fern: "#120e0c" }) + H.schale(141.2, 149.2, 5.0, { farbe: "#241c18", fern: "#120e0c" });
  /* ferne Stange (15° weiter hinten, kleiner, dunkler, teils verdeckt) und fernes Ohr hinter dem Kopf */
  s += geweih(gehBasis[0] - 3.2, gehBasis[1] + 0.6, 0.76, -15, true) + ohrZ(ohrBasis[0] + 3, ohrBasis[1] - 1, -26, true);
  /* Wedel: kurz, oben dunkler, unten hell; sitzt an der Kruppen-Hinterkante im Spiegel */
  const wedel = H.flaeche([[26.4, -114.4], [23.6, -113.0], [22.4, -108.6], [22.6, -103.4], [24.4, -101.4], [25.8, -104.6], [27.0, -110]]);
  s += H.teil(wedel, T.lg("wd", [[0, "#5a3c26"], [0.55, "#8a6a4a"], [1, "#d8c4a0"]], 0, 0, 0, 1), H.haare(wedel.pts, 12, 100, 1.4, [["#3a2a1c", 1, 0.06, 0.5]], { szene: 0 }) + H.rim(wedel, 1.2, 0.8), { rand: false });
  /* ---- Körper ---- */
  let inn = "", sch = "";
  /* Farbzonen (ohne Filter): Kopf graubraun, Mähne dunkel (weicher Übergang), Bauch und Läufe dunkler, großer creme Spiegel mit dunklem Saum */
  inn += `<path d="${G2([[110, -126], [140, -140], [158, -156], [170, -168], [176, -150], [172, -128], [170, -100], [168, -80], [150, -64], [116, -76]])}" fill="${T.rg("maehne", [[0, "#2e1c10", 0.92], [0.55, "#33200f", 0.85], [0.85, "#3a2416", 0.35], [1, "#3a2416", 0]], 0.72, 0.42, 0.62)}"/>`;
  inn += H.zone("kopf", [[150, -140], [166, -180], [186, -172], [222, -140], [214, -118], [196, -112], [160, -120]], "#6e5a4a", 0.7, [160, -142], [178, -160]);
  inn += fl(28.4, -106, 7.2, 12.4, 4, "#d8c098", 0.9) + fl(27.4, -106, 4.4, 8, 0, "#e8d8b8", 0.4) + wl([[[33.6, -119], [35.6, -110], [34.6, -98]]], "#2a1608", 2.0, 0.4, 1.0);
  inn += `<rect x="20" y="-90" width="150" height="90" fill="${T.lg("lauf", [[0, "#000", 0], [0.28, "#2a1a10", 0.4], [1, "#1e140e", 0.6]], 0, -90, 0, 0, H.US)}"/>`;
  /* Gesicht: Äser hell, Windfang dunkel mit Nasenloch-Schlitz, helles Kinn, Lippen */
  inn += T.form(KT([[43.0, 2.4], [45.4, 3.2], [47.4, 4.6], [48.6, 7.0], [48.2, 9.6], [46.8, 11.2], [45.2, 11.6], [44.2, 10.0], [44.6, 6.6], [43.6, 4.2]]), "#1e1614");
  inn += fl(...K(45.4, 4.2), 1.8, 0.7, KW + 20, "#fff", 0.45) + L([KT([[47.8, 6.0], [46.8, 7.0], [46.0, 8.6], [46.4, 9.8]]), KT([[47.8, 6.0], [46.4, 5.6], [44.8, 5.4]])], "#000", 0.55, 0.95);
  inn += fl(...K(38, 15.2), 4.4, 1.3, KW - 4, "#d8cebe", 0.85) + fl(...K(40.6, 9.4), 2.6, 1.8, KW, "#c8b8a4", 0.5) + L([KT([[42.6, 12.8], [40.4, 13.6], [37.6, 13.8]])], "#000", 0.3, 0.6);
  /* Fellkorn (Rauschen in Wuchsrichtung) und Haare mit hellen Spitzen; Mähne lang und strähnig */
  inn += H.fellKorn("h1", [[20, -126], [126, -128], [140, -110], [146, -80], [140, -64], [64, -70], [20, -96]], 176, [["kd", "#1e0c04", 0.5, 3], ["kh", "#ffd8b0", 0.32, 8]], { fx: 0.6, fy: 6 }) +
    H.fellKorn("h2", KT([[2, -7], [48, -1], [48, 12], [20, 20], [4, 20]]), KW + 184, [["kd", "#1e140c", 0.35, 3], ["kh", "#f0e0cc", 0.25, 8]], { fx: 1.4, fy: 9 });
  inn += H.haare(rumpf, 30, wuchs, laenge, [["#2a1408", 1, 0.08, 0.3]], { krumm: 0.06, streu: 10, nur: (x, y) => x < 128 && y < -64, spitze: ["#f0c08a", licht, 0.07, 0.4] });
  const maehne = [[124, -128], [140, -134], [156, -148], [168, -160], [172, -146], [170, -128], [168, -100], [166, -82], [150, -92], [134, -114]];
  inn += H.haare(maehne, 60, (x, y) => (x > 158 ? 100 : 112), (x, y) => (x > 158 ? 7 : 4.5), [["#140a04", 1, 0.22, 0.5], ["#5a3c26", 0.6, 0.18, 0.42], ["#9a7656", 0.25, 0.14, 0.38]], { krumm: 0.3, streu: 16 });
  inn += H.haare(KT([[2, -6], [42, 0], [44, 10], [20, 18], [3, 16]]), 34, KW + 186, 0.8, [["#2a1c14", 1, 0.05, 0.35]], { streu: 12, spitze: ["#e0ccb6", 0.55, 0.045, 0.4], szene: 0 });
  /* Licht und Anatomie (über dem Volumen): Rückenkante, Kernschatten 7 cm über der Bauchlinie, Reflexlicht, Schulterblatt,
     Buggelenk, Ellbogen, Rippenbogen, Flankenmulde, Hüfthöcker, Keule, Kniefalte, Kopfknochen, Schlagschatten von Kopf und Geweih */
  sch += wl([[[26, -118.6], [44, -120], [70, -118], [100, -118.4], [118, -124], [128, -126.4]]], "#ffd8a8", 2.6, 0.24, 1.6) +
    wl([[[70, -78], [90, -72.4], [112, -70], [134, -70.6], [142, -73]]], DK, 6, 0.3, 3) + wl([[[86, -66.4], [104, -64.6], [124, -64], [136, -65.6]]], "#c8a078", 1.4, 0.3, 0.8);
  sch += H.wf([[118, -126], [128, -128], [140, -116], [150, -96], [148, -86], [140, -92], [128, -106]], HL, 0.2, 3) + wl([[[118.4, -122], [122, -110], [128, -96], [136, -82]]], DK, 5, 0.2, 2.6) +
    fl(152, -90, 6.4, 6.8, 0, HL, 0.24) + fl(139, -70, 4, 2.4, 0, DK, 0.3) +
    wl([[[94, -112], [99, -98], [101, -84]], [[104, -112], [108, -98], [110, -84]], [[114, -112], [117, -98], [118.4, -86]]], DK, 2.6, 0.08, 1.6) + fl(106, -104, 16, 9, 0, HL, 0.12) +
    fl(66, -98, 8, 15, -8, DK, 0.24) + fl(46, -117.6, 4.6, 2.6, 0, "#ffe6c8", 0.24) + fl(38, -100, 12, 15, 10, HL, 0.2) +
    wl([[[32, -115], [30.4, -102], [29.6, -92]]], "#5a2c10", 2.4, 0.16, 1.4) + wl([[[64.6, -77], [61.6, -86], [57.6, -94]]], DK, 1.8, 0.24, 1);
  sch += fl(...K(19.5, -3.6), 5.4, 1.8, KW, "#ffe6c8", 0.28) + fl(...K(12, 8.6), 7, 4.4, KW, HL, 0.18) + wl([KT([[9, 7], [12, 13], [12.6, 18], [9, 21]])], DK, 1.4, 0.32, 0.8) +
    wl([KT([[24, -2.4], [34, -0.4], [42, 1.6]])], "#ffe6cc", 0.7, 0.4, 0.3) + fl(...K(30, 10), 7, 3.4, KW, DK, 0.2) +
    H.wf([K(20, 19.6), K(14, 21.4), [166.6, -142.0], [167.2, -134], [162, -140], [161, -152]], DK, 0.3, 2.4) + fl(...K(1, -4), 4.4, 2.6, KW, DK, 0.35);
  /* Tränengrube: schräger dunkler Schlitz vom vorderen Augenwinkel nach vorn-unten (≈ 40°), mit hellem Haarrand */
  sch += wl([KT([[23.4, 3.0], [26.4, 2.8], [29.2, 2.2]])], "#140a06", 1.0, 0.75, 0.25) + wl([KT([[23.4, 2.0], [26.6, 1.7], [29.4, 1.2]])], "#e0ccb4", 0.5, 0.45, 0.2);
  const koerper = H.teil(A, fell, inn, { rand: false }) +
    H.saum(ruecken.slice(0, 11), 20, wuchs, (x, y) => laenge(x, y) * 0.6, [["#5a3018", 1, 0.07, 0.5], ["#c08a5a", 0.5, 0.06, 0.4]], { offen: true, szene: 0 }) +
    H.saum(bauch.concat(keule), 14, wuchs, (x, y) => laenge(x, y) * 0.6, [["#3a2418", 1, 0.07, 0.5]], { offen: true, szene: 0 });
  s += H.vol("rumpf", 11, koerper, { tiefe: 3, umgebung: 0.42 }) + A.clip(sch);
  /* Brunftmähne: lange, zottige Strähnen an Kehle und Trägerunterseite und am Trägerkamm, Kontur gebrochen */
  s += H.saum(kehle.slice(0, 7), F ? 66 : 24, (x, y) => 102 + (T.rnd() - 0.5) * 30, (x, y) => (y < -110 ? 10 : 7), [["#140a04", 1, 0.3, 0.6], ["#4a3220", 0.6, 0.24, 0.5], ["#8a6a4a", 0.25, 0.18, 0.4]],
    { offen: true, krumm: 0.3, szene: 0.3 });
  s += H.saum(ruecken.slice(9), F ? 26 : 12, 128, 3.6, [["#1e1208", 1, 0.14, 0.55], ["#6a4a30", 0.5, 0.12, 0.4]], { offen: true, krumm: 0.2, szene: 0.2 });
  /* ---- nahe Läufe als Zylinder (Volumen), oben weich in den Rumpf übergehend ---- */
  const laufN = (pts) => {
    const B = H.flaeche(pts);
    return [B, H.teil(B, fell, `<rect x="20" y="-90" width="150" height="90" fill="${T.lg("lauf")}"/>` +
      H.haare(pts, 24, 92, 0.9, [["#1e120a", 1, 0.06, 0.32]], { streu: 10, spitze: ["#c8a888", 0.6, 0.05, 0.4] }), { rand: false })];
  };
  const vDet = wl([[[152.8, -64], [151.4, -50], [151.0, -38], [150.4, -20]]], "#ffe6c8", 0.9, 0.28, 0.45) + wl([[[147.4, -34], [147.6, -22], [147.4, -16]]], "#e8c8a8", 0.5, 0.3, 0.2) +
    wl([[[148.6, -34], [148.8, -18]]], DK, 0.7, 0.35, 0.25) + fl(151.6, -40, 1.8, 3.0, 0, HL, 0.3) + fl(146.0, -40, 1.4, 2.6, 0, DK, 0.4) + fl(149.4, -12.6, 3.6, 2.8, 0, DK, 0.4) + fl(151.2, -14.8, 1.3, 2, 0, "#fff", 0.2) +
    fl(141.6, -64, 3.4, 3.2, 0, HL, 0.2);
  const hDet = wl([[[60, -76], [55.4, -64], [50.4, -55], [48.6, -46], [48.2, -20]]], "#ffe6c8", 0.9, 0.28, 0.45) + wl([[[44.8, -42], [45.2, -24], [45.0, -16]]], "#e8c8a8", 0.5, 0.3, 0.2) +
    wl([[[46.2, -42], [46.4, -18]]], DK, 0.7, 0.35, 0.25) + wl([[[41.6, -66], [42.2, -58], [41.6, -53]]], "#ffe6c8", 0.7, 0.36, 0.25) +
    fl(41.6, -52, 2, 3, 0, HL, 0.3) + fl(47.6, -48, 1.6, 4, 0, DK, 0.32) + fl(46.4, -12.6, 3.6, 2.8, 0, DK, 0.4) + fl(48.2, -14.8, 1.3, 2, 0, "#fff", 0.2);
  const [BV, lv] = laufN([[136, -76], [154, -76]].concat(vorne)), [BH, lh] = laufN([[34, -86], [62, -86]].concat(hinten));
  s += `<g mask="${H.maskeY("b", -80, -68)}">` + H.vol("bein", 1.6, lv + lh, { tiefe: 3 }) + BV.clip(vDet) + BH.clip(hDet) + `</g>`;
  /* ---- Schalen, Geäfter (an allen vier Läufen) ---- */
  s += H.schale(148.0, 156.6, 5.0, { haar: "#3a2a20" }) + H.schale(45.0, 53.6, 4.8, { haar: "#3a2a20" }) + H.after(146.4, -10.2, 1.6) + H.after(43.2, -10.4, 1.6);
  /* ---- nahes Ohr, nahe Stange (Schatten auf Lauscher und Stirn), Stirnhaar bis an die Rose ---- */
  s += ohrZ(ohrBasis[0], ohrBasis[1], -52, false);
  if (F) s += `<path d="${G2([[gehBasis[0] - 2, gehBasis[1] - 2], [gehBasis[0] - 8, gehBasis[1] - 14], [gehBasis[0] - 12, gehBasis[1] - 10], [gehBasis[0] - 5, gehBasis[1] + 1]])}" fill="#000" opacity=".22" filter="${H.blur(1.3)}"/>`;
  s += geweih(gehBasis[0], gehBasis[1], 0.88, 0, false);
  s += H.haare([[gehBasis[0] - 4.4, gehBasis[1] + 2.8], [gehBasis[0] + 4.6, gehBasis[1] + 3.0], [gehBasis[0] + 3.4, gehBasis[1] - 0.2], [gehBasis[0] - 3.4, gehBasis[1] - 0.2]], 22, 252, 1.6,
    [["#2e1e12", 1, 0.09, 0.75], ["#7a5a40", 0.5, 0.07, 0.6]], { szene: 0, streu: 40 });
  /* Auge: in der Augenhöhle, Augenbogen beschattet das Oberlid, 8 Wimpern am Oberlid */
  const au = K(19.6, 1.6);
  s += H.auge(au[0], au[1], 2.3, { iris: "#24140a", iris2: "#4a2a14", offen: 0.74, winkel: KW - 18, wimpern: 8, wimpernLaenge: 0.55, hoehle: "#1e1008" });
  if (F) s += T.schnurrhaare(...K(44.6, 11.6), 6, 3.6, KW + 30, 50, "#1a120c", 0.06) + T.schnurrhaare(...K(39.6, 15.0), 4, 2.6, KW + 80, 40, "#e8e0d0", 0.05);
  return { svg: s, box: [22.2, -235, 205.7, 0], fuesse: [50, 57, 145, 152], kopf: [130, -238, 208, -110] };
}

/* =====================================================================
   WILDSCHWEIN (Keiler)
   ===================================================================== */
/* RECHERCHE Wildschwein (Sus scrofa), Keiler:
   Kopf-Rumpf 150–180 cm, Schulterhöhe bis ~100 cm, 100–150 kg. Vorderkörper massig und hoch, Rücken fällt zur schmalen
   Hinterhand ab, seitlich abgeflacht; kurze, dünne Läufe. Keilförmiger, langer Kopf (~40 cm) mit geradem Nasenrücken,
   endet in der Rüsselscheibe (nackt, grau-rosa, zwei Nasenlöcher). Kleine Augen hoch und weit hinten, kleine
   dreieckige, behaarte Stehohren (Teller). Gewaff: unten die Gewehre (Hauer, bogig nach oben-hinten, weiß, scharf),
   oben die kürzeren Haderer, an denen die Gewehre geschliffen werden. Schwarte mit dichten, groben Borsten, dunkel
   graubraun bis schwärzlich, Borstenspitzen gespalten und heller (grau meliert); entlang Nacken und Rücken lange
   Borstenkamm-„Federn“; Gesicht und Backen etwas heller grau. Läufe schwarz. Pürzel (Schwanz) ~20 cm, glatt hängend,
   mit Endquaste. Vier Zehen: zwei Schalen, dazu große Afterklauen (Geäfter) hinten, fast am Boden. */
function wildschwein(T) {
  const H = kit(T, [-10, -140, 210, 6], 1, 5), { fl, wl, L, F, f } = H, G2 = H.G;
  H.minFl = 6;
  const DK = "#0c0806", HL = "#e8d8c0";
  /* ---- Haupt: langer Keil, gerade Stirn-Nasen-Linie, Wurf im Profil als schmale senkrechte Scheibe (Nase bei x ≈ 44,6) ---- */
  const KX = 120, KY = -95, KW = 36, KS = 1.06;
  const K = H.pt(KX, KY, KW, KS), KT = (pts) => H.tr(pts, KX, KY, KW, KS);
  const kopf = KT([[-2, -4.4], [5, -7.0], [12, -6.8], [20, -5.0], [28, -2.8], [36, -0.6], [41.6, 0.6], [43.4, 0.6], [44.3, 3.2], [44.6, 6.6], [44.0, 9.6], [42.2, 10.6],
    [39, 11.4], [34, 12.4], [28, 15.0], [22, 19.0], [17, 23.4], [13.4, 27.4]]);
  /* ---- Läufe: Vorderfußwurzel bei ≈ 30 %, Sprunggelenk bei ≈ 35 % Höhe mit vorspringendem Fersenhöcker ---- */
  const vorne = [[118.4, -44], [117.6, -37], [116.6, -30], [116.9, -26.4], [115.8, -22], [115.4, -14], [115.8, -9.4], [117.2, -6.2], [118.6, -3.6], [118.4, -1.6],
    [114.2, -1.4], [112.6, -3.2], [111.2, -6.4], [110.2, -10], [110.6, -14], [110.6, -21], [109.6, -25.6], [110.2, -29], [109.4, -35], [106.6, -40.4]];
  const hinten = [[44, -50], [40.6, -43], [36.4, -37.6], [32.6, -33.6], [31.4, -28], [31.0, -18], [31.4, -12], [32.6, -7.6], [34.2, -4.4], [35.4, -2.6], [35.2, -1.4],
    [31.0, -1.2], [29.4, -3.0], [28.0, -6.4], [27.0, -10], [27.4, -14], [27.6, -22], [27.4, -28], [26.2, -31.8], [23.8, -35.2, 1], [24.8, -39], [24.4, -45], [22.2, -52], [17.8, -58]];
  const ruecken = [[14, -72], [22, -76], [34, -79.6], [48, -84], [62, -89], [76, -94], [88, -98], [98, -100.6], [106, -101], [113, -99.6], [118, -97.4]];
  const brust = [[118.4, -63.6], [119.4, -57], [119.8, -50.6]];
  const bauch = [[100, -38.6], [92, -36.2], [80, -37.0], [66, -39.4], [54, -42.6], [47, -46.4]];
  const keule = [[13, -62], [10.2, -65.6], [11.0, -69.6]];
  const rumpf = ruecken.concat(kopf).concat(brust).concat(vorne).concat(bauch).concat(hinten).concat(keule);
  const A = H.flaeche(rumpf);
  /* Wuchsrichtung: Borsten von vorn-oben nach hinten-unten, Wirbel an der Flanke, Keule abwärts, Haupt zu den Tellern */
  const wuchs = (x, y) => {
    if (y > -36 || (x > 106 && x < 120 && y > -44) || (x < 46 && x > 20 && y > -52)) return 94;
    if (x > 118 && y > -94 + (x - 118) * 0.7) return 214;
    if (x < 24) return 100;
    if (x > 38 && x < 50 && y > -74) return 132 + (y + 74) * 1.8;
    return 160 - Math.min(1, Math.max(0, (y + 92) / 46)) * 52;
  };
  const laenge = (x, y) => (y > -36 ? 1.2 : x > 118 && y > -94 + (x - 118) * 0.7 ? 1.2 : x > 86 && x < 118 && y < -60 ? 1.6 : 2.6);
  const licht = (x, y) => (y < -82 ? 0.7 : y < -64 ? 0.45 : 0.18);
  /* ---- Teller (Ohren): dreieckig, spitz, aufrecht, leicht nach vorn-außen; dicht behaart, Borstenpinsel an der Spitze ---- */
  const ohrP = [[-3.6, 0.6], [-4.2, -3.4], [-3.4, -7.4], [-1.6, -10.6], [0.4, -12.6, 1], [1.6, -10.0], [2.8, -6.6], [3.6, -3.0], [3.4, 0.6]];
  const ohrZ = (ox, oy, w, sx, fern) => {
    const P = H.tr(ohrP.map((p) => [p[0] * sx, p[1], p[2]]), ox, oy, w), B = H.flaeche(P);
    const inn = (fern ? "" : H.wf(H.tr([[-1.2, -1.4], [0.4, -9.6], [2.4, -6.4], [2.6, -1.4]].map((p) => [p[0] * sx, p[1]]), ox, oy, w), "#060403", 0.7, 0.6)) +
      H.haare(P, fern ? 14 : 44, w - 92, 1.5, [["#0e0a08", 1, 0.1, 0.6]], { streu: 20, szene: 0, spitze: ["#a89880", 0.6, 0.08, 0.5] }) + H.rim(B, 1.6, 0.9);
    return H.teil(B, fern ? "#2a221c" : "#3a3028", inn, { rand: false }) +
      H.saum(P.slice(1, 8), fern ? 8 : 34, (x, y) => w - 92 + (T.rnd() - 0.5) * 50, 1.8, [["#0e0a08", 1, 0.1, 0.65], ["#9a8a78", 0.5, 0.08, 0.5]], { offen: true, szene: 0 }) +
      H.saum([P[4], P[4]], fern ? 0 : 10, w - 90, 2.4, [["#0a0806", 1, 0.1, 0.7]], { offen: true, streu: 30, szene: 0 });
  };
  /* Geäfter: groß, spitz, keilförmig, tief sitzend (Spitzen ≈ 1–1,5 cm über dem Boden), nach hinten-unten */
  const aefter = (x, k) => H.teil(H.flaeche([[x + 0.8, -7.4], [x + 1.4, -5.6], [x - 0.6, -2.4, 1], [x - 2.2, -1.2, 1], [x - 1.4, -3.4], [x - 0.6, -6.4]]), k ? "#2a2420" : "#201c1a",
    fl(x - 0.2, -5.2, 0.7, 1.1, 30, "#fff", 0.3 * k) + fl(x - 1.8, -1.6, 0.7, 0.5, 0, "#8a7c6c", 0.5), { rw: 0.08, randA: 0.6 });
  let s = "";
  /* ---- ferne Läufe: Körperton, 15–20 % heller und kühler, teilweise verdeckt, mit Gelenken ---- */
  const lauf = T.lg("lauf", [[0, "#2c2420"], [0.5, "#241e1a"], [1, "#1c1714"]], 0, -50, 0, 0, H.US);
  const fernL = T.lg("fernl", [[0, "#3a3430"], [1, "#2c2826"]], 0, -50, 0, 0, H.US);
  const fH = hinten.map((p) => [p[0] + (p[1] > -36 ? 7 : p[1] < -46 ? 2 : 2 + (p[1] + 46) / 10 * 5), p[1], p[2]]), fV = H.schieb(vorne, -7.4);
  let fernDet = "";
  const fernBein = (P, top, det) => {
    const Q = top.concat(P), B = H.flaeche(Q);
    fernDet += B.clip(det);
    return H.teil(B, fernL, H.haare(Q, 22, 94, 1.1, [["#100c0a", 1, 0.08, 0.4]], { streu: 12, spitze: ["#8a7e70", 0.5, 0.07, 0.35] }), { rand: false });
  };
  const gelenkV = (dx, k) => fl(116.4 + dx, -26.6, 1.4, 2.2, 0, "#fff", 0.16 * k) + fl(110.2 + dx, -26, 1.2, 2.4, 0, DK, 0.35) + fl(113 + dx, -8.4, 2.8, 2.4, 0, DK, 0.35) +
    wl([[[116.4 + dx, -38], [116.0 + dx, -28], [115.6 + dx, -14]]], "#d8c8b8", 0.6, 0.22 * k, 0.4);
  const gelenkH = (dx, k) => fl(24.8 + dx, -35, 1.3, 2.2, 0, "#fff", 0.18 * k) + fl(31 + dx, -32, 1.2, 2.6, 0, DK, 0.32) + fl(30 + dx, -8.4, 2.8, 2.4, 0, DK, 0.35) +
    wl([[[38.6, -41], [34.4, -36], [31.6, -30], [31.2, -14]].map((p) => [p[0] + dx, p[1]])], "#d8c8b8", 0.6, 0.22 * k, 0.4);
  s += H.vol("bein", 1.4, fernBein(fH, [[22, -56], [44, -56]], gelenkH(fH[0][0] - 44, 0.6)) + fernBein(fV, [[96, -54], [114, -54]], gelenkV(-7.4, 0.6)), { tiefe: 3 }) + fernDet;
  s += aefter(fH[13][0] - 0.6, 0) + aefter(fV[12][0] + 0.2, 0);
  s += H.schale(fH[12][0] - 0.2, fH[9][0] + 1.2, 3.6, { farbe: "#2a2420", fern: "#14100e" }) + H.schale(fV[11][0] - 0.2, fV[8][0] + 1.2, 3.8, { farbe: "#2a2420", fern: "#14100e" });
  /* fernes Ohr hinter dem Haupt */
  const ohrB = K(4.6, -6.2);
  s += ohrZ(ohrB[0] + 2.4, ohrB[1] - 0.2, -14, 0.7, true);
  /* Pürzel: setzt tiefer an der Kruppenrundung an, hängt gerade, flache Quaste aus steifen Borsten */
  const pz = H.kette([[11.4, -66.4, 1.0, 1.0], [10.2, -59, 0.85, 0.85], [9.8, -52, 0.72, 0.72], [9.8, -46.6, 0.65, 0.65]]);
  const PZ = H.flaeche(pz.pts);
  s += H.teil(PZ, "#241c16", H.haare(pz.pts, 14, 96, 1, [["#0a0806", 1, 0.07, 0.5]], { szene: 0 }) + H.rim(PZ, 0.8, 0.8), { rand: false }) +
    H.saum([[9.6, -48], [10.0, -46]], F ? 26 : 6, 94, 5, [["#0a0806", 1, 0.12, 0.75], ["#4a3e34", 0.5, 0.1, 0.6]], { offen: true, krumm: 0.15, streu: 18, szene: 0.5 });
  /* ---- Körper ---- */
  const fell = T.lg("fell", [[0, "#56483c"], [0.25, "#463a30"], [0.5, "#382e26"], [0.72, "#2a221c"], [0.86, "#221b16"], [1, "#1c1612"]], 0, -102, 0, 0, H.US);
  let inn = "", sch = "";
  /* Haupt: Backe und Nasenrücken heller, grau gesprenkelt (Kontrastfeld); Läufe dunkler; Schild über Schulter und vorderen Rippen */
  inn += fl(...K(14, 12), 9, 7, KW, "#8a7c6c", 0.55) + fl(...K(30, 3), 10, 3.4, KW, "#8a7c6c", 0.4) + fl(...K(22, 6), 5, 4, KW, "#6a5e52", 0.3);
  inn += `<rect x="0" y="-50" width="130" height="50" fill="${T.lg("beinz", [[0, "#1a1410", 0], [0.3, "#1a1410", 0.5], [1, "#14100c", 0.7]], 0, -50, 0, 0, H.US)}"/>`;
  inn += fl(102, -76, 16, 20, 10, "#5a4c40", 0.45);
  /* Wurf: schmale, senkrechte, feuchte Scheibe, dunkelgrau-schwarz; Nasenlöcher als Kerben vorn; Querfalten dahinter */
  inn += T.form(KT([[42.0, 0.5], [43.4, 0.6], [44.3, 3.2], [44.6, 6.6], [44.0, 9.6], [42.2, 10.6], [41.4, 8.0], [41.4, 3.0]]), "#3a3433") +
    fl(...K(43.4, 2.6), 0.5, 1.6, KW, "#fff", 0.4) + L([KT([[44.5, 4.6], [43.8, 5.4]]), KT([[44.4, 7.6], [43.7, 8.2]])], "#0a0606", 0.4, 0.9);
  if (F) inn += H.L([KT([[37.2, -0.6], [37.8, 2.2]]), KT([[38.8, -0.2], [39.2, 1.8], [39.0, 3.4]]), KT([[35.4, -1.0], [36.2, 1.0]]), KT([[40.2, 0.2], [40.6, 2.6]])], "#0a0806", 0.26, 0.35) +
    H.L([KT([[37.5, -0.4], [38.1, 2.0]]), KT([[39.1, 0.0], [39.5, 1.6]])], "#a89a8a", 0.15, 0.35);
  /* Gebrech: Maulspalte kurz (endet unter dem Haderer), leicht nach oben gebogen; Kinnlinie; Oberlippe über dem Haderer als Wulst */
  inn += wl([KT([[41.6, 10.6], [37, 11.2], [33, 11.2], [31, 10.6]])], "#000", 0.45, 0.65, 0.15) + wl([KT([[40, 11.6], [34, 12.4], [27, 13.8], [21, 16]])], DK, 1.2, 0.35, 0.6);
  /* Fellkorn und Borsten: schwarzbraun mit hellgrau-gelblichen Spitzen (gesprenkelt), lang und steif */
  inn += H.fellKorn("w1", [[8, -104], [120, -104], [120, -40], [100, -36], [40, -40], [8, -50]], 160, [["kd", "#000", 0.45, 3], ["kh", "#c8b898", 0.28, 8]], { fx: 0.5, fy: 4 }) +
    H.fellKorn("w2", KT([[-2, -7], [42, 0], [42, 12], [10, 23], [-2, 22]]), KW + 180, [["kd", "#000", 0.35, 3], ["kh", "#d8ccb8", 0.3, 8]], { fx: 1, fy: 6 });
  inn += H.haare(rumpf, 300, wuchs, laenge, [["#0a0806", 1, 0.09, 0.42], ["#2e241c", 0.6, 0.09, 0.4]], { krumm: 0.12, streu: 16, nur: (x, y) => y < -36, spitze: ["#c8b898", licht, 0.08, 0.5] });
  /* Licht und Plastizität (über dem Volumen): Rücken, Schild und Keule im Licht, Kernschatten im unteren Drittel, Reflex am Bauch,
     Schlagschatten des Hauptes auf Brust und Vorderlauf, Ganasche mit Schatten darunter, Augenhöhle */
  sch += H.wf([[88, -98], [106, -100], [114, -90], [116, -70], [110, -54], [100, -52], [92, -66]], "#d8c8b0", 0.16, 3) + fl(104, -86, 8, 10, 0, "#fff", 0.1) +
    wl([[[44, -54], [64, -48], [84, -46], [102, -48]]], DK, 5, 0.35, 2.6) + wl([[[58, -40.6], [74, -38.6], [88, -38.0], [98, -39.6]]], "#9a8c7c", 0.9, 0.3, 0.5) +
    fl(26, -64, 10, 9, 0, "#d8c8b0", 0.16) + wl([[[40, -70], [42, -60], [43, -50]]], DK, 3, 0.18, 2) +
    H.wf([K(17, 23.4), K(13.4, 27.4), [117.6, -64.6], [119, -57], [112, -52], [108, -62]], DK, 0.4, 2.4) +
    wl([KT([[24, 15.2], [18, 17.6], [13, 19.6]])], DK, 1.6, 0.35, 0.8) + fl(...K(14, 13), 6, 4.6, KW, "#fff", 0.12) + fl(...K(14.6, -0.4), 2.4, 1.8, KW, DK, 0.5);
  const koerper = H.teil(A, fell, inn, { rand: false }) +
    /* Federn: lange Borsten in Büscheln vom Nacken bis zum Widerrist (4–6 cm), zur Kruppe kürzer (1,5–2 cm), helle gespaltene Spitzen */
    federn(ruecken.slice(1).concat([K(0, -4.6), K(5, -7)])) +
    H.saum(bauch.concat(keule).concat(brust), F ? 120 : 20, wuchs, (x, y) => laenge(x, y) * 0.8, [["#0e0a08", 1, 0.09, 0.55], ["#6a5e50", 0.5, 0.08, 0.45]], { offen: true, szene: 0.2 }) +
    /* Bart: Borsten von der Kehle bis zum Wurf */
    H.saum(KT([[39, 11.4], [34, 12.4], [28, 15.0], [22, 19.0], [17, 23.4], [13.4, 27.4]]).concat([[117.6, -64.6], [119, -57]]), F ? 70 : 14, (x, y) => 108 + (T.rnd() - 0.5) * 30, 2.6,
      [["#0a0806", 1, 0.1, 0.65], ["#6a5c4e", 0.6, 0.08, 0.5], ["#a8988a", 0.25, 0.07, 0.45]], { offen: true, krumm: 0.22, streu: 22, szene: 0.4 }) +
    /* Pinsel des Keilers: dunkles Borstenbüschel etwas hinter der Bauchmitte */
    H.saum([[76.4, -37.2], [77.6, -37.2]], F ? 22 : 5, 92, 2.6, [["#0a0806", 1, 0.12, 0.8]], { offen: true, krumm: 0.2, streu: 16, szene: 0.5 });
  function federn(linie) {
    let o = "";
    const tot = linie.length - 1, eimer = [[], [], []];
    const n = F ? 46 : 14;
    for (let i = 0; i < n; i++) {
      const t = T.rnd() * tot, j = Math.min(tot - 1, Math.floor(t)), u = t - j, a = linie[j], b = linie[j + 1];
      const x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u + 0.6;
      if (x < 34) continue;
      const lang = 1.6 + Math.max(0, Math.min(1, (x - 40) / 55)) * 4.2 * (0.7 + T.rnd() * 0.5), wb = 206 + (x - 90) * 0.1 + (T.rnd() - 0.5) * 16;
      const m = 3 + Math.floor(T.rnd() * 5);
      for (let k = 0; k < m; k++) {
        const w = (wb + (T.rnd() - 0.5) * 14) * Math.PI / 180, l = lang * (0.6 + T.rnd() * 0.5), dx = (T.rnd() - 0.5) * 0.8;
        eimer[k % 3].push([x + dx, y, Math.cos(w) * l, Math.sin(w) * l, (T.rnd() - 0.5) * l * 0.2]);
      }
    }
    const farben = [["#0a0806", 0.13, 0.75], ["#2a2018", 0.11, 0.65], ["#5a4c3e", 0.1, 0.55]];
    eimer.forEach((e, i) => {
      let d = "", tips = "";
      for (const [x, y, ex, ey, k] of e) {
        d += `M${f(x)} ${f(y)}q${f(ex / 2 - ey * 0.1 + k)} ${f(ey / 2)} ${f(ex)} ${f(ey)}`;
        if (F) tips += `M${f(x + ex * 0.8)} ${f(y + ey * 0.8)}l${f(ex * 0.2)} ${f(ey * 0.2)}`;
      }
      o += `<path d="${d.replace(/ -/g, "-")}" fill="none" stroke="${farben[i][0]}" stroke-width="${farben[i][1]}" stroke-opacity="${farben[i][2]}" stroke-linecap="round"/>`;
      if (tips) o += `<path d="${tips.replace(/ -/g, "-")}" fill="none" stroke="#d8ccb4" stroke-width=".08" stroke-opacity=".55" stroke-linecap="round"/>`;
    });
    return o;
  }
  s += H.vol("rumpf", 8, koerper, { tiefe: 3, umgebung: 0.42 }) + A.clip(sch);
  /* ---- nahe Läufe: Zylinder, kurze abwärts gerichtete Borsten, struppige Kontur ---- */
  const laufN = (pts) => {
    const B = H.flaeche(pts);
    return [B, H.teil(B, lauf, H.tex("lk", { fx: 0.4, fy: 4, farbe: "#8a7c6c", staerke: 2.6, schwelle: 0.62, okt: 1, seed: 6 }, 92, T.box(pts), 0.3) +
      H.haare(pts, 48, 94, 1.1, [["#0a0806", 1, 0.08, 0.42]], { streu: 12, spitze: ["#8a7c6c", 0.5, 0.07, 0.4] }), { rand: false }) +
      H.saum(pts.slice(2, 9), F ? 14 : 0, 100, 1.1, [["#0e0a08", 1, 0.07, 0.55]], { offen: true, szene: 0 })];
  };
  const [BV, lv] = laufN([[100, -50], [118, -50]].concat(vorne)), [BH, lh] = laufN([[18, -58], [46, -58]].concat(hinten));
  s += `<g mask="${H.maskeY("b", -48, -40)}">` + H.vol("bein", 1.4, lv + lh, { tiefe: 3 }) + BV.clip(gelenkV(0, 1)) + BH.clip(gelenkH(0, 1)) + `</g>`;
  /* ---- Geäfter und Schalen (nah): zwei spitze, vorn leicht gespreizte Klauen ---- */
  s += aefter(28.6, 1) + aefter(111.6, 1);
  s += H.schale(29.8, 36.4, 3.6) + H.schale(113.0, 119.6, 3.8);
  /* ---- Gewaff: Gewehr (unten, vorn) als Sichel nach oben-hinten mit Schliff-Facette; Haderer (oben) dahinter, dicker, liegt am Gewehr an ---- */
  const zahn = (pts, w0, farbe, facette) => {
    const k = H.kette(KT(pts.map((p, i) => { const q = w0 * (1 - Math.pow(i / (pts.length - 1), 1.2)) + 0.06; return [p[0], p[1], q, q]; }))), B = H.flaeche(k.pts);
    return H.teil(B, farbe, (F ? H.L([k.L.slice(0, -1).map((p, i) => [p[0] * 0.7 + k.R[i][0] * 0.3, p[1] * 0.7 + k.R[i][1] * 0.3])], "#8a7a5a", 0.06, 0.5) : "") +
      fl(...KT([pts[1]])[0].slice(0, 2), w0 * 0.8, w0 * 1.8, KW, "#fff", 0.55) + (facette ? H.wf(KT(facette), "#fffaf0", 0.75, 0.05) : ""), { rw: 0.06, randA: 0.6 });
  };
  s += zahn([[31.6, 11.6], [31.8, 10.0], [31.0, 8.8], [30.2, 8.4]], 0.9, T.lg("hz", [[0, "#c8b896"], [1, "#efe6d2"]], 0, 1, 0, 0));
  s += fl(...K(31.8, 10.6), 1.8, 1.2, KW, "#3a3028", 0.7);
  s += zahn([[33.4, 12.8], [33.8, 10.0], [33.2, 7.2], [31.8, 5.2], [29.8, 4.2]], 0.78, T.lg("gz", [[0, "#b0a07c"], [0.45, "#e8dfca"], [1, "#fbf6ea"]], 0, 1, 0, 0),
    [[31.6, 5.6], [30.4, 4.8], [31.2, 6.2]]);
  /* ---- nahes Ohr, Auge (klein, tief in der Augenhöhle, kurze steife Borsten am Oberlid) ---- */
  s += ohrZ(ohrB[0], ohrB[1], -28, 0.85, false);
  const au = K(14.6, -0.4);
  s += H.auge(au[0], au[1], 0.95, { iris: "#3a200c", iris2: "#6a4220", pupille: "rund", offen: 0.62, winkel: KW - 14, wimpern: 7, wimpernLaenge: 0.6, wimpernFarbe: "#0e0a08", hoehle: "#0a0604", braue: "#a89880" });
  if (F) s += T.schnurrhaare(...K(41.6, 10.4), 7, 3.2, KW + 40, 50, "#1a1410", 0.05) + T.schnurrhaare(...K(37, 12), 5, 2.8, KW + 70, 40, "#cfc6b8", 0.045);
  return { svg: s, box: [8, -110.5, 155.6, 0], fuesse: [32, 39, 108, 116], kopf: [108, -112, 158, -50] };
}

/* =====================================================================
   ELCH (Bulle mit Schaufelgeweih)
   ===================================================================== */
/* RECHERCHE Elch (Alces alces), Bulle:
   Schulterhöhe 180–210 cm (bis 235), Kopf-Rumpf 240–310 cm, 380–700 kg; größte Hirschart. Sehr lange Läufe (Bauch ~110 cm
   über dem Boden), kurzer tiefer Rumpf, hoher Widerristbuckel (Dornfortsätze), Kruppe deutlich tiefer, Stummelschwanz.
   Kurzer, dicker Hals mit Mähne. Langer Kopf (~70 cm) mit gewölbter Ramsnase und überhängender, beweglicher Oberlippe
   (Muffel); große Nasenlöcher. An der Kehle die Wamme („Bart“, „Glocke“) mit Hautlappen. Kleine Augen weit oben-hinten,
   große Eselsohren. Fell schwarzbraun bis dunkelbraun, Gesicht heller braun, Läufe unten hellgrau bis fast weiß („Strümpfe“).
   Geweih: Schaufeln (Spannweite bis 1,8 m), je Stange eine große Hauptschaufel nach hinten-oben und eine kleinere vordere
   Augschaufel, Enden (Sprossen) am Außenrand; hell gelbbraun, Enden heller. Große Paarhufer-Schalen, deutliche Afterklauen. */
function elch(T) {
  const H = kit(T, [-10, -290, 300, 6], 1, 5), { fl, wl, L, F, f } = H, G2 = H.G;
  H.minFl = 10;
  const DK = "#0c0806", HL = "#e0c8a8";
  /* ---- Kopf: lang (≈ 0,65 m), Ramsnase, kolbige überhängende Muffel, kleines zurückgesetztes Kinn ---- */
  const KX = 198, KY = -172, KW = 50, KS = 1.05;
  const K = H.pt(KX, KY, KW, KS), KT = (pts) => H.tr(pts, KX, KY, KW, KS);
  const kopf = KT([[-1, -4], [6, -7.4], [14, -8.4], [22, -7.6], [30, -6.4], [38, -6.2], [46, -6.0], [53, -5.0], [59, -3.2], [64, -0.4], [67.8, 3.8], [69.6, 9.0], [69.0, 14.4],
    [67.0, 18.0], [64.0, 19.8], [61.8, 19.4], [60.2, 20.4], [58.6, 22.0], [55.2, 22.6], [48, 22.8], [40, 23.6], [32, 25.2], [24, 27.4], [16, 28.8]]);
  /* ---- Läufe: sehr lang; knochige Vorderfußwurzel- und Sprunggelenke mit Fersenhöcker ---- */
  const vorne = [[182, -102], [180.8, -92], [179.8, -80], [179.2, -69], [180.0, -63], [178.8, -57], [178.0, -42], [178.0, -28], [179.0, -20], [182.0, -13.6], [185.0, -8.8], [185.6, -4.4],
    [179.6, -3.6], [176.6, -7.2], [173.8, -13], [171.6, -20], [172.2, -28], [172.4, -42], [172.0, -54], [170.2, -60], [171.2, -66], [170.2, -80], [167.6, -92], [163.6, -100]];
  const hinten = [[72, -118], [69, -108], [64, -98], [58, -88], [53.4, -79], [51.4, -72], [50.8, -60], [50.6, -40], [50.8, -26], [52.0, -19], [55.0, -13.6], [58.0, -8.8], [58.6, -4.4],
    [52.6, -3.6], [49.6, -7.2], [46.8, -13], [44.6, -20], [45.0, -28], [45.2, -44], [45.0, -62], [43.6, -67.6], [40.6, -72.4, 1], [41.6, -77.4], [41.2, -86], [39.4, -98], [35.8, -112], [31, -124]];
  /* hoher Widerrist-Buckel (höchster Punkt, ≈ 18 cm über der Kruppe), Rücken fällt zur Kruppe, vorn steil zum kurzen, dicken Nacken */
  const ruecken = [[22, -158], [26, -168], [34, -175.6], [46, -179], [62, -180], [82, -181.4], [102, -185], [120, -191.4], [134, -197.6], [146, -201], [158, -200], [168, -195.6],
    [178, -188.4], [187, -180.6], [194, -175.2]];
  const kehle = [[186.4, -128], [185.6, -118], [184.6, -110], [183.6, -104]];
  const bauch = [[154, -99.4], [136, -99.6], [118, -100.6], [100, -103], [86, -106.4], [76, -112]];
  const keule = [[26, -136], [23, -147], [22, -154]];
  const rumpf = ruecken.concat(kopf).concat(kehle).concat(vorne).concat(bauch).concat(hinten).concat(keule);
  const A = H.flaeche(rumpf);
  const wuchs = (x, y) => {
    if (y > -100 || (x > 162 && x < 186 && y > -106) || (x < 74 && x > 34 && y > -120)) return 93;
    if (x > 192 && y > -176) return 228;
    if (x > 168) return 116;
    if (x > 116 && y < -176) return 230 - (x - 116) * 0.3;
    if (x < 30) return 100;
    return 170 - Math.min(1, Math.max(0, (y + 168) / 60)) * 68;
  };
  const laenge = (x, y) => (y > -100 ? 1.8 : x > 192 && y > -176 ? 1.4 : (x > 116 && y < -176) ? 5.4 : x > 168 ? 4 : 3.2);
  const licht = (x, y) => (y < -168 ? 0.7 : y < -140 ? 0.45 : 0.18);
  /* ---- Lauscher: lang (≈ 25 cm), breit-oval mit Spitze, nach hinten-außen gestellt, innen hell behaart ---- */
  const ohrP = [[-3.4, 0], [-5.6, -4.4], [-6.6, -10], [-6.0, -16], [-4.0, -21.4], [-0.8, -25.6], [1.6, -25.0], [4.2, -20], [5.6, -14], [5.6, -7.6], [4.2, -2.6], [2.8, 0]];
  const ohrZ = (ox, oy, w, fern) => {
    const tr = (pts) => H.tr(pts, ox, oy, w);
    const P = tr(ohrP), B = H.flaeche(P);
    let inn = H.wf(tr([[1.6, -2], [4.4, -7.6], [4.6, -14], [3.2, -19.6], [0.6, -23.4], [1.4, -16], [1.4, -8]]), fern ? "#1a120c" : "#241812", 0.85, 1) +
      fl(...tr([[-2.6, -12]])[0].slice(0, 2), 3.4, 9, w, HL, fern ? 0.05 : 0.14);
    if (!fern) inn += H.haare(tr([[1.6, -1.6], [4.6, -6], [4.6, -12], [2.6, -12], [1.8, -6]]), 30, w - 40, 3.2, [["#c8bcae", 1, 0.08, 0.6]], { streu: 20, krumm: 0.2, szene: 0 }) +
      H.haare(P, 26, w - 92, 1.4, [["#140e0a", 1, 0.09, 0.45]], { szene: 0, spitze: ["#8a7a68", 0.6, 0.08, 0.4] });
    inn += H.rim(B, 3, 0.9);
    return H.teil(B, fern ? "#2a2018" : "#3e3026", inn, { rand: false });
  };
  /* ---- Schaufel: Rose auf dem Schädel, kurze dicke Stange, dann die Hauptschaufel nach hinten-oben (Unterkante ≈ 35° über der
     Waagerechten) mit 8 stumpfen Enden am Außenrand und runden (U-)Einschnitten; vorn die kleinere Augschaufel mit 3 Enden.
     Dicke gewölbte Platte: Innenseite hell oben, dunkel in der Mulde; sichtbare Dicke an der Kante; Adernrinnen; Perlung an der Stange. ---- */
  const schaufel = (bx, by, s0, w0, fern) => {
    const P = (pts) => H.tr(pts, bx, by, w0, s0);
    const haupt = P([[-3, -12], [-12, -20], [-22, -29], [-32, -38], [-40, -46], [-46.6, -51], [-52.4, -52.6], [-49.8, -57], [-55.6, -61.4], [-50.4, -64.2], [-54.6, -71],
      [-47.6, -71.2], [-49.2, -79.4], [-42, -77.4], [-40.6, -86], [-34.6, -81], [-30.8, -89], [-26.4, -82], [-21.4, -87.4], [-18.6, -79.6], [-12.6, -81.6], [-11.4, -73.4],
      [-9.6, -62], [-8.4, -48], [-7.0, -34], [-5.0, -22]]);
    const brow = P([[-2, -10], [6, -12.4], [13.6, -15.6], [19.6, -20.6], [23.6, -26.6], [18.8, -24.6], [17.2, -31], [13.0, -25.4], [8.8, -30.2], [6.8, -23.4], [1.4, -18]]);
    const gS = fern ? "#7a6a52" : T.rg("sch", [[0, "#e2d2b2"], [0.45, "#b8a07a"], [1, "#6e5638"]], 0.7, 0.15, 0.95);
    const dicke = (Q) => F ? `<path d="${G2(Q)}" fill="${fern ? "#5a4a38" : "#4a3a26"}" transform="translate(${f(0.8 * s0)} ${f(1.0 * s0)})"/>` : "";
    const SH = H.flaeche(haupt), SB = H.flaeche(brow);
    const adern = (zuege) => F && !fern ? H.L(zuege.map((q) => P(q)), "#5a4430", 0.3, 0.55) + H.L(zuege.map((q) => P(q).map((p) => [p[0] - 0.3, p[1] - 0.3])), "#fff4e0", 0.18, 0.4) : "";
    let g = dicke(brow) + H.teil(SB, gS, (fern ? "" : fl(...P([[9, -18]])[0].slice(0, 2), 7, 4, w0, "#4a3622", 0.45) + fl(...P([[20, -24]])[0].slice(0, 2), 4, 4, 0, "#f4ead8", 0.6)) +
      adern([[[0, -13], [9, -18], [17, -26]], [[1, -15], [8, -22], [9, -28]]]) + H.rim(SB, 2.2, 0.9), { rw: 0.2, randA: 0.5 });
    g += dicke(haupt) + H.teil(SH, gS, (fern ? "" : fl(...P([[-24, -46]])[0].slice(0, 2), 14, 11, w0, "#3a2a1a", 0.5) + fl(...P([[-32, -76]])[0].slice(0, 2), 18, 6, w0, "#fff6e4", 0.5)) +
      adern([[[-6, -18], [-20, -32], [-34, -44], [-48, -54]], [[-7, -22], [-18, -40], [-30, -56], [-44, -70]], [[-8, -26], [-13, -46], [-20, -66], [-28, -82]], [[-9, -30], [-10, -54], [-12, -74]]]) +
      H.rim(SH, 3.4, 0.9), { rw: 0.2, randA: 0.5 });
    /* Lichtkante an der oberen Schaufelkante (Dicke im Licht) */
    /* kurze dicke Stange mit Perlung, Rose auf dem Schädel */
    const st = H.kette(P([[0, 0, 3.2, 3.2], [-1.6, -6, 3.0, 3.0], [-3.4, -12.6, 2.8, 2.8]])), SS = H.flaeche(st.pts);
    g += H.teil(SS, fern ? "#3a2c1e" : "#5a4430", F && !fern ? H.punkte(Array.from({ length: 18 }, () => [st.L[0][0] + (st.R[2][0] - st.L[0][0]) * T.rnd(), st.L[0][1] + (st.R[2][1] - st.L[0][1]) * T.rnd(), 0.4 + T.rnd() * 0.4]), "#2a1e12", 0.6) + H.rim(SS, 1.6, 0.9) : "", { rw: 0.2, randA: 0.5 });
    if (F) {
      const [rx, ry] = P([[0, 0.6]])[0], rose = [];
      for (let i = 0; i < 18; i++) { const a = Math.PI * 2 * i / 18, q = 1 + (i % 2 ? 0.12 : -0.05); rose.push([rx + Math.cos(a) * 4.2 * s0 * q, ry + Math.sin(a) * 1.6 * s0 * q]); }
      g += H.teil(H.flaeche(rose), fern ? "#2a1e14" : "#3a2a1a", "", { rw: 0.15, randA: 0.6 });
    }
    return g;
  };
  /* ---- Laufmodell: helle Strümpfe (weicher Übergang, innen/hinten höher), knochige Gelenke ---- */
  const strumpf = (x0, x1, yv, yh) => `<path d="M${x0} ${yv}L${x1} ${yh}L${x1} 6L${x0} 6Z" fill="${T.lg("str", [[0, "#b8ad9e", 0], [0.5, "#b8ad9e", 0.75], [1, "#c4baac", 0.92]], 0, 0, 0, 1)}"/>`;
  const laufV = (dx, k) => fl(179.4 + dx, -63.4, 2.4, 3.6, 0, "#fff", 0.24 * k) + fl(170.8 + dx, -61, 2, 3.4, 0, DK, 0.35) + fl(175.4 + dx, -20, 4.4, 4, 0, DK, 0.3) +
    wl([[[173.0 + dx, -54], [173.4 + dx, -40], [173.2 + dx, -26]]], "#fff", 0.9, 0.2 * k, 0.3) + wl([[[174.6 + dx, -54], [174.8 + dx, -28]]], DK, 1, 0.25 * k, 0.4);
  const laufH = (dx, k) => fl(41.6 + dx, -73, 2.4, 3.6, 0, "#fff", 0.24 * k) + fl(50.6 + dx, -68, 2.2, 5, 0, DK, 0.3) + fl(48.4 + dx, -20, 4.4, 4, 0, DK, 0.3) +
    wl([[[46 + dx, -62], [46.4 + dx, -44], [46.2 + dx, -26]]], "#fff", 0.9, 0.2 * k, 0.3) + wl([[[48 + dx, -62], [48.2 + dx, -28]]], DK, 1, 0.25 * k, 0.4);
  /* Geäfter: groß, tief sitzend, keilförmig */
  const after = (x, k) => H.teil(H.flaeche([[x + 1.0, -12.6], [x + 2.0, -9.6], [x - 0.6, -4.6, 1], [x - 2.8, -3.2, 1], [x - 1.8, -6.4], [x - 0.6, -10.6]]), k ? "#2e2622" : "#221c18",
    fl(x - 0.2, -9, 0.9, 1.6, 30, "#fff", 0.3 * k), { rw: 0.1, randA: 0.6 });
  let s = "";
  /* ferne Läufe (Körperton, dunkler und kühler, Strumpf grauer) */
  const fell = T.lg("fell", [[0, "#4e3c2c"], [0.16, "#3c2e22"], [0.34, "#2e2219"], [0.5, "#261c14"], [0.62, "#221912"], [1, "#221912"]], 0, -205, 0, 0, H.US);
  const fH = hinten.map((p) => [p[0] + (p[1] > -68 ? 11 : p[1] < -90 ? 2 : 2 + (p[1] + 90) / 22 * 9), p[1], p[2]]), fV = H.schieb(vorne, -11);
  let fernDet = "";
  const fernBein = (P, top, det, xs) => {
    const Q = top.concat(P), B = H.flaeche(Q);
    fernDet += B.clip(det);
    return H.teil(B, fell, `<rect x="${xs - 16}" y="-140" width="32" height="146" fill="${T.lg("fernl", [[0, "#0a0604", 0.5], [0.3, "#0a0604", 0.3], [1, "#605850", 0.35]], 0, -140, 0, 0, H.US)}"/>` +
      strumpf(xs - 16, xs + 16, -60, -74) + `<rect x="${xs - 16}" y="-80" width="32" height="86" fill="#3a3632" opacity=".35"/>` +
      H.haare(Q, 18, 93, 1.4, [["#140e0a", 1, 0.1, 0.35]], { streu: 10, spitze: ["#9a8e80", 0.5, 0.08, 0.35] }), { rand: false });
  };
  s += H.vol("bein", 2, fernBein(fH, [[38, -128], [76, -128]], laufH(fH[5][0] - 51.4, 0.6), 54) + fernBein(fV, [[148, -112], [170, -112]], laufV(-11, 0.6), 165), { tiefe: 3 }) + fernDet;
  s += after(fH[14][0] + 0.8, 0) + after(fV[13][0] + 0.8, 0);
  s += H.schale(fH[13][0] - 5.2, fH[12][0] + 3.0, 7.4, { farbe: "#2a2420", fern: "#14100e", haar: "#8a8278" }) + H.schale(fV[12][0] - 5.2, fV[11][0] + 3.0, 7.6, { farbe: "#2a2420", fern: "#14100e", haar: "#8a8278" });
  /* ferne Schaufel und kurzer Wedel (unter der Kruppenkante) */
  const schB = K(10.6, -8.4), ohrB = K(3.4, -6.6);
  s += schaufel(schB[0] + 14, schB[1] - 6, 0.7, 8, true);
  s += T.form([[23, -156], [20.4, -153], [19.6, -146], [21.0, -142], [23.4, -146]], "#241a12");
  /* ---- Körper ---- */
  let inn = "", sch = "";
  inn += H.zone("kopf", [[176, -150], [196, -186], [214, -176], [254, -132], [244, -116], [214, -112], [182, -128]], "#5a4636", 0.75, [182, -150], [198, -166]);
  inn += fl(...K(54, 6), 11, 9, KW, "#6a5848", 0.5) + fl(...K(30, 10), 12, 8, KW, "#4a3a2e", 0.3);
  inn += strumpf(160, 190, -70, -86) + strumpf(36, 76, -72, -88);
  /* Muffel: großes Nasenloch (Schlitz, schräg nach hinten-oben), Oberlippe hängt über die Unterlippe */
  inn += H.wf(KT([[66.8, 6.4], [67.8, 8.6], [66.4, 10.0], [62.8, 7.6], [59.8, 4.6], [60.6, 3.8], [63.6, 5.4]]), "#0c0807", 0.95, 0.15) + wl([KT([[66.6, 6.0], [63.4, 4.6], [60.4, 3.2]])], "#b0a090", 0.4, 0.4, 0.15);
  inn += wl([KT([[67, 18.4], [64, 20.2], [61.8, 19.6]])], "#000", 0.7, 0.5, 0.25) + wl([KT([[60.4, 20.6], [58.8, 22.2], [55.4, 22.8]])], DK, 0.9, 0.45, 0.3);
  /* Fell: lange grobe Haare, schwarzbraun mit grauen Spitzen; Mähne auf Buckel und Nacken aufgestellt */
  inn += H.fellKorn("e1", [[20, -205], [196, -205], [190, -104], [160, -96], [76, -104], [20, -140]], 168, [["kd", "#000", 0.45, 3], ["kh", "#b8a890", 0.26, 8]], { fx: 0.4, fy: 3 }) +
    H.fellKorn("e2", KT([[0, -8], [68, -6], [68, 20], [20, 28], [0, 26]]), KW + 180, [["kd", "#000", 0.35, 3], ["kh", "#c8b8a4", 0.24, 8]], { fx: 0.8, fy: 5 });
  inn += H.haare(rumpf, 150, wuchs, laenge, [["#080604", 1, 0.11, 0.38]], { krumm: 0.12, streu: 14, nur: (x, y) => !(x > 192 && y > -176) && y < -96, spitze: ["#a89880", licht, 0.1, 0.45] });
  /* Licht, Anatomie, Schlagschatten (Schaufel auf Nacken und Widerrist, Kopf auf den Träger, Glocke auf die Brust) */
  sch += wl([[[28, -172], [50, -177.6], [80, -178.6], [104, -182], [124, -190], [146, -198]]], "#d8b898", 3, 0.22, 2) +
    wl([[[80, -114], [110, -108], [140, -106.4], [160, -108]]], DK, 8, 0.36, 4) + wl([[[96, -104], [124, -101.6], [148, -101]]], "#8a7660", 1.6, 0.3, 1) +
    H.wf([[134, -196], [158, -199], [176, -180], [186, -150], [182, -120], [170, -116], [160, -150]], "#d8b898", 0.1, 5) +
    wl([[[150, -170], [156, -146], [162, -120], [166, -104]]], DK, 5, 0.22, 3) + wl([[[74, -160], [77, -140], [78, -122]]], DK, 5, 0.18, 3.4) + fl(40, -150, 14, 18, 8, HL, 0.14) +
    H.wf([[140, -199], [170, -195], [190, -180], [196, -172], [188, -170], [168, -186], [146, -192]], DK, 0.28, 3) +
    H.wf([K(24, 27.4), K(16, 28.8), [186.4, -128], [185.6, -118], [178, -120], [178, -136]], DK, 0.3, 2.4) +
    fl(...K(21, 0.6), 4.4, 3.2, KW, DK, 0.4) + fl(...K(21, -4), 5, 1.8, KW, HL, 0.25) + wl([KT([[30, -5.6], [46, -5.4], [60, -2.6]])], "#d8c4a8", 1, 0.3, 0.5) + fl(...K(58, 12), 7, 5, KW, DK, 0.2);
  const koerper = H.teil(A, fell, inn, { rand: false }) +
    H.saum(ruecken.slice(7).concat([K(0, -4)]), F ? 120 : 26, (x, y) => 236 - (x - 120) * 0.25 + (T.rnd() - 0.5) * 20, (x, y) => 3 + Math.max(0, 5 - Math.abs(x - 150) / 10),
      [["#060403", 1, 0.16, 0.7], ["#3a2c20", 0.6, 0.13, 0.55], ["#8a7a66", 0.25, 0.1, 0.5]], { offen: true, krumm: 0.2, streu: 14, szene: 0.3 }) +
    H.saum(ruecken.slice(0, 8).concat(bauch).concat(keule), 60, wuchs, (x, y) => laenge(x, y) * 0.5, [["#0e0a08", 1, 0.09, 0.5], ["#8a7a68", 0.5, 0.07, 0.4]], { offen: true, szene: 0 });
  s += H.vol("rumpf", 14, koerper, { tiefe: 3, umgebung: 0.42 }) + A.clip(sch);
  /* ---- nahe Läufe ---- */
  const laufN = (pts, xs) => {
    const B = H.flaeche(pts);
    return [B, H.teil(B, fell, `<rect x="${xs - 18}" y="-140" width="36" height="146" fill="${T.lg("nahl", [[0, "#000", 0], [0.4, "#0a0604", 0.25], [1, "#504840", 0.2]], 0, -140, 0, 0, H.US)}"/>` +
      strumpf(xs - 18, xs + 18, -60, -76) + H.haare(pts, 30, 93, 1.3, [["#140e0a", 1, 0.09, 0.32]], { streu: 10, spitze: ["#e0d8cc", 0.5, 0.08, 0.4] }), { rand: false })];
  };
  const [BV, lv] = laufN([[158, -110], [184, -110]].concat(vorne), 177), [BH, lh] = laufN([[30, -132], [76, -132]].concat(hinten), 48);
  s += `<g mask="${H.maskeY("b", -112, -100)}">` + H.vol("bein", 2, lv + lh, { tiefe: 3 }) + BV.clip(laufV(0, 1)) + BH.clip(laufH(0, 1)) + `</g>`;
  s += after(47.2, 1) + after(174.4, 1);
  s += H.schale(47.4, 61.6, 7.4, { haar: "#a8a094" }) + H.schale(174.4, 188.6, 7.6, { haar: "#a8a094" });
  /* ---- Glocke (Wamme): flacher Hautlappen, oben breit an der Kehle, unten schmaler, lange Haarquaste; Lichtkante vorn ---- */
  const wamme = [[183.4, -144.6], [188.8, -139.6], [190.8, -130], [190.4, -120], [188.6, -110], [186.4, -102], [184.2, -100], [182.6, -106], [181.6, -120], [180.6, -134]];
  const WA = H.flaeche(wamme);
  s += `<path d="${G2(wamme)}" fill="#000" opacity=".3" transform="translate(-3 2)"${F ? ` filter="${H.blur(1.3)}"` : ""}/>` +
    H.teil(WA, "#2a2018", H.haare(wamme, 40, 94, 3, [["#080604", 1, 0.12, 0.5]], { szene: 0, spitze: ["#7a6a58", 0.5, 0.1, 0.45] }) + wl([[[189.4, -128], [189.6, -118], [188.2, -108]]], "#c8b4a0", 1, 0.3, 0.5) + H.rim(WA, 2.4, 0.9), { rand: false }) +
    H.saum([[186.4, -102], [184.2, -100], [182.9, -103]], F ? 50 : 10, 94, 9, [["#080604", 1, 0.14, 0.65], ["#5a4a3a", 0.5, 0.12, 0.5]], { offen: true, krumm: 0.25, streu: 18, szene: 0.4 });
  /* ---- Lauscher unter der Schaufel (mit Schlagschatten), nahe Schaufel, Auge ---- */
  s += ohrZ(ohrB[0], ohrB[1], -38, false);
  if (F) s += `<path d="${G2([[schB[0] - 6, schB[1] - 4], [schB[0] - 26, schB[1] + 2], [schB[0] - 30, schB[1] + 12], [schB[0] - 8, schB[1] + 8]])}" fill="#000" opacity=".25" filter="${H.blur(2)}"/>`;
  s += schaufel(schB[0], schB[1], 0.82, 2, false);
  const au = K(21, 0.6);
  s += H.auge(au[0], au[1], 1.9, { iris: "#24140a", iris2: "#4a2a14", offen: 0.66, winkel: KW - 16, wimpern: 7, wimpernLaenge: 0.6, hoehle: "#140c08" });
  if (F) s += T.schnurrhaare(...K(66, 16), 7, 4.6, KW + 40, 50, "#1a140e", 0.08);
  return { svg: s, box: [19.6, -242.7, 241.4, 0], fuesse: [55, 67, 170, 182], kopf: [140, -246, 244, -100] };
}

/* =====================================================================
   WISENT (Bulle)
   ===================================================================== */
/* RECHERCHE Wisent (Bison bonasus), Bulle:
   Schulterhöhe bis ~190–200 cm, Kopf-Rumpf 290–330 cm, Schwanz 50–80 cm mit Endquaste, 600–1000 kg; schwerstes
   Landsäugetier Europas. Hoher Widerrist (lange Dornfortsätze der Brustwirbel) – im Profil zwei flache Höcker,
   Rückenlinie fällt elegant zur schmalen Kruppe; höherbeiniger und leichter gebaut als der Amerikanische Bison, Kopf etwas
   höher getragen. Dichtes, dunkelbraunes Fell, an Kopf, Hals, Brust und Vorderkörper lang und wollig (Mähne), Stirn mit
   Haarlocke, Kinnbart. Kurze, schwarze, nach oben-vorn und innen gebogene Hörner bei beiden Geschlechtern. Kleine Augen,
   kleine Ohren im Haar verborgen, breiter Nasenspiegel dunkel. Hinterhand kurzhaarig. Breite, runde Rinderklauen. */
function wisent(T) {
  const H = kit(T, [-20, -230, 320, 6], 1, 5), { fl, wl, L, F, f } = H, G2 = H.G;
  H.minFl = 10;
  const DK = "#0a0604", HL = "#e8c090";
  /* Rumpf um 18 % gestreckt (Bulle: Länge ≈ 1,4 × Höhe), Läufe dadurch kräftiger */
  const SX = (pts) => pts.map((p) => [14 + (p[0] - 14) * 1.18, p[1], p[2]]);
  /* ---- Haupt: breit, wollig, tief getragen; gerader Nasenrücken, nacktes, feuchtes Flotzmaul ---- */
  const KX = 244, KY = -158, KW = 60, KS = 1.05;
  const K = H.pt(KX, KY, KW, KS), KT = (pts) => H.tr(pts, KX, KY, KW, KS);
  const kopf = KT([[-4, -10], [4, -14], [12, -15.6], [20, -15.2], [28, -13.8], [36, -12.2], [44, -10.6], [50, -8.6], [54, -5], [55.8, 0.6], [55.2, 6.4], [53.2, 10.4], [49.6, 12.6],
    [44, 14.2], [36, 17.2], [28, 21.2], [20, 25.6], [14, 28.6]]);
  const vorne = SX([[186, -84], [185, -72], [184.6, -60], [185.2, -54], [184.2, -48], [183.6, -34], [183.8, -20], [185.6, -12], [188.4, -7], [188.6, -3],
    [181.4, -2.6], [178.6, -5.4], [176.6, -10], [175.4, -18], [176, -28], [176.2, -40], [175.6, -48], [173.8, -53], [174.6, -60], [173.6, -70], [171, -80], [167, -86]]);
  const hinten = SX([[72, -104], [69, -96], [64, -86], [58, -76], [54.4, -68], [53.4, -60], [52.8, -46], [52.8, -30], [53.4, -20], [55.8, -12], [58.6, -7], [58.8, -3],
    [51.6, -2.6], [49, -5.4], [47, -10], [45.8, -18], [46.4, -30], [46.6, -44], [46, -54], [44.4, -58], [41.6, -62.6, 1], [42.6, -67], [42, -76], [40, -88], [36.4, -100], [31, -112]]);
  /* hoher Widerrist (zwei flache Höcker), Rücken fällt elegant zur schmalen, gerundeten Kruppe */
  const ruecken = SX([[16, -136], [20, -144], [28, -150.4], [40, -153.6], [56, -154.6], [74, -155.4], [94, -158.6], [112, -165], [126, -174], [138, -183], [150, -189.4], [160, -191.4],
    [170, -190], [180, -186.4], [190, -180.4], [198, -173.4], [205, -165.6]]);
  const kehle = [[225.2, -122], [225.6, -112], [224.6, -102], [222.8, -92], [219.6, -85.6]];
  const bauch = SX([[158, -86.6], [140, -85.4], [120, -87.2], [100, -90.2], [84, -94.4], [74, -99]]);
  const keule = SX([[25, -122], [19.6, -129], [16.6, -132.6]]);
  const rumpf = ruecken.concat(kopf).concat(kehle).concat(vorne).concat(bauch).concat(hinten).concat(keule);
  const A = H.flaeche(rumpf);
  const vorn = (x, y) => x > 150 - (y + 90) * 0.35;
  const wuchs = (x, y) => {
    if (y > -88 || (x > 196 && x < 222 && y > -92) || (x < 80 && x > 50 && y > -110)) return 94;
    if (x > 214 && y > -180 && y < -96) return 230;
    if (vorn(x, y)) return 100 + (T.rnd() - 0.5) * 60;
    return 168 - Math.min(1, Math.max(0, (y + 150) / 56)) * 66;
  };
  const laenge = (x, y) => (y > -88 ? (x > 190 && y > -84 && y < -50 ? 4 : 1.6) : x > 214 && y > -180 && y < -96 ? 2.6 : vorn(x, y) ? 6 : 2.2);
  const licht = (x, y) => (y < -160 ? 0.7 : y < -130 ? 0.45 : 0.18);
  /* ---- Horn: entspringt seitlich am Schädel über und hinter dem Auge, kurzer dicker Bogen nach oben-vorn; Basis grauschwarz mit
     Ringwülsten, Spitze glatt, schwarz, schmaler Glanz ---- */
  const horn = (bx, by, s0, fern) => {
    const P = (pts) => pts.map((p) => [bx + p[0] * s0, by + p[1] * s0, p[2] * s0, p[3] * s0]);
    const k = H.kette(P([[0, 1, 3.4, 3.4], [-1.2, -3, 3.0, 3.0], [-1.0, -8, 2.5, 2.4], [0.8, -12.4, 1.8, 1.7], [3.6, -15.6, 1.0, 1.0], [6.6, -17.0, 0.2, 0.2]]));
    const B = H.flaeche(k.pts);
    const ringe = F && !fern ? H.L([0.25, 0.55, 0.85, 1.2, 1.5].map((t) => { const j = Math.floor(t), u = t - j, a = k.L[j], b = k.L[j + 1], c = k.R[j], d = k.R[j + 1];
      return [[a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], [c[0] + (d[0] - c[0]) * u, c[1] + (d[1] - c[1]) * u + 0.6 * s0]]; }), "#0a0806", 0.45, 0.6) : "";
    return H.teil(B, fern ? "#161210" : T.lg("hn", [[0, "#5e544a"], [0.45, "#2a2420"], [1, "#0c0a08"]], 0, 1, 0, 0),
      ringe + (fern ? "" : H.L([k.L.slice(2, 5).map((p, i) => [p[0] * 0.6 + k.R[i + 2][0] * 0.4, p[1] * 0.6 + k.R[i + 2][1] * 0.4])], "#fff", 0.5, 0.45)) + H.rim(B, 1.6, 0.9), { rw: 0.12, randA: 0.6 });
  };
  /* ---- Laufmodell: knochige, flache Gelenke (ohne Glanzkugeln) ---- */
  const xv = (x) => 14 + (x - 14) * 1.18;
  const laufV = (dx, k) => fl(xv(185) + dx, -54, 2.8, 3.6, 0, HL, 0.2 * k) + fl(xv(174.4) + dx, -53, 2, 3.4, 0, DK, 0.35) + fl(xv(181) + dx, -12, 5, 4, 0, DK, 0.35) +
    wl([[[xv(177) + dx, -44], [xv(177.2) + dx, -30], [xv(177) + dx, -18]]], "#c8a888", 0.9, 0.18 * k, 0.4);
  const laufH = (dx, k) => fl(xv(42.4) + dx, -62, 2.6, 3.6, 0, HL, 0.2 * k) + fl(xv(52) + dx, -58, 2, 4.4, 0, DK, 0.3) + fl(xv(54) + dx, -12, 5, 4, 0, DK, 0.35) +
    wl([[[xv(48) + dx, -50], [xv(48.2) + dx, -34], [xv(48) + dx, -18]]], "#c8a888", 0.9, 0.18 * k, 0.4);
  /* Rinderklauen: breit, rundlich-stumpf; Geäfter klein und rund */
  const after = (x, k) => `<ellipse cx="${f(x)}" cy="-11" rx="1.3" ry="1.7" fill="${k ? "#2a2420" : "#1a1614"}" transform="rotate(30 ${f(x)} -11)"/>`;
  let s = "";
  const fell = T.lg("fell", [[0, "#6a4a2c"], [0.18, "#5a3e24"], [0.34, "#4a321c"], [0.5, "#3a2816"], [0.66, "#2e2012"], [0.82, "#26190f"], [1, "#1e140c"]], 0, -195, 0, 0, H.US);
  /* ---- ferne Läufe ---- */
  const fH = hinten.map((p) => [p[0] + (p[1] > -58 ? 12 : p[1] < -80 ? 2 : 2 + (p[1] + 80) / 22 * 10), p[1], p[2]]), fV = H.schieb(vorne, -12);
  let fernDet = "";
  const fernBein = (P, top, det) => {
    const Q = top.concat(P), B = H.flaeche(Q);
    fernDet += B.clip(det);
    return H.teil(B, fell, `<rect x="${P[0][0] - 24}" y="-120" width="48" height="126" fill="${T.lg("fernl", [[0, "#0a0604", 0.6], [0.3, "#140c08", 0.45], [1, "#2a2420", 0.4]], 0, -120, 0, 0, H.US)}"/>` +
      H.haare(Q, 22, 94, 2, [["#060403", 1, 0.12, 0.4]], { streu: 14, spitze: ["#7a6450", 0.5, 0.1, 0.35] }), { rand: false });
  };
  s += H.vol("bein", 2.2, fernBein(fH, [[xv(40), -116], [xv(80), -116]], laufH(12, 0.6)) + fernBein(fV, [[xv(150), -96], [xv(176), -96]], laufV(-12, 0.6)), { tiefe: 3 }) + fernDet;
  s += after(fH[13][0] - 0.6, 0) + after(fV[11][0] - 0.6, 0);
  s += H.schale(fH[12][0] - 3.6, fH[11][0] + 3.4, 7.2, { farbe: "#221c18", fern: "#100c0a", stumpf: true }) + H.schale(fV[10][0] - 3.6, fV[9][0] + 3.4, 7.4, { farbe: "#221c18", fern: "#100c0a", stumpf: true });
  /* fernes Horn (zu 60 % verdeckt, nur die Spitze sichtbar) */
  const hB = K(6, -12.6);
  s += horn(hB[0] + 2.4, hB[1] - 0.6, 0.92, true);
  /* Wedel: setzt tiefer an der Kruppenrundung an, Basis dick und behaart, lange dichte Quaste endet über dem Sprunggelenk */
  const sw = H.kette([[22, -126, 2.4, 2.4], [17.4, -116, 1.9, 1.9], [14.6, -104, 1.5, 1.5], [13.6, -94, 1.2, 1.2], [13.8, -84, 1.1, 1.1]]);
  const SW = H.flaeche(sw.pts);
  s += H.teil(SW, "#2e2014", H.haare(sw.pts, 26, 100, 2, [["#0e0806", 1, 0.1, 0.5]], { szene: 0, spitze: ["#8a6a4a", 0.5, 0.08, 0.4] }) + H.rim(SW, 1.6, 0.8), { rand: false }) +
    H.saum([[13.6, -92], [13.8, -82]], F ? 60 : 12, 95, 13, [["#0a0604", 1, 0.14, 0.7], ["#4a3424", 0.5, 0.12, 0.55]], { offen: true, krumm: 0.25, streu: 16, szene: 0.4 });
  /* ---- Körper ---- */
  let inn = "", sch = "";
  /* zwei Fellzonen: Vorderkörper langes, krauses, helleres gelbbraunes Haar (weiche Grenze schräg hinter der Schulter), Hinterkörper kurz und dunkler */
  inn += `<path d="${G2([[110, -170], [150, -206], [220, -200], [290, -170], [290, -70], [214, -60], [160, -80], [120, -120]])}" fill="${T.rg("vz", [[0, "#8a6238", 0.72], [0.5, "#8a6238", 0.6], [0.8, "#8a6238", 0.2], [1, "#8a6238", 0]], 0.72, 0.42, 0.62)}"/>`;
  inn += fl(...K(20, 6), 16, 13, KW, "#7a5a3a", 0.35) + fl(...K(46, 2), 8, 9, KW, "#2a1e16", 0.55) +
    H.fellKorn("x2", KT([[-6, -16], [46, -12], [48, 14], [10, 32], [-6, 30]]), KW, [["kd", "#000", 0.5, 3], ["kh", "#e0b888", 0.35, 8]], { fx: 1.4, fy: 2, okt: 2 });
  /* Flotzmaul: nackt, dunkelgrau-schwarz, feucht glänzend; großes kommaförmiges Nasenloch */
  inn += T.form(KT([[48, -9.4], [53.6, -5.4], [55.8, 0.6], [55.2, 6.4], [53.2, 10.4], [49.8, 12.2], [47.6, 9], [47, 2], [46.8, -4]]), "#1c1816") +
    fl(...K(52.6, -3.4), 2, 1.2, KW, "#fff", 0.4) + fl(...K(54.4, 3), 0.8, 2.4, KW, "#fff", 0.2) +
    H.wf(KT([[51.4, -2.4], [53.8, -0.4], [53.4, 3.4], [51.8, 4.2], [51.0, 1.4], [49.6, 3.2], [50.2, 0]]), "#000", 0.95, 0.15);
  inn += wl([KT([[49.4, 12.4], [46, 13.4], [42, 14]])], "#000", 0.7, 0.5, 0.2);
  inn += H.fellKorn("x1", [[14, -200], [236, -200], [232, -84], [76, -96], [14, -140]], 168, [["kd", "#000", 0.4, 3], ["kh", "#d8b080", 0.24, 8]], { fx: 0.4, fy: 3 });
  /* Haar: Hinterkörper kurz und glatt nach hinten-unten; Vorderkörper lang, gelockt, in Büscheln; Kopfhaar kraus */
  inn += H.haare(rumpf, 90, wuchs, laenge, [["#140c06", 1, 0.1, 0.36]], { krumm: 0.1, streu: 12, nur: (x, y) => !vorn(x, y) && y < -88, spitze: ["#a08060", licht, 0.08, 0.4] });
  inn += H.haare(rumpf, 260, wuchs, laenge, [["#140c06", 1, 0.16, 0.42], ["#7a5a3a", 0.7, 0.14, 0.38], ["#c09a6a", 0.3, 0.12, 0.36]], { krumm: 0.45, streu: 40, nur: (x, y) => vorn(x, y) && x < 214 && y < -86 });
  inn += H.haare(KT([[-4, -12], [44, -9], [46, 12], [20, 26], [0, 28]]), 150, (x, y) => KW + 180 + (T.rnd() - 0.5) * 140, 2.4, [["#120a06", 1, 0.12, 0.5], ["#6a4a30", 0.6, 0.1, 0.45], ["#a88058", 0.3, 0.09, 0.4]], { krumm: 0.5, streu: 60 });
  /* Licht und Plastizität: Buckel und Rücken hell, Seite Halbton, Kernschatten unten, Reflex am Bauch; Stirn im Licht, Backe und
     Bart im Schatten; Kopf und Bart werfen Schatten auf Brust und Vorderlauf */
  sch += wl([SX([[30, -150], [56, -153], [94, -156.6], [126, -172], [150, -187.6], [170, -188], [190, -178.6]])], "#ffd8a8", 4, 0.2, 2.4) +
    wl([SX([[76, -104], [110, -96], [140, -94], [160, -96]])], DK, 9, 0.38, 5) + wl([SX([[90, -91], [120, -88.6], [150, -88]])], "#8a6a4c", 1.6, 0.3, 1) +
    fl(xv(38), -128, 16, 18, 0, HL, 0.14) + wl([SX([[74, -150], [77, -130], [78, -110]])], DK, 5, 0.18, 3.6) +
    fl(...K(14, -8), 12, 6, KW, HL, 0.3) + fl(...K(26, 18), 12, 7, KW, DK, 0.3) + H.wf([[204, -120], [224, -124], [228, -84], [214, -70], [196, -80]], DK, 0.3, 3);
  const koerper = H.teil(A, fell, inn, { rand: false }) +
    /* Buckelhaar: Locken und Strähnen vom Nacken bis zum Widerrist */
    H.saum(ruecken.slice(8).concat(KT([[-4, -10], [4, -14], [12, -15.6]])), F ? 170 : 34, (x, y) => 220 + (T.rnd() - 0.5) * 60, (x, y) => 4 + Math.max(0, 4 - Math.abs(x - 195) / 14),
      [["#120a06", 1, 0.2, 0.62], ["#6a4a2e", 0.6, 0.17, 0.52], ["#b08a5a", 0.3, 0.14, 0.45]], { offen: true, krumm: 0.45, streu: 30, szene: 0.3 }) +
    /* Stirnschopf: lockige Haarmasse über der Stirn und zwischen den Hörnern, Kontur gebrochen */
    `<path d="${G2(KT([[-8, -10], [-4, -17], [4, -21], [12, -21.4], [20, -19], [24, -14], [20, -9.6], [12, -10], [4, -8], [-4, -6]]))}" fill="#6a4a2c"/>` +
    H.haare(KT([[-8, -10], [-4, -17], [4, -21], [12, -21.4], [20, -19], [24, -14], [20, -9.6], [12, -10], [4, -8], [-4, -6]]), F ? 90 : 0, (x, y) => T.rnd() * 360, 1.8,
      [["#1a0e06", 1, 0.16, 0.55], ["#a07a4c", 0.7, 0.14, 0.5]], { krumm: 0.6, streu: 0, szene: 0 }) +
    H.saum(KT([[-4, -17], [4, -21], [12, -21.4], [20, -19], [24, -14]]), F ? 70 : 14, (x, y) => 250 + (T.rnd() - 0.5) * 90, 3.2, [["#140c06", 1, 0.2, 0.62], ["#8a643c", 0.6, 0.16, 0.55]], { offen: true, krumm: 0.6, streu: 40, szene: 0.3 }) +
    H.saum(ruecken.slice(0, 9).concat(bauch).concat(keule), 40, wuchs, (x, y) => laenge(x, y) * 0.5, [["#1a1008", 1, 0.09, 0.5]], { offen: true, szene: 0 });
  s += H.vol("rumpf", 14, koerper, { tiefe: 3, umgebung: 0.42 }) + A.clip(sch);
  /* ---- Kinnbart und Kehl-/Brustmähne: lange Strähnen bis zur Brust; Behang an der Vorderseite der Vorderläufe bis zum Ellbogen ---- */
  const bart = KT([[46, 10.4], [38, 13.2], [28, 17.6], [16, 23.6], [6, 27]]).concat([[225.4, -124], [226, -106], [223.6, -96], [219, -104]]).concat(KT([[18, 36], [30, 30], [40, 22], [47, 15]]));
  const BA = H.flaeche(bart);
  s += H.teil(BA, T.lg("bart", [[0, "#4a321e"], [1, "#1e140c"]], 0, 0, 0, 1), H.fellKorn("x3", bart, 96, [["kd", "#000", 0.5, 3], ["kh", "#a07a50", 0.35, 8]], { fx: 0.3, fy: 2 }) +
    H.haare(bart, 120, 96, 5, [["#0a0604", 1, 0.2, 0.5], ["#7a5a38", 0.6, 0.16, 0.45]], { krumm: 0.35, streu: 24, szene: 0 }), { rand: false });
  s += H.saum(KT([[42, 21.4], [32, 28], [22, 33.6], [16, 36]]).concat([[219, -104], [223.6, -96], [222.8, -90]]), F ? 120 : 26, 94, 11, [["#0a0604", 1, 0.2, 0.65], ["#4a3220", 0.6, 0.16, 0.55]],
    { offen: true, krumm: 0.35, streu: 22, szene: 0.3 });
  s += H.saum(SX([[167, -86], [171, -80], [173.6, -70], [174.6, -60]]), F ? 60 : 12, 102, 8, [["#0a0604", 1, 0.17, 0.6], ["#5a3c24", 0.6, 0.14, 0.5]], { offen: true, krumm: 0.3, streu: 24, szene: 0.3 });
  /* ---- nahe Läufe ---- */
  const laufN = (pts) => {
    const B = H.flaeche(pts);
    return [B, H.teil(B, fell, `<rect x="0" y="-120" width="260" height="126" fill="${T.lg("nahl", [[0, "#000", 0], [0.35, "#140c08", 0.35], [1, "#140c08", 0.5]], 0, -120, 0, 0, H.US)}"/>` +
      H.haare(pts, 34, 94, 1.8, [["#0a0604", 1, 0.12, 0.36]], { streu: 12, spitze: ["#9a7a5a", 0.5, 0.1, 0.4] }), { rand: false })];
  };
  const [BV, lv] = laufN([[xv(158), -94], [xv(186), -94]].concat(vorne)), [BH, lh] = laufN([[xv(30), -120], [xv(76), -120]].concat(hinten));
  s += `<g mask="${H.maskeY("b", -100, -86)}">` + H.vol("bein", 2.2, lv + lh, { tiefe: 3 }) + BV.clip(laufV(0, 1)) + BH.clip(laufH(0, 1)) + `</g>`;
  /* Behang über dem nahen Vorderlauf */
  s += H.saum(SX([[186, -84], [185, -72], [184.8, -62]]), F ? 50 : 10, 98, 7, [["#0a0604", 1, 0.17, 0.6], ["#6a4a2e", 0.6, 0.14, 0.5]], { offen: true, krumm: 0.3, streu: 24, szene: 0.3 });
  s += after(hinten[13][0] - 0.6, 1) + after(vorne[11][0] - 0.6, 1);
  s += H.schale(hinten[12][0] - 3.6, hinten[11][0] + 3.4, 7.2, { stumpf: true, haar: "#2a1e14" }) + H.schale(vorne[10][0] - 3.6, vorne[9][0] + 3.4, 7.4, { stumpf: true, haar: "#2a1e14" });
  /* ---- Ohr: klein, fast im Haar versteckt, seitlich unter und hinter dem Horn ---- */
  s += fl(...K(0, -3), 3.4, 2.4, KW, "#0a0604", 0.8) + H.saum([K(-2, -5), K(1, -6), K(3, -4)], F ? 20 : 4, KW + 150, 2.6, [["#4a3220", 1, 0.12, 0.6]], { offen: true, streu: 40, szene: 0.3 });
  /* ---- nahes Horn, Auge (klein, dunkelbraun, dicke Lidränder, tief in der Haarmasse) ---- */
  s += horn(hB[0], hB[1], 1, false);
  const au = K(18, -1.6);
  s += H.auge(au[0], au[1], 1.5, { iris: "#24140a", iris2: "#4a2a14", offen: 0.6, winkel: KW - 30, wimpern: 6, wimpernLaenge: 0.6, hoehle: "#0a0604", braue: "#c8a070" });
  return { svg: s, box: [8.3, -198.9, 264.5, 0], fuesse: [xv(52), xv(66), xv(178), xv(190)], kopf: [196, -200, 268, -76] };
}

/* =====================================================================
   DACHS
   ===================================================================== */
/* RECHERCHE Dachs (Meles meles):
   Kopf-Rumpf 60–90 cm, Schwanz 12–24 cm, Schulterhöhe 25–30 cm, 10–16 kg. Keilförmiger, niedriger, breiter Körper,
   kurzer Hals, kleiner spitzer Kopf; kurze kräftige Beine, Sohlengänger, an den Vorderpfoten lange, gebogene Grabkrallen
   (hinten kürzer). Kopf weiß mit zwei schwarzen Streifen von der Schnauze über Augen und Ohren bis in den Nacken;
   kleine runde Ohren mit weißem Saum; Nasenspiegel schwarz, rüsselartige Schnauze. Rücken und Flanken grau „meliert“
   (Haare hell an Wurzel und Spitze, dunkel in der Mitte, rau, borstig, lang), Beine, Brust, Kehle und Bauch schwarz.
   Schwanz kurz, buschig, grauweiß. */
function dachs(T) {
  const H = kit(T, [-10, -50, 110, 4]), { fl, wl, L, F, f } = H, G2 = H.G;
  H.minFl = 2.6;
  const DK = "#0a0908";
  /* ---- Kopf: kurz, schmal, keilförmig; dicke, runde, leicht abwärts geneigte Rüsselnase ---- */
  const KX = 61, KY = -23.4, KW = 18, KS = 0.74;
  const K = H.pt(KX, KY, KW, KS), KT = (pts) => H.tr(pts, KX, KY, KW, KS);
  const kopf = KT([[-1, -2.6], [3, -3.8], [8, -3.6], [13, -2.4], [17.4, -0.8], [20.6, 0.4], [22.4, 2.0], [23.2, 3.8], [22.8, 5.6], [21.0, 6.6], [18.4, 7.2], [15, 8.4], [10, 9.8],
    [5, 11.0], [1, 11.6]]);
  /* ---- Keilform: höchster Punkt über der Hüfte, Bauch tief (Bodenabstand ≈ 27 % der Höhe); Sohlengänger mit kurzen, kräftigen Läufen ---- */
  const ruecken = [[13.4, -19.6], [16, -24.2], [21, -28.2], [28, -30.2], [35, -30.2], [42, -29.2], [49, -27.6], [55, -25.8], [59.4, -24.4]];
  const vorne = [[61.4, -11.6], [62.4, -8.6], [62.6, -5], [63.0, -2.8], [64.6, -2.3], [66.2, -1.6], [66.8, -0.6], [66.6, 0], [58.8, 0], [57.8, -1.2], [57.4, -4], [57.0, -8.2]];
  const bauch = [[52, -8.4], [44, -8.0], [36, -8.6], [31.8, -9.8]];
  const hinten = [[31.4, -6.4], [31.8, -2.8], [32.4, -1.8], [33.2, -0.8], [33.0, 0], [23.2, 0], [22.4, -1.2], [22.6, -3.6], [20.6, -7.2], [17.4, -10.8], [14.6, -14.6]];
  const rumpf = ruecken.concat(kopf).concat(vorne).concat(bauch).concat(hinten);
  const A = H.flaeche(rumpf);
  const wuchs = (x, y) => (x > 59 && y < -12 ? 196 : y > -9 ? 96 : x < 22 ? 110 : 172 - Math.min(1, Math.max(0, (y + 26) / 16)) * 46);
  const laenge = (x, y) => (x > 59 && y < -12 ? 0.3 : y > -9 ? 0.45 : 0.75 + Math.max(0, (y + 18) / 10) * 0.6);
  const licht = (x, y) => (y < -24 ? 0.8 : y < -18 ? 0.5 : 0.15);
  let s = "";
  /* ---- Grabkrallen: lang, an der Basis dick, leicht gebogen, nach vorn; hornfarben mit dunkler Basis und schmalem Glanz ---- */
  const krallen = (x0, n, Lk, fern) => {
    let o = "";
    for (let i = 0; i < n; i++) {
      const x = x0 - i * 0.55, y = -0.5 - (i % 2) * 0.12, l = Lk * (1 - Math.abs(i - 1.5) * 0.12);
      const k = H.kette([[x, y - 0.1, 0.2, 0.18], [x + l * 0.45, y - 0.12, 0.15, 0.13], [x + l * 0.8, y + 0.08, 0.08, 0.07], [x + l, y + 0.42, 0.02, 0.02]]);
      o += `<path d="${G2(k.pts)}" fill="${fern ? "#6a6050" : T.lg("kr", [[0, "#3a3028"], [0.35, "#a89a7e"], [1, "#d8ccb0"]], 0, 0, 1, 0)}"${fern ? ' opacity=".8"' : ""}/>`;
      if (F && !fern) o += `<path d="${G2(k.L.slice(0, 3), false)}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width=".05"/>`;
    }
    return o;
  };
  /* ferne Läufe: 15 % heller und grauer, teilweise verdeckt */
  const fernBein = (P) => { const B = H.flaeche(P); return H.teil(B, "#2a2826", H.haare(P, 24, 96, 0.5, [["#5a5650", 1, 0.04, 0.4]], { streu: 16 }) + H.rim(B, 1.2, 0.8), { rand: false }); };
  s += H.vol("bein", 0.8, fernBein([[53, -12], [58, -12], [58.2, -5], [58.6, -2.8], [60.2, -2.2], [62, -1.4], [62.4, 0], [55, 0], [54, -1.4], [53.6, -6]]) +
    fernBein([[30, -14], [35.4, -14], [35.6, -6.4], [36, -2.6], [37.2, -1.4], [37.6, 0], [28.6, 0], [28, -2.4], [28.4, -7]]), { tiefe: 3 });
  s += krallen(61.6, 4, 2.2, true) + krallen(37.0, 4, 1.1, true);
  /* ---- Schwanz: deutlich vom Rumpf abgesetzt (Einziehung), nach hinten-unten getragen; dichtes, hellgrau-weißliches Haar ---- */
  const sw = [[15.4, -21.8], [11.4, -22.2], [7.4, -20.4], [3.8, -17.2], [2.6, -14.6], [4.6, -13.8], [8.2, -15.2], [11.8, -16.2], [14.4, -16.6]];
  const SW = H.flaeche(sw);
  s += H.vol("schw", 1, H.teil(SW, "#a8a296", H.haare(sw, 60, 160, 1.0, [["#3a3632", 1, 0.045, 0.45]], { streu: 20, szene: 0.2, spitze: ["#f2eee6", 0.8, 0.04, 0.55] }), { rand: false }) +
    H.saum(sw.slice(1, 7), F ? 46 : 8, (x, y) => 160 + (y + 18) * 6, 0.9, [["#4a4640", 1, 0.045, 0.6], ["#f2eee6", 1, 0.04, 0.6]], { offen: true, streu: 26, szene: 0.3 }), { tiefe: 3 });
  /* ---- Körper ---- */
  const fell = T.lg("fell", [[0, "#bcb6aa"], [0.3, "#a29c90"], [0.5, "#86807a"], [0.66, "#4a4642"], [0.8, "#1e1c1a"], [1, "#141210"]], 0, -31, 0, 0, H.US);
  let inn = "", sch = "";
  /* Kopfzeichnung: weißer Kopf; schwarzer Streifen beginnt knapp hinter der Nase, wird zum Ohr breiter und umschließt es;
     Kinn, Unterkiefer und Kehle schwarzbraun; weiße Wange geht hinten weich ins Grau des Halses über */
  inn += H.wf(KT([[-3, -6], [21, -1], [24, 4], [21, 7], [12, 9.4], [0, 11], [-3, 10]]), "#ece8e0", 1, 0.5);
  inn += fl(...K(-3, 5), 3.4, 6, KW, "#9a968c", 0.8);
  inn += H.wf(KT([[20.4, 1.6], [16, 0.0], [10, -1.0], [4, -1.8], [0, -2.6], [-3.4, -2.8], [-4.6, 1.0], [-3.4, 4.6], [0, 5.0], [4, 4.6], [10, 3.6], [16, 2.6]]), "#141210", 1, 0.35);
  inn += H.wf(KT([[21.6, 6.4], [16, 7.6], [10, 8.8], [4, 9.6], [-1, 10.0], [-3, 13], [-3, 18], [24, 16]]), "#181614", 1, 0.4);
  /* Nase: breit, schwarz, seitliche Nasenlöcher, feuchter Glanz; Maulspalte */
  inn += T.form(KT([[19.8, 0.2], [21.6, 1.0], [22.9, 2.6], [23.4, 4.2], [22.8, 5.8], [21.0, 6.5], [20.0, 4.4]]), "#0c0b0a") + fl(...K(21.6, 1.8), 0.7, 0.35, KW, "#fff", 0.55) +
    L([KT([[22.8, 3.6], [22.0, 4.2]])], "#000", 0.25, 0.8) + L([KT([[20.6, 6.6], [17.6, 7.4], [14.6, 8.2]])], "#000", 0.12, 0.6);
  /* Fell: grauer Grundton, dreifarbige Grannen → silbergrau gesprenkelt; kurze dunkle Haarsegmente mit hellgrauen Spitzen */
  inn += H.fellKorn("d1", [[10, -32], [60, -32], [62, -12], [10, -12]], 172, [["kd", "#1a1816", 0.6, 3], ["kh", "#f4f0e8", 0.5, 8]], { fx: 1.4, fy: 9 });
  inn += H.haare(rumpf, 560, wuchs, laenge, [["#1a1816", 1, 0.045, 0.5], ["#3a3632", 0.6, 0.045, 0.45]], { krumm: 0.08, streu: 12, nur: (x, y) => !(x > 59 && y < -12), spitze: ["#f2eee6", licht, 0.04, 0.55] });
  inn += H.haare(KT([[-2, -3.6], [20, 0], [21, 6], [6, 10.6], [-2, 11]]), 120, KW + 180, 0.3, [["#9a968e", 1, 0.025, 0.5], ["#1a1816", 0.4, 0.025, 0.45]], { streu: 14, szene: 0 });
  /* Licht: Silberglanz auf dem Rücken, Seite im Halbton, untere Flanke ins Schwarz; Keule und Schulter als runde Massen;
     Schatten unter dem Unterkiefer und vom Kopf auf die Schulter */
  sch += wl([[[14, -24], [22, -28.8], [32, -30], [44, -28.6], [54, -26]]], "#fff", 1.6, 0.3, 0.8) + fl(25, -22, 7, 6, 0, "#fff", 0.16) + fl(52, -19, 6, 6, 0, "#fff", 0.12) +
    wl([[[36, -16], [33.6, -12.6], [32.6, -10]]], DK, 1.2, 0.3, 0.6) + H.wf([K(10, 9.8), K(1, 11.6), [61.4, -11.6], [58, -12], [56, -16]], DK, 0.4, 0.8);
  const koerper = H.teil(A, fell, inn, { rand: false }) +
    H.saum(ruecken, F ? 110 : 20, wuchs, 0.45, [["#2a2622", 1, 0.045, 0.6], ["#f2eee6", 0.8, 0.04, 0.6]], { offen: true, krumm: 0.15, streu: 18, szene: 0.25 }) +
    H.saum(bauch.concat([[31.8, -9.8]]), F ? 50 : 10, 96, 0.4, [["#121010", 1, 0.05, 0.7]], { offen: true, krumm: 0.2, streu: 20, szene: 0.25 });
  s += H.vol("rumpf", 3, koerper, { tiefe: 3, umgebung: 0.4 }) + A.clip(sch);
  /* ---- Ohr: klein, rund, flach anliegend, im schwarzen Streifen, weißer Haarsaum ---- */
  const oh = KT([[-0.6, -1.0], [-1.6, -2.2], [-1.0, -3.4], [0.8, -3.6], [2.0, -2.6], [1.6, -1.2]]), OH = H.flaeche(oh);
  s += H.teil(OH, "#1a1816", fl(...K(0.4, -2.0), 0.9, 0.8, KW, "#000", 0.6), { rand: false }) +
    H.saum(KT([[-1.6, -2.2], [-1.0, -3.4], [0.8, -3.6], [2.0, -2.6]]), F ? 34 : 6, KW + 260, 0.35, [["#f4f2ec", 1, 0.035, 0.85]], { offen: true, streu: 40, szene: 0.3 });
  /* ---- Pfoten (nah): breite Sohle, Zehenwölbungen, Grabkrallen vorn lang, hinten kurz ---- */
  const zehen = (x0, n) => F ? H.L(Array.from({ length: n - 1 }, (_, i) => [[x0 - i * 0.9, -1.8], [x0 - i * 0.9 - 0.3, -0.4]]), "#000", 0.08, 0.6) : "";
  s += zehen(66, 5) + zehen(32.6, 5) + krallen(66.0, 5, 2.6, false) + krallen(32.4, 5, 1.3, false);
  /* Auge: klein, dunkel, im schwarzen Streifen fast verschwindend: Glanzpunkt und feiner Lidrand */
  const au = K(12.6, 1.4);
  s += H.auge(au[0], au[1], 0.5, { iris: "#1a0c06", iris2: "#3a2010", pupille: "rund", offen: 0.8, winkel: KW, hoehle: false, lid: "#050404" });
  if (F) s += T.schnurrhaare(...K(20.6, 4.6), 5, 2.2, KW + 10, 40, "#e8e4dc", 0.03);
  return { svg: s, box: [2.5, -30.4, 76.2, 0], fuesse: [27, 34, 59, 64], kopf: [54, -32, 78, -6] };
}

/* =====================================================================
   BIBER
   ===================================================================== */
/* RECHERCHE Biber (Castor fiber, Europäischer Biber):
   Kopf-Rumpf 75–100 cm, Kelle (Schwanz) 28–38 cm lang, ~12–15 cm breit, 18–30 kg; größtes Nagetier Europas. An Land
   gedrungen mit stark gewölbtem Rücken (höchster Punkt über der Hüfte), Kopf tief getragen, kurzer dicker Hals.
   Fell sehr dicht: dunkelgraue Unterwolle, lange glänzende rot- bis kastanienbraune Grannen; Bauch etwas heller.
   Kelle waagerecht abgeplattet, oval, nackt, schwarzgrau mit Hornschuppen. Großer runder Kopf mit kleinen Augen, kleinen
   runden Ohren, stumpfer Schnauze; vier große Nagezähne mit orangem (eisenhaltigem) Zahnschmelz vorn. Vorderpfoten klein,
   greiffähig, mit Krallen; Hinterfüße groß mit Schwimmhäuten zwischen den fünf Zehen, Putzkralle an der zweiten Zehe. */
function biber(T) {
  const H = kit(T, [-10, -50, 130, 4]), { fl, wl, L, F, f, f2 } = H, G2 = H.G;
  H.minFl = 3;
  const DK = "#140a04", HL = "#ffd8b0";
  /* ---- Kopf: kurz, hoch, rund; stumpfe breite Schnauze, gewölbter kurzer Nasenrücken, dicke Backen; Auge mittig ---- */
  const KX = 86, KY = -25, KW = 18, KS = 0.9;
  const K = H.pt(KX, KY, KW, KS), KT = (pts) => H.tr(pts, KX, KY, KW, KS);
  const kopf = KT([[0, -3.6], [4, -6.0], [9, -6.8], [13.4, -6.0], [16.6, -3.8], [18.8, -0.8], [20.0, 2.6], [20.2, 5.6], [19.4, 7.6], [17.8, 8.6], [16.4, 9.6], [14.6, 11.6], [11, 13.4],
    [6, 14], [1, 13.2]]);
  /* ---- Rumpf: birnenförmig, höchster Punkt über der Hüfte, massiges Hinterteil, schmalerer Vorderkörper, Bauch fast am Boden ---- */
  const ruecken = [[31.4, -8.6], [32.6, -16.4], [36.6, -25], [43, -31.8], [51, -35.2], [59, -35], [67, -32.4], [74, -29.0], [80, -26.6], [84.4, -26.4]];
  const vorne = [[83.6, -10.6], [84.4, -7.6], [84.6, -4.4], [85.4, -2.8]];
  const bauch = [[78, -3.0], [70, -4.2], [60, -4.6], [50, -4.8], [42, -4.4]];
  const rumpf = ruecken.concat(kopf).concat(vorne).concat(bauch).concat([[36, -4.6], [32.6, -6.4]]);
  const A = H.flaeche(rumpf);
  const wuchs = (x, y) => (x > 84 && y < -12 ? 200 : y > -8 ? 100 : 170 - Math.min(1, Math.max(0, (y + 32) / 24)) * 58);
  const laenge = (x, y) => (x > 84 && y < -12 ? 0.5 : y > -8 ? 0.5 : 1.3);
  const licht = (x, y) => (y < -26 ? 0.8 : y < -16 ? 0.45 : 0.12);
  let s = "";
  /* ---- Kelle: liegt flach am Boden (leichte Aufsicht), kommt über einen behaarten Stiel aus dem Rumpf; Schuppen unregelmäßig
     sechseckig, zur Basis kleiner, glänzende Kanten, vereinzelte Haare ---- */
  const kelle = [[30, -4.4], [26, -6.0], [19, -6.8], [11, -6.4], [5.2, -5.0], [3.0, -3.2], [5.0, -1.6], [11, -0.6], [19, -0.4], [26, -1.2], [30, -2.2]];
  const KE = H.flaeche(kelle);
  let sch = "";
  if (F) {
    let d = "", dl = "";
    for (let r = 0; r < 5; r++) for (let c = 0; c < 22; c++) {
      const g = 0.6 + c / 22 * 0.7, x = 4.6 + c * 1.18 + (r % 2) * 0.55 + (T.rnd() - 0.5) * 0.25, y = -5.8 + r * 1.2 + (T.rnd() - 0.5) * 0.15;
      if (!T.inPoly(x, y, kelle)) continue;
      const w = 0.55 * g * (1.1 - c / 40), hh = 0.42;
      d += `M${f2(x - w)} ${f2(y)}L${f2(x - w / 2)} ${f2(y - hh)}L${f2(x + w / 2)} ${f2(y - hh)}L${f2(x + w)} ${f2(y)}L${f2(x + w / 2)} ${f2(y + hh)}L${f2(x - w / 2)} ${f2(y + hh)}Z`;
      dl += `M${f2(x - w / 2)} ${f2(y - hh)}L${f2(x + w / 2)} ${f2(y - hh)}`;
    }
    sch = `<path d="${d}" fill="none" stroke="#0a0908" stroke-width=".09" stroke-opacity=".75"/><path d="${dl}" fill="none" stroke="#a8a49c" stroke-width=".06" stroke-opacity=".5"/>`;
  }
  s += `<path d="${G2(kelle)}" fill="#000" opacity=".3" transform="translate(.6 .9)"${F ? ` filter="${H.blur(0.45)}"` : ""}/>`;
  s += H.vol("kelle", 1, H.teil(KE, T.lg("ke", [[0, "#5a5650"], [0.5, "#3a3734"], [1, "#22201e"]], 0, 0, 0, 1), sch + fl(16, -4.6, 10, 1.2, 0, "#fff", 0.22) +
    (F ? H.haare(kelle, 12, 180, 0.6, [["#3a2a1c", 1, 0.03, 0.5]], { szene: 0 }) : ""), { rw: 0.08, randA: 0.6 }), { tiefe: 2 });
  /* behaarter Schwanzstiel */
  s += T.form([[33, -7], [30, -5.2], [29.4, -3.2], [32, -2.6], [34, -4]], "#4a2e1a");
  /* ferner Hinterfuß und ferne Vorderpfote (dunkler) */
  s += T.form([[60, -5], [64, -5], [70, -1.6], [71.4, -0.2], [58, -0.2], [57.6, -2]], "#24180e") + T.form([[78, -7], [81, -7], [82, -2], [84.6, -0.8], [84.6, 0], [78.4, 0], [77.8, -2.6]], "#24180e");
  /* ---- Körper ---- */
  const fell = T.lg("fell", [[0, "#6e4628"], [0.3, "#60391e"], [0.6, "#4e2e18"], [0.82, "#3a2212"], [1, "#2a180c"]], 0, -36, 0, 0, H.US);
  let inn = "";
  inn += fl(60, -8, 22, 4, 0, "#7a5a40", 0.45);
  /* Schnauze: Nase dunkel mit seitlichen Nasenlöchern, gespaltene Oberlippe; Backe hell im Licht */
  inn += T.form(KT([[17.4, -1.2], [18.8, -0.2], [19.8, 1.6], [19.8, 3.0], [18.6, 3.2], [17.4, 1.6]]), "#1e1410") + fl(...K(18.4, 0.2), 0.5, 0.3, KW, "#fff", 0.5) +
    L([KT([[19.4, 1.6], [18.7, 2.4]])], "#000", 0.2, 0.8) + L([KT([[19.0, 5.2], [18.4, 7.0], [17.6, 8.6]])], "#140a06", 0.16, 0.7);
  /* Fell: dichte dunkle Unterwolle, lange glänzende Grannen (Spitzen hellbraun-golden, gedämpft) */
  inn += H.fellKorn("b1", [[30, -38], [88, -38], [88, -4], [30, -4]], 170, [["kd", "#1a0c04", 0.5, 3], ["kh", "#d0a070", 0.3, 8]], { fx: 0.9, fy: 7 }) +
    H.fellKorn("b2", KT([[-2, -7], [20, -1], [20, 12], [2, 14]]), KW + 190, [["kd", "#1a0c04", 0.4, 3], ["kh", "#c09868", 0.28, 8]], { fx: 1.6, fy: 9 });
  inn += H.haare(rumpf, 340, wuchs, laenge, [["#1e1008", 1, 0.045, 0.42], ["#5a341a", 0.6, 0.05, 0.4]], { krumm: 0.12, streu: 12, nur: (x, y) => !(x > 84 && y < -12), spitze: ["#c89a68", licht, 0.04, 0.45] });
  inn += H.haare(KT([[0, -5], [18, -1], [19, 7], [10, 12.6], [1, 12.4]]), 120, KW + 196, 0.4, [["#2a160a", 1, 0.03, 0.5]], { streu: 16, szene: 0, spitze: ["#b88c5c", 0.5, 0.025, 0.45] });
  /* Licht: seidiges Glanzband auf Rücken und Hüfte, Kernschatten unten, Reflex am Bauch; Backe; Schatten unter dem Kiefer */
  sch = wl([[[36, -24], [43, -31], [51, -34.2], [59, -34], [67, -31.4], [74, -28.2]]], "#ffe0bc", 1.8, 0.4, 0.9) + fl(52, -28, 10, 4, -10, HL, 0.2) +
    wl([[[40, -10], [52, -8.4], [66, -8.4], [78, -9.4]]], DK, 2.6, 0.32, 1.4) +
    fl(...K(7, 6), 4, 3.4, KW, HL, 0.2) + H.wf([K(6, 14), K(1, 13.2), [83.6, -10.6], [82, -14]], DK, 0.35, 0.8);
  const koerper = H.teil(A, fell, inn, { rand: false }) +
    H.saum(ruecken.slice(1), F ? 110 : 16, wuchs, 1.0, [["#2a1408", 1, 0.05, 0.6], ["#b07a4a", 0.6, 0.045, 0.5]], { offen: true, krumm: 0.15, streu: 16, szene: 0.2 }) +
    H.saum(bauch, F ? 30 : 6, 96, 0.6, [["#2a1408", 1, 0.05, 0.6]], { offen: true, szene: 0.2 });
  s += H.vol("rumpf", 3.5, koerper, { tiefe: 3, umgebung: 0.4 }) + A.clip(sch);
  /* ---- Hinterfuß: Sohlengänger, Ferse am Boden, fünf lange Zehen nach vorn, Schwimmhäute bis zu den Krallen, Putzkralle ---- */
  const fuss = [[48, -4.0], [53.2, -4.4], [58.6, -3.0], [62.4, -1.4], [64.4, -0.4], [64.2, 0], [47.6, 0], [46.6, -1.6]];
  const FU = H.flaeche(fuss);
  let zeh = "";
  if (F) zeh = H.L([[[54, -3.6], [58, -2.2], [63.4, -0.6]], [[53.4, -3.2], [57.4, -1.6], [62.2, -0.2]], [[52.8, -2.8], [56.6, -1.2], [60.6, -0.1]], [[52.2, -2.4], [55.4, -1.0], [58.8, -0.1]]], "#0a0806", 0.12, 0.65) +
    H.L([[[58, -2.4], [62.6, -0.8]], [[56.6, -1.8], [60.8, -0.4]]], "#6a5a4c", 0.05, 0.5);
  s += H.teil(FU, T.lg("fu", [[0, "#3a322c"], [1, "#1e1a17"]], 0, 0, 0, 1), zeh + fl(55, -2.8, 6, 0.8, 0, "#fff", 0.14) + H.rim(FU, 0.7, 0.9), { rand: false });
  s += H.L([[[63.4, -0.6], [64.6, -0.4], [65.2, 0]], [[62.2, -0.2], [63.2, 0]], [[60.6, -0.1], [61.6, 0.05]]], "#2a2420", 0.18, 0.95);
  /* Vorderpfote: kleine Hand mit fünf Fingern und kräftigen Krallen, Handgelenk erkennbar, Lauf bis zum Handgelenk behaart */
  const hand = [[83.4, -3.6], [85.0, -3.0], [86.4, -1.8], [87.2, -0.6], [87.0, 0], [83.2, 0], [82.8, -1.8]];
  const HA = H.flaeche(hand);
  s += H.teil(HA, "#3a2a20", (F ? H.L([[[85.0, -2.0], [86.6, -0.4]], [[84.4, -1.6], [85.8, -0.2]], [[83.8, -1.2], [85.0, -0.1]]], "#120a06", 0.08, 0.6) : "") + H.rim(HA, 0.5, 0.9), { rand: false }) +
    H.L([[[86.6, -0.5], [87.6, -0.3], [88.0, 0.1]], [[85.8, -0.2], [86.8, 0], [87.1, 0.2]], [[85.0, -0.1], [85.8, 0.1], [86.1, 0.25]]], "#1a1410", 0.14, 0.95);
  s += H.saum([[82.8, -4.8], [85.6, -4.2]], F ? 14 : 0, 96, 0.8, [["#4a2e1a", 1, 0.05, 0.7]], { offen: true, szene: 0 });
  /* ---- Ohr: klein, rund, Basis im Fell, Haare am Rand, Öffnung als Schatten ---- */
  const oh = KT([[0.6, -3.4], [0.2, -5.0], [1.4, -6.2], [3.0, -5.8], [3.4, -4.0]]), OH = H.flaeche(oh);
  s += H.teil(OH, "#4a2e1a", fl(...K(1.8, -4.4), 0.7, 0.7, 0, "#0a0604", 0.7), { rand: false }) +
    H.saum(KT([[0.2, -5.0], [1.4, -6.2], [3.0, -5.8]]), F ? 16 : 0, KW + 250, 0.4, [["#3a2412", 1, 0.035, 0.7]], { offen: true, streu: 40, szene: 0 });
  /* ---- Nagezähne: zwei obere, nebeneinander, meißelförmig, orange-rostbraun mit Glanzstreifen; untere angedeutet ---- */
  const zahn = (dx) => KT([[16.2 + dx, 8.4], [17.3 + dx, 8.3], [17.4 + dx, 10.4], [16.3 + dx, 10.6]]);
  s += T.form(zahn(-0.9), "#8a3e12") + T.form(zahn(0), T.lg("zahn", [[0, "#b4561c"], [0.5, "#c86a24"], [1, "#9a4a14"]], 0, 0, 1, 0)) +
    H.L([KT([[16.8, 8.5], [16.9, 10.2]])], "#ffe0b0", 0.08, 0.6) + H.L([KT([[16.25, 8.5], [16.3, 10.5]])], "#3a1a06", 0.05, 0.8) +
    "";
  /* Auge: klein, dunkel, Lidrand, leichte Augenhöhle */
  const au = K(8.4, 0.2);
  s += H.auge(au[0], au[1], 0.62, { iris: "#1a0c06", iris2: "#3a2010", pupille: "rund", offen: 0.82, winkel: KW, hoehle: "#140a04", braue: "#c89a68" });
  /* Tasthaare: aus mehreren Reihen auf der Oberlippe, Basis dunkel, Spitze hell, nach hinten-unten gebogen */
  if (F) s += T.schnurrhaare(...K(16.6, 5.4), 6, 5.2, KW + 18, 40, "#2a1a10", 0.05) + T.schnurrhaare(...K(15.8, 6.6), 6, 4.4, KW + 30, 40, "#d8c8b0", 0.04) +
    T.schnurrhaare(...K(15.2, 7.8), 4, 3.6, KW + 44, 30, "#c8b8a0", 0.04);
  return { svg: s, box: [3, -35.4, 102.3, 0], fuesse: [52, 60, 82, 87], kopf: [76, -34, 104, -2] };
}

/* =====================================================================
   FISCHOTTER
   ===================================================================== */
/* RECHERCHE Fischotter (Lutra lutra):
   Kopf-Rumpf 60–90 cm, Schwanz 35–45 cm (an der Wurzel sehr dick, spitz zulaufend, muskulös), Schulterhöhe ~25–30 cm,
   6–12 kg. Lang gestreckter, stromlinienförmiger Körper, kurze Beine, Füße mit Schwimmhäuten und Krallen.
   Kopf flach und breit, kleine runde Ohren tief am Kopf, kleine Augen weit vorn-oben; zahlreiche kräftige Tasthaare
   (Vibrissen) an Oberlippe, Kinn und über den Augen. Nasenspiegel klein, nackt, oben W-förmig begrenzt. Fell sehr dicht,
   kurz, glänzend dunkelbraun; Kehle, Kinn, Brust und Wangen heller (grau- bis cremebraun). */
function fischotter(T) {
  const H = kit(T, [-10, -45, 130, 4]), { fl, wl, L, F, f } = H, G2 = H.G;
  H.minFl = 3;
  const DK = "#120a05", HL = "#ffd8b0";
  /* ---- Kopf: flach und breit, Schädeldach kaum gewölbt, kurze stumpfe Schnauze (≈ 25 %), Augen klein, hoch und weit vorn;
     tief getragen (auf Höhe der Rückenlinie oder darunter) ---- */
  const KX = 98, KY = -17.4, KW = 10, KS = 0.86;
  const K = H.pt(KX, KY, KW, KS), KT = (pts) => H.tr(pts, KX, KY, KW, KS);
  const kopf = KT([[0, -3.2], [4, -4.4], [8, -4.6], [11.6, -4.0], [14.4, -2.8], [16.2, -1.2], [17.0, 0.6], [16.8, 2.4], [15.6, 3.6], [13.6, 4.4], [10.6, 5.4], [7, 6.6], [3.4, 7.6], [0, 8.2]]);
  /* ---- Schwanz: 57 % der Kopf-Rumpf-Länge, Basis dick und muskulös, verjüngt sich gleichmäßig, leicht S-förmig; Knick an der Wurzel,
     hinteres Drittel liegt auf dem Boden ---- */
  const swk = H.kette([[53, -15.6, 5.6, 5.2], [46, -12.6, 4.6, 4.2], [39, -9.0, 3.6, 3.2], [32, -5.6, 2.8, 2.4], [25, -3.0, 2.0, 1.7], [18, -1.5, 1.3, 1.1], [12, -0.9, 0.7, 0.6], [8.4, -0.7, 0.15, 0.15]]);
  /* ---- Rumpf: an Land mit gewölbtem Rücken, höchster Punkt über Lende und Hüfte; zum Kopf abfallend, Hals kurz und kräftig ---- */
  const ruecken = [[53, -21.2], [58, -24.6], [64, -26.2], [70, -26.0], [76, -24.4], [82, -22.0], [88, -20.0], [93, -19.6], [97, -20.4]];
  const vorne = [[94.6, -9.6], [95.4, -6.6], [95.2, -4.2], [95.8, -2.4], [97.8, -1.6], [99.6, -0.8], [99.6, 0], [91.6, 0], [90.8, -1.6], [90.2, -4.4], [89.4, -7.6]];
  const bauch = [[84, -8.4], [76, -8.0], [68, -8.4], [62, -9.4]];
  const hinten = [[61.4, -6.6], [62.6, -3.4], [64.6, -1.6], [67.4, -0.8], [67.4, 0], [56.2, 0], [55.0, -1.4], [54.6, -4.6], [53.0, -8.6]];
  const rumpf = swk.R.slice(1).reverse().map((p) => [p[0], p[1]]).concat(ruecken).concat(kopf).concat(vorne).concat(bauch).concat(hinten).concat(swk.L.slice(1).map((p) => [p[0], p[1]]));
  const A = H.flaeche(rumpf);
  const wuchs = (x, y) => (x > 97 && y < -10 ? 190 : x < 54 ? 172 : y > -8 ? 98 : 176 - Math.min(1, Math.max(0, (y + 25) / 16)) * 40);
  const laenge = (x, y) => (x > 97 ? 0.3 : y > -8 ? 0.35 : 0.6);
  const licht = (x, y) => (y < -20 ? 0.8 : y < -14 ? 0.5 : 0.15);
  let s = "";
  /* ferne Läufe: 15–20 % dunkler, teilweise verdeckt, mit Fuß */
  const fp = (P) => { const B = H.flaeche(P); return H.teil(B, "#2e1e12", H.haare(P, 18, 98, 0.4, [["#6a4a32", 1, 0.035, 0.4]], { szene: 0 }) + H.rim(B, 0.8, 0.8), { rand: false }); };
  s += H.vol("bein", 0.6, fp([[85.6, -10], [90, -10], [90.6, -4.4], [91.4, -2.4], [94.4, -1.4], [95.6, -0.6], [95.6, 0], [87.8, 0], [86.8, -2], [86.4, -5]]) +
    fp([[60.4, -10], [64.4, -9.6], [66.4, -4], [68.4, -1.8], [71.6, -0.8], [71.8, 0], [61.6, 0], [60.6, -2.4], [59.6, -6]]), { tiefe: 3 });
  /* ---- Körper ---- */
  const fell = T.lg("fell", [[0, "#5a3a24"], [0.3, "#4c301c"], [0.55, "#3e2616"], [0.78, "#33200f"], [1, "#2a1a0c"]], 0, -27, 0, 0, H.US);
  let inn = "", sch = "";
  /* helle cremegraue Zone: Oberlippe, Kinn, Kehle bis zur Brust; Grenze unregelmäßig und weich, an der Wange nach oben auslaufend */
  inn += H.wf(KT([[3, 2.6], [8, 1.8], [12, 2.2], [15.6, 1.6], [16.8, 3.0], [13.6, 4.6], [8, 6.6], [2, 8.4], [-2, 9.0], [-4, 7.4], [-2, 4.4]]), "#c8b294", 0.85, 1.0) +
    fl(93.4, -11.6, 3.2, 3.4, 20, "#b8a284", 0.6) + fl(...K(7, 1.4), 2.4, 1.4, KW, "#c8b294", 0.5);
  /* Nase: groß und dunkel, W-förmiger Oberrand, seitliche Nasenlöcher; Mund */
  inn += T.form(KT([[14.6, -1.8], [15.4, -1.2], [15.9, -1.6], [16.6, -0.8], [17.1, 0.6], [16.9, 1.8], [15.6, 2.0], [14.8, 0.6]]), "#120c0a") + fl(...K(15.8, -0.6), 0.5, 0.25, KW, "#fff", 0.5) +
    L([KT([[16.9, 0.8], [16.3, 1.4]])], "#000", 0.18, 0.8) + L([KT([[15.4, 3.6], [13.4, 4.4], [11.4, 4.8]])], "#1a0c06", 0.12, 0.6);
  /* Fell: kurz, sehr dicht, glänzend; feucht verklebte Spitzen (feine Strähnen) */
  inn += H.fellKorn("o1", [[0, -28], [100, -28], [100, -6], [0, 0]], 176, [["kd", "#140a04", 0.5, 3], ["kh", "#d8aa7a", 0.3, 8]], { fx: 1.8, fy: 12 });
  inn += H.haare(rumpf, 360, wuchs, laenge, [["#1a0e06", 1, 0.03, 0.42], ["#4a2e1a", 0.6, 0.03, 0.4]], { krumm: 0.08, streu: 10, nur: (x, y) => !(x > 97 && y < -10), spitze: ["#d0a070", licht, 0.026, 0.45] });
  inn += H.haare(KT([[0, -4], [15, -2], [16, 3], [6, 7], [0, 8]]), 80, KW + 186, 0.22, [["#2a1a0e", 1, 0.022, 0.5]], { streu: 14, szene: 0, spitze: ["#c09a70", 0.5, 0.02, 0.45] });
  /* Licht: Fellglanz oben (biegsamer Zylinder), Kernschatten unten, Reflex am Bauch; Schulter und Hüfte als Wölbungen;
     Kopf wirft Schatten auf Hals und Brust; Schwanz mit Glanzband */
  sch += wl([[[30, -7.6], [42, -13.6], [54, -20.6], [64, -25.4], [74, -24.6], [86, -21.0], [94, -19.8]]], "#ffe8cc", 1.0, 0.45, 0.5) + fl(66, -21, 8, 3, -4, HL, 0.22) +
    wl([[[56, -12], [68, -11.2], [80, -11.4], [88, -12.4]]], DK, 2.0, 0.34, 1.0) + fl(60, -15, 4.4, 5, 0, "#fff", 0.1) + fl(86, -14, 3.6, 4.4, 0, "#fff", 0.1) +
    H.wf([K(3.4, 7.6), K(0, 8.2), [94.6, -9.6], [92, -12], [92, -16]], DK, 0.3, 0.8) + wl([[[12, -1.6], [22, -2.8], [34, -6.2]]], DK, 0.8, 0.3, 0.4);
  const koerper = H.teil(A, fell, inn, { rand: false }) +
    /* feucht verklebte Haarspitzen: fein stachelige Kontur an Rücken und Schwanz */
    H.saum(swk.R.slice(1).reverse().map((p) => [p[0], p[1]]).concat(ruecken), F ? 110 : 14, (x, y) => (x < 54 ? 186 : 176) + (T.rnd() - 0.5) * 20, 0.6,
      [["#2a1a0e", 1, 0.04, 0.65], ["#b88a5a", 0.5, 0.035, 0.5]], { offen: true, krumm: 0.05, streu: 12, szene: 0.2 });
  s += H.vol("rumpf", 2.4, koerper, { tiefe: 3, umgebung: 0.4 }) + A.clip(sch);
  /* ---- Ohr: klein, rund, tief seitlich am Kopf auf Höhe der Augen-Oberkante, kaum über der Kontur ---- */
  const oh = KT([[0.4, -2.6], [0.4, -4.0], [1.6, -4.6], [2.8, -4.0], [2.6, -2.6]]), OH = H.flaeche(oh);
  s += H.teil(OH, "#3a2414", fl(...K(1.5, -3.2), 0.5, 0.5, 0, "#0a0604", 0.6), { rand: false }) +
    H.saum(KT([[0.4, -4.0], [1.6, -4.6], [2.8, -4.0]]), F ? 12 : 0, KW + 250, 0.25, [["#2a1a0e", 1, 0.03, 0.7]], { offen: true, streu: 30, szene: 0 });
  /* ---- Füße: breit, fünf gespreizte Zehen mit Schwimmhäuten dazwischen, kurze Krallen; Hinterfüße deutlich größer ---- */
  const fuss = (x0, x1, h) => {
    const P = [[x0, -h], [x0 + (x1 - x0) * 0.5, -h * 1.15], [x1 - 0.6, -h * 0.6], [x1 + 0.3, -0.2], [x0 - 0.3, -0.1]], B = H.flaeche(P);
    let o = H.teil(B, "#2e2016", (F ? H.L([0, 1, 2, 3].map((i) => [[x1 - 1.4 - i * 0.9, -h * 0.9], [x1 - 0.2 - i * 1.0, -0.2]]), "#0a0604", 0.07, 0.6) +
      H.wf([[x1 - 3.4, -h * 0.7], [x1 - 0.6, -h * 0.4], [x1, -0.1], [x1 - 4, -0.1]], "#1a120c", 0.5, 0.2) : "") + H.rim(B, 0.5, 0.9), { rand: false });
    o += H.L([0, 1, 2, 3].map((i) => [[x1 - 0.2 - i * 1.0, -0.3], [x1 + 0.3 - i * 1.0, -0.1], [x1 + 0.5 - i * 1.0, 0.1]]), "#8a7a68", 0.12, 0.9);
    return o;
  };
  s += fuss(91.8, 99.8, 1.8) + fuss(56.4, 67.8, 1.9);
  /* Auge: klein, dunkel, leicht vorgewölbt, hoch und weit vorn; Lidrand und kleiner Glanz */
  const au = K(10.4, -1.6);
  s += H.auge(au[0], au[1], 0.5, { iris: "#1a0c06", iris2: "#3a2010", pupille: "rund", offen: 0.86, winkel: KW, hoehle: "#0e0804", braue: "#c09a70" });
  /* Tasthaare: dick und kräftig, mehrere Reihen auf dem Schnauzenpolster (Basis dunkler, Spitze hell), dazu Büschel über dem Auge und am Kinn */
  if (F) s += T.schnurrhaare(...K(13.6, 2.2), 7, 6.6, KW + 12, 50, "#3a2a1e", 0.07) + T.schnurrhaare(...K(13.0, 2.8), 9, 6.0, KW + 20, 56, "#f0e6d4", 0.06) +
    T.schnurrhaare(...K(9.6, -2.8), 3, 2.6, KW - 50, 30, "#e8dccb", 0.04) + T.schnurrhaare(...K(10, 5.6), 4, 2.6, KW + 80, 30, "#e8dccb", 0.04);
  else s += T.schnurrhaare(...K(13.6, 2.4), 5, 6, KW + 16, 56, "#efe6d6", 0.1);
  return { svg: s, box: [8.1, -26.4, 114.3, 0], fuesse: [60, 66, 90, 96], kopf: [88, -26, 116, -2] };
}

module.exports = [
  { id: "reh", de: "das Reh", syl: "REH", it: "il capriolo", itSyl: "ca-pri-O-lo", en: "roe deer", gruppe: "Wald", lebensraum: "Wald",
    laenge: 1.09, hoehe: 1.11, zeichne: reh },
  { id: "hirsch", de: "der Hirsch", syl: "HIRSCH", it: "il cervo", itSyl: "CER-vo", en: "red deer", gruppe: "Wald", lebensraum: "Wald",
    laenge: 1.83, hoehe: 2.35, zeichne: hirsch },
  { id: "wildschwein", de: "das Wildschwein", syl: "WILD-schwein", it: "il cinghiale", itSyl: "cin-GHIA-le", en: "wild boar", gruppe: "Wald", lebensraum: "Wald",
    laenge: 1.48, hoehe: 1.1, zeichne: wildschwein },
  { id: "elch", de: "der Elch", syl: "ELCH", it: "l'alce", itSyl: "AL-ce", en: "moose", gruppe: "Wald", lebensraum: "Wald",
    laenge: 2.22, hoehe: 2.43, zeichne: elch },
  { id: "wisent", de: "der Wisent", syl: "WI-sent", it: "il bisonte europeo", itSyl: "bi-SON-te eu-ro-PE-o", en: "European bison", gruppe: "Wald", lebensraum: "Wald",
    laenge: 2.56, hoehe: 1.99, zeichne: wisent },
  { id: "dachs", de: "der Dachs", syl: "DACHS", it: "il tasso", itSyl: "TAS-so", en: "badger", gruppe: "Wald", lebensraum: "Wald",
    laenge: 0.74, hoehe: 0.3, zeichne: dachs },
  { id: "biber", de: "der Biber", syl: "BI-ber", it: "il castoro", itSyl: "CA-sto-ro", en: "beaver", gruppe: "Wald", lebensraum: "Wald und Fluss",
    laenge: 0.99, hoehe: 0.35, zeichne: biber },
  { id: "fischotter", de: "der Fischotter", syl: "FISCH-ot-ter", it: "la lontra", itSyl: "LON-tra", en: "otter", gruppe: "Wald", lebensraum: "Fluss und Bach",
    laenge: 1.06, hoehe: 0.26, zeichne: fischotter },
];
