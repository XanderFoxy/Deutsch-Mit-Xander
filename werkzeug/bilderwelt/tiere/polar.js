/* =====================================================================
   TIER-BIBLIOTHEK — POLAR (FASSUNG 854, Maßstab 2)
   Kaiserpinguin, Walross, Seehund, Rentier, Polarfuchs, Moschusochse, Schneeeule, Robbenbaby.
   Zentimeter, Blick nach rechts, Boden y = 0, Licht von links oben (siehe ANLEITUNG.md).
   Weißes Gefieder/Fell bekommt Schatten in Blau-/Grautönen (Schnee spiegelt den Himmel),
   Federn als feine Schuppenlage, Haut mit T.relief, Haare in Lagen. Mikrodetails nur bei T.fein.
   ===================================================================== */
"use strict";
const R = (n) => Math.round(n * 10) / 10;
/* kurze Zahl: 0.4 → .4 (Federn und Haare sind viele – jedes Byte zählt) */
const Z = (n) => String(R(n)).replace(/^(-?)0\./, "$1.");
const Z2 = (n) => String(Math.round(n * 100) / 100).replace(/^(-?)0\./, "$1.");

/* Zahlen zu Pfad: Leerzeichen nur wo nötig ("1 -2" → "1-2") */
const J = (...v) => v.map((x, i) => { const t = Z(x); return i && t[0] !== "-" ? " " + t : t; }).join("");
/* glatte Kurve durch Punkte (Catmull-Rom), kompakt mit relativen Befehlen. [x, y, 1] = harte Ecke */
function G(pts, zu = true, sp = 1) {
  const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let cx = R(pts[0][0]), cy = R(pts[0][1]), d = "M" + J(cx, cy);
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6 * sp, p1[1] + (p2[1] - p0[1]) / 6 * sp];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6 * sp, p2[1] - (p3[1] - p1[1]) / 6 * sp];
    const ex = R(p2[0]), ey = R(p2[1]);
    d += "c" + J(c1[0] - cx, c1[1] - cy, c2[0] - cx, c2[1] - cy, ex - cx, ey - cy);
    cx = ex; cy = ey;
  }
  return d + (zu ? "z" : "");
}
const form = (T, pts, fill, extra = "") => `<path d="${typeof pts === "string" ? pts : G(pts)}" fill="${fill}"${extra}/>`;
const linie = (pts, farbe, w, extra = "") => `<path d="${G(pts, false)}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-linecap="round"${extra}/>`;
/* ---------- Hilfen ---------- */
function flaeche(p) { let a = 0; for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length]; a += p[i][0] * q[1] - q[0] * p[i][1]; } return a; }
const gleich = (p) => (flaeche(p) < 0 ? p.slice().reverse() : p);
const vereint = (T, teile) => teile.map((p) => G(gleich(p))).join("");
function inPoly(x, y, p) {
  let ja = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const xi = p[i][0], yi = p[i][1], xj = p[j][0], yj = p[j][1];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) ja = !ja;
  }
  return ja;
}
/* weicher Fleck (Radialverlauf); ein Verlauf je Farbe + Stärke */
function fleck(T, cx, cy, rx, ry, farbe, op, dreh = 0) {
  const o = Math.max(0.05, Math.round(op * 20) / 20);
  const g = T.rg("f" + farbe.slice(1), [[0, farbe], [0.5, farbe, 0.6], [1, farbe, 0]]);
  return `<ellipse cx="${Z(cx)}" cy="${Z(cy)}" rx="${Z(rx)}" ry="${Z(ry)}"${dreh ? ` transform="rotate(${dreh} ${Z(cx)} ${Z(cy)})"` : ""} fill="${g}"${o < 1 ? ` opacity="${Z2(o)}"` : ""}/>`;
}
/* Verlauf in Zentimetern (userSpaceOnUse): stops [[pos, farbe, op?], …] zwischen (x0,y0) und (x1,y1) */
const verlauf = (T, n, x0, y0, x1, y1, stops) => {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ax = (x1 - x0) / L, ay = (y1 - y0) / L;
  return T.lg(n, stops.map(([p, c, a]) => [Math.round(Math.max(0, Math.min(1, ((p[0] - x0) * ax + (p[1] - y0) * ay) / L)) * 1000) / 1000, c, a]), Z(x0), Z(y0), Z(x1), Z(y1), ' gradientUnits="userSpaceOnUse"');
};
/* Silhouette: Pfad EINMAL in defs; Rand-Strich dahinter, Füllung, Innenleben geklippt */
function silhouette(T, d, fill, innen, rand = "#1a1d22", rw = 0.5, ra = 0.5) {
  T._n = (T._n || 0) + 1;
  const id = T.id("s" + T._n);
  T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  return (rw ? `<use href="#${id}" fill="none" stroke="${rand}" stroke-width="${rw}" stroke-opacity="${ra}" stroke-linejoin="round"/>` : "") + `<use href="#${id}" fill="${fill}"/>` +
    (innen ? `<g clip-path="url(#${id}c)">${innen}</g>` : "");
}
const zart = (T, pts, farbe, w, op) => linie(pts, farbe, w, op < 1 ? ` stroke-opacity="${op}"` : "");
/* Haare in einer Fläche (Wuchsrichtung winkel: Grad oder f(x,y)); farben [[farbe, anteil, breite, deckkraft]]; Szene: Anteil sz */
function haare(T, pts, n, winkel, len, farben, streu = 14, krumm = 0.2, sz = 0.12) {
  const [x0, y0, x1, y1] = T.box(pts), wf = typeof winkel === "function" ? winkel : () => winkel;
  const ziel = Math.round(n * (T.fein === false ? sz : 1));
  if (ziel < 6) return "";
  const eimer = farben.map(() => ""), sum = farben.reduce((q, f) => q + f[1], 0);
  for (let got = 0, v = 0; got < ziel && v < ziel * 14; v++) {
    const x = x0 + T.rnd() * (x1 - x0), y = y0 + T.rnd() * (y1 - y0);
    if (!inPoly(x, y, pts)) continue;
    const a = (wf(x, y) + (T.rnd() - 0.5) * streu) * Math.PI / 180, L = len * (0.55 + T.rnd() * 0.9);
    const ex = Math.cos(a) * L, ey = Math.sin(a) * L, k = krumm * L * (T.rnd() - 0.5) * 2;
    let u = T.rnd() * sum, i = 0;
    while (i < farben.length - 1 && u > farben[i][1]) { u -= farben[i][1]; i++; }
    eimer[i] += L < 1.2 ? `M${Z(x)} ${Z(y)}l${Z2(ex)} ${Z2(ey)}` : `M${Z(x)} ${Z(y)}q${Z(ex / 2 - Math.sin(a) * k)} ${Z(ey / 2 + Math.cos(a) * k)} ${Z(ex)} ${Z(ey)}`;
    got++;
  }
  return eimer.map((d, i) => (d ? `<path d="${d}" fill="none" stroke="${farben[i][0]}" stroke-width="${farben[i][2]}" stroke-opacity="${farben[i][3]}" stroke-linecap="round"/>` : "")).join("");
}
/* Federschuppen: versetzte Reihen kleiner Bögen (Federspitzen) in der Fläche pts.
   o: { b (Breite), h (Reihenabstand), t (Wölbung), farbe, w (Strich), op, winkel f(x,y) (Neigung, Grad),
        p f(x,y) → Wahrscheinlichkeit 0..1, sz (Anteil in der Szene, Standard 0) } */
function schuppen(T, pts, o) {
  if (T.fein === false && !o.sz) return "";
  const [x0, y0, x1, y1] = T.box(pts);
  let d = "";
  const hz = T.fein === false ? o.h / Math.sqrt(o.sz) : o.h, bz = T.fein === false ? o.b / Math.sqrt(o.sz) : o.b;
  for (let y = y0, z = 0; y < y1; y += hz, z++) {
    for (let x = x0 - (z % 2) * bz / 2; x < x1; x += bz) {
      const jx = x + (T.rnd() - 0.5) * bz * 0.35, jy = y + (T.rnd() - 0.5) * hz * 0.35;
      if (!inPoly(jx, jy, pts)) continue;
      if (o.p && T.rnd() > o.p(jx, jy)) continue;
      const a = (o.winkel ? o.winkel(jx, jy) : 0) * Math.PI / 180, w = o.b * (0.8 + T.rnd() * 0.4) / 2;
      const ca = Math.cos(a), sa = Math.sin(a), t = (o.t || 0.45) * w;
      d += `M${Z(jx - ca * w)} ${Z(jy - sa * w)}q${Z2(ca * w - sa * 2 * t)} ${Z2(sa * w + ca * 2 * t)} ${Z2(2 * ca * w)} ${Z2(2 * sa * w)}`;
    }
  }
  return d ? `<path d="${d}" fill="none" stroke="${o.farbe}" stroke-width="${o.w}" stroke-opacity="${o.op}" stroke-linecap="round"/>` : "";
}
/* Randhaare/Federspitzen entlang einer Kurve (bricht die glatte Vektorkante) */
function kante(T, pts, n, dx, dy, farbe, w, op, sz = 0.2) {
  const z = Math.round(n * (T.fein === false ? sz : 1));
  if (z < 5) return "";
  let d = "";
  for (let i = 0; i < z; i++) {
    const t = (i + T.rnd() * 0.8) / z * (pts.length - 1), k = Math.min(pts.length - 2, Math.floor(t)), f = t - k;
    const x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f, s = 0.6 + T.rnd() * 0.8, b = (T.rnd() - 0.5) * 0.6;
    d += `M${Z(x)} ${Z(y)}q${Z2(dx * s * 0.5 + dy * b)} ${Z2(dy * s * 0.5 - dx * b)} ${Z2(dx * s)} ${Z2(dy * s)}`;
  }
  return `<path d="${d}" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" fill="none" stroke-linecap="round"/>`;
}
/* nur in voller Feinheit */
const fein = (T, s) => (T.fein === false ? "" : s);
/* Gruppe mit Relief-Filter (nur fein) */
const relief = (T, n, o, s) => (T.fein === false ? s : `<g filter="${T.relief(n, o)}">${s}</g>`);

/* Federmuster (Schuppenlage) als Kachel: versetzte Reihen von Federspitzen. Je Feder ein dunkler Sichelschatten unter
   der Spitze (auf der Feder darunter) und ein heller Sichelsaum auf der Spitze. b Breite, h Reihenabstand (cm),
   dreh = Neigung der Reihen. Liefert eine Funktion (erst beim Zeichnen anlegen → in der Szene keine Defs). */
function federMuster(T, n, b, h, dunkel, hell, opD, opH, dreh = 0) {
  const id = T.id("pm" + n);
  T._pm = T._pm || new Set();
  if (!T._pm.has(id)) {
    T._pm.add(id);
    const w = b * 0.44, d = h * 0.62;
    const sichel = (cx, cy, t1, t2) => `M${Z2(cx - w)} ${Z2(cy)}Q${Z2(cx)} ${Z2(cy + 2 * d * t1)} ${Z2(cx + w)} ${Z2(cy)}Q${Z2(cx)} ${Z2(cy + 2 * d * t2)} ${Z2(cx - w)} ${Z2(cy)}Z`;
    const alle = (t1, t2, dy) => [[b / 2, 0.05 * h], [0, 1.05 * h], [b, 1.05 * h]].map(([x, y]) => sichel(x, y + dy, t1, t2)).join("");
    T.def(`<pattern id="${id}" width="${Z2(b)}" height="${Z2(2 * h)}" patternUnits="userSpaceOnUse"${dreh ? ` patternTransform="rotate(${dreh})"` : ""}>` +
      `<path d="${alle(1.25, 0.95, 0)}" fill="${dunkel}" fill-opacity="${opD}"/>` +
      (hell ? `<path d="${alle(0.92, 0.55, -0.02)}" fill="${hell}" fill-opacity="${opH}"/>` : "") + `</pattern>`);
  }
  return `url(#${id})`;
}
/* Fläche mit Federmuster füllen (nur fein; in der Szene nichts) */
const federn = (T, x, y, w, h, n, b, hh, dunkel, hell, opD, opH, dreh, op, wk = true, maske = null) =>
  (T.fein === false ? "" : `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${federMuster(T, n, b, hh, dunkel, hell, opD, opH, dreh)}"${wk ? ` filter="${wackel(T)}"` : ""}${op < 1 ? ` opacity="${op}"` : ""}${maske ? ` mask="${maske()}"` : ""}/>`);
/* leichtes Verwackeln (Turbulenz-Verschiebung): Kachelmuster wirkt wie gewachsen, nicht gestempelt */
function wackel(T) {
  if (!T._wk) { T._wk = T.id("wk"); T.def(`<filter id="${T._wk}" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency=".22" numOctaves="2" seed="9"/><feDisplacementMap in="SourceGraphic" scale=".8" xChannelSelector="R" yChannelSelector="G"/></filter>`); }
  return `url(#${T._wk})`;
}
/* fleckige Maske aus Rauschen (Federn liegen mal glatt, mal gesträubt): Muster nur stellenweise sichtbar. Nur fein. */
function rauschMaske(T, n, f, x, y, w, h, k = 3, mitte = 0.45, seed = 4) {
  const id = T.id("nm" + n);
  T.def(`<filter id="${id}f" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency="${f}" numOctaves="2" seed="${seed}"/>` +
    `<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 ${k} 0 0 0 ${Z2(-k * mitte)}"/></filter>` +
    `<mask id="${id}" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}"><rect x="${x}" y="${y}" width="${w}" height="${h}" filter="url(#${id}f)"/></mask>`);
  return `url(#${id})`;
}
/* Maske mit Verlauf (Teil blendet weich aus): stops wie verlauf() */
function verlaufMaske(T, n, x, y, w, h, x0, y0, x1, y1, stops) {
  const id = T.id("vm" + n);
  T.def(`<mask id="${id}" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${verlauf(T, "vg" + n, x0, y0, x1, y1, stops)}"/></mask>`);
  return `url(#${id})`;
}
/* weiches Verwischen (nur fein benutzen) */
function blur(T, sd) {
  const id = T.id("bl" + String(sd).replace(".", ""));
  T._bl = T._bl || new Set();
  if (!T._bl.has(id)) { T._bl.add(id); T.def(`<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${sd}"/></filter>`); }
  return `url(#${id})`;
}
/* Röhre entlang einer Mittellinie (Zehe, Kralle, Haar-Büschel): Breite w0 → w1, Spitze rund */
function roehre(pts, w0, w1) {
  const n = pts.length, L = [], Rr = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const w = (w0 + (w1 - w0) * i / (n - 1)) / 2;
    L.push([pts[i][0] - dy * w, pts[i][1] + dx * w]); Rr.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  const e = pts[n - 1], v = pts[n - 2], l = Math.hypot(e[0] - v[0], e[1] - v[1]) || 1;
  return [...L, [e[0] + (e[0] - v[0]) / l * w1 * 0.5, e[1] + (e[1] - v[1]) / l * w1 * 0.5], ...Rr.reverse()];
}
/* Saum aus kleinen gefüllten Bögen entlang einer Linie (Federspitzen greifen über eine Farbgrenze), Richtung: rechts der Laufrichtung = innen */
function saum(T, pts, schritt, tiefe, farbe, op, seite = 1) {
  let d = "";
  if (T.fein === false) { schritt *= 2.5; tiefe *= 1.5; }
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.round(L / schritt));
    const nx = -(b[1] - a[1]) / L * seite, ny = (b[0] - a[0]) / L * seite, sx = (b[0] - a[0]) / k, sy = (b[1] - a[1]) / k;
    for (let j = 0; j < k; j++) {
      const tt = tiefe * (0.6 + T.rnd() * 0.8);
      d += `M${Z2(a[0] + sx * j)} ${Z2(a[1] + sy * j)}q${Z2(sx / 2 - nx * tt * 2)} ${Z2(sy / 2 - ny * tt * 2)} ${Z2(sx)} ${Z2(sy)}z`;
    }
  }
  return `<path d="${d}" fill="${farbe}"${op < 1 ? ` fill-opacity="${op}"` : ""}/>`;
}

/* =====================================================================
   KAISERPINGUIN
   ===================================================================== */
/* RECHERCHE Kaiserpinguin (Aptenodytes forsteri): größter Pinguin, stehend 100–120 cm, 22–45 kg.
   Stromlinien-Körper wie eine längliche Birne: kleiner Kopf, dicker kurzer Hals, Brust und Bauch tief
   gewölbt (breiteste Stelle im unteren Drittel), Rücken fast gerade. Steht aufrecht, Gewicht auf den
   Fersen, der kurze, steife, keilförmige Schwanz stützt hinten auf dem Eis. Kopf, Kinn, Kehle, Rücken,
   Flossen-Oberseite und Schwanz schwarz (Rücken schiefer-/blaugrau überhaucht, Kopf tiefschwarz);
   Bauch weiß, obere Brust blassgelb. Ohrfleck: leuchtend gelb-orange, oben hinter dem Auge am breitesten
   (dort am kräftigsten, goldorange), läuft als „Komma“ seitlich am Hals nach unten-vorn schmaler aus und
   verschmilzt mit dem Blassgelb der Brust; vorn trennt ihn ein schmaler schwarzer Kehlkeil. Scharfe
   schwarz-weiße Grenze seitlich vor der Flosse, dunkler Grenzstreif. Schnabel ≈ 8 cm, lang, schlank, leicht
   abwärts gebogen; Oberschnabel schwarz, am Unterschnabel seitlich eine orange-rosa bis lila Platte
   (Schnabelstreif). Auge klein, Iris dunkelbraun, keine Wimpern. Flossen 30–35 cm, abgeflacht, Oberseite
   blauschwarz, Unterseite weiß. Füße schwarz, beschuppt, Schwimmhäute, kräftige Krallen; Lauf befiedert,
   Bauchfedern hängen über die Füße. Gefieder: sehr dichte, kurze, steife, schuppenartig überlappende Federn
   (kein Fell!) – glatt, satiniert, auf dem Rücken mit hellen Federspitzen (silbriger Schimmer). */
function pinguin(T) {
  /* Umriss: Kehle rund, Brust vorgewölbt, Bauch im unteren Drittel am tiefsten; Nacken eingezogen, Schulter gewölbt */
  const koerper = [
    [10, -108.6], [9.6, -105.4], [10.4, -101.2], [12.4, -96.6], [15.6, -91], [19.2, -84], [22.2, -76], [24.4, -67], [25.8, -57], [26.4, -47],
    [26.2, -37], [25, -28], [22.6, -20], [19, -13], [14.6, -8.2], [9.8, -5.6], [4, -4.6], [-2, -4.8], [-7.4, -5.8], [-12, -8.4], [-16.2, -12.6],
    [-19.8, -18.6], [-22.6, -27], [-24.2, -38], [-24.8, -50], [-24.4, -62], [-23, -73], [-20.6, -83], [-17.8, -90.6], [-15.2, -95.6],
    [-12.6, -100], [-10.6, -104], [-9.2, -107.6], [-7.6, -111.6], [-4.2, -115.2], [0.6, -117], [5.4, -116.6], [8.6, -115], [10.3, -113.2], [10.9, -111.2], [10.6, -109.8],
  ];
  const kD = G(koerper);
  let s = "";
  /* Kontaktschatten unter Füßen und Schwanzspitze */
  s += fleck(T, 6, -0.2, 13, 1.1, "#000", 0.55) + fleck(T, -24.4, -0.2, 3.4, 0.7, "#000", 0.45);

  /* ---- Füße: schwarz, Hornschuppen-Ringe, Schwimmhaut, kräftige gebogene Krallen; der Bauch deckt nur den Lauf ---- */
  const zehF = verlauf(T, "zeh", 0, -4.6, 0, 0.2, [[[0, -4.6], "#666b74"], [[0, -2.6], "#34373d"], [[0, 0.2], "#0c0d0f"]]);
  const zehe = (m, w0, w1, k, fern) => {
    const ring = [];
    if (T.fein !== false) for (let t = 0.12; t < 0.95; t += 0.1) {
      const i = Math.min(m.length - 2, Math.floor(t * (m.length - 1))), f = t * (m.length - 1) - i, a = m[i], b = m[i + 1];
      const x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f, w = (w0 + (w1 - w0) * t) / 2;
      ring.push(`M${J(x - 0.12, y - w)}q${J(0.36, w, 0, 2 * w)}`);
    }
    let z = T.koerper(G(roehre(m, w0, w1)), fern ? "#1a1b1e" : zehF, { vol: false, rand: "#000", randA: 0.7, rw: 0.1, innen:
      (ring.length ? `<path d="${ring.join("")}" stroke="#060607" stroke-width=".09" stroke-opacity="${fern ? 0.4 : 0.55}" fill="none"/>` : "") +
      (fern ? "" : zart(T, m.map(([x, y], i) => [x, y - w0 * 0.3 * (1 - i / m.length)]), "#a9b0bb", 0.24, 0.45)) });
    z += form(T, roehre(k, 0.78, 0.12), fern ? "#050506" : verlauf(T, "kralle", 0, k[0][1] - 0.5, 0, k[2][1], [[[0, k[0][1] - 0.5], "#34312e"], [[0, k[2][1]], "#060606"]]));
    if (!fern) z += zart(T, k.slice(0, 2).map(([x, y]) => [x, y - 0.2]), "#c9ced6", 0.08, 0.8);
    return z;
  };
  /* ferner Fuß: etwas zurückgesetzt, dunkler, die Zehen schauen hinter den nahen hervor */
  s += form(T, [[-8.6, -4.6], [-8, -0.4], [-2, -0.2], [6, -1.6], [8.4, -2.8], [6, -4.4], [-2, -5.4]], "#121315");
  s += zehe([[-1, -3.4], [3, -3.6], [6.6, -3.4], [9.4, -3]], 1.5, 1, [[9.3, -3.4], [10.9, -3.1], [11.8, -2]], true);
  /* naher Fuß: Ferse/Lauf, Schwimmhaut, Innen-, Mittel- und Außenzehe */
  s += form(T, [[-5, -4.6], [-4.4, -0.3], [1, 0, 1], [12.4, -0.2], [14.4, -1.8], [13.4, -3.6], [6, -4.8], [0, -5.6]], "#1c1d20");
  s += form(T, [[3.4, -4.4], [13.6, -3.4], [15, -2.2], [12.8, -0.9], [3.4, -1]], verlauf(T, "haut", 0, -4.4, 0, -0.9, [[[0, -4.4], "#3a3d43"], [[0, -0.9], "#17181b"]]));
  s += zehe([[2.8, -4.2], [7.4, -4], [11.4, -3.5], [14.6, -2.8]], 1.7, 1.05, [[14.5, -3.2], [16.4, -2.8], [17.6, -1.4]]);
  s += zehe([[1.2, -1.7], [5.6, -1.35], [9.6, -1.05], [12.9, -0.95]], 1.9, 1.15, [[12.8, -1.4], [14.6, -1.1], [15.6, 0]]);
  s += fein(T, `<path d="M-3.6 -3.8q2 -.6 4.2 -.4M-3.2 -2.6q2.2 -.4 4.4 -.2M-2.8 -1.4q2 -.3 4 -.1" stroke="#4a4e56" stroke-width=".14" stroke-opacity=".7" fill="none"/>`);

  /* ---- Schwanz: kurzer, stumpfer Keil aus steifen Steuerfedern, stützt hinten auf dem Eis ---- */
  const schwanz = [[-11.6, -7.6], [-17.6, -15], [-20.8, -21.4], [-22.6, -15], [-24.6, -8.6], [-26, -2.6], [-26.2, -0.5, 1], [-23.4, -0.4], [-19.8, -1.8], [-15.4, -4.2]];
  let sch = fleck(T, -20.6, -12.6, 4.4, 2.4, "#6c7c93", 0.35, -55);
  if (T.fein !== false) {
    let d = "", e = "";
    for (let i = 0; i < 9; i++) {
      const t = i / 8, x0 = -14 - t * 6.4, y0 = -7.4 - t * 12.4, x1 = -23.6 - t * 2.6 + (i % 2) * 0.3, y1 = -0.8 - t * 1.6;
      d += `M${J(x0, y0)}L${J(x1, y1)}`; e += `M${J(x1 + 0.9, y1 - 0.1)}q${J(-0.5, 0.25, -0.9, 0.1)}`;
    }
    sch += `<path d="${d}" stroke="#000" stroke-width=".16" stroke-opacity=".4" fill="none"/><path d="${d}" stroke="#7d8ca3" stroke-width=".06" stroke-opacity=".3" fill="none" transform="translate(-.18 -.14)"/>`;
    sch += `<path d="${e}" stroke="#5c6a80" stroke-width=".1" stroke-opacity=".7" fill="none"/>`;
  }
  s += silhouette(T, G(schwanz), verlauf(T, "schw", -16, -16, -25, -1, [[[-16, -16], "#232a34"], [[-25, -1], "#0b0d10"]]), sch, "#000", 0, 0);

  /* ---- Körper: Weiß als Grund, darin (geklippt) Rücken, Kopf, Gelb, Licht/Schatten, Federn ---- */
  let n = "";
  /* Weiß: im Licht warm-weiß, Schatten kühl-grau nur zur Unterseite und zur Rückseite hin */
  n += `<rect x="-30" y="-120" width="60" height="120" fill="${verlauf(T, "weissH", 0, -90, 22, -8, [[[0, -90], "#ffffff"], [[8, -66], "#fafaf9"], [[16, -42], "#eceff2"], [[20, -24], "#d6dde5"], [[22, -8], "#aebccb"]])}"/>`;
  n += fleck(T, 6, -60, 13, 28, "#fffefb", 1) + fleck(T, 23.4, -36, 5, 22, "#8a9bb0", 0.3, -6) + fleck(T, 8, -6, 18, 6, "#7a8ca3", 0.5);
  n += fleck(T, -6, -40, 5, 32, "#8a9bb0", 0.35, 3) + fleck(T, -5, -76, 3.6, 12, "#8a9bb0", 0.35, 6);
  /* Federschuppen: am Hals klein, an der Brust mittel, am Bauch größer; Reihen folgen der Rundung; fleckig sichtbar */
  if (T.fein !== false) {
    const zone = (nm, y0, y1, b, h, dreh, op) => `<g mask="${verlaufMaske(T, "z" + nm, -26, -120, 54, 120, 0, y0 - 6, 0, y1 + 6, [[[0, y0 - 6], "#000"], [[0, y0 + 2], "#fff"], [[0, y1 - 2], "#fff"], [[0, y1 + 6], "#000"]])}">` +
      federn(T, -26, y0 - 8, 54, y1 - y0 + 16, "w" + nm, b, h, "#6a7c96", "#ffffff", 0.45, 0.8, dreh, op, true, () => rauschMaske(T, "w" + nm, 0.1, -26, y0 - 8, 54, y1 - y0 + 16, 2.4, 0.32, 3 + nm)) + `</g>`;
    n += zone(1, -110, -86, 0.62, 0.36, -22, 0.6) + zone(2, -86, -52, 0.82, 0.48, -8, 0.5) + zone(3, -52, -2, 1, 0.58, 6, 0.55);
  }
  n += fleck(T, 6, -58, 9, 20, "#fffefb", 0.6);
  /* Brust: blasses Gelb, oben vorn am kräftigsten, läuft weich bis zur Brustmitte ins Weiß aus */
  const brust = [[3, -98], [9, -96], [14.6, -92.4], [19.4, -84], [23.4, -72], [24.4, -62], [18, -60], [10, -64], [3, -74], [-1, -86], [-2, -94]];
  n += form(T, brust, verlauf(T, "brust", 13, -94, 14, -60, [[[13, -94], "#f6df86", 0.95], [[13, -84], "#f8e7a8", 0.75], [[14, -72], "#faf0cc", 0.4], [[14, -60], "#fbf5e0", 0]]), T.fein === false ? "" : ` filter="${blur(T, 1.8)}"`);
  /* weicher Eigenschatten innen an der Kontur (statt harter Umrisslinie) */
  n += `<path d="${kD}" fill="none" stroke="#6a7c94" stroke-width="2.4" stroke-opacity=".2"${T.fein === false ? "" : ` filter="${blur(T, 0.6)}"`}/>`;
  /* Rücken + Kopf (schwarz; Rücken schiefer-blaugrau überhaucht) */
  const dunkel = [[12.6, -96], [9.4, -98.6], [5.2, -101.2], [-0.6, -102.2], [-3.2, -100.2], [-3.6, -96], [-3.2, -91.4], [-4.2, -86.4], [-6.2, -81], [-7.8, -75], [-8.8, -66], [-9.2, -52],
    [-9.4, -38], [-10.2, -26], [-11.4, -16], [-12.6, -8], [-13.4, 0.5], [-40, 0.5], [-40, -125], [18, -125], [18, -100]];
  const dD = G(dunkel);
  T.def(`<clipPath id="${T.id("dkc")}"><path d="${dD}"/></clipPath>`);
  let dk = `<rect x="-30" y="-120" width="48" height="120" fill="${verlauf(T, "ruecken", -24.6, -60, -8, -60, [[[-24.6, -60], "#4d5c72"], [[-21.4, -60], "#364151"], [[-15, -60], "#232a34"], [[-8, -60], "#12161c"]])}"/>`;
  dk += federn(T, -26, -118, 44, 116, "r", 1, 0.6, "#000", "#a6b8cf", 0.75, 0.55, 8, 0.6, true, () => rauschMaske(T, "r", 0.08, -26, -118, 44, 116, 2.4, 0.25, 7));
  dk += `<rect x="-30" y="-120" width="48" height="42" fill="${verlauf(T, "kopfS", 0, -114, 0, -86, [[[0, -114], "#060709", 0.88], [[0, -101], "#0a0c0f", 0.75], [[0, -86], "#0a0c0f", 0]])}"/>`;
  dk += federn(T, -10, -118, 22, 18, "k", 0.42, 0.26, "#000", "#5f7290", 0.6, 0.55, -12, 0.5, false);
  /* Glanz: Licht von links oben streift Rücken, Nacken, Scheitel und Stirn */
  dk += fleck(T, -21.2, -62, 3, 28, "#8a9cb4", 0.45, 3) + fleck(T, -16, -93, 3.4, 8, "#8a9cb4", 0.3, 32) + fleck(T, 0.6, -114.8, 6.6, 2, "#8a9cb4", 0.35, -4) + fleck(T, 6.4, -114, 2.6, 1.2, "#8a9cb4", 0.3, 20);
  dk += fleck(T, -17, -16, 8, 10, "#000", 0.45) + fleck(T, -9.4, -60, 2, 30, "#000", 0.3, 2);
  n += `<path d="${dD}" fill="#0a0c0f"/><g clip-path="url(#${T.id("dkc")})">${dk}</g>`;
  /* Grenze schwarz–weiß: feiner gezackter Saum aus schwarzen Federspitzen */
  const grenze = [[-3.6, -96], [-3.2, -91.4], [-4.2, -86.4], [-6.2, -81], [-7.8, -75], [-8.8, -66], [-9.2, -52], [-9.4, -38], [-10.2, -26], [-11.4, -16], [-12.6, -8], [-13, -2]];
  n += T.fein === false ? zart(T, grenze, "#0a0c0f", 0.4, 1) : saum(T, grenze, 0.55, 0.15, "#0a0c0f", 1);
  /* Ohrfleck: gelb-orange, oben auf Augenhöhe hinter dem Auge am breitesten und kräftigsten, läuft rund nach unten-vorn
     aus und geht ohne Absatz ins Brustgelb über; Ränder weich (Federkante) */
  const ohr = [[-2.4, -112.6], [1.4, -112.4], [4.2, -111.2], [5.2, -108.4], [6, -105], [7.4, -102.2], [9.2, -99.8], [11.2, -97.8], [13.2, -96], [14.8, -93.4], [14, -91.4], [11.6, -91],
    [8, -92.6], [3.6, -95.8], [-0.6, -99.8], [-3.2, -104.2], [-4.2, -108.6]];
  const ohrF = verlauf(T, "ohr", -1, -111, 13, -92, [[[-1, -111], "#f2a21c"], [[1.5, -107], "#f5b52c"], [[5, -101.5], "#f8c84a"], [[9, -96.5], "#f9d875"], [[13, -92], "#f8e39c"]]);
  let oi = fleck(T, -1.4, -109, 2.6, 2.6, "#e88d10", 0.5) + fleck(T, 1.4, -104, 2, 4.4, "#fff3c0", 0.35, -35);
  oi += federn(T, -6, -114, 22, 24, "o", 0.42, 0.26, "#c27008", "#fff2b5", 0.35, 0.45, -28, 0.55, false);
  oi += fleck(T, -3.6, -106, 1.4, 6, "#d27a0a", 0.45, 15) + fleck(T, -0.6, -112, 4, 1, "#d27a0a", 0.35);
  n += T.fein === false ? silhouette(T, G(ohr), ohrF, oi, "#000", 0, 0) : form(T, ohr, ohrF, ` filter="${blur(T, 0.14)}"`) + silhouette(T, G(ohr), "none", oi, "#000", 0, 0);
  /* unten Reflexlicht vom Eis */
  n += fleck(T, 9, -6.4, 14, 2.4, "#c4d7e8", 0.5) + fleck(T, 22.4, -17, 3, 8, "#c4d7e8", 0.3, -32);
  s += silhouette(T, kD, "#f2f4f5", n, "#2b3442", 0.18, 0.7);
  /* Bauchfedern liegen über dem Lauf: weicher Saum, darunter Kontaktschatten */
  s += fein(T, saum(T, [[14.4, -8.4], [9.8, -5.6], [4, -4.6], [-2, -4.8], [-7.2, -5.8]], 0.5, 0.15, "#b9c6d3", 1));

  /* ---- Flosse: am Schultergelenk, liegt schräg nach hinten-unten an, leicht schaufelförmig, Spitze schmal;
          Vorderkante mit Lichtkante, hinten schmaler weißer Saum der Unterseite ---- */
  const flosse = [[-6, -95.4], [-5, -88], [-4.8, -80], [-5.6, -71], [-7.2, -63], [-9.4, -56.6], [-11, -54.4], [-12, -55.6], [-12.4, -60], [-12.9, -68], [-13.6, -78], [-14.2, -88], [-12.4, -96]];
  let fg = form(T, flosse.map(([x, y]) => [x + 1.5, y + 2.2]), T.rg("flSch", [[0, "#2a3850", 0.45], [0.7, "#2a3850", 0.2], [1, "#2a3850", 0]], 0.3, 0.5, 0.7));
  let fl = fleck(T, -11.6, -78, 2.4, 16, "#7f92ab", 0.5, 4) + fleck(T, -6.2, -72, 1.6, 18, "#000", 0.5, 8);
  fl += federn(T, -15, -98, 11, 45, "f", 0.4, 0.24, "#000", "#90a3bc", 0.6, 0.45, -8, 0.55, false);
  fl += zart(T, [[-14.2, -86], [-13.7, -76], [-13.1, -66], [-12.5, -58.4]], "#dbe4ee", 0.7, 0.45);
  fl += zart(T, [[-5.2, -88], [-4.9, -81], [-5.4, -73], [-6.8, -65], [-8.6, -58.6]], "#b3c4d8", 0.28, 0.55);
  fg += silhouette(T, G(flosse), verlauf(T, "flosse", -14, -70, -4.8, -70, [[[-14, -70], "#3d4b63"], [[-9.4, -70], "#1f2734"], [[-4.8, -70], "#0b0e13"]]), fl, "#05070a", T.fein === false ? 0.5 : 0.25, T.fein === false ? 0.9 : 0.6);
  if (T.fein === false) fg += zart(T, [[-5.2, -88], [-4.9, -80], [-5.6, -71], [-7.6, -62]], "#8fa3bd", 0.5, 0.8);
  s += `<g mask="${verlaufMaske(T, "fl", -17, -100, 15, 50, 0, -94.6, 0, -88, [[[0, -94.6], "#000"], [[0, -88], "#fff"]])}">${fg}</g>`;

  /* ---- Schnabel: lang, schlank, gleichmäßig leicht abwärts gebogen; Unterschnabel mit orange-rosa-lila Platte ---- */
  const oben = [[10.1, -113.2], [13, -113.1], [16.2, -112.5], [19.2, -111.3], [21.6, -109.9], [22.7, -108.9, 1], [21.2, -109.5], [18, -110.3], [14.4, -110.85], [10.9, -111.1]];
  const unten = [[10.6, -111.1], [14.4, -110.85], [18, -110.3], [21.2, -109.45], [22.1, -109.15, 1], [20.6, -108.85], [17.4, -109.15], [13.8, -109.6], [10.6, -109.95]];
  s += T.koerper(G(unten), "#0b0c0e", { vol: false, rand: "#000", randA: 0.8, rw: 0.08, innen:
    form(T, [[10.8, -110.92], [14.4, -110.66], [17.2, -110.2], [19.1, -109.78, 1], [17.2, -109.42], [14, -109.78], [10.8, -110.1]], verlauf(T, "platte", 10.8, -110.4, 19.1, -109.6, [[[10.8, -110.4], "#f29233"], [[13.6, -110.3], "#f07c52"], [[16.4, -110], "#de7392"], [[19.1, -109.6], "#a46a9a"]])) +
    fein(T, zart(T, [[11.4, -110.5], [14.4, -110.28], [17.4, -109.85]], "#fff", 0.07, 0.4)) });
  s += T.koerper(G(oben), verlauf(T, "oben", 0, -113.2, 0, -111, [[[0, -113.2], "#3c4048"], [[0, -112.2], "#16181b"], [[0, -111], "#060708"]]), { vol: false, rand: "#000", randA: 0.8, rw: 0.08,
    innen: zart(T, [[11.4, -112.95], [14.8, -112.7], [18, -111.8], [20.8, -110.4], [22.2, -109.3]], "#8f96a1", 0.14, 0.55) });
  s += zart(T, [[10.9, -111.1], [14.4, -110.85], [18, -110.3], [21.2, -109.47], [22.4, -109.1]], "#000", 0.12, 0.9);
  /* Nasenloch am Schnabelgrund; Kopffedern laufen weich auf den Schnabel aus */
  s += zart(T, [[11.6, -112.5], [12.9, -112.4]], "#000", 0.11, 0.85);
  s += fein(T, saum(T, [[10.2, -113.4], [10.5, -112.4], [10.95, -111.2], [10.7, -109.9]], 0.32, 0.16, "#08090c", 1));

  /* ---- Auge: klein, Iris dunkelbraun, Federn überlappen den Lidrand, Glanzlicht oben links (Licht von links oben) ---- */
  s += fleck(T, 4.8, -112, 1.4, 1, "#000", 0.6);
  s += T.augeReal(4.8, -111.9, 0.6, { iris: "#3a2012", iris2: "#140904", offen: 0.84, winkel: -6, lid: "#020203" });
  s += `<circle cx="4.6" cy="-112.15" r=".11" fill="#fff" opacity=".85"/>`;
  s += fein(T, saum(T, [[3.9, -112.55], [4.8, -112.75], [5.7, -112.4]], 0.25, 0.08, "#0a0c0f", 1, -1));
  s += fleck(T, 4.6, -113.2, 1.6, 0.5, "#8a9cb4", 0.2);
  return { svg: s, box: [-26.4, -117, 22.7, 0] };
}

/* =====================================================================
   WALROSS
   ===================================================================== */
/* RECHERCHE Walross (Odobenus rosmarus), Bulle: 2,7–3,6 m lang, 800–1700 kg (Kühe 2,3–3,1 m). Massiger,
   spindelförmiger Körper; Hals, Brust und Schultern gewaltig, der Körper verjüngt sich zu den Hinterflossen.
   An Land: liegt auf Bauch und Brust, die Vorderflossen stützen die Brust, die Hinterflossen können nach vorn
   unter den Körper gedreht werden (oder liegen nach hinten). Haut 2–4 cm dick, am Hals der Bullen bis 15 cm,
   stark gefaltet und runzlig, Farbe zimt-/rosabraun (Jungtiere dunkelbraun, alte Bullen fast rosa; im kalten
   Wasser fast weiß); Bullen mit „Bossen“ (Knoten/Beulen) an Hals und Schultern; spärliches, kurzes rötlich-braunes
   Haar; Narben. Kopf klein, rund, ohne Ohrmuschel (nur Gehöröffnung hinter dem Auge); Augen klein, oft blutunterlaufen,
   hoch und seitlich. Breites, fleischiges Schnauzenpolster (Mystacialpolster) mit 400–700 steifen, dicken,
   hell-cremefarbenen Vibrissen in 13–15 Reihen (bis 30 cm, vorn abgenutzt kürzer). Nasenlöcher oben auf der
   Schnauze (Halbmondschlitze). Stoßzähne = obere Eckzähne, bei beiden Geschlechtern, beim Bullen bis 1 m (sichtbar
   ~50 cm), elfenbeinfarben, an der Basis bräunlich, längsgerillt, Risse, abgenutzte Spitzen; treten unter dem
   Polster aus, hängen leicht nach hinten gebogen. Vorderflossen kurz, breit, fast quadratisch, fünf Finger mit
   winzigen Nägeln; Hinterflossen dreieckig mit Schwimmhaut, Krallen an den drei mittleren Zehen. Schwanz winzig. */
function walross(T) {
  let s = "";
  const rumpf = [
    [50, -30], [64, -48], [84, -64], [110, -79], [140, -92], [170, -104], [196, -116], [218, -127], [236, -134.4], [251, -139], [265, -142.4], [278.6, -141.6],
    [288.6, -137], [296, -129.4], [301.4, -120.4], [304.2, -110.4], [303, -100.6], [298.4, -94.6], [290.6, -90.6], [281.4, -87.2], [271.4, -84.6], [262, -80.6],
    [255, -72.4], [250.6, -60.2], [248.2, -46.6], [244, -34.6], [236, -24.6], [224, -16.6], [205, -8.4], [180, -3], [140, -1], [100, -1.4], [74, -3.8], [58, -9.8], [48.6, -19.6],
  ];
  const kD = G(rumpf);
  const haut = verlauf(T, "haut", 0, -142, 0, 0, [[[0, -142], "#8f6150"], [[0, -118], "#a8735c"], [[0, -90], "#bf8a70"], [[0, -60], "#c18c73"], [[0, -32], "#a77260"], [[0, -10], "#7d5040"], [[0, 0], "#5e3a2e"]]);
  const hautF = verlauf(T, "hautF", 0, -40, 0, 0, [[[0, -40], "#8a5c4a"], [[0, -14], "#6d4537"], [[0, 0], "#4b2e24"]]);
  const falte = (pts, w, op = 0.5) => zart(T, pts, "#3e2219", w, op) + zart(T, pts.map(([x, y]) => [x - w * 0.5, y - w * 0.75]), "#f2c9b2", w * 0.6, op * 0.6);

  /* ---- ferne Flossen (im Schatten, aber modelliert) ---- */
  const hfF = [[62, -30], [46, -29], [28, -26.4], [12, -24.6], [4, -22.6], [8, -19.6], [20, -18.4], [36, -17.4], [52, -16]];
  s += silhouette(T, G(hfF), hautF, fleck(T, 30, -26, 22, 2, "#d9a28c", 0.3) + fleck(T, 30, -18, 24, 2, "#000", 0.35) +
    zart(T, [[54, -24], [36, -23], [18, -22], [6, -21.4]], "#2a1812", 0.3, 0.5) + zart(T, [[52, -20], [34, -20], [14, -20.6]], "#2a1812", 0.25, 0.4), "#2a1812", 0.35, 0.6);
  const vfF = [[212, -24], [228, -16], [248, -9.6], [268, -5.4], [284, -3.6], [288, -1.6], [284, -0.2], [262, -0.2], [236, -0.4], [216, -4]];
  s += silhouette(T, G(vfF), hautF, fleck(T, 250, -7, 30, 3, "#d9a28c", 0.25) + fleck(T, 250, -1, 34, 2, "#000", 0.4), "#2a1812", 0.35, 0.6);

  /* ---- ferner Stoßzahn (halb verdeckt, dunkler) ---- */
  const zahnF = [[285.4, -96], [290.8, -95.6], [289.4, -78], [286.2, -60], [281.6, -44], [277.6, -37.4, 1], [276.4, -38], [278.6, -48], [281.4, -62], [283.4, -78]];
  s += silhouette(T, G(zahnF), verlauf(T, "zahnF", 276, 0, 291, 0, [[[276, 0], "#a8987a"], [[291, 0], "#7b6a52"]]), fleck(T, 287, -88, 3, 8, "#5a4630", 0.4), "#3a2c1e", 0.3, 0.6);

  /* ---- Körper mit Kopf ---- */
  let n = "";
  /* große weiche Licht- und Schattenformen (Licht von links oben): Rücken, Schulterbuckel, Nacken, Stirn hell;
     Unterseite, Kehle unter dem Kinn, Brust zwischen Flosse und Bauch dunkel */
  n += fleck(T, 150, -88, 80, 12, "#f6d2bd", 0.45, -14) + fleck(T, 222, -120, 22, 10, "#f6d2bd", 0.4, -20) + fleck(T, 268, -134, 16, 6, "#f8dccb", 0.5, -6);
  n += fleck(T, 100, -60, 50, 18, "#e3a990", 0.3, -14) + fleck(T, 240, -90, 18, 30, "#d99a84", 0.45, 10);
  n += fleck(T, 140, -10, 100, 12, "#3b2219", 0.55) + fleck(T, 264, -82, 16, 6, "#3b2219", 0.6, 15) + fleck(T, 238, -30, 16, 14, "#3b2219", 0.55);
  n += fleck(T, 60, -24, 18, 12, "#3b2219", 0.4) + fleck(T, 248, -56, 6, 16, "#3b2219", 0.3);
  /* Reflexlicht vom Eis unter dem Bauch */
  n += fleck(T, 150, -2, 70, 2.4, "#d8c2c0", 0.35);
  /* Hautporen (fein, nur T.fein): ein schwaches Relief, kein Sandpapier */
  /* Haare: spärlich, kurz, rötlich, auf dem Rücken mehr (samtiger Schimmer) */
  n += haare(T, [[60, -46], [110, -80], [170, -104], [218, -128], [250, -138], [244, -112], [200, -94], [140, -74], [80, -50]], 900, (x, y) => 160 + (x - 150) * 0.05, 0.9,
    [["#5b3324", 1, 0.08, 0.45], ["#e7b79b", 0.7, 0.07, 0.45]], 22, 0.3, 0.1);
  /* Falten: Hals (Ringe, die sich um den dicken Hals legen), Schulter, Flanke, Bauch */
  n += falte([[236, -133], [231, -120], [229, -104], [232, -88], [240, -74], [248, -64]], 0.9, 0.55);
  n += falte([[246, -137], [240, -124], [238, -108], [241, -94], [248, -82], [254, -73]], 0.8, 0.5);
  n += falte([[226, -129], [220, -114], [218, -98], [222, -82], [229, -68], [238, -56]], 0.9, 0.45);
  n += falte([[214, -124], [208, -108], [208, -92], [214, -76], [222, -62]], 0.8, 0.4);
  n += falte([[256, -138.6], [252, -128], [251, -114], [254, -102], [262, -90], [268, -86]], 0.6, 0.45);
  n += falte([[257, -80], [262, -76], [270, -76]], 0.6, 0.5) + falte([[252, -70], [258, -66], [264, -66]], 0.6, 0.45);
  n += falte([[196, -114], [192, -96], [196, -78], [206, -62], [216, -50]], 0.8, 0.35) + falte([[180, -106], [176, -88], [182, -70]], 0.7, 0.3);
  n += falte([[226, -40], [214, -30], [196, -22], [172, -16]], 0.8, 0.45) + falte([[236, -50], [222, -42], [204, -34]], 0.7, 0.4);
  n += falte([[160, -30], [130, -26], [100, -24], [76, -22]], 0.7, 0.35) + falte([[150, -50], [120, -46], [90, -40], [68, -34]], 0.6, 0.25);
  n += falte([[120, -12], [100, -10], [80, -10]], 0.6, 0.35) + falte([[190, -8], [168, -6.6], [150, -6]], 0.6, 0.35);
  n += falte([[96, -72], [88, -58], [86, -42], [90, -26], [96, -14]], 0.7, 0.3) + falte([[74, -56], [68, -42], [68, -28], [72, -16]], 0.6, 0.3);
  /* Bossen: Knoten und Beulen an Hals und Schultern (Licht oben links, Schatten unten rechts) */
  const bossen = [[214, -114, 4], [222, -104, 5], [230, -94, 4.4], [236, -112, 3.6], [244, -100, 3.8], [226, -84, 4.2], [238, -80, 3.6], [206, -98, 4.6], [216, -88, 3.8],
    [248, -116, 3], [252, -92, 3], [244, -70, 3.6], [200, -110, 3.4], [232, -122, 3.2], [210, -76, 3.6], [196, -88, 3.2], [240, -60, 3], [228, -66, 3.4]];
  for (const [x, y, rr] of bossen) n += fleck(T, x + rr * 0.35, y + rr * 0.4, rr * 1.05, rr * 0.9, "#4a291d", 0.45) + fleck(T, x - rr * 0.3, y - rr * 0.35, rr * 0.75, rr * 0.6, "#ffe0cc", 0.4);
  /* Narben: helle, leicht erhabene Striche (Kämpfe mit Stoßzähnen) */
  n += zart(T, [[218, -108], [226, -100], [231, -97]], "#f0d0c0", 0.5, 0.55) + zart(T, [[204, -82], [210, -72]], "#f0d0c0", 0.45, 0.5) + zart(T, [[246, -96], [250, -86]], "#f0d0c0", 0.4, 0.5);
  /* Schnauzenpolster: geschwollen, etwas heller, mit Haarbälgen in Reihen */
  const polster = [[284, -134], [292, -133], [298.6, -126], [302.8, -117], [304, -108], [302.6, -99.6], [297.4, -94.2], [289, -92.6], [282, -96], [279, -106], [279.6, -120]];
  n += form(T, polster, T.rg("polster", [[0, "#e2b09c", 0.9], [0.6, "#cf9a85", 0.5], [1, "#c08a75", 0]], 0.45, 0.4, 0.6));
  n += fleck(T, 292, -116, 7, 10, "#f6d6c6", 0.45, -15) + fleck(T, 296, -98, 9, 4, "#3b2219", 0.35);
  /* Mund: Unterlippe unter dem Polster, Kinn mit kurzen Borsten */
  n += zart(T, [[296.4, -94.2], [291, -92.4], [284, -91], [278, -90.4]], "#3b1f17", 0.6, 0.6) + fleck(T, 284, -88.6, 8, 2, "#3b2219", 0.4);
  const kD2 = kD;
  s += relief(T, "haut", { f: 0.9, tiefe: 0.5, okt: 2, seed: 11 }, silhouette(T, kD2, haut, n, "#2a1812", 0.5, 0.55));
  /* Haarbälge (Follikelreihen) auf dem Polster */
  if (T.fein !== false) {
    let d = "";
    for (let r = 0; r < 9; r++) for (let i = 0; i < 9; i++) {
      const t = i / 8, x = 296.6 + 6.4 * Math.sin(t * 2.6 - 0.3) - r * 1.9 - (T.rnd() - 0.5) * 0.6, y = -128 + t * 31 + r * 0.4 + (T.rnd() - 0.5) * 0.6;
      if (inPoly(x, y, polster)) d += `M${J(x, y)}h.01`;
    }
    s += `<path d="${d}" stroke="#5a2e22" stroke-width=".55" stroke-linecap="round" stroke-opacity=".7"/>`;
  }

  /* ---- Vibrissen: steif, dick, cremefarben; vorn abgenutzt kürzer, unten und seitlich länger, fächern nach vorn-unten ---- */
  const borsten = (n0, f, sz) => {
    let dS = "", dH = "";
    const k = Math.round(n0 * (T.fein === false ? sz : 1));
    for (let i = 0; i < k; i++) {
      const t = f ? (i + T.rnd() * 0.6) / k : T.rnd();
      /* Ansatz auf dem Polster: Reihen parallel zur Polster-Vorderkante */
      const reihe = T.rnd();
      const bx = 302.6 - reihe * 14 + 3 * Math.sin(t * 3.1) - (t > 0.75 ? (t - 0.75) * 18 : 0), by = -124 + t * 30 + reihe * 2;
      if (!inPoly(bx, by, polster)) continue;
      const L = (3 + 6 * t + T.rnd() * 2.4) * (1 - reihe * 0.35), a = (25 + t * 50 + (T.rnd() - 0.5) * 16) * Math.PI / 180;
      const ex = bx + Math.cos(a) * L, ey = by + Math.sin(a) * L, nx = -Math.sin(a), ny = Math.cos(a), w = 0.22 + 0.08 * (1 - reihe);
      const zug = `M${J(bx - nx * w, by - ny * w)}Q${J((bx + ex) / 2 + nx * 0.25, (by + ey) / 2 + ny * 0.25 + L * 0.05, ex, ey)}Q${J((bx + ex) / 2 + nx * 0.25 + nx * w * 0.6, (by + ey) / 2 + ny * 0.25 + ny * w * 0.6 + L * 0.05, bx + nx * w, by + ny * w)}z`;
      dS += zug; dH += `M${J(bx, by)}Q${J((bx + ex) / 2 + nx * 0.18, (by + ey) / 2 + ny * 0.18 + L * 0.05, ex - Math.cos(a) * L * 0.25, ey - Math.sin(a) * L * 0.25)}`;
    }
    return `<path d="${dS}" fill="${verlauf(T, "borste", 0, -128, 0, -88, [[[0, -128], "#efe3c6"], [[0, -88], "#d9c49e"]])}" stroke="#6b5434" stroke-width=".06" stroke-opacity=".5"/>` +
      `<path d="${dH}" fill="none" stroke="#fffaf0" stroke-width=".07" stroke-opacity=".7"/>`;
  };
  s += borsten(150, false, 0.3);

  /* ---- naher Stoßzahn: Elfenbein, Basis bräunlich, Längsrillen, feine Risse, abgenutzte Spitze ---- */
  const zahn = [[291.6, -96.4], [297.6, -95.4], [296, -80], [292.6, -62], [288, -46], [283.8, -36.4], [282.4, -35.8, 1], [281.6, -37.6], [284, -48], [287, -62], [289.6, -78]];
  let zi = fleck(T, 294.4, -90, 4, 6, "#7a5634", 0.5) + fleck(T, 289, -66, 1.4, 22, "#fffaf0", 0.6, 12) + fleck(T, 293, -60, 1.6, 24, "#6d5a3e", 0.3, 12);
  zi += zart(T, [[294.2, -95], [293, -80], [289.8, -62], [285.6, -46]], "#8a7556", 0.18, 0.5) + zart(T, [[295.8, -94], [294.4, -78], [291, -60]], "#8a7556", 0.15, 0.4);
  zi += fein(T, zart(T, [[290.8, -72], [292.4, -70.6]], "#5d4a33", 0.1, 0.6) + zart(T, [[288.4, -54], [290, -53]], "#5d4a33", 0.1, 0.6) + zart(T, [[286.6, -44], [288, -43.6]], "#5d4a33", 0.08, 0.5));
  s += silhouette(T, G(zahn), verlauf(T, "zahn", 281, 0, 298, 0, [[[281, 0], "#fbf3df"], [[288, 0], "#eadcbc"], [[298, 0], "#b8a17a"]]), zi, "#4a3826", 0.3, 0.65);
  /* Zahnfleisch/Lippe am Austritt */
  s += form(T, [[290, -97.4], [299, -96.6], [298.4, -94.2], [291, -94.6]], "#7b3d32") + zart(T, [[290.4, -95.2], [298.4, -94.8]], "#3b1a14", 0.3, 0.6);

  /* ---- Nasenlöcher oben auf der Schnauze (Halbmondschlitze) ---- */
  s += `<path d="M291.2 -134.2q2.4 -.4 3.6 1.4q-1.8 -.5 -3.4 -.4zM293.8 -132.2q2 -.2 2.8 1.4q-1.4 -.5 -2.7 -.5z" fill="#2a120d"/>`;
  s += zart(T, [[290.8, -135.2], [294.6, -134.2]], "#f5d2c0", 0.2, 0.5);

  /* ---- Auge: klein, hoch und seitlich, gerötete Bindehaut, braune Iris, faltige Lider ---- */
  s += fleck(T, 268, -124, 4, 3, "#3b2219", 0.45);
  s += T.augeReal(268, -124.4, 0.9, { iris: "#5a3018", iris2: "#24110a", offen: 0.62, winkel: -8, weiss: true, lid: "#3a1d14", haut: "#9b5a48" });
  s += fein(T, zart(T, [[264.6, -126.6], [267.6, -128], [271, -127.4]], "#3b2219", 0.25, 0.5) + zart(T, [[265, -121.6], [268, -120.6], [271.4, -121.4]], "#3b2219", 0.22, 0.45) + zart(T, [[263.6, -129.4], [268, -131], [272.4, -129.6]], "#3b2219", 0.25, 0.35));
  /* Gehöröffnung hinter dem Auge (keine Ohrmuschel) */
  s += form(T, [[247.6, -121.8], [249, -122.6], [249.8, -121.4], [248.6, -120.6]], "#2a140e") + zart(T, [[246.4, -123.6], [249.6, -124], [251, -122]], "#3b2219", 0.3, 0.4);

  /* ---- nahe Vorderflosse: breit, kurz, fast quadratisch, stützt die Brust; fünf Finger als Wülste, winzige Nägel ---- */
  const vf = [[218, -38], [230, -32], [243, -21], [258, -12], [274, -6.6], [287, -4.2], [294, -3], [296, -1.4], [293, -0.1], [270, -0.1], [244, -0.2], [228, -2.4], [218, -10], [214, -24]];
  let vi = fleck(T, 240, -24, 18, 6, "#f4ccb6", 0.45, 30) + fleck(T, 262, -3, 30, 3, "#2a160f", 0.5) + fleck(T, 222, -14, 8, 10, "#3b2219", 0.45);
  for (let i = 0; i < 5; i++) vi += falte([[236 + i * 3, -18 + i * 3], [254 + i * 3, -10 + i * 1.6], [270 + i * 4, -6 + i * 1.2], [282 + i * 2.4, -4.6 + i * 1]], 0.4, 0.35);
  vi += falte([[222, -30], [218, -20], [220, -10]], 0.6, 0.45) + falte([[230, -30], [228, -22]], 0.5, 0.35);
  vi += haare(T, vf, 160, (x, y) => -10 + (x - 220) * 0.1, 0.7, [["#4a2a1e", 1, 0.07, 0.45], ["#e8bba2", 0.6, 0.06, 0.4]], 18, 0.2, 0.1);
  s += relief(T, "flosse", { f: 1.1, tiefe: 0.45, okt: 2, seed: 4 }, silhouette(T, G(vf), verlauf(T, "vf", 0, -38, 0, 0, [[[0, -38], "#b07a63"], [[0, -16], "#9c6855"], [[0, 0], "#5c3a2d"]]), vi, "#2a1812", 0.45, 0.6));
  s += `<path d="M286.6 -4.4q1.4 -.3 2 .5M290.4 -3.6q1.3 -.1 1.8 .7M293.6 -2.6q1 0 1.4 .7" stroke="#2a1a12" stroke-width=".7" stroke-linecap="round" fill="none"/>`;

  /* ---- nahe Hinterflosse: dreieckig, Schwimmhaut, fünf Zehen, Krallen an den drei mittleren ---- */
  const hf = [[64, -22], [48, -16], [30, -11], [14, -7.4], [3, -5.2], [0.4, -3], [4, -1.6], [1.6, -0.2], [20, -0.2], [44, -0.4], [60, -1.6], [68, -8]];
  let hi = fleck(T, 36, -8, 26, 3, "#f0c6b0", 0.35) + fleck(T, 36, -1, 30, 1.6, "#2a160f", 0.5) + fleck(T, 62, -12, 8, 8, "#3b2219", 0.4);
  for (let i = 0; i < 5; i++) hi += falte([[60, -12 + i * 1.6], [40, -10 + i * 1.8], [20, -7 + i * 1.4], [4 + i * 0.6, -4.6 + i * 1]], 0.35, 0.35);
  hi += `<path d="M26 -9.6q-1.6 -.6 -2.6 .2M24 -6.8q-1.6 -.5 -2.6 .3M22.4 -4.2q-1.5 -.4 -2.4 .3" stroke="#2a1a12" stroke-width=".7" stroke-linecap="round" fill="none"/>`;
  s += relief(T, "flosse", { f: 1.1, tiefe: 0.45, okt: 2, seed: 4 }, silhouette(T, G(hf), verlauf(T, "hf", 0, -22, 0, 0, [[[0, -22], "#a6705a"], [[0, -8], "#8a5b48"], [[0, 0], "#553529"]]), hi, "#2a1812", 0.45, 0.6));
  s += fleck(T, 150, -0.3, 150, 1.2, "#000", 0.45);
  return { svg: s, box: [0.4, -142.4, 304.2, 0] };
}

module.exports = [
  { id: "pinguin", de: "der Pinguin", syl: "PIN-gu-in", it: "il pinguino", itSyl: "pin-GUI-no", en: "penguin",
    gruppe: "Polar", lebensraum: "Antarktis", laenge: 0.49, hoehe: 1.17, zeichne: pinguin },
  { id: "walross", de: "das Walross", syl: "WAL-ross", it: "il tricheco", itSyl: "tri-CHE-co", en: "walrus",
    gruppe: "Polar", lebensraum: "Arktis", laenge: 3.04, hoehe: 1.42, zeichne: walross },
];
