#!/usr/bin/env node
/* =====================================================================
   SCHLOSS NEUSCHWANSTEIN (FASSUNG 854) — Bilderwelt neu: Sehenswürdigkeit
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … als Profi-
   Grafikdesigner auf Hollywood-Niveau … mit größter Sorgfalt und
   Präzision auf höchstem Niveau“.

   STANDORT: das Ostende der MARIENBRÜCKE über der Pöllatschlucht
   (Schwangau, Ostallgäu) — das berühmteste Postkartenmotiv. Blick nach
   Norden über die Schlucht auf das Schloss, dahinter das flache
   Alpenvorland. Nachmittag im Oktober: Sonne von links (Südwest),
   Buchen gold, Fichten dunkelgrün, klare Föhnluft.

   RECHERCHE (Bayerische Schlösserverwaltung, Wikipedia „Schloss
   Neuschwanstein“ und „Marienbrücke“, Hohenschwangau.de):
   - DAS SCHLOSS: ab 1869 für König Ludwig II. gebaut, eine Kette von
     Bauten auf dem Felsgrat um einen unteren und oberen Hof: Torbau,
     Viereckturm, Ritterhaus (Nordseite des Hofs, Galerie mit
     Blendarkaden), Kemenate (Südseite, drei Geschosse, als „Damenhaus“
     gedacht) und der PALAS: fünf Geschosse, über 50 m lang, zwei
     Baukörper im flachen Winkel dem Felsgrat folgend, zwei hohe
     Satteldächer, achteckige Ecktürmchen, an der Westseite ein
     zweigeschossiger Söller (Balkon vor dem Thronsaal). In der Mitte der
     Hoffassade zwei Treppentürme; der nördliche, der NORDTURM, ist über
     65 m hoch und überragt das Dach um mehrere Stockwerke. Im vierten
     Stock liegt der SÄNGERSAAL (27 × 10 m) — außen als Reihe von
     Bogenfenstern mit Säulchen zu sehen.
   - VIERECKTURM 45 m, weiß, oben eine Aussichtsplattform mit einem
     kleinen Rundturm.
   - TORBAU: die Außenfassade aus ROTEN ZIEGELN (nie mit Kalkstein
     verkleidet), beidseitig Flankiertürme; die Hofseite gelber Kalkstein.
   - MATERIAL: Ziegelmauerwerk, verkleidet mit hellem Kalkstein vom
     nahen Alterschrofen; Dächer und Turmhelme mit grauem Schiefer,
     Spitzen mit vergoldeten Knäufen.
   - MARIENBRÜCKE: eiserne Fachwerkbrücke (1866 unter Ludwig II. statt
     der Holzbrücke seines Vaters Maximilian II.), etwa 90 m über dem
     Pöllatfall; Holzbohlen, Geländer aus Gitterwerk.
   - UMGEBUNG (echte Richtungen von der Brücke aus): das Schloss im
     Norden; dahinter nordnordwestlich der FORGGENSEE (Stausee am Lech,
     im Winter abgelassen), nordöstlich der Bannwaldsee; im Westen
     SCHLOSS HOHENSCHWANGAU (gelb, neugotisch, mit Zinnen; hier wuchs
     Ludwig auf) über dem ALPSEE; im Südwesten der SÄULING (2047 m,
     Kalkfels). In den Wiesen bei Schwangau die Wallfahrtskirche
     St. Coloman. Pferdekutschen fahren vom Dorf Hohenschwangau zum
     Schloss hinauf; auf den Wiesen Allgäuer Braunvieh mit Glocken.
   - BILDAUFBAU: Wie auf einem Panoramafoto ist der Blick
     zusammengeschoben: links Südwest (Säuling) und West (Alpsee,
     Hohenschwangau), in der Mitte Nordwest (St. Coloman, Forggensee),
     rechts Nord (das Schloss). Die Reihenfolge stimmt mit den
     Himmelsrichtungen überein; die Schlucht mit dem Wasserfall liegt
     unten (man schaut steil hinab).
   Maßstab: Schloss ≈ 1,6 Einheiten je Meter (Nordturm 65 m ≈ 104),
   Augenhöhe y 70 (≈ Höhe der Turmspitzen). Vorne am Brückenkopf
   ≈ 30 Einheiten je Meter (Wanderer 1,8 m).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "neuschwanstein", titel: "Schloss Neuschwanstein", emoji: "🏰", thema: "Deutschland", kuerzel: "nsw", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1869);
const r = B.r;
const HOR = 70;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation=".3"/></filter>`);
S.def(`<filter id="${S.id("gischt")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>`);

/* ---------- Stoffe ------------------------------------------------- */
const KALK = S.lg("kalk", [[0, "#fffdf6"], [0.6, "#f4efe3"], [1, "#e6dfcf"]]);
const KALK_SCHATTEN = S.lg("kalks", [[0, "#d3d5dc"], [1, "#b9bdc8"]]);
const KALK_RUND = S.lg("kalkrund", [[0, "#efe9dc"], [0.3, "#fffdf7"], [0.7, "#ddd9d0"], [1, "#aeb1b9"]], 0, 0, 1, 0);
const SCHIEFER = S.lg("schiefer", [[0, "#7d8692"], [0.5, "#646d7a"], [1, "#4b525e"]]);
const SCHIEFER_RUND = S.lg("schieferrund", [[0, "#8a939f"], [0.35, "#737c89"], [1, "#3f4650"]], 0, 0, 1, 0);
const ZIEGEL = S.lg("ziegel", [[0, "#c25f42"], [1, "#a24a33"]]);
const ZIEGEL_RUND = S.lg("ziegelrund", [[0, "#c96a4c"], [0.35, "#d27756"], [1, "#8a3c28"]], 0, 0, 1, 0);
const GLAS = S.lg("glas", [[0, "#56657a"], [1, "#2e3846"]]);
const GOLD = S.lg("gold", [[0, "#f6dd84"], [1, "#b48a2c"]]);
const FELS = S.lg("fels", [[0, "#e4ddcf"], [0.5, "#cdc4b3"], [1, "#a69b88"]], 0, 0, 1, 0);

/* Punkt in Vieleck (für das Verstreuen von Bäumen) */
const drin = (x, y, poly) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const pfad = (pts) => "M" + pts.map(([x, y]) => `${r(x)} ${r(y)}`).join(" L") + " Z";

/* Herbstwald: Kronen (Buche gold, Lärche gelb, Fichte dunkel), Licht von links */
const LAUB = ["#e2a93a", "#d48a2a", "#efc458", "#c96e26", "#b5892e", "#9a5a22"];
const NADEL = ["#2e4a33", "#3a5a3c", "#26402c", "#45663f"];
function wald(poly, n, rMin, rMax, anteilNadel = 0.45, dichteY = null) {
  const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const pts = [];
  let versuch = 0;
  while (pts.length < n && versuch < n * 20) {
    versuch++;
    const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0);
    if (drin(x, y, poly)) pts.push([x, y]);
  }
  pts.sort((a, b) => a[1] - b[1]);
  let g = "";
  for (const [x, y] of pts) {
    const t = (y - y0) / Math.max(1, y1 - y0);
    const rr = (rMin + (rMax - rMin) * (dichteY ? t : rnd())) * (0.8 + rnd() * 0.4);
    if (rnd() < anteilNadel) {
      const f = NADEL[Math.floor(rnd() * NADEL.length)];
      g += `<path d="M${r(x - rr * 0.75)} ${r(y + rr * 0.5)} L${r(x)} ${r(y - rr * 1.9)} L${r(x + rr * 0.75)} ${r(y + rr * 0.5)} Z" fill="${f}"/>`;
      g += `<path d="M${r(x - rr * 0.3)} ${r(y - rr * 0.8)} L${r(x)} ${r(y - rr * 1.9)} L${r(x)} ${r(y + rr * 0.4)} Z" fill="#6b8a5a" opacity=".35"/>`;
    } else {
      const f = LAUB[Math.floor(rnd() * LAUB.length)];
      g += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rr)}" ry="${r(rr * 0.85)}" fill="${f}"/>`;
      g += `<ellipse cx="${r(x - rr * 0.3)}" cy="${r(y - rr * 0.3)}" rx="${r(rr * 0.5)}" ry="${r(rr * 0.4)}" fill="#fbe39a" opacity=".45"/>`;
    }
  }
  return g;
}

/* =====================================================================
   KULISSE — Himmel, ferne Hügel, Alpenvorland mit Feldern und Dörfern
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 2}" fill="${S.lg("himmel", [[0, "#3a74c2"], [0.55, "#8db9e3"], [0.9, "#dfe8ec"], [1, "#efe9dc"]])}"/>`);
/* Schönwetterwolken rechts oben, zarte Schleier */
{
  let c = "";
  for (const [x, y, s] of [[318, 22, 1], [362, 16, 0.75], [252, 30, 0.6], [150, 14, 0.5]]) {
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 5], [-10, 1.6, 10, 4], [10, 1, 11, 4.4], [-3, -4, 9, 5], [5, -3, 7, 4]]) {
      c += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="${S.rg("wolke", [[0, "#ffffff"], [0.7, "#f6f8fb"], [1, "#dfe7f0"]], 0.4, 0.35, 0.7)}"/>`;
    }
    c += `<ellipse cx="${r(x)}" cy="${r(y + 4 * s)}" rx="${r(22 * s)}" ry="${r(1.6 * s)}" fill="#c9d6e4" opacity=".6"/>`;
  }
  c += `<path d="M60 40 Q120 34 190 38" stroke="#fff" stroke-width="1.4" opacity=".35" fill="none"/>`;
  S.hinten(c);
}
/* ferne Hügel des Allgäus am Horizont */
S.hinten(`<path d="M80 ${HOR} L80 66 Q120 62 160 65 Q200 61 240 64 Q290 60 330 63 Q370 61 400 64 L400 ${HOR} Z" fill="#a9bccf" opacity=".85"/>`);
S.hinten(`<path d="M80 ${HOR + 1} Q160 67 240 68.4 Q320 66.6 400 68 L400 ${HOR + 2} L80 ${HOR + 2} Z" fill="#b9c8b8" opacity=".9"/>`);
/* Alpenvorland: Wiesen in Bahnen, Waldstücke, Dunst nach hinten */
{
  let c = `<rect x="80" y="${HOR}" width="320" height="${160 - HOR}" fill="${S.lg("ebene", [[0, "#b7c6a6"], [0.25, "#9fb67d"], [1, "#7fa05a"]])}"/>`;
  for (let i = 0; i < 70; i++) {
    const y = HOR + 2 + Math.pow(rnd(), 1.6) * 80, h = 0.6 + (y - HOR) * 0.05, w = 6 + (y - HOR) * 0.5 + rnd() * 8;
    const x = 80 + rnd() * 320;
    c += `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${["#a9c07e", "#c4c98a", "#8aaa62", "#b9b56e", "#94b070"][i % 5]}" opacity=".75"/>`;
  }
  for (let i = 0; i < 40; i++) {
    const y = HOR + 3 + Math.pow(rnd(), 1.4) * 70, x = 80 + rnd() * 320, w = 3 + (y - HOR) * 0.25 + rnd() * 5;
    c += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(w)}" ry="${r(0.5 + (y - HOR) * 0.04)}" fill="${rnd() < 0.6 ? "#4f6e45" : "#7a7c3c"}" opacity=".8"/>`;
  }
  /* Bannwaldsee (nordöstlich, rechts hinten) */
  c += `<path d="M318 76 Q332 74.2 352 75 Q366 75.6 372 77 Q350 78.6 326 78 Z" fill="${S.lg("bannwald", [[0, "#c9dbe6"], [1, "#9fbccf"]])}"/>`;
  /* Füssen und Schwangau: Häuser mit roten Dächern, kleine Kirchtürme */
  for (const [x0, n, y] of [[96, 9, 86], [262, 11, 90], [214, 6, 96]]) {
    for (let i = 0; i < n; i++) {
      const x = x0 + i * 3.2 + rnd() * 1.4, yy = y + rnd() * 2;
      c += `<rect x="${r(x)}" y="${r(yy - 1.4)}" width="2.2" height="1.4" fill="#f2ede2"/><path d="M${r(x - 0.3)} ${r(yy - 1.4)} L${r(x + 1.1)} ${r(yy - 2.4)} L${r(x + 2.5)} ${r(yy - 1.4)} Z" fill="#b5674c"/>`;
    }
  }
  c += `<rect x="118" y="80.4" width="1.2" height="5" fill="#efe9dc"/><path d="M117.8 80.6 L118.6 78.6 L119.4 80.6 Z" fill="#7a5a3c"/>`;
  c += `<rect x="272" y="84.6" width="1.2" height="5" fill="#efe9dc"/><path d="M271.8 84.8 L272.6 82.6 L273.4 84.8 Z" fill="#5e7468"/>`;
  c += `<rect x="80" y="${HOR}" width="320" height="16" fill="${S.lg("ebenedunst", [[0, "#e6ebe6", 0.75], [1, "#e6ebe6", 0]])}"/>`;
  S.hinten(c);
}

/* =====================================================================
   1 — DER BERG (Säuling, links) mit Vorbergen
   ===================================================================== */
{
  const umriss = [[-6, 118], [-6, 44], [6, 34], [16, 26], [24, 21], [30, 16], [35, 13.5], [40, 14.5], [46, 18], [52, 22.5], [58, 30], [64, 38], [72, 48], [80, 58], [88, 66], [96, 76], [104, 86], [112, 96], [118, 104], [124, 112], [124, 118]];
  let k = `<path d="${pfad(umriss)}" fill="${S.lg("saeuling", [[0, "#c9c6c0"], [0.35, "#b2aea6"], [0.6, "#7d8a72"], [1, "#4f6a48"]])}"/>`;
  /* Felswände: helle, sonnige Westflanke und schattige Nordflanke mit Rinnen */
  k += `<path d="M-6 44 L6 34 L16 26 L24 21 L30 16 L35 13.5 L33 30 L26 44 L20 58 L10 66 L-6 70 Z" fill="${S.lg("felslicht", [[0, "#e9e4da"], [1, "#c3bcae"]])}"/>`;
  k += `<path d="M35 13.5 L40 14.5 L46 18 L52 22.5 L58 30 L64 38 L60 52 L50 60 L40 64 L33 30 Z" fill="${S.lg("felsschatten", [[0, "#9a9a9e"], [1, "#7a7e80"]])}"/>`;
  for (let i = 0; i < 16; i++) {
    const x = 6 + rnd() * 54, y = 20 + rnd() * 26;
    k += `<path d="M${r(x)} ${r(y)} q${r(-1 + rnd() * 2)} ${r(5 + rnd() * 6)} ${r(-2 + rnd() * 4)} ${r(10 + rnd() * 8)}" stroke="${x < 34 ? "#a59d8e" : "#5f6366"}" stroke-width="${r(0.3 + rnd() * 0.4)}" fill="none" opacity=".7"/>`;
  }
  /* Latschen und Bergwald darunter, gelbe Lärchen dazwischen */
  k += wald([[-6, 66], [10, 62], [30, 60], [50, 58], [66, 46], [82, 62], [100, 82], [124, 112], [124, 118], [-6, 118]], 170, 1.4, 2.4, 0.7, true);
  /* Pilgerschrofen: bewaldeter Vorberg rechts unten */
  k += `<path d="M66 118 Q80 84 96 78 Q106 80 116 96 Q122 106 126 118 Z" fill="${S.lg("vorberg", [[0, "#6f7f4a"], [1, "#3f5a35"]])}"/>`;
  k += wald([[70, 116], [82, 88], [96, 80], [110, 90], [124, 116]], 70, 1.3, 2.2, 0.55, true);
  k += `<rect x="-6" y="10" width="132" height="110" fill="${S.lg("bergdunst", [[0, "#cfdcea", 0.25], [1, "#cfdcea", 0]])}"/>`;
  S.teil({ id: "berg", de: "der Berg", syl: "BERG", it: "il monte", itSyl: "MON-te", en: "mountain", x: 0, y: 0, kunst: `<g filter="url(#${S.id("dunst")})">${k}</g>`,
    tipp: "Das ist der Säuling (2047 m). Er gehört schon zu den Alpen." });
}

/* =====================================================================
   2 — DER STAUSEE (Forggensee, hinter dem Schloss)
   ===================================================================== */
{
  let k = `<path d="M96 79 Q104 74.2 126 73.6 Q150 72.4 176 73.2 Q206 72.6 236 74.2 Q252 75.4 244 77.6 Q226 79.6 206 78.8 Q186 80.6 166 80.2 Q140 82.4 120 82 Q102 82.6 96 79 Z" fill="${S.lg("forggen", [[0, "#dbe7ee"], [0.5, "#b4ccdb"], [1, "#93b3c8"]])}"/>`;
  k += `<path d="M110 77.6 Q150 75.8 196 76.4" stroke="#fff" stroke-width=".5" opacity=".7" fill="none"/>`;
  k += `<path d="M132 80 Q160 78.6 186 79" stroke="#f6f9fb" stroke-width=".35" opacity=".6" fill="none"/>`;
  S.teil({ id: "stausee", de: "der Stausee", syl: "STAU-see", it: "il lago artificiale", itSyl: "LA-go ar-ti-fi-CIA-le", en: "reservoir", x: 0, y: 0, kunst: k,
    tipp: "Der Forggensee ist ein Stausee am Lech. Im Winter wird das Wasser abgelassen." });
}

/* =====================================================================
   3 — DIE WIESE bei Schwangau (Lupe: die Kühe) und 4 — DIE KIRCHE
   ===================================================================== */
const WIESE = [[112, 100], [130, 96.6], [156, 97], [160, 108], [156, 121], [132, 122], [114, 118]];
{
  let k = `<path d="${pfad(WIESE)}" fill="${S.lg("wiese", [[0, "#a9c46a"], [1, "#86aa4c"]])}"/>`;
  /* Heustadel, Feldweg, Zaun */
  k += `<path d="M118 112 Q134 108 158 110" stroke="#d9cfa8" stroke-width=".7" fill="none"/>`;
  k += `<rect x="150" y="101.6" width="4.4" height="2.4" fill="#8a6a42"/><path d="M149.6 101.8 L152.2 100 L154.8 101.8 Z" fill="#5e4630"/>`;
  for (let x = 120; x < 156; x += 2.4) k += `<line x1="${x}" y1="${r(115.6 + (x - 120) * 0.02)}" x2="${x}" y2="${r(116.8 + (x - 120) * 0.02)}" stroke="#7a6248" stroke-width=".25"/>`;
  k += `<line x1="120" y1="116.2" x2="156" y2="117" stroke="#7a6248" stroke-width=".2"/>`;
  /* Kühe (Allgäuer Braunvieh) mit Glocke */
  const kuh = (x, y, s, rechts) => {
    const d = rechts ? 1 : -1;
    let g = `<g transform="translate(${x} ${y}) scale(${d * s} ${s})">`;
    g += `<ellipse cx="0" cy="-1.6" rx="2.2" ry="1.05" fill="#8a6446"/>`;
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
  /* St. Coloman: weiße Wallfahrtskirche mitten in der Wiese, Zwiebelturm */
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
  let k = `<path d="M-6 116 Q20 111 48 112 Q74 111.4 96 113.4 Q110 115 116 120 Q104 128 84 131 Q56 135 26 134 Q6 134 -6 132 Z" fill="${S.lg("alpsee", [[0, "#5d8fa0"], [0.5, "#3f7488"], [1, "#2c5a6c"]])}"/>`;
  /* Spiegelung des Bergwalds und der Felsen, Lichtstreifen */
  k += `<path d="M-6 116 Q20 111 48 112 Q60 112 66 113 Q40 118 -6 121 Z" fill="#2d4a3a" opacity=".45"/>`;
  for (const [x, y, w] of [[20, 123, 30], [52, 127, 26], [80, 121, 20], [8, 129, 18]]) k += `<path d="M${x} ${y} h${w}" stroke="#d6eaf0" stroke-width=".35" opacity=".7"/>`;
  k += `<path d="M30 118 Q50 117 70 118" stroke="#fff" stroke-width=".25" opacity=".5" fill="none"/>`;
  /* Ufer: Bäume am Nordufer */
  k += wald([[-6, 131], [30, 133.6], [70, 132], [100, 129], [112, 124], [114, 130], [80, 136], [30, 138], [-6, 137]], 60, 1.2, 1.9, 0.5);
  S.teil({ id: "see", de: "der See", syl: "SEE", it: "il lago", itSyl: "LA-go", en: "lake", x: 0, y: 0, kunst: k,
    tipp: "Der Alpsee ist ein klarer Bergsee direkt unter Schloss Hohenschwangau." });
}
{
  /* Hohenschwangau: ockergelb, neugotisch, Zinnen, Türme; auf bewaldetem Hügel */
  const GELB = S.lg("hsgelb", [[0, "#f2c766"], [1, "#d9a53e"]]);
  const GELB_S = S.lg("hsgelbs", [[0, "#c9963a"], [1, "#a8782a"]]);
  let k = `<path d="M-22 14 Q-14 2 -4 1 Q8 0 18 4 Q26 8 30 14 Z" fill="${S.lg("hshuegel", [[0, "#5d7a3e"], [1, "#3e5a2e"]])}"/>`;
  k += wald([[-20, 14], [-12, 4], [0, 2.4], [14, 4], [28, 13]], 40, 1.1, 1.8, 0.5);
  const zinnen = (x0, x1, y, h = 0.9) => { let g = ""; for (let x = x0; x < x1 - 0.4; x += 1.6) g += `<rect x="${r(x)}" y="${r(y - h)}" width=".9" height="${h}" fill="inherit"/>`; return g; };
  /* Hauptbau */
  k += `<rect x="-9" y="-12" width="17" height="13" fill="${GELB}"/><rect x="8" y="-11" width="3.4" height="12" fill="${GELB_S}"/>`;
  k += `<g fill="#f0c25e">${zinnen(-9, 8, -12)}</g><g fill="#c9963a">${zinnen(8, 11.4, -11)}</g>`;
  for (let row = 0; row < 3; row++) for (let i = 0; i < 6; i++) k += `<rect x="${r(-7.6 + i * 2.7)}" y="${r(-10 + row * 3.6)}" width=".9" height="1.8" rx=".4" fill="#6b5a3e"/>`;
  /* Rundturm links, Viereckturm rechts, Erkertürmchen */
  k += `<rect x="-13" y="-17" width="4.4" height="18" fill="${S.lg("hsrund", [[0, "#d8a440"], [0.4, "#f6cf72"], [1, "#b8862e"]], 0, 0, 1, 0)}"/><g fill="#e6b452">${zinnen(-13, -8.6, -17)}</g>`;
  k += `<rect x="-11.4" y="-14" width=".9" height="2" rx=".45" fill="#6b5a3e"/>`;
  k += `<rect x="4" y="-18" width="4.6" height="7" fill="${GELB}"/><g fill="#f0c25e">${zinnen(4, 8.6, -18)}</g><rect x="5.8" y="-16.4" width=".9" height="2" rx=".4" fill="#6b5a3e"/>`;
  k += `<rect x="10.6" y="-6" width="9" height="7" fill="${GELB}"/><g fill="#f0c25e">${zinnen(10.6, 19.6, -6)}</g>`;
  k += `<rect x="12" y="-4.4" width=".9" height="1.8" rx=".4" fill="#6b5a3e"/><rect x="15" y="-4.4" width=".9" height="1.8" rx=".4" fill="#6b5a3e"/>`;
  k += `<path d="M-9 1 L19.6 1" stroke="#8a6a3a" stroke-width=".5"/>`;
  S.teil({ id: "hohenschwangau", de: "das Schloss Hohenschwangau", syl: "SCHLOSS ho-hen-SCHWAN-gau", it: "il castello di Hohenschwangau", itSyl: "ca-STEL-lo di ho-en-SCHWAN-gau", en: "Hohenschwangau Castle",
    x: 96, y: 132, kunst: k, tipp: "Im gelben Schloss Hohenschwangau ist König Ludwig II. aufgewachsen." });
}

/* =====================================================================
   7 — DER WALD (Herbstwald am Schlossberg, mit Kutschenweg)
   ===================================================================== */
const WALD = [[112, 146], [128, 138], [146, 142], [160, 148], [176, 152], [262, 154], [300, 156], [340, 158], [400, 150], [400, 210], [300, 214], [262, 200], [240, 182], [212, 176], [184, 184], [160, 196], [120, 204], [80, 206], [40, 204], [0, 206], [0, 140], [40, 138], [80, 140]];
{
  let k = `<path d="${pfad(WALD)}" fill="${S.lg("waldgrund", [[0, "#7a6a32"], [0.5, "#5a5a2c"], [1, "#3e4426"]])}"/>`;
  k += wald(WALD, 620, 1.6, 4.2, 0.42, true);
  /* Kutschenweg vom Dorf herauf (hell, in Kehren) */
  k += `<path d="M112 152 Q126 150 136 153 Q146 156 154 152 Q162 148 170 156" stroke="#d8cbb0" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M112 152 Q126 150 136 153 Q146 156 154 152 Q162 148 170 156" stroke="#b8a888" stroke-width=".3" fill="none" transform="translate(0 .7)"/>`;
  S.teil({ id: "wald", de: "der Wald", syl: "WALD", it: "il bosco", itSyl: "BO-sco", en: "forest", x: 0, y: 0, kunst: k,
    tipp: "Im Herbst färben sich die Buchen gold und orange. Die Fichten bleiben grün." });
}

/* =====================================================================
   8 — DIE KUTSCHE auf dem Weg zum Schloss (Lupe: das Pferd)
   ===================================================================== */
{
  const X = 146, Y = 155.4;
  let k = schatten(0, 0.2, 7, 0.6, 0.3);
  /* zwei Haflinger (fuchsfarben mit heller Mähne), Geschirr */
  const pferd = (dx, f) => {
    let g = `<ellipse cx="${dx}" cy="-2.6" rx="1.9" ry=".95" fill="${f}"/>`;
    g += `<path d="M${dx - 1.6} -3 L${dx - 2.6} -4.4 L${dx - 3.3} -4.2 L${dx - 2.7} -3.3 L${dx - 2} -2.4 Z" fill="${f}"/>`;
    g += `<path d="M${dx - 1.4} -3.4 L${dx - 2.4} -4.5" stroke="#f1e2bc" stroke-width=".35"/>`;
    for (const lx of [-1.2, -0.8, 1, 1.4]) g += `<rect x="${r(dx + lx - 0.13)}" y="-2" width=".26" height="2" fill="${f}"/>`;
    g += `<path d="M${dx + 1.8} -2.8 q.6 .6 .3 1.6" stroke="#f1e2bc" stroke-width=".3" fill="none"/>`;
    return g;
  };
  k += pferd(-4.4, "#a8642e") + pferd(-3.6, "#b9743a");
  k += `<path d="M-2 -2.8 L1 -2.6" stroke="#3a2a1c" stroke-width=".25"/>`;
  /* Landauer: schwarz, gelbe Räder, aufgeklapptes Verdeck */
  k += `<path d="M.6 -1.4 L5.6 -1.4 L5.8 -3.4 L4.6 -3.6 L4.6 -2.6 L2.2 -2.6 L1.8 -3.4 L.8 -3.2 Z" fill="#23262b"/>`;
  k += `<path d="M4.4 -3.6 Q5.4 -6 6.6 -4.2 L5.8 -3.4 Z" fill="#3a3f46"/>`;
  k += `<circle cx="1.8" cy="-.8" r=".8" fill="none" stroke="#d8a830" stroke-width=".3"/><circle cx="4.8" cy="-1" r="1" fill="none" stroke="#d8a830" stroke-width=".3"/>`;
  /* Kutscher mit Hut und Gäste */
  k += `<rect x="1.2" y="-4.4" width=".9" height="1.4" fill="#2f4a2f"/><circle cx="1.65" cy="-4.8" r=".42" fill="#e0b896"/><rect x="1.15" y="-5.4" width="1" height=".35" fill="#1c1c1c"/>`;
  k += `<rect x="3" y="-4" width=".8" height="1.2" fill="#b8473a"/><circle cx="3.4" cy="-4.3" r=".38" fill="#e8c39e"/><rect x="3.9" y="-3.9" width=".7" height="1.1" fill="#2f5f95"/><circle cx="4.25" cy="-4.2" r=".36" fill="#d9a882"/>`;
  S.teil({ oben: true, id: "kutsche", de: "die Kutsche", syl: "KUT-sche", it: "la carrozza", itSyl: "car-ROZ-za", en: "carriage", x: X, y: Y, kunst: k + flaeche(-7, -6.4, 14.4, 7),
    tipp: "Mit der Pferdekutsche fährt man vom Dorf Hohenschwangau hinauf zum Schloss.",
    zoom: { x: X - 15, y: Y - 13, w: 30, h: 20 },
    unter: [
      { id: "pferd", de: "das Pferd", syl: "PFERD", it: "il cavallo", itSyl: "ca-VAL-lo", en: "horse", x: X - 4, y: Y, kunst: flaeche(-3.6, -4.8, 6, 4.8),
        tipp: "Die Kutschen ziehen meist kräftige Haflinger: braune Pferde mit heller Mähne." },
    ] });
}

/* =====================================================================
   9 — DER FELSEN (Schlossfelsen, heller Kalk, fällt in die Schlucht)
   ===================================================================== */
{
  const umriss = [[156, 150], [176, 149], [262, 151], [300, 152.6], [336, 155], [392, 156], [392, 162], [340, 166], [300, 170], [266, 176], [246, 192], [226, 196], [208, 184], [190, 178], [174, 172], [160, 164]];
  let k = `<path d="${pfad(umriss)}" fill="${FELS}"/>`;
  k += `<path d="M156 150 L176 149 L190 150 L186 168 L174 172 L160 164 Z" fill="#f1ebdf"/>`;
  k += `<path d="M246 192 L266 176 L300 170 L300 162 L272 160 L254 172 Z" fill="#9c917f" opacity=".7"/>`;
  for (let i = 0; i < 26; i++) {
    const x = 170 + rnd() * 120, y = 154 + rnd() * 24;
    if (!drin(x, y, umriss)) continue;
    k += `<path d="M${r(x)} ${r(y)} l${r(-0.6 + rnd() * 1.2)} ${r(3 + rnd() * 5)}" stroke="#8f8574" stroke-width=".3" opacity=".6"/>`;
  }
  /* Latschen und Büsche in den Felsritzen */
  for (const [x, y] of [[182, 166], [204, 176], [236, 186], [270, 168], [318, 162], [222, 170]]) k += `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.4" fill="#4a6a3a"/><ellipse cx="${x - 0.8}" cy="${y - 0.5}" rx="1.2" ry=".6" fill="#7c9a5a"/>`;
  S.teil({ id: "felsen", de: "der Felsen", syl: "FEL-sen", it: "la roccia", itSyl: "ROC-cia", en: "rock", x: 0, y: 0, kunst: k,
    tipp: "Das Schloss steht auf einem Felsgrat hoch über der Pöllatschlucht." });
}

/* =====================================================================
   10 — DAS SCHLOSS NEUSCHWANSTEIN (Palas, Nordturm, Kemenate, Ritterhaus)
        Lupe: der Palas, das Dach, die Kemenate, der Turm, der Balkon,
        das Fenster (Sängersaal)
   ===================================================================== */
/* Bogenfenster (Rundbogen), optional gekuppelt */
const fenster = (x, y, w, h, n = 1, saeule = false) => {
  let g = "";
  const fw = (w - (n - 1) * 0.5) / n;
  for (let i = 0; i < n; i++) {
    const x0 = x + i * (fw + 0.5);
    g += `<path d="M${r(x0)} ${r(y + h)} L${r(x0)} ${r(y + fw / 2)} A${r(fw / 2)} ${r(fw / 2)} 0 0 1 ${r(x0 + fw)} ${r(y + fw / 2)} L${r(x0 + fw)} ${r(y + h)} Z" fill="${GLAS}"/>`;
    g += `<path d="M${r(x0 + fw * 0.2)} ${r(y + h - 0.3)} L${r(x0 + fw * 0.2)} ${r(y + fw * 0.6)}" stroke="#a9b8c8" stroke-width=".18" opacity=".7"/>`;
  }
  if (saeule) for (let i = 1; i < n; i++) g += `<rect x="${r(x + i * (fw + 0.5) - 0.45)}" y="${r(y + 0.6)}" width=".4" height="${r(h - 0.6)}" fill="#f6f1e6"/>`;
  g += `<path d="M${r(x - 0.4)} ${r(y + h + 0.3)} h${r(w + 0.8)}" stroke="#d6cfbf" stroke-width=".45"/>`;
  return g;
};
/* Rundes Türmchen mit spitzem Schieferhelm und goldenem Knauf */
const tuermchen = (cx, yFuss, yHals, w, helm, opt = {}) => {
  let g = "";
  if (opt.konsole) g += `<path d="M${r(cx - w / 2)} ${r(yFuss)} Q${r(cx)} ${r(yFuss + w * 0.9)} ${r(cx + w / 2)} ${r(yFuss)} Z" fill="${KALK_SCHATTEN}"/>`;
  g += `<rect x="${r(cx - w / 2)}" y="${r(yHals)}" width="${r(w)}" height="${r(yFuss - yHals)}" fill="${opt.ziegel ? ZIEGEL_RUND : KALK_RUND}"/>`;
  if (opt.fenster) for (const fy of opt.fenster) g += `<rect x="${r(cx - 0.45)}" y="${r(fy)}" width=".9" height="1.8" rx=".45" fill="${GLAS}"/>`;
  g += `<rect x="${r(cx - w / 2 - 0.4)}" y="${r(yHals - 0.8)}" width="${r(w + 0.8)}" height=".9" fill="${opt.ziegel ? "#e9dcc6" : "#e9e4d8"}"/>`;
  g += `<path d="M${r(cx - w / 2 - 0.6)} ${r(yHals - 0.6)} L${r(cx)} ${r(yHals - helm)} L${r(cx + w / 2 + 0.6)} ${r(yHals - 0.6)} Z" fill="${SCHIEFER_RUND}"/>`;
  g += `<path d="M${r(cx - w / 2 - 0.2)} ${r(yHals - 0.9)} L${r(cx - 0.1)} ${r(yHals - helm + 0.6)} L${r(cx - w * 0.15)} ${r(yHals - 0.9)} Z" fill="#a9b2bd" opacity=".45"/>`;
  g += `<line x1="${r(cx)}" y1="${r(yHals - helm)}" x2="${r(cx)}" y2="${r(yHals - helm - 2.6)}" stroke="#9a7a2a" stroke-width=".3"/><circle cx="${r(cx)}" cy="${r(yHals - helm - 1.3)}" r=".45" fill="${GOLD}"/>`;
  return g;
};
const PAL = { x0: 176, x1: 262, knick: 222, fuss: 150, traufe: 100, first: 76 };
{
  let k = "";
  /* --- RITTERHAUS (hinter dem Hof, Nordseite) mit Galerie der Blendarkaden --- */
  k += `<path d="M288 132 L288 118 L334 120 L334 136 Z" fill="${KALK_SCHATTEN}"/>`;
  k += `<path d="M286 118.4 L296 108 L326 109.4 L336 120.4 Z" fill="${SCHIEFER}"/>`;
  for (let i = 0; i < 9; i++) k += `<path d="M${r(290 + i * 4.8)} ${r(129 + i * 0.1)} L${r(290 + i * 4.8)} ${r(125.6 + i * 0.1)} A1.3 1.3 0 0 1 ${r(292.6 + i * 4.8)} ${r(125.6 + i * 0.1)} L${r(292.6 + i * 4.8)} ${r(129 + i * 0.1)} Z" fill="#9aa0ac"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${r(292 + i * 7)}" y="121.4" width="1.2" height="2" rx=".5" fill="${GLAS}"/>`;
  /* --- KEMENATE (Südseite des Hofs), rechts neben dem Palas --- */
  k += `<rect x="260" y="117" width="30" height="36" fill="${KALK}"/>`;
  k += `<rect x="286" y="117" width="4" height="36" fill="${KALK_SCHATTEN}"/>`;
  k += `<path d="M258.6 117.4 L264 104 L284 104 L291.4 117.4 Z" fill="${SCHIEFER}"/><path d="M264 104 L284 104 L285 106 L263.4 106 Z" fill="#8f98a4"/>`;
  for (const y of [120, 129, 138]) k += fenster(263, y, 4.6, 5.4, 2) + fenster(271, y, 4.6, 5.4, 2) + fenster(279, y, 4.6, 5.4, 2);
  for (const y of [127.6, 136.6, 145.6]) k += `<rect x="260" y="${y}" width="30" height=".5" fill="#ddd6c6"/>`;
  k += `<rect x="266" y="146" width="6" height="7" fill="#d9d2c2"/><path d="M266 153 L266 148.4 A3 3 0 0 1 272 148.4 L272 153 Z" fill="#6e655a"/>`;
  /* Kemenate-Erkerturm (rund, an der Ostecke, spitz) */
  k += tuermchen(292.6, 136, 108, 5.2, 13, { fenster: [112, 120, 128] });
  /* Dachgauben auf der Kemenate */
  for (const x of [268, 278]) k += `<path d="M${x} 112 L${x} 109 L${x + 2} 107.6 L${x + 4} 109 L${x + 4} 112 Z" fill="#e9e4d8"/><rect x="${x + 1.2}" y="109.4" width="1.6" height="2.2" fill="${GLAS}"/>`;

  /* --- PALAS --- */
  const { x0, x1, knick, fuss, traufe, first } = PAL;
  /* Unterbau: Sockel auf dem Felsen, leicht geböscht */
  k += `<path d="M${x0 - 10} ${fuss} L${x0 - 9} ${fuss - 8} L${x1} ${fuss - 8} L${x1 + 1} ${fuss + 2} Z" fill="#e8e1d2"/>`;
  /* Westseite (Schmalseite links, Schatten-Licht: Sonne von links → hell) */
  k += `<path d="M${x0 - 9} ${fuss - 6} L${x0 - 9} ${traufe + 1} L${x0} ${traufe} L${x0} ${fuss - 6} Z" fill="${S.lg("westseite", [[0, "#fffef8"], [1, "#efe8da"]])}"/>`;
  k += `<path d="M${x0 - 9.6} ${traufe + 1.2} L${x0 - 4.5} ${first + 2} L${x0 + 0.4} ${traufe} Z" fill="${S.lg("giebel", [[0, "#fffdf6"], [1, "#efe8da"]])}"/>`;
  for (const y of [108, 118, 128, 138]) k += fenster(x0 - 7.2, y, 2.4, 4.6, 1);
  /* Südseite: zwei Baukörper im flachen Winkel (der östliche etwas gedreht → etwas dunkler) */
  k += `<rect x="${x0}" y="${traufe}" width="${knick - x0}" height="${fuss - 6 - traufe}" fill="${KALK}"/>`;
  k += `<path d="M${knick} ${traufe - 0.6} L${x1} ${traufe - 1.4} L${x1} ${fuss - 6} L${knick} ${fuss - 6} Z" fill="${S.lg("ostkoerper", [[0, "#f4efe3"], [1, "#dcd5c6"]])}"/>`;
  k += `<line x1="${knick}" y1="${traufe - 0.6}" x2="${knick}" y2="${fuss - 6}" stroke="#cfc7b5" stroke-width=".4"/>`;
  /* Geschossgesimse */
  const geschoss = [139, 130, 121, 111.4];
  for (const y of geschoss) k += `<path d="M${x0} ${y} L${knick} ${y} L${x1} ${r(y - 0.6)}" stroke="#d8d0be" stroke-width=".55" fill="none"/>`;
  /* Fenster: unten paarweise, Königswohnung dreiteilig, oben links Thronsaal hoch */
  for (let i = 0; i < 6; i++) {
    const fx = x0 + 3 + i * 7.4;
    k += fenster(fx, 141.4, 3.2, 4.2, 2) + fenster(fx, 132, 3.2, 5.6, 2) + fenster(fx, 123, 4, 6, 2);
  }
  for (let i = 0; i < 5; i++) {
    const fx = knick + 3 + i * 7.6;
    k += fenster(fx, r(141.4 - i * 0.12), 3.2, 4.2, 2) + fenster(fx, r(132 - i * 0.12), 3.2, 5.6, 2) + fenster(fx, r(122.6 - i * 0.12), 4.6, 6.4, 3, true);
  }
  /* Thronsaal (oben links): hohe Bogenfenster über zwei Geschosse */
  for (let i = 0; i < 5; i++) k += fenster(x0 + 4 + i * 8.6, 101.8, 3.6, 8.6, 2, true);
  /* Sängersaal (vierter Stock, Ostteil): Reihe von Bogenfenstern mit Säulchen */
  for (let i = 0; i < 4; i++) k += fenster(knick + 3 + i * 9.4, r(101.4 - i * 0.25), 7.2, 7.4, 3, true);
  /* Dach: zwei Satteldächer mit Gauben */
  k += `<path d="M${x0 - 0.6} ${traufe + 0.4} L${x0 + 3} ${first + 1.2} L${knick + 1} ${first + 1.2} L${knick + 1} ${traufe - 0.4} Z" fill="${SCHIEFER}"/>`;
  k += `<path d="M${knick - 0.6} ${traufe - 0.4} L${knick + 1.6} ${first} L${x1 - 2} ${first - 0.6} L${x1 + 0.6} ${traufe - 1.2} Z" fill="${S.lg("schiefer2", [[0, "#6f7885"], [1, "#454c57"]])}"/>`;
  k += `<path d="M${x0 + 3} ${first + 1.2} L${knick + 1} ${first + 1.2}" stroke="#a3acb7" stroke-width=".6"/><path d="M${knick + 1.6} ${first} L${x1 - 2} ${first - 0.6}" stroke="#a3acb7" stroke-width=".6"/>`;
  for (let i = 0; i < 7; i++) k += `<path d="M${r(x0 + 4 + i * 11)} ${r(traufe - 4)} L${r(x0 + 4 + i * 11)} ${r(traufe - 7.2)} L${r(x0 + 6 + i * 11)} ${r(traufe - 8.6)} L${r(x0 + 8 + i * 11)} ${r(traufe - 7.2)} L${r(x0 + 8 + i * 11)} ${r(traufe - 4)} Z" fill="#ece7db"/><rect x="${r(x0 + 5.2 + i * 11)}" y="${r(traufe - 7)}" width="1.6" height="2.4" fill="${GLAS}"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${r(x0 + 9 + i * 18)} ${r(first + 9)} L${r(x0 + 9 + i * 18)} ${r(first + 7)} L${r(x0 + 10.4 + i * 18)} ${r(first + 6)} L${r(x0 + 11.8 + i * 18)} ${r(first + 7)} L${r(x0 + 11.8 + i * 18)} ${r(first + 9)} Z" fill="#e2ddd1"/>`;
  /* Ritterfigur auf dem Westgiebel, Kamine */
  k += `<path d="M${x0 - 4.9} ${first + 2} l0 -2.6 l.8 -.3 l.2 -1.1 l.5 0 l.2 1.1 l.6 .4 l0 2.5 Z" fill="#4c6a62"/>`;
  for (const x of [196, 240]) k += `<rect x="${x}" y="${first - 3}" width="2" height="5" fill="#e3ddcf"/><rect x="${x - 0.4}" y="${first - 3.6}" width="2.8" height=".9" fill="#c9c2b2"/>`;
  /* Ecktürmchen (achteckig wirkend) an Südwest- und Südostecke, Nordwestecke dahinter */
  k += tuermchen(x0 - 9.4, 96, 84, 3.6, 12, { fenster: [88] });
  k += tuermchen(x0 + 0.8, 112, 88, 4.4, 15, { konsole: true, fenster: [93, 101] });
  k += tuermchen(x1 - 1, 110, 86, 4.6, 15, { konsole: true, fenster: [91, 99] });
  /* Südlicher Treppenturm (niedriger) am Knick */
  k += tuermchen(knick - 3, first + 4, 66, 5.4, 12, { fenster: [69, 74] });
  /* NORDTURM: über 65 m, schlank, Treppenfenster spiralig, Galerie, Helm */
  {
    const cx = 236, w = 8.4, hals = 57;
    k += `<rect x="${cx - w / 2}" y="${hals}" width="${w}" height="${first + 6 - hals}" fill="${KALK_RUND}"/>`;
    for (let i = 0; i < 5; i++) k += `<rect x="${r(cx - 2.6 + (i % 3) * 2.2)}" y="${r(hals + 3 + i * 3.4)}" width=".9" height="2" rx=".45" fill="${GLAS}"/>`;
    k += `<path d="M${cx - w / 2 - 1.2} ${hals} L${cx + w / 2 + 1.2} ${hals} L${cx + w / 2} ${hals + 2.2} L${cx - w / 2} ${hals + 2.2} Z" fill="#e3ddd0"/>`;
    for (let i = 0; i < 6; i++) k += `<path d="M${r(cx - w / 2 - 0.6 + i * 1.8)} ${hals + 2.2} q.5 1 1 0" fill="#cfc8b8"/>`;
    k += `<rect x="${cx - w / 2 - 0.8}" y="${hals - 4}" width="${w + 1.6}" height="4" fill="${KALK_RUND}"/>`;
    for (let i = 0; i < 4; i++) k += `<path d="M${r(cx - 3.6 + i * 2.2)} ${hals - 0.6} L${r(cx - 3.6 + i * 2.2)} ${hals - 2.8} A.6 .6 0 0 1 ${r(cx - 2.4 + i * 2.2)} ${hals - 2.8} L${r(cx - 2.4 + i * 2.2)} ${hals - 0.6} Z" fill="${GLAS}"/>`;
    k += `<path d="M${cx - w / 2 - 1.4} ${hals - 3.6} L${cx} ${hals - 19} L${cx + w / 2 + 1.4} ${hals - 3.6} Z" fill="${SCHIEFER_RUND}"/>`;
    k += `<path d="M${cx - w / 2 - 0.8} ${hals - 4} L${cx - 0.2} ${hals - 18} L${cx - 1.6} ${hals - 4} Z" fill="#b6bec8" opacity=".45"/>`;
    k += `<line x1="${cx}" y1="${hals - 19}" x2="${cx}" y2="${hals - 23.6}" stroke="#9a7a2a" stroke-width=".35"/><circle cx="${cx}" cy="${hals - 21}" r=".6" fill="${GOLD}"/>`;
  }
  /* --- DER BALKON (Söller vor dem Thronsaal, zwei Geschosse, an der Westseite) --- */
  {
    const bx = x0 - 17, by = 118;
    k += `<path d="M${bx} ${by} L${x0 - 9} ${by - 1} L${x0 - 9} ${by + 17} L${bx} ${by + 16} Z" fill="${S.lg("soeller", [[0, "#fffef8"], [1, "#ebe4d4"]])}"/>`;
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) k += `<path d="M${r(bx + 1 + j * 2.6)} ${r(by + 6.4 + i * 8)} L${r(bx + 1 + j * 2.6)} ${r(by + 2.4 + i * 8)} A.9 .9 0 0 1 ${r(bx + 2.8 + j * 2.6)} ${r(by + 2.4 + i * 8)} L${r(bx + 2.8 + j * 2.6)} ${r(by + 6.4 + i * 8)} Z" fill="#5b6676"/>`;
    k += `<rect x="${bx - 0.6}" y="${by - 1.2}" width="${x0 - 9 - bx + 0.8}" height="1.2" fill="#e4ddcd"/><rect x="${bx - 0.6}" y="${by + 7.2}" width="${x0 - 9 - bx + 0.8}" height="1" fill="#e4ddcd"/>`;
    for (let j = 0; j < 7; j++) k += `<rect x="${r(bx + 0.3 + j * 1.15)}" y="${by - 3.2}" width=".5" height="2" fill="#efe9dc"/>`;
    k += `<path d="M${bx} ${by + 16} Q${bx + 4} ${by + 21} ${x0 - 9} ${by + 17}" fill="#ddd5c4"/>`;
  }
  /* Hofmauer mit Zinnen zum Viereckturm */
  k += `<rect x="290" y="140" width="10" height="13" fill="${KALK}"/>`;
  for (let x = 290; x < 300; x += 2.2) k += `<rect x="${x}" y="138.4" width="1.3" height="1.8" fill="${KALK}"/>`;
  /* Fuß: Schlagschatten auf dem Felsen */
  k += `<path d="M${x0 - 10} ${fuss + 1} L300 153 L300 155 L${x0 - 6} ${fuss + 3} Z" fill="#6b604e" opacity=".25"/>`;
  S.teil({ id: "neuschwanstein", de: "das Schloss Neuschwanstein", syl: "SCHLOSS neu-SCHWAN-stein", it: "il castello di Neuschwanstein", itSyl: "ca-STEL-lo di noi-SCHWAN-stain", en: "Neuschwanstein Castle",
    x: 0, y: 0, kunst: k, tipp: "König Ludwig II. ließ das Schloss ab 1869 bauen – wie eine Ritterburg aus dem Märchen.",
    zoom: { x: 152, y: 34, w: 147, h: 98 },
    unter: [
      { id: "palas", de: "der Palas", syl: "PA-las", it: "il palazzo", itSyl: "pa-LAZ-zo", en: "great hall", x: 200, y: 144, kunst: flaeche(-24, -30, 60, 30),
        tipp: "Der Palas ist das Hauptgebäude: fünf Stockwerke, außen heller Kalkstein." },
      { id: "dach", de: "das Dach", syl: "DACH", it: "il tetto", itSyl: "TET-to", en: "roof", x: 200, y: 99, kunst: flaeche(-20, -21, 56, 19),
        tipp: "Die Dächer und Turmspitzen sind mit grauem Schiefer gedeckt." },
      { id: "kemenate", de: "die Kemenate", syl: "ke-me-NA-te", it: "la camera delle dame", itSyl: "CA-me-ra DEL-le DA-me", en: "bower", x: 274, y: 152, kunst: flaeche(-14, -46, 28, 45),
        tipp: "Die Kemenate war als Haus für die Damen gedacht." },
      { id: "turm", de: "der Turm", syl: "TURM", it: "la torre", itSyl: "TOR-re", en: "tower", x: 236, y: 82, kunst: flaeche(-6, -50, 12, 30),
        tipp: "Der Nordturm ist über 65 Meter hoch – das höchste Bauwerk des Schlosses." },
      { id: "balkon", de: "der Balkon", syl: "bal-KON", it: "il balcone", itSyl: "bal-CO-ne", en: "balcony", x: 163, y: 136, kunst: flaeche(-5, -21, 10, 22),
        tipp: "Vom Balkon vor dem Thronsaal sieht man den Alpsee." },
      { id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: 241, y: 109.6, kunst: flaeche(-18, -9, 38, 9.4),
        tipp: "Hinter diesen Bogenfenstern liegt der Sängersaal, der größte Raum des Schlosses." },
    ] });
}

/* =====================================================================
   11 — DER VIERECKTURM (45 m, Plattform mit Rundtürmchen)
   ===================================================================== */
{
  let k = "";
  const x0 = 300, x1 = 314, top = 84, fuss = 154;
  k += `<rect x="${x0}" y="${top}" width="${x1 - x0 - 3}" height="${fuss - top}" fill="${KALK}"/>`;
  k += `<rect x="${x1 - 3}" y="${top}" width="3" height="${fuss - top}" fill="${KALK_SCHATTEN}"/>`;
  for (const y of [96, 108, 120, 132, 144]) k += fenster(x0 + 3.4, y, 3.4, 5, 2) + `<rect x="${x0}" y="${y + 6.6}" width="${x1 - x0}" height=".45" fill="#d8d0be"/>`;
  /* Konsolfries, Zinnenkranz der Aussichtsplattform */
  k += `<rect x="${x0 - 1}" y="${top - 2}" width="${x1 - x0 + 2}" height="2.4" fill="#ece6d8"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${r(x0 - 0.6 + i * 2.6)} ${top + 0.4} q.6 1.2 1.2 0" fill="#cfc8b8"/>`;
  for (let x = x0 - 1; x < x1 + 0.6; x += 2.4) k += `<rect x="${r(x)}" y="${top - 4.4}" width="1.4" height="2.6" fill="${x > x1 - 3 ? "#cfd2d9" : "#f4efe3"}"/>`;
  /* kleiner Rundturm obenauf */
  k += tuermchen(x0 + 5.6, top - 2, top - 12, 4.2, 9, { fenster: [top - 9] });
  S.teil({ id: "viereckturm", de: "der Viereckturm", syl: "VIER-eck-turm", it: "la torre quadrata", itSyl: "TOR-re qua-DRA-ta", en: "square tower", x: 0, y: 0, kunst: k,
    tipp: "Der Viereckturm ist 45 Meter hoch. Oben ist eine Aussichtsplattform." });
}

/* =====================================================================
   12 — DAS TORHAUS (Torbau aus roten Ziegeln, Flankiertürme)
   ===================================================================== */
{
  let k = "";
  const x0 = 318, x1 = 382, traufe = 128, fuss = 158;
  k += `<rect x="${x0}" y="${traufe}" width="${x1 - x0}" height="${fuss - traufe}" fill="${ZIEGEL}"/>`;
  /* Ziegelverband (fein) und helle Werksteinbänder */
  let z = "";
  for (let y = traufe + 2; y < fuss; y += 1.6) z += `M${x0} ${r(y)} h${x1 - x0} `;
  k += `<path d="${z}" stroke="#93402c" stroke-width=".18" opacity=".7"/>`;
  for (const y of [138, 148]) k += `<rect x="${x0}" y="${y}" width="${x1 - x0}" height=".9" fill="#e8d6b8"/>`;
  for (let i = 0; i < 6; i++) {
    const fx = x0 + 4 + i * 9.6;
    for (const y of [130.6, 140.6]) k += `<rect x="${r(fx - 0.5)}" y="${r(y - 0.5)}" width="5.2" height="6.6" fill="#ead9bb"/>` + fenster(fx, y, 4.2, 5.6, 2);
  }
  k += `<rect x="${x0}" y="150" width="${x1 - x0}" height="8" fill="#9c4632"/>`;
  for (let i = 0; i < 5; i++) k += `<rect x="${r(x0 + 6 + i * 11)}" y="152" width="1.2" height="3" fill="#4a2a20"/>`;
  /* Dach mit Gauben */
  k += `<path d="M${x0 - 1} ${traufe + 0.4} L${x0 + 5} 116 L${x1 - 6} 116 L${x1 + 1} ${traufe + 0.4} Z" fill="${SCHIEFER}"/>`;
  k += `<path d="M${x0 + 5} 116 L${x1 - 6} 116" stroke="#a3acb7" stroke-width=".5"/>`;
  for (const x of [330, 344, 358]) k += `<path d="M${x} ${traufe - 1} L${x} ${traufe - 4} L${x + 2} ${traufe - 5.4} L${x + 4} ${traufe - 4} L${x + 4} ${traufe - 1} Z" fill="${ZIEGEL}"/><rect x="${x + 1.2}" y="${traufe - 3.8}" width="1.6" height="2.2" fill="${GLAS}"/>`;
  /* Flankiertürme am Tor (Ostende) — der hintere halb verdeckt */
  k += tuermchen(390, 152, 112, 6, 13, { ziegel: true, fenster: [118, 128, 138] });
  k += tuermchen(381, 156, 114, 6.8, 14, { ziegel: true, fenster: [120, 130, 140] });
  k += `<rect x="${x0}" y="${traufe}" width="3" height="${fuss - traufe}" fill="#fff" opacity=".12"/>`;
  S.teil({ id: "torhaus", de: "das Torhaus", syl: "TOR-haus", it: "l'edificio d'ingresso", itSyl: "e-di-FI-cio d'in-GRES-so", en: "gatehouse", x: 0, y: 0, kunst: k,
    tipp: "Das Torhaus ist außen aus roten Ziegeln. Durch sein Tor betritt man das Schloss." });
}

/* =====================================================================
   13 — DIE SCHLUCHT (Pöllatschlucht) und 14 — DER WASSERFALL
   ===================================================================== */
const SCHLUCHT = [[150, 260], [158, 228], [170, 206], [184, 192], [198, 184], [214, 182], [232, 188], [246, 198], [262, 214], [276, 236], [290, 260]];
{
  let k = `<path d="${pfad(SCHLUCHT)}" fill="${S.lg("schluchtgrund", [[0, "#5e5a4c"], [1, "#2e2c26"]])}"/>`;
  /* Westwand (links, Sonne) und Ostwand (rechts, Schatten) */
  k += `<path d="M150 260 L158 228 L170 206 L184 192 L198 184 L192 206 L184 230 L178 260 Z" fill="${S.lg("wandw", [[0, "#cfc5b0"], [1, "#958a74"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M214 182 L232 188 L246 198 L262 214 L276 236 L290 260 L244 260 L234 232 L222 204 Z" fill="${S.lg("wando", [[0, "#6e675a"], [1, "#4a463d"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 22; i++) {
    const x = 158 + rnd() * 120, y = 190 + rnd() * 66;
    if (!drin(x, y, SCHLUCHT)) continue;
    k += `<path d="M${r(x)} ${r(y)} l${r(-2 + rnd() * 4)} ${r(-1 + rnd() * 2)}" stroke="${x < 200 ? "#e6dcc6" : "#3a362e"}" stroke-width=".4" opacity=".6"/>`;
  }
  /* Moos und Farn an den Wänden */
  for (const [x, y] of [[166, 220], [176, 236], [250, 222], [262, 240], [240, 206], [188, 202]]) k += `<ellipse cx="${x}" cy="${y}" rx="3" ry="1.4" fill="#4f6a36" opacity=".85"/><ellipse cx="${x - 1}" cy="${y - 0.4}" rx="1.4" ry=".6" fill="#8aa45a" opacity=".7"/>`;
  /* Bach unten: Gumpe und Weiterlauf */
  k += `<path d="M198 252 Q210 246 224 250 Q230 256 222 260 L194 260 Q190 256 198 252 Z" fill="${S.lg("gumpe", [[0, "#6fa3a8"], [1, "#2f5f66"]])}"/>`;
  S.teil({ id: "schlucht", de: "die Schlucht", syl: "SCHLUCHT", it: "la gola", itSyl: "GO-la", en: "gorge", x: 0, y: 0, kunst: k,
    tipp: "Die Pöllat hat diese tiefe Schlucht in den Kalkfels gegraben." });
}
{
  let k = "";
  /* Fallstufen: oben Kaskade, dann der freie Fall in die Gumpe */
  k += `<path d="M203 186 Q208 184 214 186 L215 192 Q209 190.6 204 192 Z" fill="#dfeef2"/>`;
  k += `<path d="M204 192 Q209 190.4 215 192 L217 252 Q210 254 202 252 Z" fill="${S.lg("fall", [[0, "#ffffff", 0.95], [0.5, "#e2f0f4", 0.9], [1, "#c9e2ea", 0.85]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 9; i++) { const x = 205 + i * 1.3; k += `<path d="M${r(x)} ${r(194 + rnd() * 4)} Q${r(x + 0.4)} 220 ${r(x - 0.4 + rnd())} ${r(246 + rnd() * 4)}" stroke="${i % 2 ? "#a9cfdc" : "#ffffff"}" stroke-width="${r(0.3 + rnd() * 0.3)}" opacity=".8" fill="none"/>`; }
  /* Gischt */
  k += `<ellipse cx="210" cy="250" rx="13" ry="5" fill="#f4fafc" opacity=".85" filter="url(#${S.id("gischt")})"/>`;
  k += `<ellipse cx="209" cy="246" rx="7" ry="3" fill="#ffffff" opacity=".9" filter="url(#${S.id("gischt")})"/>`;
  S.teil({ id: "wasserfall", de: "der Wasserfall", syl: "WAS-ser-fall", it: "la cascata", itSyl: "ca-SCA-ta", en: "waterfall", x: 0, y: 0, kunst: k,
    tipp: "Unter der Marienbrücke stürzt der Pöllatfall in die Tiefe." });
}

/* =====================================================================
   15 — DIE FICHTE und 16 — DIE BUCHE (vorne am Schluchtrand)
   ===================================================================== */
{
  const X = 262, Y = 246;
  let k = `<rect x="-1" y="-20" width="2" height="20" fill="#4a3424"/>`;
  for (let i = 0; i < 9; i++) {
    const y = -12 - i * 7.4, w = 15 - i * 1.45;
    k += `<path d="M${r(-w)} ${r(y + 4)} Q${r(-w * 0.5)} ${r(y + 1)} 0 ${r(y - 6)} Q${r(w * 0.5)} ${r(y + 1)} ${r(w)} ${r(y + 4)} Q${r(w * 0.4)} ${r(y + 2.4)} 0 ${r(y + 3.4)} Q${r(-w * 0.4)} ${r(y + 2.4)} ${r(-w)} ${r(y + 4)} Z" fill="${i % 2 ? "#2f4b33" : "#26402c"}"/>`;
    k += `<path d="M${r(-w * 0.9)} ${r(y + 3.4)} Q${r(-w * 0.5)} ${r(y + 0.6)} ${r(-1)} ${r(y - 4.6)}" stroke="#6f8f5c" stroke-width=".5" fill="none" opacity=".7"/>`;
  }
  k += `<path d="M0 -84 L0 -90" stroke="#26402c" stroke-width="1"/>`;
  S.teil({ id: "fichte", de: "die Fichte", syl: "FICH-te", it: "l'abete rosso", itSyl: "a-BE-te ROS-so", en: "spruce", x: X, y: Y, steht: true, kunst: k,
    tipp: "Die Fichte ist ein Nadelbaum. Sie bleibt auch im Winter grün." });
}
{
  const X = 376, Y = 252;
  let k = `<path d="M-3 0 Q-2 -24 -6 -46 L-2 -46 Q2 -24 4 0 Z" fill="${S.lg("buchenstamm", [[0, "#8f9294"], [0.4, "#c4c6c4"], [1, "#6f7274"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-2 -34 Q-12 -46 -20 -54 M0 -40 Q8 -54 14 -62 M-4 -46 Q-6 -58 -2 -70" stroke="#7d8082" stroke-width="1.4" fill="none"/>`;
  const kronen = [[-16, -60, 14, 10], [4, -70, 18, 12], [-4, -84, 14, 10], [16, -56, 12, 9], [-22, -46, 9, 7], [10, -88, 10, 7]];
  for (const [cx, cy, rx, ry] of kronen) {
    k += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${S.rg("buchenkrone", [[0, "#f6cf62"], [0.6, "#e0a234"], [1, "#b8701f"]], 0.35, 0.3, 0.75)}"/>`;
    for (let i = 0; i < 26; i++) { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()); k += `<ellipse cx="${r(cx + Math.cos(a) * rx * d)}" cy="${r(cy + Math.sin(a) * ry * d)}" rx="1.1" ry=".7" fill="${["#f8dc7a", "#e9b040", "#d08a28", "#c06a1e"][Math.floor(rnd() * 4)]}" transform="rotate(${Math.round(rnd() * 180)} ${r(cx + Math.cos(a) * rx * d)} ${r(cy + Math.sin(a) * ry * d)})"/>`; }
  }
  S.teil({ id: "buche", de: "die Buche", syl: "BU-che", it: "il faggio", itSyl: "FAG-gio", en: "beech", x: X, y: Y, steht: true, kunst: k,
    tipp: "Im Oktober leuchten die Blätter der Buchen golden." });
}

/* =====================================================================
   VORNE: der Brückenkopf (Fels, Weg) — Kulisse über der Schlucht?
   Nein: Der Brückenkopf liegt VOR der Schlucht, deshalb als Teil der
   Brücke bzw. eigene Fläche unter Tafel und Wanderer.
   ===================================================================== */

/* =====================================================================
   17 — DIE BRÜCKE (Marienbrücke: eisernes Gitter, Bohlen) links vorn
   ===================================================================== */
{
  /* Geländer-Oberkante von weit (links) nach nah (unten Mitte) */
  const fern = { x: -4, o: 196, u: 212 }, nah = { x: 176, o: 238, u: 262 };
  const at = (t) => ({ x: fern.x + (nah.x - fern.x) * t, o: fern.o + (nah.o - fern.o) * t, u: fern.u + (nah.u - fern.u) * t });
  let k = "";
  /* Bohlenbelag (wir stehen darauf), unten links */
  k += `<path d="M${fern.x} ${fern.u} L${nah.x} ${nah.u} L${nah.x} 264 L${fern.x} 264 Z" fill="${S.lg("bohlen", [[0, "#8a6a48"], [1, "#6a4e34"]])}"/>`;
  for (let t = 0.05; t < 1; t += 0.06 + t * 0.05) { const p = at(t); k += `<line x1="${r(p.x)}" y1="${r(p.u)}" x2="${r(p.x - 6 - t * 30)}" y2="264" stroke="#4e3826" stroke-width="${r(0.2 + t * 0.4)}"/>`; }
  /* Gitterwerk: Pfosten und Diagonalen (perspektivisch dichter nach hinten) */
  const ts = [];
  for (let t = 0; t <= 1.001; t += 0.035 + t * 0.05) ts.push(Math.min(t, 1));
  let g = "";
  for (let i = 0; i < ts.length; i++) {
    const p = at(ts[i]);
    g += `M${r(p.x)} ${r(p.o)} L${r(p.x)} ${r(p.u)} `;
    if (i < ts.length - 1) { const q = at(ts[i + 1]); g += `M${r(p.x)} ${r(p.o)} L${r(q.x)} ${r(q.u)} M${r(p.x)} ${r(p.u)} L${r(q.x)} ${r(q.o)} `; }
  }
  k += `<path d="${g}" stroke="#2c3034" stroke-width=".7" fill="none"/>`;
  /* Ober- und Untergurt, Handlauf mit Lichtkante */
  k += `<path d="M${fern.x} ${fern.o} L${nah.x} ${nah.o} L${nah.x} ${nah.o + 3.4} L${fern.x} ${fern.o + 1.6} Z" fill="${S.lg("gurt", [[0, "#4a5056"], [1, "#24282c"]])}"/>`;
  k += `<path d="M${fern.x} ${fern.o} L${nah.x} ${nah.o}" stroke="#9aa3aa" stroke-width=".5"/>`;
  k += `<path d="M${fern.x} ${fern.u} L${nah.x} ${nah.u} L${nah.x} ${nah.u - 3} L${fern.x} ${fern.u - 1.4} Z" fill="#2a2e32"/>`;
  /* Brückenkopf-Pfeiler am nahen Ende (Fels und Beton) */
  k += `<path d="M${nah.x - 2} ${nah.o - 4} L${nah.x + 10} ${nah.o - 2} L${nah.x + 12} 264 L${nah.x - 2} 264 Z" fill="${S.lg("pfeiler", [[0, "#b8b2a6"], [1, "#8a8478"]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "bruecke", de: "die Brücke", syl: "BRÜ-cke", it: "il ponte", itSyl: "PON-te", en: "bridge", x: 0, y: 0, kunst: k,
    tipp: "Die Marienbrücke hängt etwa 90 Meter über dem Wasserfall. Von hier hat man den schönsten Blick auf das Schloss." });
}

/* =====================================================================
   VORDERGRUND rechts: Brückenkopf mit Weg (Kulisse in „davor“? Nein —
   als Fläche der Infotafel-Standfläche in der Kunst der Tafel)
   ===================================================================== */

/* =====================================================================
   18 — DIE INFOTAFEL (mit Porträt König Ludwigs II.) — Lupe: der König
   ===================================================================== */
{
  const X = 300, Y = 258;
  let k = `<path d="M-30 6 Q-34 -6 -24 -10 Q0 -14 30 -12 Q60 -12 100 -14 L104 6 Z" fill="${S.lg("weg", [[0, "#b9ad94"], [1, "#8f8470"]])}"/>`;
  for (let i = 0; i < 30; i++) k += `<ellipse cx="${r(-26 + rnd() * 126)}" cy="${r(-8 + rnd() * 12)}" rx="${r(0.6 + rnd())}" ry="${r(0.3 + rnd() * 0.4)}" fill="${rnd() < 0.5 ? "#d6ccb6" : "#7a705e"}"/>`;
  k += schatten(0, -1, 18, 1.4, 0.3);
  /* zwei Holzpfosten, Pultdach, Tafel */
  for (const x of [-12, 12]) k += `<rect x="${x - 1.1}" y="-34" width="2.2" height="33" fill="${S.lg("pfosten", [[0, "#7a5636"], [0.5, "#a07448"], [1, "#5e3f26"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-19 -40 L19 -40 L21 -36.6 L-21 -36.6 Z" fill="#5e3f26"/>`;
  k += `<rect x="-17" y="-36.4" width="34" height="22" rx=".6" fill="#3e2a1a"/><rect x="-16" y="-35.4" width="32" height="20" fill="${S.lg("tafel", [[0, "#f6efe0"], [1, "#e6dcc6"]])}"/>`;
  k += `<rect x="-16" y="-35.4" width="32" height="3.4" fill="#1f4f8f"/><text x="0" y="-32.8" font-size="2.4" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-weight="bold">Marienbrücke</text>`;
  /* Porträt Ludwigs II.: dunkles, gewelltes Haar, Uniform, Hermelinkragen */
  k += `<rect x="-14.6" y="-30.6" width="9.6" height="13" fill="#2b2f3a"/>`;
  k += `<path d="M-14.6 -17.6 Q-14.6 -22 -9.8 -22.6 Q-5 -22 -5 -17.6 Z" fill="#1d2a4a"/><path d="M-12.4 -18.6 L-9.8 -21.4 L-7.2 -18.6" stroke="#f2ede2" stroke-width=".8" fill="none"/>`;
  k += `<rect x="-10.4" y="-23.6" width="1.2" height="1.4" fill="#e8c4a2"/><ellipse cx="-9.8" cy="-25.4" rx="2.1" ry="2.6" fill="#ecc8a6"/>`;
  k += `<path d="M-12.1 -25.6 Q-12.6 -29 -9.8 -29 Q-7 -29 -7.4 -25.6 Q-7.8 -27.2 -9.8 -27.4 Q-11.6 -27.2 -12.1 -25.6 Z" fill="#2a1a12"/>`;
  k += `<circle cx="-10.5" cy="-25.6" r=".22" fill="#2a3a5a"/><circle cx="-9.1" cy="-25.6" r=".22" fill="#2a3a5a"/><path d="M-10.4 -24.2 q.6 .3 1.2 0" stroke="#9a5a4a" stroke-width=".2" fill="none"/>`;
  k += `<rect x="-14.6" y="-30.6" width="9.6" height="13" fill="none" stroke="#c9a640" stroke-width=".4"/>`;
  k += `<text x="-9.8" y="-16" font-size="1.4" text-anchor="middle" fill="#3a2a1a" font-family="Georgia,serif">Ludwig II.</text>`;
  /* Text und kleine Karte */
  for (let i = 0; i < 5; i++) k += `<rect x="-3" y="${-30 + i * 2}" width="${i === 4 ? 9 : 16}" height=".6" fill="#8a7e6a"/>`;
  k += `<rect x="-3" y="-20" width="16" height="4.2" fill="#c9d8b4"/><path d="M-2 -17 Q2 -19.6 6 -17.6 Q9 -16 12 -18.4" stroke="#5d8fa0" stroke-width=".6" fill="none"/><circle cx="9" cy="-18.6" r=".6" fill="#b8473a"/>`;
  S.teil({ id: "infotafel", de: "die Infotafel", syl: "IN-fo-ta-fel", it: "il pannello informativo", itSyl: "pan-NEL-lo in-for-ma-TI-vo", en: "information board", x: X, y: Y, steht: true, kunst: k,
    zoom: { x: X - 24, y: Y - 44, w: 48, h: 32 },
    unter: [
      { id: "koenig", de: "der König", syl: "KÖ-nig", it: "il re", itSyl: "RE", en: "king", x: X - 9.8, y: Y - 17.6, kunst: flaeche(-4.8, -13, 9.6, 13),
        tipp: "König Ludwig II. von Bayern (1845–1886) – man nennt ihn den Märchenkönig." },
    ] });
}

/* =====================================================================
   19 — DER WANDERER (am Brückenkopf, schaut zum Schloss) und
   20 — DER RUCKSACK
   ===================================================================== */
const WAND = { x: 340, y: 252 };
const wanderer = B.mensch({ id: "nsw_wanderer", geschlecht: "m", pose: "stehen", blick: 206, frisur: "kurz", haarfarbe: "braun", haut: "hell",
  kleidung: { oberteil: { stueck: "pullover", farbe: "#c8452e" }, unterteil: { stueck: "hose", farbe: "#4b5560" }, schuhe: { stueck: "stiefel", farbe: "#5a3d26" }, kopf: { stueck: "kappe", farbe: "#2f5a35" } } }, 54);
const WP = (n) => { const q = wanderer.z.punkte[n]; return [q[0] * wanderer.k, q[1] * wanderer.k]; };
{
  /* Wanderstöcke in beiden Händen */
  let k = wanderer.svg;
  for (const s of ["L", "R"]) {
    const [hx, hy] = WP("hand" + s);
    const fx = hx + (hx > 0 ? 2.4 : -2.4);
    k += `<line x1="${r(hx)}" y1="${r(hy - 1.4)}" x2="${r(fx)}" y2="0" stroke="#3a3f46" stroke-width=".55"/><rect x="${r(hx - 0.5)}" y="${r(hy - 2.4)}" width="1" height="2" rx=".4" fill="#1c1c1c"/>`;
  }
  S.teil({ id: "wanderer", de: "der Wanderer", syl: "WAN-de-rer", it: "l'escursionista", itSyl: "e-scur-sio-NI-sta", en: "hiker", x: WAND.x, y: WAND.y, kunst: k,
    tipp: "Vom Brückenkopf aus macht der Wanderer das berühmte Foto vom Schloss." });
}
{
  const [sx1, sy1] = WP("schulterL"), [sx2, sy2] = WP("schulterR"), [lx, ly] = WP("lende");
  const cx = (sx1 + sx2) / 2, top = Math.min(sy1, sy2) - 0.6, w = Math.abs(sx1 - sx2) * 0.82, h = (ly - top) * 0.95;
  let k = `<path d="M${r(cx - w / 2)} ${r(top + h)} L${r(cx - w / 2 - 0.4)} ${r(top + 2)} Q${r(cx - w / 2)} ${r(top - 1)} ${r(cx)} ${r(top - 1.2)} Q${r(cx + w / 2)} ${r(top - 1)} ${r(cx + w / 2 + 0.4)} ${r(top + 2)} L${r(cx + w / 2)} ${r(top + h)} Q${r(cx)} ${r(top + h + 1.2)} ${r(cx - w / 2)} ${r(top + h)} Z" fill="${S.lg("rucksack", [[0, "#3d6a8a"], [0.5, "#4f82a6"], [1, "#2c4f68"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(cx - w * 0.36)} ${r(top + h * 0.55)} h${r(w * 0.72)} v${r(h * 0.36)} h${r(-w * 0.72)} Z" fill="#2f5876" stroke="#20384a" stroke-width=".2"/>`;
  k += `<path d="M${r(cx - w / 2 + 0.6)} ${r(top + 1.6)} Q${r(cx)} ${r(top + 3.6)} ${r(cx + w / 2 - 0.6)} ${r(top + 1.6)}" stroke="#20384a" stroke-width=".3" fill="none"/>`;
  k += `<rect x="${r(cx - w / 2 - 0.6)}" y="${r(top + h * 0.3)}" width="1.2" height="${r(h * 0.5)}" rx=".5" fill="#e8b84a"/>`;
  k += `<path d="M${r(cx - 1)} ${r(top - 1)} q1 -1.6 2 0" stroke="#20384a" stroke-width=".4" fill="none"/>`;
  k += `<path d="M${r(cx - w / 2 + 0.6)} ${r(top + 2)} L${r(cx - w / 2 + 0.6)} ${r(top + h - 1)}" stroke="#fff" stroke-width=".4" opacity=".3"/>`;
  S.teil({ oben: true, id: "rucksack", de: "der Rucksack", syl: "RUCK-sack", it: "lo zaino", itSyl: "ZAI-no", en: "backpack", x: WAND.x, y: WAND.y, kunst: k });
}

/* Licht: warmer Nachmittagsschein von links, Dunst über der Ebene */
S.davor(`<rect width="400" height="260" fill="${S.lg("abendlicht", [[0, "#ffd9a0", 0.12], [0.5, "#ffd9a0", 0], [1, "#ffd9a0", 0]], 0, 0, 1, 0)}" pointer-events="none"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/neuschwanstein.js"));
console.log(aus);
