"use strict";
/* =====================================================================
   TIER-BIBLIOTHEK — AFFEN & EXOTEN (FASSUNG 854, MASSSTAB 2)
   Gorilla, Schimpanse, Orang-Utan, Pavian, Katta, Känguru, Koala, Faultier.
   Maße in Zentimetern, Blick nach rechts, Boden y = 0, Licht von links oben.
   Bauweise: jedes Körperteil EINMAL als Pfad (defs), darin geklippt: Grundton, weiche Licht-/Schattenformen
   (Muskeln), Fell Haar für Haar in Wuchsrichtung (dunkel → hell nach Licht), Rausch-Textur; Haut mit T.relief
   (Poren/Falten), Hände/Füße mit Fingernägeln. Haare in Zehntel-cm (ganze Zahlen) → klein.
   ===================================================================== */
const RAD = Math.PI / 180;
const f1 = (n) => String(Math.round(n * 10) / 10).replace(/^(-?)0\./, "$1.");
const kurz = (d) => d.replace(/ -/g, "-");
const UB = ' gradientUnits="userSpaceOnUse"';
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const i10 = (n) => Math.round(n * 10);
/* Farbe mit Deckkraft als #rrggbbaa (kürzer als fill-opacity) */
const hexA = (c, a) => (c.length === 4 ? c.replace(/([0-9a-f])/gi, "$1$1") : c) + Math.round(clamp(a) * 255).toString(16).padStart(2, "0");

/* glatte Kurve (Catmull-Rom) auf 1 mm, relative Befehle (kurz; ohne Rundungsdrift); [x, y, 1] = harte Ecke */
function G(pts, zu = true) {
  const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const q = (v) => Math.round(v * 10);
  let cx = q(pts[0][0]), cy = q(pts[0][1]);
  const z = (v) => String(v / 10).replace(/^(-?)0\./, "$1.");
  let d = `M${z(cx)} ${z(cy)}`;
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    const ex = q(p2[0]), ey = q(p2[1]);
    if (p2[2] === 2) d += `q${z(q(p2[3]) - cx)} ${z(q(p2[4]) - cy)} ${z(ex - cx)} ${z(ey - cy)}`;
    else d += `c${z(q(c1[0]) - cx)} ${z(q(c1[1]) - cy)} ${z(q(c2[0]) - cx)} ${z(q(c2[1]) - cy)} ${z(ex - cx)} ${z(ey - cy)}`;
    cx = ex; cy = ey;
  }
  return kurz(d + (zu ? "Z" : ""));
}
/* Punkte verschieben / spiegeln (für ferne Gliedmaßen) */
const schieb = (pts, dx, dy = 0) => pts.map((p) => [p[0] + dx, p[1] + dy, p[2]]);

/* Werkstatt für EINE Zeichnung */
function werk(T) {
  const W = { B: [], _d: {} };
  let nr = 0;
  /* gleicher Pfad mehrfach → einmal in defs, sonst <use> (spart Bytes) */
  W.pfadId = (d) => { if (!W._d[d]) { const id = T.id("q" + nr++); T.def(`<path id="${id}" d="${d}"/>`); W._d[d] = id; } return W._d[d]; };
  W.box = (pts) => { if (!W.still) for (const p of pts) W.B.push(p); return pts; };
  /* fremdes Teil skaliert einsetzen (ohne Box-Eintrag): Zeichnung f() bei (x, y) mit Faktor k */
  W.skaliert = (x, y, k, f) => { W.still = true; const r = f(); W.still = false; return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${k})">${r}</g>`; };
  /* Ergebnis: box (Umriss), kopf (Bereich für das Kopf-Bild), fuesse (x der Bodenkontakte für den Schatten) */
  W.fertig = (svg, rand = 1, kopf = null, fuesse = null) => {
    const b = T.box(W.B), z = { svg, box: [Math.floor(b[0] - rand), Math.floor(b[1] - rand), Math.ceil(b[2] + rand), 0] };
    if (kopf) z.kopf = kopf;
    if (fuesse) z.fuesse = fuesse;
    return z;
  };
  /* Körperteil: Pfad einmal in defs; Füllung, geklippte Innenzeichnung, Volumen, feiner Rand */
  W.teil = (pts, fill, innen = "", o = {}) => {
    const d = typeof pts === "string" ? pts : G(o.ohneBox ? pts : W.box(pts));
    const id = T.id("p" + nr++);
    T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
    if (!W._d[d]) W._d[d] = id;
    const u = (a) => `<use href="#${id}" ${a}/>`;
    let s = u(`fill="${fill}"`);
    const inn = (typeof innen === "function" ? innen(d) : innen) +
      (o.vol !== false ? u(`fill="${o.volG || T.lg("vol", [[0, "#fff", 0.14], [0.4, "#fff", 0], [0.72, "#000", 0.12], [1, "#000", 0.4]])}"`) : "") + (o.oben || "") +
      /* feiner Rand NUR innen (außen gäbe er auf hellem Grund einen grauen Saum) */
      (o.rand !== 0 && T.fein ? u(`fill="none" stroke="${o.rc || "#0a0806"}" stroke-opacity="${o.rand != null ? o.rand : 0.35}" stroke-width="${f1(2 * (o.rw || 0.4))}"`) : "");
    if (inn) s += `<g clip-path="url(#${id}c)">${inn}</g>`;
    /* Maske: außen um die Volumen-Gruppe (sonst leuchtet die weich ausgeblendete Kante im Volumen-Licht auf) */
    if (o.maske) { W._maske = o.maske; return s; }
    return s;
  };
  /* Maske aus einer weich gezeichneten Fläche (Kante unscharf um weich cm) */
  W.maskeForm = (n, pts, weich) => {
    const id = T.id("mf" + n);
    T.def(`<filter id="${id}b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${weich}"/></filter><mask id="${id}" maskUnits="userSpaceOnUse" x="-500" y="-500" width="1000" height="1000"><path d="${G(pts)}" fill="#fff" filter="url(#${id}b)"/></mask>`);
    return id;
  };
  /* Maske: Verlauf (userSpace) von (x1, y1) unsichtbar nach (x2, y2) sichtbar – für weiche Übergänge (Schulter in Rumpf) */
  W.maske = (n, box, x1, y1, x2, y2) => {
    const id = T.id("mk" + n);
    T.def(`<linearGradient id="${id}g" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>` +
      `<mask id="${id}" maskUnits="userSpaceOnUse" x="${box[0]}" y="${box[1]}" width="${box[2] - box[0]}" height="${box[3] - box[1]}"><rect x="${box[0]}" y="${box[1]}" width="${box[2] - box[0]}" height="${box[3] - box[1]}" fill="url(#${id}g)"/></mask>`);
    return id;
  };
  /* Haare in Fläche pts: n Haare, Wuchsrichtung w (Grad oder (x, y) → Grad; 0 = vorn/rechts, 90 = abwärts), Länge L.
     farben: [[farbe, breite, deckkraft], …] von dunkel nach hell; o.licht(x, y) → 0..1 wählt die Farbe (Licht von links oben),
     o.mix Streuung, o.buendel Haare je Strähne, o.laenge(x, y) Längenfaktor, o.szene Anteil bei T.fein = false. */
  W.haare = (pts, n, w, L, farben, o = {}) => {
    const [x0, y0, x1, y1] = T.box(pts);
    const eimer = farben.map(() => "");
    const ziel = Math.round(n * (W.dichte || 1) * (T.fein ? 1 : (o.szene != null ? o.szene : 0.2)));
    const bu = o.buendel || 1, mix = o.mix != null ? o.mix : 0.45, streu = o.streu != null ? o.streu : 16, krumm = o.krumm != null ? o.krumm : 0.2;
    let v = 0, g = 0;
    while (g < ziel && v < ziel * 25) {
      v++;
      const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
      if (!T.inPoly(x, y, pts)) continue;
      if (o.wahl && T.rnd() > o.wahl(x, y)) continue;
      const wb = (typeof w === "function" ? w(x, y) : w) + (T.rnd() - 0.5) * streu;
      const lb = L * (0.6 + T.rnd() * 0.8) * (o.laenge ? o.laenge(x, y) : 1);
      const li = o.licht ? o.licht(x, y) : T.rnd();
      const kb = krumm * (T.rnd() - 0.5) * 2;
      for (let b = 0; b < bu && g < ziel; b++) {
        const xx = x + (b ? (T.rnd() - 0.5) * lb * 0.3 : 0), yy = y + (b ? (T.rnd() - 0.5) * lb * 0.3 : 0);
        const a = (wb + (b ? (T.rnd() - 0.5) * 7 : 0)) * RAD, l = lb * (b ? 0.75 + T.rnd() * 0.45 : 1);
        const ex = Math.cos(a) * l, ey = Math.sin(a) * l, k = (kb + (T.rnd() - 0.5) * 0.08) * l;
        const i = Math.round(clamp(li + (T.rnd() - 0.5) * mix) * (farben.length - 1));
        eimer[i] += o.gerade ? `M${i10(xx)} ${i10(yy)}l${i10(ex)} ${i10(ey)}` : `M${i10(xx)} ${i10(yy)}q${i10(ex / 2 - Math.sin(a) * k)} ${i10(ey / 2 + Math.cos(a) * k)} ${i10(ex)} ${i10(ey)}`;
        g++;
      }
    }
    return W.striche(eimer, farben);
  };
  W.striche = (eimer, farben) => {
    const p = eimer.map((d, i) => d ? `<path d="${kurz(d)}" stroke="${farben[i][0]}" stroke-width="${f1(farben[i][1] * 10)}" stroke-opacity="${farben[i][2]}"/>` : "").join("");
    return p ? `<g transform="scale(.1)" fill="none" stroke-linecap="round">${p}</g>` : "";
  };
  /* Haarsaum über einen Umriss hinaus: n Haare entlang der offenen Linie kante, Richtung w, Länge L (ragen ~60 % hinaus) */
  W.saum = (kante, n, w, L, farben, o = {}) => {
    const seg = []; let tot = 0;
    for (let i = 0; i < kante.length - 1; i++) { const l = Math.hypot(kante[i + 1][0] - kante[i][0], kante[i + 1][1] - kante[i][1]); seg.push([kante[i], kante[i + 1], l]); tot += l; }
    const eimer = farben.map(() => "");
    const ziel = Math.round(n * (W.saumDichte || 1) * (T.fein ? 1 : (o.szene != null ? o.szene * 0.5 : 0.08)));
    const mix = o.mix != null ? o.mix : 0.45, ein = o.ein != null ? o.ein : 0.4;
    for (let k = 0; k < ziel; k++) {
      let s = T.rnd() * tot, j = 0;
      while (j < seg.length - 1 && s > seg[j][2]) { s -= seg[j][2]; j++; }
      const [p, q, l] = seg[j], t = s / (l || 1), x = p[0] + (q[0] - p[0]) * t, y = p[1] + (q[1] - p[1]) * t;
      const a = ((typeof w === "function" ? w(x, y) : w) + (T.rnd() - 0.5) * (o.streu != null ? o.streu : 18)) * RAD;
      const ll = L * (0.5 + T.rnd() * 0.9) * (o.laenge ? o.laenge(x, y) : 1);
      const dx = Math.cos(a), dy = Math.sin(a), sx = x - dx * ll * ein, sy = y - dy * ll * ein;
      const kk = (o.krumm != null ? o.krumm : 0.25) * ll * (T.rnd() - 0.5) * 2;
      const i = Math.round(clamp((o.licht ? o.licht(x, y) : T.rnd()) + (T.rnd() - 0.5) * mix) * (farben.length - 1));
      eimer[i] += o.gerade ? `M${i10(sx)} ${i10(sy)}l${i10(dx * ll)} ${i10(dy * ll)}` : `M${i10(sx)} ${i10(sy)}q${i10(dx * ll / 2 - dy * kk)} ${i10(dy * ll / 2 + dx * kk)} ${i10(dx * ll)} ${i10(dy * ll)}`;
    }
    return W.striche(eimer, farben);
  };
  /* weiche Licht-/Schattenformen [x, y, rx, ry, winkel, farbe, deckkraft] (oder fertiger SVG-Text) */
  const blur = new Set();
  W.blur = (sd) => {
    sd = sd < 0.7 ? Math.max(0.2, Math.round(sd * 5) / 5) : sd < 2 ? Math.round(sd * 2) / 2 : Math.round(sd);
    const k = String(Math.round(sd * 10)), id = T.id("bl" + k);
    if (!blur.has(k)) { blur.add(k); T.def(`<filter id="${id}" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${f1(sd)}"/></filter>`); }
    return `url(#${id})`;
  };
  W.weich = (liste, sd) => `<g filter="${W.blur(sd)}">` + liste.filter((e) => T.fein || typeof e === "string" || e[2] * e[3] > 30).map((e) => typeof e === "string" ? e :
    `<ellipse cx="${f1(e[0])}" cy="${f1(e[1])}" rx="${f1(e[2])}" ry="${f1(e[3])}"${e[4] ? ` transform="rotate(${e[4]} ${f1(e[0])} ${f1(e[1])})"` : ""} fill="${e[6] < 1 ? hexA(e[5], e[6]) : e[5]}"/>`).join("") + `</g>`;
  /* Fell-Textur: feine Haarstruktur als gestreckte Rauschstruktur (nur volle Feinheit), gezeichnet INNERHALB der
     Teil-Klammer (kein eigener Clip). winkel = Wuchsrichtung (0 = vorn, 90 = abwärts), box = Umriss-Box.
     o: { hell, dunkel (Farben, dunkel: null = ohne), ho, do (Deckkraft), fx, fy (Frequenz quer/längs je cm),
     licht: false = helle Striche überall gleich (sonst oben kräftig, unten schwach), hk/dk: Filter-Schlüssel } */
  const fschon = new Set();
  const rausch = (k, fx, fy, farbe, sch, seed) => {
    const id = T.id("fr" + k);
    if (!fschon.has(id)) {
      fschon.add(id);
      const hx = farbe.length === 4 ? farbe.replace(/([0-9a-f])/gi, "$1$1") : farbe;
      const c = [1, 3, 5].map((i) => +(parseInt(hx.slice(i, i + 2), 16) / 255).toFixed(3));
      T.def(`<filter id="${id}" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${fx} ${fy}" numOctaves="3" seed="${seed}"/>` +
        `<feColorMatrix values="0 0 0 0 ${c[0]} 0 0 0 0 ${c[1]} 0 0 0 0 ${c[2]} 3 0 0 0 ${-3 * sch}"/></filter>`);
    }
    return `url(#${id})`;
  };
  const rechteck = (box, winkel, filter, op) => {
    const cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2, R = Math.hypot(box[2] - box[0], box[3] - box[1]) / 2 + 1;
    return `<rect x="${f1(cx - R)}" y="${f1(cy - R)}" width="${f1(2 * R)}" height="${f1(2 * R)}" filter="${filter}" opacity="${op}" transform="rotate(${Math.round(winkel - 90)} ${f1(cx)} ${f1(cy)})"/>`;
  };
  W.fell = (n, winkel, box, o = {}) => {
    if (!T.fein) return "";
    const fx = o.fx || 2.4, fy = o.fy || 0.2, hell = o.hell || "#9a958f", dunkel = o.dunkel === undefined ? "#000" : o.dunkel;
    const k = (o.hk || "") + fx + "_" + fy;
    let s = dunkel ? rechteck(box, winkel, rausch("d" + k + dunkel.slice(1), fx, fy, dunkel, 0.5, 11), o.do || 0.7) : "";
    const h = rechteck(box, winkel, rausch("h" + k + hell.slice(1), fx, fy, hell, 0.55, 7), o.ho || 0.6);
    if (o.licht === false) return s + h;
    return s + `<g mask="url(#${lichtMaske()})">${h}</g>`;
  };
  let lmSchon = false;
  const lichtMaske = () => {
    const id = T.id("lm");
    if (!lmSchon) { lmSchon = true; T.def(`<mask id="${id}" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="${T.lg("lmg", [[0.15, "#fff"], [0.5, "#999"], [0.85, "#333"]])}"/></mask>`); }
    return id;
  };
  /* Zotteln: offene Umrisslinie → Linie mit Haarbüscheln (Spitzen = harte Ecken) in Wuchsrichtung w (Grad oder (x, y) → Grad).
     schritt = Büschelbreite, L = Büschellänge. Für Rücken-, Bauch-, Armkanten: der Umriss selbst wird haarig. */
  W.zotteln = (kante, schritt, L, w, o = {}) => {
    const aus = [kante[0]];
    for (let i = 0; i < kante.length - 1; i++) {
      const [x0, y0] = kante[i], [x1, y1] = kante[i + 1];
      const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / schritt));
      for (let k = 0; k < n; k++) {
        const t = (k + 0.35 + T.rnd() * 0.3) / n, tb = (k + 1) / n;
        const xm = x0 + (x1 - x0) * t, ym = y0 + (y1 - y0) * t;
        const a = ((typeof w === "function" ? w(xm, ym) : w) + (T.rnd() - 0.5) * 22) * RAD;
        const l = L * (0.35 + T.rnd() * 1.0) * (o.laenge ? o.laenge(xm, ym) : 1), b = (T.rnd() - 0.5) * l * 0.5;
        const ca = Math.cos(a), sa = Math.sin(a);
        const tx = xm + ca * l - sa * b, ty = ym + sa * l + ca * b;
        const bx = x0 + (x1 - x0) * tb + (T.rnd() - 0.5) * schritt * 0.25, by = y0 + (y1 - y0) * tb + (T.rnd() - 0.5) * schritt * 0.25;
        /* Flamme: Basis → (gebogen) Spitze → (gebogen) nächste Basis; quadratische Bögen = kurz */
        const px = aus[aus.length - 1][0], py = aus[aus.length - 1][1];
        aus.push([tx, ty, 2, (px + tx) / 2 + ca * l * 0.15 - sa * b * 0.6, (py + ty) / 2 + sa * l * 0.15 + ca * b * 0.6]);
        aus.push([bx, by, 2, (tx + bx) / 2 - ca * l * 0.2, (ty + by) / 2 - sa * l * 0.2]);
      }
    }
    return aus;
  };
  /* Haut-Relief (Poren, Falten) um eine Gruppe, nur volle Feinheit */
  W.relief = (n, inhalt, o) => T.fein ? `<g filter="${T.relief(n, o)}">${inhalt}</g>` : inhalt;
  /* lange, strähnige Haarlocken: gefüllte, spitz zulaufende Strähnen in einem Feld, Richtung w(x, y) (Grad), Länge
     L0…L1, Breite b; farbe(x, y, z) → Farbe (gleiche Farben in EINEM Pfad); o.szene Anteil, o.kante Konturstärke */
  W.locken = (feld, n, w, L0, L1, b, farbe, o = {}) => {
    const [x0, y0, x1, y1] = T.box(feld), eimer = {};
    const ziel = Math.round(n * (T.fein ? 1 : (o.szene != null ? o.szene : 0.3)));
    let v = 0, g = 0;
    while (g < ziel && v < ziel * 30) {
      v++;
      const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
      if (!T.inPoly(x, y, feld)) continue;
      const a = (w(x, y) + (T.rnd() - 0.5) * 12) * RAD, L = L0 + T.rnd() * (L1 - L0), bb = b * (0.5 + T.rnd() * 0.7), kr = (T.rnd() - 0.5) * L * 0.4;
      const ca = Math.cos(a), sa = Math.sin(a);
      const d = `M${f1(x - sa * bb / 2)} ${f1(y + ca * bb / 2)}q${f1(ca * L * 0.5 - sa * kr + sa * bb / 2)} ${f1(sa * L * 0.5 + ca * kr - ca * bb / 2)} ${f1(ca * L + sa * bb / 2 - sa * kr * 0.6)} ${f1(sa * L - ca * bb / 2 + ca * kr * 0.6)}` +
        `q${f1(-ca * L * 0.5 + sa * kr * 0.4)} ${f1(-sa * L * 0.5 - ca * kr * 0.4)} ${f1(-ca * L - sa * bb / 2 + sa * kr * 0.6)} ${f1(-sa * L + ca * bb / 2 - ca * kr * 0.6)}z`;
      const c = farbe(x, y, T.rnd());
      eimer[c] = (eimer[c] || "") + d;
      g++;
    }
    return Object.entries(eimer).map(([c, d]) => `<path d="${kurz(d)}" fill="${c}" fill-opacity=".9" stroke="${o.kc || "#1a0802"}" stroke-opacity="${o.kante != null ? o.kante : 0.2}" stroke-width=".1"/>`).join("");
  };
  /* Strähne (gefüllt, gebogen, spitz auslaufend) in Zehntel-cm: Basis (x, y), Winkel a (rad), Länge L, Breite bb, Biegung kr */
  const strang = (x, y, a, L, bb, kr) => {
    const ca = Math.cos(a), sa = Math.sin(a), nx = -sa, ny = ca;
    const mx = x + ca * L * 0.5 + nx * kr, my = y + sa * L * 0.5 + ny * kr;
    const tx = x + ca * L + nx * kr * 0.7, ty = y + sa * L + ny * kr * 0.7;
    const P = [[x + nx * bb / 2, y + ny * bb / 2], [mx + nx * bb * 0.35, my + ny * bb * 0.35], [tx, ty], [mx - nx * bb * 0.35, my - ny * bb * 0.35], [x - nx * bb / 2, y - ny * bb / 2]].map((p) => [i10(p[0]), i10(p[1])]);
    return `M${P[0][0]} ${P[0][1]}q${P[1][0] - P[0][0]} ${P[1][1] - P[0][1]} ${P[2][0] - P[0][0]} ${P[2][1] - P[0][1]}q${P[3][0] - P[2][0]} ${P[3][1] - P[2][1]} ${P[4][0] - P[2][0]} ${P[4][1] - P[2][1]}z`;
  };
  const strangGruppe = (eimer, o) => {
    const p = Object.entries(eimer).map(([c, d]) => `<path d="${kurz(d)}" fill="${c}"${o.kante !== 0 ? ` stroke="${o.kc || "#000"}" stroke-opacity="${o.kante != null ? o.kante : 0.18}" stroke-width="${f1((o.kw || 0.08) * 10)}"` : ""}/>`).join("");
    return p ? `<g transform="scale(.1)"${o.op ? ` opacity="${o.op}"` : ""}>${p}</g>` : "";
  };
  /* Strähnenfell in einer Fläche: n Strähnen, Wuchsrichtung w(x, y) (Grad), Länge L0…L1, Breite b, farbe(x, y, z) */
  W.straehnen = (feld, n, w0, L0, L1, b, farbe, o = {}) => {
    const [x0, y0, x1, y1] = T.box(feld), eimer = {}, w = typeof w0 === "function" ? w0 : () => w0;
    const ziel = Math.round(n * (T.fein ? 1 : (o.szene != null ? o.szene : 0.2)));
    let v = 0, g = 0;
    while (g < ziel && v < ziel * 30) {
      v++;
      const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
      if (!T.inPoly(x, y, feld)) continue;
      const L = (L0 + T.rnd() * (L1 - L0)) * (o.laenge ? o.laenge(x, y) : 1);
      const c = farbe(x, y, T.rnd());
      eimer[c] = (eimer[c] || "") + strang(x, y, (w(x, y) + (T.rnd() - 0.5) * (o.streu || 14)) * RAD, L, b * (0.5 + T.rnd() * 0.8), (T.rnd() - 0.5) * L * (o.krumm || 0.35));
      g++;
    }
    return strangGruppe(eimer, o);
  };
  /* Volumen je Körperteil (kern.js T.volumen): Gruppe wird von links oben beleuchtet (Rundung, Kernschatten, Reflex) */
  W.vol = (n, weich, svg, o = {}) => {
    const m = W._maske; W._maske = null;
    /* gleiche Weichheit → gemeinsamer Filter (spart Bytes) */
    const wq = weich < 1.2 ? 1 : weich < 2.5 ? 2 : weich < 3.5 ? 3 : weich < 5 ? 4 : weich < 7 ? 6 : weich < 10 ? 8 : 12;
    const v = T.fein && T.volumen ? `<g filter="${T.volumen("v", Object.assign({}, o, { weich: wq }))}">${svg}</g>` : svg;
    return m ? `<g mask="url(#${m})">${v}</g>` : v;
  };
  /* Strähnen über eine Umrisskante hinaus (statt Sägezahn): Länge gemischt, gebogen, überlappend */
  W.kantenStraehnen = (kante, n, w, L0, L1, b, farbe, o = {}) => {
    const seg = []; let tot = 0;
    for (let i = 0; i < kante.length - 1; i++) { const l = Math.hypot(kante[i + 1][0] - kante[i][0], kante[i + 1][1] - kante[i][1]); seg.push([kante[i], kante[i + 1], l]); tot += l; }
    const eimer = {}, ziel = Math.round(n * (W.dichte || 1) * (T.fein ? 1 : (o.szene != null ? o.szene : 0.3))), ein = o.ein != null ? o.ein : 0.45;
    for (let k = 0; k < ziel; k++) {
      let s2 = T.rnd() * tot, j = 0;
      while (j < seg.length - 1 && s2 > seg[j][2]) { s2 -= seg[j][2]; j++; }
      const [p, q, l] = seg[j], t = s2 / (l || 1), x = p[0] + (q[0] - p[0]) * t, y = p[1] + (q[1] - p[1]) * t;
      const a = ((typeof w === "function" ? w(x, y) : w) + (T.rnd() - 0.5) * (o.streu || 18)) * RAD;
      const z = T.rnd(), L = (L0 + Math.pow(T.rnd(), 1.6) * (L1 - L0)) * (o.laenge ? o.laenge(x, y) : 1);
      const c = farbe(x, y, z);
      eimer[c] = (eimer[c] || "") + strang(x - Math.cos(a) * L * ein, y - Math.sin(a) * L * ein, a, L, b * (0.5 + T.rnd() * 0.8), (T.rnd() - 0.5) * L * (o.krumm || 0.4));
    }
    return strangGruppe(eimer, o);
  };
  /* Falten als Paar: dunkle Rinne + helle Kante darüber (Licht oben links); zuege: Pfad-Strings */
  W.falten = (zuege, w, dunkel = "#000", hell = "#9a948e", od = 0.7, oh = 0.4) => {
    if (!T.fein) return "";
    const id = W.pfadId(zuege.join(""));
    return `<use href="#${id}" fill="none" stroke="${dunkel}" stroke-opacity="${od}" stroke-width="${w}" stroke-linecap="round"/>` +
      `<use href="#${id}" fill="none" stroke="${hell}" stroke-opacity="${oh}" stroke-width="${f1(w * 0.7) || 0.1}" stroke-linecap="round" transform="translate(${f1(-w * 0.3)} ${f1(-w * 0.9)})"/>`;
  };
  /* Auge mit Höhle (Seitenansicht, Blick nach rechts): Lidspalte, Lederhaut, Iris mit Rand und Fasern, Pupille,
     dickes Oberlid (deckt lidDeck der Iris), Schatten des Lides, feuchter Unterlidrand, kleine Karunkel vorn,
     kleiner (gedämpfter) Glanzpunkt. o: { iris, iris2, sklera, pupille, offen, winkel, lidDeck, lid (Hautfarbe Lid),
     lidHell, rand, glanz (0–1), karunkel, hoehle (Farbe der Augenhöhle), wimpern } */
  W.auge2 = (x, y, r, o = {}) => {
    const id = T.id("a2" + (nr++));
    const Wd = r * 1.35, Ho = r * (o.offen || 0.8), Hu = Ho * 0.75, deck = o.lidDeck != null ? o.lidDeck : 0.25;
    const spalt = `M${f1(-Wd)} ${f1(Ho * 0.05)}C${f1(-Wd * 0.5)} ${f1(-Ho)} ${f1(Wd * 0.45)} ${f1(-Ho * 1.05)} ${f1(Wd)} ${f1(Ho * 0.15)}C${f1(Wd * 0.45)} ${f1(Hu * 1.1)} ${f1(-Wd * 0.45)} ${f1(Hu * 1.05)} ${f1(-Wd)} ${f1(Ho * 0.05)}Z`;
    T.def(`<clipPath id="${id}"><path d="${spalt}"/></clipPath>`);
    const ir = r * 0.92, ix = r * 0.12, iy = Ho * 0.12;
    const ig = T.rg("ir" + (o.iris || "#3a2010").slice(1) + (o.iris2 || "#140804").slice(1), [[0, o.iris || "#3a2010"], [0.55, o.iris || "#3a2010"], [0.85, o.iris2 || "#140804"], [1, "#0a0402"]], 0.45, 0.45, 0.55);
    let s = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${o.winkel || 0})">`;
    if (o.hoehle) s += W.weich([[-r * 0.1, -Ho * 0.3, Wd * 1.25, Ho * 1.7, 0, o.hoehle, 0.55]], r * 0.35);
    s += `<path d="${spalt}" fill="${o.sklera || "#2a1a12"}"/><g clip-path="url(#${id})">`;
    s += `<circle cx="${f1(ix)}" cy="${f1(iy)}" r="${f1(ir)}" fill="${ig}"/>`;
    if (T.fein) {
      let fa = "";
      for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2; fa += `M${f1(ix + Math.cos(a) * ir * 0.45)} ${f1(iy + Math.sin(a) * ir * 0.45)}L${f1(ix + Math.cos(a + 0.1) * ir * 0.9)} ${f1(iy + Math.sin(a + 0.1) * ir * 0.9)}`; }
      s += `<path d="${fa}" stroke="${o.faser || "#000"}" stroke-opacity=".25" stroke-width="${f1(r * 0.05) || 0.05}" fill="none"/>`;
    }
    s += (o.pupille === "schlitz" ? `<ellipse cx="${f1(ix)}" cy="${f1(iy)}" rx="${f1(r * 0.13)}" ry="${f1(ir * 0.75)}" fill="#030202"/>` : `<circle cx="${f1(ix)}" cy="${f1(iy)}" r="${f1(r * (o.pupR || 0.4))}" fill="#030202"/>`);
    /* Schatten des Oberlides auf dem Augapfel */
    s += `<rect x="${f1(-Wd)}" y="${f1(-Ho * 1.1)}" width="${f1(2 * Wd)}" height="${f1(Ho * 1.3)}" fill="${T.lg("a2ls", [[0, "#000", 0.85], [0.6, "#000", 0.3], [1, "#000", 0]])}"/>`;
    s += `<circle cx="${f1(ix + r * 0.3)}" cy="${f1(iy - r * 0.32)}" r="${f1(r * 0.14)}" fill="#fff" opacity="${o.glanz != null ? o.glanz : 0.75}"/>`;
    s += `<circle cx="${f1(ix - r * 0.35)}" cy="${f1(iy + r * 0.3)}" r="${f1(r * 0.07)}" fill="#fff" opacity="${(o.glanz != null ? o.glanz : 0.75) * 0.4}"/></g>`;
    /* dickes Oberlid: Hautwulst über der Lidspalte, Unterkante deckt die Iris */
    const lu = -Ho + (2 * ir) * deck;
    const lid = `M${f1(-Wd * 1.08)} ${f1(Ho * 0.02)}C${f1(-Wd * 0.6)} ${f1(-Ho * 1.25)} ${f1(Wd * 0.5)} ${f1(-Ho * 1.35)} ${f1(Wd * 1.06)} ${f1(Ho * 0.1)}` +
      `C${f1(Wd * 0.5)} ${f1(lu - Ho * 0.15)} ${f1(-Wd * 0.45)} ${f1(lu - Ho * 0.1)} ${f1(-Wd * 1.08)} ${f1(Ho * 0.02)}Z`;
    s += `<path d="${lid}" fill="${o.lid || "#2a2220"}"/>`;
    s += `<path d="M${f1(-Wd * 0.9)} ${f1(lu * 0.3)}C${f1(-Wd * 0.45)} ${f1(lu + Ho * 0.05)} ${f1(Wd * 0.45)} ${f1(lu)} ${f1(Wd)} ${f1(Ho * 0.12)}" fill="none" stroke="${o.rand || "#050302"}" stroke-width="${f1(r * 0.16)}" stroke-linecap="round"/>`;
    s += `<path d="M${f1(-Wd * 0.75)} ${f1(-Ho * 0.85)}C${f1(-Wd * 0.3)} ${f1(-Ho * 1.25)} ${f1(Wd * 0.3)} ${f1(-Ho * 1.25)} ${f1(Wd * 0.75)} ${f1(-Ho * 0.7)}" fill="none" stroke="${o.lidHell || "#8a8480"}" stroke-opacity=".45" stroke-width="${f1(r * 0.1)}" stroke-linecap="round"/>`;
    /* Unterlid: feiner Rand, feuchter Glanz; Karunkel vorn (nasenseitig = rechts) */
    s += `<path d="M${f1(Wd)} ${f1(Ho * 0.15)}C${f1(Wd * 0.45)} ${f1(Hu * 1.1)} ${f1(-Wd * 0.45)} ${f1(Hu * 1.05)} ${f1(-Wd)} ${f1(Ho * 0.05)}" fill="none" stroke="${o.rand || "#050302"}" stroke-width="${f1(r * 0.08)}"/>`;
    s += `<path d="M${f1(Wd * 0.7)} ${f1(Hu * 0.75)}C${f1(Wd * 0.2)} ${f1(Hu * 1.3)} ${f1(-Wd * 0.4)} ${f1(Hu * 1.25)} ${f1(-Wd * 0.75)} ${f1(Hu * 0.6)}" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="${f1(r * 0.05) || 0.05}"/>`;
    s += `<ellipse cx="${f1(Wd * 0.94)}" cy="${f1(Ho * 0.12)}" rx="${f1(r * 0.08)}" ry="${f1(r * 0.06)}" fill="${o.karunkel || "#6a5a66"}"/>`;
    const nw = o.wimpern || 0;
    if (nw && T.fein) {
      let d = "";
      const L = r * (o.wimpernLaenge || 0.5);
      for (let i = 0; i < nw; i++) {
        const t = 0.12 + 0.8 * i / Math.max(1, nw - 1), bx = -Wd + 2 * Wd * t, by = -Ho * 1.1 * Math.sin(Math.PI * t) + Ho * 0.08;
        const a = -Math.PI / 2 - 0.8 + 1.4 * t, l = L * (0.7 + T.rnd() * 0.5);
        d += `M${f1(bx)} ${f1(by)}q${f1(Math.cos(a) * l * 0.5)} ${f1(Math.sin(a) * l * 0.6)} ${f1(Math.cos(a + 0.4) * l)} ${f1(Math.sin(a + 0.4) * l * 0.8)}`;
      }
      s += `<path d="${d}" fill="none" stroke="${o.wimpernFarbe || "#140c08"}" stroke-width="${f1(r * 0.05) || 0.05}" stroke-linecap="round"/>`;
    }
    return s + `</g>`;
  };
  /* Haarmuster (Kachel): dichtes Fell für wenige Bytes. Kachel w × h (cm), n Haare der Länge L (Wuchsrichtung = Kachel-x),
     farben [[farbe, breite, deckkraft], …] zufällig; Haare über den Kachelrand werden umgebrochen (keine Nähte).
     Rückgabe: Funktion (winkel) → Füll-URL des um winkel gedrehten Musters. */
  const muster = {};
  W.haarMuster = (name, w, h, n, L, farben, krumm = 0.25) => (winkel) => {
    if (!T.fein) return "none";
    const key = name + "_" + Math.round(winkel);
    const id = T.id("hm" + key);
    if (!muster[key]) {
      muster[key] = 1;
      if (!muster["b" + name]) {
        const eimer = farben.map(() => "");
        for (let i = 0; i < n; i++) {
          const x = T.rnd() * w, y = T.rnd() * h, l = L * (0.6 + T.rnd() * 0.8), a = (T.rnd() - 0.5) * 0.35, k = (T.rnd() - 0.5) * l * krumm;
          const ex = Math.cos(a) * l, ey = Math.sin(a) * l, c = Math.floor(T.rnd() * farben.length);
          for (const dx of [0, -w]) for (const dy of [0, -h, h]) {
            if (dx && x + ex < w) continue;
            if (dy && (y + Math.min(0, ey) - 0.3 > 0 && y + Math.max(0, ey) + 0.3 < h)) continue;
            eimer[c] += `M${i10(x + dx)} ${i10(y + dy)}q${i10(ex / 2 - Math.sin(a) * k)} ${i10(ey / 2 + Math.cos(a) * k)} ${i10(ex)} ${i10(ey)}`;
          }
        }
        T.def(`<g id="${T.id("hmg" + name)}">${W.striche(eimer, farben)}</g>`);
        muster["b" + name] = 1;
      }
      T.def(`<pattern id="${id}" patternUnits="userSpaceOnUse" width="${w}" height="${h}" patternTransform="rotate(${Math.round(winkel)})"><use href="#${T.id("hmg" + name)}"/></pattern>`);
    }
    return `url(#${id})`;
  };
  /* Musterfläche: Form pts (oder Pfad d) mit Haarmuster füllen, nur volle Feinheit */
  W.musterFlaeche = (pts, fuell, op = 1) => T.fein ? `<use href="#${W.pfadId(typeof pts === "string" ? pts : G(pts))}" fill="${fuell}"${op < 1 ? ` opacity="${op}"` : ""}/>` : "";
  /* Auge: volle Feinheit = T.augeReal, Szene = dunkle Lidspalte + Glanzpunkt (wenige Bytes) */
  W.auge = (x, y, rr, o) => T.fein ? T.augeReal(x, y, rr, o) :
    `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rr * 1.3)}" ry="${f1(rr * (o.offen || 0.75))}" fill="${o.iris || "#3a2410"}" stroke="#000" stroke-width="${f1(rr * 0.25)}"/><circle cx="${f1(x + rr * 0.4)}" cy="${f1(y - rr * 0.3)}" r="${f1(rr * 0.25)}" fill="#fff" opacity=".8"/>`;
  /* Linien (mehrere offene Züge in EINEM Pfad) */
  W.L = (zuege, farbe, w, op = 1, extra = "") =>
    `<path d="${zuege.map((p) => typeof p === "string" ? p : G(p, false)).join("")}" fill="none" stroke="${farbe}" stroke-width="${w}"${op < 1 ? ` stroke-opacity="${op}"` : ""} stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  /* Finger/Zehe als runde Glieder-Kette: pts Mittellinie, b Breite, farbe; Licht-Grat oben; Nagel an der Spitze */
  W.glied = (pts, b, farbe, licht, o = {}) => {
    const d = G(pts, false);
    const st = `fill="none" stroke-linecap="round" stroke-linejoin="round"`;
    if (!(licht && T.fein)) return `<path d="${d}" ${st} stroke="${farbe}" stroke-width="${f1(b)}"/>`;
    const id = T.id("gl" + nr++);
    T.def(`<path id="${id}" d="${d}"/>`);
    return `<use href="#${id}" ${st} stroke="${farbe}" stroke-width="${f1(b)}"/>` +
      `<use href="#${id}" ${st} stroke="${licht}" stroke-opacity="${o.la || 0.35}" stroke-width="${f1(b * 0.35)}" transform="translate(${f1(-b * 0.12)} ${f1(-b * 0.22)})"/>`;
  };
  return W;
}

/* =====================================================================
   GORILLA (Westlicher Flachlandgorilla, Silberrücken, auf den Knöcheln)
   RECHERCHE (San Diego Zoo, Smithsonian, Primate Info Net, Anatomie-Literatur): Männchen 140–200 kg, aufrecht
   ~1,7 m, im Vierfüßerstand Schulterhöhe ~1,3–1,45 m, Nase–Steiß ~1,6–1,8 m. Arme ~20–25 % länger als die Beine,
   Spannweite bis 2,5 m → Rücken fällt von der mächtigen Schulter (Trapezmuskel-Buckel) zum Steiß ab. Knöchelgang:
   Mittelglieder der Finger 2–5 tragen (Rücken der Mittelphalangen auf dem Boden), Mittelhand senkrecht, Daumen kurz,
   Fingerspitzen eingerollt, Nägel zeigen nach hinten. Füße Sohlengänger, Großzehe abgespreizt (innen).
   Kopf: hoher Scheitelkamm (Sagittalkamm, mit Fett-/Muskelpolster) → kegelförmiger Oberkopf; mächtiger Überaugenwulst,
   kleine tiefliegende dunkelbraune Augen mit dunkler Lederhaut; breite, flache Nase mit großen, wulstig gerandeten
   Nasenlöchern („Nasenabdruck“ individuell); vorspringende Schnauze, schmale schwarze Lippen, kleines Kinn;
   kleine Ohren dicht am Kopf, im Haar halb versteckt. Haut tiefschwarz, ledrig, gefaltet, glänzend.
   Fell: schwarz bis braunschwarz mit bläulichem Glanz; Silbersattel (kurzes silbergraues Haar) vom Schulterende über
   Rücken und Lende bis auf die Oberschenkel; Westlicher Flachlandgorilla mit rotbrauner Kappe auf dem Scheitel;
   lange Haare an den Armen (hängen nach hinten-unten), Brust fast nackt. Hände/Füße nackt, schwarz, faltig.
   ===================================================================== */
function gorilla(T) {
  const W = werk(T);
  W.dichte = T.fein ? 0.26 : 0.7;
  W.saumDichte = T.fein ? 0.5 : 1;
  const STR = ["#0a0909", "#151413", "#21201e", "#302e2c", "#45433f"];
  /* Sattelhaar: kurz, anliegend; oben im Licht #b8b8b8, zur Flanke #7a7a7a */
  const SILBER = [["#56534f", 0.13, 0.6], ["#7a7a7a", 0.13, 0.6], ["#959491", 0.12, 0.6], ["#b8b8b8", 0.12, 0.62], ["#d0cfcc", 0.11, 0.65], ["#e6e5e2", 0.1, 0.65]];
  const SCHW = [["#000", 0.16, 0.65], ["#141315", 0.16, 0.6], ["#28272b", 0.15, 0.6], ["#3e3e44", 0.14, 0.55], ["#6a6a70", 0.13, 0.55]];
  const KAPPE = ["#2a170c", "#402414", "#56321c", "#6c4228"];
  const HAUT = "#2a2624";
  /* EIN Licht oben links (vorn): 0 = Kernschatten … 1 = Licht */
  const licht = (x, y) => clamp(0.15 + (-y - 45) / 95 - (x - 40) / 500);
  const fellG = (n, a, b, c) => T.lg("fg" + n, [[0, a], [0.5, b], [1, c]]);
  /* schwarzes Fell: lange, gebogene Strähnenbündel in Wuchsrichtung; Glanzhaare nur im Licht */
  const fell = (pts, n, w, L, o = {}) => W.haare(pts, n, w, L, SCHW, Object.assign({ licht, buendel: 4, krumm: 0.45, streu: 12, wahl: (x, y) => 0.25 + licht(x, y) * 0.75, szene: 0.06 }, o));
  /* Konturhaar: auslaufende, gebogene Haare über den Umriss (Länge gemischt) */
  const KH = [["#000", 0.2, 0.75], ["#141315", 0.18, 0.7], ["#28272b", 0.16, 0.65], ["#3e3e44", 0.14, 0.6]];
  const kante = (pts, n, w, L0, L1, o = {}) => W.saum(pts, Math.round(n * 0.6), w, (L0 + L1) / 2, KH, Object.assign({ krumm: 0.45, ein: 0.35, streu: 16, szene: 0.25 }, o));
  /* Wuchsrichtung Rumpf: Rücken nach hinten, Flanke nach unten, Schulter mit Wirbel zum Arm */
  const rumpfW = (x, y) => (x > 76 ? 120 + (y + 90) * 0.4 + Math.sin((x + y) * 0.3) * 10 : y < -100 ? 186 : 186 - clamp((y + 100) / 40) * 90);
  /* Haarmuster (Kacheln): Sattel kurz und anliegend, Schwarz lang und strähnig */
  const SM = W.haarMuster("sat", 8, 5.6, 210, 1.2, [["#eeedea", 0.1, 0.7], ["#c4c4c2", 0.1, 0.7], ["#9a9996", 0.1, 0.65], ["#5a5856", 0.1, 0.6], ["#2a2826", 0.11, 0.6]], 0.3);
  const BM = W.haarMuster("schw", 12, 9, 80, 6, [["#000", 0.16, 0.7], ["#252428", 0.15, 0.6], ["#3e3e44", 0.14, 0.55], ["#5c5c62", 0.12, 0.5]], 0.5);
  let s = "";

  /* ---------- ferne Glieder: Körperton, ~30 % dunkler, teilweise verdeckt ---------- */
  s += gorillaFuss(W, T, -21, true);
  const beinF = [[14, -80], [26, -68], [30, -56], [28, -44], [22, -34], [17, -24], [15, -16], [10, -12], [2, -12], [-2, -20], [-3, -32], [-1, -44], [2, -56], [6, -68]];
  s += W.vol("v", 3, W.teil(beinF, fellG("bf", "#1f1d1c", "#141312", "#0b0a0a"), W.musterFlaeche(beinF, BM(102), 0.7) + fell(beinF, 30, (x, y) => (y < -50 ? 112 : 98), 4, { licht: (x, y) => licht(x, y) * 0.6 }), { rand: 0 }) +
    kante([[-3, -34], [-2, -20], [2, -12], [10, -12]], 20, 96, 2, 4), { tiefe: 3, umgebung: 0.5 });
  s += knoechelhand(W, T, 118.6, true);
  const armF = [[94, -106], [108, -104], [115, -92], [117, -76], [120, -60], [123, -46], [125.4, -32], [126, -19.4], [111.4, -19.4], [108, -30], [104, -46], [100, -62], [96, -84]];
  s += W.vol("v", 3.4, W.teil(armF, fellG("af", "#211f1e", "#151413", "#0b0a0a"), W.musterFlaeche(armF, BM(98), 0.7) + fell(armF, 40, 98, 6, { licht: (x, y) => licht(x, y) * 0.6 + (x > 114 ? 0.12 : 0) }), { rand: 0 }) +
    kante([[96, -84], [100, -62], [104, -46], [108, -30], [111.4, -19.4]], 36, 104, 3, 7) + kante([[126.4, -20.6], [118.6, -20], [111, -19.6]], 24, 90, 2, 4.4), { tiefe: 3, umgebung: 0.5 });

  /* ---------- Rumpf mit Silbersattel (kurzes, anliegendes Haar; Grenze über 6–9 cm meliert) ---------- */
  const rumpf = [[1, -78], [3, -90], [12, -99], [26, -106], [42, -114], [58, -122], [72, -129], [84, -133.5], [96, -133], [104, -129], [110, -121], [116, -108], [117, -96], [114, -84],
    [108, -72], [98, -60], [84, -52], [68, -48], [52, -49], [38, -53], [26, -58], [14, -62], [6, -68]];
  const sattelOben = [[-2, -80], [2, -91], [12, -100], [26, -107], [42, -115], [56, -122], [66, -126.6]];
  const sattelUnten = [[66, -126.6], [65.4, -114], [62, -100], [54, -87], [43, -77], [30, -71], [16, -70], [3, -74]];
  const sattel = sattelOben.concat(sattelUnten.slice(1));
  const schwarzFeld = [[64, -128], [84, -133.5], [96, -133], [104, -129], [110, -121], [116, -108], [117, -96], [114, -84], [108, -72], [98, -60], [84, -52], [68, -48], [52, -49], [38, -53],
    [26, -58], [14, -62], [6, -68], [16, -66], [30, -67], [44, -73], [56, -84], [62, -100], [64, -116]];
  const satId = T.id("sattel"); T.def(`<path id="${satId}" d="${G(sattel)}"/>`);
  const satG = T.lg("sat", [[0, "#b8b8b8"], [0.5, "#9a9894"], [1, "#6e6c68"]], 0, -126, 0, -70, UB);
  const satLicht = (x, y) => clamp(0.3 + (-y - 80) / 38 - Math.max(0, x - 50) / 50);
  const band = sattelUnten.map(([x, y]) => [x - 3.4, y + 5]).concat(sattelUnten.slice().reverse().map(([x, y]) => [x + 3.4, y - 5]));
  const satW = (x, y) => 190 - clamp((y + 110) / 40) * 50;
  let rs = W.teil(rumpf, fellG("rf", "#2a2826", "#181716", "#0a0909"),
    /* Formlicht: Trapezbuckel oben im Licht, Brustkorb hinter dem Arm gewölbt, Bauchsaum warmes Bodenlicht */
    W.weich([[86, -128, 14, 3.6, -6, "#5a5c62", 0.45], [100, -78, 10, 14, 0, "#000", 0.45], [66, -50.6, 30, 1.6, 2, "#5a4e44", 0.5]], 3) +
    W.musterFlaeche(rumpf, BM(112)) + W.musterFlaeche([[6, -68], [26, -58], [52, -49], [84, -52], [98, -60], [80, -70], [52, -60], [20, -64]], BM(96)) +
    W.weich([`<use href="#${satId}" fill="${satG}"/>`], 2.6) +
    (T.fein ? `<g mask="url(#${W.maskeForm("sat", sattel, 1.4)})"><use href="#${satId}" fill="${SM(168)}"/></g>` : "") +
    fell(schwarzFeld, 110, rumpfW, 4.4) +
    W.haare(sattel, 220, satW, 1.3, SILBER, { licht: satLicht, mix: 0.4, gerade: true, streu: 10, szene: 0.05 }) +
    W.haare(band, 200, satW, 1.6, SILBER.slice(0, 3).concat([["#141312", 0.14, 0.65], ["#0a0909", 0.14, 0.65]]), { mix: 1, gerade: true, szene: 0.04 }),
  { rand: 0 });
  rs += W.kantenStraehnen([[1, -80], [3, -90], [12, -99], [26, -106], [42, -114], [58, -122], [70, -128]], 70, (x) => (x < 6 ? 128 : 192), 0.8, 1.8, 0.22,
    (x, y, z) => SILBER[Math.round(clamp(0.95 - x / 140 + (z - 0.5) * 0.3) * 5)][0], { kante: 0, szene: 0.2 });
  rs += kante([[70, -128], [84, -133.5], [96, -133], [104, -129]], 30, 196, 1.4, 3);
  rs += kante([[108, -72], [98, -60], [84, -52], [68, -48], [52, -49], [38, -53], [26, -58]], 90, (x) => 92 + Math.sin(x) * 6, 3, 9);
  s += W.vol("v", 12, rs, { tiefe: 3, umgebung: 0.5 });

  /* ---------- nahes Hinterbein: Oberschenkel als Masse schräg nach vorn unten, Knie als Ecke vorn, Unterschenkel kürzer,
     leicht zurück zur Ferse; Silber reicht auf den Oberschenkel ---------- */
  s += gorillaFuss(W, T, 0, false);
  const beinN = [[14, -95], [26, -86], [36, -74], [44, -62], [49, -50], [50.4, -40], [47.6, -34], [44, -26], [42.6, -17], [38, -11], [28, -10.4], [20.4, -13], [18.4, -21], [15, -30],
    [10, -40], [6, -52], [2, -66], [1, -80], [2, -92]];
  const beinSat = [[-1, -96], [14, -98], [28, -88], [38, -76], [40, -64], [32, -56], [20, -52], [8, -56], [2, -70]];
  const beinSatU = [[40, -64], [32, -56], [20, -52], [8, -56], [2, -70]];
  s += W.vol("v", 5, W.teil(beinN, fellG("bn", "#2a2826", "#181716", "#0a0909"),
    W.weich([`<path d="${G(beinSat)}" fill="#8e8c88"/>`], 3.4) +
    /* Muskelzug Hüfte → Knie, Kniekante, Wade hinten */
    W.weich([[48, -40, 2, 6, -20, "#5a5c62", 0.5], [30, -14, 11, 3, 0, "#000", 0.5], [12, -32, 3, 9, -20, "#000", 0.4]], 2.4) +
    W.musterFlaeche(beinN, BM(104)) + (T.fein ? `<g mask="url(#${W.maskeForm("bsat", beinSat, 1.6)})"><path d="${G(beinSat)}" fill="${SM(124)}"/></g>` : "") +
    fell(beinN, 70, (x, y) => (y < -58 ? 116 + Math.sin(x * 0.5) * 8 : 100), 4.6, { licht: (x, y) => clamp(licht(x, y) + 0.2 - (x < 20 ? 0.2 : 0)) }) +
    W.haare(beinSat, 90, 122, 1.3, SILBER, { licht: (x, y) => clamp(0.3 + (-y - 60) / 35), mix: 0.4, gerade: true, streu: 10, szene: 0.05 }) +
    W.haare(beinSatU.map(([x, y]) => [x, y + 4]).concat(beinSatU.slice().reverse().map(([x, y]) => [x, y - 4])), 120, 120, 1.5, SILBER.slice(0, 3).concat([["#141312", 0.14, 0.65], ["#0a0909", 0.14, 0.65]]), { mix: 1, gerade: true, szene: 0.04 }),
  { rand: 0, maske: W.maske("bn", [-10, -100, 60, -5], 0, -92, 0, -80) }) +
    kante([[1, -78], [2, -66], [6, -52], [10, -40], [15, -30], [18.4, -21], [20.4, -13]], 46, 104, 2.6, 6) +
    kante([[20.4, -13], [28, -10.4], [38, -11], [42.6, -17]], 50, 82, 2.4, 5.4) +
    kante([[49, -50], [50.4, -40], [47.6, -34], [44, -26], [42.6, -17]], 24, 70, 1.4, 3), { tiefe: 3, umgebung: 0.5 });

  /* ---------- nahes Vorderbein: Deltakugel, Ellbogen als Knick nach hinten (Haarwirbel), Unterarm oben 15 % dicker,
     zum Handgelenk schlanker; Haar fällt unregelmäßig über den Handrücken ---------- */
  s += knoechelhand(W, T, 93.6, false);
  const armN = [[66, -112], [72, -124], [84, -129], [98, -125], [106, -115], [109, -101], [108, -87], [105, -74], [104, -62], [105.6, -50], [104.6, -40], [102.4, -30], [100.4, -21],
    [87, -21], [85, -30], [82, -40], [79.4, -47], [75.6, -52], [72.4, -58], [69.4, -65], [68.4, -72], [67, -82], [66, -96]];
  s += W.vol("v", 4.4, W.teil(armN, fellG("an", "#2c2a28", "#1a1918", "#0b0a0a"),
    W.weich([
      /* Deltakugel: Lichtkante oben, Kernschatten hinten; Unterarmspindel; Ellbogen */
      [92, -118, 11, 6, -18, "#5a5c62", 0.6], [74, -104, 5, 16, 5, "#000", 0.55], [104.4, -98, 2.4, 10, 0, "#5a5c62", 0.4], [102.6, -52, 2.6, 11, -4, "#5a5c62", 0.45],
      [76.6, -52, 3, 3, 0, "#000", 0.55], [90, -64, 10, 2.4, -20, "#000", 0.35],
    ], 2.4) +
    W.musterFlaeche(armN, BM(100)) +
    fell(armN, 110, (x, y) => (y < -70 ? (x < 82 ? 116 : 104) : Math.abs(y + 52) < 5 && x < 86 ? 140 : 96), 7, { licht: (x, y) => clamp(licht(x, y) + (x > 92 ? 0.15 : -0.15)) }),
  { rand: 0, vol: false, maske: W.maske("an", [55, -140, 120, -15], 0, -127, 0, -112) }) +
    kante([[66, -96], [67, -82], [68.4, -72], [69.4, -65], [72.4, -58], [75.6, -52], [79.4, -47], [82, -40], [85, -30], [87, -21]], 110, (x, y) => 100 + (y < -66 ? 14 : 4), 4, 13) +
    kante([[103.4, -23], [96, -21.4], [88, -21]], 46, (x) => 86 + (x - 95), 2.4, 6) +
    kante([[108.6, -96], [108, -87], [105, -74], [104, -62], [105.6, -50], [104.6, -40], [102.4, -30]], 30, 80, 1.2, 2.6), { tiefe: 3, umgebung: 0.5 });

  /* ---------- Kopf ---------- */
  s += gorillaKopf(T, W, STR, KAPPE, HAUT, licht);
  return W.fertig(s, 1, [86, -141, 141, -80], [12, 34, 97, 123]);
}

/* Hautfarben für Hände/Füße: c = nah (fern → nah), cf = fern, l/lf = Licht, g/gf = Verlauf, na/nf = Nagel */
const HAUT_G = { n: "g", c: ["#151413", "#1b1a19", "#22201f"], cf: ["#0e0d0d", "#121110", "#151413"], l: "#9a948d", lf: "#4a4642", polster: "#5e5852",
  g: [[0, "#34312f"], [0.55, "#1d1c1b"], [1, "#0c0b0b"]], gf: [[0, "#222020"], [0.6, "#121111"], [1, "#080808"]], na: "#5e5750", nf: "#35312d", sohle: "#7a736b" };
const HAUT_S = { n: "s", c: ["#231c18", "#2a221e", "#332924"], cf: ["#161210", "#1a1513", "#1e1815"], l: "#a8968a", lf: "#5a4c44",
  g: [[0, "#4a3c34"], [0.55, "#2c2420"], [1, "#141010"]], gf: [[0, "#2c2420"], [0.6, "#1a1513"], [1, "#0c0a08"]], na: "#7a6a5e", nf: "#3e342e", sohle: "#8a7a6c" };
const HAUT_O = { n: "o", c: ["#2e2420", "#362a25", "#40322b"], cf: ["#1c1614", "#211a17", "#261e1a"], l: "#b09a8a", lf: "#5e4e44",
  g: [[0, "#5a463c"], [0.55, "#3a2e28"], [1, "#1a1412"]], gf: [[0, "#3a2e28"], [0.6, "#211a17"], [1, "#100c0a"]], na: "#8a7464", nf: "#463a32", sohle: "#94806e" };

/* Knöchelhand (Seitenansicht): Mittelhand senkrecht unter dem Handgelenk (y ≈ −19,6), ≈ 110 % der Handgelenksbreite;
   die Grundglieder laufen schräg nach vorn unten, die Mittelglieder liegen als waagerechte Walzen auf dem Boden und zeigen
   nach vorn (Mittelfinger am längsten); ihre Oberseite vorn ist das matte, hellere Knöchelpolster mit Querfalten;
   die Endglieder sind darunter eingeschlagen (von der Seite unsichtbar); kurzer Daumenstummel hinten innen.
   o: { mh: Länge der Mittelhand (Faktor), vor: Versatz der Finger nach vorn, lang: Fingerlänge (Faktor) } */
function knoechelhand(W, T, wx, fern, pal = HAUT_G, o = {}) {
  const C = fern ? pal.cf : pal.c, LI = fern ? pal.lf : pal.l;
  const mh = o.mh || 1, vor = o.vor || 0, lang = o.lang || 1, top = -6.2 - 13.6 * mh, hb = 6.6;
  const PO = fern ? "#1e1c1b" : pal.polster || "#3a3532";
  let s = "";
  if (!T.fein || (fern && !o.voll)) return `<path d="${G([[wx - hb, top], [wx + hb, top], [wx + hb + 1, -6], [wx + hb + 5 * lang + vor, -4.6], [wx + hb + 5.6 * lang + vor, -1.6], [wx + hb + 4.6 * lang + vor, 0, 1], [wx - hb + 1, 0, 1], [wx - hb, -4]])}" fill="${fern ? C[0] : C[1]}"/>` +
    (fern && T.fein ? [3.6, 5.4, 4.6, 2.6].map((L, i) => `<ellipse cx="${f1(wx + hb + L * lang + vor - 2)}" cy="${f1(-3.6 + i * 0.3)}" rx="1.8" ry="1.3" fill="${["#1e1c1b", "#262422", "#2e2b29", "#363230"][i]}"/>`).join("") +
      W.L([`M${f1(wx + hb + 1)} -6.4q${f1(3 * lang)} 1 ${f1(4.6 * lang)} 4`, `M${f1(wx + hb - 1)} -6q${f1(2 * lang)} 1.4 ${f1(3.4 * lang)} 4.6`], "#000", 0.2, 0.7) :
      `<path d="M${f1(wx + hb + 2 * lang + vor)} -4.2h${f1(3 * lang)}" stroke="${PO}" stroke-width="1.4"/>`);
  /* Daumenstummel hinten innen, ohne Bodenkontakt */
  s += W.glied([[wx - hb + 1, -12], [wx - hb - 0.8, -9.6], [wx - hb - 1, -8.2]], 2.4, fern ? "#0c0b0b" : C[0], "");
  /* Finger: fern (Zeige-) → nah (kleiner Finger); Front = Knöchel (PIP) */
  const F = [[1.2, -1.6, 5.4, 4.6], [1.4, -1.1, 6.4, 4.8], [0.6, -0.6, 5.4, 4.8], [-0.4, 0, 3.6, 4.4]];
  F.forEach(([dz, dy, L, h], i) => {
    const x0 = wx - hb + 1.6, x1 = wx + hb + (L * lang) + vor + dz;
    const pts = [[x0, -7 + dy], [wx + hb - 0.6, -7.4 + dy], [x1 - h * 0.6, -h + dy], [x1 - h * 0.1, -h * 0.62 + dy], [x1, -h * 0.25], [x1 - h * 0.35, 0, 1], [x0 + 0.6, 0, 1], [x0 - 0.4, -2.6]];
    const c = fern ? (pal.walzeF || (o.voll ? [C[0], C[0], C[1], C[2]] : ["#0b0a0a", "#0d0c0c", "#0f0e0e", "#121110"]))[i] : [C[0], C[0], C[1], C[2]][i];
    s += W.teil(pts, i < 3 && !fern ? T.lg("fw" + pal.n + i, [[0, "#1e1c1b"], [1, c]], 0, 0, 1, 0) : c,
      /* Knöchelpolster vorn oben: matt, heller, Querfalten */
      W.weich([[x1 - h * 0.42, -h * 0.62 + dy, h * 0.45, h * 0.3, -25, PO, 1], [x1 - h * 0.5, -h * 0.78 + dy, h * 0.28, h * 0.13, -25, fern ? PO : "#8a847e", 0.8], [x0 + (x1 - x0) * 0.5, -0.6, (x1 - x0) * 0.5, 0.6, 0, "#000", 0.6]], 0.3) +
      (i === 3 && !fern ? W.falten([`M${f1(x1 - h * 0.6)} ${f1(-h * 0.92)}q.6 .8 .4 1.8`, `M${f1(x1 - h * 0.35)} ${f1(-h * 0.84)}q.6 .7 .4 1.6`, `M${f1(x1 - h * 0.85)} ${f1(-h * 0.94)}q.5 .7 .3 1.6`,
        `M${f1(wx + hb - 0.2)} -6.8q.8 .4 1.2 1.2`], 0.1, "#000", "#7a746e", 0.7, 0.18) : "") +
      (i === 3 && !fern ? W.L([`M${f1(x0 + 1)} ${f1(-h * 0.98)}L${f1(x1 - h * 0.7)} ${f1(-h * 0.98)}`], "#000", 0.14, 0.45) : ""),
    { rand: fern ? 0.3 : 0.7, rw: 0.35, vol: false });
  });
  /* Mittelhand (senkrecht), Handrücken mit Querfalten, Ballen hinten */
  const hand = [[wx - hb + 0.4, top], [wx + hb - 0.4, top], [wx + hb, -12], [wx + hb - 0.4, -7.6], [wx + 2, -6.6], [wx - hb + 1, -6.8], [wx - hb, -11]];
  s += W.teil(hand, T.lg((fern ? "hdf" : "hd") + pal.n, fern ? pal.gf : pal.g, 0, 0, 1, 0.3),
    W.weich([[wx - 2.4, -14.6, 2.6, 4, 0, LI, fern ? 0.15 : 0.3], [wx + hb - 1, -12, 1.2, 5, 0, "#000", 0.55]], 1) +
    W.falten([`M${f1(wx - 3.6)} -15.6q1.6 -.5 3.4 0`, `M${f1(wx + 0.6)} -15.2q1 -.2 2 .2`, `M${f1(wx - 3.2)} -12.8q2.2 -.5 4.2 .2`, `M${f1(wx - 4)} -10.4q1.4 -.4 2.6 0`], 0.1, "#000", LI, 0.6, 0.15),
  { rand: 0.45, vol: false });
  return s;
}

/* Gorillafuß (Sohlengänger): flache Sohle, gerundete matte Ferse, Querfalten an den Zehenansätzen; Großzehe dick und
   kurz, 30–40° nach vorn innen abgesetzt, mit eigenem Nagel; Zehen 2–5 kurz, einzeln gerundet, flache Nägel. */
function gorillaFuss(W, T, dx, fern, pal = HAUT_G) {
  const P = (x, y) => [x + dx, y];
  const C = fern ? pal.cf.concat(pal.cf[2]) : pal.c.concat(pal.c[2]), LI = fern ? pal.lf : pal.l;
  let s = "";
  if (!T.fein || fern) return `<path d="${G([P(21, -14.4), P(17.4, -9), P(18, -2.6), P(22, 0, 1), P(41.6, 0, 1), P(42.4, -2.6), P(39.6, -6.4), P(33, -8.6), P(26, -12.6)])}" fill="${fern ? C[0] : C[1]}"/>` +
    (fern && T.fein ? W.L([`M${f1(dx + 34)} -7q2.6 1 3.4 6.6`, `M${f1(dx + 37)} -5.6q2 1 2.4 5.2`], "#000", 0.2, 0.6) : "");
  const nagel = (x, y, w, rot) => `<ellipse cx="${f1(x + dx)}" cy="${f1(y)}" rx="${f1(w)}" ry="${f1(w * 0.45)}" transform="rotate(${rot} ${f1(x + dx)} ${f1(y)})" fill="${fern ? pal.nf : "#4a4440"}"/>`;
  /* Großzehe (innen, fern): dicker Wulst, nach vorn-innen, vor den anderen Zehen */
  s += W.teil([P(33, -6.4), P(38.4, -5.8), P(42.6, -4.4), P(44, -2.2), P(42.6, -0.2), P(38, 0, 1), P(33.6, -1.4)], fern ? C[0] : T.lg("gz", [[0, "#2c2a28"], [1, "#0e0d0d"]], 0, 0, 0, 1),
    W.weich([[dx + 40, -4.4, 2.6, 0.8, 0, LI, fern ? 0.1 : 0.3]], 0.4), { rand: 0.5, rw: 0.3, vol: false }) + nagel(42.4, -3.6, 1.15, 20);
  /* Zehen 2–5: einzeln gerundet, kurz, leicht gekrümmt */
  const zehe = (i) => {
    const [bx, tx, h] = [[32.4, 40.6, 4.4], [32, 39.8, 4.3], [31.4, 38.8, 4.2], [30.8, 37.6, 4]][i];
    const pts = [P(bx, -h - 0.6), P(tx - h * 0.5, -h), P(tx, -h * 0.5), P(tx - h * 0.3, 0, 1), P(bx, 0, 1)];
    return W.teil(pts, fern ? C[i] : T.lg("ze" + pal.n, [[0, "#2c2a28"], [0.6, C[2]], [1, "#0c0b0b"]], 0, 0, 0.2, 1),
      W.weich([[tx - h * 0.5 + dx, -h * 0.75, h * 0.35, h * 0.16, 15, LI, fern ? 0.1 : 0.28]], 0.35) +
      (fern ? "" : W.falten([`M${f1(bx + 1.6 + dx)} ${f1(-h + 0.3)}q.3 .6 .2 1.2`], 0.08, "#000", LI, 0.6, 0.12)),
    { rand: 0.55, rw: 0.25, vol: false }) + nagel(tx - 1.1, -h + 0.45, 0.8, 26);
  };
  s += zehe(0) + zehe(1) + zehe(2);
  const fussPts = [P(21, -13), P(18.4, -11), P(17.2, -7.6), P(17.6, -3.8), P(19.6, -1), P(22.6, 0, 1), P(33, 0, 1), P(35, -1.4), P(35.4, -4.4), P(34, -6.8), P(30, -8.8), P(26, -11.4)];
  s += W.teil(fussPts, T.lg((fern ? "fuf" : "fu") + pal.n, fern ? pal.gf : [[0, "#262422"], [0.6, "#1c1a19"], [1, "#0e0d0c"]]),
    W.relief("fhaut", `<path d="${G(fussPts)}" fill="#3a3634" fill-opacity=".4"/>`, { f: 2.4, tiefe: 0.35, okt: 2 }) +
    W.weich([[dx + 26.6, -9.6, 6, 1.6, -24, LI, fern ? 0.08 : 0.16], [dx + 26, -0.8, 9, 1.3, 0, "#000", 0.6], [dx + 18.6, -6, 1.4, 3.4, 0, LI, fern ? 0.08 : 0.2]], 0.9) +
    W.falten(["M29.4 -9q2.2 1 3.6 2.6", "M31.6 -7.4q1.4 .8 2.2 2.2", "M25 -7.6q2.6 .7 4.2 2.4", "M21.4 -4.2q1.6 .4 2.8 1.6", "M19.6 -10q.8 1.4 .8 3"].map((d) => d.replace(/^M([\d.]+)/, (m, x) => "M" + f1(+x + dx))), 0.11, "#000", LI, 0.6, 0.12),
  { rand: 0.5, vol: false });
  s += zehe(3);
  return s;
}

/* Gorillakopf im Profil: Scheitelkamm als Kegel (Spitze oben hinten), Nacken ohne Knick in den Trapezbuckel,
   Überaugenwulst als Dach mit Schlagschatten, tiefe Augenhöhle, breite Nase mit aufgerollten Flügeln,
   vorgewölbte Schnauze, dicke Unterlippe, fliehendes Kinn, kleines anliegendes Ohr. */
function gorillaKopf(T, W, STR, KAPPE, HAUT, licht) {
  let s = "";
  const profil = [[118, -128], [124, -123.2], [130, -119.6], [132.8, -117.6], [133.2, -115.4], [131.4, -113.8], [129.4, -112.8], [129.4, -110.6], [131.2, -108.4], [134, -106], [136.6, -103.6],
    [137.4, -101], [136.8, -99.4], [137.8, -98], [139, -96.4], [139.2, -94.6], [138.4, -93.4], [138.6, -92.6], [137.6, -90.6], [135.4, -89.6], [134, -87.4], [130.6, -85]];
  const hinten = [[86, -128], [90, -132], [96, -136.2], [102.6, -138.8], [108.6, -137.6], [114, -133]];
  const kopf = hinten.concat(profil, [[124, -84], [116, -84.8], [108, -87.4], [100, -93], [94, -102], [89, -114]]);
  const gesicht = profil.concat([[125, -84.4], [121.4, -88.6], [119, -95], [117.8, -102], [117, -110], [116.6, -118], [115.6, -125]]);
  const kappe = [[90, -131], [96, -136.2], [102.6, -138.8], [108.6, -137.6], [114, -133], [117.4, -129], [110, -129.4], [102, -131], [94, -128]];
  s += W.vol("kf", 6, W.teil(kopf, T.lg("kf", [[0, "#2c2a28"], [0.55, "#171615"], [1, "#0a0909"]], 0, -139, 0, -84, UB),
    W.weich([[100, -133, 10, 3.4, -18, "#6e7076", 0.5], [108, -92, 10, 6, 0, "#000", 0.6], [112, -118, 4, 8, 0, "#000", 0.25]], 2.2) +
    W.musterFlaeche(kopf, W.haarMuster("schw", 12, 9, 80, 6, [["#000", 0.16, 0.7], ["#252428", 0.15, 0.6], ["#3e3e44", 0.14, 0.55], ["#5c5c62", 0.12, 0.5]], 0.5)(122)) +
    W.haare(kopf, 110, (x, y) => (y < -126 ? 196 : x < 112 ? 120 + clamp((y + 120) / 30) * 10 : 106), 1.8, [["#000", 0.13, 0.6], ["#151416", 0.13, 0.55], ["#2c2b2e", 0.12, 0.55], ["#4a4a50", 0.12, 0.5], ["#707078", 0.11, 0.5]], { licht: (x, y) => licht(x, y) * 1.1, buendel: 3, krumm: 0.3, szene: 0.08 }) +
    W.weich([`<path d="${G(kappe)}" fill="#4a2a17" opacity=".42"/>`], 2.4) +
    W.haare(kappe, 140, (x) => (x < 104 ? 205 : 190), 1.6, KAPPE.map((c) => [c, 0.12, 0.6]), { licht: (x, y) => clamp(0.3 + (-y - 129) / 9), buendel: 2, gerade: true, szene: 0.1 }) +
    /* Gesichtshaut läuft hinten weich ins Kopfhaar aus (keine aufgeklebte Maske) */
    `<g mask="url(#${W.maskeForm("gh", [[118.6, -128], [140, -128], [142, -82], [124.6, -82], [120.6, -90], [119.4, -104], [119.6, -118]], 1.3)})">` + gorillaGesicht(T, W, gesicht, HAUT) + `</g>` +
    /* Haaransatz: kurze, nach hinten gerichtete Härchen über der Grenze (statt Zackenkante) */
    (T.fein ? W.haare([[114.6, -127], [120.4, -126.4], [121.4, -110], [122.4, -96], [125, -88], [128, -84.6], [122, -84.6], [118.4, -94], [116.4, -110]], 110,
      (x, y) => (y < -112 ? 200 : y < -96 ? 186 : 165), 1.6, [["#0a0909", 0.07, 0.6], ["#1a1918", 0.07, 0.55], ["#2c2a28", 0.06, 0.5]], { mix: 0.8, gerade: true }) : ""),
  { rand: 0, vol: false, maske: W.maskeForm("kf", [[84, -128], [90, -134], [102.6, -141], [118, -132], [142, -110], [142, -80], [122, -80], [108, -84], [101, -92], [97, -104], [93, -116]], 3.4) }), { tiefe: 3, umgebung: 0.5 });
  s += W.L([G(profil, false)], "#000", 0.3, 0.45);
  /* 1 px Streiflicht trennt Kopf und Schulterbuckel (auch klein lesbar) */
  s += W.L([G([[88, -131.4], [95, -135.8], [102.6, -138.4]], false)], "#6a6a70", 0.35, 0.55);
  /* Kappe: weich ausgefranste Silhouette aus kurzem, rotbraunem, nach hinten gekämmtem Haar */
  s += W.saum([[88, -130], [96, -136.2], [102.6, -138.8], [108.6, -137.6], [114, -133], [117.4, -129]], 50, (x) => (x < 103 ? 200 : 186), 1.4,
    KAPPE.map((c) => [c, 0.12, 0.7]), { licht: () => 0.6, krumm: 0.4, ein: 0.5, szene: 0.15 });
  s += W.saum([[100, -93], [108, -87.4], [116, -84.8], [124, -84]], 30, 96, 2.2, [["#000", 0.16, 0.7], ["#141315", 0.15, 0.65]], { krumm: 0.4, szene: 0.15 });
  /* Ohr: klein, dunkel wie das Gesicht, eng anliegend; Helixrand, Muschel, Tragus; oben vom Haar bedeckt */
  const ohr = [[108.4, -106.6], [110.8, -107.4], [112.2, -105.2], [111.8, -101.8], [110.2, -100], [108.6, -100.8], [108, -103.6]];
  s += W.teil(ohr, HAUT, W.weich([[110.2, -103.6, 1.1, 1.8, 0, "#000", 0.7]], 0.4) +
    W.falten(["M109.2 -106q2 -.6 2.4 1.6q.2 2.2 -1.4 3.6", "M110.6 -103.6q.6 1 0 2"], 0.16, "#000", "#7a7470", 0.8, 0.45) +
    `<ellipse cx="111.6" cy="-102.6" rx=".45" ry=".7" fill="#3a3634"/>`, { rand: 0.4, vol: false });
  s += W.saum([[107.6, -108], [110, -108.4], [112.4, -106.6]], 12, 120, 1.2, [["#000", 0.12, 0.7], ["#1e1d1f", 0.12, 0.6]], { szene: 0 });
  return s;
}

/* Gesichtshaut: matt schwarzgrau, Glanz nur auf Nasenrücken, Wulstkante und Unterlippe; Falten unregelmäßig als Rinne +
   Lichtkante, Tränensäcke als weiche Wülste; Nasenflügel als dicker aufgeworfener „C“-Wulst, Nasenloch als Schlitz. */
function gorillaGesicht(T, W, gesicht, HAUT) {
  let s = `<path d="${G(gesicht)}" fill="${T.lg("gh", [[0, "#2a2725"], [0.45, HAUT], [1, "#121110"]], 0, -128, 0, -84, UB)}"/>`;
  s += W.weich([
    /* Wulstdach: Oberseite im Streiflicht, Unterseite tiefer Schlagschatten über der Augenhöhle */
    [126.6, -120.8, 6.4, 1.4, 26, "#7e7a76", 0.7], [132.2, -116.6, 1.2, 1.2, 0, "#8e8a86", 0.5], [126.6, -112.4, 6.2, 2.2, 6, "#000", 0.95],
    /* Tränensäcke als weiche Wülste (Licht oben, Schatten unten) */
    [124.6, -106.6, 3.2, 0.7, 8, "#4a4644", 0.6], [124.4, -105.6, 3.4, 0.6, 8, "#000", 0.5], [124.2, -104.2, 3, 0.6, 8, "#454240", 0.45],
    /* Schnauzenwölbung, Unterlippe, Kinn/Kiefer im Schatten */
    [134.6, -96.4, 3.4, 1.6, -10, "#3e3a38", 0.45], [136, -91.4, 1.8, 0.5, -10, "#6e6a66", 0.5], [128, -88.4, 6, 2.6, 0, "#000", 0.5], [121.6, -100, 3, 7, 0, "#000", 0.35],
  ], 0.8);
  /* Falten: unregelmäßig lang, teils unterbrochen */
  s += W.falten([
    "M118.6 -124.4q2 -1 4.2 -.8", "M123.4 -125q1.6 -.2 2.6 .2", "M119.8 -122.2q2.6 -1 5 -.4", "M121.4 -120.6q1.4 -.4 2.6 0",
    "M129.8 -110.8q1.2 .4 1.6 1.4", "M130.8 -109.4q.8 .4 1.1 1",
    "M120.8 -107q1.6 1 3.6 .6", "M127.2 -106.2q1 0 1.8 -.6", "M120.6 -104.6q2 1.2 3.8 .4",
    "M133 -101.6q-1.8 2.8 -1.4 5.4", "M131.6 -95.2q0 1.2 .4 2.2", "M130.2 -102.4q-2.2 3.6 -1.4 6.4", "M129 -94.6q.2 1.4 .8 2.6",
    "M136.6 -97l-.3 1.4", "M135.3 -96.6l-.2 1.6", "M134.4 -88.6q-2 -.6 -3.8 .2",
  ], 0.18, "#000", "#7a7470", 0.75, 0.35);
  /* Nasenrücken: 3–4 senkrechte Rillen („Nasenabdruck“), leichter Glanz */
  s += W.weich([[133.2, -106.4, 1.8, 0.6, 38, "#8a8682", 0.5]], 0.4);
  s += W.falten(["M132.4 -107.6l.5 2", "M133.6 -107.2l.4 2", "M134.8 -106.4l.3 1.8", "M135.8 -105.4l.2 1.4"], 0.12, "#000", "#8a8682", 0.7, 0.35);
  /* Nasenflügel: dicker „C“-Wulst (Lichtkante oben, Schatten darunter), Nasenloch schräger Schlitz nach vorn unten */
  const fl = [[136, -106.2], [132.6, -105.6], [130.4, -103], [130.4, -99.6], [132.6, -97.2], [136, -96.8], [137.4, -98.4], [134.4, -98.8], [132.6, -100.4], [132.8, -103], [134.6, -104.4], [137, -104.4]];
  s += `<path d="${G(fl)}" fill="${T.lg("gnf", [[0, "#4a4644"], [0.5, "#262321"], [1, "#0e0d0c"]], 0, 0, 0.3, 1)}"/>` +
    W.L(["M136 -105.8q-3 .2 -4.8 2.4"], "#9a9590", 0.25, 0.5) + W.L(["M131 -99q.8 2 3.2 2.6"], "#000", 0.35, 0.8);
  s += `<path d="${G([[134, -101.6], [136.4, -102.4], [138, -100.6], [137.6, -99.2], [135.4, -99.4]])}" fill="#030202"/>`;
  /* Mund: Mundspalte bis unter die Augenmitte, dicke Unterlippe */
  s += W.L(["M138.4 -93.2q-3 .4 -6 .3q-3.4 0 -6.4 1.4"], "#000", 0.45, 0.95) + W.L(["M138 -92.3q-3.6 .3 -7 .3"], "#5a5552", 0.22, 0.5);
  /* Auge: tief unter dem Wulst, dicke faltige Lidrolle (≈ 35 %), Iris dunkelbraun, Glanz winzig und gedämpft */
  s += W.auge2(125.6, -109.6, 1.45, { iris: "#2e1a10", iris2: "#100604", sklera: "#1a120e", offen: 0.8, winkel: 4, lidDeck: 0.36, lid: "#2a2725", lidHell: "#5e5854",
    glanz: 0.3, karunkel: "#4e4450", hoehle: "#000" });
  s += W.falten(["M122.6 -111.4q3 -1.2 6.2 -.2"], 0.14, "#000", "#6e6864", 0.7, 0.3);
  s += W.weich([[125.6, -111.8, 3.6, 1.2, 4, "#000", 0.75]], 0.5);
  return s;
}

/* =====================================================================
   SCHIMPANSE (Gemeiner Schimpanse, erwachsenes Männchen, Knöchelgang)
   RECHERCHE (New England Primate Conservancy, Animal Law Info, Brain Museum, chimpsnw.org): Männchen 40–60 kg,
   aufrecht 1,2–1,5 m, Kopf-Rumpf 0,75–0,9 m; schlank, Arme lang (Spannweite ≈ 1,5 × Körperhöhe), Beine relativ länger
   als beim Gorilla; Rücken flacher (≈ 20°), kein Schulterbuckel. Haar schwarz, grob, ohne Unterwolle, schütter –
   an Brust, Bauch, Leiste und Innenarm scheint die Haut durch; an Schulter und Unterarm länger. Gesicht nackt, bei
   Erwachsenen dunkel/gefleckt, um die Augen dunkler, Schnauze heller; kräftiger Überaugenwulst, flache fliehende Stirn
   (Haaransatz dicht am Wulst), kleine flache Nase, stark vorspringende Schnauze mit langer, beweglicher Oberlippe (der
   vorderste Punkt), fliehendes Kinn, oft weißgraue Kinnhaare; GROSSE, dünne, abstehende Ohren; Augen braun. Hand lang
   und schmal (lange Mittelhand), Knöchelgang; Fuß lang mit daumenartig abgespreizter Großzehe.
   ===================================================================== */
function schimpanse(T) {
  const W = werk(T);
  W.dichte = T.fein ? 0.6 : 0.8;
  W.saumDichte = T.fein ? 0.8 : 1;
  const SCH = [["#000", 0.12, 0.6], ["#151516", 0.12, 0.55], ["#2c2c31", 0.11, 0.55], ["#4c4c54", 0.11, 0.55], ["#6a6a72", 0.1, 0.55]];
  const KH = [["#000", 0.14, 0.75], ["#141416", 0.13, 0.7], ["#2a2a2e", 0.12, 0.65], ["#46464c", 0.11, 0.6]];
  const licht = (x, y) => clamp(0.15 + (-y - 30) / 60 - (x - 40) / 300);
  const wahl = (x, y) => 0.3 + licht(x, y) * 0.7;
  const HAUT = "#3a302a";
  /* schütteres, schwarzes, leicht welliges Haar als Kachelmuster; Grundfläche ist Haut (scheint durch) */
  const CM = W.haarMuster("chimp", 10, 7, 60, 4.4, [["#000", 0.13, 0.85], ["#121214", 0.12, 0.8], ["#26262a", 0.12, 0.7], ["#5a5a62", 0.1, 0.55]], 0.6);
  const hautG = (n, a, b) => T.lg("cs" + n, [[0, a], [1, b]]);
  const fell = (pts, n, w, L, o = {}) => W.haare(pts, n, w, L, SCH, Object.assign({ licht, wahl, buendel: 3, krumm: 0.5, streu: 14, szene: 0.08 }, o));
  const kante = (pts, n, w, L, o = {}) => W.saum(pts, n, w, L, KH, Object.assign({ krumm: 0.55, ein: 0.3, streu: 18, szene: 0.25 }, o));
  let s = "";

  /* ---------- ferne Glieder (Schattenseite, ~30 % dunkler, schmaler) ---------- */
  s += schimpansenFuss(W, T, -11, true);
  const beinF = [[6, -54], [14, -52], [20, -44], [22, -34], [18, -26], [14, -18], [12, -11], [7, -9.6], [4, -12], [4, -20], [6, -28], [2, -38], [1, -46]];
  s += W.vol("v", 2.4, W.teil(beinF, hautG("bf", "#1e1a18", "#0e0c0b"), W.musterFlaeche(beinF, CM(104), 0.8) + fell(beinF, 40, 100, 3, { licht: (x, y) => licht(x, y) * 0.5 }), { rand: 0 }) +
    kante([[4, -22], [4, -12], [7, -9.6]], 14, 96, 2.4), { tiefe: 3, umgebung: 0.5 });
  s += W.skaliert(80, 0, 0.7, () => knoechelhand(W, T, 0, true, HAUT_S, { mh: 1.3, vor: 1, lang: 1.3, voll: 1 }));
  const armF = [[64, -76], [72, -74], [76, -64], [77.6, -52], [78.4, -44], [79.6, -36], [80.6, -28], [81.4, -17.4], [76, -17.4], [74.4, -26], [72.4, -36], [70.4, -44], [68.4, -52], [66.4, -62]];
  s += W.vol("v", 2.2, W.teil(armF, hautG("af", "#201c1a", "#0e0c0b"), W.musterFlaeche(armF, CM(98), 0.8) + fell(armF, 50, 98, 4, { licht: (x, y) => licht(x, y) * 0.55 }), { rand: 0 }) +
    kante([[66.4, -62], [68.4, -52], [70.4, -44], [72.4, -36], [74.4, -26], [76, -17.6]], 30, 106, 4.4) + kante([[81.6, -18.6], [78.8, -18], [76, -17.6]], 12, 92, 2.4), { tiefe: 3, umgebung: 0.5 });

  /* ---------- Rumpf: schlank, Becken hinten gerundet (umschließt den Oberschenkelansatz), schütteres Haar; an Brust,
     Bauch und Leiste scheint die Haut durch ---------- */
  const rumpf = [[1, -48], [2, -56], [6, -62], [16, -66], [30, -70], [44, -75], [56, -79], [64, -83], [70, -86], [76, -86], [80.4, -81], [82, -73], [81, -63], [76, -55], [66, -49], [54, -46],
    [42, -46], [32, -47], [20, -46], [10, -43], [4, -43]];
  const hautZone = [[79, -66], [76, -56], [66, -49.6], [54, -46.6], [42, -46.6], [32, -47.6], [22, -47], [28, -53], [44, -54], [58, -56], [70, -60]];
  let rs = W.teil(rumpf, hautG("rf", "#2a2422", "#120f0e"),
    W.musterFlaeche(rumpf, CM(176)) +
    W.weich([`<path d="${G(hautZone)}" fill="${HAUT}" opacity=".85"/>`, [66, -47.6, 14, 1.4, 4, "#6a5a4e", 0.5], [70, -82, 8, 2.4, -10, "#5a5a62", 0.4]], 2) +
    W.musterFlaeche(hautZone, CM(95), 0.5) +
    fell(rumpf, 120, (x, y) => (x > 60 ? 118 + (y + 70) * 0.5 : y > -54 ? 96 : 184 - clamp((y + 70) / 20) * 40), 4) +
    /* Gesäßspitze: kurzes, etwas helleres Haar */
    W.haare([[0, -54], [4, -50], [3, -44], [-1, -48]], 30, 160, 1.2, [["#3a3a40", 0.1, 0.6], ["#5a5a62", 0.1, 0.55]], { mix: 1, gerade: true, szene: 0 }),
  { rand: 0 });
  rs += kante([[1, -50], [2, -56], [6, -62], [16, -66], [30, -70], [44, -75], [56, -79], [64, -83]], 50, (x) => (x < 6 ? 140 : 182), 2.6);
  rs += kante([[76, -55], [66, -49], [54, -46], [42, -46], [32, -47], [20, -46]], 50, 94, 3.4);
  s += W.vol("v", 6, rs, { tiefe: 3, umgebung: 0.5 });

  /* ---------- nahes Hinterbein: Oberschenkel schräg nach vorn zum Knie, Unterschenkel schlanker mit Wade hinten ---------- */
  s += schimpansenFuss(W, T, 0, false);
  const beinN = [[8, -56], [16, -57], [24, -52], [30, -44], [33.4, -35], [32.4, -28], [29, -22], [26, -16], [24.6, -9.6], [18.6, -8.6], [15.6, -11], [15, -17], [16.4, -23], [13.4, -29], [9.4, -36],
    [6.6, -44], [6, -50]];
  s += W.vol("v", 3, W.teil(beinN, hautG("bn", "#2a2422", "#120f0e"),
    W.musterFlaeche(beinN, CM(110)) +
    W.weich([[32, -34, 1.8, 5, -25, "#6a6a72", 0.5], [14.6, -26, 1.8, 5, -20, "#000", 0.5], [20, -44, 6, 3, 30, "#5a5a62", 0.35]], 1.4) +
    fell(beinN, 70, (x, y) => (y < -40 ? 118 : 100), 3.6, { licht: (x, y) => clamp(licht(x, y) + 0.2) }),
  { rand: 0, maske: W.maske("cbn", [-6, -66, 40, -2], 0, -56, 0, -46) }) +
    kante([[6, -46], [9.4, -36], [13.4, -29], [16.4, -23], [15, -17], [15.6, -11]], 34, 104, 3.4) +
    kante([[15.6, -11], [18.6, -8.6], [24.6, -9.6]], 24, 82, 2.4) +
    kante([[24, -52], [30, -44], [33.4, -35]], 14, 40, 1.6), { tiefe: 3, umgebung: 0.5 });

  /* ---------- naher Arm: Schulterkugel, Ellbogen als Knick (≈ −52), Unterarmspindel; Haar bis zum Handgelenk ---------- */
  s += W.skaliert(64.2, 0, 0.7, () => knoechelhand(W, T, 0, false, HAUT_S, { mh: 1.3, vor: 1, lang: 1.3 }));
  const armN = [[50, -76], [58, -80], [66, -80], [70, -74], [71, -66], [70, -58], [69.4, -52], [70.4, -46], [70.4, -36], [69, -26], [68.2, -17.2], [60.6, -17.2], [59.6, -26], [58.4, -34], [56.4, -42],
    [53.6, -48], [52.6, -52], [52.6, -60], [51, -67], [50, -72]];
  s += W.vol("v", 2.4, W.teil(armN, hautG("an", "#2c2624", "#120f0e"),
    W.musterFlaeche(armN, CM(100)) +
    W.weich([[60, -77, 8, 4, -15, "#6a6a72", 0.5], [53, -64, 2.4, 9, 0, "#000", 0.5], [53.4, -50, 1.8, 2.4, 0, "#000", 0.6], [68.6, -40, 1.6, 7, 0, "#6a6a72", 0.4]], 1.4) +
    fell(armN, 110, (x, y) => (y < -56 ? (x < 58 ? 116 : 104) : Math.abs(y + 50) < 4 && x < 56 ? 140 : 96), 4.6, { licht: (x, y) => clamp(licht(x, y) + (x > 62 ? 0.12 : -0.12)) }),
  { rand: 0, vol: false, maske: W.maske("can", [40, -92, 80, -10], 0, -84, 0, -74) }) +
    kante([[50, -72], [51, -67], [52.6, -60], [52.6, -52], [53.6, -48], [56.4, -42], [58.4, -34], [59.6, -26], [60.6, -17.6]], 70, (x, y) => 102 + (y < -50 ? 12 : 4), 5) +
    kante([[68.8, -19], [64.6, -18], [60.6, -17.6]], 22, 90, 2.6) +
    kante([[70, -58], [69.4, -52], [70.4, -46], [70.4, -36]], 12, 80, 1.6), { tiefe: 3, umgebung: 0.5 });

  /* ---------- Kopf: etwas tiefer und vor der Schulter (hängender Kopf im Knöchelgang) ---------- */
  W.still = true;
  const kopfSvg = schimpansenKopf(T, W, SCH, ["#050505", "#131314", "#202024", "#33333a"], licht);
  W.still = false;
  s += `<g transform="translate(78 -66) scale(1.24) translate(-76 70)">${kopfSvg}</g>`;
  W.box([[66, -100], [105, -51]]);
  return W.fertig(s, 1, [64, -101, 106, -52], [3, 26, 66, 82]);
}

/* Schimpansenfuß: lang und schmal, Ferse sichtbar, daumenartig abgespreizte lange Großzehe (eigener Finger mit Nagel),
   Zehen 2–5 lang und leicht eingekrümmt, flache Nägel, Sohle hell graubraun mit Falten. */
function schimpansenFuss(W, T, dx, fern) {
  const P = (x, y) => [x + dx, y];
  const pal = HAUT_S, C = fern ? pal.cf.concat(pal.cf[2]) : pal.c.concat(pal.c[2]), LI = fern ? pal.lf : pal.l;
  let s = "";
  const nagel = (x, y, w, rot) => `<ellipse cx="${f1(x + dx)}" cy="${f1(y)}" rx="${f1(w)}" ry="${f1(w * 0.5)}" transform="rotate(${rot} ${f1(x + dx)} ${f1(y)})" fill="${fern ? pal.nf : pal.na}"/>`;
  if (!T.fein) return `<path d="${G([P(19.6, -11.4), P(16, -7), P(16.6, -1.4), P(20, 0, 1), P(37, 0, 1), P(37.4, -2.2), P(33, -5.4), P(26, -7.6)])}" fill="${C[1]}"/>`;
  /* Großzehe: lang, wie ein Daumen nach vorn-innen abgespreizt, tiefer als die anderen Zehen */
  /* Großzehe: daumenartig, vom Ballen (innen) 40–60° nach vorn-unten abgespreizt, eigener Nagel und Ballen */
  s += W.teil([P(21, -6.6), P(24.4, -6), P(27, -4), P(30.4, -2.6), P(33.6, -2.2), P(34.8, -1), P(33.6, 0, 1), P(27, 0, 1), P(22, -1.4), P(20.4, -3.8)], fern ? C[0] : T.lg("cgz", [[0, "#4a3c34"], [1, "#1a1412"]], 0, 0, 0.2, 1),
    W.weich([[dx + 23, -3.6, 2.6, 1.6, 0, LI, fern ? 0.1 : 0.35], [dx + 31, -1.8, 2.4, 0.5, 0, LI, fern ? 0.1 : 0.4]], 0.4) +
    (fern ? "" : W.falten([`M${f1(dx + 26.4)} -4q.4 1 .1 2.4`, `M${f1(dx + 29.6)} -2.8q.3 .7 0 1.6`], 0.08, "#000", LI, 0.6, 0.2)), { rand: 0.55, rw: 0.25, vol: false }) + nagel(34, -1.6, 0.85, 5);
  /* Zehen 2–4 (fern → nah): lang, eingekrümmt */
  const zehe = (i) => {
    const [bx, by, tx, b] = [[28.6, -7.4, 38.6, 2.4], [28.2, -6.6, 38, 2.4], [27.8, -5.8, 37, 2.3], [27.2, -5, 35.8, 2.2]][i];
    const f = [P(bx, by - b / 2), P(bx + (tx - bx) * 0.55, by - b * 0.2), P(tx - b * 0.5, -b * 1.05), P(tx, -b * 0.4), P(tx - b * 0.4, 0, 1), P(bx + (tx - bx) * 0.5, -0.6), P(bx, by + b / 2)];
    return W.teil(f, fern ? C[i] : T.lg("cze", [[0, "#5a4c44"], [0.5, C[2]], [1, "#141010"]], 0, 0, 0.3, 1),
      W.weich([[tx - b * 0.6 + dx, -b * 0.85, b * 0.4, b * 0.18, 20, LI, fern ? 0.15 : 0.45]], 0.4) +
      (fern ? "" : W.falten([`M${f1(bx + (tx - bx) * 0.45 + dx)} ${f1(by - b * 0.4)}q.4 .7 .2 1.4`, `M${f1(bx + (tx - bx) * 0.7 + dx)} ${f1(-b * 0.95)}q.4 .6 .2 1.2`], 0.08, "#000", LI, 0.6, 0.25)),
    { rand: 0.55, rw: 0.22, vol: false }) + nagel(tx - 0.8, -b + 0.3, 0.7, 34);
  };
  s += zehe(0) + zehe(1) + zehe(2);
  const fussPts = [P(19.6, -11.6), P(16.6, -9), P(15.8, -4.4), P(17, -1), P(20, 0, 1), P(28.6, 0, 1), P(30.4, -1.8), P(30, -4.6), P(27.4, -6.6), P(24, -8.6), P(21.6, -11.4)];
  s += W.teil(fussPts, fern ? C[2] : T.lg("cfu", pal.g),
    W.weich([[dx + 23.6, -8.6, 4, 1.4, -28, LI, fern ? 0.15 : 0.4], [dx + 17.6, -5, 1.2, 3, 0, LI, fern ? 0.1 : 0.3]], 0.8) +
    /* helle, faltige Sohle */
    `<path d="${G([P(16.4, -2.6), P(18.6, -0.6), P(24, -0.1), P(29.4, -0.4), P(29.4, -1.6), P(24, -1.8), P(19.4, -2.4)])}" fill="${fern ? "#3a302a" : "#7a6a5c"}"/>` +
    W.falten(["M24.6 -7.4q2 .8 3.4 2.4", "M21 -5.6q2.2 .6 3.6 2", "M18.6 -8.6q.8 1.4.8 3", "M20.6 -1.6l.4 1", "M23 -1.8l.3 1.1", "M25.4 -1.7l.3 1"].map((d) => d.replace(/^M([\d.]+)/, (m, x) => "M" + f1(+x + dx))), 0.1, "#000", LI, 0.55, 0.25),
  { rand: 0.5, vol: false });
  s += zehe(3);
  return s;
}

/* Schimpansenkopf im Profil: runder Schädel, flache fliehende Stirn, Überaugenwulst als Dach, flache Nase, lange
   gewölbte Oberlippe als vorderster Punkt, vorgeschobene Unterlippe, fliehendes Kinn, großes abstehendes Ohr. */
function schimpansenKopf(T, W, SCH, STR, licht) {
  let s = "";
  const profil = [[86.6, -98], [90, -94.6], [92.4, -92.2], [93.4, -90.6], [92.8, -89.4], [91.2, -88.8], [90.8, -87.4], [92.2, -85.8], [93.6, -84], [94, -82.6], [93.6, -81.6],
    [95, -80.4], [96.6, -78.6], [97.2, -77], [96.8, -76], [96.6, -75.4], [95.8, -74.4], [94.2, -73.6], [92.2, -73], [89, -72.6], [85.6, -72.8]];
  const kopf = [[74, -86], [74.6, -93], [78, -98.6], [83, -100.2]].concat(profil, [[81, -74], [77, -76.6], [74.6, -80]]);
  const gesicht = profil.concat([[83.6, -73.2], [81.6, -76], [81, -80], [81.6, -84.6], [82.6, -89], [83.4, -94], [84.4, -97.6]]);
  s += W.vol("ckf", 3, W.teil(kopf, T.lg("ckf", [[0, "#2a292c"], [0.6, "#151516"], [1, "#09090a"]]),
    W.musterFlaeche(kopf, W.haarMuster("chimp", 10, 7, 60, 4.4, [["#000", 0.13, 0.85], ["#121214", 0.12, 0.8], ["#26262a", 0.12, 0.7], ["#5a5a62", 0.1, 0.55]], 0.6)(150)) +
    W.haare(kopf, 110, (x, y) => (y < -95 ? 200 : x < 80 ? 120 : 104), 2, SCH, { licht: (x, y) => licht(x, y) + 0.1, buendel: 3, krumm: 0.35, szene: 0.08 }) +
    /* Gesicht weich ins Kopfhaar übergehen lassen (nur hinten/oben unscharf, Profilseite bleibt scharf) */
    (T.fein ? `<g mask="url(#${W.maskeForm("cg", [[87.4, -98.2], [94, -96], [101, -88], [101, -70], [85.4, -71.6], [83.6, -74], [82.6, -76.4], [82.2, -80], [82.8, -84.6], [83.8, -89], [84.6, -93.6], [85.6, -96.8]], 0.9)})">${schimpansenGesicht(T, W, gesicht, profil)}</g>` : schimpansenGesicht(T, W, gesicht, profil)) +
    (T.fein ? W.haare([[81.4, -98.2], [85, -98], [83.6, -90], [82.6, -82], [83.4, -76], [85.6, -73], [82, -73], [80.4, -80], [81, -90]], 50,
      (x, y) => (y < -90 ? 200 : 185), 1.4, [["#050505", 0.06, 0.6], ["#151516", 0.06, 0.55], ["#26262a", 0.05, 0.5]], { mix: 0.8 }) : ""),
  { rand: 0, vol: false, maske: W.maskeForm("ckf", [[71, -82], [74, -96], [84, -104], [100, -94], [100, -70], [84, -70], [78, -73], [74, -76]], 1.6) }) +
    W.saum([[74, -86], [74.6, -93], [78, -98.6], [83, -100.2], [86.6, -98], [88.6, -96]], 70, (x) => (x < 80 ? 160 : 205), 1.6, [["#000", 0.1, 0.75], ["#141416", 0.09, 0.7], ["#2e2e34", 0.08, 0.6]], { krumm: 0.4, ein: 0.4, szene: 0.2 }), { tiefe: 3, umgebung: 0.5 });
  s += W.L([G(profil, false)], "#1a1210", 0.2, 0.4);
  /* weißgraue Kinnhaare */
  if (T.fein) s += W.saum([[86, -73], [89, -72.6], [92, -73], [93.6, -73.6]], 22, (x) => 100 - (x - 89) * 4, 1.6, [["#8a8078", 0.06, 0.6], ["#d0c8bc", 0.06, 0.7], ["#f0ebe4", 0.05, 0.75]], { mix: 1, krumm: 0.6, ein: 0.3 });
  /* großes, abstehendes Ohr: Helixwulst mit Lichtkante, Y-förmige Anthelix, tiefe Muschel, Tragus, rötlicher Durchlicht-Saum;
     etwas nach hinten gekippt */
  const ohr = [[75.4, -91.6], [78.6, -92.4], [81, -90], [81.4, -85.6], [80.2, -81.4], [77.8, -79.4], [75.4, -80.2], [74, -83.6], [74, -88]];
  s += W.vol("cohr", 0.8, W.teil(ohr, T.lg("cohr", [[0, "#86705e"], [0.6, "#6a5646"], [1, "#46382e"]]),
    /* Muschel tief und dunkel, innerhalb des Helixwulstes */
    `<path d="${G([[75.8, -89.4], [78.4, -90], [79.6, -87.6], [79.4, -84.6], [77.6, -82.2], [76, -82.8], [75.4, -86]])}" fill="#3a2c24"/>` +
    W.weich([[77.4, -85.6, 1.2, 2, 0, "#140c08", 0.75], [76.4, -90.6, 2.6, 0.7, -10, "#c8a894", 0.55]], 0.35) +
    /* Helixwulst: Lichtkante oben, Schatten nach innen; Anthelix Y-förmig */
    W.falten(["M75.2 -90.4q2.6 -1.6 4.8 -.2q1.6 1.6 1 4.6q-.4 2.2 -1.4 3.6", "M77.2 -88.4q1.4 .2 1.6 1.8q.2 1.4 -.6 2.8", "M77.6 -86.4q-.8 -.6 -1.6 -.4"], 0.22, "#1a120c", "#d8b8a0", 0.75, 0.6) +
    /* Tragus am Vorderrand der Muschel */
    `<path d="M80.4 -85.6q.9 .4 .8 1.6q-.4 .8 -1 .5q.3 -1 .2 -2.1z" fill="#5a463a"/>`,
  { rand: 0.3, rc: "#1a120c" }) + W.L([G([[74.4, -88], [75.6, -91.4], [78.6, -92.2], [81, -90], [81.4, -85.6], [80.2, -81.4]], false)], "#b8806a", 0.25, 0.55), { tiefe: 2, umgebung: 0.5 });
  s += W.kantenStraehnen([[74, -88], [74, -83.6], [75.4, -80.2]], 8, 190, 0.8, 1.6, 0.3, () => STR[2], { szene: 0 });
  return s;
}

/* Gesicht: Augenpartie dunkel, Schnauze heller, Lippen grau mit Rosa, Sommersprossen; Falten als Rinne + Lichtkante;
   Überaugenwulst als Dach mit Schatten auf dem Oberlid; flache Nase; lange Oberlippe mit senkrechten Fältchen. */
function schimpansenGesicht(T, W, gesicht, profil) {
  let s = `<path d="${G(gesicht)}" fill="${T.lg("csg", [[0, "#4a3c34"], [0.3, "#382c26"], [0.55, "#6c584a"], [0.8, "#8a7464"], [1, "#665446"]], 0, -98, 0, -72, UB)}"/>`;
  s += W.weich([
    [88.6, -92, 4.4, 1.2, 24, "#9a8676", 0.75], [87.6, -89.6, 3.6, 1.4, 6, "#0e0806", 0.85], [93.4, -78.6, 3, 2.4, 0, "#a08a78", 0.5], [94.2, -75.4, 1.8, 0.7, 0, "#8a6a66", 0.6],
    [85, -80, 3, 5, 0, "#2a1e18", 0.35], [88, -74, 4, 1.2, 0, "#2a1e18", 0.4],
  ], 0.6);
  /* Sommersprossen / fleckige Pigmentierung */
  if (T.fein) {
    let d = "";
    for (const [x, y, r] of [[86.6, -84.6, 0.22], [88.2, -83.2, 0.16], [85.4, -82.4, 0.2], [89.4, -86.2, 0.15], [87.2, -81, 0.2], [90.6, -84.4, 0.14], [84.6, -85.8, 0.16], [91.6, -80, 0.15], [88.8, -79.4, 0.18], [86, -79, 0.14], [90, -82, 0.12]])
      d += `M${f1(x - r)} ${f1(y)}a${f1(r)} ${f1(r * 0.8)} 0 1 0 ${f1(2 * r)} 0a${f1(r)} ${f1(r * 0.8)} 0 1 0 ${f1(-2 * r)} 0`;
    s += W.weich([`<path d="${d}" fill="#24180f" opacity=".45"/>`], 0.08);
  }
  /* Falten unregelmäßig als Rinne + Lichtkante; Tränensäcke als weiche Wülste */
  s += W.weich([[87.4, -86.2, 2.2, 0.5, 6, "#8a7464", 0.55], [87.4, -85.6, 2.4, 0.45, 6, "#1a120c", 0.45]], 0.3);
  s += W.falten([
    "M84.6 -95q1.8 -.7 3.4 -.4", "M88.8 -95q.8 0 1.4 .3", "M85.4 -93.4q2 -.5 3.6 .2", "M85.4 -84.8q1.4 .8 3 .2", "M91.4 -84.4q-1.2 2 -.9 4", "M89.6 -84.4q-1.6 2.6 -1 5.2", "M88.4 -78.6q-.2 1.6 .4 3",
    "M92.4 -73.6q-2 -.4 -3.6 .2",
  ], 0.13, "#1a120c", "#c4ae9c", 0.7, 0.35);
  /* Oberlippe: 4 senkrechte, gewölbte Hautfalten als Hell-Dunkel-Paare */
  s += W.falten(["M93.4 -80q.4 1.4 .1 2.8", "M94.6 -80.2q.4 1.5 .1 3", "M95.8 -79.8q.3 1.4 0 2.8", "M92.2 -79.6q.4 1.2 .2 2.4"], 0.12, "#2a1e18", "#d0baa8", 0.75, 0.55);
  /* Nase: flach in der Profillinie, kleiner schräger Nasenschlitz */
  s += W.L(["M92 -84.2q.7 .9 .6 1.9"], "#2a1e18", 0.18, 0.55) + `<path d="M92.4 -82.6q.9 -.3 1.1 .5q-.6 .4 -1.2 .1z" fill="#0a0605" opacity=".85"/>`;
  /* Mund: lange Spalte bis unter die Augenmitte, Unterlippe vorgeschoben; Lippen grau-rosa */
  s += W.L(["M96.6 -75.8q-2.8 .3 -5.6 .2q-2.4 .2 -4 .8"], "#1a100c", 0.24, 0.85) + W.L(["M96.4 -76.6q-2.6 .2 -5 .1"], "#c4a294", 0.12, 0.45) + W.L(["M95.6 -74.8q-2.2 .2 -4.2 0"], "#9a7a72", 0.14, 0.45);
  /* Auge: braun, Höhle, Oberlid deckt ~25 %, Tränensäcke; Wulst wirft Schatten */
  s += W.auge2(87.8, -88.4, 1.1, { iris: "#4a2a14", iris2: "#2a160a", sklera: "#3a2a20", offen: 0.82, winkel: 6, lidDeck: 0.27, lid: "#3a2e28", lidHell: "#5a4a40",
    glanz: 0.5, karunkel: "#6a585a", hoehle: "#140c08", wimpern: 3, wimpernLaenge: 0.3 });
  s += W.weich([[87.8, -89.8, 2.6, 0.9, 6, "#0a0605", 0.7]], 0.35);
  return s;
}

/* =====================================================================
   ORANG-UTAN (Borneo-Orang-Utan, erwachsenes Männchen mit Backenwülsten, Faustgang am Boden)
   RECHERCHE (San Diego Zoo, Smithsonian National Zoo, Brookfield Zoo, SOS, Primate Info Net, Plazi): Männchen 50–100 kg,
   Kopf-Rumpf ~0,95 m, Arme sehr lang (Spannweite bis 2,2 m), Beine kurz und stark gebeugt; am Boden Faustgang (Hand zur
   Faust, Rücken der Grundglieder am Boden, Handgelenk gestreckt) oder Handflächengang; Füße handähnlich, lange
   eingerollte Zehen, winzige Großzehe, Auftritt auf der Außenkante. Geflanschte Männchen: zwei halbmondförmige, fettreiche
   Backenwülste seitlich am Gesicht (Schläfe bis Mundwinkel), beim Borneo-Orang groß und nach vorn gewölbt, mit kurzem
   Borstenhaar; Scheitel mit rötlichem, aufgestelltem Haar; hohe Stirn; kleine, eng stehende braune Augen mit dicken
   Oberlidern; flache Nase mit zwei ovalen Nasenlöchern; breite, stark vorgewölbte Schnauze mit hoher Oberlippe und dicker
   Unterlippe; großer behaarter Kehlsack („Doppelkinn“), kurzer Bart. Fell lang (an den Armen bis 50 cm), schütter,
   rostrot bis kastanienbraun; dunkelgraue Haut scheint durch.
   ===================================================================== */
function orangUtan(T) {
  const W = werk(T);
  W.dichte = T.fein ? 0.28 : 0.75;
  W.saumDichte = T.fein ? 0.38 : 1;
  const OR = [["#2a0e04", 0.12, 0.6], ["#4e1e0a", 0.12, 0.6], ["#743012", 0.12, 0.55], ["#9a461c", 0.11, 0.55], ["#c0642c", 0.11, 0.6], ["#e08a4a", 0.1, 0.6]];
  const HAUT = { n: "o", c: ["#2e2826", "#383230", "#433b38"], cf: ["#1e1a19", "#24201e", "#2a2523"], l: "#9a8a80", lf: "#4e4440",
    g: [[0, "#564a46"], [0.55, "#3b3534"], [1, "#1c1817"]], gf: [[0, "#342e2c"], [0.6, "#221e1d"], [1, "#100e0d"]], na: "#7a6c64", nf: "#3a3230", sohle: "#4a403c", polster: "#4a4240" };
  /* EIN Licht oben links: 0 = Kernschatten … 1 = Licht */
  const licht = (x, y) => clamp(0.2 + (-y - 30) / 80 - (x - 40) / 350);
  /* Grund = dunkelgraue Haut (#3b3534); in der Szene (ohne Haarmuster) rotbraun */
  const grund = (n, hell) => T.fein ? T.lg("oh" + n, [[0, hell ? "#4e4440" : "#3e3634"], [0.55, "#2e2826"], [1, "#161211"]]) :
    T.lg("os" + n, [[0, hell ? "#8a3c18" : "#5e2810"], [0.6, "#4a1e0c"], [1, "#240e06"]]);
  /* langes, schütteres, gewelltes Haar als Kachelmuster (Haut scheint durch); oben im Licht ein helleres Muster darüber */
  const OM = W.haarMuster("or", 12, 9, 64, 7, [["#3a1406", 0.13, 0.85], ["#5e240c", 0.13, 0.8], ["#7e3414", 0.12, 0.75], ["#a04a1e", 0.12, 0.7]], 0.7);
  const OH = W.haarMuster("orh", 12, 9, 34, 6, [["#b45a26", 0.11, 0.7], ["#d47a3c", 0.1, 0.7], ["#ec9a5a", 0.09, 0.65]], 0.6);
  const vorhang = (pts, n, w, L, o = {}) => W.haare(pts, n, w, L, OR, Object.assign({ licht: (x, y) => clamp(licht(x, y) * 0.9 + (o.hell || 0)), buendel: 3, krumm: 0.55, streu: 12, szene: 0.1 }, o));
  /* hängende Haarvorhänge über eine Kante (lang, gewellt) */
  const behang = (kante, n, w, L, hell = 0.4, o = {}) => W.saum(kante, n, w, L, OR.slice(0, 5), Object.assign({ licht: () => hell, krumm: 0.6, ein: 0.22, szene: 0.1 }, o));
  let s = "";

  /* ---------- ferne Glieder: ~30 % dunkler, schmaler ---------- */
  s += orangFuss(W, T, -9, true, HAUT);
  const beinF = [[8, -50], [18, -50], [26, -42], [30, -32], [28.6, -24], [22, -16], [18, -9.6], [9, -9], [8, -14], [12, -20], [7, -28], [3, -38]];
  s += W.vol("v", 2.6, W.teil(beinF, grund("bf"), W.musterFlaeche(beinF, OM(112), 0.7), { rand: 0 }) +
    behang([[3, -38], [7, -28], [12, -20], [8, -14], [9, -9.4]], 26, 98, 6, 0.25), { tiefe: 3, umgebung: 0.5 });
  s += orangHand(W, T, 110, true, HAUT);
  const armF = [[92, -100], [102, -100], [106, -86], [108, -72], [110, -60], [112, -46], [113.4, -34], [113.6, -16.4], [106.6, -16.4], [105.6, -34], [103.6, -46], [100.6, -58], [97, -72], [93, -86]];
  s += W.vol("v", 2.8, W.teil(armF, grund("af"), W.musterFlaeche(armF, OM(96), 0.75) + vorhang(armF, 26, 96, 6, { hell: -0.25 }), { rand: 0 }) +
    behang([[93, -86], [97, -72], [100.6, -58], [103.6, -46], [105.6, -34], [106.6, -19]], 36, 97, 12, 0.3, { laenge: (x, y) => 0.5 + clamp((-y - 26) / 40) * 0.8 }) +
    behang([[113.6, -19], [110, -18], [106.6, -18.4]], 20, 94, 6, 0.35), { tiefe: 3, umgebung: 0.5 });

  /* ---------- Rumpf: Schulterhöcker mit Schulterblatt, Rücken hängt leicht durch, Becken hinten rund; Grund dunkelgraue
     Haut, Haar als schütterer Vorhang; an Brust, Bauch und Flanke scheint die Haut breit durch ---------- */
  /* Bauchkante haarig (Büschel statt glatter Linie) */
  const zott = (pts, L, w) => T.fein ? W.zotteln(pts, 3.2, L, w) : pts;
  const rumpf = [[2, -40], [3, -48], [8, -56], [20, -64], [34, -70], [48, -75], [60, -82], [70, -92], [78, -102], [86, -107], [94, -106], [100, -100], [103, -88], [102, -76], [96, -62]].concat(
    zott([[86, -52], [72, -44], [56, -40], [40, -38], [26, -38], [14, -39]], 4, 98));
  const oben = [[3, -50], [8, -57], [20, -65], [34, -71], [48, -76], [60, -83], [70, -93], [78, -103], [86, -108], [94, -107], [96, -98], [86, -92], [72, -82], [56, -72], [40, -64], [24, -56], [10, -48]];
  const haut = [[100, -84], [98, -68], [88, -54], [72, -45.4], [56, -41], [40, -39], [26, -39.4], [34, -46], [52, -50], [70, -56], [86, -66], [94, -76]];
  let rs = W.teil(rumpf, grund("rf", 1),
    W.musterFlaeche(rumpf, OM(118)) + W.musterFlaeche(oben, OM(152)) +
    /* Haut scheint durch: Brust, Bauch, Flanke */
    W.weich([`<path d="${G(haut)}" fill="#3b3534" opacity=".72"/>`, [62, -42, 26, 3, 4, "#0e0a09", 0.55]], 2.6) +
    W.musterFlaeche(haut, OM(96), 0.45) +
    (T.fein ? `<g mask="url(#${W.maskeForm("orl", oben, 2.2)})">${W.musterFlaeche(oben, OH(150), 0.85)}</g>` : "") +
    /* Schulterblatt und Schulterhöcker: Licht oben, Kernschatten dahinter; Schatten der Haarvorhänge auf der Flanke */
    W.weich([[82, -98, 9, 4.4, -35, "#e0904c", 0.32], [70, -86, 3, 9, 35, "#0e0a09", 0.38], [40, -68, 16, 3, -18, "#d08040", 0.22], [76, -60, 3, 12, 15, "#0e0a09", 0.35], [48, -50, 2.4, 9, 10, "#0e0a09", 0.3]], 2.2) +
    vorhang(rumpf, 110, (x, y) => (y > -52 ? 94 : x > 74 ? 116 : 150 - clamp((-y - 52) / 40) * 20), 7, {})
  , { rand: 0 });
  rs += W.saum([[3, -48], [8, -56], [20, -64], [34, -70], [48, -75], [60, -82], [70, -92], [78, -102], [86, -107]], 64, (x) => (x < 6 ? 110 : 168), 4.6, OR, { licht: (x) => clamp(0.95 - x / 220), krumm: 0.6, szene: 0.1 });
  rs += behang([[96, -62], [86, -52], [72, -44], [56, -40], [40, -38], [26, -38]], 80, 93, 13, 0.35, { laenge: (x) => 0.45 + clamp((x - 26) / 40) * 0.75 });
  s += W.vol("v", 8, rs, { tiefe: 3, umgebung: 0.5 });

  /* ---------- nahes Hinterbein: kurz, stark gebeugt – Oberschenkel schräg nach vorn, Knie als Ecke, Unterschenkel zurück ---------- */
  s += orangFuss(W, T, 0, false, HAUT);
  const beinN = [[6, -52], [18, -55], [28, -48], [35, -38], [38.6, -29], [38.4, -24.6], [35, -20.4], [29, -15], [25.4, -9.6], [16.4, -8.8], [14.4, -12.6], [18, -19], [21.6, -25.6], [14, -30],
    [6, -36], [3, -44]];
  s += W.vol("v", 3.2, W.teil(beinN, grund("bn", 1),
    W.musterFlaeche(beinN, OM(124)) +
    W.weich([[33, -40, 4, 7, -40, "#e0904c", 0.22], [36.6, -26, 1.6, 2.2, 0, "#b08068", 0.35], [18, -27.6, 5, 1.2, 25, "#0e0a09", 0.65], [10, -34, 4, 8, 20, "#0e0a09", 0.4], [28, -16, 2, 5, 40, "#0e0a09", 0.3]], 1.4) +
    W.L(["M21.6 -25.8q-3.6 -2.2 -7.4 -4"], "#0e0a09", 0.3, 0.55) +
    vorhang(beinN, 80, (x, y) => (y < -27 ? 128 : 104), 5.5, {}),
  { rand: 0, maske: W.maske("obn", [-6, -58, 44, -4], 0, -48, 0, -38) }) +
    behang([[3, -44], [6, -36], [14, -30], [21.6, -25.6], [18, -19], [14.4, -12.6], [16.4, -9]], 44, 100, 7, 0.4) +
    behang([[38.6, -29], [38.4, -24.6], [35, -20.4], [29, -15], [25.4, -10]], 18, 110, 3, 0.55), { tiefe: 3, umgebung: 0.5 });

  /* ---------- Brust und Hals unter dem Kopf (Haut, wenig Haar); der Kehlsack liegt darauf ---------- */
  const brust = [[90, -102], [100, -100], [110, -92], [118, -78]].concat(zott([[121, -62], [118, -48], [108, -43], [97, -44], [90, -52]], 4.6, 94), [[88, -70]]);
  s += W.vol("v", 4, W.teil(brust, grund("br"),
    W.weich([[108, -66, 10, 12, 0, "#3b3534", 0.7], [108, -46, 10, 2.6, 0, "#0a0807", 0.55], [94, -80, 4, 14, 0, "#0e0a09", 0.4]], 2.4) +
    W.musterFlaeche(brust, OM(94), 0.55) + vorhang(brust, 20, 93, 6, { hell: -0.1 }), { rand: 0 }) +
    behang([[121, -60], [118, -48], [108, -43], [97, -44], [90, -52]], 70, 92, 10, 0.4, { ein: 0.35 }), { tiefe: 3, umgebung: 0.5 });

  /* ---------- naher Arm: sehr lang (Schulter hoch), Ellbogen leicht nach außen gedreht, Unterarm dünn unter dem
     Haarvorhang; Faust am Boden ---------- */
  s += orangHand(W, T, 87, false, HAUT);
  const armN = [[68, -90], [76, -99], [86, -102], [92, -96], [93, -84], [91.4, -72], [90, -62], [90.6, -52], [91.4, -40], [91, -30], [90.4, -16.4], [83.8, -16.4], [82.4, -30], [81, -40], [79.4, -50],
    [77, -56], [76.4, -62], [73.6, -72], [70, -82], [67, -90]];
  s += W.vol("v", 3, W.teil(armN, grund("an", 1),
    W.musterFlaeche(armN, OM(100)) +
    (T.fein ? `<g mask="url(#${W.maskeForm("oal", [[70, -98], [78, -106], [88, -106], [90, -94], [84, -84], [74, -82]], 2)})">${W.musterFlaeche(armN, OH(110), 0.8)}</g>` : "") +
    W.weich([[80, -98, 8, 4, -15, "#e0904c", 0.28], [72, -78, 2.6, 10, 15, "#0e0a09", 0.45], [77.6, -56.6, 1.8, 1.6, 0, "#9a8478", 0.5], [89.6, -44, 1.4, 10, 0, "#c07a40", 0.22], [83, -40, 2, 9, 0, "#0e0a09", 0.35]], 1.4) +
    vorhang(armN, 70, (x, y) => (y < -64 ? (x < 76 ? 110 : 100) : 95), 7, { hell: 0.05 }),
  { rand: 0, maske: W.maske("oan", [50, -110, 96, -10], 0, -96, 0, -82) }) +
    behang([[67, -90], [70, -82], [73.6, -72], [76.4, -62], [77, -56], [79.4, -50], [81, -40], [82.4, -30], [83.8, -19]], 115, (x, y) => 95 + (y < -60 ? 5 : 0), 15, 0.5,
      { licht: (x, y) => clamp(0.6 + (-y - 50) / 110), laenge: (x, y) => 0.45 + clamp((-y - 24) / 46) * 0.8 }) +
    /* langes Unterarmhaar fällt über das Handgelenk */
    behang([[91.4, -28], [90.6, -19], [86.6, -18], [83, -18.4]], 44, 96, 6.5, 0.55, { ein: 0.3 }), { tiefe: 3, umgebung: 0.5 });

  /* ---------- Kopf (¾ zum Betrachter, ≈ 40°) ---------- */
  s += orangKopf(T, W, OR, OM);
  /* Schulterhaar überlappt den Hinterkopf (Außenrand des nahen Wulstes) */
  s += W.saum([[84, -106], [87, -100], [88, -92], [88.4, -84]], 36, (x, y) => 100 - (y + 100) * 0.6, 5, OR.slice(1), { licht: (x, y) => clamp(0.75 + (y + 100) / 40), krumm: 0.6, ein: 0.5, szene: 0.1 });
  return W.fertig(s, 1, [84, -118, 130, -42], [10, 30, 84, 112]);
}

/* Faustgang-Hand (Seitenansicht): Handgelenk gestreckt, Mittelhand lang, schmal und senkrecht; die Finger sind zur Faust
   eingeschlagen: die Rücken der Grundglieder liegen flach am Boden (vom Grundgelenk vorn nach hinten), die Mittelglieder
   steigen hinten als gewölbte Walzen auf, die Nägel liegen eingeschlagen an der Handfläche. Daumen kurz, seitlich anliegend. */
function orangHand(W, T, wx, fern, pal) {
  const C = fern ? pal.cf : pal.c, LI = fern ? pal.lf : pal.l;
  const P = (x, y) => [wx + x, y];
  const faust = [P(-6.8, -11.4), P(5, -11.4), P(6.4, -7), P(6.2, -2), P(4.8, 0, 1), P(-6.6, 0, 1), P(-7.9, -2), P(-7.9, -7.4)];
  const mh = [P(-3.2, -17), P(3.2, -17), P(5, -11), P(-6.6, -10.6), P(-4.8, -13.6)];
  if (!T.fein) return `<path d="${G([P(-3.2, -17), P(3.2, -17)].concat(faust.slice(1), [P(-4.8, -13.6)]))}" fill="${C[1]}"/>`;
  let s = "";
  /* Mittelhand: zum Grundgelenk hin breiter, spärliche rote Haare, Querfalten am Handgelenk */
  s += W.teil(mh, T.lg("omh" + (fern ? "f" : ""), fern ? pal.gf : pal.g, 0, 0, 1, 0.3),
    W.weich([[wx - 1, -13.6, 2.4, 2.6, 0, LI, fern ? 0.15 : 0.3], [wx + 4.4, -12.4, 1, 3, 0, "#000", 0.5]], 0.8) +
    W.falten([`M${f1(wx - 2.6)} -15.6q2.2 -.6 4.8 0`], 0.1, "#000", LI, 0.55, 0.22) +
    (fern ? "" : W.haare(mh, 24, 96, 1.6, [["#5e240c", 0.06, 0.7], ["#9a461c", 0.06, 0.6]], { mix: 1, szene: 0 })), { rand: 0.45, vol: false });
  /* Faust: die vier Mittelglieder zeigen zum Betrachter als gewölbte, senkrechte Walzen (Licht links, dunkle Fugen),
     Nägel oben an der Handfläche eingeschlagen, Gelenkfalten; Grundglieder am Boden (Kontaktschatten) */
  let f = "";
  [[-5.4, -8.2, C[2]], [-2.8, -8.8, C[2]], [-0.2, -8.6, C[1]], [2.4, -7.8, C[0]]].forEach(([x, top, c], i) => {
    const zug = [P(x, top + 1.3), P(x + 0.15, -1.5)];
    f += W.glied(zug, 2.75, "#1a1412", "") + W.glied(zug, 2.5, c, fern ? "" : LI, { la: 0.3 - i * 0.05 }) +
      `<ellipse cx="${f1(wx + x)}" cy="${f1(top + 1.1)}" rx=".75" ry=".5" fill="${fern ? pal.nf : pal.na}"/>`;
  });
  s += W.teil(faust, T.lg("ofa" + (fern ? "f" : ""), fern ? pal.gf : pal.g, 0, 0, 0.5, 1),
    W.weich([[wx - 1, -9.6, 7, 1.4, 0, "#000", 0.6]], 0.5) + f +
    (fern ? "" : W.falten([-5.4, -2.8, -0.2, 2.4].map((x) => `M${f1(wx + x - 0.8)} -4.6q.8 .5 1.6 0M${f1(wx + x - 0.7)} -3.8q.7 .4 1.4 0`), 0.08, "#000", LI, 0.6, 0.3)) +
    W.weich([[wx - 0.6, -0.4, 7, 0.7, 0, "#000", 0.6]], 0.4),
  { rand: 0.5, vol: false });
  /* Daumen: kurz (≈ ¼ der Fingerlänge), schräg über dem Zeigefinger anliegend, kleiner Nagel */
  s += W.glied([P(-7.6, -11.4), P(-6, -10.2), P(-3.8, -9.6)], 2.75, "#1a1412", "") + W.glied([P(-7.6, -11.4), P(-6, -10.2), P(-3.8, -9.6)], 2.4, C[1], fern ? "" : LI, { la: 0.3 }) +
    `<ellipse cx="${f1(wx - 3.5)}" cy="-9.7" rx=".6" ry=".45" fill="${fern ? pal.nf : pal.na}"/>`;
  return s;
}

/* Fuß: handähnlich, ruht auf der Außenkante; nackte, dunkelgraue, faltige Sohle mit Ballen halb sichtbar; vier lange,
   eingerollte Zehen mit kleinen Nägeln vorn; winzige Großzehe (≈ 20 % der Zehenlänge) ohne Nagel. */
function orangFuss(W, T, dx, fern, pal) {
  const P = (x, y) => [x + dx, y];
  const C = fern ? pal.cf : pal.c, LI = fern ? pal.lf : pal.l;
  if (!T.fein || fern) return `<path d="${G([P(16, -12), P(13.4, -6), P(14.6, -1), P(19, 0, 1), P(35, 0, 1), P(35.6, -3), P(30, -7.6), P(24, -10.6)])}" fill="${fern && T.fein ? T.lg("ofuf", pal.gf) : C[1]}"/>` +
    (T.fein ? W.L([`M${f1(dx + 28)} -6.6q4.6 .4 5.4 4.6`, `M${f1(dx + 29.4)} -4.6q3.4 .6 3.6 3.6`, `M${f1(dx + 19)} -1.6q5 .8 10 0`], "#000", 0.16, 0.6) : "");
  let s = "";
  const fuss = [P(16, -12.4), P(13.6, -8.4), P(13.4, -3.4), P(15.6, -0.4), P(20, 0, 1), P(27, 0, 1), P(30.6, -1.6), P(31.4, -5), P(28.4, -8.6), P(23, -11.4)];
  s += W.teil(fuss, T.lg("ofu" + (fern ? "f" : ""), fern ? pal.gf : pal.g),
    /* Sohle: nackt, dunkelgrau, faltig, mit Ballen */
    `<path d="${G([P(14.2, -4.4), P(17, -1.6), P(23, -0.9), P(29.6, -1.8), P(30.4, -4.2), P(25, -4.4), P(19, -5.6)])}" fill="${fern ? "#221e1d" : pal.sohle}"/>` +
    W.weich([[dx + 26.6, -2.8, 2.6, 1.2, 0, LI, fern ? 0.1 : 0.35], [dx + 17.4, -2.8, 2, 1.1, 0, LI, fern ? 0.08 : 0.3], [dx + 22.6, -8, 5, 2, -25, LI, fern ? 0.1 : 0.25]], 0.5) +
    W.falten(["M16.6 -4.2q1.6 .8 2 2.2", "M19.6 -4.6q1 1 1 2.4", "M22.4 -4.4q.6 .9 .5 2.2", "M24.8 -4.2q.8.8.4 2", "M18 -2.4q3 .6 6 .2", "M21 -9.6q2.4 .4 4 2"].map((d) => d.replace(/^M([\d.]+)/, (m, x) => "M" + f1(+x + dx))), 0.09, "#000", LI, 0.6, 0.25),
  { rand: 0.5, vol: false });
  /* vier lange, eingerollte Zehen (Spitzen unten, kleine Nägel vorn) */
  [[26.6, -8.2, 2], [28, -6.6, 2], [29.2, -5, 1.9], [30, -3.4, 1.8]].forEach(([bx, by, b], i) => {
    const ex = bx + 4.6 + i * 0.3, ey = -0.95;
    s += W.glied([P(bx, by), P(bx + 3.4, by + 0.4), P(ex + 0.6, (by + ey) / 2 - 0.2), P(ex - 0.2, ey)], b, fern ? C[i % 3] : [C[0], C[1], C[2], C[2]][i], fern ? "" : LI, { la: 0.25 }) +
      (fern ? "" : W.falten([`M${f1(bx + 3.2 + dx)} ${f1(by - 0.6)}q.7 .5 .7 1.4`], 0.08, "#000", LI, 0.5, 0.2)) +
      `<ellipse cx="${f1(ex + 0.5 + dx)}" cy="${f1(ey - 0.5)}" rx=".42" ry=".55" transform="rotate(20 ${f1(ex + 0.5 + dx)} ${f1(ey - 0.5)})" fill="${fern ? pal.nf : pal.na}"/>`;
  });
  /* winzige Großzehe innen am Fußrand, ohne Nagel */
  s += W.glied([P(17.2, -6.4), P(18.4, -5.2)], 1.3, C[0], "");
  return s;
}

/* Kopf (¾ zum Betrachter, ≈ 40°): naher Backenwulst breit (links), ferner schmal und halb hinter der Schnauze; Wülste
   schließen nahtlos ans Gesicht an (Rinne mit Kernschatten); kurzes, aufgestelltes rotes Scheitelhaar; eng stehende Augen
   mit dicken, helleren Oberlidern und Tränensack-Falten unter der Stirnkante; flacher, breiter Nasensteg mit zwei schrägen
   ovalen Nasenlöchern; breite, vorgewölbte Schnauze nach rechts verschoben, dicke Unterlippe; Kehlsack geht breit in
   Hals und Brust über (keine freie Unterkante), Bart hängt darüber. */
function orangKopf(T, W, OR, OM) {
  let s = "";
  W.box([[100, -114], [126, -60]]);
  /* Kehlsack: weicher, behaarter Beutel; unten weich in die Brust ausgeblendet; Kontaktschatten liegt auf der Brust */
  const sack = [[95, -70], [99, -63], [106, -60.4], [114, -60], [118.6, -61], [120.6, -58], [120.8, -54], [119, -50], [112, -46.4], [102, -47], [96, -51], [93.6, -58]];
  s += W.vol("v", 4, W.teil(sack, T.rg("osack", [[0, "#5a4e48"], [0.6, "#3e3634"], [1, "#2a2422"]], 0.45, 0.3, 0.7),
    W.weich([[110, -61, 13, 2.6, 0, "#0e0a09", 0.7], [96, -61, 5, 3, 20, "#0e0a09", 0.5], [106, -54, 6, 4, -20, "#8a7a70", 0.35]], 1.4) +
    W.musterFlaeche(sack, OM(92), 0.6) +
    W.haare(sack, 30, 92, 3, OR.slice(1, 5), { buendel: 2, krumm: 0.6, szene: 0.05 }),
  { rand: 0, maske: W.maskeForm("osk", [[93, -74], [128, -74], [128, -50], [119, -50], [106, -50.4], [97, -53.6]], 2) }), { tiefe: 2, umgebung: 0.55 });
  /* ferner Wulst (rechts, schmal, im Halbschatten; teils hinter der Schnauze) – vor dem Gesicht gezeichnet */
  const wulstF = [[117, -104], [120.8, -101.6], [123, -95], [124, -87], [123.8, -80], [122.8, -76], [121, -80], [120, -90], [119, -98]];
  s += W.vol("v", 2, W.teil(wulstF, T.lg("owf", [[0, "#40302a"], [0.5, "#30241f"], [1, "#1c1412"]], 0, 0, 0.6, 1),
    W.weich([[124.4, -92, 0.8, 4, 0, "#8a6a5a", 0.35], [121, -88, 1.2, 8, 0, "#0e0a09", 0.55]], 0.9) +
    W.fell("owf", 100, T.box(wulstF), { hell: "#8a4a26", dunkel: "#140a06", ho: 0.4, do: 0.4, fx: 4, fy: 1.2, hk: "ow", licht: false }), { rand: 0 }) +
    W.saum([[120.8, -101.6], [123, -95], [124, -87], [123.8, -80]], 26, 10, 1.2, [["#3a1608", 0.07, 0.6], ["#6a2c12", 0.07, 0.55]], { mix: 1, gerade: true, ein: 0.5, szene: 0.05 }), { tiefe: 2, umgebung: 0.55 });
  /* Gesicht: hohe Stirn, Schnauze nach rechts verschoben und vorgewölbt */
  const ges = [[102.6, -104], [104.6, -109.4], [109, -112], [114, -111.4], [118, -108.4], [120.4, -102], [121, -92], [121.4, -84], [123.6, -79], [125.4, -74], [125, -68.6], [121.6, -64.4], [115, -62.4], [108, -63.2], [103.4, -66.4],
    [101.4, -72], [101.2, -80], [101.4, -90], [101.6, -99]];
  let g = `<path d="${G(ges)}" fill="${T.lg("oge", [[0, "#4e403a"], [0.35, "#3e322e"], [0.62, "#5a4a44"], [1, "#2e2420"]], 0, -108, 0, -62, UB)}"/>`;
  g += W.weich([
    /* Stirnkante hell, Schatten darunter über den Augen; Schnauze als Kugelfläche (Licht oben links, Seiten dunkel) */
    [111.4, -99.6, 7, 3, 0, "#7a6a60", 0.45], [112, -94.6, 7.6, 1.4, 0, "#8a7a70", 0.5], [112, -91.4, 8.6, 1.5, 0, "#0e0a09", 0.65],
    [115, -75.6, 7, 3.8, 0, "#7a6a60", 0.6], [114, -79.4, 4.6, 1.2, 0, "#9a8a7e", 0.5], [107, -73, 2.4, 6, 0, "#0e0a09", 0.45], [123.4, -72.6, 1.4, 4.6, 0, "#0e0a09", 0.4],
    /* Rinne zum nahen Wulst (Kernschatten) */
    [103.2, -84, 1.6, 15, 0, "#0e0a09", 0.65],
  ], 0.8);
  g += W.falten(["M105.6 -102.4q5 -1.4 10.6 0", "M105 -100q5.4 -1.2 11 .3", "M106.4 -97.6q4 -.7 8.6 .3",
    /* Tränensack-Falten unter beiden Augen */
    "M105.2 -86.6q2.2 1.3 4.6 .4", "M105.6 -85.2q2 1.1 4 .3", "M106.4 -83.8q1.6.8 3 .1", "M113.6 -86.6q1.8 1.1 3.6 .3", "M114 -85.2q1.6.9 3 .2",
    /* Nasolabialfalten und Oberlippe */
    "M109 -80q-1.6 2.8 -.8 6", "M118.4 -80q1.6 2.6 .8 5.6", "M111.4 -77.4l-.2 2", "M112.8 -77.6v2.1", "M114.2 -77.6l.1 2.1", "M115.6 -77.4l.2 2", "M117 -77.2l.3 1.8"],
    0.12, "#1a1210", "#b4a296", 0.7, 0.4);
  /* Augen: eng, braun; dicke, hellere Oberlider; das ferne Auge verkürzt */
  const aug = { iris: "#3a1e0c", iris2: "#160a04", sklera: "#2e221c", offen: 0.78, lidDeck: 0.32, lid: "#6a5a52", lidHell: "#b4a296", glanz: 0.5, karunkel: "#6a5458", hoehle: "#140e0c", wimpern: 3, wimpernLaenge: 0.25 };
  g += W.auge2(108, -89.4, 1.45, Object.assign({ winkel: 3 }, aug));
  g += `<g transform="translate(116 -89.4) scale(.8 1) translate(-116 89.4)">` + W.auge2(116, -89.4, 1.35, Object.assign({ winkel: -4 }, aug)) + `</g>`;
  /* Scheitel: kurzes, aufgestelltes, rotes Haar auf der Kopfoberseite, unten weich in die Stirnhaut auslaufend */
  const scheitel = [[102.6, -104], [104.6, -109.4], [109, -112], [114, -111.4], [118, -108.4], [120.4, -102], [121, -99], [116, -100.4], [110, -101], [104, -100.4], [102, -99]];
  if (T.fein) g += `<g mask="url(#${W.maskeForm("osch", [[100, -118], [124, -118], [123, -102], [116, -103], [110, -103.6], [104, -103], [100, -102]], 1)})"><path d="${G(scheitel)}" fill="#4a2010"/>${W.musterFlaeche(scheitel, OM(262))}${W.musterFlaeche(scheitel, OM(240), 0.7)}</g>`;
  let nm = "";
  /* Nase: flacher, breiter Steg mit Lichtkante; zwei schräge, ovale Nasenlöcher mit hellem Rand */
  nm += W.weich([[112.6, -85.4, 1.3, 3.4, 0, "#7a6a60", 0.5], [113, -82.4, 2.6, 1, 0, "#8a7a70", 0.45]], 0.35) +
    W.falten(["M111.6 -88q-.4 3 .2 5.4", "M114.2 -88q.4 3 -.1 5.4"], 0.08, "#1a1210", "#a08e84", 0.45, 0.3) +
    `<path d="M111 -81.4a.55 .3 -35 1 0 1 -.4a.55 .3 -35 1 0 -1 .4zM114.2 -81.6a.55 .3 30 1 0 1 .5a.55 .3 30 1 0 -1 -.5z" fill="#0a0605"/>` +
    W.L(["M110.8 -82.2q.6 -.6 1.4 -.4", "M114.6 -82.4q.7 -.2 1.3 .4"], "#a08e84", 0.12, 0.55);
  /* Mund und dicke, wulstige Unterlippe (Licht oben, Schatten darunter) */
  nm += W.L(["M107 -70.4q4 -.8 8 -.6q4 .2 7.6 1.2"], "#1a100c", 0.3, 0.9) + W.L(["M108 -71.6q3.6 -.6 7.2 -.5q3.2 .2 6 .9"], "#b4a296", 0.12, 0.45) +
    `<path d="${G([[107.6, -69.6], [115, -69.2], [122.4, -68.8], [121.6, -66.4], [115, -65], [109, -66]])}" fill="${T.lg("olip", [[0, "#7a6860"], [0.5, "#4e403a"], [1, "#2a201c"]], 0, -69.6, 0, -65, UB)}"/>` +
    W.weich([[115, -64.4, 6, 0.9, 0, "#0e0a09", 0.6], [114.6, -68.6, 3.6, 0.5, 0, "#c0aea2", 0.45]], 0.4);
  g += `<g transform="translate(1.2 0)">${nm}</g>`;
  s += T.fein ? `<g mask="url(#${W.maskeForm("ogm", [[103.6, -116], [122, -116], [124, -100], [128, -70], [120, -61], [108, -61], [103.8, -66]], 0.6)})">${g}</g>` : g;
  /* Scheitel: kurzes, aufgestelltes, rotes Haar mit unregelmäßiger Silhouette direkt auf der Stirnoberkante (kein Reif) */
  s += W.haare([[103.4, -105], [105, -109.6], [109, -112], [114, -111.4], [118, -108.4], [119.8, -103], [114, -106], [108, -106.4]], 50, (x) => 262 + (x - 111) * 3, 1.3, OR,
    { licht: (x, y) => clamp(0.35 + (-y - 105) / 8), buendel: 2, krumm: 0.4, szene: 0.1 }) +
    W.saum([[102.4, -104.6], [104.6, -109.6], [107, -111.4], [109, -112.2], [111.6, -112.2], [114, -111.6], [116.4, -110.4], [118, -108.6], [120.4, -102.4]], 64,
      (x) => 262 + (x - 111) * 4, 1.6, OR.slice(1), { licht: (x) => clamp(0.85 - (x - 104) / 30), krumm: 0.35, ein: 0.25, streu: 26, laenge: () => 0.45 + T.rnd() * 1.1, szene: 0.15 });
  /* naher Backenwulst: Halbmond von der Schläfe bis zum Mundwinkel, in der Mitte am dicksten, Außenrand leicht wellig;
     Licht oben außen, Kernschatten zur Gesichtsmitte, unten Schlagschatten auf den Kehlsack; Poren, wenige Borsten */
  const wulstN = [[104, -103], [99, -102.6], [93.4, -99], [88.6, -93], [86.8, -86], [87, -79], [88.8, -73], [91.6, -68.6], [96, -65.6], [101, -64.8], [104, -66.6], [102.8, -72], [102.6, -80], [102.8, -90], [103.2, -99]];
  s += W.vol("v", 2.4, W.teil(wulstN, T.lg("own", [[0, "#6a5048"], [0.45, "#4a3a34"], [1, "#2a1e1a"]], 0, 0, 0.6, 1),
    W.weich([[92.4, -94, 3, 6.4, 15, "#b0907e", 0.5], [90, -84, 1.6, 6, 0, "#9a7a6a", 0.3], [101.8, -84, 2, 14, 0, "#0e0a09", 0.6], [97, -67.6, 5, 1.6, 10, "#0e0a09", 0.5]], 1.2) +
    W.fell("own", 100, T.box(wulstN), { hell: "#a8562a", dunkel: "#1a0c06", ho: 0.4, do: 0.45, fx: 4, fy: 1.2, hk: "ow", licht: false }) +
    W.haare(wulstN, 60, (x, y) => (y < -88 ? 240 : 140), 1, [["#3a1608", 0.07, 0.6], ["#6a2c12", 0.07, 0.6], ["#9a4a20", 0.07, 0.55], ["#c06a34", 0.06, 0.55]], { licht: (x) => clamp(0.85 - (x - 88) / 16), mix: 0.6, gerade: true, szene: 0.05 }),
  { rand: 0, maske: W.maskeForm("own", [[106, -103], [98, -103.6], [91.4, -100], [86.4, -93], [84.6, -85], [85, -78], [87, -71.6], [90.6, -66.6], [96, -63.6], [101.6, -62.8], [105, -64.6], [104.6, -90]], 0.35) }),
  { tiefe: 2, umgebung: 0.55 });
  s += W.saum([[99, -102.6], [93.4, -99], [88.6, -93], [86.8, -86], [87, -79], [88.8, -73]], 50, (x, y) => (y < -90 ? 215 : 175), 1.4, [["#3a1608", 0.08, 0.6], ["#6a2c12", 0.08, 0.6], ["#9a4a20", 0.07, 0.55]], { mix: 1, gerade: true, ein: 0.5, szene: 0.05 });
  /* Bart: kurze rotbraune Haare vom Kinn über den Kehlsack */
  s += W.saum([[103, -65], [108, -63.4], [113, -62.6], [118, -62.8], [122.4, -64.2]], 48, (x) => 92 - (x - 113) * 1.6, 2.6, OR.slice(1), { licht: () => 0.6, krumm: 0.55, ein: 0.2, szene: 0.1 });
  return s;
}

/* =====================================================================
   PAVIAN (Mantelpavian, erwachsenes Männchen, stehend auf vier Beinen)
   RECHERCHE (Wikipedia „Hamadryas baboon“, Animal Diversity Web, Oakland Zoo, PMC-Artikel): Männchen Kopf-Rumpf
   65–80 cm, Schwanz 40–60 cm (≈ 60–75 % der Kopf-Rumpf-Länge), 20–30 kg. Langer, leicht gewellter silbergrauer Mantel über
   Schultern, Oberarmen und Brust bis zur Rückenmitte; dahinter kurzes oliv-graubraunes Fell. Helle, nach hinten gekämmte
   Backenbärte, Scheitelhaar gescheitelt. Gesicht nackt, fleischrot bis rosa; Schnauze lang und KASTENFÖRMIG mit
   seitlichen Längswülsten (Maxillarwülste), Nasenlöcher vorn am Ende, Nasenspitze leicht überstehend; kräftiger
   Überaugenwulst, eng stehende, nach vorn gerichtete Augen mit hellen, fast weißen Oberlidern; Iris goldbraun.
   Paarige Gesäßschwielen, umgeben von leuchtend roter nackter Haut. Schwanz an der Wurzel dick, steigt hinten am Becken
   auf und fällt geknickt ab, kleine Quaste. Vorderhand halb fingergängig (Mittelhand ≈ 45° angehoben, Finger flach),
   Hinterfuß mit leicht angehobener Ferse; Hände/Füße dunkelgrau, matt, Nägel.
   ===================================================================== */
function pavian(T) {
  const W = werk(T);
  W.dichte = T.fein ? 0.5 : 0.8;
  W.saumDichte = T.fein ? 0.6 : 1;
  const SILBER = [["#4a4642", 0.12, 0.55], ["#706b66", 0.12, 0.55], ["#96918a", 0.11, 0.55], ["#bab6ae", 0.11, 0.6], ["#d8d5ce", 0.1, 0.6], ["#f2f0ea", 0.1, 0.65]];
  const OLIV = [["#3a352c", 0.1, 0.55], ["#58523f", 0.1, 0.55], ["#7a735e", 0.1, 0.55], ["#9a937c", 0.09, 0.55], ["#bdb69e", 0.09, 0.6]];
  /* EIN Licht oben links */
  const licht = (x, y) => clamp(0.3 + (-y - 30) / 55 - (x - 60) / 300);
  const HAUT = "#2e2a28";
  /* Kurzes, anliegendes Körperfell (oliv-graubraun) und langes, gewelltes Mantelhaar (silber) als Kachelmuster */
  const PM = W.haarMuster("pav", 6, 4, 110, 1.3, [["#2e2a22", 0.1, 0.7], ["#4e4838", 0.1, 0.65], ["#7a735e", 0.09, 0.6], ["#a49c86", 0.09, 0.6], ["#cfc8b0", 0.08, 0.6]], 0.3);
  const MM = W.haarMuster("man", 14, 10, 64, 9, [["#5e5a54", 0.12, 0.7], ["#8e8a84", 0.12, 0.7], ["#bab6ae", 0.11, 0.7], ["#dedad2", 0.1, 0.75], ["#f6f4ee", 0.1, 0.75]], 0.5);
  const oliv = (n, a, b, c) => T.lg("po" + n, [[0, a], [0.55, b], [1, c]]);
  const kfell = (pts, n, w, L, o = {}) => W.saum(pts, n, w, L, OLIV, Object.assign({ licht: () => 0.5, gerade: true, ein: 0.5, szene: 0.1 }, o));
  let s = "";

  /* ---------- Hinterbein: Oberschenkel schräg vor, Knie vorn, Wade hinten, spitzes Sprunggelenk, kürzerer Unterschenkel;
     Fuß mit langer Sohle, leicht angehobener Ferse, gegliederten Zehen, abgesetztem Großzeh ---------- */
  const hinter = (dx, fern) => {
    const P = (x, y) => [x + dx, y];
    const pts = [P(28, -54), P(40, -54), P(48, -46), P(53, -36), P(54.4, -28), P(52.4, -23), P(48, -18.6), P(45.6, -13.4), P(45, -8.6), P(41.4, -7.8), P(39.4, -10.2), P(39.6, -14), P(38.4, -19),
      P(37, -24), P(34, -30), P(29.6, -37), P(27, -44)];
    let b = W.teil(pts, fern ? "#38342a" : oliv("bn", "#8e8672", "#6c6554", "#3e3a2e"),
      W.musterFlaeche(pts, PM(fern ? 100 : 108), fern ? 0.5 : 1) +
      W.weich(fern ? [[46, -30, 6, 14, -20, "#000", 0.35]] : [[52, -34, 1.6, 5, -20, "#e8e0cc", 0.45], [50.4, -26, 2, 1.6, 0, "#d8d0bc", 0.4], [38.6, -18, 1.4, 4, 10, "#e0d8c4", 0.25],
        [44.4, -14, 1.2, 4.6, 10, "#1a1712", 0.45], [37.6, -27.6, 3, 1.2, 40, "#1a1712", 0.55], [32, -40, 3, 7, 30, "#1a1712", 0.4]], 1),
    { rand: 0, maske: W.maske("ph" + dx, [16, -66, 66, -4], 0, -54, 0, -44) });
    b += kfell([P(27, -44), P(29.6, -37), P(34, -30), P(37, -24), P(38.4, -19), P(39.6, -14), P(39.4, -10.2)], fern ? 20 : 50, (x, y) => (y < -30 ? 125 : 110), 1.2);
    /* Fuß */
    const fuss = [P(41, -8.4), P(45.4, -8.6), P(48.6, -5.6), P(53.6, -3.4), P(57.6, -2.2), P(58.6, -0.8), P(57.4, 0, 1), P(46, 0, 1), P(43.2, -1.6), P(41, -4.4)];
    b += W.teil(fuss, fern ? "#1c1a18" : T.lg("pfu", [[0, "#4a4440"], [0.6, HAUT], [1, "#141210"]]),
      fern ? "" : W.falten([`M${f1(43.6 + dx)} -5.4q1.8 .3 3.2 -.4`, `M${f1(44 + dx)} -3.4q1.4 .2 2.6 -.4`, `M${f1(48.2 + dx)} -4.6q.6 .6 .4 1.6`].concat(
        [50.6, 53, 55.4].map((x) => `M${f1(x + dx)} ${f1(-3.6 + (x - 50) * 0.18)}q.5 .9 .3 2.1`)), 0.1, "#000", "#9a8e86", 0.65, 0.3) +
        W.weich([[46.4 + dx, -6, 3, 1.1, -14, "#8a7e76", 0.35]], 0.5), { rand: 0.45, vol: false });
    if (!fern) {
      /* Zehen gegliedert (Gelenkbuckel), Großzeh innen abgesetzt, kurze dunkle Nägel */
      b += [[52.4, -2.4], [54.8, -1.8], [57, -1.2]].map(([x, y]) => `<ellipse cx="${f1(x + dx)}" cy="${f1(y)}" rx="1" ry=".7" fill="#3a3430"/><ellipse cx="${f1(x + 1.6 + dx)}" cy="${f1(y + 0.5)}" rx=".55" ry=".3" fill="#1a1614"/>`).join("") +
        W.glied([P(45.4, -2.6), P(48.4, -1.4), P(50, -1)], 1.6, "#26221f", "#8a7e76", { la: 0.25 }) + `<ellipse cx="${f1(50.2 + dx)}" cy="-1.1" rx=".45" ry=".3" fill="#1a1614"/>`;
      b += kfell([P(41, -8.6), P(45.4, -8.8), P(48.4, -6.2)], 22, 80, 1.1, { ein: 0.4 });
    }
    return b;
  };
  /* ---------- Vorderbein: Ellbogen hinten, Unterarm kräftig (Muskelspindel), Knick am Handgelenk; Hand halb fingergängig ---------- */
  const vorder = (dx, fern) => {
    const P = (x, y) => [x + dx, y];
    const pts = [P(86, -58), P(98, -60), P(101.4, -50), P(101, -40), P(100.8, -32), P(99.8, -22), P(99.2, -14), P(98.4, -10.6), P(93.8, -10.6), P(93, -14), P(92.2, -20), P(90.8, -28), P(89.2, -35),
      P(87.6, -40), P(86, -48)];
    let b = W.teil(pts, fern ? "#4e4a44" : T.lg("pvn", [[0, "#aaa69e"], [0.5, "#807c76"], [1, "#4e4a44"]], 0, 0, 1, 0.3),
      W.musterFlaeche(pts, PM(96), fern ? 0.5 : 1) +
      W.weich(fern ? [[95, -30, 5, 14, 0, "#000", 0.35]] : [[100, -32, 1.6, 7, -4, "#eeeae2", 0.4], [91.6, -24, 1.4, 8, 6, "#1a1816", 0.45], [88.6, -38.6, 1.6, 1.6, 0, "#1a1816", 0.5],
        [95, -44, 8, 3.4, 0, "#000", 0.55], [97.6, -12.4, 2, 1, 0, "#1a1816", 0.4]], 1.2),
    { rand: 0 });
    b += kfell([P(87.6, -40), P(89.2, -35), P(90.8, -28), P(92.2, -20), P(93, -14), P(93.8, -11)], fern ? 14 : 34, 100, 1.2);
    /* Hand: Mittelhand ≈ 45° angehoben, 4 Finger flach am Boden, gegliedert, kurze dunkle Nägel; Fellgrenze läuft aus */
    const hand = [P(93.6, -11.4), P(98.6, -11.6), P(100.2, -8.4), P(102.4, -5), P(103.2, -3), P(100.6, -1.4), P(97.4, -3), P(95, -6), P(93.8, -8.6)];
    b += W.teil(hand, fern ? "#1c1a18" : T.lg("pha", [[0, "#4a4440"], [0.6, HAUT], [1, "#141210"]], 0, 0, 1, 1),
      fern ? "" : W.falten([`M${f1(96.6 + dx)} -8.6q1.6 -.4 3 .4`, `M${f1(98.6 + dx)} -6q1.4 -.2 2.6 .6`, `M${f1(100.6 + dx)} -3.6q1.2 0 2 .6`], 0.1, "#000", "#9a8e86", 0.6, 0.3), { rand: 0.45, vol: false });
    for (let i = 0; i < 4; i++) {
      const fx = 101.8 - i * 1 + dx, ex = 109 - i * 1.4 + dx, y0 = -3 + i * 0.2;
      b += (T.fein ? W.glied([[fx, y0], [fx + 2.6, -1.6], [ex - 1.8, -0.95], [ex, -0.85]], 1.85 - i * 0.05, "#141210", "") : "") +
        W.glied([[fx, y0], [fx + 2.6, -1.6], [ex - 1.8, -0.95], [ex, -0.85]], 1.6 - i * 0.05, fern ? "#24201e" : ["#3a3430", "#403a36", "#48423e", "#504a45"][i], fern ? "" : "#a89c94", { la: 0.35 });
      if (!fern) b += `<ellipse cx="${f1(fx + 2.6)}" cy="-2.1" rx=".6" ry=".38" fill="#5a524c"/><ellipse cx="${f1(ex + 0.2)}" cy="-1.25" rx=".5" ry=".28" fill="#141210"/>` +
        W.L([`M${f1(fx + 2.2)} -1.8q.4 -.6 .9 -.6`, `M${f1(ex - 1.6)} -1.3v.7`], "#000", 0.08, 0.6);
    }
    if (!fern) b += kfell([P(93.4, -11.6), P(98.8, -11.8), P(100.4, -9.6)], 24, 70, 1.2, { ein: 0.45 });
    return b;
  };
  /* ferne Glieder: dunkler, schmal (ferner Oberschenkel nur als Streifen unter dem nahen) */
  s += W.vol("v", 2.6, hinter(-7, true)) + W.vol("v", 2, vorder(7, true));

  /* ---------- Schwanz: Wurzel am hinteren Beckenende über den Schwielen, erstes Drittel 35° nach hinten oben, Knick,
     dann fallend; Lichtkante oben, Unterseite heller, Haar kurz und anliegend; kleine dunkle Quaste ---------- */
  const sw = rohr([[28, -53, 2.8, 2.8], [24, -57, 2.5, 2.5], [20, -60, 2.2, 2.2], [16.4, -60.2, 2, 2], [13.6, -57, 1.8, 1.8], [12.4, -51, 1.6, 1.6], [11.6, -43, 1.4, 1.4], [11, -35, 1.2, 1.2], [10.8, -30, 1.1, 1.1]]);
  s += W.vol("v", 1.2, W.teil(sw.pts, T.lg("psw", [[0, "#a49c86"], [0.5, "#7a735e"], [1, "#4e4838"]], 0, 0, 1, 0.6),
    W.musterFlaeche(sw.pts, PM(200)) + W.L([G(sw.H.slice(1, 7), false)], "#c8c0a8", 0.7, 0.55) + W.L([G(sw.V.slice(0, 5), false)], "#e4dcc6", 0.4, 0.6), { rand: 0 }) +
    W.saum(sw.V.slice(0, 7), 40, (x, y) => (x > 18 ? 210 : 130), 1, OLIV.slice(2), { licht: () => 0.8, gerade: true, ein: 0.5, szene: 0.05 }));
  s += W.haare([[9.6, -32], [12, -32], [12.4, -27], [11, -24], [9.6, -27]], 40, 96, 4.6, [["#2a261e", 0.08, 0.7], ["#3e382c", 0.08, 0.65], ["#5a5444", 0.07, 0.6]], { mix: 1, krumm: 0.3, szene: 0.1 });

  /* ---------- Hinterkörper: Becken und Gesäß als EINE Masse mit gerundetem hinterem Ende ---------- */
  const rumpf = [[23.4, -47], [24.6, -53], [29, -58.4], [38, -60.8], [50, -62.4], [64, -65], [78, -69], [92, -70], [102, -64], [104, -52], [98, -42], [86, -37], [72, -35], [58, -34.6], [46, -35],
    [36, -37.6], [28, -41.6]];
  let rs = W.teil(rumpf, oliv("rf", "#9a927c", "#746d5a", "#3e3a2e"),
    W.musterFlaeche(rumpf, PM(184)) +
    W.musterFlaeche([[30, -40], [44, -38], [60, -37], [80, -40], [90, -48], [70, -48], [50, -46], [36, -46]], PM(118), 0.8) +
    W.weich([[60, -36, 24, 3, 0, "#14120e", 0.55], [56, -60, 22, 3, -6, "#e0d8c0", 0.35], [40, -44, 6, 7, 0, "#1a1712", 0.35]], 2),
  { rand: 0 });
  /* Schwielen: am hinteren Ende direkt unter der Schwanzwurzel, gewölbte, matte, grau-rosa Polster mit Rillen; ringsum
     flache rote Haut (#c2403c) mit weich auslaufendem Haarrand (kein Glühen) */
  rs += `<path d="${G([[22.2, -53.4], [26.4, -54.8], [29, -50.6], [29.2, -42.4], [27, -39.4], [23, -40], [21.6, -46]])}" fill="#b23c38"/>` +
    `<path d="${G([[22.4, -51.6], [25.6, -53], [27.8, -49.4], [27.8, -43], [25.8, -40.4], [23, -41.2], [21.8, -46]])}" fill="${T.lg("psch", [[0, "#c8aaa4"], [0.6, "#a0807c"], [1, "#6e5450"]], 0, 0, 1, 0.3)}"/>` +
    W.L(["M23.4 -50.4q1.2 4 .1 8.4", "M24.8 -51q1.2 4.4 .3 9.4", "M26.2 -49.4q.9 3.6 .1 7"], "#5a3e3c", 0.1, 0.55) + W.L(["M22.8 -50.6q-.6 4 .2 8"], "#f0dcd6", 0.12, 0.45);
  rs += kfell([[23.4, -55], [27.6, -56.2], [30.4, -51], [30.6, -42], [28.4, -38.8], [23.6, -39]], 90, (x, y) => (y < -47 ? 210 : 160), 1.2, { ein: 0.65, licht: () => 0.45 }) +
    kfell([[24.6, -53], [29, -58.4], [38, -60.8], [50, -62.4], [64, -65]], 60, 190, 1.2, { licht: () => 0.85 }) +
    kfell([[86, -37], [72, -35], [58, -34.6], [46, -35], [36, -37.6], [28.6, -41]], 70, 100, 1.3, { licht: () => 0.2 });
  s += W.vol("v", 6, rs);

  /* ---------- nahe Beine ---------- */
  s += W.vol("v", 3, hinter(0, false)) + W.vol("v", 2.4, vorder(0, false));

  /* ---------- Mantel: wächst aus dem Körper – lang an Schulter, Brust und Kopf, nach hinten kürzer und meliert ins oliv
     Rückenfell; Unterkante aus Strähnen sehr verschiedener Länge, die über den Oberarm fallen und Schatten werfen ---------- */
  const mantel = [[50, -55]].concat(T.fein ? W.zotteln([[52, -63], [58, -69], [68, -75], [80, -79], [92, -80.4], [102, -80], [108, -81], [114, -80.6]], 3, 2.6, (x) => 200 - (x - 52) * 0.2) :
    [[52, -63], [58, -69], [68, -75], [80, -79], [92, -80.4], [102, -80], [108, -81], [114, -80.6]], [[118.6, -76.4], [119.4, -70], [116.6, -62], [115.4, -52], [111.6, -44],
    [104, -40], [96, -39], [86, -41], [74, -45], [62, -47.6]]);
  const mW = (x, y) => (y < -62 ? 172 - (x - 52) * 0.15 : 120 - (x - 80) * 0.5);
  s += W.vol("v", 6, W.teil(mantel, T.lg("pmt", [[0, "#cecac2"], [0.45, "#a4a098"], [1, "#5e5a54"]]),
    W.musterFlaeche(mantel, MM(160)) + W.musterFlaeche([[54, -50], [80, -44], [100, -40], [112, -46], [112, -62], [90, -60], [70, -58]], MM(112)) +
    W.musterFlaeche([[96, -80], [108, -82], [118, -77], [119, -68], [112, -70], [104, -74]], MM(196), 0.9) +
    W.weich([[82, -74, 18, 4, -10, "#fbfaf6", 0.45], [92, -42, 16, 4, 0, "#1a1816", 0.5], [72, -50, 10, 3, 0, "#1a1816", 0.35]], 2.4),
  { rand: 0, maske: W.maske("pmt", [40, -90, 125, -30], 50, 0, 64, 0) }) +
    W.kantenStraehnen([[50, -55], [52, -63], [58, -69], [68, -75], [80, -79], [92, -80.4], [102, -80]], 70, (x, y) => (x < 58 ? 150 : 176 - (x - 60) * 0.25), 2, 7, 0.45,
      (x, y, z) => SILBER[Math.round(clamp(licht(x, y) * 0.95 + (z - 0.5) * 0.5) * 5)][0], { kante: 0, szene: 0.25, laenge: (x) => 0.4 + clamp((x - 50) / 30) * 0.8 }) +
    W.kantenStraehnen([[56, -50], [62, -47.6], [74, -45], [86, -41], [96, -39], [104, -40], [111.6, -44]], 90, (x) => (x < 70 ? 128 : 100), 1.6, 9, 0.5,
      (x, y, z) => SILBER[Math.round(clamp(0.25 + (x - 52) / 140 + (z - 0.5) * 0.6) * 5)][0], { kante: 0.12, ein: 0.25, szene: 0.25, laenge: (x) => 0.35 + clamp((x - 54) / 34) * 0.9 }) +
    W.saum([[56, -50], [62, -47.6], [74, -45], [86, -41], [96, -39], [104, -40], [111.6, -44]], 110, (x) => (x < 70 ? 135 : 100), 7, SILBER, { licht: (x) => clamp(0.3 + (x - 52) / 120), krumm: 0.5, ein: 0.3, szene: 0.06, laenge: (x) => 0.35 + clamp((x - 54) / 30) }) +
    W.saum([[58, -69], [68, -75], [80, -79], [92, -80.4], [102, -80], [110, -81]], 50, (x) => 178 - (x - 54) * 0.15, 4, SILBER.slice(2), { licht: () => 0.9, krumm: 0.5, szene: 0.06 }));
  /* hinten meliert: kurzes Mantelhaar läuft ins oliv Rückenfell aus */
  s += W.haare([[44, -58], [52, -63], [60, -66], [64, -58], [60, -50], [52, -48], [46, -52]], 70, 175, 3.4, SILBER.slice(1, 5), { licht: (x, y) => clamp(0.5 + (-y - 54) / 14), buendel: 2, krumm: 0.5, szene: 0.05 });

  /* ---------- Kopf ---------- */
  s += pavianKopf(T, W, SILBER, licht);
  return W.fertig(s, 1, [100, -84, 140, -40], [43, 52, 105, 114]);
}

/* Kopf: Gesicht nackt, rosa-rot; kastenförmige, vorn STUMPFE Schnauze (vorn ≈ 60 % der Basishöhe) mit Längswülsten;
   Nasenspitze nur wenig über der Oberlippe, kommaförmige Nasenlöcher vorn; Überaugenwulst als Teil des Schädels (Kante,
   oben hell, Schatten auf dem Oberlid); cremeweißes Oberlid direkt über der goldbraunen Iris; dünne Lippen, Eckzahnwulst,
   Unterkiefer als eigene Masse; Backenbart als nach hinten gekämmte Strähnen über dem Gesichtsrand, Mittelscheitel. */
function pavianKopf(T, W, SILBER, licht) {
  let s = "";
  const ges = [[111.6, -70.6], [114.6, -71.4], [117.6, -70.2], [119, -68.4], [121, -66.4], [128, -62.6], [134, -60.4], [136.8, -59.4], [138.4, -58.2], [139.2, -56.4], [138.8, -54.2], [137.8, -52.8],
    [137.6, -51.4], [136.6, -49.6], [133, -48.2], [127, -47], [121, -46], [116.6, -45.2], [112.6, -47.4], [110.4, -54], [110, -64]];
  s += W.vol("v", 2, W.teil(ges, T.lg("pge", [[0, "#d88676"], [0.3, "#c86e5e"], [0.62, "#b05a4c"], [1, "#6a3230"]], 0, 0, 0, 1),
    /* Längswülste: Licht-/Schattenbänder vom Auge zur Nase; Schnauzenrücken hell */
    W.weich([[127.4, -61.6, 9.4, 1.1, 20, "#f8c8b8", 0.75], [127.6, -59, 9.4, 0.9, 16, "#7a3432", 0.5], [128.4, -56.4, 9, 1, 11, "#f0b4a4", 0.5], [128.6, -53.8, 8.4, 0.8, 7, "#7a3432", 0.5],
      /* Überaugenwulst: durchgehende, gerundete Kante; oben hell, unten Schatten auf das Oberlid */
      [115.4, -70.6, 4.4, 1.3, 14, "#f4c0b0", 0.75], [115.6, -68.2, 3.8, 1, 14, "#4a1c1a", 0.6],
      /* Eckzahnwulst und Unterkiefer */
      [130.4, -52.6, 2.4, 1.2, 0, "#f0b4a4", 0.45], [124, -47.6, 10, 1.4, 4, "#4a2220", 0.55], [125, -49.6, 9, 0.6, 4, "#e8a898", 0.35]], 0.7) +
    W.falten(["M119.8 -62.8q6.4 3 14.6 4", "M119.4 -60q6.4 2.2 14.2 3", "M118.8 -57.2q6 1.6 13.4 2", "M112 -67.6q2.8 -.6 5.4 .2", "M113.6 -53q2 2 4.6 2.4", "M117 -50.2q4 1.6 9 1.6"],
      0.12, "#6a2c28", "#ffd8cc", 0.6, 0.4),
  { rand: 0 }));
  /* Nase: stumpfe Spitze, nur wenig über der Oberlippe, kommaförmige Nasenlöcher nach vorn/seitlich offen */
  s += W.weich([[137.6, -57.4, 1.4, 0.8, 0, "#e89a88", 0.6]], 0.3) +
    `<path d="M138.1 -56.4q1 -.2 1.1 .9q-.2 .7 -.9 .3q.3 -.5 -.2 -1.2zM136.8 -55.8q.9 .1 .9 1.1q-.3 .5 -.8 .1q.2 -.5 -.1 -1.2z" fill="#1a0806"/>` + W.L(["M136.4 -58.4q1.6 0 2.4 1.2"], "#ffd8cc", 0.12, 0.5);
  /* Lippen: dünne Wülste (Licht oben, Schatten unten); Mundspalte bis unter das Auge */
  s += W.L(["M137.4 -51.8q-3 .5 -6.6 .7q-4 .5 -7.6 1.5q-2.6 .8 -4.6 2"], "#3a1614", 0.24, 0.85) +
    W.L(["M137 -52.6q-3 .5 -6.6 .6q-4 .4 -7.4 1.3"], "#f0b8a8", 0.14, 0.5) + W.L(["M136.4 -50.6q-3 .4 -6.4 .6q-3.6 .4 -6.8 1.2"], "#8a4a44", 0.16, 0.45);
  /* Auge: tief in der Höhle, vom Wulstschatten teils bedeckt; cremeweißes Oberlid als Halbmond direkt über der Iris */
  s += W.auge2(115.4, -65.4, 1.15, { iris: "#9a6a2a", iris2: "#4a2a0c", sklera: "#3a2420", offen: 0.72, winkel: 14, lidDeck: 0.36, lid: "#e8e0d4", lidHell: "#ffffff",
    glanz: 0.55, karunkel: "#8a5a5a", hoehle: "#4a1c1a", wimpern: 3, wimpernLaenge: 0.3 });
  s += W.weich([[115.6, -67.6, 3.4, 0.7, 14, "#2a0e0c", 0.5]], 0.35);
  /* Backenbart: nach hinten gekämmte Strähnen über den Gesichtsrand, Kante über 10–15 px mit einzelnen Haaren aufgelöst */
    s += W.saum([[118, -71.4], [114.6, -72], [111.6, -71], [110.6, -68], [110.2, -62], [110.4, -56], [111.4, -51], [113.6, -47]], 170, (x, y) => (y < -70 ? 200 : y < -60 ? 192 : 176), 2.4,
    SILBER.slice(1).map(([c, w, o]) => [c, w * 0.9, o + 0.1]), { licht: (x, y) => clamp(0.55 + (-y - 56) / 30), krumm: 0.4, ein: 0.62, szene: 0.1 });
  /* Scheitel: Mittelscheitel, Haar nach hinten-außen */
  s += W.L(["M118.4 -76q-6 -3 -14 -3"], "#6a6660", 0.22, 0.55) +
    W.saum([[104, -79], [110, -79.6], [117, -76.6]], 30, 200, 2.4, SILBER.slice(3), { licht: () => 0.9, krumm: 0.4, ein: 0.4, szene: 0.05 });
  return s;
}

/* =====================================================================
   KATTA (Lemur catta, schreitend, Schwanz erhoben)
   RECHERCHE (San Diego Zoo, Mammalian Species 42/854, MNHN, Zoo New England): Kopf-Rumpf 39–46 cm, Schwanz 56–63 cm
   (länger als der Körper), 2,2 kg. Rücken grau bis rosa-graubraun, Glieder grau, Bauch und Innenseiten weiß/cremig;
   Scheitel und Nacken dunkelgrau. Gesicht weiß mit schwarzen, dreieckigen Augenflecken (Maske), schwarze, fuchsartig
   spitze Schnauze mit nacktem, feuchtem Nasenspiegel; Ohren spitz, dreieckig, weiß behaart; Augen orange-bernstein.
   Schwanz: 12–13 weiße und 13–14 schwarze Ringe, Spitze IMMER schwarz; buschig, nicht greiffähig, beim Gehen
   fragezeichenförmig hoch getragen. Hinterbeine länger als Vorderbeine; Hände/Füße mit schwarzer Haut, Nägel
   (2. Zehe mit Putzkralle).
   ===================================================================== */
function katta(T) {
  const W = werk(T);
  W.dichte = T.fein ? 0.6 : 0.8;
  W.saumDichte = T.fein ? 0.7 : 1;
  const GRAU = [["#4a4a4c", 0.06, 0.55], ["#6a6a6c", 0.06, 0.55], ["#8a8a8c", 0.055, 0.55], ["#aaaaac", 0.055, 0.55], ["#cacaca", 0.05, 0.6], ["#eceae6", 0.05, 0.65]];
  const RUECKEN = [["#4a3e38", 0.06, 0.55], ["#6a5c54", 0.06, 0.55], ["#8a7c74", 0.055, 0.55], ["#a89a90", 0.055, 0.55], ["#c8bab0", 0.05, 0.6]];
  const WEISS = [["#b8b2aa", 0.05, 0.55], ["#d6d0c8", 0.05, 0.6], ["#ece6dc", 0.045, 0.65], ["#faf6f0", 0.045, 0.7]];
  /* EIN Licht oben links */
  const licht = (x, y) => clamp(0.3 + (-y - 10) / 30 - (x - 20) / 120);
  /* dichtes, weiches Wollfell als Kachelmuster in drei Tonebenen je Fellfarbe */
  const KR = W.haarMuster("kr", 5, 3.4, 220, 0.75, [["#5a4c46", 0.06, 0.7], ["#7a6c64", 0.06, 0.65], ["#a8988e", 0.055, 0.65], ["#cabcb2", 0.05, 0.65]], 0.6);
  const KG = W.haarMuster("kg", 5, 3.4, 220, 0.75, [["#5a5a5c", 0.06, 0.7], ["#7e7e80", 0.06, 0.65], ["#a4a4a6", 0.055, 0.65], ["#cacaca", 0.05, 0.65]], 0.6);
  const KW = W.haarMuster("kw", 5, 3.4, 190, 0.75, [["#b4aea6", 0.05, 0.6], ["#d8d2c8", 0.05, 0.65], ["#f6f2ec", 0.05, 0.7]], 0.6);
  let s = "";
  /* Bein: graues Wollfell, weiße Innenseite, Gelenke modelliert; oben weich in den Rumpf */
  let bn = 0;
  const bein = (pts, fern, innen, w) => {
    const b = T.box(pts);
    return W.vol("v", 1, W.teil(pts, fern ? "#5e5e60" : T.lg("kb", [[0, "#9a9a9c"], [0.6, "#7e7e80"], [1, "#5e5e60"]], 0, 0, 1, 0.3),
      W.musterFlaeche(pts, KG(94), fern ? 0.5 : 1) + (innen && !fern ? W.weich([`<path d="${G(innen)}" fill="#ece6dc"/>`], 0.5) + W.musterFlaeche(innen, KW(96), 0.8) : "") +
      W.weich(w || [], 0.6),
    { rand: 0, maske: W.maske("kb" + bn++, [b[0] - 3, b[1] - 3, b[2] + 3, 2], 0, b[1] + 1, 0, b[1] + 6) }) +
      W.saum(pts.slice(Math.floor(pts.length / 2)), fern ? 10 : 30, 100, 0.5, GRAU, { licht: () => 0.5, gerade: true, ein: 0.5, szene: 0.05 }));
  };
  /* Hand (5 lange, leicht gespreizte Finger, flache Nägel) bzw. Fuß (≈ 1,4×, abgespreizter Großzeh, Putzkralle an der
     2. Zehe); nackte schwarze Haut, graues Haar bis zum Gelenk, Kontaktschatten */
  const hand = (x, fern, fuss) => {
    const c = fern ? "#121010" : "#2a2626", L = fuss ? 1.4 : 1, li = fern ? "" : "#8a8282";
    let h = W.weich([[x + 2 * L, -0.15, 3.6 * L, 0.4, 0, "#000", 0.4]], 0.3);
    h += `<path d="${G([[x - 0.6, -2.2], [x + 1.2 * L, -2.4], [x + 1.8 * L, -1.2], [x + 1.6 * L, -0.25], [x - 0.4, -0.2], [x - 1, -1.2]])}" fill="${fern ? c : "#1a1818"}"/>`;
    /* 4 lange Finger fächerartig gespreizt, dunkle Fugen dazwischen */
    for (let i = 3; i >= 0; i--) {
      const bx = x + 1.3 * L, by = -1.5 + i * 0.3, ex = x + (3.4 + [0.5, 1.1, 1, 0.4][i]) * L, ey = -0.3 - [0.05, 0.1, 0.05, 0][i];
      const zug = [[bx, by], [bx + (ex - bx) * 0.45, (by + ey) / 2 - 0.25], [ex, ey]];
      if (T.fein) h += W.glied(zug, 0.72, "#050404", "");
      h += W.glied(zug, 0.54, c, li, { la: 0.4 });
      if (T.fein && !fern) h += fuss && i === 0 ? `<path d="M${f1(ex - 0.1)} ${f1(ey - 0.25)}q.7 0 .8 .4q-.4 -.05 -.8 .1z" fill="#4a4040"/>` :
        `<ellipse cx="${f1(ex - 0.05)}" cy="${f1(ey - 0.14)}" rx=".22" ry=".12" fill="#7a706a"/>`;
    }
    /* Daumen / Großzeh nach innen-hinten abgespreizt */
    const dz = fuss ? [[x + 0.2, -1.3], [x - 1.2, -0.7], [x - 2.4, -0.35]] : [[x + 0.2, -1.1], [x - 0.8, -0.6], [x - 1.5, -0.4]];
    if (T.fein) h += W.glied(dz, fuss ? 0.9 : 0.72, "#050404", "");
    h += W.glied(dz, fuss ? 0.72 : 0.56, c, li, { la: 0.35 });
    return h;
  };

  /* ---------- ferne Beine (dunkler, schmaler, teils verdeckt) ---------- */
  s += hand(12.4, true, true) + bein([[6, -24], [13, -25], [17.4, -20], [18.4, -15], [16, -10.4], [13.4, -6.6], [12.6, -2], [9.8, -1.8], [9.8, -6], [10.8, -9.6], [9.6, -13.4], [6.4, -17]], true);
  s += hand(42.6, true, false) + bein([[38.6, -21], [43, -21], [44.4, -17], [43.6, -13.4], [43, -9], [43.6, -2], [41.2, -1.8], [40.8, -8], [40.4, -12.6], [39, -16]], true);

  /* ---------- Schwanz: Fragezeichen, 13 weiße / 14 schwarze Ringe, Spitze schwarz; Ringgrenzen gefiedert; weiche,
     nach hinten (zur Spitze) gerichtete Konturhaare; Basis dicker und mit Fell in den Rumpf übergehend;
     Lichtkante oben im Bogen, Kernschatten innen ---------- */
  const J = [[9, -25, 3, 3], [5.4, -29.6, 2.7, 2.7], [2.2, -35, 2.5, 2.5], [0, -42, 2.4, 2.4], [-1, -50, 2.4, 2.4], [-0.2, -57.6, 2.4, 2.4], [2.4, -64.4, 2.4, 2.4], [7, -69.4, 2.3, 2.3],
    [12.6, -71.6, 2.2, 2.2], [18, -70.4, 2.2, 2.2], [21.4, -67, 2.1, 2.1], [22.6, -62.8, 1.9, 1.9], [22.4, -60, 1.5, 1.5]];
  const fein = [];
  for (let i = 0; i < J.length - 1; i++) {
    const p0 = J[Math.max(0, i - 1)], p1 = J[i], p2 = J[i + 1], p3 = J[Math.min(J.length - 1, i + 2)];
    for (let t = 0; t < 1; t += 0.125) {
      const t2 = t * t, t3 = t2 * t, f = (k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
      fein.push([f(0), f(1), f(2), f(3)]);
    }
  }
  fein.push(J[J.length - 1]);
  const sw = rohr(fein);
  const L = []; let tot = 0;
  for (let i = 0; i < fein.length; i++) { if (i) tot += Math.hypot(fein[i][0] - fein[i - 1][0], fein[i][1] - fein[i - 1][1]); L.push(tot); }
  const ringe = 27, ringPfad = ["", ""], grenzen = [];
  const start = 3.2;   /* die ersten cm gehen ins Rumpffell über */
  const idx = (d) => { let i = 0; while (i < L.length - 2 && L[i + 1] < d) i++; return i; };
  const lauf = (r) => start + (tot - start) * r / ringe;
  for (let r = 0; r < ringe; r++) {
    const ia = idx(lauf(r)), ib = Math.min(fein.length - 1, idx(lauf(r + 1)) + 1);
    const ex = (p, k) => [p[0] + (p[0] - fein[k][0]) * 0.9, p[1] + (p[1] - fein[k][1]) * 0.9];
    const V = sw.V.slice(ia, ib + 1).map((p, k) => ex(p, ia + k)), H = sw.H.slice(ia, ib + 1).map((p, k) => ex(p, ia + k));
    ringPfad[(r % 2 === 0 || r === ringe - 1) ? 1 : 0] += "M" + V.concat(H.reverse()).map((p) => f1(p[0]) + " " + f1(p[1])).join("L") + "Z";
    if (r) grenzen.push(ia);
  }
  const swId = T.id("ksw"), swPts = sw.V.filter((p, i) => i % 2 === 0 || i === sw.V.length - 1).concat(sw.H.filter((p, i) => i % 2 === 0 || i === sw.H.length - 1).reverse());
  T.def(`<path id="${swId}p" d="${G(swPts)}"/><clipPath id="${swId}"><use href="#${swId}p"/></clipPath>`);
  W.box(swPts.map(([x, y]) => [x - 1.2, y - 1.2]).concat(swPts.map(([x, y]) => [x + 1.2, y + 1.2])));
  const naechst = (x, y) => { let best = 0, bd = 1e9; for (let i = 0; i < fein.length; i++) { const d = (fein[i][0] - x) ** 2 + (fein[i][1] - y) ** 2; if (d < bd) { bd = d; best = i; } } return best; };
  const ringFarbe = (x, y) => { const b = naechst(x, y); if (L[b] < start) return 2; const r = Math.floor((L[b] - start) / (tot - start) * ringe); return (r % 2 === 0 || r === ringe - 1) ? 0 : 1; };
  /* Wuchsrichtung: entlang der Achse zur Spitze, etwas nach außen */
  const tang = (x, y, aussen) => { const b = naechst(x, y), a = fein[Math.max(0, b - 1)], c = fein[Math.min(fein.length - 1, b + 1)]; return Math.atan2(c[1] - a[1], c[0] - a[0]) / RAD + aussen; };
  let swS = `<g clip-path="url(#${swId})"><use href="#${swId}p" fill="#8a7c74"/><g filter="${W.blur(0.25)}"><path d="${kurz(ringPfad[0])}" fill="#ece8e2"/><path d="${kurz(ringPfad[1])}" fill="#1c1a19"/></g>`;
  if (T.fein) {
    /* gefiederte Ringgrenzen: kurze Haare der vorigen Ringfarbe schräg über die Grenze */
    const gi = { 0: "", 1: "" };
    grenzen.forEach((ia) => {
      const p = fein[ia], q = fein[Math.min(fein.length - 1, ia + 1)], a = Math.atan2(q[1] - p[1], q[0] - p[0]);
      const r0 = ringFarbe(fein[Math.max(0, ia - 1)][0], fein[Math.max(0, ia - 1)][1]);
      for (let k = 0; k < 7; k++) {
        const t = (T.rnd() - 0.5) * 2 * p[2] * 0.95, x = p[0] - Math.sin(a) * t + Math.cos(a) * (T.rnd() - 0.6) * 0.5, y = p[1] + Math.cos(a) * t + Math.sin(a) * (T.rnd() - 0.6) * 0.5,
          l = 0.4 + T.rnd() * 0.6, aa = a + (t / p[2]) * 0.5 + (T.rnd() - 0.5) * 0.4;
        gi[r0 === 1 ? 1 : 0] += `M${i10(x - Math.cos(aa) * 0.15)} ${i10(y - Math.sin(aa) * 0.15)}l${i10(Math.cos(aa) * l)} ${i10(Math.sin(aa) * l)}`;
      }
    });
    swS += W.striche([gi[0], gi[1]], [["#eeeae4", 0.07, 0.7], ["#161414", 0.07, 0.7]]);
    /* Lichtkante oben im Bogen (Außenseite), Kernschatten innen */
    swS += W.L([G(sw.V, false)], "#fff", 1.4, 0.18, ` filter="${W.blur(0.6)}"`) + W.L([G(sw.H, false)], "#000", 1.6, 0.3, ` filter="${W.blur(0.6)}"`);
  }
  swS += `</g>`;
  const kh = (kante, aussen) => W.kantenStraehnen(kante, 140, (x, y) => tang(x, y, aussen), 0.5, 1.2, 0.22,
    (x, y, z) => { const f = ringFarbe(x, y); return f === 2 ? (z > 0.5 ? "#9a8c84" : "#7a6c64") : f ? (z > 0.5 ? "#f4f1ec" : "#d8d4ce") : (z > 0.5 ? "#2a2828" : "#141212"); },
    { kante: 0, ein: 0.55, szene: 0.2 });
  swS += kh(sw.V, -32) + kh(sw.H, 32);
  s += W.vol("v", 1, swS);

  /* ---------- Rumpf: 10 % kürzer, Brust vorn tief und gerundet, Taille vor dem Hinterbein, Kruppe höher als Widerrist;
     Rücken rosabraun-grau (#9a8c84), Flanke grau, Unterseite weiß-creme (#ece6dc) mit weicher Haargrenze ---------- */
  const rumpf = [[4.6, -22], [5.6, -27], [9.6, -29.8], [16, -30.2], [24, -28.8], [32, -27.6], [38, -27.4], [43, -26], [46.4, -22], [46, -17.4], [42, -14.6], [36, -14.4], [30, -15.8], [24, -17.8],
    [18, -19], [12, -19.4], [7, -19.6]];
  const bauch = [[46.8, -24], [46.6, -18.6], [42, -15.2], [36, -15], [30, -16.4], [24, -18.4], [18, -19.6], [22, -21.6], [30, -20], [38, -19.6], [42.6, -20.6], [44.6, -24.4]];
  const ruecken = [[5, -25], [9.6, -30], [16, -30.4], [24, -29], [32, -27.8], [38, -27.6], [43, -26.4], [38, -24], [28, -24.6], [18, -26], [10, -26]];
  s += W.vol("v", 3, W.teil(rumpf, T.lg("krf", [[0, "#9a8c84"], [0.45, "#8e8a88"], [1, "#a8a4a0"]]),
    W.musterFlaeche(rumpf, KG(150)) + (T.fein ? `<g mask="url(#${W.maskeForm("kru", ruecken, 1.2)})"><path d="${G(ruecken)}" fill="#9a8c84"/>${W.musterFlaeche(ruecken, KR(184))}</g>` : W.weich([`<path d="${G(ruecken)}" fill="#9a8c84"/>`], 1)) +
    W.weich([`<path d="${G(bauch)}" fill="#ece6dc"/>`], 0.9) + (T.fein ? `<g mask="url(#${W.maskeForm("kba", bauch, 0.5)})">${W.musterFlaeche(bauch, KW(100))}</g>` : "") +
    W.weich([[24, -29.4, 12, 1.6, -4, "#d8c8bc", 0.45], [40, -22, 4, 4, 0, "#5a5a5c", 0.3], [16, -21, 6, 2, 0, "#4a4a4c", 0.35]], 1),
  { rand: 0 }) +
    W.saum([[5.6, -27], [9.6, -29.8], [16, -30.2], [24, -28.8], [32, -27.6], [38, -27.4], [43, -26]], 70, 192, 0.6, RUECKEN, { licht: () => 0.75, gerade: true, ein: 0.5, szene: 0.06 }) +
    W.saum([[46, -17.4], [42, -14.6], [36, -14.4], [30, -15.8], [24, -17.8], [18, -19]], 60, 100, 0.7, WEISS, { licht: () => 0.55, gerade: true, ein: 0.5, szene: 0.06 }));

  /* ---------- nahe Beine: 15 % kürzer; Hinterbein mit muskulösem Oberschenkel, Knie vorn, Ferse hinten; Vorderbein mit
     Ellbogen und Handgelenk als Knick; Innenseiten weiß ---------- */
  s += hand(10.4, false, true) + bein([[4, -26], [13, -28], [18.6, -24.6], [20.6, -19.6], [20.2, -15.6], [17.8, -11.8], [14.8, -7.6], [13.4, -2], [10.2, -1.8], [9.8, -5.8], [10.8, -9.4], [9.8, -13], [6.4, -17.4],
    [4, -21]], false, [[6.8, -17.4], [10.6, -13.4], [11.6, -10], [9.6, -12], [6, -15]], [[11.2, -6.6, 0.8, 2.4, 0, "#2a2826", 0.4], [19.4, -18, 1.2, 3.4, -30, "#eeeae6", 0.35], [12, -18, 3, 4, 20, "#2a2826", 0.3], [19.6, -13, 1, 1, 0, "#2a2826", 0.4]]);
  s += hand(39.4, false, false) + bein([[35.6, -24], [42, -24], [43, -19], [42, -14], [41, -9], [41.4, -3.4], [41.4, -2], [38.6, -1.8], [38.2, -8], [37.4, -12.4], [35.8, -15], [35, -19]], false,
    [[36.2, -16], [37.8, -13], [38.6, -8], [38.4, -12.6]], [[41.6, -19, 1.2, 3, 0, "#eeeae6", 0.4], [36.6, -14.4, 0.9, 1, 0, "#2a2826", 0.45], [40.8, -5.4, 0.8, 0.8, 0, "#2a2826", 0.35]]);

  /* ---------- Hals: schlank, schräg nach vorn oben, ohne Kante; Kehle weiß, Nacken grau; Kopf wirft Schatten ---------- */
  const hals = [[39.6, -25.6], [43.6, -28.4], [46.6, -30.6], [49.6, -31.4], [52.2, -28.6], [51.2, -25.6], [48.6, -23.6], [45.6, -22.8], [42, -23]];
  s += W.vol("v", 1.6, W.teil(hals, T.lg("khs", [[0, "#8a8a8c"], [0.5, "#b4b0ae"], [1, "#ece6dc"]], 0, 0, 0.7, 1),
    W.musterFlaeche(hals, KG(205)) + (T.fein ? `<g mask="url(#${W.maskeForm("kke", [[53, -29.4], [51.8, -25.6], [48.8, -23.2], [45.6, -22.4], [44.6, -23.4], [48, -25.6], [50.2, -28.6]], 0.5)})">${W.musterFlaeche(hals, KW(110))}</g>` : "") +
    W.weich([[50, -31, 3, 1.2, -30, "#2a2826", 0.45]], 0.6),
  { rand: 0, maske: W.maske("khs", [36, -38, 56, -16], 38, 0, 42, 0) }));

  /* ---------- Kopf: kürzere, stumpfe, fuchsartige Schnauze, hohe runde Stirn; Wangen und Kiefer weiß; dreieckiger
     schwarzer Augenfleck (Spitze nach vorn unten) geht in die dunkle Schnauzenoberseite über; graue Kopfplatte ---------- */
  const kopf = [[47.2, -35], [48.4, -38.4], [51, -39.8], [54.2, -39.8], [56.8, -38.6], [58.1, -37.2], [59.8, -35.9], [61.1, -34.8], [61.4, -33.6], [60.8, -32.8], [58.9, -32.2], [56.4, -31.2],
    [53, -30.8], [50, -31.6], [47.8, -33]];
  let k = W.teil(kopf, T.lg("kkf", [[0, "#dcd8d2"], [0.5, "#ece8e2"], [1, "#f2efe8"]]),
    W.musterFlaeche(kopf, KW(185), 0.55) +
    /* graue Kopfplatte Stirn → Nacken */
    W.weich([`<path d="${G([[46.8, -35.4], [48.2, -38.6], [51, -40.2], [54.6, -40.2], [56.8, -38.8], [54.2, -38.2], [51.6, -37.4], [49.4, -35.4]])}" fill="#4e4e52"/>`], 0.25) +
    /* Augenfleck: Dreieck, Spitze nach vorn unten, verbunden mit dem dunklen Schnauzenrücken */
    W.weich([`<path d="${G([[53, -37.8], [56.2, -38.6], [57.9, -37.5], [59.6, -36.3], [61.4, -35], [61.2, -34.3], [59.6, -34.9], [57.8, -35.3], [56.6, -34.6], [54.6, -34.8], [53.2, -35.8]])}" fill="#141212"/>`], 0.2) +
    (T.fein ? W.haare(kopf, 120, (x, y) => (x > 58 ? 196 : y < -37.6 ? 200 : 172), 0.4, [["#121010", 0.04, 0.6], ["#4e4e52", 0.04, 0.55], ["#cac6c0", 0.04, 0.6], ["#faf8f4", 0.04, 0.65]],
      { licht: (x, y) => ((y < -38 && x < 56) || (y < -34.6 && y > -38.4 && x > 53 && x < 62.4 && y > -38.6 + (x - 53) * 0.2) ? 0.15 : 0.9), gerade: true, mix: 0.3, szene: 0 }) : "") +
    W.weich([[53, -31.6, 4, 0.8, 0, "#8a8480", 0.35], [52, -39, 3, 0.8, -10, "#fff", 0.25]], 0.4), { rand: 0 });
  /* Nasenspiegel: feucht, nackt, mit Nasenlöchern und mittiger Furche, kleiner Glanz; Lippenrand; wenige lange dunkle Schnurrhaare */
  k += `<path d="${G([[60.2, -35.5], [61.6, -34.9], [62, -34], [61.4, -33.2], [60.2, -33.6]])}" fill="#100e0e"/>` +
    W.L(["M61.7 -34.2q-.4 -.1 -.6 .2", "M61.4 -33.3v.5"], "#3a3434", 0.08, 0.9) + W.L(["M60.6 -35.2q.6 .1 .9 .5"], "#fff", 0.07, 0.55) +
    W.L(["M61.3 -32.7q-1.4 .5 -3 .5"], "#0e0c0c", 0.1, 0.85) + W.L(["M61 -32.3q-1.2 .4 -2.4 .4"], "#8a8480", 0.06, 0.5);
  if (T.fein) k += T.schnurrhaare(60.4, -33.4, 4, 3.4, 12, 36, "#1a1818", 0.03);
  /* Auge: groß, gelb-orange, radial gezeichnet, leicht nach vorn gedreht; schmaler schwarzer Lidring geht in den Fleck über */
  k += `<g transform="translate(55.6 -36.4) scale(.88 1) translate(-55.6 36.4)">` + W.auge2(55.6, -36.4, 0.95, { iris: "#e8a020", iris2: "#b06008", faser: "#6a3404", sklera: "#3a2410", offen: 0.95, winkel: 10,
    lidDeck: 0.06, lid: "#121010", lidHell: "#2a2626", rand: "#050404", glanz: 0.8, pupR: 0.36, karunkel: "#4a3a3a" }) + `</g>`;
  /* Ohren: am hinteren Seitenkopf, 20 % kürzer, nach hinten außen gekippt; weiß, innen langes weißes Haar, Rand behaart;
     fernes Ohr kleiner und dunkler dahinter */
  const ohr = (dx, dy, k2) => [[48.6, -36.6], [47.4, -38.8], [46.4, -40.6], [48.6, -39.8], [50.2, -38]].map(([x, y]) => [48.6 + (x - 48.6) * k2 + dx, -37 + (y + 37) * k2 + dy]);
  const oF = ohr(1.6, -1.2, 0.75), oN = ohr(0, 0, 1);
  s += `<g transform="translate(-1.5 3.4)">`;
  s += W.teil(oF, "#b8b4ae", W.haare(oF, 10, 225, 0.7, WEISS.slice(0, 2), { licht: () => 0.5, gerade: true, szene: 0 }), { rand: 0 });
  s += W.vol("v", 1.6, k);
  s += W.vol("v", 0.6, W.teil(oN, "#e2ded8", W.weich([[47.8, -38.4, 0.5, 1.1, 30, "#6a6668", 0.45]], 0.25) + W.haare(oN, 30, 220, 0.9, WEISS, { licht: () => 0.85, gerade: true, szene: 0.05 }), { rand: 0 }) +
    W.saum([[47.4, -38.8], [46.4, -40.6], [48.6, -39.8]], 20, 230, 0.7, WEISS, { licht: () => 0.9, gerade: true, szene: 0.05 }));
  s += `</g>`;
  return W.fertig(s, 1, [43.5, -39.6, 63.5, -25.6], [10, 16, 40, 45]);
}

/* Eukalyptusblatt: lanzettlich, sichelförmig, graugrün, hängend; (x, y) Stielansatz, winkel, Länge */
function euBlatt(x, y, w, L, c1, c2) {
  const a = w * RAD, ca = Math.cos(a), sa = Math.sin(a), b = L * 0.16;
  const P = (u, v) => [x + ca * u - sa * v, y + sa * u + ca * v];
  const pts = [P(0, 0), P(L * 0.25, -b * 0.9), P(L * 0.6, -b * 0.7), P(L, b * 0.5, 1), P(L * 0.6, b * 0.7), P(L * 0.25, b * 0.6)];
  const mid = [P(0, 0), P(L * 0.5, -b * 0.05), P(L * 0.95, b * 0.45)];
  return { pts, mid };
}

/* =====================================================================
   KOALA (am Eukalyptusast, Kopf zum Betrachter gedreht)
   RECHERCHE (San Diego Zoo, iNaturalist/ALA, BBC Wildlife, Cleveland Metroparks Zoo): 60–85 cm, 4–14 kg; gedrungen,
   „teddybärartig“, kurze kräftige Glieder, kein sichtbarer Schwanz. Fell dicht, wollig: Rücken und Kopf bräunlich-grau,
   Brust, Bauch und Innenseiten der Glieder grauweiß/weiß; Hinterteil weiß gesprenkelt. Kopf groß, runde Ohren mit langen
   weißen Fellbüscheln am Rand; große, löffelförmige, ledrige schwarze Nase; kleine dunkle Augen (senkrechte Schlitz-
   pupille). Hände mit zwei gegenüberstellbaren Fingern (1+2 gegen 3–5), lange scharfe, gebogene Krallen; am Fuß Großzehe
   ohne Kralle, 2./3. Zehe verwachsen. Hält sich mit allen vieren am Stamm, Bauch zum Holz.
   ===================================================================== */
function koala(T) {
  const W = werk(T);
  W.dichte = T.fein ? 0.8 : 1;
  const GRAU = [["#4a4542", 0.08, 0.6], ["#6a6460", 0.08, 0.6], ["#8a847e", 0.075, 0.6], ["#aaa49e", 0.07, 0.6], ["#cac5c0", 0.07, 0.65], ["#ebe8e4", 0.065, 0.7]];
  const BRAUN = [["#4a4038", 0.08, 0.6], ["#6a5c50", 0.08, 0.6], ["#8a7c70", 0.075, 0.6], ["#a89a8e", 0.07, 0.6]];
  const WEISS = [["#bcb8b2", 0.07, 0.6], ["#d8d4ce", 0.07, 0.65], ["#ecebe6", 0.065, 0.7], ["#fbfaf7", 0.06, 0.75]];
  const licht = (x, y) => clamp(0.45 + (-y - 70) / 70 - (x - 40) / 50);
  /* wolliges Fell: kurze, gekrümmte Büschel (Bündel), Licht oben */
  const wolle = (pts, n, w, L, farben, o = {}) => W.fell("kw" + n, typeof w === "number" ? w : 100, T.box(pts), { hell: "#f2f0ec", dunkel: "#3a3634", ho: 0.4, do: 0.4, fx: 4, fy: 1.1, hk: "kk" }) +
    W.haare(pts, n, w, L, farben, Object.assign({ licht, buendel: 4, krumm: 0.35, streu: 24, szene: 0.07 }, o));
  let s = "";

  /* ---------- Eukalyptusstamm: dick, glatte Borke mit abblätternden Flecken (creme, grau, oliv), oben Astgabel ---------- */
  const st = rohr([[80, 0, 17, 17], [79.4, -40, 16, 16], [78.6, -80, 15.2, 15.2], [78, -120, 14.4, 14.4], [77.6, -146, 13.6, 13.6]]);
  const gabelL = rohr([[72, -142, 6, 6], [66, -158, 4.6, 4.6], [61, -172, 3.4, 3.4], [58.6, -180, 2.4, 2.4]]);
  const gabelR = rohr([[84, -142, 7.6, 7.6], [91, -158, 6, 6], [98, -170, 4.4, 4.4], [104, -178, 3, 3]]);
  const borke = (pts, n) => W.teil(pts, T.lg("kst" + n, [[0, "#ddd4c4"], [0.4, "#c4b8a4"], [0.75, "#9a8e7c"], [1, "#6a6052"]], 0, 0, 1, 0),
    W.weich([[70, -60, 3.4, 40, 1, "#fffaf0", 0.35], [92, -90, 4, 50, 1, "#3a3228", 0.35]], 2.4) +
    /* abblätternde Borke: Flecken in Grau, Oliv, Creme mit dunkler Rissrand-Kante */
    (T.fein ? [[68, -22, 6, 10, "#a8a090"], [86, -48, 7, 12, "#8a8a6a"], [72, -98, 5, 14, "#b8ae9c"], [88, -126, 6, 9, "#9a9478"], [70, -136, 4, 8, "#e8e0d0"], [90, -14, 5, 8, "#e6dccc"]]
      .map(([x, y, rx, ry, c]) => W.weich([`<path d="${G([[x - rx, y + ry * 0.2], [x - rx * 0.4, y - ry], [x + rx * 0.7, y - ry * 0.8], [x + rx, y + ry * 0.3], [x + rx * 0.2, y + ry], [x - rx * 0.6, y + ry * 0.8]])}" fill="${c}" opacity=".55"/>`], 0.6) +
        W.L([`M${f1(x - rx)} ${f1(y + ry * 0.2)}q${f1(rx * 0.3)} ${f1(-ry)} ${f1(rx * 1.2)} ${f1(-ry)}`], "#5a5040", 0.2, 0.35)).join("") : "") +
    W.L(["M70 -10q2 -14 1 -28", "M88 -30q-1 -16 0 -32", "M74 -70q2 -16 1 -30", "M86 -104q-1 -12 0 -24"], "#6a5e4e", 0.2, 0.4), { rand: 0 });
  s += W.vol("v", 6, borke(gabelL.pts, "l") + borke(gabelR.pts, "r") + borke(st.pts, "s"));
  /* Blätter: lanzettlich, sichelförmig, hängend, mit Stiel und Mittelrippe, matt blaugrün */
  let blatt = "", rippe = "", stiel = "";
  for (const [x, y, w, L] of [[60, -176, 100, 15], [62.6, -168, 120, 14], [58.6, -180, 70, 13], [98, -170, 80, 15], [101, -174, 60, 14], [104, -178, 95, 13], [94, -164, 110, 13], [56, -182, 140, 12]]) {
    const a = w * RAD, sx = x + Math.cos(a) * 2, sy = y + Math.sin(a) * 2;
    stiel += `M${f1(x)} ${f1(y)}L${f1(sx)} ${f1(sy)}`;
    const b = euBlatt(sx, sy, w, L);
    blatt += G(b.pts); rippe += G(b.mid, false); W.box(b.pts);
  }
  s += `<path d="${stiel}" stroke="#6a5a3a" stroke-width=".5" fill="none"/>` +
    `<path d="${kurz(blatt)}" fill="${T.lg("kbl", [[0, "#a4b4a4"], [0.5, "#7e9682"], [1, "#58705e"]], 0, 0, 1, 1)}" stroke="#3e5440" stroke-opacity=".45" stroke-width=".2"/>` +
    `<path d="${kurz(rippe)}" fill="none" stroke="#dce6d0" stroke-opacity=".6" stroke-width=".22"/>`;

  /* ---------- ferne Hand und ferner Fuß: am rechten Stammrand, teilweise verdeckt ---------- */
  const krallen = (pts, fern) => pts.map(([x, y, a]) => `<path d="M${f1(x)} ${f1(y)}q${f1(Math.cos(a) * 2)} ${f1(Math.sin(a) * 2 - 0.6)} ${f1(Math.cos(a) * 3)} ${f1(Math.sin(a) * 3 + 0.6)}q${f1(-Math.cos(a) * 1.2)} -.3 ${f1(-Math.cos(a) * 2.6)} .3z" fill="${fern ? "#3a3028" : T.lg("kkr", [[0, "#3a3028"], [0.6, "#5a4f45"], [1, "#a89a88"]], 0, 0, 1, 0)}"/>`).join("");
  s += `<path d="${G([[91, -116], [95.4, -117], [96.6, -112], [94.6, -108], [91, -109]])}" fill="#4a4440"/>` + krallen([[95.6, -116, 0.3], [96.4, -113.4, 0.4], [96, -110.6, 0.5]], true);
  s += `<path d="${G([[92, -50], [96.4, -50.6], [97.4, -46], [95, -42], [92, -43]])}" fill="#4a4440"/>` + krallen([[96.6, -49.4, 0.4], [97, -46.4, 0.5]], true);

  /* ---------- Körper: an den Stamm gepresst (Bauch zum Holz), Rücken als Buckel, Gesäß am Stamm ---------- */
  const koerper = [[50, -112], [42, -108], [36, -98], [33, -84], [32.6, -70], [34, -56], [38, -44], [46, -36], [56, -33], [66, -35], [70, -46], [70, -64], [70, -82], [68, -100], [62, -110]];
  const brust = [[70, -96], [70.4, -80], [70.4, -64], [70, -48], [66, -38], [62, -40], [64, -56], [64.6, -72], [64.6, -88], [66, -100]];
  s += W.vol("v", 7, W.teil(koerper, T.lg("kkr", [[0, "#9a948c"], [0.5, "#888078"], [1, "#6a645e"]], 0, 0, 1, 0.3),
    W.weich([`<path d="${G(brust)}" fill="#e8e4de"/>`, [70, -60, 3, 26, 0, "#2a2624", 0.35]], 1.6) +
    /* Hinterteil weiß gesprenkelt */
    (T.fein ? W.haare([[36, -56], [40, -44], [48, -37], [56, -35], [52, -44], [42, -52]], 50, 120, 1, WEISS, { licht: () => 0.8, buendel: 3, krumm: 0.5, szene: 0 }) : "") +
    wolle(koerper, 380, (x, y) => (y > -48 ? 115 : 100 + (x - 50) * 0.4), 1.4, GRAU, { licht: (x, y) => licht(x, y) * 0.9 }) +
    wolle([[40, -104], [36, -92], [34, -76], [38, -80], [42, -96]], 50, 100, 1.2, BRAUN, { licht: () => 0.6 }) +
    wolle(brust, 70, 95, 1.2, WEISS, { licht: (x) => clamp(0.4 + (x - 64) / 8) }), { rand: 0 }) +
    W.saum([[50, -112], [42, -108], [36, -98], [33, -84], [32.6, -70], [34, -56], [38, -44], [46, -36], [56, -33]], 120, (x, y) => (y > -48 ? 120 : 170 - (y + 70) * 0.3), 1.6, GRAU, { licht: (x, y) => licht(x, y), krumm: 0.5, ein: 0.4, szene: 0.07 }));

  /* ---------- Hinterbein: Oberschenkel als Masse aus dem Rumpf, Fuß umgreift den Stamm (krallenloser Großzeh gegenüber) ---------- */
  const bein = [[40, -46], [44, -56], [52, -58], [60, -54], [68, -48], [74, -46], [76, -41], [72, -37.6], [62, -36], [50, -34.6], [42, -38]];
  s += W.vol("v", 3.4, W.teil(bein, T.lg("kbn", [[0, "#a6a09a"], [1, "#6a645e"]]),
    W.weich([[54, -54, 7, 2.4, 10, "#ece8e2", 0.45], [60, -38, 8, 1.6, 0, "#2a2624", 0.45]], 1.2) +
    wolle(bein, 120, 20, 1.2, GRAU, { licht: (x, y) => licht(x, y) + 0.15 }), { rand: 0, maske: W.maske("kbn", [30, -66, 80, -30], 0, -60, 0, -52) }) +
    W.saum([[42, -38], [50, -34.6], [62, -36], [72, -37.6]], 40, 95, 1.4, GRAU.slice(1), { licht: () => 0.4, krumm: 0.5, szene: 0.07 }));
  /* Fuß: Sohle am Stamm, Großzeh (ohne Kralle) nach unten-hinten, Doppelzehe 2+3 mit zwei Krallen, Zehen 4, 5 mit Krallen */
  s += W.teil([[72, -47], [77.4, -48], [80.4, -45], [80.6, -40.6], [78, -37.4], [73.6, -38]], T.lg("kfu", [[0, "#5a5450"], [1, "#2e2a28"]]),
    W.L(["M76.4 -47q1.6 3 1.2 6.6"], "#1a1614", 0.2, 0.6) + `<path d="M74 -47.6q3 -.8 6 2" fill="none" stroke="#9a948e" stroke-width=".25" stroke-opacity=".5"/>`, { rand: 0.3 });
  s += W.glied([[74, -38.4], [74.6, -35.6], [76.6, -34.4]], 2.4, "#3a3430", "#8a847e", { la: 0.3 });
  s += krallen([[80.2, -47.2, 0.2], [80.8, -45.4, 0.25], [81, -43.2, 0.35], [80.6, -41, 0.45]], false);

  /* ---------- Arme: greifen über Kopfhöhe um den Stamm; Innenarm weiß; Hand: Daumen+Zeigefinger gegen 3 Finger ---------- */
  const arm = [[48, -108], [54, -115], [63, -120], [72, -124.6], [78.6, -125.6], [80.6, -119], [76, -114], [68, -108], [62, -101], [55, -97]];
  s += W.vol("v", 2.4, W.teil(arm, T.lg("kar", [[0, "#aaa49e"], [0.55, "#8a847e"], [1, "#e6e2dc"]], 0, 0, 0.3, 1),
    W.weich([[66, -116, 9, 2, -25, "#ece8e2", 0.4], [70, -110, 6, 1.6, -25, "#2a2624", 0.35]], 1) +
    wolle(arm, 110, -25, 1.2, GRAU, { licht: (x, y) => licht(x, y) + 0.25 }) +
    wolle([[56, -101], [62, -105], [68, -110.4], [76, -115.4], [70, -112], [62, -106]], 30, -25, 1, WEISS, { licht: () => 0.6 }), { rand: 0 }) +
    W.saum([[56, -100], [62, -104], [68, -110], [76, -115]], 30, 80, 1.3, WEISS, { licht: () => 0.6, krumm: 0.5, szene: 0.07 }));
  /* Hand am Stamm: Handfläche nackt schwarzgrau mit Ballen, Fell bis zu den Fingern; 3 Finger oben, Daumen+Zeigefinger unten */
  s += W.teil([[76, -126], [81, -127], [84.6, -124], [85, -119.6], [82, -116.6], [77.6, -117.4], [75.6, -121]], T.lg("kha", [[0, "#5a5450"], [1, "#2a2624"]], 0, 0, 1, 1),
    W.weich([[80, -122, 2.4, 1.6, 0, "#7a746e", 0.5]], 0.5) + W.haare([[75.6, -126.6], [80, -127.6], [80.6, -124], [76, -123]], 20, 10, 0.9, GRAU.slice(2), { licht: () => 0.6, gerade: true, szene: 0 }), { rand: 0.3 });
  s += krallen([[84.4, -126.4, 0.1], [85.4, -124.4, 0.2], [85.8, -122, 0.3]], false) +
    W.glied([[78.6, -117.4], [80.6, -115.2], [83, -114.4]], 1.6, "#3a3430", "#8a847e", { la: 0.3 }) + W.glied([[80.6, -117.6], [83, -116.4], [85, -116]], 1.5, "#3a3430", "#8a847e", { la: 0.3 }) +
    krallen([[82.8, -114.6, 0.5], [84.8, -116.2, 0.4]], false);
  /* Kontaktschatten Stamm → Körperseite, Schatten des Stammes auf Hand/Arm */
  s += W.weich([[70.6, -70, 1.6, 34, 0, "#1a1614", 0.35]], 1.2);

  /* ---------- Kopf ---------- */
  s += koalaKopf(T, W, GRAU, WEISS);
  return W.fertig(s, 1, [28, -132, 72, -86], [80]);
}

/* Koalakopf (¾ zum Betrachter): runder Kopf; Ohren seitlich hinter den Augen, Muschel nach vorn offen, innen dunkle Schale
   mit langen weißen Haaren, außen dicke weiße Fransen nach außen-unten; große, matte, ledrige Nase mit Körnung, schmaler
   Glanz oben, geschwungene Nasenlochschlitze unten seitlich, Haarrand; braun-bernsteinfarbene Augen mit Schlitzpupille,
   leicht eingesunken; weißes Kinn. */
function koalaKopf(T, W, GRAU, WEISS) {
  let s = "";
  const C = [52, -106];
  const ohr = (cx, cy, r, k) => {
    const pts = [[cx - r * 0.9, cy + r * 0.3], [cx - r, cy - r * 0.5], [cx - r * 0.4, cy - r * 1.05], [cx + r * 0.5, cy - r * 0.95], [cx + r, cy - r * 0.2], [cx + r * 0.7, cy + r * 0.7], [cx, cy + r * 0.9]];
    const schale = [[cx - r * 0.5, cy], [cx - r * 0.45, cy - r * 0.55], [cx + r * 0.2, cy - r * 0.6], [cx + r * 0.5, cy - r * 0.1], [cx + r * 0.3, cy + r * 0.45], [cx - r * 0.2, cy + r * 0.45]];
    const aussen = (x, y) => { const a = Math.atan2(y - cy, x - cx) / RAD; return (x < cx ? (a + 180 * 0.35 + 135 * 0.3) / 1 : a * 0.6 + 90 * 0.4) ; };
    return W.vol("v", 1.2, W.teil(pts, "#8e8882", W.weich([`<path d="${G(schale)}" fill="#3e3a38"/>`], 0.6) +
      W.haare(schale, 60, (x, y) => (x < cx ? 200 : -20) + 40, r * 0.8, WEISS, { licht: () => 0.8, krumm: 0.4, szene: 0.06 }), { rand: 0 }) +
      W.saum(pts.slice(0, 6), 150, (x, y) => { const a = Math.atan2(y - cy, x - cx); return Math.atan2(Math.sin(a) + 0.9, Math.cos(a)) / RAD; }, r * 0.85, WEISS.map(([c, w, o]) => [c, w * 1.6, Math.min(0.9, o + 0.15)]), { licht: () => 0.85, krumm: 0.5, ein: 0.35, szene: 0.08 }));
  };
  s += ohr(65, -116, 6.4, 1);
  const kopf = [[40, -104], [40, -112], [44, -119], [51, -122], [58, -121.6], [64, -118], [67.6, -111], [68, -103], [65.4, -96], [60, -91.4], [53, -90], [46.6, -92.4], [42, -97]];
  s += W.vol("v", 4, W.teil(kopf, T.rg("kkp", [[0, "#aca69e"], [0.65, "#928c86"], [1, "#6a645e"]], 0.42, 0.38, 0.65),
    W.weich([`<path d="${G([[46, -96], [52, -93], [60, -93.6], [64, -97], [60, -91.4], [53, -90.2], [47, -92.6]])}" fill="#ece8e4"/>`, [64.6, -104, 2.4, 8, 0, "#3a3634", 0.35]], 1) +
    W.fell("kkp", 90, [39, -123, 69, -88], { hell: "#f2f0ec", dunkel: "#3a3634", ho: 0.4, do: 0.35, fx: 5, fy: 1.6, hk: "kk" }) +
    W.haare(kopf, 260, (x, y) => Math.atan2(y - C[1], x - C[0]) / RAD, 0.9, GRAU.slice(1), { licht: (x, y) => clamp(0.85 - (x - 42) / 40 - (y + 120) / 60), buendel: 2, krumm: 0.45, szene: 0.05 }), { rand: 0 }) +
    W.saum([[40, -104], [40, -112], [44, -119], [51, -122], [58, -121.6], [64, -118]], 50, (x, y) => Math.atan2(y - C[1], x - C[0]) / RAD, 1, GRAU, { licht: () => 0.7, krumm: 0.5, szene: 0.05 }));
  /* Augen: 30 % größer, braun-bernstein, senkrechte Schlitzpupille, dunkler Lidrand, kleiner Glanz, Haarschatten darüber */
  const aug = { iris: "#8a5a2a", iris2: "#3a220c", sklera: "#2a1e16", pupille: "schlitz", offen: 0.85, lidDeck: 0.15, lid: "#2a2624", lidHell: "#8a847e", glanz: 0.7, karunkel: "#5a4a4a", hoehle: "#2a2624" };
  s += W.auge2(49.4, -107.2, 1.35, Object.assign({ winkel: -10 }, aug));
  s += `<g transform="translate(61.4 -107.4) scale(.8 1) translate(-61.4 107.4)">` + W.auge2(61.4, -107.4, 1.28, Object.assign({ winkel: 10 }, aug)) + `</g>`;
  /* Nase: oben breit, zum Mund leicht verjüngt; matt, ledrig gekörnt; Glanz nur als schmaler Streifen oben */
  const nase = [[56, -109.6], [59.4, -108.4], [60.8, -104], [60.4, -99], [58.6, -95.8], [55.8, -95.2], [53, -96.4], [52, -100], [52.6, -105], [54, -108.6]];
  s += W.saum(nase.concat([nase[0]]), 40, (x, y) => Math.atan2(y + 102, x - 56.4) / RAD, 0.8, GRAU.slice(2), { licht: () => 0.6, ein: 0.6, gerade: true, szene: 0 });
  s += W.teil(nase, T.lg("kns", [[0, "#3a3636"], [0.5, "#242222"], [1, "#141313"]], 0, 0, 1, 0.4),
    W.relief("knase", `<path d="${G(nase)}" fill="#3a3636" fill-opacity=".5"/>`, { f: 4, tiefe: 0.5, okt: 2 }) +
    W.weich([[56, -108.2, 2.4, 0.5, 0, "#a8a4a4", 0.55], [54, -102, 1, 3, -6, "#5a5656", 0.4]], 0.35) +
    `<path d="M53.6 -97.4q.8 -1 2 -.6q-.6 .9 -2 .6zM58.8 -97.2q-.6 -1 -1.8 -.6q.6 .9 1.8 .6z" fill="#000"/>`, { rand: 0 });
  s += W.L(["M53.8 -93q2.4 .4 4.8 0"], "#2a2624", 0.16, 0.55);
  /* nahes Ohr (links): seitlich hinter dem Auge */
  s += ohr(38.6, -113, 7.6, -1);
  return s;
}

/* =====================================================================
   FAULTIER (Braunkehl-Faultier, Bradypus variegatus, hängt mit allen vieren unter dem Ast)
   RECHERCHE (Wikipedia „Brown-throated sloth“, xenarthrans.org, Dallas World Aquarium, JungleDragon): Kopf-Rumpf
   42–80 cm, 2,2–6,3 kg, Schwanz nur 4–9 cm. Fell grau-braun bis beige, lang und strähnig (wollige Unterwolle, grobes
   Deckhaar mit Rillen, in denen Algen wachsen → grünlicher Schimmer); Kehle, Gesichtsseiten und Stirn dunkler braun.
   Gesicht heller (beige-weiß) mit einem sehr dunklen Streifen vom Auge nach hinten („Maske“), kleine dunkle Augen,
   kleine dunkle Nase, Mundwinkel natürlich nach oben gebogen. Arme deutlich länger als die Beine; je drei Finger/Zehen
   mit langen, gebogenen Krallen (vorn 7–8 cm, hinten 5–5,5 cm), die sich in Ruhe um den Ast haken (Sehnen-Sperre).
   Haar wächst vom Bauch zum Rücken (läuft beim Hängen nach unten ab). Kopf rund, Ohren im Fell versteckt; der Kopf
   kann weit gedreht werden.
   ===================================================================== */
function faultier(T) {
  const W = werk(T);
  W.dichte = T.fein ? 1 : 0.9;
  const FELL = [["#3a3024", 0.09, 0.6], ["#5e5040", 0.09, 0.6], ["#82735e", 0.085, 0.6], ["#a4967e", 0.08, 0.6], ["#c4b89e", 0.075, 0.65], ["#e6dcc6", 0.07, 0.65]];
  const ALGE = [["#5a5e3a", 0.09, 0.55], ["#7a7d5c", 0.085, 0.55], ["#9a9a74", 0.08, 0.55]];
  /* Licht von oben: Bauchseite (oben, zum Ast) hell, Rücken (unten) dunkler */
  const licht = (x, y) => clamp(0.75 - (y + 70) / 40);
  const fFarbe = (x, y, z) => FELL[Math.round(clamp(licht(x, y) * 0.85 + (z - 0.5) * 0.5) * 5)][0];
  let s = "";
  /* weicher Bodenschatten unter dem hängenden Tier (Licht von oben) */
  s += W.weich([[74, 0, 34, 1.6, 0, "#000", 0.12]], 2);

  /* ---------- Baum: Stamm mit Rinde und Wurzelanlauf; Ast unregelmäßig mit Knoten, Rissen, Moos, abgebrochenem Ende ---------- */
  const stamm = [[129, 0, 1], [131.6, -4], [131, -20], [130, -60], [129.6, -100], [129.4, -122], [130.6, -126], [135.4, -128], [140, -125], [140, -100], [140.4, -60], [141.6, -20], [143.4, -5], [148, 0, 1]];
  const ast = [[1.6, -102.6], [3, -105], [6, -104.6], [14, -103.6], [24, -104.4], [34, -103.4], [44, -102.6], [56, -103.8], [64, -103.4], [76, -102.4], [88, -103], [100, -103.6], [112, -105.4], [124, -108], [131, -110],
    [131, -101], [124, -98.8], [112, -97.4], [100, -96.6], [88, -96.6], [76, -97.4], [66, -96.8], [58, -96], [50, -97.2], [40, -97.6], [28, -97.4], [16, -98.4], [8, -98.6], [3.4, -99.4], [1, -100.6]];
  const rinde = (pts, n, vert) => W.teil(pts, T.lg("fr" + n, [[0, "#a0907a"], [0.45, "#7a6a54"], [1, "#4a3e30"]], 0, 0, vert ? 1 : 0, vert ? 0 : 1),
    W.relief("rinde" + n, `<path d="${G(pts)}" fill="#000" fill-opacity=".001"/>` + (T.fein ? W.L(vert ? ["M132 -8q1 -30 0 -60", "M137.6 -30q-.6 -30 -.4 -60", "M134 -84q.4 -16 -.2 -32", "M131 -2q4 -2 8 0"] :
      ["M6 -101q14 1 26 0", "M40 -100q14 .6 24 -.6", "M70 -99q16 .6 30 0", "M104 -100q12 0 22 -3", "M20 -102.6q6 .4 12 0", "M80 -101.4q10 .4 20 0"], "#2e261c", 0.28, 0.55) : ""),
      { f: 0.9, f2: vert ? 0.6 : 0.12, tiefe: 0.6, okt: 2 }), { rand: 0 });
  s += W.vol("v", 3, rinde(stamm, "s", true));
  /* Blätter am Stamm oben */
  let blatt = "", rippe = "";
  for (const [x, y, w, L] of [[133, -124, 200, 15], [134, -125, 240, 14], [136, -126, 290, 14], [138, -124, 330, 13], [135, -122, 170, 12], [139, -122, 20, 12]]) { const b = euBlatt(x, y, w, L); blatt += G(b.pts); rippe += G(b.mid, false); W.box(b.pts); }
  s += `<path d="${kurz(blatt)}" fill="${T.lg("fbl", [[0, "#7aa070"], [1, "#4a6e44"]], 0, 0, 1, 1)}" stroke="#2e4a2a" stroke-opacity=".5" stroke-width=".2"/><path d="${kurz(rippe)}" fill="none" stroke="#d6e6c4" stroke-opacity=".6" stroke-width=".2"/>`;

  /* ---------- Glieder: lang, schräg (V-Stellung), zum Ast hin dünner; Fell hängt nach unten; Krallen umfassen den Ast ---------- */
  const glied = (fuss, ansatz, r0, r1, fern, n) => {
    const J = [[fuss[0], fuss[1], r0, r0], [(fuss[0] * 2 + ansatz[0]) / 3, (fuss[1] * 2 + ansatz[1]) / 3, r0 * 1.3, r0 * 1.3], [(fuss[0] + ansatz[0] * 2) / 3 + (fuss[0] < ansatz[0] ? -1 : 1), (fuss[1] + ansatz[1] * 2) / 3, r1 * 0.9, r1 * 0.9], [ansatz[0], ansatz[1], r1, r1]];
    const r = rohr(J);
    const b = W.teil(r.pts, fern ? "#4e4436" : T.lg("fg" + n, [[0, "#b0a48a"], [1, "#6a5c48"]], 0, 0, 1, 0),
      W.fell("fg" + n, 92, T.box(r.pts), { hell: "#efe6d0", dunkel: "#2a2218", ho: fern ? 0.2 : 0.4, do: 0.35, fx: 2.6, fy: 0.24, hk: "f" }) +
      W.haare(r.pts, fern ? 70 : 160, 92, 3, fern ? FELL.slice(0, 3) : FELL, { licht: (x, y) => licht(x, y) * (fern ? 0.6 : 1), buendel: 3, krumm: 0.45, szene: 0.08 }), { rand: 0 });
    return W.vol("v", r1 * 0.4, b + W.saum(r.H.concat(r.V.slice().reverse()), fern ? 30 : 70, 92, 3.4, fern ? FELL.slice(0, 3) : FELL, { licht: () => fern ? 0.3 : 0.55, krumm: 0.5, ein: 0.3, szene: 0.08 }));
  };
  /* Sichelkralle: Basis 1,2 cm, Spitze fein, horn-/elfenbeinfarben mit Glanzkante; umfasst den Ast, Spitze verschwindet dahinter */
  const krallen = (x, fern, n = 3, L = 1) => {
    let d = "", gl = "";
    for (let i = 0; i < n; i++) {
      const xx = x + i * 1.5 - 1.5, yy = -95.6 - i * 0.3;
      d += `M${f1(xx)} ${f1(yy)}c${f1(-0.4 * L)} ${f1(-3.6 * L)} ${f1(1.6 * L)} ${f1(-8 * L)} ${f1(5 * L)} ${f1(-8.6 * L)}c${f1(1.4 * L)} -.2 ${f1(2 * L)} .4 ${f1(2.2 * L)} 1.2c${f1(-1.4 * L)} -.6 ${f1(-2.6 * L)} -.2 ${f1(-3.6 * L)} .8c${f1(-1.8 * L)} ${f1(1.6 * L)} ${f1(-2.2 * L)} ${f1(4 * L)} ${f1(-2.4 * L)} ${f1(6.6 * L)}z`;
      gl += `M${f1(xx + 0.5)} ${f1(yy - 3.6 * L)}c.3 -2.2 1.4 -3.8 3.2 -4.4`;
    }
    return `<path d="${d}" fill="${fern ? "#6a5a48" : T.lg("fkr", [[0, "#d8c8a8"], [0.6, "#b8a888"], [1, "#6a5a48"]], 0, 0, 1, 1)}" stroke="#3a2e1e" stroke-opacity=".45" stroke-width=".12"/>` +
      (fern ? "" : `<path d="${gl}" fill="none" stroke="#fff6e0" stroke-opacity=".6" stroke-width=".22" stroke-linecap="round"/>`);
  };
  /* ferne Glieder (dunkler, schmaler, anderer Winkel) */
  s += glied([94, -96], [86, -64], 2.2, 4.4, true, "af") + glied([47, -96], [50, -66], 2, 4.2, true, "bf");
  s += W.vol("v", 1.6, rinde(ast, "a", false));
  /* Moos und Flechten auf dem Ast; Knoten */
  if (T.fein) s += W.haare([[20, -104.6], [30, -104.8], [30, -103], [20, -103]], 40, 270, 0.8, [["#5a6a3a", 0.08, 0.7], ["#7a8a4a", 0.08, 0.7]], { mix: 1, krumm: 0.5 }) +
    W.haare([[70, -103.6], [78, -103.8], [78, -102.4], [70, -102.4]], 26, 270, 0.7, [["#5a6a3a", 0.08, 0.7], ["#8a9a5a", 0.08, 0.7]], { mix: 1, krumm: 0.5 }) +
    `<ellipse cx="58" cy="-100" rx="2.2" ry="1.6" fill="#5a4a38"/><ellipse cx="57.6" cy="-100.4" rx="1.2" ry=".8" fill="#2e2418"/>`;
  s += krallen(93.4, true) + krallen(46.4, true, 3, 0.75);

  /* ---------- Körper: birnenförmig (zur Brust hin breiter), Rücken rund und durchhängend; Becken mit Stummelschwanz ---------- */
  const koerper = [[36, -64], [40, -70], [52, -72], [66, -73], [80, -74], [92, -72], [99, -66], [100, -58], [96, -50], [86, -43], [72, -40], [58, -41], [46, -44], [38, -50], [34, -57]];
  let ks = W.teil(koerper, T.lg("fk", [[0, "#a49478"], [0.5, "#86765e"], [1, "#5a4c3c"]]),
    W.fell("fk", 90, [32, -76, 101, -38], { hell: "#efe6d0", dunkel: "#2a2218", ho: 0.4, do: 0.35, fx: 2.4, fy: 0.22, hk: "f" }) +
    W.weich([[60, -46, 10, 3, 0, "#7a7d5c", 0.55], [80, -47, 7, 2.6, 0, "#7a7d5c", 0.45], [70, -71, 24, 2, 0, "#e6dcc6", 0.35]], 1.6) +
    W.haare(koerper, 360, (x, y) => 92 + (x - 66) * 0.25, 4.4, FELL, { licht, buendel: 3, krumm: 0.5, streu: 12, szene: 0.08 }) +
    W.haare([[50, -50], [70, -46], [88, -50], [80, -44], [60, -43]], 70, 92, 4, ALGE, { buendel: 2, krumm: 0.5, szene: 0.05 }),
  { rand: 0 });
  /* langer, unregelmäßiger, gewellter Haarsaum am Rücken (unten), helle Spitzen */
  ks += W.kantenStraehnen([[34, -57], [38, -50], [46, -44], [58, -41], [72, -40], [86, -43], [96, -50], [100, -58]], 170, (x) => 92 + (x - 66) * 0.3, 3, 12, 0.42,
    (x, y, z) => (z > 0.85 ? FELL[5][0] : z > 0.5 ? FELL[2][0] : z > 0.2 ? FELL[1][0] : ALGE[1][0]), { kante: 0, ein: 0.3, szene: 0.3 });
  ks += W.saum([[36, -64], [40, -70], [52, -72], [66, -73], [80, -74], [92, -72]], 50, 260, 1.4, FELL.slice(3), { licht: () => 0.9, krumm: 0.5, szene: 0.06 });
  /* Becken mit kurzem Schwanzstummel im Fell */
  ks += W.weich([[38, -58, 4, 6, 0, "#3a3024", 0.4]], 1) + W.kantenStraehnen([[34, -62], [33, -56]], 12, 165, 1.6, 3.4, 0.4, (x, y, z) => FELL[z > 0.5 ? 2 : 1][0], { kante: 0, szene: 0.3 });
  s += W.vol("v", 6, ks);

  /* ---------- nahe Glieder: Hinterbein (kürzer, schräg nach hinten), Arm (lang, schräg nach vorn) ---------- */
  s += glied([42, -96], [46, -66], 2.4, 5.4, false, "bn") + krallen(41.4, false, 3, 0.75);
  s += glied([100, -96], [90, -64], 2.4, 5, false, "an") + krallen(99.4, false);
  /* Schatten des Astes auf die Pfoten */
  s += W.weich([[42, -94, 3, 1, 0, "#1a1410", 0.4], [100, -94, 3, 1, 0, "#1a1410", 0.4]], 0.6);

  /* ---------- Hals (Fellfalten) und Kopf ---------- */
  s += W.vol("v", 3, W.teil([[93, -66], [99, -64], [101, -60], [100, -54], [96, -51], [93, -56]], "#6a5a46",
    W.haare([[93, -66], [99, -64], [101, -60], [100, -54], [96, -51], [93, -56]], 50, 100, 2.6, FELL, { licht, buendel: 2, krumm: 0.5, szene: 0.06 }) +
    W.L(["M96 -64q4 -1 7 1", "M96.6 -60q4 -.6 6.6 1.2"], "#2a2218", 0.3, 0.5), { rand: 0 }));
  s += faultierKopf(T, W, FELL, fFarbe);
  return W.fertig(s, 1, [94, -72, 118, -46], [136]);
}

/* Kopf: klein und rund, zum Betrachter gedreht; Fell um das Gesicht kurz und dicht; Maske aus kurzem hellem Haar (vom
   Nasenrücken nach außen), helle Stirn mit Wirbel, scharf abgegrenzter dunkler Augenstreifen vom Auge nach hinten unten,
   schokoladenbraune Kehle; kleine Augen mit Lidrand und hellem Ring; breite nackte dunkle Nase mit 2 Löchern;
   Mund als Hautfalte mit angehobenen Winkeln. */
function faultierKopf(T, W, FELL, fFarbe) {
  let s = "";
  const C = [106.4, -59.6];
  const kopf = [[97.4, -56], [97.6, -62.4], [100.4, -67.6], [106.4, -69.6], [112.4, -67.6], [115.4, -62.4], [115.4, -56], [112.4, -51], [106.4, -49.2], [100.4, -51]];
  let k = W.teil(kopf, T.rg("fkp", [[0, "#a49478"], [0.7, "#7a6a54"], [1, "#4e4232"]], 0.5, 0.45, 0.6),
    W.weich([[106.4, -50.6, 6.4, 2.4, 0, "#4a3220", 0.9]], 0.8) +
    W.haare(kopf, 170, (x, y) => Math.atan2(y - C[1], x - C[0]) / RAD, 1.6, FELL, { licht: (x, y) => clamp(0.8 - (y + 66) / 18), buendel: 2, krumm: 0.4, szene: 0.06 }), { rand: 0 });
  k += W.saum(kopf.concat([kopf[0]]), 70, (x, y) => Math.atan2(y - C[1], x - C[0]) / RAD + 15, 1.6, FELL, { licht: (x, y) => clamp(0.8 - (y + 66) / 18), krumm: 0.5, ein: 0.4, szene: 0.06 });
  /* Gesichtsmaske aus kurzem hellem Haar, Rand aufgelöst */
  const ges = [[101.4, -62.6], [104.4, -64.8], [108.4, -64.8], [111.4, -62.6], [111.6, -58.4], [109.6, -55], [106.4, -54], [103.2, -55], [101.2, -58.4]];
  k += W.weich([`<path d="${G(ges)}" fill="#ece2cc"/>`], 0.5) +
    W.haare(ges, 110, (x, y) => Math.atan2(y + 60, x - 106.4) / RAD, 0.6, FELL.slice(3), { licht: () => 0.85, gerade: true, szene: 0.05 }) +
    /* Stirn mit Haarwirbel */
    (T.fein ? W.haare([[104, -64.4], [109, -64.4], [108, -62.6], [105, -62.6]], 24, (x) => 250 + (x - 106.5) * 25, 0.7, FELL.slice(4), { gerade: true, szene: 0 }) : "");
  /* dunkle Augenstreifen: scharf, vom Auge nach hinten-unten auslaufend (≈ 1,5 × länger) */
  k += W.weich([`<path d="${G([[105.2, -61.4], [103.6, -62], [101.4, -61.4], [99.4, -59.8], [98.6, -57.6], [99.6, -57.2], [101.6, -58.4], [104, -59], [105.4, -60]])}" fill="#22180e"/>`,
    `<path d="${G([[107.6, -61.4], [109.2, -62], [111.4, -61.4], [113.4, -59.8], [114.2, -57.6], [113.2, -57.2], [111.2, -58.4], [108.8, -59], [107.4, -60]])}" fill="#22180e"/>`], 0.15);
  /* Augen: klein, dunkelbraun, Lidrand, kleiner Glanz, heller Ring */
  for (const [x, w] of [[103.6, 8], [109.2, -8]]) {
    k += `<ellipse cx="${x}" cy="-60.3" rx=".9" ry=".75" fill="#6a5a46" opacity=".8"/>`;
    k += W.auge2(x, -60.3, 0.55, { iris: "#3a2614", iris2: "#120a04", sklera: "#1a120c", offen: 0.9, winkel: w, lidDeck: 0.1, lid: "#1a120c", lidHell: "#8a7a62", glanz: 0.8, karunkel: "#4a3a32" });
  }
  /* Nase: breiter nackter dunkler Spiegel mit zwei Nasenlöchern; kurze Oberlippe; Mund als Hautfalte, Winkel angehoben */
  k += `<path d="${G([[105, -58.4], [106.4, -58.8], [107.8, -58.4], [108.2, -57], [107.2, -56.2], [106.4, -56.4], [105.6, -56.2], [104.6, -57]])}" fill="#241a12"/>` +
    `<path d="M105.4 -57.2q.5 -.5 1 0q-.5 .4 -1 0zM106.9 -57.2q.5 -.5 1 0q-.5 .4 -1 0z" fill="#000"/>` + W.L(["M105.4 -58.3q1 -.3 2 0"], "#a89a8a", 0.12, 0.6);
  k += W.falten(["M104.8 -55.4q.8 .5 1.6 .5q.8 0 1.6 -.5"], 0.09, "#3a2a1c", "#fff6e6", 0.55, 0.45);
  s += W.vol("v", 2.4, k);
  return s;
}

/* Mittellinie [x, y, rOben, rUnten] → Umriss (Schwanz, Glieder) */
function rohr(J) {
  const n = J.length, V = [], H = [];
  for (let i = 0; i < n; i++) {
    const a = J[Math.max(0, i - 1)], b = J[Math.min(n - 1, i + 1)];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, dx = (b[0] - a[0]) / l, dy = (b[1] - a[1]) / l;
    V.push([J[i][0] + dy * J[i][2], J[i][1] - dx * J[i][2]]);
    H.push([J[i][0] - dy * J[i][3], J[i][1] + dx * J[i][3]]);
  }
  return { V, H, pts: V.concat(H.slice().reverse()) };
}

/* =====================================================================
   KÄNGURU (Rotes Riesenkänguru, Männchen, Ruhestellung „Dreibein“)
   RECHERCHE (Australian Museum, San Diego Zoo, Fourth Crossing Wildlife): Männchen Kopf-Rumpf 0,94–1,4 m, Schwanz
   0,71–1,0 m, bis 85–92 kg; stehend ~1,5 m, auf den Zehen bis ~2 m. Männchen rotbraun (rostrot), Unterseite, Brust und
   Innenseiten der Glieder weißlich; Weibchen oft blaugrau. Kennzeichen der Art: schwarz-weiße Zeichnung an der Schnauze –
   schwarzer Fleck seitlich am Maul (Bartfeld) und breiter weißer Streifen vom Mundwinkel Richtung Ohr; helle Partie um
   die Nase, Nasenlöcher schwarz gerandet. Große, spitze, aufrechte Ohren (innen hell behaart), große dunkle Augen mit
   langen Wimpern. Kräftiger Rahmen: Männchen mit muskulösen Schultern und Unterarmen; kurze Arme mit fünf bekrallten
   Fingern (dunkle Haut, Krallen). Riesige Oberschenkel, langer Unterschenkel, sehr langer schmaler Hinterfuß, der in Ruhe
   ganz auf dem Boden liegt (Ferse/Sprunggelenk unten); 4. Zehe groß mit kräftiger Kralle, 5. Zehe außen kleiner, 2./3.
   Zehe verwachsen (Putzkrallen). Dicker, muskulöser Schwanz, an der Basis sehr kräftig, verjüngt sich; bildet in Ruhe
   mit den Hinterbeinen ein Dreibein und liegt hinten auf dem Boden. Fell kurz, dicht, wollig.
   ===================================================================== */
function kaenguru(T) {
  const W = werk(T);
  W.dichte = T.fein ? 0.94 : 1;
  const ROT = [["#4a2412", 0.11, 0.55], ["#7a3a1c", 0.11, 0.55], ["#a3552c", 0.1, 0.55], ["#c4773f", 0.1, 0.55], ["#dc9c64", 0.09, 0.6], ["#f0c99a", 0.09, 0.65]];
  const HELL = [["#8c7a66", 0.1, 0.5], ["#b4a28c", 0.1, 0.5], ["#d3c4ae", 0.09, 0.55], ["#ebdfcc", 0.09, 0.6], ["#fbf5ea", 0.08, 0.65]];
  const licht = (x, y) => clamp(0.3 + (-y - 60) / 150 - (x - 100) / 140);
  const rotG = (n, a, b, c) => T.lg("rg" + n, [[0, a], [0.55, b], [1, c]]);
  const kurzHaar = (pts, n, w, o = {}) => W.haare(pts, Math.round(n * 0.25), w, 1, ROT, Object.assign({ licht, gerade: true, buendel: 2, mix: 0.4, szene: 0.06 }, o));
  /* kurzes, dichtes Haar in Wuchsrichtung (drei Tonebenen) als Kachelmuster; Creme für Brust/Bauch */
  const RM = W.haarMuster("kr", 6, 4, 210, 0.9, [["#6a3418", 0.09, 0.6], ["#9a4c26", 0.09, 0.6], ["#c47a46", 0.085, 0.6], ["#e8a874", 0.08, 0.6]], 0.3);
  const CM = W.haarMuster("kc", 6, 4, 170, 0.9, [["#b4a28c", 0.08, 0.6], ["#d8c8b2", 0.08, 0.6], ["#f4ebdc", 0.075, 0.65]], 0.3);
  let s = "";

  /* ---------- ferner Hinterfuß ---------- */
  s += kFuss(W, T, 4, true);

  /* ---------- Schwanz: Wurzel sehr dick und muskulös (≈ 21 cm), gleichmäßig verjüngt; Unterseite heller ---------- */
  /* ein durchgehender, weicher Kontaktschatten unter dem aufliegenden Drittel */
  s += W.weich([[26, -0.2, 28, 1.1, 0, "#000", 0.3], [44, -0.4, 10, 1.2, 0, "#000", 0.2]], 0.8);
  const sw = rohr([[93, -74, 6.4, 6.4], [87, -60, 6, 5.8], [77, -41, 5.4, 5.2], [65, -23, 4.6, 4.4], [51, -10.4, 3.9, 3.7], [35, -4.8, 3.2, 3], [18, -3, 2.6, 2.4], [5, -2.3, 1.8, 1.7], [-0.4, -2.3, 1, 1]]);
  s += W.vol("v", 3, W.teil(sw.pts, T.lg("sw", [[0, "#c88050"], [0.5, "#b0663a"], [1, "#e6c8a4"]], 0, 0, 0.15, 1),
    W.musterFlaeche(sw.pts, RM(150)) +
    W.weich([[70, -34, 1.6, 12, -40, "#fff3e0", 0.3], [30, -0.8, 22, 1.2, 0, "#f4dcc0", 0.6]], 1.4) +
    kurzHaar(sw.pts, 260, (x, y) => (x > 62 ? 122 : 184), { licht: (x, y) => clamp(0.6 - (y + 4) / 50 - (x > 62 ? 0.1 : 0)) }), { rand: 0 }) +
    W.saum(sw.V.slice(1), 70, (x, y) => (x > 60 ? 128 : 184), 0.6, ROT, { licht: () => 0.65, gerade: true, szene: 0.08 }));

  /* ---------- ferner Arm ---------- */
  s += kArm(W, T, 5, true, ROT);

  /* ---------- Rumpf: Rückenlinie läuft in EINEM Bogen über die Kruppe in die Schwanzoberseite; Lende dick ---------- */
  const rumpf = [[117, -147], [111, -138], [104, -128], [96.6, -115], [90.4, -100], [86, -86], [83.4, -76], [82.4, -66], [85, -58], [92, -56], [114, -62], [125, -68], [130.6, -76], [133.6, -88],
    [136, -102], [135.6, -115], [133.4, -126], [132.6, -136], [130.6, -144], [124, -150]].map(([x, y]) => [x + (y < -80 && y > -140 && x > 128 ? Math.sin((-y - 80) / 60 * Math.PI) * 1.6 : 0), y]);
  const brust = [[129, -146], [132.6, -136], [134.4, -126], [137, -115], [137.6, -102], [134.6, -88], [130.6, -76], [125, -68], [121.6, -72], [124, -86], [125.6, -102], [125, -118], [125.4, -134], [125.6, -144]];
  /* Rumpf und nahes Hinterbein bilden EINE Masse (gemeinsamer Verlauf, gemeinsames Volumen): keine Naht am Oberschenkel */
  const KF = T.lg("kfell", [[0, "#c47040"], [0.55, "#b2643a"], [1, "#8c4b27"]], 0, -150, 0, -20, UB);
  let masse = W.teil(rumpf, KF,
    W.musterFlaeche(rumpf, RM(112)) +
    W.weich([`<path d="${G(brust)}" fill="#ece1cf"/>`, [131.4, -96, 2, 14, 0, "#fff6ea", 0.4], [100, -128, 8, 22, -30, "#f2b880", 0.3], [110, -62, 16, 4, -10, "#3a1a0a", 0.35]], 2) +
    (T.fein ? `<g mask="url(#${W.maskeForm("kbr", brust, 1)})">${W.musterFlaeche(brust, CM(96))}</g>` : "") +
    kurzHaar(rumpf, 420, (x, y) => (x > 124 ? 92 : y < -118 ? 118 : 112)) +
    W.haare(brust, 40, 92, 1, HELL, { licht: (x, y) => clamp(0.85 - (x - 126) / 18), gerade: true, buendel: 2, szene: 0.06 }),
  { rand: 0 });
  let rand = W.saum([[82.4, -74], [86, -86], [90.4, -100], [96.6, -115], [104, -128], [111, -138], [117, -147]], 60, (x, y) => (y < -120 ? 112 : 128), 0.9, ROT, { licht: () => 0.75, gerade: true, szene: 0.08 }) +
    W.saum([[132.6, -136], [133.4, -126], [135.6, -115], [136, -102], [133.6, -88]], 40, 70, 0.9, HELL, { licht: () => 0.7, gerade: true, szene: 0.08 });

  /* ---------- nahes Hinterbein: birnenförmiger Oberschenkel (oben hinten weich im Becken), Knie als stumpfe Ecke
     vorn, schlanker Unterschenkel, spitze Ferse ---------- */
  const fussN = kFuss(W, T, 0, false);
  const bein = [[94, -84], [106, -87], [116, -85], [123.6, -78.4], [128.4, -68], [130, -57], [128.4, -48.4], [124.4, -42.6], [119.4, -36.4], [114, -28], [109.6, -20.4], [105.6, -13.6],
    [100, -11.4], [96.6, -11.8], [93.6, -14.6], [96.4, -19], [100.6, -27], [104.2, -35.6], [106.4, -41.4], [99.6, -46], [91.4, -50.4], [85, -56], [82.6, -64], [85, -75]];
  masse += W.teil(bein, KF,
    W.musterFlaeche(bein, RM(108)) +
    /* Birnenform des Oberschenkels nur als weiche Formschatten: Muskelzug Hüfte → Knie, Kniekante, Kniekehle */
    W.weich([`<path d="M90 -82q16 -8 32 0q8 6 7 22" fill="none" stroke="#3a1a0a" stroke-opacity=".22" stroke-width="2.4"/>`, [106, -85, 12, 2.4, -6, "#f8c890", 0.35], [114, -66, 3, 16, 50, "#3a1a0a", 0.25], [100, -70, 8, 12, -30, "#3a1a0a", 0.15], [126.6, -56, 2.4, 9, 4, "#fff0dc", 0.4], [106, -45, 5, 2, -30, "#3a1a0a", 0.5], [112.6, -30, 2, 10, 36, "#f6cc98", 0.45],
      [102.6, -27, 1.6, 9, 32, "#3a1a0a", 0.4]], 1.8) +
    W.L([G([[101.6, -32], [98.4, -22], [96.8, -15]], false)], "#fff0dc", 0.7, 0.35) +
    kurzHaar(bein, 340, (x, y) => (y < -50 ? 100 + (x - 100) * 0.8 : 66), { licht: (x, y) => clamp(licht(x, y) + 0.2) }),
  { rand: 0, vol: false });
  rand += W.saum([[85, -56], [91.4, -50.4], [99.6, -46]], 18, 108, 0.9, ROT, { licht: () => 0.45, gerade: true, szene: 0.08 }) +
    W.saum([[123.6, -78.4], [128.4, -68], [130, -57], [128.4, -48.4]], 24, 40, 0.8, ROT, { licht: () => 0.7, gerade: true, szene: 0.08 });
  s += fussN + W.vol("v", 9, masse + rand);

  /* ---------- naher Arm ---------- */
  s += kArm(W, T, 0, false, ROT);

  /* ---------- Kopf ---------- */
  s += kKopf(W, T, ROT, HELL);
  return W.fertig(s, 1, [112, -181, 158, -136], [104, 114, 126]);
}

/* Hinterfuß (Ruhestellung): lang, schmal, ganz am Boden; große 4. Zehe mit gebogener Kralle (≈ 7 cm), kleinere 5.,
   schmale Doppelzehe 2+3 innen; Fußrücken kurz behaart, Sohle dunkel. dx = Versatz, fern = Schattenseite */
function kFuss(W, T, dx, fern) {
  const P = (x, y) => [x + dx, y];
  let s = "";
  const fuss = [P(96, -14.6), P(93.6, -11), P(93.2, -5), P(95.4, -1), P(100, 0, 1), P(124, 0, 1), P(129.4, -0.8), P(131.6, -2.8), P(130.4, -5.2), P(125.6, -6.2), P(117, -7.4), P(110, -9.2), P(104, -12.4)];
  s += W.vol("v", 1.6, W.teil(fuss, fern ? "#9e7a58" : T.lg("kf", [[0, "#e6caa6"], [0.6, "#cba582"], [1, "#8c6a4c"]]),
    W.weich([[111, -8.4, 14, 1.8, -6, "#fff6e8", fern ? 0.1 : 0.45], [127, -3.6, 3, 1.6, 0, "#3a2414", 0.4]], 1) +
    W.haare(fuss, fern ? 50 : 160, 178, 0.8, [["#7a5636", 0.08, 0.55], ["#a8805a", 0.08, 0.55], ["#d8b994", 0.07, 0.6], ["#f6e6cc", 0.07, 0.65]], { licht: (x, y) => clamp(0.85 + (y + 4) / 10) * (fern ? 0.5 : 1), gerade: true, szene: 0.06 }),
  { rand: 0, vol: false }));
  /* dunkle Sohle (Ballen) */
  s += `<path d="${G([P(94.4, -2.2), P(97.4, -0.4), P(105, 0, 1), P(126, 0, 1), P(129.8, -0.8), P(126, -1.4), P(110, -1.8), P(99, -2.4)])}" fill="${fern ? "#2a1a10" : "#3a2616"}"/>`;
  /* Doppelzehe 2+3 (innen, schmal) als feine Rinne; 5. Zehe kleiner; 4. Zehe groß mit Kralle (Glanz, helle Spitze) */
  const kralle = (x, y, l, h, c) => `<path d="M${f1(x + dx)} ${f1(y - h * 0.5)}q${f1(l * 0.6)} ${f1(-h * 0.3)} ${f1(l)} ${f1(h * 0.85)}q${f1(-l * 0.4)} ${f1(-h * 0.25)} ${f1(-l * 0.9)} ${f1(h * 0.1)}z" fill="${c}"/>`;
  if (!fern) s += W.falten([`M${f1(115 + dx)} -6.6q5 .4 9.6 2.4`], 0.12, "#5a3a22", "#fff0dc", 0.6, 0.35) + kralle(124.6, -1.8, 4, 2.2, "#3a2e24");
  s += kralle(129.4, -3, 7, 3.4, fern ? "#2a221c" : T.lg("kkr", [[0, "#1e1610"], [0.7, "#4a3c2e"], [1, "#a89480"]], 0, 0, 1, 0));
  if (!fern) s += `<path d="M${f1(130.2 + dx)} ${f1(-4.4)}q2.6 -.6 4.8 1.4" fill="none" stroke="#d8cab8" stroke-opacity=".55" stroke-width=".2"/>` +
    /* schmale Doppelzehe 2+3 innen (verwachsen, zwei winzige Krallen) */
    W.L([`M${f1(114 + dx)} -7.6q7 .6 13.4 1.8`, `M${f1(114.4 + dx)} -6.9q7 .6 13 1.7`], "#6a4a30", 0.12, 0.6) +
    `<path d="M${f1(127.4 + dx)} -6q1.2 .2 1.4 1.2q-.6 -.4 -1.4 -.6zM${f1(127.2 + dx)} -5.3q1.1 .3 1.2 1.2q-.5 -.4 -1.2 -.5z" fill="#3a2e24"/>` +
    /* Übergang Bein → Fuß über Haare */
    W.saum([P(95, -14.4), P(100, -13.4), P(104, -12.4), P(110, -9.6)], 40, 25, 1.4, [["#8c4b27", 0.08, 0.6], ["#b2643a", 0.08, 0.6], ["#d8a070", 0.07, 0.6]], { mix: 1, gerade: true, ein: 0.5, szene: 0.05 });
  return s;
}

/* Arm (Männchen: muskulöse Unterarme mit Spindel), Schulterkugel, Schlagschatten auf die Brust; Hand mit Knick im
   Handgelenk, 5 Fingern (2–4 am längsten), gebogenen hornfarbenen Krallen mit heller Spitze */
function kArm(W, T, dx, fern, ROT) {
  const P = (x, y) => [x + dx, y];
  let s = "";
  /* Schlagschatten des Arms auf die Brust (nur nah) */
  if (!fern) s += W.weich([[129, -108, 3, 14, -30, "#3a1a0a", 0.35]], 1.6);
  const arm = [P(116, -134), P(124.6, -135), P(130, -129), P(132.4, -121), P(134.4, -114), P(140, -108.6), P(144.2, -101.4), P(144.8, -95.4), P(141.4, -92.4), P(136, -94.4), P(129.4, -99),
    P(124.6, -106), P(120.4, -112), P(116.6, -120), P(114.6, -127)];
  s += W.vol("v", 2.6, W.teil(arm, fern ? "#94532d" : T.lg("ka", [[0, "#d48e58"], [0.5, "#bc7442"], [1, "#9a5a32"]], 0, 0, 1, 0.4),
    W.musterFlaeche(arm, W.haarMuster("kr", 6, 4, 210, 0.9, [["#6a3418", 0.09, 0.6], ["#9a4c26", 0.09, 0.6], ["#c47a46", 0.085, 0.6], ["#e8a874", 0.08, 0.6]], 0.3)((arm[0][0] > 0 ? 110 : 110)), fern ? 0.5 : 1) +
    W.weich(fern ? [[128, -112, 10, 16, 0, "#2a1406", 0.4]] : [[121, -132, 6, 2.4, -20, "#fad4a4", 0.55], [124, -122, 5, 5, -20, "#3a1a0a", 0.2], [138, -106, 2, 5, -40, "#fad4a4", 0.35], [131, -102, 2.4, 6, -40, "#3a1a0a", 0.35]], 1.4) +
    W.haare(arm, fern ? 20 : 50, (x, y) => (y < -114 ? 104 : 50), 0.9, ROT, { licht: (x, y) => clamp(0.35 + (-y - 95) / 45 - (x - 120) / 45) * (fern ? 0.6 : 1), gerade: true, buendel: 2, szene: 0.06 }),
  { rand: 0, vol: !fern }) +
    W.saum([P(114.6, -127), P(116.6, -120), P(120.4, -112), P(124.6, -106), P(130.4, -100)], fern ? 0 : 20, 120, 0.8, ROT, { licht: () => 0.5, gerade: true, szene: 0.05 }));
  /* Hand: Knick im Handgelenk nach unten, Handrücken behaart, Handfläche nackt und dunkel; 5 Finger (2–4 am längsten),
     leicht gekrümmt, locker vor der Brust; Krallen nur an den Fingerenden, dunkel hornfarben mit heller Spitze, verschieden lang */
  const H = fern ? "#1e1612" : "#2c211b";
  s += W.teil([P(138.4, -93.6), P(141.4, -89), P(144.6, -88), P(141, -87.4), P(138, -90)], H, "", { rand: 0, vol: false });
  s += W.teil([P(139.6, -96.6), P(143.6, -97.4), P(146.6, -94.4), P(147.6, -90.4), P(146, -88), P(142.6, -88.6), P(140.6, -90.8), P(139.2, -93.6)], fern ? "#7a4424" : T.lg("kp", [[0, "#d08a56"], [1, "#8a4e2a"]]),
    W.haare([P(139.6, -96.6), P(143.6, -97.4), P(146.6, -94.4), P(147, -90.6), P(142.6, -90.6)], fern ? 0 : 30, 62, 0.7, ROT, { licht: () => 0.55, gerade: true, szene: 0 }), { rand: 0, vol: !fern });
  const F = [[140.4, -89.6, 1.7, 1.1, 0.9], [142, -89, 2.6, 1.25, 1.3], [143.6, -88.6, 2.9, 1.3, 1.5], [145.2, -88.8, 2.7, 1.25, 1.2], [146.6, -89.6, 1.9, 1.05, 0.9]];
  for (const [x, y, L, w, kl] of F) {
    const ex = x + 0.7, ey = y + L;
    s += W.glied([P(x, y), P(x + 0.9, y + L * 0.5), P(ex, ey)], w, H, fern ? "" : "#8a766a", { la: 0.35 });
    const cx = ex + dx;
    s += `<path d="M${f1(cx - w * 0.4)} ${f1(ey)}q${f1(-0.1)} ${f1(kl * 0.6)} ${f1(-kl * 0.5)} ${f1(kl)}q${f1(kl * 0.25)} ${f1(-kl * 0.45)} ${f1(kl * 0.9)} ${f1(-kl * 0.9)}z" fill="${fern ? "#1a120c" : T.lg("kkl", [[0, "#2a1e16"], [0.6, "#5a4a3a"], [1, "#d8c8b0"]], 0, 0, 0, 1)}"/>`;
  }
  return s;
}

/* Kopf: tiefe, eher kastenförmige Schnauze (Profil Stirn–Nase fast gerade wie beim Hirsch), breiter, matter
   Nasenspiegel mit Haar in der Mitte, kommaförmige Nasenlöcher, Oberlippe mit Mittelfurche; schwarzer Fleck seitlich
   über dem Mundwinkel, schmaler weißer Streifen vom Mundwinkel schräg zur Wange, helles Kinn; großes dunkles Auge mit
   weichem Glanz und gebogenen Wimpern; große Ohren mit breiter Basis, trichterförmig, weißes Büschel am Innenrand. */
function kKopf(W, T, ROT, HELL) {
  let s = "";
  /* fernes Ohr: dunkler, leicht gedreht, teilweise verdeckt */
  const ohrF = [[125.4, -155.6], [124.4, -163], [125, -171], [127.8, -177], [130.8, -170.6], [132.4, -163], [131.8, -156.6]];
  s += W.teil(ohrF, "#7a4628", W.weich([[128.8, -166, 1.8, 7, 4, "#2a1406", 0.55]], 0.8) + W.haare(ohrF, 40, 270, 0.9, ROT.slice(0, 4), { licht: () => 0.3, gerade: true, szene: 0.05 }), { rand: 0 });
  const kopf = [[116.6, -147], [118.6, -154], [123, -158.4], [129, -159.8], [135, -158.8], [141, -156.4], [147, -153.4], [151.6, -151], [154.6, -149.4], [156.4, -147], [156.6, -142.6], [155, -140.4],
    [153.4, -138.6], [150, -137.2], [144, -136.8], [138, -136.6], [131.6, -138.6], [125.6, -140.6], [120.6, -143]];
  let k = W.teil(kopf, T.lg("kk", [[0, "#b87a4c"], [0.5, "#a4653c"], [1, "#d8c0a0"]]),
    W.fell("kk", 168, [116, -161, 156, -137], { hell: "#f2cc9c", dunkel: "#4a220e", ho: 0.3, do: 0.3, fx: 4.4, fy: 0.7, hk: "k" }) +
    W.weich([
      `<path d="${G([[131, -158.2], [141, -155.6], [149.4, -151.4], [153.4, -148.8], [148, -148.6], [139, -152], [132, -154.6]])}" fill="#8a7464" opacity=".5"/>`,
      [138, -151, 4, 3.4, 0, "#2a1406", 0.3], [127, -151, 8, 5, 0, "#f2c48e", 0.4], [137, -142.4, 10, 2.2, 0, "#3a1a0a", 0.2],
    ], 0.7) +
    /* schwarzer Fleck seitlich über dem Mundwinkel (klar umrissen) */
    W.weich([`<path d="${G([[145.6, -144.8], [148.8, -145.2], [150.6, -144.2], [148.8, -143.4], [145.8, -143.4]])}" fill="#181210"/>`], 0.22) +
    /* schmaler weißer Streifen vom Mundwinkel schräg nach hinten oben zur Wange; helles Kinn */
    W.weich([`<path d="${G([[143.6, -141.8], [140, -142.8], [135.4, -144.6], [131.6, -146], [132.4, -144.6], [136, -142.6], [140.4, -141], [144, -140.6]])}" fill="#f6f1e8"/>`,
      `<path d="${G([[124, -141.6], [134, -140], [146, -139.4], [151, -139.4], [146, -138.4], [134, -138], [124, -139.6]])}" fill="#ece3d4"/>`], 0.25) +
    W.haare(kopf, 260, (x, y) => (x < 128 ? 140 : 182 + (y + 148) * 2), 0.65, ROT, { licht: (x, y) => clamp(0.65 - (y + 152) / 14), gerade: true, mix: 0.3, szene: 0.05 }) +
    W.haare([[145, -145.4], [148.8, -145.8], [151, -144.2], [148.8, -142.8], [145, -143]], 26, 172, 0.5, [["#000", 0.06, 0.6], ["#4a3a32", 0.06, 0.5]], { gerade: true, szene: 0.03 }) +
    W.haare([[143.6, -141.8], [135.4, -144.6], [131.6, -146], [136, -142.6], [144, -140.6]], 30, 190, 0.5, HELL.slice(2), { licht: () => 0.9, gerade: true, szene: 0.03 }),
  { rand: 0 });
  /* Nasenspiegel: breit, schwarzgrau, matt, Mitte behaart; Nasenloch kommaförmig seitlich; Oberlippe mit Mittelfurche */
  k += `<path d="${G([[150.4, -151.2], [154.6, -150.2], [156.8, -147.4], [157, -144], [155.4, -142.6], [152.4, -143.4], [150.2, -146.8]])}" fill="#3a3432"/>` +
    (T.fein ? W.haare([[152.2, -150.4], [155.4, -149.4], [155.6, -146], [152.6, -146.4]], 24, 200, 0.45, [["#8a6a54", 0.045, 0.6], ["#b08a6a", 0.045, 0.6]], { gerade: true }) : "") +
    `<path d="M155.6 -146.2q1.2 .5 1.1 1.8q-.5 .5 -1.2 .2q.6 -.9 .1 -2z" fill="#0a0606"/>` + W.L(["M151.4 -150.6q2 -.1 3.6 1.2"], "#8a8280", 0.12, 0.4);
  k += W.L(["M156 -142.4q-.4 1.2 -1.2 1.8"], "#2a1a14", 0.14, 0.7);
  k += W.L(["M154.8 -140.6q-2 .8 -4 .6q-1.6 .3 -2.8 1.1"], "#1a1210", 0.28, 0.9);
  if (T.fein) k += T.schnurrhaare(149.4, -144, 6, 6, 20, 50, "#1a1210", 0.1);
  /* Auge: groß, rund-mandelförmig, dunkelbraun, weicher großer Glanz, dunkler Lidrand, lange gebogene Wimpern; Fell um das
     Auge etwas heller */
  k += W.weich([[138.6, -151.2, 3.4, 2.4, 0, "#e8b884", 0.5], [138.4, -154.2, 3.6, 1.4, -8, "#3a1a0a", 0.4]], 0.6);
  k += W.auge2(138.4, -151.4, 2.35, { iris: "#3a2214", iris2: "#120a06", sklera: "#2a1a10", offen: 0.86, winkel: -6, lidDeck: 0.12, lid: "#2a1a10", lidHell: "#c08a5a",
    glanz: 0.85, karunkel: "#5a3a34", wimpern: 10, wimpernLaenge: 0.5, wimpernFarbe: "#140c08" });
  s += W.vol("v", 3, k);
  /* nahes Ohr: Basis breit, trichterförmig, innen Schatten, weißes Büschel am Innenrand */
  const ohr = [[117.4, -153.4], [116.4, -161], [117.6, -169.6], [120.6, -178.2], [125.8, -170.6], [129.4, -162], [129.4, -154.6]];
  const ohrIn = [[120, -157], [119.6, -164], [120.6, -171.4], [121.8, -175.4], [124.2, -169.6], [125.6, -162], [125, -156.6]];
  s += W.vol("v", 1.2, W.teil(ohr, T.lg("ko", [[0, "#7a5038"], [1, "#b5774a"]], 0, 0, 1, 0),
    `<path d="${G(ohrIn)}" fill="${T.lg("koi", [[0, "#5a3a2a"], [0.55, "#8a6a58"], [1, "#c8b09c"]], 1, 0, 0, 0)}"/>` + W.weich([[121.6, -166, 1.3, 7, 0, "#2a160c", 0.6]], 0.6) +
    W.haare([[123.2, -160], [124.6, -168], [125.4, -162], [125, -157]], 50, (x, y) => 250 + (x - 123) * 12, 2.4, HELL.slice(2), { licht: () => 0.9, gerade: true, szene: 0.05 }) +
    W.haare(ohr, 40, 262, 0.7, ROT, { licht: () => 0.45, gerade: true, szene: 0.05 }), { rand: 0 }) +
    W.saum([[120.2, -170], [121, -176.6], [123.8, -173], [126, -166]], 22, 300, 1.2, HELL, { licht: () => 0.85, gerade: true, szene: 0.05 }));
  /* Hinterkopf/Kehle gehen mit Haarsaum in den Hals über */
  s += W.saum([[118.6, -154], [116.6, -147], [120.6, -143], [125.6, -140.6], [131.6, -138.8]], 50, (x, y) => (y < -146 ? 150 : 115), 1.2, ROT, { licht: (x, y) => clamp(0.6 - (y + 140) / 30), ein: 0.55, gerade: true, szene: 0.05 });
  return s;
}

module.exports = [
  { id: "gorilla", de: "der Gorilla", syl: "Go-RIL-la", it: "il gorilla", itSyl: "go-RIL-la", en: "gorilla",
    gruppe: "Exoten", lebensraum: "Regenwald", laenge: 1.42, hoehe: 1.35, zeichne: gorilla },
  { id: "schimpanse", de: "der Schimpanse", syl: "Schim-PAN-se", it: "lo scimpanzé", itSyl: "scim-pan-ZÈ", en: "chimpanzee",
    gruppe: "Exoten", lebensraum: "Regenwald", laenge: 1.0, hoehe: 0.98, zeichne: schimpanse },
  { id: "orang_utan", de: "der Orang-Utan", syl: "O-rang-U-tan", it: "l'orango", itSyl: "o-RAN-go", en: "orangutan",
    gruppe: "Exoten", lebensraum: "Regenwald", laenge: 1.3, hoehe: 1.17, zeichne: orangUtan },
  { id: "pavian", de: "der Pavian", syl: "PA-vi-an", it: "il babbuino", itSyl: "bab-bu-I-no", en: "baboon",
    gruppe: "Exoten", lebensraum: "Savanne", laenge: 1.32, hoehe: 0.82, zeichne: pavian },
  { id: "katta", de: "der Katta", syl: "KAT-ta", it: "il lemure catta", itSyl: "LE-mu-re CAT-ta", en: "ring-tailed lemur",
    gruppe: "Exoten", lebensraum: "Madagaskar", laenge: 0.72, hoehe: 0.75, zeichne: katta },
  { id: "koala", de: "der Koala", syl: "Ko-A-la", it: "il koala", itSyl: "ko-A-la", en: "koala",
    gruppe: "Exoten", lebensraum: "Eukalyptuswald", laenge: 0.8, hoehe: 1.82, zeichne: koala },
  { id: "faultier", de: "das Faultier", syl: "FAUL-tier", it: "il bradipo", itSyl: "BRA-di-po", en: "sloth",
    gruppe: "Exoten", lebensraum: "Regenwald", laenge: 1.51, hoehe: 1.4, zeichne: faultier },
  { id: "kaenguru", de: "das Känguru", syl: "KÄN-gu-ru", it: "il canguro", itSyl: "can-GU-ro", en: "kangaroo",
    gruppe: "Exoten", lebensraum: "Outback", laenge: 1.57, hoehe: 1.8, zeichne: kaenguru },
];
