/* =====================================================================
   TIER-BIBLIOTHEK — RAUBSAURIER & FLUGSAURIER (FASSUNG 854)
   Tyrannosaurus, Velociraptor, Spinosaurus, Allosaurus, Pteranodon.
   XANDER: „perfekte Dinosaurier unmissverständlich auf höchstem Niveau wie in Jurassic Park".
   Jede Art wird in einem eigenen „Zeichenraum" (Einheiten, ~200 breit) entworfen und
   mit scale(f) in Zentimeter gebracht – kurze Zahlen, kleine SVGs. Boden y = 0.
   ===================================================================== */
"use strict";
const R = (n) => Math.round(n * 10) / 10;

/* ---------- Hilfen ---------- */
/* mehrere offene Linien in EINEM Pfad */
const mehr = (T, arr) => arr.map((p) => T.glatt(p, false)).join("");
const linien = (T, arr, farbe, w, op) => `<path d="${mehr(T, arr)}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round" stroke-linejoin="round"/>`;
/* weiches Licht / weicher Schatten (Muskelvolumen) */
const LICHT = (T) => T.rg("licht", [[0, "#fff", 0.55], [1, "#fff", 0]]);
const DUNKEL = (T) => T.rg("dunkel", [[0, "#000", 0.6], [1, "#000", 0]]);
const fleck = (T, art, cx, cy, rx, ry, rot, op) =>
  `<ellipse cx="${R(cx)}" cy="${R(cy)}" rx="${R(rx)}" ry="${R(ry)}"${rot ? ` transform="rotate(${rot} ${R(cx)} ${R(cy)})"` : ""} fill="${art === "l" ? LICHT(T) : DUNKEL(T)}" opacity="${op}"/>`;
/* Schuppen-Muster (Kieselschuppen), userSpace im Zeichenraum */
const schuppen = (T, n, w, h, farbe = "#000", op = 0.3, rot = -6) => {
  const id = T.id("m" + n);
  const a = w / 2, b = h / 2, rr = w * 0.24;
  T.def(`<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse" patternTransform="rotate(${rot})">` +
    `<path d="M${R(a / 2 - rr)} ${R(b / 2)}a${R(rr)} ${R(rr * 0.85)} 0 1 0 ${R(rr * 2)} 0a${R(rr)} ${R(rr * 0.85)} 0 1 0 ${R(-rr * 2)} 0M${R(a * 1.5 - rr)} ${R(b * 1.5)}a${R(rr)} ${R(rr * 0.85)} 0 1 0 ${R(rr * 2)} 0a${R(rr)} ${R(rr * 0.85)} 0 1 0 ${R(-rr * 2)} 0" fill="#fff" fill-opacity=".05" stroke="${farbe}" stroke-opacity="${op}" stroke-width="${R(w * 0.07) || 0.1}"/></pattern>`);
  return `url(#${id})`;
};
/* Körperteil: Pfad EINMAL in defs, Füllung/Muster/Innenzeichnung/Volumen/Rand per <use> (klein!).
   o: { muster, innen, vol:false, rw, randA, rand } */
const teil = (T, pts, fill, o = {}) => {
  const d = typeof pts === "string" ? pts : T.glatt(pts);
  const id = T.id("q" + (T._n = (T._n || 0) + 1));
  T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  const b = o.box || T.box(pts), rect = (f) => `<rect x="${R(b[0] - 2)}" y="${R(b[1] - 2)}" width="${R(b[2] - b[0] + 4)}" height="${R(b[3] - b[1] + 4)}" fill="${f}"/>`;
  const innen = (o.muster ? rect(o.muster) : "") + (o.innen || "") + (o.vol !== false ? rect(T.VOL()) : "");
  return `<use href="#${id}" fill="${fill}"/>` + (innen ? `<g clip-path="url(#${id}c)">${innen}</g>` : "") +
    (o.rand !== false ? `<use href="#${id}" fill="none" stroke="${o.rand || "#000"}" stroke-opacity="${o.randA != null ? o.randA : 0.4}" stroke-width="${o.rw || 0.3}" stroke-linejoin="round"/>` : "");
};
/* Polylinie mit Bogenlänge: at(t) → [x, y, nx, ny] (t 0…1, Normale zeigt links der Laufrichtung) */
const polyl = (pts) => {
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const len = L[L.length - 1];
  return { len, at: (t) => {
    const d = Math.max(0, Math.min(1, t)) * len; let i = 1;
    while (i < L.length - 1 && L[i] < d) i++;
    const a = pts[i - 1], b = pts[i], u = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1), dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
    return [a[0] + dx * u, a[1] + dy * u, dy / n, -dx / n];
  } };
};
/* Schuppenfeld (nur fein): Kieselschuppen in der Fläche pts – je Schuppe Schattenbogen unten, Lichtbogen oben (Licht links oben) */
const schuppenFeld = (T, pts, g, o = {}) => {
  if (!T.fein) return "";
  const [x0, y0, x1, y1] = T.box(pts);
  let dS = "", dL = "", z = 0;
  for (let y = y0 + g * 0.4; y < y1; y += g * (o.dy || 0.78), z++) for (let x = x0 + (z % 2) * g / 2; x < x1; x += g) {
    const jx = x + (T.rnd() - 0.5) * g * 0.35, jy = y + (T.rnd() - 0.5) * g * 0.3;
    if (!T.inPoly(jx, jy, pts) || (o.dichte && T.rnd() > o.dichte)) continue;
    const r = g * 0.43 * (0.8 + T.rnd() * 0.4), h = r * (o.flach || 0.9);
    dS += `M${R(jx - r)} ${R(jy)}q${R(r)} ${R(h * 1.25)} ${R(2 * r)} 0`;
    dL += `M${R(jx - r * 0.85)} ${R(jy - h * 0.15)}q${R(r * 0.8)} ${R(-h * 1.1)} ${R(r * 1.6)} 0`;
  }
  const w = R(g * (o.w || 0.12)) || 0.1;
  return `<path d="${dS}" fill="none" stroke="${o.dunkel || "#140f08"}" stroke-width="${w}" stroke-opacity="${o.opS || 0.45}"/>` +
    `<path d="${dL}" fill="none" stroke="${o.hell || "#f2e6c8"}" stroke-width="${w}" stroke-opacity="${o.opL || 0.22}"/>`;
};
/* Reihe entlang einer Linie: n Trennstriche quer (Lippenschuppen, Fußschilde) */
const reihe = (T, pts, n, tiefe, farbe, w, op, versatz = 0) => {
  const P = polyl(pts); let d = "";
  for (let i = 0; i <= n; i++) { const [x, y, nx, ny] = P.at(i / n); d += `M${R(x + nx * versatz)} ${R(y + ny * versatz)}l${R(nx * tiefe)} ${R(ny * tiefe)}`; }
  return `<path d="${d}" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round"/>`;
};
/* Kralle: Basis (x, y), Länge L, Breite b, Richtung w (Grad, 0 = rechts, 90 = unten), krumm: Krümmung nach rechts der Richtung */
const krallenPfad = (x, y, L, b, w, krumm = 0.5) => {
  const a = w * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
  const P = (u, v) => `${R(x + u * c - v * sn)} ${R(y + u * sn + v * c)}`;
  return `M${P(0, -b / 2)}Q${P(L * 0.62, -b * 0.55)} ${P(L, b * krumm * 2)}Q${P(L * 0.5, b * 0.1)} ${P(0, b / 2)}Z`;
};
const krallen = (T, liste, farbe = "#2a2117") => {
  const g = T.lg("kralle", [[0, "#000", 0], [0.5, "#000", 0.1], [1, "#fff", 0.25]]);
  const d = liste.map((k) => krallenPfad(...k)).join("");
  let gl = "";
  if (T.fein) for (const [x, y, L, b, w] of liste) { const a = w * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a), P = (u, v) => `${R(x + u * c - v * sn)} ${R(y + u * sn + v * c)}`; gl += `M${P(L * 0.12, -b * 0.25)}Q${P(L * 0.5, -b * 0.35)} ${P(L * 0.8, b * 0.2)}`; }
  return `<path d="${d}" fill="${farbe}"/><path d="${d}" fill="${g}"/>` + (gl ? `<path d="${gl}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="${R(liste[0][3] * 0.12) || 0.1}" stroke-linecap="round"/>` : "");
};
/* Zahnreihe: Liste [x, y, L, b] – Basis an (x, y), Spitze nach unten (dir 1) oder oben (dir -1), leicht nach hinten (links) gebogen */
const zaehne = (T, liste, dir = 1) => {
  let d = "", gl = "";
  for (const [x, y, L, b] of liste) {
    const t = y + dir * L;
    d += `M${R(x - b / 2)} ${R(y)}Q${R(x - b * 0.45)} ${R(y + dir * L * 0.6)} ${R(x - b * 0.25)} ${R(t)}Q${R(x + b * 0.5)} ${R(y + dir * L * 0.45)} ${R(x + b / 2)} ${R(y)}Z`;
    if (T.fein) gl += `M${R(x - b * 0.12)} ${R(y + dir * L * 0.15)}Q${R(x - b * 0.15)} ${R(y + dir * L * 0.55)} ${R(x - b * 0.24)} ${R(y + dir * L * 0.85)}`;
  }
  const g = T.lg("zahn" + dir, [[0, dir > 0 ? "#b49a68" : "#efe5cc"], [0.35, "#e2d6b4"], [1, dir > 0 ? "#f3ead2" : "#b49a68"]]);
  return `<path d="${d}" fill="${g}" stroke="#4a3e2c" stroke-width=".07" stroke-opacity=".8"/>` + (gl ? `<path d="${gl}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".1"/>` : "");
};
/* fertige Art: Zeichenraum → Zentimeter */
const fertig = (f, svg, box) => ({ svg: `<g transform="scale(${f})">${svg}</g>`, box: box.map((v) => Math.round(v * f)) });

/* =====================================================================
   TYRANNOSAURUS
   RECHERCHE: Tyrannosaurus rex (Maastricht, 68–66 Mio. J., Nordamerika). Erwachsen 12–13 m lang,
   Hüfthöhe (Darmbein) ~3,7 m, ~8 t. Schädel ~1,4–1,5 m, hinten sehr breit → Augen nach vorn
   gerichtet (Raumsehen), dicke Knochenwülste über/vor dem Auge (Postorbitale, Lacrimale).
   Kurzer, dicker S-Hals, massiger Rumpf, Schwanz ~ halbe Körperlänge, waagerecht getragen
   (M. caudofemoralis: riesiger Schwanz-Oberschenkel-Muskel). Arme ~1 m, zwei Finger, Handflächen
   nach innen. Beine: Oberschenkel 1,3 m, Schienbein 1,2 m, langer Mittelfuß, drei tragende Zehen.
   Haut: Hautabdrücke zeigen kleine Kieselschuppen (keine großen Federn beim Erwachsenen).
   Lippen: Cullen et al. 2023 (Science) – Zähne wohl von schuppigen Lippen bedeckt (umstritten,
   Carr) → hier Lippen, nur die Spitzen der oberen Zähne schauen heraus.
   Farbe unbekannt → glaubwürdig wie ein großer Bodenräuber: olivbraun-grau, Bauch heller.
   Zeichenraum: 1 Einheit = 6,2 cm (200 Einheiten ≈ 12,4 m).
   ===================================================================== */
function tyrannosaurus(T) {
  const US = ' gradientUnits="userSpaceOnUse"', F = T.fein;
  /* Haut: EIN Verlauf im Zeichenraum für alle nahen Teile → nahtlose Übergänge; Rücken dunkel, Bauch hell (Gegenschattierung) */
  const haut = T.lg("haut", [[0, "#352e20"], [0.2, "#4a412e"], [0.48, "#6d5f44"], [0.7, "#8f7c59"], [0.86, "#a8936c"], [1, "#7a6a4c"]], 0, -71, 0, 0, US);
  const hautF = T.lg("hautf", [[0, "#272218"], [0.5, "#383124"], [1, "#2c271d"]], 0, -71, 0, 0, US);
  const falte = (arr, op = 0.38, w = 0.32) => linien(T, arr, "#1a140c", w, op);
  const glanz = (arr, op = 0.16, w = 0.3) => linien(T, arr, "#fff4dc", w, op);
  /* Falte mit Licht: dunkle Rinne + heller Grat darüber (Licht links oben) */
  const runzel = (arr, op = 0.4, w = 0.3) => falte(arr, op, w) + (F ? glanz(arr.map((p) => p.map(([x, y]) => [x - 0.35, y - 0.35])), op * 0.45, w * 0.8) : "");
  let h = "";
  /* ---- fernes Bein (Schritt nach hinten, Ferse gehoben) und ferner Arm ---- */
  const fb = [[88, -58], [104, -62], [108, -48], [104, -36], [97, -27], [92.4, -16], [94, -5], [99.6, -2.6], [103.6, -1.2], [104, -0.2, 1], [86, -0.2, 1], [86.4, -3], [86, -14], [89, -27], [86, -40], [82, -50]];
  h += teil(T, fb, hautF, { innen: fleck(T, "d", 92, -22, 6, 11, 10, 0.5) + fleck(T, "l", 99, -50, 6, 5, 0, 0.25) + runzel([[[88, -16], [92, -15.4]], [[87.6, -11], [92, -10.6]]], 0.3, 0.25), rw: 0.25 });
  h += teil(T, [[141, -42], [144.6, -39.6], [148.6, -37.6], [150.4, -36.6], [149.6, -35.6], [146.4, -36.4], [142, -38.6]], hautF, { rw: 0.2 });

  /* ---- Rumpf, Hals, Schwanz (Mund leicht geöffnet → Kehle tiefer) ---- */
  const leib = [[0.2, -47.9], [10, -49.6], [24, -52.5], [42, -56], [62, -59.4], [80, -61.8], [98, -62.8], [114, -61.4], [128, -59], [140, -57.4], [150, -57.6], [160, -61.4], [167, -65.6], [174, -68],
    [176, -52], [172, -41.4], [165, -39], [157, -36.6], [148, -31.6], [138, -27.4], [126, -25.6], [114, -27.6], [104, -32], [94, -38.6], [84, -42.6], [70, -44.4], [52, -45.6], [32, -46.2], [14, -46.6], [4, -46.6], [0.6, -46.9]];
  let innen = "";
  /* Licht auf der Rückenlinie, Reflexlicht vom Boden an der Unterkante */
  innen += linien(T, [[[2, -47.8], [24, -52.7], [62, -59.6], [98, -63], [128, -59.2], [150, -57.8], [167, -65.8]]], "#e4d5ae", 3.2, 0.2);
  innen += linien(T, [[[14, -46.6], [52, -45.6], [84, -42.6]], [[118, -26.8], [138, -27.4], [148, -31.6], [157, -36.6], [165, -39]]], "#c9b48a", 1.4, 0.3);
  /* weiche Querbänder (Tarnzeichnung) auf Rücken und Schwanz */
  for (const [x, y, hh] of [[14, -48.6, 2.6], [24, -51.4, 3.4], [35, -53.8, 4.4], [47, -56.2, 5.4], [60, -58.4, 6.4], [74, -60.4, 7.2], [119, -60, 6.6], [131, -57.8, 6], [145, -56.4, 5], [158, -60.6, 4.6]])
    innen += fleck(T, "d", x, y, 2.2, hh, x < 100 ? 12 : -8, 0.4);
  /* Muskelpakete: Schwanzwurzel (M. caudofemoralis), Rumpf, Schulter, Halsmuskeln; Kernschatten am Bauch */
  innen += fleck(T, "l", 60, -55, 26, 4.5, -6, 0.5) + fleck(T, "l", 124, -53, 16, 9, -4, 0.42) + fleck(T, "l", 158, -57, 7, 6, -40, 0.5) + fleck(T, "l", 165.6, -60, 4, 5.4, -30, 0.4) + fleck(T, "l", 143, -47, 6, 7, 0, 0.3);
  innen += fleck(T, "d", 130, -29, 20, 4.4, -3, 0.55) + fleck(T, "d", 50, -46.4, 34, 2.4, -2, 0.45) + fleck(T, "d", 166, -44, 7, 6, 25, 0.55) + fleck(T, "d", 144, -40, 4, 4, 0, 0.5) + fleck(T, "d", 171, -48, 3, 8, 0, 0.5);
  /* Schlagschatten des Oberschenkels auf den Bauch */
  innen += fleck(T, "d", 114, -40, 6, 12, 10, 0.55) + fleck(T, "d", 149, -33.4, 5, 1.6, 20, 0.7);
  /* Halsfalten, Kehlfalten, Achselfalten, Bauchfalten */
  innen += runzel([[[160, -59], [162.4, -51], [160.4, -42]], [[164.5, -61], [167, -53], [165.6, -44.6]], [[169, -62], [171.4, -55], [170.2, -46]], [[155.6, -57], [157.4, -49], [154.6, -40]],
    [[171, -44], [165, -41.4], [158, -38.6]], [[169.6, -46.6], [163, -44.2], [156.6, -40.8]], [[145.6, -44.6], [147, -41], [146.6, -37]], [[140.6, -44.2], [142.4, -40.4]]], 0.32, 0.3);
  innen += runzel([[[121, -49], [123.4, -40], [122, -28]], [[127, -50], [129.6, -40], [128.6, -27]], [[133, -50], [135.6, -40], [134.6, -29]], [[139, -50], [141.4, -42], [140.6, -32]]], 0.22, 0.34);
  if (F) {
    /* Bauchschilde (Querreihen) und Schwanz-Unterseite */
    innen += reihe(T, [[112, -27.6], [126, -25.8], [138, -27.6], [148, -31.8], [157, -36.8]], 22, -2.6, "#2a2014", 0.18, 0.35);
    innen += reihe(T, [[6, -47], [30, -46.3], [60, -45.2], [84, -42.8]], 40, -1.6, "#2a2014", 0.14, 0.3);
  }
  h += teil(T, leib, haut, { innen, rw: 0.3 });
  /* Rückenkamm: gekielte Schuppen, an Hüfte und Nacken größer */
  const dors = polyl([[6, -47.7], [24, -52.5], [42, -56], [62, -59.4], [80, -61.8], [98, -62.8], [114, -61.4], [128, -59], [140, -57.4], [150, -57.6], [160, -61.4], [167, -65.6]]);
  let hk = "", hkL = "";
  const nK = F ? 96 : 48;
  for (let i = 0; i < nK; i++) {
    const t = (i + 0.5) / nK, [x, y] = dors.at(t), g = 0.45 + 0.55 * Math.sin(Math.PI * Math.min(1, t * 1.15)) * (F ? 1 : 1.6);
    hk += `M${R(x - g)} ${R(y + 0.25)}q${R(g * 0.7)} ${R(-g * 1.5)} ${R(g * 2)} 0`;
    if (F) hkL += `M${R(x - g * 0.8)} ${R(y)}q${R(g * 0.4)} ${R(-g * 1.1)} ${R(g * 0.8)} ${R(-g * 0.9)}`;
  }
  h += `<path d="${hk}" fill="#3d3424" stroke="#1a140c" stroke-width=".12" stroke-opacity=".5"/>` + (hkL ? `<path d="${hkL}" fill="none" stroke="#e8d9b2" stroke-width=".14" stroke-opacity=".4"/>` : "");

  /* ---- naher Arm: zwei Finger, Handfläche nach innen ---- */
  const arm = [[140.4, -44.6], [144, -43.4], [146, -39.6], [149.4, -37.6], [152.6, -36.4], [153.2, -35], [150.6, -34.6], [146.8, -35.6], [143.4, -38.6], [140.6, -41]];
  h += teil(T, arm, haut, { rw: 0.26, randA: 0.6, innen: fleck(T, "l", 144.6, -41.6, 3, 1.4, 35, 0.6) + fleck(T, "d", 148, -35.8, 4, 1, 15, 0.5) + falte([[[146, -39.8], [146.8, -38]]], 0.4, 0.2) });

  /* ---- nahes Bein: Oberschenkel ohne harte Kante, dicker Unterschenkel, Mittelfuß mit Schilden, drei Zehen ---- */
  const bein = [[80, -58], [94, -64.6], [108, -63], [115.6, -54], [116.2, -43], [113.6, -35.4], [111, -26], [107.6, -15.4], [108.4, -8], [111.4, -4.6], [117.6, -2.6], [120.6, -1.2], [121.4, -0.2, 1], [101.4, -0.2, 1],
    [100.4, -2.4], [99, -13.4], [99.4, -23], [101.6, -31.6], [95, -38], [86.6, -45]];
  let bin = fleck(T, "l", 102, -55, 12, 7, 14, 0.7) + fleck(T, "l", 111, -45, 2.6, 8, 6, 0.4) + fleck(T, "l", 105.6, -22, 2.4, 7, 14, 0.42) + fleck(T, "l", 95, -59, 8, 3, 10, 0.35);
  bin += fleck(T, "d", 89, -46, 8, 9, 30, 0.55) + fleck(T, "d", 101.6, -15, 3, 10, 6, 0.4) + fleck(T, "d", 108, -33.6, 6, 2.4, 0, 0.45) + fleck(T, "d", 114.6, -50, 2.6, 10, 0, 0.35) + fleck(T, "d", 104, -3, 8, 2, 0, 0.5);
  /* Sehne hinten am Unterschenkel (Achillessehne), Knie, Sprunggelenk */
  bin += runzel([[[101.6, -33.2], [106.4, -32], [111.6, -34.6]], [[103.4, -29.8], [108, -29]], [[100.4, -12.2], [104.6, -12], [107.6, -12.8]], [[100.2, -14.6], [104, -14.6]]], 0.4, 0.28);
  bin += glanz([[[100.6, -28], [99.8, -22], [100.2, -16]]], 0.3, 0.35);
  if (F) {
    /* Fußschilde (wie bei Vögeln) vorn am Mittelfuß und auf den Zehen */
    bin += reihe(T, [[107.8, -14], [108.2, -8], [111.4, -4.6], [117.6, -2.6], [120.4, -1.3]], 18, 1.6, "#1a140c", 0.2, 0.55, -1.7);
    bin += reihe(T, [[100.2, -12], [100.4, -6], [101.2, -2.4]], 6, 1.4, "#1a140c", 0.16, 0.4, 0.2);
  }
  h += teil(T, bein, haut, { innen: bin, rand: false });
  /* Kante nur dort, wo das Bein vor dem Bauch bzw. vor dem Hintergrund liegt */
  h += falte([[[115.8, -47], [116.2, -43], [113.6, -35.4], [111, -26], [107.6, -15.4], [108.4, -8], [111.4, -4.6], [117.6, -2.6], [120.6, -1.2]], [[101.4, -0.4], [100.4, -2.4], [99, -13.4], [99.4, -23], [101.6, -31.6], [95, -38], [86.6, -45], [83, -50]]], 0.42, 0.3);
  /* zweite Zehe (innen, etwas dahinter) und Zehenballen */
  h += teil(T, [[103, -3.2], [108, -2.8], [113.4, -1.6], [114.6, -0.2, 1], [104, -0.2, 1]], hautF, { rw: 0.18, vol: false });

  /* ---- Kopf: Maulhöhle, Unterkiefer, Zähne, Schädel ---- */
  const maul = [[174.6, -51.2], [185, -52.6], [196, -53.6], [201.6, -54.4], [200.6, -49.6], [199.8, -45.4], [192, -46.8], [183, -48.8]];
  h += teil(T, maul, T.lg("maul", [[0, "#120705"], [1, "#3a1913"]], 0, 0, 1, 0), { vol: false, rand: false, innen: T.form([[178, -50], [188, -49.2], [198, -46.2], [192, -47.2]], "#5c2a22", ' opacity=".7"') });
  const kiefer = [[170.4, -51.2], [175, -50.8, 1], [182, -49.4], [189, -47.8], [195, -46.5], [199.8, -45.6, 1], [200.8, -44.4], [200.2, -42.2], [196, -41.2], [189, -39.8], [182, -38.6], [176.6, -38.6], [172.4, -40.8], [170.2, -45]];
  let kj = fleck(T, "d", 186, -39.6, 16, 2.6, 6, 0.85) + fleck(T, "l", 186, -46.4, 11, 1.8, 12, 0.55) + fleck(T, "d", 173, -45.6, 3, 5, 0, 0.5) + fleck(T, "l", 177, -44, 4, 3, 0, 0.35);
  kj += runzel([[[173.6, -48.4], [183, -46.4], [197, -43.6]], [[171.6, -47], [173.4, -41.4]], [[176, -41.6], [186, -41], [196, -42.4]]], 0.28, 0.24);
  kj += linien(T, [[[175.4, -50.6], [182, -49.2], [189, -47.6], [199.6, -45.4]]], "#b5a077", 0.8, 0.45);
  if (F) kj += reihe(T, [[176, -50.2], [182, -48.8], [189, -47.2], [199.4, -45]], 13, 1.4, "#1a140c", 0.15, 0.55, 0.35) + schuppenFeld(T, kiefer, 1.1, { opS: 0.4, opL: 0.18, flach: 0.75 });
  h += teil(T, kiefer, haut, { innen: kj, rw: 0.28 });
  /* Zahnfleisch und untere Zähne (Spitzen nach oben) */
  h += linien(T, [[[177, -50.5], [184, -49], [191, -47.4], [199.4, -45.6]]], "#6e3a30", 0.35, 0.9);
  h += zaehne(T, [[179.4, -50.1, 0.9, 0.55], [181.8, -49.5, 1.1, 0.62], [184.2, -48.9, 1.3, 0.7], [186.6, -48.4, 1.45, 0.74], [189, -47.8, 1.5, 0.75], [191.4, -47.3, 1.45, 0.74], [193.8, -46.8, 1.35, 0.7], [196.1, -46.3, 1.15, 0.62], [198.3, -45.9, 0.85, 0.5]], -1);
  const kopf = [[169, -56], [169.6, -63], [171.4, -68.4], [175, -71], [179.4, -71.5], [182.6, -70.7], [185.8, -71], [188.6, -69.7], [193, -67.5], [197.6, -64.9], [201, -62.4], [202.8, -59.6], [203.1, -56.6], [202.2, -54.4, 1],
    [197, -53.9], [191, -53.4], [185, -52.8], [179, -52], [175, -51.4, 1], [172.4, -52.6], [170.2, -54.4]];
  let kin = linien(T, [[[171, -68], [175, -71.2], [181, -71.4], [188.6, -69.9], [197.6, -65.1], [201.4, -62.4]]], "#e4d5ae", 2.6, 0.26);
  kin += fleck(T, "l", 191, -65, 11, 2.6, 22, 0.6) + fleck(T, "l", 175, -66, 4.5, 3, 0, 0.45) + fleck(T, "d", 175.4, -55, 6, 4.4, 0, 0.55) + fleck(T, "d", 192, -55, 12, 2.4, 3, 0.5) + fleck(T, "d", 170, -60, 2.4, 7, 0, 0.45);
  /* Augenwulst wirft Schatten aufs Auge; Mulde vor dem Auge (Antorbitalfenster); Wangen; Schnauzenkanten */
  kin += fleck(T, "d", 180, -66.7, 3.2, 1.8, -5, 0.7);
  kin += `<path d="M183.4 -62.6c3.6-2.2 8.8-1.6 11.4 1.3c-3.3 1.7-8.3 1.7-11.4-1.3z" fill="#1a140c" opacity=".2"/>`;
  kin += runzel([[[171.6, -64.6], [174.6, -60.4], [174.8, -55]], [[176.6, -58.4], [183, -57.6], [191, -58.2]], [[194, -59.4], [200, -57.4]], [[196, -65], [199, -63]], [[172.6, -59.4], [173.6, -55.4]]], 0.34, 0.26);
  /* Oberlippe: glatter, heller Saum mit Lippenschuppen */
  kin += linien(T, [[[175.6, -51.8], [185, -53], [191, -53.6], [202, -54.6]]], "#b5a077", 1, 0.45);
  if (F) {
    kin += reihe(T, [[177, -51.8], [185, -52.8], [191, -53.4], [201.6, -54.4]], 15, -1.6, "#1a140c", 0.15, 0.55, -0.1);
    kin += schuppenFeld(T, [[184, -60], [193, -66], [201, -62], [203, -56.4], [200, -55.6], [186, -55]], 1.35, { opS: 0.5, opL: 0.24, flach: 0.7 });
    kin += schuppenFeld(T, [[170, -60], [175, -70.6], [186, -70.4], [194, -66.6], [186, -62], [178, -56], [171, -56]], 1.1, { opS: 0.42, opL: 0.2 });
  }
  h += teil(T, kopf, haut, { innen: kin, rw: 0.3, randA: 0.5 });
  /* Zahnfleisch und obere Zähne (Spitzen nach unten; die größten vorn im Oberkiefer) */
  h += linien(T, [[[177, -51.8], [185, -52.7], [191, -53.3], [201.4, -54.3]]], "#6e3a30", 0.32, 0.85);
  h += zaehne(T, [[178.6, -51.8, 0.9, 0.55], [180.8, -52.1, 1.15, 0.65], [183, -52.4, 1.4, 0.74], [185.2, -52.7, 1.65, 0.82], [187.4, -52.9, 1.85, 0.88], [189.6, -53.1, 2.05, 0.92], [191.8, -53.3, 2.25, 0.96], [194, -53.5, 2.2, 0.95], [196.1, -53.7, 1.85, 0.86], [198.2, -53.9, 1.15, 0.66], [199.8, -54.1, 1, 0.6], [201.1, -54.25, 0.85, 0.52]], 1);
  /* raue Hornhöcker über dem Auge (Postorbitale) und davor (Lacrimale) */
  h += `<path d="M177 -70.6q1.8-1.9 3.8-1.3q-1.2.9-3.8 1.3zM180.8 -71.2q1.2-1.2 2.6-.7q-1 .5-2.6.7zM185.4 -70.8q1.5-1.6 3.2-.8q-1.3.6-3.2.8zM189 -69.4q1-.9 2.2-.4l-2.2.4z" fill="#3a3224" stroke="#140f08" stroke-width=".1" stroke-opacity=".5"/>`;
  let s = F ? `<g filter="${T.relief("haut", { f: 2.6, tiefe: 0.32, okt: 2 })}">${h}</g>` : h;
  /* Auge: nach vorn gerichtet → hoch und weit hinten; Reptilienauge ohne Wimpern, mit Schuppenring */
  s += T.augeReal(179.8, -66.6, 0.95, { iris: "#d39a34", iris2: "#6a3c12", offen: 0.6, lid: "#17120b", winkel: -4, pupille: "rund" });
  s += runzel([[[177.2, -67.9], [179.8, -68.8], [182.6, -67.8]], [[177.8, -64.8], [180, -64.3], [182.2, -64.9]]], 0.5, 0.22);
  if (F) s += reihe(T, [[177.4, -67], [178.6, -68.2], [180.6, -68.5], [182.4, -67.6]], 7, -0.5, "#140f08", 0.12, 0.6);
  /* Nasenloch mit Rand und feuchtem Glanz */
  s += `<path d="M199.8 -61.2c1-.8 2.2-.5 2.4.4c-.8 0-1.6 0-2.4-.4z" fill="#0e0b07"/>` + (F ? `<path d="M199.6 -61.7c1.1-.7 2.3-.5 2.7.2" fill="none" stroke="#e8d9b2" stroke-width=".14" stroke-opacity=".5"/>` : "");
  /* Krallen: Hand (2), naher Fuß (3), ferner Fuß */
  s += krallen(T, [[152.6, -35.6, 2.2, 0.55, 70, 0.6], [151.4, -35, 2.1, 0.5, 80, 0.6], [120.6, -1.4, 3, 1.1, 10, 0.4], [114, -1.2, 2.4, 0.9, 12, 0.4], [101.4, -1.6, 2.4, 0.9, 165, -0.4], [103.4, -1.1, 2.6, 0.95, 8, 0.4], [94.2, -2.4, 2.2, 0.9, 160, -0.4]]);
  return fertig(6.2, s, [0, -71.6, 203.2, 0]);
}


module.exports = [
  { id: "tyrannosaurus", de: "der Tyrannosaurus", syl: "Ty-ran-no-SAU-rus", it: "il tirannosauro", itSyl: "ti-ran-no-SAU-ro", en: "Tyrannosaurus rex",
    gruppe: "Dinosaurier", lebensraum: "Urzeit", laenge: 12.5, hoehe: 4.35, zeichne: tyrannosaurus },
];
