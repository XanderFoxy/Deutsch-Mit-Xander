#!/usr/bin/env node
/* =====================================================================
   DAS MITTELALTER (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar.

   RECHERCHE (Lernhelfer „Die mittelalterliche Burg“, World History
   „Mittelalterliche Burgen“, Baunetz Wissen „Zunftzeichen“, Marktplätze
   in Oberwesel und Rothenburg) — so sah eine deutsche Burgstadt aus:
   - Die BURG: Burggraben mit ZUGBRÜCKE, dahinter das TORHAUS mit dem
     eisernen FALLGITTER, die RINGMAUER mit ZINNEN und Wehrgang, runde
     Ecktürme mit spitzem Schieferdach. Über allem der BERGFRIED, der
     höchste und sicherste Turm, oben mit Zinnenkranz und der FAHNE des
     Burgherrn; daneben der PALAS (Wohn- und Saalbau) mit Doppelfenstern.
   - Unten die Stadt: giebelständige FACHWERKHÄUSER mit steinernem
     Erdgeschoss; die oberen Geschosse kragen vor (Vorkragung), Balken-
     köpfe, Streben in Mann-Figur, kleine Fenster mit Butzenscheiben.
     Im Erdgeschoss Werkstätten und Läden mit Klappladen als Verkaufstisch.
   - ZUNFTZEICHEN hängen an schmiedeeisernen Auslegern: die goldene
     Brezel beim Bäcker, das Hufeisen beim Schmied.
   - Der Marktplatz mit Kopfsteinpflaster, ZIEHBRUNNEN mit Haspel, Dach
     und Eimer, MARKTSTAND mit Steinzeugkrügen (Siegburg), Brot, Käse,
     Äpfeln und Kerzen; Fässer.
   - Menschen: ein RITTER (Kettenhemd, Waffenrock, Eisenhut, Dreiecks-
     schild, Schwert), ein MÖNCH in Kutte mit Strick, der SCHMIED mit
     Lederschürze am Amboss vor der offenen Werkstatt.
   Maßstab: Augenhöhe y ≈ 96; Platz vorne (y 196) ≈ 31 Einheiten je
   Meter (Ritter 1,80 m), Häuser (y 126) ≈ 8 je Meter, Burg ≈ 4 je Meter
   (Tor 3 m breit, Bergfried 24 m hoch).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "mittelalter", titel: "Das Mittelalter", emoji: "🏰", thema: "Geschichte", kuerzel: "b23a", fassung: 852 });
const rnd = zufall(1250);
const r = B.r;
/* Zeichnen in Bildkoordinaten, abgelegt relativ zum Ankerpunkt des Teils */
const abs = (x, y, svg) => `<g transform="translate(${r(-x)} ${r(-y)})">${svg}</g>`;
/* Lupen-Teil aus einem Rechteck in Bildkoordinaten */
const ut = (w, x0, y0, x1, y1, extra) => Object.assign({ id: w[0], de: w[1], syl: w[2], it: w[3], itSyl: w[4], en: w[5], x: (x0 + x1) / 2, y: y1,
  kunst: flaeche(-(x1 - x0) / 2, -(y1 - y0), x1 - x0, y1 - y0) }, extra || {});

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
const HOLZ = S.lg("holz", [[0, "#9a6a3c"], [1, "#6e4626"]]);
const HOLZ_V = S.lg("holzv", [[0, "#7a5230"], [0.5, "#9b6c40"], [1, "#6a4424"]], 0, 0, 1, 0);
const BALKEN = "#4a2e1b";
const PUTZ = S.lg("putz", [[0, "#f3ead6"], [1, "#e2d4b6"]]);
const EISEN = S.lg("eisen", [[0, "#b9c0c6"], [0.5, "#8b939a"], [1, "#5e656c"]], 0, 0, 1, 0);
const ZIEGEL = S.lg("ziegel", [[0, "#a2492c"], [1, "#7a321c"]]);
const SCHIEFER = S.lg("schiefer", [[0, "#6b7682"], [0.5, "#4f5964"], [1, "#39414a"]], 0, 0, 1, 0);
const TURMRUND = S.lg("turmrund", [[0, "#d6c9ae"], [0.35, "#c3b498"], [1, "#857760"]], 0, 0, 1, 0);
const KRUSTE = S.rg("kruste", [[0, "#d9a05a"], [0.6, "#b06d2e"], [1, "#6e3e16"]], 0.4, 0.3, 0.8);

/* Steinmuster: Burgquader (fern) und Bruchstein (nah) */
S.def(`<pattern id="${S.id("quader")}" width="9" height="5" patternUnits="userSpaceOnUse"><rect width="9" height="5" fill="#bfb197"/><rect x=".5" y=".5" width="3.6" height="1.7" fill="#cbbfa6"/><rect x="5" y="3" width="3" height="1.6" fill="#ad9f84"/><path d="M0 .25H9M0 2.75H9M4.5 .25V2.75M1.5 2.75V5M7.5 2.75V5" stroke="#857760" stroke-width=".3"/></pattern>`);
S.def(`<pattern id="${S.id("bruch")}" width="12" height="7" patternUnits="userSpaceOnUse"><rect width="12" height="7" fill="#8f8270"/><rect x=".4" y=".4" width="5" height="2.8" rx="1" fill="#b3a68f"/><rect x="5.9" y=".5" width="5.6" height="2.7" rx="1" fill="#a5977f"/><rect x="-2.5" y="3.7" width="5.2" height="2.9" rx="1" fill="#a99c85"/><rect x="3.2" y="3.7" width="4.6" height="2.9" rx="1" fill="#bcae96"/><rect x="8.3" y="3.6" width="5.2" height="3" rx="1" fill="#9e9079"/></pattern>`);
S.def(`<pattern id="${S.id("butzen")}" width="1.5" height="1.5" patternUnits="userSpaceOnUse"><rect width="1.5" height="1.5" fill="#5d6a5c"/><circle cx=".75" cy=".75" r=".62" fill="#93a593"/><circle cx=".55" cy=".55" r=".2" fill="#e6efe2" opacity=".7"/></pattern>`);
S.def(`<pattern id="${S.id("schindel")}" width="3" height="2.4" patternUnits="userSpaceOnUse"><rect width="3" height="2.4" fill="#6a4a2e"/><path d="M0 2.3H3M1.5 0V1.2M0 1.2H3M0 1.2V2.4M3 1.2V2.4" stroke="#47301c" stroke-width=".3"/></pattern>`);
S.def(`<pattern id="${S.id("dachz")}" width="3.2" height="2.6" patternUnits="userSpaceOnUse"><rect width="3.2" height="2.6" fill="#94422a"/><path d="M0 2.5H3.2M1.6 0V1.3M0 1.3H3.2" stroke="#6a2b17" stroke-width=".35"/></pattern>`);
const QUADER = `url(#${S.id("quader")})`, BRUCH = `url(#${S.id("bruch")})`, BUTZEN = `url(#${S.id("butzen")})`, SCHINDEL = `url(#${S.id("schindel")})`, DACHZ = `url(#${S.id("dachz")})`;

/* =====================================================================
   KULISSE — Himmel, Hügel, Burgfelsen, Kopfsteinpflaster in Flucht
   ===================================================================== */
S.hinten(`<rect x="0" y="0" width="320" height="130" fill="${S.lg("himmel", [[0, "#6fa3d6"], [0.7, "#bcd6ea"], [1, "#e7eef0"]])}"/>`);
S.hinten(`<g filter="url(#${S.id("wolke")})" opacity=".9"><ellipse cx="70" cy="18" rx="30" ry="6" fill="#fff"/><ellipse cx="88" cy="13" rx="16" ry="5" fill="#fff"/><ellipse cx="292" cy="30" rx="26" ry="5" fill="#fff" opacity=".8"/><ellipse cx="170" cy="8" rx="18" ry="3.5" fill="#fff" opacity=".7"/></g>`);
/* ferne Hügel mit Wald */
S.hinten(`<path d="M0 96 Q40 80 90 88 Q140 74 200 84 Q260 72 320 82 L320 120 L0 120 Z" fill="${S.lg("huegel", [[0, "#8fa98e"], [1, "#6f8f6c"]])}"/>`);
{
  let w = "";
  for (let i = 0; i < 46; i++) { const x = rnd() * 320, y = 86 + rnd() * 14; w += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(2 + rnd() * 2.5)}" ry="${r(1.6 + rnd() * 1.4)}" fill="${rnd() < 0.5 ? "#5f7f5c" : "#6d8c69"}" opacity=".8"/>`; }
  S.hinten(w);
}
/* Burgfelsen: der Hügel, auf dem die Burg steht */
S.hinten(`<path d="M104 124 Q114 108 128 104 L320 100 L320 124 Z" fill="${S.lg("fels", [[0, "#8a8a62"], [1, "#6c6a4a"]])}"/>`);
/* Kopfsteinpflaster: Bänder mit wachsender Steingröße (Flucht) */
S.def(`<pattern id="${S.id("pflaster")}" width="8" height="5" patternUnits="userSpaceOnUse"><rect width="8" height="5" fill="#6b6359"/><rect x=".4" y=".4" width="3.4" height="2" rx=".9" fill="#a0968a"/><rect x="4.2" y=".4" width="3.4" height="2" rx=".9" fill="#ada395"/><rect x="-1.6" y="2.9" width="3.4" height="1.8" rx=".9" fill="#a69c8f"/><rect x="2.2" y="2.9" width="3.4" height="1.8" rx=".9" fill="#968c80"/><rect x="6" y="2.9" width="3.4" height="1.8" rx=".9" fill="#a69c8f"/></pattern>`);
{
  let g = "";
  [[118, 128, 0.35], [128, 142, 0.5], [142, 162, 0.7], [162, 200, 1]].forEach(([a, b, s], i) => {
    S.def(`<pattern id="${S.id("pfl" + i)}" href="#${S.id("pflaster")}" patternTransform="scale(${s})"/>`);
    g += `<rect x="0" y="${a}" width="320" height="${b - a}" fill="url(#${S.id("pfl" + i)})"/>`;
  });
  /* Licht und Staub: hinten heller, vorne kräftiger */
  g += `<rect x="0" y="118" width="320" height="82" fill="${S.lg("platzlicht", [[0, "#e9dcc0", 0.45], [0.5, "#e9dcc0", 0.1], [1, "#2a2016", 0.12]])}"/>`;
  S.hinten(g);
}
/* Weg vom Burgtor herab auf den Platz */
S.hinten(`<path d="M196 116 L214 116 L230 126 L184 126 Z" fill="${S.lg("weg", [[0, "#a58f6c"], [1, "#8e7a5c"]])}"/>`);

/* =====================================================================
   1 — DIE BURG (Lupe: Bergfried, Palas, Torhaus, Fallgitter, Zugbrücke,
       Ringmauer, Zinne, Burggraben, Fahne)
   ===================================================================== */
const zinnen = (x0, x1, y, h = 3.4, w = 3, gap = 2.2, fill = QUADER) => {
  let g = "";
  for (let x = x0; x + w <= x1 + 0.01; x += w + gap) g += `<rect x="${r(x)}" y="${r(y - h)}" width="${w}" height="${h}" fill="${fill}"/><rect x="${r(x)}" y="${r(y - h)}" width="${w}" height=".7" fill="#e3d8c2" opacity=".7"/>`;
  return g;
};
const rundturm = (cx, rr, yTop, yBase, dachH) => {
  let g = `<rect x="${cx - rr}" y="${yTop}" width="${rr * 2}" height="${yBase - yTop}" fill="${QUADER}"/>`;
  g += `<rect x="${cx - rr}" y="${yTop}" width="${rr * 2}" height="${yBase - yTop}" fill="${TURMRUND}" opacity=".75"/>`;
  g += `<rect x="${cx - 1}" y="${yTop + 8}" width="1.4" height="4" rx=".7" fill="#2a241d"/><rect x="${cx + rr * 0.35}" y="${yTop + 20}" width="1.2" height="3.6" rx=".6" fill="#2a241d"/>`;
  /* Kegeldach aus Schiefer mit Knauf */
  g += `<path d="M${cx - rr - 1.6} ${yTop + 0.6} L${cx} ${yTop - dachH} L${cx + rr + 1.6} ${yTop + 0.6} Q${cx} ${yTop + 2.6} ${cx - rr - 1.6} ${yTop + 0.6} Z" fill="${SCHIEFER}"/>`;
  g += `<path d="M${cx} ${yTop - dachH} L${cx - rr * 0.5} ${yTop + 1.4}" stroke="#8c97a2" stroke-width=".5" opacity=".6"/>`;
  g += `<line x1="${cx}" y1="${yTop - dachH}" x2="${cx}" y2="${yTop - dachH - 3}" stroke="#3a3a3a" stroke-width=".4"/><circle cx="${cx}" cy="${yTop - dachH - 3}" r=".7" fill="#c9a33a"/>`;
  return g;
};
{
  let k = "";
  /* Wirtschaftsbau hinter der Mauer rechts */
  k += `<path d="M268 76 L268 62 L292 62 L292 76 Z" fill="${QUADER}"/><path d="M266 63 L280 52 L294 63 Z" fill="${DACHZ}"/>`;
  /* der BERGFRIED: höchster Turm, Zinnenkranz, Fahne */
  k += `<rect x="236" y="22" width="26" height="56" fill="${QUADER}"/>`;
  k += `<rect x="236" y="22" width="26" height="56" fill="${S.lg("bfl", [[0, "#fff", 0.18], [0.5, "#fff", 0], [1, "#000", 0.22]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="234.6" y="21" width="28.8" height="2.4" fill="#a99b80"/>`;
  for (let i = 0; i < 5; i++) k += `<path d="M${235.5 + i * 6.4} 23.4 l1.6 0 l-.6 1.6 Z" fill="#7c6f5a"/>`;
  k += zinnen(234.6, 263.4, 21, 3.6, 3.2, 2.2);
  k += `<rect x="247" y="34" width="2" height="5" rx="1" fill="#2a241d"/><rect x="247" y="50" width="2" height="5" rx="1" fill="#2a241d"/><rect x="254" y="62" width="1.6" height="4" rx=".8" fill="#2a241d"/>`;
  /* Fahnenstange und Fahne (Wappenfarben Rot-Gold) */
  k += `<line x1="249" y1="17.5" x2="249" y2="2.5" stroke="#4a3a2a" stroke-width=".7"/><circle cx="249" cy="2.4" r=".6" fill="#c9a33a"/>`;
  k += `<path d="M249.3 3 Q254 1.6 258 3.4 Q262 5 266 3.6 L266 11 Q262 12.4 258 10.8 Q254 9.2 249.3 10.4 Z" fill="${S.lg("fahne", [[0, "#b8281f"], [0.5, "#d33a2c"], [1, "#9a1d16"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M249.3 6 Q254 4.6 258 6.4 Q262 8 266 6.6 L266 8.2 Q262 9.6 258 8 Q254 6.2 249.3 7.6 Z" fill="#e8c24a"/>`;
  /* der PALAS: Saalbau mit Doppelfenstern und steilem Ziegeldach */
  k += `<rect x="146" y="50" width="44" height="28" fill="${QUADER}"/><rect x="146" y="50" width="44" height="28" fill="${S.lg("pal", [[0, "#fff", 0.12], [1, "#000", 0.12]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M143 51 L150 30 L186 30 L193 51 Z" fill="${DACHZ}"/><path d="M143 51 L150 30 L186 30 L193 51 Z" fill="${S.lg("paldach", [[0, "#000", 0], [1, "#000", 0.25]])}"/>`;
  k += `<rect x="150" y="29" width="36" height="1.4" fill="#5e2414"/>`;
  for (const fx of [154, 166, 178]) {
    k += `<path d="M${fx - 3.4} 66 L${fx - 3.4} 58.6 Q${fx - 1.7} 56 ${fx} 58.6 Q${fx + 1.7} 56 ${fx + 3.4} 58.6 L${fx + 3.4} 66 Z" fill="#2c2620"/>`;
    k += `<rect x="${fx - 0.35}" y="58" width=".7" height="8" fill="#bfb197"/><rect x="${fx - 4}" y="66" width="8" height="1" fill="#d5c9b0"/>`;
  }
  k += `<rect x="164.5" y="38" width="7" height="6" fill="${DACHZ}"/><path d="M163.5 38.4 L168 34 L172.5 38.4 Z" fill="#7a321c"/><rect x="166.4" y="39.6" width="3.2" height="3.6" fill="#2c2620"/>`;
  /* die RINGMAUER mit Zinnen, Wehrgang-Löchern und Schießscharten */
  k += `<rect x="120" y="76" width="200" height="31" fill="${QUADER}"/>`;
  k += `<rect x="120" y="76" width="200" height="31" fill="${S.lg("mauerlicht", [[0, "#fff", 0.1], [0.7, "#000", 0.05], [1, "#2b3a1c", 0.3]])}"/>`;
  k += zinnen(121, 319, 76);
  for (let x = 128; x < 318; x += 11) if (x < 186 || x > 226) k += `<rect x="${x}" y="78.6" width="1.4" height="1.4" fill="#4a4033"/>`;
  for (const x of [160, 176, 240, 262, 284, 306]) k += `<rect x="${x}" y="88" width="1" height="5" rx=".5" fill="#2a241d"/>`;
  /* Moos und Wasserflecken am Mauerfuß */
  k += `<path d="M120 103 Q160 100 200 104 Q250 100 320 103 L320 107 L120 107 Z" fill="#5d6b3e" opacity=".45"/>`;
  /* Ecktürme */
  k += rundturm(131, 11, 54, 108, 20);
  k += rundturm(308, 11, 56, 108, 19);
  /* das TORHAUS mit Zinnen und Pechnase */
  k += `<rect x="190" y="50" width="32" height="57" fill="${QUADER}"/><rect x="190" y="50" width="32" height="57" fill="${S.lg("tor", [[0, "#fff", 0.16], [0.5, "#fff", 0], [1, "#000", 0.2]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="188.8" y="49" width="34.4" height="2" fill="#a99b80"/>` + zinnen(188.8, 223.2, 49, 3.6, 3, 2.2);
  k += `<rect x="200.5" y="66" width="11" height="6" fill="#a99b80"/><rect x="201" y="71.6" width="10" height="1.4" fill="#2a241d"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${201.4 + i * 2.6} 72 l1.2 0 l-.6 1.6 Z" fill="#8a7c66"/>`;
  k += `<rect x="195" y="57" width="1.6" height="4.4" rx=".8" fill="#2a241d"/><rect x="215.4" y="57" width="1.6" height="4.4" rx=".8" fill="#2a241d"/>`;
  /* Toröffnung (Rundbogen) mit Keilsteinen */
  k += `<path d="M199 107 L199 92 Q199 86 205 86 Q211 86 211 92 L211 107 Z" fill="#1e1a15"/>`;
  k += `<path d="M197.6 92 Q197.6 84.6 205 84.6 Q212.4 84.6 212.4 92" fill="none" stroke="#d3c6ac" stroke-width="1.4"/>`;
  for (let i = 0; i <= 6; i++) { const a = Math.PI - i * Math.PI / 6; k += `<line x1="${r(205 + Math.cos(a) * 6.2)}" y1="${r(92 - Math.sin(a) * 6.2)}" x2="${r(205 + Math.cos(a) * 7.8)}" y2="${r(92 - Math.sin(a) * 7.8)}" stroke="#8a7c66" stroke-width=".3"/>`; }
  /* Blick durch das Tor in den sonnigen Burghof */
  k += `<path d="M201 107 L201 98 L209 98 L209 107 Z" fill="${S.lg("hof", [[0, "#8c8467"], [1, "#b3a77f"]])}" opacity=".85"/>`;
  /* das FALLGITTER — halb hochgezogen, mit eisernen Spitzen */
  let fg = "";
  for (let x = 200.2; x < 210.5; x += 1.9) fg += `<rect x="${r(x)}" y="86.8" width=".55" height="10" fill="#2f2a26"/><path d="M${r(x - 0.1)} 96.8 l.38 1.4 l.38 -1.4 Z" fill="#2f2a26"/>`;
  for (let y = 88.6; y < 97; y += 2.4) fg += `<rect x="199.4" y="${r(y)}" width="11.2" height=".5" fill="#3b3530"/>`;
  k += fg;
  /* Ketten der Zugbrücke */
  k += `<path d="M199.6 86.4 L196.4 115.4 M210.4 86.4 L213.6 115.4" stroke="#3a3632" stroke-width=".55" stroke-dasharray=".9 .35"/>`;
  k += `<circle cx="199.6" cy="86.4" r=".7" fill="#2a241d"/><circle cx="210.4" cy="86.4" r=".7" fill="#2a241d"/>`;
  /* der BURGGRABEN mit Wasser, Ufer und Spiegelung */
  k += `<path d="M118 107 L320 107 L320 116 L114 116 Z" fill="${S.lg("graben", [[0, "#3d5a52"], [0.5, "#4f7068"], [1, "#6e8a7c"]])}"/>`;
  k += `<path d="M126 109 h40 M222 110 h50 M150 112.6 h30 M240 113 h40 M290 109.6 h20" stroke="#a9c4bd" stroke-width=".4" opacity=".7"/>`;
  k += `<rect x="200" y="107.6" width="10" height="3" fill="#1e1a15" opacity=".35"/>`;
  k += `<path d="M114 116 L320 116 L320 119.5 Q220 121 114 119.5 Z" fill="${S.lg("ufer", [[0, "#7b7556"], [1, "#6b6a45"]])}"/>`;
  /* die ZUGBRÜCKE, heruntergelassen */
  k += `<path d="M198.6 107 L211.4 107 L214.4 116.6 L195.6 116.6 Z" fill="${S.lg("bruecke", [[0, "#7a5636"], [1, "#9a7048"]])}"/>`;
  for (let i = 1; i < 8; i++) { const t = i / 8, y = 107 + t * 9.6, xl = 198.6 - t * 3, xr = 211.4 + t * 3; k += `<line x1="${r(xl)}" y1="${r(y)}" x2="${r(xr)}" y2="${r(y)}" stroke="#4a321e" stroke-width=".3"/>`; }
  k += `<path d="M198.6 107 L195.6 116.6 M211.4 107 L214.4 116.6" stroke="#3e2a18" stroke-width=".9"/>`;
  k += `<rect x="195" y="116.4" width="20" height="1.4" fill="#4a321e"/>`;
  const unter = [
    ut(["bergfried", "der Bergfried", "BERG-fried", "il mastio", "MA-stio", "keep"], 235, 22, 263, 76, { tipp: "Der Bergfried ist der höchste und sicherste Turm der Burg." }),
    ut(["palas", "der Palas", "PA-las", "il palazzo", "pa-LAZ-zo", "great hall"], 146, 30, 190, 74, { tipp: "Im Palas wohnte der Burgherr; dort lag auch der große Saal." }),
    ut(["fahne", "die Fahne", "FAH-ne", "la bandiera", "ban-DIE-ra", "flag"], 249, 1.5, 267, 12.5),
    ut(["torhaus", "das Torhaus", "TOR-haus", "il torrione della porta", "tor-RIO-ne del-la POR-ta", "gatehouse"], 190, 50, 222, 84),
    ut(["fallgitter", "das Fallgitter", "FALL-git-ter", "la saracinesca", "sa-ra-ci-NE-sca", "portcullis"], 198.5, 85.5, 211.5, 99, { tipp: "Das eiserne Fallgitter konnte man in Sekunden herunterlassen." }),
    ut(["zugbruecke", "die Zugbrücke", "ZUG-brü-cke", "il ponte levatoio", "PON-te le-va-TO-io", "drawbridge"], 195.5, 103, 214.5, 117.6, { tipp: "Bei Gefahr zog man die Zugbrücke an Ketten hoch." }),
    ut(["ringmauer", "die Ringmauer", "RING-mau-er", "la cinta muraria", "CIN-ta mu-RA-ria", "curtain wall"], 266, 79, 296, 105),
    ut(["zinne", "die Zinne", "ZIN-ne", "il merlo", "MER-lo", "battlement"], 224, 71.5, 236, 76.5, { tipp: "Hinter den Zinnen konnten sich die Verteidiger schützen." }),
    ut(["burggraben", "der Burggraben", "BURG-gra-ben", "il fossato", "fos-SA-to", "moat"], 222, 107.5, 262, 116),
  ];
  S.teil({ id: "burg", de: "die Burg", syl: "BURG", it: "il castello", itSyl: "ca-STEL-lo", en: "castle", x: 216, y: 119, kunst: abs(216, 119, k),
    zoom: { x: 118, y: 0, w: 186, h: 122 }, unter,
    tipp: "Wehrbau: Ringmauer mit Zinnen, Bergfried, Torhaus, Zugbrücke." });
}

/* =====================================================================
   Fachwerk: ein Geschoss mit Ständern, Riegeln, Streben und Fenstern
   ===================================================================== */
function fachwerk(x0, x1, y0, y1, felder, fenster, mann) {
  const fw = (x1 - x0) / felder;
  let g = `<rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="${PUTZ}"/>`;
  const mitte = (y0 + y1) / 2 + 0.6;
  for (let i = 0; i < felder; i++) {
    const a = x0 + i * fw, b = a + fw;
    if (fenster.includes(i)) {
      /* Fenster mit Butzenscheiben und Klappläden */
      const fy0 = y0 + (y1 - y0) * 0.22, fy1 = y1 - (y1 - y0) * 0.24;
      g += `<rect x="${r(a + 1.2)}" y="${r(fy0)}" width="${r(fw - 2.4)}" height="${r(fy1 - fy0)}" fill="${BUTZEN}"/>`;
      g += `<rect x="${r(a + 1.2)}" y="${r(fy0)}" width="${r(fw - 2.4)}" height="${r(fy1 - fy0)}" fill="none" stroke="${BALKEN}" stroke-width=".7"/><line x1="${r(a + fw / 2)}" y1="${r(fy0)}" x2="${r(a + fw / 2)}" y2="${r(fy1)}" stroke="${BALKEN}" stroke-width=".5"/>`;
      g += `<path d="M${r(a + 1.6)} ${r(fy0 + 0.6)} L${r(a + fw / 2 - 0.8)} ${r(fy0 + 0.6)} L${r(a + 1.6)} ${r(fy1 - 2)} Z" fill="#fff" opacity=".18"/>`;
      g += `<rect x="${r(a + 0.6)}" y="${r(fy1)}" width="${r(fw - 1.2)}" height=".9" fill="#6a4426"/>`;
    } else {
      g += `<rect x="${r(a)}" y="${r(mitte - 0.6)}" width="${r(fw)}" height="1.2" fill="${BALKEN}"/>`;
      if (mann && (i === 0 || i === felder - 1)) {
        const aussen = i === 0 ? a : b, innen = i === 0 ? b : a;
        g += `<path d="M${r(aussen)} ${r(y1)} L${r(innen)} ${r(mitte)} M${r(innen)} ${r(y0)} L${r(aussen)} ${r(mitte)}" stroke="${BALKEN}" stroke-width="1.2"/>`;
      } else if (i % 2 === 1) {
        g += `<path d="M${r(a)} ${r(y1)} L${r(b)} ${r(y0)}" stroke="${BALKEN}" stroke-width="1" opacity=".95"/>`;
      }
    }
  }
  for (let i = 0; i <= felder; i++) g += `<rect x="${r(x0 + i * fw - 0.7)}" y="${r(y0)}" width="1.4" height="${r(y1 - y0)}" fill="${BALKEN}"/>`;
  g += `<rect x="${r(x0 - 0.6)}" y="${r(y1 - 1.6)}" width="${r(x1 - x0 + 1.2)}" height="1.8" fill="${BALKEN}"/>`;
  g += `<rect x="${r(x0 - 0.6)}" y="${r(y0)}" width="${r(x1 - x0 + 1.2)}" height="1.5" fill="${BALKEN}"/>`;
  /* Balkenköpfe unter der Vorkragung */
  for (let i = 0; i <= felder * 2; i++) g += `<rect x="${r(x0 + i * fw / 2 - 0.7)}" y="${r(y1)}" width="1.4" height="1.1" fill="#5d3a22"/>`;
  return g;
}

/* =====================================================================
   2 — DAS FACHWERKHAUS (Bäckerhaus, giebelständig, links)
   ===================================================================== */
{
  const X0 = 9, X1 = 58, G = 126, cx = (X0 + X1) / 2;
  let k = schatten(cx, G, 32, 2, 0.25);
  /* Erdgeschoss aus Bruchstein mit Rundbogentür und Klappladen */
  k += `<rect x="${X0}" y="102" width="${X1 - X0}" height="${G - 102}" fill="${BRUCH}"/>`;
  k += `<rect x="${X0}" y="102" width="${X1 - X0}" height="${G - 102}" fill="${S.lg("eg1", [[0, "#000", 0.22], [0.3, "#000", 0], [1, "#000", 0.12]])}"/>`;
  /* Laden: heruntergeklappter Laden als Verkaufstisch mit Broten */
  k += `<g transform="translate(9 0)"><rect x="4" y="106" width="20" height="10" fill="#2a1f16"/><rect x="4" y="106" width="20" height="10" fill="none" stroke="#6b4a2e" stroke-width=".8"/>`;
  k += `<rect x="3" y="98.6" width="22" height="7.4" fill="${HOLZ_V}" stroke="#4a2e1b" stroke-width=".4"/>`;
  k += `<path d="M2.4 116 L25.6 116 L27 118.4 L1 118.4 Z" fill="${HOLZ}"/><rect x="1" y="118.4" width="26" height="1" fill="#4a2e1b"/>`;
  for (const [x, w] of [[7, 3.2], [13, 3.6], [19.6, 3]]) k += `<ellipse cx="${x}" cy="115.6" rx="${w}" ry="2" fill="${KRUSTE}"/>`;
  k += `<path d="M5 119.4 L3.4 126 M23 119.4 L24.6 126" stroke="#4a2e1b" stroke-width=".6"/></g>`;
  /* Tür */
  k += `<g transform="translate(6 0)"><path d="M34 ${G} L34 111 Q40 104 46 111 L46 ${G} Z" fill="${S.lg("tuer1", [[0, "#6b4426"], [1, "#4a2e18"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M32.6 111 Q40 102.4 47.4 111" fill="none" stroke="#c6b597" stroke-width="1.4"/>`;
  for (const x of [37, 40, 43]) k += `<line x1="${x}" y1="108" x2="${x}" y2="${G}" stroke="#3a2412" stroke-width=".35"/>`;
  k += `<path d="M34 114 h7 M34 121 h7" stroke="#2b2b2b" stroke-width=".7"/><circle cx="43.6" cy="117.6" r=".7" fill="#2b2b2b"/></g>`;
  /* Vorkragende Fachwerkgeschosse */
  k += fachwerk(X0 - 2, X1 + 2, 79, 101, 5, [1, 3], true);
  k += fachwerk(X0 - 4, X1 + 4, 57, 79, 5, [1, 2, 3], true);
  /* Giebel mit Fachwerk und Ladeluke, Ziegeldach an den Ortgängen */
  const gx0 = X0 - 6, gx1 = X1 + 6, gy = 57, top = 14;
  k += `<path d="M${gx0} ${gy} L${cx} ${top} L${gx1} ${gy} Z" fill="${PUTZ}"/>`;
  for (const y of [44, 31]) { const t = (gy - y) / (gy - top), hw = (gx1 - gx0) / 2 * (1 - t); k += `<rect x="${r(cx - hw)}" y="${y}" width="${r(hw * 2)}" height="1.4" fill="${BALKEN}"/>`; }
  k += `<rect x="${cx - 0.7}" y="${top + 2}" width="1.4" height="${gy - top - 2}" fill="${BALKEN}"/>`;
  for (const s of [-1, 1]) k += `<path d="M${cx + s * 6} ${gy} L${cx + s * 6} 44 M${cx + s * 14} ${gy} L${cx + s * 22} 44 M${cx + s * 3} 44 L${cx + s * 9} 31" stroke="${BALKEN}" stroke-width="1.1"/>`;
  k += `<rect x="${cx - 4.4}" y="46" width="3.8" height="7" fill="${BUTZEN}" stroke="${BALKEN}" stroke-width=".6"/><rect x="${cx + 0.6}" y="46" width="3.8" height="7" fill="${BUTZEN}" stroke="${BALKEN}" stroke-width=".6"/>`;
  k += `<rect x="${cx - 2.4}" y="33" width="4.8" height="5.6" fill="#3a2a1c" stroke="${BALKEN}" stroke-width=".6"/>`;
  k += `<path d="M${gx0 - 3} ${gy + 1.4} L${cx} ${top - 3.4} L${gx1 + 3} ${gy + 1.4}" fill="none" stroke="${ZIEGEL}" stroke-width="4" stroke-linejoin="miter"/>`;
  k += `<path d="M${gx0 - 3} ${gy + 3} L${cx} ${top - 1.6} L${gx1 + 3} ${gy + 3}" fill="none" stroke="#5a2414" stroke-width=".6"/>`;
  /* Aufzugsbalken für Mehlsäcke */
  k += `<rect x="${cx - 0.8}" y="${top + 4}" width="1.6" height="4" fill="#5d3a22"/><path d="M${cx} ${top + 8} v6" stroke="#6a5a48" stroke-width=".35"/>`;
  S.teil({ id: "fachwerkhaus", de: "das Fachwerkhaus", syl: "FACH-werk-haus", it: "la casa a graticcio", itSyl: "CA-sa a gra-TIC-cio", en: "half-timbered house", x: cx, y: G, kunst: abs(cx, G, k),
    tipp: "Ein Gerüst aus Holzbalken, die Felder dazwischen mit Lehm und Putz gefüllt." });
}

/* =====================================================================
   3 — DAS WOHNHAUS mit der offenen Schmiede im Erdgeschoss
   ===================================================================== */
{
  const X0 = 60, X1 = 120, G = 126, cx = (X0 + X1) / 2;
  let k = schatten(cx, G, 32, 2, 0.22);
  /* Dach (traufständig) mit Schornstein der Esse und Gaube */
  k += `<path d="M${X0 - 3} 82 L${X0 + 9} 54 L${X1 - 9} 54 L${X1 + 3} 82 Z" fill="${DACHZ}"/>`;
  k += `<path d="M${X0 - 3} 82 L${X0 + 9} 54 L${X1 - 9} 54 L${X1 + 3} 82 Z" fill="${S.lg("dach2", [[0, "#000", 0.25], [1, "#fff", 0.06]])}"/>`;
  k += `<rect x="${X0 + 9}" y="53" width="${X1 - X0 - 18}" height="1.6" fill="#5a2414"/>`;
  k += `<rect x="98" y="62" width="10" height="9" fill="${PUTZ}" stroke="${BALKEN}" stroke-width=".8"/><path d="M96.4 62.6 L103 57 L109.6 62.6 Z" fill="#7a321c"/><rect x="100.4" y="64" width="5.2" height="5.4" fill="${BUTZEN}" stroke="${BALKEN}" stroke-width=".5"/>`;
  k += `<rect x="72" y="44" width="6" height="16" fill="${S.lg("kamin", [[0, "#a65a3c"], [1, "#7c3f28"]], 0, 0, 1, 0)}"/><rect x="71.4" y="43" width="7.2" height="2" fill="#6a3420"/>`;
  k += `<g opacity=".55"><circle cx="75" cy="40" r="2.4" fill="#cfcac2"/><circle cx="78" cy="35" r="3.2" fill="#d9d5ce"/><circle cx="82.6" cy="30" r="3.8" fill="#e3e0da" opacity=".8"/></g>`;
  /* Fachwerk-Obergeschoss */
  k += fachwerk(X0 - 1.5, X1 + 1.5, 82, 104, 7, [1, 3, 5], true);
  /* Erdgeschoss: Bruchstein, offener Bogen der Werkstatt, Haustür */
  k += `<rect x="${X0}" y="104" width="${X1 - X0}" height="${G - 104}" fill="${BRUCH}"/>`;
  k += `<rect x="${X0}" y="104" width="${X1 - X0}" height="${G - 104}" fill="${S.lg("eg2", [[0, "#000", 0.22], [0.3, "#000", 0], [1, "#000", 0.1]])}"/>`;
  k += `<path d="M66 ${G} L66 112 Q80 103 94 112 L94 ${G} Z" fill="#1d1612"/>`;
  k += `<path d="M64.6 112 Q80 101.4 95.4 112" fill="none" stroke="#c6b597" stroke-width="1.4"/>`;
  /* Esse mit Glut und Blasebalg im Dunkel der Werkstatt */
  k += `<rect x="69" y="116" width="13" height="10" fill="#5e3a2a"/><rect x="69" y="115" width="13" height="2" fill="#7a4a34"/>`;
  k += `<ellipse cx="75.5" cy="115.4" rx="5" ry="1.8" fill="${S.rg("glut", [[0, "#fff3a0"], [0.4, "#ff9a2e"], [1, "#b8320e", 0]])}"/>`;
  k += `<ellipse cx="75.5" cy="113" rx="11" ry="7" fill="${S.rg("glutschein", [[0, "#ff8a2e", 0.45], [1, "#ff8a2e", 0]])}"/>`;
  k += `<path d="M84 119 L92 116 L92 122 Z" fill="#5a3b24"/><rect x="83" y="118.4" width="2" height="1.6" fill="#3a2a1a"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${86 + i * 1.6}" y="108" width=".5" height="6" fill="#565a5e"/>`;
  k += `<path d="M104 ${G} L104 110 Q109 105 114 110 L114 ${G} Z" fill="${S.lg("tuer2", [[0, "#5e3c22"], [1, "#43291a"]], 0, 0, 1, 0)}"/><circle cx="112" cy="118" r=".6" fill="#2b2b2b"/>`;
  k += `<path d="M104 114 h6 M104 121 h6" stroke="#2b2b2b" stroke-width=".6"/>`;
  S.teil({ id: "fachwerkhaus2", de: "das Wohnhaus", syl: "WOHN-haus", it: "la casa", itSyl: "CA-sa", en: "house", x: cx + 6, y: G, kunst: abs(cx, G, k),
    tipp: "Unten lag die Werkstatt, oben wohnte die Familie des Handwerkers." });
}

/* =====================================================================
   4 — DAS ZUNFTZEICHEN (Brezel am schmiedeeisernen Ausleger)
   ===================================================================== */
{
  let k = "";
  /* Ausleger mit Ranken */
  k += `<path d="M56 84 L76 84 M56 90 Q64 84 72 84" stroke="#2c2826" stroke-width=".9" fill="none"/>`;
  k += `<path d="M60 86.6 q2 -2.6 4 0 q-1.6 1.4 -2.6 0" stroke="#2c2826" stroke-width=".5" fill="none"/><circle cx="76" cy="84" r=".8" fill="#c9a33a"/>`;
  k += `<rect x="55" y="82.4" width="1.6" height="9" fill="#2c2826"/>`;
  k += `<path d="M71 84 L71 86.4 M75 84 L75 86.4" stroke="#2c2826" stroke-width=".35"/>`;
  /* Krone und goldene Brezel im Ring */
  k += `<path d="M69.8 87.6 L70.6 85.6 L72 87 L73 85.2 L74 87 L75.4 85.6 L76.2 87.6 Z" fill="#d9b23f" stroke="#8a6a1a" stroke-width=".2"/>`;
  const p = (dx, dy) => `${r(73 + dx * 1.2)} ${r(94.4 + dy * 1.2)}`;
  const bz = `M${p(-5, 4)} C${p(-8, 1)} ${p(-6, -5)} ${p(-1, -4.6)} C${p(3, -4.2)} ${p(4, 0)} ${p(1.2, 2.6)} M${p(5, 4)} C${p(8, 1)} ${p(6, -5)} ${p(1, -4.6)} C${p(-3, -4.2)} ${p(-4, 0)} ${p(-1.2, 2.6)}`;
  k += `<path d="${bz}" stroke="#a87b1c" stroke-width="1.7" fill="none" stroke-linecap="round"/><path d="${bz}" stroke="#f0cf5a" stroke-width=".7" fill="none" stroke-linecap="round" transform="translate(-.25 -.35)"/>`;
  S.teil({ oben: true, id: "zunftzeichen", de: "das Zunftzeichen", syl: "ZUNFT-zei-chen", it: "l'insegna della corporazione", itSyl: "in-SE-gna del-la cor-po-ra-ZIO-ne", en: "guild sign", x: 74, y: 100,
    kunst: abs(70, 100, k), tipp: "Jedes Handwerk hatte sein Zeichen: die Brezel beim Bäcker, das Hufeisen beim Schmied." });
}

/* =====================================================================
   5 — DER SCHMIED am Amboss vor seiner Werkstatt, 6 — DER AMBOSS
   ===================================================================== */
const SCHMIED = { x: 98, y: 141 };
{
  const m = B.mensch({ id: "b23a_schmied", geschlecht: "m", pose: "halten", blick: 38, bart: "voll", frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "hemd", farbe: "#d9cdb0" }, schuerze: { stueck: "schuerze", farbe: "#5a3a22" }, unterteil: { stueck: "hose", farbe: "#6b5a44" }, schuhe: { stueck: "stiefel", farbe: "#3e2c1e" } } }, 25);
  const hs = [m.z.handL, m.z.handR].map((h) => ({ x: h.x * m.k, y: h.y * m.k })).sort((a, b) => b.x - a.x);
  /* vordere Hand: Zange mit glühendem Eisen zum Amboss; hintere Hand: Hammer erhoben */
  const v = hs[0], h = hs[1];
  let werkzeug = `<path d="M${r(v.x)} ${r(v.y)} L${r(v.x + 6)} ${r(v.y + 3.2)} M${r(v.x)} ${r(v.y + 0.5)} L${r(v.x + 6)} ${r(v.y + 3.4)}" stroke="#2f2b28" stroke-width=".45"/>`;
  werkzeug += `<rect x="${r(v.x + 5.6)}" y="${r(v.y + 2.6)}" width="3.4" height="1" rx=".4" fill="#ff8a2e"/><rect x="${r(v.x + 6)}" y="${r(v.y + 2.8)}" width="2" height=".5" fill="#ffe07a"/>`;
  werkzeug += `<path d="M${r(h.x)} ${r(h.y)} L${r(h.x + 1.6)} ${r(h.y - 6.5)}" stroke="#6b4a2a" stroke-width=".7" stroke-linecap="round"/><rect x="${r(h.x + 0.2)}" y="${r(h.y - 7.6)}" width="3.6" height="1.8" rx=".3" fill="#4a4f55" transform="rotate(14 ${r(h.x + 1.6)} ${r(h.y - 6.5)})"/>`;
  S.teil({ id: "schmied", de: "der Schmied", syl: "SCHMIED", it: "il fabbro", itSyl: "FAB-bro", en: "blacksmith", x: SCHMIED.x, y: SCHMIED.y, kunst: m.svg + werkzeug,
    tipp: "Der Schmied macht aus glühendem Eisen Hufeisen, Nägel und Werkzeug." });
}
{
  let k = schatten(0, 0.2, 7, 1, 0.3);
  /* Holzklotz und Amboss mit Horn */
  k += `<path d="M-4 0 L-3.6 -6 L3.6 -6 L4 0 Z" fill="${HOLZ_V}"/><ellipse cx="0" cy="-6" rx="3.6" ry=".8" fill="#b88a58"/>`;
  k += `<path d="M-2.4 -6.4 L2.4 -6.4 L1.8 -8.4 L3.6 -9.4 L4.6 -10.6 L-3 -10.6 L-6.8 -10 Q-5 -9.4 -3 -9 L-1.8 -8.4 Z" fill="${S.lg("amboss", [[0, "#7c848b"], [0.4, "#4d545a"], [1, "#2c3135"]])}"/>`;
  k += `<rect x="-3" y="-10.9" width="7.6" height=".6" fill="#b3bcc4"/>`;
  k += `<rect x="-1" y="-11.6" width="3.6" height=".9" rx=".3" fill="#ff8a2e"/><rect x="-.4" y="-11.4" width="2" height=".4" fill="#ffe07a"/>`;
  S.teil({ oben: true, id: "amboss", de: "der Amboss", syl: "AM-boss", it: "l'incudine", itSyl: "in-CU-di-ne", en: "anvil", x: SCHMIED.x + 11, y: SCHMIED.y + 0.6, steht: true, kunst: k + flaeche(-7, -12, 14, 12.4) });
}

/* =====================================================================
   7 — DER MÖNCH (Kutte mit Kapuze und Strick, Buch) auf dem Weg zur Burg
   ===================================================================== */
{
  const H = 25;
  const m = B.mensch({ id: "b23a_moench", geschlecht: "m", pose: "gehen", blick: -40, frisur: "glatze", haarfarbe: "braun", haut: "hell",
    kleidung: { kleid: { stueck: "bademantel", farbe: "#5b4330" }, schuhe: { stueck: "sandale", farbe: "braun" }, zubehoer: { stueck: "buch", farbe: "#7a2a1e" } } }, H);
  const k = m.k;
  /* Kapuze hinter dem Nacken, Strick (Zingulum) um die Hüfte */
  const kap = `<path d="M${r(-9 * k)} ${r(-150 * k)} Q${r(-14 * k)} ${r(-142 * k)} ${r(-10 * k)} ${r(-132 * k)} L${r(8 * k)} ${r(-134 * k)} Q${r(10 * k)} ${r(-146 * k)} ${r(4 * k)} ${r(-150 * k)} Z" fill="#4a3424"/>`;
  const strick = `<path d="M${r(-12 * k)} ${r(-100 * k)} Q${r(0)} ${r(-96 * k)} ${r(13 * k)} ${r(-100 * k)}" stroke="#e9dfc6" stroke-width="${r(2.2 * k)}" fill="none"/><path d="M${r(4 * k)} ${r(-98 * k)} L${r(5 * k)} ${r(-70 * k)} M${r(7 * k)} ${r(-98 * k)} L${r(9 * k)} ${r(-74 * k)}" stroke="#e9dfc6" stroke-width="${r(1.6 * k)}"/>`;
  S.teil({ id: "moench", de: "der Mönch", syl: "MÖNCH", it: "il monaco", itSyl: "MO-na-co", en: "monk", x: 211, y: 141, kunst: kap + m.svg + strick,
    tipp: "Klöster waren im Mittelalter die Orte, an denen geschrieben und gelesen wurde." });
}

/* =====================================================================
   8 — DER BRUNNEN (Ziehbrunnen mit Haspel und Dach), 9 — DER EIMER
   ===================================================================== */
const BR = { x: 150, y: 178 };
{
  let k = schatten(2, 0.5, 26, 3, 0.32);
  /* Pfosten hinter dem Brunnenrand */
  k += `<rect x="-17.6" y="-66" width="3" height="50" fill="${HOLZ_V}"/><rect x="14.6" y="-66" width="3" height="50" fill="${HOLZ_V}"/>`;
  /* Haspel (Seilwalze) mit Kurbel */
  k += `<rect x="-15" y="-52" width="30" height="4" rx="2" fill="${S.lg("walze", [[0, "#b98a58"], [0.5, "#8a5e34"], [1, "#5e3c20"]])}"/>`;
  for (let x = -6; x <= 4; x += 1.1) k += `<line x1="${r(x)}" y1="-52" x2="${r(x + 0.5)}" y2="-48" stroke="#c9b28a" stroke-width=".45"/>`;
  k += `<path d="M17.6 -50 L22 -50 L22 -44 L24 -44" stroke="#3a3632" stroke-width=".9" fill="none" stroke-linecap="round"/>`;
  /* Seil hinab in den Schacht */
  k += `<line x1="-1" y1="-48" x2="-1" y2="-22" stroke="#c9b28a" stroke-width=".55"/>`;
  /* Schindeldach */
  k += `<path d="M-27 -62 L-22 -76 L22 -76 L27 -62 Z" fill="${SCHINDEL}"/><path d="M-27 -62 L-22 -76 L22 -76 L27 -62 Z" fill="${S.lg("brdach", [[0, "#000", 0.25], [1, "#fff", 0.08]])}"/>`;
  k += `<rect x="-23" y="-77.4" width="46" height="2" rx=".6" fill="#4a2e1b"/><rect x="-27.6" y="-62.6" width="55.2" height="1.6" fill="#3e2716"/>`;
  k += `<path d="M-15 -62 L-12 -66 M15 -62 L12 -66" stroke="#4a2e1b" stroke-width="1.2"/>`;
  /* Brunnenschacht: Steinring mit Rundung */
  k += `<ellipse cx="0" cy="-18" rx="20" ry="5.2" fill="#2a2520"/>`;
  k += `<path d="M-20 -18 L-20 -2 A20 5 0 0 0 20 -2 L20 -18 A20 5.2 0 0 1 -20 -18 Z" fill="${BRUCH}"/>`;
  k += `<path d="M-20 -18 L-20 -2 A20 5 0 0 0 20 -2 L20 -18 A20 5.2 0 0 1 -20 -18 Z" fill="${S.lg("ring", [[0, "#000", 0.38], [0.25, "#fff", 0.08], [0.6, "#000", 0.05], [1, "#000", 0.45]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="-18" rx="20" ry="5.2" fill="none" stroke="#c8bba0" stroke-width="2.2"/>`;
  k += `<ellipse cx="0" cy="-17.2" rx="15.6" ry="3.4" fill="${S.rg("tiefe", [[0, "#0f1416"], [0.7, "#24302e"], [1, "#3b3a33"]])}"/>`;
  k += `<ellipse cx="-2" cy="-16.6" rx="5" ry=".8" fill="#6f8a88" opacity=".35"/>`;
  k += `<path d="M-19 -19.4 A20 5.2 0 0 1 -6 -23" stroke="#efe6d2" stroke-width=".6" fill="none" opacity=".7"/>`;
  /* Pfosten vor dem Rand (vordere Hälfte) mit Stützen */
  k += `<rect x="-17.6" y="-19" width="3" height="3" fill="#7a5230"/><rect x="14.6" y="-19" width="3" height="3" fill="#7a5230"/>`;
  S.teil({ id: "brunnen", de: "der Brunnen", syl: "BRUN-nen", it: "il pozzo", itSyl: "POZ-zo", en: "well", x: BR.x, y: BR.y, steht: true, kunst: k,
    tipp: "Ein Ziehbrunnen: Mit der Kurbel zieht man den Eimer am Seil aus der Tiefe." });
}
{
  let k = `<path d="M-3 0 L-3.5 -6 L3.5 -6 L3 0 Z" fill="${S.lg("eimer", [[0, "#a77a48"], [0.5, "#8a6136"], [1, "#5e3e20"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="-6" rx="3.5" ry=".9" fill="#3a2a1a"/><ellipse cx="0" cy="-5.8" rx="2.8" ry=".5" fill="#4d6a70"/>`;
  k += `<rect x="-3.5" y="-5" width="7" height=".6" fill="#3a3632"/><rect x="-3.2" y="-1.6" width="6.4" height=".6" fill="#3a3632"/>`;
  k += `<path d="M-3.4 -6 Q0 -10.4 3.4 -6" stroke="#3a3632" stroke-width=".45" fill="none"/>`;
  S.teil({ oben: true, id: "eimer", de: "der Eimer", syl: "EI-mer", it: "il secchio", itSyl: "SEC-chio", en: "bucket", x: BR.x + 13, y: BR.y - 15.2, steht: true, kunst: k + flaeche(-4.5, -10, 9, 10.4) });
}

/* =====================================================================
   10 — DER MARKTSTAND (Lupe: Krug, Brot, Käse, Korb, Kerze)
   ===================================================================== */
const MS = { x: 262, y: 184 };
{
  let k = schatten(0, 0.5, 40, 3, 0.3);
  /* hintere Pfosten, Tisch auf Böcken, vordere Pfosten */
  k += `<rect x="-33" y="-64" width="2" height="38" fill="#6e4626"/><rect x="31" y="-64" width="2" height="38" fill="#6e4626"/>`;
  k += `<path d="M-37 -24 L37 -24 L34 -30 L-34 -30 Z" fill="${S.lg("platte", [[0, "#a7794a"], [1, "#c99a66"]])}"/>`;
  for (const x of [-20, -2, 16]) k += `<line x1="${x - 1}" y1="-30" x2="${x * 1.08 - 1}" y2="-24" stroke="#7d5530" stroke-width=".3"/>`;
  /* Leinentuch vor dem Tisch */
  k += `<path d="M-37.4 -24 L37.4 -24 L36.6 -9 Q27 -7.6 18 -9 Q9 -7.4 0 -9 Q-9 -7.4 -18 -9 Q-27 -7.6 -36.6 -9 Z" fill="${S.lg("tuch", [[0, "#ece2c8"], [1, "#d3c39f"]])}"/>`;
  for (const x of [-30, -21, -12, -3, 6, 15, 24, 32]) k += `<line x1="${x}" y1="-23.4" x2="${x + 0.6}" y2="-9.4" stroke="#bfae88" stroke-width=".5"/>`;
  k += `<rect x="-37.4" y="-24.4" width="74.8" height="1.6" fill="#a3322a"/>`;
  k += `<path d="M-30 -9 L-33 0 M-30 -9 L-27 0 M30 -9 L27 0 M30 -9 L33 0" stroke="#6e4626" stroke-width="1.6"/>`;
  /* Ware am Boden: Sack mit Getreide */
  k += `<path d="M-22 0 Q-24 -6 -20 -9 L-14 -9 Q-10 -6 -12 0 Z" fill="${S.lg("sack", [[0, "#d8c49a"], [1, "#a8915f"]])}"/><path d="M-20 -9 Q-17 -11 -14 -9" stroke="#8a744a" stroke-width=".6" fill="none"/>`;
  /* Waren auf dem Tisch (in der Lupe einzeln) */
  const T = -27;
  /* Steinzeugkrüge (salzglasiert, Siegburger Art) */
  const krug = (x, h, w, f) => `<path d="M${x - w * 0.5} ${T} Q${x - w * 0.72} ${T - h * 0.5} ${x - w * 0.42} ${T - h * 0.8} L${x - w * 0.3} ${T - h} L${x + w * 0.3} ${T - h} L${x + w * 0.42} ${T - h * 0.8} Q${x + w * 0.72} ${T - h * 0.5} ${x + w * 0.5} ${T} Z" fill="${f}"/>` +
    `<path d="M${x + w * 0.38} ${T - h * 0.88} Q${x + w * 0.95} ${T - h * 0.8} ${x + w * 0.5} ${T - h * 0.42}" stroke="#7d6a52" stroke-width=".7" fill="none"/>` +
    `<path d="M${x - w * 0.3} ${T - h * 0.6} Q${x - w * 0.36} ${T - h * 0.3} ${x - w * 0.2} ${T - h * 0.15}" stroke="#fff" stroke-width=".5" opacity=".4" fill="none"/>` +
    `<line x1="${x - w * 0.5}" y1="${T - h * 0.45}" x2="${x + w * 0.5}" y2="${T - h * 0.45}" stroke="#6e5a44" stroke-width=".3"/>`;
  const KRUGF = S.lg("krug", [[0, "#cdb99a"], [0.45, "#b29a76"], [1, "#7e6a50"]], 0, 0, 1, 0);
  const KRUGB = S.lg("krugb", [[0, "#9a7a58"], [0.45, "#7a5a3a"], [1, "#4e3824"]], 0, 0, 1, 0);
  k += krug(-30, 10, 6, KRUGF) + krug(-23.4, 8, 5.4, KRUGB) + krug(-17.4, 11, 6, KRUGF);
  /* Brote */
  for (const [x, y, w] of [[-8.6, 0, 4.4], [-1.4, 0, 4.2], [-5, -3.2, 4]]) {
    k += `<path d="M${x - w} ${T + y} Q${x - w} ${T + y - 4.6} ${x} ${T + y - 4.6} Q${x + w} ${T + y - 4.6} ${x + w} ${T + y} Z" fill="${KRUSTE}"/>`;
    k += `<path d="M${x - 2} ${T + y - 3} q2 -1 4 0" stroke="#6e3e16" stroke-width=".4" fill="none"/>`;
  }
  /* Käselaibe und ein angeschnittener Laib */
  const KAESE = S.lg("kaese", [[0, "#efcf6a"], [1, "#c99d34"]]);
  k += `<rect x="4" y="${T - 3}" width="10" height="3" rx="1.2" fill="${KAESE}"/><ellipse cx="9" cy="${T - 3}" rx="5" ry="1" fill="#f3da86"/>`;
  k += `<rect x="4.6" y="${T - 6}" width="8.8" height="3" rx="1.2" fill="${KAESE}"/><ellipse cx="9" cy="${T - 6}" rx="4.4" ry=".9" fill="#f3da86"/>`;
  k += `<path d="M14.6 ${T} L19.6 ${T} L14.6 ${T - 3} Z" fill="#f6e3a0" stroke="#c99d34" stroke-width=".3"/>`;
  /* Weidenkorb mit Äpfeln */
  k += `<path d="M21 ${T - 5} L33 ${T - 5} L31.6 ${T} L22.4 ${T} Z" fill="${S.lg("korb", [[0, "#d3a35b"], [1, "#9b6b2c"]])}"/>`;
  for (let i = 0; i < 5; i++) k += `<line x1="${22 + i * 2.6}" y1="${T - 5}" x2="${22.8 + i * 2.3}" y2="${T}" stroke="#8a5c22" stroke-width=".3"/>`;
  k += `<path d="M21.4 ${T - 4.6} Q27 ${T - 13} 32.6 ${T - 4.6}" stroke="#a7783a" stroke-width=".7" fill="none"/>`;
  for (const [x, y] of [[23.4, -6], [26, -6.4], [28.6, -6.1], [31, -5.8], [24.8, -8], [27.4, -8.2], [30, -7.8]]) k += `<circle cx="${x}" cy="${T + y}" r="1.35" fill="${S.rg("apfel", [[0, "#f07a52"], [0.6, "#c7301e"], [1, "#7a1a10"]], 0.35, 0.3, 0.75)}"/>`;
  /* Dachgestänge, Sonnensegel mit Bogenkante (Ocker und Rot) */
  k += `<rect x="-37" y="-64.6" width="74" height="1.6" fill="#5e3c20"/>`;
  k += `<path d="M-38 -66 L38 -66 L40 -56 L-40 -56 Z" fill="${S.lg("segel", [[0, "#c9a35a"], [1, "#b48a3e"]])}"/>`;
  for (let i = 0; i < 8; i++) k += `<path d="M${-38 + i * 9.5} -66 L${-38 + i * 9.5 + 4.75} -66 L${-40 + i * 10 + 5} -56 L${-40 + i * 10} -56 Z" fill="#9e3a2a" opacity=".85"/>`;
  let saum = `M-40 -56`;
  for (let i = 0; i < 8; i++) saum += ` Q${-40 + i * 10 + 5} -51.6 ${-40 + (i + 1) * 10} -56`;
  k += `<path d="${saum} Z" fill="#b48a3e"/><path d="${saum}" stroke="#7a5a26" stroke-width=".3" fill="none"/>`;
  /* Kerzenbündel an Schnüren unter dem Segel */
  for (const x of [-24, 24]) {
    k += `<line x1="${x}" y1="-55" x2="${x}" y2="-51" stroke="#6a5a48" stroke-width=".3"/>`;
    for (let i = -2; i <= 2; i++) k += `<path d="M${x + i * 1.1 - 0.4} -51 L${x + i * 1.1 + 0.4} -51 L${x + i * 1.6 + 0.4} ${-42 + Math.abs(i) * 0.6} L${x + i * 1.6 - 0.4} ${-42 + Math.abs(i) * 0.6} Z" fill="#f2e6c2" stroke="#d4c49a" stroke-width=".15"/>`;
  }
  /* vordere Pfosten */
  k += `<rect x="-38.6" y="-66" width="2.6" height="66" fill="${HOLZ_V}"/><rect x="36" y="-66" width="2.6" height="66" fill="${HOLZ_V}"/>`;
  const X = MS.x, Y = MS.y;
  const unter = [
    { id: "krug", de: "der Krug", syl: "KRUG", it: "la brocca", itSyl: "BROC-ca", en: "jug", x: X - 24, y: Y + T, kunst: flaeche(-9.6, -11.6, 19.2, 12), tipp: "Steinzeugkrüge aus Siegburg waren im Mittelalter in ganz Europa begehrt." },
    { id: "brot", de: "das Brot", syl: "BROT", it: "il pane", itSyl: "PA-ne", en: "bread", x: X - 5, y: Y + T, kunst: flaeche(-8, -8.6, 16, 9) },
    { id: "kaese", de: "der Käse", syl: "KÄ-se", it: "il formaggio", itSyl: "for-MAG-gio", en: "cheese", x: X + 11.6, y: Y + T, kunst: flaeche(-7.8, -8, 15.6, 8.4) },
    { id: "korb", de: "der Korb", syl: "KORB", it: "il cesto", itSyl: "CE-sto", en: "basket", x: X + 27, y: Y + T, kunst: flaeche(-6.6, -10.6, 13.2, 11) },
    { id: "kerze", de: "die Kerze", syl: "KER-ze", it: "la candela", itSyl: "can-DE-la", en: "candle", x: X - 24, y: Y - 41, kunst: flaeche(-4.6, -11, 9.2, 11), tipp: "Kerzen aus Bienenwachs waren teuer; einfache Leute nahmen Talg." },
  ];
  S.teil({ id: "marktstand", de: "der Marktstand", syl: "MARKT-stand", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "market stall", x: MS.x, y: MS.y, steht: true, kunst: k,
    zoom: { x: MS.x - 42, y: MS.y - 68, w: 84, h: 56 }, unter,
    tipp: "Auf dem Markt kaufte man, was die Handwerker der Stadt herstellten." });
}

/* =====================================================================
   11 — DAS FASS (Eichenfässer neben dem Stand)
   ===================================================================== */
{
  const fass = (x, y, h, w) => {
    let g = schatten(x, y, w * 0.7, 1.2, 0.3);
    g += `<path d="M${x - w * 0.42} ${y} Q${x - w * 0.55} ${y - h / 2} ${x - w * 0.42} ${y - h} L${x + w * 0.42} ${y - h} Q${x + w * 0.55} ${y - h / 2} ${x + w * 0.42} ${y} Z" fill="${S.lg("fass", [[0, "#6e4626"], [0.35, "#a7743f"], [1, "#4e301a"]], 0, 0, 1, 0)}"/>`;
    for (let i = -2; i <= 2; i++) g += `<path d="M${r(x + i * w * 0.17)} ${y} Q${r(x + i * w * 0.22)} ${r(y - h / 2)} ${r(x + i * w * 0.17)} ${y - h}" stroke="#4a2e18" stroke-width=".3" fill="none"/>`;
    for (const t of [0.12, 0.34, 0.66, 0.88]) { const ww = w * (0.42 + 0.13 * Math.sin(t * Math.PI)); g += `<path d="M${r(x - ww)} ${r(y - h * t)} Q${x} ${r(y - h * t + 1)} ${r(x + ww)} ${r(y - h * t)}" stroke="#3a3632" stroke-width="1" fill="none"/>`; }
    g += `<ellipse cx="${x}" cy="${y - h}" rx="${r(w * 0.42)}" ry="${r(w * 0.12)}" fill="#8a5e34" stroke="#3a3632" stroke-width=".6"/>`;
    return g;
  };
  const k = fass(-4, -7, 22, 15) + fass(4, 0, 25, 17);
  S.teil({ id: "fass", de: "das Fass", syl: "FASS", it: "la botte", itSyl: "BOT-te", en: "barrel", x: 309, y: 194, steht: true, kunst: k,
    tipp: "In Fässern lagerte man Wein, Bier, Salzheringe und Mehl." });
}

/* =====================================================================
   12 — DER RITTER (Lupe: Helm, Kettenhemd, Schild, Schwert)
   ===================================================================== */
{
  const RX = 44, RY = 196, H = 56;
  const m = B.mensch({ id: "b23a_ritter", geschlecht: "m", pose: "stehen", blick: 22, frisur: "kurz", haarfarbe: "braun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#8f969d" }, kleid: { stueck: "sommerkleid", farbe: "#a8322d" }, unterteil: { stueck: "hose", farbe: "#80878e" }, schuhe: { stueck: "stiefel", farbe: "#5f656b" }, kopf: { stueck: "helm", farbe: "#a3aab1" } } }, H);
  const k = m.k, P = (n) => ({ x: m.z.punkte[n][0] * k, y: m.z.punkte[n][1] * k });
  const hL = { x: m.z.handL.x * k, y: m.z.handL.y * k }, hR = { x: m.z.handR.x * k, y: m.z.handR.y * k };
  const kopf = { x: m.z.kopf.x * k, y: m.z.kopf.y * k };
  let k2 = "";
  /* Kettenhaube um das Gesicht */
  k2 += `<path fill-rule="evenodd" d="M${r(kopf.x - 4.2)} ${r(kopf.y - 1.6)} Q${r(kopf.x - 4.6)} ${r(kopf.y + 5.6)} ${r(kopf.x + 0.6)} ${r(kopf.y + 6.6)} Q${r(kopf.x + 5.4)} ${r(kopf.y + 5.4)} ${r(kopf.x + 4.6)} ${r(kopf.y - 1.6)} L${r(kopf.x + 3.2)} ${r(kopf.y - 1.4)} Q${r(kopf.x + 3.4)} ${r(kopf.y + 3.2)} ${r(kopf.x + 1)} ${r(kopf.y + 3.6)} Q${r(kopf.x - 1.8)} ${r(kopf.y + 3.4)} ${r(kopf.x - 1.6)} ${r(kopf.y - 1.4)} Z" fill="${S.lg("kette", [[0, "#aab1b8"], [1, "#6d747b"]])}"/>`;
  k2 += `<path d="M${r(kopf.x - 4)} ${r(kopf.y + 4.4)} Q${r(kopf.x + 0.6)} ${r(kopf.y + 8.6)} ${r(kopf.x + 4.8)} ${r(kopf.y + 4.2)}" stroke="#5c6369" stroke-width=".3" fill="none" stroke-dasharray=".4 .3"/>`;
  /* Wappen auf dem Waffenrock: goldener Löwe vereinfacht als Schrägbalken mit Sternen */
  const br = P("brust");
  k2 += `<path d="M${r(br.x - 5)} ${r(br.y - 1)} L${r(br.x - 3)} ${r(br.y - 2.2)} L${r(br.x + 2)} ${r(br.y + 8)} L${r(br.x)} ${r(br.y + 9.2)} Z" fill="#e8c24a" opacity=".9"/>`;
  /* Gürtel mit Schwertscheide */
  const gy = -0.53 * H;
  k2 += `<path d="M${r(-5.2)} ${r(gy)} Q0 ${r(gy + 1.2)} ${r(6.4)} ${r(gy - 0.2)}" stroke="#3a2416" stroke-width="1.1" fill="none"/><rect x="-.6" y="${r(gy - 0.4)}" width="1.8" height="1.4" fill="#c9a33a"/>`;
  /* das SCHWERT: Hand auf dem Knauf, Spitze am Boden */
  const sx = hR.x - 0.4;
  k2 += `<rect x="${r(sx - 0.55)}" y="${r(hR.y + 1.4)}" width="1.1" height="${r(-hR.y - 2.4)}" fill="${S.lg("klinge", [[0, "#eef2f5"], [0.5, "#b9c2ca"], [1, "#7c868e"]], 0, 0, 1, 0)}"/>`;
  k2 += `<path d="M${r(sx - 0.55)} -1 L${r(sx)} 0 L${r(sx + 0.55)} -1 Z" fill="#9aa3ab"/>`;
  k2 += `<rect x="${r(sx - 3.2)}" y="${r(hR.y + 1)}" width="6.4" height=".9" rx=".3" fill="#6b5a3a"/>`;
  k2 += `<circle cx="${r(sx)}" cy="${r(hR.y - 2.2)}" r=".9" fill="#c9a33a"/><rect x="${r(sx - 0.45)}" y="${r(hR.y - 1.6)}" width=".9" height="2.6" fill="#3a2416"/>`;
  /* der SCHILD: Dreiecksschild, an der linken Hand gehalten */
  const shx = hL.x + 2.2, shy = hL.y - 1;
  const schild = `M${r(shx - 7)} ${r(shy)} L${r(shx + 7)} ${r(shy)} L${r(shx + 7)} ${r(shy + 9)} Q${r(shx + 6)} ${r(shy + 17)} ${r(shx)} ${r(shy + 21)} Q${r(shx - 6)} ${r(shy + 17)} ${r(shx - 7)} ${r(shy + 9)} Z`;
  k2 += `<path d="${schild}" fill="${S.lg("schild", [[0, "#3a64a8"], [1, "#1f3f78"]], 0, 0, 1, 1)}" stroke="#c9a33a" stroke-width=".7"/>`;
  k2 += `<path d="M${r(shx - 7)} ${r(shy + 2)} L${r(shx - 4)} ${r(shy)} L${r(shx + 7)} ${r(shy + 13)} L${r(shx + 5.2)} ${r(shy + 15.4)} Z" fill="#f2f2ee"/>`;
  for (const [dx, dy] of [[3.6, 3.6], [-3.4, 10], [0.4, 15.6]]) k2 += `<circle cx="${r(shx + dx)}" cy="${r(shy + dy)}" r="1" fill="#e8c24a"/>`;
  k2 += `<path d="M${r(shx - 6)} ${r(shy + 1)} L${r(shx - 6)} ${r(shy + 8)}" stroke="#fff" stroke-width=".6" opacity=".35"/>`;
  k2 += `<path d="M${r(hL.x - 1.2)} ${r(hL.y - 0.4)} q1.4 -1.6 3 -.2" stroke="${S.lg("hand", [[0, "#e9bf9c"], [1, "#c99a74"]])}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  const kopfU = { x: RX + kopf.x, y: RY + kopf.y };
  const unter = [
    { id: "helm", de: "der Helm", syl: "HELM", it: "l'elmo", itSyl: "EL-mo", en: "helmet", x: kopfU.x, y: kopfU.y - 2, kunst: flaeche(-6, -6, 12, 6.4), tipp: "Ein Eisenhut: Die breite Krempe schützt vor Schlägen von oben." },
    { id: "kettenhemd", de: "das Kettenhemd", syl: "KET-ten-hemd", it: "la cotta di maglia", itSyl: "COT-ta di MA-glia", en: "chain mail", x: RX + kopf.x, y: RY + kopf.y + 8.4, kunst: flaeche(-5, -6, 10, 6.4), tipp: "Ein Kettenhemd besteht aus Tausenden kleiner Eisenringe." },
    { id: "schild", de: "der Schild", syl: "SCHILD", it: "lo scudo", itSyl: "SCU-do", en: "shield", x: RX + shx, y: RY + shy + 21, kunst: flaeche(-7.4, -21.4, 14.8, 21.8), tipp: "Auf dem Schild zeigt das Wappen, wer der Ritter ist." },
    { id: "schwert", de: "das Schwert", syl: "SCHWERT", it: "la spada", itSyl: "SPA-da", en: "sword", x: RX + sx, y: RY, kunst: flaeche(-3.4, hR.y + 0.4, 6.8, -hR.y - 0.4) },
  ];
  S.teil({ id: "ritter", de: "der Ritter", syl: "RIT-ter", it: "il cavaliere", itSyl: "ca-va-LIE-re", en: "knight", x: RX, y: RY, kunst: m.svg + k2,
    zoom: { x: RX - 42, y: RY - 60, w: 90, h: 62 }, unter,
    tipp: "Ritter kämpften zu Pferd und dienten einem Fürsten." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/mittelalter.js"));
console.log(aus);
