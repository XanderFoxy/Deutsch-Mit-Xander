#!/usr/bin/env node
/* =====================================================================
   DIE DINOSAURIER (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Museum für Naturkunde Berlin, Dinosauriersaal; Senckenberg
   Frankfurt; Fachliteratur zu Körpermaßen):
   - Der Saal ist ein hoher LICHTHOF mit GLASDACH auf Stahlbögen. In der
     Mitte steht das Skelett des BRACHIOSAURUS (Giraffatitan) — mit
     über 13 Metern das höchste aufgebaute Dinosaurierskelett der Welt;
     die Vorderbeine sind länger als die Hinterbeine, der Hals steil.
   - Daneben echte Skelette und Abgüsse auf flachen Podesten, gehalten
     von dünnen Stahlstützen: TYRANNOSAURUS (12 m, Schritt-Haltung,
     Schwanz waagrecht, zweifingrige Ärmchen), TRICERATOPS (9 m, drei
     Hörner, Nackenschild), STEGOSAURUS (9 m, zwei Reihen Platten,
     vier Schwanzstacheln), ein PTERANODON hängt an Seilen unter dem
     Dach (7 m Spannweite, Kamm am Kopf, kein Dinosaurier).
   - Lebensecht gebaute MODELLE: ANKYLOSAURUS mit Knochenplatten und
     Schwanzkeule, VELOCIRAPTOR mit Federn (truthahngroß, Sichelkralle).
   - In der VITRINE Fossilien: Dinosaurierei, Zahn, Ammonit, Kralle;
     an der Wand eine Platte mit FUSSABDRUCK; vorn ein Pult mit der
     ZEITLEISTE (Trias – Jura – Kreide – … – Eiszeit).
   - Zeitlich: Stegosaurus und Brachiosaurus lebten im Jura (vor etwa
     150 Mio. Jahren), die anderen in der Kreidezeit — im Museum stehen
     sie nebeneinander, im Leben sind sie sich nie begegnet.
   BLICK: Augenhöhe 1,6 m, Horizont y = 132; Einheiten je Meter am
   Boden: s(y) = (y − 132) / 1,6 (Brachiosaurus y 144: 7,5; T. rex
   y 146: 9; Besucher y 166: 21).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "dinosaurier", titel: "Die Dinosaurier", emoji: "🦕", thema: "Natur", kuerzel: "b20e", fassung: 852 });
const rnd = zufall(6600);
const r = B.r;
const HY = 132, E = 1.6;
const s = (y) => (y - HY) / E;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const knapp = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n * 2) / 2))}"`);
const mensch = (spec, h) => { const m = B.mensch(spec, h); m.svg = knapp(m.svg); return m; };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const KNOCHEN = S.lg("knochen", [[0, "#d8c19a"], [0.5, "#b8976a"], [1, "#8a6a44"]]);
const KNOCHEN_D = S.lg("knochend", [[0, "#9a7b55"], [1, "#6a4f32"]]);
const STAHL = "#3a3f46";

/* ---------- Skelett-Baukasten ----------------------------------------
   Alle Maße in Metern; P(x, h) setzt sie ins Bild (x nach rechts,
   h = Höhe über dem Boden). */
const skelett = (x0, yb, sk) => {
  const P = (mx, mh) => [r(x0 + mx * sk), r(yb - mh * sk)];
  const W = (m) => r(Math.max(0.25, m * sk));
  const K = {};
  K.P = P;
  /* Wirbelsäule: Wirbelkörper entlang der Linie, Dornfortsätze nach oben */
  K.wirbel = (pts, d0, d1, dorn = () => 0, farbe = KNOCHEN) => {
    let g = "";
    const L = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ah] = pts[i], [bx, bh] = pts[i + 1], n = Math.max(2, Math.round(Math.hypot(bx - ax, bh - ah) / 0.32));
      for (let j = 0; j < n; j++) L.push([ax + (bx - ax) * j / n, ah + (bh - ah) * j / n]);
    }
    L.push(pts[pts.length - 1]);
    const path = "M" + L.map((p) => P(p[0], p[1]).join(" ")).join(" L");
    g += `<path d="${path}" stroke="${KNOCHEN_D}" stroke-width="${W(d0 * 1.1)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    L.forEach((p, i) => {
      const t = i / (L.length - 1), d = d0 + (d1 - d0) * t;
      const q = L[Math.min(i + 1, L.length - 1)], o = L[Math.max(i - 1, 0)];
      const dx = q[0] - o[0], dh = q[1] - o[1], len = Math.hypot(dx, dh) || 1;
      const nx = -dh / len, nh = dx / len;                       // Normale (nach oben, wenn die Linie nach rechts läuft)
      const up = nh < 0 ? -1 : 1;
      const [cx, cy] = P(p[0], p[1]);
      g += `<ellipse cx="${cx}" cy="${cy}" rx="${W(Math.max(d * 0.55, 0.19))}" ry="${W(d * 0.34)}" fill="${farbe}" transform="rotate(${r(-Math.atan2(dh, dx) * 180 / Math.PI)} ${cx} ${cy})"/>`;
      const dl = dorn(t);
      if (dl > 0) { const [ex, ey] = P(p[0] + nx * up * dl, p[1] + nh * up * dl); g += `<line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="${farbe}" stroke-width="${W(d * 0.28)}" stroke-linecap="round"/>`; }
    });
    return { svg: g, L };
  };
  /* Langknochen mit verdickten Gelenkenden */
  K.bein = (pts, d, farbe = KNOCHEN) => {
    let g = "";
    for (let i = 0; i < pts.length - 1; i++) {
      const a = P(...pts[i]), b = P(...pts[i + 1]), w = d * (1 - i * 0.18);
      g += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${farbe}" stroke-width="${W(w)}" stroke-linecap="round"/>`;
      g += `<circle cx="${a[0]}" cy="${a[1]}" r="${W(w * 0.75)}" fill="${farbe}"/>`;
    }
    return g;
  };
  /* Rippen: vom Rückgrat schräg nach unten-hinten gebogen */
  K.rippen = (L, von, bis, tiefe, d, neig = 0.25) => {
    let g = "";
    for (let i = 0; i < L.length; i++) {
      const [px, ph] = L[i];
      if (px < von || px > bis) continue;
      const t = (px - von) / (bis - von), lang = tiefe(t);
      const a = P(px, ph), m = P(px + neig * lang * 0.2 - 0.15, ph - lang * 0.55), e = P(px + neig * lang, ph - lang);
      g += `<path d="M${a[0]} ${a[1]} Q${m[0]} ${m[1]} ${e[0]} ${e[1]}" stroke="${KNOCHEN}" stroke-width="${W(d)}" fill="none" stroke-linecap="round"/>`;
    }
    return g;
  };
  K.stuetze = (mx, mh) => { const a = P(mx, 0), b = P(mx, mh); return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${STAHL}" stroke-width="${W(0.07)}"/>`; };
  K.podest = (m0, m1, hoehe = 0.35) => { const a = P(m0, 0), b = P(m1, 0), h = hoehe * sk; return `<path d="M${r(a[0] - 2)} ${r(a[1] + 1)} L${r(b[0] + 2)} ${r(b[1] + 1)} L${r(b[0] + 2 + h)} ${r(b[1] + 1 + h * 0.6)} L${r(a[0] - 2 - h)} ${r(a[1] + 1 + h * 0.6)} Z" fill="${S.lg("podest", [[0, "#5c5f66"], [1, "#3e4147"]])}"/><path d="M${r(a[0] - 2)} ${r(a[1] + 1)} L${r(b[0] + 2)} ${r(b[1] + 1)}" stroke="#8a8e96" stroke-width=".5"/>`; };
  return K;
};

/* =====================================================================
   KULISSE — Lichthof: Rückwand mit Empore, Boden aus Stein
   ===================================================================== */
const WAND_FUSS = 138;
{
  let k = `<rect width="320" height="${WAND_FUSS}" fill="${S.lg("wand", [[0, "#e9e6df"], [1, "#d6d1c6"]])}"/>`;
  /* Pfeiler und hohe Rundbogenfenster in der Rückwand */
  for (let i = 0; i < 6; i++) {
    const x = 14 + i * 56;
    k += `<rect x="${x - 4}" y="34" width="8" height="${WAND_FUSS - 34}" fill="${S.lg("pfeiler", [[0, "#f4f1ea"], [1, "#cfc9bc"]], 0, 0, 1, 0)}"/>`;
    if (i < 5) k += `<path d="M${x + 12} 112 L${x + 12} 58 Q${x + 28} 44 ${x + 44} 58 L${x + 44} 112 Z" fill="${S.lg("fenster", [[0, "#cfe0ea"], [1, "#a9c1cf"]])}"/><line x1="${x + 28}" y1="50" x2="${x + 28}" y2="112" stroke="#8d9aa4" stroke-width=".6"/><line x1="${x + 12}" y1="84" x2="${x + 44}" y2="84" stroke="#8d9aa4" stroke-width=".6"/>`;
  }
  /* Empore mit Geländer */
  k += `<rect x="0" y="112" width="320" height="4" fill="#bdb6a8"/>`;
  for (let x = 2; x < 320; x += 4) k += `<rect x="${x}" y="104" width=".8" height="8" fill="#4a4d52"/>`;
  k += `<rect x="0" y="103" width="320" height="1.4" fill="#3a3d42"/>`;
  k += `<rect x="0" y="116" width="320" height="${WAND_FUSS - 116}" fill="${S.lg("unterwand", [[0, "#cfc8ba"], [1, "#bdb5a5"]])}"/>`;
  k += `<rect x="0" y="${WAND_FUSS - 2}" width="320" height="2" fill="#8a8476"/>`;
  /* Steinboden in Fluchtperspektive */
  k += `<rect x="0" y="${WAND_FUSS}" width="320" height="${200 - WAND_FUSS}" fill="${S.lg("boden", [[0, "#b9b2a4"], [1, "#9e9688"]])}"/>`;
  for (let i = -14; i <= 14; i++) k += `<line x1="${r(160 + i * 18)}" y1="${WAND_FUSS}" x2="${r(160 + i * 18 * (200 - HY) / (WAND_FUSS - HY))}" y2="200" stroke="#857e70" stroke-width=".35" opacity=".7"/>`;
  for (const y of [141, 145, 150.5, 157.5, 167, 180, 197]) k += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#857e70" stroke-width=".35" opacity=".6"/>`;
  k += `<rect x="0" y="${WAND_FUSS}" width="320" height="${200 - WAND_FUSS}" fill="${S.lg("glanz", [[0, "#fff", 0.12], [0.5, "#fff", 0], [1, "#000", 0.08]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DAS GLASDACH (Stahlbögen über dem Lichthof)
   ===================================================================== */
{
  let k = `<path d="M0 0 L320 0 L320 34 L0 34 Z" fill="${S.lg("himmel", [[0, "#c9dceb"], [1, "#e7eef3"]])}"/>`;
  for (let x = -10; x <= 330; x += 20) {
    let xt = 160 + (x - 160) * 1.7, yt = 0;
    const xa = Math.min(320, Math.max(0, x)), ya = x === xa ? 34 : 34 - 34 * (xa - x) / (xt - x);
    if (xt < 0) { yt = 34 - 34 * (0 - x) / (xt - x); xt = 0; } else if (xt > 320) { yt = 34 - 34 * (320 - x) / (xt - x); xt = 320; }
    k += `<path d="M${r(xa)} ${r(ya)} L${r(xt)} ${r(yt)}" stroke="#4a4f57" stroke-width=".9"/>`;
  }
  for (const y of [6, 14, 22, 28]) k += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#5a5f67" stroke-width=".5"/>`;
  k += `<rect x="0" y="32" width="320" height="3" fill="#3f444b"/>`;
  for (let i = 0; i < 8; i++) { const x = 0 + i * 40; k += `<path d="M${x} 33 Q${x + 20} 26 ${x + 40} 33" stroke="#3f444b" stroke-width=".7" fill="none"/>`; }
  k += `<path d="M30 0 L60 34 L80 34 L50 0 Z M200 0 L232 34 L246 34 L214 0 Z" fill="#fff" opacity=".18"/>`;
  S.teil({ id: "glasdach", de: "das Glasdach", syl: "GLAS-dach", it: "il tetto di vetro", itSyl: "TET-to di VE-tro", en: "glass roof", x: 160, y: 35, kunst: um(160, 35, k),
    tipp: "Durch das Glasdach fällt Tageslicht auf die Skelette." });
}

/* =====================================================================
   2 — DER FUSSABDRUCK (Steinplatte an der Wand)
   ===================================================================== */
{
  const x = 176, y = 92;
  let k = `<rect x="${x - 13}" y="${y - 20}" width="26" height="20" rx="1.2" fill="${S.lg("platte", [[0, "#a8957a"], [1, "#8a765c"]])}"/>`;
  for (let i = 0; i < 20; i++) k += `<circle cx="${r(x - 12 + rnd() * 24)}" cy="${r(y - 19 + rnd() * 18)}" r="${r(0.2 + rnd() * 0.4)}" fill="#6e5d46" opacity=".5"/>`;
  /* dreizehige Fährte eines Raubsauriers */
  const fx = x, fy = y - 6;
  k += `<path d="M${fx - 2} ${fy} Q${fx} ${fy + 2.4} ${fx + 2} ${fy} L${fx + 6} ${fy - 9} L${fx + 4.4} ${fy - 9.6} L${fx + 1} ${fy - 3} L${fx + 0.6} ${fy - 11.6} L${fx - 0.8} ${fy - 11.6} L${fx - 1} ${fy - 3} L${fx - 4.6} ${fy - 9} L${fx - 6} ${fy - 8} Z" fill="#5e4c36"/>`;
  k += `<rect x="${x - 7}" y="${y + 1}" width="14" height="3" fill="#f2efe6"/><text x="${x}" y="${y + 3.2}" font-size="1.7" text-anchor="middle" fill="#333" font-family="Arial">Fährte · Kreidezeit</text>`;
  S.teil({ id: "fussabdruck", de: "der Fußabdruck", syl: "FUSS-ab-druck", it: "l'impronta", itSyl: "im-PRON-ta", en: "footprint", x, y: y + 4, kunst: um(x, y + 4, k),
    tipp: "Ein Raubsaurier lief durch Schlamm. Der Schlamm wurde zu Stein — die Spur blieb." });
}

/* =====================================================================
   3 — DER STEGOSAURUS (Skelett, hinten links)
   ===================================================================== */
{
  const yb = 141.6, sk = s(yb), x0 = 34;        // 6 je Meter
  const K = skelett(x0, yb, sk);
  let k = K.podest(-4.4, 5.2, 0.3);
  const sp = K.wirbel([[-3.6, 1.0], [-2.8, 1.4], [-1.8, 2.1], [-0.4, 2.7], [0.6, 2.85], [2.2, 2.5], [3.6, 1.8], [5.0, 1.2]], 0.32, 0.12, (t) => (t > 0.2 && t < 0.7 ? 0.25 : 0));
  /* Platten: zwei versetzte Reihen, über den Hüften am größten */
  let pl = "";
  for (let i = 0; i < 16; i++) {
    const t = i / 15, j = Math.round(t * (sp.L.length - 1) * 0.86 + 2), [px, ph] = sp.L[Math.min(j, sp.L.length - 1)];
    const h = 0.25 + Math.sin(t * Math.PI * 0.95) * 0.75, w = h * 0.7, [bx, by] = K.P(px, ph + 0.15), lean = i % 2 ? 0.12 : -0.08;
    pl += `<path d="M${r(bx - w * sk * 0.45)} ${by} Q${r(bx - w * sk * 0.5 + lean * sk)} ${r(by - h * sk * 0.8)} ${r(bx + lean * sk * 1.6)} ${r(by - h * sk)} Q${r(bx + w * sk * 0.55 + lean * sk)} ${r(by - h * sk * 0.6)} ${r(bx + w * sk * 0.45)} ${by} Z" fill="${i % 2 ? KNOCHEN_D : KNOCHEN}" stroke="#6a4f32" stroke-width=".2"/>`;
  }
  k += pl;
  /* Beine, Rippen, Schädel, Schwanzstacheln */
  k += K.bein([[-1.8, 1.9], [-2.0, 1.0], [-2.2, 0.25], [-2.45, 0]], 0.2, KNOCHEN_D) + K.bein([[0.6, 2.5], [0.9, 1.3], [0.6, 0.35], [0.4, 0]], 0.26, KNOCHEN_D);
  k += K.rippen(sp.L, -1.8, 1.8, (t) => 0.9 + Math.sin(t * Math.PI) * 0.6, 0.07);
  k += sp.svg;
  k += K.bein([[-1.7, 1.9], [-1.95, 1.0], [-2.1, 0.25], [-2.35, 0]], 0.22) + K.bein([[0.4, 2.5], [0.7, 1.3], [0.45, 0.35], [0.2, 0]], 0.3);
  const [hx, hy] = K.P(-3.9, 0.95);
  k += `<path d="M${hx + 3} ${hy - 1.6} L${hx - 2.6} ${hy - 0.4} L${hx - 3} ${hy + 0.6} L${hx + 2.6} ${hy + 1.2} Z" fill="${KNOCHEN}"/><circle cx="${hx + 1.4}" cy="${hy - 0.4}" r=".5" fill="#4a3624"/>`;
  for (const [a, l] of [[-50, 0.7], [-25, 0.8], [25, 0.8], [55, 0.7]]) { const [tx, ty] = K.P(4.6, 1.4), rad = (a - 90) * Math.PI / 180; k += `<line x1="${tx}" y1="${ty}" x2="${r(tx + Math.cos(rad) * l * sk + 2)}" y2="${r(ty + Math.sin(rad) * l * sk)}" stroke="${KNOCHEN}" stroke-width=".8" stroke-linecap="round"/>`; }
  k += K.stuetze(-0.5, 2.6) + K.stuetze(3, 2.1);
  S.teil({ id: "stegosaurus", de: "der Stegosaurus", syl: "Ste-go-SAU-rus", it: "lo stegosauro", itSyl: "ste-go-SAU-ro", en: "stegosaurus", x: x0, y: yb, steht: true, kunst: um(x0, yb, k),
    tipp: "Etwa 9 Meter lang. Zwei Reihen Platten auf dem Rücken und vier Stacheln am Schwanz. Er lebte im Jura." });
}

/* =====================================================================
   4 — DER BRACHIOSAURUS (das große Skelett in der Mitte)
   ===================================================================== */
{
  const yb = 144, sk = s(yb), x0 = 88;           // 7,5 je Meter
  const K = skelett(x0, yb, sk);
  let k = K.podest(-4.2, 8.6, 0.35);
  /* hintere (fernere) Beine dunkler */
  k += K.bein([[0.6, 6.2], [0.9, 4.1], [0.8, 1.6], [0.7, 0.3], [0.5, 0]], 0.42, KNOCHEN_D);
  k += K.bein([[6.6, 4.8], [6.4, 2.7], [6.8, 0.9], [6.4, 0]], 0.5, KNOCHEN_D);
  /* Rückgrat vom Schwanz bis zum Kopf */
  const sp = K.wirbel([[13.4, 2.6], [11.4, 3.5], [9.2, 4.5], [7.2, 5.2], [5, 5.6], [2.6, 6.1], [0.6, 6.7], [-0.4, 7.6], [-1.2, 9.0], [-1.9, 10.6], [-2.4, 12.0], [-2.7, 12.9]],
    0.5, 0.16, (t) => (t < 0.45 ? 0.25 + (t > 0.25 ? 0.25 : 0) : t < 0.62 ? 0.35 : 0.12));
  /* Rippen unter dem Rücken */
  k += K.rippen(sp.L, 0.7, 6.4, (t) => 2.4 + Math.sin(t * Math.PI) * 0.8 - t * 0.6, 0.12, 0.3);
  k += sp.svg;
  /* Schulterblatt und Becken */
  const sb = [K.P(0.4, 6.8), K.P(1.3, 6.1), K.P(0.5, 5.0), K.P(0.0, 5.5)];
  k += `<path d="M${sb[0].join(" ")} Q${sb[1].join(" ")} ${sb[2].join(" ")} L${sb[3].join(" ")} Z" fill="${KNOCHEN}" stroke="${KNOCHEN_D}" stroke-width=".3"/>`;
  const be = [K.P(5.5, 5.7), K.P(7.4, 5.6), K.P(6.7, 4.7), K.P(5.9, 4.7)];
  k += `<path d="M${be[0].join(" ")} Q${K.P(6.5, 6.2).join(" ")} ${be[1].join(" ")} L${be[2].join(" ")} L${be[3].join(" ")} Z" fill="${KNOCHEN}" stroke="${KNOCHEN_D}" stroke-width=".3"/><ellipse cx="${K.P(6.3, 4.9)[0]}" cy="${K.P(6.3, 4.9)[1]}" rx="1.2" ry="1" fill="#4a3624"/>`;
  k += K.bein([[6.0, 4.6], [5.4, 3.3]], 0.28) + K.bein([[7.0, 4.6], [7.6, 3.5]], 0.26);
  /* nahe Beine */
  k += K.bein([[0.2, 6.0], [0.4, 4.0], [0.25, 1.6], [0.15, 0.3], [-0.1, 0]], 0.48);
  k += K.bein([[6.2, 4.7], [6.0, 2.7], [6.4, 0.9], [6.0, 0]], 0.56);
  /* Schädel: hoher Nasenbogen, Augenhöhle, Zähne */
  const [kx, ky] = K.P(-2.8, 13.0);
  k += `<path d="M${kx + 1.2} ${ky + 1.2} Q${kx + 0.6} ${ky - 2.6} ${kx - 2.4} ${ky - 3.2} Q${kx - 4.6} ${ky - 3} ${kx - 5.6} ${ky - 0.8} Q${kx - 6.4} ${ky + 0.8} ${kx - 5.6} ${ky + 1.8} L${kx - 1} ${ky + 2.4} Z" fill="${KNOCHEN}"/>`;
  k += `<ellipse cx="${kx - 1.4}" cy="${ky - 0.8}" rx=".9" ry=".8" fill="#3e2c1c"/><ellipse cx="${kx - 3.2}" cy="${ky - 1.8}" rx="1.1" ry=".7" fill="#3e2c1c"/>`;
  for (let i = 0; i < 6; i++) k += `<line x1="${r(kx - 5.4 + i * 0.7)}" y1="${r(ky + 1.4)}" x2="${r(kx - 5.4 + i * 0.7)}" y2="${r(ky + 2.2)}" stroke="#efe4cc" stroke-width=".3"/>`;
  k += `<path d="M${kx - 5.2} ${ky + 2.2} L${kx - 0.6} ${ky + 2.6} L${kx - 0.4} ${ky + 3.4} L${kx - 4.6} ${ky + 3} Z" fill="${KNOCHEN_D}"/>`;
  /* Stahlstützen */
  k += K.stuetze(2.6, 6.0) + K.stuetze(9.4, 4.4) + K.stuetze(12, 3.2) + K.stuetze(-1.4, 9.3);
  S.teil({ id: "brachiosaurus", de: "der Brachiosaurus", syl: "Bra-chi-o-SAU-rus", it: "il brachiosauro", itSyl: "bra-chio-SAU-ro", en: "brachiosaurus", x: x0, y: yb, steht: true, kunst: um(x0, yb, k),
    tipp: "Über 13 Meter hoch — so hoch wie ein Haus mit vier Stockwerken. Die Vorderbeine sind länger als die hinteren." });
}

/* =====================================================================
   5 — DER PTERANODON (hängt unter dem Glasdach)
   ===================================================================== */
{
  const x = 262, y = 52, sk = 8.4;
  let k = "";
  for (const dx of [-24, 24]) k += `<line x1="${x + dx * 0.7}" y1="35" x2="${x + dx * 0.7}" y2="${y - 4}" stroke="#555" stroke-width=".2"/>`;
  const fl = (sg) => {
    const sh = [x + sg * 2, y - 1], el = [x + sg * 9, y - 4], wr = [x + sg * 15, y - 1], tip = [x + sg * 30, y + 1.6];
    let g = `<path d="M${sh.join(" ")} Q${x + sg * 14} ${y + 4} ${tip.join(" ")} L${wr.join(" ")} L${el.join(" ")} Z" fill="#c8b48e" opacity=".35"/>`;
    g += `<path d="M${sh.join(" ")} L${el.join(" ")} L${wr.join(" ")} L${tip.join(" ")}" stroke="${KNOCHEN}" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    g += `<path d="M${wr.join(" ")} l${sg * 1.6} -1.6 M${wr.join(" ")} l${sg * 1.2} -2 M${wr.join(" ")} l${sg * 0.6} -2.2" stroke="${KNOCHEN_D}" stroke-width=".35"/>`;
    g += `<path d="M${x + sg * 1.4} ${y + 2.4} L${x + sg * 4} ${y + 6} L${x + sg * 5} ${y + 6.6}" stroke="${KNOCHEN_D}" stroke-width=".55" fill="none"/>`;
    return g;
  };
  k += fl(-1) + fl(1);
  k += `<ellipse cx="${x}" cy="${y + 0.6}" rx="2.2" ry="3" fill="${KNOCHEN}"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${x - 2} ${y - 0.6 + i * 1.2} q2 .8 4 0" stroke="${KNOCHEN_D}" stroke-width=".25" fill="none"/>`;
  /* Kopf mit langem Schnabel und nach hinten ragendem Kamm (im Profil, schaut nach links) */
  k += `<path d="M${x - 0.6} ${y - 2.4} L${x - 1.6} ${y - 4.4} L${x - 12} ${y - 3.6} L${x - 1.8} ${y - 3.2} Z" fill="${KNOCHEN}"/><path d="M${x - 1.6} ${y - 4.4} L${x + 6} ${y - 8.4} L${x + 0.4} ${y - 4.2} Z" fill="${KNOCHEN}"/><circle cx="${x - 1.8}" cy="${y - 3.8}" r=".35" fill="#3e2c1c"/>`;
  k += `<path d="M${x - 0.6} ${y + 3.4} L${x - 0.4} ${y + 6}" stroke="${KNOCHEN_D}" stroke-width=".3"/>`;
  void sk;
  S.teil({ id: "pteranodon", de: "der Pteranodon", syl: "Pte-ra-NO-don", it: "lo pteranodonte", itSyl: "pte-ra-no-DON-te", en: "pteranodon", x, y: y + 7, kunst: um(x, y + 7, k),
    tipp: "Kein Dinosaurier, sondern ein Flugsaurier — 7 Meter Spannweite. Hier hängt er an Seilen unter dem Dach." });
}

/* =====================================================================
   6 — DER TRICERATOPS (Skelett, rechts hinter dem T. rex)
   ===================================================================== */
{
  const yb = 143.2, sk = s(yb), x0 = 196;         // 7 je Meter
  const K = skelett(x0, yb, sk);
  let k = K.podest(-4.6, 5.4, 0.3);
  k += K.bein([[-1.4, 1.8], [-1.75, 0.95], [-1.6, 0.2], [-1.85, 0]], 0.3, KNOCHEN_D) + K.bein([[2.0, 2.3], [2.4, 1.1], [2.0, 0.25], [1.8, 0]], 0.34, KNOCHEN_D);
  const sp = K.wirbel([[5.2, 0.9], [3.6, 1.7], [2.0, 2.45], [0.4, 2.6], [-1.0, 2.25], [-1.9, 1.95]], 0.36, 0.14, (t) => (t > 0.3 && t < 0.85 ? 0.3 : 0.1));
  k += K.rippen(sp.L, -1.4, 2.0, (t) => 1.1 + Math.sin(t * Math.PI) * 0.45, 0.09, 0.15);
  k += sp.svg;
  k += K.bein([[-1.6, 1.8], [-1.95, 0.95], [-1.75, 0.2], [-2.0, 0]], 0.32) + K.bein([[1.8, 2.3], [2.2, 1.1], [1.8, 0.25], [1.55, 0]], 0.38);
  /* Schädel mit Nackenschild, zwei Stirnhörnern, Nasenhorn, Schnabel */
  const F = (a, b) => K.P(a, b).join(" ");
  k += `<path d="M${F(-1.9, 3.3)} Q${F(-1.4, 2.4)} ${F(-1.8, 1.3)} L${F(-2.6, 1.2)} L${F(-3.6, 1.1)} L${F(-4.3, 1.25)} Q${F(-4.2, 1.7)} ${F(-3.6, 1.9)} L${F(-2.9, 2.1)} L${F(-2.4, 2.9)} Z" fill="${KNOCHEN}"/>`;
  for (let i = 0; i < 5; i++) { const t = i / 4, [px, py] = K.P(-1.9 + Math.sin(t * Math.PI) * 0.35, 3.3 - t * 2.0); k += `<circle cx="${px}" cy="${py}" r=".55" fill="${KNOCHEN_D}"/>`; }
  k += `<ellipse cx="${K.P(-2.2, 2.4)[0]}" cy="${K.P(-2.2, 2.4)[1]}" rx="1.2" ry="1.8" fill="#4a3624" opacity=".6"/>`;
  k += `<path d="M${F(-2.9, 2.15)} Q${F(-3.5, 2.7)} ${F(-4.1, 2.9)} L${F(-3.0, 2.0)} Z" fill="#efe2c4" stroke="${KNOCHEN_D}" stroke-width=".2"/>`;
  k += `<path d="M${F(-2.7, 2.05)} Q${F(-3.3, 2.65)} ${F(-3.8, 2.95)} L${F(-2.85, 1.95)} Z" fill="${KNOCHEN_D}"/>`;
  k += `<path d="M${F(-3.7, 1.75)} L${F(-3.85, 2.05)} L${F(-3.95, 1.7)} Z" fill="#efe2c4"/><circle cx="${K.P(-3.0, 1.85)[0]}" cy="${K.P(-3.0, 1.85)[1]}" r=".5" fill="#3e2c1c"/>`;
  k += `<path d="M${F(-3.7, 1.1)} L${F(-2.6, 1.0)} L${F(-2.4, 1.3)} L${F(-3.8, 1.35)} Z" fill="${KNOCHEN_D}"/>`;
  k += K.stuetze(0.5, 2.4) + K.stuetze(3.6, 1.5);
  S.teil({ id: "triceratops", de: "der Triceratops", syl: "Tri-ce-RA-tops", it: "il triceratopo", itSyl: "tri-ce-RA-to-po", en: "triceratops", x: x0, y: yb, steht: true, kunst: um(x0, yb, k),
    tipp: "Etwa 9 Meter lang. Drei Hörner und ein großer Nackenschild aus Knochen." });
}

/* =====================================================================
   7 — DER TYRANNOSAURUS (Skelett im Schritt, rechts)
   ===================================================================== */
{
  const yb = 147, sk = s(yb), x0 = 268;          // 9,4 je Meter
  const K = skelett(x0, yb, sk);
  let k = K.podest(-4.6, 5.0, 0.3);
  /* hinteres Bein (zurückgesetzt, Ferse gehoben) */
  k += K.bein([[0.2, 3.5], [0.7, 2.0], [1.5, 0.75], [1.2, 0.05]], 0.34, KNOCHEN_D);
  const sp = K.wirbel([[4.8, 2.7], [3.2, 3.4], [1.6, 3.8], [0.1, 3.95], [-1.3, 3.7], [-2.4, 3.35], [-2.9, 3.6], [-3.2, 4.0]], 0.36, 0.12, (t) => (t > 0.15 && t < 0.8 ? 0.4 : 0.15));
  k += K.rippen(sp.L, -2.4, -0.1, (t) => 1.7 - t * 0.6, 0.09, 0.25);
  k += sp.svg;
  /* Becken mit „Schambeinstiefel“ */
  k += `<path d="M${K.P(-0.6, 4.2).join(" ")} Q${K.P(0.3, 4.6).join(" ")} ${K.P(1.0, 4.0).join(" ")} L${K.P(0.5, 3.4).join(" ")} L${K.P(-0.5, 3.4).join(" ")} Z" fill="${KNOCHEN}"/>`;
  k += K.bein([[-0.2, 3.5], [-0.7, 2.3]], 0.2) + `<ellipse cx="${K.P(-0.8, 2.25)[0]}" cy="${K.P(-0.8, 2.25)[1]}" rx="${r(0.4 * sk)}" ry="${r(0.12 * sk)}" fill="${KNOCHEN}"/>`;
  /* Ärmchen mit zwei Fingern */
  k += K.bein([[-2.3, 3.0], [-2.65, 2.55], [-2.95, 2.6]], 0.1);
  /* vorderes Bein (Standbein, Schritt nach vorn) */
  k += K.bein([[0.0, 3.5], [-0.75, 2.05], [-0.25, 0.7], [-0.9, 0.02]], 0.4);
  k += `<path d="M${K.P(-0.9, 0.05).join(" ")} l-2.8 .4 M${K.P(-0.9, 0.05).join(" ")} l-2 1.2" stroke="${KNOCHEN}" stroke-width=".7" stroke-linecap="round"/>`;
  /* Schädel: groß, mit Schläfenfenstern, Augenhöhle und Dolchzähnen */
  const F = (a, b) => K.P(a, b).join(" ");
  k += `<path d="M${F(-3.0, 4.35)} Q${F(-3.6, 4.65)} ${F(-4.4, 4.3)} L${F(-4.75, 3.85)} L${F(-4.65, 3.55)} L${F(-3.2, 3.45)} L${F(-2.95, 3.75)} Z" fill="${KNOCHEN}"/>`;
  k += `<path d="M${F(-4.65, 3.5)} L${F(-3.15, 3.38)} L${F(-3.05, 3.05)} L${F(-4.4, 3.25)} Z" fill="${KNOCHEN_D}"/>`;
  k += `<ellipse cx="${K.P(-3.35, 3.95)[0]}" cy="${K.P(-3.35, 3.95)[1]}" rx="1.4" ry="1.1" fill="#3e2c1c"/><ellipse cx="${K.P(-3.85, 4.05)[0]}" cy="${K.P(-3.85, 4.05)[1]}" rx="1" ry="1.3" fill="#3e2c1c"/><ellipse cx="${K.P(-4.3, 3.85)[0]}" cy="${K.P(-4.3, 3.85)[1]}" rx="1.2" ry=".6" fill="#3e2c1c" opacity=".7"/>`;
  for (let i = 0; i < 8; i++) { const [tx, ty] = K.P(-4.6 + i * 0.17, 3.52 - i * 0.008); k += `<path d="M${tx} ${ty} l.3 1.1 l.3 -1.1 Z" fill="#f4ead2"/>`; }
  k += K.stuetze(-1.3, 3.6) + K.stuetze(2.4, 3.6) + K.stuetze(4.0, 3.0);
  const Q = (a, h) => K.P(a, h).map(Number);
  const unter = [
    { id: "schaedel", de: "der Schädel", syl: "SCHÄ-del", it: "il cranio", itSyl: "CRA-nio", en: "skull", p: Q(-3.85, 3.4), f: [-8, -10, 16, 11], tipp: "Der Schädel des T. rex ist fast anderthalb Meter lang." },
    { id: "rippe", de: "die Rippe", syl: "RIP-pe", it: "la costola", itSyl: "CO-sto-la", en: "rib", p: Q(-1.5, 2.2), f: [-6, -12, 12, 12.4], tipp: "Die Rippen schützen Herz und Lunge." },
    { id: "wirbel", de: "der Wirbel", syl: "WIR-bel", it: "la vertebra", itSyl: "VER-te-bra", en: "vertebra", p: Q(2.6, 3.2), f: [-7, -8, 14, 8.6], tipp: "Viele Wirbel hintereinander bilden die Wirbelsäule — bis in die Schwanzspitze." },
  ].map((u) => ({ id: u.id, de: u.de, syl: u.syl, it: u.it, itSyl: u.itSyl, en: u.en, tipp: u.tipp, x: u.p[0], y: u.p[1], kunst: flaeche(...u.f) }));
  S.teil({ zoom: { x: 214, y: 94, w: 96, h: 64 }, unter, id: "tyrannosaurus", de: "der Tyrannosaurus", syl: "Ty-ran-no-SAU-rus", it: "il tirannosauro", itSyl: "ti-ran-no-SAU-ro", en: "tyrannosaurus", x: x0, y: yb, steht: true, kunst: um(x0, yb, k),
    tipp: "Etwa 12 Meter lang. Die Arme hatten nur zwei Finger. Seine Zähne waren so lang wie Bananen." });
}

/* =====================================================================
   8 — DER ANKYLOSAURUS (lebensechtes Modell, links)
   ===================================================================== */
{
  const yb = 151, sk = s(yb), x0 = 116;          // 11,9 je Meter
  const P = (a, h) => [r(x0 + a * sk), r(yb - h * sk)];
  const F = (a, h) => P(a, h).join(" ");
  let k = `<path d="M${r(x0 - 3.6 * sk)} ${yb + 1} L${r(x0 + 3.4 * sk)} ${yb + 1} L${r(x0 + 3.6 * sk)} ${yb + 3.4} L${r(x0 - 3.8 * sk)} ${yb + 3.4} Z" fill="#7a7a6a"/><path d="M${r(x0 - 3.6 * sk)} ${yb + 1} L${r(x0 + 3.4 * sk)} ${yb + 1}" stroke="#9a9a88" stroke-width=".5"/>`;
  k += schatten(x0, yb, 3 * sk, 1.6, 0.35);
  const HAUT = S.lg("anky", [[0, "#8a7a52"], [0.5, "#6e603e"], [1, "#4e4430"]]);
  /* Beine: kurz und stämmig */
  for (const [a, f] of [[-1.5, "#4e4430"], [1.4, "#4e4430"], [-1.2, HAUT], [1.7, HAUT]]) k += `<path d="M${F(a - 0.25, 0.9)} L${F(a + 0.25, 0.9)} L${F(a + 0.3, 0)} L${F(a - 0.35, 0)} Z" fill="${f}"/>`;
  /* Rumpf: breit und flach, gepanzert */
  k += `<path d="M${F(-2.2, 0.8)} Q${F(-2.3, 1.55)} ${F(-1, 1.75)} Q${F(0.5, 1.85)} ${F(2, 1.55)} Q${F(2.7, 1.2)} ${F(2.6, 0.8)} Q${F(0.2, 0.55)} ${F(-2.2, 0.8)} Z" fill="${HAUT}"/>`;
  /* Knochenplatten (Osteoderme) in Reihen, Seitenstacheln */
  for (let row = 0; row < 3; row++) for (let i = 0; i < 9; i++) { const a = -1.9 + i * 0.5 + (row % 2) * 0.25, h = 1.6 - row * 0.28 - Math.abs(a - 0.2) * 0.06; const [px, py] = P(a, h); k += `<ellipse cx="${px}" cy="${py}" rx="1.4" ry=".9" fill="#a8946a" stroke="#4e4430" stroke-width=".25"/><circle cx="${px}" cy="${r(py - 0.2)}" r=".35" fill="#c9b88e"/>`; }
  for (let i = 0; i < 6; i++) { const [px, py] = P(-1.8 + i * 0.75, 0.85); k += `<path d="M${r(px - 1)} ${py} L${px} ${r(py + 2.2)} L${r(px + 1)} ${py} Z" fill="#c9b88e"/>`; }
  /* Schwanz mit Knochenkeule */
  k += `<path d="M${F(2.5, 1.2)} Q${F(3.4, 1.0)} ${F(4.2, 0.7)} L${F(4.2, 0.5)} Q${F(3.4, 0.75)} ${F(2.5, 0.85)} Z" fill="${HAUT}"/>`;
  k += `<ellipse cx="${P(4.45, 0.6)[0]}" cy="${P(4.45, 0.6)[1]}" rx="${r(0.4 * sk)}" ry="${r(0.22 * sk)}" fill="#8a7a52" stroke="#4e4430" stroke-width=".3"/>`;
  /* Kopf: breit, kurze Hörner hinten */
  k += `<path d="M${F(-2.1, 1.2)} Q${F(-2.7, 1.3)} ${F(-3.1, 1.05)} L${F(-3.2, 0.8)} Q${F(-2.7, 0.65)} ${F(-2.1, 0.8)} Z" fill="${HAUT}"/>`;
  k += `<path d="M${F(-2.3, 1.25)} l1.4 -1.2 l-.2 1.4 Z" fill="#c9b88e"/><circle cx="${P(-2.75, 1.05)[0]}" cy="${P(-2.75, 1.05)[1]}" r=".45" fill="#1d1a14"/>`;
  k += `<path d="M${F(-1.6, 1.7)} Q${F(0.4, 1.95)} ${F(2.2, 1.6)}" stroke="#fff" stroke-width=".5" opacity=".2" fill="none"/>`;
  S.teil({ id: "ankylosaurus", de: "der Ankylosaurus", syl: "An-ky-lo-SAU-rus", it: "l'anchilosauro", itSyl: "an-chi-lo-SAU-ro", en: "ankylosaurus", x: x0, y: yb + 3, steht: true, kunst: um(x0, yb + 3, k),
    tipp: "Etwa 8 Meter lang, gepanzert wie ein Panzer. Am Schwanz eine Keule aus Knochen." });
}

/* =====================================================================
   9 — DIE ZEITLEISTE (Pult vorn, Lupe → Eiszeit)
   ===================================================================== */
{
  const x = 150, y = 196;
  let k = schatten(x, y, 34, 2, 0.35);
  k += `<path d="M${x - 30} ${y} L${x - 28} ${y - 24} L${x + 28} ${y - 24} L${x + 30} ${y} Z" fill="${S.lg("pult", [[0, "#3e4148"], [1, "#24262b"]])}"/>`;
  k += `<path d="M${x - 33} ${y - 24} L${x + 33} ${y - 24} L${x + 30} ${y - 34} L${x - 30} ${y - 34} Z" fill="#f4f1ea"/>`;
  /* Zeitstrahl: Trias, Jura, Kreide, Paläogen/Neogen, Eiszeit */
  const ab = [["Trias", "#9a6fb0", 0.22], ["Jura", "#4f8fc8", 0.26], ["Kreide", "#6fae4a", 0.32], ["Neuzeit", "#e8c04a", 0.13], ["Eiszeit", "#bfe0f2", 0.07]];
  let t0 = 0;
  for (const [n, f, w] of ab) {
    const a = x - 29 + t0 * 58, b = a + w * 58;
    k += `<path d="M${r(a)} ${y - 29} L${r(b)} ${y - 29} L${r(b + 0.5)} ${y - 26} L${r(a + 0.5)} ${y - 26} Z" fill="${f}"/><text x="${r((a + b) / 2)}" y="${y - 24.6}" font-size="1.5" text-anchor="middle" fill="#333" font-family="Arial">${n}</text>`;
    t0 += w;
  }
  k += `<text x="${x}" y="${y - 16}" font-size="3" text-anchor="middle" fill="#f1ece0" font-family="Arial" font-weight="bold">Zeitleiste der Erdgeschichte</text><text x="${x}" y="${y - 11.6}" font-size="2" text-anchor="middle" fill="#c9c3b4" font-family="Arial">vor 250 Millionen Jahren … heute</text>`;
  /* kleine Umrisse über den Abschnitten: Sauropode, T. rex, Mammut */
  k += `<path d="M${x - 14} ${y - 29} q1 -2 3 -2 q2 -2 1.6 -4 l.6 0 q.4 2.6 -1 4.4 q2 .2 3 1.6 Z" fill="#2f5f8a"/>`;
  k += `<path d="M${x + 4} ${y - 29} l.6 -2 q1.6 -1 3.6 -1.2 l1 -.8 l.4 .6 l-.8 .8 q-1 1.6 -2.6 1.8 l.4 .8 Z" fill="#3f6a2a"/>`;
  k += `<path d="M${x + 25} ${y - 29} q-.2 -2.4 1.6 -2.6 q1.8 0 2 1.4 q.4 1 -.2 1.6 Z" fill="#5a7a8a"/>`;
  S.teil({ id: "zeitleiste", de: "die Zeitleiste", syl: "ZEIT-leis-te", it: "la linea del tempo", itSyl: "LI-ne-a del TEM-po", en: "timeline", x, y, steht: true, kunst: um(x, y, k), lupe: "eiszeit",
    tipp: "Die Dinosaurier starben vor 66 Millionen Jahren aus. Das Mammut lebte erst 65 Millionen Jahre später. Antippen führt in die Eiszeit." });
}

/* =====================================================================
   10 — DIE VITRINE (Lupe: Ei, Zahn, Ammonit, Kralle)
   ===================================================================== */
{
  const x0 = 6, x1 = 84, y = 198, top = 164;
  const unter = [];
  let k = schatten((x0 + x1) / 2, y, 40, 2, 0.35);
  k += `<rect x="${x0}" y="${top + 12}" width="${x1 - x0}" height="${y - top - 12}" fill="${S.lg("unterbau", [[0, "#4a4d54"], [1, "#2c2e33"]])}"/>`;
  k += `<rect x="${x0 + 1}" y="${top + 10}" width="${x1 - x0 - 2}" height="2.4" fill="#d8d2c2"/>`;
  k += `<rect x="${x0 + 1}" y="${top}" width="${x1 - x0 - 2}" height="10" fill="#f1ece0"/>`;
  /* Dinosaurierei (Nest) */
  const ex = 18, ey = top + 10.4;
  k += `<ellipse cx="${ex}" cy="${ey - 2.6}" rx="2.4" ry="3.2" fill="${S.rg("ei", [[0, "#d8ccb2"], [1, "#9a8a6a"]], 0.35, 0.3, 0.8)}"/><ellipse cx="${ex + 4}" cy="${ey - 2.2}" rx="2.2" ry="2.8" fill="#a8977a"/>`;
  for (let i = 0; i < 8; i++) k += `<circle cx="${r(ex - 1.6 + rnd() * 3.2)}" cy="${r(ey - 4.6 + rnd() * 4)}" r=".15" fill="#6e5e44"/>`;
  unter.push({ id: "ei", de: "das Ei", syl: "EI", it: "l'uovo", itSyl: "UO-vo", en: "egg", x: ex + 1.6, y: ey, kunst: flaeche(-4.4, -6.6, 9, 6.8), tipp: "Dinosaurier legten Eier — manche so groß wie ein Fußball." });
  /* Zahn eines T. rex */
  const zx = 36, zy = top + 10.4;
  k += `<path d="M${zx - 1.4} ${zy} Q${zx - 1.2} ${zy - 5} ${zx + 0.6} ${zy - 8} Q${zx + 1.2} ${zy - 4} ${zx + 1.4} ${zy} Z" fill="${S.lg("zahn", [[0, "#e6d8b4"], [1, "#8a6a3e"]], 0, 0, 1, 0)}"/><path d="M${zx + 0.6} ${zy - 7.6} L${zx + 1.1} ${zy - 2}" stroke="#6a4f2a" stroke-width=".15"/>`;
  unter.push({ id: "zahn", de: "der Zahn", syl: "ZAHN", it: "il dente", itSyl: "DEN-te", en: "tooth", x: zx, y: zy, kunst: flaeche(-2.8, -8.6, 5.6, 8.8), tipp: "Ein Zahn vom Tyrannosaurus — mit Wurzel fast 30 Zentimeter lang." });
  /* Ammonit */
  const ax = 54, ay = top + 6.4;
  k += `<circle cx="${ax}" cy="${ay}" r="3.8" fill="${S.rg("ammonit", [[0, "#c9b07a"], [1, "#7a6238"]])}"/>`;
  let sp = `M${ax} ${ay}`;
  for (let i = 1; i <= 40; i++) { const a = i * 0.45, rr = 0.1 * Math.exp(a * 0.165); sp += ` L${r(ax + Math.cos(a) * rr)} ${r(ay + Math.sin(a) * rr)}`; }
  k += `<path d="${sp}" stroke="#5a4628" stroke-width=".3" fill="none"/>`;
  for (let i = 0; i < 14; i++) { const a = i * Math.PI / 7; k += `<line x1="${r(ax + Math.cos(a) * 2.4)}" y1="${r(ay + Math.sin(a) * 2.4)}" x2="${r(ax + Math.cos(a) * 3.7)}" y2="${r(ay + Math.sin(a) * 3.7)}" stroke="#6a5432" stroke-width=".2"/>`; }
  unter.push({ id: "ammonit", de: "der Ammonit", syl: "Am-mo-NIT", it: "l'ammonite", itSyl: "am-mo-NI-te", en: "ammonite", x: ax, y: ay + 4, kunst: flaeche(-4.4, -8.4, 8.8, 8.8), tipp: "Kein Dinosaurier: ein Tintenfisch-Verwandter mit Schneckenhaus. Er lebte im Meer." });
  /* Sichelkralle */
  const kx = 70, ky = top + 9.6;
  k += `<path d="M${kx - 2.6} ${ky} Q${kx - 3.2} ${ky - 5.4} ${kx + 1.6} ${ky - 6} Q${kx - 1.4} ${ky - 4} ${kx - 0.6} ${ky} Z" fill="${S.lg("kralle", [[0, "#3e3428"], [1, "#7a6648"]], 0, 0, 1, 0)}"/>`;
  unter.push({ id: "kralle", de: "die Kralle", syl: "KRAL-le", it: "l'artiglio", itSyl: "ar-TI-glio", en: "claw", x: kx - 0.6, y: ky + 0.4, kunst: flaeche(-3.4, -6.8, 6.6, 7.2), tipp: "Die Sichelkralle vom Velociraptor: Er hielt sie beim Laufen hoch." });
  /* Schildchen */
  for (const [lx, t] of [[19.6, "Ei"], [36, "Zahn"], [54, "Ammonit"], [69, "Kralle"]]) k += `<rect x="${lx - 4}" y="${top + 13}" width="8" height="2" fill="#fff"/><text x="${lx}" y="${top + 14.5}" font-size="1.3" text-anchor="middle" fill="#333" font-family="Arial">${t}</text>`;
  /* Glashaube */
  k += `<path d="M${x0 + 1} ${top + 10} L${x0 + 1} ${top - 8} L${x1 - 1} ${top - 8} L${x1 - 1} ${top + 10}" fill="none" stroke="#c5d4da" stroke-width=".5"/>`;
  S.teil({ id: "vitrine", de: "die Vitrine", syl: "vi-TRI-ne", it: "la vetrina", itSyl: "ve-TRI-na", en: "display case", x: (x0 + x1) / 2, y, steht: true, kunst: um((x0 + x1) / 2, y, k),
    zoom: { x: x0 - 2, y: top - 12, w: x1 - x0 + 4, h: 54 }, unter,
    tipp: "In der Vitrine liegen echte Fossilien." });
  S.davor(`<rect x="${x0 + 1}" y="${top - 8}" width="${x1 - x0 - 2}" height="18" fill="${S.lg("glas", [[0, "#ffffff", 0.22], [1, "#e6f2f6", 0.06]], 0, 0, 1, 1)}"/><path d="M${x0 + 8} ${top + 9} L${x0 + 16} ${top - 7} L${x0 + 20} ${top - 7} L${x0 + 12} ${top + 9} Z" fill="#fff" opacity=".22"/>`);
}

/* =====================================================================
   11 — DER VELOCIRAPTOR (gefiedertes Modell), 12 — DER VATER, 13 — DAS KIND
   ===================================================================== */
{
  const yb = 170, sk = s(yb), x0 = 276;          // 23,8 je Meter
  const P = (a, h) => [r(x0 + a * sk), r(yb - h * sk)];
  const F = (a, h) => P(a, h).join(" ");
  let k = `<path d="M${r(x0 - 1.2 * sk)} ${yb} L${r(x0 + 1.3 * sk)} ${yb} L${r(x0 + 1.4 * sk)} ${yb + 4} L${r(x0 - 1.3 * sk)} ${yb + 4} Z" fill="#5c5f66"/><rect x="${x0 - 6}" y="${yb + 1}" width="12" height="2.2" fill="#e9e5da"/><text x="${x0}" y="${yb + 2.6}" font-size="1.5" text-anchor="middle" fill="#333" font-family="Arial">Velociraptor</text>`;
  k += schatten(x0, yb, 22, 1.2, 0.35);
  const FED = S.lg("feder", [[0, "#a07a4c"], [0.55, "#7a5632"], [1, "#4e341c"]]);
  const BEIN = "#6a523e";
  /* ferneres Bein: Knie vor der Hüfte, langer Mittelfuß */
  k += `<path d="M${F(0.04, 0.5)} L${F(-0.08, 0.3)} L${F(0.1, 0.13)} L${F(0.0, 0.01)} L${F(-0.1, 0.0)}" stroke="#4e3c2c" stroke-width="1.1" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  /* Schwanz: steif, nach hinten, Federsaum, Fächer am Ende */
  k += `<path d="M${F(0.05, 0.62)} Q${F(0.6, 0.66)} ${F(1.3, 0.66)} L${F(1.32, 0.6)} Q${F(0.6, 0.55)} ${F(0.05, 0.47)} Z" fill="${FED}"/>`;
  for (let i = 0; i < 10; i++) { const [a, b] = P(0.35 + i * 0.1, 0.565); k += `<path d="M${a} ${b} l1.8 ${r(1 + (i % 2) * 0.5)}" stroke="#4e341c" stroke-width=".45"/>`; }
  k += `<path d="M${F(1.28, 0.66)} l3 -.6 l-.6 1.2 l3 .4 l-3 1 Z" fill="#5a3c20"/>`;
  /* Rumpf: kompakt, Federkleid mit dunklen Querbändern, heller Bauch */
  k += `<path d="M${F(-0.34, 0.6)} Q${F(-0.3, 0.72)} ${F(-0.05, 0.7)} Q${F(0.14, 0.68)} ${F(0.16, 0.56)} Q${F(0.12, 0.42)} ${F(-0.06, 0.4)} Q${F(-0.3, 0.42)} ${F(-0.34, 0.6)} Z" fill="${FED}"/>`;
  for (let i = 0; i < 4; i++) { const [a, b] = P(-0.2 + i * 0.09, 0.7); k += `<path d="M${a} ${b} q.6 1.6 .2 3" stroke="#3a2614" stroke-width=".6" fill="none" opacity=".55"/>`; }
  k += `<path d="M${F(-0.28, 0.46)} Q${F(-0.08, 0.38)} ${F(0.12, 0.46)}" stroke="#e2d0ac" stroke-width="1" fill="none" opacity=".75"/>`;
  /* S-förmiger Hals, langer flacher Kopf mit Zähnen */
  k += `<path d="M${F(-0.3, 0.62)} Q${F(-0.42, 0.66)} ${F(-0.4, 0.76)} Q${F(-0.4, 0.82)} ${F(-0.46, 0.84)} L${F(-0.5, 0.79)} Q${F(-0.47, 0.72)} ${F(-0.36, 0.56)} Z" fill="${FED}"/>`;
  k += `<path d="M${F(-0.44, 0.86)} Q${F(-0.56, 0.875)} ${F(-0.7, 0.835)} Q${F(-0.72, 0.81)} ${F(-0.69, 0.8)} L${F(-0.47, 0.785)} Z" fill="#8a6a46"/>`;
  k += `<path d="M${F(-0.69, 0.8)} L${F(-0.48, 0.785)}" stroke="#f2ead6" stroke-width=".4" stroke-dasharray=".3 .25"/>`;
  k += `<circle cx="${P(-0.53, 0.84)[0]}" cy="${P(-0.53, 0.84)[1]}" r=".6" fill="#e0a020"/><circle cx="${P(-0.53, 0.84)[0]}" cy="${P(-0.53, 0.84)[1]}" r=".28" fill="#111"/>`;
  /* gefaltete Arme mit langen Schwungfedern, Krallenfinger */
  k += `<path d="M${F(-0.26, 0.6)} L${F(-0.38, 0.5)} L${F(-0.3, 0.46)} Q${F(-0.12, 0.44)} ${F(0.0, 0.5)} Z" fill="#5a3e22"/>`;
  for (let i = 0; i < 6; i++) { const [a, b] = P(-0.34 + i * 0.05, 0.48); k += `<path d="M${a} ${b} l${r(0.8 + i * 0.25)} 2.4" stroke="#3a2614" stroke-width=".5"/>`; }
  k += `<path d="M${F(-0.38, 0.5)} l-1.2 .8 M${F(-0.38, 0.5)} l-1.3 -.1" stroke="#1d1a14" stroke-width=".35"/>`;
  /* nahes Bein: befiederter Oberschenkel, Sichelkralle am zweiten Zeh hochgehalten */
  k += `<path d="M${F(0.1, 0.56)} Q${F(-0.02, 0.5)} ${F(-0.06, 0.34)} L${F(0.06, 0.32)} Q${F(0.16, 0.44)} ${F(0.16, 0.54)} Z" fill="#6e4e2c"/>`;
  k += `<path d="M${F(-0.02, 0.33)} L${F(0.14, 0.13)} L${F(0.04, 0.01)} L${F(-0.1, 0.0)}" stroke="${BEIN}" stroke-width="1.2" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  k += `<path d="M${F(0.04, 0.03)} q-.4 -1.8 .8 -2.4" stroke="#1d1a14" stroke-width=".7" fill="none" stroke-linecap="round"/>`;
  S.teil({ id: "velociraptor", de: "der Velociraptor", syl: "Ve-lo-ci-RAP-tor", it: "il velociraptor", itSyl: "ve-lo-ci-RAP-tor", en: "velociraptor", x: x0, y: yb + 4, steht: true, kunst: um(x0, yb + 4, k),
    tipp: "Nur 2 Meter lang, so groß wie ein Truthahn — und er hatte Federn." });
}
{
  const x = 214, y = 172;
  const m = mensch({ id: "b20e_vater", geschlecht: "m", pose: "stehen", blick: 70, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "pullover", farbe: "gruen_d" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "grau" } } }, 1.8 * s(y));
  S.teil({ id: "vater", de: "der Vater", syl: "VA-ter", it: "il padre", itSyl: "PA-dre", en: "father", x, y, kunst: schatten(0, 0, 7, 1, 0.3) + m.svg,
    tipp: "Der Vater liest das Schild vor." });
}
{
  const x = 236, y = 176;
  const m = mensch({ id: "b20e_kind", alter: "kind", geschlecht: "w", pose: "zeigen", blick: 80, frisur: "zopf", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "rot" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 1.25 * s(y));
  S.teil({ id: "kind", de: "das Kind", syl: "KIND", it: "la bambina", itSyl: "bam-BI-na", en: "child", x, y, kunst: schatten(0, 0, 5, 0.8, 0.3) + m.svg,
    tipp: "Das Mädchen zeigt auf den Velociraptor: „Der hat ja Federn!“" });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/dinosaurier.js"));
console.log(aus);
