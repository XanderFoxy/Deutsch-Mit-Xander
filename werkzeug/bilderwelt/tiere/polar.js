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

/* ---------- Hilfen ---------- */
function flaeche(p) { let a = 0; for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length]; a += p[i][0] * q[1] - q[0] * p[i][1]; } return a; }
const gleich = (p) => (flaeche(p) < 0 ? p.slice().reverse() : p);
const vereint = (T, teile) => teile.map((p) => T.glatt(gleich(p))).join("");
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
  const g = T.rg("f" + farbe.slice(1) + String(o).replace(".", ""), [[0, farbe, o], [0.5, farbe, R(o * 0.6 * 100) / 100], [1, farbe, 0]]);
  return `<ellipse cx="${Z(cx)}" cy="${Z(cy)}" rx="${Z(rx)}" ry="${Z(ry)}"${dreh ? ` transform="rotate(${dreh} ${Z(cx)} ${Z(cy)})"` : ""} fill="${g}"/>`;
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
const zart = (T, pts, farbe, w, op) => T.linie(pts, farbe, w, op < 1 ? ` stroke-opacity="${op}"` : "");
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

/* Federmuster (Schuppenlage) als Kachel: Reihen versetzter Federspitzen; dunkler Bogen = Schatten unter der Spitze,
   heller Bogen darüber = Licht auf der Federfläche. b Breite, h Reihenabstand (cm), dreh = Neigung der Reihen. Nur fein. */
function federMuster(T, n, b, h, dunkel, hell, wD, wH, dreh = 0) {
  const id = T.id("pm" + n);
  T._pm = T._pm || new Set();
  if (!T._pm.has(id)) {
    T._pm.add(id);
    const q = `q${Z2(b / 2)} ${Z2(h * 0.9)} ${Z2(b)} 0`;
    const reihe = (y) => `M0 ${Z2(y)}${q}M${Z2(-b / 2)} ${Z2(y + h)}${q}M${Z2(b / 2)} ${Z2(y + h)}${q}`;
    T.def(`<pattern id="${id}" width="${Z2(b)}" height="${Z2(2 * h)}" patternUnits="userSpaceOnUse"${dreh ? ` patternTransform="rotate(${dreh})"` : ""}>` +
      (hell ? `<path d="${reihe(0.08)}" fill="none" stroke="${hell}" stroke-width="${wH}"/>` : "") +
      `<path d="${reihe(0.08 + wD * 1.6)}" fill="none" stroke="${dunkel}" stroke-width="${wD}"/></pattern>`);
  }
  return `url(#${id})`;
}
/* leichtes Verwackeln (Turbulenz-Verschiebung): Kachelmuster wirkt wie gewachsen, nicht gestempelt */
function wackel(T) {
  if (!T._wk) { T._wk = T.id("wk"); T.def(`<filter id="${T._wk}" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency=".42" numOctaves="2" seed="9"/><feDisplacementMap in="SourceGraphic" scale=".75" xChannelSelector="R" yChannelSelector="G"/></filter>`); }
  return `url(#${T._wk})`;
}
/* Saum aus kleinen gefüllten Bögen entlang einer Linie (Federspitzen greifen über eine Farbgrenze), Richtung: rechts der Laufrichtung = innen */
function saum(T, pts, schritt, tiefe, farbe, op, seite = 1) {
  let d = "";
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.round(L / schritt));
    const nx = -(b[1] - a[1]) / L * seite, ny = (b[0] - a[0]) / L * seite;
    for (let j = 0; j < k; j++) {
      const t0 = j / k, t1 = (j + 1) / k, x0 = a[0] + (b[0] - a[0]) * t0, y0 = a[1] + (b[1] - a[1]) * t0, x1 = a[0] + (b[0] - a[0]) * t1, y1 = a[1] + (b[1] - a[1]) * t1;
      const tt = tiefe * (0.7 + T.rnd() * 0.6);
      d += `M${Z2(x0)} ${Z2(y0)}Q${Z2((x0 + x1) / 2 - nx * tt * 2)} ${Z2((y0 + y1) / 2 - ny * tt * 2)} ${Z2(x1)} ${Z2(y1)}Z`;
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
  const koerper = [
    [9.4, -108.8], [9.1, -105.6], [9.8, -101.4], [11.6, -96.4], [14.4, -89.6], [17.6, -81.2], [20.6, -71], [22.8, -59], [24, -46.6],
    [23.8, -34.6], [22, -23.8], [18.4, -14.2], [13.6, -7.6], [8, -4.2], [1.6, -3.2], [-5.6, -4], [-11.4, -7.2], [-15.8, -11.8], [-19.6, -17.6],
    [-22.4, -26.6], [-23.8, -38.6], [-24, -52.6], [-23, -66.6], [-20.8, -79], [-17.4, -90], [-13.6, -98.6], [-10.4, -104.4], [-7.8, -109.4],
    [-4.2, -113.6], [0.4, -115.6], [5, -115.4], [8, -113.8], [9.8, -112.4], [10.3, -110.8], [10, -109.6],
  ];
  const kD = T.glatt(koerper);
  let s = "";

  /* ---- ferner Fuß (im Schatten, halb verdeckt) ---- */
  s += T.form([[-8, -3.4], [-7.4, -0.4], [-2, -0.2], [3.4, -0.5], [6.2, -1.1], [6.8, -2.2], [4, -3], [-1, -4.4]], "#141518");
  s += `<path d="M5.8 -1.4q1.5 .1 2.3 1.2q-1.2 -.2 -2.1 -.5zM4 -.7q1.3 0 1.9 .8q-1 -.1 -1.7 -.3z" fill="#050506"/>`;

  /* ---- Schwanz: kurze, steife Steuerfedern als Keil, stützt auf dem Eis ---- */
  const schwanz = [[-13.2, -9.4], [-18.8, -17.8], [-21.6, -14], [-24.4, -8], [-27.4, -1.6], [-28.6, -0.2, 1], [-26.4, -0.3], [-22.2, -2.2], [-17.2, -4.8]];
  let sch = fleck(T, -20.4, -11.4, 5, 2.6, "#62718a", 0.45, -52);
  if (T.fein !== false) {
    let d = "";
    for (let i = 0; i < 8; i++) { const t = i / 7; d += `M${Z(-14.6 - t * 3.6)} ${Z(-8 - t * 8.4)}L${Z(-26.8 - t * 0.6)} ${Z(-0.6 - t * 1.6)}`; }
    sch += `<path d="${d}" stroke="#03040a" stroke-width=".22" stroke-opacity=".8" fill="none"/>` + `<path d="${d}" stroke="#6b7a92" stroke-width=".09" stroke-opacity=".6" fill="none" transform="translate(-.2 -.15)"/>`;
  }
  s += silhouette(T, T.glatt(schwanz), verlauf(T, "schw", -16, -15, -25, -1, [[[-16, -15], "#2a313c"], [[-25, -1], "#0c0e12"]]), sch, "#050608", 0.3, 0.6);

  /* ---- Körper: Weiß als Grund, darin (geklippt) Rücken, Kopf, Gelb, Licht/Schatten, Federn ---- */
  let n = "";
  /* Weiß, kühl beschattet: Licht links oben, Schatten rechts unten blaugrau (Schnee spiegelt den Himmel) */
  n += `<rect x="-30" y="-118" width="56" height="118" fill="${verlauf(T, "weissH", -2, -92, 25, -10, [[[-2, -92], "#ffffff"], [[7, -72], "#f6f7f9"], [[17, -44], "#e1e6ec"], [[22, -26], "#c3cdd8"], [[25, -10], "#97a6b8"]])}"/>`;
  n += fleck(T, 5, -64, 12, 26, "#fff", 1) + fleck(T, 22, -32, 6, 22, "#7f91a8", 0.45, -8) + fleck(T, 10, -6, 18, 7, "#6c7e94", 0.6) + fleck(T, -2, -14, 12, 10, "#61728a", 0.35);
  /* Federschuppen im Weiß (Muster, leicht verwackelt – nur fein); im Licht fast unsichtbar */
  n += fein(T, `<rect x="-14" y="-100" width="40" height="98" fill="${federMuster(T, "w", 1.05, 0.62, "#8193a9", "#fff", 0.07, 0.07, -4)}" filter="${wackel(T)}" opacity=".5"/>`);
  n += fleck(T, 4, -64, 9, 20, "#fff", 0.7) + fleck(T, 6, -86, 7, 8, "#fff", 0.6);
  /* Brust: blasses Gelb, oben vorn am kräftigsten, verläuft nach unten ins Weiß */
  n += fleck(T, 15.6, -86, 7.4, 13, "#f5df8e", 0.9, 22) + fleck(T, 13, -80, 8, 14, "#f8ecbd", 0.55, 15);
  /* Seitenschatten des Bauchs an der schwarz-weißen Grenze (Körper dreht sich nach hinten weg) */
  n += fleck(T, -8, -60, 3.4, 34, "#6f8198", 0.35, 3) + fleck(T, -6, -76, 3.6, 12, "#5f7189", 0.4, 6);
  /* Rücken + Kopf (schwarz; Rücken schiefer-blaugrau überhaucht) */
  const dunkel = [[12.3, -95.4], [9.4, -98], [5.2, -100.4], [-0.6, -101.4], [-3.6, -99.4], [-5.4, -94.4], [-6.8, -87], [-8, -78], [-9.2, -66], [-10.2, -52],
    [-11, -38], [-11.6, -26], [-12.1, -16], [-12.6, -8], [-13.2, 0.5], [-40, 0.5], [-40, -125], [16, -125], [16, -100]];
  T.def(`<clipPath id="${T.id("dkc")}"><path d="${T.glatt(dunkel)}"/></clipPath>`);
  let dk = `<rect x="-30" y="-118" width="46" height="118" fill="${verlauf(T, "ruecken", -24, -60, -8, -60, [[[-24, -60], "#4b5a70"], [[-21, -60], "#353f4e"], [[-15, -60], "#232a34"], [[-8, -60], "#11151b"]])}"/>`;
  dk += `<rect x="-30" y="-118" width="46" height="40" fill="${verlauf(T, "kopfS", 0, -112, 0, -82, [[[0, -112], "#060709"], [[0, -99], "#0a0c0f", 0.95], [[0, -82], "#0a0c0f", 0]])}"/>`;
  dk += fein(T, `<rect x="-26" y="-104" width="20" height="102" fill="${federMuster(T, "r", 1.1, 0.66, "#04060a", "#a3b4ca", 0.11, 0.08, 6)}" filter="${wackel(T)}" opacity=".55"/>`);
  dk += fein(T, `<rect x="-10" y="-117" width="22" height="16" fill="${federMuster(T, "k", 0.5, 0.32, "#000", "#4c5d76", 0.05, 0.05, -10)}" filter="${wackel(T)}" opacity=".55"/>`);
  /* Glanz: Licht von links oben streift Rücken, Nacken und Scheitel */
  dk += fleck(T, -20.6, -64, 3, 28, "#8496ae", 0.45, 3) + fleck(T, -15, -94, 3.6, 8, "#71839d", 0.35, 30) + fleck(T, 0, -113.6, 7, 2, "#5d6e87", 0.45, -4);
  dk += fleck(T, -17, -16, 8, 10, "#000", 0.45) + fleck(T, -9.6, -60, 2, 30, "#000", 0.3, 2);
  n += `<path d="${T.glatt(dunkel)}" fill="#0a0c0f"/><g clip-path="url(#${T.id("dkc")})">${dk}</g>`;
  /* Grenze schwarz–weiß: gezackter Saum aus schwarzen Federspitzen, die ins Weiß greifen */
  const grenze = [[-5.4, -94.4], [-6.8, -87], [-8, -78], [-9.2, -66], [-10.2, -52], [-11, -38], [-11.6, -26], [-12.1, -16], [-12.6, -8]];
  n += saum(T, grenze, 0.9, 0.38, "#0a0c0f", 1);
  /* Ohrfleck: goldorange oben hinter dem Auge, nach unten-vorn heller und schmaler, verschmilzt mit dem Brustgelb */
  const ohr = [[-2, -111.4], [1.2, -110.8], [3, -109], [3.8, -106.2], [5, -103], [7.2, -100], [10, -97.4], [12.4, -94.6], [13.8, -92], [11, -91.2], [7, -93],
    [2.6, -96], [-1.2, -100], [-3.6, -104.6], [-4.2, -108.4]];
  const ohrF = verlauf(T, "ohr", -1, -110, 12, -92, [[[-1, -110], "#f19410"], [[1.5, -106], "#f6ad1a"], [[5, -100.5], "#fac83c"], [[9, -96], "#fbdc72"], [[12, -92], "#f9e7a6", 0]]);
  let oi = fleck(T, -1.6, -108, 2.4, 2.8, "#e27b08", 0.55) + fleck(T, 1.2, -103.6, 2, 4, "#fff6c4", 0.4, -35);
  oi += haare(T, ohr, 170, (x, y) => 62 - (y + 104) * 2, 0.7, [["#d5730a", 1, 0.06, 0.45], ["#fff3b0", 0.7, 0.06, 0.5]], 18, 0.1, 0);
  n += silhouette(T, T.glatt(ohr), ohrF, oi, "#000", 0, 0);
  n += saum(T, [[-2, -111.4], [-4.2, -108.4], [-3.6, -104.6], [-1.2, -100]], 0.5, 0.25, "#0a0c0f", 1);
  /* Kehlkeil: Schwarz des Kinns läuft als schmale Spitze zwischen Ohrfleck und Brust herab */
  n += T.form([[9.3, -109.6], [9.9, -104.4], [11.3, -98.6], [12.4, -95.6, 1], [10.4, -97.6], [8.2, -100.4], [6, -103.6], [4.9, -106.6], [4.6, -109.4], [6.8, -110.8]], "#08090c");
  /* Reflexlicht vom Eis (bläulich) unten am Bauch */
  n += fleck(T, 9, -4, 14, 3, "#bdd3e6", 0.55) + fleck(T, 20.6, -16, 3, 9, "#cfe0ee", 0.35, -28);
  s += silhouette(T, kD, "#eef1f4", n, "#0d1014", 0.35, 0.6);

  /* ---- naher Fuß: Zehen mit Hornschuppen, Schwimmhaut, lange schwarze Krallen; Bauchfedern hängen darüber ---- */
  const lauf = [[-3.4, -4.4], [-2.6, -0.4], [2, 0, 1], [4.6, -1.8], [4.2, -4.6], [0.4, -5.6]];
  const zehA = [[1.6, -0.1], [6.4, -0.2], [10.8, -0.4], [12, -0.9], [12, -1.9], [10.6, -2.4], [6.4, -2.6], [2.4, -2.6]];   // äußere Zehe (vorn, nah)
  const zehM = [[2.6, -2.4], [7, -2.4], [11.6, -2.3], [13.2, -2.7], [13.3, -3.6], [11.8, -4.1], [7.2, -4.2], [3, -4.4]];   // Mittelzehe (dahinter, etwas höher)
  const zehF = verlauf(T, "zeh", 0, -4.4, 0, 0, [[[0, -4.4], "#52565e"], [[0, -2.6], "#2a2c31"], [[0, 0], "#0e0f11"]]);
  let fu = T.form(lauf, "#1b1c1f") + T.form([[3, -4.3], [11.8, -3.4], [11.8, -1.6], [3, -0.6]], "#2e3036");
  fu += T.koerper(zehM, zehF, { vol: false, rand: "#000", randA: 0.6, rw: 0.15, innen: fein(T, `<path d="M4.2 -4.4v2.2M5.6 -4.4v2.1M7 -4.3v2M8.4 -4.2v1.9M9.8 -4.1v1.8M11.1 -4v1.6" stroke="#000" stroke-width=".12" stroke-opacity=".7"/>`) + fleck(T, 8, -3.8, 5, 0.5, "#9aa2ad", 0.4) });
  fu += T.koerper(zehA, zehF, { vol: false, rand: "#000", randA: 0.6, rw: 0.15, innen: fein(T, `<path d="M3.4 -2.7v2.6M4.8 -2.7v2.6M6.2 -2.7v2.5M7.6 -2.6v2.4M9 -2.5v2.2M10.3 -2.4v2" stroke="#000" stroke-width=".12" stroke-opacity=".7"/>`) + fleck(T, 7, -2.1, 5, 0.5, "#a3abb6", 0.45) });
  s += relief(T, "fuss", { f: 1.6, tiefe: 0.6, okt: 2 }, fu);
  /* Krallen: lang, abwärts gebogen, schwarz glänzend */
  s += `<path d="M12.6 -2.8q2.2 -.4 3.4 2q-1 -.6 -3.2 -1.2zM11.4 -1.4q2 -.2 2.8 1.4q-1 -.4 -2.8 -.6z" fill="#060607"/><path d="M13 -2.7q1.4 -.2 2.3 1M11.8 -1.3q1.3 0 1.9 .7" stroke="#9ba1aa" stroke-width=".1" fill="none"/>`;
  /* Bauchfedern über dem Lauf */
  s += T.form([[-4.6, -3.6], [-1.4, -5.4], [3.4, -5.6], [6.2, -4.8], [4.2, -4.2], [0, -4], [-3, -3.2]], verlauf(T, "uebf", 0, -5.6, 0, -3.4, [[[0, -5.6], "#c9d3de"], [[0, -3.4], "#8597ac"]]));
  s += kante(T, [[-4.4, -3.6], [-1, -4.4], [3, -4.6], [6, -4.6]], 26, 0.1, 0.8, "#c3cfdb", 0.12, 0.9, 0);

  /* ---- Flosse: abgeflacht, blauschwarz, glatt; Vorderkante hell gesäumt, weicher Schatten auf dem Körper ---- */
  const flosse = [[-5, -91.6], [-4.4, -84], [-4.6, -76], [-5.6, -67], [-7.4, -59], [-9.8, -52.6], [-11.4, -51.8], [-12.4, -54], [-12.8, -61], [-13.2, -70], [-13.6, -80], [-13.4, -88], [-10.6, -93.4]];
  s += T.form(flosse.map(([x, y]) => [x + 1.4, y + 2]), T.rg("flSch", [[0, "#2a3850", 0.45], [0.7, "#2a3850", 0.2], [1, "#2a3850", 0]], 0.3, 0.5, 0.7));
  let fl = fleck(T, -11.4, -76, 2.2, 15, "#71849e", 0.5, 4) + fleck(T, -6, -70, 1.8, 17, "#000", 0.5, 8) + fleck(T, -9, -90, 4, 3, "#000", 0.4);
  fl += fein(T, `<rect x="-14" y="-94" width="10" height="43" fill="${federMuster(T, "f", 0.5, 0.3, "#03050a", "#8b9db6", 0.05, 0.05, 84)}" opacity=".5"/>`);
  fl += zart(T, [[-5, -90], [-4.4, -82], [-4.8, -74], [-6, -66], [-8, -58], [-10.2, -52.8]], "#a8bad0", 0.3, 0.55);
  s += silhouette(T, T.glatt(flosse), verlauf(T, "flosse", -13.5, -70, -4.4, -70, [[[-13.5, -70], "#3a4860"], [[-9, -70], "#1e2633"], [[-4.4, -70], "#0b0e13"]]), fl, "#05070a", 0.35, 0.7);

  /* ---- Schnabel: lang, schlank, leicht abwärts gebogen; Unterschnabel mit orange-rosa Platte ---- */
  const oben = [[9.6, -113.2], [13, -113], [16.6, -112.2], [20, -110.8], [22.6, -109.3], [23.9, -108.2, 1], [21.8, -108.7], [18, -109.6], [14, -110.2], [10.4, -110.6]];
  const unten = [[10.2, -110.6], [14, -110.25], [18, -109.65], [21.8, -108.75], [22.8, -108.4, 1], [21.4, -107.8], [18, -108], [14, -108.5], [10.2, -109.1]];
  s += T.koerper(unten, "#0e0f12", { vol: false, rand: "#000", randA: 0.6, rw: 0.12, innen:
    T.form([[10.5, -110.45], [14, -110.15], [17, -109.75], [18.9, -109.45, 1], [17, -109.05], [14, -108.85], [10.6, -109.3]], verlauf(T, "platte", 10.5, -109.6, 18.9, -109.4, [[[10.5, -109.6], "#f39a3c"], [[13.4, -109.6], "#f0845a"], [[16.4, -109.5], "#e07a8e"], [[18.9, -109.4], "#a96f97"]])) +
    fleck(T, 13.4, -109.9, 3, 0.35, "#fff", 0.45) });
  s += T.koerper(oben, verlauf(T, "oben", 0, -113.2, 0, -110.4, [[[0, -113.2], "#40454e"], [[0, -112], "#15171a"], [[0, -110.4], "#060708"]]), { vol: false, rand: "#000", randA: 0.6, rw: 0.12,
    innen: zart(T, [[11, -112.9], [14.6, -112.5], [18, -111.5], [21, -109.9], [23, -108.6]], "#949ba6", 0.18, 0.65) + fleck(T, 15, -112.3, 3, 0.5, "#c9d0da", 0.3) });
  s += zart(T, [[10.4, -110.6], [14, -110.22], [18, -109.62], [21.8, -108.72], [23.6, -108.3]], "#000", 0.14, 0.9);
  /* Nasenloch am Schnabelgrund; Kopffedern reichen ein Stück auf den Schnabel */
  s += zart(T, [[11.3, -112.2], [12.8, -112.05]], "#000", 0.13, 0.85);
  s += saum(T, [[9.5, -114], [9.9, -112.4], [10.3, -110.9], [10, -109.6]], 0.45, 0.2, "#08090c", 1);

  /* ---- Auge: klein, Iris dunkelbraun, Glanzlicht klein, schwarzer Lidrand (keine Wimpern) ---- */
  s += T.augeReal(4.2, -111.5, 0.5, { iris: "#4d2c18", iris2: "#1c0e05", offen: 0.82, winkel: -6, lid: "#020203" });
  s += fleck(T, 4, -112.6, 1.6, 0.7, "#44546b", 0.35);
  return { svg: s, box: [-28.6, -115.6, 23.9, 0] };
}

module.exports = [
  { id: "pinguin", de: "der Pinguin", syl: "PIN-gu-in", it: "il pinguino", itSyl: "pin-GUI-no", en: "penguin",
    gruppe: "Polar", lebensraum: "Antarktis", laenge: 0.51, hoehe: 1.16, zeichne: pinguin },
];
