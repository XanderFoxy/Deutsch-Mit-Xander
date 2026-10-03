#!/usr/bin/env node
/* =====================================================================
   DUBAI (FASSUNG 854) — Bilderwelt neu, Städte der Welt
   ---------------------------------------------------------------------
   RECHERCHE (Britannica „Burj Khalifa“, SOM/Wikipedia-Daten über
   Britannica-Druckfassung, Emaar „Souk Al Bahar“, Visit Dubai,
   Lonely Planet „Dubai Fountain“, Emaar-Blog „Dubai Fountain timings“):
   - STANDORT: die Uferterrasse der Dubai Mall am Burj-See (Downtown
     Dubai), etwa 3,4 m über dem Wasser. Blick etwa nach Westen über den
     See zum Burj Khalifa. Links auf der Insel „Old Town Island“ der Souk
     Al Bahar, rechts und hinter dem Turm die Hochhäuser von Downtown.
   - ZEIT: Nachmittagsshow der Dubai Fountain (Samstag bis Donnerstag
     13:00 und 13:30 Uhr, abends ab 18 Uhr alle 30 Minuten). Die Sonne
     steht hoch im Süden, also LINKS: Licht von links oben, Schatten fallen
     nach rechts. Der Himmel ist über dem Horizont leicht staubig-dunstig.
   - BURJ KHALIFA (SOM, eröffnet 2010): 828 m mit der rund 240 m langen
     Stahlspitze, über 160 Stockwerke. Grundriss in Y-Form (drei Flügel um
     einen Kern, nach der Wüstenblume Hymenocallis). Die Flügel springen
     spiralförmig in 27 Terrassen zurück; der Turm wird nach oben immer
     schmaler, oben tritt der Kern heraus und läuft in die Spitze aus.
     Fassade: spiegelndes Glas mit senkrechten Edelstahlrippen, dunklere
     Bänder an den Technikgeschossen. Aussichtsplattform „At the Top“
     auf Ebene 124/125 (rund 455 m) und 148 (555 m).
   - DUBAI FOUNTAIN: rund 275 m lang, im See vor dem Turm, die Strahlen
     steigen bis etwa 150 m (500 Fuß), Show 5–6 Minuten zu Musik.
   - SOUK AL BAHAR („Markt der Seeleute“): Basar im alten arabischen Stil
     mit Natursteinfassade, Bogengängen, Holzgittern (Maschrabiyya) und
     Windtürmen (Barjeel), am Ufer Cafés und Restaurants.
   - Auf dem See fahren traditionelle Holzboote (Abra) für Rundfahrten
     nah an die Fontänen („Dubai Fountain Lake Ride“).
   - TYPISCHES: arabischer Kaffee mit Kardamom aus der Dallah in kleinen
     Tassen ohne Henkel, dazu Datteln; Kamel als Andenken; Besucher
     filmen die Show mit dem Handy; viele Emiratis tragen die weiße
     Kandura mit Ghutra und Agal bzw. die schwarze Abaya mit Schayla.
   Maßstab: Augenhöhe 5 m über dem Wasser (Terrasse 3,4 m + 1,6 m),
   Horizont y = 158, Brennweite 105: Punkt in d Metern, h Metern über dem
   Wasser, s Metern seitlich: y = 158 + (5 − h)·105/d, x = 200 + s·105/d.
   Burj Khalifa in 600 m (0,175 Einheiten je Meter), Fontänen in
   180–300 m, Souk in 80 m, Holzboot in 45 m, Geländer in 4 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "dubai", titel: "Dubai", emoji: "🏙️", thema: "Länder", kuerzel: "dxb", fassung: 854, breite: 400, hoehe: 260 });
{ const lg = S.lg, rg = S.rg, schon = {}; S.lg = (n, ...a) => schon["l" + n] || (schon["l" + n] = lg(n, ...a)); S.rg = (n, ...a) => schon["r" + n] || (schon["r" + n] = rg(n, ...a)); }
{ const teil = S.teil; S.teil = (t) => { if (t.anker) { const [ax, ay] = t.anker; t.kunst = `<g transform="translate(${B.r(t.x - ax)} ${B.r(t.y - ay)})">${t.kunst}</g>`; t.x = ax; t.y = ay; delete t.anker; } return teil(t); }; }
const rnd = zufall(828);
const r = B.r;
const HOR = 158, E = 5, F = 105, CX = 200, DECK = 3.4;
const yAt = (d, h = 0) => HOR + (E - h) * F / d;
const xAt = (s, d) => CX + s * F / d;
const uAt = (d) => F / d;
const klemm = (v, a, b) => Math.max(a, Math.min(b, v));
const P = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r(x) + " " + r(y)).join(" ") + " Z";
const glatt = (pts, zu = true) => {
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)} ${r(p2[0] - (p3[0] - p1[0]) / 6)} ${r(p2[1] - (p3[1] - p1[1]) / 6)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d + (zu ? " Z" : "");
};
/* Figuren verkleinern (Ladezeit): feine Linien weg, Zahlen kürzen – nie in transform="…" */
const vereinfache = (svg, stufe) => {
  const grenze = stufe > 1 ? 0.5 : 0.25;
  svg = svg.replace(/<(path|ellipse|line)\b[^>]*?\/>/g, (el) => { const sw = el.match(/stroke-width="([\d.]+)"/); return /fill="none"/.test(el) && sw && parseFloat(sw[1]) < grenze ? "" : el; });
  if (stufe > 1) { const f = stufe >= 1.8 ? 2 : 10; svg = svg.split(/(transform="[^"]*")/).map((t, i) => i % 2 ? t : t.replace(/(-?\d+\.\d+)/g, (m) => String(Math.round(parseFloat(m) * f) / f))).join(""); }
  return svg;
};

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("w05")}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".5"/></filter>`);
S.def(`<filter id="${S.id("w12")}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.2"/></filter>`);
S.def(`<filter id="${S.id("w3")}" x="-50%" y="-80%" width="200%" height="260%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="3"/></filter>`);
const W05 = `filter="url(#${S.id("w05")})"`, W12 = `filter="url(#${S.id("w12")})"`, W3 = `filter="url(#${S.id("w3")})"`;

/* =====================================================================
   KULISSE — Himmel über der Wüstenstadt (Mittagssonne links oben)
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 3}" fill="${S.lg("himmel", [[0, "#4a82c0"], [0.38, "#79a6d4"], [0.72, "#b9d0e2"], [0.9, "#e0e0d8"], [1, "#eee5d2"]])}"/>`);
S.hinten(`<rect width="400" height="${HOR}" fill="${S.rg("sonne", [[0, "#fff6e0", 0.55], [0.5, "#fff6e0", 0.12], [1, "#fff6e0", 0]], 0, 0, 0.75)}"/>`);
/* Dunstband über dem Horizont (Wüstenstaub) */
S.hinten(`<rect y="${HOR - 34}" width="400" height="36" fill="${S.lg("dunst", [[0, "#efe4cf", 0], [0.7, "#efe4cf", 0.55], [1, "#f1e6d2", 0.8]])}"/>`);
/* Haufenwolken: klar gezeichnet, oben links im Licht, unten flach und kühl */
{
  let w = "";
  const wolke = (x, y, s, nr) => {
    const L = [[-15, 0, 6], [-8, -4, 7.5], [1, -7, 9], [10, -4, 7], [17, -1, 5.5], [-21, 1, 4]];
    const cid = S.id("wk" + nr);
    S.def(`<clipPath id="${cid}"><rect x="${r(x - 30 * s)}" y="${r(y - 20 * s)}" width="${r(60 * s)}" height="${r(21.6 * s)}"/></clipPath>`);
    w += `<g clip-path="url(#${cid})">`;
    for (const [dx, dy, rr] of L) w += `<circle cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" r="${r(rr * s)}" fill="#b9c7d6"/>`;
    for (const [dx, dy, rr] of L) w += `<circle cx="${r(x + (dx - 0.8) * s)}" cy="${r(y + (dy - 1.1) * s)}" r="${r(rr * 0.9 * s)}" fill="#e9eef4"/>`;
    for (const [dx, dy, rr] of L.slice(0, 4)) w += `<circle cx="${r(x + (dx - 1.8) * s)}" cy="${r(y + (dy - 2.3) * s)}" r="${r(rr * 0.58 * s)}" fill="#ffffff"/>`;
    w += `</g>`;
  };
  wolke(300, 44, 1, 1); wolke(368, 84, 0.55, 2); wolke(178, 64, 0.5, 3);
  S.hinten(w);
}

/* =====================================================================
   1 — DIE WOLKENKRATZER von Downtown (1–1,5 km, im Dunst)
   ===================================================================== */
{
  let k = "";
  const TURM = [[112, 7, 18, "flach"], [124, 9, 31, "stufe"], [137, 6, 25, "krone"], [147, 10, 38, "schraeg"], [162, 7, 29, "flach"], [173, 6, 22, "flach"], [184, 9, 44, "nadel"], [199, 7, 27, "stufe"],
    [241, 9, 36, "stufe"], [253, 7, 28, "flach"], [264, 11, 47, "krone"], [279, 8, 24, "flach"], [290, 10, 35, "schraeg"], [304, 7, 22, "flach"], [314, 12, 30, "stufe"], [330, 8, 19, "flach"], [342, 9, 14, "flach"]];
  const yb = HOR + 0.6;
  for (const [x, w, h, art] of TURM) {
    const yt = yb - h, hell = x + w * 0.38;
    const nah = h > 30 ? 1 : 0;
    const lit = nah ? "#d4dde5" : "#dde3e6", sch = nah ? "#a9b8c6" : "#b9c4cd";
    let top = "";
    if (art === "stufe") top = `<rect x="${r(x + w * 0.18)}" y="${r(yt - 4)}" width="${r(w * 0.64)}" height="4.2" fill="${sch}"/><rect x="${r(x + w * 0.18)}" y="${r(yt - 4)}" width="${r(w * 0.22)}" height="4.2" fill="${lit}"/><rect x="${r(x + w * 0.34)}" y="${r(yt - 7)}" width="${r(w * 0.32)}" height="3.2" fill="${sch}"/>`;
    if (art === "krone") top = `<path d="M${r(x + 1)} ${r(yt)} L${r(x + 1)} ${r(yt - 5)} L${r(x + w / 2)} ${r(yt - 9)} L${r(x + w - 1)} ${r(yt - 5)} L${r(x + w - 1)} ${r(yt)} Z" fill="none" stroke="${sch}" stroke-width=".7"/><path d="M${r(x + w / 2)} ${r(yt - 9)} V${r(yt - 13)}" stroke="${sch}" stroke-width=".4"/>`;
    if (art === "schraeg") top = `<path d="M${r(x)} ${r(yt)} L${r(x + w)} ${r(yt - 6)} L${r(x + w)} ${r(yt)} Z" fill="${sch}"/>`;
    if (art === "nadel") top = `<rect x="${r(x + w * 0.25)}" y="${r(yt - 5)}" width="${r(w * 0.5)}" height="5" fill="${sch}"/><path d="M${r(x + w / 2 - 0.4)} ${r(yt - 5)} L${r(x + w / 2)} ${r(yt - 16)} L${r(x + w / 2 + 0.4)} ${r(yt - 5)} Z" fill="${sch}"/>`;
    k += top + `<rect x="${r(x)}" y="${r(yt)}" width="${r(w)}" height="${r(yb - yt)}" fill="${sch}"/><rect x="${r(x)}" y="${r(yt)}" width="${r(hell - x)}" height="${r(yb - yt)}" fill="${lit}"/>`;
    /* Glasrippen und ein Lichtstreif – keine Fensterreihen */
    for (let i = 1; i < 3; i++) k += `<rect x="${r(hell + (x + w - hell) * i / 3)}" y="${r(yt + 1)}" width=".25" height="${r(yb - yt - 1)}" fill="#97a8b8" opacity=".5"/>`;
    k += `<rect x="${r(x)}" y="${r(yt)}" width="${r(w)}" height=".5" fill="#eef2f4" opacity=".8"/>`;
  }
  /* niedrige Häuser davor */
  for (let x = 104; x < 352; x += 5 + rnd() * 6) { const h = 3 + rnd() * 6, w = 4 + rnd() * 6; if (x > 210 && x < 240) continue; k += `<rect x="${r(x)}" y="${r(yb - h)}" width="${r(w)}" height="${r(h)}" fill="${rnd() < 0.5 ? "#c8d0d6" : "#d8dcdc"}"/><rect x="${r(x)}" y="${r(yb - h)}" width="${r(w * 0.35)}" height="${r(h)}" fill="#e4e6e2"/>`; }
  /* Dunst über allem Fernen */
  k += `<rect x="100" y="${HOR - 50}" width="256" height="51" fill="${S.lg("ferndunst", [[0, "#ebe6da", 0], [1, "#ebe4d4", 0.55]])}"/>`;
  S.teil({ anker: [228, 140], id: "wolkenkratzer", de: "der Wolkenkratzer", syl: "WOL-ken-krat-zer", it: "il grattacielo", itSyl: "grat-ta-CIE-lo", en: "skyscraper", x: 0, y: 0, kunst: k,
    tipp: "Rund um den Burj Khalifa stehen viele Wolkenkratzer. Das Viertel heißt Downtown Dubai." });
}

/* =====================================================================
   2 — DER BURJ KHALIFA (600 m, 0,175 Einheiten je Meter)
   ===================================================================== */
const BU = F / 600, BX = 226;
const BQ = BU * 1.3;   /* quer: Flügel von Spitze zu Spitze rund 120 m sichtbar */
const bx = (s) => BX + s * BQ;
const by = (h) => HOR + (E - h) * BU;
/* Streifen [links, rechts (m), Oberkante (m), Farbe]: links im Licht, rechts im Schatten;
   die äußeren Flügel enden tiefer – so steigt die Spirale der Rücksprünge */
const STREIFEN = [
  [-48, -40, 104, "#e3e9ed"], [-40, -33, 196, "#d4dee6"], [-33, -26, 288, "#c6d3de"], [-26, -20, 372, "#b8c8d6"], [-20, -14, 452, "#a9bccd"], [-14, -9, 532, "#9cb1c4"],
  [-9, 0, 592, "#8fa6bb"], [0, 9, 592, "#5c7590"],
  [9, 14, 548, "#536d89"], [14, 20, 420, "#4c6683"], [20, 27, 326, "#46607d"], [27, 35, 232, "#405a77"], [35, 44, 136, "#3a5471"],
];
const NASE = [[-4, 0, 506, "#cbd8e3"], [0, 4, 506, "#6d87a1"]];   /* der Flügel, der auf uns zeigt */
const SPITZE = [[592, 640, 7.5], [640, 690, 5.6], [690, 738, 4], [738, 782, 2.6], [782, 812, 1.4], [812, 822, 0.7]];
let burjKlick = "";
{
  let k = "", clip = "";
  const rechteck = (s0, s1, top, fill, unten = -1) => { const x0 = bx(s0), x1 = bx(s1), y0 = by(top), y1 = by(unten); clip += `<rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}"/>`; return `<rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="${fill}"/>`; };
  for (const [s0, s1, top, f] of STREIFEN) k += rechteck(s0, s1, top, f);
  for (const [s0, s1, top, f] of NASE) k += rechteck(s0, s1, top, f);
  /* Spitze: der Kern läuft in Stufen aus, links Licht, rechts Schatten, Ringe an jedem Absatz */
  for (const [h0, h1, hw] of SPITZE) {
    k += rechteck(-hw, 0, h1, "#dce5ec", h0) + rechteck(0, hw, h1, "#6a829b", h0);
    k += `<rect x="${r(bx(-hw) - 0.1)}" y="${r(by(h0) - 0.3)}" width="${r(2 * hw * BQ + 0.2)}" height=".45" fill="#eef3f6"/>`;
  }
  k += `<path d="M${r(BX - 0.13)} ${r(by(822))} L${r(BX)} ${r(by(829))} L${r(BX + 0.13)} ${r(by(822))} Z" fill="#9aacbc"/>`;
  S.def(`<clipPath id="${S.id("burjclip")}">${clip}</clipPath>`);
  const CL = `clip-path="url(#${S.id("burjclip")})"`;
  /* Edelstahlrippen (senkrecht), Technikgeschosse (dunkle Bänder), Himmel spiegelt oben, Dunst unten */
  S.def(`<pattern id="${S.id("rippen")}" width=".62" height="20" patternUnits="userSpaceOnUse"><rect width=".12" height="20" fill="#ffffff" opacity=".4"/></pattern>`);
  k += `<g ${CL}><rect x="${r(bx(-50))}" y="10" width="${r(100 * BQ)}" height="150" fill="url(#${S.id("rippen")})"/>`;
  for (const h of [74, 158, 242, 326, 410, 456, 494, 555]) k += `<rect x="${r(bx(-50))}" y="${r(by(h))}" width="${r(100 * BQ)}" height="${h === 555 || h === 456 ? 1.1 : 0.5}" fill="#34495d" opacity="${h === 555 || h === 456 ? 0.55 : 0.32}"/>`;
  /* Glasflächen: diagonale Spiegelung des Himmels */
  k += `<rect x="${r(bx(-50))}" y="10" width="${r(100 * BQ)}" height="150" fill="${S.lg("burjglanz", [[0, "#ffffff", 0], [0.42, "#ffffff", 0.0], [0.5, "#ffffff", 0.28], [0.58, "#ffffff", 0], [1, "#ffffff", 0]], 0, 0, 1, 0.35)}"/>`;
  k += `<rect x="${r(bx(-50))}" y="10" width="${r(100 * BQ)}" height="150" fill="${S.lg("burjluft", [[0, "#d8e8f6", 0.25], [0.45, "#d8e8f6", 0], [0.8, "#efe4cf", 0.1], [1, "#efe4cf", 0.42]])}"/></g>`;
  /* Lichtkanten links an jedem Streifen, Absatzkanten oben (Terrassen mit kleinen Rippenkronen) */
  for (const [s0, s1, top] of [...STREIFEN, ...NASE]) {
    const licht = s1 <= 0;
    k += `<rect x="${r(bx(s0))}" y="${r(by(top))}" width=".22" height="${r(by(-1) - by(top))}" fill="${licht ? "#ffffff" : "#c9d6e2"}" opacity="${licht ? 0.65 : 0.35}"/>`;
    k += `<rect x="${r(bx(s0))}" y="${r(by(top) - 0.25)}" width="${r((s1 - s0) * BQ)}" height=".45" fill="${licht ? "#f7f9fa" : "#b8c7d4"}"/>`;
    for (let s = s0 + 1.6; s < s1 - 0.5; s += 2.2) k += `<rect x="${r(bx(s))}" y="${r(by(top) - 1.1)}" width=".14" height="1" fill="${licht ? "#e9eef1" : "#93a6b8"}"/>`;
  }
  /* Aussichtsplattformen: Glasbrüstung als heller Streif */
  for (const h of [456, 555]) k += `<rect x="${r(bx(-9))}" y="${r(by(h) - 0.35)}" width="${r(18 * BQ)}" height=".3" fill="#ffffff" opacity=".85"/>`;
  /* Fuß: der Sockelbau, der Park mit Palmen am anderen Ufer (500 m) */
  const yU = HOR + E * F / 520;
  k += `<path d="M${r(bx(-80))} ${r(yU)} L${r(bx(-80))} ${r(by(14))} L${r(bx(-30))} ${r(by(22))} L${r(bx(40))} ${r(by(20))} L${r(bx(90))} ${r(by(12))} L${r(bx(90))} ${r(yU)} Z" fill="#cfcabd"/>`;
  k += `<path d="M${r(bx(-80))} ${r(by(14))} L${r(bx(-30))} ${r(by(22))} L${r(bx(40))} ${r(by(20))} L${r(bx(90))} ${r(by(12))}" stroke="#ece6da" stroke-width=".4" fill="none"/>`;
  let ufer = `<rect x="100" y="${r(HOR - 1.2)}" width="260" height="${r(yU - HOR + 1.2)}" fill="#c7c4b4"/>`;
  for (let x = 102; x < 358; x += 2.6 + rnd() * 3) {
    const h = 1.2 + rnd() * 1.8, y = HOR - 0.6;
    ufer += `<ellipse cx="${r(x)}" cy="${r(y - h * 0.4)}" rx="${r(1 + rnd() * 1.2)}" ry="${r(h * 0.55)}" fill="${rnd() < 0.5 ? "#7f9278" : "#93a389"}"/>`;
    if (rnd() < 0.3) ufer += `<path d="M${r(x)} ${r(y)} V${r(y - h - 1.6)}" stroke="#8d8676" stroke-width=".25"/><path d="M${r(x - 1.3)} ${r(y - h - 1)} Q${r(x)} ${r(y - h - 2.4)} ${r(x + 1.3)} ${r(y - h - 1)}" stroke="#71856a" stroke-width=".6" fill="none"/>`;
  }
  k += ufer;
  burjKlick = k;
}
const burjUnter = [
  { id: "spitze", de: "die Spitze", syl: "SPIT-ze", it: "la guglia", itSyl: "GU-glia", en: "spire", x: BX, y: r(by(592)), kunst: flaeche(-2.6, -(by(592) - by(830)), 5.2, by(592) - by(830)),
    tipp: "Die Spitze ist aus Stahl und allein rund 240 Meter lang. Sie wurde von innen nach oben geschoben." },
  { id: "aussichtsplattform", de: "die Aussichtsplattform", syl: "AUS-sichts-platt-form", it: "la terrazza panoramica", itSyl: "ter-RAZ-za pa-no-RA-mi-ca", en: "observation deck", x: BX, y: r(by(548)), kunst: flaeche(-4.2, -5.2, 8.4, 5.6),
    tipp: "Die Aussichtsplattform „At the Top“ liegt 555 Meter hoch. Von dort sieht man das Meer und die Wüste." },
  { id: "fassade", de: "die Fassade", syl: "fas-SA-de", it: "la facciata", itSyl: "fac-CIA-ta", en: "facade", x: BX, y: r(by(470)), kunst: flaeche(-5.5, -(by(470) - by(530)), 11, by(470) - by(530)),
    tipp: "Die Fassade hat Tausende Glasscheiben mit Rippen aus Edelstahl. Das Glas hält die Hitze draußen." },
];
S.teil({ anker: [BX, 120], id: "burj_khalifa", de: "der Burj Khalifa", syl: "burdsch ka-LI-fa", it: "il Burj Khalifa", itSyl: "burj ka-LI-fa", en: "Burj Khalifa", x: 0, y: 0, kunst: burjKlick,
  zoom: { x: 177, y: 10, w: 99, h: 66 }, unter: burjUnter,
  tipp: "Der Burj Khalifa ist mit 828 Metern das höchste Gebäude der Welt. Er hat über 160 Stockwerke." });

/* =====================================================================
   3 — DER SEE (Burj-See): Wasser, Spiegelung des Turms, Wellen
   ===================================================================== */
const SEE_Y0 = HOR + 0.7, SEE_Y1 = 201;
{
  let k = `<rect x="0" y="${SEE_Y0}" width="400" height="${r(SEE_Y1 - SEE_Y0)}" fill="${S.lg("wasser", [[0, "#c4d4d2"], [0.12, "#93b6bc"], [0.45, "#4f8a9a"], [1, "#2a5f74"]])}"/>`;
  S.def(`<clipPath id="${S.id("seeclip")}"><rect x="0" y="${SEE_Y0}" width="400" height="${r(SEE_Y1 - SEE_Y0)}"/></clipPath>`);
  /* Spiegelbild des Turms: an der Wasserlinie (y ≈ 158,9) gespiegelt, gebrochen von Wellen */
  const ySp = by(0);
  let sp = "";
  for (const [s0, s1, top, f] of [...STREIFEN, ...NASE]) sp += `<rect x="${r(bx(s0))}" y="${r(ySp)}" width="${r((s1 - s0) * BQ)}" height="${r(by(0) - by(top))}" fill="${f}"/>`;
  k += `<g clip-path="url(#${S.id("seeclip")})" opacity=".42">${sp}</g>`;
  /* Spiegelung der fernen Türme, sehr schwach */
  k += `<rect x="104" y="${SEE_Y0}" width="248" height="5" fill="${S.lg("fernspiegel", [[0, "#dfe2dc", 0.5], [1, "#dfe2dc", 0]])}"/>`;
  /* Wellen: oben fein und dicht, nach vorn länger und kräftiger */
  let wl = "";
  for (let i = 0; i < 190; i++) {
    const t = Math.pow(rnd(), 1.5), y = SEE_Y0 + 0.6 + t * (SEE_Y1 - SEE_Y0 - 1), q = (y - HOR) / (SEE_Y1 - HOR);
    const l = 1.5 + q * 16 * (0.5 + rnd()), x = rnd() * (400 - l), hell = rnd() < 0.55;
    wl += `<path d="M${r(x)} ${r(y)} q${r(l / 2)} ${r(-0.35 - q * 0.6)} ${r(l)} 0" stroke="${hell ? "#eaf3f2" : "#21495a"}" stroke-width="${r(0.2 + q * 0.55)}" fill="none" opacity="${hell ? 0.55 : 0.4}"/>`;
  }
  k += wl;
  /* Glitzern links, wo die Sonne steht */
  for (let i = 0; i < 40; i++) { const x = rnd() * 150, y = 166 + rnd() * 32, l = 0.8 + rnd() * 2.6; k += `<rect x="${r(x)}" y="${r(y)}" width="${r(l)}" height=".35" fill="#ffffff" opacity="${r(0.5 + rnd() * 0.5)}"/>`; }
  S.teil({ anker: [250, 190], id: "see", de: "der See", syl: "SEE", it: "il lago", itSyl: "LA-go", en: "lake", x: 0, y: 0, kunst: k,
    tipp: "Der Burj-See ist künstlich angelegt. Rundherum stehen Hotels, Cafés und die Dubai Mall." });
}

/* =====================================================================
   4 — DIE FONTÄNE (Dubai Fountain, 180–300 m, Strahlen bis 150 m)
   Schwenkdüsen („Ruderer“) werfen gebogene Strahlen im Takt hin und her,
   dazwischen steigen die hohen „Super Shooter“ und zerstäuben oben.
   ===================================================================== */
{
  let k = "";
  const xL = 118, xR = 334;
  const ybase = (x) => 160.9 - (x - xL) / (xR - xL) * 1.15;
  /* Strahl entlang einer Mittellinie: Breite wächst nach oben, links Licht, rechts Eigenschatten */
  const strom = (pts, w0, w1, op) => {
    const n = pts.length, L = [], R = [], Rm = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      const nx = -dy / l, ny = dx / l, w = (w0 + (w1 - w0) * Math.pow(i / (n - 1), 1.3)) / 2;
      L.push([pts[i][0] - nx * w, pts[i][1] - ny * w]); R.push([pts[i][0] + nx * w, pts[i][1] + ny * w]); Rm.push([pts[i][0] + nx * w * 0.1, pts[i][1] + ny * w * 0.1]);
    }
    const Rr = R.slice().reverse(), voll = glatt([...L, ...Rr]);
    return `<path d="${voll}" fill="#ffffff" opacity="${r(op * 0.45)}" ${W05}/><path d="${voll}" fill="${S.lg("strahl", [[0, "#ffffff", 0.45], [0.3, "#ffffff", 0.92], [1, "#f6fafc", 0.97]])}" opacity="${op}"/>` +
      `<path d="${glatt([...Rm, ...Rr])}" fill="#8aa3b8" opacity="${r(op * 0.38)}"/>`;
  };
  /* Gischt am Fuß */
  k += `<ellipse cx="${(xL + xR) / 2}" cy="159.4" rx="${(xR - xL) / 2 + 5}" ry="3.6" fill="#ffffff" opacity=".75" ${W12}/>`;
  /* Ruderer: gebogene Strahlen, Neigung als Welle über die ganze Länge */
  for (let i = 0; i <= 24; i++) {
    const x = xL + 4 + i * 8.8, yb = ybase(x), neig = 0.55 * Math.sin(i * 0.62 + 0.4), H = 19 + 6 * Math.cos(i * 0.62 + 0.4) + (i % 2) * 2.5;
    const pts = [];
    for (let t = 0; t <= 1.001; t += 0.25) pts.push([x + neig * H * 0.9 * t * t, yb - H * (2 * t - t * t) * 1.0]);
    k += strom(pts, 0.9, 2.8, 0.8);
    const e = pts[pts.length - 1];
    k += `<ellipse cx="${r(e[0] + neig * 2)}" cy="${r(e[1] + 1.5)}" rx="2.6" ry="2.2" fill="#ffffff" opacity=".45" ${W12}/>`;
    for (let j = 0; j < 5; j++) k += `<circle cx="${r(e[0] + neig * (2 + j * 1.3) + (rnd() - 0.5) * 2)}" cy="${r(e[1] + 1.5 + j * 1.8 + rnd())}" r="${r(0.25 + rnd() * 0.25)}" fill="#ffffff" opacity=".8"/>`;
  }
  /* Super Shooter: schlanke Säule, oben eine weite Nebelkrone, Nebel sinkt seitlich ab */
  for (const [x, H, lean] of [[166, 58, -0.04], [192, 66, -0.02], [262, 64, 0.02], [292, 55, 0.04]]) {
    const yb = ybase(x), pts = [];
    for (let t = 0; t <= 1.001; t += 0.25) pts.push([x + lean * H * t, yb - H * t]);
    const tx = x + lean * H, ty = yb - H;
    k += `<path d="M${r(tx - 3)} ${r(ty + 4)} Q${r(tx - 10)} ${r(ty + 10)} ${r(tx - 9)} ${r(ty + H * 0.55)} L${r(tx - 5)} ${r(ty + H * 0.5)} Q${r(tx - 5)} ${r(ty + 12)} ${r(tx)} ${r(ty + 6)} Q${r(tx + 5)} ${r(ty + 12)} ${r(tx + 5)} ${r(ty + H * 0.5)} L${r(tx + 9)} ${r(ty + H * 0.55)} Q${r(tx + 10)} ${r(ty + 10)} ${r(tx + 3)} ${r(ty + 4)} Z" fill="#ffffff" opacity=".28" ${W12}/>`;
    k += strom(pts, 1.6, 8, 0.82);
    /* Wasserfäden im Strahl: hell links, bläulich rechts */
    for (const [o, c, w] of [[-0.25, "#ffffff", 0.45], [0.05, "#ffffff", 0.3], [0.3, "#9fb5c8", 0.35]]) k += `<path d="M${r(x + o * 1.2)} ${r(yb)} L${r(tx + o * 7)} ${r(ty + 3)}" stroke="${c}" stroke-width="${w}" opacity=".85"/>`;
    /* Krone: der Strahl zerstäubt, Tropfen fallen nach beiden Seiten zurück */
    for (const [ox, oy, rx, ry, o] of [[0, 3, 7, 5, 0.5], [-3.2, 1, 4.6, 3.6, 0.7], [3.2, 0.6, 4.6, 3.4, 0.65], [0, -2.2, 3.6, 2.8, 0.85]]) k += `<ellipse cx="${r(tx + ox)}" cy="${r(ty + oy)}" rx="${rx}" ry="${ry}" fill="#ffffff" opacity="${o}" ${W12}/>`;
    for (let j = 0; j < 14; j++) { const sd = j % 2 ? 1 : -1, t = 0.2 + rnd() * 0.8, dx = sd * (3 + t * 8), dy = -2 + t * t * 22; k += `<circle cx="${r(tx + dx)}" cy="${r(ty + dy)}" r="${r(0.22 + rnd() * 0.25)}" fill="#ffffff" opacity="${r(0.9 - t * 0.5)}"/>`; }
    k += `<path d="M${r(tx - 5)} ${r(ty + 4)} Q${r(tx - 10)} ${r(ty + 12)} ${r(tx - 10.5)} ${r(ty + 24)} L${r(tx - 7)} ${r(ty + 22)} Q${r(tx - 6)} ${r(ty + 11)} ${r(tx)} ${r(ty + 6)} Q${r(tx + 6)} ${r(ty + 11)} ${r(tx + 7)} ${r(ty + 22)} L${r(tx + 10.5)} ${r(ty + 24)} Q${r(tx + 10)} ${r(ty + 12)} ${r(tx + 5)} ${r(ty + 4)} Z" fill="#ffffff" opacity=".22" ${W12}/>`;
  }
  /* aufgewühltes Wasser und Spiegelung der Strahlen */
  for (let i = 0; i < 60; i++) { const x = xL + rnd() * (xR - xL), y = ybase(x) + 0.2 + rnd() * 1.4; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(1 + rnd() * 2.4)}" ry=".45" fill="#ffffff" opacity=".85"/>`; }
  for (let i = 0; i <= 24; i++) { const x = xL + 4 + i * 8.8, y0 = ybase(x) + 1.6; for (let j = 0; j < 4; j++) k += `<rect x="${r(x - 0.8)}" y="${r(y0 + j * 3.2)}" width="1.6" height="${r(1.8 - j * 0.3)}" fill="#ffffff" opacity="${r(0.36 - j * 0.08)}"/>`; }
  S.teil({ anker: [226, 150], id: "fontaene", de: "die Fontäne", syl: "fon-TÄ-ne", it: "la fontana", itSyl: "fon-TA-na", en: "fountain", x: 0, y: 0, kunst: k,
    tipp: "Die Fontänen der Dubai Fountain schießen bis zu 150 Meter hoch – im Takt der Musik." });
}

/* =====================================================================
   5 — DER BASAR: Souk Al Bahar (80 m, 1,31 Einheiten je Meter)
   ===================================================================== */
const SU = F / 80;
const sy = (h) => HOR + (E - h) * SU;
const sx = (s) => CX + s * SU;
const basarUnter = [];
{
  let k = "";
  const STEIN = S.lg("souklicht", [[0, "#ecd3a8"], [1, "#d6b585"]], 0, 0, 1, 0), STEIN2 = "#b48f62", FUGE = "#b99668";
  const yQ = sy(1.5), yW = sy(0);
  S.def(`<pattern id="${S.id("gitter")}" width="1" height="1" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#5a3a22"/><path d="M0 0 L1 1 M1 0 L0 1" stroke="#9a6a3c" stroke-width=".22"/></pattern>`);
  /* Abschnitte: [s0, s1, Höhe Dach] */
  const AB = [[-152, -112, 13.5], [-112, -72, 18], [-72, -35, 15.5]];
  /* rechte Seitenwand von Abschnitt C (fluchtet nach hinten, im Schatten) */
  { const s = -35, d1 = 104, h = 15.5;
    k += `<path d="M${r(sx(s))} ${r(sy(h))} L${r(xAt(s, d1))} ${r(yAt(d1, h))} L${r(xAt(s, d1))} ${r(yAt(d1, 1.5))} L${r(sx(s))} ${r(yQ)} Z" fill="${S.lg("soukseite", [[0, "#a9875c"], [1, "#8d6c45"]], 0, 0, 1, 0)}"/>`;
    for (const d of [84, 89, 94, 99]) { const x0 = xAt(s, d), x1 = xAt(s, d + 3.4); k += `<path d="M${r(x0)} ${r(yAt(d, 1.5))} L${r(x0)} ${r(yAt(d, 5.4))} Q${r((x0 + x1) / 2)} ${r(yAt(d + 1.7, 7))} ${r(x1)} ${r(yAt(d + 3.4, 5.4))} L${r(x1)} ${r(yAt(d + 3.4, 1.5))} Z" fill="#5a3a24"/>`; k += `<rect x="${r((x0 + x1) / 2 - 0.5)}" y="${r(yAt(d + 1.7, 12))}" width="1" height="${r(yAt(d, 9) - yAt(d, 12))}" fill="#4a2f1c"/>`; }
    k += `<path d="M${r(sx(s))} ${r(sy(h))} L${r(xAt(s, d1))} ${r(yAt(d1, h))}" stroke="#e9d3ad" stroke-width=".45"/><path d="M${r(sx(s))} ${r(sy(7.6))} L${r(xAt(s, d1))} ${r(yAt(d1, 7.6))}" stroke="#c9a676" stroke-width=".6"/>`; }
  for (const [s0, s1, h] of AB) {
    const x0 = sx(s0), x1 = sx(s1), yt = sy(h);
    k += `<rect x="${r(x0)}" y="${r(yt)}" width="${r(x1 - x0)}" height="${r(yQ - yt)}" fill="${STEIN}"/>`;
    /* Zinnen (Sharafat) auf der Brüstung */
    for (let x = x0 + 0.6; x < x1 - 1; x += 2.6) k += `<path d="M${r(x)} ${r(yt)} v-1.1 h.5 v-.6 h.9 v.6 h.5 v1.1 Z" fill="#e4c99c"/><rect x="${r(x + 1.4)}" y="${r(yt - 1.7)}" width=".4" height="1.7" fill="#b9966a" opacity=".6"/>`;
    k += `<rect x="${r(x0)}" y="${r(yt)}" width="${r(x1 - x0)}" height=".7" fill="#f6e4c2"/><rect x="${r(x0)}" y="${r(yt + 0.7)}" width="${r(x1 - x0)}" height=".5" fill="#a8845a" opacity=".55"/>`;
    /* Gesims über dem Erdgeschoss */
    k += `<rect x="${r(x0)}" y="${r(sy(7.6))}" width="${r(x1 - x0)}" height=".9" fill="#f2dcb4"/><rect x="${r(x0)}" y="${r(sy(7.6) + 0.9)}" width="${r(x1 - x0)}" height=".5" fill="#9c7a50" opacity=".6"/>`;
    /* Obergeschosse: Fenster mit Holzgittern (Maschrabiyya), Schatten rechts unter dem Sturz */
    const reihen = h > 16 ? [10.4, 14.6] : [10.4];
    for (const hf of reihen) for (let x = x0 + 2.4; x < x1 - 3; x += 5.9) {
      const yo = sy(hf + 1.4), yu = sy(hf - 1.4);
      k += `<rect x="${r(x - 0.4)}" y="${r(yo - 0.6)}" width="3.2" height="${r(yu - yo + 1)}" fill="#c9a676"/><rect x="${r(x)}" y="${r(yo)}" width="2.4" height="${r(yu - yo)}" fill="url(#${S.id("gitter")})"/><rect x="${r(x)}" y="${r(yo)}" width="2.4" height=".45" fill="#2e1d10" opacity=".55"/>`;
    }
    /* Erdgeschoss: Arkade mit Spitzbögen; dahinter Schatten und warmes Licht der Läden */
    for (let x = x0 + 0.9; x < x1 - 4; x += 5.9) {
      const a = x + 0.9, b = x + 5, ys = sy(5.3), yk = sy(6.9);
      k += `<path d="M${r(a)} ${r(yQ)} L${r(a)} ${r(ys)} Q${r(a)} ${r(yk - 0.4)} ${r((a + b) / 2)} ${r(yk)} Q${r(b)} ${r(yk - 0.4)} ${r(b)} ${r(ys)} L${r(b)} ${r(yQ)} Z" fill="${S.lg("bogen", [[0, "#5b3a26"], [0.6, "#7a5236"], [1, "#a8774a"]])}"/>`;
      k += `<path d="M${r(a)} ${r(ys)} Q${r(a)} ${r(yk - 0.4)} ${r((a + b) / 2)} ${r(yk)}" stroke="#f5e1bc" stroke-width=".35" fill="none"/>`;
      k += `<rect x="${r(a + 0.6)}" y="${r(sy(3.2))}" width="${r(b - a - 1.2)}" height="1.3" fill="#e9b468" opacity=".55"/>`;
    }
  }
  /* Windtürme (Barjeel): Schaft, oben Schlitze, Zinnen, herausragende Holzstangen */
  const windturm = (s, h, w) => {
    const x0 = sx(s - w / 2), x1 = sx(s + w / 2), yt = sy(h), yR = sy(h - 8), side = 1.2;
    let t = `<path d="M${r(x1)} ${r(yt)} L${r(x1 + side)} ${r(yt + 0.5)} L${r(x1 + side)} ${r(sy(12))} L${r(x1)} ${r(sy(12))} Z" fill="${STEIN2}"/>`;
    t += `<rect x="${r(x0)}" y="${r(yt)}" width="${r(x1 - x0)}" height="${r(sy(12) - yt)}" fill="${STEIN}"/>`;
    t += `<rect x="${r(x0)}" y="${r(yt)}" width=".35" height="${r(sy(12) - yt)}" fill="#fbecd0" opacity=".9"/>`;
    const n = 3, sw = (x1 - x0 - 1.4) / n;
    for (let i = 0; i < n; i++) t += `<rect x="${r(x0 + 0.7 + i * sw + sw * 0.2)}" y="${r(yt + 1.8)}" width="${r(sw * 0.6)}" height="${r(yR - yt - 2)}" rx=".3" fill="#4a2f1c"/>`;
    t += `<rect x="${r(x0 - 0.3)}" y="${r(yR)}" width="${r(x1 - x0 + 0.6)}" height=".7" fill="#f2dcb4"/><rect x="${r(x0 - 0.3)}" y="${r(yt + 1)}" width="${r(x1 - x0 + 0.6)}" height=".55" fill="#f2dcb4"/>`;
    for (const yy of [yt + 3.4, yR - 1.4]) t += `<rect x="${r(x0 - 0.9)}" y="${r(yy)}" width="${r(x1 - x0 + 1.8)}" height=".32" fill="#6b4a2c"/>`;
    for (let x = x0; x < x1 - 0.5; x += 1.6) t += `<path d="M${r(x)} ${r(yt)} v-1 l.4 -.6 l.4 .6 v1 Z" fill="#e4c99c"/>`;
    t += `<path d="M${r(x0)} ${r(yt)} v-2.2 M${r(x1)} ${r(yt)} v-2.2" stroke="#e9d1a6" stroke-width=".5"/>`;
    return t;
  };
  k += windturm(-134, 24, 6.5) + windturm(-92, 28, 7.5) + windturm(-52, 25.5, 6.5);
  /* Kai, Wasserlinie, kleine Palmen und Schirme der Cafés */
  k += `<rect x="0" y="${r(yQ)}" width="${r(sx(-35))}" height="${r(yW - yQ)}" fill="#b59a74"/><rect x="0" y="${r(yQ)}" width="${r(sx(-35))}" height=".45" fill="#f1e2c4"/>`;
  for (let i = 0; i < 9; i++) { const x = 6 + i * 16.5 + (i % 2) * 3, y = yQ; k += `<path d="M${r(x - 2.6)} ${r(y - 2.6)} L${r(x)} ${r(y - 3.6)} L${r(x + 2.6)} ${r(y - 2.6)} Z" fill="#f4ecdc"/><path d="M${r(x)} ${r(y - 2.6)} V${r(y)}" stroke="#7a5a3a" stroke-width=".25"/><rect x="${r(x - 1.2)}" y="${r(y - 1.1)}" width="2.4" height=".3" fill="#6a4a30"/>`; }
  for (const x of [14, 46, 79, 112, 146]) {
    const y = yQ, h = 9;
    k += `<path d="M${r(x)} ${r(y)} Q${r(x + 0.4)} ${r(y - h / 2)} ${r(x + 0.2)} ${r(y - h)}" stroke="#7a6248" stroke-width=".7" fill="none"/>`;
    for (const a of [-170, -140, -110, -70, -40, -10, 160, 20]) { const rad = a * Math.PI / 180, L = 3.6; k += `<path d="M${r(x + 0.2)} ${r(y - h)} q${r(Math.cos(rad) * L * 0.6)} ${r(Math.sin(rad) * L * 0.6 - 0.8)} ${r(Math.cos(rad) * L)} ${r(Math.sin(rad) * L + 1.4)}" stroke="${a < -90 || a > 90 ? "#4f6a3c" : "#6d8a4c"}" stroke-width=".75" fill="none" stroke-linecap="round"/>`; }
  }
  /* Spiegelbild im Wasser, von Wellen zerschnitten */
  S.def(`<clipPath id="${S.id("soukspiegel")}"><rect x="0" y="${r(yW)}" width="${r(sx(-35))}" height="14"/></clipPath>`);
  let sp = "";
  for (const [s0, s1, h] of AB) sp += `<rect x="${r(sx(s0))}" y="${r(yW)}" width="${r(sx(s1) - sx(s0))}" height="${r(yW - sy(h))}" fill="#c9ab7c"/>`;
  for (const [s, h] of [[-134, 24], [-92, 28], [-52, 25.5]]) sp += `<rect x="${r(sx(s - 3.2))}" y="${r(yW)}" width="${r(6.4 * SU)}" height="${r(yW - sy(h))}" fill="#c4a171"/>`;
  k += `<g clip-path="url(#${S.id("soukspiegel")})" opacity=".45">${sp}`;
  for (let y = yW + 0.8; y < yW + 14; y += 1.1 + rnd() * 0.6) k += `<rect x="0" y="${r(y)}" width="${r(sx(-35))}" height="${r(0.35 + (y - yW) * 0.03)}" fill="#3f7a8c"/>`;
  k += `</g>`;
  /* Lupe: Windturm, Arkade, Holzgitter (Abschnitt B) */
  basarUnter.push({ id: "windturm", de: "der Windturm", syl: "WIND-turm", it: "la torre del vento", itSyl: "TOR-re del VEN-to", en: "wind tower", x: r(sx(-92)), y: r(sy(18)), kunst: flaeche(-5.6, -(sy(18) - sy(28)) - 2.4, 11.2, sy(18) - sy(28) + 2.4),
    tipp: "Der Windturm fängt den Wind oben ein und leitet ihn nach unten. So blieben die Häuser früher ohne Strom kühl." });
  basarUnter.push({ id: "arkade", de: "die Arkade", syl: "ar-KA-de", it: "il porticato", itSyl: "por-ti-CA-to", en: "arcade", x: r(sx(-92)), y: r(yQ), kunst: flaeche(-26, -(yQ - sy(7.6)), 52, yQ - sy(7.6)),
    tipp: "Unter den Bögen der Arkade liegen Läden und Cafés – dort sitzt man im Schatten." });
  basarUnter.push({ id: "holzgitter", de: "das Holzgitter", syl: "HOLZ-git-ter", it: "la grata di legno", itSyl: "GRA-ta di LE-gno", en: "wooden lattice", x: r(sx(-104)), y: r(sy(8.4)), kunst: flaeche(-5, -(sy(8.4) - sy(16.6)), 22, sy(8.4) - sy(16.6)),
    tipp: "Durch das Holzgitter („Maschrabiyya“) kommt Luft, aber kaum Sonne. Man sieht hinaus, ohne gesehen zu werden." });
  S.teil({ anker: [80, 150], id: "basar", de: "der Basar", syl: "ba-SAR", it: "il bazar", itSyl: "ba-ZAR", en: "bazaar", x: 0, y: 0, kunst: k,
    zoom: { x: 55, y: 123, w: 60, h: 40 }, unter: basarUnter,
    tipp: "Der Souk Al Bahar („Markt der Seeleute“) ist ein Basar im alten arabischen Stil – mit Läden, Cafés und Restaurants." });
}

/* =====================================================================
   6 — DAS HOLZBOOT (Abra, 45 m, fährt nach links)
   ===================================================================== */
{
  const u = uAt(45), X = 116, yW = yAt(45, 0), L = 10 * u, x0 = X - L / 2, x1 = X + L / 2;
  const yG = yAt(45, 0.9), yD = yAt(45, 2.5);
  let k = "";
  /* Kielwasser hinter dem Heck (rechts) */
  k += `<path d="M${r(x1 - 1)} ${r(yW + 0.2)} L${r(x1 + 22)} ${r(yW - 0.6)} L${r(x1 + 24)} ${r(yW + 1.6)} Z" fill="#ffffff" opacity=".35"/><path d="M${r(x1 - 2)} ${r(yW + 0.5)} q8 1.6 20 .8 M${r(x1)} ${r(yW + 0.1)} q10 -.6 22 -.9" stroke="#ffffff" stroke-width=".4" fill="none" opacity=".8"/>`;
  k += `<path d="M${r(x0 - 1.5)} ${r(yW + 0.1)} q-2 .5 -3 1.4" stroke="#ffffff" stroke-width=".5" fill="none" opacity=".8"/>`;
  /* Rumpf: Teakholz, Bug links hochgezogen */
  k += `<path d="M${r(x0 - 1.6)} ${r(yG - 1)} Q${r(x0 + 1)} ${r(yW + 0.4)} ${r(x0 + 4)} ${r(yW + 0.3)} L${r(x1 - 1)} ${r(yW + 0.3)} Q${r(x1 + 0.6)} ${r(yW)} ${r(x1 + 0.4)} ${r(yG)} Z" fill="${S.lg("rumpf", [[0, "#b8783e"], [0.5, "#8a5228"], [1, "#5e3618"]])}"/>`;
  k += `<path d="M${r(x0 - 1.6)} ${r(yG - 1)} Q${r(x0 + 2)} ${r(yG)} ${r(x0 + 5)} ${r(yG)} L${r(x1 + 0.4)} ${r(yG)}" stroke="#e1b27a" stroke-width=".45" fill="none"/>`;
  k += `<path d="M${r(x0 + 1)} ${r(yG + 1.2)} L${r(x1)} ${r(yG + 1.2)}" stroke="#4a2a12" stroke-width=".3" opacity=".7"/>`;
  /* Fahrgäste auf der Mittelbank, der Bootsführer hinten */
  const kopf = [[x0 + 5.5, "#2b2b2b", "#d24d3a"], [x0 + 8.3, "#5a3a20", "#f2f0ea"], [x0 + 11, "#1d1d1d", "#3a6fa8"], [x0 + 13.6, "#6b4a2a", "#e8c24a"]];
  for (const [x, haar, hemd] of kopf) k += `<path d="M${r(x - 0.9)} ${r(yG)} L${r(x - 0.8)} ${r(yG - 2.1)} Q${r(x)} ${r(yG - 2.6)} ${r(x + 0.8)} ${r(yG - 2.1)} L${r(x + 0.9)} ${r(yG)} Z" fill="${hemd}"/><circle cx="${r(x)}" cy="${r(yG - 3.1)}" r=".62" fill="#c99a74"/><path d="M${r(x - 0.62)} ${r(yG - 3.2)} a.62 .62 0 0 1 1.24 0" fill="${haar}"/>`;
  k += `<rect x="${r(x1 - 3.4)}" y="${r(yG - 2.8)}" width="1.6" height="2.8" fill="#f4f3ee"/><circle cx="${r(x1 - 2.6)}" cy="${r(yG - 3.5)}" r=".6" fill="#b88a64"/><path d="M${r(x1 - 3.3)} ${r(yG - 3.6)} q.7 -.9 1.4 0" fill="#f7f6f2"/>`;
  /* Dach auf Pfosten, Sonnendach mit Fransen */
  for (const x of [x0 + 3.4, X, x1 - 1.6]) k += `<rect x="${r(x - 0.18)}" y="${r(yD)}" width=".36" height="${r(yG - yD)}" fill="#6a3f1e"/>`;
  k += `<path d="M${r(x0 + 2)} ${r(yD)} L${r(x1 - 0.4)} ${r(yD)} L${r(x1)} ${r(yD + 0.9)} L${r(x0 + 1.6)} ${r(yD + 0.9)} Z" fill="#f2eadb"/><rect x="${r(x0 + 2)}" y="${r(yD - 0.4)}" width="${r(L - 2.4)}" height=".5" fill="#ffffff"/>`;
  for (let x = x0 + 2; x < x1 - 0.6; x += 0.9) k += `<rect x="${r(x)}" y="${r(yD + 0.9)}" width=".45" height=".55" fill="#c9302c"/>`;
  /* Spiegelung */
  k += `<path d="M${r(x0 + 2)} ${r(yW + 0.6)} L${r(x1)} ${r(yW + 0.6)} L${r(x1 - 1)} ${r(yW + 2.6)} L${r(x0 + 3)} ${r(yW + 2.6)} Z" fill="#4a2c18" opacity=".35"/>`;
  S.teil({ anker: [X, yW], id: "holzboot", de: "das Holzboot", syl: "HOLZ-boot", it: "la barca di legno", itSyl: "BAR-ca di LE-gno", en: "wooden boat", x: 0, y: 0, kunst: k,
    tipp: "Mit dem Holzboot (arabisch „Abra“) kann man über den See fahren – ganz nah an die Fontänen." });
}

/* =====================================================================
   7 — DIE TERRASSE (Boden aus hellem Kalkstein, 1,65–4 m)
   ===================================================================== */
const Y_KANTE = yAt(4, DECK);   /* 200 */
const FIG = {
  tourist: { x: 150, d: 3.4 },
  mann: { x: 350, d: 3.8 }, frau: { x: 373, d: 3.85 },
  tisch: { x: 292, d: 3.0 },
};
{
  let k = `<rect x="0" y="${r(Y_KANTE)}" width="400" height="${r(260 - Y_KANTE)}" fill="${S.lg("stein", [[0, "#efe5d2"], [0.35, "#e3d4ba"], [1, "#d3bf9e"]])}"/>`;
  /* Spiegelung des hellen Himmels im polierten Stein (hinten) */
  k += `<rect x="0" y="${r(Y_KANTE)}" width="400" height="14" fill="${S.lg("steinglanz", [[0, "#ffffff", 0.45], [1, "#ffffff", 0]])}"/>`;
  /* Fugen: Längsfugen zum Fluchtpunkt, Querfugen in der Tiefe */
  let fu = "";
  const kante = (a, b) => { /* Strecke auf 0 ≤ x ≤ 400 kürzen */
    let [x0, y0] = a, [x1, y1] = b;
    const cut = (xa, ya, xb, yb, X) => [X, ya + (yb - ya) * (X - xa) / (xb - xa)];
    if (x1 < 0) [x1, y1] = cut(x0, y0, x1, y1, 0); if (x1 > 400) [x1, y1] = cut(x0, y0, x1, y1, 400);
    return (x0 < 0 || x0 > 400) ? "" : `M${r(x0)} ${r(y0)} L${r(x1)} ${r(Math.min(y1, 260))} `;
  };
  for (let s = -12; s <= 12; s += 1.2) fu += kante([xAt(s, 4), Y_KANTE], [xAt(s, 1.6), yAt(1.6, DECK)]);
  for (const d of [3.4, 2.85, 2.4, 2.05, 1.76]) { const y = yAt(d, DECK); fu += `M0 ${r(y)} H400 `; }
  /* einzelne Platten etwas heller oder dunkler (Naturstein) */
  const ds = [4, 3.4, 2.85, 2.4, 2.05, 1.76, 1.55];
  for (let j = 0; j < ds.length - 1; j++) for (let s = -12; s < 12; s += 1.2) {
    if (rnd() > 0.32) continue;
    const q = [[xAt(s, ds[j]), yAt(ds[j], DECK)], [xAt(s + 1.2, ds[j]), yAt(ds[j], DECK)], [xAt(s + 1.2, ds[j + 1]), yAt(ds[j + 1], DECK)], [xAt(s, ds[j + 1]), yAt(ds[j + 1], DECK)]];
    if (q.every((p) => p[0] < 0) || q.every((p) => p[0] > 400)) continue;
    k += `<path d="${P(q.map(([x, y]) => [klemm(x, 0, 400), Math.min(y, 260)]))}" fill="${rnd() < 0.5 ? "#c9b08a" : "#fbf4e6"}" opacity=".2"/>`;
  }
  k += `<path d="${fu}" stroke="#b89f7c" stroke-width=".35" fill="none" opacity=".75"/>`;
  k += `<path d="${fu}" stroke="#fffaf0" stroke-width=".25" fill="none" opacity=".5" transform="translate(.35 .35)"/>`;
  /* Schlagschatten nach rechts (Sonne links): Pflanzkübel, Menschen, Tisch, Stühle */
  const sch = (x, y, l, b, a = 0.3) => `<path d="M${r(x - 2)} ${r(y)} Q${r(x + l * 0.5)} ${r(y - b)} ${r(x + l)} ${r(y - b * 0.3)} Q${r(x + l * 0.5)} ${r(y + b * 0.8)} ${r(x - 2)} ${r(y + 0.6)} Z" fill="#5a4630" opacity="${a}" ${W05}/>`;
  for (const [n, l] of [["tourist", 46], ["mann", 38], ["frau", 24]]) { const f = FIG[n]; k += sch(f.x, yAt(f.d, DECK), l, 2.4); }
  k += sch(FIG.tisch.x - 4, yAt(FIG.tisch.d, DECK), 30, 2.4, 0.26);
  k += `<path d="M84 200 L126 200 L120 212 L60 212 Z" fill="#5a4630" opacity=".22" ${W05}/>`;
  S.teil({ anker: [200, 238], id: "terrasse", de: "die Terrasse", syl: "ter-RAS-se", it: "la terrazza", itSyl: "ter-RAZ-za", en: "terrace", x: 0, y: 0, kunst: k,
    tipp: "Von der Terrasse der Dubai Mall sieht man die Show am besten. Die Mall ist eines der größten Einkaufszentren der Welt." });
}

/* =====================================================================
   8 — DAS GELÄNDER (Glasbrüstung, 1,1 m, in 4 m)
   ===================================================================== */
{
  const u = uAt(4), yO = yAt(4, DECK + 1.1), yU = Y_KANTE;
  let k = `<g pointer-events="none"><rect x="0" y="${r(yO)}" width="400" height="${r(yU - yO)}" fill="${S.lg("glas", [[0, "#dff0ee", 0.18], [1, "#a9d0d0", 0.32]])}"/>`;
  for (let i = 0; i < 8; i++) { const x = 18 + i * 46 + (i % 3) * 5; k += `<path d="M${r(x)} ${r(yU)} L${r(x + 9)} ${r(yO)} L${r(x + 13)} ${r(yO)} L${r(x + 4)} ${r(yU)} Z" fill="#ffffff" opacity=".13"/>`; }
  k += `</g>`;
  /* Pfosten (alle 1,5 m), Bodenschiene, Handlauf aus Edelstahl */
  for (let s = -7.5; s <= 7.6; s += 1.5) { const x = klemm(xAt(s, 4), 0.9, 399.1); k += `<rect x="${r(x - 0.9)}" y="${r(yO)}" width="1.8" height="${r(yU - yO)}" fill="${S.lg("pfosten", [[0, "#f2f4f5"], [0.5, "#a9b2b8"], [1, "#6c757c"]], 0, 0, 1, 0)}"/>`; }
  k += `<rect x="0" y="${r(yU - 2.2)}" width="400" height="2.2" fill="#8d969c"/><rect x="0" y="${r(yU - 2.2)}" width="400" height=".5" fill="#d9dee1"/>`;
  k += `<rect x="0" y="${r(yO - 1.6)}" width="400" height="2.2" rx="1" fill="${S.lg("handlauf", [[0, "#ffffff"], [0.35, "#c8d0d5"], [1, "#6d777e"]])}"/>`;
  S.teil({ anker: [200, yO], id: "gelaender", de: "das Geländer", syl: "ge-LÄN-der", it: "la ringhiera", itSyl: "rin-GHIE-ra", en: "railing", x: 0, y: 0, kunst: k });
}

/* =====================================================================
   9 — DIE PALME (Dattelpalme im Steinkübel, 3,2–4 m)
   ===================================================================== */
{
  let k = "";
  const d0 = 3.2, d1 = 3.95, s0 = -5.7, s1 = -4.3, hK = DECK + 0.55;
  const A = [xAt(s0, d0), yAt(d0, hK)], Bp = [xAt(s1, d0), yAt(d0, hK)], C = [xAt(s1, d1), yAt(d1, hK)], D = [xAt(s0, d1), yAt(d1, hK)];
  const Au = [A[0], yAt(d0, DECK)], Bu = [Bp[0], yAt(d0, DECK)], Cu = [C[0], yAt(d1, DECK)];
  k += `<path d="${P([Bp, C, Cu, Bu])}" fill="#b49a74"/>`;
  k += `<path d="${P([A, Bp, Bu, Au])}" fill="${S.lg("kuebel", [[0, "#efe1c6"], [1, "#d2bd98"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="${P([A, Bp, C, D])}" fill="#7a5a3a"/><path d="${P([A, Bp, C, D])}" fill="none" stroke="#f6ead4" stroke-width=".8"/>`;
  k += `<path d="M${r(A[0])} ${r(A[1] + 2.4)} H${r(Bp[0])}" stroke="#c4ad88" stroke-width=".5"/>`;
  /* Stamm: Blattbasen als Rautenmuster, links Licht */
  const fx = xAt(-5, 3.55), fy = yAt(3.55, hK), tx = fx + 3, ty = 66;
  S.def(`<pattern id="${S.id("stamm")}" width="5" height="4" patternUnits="userSpaceOnUse"><path d="M0 4 L2.5 0 L5 4 M-2.5 4 L0 0 M5 0 L7.5 4" stroke="#3e2f20" stroke-width=".55" fill="none" opacity=".55"/><path d="M0 3.6 L2.5 -.4 L5 3.6" stroke="#cdb48a" stroke-width=".3" fill="none" opacity=".5"/></pattern>`);
  const stamm = `M${r(fx - 6.5)} ${r(fy)} Q${r(fx - 4)} ${r((fy + ty) / 2)} ${r(tx - 5)} ${r(ty)} L${r(tx + 5)} ${r(ty)} Q${r(fx + 6)} ${r((fy + ty) / 2)} ${r(fx + 6.5)} ${r(fy)} Z`;
  k += `<path d="${stamm}" fill="${S.lg("stammfarbe", [[0, "#b0946a"], [0.4, "#8a7050"], [1, "#4f3d2a"]], 0, 0, 1, 0)}"/><path d="${stamm}" fill="url(#${S.id("stamm")})"/>`;
  k += `<path d="M${r(fx - 6.5)} ${r(fy)} Q${r(fx - 4)} ${r((fy + ty) / 2)} ${r(tx - 5)} ${r(ty)}" stroke="#e2cb9f" stroke-width=".6" fill="none" opacity=".7"/>`;
  /* Krone: gefiederte Wedel, hinten dunkel, vorn hell; Fiederblättchen mit Lücken (Himmel scheint durch) */
  const kx = tx, ky = ty - 2;
  const wedel = (a, L, haeng, farbe, dunkel) => {
    const rad = a * Math.PI / 180, c = Math.cos(rad), s = Math.sin(rad);
    const p0 = [kx, ky], p2 = [kx + c * L, ky + s * L + haeng * L * 0.7], p1 = [kx + c * L * 0.55, ky + s * L * 0.55 - L * 0.18];
    const Q = (t) => [(1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]];
    let blatt = "";
    for (let t = 0.14; t < 0.97; t += 0.06) {
      const a0 = Q(t), a1 = Q(t + 0.01), tg = [a1[0] - a0[0], a1[1] - a0[1]], tl = Math.hypot(tg[0], tg[1]) || 1, ex = [tg[0] / tl, tg[1] / tl];
      const len = L * 0.17 * (1 - 0.55 * t) + 1.5;
      for (const sd of [-1, 1]) {
        const nx = -ex[1] * sd, ny = ex[0] * sd;
        const tip = [a0[0] + (ex[0] * 0.55 + nx * 0.75) * len, a0[1] + (ex[1] * 0.55 + ny * 0.75) * len + len * 0.35];
        const b1 = [a0[0] - ex[0] * 0.5, a0[1] - ex[1] * 0.5], b2 = [a0[0] + ex[0] * 0.9, a0[1] + ex[1] * 0.9];
        blatt += `M${r(klemm(b1[0], 0, 400))} ${r(klemm(b1[1], 0, 260))} L${r(klemm(tip[0], 0, 400))} ${r(klemm(tip[1], 0, 260))} L${r(klemm(b2[0], 0, 400))} ${r(klemm(b2[1], 0, 260))} Z`;
      }
    }
    let w = `<path d="${blatt}" fill="${farbe}"/>`;
    const pts = [0, 0.25, 0.5, 0.75, 1].map(Q).map(([x, y]) => [klemm(x, 0, 400), klemm(y, 0, 260)]);
    w += `<path d="${glatt(pts, false)}" stroke="${dunkel ? "#5d5a3e" : "#d6cf9c"}" stroke-width="${dunkel ? 0.6 : 0.75}" fill="none"/>`;
    return w;
  };
  for (const [a, L, h] of [[-150, 66, 0.45], [-112, 60, 0.15], [-78, 62, 0.12], [-35, 72, 0.38], [8, 68, 0.62], [168, 56, 0.75]]) k += wedel(a, L, h, "#3f5a37", true);
  for (const [a, L, h] of [[-170, 72, 0.62], [-132, 72, 0.3], [-95, 58, 0.05], [-58, 70, 0.22], [-16, 76, 0.5], [22, 58, 0.85], [150, 50, 0.95], [52, 44, 1.0]]) k += wedel(a, L, h, "#62804c", false);
  /* Licht von links oben auf den oberen Wedeln */
  for (const [a, L, h] of [[-124, 52, 0.2], [-70, 48, 0.12]]) k += wedel(a, L, h, "#8aa868", false);
  k += `<ellipse cx="${r(kx)}" cy="${r(ky + 1)}" rx="4.5" ry="3" fill="#5e4a30"/>`;
  S.teil({ anker: [55, 120], id: "palme", de: "die Palme", syl: "PAL-me", it: "la palma", itSyl: "PAL-ma", en: "palm tree", x: 0, y: 0, kunst: k,
    tipp: "Die Dattelpalme wächst gut in der Hitze der Wüste. Ihre Früchte heißen Datteln." });
}

/* =====================================================================
   10 — DER STUHL (zwei Bistrostühle) und 11 — DER TISCH mit Lupe
   ===================================================================== */
const T = FIG.tisch, TU = uAt(T.d), TY = yAt(T.d, DECK + 0.75), TBODEN = yAt(T.d, DECK);
{
  let k = "";
  const stuhl = (x, d, dir) => {
    const u = uAt(d), yS = yAt(d, DECK + 0.46), yL = yAt(d, DECK), yR = yAt(d, DECK + 0.92), w = 0.42 * u, t = 3.2;
    const xb = x - dir * w / 2, xf = x + dir * w / 2;
    let c = "";
    /* Hinterbeine, Lehne (Rattan-Geflecht), Sitz mit Polster, Vorderbeine – dunkles Metall */
    c += `<path d="M${r(xb)} ${r(yS)} L${r(xb - dir * 1.2)} ${r(yL)} M${r(xb + dir * 1.4)} ${r(yS + 1)} L${r(xb + dir * 1)} ${r(yL - 1.4)}" stroke="#2f2a26" stroke-width="1" stroke-linecap="round"/>`;
    c += `<path d="M${r(xb - dir * 0.3)} ${r(yS)} L${r(xb - dir * 1.4)} ${r(yR)} Q${r(xb + dir * 1)} ${r(yR - 1.6)} ${r(xb + dir * 3.6)} ${r(yR - 0.6)} L${r(xb + dir * 2.2)} ${r(yS - 1)} Z" fill="#c7a46e" stroke="#2f2a26" stroke-width=".9"/>`;
    c += `<path d="M${r(xb - dir * 0.6)} ${r(yS - 3)} L${r(xb + dir * 2.6)} ${r(yS - 3.4)} M${r(xb - dir * 0.9)} ${r(yS - 6)} L${r(xb + dir * 3)} ${r(yS - 6.6)} M${r(xb - dir * 1.1)} ${r(yS - 9)} L${r(xb + dir * 3.3)} ${r(yS - 9.6)}" stroke="#8a6a3e" stroke-width=".5"/>`;
    c += `<path d="M${r(xb)} ${r(yS - 0.2)} L${r(xf)} ${r(yS - 0.2)} L${r(xf + dir * 1.2)} ${r(yS + t * 0.4)} L${r(xb + dir * 1.2)} ${r(yS + t * 0.4)} Z" fill="#f1e9d8"/><path d="M${r(xb)} ${r(yS + t * 0.4)} L${r(xf + dir * 1.2)} ${r(yS + t * 0.4)} L${r(xf + dir * 1.2)} ${r(yS + t * 0.4 + 1.2)} L${r(xb)} ${r(yS + t * 0.4 + 1.2)} Z" fill="#d6c8ae"/>`;
    c += `<path d="M${r(xf + dir * 0.6)} ${r(yS + 1.6)} L${r(xf + dir * 1.6)} ${r(yL)} M${r(xf - dir * 1.4)} ${r(yS + 1.6)} L${r(xf - dir * 1.2)} ${r(yL - 1.2)}" stroke="#2f2a26" stroke-width="1" stroke-linecap="round"/>`;
    c += `<path d="M${r(xb)} ${r(yS + 2.2)} L${r(xf + dir * 1.2)} ${r(yS + 2.2)}" stroke="#2f2a26" stroke-width=".7"/>`;
    return c;
  };
  k += stuhl(T.x - 21, 3.05, 1) + stuhl(T.x + 21, 3.05, -1);
  S.teil({ anker: [T.x, TBODEN], id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: 0, y: 0, kunst: k });
}
const tischUnter = [];
{
  const rx = 0.42 * TU, ry = rx * (E - DECK - 0.75) / T.d;
  let k = "";
  /* Fuß und Säule (schwarzes Metall), Platte aus weißem Marmor */
  k += `<ellipse cx="${T.x}" cy="${r(TBODEN - 0.4)}" rx="7" ry="1.6" fill="#2a2724"/><rect x="${r(T.x - 1.1)}" y="${r(TY)}" width="2.2" height="${r(TBODEN - TY - 0.8)}" fill="${S.lg("saeule", [[0, "#6b6560"], [0.4, "#3a3632"], [1, "#1c1a18"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="${T.x}" cy="${r(TY + 1.3)}" rx="${r(rx)}" ry="${r(ry)}" fill="#a39d94"/><ellipse cx="${T.x}" cy="${r(TY)}" rx="${r(rx)}" ry="${r(ry)}" fill="${S.lg("marmor", [[0, "#ffffff"], [1, "#e4e0d8"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(T.x - rx * 0.7)} ${r(TY + 0.4)} q6 -1.4 11 .2 t9 -.6" stroke="#c9c3b8" stroke-width=".25" fill="none"/>`;
  /* Dallah (Messing): Fuß, Bauch, hoher Hals mit Spitzdeckel, langer Schnabel, Henkel */
  const dx = T.x - 9, dy = TY + 0.3, s = TU / 100;  /* 1 Einheit hier = 1 cm */
  const MESSING = S.lg("messing", [[0, "#fff1b8"], [0.35, "#e2b552"], [0.7, "#a87420"], [1, "#6e4a12"]], 0, 0, 1, 0);
  let dal = `<g transform="translate(${r(dx)} ${r(dy)}) scale(${(s * 1).toFixed(4)})">`;
  dal += `<path d="M-6 0 L6 0 L4.6 -2.2 Q8 -6 7 -11 Q6 -14 3 -15 L2.6 -19 Q4 -21 2.4 -22 L-2.4 -22 Q-4 -21 -2.6 -19 L-3 -15 Q-6 -14 -7 -11 Q-8 -6 -4.6 -2.2 Z" fill="${MESSING}"/>`;
  dal += `<path d="M-6.6 -12 Q-14 -15 -17 -24 Q-17.5 -26 -15.6 -25 Q-12 -19 -6 -16 Z" fill="${MESSING}"/>`;
  dal += `<path d="M-2.4 -22 Q0 -30 2.4 -22 Z" fill="${MESSING}"/><circle cx="0" cy="-29.6" r="1.1" fill="#e9c66a"/>`;
  dal += `<path d="M5 -15.5 Q11 -16 10 -9 Q9.6 -5 6.4 -4" stroke="#8a5e18" stroke-width="1.3" fill="none"/>`;
  dal += `<path d="M-6.4 -7 H6.4 M-6.8 -11 H6.8 M-3 -18 H3" stroke="#7a5212" stroke-width=".5" opacity=".7"/>`;
  dal += `<path d="M-5.6 -12 Q-5 -5 -3.6 -2.6" stroke="#fff8d8" stroke-width="1" fill="none" opacity=".8"/></g>`;
  k += dal;
  /* zwei kleine Tassen ohne Henkel (Finjan), weiß mit Goldrand, mit Kaffee */
  const tasse = (x, y) => `<path d="M${r(x - 1.3)} ${r(y - 1.9)} L${r(x + 1.3)} ${r(y - 1.9)} L${r(x + 0.85)} ${r(y)} L${r(x - 0.85)} ${r(y)} Z" fill="${S.lg("porzellan", [[0, "#ffffff"], [1, "#d8d6d0"]], 0, 0, 1, 0)}"/><ellipse cx="${r(x)}" cy="${r(y - 1.9)}" rx="1.3" ry=".38" fill="#c9a24a"/><ellipse cx="${r(x)}" cy="${r(y - 1.85)}" rx="1.05" ry=".28" fill="#a0782e"/>`;
  k += tasse(T.x - 1.6, TY + 1) + tasse(T.x + 1.6, TY + 0.4);
  /* Teller mit Datteln */
  const px = T.x + 6.4, py = TY + 0.7;
  k += `<ellipse cx="${r(px)}" cy="${r(py)}" rx="4" ry="1.15" fill="#e9e4da"/><ellipse cx="${r(px)}" cy="${r(py - 0.1)}" rx="3.2" ry=".8" fill="#ffffff"/>`;
  for (const [ox, oy, a] of [[-1.8, -0.5, -20], [-0.6, -0.8, 10], [0.7, -0.6, -15], [1.9, -0.4, 25], [-1, -1.3, 30], [0.4, -1.5, -5], [1.4, -1.2, 15]]) k += `<ellipse cx="${r(px + ox)}" cy="${r(py + oy)}" rx=".85" ry=".52" transform="rotate(${a} ${r(px + ox)} ${r(py + oy)})" fill="${S.lg("dattel", [[0, "#a8551c"], [0.6, "#6a2c0c"], [1, "#3a1606"]])}"/><ellipse cx="${r(px + ox - 0.2)}" cy="${r(py + oy - 0.2)}" rx=".3" ry=".14" fill="#e9a060" opacity=".7"/>`;
  /* Kamel als Andenken (Plüsch, 18 cm) */
  const kx = T.x + 12.6, ky = TY - 0.3, ks = TU / 100;
  let kam = `<g transform="translate(${r(kx)} ${r(ky)}) scale(${ks.toFixed(4)})">`;
  const FELL = S.lg("fell", [[0, "#f0d8a8"], [1, "#b88a52"]]);
  kam += `<path d="M-5 0 L-4.4 -7 M-2.2 0 L-2 -7 M3 0 L2.8 -7 M5.4 0 L4.8 -7" stroke="#b08048" stroke-width="1.5" stroke-linecap="round"/>`;
  kam += `<path d="M-6 -7 Q-7 -10 -5 -12 Q-3 -16 0 -12.4 Q2.6 -16 5 -12 Q6.6 -10 6 -7 Q0 -5.6 -6 -7 Z" fill="${FELL}"/>`;
  kam += `<path d="M5 -9 Q8 -10 8.4 -14 Q8.6 -17 10 -17.4 L12.4 -16.6 Q13 -15.6 11.6 -15.2 L10.4 -15 Q9.8 -11 7 -7.6 Z" fill="${FELL}"/>`;
  kam += `<circle cx="10.6" cy="-16.4" r=".45" fill="#2a1a0a"/><path d="M9.6 -17.6 l-.4 -1 l.9 .5" fill="#b88a52"/>`;
  kam += `<path d="M-4 -10.5 Q-1 -9 2 -10.6" stroke="#c8302a" stroke-width="1.1" fill="none"/><path d="M-3 -10 l.5 1.6 M0 -9.6 l0 1.7 M2 -10.2 l-.3 1.6" stroke="#e8c24a" stroke-width=".5"/>`;
  kam += `<path d="M-6.2 -8.6 Q-8.6 -8 -8 -5" stroke="#b08048" stroke-width=".8" fill="none"/></g>`;
  k += kam;
  tischUnter.push({ id: "kaffeekanne", de: "die Kaffeekanne", syl: "KAF-fee-kan-ne", it: "la caffettiera", itSyl: "caf-fet-TIE-ra", en: "coffee pot", x: r(dx), y: r(dy), kunst: flaeche(-17.5 * s, -30 * s, 29 * s, 30.5 * s),
    tipp: "In der Kaffeekanne (arabisch „Dallah“) ist arabischer Kaffee mit Kardamom." });
  tischUnter.push({ id: "tasse", de: "die Tasse", syl: "TAS-se", it: "la tazzina", itSyl: "taz-ZI-na", en: "cup", x: T.x, y: r(TY + 1.2), kunst: flaeche(-3.2, -3.4, 6.4, 3.6),
    tipp: "Arabischer Kaffee kommt in kleine Tassen ohne Henkel. Man schenkt immer nur ein wenig ein." });
  tischUnter.push({ id: "dattel", de: "die Dattel", syl: "DAT-tel", it: "il dattero", itSyl: "DAT-te-ro", en: "date", x: r(px), y: r(py + 1.2), kunst: flaeche(-4.1, -3.4, 8.2, 3.6),
    tipp: "Zum Kaffee isst man Datteln. Sie sind sehr süß und wachsen an der Dattelpalme." });
  tischUnter.push({ id: "kamel", de: "das Kamel", syl: "ka-MEL", it: "il cammello", itSyl: "cam-MEL-lo", en: "camel", x: r(kx), y: r(ky + 0.3), kunst: flaeche(-8 * ks, -18 * ks, 21 * ks, 18.4 * ks),
    tipp: "Das Kamel aus Stoff ist ein beliebtes Andenken. Echte Kamele tragen in der Wüste Menschen und Lasten." });
  S.teil({ anker: [T.x, TBODEN], id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolino", itSyl: "ta-vo-LI-no", en: "table", x: 0, y: 0, kunst: k,
    zoom: { x: T.x - 21, y: TY - 20, w: 45, h: 30 }, unter: tischUnter });
}

/* =====================================================================
   12 — DIE EINKAUFSTÜTE (Papier, neben dem rechten Stuhl)
   ===================================================================== */
{
  const d = 3.15, u = uAt(d), x = 328, yB = yAt(d, DECK), w = 0.3 * u, h = 0.36 * u, t = 3;
  let k = `<path d="M${r(x - w / 2)} ${r(yB)} L${r(x - w / 2)} ${r(yB - h)} L${r(x + w / 2)} ${r(yB - h)} L${r(x + w / 2)} ${r(yB)} Z" fill="${S.lg("tuete", [[0, "#fbf7ef"], [1, "#e5dccb"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(x + w / 2)} ${r(yB)} L${r(x + w / 2)} ${r(yB - h)} L${r(x + w / 2 + t)} ${r(yB - h - 1)} L${r(x + w / 2 + t)} ${r(yB - 1)} Z" fill="#cfc4ae"/>`;
  k += `<rect x="${r(x - w / 2)}" y="${r(yB - h * 0.42)}" width="${r(w)}" height="1.6" fill="#b88a3a"/><rect x="${r(x - w / 2)}" y="${r(yB - h)}" width="${r(w)}" height=".6" fill="#ece3d2"/>`;
  k += `<path d="M${r(x - w * 0.25)} ${r(yB - h)} Q${r(x)} ${r(yB - h - 6)} ${r(x + w * 0.25)} ${r(yB - h)}" stroke="#7a5a2a" stroke-width=".6" fill="none"/>`;
  S.teil({ anker: [x, yB], id: "einkaufstuete", de: "die Einkaufstüte", syl: "EIN-kaufs-tü-te", it: "la borsa della spesa", itSyl: "BOR-sa DEL-la SPE-sa", en: "shopping bag", x: 0, y: 0, kunst: k,
    tipp: "In Dubai kann man viel einkaufen: Gold, Gewürze, Stoffe – und alles in großen Einkaufszentren." });
}

/* =====================================================================
   13 — DAS GEWAND (Kandura mit Ghutra, Abaya mit Schayla) — ein Paar
   ===================================================================== */
{
  const W = "#f5f4ef";
  const mann = B.mensch({ id: "dxb_mann", geschlecht: "m", blick: 205, frisur: "kurz", haarfarbe: "schwarz", haut: "mittel",
    kleidung: { oberteil: { stueck: "hemd", farbe: W }, kleid: { stueck: "abendkleid", farbe: W }, kopf: { stueck: "kopftuch", farbe: W }, schuhe: { stueck: "sandale", farbe: "braun" } } }, 1.76 * uAt(FIG.mann.d));
  const frau = B.mensch({ id: "dxb_frau", geschlecht: "w", blick: 195, frisur: "dutt", haarfarbe: "schwarz", haut: "mittel",
    kleidung: { oberteil: { stueck: "bluse", farbe: "#1c1c21" }, kleid: { stueck: "abendkleid", farbe: "#1c1c21" }, kopf: { stueck: "kopftuch", farbe: "#18181c" }, zubehoer: { stueck: "tasche", farbe: "#b08a4a" } } }, 1.62 * uAt(FIG.frau.d));
  /* Ghutra: weißes Tuch fällt über Nacken und Schultern, oben der schwarze Agal (Doppelring) */
  const tuch = (m, farbe, agal) => {
    const p = m.z.punkte, kx = m.z.kopf.x, top = p.scheitel[1], nk = p.nacken[1];
    let t = `<path d="M${r(kx - 9.2)} ${r(top + 6)} Q${r(kx - 11.5)} ${r(nk - 2)} ${r(kx - 17)} ${r(nk + 14)} Q${r(kx)} ${r(nk + 21)} ${r(kx + 16)} ${r(nk + 13)} Q${r(kx + 11)} ${r(nk - 2)} ${r(kx + 9.2)} ${r(top + 6)} Q${r(kx)} ${r(top - 2.4)} ${r(kx - 9.2)} ${r(top + 6)} Z" fill="${farbe}"/>`;
    t += `<path d="M${r(kx - 4)} ${r(nk - 6)} Q${r(kx - 7)} ${r(nk + 6)} ${r(kx - 9)} ${r(nk + 15)} M${r(kx + 4)} ${r(nk - 6)} Q${r(kx + 6)} ${r(nk + 6)} ${r(kx + 8)} ${r(nk + 14)}" stroke="${agal ? "#cfccc2" : "#000"}" stroke-width="1" fill="none" opacity=".6"/>`;
    t += `<path d="M${r(kx - 9.2)} ${r(top + 6)} Q${r(kx - 11.5)} ${r(nk - 2)} ${r(kx - 17)} ${r(nk + 14)}" stroke="${agal ? "#ffffff" : "#4a4a52"}" stroke-width="1.2" fill="none" opacity=".8"/>`;
    if (agal) t += `<ellipse cx="${r(kx)}" cy="${r(top + 4.2)}" rx="9.4" ry="2.6" fill="none" stroke="#141414" stroke-width="1.5"/><ellipse cx="${r(kx)}" cy="${r(top + 6.4)}" rx="9.6" ry="2.6" fill="none" stroke="#1d1d1d" stroke-width="1.3"/>`;
    return `<g transform="scale(${m.k.toFixed(4)})">${t}</g>`;
  };
  const yM = yAt(FIG.mann.d, DECK), yF = yAt(FIG.frau.d, DECK);
  const k = `<g transform="translate(${FIG.frau.x - FIG.mann.x} ${r(yF - yM)})">${vereinfache(frau.svg, 1.8)}${tuch(frau, "#1d1d22", false)}</g>` + vereinfache(mann.svg, 1.8) + tuch(mann, W, true);
  S.teil({ id: "gewand", de: "das Gewand", syl: "ge-WAND", it: "la veste tradizionale", itSyl: "VE-ste tra-di-zio-NA-le", en: "traditional robe", x: FIG.mann.x, y: r(yM), kunst: k,
    tipp: "Viele Männer tragen die Kandura, ein langes weißes Gewand. Viele Frauen tragen die Abaya, ein langes schwarzes Gewand." });
}

/* =====================================================================
   14 — DER TOURIST filmt die Show, 15 — DAS HANDY
   ===================================================================== */
{
  const f = FIG.tourist, u = uAt(f.d), y = yAt(f.d, DECK);
  const foto = {
    lende: 1, brust: -3, nacken: 2, kopf: -6,
    schulterL: { vor: 66, seit: 14 }, ellbogenL: 98, unterarmL: 40, handL: 10, fingerL: 0.5,
    schulterR: { vor: 64, seit: 16 }, ellbogenR: 100, unterarmR: 40, handR: 10, fingerR: 0.5,
    huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -6, seit: 4, dreh: -10 }, knieR: 6, fussR: 4,
  };
  const m = B.mensch({ id: "dxb_tour", geschlecht: "m", pose: foto, blick: 186, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#3f7fae" }, unterteil: { stueck: "shorts", farbe: "beige" }, kopf: { stueck: "kappe", farbe: "#f2f0ea" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#b8452e" } } }, 1.8 * u);
  S.teil({ id: "tourist", de: "der Tourist", syl: "tou-RIST", it: "il turista", itSyl: "tu-RI-sta", en: "tourist", x: f.x, y: r(y), kunst: vereinfache(m.svg, 1.8),
    tipp: "Der Tourist filmt die Wasserspiele. Die Show dauert nur fünf bis sechs Minuten." });
  /* Das Handy (quer, 15 × 7,5 cm): der Bildschirm zeigt zu uns – darauf Turm und Fontänen */
  const hs = [m.z.handL, m.z.handR].filter(Boolean);
  const hx = f.x + hs.reduce((a, h) => a + h.x, 0) / hs.length * m.k, hy = y + Math.min(...hs.map((h) => h.y)) * m.k;
  const pw = 0.15 * u * 1.15, ph = 0.075 * u * 1.15;
  let k = `<rect x="${r(-pw / 2)}" y="${r(-ph / 2)}" width="${r(pw)}" height="${r(ph)}" rx=".5" fill="#17181b"/>`;
  k += `<rect x="${r(-pw / 2 + 0.3)}" y="${r(-ph / 2 + 0.3)}" width="${r(pw - 0.6)}" height="${r(ph - 0.6)}" fill="${S.lg("bildschirm", [[0, "#7fb0dc"], [0.7, "#d9e6ee"], [1, "#4f8a9a"]])}"/>`;
  k += `<path d="M.3 ${r(ph / 2 - 0.5)} L.3 ${r(-ph / 2 + 0.5)} L.5 ${r(ph / 2 - 0.5)} Z" fill="#7d93a8"/>`;
  for (const [ox, h] of [[-1.6, 1.2], [-0.9, 1.6], [-0.2, 1.1], [1, 1.5], [1.7, 1]]) k += `<rect x="${r(ox)}" y="${r(ph / 2 - 0.45 - h)}" width=".3" height="${h}" fill="#ffffff"/>`;
  k += `<rect x="${r(-pw / 2 + 0.3)}" y="${r(-ph / 2 + 0.3)}" width=".8" height=".5" rx=".2" fill="#e0453a"/>`;
  S.teil({ oben: true, id: "handy", de: "das Handy", syl: "HÄN-dy", it: "il cellulare", itSyl: "cel-lu-LA-re", en: "mobile phone", x: r(hx), y: r(hy - ph * 0.2), kunst: k + flaeche(-pw / 2 - 1, -ph / 2 - 1, pw + 2, ph + 2) });
}

/* VORNE: Mittagslicht von links, leichte Wärme unten (fängt keinen Tipp ab) */
S.davor(`<rect width="400" height="260" fill="${S.lg("mittagslicht", [[0, "#fff4dc", 0.12], [0.5, "#fff4dc", 0], [1, "#1a2a3a", 0.06]], 0, 0, 1, 0)}" pointer-events="none"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/dubai.js"));
console.log(aus);
