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
function kit(T, box = [-60, -320, 620, 40]) {
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
  const H = { F, f, G, US: ' gradientUnits="userSpaceOnUse"' };
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
    sd = [0.12, 0.25, 0.45, 0.8, 1.3, 2, 3].reduce((b, v) => (Math.abs(v - sd) < Math.abs(b - sd) ? v : b), 0.12);
    const id = T.id("b" + String(sd).replace(".", "_"));
    if (!bl.has(id)) { bl.add(id); T.def(`<filter id="${id}" filterUnits="userSpaceOnUse" x="${box[0]}" y="${box[1]}" width="${box[2] - box[0]}" height="${box[3] - box[1]}"><feGaussianBlur stdDeviation="${sd}"/></filter>`); }
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
    const eimer = farben.map(() => []);
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
      g++;
    }
    return haarPfade(eimer, farben);
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
  /* Vieleck ohne Glättung (Klippzonen) */
  H.poly = (pts) => "M" + pts.map((p) => f(p[0]) + " " + f(p[1])).join("L") + "Z";
  /* Punkte (Perlen, Höcker) als runde Strichenden: [[x, y, r]] → je Größe EIN Pfad */
  H.punkte = (liste, farbe, op = 1) => {
    const g = new Map();
    for (const [x, y, rr] of liste) { const k = Math.max(0.05, Math.round(rr * 20) / 20); g.set(k, (g.get(k) || "") + `M${f(x)} ${f(y)}h0`); }
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
  /* Paarhufer-Schale (Seitenansicht): Ballen hinten bei xb, Spitze vorn bei xs, Kronrand-Höhe h, Neigung der Vorderwand.
     Zwei Klauen: ferne (dunkler, leicht versetzt) und nahe; Kronrand mit Haarsaum, Glanz an der Wand. */
  H.schale = (xb, xs, h, o = {}) => {
    const fa = o.farbe || "#2a2220", L = xs - xb;
    const kl = (dx, dy, farbe, op) => {
      const X = (u) => f(xb + dx + L * u), Y = (v) => f(-h * v + dy);
      const d = `M${X(0.08)} ${Y(0.62)}Q${X(-0.04)} ${Y(0.3)} ${X(0.12)} ${f(dy)}L${f(xs + dx)} ${f(dy)}Q${X(0.86)} ${Y(0.3)} ${X(0.58)} ${Y(0.86)}Q${X(0.5)} ${Y(1.04)} ${X(0.3)} ${Y(0.95)}Z`;
      const A = H.flaeche(d);
      return H.teil(A, farbe, H.fl(xb + dx + L * 0.55, -h * 0.75 + dy, L * 0.3, h * 0.35, -35, "#fff", 0.3 * op) +
        (F ? H.L([[[xs + dx - L * 0.5, -h * 0.82 + dy], [xs + dx - L * 0.22, -h * 0.4 + dy], [xs + dx - L * 0.05, -h * 0.08 + dy]]], "#fff", L * 0.05, 0.35 * op) +
          H.L([[[xb + dx + L * 0.35, -h * 0.85 + dy], [xb + dx + L * 0.75, -h * 0.25 + dy]], [[xb + dx + L * 0.5, -h * 0.9 + dy], [xb + dx + L * 0.88, -h * 0.3 + dy]]], "#000", L * 0.02, 0.35) : "") +
        H.fl(xb + dx + L * 0.2, -h * 0.2 + dy, L * 0.3, h * 0.4, 0, "#000", 0.35), { rw: L * 0.025, randA: 0.6 });
    };
    let s = (F ? kl(L * 0.1, -h * 0.07, o.fern || "#141010", 0.5) : "") + kl(0, 0, fa, 1);
    /* Spalt zwischen den Klauen */
    s += H.L([[[xb + L * 0.62, -h * 0.98], [xs - L * 0.05, -h * 0.12]]], "#050303", L * 0.035, 0.55);
    /* Kronrand: Haarsaum über der Klaue */
    if (o.saum) s += o.saum;
    return s;
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
  const DK = "#2a1206";
  /* ---- Kopf im lokalen System (Genick = 0, Nase bei x ≈ 21), um 33° nach unten geneigt ---- */
  const KX = 102.3, KY = -98.4, KW = 33;
  const KS = 1.07, K = H.pt(KX, KY, KW, KS), KT = (pts) => H.tr(pts, KX, KY, KW, KS);
  const kopf = KT([[-0.5, -1.4], [1.6, -2.6], [4.0, -3.3], [6.4, -3.2], [8.4, -2.5], [10.6, -1.3], [13.2, 0.0], [15.6, 1.1], [17.4, 1.9], [18.8, 2.7], [19.7, 3.8], [19.95, 5.1],
    [19.6, 6.3], [18.9, 7.0], [18.0, 7.45], [17.2, 7.7], [16.7, 8.3], [15.6, 8.9], [13.6, 9.3], [10.8, 9.35], [8.0, 9.9], [5.6, 10.4]]);
  /* ---- Läufe: Umriss vorn (oben → Huf) + hinten (Huf → oben) ---- */
  const vorne = [[89.4, -42], [88.4, -36], [88.0, -30], [87.9, -25.8], [87.3, -21.8], [86.9, -17], [86.9, -11], [87.4, -7.8], [88.7, -5.0], [89.8, -3.2],
    [89.6, -1.5], [87.0, -1.2], [85.6, -2.4], [84.4, -4.6], [83.3, -7.8], [84.0, -11.5], [84.2, -17], [84.1, -21], [83.4, -24.4], [83.8, -28.5], [83.3, -34], [82.1, -38.6]];
  const hinten = [[34.2, -46.2], [33.0, -44.2], [31.6, -41.6], [29.4, -37.8], [26.6, -33.6], [24.2, -29.8], [22.9, -27.4], [22.3, -24.6], [22.1, -18], [22.1, -11.5], [22.4, -8], [23.6, -5.3], [24.7, -3.3],
    [24.6, -1.5], [22.2, -1.2], [20.8, -2.4], [19.6, -4.8], [18.6, -8.2], [19.1, -11.5], [19.2, -18], [19.1, -23.5], [18.5, -27], [17.0, -30.4, 1], [17.3, -32.6], [17.2, -36], [16.3, -40.5], [14.7, -44.5]];
  /* ---- Gesamtumriss: Rücken → Hals → Kopf → Kehle → Brust → Vorderlauf → Bauch → Hinterlauf → Keule ---- */
  const ruecken = [[16, -73.6], [22, -76.0], [28.5, -76.6], [33, -75.8], [40, -74.6], [48, -73.4], [58, -71.6], [66, -71.5], [71, -72.6], [75, -74.2], [79.5, -76.2], [85, -80.8], [90.6, -86.8], [95.8, -93.0], [99.6, -97.0]];
  const rumpf = ruecken.concat(kopf)
    .concat([[100.0, -84.4], [98.2, -79], [96.4, -72.5], [95.0, -66.5], [94.8, -61.6], [95.4, -57], [94.8, -52.4], [93.0, -48.2]])
    .concat(vorne)
    .concat([[79.6, -40.6], [76, -39.8], [68, -38.9], [58, -39.4], [49, -41.0], [42, -43.4], [36.6, -46.4]])
    .concat(hinten)
    .concat([[12.6, -49], [10.8, -54.5], [9.8, -59.8], [10.4, -64.2], [11.4, -67.4], [13, -70.6]]);
  const A = H.flaeche(rumpf);
  /* ---- Lauscher (Ohren): Außenseite graubraun, vorn umgeschlagener Rand mit weißem Innenhaar, dunkler Saum ---- */
  const ohr = [[-1.7, 0], [-2.8, -2.6], [-3.1, -6], [-2.6, -9.2], [-1.4, -11.4], [0.2, -12.9], [1.5, -11.6], [2.5, -8.8], [2.8, -5.2], [2.4, -2.2], [1.6, 0]];
  const ohrRand = [[0.9, -0.8], [2.15, -4.0], [2.35, -8.4], [1.6, -11.6], [0.4, -12.9], [0.7, -11.2], [1.1, -8.2], [1.0, -4.2], [0.3, -1.4]];
  const ohrZ = (ox, oy, w, sx, fern) => {
    const tr = (pts) => H.tr(pts.map((p) => [p[0] * sx, p[1] * 0.9, p[2]]), ox, oy, w);
    const P = tr(ohr), I = tr(ohrRand), B = H.flaeche(P);
    const gO = T.lg(fern ? "ohf" : "oh", fern ? [[0, "#3a2a20"], [1, "#4e3a2c"]] : [[0, "#5c4636"], [0.5, "#7e6450"], [1, "#6a5242"]], 0, 1, 0, 0);
    let inn = fl(...tr([[-0.8, -3]])[0].slice(0, 2), 2.2 * sx, 3.5, w, "#000", fern ? 0.2 : 0.3) + fl(...tr([[-1.2, -8]])[0].slice(0, 2), 1.6 * sx, 3, w, "#fff", fern ? 0 : 0.14);
    if (!fern) {
      inn += H.wf(I, "#2a1e18", 0.85, 0.25) + H.wf(tr([[1.1, -1.4], [2.0, -4.2], [2.15, -8.2], [1.5, -11.2], [1.25, -8.2], [1.15, -4.2]]), "#d8cfc2", 0.55, 0.3) +
        H.haare(I, 52, w - 94, 1.9, [["#fbf6ee", 1, 0.032, 0.75], ["#cfc4b4", 0.5, 0.03, 0.55]], { streu: 10, krumm: 0.12, szene: 0 });
      inn += H.haare(P, 30, w - 92, 0.55, [["#2a1c14", 1, 0.04, 0.4], ["#b8a290", 0.6, 0.035, 0.35]], { szene: 0, nur: (x, y) => !T.inPoly(x, y, I) });
    }
    inn += H.rim(B, 1.3, 0.9) + H.L([tr([[-3.15, -5.5], [-2.8, -9.6], [-1.3, -12.6], [0.3, -13.25], [1.7, -12.0], [2.5, -9.6]])], "#100806", 0.6, fern ? 0.6 : 0.8);
    return H.teil(B, gO, inn, { rand: false });
  };
  /* ---- Gehörn (Sechser): Rose (Perlkranz) dicht auf der Stirn, geperlte Stange, Vorder- und Hintersprosse, weiße Enden ---- */
  const gehoern = (bx, by, s0, fern) => {
    const P = (pts) => H.tr(pts, bx, by, 2, s0);
    /* knorrige Kante: Randpunkte unten stark, oben kaum verrauscht */
    const knorrig = (k, bis, st) => {
      const rau = (A, sg) => {
        const o = [];
        for (let i = 0; i < A.length - 1; i++) {
          const a = A[i], b = A[i + 1], n = i < bis ? 2 : 1;
          for (let j = 0; j < n; j++) {
            const u = j / n, x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u;
            const w = i < bis ? st * (1 - i / (bis + 1)) * (T.rnd() * 1.2 - 0.15) : 0;
            o.push([x + sg * w, y + (T.rnd() - 0.5) * w * 0.3]);
          }
        }
        o.push(A[A.length - 1]);
        return o;
      };
      return rau(k.L, 1).concat(rau(k.R, -1).reverse());
    };
    const stange = H.kette(P([[0.1, -0.6, 1.32, 1.3], [0.0, -3.6, 1.2, 1.18], [-0.2, -7.4, 1.02, 1.0], [-0.45, -11.2, 0.84, 0.82], [-0.4, -14.8, 0.66, 0.64], [0.1, -18.0, 0.46, 0.44], [0.7, -20.4, 0.14, 0.14]]));
    const vorn = H.kette(P([[0.2, -8.2, 0.8, 0.7], [1.6, -9.0, 0.62, 0.56], [3.0, -10.4, 0.4, 0.38], [4.0, -12.4, 0.12, 0.12]]));
    const hint = H.kette(P([[-0.6, -13.0, 0.66, 0.62], [-1.8, -13.8, 0.48, 0.44], [-2.7, -15.1, 0.3, 0.3], [-3.2, -16.9, 0.1, 0.1]]));
    const gS = fern ? "#2e2218" : T.lg("gs", [[0, "#3a2614"], [0.4, "#4e3420"], [0.72, "#6a4e36"], [0.87, "#c2b292"], [1, "#f4eedd"]], 0, 1, 0, 0);
    const gV = fern ? "#33261b" : T.lg("gv", [[0, "#3a2818"], [0.5, "#5a412c"], [0.8, "#cbbd9d"], [1, "#f6f0e0"]], 0, 0, 1, 0);
    const gH = fern ? "#33261b" : T.lg("gh", [[0, "#f6f0e0"], [0.2, "#cbbd9d"], [0.5, "#5a412c"], [1, "#3a2818"]], 0, 0, 1, 0);
    const riefen = (k, n) => F ? H.L([k.L.map((p, i) => [p[0] * 0.66 + k.R[i][0] * 0.34, p[1] * 0.66 + k.R[i][1] * 0.34]).slice(0, n), k.L.map((p, i) => [p[0] * 0.3 + k.R[i][0] * 0.7, p[1] * 0.3 + k.R[i][1] * 0.7]).slice(0, n)], "#120904", 0.08, 0.45) : "";
    /* Perlung: kleine Kuppen, nur durch Licht (links oben) und Schatten (rechts unten) sichtbar */
    const perlung = (k, bis, n) => {
      if (!F || fern) return "";
      const dd = [], dh = [];
      for (let i = 0; i < n; i++) {
        const t = Math.pow(T.rnd(), 1.5) * bis, j = Math.floor(t), u = t - j, q = 0.06 + T.rnd() * 0.88;
        const a = [k.L[j][0] + (k.L[j + 1][0] - k.L[j][0]) * u, k.L[j][1] + (k.L[j + 1][1] - k.L[j][1]) * u];
        const b = [k.R[j][0] + (k.R[j + 1][0] - k.R[j][0]) * u, k.R[j][1] + (k.R[j + 1][1] - k.R[j][1]) * u];
        const x = a[0] + (b[0] - a[0]) * q, y = a[1] + (b[1] - a[1]) * q, rr = (0.13 + T.rnd() * 0.14) * (1 - 0.45 * t / bis);
        dd.push([x + rr * 0.35, y + rr * 0.35, rr]); dh.push([x - rr * 0.3, y - rr * 0.3, rr * 0.55]);
      }
      return H.punkte(dd, "#120802", 0.6) + H.punkte(dh, "#b89c78", 0.38);
    };
    const SV = H.flaeche(F ? knorrig(vorn, 1, 0.1) : vorn.pts), SH = H.flaeche(hint.pts), SS = H.flaeche(F ? knorrig(stange, 4, 0.22) : stange.pts);
    let g = H.teil(SV, gV, riefen(vorn, 3) + H.rim(SV, 0.5, 0.9), { rw: 0.06, randA: 0.6 }) + H.teil(SH, gH, riefen(hint, 3) + H.rim(SH, 0.45, 0.9), { rw: 0.06, randA: 0.6 });
    g += H.teil(SS, gS, riefen(stange, 6) + perlung(stange, 3.8, 40) + H.rim(SS, 0.9, 0.9) +
      (F && !fern ? H.L([stange.L.slice(1, 6).map((p, i) => [p[0] * 0.74 + stange.R[i + 1][0] * 0.26, p[1] * 0.74 + stange.R[i + 1][1] * 0.26])], "#fff", 0.14, 0.24) : ""), { rw: 0.06, randA: 0.6 });
    /* Rose: unregelmäßiger, knorriger Kranz um den Stangenfuß */
    const [rx, ry] = P([[0.05, -0.55]])[0], rose = [];
    for (let i = 0; i < 26; i++) {
      const a = Math.PI * 2 * i / 26, rr = 1 + (i % 2 ? 0.1 : -0.06) + (T.rnd() - 0.5) * 0.14;
      rose.push([rx + Math.cos(a) * 1.75 * s0 * rr, ry + Math.sin(a) * 0.62 * s0 * rr]);
    }
    if (!F) return g;
    const RO = H.flaeche(rose);
    g += H.teil(RO, fern ? "#1c1209" : "#2e1d0e", fern ? "" : fl(rx - 0.5 * s0, ry - 0.35 * s0, 1.2 * s0, 0.3 * s0, 0, "#d8c2a0", 0.55) + (F ? perlung({ L: [[rx - 1.6, ry - 0.2], [rx + 1.6, ry - 0.2]], R: [[rx - 1.6, ry + 0.3], [rx + 1.6, ry + 0.3]] }, 0.99, 14) : ""), { rw: 0.06, randA: 0.7 });
    return g;
  };
  const ohrBasis = K(1.0, -2.3), gehBasis = K(4.6, -3.25);
  /* Laufmodell (nah und fern gleich, fern schwächer): Vorderwurzelgelenk, Sprunggelenk, Fesselgelenk, Beugesehnen, Lichtkante vorn */
  const laufV = (dx, k) => wl([[[84.5 + dx, -21], [84.7 + dx, -12], [84.5 + dx, -9]]], "#ffd2a0", 0.3, 0.24 * k, 0.12) + wl([[[85.5 + dx, -21], [85.7 + dx, -11]]], DK, 0.45, 0.4 * k, 0.15) +
    wl([[[87.6 + dx, -36], [87.2 + dx, -28], [87.1 + dx, -20], [86.6 + dx, -10]]], "#ffd2a0", 0.5, 0.3 * k, 0.25) +
    fl(87.2 + dx, -24.4, 1.2, 2.1, 0, "#fff", 0.24 * k) + fl(83.9 + dx, -24.4, 0.9, 1.6, 0, DK, 0.4) + fl(85.6 + dx, -7.6, 2.4, 2, 0, DK, 0.42) + fl(86.6 + dx, -9.5, 0.9, 1.4, 0, "#fff", 0.22 * k);
  const laufH = (dx, k) => wl([[[19.2 + dx, -24], [19.4 + dx, -12], [19.2 + dx, -9]]], "#ffd2a0", 0.3, 0.24 * k, 0.12) + wl([[[20.2 + dx, -24], [20.4 + dx, -11]]], DK, 0.45, 0.4 * k, 0.15) +
    wl([[[30.6 + dx, -42], [27.6 + dx, -36.5], [24.4 + dx, -31], [22.6 + dx, -24], [22.0 + dx, -12]]], "#ffd2a0", 0.5, 0.3 * k, 0.25) +
    fl(17.8 + dx, -29.6, 1.4, 2.3, 0, "#fff", 0.24 * k) + fl(21.9 + dx, -27.6, 1.1, 2.6, 0, DK, 0.32) + fl(20.6 + dx, -8, 2.3, 2, 0, DK, 0.42) + fl(21.4 + dx, -9.5, 0.9, 1.4, 0, "#fff", 0.22 * k);
  let s = "";
  /* ---- ferne Läufe (im Körperschatten) ---- */
  const fernV = H.schieb(vorne, -6.5), fernH = H.schieb(hinten, 6.2);
  const fernFarbe = T.lg("fern", [[0, "#5a3018"], [0.3, "#74462a"], [0.65, "#5e4434"], [1, "#3a2c22"]], 0, -46, 0, 0, H.US);
  const fernBein = (P, top) => {
    const Q = top.concat(P), B = H.flaeche(Q);
    return (det) => H.teil(B, fernFarbe, H.haare(Q, 50, 92, 0.7, [["#140a04", 1, 0.05, 0.4], ["#a07a5a", 0.5, 0.04, 0.25]], { streu: 10 }) + det +
      H.rim(B, 1.6, 0.8) + H.wf([[P[0][0] - 8, -56], [P[0][0] + 8, -56], [P[0][0] + 8, -36], [P[0][0] - 8, -38]], "#000", 0.3, 2), { rand: false });
  };
  s += fernBein(fernH, [[17, -52], [30, -52]])(laufH(6.2, 0.6)) + fernBein(fernV, [[77, -50], [88, -50]])(laufV(-6.5, 0.6));
  s += H.schale(27.5, 32.8, 2.9, { farbe: "#221a16", fern: "#110d0b" }) + H.schale(79.7, 85.3, 3.0, { farbe: "#221a16", fern: "#110d0b" });
  /* fernes Ohr, fernes Gehörn: hinter dem Kopf */
  s += ohrZ(ohrBasis[0] + 1.6, ohrBasis[1] - 0.6, -22, 0.55, true) + (F ? gehoern(gehBasis[0] + 2.3, gehBasis[1] + 0.1, 0.94, true) : "");
  /* ---- Körper ---- */
  const fell = T.lg("fell", [[0, "#5a3a26"], [0.19, "#7e3e20"], [0.33, "#9a4820"], [0.47, "#a85224"], [0.57, "#a05a34"], [0.63, "#8e6048"], [0.75, "#76523e"], [0.9, "#5a4232"], [1, "#382820"]], 0, -112, 0, 0, H.US);
  const wuchs = (x, y) => {
    if (y > -40 || (x > 82 && x < 90 && y > -46) || (x < 34 && x > 14 && y > -43)) return 92;  // Läufe
    if (x > 99 && y < -84) return 213;                                                      // Gesicht: zur Stirn
    if (x > 78) return 118 + Math.max(0, (x - 92)) * 1.4;                                   // Hals abwärts
    if (x < 22) return 108;                                                                  // Keule
    return 178 - Math.min(1, Math.max(0, (y + 68) / 28)) * 70;                              // Rumpf: nach hinten, Flanke abwärts
  };
  const laenge = (x, y) => (y > -40 ? 0.7 : x > 99 && y < -84 ? 0.6 : x > 78 ? 1.3 : 1.15);
  let inn = "";
  /* Farbzonen */
  inn += H.wf([[98.6, -88], [102.6, -103], [116, -104], [128, -90], [126, -76], [110, -76], [100.4, -82]], "#7d6452", 0.6, 1.2);          // Gesicht graubraun
  inn += H.wf(KT([[0.6, -3], [6, -3.4], [11.5, -1.6], [11.4, 0.9], [6, 0.5], [0.8, 1.2]]), "#3a2416", 0.6, 0.8);                           // Stirn dunkel
  inn += H.wf(KT([[4.6, 3.5], [9.5, 4.2], [13, 6.8], [12, 9.6], [5, 9.8], [3.2, 7]]), "#8a5a3a", 0.35, 1.0);                                // Wange rötlich
  inn += fl(62, -40.2, 25, 3.8, 0, "#dcb48c", 0.85) + fl(86, -44.5, 4.5, 3.5, 0, "#dcb48c", 0.45);                                        // Bauch hell
  inn += H.wf([[9.2, -66], [12.6, -70.6], [17.6, -70.2], [18.8, -63], [17.4, -54], [13, -49.5], [9.6, -55]], "#e6cf9f", 0.8, 1.3);          // Spiegel
  inn += fl(12.6, -61.5, 3.5, 7, 0, "#fff", 0.55);
  inn += H.wf([[16, -36], [31, -38], [28, -26], [24, -22], [24, 0], [14, 0], [15, -28]], "#6e4a36", 0.4, 3) +
    H.wf([[81, -34], [90, -34], [90, 0], [81, 0]], "#6e4a36", 0.4, 3);                                                                    // Läufe graubraun
  /* Muskeln und Knochen: weiches Licht (links oben) und Schatten */
  inn += fl(79.5, -63, 8, 13, 28, "#ffd2a0", 0.32) +              // Schulterblatt
    fl(87.8, -55, 4.8, 6, 0, "#ffd2a0", 0.3) +                     // Buggelenk
    fl(77.5, -47.5, 4.8, 8.5, 12, DK, 0.42) +                      // Trizeps-Schatten
    fl(57, -61, 18, 9.5, -4, "#ffd2a0", 0.26) +                    // Rippenbogen
    fl(57, -42.6, 24, 4.5, 0, DK, 0.42) +                          // Bauchschatten
    fl(38, -59, 6, 11, -12, DK, 0.2) +                             // Hungergrube
    fl(29.5, -71.2, 6.5, 3.4, 0, "#ffd2a0", 0.4) +                 // Hüfthöcker
    fl(22, -61, 8.5, 11, 8, "#ffd2a0", 0.32) +                     // Keule
    fl(89, -84, 9, 3.2, -50, "#ffd2a0", 0.32) +                    // Halskamm
    fl(97.5, -76, 2.6, 9, 14, DK, 0.35) +                          // Kehle
    fl(91.6, -47.5, 3.4, 4, 0, DK, 0.4) +                          // Brust unten
    fl(29, -40, 3.4, 5, -35, DK, 0.35) +                           // Kniekehle/Unterschenkel hinten
    fl(86.2, -32, 1.3, 6.5, 0, "#fff", 0.16);                      // Unterarm vorn
  inn += wl([[[18.6, -69.5], [17.6, -60], [16.8, -51], [15.8, -45]]], "#6a2e10", 1.6, 0.3, 0.9) +              // Keulenfurche
    wl([[[36.8, -47], [34.4, -52], [31.4, -57]]], DK, 1.6, 0.26, 1.0) +                                        // Kniefalte
    wl([[[99.2, -84], [96.6, -71], [94, -59]]], DK, 0.9, 0.35, 0.5) +                                         // Drosselrinne
    wl([[[71, -70.5], [77.5, -61], [84.5, -53.5]]], "#ffd2a0", 2.2, 0.16, 1.2) +                              // Schultergräte
    wl([[[78.6, -52], [81.4, -45.5], [80.2, -41]]], DK, 1.0, 0.38, 0.5) +                                     // Ellbogen
    wl([[[20, -60], [25.5, -50], [30.6, -45.2]]], "#ffd2a0", 1.4, 0.24, 0.7) +                                // Oberschenkel vorn
    wl([[[31.6, -43], [27.6, -36], [24, -30]]], "#ffd2a0", 0.7, 0.3, 0.35) +                                  // Schienbein vorn
    wl([[[16.4, -40], [16.9, -34], [16.6, -31]]], "#ffd2a0", 0.5, 0.35, 0.2);                                 // Achillessehne
  /* Läufe: Beugesehnen (hell) hinter dem Röhrbein, Gelenke */
  inn += laufV(0, 1) + laufH(0, 1);
  /* Laufbürste (Mittelfußdrüse) */
  inn += fl(19.6, -19.5, 1.3, 2.6, 0, "#dcb48c", 0.75) + fl(19.6, -19.5, 0.6, 1.3, 0, "#4a3426", 0.5);
  /* Kopf: Augenhöhle, Augenbogen, Jochbogen, Kaumuskel, Nasenrücken, Kinnlade */
  inn += fl(...K(6.6, 1.0), 3.2, 2.2, KW, DK, 0.42) + fl(...K(7.0, -1.7), 3, 1.0, KW, "#ffd2a0", 0.3) + fl(...K(4.8, 4.6), 4.2, 2.6, KW, "#ffd2a0", 0.26) +
    fl(...K(4.4, 7.8), 3.4, 2.0, KW, DK, 0.24) + fl(...K(12.4, 0.0), 5.5, 1.2, KW, "#fff", 0.22) + fl(...K(11.8, 5.4), 3.8, 2.2, KW, DK, 0.22) + fl(...K(9.5, 9.0), 5, 1.1, KW, DK, 0.32);
  inn += wl([KT([[2.4, 3.2], [4.0, 5.2], [4.6, 8.8]])], DK, 0.7, 0.3, 0.4);                                                           // Hinterrand Kaumuskel
  /* Maul: helle Binde, schwarzer Nasenspiegel mit „Bart“ an der Oberlippe, weißes Kinn */
  inn += H.wf(KT([[14.8, 0.6], [16.4, 1.15], [16.9, 4.0], [16.6, 6.8], [16.1, 7.6], [15.0, 7.4], [14.5, 4.3]]), "#c9bba5", 0.55, 0.45);
  inn += H.wf(KT([[16.6, 1.3], [18.0, 1.95], [19.3, 2.9], [20.2, 4.2], [20.2, 5.7], [19.5, 6.6], [18.4, 7.35], [17.4, 7.8], [16.8, 7.2], [17.2, 6.0], [17.1, 4.2]]), "#0f0a08", 1, 0.1);
  inn += H.wf(KT([[12.4, 8.5], [16.4, 8.15], [17.1, 8.6], [15.6, 9.3], [12.6, 9.8]]), "#f2eee6", 0.95, 0.15);
  inn += fl(...K(18.4, 2.9), 1.3, 0.65, KW + 15, "#fff", 0.5) + fl(...K(17.9, 2.2), 0.45, 0.22, KW + 15, "#fff", 0.85) + fl(...K(19.6, 5.6), 0.55, 0.55, KW, "#fff", 0.2);
  if (F) inn += H.haare(KT([[16.9, 1.6], [19.9, 3.4], [20.1, 5.8], [19.0, 7.0], [17.4, 7.6]]), 24, 0, 0.1, [["#000", 1, 0.05, 0.5], ["#5a504a", 1, 0.045, 0.45]], { streu: 180, szene: 0 });
  /* Nasenloch (Komma), Mundspalte, Voraugendrüse */
  inn += L([KT([[19.75, 4.1], [19.2, 4.7], [18.7, 5.5], [18.8, 6.3]])], "#000", 0.55, 0.95) + L([KT([[19.9, 4.35], [19.4, 5.0]])], "#7a7070", 0.12, 0.6) +
    L([KT([[17.3, 7.8], [16.3, 8.2], [15.0, 8.25]])], "#000", 0.2, 0.55) + wl([KT([[8.4, 2.0], [9.6, 2.6]])], "#120a06", 0.4, 0.4, 0.12);
  /* Fell: feine Rauschtextur je Körperzone in Wuchsrichtung (dunkle Unterwolle, helle Haarspitzen) */
  const zone = (n, poly, w) => H.texR("fell", { fx: 0.45, fy: 5.5, farbe: "#1e0c04", staerke: 2.6, schwelle: 0.55, okt: 2 }, w, poly, 0.26) +
    H.texR(n + "l", { fx: 0.5, fy: 6.5, farbe: "#ffd2a0", staerke: 2.6, schwelle: 0.6, okt: 2, seed: 11 }, w, poly, 0.16);
  inn += zone("k", KT([[3.2, -4.5], [21, -4.5], [21, 11.5], [6.4, 11.5]]), KW + 180) +
    zone("h", [[77, -78], [101.2, -101], [102.4, -95], [101.4, -86], [99.5, -82], [95, -52], [80, -55]], 122) +
    zone("r", [[6, -80], [77, -78], [80, -55], [95, -52], [92, -45], [90, -41.5], [80, -39.6], [30, -44], [6, -46]], 176) +
    zone("b", [[12, -46], [30, -44], [35, -44], [26, -30], [24, 0], [14, 0], [14, -0.1], [80, -0.1], [80, -39.6], [90, -41.5], [92, 0], [14, 0]], 92);
  inn += H.haare(rumpf, 300, wuchs, laenge, [["#3a1a08", 1, 0.04, 0.26], ["#f2b878", 0.75, 0.035, 0.22], ["#6e3414", 0.6, 0.045, 0.24]], { krumm: 0.06, streu: 10, nur: (x, y) => !(x > 101 && y < -86) });
  /* Großform: Lichtband auf dem Rücken, Schattenband am Unterleib, Reflexlicht an der Bauchkante */
  inn += H.wf([[14, -76], [34, -78], [58, -73.5], [74, -75], [86, -84], [96, -95], [92, -88], [80, -76], [62, -66], [40, -68], [20, -68]], "#ffbe82", 0.3, 2.5) +
    H.wf([[30, -48], [50, -47.5], [70, -47], [84, -48], [84, -38], [60, -37], [36, -40]], DK, 0.45, 2.6) +
    H.wf([[73, -71], [80, -68], [88, -57], [91, -51], [86, -46], [81, -46], [77, -53], [73, -62]], "#ffd2a0", 0.16, 2.2) +          // Schulter als Masse
    H.wf([[42, -70], [68, -69], [72, -60], [66, -52], [46, -52], [39, -60]], "#ffd2a0", 0.1, 3.5) +                              // Rippen
    H.wf([[14, -72], [29, -73.5], [33, -67], [31, -57], [25, -51], [18, -51], [13, -59]], "#ffd2a0", 0.16, 2.6) +                // Keule
    H.wf([[100.4, -84], [98.6, -78], [95.6, -64], [93.6, -53], [89, -53], [91, -63], [95, -75]], DK, 0.3, 2.2) +             // Halsunterseite
    wl([[[74.5, -64], [76.5, -55], [79, -48], [80.5, -42]]], DK, 1.6, 0.3, 1.1) +                                             // Trizepsrand
    wl([[[33.5, -66], [34.6, -58], [35.6, -50]]], DK, 1.8, 0.22, 1.3) +                                                       // Kniefalte/Flanke

    wl([[[44, -40.6], [58, -39.5], [72, -39.4], [78, -40.4]]], "#e6c49c", 0.6, 0.35, 0.3);
  /* Schlagschatten des Kopfes auf die Kehle, Okklusion am Ohransatz */
  inn += H.wf([[101.5, -87.5], [99.4, -84.6], [98.6, -80], [95.6, -82], [97, -88]], DK, 0.4, 0.9) + fl(...K(0.6, -1.2), 2.6, 1.6, KW, DK, 0.35);
  /* Rand: Randlicht/-schatten, Lichtkante am Rücken */
  inn += H.rim(A, 3.4, 0.9) + wl([[[18, -75.2], [34, -75.2], [50, -72.4], [66, -70.6], [76, -72.6], [84, -78.6], [94, -89.6]]], "#ffd2a0", 1.0, 0.35, 0.45);
  s += H.teil(A, fell, inn, { rand: false });
  /* Haarsaum: Fell steht an Rücken, Bauch und Keule leicht über die Kante */
  s += H.saum(rumpf, 95, wuchs, (x, y) => laenge(x, y) * 0.75, [["#6e3a1a", 1, 0.05, 0.5], ["#d8a070", 0.5, 0.04, 0.4]], { nur: (x, y) => y < -39 && !(x > 100 && y < -84 && y > -100), szene: 0.15 });
  /* ---- Schalen (nah), Afterklauen, Haarsaum am Kronrand ---- */
  s += H.schale(86.2, 91.8, 3.1) + H.schale(21.3, 26.6, 3.0);
  const after = (x, y) => H.teil(H.flaeche([[x + 0.2, y - 0.9], [x + 0.5, y + 0.1], [x - 0.1, y + 0.9], [x - 0.5, y + 0.4], [x - 0.4, y - 0.4]]), "#2a2220", fl(x - 0.1, y - 0.3, 0.35, 0.3, 0, "#fff", 0.4), { rw: 0.06 });
  s += after(83.7, -5.8) + after(19.0, -6.0);
  /* ---- nahes Ohr, nahes Gehörn ---- */
  s += ohrZ(ohrBasis[0], ohrBasis[1], -38, 0.72, false) + gehoern(gehBasis[0], gehBasis[1], 1, false);
  /* Stirnfell wächst bis an die Rose */
  s += H.haare([[gehBasis[0] - 2.2, gehBasis[1] + 1.4], [gehBasis[0] + 2.4, gehBasis[1] + 1.6], [gehBasis[0] + 1.6, gehBasis[1] - 0.2], [gehBasis[0] - 1.6, gehBasis[1] - 0.2]], 30, 250, 0.8, [["#3a2618", 1, 0.05, 0.75], ["#8a6a50", 0.5, 0.04, 0.6]], { szene: 0, streu: 40 });
  /* Auge mit langen Wimpern, Glanz, feuchtem Lidrand */
  const au = K(6.6, 1.0);
  s += fl(au[0] - 0.2, au[1] - 1.1, 2.6, 1.0, KW - 14, DK, 0.45) + T.augeReal(au[0], au[1], 1.3, { iris: "#24140a", iris2: "#0a0503", pupille: "quer", offen: 0.8, winkel: KW - 14, wimpern: 15, wimpernLaenge: 0.8, lid: "#0e0806", haut: "#24160c" });
  s += fl(au[0] + 1.65, au[1] + 0.47, 0.48, 0.36, KW, "#1a0e08", 0.95);
  /* Tasthaare an Oberlippe und Kinn */
  if (F) s += T.schnurrhaare(...K(17.2, 6.9), 6, 2.0, KW + 25, 50, "#1a120c", 0.035) + T.schnurrhaare(...K(14.6, 8.9), 4, 1.5, KW + 80, 40, "#e8e0d0", 0.03);
  return { svg: s, box: [9.8, -121.5, 124.4, 0], fuesse: [24, 30, 83, 89], kopf: [95, -124, 127, -77] };
}

module.exports = [
  { id: "reh", de: "das Reh", syl: "REH", it: "il capriolo", itSyl: "ca-pri-O-lo", en: "roe deer", gruppe: "Wald", lebensraum: "Wald",
    laenge: 1.15, hoehe: 1.22, zeichne: reh },
];
