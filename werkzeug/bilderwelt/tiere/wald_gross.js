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
function kit(T, box = [-60, -320, 620, 40], grob = 0.5) {
  const F = T.fein;
  /* Zahlen: fein auf 1 mm, in der Szene gröber (unsichtbar klein, spart Bytes) */
  const q = F ? 10 : 1 / grob, f = (n) => String(Math.round(n * q) / q);
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
  inn += H.haare(rumpf, 280, wuchs, laenge, [["#3a1a08", 1, 0.04, 0.26], ["#f2b878", 0.75, 0.035, 0.22], ["#6e3414", 0.6, 0.045, 0.24]], { krumm: 0.06, streu: 10, nur: (x, y) => !(x > 101 && y < -86) });
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
  return { svg: s, box: [9.8, -119.3, 117.7, 0], fuesse: [24, 30, 83, 89], kopf: [95, -124, 127, -77] };
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
  const H = kit(T, [-10, -280, 250, 6], 1), { fl, wl, L, F, f } = H;
  H.minFl = 8;
  const DK = "#1e0e06";
  /* ---- Kopf: lokales System (Genick = 0, Nase bei x ≈ 48), um 36° geneigt ---- */
  const KX = 176, KY = -178, KW = 36, KS = 1.08;
  const K = H.pt(KX, KY, KW, KS), KT = (pts) => H.tr(pts, KX, KY, KW, KS);
  const kopf = KT([[-1, -3], [4, -5.4], [10, -6.8], [16, -6.6], [21, -5.2], [27, -2.9], [34, -0.7], [40, 1.1], [44, 2.5], [47, 4.4], [48.2, 7.0], [47.7, 9.4],
    [46.3, 11.0], [44.5, 11.8], [42.8, 12.3], [41.8, 13.3], [39.8, 14.3], [35, 14.8], [28, 15.4], [20, 17.0], [13.5, 18.2]]);
  /* ---- Läufe ---- */
  const vorne = [[157.5, -72], [156.8, -64], [155.8, -55], [155.3, -46], [155.8, -40.5], [155.0, -35.5], [154.4, -28], [154.3, -19], [155.0, -13.5], [157.4, -9.0], [159.6, -5.6],
    [159.4, -2.4], [155.4, -1.8], [153.4, -3.6], [151.4, -7.5], [149.6, -12.5], [150.2, -17.5], [150.4, -27], [150.1, -34], [148.7, -39.5], [149.3, -44], [148.5, -54], [147.3, -62], [145.5, -68.5]];
  const hinten = [[62, -84], [60.6, -78.5], [57.4, -71.5], [53, -64.5], [48.4, -58.4], [45.2, -53.4], [44.2, -48], [43.6, -36], [43.6, -22], [44.2, -13.5], [46.6, -9.0], [48.8, -5.6],
    [48.6, -2.4], [44.6, -1.8], [42.6, -3.6], [40.6, -7.5], [38.8, -12.5], [39.4, -18], [39.6, -30], [39.3, -42], [38.2, -48], [35.9, -54.2, 1], [36.5, -58], [36.3, -64], [34.4, -72], [31.2, -80]];
  const ruecken = [[24, -121], [34, -127], [46, -129.5], [58, -129.2], [72, -127.6], [90, -126.6], [108, -127.6], [120, -131.4], [129, -136.4], [137, -142.6], [146, -151.4], [155, -160.6], [164, -169.4], [171.4, -175.4]];
  const kehle = [[175.4, -148], [174.6, -140], [173.6, -130], [172.4, -120], [171.0, -110], [170.0, -100], [167.2, -90], [161.6, -80.5]];
  const rumpf = ruecken.concat(kopf).concat(kehle).concat(vorne)
    .concat([[142.4, -71.6], [136, -71], [124, -69.6], [110, -69.6], [96, -70.6], [82, -72.6], [71, -75.6], [64.6, -80]])
    .concat(hinten).concat([[26.6, -89], [22.8, -99], [22.4, -108], [23, -115]]);
  const A = H.flaeche(rumpf);
  const wuchs = (x, y) => {
    if (y > -70 || (x > 146 && x < 160 && y > -76) || (x < 64 && x > 34 && y > -84)) return 92;
    if (x > 168 && y < -150) return 216;
    if (x > 128) return 112 + Math.max(0, x - 150) * 0.6;
    if (x < 36) return 104;
    return 178 - Math.min(1, Math.max(0, (y + 118) / 46)) * 72;
  };
  const laenge = (x, y) => (y > -70 ? 1.2 : x > 168 && y < -150 ? 1.0 : x > 128 ? 4.2 : 2.0);
  /* ---- Lauscher ---- */
  const ohr = [[-3.2, 0], [-4.8, -4.2], [-5.2, -9], [-4.4, -13.6], [-2.4, -17.2], [0.2, -19.6, 1], [2.4, -17.4], [4.0, -13.2], [4.5, -8], [3.8, -3.4], [2.8, 0]];
  const ohrRand = [[1.5, -1.4], [3.4, -6], [3.6, -12.6], [2.4, -17.6], [0.6, -20.8], [1.2, -17.4], [1.9, -12.4], [1.8, -6.4], [0.6, -2.0]];
  const ohrZ = (ox, oy, w, sx, fern) => {
    const tr = (pts) => H.tr(pts.map((p) => [p[0] * sx, p[1], p[2]]), ox, oy, w);
    const P = tr(ohr), I = tr(ohrRand), B = H.flaeche(P);
    const gO = fern ? "#4a3a2e" : T.lg("oh", [[0, "#54402f"], [0.5, "#7a6450"], [1, "#665040"]], 0, 1, 0, 0);
    let inn = fl(...tr([[-1.2, -5]])[0].slice(0, 2), 3.4 * sx, 6, w, "#000", fern ? 0.2 : 0.3);
    if (!fern) {
      inn += H.wf(I, "#2a1e18", 0.85, 0.4) + H.wf(tr([[1.8, -2.2], [3.1, -6.6], [3.3, -12.4], [2.2, -17], [1.9, -12.4], [1.8, -6.6]]), "#d6ccbe", 0.55, 0.45) +
        H.haare(I, 32, w - 94, 3.0, [["#f8f2ea", 1, 0.05, 0.75], ["#cfc4b4", 0.5, 0.045, 0.55]], { streu: 10, krumm: 0.12, szene: 0 });
      inn += H.haare(P, 20, w - 92, 0.9, [["#2a1c14", 1, 0.06, 0.4], ["#b8a290", 0.6, 0.05, 0.35]], { szene: 0, nur: (x, y) => !T.inPoly(x, y, I) });
    }
    inn += H.rim(B, 2.2, 0.9) + H.L([tr([[-5.0, -9], [-4.3, -14.6], [-2.4, -18.8], [0.4, -21.8], [2.3, -19.4], [3.6, -15]])], "#140c08", 0.8, fern ? 0.5 : 0.7);
    return H.teil(B, gO, inn, { rand: false });
  };
  /* ---- Geweih (Zwölfender): Stange mit Aug-, Eis-, Mittelsprosse und dreiendiger Krone ---- */
  const geweih = (bx, by, s0, w0, fern) => {
    const P = (pts) => H.tr(pts, bx, by, w0, s0);
    const braun = fern ? "#2e2016" : T.lg("gw", [[0, "#3a2614"], [0.55, "#5a3e26"], [1, "#7a5e40"]], 0, 1, 0, 0);
    const ast = (J, spitze) => {
      const k = H.kette(P(J.map((q) => [q[0], q[1], q[2] * 1.3, q[3] * 1.3]))), B = H.flaeche(k.pts), t = P([spitze])[0];
      return H.teil(B, braun, (fern ? "" : fl(t[0], t[1], 5.5 * s0, 5.5 * s0, 0, "#f2ead8", 0.95) + fl(t[0], t[1], 2.6 * s0, 2.6 * s0, 0, "#fff", 0.6)) +
        H.rim(B, 1.4, 0.9), { rw: 0.12, randA: 0.55 });
    };
    let g = "";
    /* Sprossen zuerst, die Stange deckt ihre Ansätze */
    g += ast([[1, -4, 1.9, 1.7], [10, -6.4, 1.5, 1.4], [19.5, -9.6, 1.1, 1.1], [27, -15, 0.6, 0.6], [30.5, -21.5, 0.15, 0.15]], [29.6, -19.5]);        // Augsprosse
    g += ast([[-1.4, -11, 1.6, 1.5], [7, -13.6, 1.2, 1.1], [15, -17.4, 0.85, 0.85], [20.5, -23.4, 0.42, 0.42], [22, -27, 0.12, 0.12]], [21.4, -25.4]);   // Eissprosse
    g += ast([[-17.5, -42, 1.5, 1.4], [-9.5, -46, 1.15, 1.1], [-2.5, -52, 0.8, 0.8], [2, -59.5, 0.4, 0.4], [3.2, -63.5, 0.12, 0.12]], [2.8, -61.6]);    // Mittelsprosse
    g += ast([[-19.6, -66, 1.25, 1.2], [-24, -73.5, 0.9, 0.9], [-27.4, -81, 0.45, 0.45], [-28.4, -85.5, 0.12, 0.12]], [-28, -83.6]);                  // Krone hinten
    g += ast([[-18.6, -70, 1.2, 1.15], [-19.4, -78, 0.85, 0.85], [-19.6, -85.5, 0.42, 0.42], [-19.4, -90, 0.12, 0.12]], [-19.5, -88]);                 // Krone Mitte
    /* Stange: von der Rose nach hinten oben, oben wieder nach vorn, endet als vorderes Kronenende */
    const st = H.kette(P([[0, -1, 2.9, 2.8], [-3, -10, 2.6, 2.5], [-9, -22, 2.3, 2.25], [-15, -34, 2.05, 2.0], [-19, -46, 1.8, 1.75], [-21, -57, 1.55, 1.5], [-20, -67, 1.35, 1.35],
      [-16.6, -76, 1.0, 1.0], [-13.6, -83, 0.55, 0.55], [-12, -88, 0.12, 0.12]]));
    const SB = H.flaeche(st.pts), tip = P([[-12.6, -86.4]])[0];
    let perl = "";
    if (F && !fern) {
      const dd = [], dh = [];
      for (let i = 0; i < 42; i++) {
        const t = Math.pow(T.rnd(), 1.4) * 4.5, j = Math.floor(t), u = t - j, q = 0.05 + T.rnd() * 0.9;
        const a = [st.L[j][0] + (st.L[j + 1][0] - st.L[j][0]) * u, st.L[j][1] + (st.L[j + 1][1] - st.L[j][1]) * u];
        const b = [st.R[j][0] + (st.R[j + 1][0] - st.R[j][0]) * u, st.R[j][1] + (st.R[j + 1][1] - st.R[j][1]) * u];
        const x = a[0] + (b[0] - a[0]) * q, y = a[1] + (b[1] - a[1]) * q, rr = (0.3 + T.rnd() * 0.35) * (1 - 0.5 * t / 4.5);
        dd.push([x + rr * 0.35, y + rr * 0.35, rr]); dh.push([x - rr * 0.3, y - rr * 0.3, rr * 0.5]);
      }
      perl = H.punkte(dd, "#120802", 0.55) + H.punkte(dh, "#b89c78", 0.35);
    }
    g += H.teil(SB, braun, (fern ? "" : fl(tip[0], tip[1], 5.5 * s0, 5.5 * s0, 0, "#f2ead8", 0.95)) + perl + H.rim(SB, 2.2, 0.9) +
      (F && !fern ? H.L([st.L.slice(1, 8).map((p, i) => [p[0] * 0.72 + st.R[i + 1][0] * 0.28, p[1] * 0.72 + st.R[i + 1][1] * 0.28])], "#fff", 0.4, 0.22) +
        H.L([st.L.slice(0, 8).map((p, i) => [p[0] * 0.4 + st.R[i][0] * 0.6, p[1] * 0.4 + st.R[i][1] * 0.6])], "#0e0602", 0.2, 0.5) : ""), { rw: 0.12, randA: 0.55 });
    /* Rose */
    if (!F) return g;
    const [rx, ry] = P([[0, -0.6]])[0], rose = [];
    for (let i = 0; i < 14; i++) { const a = Math.PI * 2 * i / 14, q = 1 + (i % 2 ? 0.12 : -0.06); rose.push([rx + Math.cos(a) * 3.8 * s0 * q, ry + Math.sin(a) * 1.4 * s0 * q]); }
    g += H.teil(H.flaeche(rose), fern ? "#22170e" : "#33210f", fern ? "" : fl(rx - 1, ry - 0.6, 2.6, 0.7, 0, "#d8c2a0", 0.5), { rw: 0.1, randA: 0.7 });
    return g;
  };
  /* Laufmodell (nah und fern) */
  const laufV = (dx, k) => wl([[[150.8 + dx, -34], [151.2 + dx, -24], [151.0 + dx, -16]]], "#ffe8cc", 0.6, 0.22 * k, 0.25) + wl([[[152.4 + dx, -34], [152.6 + dx, -18]]], DK, 0.8, 0.35 * k, 0.3) +
    wl([[[156.6 + dx, -64], [155.4 + dx, -50], [155.4 + dx, -38], [154.4 + dx, -20]]], "#ffe6c8", 0.9, 0.28 * k, 0.45) +
    fl(155.2 + dx, -40, 2.2, 3.6, 0, "#fff", 0.24 * k) + fl(149.2 + dx, -40, 1.6, 2.8, 0, DK, 0.4) + fl(152.6 + dx, -12.5, 4, 3.4, 0, DK, 0.42) + fl(154.4 + dx, -15.5, 1.5, 2.4, 0, "#fff", 0.2 * k);
  const laufH = (dx, k) => wl([[[40.2 + dx, -42], [40.6 + dx, -24], [40.4 + dx, -16]]], "#ffe8cc", 0.6, 0.22 * k, 0.25) + wl([[[41.8 + dx, -42], [42.0 + dx, -18]]], DK, 0.8, 0.35 * k, 0.3) +
    wl([[[59 + dx, -80], [54 + dx, -70], [48.4 + dx, -60], [44.2 + dx, -50], [43.8 + dx, -22]]], "#ffe6c8", 0.9, 0.28 * k, 0.45) +
    fl(37.4 + dx, -53.6, 2.4, 3.8, 0, "#fff", 0.24 * k) + fl(44.4 + dx, -51, 1.8, 4.4, 0, DK, 0.32) + fl(41.6 + dx, -12.5, 4, 3.4, 0, DK, 0.42) + fl(43.2 + dx, -15.5, 1.5, 2.4, 0, "#fff", 0.2 * k);
  let s = "";
  /* ---- ferne Läufe ---- */
  const fernV = H.schieb(vorne, -10), fernH = H.schieb(hinten, 10);
  const fernFarbe = T.lg("fern", [[0, "#3e2416"], [0.35, "#4e3220"], [0.7, "#463224"], [1, "#2e221a"]], 0, -80, 0, 0, H.US);
  const fernBein = (P, top) => {
    const Q = top.concat(P), B = H.flaeche(Q);
    return (det) => H.teil(B, fernFarbe, H.haare(Q, 30, 92, 1.1, [["#140a04", 1, 0.08, 0.4], ["#9a7a5a", 0.5, 0.06, 0.25]], { streu: 10 }) + det +
      H.rim(B, 2.6, 0.8) + H.wf([[P[0][0] - 14, -96], [P[0][0] + 14, -96], [P[0][0] + 14, -62], [P[0][0] - 14, -66]], "#000", 0.3, 3), { rand: false });
  };
  s += fernBein(fernH, [[30, -92], [60, -92]])(laufH(10, 0.6)) + fernBein(fernV, [[132, -86], [152, -86]])(laufV(-10, 0.6));
  s += H.schale(52.4, 61.0, 4.8, { farbe: "#221a16", fern: "#110d0b" }) + H.schale(143.4, 152.0, 5.0, { farbe: "#221a16", fern: "#110d0b" });
  /* fernes Ohr und fernes Geweih (hinter dem Kopf) */
  const ohrBasis = K(3.5, -5.4), gehBasis = K(10.5, -6.8);
  s += (F ? ohrZ(ohrBasis[0] + 2, ohrBasis[1] - 1, -36, 0.6, true) : "") + geweih(gehBasis[0] + 5, gehBasis[1] + 0.5, 0.96, -16, true);
  /* ---- Körper ---- */
  const fell = T.lg("fell", [[0, "#5a4030"], [0.25, "#6a4228"], [0.42, "#7e4a2a"], [0.52, "#8a522e"], [0.62, "#7a4c30"], [0.72, "#5e4232"], [0.86, "#4a3628"], [1, "#2e2219"]], 0, -200, 0, 0, H.US);
  let inn = "";
  /* Farbzonen: Kopf graubraun, Mähne dunkel, Läufe/Bauch dunkler, Spiegel creme */
  inn += H.wf(KT([[-2, -9], [50, -9], [50, 20], [10, 22], [-2, 12]]), "#7a6654", 0.6, 2.4);
  inn += H.wf(KT([[2, -7], [16, -8], [26, -4.4], [25, 1.4], [12, 0.8], [2, 2.4]]), "#3e2a1c", 0.55, 1.6);
  inn += H.wf(KT([[38, 2], [48, 5], [48, 12], [44, 13], [38, 13]]), "#8a7c6c", 0.55, 1.2);
  inn += H.wf([[126, -134], [138, -143], [156, -161], [172, -177], [178, -166], [176, -150], [174, -134], [172, -114], [172, -100], [160, -96], [146, -104], [132, -118]], "#3a2618", 0.85, 3.2);
  inn += H.wf([[20, -116], [25, -124], [33, -128.6], [40, -126], [41, -116], [38, -104], [33, -94], [26, -90], [21, -98]], "#e2cfa6", 0.85, 3.2) + fl(28, -110, 6, 11, 0, "#f4e8cc", 0.5);
    inn += H.wf([[32, -78], [62, -82], [60, -64], [48, -46], [44, 0], [34, 0], [34, -54]], "#4a3426", 0.5, 4) + H.wf([[144, -74], [160, -74], [160, 0], [146, 0]], "#4a3426", 0.5, 4);
  /* Großform: Lichtband Rücken, Kernschatten unten, Reflexlicht am Bauch, Muskeln */
  inn += H.wf([[24, -122], [46, -131], [90, -128], [122, -132], [140, -142], [166, -168], [158, -152], [134, -134], [108, -120], [70, -118], [36, -116]], "#ffc890", 0.26, 4) +
    H.wf([[64, -90], [100, -86], [140, -88], [150, -84], [150, -70], [100, -68], [66, -76]], DK, 0.45, 4.5) +
    wl([[[86, -71.2], [110, -70.2], [130, -70.2], [140, -71.6]]], "#d8a878", 1.0, 0.3, 0.6) +
    H.wf([[124, -130], [138, -126], [154, -108], [160, -96], [152, -88], [144, -88], [138, -100], [126, -116]], "#ffc890", 0.16, 3.5) +
    H.wf([[80, -120], [118, -118], [124, -104], [114, -92], [86, -92], [76, -104]], "#ffc890", 0.1, 6) +
    H.wf([[24, -122], [52, -126], [60, -114], [56, -98], [46, -90], [34, -90], [24, -100]], "#ffc890", 0.16, 4.5) +
    H.wf([[176, -152], [174, -140], [172, -124], [170, -106], [162, -100], [164, -124], [168, -146]], DK, 0.3, 3) +
    wl([[[126, -114], [131, -98], [137, -84], [141, -72]]], DK, 3, 0.28, 2) + wl([[[62, -112], [64, -98], [65, -84]]], DK, 3.4, 0.22, 2.4) +
    wl([[[36, -124], [34, -106], [33, -92], [32, -82]]], "#6a3a1a", 2.6, 0.3, 1.6) + fl(70, -100, 9, 18, -10, DK, 0.2) + fl(56, -127, 9, 5, 0, "#ffc890", 0.3);
  inn += laufV(0, 1) + laufH(0, 1);
  /* Kopf: Augenhöhle, Jochbogen, Kaumuskel, Nasenrücken, Tränengrube */
  inn += fl(...K(19.5, 2), 5.5, 3.8, KW, DK, 0.42) + fl(...K(20, -2.6), 5, 1.6, KW, "#ffd2a0", 0.3) + fl(...K(13, 9), 7, 4.4, KW, "#ffd2a0", 0.22) + fl(...K(12, 14.5), 6, 3.4, KW, DK, 0.26) +
    fl(...K(32, 0.6), 10, 2.2, KW, "#fff", 0.2) + fl(...K(31, 9.5), 7, 3.6, KW, DK, 0.22) + fl(...K(26, 15.5), 10, 2, KW, DK, 0.3);
  inn += H.wf(KT([[23.2, 3.4], [25, 3.9], [28.4, 6.6], [28.2, 7.3], [24.8, 5.4], [23.0, 4.3]]), "#1a0e08", 0.75, 0.25) + wl([KT([[23.4, 4.6], [26, 6.0], [28.2, 7.6]])], "#ffe0c0", 0.35, 0.35, 0.12) + fl(...K(25.4, 5.2), 3, 1.4, KW + 30, DK, 0.25);
  inn += wl([KT([[7, 8], [11, 12], [12, 17]])], DK, 1.4, 0.3, 0.8);
  /* Windfang (Nase) dunkel, Äser mit hellem Kinn */
  inn += H.wf(KT([[43.4, 2.4], [45.4, 3.2], [47.4, 4.6], [48.6, 7.0], [48.2, 9.4], [46.8, 10.9], [45.2, 11.2], [44.2, 9.6], [44.4, 6.4], [43.6, 4.2]]), "#1c1614", 1, 0.2);
  inn += H.wf(KT([[36, 13.2], [41.6, 13.0], [42.4, 13.7], [40.4, 14.8], [36, 15.3]]), "#d8cebe", 0.9, 0.3);
  inn += fl(...K(45.6, 4.6), 2.2, 1.1, KW + 15, "#fff", 0.45) + fl(...K(45, 3.8), 0.8, 0.4, KW + 15, "#fff", 0.8);
  inn += L([KT([[47.3, 6.0], [46.4, 7.2], [45.6, 8.6], [45.8, 10.0]])], "#000", 0.9, 0.95) + L([KT([[42.6, 12.4], [40.4, 13.0], [37.6, 13.1]])], "#000", 0.35, 0.6);
  /* Fell: feine Textur je Zone (schwach), Haare in Wuchsrichtung, Brunftmähne lang und strähnig */
  const zone = (poly, w) => H.texR("fell", { fx: 0.3, fy: 3.6, farbe: "#1e0c04", staerke: 2.6, schwelle: 0.55, okt: 2 }, w, poly, 0.2);
  inn += zone(KT([[8, -9], [50, -9], [50, 20], [14, 20]]), KW + 180) + zone([[20, -134], [128, -134], [146, -100], [150, -74], [64, -78], [20, -90]], 176) +
    zone([[30, -90], [64, -84], [60, -70], [48, -56], [46, 0], [34, 0], [34, -0.2], [142, -0.2], [142, -72], [160, -76], [162, 0], [34, 0]], 92);
  inn += H.haare(rumpf, 130, wuchs, laenge, [["#2a1408", 1, 0.07, 0.28], ["#e8a870", 0.7, 0.06, 0.22], ["#5a2c12", 0.6, 0.08, 0.26]], { krumm: 0.06, streu: 10, nur: (x, y) => x < 126 || y > -96 });
  const maehne = [[126, -134], [138, -143], [156, -161], [172, -177], [177, -164], [175.6, -150], [174.4, -136], [172.6, -118], [171.4, -102], [158, -100], [142, -110], [130, -124]];
  inn += H.haare(maehne, 125, (x, y) => (x > 160 ? 100 : 118), 5.2, [["#1a0e06", 1, 0.14, 0.5], ["#6a4a30", 0.6, 0.1, 0.35], ["#9a7656", 0.25, 0.08, 0.3]], { krumm: 0.25, streu: 16 });
  /* Schlagschatten des Kopfes auf den Hals, Okklusion am Ohr */
  inn += H.wf([K(13.5, 18.2), K(6, 17), [168, -154], [170, -146], [174, -148]], DK, 0.4, 1.6) + fl(...K(3, -4), 4.4, 2.6, KW, DK, 0.35);
  inn += H.rim(A, 6, 0.9) + wl([[[30, -126], [60, -128.4], [90, -125.8], [120, -130.4], [134, -136.4]]], "#ffe2c0", 1.6, 0.3, 0.8);
  s += H.teil(A, fell, inn, { rand: false });
  /* Mähne hängt an Kehle und Hals über den Umriss (Brunftmähne) */
  const maehneRand = [[175.6, -150], [175.0, -142], [174.0, -132], [172.8, -122], [171.6, -112], [170.6, -104]];
  s += H.saum(maehneRand, F ? 60 : 24, (x, y) => 96 + (T.rnd() - 0.5) * 20, 6, [["#1e1208", 1, 0.16, 0.6], ["#5a4028", 0.6, 0.12, 0.45]], { offen: true, krumm: 0.3, szene: 0.3 });
  s += H.saum([[129, -136.4], [137, -142.6], [146, -151.4], [155, -160.6], [164, -169.4]], 50, 128, 3.4, [["#2a1a0e", 1, 0.12, 0.55], ["#6a4a30", 0.5, 0.1, 0.4]], { offen: true, krumm: 0.2, szene: 0.1 });
  s += H.saum(rumpf, 70, wuchs, (x, y) => laenge(x, y) * 0.6, [["#5a3018", 1, 0.06, 0.45], ["#c08a5a", 0.5, 0.05, 0.35]], { nur: (x, y) => y < -70 && x < 130, szene: 0 });
  /* Wedel (Schwanz): kurz, oben dunkler */
  const wedel = H.flaeche([[25.6, -121.5], [23, -119.5], [21.6, -114], [21.4, -107.5], [22.8, -105], [24.4, -108.5], [25.6, -114], [27.4, -119.6]]);
  s += H.teil(wedel, T.lg("wd", [[0, "#5a4030"], [1, "#c8b08a"]], 0, 0, 1, 0), H.haare(wedel.pts, 16, 100, 2, [["#3a2a1c", 1, 0.08, 0.5], ["#efe0c0", 0.6, 0.07, 0.5]], { szene: 0 }) + H.rim(wedel, 1.4, 0.8), { rand: false });
  /* ---- Schalen, Afterklauen ---- */
  s += H.schale(153.2, 162.0, 5.0) + H.schale(42.4, 51.0, 4.8);
  const after = (x, y) => H.teil(H.flaeche([[x + 0.3, y - 1.6], [x + 0.9, y + 0.2], [x - 0.2, y + 1.6], [x - 0.9, y + 0.7], [x - 0.7, y - 0.7]]), "#2a2220", fl(x - 0.2, y - 0.5, 0.6, 0.5, 0, "#fff", 0.4), { rw: 0.08 });
  s += after(149.8, -10) + after(39.0, -10);
  /* ---- nahes Ohr, nahes Geweih, Auge ---- */
  s += ohrZ(ohrBasis[0], ohrBasis[1], -58, 0.72, false) + geweih(gehBasis[0], gehBasis[1], 1, -8, false);
  s += H.haare([[gehBasis[0] - 4, gehBasis[1] + 2.4], [gehBasis[0] + 4, gehBasis[1] + 2.8], [gehBasis[0] + 3, gehBasis[1] - 0.4], [gehBasis[0] - 3, gehBasis[1] - 0.4]], 24, 250, 1.4, [["#3a2618", 1, 0.08, 0.7], ["#8a6a50", 0.5, 0.06, 0.55]], { szene: 0, streu: 40 });
  const au = K(19.5, 2.0);
  s += fl(au[0] - 0.4, au[1] - 2.8, 5.6, 2.2, KW - 12, DK, 0.5) +
    T.augeReal(au[0], au[1], 2.5, { iris: "#2a170b", iris2: "#0a0503", pupille: "quer", offen: 0.74, winkel: KW - 12, wimpern: 15, wimpernLaenge: 0.7, lid: "#0e0806", haut: "#24160c" });
  s += fl(au[0] + 3.2, au[1] + 1.05, 1.0, 0.75, KW, "#1a0e08", 0.95);
  if (F) s += T.schnurrhaare(...K(44.6, 11.2), 6, 3.6, KW + 30, 50, "#1a120c", 0.06) + T.schnurrhaare(...K(39.6, 14.2), 4, 2.6, KW + 80, 40, "#e8e0d0", 0.05);
  return { svg: s, box: [21.2, -268.5, 221.7, 0], fuesse: [47, 57, 147, 157], kopf: [150, -275, 232, -145] };
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
  const H = kit(T, [-10, -140, 210, 6], 1), { fl, wl, L, F, f } = H;
  H.minFl = 6;
  const DK = "#0e0a08";
  const KX = 125, KY = -92, KW = 40, KS = 1.12;
  const K = H.pt(KX, KY, KW, KS), KT = (pts) => H.tr(pts, KX, KY, KW, KS);
  const kopf = KT([[-2, -4], [4, -6.2], [10, -5.8], [16, -4.4], [24, -1.8], [32, 0.9], [37.6, 2.6], [41.2, 3.2], [43.4, 4.0], [44.6, 6.6], [44.6, 10.0], [43.8, 12.4],
    [41.4, 13.6], [37, 14.8], [32, 15.8], [27.4, 17.4], [24.2, 20.4], [22.6, 25.6], [21.6, 31.0]]);
  const vorne = [[118.6, -44], [117.4, -36], [115.6, -28], [114.8, -22.6], [114.2, -18], [113.8, -12], [114.2, -8.2], [116.0, -5.2], [117.4, -3.2],
    [117.2, -1.5], [113.6, -1.2], [111.8, -2.8], [110.0, -5.2], [108.4, -8.4], [108.6, -12.4], [108.6, -17.6], [107.6, -22.6], [107.0, -28], [104.8, -34], [101.4, -38.4]];
  const hinten = [[40.6, -42.6], [37.0, -36.4], [32, -30.6], [27, -26.4], [25.6, -21], [25.6, -12.4], [26.4, -8.2], [28.2, -5.2], [29.6, -3.3],
    [29.4, -1.5], [25.8, -1.2], [24.0, -2.8], [22.4, -5.2], [21.2, -8.2], [21.6, -12.4], [21.4, -18], [20.2, -23], [17.8, -27.2, 1], [18.6, -31.4], [17.8, -36.4], [14.8, -42.4], [11.6, -48.6]];
  const ruecken = [[14, -70], [20, -73.6], [30, -76.6], [42, -80.2], [56, -85.0], [70, -90.0], [84, -95.0], [96, -99.4], [104, -101.4], [110, -101.6], [116, -100.4], [121, -97.8]];
  const rumpf = ruecken.concat(kopf).concat([[119.6, -45.8]]).concat(vorne)
    .concat([[100, -36.6], [90, -33.6], [76, -32.4], [62, -33.2], [50, -35.2], [43, -39.0]]).concat(hinten).concat([[9.6, -54.6], [8.4, -61], [9.6, -66.6], [11.6, -70.2]]);
  const A = H.flaeche(rumpf);
  /* Wuchsrichtung: Borsten nach hinten unten, Kopf zu den Ohren, Läufe abwärts */
  const wuchs = (x, y) => {
    if (y > -40 || (x > 104 && x < 119 && y > -46) || (x < 40 && x > 16 && y > -44)) return 94;
    if (x > 134 && y > -96) return 214;
    if (x > 112) return 128;
    return 168 - Math.min(1, Math.max(0, (y + 92) / 46)) * 58;
  };
  const laenge = (x, y) => (y > -40 ? 1.4 : x > 134 && y > -96 ? 1.6 : y < -86 ? 4.2 : 3.2);
  /* ---- Ohr (Teller): klein, dreieckig, behaart ---- */
  const ohrP = [[-3.4, 0], [-4.0, -4.2], [-3.2, -8.4], [-1.2, -11.6], [0.4, -12.4, 1], [1.8, -10.8], [3.2, -7.2], [3.8, -3.2], [3.2, 0]];
  const ohrZ = (ox, oy, w, sx, fern) => {
    const P = H.tr(ohrP.map((p) => [p[0] * sx, p[1], p[2]]), ox, oy, w), B = H.flaeche(P);
    const inn = fl(...H.tr([[0.6, -5]], ox, oy, w)[0].slice(0, 2), 2.6 * sx, 5, w, fern ? "#000" : "#6a5a50", fern ? 0.3 : 0.5) +
      H.haare(P, fern ? 20 : 60, w - 92, 1.6, [["#0e0a08", 1, 0.09, 0.6], ["#8a7a6a", 0.5, 0.07, 0.45]], { streu: 24, szene: 0 }) + H.rim(B, 1.6, 0.9);
    return H.teil(B, fern ? "#1e1814" : "#2e2620", inn, { rand: false }) +
      H.saum(P.slice(2, 7), fern ? 0 : 26, w - 92, 2.2, [["#1a1410", 1, 0.09, 0.6], ["#9a8a78", 0.5, 0.07, 0.5]], { offen: true, szene: 0 });
  };
  /* ---- Läufe: Modell (nah/fern) ---- */
  const laufV = (dx, k) => wl([[[115, -38], [114.4, -28], [114.4, -18], [114, -10]].map((p) => [p[0] + dx, p[1]])], "#c8b8a8", 0.7, 0.2 * k, 0.4) +
    fl(114 + dx, -22.6, 1.6, 2.4, 0, "#fff", 0.16 * k) + fl(108.6 + dx, -22, 1.4, 2.6, 0, DK, 0.4) + fl(111.4 + dx, -8, 3.2, 2.6, 0, DK, 0.4);
  const laufH = (dx, k) => wl([[[36, -40], [31, -32], [26.4, -24], [26, -12]].map((p) => [p[0] + dx, p[1]])], "#c8b8a8", 0.7, 0.2 * k, 0.4) +
    fl(19.4 + dx, -26.6, 1.6, 2.4, 0, "#fff", 0.16 * k) + fl(26 + dx, -24, 1.4, 3, 0, DK, 0.35) + fl(23.6 + dx, -8, 3.2, 2.6, 0, DK, 0.4);
  /* Geäfter: große Afterklauen hinten, fast am Boden */
  const aefter = (x, k) => H.teil(H.flaeche([[x + 0.6, -6.2], [x + 1.0, -3.6], [x - 0.4, -1.2], [x - 1.8, -2.0], [x - 1.4, -4.6]]), k ? "#2a2420" : "#161210",
    fl(x - 0.4, -4.6, 0.7, 0.9, 0, "#fff", 0.35 * k), { rw: 0.08, randA: 0.6 });
  let s = "";
  /* ---- ferne Läufe ---- */
  const fernFarbe = T.lg("fern", [[0, "#2a241e"], [0.5, "#24201c"], [1, "#1a1614"]], 0, -50, 0, 0, H.US);
  const fernBein = (P, top, det) => {
    const Q = top.concat(P), B = H.flaeche(Q);
    return H.teil(B, fernFarbe, H.haare(Q, 40, 94, 1.3, [["#060504", 1, 0.08, 0.45], ["#7a6e62", 0.5, 0.06, 0.3]], { streu: 12 }) + det + H.rim(B, 2, 0.8) +
      H.wf([[P[0][0] - 12, -60], [P[0][0] + 10, -60], [P[0][0] + 10, -36], [P[0][0] - 12, -38]], "#000", 0.3, 2.4), { rand: false });
  };
  const fH = H.schieb(hinten, 8), fV = H.schieb(vorne, -8);
  s += fernBein(fH, [[22, -56], [46, -56]], laufH(8, 0.6)) + fernBein(fV, [[96, -56], [116, -56]], laufV(-8, 0.6));
  s += aefter(29.6, 0) + aefter(101, 0);
  s += H.schale(31.6, 38.0, 3.6, { farbe: "#1e1a17", fern: "#0e0c0a" }) + H.schale(104.2, 110.6, 3.8, { farbe: "#1e1a17", fern: "#0e0c0a" });
  /* fernes Ohr hinter dem Kopf */
  const ohrB = K(4.6, -5.6);
  s += ohrZ(ohrB[0] + 2.6, ohrB[1] - 0.4, -14, 0.66, true);
  /* ---- Körper ---- */
  const fell = T.lg("fell", [[0, "#54463a"], [0.25, "#45382e"], [0.5, "#382c24"], [0.72, "#2a221c"], [0.86, "#1e1814"], [1, "#14100d"]], 0, -104, 0, 0, H.US);
  let inn = "";
  /* Farbzonen: Gesicht/Backen heller grau, Läufe schwarz */
  inn += H.wf(KT([[12, -2], [34, 1], [41, 4], [41, 13], [30, 17], [18, 24], [8, 28], [6, 8]]), "#7a6a5c", 0.5, 2.6);
  inn += H.wf(KT([[4, 12], [20, 13], [26, 18], [16, 25], [6, 30]]), "#8e7e6e", 0.35, 2.4);
  inn += H.wf([[16, -40], [40, -42], [30, -28], [28, 0], [16, 0]], "#100c0a", 0.6, 3) + H.wf([[104, -42], [118, -44], [118, 0], [106, 0]], "#100c0a", 0.6, 3);
  /* Großform: Licht auf Nacken/Schulterbuckel und Kruppe, Kernschatten unten, Reflex am Bauch, Schulter- und Keulenmasse */
  inn += H.wf([[14, -71], [42, -82], [84, -97], [110, -103], [128, -97], [120, -90], [104, -93], [70, -84], [40, -75], [18, -68]], "#d8c8b4", 0.2, 3) +
    H.wf([[40, -48], [70, -47], [100, -50], [108, -44], [104, -36], [70, -31], [42, -38]], DK, 0.5, 3.4) +
    wl([[[52, -36], [76, -33.6], [96, -35.6]]], "#a89888", 0.8, 0.25, 0.5) +
    H.wf([[96, -94], [114, -98], [124, -84], [124, -64], [116, -52], [104, -54], [96, -70]], "#e0d0bc", 0.12, 4) +
    H.wf([[12, -70], [30, -76], [40, -70], [40, -56], [32, -48], [18, -48], [10, -58]], "#e0d0bc", 0.12, 3.6) +
    wl([[[100, -76], [102, -62], [104, -48]]], DK, 4, 0.16, 3) + wl([[[40, -70], [41, -58], [41, -48]]], DK, 4, 0.14, 3) +
    wl([[[126, -66], [124, -56], [120, -48]]], DK, 1.8, 0.3, 1.2);
  inn += laufV(0, 1) + laufH(0, 1);
  /* Kopf: Augenhöhle, Backe, Nasenrücken, Rüsselscheibe, Lippe */
  inn += fl(...K(13.6, -0.4), 3.2, 2.2, KW, DK, 0.45) + fl(...K(12, 12), 8, 6, KW, "#e8d8c4", 0.18) + fl(...K(30, 1.6), 9, 2, KW, "#fff", 0.16) + fl(...K(16, 24), 10, 3, KW, DK, 0.35);
  inn += (F ? H.L([KT([[34, 1.2], [34.6, 3.6]]), KT([[36.6, 1.9], [37.2, 4.2]]), KT([[39.2, 2.6], [39.6, 4.6]]), KT([[31.4, 0.5], [32, 2.6]])], "#0a0806", 0.35, 0.45) : "") +
    wl([KT([[23.6, 14.6], [28, 13.8], [34, 13.0], [39.6, 12.2], [42.4, 11.6]])], "#000", 0.5, 0.6, 0.15) + wl([KT([[24, 15.2], [30, 14.6], [38, 13.6]])], "#a89888", 0.4, 0.3, 0.2) +
    fl(...K(30, 16), 8, 1.6, KW, DK, 0.3) + fl(...K(36, 6), 7, 3.2, KW, "#e8d8c4", 0.12);
  /* Fell: Borsten Haar für Haar, mehrere Lagen (dunkle Basis, graue gespaltene Spitzen) */
  inn += H.texR("fell", { fx: 0.25, fy: 2.4, farbe: "#000", staerke: 2.4, schwelle: 0.56, okt: 2 }, 160, [[8, -104], [134, -104], [128, -60], [104, -40], [40, -40], [8, -50]], 0.22) +
    H.texR("meliert", { fx: 0.18, fy: 0.35, farbe: "#b8a890", staerke: 2.2, schwelle: 0.6, okt: 3, seed: 5 }, 150, [[8, -104], [134, -104], [128, -60], [104, -40], [40, -40], [8, -50]], 0.14);
  inn += H.haare(rumpf, 680, wuchs, laenge, [["#0a0806", 1, 0.09, 0.42], ["#7a6c5e", 0.7, 0.07, 0.36], ["#b8aa96", 0.35, 0.06, 0.35]], { krumm: 0.12, streu: 16 });
  /* Schlagschatten Kopf → Hals, Okklusion am Ohr */
  inn += H.wf([K(24, 21), K(21.6, 31), [119.6, -45.8], [112, -56], [118, -66]], DK, 0.3, 2.4) + fl(...K(4, -4), 4, 2.4, KW, DK, 0.35);
  inn += H.rim(A, 4, 0.9);
  s += H.teil(A, fell, inn, { rand: false });
  /* Borstenkamm: lange Federn entlang Nacken und Rücken, Haarsaum am ganzen Umriss */
  const kamm = [[56, -85.0], [70, -90.0], [84, -95.0], [96, -99.4], [104, -101.4], [110, -101.6], [116, -100.4], [121, -97.8], [125, -95.4]];
  s += H.saum(kamm, F ? 220 : 40, (x, y) => 212 - (x - 56) * 0.12, (x, y) => 3.4 + Math.max(0, 5.4 - Math.abs(x - 108) / 9), [["#080605", 1, 0.16, 0.8], ["#5a4c40", 0.6, 0.12, 0.6], ["#a89680", 0.3, 0.09, 0.5]], { offen: true, krumm: 0.18, streu: 18, szene: 0.4 });
  s += H.saum(rumpf, 150, wuchs, (x, y) => laenge(x, y) * 0.7, [["#0e0a08", 1, 0.08, 0.55], ["#8a7c6c", 0.5, 0.06, 0.45]], { nur: (x, y) => y < -40 && !(x > 134 && y > -96), szene: 0.1 });
  /* Kehlbart: lange Borsten unter Kiefer und Kehle */
  s += H.saum([K(31, 16.0), K(27.4, 17.4), K(24.2, 20.4), K(22.6, 25.6), K(21.6, 31.0)], F ? 80 : 14, 108, 3.2,
    [["#0a0806", 1, 0.12, 0.7], ["#6a5c4e", 0.6, 0.1, 0.55], ["#a8988a", 0.25, 0.08, 0.5]], { offen: true, krumm: 0.22, streu: 22, szene: 0.4 });
  /* Pürzel (Schwanz): hängt glatt, mit Endquaste */
  const pz = H.kette([[13, -68.4, 1.1, 1.1], [10.4, -61, 0.9, 0.9], [9.2, -53, 0.75, 0.75], [9.2, -47, 0.7, 0.7]]);
  const PZ = H.flaeche(pz.pts);
  s += H.teil(PZ, "#1e1814", H.rim(PZ, 0.8, 0.8), { rand: false }) + H.saum([[9.2, -49], [9.4, -45]], F ? 30 : 6, 96, 4.2, [["#0a0806", 1, 0.1, 0.7], ["#5a4e44", 0.5, 0.08, 0.5]], { offen: true, krumm: 0.25, streu: 26, szene: 0.4 });
  /* ---- Schalen und Geäfter (nah) ---- */
  s += aefter(21.6, 1) + aefter(109, 1);
  s += H.schale(23.6, 30.4, 3.6) + H.schale(111.6, 118.4, 3.8);
  /* ---- Rüsselscheibe: nackt, grau-rosa, feucht, zwei Nasenlöcher ---- */
  const sch = KT([[41.6, 3.1], [43.2, 3.7], [44.6, 5.6], [44.8, 8.6], [44.0, 11.8], [42.6, 12.9], [41.8, 11.0], [41.6, 7.0]]);
  const SC = H.flaeche(sch);
  s += H.teil(SC, T.lg("rs", [[0, "#8a7470"], [0.5, "#6e5a56"], [1, "#4a3c3a"]], 0, 0, 1, 0),
    fl(...K(43.8, 6), 1.2, 2.6, KW, "#fff", 0.3) + H.L([KT([[43.8, 6.6], [43.4, 8.0]]), KT([[43.8, 9.6], [43.4, 10.8]])], "#140c0a", 0.9, 0.85) +
    (F ? T.textur ? H.tex("rsr", { fx: 1.2, fy: 1.2, farbe: "#2a1a18", staerke: 2, schwelle: 0.6, okt: 2 }, 0, T.box(sch), 0.3) : "" : ""), { rw: 0.1, randA: 0.6 });
  /* ---- Gewaff: Haderer (oben) und Gewehr (unten) ---- */
  const zahn = (pts, w0, farbe) => {
    const k = H.kette(KT(pts.map((p, i) => [p[0], p[1], w0 * (1 - i / pts.length) + 0.08, w0 * (1 - i / pts.length) + 0.08]))), B = H.flaeche(k.pts);
    return H.teil(B, farbe, fl(...KT([pts[1]])[0].slice(0, 2), 1.2, 0.8, KW, "#fff", 0.6) + H.rim(B, 0.6, 0.9), { rw: 0.08, randA: 0.6 });
  };
  s += zahn([[30.2, 13.4], [30.0, 11.0], [29.0, 9.2], [27.8, 8.4]], 0.8, T.lg("hz", [[0, "#cfc4ae"], [1, "#f6f0e2"]], 0, 1, 0, 0));
  s += zahn([[29.4, 14.6], [28.8, 11.4], [27.0, 8.4], [24.6, 6.4], [22.4, 5.8]], 0.95, T.lg("gz", [[0, "#bcae92"], [0.5, "#efe8d8"], [1, "#fffaf0"]], 0, 1, 0, 0));
  /* ---- nahes Ohr, Auge ---- */
  s += ohrZ(ohrB[0], ohrB[1], -34, 0.78, false);
  const au = K(13.6, -0.4);
  s += fl(au[0] - 0.3, au[1] - 1.4, 2.4, 1.0, KW - 10, DK, 0.5) +
    T.augeReal(au[0], au[1], 1.05, { iris: "#4a2a12", iris2: "#1a0c05", pupille: "rund", offen: 0.7, winkel: KW - 10, wimpern: 12, wimpernLaenge: 0.9, lid: "#0e0806", haut: "#2a2018" });
  s += fl(au[0] + 1.35, au[1] + 0.5, 0.42, 0.32, KW, "#1a0e08", 0.9);
  if (F) s += T.schnurrhaare(...K(40, 13.8), 7, 3.4, KW + 40, 50, "#1a1410", 0.05) + T.schnurrhaare(...K(34, 16), 5, 3, KW + 70, 40, "#cfc6b8", 0.045);
  return { svg: s, box: [7.3, -107.5, 159.3, 0], fuesse: [27, 35, 107, 115], kopf: [110, -110, 162, -48] };
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
  const H = kit(T, [-10, -280, 300, 6], 1), { fl, wl, L, F, f } = H;
  H.minFl = 10;
  const DK = "#0c0806";
  const KX = 202, KY = -181, KW = 42, KS = 1;
  const K = H.pt(KX, KY, KW, KS), KT = (pts) => H.tr(pts, KX, KY, KW, KS);
  const kopf = KT([[-1, -4], [5, -7], [12, -8], [20, -6.6], [30, -4.2], [40, -2.6], [50, -0.8], [57, 0.2], [63, 1.8], [68.2, 5.0], [70.4, 10.2], [69.2, 15.0],
    [66.2, 17.4], [62.2, 17.6], [59.8, 17.8], [57, 19.8], [50, 20.4], [42, 20.8], [32, 23], [22, 26.2], [14, 26.8]]);
  const vorne = [[180, -108], [179, -96], [177.8, -84], [177.4, -72], [177.8, -63], [177, -57], [176.4, -44], [176.4, -30], [177.4, -21], [180.6, -14], [183.4, -9],
    [183.2, -4], [177.6, -3.2], [175.2, -6.4], [172.4, -12.6], [170.2, -20], [170.8, -28], [171, -44], [170.6, -56], [168.6, -62.6], [169.4, -70], [168.4, -84], [166.4, -96], [163.6, -104]];
  const hinten = [[75, -123], [72.4, -114], [68, -104], [62, -94], [56, -84], [52.2, -77], [51, -70], [50.4, -50], [50.6, -30], [51.6, -21], [54.8, -14], [57.6, -9],
    [57.4, -4], [51.8, -3.2], [49.4, -6.4], [46.6, -12.6], [44.2, -20], [45, -28], [45.2, -50], [44.8, -66], [43.2, -74], [40.2, -82, 1], [40.8, -88], [40.4, -96], [38.2, -108], [34.2, -120]];
  const ruecken = [[22, -168], [34, -176], [50, -179], [70, -178], [95, -180], [118, -186], [136, -194], [152, -201], [166, -200], [178, -194], [189, -187], [198, -182.6]];
  const kehle = [[192, -146], [189.4, -138], [187, -128], [185, -118], [183.4, -110.6], [181.6, -108.6]];
  const rumpf = ruecken.concat(kopf).concat(kehle).concat(vorne).concat([[158, -108], [140, -110.6], [120, -110.6], [100, -111.6], [86, -114], [78, -119]])
    .concat(hinten).concat([[28, -134], [24.2, -146], [23, -156], [23.4, -163]]);
  const A = H.flaeche(rumpf);
  const wuchs = (x, y) => {
    if (y > -105 || (x > 162 && x < 182 && y > -112) || (x < 76 && x > 38 && y > -122)) return 93;
    if (x > 196 && y > -185) return 222;
    if (x > 170) return 118;
    if (x > 132 && y < -180) return 150;
    return 172 - Math.min(1, Math.max(0, (y + 170) / 60)) * 70;
  };
  const laenge = (x, y) => (y > -105 ? 1.6 : x > 196 && y > -185 ? 1.4 : (x > 132 && y < -176) || x > 176 ? 5 : 3.2);
  /* ---- Ohr (groß, eselartig) ---- */
  const ohrP = [[-4, 0], [-6.2, -6], [-6.6, -13], [-5, -19.6], [-2.2, -24.4], [0.6, -26.6, 1], [3.2, -23.6], [5.2, -17.6], [5.8, -10.4], [5, -4], [3.6, 0]];
  const ohrI = [[2, -2], [4.2, -8], [4.4, -15.6], [2.8, -21.6], [0.8, -24.6], [1.6, -20.4], [2.4, -14.6], [2.2, -7.6], [0.8, -2.6]];
  const ohrZ = (ox, oy, w, sx, fern) => {
    const tr = (pts) => H.tr(pts.map((p) => [p[0] * sx, p[1], p[2]]), ox, oy, w);
    const P = tr(ohrP), I = tr(ohrI), B = H.flaeche(P);
    let inn = fl(...tr([[-1.4, -7]])[0].slice(0, 2), 4.4 * sx, 8, w, "#000", fern ? 0.25 : 0.32);
    if (!fern) inn += H.wf(I, "#1a120c", 0.8, 0.5) + H.haare(I, 40, w - 94, 3.4, [["#c8bcae", 1, 0.07, 0.6]], { streu: 12, szene: 0 }) +
      H.haare(P, 30, w - 92, 1.2, [["#140e0a", 1, 0.08, 0.4], ["#8a7a68", 0.6, 0.07, 0.35]], { szene: 0, nur: (x, y) => !T.inPoly(x, y, I) });
    inn += H.rim(B, 3, 0.9);
    return H.teil(B, fern ? "#2a2018" : T.lg("oh", [[0, "#3a2c22"], [1, "#5a4838"]], 0, 1, 0, 0), inn, { rand: false });
  };
  /* ---- Schaufel: Hauptschaufel nach hinten-oben mit Enden am Rand, vordere Augschaufel ---- */
  const schaufel = (bx, by, s0, w0, fern) => {
    const P = (pts) => H.tr(pts, bx, by, w0, s0, s0 * 0.78);
    const haupt = P([[-3, -6], [-12, -11], [-26, -13], [-42, -17], [-56, -24], [-65, -33, 1], [-58, -36], [-63, -46, 1], [-54, -46.4], [-56.6, -57.4, 1], [-47.4, -55.6], [-47.6, -66.8, 1],
      [-38.6, -62.6], [-37.8, -72.6, 1], [-29.6, -66.2], [-26.4, -74.6, 1], [-19.6, -66], [-14.6, -72, 1], [-9.6, -61.6], [-5, -46], [-2.6, -30], [-1.6, -16]]);
    const brow = P([[-1, -7], [6, -11.6], [16, -15.6], [25, -16.6, 1], [18.6, -20.4], [27, -25.6, 1], [18.8, -27.6], [22.6, -35, 1], [14.6, -31.4], [6.6, -26], [0.6, -19]]);
    const gS = fern ? "#4a3a2a" : T.lg("sch", [[0, "#5e4a34"], [0.45, "#8a7052"], [1, "#c8b48e"]], 1, 1, 0, 0);
    const SH = H.flaeche(haupt), SB = H.flaeche(brow);
    const adern = (pts) => F && !fern ? H.L(pts.map((q) => P(q)), "#4a3624", 0.35, 0.5) : "";
    let g = H.teil(SB, gS, (fern ? "" : fl(...P([[8, -20]])[0].slice(0, 2), 8, 6, 0, "#5a4430", 0.4) + fl(...P([[22, -22]])[0].slice(0, 2), 6, 6, 0, "#f4ead8", 0.6)) +
      H.rim(SB, 2.4, 0.9), { rw: 0.18, randA: 0.6 });
    g += H.teil(SH, gS, (fern ? "" : fl(...P([[-30, -38]])[0].slice(0, 2), 22, 14, w0, "#4a3624", 0.45) + fl(...P([[-34, -62]])[0].slice(0, 2), 26, 8, w0, "#f4ead8", 0.55) +
      fl(...P([[-56, -40]])[0].slice(0, 2), 9, 12, w0, "#f4ead8", 0.4)) +
      (F && !fern ? H.tex("fell", { fx: 0.2, fy: 2.0, farbe: "#000", staerke: 2.4, schwelle: 0.56, okt: 2 }, 200, T.box(haupt), 0.25) : "") +
      fl(...P([[-12, -20]])[0].slice(0, 2), 14, 8, w0, "#2a1c10", fern ? 0 : 0.4) +
      H.rim(SH, 3.6, 0.9), { rw: 0.18, randA: 0.6 });
    /* Rose und Stangenansatz */
    g += H.teil(H.flaeche(P([[-4.6, 1.6], [-5.6, -4], [-2, -8], [2.6, -6.4], [3.2, 0.6]])), fern ? "#3a2c20" : "#5a4430", fern ? "" : fl(...P([[-1.6, -3]])[0].slice(0, 2), 2.6, 2, 0, "#000", 0.3), { rw: 0.15, randA: 0.6 });
    return g;
  };
  /* ---- Laufmodell ---- */
  const laufV = (dx, k) => wl([[[171.4 + dx, -54], [171.8 + dx, -40], [171.6 + dx, -26]]], "#fff", 0.9, 0.22 * k, 0.3) + wl([[[173.4 + dx, -54], [173.6 + dx, -28]]], DK, 1, 0.3 * k, 0.4) +
    fl(177.2 + dx, -62, 3, 4.4, 0, "#fff", 0.22 * k) + fl(169.6 + dx, -62, 2, 3.6, 0, DK, 0.4) + fl(174.4 + dx, -20, 4.6, 4, 0, DK, 0.4);
  const laufH = (dx, k) => wl([[[45.8 + dx, -66], [46.2 + dx, -44], [46 + dx, -26]]], "#fff", 0.9, 0.22 * k, 0.3) + wl([[[47.8 + dx, -66], [48 + dx, -28]]], DK, 1, 0.3 * k, 0.4) +
    fl(42 + dx, -80, 3, 4.6, 0, "#fff", 0.22 * k) + fl(52 + dx, -76, 2.2, 5, 0, DK, 0.35) + fl(48.4 + dx, -20, 4.6, 4, 0, DK, 0.4);
  const strumpf = (P) => H.wf(P, "#b0a494", 0.9, 6);
  const after = (x, y, k) => H.teil(H.flaeche([[x + 0.6, y - 2.4], [x + 1.4, y + 0.2], [x - 0.2, y + 2.4], [x - 1.4, y + 1.2], [x - 1.2, y - 1]]), k ? "#2a2420" : "#181412", fl(x - 0.3, y - 0.8, 1, 0.8, 0, "#fff", 0.35 * k), { rw: 0.1 });
  let s = "";
  /* ferne Läufe */
  const fernFarbe = T.lg("fern", [[0, "#1e1610"], [0.45, "#241a14"], [0.6, "#7a7064"], [1, "#5a5248"]], 0, -120, 0, 0, H.US);
  const fernBein = (P, top, det) => {
    const Q = top.concat(P), B = H.flaeche(Q);
    return H.teil(B, fernFarbe, H.haare(Q, 40, 93, 1.6, [["#0a0806", 1, 0.1, 0.4], ["#9a8e80", 0.5, 0.08, 0.3]], { streu: 10 }) + det + H.rim(B, 3, 0.8) +
      H.wf([[P[0][0] - 16, -136], [P[0][0] + 16, -136], [P[0][0] + 16, -98], [P[0][0] - 16, -102]], "#000", 0.3, 3), { rand: false });
  };
  const fH = H.schieb(hinten, 12), fV = H.schieb(vorne, -12);
  s += fernBein(fH, [[40, -128], [80, -128]], laufH(12, 0.6)) + fernBein(fV, [[150, -124], [172, -124]], laufV(-12, 0.6));
  s += after(55.8, -16, 0) + after(157.8, -16, 0);
  s += H.schale(58.6, 72.4, 7.0, { farbe: "#221c18", fern: "#100d0b" }) + H.schale(160.6, 174.4, 7.2, { farbe: "#221c18", fern: "#100d0b" });
  /* fernes Ohr, ferne Schaufel */
  const ohrB = K(4.4, -6.6), schB = K(9.5, -7.8);
  s += schaufel(schB[0] + 10, schB[1] - 4, 0.92, -26, true);
  /* ---- Körper ---- */
  const fell = T.lg("fell", [[0, "#54402e"], [0.18, "#3e2e22"], [0.36, "#2e2219"], [0.5, "#251b14"], [0.62, "#1e1611"], [0.75, "#241c17"], [1, "#241c17"]], 0, -205, 0, 0, H.US);
  let inn = "";
  /* Farbzonen: Gesicht heller braun, Muffel grau-braun, helle Strümpfe */
  inn += H.wf(KT([[10, -9], [70, -2], [72, 20], [30, 26], [8, 22]]), "#5a4636", 0.6, 3);
  inn += H.wf(KT([[46, -2], [68, 2], [70, 16], [60, 19], [46, 18]]), "#6a5848", 0.5, 2.6);
  inn += strumpf([[165, -60], [182, -60], [184, 6], [166, 6]]) + strumpf([[38, -76], [56, -72], [58, 6], [42, 6]]);
  /* Großform */
  inn += H.wf([[24, -168], [50, -180], [100, -181], [140, -196], [160, -203], [190, -190], [176, -184], [150, -186], [110, -172], [60, -168], [30, -160]], "#c8a888", 0.22, 5) +
    H.wf([[80, -128], [120, -126], [160, -128], [170, -116], [160, -108], [120, -108], [84, -114]], DK, 0.5, 5) +
    wl([[[96, -110.6], [130, -109.6], [156, -108.6]]], "#9a8268", 1.4, 0.3, 0.8) +
    H.wf([[146, -190], [168, -186], [184, -160], [186, -132], [176, -118], [164, -120], [154, -150]], "#c8a888", 0.12, 6) +
    H.wf([[26, -166], [64, -176], [76, -160], [72, -138], [56, -126], [36, -128], [24, -146]], "#c8a888", 0.13, 6) +
    wl([[[152, -160], [158, -138], [164, -118]]], DK, 4, 0.25, 3) + wl([[[74, -160], [77, -140], [78, -122]]], DK, 4, 0.2, 3.4);
  inn += laufV(0, 1) + laufH(0, 1);
  /* Kopf: Auge, Ramsnase, Muffel, Nasenloch, Lippe */
  inn += fl(...K(21, 0.8), 4.6, 3.4, KW, DK, 0.45) + fl(...K(21, -3.8), 5, 1.8, KW, "#e0c8a8", 0.25) + fl(...K(14, 14), 9, 6, KW, "#e0c8a8", 0.16) + fl(...K(24, 22), 12, 3, KW, DK, 0.3) +
    fl(...K(48, 0.8), 12, 2.6, KW, "#fff", 0.16) + fl(...K(62, 6), 5, 4, KW, "#fff", 0.14) + fl(...K(56, 12), 9, 5, KW, DK, 0.22);
  inn += H.wf(KT([[64.6, 7.2], [66.6, 8.4], [67.2, 12.0], [65.8, 13.2], [64.4, 10.6]]), "#0e0907", 0.9, 0.3) + L([KT([[66.4, 8.6], [67, 11.2]])], "#5a4a40", 0.3, 0.6);
  inn += wl([KT([[52, 18.4], [58, 17.6], [63, 16.8], [66.6, 15.4]])], "#000", 0.7, 0.55, 0.2);
  /* Fell */
  inn += H.texR("fell", { fx: 0.2, fy: 2.0, farbe: "#000", staerke: 2.4, schwelle: 0.56, okt: 2 }, 165, [[22, -205], [190, -205], [186, -110], [160, -105], [76, -112], [22, -140]], 0.2);
  inn += H.haare(rumpf, 360, wuchs, laenge, [["#080604", 1, 0.1, 0.36], ["#7a6a58", 0.6, 0.08, 0.3], ["#b8a48c", 0.25, 0.07, 0.3]], { krumm: 0.12, streu: 14, nur: (x, y) => !(x > 196 && y > -185) });
  inn += H.wf([K(22, 26.2), K(14, 26.8), [192, -146], [189, -142], [194, -150]], DK, 0.4, 2) + fl(...K(4, -4), 6, 3.4, KW, DK, 0.35);
  inn += H.rim(A, 7, 0.9);
  s += H.teil(A, fell, inn, { rand: false });
  /* Mähne auf Buckel und Hals, Haarsaum */
  s += H.saum([[118, -186], [136, -194], [152, -201], [166, -200], [178, -194], [189, -187], [198, -182.6]], F ? 150 : 30, 200, 5.4,
    [["#080604", 1, 0.16, 0.7], ["#4a3a2c", 0.6, 0.12, 0.5], ["#8a7660", 0.25, 0.1, 0.45]], { offen: true, krumm: 0.2, streu: 20, szene: 0.3 });
  s += H.saum(rumpf, 90, wuchs, (x, y) => laenge(x, y) * 0.6, [["#0e0a08", 1, 0.08, 0.5], ["#8a7a68", 0.5, 0.06, 0.4]], { nur: (x, y) => y < -110 && x < 186, szene: 0 });
  /* Wamme (Bart) an der Kehle */
  const wamme = [[197.2, -153], [197.6, -146], [196.8, -138], [195.2, -131], [193.0, -126], [191.0, -129], [190.4, -136], [190.6, -144], [192, -150]];
  const WA = H.flaeche(wamme);
  s += H.teil(WA, "#2a2018", H.haare(wamme, 50, 92, 3.2, [["#080604", 1, 0.12, 0.5], ["#6a5a48", 0.5, 0.1, 0.4]], { szene: 0 }) + H.rim(WA, 3, 0.9), { rand: false }) +
    H.saum([[195.2, -131], [193.0, -126], [191.0, -129]], F ? 50 : 8, 94, 8, [["#080604", 1, 0.12, 0.6], ["#6a5a48", 0.5, 0.1, 0.5]], { offen: true, krumm: 0.25, streu: 24, szene: 0.4 });
  /* Stummelschwanz */
  const sw = H.flaeche([[24, -166], [20, -162], [18.6, -156], [19.6, -152], [22.4, -154], [24.4, -160]]);
  s += H.teil(sw, "#2a2018", H.rim(sw, 1.6, 0.8), { rand: false });
  /* Schalen, Afterklauen */
  s += after(43.8, -16, 1) + after(169.8, -16, 1);
  s += H.schale(46.6, 60.4, 7.0) + H.schale(172.6, 186.4, 7.2);
  /* nahes Ohr, nahe Schaufel, Auge */
  s += schaufel(schB[0], schB[1], 1, -20, false) + ohrZ(ohrB[0], ohrB[1], -52, 0.74, false);
  const au = K(21, 0.8);
  s += fl(au[0] - 0.4, au[1] - 2.4, 4.4, 1.8, KW - 12, DK, 0.5) +
    T.augeReal(au[0], au[1], 1.9, { iris: "#2a170b", iris2: "#0a0503", pupille: "quer", offen: 0.66, winkel: KW - 12, wimpern: 14, wimpernLaenge: 0.8, lid: "#0e0806", haut: "#1e140c" });
  s += fl(au[0] + 2.4, au[1] + 0.9, 0.7, 0.55, KW, "#140c08", 0.9);
  if (F) s += T.schnurrhaare(...K(65.6, 15.6), 7, 4.6, KW + 40, 50, "#1a140e", 0.08);
  return { svg: s, box: [18.6, -228.2, 248.1, 0], fuesse: [53, 65, 167, 179], kopf: [150, -232, 252, -130] };
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
  const H = kit(T, [-10, -230, 300, 6], 1), { fl, wl, L, F, f } = H;
  H.minFl = 10;
  const DK = "#0a0604";
  const KX = 196, KY = -160, KW = 62, KS = 1.12;
  const K = H.pt(KX, KY, KW, KS), KT = (pts) => H.tr(pts, KX, KY, KW, KS);
  const kopf = KT([[-4, -8], [4, -11.6], [12, -12.4], [20, -11.2], [28, -9.2], [36, -7.2], [42, -5.4], [46.4, -3], [48.6, 3], [48.4, 9], [46.8, 13],
    [43.4, 15.4], [36, 18.6], [28, 21.8], [20, 25.6], [12, 28.6]]);
  const vorne = [[180, -80], [179, -66], [178.6, -52], [179, -46], [178, -40], [177.4, -28], [178.4, -16], [181.4, -10], [183.8, -7],
    [183.6, -3], [177.4, -2.6], [174.6, -5], [172.4, -9.6], [170.2, -16], [171, -24], [171.2, -34], [170.8, -40], [168.4, -46], [169.2, -52], [167.8, -64], [165.4, -74], [161, -80]];
  const hinten = [[71, -96], [68, -88], [63, -78], [57, -68], [52.4, -60], [51.4, -54], [51, -38], [51.2, -24], [52, -16], [55.2, -10], [57.6, -7],
    [57.4, -3], [51.4, -2.6], [48.8, -5], [46.6, -9.6], [44.6, -16], [45.6, -24], [46, -38], [45.6, -50], [44.4, -56], [41.4, -63, 1], [42, -69], [41.6, -77], [40, -90], [37, -104]];
  /* Läufe kräftiger (Wisent: stämmig) */
  const breiter = (P, i0, i1) => P.map((p, i) => { const k = Math.min(1, Math.max(0, (-p[1] - 14) / 50)) * 2.2 + 0.5; return [p[0] + (i < i0 ? k : i > i1 ? -k : 0), p[1], p[2]]; });
  const ruecken = [[20, -150], [32, -157], [50, -159.6], [72, -160], [92, -161], [112, -166], [130, -176], [144, -185.6], [154, -188], [165, -187], [176, -181.6], [185, -174], [192, -168]];
  const kehle = [[184.6, -116], [186, -104], [185, -92], [182, -82.4]];
  const vorneB = breiter(vorne, 11, 13), hintenB = breiter(hinten, 11, 13);
  const rumpf = ruecken.concat(kopf).concat(kehle).concat(vorneB).concat([[156, -79.6], [140, -80.4], [120, -82.4], [100, -85.4], [86, -88.4], [76, -92.4]])
    .concat(hintenB).concat([[30.4, -118], [27.4, -130], [25.6, -140], [24.4, -147]]);
  const A = H.flaeche(rumpf);
  const vorderteil = (x, y) => x > 118 - (y + 82) * 0.4;
  const wuchs = (x, y) => {
    if (y > -80 || (x > 160 && x < 182 && y > -84) || (x < 72 && x > 38 && y > -96)) return 94;
    if (x > 190 && y > -170 && y < -112) return 242;
    if (vorderteil(x, y)) return 104 + (T.rnd() - 0.5) * 40;
    return 170 - Math.min(1, Math.max(0, (y + 150) / 56)) * 66;
  };
  const laenge = (x, y) => (y > -80 ? (x > 160 && y > -76 && y < -46 ? 3.4 : 1.6) : x > 190 && y > -170 && y < -112 ? 2.6 : vorderteil(x, y) ? 6.4 : 2.4);
  /* ---- Horn: kurz, schwarz, nach vorn-oben und innen gebogen ---- */
  const horn = (bx, by, s0, fern) => {
    const k = H.kette([[bx - 1, by + 1, 3.2 * s0, 3.2 * s0], [bx + 4 * s0, by + 1.4 * s0, 2.8 * s0, 2.7 * s0], [bx + 8.4 * s0, by - 1.2 * s0, 2.2 * s0, 2.1 * s0], [bx + 10.2 * s0, by - 5.6 * s0, 1.5 * s0, 1.4 * s0],
      [bx + 9.6 * s0, by - 10 * s0, 0.8 * s0, 0.8 * s0], [bx + 7.6 * s0, by - 13 * s0, 0.15, 0.15]]);
    const B = H.flaeche(k.pts);
    return H.teil(B, fern ? "#161210" : T.lg("hn", [[0, "#5a5048"], [0.4, "#2a2420"], [1, "#0e0c0a"]], 0, 1, 1, 0),
      (fern ? "" : fl(bx + 8.6 * s0, by - 3.4 * s0, 2, 3.4, 20, "#fff", 0.35) + (F ? H.L([0.2, 0.4, 0.6].map((u) => [k.L[1].map((v, i) => v * (1 - u) + k.L[2][i] * u), k.R[1].map((v, i) => v * (1 - u) + k.R[2][i] * u)].map((p) => [p[0], p[1]])), "#000", 0.25, 0.4) : "")) +
      H.rim(B, 1.6, 0.9), { rw: 0.12, randA: 0.6 });
  };
  /* ---- Laufmodell ---- */
  const laufV = (dx, k) => wl([[[172.4 + dx, -38], [172.8 + dx, -26], [172.6 + dx, -18]]], "#fff", 0.9, 0.1 * k, 0.4) + wl([[[174.4 + dx, -38], [174.6 + dx, -20]]], DK, 1, 0.3 * k, 0.4) +
    fl(178.4 + dx, -46, 3, 4.4, 0, "#fff", 0.2 * k) + fl(169.6 + dx, -46, 2, 3.6, 0, DK, 0.4) + fl(175.4 + dx, -16, 5, 4, 0, DK, 0.4);
  const laufH = (dx, k) => wl([[[46.6 + dx, -48], [47 + dx, -34], [46.8 + dx, -20]]], "#fff", 0.9, 0.1 * k, 0.4) + wl([[[48.6 + dx, -48], [48.8 + dx, -22]]], DK, 1, 0.3 * k, 0.4) +
    fl(43.2 + dx, -61, 3, 4.6, 0, "#fff", 0.2 * k) + fl(52.4 + dx, -58, 2.2, 5, 0, DK, 0.35) + fl(49.4 + dx, -16, 5, 4, 0, DK, 0.4);
  const after = (x, y, k) => H.teil(H.flaeche([[x + 0.6, y - 2.4], [x + 1.4, y + 0.2], [x - 0.2, y + 2.4], [x - 1.4, y + 1.2], [x - 1.2, y - 1]]), k ? "#2a2420" : "#181412", fl(x - 0.3, y - 0.8, 1, 0.8, 0, "#fff", 0.35 * k), { rw: 0.1 });
  let s = "";
  /* ferne Läufe */
  const fernFarbe = T.lg("fern", [[0, "#2a1c12"], [0.5, "#24180f"], [1, "#1a120c"]], 0, -110, 0, 0, H.US);
  const fernBein = (P, top, det) => {
    const Q = top.concat(P), B = H.flaeche(Q);
    return H.teil(B, fernFarbe, H.haare(Q, 50, 94, 2, [["#060403", 1, 0.12, 0.45], ["#7a6450", 0.5, 0.1, 0.3]], { streu: 14 }) + det + H.rim(B, 3, 0.8) +
      H.wf([[P[0][0] - 16, -118], [P[0][0] + 16, -118], [P[0][0] + 16, -74], [P[0][0] - 16, -78]], "#000", 0.3, 3), { rand: false });
  };
  const fH = H.schieb(hintenB, 12), fV = H.schieb(vorneB, -12);
  s += fernBein(fH, [[40, -110], [80, -110]], laufH(12, 0.6)) + fernBein(fV, [[148, -96], [172, -96]], laufV(-12, 0.6));
  s += after(55.8, -14, 0) + after(161.8, -14, 0);
  s += H.schale(60.6, 74.4, 7.4, { farbe: "#1e1a17", fern: "#0e0c0a" }) + H.schale(164.6, 178.4, 7.6, { farbe: "#1e1a17", fern: "#0e0c0a" });
  /* fernes Horn */
  const hB = K(6, -10.4);
  s += horn(hB[0] + 5, hB[1] - 2.6, 0.9, true);
  /* Schwanz mit Endquaste (hinter der Keule) */
  const sw = H.kette([[21, -149, 1.8, 1.8], [16.4, -134, 1.4, 1.4], [14.2, -116, 1.2, 1.2], [13.6, -98, 1.1, 1.1], [13.8, -86, 1, 1]]);
  const SW = H.flaeche(sw.pts);
  s += H.teil(SW, "#2a1c12", H.rim(SW, 1.6, 0.8), { rand: false }) +
    H.saum([[13.6, -92], [13.8, -84]], F ? 50 : 10, 96, 9, [["#0a0604", 1, 0.14, 0.7], ["#4a3424", 0.5, 0.12, 0.55]], { offen: true, krumm: 0.25, streu: 22, szene: 0.4 });
  /* ---- Körper ---- */
  const fell = T.lg("fell", [[0, "#6a4a2e"], [0.16, "#5a3e26"], [0.3, "#46301e"], [0.45, "#3a2818"], [0.58, "#2e2014"], [0.72, "#24180f"], [1, "#1a120c"]], 0, -195, 0, 0, H.US);
  let inn = "";
  inn += H.wf(KT([[-4, -14], [50, -6], [50, 14], [20, 28], [-2, 8]]), "#2a1c12", 0.55, 3);
  inn += H.wf(KT([[38, -6], [48, -1], [48.6, 10], [44, 14], [38, 12]]), "#4a4038", 0.5, 2.4);
  inn += H.wf([[122, -170], [146, -188], [170, -186], [190, -168], [192, -150], [186, -110], [170, -92], [150, -100], [130, -140]], "#7a5432", 0.3, 10);
  /* Großform */
  inn += H.wf([[22, -150], [50, -160], [92, -162], [130, -176], [154, -190], [190, -176], [170, -176], [130, -164], [90, -152], [40, -146]], "#e0b888", 0.18, 5) +
    H.wf([[76, -106], [120, -104], [160, -104], [168, -90], [150, -80], [110, -83], [80, -90]], DK, 0.5, 5) +
    wl([[[96, -86.4], [130, -83], [154, -81]]], "#8a6a4c", 1.4, 0.3, 0.8) +
    H.wf([[24, -148], [62, -158], [76, -142], [72, -120], [56, -110], [36, -112], [24, -130]], "#e0b888", 0.1, 10) +
    wl([[[74, -150], [77, -130], [78, -110]]], DK, 4, 0.2, 3.4);
  inn += laufV(0, 1) + laufH(0, 1);
  /* Kopf: Auge im Haar, Stirnlocke, Nasenspiegel, Nasenloch */
  inn += fl(...K(17, -1.4), 4.6, 3.4, KW, DK, 0.45) + fl(...K(10, -7), 9, 4, KW, "#c89870", 0.25) + fl(...K(34, 6), 10, 5, KW, DK, 0.25);
  inn += H.wf(KT([[43, -3.4], [46.2, -1.6], [47.8, 3], [47.4, 8], [45.8, 11], [43.4, 10.4], [42.8, 4]]), "#141010", 0.9, 0.4) +
    fl(...K(45.6, 0.6), 1.8, 1.2, KW, "#fff", 0.35) + H.wf(KT([[45, 1.6], [46.8, 2.6], [47, 6], [45.4, 6.2]]), "#000", 0.95, 0.15);
  inn += wl([KT([[38, 14.4], [42, 13.2], [45.2, 11.6]])], "#000", 0.6, 0.5, 0.2);
  /* Fell: wollige Mähne vorn, kürzer hinten */
  inn += H.texR("fell", { fx: 0.2, fy: 1.6, farbe: "#000", staerke: 2.4, schwelle: 0.56, okt: 2 }, 165, [[20, -192], [196, -192], [186, -82], [76, -92], [20, -140]], 0.2);
  inn += H.haare(rumpf, 380, wuchs, laenge, [["#0a0604", 1, 0.12, 0.42], ["#8a6440", 0.6, 0.1, 0.36], ["#b88e60", 0.3, 0.08, 0.32]], { krumm: 0.35, streu: 30, nur: (x, y) => !(x > 190 && y > -170 && y < -112) });
  inn += H.haare(KT([[-2, -12], [26, -10], [30, 8], [18, 24], [0, 10]]), 120, (x, y) => 200 + (T.rnd() - 0.5) * 120, 2.2, [["#0a0604", 1, 0.12, 0.5], ["#6a4a30", 0.6, 0.1, 0.45]], { krumm: 0.5, streu: 60, szene: 0 });
  inn += fl(...K(4, -2), 8, 6, KW, DK, 0.3);
  inn += H.rim(A, 7, 0.9);
  s += H.teil(A, fell, inn, { rand: false });
  /* Kehlbart: haarige Masse von Kinn und Kehle bis zur Brust */
  const bart = KT([[42, 12.6], [34, 15.6], [24, 19.4], [14, 23.4]]).concat([[176, -128], [182.4, -120], [186, -106], [183.6, -100], [179, -108]]).concat(KT([[18, 36], [28, 31], [38, 23.6]]));
  const BA = H.flaeche(bart);
  s += H.teil(BA, "#24180f", H.haare(bart, 90, 98, 5, [["#0a0604", 1, 0.14, 0.55], ["#6a4a30", 0.6, 0.12, 0.45]], { krumm: 0.3, streu: 20, szene: 0 }) + H.rim(BA, 4, 0.8), { rand: false });
  /* Mähne: lange Haare an Buckel, Hals, Kehle, Brust und Unterarm; Kinnbart */
  s += H.saum([[112, -166], [130, -176], [144, -185.6], [154, -188], [165, -187], [176, -181.6], [185, -174], [192, -168]], F ? 150 : 30, 210, 6,
    [["#0a0604", 1, 0.16, 0.65], ["#6a4a2e", 0.6, 0.14, 0.5], ["#a07a50", 0.3, 0.12, 0.45]], { offen: true, krumm: 0.35, streu: 30, szene: 0.3 });
  s += H.saum(kehle.concat([[180, -80], [179, -66], [178.6, -54]]), F ? 150 : 26, 98, 9, [["#0a0604", 1, 0.16, 0.65], ["#5a3c24", 0.6, 0.14, 0.5]], { offen: true, krumm: 0.35, streu: 26, szene: 0.3 });
  s += H.saum(KT([[38, 23.6], [28, 31], [18, 36]]).concat([[179, -108], [183.6, -100]]), F ? 130 : 24, 92, 10, [["#0a0604", 1, 0.18, 0.7], ["#4a3220", 0.6, 0.14, 0.55]], { offen: true, krumm: 0.3, streu: 18, szene: 0.3 });
  s += H.saum([[161, -80], [165.4, -74], [167.8, -64]], F ? 50 : 8, 100, 7, [["#0a0604", 1, 0.14, 0.6], ["#5a3c24", 0.6, 0.12, 0.5]], { offen: true, krumm: 0.3, streu: 24, szene: 0.3 });
  s += H.saum(rumpf, 80, wuchs, (x, y) => laenge(x, y) * 0.5, [["#0e0a08", 1, 0.08, 0.5], ["#8a6a4c", 0.5, 0.06, 0.4]], { nur: (x, y) => y < -90 && x < 112, szene: 0 });
  /* Klauen */
  s += after(43.8, -14, 1) + after(173.8, -14, 1);
  s += H.schale(48.6, 62.4, 7.4) + H.schale(176.6, 190.4, 7.6);
  /* nahes Horn, Auge */
  s += horn(hB[0], hB[1], 1, false);
  const au = K(17, -1.4);
  s += fl(au[0] - 0.4, au[1] - 2.4, 4, 1.8, KW - 30, DK, 0.5) +
    T.augeReal(au[0], au[1], 1.6, { iris: "#2a170b", iris2: "#0a0503", pupille: "quer", offen: 0.62, winkel: KW - 30, wimpern: 12, wimpernLaenge: 0.8, lid: "#0e0806", haut: "#1a120c" });
  s += fl(au[0] + 2, au[1] + 0.6, 0.6, 0.45, KW, "#140c08", 0.9);
  return { svg: s, box: [10, -192.2, 224.8, 0], fuesse: [55, 67, 171, 183], kopf: [166, -192, 230, -96] };
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
  const H = kit(T, [-10, -50, 110, 4]), { fl, wl, L, F, f } = H;
  H.minFl = 2.6;
  const DK = "#0a0908";
  const KX = 64, KY = -24.4, KW = 22, KS = 0.86;
  const K = H.pt(KX, KY, KW, KS), KT = (pts) => H.tr(pts, KX, KY, KW, KS);
  /* Kopf: lokal Hinterkopf = 0, Nase bei x ≈ 23 */
  const kopf = KT([[-1, -2.4], [3, -3.8], [8, -3.6], [13, -2.2], [17.4, -0.4], [20.4, 1.0], [21.8, 2.0], [22.4, 3.2], [22, 4.6], [20.6, 5.2], [18.6, 5.8], [15.4, 7.2], [11, 8.8], [6, 10.4], [2, 11.2]]);
  const rumpf = [[11, -22.6], [16, -25.4], [24, -28], [34, -29.8], [44, -30.2], [54, -29], [61, -27]].concat(kopf)
    .concat([[62.4, -11.4], [63.2, -8.6]])
    .concat([[64.2, -6.2], [65.2, -3.4], [66.4, -1.8], [66.2, -0.6], [61.6, -0.6], [60.2, -2.4], [59.4, -5.4], [58.6, -8.6], [57, -10.6]])
    .concat([[52, -11.4], [44, -11.2], [36, -11.4], [30, -12.2], [26.4, -13.4]])
    .concat([[25.6, -9], [26.6, -4.4], [27.6, -1.8], [27.4, -0.6], [21, -0.6], [18.6, -1.2], [17.6, -3.4], [16.2, -6.6], [14, -10.4]])
    .concat([[11.6, -14.6], [10.4, -18.6]]);
  const A = H.flaeche(rumpf);
  const wuchs = (x, y) => (x > 62 && y < -12 ? 204 : y > -11 ? 96 : 168 - Math.min(1, Math.max(0, (y + 26) / 14)) * 50);
  const laenge = (x, y) => (x > 62 && y < -12 ? 0.6 : y > -11 ? 0.9 : 3.4);
  let s = "";
  /* ferne Beine (schwarz, schwach modelliert) */
  const fernBein = (P) => { const B = H.flaeche(P); return H.teil(B, "#141210", H.haare(P, 30, 96, 0.8, [["#3a3632", 1, 0.06, 0.4]], { streu: 16 }) + H.rim(B, 1.2, 0.8), { rand: false }); };
  s += fernBein([[51, -12], [57, -12], [58.2, -6], [59.6, -2.4], [59.4, -0.6], [54, -0.6], [53.2, -3], [52.4, -7]]) +
    fernBein([[30, -14], [34, -14], [33.6, -8], [34.6, -2.6], [34.4, -0.6], [28.8, -0.6], [28.4, -3], [29, -8]]);
  /* Krallen: lang und gebogen (vorn), kürzer (hinten) */
  const krallen = (x0, n, Lk, fern) => {
    let d = "";
    for (let i = 0; i < n; i++) { const x = x0 + i * 0.7, y = -0.6 - (i % 2) * 0.2; d += `M${f(x)} ${f(y - 0.5)}C${f(x + Lk * 0.45)} ${f(y - 0.8)} ${f(x + Lk * 0.85)} ${f(y - 0.3)} ${f(x + Lk)} ${f(y + 0.55)}`; }
    return `<path d="${d}" fill="none" stroke="${fern ? "#4a4238" : "#8a7e6c"}" stroke-width="${F ? 0.5 : 0.5}" stroke-linecap="round"/>` +
      (F && !fern ? `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width=".12" transform="translate(-.08 -.12)"/>` : "");
  };
  s += krallen(57.4, 4, 2.6, true) + krallen(32.2, 4, 1.3, true);
  /* Schwanz: kurz, buschig, grauweiß */
  const sw = [[12, -23], [7, -22.4], [2.4, -20.2], [0.4, -17.6], [2.6, -16.4], [7, -17.2], [11, -18.6]];
  const SW = H.flaeche(sw);
  s += H.teil(SW, "#a8a294", H.haare(sw, 40, 186, 2.4, [["#2a2622", 1, 0.07, 0.5], ["#f0ece2", 1, 0.06, 0.55]], { streu: 18, szene: 0.2 }), { rand: false }) +
    H.saum(sw.slice(1, 6), F ? 40 : 8, 186, 2.6, [["#3a3632", 1, 0.07, 0.6], ["#f0ece2", 1, 0.06, 0.6]], { offen: true, streu: 30, szene: 0.3 });
  /* ---- Körper ---- */
  const fell = T.lg("fell", [[0, "#b4ae9e"], [0.35, "#9a9486"], [0.55, "#7e786c"], [0.72, "#3a3632"], [0.85, "#1a1816"], [1, "#121110"]], 0, -31, 0, 0, H.US);
  let inn = "";
  /* schwarze Unterseite, Beine, Kehle */
  inn += H.wf([[24, -16], [40, -15], [56, -16], [64, -14], [70, -12], [70, 0], [10, 0], [14, -12]], "#121110", 0.95, 1.2);
  inn += H.wf(KT([[0, 6], [8, 8], [14, 7.4], [12, 12], [0, 14], [-4, 10]]), "#121110", 0.9, 0.8);
  /* Kopf: weiß, zwei schwarze Streifen über Auge und Ohr bis in den Nacken */
  inn += H.wf(KT([[-4, -4], [10, -4], [22, 0.4], [24, 4], [20, 6], [10, 9], [0, 10], [-5, 6]]), "#efece4", 1, 0.3);
  inn += H.wf(KT([[-7, -1.6], [-2, -3.0], [4, -2.4], [10, -1.2], [15, 0.2], [19.6, 1.4], [19.4, 3.0], [14.4, 3.0], [9, 3.6], [3, 4.8], [-2, 5.2], [-7, 3.4]]), "#151311", 1, 0.5) +
    H.wf(KT([[-12, -1], [-6, -1.6], [-6, 3.4], [-12, 3]]), "#3a3632", 0.6, 1.2);
  inn += H.wf(KT([[-3, -3.8], [6, -3.8], [13, -2.0], [18, 0.0], [13, -0.8], [6, -1.8], [-2, -2.0]]), "#fbf9f4", 0.9, 0.3);
  /* Großform: Licht auf dem Rücken, Schatten unten, Rundung */
  inn += H.wf([[12, -23], [24, -28.6], [44, -30.8], [58, -28.6], [52, -26], [32, -25.4], [16, -21]], "#fff", 0.2, 1.4) + fl(34, -22, 16, 5, 0, "#fff", 0.12) +
    H.wf([[18, -17], [40, -16.6], [60, -17.6], [60, -12], [20, -12]], DK, 0.25, 1.6) + fl(58, -20, 4, 6, 0, DK, 0.18) + fl(22, -20, 4, 6, 0, DK, 0.16);
  /* Schnauze: Nasenspiegel schwarz, Nasenloch, Maulspalte */
  inn += H.wf(KT([[19.6, 0.6], [21.4, 1.6], [22.6, 3.0], [22.2, 4.8], [20.6, 5.0], [19.8, 3.0]]), "#0e0c0b", 1, 0.08) + fl(...K(21.2, 1.8), 0.7, 0.35, KW, "#fff", 0.5) +
    L([KT([[22.0, 3.4], [21.4, 3.9]])], "#000", 0.25, 0.8) + L([KT([[19.6, 5.4], [16.6, 6.4], [14.2, 7.2]])], "#000", 0.14, 0.5);
  /* Fell: grau meliert, lange Grannen, Haar für Haar */
  inn += H.texR("fell", { fx: 0.4, fy: 2.4, farbe: "#000", staerke: 2.4, schwelle: 0.56, okt: 2 }, 170, [[10, -31], [62, -31], [62, -14], [10, -14]], 0.22);
  inn += H.haare(rumpf, 520, wuchs, laenge, [["#141210", 1, 0.06, 0.5], ["#f2eee4", 0.9, 0.05, 0.5], ["#6a645a", 0.5, 0.06, 0.4]], { krumm: 0.1, streu: 12, nur: (x, y) => !(x > 62 && y < -10) });
  inn += H.haare(KT([[-1, -2.6], [21, 1], [22, 4.4], [10, 8.6], [0, 9.6]]), 120, KW + 186, 0.5, [["#d8d4ca", 1, 0.035, 0.5], ["#2a2622", 0.4, 0.035, 0.4]], { streu: 14, szene: 0 });
  inn += H.rim(A, 1.4, 0.9);
  s += H.teil(A, fell, inn, { rand: false });
  /* Haarsaum: lange Grannen an Rücken und hängender Fellrock an der Flanke */
  s += H.saum(rumpf.slice(0, 7), F ? 120 : 20, (x, y) => 172, 3.6, [["#141210", 1, 0.07, 0.6], ["#f2eee4", 0.9, 0.06, 0.6]], { offen: true, krumm: 0.15, streu: 18, szene: 0.25 });
  s += H.saum([[57, -10.6], [52, -11.4], [44, -11.2], [36, -11.4], [30, -12.2], [26.4, -13.4]], F ? 90 : 16, 100, 3, [["#121110", 1, 0.08, 0.7], ["#4a4640", 0.5, 0.07, 0.6]], { offen: true, krumm: 0.2, streu: 20, szene: 0.25 });
  /* Ohr: klein, rund, weiß gesäumt, im schwarzen Streifen */
  const oh = KT([[0.2, -1.2], [-0.8, -2.8], [-0.2, -4.4], [1.8, -4.6], [3.0, -3.2], [2.6, -1.4]]);
  const OH = H.flaeche(oh);
  s += H.teil(OH, "#1a1816", H.L([KT([[-0.7, -2.6], [-0.1, -4.3], [1.8, -4.5], [2.9, -3.2]])], "#f4f1ea", 0.55, 0.95) + fl(...K(1.4, -2.6), 1.1, 1.2, KW, "#000", 0.5), { rand: false });
  /* Krallen nah */
  s += krallen(64.6, 4, 2.8, false) + krallen(26.2, 4, 1.4, false);
  /* Auge: klein, dunkel, im Streifen */
  const au = K(12.6, 1.2);
  s += T.augeReal(au[0], au[1], 0.58, { iris: "#2a1408", iris2: "#0a0402", pupille: "rund", offen: 0.85, winkel: KW, lid: "#050404" });
  if (F) s += T.schnurrhaare(...K(20.6, 3.8), 5, 2.2, KW + 10, 40, "#f0ece4", 0.03);
  return { svg: s, box: [-1.4, -30.4, 80.7, 0], fuesse: [27, 32, 57, 64], kopf: [54, -34, 82, -6] };
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
  const H = kit(T, [-10, -50, 130, 4]), { fl, wl, L, F, f } = H;
  H.minFl = 3;
  const DK = "#140a04";
  const KX = 93, KY = -24, KW = 16, KS = 0.86;
  const K = H.pt(KX, KY, KW, KS), KT = (pts) => H.tr(pts, KX, KY, KW, KS);
  const kopf = KT([[0, -1.8], [4, -3.8], [9, -4.2], [14, -3.0], [18, -0.8], [20.8, 1.8], [22.4, 4.6], [22.6, 7.2], [21.8, 9.0], [20.2, 9.8], [18.4, 11.4], [16.2, 12.6], [12, 13.4], [7, 13.6], [2, 13]]);
  const rumpf = [[36.4, -9.4], [37.6, -17], [41.6, -26], [49, -32.4], [59, -35], [69, -33.6], [79, -29.4], [87.4, -25.8]].concat(kopf)
    .concat([[90.4, -10.4], [91.6, -8.4]])
    .concat([[92, -5.6], [93.6, -2.4], [96.6, -1.2], [96.6, -0.4], [90.6, -0.4], [88.6, -1.8], [87.6, -5], [86, -8.4]])
    .concat([[80, -8], [70, -6.8], [61, -6.6]])
    .concat([[59.8, -3.6], [60.6, -1.6], [60.4, -0.4], [45, -0.4], [43.2, -1.6], [42.6, -4.4], [40.6, -7.2]]);
  const A = H.flaeche(rumpf);
  const wuchs = (x, y) => (x > 92 && y < -12 ? 206 : y > -8 ? 100 : 170 - Math.min(1, Math.max(0, (y + 32) / 24)) * 60);
  const laenge = (x, y) => (x > 92 && y < -12 ? 0.6 : y > -8 ? 0.6 : 2.2);
  let s = "";
  /* ferne Füße (dunkel) */
  const fp = (P) => { const B = H.flaeche(P); return H.teil(B, "#2e2018", H.rim(B, 1, 0.8), { rand: false }); };
  s += fp([[83, -8], [87, -8], [88, -3], [90, -1.4], [90, -0.4], [85, -0.4], [84, -3]]) + fp([[52, -6], [57, -6], [66, -1.4], [66, -0.4], [50, -0.4], [50, -3]]);
  /* ---- Kelle: flach, oval, schwarzgrau, mit Hornschuppen (leicht von oben gesehen) ---- */
  const kelle = [[38, -8.6], [32, -10.4], [24, -11.2], [15, -10.4], [9, -8.2], [7.4, -5.6], [9, -3.2], [15, -1.8], [24, -1.6], [32, -2.6], [38, -5]];
  const KE = H.flaeche(kelle);
  let sch = "";
  if (F) {
    let d = "";
    for (let r = 0; r < 6; r++) for (let c = 0; c < 18; c++) {
      const x = 8 + c * 1.7 + (r % 2) * 0.85, y = -10.6 + r * 1.6;
      if (!T.inPoly(x, y, kelle)) continue;
      d += `M${f(x - 0.9)} ${f(y)}L${f(x)} ${f(y - 0.85)}L${f(x + 0.9)} ${f(y)}L${f(x)} ${f(y + 0.85)}Z`;
    }
    sch = `<path d="${d}" fill="none" stroke="#0a0908" stroke-width=".14" stroke-opacity=".7"/><path d="${d}" fill="none" stroke="#8a8680" stroke-width=".08" stroke-opacity=".5" transform="translate(-.12 -.14)"/>`;
  }
  s += H.teil(KE, T.lg("ke", [[0, "#4a4642"], [0.6, "#2e2b28"], [1, "#1a1816"]], 0, 0, 0, 1), sch + fl(22, -8.8, 10, 2, 0, "#fff", 0.2) + H.rim(KE, 1.4, 0.9), { rw: 0.1, randA: 0.6 });
  /* ---- Körper ---- */
  const fell = T.lg("fell", [[0, "#7a4a28"], [0.3, "#6a3e20"], [0.6, "#56331c"], [0.82, "#3e2616"], [1, "#2a1a10"]], 0, -36, 0, 0, H.US);
  let inn = "";
  inn += H.wf([[44, -10], [60, -9], [84, -10], [88, -6], [60, -5], [44, -6]], "#8a6a50", 0.4, 1.6);
  inn += H.wf(KT([[0, -4], [24, 0], [24, 10], [10, 13], [0, 12]]), "#4e301a", 0.5, 1);
  /* Großform: glänzender Rücken (nasses Fell), Kernschatten unten */
  inn += H.wf([[40, -26], [50, -33.6], [60, -36], [72, -33.6], [86, -26.6], [70, -30], [56, -31], [44, -24]], "#ffd8b0", 0.28, 1.2) +
    fl(58, -26, 14, 6, -6, "#ffd8b0", 0.14) + H.wf([[42, -14], [60, -12], [84, -13], [86, -7], [60, -6], [42, -7]], DK, 0.4, 1.6) +
    fl(48, -16, 7, 9, 0, "#ffd8b0", 0.1) + wl([[[57, -12], [59, -8], [60, -5]]], DK, 1.2, 0.3, 0.6);
  /* Kopf: Auge, Backe, Schnauze, Nase */
  inn += fl(...K(10, 0.6), 2.2, 1.6, KW, DK, 0.4) + fl(...K(8, 6), 4, 3, KW, "#ffd8b0", 0.18) + fl(...K(16, 2), 4, 1.4, KW, "#fff", 0.16);
  inn += H.wf(KT([[19.8, 2.2], [21.8, 3.2], [22.8, 5.2], [22.6, 7.2], [21.0, 7.4], [20.4, 5.0]]), "#1a120e", 0.95, 0.12) + fl(...K(21.4, 3.8), 0.7, 0.4, KW, "#fff", 0.5) +
    L([KT([[21.8, 5.4], [21.2, 6.2]])], "#000", 0.25, 0.8) + L([KT([[21.6, 8.0], [20.6, 9.4], [19.4, 10.4]])], "#1a0c06", 0.25, 0.7);
  /* Fell: Grannen glänzend, Haar für Haar */
  inn += H.texR("fell", { fx: 0.5, fy: 3.6, farbe: "#000", staerke: 2.4, schwelle: 0.56, okt: 2 }, 170, [[36, -36], [94, -36], [94, -6], [36, -6]], 0.2);
  inn += H.haare(rumpf, 420, wuchs, laenge, [["#1e1008", 1, 0.05, 0.42], ["#c0804a", 0.7, 0.045, 0.36], ["#f0c090", 0.3, 0.04, 0.3]], { krumm: 0.12, streu: 12, nur: (x, y) => !(x > 92 && y < -12) });
  inn += H.haare(KT([[0, -2], [21, 2], [22, 7], [12, 11], [0, 11]]), 110, KW + 200, 0.5, [["#2a160a", 1, 0.035, 0.5], ["#c08850", 0.6, 0.03, 0.4]], { streu: 16, szene: 0 });
  inn += H.wf([K(8, 12.2), K(3, 11.8), [89.4, -12.4], [88, -10], [91, -15]], DK, 0.35, 0.8);
  inn += H.rim(A, 1.6, 0.9);
  s += H.teil(A, fell, inn, { rand: false });
  s += H.saum(rumpf.slice(1, 9), F ? 90 : 14, 170, 1.8, [["#2a1408", 1, 0.06, 0.6], ["#c0804a", 0.7, 0.05, 0.5]], { offen: true, krumm: 0.15, streu: 16, szene: 0.2 });
  /* Ohr: klein, rund */
  const oh = KT([[1.4, -2.4], [0.8, -4.2], [2.2, -5.2], [3.8, -4.4], [3.8, -2.6]]), OH = H.flaeche(oh);
  s += H.teil(OH, "#3a2414", fl(...K(2.4, -3.4), 0.8, 0.8, 0, "#000", 0.5) + H.rim(OH, 0.6, 0.9), { rand: false });
  /* Nagezähne: orange Schmelzfront */
  const zahn = KT([[19.6, 9.6], [21.2, 9.4], [21.2, 12.0], [20.2, 12.4], [19.6, 12.0]]), ZA = H.flaeche(zahn);
  s += H.teil(ZA, T.lg("zahn", [[0, "#e88a2a"], [0.6, "#c86418"], [1, "#9a4a10"]], 1, 0, 0, 0), H.L([KT([[20.4, 9.6], [20.4, 12.2]])], "#5a2a08", 0.1, 0.7) + fl(...K(20.8, 10.4), 0.3, 0.9, KW, "#fff", 0.5), { rw: 0.08, randA: 0.6 });
  /* Füße: Vorderpfote mit Krallen, großer Hinterfuß mit Schwimmhäuten */
  const pfote = [[89.6, -2.0], [93.2, -2.2], [95.8, -1.2], [96.2, -0.4], [89.8, -0.4]];
  const PF = H.flaeche(pfote);
  s += H.teil(PF, "#3a2a20", H.rim(PF, 0.6, 0.9), { rand: false }) + H.L([[[94.6, -1.2], [96.4, -0.8], [97.2, -0.1]], [[93.8, -0.9], [95.6, -0.5], [96.4, 0]]], "#6a5a4a", 0.22, 0.9);
  const fuss = [[44.6, -2.6], [52, -3.4], [58.6, -3.2], [63, -2.2], [66.4, -0.8], [66.2, -0.2], [44.4, -0.3]];
  const FU = H.flaeche(fuss);
  s += H.teil(FU, T.lg("fu", [[0, "#3a322c"], [1, "#1e1a17"]], 0, 0, 0, 1), (F ? H.L([[[58, -2.6], [61, -1.4], [64.6, -0.4]], [[56, -2.8], [59.6, -1.6], [62.6, -0.4]], [[54, -2.8], [57.4, -1.4], [60, -0.4]]], "#0e0c0a", 0.18, 0.6) : "") +
    fl(56, -2.4, 6, 0.8, 0, "#fff", 0.15) + H.rim(FU, 0.8, 0.9), { rand: false });
  /* Auge, Tasthaare */
  const au = K(10, 0.6);
  s += T.augeReal(au[0], au[1], 0.62, { iris: "#2a1408", iris2: "#0a0402", pupille: "rund", offen: 0.8, winkel: KW, lid: "#0a0604" });
  if (F) s += T.schnurrhaare(...K(19.2, 6.4), 9, 5.4, KW + 12, 46, "#1a120c", 0.045) + T.schnurrhaare(...K(18.4, 7.4), 5, 4.2, KW + 30, 30, "#d8c8b0", 0.035);
  return { svg: s, box: [7.4, -35.2, 110.2, 0], fuesse: [52, 62, 86, 93], kopf: [82, -32, 114, -2] };
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
  const H = kit(T, [-10, -45, 130, 4]), { fl, wl, L, F, f } = H;
  H.minFl = 3;
  const DK = "#120a05";
  const KX = 97, KY = -23.6, KW = 6, KS = 1.05;
  const K = H.pt(KX, KY, KW, KS), KT = (pts) => H.tr(pts, KX, KY, KW, KS);
  /* Kopf flach und breit: lokal Hinterkopf = 0, Nase bei x ≈ 15 */
  const kopf = KT([[0, -1.2], [3, -2.0], [7, -2.0], [10.6, -1.4], [13.2, -0.4], [14.8, 0.8], [15.6, 2.2], [15.4, 3.6], [14.2, 4.6], [12.4, 5.2], [10.4, 5.8], [8, 6.6], [4.6, 7.6], [1.4, 8.6]]);
  /* Schwanz gehört zum Umriss: dick an der Wurzel, spitz, leicht hängend */
  const swk = H.kette([[50, -16.4, 6.0, 5.4], [42, -14.8, 4.8, 4.2], [34, -12.8, 3.9, 3.3], [24, -10.2, 3.0, 2.4], [14, -7.2, 2.0, 1.6], [6, -4.4, 1.0, 0.8], [1.6, -2.6, 0.15, 0.15]]);
  const rumpf = swk.R.slice(1).reverse().map((p) => [p[0], p[1]]).concat([[48, -20.6], [56, -23.4], [66, -24.8], [76, -24.6], [84, -23.4], [91, -22.8], [96, -24.0]]).concat(kopf)
    .concat([[94, -14.4], [90.4, -11.6]])
    .concat([[89.6, -8], [90.4, -3.6], [91.8, -1.6], [94.6, -0.8], [94.6, -0.3], [87.4, -0.3], [85.6, -1.6], [85.0, -4.6], [84.4, -8.2]])
    .concat([[76, -10.2], [66, -10.0], [58, -10.6]])
    .concat([[56.6, -5.6], [58.6, -2.2], [62.6, -0.8], [62.6, -0.3], [52.4, -0.3], [50.4, -1.6], [49.4, -4.8], [47.6, -9.0]]).concat(swk.L.slice(1).map((p) => [p[0], p[1]]));
  const A = H.flaeche(rumpf);
  const wuchs = (x, y) => (x > 95 && y < -14 ? 186 : x < 48 ? 168 : y > -9 ? 98 : 176 - Math.min(1, Math.max(0, (y + 25) / 16)) * 40);
  const laenge = (x, y) => (x > 95 ? 0.45 : y > -9 ? 0.5 : 1.1);
  let s = "";
  /* ferne Beine */
  const fp = (P) => { const B = H.flaeche(P); return H.teil(B, "#24170e", H.haare(P, 20, 98, 0.5, [["#5a4232", 1, 0.04, 0.4]], { szene: 0 }) + H.rim(B, 0.8, 0.8), { rand: false }); };
  s += fp([[79, -11], [83, -11], [83.4, -3.6], [85.6, -1.2], [85.6, -0.3], [80, -0.3], [79, -3]]) + fp([[60, -11], [63.6, -10], [66.4, -1.4], [66.4, -0.3], [59, -0.3], [58.6, -4]]);
  /* ---- Körper ---- */
  const fell = T.lg("fell", [[0, "#62402a"], [0.35, "#52341f"], [0.6, "#422918"], [0.8, "#352113"], [1, "#24160c"]], 0, -27, 0, 0, H.US);
  let inn = "";
  /* helle Kehle, Kinn, Wangen, Brust */
  inn += H.wf(KT([[4, 3.6], [10, 3.8], [14.6, 3.4], [13.4, 5.2], [8, 7.6], [2, 9.4], [-4, 10], [-4, 6]]), "#c4ad90", 0.85, 0.9) +
    H.wf([[86, -16], [94, -15], [92, -10], [86, -9], [82, -11]], "#b09a80", 0.6, 1.2);
  /* Großform: Glanz auf dem Rücken (nasses Fell), Kernschatten unten */
  inn += H.wf([[44, -17], [54, -24.4], [66, -27], [80, -26], [92, -24], [80, -23.4], [64, -24], [50, -19.6]], "#ffd8b0", 0.3, 0.8) +
    H.wf([[48, -14], [70, -13], [86, -14], [86, -10], [50, -10.4]], DK, 0.35, 1.2) + fl(26, -12.4, 16, 1.4, -14, "#ffd8b0", 0.22) + H.wf([[2, -2.6], [24, -8.6], [46, -11], [46, -9], [24, -7], [2, -2]], DK, 0.3, 0.8) + fl(52, -14, 4, 5, 0, DK, 0.18) + fl(86, -15, 3, 5, 0, DK, 0.18);
  /* Kopf: Nasenspiegel (W-förmig), Mund, Augenpartie */
  inn += H.wf(KT([[13.2, 0], [14.2, -0.1], [15.0, 0.9], [15.5, 2.4], [15.0, 3.2], [13.6, 3.0], [13.0, 1.6]]), "#120c0a", 1, 0.06) + fl(...K(14.2, 0.8), 0.6, 0.3, KW, "#fff", 0.5) +
    L([KT([[15.1, 1.8], [14.6, 2.4]])], "#000", 0.2, 0.8) + L([KT([[13.4, 4.6], [11.2, 5.4], [9.4, 5.6]])], "#1a0c06", 0.14, 0.6);
  inn += fl(...K(9.6, -0.2), 1.6, 1.0, KW, DK, 0.35) + fl(...K(5, 2), 3, 2, KW, "#ffd8b0", 0.14);
  /* Fell: dicht, kurz, glänzend */
  inn += H.texR("fell", { fx: 0.6, fy: 4.4, farbe: "#000", staerke: 2.4, schwelle: 0.56, okt: 2 }, 176, [[0, -27], [96, -27], [96, -8], [0, -2]], 0.18);
  inn += H.haare(rumpf, 360, wuchs, laenge, [["#1a0e06", 1, 0.035, 0.4], ["#c08e62", 0.6, 0.03, 0.34], ["#f0c8a0", 0.25, 0.028, 0.3]], { krumm: 0.08, streu: 10 });
  inn += H.rim(A, 1.2, 0.9);
  s += H.teil(A, fell, inn, { rand: false });
  s += H.saum([[48, -20.6], [56, -23.4], [66, -24.8], [76, -24.6], [84, -23.4], [91, -22.8]], F ? 70 : 10, 176, 0.8, [["#2a1a0e", 1, 0.04, 0.6], ["#c08e62", 0.6, 0.035, 0.5]], { offen: true, streu: 14, szene: 0.2 });
  /* Ohr: klein, rund, tief am Kopf */
  const oh = KT([[0.4, -1.2], [0, -2.8], [1.2, -3.6], [2.6, -3.0], [2.6, -1.4]]), OH = H.flaeche(oh);
  s += H.teil(OH, "#3a2416", fl(...K(1.4, -2.2), 0.6, 0.6, 0, "#000", 0.5) + H.L([KT([[0.1, -2.6], [1.2, -3.5], [2.5, -3.0]])], "#d8c0a0", 0.15, 0.6), { rand: false });
  /* Füße mit Schwimmhäuten und Krallen */
  const fuss = (x0, x1, fern) => {
    const P = [[x0, -1.6], [x0 + (x1 - x0) * 0.5, -2.2], [x1, -1.0], [x1 + 0.4, -0.3], [x0 - 0.4, -0.3]], B = H.flaeche(P);
    return H.teil(B, fern ? "#1a120c" : "#2e2018", F && !fern ? H.L([[[x1 - 2.6, -1.4], [x1 - 0.6, -0.6]], [[x1 - 3.6, -1.6], [x1 - 1.6, -0.5]], [[x1 - 4.6, -1.7], [x1 - 2.8, -0.5]]], "#0a0604", 0.12, 0.6) : "", { rand: false }) +
      H.L([[[x1 - 0.2, -0.9], [x1 + 0.6, -0.6], [x1 + 0.9, -0.1]], [[x1 - 1.2, -0.8], [x1 - 0.3, -0.5], [x1, 0]]], fern ? "#4a3e34" : "#8a7a68", 0.18, 0.9);
  };
  s += fuss(86.4, 94.4, false) + fuss(51, 62.4, false);
  /* Auge, Tasthaare (Vibrissen: kräftig, hell) */
  const au = K(10.2, -0.4);
  s += T.augeReal(au[0], au[1], 0.48, { iris: "#2a1408", iris2: "#0a0402", pupille: "rund", offen: 0.86, winkel: KW, lid: "#0a0604" });
  if (F) s += T.schnurrhaare(...K(13.2, 3.4), 12, 6.4, KW + 14, 60, "#f4ecdf", 0.07) + T.schnurrhaare(...K(11.8, 5.6), 5, 3.4, KW + 50, 36, "#e8dccb", 0.04) +
    T.schnurrhaare(...K(9.6, -1.2), 3, 2.6, KW - 50, 30, "#e8dccb", 0.035);
  else s += T.schnurrhaare(...K(13.2, 3.4), 5, 5.6, KW + 12, 56, "#efe6d6", 0.08);
  return { svg: s, box: [1.7, -27.2, 117.5, 0], fuesse: [56, 64, 82, 90], kopf: [88, -32, 120, -6] };
}

module.exports = [
  { id: "reh", de: "das Reh", syl: "REH", it: "il capriolo", itSyl: "ca-pri-O-lo", en: "roe deer", gruppe: "Wald", lebensraum: "Wald",
    laenge: 1.08, hoehe: 1.19, zeichne: reh },
  { id: "hirsch", de: "der Hirsch", syl: "HIRSCH", it: "il cervo", itSyl: "CER-vo", en: "red deer", gruppe: "Wald", lebensraum: "Wald",
    laenge: 2.0, hoehe: 2.69, zeichne: hirsch },
  { id: "wildschwein", de: "das Wildschwein", syl: "WILD-schwein", it: "il cinghiale", itSyl: "cin-GHIA-le", en: "wild boar", gruppe: "Wald", lebensraum: "Wald",
    laenge: 1.52, hoehe: 1.08, zeichne: wildschwein },
  { id: "elch", de: "der Elch", syl: "ELCH", it: "l'alce", itSyl: "AL-ce", en: "moose", gruppe: "Wald", lebensraum: "Wald",
    laenge: 2.3, hoehe: 2.28, zeichne: elch },
  { id: "wisent", de: "der Wisent", syl: "WI-sent", it: "il bisonte europeo", itSyl: "bi-SON-te eu-ro-PE-o", en: "European bison", gruppe: "Wald", lebensraum: "Wald",
    laenge: 2.15, hoehe: 1.92, zeichne: wisent },
  { id: "dachs", de: "der Dachs", syl: "DACHS", it: "il tasso", itSyl: "TAS-so", en: "badger", gruppe: "Wald", lebensraum: "Wald",
    laenge: 0.82, hoehe: 0.3, zeichne: dachs },
  { id: "biber", de: "der Biber", syl: "BI-ber", it: "il castoro", itSyl: "CA-sto-ro", en: "beaver", gruppe: "Wald", lebensraum: "Wald und Fluss",
    laenge: 1.03, hoehe: 0.35, zeichne: biber },
  { id: "fischotter", de: "der Fischotter", syl: "FISCH-ot-ter", it: "la lontra", itSyl: "LON-tra", en: "otter", gruppe: "Wald", lebensraum: "Fluss und Bach",
    laenge: 1.16, hoehe: 0.27, zeichne: fischotter },
];
