#!/usr/bin/env node
/* =====================================================================
   NEW YORK (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (NPS „Statue of Liberty – Statistics“, Brooklyn Bridge Park,
   NYC DOT „Brooklyn Bridge“, SOM/Port Authority „One World Trade
   Center“, ESB-Baudaten, Chrysler-Building-Baudaten, NYC TLC):
   - STANDORT: Brooklyn Bridge Park, oben auf den Granitstufen von Pier 1
     („Granite Prospect“, Augenhöhe ≈ 5 m über der Promenade). Blick nach
     Westnordwest über den East River auf Lower Manhattan. Die echten
     Richtungen von hier: Freiheitsstatue im Südwesten (links, 4,8 km),
     Financial District mit dem One World Trade Center im Nordwesten
     (1,8 km), der Manhattan-Pfeiler der Brooklyn Bridge im Nordnordwesten
     (0,8 km), Empire State Building fast genau im Norden (5 km), das
     Chrysler Building rechts daneben (5,5 km), der Brooklyn-Pfeiler der
     Brücke nah im Nordosten (0,35 km), dahinter die Backsteinhäuser von
     Fulton Ferry/DUMBO. Weitwinkel-Panorama (≈ 150° gestaucht); die fernen
     Wahrzeichen (Statue, Midtown) sind wie mit dem Teleobjektiv
     herangeholt — so zeigen es auch die Postkarten.
   - FREIHEITSSTATUE: 93 m vom Boden bis zur Fackel; Sockel (Hunt, Granit,
     27 m) auf dem Fundament im sternförmigen Fort Wood (11 Zacken);
     die Figur 46 m, Kupfer mit grünem Grünspan. Rechter Arm hoch mit der
     vergoldeten Flamme, links im Arm die Tafel „JULY IV MDCCLXXVI“, Krone
     mit 7 Strahlen und 25 Fenstern. Sie blickt nach Südosten — von
     Brooklyn sieht man sie schräg von vorn, die Fackel links.
   - ONE WORLD TRADE CENTER: 541 m (1776 Fuß) mit der 124 m hohen weißen
     Antenne; quadratischer Sockel, darüber acht lange Dreiecksflächen aus
     Glas, oben ein um 45° gedrehtes Quadrat. Davor stehen von hier aus
     die Türme des Financial District: 70 Pine (Art déco, Spitze),
     40 Wall Street (grüne Pyramide), 3 und 4 WTC, 130 William, 8 Spruce
     (Gehry, gewellter Edelstahl), das Woolworth Building (Neugotik, grüne
     Kupferspitze), das Municipal Building (goldene Figur).
   - BROOKLYN BRIDGE (1883): zwei Pfeiler aus Granit und Kalkstein, 84 m,
     je zwei hohe neugotische Spitzbögen; vier Tragkabel, senkrechte
     Hänger und die typischen schrägen Seile, die vom Pfeiler fächerförmig
     zur Fahrbahn laufen; oben auf beiden Pfeilern die US-Flagge. Den
     Manhattan-Pfeiler sieht man von hier fast von vorn (Bögen), den nahen
     Brooklyn-Pfeiler schräg.
   - EMPIRE STATE BUILDING: 381 m, mit Antenne 443 m; Art déco aus
     Kalkstein, Rücksprünge, Turmschaft mit senkrechten Pfeilern, oben der
     Mast (einst für Luftschiffe gedacht) und die Antenne.
   - CHRYSLER BUILDING: 319 m; Krone aus sieben gestuften Bögen aus
     Edelstahl mit dreieckigen Fenstern (Sonnenstrahl), Nadel obenauf.
   - VORNE: Promenade mit Geländer, Imbisswagen mit blau-gelbem Schirm
     (Hotdogs, Brezeln, Senf), Bank mit Bagel und dem blau-weißen
     Pappbecher, Backsteinhaus mit Feuertreppe und hölzernem Wassertank
     auf dem Dach, Hydrant, Yellow Cab (gelb, „NYC TAXI“, Dachschild mit
     Lizenznummer) auf dem Kopfsteinpflaster der Fulton Ferry Landing,
     links im Hafen die orange Staten-Island-Fähre.
   Maßstab: Horizont y = 150, Augenhöhe 5 m über der Promenade. Vorne
   gilt: Einheiten je Meter = (y − 150) / 5. Das Geländer am Wasser steht
   bei y = 200 (≈ 42 m entfernt), der Verkäufer (Fuß y 238) ≈ 31 Einheiten.
   Licht: Vormittag, die Sonne steht links hinter uns (Südosten).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "new_york", titel: "New York", emoji: "🗽", thema: "Länder", kuerzel: "nyc", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1886);
const r = B.r;
const HOR = 150;
const um = (y) => (y - HOR) / 5;   /* Einheiten je Meter auf der Promenade */

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.2 0.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".35"/></filter>`);
/* Fenster-Raster als Muster (klein im Download, fein im Bild) */
S.def(`<pattern id="${S.id("glasr")}" width="1.1" height="1.3" patternUnits="userSpaceOnUse"><rect y="1.05" width="1.1" height=".25" fill="#1d2a36" opacity=".35"/><rect x=".9" width=".2" height="1.3" fill="#fff" opacity=".18"/></pattern>`);
S.def(`<pattern id="${S.id("steinr")}" width="1.4" height="1.6" patternUnits="userSpaceOnUse"><rect x=".35" y=".3" width=".7" height=".9" fill="#2c3540" opacity=".55"/></pattern>`);
S.def(`<pattern id="${S.id("steinv")}" width="1.2" height="2" patternUnits="userSpaceOnUse"><rect x=".3" width=".6" height="2" fill="#2c3540" opacity=".45"/><rect x=".3" y="1.6" width=".6" height=".4" fill="#d9d2c4" opacity=".5"/></pattern>`);
S.def(`<pattern id="${S.id("ziegel")}" width="2" height="1" patternUnits="userSpaceOnUse"><rect width="2" height="1" fill="none"/><path d="M0 .95 H2 M1 0 V.5 M0 .5 H2 M.0 .5 V1" stroke="#5e2a1c" stroke-width=".12" opacity=".55"/></pattern>`);
S.def(`<pattern id="${S.id("pflaster")}" width="3.2" height="1.6" patternUnits="userSpaceOnUse"><rect width="3.2" height="1.6" fill="none"/><path d="M0 1.55 H3.2 M1.6 0 V.8 M0 .78 H3.2 M.0 .8 V1.6 M3.2 .8 V1.6" stroke="#4a4540" stroke-width=".22" opacity=".7"/></pattern>`);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#aab2b9"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const GRUENSPAN = S.lg("gruenspan", [[0, "#9fd0bf"], [0.45, "#6fae9b"], [1, "#3f7a6b"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff4b0"], [0.4, "#f2c443"], [1, "#b77f12"]], 0, 0, 1, 1);
const GRANIT = S.lg("granit", [[0, "#e4d6c6"], [0.5, "#d2c1ae"], [1, "#b8a691"]], 0, 0, 1, 0);
const EISEN = S.lg("eisen", [[0, "#3a3f3c"], [0.45, "#5a605c"], [1, "#222624"]], 0, 0, 1, 0);
const TAXIGELB = S.lg("taxigelb", [[0, "#ffe27a"], [0.35, "#f9c623"], [1, "#d39a07"]]);

/* =====================================================================
   KULISSE — Himmel, ferne Ufer (New Jersey), Promenade, Pflaster
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 3}" fill="${S.lg("himmel", [[0, "#4a82c4"], [0.5, "#86b2dc"], [0.85, "#c8dcea"], [1, "#e6ecec"]])}"/>`);
S.hinten(`<ellipse cx="40" cy="20" rx="160" ry="90" fill="${S.rg("hell", [[0, "#fffbe6", 0.45], [1, "#fffbe6", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[70, 30, 1.2], [180, 14, 0.8], [250, 40, 1.0], [345, 22, 1.25], [120, 62, 0.6], [390, 70, 0.7]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".93">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 17, 5.4], [-11, 1.6, 11, 4.2], [12, 1.2, 13, 4.6], [-3, -4, 10, 5.4], [7, -4.4, 8, 4.8]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `<ellipse cx="${x}" cy="${r(y + 3.4 * s)}" rx="${r(19 * s)}" ry="${r(2.3 * s)}" fill="#d6e1ec"/></g>`;
  }
  S.hinten(w);
}
/* New Jersey: flaches Ufer im Dunst, links Bayonne, hinter Manhattan die
   Hochhäuser von Jersey City (blass, weit weg) */
{
  let c = `<g filter="url(#${S.id("dunst")})">`;
  c += `<path d="M0 150.4 L0 148.6 Q40 147.6 80 148.4 L150 148.8 L150 150.6 Z" fill="#a9b8bf"/>`;
  let x = 66;
  while (x < 104) {
    const w = 3 + rnd() * 4, h = 6 + rnd() * 18;
    c += `<rect x="${r(x)}" y="${r(150 - h)}" width="${r(w)}" height="${r(h)}" fill="${rnd() < 0.5 ? "#b2c0c9" : "#a6b5bf"}"/>`;
    x += w + 0.6;
  }
  c += `</g>`;
  S.hinten(c);
}
/* Die Promenade (Granitplatten in Fluchtperspektive) und rechts das
   Kopfsteinpflaster der Fulton Ferry Landing */
{
  const Y0 = 200;
  let f = `<rect x="0" y="${Y0}" width="400" height="${260 - Y0}" fill="${S.lg("promenade", [[0, "#b9b2a6"], [1, "#9c958a"]])}"/>`;
  for (let i = -22; i <= 22; i++) f += `<line x1="${r(200 + i * 11)}" y1="${Y0}" x2="${r(200 + i * 26.4)}" y2="260" stroke="#7f786d" stroke-width=".35" opacity=".6"/>`;
  for (const y of [203, 207, 212, 218, 226, 235, 246, 259]) f += `<line x1="0" y1="${y}" x2="400" y2="${y}" stroke="#7f786d" stroke-width=".35" opacity=".55"/>`;
  for (let i = 0; i < 150; i++) f += `<circle cx="${r(rnd() * 400)}" cy="${r(Y0 + 2 + rnd() * 58)}" r="${r(0.15 + rnd() * 0.3)}" fill="${rnd() < 0.5 ? "#ddd7cc" : "#7a7368"}" opacity=".5"/>`;
  /* Kopfsteinpflaster rechts vorne (Belgian Blocks), mit Bordstein */
  f += `<path d="M262 260 Q284 226 352 218 L400 216 L400 260 Z" fill="${S.lg("pfl", [[0, "#78716a"], [1, "#5d5751"]])}"/>`;
  f += `<path d="M262 260 Q284 226 352 218 L400 216 L400 260 Z" fill="url(#${S.id("pflaster")})"/>`;
  f += `<path d="M258 260 Q280 224 352 215.6 L400 213.8" stroke="${S.lg("bord", [[0, "#d9d3c8"], [1, "#a39c90"]])}" stroke-width="2.4" fill="none"/>`;
  f += `<rect x="0" y="${Y0}" width="400" height="60" fill="${S.lg("prolicht", [[0, "#fff", 0.1], [0.6, "#fff", 0], [1, "#000", 0.08]], 0, 0, 1, 0)}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DER EAST RIVER (mit dem Hafen links, Spiegelungen)
   ===================================================================== */
{
  const Y0 = 150.3, Y1 = 201;
  let k = `<rect x="0" y="${Y0}" width="400" height="${r(Y1 - Y0)}" fill="${S.lg("wasser", [[0, "#b9cdd6"], [0.25, "#7f9fb0"], [0.7, "#4e6f80"], [1, "#3a5664"]])}"/>`;
  /* Spiegelbilder der Skyline (weich, nach unten verzogen) */
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".32">`;
  for (const [x, w, h, c] of [[106, 10, 22, "#cfd6d4"], [118, 8, 26, "#c9d2d6"], [150, 22, 30, "#b8cbdc"], [176, 14, 24, "#d2d6d2"], [196, 10, 20, "#e2e0d6"], [222, 20, 9, "#d9cfba"], [38, 10, 5, "#9fc7b9"]])
    k += `<rect x="${x}" y="${Y0 + 3}" width="${w}" height="${h}" fill="${c}"/>`;
  k += `</g>`;
  for (let i = 0; i < 170; i++) {
    const t = Math.pow(rnd(), 1.4), y = Y0 + 1 + t * (Y1 - Y0 - 2), w = 1.2 + t * 7 * (0.5 + rnd());
    const x = rnd() * 400;
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} -${r(0.3 + t * 0.5)} ${r(w)} 0" stroke="${rnd() < 0.62 ? "#e9f2f5" : "#27404c"}" stroke-width="${r(0.15 + t * 0.4)}" fill="none" opacity="${r(0.3 + rnd() * 0.35)}"/>`;
  }
  k += `<rect x="0" y="${Y0}" width="400" height="1.2" fill="#fff" opacity=".25"/>`;
  S.teil({ id: "east_river", de: "der East River", syl: "EAST RI-ver", it: "l'East River", itSyl: "EAST RI-ver", en: "East River", x: 0, y: 0, kunst: k,
    tipp: "Der East River ist eigentlich kein Fluss, sondern ein Meeresarm zwischen Manhattan und Brooklyn." });
}

/* =====================================================================
   2 — DIE FREIHEITSSTATUE auf Liberty Island (links, im Hafen)
   Maßstab hier: 0,62 Einheiten je Meter (herangeholt).
   ===================================================================== */
{
  const SX = 42, SY = 150.6;
  let k = "";
  /* Insel mit Bäumen und dem Sternfort */
  k += `<path d="M-26 0 Q-24 -2.6 -16 -2.8 L14 -3 Q24 -2.6 27 0 Z" fill="${S.lg("insel", [[0, "#6f8a5a"], [1, "#4b6340"]])}"/>`;
  for (const [x, y, rr] of [[-20, -3.2, 2.4], [-16, -3.8, 2.8], [-11.6, -3.6, 2.2], [11, -3.8, 2.6], [15.4, -3.6, 2.8], [20, -3, 2.2], [-23, -2, 1.6], [23.6, -1.8, 1.6]])
    k += `<circle cx="${x}" cy="${y}" r="${rr}" fill="${S.rg("baumi", [[0, "#7c9a62"], [1, "#405a36"]], 0.4, 0.35, 0.7)}"/>`;
  /* Fort Wood: niedrige Granitmauern mit Bastionsspitzen (Stern) */
  k += `<path d="M-11 -2 L-10.4 -5.6 L-6.6 -4.6 L-4.6 -6.4 L0 -5 L4.6 -6.4 L6.6 -4.6 L10.4 -5.6 L11 -2 Z" fill="${S.lg("fort", [[0, "#ddd2c0"], [1, "#b5a690"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-10.4 -5.6 L-6.6 -4.6 L-4.6 -6.4 L0 -5 L4.6 -6.4 L6.6 -4.6 L10.4 -5.6" stroke="#f3ebde" stroke-width=".35" fill="none"/>`;
  /* Fundament: gestufter Pyramidenstumpf aus Beton */
  k += `<path d="M-6.4 -5.4 L-5.4 -12.4 L5.4 -12.4 L6.4 -5.4 Z" fill="${S.lg("fund", [[0, "#ece5d8"], [0.55, "#d7cdbd"], [0.56, "#bcae99"], [1, "#a8998a"]], 0, 0, 1, 0)}"/>`;
  for (const y of [-7.4, -9.4, -11.2]) k += `<line x1="${r(-6.2 + (-y - 5.4) * 0.14)}" y1="${y}" x2="${r(6.2 - (-y - 5.4) * 0.14)}" y2="${y}" stroke="#9c8f7d" stroke-width=".18"/>`;
  /* Sockel (Granit, schräg gesehen: linke Seite im Licht, rechte im Schatten) */
  const P = (x0, x1, y0, y1, a, b) => `<path d="M${x0} ${y0} L${x0 + a} ${y1} L${x1 - b} ${y1} L${x1} ${y0} Z"`;
  k += `${P(-4.4, 0.6, -12.4, -29.2, 0.6, 0)} fill="${S.lg("sockl", [[0, "#efe3d3"], [1, "#d9c8b3"]], 0, 0, 1, 0)}"/>`;
  k += `${P(0.6, 4.4, -12.4, -29.2, 0, 0.6)} fill="${S.lg("sockr", [[0, "#b9a690"], [1, "#9c8a75"]], 0, 0, 1, 0)}"/>`;
  /* Bossenquader unten, Gesimse, die Loggien mit Säulen, das Band mit Schilden, die Galerie */
  for (const y of [-14, -15.6, -17.2]) k += `<path d="M-4.3 ${y} L4.3 ${y}" stroke="#8f7f6c" stroke-width=".16"/>`;
  k += `<rect x="-4.6" y="-18.4" width="9.2" height=".9" fill="#f5ecdf"/><rect x=".6" y="-18.4" width="4" height=".9" fill="#c2b19b"/>`;
  k += `<path d="M-3.2 -18.8 L-3.2 -22.6 Q-1.7 -24 -.2 -22.6 L-.2 -18.8 Z" fill="#6d6152"/>`;
  for (const x of [-2.8, -1.7, -.6]) k += `<rect x="${x - 0.22}" y="-22.6" width=".44" height="3.8" fill="#f1e6d6"/>`;
  k += `<path d="M1.4 -18.8 L1.4 -22.6 Q2.5 -23.6 3.6 -22.6 L3.6 -18.8 Z" fill="#544a3e"/>`;
  for (const x of [1.8, 2.6, 3.3]) k += `<rect x="${x - 0.18}" y="-22.6" width=".36" height="3.8" fill="#c4b39d"/>`;
  k += `<rect x="-4.4" y="-24.6" width="8.8" height="1.2" fill="#e8dccb"/><rect x=".6" y="-24.6" width="3.8" height="1.2" fill="#b3a28c"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(-3.8 + i * 0.75)}" cy="-25.6" r=".26" fill="#b1a08a"/>`;
  k += `<rect x="-4.2" y="-27.6" width="8.4" height="1.4" fill="#f2e8da"/><rect x=".6" y="-27.6" width="3.6" height="1.4" fill="#bba993"/>`;
  k += `<rect x="-3.9" y="-29.2" width="7.8" height="1.6" fill="#e4d6c4"/>`;
  for (let i = 0; i < 9; i++) k += `<rect x="${r(-3.7 + i * 0.86)}" y="-29" width=".3" height="1.2" fill="#8e7f6b"/>`;
  /* DIE FIGUR (Grünspan-Kupfer), Fuß bei y −29,2 */
  const F0 = -29.2;
  const f = (x, y) => `${r(x)} ${r(F0 + y)}`;
  let g = "";
  /* Gewand: fällt in schweren Falten bis auf den Sockel */
  g += `<path d="M${f(-3.1, 0)} C${f(-3.2, -5)} ${f(-2.6, -10)} ${f(-2.2, -14.4)} L${f(-1.9, -17.6)} Q${f(0, -18.6)} ${f(2, -17.4)} L${f(2.4, -14)} C${f(2.8, -9)} ${f(3.2, -4)} ${f(3.4, 0)} Z" fill="${GRUENSPAN}"/>`;
  for (const [x0, x1] of [[-2.2, -2.6], [-1.2, -1.6], [-0.2, -0.4], [0.9, 1.2], [1.9, 2.5]]) g += `<path d="M${f(x0, -15.5)} Q${f((x0 + x1) / 2 - 0.3, -8)} ${f(x1, 0)}" stroke="#3d7666" stroke-width=".28" fill="none"/>`;
  for (const [x0, x1] of [[-1.7, -2.1], [0.4, 0.5], [1.4, 1.8]]) g += `<path d="M${f(x0, -15)} Q${f((x0 + x1) / 2 + 0.2, -8)} ${f(x1, -0.4)}" stroke="#b6e0d2" stroke-width=".22" fill="none" opacity=".7"/>`;
  /* Überwurf (Stola) quer über der Brust */
  g += `<path d="M${f(-2.1, -16.6)} Q${f(0, -14)} ${f(2.3, -12.4)} L${f(2.5, -10.6)} Q${f(0, -12)} ${f(-2.2, -14.6)} Z" fill="#5c9b88"/>`;
  g += `<path d="M${f(-2.1, -16.2)} Q${f(0, -13.6)} ${f(2.3, -12)}" stroke="#a9d8c6" stroke-width=".2" fill="none"/>`;
  /* Fuß mit zerbrochener Kette (vorn sichtbar) */
  g += `<path d="M${f(-0.6, -0.1)} q.8 -.9 1.8 -.2 l.2 .3 Z" fill="#4d8a78"/><path d="M${f(1.6, -0.3)} l1 .1" stroke="#2f5d51" stroke-width=".3"/>`;
  /* linker Arm mit der Tafel (im Bild rechts), Tafel an die Hüfte gelehnt */
  g += `<path d="M${f(1.8, -17.2)} Q${f(2.9, -15.6)} ${f(2.6, -13.2)} L${f(1.6, -12.4)} Q${f(1.9, -15)} ${f(1.2, -16.4)} Z" fill="#4f8d7b"/>`;
  g += `<path d="M${f(1.9, -10.2)} L${f(3.4, -10.6)} L${f(3.1, -16.4)} L${f(1.6, -16)} Z" fill="${S.lg("tafel", [[0, "#8cc4b2"], [1, "#4f8b79"]], 0, 0, 1, 0)}"/>`;
  g += `<path d="M${f(1.9, -10.2)} L${f(1.6, -16)} L${f(1.25, -15.8)} L${f(1.5, -10.1)} Z" fill="#3b6f61"/>`;
  g += `<text transform="translate(${f(2.5, -13.4)}) rotate(-86) scale(.42 1)" font-size=".62" text-anchor="middle" fill="#2c574b" font-family="Georgia,serif">JULY IV</text>`;
  g += `<text transform="translate(${f(2.95, -13.3)}) rotate(-86) scale(.42 1)" font-size=".62" text-anchor="middle" fill="#2c574b" font-family="Georgia,serif">MDCCLXXVI</text>`;
  g += `<path d="M${f(1.4, -13)} q.7 .3 1.3 0" stroke="#4f8d7b" stroke-width=".5" stroke-linecap="round" fill="none"/>`;
  /* Hals und Kopf (Gesicht nach vorn links) */
  g += `<path d="M${f(-0.5, -17.8)} L${f(-0.4, -18.9)} L${f(0.6, -18.9)} L${f(0.7, -17.8)} Z" fill="#5d9c89"/>`;
  g += `<ellipse cx="${r(0)}" cy="${r(F0 - 20.1)}" rx="1.05" ry="1.32" fill="${S.rg("kopf", [[0, "#b2e0d0"], [0.6, "#74b19f"], [1, "#3f7a6b"]], 0.38, 0.4, 0.7)}"/>`;
  g += `<path d="M${f(-0.75, -20.3)} q.3 .25 .5 0 M${f(0.2, -20.35)} q.3 .25 .5 0" stroke="#2f5d51" stroke-width=".14" fill="none"/>`;
  g += `<path d="M${f(-0.12, -20.1)} l-.18 .62 l.3 .06" stroke="#3c7262" stroke-width=".12" fill="none"/><path d="M${f(-0.35, -19.25)} q.3 .12 .6 0" stroke="#2f5d51" stroke-width=".12" fill="none"/>`;
  /* Krone: Reif mit 25 Fenstern und sieben Strahlen */
  g += `<path d="M${f(-1.25, -20.9)} Q${f(0, -21.7)} ${f(1.25, -20.9)} L${f(1.2, -21.7)} Q${f(0, -22.5)} ${f(-1.2, -21.7)} Z" fill="#5c9b88"/>`;
  for (let i = 0; i < 9; i++) g += `<rect x="${r(-1.05 + i * 0.24)}" y="${r(F0 - 21.75 + Math.abs(i - 4) * 0.06)}" width=".13" height=".36" fill="#173a33"/>`;
  for (let i = 0; i < 7; i++) {
    const a = (-78 + i * 26) * Math.PI / 180, bx = Math.sin(a) * 1.1, by = -22 - Math.cos(a) * 0.35, L = 2.3 - Math.abs(i - 3) * 0.12;
    const tx = bx + Math.sin(a) * L, ty = by - Math.cos(a) * L;
    const nx = Math.cos(a) * 0.2, ny = Math.sin(a) * 0.2;
    g += `<path d="M${f(bx - nx, by - ny)} L${f(tx, ty)} L${f(bx + nx, by + ny)} Z" fill="${i < 3 ? "#9fd2c0" : "#5f9e8b"}" stroke="#3f7a6b" stroke-width=".06"/>`;
  }
  /* rechter Arm hoch mit der Fackel (im Bild links) */
  g += `<path d="M${f(-1.9, -17.4)} Q${f(-2.6, -21)} ${f(-2.7, -24.4)} L${f(-1.7, -24.6)} Q${f(-1.5, -21)} ${f(-0.8, -17.8)} Z" fill="${S.lg("arm", [[0, "#9ad0be"], [1, "#4f8d7b"]], 0, 0, 1, 0)}"/>`;
  g += `<path d="M${f(-2.5, -18)} Q${f(-2.2, -20)} ${f(-1.7, -18.2)}" fill="#5c9b88"/>`;
  g += `<ellipse cx="${r(-2.2)}" cy="${r(F0 - 24.8)}" rx=".62" ry=".5" fill="#5c9b88"/>`;
  g += `<path d="M${f(-2.55, -24.8)} L${f(-2.35, -26.3)} L${f(-1.95, -26.3)} L${f(-1.8, -24.8)} Z" fill="#4f8d7b"/>`;
  g += `<path d="M${f(-3.0, -26.3)} L${f(-1.3, -26.3)} L${f(-1.5, -26.8)} L${f(-2.8, -26.8)} Z" fill="#6fae9b"/>`;
  for (let i = 0; i < 6; i++) g += `<line x1="${r(-2.85 + i * 0.28)}" y1="${r(F0 - 26.3)}" x2="${r(-2.85 + i * 0.28)}" y2="${r(F0 - 26.8)}" stroke="#2f5d51" stroke-width=".07"/>`;
  g += `<path d="M${f(-2.15, -26.8)} C${f(-3.1, -27.6)} ${f(-2.6, -28.6)} ${f(-2.1, -29.6)} C${f(-1.6, -28.6)} ${f(-1.1, -27.8)} ${f(-2.15, -26.8)} Z" fill="${GOLD}"/>`;
  g += `<path d="M${f(-2.15, -27.1)} C${f(-2.6, -27.7)} ${f(-2.4, -28.4)} ${f(-2.1, -28.9)}" stroke="#fffbe0" stroke-width=".18" fill="none"/>`;
  g += `<circle cx="${r(-2.1)}" cy="${r(F0 - 28.2)}" r="1.4" fill="#fff3b0" opacity=".25"/>`;
  /* Licht von links hinten: rechte Hälfte der Figur dunkler */
  g += `<path d="M${f(0.6, 0)} L${f(0.6, -17.8)} L${f(2.4, -14)} C${f(2.8, -9)} ${f(3.2, -4)} ${f(3.4, 0)} Z" fill="#163d34" opacity=".18"/>`;
  k += g;
  S.teil({ id: "freiheitsstatue", de: "die Freiheitsstatue", syl: "FREI-heits-sta-tu-e", it: "la Statua della Libertà", itSyl: "STA-tua del-la li-ber-TÀ", en: "Statue of Liberty",
    x: SX, y: SY, kunst: k, tipp: "Die Freiheitsstatue war ein Geschenk Frankreichs an die USA (1886). Sie ist mit dem Sockel 93 Meter hoch.",
    zoom: { x: SX - 30, y: SY - 62, w: 60, h: 40 },
    unter: [
      { id: "fackel", de: "die Fackel", syl: "FA-ckel", it: "la fiaccola", itSyl: "FIAC-co-la", en: "torch", x: SX - 2.1, y: SY - 55.4, kunst: flaeche(-1.6, -3.4, 3.2, 3.8, 0.6),
        tipp: "Die Flamme der Fackel ist mit echtem Gold überzogen." },
      { id: "krone", de: "die Krone", syl: "KRO-ne", it: "la corona", itSyl: "co-RO-na", en: "crown", x: SX, y: SY - 50.6, kunst: flaeche(-2.6, -3.2, 5.2, 3.4, 0.6),
        tipp: "Die Krone hat sieben Strahlen — für die sieben Meere und Kontinente." },
      { id: "tafel", de: "die Tafel", syl: "TA-fel", it: "la tavola", itSyl: "TA-vo-la", en: "tablet", x: SX + 2.4, y: SY - 39.4, kunst: flaeche(-1.3, -6.4, 2.6, 6.6, 0.5),
        tipp: "Auf der Tafel steht „JULY IV MDCCLXXVI“ — der 4. Juli 1776, der Tag der Unabhängigkeit." },
      { id: "sockel", de: "der Sockel", syl: "SO-ckel", it: "il piedistallo", itSyl: "pie-di-STAL-lo", en: "pedestal", x: SX, y: SY - 12.4, kunst: flaeche(-4.4, -16.8, 8.8, 16.6, 0.6),
        tipp: "Der Sockel aus Granit wurde mit Spenden aus ganz Amerika bezahlt." },
    ] });
}

/* =====================================================================
   3 — DIE FÄHRE (Staten-Island-Fähre, orange, im Hafen)
   ===================================================================== */
{
  let k = `<ellipse cx="0" cy=".3" rx="15" ry=".8" fill="#2e4955" opacity=".35"/>`;
  k += `<path d="M-15 -.2 q8 .9 30 0" stroke="#eef5f7" stroke-width=".35" fill="none" opacity=".8"/><path d="M14 0 q5 .6 10 .2" stroke="#eef5f7" stroke-width=".3" fill="none" opacity=".7"/>`;
  const OR = S.lg("orange", [[0, "#ff9a3c"], [1, "#d8600f"]]);
  k += `<path d="M-14 -3.4 L14 -3.4 L13 0 L-13 0 Z" fill="${OR}"/>`;
  k += `<rect x="-13.4" y="-2.3" width="26.8" height=".5" fill="#1d2228" opacity=".8"/>`;
  k += `<path d="M-11.5 -3.4 L-11 -6.4 L11 -6.4 L11.5 -3.4 Z" fill="#f08a2c"/>`;
  for (let x = -10.4; x < 10.4; x += 1.3) k += `<rect x="${r(x)}" y="-5.8" width=".9" height="1.3" fill="#2b3640"/>`;
  k += `<path d="M-9 -6.4 L-8.6 -8.4 L8.6 -8.4 L9 -6.4 Z" fill="#f5913a"/>`;
  for (let x = -8; x < 8; x += 1.4) k += `<rect x="${r(x)}" y="-8" width="1" height="1.1" fill="#2b3640"/>`;
  /* Steuerhäuser an beiden Enden, Mast in der Mitte */
  for (const s of [-1, 1]) k += `<rect x="${s < 0 ? -8.2 : 4.2}" y="-10" width="4" height="1.6" fill="#f7a04c"/><rect x="${s < 0 ? -7.8 : 4.6}" y="-9.7" width="3.2" height=".7" fill="#20303c"/>`;
  k += `<rect x="-.25" y="-12.4" width=".5" height="4" fill="#e9e9e6"/><rect x="-1.4" y="-11.6" width="2.8" height=".3" fill="#e9e9e6"/>`;
  k += `<rect x="-14" y="-3.4" width="28" height=".4" fill="#fff" opacity=".35"/>`;
  S.teil({ id: "faehre", de: "die Fähre", syl: "FÄH-re", it: "il traghetto", itSyl: "tra-GHET-to", en: "ferry", x: 92, y: 152.4, kunst: `<g transform="scale(.82)">${k}</g>`,
    tipp: "Die orange Fähre nach Staten Island ist kostenlos und fährt an der Freiheitsstatue vorbei." });
}

/* =====================================================================
   Hilfen für Hochhäuser: Körper mit Lichtseite, Schattenseite, Fenstern
   ===================================================================== */
const LICHT = S.lg("hlicht", [[0, "#fff", 0.16], [0.5, "#fff", 0], [1, "#000", 0.22]], 0, 0, 1, 0);
const VERL = {
  glas: S.lg("vglas", [[0, "#9cb9d2"], [0.5, "#7d9fbe"], [1, "#5d7f9c"]]),
  glas2: S.lg("vglas2", [[0, "#b7c9d6"], [1, "#7f97a8"]]),
  dunkel: S.lg("vdunkel", [[0, "#5d6772"], [1, "#3a434d"]]),
  stein: S.lg("vstein", [[0, "#ddd5c6"], [1, "#b9ae9b"]]),
  stein2: S.lg("vstein2", [[0, "#cfc6b6"], [1, "#a69b88"]]),
  braun: S.lg("vbraun", [[0, "#b49a82"], [1, "#8b725c"]]),
  hell: S.lg("vhell", [[0, "#eef0ee"], [1, "#c9cdcd"]]),
};
function block(x, base, w, h, art, muster) {
  let s = `<rect x="${r(x)}" y="${r(base - h)}" width="${r(w)}" height="${r(h)}" fill="${VERL[art]}"/>`;
  if (muster) s += `<rect x="${r(x)}" y="${r(base - h)}" width="${r(w)}" height="${r(h)}" fill="url(#${S.id(muster)})"/>`;
  s += `<rect x="${r(x)}" y="${r(base - h)}" width="${r(w)}" height="${r(h)}" fill="${LICHT}"/>`;
  return s;
}

/* =====================================================================
   4 — DAS ONE WORLD TRADE CENTER (hinter den Türmen des Financial District)
   ===================================================================== */
{
  const X = 160, BASE = 153.4;
  let k = "";
  const Hr = 98, Hs = 30, wB = 8, wT = 4.6;   /* halbe Breiten unten/oben */
  /* Glasflächen: Mittelkante, große Dreiecke, Lichtseite links */
  const top = -Hr, P = (x, y) => `${r(x)} ${r(y)}`;
  k += `<path d="M${P(-wB, 0)} L${P(-wT, top)} L${P(wT, top)} L${P(wB, 0)} Z" fill="${S.lg("owglas", [[0, "#cfe2f0"], [0.5, "#9fbfd8"], [1, "#6f91ad"]], 0, 0, 0, 1)}"/>`;
  k += `<path d="M${P(-wB, 0)} L${P(0, top)} L${P(-wT, top)} Z" fill="#e6f1f8" opacity=".55"/>`;
  k += `<path d="M${P(wB, 0)} L${P(0, top)} L${P(wT, top)} Z" fill="#46627a" opacity=".45"/>`;
  k += `<path d="M${P(-wB, 0)} L${P(0, top)} L${P(0, 0)} Z" fill="#b9d3e6" opacity=".35"/>`;
  k += `<path d="M${P(0, 0)} L${P(0, top)} L${P(wB, 0)} Z" fill="#5b7a94" opacity=".35"/>`;
  k += `<line x1="0" y1="0" x2="0" y2="${top}" stroke="#eaf3f9" stroke-width=".35"/>`;
  /* Geschossbänder */
  for (let y = -3; y > top; y -= 2.4) { const t = -y / Hr, hw = wB + (wT - wB) * t; k += `<line x1="${r(-hw)}" y1="${r(y)}" x2="${r(hw)}" y2="${r(y)}" stroke="#36506a" stroke-width=".12" opacity=".5"/>`; }
  /* Spiegelung des Himmels und eine Wolke im Glas */
  k += `<path d="M${P(-6.6, -20)} L${P(-3.2, -70)} L${P(-1.2, -70)} L${P(-4.4, -20)} Z" fill="#fff" opacity=".28"/>`;
  /* Sockelgeschosse (Glaslamellen) */
  k += `<rect x="${-wB}" y="-9" width="${2 * wB}" height="9" fill="${S.lg("owsock", [[0, "#dfe8ee"], [1, "#a9b9c4"]], 0, 0, 1, 0)}"/>`;
  for (let x = -wB + 0.6; x < wB; x += 0.8) k += `<line x1="${r(x)}" y1="-9" x2="${r(x)}" y2="0" stroke="#7e93a3" stroke-width=".12"/>`;
  /* Dachkante (Brüstung) und die weiße Antenne mit Ringen */
  k += `<path d="M${P(-wT - 0.4, top + 0.8)} L${P(-wT, top - 0.8)} L${P(wT, top - 0.8)} L${P(wT + 0.4, top + 0.8)} Z" fill="#dfe8ee"/>`;
  k += `<rect x="-1.2" y="${top - 2.2}" width="2.4" height="1.4" fill="#cfd8de"/>`;
  k += `<path d="M-.55 ${top - 2.2} L-.3 ${top - Hs} L.3 ${top - Hs} L.55 ${top - 2.2} Z" fill="${S.lg("spire", [[0, "#f7f9fa"], [1, "#b7c1c8"]], 0, 0, 1, 0)}"/>`;
  for (const t of [0.12, 0.3, 0.48, 0.66]) k += `<rect x="-1" y="${r(top - 2.2 - t * (Hs - 2.2))}" width="2" height=".45" rx=".2" fill="#eef2f4" stroke="#9aa6ae" stroke-width=".08"/>`;
  k += `<circle cx="0" cy="${top - Hs - 0.3}" r=".32" fill="#e04040"/>`;
  S.teil({ id: "one_wtc", de: "das One World Trade Center", syl: "ONE WORLD TRADE CEN-ter", it: "il One World Trade Center", itSyl: "ONE WORLD TRADE CEN-ter", en: "One World Trade Center",
    x: X, y: BASE, kunst: k, tipp: "Das One World Trade Center ist 541 Meter hoch — 1776 Fuß, wie das Jahr der Unabhängigkeit.",
    zoom: { x: X - 21, y: BASE - Hr - Hs - 4, w: 42, h: 28 },
    unter: [
      { id: "antenne", de: "die Antenne", syl: "an-TEN-ne", it: "l'antenna", itSyl: "an-TEN-na", en: "antenna", x: X, y: BASE - Hr - 2.2, kunst: flaeche(-1.4, -28, 2.8, 28, 0.5),
        tipp: "Die Antenne auf dem Dach ist 124 Meter lang." },
    ] });
}

/* =====================================================================
   5 — DAS EMPIRE STATE BUILDING und 6 — DAS CHRYSLER BUILDING (Midtown,
   weit hinten, zwischen den Pfeilern der Brücke). Herangeholt ×1,8.
   ===================================================================== */
{
  const X = 266, BASE = 152;
  let k = `<g filter="url(#${S.id("dunst")})">`;
  /* Schaft mit Rücksprüngen: Flügel bis zum 30. Stock, Turm bis zum 86. */
  const KALK = S.lg("kalk", [[0, "#f3ecdf"], [0.45, "#ddd3c2"], [0.55, "#b9ae9c"], [1, "#a0957f"]], 0, 0, 1, 0);
  k += `<rect x="-9" y="-24" width="18" height="24" fill="${KALK}"/>`;
  k += `<rect x="-7.4" y="-27" width="14.8" height="3" fill="${KALK}"/>`;
  k += `<rect x="-5.6" y="-58" width="11.2" height="31" fill="${KALK}"/>`;
  k += `<rect x="-5.6" y="-58" width="11.2" height="31" fill="url(#${S.id("steinv")})"/>`;
  k += `<rect x="-9" y="-24" width="18" height="24" fill="url(#${S.id("steinv")})"/>`;
  /* oben gestuft: 72., 81., 85. Stock, Aussichtsterrasse */
  k += `<rect x="-4.6" y="-61" width="9.2" height="3" fill="${KALK}"/><rect x="-3.6" y="-63.4" width="7.2" height="2.4" fill="${KALK}"/>`;
  k += `<rect x="-2.6" y="-65.4" width="5.2" height="2" fill="${KALK}"/><rect x="-2.8" y="-65.8" width="5.6" height=".5" fill="#8e8574"/>`;
  /* der Mast (Luftschiff-Ankermast) mit Rippen, dann die Antenne */
  k += `<path d="M-1.8 -65.8 L-1.4 -72 Q0 -73.2 1.4 -72 L1.8 -65.8 Z" fill="${S.lg("mast", [[0, "#e9edef"], [0.5, "#bfc7cc"], [1, "#8f989e"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-1, 0, 1]) k += `<line x1="${x}" y1="-66" x2="${x * 0.8}" y2="-72" stroke="#7e878d" stroke-width=".18"/>`;
  k += `<rect x="-.7" y="-75" width="1.4" height="3" fill="#c4cbcf"/><rect x="-.28" y="-86" width=".56" height="11" fill="#9aa3a9"/>`;
  k += `<line x1="0" y1="-86" x2="0" y2="-88" stroke="#e04040" stroke-width=".3"/>`;
  k += `</g>`;
  S.teil({ id: "empire_state_building", de: "das Empire State Building", syl: "EM-pire STATE BUIL-ding", it: "l'Empire State Building", itSyl: "EM-pire STATE BUIL-ding", en: "Empire State Building",
    x: X, y: BASE, kunst: k, tipp: "Das Empire State Building (1931) hat 102 Stockwerke. Oben ist eine Aussichtsplattform." });
}
{
  const X = 290, BASE = 152;
  let k = `<g filter="url(#${S.id("dunst")})">`;
  k += `<rect x="-5.4" y="-46" width="10.8" height="46" fill="${S.lg("chrys", [[0, "#efece6"], [0.5, "#d8d4cc"], [0.55, "#b3afa7"], [1, "#9a968e"]], 0, 0, 1, 0)}"/>`;
  for (let x = -4.6; x < 5; x += 1.15) k += `<rect x="${r(x)}" y="-45" width=".5" height="45" fill="#4c5560" opacity=".55"/>`;
  k += `<rect x="-5.8" y="-46.8" width="11.6" height=".9" fill="#c5c9cc"/>`;
  /* Krone: sieben gestufte Bögen (Edelstahl) mit dreieckigen Fenstern */
  const ST = S.lg("chrstahl", [[0, "#ffffff"], [0.35, "#d8dde1"], [0.6, "#9ea7ae"], [1, "#e6eaec"]], 0, 0, 1, 0);
  for (let i = 0; i < 7; i++) {
    const y = -47 - i * 2.4, w = 5 - i * 0.62;
    k += `<path d="M${r(-w)} ${r(y)} Q${r(-w)} ${r(y - 2.9)} 0 ${r(y - 3.1)} Q${r(w)} ${r(y - 2.9)} ${r(w)} ${r(y)} Z" fill="${ST}" stroke="#7b858c" stroke-width=".1"/>`;
    for (const t of [-0.55, 0, 0.55]) if (w > 1.6) k += `<path d="M${r(t * w - 0.32)} ${r(y - 0.3)} L${r(t * w)} ${r(y - 1.5)} L${r(t * w + 0.32)} ${r(y - 0.3)} Z" fill="#2f3a44"/>`;
  }
  k += `<path d="M-.5 -63.4 L0 -74 L.5 -63.4 Z" fill="${ST}"/>`;
  /* Adler an den Ecken des 61. Stocks */
  k += `<path d="M-5.6 -46.9 l-1.2 -.5 l1.2 -.2 Z M5.6 -46.9 l1.2 -.5 l-1.2 -.2 Z" fill="#c8cdd1"/>`;
  k += `</g>`;
  S.teil({ id: "chrysler_building", de: "das Chrysler Building", syl: "CHRYS-ler BUIL-ding", it: "il Chrysler Building", itSyl: "CHRYS-ler BUIL-ding", en: "Chrysler Building",
    x: X, y: BASE, kunst: k, tipp: "Die glänzende Spitze des Chrysler Building ist aus Edelstahl — ein Meisterwerk des Art déco." });
}

/* =====================================================================
   7 — DIE SKYLINE von Lower Manhattan (Financial District bis Two Bridges)
   ===================================================================== */
{
  const BASE = 153.4;
  let k = "";
  /* hintere Reihe (blasser) */
  let x = 92;
  while (x < 312) {
    const w = 4 + rnd() * 6, h = 10 + rnd() * (x < 210 ? 32 : 12);
    k += block(x, BASE, w, h, rnd() < 0.5 ? "glas2" : "stein2", rnd() < 0.5 ? "glasr" : "steinr");
    x += w + 0.4;
  }
  /* 4 WTC und 3 WTC (links neben dem One WTC) */
  k += block(140, BASE, 9, 74, "glas", "glasr");
  k += `<path d="M140 ${BASE - 74} L149 ${BASE - 74} L149 ${BASE - 76} L141.6 ${BASE - 76} Z" fill="#c9d8e3"/>`;
  k += block(171, BASE, 8.6, 80, "dunkel", "glasr");
  k += `<path d="M171 ${BASE - 80} L179.6 ${BASE - 80} L179.6 ${BASE - 84} L172.4 ${BASE - 84} Z" fill="#4b5560"/>`;
  for (let y = BASE - 76; y < BASE; y += 3) k += `<path d="M171 ${y} L179.6 ${y + 1.6}" stroke="#7d8892" stroke-width=".12"/>`;
  /* 40 Wall Street: schlanker Turm mit grüner Pyramide und Spitze */
  {
    const X = 112, h = 76;
    k += block(X - 4.2, BASE, 8.4, h, "stein", "steinr");
    k += `<rect x="${X - 3.4}" y="${BASE - h - 6}" width="6.8" height="6" fill="${VERL.stein}"/><rect x="${X - 3.4}" y="${BASE - h - 6}" width="6.8" height="6" fill="url(#${S.id("steinv")})"/>`;
    k += `<path d="M${X - 3.6} ${BASE - h - 6} L${X} ${BASE - h - 15} L${X + 3.6} ${BASE - h - 6} Z" fill="${S.lg("kupfer", [[0, "#8fc4ae"], [1, "#4f8a74"]], 0, 0, 1, 0)}"/>`;
    for (let i = 0; i < 4; i++) k += `<rect x="${r(X - 2.8 + i * 1.5)}" y="${r(BASE - h - 9 + Math.abs(i - 1.5) * 1.6)}" width=".5" height=".7" fill="#2b4a3f"/>`;
    k += `<line x1="${X}" y1="${BASE - h - 15}" x2="${X}" y2="${BASE - h - 20}" stroke="#9aa3a9" stroke-width=".3"/>`;
  }
  /* 70 Pine Street: Art déco, gestuft, mit Spitze */
  {
    const X = 125;
    k += block(X - 5, BASE, 10, 64, "stein2", "steinv");
    k += block(X - 3.8, BASE - 64, 7.6, 9, "stein2", "steinv");
    k += block(X - 2.6, BASE - 73, 5.2, 6, "stein2", "steinv");
    k += block(X - 1.6, BASE - 79, 3.2, 4, "stein2", "steinv");
    k += `<path d="M${X - 1.2} ${BASE - 83} L${X} ${BASE - 89} L${X + 1.2} ${BASE - 83} Z" fill="#cfc6b5"/><line x1="${X}" y1="${BASE - 89}" x2="${X}" y2="${BASE - 93}" stroke="#9aa3a9" stroke-width=".3"/>`;
  }
  /* 130 William (hell, vor dem One WTC) und ein dunkler Turm */
  k += block(150, BASE, 9, 54, "hell", "steinr");
  k += `<rect x="150" y="${BASE - 56}" width="9" height="2" fill="#dfe3e3"/>`;
  k += block(102, BASE, 8, 48, "dunkel", "glasr");
  /* Woolworth Building: Neugotik, cremeweiß, grüne Kupferpyramide */
  {
    const X = 194, h = 46;
    k += block(X - 6, BASE, 12, h, "hell", "steinv");
    k += block(X - 3.4, BASE - h, 6.8, 9, "hell", "steinv");
    k += block(X - 2.4, BASE - h - 9, 4.8, 4, "hell", "steinv");
    for (const dx of [-3.4, 3.4]) k += `<path d="M${X + dx - 0.4} ${BASE - h - 9} L${X + dx} ${BASE - h - 11} L${X + dx + 0.4} ${BASE - h - 9} Z" fill="#e9ebe6"/>`;
    k += `<path d="M${X - 2.4} ${BASE - h - 13} L${X} ${BASE - h - 20} L${X + 2.4} ${BASE - h - 13} Z" fill="${S.lg("kupfer2", [[0, "#9ccdb6"], [1, "#5a957c"]], 0, 0, 1, 0)}"/>`;
    k += `<line x1="${X}" y1="${BASE - h - 20}" x2="${X}" y2="${BASE - h - 23}" stroke="#c9a74a" stroke-width=".3"/>`;
  }
  /* 8 Spruce Street (Gehry): Edelstahl, gewellte Fassade */
  {
    const X = 208, h = 68;
    k += `<rect x="${X - 5}" y="${BASE - h}" width="10" height="${h}" fill="${S.lg("gehry", [[0, "#eef1f2"], [0.5, "#c3cbd0"], [1, "#98a2a9"]], 0, 0, 1, 0)}"/>`;
    for (let x = X - 4.6; x < X + 5; x += 1.2) k += `<path d="M${r(x)} ${BASE - h + 1} q.5 6 0 12 t0 12 t0 12 t0 12 t0 12" stroke="#7f8a91" stroke-width=".2" fill="none" opacity=".7"/>`;
    k += `<rect x="${X - 5}" y="${BASE - h}" width="10" height="${h}" fill="url(#${S.id("glasr")})" opacity=".5"/>`;
  }
  /* Municipal Building (hinter dem Manhattan-Pfeiler): goldene Figur obenauf */
  {
    const X = 232;
    k += block(X - 6, BASE, 12, 34, "stein", "steinr");
    k += `<rect x="${X - 2.4}" y="${BASE - 40}" width="4.8" height="6" fill="${VERL.stein}"/>`;
    k += `<path d="M${X - 1.6} ${BASE - 40} L${X - 1.2} ${BASE - 43} L${X + 1.2} ${BASE - 43} L${X + 1.6} ${BASE - 40} Z" fill="#d8cfbf"/>`;
    k += `<path d="M${X - .4} ${BASE - 43} L${X} ${BASE - 46.5} L${X + .4} ${BASE - 43} Z" fill="${GOLD}"/>`;
  }
  /* vordere Reihe am Wasser (South Street Seaport bis Two Bridges): niedriger */
  x = 84;
  while (x < 330) {
    const w = 5 + rnd() * 7, h = 4 + rnd() * (x > 215 && x < 300 ? 18 : 12);
    k += block(x, BASE, w, h, ["braun", "stein", "stein2", "glas2"][Math.floor(rnd() * 4)], "steinr");
    x += w + 0.3;
  }
  /* die Masten der Segelschiffe am Seaport (Pier 16) */
  for (const [mx, mh] of [[176, 16], [180, 18], [184, 15], [189, 13]]) k += `<line x1="${mx}" y1="${BASE}" x2="${mx}" y2="${BASE - mh}" stroke="#4a3b2c" stroke-width=".3"/><line x1="${mx - 1.6}" y1="${BASE - mh + 3}" x2="${mx + 1.6}" y2="${BASE - mh + 3}" stroke="#4a3b2c" stroke-width=".2"/><line x1="${mx - 1.2}" y1="${BASE - mh + 7}" x2="${mx + 1.2}" y2="${BASE - mh + 7}" stroke="#4a3b2c" stroke-width=".2"/>`;
  k += `<path d="M174 ${BASE} L192 ${BASE} L191 ${BASE + 1.3} L175 ${BASE + 1.3} Z" fill="#2c2a28"/>`;
  /* Battery Park (Bäume) an der Südspitze und die Uferstraße (FDR Drive) */
  for (let i = 0; i < 9; i++) k += `<circle cx="${r(80 + i * 2.3)}" cy="${r(BASE - 1.6 - rnd())}" r="${r(1.4 + rnd())}" fill="${rnd() < 0.5 ? "#59794a" : "#4a663d"}"/>`;
  k += `<rect x="78" y="${BASE - 0.4}" width="252" height="1.6" fill="#8f8e88"/><rect x="78" y="${BASE + 1.1}" width="252" height=".5" fill="#545552"/>`;
  S.teil({ id: "skyline", de: "die Skyline", syl: "SKY-line", it: "lo skyline", itSyl: "SKY-line", en: "skyline", x: 0, y: 0, kunst: k,
    tipp: "Die Skyline von Manhattan: Hier stehen Hunderte Wolkenkratzer dicht nebeneinander.",
    zoom: { x: 96, y: 58, w: 132, h: 88 },
    unter: [
      { id: "wolkenkratzer", de: "der Wolkenkratzer", syl: "WOL-ken-krat-zer", it: "il grattacielo", itSyl: "grat-ta-CIE-lo", en: "skyscraper", x: 125, y: BASE, kunst: flaeche(-5, -92, 10, 92, 0.6),
        tipp: "70 Pine Street ist ein Wolkenkratzer im Art-déco-Stil von 1932." },
      { id: "woolworth_building", de: "das Woolworth Building", syl: "WOOL-worth BUIL-ding", it: "il Woolworth Building", itSyl: "WOOL-worth BUIL-ding", en: "Woolworth Building", x: 194, y: BASE, kunst: flaeche(-6, -69, 12, 69, 0.6),
        tipp: "Das Woolworth Building (1913) sieht aus wie eine Kathedrale — man nannte es „Kathedrale des Handels“." },
    ] });
}

/* =====================================================================
   8 — DIE BROOKLYN BRIDGE: Manhattan-Pfeiler (fern, fast von vorn),
   Brooklyn-Pfeiler (nah, schräg), Kabel, Hänger, Schrägseile, Fahrbahn
   ===================================================================== */
{
  const MX = 222, MW = 153.6, MT = 111.5, MD = 133;       /* Manhattan: Wasser, Spitze, Fahrbahn */
  const BX = 318, BW = 158.4, BT = 56, BD = 109.5;        /* Brooklyn */
  let k = "";
  const STEIN = S.lg("bstein", [[0, "#efe3cf"], [0.5, "#d7c7ad"], [1, "#b4a184"]], 0, 0, 1, 0);
  const STEIN_S = S.lg("bsteins", [[0, "#b9a68a"], [1, "#8f7d64"]], 0, 0, 1, 0);
  /* Pfeiler mit zwei Spitzbögen (Breitseite), Gesims, Fuß im Wasser */
  const pfeiler = (cx, wasser, spitze, fahr, halb, seite, licht) => {
    const h = wasser - spitze, P = (x, y) => `${r(cx + x)} ${r(y)}`;
    let s = "";
    const hw = halb, sh = seite;
    /* Breitseite */
    s += `<path d="M${P(-hw, wasser)} L${P(-hw * 0.93, spitze + h * 0.04)} L${P(hw * 0.93, spitze + h * 0.04)} L${P(hw, wasser)} Z" fill="${STEIN}"/>`;
    /* Schmalseite (schräg gesehen) rechts */
    if (sh > 0) s += `<path d="M${P(hw, wasser)} L${P(hw * 0.93, spitze + h * 0.04)} L${P(hw * 0.93 + sh * 0.93, spitze + h * 0.04 - sh * 0.18)} L${P(hw + sh, wasser - sh * 0.1)} Z" fill="${STEIN_S}"/>`;
    /* Gesims oben und das Dach */
    s += `<path d="M${P(-hw * 0.97, spitze + h * 0.06)} L${P(hw * 0.97, spitze + h * 0.06)} L${P(hw * 0.95, spitze + h * 0.02)} L${P(-hw * 0.95, spitze + h * 0.02)} Z" fill="#f4ead8"/>`;
    s += `<rect x="${r(cx - hw * 0.9)}" y="${r(spitze)}" width="${r(hw * 1.8)}" height="${r(h * 0.022)}" fill="#cbb999"/>`;
    /* zwei Spitzbögen; die Fahrbahn läuft hindurch */
    const bw = hw * 0.32, bt = spitze + h * 0.17, bu = fahr + h * 0.02;
    for (const sx of [-1, 1]) {
      const bx = cx + sx * hw * 0.42;
      s += `<path d="M${r(bx - bw)} ${r(bu)} L${r(bx - bw)} ${r(bt + bw * 1.4)} Q${r(bx - bw)} ${r(bt + bw * 0.4)} ${r(bx)} ${r(bt)} Q${r(bx + bw)} ${r(bt + bw * 0.4)} ${r(bx + bw)} ${r(bt + bw * 1.4)} L${r(bx + bw)} ${r(bu)} Z" fill="${S.lg("bogen", [[0, "#9fb6c6"], [1, "#c6d4dc"]])}"/>`;
      s += `<path d="M${r(bx - bw)} ${r(bt + bw * 1.4)} Q${r(bx - bw)} ${r(bt + bw * 0.4)} ${r(bx)} ${r(bt)}" stroke="#8c7a60" stroke-width="${r(h * 0.006)}" fill="none"/>`;
    }
    /* Mittelpfeiler-Lisene und Steinlagen */
    for (let i = 1; i < 18; i++) { const y = wasser - i * h / 18; s += `<line x1="${r(cx - hw * 0.97)}" y1="${r(y)}" x2="${r(cx + hw * 0.97)}" y2="${r(y)}" stroke="#a48f72" stroke-width="${r(Math.max(0.08, h * 0.0016))}" opacity=".55"/>`; }
    s += `<rect x="${r(cx - hw)}" y="${r(spitze)}" width="${r(hw * 2)}" height="${r(h)}" fill="${S.lg("plicht" + Math.round(cx), [[0, "#fff", licht], [0.6, "#fff", 0], [1, "#000", 0.12]], 0, 0, 1, 0)}"/>`;
    /* Fahnenmast mit US-Flagge */
    const fx = cx, fy = spitze, fh = h * 0.1;
    s += `<line x1="${r(fx)}" y1="${r(fy)}" x2="${r(fx)}" y2="${r(fy - fh)}" stroke="#9aa1a6" stroke-width="${r(Math.max(0.2, h * 0.004))}"/>`;
    const fw = fh * 0.6, fhh = fh * 0.34, fx0 = fx, fy0 = fy - fh + 0.2;
    let fl = `<rect x="${r(fx0)}" y="${r(fy0)}" width="${r(fw)}" height="${r(fhh)}" fill="#b22234"/>`;
    for (let i = 1; i < 7; i += 2) fl += `<rect x="${r(fx0)}" y="${r(fy0 + i * fhh / 7)}" width="${r(fw)}" height="${r(fhh / 7)}" fill="#fff"/>`;
    fl += `<rect x="${r(fx0)}" y="${r(fy0)}" width="${r(fw * 0.42)}" height="${r(fhh * 4 / 7)}" fill="#3c3b6e"/>`;
    s += `<g transform="skewY(-4)" transform-origin="${r(fx0)} ${r(fy0)}">${fl}</g>`;
    return s;
  };
  /* Fahrbahn mit Fachwerk, von Manhattan (links unten) über die Brücke nach rechts */
  const deck = (x0, y0, x1, y1, d0, d1) => `<path d="M${r(x0)} ${r(y0)} L${r(x1)} ${r(y1)} L${r(x1)} ${r(y1 + d1)} L${r(x0)} ${r(y0 + d0)} Z" fill="${S.lg("deck", [[0, "#5d554a"], [1, "#3d362e"]])}"/>`;
  k += deck(196, 141, MX, MD, 1.4, 1.8);
  k += deck(MX, MD, BX, BD, 1.8, 4.2);
  k += deck(BX, BD, 400, 98, 4.2, 6);
  /* Fachwerk unter der Fahrbahn */
  for (let i = 0; i <= 40; i++) {
    const t = i / 40, x = MX + (BX - MX) * t, y = MD + (BD - MD) * t, d = 1.8 + 2.4 * t;
    k += `<line x1="${r(x)}" y1="${r(y + 0.2)}" x2="${r(x + (i % 2 ? 1.2 : -1.2) * (0.6 + t))}" y2="${r(y + d)}" stroke="#2c2620" stroke-width="${r(0.1 + 0.12 * t)}"/>`;
  }
  /* Kabel: zwei Paare je Seite; hier ein vorderes und ein hinteres Hauptkabel */
  const kabel = (dy, w, c) => `<path d="M${MX} ${MT + 3 + dy} Q${r(MX + (BX - MX) * 0.58)} ${r(MD - 1 + dy * 0.6)} ${BX - 2} ${BT + 6 + dy * 2}" stroke="${c}" stroke-width="${w}" fill="none"/>`;
  k += kabel(1.2, 0.35, "#6b6a64") + kabel(0, 0.55, "#4a4943");
  /* Hänger (senkrecht) und die Schrägseile, fächerförmig von den Pfeilern */
  let h = "";
  for (let i = 1; i < 34; i++) {
    const t = i / 34, x = MX + (BX - MX) * t;
    const cy = (1 - t) * (1 - t) * (MT + 3) + 2 * (1 - t) * t * (MD - 1) + t * t * (BT + 6), dy = MD + (BD - MD) * t;
    if (cy < dy - 0.6) h += `M${r(x)} ${r(cy)} L${r(x)} ${r(dy)} `;
  }
  for (let i = 1; i <= 7; i++) {
    h += `M${MX + 1} ${MT + 4} L${r(MX + i * 4.6)} ${r(MD + (BD - MD) * i * 4.6 / (BX - MX))} `;
    h += `M${BX - 3} ${BT + 8} L${r(BX - 3 - i * 8.2)} ${r(BD + (MD - BD) * i * 8.2 / (BX - MX))} `;
  }
  k += `<path d="${h}" stroke="#5f5e58" stroke-width=".16" fill="none" opacity=".85"/>`;
  /* Seitenfeld rechts: Kabel vom Brooklyn-Pfeiler hinunter zur Verankerung */
  k += `<path d="M${BX + 6} ${BT + 6} Q${BX + 30} ${BD - 16} 400 ${BD - 12}" stroke="#4a4943" stroke-width=".7" fill="none"/>`;
  for (let i = 1; i < 6; i++) k += `<line x1="${BX + 6 + i * 3}" y1="${r(BT + 6 + i * 6.4)}" x2="${BX + 6 + i * 3}" y2="${r(BD - 1 - i * 0.5)}" stroke="#5f5e58" stroke-width=".2"/>`;
  k += pfeiler(MX, MW, MT, MD, 6.4, 0.8, 0.2);
  k += pfeiler(BX, BW, BT, BD, 12.6, 7, 0.24);
  /* vorderes Kabel über den Brooklyn-Pfeiler gelegt (Sattel) */
  k += `<path d="M${BX - 12} ${BT + 9} Q${BX - 4} ${BT + 2} ${BX + 8} ${BT + 6}" stroke="#3f3e39" stroke-width="1" fill="none"/>`;
  S.teil({ id: "brooklyn_bridge", de: "die Brooklyn Bridge", syl: "BROOK-lyn BRIDGE", it: "il ponte di Brooklyn", itSyl: "PON-te di BROOK-lyn", en: "Brooklyn Bridge",
    x: 0, y: 0, kunst: k, tipp: "Die Brooklyn Bridge (1883) war die erste Hängebrücke mit Stahlseilen. Oben in der Mitte gibt es einen Fußweg.",
    zoom: { x: BX - 30, y: BT - 10, w: 60, h: 40 },
    unter: [
      { id: "spitzbogen", de: "der Spitzbogen", syl: "SPITZ-bo-gen", it: "l'arco a sesto acuto", itSyl: "AR-co a SES-to a-CU-to", en: "pointed arch", x: BX - 5.3, y: BD, kunst: flaeche(-4.4, -42, 8.8, 42, 0.6),
        tipp: "Die Spitzbögen der Pfeiler sehen aus wie die Fenster einer gotischen Kirche." },
      { id: "stahlseil", de: "das Stahlseil", syl: "STAHL-seil", it: "il cavo d'acciaio", itSyl: "CA-vo d'AC-cia-io", en: "steel cable", x: BX - 22, y: BT + 16, kunst: flaeche(-8, -4, 10, 10, 0.6),
        tipp: "Jedes Hauptkabel besteht aus über 5000 einzelnen Stahldrähten." },
      { id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: BX, y: BT - 2, kunst: flaeche(-0.6, -9, 7.2, 8, 0.5),
        tipp: "Die Flagge der USA hat 50 Sterne und 13 Streifen." },
    ] });
}

/* =====================================================================
   9 — DAS BACKSTEINHAUS (Fulton Ferry, rechts) mit 10 — FEUERTREPPE
   und 11 — WASSERTANK auf dem Dach
   ===================================================================== */
const HAUS = { x0: 350, x1: 404, base: 196, top: 70 };
{
  const { x0, x1, base, top } = HAUS, W = x1 - x0, Hh = base - top;
  let k = "";
  k += `<rect x="0" y="${-Hh}" width="${W}" height="${Hh}" fill="${S.lg("ziegelf", [[0, "#b5583a"], [0.5, "#a24c31"], [1, "#843b25"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="0" y="${-Hh}" width="${W}" height="${Hh}" fill="url(#${S.id("ziegel")})"/>`;
  /* Gesims oben (Zinkblech, dunkelgrün) und Brüstung */
  k += `<rect x="-1.4" y="${-Hh - 2}" width="${W + 2}" height="3.2" fill="${S.lg("gesims", [[0, "#5a6b62"], [1, "#2e3a34"]])}"/>`;
  for (let x = 0; x < W; x += 3) k += `<rect x="${x}" y="${-Hh + 1.2}" width="1.4" height="1.6" fill="#2e3a34"/>`;
  /* Fenster in 5 Geschossen, Stürze aus Sandstein */
  const reihen = 5, fx = [6, 16.5, 27, 37.5, 48];
  for (let i = 0; i < reihen; i++) {
    const y = -Hh + 8 + i * 22.4;
    for (const x of fx) {
      k += `<rect x="${x - 3.4}" y="${r(y)}" width="6.8" height="13" fill="${S.lg("hfenster", [[0, "#7f97a6"], [0.5, "#3c4c58"], [1, "#2a343c"]])}"/>`;
      k += `<rect x="${x - 3.4}" y="${r(y + 6.2)}" width="6.8" height=".5" fill="#e8e2d6"/><rect x="${x - 0.25}" y="${r(y)}" width=".5" height="13" fill="#e8e2d6"/>`;
      k += `<rect x="${x - 4}" y="${r(y - 1.6)}" width="8" height="1.6" fill="#d8ccb4"/><rect x="${x - 4}" y="${r(y + 13)}" width="8" height="1.1" fill="#cbbea4"/>`;
      k += `<path d="M${x - 3} ${r(y + 0.6)} L${x - 1} ${r(y + 0.6)} L${x - 3} ${r(y + 5)} Z" fill="#fff" opacity=".18"/>`;
    }
  }
  /* Erdgeschoss: Ladenfront mit Markise */
  k += `<rect x="0" y="-16" width="${W}" height="16" fill="#3a2a22"/>`;
  k += `<rect x="2" y="-14" width="22" height="13" fill="${S.lg("laden", [[0, "#e9d9a8"], [1, "#a3885a"]])}" opacity=".9"/><rect x="28" y="-14" width="8" height="14" fill="#5a3b2a"/>`;
  k += `<path d="M0 -19 L30 -19 L32 -14.6 L-1 -14.6 Z" fill="#1f5a3c"/><path d="M0 -19 L30 -19" stroke="#2f7a52" stroke-width=".6"/>`;
  k += `<text x="14" y="-15.6" font-size="2.4" text-anchor="middle" fill="#f2ecd8" font-family="Georgia,serif">BAGELS · COFFEE</text>`;
  /* Schatten der Feuertreppe auf der Wand (Sonne von links) */
  k += `<rect x="0" y="${-Hh}" width="${W}" height="${Hh}" fill="${S.lg("hauslicht", [[0, "#fff", 0.1], [1, "#000", 0.2]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "backsteinhaus", de: "das Backsteinhaus", syl: "BACK-stein-haus", it: "la casa di mattoni", itSyl: "CA-sa di mat-TO-ni", en: "brick building", x: x0, y: base, kunst: k,
    tipp: "In Brooklyn stehen viele alte Lagerhäuser aus rotem Backstein. Heute wohnt man dort in Lofts." });
}
{
  /* DER WASSERTANK: Holzfass mit Eisenringen, Kegeldach, Stahlgerüst */
  const X = 378, Y = HAUS.top - 2;
  let k = schatten(0, 0, 13, 1.2, 0.3);
  for (const x of [-8, -2.6, 2.6, 8]) k += `<rect x="${x - 0.5}" y="-12" width="1" height="12" fill="${EISEN}"/>`;
  k += `<path d="M-8 -11 L8 -1 M8 -11 L-8 -1" stroke="#3a3f3c" stroke-width=".4"/>`;
  k += `<rect x="-9.6" y="-12.6" width="19.2" height="1.4" fill="#2e3230"/>`;
  k += `<path d="M-9 -12.6 L-9 -33 Q0 -34.4 9 -33 L9 -12.6 Q0 -11.6 -9 -12.6 Z" fill="${S.lg("fass", [[0, "#a88a63"], [0.3, "#8a6a45"], [0.75, "#6a4f33"], [1, "#4f3a25"]], 0, 0, 1, 0)}"/>`;
  for (let x = -8.2; x < 9; x += 1.15) k += `<line x1="${r(x)}" y1="${r(-12.4 - Math.cos(x / 9) * 0.2)}" x2="${r(x)}" y2="-33" stroke="#4a3622" stroke-width=".14" opacity=".7"/>`;
  for (const y of [-14.5, -17.4, -20.6, -24, -27.6, -31]) k += `<path d="M-9 ${y} Q0 ${y + 1.1} 9 ${y}" stroke="#2c2c2a" stroke-width=".45" fill="none"/>`;
  k += `<path d="M-10 -33 L0 -40.6 L10 -33 Q0 -31.8 -10 -33 Z" fill="${S.lg("tankdach", [[0, "#7d6a54"], [1, "#4a3b2c"]], 0, 0, 1, 0)}"/>`;
  k += `<circle cx="0" cy="-40.8" r=".7" fill="#3a3a38"/><path d="M-8 -26 L-8 -12.6" stroke="#2c2c2a" stroke-width=".3"/>`;
  for (let y = -13.4; y > -26; y -= 1.4) k += `<line x1="-8.6" y1="${r(y)}" x2="-7.4" y2="${r(y)}" stroke="#2c2c2a" stroke-width=".22"/>`;
  k += `<path d="M-8.4 -32 L-8.4 -13 L-6 -13 L-6 -32 Z" fill="#fff" opacity=".08"/>`;
  S.teil({ id: "wassertank", de: "der Wassertank", syl: "WAS-ser-tank", it: "il serbatoio d'acqua", itSyl: "ser-ba-TO-io d'AC-qua", en: "water tower", x: X, y: Y + 2, kunst: k,
    tipp: "Auf vielen Dächern in New York steht ein Wassertank aus Holz. Er gibt den oberen Stockwerken Wasserdruck." });
}
{
  /* DIE FEUERTREPPE: Balkone aus Eisengitter, dazwischen schräge Leitern */
  const { x0, base, top } = HAUS, Hh = base - top;
  let k = "";
  const x1 = 3, x2 = 30;
  for (let i = 0; i < 4; i++) {
    const y = -Hh + 22 + i * 22.4;
    k += `<rect x="${x1}" y="${r(y)}" width="${x2 - x1}" height="1.1" fill="#1d1f1e"/>`;
    k += `<path d="M${x1} ${r(y)} L${x1} ${r(y - 6)} L${x2} ${r(y - 6)} L${x2} ${r(y)}" stroke="#1d1f1e" stroke-width=".55" fill="none"/>`;
    for (let x = x1 + 1.6; x < x2; x += 1.6) k += `<line x1="${r(x)}" y1="${r(y - 6)}" x2="${r(x)}" y2="${r(y)}" stroke="#1d1f1e" stroke-width=".22"/>`;
    k += `<line x1="${x1}" y1="${r(y - 3)}" x2="${x2}" y2="${r(y - 3)}" stroke="#1d1f1e" stroke-width=".25"/>`;
    /* Leiter zum nächsten Balkon (schräg) */
    if (i < 3) {
      const ya = y + 1.1, yb = y + 22.4;
      k += `<path d="M${x2 - 3} ${r(ya)} L${x1 + 9} ${r(yb)} M${x2 - 0.8} ${r(ya)} L${x1 + 11.2} ${r(yb)}" stroke="#1d1f1e" stroke-width=".4"/>`;
      for (let t = 0.08; t < 1; t += 0.09) k += `<line x1="${r(x2 - 3 + (x1 + 9 - x2 + 3) * t)}" y1="${r(ya + (yb - ya) * t)}" x2="${r(x2 - 0.8 + (x1 + 11.2 - x2 + 0.8) * t)}" y2="${r(ya + (yb - ya) * t)}" stroke="#1d1f1e" stroke-width=".25"/>`;
    }
    k += `<rect x="${x1}" y="${r(y + 1.1)}" width="${x2 - x1}" height="2.4" fill="#000" opacity=".12"/>`;
  }
  /* Klappleiter unten (hochgezogen) */
  k += `<path d="M${x2 - 4} ${-Hh + 22 + 3 * 22.4 + 1.1} L${x2 - 4} ${-Hh + 22 + 3 * 22.4 + 10} M${x2 - 1.6} ${-Hh + 22 + 3 * 22.4 + 1.1} L${x2 - 1.6} ${-Hh + 22 + 3 * 22.4 + 10}" stroke="#1d1f1e" stroke-width=".4"/>`;
  for (let y = -Hh + 22 + 3 * 22.4 + 2.6; y < -Hh + 22 + 3 * 22.4 + 10; y += 1.6) k += `<line x1="${x2 - 4}" y1="${r(y)}" x2="${x2 - 1.6}" y2="${r(y)}" stroke="#1d1f1e" stroke-width=".25"/>`;
  S.teil({ oben: true, id: "feuertreppe", de: "die Feuertreppe", syl: "FEU-er-trep-pe", it: "la scala antincendio", itSyl: "SCA-la an-tin-CEN-dio", en: "fire escape", x: x0, y: base, kunst: k,
    tipp: "Bei Feuer klettert man über die Feuertreppe außen am Haus hinunter." });
}

/* =====================================================================
   12 — DAS GELÄNDER an der Uferkante (mit 13 — DER MÖWE)
   ===================================================================== */
{
  const Y = 200, s = um(Y);   /* 10 Einheiten je Meter */
  let k = `<rect x="0" y="-1.2" width="${HAUS.x0}" height="1.6" fill="${S.lg("kante", [[0, "#e6e0d4"], [1, "#a8a094"]])}"/>`;
  const oben = -1.1 * s;
  k += `<rect x="0" y="${r(oben - 0.6)}" width="${HAUS.x0}" height="1.4" rx=".6" fill="${S.lg("handlauf", [[0, "#c39b6c"], [0.5, "#9a7148"], [1, "#6f4f30"]])}"/>`;
  k += `<rect x="0" y="${r(oben * 0.55)}" width="${HAUS.x0}" height=".45" fill="#2a2e2c"/><rect x="0" y="${r(oben * 0.18)}" width="${HAUS.x0}" height=".45" fill="#2a2e2c"/>`;
  for (let x = 6; x < HAUS.x0; x += 2 * s) k += `<rect x="${r(x - 0.55)}" y="${r(oben)}" width="1.1" height="${r(-oben)}" fill="${EISEN}"/>`;
  k += `<rect x="0" y="${r(oben - 0.6)}" width="${HAUS.x0}" height=".35" fill="#f2d7ac" opacity=".7"/>`;
  S.teil({ id: "gelaender", de: "das Geländer", syl: "ge-LÄN-der", it: "la ringhiera", itSyl: "rin-GHIE-ra", en: "railing", x: 0, y: Y, kunst: k });
}
{
  let k = `<ellipse cx="0" cy="0" rx="2.2" ry=".4" fill="#000" opacity=".15"/>`;
  k += `<path d="M-3 -2.2 Q-1.6 -3.6 1.2 -3.4 L2.6 -2.4 Q1.4 -1.4 -1 -1.5 Z" fill="${S.lg("moewe", [[0, "#ffffff"], [1, "#d9dde0"]])}"/>`;
  k += `<path d="M-3.4 -2.4 L-1 -2.9 L.8 -3.3 L-.6 -2.1 Z" fill="#8d979e"/><path d="M-3.8 -2.5 L-3 -2.6 L-3.2 -2.1 Z" fill="#1b1d1f"/>`;
  k += `<circle cx="2" cy="-3.9" r="1.05" fill="#fff"/><path d="M2.9 -4 l1.2 .2 l-1.1 .3 Z" fill="#f0c33c"/><circle cx="3.75" cy="-3.85" r=".15" fill="#d23b30"/><circle cx="2.3" cy="-4.1" r=".18" fill="#222"/>`;
  k += `<path d="M.2 -1.6 L.2 0 M1 -1.6 L1 0" stroke="#e1a24a" stroke-width=".3"/>`;
  S.teil({ oben: true, id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: 66, y: 188.4, kunst: k });
}

/* =====================================================================
   14 — DER VERKÄUFER und 15 — DER IMBISSWAGEN (Hotdogs, blau-gelber Schirm)
   ===================================================================== */
const WAGEN = { x: 112, y: 238 };
{
  const m = B.mensch({ id: "nyc_verk", geschlecht: "m", pose: "servieren", blick: 20, frisur: "kurz", haarfarbe: "schwarz", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "weiss" }, schuerze: { stueck: "schuerze", farbe: "weiss" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh", farbe: "schwarz" }, kopf: { stueck: "kappe", farbe: "blau" } } }, 1.75 * um(WAGEN.y - 3));
  S.teil({ id: "verkaeufer", de: "der Verkäufer", syl: "ver-KÄU-fer", it: "il venditore", itSyl: "ven-di-TO-re", en: "vendor", x: WAGEN.x + 12, y: WAGEN.y - 3, kunst: m.svg,
    tipp: "Der Verkäufer fragt: „With everything?“ — mit allem, also Senf, Zwiebeln und Sauerkraut?" });
}
{
  const s = um(WAGEN.y);   /* ≈ 17,6 Einheiten je Meter */
  let k = schatten(0, 0.4, 22, 1.6, 0.35);
  /* Räder */
  for (const x of [-12, 12]) k += `<circle cx="${x}" cy="-3.2" r="3.2" fill="#202224"/><circle cx="${x}" cy="-3.2" r="1.6" fill="${STAHL}"/><circle cx="${x}" cy="-3.2" r=".5" fill="#555"/>`;
  /* Edelstahlkasten mit Klappen, Aufschrift */
  k += `<path d="M-19 -5.6 L19 -5.6 L19 -21 L-19 -21 Z" fill="${STAHL}"/>`;
  k += `<rect x="-19" y="-21" width="38" height="1.4" fill="#f4f6f7"/>`;
  for (const x of [-16, -3, 10]) k += `<rect x="${x}" y="-17.6" width="9" height="9.4" rx=".6" fill="none" stroke="#9aa3aa" stroke-width=".35"/><rect x="${x + 3.2}" y="-12.6" width="2.6" height=".7" rx=".3" fill="#7d868d"/>`;
  k += `<rect x="-19" y="-19.4" width="38" height="3" fill="#1d5fae"/><text x="0" y="-17.2" font-size="2.3" text-anchor="middle" fill="#ffe14d" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".25">HOT DOGS · PRETZELS · SODA</text>`;
  /* Arbeitsfläche oben: Wasserbad mit Deckel, Senf, Ketchup, Brezeln im Glaskasten */
  k += `<rect x="-19.6" y="-22.2" width="39.2" height="1.4" rx=".4" fill="#c9cfd4"/>`;
  k += `<rect x="-17" y="-28" width="12" height="5.8" rx=".6" fill="#e6f1f4" opacity=".55" stroke="#9fb2bb" stroke-width=".3"/>`;
  for (const [x, y] of [[-14.6, -24.4], [-11, -24.6], [-7.6, -24.4], [-12.8, -26.4], [-9.2, -26.4]]) k += `<path d="M${x - 1.6} ${y + 0.8} C${x - 2.2} ${y - 0.6} ${x - 0.6} ${y - 1.6} ${x} ${y - 0.6} C${x + 0.6} ${y - 1.6} ${x + 2.2} ${y - 0.6} ${x + 1.6} ${y + 0.8}" stroke="#8a4614" stroke-width=".8" fill="none" stroke-linecap="round"/>`;
  k += `<rect x="-3" y="-24" width="9" height="1.8" rx=".5" fill="#aeb6bd"/><path d="M-3 -24 Q1.5 -26.6 6 -24 Z" fill="${STAHL}"/>`;
  /* ein fertiger Hotdog auf dem Brett */
  k += `<rect x="7" y="-23.2" width="7" height="1" rx=".3" fill="#d9c7a2"/>`;
  k += `<path d="M7.6 -23.2 Q10.5 -21.8 13.4 -23.2 Q13.6 -24.8 10.5 -24.8 Q7.4 -24.8 7.6 -23.2 Z" fill="#e3b26a"/><rect x="7.2" y="-24.6" width="6.6" height="1.1" rx=".55" fill="#b5532c"/><path d="M7.8 -24.5 q.7 -.6 1.3 0 t1.3 0 t1.3 0 t1.3 0" stroke="#f5c400" stroke-width=".45" fill="none"/>`;
  /* Senf (gelb) und Ketchup (rot) in Spritzflaschen */
  k += `<path d="M15.4 -22.2 L15.4 -27 Q16.4 -27.8 17.4 -27 L17.4 -22.2 Z" fill="#f2c200"/><path d="M16.2 -27.6 L16.4 -29.2 L16.6 -27.6 Z" fill="#c89d00"/>`;
  k += `<path d="M18 -22.2 L18 -26.4 Q19 -27.2 20 -26.4 L20 -22.2 Z" fill="#c8211f"/><path d="M18.8 -27 L19 -28.4 L19.2 -27 Z" fill="#8f1614"/>`;
  /* Schirm (blau-gelb gestreift) auf der Stange */
  const pole = 2.3 * s;
  k += `<rect x="-.45" y="${r(-pole)}" width=".9" height="${r(pole - 22)}" fill="#c9cfd4"/>`;
  const R = 0.95 * s, top = -pole - 1.2;
  for (let i = 0; i < 8; i++) {
    const a0 = Math.PI + (i / 8) * Math.PI, a1 = Math.PI + ((i + 1) / 8) * Math.PI;
    const p0 = [Math.cos(a0) * R, top + 6 + Math.sin(a0) * -0], p1 = [Math.cos(a1) * R, top + 6];
    k += `<path d="M0 ${r(top)} L${r(p0[0])} ${r(p0[1] + (Math.abs(p0[0]) / R) * 1.2)} Q${r((p0[0] + p1[0]) / 2)} ${r(top + 7.6)} ${r(p1[0])} ${r(p1[1] + (Math.abs(p1[0]) / R) * 1.2)} Z" fill="${i % 2 ? "#f7d43a" : "#1f62b8"}"/>`;
  }
  k += `<path d="M${r(-R)} ${r(top + 7.2)} Q0 ${r(top + 9.6)} ${r(R)} ${r(top + 7.2)}" stroke="#123f78" stroke-width=".5" fill="none"/>`;
  k += `<circle cx="0" cy="${r(top - 0.4)}" r=".7" fill="#e9eef0"/>`;
  k += `<path d="M${r(-R * 0.7)} ${r(top + 4)} Q${r(-R * 0.3)} ${r(top + 1.2)} 0 ${r(top + 0.4)}" stroke="#fff" stroke-width=".6" opacity=".35" fill="none"/>`;
  k += `<text x="${r(-R * 0.45)}" y="${r(top + 6.4)}" font-size="2.2" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" transform="rotate(-10 ${r(-R * 0.45)} ${r(top + 6.4)})">NYC</text>`;
  const zx = WAGEN.x, zy = WAGEN.y;
  S.teil({ id: "imbisswagen", de: "der Imbisswagen", syl: "IM-biss-wa-gen", it: "il carretto dei panini", itSyl: "car-RET-to dei pa-NI-ni", en: "food cart", x: zx, y: zy, kunst: k,
    tipp: "An den Imbisswagen an der Straße kauft man in New York schnell einen Hotdog.",
    zoom: { x: zx - 24, y: zy - 31, w: 48, h: 32 },
    unter: [
      { id: "hotdog", de: "der Hotdog", syl: "HOT-dog", it: "l'hot dog", itSyl: "hot DOG", en: "hot dog", x: zx + 10.5, y: zy - 22.2, kunst: flaeche(-4, -3.4, 8, 3.8, 0.5),
        tipp: "Ein Hotdog ist ein Würstchen in einem weichen Brötchen." },
      { id: "brezel", de: "die Brezel", syl: "BRE-zel", it: "il pretzel", itSyl: "PRET-zel", en: "pretzel", x: zx - 11, y: zy - 22.2, kunst: flaeche(-6, -6, 12, 6, 0.5),
        tipp: "Die großen weichen Brezeln kamen mit deutschen Einwanderern nach New York." },
      { id: "senf", de: "der Senf", syl: "SENF", it: "la senape", itSyl: "SE-na-pe", en: "mustard", x: zx + 16.4, y: zy - 22.2, kunst: flaeche(-1.4, -7.2, 2.8, 7.2, 0.5) },
    ] });
}

/* =====================================================================
   16 — DIE BANK mit Bagel und Kaffeebecher (Lupe)
   ===================================================================== */
{
  const X = 214, Y = 244, s = um(Y);   /* 18,8 Einheiten je Meter */
  const L = 1.8 * s, sitz = 0.45 * s, lehne = 0.85 * s;
  let k = schatten(0, 0.4, L / 2 + 2, 1.4, 0.3);
  /* Gusseisenfüße (Parkbank) und Holzlatten */
  for (const x of [-L / 2 + 3, L / 2 - 3]) k += `<path d="M${r(x - 1.4)} 0 L${r(x - 0.4)} ${r(-sitz)} L${r(x + 0.6)} ${r(-lehne)} L${r(x + 1.4)} ${r(-lehne)} L${r(x + 0.8)} ${r(-sitz)} L${r(x + 1.6)} 0 Z" fill="#26302b"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-L / 2)}" y="${r(-sitz - 0.4 - i * 1.3)}" width="${r(L)}" height="1.1" rx=".3" fill="${S.lg("latte" + i, [[0, "#c79a63"], [1, "#8f6538"]])}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-L / 2 + 0.6)}" y="${r(-lehne + i * 2.2)}" width="${r(L - 1.2)}" height="1.5" rx=".4" fill="${S.lg("lehne" + i, [[0, "#b98c57"], [1, "#835b31"]])}"/>`;
  /* Kaffeebecher „Anthora“ (blau-weiß, griechisch gemustert) */
  const bx = -6, by = -sitz - 4.2;
  let b = `<path d="M${bx - 1.3} ${by - 3.2} L${bx + 1.3} ${by - 3.2} L${bx + 1} ${by} L${bx - 1} ${by} Z" fill="#f4f6f8"/>`;
  b += `<rect x="${bx - 1.25}" y="${by - 2.6}" width="2.5" height="1.6" fill="#2556a8"/><path d="M${bx - 1.1} ${by - 1.8} h.4 v-.4 h.4 v.4 h.4 v-.4 h.4 v.4 h.4" stroke="#f4f6f8" stroke-width=".12" fill="none"/>`;
  b += `<rect x="${bx - 1.45}" y="${by - 3.5}" width="2.9" height=".4" rx=".15" fill="#e8ecef"/>`;
  k += b;
  /* Bagel mit Frischkäse auf Wachspapier */
  const gx = 3, gy = -sitz - 4.2;
  let g = `<path d="M${gx - 3.4} ${gy + 0.1} L${gx + 3.6} ${gy + 0.1} L${gx + 2.8} ${gy - 0.6} L${gx - 2.6} ${gy - 0.6} Z" fill="#f3efe4"/>`;
  g += `<ellipse cx="${gx}" cy="${gy - 1.1}" rx="2.4" ry="1.05" fill="${S.rg("bagel", [[0, "#e0a85c"], [0.7, "#b8742f"], [1, "#8a4f1c"]], 0.45, 0.35, 0.7)}"/>`;
  g += `<ellipse cx="${gx}" cy="${gy - 1.2}" rx=".7" ry=".3" fill="#5e3a18"/>`;
  g += `<path d="M${gx - 2.3} ${gy - 1} Q${gx} ${gy - 0.2} ${gx + 2.3} ${gy - 1}" stroke="#fbf6ea" stroke-width=".5" fill="none"/>`;
  for (let i = 0; i < 8; i++) g += `<ellipse cx="${r(gx - 1.8 + rnd() * 3.6)}" cy="${r(gy - 1.6 + rnd() * 0.6)}" rx=".18" ry=".1" fill="#f6ead0"/>`;
  k += g;
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: X, y: Y, kunst: k,
    zoom: { x: X - 21, y: Y - 28, w: 42, h: 28 },
    unter: [
      { id: "bagel", de: "der Bagel", syl: "BAGEL", it: "il bagel", itSyl: "BA-gel", en: "bagel", x: X + gx, y: Y + gy + 0.2, kunst: flaeche(-3.6, -2.4, 7.2, 2.6, 0.5),
        tipp: "Der Bagel wird erst gekocht und dann gebacken. Mit Frischkäse ist er das typische Frühstück in New York." },
      { id: "kaffeebecher", de: "der Kaffeebecher", syl: "KAF-fee-be-cher", it: "il bicchiere di caffè", itSyl: "bic-CHIE-re di caf-FÈ", en: "coffee cup", x: X + bx, y: Y + by, kunst: flaeche(-1.6, -3.6, 3.2, 3.6, 0.5),
        tipp: "Der blau-weiße Pappbecher mit dem griechischen Muster ist ein Symbol von New York." },
    ] });
}

/* =====================================================================
   17 — DER HYDRANT (am Bordstein)
   ===================================================================== */
{
  const Y = 238, s = um(Y);   /* 17,6 je Meter; Hydrant 0,75 m */
  const h = 0.75 * s;
  let k = schatten(0, 0.3, 4, 0.8, 0.3);
  const ROT = S.lg("hydr", [[0, "#ff6b55"], [0.45, "#d9342a"], [1, "#8f1d17"]], 0, 0, 1, 0);
  k += `<rect x="-3.2" y="-1.4" width="6.4" height="1.4" rx=".4" fill="#a32a22"/>`;
  k += `<path d="M-2.4 -1.4 L-2.2 ${r(-h * 0.72)} L2.2 ${r(-h * 0.72)} L2.4 -1.4 Z" fill="${ROT}"/>`;
  k += `<rect x="-2.8" y="${r(-h * 0.76)}" width="5.6" height="1.2" rx=".4" fill="#b8302a"/>`;
  k += `<path d="M-2 ${r(-h * 0.76)} Q-2 ${r(-h)} 0 ${r(-h)} Q2 ${r(-h)} 2 ${r(-h * 0.76)} Z" fill="${S.lg("hydk", [[0, "#e9eef0"], [1, "#9aa3aa"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-.6" y="${r(-h - 1)}" width="1.2" height="1.1" fill="#b9c1c6"/>`;
  for (const sx of [-1, 1]) k += `<rect x="${sx < 0 ? -4 : 2.2}" y="${r(-h * 0.5)}" width="1.8" height="2.2" rx=".4" fill="#b8302a"/><rect x="${sx < 0 ? -4.4 : 3.8}" y="${r(-h * 0.5 + 0.3)}" width=".6" height="1.6" fill="#7a1b15"/>`;
  k += `<rect x="-1.6" y="${r(-h * 0.36)}" width="3.2" height="2.6" rx=".6" fill="#b8302a"/><circle cx="0" cy="${r(-h * 0.36 + 1.3)}" r=".7" fill="#7a1b15"/>`;
  k += `<path d="M-1.8 ${r(-h * 0.7)} L-1.6 -2" stroke="#fff" stroke-width=".5" opacity=".35"/>`;
  S.teil({ id: "hydrant", de: "der Hydrant", syl: "hy-DRANT", it: "l'idrante", itSyl: "i-DRAN-te", en: "fire hydrant", x: 256, y: Y, kunst: k,
    tipp: "Im Sommer öffnet die Feuerwehr manchmal Hydranten, damit Kinder sich abkühlen können." });
}

/* =====================================================================
   18 — DAS TAXI (Yellow Cab, auf dem Kopfsteinpflaster)
   leicht schräg von vorn links gesehen
   ===================================================================== */
{
  const X = 328, Y = 248, s = um(Y);     /* ≈ 19,6 Einheiten je Meter */
  const L = 4.0 * s * 0.92, Hk = 1.47 * s, R = 0.34 * s;
  let k = schatten(2, 0.2, L / 2 + 6, 2.2, 0.45);
  /* Seite: Karosserie (Limousine), Front links */
  const x0 = -L / 2, x1 = L / 2;
  const body = `M${r(x0 + 2)} ${r(-R * 0.6)} L${r(x0 - 0.4)} ${r(-R * 0.9)} Q${r(x0 - 1.4)} ${r(-Hk * 0.48)} ${r(x0 + 3)} ${r(-Hk * 0.58)} L${r(x0 + L * 0.27)} ${r(-Hk * 0.64)} Q${r(x0 + L * 0.36)} ${r(-Hk * 0.98)} ${r(x0 + L * 0.44)} ${r(-Hk)} L${r(x0 + L * 0.72)} ${r(-Hk)} Q${r(x0 + L * 0.8)} ${r(-Hk * 0.96)} ${r(x0 + L * 0.88)} ${r(-Hk * 0.66)} L${r(x1 + 0.8)} ${r(-Hk * 0.6)} Q${r(x1 + 1.6)} ${r(-Hk * 0.4)} ${r(x1)} ${r(-R * 0.7)} L${r(x1 - 2)} ${r(-R * 0.6)} Z`;
  k += `<path d="${body}" fill="${TAXIGELB}"/>`;
  /* Fenster (dunkel getönt) mit B-Säule */
  k += `<path d="M${r(x0 + L * 0.3)} ${r(-Hk * 0.66)} Q${r(x0 + L * 0.37)} ${r(-Hk * 0.93)} ${r(x0 + L * 0.45)} ${r(-Hk * 0.94)} L${r(x0 + L * 0.71)} ${r(-Hk * 0.94)} Q${r(x0 + L * 0.78)} ${r(-Hk * 0.9)} ${r(x0 + L * 0.85)} ${r(-Hk * 0.67)} Z" fill="${S.lg("taxifenster", [[0, "#6d8191"], [0.5, "#2c3a45"], [1, "#1c252c"]])}"/>`;
  k += `<rect x="${r(x0 + L * 0.565)}" y="${r(-Hk * 0.95)}" width="1.2" height="${r(Hk * 0.3)}" fill="#1b1d1f"/>`;
  k += `<path d="M${r(x0 + L * 0.33)} ${r(-Hk * 0.7)} L${r(x0 + L * 0.42)} ${r(-Hk * 0.9)} L${r(x0 + L * 0.46)} ${r(-Hk * 0.9)} L${r(x0 + L * 0.38)} ${r(-Hk * 0.7)} Z" fill="#fff" opacity=".22"/>`;
  /* Türfugen, Griffe, Spiegel */
  for (const t of [0.3, 0.565, 0.84]) k += `<line x1="${r(x0 + L * t)}" y1="${r(-Hk * 0.64)}" x2="${r(x0 + L * t + 0.3)}" y2="${r(-R * 0.75)}" stroke="#8a6a08" stroke-width=".3"/>`;
  for (const t of [0.5, 0.77]) k += `<rect x="${r(x0 + L * t)}" y="${r(-Hk * 0.6)}" width="2.2" height=".6" rx=".3" fill="#6b5206"/>`;
  k += `<path d="M${r(x0 + L * 0.3)} ${r(-Hk * 0.68)} l-2.2 -.4 l.2 -1.6 l2 .3 Z" fill="#d8a20c"/>`;
  /* NYC-TAXI-Logo auf der Vordertür, Tarif auf der Hintertür, Nummer */
  const lx = x0 + L * 0.44, ly = -Hk * 0.4;
  k += `<text x="${r(lx - 3)}" y="${r(ly)}" font-size="2.4" fill="#111" font-family="Arial,sans-serif" font-weight="bold">NYC</text>`;
  k += `<rect x="${r(lx + 2.6)}" y="${r(ly - 2.4)}" width="2.8" height="2.8" rx=".3" fill="#111"/><text x="${r(lx + 4)}" y="${r(ly - 0.1)}" font-size="2.4" text-anchor="middle" fill="#f9c623" font-family="Arial,sans-serif" font-weight="bold">T</text>`;
  k += `<text x="${r(lx + 5.7)}" y="${r(ly)}" font-size="2.4" fill="#111" font-family="Arial,sans-serif" font-weight="bold">AXI</text>`;
  k += `<text x="${r(x0 + L * 0.7)}" y="${r(-Hk * 0.36)}" font-size="1.2" text-anchor="middle" fill="#222" font-family="Arial,sans-serif">$3.00 INITIAL CHARGE</text>`;
  k += `<text x="${r(x0 + L * 0.7)}" y="${r(-Hk * 0.27)}" font-size="1.1" text-anchor="middle" fill="#222" font-family="Arial,sans-serif">70¢ PER 1/5 MILE</text>`;
  k += `<text x="${r(x1 - 5)}" y="${r(-Hk * 0.47)}" font-size="1.8" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-weight="bold">7K42</text>`;
  /* Front (schräg, schmal sichtbar): Scheinwerfer, Grill, Stoßstange */
  k += `<path d="M${r(x0 - 0.4)} ${r(-R * 0.9)} Q${r(x0 - 1.4)} ${r(-Hk * 0.48)} ${r(x0 + 3)} ${r(-Hk * 0.58)} L${r(x0 + 0.6)} ${r(-Hk * 0.58)} Q${r(x0 - 3.4)} ${r(-Hk * 0.5)} ${r(x0 - 3.6)} ${r(-R * 1)} Z" fill="#d9a40d"/>`;
  k += `<path d="M${r(x0 - 3.2)} ${r(-Hk * 0.45)} L${r(x0 - 0.6)} ${r(-Hk * 0.5)} L${r(x0 - 0.4)} ${r(-Hk * 0.42)} L${r(x0 - 3)} ${r(-Hk * 0.39)} Z" fill="#fdfbe8"/>`;
  k += `<rect x="${r(x0 - 3.6)}" y="${r(-Hk * 0.36)}" width="3" height="1.8" rx=".3" fill="#1d1f21"/>`;
  k += `<rect x="${r(x0 - 3.8)}" y="${r(-R * 1.1)}" width="${r(L + 4.6)}" height="${r(R * 0.42)}" rx="1" fill="#2a2b2c"/>`;
  /* Dachschild mit Lizenznummer */
  k += `<path d="M${r(x0 + L * 0.5)} ${r(-Hk - 0.2)} L${r(x0 + L * 0.51)} ${r(-Hk - 3.2)} L${r(x0 + L * 0.66)} ${r(-Hk - 3.2)} L${r(x0 + L * 0.67)} ${r(-Hk - 0.2)} Z" fill="#f4f2ea"/>`;
  k += `<text x="${r(x0 + L * 0.585)}" y="${r(-Hk - 1.1)}" font-size="2.1" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-weight="bold">7K42</text>`;
  /* Räder mit Radkappen */
  for (const t of [0.17, 0.8]) {
    const cx = x0 + L * t;
    k += `<circle cx="${r(cx)}" cy="${r(-R)}" r="${r(R)}" fill="#1a1b1c"/><circle cx="${r(cx)}" cy="${r(-R)}" r="${r(R * 0.6)}" fill="${S.rg("felge", [[0, "#eef1f3"], [1, "#8b949b"]], 0.4, 0.4, 0.7)}"/>`;
    for (let i = 0; i < 5; i++) { const a = i * 72 * Math.PI / 180; k += `<line x1="${r(cx)}" y1="${r(-R)}" x2="${r(cx + Math.cos(a) * R * 0.55)}" y2="${r(-R + Math.sin(a) * R * 0.55)}" stroke="#6d757b" stroke-width=".35"/>`; }
  }
  /* Glanz auf dem Lack */
  k += `<path d="M${r(x0 + 4)} ${r(-Hk * 0.56)} L${r(x1)} ${r(-Hk * 0.58)}" stroke="#fff6c8" stroke-width=".7" opacity=".7"/>`;
  S.teil({ id: "taxi", de: "das Taxi", syl: "TA-xi", it: "il taxi", itSyl: "TA-xi", en: "taxi", x: X, y: Y, kunst: k,
    tipp: "Die gelben Taxis (Yellow Cabs) sind ein Wahrzeichen von New York. Man winkt sie am Straßenrand heran." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/new_york.js"));
console.log(aus);
