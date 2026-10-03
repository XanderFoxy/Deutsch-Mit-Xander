#!/usr/bin/env node
/* =====================================================================
   KAPSTADT (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … zu den
   bekanntesten Städten in anderen Ländern … als Profi-Grafikdesigner auf
   Hollywood-Niveau“.

   RECHERCHE (V&A Waterfront, Cape Town Tourism „Clock Tower“, Two Oceans
   Aquarium „Seal platform“, SANParks Table Mountain):
   - STANDORT: der Pierhead an der V&A Waterfront, Blick nach SÜDEN über
     das Hafenbecken zum Tafelberg — das Postkartenmotiv. Sommer-
     nachmittag, Südostwind: das „Tischtuch“ liegt auf dem Berg.
     Echte Richtungen von hier (gerechnet): Devil's Peak ≈ 165°,
     Tafelberg (Vorderkante) ≈ 178–207°, Kloof Nek ≈ 212°, Lion's Head
     ≈ 221°, Signal Hill ≈ 231° (schon rechts außerhalb). Von links nach
     rechts also: die Spitze des Devil's Peak, der flache Tafelberg, die
     Kuppe des Lion's Head. Darunter der „City Bowl“ (Innenstadt), links
     die Hochhäuser der Innenstadt.
     Die Sonne steht im Norden (Südhalbkugel), also im Rücken des
     Betrachters: die Nordwände der Berge leuchten, Schatten fallen nach
     Süden (vom Betrachter weg). Am Nachmittag kommt das Licht von rechts
     hinten.
   - TAFELBERG: 1085 m, ein 3 km breites, flaches Plateau aus Tafelberg-
     Sandstein mit Felswänden; in der Mitte die Platteklip-Schlucht;
     rechts oben die Bergstation der Seilbahn (Rotair-Kabine, dreht sich).
     Der Südost-Wind schiebt Wolken über die Kante: das „Tischtuch“.
   - DEVIL'S PEAK 1000 m (spitz, links), LION'S HEAD 669 m (Kuppe mit
     Felskopf, rechts).
   - CLOCK TOWER (Uhrturm): 1882 als Büro des Hafenkapitäns gebaut,
     achteckig, viktorianische Neugotik, rote Wände (Farbe nach alten
     Farbresten), weiße Spitzbogenfenster, Uhr aus Edinburgh, oben ein
     spitzes Dach. Steht an der Einfahrt zum Alfred Basin.
   - HAFEN: Victoria- und Alfred-Becken (nach Königin Victoria und
     Prinz Alfred, Baubeginn 1860), Fischkutter, Segelboote. Kap-Pelzrobben
     ruhen auf einer schwimmenden Plattform („seal platform“) im Becken.
   - TYPISCHES vorn: Café am Kai mit Rooibostee, Königsprotea
     (Nationalblume) und einem Pinguin aus Draht und Glasperlen
     (Kunsthandwerk; echte Brillenpinguine leben am Boulders Beach).
     Dominikanermöwe (Kelp Gull) auf dem Poller.
   - Das Riesenrad „Cape Wheel“ steht seit 2023 am Breakwater Boulevard an
     der Granger Bay – in diesem Blick nach Süden liegt es rechts außerhalb.
   Maßstab: Bild 66° breit (≈ 6 Einheiten je Grad), Augenhöhe y = 142
   (3,6 m über dem Wasser). Ferne Dinge: y = 142 − 347·(Höhe − 3,6)/Abstand.
   Vorne auf dem Kai: Einheiten je Meter = (y − 152) / 1,6.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "kapstadt", titel: "Kapstadt", emoji: "🐧", thema: "Länder", kuerzel: "kap", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1652);
const r = B.r;
const HOR = 142, F = 347, EYE = 3.6;
const HOR0 = 152, DY = HOR - HOR0;      // Berge und Stadt sind in HOR0 gezeichnet und werden um DY verschoben
const bx = (b) => 200 + (b - 193) * 6.06;                 // Himmelsrichtung (Grad) → x
const hy = (Z, d) => HOR0 - F * (Z - EYE) / d;            // Höhe (m) in Abstand (m) → y (vor der Verschiebung DY)
const vorn = (y) => (y - HOR) / 1.6;                      // Einheiten je Meter auf dem Kai
const glatt = (pts) => {                                   // weiche Linie durch Punkte (Catmull-Rom)
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += `C${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)} ${r(p2[0] - (p3[0] - p1[0]) / 6)} ${r(p2[1] - (p3[1] - p1[1]) / 6)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d;
};

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="1.6"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".3"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation="1 .45"/></filter>`);

/* =====================================================================
   KULISSE — Himmel (Südostwind: klar und tiefblau)
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 4}" fill="${S.lg("himmel", [[0, "#1f5fae"], [0.5, "#4f8fcf"], [0.85, "#a9cbe6"], [1, "#dbe9f1"]])}"/>`);
{
  /* zwei kleine Passatwolken weit hinten */
  let w = "";
  for (const [x, y, s] of [[60, 34, 0.8], [338, 22, 0.9], [250, 56, 0.5]]) {
    w += `<g filter="url(#${S.id("wolke")})">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 5], [-10, 1.6, 10, 4], [10, 1.2, 11, 4.4], [-3, -3.6, 9, 5], [6, -4, 7, 4.4]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#ffffff"/>`;
    w += `</g>`;
  }
  S.hinten(w);
}

/* =====================================================================
   1 — DIE BERGE: Devil's Peak, Tafelberg, Lion's Head
   ===================================================================== */
/* Silhouette (x, Höhe m, Abstand m) — von links nach rechts */
const KAMM = {
  devil: [[-4, 520, 5000], [6, 610, 5100], [14, 700, 5250], [20, 800, 5350], [25, 900, 5420], [28.5, 968, 5460], [31, 1000, 5470], [33, 988, 5490], [37, 945, 5530], [44, 905, 5600], [52, 880, 5700], [62, 850, 5820], [74, 812, 5980], [86, 786, 6100], [92, 780, 6150]],
  tafel: [[92, 780, 6150], [97, 840, 6180], [100, 905, 6200], [103, 935, 6220], [106, 1010, 6250], [110, 1056, 6250], [140, 1058, 6250], [175, 1063, 6250], [210, 1066, 6200], [250, 1064, 6150], [282, 1061, 6000], [287, 1030, 5950], [291, 960, 5900], [295, 870, 5800], [301, 680, 5550], [308, 460, 5150], [316, 300, 4900]],
  loewe: [[316, 300, 4900], [326, 360, 4800], [336, 430, 4700], [345, 500, 4640], [351, 560, 4600], [355, 612, 4580], [357.5, 642, 4570], [360, 660, 4560], [364, 668, 4560], [368, 669, 4560], [371, 664, 4560], [374, 650, 4560], [376.5, 624, 4560], [378, 596, 4560], [381, 572, 4530], [386, 548, 4480], [394, 508, 4380], [404, 472, 4200]],
};
const kammXY = (pts) => pts.map(([x, z, d]) => [x, hy(z, d)]);
const FUSS = 136;   // Unterkante der Berge hinter der Stadt
const bergUnter = [];
/* Rippen (helle Grate) mit Schluchten (dunkel, links daneben) vom Kamm zum Fuß */
const rippen = (liste, hell, dunkel) => liste.map(([x0, y0, x1, y1]) =>
  `<path d="M${x0 - 0.8} ${y0 + 1} Q${r((x0 + x1) / 2 - 2.4)} ${r((y0 + y1) / 2)} ${x1 - 2} ${y1}" stroke="${dunkel}" stroke-width="2.4" fill="none" opacity=".2" stroke-linecap="round"/>` +
  `<path d="M${x0} ${y0} Q${r((x0 + x1) / 2 - 1)} ${r((y0 + y1) / 2)} ${x1} ${y1}" stroke="${hell}" stroke-width=".7" fill="none" opacity=".32" stroke-linecap="round"/>`).join("");
const fynbos = (x0, x1, y0, y1, n) => { let g = ""; for (let i = 0; i < n; i++) { const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0); g += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.8 + rnd() * 1.4)}" ry="${r(0.4 + rnd() * 0.5)}" fill="${["#4f5a3a", "#99956f", "#6b7350", "#3f4a30"][i % 4]}" opacity=".5"/>`; } return g; };
{
  /* Der Tafelberg: Plateau, Felswand aus Sandstein mit Pfeilern und Klüften, Platteklip-Schlucht, Seilbahn; Lupe */
  let k = "";
  const tb = kammXY(KAMM.tafel);
  const TOP = hy(1060, 6250);
  const umriss = `${glatt(tb)} L316 ${FUSS} L92 ${FUSS} Z`;
  S.def(`<clipPath id="${S.id("tafel")}"><path d="${umriss}"/></clipPath>`);
  k += `<path d="${umriss}" fill="${S.lg("hangt", [[0, "#7f8160"], [1, "#5f6a46"]])}"/>`;
  k += `<g clip-path="url(#${S.id("tafel")})">`;
  /* Felswand: unten unregelmäßig (Pfeiler reichen tiefer hinab) */
  let wu = `M90 ${r(TOP - 4)} L320 ${r(TOP - 4)} L320 ${r(TOP + 16)}`;
  for (let x = 320; x >= 90; x -= 4) wu += ` L${x} ${r(TOP + 14 + Math.sin(x * 0.7) * 2 + (rnd() * 4))}`;
  k += `<path d="${wu} Z" fill="${S.lg("wand", [[0, "#cdbf9d"], [0.45, "#b6a888"], [1, "#9a8f78"]])}"/>`;
  /* Pfeiler: hell (Licht von rechts) und Rinnen (dunkel), unregelmäßig breit */
  let hellP = "", dunkP = "";
  for (let x = 100; x < 296;) {
    const w = 2 + rnd() * 4.5, l = 10 + rnd() * 8;
    dunkP += `M${r(x)} ${r(TOP)} l${r(-0.3)} ${r(l)} l${r(0.9)} 0 l${r(0.2)} ${r(-l)} Z`;
    hellP += `M${r(x + 1.2)} ${r(TOP + 0.4)} l0 ${r(l - 3)} l${r(w * 0.45)} ${r(1.2)} l0 ${r(-l + 2)} Z`;
    x += w + 1.2;
  }
  k += `<path d="${dunkP}" fill="#6a604f" opacity=".6"/><path d="${hellP}" fill="#e2d5b4" opacity=".3"/>`;
  k += `<rect x="90" y="${r(TOP - 2)}" width="230" height="22" fill="${S.lg("wandtiefe", [[0, "#fff", 0.12], [0.4, "#fff", 0], [1, "#3a3426", 0.3]])}"/>`;
  for (const x of [128, 151, 176, 238, 262]) k += `<path d="M${x - 1.6} ${r(TOP + 0.5)} Q${x - 0.4} ${r(TOP + 8)} ${x - 1} ${r(TOP + 17)} L${x + 0.6} ${r(TOP + 17)} Q${x + 1} ${r(TOP + 8)} ${x + 1.6} ${r(TOP + 0.5)} Z" fill="#544c3e" opacity=".55"/>`;
  for (const f of [0.15, 0.32, 0.5, 0.7]) k += `<path d="M90 ${r(TOP + f * 16)} Q200 ${r(TOP + f * 16 - 0.6)} 320 ${r(TOP + f * 16 + 0.4)}" stroke="#7d735f" stroke-width=".3" opacity=".55"/>`;
  /* Geröll und Fynbos unter der Wand, Rippen und Schluchten, Wald am Fuß */
  k += `<path d="M90 ${r(TOP + 17)} Q200 ${r(TOP + 21)} 320 ${r(TOP + 17)} L320 ${r(TOP + 22)} Q200 ${r(TOP + 25)} 90 ${r(TOP + 22)} Z" fill="#9c9784" opacity=".45"/>`;
  k += fynbos(92, 316, TOP + 18, FUSS, 110);
  k += rippen([[118, 111, 112, 134], [140, 112, 134, 134], [168, 112, 162, 134], [232, 112, 238, 134], [258, 112, 266, 134], [286, 108, 296, 134]], "#c9bf96", "#3c4532");
  for (let i = 0; i < 40; i++) k += `<circle cx="${r(94 + rnd() * 222)}" cy="${r(126 + rnd() * 10)}" r="${r(1 + rnd() * 1.3)}" fill="${rnd() < 0.5 ? "#34502c" : "#47643a"}" opacity=".85"/>`;
  /* Platteklip-Schlucht: tiefe Kerbe in der Wand */
  const PX = 205;
  k += `<path d="M${PX - 2.6} ${r(TOP - 1)} Q${PX} ${r(TOP + 1)} ${PX + 2.8} ${r(TOP - 1)} L${PX + 1.2} ${r(TOP + 19)} L${PX - 1.2} ${r(TOP + 19)} Z" fill="${S.lg("kerbe", [[0, "#4e4a3e"], [1, "#6a6452"]])}"/>`;
  k += `<path d="M${PX + 2.8} ${r(TOP - 1)} L${PX + 1.2} ${r(TOP + 19)}" stroke="#e6d9b8" stroke-width=".5" opacity=".7"/>`;
  k += `<path d="M${PX - 1} ${r(TOP + 19)} Q${PX - 3} ${r(TOP + 30)} ${PX - 7} ${FUSS}" stroke="#3c4532" stroke-width="2.4" fill="none" opacity=".5"/>`;
  k += `</g>`;
  /* Lichtkante der Plateaukante */
  k += `<path d="${glatt(tb.slice(4, 11))}" stroke="#f3e8cc" stroke-width=".7" fill="none" opacity=".8"/>`;
  /* Seilbahn: Bergstation am Westende, Talstation unten, Seil und Kabine */
  const OBEN = [279, TOP + 0.2], UNTEN = [268, 124.5];
  k += `<rect x="${r(OBEN[0] - 3)}" y="${r(OBEN[1] - 2.6)}" width="6" height="2.8" fill="#dcd8ce"/><rect x="${r(OBEN[0] - 3)}" y="${r(OBEN[1] - 2.6)}" width="6" height=".6" fill="#6f6a60"/>`;
  k += `<rect x="${r(UNTEN[0] - 2.4)}" y="${r(UNTEN[1] - 2)}" width="4.8" height="2.4" fill="#e6e2d8"/><rect x="${r(UNTEN[0] - 2.4)}" y="${r(UNTEN[1] - 2.4)}" width="4.8" height=".6" fill="#8a3a2e"/>`;
  k += `<path d="M${OBEN[0] - 1} ${r(OBEN[1] - 1)} Q${r((OBEN[0] + UNTEN[0]) / 2 - 0.5)} ${r((OBEN[1] + UNTEN[1]) / 2 + 2)} ${UNTEN[0]} ${r(UNTEN[1] - 1.6)}" stroke="#2c2c2c" stroke-width=".22" fill="none"/>`;
  const KAB = [274.4, 109];
  k += `<line x1="${KAB[0]}" y1="${r(KAB[1] - 1.2)}" x2="${KAB[0]}" y2="${r(KAB[1] - 0.2)}" stroke="#2c2c2c" stroke-width=".25"/><ellipse cx="${KAB[0]}" cy="${KAB[1] + 0.6}" rx="1.3" ry="1" fill="#eeece6"/><rect x="${r(KAB[0] - 1.25)}" y="${KAB[1] + 0.3}" width="2.5" height=".55" fill="#c23a2b"/><rect x="${r(KAB[0] - 0.9)}" y="${KAB[1] - 0.1}" width="1.8" height=".35" fill="#5a6a78"/>`;
  /* das Tischtuch: weiche Wolke flach auf dem Plateau, fällt über die Kante und löst sich auf */
  let tuch = `<g filter="url(#${S.id("wolke")})">`;
  for (let x = 108; x < 290; x += 9) tuch += `<ellipse cx="${r(x + rnd() * 4)}" cy="${r(TOP - 3.6 - rnd() * 1.6)}" rx="${r(8 + rnd() * 5)}" ry="${r(3 + rnd() * 1.4)}" fill="#ffffff"/>`;
  tuch += `<path d="M104 ${r(TOP + 0.6)} L104 ${r(TOP - 2)} L292 ${r(TOP - 2)} L292 ${r(TOP + 1.4)} Z" fill="#ffffff"/>`;
  tuch += `</g>`;
  /* Unterseite leicht grau, Zungen über der Wand */
  tuch += `<path d="M106 ${r(TOP - 0.6)} Q200 ${r(TOP - 1.4)} 290 ${r(TOP - 0.4)}" stroke="#dfe4ea" stroke-width="1.2" fill="none" opacity=".6" filter="url(#${S.id("wolke")})"/>`;
  const ZUNGE = S.lg("zunge", [[0, "#ffffff", 0.95], [0.6, "#ffffff", 0.55], [1, "#ffffff", 0]]);
  let zu = "";
  for (let i = 0; i < 20; i++) {
    const x = 110 + i * 9.2 + rnd() * 4, l = 5 + rnd() * 11, w = 2.4 + rnd() * 2.6;
    zu += `<path d="M${r(x - w)} ${r(TOP - 0.5)} Q${r(x - w * 0.8)} ${r(TOP + l * 0.55)} ${r(x - 0.3)} ${r(TOP + l)} Q${r(x + w * 0.6)} ${r(TOP + l * 0.5)} ${r(x + w)} ${r(TOP - 0.5)} Z" fill="${ZUNGE}"/>`;
  }
  tuch += `<g filter="url(#${S.id("wolke")})">${zu}</g>`;
  k += tuch;
  bergUnter.push(
    { id: "tischtuch", de: "das Tischtuch", syl: "TISCH-tuch", it: "la tovaglia", itSyl: "to-VA-glia", en: "tablecloth", x: 175, y: TOP + 4 + DY,
      kunst: flaeche(-14, -11, 28, 13), tipp: "Bläst der Südostwind, legt sich eine Wolke wie ein Tischtuch auf den Tafelberg." },
    { id: "seilbahn", de: "die Seilbahn", syl: "SEIL-bahn", it: "la funivia", itSyl: "fu-ni-VI-a", en: "cable car", x: KAB[0], y: KAB[1] + 4 + DY,
      kunst: flaeche(-6, -9, 12, 12, 0.6), tipp: "Die Kabine der Seilbahn dreht sich während der Fahrt einmal ganz um sich selbst." },
    { id: "schlucht", de: "die Schlucht", syl: "SCHLUCHT", it: "la gola", itSyl: "GO-la", en: "gorge", x: PX - 1, y: TOP + 21 + DY,
      kunst: flaeche(-5, -21, 10, 22), tipp: "Durch die Platteklip-Schlucht führt der bekannteste Wanderweg auf den Tafelberg." });
  S.teil({ id: "tafelberg", de: "der Tafelberg", syl: "TA-fel-berg", it: "la Montagna della Tavola", itSyl: "mon-TA-gna DEL-la TA-vo-la", en: "Table Mountain",
    x: 0, y: 0, kunst: `<g transform="translate(0 ${DY})">${k}</g>`, tipp: "Der Tafelberg ist oben flach wie ein Tisch: 1085 Meter hoch und 3 Kilometer breit.",
    zoom: { x: 160, y: r(TOP - 14 + DY), w: 130, h: 86 }, unter: bergUnter });
}
{
  /* Devil's Peak: spitzer Gipfel; Ostflanken (links) im Schatten, Nordwestflanken (rechts) im Licht */
  let k = "";
  const dp = kammXY(KAMM.devil);
  const um = `${glatt(dp)} L92 ${FUSS} L-4 ${FUSS} Z`;
  S.def(`<clipPath id="${S.id("devilc")}"><path d="${um}"/></clipPath>`);
  k += `<path d="${um}" fill="${S.lg("devil", [[0, "#5d6247"], [0.3, "#6c7152"], [0.36, "#8d8c6a"], [1, "#7d8360"]], 0, 0, 1, 0)}"/>`;
  k += `<g clip-path="url(#${S.id("devilc")})">`;
  /* Felsen unter dem Gipfel (grauer Sandstein) */
  k += `<path d="M26.4 96 Q29 91.6 31 89.4 Q33.4 92 36.2 95.4 Q34.6 97.2 33 96.4 Q31.6 98.6 30 97 Q28.4 98.4 26.4 96 Z" fill="${S.lg("devilfels", [[0, "#7e786a"], [1, "#b2a993"]], 0, 0, 1, 0)}" opacity=".85"/>`;
  k += `<path d="M38 99 q2 -.6 3 .8 M22 101 q1.6 -1 3 0" stroke="#9c9480" stroke-width=".8" fill="none" opacity=".6"/>`;
  k += rippen([[31, 90, 26, 132], [31, 90, 42, 130], [46, 100, 58, 132], [16, 106, 6, 132], [62, 104, 76, 132], [80, 107, 90, 132]], "#c2b98e", "#3f4733");
  k += fynbos(-4, 92, 104, FUSS, 60);
  /* Wald am Fuß (Kiefern und Silberbäume) */
  for (let i = 0; i < 26; i++) k += `<circle cx="${r(rnd() * 92)}" cy="${r(124 + rnd() * 12)}" r="${r(1 + rnd() * 1.2)}" fill="${rnd() < 0.5 ? "#36502e" : "#4a6538"}" opacity=".85"/>`;
  k += `</g>`;
  k += `<path d="${glatt(dp.slice(5, 12))}" stroke="#e7dcb8" stroke-width=".6" fill="none" opacity=".7"/>`;
  S.teil({ id: "devils_peak", de: "der Devil's Peak", syl: "DE-vils-peak", it: "il Devil's Peak", itSyl: "DE-vils PIK", en: "Devil's Peak", x: 0, y: 0, kunst: `<g transform="translate(0 ${DY})">${k}</g>`,
    tipp: "Devil's Peak heißt „Teufelsspitze“. Eine Sage erzählt: Ein Pirat raucht hier mit dem Teufel um die Wette – ihr Rauch ist das Tischtuch." });
}
{
  /* Lion's Head: steile Kuppe mit grauem Felskopf, rechts der Rücken zum Signal Hill */
  let k = "";
  const lh = kammXY(KAMM.loewe);
  const um = `${glatt(lh)} L404 ${FUSS} L316 ${FUSS} Z`;
  S.def(`<clipPath id="${S.id("loewec")}"><path d="${um}"/></clipPath>`);
  k += `<path d="${um}" fill="${S.lg("loewe", [[0, "#636a4c"], [0.45, "#7f8360"], [1, "#8a8c69"]], 0, 0, 1, 0)}"/>`;
  k += `<g clip-path="url(#${S.id("loewec")})">`;
  /* Felskopf: nackter grauer Sandstein, links im Schatten, rechts im Licht, Pflanzen in den Ritzen */
  k += `<path d="M353 118 Q355 110 358.5 105 Q362 100 368 99.6 Q374 100.4 377.6 106 Q380.6 112 382.4 119 Q376 116.6 370 118.4 Q362 117 353 118 Z" fill="${S.lg("loewekopf", [[0, "#7c7466"], [0.5, "#a29984"], [1, "#c3b99f"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M356.4 111 Q366 108.6 380 111.6 M355 115 Q363 113.6 371 115.4" stroke="#6a6254" stroke-width=".35" fill="none" opacity=".6"/>`;
  k += `<path d="M362 104 l-.6 6 M369 103 l.4 7 M374.6 106 l.8 6" stroke="#6a6254" stroke-width=".3" opacity=".55"/>`;
  for (const [x, y] of [[358, 113.4], [364, 111.4], [372, 113], [377, 115.6], [361, 116.4]]) k += `<ellipse cx="${x}" cy="${y}" rx="1.6" ry=".6" fill="#6b7350" opacity=".7"/>`;
  k += `<path d="M370.6 99.8 Q376 102.4 378.6 107.6 Q380.8 112.6 382.2 118" stroke="#efe4c8" stroke-width=".8" fill="none" opacity=".75"/>`;
  k += fynbos(316, 404, 112, FUSS, 50);
  /* der Wanderweg windet sich um den Berg */
  k += `<path d="M328 130 Q346 121 362 120.4 Q376 120 388 116 M352 124 Q366 124.6 380 121" stroke="#d1c39c" stroke-width=".35" fill="none" stroke-dasharray="1 .9" opacity=".45"/>`;
  k += rippen([[350, 118, 340, 134], [370, 118, 372, 134], [388, 115, 398, 132]], "#c2b98e", "#3f4733");
  k += `</g>`;
  S.teil({ id: "lions_head", de: "der Lion's Head", syl: "LI-ons-head", it: "il Lion's Head", itSyl: "LA-ions HED", en: "Lion's Head", x: 0, y: 0, kunst: `<g transform="translate(0 ${DY})">${k}</g>`,
    tipp: "Lion's Head heißt „Löwenkopf“: Zusammen mit dem Signal Hill sieht er aus wie ein liegender Löwe." });
}
{
  /* Gleitschirmflieger über dem Signal Hill (starten dort und landen in Sea Point) */
  const schirm = (x, y, s, f1, f2) => {
    let g = `<path d="M${r(x - 5 * s)} ${r(y)} Q${r(x)} ${r(y - 3.2 * s)} ${r(x + 5 * s)} ${r(y)} Q${r(x)} ${r(y - 1.6 * s)} ${r(x - 5 * s)} ${r(y)} Z" fill="${f1}"/>`;
    for (let i = 1; i < 6; i++) { const t = i / 6, px = x - 5 * s + 10 * s * t; g += `<path d="M${r(px)} ${r(y - Math.sin(t * Math.PI) * 2.3 * s)} L${r(px)} ${r(y - Math.sin(t * Math.PI) * 1.2 * s)}" stroke="${f2}" stroke-width="${r(0.25 * s)}"/>`; }
    g += `<path d="M${r(x - 4.6 * s)} ${r(y)} L${r(x)} ${r(y + 5 * s)} L${r(x + 4.6 * s)} ${r(y)}" stroke="#555" stroke-width=".12" fill="none"/>`;
    g += `<rect x="${r(x - 0.5 * s)}" y="${r(y + 4.8 * s)}" width="${r(s)}" height="${r(1.2 * s)}" rx="${r(0.3 * s)}" fill="#2c3540"/>`;
    return g;
  };
  S.hinten(schirm(318, 50, 0.45, "#f2c62f", "#d9532b"));
  S.teil({ id: "gleitschirm", de: "der Gleitschirm", syl: "GLEIT-schirm", it: "il parapendio", itSyl: "pa-ra-PEN-dio", en: "paraglider", x: 0, y: 0, kunst: schirm(356, 70, 0.7, "#d93a3a", "#2f6fb6"),
    tipp: "Vom Signal Hill starten Gleitschirmflieger und landen unten am Meer in Sea Point." });
}

/* =====================================================================
   2 — DIE STADT (City Bowl mit Hochhäusern) am Fuß der Berge
   ===================================================================== */
{
  let k = "";
  /* Hänge mit Häusern (Gardens, Tamboerskloof, Bo-Kaap) */
  k += `<path d="M-2 ${FUSS - 6} Q60 ${FUSS - 4} 100 ${FUSS - 2} Q200 ${FUSS - 1} 300 ${FUSS} Q330 ${FUSS - 6} 360 ${FUSS - 4} Q390 ${FUSS - 6} 402 ${FUSS - 8} L402 ${HOR0 + 2} L-2 ${HOR0 + 2} Z" fill="${S.lg("hang", [[0, "#7d8460"], [1, "#9a9a7c"]])}"/>`;
  const farben = ["#f1ede2", "#e8dcc2", "#f4f0e8", "#d9cbb0", "#e9e2d3", "#c8b9a0", "#f6f2ea"];
  const bunt = ["#e86a8a", "#f2c23c", "#6cc3c9", "#9bd06a", "#f08a3c", "#b48ad8"];
  let h = "";
  for (let i = 0; i < 230; i++) {
    const x = rnd() * 400, top = FUSS - 5 + rnd() * 3, y = top + rnd() * (HOR0 - top - 1), w = 1.1 + (y - FUSS) * 0.06 + rnd() * 0.8, hh = w * 0.6;
    const boKaap = x > 230 && x < 262 && y > 138;
    h += `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(hh)}" fill="${boKaap ? bunt[i % 6] : farben[i % 7]}"/><rect x="${r(x)}" y="${r(y - 0.35)}" width="${r(w)}" height=".4" fill="${rnd() < 0.5 ? "#9a5a43" : "#6d6e70"}"/>`;
  }
  for (let i = 0; i < 70; i++) { const x = rnd() * 400, y = FUSS - 3 + rnd() * (HOR0 - FUSS + 2); h += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.8 + rnd() * 1.1)}" fill="${rnd() < 0.5 ? "#4f6a3a" : "#3f5a30"}" opacity=".85"/>`; }
  k += `<g filter="url(#${S.id("dunst")})">${h}</g>`;
  /* Hochhäuser der Innenstadt (links, unter dem Devil's Peak) */
  const tuerme = [[6, 7, 12], [15, 9, 18], [26, 6, 24], [33, 10, 16], [45, 7, 30], [54, 9, 21], [65, 6, 26], [72, 11, 14], [86, 8, 19], [96, 6, 12], [140, 7, 10], [150, 9, 8]];
  for (const [x, w, hh] of tuerme) {
    const y0 = HOR0 - 4 - hh;
    k += `<rect x="${x}" y="${r(y0)}" width="${w}" height="${r(hh + 4)}" fill="${S.lg("turmglas", [[0, "#c9d3d8"], [1, "#9fb0ba"]], 0, 0, 1, 0)}"/>`;
    k += `<rect x="${x}" y="${r(y0)}" width="${r(w * 0.35)}" height="${r(hh + 4)}" fill="#6f7f89" opacity=".35"/>`;
    for (let y = y0 + 1.6; y < HOR0 - 2; y += 1.8) k += `<rect x="${x + 0.5}" y="${r(y)}" width="${w - 1}" height=".35" fill="#5f7280" opacity=".35"/>`;
  }
  /* Portside Tower (höchstes Haus der Stadt, 139 m) mit Spitze */
  k += `<rect x="45" y="${HOR0 - 34}" width="7" height="30" fill="#b9c6cf"/><path d="M45 ${HOR0 - 34} L48.5 ${HOR0 - 38} L52 ${HOR0 - 34} Z" fill="#9fb0ba"/>`;
  S.teil({ id: "stadt", de: "die Stadt", syl: "STADT", it: "la città", itSyl: "cit-TÀ", en: "city", x: 0, y: 0, kunst: `<g transform="translate(0 ${DY})">${k}</g>`,
    tipp: "Die Innenstadt liegt wie in einer Schüssel zwischen den Bergen – man nennt sie „City Bowl“. Die bunten Häuser gehören zum Bo-Kaap." });
}

/* =====================================================================
   3 — DIE GEBÄUDE AM HAFEN (Waterfront rechts) und 4 — DER UHRTURM
   ===================================================================== */
{
  /* Lagerhäuser und Victoria Wharf: lange Hallen mit Satteldächern (Kulisse) */
  let k = "";
  const Y0 = HOR + 3.4;
  k += `<rect x="180" y="${Y0 - 1}" width="222" height="3" fill="#8f8a80"/>`;
  const hallen = [[186, 30, 9, "#e8e0cf", "#7b4a3a"], [216, 26, 12, "#d9cdb6", "#5b6670"], [242, 40, 10, "#efe9dc", "#7b4a3a"], [282, 22, 14, "#c9583f", "#3f3a36"], [304, 46, 11, "#e4dccb", "#5b6670"], [350, 52, 13, "#f0ebe0", "#7b4a3a"]];
  for (const [x, w, h, wand, dach] of hallen) {
    k += `<rect x="${x}" y="${r(Y0 - h)}" width="${w}" height="${h}" fill="${wand}"/>`;
    const n = Math.max(1, Math.round(w / 9));
    for (let i = 0; i < n; i++) { const gx = x + i * w / n; k += `<path d="M${r(gx)} ${r(Y0 - h)} L${r(gx + w / n / 2)} ${r(Y0 - h - 3)} L${r(gx + w / n)} ${r(Y0 - h)} Z" fill="${dach}"/>`; }
    for (let fx = x + 1.5; fx < x + w - 1.5; fx += 2.6) for (let fy = Y0 - h + 2; fy < Y0 - 2; fy += 3) k += `<rect x="${r(fx)}" y="${r(fy)}" width="1.2" height="1.6" fill="#4b5560" opacity=".7"/>`;
    k += `<rect x="${x}" y="${r(Y0 - h)}" width="${r(w * 0.12)}" height="${h}" fill="#000" opacity=".08"/>`;
  }
  k += `<rect x="180" y="${Y0 + 1.6}" width="222" height="1" fill="#4c4a44"/>`;
  /* linke Kaianlage am Uhrturm (Nelson Mandela Gateway: flaches Glasgebäude) */
  k += `<rect x="0" y="${Y0 - 1}" width="180" height="3" fill="#8f8a80"/>`;
  k += `<rect x="134" y="${r(Y0 - 7)}" width="34" height="6.2" fill="${S.lg("gateway", [[0, "#a9c4d2"], [1, "#6f8fa0"]])}"/><rect x="133" y="${r(Y0 - 8)}" width="36" height="1.4" fill="#e8e6e0"/>`;
  k += `<rect x="0" y="${r(Y0 - 5)}" width="96" height="4.4" fill="#d8d0c2"/>`;
  for (let fx = 2; fx < 94; fx += 3) k += `<rect x="${fx}" y="${r(Y0 - 4)}" width="1.4" height="2" fill="#5c6670" opacity=".6"/>`;
  k += `<rect x="0" y="${Y0 + 1.6}" width="180" height="1" fill="#4c4a44"/>`;
  S.hinten(k);
}
const TURM = { x: 118, y: HOR + 5.4, d: 130 };
const turmUnter = [];
{
  const s = F / TURM.d;            // ≈ 2,67 Einheiten je Meter
  const g = (n) => r(n * s);
  const ROT = S.lg("turmrot", [[0, "#8e2c22"], [0.5, "#b23a2b"], [1, "#c9503a"]], 0, 0, 1, 0);
  let k = schatten(g(0.5), 0.2, g(4.2), 0.8, 0.3);
  /* Achteck: Vorderseite (2,5 m) und zwei Schrägseiten (je 1,75 m sichtbar) */
  const fl = [-3.0, -1.25, 1.25, 3.0];
  const stock = [[0, 1.2], [1.2, 5.4], [5.4, 9.6], [9.6, 13.4]];
  /* Sockel aus grauem Stein */
  k += `<path d="M${g(-3.2)} 0 L${g(-3.2)} ${g(-1.2)} L${g(3.2)} ${g(-1.2)} L${g(3.2)} 0 Z" fill="#9b968c"/>`;
  for (let i = 0; i < 3; i++) {
    const [x0, x1] = [fl[i], fl[i + 1]], hell = ["#7e2a21", "#a8382a", "#c5503a"][i];
    k += `<path d="M${g(x0)} ${g(-1.2)} L${g(x0)} ${g(-13.4)} L${g(x1)} ${g(-13.4)} L${g(x1)} ${g(-1.2)} Z" fill="${hell}"/>`;
  }
  k += `<path d="M${g(-3)} ${g(-1.2)} L${g(3)} ${g(-1.2)} L${g(3)} ${g(-13.4)} L${g(-3)} ${g(-13.4)} Z" fill="${ROT}" opacity=".35"/>`;
  /* weiße Ecklisenen und Gesimse zwischen den Geschossen */
  for (const x of fl) k += `<rect x="${g(x - 0.18)}" y="${g(-13.4)}" width="${g(0.36)}" height="${g(12.2)}" fill="#efe9de"/>`;
  for (const [, z] of stock) k += `<rect x="${g(-3.15)}" y="${g(-z - 0.25)}" width="${g(6.3)}" height="${g(0.4)}" fill="#f3eee4"/>`;
  /* Spitzbogenfenster (weiß gerahmt) auf allen drei Seiten, Tür unten */
  const fenster = (cx, cy, w, h, schr) => {
    const ww = w * (schr ? 0.7 : 1);
    return `<path d="M${g(cx - ww / 2)} ${g(cy)} L${g(cx - ww / 2)} ${g(cy - h * 0.62)} Q${g(cx - ww / 2)} ${g(cy - h)} ${g(cx)} ${g(cy - h - 0.15)} Q${g(cx + ww / 2)} ${g(cy - h)} ${g(cx + ww / 2)} ${g(cy - h * 0.62)} L${g(cx + ww / 2)} ${g(cy)} Z" fill="#f4efe6"/>` +
      `<path d="M${g(cx - ww / 2 + 0.16)} ${g(cy - 0.1)} L${g(cx - ww / 2 + 0.16)} ${g(cy - h * 0.6)} Q${g(cx - ww / 2 + 0.16)} ${g(cy - h + 0.16)} ${g(cx)} ${g(cy - h + 0.05)} Q${g(cx + ww / 2 - 0.16)} ${g(cy - h + 0.16)} ${g(cx + ww / 2 - 0.16)} ${g(cy - h * 0.6)} L${g(cx + ww / 2 - 0.16)} ${g(cy - 0.1)} Z" fill="${S.lg("turmglas2", [[0, "#3a4650"], [1, "#6f8494"]], 0, 0, 1, 1)}"/>` +
      `<path d="M${g(cx)} ${g(cy - 0.1)} L${g(cx)} ${g(cy - h + 0.1)}" stroke="#f4efe6" stroke-width="${g(0.08)}"/>`;
  };
  /* Erdgeschoss: Fenster auf den Schrägseiten (vorn die Tür); 1. Stock: drei Fenster */
  for (const cx of [-2.12, 2.12]) k += fenster(cx, -1.9, 0.8, 2.6, 1);
  for (const [cx, schr] of [[-2.12, 1], [0, 0], [2.12, 1]]) k += fenster(cx, -6.0, schr ? 0.8 : 1.0, 3.1, schr);
  /* Tür vorn */
  k += `<path d="M${g(-0.6)} ${g(-1.2)} L${g(-0.6)} ${g(-3.4)} Q${g(0)} ${g(-4.2)} ${g(0.6)} ${g(-3.4)} L${g(0.6)} ${g(-1.2)} Z" fill="#4a2a20" stroke="#f4efe6" stroke-width="${g(0.14)}"/>`;
  /* oberstes Geschoss: Uhr vorn (und angeschnitten auf den Schrägseiten) */
  const UY = -11.5;
  k += `<circle cx="0" cy="${g(UY)}" r="${g(1.15)}" fill="#fbfaf4" stroke="#2a2420" stroke-width="${g(0.12)}"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(Math.sin(a) * g(0.9))}" y1="${r(g(UY) - Math.cos(a) * g(0.9))}" x2="${r(Math.sin(a) * g(1.02))}" y2="${r(g(UY) - Math.cos(a) * g(1.02))}" stroke="#2a2420" stroke-width="${g(0.07)}"/>`; }
  /* zehn nach vier am Nachmittag */
  k += `<line x1="0" y1="${g(UY)}" x2="${r(Math.sin(4.17 * Math.PI / 6) * g(0.55))}" y2="${r(g(UY) - Math.cos(4.17 * Math.PI / 6) * g(0.55))}" stroke="#1b1612" stroke-width="${g(0.12)}" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="${g(UY)}" x2="${r(Math.sin(2 * Math.PI / 6) * g(0.82))}" y2="${r(g(UY) - Math.cos(2 * Math.PI / 6) * g(0.82))}" stroke="#1b1612" stroke-width="${g(0.08)}" stroke-linecap="round"/>`;
  for (const sx of [-1, 1]) k += `<ellipse cx="${g(sx * 2.12)}" cy="${g(UY)}" rx="${g(0.6)}" ry="${g(0.95)}" fill="#efebe2" stroke="#2a2420" stroke-width="${g(0.08)}"/>`;
  /* Gesims mit Konsolen, darüber das spitze achteckige Dach mit Wetterfahne */
  k += `<rect x="${g(-3.4)}" y="${g(-13.9)}" width="${g(6.8)}" height="${g(0.6)}" fill="#f3eee4"/>`;
  for (let x = -3.2; x <= 3.2; x += 0.53) k += `<rect x="${g(x)}" y="${g(-13.4)}" width="${g(0.2)}" height="${g(0.35)}" fill="#d9d1c2"/>`;
  k += `<path d="M${g(-3.3)} ${g(-13.9)} L${g(0)} ${g(-19.6)} L${g(-1.2)} ${g(-13.9)} Z" fill="#3e4247"/><path d="M${g(-1.2)} ${g(-13.9)} L${g(0)} ${g(-19.6)} L${g(1.2)} ${g(-13.9)} Z" fill="#555b61"/><path d="M${g(1.2)} ${g(-13.9)} L${g(0)} ${g(-19.6)} L${g(3.3)} ${g(-13.9)} Z" fill="#6c737a"/>`;
  for (const f of [0.3, 0.55, 0.78]) k += `<path d="M${g(-3.3 * (1 - f))} ${g(-13.9 - 5.7 * f)} L${g(3.3 * (1 - f))} ${g(-13.9 - 5.7 * f)}" stroke="#2c3034" stroke-width="${g(0.08)}"/>`;
  k += `<line x1="0" y1="${g(-19.6)}" x2="0" y2="${g(-21)}" stroke="#2c2c2c" stroke-width="${g(0.12)}"/><path d="M0 ${g(-20.7)} l${g(1)} ${g(0.2)} l${g(-1)} ${g(0.25)} Z" fill="#2c2c2c"/>`;
  /* Licht von rechts: rechte Kante hell */
  k += `<rect x="${g(2.6)}" y="${g(-13.4)}" width="${g(0.4)}" height="${g(12.2)}" fill="#fff" opacity=".18"/>`;
  turmUnter.push(
    { id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: TURM.x, y: TURM.y + Number(g(UY)) + Number(g(1.3)),
      kunst: flaeche(-Number(g(1.4)), -Number(g(2.6)), Number(g(2.8)), Number(g(2.6)), 0.6), tipp: "Die Uhr kam 1882 aus Edinburgh in Schottland." },
    { id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: TURM.x, y: TURM.y + Number(g(-5.8)),
      kunst: flaeche(-Number(g(0.7)), -Number(g(3.3)), Number(g(1.4)), Number(g(3.4)), 0.4), tipp: "Die spitzen Bogenfenster sind typisch für die Neugotik." },
    { id: "dach", de: "das Dach", syl: "DACH", it: "il tetto", itSyl: "TET-to", en: "roof", x: TURM.x, y: TURM.y + Number(g(-13.9)),
      kunst: flaeche(-Number(g(2.6)), -Number(g(6.2)), Number(g(5.2)), Number(g(6.2)), 0.4) });
  S.teil({ id: "uhrturm", de: "der Uhrturm", syl: "UHR-turm", it: "la torre dell'orologio", itSyl: "TOR-re del-lo-ro-LO-gio", en: "clock tower", x: TURM.x, y: TURM.y, steht: true, kunst: k,
    tipp: "Der rote Uhrturm von 1882 war das Büro des Hafenkapitäns. Von oben sah er alle Schiffe kommen.",
    zoom: { x: TURM.x - 30, y: TURM.y - 60, w: 60, h: 64 }, unter: turmUnter });
}

/* =====================================================================
   5 — DER HAFEN (Victoria Basin)
   ===================================================================== */
const KAI = 214;   // Vorderkante des Kais, auf dem der Betrachter steht
{
  let k = `<rect x="0" y="${HOR + 4.6}" width="400" height="${KAI - HOR - 3.6}" fill="${S.lg("wasser", [[0, "#7ea2ad"], [0.2, "#3f7480"], [1, "#1d4a55"]])}"/>`;
  /* Spiegelungen: Uhrturm (rot), Hallen, Berge */
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".55">`;
  for (let i = 0; i < 12; i++) k += `<rect x="${r(TURM.x - 7 + (i % 2) * 1.4)}" y="${r(HOR + 5 + i * 2.6)}" width="${r(14 - i * 0.5)}" height="1.7" fill="#b23a2b" opacity="${r(0.55 - i * 0.03)}"/>`;
  k += `<rect x="186" y="${HOR + 5}" width="216" height="9" fill="#e8e0cf" opacity=".35"/><rect x="0" y="${HOR + 5}" width="96" height="6" fill="#d8d0c2" opacity=".3"/>`;
  k += `</g>`;
  let wl = "";
  for (let i = 0; i < 200; i++) {
    const y = HOR + 6 + Math.pow(rnd(), 0.85) * (KAI - HOR - 8), w = 1 + (y - HOR) * 0.25 * (0.5 + rnd());
    wl += `<path d="M${r(rnd() * 400)} ${r(y)} q${r(w / 2)} -.5 ${r(w)} 0" stroke="${rnd() < 0.55 ? "#cfe6e8" : "#123a44"}" stroke-width="${r(0.15 + (y - HOR) * 0.011)}" fill="none" opacity="${r(0.3 + rnd() * 0.45)}"/>`;
  }
  k += wl;
  S.teil({ id: "hafen", de: "der Hafen", syl: "HA-fen", it: "il porto", itSyl: "POR-to", en: "harbour", x: 0, y: 0, kunst: k,
    tipp: "Die Hafenbecken heißen Victoria und Alfred – nach Königin Victoria und ihrem Sohn Prinz Alfred." });
}

/* =====================================================================
   6 — DAS SEGELBOOT, 7 — DAS FISCHERBOOT (Kutter am Kai rechts)
   ===================================================================== */
{
  const X = 66, Y = HOR + 9.6, s = F / 210;   // Jacht vor Anker, ≈ 210 m
  const g = (n) => r(n * s);
  let k = schatten(0, 0.2, g(6), 0.6, 0.2);
  k += `<path d="M${g(-6)} ${g(-1.4)} L${g(6.5)} ${g(-1.4)} Q${g(5.4)} 0 ${g(3)} 0 L${g(-5)} 0 Z" fill="#fbfbfa"/><rect x="${g(-6)}" y="${g(-0.7)}" width="${g(12)}" height="${g(0.3)}" fill="#1f4f8f"/>`;
  k += `<line x1="0" y1="${g(-1.4)}" x2="0" y2="${g(-15)}" stroke="#d6d9db" stroke-width="${g(0.18)}"/>`;
  k += `<path d="M${g(0.2)} ${g(-14.6)} Q${g(4.6)} ${g(-7)} ${g(5)} ${g(-2)} L${g(0.2)} ${g(-2)} Z" fill="#ffffff"/><path d="M${g(-0.2)} ${g(-12.4)} Q${g(-3.4)} ${g(-7)} ${g(-4.4)} ${g(-2.2)} L${g(-0.2)} ${g(-2.2)} Z" fill="#eef2f4"/>`;
  S.teil({ id: "segelboot", de: "das Segelboot", syl: "SE-gel-boot", it: "la barca a vela", itSyl: "BAR-ca a VE-la", en: "sailing boat", x: X, y: Y, kunst: k });
}
{
  /* Fischkutter: blauer Stahlrumpf mit Roststreifen, weißes Ruderhaus, Mast mit Ausleger, orange Bojen */
  const X = 318, Y = HOR + 12.6, s = F / 120;   // ≈ 120 m
  const g = (n) => r(n * s);
  let k = schatten(0, 0.2, g(11), 0.8, 0.25);
  k += `<path d="M${g(-11)} ${g(-3.4)} L${g(10)} ${g(-4.2)} L${g(11.6)} ${g(-5.2)} Q${g(10.6)} 0 ${g(8)} 0 L${g(-9)} 0 Q${g(-10.6)} ${g(-0.6)} ${g(-11)} ${g(-3.4)} Z" fill="${S.lg("kutter", [[0, "#2f5f9a"], [0.7, "#1f4370"], [0.71, "#8c2a22"], [1, "#6a1f19"]])}"/>`;
  k += `<path d="M${g(-11)} ${g(-3.4)} L${g(11.6)} ${g(-5.2)}" stroke="#f1efe8" stroke-width="${g(0.3)}"/>`;
  for (const x of [-7, -2, 4, 8]) k += `<path d="M${g(x)} ${g(-3.6)} l${g(0.2)} ${g(2.4)}" stroke="#a8582e" stroke-width="${g(0.25)}" opacity=".6"/>`;
  k += `<text x="${g(-6)}" y="${g(-1.5)}" font-size="${g(0.9)}" fill="#f1efe8" font-family="Arial,sans-serif" font-weight="bold">SEA SPRAY  CTA 214</text>`;
  /* Ruderhaus */
  k += `<path d="M${g(2)} ${g(-4.5)} L${g(2.4)} ${g(-8.6)} L${g(7.6)} ${g(-8.6)} L${g(8.4)} ${g(-4.8)} Z" fill="#f3f1ea"/>`;
  for (const x of [3, 4.6, 6.2]) k += `<rect x="${g(x)}" y="${g(-8)}" width="${g(1.1)}" height="${g(1.2)}" fill="#2f3f4c"/>`;
  k += `<rect x="${g(2.2)}" y="${g(-9.2)}" width="${g(5.6)}" height="${g(0.6)}" fill="#c23a2b"/>`;
  /* Mast, Ausleger, Netzwinde, Bojen */
  k += `<line x1="${g(-1)}" y1="${g(-4)}" x2="${g(-1)}" y2="${g(-15)}" stroke="#d9d9d4" stroke-width="${g(0.28)}"/><line x1="${g(-1)}" y1="${g(-13)}" x2="${g(-9)}" y2="${g(-5)}" stroke="#d9d9d4" stroke-width="${g(0.2)}"/>`;
  k += `<line x1="${g(-1)}" y1="${g(-15)}" x2="${g(10)}" y2="${g(-5)}" stroke="#555" stroke-width="${g(0.08)}"/><line x1="${g(-1)}" y1="${g(-15)}" x2="${g(-10.6)}" y2="${g(-3.8)}" stroke="#555" stroke-width="${g(0.08)}"/>`;
  k += `<ellipse cx="${g(-4.6)}" cy="${g(-4.6)}" rx="${g(1.6)}" ry="${g(1)}" fill="#3d6b4a"/>`;
  for (const [x, y] of [[-8.6, -4.4], [-7.4, -4.6], [9.4, -6]]) k += `<circle cx="${g(x)}" cy="${g(y)}" r="${g(0.5)}" fill="#f07a1e"/>`;
  k += `<path d="M${g(-11)} ${g(0.3)} q${g(11)} ${g(0.6)} ${g(22)} 0" stroke="#e8f0f0" stroke-width="${g(0.2)}" fill="none" opacity=".6"/>`;
  S.teil({ id: "fischerboot", de: "das Fischerboot", syl: "FI-scher-boot", it: "il peschereccio", itSyl: "pe-sche-REC-cio", en: "fishing boat", x: X, y: Y, kunst: k,
    tipp: "Am Kai laden die Fischer ihren Fang aus – oft Snoek und Hake." });
}

/* =====================================================================
   8 — DIE ROBBEN auf der schwimmenden Plattform
   ===================================================================== */
{
  const X = 196, Y = 192, s = (Y - HOR) / EYE * 0.98;   // Einheiten je Meter in diesem Abstand (Wasserlinie)
  const g = (n) => r(n * s);
  let k = schatten(0, 0.4, g(3), 1.4, 0.35);
  /* Plattform: graue Schwimmkörper mit Holzbelag */
  k += `<path d="M${g(-3)} 0 L${g(-2.7)} ${g(-0.4)} L${g(2.7)} ${g(-0.4)} L${g(3)} 0 Z" fill="${S.lg("ponton", [[0, "#c9cdcf"], [1, "#7f8486"]])}"/>`;
  k += `<path d="M${g(-2.7)} ${g(-0.4)} L${g(-2.3)} ${g(-0.75)} L${g(2.3)} ${g(-0.75)} L${g(2.7)} ${g(-0.4)} Z" fill="#9a8a72"/>`;
  for (let x = -2.2; x < 2.2; x += 0.35) k += `<line x1="${g(x)}" y1="${g(-0.74)}" x2="${g(x * 1.18)}" y2="${g(-0.46)}" stroke="#8a7458" stroke-width=".25"/>`;
  k += `<path d="M${g(-3.2)} ${g(0.15)} q${g(3.2)} ${g(0.25)} ${g(6.4)} 0" stroke="#d8eaea" stroke-width=".5" fill="none" opacity=".6"/>`;
  /* Kap-Pelzrobben: dunkelbraun, nass glänzend, kleine Ohren, Vorderflossen */
  const robbe = (x, y, l, kopfHoch, dir, ton) => {
    const q = (n) => r(n * s * l);
    const X0 = Number(g(x)), Y0 = Number(g(y));
    const fell = S.rg("robbe" + ton, [[0, ton === 1 ? "#8c6e50" : "#6f5844"], [0.6, ton === 1 ? "#5e4632" : "#4c3a2b"], [1, "#2b2119"]], 0.45, 0.25, 0.85);
    let r0 = `<g transform="translate(${X0} ${Y0}) scale(${dir} 1)">`;
    /* Körper: spindelförmig, liegt auf dem Bauch; Hinterflossen nach hinten */
    r0 += `<path d="M${q(-0.92)} ${q(-0.04)} Q${q(-0.7)} ${q(-0.3)} ${q(-0.2)} ${q(-0.42)} Q${q(0.25)} ${q(-0.46)} ${q(0.5)} ${q(-0.36)} L${q(0.62)} ${q(-0.18)} Q${q(0.55)} 0 ${q(0.2)} 0 Z" fill="${fell}"/>`;
    r0 += `<path d="M${q(-0.9)} ${q(-0.06)} L${q(-1.18)} ${q(-0.2)} Q${q(-1.22)} ${q(-0.05)} ${q(-1.16)} ${q(0.04)} Z" fill="#2f241b"/>`;
    /* Hals und Kopf (gehoben oder liegend), spitze Schnauze, kleines Ohr */
    if (kopfHoch) {
      r0 += `<path d="M${q(0.3)} ${q(-0.4)} Q${q(0.5)} ${q(-0.8)} ${q(0.72)} ${q(-0.86)} Q${q(0.92)} ${q(-0.88)} ${q(1.04)} ${q(-0.78)} Q${q(0.92)} ${q(-0.7)} ${q(0.78)} ${q(-0.62)} Q${q(0.7)} ${q(-0.4)} ${q(0.62)} ${q(-0.18)} Z" fill="${fell}"/>`;
      r0 += `<circle cx="${q(0.8)}" cy="${q(-0.8)}" r="${q(0.035)}" fill="#0b0806"/><path d="M${q(0.7)} ${q(-0.86)} l${q(-0.03)} ${q(-0.05)}" stroke="#2b2119" stroke-width="${q(0.04)}"/>`;
      r0 += `<path d="M${q(0.95)} ${q(-0.76)} l${q(0.12)} ${q(0.02)} M${q(0.95)} ${q(-0.75)} l${q(0.1)} ${q(0.06)}" stroke="#d9cbb4" stroke-width="${q(0.012)}" opacity=".8"/>`;
    } else {
      r0 += `<path d="M${q(0.45)} ${q(-0.36)} Q${q(0.8)} ${q(-0.4)} ${q(0.98)} ${q(-0.2)} Q${q(0.9)} ${q(-0.08)} ${q(0.6)} ${q(-0.1)} Z" fill="${fell}"/>`;
      r0 += `<circle cx="${q(0.78)}" cy="${q(-0.27)}" r="${q(0.03)}" fill="#0b0806"/>`;
    }
    /* Vorderflosse und nasser Glanz */
    r0 += `<path d="M${q(0.15)} ${q(-0.12)} Q${q(0.3)} ${q(0.02)} ${q(0.52)} ${q(0.02)} L${q(0.36)} ${q(-0.16)} Z" fill="#2f241b"/>`;
    r0 += `<path d="M${q(-0.55)} ${q(-0.3)} Q${q(-0.1)} ${q(-0.44)} ${q(0.35)} ${q(-0.38)}" stroke="#e4d2b8" stroke-width="${q(0.05)}" fill="none" opacity=".55"/>`;
    return r0 + `</g>`;
  };
  k += robbe(-1.4, -0.74, 1, false, 1, 2) + robbe(1.3, -0.74, 1.1, true, -1, 1) + robbe(0.05, -0.78, 0.95, true, 1, 2);
  /* eine Robbe im Wasser daneben */
  k += `<g transform="translate(${g(4.6)} ${g(-0.05)})"><path d="M0 0 q${g(0.3)} ${g(-0.45)} ${g(0.7)} ${g(-0.36)} q${g(0.2)} ${g(0.12)} ${g(0.1)} ${g(0.36)} Z" fill="#3a2c20"/><circle cx="${g(0.55)}" cy="${g(-0.32)}" r=".25" fill="#0d0a08"/><path d="M${g(-0.6)} ${g(0.05)} q${g(0.9)} ${g(0.25)} ${g(1.6)} 0" stroke="#d8eaea" stroke-width=".4" fill="none" opacity=".7"/></g>`;
  S.teil({ id: "robbe", de: "die Robbe", syl: "ROB-be", it: "la foca", itSyl: "FO-ca", en: "seal", x: X, y: Y, kunst: k,
    tipp: "Kap-Pelzrobben ruhen im Hafen auf einer schwimmenden Plattform – nur für sie gebaut." });
}

/* =====================================================================
   VORN — der Kai (Pierhead): Pflaster, Kaikante, Poller, Möwe, Café
   ===================================================================== */
{
  let k = `<rect x="0" y="${KAI}" width="400" height="${260 - KAI}" fill="${S.lg("kai", [[0, "#b9b2a6"], [1, "#9b9488"]])}"/>`;
  /* Kaikante aus Granitblöcken */
  k += `<rect x="0" y="${KAI - 0.6}" width="400" height="5" fill="${S.lg("kante", [[0, "#e2ddd3"], [1, "#a39d92"]])}"/>`;
  for (let x = 0; x < 400; x += 18) k += `<line x1="${x}" y1="${KAI}" x2="${x}" y2="${KAI + 4.4}" stroke="#7d776d" stroke-width=".4"/>`;
  /* Pflaster in Fluchtperspektive (Fluchtpunkt in der Bildmitte am Horizont) */
  let p = "";
  for (let i = -22; i <= 22; i++) p += `M${r(200 + i * 9.6)} ${KAI + 4.4} L${r(200 + i * 9.6 * (260 - HOR) / (KAI + 4.4 - HOR))} 260`;
  for (const y of [222, 231, 242, 255]) p += `M0 ${y} L400 ${y}`;
  k += `<path d="${p}" stroke="#8a8478" stroke-width=".35" opacity=".7"/>`;
  for (let i = 0; i < 90; i++) k += `<circle cx="${r(rnd() * 400)}" cy="${r(KAI + 6 + rnd() * 54)}" r="${r(0.3 + rnd() * 0.6)}" fill="${rnd() < 0.5 ? "#857e72" : "#d2ccc0"}" opacity=".5"/>`;
  k += `<rect x="0" y="${KAI + 4.4}" width="400" height="${260 - KAI - 4.4}" fill="${S.lg("kailicht", [[0, "#000", 0.12], [0.3, "#000", 0], [1, "#000", 0.1]])}"/>`;
  S.hinten(k);
}
{
  /* Poller aus Gusseisen mit dicker Festmacherleine */
  const X = 74, Y = 226, s = vorn(Y);
  const g = (n) => r(n * s);
  let k = schatten(0, 0.4, g(0.36), g(0.08), 0.4);
  const PG = S.lg("poller", [[0, "#1f2226"], [0.45, "#5a6066"], [1, "#16181b"]], 0, 0, 1, 0);
  /* Fußplatte, Schaft mit Taille, Pilzkopf (Gusseisen, schwarz lackiert) */
  k += `<path d="M${g(-0.26)} 0 L${g(-0.24)} ${g(-0.05)} L${g(0.24)} ${g(-0.05)} L${g(0.26)} 0 Z" fill="#2a2d31"/>`;
  k += `<path d="M${g(-0.17)} ${g(-0.05)} Q${g(-0.16)} ${g(-0.3)} ${g(-0.12)} ${g(-0.4)} Q${g(-0.2)} ${g(-0.44)} ${g(-0.22)} ${g(-0.5)} Q${g(-0.2)} ${g(-0.58)} 0 ${g(-0.59)} Q${g(0.2)} ${g(-0.58)} ${g(0.22)} ${g(-0.5)} Q${g(0.2)} ${g(-0.44)} ${g(0.12)} ${g(-0.4)} Q${g(0.16)} ${g(-0.3)} ${g(0.17)} ${g(-0.05)} Z" fill="${PG}"/>`;
  k += `<path d="M${g(-0.1)} ${g(-0.56)} Q0 ${g(-0.6)} ${g(0.12)} ${g(-0.55)}" stroke="#8a9096" stroke-width="${g(0.02)}" fill="none" opacity=".7"/>`;
  /* Festmacherleine: um den Hals gelegt, Rest als Bucht auf dem Kai */
  k += `<path d="M${g(-0.14)} ${g(-0.36)} Q0 ${g(-0.28)} ${g(0.14)} ${g(-0.36)}" stroke="#e6d6a8" stroke-width="${g(0.05)}" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${g(0.14)} ${g(-0.36)} Q${g(0.32)} ${g(-0.2)} ${g(0.32)} 0 M${g(0.3)} ${g(0.02)} Q${g(0.62)} ${g(0.06)} ${g(0.66)} ${g(0.0)} Q${g(0.68)} ${g(-0.06)} ${g(0.42)} ${g(-0.05)} Q${g(0.3)} ${g(-0.04)} ${g(0.38)} ${g(0.05)} Q${g(0.58)} ${g(0.1)} ${g(0.72)} ${g(0.04)}" stroke="#e6d6a8" stroke-width="${g(0.045)}" fill="none" stroke-linecap="round"/>`;
  S.teil({ id: "poller", de: "der Poller", syl: "POL-ler", it: "la bitta", itSyl: "BIT-ta", en: "bollard", x: X, y: Y, steht: true, kunst: k,
    tipp: "Am Poller wird das Schiff mit einer dicken Leine festgemacht." });
  /* Dominikanermöwe auf dem Poller: weißer Kopf, schwarzer Rücken, gelber Schnabel mit rotem Fleck */
  const m = (n) => r(n * s / 60);
  let w = `<path d="M${m(-1)} 0 L${m(-0.6)} ${m(-4)} M${m(1.4)} 0 L${m(1.2)} ${m(-4)}" stroke="#e1c46a" stroke-width="${m(0.7)}" stroke-linecap="round"/>`;
  w += `<path d="M${m(-10)} ${m(-8.4)} L${m(-5)} ${m(-9.4)} L${m(-5.6)} ${m(-7.4)} Z" fill="#141518"/>`;
  w += `<path d="M${m(-8.4)} ${m(-8.6)} Q${m(-3)} ${m(-13.6)} ${m(3.6)} ${m(-12)} Q${m(6.4)} ${m(-10.8)} ${m(5.4)} ${m(-7.4)} Q${m(3.6)} ${m(-4.4)} ${m(-1.2)} ${m(-4.8)} Q${m(-5.4)} ${m(-5.6)} ${m(-8.4)} ${m(-8.6)} Z" fill="${S.rg("moewe", [[0, "#ffffff"], [1, "#e2e4e6"]], 0.6, 0.45, 0.7)}"/>`;
  w += `<path d="M${m(-8.8)} ${m(-8.7)} Q${m(-3)} ${m(-12.2)} ${m(3)} ${m(-10.2)} Q${m(-1)} ${m(-7.6)} ${m(-8.8)} ${m(-8.7)} Z" fill="#1c1e22"/>`;
  w += `<path d="M${m(-4)} ${m(-10.2)} q${m(2)} ${m(-0.6)} ${m(4)} ${m(0)}" stroke="#f2f2f2" stroke-width="${m(0.35)}" fill="none" opacity=".7"/>`;
  w += `<circle cx="${m(4.4)}" cy="${m(-13.2)}" r="${m(2.1)}" fill="#ffffff"/><circle cx="${m(5.1)}" cy="${m(-13.7)}" r="${m(0.36)}" fill="#e8d36a"/><circle cx="${m(5.1)}" cy="${m(-13.7)}" r="${m(0.18)}" fill="#111"/>`;
  w += `<path d="M${m(6.2)} ${m(-13.4)} L${m(9.4)} ${m(-12.8)} Q${m(9.6)} ${m(-12.2)} ${m(9)} ${m(-12)} L${m(6.2)} ${m(-12.2)} Z" fill="#f2c62f"/><circle cx="${m(8.6)}" cy="${m(-12.2)}" r="${m(0.35)}" fill="#d8321e"/>`;
  S.teil({ oben: true, id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: X, y: Y - Number(g(0.59)), kunst: w,
    tipp: "Die Dominikanermöwe hat einen schwarzen Rücken und einen gelben Schnabel mit rotem Fleck." });
}

/* =====================================================================
   9 — DER CAFÉTISCH am Kai mit Rooibostee, Protea und Perlen-Pinguin
       (Lupe); 10 — DER STUHL
   ===================================================================== */
const TISCH = { x: 312, y: 247 };
const tischUnter = [];
{
  /* Bistrostuhl neben dem Tisch (Bugholz, Rattangeflecht), schräg von der Seite */
  const s = vorn(TISCH.y - 6);
  const g = (n) => r(n * s);
  let k = schatten(0, 0.3, g(0.24), g(0.05), 0.3);
  const HOLZ = "#4a2e1c";
  k += `<path d="M${g(-0.2)} 0 Q${g(-0.19)} ${g(-0.25)} ${g(-0.17)} ${g(-0.45)} M${g(0.18)} 0 Q${g(0.17)} ${g(-0.25)} ${g(0.15)} ${g(-0.45)} M${g(-0.05)} ${g(0.02)} L${g(-0.04)} ${g(-0.44)}" stroke="${HOLZ}" stroke-width="${g(0.035)}" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${g(-0.23)} ${g(-0.44)} L${g(0.21)} ${g(-0.44)} L${g(0.18)} ${g(-0.5)} L${g(-0.2)} ${g(-0.5)} Z" fill="${S.lg("rattan", [[0, "#d9b77a"], [1, "#b48a4e"]])}"/><rect x="${g(-0.23)}" y="${g(-0.44)}" width="${g(0.44)}" height="${g(0.035)}" fill="${HOLZ}"/>`;
  /* Lehne: Bugholzbogen mit Geflecht */
  k += `<path d="M${g(0.17)} ${g(-0.47)} Q${g(0.24)} ${g(-0.75)} ${g(0.2)} ${g(-0.92)} Q${g(0.12)} ${g(-0.98)} ${g(0.08)} ${g(-0.9)} Q${g(0.12)} ${g(-0.72)} ${g(0.09)} ${g(-0.5)}" fill="${S.lg("rattan2", [[0, "#d4b072"], [1, "#a97f45"]])}" stroke="${HOLZ}" stroke-width="${g(0.02)}"/>`;
  for (let i = 1; i < 6; i++) k += `<line x1="${g(0.1)}" y1="${g(-0.5 - i * 0.075)}" x2="${g(0.21)}" y2="${g(-0.5 - i * 0.075)}" stroke="#8a6436" stroke-width=".3"/>`;
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: TISCH.x + 32, y: TISCH.y - 6, steht: true, kunst: k });
}
{
  const s = vorn(TISCH.y);    // ≈ 59 Einheiten je Meter
  const g = (n) => r(n * s);
  const TOP = -0.74;
  let k = schatten(0, 0.4, g(0.36), g(0.07), 0.35);
  /* Fuß und Säule */
  k += `<path d="M${g(-0.24)} 0 L${g(0.24)} 0 L${g(0.03)} ${g(-0.05)} L${g(-0.03)} ${g(-0.05)} Z" fill="#3a3d40"/><rect x="${g(-0.025)}" y="${g(TOP)}" width="${g(0.05)}" height="${g(-TOP)}" fill="#55595d"/>`;
  /* runde Tischplatte (Marmor), leicht von oben */
  k += `<ellipse cx="0" cy="${g(TOP + 0.02)}" rx="${g(0.36)}" ry="${g(0.07)}" fill="#8f8a82"/>`;
  k += `<ellipse cx="0" cy="${g(TOP)}" rx="${g(0.36)}" ry="${g(0.07)}" fill="${S.rg("marmor", [[0, "#fbfaf6"], [1, "#dcd8cf"]], 0.4, 0.4, 0.7)}"/>`;
  /* Rooibostee im Glas mit Untertasse und Zitrone */
  const TX = -0.2;
  k += `<ellipse cx="${g(TX)}" cy="${g(TOP - 0.005)}" rx="${g(0.07)}" ry="${g(0.016)}" fill="#e9e6df" stroke="#c9c4ba" stroke-width=".2"/>`;
  k += `<path d="M${g(TX - 0.04)} ${g(TOP - 0.01)} L${g(TX - 0.045)} ${g(TOP - 0.1)} L${g(TX + 0.045)} ${g(TOP - 0.1)} L${g(TX + 0.04)} ${g(TOP - 0.01)} Z" fill="${S.lg("rooibos", [[0, "#c8552c"], [1, "#8a2a14"]])}" opacity=".95"/>`;
  k += `<path d="M${g(TX - 0.045)} ${g(TOP - 0.1)} L${g(TX - 0.048)} ${g(TOP - 0.125)} L${g(TX + 0.048)} ${g(TOP - 0.125)} L${g(TX + 0.045)} ${g(TOP - 0.1)}" fill="#e8f1f2" opacity=".5"/>`;
  k += `<path d="M${g(TX - 0.03)} ${g(TOP - 0.09)} L${g(TX - 0.03)} ${g(TOP - 0.03)}" stroke="#fff" stroke-width=".35" opacity=".6"/>`;
  k += `<path d="M${g(TX + 0.045)} ${g(TOP - 0.09)} q${g(0.03)} ${g(0.02)} 0 ${g(0.06)}" stroke="#d9e4e6" stroke-width=".4" fill="none"/>`;
  k += `<path d="M${g(TX + 0.02)} ${g(TOP - 0.135)} q${g(-0.02)} ${g(-0.03)} 0 ${g(-0.06)} q${g(0.02)} ${g(-0.03)} 0 ${g(-0.06)}" stroke="#fff" stroke-width=".3" opacity=".5" fill="none"/>`;
  tischUnter.push({ id: "rooibostee", de: "der Rooibostee", syl: "ROI-bos-tee", it: "il tè rooibos", itSyl: "TÈ ROI-bos", en: "rooibos tea", x: TISCH.x + Number(g(TX)), y: TISCH.y + Number(g(TOP)),
    kunst: flaeche(-Number(g(0.08)), -Number(g(0.2)), Number(g(0.16)), Number(g(0.22)), 0.6), tipp: "Rooibos (Rotbusch) wächst nur in Südafrika. Der Tee ist rot und hat kein Koffein." });
  /* Königsprotea in einer Vase */
  const PX = 0.02;
  k += `<path d="M${g(PX - 0.035)} ${g(TOP)} L${g(PX - 0.045)} ${g(TOP - 0.1)} Q${g(PX)} ${g(TOP - 0.13)} ${g(PX + 0.045)} ${g(TOP - 0.1)} L${g(PX + 0.035)} ${g(TOP)} Z" fill="${S.lg("vase", [[0, "#3a6f8f"], [1, "#24506b"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${g(PX)} ${g(TOP - 0.11)} Q${g(PX - 0.01)} ${g(TOP - 0.2)} ${g(PX)} ${g(TOP - 0.26)}" stroke="#4a6a2a" stroke-width="${g(0.012)}" fill="none"/>`;
  k += `<path d="M${g(PX)} ${g(TOP - 0.16)} q${g(-0.07)} ${g(-0.02)} ${g(-0.08)} ${g(-0.07)} q${g(0.05)} ${g(0.0)} ${g(0.08)} ${g(0.05)} Z" fill="#5a7a3a"/><path d="M${g(PX)} ${g(TOP - 0.19)} q${g(0.07)} ${g(-0.02)} ${g(0.08)} ${g(-0.06)} q${g(-0.05)} 0 ${g(-0.08)} ${g(0.04)} Z" fill="#5a7a3a"/>`;
  /* Blüte: Kranz aus rosa Hochblättern um die cremefarbene Mitte */
  const BY = TOP - 0.31;
  for (let i = 0; i < 11; i++) {
    const a = -Math.PI + i * Math.PI / 10, lx = Math.cos(a) * 0.075, ly = Math.sin(a) * 0.06;
    k += `<path d="M${g(PX)} ${g(BY + 0.03)} Q${g(PX + lx * 0.6 - 0.02)} ${g(BY + ly * 0.5)} ${g(PX + lx)} ${g(BY + ly - 0.02)} Q${g(PX + lx * 0.6 + 0.02)} ${g(BY + ly * 0.5)} ${g(PX)} ${g(BY + 0.03)} Z" fill="${i % 2 ? "#e57f95" : "#d0607a"}"/>`;
  }
  k += `<ellipse cx="${g(PX)}" cy="${g(BY + 0.005)}" rx="${g(0.042)}" ry="${g(0.035)}" fill="${S.rg("protea", [[0, "#f8efe0"], [0.7, "#ead6c0"], [1, "#c9a99a"]], 0.5, 0.4, 0.6)}"/>`;
  for (let i = 0; i < 8; i++) k += `<circle cx="${g(PX - 0.03 + rnd() * 0.06)}" cy="${g(BY - 0.02 + rnd() * 0.04)}" r=".25" fill="#b98c84" opacity=".7"/>`;
  tischUnter.push({ id: "protea", de: "die Protea", syl: "PRO-te-a", it: "la protea", itSyl: "pro-TE-a", en: "protea", x: TISCH.x + Number(g(PX)), y: TISCH.y + Number(g(TOP)),
    kunst: flaeche(-Number(g(0.09)), -Number(g(0.4)), Number(g(0.18)), Number(g(0.42)), 0.6), tipp: "Die Königsprotea ist die Nationalblume Südafrikas. Ihre Blüte ist so groß wie ein Teller." });
  /* Pinguin aus Draht und Glasperlen (Kunsthandwerk) */
  const QX = 0.22;
  const pg = (n) => r(n * s);
  let pin = `<path d="M${pg(QX - 0.035)} ${pg(TOP - 0.005)} Q${pg(QX - 0.05)} ${pg(TOP - 0.1)} ${pg(QX - 0.02)} ${pg(TOP - 0.15)} Q${pg(QX)} ${pg(TOP - 0.17)} ${pg(QX + 0.02)} ${pg(TOP - 0.15)} Q${pg(QX + 0.05)} ${pg(TOP - 0.1)} ${pg(QX + 0.035)} ${pg(TOP - 0.005)} Z" fill="#1d1f24"/>`;
  pin += `<path d="M${pg(QX - 0.02)} ${pg(TOP - 0.01)} Q${pg(QX - 0.032)} ${pg(TOP - 0.09)} ${pg(QX)} ${pg(TOP - 0.12)} Q${pg(QX + 0.032)} ${pg(TOP - 0.09)} ${pg(QX + 0.02)} ${pg(TOP - 0.01)} Z" fill="#f4f4f0"/>`;
  pin += `<path d="M${pg(QX - 0.028)} ${pg(TOP - 0.11)} Q${pg(QX)} ${pg(TOP - 0.098)} ${pg(QX + 0.028)} ${pg(TOP - 0.11)}" stroke="#1d1f24" stroke-width="${pg(0.006)}" fill="none"/>`;
  pin += `<path d="M${pg(QX + 0.018)} ${pg(TOP - 0.155)} l${pg(0.03)} ${pg(0.008)} l${pg(-0.03)} ${pg(0.008)} Z" fill="#2a2a2a"/><circle cx="${pg(QX + 0.006)}" cy="${pg(TOP - 0.152)}" r="${pg(0.005)}" fill="#f2a0b0"/>`;
  pin += `<path d="M${pg(QX - 0.025)} ${pg(TOP)} l${pg(-0.01)} ${pg(0.004)} l${pg(0.025)} 0 Z M${pg(QX + 0.01)} ${pg(TOP)} l${pg(0.025)} ${pg(0.004)} l${pg(-0.01)} ${pg(-0.004)} Z" fill="#f08a1e"/>`;
  for (let i = 0; i < 18; i++) pin += `<circle cx="${pg(QX - 0.03 + rnd() * 0.06)}" cy="${pg(TOP - 0.01 - rnd() * 0.14)}" r=".22" fill="#fff" opacity=".35"/>`;
  k += pin;
  tischUnter.push({ id: "pinguin", de: "der Pinguin", syl: "PIN-gu-in", it: "il pinguino", itSyl: "pin-GUI-no", en: "penguin", x: TISCH.x + Number(g(QX)), y: TISCH.y + Number(g(TOP)),
    kunst: flaeche(-Number(g(0.06)), -Number(g(0.2)), Number(g(0.12)), Number(g(0.21)), 0.6), tipp: "Ein Pinguin aus Draht und Glasperlen – echte Brillenpinguine leben am Boulders Beach bei Kapstadt." });
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolino", itSyl: "ta-vo-LI-no", en: "table", x: TISCH.x, y: TISCH.y, steht: true, kunst: k,
    tipp: "Im Café am Kai trinkt man Rooibostee mit Blick auf den Tafelberg.",
    zoom: { x: TISCH.x - 33, y: TISCH.y - 74, w: 66, h: 44 }, unter: tischUnter });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/kapstadt.js"));
console.log(aus);
