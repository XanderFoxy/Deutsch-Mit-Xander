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
  const W = { B: [] };
  let nr = 0;
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
  W.falten = (zuege, w, dunkel = "#000", hell = "#9a948e", od = 0.7, oh = 0.4) => T.fein ?
    `<path d="${zuege.join("")}" fill="none" stroke="${dunkel}" stroke-opacity="${od}" stroke-width="${w}" stroke-linecap="round"/>` +
    `<path d="${zuege.join("")}" fill="none" stroke="${hell}" stroke-opacity="${oh}" stroke-width="${f1(w * 0.7) || 0.1}" stroke-linecap="round" transform="translate(${f1(-w * 0.3)} ${f1(-w * 0.9)})"/>` : "";
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
  W.dichte = T.fein ? 0.35 : 0.7;
  const STR = ["#0a0909", "#151413", "#21201e", "#302e2c", "#45433f"];
  const SILBER = [["#4a4744", 0.12, 0.55], ["#6e6a65", 0.12, 0.55], ["#8e8a84", 0.11, 0.55], ["#aeaaa4", 0.1, 0.6], ["#cac6c0", 0.1, 0.6], ["#e2dfda", 0.09, 0.65]];
  const GLANZ = [["#5a5a60", 0.09, 0.5], ["#7a7a82", 0.08, 0.5]];
  const SCHW = [["#000", 0.15, 0.6], ["#161517", 0.15, 0.55], ["#323136", 0.14, 0.55], ["#55555c", 0.13, 0.55], ["#80808a", 0.12, 0.55]];
  const wahl = (x, y) => 0.3 + licht(x, y) * 0.7;
  const glanzFell = (n, w, box) => W.fell(n, w, box, { hell: "#8a8a94", dunkel: null, ho: 0.32, fx: 2.2, fy: 0.16, hk: "g" });
  const KAPPE = ["#2a170c", "#402414", "#56321c", "#6c4228"];
  const HAUT = "#2a2624";
  /* EIN Licht oben links (vorn): 0 = Kernschatten … 1 = Licht */
  const licht = (x, y) => clamp(0.15 + (-y - 45) / 95 - (x - 40) / 500);
  const fF = (x, y, z) => STR[Math.round(clamp(licht(x, y) * 0.95 + (z - 0.5) * 0.45) * 4)];
  const fellG = (n, y0, y1, a, b, c) => T.lg("fg" + n, [[0, a], [0.5, b], [1, c]]);
  const rumpfW = (x, y) => (x > 74 ? 160 - clamp((x - 74) / 40) * 60 : 186 - clamp((y + 116) / 55) * 40);
  let s = "";

  /* ---------- ferne Glieder: im Körperton, ~30 % dunkler, Form und Fell sichtbar ---------- */
  s += gorillaFuss(W, T, -21, true);
  const beinF = [[14, -80], [26, -68], [30, -56], [28, -44], [22, -34], [17, -24], [15, -16], [10, -12], [2, -12], [-2, -20], [-3, -32], [-1, -44], [2, -56], [6, -68]];
  s += W.vol("bf", 3, W.teil(beinF, fellG("bf", 0, 0, "#1f1d1c", "#141312", "#0b0a0a"),
    glanzFell("bf", 100, [-6, -80, 31, -8]) + W.haare(beinF, 90, (x, y) => (y < -50 ? 112 : 98), 3, SCHW, { licht: (x, y) => clamp(licht(x, y) * 0.6 + 0.12), buendel: 4, krumm: 0.3, szene: 0.08 }), { rand: 0 }) +
    W.kantenStraehnen([[-3, -34], [-2, -20], [2, -12], [10, -12]], 16, 96, 1.6, 3.2, 0.44, () => STR[1], { szene: 0.2 }), { tiefe: 3, umgebung: 0.5 });
  s += knoechelhand(W, T, 118.6, true);
  const armF = [[94, -106], [108, -104], [115, -92], [117, -76], [120, -60], [123, -46], [125.4, -32], [126, -19.4], [111.4, -19.4], [108, -30], [104, -46], [100, -62], [96, -84]];
  s += W.vol("af", 3.4, W.teil(armF, fellG("af", 0, 0, "#211f1e", "#151413", "#0b0a0a"),
    glanzFell("af", 98, [92, -106, 127, -18]) + W.haare(armF, 130, 98, 4.4, SCHW, { licht: (x, y) => licht(x, y) * 0.6 + (x > 114 ? 0.12 : 0), wahl, buendel: 4, krumm: 0.3, szene: 0.08 }), { rand: 0 }) +
    W.kantenStraehnen([[96, -84], [100, -62], [104, -46], [108, -30], [111.4, -19.4]], 30, 104, 2.4, 5, 0.55, () => STR[1], { szene: 0.2 }) +
    W.kantenStraehnen([[126.4, -21], [118.6, -20.4], [111, -20]], 26, 92, 2, 3.6, 0.44, () => STR[2], { szene: 0.2 }), { tiefe: 3, umgebung: 0.5 });

  /* ---------- Rumpf mit Silbersattel ---------- */
  const rumpf = [[1, -78], [3, -90], [12, -99], [26, -106], [42, -114], [58, -122], [72, -129], [84, -133.5], [96, -133], [104, -129], [110, -121], [116, -108], [117, -96], [114, -84],
    [108, -72], [98, -60], [84, -52], [68, -48], [52, -49], [38, -53], [26, -58], [14, -62], [6, -68]];
  const sattelOben = [[-2, -80], [2, -91], [12, -100], [26, -107], [42, -115], [56, -122], [66, -126.6]];
  const sattelUnten = [[66, -126.6], [65.4, -114], [62, -100], [54, -87], [43, -77], [30, -71], [16, -70], [3, -74]];
  const sattel = sattelOben.concat(sattelUnten.slice(1));
  const schwarzFeld = [[66, -127], [84, -133.5], [96, -133], [104, -129], [110, -121], [116, -108], [117, -96], [114, -84], [108, -72], [98, -60], [84, -52], [68, -48], [52, -49], [38, -53],
    [26, -58], [14, -62], [6, -68], [16, -72], [30, -72], [44, -78], [56, -88], [64, -102], [67, -116]];
  const satId = T.id("sattel"); T.def(`<path id="${satId}" d="${G(sattel)}"/>`);
  const satG = T.lg("sat", [[0, "#c2beb8"], [0.4, "#a6a29c"], [1, "#6e6a66"]], 0, -126, 0, -70, UB);
  const satLicht = (x, y) => clamp(0.35 + (-y - 80) / 40 - Math.max(0, x - 50) / 50);
  /* gemeliertes Grenzband: Silberhaare ins Schwarz, schwarze ins Silber */
  const band = sattelUnten.map(([x, y]) => [x - 2.6, y + 4.4]).concat(sattelUnten.slice().reverse().map(([x, y]) => [x + 2.6, y - 4.4]));
  let rs = W.teil(rumpf, fellG("rf", 0, 0, "#2a2826", "#181716", "#0a0909"),
    /* Formschatten: Trapezbuckel hell, Kernschatten-Band unten, Okklusion an Arm/Bein, warmes Bodenlicht am Bauch */
    W.weich([[82, -129, 16, 4.4, -6, "#6e7076", 0.55], [104, -68, 10, 12, 0, "#000", 0.5], [66, -50.6, 30, 1.8, 2, "#5a4e44", 0.45]], 3.6) +
    W.weich([`<use href="#${satId}" fill="${satG}"/>`], 2.6) +
    W.fell("sat", 172, [-2, -128, 70, -68], { hell: "#f6f4f0", dunkel: "#4a4744", ho: 0.35, do: 0.45, fx: 3.6, fy: 0.7, hk: "s", licht: false }) +
    W.weich([[30, -76, 26, 4, -10, "#2a2826", 0.35]], 3) +
    glanzFell("rf", 120, [40, -135, 117, -46]) + W.haare(schwarzFeld, 230, (x, y) => (x > 76 ? 120 + (y + 90) * 0.4 : 96), 4, SCHW, { licht, wahl, buendel: 4, krumm: 0.3, szene: 0.08 }) +
    W.haare(sattel, 360, rumpfW, 1.4, SILBER.map(([c, w, o]) => [c, w * 1.5, o]), { licht: satLicht, mix: 0.6, gerade: true, szene: 0.06 }) +
    W.haare(band, 120, rumpfW, 1.6, SILBER.slice(0, 3).concat([["#141312", 0.12, 0.6], ["#0a0909", 0.12, 0.6]]), { mix: 1, gerade: true, szene: 0.05 }) +
    W.haare(rumpf, 40, (x, y) => (x > 76 ? 120 : 100), 2.6, GLANZ, { licht: (x, y) => licht(x, y), gerade: true, szene: 0 }),
  { rand: 0 });
  rs += W.kantenStraehnen([[1, -80], [3, -90], [12, -99], [26, -106], [42, -114], [58, -122], [72, -129]], 46, (x) => (x < 6 ? 128 : 192), 1, 2.2, 0.3,
    (x, y, z) => SILBER[Math.round(clamp(0.95 - x / 140 + (z - 0.5) * 0.3) * 5)][0], { kante: 0.12, szene: 0.15 });
  rs += W.kantenStraehnen([[72, -129], [84, -133.5], [96, -133], [104, -129]], 26, 196, 1.2, 2.6, 0.39, (x, y, z) => STR[z > 0.5 ? 4 : 3], { szene: 0.2 });
  rs += W.kantenStraehnen([[108, -72], [98, -60], [84, -52], [68, -48], [52, -49], [38, -53], [26, -58]], 46, 94, 2.2, 6, 0.55, (x, y, z) => STR[z > 0.7 ? 2 : z > 0.3 ? 1 : 0], { szene: 0.2 });
  s += W.vol("rf", 12, rs, { tiefe: 3, umgebung: 0.5 });

  /* ---------- nahes Hinterbein: Oberschenkel als Masse (Knie vorn), Silber bis auf den Oberschenkel ---------- */
  s += gorillaFuss(W, T, 0, false);
  const beinN = [[14, -95], [24, -86], [34, -74], [42, -64], [49, -56], [51.5, -46], [49.6, -38], [46, -30], [43.6, -22], [42.6, -15], [37, -11], [28, -10.5], [21, -13], [19.5, -21], [17, -30],
    [13, -42], [8, -54], [3, -66], [1, -78], [2, -92]];
  const beinSat = [[0, -96], [14, -97], [27, -87], [37, -76], [41, -66], [36, -58], [26, -52], [14, -50], [4, -53], [1, -68]];
  s += W.vol("bn", 5, W.teil(beinN, fellG("bn", 0, 0, "#2a2826", "#181716", "#0a0909"),
    W.weich([`<path d="${G(beinSat)}" fill="#9a968f"/>`], 3.4) +
    W.weich([[45, -46, 3, 9, -25, "#6e7076", 0.45], [30, -14, 12, 4, 0, "#000", 0.5]], 3) +
    glanzFell("bn", 104, [-1, -98, 52, -8]) + W.haare(beinN, 170, (x, y) => (y < -58 ? 112 : 100), 3.6, SCHW, { licht: (x, y) => clamp(licht(x, y) + 0.25 - (x < 20 ? 0.2 : 0)), wahl: (x, y) => 0.4 + clamp(licht(x, y) + 0.25) * 0.6, buendel: 4, krumm: 0.3, szene: 0.08 }) +
    W.fell("bns", 120, [-1, -98, 42, -48], { hell: "#f6f4f0", dunkel: "#4a4744", ho: 0.3, do: 0.4, fx: 3.6, fy: 0.7, hk: "s", licht: false }) +
    W.haare(beinSat, 130, 118, 1.4, SILBER.map(([c, w, o]) => [c, w * 1.5, o]), { licht: (x, y) => clamp(0.3 + (-y - 60) / 35), mix: 0.6, gerade: true, szene: 0.06 }),
  { rand: 0, maske: W.maske("bn", [-10, -100, 60, -5], 0, -92, 0, -80) }) +
    W.kantenStraehnen([[1, -78], [3, -66], [8, -54], [13, -42], [17, -30], [19.5, -21], [21, -13]], 34, 104, 2, 4, 0.5, (x, y, z) => STR[z > 0.5 ? 2 : 1], { szene: 0.2 }) +
    W.kantenStraehnen([[21, -13], [28, -10.5], [37, -11], [42.6, -15]], 40, 84, 1.6, 3, 0.44, (x, y, z) => STR[z > 0.5 ? 2 : 1], { szene: 0.2 }), { tiefe: 3, umgebung: 0.5 });

  /* ---------- nahes Vorderbein: Deltamuskel, Ellbogenknick, Unterarmspindel; behaart bis zum Handgelenk ---------- */
  s += knoechelhand(W, T, 93.6, false);
  const armN = [[66, -112], [72, -124], [84, -129], [98, -125], [106, -115], [109, -101], [108, -87], [104.5, -75], [102.6, -64], [104.2, -52], [103.6, -40], [102, -29], [100.6, -19.2],
    [86.6, -19.2], [84, -28], [80.6, -38], [77, -48], [73.6, -57], [69.4, -65], [68.4, -72], [67, -82], [66, -96]];
  s += W.vol("an", 4.4, W.teil(armN, fellG("an", 0, 0, "#2c2a28", "#1a1918", "#0b0a0a"),
    W.weich([
      /* Deltamuskel: Lichtkante oben/vorn, Kernschatten hinten; Bizeps; Unterarmspindel */
      [90, -118, 13, 7, -18, "#76787e", 0.55], [72, -102, 5, 16, 5, "#000", 0.5], [104.6, -96, 2.6, 11, 0, "#6e7076", 0.45], [100.6, -54, 2.6, 13, -4, "#6e7076", 0.45],
      [70, -70, 4, 4, 0, "#000", 0.55], [104, -88, 6, 8, 0, "#000", 0.4],
    ], 2.8) +
    glanzFell("an", 98, [64, -130, 110, -18]) + W.haare(armN, 260, (x, y) => (y < -70 ? (x < 82 ? 116 : 104) : 96), 5, SCHW, { licht: (x, y) => licht(x, y) + (x > 90 ? 0.12 : -0.15), wahl: (x, y) => 0.3 + clamp(licht(x, y) + (x > 90 ? 0.12 : -0.15)) * 0.7, buendel: 5, krumm: 0.3, szene: 0.08 }) +
    W.haare(armN, 30, (x, y) => (y < -70 ? 108 : 96), 3.6, GLANZ, { licht: (x) => clamp((x - 84) / 20), gerade: true, szene: 0 }),
  { rand: 0, vol: false, maske: W.maske("an", [55, -140, 120, -15], 0, -127, 0, -112) }) +
    W.kantenStraehnen([[66, -96], [67, -82], [68.4, -72], [69.4, -65], [73.6, -57], [77, -48], [80.6, -38], [84, -28], [86.6, -19.4]], 52, (x, y) => 102 + (y < -66 ? 12 : 4), 2.6, 6, 1.1,
    (x, y, z) => STR[z > 0.7 ? 2 : z > 0.25 ? 1 : 0], { szene: 0.2 }) +
    W.kantenStraehnen([[102.6, -21], [93.6, -20.4], [86, -20]], 34, 90, 2, 4, 0.44, (x, y, z) => STR[z > 0.5 ? 3 : 2], { szene: 0.2 }) +
    W.kantenStraehnen([[108.6, -96], [108, -87], [104.5, -75], [102.6, -64], [104.2, -52], [103.6, -40], [102, -29]], 22, 92, 1, 2, 0.33, (x, y, z) => STR[z > 0.5 ? 3 : 2], { szene: 0 }), { tiefe: 3, umgebung: 0.5 });

  /* ---------- Kopf ---------- */
  s += gorillaKopf(T, W, STR, KAPPE, HAUT, licht);
  return W.fertig(s, 1, [86, -141, 141, -80], [12, 34, 97, 123]);
}

/* Hautfarben für Hände/Füße: c = nah (fern → nah), cf = fern, l/lf = Licht, g/gf = Verlauf, na/nf = Nagel */
const HAUT_G = { n: "g", c: ["#151413", "#1b1a19", "#22201f"], cf: ["#0e0d0d", "#121110", "#151413"], l: "#9a948d", lf: "#4a4642",
  g: [[0, "#34312f"], [0.55, "#1d1c1b"], [1, "#0c0b0b"]], gf: [[0, "#222020"], [0.6, "#121111"], [1, "#080808"]], na: "#5e5750", nf: "#35312d", sohle: "#7a736b" };
const HAUT_S = { n: "s", c: ["#231c18", "#2a221e", "#332924"], cf: ["#161210", "#1a1513", "#1e1815"], l: "#a8968a", lf: "#5a4c44",
  g: [[0, "#4a3c34"], [0.55, "#2c2420"], [1, "#141010"]], gf: [[0, "#2c2420"], [0.6, "#1a1513"], [1, "#0c0a08"]], na: "#7a6a5e", nf: "#3e342e", sohle: "#8a7a6c" };
const HAUT_O = { n: "o", c: ["#2e2420", "#362a25", "#40322b"], cf: ["#1c1614", "#211a17", "#261e1a"], l: "#b09a8a", lf: "#5e4e44",
  g: [[0, "#5a463c"], [0.55, "#3a2e28"], [1, "#1a1412"]], gf: [[0, "#3a2e28"], [0.6, "#211a17"], [1, "#100c0a"]], na: "#8a7464", nf: "#463a32", sohle: "#94806e" };

/* Knöchelhand (wie im Foto von der Seite): Mittelhand senkrecht unter dem Handgelenk (y ≈ −19,6); darunter die vier
   gebeugten Finger: ihre Mittelglieder liegen als gewölbte Walzen nebeneinander auf dem Boden (Mittelfinger am längsten,
   nach außen kürzer), matte, hellere Knöchelpolster mit Querfalten; Endglieder unter die Hand geschlagen (Schattenspalt,
   flache Nagelkuppe); kurzer Daumen hinten ohne Bodenkontakt. */
function knoechelhand(W, T, wx, fern, pal = HAUT_G, o = {}) {
  const C = fern ? pal.cf : pal.c, LI = fern ? pal.lf : pal.l;
  const mh = o.mh || 1, vor = o.vor || 0, top = -6.2 - 13.6 * mh;
  let s = "";
  if (!T.fein) {
    /* Szene: Mittelhand + vier Knöchelwalzen als eine Fläche, Polster hell */
    return `<path d="${G([[wx - 5.4, top], [wx + 5.4, top], [wx + 6.6 + vor, -8], [wx + 6 + vor, -0.6], [wx + 2.6 + vor, 0, 1], [wx - 5.8 + vor, 0, 1], [wx - 6.2 + vor, -3], [wx - 5.8, -12]])}" fill="${C[1]}"/>` +
      `<path d="M${f1(wx - 5 + vor)} -1.4h10.6" stroke="${pal.polster || "#3a3532"}" stroke-width="1.6" stroke-dasharray="2.4 .6"/>`;
  }
  /* Daumen (hinten, frei) */
  s += W.glied([[wx - 4.6 + vor * 0.5, -12.4], [wx - 6.2 + vor * 0.6, -9.8], [wx - 6.4 + vor * 0.6, -8.2]], 2.5, fern ? "#0c0b0b" : C[0], "");
  s += `<ellipse cx="${f1(wx - 6.5 + vor * 0.6)}" cy="-8.4" rx=".6" ry=".8" fill="${fern ? pal.nf : pal.na}"/>`;
  /* Mittelhand mit Grundgelenk-Wülsten unten */
  const hand = [[wx - 5.4, top], [wx + 5.4, top], [wx + 6.4 + vor * 0.5, -13], [wx + 6.8 + vor, -7.8], [wx + 4 + vor, -6.2], [wx + vor, -6], [wx - 4 + vor, -6.4], [wx - 5.8 + vor, -8.4], [wx - 5.8 + vor * 0.4, -13.6]];
  s += W.teil(hand, !T.fein ? C[1] : T.lg((fern ? "hdf" : "hd") + pal.n, fern ? pal.gf : pal.g, 0, 0, 1, 0.3),
    W.weich([[wx - 2.4 + vor * 0.4, -15.6, 2.6, 4, 0, LI, fern ? 0.2 : 0.4], [wx + 5.4 + vor * 0.6, -12, 1.4, 5, 0, "#000", 0.55], [wx + vor, -7, 6, 1.4, 0, "#000", 0.35]], 1) +
    W.falten([`M${f1(wx - 3.6 + vor * 0.4)} -15.6q2.2 -.6 4.4 0`, `M${f1(wx - 3.2 + vor * 0.5)} -13.2q2.4 -.5 5 .2`, `M${f1(wx - 4 + vor * 0.6)} -10.8q1.6 -.4 3 0`], 0.12, "#000", LI, 0.6, 0.25),
  { rand: 0.45, vol: false });
  /* Fingerwalzen: Zeigefinger (vorn, fern) … kleiner Finger (hinten, nah); Länge = Höhe des Bogens */
  const F = [[4.2, 2.9, 4.6], [1.2, 3, 5.4], [-1.8, 2.9, 5], [-4.6, 2.6, 4.2]];
  F.forEach(([dx, br, h], i) => {
    const cx = wx + dx + vor, c = fern ? (pal.walzeF || ["#0b0a0a", "#0d0c0c", "#0f0e0e", "#121110"])[i] : C[Math.min(2, i)];
    /* Walze: oben aus der Mittelhand, unten rund auf dem Boden */
    const walze = [[cx - br / 2, -6.8], [cx + br / 2, -6.8], [cx + br / 2 + 0.2, -h * 0.45], [cx + br * 0.4, -0.5], [cx, 0, 1], [cx - br * 0.45, -0.4], [cx - br / 2 - 0.1, -h * 0.45]];
    s += W.teil(walze, c, (fern ? "" : W.weich([[cx - br * 0.18, -h * 0.62, br * 0.18, h * 0.25, 0, LI, 0.4], [cx + br * 0.38, -h * 0.4, br * 0.14, h * 0.4, 0, "#000", 0.6]], 0.35)) +
      /* Knöchelpolster: matt, heller, unten vorn, Querfalten */
      `<ellipse cx="${f1(cx)}" cy="${f1(-1.5)}" rx="${f1(br * 0.42)}" ry="1.3" fill="${fern ? "#1e1c1b" : pal.polster || "#3a3532"}" opacity=".85"/>` +
      (fern ? "" : W.falten([`M${f1(cx - br * 0.3)} -2.6q${f1(br * 0.3)} -.3 ${f1(br * 0.6)} 0`, `M${f1(cx - br * 0.32)} -1.6q${f1(br * 0.32)} -.25 ${f1(br * 0.64)} 0`, `M${f1(cx - br * 0.26)} -3.6q${f1(br * 0.26)} -.3 ${f1(br * 0.52)} 0`], 0.09, "#000", "#9a948e", 0.6, 0.3)),
    { rand: fern ? 0.3 : 0.55, rw: 0.3, vol: false });
    /* eingeschlagenes Endglied: Schattenspalt hinten am Boden mit flacher Nagelkuppe */
    s += `<ellipse cx="${f1(cx - br * 0.55)}" cy="-.5" rx="${f1(br * 0.22)}" ry=".45" fill="${fern ? pal.nf : pal.na}"/>`;
  });
  return s;
}

/* Gorillafuß (Sohlengänger): runde Ferse, flache Sohle, faltige matte Haut; dicke, kurze Großzehe (innen, nach
   vorn-innen gespreizt) ragt mit Nagel VOR die anderen Zehen; Zehen 2–5 kurz, leicht gekrümmt, flache Nägel. */
function gorillaFuss(W, T, dx, fern, pal = HAUT_G) {
  const P = (x, y) => [x + dx, y];
  const C = fern ? pal.cf.concat(pal.cf[2]) : pal.c.concat(pal.c[2]), LI = fern ? pal.lf : pal.l;
  let s = "";
  if (!T.fein) return `<path d="${G([P(21, -14.4), P(17.4, -9), P(18, -2.6), P(22, 0, 1), P(41.6, 0, 1), P(42.4, -2.6), P(39.6, -6.4), P(33, -8.6), P(26, -12.6)])}" fill="${C[1]}"/>` +
    `<path d="M${f1(dx + 34)} -.6h7" stroke="${pal.na}" stroke-width=".9" stroke-dasharray="1 .8"/>`;
  const nagel = (x, y, w, rot) => `<ellipse cx="${f1(x + dx)}" cy="${f1(y)}" rx="${f1(w)}" ry="${f1(w * 0.55)}" transform="rotate(${rot} ${f1(x + dx)} ${f1(y)})" fill="${fern ? pal.nf : pal.na}"/>` +
    (fern || !T.fein ? "" : `<path d="M${f1(x + dx - w * 0.7)} ${f1(y - w * 0.3)}q${f1(w * 0.6)} ${f1(-w * 0.4)} ${f1(w * 1.3)} 0" fill="none" stroke="#d8d0c6" stroke-opacity=".45" stroke-width=".12"/>`);
  /* Großzehe (innen, vorn-innen gespreizt), dick und kurz – vor den übrigen Zehen */
  s += W.glied([P(33.6, -4.2), P(38.8, -2.8), P(42, -2.2)], 4.3, fern ? "#0b0a0a" : C[0], LI, { la: 0.22 }) + nagel(42.2, -3.7, 1.25, 16);
  /* Zehen 2–4 (fern → nah): kurz, gekrümmt, Spitze am Boden, Lücken dunkel */
  const zehe = (i) => {
    const [bx, by, tx, b] = [[33.4, -7.6, 39.8, 3.5], [33, -6.8, 39.2, 3.4], [32.6, -6, 38.4, 3.3], [32, -5.2, 37.4, 3.2]][i];
    /* Zehe als gefüllte Wurst: oben gewölbt, Spitze rund auf dem Boden, Unterseite mit Ballen */
    const f = [P(bx, by - b / 2), P(bx + (tx - bx) * 0.55, by - b * 0.42), P(tx - b * 0.35, -b * 0.92), P(tx, -b * 0.45), P(tx - b * 0.3, 0, 1), P(bx + (tx - bx) * 0.45, -0.2), P(bx, by + b / 2)];
    let z = W.teil(f, fern ? C[i] : T.lg("ze" + pal.n, [[0, "#3a3634"], [0.5, C[2]], [1, "#080808"]], 0, 0, 0.3, 1),
      W.weich([[tx - b * 0.55 + dx, -b * 0.8, b * 0.35, b * 0.18, 20, LI, fern ? 0.15 : 0.45]], 0.4), { rand: 0.6, rw: 0.25, vol: false });
    z += nagel(tx - 1, -b + 0.35, 0.95, 30);
    if (T.fein && !fern) z += W.falten([`M${f1(bx + 2 + dx)} ${f1(by - b / 2 + 0.4)}q.4 .8 .2 1.6`, `M${f1(bx + 3.2 + dx)} ${f1(by - b / 2 + 0.6)}q.4 .7 .2 1.4`], 0.09, "#000", LI, 0.6, 0.25);
    return z;
  };
  s += zehe(0) + zehe(1) + zehe(2);
  const fussPts = [P(21, -14.4), P(18.4, -12.2), P(17.2, -8.4), P(17.6, -4.2), P(19.6, -1), P(22.6, 0, 1), P(33, 0, 1), P(35.2, -1.4), P(35.6, -4.4), P(34.2, -7.2), P(30, -9.8), P(26, -12.6)];
  s += W.teil(fussPts, !T.fein ? C[2] : T.lg((fern ? "fuf" : "fu") + pal.n, fern ? pal.gf : pal.g),
    W.weich([[dx + 26.6, -10.4, 6, 2, -24, LI, fern ? 0.2 : 0.4], [dx + 26, -0.8, 9, 1.3, 0, "#000", 0.6], [dx + 18.6, -7, 1.4, 3.4, 0, LI, fern ? 0.15 : 0.35]], 0.9) +
    W.falten(["M29 -9.4q2.4 1 4 2.8", "M24.8 -7.6q2.8 .8 4.6 2.6", "M21.4 -4.2q1.8 .5 3.2 1.8", "M19.6 -10q1 1.6 1 3.4", "M23 -10.8q1.6 1.2 2.2 3", "M27 -4.4q2 .3 3.6 1.4"].map((d) => d.replace(/^M([\d.]+)/, (m, x) => "M" + f1(+x + dx))), 0.12, "#000", LI, 0.6, 0.3),
  { rand: 0.5, vol: false });
  s += zehe(3);
  /* Sohlenkante: etwas heller, staubig */
  s += W.L([`M${f1(dx + 18.4)} ${f1(-2.2)}q1.2 1.8 4 2h10.4q1.6 0 2.4 -.8`], fern ? pal.lf : pal.sohle, 0.45, 0.45);
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
    W.fell("kfg", 150, [84, -140, 120, -84], { hell: "#8a8a94", dunkel: null, ho: 0.28, fx: 3, fy: 0.3, hk: "g" }) +
    W.haare(kopf, 190, (x, y) => (y < -126 ? 196 : x < 112 ? 120 + clamp((y + 120) / 30) * 10 : 106), 1.8, [["#000", 0.13, 0.6], ["#151416", 0.13, 0.55], ["#2c2b2e", 0.12, 0.55], ["#4a4a50", 0.12, 0.5], ["#707078", 0.11, 0.5]], { licht: (x, y) => licht(x, y) * 1.1, buendel: 3, krumm: 0.3, szene: 0.08 }) +
    W.weich([`<path d="${G(kappe)}" fill="#4a2a17" opacity=".42"/>`], 1.8) +
    W.haare(kappe, 70, (x) => (x < 104 ? 205 : 190), 1.6, KAPPE.map((c) => [c, 0.12, 0.6]), { licht: (x, y) => clamp(0.3 + (-y - 129) / 9), buendel: 2, gerade: true, szene: 0.1 }) +
    gorillaGesicht(T, W, gesicht, HAUT) +
    /* Haaransatz: kurze, nach hinten gerichtete Härchen über der Grenze (statt Zackenkante) */
    (T.fein ? W.haare([[113.6, -126], [118.4, -126], [119.8, -110], [121, -96], [123.4, -88], [127, -84.6], [122, -84.6], [118.4, -94], [116.4, -110]], 70,
      (x, y) => (y < -112 ? 200 : y < -96 ? 186 : 165), 1.4, [["#0a0909", 0.07, 0.6], ["#1a1918", 0.07, 0.55], ["#2c2a28", 0.06, 0.5]], { mix: 0.8, gerade: true }) : ""),
  { rand: 0, vol: false, maske: W.maskeForm("kf", [[84, -128], [90, -134], [102.6, -141], [118, -132], [142, -110], [142, -80], [122, -80], [108, -84], [101, -92], [97, -104], [93, -116]], 3.4) }), { tiefe: 3, umgebung: 0.5 });
  s += W.L([G(profil, false)], "#000", 0.3, 0.45);
  /* 1 px Streiflicht trennt Kopf und Schulterbuckel (auch klein lesbar) */
  s += W.L([G([[88, -131.4], [95, -135.8], [102.6, -138.4]], false)], "#6a6a70", 0.35, 0.55);
  s += W.kantenStraehnen([[88, -130], [96, -136.2], [102.6, -138.8], [108.6, -137.6], [114, -133]], 26, (x) => (x < 103 ? 205 : 192), 0.8, 1.8, 0.5,
    (x, y, z) => KAPPE[z > 0.5 ? 3 : 2], { kante: 0.1, szene: 0.2 });
  s += W.kantenStraehnen([[100, -93], [108, -87.4], [116, -84.8], [124, -84]], 22, 94, 1, 2.4, 0.6, (x, y, z) => STR[z > 0.5 ? 1 : 0], { szene: 0.15 });
  /* Ohr: klein, dunkel wie das Gesicht, eng anliegend; Helixrand, Muschel, Tragus; oben vom Haar bedeckt */
  const ohr = [[108.4, -106.6], [110.8, -107.4], [112.2, -105.2], [111.8, -101.8], [110.2, -100], [108.6, -100.8], [108, -103.6]];
  s += W.teil(ohr, HAUT, W.weich([[110.2, -103.6, 1.1, 1.8, 0, "#000", 0.7]], 0.4) +
    W.falten(["M109.2 -106q2 -.6 2.4 1.6q.2 2.2 -1.4 3.6", "M110.6 -103.6q.6 1 0 2"], 0.16, "#000", "#7a7470", 0.8, 0.45) +
    `<ellipse cx="111.6" cy="-102.6" rx=".45" ry=".7" fill="#3a3634"/>`, { rand: 0.4, vol: false });
  s += W.kantenStraehnen([[107.6, -108], [110, -108.4], [112.4, -106.6]], 10, 120, 0.8, 1.6, 0.4, () => STR[1], { szene: 0 });
  return s;
}

/* Gesichtshaut: matt schwarzgrau, Glanz nur auf Nasenrücken, Wulstkante und Unterlippe; Falten als Rinne + Lichtkante */
function gorillaGesicht(T, W, gesicht, HAUT) {
  let s = `<path d="${G(gesicht)}" fill="${T.lg("gh", [[0, "#2e2b29"], [0.45, HAUT], [1, "#121110"]], 0, -128, 0, -84, UB)}"/>`;
  s += W.weich([
    /* Wulstdach: Oberseite im Streiflicht, Unterseite tiefer Schlagschatten über der Augenhöhle */
    [126.6, -120.6, 6.6, 1.5, 26, "#8e8a86", 0.75], [132.2, -116.6, 1.2, 1.4, 0, "#a6a29e", 0.55], [126.6, -112.4, 6.2, 2.2, 6, "#000", 0.95],
    /* Nasenrücken glänzt leicht, Schnauzenwölbung matt modelliert, Unterlippe Glanz, Kinn/Kiefer im Schatten */
    [133.4, -106.2, 2, 0.8, 38, "#8a8682", 0.6], [134.6, -96.4, 3.4, 1.6, -10, "#4a4644", 0.5], [136.2, -91.2, 1.6, 0.6, -10, "#8a8682", 0.55],
    [128, -88.4, 6, 2.6, 0, "#000", 0.5], [121.6, -100, 3, 7, 0, "#000", 0.35],
  ], 0.8);
  /* Falten: über dem Wulst quer, Nasenrücken quer, Tränensäcke, Nasolabialfalte, Oberlippe senkrecht, Kinnfurche */
  s += W.falten([
    "M118.4 -124.4q3 -1.4 6.6 -.6", "M119.6 -122.2q3.4 -1.2 7.2 0", "M121 -120.4q2 -.6 4.2 .1",
    "M129.8 -110.8q1.2 .4 1.6 1.4", "M130.6 -109.6q1.2 .5 1.7 1.5",
    "M121.2 -106.8q2.4 1.4 5.6 .4", "M120.4 -105q3.2 1.6 6.8 0", "M121.4 -103q2.4 1 4.6 0",
    "M133 -101.6q-2.4 3.6 -1.2 7.8", "M130.2 -102.4q-2.6 4.6 -.8 9.6", "M126.6 -96.2q-.4 2.6 .8 5",
    "M136.4 -97l-.3 1.6", "M135.2 -96.8l-.3 1.8", "M137.4 -97.2l-.2 1.2", "M134.4 -88.6q-2 -.6 -3.8 .2",
  ], 0.2, "#000", "#7e7874", 0.75, 0.35);
  /* Nase: breiter, flacher Wulst; Nasenflügel als großes, nach außen gerolltes „C“; Nasenloch als schräger Schlitz
     nach vorn-unten; „Nasenabdruck“: senkrechte Rillen oben auf der Nase */
  s += W.L(["M135.6 -105.4q-3.8 .4 -4.6 3.6q-.6 3.2 2.2 4.6q2 .8 3.8 -.2"], "#2a2725", 1.3, 1) +
    W.L(["M135.4 -105.9q-3.6 .5 -4.5 3.2"], "#8a8682", 0.3, 0.55) + W.L(["M131.2 -100.8q.4 2.6 2.6 3.4"], "#000", 0.35, 0.8);
  s += `<path d="${G([[134.4, -100.4], [136.6, -101.6], [137.6, -100.2], [136.8, -98.6], [135.2, -98.4]])}" fill="#030202"/>`;
  if (T.fein) s += W.falten(["M134.2 -105.4l.4 1.6", "M135.4 -104.8l.3 1.5", "M133 -105.2l.4 1.4", "M136.4 -103.6l.2 1.2"], 0.12, "#000", "#8a8682", 0.7, 0.3);
  /* Mund: Mundspalte bis unter die Augenmitte, dicke Unterlippe */
  s += W.L(["M138.4 -93.2q-3 .4 -6 .3q-3.4 0 -6.4 1.4"], "#000", 0.45, 0.95) + W.L(["M138 -92.3q-3.6 .3 -7 .3"], "#5a5552", 0.22, 0.5);
  /* Auge: tief unter dem Wulst, Höhle, dickes faltiges Oberlid, dunkelbraune Iris, Glanz gedämpft */
  s += W.auge2(125.6, -109.6, 1.45, { iris: "#2e1a10", iris2: "#100604", sklera: "#1a120e", offen: 0.78, winkel: 4, lidDeck: 0.3, lid: "#262321", lidHell: "#6e6864",
    glanz: 0.5, karunkel: "#4e4450", hoehle: "#000" });
  /* Wulstschatten fällt auf die obere Lidhälfte */
  s += W.weich([[125.6, -111.6, 3.6, 1.3, 4, "#000", 0.8]], 0.5);
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
  W.dichte = T.fein ? 0.8 : 0.8;
  const SCH = [["#000", 0.12, 0.6], ["#151516", 0.12, 0.55], ["#2c2c31", 0.11, 0.55], ["#4c4c54", 0.11, 0.55], ["#7a7a84", 0.1, 0.55]];
  const STR = ["#050505", "#131314", "#202024", "#33333a"];
  const licht = (x, y) => clamp(0.15 + (-y - 30) / 60 - (x - 40) / 300);
  const wahl = (x, y) => 0.3 + licht(x, y) * 0.7;
  const HAUT = "#3a302a";
  let s = "";
  const fellG = (n, a, b, c) => T.lg("cs" + n, [[0, a], [0.5, b], [1, c]]);

  /* ---------- ferne Glieder (Schattenseite, ~30 % dunkler) ---------- */
  s += schimpansenFuss(W, T, -11, true);
  const beinF = [[6, -54], [14, -52], [20, -44], [22, -34], [18, -26], [14, -18], [12, -11], [7, -9.6], [4, -12], [4, -20], [6, -28], [2, -38], [1, -46]];
  s += W.vol("cbf", 2.4, W.teil(beinF, fellG("bf", "#1c1b1c", "#121213", "#09090a"),
    W.haare(beinF, 70, (x, y) => (y < -36 ? 112 : 98), 2.6, SCH, { licht: (x, y) => licht(x, y) * 0.55, buendel: 3, krumm: 0.35, szene: 0.08 }), { rand: 0 }) +
    W.kantenStraehnen([[4, -22], [4, -12], [7, -9.6]], 10, 96, 1.4, 2.6, 0.4, () => STR[1], { szene: 0.2 }), { tiefe: 3, umgebung: 0.5 });
  s += W.skaliert(80, 0, 0.7, () => knoechelhand(W, T, 0, true, HAUT_S, { mh: 1.3, vor: 3.8 }));
  const armF = [[64, -76], [72, -74], [76, -64], [77.6, -52], [79, -40], [80.6, -28], [81.6, -17.4], [76, -17.4], [74, -26], [71.6, -38], [69, -50], [66.4, -62]];
  s += W.vol("caf", 2.2, W.teil(armF, fellG("af", "#1e1d1e", "#131314", "#09090a"),
    W.haare(armF, 90, 98, 3.4, SCH, { licht: (x, y) => licht(x, y) * 0.6 + (x > 76 ? 0.12 : 0), buendel: 3, krumm: 0.4, szene: 0.08 }), { rand: 0 }) +
    W.kantenStraehnen([[66.4, -62], [69, -50], [71.6, -38], [74, -26], [76, -17.6]], 22, 104, 2, 4, 0.45, () => STR[1], { szene: 0.2 }) +
    W.kantenStraehnen([[81.6, -18], [78.8, -17.6], [76, -17.6]], 12, 92, 1.4, 2.6, 0.4, () => STR[2], { szene: 0.2 }), { tiefe: 3, umgebung: 0.5 });

  /* ---------- Rumpf: schlank, Rücken flach (≈ 20°), schütteres Haar, Haut scheint an Brust/Bauch durch ---------- */
  const rumpf = [[3, -50], [4, -58], [10, -63], [22, -67], [36, -72], [50, -77], [62, -81], [69, -85], [75, -87], [80, -82], [82, -73], [81, -63], [76, -55], [66, -49], [54, -46], [42, -46], [32, -47],
    [22, -49], [12, -50]];
  const hautZone = [[78, -66], [76, -56], [66, -49.6], [54, -46.6], [42, -46.6], [32, -47.6], [24, -49.6], [30, -54], [44, -54], [58, -56], [70, -60]];
  let rs = W.teil(rumpf, fellG("rf", "#242325", "#141415", "#08080a"),
    W.weich([`<path d="${G(hautZone)}" fill="${HAUT}" opacity=".7"/>`, [66, -47.6, 14, 1.4, 4, "#5a4a40", 0.4]], 2.6) +
    W.fell("crf", 150, [2, -82, 81, -45], { hell: "#7a7a84", dunkel: null, ho: 0.25, fx: 2.4, fy: 0.18, hk: "g" }) +
    W.haare(rumpf, 220, (x, y) => (x > 60 ? 118 + (y + 70) * 0.5 : y > -54 ? 96 : 184 - clamp((y + 70) / 20) * 40), 3.4, SCH, { licht, wahl, buendel: 3, krumm: 0.4, szene: 0.08 }) +
    W.haare(hautZone, 110, 95, 2.8, SCH.slice(0, 3), { buendel: 3, krumm: 0.45, szene: 0.05 }),
  { rand: 0 });
  rs += W.kantenStraehnen([[3, -52], [4, -58], [10, -63], [22, -67], [36, -72], [50, -77], [62, -81], [70, -81]], 40, (x) => (x < 6 ? 120 : 188), 1.4, 3, 0.4, (x, y, z) => STR[z > 0.5 ? 3 : 2], { szene: 0.2 });
  rs += W.kantenStraehnen([[76, -55], [66, -49], [54, -46], [42, -46], [32, -47], [22, -49]], 30, 94, 1.6, 4, 0.4, (x, y, z) => STR[z > 0.5 ? 1 : 0], { szene: 0.2 });
  s += W.vol("crf", 6, rs, { tiefe: 3, umgebung: 0.5 });

  /* ---------- nahes Hinterbein: länger und schlanker, Knie vorn, Ferse sichtbar ---------- */
  s += schimpansenFuss(W, T, 0, false);
  const beinN = [[6, -58], [16, -58], [24, -52], [30, -43], [33, -34], [32.2, -27], [28.6, -20], [25.6, -14], [24, -9], [18.6, -8.4], [15.4, -11], [15.4, -18], [17, -25], [13.4, -31], [9, -38],
    [5.6, -46]];
  s += W.vol("cbn", 3, W.teil(beinN, fellG("bn", "#262527", "#161617", "#09090a"),
    W.weich([[31, -32, 2, 7, -25, "#5a5a62", 0.5], [15, -28, 2.4, 6, -20, "#000", 0.45]], 1.6) +
    W.fell("cbn", 104, [3, -60, 34, -7], { hell: "#7a7a84", dunkel: null, ho: 0.22, fx: 2.6, fy: 0.2, hk: "g" }) +
    W.haare(beinN, 120, (x, y) => (y < -40 ? 116 : 100), 2.8, SCH, { licht: (x, y) => clamp(licht(x, y) + 0.2), wahl, buendel: 3, krumm: 0.4, szene: 0.08 }),
  { rand: 0, maske: W.maske("cbn", [-6, -66, 40, -2], 0, -58, 0, -50) }) +
    W.kantenStraehnen([[5.6, -50], [5.6, -46], [9, -38], [13.4, -31], [17, -25], [15.4, -18], [15.4, -11]], 22, 104, 1.6, 3.4, 0.4, (x, y, z) => STR[z > 0.5 ? 2 : 1], { szene: 0.2 }) +
    W.kantenStraehnen([[15.4, -11], [18.6, -8.4], [24, -9]], 14, 84, 1.2, 2.4, 0.35, (x, y, z) => STR[2], { szene: 0.2 }), { tiefe: 3, umgebung: 0.5 });

  /* ---------- naher Arm: lang, schlanker; Schulterkugel, Ellbogenknick; Haar bis zum Handgelenk, Innenarm schütter ---------- */
  s += W.skaliert(64.2, 0, 0.7, () => knoechelhand(W, T, 0, false, HAUT_S, { mh: 1.3, vor: 3.8 }));
  const armN = [[50, -76], [58, -79], [66, -79], [70, -74], [71, -66], [70, -58], [68.6, -51], [69.6, -44], [69.6, -34], [68.6, -26], [68, -17.2], [60.4, -17.2], [59.4, -26], [57.6, -34], [55.6, -42],
    [53.4, -48], [53.6, -54], [52.6, -60], [51, -67], [50, -72]];
  s += W.vol("can", 2.4, W.teil(armN, fellG("an", "#2a292c", "#18181a", "#0a0a0b"),
    W.weich([[60, -78, 8, 5, -15, "#6a6a72", 0.45], [53, -66, 2.6, 10, 0, "#000", 0.45], [53.6, -52, 1.8, 2.4, 0, "#000", 0.6], [67.4, -38, 1.6, 8, 0, "#6a6a72", 0.35]], 1.6) +
    W.fell("can", 98, [48, -86, 72, -16], { hell: "#7a7a84", dunkel: null, ho: 0.25, fx: 2.4, fy: 0.18, hk: "g" }) +
    W.haare(armN, 170, (x, y) => (y < -56 ? (x < 58 ? 116 : 104) : 96), 4.4, SCH, { licht: (x, y) => licht(x, y) + (x > 62 ? 0.12 : -0.12), wahl, buendel: 4, krumm: 0.45, szene: 0.08 }),
  { rand: 0, vol: false, maske: W.maske("can", [40, -92, 80, -10], 0, -84, 0, -74) }) +
    W.kantenStraehnen([[50, -74], [51.4, -66], [53, -58], [54.6, -50], [56, -42], [57.6, -34], [59.4, -26], [60.4, -17.6]], 40, (x, y) => 102 + (y < -50 ? 12 : 4), 2.4, 5, 0.45,
      (x, y, z) => STR[z > 0.6 ? 2 : z > 0.25 ? 1 : 0], { szene: 0.2 }) +
    W.kantenStraehnen([[68.4, -18], [64.2, -17.6], [60.4, -17.6]], 14, 92, 1.4, 2.6, 0.4, (x, y, z) => STR[z > 0.5 ? 3 : 2], { szene: 0.2 }), { tiefe: 3, umgebung: 0.5 });

  /* ---------- Kopf ---------- */
  s += schimpansenKopf(T, W, SCH, STR, licht);
  return W.fertig(s, 1, [72, -103, 101, -68], [3, 26, 66, 82]);
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
  s += W.glied([P(23, -3.6), P(28.4, -2.4), P(32.6, -1.4), P(35, -1.2)], 2.6, fern ? "#0e0c0b" : C[0], LI, { la: 0.25 }) + nagel(34.4, -2.2, 0.8, 8);
  /* Zehen 2–4 (fern → nah): lang, eingekrümmt */
  const zehe = (i) => {
    const [bx, by, tx, b] = [[28.6, -6.6, 37.6, 2.4], [28.2, -5.8, 37, 2.4], [27.8, -5, 36, 2.3], [27.2, -4.2, 34.8, 2.2]][i];
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
    W.fell("ckf", 130, [72, -102, 98, -70], { hell: "#7a7a84", dunkel: null, ho: 0.25, fx: 3, fy: 0.3, hk: "g" }) +
    W.haare(kopf, 110, (x, y) => (y < -95 ? 200 : x < 80 ? 120 : 104), 2, SCH, { licht: (x, y) => licht(x, y) + 0.1, buendel: 3, krumm: 0.35, szene: 0.08 }) +
    schimpansenGesicht(T, W, gesicht, profil) +
    (T.fein ? W.haare([[81.4, -98.2], [85, -98], [83.6, -90], [82.6, -82], [83.4, -76], [85.6, -73], [82, -73], [80.4, -80], [81, -90]], 50,
      (x, y) => (y < -90 ? 200 : 185), 1.2, [["#050505", 0.06, 0.6], ["#151516", 0.06, 0.55], ["#26262a", 0.05, 0.5]], { mix: 0.8, gerade: true }) : ""),
  { rand: 0, vol: false, maske: W.maskeForm("ckf", [[71, -82], [74, -96], [84, -104], [100, -94], [100, -70], [84, -70], [78, -73], [74, -76]], 1.6) }) +
    W.kantenStraehnen([[74.6, -93], [78, -98.6], [83, -100.2], [86.6, -98]], 16, (x) => (x < 80 ? 150 : 196), 1, 2, 0.35, (x, y, z) => STR[z > 0.5 ? 3 : 2], { szene: 0.2 }), { tiefe: 3, umgebung: 0.5 });
  s += W.L([G(profil, false)], "#1a1210", 0.2, 0.4);
  /* weißgraue Kinnhaare */
  if (T.fein) s += W.haare([[86, -74], [93, -74], [92, -71.4], [86, -71.6]], 26, 98, 1.4, [["#8a8078", 0.05, 0.6], ["#d0c8bc", 0.05, 0.7], ["#f0ebe4", 0.045, 0.75]], { mix: 0.9, gerade: true });
  /* großes, abstehendes Ohr: Helixwulst mit Lichtkante, Y-förmige Anthelix, tiefe Muschel, Tragus, rötlicher Durchlicht-Saum;
     etwas nach hinten gekippt */
  const ohr = [[75.4, -91.6], [78.6, -92.4], [81, -90], [81.4, -85.6], [80.2, -81.4], [77.8, -79.4], [75.4, -80.2], [74, -83.6], [74, -88]];
  s += W.vol("cohr", 0.8, W.teil(ohr, T.lg("cohr", [[0, "#6e5a4e"], [0.6, "#56463c"], [1, "#3a2e26"]]),
    `<path d="${G([[75.6, -89.6], [78.4, -90.4], [79.8, -88], [79.6, -84.6], [77.6, -82], [75.8, -82.6], [75.2, -86]])}" fill="#2a1e18"/>` +
    W.weich([[77.2, -86, 1.4, 2.2, 0, "#140c08", 0.7]], 0.4) +
    W.falten(["M76.6 -88.6q1.6 -.6 2.2 1q.4 1.6 -.6 3.2q-.6 1 -1.6 1", "M77.4 -87.4q-.6 1.2 -.4 2.6", "M78.8 -86.6q-.6 -.4 -1.2 0"], 0.2, "#1a120c", "#a48a78", 0.8, 0.5) +
    `<ellipse cx="80.4" cy="-84" rx=".5" ry=".9" fill="#3a2a22"/>`,
  { rand: 0.3, rc: "#1a120c" }) + W.L([G([[74.4, -88], [75.6, -91.4], [78.6, -92.2], [81, -90], [81.4, -85.6], [80.2, -81.4]], false)], "#b8806a", 0.25, 0.55), { tiefe: 2, umgebung: 0.5 });
  s += W.kantenStraehnen([[74, -88], [74, -83.6], [75.4, -80.2]], 8, 190, 0.8, 1.6, 0.3, () => STR[2], { szene: 0 });
  return s;
}

/* Gesicht: Augenpartie dunkel, Schnauze heller, Lippen grau mit Rosa, Sommersprossen; Falten als Rinne + Lichtkante;
   Überaugenwulst als Dach mit Schatten auf dem Oberlid; flache Nase; lange Oberlippe mit senkrechten Fältchen. */
function schimpansenGesicht(T, W, gesicht, profil) {
  let s = `<path d="${G(gesicht)}" fill="${T.lg("csg", [[0, "#3e322c"], [0.3, "#2e2420"], [0.55, "#5e4c40"], [0.8, "#7a6656"], [1, "#5a4a3e"]], 0, -98, 0, -72, UB)}"/>`;
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
  s += W.falten([
    "M84.6 -95q3 -1 5.6 .2", "M85 -93.4q2.6 -.6 4.8 .4", "M85.2 -86.4q1.8 1.2 4 .4", "M84.8 -85q2.2 1.2 4.8 .2", "M91.4 -84.4q-1.4 2.4 -.8 5", "M89.4 -84.8q-2 3.2 -.8 7",
    "M95.4 -79.4l-.3 1.4", "M94.4 -79.6l-.3 1.6", "M93.4 -79.4l-.3 1.5", "M96.2 -79l-.2 1.2", "M92.4 -73.6q-2 -.4 -3.6 .2",
  ], 0.14, "#1a120c", "#b8a290", 0.7, 0.35);
  /* Nase: flach in der Profillinie, kleiner schräger Nasenschlitz */
  s += W.L(["M92 -84.2q.7 .9 .6 1.9"], "#2a1e18", 0.18, 0.55) + `<path d="M92.4 -82.6q.9 -.3 1.1 .5q-.6 .4 -1.2 .1z" fill="#0a0605" opacity=".85"/>`;
  /* Mund: lange Spalte bis unter die Augenmitte, Unterlippe vorgeschoben; Lippen grau-rosa */
  s += W.L(["M96.6 -75.8q-2.8 .3 -5.6 .2q-2.4 .2 -4 .8"], "#1a100c", 0.24, 0.85) + W.L(["M96.4 -76.6q-2.6 .2 -5 .1"], "#c4a294", 0.12, 0.45) + W.L(["M95.6 -74.8q-2.2 .2 -4.2 0"], "#9a7a72", 0.14, 0.45);
  /* Auge: braun, Höhle, Oberlid deckt ~25 %, Tränensäcke; Wulst wirft Schatten */
  s += W.auge2(87.8, -88.4, 1.05, { iris: "#4a2a14", iris2: "#2a160a", sklera: "#3a2a20", offen: 0.82, winkel: 6, lidDeck: 0.25, lid: "#3a2e28", lidHell: "#8a7466",
    glanz: 0.6, karunkel: "#7a6064", hoehle: "#140c08", wimpern: 6, wimpernLaenge: 0.35 });
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
  W.dichte = T.fein ? 0.46 : 0.75;
  W.saumDichte = T.fein ? 0.64 : 1;
  const OR = [["#2a0e04", 0.12, 0.6], ["#4e1e0a", 0.12, 0.6], ["#743012", 0.12, 0.55], ["#9a461c", 0.11, 0.55], ["#c0642c", 0.11, 0.6], ["#e08a4a", 0.1, 0.6]];
  const HAUT = { n: "o", c: ["#2e2622", "#362c28", "#40342e"], cf: ["#1c1614", "#211a17", "#261e1a"], l: "#9a8678", lf: "#4e4038",
    g: [[0, "#4e3e36"], [0.55, "#342a25"], [1, "#181210"]], gf: [[0, "#2e2420"], [0.6, "#1c1614"], [1, "#0e0a08"]], na: "#7a6658", nf: "#3a302a", sohle: "#7a6a5c", polster: "#4a3e36" };
  const licht = (x, y) => clamp(0.2 + (-y - 25) / 80 - (x - 40) / 350);
  const wahl = (x, y) => 0.35 + licht(x, y) * 0.65;
  const hautG = (n, a, b, c) => T.lg("oh" + n, [[0, a], [0.55, b], [1, c]]);
  const haarTex = (n, w, box) => W.fell(n, w, box, { hell: "#c8682e", dunkel: "#1a0804", ho: 0.55, do: 0.5, fx: 2.2, fy: 0.14, hk: "o" });
  let s = "";
  /* Haarvorhang: lange, dünne, gewellte Haare (Strähnenbündel), dazwischen Haut */
  const vorhang = (pts, n, w, L, o = {}) => W.haare(pts, n, w, L, OR, Object.assign({ licht: (x, y) => clamp(licht(x, y) * 0.9 + (o.hell || 0)), buendel: 3, krumm: 0.5, streu: 12, szene: 0.1 }, o));

  /* ---------- ferne Glieder ---------- */
  s += orangFuss(W, T, -12, true, HAUT);
  const beinF = [[10, -44], [20, -40], [26, -32], [24, -22], [18, -14], [14, -9], [6, -9], [3, -16], [2, -26], [4, -36]];
  s += W.vol("obf", 2.6, W.teil(beinF, hautG("bf", "#3a1a0c", "#2a1208", "#140804"), haarTex("obf", 100, [0, -46, 27, -8]) + vorhang(beinF, 60, 100, 5, { hell: -0.25 }), { rand: 0 }) +
    W.saum([[2, -26], [3, -16], [6, -9], [14, -9]], 30, 96, 6, OR.slice(0, 3), { licht: () => 0.5, krumm: 0.5, szene: 0.1 }), { tiefe: 3, umgebung: 0.5 });
  s += orangHand(W, T, 108, true, HAUT);
  const armF = [[90, -88], [100, -86], [104, -74], [105, -60], [106, -46], [107.6, -34], [108.6, -24], [101.6, -24], [99.6, -34], [97, -48], [94, -62], [91, -76]];
  s += W.vol("oaf", 2.8, W.teil(armF, hautG("af", "#3c1c0e", "#2a1208", "#140804"), haarTex("oaf", 96, [90, -90, 110, -22]) + vorhang(armF, 110, 96, 6, { hell: -0.2 }), { rand: 0 }) +
    W.saum([[91, -76], [94, -62], [97, -48], [99.6, -34], [101.6, -24]], 50, 98, 11, OR.slice(0, 4), { licht: () => 0.45, krumm: 0.5, ein: 0.3, szene: 0.1 }) +
    W.saum([[108.6, -26], [105, -25], [101.6, -25]], 18, 92, 6, OR.slice(1, 4), { licht: () => 0.5, krumm: 0.4, ein: 0.3, szene: 0.1 }), { tiefe: 3, umgebung: 0.5 });

  /* ---------- Rumpf: Haut dunkelgrau, Haar schütter; Brust/Bauch fast nackt; Vorhänge hängen vom Bauch ---------- */
  const rumpf = [[2, -38], [3, -46], [8, -53], [20, -62], [36, -72], [52, -82], [66, -92], [76, -98], [86, -100], [94, -96], [98, -86], [98, -74], [94, -62], [86, -50], [72, -40], [56, -34], [40, -32],
    [26, -34], [14, -36]];
  const nackt = [[96, -80], [94, -64], [86, -51], [72, -41], [56, -35.4], [42, -33.6], [50, -40], [66, -46], [80, -56], [90, -68]];
  let rs = W.teil(rumpf, hautG("rf", "#5a2a12", "#40200e", "#1e0e06"),
    haarTex("orf", 140, [0, -102, 99, -30]) +
    W.weich([`<path d="${G(nackt)}" fill="#3e3430"/>`, [60, -36, 22, 3, 0, "#100c0a", 0.5], [86, -94, 10, 4, -10, "#c0703a", 0.3]], 2.4) +
    vorhang(rumpf, 420, (x, y) => (y > -48 ? 94 : x > 74 ? 116 : 140 - clamp((-y - 50) / 40) * 20), 6.5, {}) +
    W.haare(nackt, 50, 95, 4, OR.slice(1, 4), { buendel: 2, krumm: 0.5, szene: 0.05 }),
  { rand: 0 });
  rs += W.saum([[3, -46], [8, -53], [20, -62], [36, -72], [52, -82], [66, -92], [76, -98]], 70, (x) => (x < 6 ? 110 : 168), 4.4, OR, { licht: (x) => clamp(0.85 - x / 200), krumm: 0.5, szene: 0.1 });
  rs += W.saum([[94, -62], [86, -50], [72, -40], [56, -34], [40, -32], [26, -34]], 90, 93, 12, OR.slice(0, 4), { licht: () => 0.4, krumm: 0.55, ein: 0.25, laenge: (x) => 0.5 + clamp((x - 26) / 40) * 0.7, szene: 0.1 });
  s += W.vol("orf", 8, rs, { tiefe: 3, umgebung: 0.5 });

  /* ---------- nahes Hinterbein: kurz, stark gebeugt (Knie weit vorn) – Form nur über Haarrichtung und weiche Schatten ---------- */
  s += orangFuss(W, T, 0, false, HAUT);
  const beinN = [[8, -50], [20, -48], [30, -42], [37, -33], [38, -25], [34, -19], [28.6, -14], [24, -9.4], [16, -8.8], [14, -13], [16, -20], [12, -27], [6, -34], [3.6, -42]];
  s += W.vol("obn", 3.4, W.teil(beinN, hautG("bn", "#542610", "#3a1a0c", "#1a0c06"), haarTex("obn", 110, [2, -52, 40, -6]) +
    W.weich([[34, -30, 3, 6, -30, "#7a6458", 0.4], [12, -30, 4, 8, 20, "#0e0a08", 0.45]], 1.8) +
    vorhang(beinN, 200, (x, y) => (y < -30 ? 130 : 102), 5.5, {}),
  { rand: 0, maske: W.maske("obn", [-6, -56, 44, -4], 0, -46, 0, -34) }) +
    W.saum([[3.6, -42], [6, -34], [12, -27], [16, -20], [14, -13], [16, -8.8]], 50, 100, 7, OR.slice(0, 4), { licht: () => 0.45, krumm: 0.55, ein: 0.3, szene: 0.1 }), { tiefe: 3, umgebung: 0.5 });

  /* ---------- naher Arm: sehr lang; Haarvorhang hängt vom Ober- und Unterarm; Faust am Boden ---------- */
  s += orangHand(W, T, 82, false, HAUT);
  const armN = [[62, -86], [70, -92], [80, -95], [86, -88], [87.6, -76], [86.6, -64], [85.4, -54], [86, -44], [86.4, -34], [86.2, -24.6], [78, -24.6], [77, -34], [75.4, -44], [73, -54],
    [69.6, -64], [65, -74], [61, -82]];
  s += W.vol("oan", 3.2, W.teil(armN, hautG("an", "#5e2c14", "#40200e", "#1e0e06"), haarTex("oan", 98, [58, -100, 90, -22]) +
    W.weich([[76, -88, 8, 5, -15, "#d08848", 0.35], [66, -76, 3, 10, 10, "#0e0a08", 0.4], [84, -60, 2, 9, 0, "#c07a40", 0.3]], 1.8) +
    vorhang(armN, 300, (x, y) => (y < -64 ? (x < 72 ? 108 : 98) : 94), 7.5, { hell: 0.05 }),
  { rand: 0, vol: false, maske: W.maske("oan", [50, -104, 96, -10], 0, -96, 0, -84) }) +
    W.saum([[61, -82], [65, -74], [69.6, -64], [73, -54], [75.4, -44], [77, -34], [78, -26]], 170, (x, y) => 96 + (y < -60 ? 6 : 0), 16, OR.map(([c, w, o]) => [c, w * 1.4, o]), { licht: (x, y) => clamp(0.55 + (-y - 50) / 120), krumm: 0.55, ein: 0.25, laenge: (x, y) => 0.5 + clamp((-y - 24) / 50) * 0.8, szene: 0.1 }) +
    W.saum([[86.2, -26], [82, -25.4], [78, -25.4]], 26, 92, 6, OR.slice(1, 5), { licht: () => 0.55, krumm: 0.45, ein: 0.3, szene: 0.1 }), { tiefe: 3, umgebung: 0.5 });

  /* ---------- Brust/Hals unter dem Kopf: der Kehlsack liegt darauf (keine freie Unterkante) ---------- */
  const brust = [[90, -96], [100, -92], [112, -80], [121, -64], [122, -52], [114, -44], [104, -42], [96, -48], [92, -64]];
  s += W.vol("obr", 4, W.teil(brust, hautG("br", "#4a2210", "#341808", "#1a0a04"), haarTex("obr", 92, [88, -98, 124, -40]) +
    vorhang(brust, 120, 92, 7, { hell: -0.1 }), { rand: 0 }) +
    W.saum([[122, -54], [114, -44], [104, -42], [96, -46]], 50, 92, 9, OR.slice(0, 4), { licht: () => 0.45, krumm: 0.5, ein: 0.3, szene: 0.1 }), { tiefe: 3, umgebung: 0.5 });

  /* ---------- Kopf (¾ zum Betrachter gedreht) ---------- */
  s += orangKopf(T, W, OR, licht);
  return W.fertig(s, 1, [86, -117, 130, -46], [10, 28, 82, 108]);
}

/* Faustgang-Hand: Handgelenk gestreckt, Hand zur Faust geschlossen, die Rücken der Grundglieder liegen am Boden;
   lange, schmale Hand (Mittelhand senkrecht), kurzer Daumen, Gelenkfalten, flache Nägel an den eingerollten Spitzen. */
function orangHand(W, T, wx, fern, pal) {
  const C = fern ? pal.cf : pal.c, LI = fern ? pal.lf : pal.l;
  if (!T.fein) return `<path d="${G([[wx - 4, -26], [wx + 4, -26], [wx + 5, -10], [wx + 6, -2.6], [wx + 4, 0, 1], [wx - 5, 0, 1], [wx - 5.4, -4], [wx - 4.6, -14]])}" fill="${C[1]}"/>`;
  let s = "";
  /* Mittelhand (lang, schmal, senkrecht) */
  const mh = [[wx - 4, -26], [wx + 4, -26], [wx + 4.6, -16], [wx + 5, -9], [wx - 4.8, -9], [wx - 4.6, -16]];
  s += W.teil(mh, T.lg("omh" + (fern ? "f" : ""), fern ? pal.gf : pal.g, 0, 0, 1, 0.3),
    W.weich([[wx - 1.6, -19, 2, 5, 0, LI, fern ? 0.2 : 0.4], [wx + 4, -16, 1, 6, 0, "#000", 0.5]], 0.8) +
    W.falten([`M${f1(wx - 3)} -20q2 -.5 4 0`, `M${f1(wx - 2.6)} -17.6q2 -.4 4.2 .2`], 0.1, "#000", LI, 0.55, 0.25), { rand: 0.45, vol: false });
  /* Faust: vier Fingerreihen, Rücken der Grundglieder flach am Boden (vorn), eingerollte Spitzen hinten mit Nägeln */
  const faust = [[wx - 5, -10.4], [wx + 5, -10.4], [wx + 6.4, -6.6], [wx + 6.6, -2.4], [wx + 5, 0, 1], [wx - 4, 0, 1], [wx - 5.8, -2.4], [wx - 6, -6.6]];
  s += W.teil(faust, T.lg("ofa" + (fern ? "f" : ""), fern ? pal.gf : pal.g, 0, 0, 0.6, 1),
    W.weich([[wx + 3, -8, 2.6, 1.6, 0, LI, fern ? 0.15 : 0.45], [wx, -1, 6, 1, 0, "#000", 0.6]], 0.6) +
    /* Fingergrenzen (Grundglieder) und Knöchelreihe */
    W.L([`M${f1(wx + 2.4)} -9.6q.4 4 .2 9`, `M${f1(wx - 0.4)} -9.8q.3 4.2 .1 9.4`, `M${f1(wx - 3)} -9.6q.2 4 0 9`], "#000", 0.16, 0.6) +
    W.falten([`M${f1(wx + 3.6)} -7.6q1 .3 1.6 1.2`, `M${f1(wx + 0.8)} -7.8q1 .3 1.6 1.2`, `M${f1(wx - 1.8)} -7.6q1 .3 1.6 1.2`, `M${f1(wx + 4.4)} -4.4q.8 .2 1.4 .9`], 0.09, "#000", LI, 0.6, 0.3),
  { rand: 0.5, vol: false });
  for (const dx of [-4.6, -2.2, 0.4]) s += `<ellipse cx="${f1(wx + dx)}" cy="-.7" rx=".9" ry=".45" fill="${fern ? pal.nf : pal.na}"/>`;
  /* Daumen: kurz, seitlich, nicht am Boden */
  s += W.glied([[wx - 4.4, -14], [wx - 6, -11.4], [wx - 6.2, -9.6]], 2, C[0], "") + `<ellipse cx="${f1(wx - 6.3)}" cy="-9.9" rx=".5" ry=".65" fill="${fern ? pal.nf : pal.na}"/>`;
  return s;
}

/* Fuß: handähnlich, lange eingerollte Zehen, Auftritt auf der Außenkante, Sohle (hell, faltig) halb sichtbar, winzige
   Großzehe ohne Nagel. dx = Versatz, fern = Schattenseite */
function orangFuss(W, T, dx, fern, pal) {
  const P = (x, y) => [x + dx, y];
  const C = fern ? pal.cf : pal.c, LI = fern ? pal.lf : pal.l;
  if (!T.fein) return `<path d="${G([P(18, -12), P(14.6, -6), P(16, -1), P(20, 0, 1), P(34, 0, 1), P(35.4, -3), P(30, -7), P(24, -10)])}" fill="${C[1]}"/>`;
  let s = "";
  const fuss = [P(18.6, -12.4), P(15.4, -9), P(15, -4), P(17.6, -0.6), P(22, 0, 1), P(30, -0.4), P(33, -2.6), P(32, -6.4), P(28, -9), P(23, -11.6)];
  s += W.teil(fuss, T.lg("ofu" + (fern ? "f" : ""), fern ? pal.gf : pal.g),
    /* Sohle halb sichtbar: hell, faltig */
    `<path d="${G([P(16, -5), P(19, -2.4), P(25, -1.6), P(31.4, -2.8), P(31, -5.4), P(25, -4.8), P(19.4, -6.6)])}" fill="${fern ? "#3a302a" : "#7a6a5c"}"/>` +
    W.falten(["M18.6 -5.4q1.4 1 1.6 2.6", "M21.6 -5.2q1.2 1 1.2 2.6", "M24.6 -4.8q1 1 1 2.4", "M27.6 -4.6q.8.8.8 2"].map((d) => d.replace(/^M([\d.]+)/, (m, x) => "M" + f1(+x + dx))), 0.1, "#2a1e18", LI, 0.6, 0.3),
  { rand: 0.5, vol: false });
  /* lange, eingerollte Zehen (Spitzen unten, Nägel) */
  for (const [bx, by, b] of [[29.6, -6.4, 2.2], [31, -5, 2.1], [32, -3.6, 2]]) {
    s += W.glied([P(bx, by), P(bx + 3.4, by + 0.4), P(bx + 4.4, by + 2.4), P(bx + 3.4, by + 3.6)], b, C[1], fern ? "" : LI, { la: 0.25 }) +
      `<ellipse cx="${f1(bx + 3.2 + dx)}" cy="${f1(by + 3.8)}" rx=".55" ry=".35" fill="${fern ? pal.nf : pal.na}"/>`;
  }
  /* winzige Großzehe hinten am Fußrand, ohne Nagel */
  s += W.glied([P(20, -5.6), P(21.6, -3.6)], 1.6, C[0], "");
  return s;
}

/* Kopf (¾ zum Betrachter): zwei halbmondförmige Backenwülste (nah breit, fern schmal) seitlich; hohe Stirn mit aufgestelltem
   rotem Scheitelhaar; eng stehende Augen mit dicken Oberlidern; flache Nase mit zwei ovalen Löchern; breite vorgewölbte
   Schnauze, hohe Oberlippe mit Fältchen, dicke Unterlippe; Kehlsack geht breit in die Brust über, Bart darüber. */
function orangKopf(T, W, OR, licht) {
  let s = "";
  /* Kehlsack: weicher Beutel, geht breit in Hals und Brust über (keine freie Unterkante) */
  const sack = [[94, -70], [97, -62], [98, -54], [103, -48.6], [112, -47.4], [119, -50], [122, -57], [121.4, -66], [110, -70]];
  s += W.vol("osack", 4, W.teil(sack, T.rg("osack", [[0, "#5a4a40"], [0.6, "#3e3430"], [1, "#2a221e"]], 0.4, 0.3, 0.7),
    W.weich([[108, -64, 9, 3, 0, "#0e0a08", 0.6], [104, -54, 5, 4, -20, "#7a665a", 0.35]], 1.4) +
    W.haare(sack, 110, 92, 5, OR.slice(1, 5), { buendel: 2, krumm: 0.5, szene: 0.05 }), { rand: 0 }), { tiefe: 2, umgebung: 0.55 });
  /* Scheitelhaar (aufgestellt, rot) hinter/über dem Gesicht */
  const sch = [[91, -97], [95, -103.6], [101, -107], [110, -108], [118, -105.6], [120.6, -101.4], [117, -100.4], [110, -102.4], [101, -101], [95, -95]];
  s += W.vol("osch", 3, W.teil(sch, T.lg("osch", [[0, "#6a2a10"], [1, "#2e1006"]]),
    W.haare(sch, 160, (x, y) => (x < 104 ? 225 : 270 - (x - 106) * 2), 3, OR, { licht: (x, y) => clamp(0.3 + (-y - 98) / 16), buendel: 2, krumm: 0.45, szene: 0.1 }), { rand: 0 }) +
    W.saum([[91, -99], [95, -106], [101, -109], [110, -110.4], [118, -108], [121, -102]], 110, (x) => (x < 104 ? 230 : 275 - (x - 106) * 1.5), 4.6, OR, { licht: (x, y) => 0.6, krumm: 0.5, ein: 0.3, szene: 0.1 }), { tiefe: 2, umgebung: 0.55 });
  /* Stirn + Gesicht zwischen den Wülsten */
  const ges = [[104, -104], [112, -105], [118.4, -101], [119.6, -92], [119.6, -82], [121.6, -74], [121, -67], [116, -63.4], [110, -62.6], [104.4, -64], [101, -69], [101.4, -78], [102, -88], [101.6, -97]];
  let g = `<path d="${G(ges)}" fill="${T.lg("oge", [[0, "#4a3c34"], [0.35, "#3e322c"], [0.6, "#5a4a42"], [1, "#3a2e28"]], 0, -105, 0, -62, UB)}"/>`;
  g += W.weich([
    /* Schnauze als Kugelfläche: Lichtkante oben, Seiten im Schatten; Augenpartie dunkel unter der Stirnkante */
    [111.6, -74.6, 6.6, 3.6, 0, "#7a665a", 0.6], [111.4, -78.4, 4.6, 1.4, 0, "#9a8474", 0.5], [104.6, -73, 1.8, 6, 0, "#140e0c", 0.5], [119.2, -73, 1.4, 5, 0, "#140e0c", 0.45],
    [110.6, -90.8, 7, 1.6, 0, "#140e0c", 0.6], [110.6, -99, 6, 3, 0, "#6a5a50", 0.45],
  ], 0.8);
  g += W.falten(["M105.4 -101q5 -1.4 10.4 0", "M105 -98.8q5 -1.2 10.8 .2", "M106 -96.6q4 -.8 8.6 .2",
    "M105.4 -86.2q1.8 1.4 4 .6", "M105.8 -84.8q1.6 1 3.4.4", "M112.6 -86.4q1.6 1.2 3.4 .4",
    "M108.4 -79q-1.2 2.6 -.4 5.4", "M115.4 -79q1.2 2.6 .4 5.4", "M109.8 -76.6l-.2 1.8", "M111.2 -76.8v1.9", "M112.6 -76.8l.1 1.9", "M114 -76.6l.2 1.7", "M108.4 -66.4q3.4 .8 6.8 0"],
    0.12, "#1a1210", "#b09a8a", 0.65, 0.35);
  /* Augen: eng (Abstand ≈ Augenbreite), dicke helle Oberlider, Tränensäcke, Schatten der Stirnkante */
  const aug = { iris: "#3a2010", iris2: "#160a04", sklera: "#3a2a20", offen: 0.75, lidDeck: 0.3, lid: "#5a4a42", lidHell: "#a08c7e", glanz: 0.55, karunkel: "#6a5458", hoehle: "#1a120e" };
  g += W.auge2(107.4, -88.6, 1.4, Object.assign({ winkel: 3 }, aug));
  g += `<g transform="translate(114.6 -88.6) scale(.82 1) translate(-114.6 88.6)">` + W.auge2(114.6, -88.6, 1.32, Object.assign({ winkel: -3 }, aug)) + `</g>`;
  g += W.falten(["M105.6 -86.4q2 .9 4 .1", "M112.6 -86.4q1.8.8 3.4 0"], 0.08, "#1a1210", "#a08c7e", 0.5, 0.3);
  /* Nase: flach auf breitem Steg, zwei schräge ovale Nasenlöcher */
  g += W.weich([[111.2, -83.4, 1.8, 1, 0, "#7a665a", 0.45]], 0.3) +
    `<ellipse cx="109.8" cy="-81.4" rx=".62" ry=".36" transform="rotate(25 109.8 -81.4)" fill="#0a0605"/><ellipse cx="112.6" cy="-81.4" rx=".55" ry=".34" transform="rotate(-25 112.6 -81.4)" fill="#0a0605"/>`;
  /* Mund: breit, leicht nach unten gebogen; dicke Unterlippe */
  g += W.L(["M105.4 -70.4q3 -.6 6.2 -.4q3 .2 5.8 1"], "#1a100c", 0.3, 0.9) + W.L(["M106.4 -71.6q2.8 -.5 5.6 -.4q2.4 .2 4.6 .8"], "#b09a8a", 0.12, 0.45) +
    `<path d="${G([[106.6, -69.6], [111.6, -69.4], [116.4, -69], [115.4, -67.4], [111.4, -66.6], [107.4, -67.4]])}" fill="#5a4840" opacity=".7"/>` + W.L(["M108 -67q3.4 .6 6.6 0"], "#a08a7c", 0.12, 0.4);
  s += g;
  /* Backenwülste: Halbmonde von der Schläfe bis zum Mundwinkel, Außenrand unregelmäßig; oben außen hell, zur Mitte konkav
     mit Kernschatten; kurze, spärliche Borsten */
  const wulst = (pts, n, hell, schatten, name) => W.vol(name, 2.4, W.teil(pts, T.lg("ow" + name, [[0, "#5a4038"], [0.45, "#4a3630"], [1, "#2a1c18"]], 0, 0, 0.4, 1),
    W.weich([[hell[0], hell[1], hell[2], hell[3], 0, "#9a7a6a", 0.5], [schatten[0], schatten[1], schatten[2], schatten[3], 0, "#140e0c", 0.55]], 1.4) +
    W.fell("ow" + name, 100, T.box(pts), { hell: "#a8562a", dunkel: "#1a0c06", ho: 0.45, do: 0.4, fx: 4, fy: 1.2, hk: "ow", licht: false }) +
    W.haare(pts, n, (x, y) => (y < -86 ? 250 : 110), 1.1, [["#3a1608", 0.08, 0.6], ["#6a2c12", 0.08, 0.6], ["#9a4a20", 0.07, 0.55], ["#c06a34", 0.07, 0.55]], { licht: (x) => clamp(0.8 - (x - 90) / 18), mix: 0.6, gerade: true, szene: 0.05 }), { rand: 0 }),
    { tiefe: 2, umgebung: 0.55 });
  s += wulst([[100, -103], [95, -100], [91, -92], [89.6, -82], [91, -72], [95.4, -65], [101, -64.4], [103, -68], [101.4, -78], [102, -88], [102.4, -98]], 200, [93.6, -90, 2.4, 7], [101, -78, 1.6, 9], "n");
  s += wulst([[118.4, -102], [122.6, -98], [125, -90], [125.4, -80], [123.6, -71], [120.4, -66], [121.6, -72], [120.4, -82], [119.8, -92]], 70, [122.6, -92, 1.2, 5], [120.4, -80, 1, 6], "f");
  s += W.saum([[100, -103], [95, -100], [91, -92], [89.6, -82], [91, -72], [95.4, -65]], 60, (x, y) => (y < -86 ? 210 : 165), 1.6, [["#3a1608", 0.08, 0.6], ["#6a2c12", 0.08, 0.6], ["#9a4a20", 0.07, 0.55]], { mix: 1, gerade: true, ein: 0.5, szene: 0.05 });
  s += W.saum([[122.6, -98], [125, -90], [125.4, -80], [123.6, -71]], 30, (x, y) => (y < -88 ? 330 : 15), 1.4, [["#3a1608", 0.08, 0.6], ["#6a2c12", 0.08, 0.6], ["#9a4a20", 0.07, 0.55]], { mix: 1, gerade: true, ein: 0.5, szene: 0.05 });
  /* Bart: rotbraune Strähnen vom Kinn über den Kehlsack */
  s += W.saum([[100, -64], [104, -63], [110, -62], [116.6, -63], [121, -65.4]], 90, (x) => 90 - (x - 112) * 1.4, 10, OR.slice(1), { licht: () => 0.65, krumm: 0.5, ein: 0.2, szene: 0.1 });
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
  W.dichte = T.fein ? 1 : 0.8;
  const SILBER = [["#4a4642", 0.12, 0.55], ["#706b66", 0.12, 0.55], ["#96918a", 0.11, 0.55], ["#bab6ae", 0.11, 0.6], ["#d8d5ce", 0.1, 0.6], ["#f2f0ea", 0.1, 0.65]];
  const OLIV = [["#3a352c", 0.1, 0.55], ["#58523f", 0.1, 0.55], ["#7a735e", 0.1, 0.55], ["#9a937c", 0.09, 0.55], ["#bdb69e", 0.09, 0.6]];
  const licht = (x, y) => clamp(0.3 + (-y - 30) / 55 - (x - 60) / 300);
  const HAUT = "#2e2a28";
  let s = "";

  /* ---------- Hinterbein (Oberschenkel schräg vor, Knie, Unterschenkel zurück, Sprunggelenk, Fuß mit leicht
     angehobener Ferse) ---------- */
  const hinter = (dx, fern) => {
    const P = (x, y) => [x + dx, y];
    const pts = [P(30, -50), P(42, -50), P(50, -42), P(53.6, -32), P(52.4, -25), P(48, -18), P(45.6, -11), P(45.4, -6), P(41.4, -5.2), P(40.6, -10), P(40.2, -17), P(42.4, -24), P(38, -31), P(32, -38)];
    let b = W.teil(pts, fern ? "#4a4538" : T.lg("pbn", [[0, "#8e8672"], [0.6, "#6c6554"], [1, "#4a4438"]], 0, 0, 1, 0.4),
      W.fell(fern ? "pbf" : "pbn", 100, [30, -52, 55, -4], { hell: "#e0dac6", dunkel: "#2a261e", ho: fern ? 0.15 : 0.3, do: 0.3, fx: 3.4, fy: 0.45, hk: "p" }) +
      W.weich(fern ? [] : [[52, -32, 1.4, 4, -20, "#e8e0cc", 0.45], [44.6, -12, 1, 5, 0, "#2a261e", 0.45], [40, -30, 2.4, 6, 30, "#2a261e", 0.4]], 1.2) +
      W.haare(pts, fern ? 40 : 90, (x, y) => (y < -30 ? 115 : 98), 1.4, OLIV, { licht: (x, y) => licht(x, y) * (fern ? 0.5 : 1), gerade: true, szene: 0.06 }), { rand: 0 });
    /* Fuß: lange Sohle, Ferse leicht angehoben, gegliederte Zehen, abgesetzte Großzehe */
    const fuss = [P(41, -6.4), P(45.8, -6.6), P(49, -4.6), P(54, -2.8), P(58.6, -1.6), P(59.4, -0.4), P(58, 0, 1), P(46, 0, 1), P(43, -1.2), P(41, -3)];
    b += W.teil(fuss, fern ? "#1e1a18" : T.lg("pfu", [[0, "#4a4440"], [0.6, HAUT], [1, "#141210"]]),
      fern ? "" : W.falten([`M${f1(50 + dx)} -4.6q.8 1.4 .6 3.6`, `M${f1(52.6 + dx)} -3.6q.8 1.2 .6 3`, `M${f1(55 + dx)} -2.8q.6 1 .4 2.4`, `M${f1(43.6 + dx)} -4.6q1.6 .4 3 -.2`], 0.1, "#000", "#9a8e86", 0.65, 0.3) +
        W.weich([[47 + dx, -4.4, 3, 1, -10, "#8a7e76", 0.4]], 0.5), { rand: 0.45, vol: false });
    if (!fern) b += W.glied([P(46, -2.4), P(49.4, -1.2)], 1.6, "#26221f", "") +
      `<ellipse cx="${f1(58.4 + dx)}" cy="-1.2" rx=".6" ry=".3" fill="#6a605a"/><ellipse cx="${f1(56 + dx)}" cy="-1.9" rx=".5" ry=".28" fill="#6a605a"/><ellipse cx="${f1(49.6 + dx)}" cy="-1.3" rx=".45" ry=".26" fill="#5a524c"/>`;
    return b;
  };
  /* ---------- Vorderbein: Unterarm mit Muskelspindel, Knick am Handgelenk; Hand halb fingergängig ---------- */
  const vorder = (dx, fern) => {
    const P = (x, y) => [x + dx, y];
    const pts = [P(90, -46), P(101, -46), P(102.6, -38), P(101.4, -28), P(100, -18), P(99.6, -11), P(94.6, -11), P(94, -18), P(92.6, -28), P(91, -38)];
    let b = W.teil(pts, fern ? "#56524c" : T.lg("pvn", [[0, "#aaa69e"], [0.5, "#807c76"], [1, "#56524c"]], 0, 0, 1, 0.3),
      W.fell(fern ? "pvf" : "pvn", 96, [89, -48, 104, -9], { hell: "#eeeae2", dunkel: "#2a2826", ho: fern ? 0.15 : 0.3, do: 0.3, fx: 3.4, fy: 0.45, hk: "p" }) +
      W.weich(fern ? [] : [[100.6, -34, 1.6, 7, -4, "#eeeae2", 0.4], [93, -26, 1.4, 8, 4, "#2a2826", 0.4]], 1.2) +
      W.haare(pts, fern ? 30 : 70, 96, 1.6, SILBER, { licht: (x, y) => licht(x, y) * (fern ? 0.5 : 1), gerade: true, szene: 0.06 }), { rand: 0 });
    /* Hand: Mittelhand ≈ 45° angehoben, Ballen frei, 4 Finger flach am Boden, kurze dunkle Nägel */
    const hand = [P(94.6, -11.4), P(99.8, -11.4), P(101.4, -8), P(104.6, -4.4), P(106, -2.6), P(101.4, -1.6), P(97, -5), P(95, -8)];
    b += W.teil(hand, fern ? "#1e1a18" : T.lg("pha", [[0, "#4a4440"], [0.6, HAUT], [1, "#141210"]], 0, 0, 1, 1),
      fern ? "" : W.falten([`M${f1(97.6 + dx)} -9q1.6 -.4 3 .4`, `M${f1(99.4 + dx)} -6.4q1.4 -.2 2.6 .6`], 0.1, "#000", "#9a8e86", 0.6, 0.3), { rand: 0.45, vol: false });
    for (let i = 0; i < 4; i++) {
      const fx = 103.6 - i * 1.2 + dx, ex = 110.2 - i * 1.6 + dx;
      b += W.glied([[fx, -2.6 + i * 0.15], [ex - 2, -1], [ex, -0.8]], 1.6 - i * 0.05, fern ? "#1a1614" : ["#2a2522", "#2e2926", "#332d29", "#38322e"][i], fern ? "" : "#8a7e76", { la: 0.3 });
      b += `<ellipse cx="${f1(ex + 0.1)}" cy="-1.3" rx=".55" ry=".3" fill="${fern ? "#3a3430" : "#6a605a"}"/>`;
      if (!fern && T.fein) b += W.L([`M${f1(ex - 2.6)} -1.9v1`], "#000", 0.1, 0.6);
    }
    return b;
  };
  s += W.vol("v", 2.6, hinter(-8, true)) + W.vol("v", 2, vorder(8, true));

  /* ---------- Schwanz: Wurzel hinten am Becken über den Schwielen, steigt 35° nach hinten oben, Knick, fällt ab;
     an der Basis dick, gleichmäßig verjüngt; kleine dunkle Quaste ---------- */
  const sw = rohr([[31, -50, 2.6, 2.6], [26.6, -55, 2.4, 2.4], [22, -59, 2.2, 2.2], [17.6, -60.4, 2, 2], [14.4, -58, 1.8, 1.8], [12.6, -52, 1.6, 1.6], [11.6, -44, 1.4, 1.4], [11, -36, 1.2, 1.2],
    [10.8, -31, 1.1, 1.1]]);
  s += W.vol("v", 1.2, W.teil(sw.pts, T.lg("psw", [[0, "#a49c86"], [0.5, "#7a735e"], [1, "#4e4838"]], 0, 0, 1, 0.6),
    W.haare(sw.pts, 80, (x, y) => (x > 18 ? 205 : 98), 1.2, OLIV, { licht: (x, y) => clamp(0.8 - (y + 60) / 40 - (x < 14 ? 0.2 : 0)), gerade: true, szene: 0.06 }), { rand: 0 }) +
    W.saum(sw.V.slice(1, 6), 30, (x) => (x > 18 ? 220 : 160), 1.2, OLIV.slice(2), { licht: () => 0.8, gerade: true, szene: 0.05 }));
  s += W.haare([[9.6, -32], [12, -32], [12.4, -27], [11, -24], [9.6, -27]], 40, 96, 4.6, [["#2a261e", 0.08, 0.7], ["#3e382c", 0.08, 0.65], ["#5a5444", 0.07, 0.6]], { mix: 1, krumm: 0.3, szene: 0.1 });

  /* ---------- Hinterkörper: Becken und Gesäß als EINE Masse; Gesäßfläche hinten mit Schwielen ---------- */
  const rumpf = [[27.6, -46], [28.6, -52], [33, -56.6], [44, -59.6], [56, -62], [70, -66], [86, -68], [100, -62], [101, -50], [92, -40], [78, -35], [62, -33], [46, -33], [36, -36], [30, -40]];
  let rs = W.teil(rumpf, T.lg("prf", [[0, "#9a927c"], [0.45, "#746d5a"], [1, "#4a4438"]]),
    W.fell("prf", 175, [26, -70, 102, -30], { hell: "#e0dac6", dunkel: "#2a261e", ho: 0.3, do: 0.3, fx: 3.4, fy: 0.45, hk: "p" }) +
    W.weich([[60, -36, 22, 3, 0, "#1a1712", 0.45], [56, -34.4, 16, 1, 0, "#a8a088", 0.4], [40, -42, 6, 7, 0, "#2a261e", 0.35]], 2) +
    W.haare(rumpf, 220, (x, y) => (y > -40 ? 100 : 185), 1.4, OLIV, { licht, gerade: true, buendel: 2, szene: 0.06 }), { rand: 0 });
  /* Gesäß: leuchtend rote nackte Haut, weich ins Fell auslaufend; darin die matte, grau-rosa, hornige Schwiele mit Rillen */
  rs += W.weich([`<path d="${G([[27, -50], [30.4, -52], [33.6, -48], [34, -40], [31.4, -36.4], [28, -38], [26.6, -44]])}" fill="#c2403c"/>`], 0.8) +
    `<path d="${G([[27.6, -48.4], [29.6, -49.6], [31.4, -46.6], [31.4, -41.4], [29.6, -39.2], [27.8, -40.6], [27.2, -44.6]])}" fill="${T.lg("psch", [[0, "#c8a8a2"], [1, "#8e6a68"]], 0, 0, 1, 0)}"/>` +
    W.L(["M28.4 -47.6q.8 3 0 6.4", "M29.4 -48q1 3.4 .2 7.4", "M30.4 -46.4q.6 2.6 0 5"], "#6a4a48", 0.1, 0.6) + W.L(["M28 -48.2q-.4 3 .2 6"], "#f0dcd6", 0.1, 0.5) +
    W.saum([[27, -51], [26.6, -44], [28, -37.6], [31.4, -36]], 30, (x, y) => (y < -44 ? 200 : 150), 1.2, OLIV.slice(1, 4), { licht: () => 0.5, gerade: true, ein: 0.6, szene: 0.05 });
  s += W.vol("v", 6, rs);

  /* ---------- nahe Beine ---------- */
  s += W.vol("v", 3, hinter(0, false)) + W.vol("v", 2.4, vorder(0, false));

  /* ---------- Mantel: lange, gewellte Silberhaare vom Kopf über Schulter und Brust nach hinten unten; Hinterkante
     dünn auslaufend; oben Licht, unten Schlagschatten auf dem Oberarm ---------- */
  const mantel = [[52, -54], [54, -62], [60, -68], [70, -74], [82, -78], [94, -78], [104, -74], [110, -66], [111, -56], [107, -46], [100, -38], [92, -36], [84, -40], [74, -44], [64, -46]];
  const mW = (x, y) => (y < -60 ? 160 - (x - 52) * 0.25 : 115 - (x - 80) * 0.4);
  s += W.vol("v", 6, W.teil(mantel, T.lg("pmt", [[0, "#c8c4bc"], [0.45, "#a09c94"], [1, "#5e5a54"]]),
    W.fell("pmt", 140, [50, -80, 112, -34], { hell: "#f6f4ee", dunkel: "#2a2826", ho: 0.35, do: 0.3, fx: 2.4, fy: 0.2, hk: "pm" }) +
    W.weich([[80, -72, 16, 4, -10, "#f6f4ee", 0.4], [92, -40, 14, 4, 0, "#1a1816", 0.45]], 2.4) +
    W.haare(mantel, 420, mW, 9, SILBER, { licht, buendel: 3, krumm: 0.5, streu: 10, szene: 0.06 }), { rand: 0 }) +
    W.saum([[54, -62], [60, -68], [70, -74], [82, -78], [94, -78]], 70, (x) => 175 - (x - 54) * 0.2, 6, SILBER.slice(2), { licht: () => 0.85, krumm: 0.5, szene: 0.06 }) +
    W.saum([[52, -54], [64, -46], [74, -44], [84, -40], [92, -36], [100, -38], [107, -46]], 110, (x) => (x < 70 ? 140 : 100), 10, SILBER, { licht: (x) => clamp(0.3 + (x - 52) / 120), krumm: 0.5, ein: 0.3, szene: 0.06 }));

  /* ---------- Kopf ---------- */
  s += pavianKopf(T, W, SILBER, licht);
  return W.fertig(s, 1, [100, -84, 140, -40], [43, 52, 105, 114]);
}

/* Kopf: heller, nach hinten gekämmter Backenbart rahmt das Gesicht; Scheitelhaar; nackte rosa Kastenschnauze mit
   Längswülsten; Nasenlöcher vorn; Wulst mit Schatten; weißes Oberlid direkt über der goldbraunen Iris. */
function pavianKopf(T, W, SILBER, licht) {
  let s = "";
  /* Haarmasse: Scheitel + Backenbart, nach hinten gekämmt, geht in den Mantel über */
  const haar = [[98, -64], [100, -74], [106, -80], [114, -80.4], [118.6, -76], [119, -70], [117, -60], [116, -50], [112, -44], [104, -42], [99, -50]];
  s += W.vol("v", 4, W.teil(haar, T.lg("phr", [[0, "#dedad2"], [0.6, "#b4b0a8"], [1, "#7a766e"]]),
    W.fell("phr", 175, [96, -82, 120, -40], { hell: "#faf8f2", dunkel: "#3a3836", ho: 0.35, do: 0.25, fx: 2.6, fy: 0.24, hk: "pm" }) +
    W.haare(haar, 260, (x, y) => (y < -70 ? 186 + (x - 110) * 0.6 : 176 + (y + 60) * 0.6), 6, SILBER, { licht: (x, y) => clamp(0.55 + (-y - 60) / 40), buendel: 3, krumm: 0.45, streu: 10, szene: 0.06 }),
  { rand: 0 }) + W.saum([[100, -74], [106, -80], [114, -80.4], [118.6, -76]], 40, (x) => (x < 110 ? 190 : 205), 4, SILBER.slice(3), { licht: () => 0.9, krumm: 0.45, szene: 0.06 }));
  /* Scheitel (Mittelscheitel) als feine dunklere Linie */
  s += W.L(["M118 -75q-6 -3.4 -14 -3"], "#8a8680", 0.25, 0.5);
  /* nackte Gesichtshaut: Stirn unter dem Wulst, kastenförmige Schnauze (Ober- und Unterkante fast parallel),
     Kiefer; Nasenspitze steht 1,5 cm über die Oberlippe */
  const ges = [[112.4, -72], [117, -70], [118.6, -67.4], [117.6, -65.6], [121, -63.6], [128, -60.6], [134, -58.6], [137.2, -57.4], [138.4, -55.6], [137.8, -53.6], [136.2, -52.8], [136.4, -50.6],
    [135, -48.8], [130, -47.6], [123, -46.6], [117, -46.2], [112.6, -48], [110.6, -54], [110.2, -63]];
  s += W.vol("v", 2, W.teil(ges, T.lg("pge", [[0, "#e0907e"], [0.35, "#cc7464"], [0.7, "#a85448"], [1, "#6a3230"]], 0, 0, 0, 1),
    /* Längswülste der Schnauze: Licht-/Schattenbänder vom Auge zur Nase */
    W.weich([[127, -59.6, 9, 1.2, 18, "#f8c8b8", 0.7], [127.6, -57, 9, 0.9, 14, "#7a3432", 0.55], [128, -54.6, 8.6, 1, 10, "#f0b4a4", 0.5], [128.4, -52.4, 8, 0.8, 6, "#7a3432", 0.5],
      [124, -48.4, 9, 1.6, 2, "#4a2220", 0.6], [116, -60, 3, 3, 0, "#5a2826", 0.5], [116.4, -68.4, 3.6, 1, 15, "#f6c8b8", 0.6]], 0.7) +
    (T.fein ? W.falten(["M119.6 -60.4q6.4 3 14.6 4.4", "M119.2 -57.6q6.4 2.2 14 3", "M118.6 -55q6 1.6 13 2", "M112.4 -67q2.6 -.6 5 .2", "M113.6 -52q2 2 4.6 2.4"], 0.12, "#6a2c28", "#ffd8cc", 0.6, 0.4) : ""),
  { rand: 0 }));
  /* Nase: Spitze leicht überstehend, zwei kommaförmige Nasenlöcher nach vorn/seitlich */
  s += `<path d="${G([[135.4, -57.8], [137.8, -57], [138.8, -55.4], [138.2, -53.8], [136.6, -54], [135.6, -55.6]])}" fill="#8a3e38"/>` +
    `<path d="M137 -56.2q1.2 0 1.4 1.1q-.7 .3 -1.3 -.2zM135.9 -55.4q.9 .2 .9 1.1q-.6 .1 -1 -.4z" fill="#1a0806"/>` + W.L(["M136 -57.6q1.4 .1 2 1"], "#ffd8cc", 0.12, 0.5);
  /* Maul: lange Spalte bis unter das Auge, dünne Lippen, Oberlippe über dem Eckzahn leicht gewölbt */
  s += W.L(["M136 -51.6q-3 .6 -6.4 .8q-4 .5 -7.6 1.6q-2.6 .8 -4.6 2.2"], "#3a1614", 0.24, 0.85) + W.L(["M135.6 -52.4q-3 .5 -6.4 .7q-4 .4 -7.4 1.4"], "#f0b8a8", 0.12, 0.45) +
    W.weich([[124, -51.6, 2.6, 1, 10, "#f0b0a0", 0.5]], 0.4);
  /* Auge: unter dem Wulst, teilweise verdeckt; weißes Oberlid IST das Lid (Halbmond direkt über der Iris) */
  s += W.auge2(115, -64.2, 0.95, { iris: "#9a6a2a", iris2: "#4a2a0c", sklera: "#3a2420", offen: 0.75, winkel: 16, lidDeck: 0.3, lid: "#e8e0d4", lidHell: "#ffffff",
    glanz: 0.7, karunkel: "#8a5a5a", hoehle: "#5a2826" });
  s += W.weich([[115.4, -66.8, 3.6, 0.9, 16, "#3a1614", 0.55]], 0.4);
  /* Backenbart greift weich über den Gesichtsrand */
  s += W.saum([[110.6, -70], [109.8, -62], [110, -54], [112.4, -47.6], [116, -45.6]], 60, (x, y) => (y < -60 ? 190 : y < -50 ? 182 : 168), 2.4, SILBER.slice(2), { licht: () => 0.85, ein: 0.75, gerade: true, szene: 0.05 });
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
  const sz = T.fein ? 0.9 : 0.4;
  const GRAU = [["#3a3634", 0.07, 0.55], ["#5e5854", 0.07, 0.55], ["#86807a", 0.06, 0.55], ["#aaa49e", 0.06, 0.55], ["#cdc8c2", 0.055, 0.6], ["#eeebe6", 0.05, 0.65]];
  const RUECKEN = [["#3e3028", 0.07, 0.55], ["#64524a", 0.07, 0.55], ["#8a766a", 0.06, 0.55], ["#ab988a", 0.06, 0.55], ["#cbbcae", 0.055, 0.6]];
  const licht = (x, y) => clamp(0.3 + (-y - 10) / 30 - (x - 20) / 120);
  let s = "";
  /* schlankes Bein: Fell grau, Ferse/Knie modelliert; Hand/Fuß mit schwarzer Haut und Fingern */
  let bn = 0;
  const bein = (pts, fern, n, farbe, w) => { const b = T.box(pts); return W.teil(pts, fern ? "#6e6862" : T.lg("kb" + farbe.slice(1), [[0, farbe], [1, "#74706a"]]),
    W.fell(fern ? "kbf" : "kbn", 95, T.box(pts), { hell: "#f2eee8", dunkel: "#2a2826", ho: fern ? 0.25 : 0.4, fx: 6, fy: 0.8, hk: "ka" }) +
    W.weich(w || [], 0.8) +
    W.haare(pts, n, 95, 0.7, GRAU, { licht: (x, y) => licht(x, y) * (fern ? 0.5 : 1), gerade: true, szene: 0.06 }),
    { rand: 0, maske: fern ? null : W.maske("kb" + bn++, [b[0] - 2, b[1] - 2, b[2] + 2, 2], 0, b[1] + 1, 0, b[1] + 6) }); };
  const pfote = (x, l, fern) => `<path d="${G([[x, -2.4], [x + l * 0.5, -2.6], [x + l * 0.9, -1.5], [x + l, -0.5], [x + l * 0.9, 0, 1], [x - 0.3, 0, 1], [x - 0.6, -1.2]])}" fill="${fern ? "#141210" : "#1e1b19"}"/>` +
    (fern ? "" : W.L([`M${f1(x + l * 0.42)} -2.4q.5 .9 .4 2.4`, `M${f1(x + l * 0.64)} -2.2q.5 .8 .4 2.2`], "#000", 0.07, 0.6) + `<ellipse cx="${f1(x + l * 0.93)}" cy="-.6" rx=".3" ry=".17" fill="#6a625c"/>`);

  /* ---------- ferne Beine ---------- */
  s += pfote(17.4, 5.8, true) + bein([[20, -26], [25.6, -22], [26, -16], [22.4, -10], [19.6, -5], [21.4, -2.2], [18.2, -2], [17.6, -5.4], [19.6, -11], [19.4, -17], [16, -22]], true, 20, "#8a847e");
  s += pfote(43.4, 4, true) + bein([[40.6, -22], [45.4, -20.6], [45.6, -14], [45.6, -8], [46.4, -2.2], [43.6, -2.2], [42.6, -8], [42, -14]], true, 18, "#8a847e");

  /* ---------- Schwanz: Fragezeichen, 13 weiße / 14 schwarze Ringe (Spitze schwarz), weiche Ringgrenzen ---------- */
  const J = [[6, -27, 1.9, 1.9], [1.6, -32, 2, 2], [-1.6, -39, 2.1, 2.1], [-2.8, -47, 2.2, 2.2], [-2, -55, 2.2, 2.2], [0.8, -62, 2.2, 2.2], [5.4, -67.4, 2.2, 2.2], [11.4, -70, 2.1, 2.1],
    [17, -69.2, 2, 2], [20.6, -66, 1.9, 1.9], [22, -61.6, 1.7, 1.7], [22, -58.6, 1.2, 1.2]];
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
  const swPts = sw.V.concat(sw.H.slice().reverse());
  const L = []; let tot = 0;
  for (let i = 0; i < fein.length; i++) { if (i) tot += Math.hypot(fein[i][0] - fein[i - 1][0], fein[i][1] - fein[i - 1][1]); L.push(tot); }
  const ringe = 27, ringPfad = ["", ""];
  const idx = (d) => { let i = 0; while (i < L.length - 2 && L[i + 1] < d) i++; return i; };
  for (let r = 0; r < ringe; r++) {
    const ia = idx(tot * r / ringe), ib = Math.min(fein.length - 1, idx(tot * (r + 1) / ringe) + 1);
    const ex = (p, k) => [p[0] + (p[0] - fein[k][0]) * 0.9, p[1] + (p[1] - fein[k][1]) * 0.9];
    const V = sw.V.slice(ia, ib + 1).map((p, k) => ex(p, ia + k)), H = sw.H.slice(ia, ib + 1).map((p, k) => ex(p, ia + k));
    ringPfad[(r % 2 === 0 || r === ringe - 1) ? 1 : 0] += "M" + V.concat(H.reverse()).map((p) => f1(p[0]) + " " + f1(p[1])).join("L") + "Z";
  }
  /* buschiger Umriss: Zotteln beidseitig */
  const busch = W.zotteln(sw.V, 1 / sz, 1.6, (x, y) => -20 + (y + 50) * 0.5).concat(W.zotteln(sw.H.slice().reverse(), 1 / sz, 1.4, 160).slice(1));
  const swId = T.id("ksw");
  T.def(`<clipPath id="${swId}"><path d="${G(busch)}"/></clipPath>`);
  W.box(busch);
  s += `<g clip-path="url(#${swId})"><g filter="${W.blur(0.35)}"><path d="${kurz(ringPfad[0])}" fill="#ece8e2"/><path d="${kurz(ringPfad[1])}" fill="#1c1a19"/></g>` +
    W.fell("ksw", 0, [-8, -74, 26, -22], { hell: "#ffffff", dunkel: "#000", ho: 0.3, do: 0.35, fx: 5, fy: 0.6, hk: "ka", licht: false }) +
    W.haare(busch, 160, (x, y) => -10 + (y + 50) * 0.3, 1.1, [["#141212", 0.06, 0.5], ["#f4f1ec", 0.06, 0.5]], { mix: 1, gerade: true, szene: 0.06 }) +
    `<path d="${G(busch)}" fill="${T.lg("kswv", [[0, "#fff", 0.22], [0.45, "#fff", 0], [1, "#000", 0.4]], 0, 0, 1, 0.25)}"/></g>`;

  /* ---------- Rumpf: Rücken rosa-graubraun, Flanke grau, Bauch weiß; Kruppe höher als Schulter ---------- */
  const rumpf = W.zotteln([[7, -18], [4.6, -24], [8.6, -29.2], [16, -30.8], [24, -30], [32, -28.4], [39, -27.4], [43, -26]], 1.4 / sz, 0.8, 190).concat(
    [[46.4, -23.4], [47, -18.6]], W.zotteln([[47, -18.6], [42, -14.4], [35, -13.4], [28, -14.6], [20, -16.6], [12, -17.4]], 1.4 / sz, 1.2, 95).slice(1));
  const bauch = [[46, -20], [40, -15.6], [32, -14.2], [24, -14.6], [16, -16.4], [12, -18.2], [16, -19.4], [24, -18.4], [32, -18.2], [40, -19.4]];
  s += W.teil(rumpf, T.lg("krf", [[0, "#9a8478"], [0.5, "#8e827a"], [1, "#9a948e"]]),
    W.fell("krf", 180, [4, -31, 47, -13], { hell: "#f0e8e0", dunkel: "#2a2420", ho: 0.45, fx: 6, fy: 0.8, hk: "ka" }) +
    W.weich([`<path d="${G(bauch)}" fill="#ece8e2"/>`, [24, -27, 12, 2.2, 0, "#c8b4a4", 0.45], [28, -17, 16, 2, 0, "#3a3430", 0.3], [12, -22, 4, 5, 0, "#3a3430", 0.25]], 1.2) +
    W.haare(rumpf, 220, (x, y) => (y > -19 ? 95 : 186), 0.8, RUECKEN, { licht, gerade: true, szene: 0.06 }) +
    W.haare(bauch, 60, 95, 0.8, GRAU, { licht: () => 0.9, gerade: true, szene: 0.06 }), { rand: 0 });

  /* ---------- nahe Beine: Hinterbein lang (Knie vorn, Ferse), Vorderbein schlank ---------- */
  s += pfote(8.6, 6.6, false) + bein([[6, -26], [14, -27], [19.4, -21.6], [19.6, -15.4], [16, -9.6], [13.4, -5], [15, -2.2], [9.6, -2], [8.6, -4.6], [10.6, -10], [10, -15.6], [5.6, -21]], false, 55, "#aca69e",
    [[14, -22, 4, 3, 30, "#f0ece6", 0.45], [11.6, -8, 1, 3, 0, "#2a2826", 0.4], [18, -14, 1.2, 3, -20, "#f0ece6", 0.35]]);
  s += pfote(37.6, 4.4, false) + bein([[34, -24], [40, -23.4], [41.4, -17], [41, -10], [41.6, -2.2], [38.4, -2.2], [37.4, -8], [36.2, -14], [33.6, -19]], false, 40, "#b0aaa2",
    [[39, -20, 1.6, 3, 0, "#f0ece6", 0.4], [37.4, -9, 0.8, 3, 0, "#2a2826", 0.35]]);

  /* ---------- Kopf (≈ 11 cm): dunkler Scheitel/Nacken, weißes Gesicht, schwarze Augendreiecke, spitze dunkle Schnauze ---------- */
  const kopf = [[42.4, -25.2], [43.6, -28.4], [46.4, -30.6], [49.6, -30.8], [52, -29.4], [54.6, -27.4], [56.6, -26.2], [57, -25.2], [56.2, -24.6], [54, -24], [50.6, -23.2], [46.6, -23], [43.6, -23.6]];
  s += W.teil(kopf, T.lg("kkf", [[0, "#cfcac4"], [0.5, "#e8e4de"], [1, "#f4f1ec"]]),
    W.weich([
      /* dunkelgraue Kappe: Stirn → Scheitel → Nacken */
      `<path d="${G([[42, -25], [43.2, -28.8], [46.4, -31], [49.8, -31], [51.6, -29.8], [49.6, -29], [46.8, -28.6], [44.4, -27], [43.4, -24.6]])}" fill="#3e3a38"/>`,
      /* dunkler Schnauzenrücken zur Nase */
      `<path d="${G([[51.6, -28.2], [54.4, -27.6], [56.6, -26.2], [56.2, -25.4], [53.4, -26.2], [51.4, -26.8]])}" fill="#2e2a28" opacity=".9"/>`,
      [46, -24, 3, 1, 0, "#000", 0.2]], 0.4) +
    /* schwarzes Augendreieck (Spitze nach vorn-unten) */
    `<path d="${G([[46.6, -27.6], [49.2, -28.6], [51.4, -27], [52.6, -25.4], [50.4, -25.4], [47.6, -25.6]])}" fill="#121010"/>` +
    W.haare(kopf, 80, (x, y) => (x > 50 ? 190 : y < -27.6 ? 200 : 168), 0.5, GRAU, { licht: (x, y) => (y < -28.4 || (x > 51.5 && y < -25.6) ? 0.15 : 0.85), gerade: true, mix: 0.25, szene: 0.05 }), { rand: 0 });
  /* Nasenspiegel schwarz, feucht; Maul */
  s += `<path d="${G([[55.8, -26.6], [57.2, -26], [57.6, -25], [56.8, -24.4], [55.8, -25]])}" fill="#0e0c0c"/>` + W.L(["M56.3 -26.3q.7 .1 1 .5"], "#fff", 0.07, 0.6) +
    W.L(["M56.8 -24.2q-1.8 .5 -3.8 .4"], "#0e0c0c", 0.12, 0.8);
  if (T.fein) s += T.schnurrhaare(55.4, -24.8, 5, 3, 15, 40, "#1a1818", 0.035);
  /* Auge: groß, orange-bernstein, runde Pupille, im schwarzen Dreieck */
  s += W.auge(49.2, -27, 0.62, { iris: "#e89a2a", iris2: "#8a4a08", offen: 0.88, winkel: 8, lid: "#050404", haut: "#121010" });
  /* Ohren: spitz, dreieckig, weiß behaart, recht groß */
  const ohr = [[43.6, -29.4], [43.8, -33], [44.8, -35.6], [47, -32.4], [47.2, -30.2]];
  s += W.teil(ohr, "#d8d4ce", W.haare(ohr, 25, 262, 0.9, GRAU, { licht: () => 0.9, gerade: true, szene: 0.05 }) + W.weich([[45.4, -31.6, 0.6, 1.6, 0, "#5a5654", 0.45]], 0.3), { rand: 0 });
  s += W.saum([[43.8, -31], [44.8, -35.4], [46.8, -32.4]], 16, 268, 0.9, GRAU.slice(3), { licht: () => 0.9, gerade: true, szene: 0.05 });
  return W.fertig(s, 1, [38, -38, 60, -18], [12, 21, 40, 45]);
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
  const sz = T.fein ? 0.9 : 0.4;
  const GRAU = [["#3c3836", 0.09, 0.55], ["#605a56", 0.09, 0.55], ["#86807a", 0.085, 0.55], ["#aaa49e", 0.08, 0.55], ["#cdc9c4", 0.075, 0.6], ["#efedea", 0.07, 0.65]];
  const licht = (x, y) => clamp(0.35 + (-y - 60) / 80 - (x - 40) / 60);
  let s = "";
  /* ---------- Ast (Stamm schräg aufwärts), Rinde glatt, grau-beige mit Streifen ---------- */
  const st = rohr([[64, 0, 6.6, 6.6], [66.4, -40, 6, 6], [69.4, -80, 5.4, 5.4], [73.4, -120, 4.8, 4.8], [77, -150, 4.2, 4.2]]);
  const stamm = st.V.concat(st.H.slice().reverse());
  const ast = rohr([[74, -118, 2.2, 2.2], [84, -128, 1.8, 1.8], [96, -134, 1.4, 1.4], [104, -136, 1, 1]]);
  const zweig = (o) => W.teil(ast.V.concat(ast.H.slice().reverse()), T.lg("ka2", [[0, "#b8ab98"], [1, "#7a6e60"]], 0, 0, 0, 1), "", { rand: 0 });
  s += W.teil(stamm, T.lg("kst", [[0, "#d8cfc0"], [0.45, "#b8ac9a"], [1, "#6e6456"]], 0, 0, 1, 0),
    W.relief("rinde", `<path d="${G(stamm)}" fill="#000" fill-opacity=".001"/>` + W.L(["M61 -10q2 -16 3 -30", "M68 -20q1 -20 3.4 -42", "M64 -60q2 -18 4.6 -40", "M71 -96q2 -16 4 -30",
      "M66.6 -110q1.6 -14 4 -30", "M62 -30q1.4 -10 2 -16"], "#5a5044", 0.25, 0.45) + W.weich([[66, -70, 2, 40, 2, "#fff6e8", 0.35], [70, -40, 1.6, 30, 2, "#3a3228", 0.3], [64, -20, 4, 6, 0, "#8a8a6a", 0.25]], 1.6),
      { f: 0.9, f2: 0.12, tiefe: 0.6, okt: 2 }), { rand: 0 });
  s += zweig();
  /* Blätter: lanzettlich, sichelförmig, graugrün, hängen an Zweig und Stammspitze */
  let blatt = "", rippe = "";
  for (const [x, y, w, L] of [[84, -128, 70, 16], [90, -131, 95, 15], [96, -134, 60, 14], [101, -135.4, 85, 13], [104, -136, 30, 12], [78.4, -146, 120, 14], [77, -150, 70, 13], [80, -137, 40, 12]]) {
    const b = euBlatt(x, y, w, L);
    blatt += G(b.pts); rippe += G(b.mid, false);
    W.box(b.pts);
  }
  s += `<path d="${kurz(blatt)}" fill="${T.lg("kbl", [[0, "#9ab098"], [0.5, "#7a9478"], [1, "#56705a"]], 0, 0, 1, 1)}" stroke="#3e5440" stroke-opacity=".5" stroke-width=".2"/>` +
    `<path d="${kurz(rippe)}" fill="none" stroke="#d6e2c8" stroke-opacity=".7" stroke-width=".22"/>`;

  /* ---------- ferne Glieder: Krallen greifen rechts um den Stamm ---------- */
  const krallen = (x, y, n, w) => {
    let d = "";
    for (let i = 0; i < n; i++) { const yy = y + i * 1.6; d += `M${f1(x)} ${f1(yy)}q${f1(1.8 * w)} -.4 ${f1(2.4 * w)} 1.6q-.8 -.6 -2.2 -.4z`; }
    return `<path d="${d}" fill="#1a1614"/>`;
  };
  s += krallen(73.4, -91, 3, 1) + krallen(70.4, -40, 3, 1);

  /* ---------- Körper (links vom Stamm, Bauch zum Holz) ---------- */
  const koerper = W.zotteln([[58, -30], [48, -30.6], [40, -34], [35.4, -44], [34, -58], [35.4, -72], [39, -84], [44, -92]], 1.1 / sz, 0.9, (x, y) => (y > -40 ? 110 : 150)).concat(
    [[50, -96], [58, -94], [63, -86], [64, -70], [63.4, -54], [62.4, -40]]);
  const brust = [[62.6, -90], [64, -70], [63.4, -54], [62, -42], [58, -40], [59, -56], [59.6, -72], [58.6, -86]];
  s += W.teil(koerper, T.lg("kkr", [[0, "#9a948c"], [0.5, "#86807a"], [1, "#5e5852"]], 0, 0, 1, 0),
    W.fell("kkr", 100, [33, -98, 65, -28], { hell: "#f4f2ee", dunkel: "#3a3634", ho: 0.5, do: 0.45, fx: 3.6, fy: 0.9, hk: "kk" }) +
    W.weich([`<path d="${G(brust)}" fill="#e6e2dc"/>`, [42, -70, 6, 18, 0, "#d6d0c8", 0.4], [52, -42, 10, 6, 0, "#2a2624", 0.35], [44, -36, 5, 3, 0, "#e8e4de", 0.6], [38, -40, 2, 2, 0, "#f0ece6", 0.6]], 1.6) +
    W.haare(koerper, 240, (x, y) => (y > -44 ? 110 : 100 + (x - 50) * 0.5), 1.1, GRAU.slice(1), { licht: (x, y) => licht(x, y) + (x > 58 ? 0.35 : 0), gerade: true, krumm: 0.3, szene: 0.06 }),
  { rand: 0 });

  s += W.saum([[44, -92], [39, -84], [35.4, -72], [34, -58], [35.4, -44], [40, -34], [48, -30.6]], 70, (x, y) => (y > -40 ? 120 : 165), 1.4, GRAU, { licht: (x, y) => licht(x, y), krumm: 0.35, szene: 0.06 });
  /* ---------- Hinterbein: Oberschenkel, Fuß greift den Stamm ---------- */
  const bein = W.zotteln([[42, -36], [44, -46], [50, -50], [57, -48]], 1.1 / sz, 0.8, 110).concat([[63, -44], [66, -40], [66.4, -35], [61, -32], [52, -30.6], [45, -31]]);
  s += W.teil(bein, T.lg("kbn", [[0, "#a6a09a"], [1, "#6a645e"]]),
    W.fell("kbn", 120, [40, -52, 67, -29], { hell: "#f4f2ee", dunkel: "#2a2826", ho: 0.45, fx: 3.6, fy: 0.9, hk: "kk" }) +
    W.weich([[50, -45, 6, 3, 10, "#e8e4de", 0.4], [56, -33, 7, 2, 0, "#2a2624", 0.4]], 1.2) +
    W.haare(bein, 80, 30, 1, GRAU, { licht: (x, y) => licht(x, y) + 0.1, gerade: true, szene: 0.06 }), { rand: 0, vol: false });
  s += `<path d="${G([[63.4, -41], [67.6, -40.6], [69.6, -37.6], [68.4, -34.4], [64, -34], [62.4, -37]])}" fill="#2a2522"/>` +
    `<path d="${G([[63, -41.4], [67.4, -41.2], [69, -39], [65, -38.6], [62.6, -38.8]])}" fill="#8e8882"/>` + W.haare([[63, -41.4], [67.4, -41.2], [69, -39], [65, -38.6]], 20, 10, 0.9, GRAU, { licht: () => 0.6, gerade: true, szene: 0 }) + krallen(68.6, -40.4, 3, 1.1);

  /* ---------- naher Arm: umgreift den Stamm, Hand mit zwei Daumen und langen Krallen ---------- */
  const arm = W.zotteln([[44, -86], [46, -78], [52, -74], [58, -76]], 1.1 / sz, 0.9, 100).concat([[64, -80], [68.6, -84], [70.4, -88], [68, -92], [62, -93], [54, -94], [48, -92]]);
  s += W.teil(arm, T.lg("kar", [[0, "#aaa49e"], [1, "#6a645e"]]),
    W.fell("kar", 15, [43, -95, 71, -73], { hell: "#f4f2ee", dunkel: "#2a2826", ho: 0.45, fx: 3.6, fy: 0.9, hk: "kk" }) +
    W.weich([[56, -88, 8, 3, 10, "#ece8e2", 0.45], [56, -77, 8, 2, 0, "#2a2624", 0.4]], 1.2) +
    W.haare(arm, 80, 10, 1, GRAU, { licht: (x, y) => licht(x, y) + 0.15, gerade: true, szene: 0.06 }), { rand: 0, vol: false });
  s += `<path d="${G([[66.4, -92], [70.6, -91.4], [73, -88.6], [72, -85], [68.4, -84.6], [66, -88]])}" fill="#2a2522"/>` +
    `<path d="${G([[66, -92.6], [70.4, -92.2], [72.4, -90], [68.4, -89.4], [65.6, -89.6]])}" fill="#98928c"/>` + W.haare([[66, -92.6], [70.4, -92.2], [72.4, -90], [68.4, -89.4]], 20, 10, 0.9, GRAU, { licht: () => 0.7, gerade: true, szene: 0 }) + krallen(71.6, -91, 3, 1.1) +
    `<path d="M69 -84.6q1.4 1.4 1 3.6q-.6 -1 -1.6 -1.6z" fill="#1a1614"/>`;

  /* ---------- Kopf: groß, rund, zum Betrachter gedreht ---------- */
  s += koalaKopf(T, W, GRAU, sz);
  return W.fertig(s, 1, [30, -126, 72, -84], [64]);
}

/* Koalakopf (¾ zum Betrachter): runder Kopf, große runde Ohren mit weißen Büscheln, große löffelförmige schwarze Nase */
function koalaKopf(T, W, GRAU, sz) {
  let s = "";
  /* fernes Ohr (rechts, halb hinter dem Kopf) */
  const ohrF = W.zotteln([[60, -112], [64, -118], [70, -118.4], [72.4, -113], [70, -106.6]], 0.9 / sz, 1.2, (x, y) => Math.atan2(y + 112, x - 66) / RAD).concat([[64, -105]]);
  s += W.teil(ohrF, "#8a847e", W.weich([[66.6, -112, 3, 3, 0, "#f0ece6", 0.8]], 0.8) + W.haare(ohrF, 40, (x, y) => Math.atan2(y + 112, x - 66) / RAD, 1.6, GRAU.slice(3), { licht: () => 0.8, gerade: true, szene: 0.06 }), { rand: 0 });
  const kopf = W.zotteln([[44, -100], [40, -108], [42, -116], [48, -121], [56, -122], [63, -118.4], [67, -112]], 1 / sz, 0.7, (x, y) => Math.atan2(y + 106, x - 54) / RAD).concat(
    [[68, -104], [66.4, -96], [62, -91], [56, -89.4], [50, -91], [46, -95]]);
  s += W.teil(kopf, T.rg("kkp", [[0, "#a8a29c"], [0.65, "#8e8882"], [1, "#6a645e"]], 0.45, 0.4, 0.65),
    W.fell("kkp", 100, [39, -123, 69, -88], { hell: "#f4f2ee", dunkel: "#5a5652", ho: 0.4, do: 0.3, fx: 4, fy: 1.2, hk: "kk" }) +
    W.weich([[56, -92, 7, 2.4, 0, "#ece8e2", 0.7], [47, -110, 5, 7, -20, "#c8c2bc", 0.4], [64, -104, 3, 8, 0, "#3a3634", 0.35]], 1.2) +
    W.haare(kopf, 200, (x, y) => Math.atan2(y + 104, x - 56) / RAD, 0.9, GRAU.slice(2), { licht: (x, y) => clamp(0.85 - (x - 42) / 40 - (y + 120) / 60), gerade: true, mix: 0.35, szene: 0.05 }),
  { rand: 0 });
  /* Augen: klein, dunkel, senkrechte Schlitzpupille; fernes schmaler */
  s += W.auge(51.2, -105.4, 0.78, { iris: "#5a3a1c", iris2: "#1a0e06", pupille: "schlitz", offen: 0.8, winkel: -10, lid: "#141010", wimpern: 6, wimpernLaenge: 0.3, haut: "#3a3634" });
  s += `<g transform="translate(61.8 -105.6) scale(.78 1) translate(-61.8 105.6)">` +
    W.auge(61.8, -105.6, 0.74, { iris: "#5a3a1c", iris2: "#1a0e06", pupille: "schlitz", offen: 0.8, winkel: 10, lid: "#141010", wimpern: 6, wimpernLaenge: 0.3, haut: "#3a3634" }) + `</g>`;
  /* Nase: groß, löffelförmig, ledrig schwarz, feuchter Glanz, Nasenlöcher unten */
  const nase = [[56.4, -108.6], [59.4, -107.4], [60.8, -103], [60.6, -98], [58.8, -95.2], [55.8, -94.6], [53.4, -96], [52.6, -100], [53.4, -105], [54.6, -107.8]];
  s += W.teil(nase, T.lg("kns", [[0, "#2e2a2a"], [0.5, "#161414"], [1, "#0a0909"]], 0, 0, 1, 0),
    W.weich([[55.4, -103, 1.2, 3.4, -8, "#9a9494", 0.7], [56.4, -107, 1.4, 0.6, 0, "#c8c4c4", 0.5]], 0.5) +
    W.relief("nase", `<path d="${G(nase)}" fill="#000" fill-opacity=".001"/>`, { f: 3, tiefe: 0.4, okt: 2 }) +
    `<path d="M54.8 -96.6q1.2 -.6 2 .3q-.8 .8 -2 -.3zM58.2 -96.4q1 -.8 1.8 .1q-.7 .7 -1.8 -.1z" fill="#000"/>`, { rand: 0 });
  /* Mund und weißes Kinn */
  s += W.L(["M54.2 -92.6q2.2 .3 4.6 0"], "#2a2624", 0.18, 0.6);
  /* nahes Ohr (links): groß, rund, weiße lange Haarbüschel am Rand */
  const ohr = W.zotteln([[46, -114], [41, -120], [34.6, -120.6], [31.4, -114.6], [33, -107.6], [38.4, -104.6]], 0.9 / sz, 1.4, (x, y) => Math.atan2(y + 113, x - 39) / RAD).concat([[44, -106]]);
  s += W.teil(ohr, T.rg("kor", [[0, "#5a5450"], [0.5, "#7a746e"], [1, "#9a948e"]], 0.6, 0.55, 0.6),
    W.weich([[38.6, -113, 4.4, 4.8, 0, "#ece8e2", 0.8], [40, -112, 2, 3, 0, "#5a5450", 0.45]], 1.2) +
    W.haare(ohr, 90, (x, y) => Math.atan2(y + 113, x - 39) / RAD, 2.4, GRAU.slice(2), { licht: (x, y) => clamp(1 - Math.hypot(x - 39, y + 113) / 14), gerade: true, szene: 0.06 }), { rand: 0 });
  s += W.saum([[45.6, -114.6], [41, -120.6], [34.4, -121], [31, -114.6], [32.8, -107], [36, -104]], 110, (x, y) => Math.atan2(y + 113, x - 39) / RAD, 2.6, GRAU.slice(3), { licht: () => 0.9, krumm: 0.35, ein: 0.5, szene: 0.08 });
  s += W.saum([[63, -116], [67, -119], [71.4, -116.4], [72.4, -110], [70.4, -106]], 50, (x, y) => Math.atan2(y + 112, x - 66) / RAD, 2, GRAU.slice(3), { licht: () => 0.85, krumm: 0.35, ein: 0.5, szene: 0.08 });
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
  const sz = T.fein ? 0.9 : 0.4;
  const FELL = [["#3a3024", 0.1, 0.55], ["#5e5040", 0.1, 0.55], ["#82735e", 0.095, 0.55], ["#a4967e", 0.09, 0.55], ["#c4b89e", 0.085, 0.6], ["#e0d6c0", 0.08, 0.6]];
  const licht = (x, y) => clamp(0.55 + (-y - 70) / 40 - (x - 60) / 300);
  const fFarbe = (x, y, z) => FELL[Math.round(clamp(licht(x, y) * 0.85 + (z - 0.5) * 0.55) * 5)][0];
  let s = "";
  /* ---------- Baum: Stamm rechts (steht auf dem Boden), waagrechter Ast nach links ---------- */
  const stamm = rohr([[136, 0, 7, 7], [135, -40, 6.4, 6.4], [134, -80, 6, 6], [133, -122, 5.4, 5.4]]);
  const astR = rohr([[134, -104, 4.4, 4.4], [110, -101, 4, 4], [80, -99, 3.8, 3.8], [50, -98.6, 3.6, 3.6], [20, -99.4, 3.2, 3.2], [2, -100.6, 2.8, 2.8]]);
  const rinde = (pts, n) => W.teil(pts, T.lg("fr" + n, [[0, "#9a8a70"], [0.45, "#7a6a52"], [1, "#4a3e30"]], 0, 0, n === "a" ? 0 : 1, n === "a" ? 1 : 0),
    W.relief("rinde" + n, `<path d="${G(pts)}" fill="#000" fill-opacity=".001"/>` + W.weich([[n === "a" ? 60 : 134, n === "a" ? -101 : -60, n === "a" ? 60 : 2, n === "a" ? 1 : 50, 0, "#e8dcc4", 0.35]], 1.2) +
      (T.fein ? W.L(n === "a" ? ["M10 -98q20 1 40 -.4", "M60 -100.4q20 .8 40 -.2", "M100 -97.6q14 .4 28 -2"] : ["M131 -10q1 -30 0 -60", "M137 -30q-.6 -30 -1 -60", "M133 -80q0 -20 -1 -40"], "#3a3024", 0.3, 0.5) : ""),
      { f: 0.8, f2: n === "a" ? 0.1 : 0.8, tiefe: 0.7, okt: 2 }), { rand: 0 });
  s += rinde(stamm.V.concat(stamm.H.slice().reverse()), "s");
  /* Blätter (Cecropia-artig, handförmig grob angedeutet) am Stamm oben */
  let blatt = "", rippe = "";
  for (const [x, y, w, L] of [[133, -122, 200, 15], [134, -121, 250, 14], [133, -120, 300, 13], [135, -118, 330, 12]]) { const b = euBlatt(x, y, w, L); blatt += G(b.pts); rippe += G(b.mid, false); W.box(b.pts); }
  s += `<path d="${kurz(blatt)}" fill="${T.lg("fbl", [[0, "#7aa070"], [1, "#4a6e44"]], 0, 0, 1, 1)}" stroke="#2e4a2a" stroke-opacity=".5" stroke-width=".2"/><path d="${kurz(rippe)}" fill="none" stroke="#d6e6c4" stroke-opacity=".6" stroke-width=".2"/>`;

  /* ---------- ferne Glieder (hinter dem Körper): Arm und Bein mit Krallen über dem Ast ---------- */
  const glied = (J, fern, n) => {
    const r = rohr(J), pts = W.zotteln(r.H, 1.4 / sz, 2.6, 92).concat(r.V.slice().reverse());
    return W.teil(pts, fern ? "#5a4e3e" : T.lg("fg" + n, [[0, "#b0a48a"], [1, "#6a5c48"]], 0, 0, 1, 0),
      W.fell("fg" + n, 92, T.box(pts), { hell: "#efe6d0", dunkel: "#2a2218", ho: fern ? 0.25 : 0.45, fx: 2.6, fy: 0.24, hk: "f" }) +
      W.locken(pts, fern ? 20 : 40, () => 94, 3, 6, 0.8, (x, y, z) => fern ? FELL[1 + (z > 0.5 ? 1 : 0)][0] : fFarbe(x, y, z), { kc: "#1a1610", szene: 0.2 }), { rand: 0 });
  };
  /* Krallen: drei lange, gebogene, hornfarbene Krallen hakend über den Ast (x = Ansatz) */
  const kralle = (x, y, fern, n = 3) => {
    let d = "", gl = "";
    for (let i = 0; i < n; i++) {
      const xx = x + i * 2.2 - 1.4, yy = y - i * 0.5;
      /* kräftige Basis am Fingerende, Bogen über den Ast, Spitze hakt hinten nach unten */
      d += `M${f1(xx)} ${f1(yy)}c-.6 -4.2 1.4 -8.6 5 -9.2c2.6 -.4 4.4 1.2 4.8 3.4c-1.4 -1.6 -3.2 -2 -4.6 -1.2c-2.6 1.4 -3.4 4.2 -3.2 7z`;
      gl += `M${f1(xx + 0.6)} ${f1(yy - 4)}c.4 -2.4 1.6 -4.2 3.6 -4.6`;
    }
    return `<path d="${d}" fill="${fern ? "#4a3e30" : T.lg("fkr", [[0, "#8a7a62"], [0.5, "#5e5040"], [1, "#2e2418"]], 0, 0, 1, 1)}" stroke="#1e160c" stroke-opacity=".5" stroke-width=".15"/>` +
      (fern ? "" : `<path d="${gl}" fill="none" stroke="#e0d0b0" stroke-opacity=".5" stroke-width=".25" stroke-linecap="round"/>`);
  };
  s += kralle(97, -96, true) + glied([[96, -96, 2.6, 2.6], [95, -86, 3.6, 3.6], [92, -76, 4.6, 4.6]], true, "af");
  s += kralle(52, -96, true) + glied([[51, -96, 2.6, 2.6], [50, -86, 3.6, 3.6], [47, -76, 5, 5]], true, "bf");
  s += rinde(astR.V.concat(astR.H.slice().reverse()), "a");
  s += kralle(97, -96, true) + kralle(52, -96, true);

  /* ---------- Körper: hängt waagrecht, Rücken unten, langes Haar hängt abwärts (vom Bauch zum Rücken) ---------- */
  const koerper = [[34, -78], [44, -82], [60, -84], [76, -84], [88, -82], [96, -76]].concat(
    W.zotteln([[96, -76], [98, -68], [94, -60], [84, -54], [70, -51], [56, -51], [44, -54], [35, -60], [31, -68], [34, -78]], 1.6 / sz, 5, (x, y) => 90 + (x - 64) * 0.3).slice(1));
  s += W.teil(koerper, T.lg("fk", [[0, "#a49478"], [0.5, "#86765e"], [1, "#5e5040"]]),
    W.fell("fk", 90, [30, -86, 99, -48], { hell: "#efe6d0", dunkel: "#2a2218", ho: 0.5, fx: 2.4, fy: 0.22, hk: "f" }) +
    W.weich([[64, -80, 24, 3, 0, "#3a3024", 0.45], [56, -62, 14, 5, 0, "#8a8c64", 0.35], [76, -58, 10, 4, 0, "#9a9a6e", 0.25], [64, -54, 26, 3, 0, "#2a2218", 0.35]], 2.4) +
    W.locken(koerper, 200, (x, y) => 90 + (x - 64) * 0.35, 4, 9, 1, fFarbe, { kc: "#1a1610", szene: 0.25 }),
  { rand: 0 });
  /* Stummelschwanz */
  s += W.locken([[30, -72], [33, -74], [33, -66], [30, -66]], 8, () => 120, 3, 5, 1, (x, y, z) => FELL[2][0], { kc: "#1a1610" });

  /* ---------- nahe Glieder: Bein (kürzer) und Arm (lang), Krallen über dem Ast ---------- */
  s += glied([[44, -96, 2.8, 2.8], [43, -88, 3.8, 3.8], [41, -78, 5.6, 5.6], [40, -70, 6, 6]], false, "bn") + kralle(44.6, -96.4, false);
  s += glied([[88, -96, 2.8, 2.8], [88.6, -86, 4, 4], [88, -76, 5, 5], [86, -68, 5.6, 5.6]], false, "an") + kralle(88.4, -96.4, false);

  /* ---------- Kopf: rund, zum Betrachter gedreht; helles Gesicht, dunkle Augenstreifen, braune Kehle ---------- */
  s += faultierKopf(T, W, FELL, fFarbe, sz);
  return W.fertig(s, 1, [92, -84, 122, -52], [136]);
}

function faultierKopf(T, W, FELL, fFarbe, sz) {
  let s = "";
  const C = [107, -68];
  const kopf = [[96, -64], [96.4, -72], [100, -78.6], [107, -81], [114, -78.6], [118, -72]].concat(
    W.zotteln([[118, -72], [118.6, -64], [116, -57.6], [108, -54.6], [100, -57], [96, -64]], 1.3 / sz, 3, (x, y) => 92 + (x - 107) * 1.2).slice(1));
  s += W.teil(kopf, T.rg("fkp", [[0, "#a49478"], [0.7, "#7a6a54"], [1, "#4e4232"]], 0.5, 0.45, 0.6),
    W.fell("fkp", 90, [94, -83, 120, -53], { hell: "#efe6d0", dunkel: "#2a2218", ho: 0.4, fx: 3, fy: 0.4, hk: "f" }) +
    /* braune Kehle (unten), dunkle Stirnfransen */
    W.weich([[107, -57, 8, 3.4, 0, "#4a3220", 0.85], [107, -78, 8, 2.4, 0, "#4a3a28", 0.6]], 1.2) +
    W.locken(kopf, 80, (x, y) => (y < -74 ? 270 + (x - 107) * 4 : 92 + (x - 107) * 2), 2, 4.4, 0.6, fFarbe, { kc: "#1a1610", szene: 0.2 }), { rand: 0 });
  s += W.saum([[96.4, -72], [100, -78.6], [107, -81], [114, -78.6], [118, -72]], 40, (x, y) => Math.atan2(y - C[1], x - C[0]) / RAD + (x < 107 ? -25 : 25), 1.8, FELL, { licht: () => 0.6, krumm: 0.4, szene: 0.05 });
  /* helle Gesichtsscheibe */
  const ges = [[102, -74], [106.6, -76], [111.6, -75], [114.4, -71], [114.4, -66], [112, -62.4], [107.6, -61], [103, -62.4], [100.4, -66], [100.4, -71]];
  s += W.teil(ges, T.rg("fge", [[0, "#f2ead6"], [0.7, "#ddd0b4"], [1, "#b8a888"]], 0.48, 0.45, 0.6),
    W.weich([[107.4, -64, 3, 1.6, 0, "#8a7a62", 0.4]], 0.6) +
    W.haare(ges, 70, (x, y) => Math.atan2(y + 68, x - 107.4) / RAD, 0.7, FELL.slice(2), { licht: () => 0.8, gerade: true, szene: 0.05 }), { rand: 0 });
  /* dunkle Augenstreifen (Maske): vom Auge schräg nach außen-unten zur Wange */
  s += W.weich([`<path d="${G([[105.6, -70.6], [104, -71.4], [101.4, -70.8], [99.4, -69.2], [99.6, -67.4], [101.8, -68], [104.4, -68.2], [105.8, -69.2]])}" fill="#2a1e14"/>`,
    `<path d="${G([[109.4, -70.6], [111, -71.4], [113.6, -70.8], [115.6, -69.2], [115.4, -67.4], [113.2, -68], [110.6, -68.2], [109.2, -69.2]])}" fill="#2a1e14"/>`], 0.45);
  s += W.auge(104.4, -69.6, 0.62, { iris: "#3a2614", iris2: "#120a04", offen: 0.85, winkel: 8, lid: "#0a0604", haut: "#1a120c" });
  s += W.auge(110.4, -69.6, 0.6, { iris: "#3a2614", iris2: "#120a04", offen: 0.85, winkel: -8, lid: "#0a0604", haut: "#1a120c" });
  /* Nase klein, dunkel; Mund mit natürlich nach oben gebogenen Winkeln */
  s += `<path d="${G([[106.2, -66.4], [107.6, -67], [109, -66.4], [108.6, -65.2], [107.6, -64.8], [106.6, -65.2]])}" fill="#1e1610"/>` + W.L(["M106.8 -66.6q.6 -.2 1.2 0"], "#fff", 0.06, 0.5);
  s += W.L(["M105.2 -63.4q1.2 .5 2.4 .4q1.2 .1 2.4 -.4"], "#3a2a1c", 0.12, 0.6);
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
  const sz = T.fein ? 1 : 0.4;
  const ROT = [["#4a2412", 0.13, 0.5], ["#7a3a1c", 0.13, 0.5], ["#a3552c", 0.12, 0.5], ["#c4773f", 0.12, 0.5], ["#dc9c64", 0.11, 0.55], ["#f0c99a", 0.1, 0.6]];
  const HELL = [["#8c7a66", 0.12, 0.45], ["#b4a28c", 0.12, 0.45], ["#d3c4ae", 0.11, 0.5], ["#ebdfcc", 0.1, 0.55], ["#fbf5ea", 0.1, 0.6]];
  const licht = (x, y) => clamp(0.3 + (-y - 60) / 150 - (x - 100) / 140);
  const rotG = (n, a, b, c) => T.lg("rg" + n, [[0, a], [0.55, b], [1, c]]);
  let s = "";

  /* ---------- ferner Hinterfuß (Zehen ragen etwas vor) und ferner Unterschenkel ---------- */
  s += kFuss(W, T, 4, true);

  /* ---------- Schwanz (Basis am Steiß, liegt hinten auf dem Boden) ---------- */
  const sw = rohr([[94, -66, 9.6, 8], [84, -50, 8, 7.6], [72, -32, 6.6, 6.6], [61, -17, 5.6, 5.6], [49, -7.8, 4.6, 4.6], [34, -4.2, 3.7, 3.5], [18, -2.9, 2.9, 2.7], [5, -2.3, 2, 1.9], [-0.4, -2.3, 1, 1]]);
  const swPts = sw.V.concat(sw.H.slice().reverse());
  s += W.teil(swPts, T.lg("sw", [[0, "#c88050"], [0.45, "#b0663a"], [1, "#e0c09c"]], 0, 0, 0, 1),
    W.fell("sw", 200, [-2, -72, 100, 2], { hell: "#f6d4a6", dunkel: "#5a2a12", ho: 0.45, do: 0.35, fx: 3, fy: 0.4, hk: "k" }) +
    W.weich([[44, -1.4, 34, 2.2, 0, "#2a1406", 0.4], [70, -38, 3, 14, -38, "#fff3e0", 0.3], [56, -16, 3, 10, -55, "#fff3e0", 0.25], [86, -60, 7, 10, -35, "#3a1a0a", 0.35]], 2) +
    W.haare(swPts, 170, (x, y) => (x > 62 ? 120 : 184), 1.2, ROT, { licht: (x, y) => clamp(0.6 - (y + 4) / 50 - (x > 62 ? 0.1 : 0)), gerade: true, szene: 0.08 }),
  { rand: 0 });
  s += W.saum(sw.V.slice(2), 40, (x, y) => (x > 60 ? 128 : 184), 0.9, ROT, { licht: () => 0.6, gerade: true, szene: 0.08 });

  /* ---------- ferner Arm (dahinter, etwas weiter vorn) ---------- */
  s += kArm(W, T, 5, true, ROT);

  /* ---------- Rumpf mit Hals ---------- */
  const rueckenK = [[86, -68], [87, -84], [90.6, -100], [96.6, -115], [104, -128], [111, -138], [117, -147]];
  const rumpf = W.zotteln(rueckenK, 2.6 / sz, 0.9, (x, y) => (y < -120 ? 112 : 130)).concat(
    [[124, -150], [130.6, -144], [132.6, -136], [133.4, -126], [135.6, -115], [136, -102], [133.6, -88], [130.6, -76], [125, -68], [114, -62], [100, -60], [90, -62]]);
  const brust = [[129, -146], [132.6, -136], [133.4, -126], [135.6, -115], [136, -102], [133.6, -88], [130.6, -76], [125, -68], [122, -72], [125, -86], [127, -102], [126, -118], [126, -134], [125.6, -144]];
  s += W.teil(rumpf, rotG("r", "#c47040", "#aa5a30", "#7c3e1f"),
    W.fell("rf", 135, [84, -152, 137, -58], { hell: "#f2c696", dunkel: "#4a220e", ho: 0.5, do: 0.4, fx: 3, fy: 0.42, hk: "k" }) +
    W.weich([`<path d="${G(brust)}" fill="#ece1cf"/>`,
      [100, -104, 7, 26, 28, "#eeac72", 0.4], [110, -132, 8, 6, 0, "#f4c690", 0.4], [118, -92, 7, 18, 10, "#2a1206", 0.22],
      [128, -70, 9, 5, 0, "#2a1206", 0.3], [131.6, -96, 2.4, 14, 0, "#fff6ea", 0.4], [126, -140, 5, 4, 0, "#2a1206", 0.25]], 2.6) +
    W.haare(rumpf, 250, (x, y) => (x > 124 ? 92 : y < -118 ? 118 : 108), 1.3, ROT, { licht: (x, y) => licht(x, y) + (x > 124 ? 0.4 : 0), gerade: true, buendel: 2, szene: 0.08 }) +
    W.haare(brust, 110, 92, 1.3, HELL, { licht: (x, y) => clamp(0.85 - (x - 126) / 18), gerade: true, buendel: 2, szene: 0.08 }),
  { rand: 0 });
  s += W.saum(rueckenK, 42, (x, y) => (y < -120 ? 112 : 130), 1, ROT, { licht: () => 0.75, gerade: true, szene: 0.08 });
  s += W.saum([[132.6, -136], [133.4, -126], [135.6, -115], [136, -102], [133.6, -88]], 30, 70, 1, HELL, { licht: () => 0.7, gerade: true, szene: 0.08 });

  /* ---------- nahes Hinterbein: mächtiger Oberschenkel, Knie vorn, schlanker Unterschenkel mit Achillessehne ---------- */
  s += kFuss(W, T, 0, false);
  const bein = [[96, -81], [106, -86], [116, -84.6], [123.6, -78], [128.4, -68], [130, -57], [128.6, -48.4], [125.6, -43.6], [121, -37], [115.6, -28], [110.6, -20.4], [106.4, -13.6],
    [100, -11], [95.6, -13.4], [96.6, -20], [99.4, -28], [103, -35.6], [105.4, -40.6], [99, -45], [92, -49.4], [87, -55.6], [85.4, -64], [88, -74]];
  s += W.teil(bein, rotG("b", "#cc8450", "#b56a3c", "#8c4b27"),
    W.fell("bn", 115, [84, -88, 131, -9], { hell: "#f6d2a2", dunkel: "#4a220e", ho: 0.5, do: 0.38, fx: 3, fy: 0.42, hk: "k" }) +
    W.weich([
      [108, -72, 15, 9, -18, "#f8c890", 0.55], [126.4, -56, 2.6, 9, 4, "#fff0dc", 0.4], [89, -60, 3, 10, -20, "#3a1a0a", 0.4],
      [100, -50, 10, 3, -30, "#3a1a0a", 0.35], [118, -60, 5, 12, 20, "#3a1a0a", 0.16], [113, -70, 6, 5, 0, "#fff2dc", 0.25], [114, -30, 2.6, 10, 36, "#f6cc98", 0.45], [104, -27, 2, 10, 32, "#3a1a0a", 0.4],
      [107, -46, 5, 2.4, -30, "#3a1a0a", 0.5], [124.6, -44.8, 2.6, 2, 0, "#3a1a0a", 0.35],
    ], 2) +
    /* Achillessehne zur Ferse */
    W.L([G([[99, -32], [97.2, -22], [96.6, -14]], false)], "#fff0dc", 0.8, 0.35) +
    W.haare(bein, 210, (x, y) => (y < -50 ? 100 + (x - 100) * 0.8 : 66), 1.3, ROT, { licht: (x, y) => clamp(licht(x, y) + 0.2), gerade: true, buendel: 2, szene: 0.08 }),
  { rand: 0 });
  s += W.saum([[88, -74], [85.4, -64], [87, -55.6], [92, -49.4], [99, -45]], 26, 108, 1.1, ROT, { licht: () => 0.45, gerade: true, szene: 0.08 });
  s += W.saum([[123.6, -78], [128.4, -68], [130, -57], [128.6, -48.4]], 18, 40, 0.9, ROT, { licht: () => 0.7, gerade: true, szene: 0.08 });

  /* ---------- naher Arm ---------- */
  s += kArm(W, T, 0, false, ROT);

  /* ---------- Kopf ---------- */
  s += kKopf(W, T, ROT, HELL, sz);
  return W.fertig(s, 1, [112, -180, 157, -136], [12, 34, 112, 118]);
}

/* Hinterfuß (Ruhestellung): lang, schmal, ganz am Boden; 4. Zehe lang mit großer Kralle, 5. Zehe außen kürzer;
   Oberseite hell behaart, Sohle dunkel. dx = Versatz (ferner Fuß), fern = Schattenseite */
function kFuss(W, T, dx, fern) {
  const P = (x, y) => [x + dx, y];
  let s = "";
  const fuss = [P(97, -14), P(94, -10), P(93.4, -4.6), P(95.4, -0.8), P(100, 0, 1), P(124, 0, 1), P(129.4, -0.8), P(131.6, -2.8), P(130.4, -5.2), P(125.6, -6.2), P(117, -7.4), P(110, -9.2), P(104, -12.4)];
  s += W.teil(fuss, fern ? "#9e7a58" : T.lg("kf", [[0, "#e6caa6"], [0.6, "#cba582"], [1, "#8c6a4c"]]),
    W.fell(fern ? "kff" : "kfu", 178, [91, -15, 133, 1], { hell: "#fbe8cc", dunkel: "#5a3a1e", ho: 0.45, do: 0.3, fx: 3.4, fy: 0.5, hk: "k" }) +
    W.weich([[112, -0.8, 19, 1.6, 0, "#2a1608", 0.55], [111, -8.4, 14, 1.8, -6, "#fff6e8", fern ? 0.1 : 0.45], [96.4, -6, 3, 4, 0, "#3a2414", 0.35], [127, -3.6, 3, 1.6, 0, "#3a2414", 0.4]], 1.1) +
    W.haare(fuss, fern ? 35 : 110, 178, 1, [["#7a5636", 0.1, 0.5], ["#a8805a", 0.1, 0.5], ["#d8b994", 0.09, 0.55], ["#f6e6cc", 0.09, 0.6]], { licht: (x, y) => clamp(0.85 + (y + 4) / 10) * (fern ? 0.5 : 1), gerade: true, szene: 0.06 }),
  { rand: 0, vol: false });
  /* dunkle Sohlenkante (Ballen) */
  s += W.L([`M${f1(95 + dx)} ${f1(-0.6)}q2 .6 5 .6h24q3 0 5 -1`], fern ? "#2a1a10" : "#3a2616", 0.7, 0.8);
  /* 4. Zehe: große, gebogene, dunkle Kralle mit Glanz; 5. Zehe kürzer daneben (nah) */
  const kralle = (x, y, l, h, c) => `<path d="M${f1(x + dx)} ${f1(y - h * 0.5)}q${f1(l * 0.6)} ${f1(-h * 0.3)} ${f1(l)} ${f1(h * 0.85)}q${f1(-l * 0.4)} ${f1(-h * 0.25)} ${f1(-l * 0.9)} ${f1(h * 0.1)}z" fill="${c}"/>`;
  s += kralle(129.6, -3, 6.4, 3.2, fern ? "#2a221c" : "#2e241c");
  if (!fern) s += `<path d="M${f1(130.4 + dx)} ${f1(-4.2)}q2.4 -.6 4.4 1.4" fill="none" stroke="#d8cab8" stroke-opacity=".5" stroke-width=".2"/>` +
    kralle(124.6, -1.8, 4, 2.2, "#3a2e24") + W.L([`M${f1(117 + dx)} ${f1(-5.4)}q4.4 .4 7.4 2.6`], "#6a4a2e", 0.25, 0.6);
  return s;
}

/* Arm (Männchen: muskulös, langer Unterarm), vor der Brust leicht gebeugt; Hand mit dunklen Fingern und Krallen */
function kArm(W, T, dx, fern, ROT) {
  const P = (x, y) => [x + dx, y];
  let s = "";
  const arm = [P(117, -133), P(124.6, -134), P(129.4, -128), P(131.6, -120), P(133, -113.4), P(137.4, -107), P(141.4, -100), P(142.6, -94.4), P(139.6, -91.4), P(135, -93.2), P(129.6, -98.6),
    P(124.6, -104.6), P(120.6, -110.6), P(117.4, -118.6), P(116, -126)];
  s += W.teil(arm, fern ? "#94532d" : T.lg("ka", [[0, "#d48e58"], [0.5, "#bc7442"], [1, "#9a5a32"]], 0, 0, 1, 0.4),
    W.fell(fern ? "kaf" : "kar", 115, [114, -136, 143, -89], { hell: "#f6d2a2", dunkel: "#4a220e", ho: 0.45, do: 0.38, fx: 3.2, fy: 0.45, hk: "k" }) +
    W.weich(fern ? [[128, -112, 10, 16, 0, "#2a1406", 0.4]] : [[123.6, -124, 4.6, 7, -20, "#fad4a4", 0.5], [129.4, -110, 2.6, 6, -25, "#3a1a0a", 0.35],
      [134.6, -104, 3, 5, -40, "#fad4a4", 0.4], [127, -106, 3.6, 6, -40, "#3a1a0a", 0.3], [138, -95, 3, 2.4, -40, "#3a1a0a", 0.3]], 1.4) +
    W.haare(arm, fern ? 40 : 100, (x, y) => (y < -112 ? 104 : 52), 1.1, ROT, { licht: (x, y) => clamp(0.35 + (-y - 95) / 45 - (x - 120) / 45) * (fern ? 0.6 : 1), gerade: true, szene: 0.08 }),
  { rand: 0, vol: !fern });
  s += W.saum([P(116, -126), P(118, -118.6), P(121.6, -110.4), P(125.6, -104.6), P(130.6, -98.6)], fern ? 0 : 16, 120, 0.9, ROT, { licht: () => 0.5, gerade: true, szene: 0.05 });
  /* Hand (Pfote): Handrücken behaart, fünf dunkle Finger mit kurzen, gebogenen Krallen, locker nach unten */
  const H = fern ? "#1e1612" : "#2c211b";
  s += W.teil([P(136.6, -95.2), P(140.4, -96.6), P(143.2, -94.4), P(143.8, -90.6), P(142.6, -87.8), P(139.6, -87.2), P(137, -88), P(135.8, -91)], fern ? "#7a4424" : T.lg("kp", [[0, "#c88250"], [1, "#8a4e2a"]]),
    W.haare([P(136.4, -95), P(141.8, -96.4), P(144, -92.6), P(140.4, -89), P(136, -91)], fern ? 0 : 20, 70, 0.8, ROT, { licht: () => 0.55, gerade: true, szene: 0 }), { rand: 0, vol: !fern });
  for (const [x, y, ex, ey, w] of [[137.8, -89, 137.6, -86.2, 1.5], [139.6, -88.4, 140, -85.6, 1.6], [141.6, -88.6, 142.4, -86, 1.5]]) {
    s += W.glied([P(x, y), P((x + ex) / 2 + 0.3, (y + ey) / 2), P(ex, ey)], w, H, fern ? "" : "#8a766a", { la: 0.35 });
    s += `<path d="M${f1(ex + dx - 0.6)} ${f1(ey)}q.9 .1 1 1.2q-.7 -.5 -1.4 -.5z" fill="#1a120c"/>`;
  }
  return s;
}

/* Kopf: tief, mit breiter, eckiger Schnauze; große Augen mit Wimpern; große spitze Ohren; Schnauzenzeichnung */
function kKopf(W, T, ROT, HELL, sz) {
  let s = "";
  /* fernes Ohr (dahinter) */
  const ohrF = [[125.4, -155.6], [124, -163], [124.4, -171], [126.8, -177.4], [130, -171], [132, -163], [131.4, -156.6]];
  s += W.teil(ohrF, "#8e5634", W.weich([[128.4, -166, 1.8, 8, 0, "#2a1406", 0.45]], 1) + W.haare(ohrF, 30, 270, 1, ROT, { licht: () => 0.3, gerade: true, szene: 0.05 }), { rand: 0 });
  const kopf = [[116.6, -147], [118.6, -154], [123, -158.4], [129, -159.6], [135, -158.6], [141, -156], [146.4, -153], [150.4, -150.8], [153, -149.2], [154.4, -146.8], [154.6, -143.8], [153.4, -142],
    [152.4, -140.6], [150, -139.2], [144, -139], [138, -138.2], [131.6, -138.8], [125.6, -140.6], [120.6, -143]];
  s += W.teil(kopf, T.lg("kk", [[0, "#b87a4c"], [0.5, "#a4653c"], [1, "#d8c0a0"]]),
    W.fell("kk", 165, [116, -161, 155, -137], { hell: "#f2cc9c", dunkel: "#4a220e", ho: 0.42, do: 0.35, fx: 4, fy: 0.6, hk: "k" }) +
    /* Gesicht: graubrauner Nasenrücken, heller Nasenbereich, schwarzes Bartfeld, weißer Streifen Mundwinkel → Ohr, helle Kehle */
    W.weich([
      `<path d="${G([[131, -158], [141, -155.4], [149, -151], [152, -148.4], [147, -148.6], [139, -152], [132, -154.6]])}" fill="#8a7464" opacity=".55"/>`,
      `<path d="${G([[148.6, -148.8], [152.6, -148.4], [154.2, -145.6], [153.4, -143.2], [150.4, -142.6], [148.6, -145]])}" fill="#ece0d0" opacity=".9"/>`,
      [138, -151, 4, 3.4, 0, "#2a1406", 0.35], [127, -151, 8, 5, 0, "#f2c48e", 0.4], [137, -143, 10, 2.4, 0, "#000", 0.12],
    ], 0.7) +
    /* schwarzes Bartfeld seitlich an der Oberlippe (weich), darunter/dahinter der weiße Streifen vom Mundwinkel Richtung Ohr */
    W.weich([`<path d="${G([[143, -146], [148.6, -146], [151.6, -144], [151.2, -142.4], [147, -142], [143.4, -142.6], [141.4, -144]])}" fill="#1c1513" opacity=".88"/>`], 0.45) +
    W.weich([`<path d="${G([[127, -145.2], [133, -146.2], [139.6, -145], [143, -142.8], [147, -141.6], [150.4, -141], [146, -140.2], [138, -141], [130, -142.6]])}" fill="#f6f1e8"/>`], 0.35) +
    `<path d="${G([[122, -142.4], [132, -140.4], [145, -139.6], [146, -138.8], [134, -138.2], [124, -139.8]])}" fill="#ece3d4"/>` +
    W.haare(kopf, 170, (x, y) => (x < 128 ? 140 : 182 + (y + 148) * 2), 0.9, ROT, { licht: (x, y) => clamp(0.65 - (y + 152) / 14), gerade: true, mix: 0.3, szene: 0.06 }) +
    W.haare([[143, -146], [148.6, -146], [151.6, -144], [147, -142], [141.4, -144]], 30, 172, 0.7, [["#000", 0.09, 0.6], ["#4a3a32", 0.08, 0.5]], { gerade: true, szene: 0.03 }),
  { rand: 0 });
  /* Hinterkopf/Kehle gehen mit Haarsaum in den Hals über (keine Klebekante) */
  s += W.saum([[118.6, -154], [116.6, -147], [120.6, -143], [125.6, -140.6], [131.6, -138.8]], 50, (x, y) => (y < -146 ? 150 : 115), 1.4, ROT, { licht: (x, y) => clamp(0.6 - (y + 140) / 30), ein: 0.55, gerade: true, szene: 0.05 });
  /* Nase: Nasenloch schwarz gerandet (Komma), feuchter Glanz; Mund */
  s += `<path d="${G([[152.4, -148.6], [154.2, -147.6], [155, -145.4], [154.4, -143.6], [153, -144.2], [152.6, -146.2]])}" fill="#2a2220"/>`;
  s += W.L(["M153.8 -147q.9 .8 .7 2q-.3 .7 -1.2 .5"], "#050303", 0.55, 1) + W.L(["M152.8 -148.4q1.2 -.1 1.8 .6"], "#fff", 0.18, 0.55);
  s += W.L(["M154.2 -142.6q-1.8 .7 -3.4 .5q-1.6 .3 -2.8 1.2"], "#1a1210", 0.3, 0.9);
  if (T.fein) s += T.schnurrhaare(149, -144, 6, 6, 20, 50, "#1a1210", 0.1);
  /* Auge: groß, dunkelbraun, lange Wimpern; Augenhöhle mit Schatten oben, Glanz */
  s += W.weich([[138.4, -153.6, 3.6, 1.6, -8, "#3a1a0a", 0.45]], 0.6);
  s += W.auge(138.2, -151.6, 1.6, { iris: "#3a2214", iris2: "#120a06", offen: 0.82, winkel: -6, lid: "#0e0806", wimpern: 13, wimpernLaenge: 0.7, wimpernFarbe: "#140c08", haut: "#6a4630" });
  /* nahes Ohr: groß, breit an der Basis, spitz, aufrecht, innen hell behaart, Rand dunkler */
  const ohr = [[119.4, -153.6], [118, -161], [118.4, -169.6], [120.6, -178.2], [125, -170.6], [127.4, -162], [127, -155]];
  const ohrIn = [[120.4, -157], [120, -164], [120.8, -171.4], [121.8, -175.4], [123.8, -169.6], [125, -162], [124.4, -156.6]];
  s += W.teil(ohr, T.lg("ko", [[0, "#7a5038"], [1, "#b5774a"]], 0, 0, 1, 0),
    `<path d="${G(ohrIn)}" fill="${T.lg("koi", [[0, "#8a6a58"], [0.6, "#b49480"], [1, "#d8c4b0"]], 1, 0, 0, 0)}"/>` + W.weich([[122.2, -166, 1.2, 7, 0, "#4a3022", 0.55]], 0.6) +
    W.haare(ohrIn, 70, (x, y) => 250 + (x - 122.4) * 22, 2, HELL, { licht: (x) => clamp((x - 120.5) / 4), gerade: true, szene: 0.05 }) +
    W.haare(ohr, 30, 262, 0.8, ROT, { licht: () => 0.45, gerade: true, szene: 0.05 }),
  { rand: 0 });
  s += W.saum([[120.6, -170], [121.2, -176.6], [123.6, -173], [125.6, -166]], 22, 300, 1.3, HELL, { licht: () => 0.85, gerade: true, szene: 0.05 });
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
    gruppe: "Exoten", lebensraum: "Madagaskar", laenge: 0.63, hoehe: 0.74, zeichne: katta },
  { id: "koala", de: "der Koala", syl: "Ko-A-la", it: "il koala", itSyl: "ko-A-la", en: "koala",
    gruppe: "Exoten", lebensraum: "Eukalyptuswald", laenge: 0.78, hoehe: 1.56, zeichne: koala },
  { id: "faultier", de: "das Faultier", syl: "FAUL-tier", it: "il bradipo", itSyl: "BRA-di-po", en: "sloth",
    gruppe: "Exoten", lebensraum: "Regenwald", laenge: 1.45, hoehe: 1.38, zeichne: faultier },
  { id: "kaenguru", de: "das Känguru", syl: "KÄN-gu-ru", it: "il canguro", itSyl: "can-GU-ro", en: "kangaroo",
    gruppe: "Exoten", lebensraum: "Outback", laenge: 1.57, hoehe: 1.8, zeichne: kaenguru },
];
