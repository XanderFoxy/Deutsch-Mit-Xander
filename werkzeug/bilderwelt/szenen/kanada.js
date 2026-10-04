#!/usr/bin/env node
/* =====================================================================
   KANADA – NIAGARAFÄLLE (FASSUNG 854) — Bilderwelt neu
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekanntesten Städte in anderen Ländern, die
   berühmt für irgendetwas sind … als Profi-Grafikdesigner auf
   Hollywood-Niveau … mit größter Sorgfalt und Präzision“.

   RECHERCHE (Niagara Parks, Lagepläne Queen Victoria Park/Table Rock,
   Maße der Fälle, Niagara City Cruises, Skylon Tower, Sonnenstand
   Anfang Oktober):
   - STANDORT: TABLE ROCK am kanadischen Ufer (Niagara Falls, Ontario),
     an der Steinmauer direkt an der Abbruchkante, wenige Meter nördlich
     der Stelle, an der das Wasser der Hufeisenfälle zu Boden stürzt.
     Blick nach OSTNORDOST.
   - RECHTS (Osten bis Südosten): die HUFEISENFÄLLE (Horseshoe Falls,
     „Kanadische Fälle“): 51 m hoch, die Kante rund 790 m lang, als
     Hufeisen geschwungen. Vom Table Rock sieht man die Kante vom nahen
     Teil (rechts, groß) über den tiefsten Punkt bis zur Gegenseite am
     Terrapin Point (Aussichtspunkt auf Goat Island, USA). In der Mitte
     des Hufeisens ist das Wasser so tief, dass die Kante GRÜN leuchtet.
     Aus dem Becken steigt eine riesige GISCHTWOLKE auf, oft über 100 m
     hoch. Steht die Sonne abends im Westen (in unserem Rücken),
     erscheint in der Gischt über der Schlucht ein REGENBOGEN
     (Gegenpunkt der Sonne ≈ 60°, Bogenradius 42°).
   - MITTE: GOAT ISLAND (Ziegeninsel, USA) — flach, mit Herbstwald, die
     Felswand zur Schlucht in Schichten: oben grauer Dolomit (Lockport),
     darunter weichere, dunklere Schichten, unten Schutthalden.
   - LINKS AM RAND (Nordosten, rund 0,9 km): gerade noch der Südteil der
     AMERIKANISCHEN FÄLLE (21–30 m freier Fall auf große Felsbrocken)
     und daneben, hinter der kleinen Luna Island, der schmale BRAUTSCHLEIER
     (Bridal Veil Falls); an seinem Fuß die Holzstege der „Cave of the
     Winds“ mit Besuchern in gelben Capes.
   - IN DER SCHLUCHT: das Ausflugsboot von Niagara City Cruises (früher
     Hornblower) — Katamaran mit zwei Decks, die Fahrgäste in ROTEN
     Regencapes (die US-Boote „Maid of the Mist“ haben blaue), am Heck
     die kanadische Flagge. Es fährt bis in die Gischt im Hufeisen.
     Möwen (Ringschnabelmöwen) segeln über dem Wasser.
   - Der SKYLON TOWER (160 m) steht in unserem Rücken links (Norden, auf
     dem Hügel über dem Queen Victoria Park) — von hier aus ist er mit
     den Fällen nicht im selben Blick; er bleibt deshalb weg.
   - TYPISCHES (Anfang Oktober): ZUCKERAHORN in leuchtendem Rot und Orange
     (das Ahornblatt ist auf der FLAGGE Kanadas), AHORNSIRUP in der
     Flasche in Blattform (Andenken aus dem Table Rock Centre), dazu ein
     Fähnchen in der Andenkentüte; KANADAGÄNSE ziehen im Keil nach Süden;
     SCHWARZE EICHHÖRNCHEN (eine dunkle Form des Grauhörnchens) sind im
     Park sehr häufig. MÜNZFERNROHRE stehen an der Mauer.
   KAMERA: Standpunkt Table Rock (≈ 10 m nördlich der Kante), Augenhöhe
   1,6 m über der Promenade (= Höhe des Flusses oberhalb der Fälle),
   Blick nach 95° (Ost), Brennweite 240, Horizont y = 112. Welt in Metern:
   x Ost, y Nord, z oben, Ursprung an der Westecke der Kante (Table Rock).
   Der Fluss unterhalb der Fälle liegt 52 m tiefer.
   LICHT: 3. Oktober, gegen 18 Uhr (Sonnenuntergang 18:50) — Sonne im
   Westen (Azimut 255°, 9° hoch), also HINTER UNS, etwas rechts. Goldenes
   Abendlicht: nach Westen gewandte Flächen (Amerikanische Fälle, Felswand
   von Goat Island, Westteil der Hufeisenfälle) leuchten warm; der nahe
   Teil des Hufeisens (nach Nordost) liegt im Schatten. Lange Schatten
   fallen nach vorn, leicht links (Richtung 75°). Der Gegenpunkt der Sonne
   liegt 9° unter dem Horizont bei 75°: der Regenbogen steht als hoher
   Bogen über der Schlucht; sichtbar ist er nur, wo Gischt in der Luft ist.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "kanada", titel: "Kanada – Niagarafälle", emoji: "🍁", thema: "Länder", kuerzel: "kan", fassung: 854, breite: 400, hoehe: 260 });
{ const lg = S.lg, rg = S.rg, schon = {}; S.lg = (n, ...a) => schon["l" + n] || (schon["l" + n] = lg(n, ...a)); S.rg = (n, ...a) => schon["r" + n] || (schon["r" + n] = rg(n, ...a)); }
const rnd = zufall(1846);
const r = B.r;
const HOR = 112, F = 240, CX = 200;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const P = (pts, zu = true) => "M" + pts.map(([x, y]) => r(x) + " " + r(y)).join(" L") + (zu ? " Z" : "");
const glatt = (pts, zu = true, k = 1) => {
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  const n = pts.length, q = (i) => pts[zu ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = q(i - 1), p1 = q(i), p2 = q(i + 1), p3 = q(i + 2);
    d += ` C${r(p1[0] + (p2[0] - p0[0]) / 6 * k)} ${r(p1[1] + (p2[1] - p0[1]) / 6 * k)} ${r(p2[0] - (p3[0] - p1[0]) / 6 * k)} ${r(p2[1] - (p3[1] - p1[1]) / 6 * k)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d + (zu ? " Z" : "");
};
const profilY = (pts, x) => { for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; if (x >= Math.min(x0, x1) && x <= Math.max(x0, x1)) return y0 + (y1 - y0) * (x - x0) / (x1 - x0 || 1); } return x < pts[0][0] ? pts[0][1] : pts[pts.length - 1][1]; };
const kappeRand = (svg, x0 = -0.5, x1 = 400.5, y1 = 260.5, y0 = -0.5) => svg.replace(/ d="([MLCQSZ\d\s.,-]+)"/g, (m0, d) => {
  let i = 0; return ` d="${d.replace(/-?\d*\.?\d+/g, (z) => { const v = +z, o = i++ % 2 ? Math.max(y0, Math.min(y1, v)) : Math.max(x0, Math.min(x1, v)); return String(r(o)); })}"`;
});

/* ---------- Kamera (Welt in Metern → Bild) ---------------------------- */
const V = [0, 10, 1.6], AZ = 95 * Math.PI / 180;
const FW = [Math.sin(AZ), Math.cos(AZ)], RE = [Math.sin(AZ + Math.PI / 2), Math.cos(AZ + Math.PI / 2)];
const tiefe = (E, N) => (E - V[0]) * FW[0] + (N - V[1]) * FW[1];
const W = (E, N, U) => { const dx = E - V[0], dy = N - V[1], d = dx * FW[0] + dy * FW[1], s = dx * RE[0] + dy * RE[1]; return [CX + F * s / d, HOR - F * (U - V[2]) / d]; };
const UNTEN = -52;     /* Fluss unterhalb der Fälle */
/* Kante der Hufeisenfälle (Ost, Nord) von Table Rock bis Terrapin Point, als glatte Kurve abgetastet */
const KANTE0 = [[0, 0], [40, -50], [90, -110], [145, -158], [200, -185], [265, -200], [330, -200], [390, -182], [440, -150], [480, -108], [510, -60], [532, -14], [545, 30]];
const KANTE = [];
for (let i = 0; i < KANTE0.length - 1; i++) for (let t = 0; t < 1; t += 0.25) { const a = KANTE0[i], b = KANTE0[i + 1]; KANTE.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
KANTE.push(KANTE0[KANTE0.length - 1]);
/* US-Ufer: Felswand von Goat Island (von Terrapin Point nach Norden) bis Luna Island, dann die Amerikanischen Fälle */
const USUFER = [[545, 30], [575, 110], [610, 190], [650, 270], [690, 340], [705, 380]];
const LUNA = [[705, 380], [712, 400]];
const AMFALL = [[712, 400], [722, 450], [735, 510], [748, 570], [760, 630], [770, 700]];

/* Figuren aus B.mensch schlank machen (für die winzigen Fahrgäste nicht nötig; hier nur eigene Formen) */

/* ---------- Filter und Stoffe ---------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="2.4"/></filter>`);
S.def(`<filter id="${S.id("weich")}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".9"/></filter>`);
S.def(`<filter id="${S.id("hauch")}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".35"/></filter>`);
const volumen = (name, licht, schat, dx = 0.35, a1 = 0.75, a2 = 0.35) => {
  /* Sonne hinten rechts: Lichtkante innen rechts, Eigenschatten innen links */
  S.def(`<filter id="${S.id(name)}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feOffset in="SourceAlpha" dx="${-dx}" dy="${dx * 0.3}" result="v"/><feComposite in="SourceAlpha" in2="v" operator="out" result="kante"/><feFlood flood-color="${licht}" flood-opacity="${a1}"/><feComposite in2="kante" operator="in" result="l"/><feOffset in="SourceAlpha" dx="${dx * 1.6}" dy="${-dx * 0.5}" result="w"/><feComposite in="SourceAlpha" in2="w" operator="out" result="kante2"/><feFlood flood-color="${schat}" flood-opacity="${a2}"/><feComposite in2="kante2" operator="in" result="s"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="s"/><feMergeNode in="l"/></feMerge></filter>`);
  return `url(#${S.id(name)})`;
};
const VOL = volumen("vol", "#ffe2b0", "#1b2433", 0.6, 0.8, 0.35);
const VOL_KLEIN = volumen("volklein", "#ffe6bb", "#1b2433", 0.25, 0.8, 0.3);
/* Herbstlaub als unregelmäßige Kachel (Kronen mit Lichtseite rechts) */
const kronen = (w, h, n, seed, rmin, rmax, farben) => {
  const z = zufall(seed); let o = "";
  for (let i = 0; i < n; i++) {
    const x = z() * w, y = z() * h, rr = rmin + z() * (rmax - rmin), c = farben[Math.floor(z() * farben.length)];
    for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) {
      const cx = x + dx, cy = y + dy; if (cx < -rr || cx > w + rr || cy < -rr || cy > h + rr) continue;
      o += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(rr)}" fill="${c}"/><circle cx="${r(cx + rr * 0.3)}" cy="${r(cy - rr * 0.3)}" r="${r(rr * 0.45)}" fill="#ffe1a8" opacity=".18"/>`;
    }
  }
  return o;
};
S.def(`<pattern id="${S.id("laub")}" width="14" height="6" patternUnits="userSpaceOnUse"><rect width="14" height="6" fill="#6e4a26"/>${kronen(14, 6, 30, 5, 0.45, 0.9, ["#a83c1c", "#c86a28", "#d49a3a", "#7c7a30", "#943018", "#5f6e30"])}</pattern>`);
const LAUB = `url(#${S.id("laub")})`;

/* =====================================================================
   KULISSE — Nachmittagshimmel, ferner Horizont, Fluss oberhalb der Fälle
   ===================================================================== */
S.hinten(`<rect width="400" height="160" fill="${S.lg("himmel", [[0, "#3f7cc2"], [0.45, "#7fb0dc"], [0.8, "#cfdde6"], [1, "#efe4cf"]])}"/>`);
S.hinten(`<ellipse cx="420" cy="140" rx="230" ry="70" fill="${S.rg("abendschein", [[0, "#ffe2b8", 0.55], [1, "#ffe2b8", 0]])}"/>`);
/* flaches Land am Horizont (Ontario und New York): dunstiger Waldsaum */
{
  let h = `<path d="M-1 110.4 Q40 109.2 80 110 Q120 109.4 160 110.2 Q220 109.6 280 110.4 Q340 109.8 401 110.6 L401 113 L-1 113 Z" fill="#9fb0b6"/>`;
  /* Fluss oberhalb der Fälle: glänzendes Band mit Stromschnellen */
  h += `<path d="M170 112.3 L401 112.1 L401 113.6 L170 113.6 Z" fill="${S.lg("oberfluss", [[0, "#cfe0e2"], [1, "#a9c7c8"]])}"/>`;
  for (let i = 0; i < 14; i++) { const x = 180 + i * 16 + rnd() * 8; h += `<path d="M${r(x)} ${r(112.6 + rnd() * 0.6)} h${r(4 + rnd() * 6)}" stroke="#fff" stroke-width=".35" opacity=".8"/>`; }
  S.hinten(h);
}

/* =====================================================================
   1 — DIE WOLKE
   ===================================================================== */
const wolke = (name, cx, by, W0, H, seed) => {
  const z = zufall(seed), kr = [];
  const n = Math.round(W0 / (H * 0.42));
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = cx - W0 / 2 + W0 * t, prof = Math.max(0.18, 1 - Math.pow(2 * t - 1, 2) * 0.82);
    const rr = H * (0.2 + 0.26 * prof) * (0.75 + z() * 0.5);
    kr.push([x, by - rr * 0.6 - H * 0.3 * prof * z(), rr]);
  }
  for (let i = 0; i < 3; i++) { const t = 0.3 + z() * 0.4; kr.push([cx - W0 / 2 + W0 * t, by - H * (0.55 + z() * 0.25), H * (0.32 + z() * 0.14)]); }
  const top = Math.min(...kr.map(([, y, rr]) => y - rr));
  S.def(`<clipPath id="${S.id(name)}"><rect x="${r(cx - W0)}" y="${r(top - 5)}" width="${r(2 * W0)}" height="${r(by - top + 5)}"/></clipPath>`);
  const g = S.lg(name + "g", [[0, "#fffaf2"], [0.5, "#f0e8de"], [1, "#b8bccb"]], 0, r(top), 0, r(by), ' gradientUnits="userSpaceOnUse"');
  const c = (dx, dy, f) => kr.map(([x, y, rr]) => `<circle cx="${r(x + dx)}" cy="${r(y + dy)}" r="${r(rr * f)}"/>`).join("");
  return `<g clip-path="url(#${S.id(name)})"><g fill="${g}">${c(0, 0, 1)}</g><g fill="#fff6e6" opacity=".7">${c(H * 0.1, -H * 0.06, 0.78)}</g><g fill="#fffdf6" opacity=".85">${c(H * 0.16, -H * 0.1, 0.46)}</g></g>`;
};
{
  let k = wolke("w1", 196, 40, 56, 20, 3) + wolke("w2", 86, 70, 40, 13, 7) + wolke("w3", 300, 22, 34, 11, 11);
  S.teil({ id: "wolke", de: "die Wolke", syl: "WOL-ke", it: "la nuvola", itSyl: "NU-vo-la", en: "cloud", x: 196, y: 30, kunst: um(196, 30, k) });
}

/* =====================================================================
   1b — DER FLUSS (unterhalb der Fälle, in der Schlucht)
   ===================================================================== */
{
  let k = `<path d="M-1 126 L401 126 L401 202 L-1 202 Z" fill="${S.lg("fluss", [[0, "#6f9c98"], [0.25, "#3f8079"], [0.65, "#2d6a64"], [1, "#245a56"]])}"/>`;
  k += `<path d="M-1 126 L401 126 L401 140 L-1 140 Z" fill="${S.lg("flussglanz", [[0, "#e9eef0", 0.45], [1, "#e9eef0", 0]])}"/>`;
  /* Schaum: weiche, breite Bahnen vom Becken nach links (weichgezeichnet), darüber wenige klare Linien */
  const zf = zufall(61); let weich = "", klar = "";
  for (let i = 0; i < 16; i++) {
    const y = 140 + Math.pow(zf(), 0.9) * 50, x0 = 400 - zf() * 90, l = 60 + zf() * 160 * (y - 126) / 66, b = 0.8 + (y - 126) * 0.05;
    weich += `<path d="M${r(x0)} ${r(y)} Q${r(x0 - l * 0.5)} ${r(y - b * 1.5)} ${r(x0 - l)} ${r(y + b * 0.4)} Q${r(x0 - l * 0.5)} ${r(y + b * 0.6)} ${r(x0)} ${r(y + b * 1.6)} Z" fill="#e6f1ec" opacity="${r(0.18 + zf() * 0.2)}"/>`;
    if (i % 3 === 0) klar += `M${r(x0 - 4)} ${r(y + b * 0.5)} Q${r(x0 - l * 0.45)} ${r(y - b)} ${r(x0 - l * 0.8)} ${r(y + b * 0.3)}`;
  }
  k += `<g filter="url(#${S.id("weich")})">${weich}</g><path d="${klar}" stroke="#f4faf6" stroke-width=".4" fill="none" opacity=".55" stroke-linecap="round"/>`;
  /* weißes Wasser direkt unter den Fällen */
  k += `<g filter="url(#${S.id("dunst")})"><path d="M230 150 Q300 144 401 146 L401 168 Q320 170 240 162 Z" fill="#f2f6f4" opacity=".85"/></g>`;
  for (const [x, y, rr] of [[120, 176, 8], [40, 170, 6], [200, 182, 9]]) k += `<path d="M${x - rr} ${y} a${rr} ${r(rr * 0.22)} 0 1 1 ${r(rr * 1.6)} ${r(-rr * 0.06)} a${r(rr * 0.6)} ${r(rr * 0.14)} 0 1 1 ${r(-rr * 1.1)} ${r(-rr * 0.05)}" stroke="#cfe3dd" stroke-width=".5" fill="none" opacity=".45"/>`;
  S.teil({ id: "fluss", de: "der Fluss", syl: "FLUSS", it: "il fiume", itSyl: "FIU-me", en: "river", x: 120, y: 170, kunst: um(120, 170, k),
    tipp: "Der Niagara verbindet den Eriesee mit dem Ontariosee. Unterhalb der Fälle ist er bis zu 50 Meter tief." });
}

/* =====================================================================
   2 — DIE INSEL (Goat Island) mit Herbstwald — 3 — DIE FELSWAND
   ===================================================================== */
{
  /* Waldsaum auf Goat Island: von Luna Island bis Terrapin Point, Bäume ≈ 18–24 m */
  const fuss = USUFER.slice().reverse().map(([E, N]) => W(E, N, 2));          /* Oberkante der Felswand */
  const krone = [];
  const zz = zufall(21);
  for (let i = 0; i <= 40; i++) {
    const t = i / 40, a = USUFER[USUFER.length - 1], b = USUFER[0];
    const j = Math.min(USUFER.length - 2, Math.floor((1 - t) * (USUFER.length - 1))), tt = (1 - t) * (USUFER.length - 1) - j;
    const E = USUFER[j][0] + (USUFER[j + 1][0] - USUFER[j][0]) * tt + 40, N = USUFER[j][1] + (USUFER[j + 1][1] - USUFER[j][1]) * tt;
    krone.push(W(E, N, 16 + zz() * 9));
  }
  krone.sort((p, q) => p[0] - q[0]);
  const fussS = fuss.slice().sort((p, q) => p[0] - q[0]);
  let k = `<path d="${glatt([...krone, [fussS[fussS.length - 1][0], fussS[fussS.length - 1][1]], ...fussS.slice().reverse()], true, 0.6)}" fill="${LAUB}"/>`;
  /* einzelne Kronen oben als Bögen (Silhouette), Lichtseite rechts */
  /* Silhouette: viele kleine, unregelmäßige Kronen, rechts vom Licht gestreift */
  for (let i = 0; i < krone.length; i++) { const [x, y] = krone[i]; for (let j = 0; j < 2; j++) { const rr = 0.9 + zz() * 1.1, xx = x + (zz() - 0.5) * 2, yy = y + rr * 0.7 + zz(); const c = ["#b8461f", "#d27a2c", "#ddab45", "#8c8a3a", "#a53a1c", "#6f7c36"][Math.floor(zz() * 6)]; k += `<ellipse cx="${r(xx)}" cy="${r(yy)}" rx="${r(rr)}" ry="${r(rr * 0.85)}" fill="${c}"/><path d="M${r(xx + rr * 0.1)} ${r(yy - rr * 0.8)} a${r(rr)} ${r(rr * 0.85)} 0 0 1 ${r(rr * 0.85)} ${r(rr * 0.9)}" stroke="#ffd9a0" stroke-width=".3" fill="none" opacity=".55"/>`; } }
  k += `<path d="${glatt([...krone, [fussS[fussS.length - 1][0], fussS[fussS.length - 1][1]], ...fussS.slice().reverse()], true, 0.6)}" fill="${S.lg("inseldunst", [[0, "#e8e0d2", 0.35], [1, "#e8e0d2", 0.05]])}"/>`;
  S.teil({ id: "insel", de: "die Insel", syl: "IN-sel", it: "l'isola", itSyl: "I-so-la", en: "island", x: 120, y: 108, kunst: um(120, 108, kappeRand(k)),
    tipp: "Goat Island (Ziegeninsel) gehört zu den USA. Sie trennt die Hufeisenfälle von den Amerikanischen Fällen." });
}
{
  /* Felswand von Goat Island zur Schlucht: oben die harte Dolomitbank (hell, steht über), darunter weichere,
     dunklere Schichten, unten die Schutthalde mit Büschen. Nachmittagslicht von rechts hinten. */
  const lin = (u, dE = 0) => USUFER.map(([E, N]) => W(E + dE, N, u));
  const oben = lin(2), unten = lin(UNTEN + 12);
  let k = `<path d="${P([...oben, ...unten.slice().reverse()])}" fill="${S.lg("felswand", [[0, "#cdb795"], [0.3, "#a99173"], [0.6, "#8a7764"], [1, "#776757"]])}"/>`;
  /* Dolomitbank oben: hell, mit Überhang-Schatten darunter */
  k += `<path d="${P([...lin(2), ...lin(-7).reverse()])}" fill="${S.lg("dolomit", [[0, "#efe1c4"], [1, "#d3c09c"]])}"/>`;
  k += `<path d="${P([...lin(-7), ...lin(-9.5).reverse()])}" fill="#5e4f40" opacity=".55"/>`;
  /* Blöcke und Klüfte: unregelmäßige Kanten, nicht gleichmäßig */
  const zk = zufall(33);
  let kl = "";
  for (let i = 0; i < 34; i++) {
    const t = zk(), j = Math.min(USUFER.length - 2, Math.floor(t * (USUFER.length - 1))), tt = t * (USUFER.length - 1) - j;
    const E = USUFER[j][0] + (USUFER[j + 1][0] - USUFER[j][0]) * tt, N = USUFER[j][1] + (USUFER[j + 1][1] - USUFER[j][1]) * tt;
    const u0 = i % 2 ? 1.5 : -10 - zk() * 8, u1 = u0 - 4 - zk() * 9;
    const [x0, y0] = W(E, N, u0), [, y1] = W(E, N, u1);
    kl += `M${r(x0)} ${r(y0)} l${r((zk() - 0.5) * 0.5)} ${r((y1 - y0) * 0.5)} l${r((zk() - 0.5) * 0.5)} ${r((y1 - y0) * 0.5)}`;
  }
  k += `<path d="${kl}" stroke="#4e4236" stroke-width=".3" opacity=".7" fill="none"/>`;
  for (const [u, c, w, o] of [[-14, "#6e5f50", 0.4, 0.6], [-21, "#9a8774", 0.3, 0.6], [-28, "#5f5244", 0.35, 0.5]]) k += `<path d="${P(lin(u), false)}" stroke="${c}" stroke-width="${w}" fill="none" opacity="${o}"/>`;
  /* Feuchte, dunkle Streifen (Sickerwasser) und Moos */
  for (let i = 0; i < 10; i++) { const t = zk(), j = Math.min(USUFER.length - 2, Math.floor(t * (USUFER.length - 1))), tt = t * (USUFER.length - 1) - j; const E = USUFER[j][0] + (USUFER[j + 1][0] - USUFER[j][0]) * tt, N = USUFER[j][1] + (USUFER[j + 1][1] - USUFER[j][1]) * tt; const [x0, y0] = W(E, N, -9), [, y1] = W(E, N, -32); k += `<path d="M${r(x0 - 0.5)} ${r(y0)} L${r(x0 + 0.5)} ${r(y0)} L${r(x0 + 0.3)} ${r(y1)} L${r(x0 - 0.3)} ${r(y1)} Z" fill="#3f3a33" opacity=".35"/>`; }
  /* Schutthalde (Talus) am Fuß, mit Büschen in Herbstfarben */
  const talus = USUFER.map(([E, N]) => W(E - 20, N + 4, UNTEN + 0.5)), talusO = lin(UNTEN + 16);
  k += `<path d="${P([...talusO, ...talus.slice().reverse()])}" fill="${S.lg("talus", [[0, "#a59a88"], [1, "#7a7064"]])}"/>`;
  for (let i = 0; i < 36; i++) { const t = zk(), [x, y] = talus[0].map((v, q) => v + (talus[talus.length - 1][q] - v) * t); k += `<ellipse cx="${r(x)}" cy="${r(y - 0.8 - zk() * 2.4)}" rx="${r(0.5 + zk() * 0.9)}" ry="${r(0.35 + zk() * 0.35)}" fill="${["#7b8a3e", "#b8862e", "#a9a091", "#c06a2a", "#8f8778"][i % 5]}"/>`; }
  S.teil({ id: "felswand", de: "die Felswand", syl: "FELS-wand", it: "la parete rocciosa", itSyl: "pa-RE-te roc-CIO-sa", en: "cliff", x: 140, y: 124, kunst: um(140, 124, kappeRand(k)),
    tipp: "Das Wasser spült den weichen Stein unter der harten Kalkschicht aus. So wandern die Fälle langsam flussaufwärts." });
}

/* =====================================================================
   4 — DIE AMERIKANISCHEN FÄLLE (am linken Rand, mit Lupe: Brautschleier, Felsen)
   ===================================================================== */
const AM = {};
{
  const kr = AMFALL.map(([E, N]) => W(E, N, 3)), fu = AMFALL.map(([E, N]) => W(E - 6, N, -20)), fl = AMFALL.map(([E, N]) => W(E - 40, N - 6, UNTEN + 1));
  /* Ufer der USA dahinter: Bäume und ein paar Dächer */
  let k = `<path d="${P([...AMFALL.map(([E, N]) => W(E + 30, N, 22)), ...kr.slice().reverse()])}" fill="${LAUB}"/>`;
  /* Felsbrocken (Talus) am Fuß: große graue Blöcke, Wasser schäumt darüber */
  k += `<path d="${P([...fu, ...fl.slice().reverse()])}" fill="${S.lg("amtalus", [[0, "#8a8479"], [1, "#5f5a52"]])}"/>`;
  const zt = zufall(41);
  for (let i = 0; i < 30; i++) { const t = zt(), [x, y] = fu[0].map((v, q) => v + (fu[fu.length - 1][q] - v) * t); const yy = y + zt() * 8; k += `<path d="M${r(x - 1.4)} ${r(yy + 0.8)} l${r(0.4)} ${r(-1.4)} l${r(1.6)} ${r(-0.3)} l${r(0.7)} ${r(1.5)} Z" fill="${zt() < 0.5 ? "#b2aa9c" : "#7d766b"}"/>`; }
  /* Wasser über die Brocken: weiße Schleier */
  for (let i = 0; i < 16; i++) { const t = zt(), [x, y] = fu[0].map((v, q) => v + (fu[fu.length - 1][q] - v) * t); k += `<path d="M${r(x)} ${r(y)} q${r(-0.6)} ${r(4)} ${r(-0.2)} ${r(8 + zt() * 3)}" stroke="#f6f4ee" stroke-width="${r(0.6 + zt() * 0.8)}" fill="none" opacity=".75"/>`; }
  /* Fallendes Wasser (Westseite, im Nachmittagslicht) */
  k += `<path d="${P([...kr, ...fu.slice().reverse()])}" fill="${S.lg("amwasser", [[0, "#fffaf0"], [0.6, "#f4efe6"], [1, "#dfe3e4"]])}"/>`;
  let st = "";
  for (let i = 0; i < 40; i++) { const t = i / 40 + zt() * 0.02, [x, y] = kr[0].map((v, q) => v + (kr[kr.length - 1][q] - v) * t), [, y2] = fu[0].map((v, q) => v + (fu[fu.length - 1][q] - v) * t); st += `M${r(x)} ${r(y + 0.4)} L${r(x - 0.2)} ${r(y2)}`; }
  k += `<path d="${st}" stroke="#c9d3d6" stroke-width=".22" opacity=".8"/>`;
  k += `<path d="${P(kr, false)}" stroke="#7fae9e" stroke-width=".5" fill="none"/>`;
  /* Gischt am Fuß */
  k += `<g filter="url(#${S.id("weich")})">${fl.map(([x, y], i) => `<ellipse cx="${r(x + 2)}" cy="${r(y - 2.5)}" rx="${r(4 + (i % 2) * 2)}" ry="1.8" fill="#fff" opacity=".7"/>`).join("")}</g>`;
  /* Luna Island (Bäume) und der Brautschleier rechts daneben */
  const [lx, ly] = W(708, 390, 3);
  k += `<path d="M${r(lx - 4)} ${r(ly + 0.4)} Q${r(lx - 3)} ${r(ly - 5)} ${r(lx)} ${r(ly - 5.4)} Q${r(lx + 3)} ${r(ly - 5)} ${r(lx + 3.6)} ${r(ly + 0.4)} Z" fill="#c8572a"/><path d="M${r(lx - 1)} ${r(ly - 4.6)} q2 -.8 3.6 .6" stroke="#ffd79a" stroke-width=".5" fill="none" opacity=".7"/>`;
  const bv = [W(700, 370, 3), W(704, 382, 3)], bvU = [W(696, 370, -24), W(700, 382, -24)];
  k += `<path d="${P([bv[0], bv[1], bvU[1], bvU[0]])}" fill="${S.lg("brautschleier", [[0, "#fffaf0"], [1, "#e6ebea"]])}"/>`;
  /* Stege der Cave of the Winds am Fuß des Brautschleiers mit Besuchern in gelben Capes */
  const [sx, sy] = W(686, 372, -30);
  k += `<path d="M${r(sx - 6)} ${r(sy)} h8 v.6 h-8 Z M${r(sx - 3)} ${r(sy - 2.4)} h6 v.5 h-6 Z" fill="#9a7a4a"/>`;
  for (let i = 0; i < 5; i++) k += `<path d="M${r(sx - 5.4 + i * 1.6)} ${r(sy - 0.1)} l.35 -1.2 l.35 1.2 Z" fill="#f2d02c"/>`;
  AM.brautschleier = [(bv[0][0] + bv[1][0]) / 2, (bv[0][1] + bvU[0][1]) / 2];
  AM.felsen = fu[2];
  const unter = [
    { id: "brautschleier", de: "der Brautschleier", syl: "BRAUT-schlei-er", it: "il Velo della Sposa", itSyl: "VE-lo del-la SPO-sa", en: "Bridal Veil Falls", x: AM.brautschleier[0], y: AM.brautschleier[1], kunst: flaeche(-3, -6, 6, 12),
      tipp: "Der schmale Wasserfall heißt Brautschleier. Am Fuß gehen Besucher in gelben Capes auf Holzstegen." },
    { id: "felsen", de: "die Felsen", syl: "FEL-sen", it: "le rocce", itSyl: "ROC-ce", en: "rocks", x: AM.felsen[0], y: AM.felsen[1] + 4, kunst: flaeche(-12, -4, 24, 8),
      tipp: "Am Fuß der Amerikanischen Fälle liegen riesige Felsbrocken. Sie sind 1954 abgebrochen." },
  ];
  S.teil({ id: "amerikanische_faelle", de: "die Amerikanischen Fälle", syl: "a-me-ri-KA-ni-schen FÄL-le", it: "le Cascate Americane", itSyl: "ca-SCA-te a-me-ri-CA-ne", en: "American Falls", x: 22, y: 118, kunst: um(22, 118, kappeRand(k)),
    zoom: { x: 0, y: 96, w: 66, h: 44 }, unter,
    tipp: "Die Amerikanischen Fälle liegen in den USA. Das Wasser fällt 21 bis 30 Meter tief auf große Felsbrocken." });
}

/* =====================================================================
   5 — DIE HUFEISENFÄLLE (mit Lupe: die Kante, der Aussichtspunkt)
   ===================================================================== */
const HU = {};
{
  const SONNE = [Math.sin(255 * Math.PI / 180), Math.cos(255 * Math.PI / 180)];
  const seg = [];
  for (let i = 0; i < KANTE.length - 1; i++) {
    const a = KANTE[i], b = KANTE[i + 1];
    if (tiefe((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) < 30) continue;
    const dE = b[0] - a[0], dN = b[1] - a[1], l = Math.hypot(dE, dN), n = [-dN / l, dE / l];
    const licht = Math.max(0, n[0] * SONNE[0] + n[1] * SONNE[1]);
    const pA = W(a[0], a[1], 0.6), pB = W(b[0], b[1], 0.6), uA = W(a[0] + n[0] * 6, a[1] + n[1] * 6, UNTEN + 8), uB = W(b[0] + n[0] * 6, b[1] + n[1] * 6, UNTEN + 8);
    seg.push({ i, a, b, pA, pB, uA, uB, licht, d: tiefe((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) });
  }
  let k = "";
  /* von hinten nach vorn: zuerst die fernen Abschnitte (Terrapin), zuletzt die nahen rechts */
  seg.sort((p, q) => q.d - p.d);
  for (const sg of seg) {
    const L = sg.licht, oben = L > 0.3 ? "#fff8ec" : "#eef2f2", unten = L > 0.3 ? "#e9eef0" : "#bfcdd4";
    const id = "wv" + sg.i;
    S.def(`<linearGradient id="${S.id(id)}" gradientUnits="userSpaceOnUse" x1="0" y1="${r(sg.pA[1])}" x2="0" y2="${r(sg.uA[1])}"><stop offset="0" stop-color="${oben}"/><stop offset=".55" stop-color="${L > 0.3 ? "#f6f3ec" : "#dbe3e6"}"/><stop offset="1" stop-color="${unten}"/></linearGradient>`);
    k += `<path d="${P([sg.pA, sg.pB, [sg.uB[0], sg.uB[1]], [sg.uA[0], sg.uA[1]]])}" fill="url(#${S.id(id)})" stroke="url(#${S.id(id)})" stroke-width=".3"/>`;
    /* senkrechte Wasserfäden */
    const n = Math.max(2, Math.round(Math.abs(sg.pB[0] - sg.pA[0]) / 1.4));
    let st = "";
    for (let j = 0; j < n; j++) { const t = (j + 0.5) / n, x = sg.pA[0] + (sg.pB[0] - sg.pA[0]) * t, y = sg.pA[1] + (sg.pB[1] - sg.pA[1]) * t, x2 = sg.uA[0] + (sg.uB[0] - sg.uA[0]) * t, y2 = sg.uA[1] + (sg.uB[1] - sg.uA[1]) * t; st += `M${r(x)} ${r(y + 0.6)} L${r(x2)} ${r(y2)}`; }
    k += `<path d="${st}" stroke="${L > 0.3 ? "#c8d4d4" : "#9fb2bb"}" stroke-width=".25" opacity=".7"/>`;
  }
  /* grüne Kante: wo das Wasser tief ist (Mitte des Hufeisens), leuchtet sie grün */
  const kante = KANTE.filter(([E, N]) => tiefe(E, N) > 30).map(([E, N]) => W(E, N, 0.6));
  const kante2 = KANTE.filter(([E, N]) => tiefe(E, N) > 30).map(([E, N]) => W(E, N, -5));
  k += `<path d="${P([...kante, ...kante2.slice().reverse()])}" fill="${S.lg("gruenkante", [[0, "#cfe6dc"], [0.35, "#4f9a82"], [0.65, "#3f8a74"], [1, "#d6ebe2"]], 0, 0, 1, 0)}" opacity=".85"/>`;
  k += `<path d="${P(kante, false)}" stroke="#f4fbf6" stroke-width=".5" fill="none"/>`;
  /* Terrapin Point: Aussichtsplattform mit Geländer und Besuchern (USA) */
  const [tx, ty] = W(552, 32, 2);
  k += `<path d="M${r(tx - 5)} ${r(ty + 0.4)} h10 l-.6 -1 h-8.8 Z" fill="#b9b2a4"/><path d="M${r(tx - 5)} ${r(ty - 0.8)} h10" stroke="#3a3a3a" stroke-width=".18"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${r(tx - 4 + i * 1.5)} ${r(ty - 0.1)} v-1.3" stroke="${["#2f5f95", "#c0392b", "#f2f2f0", "#e0a020", "#3a3a3a", "#7a3a8a"][i]}" stroke-width=".5"/><circle cx="${r(tx - 4 + i * 1.5)}" cy="${r(ty - 1.6)}" r=".28" fill="#d9a77c"/>`;
  HU.terrapin = [tx, ty - 1];
  const ap = W(330, -200, 0);
  HU.kante = [ap[0], ap[1] + 1.4];
  const unter = [
    { id: "kante", de: "die Kante", syl: "KAN-te", it: "il bordo", itSyl: "BOR-do", en: "brink", x: HU.kante[0], y: HU.kante[1], kunst: flaeche(-14, -2.4, 28, 4.8),
      tipp: "In der Mitte ist das Wasser an der Kante etwa zwei Meter tief – deshalb sieht es dort grün aus." },
    { id: "aussichtspunkt", de: "der Aussichtspunkt", syl: "AUS-sichts-punkt", it: "il belvedere", itSyl: "bel-ve-DE-re", en: "viewpoint", x: HU.terrapin[0], y: HU.terrapin[1], kunst: flaeche(-6, -3, 12, 5),
      tipp: "Gegenüber liegt Terrapin Point in den USA. Von dort sehen die Besucher die Fälle von der anderen Seite." },
  ];
  S.teil({ id: "hufeisenfaelle", de: "die Hufeisenfälle", syl: "HUF-ei-sen-fäl-le", it: "le Cascate a Ferro di Cavallo", itSyl: "ca-SCA-te a FER-ro di ca-VAL-lo", en: "Horseshoe Falls", x: 300, y: 130, kunst: um(300, 130, kappeRand(k)),
    zoom: { x: 190, y: 98, w: 120, h: 80 }, unter,
    tipp: "Die Hufeisenfälle sind 51 Meter hoch. In jeder Sekunde stürzen hier bis zu 2800 Kubikmeter Wasser hinab." });
}

/* =====================================================================
   6 — DIE GISCHT (Wolke aus Wassertröpfchen über dem Becken)
   ===================================================================== */
const GISCHT = [];
{
  const zg = zufall(71);
  /* Ballen: breit über dem Becken, nach oben lockerer und vom Wind nach links (flussabwärts) über die Schlucht getrieben */
  const quellen = [[400, 138, 22], [374, 142, 22], [348, 146, 21], [322, 146, 19], [298, 148, 16], [274, 150, 13]];
  for (const [x, y, rr] of quellen) GISCHT.push([x, y, rr]);
  /* aufsteigende Säule über dem Becken */
  for (let i = 0; i < 12; i++) { const t = i / 11, x = 352 - t * 40 + (zg() - 0.5) * 34, y = 128 - t * 96 + (zg() - 0.5) * 10, rr = 12 + (1 - t) * 10 + zg() * 7; GISCHT.push([x, y, rr]); }
  /* vom Wind nach links über die Schlucht getriebene Schwaden */
  for (let i = 0; i < 10; i++) { const t = i / 9, x = 300 - t * 110 + (zg() - 0.5) * 16, y = 104 + t * 34 + (zg() - 0.5) * 16, rr = 10 + zg() * 7 - t * 3; GISCHT.push([x, y, rr]); }
  const c = (dx, dy, f, sub = 1) => GISCHT.filter((_, i) => i % sub === 0).map(([x, y, rr]) => `<circle cx="${r(x + dx)}" cy="${r(y + dy)}" r="${r(rr * f)}"/>`).join("");
  let k = `<g filter="url(#${S.id("dunst")})">`;
  k += `<g fill="${S.lg("gischt", [[0, "#dfe6ee"], [0.6, "#cdd8e2"], [1, "#e3e9ee"]], 0, 0, 1, 0)}" opacity=".72">${c(0, 0, 1)}</g>`;
  k += `<g fill="#fff8ec" opacity=".7">${c(4, -3, 0.7)}</g>`;
  k += `<g fill="#ffffff" opacity=".75">${c(7, -5, 0.4, 2)}</g>`;
  k += `</g>`;
  /* untere, dichte Gischt über dem Becken (verdeckt den Fuß der Fälle) */
  k += `<g filter="url(#${S.id("weich")})"><path d="M236 150 Q270 138 310 142 Q350 136 402 140 L402 158 Q350 164 300 160 Q262 162 236 158 Z" fill="#f4f6f6" opacity=".95"/></g>`;
  S.teil({ id: "gischt", de: "die Gischt", syl: "GISCHT", it: "la nebulizzazione", itSyl: "ne-bu-liz-za-ZIO-ne", en: "spray", x: 320, y: 90, kunst: um(320, 90, kappeRand(k)),
    tipp: "Die Gischt steigt oft über 100 Meter hoch. Man sieht sie schon von Weitem – und man wird nass!" });
}

/* =====================================================================
   7 — DER REGENBOGEN (Sonne im Rücken: Gegenpunkt 75° Azimut, 9° unter dem Horizont)
   ===================================================================== */
{
  const rad = Math.PI / 180, A = [Math.sin(75 * rad) * Math.cos(9 * rad), Math.cos(75 * rad) * Math.cos(9 * rad), -Math.sin(9 * rad)];
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
  const u1 = norm(kreuz(A, [0, 0, 1])), u2 = kreuz(u1, A);
  const bild = (D) => { const d = D[0] * FW[0] + D[1] * FW[1], s = D[0] * RE[0] + D[1] * RE[1]; return [CX + F * s / d, HOR - F * D[2] / d]; };
  const bogen = (grad) => { const o = []; for (let ph = 0; ph <= 360; ph += 1.5) { const c = Math.cos(grad * rad), sn = Math.sin(grad * rad), p = ph * rad; const D = A.map((a, i) => c * a + sn * (Math.cos(p) * u1[i] + Math.sin(p) * u2[i])); if (D[0] * FW[0] + D[1] * FW[1] > 0.2) o.push(bild(D)); } return o; };
  const farben = [[42.3, "#e8402a"], [41.9, "#f39a2a"], [41.5, "#f5e04a"], [41.1, "#5cc85a"], [40.7, "#3a8ae0"], [40.3, "#7a50c8"]];
  /* nur im Bereich der Gischt sichtbar: rechts, zwischen y 70 und 182 */
  let k = "";
  S.def(`<linearGradient id="${S.id("rbmaske")}" gradientUnits="userSpaceOnUse" x1="0" y1="66" x2="0" y2="186"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".9"/><stop offset=".75" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="${S.id("rbm")}" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="260"><g filter="url(#${S.id("dunst")})" fill="url(#${S.id("rbmaske")})">${GISCHT.map(([x, y, rr]) => `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rr * 0.9)}"/>`).join("")}<path d="M150 150 Q240 140 330 150 L330 186 L150 186 Z"/></g></mask>`);
  let alle = [];
  for (const [g, c] of farben) {
    const pts = bogen(g).filter(([x, y]) => x > 150 && x < 380 && y > 60 && y < 190).sort((p, q) => p[1] - q[1]);
    if (pts.length < 2) continue;
    alle = alle.concat(pts);
    k += `<path d="${P(pts, false)}" stroke="${c}" stroke-width="1.6" fill="none" opacity=".55"/>`;
  }
  S.teil({ id: "regenbogen", de: "der Regenbogen", syl: "RE-gen-bo-gen", it: "l'arcobaleno", itSyl: "ar-co-ba-LE-no", en: "rainbow", x: 0, y: 0,
    kunst: `<g mask="url(#${S.id("rbm")})" filter="url(#${S.id("hauch")})">${k}</g>`,
    tipp: "Den Regenbogen sieht man nur, wenn die Sonne im Rücken steht. Hier am Table Rock also am Nachmittag und am Abend." });
}

/* =====================================================================
   8 — DAS BOOT (Niagara City Cruises) fährt in die Gischt — Lupe: das Regencape, die Flagge
   ===================================================================== */
const BOOT = {};
{
  /* Wasserlinie bei (E 270, N −40): Abstand ≈ 275 m, 30 m lang, Kurs nach Südosten (ins Hufeisen) */
  const [bx, by] = W(270, -40, UNTEN);
  const m = F / tiefe(270, -40);                   /* Einheiten je Meter ≈ 0,87 */
  const L = 30 * m * 0.82, H1 = 3.2 * m, H2 = 2.6 * m, sch = 0.3;   /* von der Seite, leicht von hinten */
  let k = "";
  /* Kielwasser hinter dem Boot (nach links), Bugwelle */
  k += `<path d="M${r(bx - L * 0.5)} ${r(by + 0.2)} Q${r(bx - L * 1.4)} ${r(by + 3.4)} ${r(bx - L * 2.6)} ${r(by + 6)} L${r(bx - L * 2.6)} ${r(by + 3.4)} Q${r(bx - L * 1.4)} ${r(by + 1.2)} ${r(bx - L * 0.5)} ${r(by - 0.2)} Z" fill="#e8f2ee" opacity=".55"/>`;
  k += `<path d="M${r(bx + L * 0.42)} ${r(by)} q${r(2)} ${r(-0.8)} ${r(4)} ${r(0.6)}" stroke="#fff" stroke-width=".7" fill="none"/>`;
  /* Rümpfe (Katamaran): weiß mit dunkelblauem Streifen; Heckansicht links */
  const x0 = bx - L / 2, x1 = bx + L / 2;
  k += `<path d="M${r(x0)} ${r(by - H1)} L${r(x1 - 1.4)} ${r(by - H1)} Q${r(x1 + 0.6)} ${r(by - H1 * 0.6)} ${r(x1 - 0.6)} ${r(by)} L${r(x0 + 0.4)} ${r(by)} Z" fill="${S.lg("rumpf", [[0, "#ffffff"], [1, "#d8dde2"]])}"/>`;
  k += `<path d="M${r(x0)} ${r(by - H1 * 0.36)} L${r(x1 - 0.2)} ${r(by - H1 * 0.36)} L${r(x1 - 0.4)} ${r(by - H1 * 0.12)} L${r(x0 + 0.3)} ${r(by - H1 * 0.12)} Z" fill="#1f3a6a"/>`;
  k += `<path d="M${r(x0 - sch * L)} ${r(by - H1 + 0.6)} L${r(x0)} ${r(by - H1)} L${r(x0 + 0.4)} ${r(by)} L${r(x0 - sch * L + 0.4)} ${r(by + 0.6)} Z" fill="#c9d0d8"/>`;
  /* Unterdeck: Fenster, Fahrgäste in roten Capes dicht an der Reling */
  const yD = by - H1, yO = yD - H2;
  k += `<path d="M${r(x0 + 0.6)} ${r(yD)} L${r(x1 - 2)} ${r(yD)} L${r(x1 - 2.6)} ${r(yO)} L${r(x0 + 0.6)} ${r(yO)} Z" fill="#f2f4f6"/>`;
  const zb = zufall(81); let capes = "";
  for (let x = x0 + 1.2; x < x1 - 3; x += 0.9 + zb() * 0.4) capes += `<path d="M${r(x - 0.42)} ${r(yD - 0.2)} L${r(x - 0.3)} ${r(yD - 1.5)} Q${r(x)} ${r(yD - 1.9)} ${r(x + 0.3)} ${r(yD - 1.5)} L${r(x + 0.42)} ${r(yD - 0.2)} Z"/>`;
  k += `<g fill="#d0242c">${capes}</g>`;
  k += `<path d="M${r(x0 + 0.6)} ${r(yD - 0.9)} H${r(x1 - 2.2)}" stroke="#9aa3ab" stroke-width=".25"/>`;
  /* Oberdeck: offen, Reling, noch mehr rote Capes */
  const yT = yO - 2.2;
  capes = "";
  for (let x = x0 + 2; x < x1 - 4.2; x += 0.85 + zb() * 0.4) capes += `<path d="M${r(x - 0.4)} ${r(yO - 0.1)} L${r(x - 0.28)} ${r(yO - 1.5)} Q${r(x)} ${r(yO - 1.9)} ${r(x + 0.28)} ${r(yO - 1.5)} L${r(x + 0.4)} ${r(yO - 0.1)} Z"/>`;
  k += `<g fill="#e0303a">${capes}</g>`;
  k += `<path d="M${r(x0 + 1.4)} ${r(yO - 0.8)} H${r(x1 - 3.6)}" stroke="#fff" stroke-width=".3"/>`;
  /* Steuerhaus vorn oben */
  k += `<path d="M${r(x1 - 9)} ${r(yO)} L${r(x1 - 4.4)} ${r(yO)} L${r(x1 - 5.2)} ${r(yO - 2.6)} L${r(x1 - 9)} ${r(yO - 2.6)} Z" fill="#f6f7f8"/><path d="M${r(x1 - 8.6)} ${r(yO - 2.2)} h3.2 v1 h-3.2 Z" fill="#2c3e50"/>`;
  /* Flagge am Heck: rot-weiß-rot mit Ahornblatt */
  const fx = x0 + 0.6, fy = yO - 4.6;
  k += `<path d="M${r(fx)} ${r(yO)} V${r(fy - 0.2)}" stroke="#555" stroke-width=".25"/>`;
  k += `<path d="M${r(fx)} ${r(fy)} h3.4 v1.8 h-3.4 Z" fill="#fff"/><path d="M${r(fx)} ${r(fy)} h.85 v1.8 h-.85 Z M${r(fx + 2.55)} ${r(fy)} h.85 v1.8 h-.85 Z" fill="#d52b1e"/><circle cx="${r(fx + 1.7)}" cy="${r(fy + 0.9)}" r=".42" fill="#d52b1e"/>`;
  BOOT.cape = [bx - 2, yD - 1]; BOOT.flagge = [fx + 1.7, fy + 0.9];
  const unter = [
    { id: "regencape", de: "das Regencape", syl: "RE-gen-cape", it: "la mantella", itSyl: "man-TEL-la", en: "rain poncho", x: BOOT.cape[0], y: BOOT.cape[1], kunst: flaeche(-9, -4, 18, 6),
      tipp: "Auf den kanadischen Booten bekommen alle ein rotes Regencape, auf den amerikanischen ein blaues." },
    { id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: BOOT.flagge[0], y: BOOT.flagge[1], kunst: flaeche(-2.4, -2.4, 4.8, 4.8),
      tipp: "Die Flagge Kanadas ist rot und weiß. In der Mitte ist ein rotes Ahornblatt." },
  ];
  S.teil({ id: "boot", de: "das Boot", syl: "BOOT", it: "la barca", itSyl: "BAR-ca", en: "boat", x: bx, y: by - 4, kunst: um(bx, by - 4, k),
    zoom: { x: bx - 26, y: by - 22, w: 48, h: 32 }, unter,
    tipp: "Das Boot fährt ganz nah an die Hufeisenfälle heran – mitten in die Gischt." });
}

/* =====================================================================
   9 — DIE MÖWE (Ringschnabelmöwen über der Schlucht)
   ===================================================================== */
{
  const moewe = (x, y, s, fl) => {
    const k = (v) => r(v * s);
    return `<g transform="translate(${r(x)} ${r(y)})"><path d="M${k(-4)} ${k(-0.6 * fl)} Q${k(-2)} ${k(-1.6 * fl)} ${k(-0.4)} 0 Q${k(0)} ${k(0.3)} ${k(0.4)} 0 Q${k(2)} ${k(-1.6 * fl)} ${k(4)} ${k(-0.6 * fl)} Q${k(2.2)} ${k(-0.9 * fl)} ${k(0.6)} ${k(0.5)} Q0 ${k(0.9)} ${k(-0.6)} ${k(0.5)} Q${k(-2.2)} ${k(-0.9 * fl)} ${k(-4)} ${k(-0.6 * fl)} Z" fill="#f7f7f4"/><path d="M${k(-4)} ${k(-0.6 * fl)} l${k(0.9)} ${k(-0.2)} M${k(4)} ${k(-0.6 * fl)} l${k(-0.9)} ${k(-0.2)}" stroke="#2a2a2a" stroke-width="${k(0.35)}"/><path d="M${k(-0.3)} ${k(0.2)} Q0 ${k(1.1)} ${k(0.3)} ${k(0.2)}" fill="#c9ccd0"/><path d="M${k(0.3)} ${k(0.2)} l${k(0.6)} ${k(-0.1)}" stroke="#e8c030" stroke-width="${k(0.25)}"/></g>`;
  };
  let k = moewe(150, 150, 2.2, 1) + moewe(118, 136, 1.2, -0.6) + moewe(182, 132, 0.9, 0.8) + moewe(205, 166, 1.4, -0.4);
  S.teil({ oben: true, id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: 150, y: 150, kunst: um(150, 150, k),
    tipp: "Am Niagara leben viele Möwen. Sie fangen Fische, die mit dem Wasser die Fälle hinabstürzen." });
}

/* =====================================================================
   10 — DIE KANADAGANS (ein Keil zieht nach Süden)
   ===================================================================== */
{
  const gans = (x, y, s, fl) => {
    const k = (v) => r(v * s);
    let o = `<g transform="translate(${r(x)} ${r(y)})">`;
    o += `<path d="M${k(-3.6)} ${k(-1.2 * fl - 0.2)} Q${k(-1.6)} ${k(-0.8 * fl - 0.6)} ${k(-0.2)} ${k(-0.2)} L${k(0.6)} ${k(-0.2)} Q${k(0.4)} ${k(-0.9 * fl)} ${k(2.2)} ${k(-1.6 * fl - 0.3)} Q${k(1.2)} ${k(-0.2 * fl)} ${k(0.9)} ${k(0.4)} L${k(-0.6)} ${k(0.4)} Z" fill="#5a4e44"/>`;
    o += `<path d="M${k(-1.6)} ${k(0)} Q${k(0)} ${k(-0.5)} ${k(1.6)} ${k(-0.1)} Q${k(1.2)} ${k(0.6)} ${k(-1.2)} ${k(0.5)} Q${k(-1.8)} ${k(0.4)} ${k(-1.6)} 0 Z" fill="#8a7a6a"/>`;
    o += `<path d="M${k(-1.6)} ${k(0.3)} Q${k(-1.9)} ${k(0.3)} ${k(-2.2)} ${k(0.5)} L${k(-1.6)} ${k(0.55)} Z" fill="#f2efe8"/>`;
    o += `<path d="M${k(1.5)} ${k(-0.05)} L${k(3.4)} ${k(-0.5)}" stroke="#1b1b1b" stroke-width="${k(0.42)}" stroke-linecap="round"/><path d="M${k(3.1)} ${k(-0.6)} l${k(0.5)} ${k(0.15)}" stroke="#f2efe8" stroke-width="${k(0.3)}"/>`;
    return o + `</g>`;
  };
  let k = "";
  const keil = [[92, 60, 0], [83, 55.6, 1], [101, 55, 1], [74, 51.4, 0], [110, 50.4, 0], [65, 47.4, 1], [119, 46, 1]];
  for (const [x, y, fl] of keil) k += gans(x, y, 1.05, fl ? 1 : -0.6);
  S.teil({ oben: true, id: "kanadagans", de: "die Kanadagans", syl: "KA-na-da-gans", it: "l'oca canadese", itSyl: "O-ca ca-na-DE-se", en: "Canada goose", x: 92, y: 54, kunst: um(92, 54, k),
    tipp: "Im Herbst fliegen die Kanadagänse in einem Keil nach Süden. Dabei rufen sie laut." });
}

/* =====================================================================
   11 — DER AHORN (Zweige oben links, leuchtend rot) und DAS AHORNBLATT
   ===================================================================== */
/* Ahornblatt: fünf Lappen mit Zähnen, Stiel; Größe s (Einheiten), Drehung w */
const blatt = (x, y, s, w, farbe, ader = "#7a1a10") => {
  const pts = [[0, -1], [0.18, -0.62], [0.42, -0.72], [0.36, -0.42], [0.82, -0.5], [0.68, -0.22], [0.98, 0.02], [0.6, 0.12], [0.62, 0.36], [0.3, 0.26], [0.1, 0.5], [0.04, 0.5], [0.04, 0.9], [-0.04, 0.9], [-0.04, 0.5], [-0.1, 0.5], [-0.3, 0.26], [-0.62, 0.36], [-0.6, 0.12], [-0.98, 0.02], [-0.68, -0.22], [-0.82, -0.5], [-0.36, -0.42], [-0.42, -0.72], [-0.18, -0.62]];
  const c = Math.cos(w), sn = Math.sin(w), T = ([a, b]) => [x + (a * c - b * sn) * s, y + (a * sn + b * c) * s];
  let o = `<path d="${P(pts.map(T))}" fill="${farbe}"/>`;
  const [ax, ay] = T([0, 0.5]);
  for (const q of [[0, -0.9], [0.86, -0.4], [-0.86, -0.4], [0.84, 0.06], [-0.84, 0.06]]) { const [bx, by] = T(q); o += `M${r(ax)} ${r(ay)} L${r(bx)} ${r(by)}`; }
  return o.replace(/(M[\d.-]+ [\d.-]+ L[\d.-]+ [\d.-]+)+$/, (m) => `<path d="${m}" stroke="${ader}" stroke-width="${r(s * 0.05)}" opacity=".6"/>`);
};
{
  let k = "";
  /* Äste kommen von links oben (der Baum steht hinter uns links im Park) */
  const aeste = [[[-6, -4], [30, 10], [70, 22], [104, 28]], [[24, 6], [36, 26], [46, 40]], [[56, 18], [74, 38], [84, 46]], [[-6, 30], [18, 34], [40, 52]]];
  for (const a of aeste) k += `<path d="${glatt(a, false)}" stroke="#3a2618" stroke-width="${a === aeste[0] ? 2.2 : 1.1}" fill="none" stroke-linecap="round"/>`;
  const zb = zufall(93);
  const farben = ["#d8301e", "#e8562a", "#f08a2c", "#c8241a", "#f2b23a", "#b81c14"];
  for (const a of aeste) for (let i = 0; i < 14; i++) {
    const t = zb(), j = Math.min(a.length - 2, Math.floor(t * (a.length - 1))), tt = t * (a.length - 1) - j;
    const x = a[j][0] + (a[j + 1][0] - a[j][0]) * tt + (zb() - 0.5) * 12, y = a[j][1] + (a[j + 1][1] - a[j][1]) * tt + (zb() - 0.2) * 9;
    if (x < 3 || y < 2) continue;
    k += blatt(x, y, 4 + zb() * 2.4, zb() * 6.28, farben[Math.floor(zb() * farben.length)]);
  }
  S.teil({ id: "ahorn", de: "der Ahorn", syl: "A-horn", it: "l'acero", itSyl: "A-ce-ro", en: "maple tree", x: 40, y: 24, kunst: um(40, 24, `<g filter="${VOL}">${kappeRand(k)}</g>`),
    tipp: "Im Herbst färbt sich der Zuckerahorn leuchtend rot. Aus seinem Saft kocht man Ahornsirup." });
}

/* =====================================================================
   12 — DIE MAUER (Steinmauer an der Kante, wir schauen auf die Abdeckplatten)
   ===================================================================== */
const KAPPE = 199, FRONT = 230;     /* Hinterkante der Abdeckplatten, Vorderkante (Oberkante der Mauerfront) */
{
  /* Abdeckplatten aus Kalkstein (oben, im Nachmittagslicht), leicht überstehend */
  let k = `<path d="M-1 ${KAPPE} L401 ${KAPPE - 1.2} L401 ${FRONT + 1} L-1 ${FRONT + 2} Z" fill="${S.lg("kappe", [[0, "#efe6d4"], [1, "#d9ccb4"]])}"/>`;
  k += `<path d="M-1 ${KAPPE} L401 ${KAPPE - 1.2}" stroke="#fff8ea" stroke-width=".8"/>`;
  for (const xb of [-60, 150, 330]) k += `<path d="M${r(CX + (xb - CX) * 0.82)} ${r(KAPPE + 0.1)} L${xb} ${FRONT + 1.5}" stroke="#a8987e" stroke-width=".5"/>`;
  /* Vorderkante der Platte: runde Fase im Licht, darunter Schattenfuge */
  k += `<path d="M-1 ${FRONT + 2} L401 ${FRONT + 1} L401 ${FRONT + 4} L-1 ${FRONT + 5} Z" fill="${S.lg("fase", [[0, "#f6ecd8"], [1, "#b5a68c"]])}"/>`;
  k += `<path d="M-1 ${FRONT + 5} L401 ${FRONT + 4} L401 ${FRONT + 7} L-1 ${FRONT + 8} Z" fill="#5a4c3c" opacity=".45"/>`;
  /* Mauerfront: grob behauene Kalksteinblöcke in unregelmäßigen Lagen */
  const zm = zufall(101);
  let steine = "";
  const farb = ["#d6c7a8", "#cbb999", "#dccdb0", "#c3b08f", "#d0c2a6", "#bfae90"];
  let y = FRONT + 7.5;
  while (y < 262) {
    const h = 8 + zm() * 7;
    for (let x = -4 - zm() * 14; x < 404; ) {
      const w = 16 + zm() * 26, hh = h - 1 - zm() * 1.6, yy = y + zm() * 0.8;
      const c = farb[Math.floor(zm() * farb.length)];
      steine += `<path d="M${r(x + 1.2)} ${r(yy)} Q${r(x + w * 0.5)} ${r(yy - 0.8)} ${r(x + w - 1.4)} ${r(yy + 0.2)} Q${r(x + w)} ${r(yy + hh * 0.5)} ${r(x + w - 1)} ${r(yy + hh)} Q${r(x + w * 0.5)} ${r(yy + hh + 0.6)} ${r(x + 1)} ${r(yy + hh - 0.2)} Q${r(x - 0.2)} ${r(yy + hh * 0.5)} ${r(x + 1.2)} ${r(yy)} Z" fill="${c}"/>`;
      steine += `<path d="M${r(x + 1.6)} ${r(yy + 0.7)} Q${r(x + w * 0.5)} ${r(yy)} ${r(x + w - 1.8)} ${r(yy + 0.9)}" stroke="#f6ecd6" stroke-width=".7" fill="none" opacity=".75"/>`;
      steine += `<path d="M${r(x + 1.6)} ${r(yy + hh - 0.6)} Q${r(x + w * 0.5)} ${r(yy + hh)} ${r(x + w - 1.6)} ${r(yy + hh - 0.5)}" stroke="#8c7a5e" stroke-width=".8" fill="none" opacity=".55"/>`;
      if (zm() < 0.4) steine += `<path d="M${r(x + 3 + zm() * (w - 9))} ${r(yy + 2 + zm() * (hh - 5))} l${r(2 + zm() * 3)} ${r(0.5)} l${r(-0.8)} ${r(1.3)} Z" fill="#9c8b70" opacity=".45"/>`;
      x += w + 0.9 + zm() * 0.6;
    }
    y += h;
  }
  k += `<path d="M-1 ${FRONT + 6} L401 ${FRONT + 5} L401 261 L-1 261 Z" fill="#6d5c47"/>` + steine;
  /* Poren und Flechten */
  let pk = "";
  for (let i = 0; i < 70; i++) { const x = zm() * 400, yy = KAPPE + 2 + zm() * (FRONT - KAPPE - 2); pk += `<circle cx="${r(x)}" cy="${r(yy)}" r="${r(0.15 + zm() * 0.35)}"/>`; }
  k += `<g fill="#8f7f66" opacity=".5">${pk}</g>`;
  for (const [x, yy, rr] of [[34, 214, 4], [252, 206, 2.4], [372, 222, 3.6]]) k += `<ellipse cx="${x}" cy="${yy}" rx="${rr}" ry="${r(rr * 0.5)}" fill="#c6bf86" opacity=".55"/>`;
  S.teil({ id: "mauer", de: "die Mauer", syl: "MAU-er", it: "il muretto", itSyl: "mu-RET-to", en: "wall", x: 200, y: 230, kunst: um(200, 230, kappeRand(k)),
    tipp: "Die Mauer schützt die Besucher an der Kante. Dahinter geht es 50 Meter in die Tiefe." });
}

/* --- vorläufig: Rest folgt --- */


const silben = (t) => { if (!t) return t; const st = t.split(/([- ])/); const gross = (x) => x.length && x === x.toUpperCase() && x !== x.toLowerCase(); const lang = st.some((x) => gross(x) && x.length > 1); return st.map((x) => (/^[- ]$/.test(x) ? x : (gross(x) && (x.length > 1 || !lang || /[À-ÖÙ-Ý]/.test(x)) ? x : x.toLowerCase()))).join(""); };
for (const t of S.teile) for (const u of [t, ...(t.unter || [])]) { u.syl = silben(u.syl); u.itSyl = silben(u.itSyl); }
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/kanada.js"));
console.log(aus);
