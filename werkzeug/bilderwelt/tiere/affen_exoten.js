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
  W.box = (pts) => { for (const p of pts) W.B.push(p); return pts; };
  W.fertig = (svg, rand = 1) => { const b = T.box(W.B); return { svg, box: [Math.floor(b[0] - rand), Math.floor(b[1] - rand), Math.ceil(b[2] + rand), 0] }; };
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
      (o.rand !== 0 ? u(`fill="none" stroke="${o.rc || "#0a0806"}" stroke-opacity="${o.rand != null ? o.rand : 0.35}" stroke-width="${f1(2 * (o.rw || 0.4))}"`) : "");
    if (inn) s += `<g clip-path="url(#${id}c)">${inn}</g>`;
    return o.maske ? `<g mask="url(#${o.maske})">${s}</g>` : s;
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
    const ziel = Math.round(n * (T.fein ? 1 : (o.szene != null ? o.szene : 0.2)));
    const bu = o.buendel || 1, mix = o.mix != null ? o.mix : 0.45, streu = o.streu != null ? o.streu : 16, krumm = o.krumm != null ? o.krumm : 0.2;
    let v = 0, g = 0;
    while (g < ziel && v < ziel * 25) {
      v++;
      const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
      if (!T.inPoly(x, y, pts)) continue;
      const wb = (typeof w === "function" ? w(x, y) : w) + (T.rnd() - 0.5) * streu;
      const lb = L * (0.6 + T.rnd() * 0.8) * (o.laenge ? o.laenge(x, y) : 1);
      const li = o.licht ? o.licht(x, y) : T.rnd();
      const kb = krumm * (T.rnd() - 0.5) * 2;
      for (let b = 0; b < bu && g < ziel; b++) {
        const xx = x + (b ? (T.rnd() - 0.5) * lb * 0.3 : 0), yy = y + (b ? (T.rnd() - 0.5) * lb * 0.3 : 0);
        const a = (wb + (b ? (T.rnd() - 0.5) * 7 : 0)) * RAD, l = lb * (b ? 0.75 + T.rnd() * 0.45 : 1);
        const ex = Math.cos(a) * l, ey = Math.sin(a) * l, k = (kb + (T.rnd() - 0.5) * 0.08) * l;
        const i = Math.round(clamp(li + (T.rnd() - 0.5) * mix) * (farben.length - 1));
        eimer[i] += `M${i10(xx)} ${i10(yy)}q${i10(ex / 2 - Math.sin(a) * k)} ${i10(ey / 2 + Math.cos(a) * k)} ${i10(ex)} ${i10(ey)}`;
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
    const ziel = Math.round(n * (T.fein ? 1 : (o.szene != null ? o.szene : 0.25)));
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
      eimer[i] += `M${i10(sx)} ${i10(sy)}q${i10(dx * ll / 2 - dy * kk)} ${i10(dy * ll / 2 + dx * kk)} ${i10(dx * ll)} ${i10(dy * ll)}`;
    }
    return W.striche(eimer, farben);
  };
  /* weiche Licht-/Schattenformen [x, y, rx, ry, winkel, farbe, deckkraft] (oder fertiger SVG-Text) */
  const blur = new Set();
  W.blur = (sd) => {
    const k = String(Math.round(sd * 10)), id = T.id("bl" + k);
    if (!blur.has(k)) { blur.add(k); T.def(`<filter id="${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="${f1(sd)}"/></filter>`); }
    return `url(#${id})`;
  };
  W.weich = (liste, sd) => `<g filter="${W.blur(sd)}">` + liste.filter((e) => T.fein || typeof e === "string" || e[2] * e[3] > 30).map((e) => typeof e === "string" ? e :
    `<ellipse cx="${f1(e[0])}" cy="${f1(e[1])}" rx="${f1(e[2])}" ry="${f1(e[3])}"${e[4] ? ` transform="rotate(${e[4]} ${f1(e[0])} ${f1(e[1])})"` : ""} fill="${e[5]}"${e[6] < 1 ? ` fill-opacity="${e[6]}"` : ""}/>`).join("") + `</g>`;
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
    const mid = T.id("fm" + n);
    T.def(`<mask id="${mid}" maskUnits="userSpaceOnUse" x="${box[0] - 9}" y="${box[1] - 9}" width="${box[2] - box[0] + 18}" height="${box[3] - box[1] + 18}">` +
      `<rect x="${box[0] - 9}" y="${box[1] - 9}" width="${box[2] - box[0] + 18}" height="${box[3] - box[1] + 18}" fill="${T.lg("fmg", [[0, "#fff"], [0.5, "#999"], [1, "#333"]])}"/></mask>`);
    return s + `<g mask="url(#${mid})">${h}</g>`;
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
  /* Linien (mehrere offene Züge in EINEM Pfad) */
  W.L = (zuege, farbe, w, op = 1, extra = "") =>
    `<path d="${zuege.map((p) => typeof p === "string" ? p : G(p, false)).join("")}" fill="none" stroke="${farbe}" stroke-width="${w}"${op < 1 ? ` stroke-opacity="${op}"` : ""} stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  /* Finger/Zehe als runde Glieder-Kette: pts Mittellinie, b Breite, farbe; Licht-Grat oben; Nagel an der Spitze */
  W.glied = (pts, b, farbe, licht, o = {}) => {
    const d = G(pts, false);
    let s = `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${f1(b)}" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (licht) s += `<path d="${d}" fill="none" stroke="${licht}" stroke-opacity="${o.la || 0.35}" stroke-width="${f1(b * 0.35)}" stroke-linecap="round" transform="translate(${f1(-b * 0.12)} ${f1(-b * 0.22)})"/>`;
    return s;
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
  const SCHWARZ = [["#020202", 0.16, 0.6], ["#121110", 0.16, 0.55], ["#262422", 0.15, 0.5], ["#45423e", 0.15, 0.5], ["#6d6964", 0.14, 0.45], ["#9c9893", 0.13, 0.45]];
  const SILBER = [["#2e2c2a", 0.15, 0.5], ["#55524e", 0.15, 0.5], ["#86827c", 0.14, 0.5], ["#b1aca5", 0.13, 0.55], ["#d6d2ca", 0.12, 0.6], ["#f4f2ed", 0.12, 0.65]];
  const KAPPE = [["#170c07", 0.15, 0.6], ["#2e1a0e", 0.15, 0.6], ["#4c2c1a", 0.14, 0.55], ["#6c4228", 0.13, 0.5], ["#8d6040", 0.12, 0.45]];
  const HAUT = "#1a1817";
  const licht = (x, y) => clamp(0.1 + (-y - 40) / 105 - (x - 40) / 600);
  const fellG = (n, y0, y1, a = "#2b2927", b = "#171615", c = "#090808") => T.lg(n, [[0, a], [0.5, b], [1, c]], 0, y0, 0, y1, UB);
  const sz = T.fein ? 1 : 0.55;
  const rumpfW = (x, y) => (x > 74 ? 168 - clamp((x - 74) / 40) * 70 : 184 - clamp((y + 116) / 55) * 42);
  let s = "";

  /* ---------- fernes Hinterbein (hinten versetzt, dunkler) ---------- */
  s += gorillaFuss(W, T, -21, true);
  const beinF = [[14, -80], [26, -68], [30, -56], [28, -44], [22, -34], [16, -24], [14, -14]].concat(
    W.zotteln([[14, -14], [8, -10], [1, -10]], 2.4 / sz, 2, 80).slice(1), W.zotteln([[1, -10], [-3, -18], [-3, -30], [-1, -42], [2, -54], [6, -66], [14, -80]], 3 / sz, 2.4, 100).slice(1));
  s += W.teil(beinF, fellG("bf", -80, -10, "#1a1918", "#0f0e0e", "#060606"),
    W.fell("bf", 100, [-6, -80, 31, -8], { ho: 0.35 }) +
    W.haare(beinF, 70, 100, 2.6, SCHWARZ, { licht: (x, y) => licht(x, y) * 0.5, buendel: 3, szene: 0.1 }), { rand: 0 });

  /* ---------- fernes Vorderbein (vorn, greift weiter aus) ---------- */
  s += knoechelhand(W, T, 118, true);
  const armF = [[94, -106], [108, -104], [115, -92], [117, -76], [120, -60], [123, -46], [126, -35]].concat(
    W.zotteln([[126, -35], [125, -27], [119, -24.5], [112, -25], [109, -29]], 2.6 / sz, 2.6, 92).slice(1),
    W.zotteln([[109, -29], [106, -40], [102, -54], [99, -68], [96, -84], [94, -100]], 3 / sz, 4.2, 104).slice(1));
  s += W.teil(armF, fellG("af", -106, -24, "#1c1b1a", "#100f0f", "#070707"),
    W.fell("af", 96, [92, -106, 127, -22], { ho: 0.4 }) +
    W.weich([[119, -70, 3.5, 20, -8, "#7c8086", 0.25], [104, -52, 4, 22, -10, "#000", 0.5]], 3) +
    W.haare(armF, 120, 100, 3.4, SCHWARZ, { licht: (x, y) => licht(x, y) * 0.6 + (x > 114 ? 0.15 : 0), buendel: 3, szene: 0.1 }), { rand: 0 });

  /* ---------- Rumpf mit Silbersattel ---------- */
  const ruecken = W.zotteln([[1, -78], [3, -90], [12, -99], [26, -106], [42, -114], [58, -122], [72, -129]], 3.2 / sz, 1.6, (x) => (x < 6 ? 120 : 196));
  const buckel = W.zotteln([[72, -129], [84, -133.5], [96, -133], [104, -129]], 3.4 / sz, 1.8, 194);
  const bauch = W.zotteln([[108, -72], [98, -60], [84, -52], [68, -48], [52, -49], [38, -53], [26, -58]], 2.8 / sz, 4.2, 96, { laenge: (x) => 0.6 + clamp((x - 30) / 40) * 0.6 });
  const rumpf = ruecken.concat(buckel.slice(1), [[110, -121], [116, -108], [117, -96], [114, -84]], bauch, [[14, -62], [6, -68]]);
  const sattel = [[-2, -80], [2, -91], [12, -100], [26, -107], [42, -115], [58, -123], [70, -128]].concat(
    W.zotteln([[70, -128], [69, -116], [64, -100], [54, -86], [42, -76], [28, -70], [14, -71], [2, -75]], 2.4 / sz, 3.2, rumpfW).slice(1));
  const satLicht = (x, y) => clamp(0.32 + (-y - 80) / 40 - Math.max(0, x - 48) / 45);
  const satG = T.lg("sat", [[0, "#c9c4bc"], [0.45, "#a39e96"], [1, "#56534e"]], 0, -124, 0, -70, UB);
  s += W.teil(rumpf, fellG("rf", -134, -48, "#2c2a28", "#191817", "#080707"),
    W.fell("rf", 165, [-2, -135, 117, -46], { ho: 0.5, fx: 2.6, fy: 0.26 }) +
    W.weich([`<path d="${G(sattel)}" fill="${satG}" opacity=".7"/>`], 3.5) + `<path d="${G(sattel)}" fill="${satG}" opacity=".85"/>` +
    W.fell("sat", 172, [-2, -128, 70, -68], { hell: "#f4f1ea", dunkel: "#2a2826", ho: 0.5, do: 0.55, fx: 3, fy: 0.32, hk: "s", licht: false }) +
    W.weich([
      [34, -103, 24, 6, -18, "#ffffff", 0.3], [84, -127, 13, 5, -5, "#b7bcc4", 0.35], [80, -96, 10, 22, 8, "#000", 0.35],
      [70, -55, 40, 9, 0, "#000", 0.6], [104, -66, 12, 12, 0, "#000", 0.55], [14, -72, 13, 7, 0, "#000", 0.3], [48, -92, 10, 6, -20, "#000", 0.18],
    ], 4.5) +
    W.haare(rumpf, 160, rumpfW, 2.8, SCHWARZ, { licht: (x, y) => licht(x, y) * 0.9, buendel: 3, szene: 0.1 }) +
    W.haare(sattel, 250, rumpfW, 2.2, SILBER, { licht: satLicht, buendel: 3, mix: 0.5, szene: 0.1 }),
  { rand: 0 });
  s += W.saum([[1, -78], [3, -90], [12, -99], [26, -106], [42, -114], [58, -122], [72, -129]], 44, (x) => (x < 6 ? 130 : 192), 1.5, SILBER, { licht: (x) => clamp(0.9 - x / 160), szene: 0.12 });
  s += W.saum([[108, -72], [98, -60], [84, -52], [68, -48], [52, -49], [38, -53], [26, -58]], 36, 94, 3.2, SCHWARZ, { licht: () => 0.15, szene: 0.12 });

  /* ---------- nahes Hinterbein (Oberschenkel mit Silber, oben weich in den Rumpf) ---------- */
  s += gorillaFuss(W, T, 0, false);
  const beinN = [[14, -95], [24, -86], [34, -74], [42, -64], [49, -56], [51.5, -46], [49, -38], [45, -30], [43, -22]].concat(
    W.zotteln([[43, -22], [42.5, -15], [36, -11], [28, -10.5], [21, -14]], 2.2 / sz, 2.2, 84).slice(1),
    W.zotteln([[21, -14], [19.5, -21], [17, -30], [13, -42], [8, -54], [3, -66], [1, -78], [2, -92]], 3 / sz, 2.6, 104).slice(1));
  s += W.teil(beinN, fellG("bn", -94, -10),
    W.fell("bn", 102, [-1, -96, 52, -8], { ho: 0.55 }) +
    W.weich([[26, -80, 12, 8, 30, "#fff", 0.22], [45.5, -46, 4, 11, -25, "#9da1a8", 0.3], [9, -40, 6, 18, -15, "#000", 0.5], [32, -14, 12, 4, 0, "#000", 0.45], [37, -55, 6, 8, 0, "#000", 0.3]], 3) +
    W.haare(beinN, 160, (x, y) => (y < -58 ? 118 : 100), 2.6, SCHWARZ, { licht: (x, y) => licht(x, y) * 0.85, buendel: 3, szene: 0.1 }) +
    "",
  { rand: 0, maske: W.maske("bn", [-10, -100, 60, -5], 0, -90, 0, -70) });

  /* ---------- nahes Vorderbein (Arm), Schulter weich im Rumpf ---------- */
  s += knoechelhand(W, T, 92, false);
  const armN = [[66, -112], [72, -124], [84, -129], [98, -125], [106, -115], [109, -101], [108, -87], [104.5, -75], [102.5, -64], [104, -52], [103, -40], [101.4, -33]].concat(
    W.zotteln([[101.4, -33], [100, -27], [94, -24.5], [87, -24.5], [83, -28]], 2.4 / sz, 2.8, 90).slice(1),
    W.zotteln([[83, -28], [80, -36], [77, -46], [74, -57], [70.5, -66], [69, -72], [67, -82], [66, -96], [66, -110]], 2.8 / sz, 5, (x, y) => 100 + (y < -66 ? 14 : 4)).slice(1));
  s += W.teil(armN, fellG("an", -129, -24, "#2e2c2a", "#1a1918", "#0b0a0a"),
    W.fell("an", 100, [64, -130, 110, -22], { ho: 0.6 }) +
    W.weich([
      [88, -112, 12, 8, -12, "#c3c7cd", 0.3], [101, -96, 4.5, 12, 0, "#a4a8ae", 0.25], [97.5, -56, 4.5, 12, -4, "#a4a8ae", 0.25],
      [72, -90, 6, 24, 0, "#000", 0.6], [81, -42, 4, 16, 0, "#000", 0.5], [90, -68, 12, 3, -10, "#000", 0.35], [92, -30, 9, 4, 0, "#000", 0.4],
    ], 3.2) +
    W.haare(armN, 270, (x, y) => (y < -70 ? (x < 82 ? 118 : 104) : y < -58 ? 112 : 96), 3.8, SCHWARZ,
      { licht: (x, y) => licht(x, y) + (x > 90 ? 0.12 : -0.12), buendel: 4, krumm: 0.25, szene: 0.1 }),
  { rand: 0, vol: false, maske: W.maske("an", [55, -140, 120, -15], 0, -127, 0, -112) });
  s += W.L([G([[108.6, -96], [108, -87], [104.5, -75], [102.5, -64], [104, -52], [103, -40], [101.4, -33]], false)], "#000", 0.5, 0.35);
  s += W.saum([[66, -96], [67, -82], [70.5, -68], [74, -57], [77, -46], [80, -36], [83, -28]], 50, (x, y) => 102 + (y < -66 ? 14 : 4), 4.6, SCHWARZ, { licht: (x, y) => clamp(0.3 + (-y - 60) / 200), szene: 0.12 });

  /* ---------- Kopf ---------- */
  s += gorillaKopf(T, W, SCHWARZ, KAPPE, HAUT, licht, fellG, sz);
  return W.fertig(s, 1);
}

/* Knöchelhand (Gorilla): Handgelenk-Mitte x = wx (Gelenk bei y ≈ −26). Finger 2–5 eingerollt: Grundglied schräg nach
   vorn-unten, Mittelglied liegt mit dem RÜCKEN auf dem Boden, Endglied unter die Hand gerollt (Nagel zeigt nach hinten).
   Man sieht den kleinen Finger (nah), davor ragen Ring- und Mittelfinger (länger, dahinter) heraus. fern = Schattenseite. */
function knoechelhand(W, T, wx, fern) {
  const P = (x, y) => [wx + x, y];
  const C = fern ? ["#0e0d0d", "#121110", "#151413"] : ["#151413", "#1b1a19", "#22201f"];
  const LI = fern ? "#4a4642" : "#9a948d";
  let s = "";
  const finger = (dx, b, c, la, my) => {
    const mcp = P(9.4 + dx * 0.3, my), pip = P(13.4 + dx, -b / 2), dip = P(8.8 + dx, -b / 2), tip = P(6.6 + dx, -b / 2 - 1.5);
    let f = W.glied([mcp, P(12 + dx, -6.6), pip, dip, tip], b, c, LI, { la });
    if (T.fein && !fern) f += W.L([`M${f1(pip[0] - 0.2)} ${f1(-b + 0.2)}q1.3 .3 1.9 1.6`, `M${f1(pip[0] - 1)} ${f1(-b + 0.5)}q1.2 .3 1.7 1.5`, `M${f1(pip[0] - 1.8)} ${f1(-b + 1)}q1 .3 1.3 1.2`,
      `M${f1(mcp[0] + 0.4)} ${f1(mcp[1] + 0.2)}q1.4 -.1 2 1`], "#000", 0.16, 0.8) + W.L([`M${f1(pip[0])} ${f1(-b - 0.1)}q1.3 .3 2 1.6`], "#b1aba4", 0.12, 0.5);
    /* Nagel am eingerollten Endglied, zeigt nach hinten-unten */
    const nx = tip[0] - 0.5, ny = tip[1] + 0.8;
    f += `<ellipse cx="${f1(nx)}" cy="${f1(ny)}" rx=".65" ry="1.1" transform="rotate(-35 ${f1(nx)} ${f1(ny)})" fill="${fern ? "#35312d" : "#5e5750"}"/>` +
      (T.fein ? `<path d="M${f1(nx - 0.5)} ${f1(ny - 0.7)}q.3 -.4 .9 -.3" stroke="#e6dfd6" stroke-opacity="${fern ? 0.25 : 0.55}" stroke-width=".14" fill="none"/>` : "");
    return f;
  };
  s += finger(2.6, 4.4, C[0], 0.2, -12) + finger(1.2, 4.2, C[1], 0.24, -11.4);
  /* Handrücken (Mittelhand, schräg nach vorn-unten) und Handballen (hinten, angehoben) */
  const hand = [P(-5.8, -28), P(5.8, -28), P(8.2, -20), P(10.4, -13.8), P(11.2, -10.6), P(9, -8.4), P(6, -7.4), P(3.4, -5.6), P(1, -6.8), P(-2.6, -10.8), P(-5, -16.4), P(-6, -22)];
  s += W.teil(hand, T.lg(fern ? "hdf" : "hd", fern ? [[0, "#222020"], [0.6, "#121111"], [1, "#080808"]] : [[0, "#34312f"], [0.55, "#1d1c1b"], [1, "#0c0b0b"]], 1, 0, 0, 1),
    W.weich([[wx + 6, -17.5, 3, 7, -22, fern ? "#5a5550" : "#a39d96", 0.5], [wx + 10.2, -12, 1.6, 1.6, 0, fern ? "#5a5550" : "#aea8a1", 0.45], [wx - 3, -11, 3, 5, 20, "#000", 0.55]], 1) +
    (T.fein && !fern ? W.L([`M${f1(wx + 9.2)} ${f1(-14.8)}q1.3 -.1 2.1 .9`, `M${f1(wx + 8.8)} ${f1(-13.6)}q1.3 0 2 .9`, `M${f1(wx + 3)} ${f1(-21.6)}q1.8 .5 3 1.8`,
      `M${f1(wx + 2.2)} ${f1(-18.6)}q1.8 .6 3 1.8`, `M${f1(wx - 3.6)} ${f1(-12.4)}q1.4 -1.4 3.4 -1.4`, `M${f1(wx + 0.6)} ${f1(-9)}q1.2 -.8 2.8 -.6`], "#000", 0.15, 0.7) : ""),
  { rand: 0.5, vol: false });
  /* kleiner Finger (nah): kürzer, ganz vorn im Bild */
  s += finger(-1.4, 3.9, C[2], 0.38, -10.2);
  return s;
}

/* Gorillafuß: Sohlengänger, Ferse rund, kurze dicke Zehen 2–5 gestaffelt (nach unten gekrümmt) mit Nägeln oben;
   dx = Versatz (ferner Fuß), fern = Schattenseite */
function gorillaFuss(W, T, dx, fern) {
  const P = (x, y) => [x + dx, y];
  const C = fern ? ["#0b0a0a", "#0d0c0c", "#100f0f", "#121111"] : ["#121110", "#161514", "#1a1918", "#201e1d"];
  const LI = fern ? "#46423e" : "#8f8982";
  let s = "";
  /* Zehen 2–4 (fern → nah), Fuß, dann Zehe 5 (nah) */
  const zehe = (i) => {
    const [bx, by, tx, b] = [[38.4, -7.4, 46.6, 3.4], [38.2, -6.6, 45.6, 3.3], [37.8, -5.8, 44.4, 3.2], [37.2, -4.8, 42.8, 3]][i];
    let z = W.glied([P(bx, by), P(bx + (tx - bx) * 0.62, by + 1.4), P(tx - 0.4, -b / 2 - 0.1)], b, C[i], LI, { la: 0.3 });
    const nx = tx - 1.5 + dx, ny = -b + 0.15;
    z += `<ellipse cx="${f1(nx)}" cy="${f1(ny)}" rx="1.05" ry=".5" transform="rotate(30 ${f1(nx)} ${f1(ny)})" fill="${fern ? "#302c29" : "#5a534c"}"/>` +
      (T.fein ? `<path d="M${f1(nx - 0.8)} ${f1(ny - 0.2)}q.6 -.4 1.3 0" stroke="#e0d9d0" stroke-opacity="${fern ? 0.2 : 0.5}" stroke-width=".13" fill="none"/>` +
        (fern ? "" : W.L([`M${f1(bx + 3.4 + dx)} ${f1(by - 0.6)}q.5 .9 .3 1.8`], "#000", 0.14, 0.7)) : "");
    return z;
  };
  s += zehe(0) + zehe(1) + zehe(2);
  const fussPts = [P(20, -14), P(17.6, -8.6), P(18, -2.6), P(21.6, 0, 1), P(37, 0, 1), P(39.6, -1.4), P(40.6, -4.2), P(39.6, -7.4), P(36, -9.4), P(31.4, -11.4), P(26.4, -14.6)];
  s += W.teil(fussPts, T.lg(fern ? "fuf" : "fu", fern ? [[0, "#222020"], [0.6, "#121111"], [1, "#080808"]] : [[0, "#302e2c"], [0.55, "#1b1a19"], [1, "#0c0b0b"]]),
    W.weich([[dx + 30, -10.6, 9, 2.6, -14, LI, 0.5], [dx + 29, -0.8, 11, 1.4, 0, "#000", 0.6], [dx + 19.4, -6, 1.8, 3.6, 0, LI, 0.35]], 1) +
    (T.fein && !fern ? W.L(["M32.6 -10.8q3.4 1 6 3", "M26.6 -8q3.4 .8 5.8 2.6", "M22.4 -3.6q2.4 .4 4 1.8", "M20.4 -9.6q1.2 1.8 1.2 3.8"].map((d) => d.replace(/^M([\d.]+)/, (m, x) => "M" + f1(+x + dx))), "#000", 0.16, 0.6) : ""),
  { rand: 0.5, vol: false });
  s += zehe(3);
  return s;
}

/* Gorillakopf im Profil (absolut in cm): Scheitelkamm, Überaugenwulst, tiefliegendes Auge, Nasenflügel, Schnauze */
function gorillaKopf(T, W, SCHWARZ, KAPPE, HAUT, licht, fellG, sz) {
  let s = "";
  const profil = [[121, -125], [126.6, -120], [130.8, -115.6], [131.2, -112.6], [129.4, -110.8], [130.2, -108.6], [132.6, -106.4], [135.4, -104.2], [137.6, -101.6],
    [138.2, -98.8], [137.4, -96.8], [138.4, -94.6], [137.8, -92.2], [135.8, -90.4], [133.8, -87.4], [130, -84.8]];
  const kopf = W.zotteln([[96, -99], [92, -110], [91, -120], [97, -127.6], [106, -131.6], [114, -129.6], [121, -125]], 2.6 / sz, 1.6, (x) => (x < 100 ? 150 : 196)).concat(
    profil.slice(1), W.zotteln([[130, -84.8], [122, -84.2], [112, -85.8], [104, -90], [96, -99]], 2 / sz, 1.6, 96).slice(1));
  const gesicht = profil.concat([[124, -84.4], [120.6, -88.6], [118.4, -95], [117.2, -102], [116.6, -110], [116.8, -119], [118, -124.4]]);
  const kappe = [[89, -121], [97, -128], [106, -132], [114, -130], [119, -127], [114, -123.4], [104, -123], [96, -119.6], [91, -116]];
  const ohr = [[107.8, -107.4], [110.6, -108.4], [112.4, -105.8], [112, -101.6], [110, -99.4], [108, -100.4], [107.2, -103.6]];
  const kopfW = (x, y) => (y < -121 ? 196 : x < 112 ? 118 + clamp((y + 120) / 30) * 10 : 104);
  s += W.teil(kopf, fellG("kf", -131, -84, "#2b2927", "#161514", "#090808"),
    W.fell("kf", 115, [88, -133, 139, -83], { ho: 0.5, fy: 0.34 }) +
    W.weich([[104, -126, 12, 4, -12, "#c5c9cf", 0.3], [108, -93, 10, 7, 0, "#000", 0.55]], 2.6) +
    W.haare(kopf, 140, kopfW, 1.9, SCHWARZ, { licht: (x, y) => licht(x, y) * 0.9, buendel: 3, szene: 0.12 }) +
    W.weich([`<path d="${G(kappe)}" fill="#4a2a17" opacity=".55"/>`], 2) +
    W.haare(kappe, 90, (x, y) => (x < 104 ? 210 : 192), 1.7, KAPPE, { licht: (x, y) => clamp(0.25 + (-y - 121) / 10), buendel: 3, szene: 0.15 }) +
    gorillaGesicht(T, W, gesicht, HAUT) +
    W.saum([[118, -124.4], [116.8, -119], [116.6, -110], [117.2, -102], [118.4, -95], [120.6, -88.6]], 50, (x, y) => (y < -112 ? 20 : y < -96 ? 0 : 30), 1.6, SCHWARZ, { licht: () => 0.3, ein: 0.5, szene: 0.12 }) +
    W.saum([[121, -125], [126.6, -120], [130, -116.4]], 16, 205, 1.2, SCHWARZ, { licht: () => 0.5, ein: 0.7, szene: 0.2 }),
  { rand: 0, vol: false });
  s += W.L([G(profil, false)], "#000", 0.3, 0.45);
  s += W.teil(ohr, "#1c1a19", W.L(["M110.8 -106.4q1 2 0 4.6", "M109.6 -104.4q.6 1.2 -.2 2.4"], "#000", 0.35, 0.8) + W.L(["M111.3 -106.8q1 2 0 4.6"], "#8a847e", 0.2, 0.5), { rand: 0.4 });
  s += W.saum([[107.4, -108.6], [107.6, -103], [108.6, -99.6]], 16, 15, 1.6, SCHWARZ, { licht: () => 0.35 });
  s += W.saum([[91, -120], [97, -127.6], [106, -131.6], [114, -129.6]], 30, (x) => (x < 104 ? 212 : 196), 1.5, KAPPE, { licht: () => 0.55, szene: 0.15 });
  return s;
}

/* Gesichtshaut des Gorillas: schwarz, ledrig glänzend, feine Poren (Relief), Falten; Auge, Nase, Mund */
function gorillaGesicht(T, W, gesicht, HAUT) {
  const g = G(gesicht);
  let haut = `<path d="${g}" fill="${T.lg("gh", [[0, "#2e2c2b"], [0.45, HAUT], [1, "#0d0c0c"]], 0, -127, 0, -84, UB)}"/>` +
    W.weich([
      [124, -121, 6.5, 2, 28, "#aaa5a0", 0.7], [132.6, -105.8, 2.2, 1, 38, "#a29d98", 0.45], [131, -96.6, 5, 2.2, -6, "#7a7570", 0.5],
      [131.4, -88.8, 3.4, 1.3, -14, "#7d7873", 0.45], [124.6, -110.6, 5, 2.3, 6, "#000", 0.9], [121.6, -99, 4, 7, 0, "#000", 0.35], [119.6, -116, 3, 4, 0, "#000", 0.4],
    ], 0.9);
  if (T.fein) haut += W.L([
    "M118.6 -121.4q4 -1.8 8.4 -.4", "M118.6 -119.4q4 -1.4 8 0", "M119.4 -117.6q3 -.8 6 .2",
    "M129.9 -109.4q1.1 .5 1.5 1.5", "M130.9 -108.1q1.1 .5 1.5 1.4", "M131.9 -106.9q1 .5 1.3 1.3",
    "M120.6 -107q2.8 1.7 6.4 .5", "M120 -105.2q3.4 1.8 7.4 .2", "M119.8 -103q3.8 1.6 8.1 -.5",
    "M132.6 -100.4q-2.3 3.4 -1.3 7.6", "M130 -101.2q-3 4.4 -.8 10", "M133.2 -87q-2.4 -.6 -4 .2", "M125.8 -95q-.6 3 .6 6",
    "M136 -96.4l-.2 1.4", "M134.6 -96.4l-.2 1.4", "M133.2 -96.2l-.2 1.4",
  ], "#000", 0.24, 0.8) + W.L([
    "M118.7 -122.1q4 -1.8 8.4 -.4", "M130 -110q1.1 .5 1.5 1.5", "M131 -108.7q1.1 .5 1.5 1.4", "M120.7 -107.7q2.8 1.7 6.4 .5",
    "M120.1 -105.9q3.4 1.8 7.4 .2", "M133.1 -100.6q-2.3 3.4 -1.3 7.6", "M130.5 -101.4q-3 4.4 -.8 10",
  ], "#b3ada7", 0.15, 0.5);
  let s = W.relief("gesicht", haut, { f: 3, tiefe: 0.25, okt: 2 });
  /* Nase (flach, breit): wulstiger Nasenflügel, darunter/davor das nach vorn-unten offene Nasenloch (Sichel) */
  s += `<path d="${G([[135.2, -100.8], [136.8, -101.2], [137.9, -99.8], [137.6, -98], [136.4, -97.6], [136.6, -98.8]])}" fill="#030202"/>`;
  s += W.L(["M135.6 -102.6q-2.8 .2 -3 2.6q0 2.4 2.6 3q1.6 .4 2.8 -.2"], "#22201f", 1.3, 1) +
    W.L(["M135.8 -103.1q-2.8 .2 -3.2 2.4"], "#aba59f", 0.3, 0.6) + W.L(["M132.6 -99.6q.2 2.4 2.6 3"], "#000", 0.3, 0.7);
  s += W.L(["M131.2 -103.8q2.2 -1.6 4.6 -.6"], "#000", 0.26, 0.7);
  s += `<ellipse cx="134.4" cy="-102.2" rx=".9" ry=".36" transform="rotate(-22 134.4 -102.2)" fill="#fff" opacity=".4"/>`;
  /* Mund: lange Mundspalte, schmale Lippen, Glanz auf der Oberlippe */
  s += W.L(["M138.2 -93.8q-3 .5 -6 .3q-3 -.1 -5.6 1"], "#000", 0.5, 0.95) + W.L(["M137.6 -92.9q-3 .4 -6.4 .3"], "#8a847f", 0.2, 0.45) +
    W.L(["M137.6 -95.6q-2.6 .3 -5.2 0"], "#aaa49f", 0.22, 0.4);
  /* Auge: tief unter dem Wulst, dunkelbraun mit Lidern; Wulstschatten darüber */
  s += T.augeReal(125.3, -109.3, 1.3, { iris: "#3e210d", iris2: "#120804", offen: 0.72, winkel: 6, lid: "#050404", wimpern: 10, wimpernLaenge: 0.38, wimpernFarbe: "#080606" });
  s += `<path d="${G([[121.2, -111.9], [125.2, -113.3], [130, -111.6], [128.4, -110.4], [125.2, -111.6], [122.4, -110.9]])}" fill="#000" opacity=".4"/>`;
  s += W.L(["M121.8 -107q3 1.4 6.2 0"], "#8f8984", 0.15, 0.45);
  return s;
}

module.exports = [
  { id: "gorilla", de: "der Gorilla", syl: "Go-RIL-la", it: "il gorilla", itSyl: "go-RIL-la", en: "gorilla",
    gruppe: "Exoten", lebensraum: "Regenwald", laenge: 1.42, hoehe: 1.35, zeichne: gorilla },
];
