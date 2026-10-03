#!/usr/bin/env node
/* =====================================================================
   STUTTGART (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (stuttgart.de „Schlossplatz“, „Neues Schloss“,
   „Jubiläumssäule“; Landtag BW zur Dienstflagge; Baubroschüre Neues
   Schloss (Finanzministerium BW); Structurae/LAP „Fernsehturm“;
   Wikipedia Königsbau; Stuttgart-Marketing „Stäffele“, „Karlshöhe“):
   - STANDORT: oben auf dem Kleinen Schlossplatz (Terrasse mit der
     Freitreppe, Südwestecke des Schlossplatzes, Auge ≈ 6 m über dem
     Platz). Blick nach Osten über den Schlossplatz. Echte Reihenfolge von
     links nach rechts (Peilung): KÖNIGSBAU (links, die Kolonnade läuft
     nach Nordnordosten weg, −30° … 17°) — am Ende der Königstraße der
     BAHNHOFSTURM mit dem Mercedes-Stern (26°) — dahinter am Nordhang
     WEINBERGE (Kriegsberg) — MUSIKPAVILLON (zwischen Säule und Königsbau)
     — NEUES SCHLOSS mit dem Ehrenhof (58° … 101°), davor die
     JUBILÄUMSSÄULE (63°) und die Brunnen — ALTES SCHLOSS (131°) — auf dem
     Hohen Bopser der FERNSEHTURM (158°). Weitwinkel-Panorama, die Winkel
     rechts sind gestaucht, ferne Wahrzeichen leicht erhöht.
   - NEUES SCHLOSS (1746–1807, Retti/Guepière/Thouret): Dreiflügelanlage
     um den Ehrenhof, nach Versailles; heller gelblicher Putz mit
     Sandsteingliederung, Balustrade mit Dachfiguren, graue
     Mansarddächer; am Mittelbau Säulen, Dreiecksgiebel mit dem
     württembergischen Wappen, darüber die Kuppel — die Krone darauf wurde
     beim Wiederaufbau durch die große Landesdienstflagge
     (Schwarz-Gold mit Wappen) ersetzt.
   - JUBILÄUMSSÄULE (1841–46, zum 25. Regierungsjubiläum Wilhelms I.):
     Granitschaft 30 m, Sockel mit vier Reliefs und vier sitzenden
     Frauenfiguren an den Ecken, oben die 5 m hohe CONCORDIA (seit 1863).
   - BRUNNEN: zwei gusseiserne Springbrunnen (1863, Wasseralfingen),
     acht Putten stehen für Flüsse Württembergs.
   - MUSIKPAVILLON (1871): Gusseisen, maurisch geschmückte Bögen.
   - KÖNIGSBAU (1856–60, Leins/Knapp): spätklassizistisch, 135 m lange
     Kolonnade mit 34 ionischen Säulen, Läden und Cafés dahinter.
   - ALTES SCHLOSS: Renaissance, runde Ecktürme mit Kegeldächern, heute
     Landesmuseum Württemberg; davor Bäume am Karlsplatz.
   - FERNSEHTURM (1954–56, Leonhardt/Heinle): erster Fernsehturm aus
     Stahlbeton der Welt, 216,6 m; Schaft unten 10,8 m, oben 5,1 m dick;
     Turmkorb mit vier Geschossen 138–150 m, darüber die rot-weiße Antenne;
     steht im Bopserwald.
   - BAHNHOFSTURM (Bonatz, 1920er): kantiger Muschelkalkturm, 56 m, oben
     der sich drehende, leuchtende Mercedes-Stern — Stuttgart ist die
     Stadt von Mercedes-Benz und Porsche.
   - WEINBERGE und STÄFFELE: Stuttgart liegt im Kessel, Reben reichen bis
     in die Innenstadt (rund 400 ha), über 400 Treppen („Stäffele“)
     führen die Hänge hinauf.
   - TYPISCH: Maultaschen (Teigtaschen mit Fleisch und Spinat, hier in
     der Brühe), Linsen mit Spätzle und Saitenwürstle, die schwäbische
     Brezel (dünne Ärmchen, dicker Bauch), ein Viertele Trollinger im
     Henkelglas.
   Licht: Nachmittag, die Sonne steht rechts im Südwesten.
   Maßstab: Platz y = 112 + 1800 / Abstand (Auge 6 m darüber); Terrasse
   y = 112 + 480 / Abstand (Auge 1,6 m), 300 Einheiten je Bogenmaß.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "stuttgart", titel: "Stuttgart", emoji: "🚗", thema: "Deutschland", kuerzel: "stg", fassung: 854 });
const rnd = zufall(1956);
const r = B.r;
const HOR = 112;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation=".45"/></filter>`);
const PUTZ = S.lg("putz", [[0, "#efe2c4"], [0.5, "#e7d6b2"], [1, "#d8c49c"]]);
const PUTZ_S = S.lg("putzs", [[0, "#d9c7a3"], [1, "#c2ae8a"]]);
const STEIN = S.lg("stein", [[0, "#f6efdd"], [1, "#e1d4b6"]]);
const SCHIEFER = S.lg("schiefer", [[0, "#7c8794"], [0.5, "#636f7c"], [1, "#4c5764"]]);
const ZIEGEL = S.lg("ziegel", [[0, "#b9644a"], [0.6, "#9c4f3a"], [1, "#7e3d2d"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff1a8"], [0.4, "#f1c74a"], [1, "#a8770f"]], 0, 0, 1, 1);
const BRONZE = S.lg("bronze", [[0, "#7f9a86"], [0.5, "#55705f"], [1, "#3a5244"]], 0, 0, 1, 0);
const LAUB1 = S.rg("laub1", [[0, "#a6c06e"], [0.55, "#73974a"], [1, "#46682f"]], 0.65, 0.3, 0.75);
const LAUB2 = S.rg("laub2", [[0, "#93b05d"], [0.6, "#618542"], [1, "#3c5b29"]], 0.65, 0.3, 0.75);
const LAUB3 = S.rg("laub3", [[0, "#c7b25c"], [0.6, "#9a8a3e"], [1, "#6b5f2a"]], 0.65, 0.3, 0.75);   /* erstes Herbstlaub */
const LICHT = S.lg("licht", [[0, "#1d2a3a", 0.18], [0.5, "#1d2a3a", 0], [0.6, "#fff4dc", 0], [1, "#fff4dc", 0.25]], 0, 0, 1, 0);
const lichtUeber = (x, y, w, h) => `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${LICHT}"/>`;
const baum = (x, fuss, R, farben) => {
  let g = `<rect x="${r(x - R * 0.07)}" y="${r(fuss - R * 0.9)}" width="${r(R * 0.14)}" height="${r(R * 0.9)}" fill="#6a5a46"/>`;
  const cy = fuss - R * 1.35;
  for (const [dx, dy, s] of [[0, R * 0.2, 0.92], [-R * 0.6, R * 0.3, 0.62], [R * 0.6, R * 0.28, 0.66], [-R * 0.3, -R * 0.3, 0.66], [R * 0.32, -R * 0.34, 0.6], [0, -R * 0.62, 0.48]])
    g += `<circle cx="${r(x + dx)}" cy="${r(cy + dy)}" r="${r(R * 0.62 * s)}" fill="${farben[Math.floor(rnd() * farben.length)]}"/>`;
  g += `<circle cx="${r(x + R * 0.35)}" cy="${r(cy - R * 0.25)}" r="${r(R * 0.22)}" fill="#e2e8a6" opacity=".35"/>`;
  return g;
};

/* =====================================================================
   KULISSE — Himmel, die Hänge des Kessels, Dächer der Stadt
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 8}" fill="${S.lg("himmel", [[0, "#4f86c0"], [0.55, "#91b8dc"], [0.9, "#d6e3ec"], [1, "#efe9dc"]])}"/>`);
S.hinten(`<circle cx="318" cy="22" r="90" fill="${S.rg("sonne", [[0, "#fff6d8", 0.7], [0.35, "#fff1cc", 0.28], [1, "#fff1cc", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[40, 20, 0.9], [150, 14, 1.1], [232, 36, 0.8], [96, 46, 0.55]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".9">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 4.6], [-11, 1.4, 10, 3.6], [11, 1, 12, 4.2], [-3, -3.2, 9, 4.6], [6, -3.6, 7, 4]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `<ellipse cx="${x}" cy="${r(y + 3 * s)}" rx="${r(18 * s)}" ry="${r(2 * s)}" fill="#dde6ee"/></g>`;
  }
  S.hinten(w);
}
/* Osthänge des Kessels (Uhlandshöhe, Gänsheide): Wald oben, Villen in Halbhöhenlage */
{
  let h = `<path d="M90 104 Q120 94 150 92 Q180 90.5 210 92.6 Q236 94 256 90.4 Q276 85 296 81.6 Q306 80.6 314 82 Q318 83 320 84 L320 118 L90 118 Z" fill="${S.lg("hang", [[0, "#7d9268"], [0.5, "#8d9c74"], [1, "#a9ab8c"]])}"/>`;
  for (let i = 0; i < 70; i++) {
    const x = 92 + rnd() * 226, top = x < 256 ? 93 + (x - 150) * (x - 150) / 9000 : 82 + Math.abs(302 - x) * 0.16;
    if (rnd() < 0.55) h += `<circle cx="${r(x)}" cy="${r(top + 1 + rnd() * 3)}" r="${r(1.4 + rnd() * 1.6)}" fill="${rnd() < 0.5 ? "#5f7a4c" : "#6f8857"}" opacity=".9"/>`;
    else h += `<rect x="${r(x)}" y="${r(top + 4 + rnd() * 9)}" width="${r(1.4 + rnd() * 1.6)}" height="${r(1 + rnd() * 1.2)}" fill="${rnd() < 0.5 ? "#e6dccb" : "#d9c4ae"}"/><rect x="${r(x - 0.2)}" y="${r(top + 3.4 + rnd() * 0.1)}" width="0" height="0"/>`;
  }
  S.hinten(`<g filter="url(#${S.id("dunst")})" opacity=".95">${h}</g>`);
  S.hinten(`<rect x="88" y="86" width="232" height="32" fill="${S.lg("hangdunst", [[0, "#dfe7ec", 0.05], [1, "#e4ebee", 0.45]])}"/>`);
}
/* Dächer der Stadt zwischen den Wahrzeichen */
{
  let c = "";
  let x = 52;
  while (x < 320) {
    const w = 4 + rnd() * 7, h = 3 + rnd() * 6;
    const f = ["#cbbfa9", "#bfb6a6", "#d4c8b2", "#b9b0a4"][Math.floor(rnd() * 4)];
    c += `<rect x="${r(x)}" y="${r(117 - h)}" width="${r(w + 0.3)}" height="${r(h + 1.5)}" fill="${f}"/>`;
    c += `<path d="M${r(x - 0.2)} ${r(117 - h)} L${r(x + w / 2)} ${r(117 - h - 2.2)} L${r(x + w + 0.2)} ${r(117 - h)} Z" fill="${rnd() < 0.5 ? "#8f6a5a" : "#77706c"}"/>`;
    x += w;
  }
  S.hinten(`<g filter="url(#${S.id("dunst")})">${c}</g>`);
}

/* Kiesfläche des Schlossplatzes (die Rasenstücke sind Teil „Schlossplatz“) */
S.hinten(`<path d="M0 116.4 L320 116.4 L320 152 L0 152 Z" fill="${S.lg("kies", [[0, "#ddd2bd"], [1, "#d0c3aa"]])}"/>`);

/* =====================================================================
   1 — DER FERNSEHTURM (auf dem Hohen Bopser, rechts)
   ===================================================================== */
{
  let k = "";
  /* Bopserwald um den Fuß */
  for (let i = 0; i < 14; i++) k += `<circle cx="${r(-12 + rnd() * 24)}" cy="${r(1 - rnd() * 3)}" r="${r(1.6 + rnd() * 1.4)}" fill="${rnd() < 0.5 ? "#4f6b40" : "#5f7a4c"}"/>`;
  /* Schaft aus Beton: unten breiter, oben schlanker */
  k += `<path d="M-2.3 0 L-1.15 -53 L1.15 -53 L2.3 0 Z" fill="${S.lg("schaft", [[0, "#9c9d98"], [0.45, "#dcdcd6"], [0.75, "#efeee8"], [1, "#a9aaa5"]], 0, 0, 1, 0)}"/>`;
  for (let y = -6; y > -52; y -= 5) k += `<line x1="${r(-2.3 + (-y / 53) * 1.15)}" y1="${y}" x2="${r(2.3 - (-y / 53) * 1.15)}" y2="${y}" stroke="#8e8f8a" stroke-width=".12" opacity=".6"/>`;
  /* Turmkorb: Trichter, vier Geschosse mit Fensterbändern, Plattform */
  k += `<path d="M-1.2 -53 L-4.3 -55.2 L4.3 -55.2 L1.2 -53 Z" fill="#cfcfc9"/>`;
  k += `<rect x="-4.3" y="-61.6" width="8.6" height="6.4" fill="${S.lg("korb", [[0, "#b9bab5"], [0.6, "#f2f1ec"], [1, "#c6c7c1"]], 0, 0, 1, 0)}"/>`;
  for (const y of [-56.6, -58.2, -59.8]) k += `<rect x="-4.3" y="${y}" width="8.6" height=".9" fill="${S.lg("korbglas", [[0, "#3e5266"], [0.7, "#7b97ae"], [1, "#4a5f73"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-4.7" y="-62.4" width="9.4" height=".9" fill="#e9e8e2"/>`;
  k += `<path d="M-4.6 -62.4 L-4.6 -63.4 M4.6 -62.4 L4.6 -63.4 M-4.6 -63.4 L4.6 -63.4" stroke="#8b8c88" stroke-width=".2"/>`;
  /* Schaft über dem Korb, dann die rot-weiße Antenne */
  k += `<rect x="-.9" y="-66" width="1.8" height="3.6" fill="#dcdbd5"/>`;
  for (let i = 0; i < 8; i++) k += `<rect x="${r(-0.5 + i * 0.03)}" y="${r(-67.8 - i * 2.1)}" width="${r(1 - i * 0.06)}" height="2.1" fill="${i % 2 ? "#f2f2ee" : "#d2312c"}"/>`;
  k += `<line x1="0" y1="-84.6" x2="0" y2="-86.4" stroke="#d2312c" stroke-width=".25"/>`;
  S.teil({ id: "fernsehturm", de: "der Fernsehturm", syl: "FERN-seh-turm", it: "la torre della televisione", itSyl: "TOR-re del-la te-le-vi-SIO-ne", en: "TV tower",
    x: 304, y: 83, kunst: `<g transform="scale(.82)">${k}</g>`, tipp: "Der Stuttgarter Fernsehturm von 1956 war der erste Fernsehturm aus Beton auf der Welt.",
    zoom: { x: 290, y: 23, w: 28, h: 18.7 },
    unter: [
      { id: "aussichtsplattform", de: "die Aussichtsplattform", syl: "AUS-sichts-platt-form", it: "la piattaforma panoramica", itSyl: "piat-ta-FOR-ma pa-no-RA-mi-ca", en: "observation deck",
        x: 304, y: 83 - 55.2 * 0.82, kunst: flaeche(-4.2, -7, 8.4, 7.4, 0.4), tipp: "Vom Turmkorb in 150 Metern Höhe sieht man über den ganzen Stuttgarter Kessel." },
    ] });
}

/* =====================================================================
   2 — DER WEINBERG (Nordhang, links hinter dem Königsbau) mit Stäffele
   ===================================================================== */
{
  let k = "";
  const rand = (x) => 72 + (x - 34) * (x - 34) / 160 + (x > 34 ? (x - 34) * 0.05 : 0);
  let p = `M0 ${r(rand(0))}`;
  for (let x = 4; x <= 112; x += 4) p += ` L${x} ${r(Math.min(108, rand(x)))}`;
  p += ` L112 116 L0 116 Z`;
  k += `<path d="${p}" fill="${S.lg("weinhang", [[0, "#9aa868"], [0.5, "#8f9a5c"], [1, "#a3a27a"]])}"/>`;
  /* Rebzeilen den Hang hinab, Mauern dazwischen */
  for (let i = 0; i < 26; i++) {
    const x0 = 2 + i * 4.2;
    const y0 = Math.min(108, rand(x0)) + 1.2;
    k += `<path d="M${r(x0)} ${r(y0)} L${r(x0 - 2.6)} 116" stroke="${i % 2 ? "#5f7038" : "#6f7d40"}" stroke-width=".9" opacity=".85"/>`;
    k += `<path d="M${r(x0 + 0.8)} ${r(y0)} L${r(x0 - 1.6)} 116" stroke="#b9a978" stroke-width=".3" opacity=".6"/>`;
  }
  for (const y of [90, 97, 104]) k += `<path d="M0 ${y} Q40 ${y - 1.4} 112 ${y + 2.4}" stroke="#d9cfb2" stroke-width=".55" opacity=".7" fill="none"/>`;
  /* Herbstlaub an den Reben (Oktober) */
  for (let i = 0; i < 40; i++) { const x = rnd() * 110, y = Math.min(108, rand(x)) + 2 + rnd() * 12; k += `<circle cx="${r(x)}" cy="${r(y)}" r=".5" fill="${rnd() < 0.5 ? "#c9a648" : "#b5763a"}" opacity=".7"/>`; }
  /* Stäffele: steile Treppe zwischen den Reben, Weinberghäusle, Wald oben */
  k += `<path d="M24 82 L22 86 L25 89 L23 93 L26 97 L24 101 L27 106" stroke="#efe6cf" stroke-width=".8" fill="none"/>`;
  k += `<path d="M24 82 L22 86 L25 89 L23 93 L26 97 L24 101 L27 106" stroke="#9a8d70" stroke-width=".8" stroke-dasharray=".25 .55" fill="none"/>`;
  k += `<rect x="40" y="84" width="3.4" height="2.6" fill="#efe6d4"/><path d="M39.6 84 L41.7 82.2 L43.8 84 Z" fill="#a4553e"/>`;
  for (let x = 2; x < 70; x += 3.2) k += `<circle cx="${r(x)}" cy="${r(rand(x) - 1.2)}" r="${r(1.6 + rnd())}" fill="${rnd() < 0.5 ? "#55703f" : "#647f4a"}"/>`;
  k += `<rect x="0" y="70" width="112" height="46" fill="${S.lg("weindunst", [[0, "#dfe7ec", 0.15], [1, "#e4ebee", 0.35]])}"/>`;
  S.teil({ id: "weinberg", de: "der Weinberg", syl: "WEIN-berg", it: "il vigneto", itSyl: "vi-GNE-to", en: "vineyard", x: 0, y: 0, kunst: k,
    tipp: "Mitten in Stuttgart wachsen Weinreben. Steile Treppen, die „Stäffele“, führen hinauf.",
    zoom: { x: 8, y: 76, w: 36, h: 24 },
    unter: [
      { id: "staeffele", de: "die Treppe", syl: "TREP-pe", it: "la scalinata", itSyl: "sca-li-NA-ta", en: "steps",
        x: 24.5, y: 106, kunst: flaeche(-3.2, -24.4, 6.4, 24.6, 0.4), tipp: "In Stuttgart gibt es über 400 Treppen an den Hängen – auf Schwäbisch „Stäffele“." },
    ] });
}

/* =====================================================================
   3 — DER BAHNHOFSTURM mit dem Mercedes-Stern (am Ende der Königstraße)
   ===================================================================== */
const BT = { x: 96, y: 117 };
{
  let k = "";
  k += `<rect x="-4" y="-34" width="8" height="34" fill="${S.lg("bt", [[0, "#cfc6b2"], [0.55, "#e6dfcd"], [1, "#f1ebdc"]], 0, 0, 1, 0)}"/>`;
  for (let y = -1.6; y > -33; y -= 1.3) k += `<line x1="-4" y1="${r(y)}" x2="4" y2="${r(y)}" stroke="#b8ae98" stroke-width=".12" opacity=".7"/>`;
  for (const x of [-2.4, -0.4, 1.6]) k += `<rect x="${x}" y="-31" width=".9" height="5" fill="#5a5f63"/>`;
  k += `<rect x="-4.4" y="-35" width="8.8" height="1.2" fill="#ede6d6"/>`;
  /* der Stern im Ring auf dem Dach */
  k += `<rect x="-.35" y="-37" width=".7" height="2" fill="#8d9298"/>`;
  k += `<circle cx="0" cy="-40.6" r="3.4" fill="none" stroke="${S.lg("sternring", [[0, "#ffffff"], [1, "#9aa3ab"]], 0, 0, 1, 1)}" stroke-width=".7"/>`;
  k += `<path d="M0 -43.6 L.5 -40.9 L2.7 -39.1 L0 -40.1 L-2.7 -39.1 L-.5 -40.9 Z" fill="${S.lg("stern", [[0, "#ffffff"], [1, "#b6bec6"]], 0, 0, 1, 1)}"/>`;
  k += `<circle cx="0" cy="-40.6" r="6" fill="#fff" opacity=".12"/>`;
  k += lichtUeber(-4, -34, 8, 34);
  S.teil({ id: "bahnhofsturm", de: "der Bahnhofsturm", syl: "BAHN-hofs-turm", it: "la torre della stazione", itSyl: "TOR-re del-la sta-ZIO-ne", en: "station tower",
    x: BT.x, y: BT.y, kunst: k, tipp: "Auf dem Bahnhofsturm dreht sich ein großer Stern: In Stuttgart haben Mercedes-Benz und Porsche ihren Sitz.",
    zoom: { x: BT.x - 10.5, y: BT.y - 47, w: 21, h: 14 },
    unter: [
      { id: "stern", de: "der Stern", syl: "STERN", it: "la stella", itSyl: "STEL-la", en: "star",
        x: BT.x, y: BT.y - 40.6, kunst: flaecheEllipse(0, 0, 3.8, 3.8), tipp: "Der Stern dreht sich und leuchtet nachts." },
    ] });
}

/* =====================================================================
   3b — DIE KÖNIGSTRASSE (Häuser bis zum Bahnhof, verdecken den Turmfuß)
   ===================================================================== */
{
  let k = "";
  /* weiter hinten die Häuser der Königstraße bis zum Bahnhof (verdecken den Fuß des Bahnhofsturms) */
  for (const [x0, w, h, f] of [[56, 9, 13, "#e3d8c2"], [64, 8, 11, "#d6cab3"], [71, 7, 12.6, "#e8e0cf"], [77.4, 6.4, 10.4, "#d9cfbc"], [83.4, 6, 9.6, "#e2d9c6"], [89, 5, 8.4, "#d2c8b5"], [93.6, 5, 7.6, "#ddd3c0"], [98.4, 5.2, 6.8, "#d6ccb8"]]) {
    k += `<rect x="${x0}" y="${r(117.4 - h)}" width="${w}" height="${r(h)}" fill="${f}"/><rect x="${x0}" y="${r(117.4 - h - 1.2)}" width="${w}" height="1.2" fill="#8c7a6e"/>`;
    for (let j = 0; j < Math.floor(h / 2.4); j++) for (let i = 0; i < Math.floor(w / 1.8); i++) k += `<rect x="${r(x0 + 0.5 + i * 1.8)}" y="${r(116 - j * 2.4 - 1.6)}" width=".8" height="1.1" fill="#5d6670" opacity=".8"/>`;
  }
  for (const [x, R] of [[60, 4.4], [74, 4], [88, 3.6]]) k += baum(x, 117.6, R, [LAUB1, LAUB2, LAUB3]);
  S.teil({ id: "koenigstrasse", de: "die Königstraße", syl: "KÖ-nig-stra-ße", it: "la Königstraße (via dello shopping)", itSyl: "KÖ-nig-stras-se", en: "Königstraße (shopping street)",
    x: 0, y: 0, kunst: k, tipp: "Die Königstraße ist die lange Einkaufsstraße vom Bahnhof bis zum Schlossplatz." });
}

/* =====================================================================
   4 — DAS ALTE SCHLOSS (rechts, Renaissance, runde Ecktürme)
   ===================================================================== */
{
  let k = "";
  const W = S.lg("asw", [[0, "#d9cdb4"], [0.6, "#ece3cf"], [1, "#f4ecdc"]], 0, 0, 1, 0);
  /* Hauptbau mit steilem Ziegeldach */
  k += `<rect x="-20" y="-22" width="40" height="22" fill="${W}"/>`;
  k += `<path d="M-21 -22 L-15 -32 L15 -32 L21 -22 Z" fill="${ZIEGEL}"/>`;
  for (let j = 0; j < 3; j++) for (let i = 0; i < 8; i++) k += `<rect x="${r(-17.6 + i * 4.6)}" y="${r(-5 - j * 6)}" width="1.6" height="2.6" fill="#4d5560"/>`;
  for (const x of [-10, 0, 10]) k += `<path d="M${x - 1.2} -32 L${x - 1.2} -34.4 L${x} -35.6 L${x + 1.2} -34.4 L${x + 1.2} -32 Z" fill="#c9b99c"/>`;
  /* große runde Ecktürme mit Kegeldach */
  for (const [x, R, h, d] of [[-22, 6.6, 29, 6], [22, 5.8, 26.5, 5.4]]) {
    k += `<rect x="${x - R}" y="${-h}" width="${2 * R}" height="${h}" fill="${S.lg("rund", [[0, "#c8bba0"], [0.45, "#efe6d2"], [0.8, "#f6efe0"], [1, "#d4c7ab"]], 0, 0, 1, 0)}"/>`;
    for (let j = 0; j < 4; j++) k += `<rect x="${r(x - 0.8)}" y="${r(-5 - j * 6.4)}" width="1.6" height="2.6" fill="#4d5560"/>`;
    k += `<path d="M${x - R - 0.6} ${-h} L${x} ${-h - d * 1.4} L${x + R + 0.6} ${-h} Z" fill="${ZIEGEL}"/>`;
    k += `<path d="M${x - R - 0.6} ${-h} Q${x} ${-h + 1.2} ${x + R + 0.6} ${-h}" stroke="#8e7d63" stroke-width=".4" fill="none"/>`;
    k += `<line x1="${x}" y1="${-h - d * 1.4}" x2="${x}" y2="${-h - d * 1.4 - 2}" stroke="#4d4d4d" stroke-width=".3"/><circle cx="${x}" cy="${-h - d * 1.4 - 2.2}" r=".4" fill="${GOLD}"/>`;
  }
  /* Bäume am Karlsplatz davor */
  for (const [x, R] of [[-31, 6], [-25, 5], [-14, 5.6], [-4, 5], [8, 5.4], [16, 4.6]]) k += baum(x, 0, R, [LAUB1, LAUB2, LAUB3]);
  k += lichtUeber(-20, -22, 40, 22);
  S.teil({ id: "altesschloss", de: "das Alte Schloss", syl: "AL-te SCHLOSS", it: "il Castello Vecchio", itSyl: "ca-STEL-lo VEC-chio", en: "Old Castle",
    x: 276, y: 118, kunst: k, tipp: "Im Alten Schloss ist heute das Landesmuseum Württemberg." });
}

/* =====================================================================
   5 — DAS NEUE SCHLOSS (Dreiflügelanlage mit Ehrenhof, Kuppel, Flagge)
   ===================================================================== */
const NS = { x: 170, y: 117 };
{
  let k = "";
  /* Hilfen: Fensterreihen mit Verdachungen, Balustrade mit Figuren, Mansarddach */
  const fenster = (x0, x1, yb, n, w, h, verdachung) => {
    let g = "";
    const sp = (x1 - x0) / n;
    for (let i = 0; i < n; i++) {
      const x = x0 + sp * (i + 0.5) - w / 2;
      g += `<rect x="${r(x)}" y="${r(yb - h)}" width="${r(w)}" height="${r(h)}" fill="${S.lg("nsfen", [[0, "#5b6773"], [1, "#39424c"]])}"/>`;
      if (verdachung) g += `<path d="M${r(x - 0.3)} ${r(yb - h - 0.2)} L${r(x + w / 2)} ${r(yb - h - 1.1)} L${r(x + w + 0.3)} ${r(yb - h - 0.2)} Z" fill="#f6efdf"/>`;
    }
    return g;
  };
  const fluegel = (x0, x1, yb, hc, hd, n, hell) => {
    /* Fassade, Gesimse, Balustrade, Mansarde mit Gauben */
    let g = `<rect x="${x0}" y="${yb - hc}" width="${r(x1 - x0)}" height="${hc}" fill="${hell ? PUTZ : PUTZ_S}"/>`;
    g += `<rect x="${x0}" y="${r(yb - hc * 0.36)}" width="${r(x1 - x0)}" height=".5" fill="#f6efdf"/>`;
    g += fenster(x0, x1, yb - 1, n, (x1 - x0) / n * 0.42, hc * 0.24, false);
    g += fenster(x0, x1, yb - hc * 0.4, n, (x1 - x0) / n * 0.44, hc * 0.3, true);
    g += fenster(x0, x1, yb - hc * 0.8, n, (x1 - x0) / n * 0.4, hc * 0.13, false);
    g += `<rect x="${r(x0 - 0.3)}" y="${r(yb - hc - 0.6)}" width="${r(x1 - x0 + 0.6)}" height=".9" fill="#f6efdf"/>`;
    for (let x = x0 + 0.5; x < x1; x += 0.9) g += `<rect x="${r(x)}" y="${r(yb - hc - 1.9)}" width=".4" height="1.3" fill="#ece2cb"/>`;
    g += `<rect x="${x0}" y="${r(yb - hc - 2.2)}" width="${r(x1 - x0)}" height=".4" fill="#f6efdf"/>`;
    g += `<path d="M${x0 + 0.4} ${r(yb - hc - 2.2)} L${x0 + 1.6} ${r(yb - hc - hd)} L${x1 - 1.6} ${r(yb - hc - hd)} L${x1 - 0.4} ${r(yb - hc - 2.2)} Z" fill="${SCHIEFER}"/>`;
    for (let i = 0; i < n; i += 2) { const x = x0 + (x1 - x0) / n * (i + 0.5); g += `<rect x="${r(x - 0.5)}" y="${r(yb - hc - hd * 0.62)}" width="1" height="1.4" fill="#e9e1cf"/>`; }
    /* Dachfiguren über der Balustrade */
    for (let i = 0; i <= n; i += 2) { const x = x0 + (x1 - x0) / n * i; g += `<path d="M${r(x - 0.35)} ${r(yb - hc - 2.2)} L${r(x - 0.3)} ${r(yb - hc - 3.6)} Q${r(x)} ${r(yb - hc - 4.4)} ${r(x + 0.3)} ${r(yb - hc - 3.6)} L${r(x + 0.35)} ${r(yb - hc - 2.2)} Z" fill="#f2ead8"/>`; }
    if (hell) g += lichtUeber(x0, yb - hc, x1 - x0, hc);
    return g;
  };
  /* innere Fassade des Nordflügels (schräg, im Schatten) */
  k += `<path d="M-48 0 L-48 -21.4 L-36 -19.6 L-36 0 Z" fill="${S.lg("innen", [[0, "#cdb994"], [1, "#e0cfa9"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 4; i++) { const x = -46.6 + i * 2.9, t = (x + 48) / 12; for (const [yb, h] of [[-1.4, 4], [-8.6, 5], [-16.4, 2]]) k += `<rect x="${r(x)}" y="${r(yb - h + t * 0.3)}" width="1.3" height="${r(h - t * 0.3)}" fill="#47515b"/>`; }
  k += `<path d="M-48.4 -21.4 L-36 -19.6 L-36.6 -26.8 L-47.6 -29.4 Z" fill="${S.lg("innendach", [[0, "#6f7b88"], [1, "#8792a0"]], 0, 0, 1, 0)}"/><path d="M-48.4 -21.4 L-36 -19.6" stroke="#f2ead8" stroke-width=".6"/>`;
  /* Mittelbau (Corps de Logis) */
  k += fluegel(-36, 42, 0, 19.6, 7.2, 23, true);
  /* Mittelrisalit: Säulen, Dreiecksgiebel mit Wappen, Figuren, Kuppel mit Flagge */
  k += `<rect x="-9" y="-21" width="18" height="21" fill="${STEIN}"/>`;
  for (const x of [-7.6, -4.6, -1.5, 1.5, 4.6, 7.6]) k += `<rect x="${x - 0.5}" y="-19.6" width="1" height="11.6" fill="#fbf7ee"/><rect x="${x - 0.7}" y="-20.2" width="1.4" height=".6" fill="#e6dcc6"/>`;
  k += fenster(-9, 9, -9, 5, 1.5, 6.4, false) + fenster(-9, 9, -1, 5, 1.6, 4.6, false);
  k += `<rect x="-9.6" y="-21.6" width="19.2" height="1" fill="#fbf7ee"/>`;
  k += `<path d="M-10 -21.6 L0 -27.6 L10 -21.6 Z" fill="${STEIN}" stroke="#d8ccb2" stroke-width=".3"/>`;
  k += `<path d="M-1.6 -25.8 L1.6 -25.8 L1.6 -23.8 Q1.6 -22.4 0 -22 Q-1.6 -22.4 -1.6 -23.8 Z" fill="${GOLD}"/>`;
  k += `<path d="M-1.2 -25.4 L1.2 -25.4 L1.2 -24.6 L-1.2 -24.6 Z M-1.2 -23.9 L1.2 -23.9 L1.2 -23.2 L-1.2 -23.2 Z" fill="#2a2a2a"/>`;
  k += `<path d="M-3.4 -24.4 q-1 -1.6 -.2 -3 M3.4 -24.4 q1 -1.6 .2 -3" stroke="#f2ead8" stroke-width=".7" fill="none"/>`;
  for (const x of [-10, 0, 10]) k += `<path d="M${x - 0.4} ${x === 0 ? -27.6 : -21.6} L${x - 0.35} ${x === 0 ? -29.6 : -23.6} Q${x} ${x === 0 ? -30.6 : -24.6} ${x + 0.35} ${x === 0 ? -29.6 : -23.6} L${x + 0.4} ${x === 0 ? -27.6 : -21.6} Z" fill="#f2ead8"/>`;
  /* Kuppel (heute statt der Krone die Landesdienstflagge) */
  k += `<path d="M-7 -27 L-7 -30.6 Q-6.6 -37.6 0 -39 Q6.6 -37.6 7 -30.6 L7 -27 Z" fill="${S.lg("kuppelns", [[0, "#5c6875"], [0.55, "#8592a0"], [0.8, "#a3aebb"], [1, "#6b7785"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-4.4, -1.5, 1.5, 4.4]) k += `<path d="M${x} -27.2 Q${x * 0.9} -34 ${x * 0.35} -38.6" stroke="#4b5663" stroke-width=".2" fill="none"/>`;
  k += `<rect x="-7.4" y="-27.6" width="14.8" height=".8" fill="#ece3cf"/>`;
  k += `<rect x="-1" y="-41" width="2" height="2.2" fill="#ece3cf"/><path d="M-1.2 -41 Q0 -42.4 1.2 -41 Z" fill="#6b7785"/>`;
  k += `<line x1="0" y1="-42" x2="0" y2="-54" stroke="#bfc4c8" stroke-width=".35"/><circle cx="0" cy="-54.2" r=".35" fill="${GOLD}"/>`;
  k += `<path d="M.2 -53.6 q2.6 -.9 4.4 0 t4.2 0 L8.8 -50.4 q-2.1 -.9 -4.2 0 t-4.4 0 Z" fill="#1d1d1d"/>`;
  k += `<path d="M.2 -50.6 q2.6 -.9 4.4 0 t4.2 0 L8.8 -47.4 q-2.1 -.9 -4.2 0 t-4.4 0 Z" fill="#f2c62f"/>`;
  k += `<path d="M3.4 -52.4 L5.4 -52.4 L5.4 -50.2 Q5.4 -49 4.4 -48.7 Q3.4 -49 3.4 -50.2 Z" fill="#f2c62f" stroke="#1d1d1d" stroke-width=".15"/>`;
  /* Kopfbau des Nordflügels (links, näher) und des Südflügels (rechts, noch näher) */
  k += fluegel(-66, -48, 0.6, 23.4, 8, 6, true);
  k += `<path d="M-60.4 -23.8 L-57 -26.8 L-53.6 -23.8 Z" fill="${STEIN}"/>`;
  k += fluegel(42, 66, 1.4, 25.6, 8.6, 7, true);
  k += `<path d="M50 -24.6 L54 -28 L58 -24.6 Z" fill="${STEIN}"/><circle cx="54" cy="-25.6" r=".9" fill="${GOLD}"/>`;
  /* Ehrenhof: heller Kies, Rasenstücke */
  k += `<path d="M-48 0 L42 0 L42 1.4 L-48 .6 Z" fill="#e4dac6"/>`;
  S.teil({ id: "neuesschloss", de: "das Neue Schloss", syl: "NEU-e SCHLOSS", it: "il Castello Nuovo", itSyl: "ca-STEL-lo NUO-vo", en: "New Palace",
    x: NS.x, y: NS.y, kunst: k, tipp: "Das Neue Schloss war das Schloss der Könige von Württemberg.",
    zoom: { x: NS.x - 30, y: NS.y - 60, w: 60, h: 40 },
    unter: [
      { id: "fahne", de: "die Fahne", syl: "FAH-ne", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag",
        x: NS.x + 4.5, y: NS.y - 47.2, kunst: flaeche(-4.6, -7, 9.2, 7.4, 0.4), tipp: "Auf der Kuppel weht die Fahne von Baden-Württemberg: Schwarz und Gold." },
      { id: "wappen", de: "das Wappen", syl: "WAP-pen", it: "lo stemma", itSyl: "STEM-ma", en: "coat of arms",
        x: NS.x, y: NS.y - 21.6, kunst: flaeche(-4, -6, 8, 6.2, 0.4) },
      { id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome",
        x: NS.x, y: NS.y - 27, kunst: flaeche(-7, -12, 14, 12, 0.6) },
    ] });
}

/* =====================================================================
   6 — DER SCHLOSSPLATZ (Rasen, Kieswege) und die Bäume am Rand
   ===================================================================== */
const PLATZ = (abst) => HOR + 1800 / abst;   /* Boden des Platzes */
{
  let k = "";
  /* Rasenflächen, zur Säule hin durch Wege geteilt */
  const RASEN = S.lg("rasen", [[0, "#8fb05e"], [1, "#6f9443"]]);
  k += `<path d="M62 121 L132 119.6 L120 130 L44 134 Z" fill="${RASEN}"/>`;
  k += `<path d="M160 119.6 L238 120.6 L262 132 L170 130 Z" fill="${RASEN}"/>`;
  k += `<path d="M40 138 L114 133.6 L100 152 L14 152 Z" fill="${RASEN}"/>`;
  k += `<path d="M176 134 L268 136 L300 152 L186 152 Z" fill="${RASEN}"/>`;
  for (let i = 0; i < 60; i++) { const x = rnd() * 320, y = 120 + rnd() * 32; k += `<path d="M${r(x)} ${r(y)} l.4 -1" stroke="#a9c777" stroke-width=".25" opacity=".5"/>`; }
  /* ferner zweiter Brunnen (hinter der Säule) */
  k += `<ellipse cx="128" cy="119.6" rx="4.4" ry=".9" fill="#7c8a8f"/><rect x="127.4" y="114.6" width="1.2" height="5" fill="#59646a"/><path d="M125.4 115.2 Q128 113.6 130.6 115.2" stroke="#dfeef4" stroke-width=".6" fill="none" opacity=".9"/>`;
  /* Bäume am Rand des Platzes (vor dem Königsbau und am Ehrenhof) */
  for (const [x, y, R] of [[62, 121, 5.6], [72, 121.4, 5], [230, 120, 4.6], [244, 121, 5.4]]) k += baum(x, y, R, [LAUB1, LAUB2, LAUB3]);
  /* Menschen klein auf den Wegen */
  for (const [x, y, c] of [[136, 128, "#b8473a"], [140, 129, "#2f5f95"], [210, 127, "#4f8a46"], [154, 136, "#d8ad3a"], [96, 131, "#7d5838"]]) k += `<rect x="${x - 0.5}" y="${y - 2.6}" width="1" height="2.2" rx=".4" fill="${c}"/><circle cx="${x}" cy="${y - 3}" r=".45" fill="#d9a07a"/><rect x="${x - 0.35}" y="${y - 0.6}" width=".7" height=".6" fill="#3a3a3a"/>`;
  S.teil({ id: "schlossplatz", de: "der Schlossplatz", syl: "SCHLOSS-platz", it: "la piazza del castello", itSyl: "PIAZ-za del ca-STEL-lo", en: "Palace Square", x: 0, y: 0, kunst: k,
    tipp: "Der Schlossplatz ist der größte Platz in der Mitte von Stuttgart." });
}

/* =====================================================================
   7 — DER MUSIKPAVILLON (Gusseisen, maurische Bögen)
   ===================================================================== */
{
  let k = schatten(0, 0.3, 9, 1.2, 0.25);
  const EISEN = S.lg("pav", [[0, "#3f5a4a"], [0.5, "#5f7f68"], [1, "#344a3d"]], 0, 0, 1, 0);
  k += `<path d="M-9 0 L9 0 L8.4 -2 L-8.4 -2 Z" fill="#cfc4ae"/>`;
  for (const x of [-7.6, -3.8, 0, 3.8, 7.6]) k += `<rect x="${x - 0.3}" y="-11" width=".6" height="9" fill="${EISEN}"/>`;
  for (let i = 0; i < 4; i++) { const a = -7.6 + i * 3.8; k += `<path d="M${a} -9 Q${a + 0.4} -11.4 ${a + 1.9} -11.6 Q${a + 3.4} -11.4 ${a + 3.8} -9" stroke="#5f7f68" stroke-width=".35" fill="none"/>`; }
  k += `<rect x="-8.6" y="-6" width="17.2" height=".35" fill="#5f7f68"/><rect x="-8.6" y="-3.6" width="17.2" height=".3" fill="#5f7f68"/>`;
  k += `<rect x="-9.4" y="-12.2" width="18.8" height="1.2" fill="#5f7f68"/>`;
  k += `<path d="M-9.4 -12.2 Q-8 -17 0 -18.4 Q8 -17 9.4 -12.2 Z" fill="${S.lg("pavdach", [[0, "#4c6857"], [0.6, "#77967f"], [1, "#4c6857"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-.6 -18.4 L0 -21 L.6 -18.4 Z" fill="${GOLD}"/>`;
  S.teil({ id: "musikpavillon", de: "der Musikpavillon", syl: "mu-SIK-pa-vil-lon", it: "il padiglione della musica", itSyl: "pa-di-GLIO-ne del-la MU-si-ca", en: "bandstand",
    x: 84, y: 128, steht: true, kunst: k, tipp: "Der Musikpavillon aus Gusseisen steht seit 1871 auf dem Schlossplatz." });
}

/* =====================================================================
   8 — DER BRUNNEN (gusseiserner Springbrunnen von 1863)
   ===================================================================== */
{
  let k = schatten(0, 0.3, 10, 1.3, 0.25);
  k += `<ellipse cx="0" cy="-.6" rx="10" ry="2" fill="${S.lg("becken", [[0, "#9aa39c"], [1, "#6b7570"]])}"/>`;
  k += `<ellipse cx="0" cy="-1.4" rx="9" ry="1.5" fill="${S.lg("brwasser", [[0, "#cfe3ea"], [1, "#8db0bd"]])}"/>`;
  k += `<path d="M-1.2 -1.4 L-.8 -8 L.8 -8 L1.2 -1.4 Z" fill="#4f5a55"/>`;
  /* Putten am Schaft */
  for (const x of [-2.6, 2.6]) k += `<circle cx="${x}" cy="-4.4" r=".8" fill="#5c6762"/><rect x="${x - 0.6}" y="-3.8" width="1.2" height="1.8" rx=".5" fill="#5c6762"/>`;
  k += `<ellipse cx="0" cy="-8" rx="4.4" ry=".9" fill="#5c6762"/><ellipse cx="0" cy="-8.3" rx="3.8" ry=".6" fill="#bcd8e2"/>`;
  k += `<path d="M-.5 -8.3 L-.3 -11.4 L.3 -11.4 L.5 -8.3 Z" fill="#4f5a55"/><ellipse cx="0" cy="-11.4" rx="1.8" ry=".45" fill="#5c6762"/>`;
  /* Wasser: Fontäne und Schleier */
  k += `<path d="M0 -11.6 Q-.4 -15 0 -16.4 Q.4 -15 0 -11.6" stroke="#f2fbfe" stroke-width=".7" fill="none"/>`;
  k += `<path d="M-1.6 -11.4 Q-3.6 -10 -4.2 -8.4 M1.6 -11.4 Q3.6 -10 4.2 -8.4 M-4 -8.2 Q-6.6 -5 -8 -1.8 M4 -8.2 Q6.6 -5 8 -1.8" stroke="#e8f6fb" stroke-width=".45" fill="none" opacity=".85"/>`;
  S.teil({ id: "brunnen", de: "der Brunnen", syl: "BRUN-nen", it: "la fontana", itSyl: "fon-TA-na", en: "fountain",
    x: 196, y: 128.6, steht: true, kunst: k, tipp: "Die zwei Brunnen sind von 1863. Acht Kinderfiguren stehen für die Flüsse Württembergs." });
}

/* =====================================================================
   9 — DIE JUBILÄUMSSÄULE mit der Concordia
   ===================================================================== */
const JS = { x: 146, y: 125 };
{
  let k = schatten(0, 0.3, 8, 1.2, 0.3);
  const GRANIT = S.lg("granit", [[0, "#a59c94"], [0.5, "#d6cfc6"], [0.75, "#e6dfd6"], [1, "#9a918a"]], 0, 0, 1, 0);
  /* Stufen und Sockel mit Reliefs, vier sitzende Frauenfiguren an den Ecken */
  k += `<path d="M-7 0 L7 0 L6.4 -1.4 L-6.4 -1.4 Z" fill="#d9d1c4"/><path d="M-6 -1.4 L6 -1.4 L5.5 -2.6 L-5.5 -2.6 Z" fill="#cfc6b8"/>`;
  k += `<rect x="-4.2" y="-9.8" width="8.4" height="7.2" fill="${GRANIT}"/>`;
  k += `<rect x="-3.2" y="-8.8" width="6.4" height="4.6" fill="${S.lg("relief", [[0, "#6f8a78"], [1, "#4b6555"]])}"/>`;
  for (let i = 0; i < 5; i++) k += `<path d="M${-2.6 + i * 1.3} -4.6 L${-2.6 + i * 1.3} -7 Q${-2.2 + i * 1.3} -7.8 ${-1.8 + i * 1.3} -7 L${-1.8 + i * 1.3} -4.6 Z" fill="#8fa898" opacity=".85"/>`;
  for (const s of [-1, 1]) {
    const x = s * 5;
    k += `<rect x="${x - 1.4}" y="-4" width="2.8" height="1.4" fill="#cfc6b8"/>`;
    k += `<path d="M${x - 1.2} -4 L${x - 0.9} -6.6 Q${x} -7.6 ${x + 0.9} -6.6 L${x + 1.2} -4 Z" fill="${BRONZE}"/><circle cx="${x}" cy="-7.6" r=".7" fill="${BRONZE}"/>`;
  }
  k += `<rect x="-4.6" y="-10.6" width="9.2" height=".9" fill="#e6dfd6"/>`;
  /* Säulenschaft (Granit) mit Basis und Kapitell */
  k += `<path d="M-2.4 -10.6 L2.4 -10.6 L2.1 -12 L-2.1 -12 Z" fill="#d9d1c4"/>`;
  k += `<path d="M-1.9 -12 L-1.6 -55 L1.6 -55 L1.9 -12 Z" fill="${GRANIT}"/>`;
  for (const x of [-1, 0, 1]) k += `<line x1="${x * 1.1}" y1="-12.4" x2="${x * 0.95}" y2="-54.6" stroke="#9a918a" stroke-width=".12" opacity=".7"/>`;
  k += `<path d="M-1.6 -55 L-2.6 -56.4 L2.6 -56.4 L1.6 -55 Z" fill="${BRONZE}"/>`;
  k += `<path d="M-2.2 -56.4 q-.6 -.6 -.2 -1.2 M2.2 -56.4 q.6 -.6 .2 -1.2" stroke="#7f9a86" stroke-width=".4" fill="none"/>`;
  k += `<rect x="-2.8" y="-57.6" width="5.6" height="1.2" fill="#d9d1c4"/>`;
  /* die Concordia: Bronze, Kranz in der erhobenen Hand */
  k += `<path d="M-1.4 -57.6 L-1.1 -61.6 Q-1.3 -63.4 -.6 -64.4 L.6 -64.4 Q1.3 -63.4 1.1 -61.6 L1.4 -57.6 Z" fill="${BRONZE}"/>`;
  k += `<path d="M-1.1 -59.4 q1.1 .8 2.2 0" stroke="#7f9a86" stroke-width=".3" fill="none"/>`;
  k += `<circle cx="0" cy="-65.2" r=".85" fill="${BRONZE}"/>`;
  k += `<path d="M.6 -63.6 L2 -66.4" stroke="#55705f" stroke-width=".55" stroke-linecap="round"/><circle cx="2.2" cy="-67" r=".8" fill="none" stroke="#7f9a86" stroke-width=".35"/>`;
  k += `<path d="M-.6 -63.4 L-1.8 -61" stroke="#55705f" stroke-width=".5" stroke-linecap="round"/>`;
  k += `<path d="M1.2 -64 Q1.6 -61 1.4 -58" stroke="#a9c3b1" stroke-width=".3" fill="none" opacity=".8"/>`;
  S.teil({ id: "jubilaeumssaeule", de: "die Jubiläumssäule", syl: "ju-bi-LÄ-ums-säu-le", it: "la Colonna del Giubileo", itSyl: "co-LON-na del giu-bi-LE-o", en: "Jubilee Column",
    x: JS.x, y: JS.y, kunst: k, tipp: "Die Säule wurde zum 25. Regierungsjubiläum von König Wilhelm I. gebaut.",
    zoom: { x: JS.x - 10.5, y: JS.y - 70, w: 21, h: 14 },
    unter: [
      { id: "statue", de: "die Statue", syl: "STA-tu-e", it: "la statua", itSyl: "STA-tua", en: "statue",
        x: JS.x, y: JS.y - 57.6, kunst: flaeche(-2.4, -10.4, 5.4, 10.6, 0.4), tipp: "Oben steht Concordia, die römische Göttin der Eintracht." },
    ] });
}

/* =====================================================================
   10 — DER KÖNIGSBAU (links: die Kolonnade läuft zum Bahnhofsturm hin)
   ===================================================================== */
{
  let k = "";
  /* Flucht zum Bahnhofsturm: oben (0|62) → (96|112), unten (0|136) → (96|112) */
  const VX = 96, oben0 = 62, unten0 = 136;
  const xU = (u) => VX * (1 - 90 / (90 + u));             /* u = Meter von der Südecke */
  const oy = (x) => oben0 + (HOR - oben0) * x / VX, uy = (x) => unten0 + (HOR - unten0) * x / VX;
  const at = (x, t) => uy(x) + (oy(x) - uy(x)) * t;          /* t = Anteil der Höhe */
  const xe = xU(135);
  const quad = (t0, t1, x0, x1, f) => `<path d="M${r(x0)} ${r(at(x0, t0))} L${r(x1)} ${r(at(x1, t0))} L${r(x1)} ${r(at(x1, t1))} L${r(x0)} ${r(at(x0, t1))} Z" fill="${f}"/>`;
  const SANDK = S.lg("koenig", [[0, "#e9dcc0"], [1, "#d3c3a2"]]);
  /* Obergeschoss (zurückgesetzt) mit Fenstern, Dach */
  k += quad(0.62, 1, -2, xe, SANDK);
  for (let u = 2; u < 134; u += 4) {
    const x = xU(u), x2 = xU(u + 1.6);
    k += `<path d="M${r(x)} ${r(at(x, 0.7))} L${r(x2)} ${r(at(x2, 0.7))} L${r(x2)} ${r(at(x2, 0.9))} L${r(x)} ${r(at(x, 0.9))} Z" fill="#59616b"/>`;
  }
  k += quad(1, 1.07, -2, xe, "#f3ead6");
  k += quad(1.07, 1.12, -2, xe, "#7d8896");
  /* Balustrade über der Kolonnade */
  k += quad(0.58, 0.62, -2, xe, "#f4ecda");
  for (let u = 0.6; u < 135; u += 1.2) { const x = xU(u); k += `<line x1="${r(x)}" y1="${r(at(x, 0.585))}" x2="${r(x)}" y2="${r(at(x, 0.62))}" stroke="#d2c4a5" stroke-width="${r(0.12 + 0.28 * (1 - x / VX))}"/>`; }
  k += quad(0.52, 0.58, -2, xe, "#efe5cf");
  k += quad(0.5, 0.52, -2, xe, "#d6c7a8");
  /* Halle hinter den Säulen: Schatten, Schaufenster warm beleuchtet */
  k += quad(0, 0.5, -2, xe, S.lg("halle", [[0, "#6d6152"], [1, "#4a4138"]]));
  for (let u = 1; u < 134; u += 4) {
    const x = xU(u), x2 = xU(u + 2.4);
    k += `<path d="M${r(x)} ${r(at(x, 0.04))} L${r(x2)} ${r(at(x2, 0.04))} L${r(x2)} ${r(at(x2, 0.36))} L${r(x)} ${r(at(x, 0.36))} Z" fill="${S.lg("laden", [[0, "#f6d79a"], [1, "#c99a55"]])}" opacity=".8"/>`;
  }
  /* 34 ionische Säulen (die vorderen groß, nach hinten kleiner) */
  for (let i = 0; i < 34; i++) {
    const u = i * 4.09, x = xU(u), w = Math.max(0.35, 2.6 * (1 - x / VX) * (90 / (90 + u)) * 1.9);
    const yb = at(x, 0), yt = at(x, 0.5);
    k += `<rect x="${r(x - w / 2)}" y="${r(yt)}" width="${r(w)}" height="${r(yb - yt)}" fill="${S.lg("koensaeule", [[0, "#cdbd9c"], [0.55, "#f2e9d6"], [1, "#d9cbad"]], 0, 0, 1, 0)}"/>`;
    if (w > 0.9) {
      k += `<rect x="${r(x - w * 0.8)}" y="${r(yt - w * 0.25)}" width="${r(w * 1.6)}" height="${r(w * 0.3)}" fill="#f6efdf"/>`;
      k += `<circle cx="${r(x - w * 0.62)}" cy="${r(yt + w * 0.1)}" r="${r(w * 0.2)}" fill="none" stroke="#bfae8c" stroke-width="${r(w * 0.08)}"/><circle cx="${r(x + w * 0.62)}" cy="${r(yt + w * 0.1)}" r="${r(w * 0.2)}" fill="none" stroke="#bfae8c" stroke-width="${r(w * 0.08)}"/>`;
      k += `<rect x="${r(x - w * 0.7)}" y="${r(yb - w * 0.25)}" width="${r(w * 1.4)}" height="${r(w * 0.25)}" fill="#e2d6bc"/>`;
    }
  }
  /* Stirnseite (Südecke) mit Pilastern */
  k += `<path d="M-2 ${r(at(-2, 0))} L-2 ${r(at(-2, 1.07))} L-6 ${r(at(-2, 1.07) + 1)} L-6 ${r(at(-2, 0) + 0.6)} Z" fill="#d8c8a8"/>`;
  k += `<path d="M-2 ${r(at(-2, 0))} L${r(xe)} ${r(at(xe, 0))} L${r(xe)} ${r(at(xe, 0) + 0.8)} L-2 ${r(at(-2, 0) + 1.4)} Z" fill="#b8ab93"/>`;
  S.teil({ id: "koenigsbau", de: "der Königsbau", syl: "KÖ-nigs-bau", it: "il Königsbau (il palazzo del re)", itSyl: "KÖ-nigs-bau", en: "Königsbau",
    x: 0, y: 0, kunst: k, tipp: "Der Königsbau hat eine 135 Meter lange Säulenhalle mit Läden und Cafés.",
    zoom: { x: 0, y: 102, w: 42, h: 28 },
    unter: [
      { id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column",
        x: xU(8.18), y: at(xU(8.18), 0), kunst: flaeche(-1.8, -(at(xU(8.18), 0) - at(xU(8.18), 0.52)), 3.6, at(xU(8.18), 0) - at(xU(8.18), 0.52), 0.4),
        tipp: "Vor dem Königsbau stehen 34 Säulen in einer Reihe." },
    ] });
}

/* =====================================================================
   11 — DIE TERRASSE (Kleiner Schlossplatz: Boden, Geländer) und DIE TREPPE
   ===================================================================== */
const TER = { kante: 150 };
{
  let k = `<path d="M0 ${TER.kante} L320 ${TER.kante} L320 200 L0 200 Z" fill="${S.lg("terrasse", [[0, "#d7d2c8"], [0.5, "#c7c0b2"], [1, "#b2aa9b"]])}"/>`;
  /* Steinplatten in Flucht */
  for (let i = -12; i <= 12; i++) {
    let x1 = 160 + i * 13, y1 = TER.kante, x2 = 160 + i * 30, y2 = 200;
    const kl = (xg) => { const t = (xg - x1) / (x2 - x1); return [xg, y1 + (y2 - y1) * t]; };
    if (x2 < 0) [x2, y2] = kl(0);
    if (x2 > 320) [x2, y2] = kl(320);
    if (x1 < 0 || x1 > 320) continue;
    k += `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="#9c9486" stroke-width=".3" opacity=".6"/>`;
  }
  for (const y of [154, 159, 165, 172, 181, 191]) k += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#9c9486" stroke-width=".3" opacity=".55"/>`;
  /* Kante und Geländer aus Edelstahl mit Glas, in der Mitte die Treppe */
  const gl = (x0, x1) => {
    let g = `<rect x="${x0}" y="${TER.kante - 9.4}" width="${x1 - x0}" height="9" fill="#dfeef3" opacity=".22"/>`;
    g += `<rect x="${x0}" y="${TER.kante - 9.8}" width="${x1 - x0}" height="1" rx=".4" fill="${S.lg("handlauf", [[0, "#f2f4f5"], [1, "#9aa3aa"]])}"/>`;
    for (let x = x0 + 1; x < x1; x += 12) g += `<rect x="${x}" y="${TER.kante - 9.8}" width=".8" height="9.8" fill="#b7c0c6"/>`;
    g += `<path d="M${x0 + 3} ${TER.kante - 8.6} L${x0 + 9} ${TER.kante - 1}" stroke="#fff" stroke-width=".6" opacity=".35"/>`;
    return g;
  };
  k += `<rect x="0" y="${TER.kante - 0.6}" width="320" height="1.4" fill="#e9e5dc"/>`;
  k += gl(0, 112) + gl(208, 320);
  S.teil({ id: "terrasse", de: "die Terrasse", syl: "ter-RAS-se", it: "la terrazza", itSyl: "ter-RAZ-za", en: "terrace", x: 0, y: 0, kunst: k });
}
{
  /* Die Freitreppe hinunter zum Platz: Stufen, die sich in der Tiefe verlieren */
  let k = "";
  for (let i = 0; i < 6; i++) {
    const y = TER.kante - 0.4 - i * 1.3, s = 1 - i * 0.04;
    k += `<path d="M${r(112 + i * 1.6)} ${r(y)} L${r(208 - i * 1.6)} ${r(y)} L${r(208 - i * 1.6)} ${r(y - 0.6 * s)} L${r(112 + i * 1.6)} ${r(y - 0.6 * s)} Z" fill="${i % 2 ? "#ddd7cb" : "#cfc8ba"}"/>`;
    k += `<line x1="${r(112 + i * 1.6)}" y1="${r(y)}" x2="${r(208 - i * 1.6)}" y2="${r(y)}" stroke="#9a9182" stroke-width=".3"/>`;
  }
  for (const x of [112, 208]) k += `<rect x="${x - 1.2}" y="${TER.kante - 10}" width="2.4" height="10" fill="${S.lg("wange", [[0, "#e6e1d6"], [1, "#bdb5a6"]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "treppe", de: "die Freitreppe", syl: "FREI-trep-pe", it: "la scalinata", itSyl: "sca-li-NA-ta", en: "outdoor staircase", x: 0, y: 0, kunst: k,
    tipp: "Über die Freitreppe geht man vom Kleinen Schlossplatz hinunter zur Königstraße." });
}

/* =====================================================================
   12 — DIE LATERNE (Kandelaber auf der Terrasse, links)
   ===================================================================== */
{
  const d = 9, y = HOR + 480 / d, s = 300 / d;
  let k = schatten(0, 0.3, 4.4, 1, 0.3);
  const EIS = S.lg("eisen", [[0, "#2a3631"], [0.45, "#55655d"], [1, "#1f2925"]], 0, 0, 1, 0);
  k += `<path d="M-2.6 0 L-1.8 -4 L1.8 -4 L2.6 0 Z" fill="${EIS}"/>`;
  k += `<path d="M-.8 -4 L-.55 ${r(-3.9 * s)} L.55 ${r(-3.9 * s)} L.8 -4 Z" fill="${EIS}"/>`;
  for (const yy of [-12, -26]) k += `<rect x="-1.2" y="${yy}" width="2.4" height="1" rx=".4" fill="#3a4741"/>`;
  const y0 = -3.9 * s;
  k += `<path d="M-2.2 ${r(y0)} L2.2 ${r(y0)} L3.2 ${r(y0 - 6)} L-3.2 ${r(y0 - 6)} Z" fill="${S.lg("lglas", [[0, "#fff6d6"], [1, "#e7d9a8"]])}" stroke="#26302c" stroke-width=".35"/>`;
  k += `<path d="M-4 ${r(y0 - 6)} L4 ${r(y0 - 6)} L1.2 ${r(y0 - 8.6)} L-1.2 ${r(y0 - 8.6)} Z" fill="${EIS}"/><circle cx="0" cy="${r(y0 - 9.3)}" r=".7" fill="#26302c"/>`;
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: 18, y, steht: true, kunst: k });
}

/* =====================================================================
   13 — DER TISCH (Café am Kleinen Schlossplatz) mit schwäbischem Essen
   ===================================================================== */
{
  let k = "";
  /* runder Bistrotisch, nah: Platte als Ellipse, angeschnitten */
  k += `<ellipse cx="0" cy="0" rx="56" ry="14" fill="${S.lg("platte", [[0, "#f2efe8"], [0.6, "#dcd6ca"], [1, "#bfb7a8"]])}"/>`;
  k += `<ellipse cx="0" cy="0" rx="56" ry="14" fill="none" stroke="#a49a88" stroke-width=".8"/>`;
  k += `<path d="M-56 0 Q-56 6 -50 9 L50 9 Q56 6 56 0 Q40 14.6 0 14.6 Q-40 14.6 -56 0 Z" fill="#a49a88" opacity=".5"/>`;
  k += `<ellipse cx="-14" cy="-4" rx="22" ry="5" fill="#fff" opacity=".18"/>`;
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: 268, y: 186, kunst: k });
}
{
  /* DER STUHL: Bistrostuhl links vom Tisch, von hinten gesehen */
  let k = "";
  const M = S.lg("stuhlmetall", [[0, "#3b4148"], [0.5, "#6c747c"], [1, "#2f353b"]], 0, 0, 1, 0);
  k += `<path d="M-11 0 L-10 -30 M11 0 L10 -30" stroke="${M}" stroke-width="1.6" stroke-linecap="round"/>`;
  k += `<path d="M-10 -30 Q0 -33.6 10 -30" stroke="${M}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  for (const y of [-26, -21.4, -16.8]) k += `<path d="M-10.2 ${y} Q0 ${y - 2.6} 10.2 ${y}" stroke="${S.lg("lehne", [[0, "#a0683a"], [1, "#6e4220"]])}" stroke-width="2.6" fill="none"/>`;
  k += `<path d="M-14 -2 Q0 -6 14 -2 L14 1.6 Q0 -2.2 -14 1.6 Z" fill="#7e5130"/>`;
  k += `<path d="M-9 -29 Q0 -32 9 -29" stroke="#fff" stroke-width=".5" opacity=".35" fill="none"/>`;
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: 202, y: 198, kunst: k });
}
{
  /* DIE MAULTASCHEN in der Brühe, mit Schnittlauch */
  let k = schatten(0, 0.4, 12, 1.6, 0.25);
  k += `<ellipse cx="0" cy="0" rx="11.6" ry="3.8" fill="${S.lg("teller", [[0, "#ffffff"], [1, "#d8d6d0"]])}"/>`;
  k += `<ellipse cx="0" cy="-.4" rx="8.6" ry="2.6" fill="${S.lg("bruehe", [[0, "#f2d98e"], [1, "#d9b65a"]])}"/>`;
  for (const [x, y, rot] of [[-3.2, -1.2, -10], [2.8, -.9, 12]]) {
    k += `<g transform="rotate(${rot} ${x} ${y})"><rect x="${x - 3.4}" y="${y - 1.8}" width="6.8" height="3.6" rx="1.1" fill="${S.lg("teig", [[0, "#fbf0d2"], [0.6, "#ead7a4"], [1, "#cdb57a"]])}"/>`;
    k += `<path d="M${x - 3.4} ${y + 1.2} L${x + 3.4} ${y + 1.2}" stroke="#5f7d3a" stroke-width=".7"/><path d="M${x - 3.4} ${y + 1.6} L${x + 3.4} ${y + 1.6}" stroke="#9a6a4a" stroke-width=".5"/>`;
    k += `<path d="M${x - 2.6} ${y - 0.6} q2.6 -.8 5.2 0" stroke="#fffaf0" stroke-width=".4" fill="none" opacity=".7"/></g>`;
  }
  for (let i = 0; i < 12; i++) k += `<rect x="${r(-5 + rnd() * 10)}" y="${r(-2.4 + rnd() * 2.4)}" width=".8" height=".25" fill="#4f8a3a"/>`;
  S.teil({ oben: true, id: "maultasche", de: "die Maultasche", syl: "MAUL-ta-sche", it: "il raviolo svevo", itSyl: "ra-VIO-lo SVE-vo", en: "Swabian ravioli",
    x: 248, y: 186, steht: true, kunst: k, tipp: "Maultaschen sind schwäbische Teigtaschen, gefüllt mit Fleisch und Spinat." });
}
{
  /* DIE SPÄTZLE mit Linsen und Saitenwürstle */
  let k = schatten(0, 0.4, 12, 1.6, 0.25);
  k += `<ellipse cx="0" cy="0" rx="12" ry="3.8" fill="${S.lg("teller2", [[0, "#ffffff"], [1, "#d8d6d0"]])}"/>`;
  k += `<ellipse cx="-3" cy="-.6" rx="6" ry="2.2" fill="${S.rg("linsen", [[0, "#9a6e46"], [1, "#6b4a2c"]])}"/>`;
  for (let i = 0; i < 16; i++) k += `<circle cx="${r(-7 + rnd() * 8)}" cy="${r(-1.8 + rnd() * 2.4)}" r=".3" fill="#5a3d24"/>`;
  for (let i = 0; i < 14; i++) { const x = 1 + rnd() * 6.4, y = -2.2 + rnd() * 2.6; k += `<path d="M${r(x)} ${r(y)} q.8 -.5 1.6 0" stroke="${rnd() < 0.5 ? "#f2d66e" : "#e5c04f"}" stroke-width=".7" stroke-linecap="round" fill="none"/>`; }
  k += `<path d="M-8 1 Q-2 -2.4 6 .4" stroke="${S.lg("saite", [[0, "#d9906a"], [1, "#a85f3c"]])}" stroke-width="1.3" stroke-linecap="round" fill="none"/>`;
  k += `<path d="M-7 2.2 Q-1 -1 7 1.6" stroke="${S.lg("saite2", [[0, "#d9906a"], [1, "#a85f3c"]])}" stroke-width="1.3" stroke-linecap="round" fill="none"/>`;
  S.teil({ oben: true, id: "spaetzle", de: "die Spätzle", syl: "SPÄTZ-le", it: "gli spätzle", itSyl: "SPÄTZ-le", en: "spaetzle",
    x: 284, y: 189, steht: true, kunst: k, tipp: "Spätzle sind schwäbische Eiernudeln. Linsen mit Spätzle und Saitenwürstle isst man in ganz Schwaben." });
}
{
  /* DAS VIERTELE: Henkelglas mit Trollinger */
  let k = schatten(1, 0.3, 4.2, .8, 0.25);
  k += `<path d="M-3.4 0 L-3.8 -10 L3.8 -10 L3.4 0 Z" fill="#eef4f4" opacity=".5"/>`;
  k += `<path d="M-3.35 -.4 L-3.65 -7.6 L3.65 -7.6 L3.35 -.4 Z" fill="${S.lg("trollinger", [[0, "#b53a45"], [1, "#7a1a26"]])}" opacity=".92"/>`;
  k += `<ellipse cx="0" cy="-7.6" rx="3.65" ry=".6" fill="#c9505c"/>`;
  k += `<path d="M3.6 -8.4 Q7.4 -8 6.8 -4.4 Q6.4 -2 3.4 -2.2" stroke="#e6eeee" stroke-width=".9" fill="none" opacity=".85"/>`;
  for (let i = 0; i < 3; i++) k += `<path d="M-3.3 ${-2.4 - i * 2.4} h6.6" stroke="#fff" stroke-width=".18" opacity=".5"/>`;
  k += `<path d="M-2.8 -9.4 L-2.6 -1" stroke="#fff" stroke-width=".5" opacity=".6"/>`;
  k += `<ellipse cx="0" cy="-10" rx="3.8" ry=".6" fill="none" stroke="#f2f6f6" stroke-width=".3"/>`;
  S.teil({ oben: true, id: "viertele", de: "das Viertele", syl: "VIER-te-le", it: "il quartino di vino", itSyl: "quar-TI-no di VI-no", en: "quarter litre of wine",
    x: 300, y: 180, steht: true, kunst: k, tipp: "Ein Viertele ist ein Viertelliter Wein im Henkelglas – oft Trollinger aus Württemberg." });
}
{
  /* DIE BREZEL: schwäbisch, dünne Ärmchen, dicker Bauch, Salz */
  const LAUGE = S.rg("lauge", [[0, "#c27a38"], [0.6, "#94501a"], [1, "#64320c"]], 0.4, 0.35, 0.8);
  let k = schatten(0, 0.3, 10, 1.3, 0.25);
  k += `<path d="M-8 -.2 C-11 -3.4 -9.6 -9.6 -3.6 -9.8 C1 -9.9 2.4 -6 .4 -3.4 M8 -.2 C11 -3.4 9.6 -9.6 3.6 -9.8 C-1 -9.9 -2.4 -6 -.4 -3.4" stroke="${LAUGE}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M-4.4 -9.4 Q0 -10.8 4.4 -9.4" stroke="${LAUGE}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M-.4 -3.4 L-2 -.4 M.4 -3.4 L2 -.4" stroke="${LAUGE}" stroke-width="1.3" stroke-linecap="round"/>`;
  k += `<path d="M-3.6 -10.2 Q0 -11.6 3.6 -10.2" stroke="#e2a564" stroke-width=".7" fill="none" opacity=".7"/>`;
  for (let i = 0; i < 12; i++) k += `<rect x="${r(-7 + rnd() * 14)}" y="${r(-10.4 + rnd() * 4)}" width=".55" height=".4" fill="#fffaf0"/>`;
  S.teil({ oben: true, id: "brezel", de: "die Brezel", syl: "BRE-zel", it: "il pretzel", itSyl: "PRET-zel", en: "pretzel",
    x: 266, y: 178, steht: true, kunst: k, tipp: "Die schwäbische Brezel hat dünne Ärmchen und einen dicken Bauch." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/stuttgart.js"));
console.log(aus);
