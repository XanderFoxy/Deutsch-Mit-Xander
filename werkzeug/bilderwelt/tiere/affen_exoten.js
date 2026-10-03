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
  W.box = (pts) => { for (const p of pts) W.B.push(p); return pts; };
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
    const ziel = Math.round(n * (T.fein ? 1 : (o.szene != null ? o.szene * 0.5 : 0.08)));
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
    const k = String(Math.round(sd * 10)), id = T.id("bl" + k);
    if (!blur.has(k)) { blur.add(k); T.def(`<filter id="${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="${f1(sd)}"/></filter>`); }
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
  const SCHWARZ = [["#020202", 0.16, 0.6], ["#121110", 0.16, 0.55], ["#262422", 0.15, 0.5], ["#45423e", 0.15, 0.5], ["#6d6964", 0.14, 0.45], ["#9c9893", 0.13, 0.45]];
  const SILBER = [["#2e2c2a", 0.15, 0.5], ["#55524e", 0.15, 0.5], ["#86827c", 0.14, 0.5], ["#b1aca5", 0.13, 0.55], ["#d6d2ca", 0.12, 0.6], ["#f4f2ed", 0.12, 0.65]];
  const KAPPE = [["#170c07", 0.15, 0.6], ["#2e1a0e", 0.15, 0.6], ["#4c2c1a", 0.14, 0.55], ["#6c4228", 0.13, 0.5], ["#8d6040", 0.12, 0.45]];
  const HAUT = "#1a1817";
  const licht = (x, y) => clamp(0.1 + (-y - 40) / 105 - (x - 40) / 600);
  const fellG = (n, y0, y1, a = "#2b2927", b = "#171615", c = "#090808") => T.lg("fg" + a.slice(1) + c.slice(1), [[0, a], [0.5, b], [1, c]]);
  const sz = T.fein ? 0.88 : 0.35;
  const rumpfW = (x, y) => (x > 74 ? 168 - clamp((x - 74) / 40) * 70 : 184 - clamp((y + 116) / 55) * 42);
  let s = "";

  /* ---------- fernes Hinterbein (hinten versetzt, dunkler) ---------- */
  s += gorillaFuss(W, T, -21, true);
  const beinF = [[14, -80], [26, -68], [30, -56], [28, -44], [22, -34], [16, -24], [14, -14]].concat(
    W.zotteln([[14, -14], [8, -10], [1, -10]], 2 / sz, 3, 80).slice(1), W.zotteln([[1, -10], [-3, -18], [-3, -30], [-1, -42], [2, -54], [6, -66], [14, -80]], 3 / sz, 2.4, 100).slice(1));
  s += W.teil(beinF, fellG("bf", -80, -10, "#232120", "#141312", "#080808"),
    W.fell("bf", 100, [-6, -80, 31, -8], { ho: 0.35 }) +
    W.haare(beinF, 50, 100, 2.6, SCHWARZ, { licht: (x, y) => licht(x, y) * 0.5, buendel: 3, gerade: true, szene: 0.07 }), { rand: 0 });

  /* ---------- fernes Vorderbein (vorn, greift weiter aus) ---------- */
  s += knoechelhand(W, T, 118, true);
  const armF = [[94, -106], [108, -104], [115, -92], [117, -76], [120, -60], [123, -46], [126, -35]].concat(
    W.zotteln([[126, -35], [125, -27], [119, -24.5], [112, -25], [109, -29]], 2.6 / sz, 2.6, 92).slice(1),
    W.zotteln([[109, -29], [106, -40], [102, -54], [99, -68], [96, -84], [94, -100]], 3 / sz, 4.2, 104).slice(1));
  s += W.teil(armF, fellG("af", -106, -24, "#242221", "#151413", "#090909"),
    W.fell("af", 96, [92, -106, 127, -22], { ho: 0.4 }) +
    W.weich([[119, -70, 3.5, 20, -8, "#7c8086", 0.25], [104, -52, 4, 22, -10, "#000", 0.5]], 3) +
    W.haare(armF, 85, 100, 3.4, SCHWARZ, { licht: (x, y) => licht(x, y) * 0.6 + (x > 114 ? 0.15 : 0), buendel: 3, szene: 0.07 }), { rand: 0 });

  /* ---------- Rumpf mit Silbersattel ---------- */
  const ruecken = W.zotteln([[1, -78], [3, -90], [12, -99], [26, -106], [42, -114], [58, -122], [72, -129]], 3.2 / sz, 1.6, (x) => (x < 6 ? 120 : 196));
  const buckel = W.zotteln([[72, -129], [84, -133.5], [96, -133], [104, -129]], 3.4 / sz, 1.8, 194);
  const bauch = W.zotteln([[108, -72], [98, -60], [84, -52], [68, -48], [52, -49], [38, -53], [26, -58]], 2.8 / sz, 4.2, 96, { laenge: (x) => 0.6 + clamp((x - 30) / 40) * 0.6 });
  const rumpf = ruecken.concat(buckel.slice(1), [[110, -121], [116, -108], [117, -96], [114, -84]], bauch, [[14, -62], [6, -68]]);
  const sattel = [[-2, -80], [2, -91], [12, -100], [26, -107], [42, -115], [58, -123], [70, -128]].concat(
    W.zotteln([[70, -128], [69, -116], [64, -100], [54, -86], [42, -76], [28, -70], [14, -71], [2, -75]], 2.4 / sz, 3.2, rumpfW).slice(1));
  const satLicht = (x, y) => clamp(0.32 + (-y - 80) / 40 - Math.max(0, x - 48) / 45);
  const satId = T.id("sattel"); T.def(`<path id="${satId}" d="${G(sattel)}"/>`);
  const satG = T.lg("sat", [[0, "#c9c4bc"], [0.45, "#a39e96"], [1, "#56534e"]], 0, -124, 0, -70, UB);
  s += W.teil(rumpf, fellG("rf", -134, -48, "#2c2a28", "#191817", "#080707"),
    W.fell("rf", 165, [-2, -135, 117, -46], { ho: 0.5, fx: 2.6, fy: 0.26 }) +
    W.weich([`<use href="#${satId}" fill="${satG}" opacity=".7"/>`], 3.5) + `<use href="#${satId}" fill="${satG}" opacity=".85"/>` +
    W.fell("sat", 172, [-2, -128, 70, -68], { hell: "#f4f1ea", dunkel: "#2a2826", ho: 0.5, do: 0.55, fx: 3, fy: 0.32, hk: "s", licht: false }) +
    W.weich([
      [34, -103, 24, 6, -18, "#ffffff", 0.3], [84, -127, 13, 5, -5, "#b7bcc4", 0.35], [80, -96, 10, 22, 8, "#000", 0.35],
      [70, -58, 40, 8, 0, "#000", 0.6], [104, -66, 12, 12, 0, "#000", 0.55], [14, -72, 13, 7, 0, "#000", 0.3], [48, -92, 10, 6, -20, "#000", 0.18],
      [66, -50.5, 30, 2.4, 2, "#6d6a66", 0.45],
    ], 4.5) +
    W.haare(rumpf, 108, rumpfW, 2.8, SCHWARZ, { licht: (x, y) => licht(x, y) * 0.9, buendel: 3, gerade: true, szene: 0.07 }) +
    W.haare(sattel, 172, rumpfW, 2.2, SILBER, { licht: satLicht, buendel: 3, gerade: true, mix: 0.5, szene: 0.07 }),
  { rand: 0 });
  s += W.saum([[1, -78], [3, -90], [12, -99], [26, -106], [42, -114], [58, -122], [72, -129]], 36, (x) => (x < 6 ? 130 : 192), 1.5, SILBER, { licht: (x) => clamp(0.9 - x / 160), gerade: true, szene: 0.07 });
  s += W.saum([[108, -72], [98, -60], [84, -52], [68, -48], [52, -49], [38, -53], [26, -58]], 30, 94, 3.2, SCHWARZ, { licht: () => 0.15, szene: 0.07 });

  /* ---------- nahes Hinterbein (Oberschenkel mit Silber, oben weich in den Rumpf) ---------- */
  s += gorillaFuss(W, T, 0, false);
  const beinN = [[14, -95], [24, -86], [34, -74], [42, -64], [49, -56], [51.5, -46], [49, -38], [45, -30], [43, -22]].concat(
    W.zotteln([[43, -22], [42.5, -15], [37, -10.5], [28, -10], [21, -13]], 2 / sz, 3, 80).slice(1),
    W.zotteln([[21, -14], [19.5, -21], [17, -30], [13, -42], [8, -54], [3, -66], [1, -78], [2, -92]], 3 / sz, 2.6, 104).slice(1));
  s += W.teil(beinN, fellG("bn", -94, -10),
    W.fell("bn", 102, [-1, -96, 52, -8], { ho: 0.55 }) +
    W.weich([[26, -80, 12, 8, 30, "#fff", 0.22], [45.5, -46, 4, 11, -25, "#9da1a8", 0.3], [9, -40, 6, 18, -15, "#000", 0.5], [32, -14, 12, 4, 0, "#000", 0.45], [37, -55, 6, 8, 0, "#000", 0.3]], 3) +
    W.haare(beinN, 100, (x, y) => (y < -58 ? 118 : 100), 2.6, SCHWARZ, { licht: (x, y) => licht(x, y) * 0.85, buendel: 3, gerade: true, szene: 0.07 }) +
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
      [104, -94, 9, 7, 0, "#000", 0.55],
    ], 3.2) +
    W.haare(armN, 188, (x, y) => (y < -70 ? (x < 82 ? 118 : 104) : y < -58 ? 112 : 96), 3.8, SCHWARZ,
      { licht: (x, y) => licht(x, y) + (x > 90 ? 0.12 : -0.12), buendel: 4, krumm: 0.25, szene: 0.07 }),
  { rand: 0, vol: false, maske: W.maske("an", [55, -140, 120, -15], 0, -127, 0, -112) });
  s += W.L([G([[108.6, -96], [108, -87], [104.5, -75], [102.5, -64], [104, -52], [103, -40], [101.4, -33]], false)], "#000", 0.5, 0.35);
  s += W.saum([[66, -96], [67, -82], [70.5, -68], [74, -57], [77, -46], [80, -36], [83, -28]], 42, (x, y) => 102 + (y < -66 ? 14 : 4), 4.6, SCHWARZ, { licht: (x, y) => clamp(0.3 + (-y - 60) / 200), szene: 0.07 });

  /* ---------- Kopf ---------- */
  s += gorillaKopf(T, W, SCHWARZ, KAPPE, HAUT, licht, fellG, sz);
  return W.fertig(s, 1, [86, -137, 141, -80], [7, 30, 96, 124]);
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
  if (T.fein) s += finger(2.6, 4.4, C[0], 0.2, -12) + finger(1.2, 4.2, C[1], 0.24, -11.4);
  /* Handrücken (Mittelhand, schräg nach vorn-unten) und Handballen (hinten, angehoben) */
  const hand = [P(-5.8, -28), P(5.8, -28), P(8.2, -20), P(10.4, -13.8), P(11.4, -10), P(10.6, -6.4), P(8.4, -3.6), P(5.6, -2.6), P(3, -3.4), P(0.6, -6.4), P(-2.6, -10.8), P(-5, -16.4), P(-6, -22)];
  s += W.teil(hand, !T.fein ? C[1] : T.lg(fern ? "hdf" : "hd", fern ? [[0, "#222020"], [0.6, "#121111"], [1, "#080808"]] : [[0, "#34312f"], [0.55, "#1d1c1b"], [1, "#0c0b0b"]], 1, 0, 0, 1),
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
    const [bx, by, tx, b] = [[36.4, -7.8, 47.8, 3.5], [36.2, -7, 46.8, 3.4], [35.8, -6, 45.4, 3.3], [35.2, -5, 43.6, 3.1]][i];
    let z = W.glied([P(bx, by), P(bx + (tx - bx) * 0.5, by + 0.6), P(bx + (tx - bx) * 0.82, by + 2.4), P(tx - 0.4, -b / 2 - 0.1)], b, C[i], LI, { la: 0.3 });
    if (T.fein && !fern) z += W.L([`M${f1(bx + (tx - bx) * 0.5 + dx - 0.3)} ${f1(by - b / 2 + 0.7)}q.6 .6 .5 1.6`, `M${f1(bx + (tx - bx) * 0.5 + dx + 0.5)} ${f1(by - b / 2 + 0.8)}q.5 .6 .4 1.5`], "#000", 0.13, 0.7);
    const nx = tx - 1.5 + dx, ny = -b + 0.15;
    z += `<ellipse cx="${f1(nx)}" cy="${f1(ny)}" rx="1.05" ry=".5" transform="rotate(30 ${f1(nx)} ${f1(ny)})" fill="${fern ? "#302c29" : "#5a534c"}"/>` +
      (T.fein ? `<path d="M${f1(nx - 0.8)} ${f1(ny - 0.2)}q.6 -.4 1.3 0" stroke="#e0d9d0" stroke-opacity="${fern ? 0.2 : 0.5}" stroke-width=".13" fill="none"/>` +
        (fern ? "" : W.L([`M${f1(bx + 3.4 + dx)} ${f1(by - 0.6)}q.5 .9 .3 1.8`], "#000", 0.14, 0.7)) : "");
    return z;
  };
  s += T.fein ? zehe(0) + zehe(1) + zehe(2) : zehe(1);
  const fussPts = [P(20, -14), P(17.6, -8.6), P(18, -2.6), P(21.6, 0, 1), P(35, 0, 1), P(37.6, -1.4), P(38.4, -4.2), P(37.6, -7.6), P(34, -9.6), P(30, -11.6), P(25.4, -14.6)];
  s += W.teil(fussPts, !T.fein ? C[2] : T.lg(fern ? "fuf" : "fu", fern ? [[0, "#222020"], [0.6, "#121111"], [1, "#080808"]] : [[0, "#302e2c"], [0.55, "#1b1a19"], [1, "#0c0b0b"]]),
    W.weich([[dx + 30, -10.6, 9, 2.6, -14, LI, 0.5], [dx + 29, -0.8, 11, 1.4, 0, "#000", 0.6], [dx + 19.4, -6, 1.8, 3.6, 0, LI, 0.35]], 1) +
    (T.fein && !fern ? W.L(["M32.6 -10.8q3.4 1 6 3", "M26.6 -8q3.4 .8 5.8 2.6", "M22.4 -3.6q2.4 .4 4 1.8", "M20.4 -9.6q1.2 1.8 1.2 3.8"].map((d) => d.replace(/^M([\d.]+)/, (m, x) => "M" + f1(+x + dx))), "#000", 0.16, 0.6) : ""),
  { rand: 0.5, vol: false });
  s += zehe(3);
  /* staubige Sohlenkante */
  s += W.L([`M${f1(dx + 18.6)} ${f1(-1.6)}q1 1.4 3.4 1.5h12`], fern ? "#4a4540" : "#7a736b", 0.5, 0.55);
  return s;
}

/* Gorillakopf im Profil (absolut in cm): Scheitelkamm, Überaugenwulst, tiefliegendes Auge, Nasenflügel, Schnauze */
function gorillaKopf(T, W, SCHWARZ, KAPPE, HAUT, licht, fellG, sz) {
  let s = "";
  const profil = [[121, -125], [126.6, -120], [130.8, -115.6], [131.2, -112.6], [129.4, -110.8], [130.2, -108.6], [132.6, -106.4], [135.4, -104.2], [137.6, -101.6],
    [138.2, -98.8], [137.4, -96.8], [138.4, -94.6], [137.8, -92.2], [135.8, -90.4], [133.8, -87.4], [130, -84.8]];
  const kopf = W.zotteln([[96, -99], [92, -110], [91, -120], [97, -127.6], [106, -131.6], [114, -129.6], [121, -125]], 2.6 / sz, 1.6, (x) => (x < 100 ? 150 : 196)).concat(
    profil.slice(1), [[124, -84], [116, -84.8], [108, -87.4], [101, -92.6]]);
  const gesicht = profil.concat([[124, -84.4], [120.6, -88.6], [118.4, -95], [117.2, -102], [116.6, -110], [116.8, -119], [118, -124.4]]);
  const kappe = [[89, -121], [97, -128], [106, -132], [114, -130], [119, -127], [114, -123.4], [104, -123], [96, -119.6], [91, -116]];
  const ohr = [[107.8, -107.4], [110.6, -108.4], [112.4, -105.8], [112, -101.6], [110, -99.4], [108, -100.4], [107.2, -103.6]];
  const kopfW = (x, y) => (y < -121 ? 196 : x < 112 ? 118 + clamp((y + 120) / 30) * 10 : 104);
  s += W.teil(kopf, fellG("kf", -131, -84, "#2b2927", "#161514", "#090808"),
    W.fell("kf", 115, [88, -133, 139, -83], { ho: 0.32, fy: 0.45 }) +
    W.weich([[104, -126, 12, 4, -12, "#c5c9cf", 0.3], [108, -93, 10, 7, 0, "#000", 0.55]], 2.6) +
    W.haare(kopf, 95, kopfW, 1.9, SCHWARZ, { licht: (x, y) => licht(x, y) * 0.9, buendel: 3, gerade: true, szene: 0.07 }) +
    W.weich([`<path d="${G(kappe)}" fill="#5a3019" opacity=".38"/>`], 2.6) +
    W.haare(kappe, 60, (x, y) => (x < 104 ? 210 : 192), 1.7, KAPPE, { licht: (x, y) => clamp(0.25 + (-y - 121) / 10), buendel: 3, gerade: true, szene: 0.15 }) +
    gorillaGesicht(T, W, gesicht, HAUT) +
    (T.fein ? (() => {
      const grenze = [[115, -125.4], [116.8, -119], [116.6, -110], [117.2, -102], [118.4, -95], [120.6, -88.6], [123.4, -84.2]];
      const band = grenze.map(([x, y]) => [x - 3.4, y]).concat(W.zotteln(grenze.slice().reverse(), 1.5 / sz, 1.7, (x, y) => (y < -112 ? 15 : y < -96 ? 2 : -20)));
      return `<path d="${G(band)}" fill="${T.lg("hb", [[0, "#161514", 0], [0.6, "#161514", 0.85], [1, "#161514"]], 113, 0, 118, 0, UB)}"/>` + W.haare(band, 42, (x, y) => (y < -112 ? 15 : y < -96 ? 5 : -15), 1.4, SCHWARZ, { licht: () => 0.35, buendel: 2, szene: 0.05 });
    })() : "") +
    W.saum([[121, -125], [126.6, -120], [130, -116.4]], 16, 205, 1.2, SCHWARZ, { licht: () => 0.5, ein: 0.7, szene: 0.2 }),
  { rand: 0, vol: false });
  s += W.L([G(profil, false)], "#000", 0.3, 0.45);
  s += W.saum([[101, -92.6], [108, -87.4], [116, -84.8], [124, -84], [129, -84.8]], 36, 92, 1.8, SCHWARZ, { licht: () => 0.2, ein: 0.3, szene: 0.1 });
  s += W.teil(ohr, "#1c1a19", W.L(["M110.8 -106.4q1 2 0 4.6", "M109.6 -104.4q.6 1.2 -.2 2.4"], "#000", 0.35, 0.8) + W.L(["M111.3 -106.8q1 2 0 4.6"], "#8a847e", 0.2, 0.5), { rand: 0.4 });
  s += W.saum([[107.4, -108.6], [107.6, -103], [108.6, -99.6]], 10, 15, 1.6, SCHWARZ, { licht: () => 0.35 });
  s += W.saum([[91, -120], [97, -127.6], [106, -131.6], [114, -129.6]], 24, (x) => (x < 104 ? 212 : 196), 1.5, KAPPE, { licht: () => 0.55, szene: 0.15 });
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
  ], "#b3ada7", 0.15, 0.28);
  let s = W.relief("gesicht", haut, { f: 4, tiefe: 0.12, okt: 2 });
  /* Nase (flach, breit): wulstiger Nasenflügel als Bogen hinten-oben, davor/darunter das große, schräg nach vorn-unten
     offene Nasenloch (Tropfen); Nasenrücken kaum erhaben */
  s += `<path d="${G([[135, -99.6], [136.6, -100.6], [137.8, -99.6], [137.6, -98], [136.6, -97.4], [135.6, -98.2]])}" fill="#060505"/>`;
  s += W.L(["M136.6 -102.6q-3.2 -.2 -3.9 2.2q-.4 2 1.4 3.2q1.4 .8 3 .4"], "#201e1d", 1.1, 1) +
    W.L(["M136.2 -103q-2.6 0 -3.4 1.6"], "#8d877f", 0.22, 0.35) + W.L(["M132.6 -99.4q.2 2 2 2.9"], "#000", 0.3, 0.7);
  s += W.L(["M131.2 -103.8q2.2 -1.6 4.8 -.8"], "#000", 0.24, 0.6);
  /* Mund: lange Mundspalte, schmale Lippen, Glanz auf der Oberlippe */
  s += W.L(["M138.2 -93.8q-3 .5 -6 .3q-3 -.1 -5.6 1"], "#000", 0.5, 0.95) + W.L(["M137.6 -92.9q-3 .4 -6.4 .3"], "#8a847f", 0.2, 0.45) +
    W.L(["M137.6 -95.6q-2.6 .3 -5.2 0"], "#aaa49f", 0.22, 0.4);
  /* Auge: tief unter dem Wulst, dunkelbraun mit Lidern; Wulstschatten darüber */
  s += W.auge(125.2, -109.2, 1.45, { iris: "#3e210d", iris2: "#120804", offen: 0.8, winkel: 6, lid: "#050404", wimpern: 10, wimpernLaenge: 0.38, wimpernFarbe: "#080606" });
  s += `<path d="${G([[121.2, -111.9], [125.2, -113.3], [130, -111.6], [128.4, -110.4], [125.2, -111.6], [122.4, -110.9]])}" fill="#000" opacity=".4"/>`;
  s += W.L(["M121.8 -107q3 1.4 6.2 0"], "#8f8984", 0.15, 0.45);
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
  const licht = (x, y) => clamp(0.25 + (-y - 40) / 160 - (x - 100) / 160);
  const rotG = (n, a, b, c) => T.lg("rg" + n, [[0, a], [0.55, b], [1, c]]);
  let s = "";

  /* ---------- ferner Hinterfuß (Zehen ragen etwas vor, dunkler) ---------- */
  s += kFuss(W, T, 4, true);

  /* ---------- Schwanz (Basis am Steiß, liegt hinten auf dem Boden) ---------- */
  const sw = rohr([[90, -60, 7, 7.5], [80, -46, 6.8, 7], [70, -30, 6, 6.2], [60, -16, 5.2, 5.2], [48, -7.2, 4.4, 4.4], [34, -4, 3.6, 3.4], [18, -2.8, 2.8, 2.6], [5, -2.2, 2, 1.8], [0, -2.2, 1, 1]]);
  const swPts = sw.V.concat(W.zotteln(sw.H.slice().reverse().slice(0, 6), 2 / sz, 0.9, 160).slice(1), sw.H.slice().reverse().slice(6));
  s += W.teil(swPts, T.lg("sw", [[0, "#c27a48"], [0.5, "#ae6438"], [1, "#d9b28c"]], 0, 0, 0, 1),
    W.fell("sw", 200, [-2, -68, 98, 2], { hell: "#f2cfa0", dunkel: "#5a2a12", ho: 0.45, do: 0.4, fx: 3, fy: 0.4, hk: "k" }) +
    W.weich([[48, -2, 30, 2.4, 0, "#000", 0.35], [76, -46, 4, 12, -35, "#fff3e0", 0.25], [86, -54, 6, 8, -35, "#000", 0.35]], 2) +
    W.haare(swPts, 160, (x, y) => (x > 62 ? 115 : 182), 1.2, ROT, { licht: (x, y) => clamp(0.55 - (y + 4) / 40), gerade: true, szene: 0.08 }),
  { rand: 0.25 });
  s += W.saum(sw.V.slice(2), 36, (x, y) => (x > 60 ? 125 : 182), 0.9, ROT, { licht: () => 0.6, gerade: true, szene: 0.08 });

  /* ---------- ferner Arm (dahinter, etwas weiter vorn) ---------- */
  s += kArm(W, T, 6, true, ROT, HELL);

  /* ---------- Rumpf mit Hals ---------- */
  const rueckenK = [[87, -66], [88, -80], [91, -96], [97, -112], [104, -125], [112, -136], [118, -146]];
  const rumpf = W.zotteln(rueckenK, 2.6 / sz, 0.9, (x, y) => (y < -120 ? 110 : 130)).concat(
    [[124, -150], [131, -146], [132, -138], [131, -128], [133, -118], [133.6, -106], [131.4, -92], [129, -80], [127, -66], [118, -56], [100, -54], [90, -58]]);
  const brust = [[132, -140], [131, -128], [133, -118], [133.6, -106], [131.4, -92], [129, -80], [127, -66], [121, -66], [123, -82], [124, -100], [123, -116], [125, -132], [128, -142]];
  s += W.teil(rumpf, rotG("r", "#c06e3c", "#a8582e", "#7a3d1e"),
    W.fell("rf", 135, [85, -150, 135, -52], { hell: "#f0c493", dunkel: "#4a220e", ho: 0.5, do: 0.45, fx: 3, fy: 0.42, hk: "k" }) +
    W.weich([`<path d="${G(brust)}" fill="#ece0cc"/>`, [100, -100, 6, 26, 25, "#e8a46a", 0.35], [110, -128, 8, 6, 0, "#f2c08c", 0.35], [116, -96, 6, 20, 10, "#000", 0.2], [124, -60, 10, 6, 0, "#000", 0.35]], 2.6) +
    W.haare(rumpf, 260, (x, y) => (x > 121 ? 92 : y < -118 ? 118 : 108), 1.3, ROT, { licht: (x, y) => licht(x, y) + (x > 121 ? 0.4 : 0), gerade: true, buendel: 2, szene: 0.08 }) +
    W.haare(brust, 110, 92, 1.3, HELL, { licht: (x, y) => clamp(0.8 - (x - 124) / 20), gerade: true, buendel: 2, szene: 0.08 }),
  { rand: 0.25 });
  s += W.saum(rueckenK, 40, (x, y) => (y < -120 ? 112 : 130), 1, ROT, { licht: () => 0.75, gerade: true, szene: 0.08 });
  s += W.saum([[132, -138], [131, -128], [133, -118], [133.6, -106], [131.4, -92]], 30, 75, 1, HELL, { licht: () => 0.7, gerade: true, szene: 0.08 });

  /* ---------- nahes Hinterbein: mächtiger Oberschenkel, langer Unterschenkel, Fuß flach am Boden ---------- */
  s += kFuss(W, T, 0, false);
  const bein = [[88, -60], [86, -48], [88, -38], [92, -28], [94.4, -18], [96, -12], [104, -10.4], [110, -14], [114, -22], [119, -30], [124, -38], [128.4, -45],
    [129.4, -54], [128.4, -64], [125, -74], [118, -82], [108, -84], [97, -78], [90, -70]];
  s += W.teil(bein, rotG("b", "#c9814c", "#b2683a", "#8a4a26"),
    W.fell("bn", 120, [84, -86, 131, -8], { hell: "#f4cf9e", dunkel: "#4a220e", ho: 0.5, do: 0.4, fx: 3, fy: 0.42, hk: "k" }) +
    W.weich([
      [106, -70, 15, 10, -20, "#f6c48e", 0.5], [124, -54, 4, 10, 10, "#fff0dc", 0.35], [96, -48, 6, 14, -10, "#4a220e", 0.4],
      [118, -64, 6, 12, 20, "#4a220e", 0.18], [104, -24, 4, 12, -35, "#f0c08c", 0.35], [99, -24, 2.2, 12, -30, "#3a1a0a", 0.45],
      [112, -12, 6, 3, 0, "#3a1a0a", 0.4],
    ], 2.2) +
    /* Achillessehne zur Ferse */
    W.L([G([[92, -34], [94.4, -22], [96, -13]], false)], "#fff0dc", 0.9, 0.3) + W.L([G([[93.2, -34], [95.4, -22], [97, -13]], false)], "#3a1a0a", 0.7, 0.3) +
    W.haare(bein, 210, (x, y) => (y < -55 ? 100 + (x - 100) * 0.8 : 70), 1.3, ROT, { licht: (x, y) => clamp(licht(x, y) + 0.15), gerade: true, buendel: 2, szene: 0.08 }),
  { rand: 0.25 });
  s += W.saum([[88, -60], [86, -48], [88, -38], [92, -28], [94.4, -18]], 24, 110, 1, ROT, { licht: () => 0.45, gerade: true, szene: 0.08 });

  /* ---------- naher Arm ---------- */
  s += kArm(W, T, 0, false, ROT, HELL);

  /* ---------- Kopf ---------- */
  s += kKopf(W, T, ROT, HELL, sz);
  return W.fertig(s, 1, [112, -180, 156, -134], [5, 98, 120]);
}

/* Hinterfuß (Ruhestellung): lang, schmal, ganz am Boden; 4. Zehe mit großer Kralle vorn, 5. Zehe außen; Fell hell.
   dx = Versatz (ferner Fuß), fern = Schattenseite */
function kFuss(W, T, dx, fern) {
  const P = (x, y) => [x + dx, y];
  let s = "";
  const fuss = [P(96, -13), P(93.2, -9), P(93, -4), P(95.4, -0.6), P(100, 0, 1), P(122, 0, 1), P(127.6, -0.6), P(130.4, -2.6), P(129.6, -5.2), P(125, -6.4), P(117, -7.6), P(108, -9.6), P(102, -12.4)];
  s += W.teil(fuss, fern ? "#9a7452" : T.lg("kf", [[0, "#e3c49e"], [0.6, "#c9a07a"], [1, "#8f6b4c"]]),
    W.fell(fern ? "kff" : "kfu", 175, [91, -14, 132, 1], { hell: "#fbe6c8", dunkel: "#5a3a1e", ho: 0.45, do: 0.35, fx: 3.4, fy: 0.5, hk: "k" }) +
    W.weich([[112, -1.2, 18, 1.8, 0, "#2a1608", fern ? 0.5 : 0.45], [110, -8, 14, 2, -6, "#fff6e8", fern ? 0.1 : 0.4], [97, -6, 3, 4, 0, "#3a2414", 0.35]], 1.2) +
    (fern ? `<use href="#${T.id("p" + 0)}" fill="#000" opacity="0"/>` : "") +
    W.haare(fuss, fern ? 40 : 110, 178, 1, [["#7a5636", 0.1, 0.5], ["#a8805a", 0.1, 0.5], ["#d8b994", 0.09, 0.55], ["#f6e6cc", 0.09, 0.6]], { licht: (x, y) => clamp(0.8 + (y + 4) / 10) * (fern ? 0.5 : 1), gerade: true, szene: 0.06 }),
  { rand: 0.3, vol: false });
  /* 4. Zehe: Polster + große, gebogene, dunkle Kralle; 5. Zehe kürzer daneben (nah) */
  const kralle = (x, y, l, h, c) => `<path d="M${f1(x + dx)} ${f1(y)}q${f1(l * 0.55)} ${f1(-h * 0.5)} ${f1(l)} ${f1(h * 0.55)}q${f1(-l * 0.3)} ${f1(-h * 0.05)} ${f1(-l * 0.55)} ${f1(h * 0.42)}z" fill="${c}"/>`;
  s += kralle(127.6, -3.6, 6.8, 3.4, fern ? "#2a221c" : "#2e241c");
  if (!fern) s += `<path d="M${f1(129.4 + dx)} ${f1(-3.3)}q2.2 -.8 4 .9" fill="none" stroke="#b8aa98" stroke-opacity=".5" stroke-width=".2"/>`;
  if (!fern) s += kralle(122.6, -2, 4.4, 2.4, "#3a2e24") + W.L([`M${f1(118 + dx)} ${f1(-5.6)}q4 .6 6.6 2.4`], "#5a3a1e", 0.25, 0.6);
  return s;
}

/* Arm (Männchen: muskulös), vor der Brust, leicht gebeugt; Hand mit dunklen Fingern und Krallen. dx = Versatz */
function kArm(W, T, dx, fern, ROT, HELL) {
  const P = (x, y) => [x + dx, y];
  let s = "";
  const arm = [P(116, -128), P(123, -129), P(127.6, -124), P(130, -116), P(133.6, -108), P(138.6, -102.6), P(140.6, -99), P(138.4, -96.4), P(134, -97.4), P(128.6, -102), P(123.2, -107),
    P(119, -113), P(115.6, -120)];
  s += W.teil(arm, fern ? "#8a4a28" : T.lg("ka", [[0, "#cf8a54"], [0.55, "#b8703f"], [1, "#9a5a32"]]),
    W.fell(fern ? "kaf" : "kar", 120, [114, -130, 141, -95], { hell: "#f6d2a2", dunkel: "#4a220e", ho: 0.45, do: 0.4, fx: 3.2, fy: 0.45, hk: "k" }) +
    W.weich(fern ? [[126, -110, 10, 14, 0, "#2a1406", 0.45]] : [[124, -120, 4, 6, -30, "#f8d0a0", 0.45], [133, -106, 4, 3, -30, "#f8d0a0", 0.35], [126, -106, 3, 6, -40, "#3a1a0a", 0.35]], 1.6) +
    W.haare(arm, fern ? 40 : 90, (x, y) => (y < -110 ? 110 : 40), 1.2, ROT, { licht: (x, y) => clamp(licht2(x, y)) * (fern ? 0.6 : 1), gerade: true, szene: 0.08 }),
  { rand: 0.25, vol: !fern });
  /* Hand: dunkle Finger mit Krallen, hängen locker */
  const H = fern ? "#1e1612" : "#2b201a";
  for (const [x, y, ex, ey] of [[137.2, -97.6, 138.6, -91.4], [138.8, -97.6, 140.6, -91.8], [140.2, -98.6, 142.4, -93.2]]) {
    s += W.glied([P(x, y), P((x + ex) / 2 + 0.5, (y + ey) / 2), P(ex, ey)], 1.5, H, fern ? "" : "#7a6658", { la: 0.4 });
    s += `<path d="M${f1(ex + dx - 0.5)} ${f1(ey - 0.2)}q.9 .9 .5 2.4q-.6 -1 -1.2 -1.6z" fill="${fern ? "#140e0a" : "#1a120c"}"/>`;
  }
  return s;
}
function licht2(x, y) { return 0.3 + (-y - 95) / 40 - (x - 120) / 40; }

/* Kopf: schmal, hirschartig; große Augen mit Wimpern; lange spitze Ohren; schwarz-weiße Schnauzenzeichnung */
function kKopf(W, T, ROT, HELL, sz) {
  let s = "";
  /* fernes Ohr (dahinter, etwas weiter vorn) */
  const ohrF = [[126, -153], [124.6, -162], [124.4, -172], [126, -178.4], [129, -172.6], [131, -163], [131, -155]];
  s += W.teil(ohrF, "#8e5634", W.weich([[127.6, -165, 1.6, 8, 0, "#2a1406", 0.45]], 1) + W.haare(ohrF, 30, 270, 1, ROT, { licht: () => 0.3, gerade: true, szene: 0.05 }), { rand: 0.3 });
  const kopf = [[117, -146], [118.4, -152.4], [122.4, -156.6], [128, -158], [134, -157], [140, -154.6], [146, -151], [150.6, -148.2], [153.2, -146], [153.6, -143.8], [152.6, -142], [150.4, -141.2],
    [151, -140], [149.4, -138.8], [145, -139.2], [140, -138.4], [134, -138.4], [128, -139.6], [122, -141.6]];
  s += W.teil(kopf, T.lg("kk", [[0, "#b27448"], [0.5, "#a0623a"], [1, "#d8c0a0"]]),
    W.fell("kk", 160, [116, -159, 154, -137], { hell: "#f2cc9c", dunkel: "#4a220e", ho: 0.45, do: 0.35, fx: 4, fy: 0.6, hk: "k" }) +
    /* Gesichtszeichnung: graue Stirn/Nasenrücken, heller Nasenbereich, schwarzes Bartfeld, weißer Wangenstreifen */
    W.weich([
      `<path d="${G([[130, -156.6], [140, -154.2], [148, -150], [151, -147.6], [146, -147.4], [138, -150.6], [131, -153]])}" fill="#8f7a6a" opacity=".55"/>`,
      `<path d="${G([[147.6, -147.6], [151.6, -147.2], [153.4, -144.6], [152.6, -142.4], [149.4, -141.8], [147.6, -144]])}" fill="#ede2d2" opacity=".85"/>`,
      `<path d="${G([[141, -145.8], [147.8, -145.4], [150, -143], [148.4, -141.6], [143, -141.8], [139, -143]])}" fill="#141010"/>`,
      `<path d="${G([[132, -143.8], [138, -144.6], [143.4, -141.8], [146.4, -140.4], [140, -140.6], [133, -141.4], [128, -144]])}" fill="#f4efe6"/>`,
      `<path d="${G([[123, -142], [132, -140.6], [145, -139.4], [146, -138.8], [134, -138.4], [124, -139.6]])}" fill="#efe6d6"/>`,
      [128, -150, 8, 4, 0, "#f0c08a", 0.35], [137, -142, 10, 2, 0, "#000", 0.15],
    ], 0.6) +
    W.haare(kopf, 150, (x, y) => (x < 128 ? 140 : 180 + (y + 146) * 2), 0.9, ROT, { licht: (x, y) => clamp(0.6 - (y + 150) / 14), gerade: true, mix: 0.3, szene: 0.06 }),
  { rand: 0.25 });
  /* Nase: Nasenloch schwarz gerandet (Komma), feuchter Glanz; Mund */
  s += W.L(["M152.4 -146q1.2 .6 1 2q-.4 .9 -1.6 .6"], "#0e0a0a", 0.55, 1) + W.L(["M151.2 -147.2q1.4 -.2 2 .6"], "#fff", 0.2, 0.5);
  s += W.L(["M152.8 -141.6q-1.6 .6 -3 .5q-1.4 .3 -2.6 1.1"], "#1a1210", 0.32, 0.9);
  /* Schnurrhaare (dunkel, kurz) aus dem Bartfeld */
  if (T.fein) s += T.schnurrhaare(147, -143.4, 6, 6, 20, 50, "#1a1210", 0.1);
  /* Auge: groß, dunkelbraun, lange Wimpern, Augenhöhle mit Schatten oben */
  s += W.weich([[138.4, -152.4, 3.2, 1.6, -8, "#3a1a0a", 0.4]], 0.6);
  s += W.auge(138.2, -150.8, 1.25, { iris: "#3a2214", iris2: "#120a06", offen: 0.8, winkel: -6, lid: "#0e0806", wimpern: 12, wimpernLaenge: 0.7, wimpernFarbe: "#140c08", haut: "#6a4630" });
  /* nahes Ohr: lang, spitz, aufrecht, innen hell behaart */
  const ohr = [[121, -153], [119.4, -162], [119.4, -172], [121.4, -179.6], [124.6, -173], [126.4, -163], [126, -154]];
  const ohrIn = [[121.6, -158], [121, -166], [121.8, -174], [122.6, -176], [124, -170], [124.6, -162], [123.6, -157]];
  s += W.teil(ohr, T.lg("ko", [[0, "#7a5038"], [1, "#b5774a"]]),
    `<path d="${G(ohrIn)}" fill="#e8d9c4" opacity=".9"/>` + W.weich([[123.4, -167, 1, 7, 0, "#6a4a36", 0.5]], 0.6) +
    W.haare(ohrIn, 60, (x, y) => 250 + (x - 122.8) * 20, 1.6, HELL, { licht: () => 0.8, gerade: true, szene: 0.05 }) +
    W.haare(ohr, 30, 260, 0.8, ROT, { licht: () => 0.45, gerade: true, szene: 0.05 }),
  { rand: 0.3 });
  s += W.saum([[121.4, -171], [122.2, -177], [124, -174], [125.4, -167]], 22, 300, 1.2, HELL, { licht: () => 0.85, gerade: true, szene: 0.05 });
  return s;
}

module.exports = [
  { id: "gorilla", de: "der Gorilla", syl: "Go-RIL-la", it: "il gorilla", itSyl: "go-RIL-la", en: "gorilla",
    gruppe: "Exoten", lebensraum: "Regenwald", laenge: 1.42, hoehe: 1.35, zeichne: gorilla },
  { id: "kaenguru", de: "das Känguru", syl: "KÄN-gu-ru", it: "il canguro", itSyl: "can-GU-ro", en: "kangaroo",
    gruppe: "Exoten", lebensraum: "Outback", laenge: 1.56, hoehe: 1.81, zeichne: kaenguru },
];
