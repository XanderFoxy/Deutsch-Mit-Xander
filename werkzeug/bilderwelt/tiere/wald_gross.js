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
function kit(T) {
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
    sd = Math.max(0.1, Math.round(sd * 10) / 10);
    const id = T.id("b" + String(sd).replace(".", "_"));
    if (!bl.has(id)) { bl.add(id); T.def(`<filter id="${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="${sd}"/></filter>`); }
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
  H.fl = (x, y, rx, ry, rot, farbe, op = 1) => {
    let g = flg.get(farbe);
    if (!g) { g = T.rg("f" + farbe.slice(1), [[0, farbe, 1], [0.3, farbe, 0.78], [0.62, farbe, 0.3], [1, farbe, 0]]); flg.set(farbe, g); }
    return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}"${rot ? ` transform="rotate(${Math.round(rot)} ${f(x)} ${f(y)})"` : ""} fill="${g}"${op < 1 ? ` opacity="${op}"` : ""}/>`;
  };
  /* weiche Linie (Muskelfurche, Sehne, Lichtkante): mit Weichzeichner (fein) bzw. dünn (Szene) */
  H.wl = (zuege, farbe, w, op, sd) => {
    const d = zuege.map((p) => G(p, false)).join("");
    if (!F) return sd > 0.9 ? "" : `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${f(w)}" stroke-opacity="${f(op * 0.8)}" stroke-linecap="round"/>`;
    return `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${f(w)}" stroke-opacity="${op}" stroke-linecap="round"${sd ? ` filter="${H.blur(sd)}"` : ""}/>`;
  };
  /* weiche Fläche (Farbzone mit unscharfem Rand) */
  H.wf = (pts, farbe, op, sd) => `<path d="${typeof pts === "string" ? pts : G(pts)}" fill="${farbe}"${op < 1 ? ` opacity="${op}"` : ""}${F && sd ? ` filter="${H.blur(sd)}"` : ""}/>`;
  /* Randlicht/Randschatten: breiter Strich am Umriss, Licht links oben, Schatten rechts unten (in der Fläche geklippt) */
  H.rim = (A, w, op = 1, g) => A.use(`fill="none" stroke="${g || T.lg("rim", [[0, "#fff", 0.45], [0.4, "#fff", 0], [0.6, "#000", 0], [1, "#000", 0.55]], 0, 0, 0.6, 1)}" stroke-width="${f(w)}"${op < 1 ? ` opacity="${op}"` : ""}${F ? ` filter="${H.blur(w * 0.3)}"` : ""}`);
  /* Haare Haar für Haar: n Haare in poly, Wuchsrichtung winkel(x, y) (Grad, 0 = rechts, 90 = unten), Länge laenge(x, y).
     farben: [[farbe, anteil, breite (cm), deckkraft]]. Koordinaten in mm und relativ → klein. Szene: Anteil o.szene (0,25). */
  H.haare = (poly, n, winkel, laenge, farben, o = {}) => {
    const [x0, y0, x1, y1] = T.box(poly);
    const ziel = Math.round(n * (F ? 1 : (o.szene != null ? o.szene : 0.22)));
    const wf = typeof winkel === "function" ? winkel : () => winkel;
    const lf = typeof laenge === "function" ? laenge : () => laenge;
    const summe = farben.reduce((s, c) => s + c[1], 0);
    const eimer = farben.map(() => []);
    const streu = o.streu != null ? o.streu : 16, kr = o.krumm != null ? o.krumm : 0.18;
    let v = 0, g = 0;
    while (g < ziel && v < ziel * 14) {
      v++;
      const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
      if (!T.inPoly(x, y, poly)) continue;
      if (o.nur && !o.nur(x, y)) continue;
      const a = (wf(x, y) + (T.rnd() - 0.5) * streu) * RAD;
      const L = lf(x, y) * (0.6 + T.rnd() * 0.8);
      const ex = Math.cos(a) * L, ey = Math.sin(a) * L, k = kr * L * (T.rnd() - 0.5) * 2;
      let u = T.rnd() * summe, i = 0;
      while (i < farben.length - 1 && u > farben[i][1]) { u -= farben[i][1]; i++; }
      eimer[i].push([Math.round(x * 10), Math.round(y * 10), Math.round((ex / 2 - Math.sin(a) * k) * 10), Math.round((ey / 2 + Math.cos(a) * k) * 10), Math.round(ex * 10), Math.round(ey * 10)]);
      g++;
    }
    return eimer.map((e, i) => {
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
  };
  /* Rauschtextur (Fellstruktur) – nur fein: Rechteck mit Filter, in Wuchsrichtung gedreht */
  H.tex = (n, o, winkel, box, op) => {
    if (!F) return "";
    const url = T.rauschen(n, o);
    const [a, b, c, d] = box, cx = (a + c) / 2, cy = (b + d) / 2, R = Math.hypot(c - a, d - b) / 2 + 1;
    return `<rect x="${f(cx - R)}" y="${f(cy - R)}" width="${f(2 * R)}" height="${f(2 * R)}" filter="${url}" opacity="${op}"${winkel ? ` transform="rotate(${Math.round(winkel)} ${f(cx)} ${f(cy)})"` : ""}/>`;
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
      const p = [[xb + dx + L * 0.06, -h * 0.62 + dy], [xb + dx + L * 0.02, -h * 0.2 + dy], [xb + dx + L * 0.12, -0.05 + dy, 1], [xs + dx, 0 + dy, 1],
        [xs + dx - L * 0.12, -h * 0.28 + dy], [xs + dx - L * 0.42, -h * 0.86 + dy], [xb + dx + L * 0.5, -h * 1.02 + dy], [xb + dx + L * 0.22, -h * 0.9 + dy]];
      const A = H.flaeche(p);
      return H.teil(A, farbe, H.fl(xb + dx + L * 0.55, -h * 0.75 + dy, L * 0.3, h * 0.35, -35, "#fff", 0.3 * op) +
        (F ? H.L([[[xs + dx - L * 0.5, -h * 0.82 + dy], [xs + dx - L * 0.22, -h * 0.4 + dy], [xs + dx - L * 0.05, -h * 0.08 + dy]]], "#fff", L * 0.05, 0.35 * op) +
          H.L([[[xb + dx + L * 0.35, -h * 0.85 + dy], [xb + dx + L * 0.75, -h * 0.25 + dy]], [[xb + dx + L * 0.5, -h * 0.9 + dy], [xb + dx + L * 0.88, -h * 0.3 + dy]]], "#000", L * 0.02, 0.35) : "") +
        H.fl(xb + dx + L * 0.2, -h * 0.2 + dy, L * 0.3, h * 0.4, 0, "#000", 0.35), { rw: L * 0.025, randA: 0.6 });
    };
    let s = kl(L * 0.1, -h * 0.07, o.fern || "#141010", 0.5) + kl(0, 0, fa, 1);
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
  const H = kit(T), { G, fl, wl, L, F, f } = H;
  const DK = "#2a1206";
  let s = "";
  /* ---- Läufe: Umriss vorn (oben → Huf) + hinten (Huf → oben) ---- */
  const vorne = [[89, -42], [88.2, -36], [87.8, -30], [87.7, -25.5], [87.3, -21.5], [87.0, -17], [87.0, -11], [87.5, -7.8], [88.8, -5.0], [89.8, -3.2],
    [89.6, -1.5], [86.5, -1.2], [84.6, -2.8], [83.9, -5.2], [83.2, -7.8], [83.9, -11.5], [84.1, -17], [84.0, -21], [83.2, -24.6], [83.6, -28.5], [83.0, -34], [81.8, -38.5]];
  const hinten = [[32.5, -44.5], [31.2, -41], [28.6, -36.5], [25.2, -31.5], [22.8, -27.2], [22.3, -24], [22.3, -18], [22.4, -12], [22.7, -8], [23.9, -5.3], [24.9, -3.3],
    [24.8, -1.5], [21.6, -1.2], [19.8, -2.8], [19.0, -5.3], [18.3, -8.2], [18.6, -12], [18.6, -18], [18.2, -24], [17.3, -27.8], [16.0, -30.6], [16.3, -33.6], [15.4, -38]];
  /* ---- ferne Läufe (im Schatten) ---- */
  const fernV = H.schieb(vorne, -6.5), fernH = H.schieb(hinten, 6.0);
  const fernFarbe = T.lg("fern", [[0, "#5a3520"], [0.6, "#4a3424"], [1, "#2c2018"]], 0, -45, 0, 0, H.US);
  const fernBein = (P, top) => {
    const A = H.flaeche(top.concat(P));
    return H.teil(A, fernFarbe, H.haare(top.concat(P), 160, 92, 0.7, [["#1c0f07", 1, 0.06, 0.45], ["#8a6a50", 0.6, 0.05, 0.3]], { streu: 10 }) +
      fl(P[3][0] + 1, -24, 2.5, 10, 0, "#000", 0.25), { randA: 0.5 });
  };
  s += fernBein(fernH, [[17, -50], [30, -50]]) + fernBein(fernV, [[78, -48], [88, -48]]);
  s += H.schale(fernH[13][0] - 0.2, fernH[11][0] + 1.6, 2.9, { farbe: "#1e1816", fern: "#0e0b0a" }) + H.schale(fernV[13][0] - 0.2, fernV[11][0] + 1.7, 3.0, { farbe: "#1e1816", fern: "#0e0b0a" });

  /* ---- Kopf im lokalen System (Genick = 0, Nase bei x ≈ 21), um 33° nach unten geneigt ---- */
  const KX = 102.5, KY = -98.2, KW = 33;
  const K = H.pt(KX, KY, KW);
  const kopfOben = [[0, -1.6], [2.6, -2.4], [5.6, -2.5], [8.6, -1.6], [12, -0.3], [15.6, 0.9], [18.6, 2.0], [20.4, 3.0], [21.4, 4.6], [21.2, 6.3], [20.2, 7.3],
    [18.6, 7.8], [17.6, 8.6], [15.6, 9.0], [12.4, 8.9], [8.4, 9.3], [5.0, 9.4], [2.4, 8.3]];
  const kopf = H.tr(kopfOben, KX, KY, KW);
  /* ---- Gesamtumriss: Rücken → Hals → Kopf → Kehle → Brust → Vorderlauf → Bauch → Hinterlauf → Keule ---- */
  const rumpf = [[16, -73.6], [24, -76.6], [34, -76.2], [46, -73.6], [58, -71.6], [68, -71.2], [75, -72.6], [81, -75.4], [88.5, -82], [95.5, -90.4], [100.5, -96.4]]
    .concat(kopf)
    .concat([[101, -82], [98.6, -73], [96.6, -64], [95, -56], [93.6, -50.6], [91.4, -46]])
    .concat(vorne)
    .concat([[79.5, -40.4], [76, -39.6], [68, -38.7], [58, -38.9], [48, -40], [40, -42.2], [35, -45.2]])
    .concat(hinten)
    .concat([[13.4, -44], [10.9, -52], [9.7, -60], [10.6, -66.2], [13, -70.6]]);
  const A = H.flaeche(rumpf);
  const fell = T.lg("fell", [[0, "#6e4a30"], [0.2, "#8a4f2a"], [0.36, "#a65e2c"], [0.52, "#b56d38"], [0.6, "#a87149"], [0.68, "#8d6447"], [0.85, "#6a4c38"], [1, "#3e2c20"]], 0, -112, 0, 0, H.US);
  /* Wuchsrichtung */
  const wuchs = (x, y) => {
    if (y > -40 || (x > 82 && x < 90 && y > -46) || (x < 34 && y > -42)) return 92;          // Läufe
    if (x > 99 && y < -80) return 213;                                                    // Gesicht: zur Stirn
    if (x > 79) return 122 + Math.max(0, (x - 92)) * 1.2;                                 // Hals abwärts
    if (x < 22) return 112;                                                                // Keule
    return 176 - Math.min(1, Math.max(0, (y + 70) / 30)) * 66;                            // Rumpf: nach hinten, Flanke abwärts
  };
  const laenge = (x, y) => (y > -40 ? 0.75 : x > 99 && y < -80 ? 0.65 : x > 79 ? 1.5 : 1.25);
  let inn = "";
  /* Farbzonen: Kopf graubraun, Stirn dunkel, Bauch/Innenseite heller, Läufe graubraun, Spiegel gelblich-weiß */
  inn += H.wf([[99, -86], [104, -104], [116, -104], [128, -90], [126, -76], [110, -76], [101, -79]], "#7b6150", 0.62, 1.4);
  inn += H.wf(H.tr([[1, -3], [6, -3.4], [11, -1.5], [11, 1.2], [6, 0.8], [1, 1.4]], KX, KY, KW), "#3c2616", 0.55, 0.9);
  inn += fl(64, -39, 26, 4.5, 0, "#e2c39c", 0.7) + fl(84, -44, 5, 4, 0, "#d8b48c", 0.5);
  inn += H.wf([[9, -66], [12.5, -70.5], [17.5, -70], [19, -63], [17.5, -54], [12.5, -50], [9.5, -56]], "#ead6aa", 0.85, 1.6);
  inn += fl(13.5, -62, 4, 7, 0, "#f6ead0", 0.6);
  /* Muskeln und Knochen als weiches Licht und Schatten (Licht links oben) */
  inn += fl(79, -63, 8, 13, 28, "#ffd9a8", 0.32) +              // Schulterblatt
    fl(85.5, -55, 5, 6, 0, "#ffe0b8", 0.28) +                     // Buggelenk
    fl(76, -48, 5, 9, 15, DK, 0.35) +                              // Trizeps-Schatten hinter dem Oberarm
    fl(58, -61, 19, 10, 0, "#ffdcae", 0.24) +                     // Rippenbogen
    fl(57, -42, 24, 5, 0, DK, 0.4) +                               // Bauchschatten
    fl(36, -62, 4.5, 9, -12, DK, 0.35) +                           // Hungergrube
    fl(29.5, -71, 6, 3.5, 0, "#ffe2b8", 0.35) +                   // Hüfthöcker
    fl(21, -61, 8.5, 11, 10, "#ffd9a8", 0.3) +                    // Keule
    fl(89, -84, 9, 3.5, -52, "#ffdcae", 0.3) +                    // Halskamm
    fl(98, -74, 3, 9, 14, DK, 0.35) +                              // Kehle
    fl(91, -47, 3.5, 4, 0, DK, 0.35) +                             // Brust unten
    fl(84.5, -32, 1.4, 6, 0, "#fff", 0.16);                        // Unterarm vorn
  inn += wl([[[16.5, -70], [15.6, -60], [15.4, -50], [14.8, -42]]], DK, 1.4, 0.45, 0.7) +                    // Keulenfurche
    wl([[[35.8, -46], [33.6, -51], [30.5, -56]]], DK, 1.2, 0.5, 0.6) +                                      // Kniefalte
    wl([[[100.2, -82], [97, -70], [93.8, -58]]], DK, 0.9, 0.35, 0.6) +                                      // Drosselrinne
    wl([[[71, -70], [77, -61], [84, -53]]], "#ffe6c4", 1.6, 0.25, 0.9) +                                     // Schultergräte
    wl([[[78, -52], [81.5, -45], [80, -41]]], DK, 1.0, 0.35, 0.6) +                                         // Ellbogen
    wl([[[19.5, -60], [25, -50], [29, -45]]], "#ffe0b8", 1.5, 0.2, 0.8);                                    // Oberschenkel vorn
  /* Läufe: Sehnen, Gelenke, Kronrand */
  inn += wl([[[84.3, -21], [84.5, -12], [84.4, -9]], [[18.9, -24], [19.0, -12], [18.8, -9]]], "#ffe8cc", 0.45, 0.4, 0.15) +
    wl([[[85.4, -21], [85.6, -11]], [[19.9, -24], [20.1, -11]]], DK, 0.5, 0.35, 0.2) +
    fl(87.2, -24, 1.3, 2.2, 0, "#fff", 0.2) + fl(83.6, -24.2, 1, 1.6, 0, DK, 0.35) +
    fl(17, -29, 1.6, 2.6, 0, "#fff", 0.2) + fl(21.5, -28, 1.2, 3, 0, DK, 0.3) +
    fl(85.5, -7.5, 2.5, 2, 0, DK, 0.4) + fl(20.5, -8, 2.4, 2, 0, DK, 0.4);
  /* Laufbürste (Mittelfußdrüse) außen am Hinterlauf */
  inn += fl(19.5, -20, 1.4, 2.6, 0, "#d9c3a0", 0.75) + fl(19.5, -20, 0.7, 1.4, 0, "#5a4030", 0.5);
  /* Kopf: Augenhöhle, Jochbogen, Kaumuskel, Nasenrücken */
  const kp = (x, y) => K(x, y);
  inn += fl(...kp(7.4, 1.6), 3.2, 2.3, KW, DK, 0.35) + fl(...kp(5.5, 4.6), 4.5, 3, KW, "#ffe2c0", 0.2) + fl(...kp(4.6, 6.6), 3.4, 2.6, KW, DK, 0.2) +
    fl(...kp(13, -0.2), 6, 1.4, KW, "#fff", 0.2) + fl(...kp(11.5, 5.5), 4, 2.4, KW, DK, 0.18);
  /* Maul: helle Binde, schwarzer Bart, weißes Kinn, Muffel */
  inn += H.wf(H.tr([[16.4, 1.6], [18.6, 1.9], [19.3, 4.5], [18.6, 7.4], [16.2, 7.5], [15.6, 4.6]], KX, KY, KW), "#d9cdbb", 0.85, 0.35);
  inn += H.wf(H.tr([[18.3, 2.1], [21.6, 3.2], [21.8, 6.6], [20.4, 7.6], [18.9, 7.9], [18.2, 6.3], [18.8, 4.8]], KX, KY, KW), "#120c0a", 1, 0.15);
  inn += H.wf(H.tr([[14.2, 8.0], [17.8, 7.7], [18.6, 8.4], [16.5, 9.4], [13.2, 9.3]], KX, KY, KW), "#f1ece2", 0.95, 0.25);
  inn += fl(...kp(20.0, 3.6), 1.2, 0.7, KW, "#fff", 0.55) + fl(...kp(19.2, 2.6), 0.5, 0.3, KW, "#fff", 0.7);
  /* Nasenloch (Komma-Form) und Mundspalte */
  inn += L([H.tr([[20.6, 4.6], [20.1, 5.1], [19.6, 5.9], [19.7, 6.7]], KX, KY, KW)], "#000", 0.45, 0.9) +
    L([H.tr([[19.0, 7.9], [17.6, 8.2], [16.2, 8.15]], KX, KY, KW)], "#000", 0.25, 0.6);
  /* Voraugendrüse */
  inn += L([H.tr([[9.0, 2.4], [10.2, 2.9]], KX, KY, KW)], "#120a06", 0.35, 0.6);
  /* Fell: Rauschtextur (gestreckt) und Haare in Wuchsrichtung, drei Lagen */
  inn += H.tex("reh", { fx: 0.9, fy: 0.12, farbe: "#2a1406", staerke: 2.2, schwelle: 0.55, okt: 3 }, 172, [8, -80, 82, -38], 0.32) +
    H.tex("rehH", { fx: 0.9, fy: 0.12, farbe: "#2a1406", staerke: 2.2, schwelle: 0.55, okt: 3, seed: 9 }, 128, [78, -100, 104, -44], 0.28);
  inn += H.haare(rumpf, 1100, wuchs, laenge, [["#3a1a08", 1, 0.07, 0.32], ["#e8a868", 0.7, 0.06, 0.28], ["#7a3e18", 0.6, 0.08, 0.3]]);
  /* Randlicht/-schatten */
  inn += H.rim(A, 3.2, 0.9) + wl([[[18, -75.2], [34, -75.4], [50, -72.4], [66, -70.4], [76, -71.8], [84, -77.4], [94, -88.4]]], "#ffe6c8", 1.2, 0.35, 0.5);
  s += H.teil(A, fell, inn, { randA: 0.55, rw: 0.14 });
  /* ---- Schalen (nah) mit Haarsaum am Kronrand, Afterklauen ---- */
  s += H.schale(85.0, 93.2, 3.3) + H.schale(20.3, 28.2, 3.1);
  const after = (x, y) => H.teil(H.flaeche([[x - 0.7, y - 1.2], [x + 0.5, y - 1.1], [x + 0.6, y + 0.4], [x - 0.3, y + 1.2], [x - 1, y + 0.3]]), "#1c1614", fl(x - 0.2, y - 0.4, 0.6, 0.5, 0, "#fff", 0.35), { rw: 0.08 });
  s += after(83.3, -6.6) + after(18.5, -6.8);
  s += H.haare([[88.8, -5.0], [90.6, -3.4], [89.4, -2.4], [87, -3.4]], 26, 60, 0.6, [["#3a2a20", 1, 0.06, 0.55]], { szene: 0 }) +
    H.haare([[23.9, -5.0], [25.7, -3.3], [24.6, -2.4], [22.2, -3.3]], 26, 60, 0.6, [["#3a2a20", 1, 0.06, 0.55]], { szene: 0 });

  /* ---- Lauscher (Ohren): fern dunkel, nah mit weißem Innenhaar und dunklem Saum ---- */
  const ohr = [[-2.2, 0], [-3.4, -3], [-3.6, -7], [-2.7, -10.6], [-1.0, -12.8], [0.6, -13.0], [2.3, -11.2], [3.3, -7.6], [3.1, -3.6], [2.3, 0]];
  const innen = [[-1.2, -1.2], [-1.6, -5], [-1.3, -9], [0, -11.6], [1.6, -10.6], [2.4, -7.4], [2.2, -3.6], [1.4, -1]];
  const ohrZ = (ox, oy, w, fern) => {
    const P = H.tr(ohr, ox, oy, w), I = H.tr(innen, ox, oy, w), B = H.flaeche(P);
    const hz = H.haare(I, fern ? 40 : 110, (x, y) => w - 90 + (T.rnd() - 0.5) * 30, 1.4, [["#f4ece0", 1, 0.05, fern ? 0.3 : 0.65]], { streu: 30, krumm: 0.3 });
    return H.teil(B, fern ? "#4a3426" : "#6e5442",
      H.wf(I, fern ? "#2e221a" : "#3a2a20", 0.9, 0.4) + hz + H.rim(B, 1.6, 0.9) +
      H.L([H.tr([[-3.4, -6], [-2.9, -10.4], [-1, -12.6], [0.6, -12.8], [2.3, -11.1], [3.2, -7.8]], ox, oy, w)], "#140c08", 0.55, 0.85) +
      fl(...H.tr([[0.5, -11]], ox, oy, w)[0].slice(0, 2), 1.6, 1.4, 0, "#140c08", 0.5), { randA: 0.6 });
  };
  /* ---- Gehörn (Sechser): Rosenstock, Rose, geperlte Stange, Vorder- und Hintersprosse, helle Enden ---- */
  const gehoern = (bx, by, s0, fern) => {
    const P = (pts) => H.tr(pts, bx, by, 4, s0);
    const stange = H.kette(P([[0.4, -1.8, 1.05, 1.05], [0.3, -5, 0.98, 1.0], [0, -9, 0.82, 0.85], [-0.3, -13, 0.66, 0.68], [-0.2, -16.8, 0.52, 0.52], [0.4, -19.8, 0.36, 0.34], [1.1, -21.8, 0.12, 0.12]]));
    const vorn = H.kette(P([[0.4, -9.6, 0.6, 0.55], [2.6, -11.6, 0.42, 0.4], [4.4, -14.2, 0.12, 0.12]]));
    const hint = H.kette(P([[-0.3, -14.8, 0.5, 0.5], [-2.2, -16.4, 0.34, 0.32], [-3.6, -18.8, 0.1, 0.1]]));
    const gS = T.lg(fern ? "gsf" : "gs", fern ? [[0, "#2a1c12"], [0.8, "#4a3a2a"], [1, "#b8ac94"]] : [[0, "#2e1d10"], [0.45, "#4f3420"], [0.82, "#7a6046"], [0.93, "#d9cdb2"], [1, "#f4eedd"]], 0, 1, 0, 0);
    const gV = T.lg(fern ? "gvf" : "gv", fern ? [[0, "#3a2a1c"], [0.7, "#4a3a2a"], [1, "#b8ac94"]] : [[0, "#4a3020"], [0.6, "#6e5236"], [0.85, "#d4c6a6"], [1, "#f6f0e0"]], 0, 0, 1, 0);
    const gH = T.lg(fern ? "ghf" : "gh", fern ? [[0, "#b8ac94"], [0.3, "#4a3a2a"], [1, "#3a2a1c"]] : [[0, "#f6f0e0"], [0.15, "#d4c6a6"], [0.45, "#6e5236"], [1, "#4a3020"]], 0, 0, 1, 0);
    let g = "";
    const SV = H.flaeche(vorn.pts), SH = H.flaeche(hint.pts), SS = H.flaeche(stange.pts);
    const riefen = (k) => F ? H.L([k.L.map((p, i) => [p[0] * 0.6 + k.R[i][0] * 0.4, p[1] * 0.6 + k.R[i][1] * 0.4]).slice(0, -1)], "#1a0f08", 0.12, 0.45) : "";
    g += H.teil(SV, gV, riefen(vorn) + H.rim(SV, 0.5, 0.9), { rw: 0.08, randA: 0.6 }) + H.teil(SH, gH, riefen(hint) + H.rim(SH, 0.45, 0.9), { rw: 0.08, randA: 0.6 });
    /* Perlen: kleine Höcker an den Kanten der unteren Stange */
    let perl = "";
    if (!fern) {
      let dP = "", dL = "";
      for (let i = 0; i < (F ? 34 : 10); i++) {
        const t = T.rnd() * 3.2, j = Math.floor(t), u = t - j, seite = T.rnd() < 0.5 ? stange.L : stange.R;
        const q = T.rnd() * 0.8;
        const x = seite[j][0] + (seite[j + 1][0] - seite[j][0]) * u, y = seite[j][1] + (seite[j + 1][1] - seite[j][1]) * u;
        const m = [stange.L[j][0] * 0.5 + stange.R[j][0] * 0.5, stange.L[j][1] * 0.5 + stange.R[j][1] * 0.5];
        const px = x + (m[0] - x) * q, py = y + (m[1] - y) * q, rr = 0.16 + T.rnd() * 0.16;
        dP += `M${f(px - rr)} ${f(py)}a${f(rr)} ${f(rr)} 0 1 0 ${f(2 * rr)} 0a${f(rr)} ${f(rr)} 0 1 0 ${f(-2 * rr)} 0`;
        dL += `M${f(px - rr * 0.5)} ${f(py - rr * 0.4)}h.01`;
      }
      perl = `<path d="${dP}" fill="#24160c" stroke="#120a05" stroke-width=".05"/>` + (F ? `<path d="${dL}" stroke="#a89070" stroke-width=".18" stroke-linecap="round"/>` : "");
    }
    g += H.teil(SS, gS, riefen(stange) + H.rim(SS, 0.7, 0.9) + (F ? H.L([stange.L.slice(2, 6).map((p, i) => [p[0] * 0.75 + stange.R[i + 2][0] * 0.25, p[1]])], "#fff", 0.14, 0.3) : ""), { rw: 0.08, randA: 0.6 }) + perl;
    /* Rose (Perlkranz) und Rosenstock */
    const rose = [];
    for (let i = 0; i <= 14; i++) { const a = Math.PI * (i / 14), rr = (i % 2 ? 1.55 : 1.85) * s0; rose.push([bx + Math.cos(Math.PI - a) * rr, by - 1.6 * s0 - Math.sin(a) * 0.75 * s0]); }
    rose.push([bx + 1.5 * s0, by - 0.9 * s0], [bx - 1.5 * s0, by - 0.9 * s0]);
    g = H.teil(H.flaeche([[bx - 1.2 * s0, by + 0.4], [bx - 1.1 * s0, by - 1.4 * s0], [bx + 1.2 * s0, by - 1.4 * s0], [bx + 1.3 * s0, by + 0.4]]), fern ? "#3a2618" : "#5a3a22", "", { rw: 0.08 }) +
      g + H.teil(H.flaeche(rose), fern ? "#2a1a10" : "#3a2414", fern ? "" : fl(bx - 0.6 * s0, by - 2 * s0, 1.2, 0.5, 0, "#d8c0a0", 0.5), { rw: 0.08, randA: 0.6 });
    return g;
  };
  const top = s;
  s = top;
  /* Reihenfolge: fernes Ohr und fernes Gehörn hinter dem Kopf */
  const ohrBasis = K(1.8, -1.2), gehBasis = K(5.0, -2.2);
  let hinter = ohrZ(ohrBasis[0] + 1.6, ohrBasis[1] - 0.4, -38, true) + gehoern(gehBasis[0] + 1.8, gehBasis[1] - 0.2, 0.96, true);
  /* Kopf und Körper liegen über dem fernen Ohr/Gehörn: deshalb zuerst einfügen */
  s = s.replace(/(<use href="#[^"]*t\d+" fill="url\(#[^)]*fell\)"\/>)/, hinter + "$1");
  s += ohrZ(ohrBasis[0], ohrBasis[1], -22, false) + gehoern(gehBasis[0], gehBasis[1], 1, false);
  /* Auge mit langen Wimpern, Glanz, feuchtem Lidrand */
  const au = K(7.4, 1.6);
  s += T.augeReal(au[0], au[1], 0.98, { iris: "#3b2414", iris2: "#100804", pupille: "quer", offen: 0.8, winkel: KW - 8, wimpern: 14, wimpernLaenge: 0.75, lid: "#0e0806", haut: "#2a1a10" });
  /* Tasthaare an Oberlippe und Kinn */
  if (F) s += T.schnurrhaare(...K(18.4, 6.6), 6, 2.2, KW + 20, 50, "#1a120c", 0.04) + T.schnurrhaare(...K(15.5, 8.6), 4, 1.6, KW + 80, 40, "#e8e0d0", 0.035);
  const box = [9.7, -121.5, 124.4, 0];
  return { svg: s, box };
}

module.exports = [
  { id: "reh", de: "das Reh", syl: "REH", it: "il capriolo", itSyl: "ca-pri-O-lo", en: "roe deer", gruppe: "Wald", lebensraum: "Wald",
    laenge: 1.15, hoehe: 1.22, zeichne: reh },
];
