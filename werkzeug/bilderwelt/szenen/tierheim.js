#!/usr/bin/env node
/* =====================================================================
   DAS TIERHEIM (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (DGUV/BGI 889 „Tierheime – bauliche Anlagen“, Tierheim-
   Stellenanzeigen, Tierschutzzentrum Dortmund):
   - Das HUNDEHAUS: überdachte Innenzwinger entlang eines Versorgungs-
     gangs; Fronten aus verzinktem Stahl (unten Sicherheitsglas, oben
     Gitterstäbe), jede Tür mit einem STECKBRIEF des Hundes. Wände
     gefliest, Boden beschichtet mit Ablaufrinne; gereinigt wird mit dem
     WASSERSCHLAUCH.
   - KATZENZIMMER hinter einer Glaswand mit KRATZBAUM, Liegeplätzen und
     KATZENTOILETTE; Kleintiere (Kaninchen, Meerschweinchen) im GEHEGE
     mit Häuschen und Heu.
   - Die TIERPFLEGERIN in grüner Arbeitskleidung und Gummistiefeln
     füttert, putzt und führt die Vermittlungsgespräche. An der Pinnwand
     „Tiervermittlung“ hängen Fotos der Tiere; am Eingang die
     SPENDENBOX, Leinen am Haken, Transportboxen.
   Maßstab: Augenhöhe 1,6 m, Horizont y = 85; Rückwand 10 m entfernt
   (32 Einheiten je Meter, Fußleiste bei y ≈ 136).
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, flaeche, schatten, zufall } = B;
const r = B.r;
const { tierKasten } = require("./bauernhof");

const S = neueSzene({ id: "tierheim", titel: "Das Tierheim", emoji: "🐕", thema: "Tiere", kuerzel: "b18d", fassung: 852 });
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const T = tierKasten(S, 5151);
const rnd = zufall(3131);

const F = 320, HY = 85, E = 1.6, ZW = 10;
const P = (X, Y, Z) => [r(160 + X * F / Z), r(HY + (E - Y) * F / Z)];
const sZ = (Z) => F / Z;
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((q) => q.join(" ")).join("L")}Z" fill="${fill}"${extra}/>`;
const um = (x, y, svg) => `<g transform="translate(${r(-x)} ${r(-y)})">${svg}</g>`;
function kiste(X0, X1, Y0, Y1, Z0, Z1, f) {
  let g = "";
  if (f.s && X0 > 0) g += poly([P(X0, Y0, Z0), P(X0, Y0, Z1), P(X0, Y1, Z1), P(X0, Y1, Z0)], f.s);
  if (f.s && X1 < 0) g += poly([P(X1, Y0, Z0), P(X1, Y0, Z1), P(X1, Y1, Z1), P(X1, Y1, Z0)], f.s);
  if (f.o && Y1 < E) g += poly([P(X0, Y1, Z0), P(X1, Y1, Z0), P(X1, Y1, Z1), P(X0, Y1, Z1)], f.o);
  if (f.v) g += poly([P(X0, Y0, Z0), P(X1, Y0, Z0), P(X1, Y1, Z0), P(X0, Y1, Z0)], f.v);
  return g;
}
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c3cad0"], [0.55, "#aeb6bd"], [1, "#dde2e6"]], 0, 0, 1, 0);
const FLIESE = "#eef0ec";

/* =====================================================================
   KULISSE: Decke mit Leuchten, Rückwand (Fliesen + Farbe), Boden
   ===================================================================== */
{
  const [dl, dt] = P(-6, 3, ZW), [dr] = P(6, 3, ZW);
  let g = `<rect x="0" y="0" width="320" height="${dt}" fill="${S.lg("decke", [[0, "#d8dcd8"], [1, "#eceee8"]])}"/>`;
  for (let i = -5; i <= 5; i++) { const a = P(i * 1.2, 3, ZW), b = P(i * 1.2 * 3, 3, 4); g += `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="#c4c8c4" stroke-width=".3"/>`; }
  for (const Z of [5, 7.5, 10]) { const a = P(-1.2, 3, Z), b = P(1.2, 3, Z), c = P(1.2, 3, Z + 0.6), d = P(-1.2, 3, Z + 0.6); g += poly([a, b, c, d], "#fbfbf4") + poly([a, b, c, d], "#fff8d8", ` opacity=".6" filter="url(#bw_weich)"`); }
  /* Lüftungsrohr aus Blech unter der Decke, links, nach hinten laufend */
  {
    const a1 = P(-3.2, 2.85, 4), a2 = P(-3.2, 2.85, ZW), r1 = 0.18 * sZ(4), r2 = 0.18 * sZ(ZW);
    g += `<path d="M${a1[0]} ${r(a1[1] - r1)} L${a2[0]} ${r(a2[1] - r2)} L${a2[0]} ${r(a2[1] + r2)} L${a1[0]} ${r(a1[1] + r1)} Z" fill="${S.lg("rohr", [[0, "#b8c0c6"], [0.4, "#eef2f4"], [1, "#8a949a"]])}"/>`;
    for (let Z = 4.6; Z < ZW; Z *= 1.25) { const q = P(-3.2, 2.85, Z), rr = 0.18 * sZ(Z); g += `<path d="M${q[0]} ${r(q[1] - rr)} L${q[0]} ${r(q[1] + rr)}" stroke="#8a949a" stroke-width=".5"/>`; }
    const m1 = P(1.5, 3, 7), m2 = P(-1.5, 3, 8.5);
    g += `<ellipse cx="${m1[0]}" cy="${r(m1[1] + 1)}" rx="3" ry="1.2" fill="#f6f6f2" stroke="#c4c8c4" stroke-width=".3"/><circle cx="${m1[0]}" cy="${r(m1[1] + 1.4)}" r=".4" fill="#d23b30"/>`;
    g += `<rect x="${r(m2[0] - 5)}" y="${r(m2[1] + 1)}" width="10" height="3.4" rx=".6" fill="#2f9a4a"/><path d="M${r(m2[0] - 3)} ${r(m2[1] + 2.7)} h4 l-1 -.8 M${r(m2[0] + 1)} ${r(m2[1] + 2.7)} l-1 .8" stroke="#fff" stroke-width=".4" fill="none"/><rect x="${r(m2[0] + 2)}" y="${r(m2[1] + 1.6)}" width="1.6" height="2.2" fill="#fff"/>`;
  }
  /* Rückwand */
  const [, y15] = P(0, 1.5, ZW), [, yb] = P(0, 0, ZW);
  g += `<rect x="0" y="${dt}" width="320" height="${r(y15 - dt)}" fill="${S.lg("wand", [[0, "#e4ead2"], [1, "#d8e0c4"]])}"/>`;
  g += `<rect x="0" y="${y15}" width="320" height="${r(yb - y15)}" fill="${FLIESE}"/>`;
  let fl = "";
  const fs = 0.3 * sZ(ZW);
  for (let y = y15 + fs; y < yb; y += fs) fl += `M0 ${r(y)}H320`;
  for (let x = 0; x <= 320; x += fs) fl += `M${r(x)} ${y15}V${yb}`;
  g += `<path d="${fl}" stroke="#cfd4ce" stroke-width=".3"/>`;
  g += `<rect x="0" y="${r(y15 - 0.6)}" width="320" height="1.2" fill="#9ab88a"/>`;
  /* Boden: beschichtet, Fluchtlinien, Ablaufrinne vor den Zwingern */
  g += `<path d="M0 ${yb} L320 ${yb} L320 200 L0 200 Z" fill="${S.lg("boden", [[0, "#9aa29c"], [1, "#b8beb8"]])}"/>`;
  for (let i = -8; i <= 8; i++) { const a = P(i * 0.8, 0, ZW), b = P(i * 0.8, 0, 3.5); g += `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="#8a928c" stroke-width=".25" opacity=".6"/>`; }
  const ra = P(-2.1, 0, ZW - 0.3), rb = P(2.1, 0, ZW - 0.3), rc = P(2.1, 0, ZW - 0.5), rd = P(-2.1, 0, ZW - 0.5);
  g += poly([ra, rb, rc, rd], "#6a706a");
  for (let i = 0; i < 28; i++) { const X = -2.05 + i * 0.15, a = P(X, 0, ZW - 0.3), b = P(X, 0, ZW - 0.5); g += `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="#b8beb8" stroke-width=".3"/>`; }
  g += `<path d="M0 ${yb} L320 ${yb} L320 200 L0 200 Z" fill="${S.lg("bodenglanz", [[0, "#fff", 0], [0.5, "#fff", 0.12], [1, "#fff", 0]], 0, 0, 1, 0)}"/>`;
  g += `<rect x="0" y="${r(yb - 1)}" width="320" height="1.2" fill="#8a928c"/>`;
  S.hinten(g);
}

/* =====================================================================
   1 — DIE PINNWAND „Tiervermittlung“ (Vermittlung) — Lupe: Foto, Plakat
   ===================================================================== */
{
  const [x0, y0] = P(-4.85, 2.35, ZW), [x1, y1] = P(-3.2, 1.25, ZW);
  const w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" rx=".8" fill="#8a6a44"/><rect x="${r(x0 + 1)}" y="${r(y0 + 1)}" width="${r(w - 2)}" height="${r(h - 2)}" fill="${S.lg("kork", [[0, "#d8b07a"], [1, "#c49a62"]])}"/>`;
  k += `<rect x="${r(x0 + 3)}" y="${r(y0 + 2)}" width="${r(w - 6)}" height="5" fill="#2f7a4a"/><text x="${r(x0 + w / 2)}" y="${r(y0 + 5.8)}" font-size="3.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Tiervermittlung</text>`;
  /* Fotos der Tiere mit Namen */
  const foto = (x, y, fell, name) => `<g transform="translate(${r(x)} ${r(y)})"><rect x="-4.4" y="-3.4" width="8.8" height="9.6" fill="#fff" stroke="#ccc" stroke-width=".2"/><rect x="-3.8" y="-2.8" width="7.6" height="6" fill="#bcd4e2"/><ellipse cx="0" cy="1.6" rx="2.8" ry="1.6" fill="${fell}"/><circle cx="1.6" cy="-.4" r="1.6" fill="${fell}"/><path d="M.6 -1.6 l.4 -1.2 l.8 1 Z M2.2 -1.6 l.4 -1.2 l.6 1.1 Z" fill="${fell}"/><text x="0" y="5.4" font-size="1.7" text-anchor="middle" fill="#333" font-family="Arial">${name}</text><circle cx="0" cy="-3" r=".6" fill="#d23b30"/></g>`;
  const FO = [x0 + 9, y0 + 14];
  k += foto(FO[0], FO[1], "#7a5a3a", "Bruno") + foto(x0 + 20, y0 + 13, "#e0a060", "Mia") + foto(x0 + 31, y0 + 14.4, "#2a2626", "Luna") + foto(x0 + 42, y0 + 13.4, "#c8a882", "Max");
  const PL = [x0 + 13, y0 + 26];
  k += `<g transform="translate(${r(PL[0])} ${r(PL[1])}) rotate(-2)"><rect x="-10" y="-4.6" width="20" height="10" fill="#f6e04a"/><text x="0" y="-1" font-size="2.4" text-anchor="middle" fill="#a8301e" font-family="Arial" font-weight="bold">Tag der offenen Tür</text><text x="0" y="2.2" font-size="2" text-anchor="middle" fill="#333" font-family="Arial">Sonntag 11–16 Uhr</text><circle cx="0" cy="-4" r=".6" fill="#2a6ab0"/></g>`;
  k += `<g transform="translate(${r(x0 + 37)} ${r(y0 + 26)}) rotate(2)"><rect x="-8" y="-4.6" width="16" height="10" fill="#fff"/><text x="0" y="-1.2" font-size="2" text-anchor="middle" fill="#2f7a4a" font-family="Arial" font-weight="bold">Wir suchen</text><text x="0" y="1.4" font-size="2" text-anchor="middle" fill="#2f7a4a" font-family="Arial" font-weight="bold">Gassigeher!</text><circle cx="0" cy="-4" r=".6" fill="#2a6ab0"/></g>`;
  const cx = x0 + w / 2;
  S.teil({ id: "th_vermittlung", de: "die Vermittlung", syl: "Ver-MITT-lung", it: "l'adozione", itSyl: "a-do-ZIO-ne", en: "rehoming", x: r(cx), y: r(y1), kunst: um(cx, y1, k),
    zoom: { x: r(x0 - 3), y: r(y0 - 2), w: 54, h: 36 },
    unter: [
      { id: "th_foto", de: "das Foto", syl: "FO-to", it: "la foto", itSyl: "FO-to", en: "photo", x: r(FO[0]), y: r(FO[1] + 6.4), kunst: flaeche(-4.6, -10, 9.2, 10), tipp: "Auf dem Foto ist Bruno. Er sucht ein neues Zuhause." },
      { id: "th_plakat", de: "das Plakat", syl: "Pla-KAT", it: "il manifesto", itSyl: "ma-ni-FE-sto", en: "poster", x: r(PL[0]), y: r(PL[1] + 5.6), kunst: flaeche(-10.4, -10.4, 20.8, 10.6) },
    ],
    tipp: "Bei der Vermittlung bekommt ein Tier aus dem Tierheim ein neues Zuhause." });
}

/* =====================================================================
   2 — DIE LEINEN am Hakenbrett, DER WASSERSCHLAUCH an der Wand
   ===================================================================== */
{
  const [x0, y0] = P(-3.05, 1.95, ZW), [x1] = P(-2.5, 1.95, ZW);
  let k = `<rect x="${x0}" y="${y0}" width="${r(x1 - x0)}" height="2.2" rx=".5" fill="#8a6a44"/>`;
  const farben = ["#d23b30", "#2a6ab0", "#2f7a4a", "#e8a020"];
  farben.forEach((f, i) => {
    const hx = x0 + 2 + i * 4.4;
    k += `<circle cx="${r(hx)}" cy="${r(y0 + 1.1)}" r=".6" fill="#555"/>`;
    k += `<path d="M${r(hx)} ${r(y0 + 1.6)} q-1.6 8 0 14 q1.6 -6 0 -14 M${r(hx)} ${r(y0 + 15.6)} l0 3" stroke="${f}" stroke-width=".9" fill="none"/><rect x="${r(hx - 0.7)}" y="${r(y0 + 18.4)}" width="1.4" height="2" rx=".4" fill="#9aa3aa"/>`;
  });
  S.teil({ id: "th_leine_th", de: "die Leine", syl: "LEI-ne", it: "il guinzaglio", itSyl: "guin-ZA-glio", en: "lead", x: r((x0 + x1) / 2), y: r(y0 + 21), kunst: um((x0 + x1) / 2, y0 + 21, k),
    tipp: "Mit der Leine gehen Helfer mit den Hunden spazieren – „Gassi gehen“." });
}
{
  const [cx, cy] = P(-2.3, 0.95, ZW);
  let k = `<rect x="-4" y="-8.4" width="8" height="2" rx=".6" fill="#7d858a"/>`;
  k += `<circle cx="0" cy="-2" r="6" fill="#2f7a4a"/><circle cx="0" cy="-2" r="4.6" fill="none" stroke="#3f9a5a" stroke-width="1.6"/><circle cx="0" cy="-2" r="3" fill="none" stroke="#2a6a3a" stroke-width="1.4"/><circle cx="0" cy="-2" r="1.2" fill="#c4ccd2"/>`;
  k += `<path d="M4 2 Q6 8 4 14 Q2 18 6 20" stroke="#3f9a5a" stroke-width="1.2" fill="none"/><rect x="4.6" y="19.6" width="3" height="1.8" rx=".5" fill="#e8a020"/>`;
  S.teil({ id: "th_schlauch", de: "der Wasserschlauch", syl: "WAS-ser-schlauch", it: "il tubo dell'acqua", itSyl: "TU-bo del-LAC-qua", en: "hose", x: r(cx), y: r(cy), kunst: k,
    tipp: "Jeden Morgen werden die Zwinger mit dem Wasserschlauch sauber gespritzt." });
}

/* =====================================================================
   3 — DIE ZWINGER (drei Innenzwinger: unten Glas, oben Gitter)
   ===================================================================== */
const ZB = [-2.1, -0.7, 0.7, 2.1];   // Grenzen der drei Zwinger (X)
const ZT = ZW + 2.0;                      // Rückwand der Zwinger
{
  let k = "";
  /* Innenräume: Rückwand gefliest, Seitenwände, Boden, Liegebrett */
  for (let i = 0; i < 3; i++) {
    const X0 = ZB[i], X1 = ZB[i + 1];
    k += poly([P(X0, 0, ZT), P(X1, 0, ZT), P(X1, 2.2, ZT), P(X0, 2.2, ZT)], S.lg("zw_rueck", [[0, "#e2e8e2"], [1, "#cfd8d0"]]));
    k += poly([P(X0, 0, ZW), P(X1, 0, ZW), P(X1, 0, ZT), P(X0, 0, ZT)], "#9aa8a0");
    /* sichtbar ist die Innenseite der Wand, die zur Kamera (X = 0) zeigt */
    if (X0 < 0) k += poly([P(X0, 0, ZW), P(X0, 0, ZT), P(X0, 2.2, ZT), P(X0, 2.2, ZW)], "#d0d8d2");
    if (X1 > 0) k += poly([P(X1, 0, ZW), P(X1, 0, ZT), P(X1, 2.2, ZT), P(X1, 2.2, ZW)], "#d0d8d2");
    const a = P(X0, 1.5, ZT), b = P(X1, 1.5, ZT);
    k += `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="#9ab88a" stroke-width=".8"/>`;
    k += poly([P(X0, 0, ZT), P(X1, 0, ZT), P(X1, 0.5, ZT), P(X0, 0.5, ZT)], "#000", ` opacity=".06"`);
  }
  /* Wand über den Zwingern (Ziffern), Fronten: Rahmen, Glas, Gitter, Tür */
  for (let i = 0; i < 3; i++) {
    const X0 = ZB[i], X1 = ZB[i + 1];
    const [xa, ya] = P(X0, 2.2, ZW), [xb, yb] = P(X1, 0, ZW), [, yg] = P(0, 1.0, ZW);
    const w = xb - xa;
    k += `<rect x="${r(xa + w / 2 - 4)}" y="${r(ya - 7)}" width="8" height="5" rx=".6" fill="#2f7a4a"/><text x="${r(xa + w / 2)}" y="${r(ya - 3.3)}" font-size="3.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">${i + 1}</text>`;
    /* Glas unten (nur Spiegelstreifen), Gitter oben */
    k += `<rect x="${r(xa)}" y="${r(yg)}" width="${r(w)}" height="${r(yb - yg)}" fill="#dfeef2" opacity=".14"/>`;
    k += `<path d="M${r(xa + 3)} ${r(yb - 1)} L${r(xa + 10)} ${r(yg + 1)} M${r(xa + 7)} ${r(yb - 1)} L${r(xa + 12)} ${r(yg + 1)}" stroke="#fff" stroke-width=".8" opacity=".35"/>`;
    let gi = "";
    for (let x = xa + 2.4; x < xb - 1; x += 2.4) gi += `M${r(x)} ${r(ya)}V${r(yg)}`;
    k += `<path d="${gi}" stroke="${STAHL}" stroke-width=".7"/><path d="${gi}" stroke="#6a747a" stroke-width=".2" transform="translate(.35 0)"/>`;
    k += `<rect x="${r(xa)}" y="${r(ya)}" width="${r(w)}" height="${r(yb - ya)}" fill="none" stroke="${STAHL}" stroke-width="1.6"/>`;
    k += `<path d="M${r(xa)} ${r(yg)} H${r(xb)}" stroke="${STAHL}" stroke-width="1.4"/>`;
    /* Tür in der rechten Hälfte */
    const td = xa + w * 0.5;
    if (i !== 2) {
      k += `<path d="M${r(td)} ${r(ya)} V${r(yb)}" stroke="${STAHL}" stroke-width="1.2"/>`;
      k += `<rect x="${r(td + 1.4)}" y="${r(yg - 4)}" width="1.2" height="3.2" rx=".4" fill="#4a5258"/>`;
    }
  }
  /* Zwinger 3: Tür offen (Pflegerin putzt) — Türflügel nach vorn geklappt */
  {
    const [xa, ya] = P(ZB[2], 2.2, ZW), [xb, yb] = P(ZB[3], 0, ZW), td = xa + (xb - xa) * 0.5, [, yg] = P(0, 1.0, ZW);
    const t2 = P(ZB[2] + 0.7, 0, ZW - 0.7), t1 = P(ZB[2] + 0.7, 2.2, ZW - 0.7);
    k += `<path d="M${r(td)} ${r(ya)} L${t1[0]} ${t1[1]} L${t2[0]} ${t2[1]} L${r(td)} ${r(yb)} Z" fill="#dfeef2" opacity=".18" stroke="${STAHL}" stroke-width="1.2"/>`;
    for (let j = 1; j < 6; j++) { const u = j / 6, xx = td + (t1[0] - td) * u; k += `<path d="M${r(xx)} ${r(ya + (t1[1] - ya) * u)} L${r(xx)} ${r(yg + (P(0, 1, ZW - 0.7)[1] - yg) * u)}" stroke="${STAHL}" stroke-width=".6"/>`; }
  }
  const [cx, cy] = P(0, 0, ZW);
  S.teil({ id: "th_zwinger", de: "der Zwinger", syl: "ZWIN-ger", it: "il box", itSyl: "BOX", en: "kennel", x: cx, y: cy, steht: true, kunst: um(cx, cy, k),
    tipp: "Jeder Hund hat einen eigenen Zwinger mit Liegeplatz, Futter und Wasser." });
}
/* Steckbrief an der Tür von Zwinger 1 */
{
  const [xa, ya] = P(ZB[0], 2.2, ZW), [xb] = P(ZB[1], 0, ZW), td = xa + (xb - xa) * 0.5, [, yg] = P(0, 1.0, ZW);
  const x = td - 7, y = (ya + yg) / 2 + 6;
  let k = `<path d="M-1.6 -11.4 L0 -12.6 L1.6 -11.4" stroke="#9aa3aa" stroke-width=".3" fill="none"/><rect x="-5.4" y="-11.4" width="10.8" height="11.4" rx=".4" fill="#fffef6" stroke="#9aa3aa" stroke-width=".3"/>`;
  k += `<rect x="-5.4" y="-11.4" width="10.8" height="2.6" fill="#2f7a4a"/><text x="0" y="-9.5" font-size="1.9" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">BRUNO</text>`;
  k += `<text x="-4.6" y="-6.6" font-size="1.4" fill="#333" font-family="Arial">Mischling, 4 Jahre</text><text x="-4.6" y="-4.6" font-size="1.4" fill="#333" font-family="Arial">verträglich</text><text x="-4.6" y="-2.6" font-size="1.4" fill="#333" font-family="Arial">mag Kinder ♥</text>`;
  S.teil({ oben: true, id: "th_steckbrief", de: "der Steckbrief", syl: "STECK-brief", it: "la scheda", itSyl: "SCHE-da", en: "profile card", x: r(x), y: r(y), kunst: k,
    tipp: "Auf dem Steckbrief stehen Name, Alter und Charakter des Hundes." });
}

/* =====================================================================
   4 — IN DEN ZWINGERN: Hund, Futternapf, Welpen, Wassernapf, Hundekorb, Ball
   ===================================================================== */
{
  const Z = 10.9, [x, y] = P(-1.5, 0, Z);
  S.teil({ id: "th_hund_th", de: "der Hund", syl: "HUND", it: "il cane", itSyl: "CA-ne", en: "dog", x, y, kunst: T.hund(sZ(Z) / 100, 1, { art: "mischling" }),
    tipp: "Bruno wartet auf eine neue Familie." });
}
const napf = (rx, farbe, inhalt) => `${schatten(0, 0.2, rx * 1.1, 0.6, 0.3)}<path d="M${-rx} ${r(-rx * 0.5)} L${r(-rx * 0.8)} 0 L${r(rx * 0.8)} 0 L${rx} ${r(-rx * 0.5)} Z" fill="${farbe}"/><ellipse cx="0" cy="${r(-rx * 0.5)}" rx="${rx}" ry="${r(rx * 0.28)}" fill="#dfe4e8"/><ellipse cx="0" cy="${r(-rx * 0.5)}" rx="${r(rx * 0.78)}" ry="${r(rx * 0.2)}" fill="${inhalt}"/><path d="M${r(-rx * 0.7)} ${r(-rx * 0.3)} l${r(rx * 0.2)} ${r(rx * 0.2)}" stroke="#fff" stroke-width=".4" opacity=".7"/>`;
{
  const Z = 10.4, [x, y] = P(-0.9, 0, Z);
  let inh = "#8a5a2a";
  S.teil({ id: "th_futternapf", de: "der Futternapf", syl: "FUT-ter-napf", it: "la ciotola", itSyl: "CIO-to-la", en: "food bowl", x, y, steht: true,
    kunst: napf(0.13 * sZ(Z), STAHL, inh) + `<circle cx="-1" cy="${r(-0.065 * sZ(Z))}" r=".5" fill="#6a3a1a"/><circle cx=".8" cy="${r(-0.07 * sZ(Z))}" r=".5" fill="#6a3a1a"/>` });
}
{
  const Z = 10.8;
  let g = "";
  const [x, y] = P(-0.05, 0, Z);
  const k = sZ(Z) / 100;
  g += `<g transform="translate(-5 0)">${T.welpe(k * 1.15, 1, { farbe: ["#e2c48a", "#b8925a"] })}</g>`;
  const [x2, y2] = P(0.32, 0, Z + 0.25);
  g += `<g transform="translate(${r(x2 - x + 3)} ${r(y2 - y)})">${T.welpe(k * 1.1, -1, { farbe: ["#3a3230", "#1e1a18"] })}</g>`;
  S.teil({ id: "th_welpe", de: "der Welpe", syl: "WEL-pe", it: "il cucciolo", itSyl: "CUC-cio-lo", en: "puppy", x, y, kunst: g,
    tipp: "Welpen sind junge Hunde. Diese beiden sind neun Wochen alt." });
}
{
  const Z = 10.3, [x, y] = P(0.5, 0, Z);
  S.teil({ id: "th_wassernapf", de: "der Wassernapf", syl: "WAS-ser-napf", it: "la ciotola dell'acqua", itSyl: "CIO-to-la dell'AC-qua", en: "water bowl", x, y, steht: true,
    kunst: napf(0.12 * sZ(Z), S.lg("blaunapf", [[0, "#3a7ac8"], [1, "#2a5aa0"]], 0, 0, 1, 0), "#9ad0e8") });
}
{
  const Z = 11.4, [x, y] = P(1.1, 0, Z), s = sZ(Z), m = (v) => r(v * s);
  let k = schatten(0, 0.2, m(0.45), 1, 0.3);
  k += `<path d="M${m(-0.45)} 0 L${m(-0.48)} ${m(-0.2)} Q${m(-0.46)} ${m(-0.28)} ${m(-0.36)} ${m(-0.28)} L${m(0.36)} ${m(-0.28)} Q${m(0.46)} ${m(-0.28)} ${m(0.48)} ${m(-0.2)} L${m(0.45)} 0 Z" fill="${S.lg("korb", [[0, "#5a6a8a"], [1, "#3a4a6a"]])}"/>`;
  k += `<ellipse cx="0" cy="${m(-0.16)}" rx="${m(0.38)}" ry="${m(0.07)}" fill="#c8b48a"/><path d="M${m(-0.3)} ${m(-0.18)} q${m(0.3)} ${m(-0.05)} ${m(0.6)} 0" stroke="#a8946a" stroke-width=".4" fill="none"/>`;
  k += `<path d="M${m(-0.45)} ${m(-0.24)} H${m(0.45)}" stroke="#7a8aaa" stroke-width=".6"/>`;
  S.teil({ id: "th_hundekorb", de: "der Hundekorb", syl: "HUN-de-korb", it: "la cuccia", itSyl: "CUC-cia", en: "dog bed", x, y, steht: true, kunst: k });
  const [bx, by] = P(1.55, 0, 10.6);
  S.teil({ oben: true, id: "th_ball", de: "der Ball", syl: "BALL", it: "la palla", itSyl: "PAL-la", en: "ball", x: bx, y: by, steht: true,
    kunst: schatten(0, 0.2, 2, 0.5, 0.3) + `<circle cx="0" cy="-1.8" r="1.8" fill="${S.rg("ball", [[0, "#f6f080"], [0.7, "#c8d82a"], [1, "#8a9a1a"]], 0.35, 0.3, 0.8)}"/><path d="M-1.6 -2.6 Q0 -1.4 1.6 -2.6 M-1.6 -1 Q0 -2.2 1.6 -1" stroke="#fff" stroke-width=".3" fill="none"/>` + flaeche(-3, -5, 6, 5.4) });
}

/* =====================================================================
   5 — DIE TIERPFLEGERIN in der offenen Tür von Zwinger 3
   ===================================================================== */
{
  const Z = 9.9, [x, y] = P(1.8, 0, Z), s = sZ(Z);
  const m = B.mensch({ id: "b18d_pflegerin", geschlecht: "w", pose: "halten", blick: -30, frisur: "zopf", haarfarbe: "braun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#2f6a3a" }, unterteil: { stueck: "arbeitshose", farbe: "#2a4a32" }, schuhe: { stueck: "gummistiefel", farbe: "#2a2c2e" } } }, 1.68 * s);
  S.teil({ id: "th_pflegerin", de: "die Tierpflegerin", syl: "TIER-pfle-ge-rin", it: "l'addetta agli animali", itSyl: "ad-DET-ta agli a-ni-MA-li", en: "animal keeper", x, y, kunst: schatten(0, 0.3, 9, 1.2, 0.3) + m.svg,
    tipp: "Die Tierpflegerin füttert die Tiere, putzt die Zwinger und geht mit den Hunden raus." });
}

/* =====================================================================
   6 — DIE SPENDENBOX an der Trennwand
   ===================================================================== */
{
  const [x, y] = P(2.33, 0.95, ZW);
  let k = `<rect x="-4.6" y="-12" width="9.2" height="12" rx=".6" fill="#e8f2f6" opacity=".5" stroke="#9ab0b8" stroke-width=".4"/>`;
  for (let i = 0; i < 14; i++) k += `<ellipse cx="${r(-3.4 + rnd() * 6.8)}" cy="${r(-1 - Math.floor(i / 4) * 0.9 - rnd() * 0.4)}" rx="1" ry=".4" fill="${i % 3 ? "#c9a227" : "#b87333"}"/>`;
  k += `<rect x="-3.6" y="-5.4" width="5" height="2.6" fill="#7aa86a" transform="rotate(-12)"/>`;
  k += `<rect x="-4.8" y="-12.6" width="9.6" height="1.6" rx=".4" fill="#c4ccd2"/><rect x="-2" y="-12.4" width="4" height=".5" fill="#333"/>`;
  k += `<rect x="-4" y="-10.4" width="8" height="3" fill="#d23b30"/><text x="0" y="-8.2" font-size="2" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Spenden ♥</text>`;
  S.teil({ id: "th_spendenbox", de: "die Spendenbox", syl: "SPEN-den-box", it: "la cassetta delle offerte", itSyl: "cas-SET-ta delle of-FER-te", en: "donation box", x, y, kunst: k,
    tipp: "Das Tierheim lebt von Spenden – jeder Euro hilft den Tieren." });
}

/* =====================================================================
   7 — DAS KATZENZIMMER (Glaswand) mit KRATZBAUM, KATZE, KATZENTOILETTE
   ===================================================================== */
const KZ = { X0: 2.55, X1: 4.95, Z1: 13 };
KZ.Xh = KZ.X0 * KZ.Z1 / ZW;   // hinten: so weit links, wie man an der Trennwand vorbei sieht
{
  let k = "";
  /* Raum dahinter: Rückwand, Boden, Seitenwand links */
  const XR = KZ.X1 * KZ.Z1 / ZW;
  k += poly([P(KZ.Xh, 0, KZ.Z1), P(XR, 0, KZ.Z1), P(XR, 2.4, KZ.Z1), P(KZ.Xh, 2.4, KZ.Z1)], S.lg("kzwand", [[0, "#f2e2c8"], [1, "#e8d4b4"]]));
  k += poly([P(KZ.X0, 0, ZW), P(KZ.X1, 0, ZW), P(XR, 0, KZ.Z1), P(KZ.Xh, 0, KZ.Z1)], "#c8b08a");
  k += poly([P(KZ.X0, 2.4, ZW), P(KZ.X1, 2.4, ZW), P(XR, 2.4, KZ.Z1), P(KZ.Xh, 2.4, KZ.Z1)], "#f4ecdc");
  /* Fenster in der Rückwand mit Liegebrett */
  const f0 = P(3.9, 1.9, KZ.Z1), f1 = P(5.1, 1.1, KZ.Z1);
  k += `<rect x="${f0[0]}" y="${f0[1]}" width="${r(f1[0] - f0[0])}" height="${r(f1[1] - f0[1])}" fill="${S.lg("himmel", [[0, "#9ac8e8"], [1, "#d8ecf4"]])}" stroke="#fff" stroke-width="1"/><path d="M${r((f0[0] + f1[0]) / 2)} ${f0[1]} V${f1[1]}" stroke="#fff" stroke-width=".8"/>`;
  k += poly([P(3.8, 1.1, KZ.Z1), P(5.2, 1.1, KZ.Z1), P(5.2, 1.1, KZ.Z1 - 0.35), P(3.8, 1.1, KZ.Z1 - 0.35)], "#b8946a");
  /* Glaswand: Rahmen, Tür, Spiegelung (hinter den Tieren gezeichnet) */
  const [ga, gya] = P(KZ.X0, 2.4, ZW), [gb, gyb] = P(KZ.X1, 0, ZW);
  k += `<rect x="${ga}" y="${gya}" width="${r(gb - ga)}" height="${r(gyb - gya)}" fill="#e2f0f4" opacity=".12"/>`;
  k += `<path d="M${r(ga + 8)} ${gyb} L${r(ga + 22)} ${gya} M${r(ga + 14)} ${gyb} L${r(ga + 26)} ${gya} M${r(ga + 54)} ${gyb} L${r(ga + 64)} ${gya}" stroke="#fff" stroke-width="1.2" opacity=".28"/>`;
  k += `<rect x="${ga}" y="${gya}" width="${r(gb - ga)}" height="${r(gyb - gya)}" fill="none" stroke="#b8c0c6" stroke-width="1.4"/>`;
  const tx = ga + 2, tw = 0.9 * sZ(ZW);
  k += `<rect x="${r(tx)}" y="${gya}" width="${r(tw)}" height="${r(gyb - gya)}" fill="none" stroke="#b8c0c6" stroke-width="1"/><rect x="${r(tx + tw - 3)}" y="${r((gya + gyb) / 2)}" width="1.2" height="4" rx=".4" fill="#6a747a"/>`;
  k += `<rect x="${r(tx + 2)}" y="${r(gya + 4)}" width="${r(tw - 4)}" height="5" rx=".6" fill="#2f7a4a"/><text x="${r(tx + tw / 2)}" y="${r(gya + 7.6)}" font-size="2.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Katzen</text>`;
  k += `<rect x="${r(tx + 3)}" y="${r(gya + 12)}" width="${r(tw - 6)}" height="4" rx=".4" fill="#fff"/><text x="${r(tx + tw / 2)}" y="${r(gya + 14.8)}" font-size="1.6" text-anchor="middle" fill="#d23b30" font-family="Arial">Tür bitte schließen!</text>`;
  const [cx, cy] = P((KZ.X0 + KZ.X1) / 2, 0, ZW);
  S.teil({ id: "th_katzenzimmer", de: "das Katzenzimmer", syl: "KAT-zen-zim-mer", it: "la stanza dei gatti", itSyl: "STAN-za dei GAT-ti", en: "cat room", x: cx, y: cy, steht: true, kunst: um(cx, cy, k),
    tipp: "Im Katzenzimmer leben mehrere Katzen zusammen." });
}
{
  const Z = 12.2, [x, y] = P(3.45, 0, Z), s = sZ(Z), m = (v) => r(v * s);
  let k = schatten(0, 0.2, m(0.4), 0.8, 0.3);
  const SISAL = S.lg("sisal", [[0, "#d8c49a"], [0.5, "#e8d8b4"], [1, "#b8a47a"]], 0, 0, 1, 0);
  const PLUESCH = S.lg("pluesch", [[0, "#b8b0a8"], [1, "#8a8278"]]);
  k += `<rect x="${m(-0.4)}" y="${m(-0.08)}" width="${m(0.8)}" height="${m(0.08)}" rx="${m(0.02)}" fill="${PLUESCH}"/>`;
  k += `<rect x="${m(-0.06)}" y="${m(-1.6)}" width="${m(0.12)}" height="${m(1.52)}" fill="${SISAL}"/>`;
  k += `<rect x="${m(0.18)}" y="${m(-0.9)}" width="${m(0.1)}" height="${m(0.82)}" fill="${SISAL}"/>`;
  for (let y = 0.15; y < 1.6; y += 0.06) k += `<path d="M${m(-0.06)} ${m(-y)} h${m(0.12)}" stroke="#a8946a" stroke-width=".2"/>`;
  k += `<ellipse cx="${m(0.12)}" cy="${m(-0.9)}" rx="${m(0.26)}" ry="${m(0.05)}" fill="${PLUESCH}"/>`;
  k += `<rect x="${m(-0.35)}" y="${m(-1.15)}" width="${m(0.4)}" height="${m(0.22)}" rx="${m(0.08)}" fill="${PLUESCH}"/><ellipse cx="${m(-0.15)}" cy="${m(-1.04)}" rx="${m(0.08)}" ry="${m(0.07)}" fill="#3a3430"/>`;
  k += `<ellipse cx="0" cy="${m(-1.6)}" rx="${m(0.28)}" ry="${m(0.06)}" fill="${PLUESCH}"/><path d="M${m(-0.28)} ${m(-1.6)} q${m(0.28)} ${m(0.06)} ${m(0.56)} 0" stroke="#6a625a" stroke-width=".3" fill="none"/>`;
  k += `<path d="M${m(0.2)} ${m(-0.88)} l0 ${m(0.18)}" stroke="#d23b30" stroke-width=".3"/><circle cx="${m(0.2)}" cy="${m(-0.68)}" r=".8" fill="#e8c8c8"/>`;
  S.teil({ id: "th_kratzbaum", de: "der Kratzbaum", syl: "KRATZ-baum", it: "il tiragraffi", itSyl: "ti-ra-GRAF-fi", en: "cat tree", x, y, steht: true, kunst: k,
    tipp: "Am Kratzbaum schärfen Katzen ihre Krallen und klettern." });
  /* zwei Katzen: oben auf dem Kratzbaum (sitzend) und auf der Fensterbank (liegend) */
  const top = [x, y - 1.6 * s];
  const [fx, fy] = P(4.5, 1.1, KZ.Z1 - 0.18);
  let g = `<g>${T.katze(s / 100 * 1.1, 1, { art: "rot", pose: "sitzen" })}</g>`;
  g += `<g transform="translate(${r(fx - top[0])} ${r(fy - top[1])})">${T.katze(sZ(KZ.Z1) / 100 * 1.1, -1, { art: "schwarzweiss", pose: "liegen" })}</g>`;
  S.teil({ oben: true, id: "th_katze_th", de: "die Katze", syl: "KAT-ze", it: "il gatto", itSyl: "GAT-to", en: "cat", x: top[0], y: r(top[1]), kunst: g,
    tipp: "Mia und Luna warten auf ein Zuhause – am liebsten zusammen." });
}
{
  const Z = 12.6, [x, y] = P(4.4, 0, Z), s = sZ(Z), m = (v) => r(v * s);
  let k = schatten(0, 0.2, m(0.3), 0.8, 0.3);
  k += `<path d="M${m(-0.3)} 0 L${m(-0.32)} ${m(-0.22)} L${m(0.32)} ${m(-0.22)} L${m(0.3)} 0 Z" fill="${S.lg("klo", [[0, "#7ab8c8"], [1, "#4a8a9a"]])}"/>`;
  k += `<path d="M${m(-0.32)} ${m(-0.22)} L${m(-0.3)} ${m(-0.42)} Q0 ${m(-0.56)} ${m(0.3)} ${m(-0.42)} L${m(0.32)} ${m(-0.22)} Z" fill="${S.lg("klod", [[0, "#9ad0dc"], [1, "#6aa8b8"]])}"/>`;
  k += `<ellipse cx="0" cy="${m(-0.3)}" rx="${m(0.12)}" ry="${m(0.1)}" fill="#2a3a40"/><path d="M${m(-0.32)} ${m(-0.22)} H${m(0.32)}" stroke="#3a7a8a" stroke-width=".6"/>`;
  S.teil({ id: "th_katzenklo", de: "die Katzentoilette", syl: "KAT-zen-toi-let-te", it: "la lettiera", itSyl: "let-TIE-ra", en: "litter box", x, y, steht: true, kunst: k,
    tipp: "In der Katzentoilette ist Streu – sie wird jeden Tag sauber gemacht." });
}

/* =====================================================================
   8 — DAS GEHEGE der Kleintiere mit KANINCHEN und MEERSCHWEINCHEN
   ===================================================================== */
const GH = { X0: -3.7, X1: -1.55, Z0: 7.4, Z1: 9.3 };
{
  let k = "";
  const HOLZ = S.lg("ghholz", [[0, "#c8a06a"], [1, "#a07a48"]]);
  /* Boden mit Einstreu */
  k += poly([P(GH.X0, 0, GH.Z0), P(GH.X1, 0, GH.Z0), P(GH.X1, 0, GH.Z1), P(GH.X0, 0, GH.Z1)], S.lg("streu", [[0, "#e2cc94"], [1, "#d4b878"]]));
  let st = "";
  for (let i = 0; i < 90; i++) { const X = GH.X0 + rnd() * (GH.X1 - GH.X0), Z = GH.Z0 + rnd() * (GH.Z1 - GH.Z0), [x, y] = P(X, 0, Z); st += `M${x} ${y}l${r(-0.8 + rnd() * 1.6)} ${r(-0.3 + rnd() * 0.6)}`; }
  k += `<path d="${st}" stroke="#b8964a" stroke-width=".3"/>`;
  /* Rückwand und rechte Seite: Holzrahmen mit Gitter, 0,6 m */
  const zaun = (A, Bp) => {
    let g = poly([A, Bp, [Bp[0], Bp[1] - (Bp[2] || 0)], [A[0], A[1] - (A[2] || 0)]], "none");
    return g;
  };
  const wand = (X0, Z0, X1, Z1) => {
    const a = P(X0, 0, Z0), b = P(X1, 0, Z1), c = P(X1, 0.6, Z1), d = P(X0, 0.6, Z0);
    let g = poly([a, b, c, d], "#fff", ` opacity=".08"`);
    let gi = "";
    for (let t = 0; t <= 1.001; t += 0.06) { const X = X0 + (X1 - X0) * t, Z = Z0 + (Z1 - Z0) * t, p = P(X, 0, Z), q = P(X, 0.6, Z); gi += `M${p[0]} ${p[1]}L${q[0]} ${q[1]}`; }
    for (let h = 0.15; h < 0.6; h += 0.15) { const p = P(X0, h, Z0), q = P(X1, h, Z1); gi += `M${p[0]} ${p[1]}L${q[0]} ${q[1]}`; }
    g += `<path d="${gi}" stroke="#8a949a" stroke-width=".25"/>`;
    g += `<path d="M${d[0]} ${d[1]} L${c[0]} ${c[1]}" stroke="${HOLZ}" stroke-width="1.6"/><path d="M${a[0]} ${a[1]} L${a[0]} ${d[1]} M${b[0]} ${b[1]} L${b[0]} ${c[1]}" stroke="${HOLZ}" stroke-width="1.4"/>`;
    return g;
  };
  k += wand(GH.X0, GH.Z1, GH.X1, GH.Z1) + wand(GH.X1, GH.Z1, GH.X1, GH.Z0);
  /* Holzhäuschen hinten links, Heuraufe */
  const hX0 = GH.X0 + 0.1, hX1 = hX0 + 0.6, hZ0 = GH.Z1 - 0.55, hZ1 = GH.Z1 - 0.05;
  k += kiste(hX0, hX1, 0, 0.35, hZ0, hZ1, { s: "#9a7448", v: S.lg("haus", [[0, "#c8a06a"], [1, "#a8804e"]]) });
  const dA = P(hX0 - 0.04, 0.35, hZ0 - 0.04), dB = P(hX1 + 0.04, 0.35, hZ0 - 0.04), dC = P(hX1 + 0.04, 0.48, hZ0 + 0.25), dD = P(hX0 - 0.04, 0.48, hZ0 + 0.25);
  k += poly([dA, dB, dC, dD], "#6a4a2a");
  const e0 = P(hX0 + 0.2, 0, hZ0), e1 = P(hX0 + 0.42, 0.22, hZ0);
  k += `<path d="M${e0[0]} ${e0[1]} L${e0[0]} ${r(e1[1] + 2)} A${r((e1[0] - e0[0]) / 2)} ${r((e1[0] - e0[0]) / 2)} 0 0 1 ${e1[0]} ${r(e1[1] + 2)} L${e1[0]} ${e0[1]} Z" fill="#2a1e14"/>`;
  const rA = P(GH.X1 - 0.6, 0.25, GH.Z1 - 0.02), rB = P(GH.X1 - 0.1, 0.55, GH.Z1 - 0.02);
  k += `<path d="M${rA[0]} ${rB[1]} L${rB[0]} ${rB[1]} L${r(rB[0] - 1)} ${rA[1]} L${r(rA[0] + 1)} ${rA[1]} Z" fill="#e2c87a"/>`;
  let ra = "";
  for (let x = rA[0]; x <= rB[0]; x += 1.2) ra += `M${r(x)} ${rB[1]}L${r(x + (x < (rA[0] + rB[0]) / 2 ? 0.5 : -0.5))} ${rA[1]}`;
  k += `<path d="${ra}" stroke="#7a848a" stroke-width=".3"/>`;
  /* vorne: niedriges Brett */
  const v0 = P(GH.X0, 0, GH.Z0), v1 = P(GH.X1, 0, GH.Z0), v2 = P(GH.X1, 0.15, GH.Z0), v3 = P(GH.X0, 0.15, GH.Z0);
  k += poly([v0, v1, v2, v3], HOLZ);
  /* linke Seite (ragt an den Bildrand) */
  const s0 = P(GH.X0, 0, GH.Z0), s1 = P(GH.X0, 0, GH.Z1), s2 = P(GH.X0, 0.15, GH.Z1), s3 = P(GH.X0, 0.15, GH.Z0);
  k += poly([s0, s1, s2, s3], "#a07a48");
  const [cx, cy] = P((GH.X0 + GH.X1) / 2, 0, GH.Z0);
  S.teil({ id: "th_gehege", de: "das Gehege", syl: "Ge-HE-ge", it: "il recinto", itSyl: "re-CIN-to", en: "enclosure", x: cx, y: cy, steht: true, kunst: um(cx, cy, k),
    tipp: "Im Gehege leben Kaninchen und Meerschweinchen – nie allein, immer mindestens zu zweit." });
}
{
  const Z = 8.6, [x, y] = P(-2.1, 0, Z);
  S.teil({ id: "th_kaninchen", de: "das Kaninchen", syl: "Ka-NIN-chen", it: "il coniglio", itSyl: "co-NI-glio", en: "rabbit", x, y, kunst: T.kaninchen(sZ(Z) / 100, -1, { art: "hollaender" }),
    tipp: "Ein Holländer-Kaninchen: schwarz-weiß gezeichnet." });
  const Z2 = 8.0, [x2, y2] = P(-2.95, 0, Z2);
  S.teil({ id: "th_meerschweinchen", de: "das Meerschweinchen", syl: "MEER-schwein-chen", it: "la cavia", itSyl: "CA-via", en: "guinea pig", x: x2, y: y2, kunst: T.meerschweinchen(sZ(Z2) / 100, 1),
    tipp: "Meerschweinchen quieken laut, wenn sie Hunger haben." });
}

/* =====================================================================
   9 — DER KATZENKORB (Transportbox) und DER BESUCHER
   ===================================================================== */
{
  const Z = 6.6, X0 = 1.3, X1 = 1.85, Z1 = Z + 0.38;
  let k = "";
  const g0 = P((X0 + X1) / 2, 0, Z + 0.2);
  k += schatten(g0[0], g0[1], 12, 1.4, 0.3);
  k += kiste(X0, X1, 0, 0.32, Z, Z1, { s: "#8a949a", o: "#d8dee2", v: S.lg("box", [[0, "#c8d0d6"], [1, "#9aa4aa"]]) });
  const a = P(X0 + 0.08, 0.27, Z), b = P(X1 - 0.08, 0.05, Z);
  k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" rx="1" fill="#2a2a2a"/>`;
  let gi = "";
  for (let x = a[0] + 1.2; x < b[0]; x += 1.6) gi += `M${r(x)} ${a[1]}V${b[1]}`;
  k += `<path d="${gi}" stroke="#c4ccd2" stroke-width=".5"/><rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" rx="1" fill="none" stroke="#c4ccd2" stroke-width=".6"/>`;
  const h0 = P(X0 + 0.18, 0.32, Z + 0.19), h1 = P(X1 - 0.18, 0.32, Z + 0.19);
  k += `<path d="M${h0[0]} ${h0[1]} Q${r((h0[0] + h1[0]) / 2)} ${r(h0[1] - 5)} ${h1[0]} ${h1[1]}" stroke="#5a646a" stroke-width="1.4" fill="none"/>`;
  k += `<circle cx="${r(a[0] + 4)}" cy="${r((a[1] + b[1]) / 2 + 1)}" r="1" fill="#c8a020"/><circle cx="${r(a[0] + 6)}" cy="${r((a[1] + b[1]) / 2 + 1)}" r="1" fill="#c8a020"/>`;
  S.teil({ id: "th_transportkorb", de: "der Katzenkorb", syl: "KAT-zen-korb", it: "il cestino per gatti", itSyl: "ce-STI-no per GAT-ti", en: "cat basket", x: g0[0], y: g0[1], steht: true, kunst: um(g0[0], g0[1], k),
    tipp: "Im Katzenkorb wird eine Katze sicher zum Tierarzt oder ins neue Zuhause gebracht." });
}
{
  const Z = 8.8, [x, y] = P(3.75, 0, Z), s = sZ(Z);
  const m = B.mensch({ id: "b18d_besucher", geschlecht: "m", pose: "stehen", blick: -95, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel", bart: "kurz",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#6a7a8a" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "#8a5a32" }, schuhe: { stueck: "turnschuh" } } }, 1.8 * s);
  S.teil({ id: "th_besucher_th", de: "der Besucher", syl: "Be-SU-cher", it: "il visitatore", itSyl: "vi-si-ta-TO-re", en: "visitor", x, y, kunst: schatten(0, 0.3, 9, 1.2, 0.3) + m.svg,
    tipp: "Der Besucher fragt: „Darf ich die Katzen kennenlernen?“" });
}

/* =====================================================================
   10 — DER FUTTERSACK und DAS WARNSCHILD (es wird gerade geputzt)
   ===================================================================== */
{
  const Z = 6.0, [x, y] = P(-1.05, 0, Z), s = sZ(Z), m = (v) => r(v * s);
  let k = schatten(0, 0.2, m(0.3), 1, 0.3);
  k += `<path d="M${m(-0.24)} 0 L${m(-0.27)} ${m(-0.5)} Q${m(-0.24)} ${m(-0.62)} ${m(-0.16)} ${m(-0.66)} L${m(0.18)} ${m(-0.64)} Q${m(0.26)} ${m(-0.6)} ${m(0.27)} ${m(-0.5)} L${m(0.25)} 0 Z" fill="${S.lg("sack", [[0, "#e8d8a8"], [0.5, "#f2e6c0"], [1, "#c8b47a"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${m(-0.16)} ${m(-0.66)} L${m(-0.1)} ${m(-0.72)} L${m(0.12)} ${m(-0.71)} L${m(0.18)} ${m(-0.64)}" fill="#d8c890" stroke="#a8945a" stroke-width=".3"/>`;
  k += `<rect x="${m(-0.2)}" y="${m(-0.46)}" width="${m(0.4)}" height="${m(0.2)}" rx="1" fill="#c8402a"/><text x="0" y="${m(-0.33)}" font-size="${m(0.07)}" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Hundefutter</text>`;
  k += `<text x="0" y="${m(-0.18)}" font-size="${m(0.05)}" text-anchor="middle" fill="#5a4a2a" font-family="Arial">15 kg</text>`;
  k += `<ellipse cx="${m(-0.06)}" cy="${m(-0.08)}" rx="${m(0.06)}" ry="${m(0.035)}" fill="#7a4a24"/>`;
  S.teil({ id: "th_futtersack", de: "der Futtersack", syl: "FUT-ter-sack", it: "il sacco di cibo", itSyl: "SAC-co di CI-bo", en: "bag of feed", x, y, steht: true, kunst: k,
    tipp: "Ein großer Hund frisst am Tag etwa ein halbes Kilo Trockenfutter." });
}
{
  const Z = 6.4, [x, y] = P(0.25, 0, Z), s = sZ(Z), m = (v) => r(v * s);
  let k = schatten(0, 0.2, m(0.22), 1, 0.3);
  k += `<path d="M${m(-0.18)} 0 L${m(-0.02)} ${m(-0.62)} L${m(0.02)} ${m(-0.62)} L${m(0.18)} 0 L${m(0.14)} 0 L0 ${m(-0.54)} L${m(-0.14)} 0 Z" fill="#e8c020"/>`;
  k += `<path d="M${m(-0.16)} 0 L${m(-0.02)} ${m(-0.6)} L${m(0.13)} 0 Z" fill="${S.lg("schild", [[0, "#f8d838"], [1, "#e0b418"]])}" stroke="#a8840a" stroke-width=".3"/>`;
  k += `<path d="M0 ${m(-0.46)} L${m(0.07)} ${m(-0.33)} L${m(-0.07)} ${m(-0.33)} Z" fill="none" stroke="#141414" stroke-width=".5"/><circle cx="0" cy="${m(-0.37)}" r=".5" fill="#141414"/><path d="M${m(-0.05)} ${m(-0.39)} l${m(0.03)} ${m(-0.03)}" stroke="#141414" stroke-width=".4"/>`;
  k += `<text x="0" y="${m(-0.22)}" font-size="${m(0.045)}" text-anchor="middle" fill="#141414" font-family="Arial" font-weight="bold">VORSICHT</text><text x="0" y="${m(-0.15)}" font-size="${m(0.04)}" text-anchor="middle" fill="#141414" font-family="Arial">Rutschgefahr</text>`;
  S.teil({ id: "th_warnschild", de: "das Warnschild", syl: "WARN-schild", it: "il cartello di avvertimento", itSyl: "car-TEL-lo di av-ver-ti-MEN-to", en: "warning sign", x, y, steht: true, kunst: k,
    tipp: "Vorsicht: Der Boden ist nass, weil gerade geputzt wird." });
  /* nasse Stelle (spiegelt) — Teil des Bodens */
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/tierheim.js"));
console.log(aus);
