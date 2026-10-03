#!/usr/bin/env node
/* =====================================================================
   SCHLOSS NEUSCHWANSTEIN (FASSUNG 854) — Bilderwelt neu: Sehenswürdigkeit
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … als Profi-
   Grafikdesigner auf Hollywood-Niveau … mit größter Sorgfalt und
   Präzision auf höchstem Niveau“.

   STANDORT: der Ostkopf der MARIENBRÜCKE über der Pöllatschlucht
   (Schwangau, Ostallgäu) — das berühmteste Postkartenmotiv. Blick nach
   Norden über die Schlucht auf das Schloss, dahinter das flache
   Alpenvorland. Nachmittag im Oktober: Sonne von links (Südwest),
   Buchen gold, Lärchen gelb, Fichten dunkelgrün, klare Luft.

   RECHERCHE (Bayerische Schlösserverwaltung, Wikipedia „Schloss
   Neuschwanstein“ und „Marienbrücke“, Hohenschwangau.de):
   - DAS SCHLOSS: ab 1869 für König Ludwig II. gebaut, eine Kette von
     Bauten auf dem Felsgrat um einen unteren und oberen Hof: Torbau,
     Viereckturm, Ritterhaus (Nordseite des Hofs, Galerie mit
     Blendarkaden), Kemenate (Südseite, drei Geschosse, als „Damenhaus“
     gedacht) und der PALAS: fünf Geschosse, über 50 m lang, zwei
     Baukörper im flachen Winkel dem Felsgrat folgend, zwei hohe
     Satteldächer, achteckige Ecktürmchen; an der Westseite ein
     zweigeschossiger Söller (Balkon vor dem Thronsaal); auf dem
     Westgiebel eine Ritterfigur. Am Knick zwei Treppentürme; der
     nördliche, der NORDTURM, ist über 65 m hoch und überragt das Dach um
     mehrere Stockwerke. Im vierten Stock liegt der SÄNGERSAAL
     (27 × 10 m) — außen eine Reihe von Bogenfenstern mit Säulchen.
   - VIERECKTURM 45 m, weiß, oben Aussichtsplattform mit Rundtürmchen.
   - TORBAU: Außenfassade aus ROTEN ZIEGELN (nie mit Kalkstein
     verkleidet), beidseitig Flankiertürme; die Hofseite gelber Kalkstein.
   - MATERIAL: Ziegelmauerwerk, verkleidet mit hellem Kalkstein vom
     nahen Alterschrofen; Dächer und Turmhelme mit grauem Schiefer,
     Spitzen mit vergoldeten Knäufen.
   - MARIENBRÜCKE: eiserne Fachwerkbrücke (1866 unter Ludwig II. statt
     der Holzbrücke seines Vaters Maximilian II.), etwa 90 m über dem
     Pöllatfall; Bohlenbelag, Geländer aus Gitterwerk.
   - UMGEBUNG (echte Richtungen von der Brücke aus): das Schloss im
     Norden; dahinter nordnordwestlich der FORGGENSEE (Stausee am Lech,
     im Winter abgelassen), nordöstlich der Bannwaldsee; im Westen
     SCHLOSS HOHENSCHWANGAU (ockergelb, neugotisch, mit Zinnen; Ludwigs
     Sommerschloss der Kindheit) über dem ALPSEE; im Südwesten der
     SÄULING (2047 m, Kalkfels). In den Wiesen bei Schwangau die
     Wallfahrtskirche St. Coloman. Pferdekutschen fahren vom Dorf
     Hohenschwangau zum Schloss hinauf; auf den Weiden Allgäuer
     Braunvieh mit Glocken.
   - BILDAUFBAU: wie ein Panoramafoto zusammengeschoben — links
     Südwest (Säuling) und West (Alpsee, Hohenschwangau), in der Mitte
     Nordwest (St. Coloman, Forggensee), rechts Nord (das Schloss). Die
     Reihenfolge folgt den Himmelsrichtungen. Unten quert die Brücke die
     Schlucht; unter ihr stürzt der Wasserfall in die Tiefe.
   Maßstab: Schloss ≈ 1,6 Einheiten je Meter (Nordturm 65 m ≈ 108),
   Augenhöhe y 70 (≈ Höhe der Turmspitzen). Am Brückenkopf vorne
   ≈ 30 Einheiten je Meter (Wanderer 1,8 m ≈ 54).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "neuschwanstein", titel: "Schloss Neuschwanstein", emoji: "🏰", thema: "Deutschland", kuerzel: "nsw", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1869);
const r = B.r;
const HOR = 70;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation=".25"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation=".9"/></filter>`);
S.def(`<filter id="${S.id("gischt")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.8"/></filter>`);

/* ---------- Stoffe ------------------------------------------------- */
const KALK = S.lg("kalk", [[0, "#fffdf7"], [0.6, "#f6f1e6"], [1, "#e9e2d3"]]);
const KALK_OST = S.lg("kalkost", [[0, "#ece6d9"], [1, "#d6cfbf"]]);
const KALK_SCHATTEN = S.lg("kalks", [[0, "#d2d4dc"], [1, "#b8bcc7"]]);
const KALK_RUND = S.lg("kalkrund", [[0, "#f2ecdf"], [0.3, "#fffdf8"], [0.7, "#dedad1"], [1, "#adb0b9"]], 0, 0, 1, 0);
const SCHIEFER = S.lg("schiefer", [[0, "#7f8894"], [0.5, "#66707c"], [1, "#4b525e"]]);
const SCHIEFER_RUND = S.lg("schieferrund", [[0, "#8b94a0"], [0.35, "#747d8a"], [1, "#3e4550"]], 0, 0, 1, 0);
const ZIEGEL = S.lg("ziegel", [[0, "#c46245"], [1, "#a24a33"]]);
const ZIEGEL_RUND = S.lg("ziegelrund", [[0, "#c96a4c"], [0.35, "#d6795a"], [1, "#8a3c28"]], 0, 0, 1, 0);
const GLAS = S.lg("glas", [[0, "#5a687c"], [1, "#2e3846"]]);
const GOLD = S.lg("gold", [[0, "#f6dd84"], [1, "#b48a2c"]]);

/* Quaderung der Kalksteinfassade (zart) */
S.def(`<pattern id="${S.id("quader")}" width="5" height="1.8" patternUnits="userSpaceOnUse"><path d="M0 1.75 H5 M2.5 0 V.9 M0 .9 H5 M0 .9 V1.8" stroke="#b9ae98" stroke-width=".12" fill="none"/></pattern>`);
const QUADER = `url(#${S.id("quader")})`;
/* Ziegelverband */
S.def(`<pattern id="${S.id("zv")}" width="3" height="1.3" patternUnits="userSpaceOnUse"><rect width="3" height="1.3" fill="#b4553b"/><path d="M0 1.25 H3 M0 .6 H3 M1.5 0 V.6 M0 .6 V1.3 M3 .6 V1.3" stroke="#e1c7ae" stroke-width=".14"/><rect x=".1" y=".05" width="1.3" height=".5" fill="#c8664a" opacity=".6"/><rect x="1.6" y=".7" width="1.3" height=".5" fill="#9c442e" opacity=".5"/></pattern>`);

/* Herbstwald als Muster (Kacheln nahtlos): Buche gold, Lärche gelb, Ahorn rot, Fichte dunkel */
const LAUB = ["#d9a23a", "#c98a2c", "#e8bd52", "#b9692a", "#a8822e", "#c4a245", "#8f4e22"];
const NADEL = ["#2c4632", "#36553a", "#25402d", "#41613d"];
function waldKachel(name, w, h, n, anteilNadel, grund, seed) {
  const z = zufall(seed);
  const kronen = [];
  for (let i = 0; i < n; i++) kronen.push({ x: z() * w, y: z() * h, s: 0.9 + z() * 0.8, nadel: z() < anteilNadel, f: z() });
  kronen.sort((a, b) => a.y - b.y);
  let g = `<rect width="${w}" height="${h}" fill="${grund}"/>`;
  for (const c of kronen) for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) {
    const x = c.x + dx, y = c.y + dy, s = c.s;
    if (x < -3 || x > w + 3 || y < -4 || y > h + 3) continue;
    if (c.nadel) {
      const f = NADEL[Math.floor(c.f * NADEL.length)];
      g += `<path d="M${r(x - s * 0.9)} ${r(y + s * 0.6)} L${r(x)} ${r(y - s * 2.2)} L${r(x + s * 0.9)} ${r(y + s * 0.6)} Z" fill="${f}"/><path d="M${r(x - s * 0.5)} ${r(y - s * 0.4)} L${r(x)} ${r(y - s * 2.2)} L${r(x)} ${r(y + s * 0.4)} Z" fill="#7d9a68" opacity=".35"/>`;
    } else {
      const f = LAUB[Math.floor(c.f * LAUB.length)];
      g += `<ellipse cx="${r(x + 0.35)}" cy="${r(y + 0.4)}" rx="${r(s * 1.3)}" ry="${r(s * 1.05)}" fill="#3a2c18" opacity=".22"/><ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(s * 1.3)}" ry="${r(s * 1.05)}" fill="${f}"/><ellipse cx="${r(x - s * 0.4)}" cy="${r(y - s * 0.35)}" rx="${r(s * 0.6)}" ry="${r(s * 0.45)}" fill="#fbe7a6" opacity=".3"/>`;
    }
  }
  S.def(`<pattern id="${S.id(name)}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">${g}</pattern>`);
  return (skala) => {
    const id = name + "_" + String(skala).replace(".", "");
    S.def(`<pattern id="${S.id(id)}" href="#${S.id(name)}" patternTransform="scale(${skala})"/>`);
    return `url(#${S.id(id)})`;
  };
}
const HERBST = waldKachel("herbst", 26, 18, 120, 0.4, "#5a4a28", 3141);
const BERGWALD = waldKachel("bergwald", 22, 16, 64, 0.72, "#2c3a2a", 2718);

/* Punkt in Vieleck */
const drin = (x, y, poly) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const pfad = (pts) => "M" + pts.map(([x, y]) => `${r(x)} ${r(y)}`).join(" L") + " Z";
/* Saum aus Baumkronen entlang einer Oberkante (macht den Waldrand weich) */
function saum(linie, s, schritt, anteilNadel = 0.45) {
  let g = "";
  for (let i = 0; i < linie.length - 1; i++) {
    const [ax, ay] = linie[i], [bx, by] = linie[i + 1];
    const len = Math.hypot(bx - ax, by - ay);
    for (let d = 0; d < len; d += schritt * (0.7 + rnd() * 0.6)) {
      const t = d / len, x = ax + (bx - ax) * t, y = ay + (by - ay) * t + rnd() * s * 0.6, k = s * (0.8 + rnd() * 0.5);
      if (rnd() < anteilNadel) g += `<path d="M${r(x - k * 0.8)} ${r(y + k)} L${r(x)} ${r(y - k * 2.3)} L${r(x + k * 0.8)} ${r(y + k)} Z" fill="${NADEL[Math.floor(rnd() * 4)]}"/>`;
      else g += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(k * 1.25)}" ry="${r(k)}" fill="${LAUB[Math.floor(rnd() * LAUB.length)]}"/><ellipse cx="${r(x - k * 0.4)}" cy="${r(y - k * 0.35)}" rx="${r(k * 0.55)}" ry="${r(k * 0.4)}" fill="#fbe7a6" opacity=".45"/>`;
    }
  }
  return g;
}

/* Große Farbflecken im Wald (Buchengruppen, Fichtenhorste) — gibt dem
   Muster eine ruhige, natürliche Verteilung statt Streusel. */
S.def(`<filter id="${S.id("flecken")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
function waldflaeche(name, poly, skala, n, grund, deckung = 0.6) {
  const d = pfad(poly);
  S.def(`<clipPath id="${S.id(name)}"><path d="${d}"/></clipPath>`);
  const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  let f = "";
  for (let i = 0; i < n; i++) {
    const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0);
    const w = Math.min((8 + rnd() * 16) * skala * 1.4, x - x0, x1 - x), h = Math.min(w * 0.55, y - y0, y1 - y);
    if (w < 2 || h < 1) continue;
    f += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(w)}" ry="${r(h)}" fill="${["#c58a2c", "#d9a640", "#2f4a32", "#9a5a24", "#3b5a3a", "#b98a34", "#e2b85a"][Math.floor(rnd() * 7)]}"/>`;
  }
  return `<path d="${d}" fill="${grund}"/><g clip-path="url(#${S.id(name)})"><g filter="url(#${S.id("flecken")})">${f}</g></g><path d="${d}" fill="${HERBST(skala)}" opacity="${deckung}"/>`;
}

/* =====================================================================
   KULISSE — Himmel, ferne Hügel, Alpenvorland mit Feldern und Dörfern
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 2}" fill="${S.lg("himmel", [[0, "#3b72bd"], [0.5, "#7fafde"], [0.85, "#cfe0ec"], [1, "#ebe8de"]])}"/>`);
/* Schönwetterwolken (weich, unten flach, oben sonnig) */
{
  let c = "";
  const wolke = (x, y, s) => {
    let g = "";
    for (const [dx, dy, rx, ry] of [[-14, 1, 10, 3.6], [-5, -2.6, 9, 5.2], [5, -4, 8, 5.6], [13, -1, 9, 4], [0, 1.4, 20, 2.8]]) g += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fbfcfd"/>`;
    g += `<ellipse cx="${r(x + 1 * s)}" cy="${r(y + 2.2 * s)}" rx="${r(19 * s)}" ry="${r(1.6 * s)}" fill="#c3d1e0"/>`;
    g += `<ellipse cx="${r(x - 4 * s)}" cy="${r(y - 3 * s)}" rx="${r(7 * s)}" ry="${r(2.6 * s)}" fill="#fff"/>`;
    return g;
  };
  c += wolke(318, 24, 1.1) + wolke(372, 17, 0.7) + wolke(244, 34, 0.55) + wolke(168, 16, 0.6);
  S.hinten(`<g filter="url(#${S.id("wolke")})" opacity=".95">${c}</g>`);
  S.hinten(`<path d="M150 46 Q200 42 260 45" stroke="#fff" stroke-width="1.2" opacity=".3" fill="none" filter="url(#${S.id("wolke")})"/>`);
}
/* ferne Hügel des Allgäus am Horizont (Auerberg, Vorberge) */
S.hinten(`<path d="M90 ${HOR} L90 66.4 Q120 63 150 65.2 Q176 61.6 200 64.6 Q240 62.4 280 64 Q318 61.4 356 63.6 Q380 62.6 400 64 L400 ${HOR} Z" fill="#aabdd0" opacity=".9"/>`);
S.hinten(`<path d="M90 ${HOR + 1} Q160 67.4 240 68.6 Q320 66.8 400 68.2 L400 ${HOR + 2} L90 ${HOR + 2} Z" fill="#b6c5b8"/>`);
/* Alpenvorland: Wiesen in Bahnen, Waldstücke, Dörfer, Dunst nach hinten */
{
  let c = `<rect x="90" y="${HOR}" width="310" height="${162 - HOR}" fill="${S.lg("ebene", [[0, "#b9c8aa"], [0.25, "#a3b984"], [1, "#86a560"]])}"/>`;
  for (let i = 0; i < 60; i++) {
    const y = HOR + 2 + Math.pow(rnd(), 1.5) * 76, h = 0.5 + (y - HOR) * 0.04, w = 8 + (y - HOR) * 0.6 + rnd() * 10;
    c += `<rect x="${r(90 + rnd() * 310)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${["#aec384", "#c6c98c", "#93ad6a", "#bdb874", "#9db575"][i % 5]}" opacity=".7"/>`;
  }
  for (let i = 0; i < 34; i++) {
    const y = HOR + 3 + Math.pow(rnd(), 1.3) * 66, x = 90 + rnd() * 310, w = 3 + (y - HOR) * 0.22 + rnd() * 4;
    c += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(w)}" ry="${r(0.45 + (y - HOR) * 0.035)}" fill="${rnd() < 0.55 ? "#647d52" : "#8e8448"}" opacity=".55"/>`;
  }
  /* Bannwaldsee (nordöstlich, rechts hinten) */
  c += `<path d="M318 76 Q332 74.4 352 75 Q366 75.6 372 77 Q350 78.4 326 78 Z" fill="${S.lg("bannwald", [[0, "#cfdfe8"], [1, "#a3bfd0"]])}"/>`;
  /* Füssen und Schwangau: Häuser mit roten Dächern, Kirchtürme */
  for (const [x0, n, y] of [[100, 8, 85.4], [262, 11, 90], [210, 6, 95]]) {
    for (let i = 0; i < n; i++) {
      const x = x0 + i * 3.2 + rnd() * 1.4, yy = y + rnd() * 2;
      c += `<rect x="${r(x)}" y="${r(yy - 1.4)}" width="2.2" height="1.4" fill="#f2ede2"/><path d="M${r(x - 0.3)} ${r(yy - 1.4)} L${r(x + 1.1)} ${r(yy - 2.4)} L${r(x + 2.5)} ${r(yy - 1.4)} Z" fill="#b5674c"/>`;
    }
  }
  c += `<rect x="116" y="80" width="1.2" height="5" fill="#efe9dc"/><path d="M115.8 80.2 L116.6 78.2 L117.4 80.2 Z" fill="#7a5a3c"/>`;
  c += `<rect x="272" y="84.6" width="1.2" height="5" fill="#efe9dc"/><path d="M271.8 84.8 L272.6 82.6 L273.4 84.8 Z" fill="#5e7468"/>`;
  c += `<rect x="90" y="${HOR}" width="310" height="18" fill="${S.lg("ebenedunst", [[0, "#e8ece6", 0.8], [1, "#e8ece6", 0]])}"/>`;
  S.hinten(c);
}

/* =====================================================================
   1 — DER BERG (Säuling, links) mit Bergwald und Vorberg
   ===================================================================== */
{
  const umriss = [[-3, 120], [-3, 42], [2, 38], [9, 31], [15, 27.6], [20, 22], [25, 18.4], [30, 16.2], [34, 13.4], [38, 11.8], [42, 13], [46, 12.4], [50, 15], [54, 19.4], [58, 24], [61, 30], [65, 34], [70, 40], [75, 46], [82, 52], [90, 60], [100, 70], [108, 82], [116, 94], [124, 108], [128, 120]];
  let k = `<path d="${pfad(umriss)}" fill="${S.lg("saeuling", [[0, "#cdc8bd"], [0.35, "#b3ada1"], [0.55, "#6f7b62"], [1, "#3e5236"]])}"/>`;
  /* Felsfacetten: sonnige Westwand, Mittelrinne, schattige Nordostwand */
  const facette = (pts, f, o = 1) => `<path d="${pfad(pts)}" fill="${f}" opacity="${o}"/>`;
  const LICHT = S.lg("felslicht", [[0, "#f1ece2"], [0.7, "#d9d1c1"], [1, "#bdb3a0"]]);
  const MITTE = S.lg("felsmitte", [[0, "#c9c3b7"], [1, "#a29b8d"]]);
  const SCHATT = S.lg("felsschatten", [[0, "#a7aab2"], [1, "#7d838b"]]);
  k += facette([[-3, 42], [2, 38], [9, 31], [15, 27.6], [20, 22], [25, 18.4], [30, 16.2], [28, 30], [22, 44], [14, 54], [4, 60], [-3, 62]], LICHT);
  k += facette([[30, 16.2], [34, 13.4], [38, 11.8], [36, 26], [34, 40], [30, 54], [22, 58], [14, 54], [22, 44], [28, 30]], MITTE);
  k += facette([[38, 11.8], [42, 13], [46, 12.4], [50, 15], [54, 19.4], [58, 24], [61, 30], [65, 34], [70, 40], [66, 50], [56, 58], [44, 62], [34, 58], [30, 54], [34, 40], [36, 26]], SCHATT);
  /* Rinnen (dunkel) mit hellen Schuttkegeln darunter, Felsbänder als Kanten */
  for (const [x, y0, y1, w] of [[26, 26, 52, 1.4], [36, 20, 56, 1.8], [47, 22, 54, 1.4], [57, 30, 52, 1.2], [14, 36, 54, 1.1]]) {
    k += `<path d="M${x - w / 2} ${y0} Q${x - w} ${(y0 + y1) / 2} ${x - w * 0.3} ${y1} L${x + w * 0.6} ${y1} Q${x + w * 0.4} ${(y0 + y1) / 2} ${x + w / 2} ${y0} Z" fill="${x < 34 ? "#9d9486" : "#5e646c"}" opacity=".4"/>`;
    k += `<path d="M${x - 3.4} ${y1 + 4} Q${x} ${y1 - 3} ${x + 3.4} ${y1 + 4} Z" fill="#e2dccf" opacity=".4"/>`;
  }
  /* Bergwald (Fichten, gelbe Lärchen) bis zur Waldgrenze */
  const BW = [[-3, 64], [4, 61], [14, 57], [22, 60], [30, 56], [38, 60], [46, 63], [56, 59], [66, 51], [72, 46], [80, 54], [90, 63], [106, 82], [126, 112], [128, 120], [-3, 120]];
  k += `<path d="${pfad(BW)}" fill="${BERGWALD(0.42)}"/>`;
  k += saum(BW.slice(0, 12), 0.95, 2, 0.8);
  for (let i = 0; i < 26; i++) { const x = rnd() * 110, y = 64 + rnd() * 40; if (drin(x, y, BW)) k += `<path d="M${r(x - 0.7)} ${r(y + 0.8)} L${r(x)} ${r(y - 1.8)} L${r(x + 0.7)} ${r(y + 0.8)} Z" fill="#d9b23e" opacity=".85"/>`; }
  k += `<path d="${pfad(BW)}" fill="${S.lg("bwlicht", [[0, "#fff4cc", 0.12], [0.5, "#000", 0], [1, "#0e1a10", 0.25]], 0, 0, 1, 0)}"/>`;
  /* Pilgerschrofen: bewaldeter Vorberg rechts unten */
  const PS = [[64, 120], [76, 92], [88, 80], [98, 77], [106, 80], [116, 92], [124, 106], [128, 120]];
  k += waldflaeche("psclip", PS, 0.42, 12, "#5e5430", 0.6);
  k += saum(PS.slice(0, 7), 0.9, 2, 0.5);
  k += `<path d="${pfad(PS)}" fill="${S.lg("psschatten", [[0, "#ffffff", 0.06], [1, "#203020", 0.25]], 0, 0, 1, 0)}"/>`;
  /* Luftperspektive: bläulicher Schleier über dem ganzen Berg */
  k += `<path d="${pfad(umriss)}" fill="${S.lg("bergdunst", [[0, "#c9d8e8", 0.32], [0.6, "#c9d8e8", 0.12], [1, "#c9d8e8", 0.04]])}"/>`;
  S.teil({ id: "berg", de: "der Berg", syl: "BERG", it: "il monte", itSyl: "MON-te", en: "mountain", x: 0, y: 0, kunst: `<g filter="url(#${S.id("dunst")})">${k}</g>`,
    tipp: "Das ist der Säuling (2047 m). Mit ihm beginnen hier die Alpen." });
}

/* =====================================================================
   2 — DER STAUSEE (Forggensee, hinter dem Schloss)
   ===================================================================== */
{
  let k = `<path d="M100 79 Q106 74.6 126 73.8 Q150 72.6 176 73.4 Q206 72.8 236 74.4 Q250 75.4 244 77.6 Q226 79.4 206 78.8 Q186 80.4 166 80.2 Q140 82 122 81.8 Q104 82.4 100 79 Z" fill="${S.lg("forggen", [[0, "#dde8ef"], [0.5, "#b8cfdd"], [1, "#98b6ca"]])}"/>`;
  k += `<path d="M112 77.6 Q150 75.8 196 76.4" stroke="#fff" stroke-width=".5" opacity=".7" fill="none"/>`;
  k += `<path d="M132 80 Q160 78.6 186 79" stroke="#f6f9fb" stroke-width=".35" opacity=".6" fill="none"/>`;
  S.teil({ id: "stausee", de: "der Stausee", syl: "STAU-see", it: "il lago artificiale", itSyl: "LA-go ar-ti-fi-CIA-le", en: "reservoir", x: 0, y: 0, kunst: k,
    tipp: "Der Forggensee ist ein Stausee am Lech. Im Winter wird das Wasser abgelassen." });
}

/* =====================================================================
   3 — DIE WIESE bei Schwangau (Lupe: die Kuh) und 4 — DIE KIRCHE
   ===================================================================== */
const WIESE = [[116, 101], [132, 97.8], [154, 98.4], [160, 106], [158, 118], [140, 121], [120, 119]];
{
  let k = `<path d="${pfad(WIESE)}" fill="${S.rg("wiese", [[0, "#b3cc74"], [0.75, "#9fbe62"], [1, "#9fbe62", 0]], 0.5, 0.5, 0.6)}"/>`;
  /* Feldweg, Heustadel, Weidezaun */
  k += `<path d="M120 112 Q134 108 158 110" stroke="#ddd3ae" stroke-width=".7" fill="none"/>`;
  k += `<rect x="150" y="101.6" width="4.4" height="2.4" fill="#8a6a42"/><path d="M149.6 101.8 L152.2 100 L154.8 101.8 Z" fill="#5e4630"/>`;
  for (let x = 122; x < 156; x += 2.4) k += `<line x1="${x}" y1="${r(115.6 + (x - 120) * 0.02)}" x2="${x}" y2="${r(116.8 + (x - 120) * 0.02)}" stroke="#7a6248" stroke-width=".25"/>`;
  k += `<line x1="122" y1="116.2" x2="156" y2="117" stroke="#7a6248" stroke-width=".2"/>`;
  /* Kühe (Allgäuer Braunvieh) mit Glocke am Lederriemen */
  const kuh = (x, y, s, rechts) => {
    const d = rechts ? 1 : -1;
    let g = `<g transform="translate(${x} ${y}) scale(${d * s} ${s})">`;
    g += `<ellipse cx="0" cy="-1.6" rx="2.2" ry="1.05" fill="#8a6446"/><ellipse cx="-.4" cy="-2" rx="1.4" ry=".4" fill="#b08866" opacity=".6"/>`;
    g += `<path d="M1.8 -2.2 L3.1 -2.5 L3.5 -1.6 L2.8 -1.1 L1.9 -1.3 Z" fill="#7a5638"/><ellipse cx="3.3" cy="-1.55" rx=".4" ry=".3" fill="#d8c2a8"/>`;
    g += `<path d="M2.7 -2.5 l.3 -.5 M3.1 -2.5 l.3 -.4" stroke="#efe6d2" stroke-width=".18"/>`;
    for (const lx of [-1.5, -0.9, 1, 1.5]) g += `<rect x="${lx - 0.17}" y="-1" width=".34" height="1" fill="#6a4a30"/>`;
    g += `<path d="M2.2 -1.2 L2.3 -.6" stroke="#4a3a2a" stroke-width=".15"/><path d="M2.05 -.7 h.5 l.1 .5 h-.7 Z" fill="#d8b04a"/>`;
    g += `<path d="M-2.2 -1.8 q-.5 .4 -.3 1.2" stroke="#6a4a30" stroke-width=".2" fill="none"/></g>`;
    return g;
  };
  k += kuh(136, 114, 1, true) + kuh(143, 112.4, 0.95, false) + kuh(128, 112.6, 0.9, true);
  S.teil({ id: "wiese", de: "die Wiese", syl: "WIE-se", it: "il prato", itSyl: "PRA-to", en: "meadow", x: 0, y: 0, kunst: k,
    zoom: { x: 116, y: 98, w: 42, h: 28 },
    unter: [
      { id: "kuh", de: "die Kuh", syl: "KUH", it: "la mucca", itSyl: "MUC-ca", en: "cow", x: 136, y: 114, kunst: flaeche(-11, -5, 21, 6.4),
        tipp: "Im Allgäu tragen die Kühe auf der Weide eine Glocke. So hört man, wo sie sind." },
    ] });
}
{
  /* St. Coloman: weiße Wallfahrtskirche allein in der Wiese */
  let k = schatten(0, 0.2, 6, 0.6, 0.2);
  k += `<rect x="-4.6" y="-3.6" width="8" height="3.6" fill="${KALK}"/><path d="M-5 -3.6 L-3.8 -5.6 L3.6 -5.6 L3.8 -3.6 Z" fill="#a8604a"/>`;
  k += `<path d="M3.4 -3.6 L5 -3.6 Q5.6 -2 5 0 L3.4 0 Z" fill="#e9e3d6"/>`;
  for (const x of [-3.4, -1.6, 0.2, 2]) k += `<rect x="${x}" y="-2.8" width=".6" height="1.4" rx=".3" fill="#6a7684"/>`;
  k += `<rect x="-6.6" y="-8.4" width="2.4" height="8.4" fill="${KALK}"/><rect x="-6" y="-7.4" width=".6" height=".9" fill="#6a7684"/>`;
  k += `<path d="M-6.8 -8.4 Q-7 -9.6 -5.4 -10.4 Q-3.8 -9.6 -4 -8.4 Z" fill="#5c6b5c"/><rect x="-5.6" y="-11.6" width=".4" height="1.4" fill="#5c6b5c"/><circle cx="-5.4" cy="-11.8" r=".25" fill="#d8b04a"/>`;
  S.teil({ oben: true, id: "kirche", de: "die Kirche", syl: "KIR-che", it: "la chiesa", itSyl: "CHIE-sa", en: "church", x: 138, y: 107, kunst: k + flaeche(-7, -12, 13, 12.4),
    tipp: "St. Coloman: eine Wallfahrtskirche, die ganz allein in den Wiesen bei Schwangau steht." });
}

/* =====================================================================
   5 — DER SEE (Alpsee) und 6 — SCHLOSS HOHENSCHWANGAU
   ===================================================================== */
{
  let k = `<path d="M-6 116 Q20 111 48 112 Q74 111.4 96 113.4 Q112 115 118 121 Q104 128 84 131 Q56 135 26 134 Q6 134 -6 132 Z" fill="${S.lg("alpsee", [[0, "#5f93a4"], [0.5, "#3f7589"], [1, "#2b596b"]])}"/>`;
  /* Spiegelung von Bergwald und Fels, Lichtstreifen, Wind */
  k += `<path d="M-6 116 Q20 111 48 112 Q66 112 76 113.6 Q40 119 -6 122 Z" fill="#26402f" opacity=".5"/>`;
  k += `<path d="M6 117 Q20 115 32 116 L30 120 Q18 120 6 121 Z" fill="#cfc8ba" opacity=".25"/>`;
  for (const [x, y, w] of [[20, 123, 30], [52, 127, 26], [80, 121, 20], [8, 129, 18], [40, 131, 14]]) k += `<path d="M${x} ${y} h${w}" stroke="#d6eaf0" stroke-width=".35" opacity=".7"/>`;
  S.teil({ id: "see", de: "der See", syl: "SEE", it: "il lago", itSyl: "LA-go", en: "lake", x: 0, y: 0, kunst: k,
    tipp: "Der Alpsee ist ein klarer, tiefer Bergsee direkt unter Schloss Hohenschwangau." });
}
{
  /* Hohenschwangau: ockergelb, neugotisch, Zinnen und Türme, weiße Fenstergewände */
  const GELB = S.lg("hsgelb", [[0, "#f4cb6c"], [1, "#dba840"]]);
  const GELB_S = S.lg("hsgelbs", [[0, "#c9963a"], [1, "#a8782a"]]);
  const GELB_R = S.lg("hsrund", [[0, "#d8a440"], [0.35, "#f8d47a"], [1, "#b8862e"]], 0, 0, 1, 0);
  const zinnen = (x0, x1, y, f) => { let g = ""; for (let x = x0; x < x1 - 0.5; x += 1.5) g += `<rect x="${r(x)}" y="${r(y - 0.9)}" width=".85" height=".95" fill="${f}"/>`; return g; };
  const fen = (x, y) => `<rect x="${r(x - 0.15)}" y="${r(y - 0.15)}" width="1.1" height="2.1" fill="#f6efe0"/><rect x="${r(x)}" y="${r(y)}" width=".8" height="1.8" fill="#5a5448"/>`;
  let k = "";
  /* Hauptbau mit Zinnenkranz */
  k += `<rect x="-10" y="-13" width="18" height="14" fill="${GELB}"/><rect x="8" y="-12" width="3.6" height="13" fill="${GELB_S}"/>` + zinnen(-10, 8, -13, "#f2c560") + zinnen(8, 11.6, -12, "#c9963a");
  for (let row = 0; row < 3; row++) for (let i = 0; i < 6; i++) k += fen(-8.6 + i * 2.8, -10.6 + row * 3.8);
  /* Rundturm links, Viereckturm, Anbau rechts */
  k += `<rect x="-14.2" y="-18" width="4.6" height="19" fill="${GELB_R}"/>` + zinnen(-14.2, -9.6, -18, "#e6b452") + fen(-12.4, -15);
  k += `<rect x="3.6" y="-19" width="4.8" height="7" fill="${GELB}"/>` + zinnen(3.6, 8.4, -19, "#f2c560") + fen(5.6, -17);
  k += `<rect x="11" y="-6.4" width="9.6" height="7.4" fill="${GELB}"/>` + zinnen(11, 20.6, -6.4, "#f2c560") + fen(12.6, -4.4) + fen(15.6, -4.4) + fen(18.4, -4.4);
  k += `<rect x="-10" y="-13" width="1.2" height="14" fill="#fff" opacity=".2"/>`;
  /* bewaldeter Burghügel davor */
  const HG = [[-24, 14], [-18, 4], [-8, 1.2], [6, 0.8], [18, 2], [26, 8], [32, 14]];
  k += `<path d="${pfad(HG)}" fill="${HERBST(0.42)}"/>` + saum(HG.slice(0, 6), 0.9, 1.8, 0.4);
  S.teil({ id: "hohenschwangau", de: "das Schloss Hohenschwangau", syl: "SCHLOSS ho-hen-SCHWAN-gau", it: "il castello di Hohenschwangau", itSyl: "ca-STEL-lo di ho-en-SCHWAN-gau", en: "Hohenschwangau Castle",
    x: 96, y: 133, kunst: k, tipp: "Im gelben Schloss Hohenschwangau verbrachte König Ludwig II. die Sommer seiner Kindheit." });
}

/* =====================================================================
   7 — DER WALD (Herbstwald am Schlossberg und an den Hängen der Schlucht)
   ===================================================================== */
const WALD = [[0, 138], [20, 135], [50, 137], [80, 136], [104, 140], [118, 143], [134, 141], [150, 146], [400, 152], [400, 232], [330, 236], [292, 230], [248, 214], [200, 206], [150, 210], [100, 214], [50, 218], [0, 222]];
const WALD_NAH = [[0, 186], [18, 183], [40, 187], [64, 182], [90, 186], [116, 184], [140, 190], [164, 188], [184, 193], [220, 192], [240, 197], [262, 194], [300, 192], [340, 188], [372, 190], [400, 186], [400, 232], [330, 236], [292, 230], [248, 214], [200, 206], [150, 210], [100, 214], [50, 218], [0, 222]];
{
  let k = waldflaeche("waldclip", WALD, 0.55, 46, "#6a5a2e", 0.62);
  k += saum(WALD.slice(0, 9), 1.3, 2.6, 0.45);
  /* dunkle Fichtengruppen im Hang */
  for (const [cx, cy, n] of [[40, 160, 7], [96, 166, 6], [330, 170, 8], [372, 176, 6], [20, 196, 5], [150, 196, 6]]) {
    for (let i = 0; i < n; i++) { const x = cx + (rnd() - 0.5) * 16, y = cy + (rnd() - 0.5) * 8, s2 = 1.6 + rnd(); k += `<path d="M${r(x - s2 * 0.8)} ${r(y + s2)} L${r(x)} ${r(y - s2 * 2.6)} L${r(x + s2 * 0.8)} ${r(y + s2)} Z" fill="${NADEL[i % 4]}"/>`; }
  }
  /* näher: größere Kronen */
  k += waldflaeche("nahclip", WALD_NAH, 0.95, 26, "#5e4e28", 0.66);
  k += saum(WALD_NAH.slice(0, 16), 1.5, 3.2, 0.45);
  /* Licht von links oben, Schatten zur Schlucht hin */
  k += `<path d="${pfad(WALD)}" fill="${S.lg("waldlicht", [[0, "#fff1c4", 0.14], [0.45, "#000", 0], [1, "#120e06", 0.38]])}"/>`;
  k += `<path d="${pfad(WALD)}" fill="${S.lg("waldseite", [[0, "#ffe9b0", 0.08], [0.5, "#000", 0], [1, "#0c0a04", 0.18]], 0, 0, 1, 0)}"/>`;
  /* Kutschenweg vom Dorf herauf, in Kehren durch den Wald */
  const weg = "M108 156 Q124 150 138 154 Q148 157 156 153 Q162 150 168 154";
  k += `<path d="${weg}" stroke="#d6c9ad" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="${weg}" stroke="#a89878" stroke-width=".3" fill="none" transform="translate(0 .7)"/>`;
  S.teil({ id: "wald", de: "der Wald", syl: "WALD", it: "il bosco", itSyl: "BO-sco", en: "forest", x: 0, y: 0, kunst: k,
    tipp: "Im Herbst färben sich Buchen und Lärchen gold. Die Fichten bleiben dunkelgrün." });
}

/* =====================================================================
   8 — DIE KUTSCHE auf dem Weg zum Schloss (Lupe: das Pferd)
   ===================================================================== */
{
  const X = 146, Y = 155.8;
  let k = schatten(0, 0.2, 7, 0.6, 0.3);
  const pferd = (dx, f) => {
    let g = `<ellipse cx="${dx}" cy="-2.6" rx="1.9" ry=".95" fill="${f}"/>`;
    g += `<path d="M${dx - 1.6} -3 L${dx - 2.6} -4.4 L${dx - 3.3} -4.2 L${dx - 2.7} -3.3 L${dx - 2} -2.4 Z" fill="${f}"/>`;
    g += `<path d="M${dx - 1.4} -3.4 L${dx - 2.4} -4.5" stroke="#f1e2bc" stroke-width=".35"/>`;
    for (const lx of [-1.2, -0.8, 1, 1.4]) g += `<rect x="${r(dx + lx - 0.13)}" y="-2" width=".26" height="2" fill="${f}"/>`;
    g += `<path d="M${dx + 1.8} -2.8 q.6 .6 .3 1.6" stroke="#f1e2bc" stroke-width=".3" fill="none"/>`;
    g += `<path d="M${dx - 1.2} -3.2 L${dx + 1} -2.9" stroke="#2a1c10" stroke-width=".2"/>`;
    return g;
  };
  k += pferd(-4.4, "#a8642e") + pferd(-3.6, "#b9743a");
  k += `<path d="M-2 -2.8 L1 -2.6" stroke="#3a2a1c" stroke-width=".25"/>`;
  /* Landauer: schwarz, gelbe Räder, Verdeck */
  k += `<path d="M.6 -1.4 L5.6 -1.4 L5.8 -3.4 L4.6 -3.6 L4.6 -2.6 L2.2 -2.6 L1.8 -3.4 L.8 -3.2 Z" fill="#23262b"/>`;
  k += `<path d="M4.4 -3.6 Q5.4 -6 6.6 -4.2 L5.8 -3.4 Z" fill="#3a3f46"/>`;
  k += `<circle cx="1.8" cy="-.8" r=".8" fill="none" stroke="#d8a830" stroke-width=".3"/><circle cx="4.8" cy="-1" r="1" fill="none" stroke="#d8a830" stroke-width=".3"/>`;
  k += `<rect x="1.2" y="-4.4" width=".9" height="1.4" fill="#2f4a2f"/><circle cx="1.65" cy="-4.8" r=".42" fill="#e0b896"/><rect x="1.15" y="-5.4" width="1" height=".35" fill="#1c1c1c"/>`;
  k += `<rect x="3" y="-4" width=".8" height="1.2" fill="#b8473a"/><circle cx="3.4" cy="-4.3" r=".38" fill="#e8c39e"/><rect x="3.9" y="-3.9" width=".7" height="1.1" fill="#2f5f95"/><circle cx="4.25" cy="-4.2" r=".36" fill="#d9a882"/>`;
  S.teil({ oben: true, id: "kutsche", de: "die Kutsche", syl: "KUT-sche", it: "la carrozza", itSyl: "car-ROZ-za", en: "carriage", x: X, y: Y, kunst: k + flaeche(-7, -6.4, 14.4, 7),
    tipp: "Mit der Pferdekutsche fährt man vom Dorf Hohenschwangau hinauf zum Schloss.",
    zoom: { x: X - 15, y: Y - 13, w: 30, h: 20 },
    unter: [
      { id: "pferd", de: "das Pferd", syl: "PFERD", it: "il cavallo", itSyl: "ca-VAL-lo", en: "horse", x: X - 4, y: Y, kunst: flaeche(-3.6, -4.8, 6, 4.8),
        tipp: "Zwei Pferde ziehen die Kutsche den steilen Weg hinauf." },
    ] });
}

/* =====================================================================
   9 — DER FELSEN (Schlossfelsen aus hellem Kalk, fällt zur Schlucht ab)
   ===================================================================== */
{
  const umriss = [[150, 152], [176, 150], [230, 151], [264, 152], [292, 154], [294, 160], [284, 170], [270, 178], [258, 190], [242, 198], [226, 196], [210, 190], [194, 186], [180, 180], [166, 172], [156, 162]];
  let k = `<path d="${pfad(umriss)}" fill="${S.lg("fels", [[0, "#e2dacb"], [0.5, "#c8bea9"], [1, "#9a8e78"]])}"/>`;
  /* senkrechte Wände: sonnige Platten links, Kanten und Schatten rechts */
  k += `<path d="M150 152 L176 150 L184 151 L182 166 L178 178 L166 172 L156 162 Z" fill="${S.lg("platte", [[0, "#ebe4d6"], [1, "#cfc5b1"]])}"/>`;
  k += `<path d="M184 151 L206 151 L204 168 L196 186 L180 180 L182 166 Z" fill="#d9d0bf"/>`;
  k += `<path d="M206 151 L234 151 L230 172 L226 196 L210 190 L196 186 L204 168 Z" fill="#d2c8b4"/>`;
  k += `<path d="M234 151 L262 152 L256 172 L242 198 L226 196 L230 172 Z" fill="#b8ad97"/>`;
  k += `<path d="M262 152 L292 154 L294 160 L284 170 L270 178 L258 190 L242 198 L256 172 Z" fill="#a39783"/>`;
  for (const [x1, y1, x2, y2] of [[184, 153, 182, 170], [206, 153, 203, 176], [234, 154, 229, 186], [262, 155, 256, 178], [220, 160, 216, 186], [196, 160, 192, 180], [246, 160, 241, 190]]) k += `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#857a67" stroke-width=".45" opacity=".75"/>`;
  for (const [x1, y1, x2, y2] of [[160, 160, 180, 159], [188, 172, 204, 171], [212, 178, 232, 176], [240, 168, 258, 166]]) k += `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#fffaf0" stroke-width=".5" opacity=".7"/>`;
  /* Latschen und Büsche in den Ritzen, Bäume am Fuß */
  for (const [x, y] of [[168, 166], [192, 178], [214, 184], [238, 188], [262, 176], [280, 166], [228, 166], [200, 162]]) k += `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.4" fill="#46663a"/><ellipse cx="${x - 0.8}" cy="${y - 0.5}" rx="1.2" ry=".6" fill="#7f9c5a"/>`;
  const FUSS = [[150, 172], [158, 166], [170, 170], [182, 164], [196, 162], [210, 165], [226, 160], [242, 163], [258, 159], [274, 160], [288, 157], [298, 158], [300, 190], [270, 200], [236, 206], [200, 204], [170, 200], [150, 196]];
  k += waldflaeche("fussclip", FUSS, 0.7, 14, "#5e4e28", 0.66);
  k += saum(FUSS.slice(0, 12), 1.5, 2.6, 0.5);
  S.teil({ id: "felsen", de: "der Felsen", syl: "FEL-sen", it: "la roccia", itSyl: "ROC-cia", en: "rock", x: 0, y: 0, kunst: k,
    tipp: "Das Schloss steht auf einem Felsgrat hoch über der Pöllatschlucht." });
}

/* =====================================================================
   10 — DAS SCHLOSS NEUSCHWANSTEIN (Palas, Nordturm, Kemenate, Ritterhaus)
        Lupe: der Palas, das Dach, die Kemenate, der Turm, der Balkon,
        das Fenster (Sängersaal)
   ===================================================================== */
/* Bogenfenster (Rundbogen), gekuppelt, mit hellem Gewände */
const fenster = (x, y, w, h, n = 1, saeule = false) => {
  let g = `<path d="M${r(x - 0.4)} ${r(y + h + 0.2)} L${r(x - 0.4)} ${r(y + w / (2 * n) - 0.2)} Q${r(x - 0.4)} ${r(y - 0.6)} ${r(x + w / 2)} ${r(y - 0.6)} Q${r(x + w + 0.4)} ${r(y - 0.6)} ${r(x + w + 0.4)} ${r(y + w / (2 * n) - 0.2)} L${r(x + w + 0.4)} ${r(y + h + 0.2)} Z" fill="#fbf8f0" opacity=".85"/>`;
  const fw = (w - (n - 1) * 0.5) / n;
  for (let i = 0; i < n; i++) {
    const x0 = x + i * (fw + 0.5);
    g += `<path d="M${r(x0)} ${r(y + h)} L${r(x0)} ${r(y + fw / 2)} A${r(fw / 2)} ${r(fw / 2)} 0 0 1 ${r(x0 + fw)} ${r(y + fw / 2)} L${r(x0 + fw)} ${r(y + h)} Z" fill="${GLAS}"/>`;
    g += `<path d="M${r(x0 + fw * 0.25)} ${r(y + h - 0.3)} L${r(x0 + fw * 0.25)} ${r(y + fw * 0.6)}" stroke="#b3c2d2" stroke-width=".18" opacity=".7"/>`;
  }
  if (saeule) for (let i = 1; i < n; i++) g += `<rect x="${r(x + i * (fw + 0.5) - 0.45)}" y="${r(y + 0.4)}" width=".4" height="${r(h - 0.4)}" fill="#f6f1e6"/>`;
  g += `<path d="M${r(x - 0.5)} ${r(y + h + 0.3)} h${r(w + 1)}" stroke="#d2c9b6" stroke-width=".45"/>`;
  return g;
};
/* Rundes Türmchen mit spitzem Schieferhelm und goldenem Knauf */
const tuermchen = (cx, yFuss, yHals, w, helm, opt = {}) => {
  let g = "";
  if (opt.konsole) g += `<path d="M${r(cx - w / 2)} ${r(yFuss)} Q${r(cx)} ${r(yFuss + w * 1.1)} ${r(cx + w / 2)} ${r(yFuss)} Z" fill="${KALK_SCHATTEN}"/>`;
  g += `<rect x="${r(cx - w / 2)}" y="${r(yHals)}" width="${r(w)}" height="${r(yFuss - yHals)}" fill="${opt.ziegel ? ZIEGEL_RUND : KALK_RUND}"/>`;
  if (opt.fenster) for (const fy of opt.fenster) g += `<path d="M${r(cx - 0.5)} ${r(fy + 2)} L${r(cx - 0.5)} ${r(fy + 0.5)} A.5 .5 0 0 1 ${r(cx + 0.5)} ${r(fy + 0.5)} L${r(cx + 0.5)} ${r(fy + 2)} Z" fill="${GLAS}"/>`;
  g += `<rect x="${r(cx - w / 2 - 0.4)}" y="${r(yHals - 0.8)}" width="${r(w + 0.8)}" height=".9" fill="${opt.ziegel ? "#e9dcc6" : "#ebe6da"}"/>`;
  g += `<path d="M${r(cx - w / 2 - 0.6)} ${r(yHals - 0.6)} Q${r(cx - w * 0.2)} ${r(yHals - helm * 0.45)} ${r(cx)} ${r(yHals - helm)} Q${r(cx + w * 0.2)} ${r(yHals - helm * 0.45)} ${r(cx + w / 2 + 0.6)} ${r(yHals - 0.6)} Z" fill="${SCHIEFER_RUND}"/>`;
  g += `<path d="M${r(cx - w / 2 - 0.2)} ${r(yHals - 0.9)} Q${r(cx - w * 0.25)} ${r(yHals - helm * 0.45)} ${r(cx - 0.1)} ${r(yHals - helm + 0.6)} L${r(cx - w * 0.12)} ${r(yHals - 0.9)} Z" fill="#b4bcc7" opacity=".45"/>`;
  g += `<line x1="${r(cx)}" y1="${r(yHals - helm)}" x2="${r(cx)}" y2="${r(yHals - helm - 2.8)}" stroke="#9a7a2a" stroke-width=".3"/><circle cx="${r(cx)}" cy="${r(yHals - helm - 1.3)}" r=".45" fill="${GOLD}"/>`;
  return g;
};
const PAL = { x0: 178, x1: 262, knick: 222, fuss: 152, traufe: 94, first: 71 };
{
  let k = "";
  /* --- RITTERHAUS (hinter dem Hof, Nordseite): Galerie mit Blendarkaden --- */
  k += `<path d="M288 132 L288 120 L334 122 L334 138 Z" fill="${KALK_SCHATTEN}"/>`;
  k += `<path d="M286 120.4 L296 110 L326 111.4 L336 122.4 Z" fill="${SCHIEFER}"/>`;
  for (let i = 0; i < 9; i++) k += `<path d="M${r(290 + i * 4.8)} ${r(131 + i * 0.1)} L${r(290 + i * 4.8)} ${r(127.4 + i * 0.1)} A1.3 1.3 0 0 1 ${r(292.6 + i * 4.8)} ${r(127.4 + i * 0.1)} L${r(292.6 + i * 4.8)} ${r(131 + i * 0.1)} Z" fill="#9aa0ac"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${r(292 + i * 7)}" y="123.2" width="1.2" height="2" rx=".5" fill="${GLAS}"/>`;
  /* --- KEMENATE (Südseite des Hofs) rechts neben dem Palas --- */
  k += `<rect x="260" y="116" width="30" height="38" fill="${KALK}"/><rect x="260" y="116" width="30" height="38" fill="${QUADER}" opacity=".5"/>`;
  k += `<rect x="286" y="116" width="4" height="38" fill="${KALK_SCHATTEN}"/>`;
  k += `<path d="M258.6 116.4 L264 102 L284 102 L291.4 116.4 Z" fill="${SCHIEFER}"/><path d="M264 102 L284 102 L285 104 L263.4 104 Z" fill="#8f98a4"/>`;
  for (const y of [119.6, 129, 138.4]) k += fenster(263.4, y, 4.6, 5.6, 2) + fenster(271.4, y, 4.6, 5.6, 2) + fenster(279.4, y, 4.6, 5.6, 2);
  for (const y of [127.4, 136.8, 146.2]) k += `<rect x="260" y="${y}" width="30" height=".5" fill="#ddd6c6"/>`;
  k += `<path d="M265 154 L265 149 A3 3 0 0 1 271 149 L271 154 Z" fill="#6e655a"/>`;
  for (const x of [268, 278]) k += `<path d="M${x} 111 L${x} 108 L${x + 2} 106.6 L${x + 4} 108 L${x + 4} 111 Z" fill="#e9e4d8"/><rect x="${x + 1.2}" y="108.4" width="1.6" height="2.2" fill="${GLAS}"/>`;
  k += tuermchen(292.6, 136, 106, 5.2, 14, { fenster: [110, 118, 126] });

  /* --- PALAS --- */
  const { x0, x1, knick, fuss, traufe, first } = PAL;
  /* hoher Sockel, mit dem Fels verwachsen */
  k += `<path d="M${x0 - 11} ${fuss + 2} L${x0 - 10} ${fuss - 10} L${x1} ${fuss - 10} L${x1 + 1} ${fuss + 3} Z" fill="${S.lg("sockel", [[0, "#ece5d6"], [1, "#d8cfbd"]])}"/>`;
  k += `<path d="M${x0 - 11} ${fuss + 2} L${x0 - 10} ${fuss - 10} L${x1} ${fuss - 10} L${x1 + 1} ${fuss + 3} Z" fill="${QUADER}" opacity=".7"/>`;
  /* Westseite (Schmalseite links, Sonne von links → hell) mit Giebel */
  k += `<path d="M${x0 - 10} ${fuss - 8} L${x0 - 10} ${traufe + 1} L${x0} ${traufe} L${x0} ${fuss - 8} Z" fill="${S.lg("westseite", [[0, "#fffef9"], [1, "#f1eadc"]])}"/>`;
  k += `<path d="M${x0 - 10.6} ${traufe + 1.2} L${x0 - 5} ${first + 1} L${x0 + 0.4} ${traufe} Z" fill="${S.lg("giebel", [[0, "#fffdf7"], [1, "#efe8da"]])}"/>`;
  for (const y of [100, 110, 121, 132]) k += fenster(x0 - 7.6, y, 2.6, y < 105 ? 6 : 4.6, 1);
  /* Südseite: zwei Baukörper im flachen Winkel (der östliche etwas gedreht → dunkler) */
  k += `<rect x="${x0}" y="${traufe}" width="${knick - x0}" height="${fuss - 8 - traufe}" fill="${KALK}"/>`;
  k += `<path d="M${knick} ${traufe - 0.6} L${x1} ${traufe - 1.6} L${x1} ${fuss - 8} L${knick} ${fuss - 8} Z" fill="${KALK_OST}"/>`;
  k += `<path d="M${x0} ${traufe} L${knick} ${traufe} L${knick} ${fuss - 8} L${x0} ${fuss - 8} Z M${knick} ${traufe - 0.6} L${x1} ${traufe - 1.6} L${x1} ${fuss - 8} L${knick} ${fuss - 8} Z" fill="${QUADER}" opacity=".55"/>`;
  k += `<line x1="${knick}" y1="${traufe - 0.6}" x2="${knick}" y2="${fuss - 8}" stroke="#cfc7b5" stroke-width=".5"/>`;
  /* Geschossgesimse und Lisenen */
  for (const y of [134, 124.4, 113.8, 104.2]) k += `<path d="M${x0} ${y} L${knick} ${y} L${x1} ${r(y - 1)}" stroke="#d3cab7" stroke-width=".6" fill="none"/>`;
  for (const x of [x0 + 0.6, 200, knick - 0.6, 242]) k += `<rect x="${x - 0.5}" y="${traufe}" width="1" height="${fuss - 8 - traufe}" fill="#fff" opacity=".35"/>`;
  /* Fenster: unten gekuppelt, Königswohnung dreiteilig, oben links Thronsaal hoch, rechts Sängersaal */
  for (let i = 0; i < 4; i++) {
    const fx = x0 + 4 + i * 10.4;
    k += fenster(fx, 136.2, 4, 4.6, 2) + fenster(fx, 126.4, 4, 5.8, 2) + fenster(fx - 0.6, 115.8, 5.2, 6.6, 3, true);
  }
  for (let i = 0; i < 4; i++) {
    const fx = knick + 4 + i * 9.6, dy = -i * 0.25;
    k += fenster(fx, r(136 + dy), 4, 4.6, 2) + fenster(fx, r(126.2 + dy), 4, 5.8, 2) + fenster(fx - 0.6, r(115.6 + dy), 5.2, 6.6, 3, true);
  }
  for (let i = 0; i < 4; i++) k += fenster(x0 + 4.4 + i * 10.4, 95.6, 3.4, 8, 2, true);
  for (let i = 0; i < 4; i++) k += fenster(knick + 3 + i * 9.6, r(96 - i * 0.25), 7, 7.2, 3, true);
  /* Unten im Sockel kleine Fenster */
  for (let i = 0; i < 6; i++) k += `<rect x="${r(x0 - 4 + i * 13.6)}" y="${fuss - 6}" width="1.6" height="2.4" rx=".6" fill="${GLAS}"/>`;
  /* Dach: zwei hohe Satteldächer, Gauben, Kamine */
  k += `<path d="M${x0 - 0.6} ${traufe + 0.4} L${x0 - 5} ${first + 1} L${knick + 1} ${first + 1} L${knick + 1} ${traufe - 0.4} Z" fill="${SCHIEFER}"/>`;
  k += `<path d="M${x0 - 0.6} ${traufe + 0.4} L${x0 - 5} ${first + 1} L${x0 - 4} ${first + 1} L${x0 + 0.6} ${traufe + 0.2} Z" fill="#a6afba"/>`;
  k += `<path d="M${knick - 0.6} ${traufe - 0.4} L${knick + 1.6} ${first} L${x1 - 2} ${first - 0.8} L${x1 + 0.6} ${traufe - 1.4} Z" fill="${S.lg("schiefer2", [[0, "#727b88"], [1, "#454c57"]])}"/>`;
  k += `<path d="M${x0 - 5} ${first + 1} L${knick + 1} ${first + 1}" stroke="#a9b2bc" stroke-width=".6"/><path d="M${knick + 1.6} ${first} L${x1 - 2} ${first - 0.8}" stroke="#a9b2bc" stroke-width=".6"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${r(x0 + 2 + i * 22)} ${r(first + 4 + i * 0.1)} L${r(x0 + 50 + i * 3)} ${r(first + 4)}" stroke="#58606b" stroke-width=".2" opacity=".0"/>`;
  for (let i = 0; i < 7; i++) {
    const gx = x0 + 5 + i * 11.6;
    k += `<path d="M${r(gx)} ${r(traufe - 4)} L${r(gx)} ${r(traufe - 7.4)} L${r(gx + 2)} ${r(traufe - 9)} L${r(gx + 4)} ${r(traufe - 7.4)} L${r(gx + 4)} ${r(traufe - 4)} Z" fill="#ece7db"/><rect x="${r(gx + 1.2)}" y="${r(traufe - 7.2)}" width="1.6" height="2.6" fill="${GLAS}"/>`;
  }
  for (let i = 0; i < 4; i++) { const gx = x0 + 10 + i * 19; k += `<path d="M${r(gx)} ${r(first + 9)} L${r(gx)} ${r(first + 7)} L${r(gx + 1.4)} ${r(first + 6)} L${r(gx + 2.8)} ${r(first + 7)} L${r(gx + 2.8)} ${r(first + 9)} Z" fill="#e2ddd1"/>`; }
  k += `<path d="M${x0} ${traufe} L${knick} ${traufe} L${x1} ${traufe - 1} L${x1} ${traufe + 2} L${knick} ${traufe + 3} L${x0} ${traufe + 3} Z" fill="${S.lg("traufschatten", [[0, "#6a6458", 0.35], [1, "#6a6458", 0]])}"/>`;
  k += `<path d="M${x0 - 10.6} ${traufe + 1.2} L${x0 - 5} ${first + 1} L${x0 + 0.4} ${traufe}" stroke="#d9d2c3" stroke-width=".6" fill="none"/>`;
  /* Ritterfigur auf dem Westgiebel */
  k += `<path d="M${x0 - 5.4} ${first + 1} l0 -2.6 l.8 -.3 l.2 -1.1 l.5 0 l.2 1.1 l.6 .4 l0 2.5 Z" fill="#4c6a62"/><path d="M${x0 - 3.7} ${first - 2.8} l1.4 -2" stroke="#4c6a62" stroke-width=".3"/>`;
  for (const x of [196, 244]) k += `<rect x="${x}" y="${first - 3}" width="2" height="5" fill="#e3ddcf"/><rect x="${x - 0.4}" y="${first - 3.6}" width="2.8" height=".9" fill="#c9c2b2"/>`;
  /* Ecktürmchen: Nordwestecke (hinten), Südwestecke und Südostecke */
  k += tuermchen(x0 - 10.4, 92, 80, 3.6, 13, { fenster: [84] });
  k += tuermchen(x0 + 0.8, 108, 82, 4.4, 17, { konsole: true, fenster: [87, 96] });
  k += tuermchen(x1 - 1, 106, 80, 4.6, 17, { konsole: true, fenster: [85, 94] });
  /* südlicher Treppenturm (niedriger) am Knick */
  k += tuermchen(knick - 3, first + 4, 61, 5.6, 13, { fenster: [64, 69] });
  /* NORDTURM: über 65 m, schlank, Treppenfenster, Galerie, hoher Helm */
  {
    const cx = 236, w = 8, hals = 54;
    k += `<rect x="${cx - w / 2}" y="${hals}" width="${w}" height="${first + 6 - hals}" fill="${KALK_RUND}"/>`;
    for (let i = 0; i < 5; i++) k += `<path d="M${r(cx - 2.6 + (i % 3) * 2.2)} ${r(hals + 5 + i * 2.6)} v-1.4 a.45 .45 0 0 1 .9 0 v1.4 Z" fill="${GLAS}"/>`;
    k += `<path d="M${cx - w / 2 - 1.2} ${hals} L${cx + w / 2 + 1.2} ${hals} L${cx + w / 2} ${hals + 2.2} L${cx - w / 2} ${hals + 2.2} Z" fill="#e3ddd0"/>`;
    for (let i = 0; i < 6; i++) k += `<path d="M${r(cx - w / 2 - 0.6 + i * 1.8)} ${hals + 2.2} q.5 1 1 0" fill="#cfc8b8"/>`;
    k += `<rect x="${cx - w / 2 - 0.8}" y="${hals - 4.6}" width="${w + 1.6}" height="4.6" fill="${KALK_RUND}"/>`;
    for (let i = 0; i < 4; i++) k += `<path d="M${r(cx - 3.5 + i * 2.1)} ${hals - 0.6} L${r(cx - 3.5 + i * 2.1)} ${hals - 3.2} A.6 .6 0 0 1 ${r(cx - 2.3 + i * 2.1)} ${hals - 3.2} L${r(cx - 2.3 + i * 2.1)} ${hals - 0.6} Z" fill="${GLAS}"/>`;
    k += `<path d="M${cx - w / 2 - 1.4} ${hals - 4.2} Q${cx - 2} ${hals - 12} ${cx} ${hals - 21} Q${cx + 2} ${hals - 12} ${cx + w / 2 + 1.4} ${hals - 4.2} Z" fill="${SCHIEFER_RUND}"/>`;
    k += `<path d="M${cx - w / 2 - 0.8} ${hals - 4.6} Q${cx - 2.6} ${hals - 12} ${cx - 0.2} ${hals - 20} L${cx - 1.6} ${hals - 4.6} Z" fill="#b8c0ca" opacity=".45"/>`;
    k += `<line x1="${cx}" y1="${hals - 21}" x2="${cx}" y2="${hals - 26}" stroke="#9a7a2a" stroke-width=".35"/><circle cx="${cx}" cy="${hals - 23}" r=".6" fill="${GOLD}"/>`;
  }
  /* --- DER BALKON (Söller vor dem Thronsaal, über zwei Geschosse) --- */
  {
    const bx = x0 - 19, by = 108;
    k += `<path d="M${bx} ${by} L${x0 - 10} ${by - 1} L${x0 - 10} ${by + 18} L${bx} ${by + 17} Z" fill="${S.lg("soeller", [[0, "#fffef8"], [1, "#ebe4d4"]])}"/>`;
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) k += `<path d="M${r(bx + 1.2 + j * 2.7)} ${r(by + 7 + i * 8.4)} L${r(bx + 1.2 + j * 2.7)} ${r(by + 2.6 + i * 8.4)} A.9 .9 0 0 1 ${r(bx + 3 + j * 2.7)} ${r(by + 2.6 + i * 8.4)} L${r(bx + 3 + j * 2.7)} ${r(by + 7 + i * 8.4)} Z" fill="#566272"/>`;
    k += `<rect x="${bx - 0.6}" y="${by - 1.2}" width="${x0 - 10 - bx + 0.8}" height="1.2" fill="#e4ddcd"/><rect x="${bx - 0.6}" y="${by + 7.6}" width="${x0 - 10 - bx + 0.8}" height="1" fill="#e4ddcd"/>`;
    for (let j = 0; j < 8; j++) k += `<rect x="${r(bx + 0.2 + j * 1.15)}" y="${by - 3.2}" width=".5" height="2" fill="#efe9dc"/>`;
    k += `<rect x="${bx - 0.6}" y="${by - 3.6}" width="${x0 - 10 - bx + 0.8}" height=".6" fill="#e4ddcd"/>`;
    k += `<path d="M${bx} ${by + 17} Q${bx + 4} ${by + 23} ${x0 - 10} ${by + 18}" fill="#ddd5c4"/>`;
  }
  /* Hofmauer mit Zinnen zum Viereckturm */
  k += `<rect x="290" y="141" width="10" height="13" fill="${KALK}"/>`;
  for (let x = 290; x < 300; x += 2.2) k += `<rect x="${x}" y="139.4" width="1.3" height="1.8" fill="${KALK}"/>`;
  /* Sonne von links: Eigenschatten rechts an den Vorsprüngen, Schlagschatten am Fuß */
  k += `<path d="M${x0 - 11} ${fuss + 3} L300 155 L300 157 L${x0 - 8} ${fuss + 5} Z" fill="#5e5442" opacity=".22"/>`;
  S.teil({ id: "neuschwanstein", de: "das Schloss Neuschwanstein", syl: "SCHLOSS neu-SCHWAN-stein", it: "il castello di Neuschwanstein", itSyl: "ca-STEL-lo di noi-SCHWAN-stain", en: "Neuschwanstein Castle",
    x: 0, y: 0, kunst: k, tipp: "König Ludwig II. ließ das Schloss ab 1869 bauen – wie eine Ritterburg aus dem Märchen.",
    zoom: { x: 152, y: 30, w: 150, h: 100 },
    unter: [
      { id: "palas", de: "der Palas", syl: "PA-las", it: "il palazzo", itSyl: "pa-LAZ-zo", en: "great hall", x: 200, y: 144, kunst: flaeche(-22, -30, 60, 30),
        tipp: "Der Palas ist das Hauptgebäude: fünf Stockwerke, außen heller Kalkstein." },
      { id: "dach", de: "das Dach", syl: "DACH", it: "il tetto", itSyl: "TET-to", en: "roof", x: 200, y: 93, kunst: flaeche(-20, -21, 56, 18),
        tipp: "Die Dächer und Turmhelme sind mit grauem Schiefer gedeckt." },
      { id: "kemenate", de: "die Kemenate", syl: "ke-me-NA-te", it: "la camera delle dame", itSyl: "CA-me-ra DEL-le DA-me", en: "bower", x: 274, y: 153, kunst: flaeche(-13, -48, 26, 47),
        tipp: "Die Kemenate war als Haus für die Damen gedacht." },
      { id: "turm", de: "der Turm", syl: "TURM", it: "la torre", itSyl: "TOR-re", en: "tower", x: 236, y: 76, kunst: flaeche(-6, -48, 12, 30),
        tipp: "Der Nordturm ist über 65 Meter hoch – das höchste Bauwerk des Schlosses." },
      { id: "balkon", de: "der Balkon", syl: "bal-KON", it: "il balcone", itSyl: "bal-CO-ne", en: "balcony", x: 164, y: 126, kunst: flaeche(-5.6, -22, 11.2, 24),
        tipp: "Vom Balkon vor dem Thronsaal sieht man hinunter zum Alpsee." },
      { id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: 241, y: 103.8, kunst: flaeche(-18, -9, 38, 9.4),
        tipp: "Hinter diesen Bogenfenstern liegt der Sängersaal, der größte Raum des Schlosses." },
    ] });
}

/* =====================================================================
   11 — DER VIERECKTURM (45 m, Plattform mit Rundtürmchen)
   ===================================================================== */
{
  let k = "";
  const x0 = 300, x1 = 314, top = 82, fuss = 156;
  k += `<rect x="${x0}" y="${top}" width="${x1 - x0 - 3}" height="${fuss - top}" fill="${KALK}"/><rect x="${x0}" y="${top}" width="${x1 - x0 - 3}" height="${fuss - top}" fill="${QUADER}" opacity=".5"/>`;
  k += `<rect x="${x1 - 3}" y="${top}" width="3" height="${fuss - top}" fill="${KALK_SCHATTEN}"/>`;
  for (const y of [94, 106, 118, 130, 142]) k += fenster(x0 + 3.2, y, 3.6, 5, 2) + `<rect x="${x0}" y="${y + 6.6}" width="${x1 - x0}" height=".45" fill="#d8d0be"/>`;
  k += `<rect x="${x0 - 1}" y="${top - 2}" width="${x1 - x0 + 2}" height="2.4" fill="#ece6d8"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${r(x0 - 0.6 + i * 2.6)} ${top + 0.4} q.6 1.2 1.2 0" fill="#cfc8b8"/>`;
  for (let x = x0 - 1; x < x1 + 0.6; x += 2.4) k += `<rect x="${r(x)}" y="${top - 4.4}" width="1.4" height="2.6" fill="${x > x1 - 3 ? "#cfd2d9" : "#f4efe3"}"/>`;
  k += tuermchen(x0 + 5.6, top - 2, top - 12, 4.2, 10, { fenster: [top - 9] });
  S.teil({ id: "viereckturm", de: "der Viereckturm", syl: "VIER-eck-turm", it: "la torre quadrata", itSyl: "TOR-re qua-DRA-ta", en: "square tower", x: 0, y: 0, kunst: k,
    tipp: "Der Viereckturm ist 45 Meter hoch. Oben ist eine Aussichtsplattform." });
}

/* =====================================================================
   12 — DAS TORHAUS (Torbau aus roten Ziegeln, Flankiertürme)
   ===================================================================== */
{
  let k = "";
  const x0 = 318, x1 = 382, traufe = 128, fuss = 160;
  k += `<rect x="${x0}" y="${traufe}" width="${x1 - x0}" height="${fuss - traufe}" fill="url(#${S.id("zv")})"/>`;
  k += `<rect x="${x0}" y="${traufe}" width="${x1 - x0}" height="${fuss - traufe}" fill="${S.lg("ziegellicht", [[0, "#ffd9b0", 0.18], [1, "#3a1408", 0.15]], 0, 0, 1, 0)}"/>`;
  for (const y of [138, 148]) k += `<rect x="${x0}" y="${y}" width="${x1 - x0}" height=".9" fill="#ead9bb"/>`;
  for (let i = 0; i < 6; i++) {
    const fx = x0 + 4 + i * 9.6;
    for (const y of [130.6, 140.6]) k += `<rect x="${r(fx - 0.6)}" y="${r(y - 0.8)}" width="5.4" height="7" rx=".4" fill="#ecdcbf"/>` + fenster(fx, y, 4.2, 5.6, 2);
  }
  k += `<rect x="${x0}" y="150" width="${x1 - x0}" height="10" fill="#9c4632"/><rect x="${x0}" y="150" width="${x1 - x0}" height="10" fill="url(#${S.id("zv")})" opacity=".5"/>`;
  for (let i = 0; i < 5; i++) k += `<rect x="${r(x0 + 6 + i * 11)}" y="153" width="1.2" height="3" fill="#4a2a20"/>`;
  k += `<path d="M${x0 - 1} ${traufe + 0.4} L${x0 + 5} 116 L${x1 - 6} 116 L${x1 + 1} ${traufe + 0.4} Z" fill="${SCHIEFER}"/>`;
  k += `<path d="M${x0 + 5} 116 L${x1 - 6} 116" stroke="#a3acb7" stroke-width=".5"/>`;
  for (const x of [330, 344, 358]) k += `<path d="M${x} ${traufe - 1} L${x} ${traufe - 4} L${x + 2} ${traufe - 5.4} L${x + 4} ${traufe - 4} L${x + 4} ${traufe - 1} Z" fill="#b8573c"/><rect x="${x + 1.2}" y="${traufe - 3.8}" width="1.6" height="2.2" fill="${GLAS}"/>`;
  k += tuermchen(390.5, 152, 122, 7.4, 12, { ziegel: true, fenster: [128, 138] });
  k += tuermchen(381, 160, 124, 9, 13, { ziegel: true, fenster: [130, 140, 150] });
  S.teil({ id: "torhaus", de: "das Torhaus", syl: "TOR-haus", it: "l'edificio d'ingresso", itSyl: "e-di-FI-cio d'in-GRES-so", en: "gatehouse", x: 0, y: 0, kunst: k,
    tipp: "Das Torhaus ist außen aus roten Ziegeln. Durch sein Tor betritt man das Schloss." });
}

/* =====================================================================
   13 — DIE SCHLUCHT (Pöllatschlucht unter der Brücke)
   ===================================================================== */
const SCHLUCHT = [[0, 262], [0, 224], [40, 220], [96, 214], [140, 212], [184, 206], [214, 204], [240, 212], [268, 226], [292, 240], [304, 262]];
{
  let k = `<path d="${pfad(SCHLUCHT)}" fill="${S.lg("schluchtgrund", [[0, "#3e3f37"], [1, "#1a1b17"]])}"/>`;
  /* Westhang (links): steiler Wald mit Felsrippen, nach unten dunkler */
  const WH = [[0, 262], [0, 224], [40, 220], [96, 214], [140, 212], [184, 206], [182, 222], [172, 240], [164, 262]];
  k += waldflaeche("whclip", WH, 1.1, 18, "#4e4224", 0.7);
  k += `<path d="${pfad(WH)}" fill="${S.lg("whdunkel", [[0, "#000", 0.05], [1, "#0a0a06", 0.55]])}"/>`;
  /* Osthang (rechts): Kalkwand im Schatten mit Bändern und Moos */
  const OH = [[214, 204], [240, 212], [268, 226], [292, 240], [304, 262], [246, 262], [236, 236], [224, 216]];
  k += `<path d="${pfad(OH)}" fill="${S.lg("wando", [[0, "#6e675a"], [1, "#3a362f"]], 0, 0, 1, 0)}"/>`;
  for (const [x1, y1, x2, y2] of [[224, 214, 262, 228], [232, 232, 280, 244], [238, 248, 292, 256]]) k += `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${y1 - 2} ${x2} ${y2}" stroke="#8b8372" stroke-width=".7" fill="none" opacity=".6"/>`;
  for (const [x, y] of [[250, 222], [270, 242], [236, 228], [258, 252], [284, 252]]) k += `<ellipse cx="${x}" cy="${y}" rx="3" ry="1.3" fill="#3f5c34" opacity=".9"/><ellipse cx="${x - 1}" cy="${y - 0.4}" rx="1.3" ry=".5" fill="#7d9a52" opacity=".7"/>`;
  /* Bachbett unten: Gumpe, nasse Felsen, Dunst */
  k += `<path d="M176 254 Q194 247 214 250 Q226 256 218 262 L172 262 Q166 258 176 254 Z" fill="${S.lg("gumpe", [[0, "#78aaae"], [1, "#2b5a62"]])}"/>`;
  k += `<ellipse cx="170" cy="257" rx="4" ry="1.6" fill="#5a574e"/><ellipse cx="224" cy="258" rx="5" ry="1.8" fill="#4e4b43"/>`;
  k += `<path d="M150 236 Q200 226 250 236 L250 248 Q200 240 150 248 Z" fill="#dfe8ea" opacity=".14" filter="url(#${S.id("gischt")})"/>`;
  S.teil({ id: "schlucht", de: "die Schlucht", syl: "SCHLUCHT", it: "la gola", itSyl: "GO-la", en: "gorge", x: 0, y: 0, kunst: k,
    tipp: "Der Bach Pöllat hat diese tiefe Schlucht in den Kalkfels gegraben." });
}
/* =====================================================================
   14 — DER WASSERFALL (Pöllatfall: Kaskade, dann freier Fall)
   ===================================================================== */
{
  let k = "";
  const W = (y) => 194 + (y - 210) * 0.04;   /* Mitte des Falls */
  k += `<path d="M187 208 Q194 205 203 207 L204 216 Q196 214 188 216 Z" fill="#e8f3f6"/><path d="M186 216 Q186 212 188 210 L188 216 Z M203 210 Q205 213 205 218 L203 216 Z" fill="#cfe2ea"/>`;
  k += `<path d="M188 216 Q196 214 204 216 Q206 236 208.4 253 Q198 256 185.4 253 Q186.6 236 188 216 Z" fill="${S.lg("fall", [[0, "#cfe4ec", 0.95], [0.3, "#ffffff", 0.98], [0.7, "#e6f2f6", 0.95], [1, "#b9d6e0", 0.9]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 12; i++) {
    const x = 188.6 + i * 1.35, y0 = 216 + rnd() * 6;
    k += `<path d="M${r(x)} ${r(y0)} Q${r(x + 0.3)} 238 ${r(x - 0.6 + rnd() * 1.2 + (i - 6) * 0.15)} ${r(250 + rnd() * 3)}" stroke="${i % 3 === 0 ? "#9fc4d2" : "#ffffff"}" stroke-width="${r(0.25 + rnd() * 0.35)}" opacity=".85" fill="none"/>`;
  }
  k += `<path d="M189 208 Q195 206 202 207.6" stroke="#fff" stroke-width=".6" fill="none"/>`;
  k += `<ellipse cx="197" cy="254" rx="15" ry="5.6" fill="#f2f8fa" opacity=".9" filter="url(#${S.id("gischt")})"/>`;
  k += `<ellipse cx="197" cy="249" rx="8" ry="3.4" fill="#ffffff" opacity=".9" filter="url(#${S.id("gischt")})"/>`;
  void W;
  S.teil({ id: "wasserfall", de: "der Wasserfall", syl: "WAS-ser-fall", it: "la cascata", itSyl: "ca-SCA-ta", en: "waterfall", x: 0, y: 0, kunst: k,
    tipp: "Unter der Marienbrücke stürzt der Pöllatfall in die Tiefe." });
}

/* =====================================================================
   15 — DIE FICHTE (an der Ostwand der Schlucht)
   ===================================================================== */
{
  const X = 270, Y = 232;
  let k = `<rect x="-1" y="-16" width="2" height="16" fill="#4a3424"/>`;
  for (let i = 0; i < 9; i++) {
    const y = -10 - i * 7.2, w = 14 - i * 1.4;
    k += `<path d="M${r(-w)} ${r(y + 4)} Q${r(-w * 0.5)} ${r(y + 1)} 0 ${r(y - 6)} Q${r(w * 0.5)} ${r(y + 1)} ${r(w)} ${r(y + 4)} Q${r(w * 0.4)} ${r(y + 2.4)} 0 ${r(y + 3.4)} Q${r(-w * 0.4)} ${r(y + 2.4)} ${r(-w)} ${r(y + 4)} Z" fill="${i % 2 ? "#2f4b33" : "#26402c"}"/>`;
    k += `<path d="M${r(-w * 0.9)} ${r(y + 3.4)} Q${r(-w * 0.5)} ${r(y + 0.6)} ${r(-1)} ${r(y - 4.6)}" stroke="#6f8f5c" stroke-width=".5" fill="none" opacity=".7"/>`;
  }
  k += `<path d="M0 -80 L0 -86" stroke="#26402c" stroke-width="1"/>`;
  S.teil({ id: "fichte", de: "die Fichte", syl: "FICH-te", it: "l'abete rosso", itSyl: "a-BE-te ROS-so", en: "spruce", x: X, y: Y, steht: true, kunst: k,
    tipp: "Die Fichte ist ein Nadelbaum. Sie bleibt auch im Winter grün." });
}

/* =====================================================================
   16 — DIE BRÜCKE (Marienbrücke: eisernes Gitter über der Schlucht)
   ===================================================================== */
const BR = { fern: { x: -4, o: 186, u: 202 }, nah: { x: 300, o: 214, u: 236 } };
{
  const { fern, nah } = BR;
  const at = (t) => ({ x: fern.x + (nah.x - fern.x) * t, o: fern.o + (nah.o - fern.o) * t, u: fern.u + (nah.u - fern.u) * t });
  let k = "";
  /* Unterseite: Längsträger und Querträger (dunkel, im Schatten) */
  k += `<path d="M${fern.x} ${fern.u} L${nah.x} ${nah.u} L${nah.x} ${nah.u + 6} L${fern.x} ${fern.u + 2.6} Z" fill="${S.lg("traeger", [[0, "#3a3e42"], [1, "#1c1f22"]])}"/>`;
  for (let t = 0.04; t < 1; t += 0.06 + t * 0.03) { const p = at(t); k += `<path d="M${r(p.x)} ${r(p.u)} L${r(p.x)} ${r(p.u + 2.4 + t * 3.4)}" stroke="#15181a" stroke-width="${r(0.3 + t * 0.5)}"/>`; }
  /* Gitterwerk: Pfosten und Diagonalen (perspektivisch dichter nach hinten) */
  const ts = [];
  for (let t = 0; t <= 1.001; t += 0.03 + t * 0.045) ts.push(Math.min(t, 1));
  let g = "";
  for (let i = 0; i < ts.length; i++) {
    const p = at(ts[i]);
    g += `M${r(p.x)} ${r(p.o)} L${r(p.x)} ${r(p.u)} `;
    if (i < ts.length - 1) { const q = at(ts[i + 1]); g += `M${r(p.x)} ${r(p.o)} L${r(q.x)} ${r(q.u)} M${r(p.x)} ${r(p.u)} L${r(q.x)} ${r(q.o)} `; }
  }
  k += `<path d="${g}" stroke="#2a2e32" stroke-width=".75" fill="none"/>`;
  /* Ober- und Untergurt, Handlauf mit Lichtkante, Bohlenkante */
  k += `<path d="M${fern.x} ${fern.o} L${nah.x} ${nah.o} L${nah.x} ${nah.o + 3} L${fern.x} ${fern.o + 1.4} Z" fill="${S.lg("gurt", [[0, "#4a5056"], [1, "#24282c"]])}"/>`;
  k += `<path d="M${fern.x} ${fern.o} L${nah.x} ${nah.o}" stroke="#a3abb2" stroke-width=".5"/>`;
  k += `<path d="M${fern.x} ${fern.u} L${nah.x} ${nah.u} L${nah.x} ${nah.u - 2.6} L${fern.x} ${fern.u - 1.2} Z" fill="#2a2e32"/>`;
  k += `<path d="M${fern.x} ${fern.u + 0.2} L${nah.x} ${nah.u + 0.4}" stroke="#8a6a48" stroke-width=".7"/>`;
  /* Brückenkopf: Widerlager aus Beton auf dem Fels */
  k += `<path d="M${nah.x - 2} ${nah.o - 2} L${nah.x + 12} ${nah.o} L${nah.x + 14} 262 L${nah.x - 8} 262 Z" fill="${S.lg("widerlager", [[0, "#c2bcb0"], [1, "#8f897d"]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "bruecke", de: "die Brücke", syl: "BRÜ-cke", it: "il ponte", itSyl: "PON-te", en: "bridge", x: 0, y: 0, kunst: k,
    tipp: "Die Marienbrücke hängt etwa 90 Meter über dem Wasserfall. Von hier hat man den schönsten Blick auf das Schloss." });
}

/* =====================================================================
   17 — DIE BUCHE (golden, am Brückenkopf rechts)
   ===================================================================== */
{
  const X = 378, Y = 248;
  let k = `<path d="M-3 0 Q-2 -24 -6 -46 L-2 -46 Q2 -24 4 0 Z" fill="${S.lg("buchenstamm", [[0, "#8f9294"], [0.4, "#c8cac8"], [1, "#6f7274"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-2 -34 Q-12 -46 -20 -54 M0 -40 Q8 -54 14 -62 M-4 -46 Q-6 -58 -2 -70" stroke="#7d8082" stroke-width="1.4" fill="none"/>`;
  const kronen = [[-16, -58, 13, 9], [2, -68, 16, 11], [-4, -80, 13, 9], [12, -54, 10, 8], [-22, -46, 8, 6], [8, -82, 9, 6]];
  for (const [cx, cy, rx, ry] of kronen) {
    k += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${S.rg("buchenkrone", [[0, "#f6cf62"], [0.6, "#dea034"], [1, "#a8661c"]], 0.35, 0.3, 0.75)}"/>`;
    for (let i = 0; i < 22; i++) { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()), ex = r(cx + Math.cos(a) * rx * d), ey = r(cy + Math.sin(a) * ry * d); k += `<ellipse cx="${ex}" cy="${ey}" rx="1.1" ry=".7" fill="${["#f8dc7a", "#e9b040", "#d08a28", "#c06a1e"][Math.floor(rnd() * 4)]}" transform="rotate(${Math.round(rnd() * 180)} ${ex} ${ey})"/>`; }
  }
  S.teil({ id: "buche", de: "die Buche", syl: "BU-che", it: "il faggio", itSyl: "FAG-gio", en: "beech", x: X, y: Y, steht: true, kunst: k,
    tipp: "Im Oktober leuchten die Blätter der Buchen golden." });
}

/* =====================================================================
   18 — DIE INFOTAFEL am Brückenkopf (Porträt König Ludwigs II.)
        Lupe: der König
   ===================================================================== */
{
  const X = 352, Y = 256;
  /* Weg am Brückenkopf: Kies und Fels */
  let k = `<path d="M-60 6 Q-58 -10 -44 -14 Q-10 -18 20 -16 Q40 -16 52 -18 L52 6 Z" fill="${S.lg("weg", [[0, "#bfb39a"], [1, "#8f8470"]])}"/>`;
  for (let i = 0; i < 34; i++) k += `<ellipse cx="${r(-54 + rnd() * 104)}" cy="${r(-12 + rnd() * 16)}" rx="${r(0.6 + rnd())}" ry="${r(0.3 + rnd() * 0.4)}" fill="${rnd() < 0.5 ? "#dcd2bc" : "#776d5c"}"/>`;
  k += schatten(0, -1, 16, 1.4, 0.3);
  for (const x of [-11, 11]) k += `<rect x="${x - 1.1}" y="-34" width="2.2" height="33" fill="${S.lg("pfosten", [[0, "#7a5636"], [0.5, "#a07448"], [1, "#5e3f26"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-18 -40 L18 -40 L20 -36.6 L-20 -36.6 Z" fill="#5e3f26"/>`;
  k += `<rect x="-16" y="-36.4" width="32" height="22" rx=".6" fill="#3e2a1a"/><rect x="-15" y="-35.4" width="30" height="20" fill="${S.lg("tafel", [[0, "#f6efe0"], [1, "#e6dcc6"]])}"/>`;
  k += `<rect x="-15" y="-35.4" width="30" height="3.4" fill="#1f4f8f"/><text x="0" y="-32.8" font-size="2.3" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-weight="bold">Marienbrücke</text>`;
  /* Porträt: dunkles, gewelltes Haar, blaue Uniform mit Orden, Hermelinkragen */
  const px = -9.4;
  k += `<rect x="${px - 4.8}" y="-30.6" width="9.6" height="13" fill="#2b2f3a"/>`;
  k += `<path d="M${px - 4.8} -17.6 Q${px - 4.8} -22 ${px} -22.6 Q${px + 4.8} -22 ${px + 4.8} -17.6 Z" fill="#1d2a4a"/><path d="M${px - 2.6} -18.6 L${px} -21.4 L${px + 2.6} -18.6" stroke="#f2ede2" stroke-width=".8" fill="none"/><circle cx="${px + 1.6}" cy="-19.4" r=".45" fill="#d8b04a"/>`;
  k += `<rect x="${px - 0.6}" y="-23.6" width="1.2" height="1.4" fill="#e8c4a2"/><ellipse cx="${px}" cy="-25.4" rx="2.1" ry="2.6" fill="#ecc8a6"/>`;
  k += `<path d="M${px - 2.3} -25.6 Q${px - 2.8} -29.2 ${px} -29.2 Q${px + 2.8} -29.2 ${px + 2.4} -25.6 Q${px + 2} -27.4 ${px} -27.6 Q${px - 1.8} -27.4 ${px - 2.3} -25.6 Z" fill="#2a1a12"/>`;
  k += `<circle cx="${px - 0.7}" cy="-25.6" r=".22" fill="#2a3a5a"/><circle cx="${px + 0.7}" cy="-25.6" r=".22" fill="#2a3a5a"/><path d="M${px - 0.6} -24.2 q.6 .3 1.2 0" stroke="#9a5a4a" stroke-width=".2" fill="none"/>`;
  k += `<rect x="${px - 4.8}" y="-30.6" width="9.6" height="13" fill="none" stroke="#c9a640" stroke-width=".4"/>`;
  k += `<text x="${px}" y="-16" font-size="1.4" text-anchor="middle" fill="#3a2a1a" font-family="Georgia,serif">Ludwig II.</text>`;
  for (let i = 0; i < 5; i++) k += `<rect x="-3" y="${-30 + i * 2}" width="${i === 4 ? 9 : 16}" height=".6" fill="#8a7e6a"/>`;
  k += `<rect x="-3" y="-20" width="16" height="4.2" fill="#c9d8b4"/><path d="M-2 -17 Q2 -19.6 6 -17.6 Q9 -16 12 -18.4" stroke="#5d8fa0" stroke-width=".6" fill="none"/><circle cx="9" cy="-18.6" r=".6" fill="#b8473a"/>`;
  S.teil({ id: "infotafel", de: "die Infotafel", syl: "IN-fo-ta-fel", it: "il pannello informativo", itSyl: "pan-NEL-lo in-for-ma-TI-vo", en: "information board", x: X, y: Y, steht: true, kunst: k,
    zoom: { x: X - 24, y: Y - 44, w: 48, h: 32 },
    unter: [
      { id: "koenig", de: "der König", syl: "KÖ-nig", it: "il re", itSyl: "RE", en: "king", x: X + px, y: Y - 17.6, kunst: flaeche(-4.8, -13, 9.6, 13),
        tipp: "König Ludwig II. von Bayern (1845–1886) – man nennt ihn den Märchenkönig." },
    ] });
}

/* =====================================================================
   19 — DER WANDERER (am Brückenkopf, schaut zum Schloss) und
   20 — DER RUCKSACK
   ===================================================================== */
const WAND = { x: 318, y: 254 };
const wanderer = B.mensch({ id: "nsw_wanderer", geschlecht: "m", pose: "stehen", blick: 206, frisur: "kurz", haarfarbe: "braun", haut: "hell",
  kleidung: { oberteil: { stueck: "pullover", farbe: "#c8452e" }, unterteil: { stueck: "hose", farbe: "#4b5560" }, schuhe: { stueck: "stiefel", farbe: "#5a3d26" }, kopf: { stueck: "kappe", farbe: "#2f5a35" } } }, 54);
const WP = (n) => { const q = wanderer.z.punkte[n]; return [q[0] * wanderer.k, q[1] * wanderer.k]; };
{
  let k = wanderer.svg;
  for (const s of ["L", "R"]) {
    const [hx, hy] = WP("hand" + s);
    const fx = hx + (hx > 0 ? 2.4 : -2.4);
    k += `<line x1="${r(hx)}" y1="${r(hy - 1.4)}" x2="${r(fx)}" y2="0" stroke="#3a3f46" stroke-width=".55"/><rect x="${r(hx - 0.5)}" y="${r(hy - 2.4)}" width="1" height="2" rx=".4" fill="#1c1c1c"/>`;
  }
  S.teil({ id: "wanderer", de: "der Wanderer", syl: "WAN-de-rer", it: "l'escursionista", itSyl: "e-scur-sio-NI-sta", en: "hiker", x: WAND.x, y: WAND.y, kunst: k,
    tipp: "Mit Rucksack und Wanderstöcken: Vom Brückenkopf aus macht er das berühmte Foto." });
}
{
  const [sx1, sy1] = WP("schulterL"), [sx2, sy2] = WP("schulterR"), [, ly] = WP("lende");
  const cx = (sx1 + sx2) / 2, top = Math.min(sy1, sy2) - 0.6, w = Math.abs(sx1 - sx2) * 0.82, h = (ly - top) * 0.95;
  let k = `<path d="M${r(cx - w / 2)} ${r(top + h)} L${r(cx - w / 2 - 0.4)} ${r(top + 2)} Q${r(cx - w / 2)} ${r(top - 1)} ${r(cx)} ${r(top - 1.2)} Q${r(cx + w / 2)} ${r(top - 1)} ${r(cx + w / 2 + 0.4)} ${r(top + 2)} L${r(cx + w / 2)} ${r(top + h)} Q${r(cx)} ${r(top + h + 1.2)} ${r(cx - w / 2)} ${r(top + h)} Z" fill="${S.lg("rucksack", [[0, "#3d6a8a"], [0.5, "#4f82a6"], [1, "#2c4f68"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(cx - w * 0.36)} ${r(top + h * 0.55)} h${r(w * 0.72)} v${r(h * 0.36)} h${r(-w * 0.72)} Z" fill="#2f5876" stroke="#20384a" stroke-width=".2"/>`;
  k += `<path d="M${r(cx - w / 2 + 0.6)} ${r(top + 1.6)} Q${r(cx)} ${r(top + 3.6)} ${r(cx + w / 2 - 0.6)} ${r(top + 1.6)}" stroke="#20384a" stroke-width=".3" fill="none"/>`;
  k += `<rect x="${r(cx - w / 2 - 0.6)}" y="${r(top + h * 0.3)}" width="1.2" height="${r(h * 0.5)}" rx=".5" fill="#e8b84a"/>`;
  k += `<path d="M${r(cx - 1)} ${r(top - 1)} q1 -1.6 2 0" stroke="#20384a" stroke-width=".4" fill="none"/>`;
  k += `<path d="M${r(cx - w / 2 + 0.6)} ${r(top + 2)} L${r(cx - w / 2 + 0.6)} ${r(top + h - 1)}" stroke="#fff" stroke-width=".4" opacity=".3"/>`;
  S.teil({ oben: true, id: "rucksack", de: "der Rucksack", syl: "RUCK-sack", it: "lo zaino", itSyl: "ZAI-no", en: "backpack", x: WAND.x, y: WAND.y, kunst: k });
}

/* Licht: warmer Nachmittagsschein von links */
S.davor(`<rect width="400" height="260" fill="${S.lg("abendlicht", [[0, "#ffd9a0", 0.12], [0.5, "#ffd9a0", 0], [1, "#ffd9a0", 0]], 0, 0, 1, 0)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/neuschwanstein.js"));
console.log(aus);
