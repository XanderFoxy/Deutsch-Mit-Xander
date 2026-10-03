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

/* glatte Kurve (Catmull-Rom) auf 1 mm; [x, y, 1] = harte Ecke */
function G(pts, zu = true) {
  const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
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
      (o.vol !== false ? u(`fill="${o.volG || T.lg("vol", [[0, "#fff", 0.14], [0.4, "#fff", 0], [0.72, "#000", 0.12], [1, "#000", 0.4]])}"`) : "") + (o.oben || "");
    if (inn) s += `<g clip-path="url(#${id}c)">${inn}</g>`;
    if (o.rand !== 0) s += u(`fill="none" stroke="${o.rc || "#0a0806"}" stroke-opacity="${o.rand != null ? o.rand : 0.3}" stroke-width="${o.rw || 0.4}" stroke-linejoin="round"`);
    return s;
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
  W.weich = (liste, sd) => `<g filter="${W.blur(sd)}">` + liste.map((e) => typeof e === "string" ? e :
    `<ellipse cx="${f1(e[0])}" cy="${f1(e[1])}" rx="${f1(e[2])}" ry="${f1(e[3])}"${e[4] ? ` transform="rotate(${e[4]} ${f1(e[0])} ${f1(e[1])})"` : ""} fill="${e[5]}"${e[6] < 1 ? ` fill-opacity="${e[6]}"` : ""}/>`).join("") + `</g>`;
  /* Fell-Textur (gestreckte Rauschstruktur), nur volle Feinheit */
  W.textur = (n, d, winkel, op, box, farbe = "#000", fx = 0.9, fy = 0.1) => T.fein ?
    T.textur(d, T.rauschen(n, { fx, fy, farbe, staerke: 2.6, schwelle: 0.5, okt: 3 }), winkel, op, box) : "";
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
  const SCHWARZ = [["#030303", 0.3, 0.6], ["#151413", 0.3, 0.55], ["#2c2a28", 0.28, 0.5], ["#4f4b47", 0.26, 0.45], ["#7f7a74", 0.24, 0.42], ["#aaa59f", 0.2, 0.4]];
  const SILBER = [["#3e3b38", 0.26, 0.5], ["#6c6863", 0.26, 0.5], ["#99948d", 0.24, 0.5], ["#c4bfb7", 0.22, 0.5], ["#e6e2da", 0.2, 0.55], ["#faf8f3", 0.18, 0.6]];
  const KAPPE = [["#1a0e08", 0.26, 0.55], ["#43261a", 0.26, 0.55], ["#6e4128", 0.24, 0.5], ["#94603c", 0.22, 0.5], ["#b98a60", 0.2, 0.45]];
  const HAUT = "#1b1918";
  const licht = (x, y) => clamp(0.12 + (-y - 50) / 110 - (x - 40) / 700);
  let s = "";

  /* ---------- fernes Hinterbein (hinten, dunkler) ---------- */
  const fussF = [[-4, -12], [-6, -5], [-4, -0.5], [2, 0], [24, 0], [28, -2], [27, -5], [22, -7], [14, -10], [6, -14]];
  s += W.teil(fussF, HAUT, W.L([[[18, -2], [22, -5]], [[22, -1.5], [25.5, -4.5]]], "#000", 0.5, 0.5), { rand: 0.4 });
  const beinF = [[12, -86], [4, -70], [0, -52], [-2, -36], [-3, -22], [-4, -12], [2, -8], [10, -9], [16, -14], [16, -24], [20, -40], [26, -58], [30, -74]];
  s += W.teil(beinF, "#0c0b0b", (d) =>
    W.haare(beinF, 120, (x, y) => 100 + (y < -50 ? 10 : 0), 3.2, SCHWARZ, { licht: (x, y) => licht(x, y) * 0.6, szene: 0.15 }) +
    W.weich([[6, -30, 10, 20, 0, "#000", 0.5]], 4), { rand: 0.25 });
  s += W.saum([[-3, -22], [-4, -12], [2, -8]], 18, 100, 2.6, SCHWARZ, { licht: () => 0.2 });

  /* ---------- fernes Vorderbein (vorn) ---------- */
  const handF = [[150, -24], [166, -24], [169, -16], [173, -9], [176, -4], [175, -0.5], [160, 0], [153, -1], [150, -6], [149, -14]];
  s += W.teil(handF, "#151312", "", { rand: 0.4 });
  s += finger(W, T, 160, -14, [[168, -6], [174, -3], [172, -1], [166, -1]], HAUT, 0.55, true);
  const armF = [[132, -108], [148, -104], [156, -92], [158, -76], [162, -58], [166, -40], [168, -28], [167, -21], [150, -20], [147, -32], [143, -48], [138, -66], [132, -86]];
  s += W.teil(armF, "#0d0c0c", (d) =>
    W.haare(armF, 170, (x, y) => 98 + (y < -60 ? 8 : 0), 4.2, SCHWARZ, { licht: (x, y) => licht(x, y) * 0.75, buendel: 2, szene: 0.15 }) +
    W.weich([[150, -60, 6, 30, -8, "#000", 0.45]], 4), { rand: 0.25 });
  s += W.saum([[147, -60], [148, -40], [150, -24]], 30, 105, 4, SCHWARZ, { licht: () => 0.3, szene: 0.2 });

  /* ---------- Rumpf ---------- */
  const rumpf = [[4, -98], [18, -107], [38, -115], [60, -124], [82, -134], [100, -141], [116, -142], [128, -138], [138, -128], [146, -114],
    [150, -100], [150, -90], [144, -80], [132, -68], [114, -60], [94, -55], [74, -54], [56, -57], [40, -62], [24, -64], [10, -68], [2, -78], [0, -88]];
  const sattel = [[3, -97], [18, -106], [38, -114], [60, -123], [78, -131], [90, -134], [88, -122], [82, -104], [72, -88], [58, -76], [40, -70], [22, -70], [8, -76], [1, -86]];
  const rumpfFell = T.lg("rf", [[0, "#2e2c2a"], [0.45, "#1b1a19"], [1, "#0a0909"]], 0, -142, 0, -54, UB);
  const rumpfW = (x, y) => {
    if (x > 92) return 150 - clamp((x - 92) / 50) * 50;          // Schulter: nach hinten-unten → Arm abwärts
    return 178 - clamp((y + 125) / 60) * 42;                      // Rücken nach hinten, Flanke nach hinten-unten
  };
  s += W.teil(rumpf, rumpfFell, (d) =>
    W.weich([
      [G(sattel)].map((p) => `<path d="${p}" fill="${T.lg("sat", [[0, "#d9d5ce"], [0.5, "#b3aea6"], [1, "#77736d"]], 0, -132, 0, -72, UB)}"/>`)[0],
    ], 2.5) +
    W.textur("rumpf", d, 170, 0.22, [0, -142, 150, -54]) +
    W.weich([
      [44, -108, 30, 8, -14, "#ffffff", 0.35], [110, -134, 22, 7, 0, "#a9adb3", 0.35], [96, -100, 14, 18, 0, "#000", 0.35],
      [90, -62, 46, 10, 0, "#000", 0.55], [130, -76, 14, 12, 0, "#000", 0.5], [20, -74, 16, 10, 0, "#000", 0.35],
    ], 5) +
    W.haare(rumpf, 330, rumpfW, 3.4, SCHWARZ, { licht: (x, y) => licht(x, y) * 0.85, buendel: 2, szene: 0.15 }) +
    W.haare(sattel, 360, rumpfW, 2.4, SILBER, { licht: (x, y) => clamp(0.35 + (-y - 80) / 45), buendel: 2, mix: 0.5, szene: 0.15 }),
  { rand: 0.2 });
  /* Rückenkontur: kurze Haare stehen über den Umriss */
  s += W.saum([[2, -94], [18, -107], [38, -115], [60, -124], [82, -134]], 70, (x) => 196 - x * 0.15, 1.8, SILBER, { licht: () => 0.7, szene: 0.2 });
  s += W.saum([[82, -134], [100, -141], [116, -142], [128, -138]], 40, 200, 2.2, SCHWARZ, { licht: () => 0.55, szene: 0.2 });
  s += W.saum([[132, -68], [114, -60], [94, -55], [74, -54], [56, -57], [42, -62]], 70, 96, 3.6, SCHWARZ, { licht: () => 0.15, szene: 0.2 });

  /* ---------- nahes Hinterbein ---------- */
  const fussN = [[24, -15], [21, -7], [23, -1], [30, 0], [56, 0], [63, 0], [67, -2], [67, -5.5], [63, -8.5], [56, -10.5], [48, -12.5], [42, -16], [34, -18]];
  s += W.teil(fussN, HAUT, W.relief("fuss", W.weich([[40, -12, 14, 4, -8, "#6a6560", 0.5], [44, -1, 20, 2, 0, "#000", 0.6]], 1.5), { f: 1.4, tiefe: 0.7, okt: 3 }), { rand: 0.4 });
  for (const [x, y, l, h] of [[63, -6, 5, 3.6], [59, -6.6, 5, 3.4], [55, -7.4, 4.6, 3.2]]) {
    s += W.glied([[x - l, y], [x, y + 0.6], [x + 1.5, y + 2.4]], h, HAUT, "#77716b");
    s += `<ellipse cx="${f1(x + 0.5)}" cy="${f1(y - 0.9)}" rx="1.4" ry=".7" transform="rotate(25 ${f1(x + 0.5)} ${f1(y - 0.9)})" fill="#5f5953"/>`;
  }
  s += W.L([[[46, -12], [52, -9.5]], [[38, -10], [44, -7]], [[30, -6], [36, -4]]], "#000", 0.35, 0.6) + W.L([[[47, -12.6], [52.6, -10.2]]], "#8a847e", 0.25, 0.4);
  const beinN = [[2, -92], [3, -76], [8, -62], [15, -48], [20, -34], [22, -22], [24, -13], [32, -9], [44, -11], [49, -16], [48, -24], [50, -34], [55, -44], [57, -54], [53, -64], [45, -72], [36, -82], [26, -92], [14, -97]];
  const beinW = (x, y) => (y < -55 ? 120 : 100);
  s += W.teil(beinN, T.lg("bn", [[0, "#2a2826"], [0.5, "#171615"], [1, "#0b0a0a"]], 0, -97, 0, -9, UB), (d) =>
    W.weich([[G([[3, -92], [20, -98], [36, -86], [40, -74], [26, -66], [10, -70]])].map((p) => `<path d="${p}" fill="#a39e97"/>`)[0]], 3) +
    W.textur("bein", d, 100, 0.2, [0, -97, 58, -9]) +
    W.weich([[30, -80, 14, 10, 30, "#fff", 0.25], [44, -46, 7, 14, -20, "#8d9096", 0.3], [12, -40, 6, 18, -20, "#000", 0.45], [34, -14, 14, 4, 0, "#000", 0.5]], 3.5) +
    W.haare(beinN, 260, beinW, 3.2, SCHWARZ, { licht: (x, y) => licht(x, y) * 0.9, buendel: 2, szene: 0.15 }) +
    W.haare([[3, -92], [20, -98], [36, -86], [38, -74], [26, -68], [10, -72]], 90, 125, 2.4, SILBER, { licht: (x, y) => clamp(0.3 + (-y - 70) / 30), buendel: 2, szene: 0.15 }),
  { rand: 0.2 });
  s += W.saum([[3, -76], [8, -62], [15, -48], [20, -34], [22, -22], [24, -13], [32, -9], [44, -11]], 60, (x, y) => (y > -16 ? 80 : 108), 3.2, SCHWARZ, { licht: () => 0.2, szene: 0.2 });

  /* ---------- nahes Vorderbein (Arm) mit Knöchelhand ---------- */
  const handN = [[119, -27], [136, -27], [139, -19], [143, -12], [147, -7], [149, -3], [148, -0.5], [132, 0], [124, -1], [120, -6], [118, -15]];
  s += W.teil(handN, HAUT, W.relief("hand", W.weich([[132, -18, 6, 9, -20, "#7a756f", 0.55], [128, -3, 14, 3, 0, "#000", 0.6]], 1.6), { f: 1.2, tiefe: 0.8, okt: 3 }), { rand: 0.4 });
  s += finger(W, T, 131, -12, [[139, -6], [146, -3], [144, -1], [137, -1]], HAUT, 1, false);
  const armN = [[104, -128], [120, -134], [134, -130], [142, -120], [145, -106], [144, -92], [140, -78], [139, -66], [141, -54], [140, -40], [137, -30], [136, -23],
    [120, -21], [117, -30], [114, -44], [111, -58], [108, -70], [104, -86], [101, -102], [100, -116]];
  const armW = (x, y) => (y < -75 ? 112 + (x < 115 ? 20 : 0) : 97);
  s += W.teil(armN, T.lg("an", [[0, "#2f2d2b"], [0.5, "#1a1918"], [1, "#0d0c0c"]], 0, -134, 0, -21, UB), (d) =>
    W.textur("arm", d, 95, 0.2, [100, -134, 146, -21]) +
    W.weich([
      [124, -118, 15, 10, -10, "#b9bcc2", 0.4], [136, -96, 6, 14, 0, "#9ea2a8", 0.3], [130, -60, 6, 14, -5, "#9ea2a8", 0.3],
      [108, -92, 6, 26, 0, "#000", 0.6], [116, -40, 5, 18, 0, "#000", 0.5], [126, -72, 12, 4, 0, "#000", 0.35],
    ], 3.5) +
    W.haare(armN, 360, armW, 4.4, SCHWARZ, { licht: (x, y) => licht(x, y) * 0.95 + (x > 125 ? 0.1 : -0.1), buendel: 3, krumm: 0.25, szene: 0.15 }),
  { rand: 0.2 });
  s += W.saum([[100, -116], [101, -102], [104, -86], [108, -70], [111, -58], [114, -44], [117, -30], [120, -21]], 90, (x, y) => 104 + (y < -60 ? 12 : 0), 5.5, SCHWARZ, { licht: () => 0.25, szene: 0.2 });
  s += W.saum([[136, -23], [128, -22], [120, -21]], 26, 92, 2.6, SCHWARZ, { licht: () => 0.35 });

  /* ---------- Kopf ---------- */
  s += gorillaKopf(T, W, SCHWARZ, KAPPE, HAUT, licht);
  return W.fertig(s, 1);
}

/* Knöchelhand: Finger 2–5 eingerollt, Mittelglieder auf dem Boden, Nägel hinten. (mx, my) = Fingergrundgelenk (Mitte),
   kn = Lage des vordersten Knöchels (Finger 3), fern = dunkler */
function finger(W, T, mx, my, kn, haut, op, fern) {
  const [[ax, ay]] = kn;
  let s = "";
  /* von hinten (Zeigefinger, fern) nach vorn (kleiner Finger, nah): Knöchel staffeln */
  const F = [[0.6, 4.2, -1.2, "#2a2725"], [1.4, 4.6, -0.4, "#242120"], [0, 4.4, 0, "#1f1d1c"], [-3.2, 4, 0.6, haut]];
  for (const [dx, b, dy, c] of F) {
    const px = ax + 6 + dx, py = -b / 2;
    const tipX = px - 9.5, nagelX = tipX - 0.4;
    s += W.glied([[mx + dx * 0.4, my + dy], [px - 2.4, py - 2.6], [px, py], [px - 3, -b / 2 + 0.1], [tipX, -b / 2], [tipX - 1.4, -b / 2 - 1.6]], b, c, fern ? "" : "#8a847e", { la: 0.35 });
    /* Gelenkfalten am Knöchel */
    if (!fern && T.fein) s += W.L([`M${f1(px - 1.6)} ${f1(py - 1.9)}q1.2 .6 1.8 1.9`, `M${f1(px - 2.4)} ${f1(py - 1.3)}q1 .5 1.3 1.6`], "#000", 0.22, 0.7) +
      W.L([`M${f1(px - 1.4)} ${f1(py - 2.3)}q1.2 .6 1.9 2`], "#9a948e", 0.15, 0.5);
    /* Nagel: hinten am eingerollten Endglied */
    s += `<ellipse cx="${f1(nagelX - 0.6)}" cy="${f1(-b / 2 - 1.2)}" rx=".9" ry="1.3" transform="rotate(-35 ${f1(nagelX - 0.6)} ${f1(-b / 2 - 1.2)})" fill="${fern ? "#3a3532" : "#5d5650"}"/>`;
    if (!fern) s += `<path d="M${f1(nagelX - 1.1)} ${f1(-b / 2 - 2)}q.4 -.3 .9 0" stroke="#d8d2ca" stroke-opacity=".5" stroke-width=".2" fill="none"/>`;
  }
  return fern ? `<g opacity="${op}">${s}</g>` : s;
}

/* Gorillakopf im Profil (absolut in cm) */
function gorillaKopf(T, W, SCHWARZ, KAPPE, HAUT, licht) {
  let s = "";
  const kopf = [[122, -128], [130, -135], [139, -138.5], [148, -136], [156, -130], [162, -125], [167, -121], [170.5, -117], [170, -114], [167.5, -112.4],
    [168.5, -110], [171.5, -107.5], [175, -105], [177.6, -102.2], [177.4, -99.4], [176.4, -97.6], [177.2, -95.6], [176.2, -93.2], [174, -91.6], [172, -88.6],
    [168, -86], [160, -85], [150, -86.5], [142, -90], [134, -98], [128, -110], [122, -120]];
  const gesicht = [[155, -127.5], [162, -125], [167, -121], [170.5, -117], [170, -114], [167.5, -112.4], [168.5, -110], [171.5, -107.5], [175, -105], [177.6, -102.2],
    [177.4, -99.4], [176.4, -97.6], [177.2, -95.6], [176.2, -93.2], [174, -91.6], [172, -88.6], [168, -86], [162, -86.2], [158.5, -90], [156, -96], [154, -103], [152.5, -111], [152.5, -120]];
  const kappe = [[121, -127], [130, -135], [139, -138.5], [148, -136], [156, -130], [158, -126], [150, -124], [140, -124], [130, -122], [124, -120]];
  /* Ohr (klein, dicht am Kopf, halb im Haar) */
  const ohr = [[145.5, -112], [148.5, -113.2], [150.4, -110.4], [150, -106], [148, -103.6], [146, -104.6], [145, -108]];
  const kopfW = (x, y) => (y < -122 ? 200 : x < 150 ? 120 + (y + 120) * 0.6 : 110);
  s += W.teil(kopf, T.lg("kf", [[0, "#2a2826"], [0.55, "#161514"], [1, "#0b0a0a"]], 0, -138, 0, -86, UB), (d) =>
    W.textur("kopf", d, 110, 0.2, [120, -140, 178, -84]) +
    W.weich([[140, -126, 14, 5, -10, "#c6c9ce", 0.3], [146, -96, 10, 8, 0, "#000", 0.5]], 3) +
    W.haare(kopf, 170, kopfW, 2.6, SCHWARZ, { licht: (x, y) => licht(x, y) * 0.9, buendel: 2, szene: 0.15 }) +
    W.haare(kappe, 120, (x, y) => (x < 140 ? 215 : 185), 2.4, KAPPE, { licht: (x, y) => clamp(0.3 + (-y - 124) / 14), buendel: 2, szene: 0.2 }) +
    /* nackte Gesichtshaut */
    W.relief("gesicht",
      `<path d="${G(gesicht)}" fill="${T.lg("gh", [[0, "#2c2a29"], [0.5, HAUT], [1, "#0e0d0c"]], 0, -128, 0, -86, UB)}"/>` +
      W.weich([
        [163, -121.5, 7, 2.2, 22, "#8f8a85", 0.75], [171, -106.5, 2.6, 1.3, 30, "#8a8580", 0.6], [174.5, -99.4, 2, 1.6, 0, "#6f6a66", 0.6],
        [168, -96, 6, 2.6, -8, "#5f5a56", 0.55], [170, -89, 4, 1.6, -10, "#6a6560", 0.5], [162, -111.5, 4, 2, 10, "#000", 0.85],
        [160, -100, 4, 7, 0, "#000", 0.35],
      ], 1) +
      /* Hautfalten: Nasenrücken quer, unter dem Auge, Schnauzenfalte vom Nasenflügel um das Maul, Kinn */
      (T.fein ? W.L([
        "M167.6 -110.8q1.2 .5 1.6 1.6", "M168.6 -109.2q1.2 .5 1.6 1.6", "M169.6 -107.8q1 .5 1.4 1.4",
        "M159.5 -109.6q2.8 1.6 6.4 .4", "M158.8 -107.8q3.4 1.8 7.4 .2", "M158.6 -105.6q3.8 1.6 8 -.4",
        "M169.4 -102.4q-2.6 3.4 -1.4 8", "M166.6 -103.6q-3 4.4 -.8 10", "M171 -90.4q-2.4 -.6 -4 .2", "M157 -114.6q2 -1.6 5 -2.2",
      ], "#000", 0.28, 0.75) + W.L([
        "M167.8 -111.4q1.2 .5 1.6 1.6", "M168.8 -109.8q1.2 .5 1.6 1.6", "M159.6 -110.3q2.8 1.6 6.4 .4", "M158.9 -108.5q3.4 1.8 7.4 .2",
        "M169.9 -102.6q-2.6 3.4 -1.4 8", "M157.1 -115.3q2 -1.6 5 -2.2",
      ], "#9a948e", 0.18, 0.45) : ""), { f: 1.6, tiefe: 0.9, okt: 3 }),
  { rand: 0.3, volG: T.lg("kvol", [[0, "#fff", 0.08], [0.45, "#fff", 0], [1, "#000", 0.3]]) });
  /* Ohr */
  s += W.teil(ohr, "#1d1b1a", W.L(["M148.6 -110.6q1 2 0 4.6", "M147.4 -108.6q.6 1.2 -.2 2.4"], "#000", 0.35, 0.8) +
    W.L(["M149.1 -111q1 2 0 4.6"], "#8a847e", 0.2, 0.5), { rand: 0.4 });
  s += W.saum([[145, -113], [146, -103]], 14, 20, 1.6, SCHWARZ, { licht: () => 0.4 });
  /* Nase: Nasenflügel (Wulst) und großes Nasenloch vorn-unten */
  s += `<path d="${G([[170, -104.2], [172.6, -106], [175.6, -104.4], [177.6, -101.6], [177, -99.2], [174.6, -98.6], [171.6, -99.6], [169.8, -101.6]])}" fill="#232120"/>`;
  s += `<path d="${G([[173.4, -101.8], [175.6, -102.6], [177.2, -100.8], [176.4, -99.3], [174.2, -99.4]])}" fill="#050404"/>`;
  s += W.L(["M170.4 -103.6q2.4 -2.4 5.4 -1.2", "M171.2 -100.6q1.4 1.2 3.4 1"], "#000", 0.3, 0.8) + W.L(["M171 -104.4q2.4 -2 5 -.9"], "#b2aca6", 0.3, 0.55);
  s += `<ellipse cx="173.6" cy="-104.2" rx="1" ry=".45" transform="rotate(-20 173.6 -104.2)" fill="#fff" opacity=".45"/>`;
  /* Lippen und Mundspalte */
  s += W.L(["M177 -95.6q-3 .4 -6 .2q-3 -.2 -5.4 .8"], "#000", 0.5, 0.95) + W.L(["M176.2 -94.6q-3 .4 -6.4 .3"], "#7d7772", 0.25, 0.45) +
    W.L(["M176.6 -97q-2.6 .2 -5.2 0"], "#9a948e", 0.25, 0.35);
  /* Auge: tief unter dem Wulst, dunkelbraun, dunkle Lederhaut */
  s += T.augeReal(163.2, -112.2, 0.92, { iris: "#5a3216", iris2: "#1e0e05", offen: 0.66, winkel: 6, lid: "#050404", wimpern: 9, wimpernLaenge: 0.4, wimpernFarbe: "#0a0807" });
  s += `<path d="${G([[159.5, -114.4], [163, -115.4], [167.4, -113.6], [166, -112.6], [163, -113.8], [160.4, -113.2]])}" fill="#000" opacity=".55"/>`;
  /* Haar über dem Überaugenwulst und am Hinterkopf als Saum */
  s += W.saum([[122, -128], [130, -135], [139, -138.5], [148, -136], [155, -131]], 50, (x) => (x < 140 ? 225 : 200), 2, KAPPE, { licht: () => 0.6, szene: 0.25 });
  s += W.saum([[142, -90], [150, -86.5], [158, -85.6]], 22, 100, 2.4, SCHWARZ, { licht: () => 0.2 });
  return s;
}

module.exports = [
  { id: "gorilla", de: "der Gorilla", syl: "Go-RIL-la", it: "il gorilla", itSyl: "go-RIL-la", en: "gorilla",
    gruppe: "Exoten", lebensraum: "Regenwald", laenge: 1.8, hoehe: 1.43, zeichne: gorilla },
];
