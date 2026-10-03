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
     nachmittag mit Südostwind: Der Himmel ist klar bis auf das
     „Tischtuch“ auf dem Berg, im Becken kräuselt sich das Wasser.
     Echte Richtungen von hier (gerechnet): Devil's Peak ≈ 165°,
     Tafelberg (Vorderkante) ≈ 178–207°, Kloof Nek ≈ 212°, Lion's Head
     ≈ 221°, Signal Hill ≈ 231° (am rechten Rand, nah, darum fast so hoch
     wie der Lion's Head). Darunter der „City Bowl“ (Innenstadt): links die
     Hochhäuser (Portside Tower 139 m), unter dem Tafelberg Gardens und
     Oranjezicht, am Hang zum Signal Hill das bunte Bo-Kaap (≈ 196°).
     Die Sonne steht im Nordwesten (Südhalbkugel, Nachmittag) hinter dem
     Betrachter rechts: Nordwände warm-golden, Schatten nach links hinten.
   - TAFELBERG: 1085 m, ein 3 km breites, flaches Plateau aus Tafelberg-
     Sandstein; die Nordwand mit waagerechten Bänken, kantigen Pfeilern,
     senkrechten Klüften und Rinnen, darunter Schuttkegel und Fynbos; in
     der Mitte die Platteklip-Schlucht; am Westende die Bergstation der
     Seilbahn (Rotair-Kabine, dreht sich). Der Südostwind schiebt Wolken
     über das Plateau, die wie ein Wasserfall über die Kante fallen und
     sich auflösen: das „Tischtuch“. Bei diesem Wind fliegen keine
     Gleitschirme am Signal Hill (ablandig); Rundflug-Hubschrauber starten
     an der Waterfront.
   - DEVIL'S PEAK 1000 m (spitz, links), LION'S HEAD 669 m: steiler
     Zuckerhut, die obersten ≈ 150 m nackter Sandstein, rechts der lange
     Rücken zum Signal Hill. Sage: Jan van Hunks rauchte mit dem Teufel
     um die Wette – ihr Rauch ist das Tischtuch.
   - CLOCK TOWER (Uhrturm): 1882 als Büro des Hafenkapitäns gebaut,
     achteckig, viktorianische Neugotik, rote Wände (Farbe nach alten
     Farbresten), weiße Spitzbogenfenster, Uhr aus Edinburgh, spitzes
     achteckiges Dach. Steht auf eigenem Kai an der Einfahrt zum Alfred
     Basin, daneben die Drehbrücke zum Pierhead. UNSICHER: Höhe (hier
     ≈ 20 m) und Dachform nach Ansichten.
   - HAFEN: Victoria- und Alfred-Becken (nach Königin Victoria und Prinz
     Alfred, Baubeginn 1860), viktorianische Hafengebäude mit Satteldach
     (Backstein, Putz), Fischkutter, Jachten. Kap-Pelzrobben (spitze
     Schnauze, lange helle Schnurrhaare, kleine Ohren, aufgestützte
     Vorderflossen, nach vorn gedrehte Hinterflossen) ruhen auf einer
     schwimmenden Plattform. Dominikanermöwe (55–65 cm, schieferschwarzer
     Rücken, gelber Schnabel mit rotem Fleck).
   - TYPISCHES vorn: Marimba-Straßenmusik am Kai, Cafétisch am Wasser,
     Rooibostee, Koeksister (geflochtenes Schmalzgebäck in Sirup),
     Königsprotea (Nationalblume, Blüte bis 30 cm) und ein Pinguin aus
     Draht und Glasperlen (Kunsthandwerk; echte Brillenpinguine leben am
     Boulders Beach).
   - Das Riesenrad „Cape Wheel“ steht seit 2023 am Breakwater Boulevard an
     der Granger Bay – in diesem Blick nach Süden liegt es rechts außerhalb
     (UNSICHER, nicht vermessen).
   Maßstab: Bild 66° breit (≈ 6 Einheiten je Grad), Augenhöhe y = 142
   (3,6 m über dem Wasser). Ferne Dinge: y = 142 − 347·(Höhe − 3,6)/Abstand.
   Vorne auf dem Kai: Einheiten je Meter = (y − 142) / 1,6.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "kapstadt", titel: "Kapstadt", emoji: "🐧", thema: "Länder", kuerzel: "kap", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1652);
{ const lg = S.lg, rg = S.rg, da = new Set();
  S.lg = (n, ...a) => { if (da.has(n)) return `url(#${S.id(n)})`; da.add(n); return lg(n, ...a); };
  S.rg = (n, ...a) => { if (da.has(n)) return `url(#${S.id(n)})`; da.add(n); return rg(n, ...a); }; }
const r = B.r;
const HOR = 142, F = 347, EYE = 3.6;
const hy = (Z, d) => HOR - F * (Z - EYE) / d;             // Höhe (m) in Abstand (m) → y
const wy = (d) => HOR + F * EYE / d;                      // Wasserlinie in Abstand d
const vorn = (y) => (y - HOR) / 1.6;                      // Einheiten je Meter auf dem Kai
const glatt = (pts) => {                                   // weiche Linie durch Punkte (Catmull-Rom)
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += `C${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)} ${r(p2[0] - (p3[0] - p1[0]) / 6)} ${r(p2[1] - (p3[1] - p1[1]) / 6)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d;
};
/* Schlagschatten am Boden: Sonne rechts hinten (Nordwest, ≈ 55° hoch) → kurze Schatten nach links hinten */
const schlag = (b, h, s, a = 0.3) => `<path d="M${r(-b / 2)} 0 L${r(b / 2)} 0 L${r(b / 2 - 0.7 * h * s)} ${r(-0.12 * h * s)} L${r(-b / 2 - 0.7 * h * s)} ${r(-0.12 * h * s)} Z" fill="#1d1810" opacity="${a}" filter="url(#bw_weich)"/>`;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="1.2"/></filter>`);
S.def(`<filter id="${S.id("fein")}" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation=".5"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".3"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation="1.2 .35"/></filter>`);

/* =====================================================================
   KULISSE — Himmel: Südostwind, tiefblau und klar
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 4}" fill="${S.lg("himmel", [[0, "#1d5aa8"], [0.5, "#4a8acb"], [0.82, "#9fc4e3"], [1, "#d9e6ec"]])}"/>`);

/* =====================================================================
   1 — DIE BERGE: Devil's Peak, Tafelberg, Lion's Head (eine Kammlinie,
       gemeinsamer Hang ohne Naht)
   ===================================================================== */
const KAMM = [
  [-4, 520, 5000], [6, 610, 5100], [14, 700, 5250], [20, 800, 5350], [25, 900, 5420], [28.5, 968, 5460], [31, 1000, 5470], [33, 988, 5490], [37, 945, 5530], [44, 905, 5600], [52, 880, 5700], [62, 850, 5820], [74, 812, 5980], [86, 786, 6100], [96, 778, 6150],
  [100, 830, 6180], [103, 905, 6200], [106, 990, 6230], [109, 1048, 6250], [114, 1058, 6250], [150, 1060, 6250], [175, 1064, 6250], [210, 1066, 6200], [250, 1064, 6150], [280, 1061, 6000], [285, 1040, 5960], [289, 980, 5900], [294, 880, 5800], [300, 700, 5560], [306, 520, 5250], [312, 330, 4950],
  [318, 345, 4880], [326, 400, 4800], [334, 455, 4720], [342, 520, 4660], [349, 582, 4610], [354, 622, 4585], [358, 650, 4570], [362, 665, 4560], [365, 669, 4560], [368, 664, 4560], [371, 640, 4560], [374, 596, 4540], [377, 540, 4480], [381, 470, 4300], [386, 405, 3950], [391, 362, 3600], [396, 350, 3300], [404, 352, 3000],
].map(([x, z, d]) => [x, r(hy(z, d))]);
const kamm = (x0, x1) => KAMM.filter(([x]) => x >= x0 && x <= x1);
const FUSS = 130, SATTEL = [96, hy(778, 6150)], NEK = [312, hy(330, 4950)];
const TOP = hy(1062, 6250);
/* gemeinsamer Hangverlauf (Weltkoordinaten), damit an den Grenzen keine Kante entsteht */
const HANG = S.lg("hang", [[0, "#9a9474"], [0.35, "#7f8460"], [1, "#56653f"]], 0, 80, 0, FUSS, ' gradientUnits="userSpaceOnUse"');
const fynbos = (x0, x1, y0, y1, n, op = 0.5) => { let g = ""; for (let i = 0; i < n; i++) { const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0); g += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.8 + rnd() * 1.4)}" ry="${r(0.4 + rnd() * 0.5)}" fill="${["#4f5a3a", "#99956f", "#6b7350", "#3f4a30", "#8a7a52"][i % 5]}" opacity="${op}"/>`; } return g; };
const wald = (x0, x1, y0, y1, n) => { let g = ""; for (let i = 0; i < n; i++) g += `<circle cx="${r(x0 + rnd() * (x1 - x0))}" cy="${r(y0 + rnd() * (y1 - y0))}" r="${r(0.9 + rnd() * 1.2)}" fill="${["#34502c", "#47643a", "#2b4426"][i % 3]}" opacity=".9"/>`; return g; };
const rinne = (x0, y0, x1, y1, w) => `<path d="M${x0 - w} ${y0} Q${r((x0 + x1) / 2 - 1)} ${r((y0 + y1) / 2)} ${x1} ${y1} Q${r((x0 + x1) / 2 + 1)} ${r((y0 + y1) / 2)} ${x0 + w} ${y0} Z" fill="#3f4733" opacity=".28"/><path d="M${x0 + w * 0.8} ${y0 + 0.5} Q${r((x0 + x1) / 2 + 1.4)} ${r((y0 + y1) / 2)} ${x1 + 0.6} ${y1}" stroke="#cdbf94" stroke-width=".5" fill="none" opacity=".35"/>`;
const bergUnter = [];
{
  /* DER TAFELBERG — Lupe: Tischtuch, Seilbahn, Schlucht */
  let k = "";
  const um = `M84 ${FUSS} L${r(SATTEL[0])} ${r(SATTEL[1])} ${glatt(kamm(96, 312)).replace(/^M[\d. ]+/, "")} L318 ${FUSS} Z`;
  S.def(`<clipPath id="${S.id("tafel")}"><path d="${um}"/></clipPath>`);
  k += `<path d="${um}" fill="${HANG}"/>`;
  k += `<g clip-path="url(#${S.id("tafel")})">`;
  /* Nordwand: Höhe in der Mitte am größten, zu den Enden kleiner; Unterkante treppig je Pfeiler */
  const H = (x) => 9 + 12 * Math.sin(Math.max(0, Math.min(1, (x - 104) / 188)) * Math.PI);
  const pfeiler = [];
  for (let x = 102; x < 296;) { const w = 3 + Math.pow(rnd(), 1.6) * 15; pfeiler.push([x, Math.min(w, 296 - x)]); x += w; }
  let wand = `M102 ${r(TOP - 4)} L296 ${r(TOP - 4)}`;
  for (let i = pfeiler.length - 1; i >= 0; i--) { const [x, w] = pfeiler[i], yb = TOP + H(x + w / 2) + (rnd() - 0.5) * 3; wand += ` L${r(x + w)} ${r(yb - 0.6)} L${r(x + w * 0.55)} ${r(yb)} L${r(x)} ${r(yb + 0.4)}`; }
  k += `<path d="${wand} Z" fill="${S.lg("wand", [[0, "#d8c49a"], [0.4, "#c2ab84"], [1, "#9c8a6c"]], 0, TOP - 4, 0, TOP + 22, ' gradientUnits="userSpaceOnUse"')}"/>`;
  /* Pfeiler: rechte Seite im warmen Nachmittagslicht, linke Kluft dunkel; manche rostig */
  let licht = "", kluft = "", rost = "";
  for (const [x, w] of pfeiler) {
    const yb = TOP + H(x + w / 2);
    if (w > 4) licht += `M${r(x + w * 0.62)} ${r(TOP - 0.5)} L${r(x + w - 0.5)} ${r(TOP - 0.5)} L${r(x + w - 0.7)} ${r(yb - 2)} L${r(x + w * 0.66)} ${r(yb - 2.4)} Z`;
    kluft += `M${r(x)} ${r(TOP - 0.5)} L${r(x + 0.3)} ${r(yb)}`;
    if (rnd() < 0.3) rost += `M${r(x + w * 0.2)} ${r(TOP + H(x) * 0.3)} l${r(w * 0.5)} 0 l0 ${r(H(x) * 0.35)} l${r(-w * 0.5)} 0 Z`;
  }
  k += `<path d="${licht}" fill="#f2deb0" opacity=".45"/><path d="${rost}" fill="#a8582e" opacity=".22"/>`;
  k += `<path d="${kluft}" stroke="#4f4636" stroke-width=".45" opacity=".75"/>`;
  /* waagerechte Bänke: Fuge (Schatten unten) und Lichtkante darüber, durchgehend */
  let fu = "", li = "";
  for (const f of [0.2, 0.42, 0.63, 0.82]) {
    let a = "", b = "";
    for (let x = 102; x <= 296; x += 6) { const y = TOP + H(x) * f + Math.sin(x * 0.21 + f * 9) * 0.35; a += `${a ? " L" : "M"}${x} ${r(y)}`; b += `${b ? " L" : "M"}${x} ${r(y - 0.55)}`; }
    fu += a; li += b;
  }
  k += `<path d="${li}" stroke="#f4e3bb" stroke-width=".5" fill="none" opacity=".7"/><path d="${fu}" stroke="#5a4f3c" stroke-width=".7" fill="none" opacity=".75"/>`;
  /* Rinnen: dunkle V-Kerben in der Wand, darunter helle Schuttfächer */
  const PX = 205;
  for (const [x, tief, anteil] of [[128, 0.7, 0.6], [152, 0.6, 1], [176, 0.85, 0.75], [PX, 1, 1], [236, 0.65, 0.55], [258, 0.9, 1], [276, 0.55, 0.7]]) {
    const yb = TOP + H(x) * anteil + 1, w = x === PX ? 3.2 : 1 + tief * 1.2;
    k += `<path d="M${r(x - w)} ${r(TOP - 0.6)} L${r(x + w)} ${r(TOP - 0.6)} L${r(x + 0.4)} ${r(yb)} L${r(x - 0.4)} ${r(yb)} Z" fill="#433b2e" opacity="${tief}"/>`;
    k += `<path d="M${r(x + w)} ${r(TOP - 0.6)} L${r(x + 0.4)} ${r(yb)}" stroke="#f0dcae" stroke-width=".35" opacity=".7"/>`;
    k += `<path d="M${r(x - 0.4)} ${r(yb)} Q${r(x - 3 * tief)} ${r(yb + 5 * tief)} ${r(x - 4.5 * tief)} ${r(yb + 9 * tief)} Q${r(x)} ${r(yb + 10 * tief)} ${r(x + 4.5 * tief)} ${r(yb + 9 * tief)} Q${r(x + 3 * tief)} ${r(yb + 5 * tief)} ${r(x + 0.4)} ${r(yb)} Z" fill="${S.lg("schutt", [[0, "#cdbf9c", 0.7], [1, "#cdbf9c", 0]])}"/>`;
  }
  k += `<rect x="100" y="${r(TOP - 4)}" width="200" height="26" fill="${S.lg("wandtiefe", [[0, "#ffe2a8", 0.14], [0.5, "#fff", 0], [1, "#2f2a20", 0.18]])}"/>`;
  /* Hang unter der Wand: Fynbos, Schluchten, Wald am Fuß */
  k += fynbos(100, 316, TOP + 14, FUSS, 130, 0.55);
  for (const [x0, x1] of [[128, 122], [152, 147], [176, 171], [PX, 198], [236, 241], [258, 266]]) k += rinne(x0, TOP + H(x0) + 9, x1, FUSS - 4, 1.2);
  k += wald(96, 316, FUSS - 12, FUSS, 70);
  k += `</g>`;
  /* Lichtkante der Plateaukante */
  k += `<path d="${glatt(kamm(109, 284))}" stroke="#f6e7c4" stroke-width=".7" fill="none" opacity=".8"/>`;
  /* Seilbahn: Bergstation am Westende, Talstation an der Tafelberg Road, Kabine auf dem Seil */
  const OBEN = [279, TOP + 0.4], UNTEN = [268, hy(363, 5700)], CS = [(OBEN[0] + UNTEN[0]) / 2 - 0.5, (OBEN[1] + UNTEN[1]) / 2 + 1.6];
  k += `<rect x="${r(OBEN[0] - 3)}" y="${r(OBEN[1] - 2.6)}" width="6" height="2.8" fill="#dcd8ce"/><rect x="${r(OBEN[0] - 3)}" y="${r(OBEN[1] - 2.6)}" width="6" height=".6" fill="#6f6a60"/>`;
  k += `<rect x="${r(UNTEN[0] - 2.4)}" y="${r(UNTEN[1] - 2)}" width="4.8" height="2.4" fill="#e6e2d8"/><rect x="${r(UNTEN[0] - 2.4)}" y="${r(UNTEN[1] - 2.4)}" width="4.8" height=".6" fill="#8a3a2e"/>`;
  const S0 = [OBEN[0] - 1, OBEN[1] - 1], S1 = [UNTEN[0], UNTEN[1] - 1.6];
  k += `<path d="M${r(S0[0])} ${r(S0[1])} Q${r(CS[0])} ${r(CS[1])} ${r(S1[0])} ${r(S1[1])}" stroke="#2c2c2c" stroke-width=".22" fill="none"/>`;
  const KAB = [0.25 * S0[0] + 0.5 * CS[0] + 0.25 * S1[0], 0.25 * S0[1] + 0.5 * CS[1] + 0.25 * S1[1]];
  k += `<line x1="${r(KAB[0])}" y1="${r(KAB[1])}" x2="${r(KAB[0])}" y2="${r(KAB[1] + 1.1)}" stroke="#2c2c2c" stroke-width=".25"/><ellipse cx="${r(KAB[0])}" cy="${r(KAB[1] + 1.9)}" rx="1.3" ry="1" fill="#eeece6"/><rect x="${r(KAB[0] - 1.25)}" y="${r(KAB[1] + 1.6)}" width="2.5" height=".55" fill="#c23a2b"/><rect x="${r(KAB[0] - 0.9)}" y="${r(KAB[1] + 1.2)}" width="1.8" height=".35" fill="#5a6a78"/>`;
  /* DAS TISCHTUCH: Wolkendecke auf dem Plateau (nur so breit wie das Plateau, an den Enden dünn),
     rollt dick über die Vorderkante und fällt als Wasserfall in Zungen hinab, die sich auflösen */
  const T0 = 106, T1 = 288;
  const dick = (x) => Math.sin(Math.max(0, Math.min(1, (x - T0) / (T1 - T0))) * Math.PI);
  let decke = `M${T0} ${r(TOP + 0.5)}`;
  for (let x = T0; x <= T1; x += 3 + rnd() * 4) decke += ` Q${r(x - 2)} ${r(TOP - 2.5 - 8 * Math.pow(dick(x), 0.6) - 2.2 * rnd())} ${r(x)} ${r(TOP - 1.5 - 6.5 * Math.pow(dick(x), 0.6) - Math.sin(x * 0.11) * 1.2)}`;
  decke += ` L${T1} ${r(TOP + 0.5)} Z`;
  let rolle = `M${T0 + 4} ${r(TOP)}`;
  for (let x = T0 + 4; x <= T1 - 4; x += 5) rolle += ` L${x} ${r(TOP + 0.5 + (2.5 + 7.5 * Math.pow(dick(x), 0.8)) * (0.85 + 0.3 * Math.sin(x * 0.7)))}`;
  rolle += ` L${T1 - 4} ${r(TOP)} Z`;
  let tuch = `<g filter="url(#${S.id("fein")})"><path d="${decke}" fill="${S.lg("decke", [[0, "#ffffff"], [0.7, "#f4f6f8"], [1, "#d9e1ea"]])}"/>`;
  tuch += `<path d="${rolle}" fill="${S.lg("rolle", [[0, "#fbfcfd"], [0.6, "#e9eef3"], [1, "#c9d4df"]])}"/></g>`;
  const ZUNGE = S.lg("zunge", [[0, "#f6f8fa", 0.95], [0.45, "#eef2f6", 0.75], [1, "#ffffff", 0]]);
  let zu = "";
  for (let x = T0 + 8; x < T1 - 6; x += 4.6 + rnd() * 3) {
    const dk = dick(x), l = (12 + rnd() * 9) * Math.pow(dk, 0.6), w = 1.8 + rnd() * 2, y0 = TOP + 3 + 7 * dk;
    if (l < 3) continue;
    zu += `<path d="M${r(x - w)} ${r(y0)} Q${r(x - w * 0.9)} ${r(y0 + l * 0.6)} ${r(x - 0.2)} ${r(y0 + l)} Q${r(x + w * 0.7)} ${r(y0 + l * 0.55)} ${r(x + w)} ${r(y0)} Z" fill="${ZUNGE}"/>`;
  }
  tuch += `<g filter="url(#${S.id("wolke")})">${zu}</g>`;
  tuch += `<path d="${rolle.replace(/L(\d+) ([\d.]+)/g, (m, x, y) => `L${x} ${r(Number(y) - 1.2)}`)}" fill="none" stroke="#b9c6d4" stroke-width=".8" opacity=".45" filter="url(#${S.id("fein")})"/>`;
  /* dünne Fahnen über dem Sattel und am Kloof Nek */
  tuch += `<g filter="url(#${S.id("wolke")})" opacity=".55"><ellipse cx="100" cy="${r(SATTEL[1] - 2)}" rx="7" ry="2"/><ellipse cx="294" cy="${r(TOP + 6)}" rx="6" ry="2.4"/></g>`.replace(/<ellipse /g, '<ellipse fill="#ffffff" ');
  k += tuch;
  bergUnter.push(
    { id: "tischtuch", de: "das Tischtuch", syl: "TISCH-tuch", it: "la tovaglia", itSyl: "to-VA-glia", en: "tablecloth", x: 197, y: TOP + 8,
      kunst: flaeche(-88, -16, 176, 18), tipp: "Bläst der Südostwind, legt sich eine Wolke wie ein Tischtuch auf den Tafelberg und fällt über die Kante." },
    { id: "seilbahn", de: "die Seilbahn", syl: "SEIL-bahn", it: "la funivia", itSyl: "fu-ni-VI-a", en: "cable car", x: KAB[0], y: KAB[1] + 6,
      kunst: flaeche(-7, -11, 14, 14, 0.6), tipp: "Die Kabine der Seilbahn dreht sich während der Fahrt einmal ganz um sich selbst." },
    { id: "schlucht", de: "die Schlucht", syl: "SCHLUCHT", it: "la gola", itSyl: "GO-la", en: "gorge", x: PX, y: TOP + 30,
      kunst: flaeche(-6, -20, 12, 22), tipp: "Durch die Platteklip-Schlucht führt der bekannteste Wanderweg auf den Tafelberg." });
  S.teil({ id: "tafelberg", de: "der Tafelberg", syl: "TA-fel-berg", it: "la Montagna della Tavola", itSyl: "mon-TA-gna DEL-la TA-vo-la", en: "Table Mountain",
    x: 0, y: 0, kunst: k, tipp: "Der Tafelberg ist oben flach wie ein Tisch: 1085 Meter hoch und 3 Kilometer breit.",
    zoom: { x: 160, y: r(TOP - 16), w: 132, h: 86 }, unter: bergUnter });
}
{
  /* DEVIL'S PEAK: spitzer Gipfel; Ostflanke (links) im Schatten, Nordwestflanke (rechts) im Licht */
  let k = "";
  const um = `${glatt(kamm(-4, 96))} L84 ${FUSS} L-4 ${FUSS} Z`;
  S.def(`<clipPath id="${S.id("devil")}"><path d="${um}"/></clipPath>`);
  k += `<path d="${um}" fill="${HANG}"/>`;
  k += `<g clip-path="url(#${S.id("devil")})">`;
  k += `<path d="M-4 70 L31 78.5 L20 ${FUSS} L-4 ${FUSS} Z" fill="#3a4230" opacity=".22"/>`;
  k += `<path d="M31 78.5 L50 90 L86 98 L84 ${FUSS} L34 ${FUSS} Z" fill="#ffd89a" opacity=".1"/>`;
  /* Felsband am Gipfel (grauer Sandstein), Fläche oberhalb einer ausgefransten Grenze */
  let gz = `M20 90`;
  for (let x = 20; x <= 44; x += 2) gz += ` L${x} ${r(88.6 - Math.sin((x - 20) / 24 * Math.PI) * 3.4 + Math.sin(x * 1.9) * 0.8 + rnd() * 1)}`;
  k += `<path d="${gz} L44 70 L20 70 Z" fill="${S.lg("devilfels", [[0, "#6f695c"], [0.5, "#9a907a"], [1, "#c2b79c"]], 20, 0, 44, 0, ' gradientUnits="userSpaceOnUse"')}" opacity=".9"/>`;
  k += `<path d="M24 85.6 Q31 84.4 38 85.8 M26.4 82.6 Q31 81.6 35.6 82.6" stroke="#5f594c" stroke-width=".3" fill="none" opacity=".7"/>`;
  for (const [x0, y0, x1, y1] of [[31, 90, 26, 124], [31, 90, 42, 122], [48, 96, 58, 124], [16, 98, 6, 124], [62, 98, 74, 124]]) k += rinne(x0, y0, x1, y1, 1.1);
  k += fynbos(-4, 92, 92, FUSS, 70, 0.5);
  k += wald(-4, 92, FUSS - 14, FUSS, 40);
  k += `</g>`;
  k += `<path d="${glatt(kamm(28, 96))}" stroke="#ead9b0" stroke-width=".6" fill="none" opacity=".75"/>`;
  S.teil({ id: "devils_peak", de: "der Devil's Peak", syl: "DE-vils-peak", it: "il Devil's Peak", itSyl: "DE-vils PIK", en: "Devil's Peak", x: 0, y: 0, kunst: k,
    tipp: "Devil's Peak heißt „Teufelsspitze“. Die Sage erzählt: Jan van Hunks rauchte hier mit dem Teufel um die Wette – ihr Rauch ist das Tischtuch." });
}
{
  /* LION'S HEAD: steiler Zuckerhut, oben nackter Sandstein mit Bänken und Rissen; rechts der Rücken zum Signal Hill */
  let k = "";
  const um = `M318 ${FUSS} L${r(NEK[0])} ${r(NEK[1])} ${glatt(kamm(312, 404)).replace(/^M[\d. ]+/, "")} L404 ${FUSS} Z`;
  S.def(`<clipPath id="${S.id("loewe")}"><path d="${um}"/></clipPath>`);
  k += `<path d="${um}" fill="${HANG}"/>`;
  k += `<g clip-path="url(#${S.id("loewe")})">`;
  k += `<path d="M312 118 L365 91 L340 ${FUSS} L312 ${FUSS} Z" fill="#3a4230" opacity=".16"/>`;
  k += `<path d="M365 91 L404 100 L404 ${FUSS} L372 ${FUSS} Z" fill="#ffd89a" opacity=".1"/>`;
  /* Felskopf: die obersten ≈ 150 m nackter Sandstein – Fläche oberhalb einer ausgefransten Grenze,
     links Schatten, rechts Licht, waagerechte Bänke, senkrechte Risse */
  let grenze = `M346 112`;
  for (let x = 346; x <= 384; x += 2) grenze += ` L${x} ${r(106.4 - Math.sin((x - 346) / 38 * Math.PI) * 3.2 + Math.sin(x * 1.7) * 1 + rnd() * 1.2)}`;
  k += `<path d="${grenze} L384 80 L346 80 Z" fill="${S.lg("loewekopf", [[0, "#6c665a"], [0.45, "#958c78"], [1, "#c9bea1"]], 346, 0, 384, 0, ' gradientUnits="userSpaceOnUse"')}"/>`;
  k += `<path d="M352 103.4 Q365 101.8 379 103.8 M355.6 99.6 Q365 98.2 375 99.8 M358.4 96 Q365 95 371.6 96.2 M350 106.2 Q365 104.6 382 106.6" stroke="#5a5448" stroke-width=".32" fill="none" opacity=".7"/>`;
  k += `<path d="M362 93 l-.5 4 l.4 3.6 M368.4 92.8 l.4 3.6 l-.4 3.4 M373.6 97.6 l.6 4.2 M357.6 98.6 l-.4 4.4 M376.6 102 l.4 3" stroke="#4f4a40" stroke-width=".3" fill="none" opacity=".6"/>`;
  k += `<path d="M367 91.2 Q372 93.6 375.6 99 Q378.6 103.6 380.6 107" stroke="#f0e2bf" stroke-width=".7" fill="none" opacity=".75"/>`;
  k += fynbos(312, 404, 104, FUSS, 60, 0.5);
  k += `<path d="M326 120 Q344 112 360 110.6 Q374 110 386 106" stroke="#d1c39c" stroke-width=".35" fill="none" stroke-dasharray="1 .9" opacity=".45"/>`;
  for (const [x0, y0, x1, y1] of [[350, 108, 340, 126], [370, 108, 374, 126], [388, 108, 398, 124]]) k += rinne(x0, y0, x1, y1, 1);
  k += wald(312, 404, FUSS - 10, FUSS, 30);
  k += `</g>`;
  k += `<path d="${glatt(kamm(362, 404))}" stroke="#ead9b0" stroke-width=".6" fill="none" opacity=".7"/>`;
  S.teil({ id: "lions_head", de: "der Lion's Head", syl: "LI-ons-head", it: "il Lion's Head", itSyl: "LA-ions HED", en: "Lion's Head", x: 0, y: 0, kunst: k,
    tipp: "Lion's Head heißt „Löwenkopf“: Zusammen mit dem Signal Hill sieht er aus wie ein liegender Löwe." });
}
{
  /* Rundflug-Hubschrauber über dem Hafen (starten an der Waterfront) */
  const X = 252, Y = 52, s = 1.05;
  const g = (n) => r(n * s);
  let k = `<path d="M${g(-5)} ${g(-1.2)} Q${g(-5.4)} ${g(-4.2)} ${g(-1.8)} ${g(-4.4)} L${g(2.6)} ${g(-4.4)} Q${g(4.6)} ${g(-4)} ${g(4.8)} ${g(-1.6)} Q${g(4.4)} ${g(0.2)} ${g(1.6)} ${g(0.3)} L${g(-3)} ${g(0.3)} Q${g(-4.6)} ${g(0)} ${g(-5)} ${g(-1.2)} Z" fill="${S.lg("heli", [[0, "#e04a3a"], [1, "#a8291e"]])}"/>`;
  k += `<path d="M${g(0.8)} ${g(-3.9)} L${g(3.6)} ${g(-3.9)} Q${g(4.5)} ${g(-2.4)} ${g(4.1)} ${g(-1.4)} L${g(0.9)} ${g(-1.4)} Z" fill="#2f4555"/><path d="M${g(1.2)} ${g(-3.6)} L${g(2.4)} ${g(-3.6)} L${g(1.4)} ${g(-1.8)} Z" fill="#9fc0d6" opacity=".7"/>`;
  k += `<path d="M${g(-4.6)} ${g(-2.2)} L${g(-12)} ${g(-2.8)} L${g(-12.4)} ${g(-1.8)} L${g(-4.6)} ${g(-0.8)} Z" fill="#c23a2b"/><path d="M${g(-12.4)} ${g(-4.6)} L${g(-11.2)} ${g(-4.6)} L${g(-11.6)} ${g(-1.8)} L${g(-12.6)} ${g(-1.8)} Z" fill="#c23a2b"/>`;
  k += `<rect x="${g(-0.6)}" y="${g(-5.4)}" width="${g(1.2)}" height="${g(1)}" fill="#3a3d42"/><path d="M${g(-9)} ${g(-5.6)} L${g(9)} ${g(-5.2)}" stroke="#3a3d42" stroke-width="${g(0.3)}" opacity=".7"/>`;
  k += `<ellipse cx="0" cy="${g(-5.5)}" rx="${g(10)}" ry="${g(0.7)}" fill="#c9d4de" opacity=".35"/>`;
  k += `<path d="M${g(-3.6)} ${g(1.6)} L${g(3.4)} ${g(1.6)} M${g(-2.4)} ${g(0.3)} L${g(-2.8)} ${g(1.6)} M${g(2)} ${g(0.3)} L${g(2.4)} ${g(1.6)}" stroke="#2c2c2c" stroke-width="${g(0.3)}"/>`;
  k += `<rect x="${g(-3)}" y="${g(-1.4)}" width="${g(3.4)}" height="${g(0.5)}" fill="#fff" opacity=".85"/>`;
  S.teil({ id: "hubschrauber", de: "der Hubschrauber", syl: "HUB-schrau-ber", it: "l'elicottero", itSyl: "e-li-COT-te-ro", en: "helicopter", x: X, y: Y, kunst: k + flaeche(-13, -7, 20, 10),
    tipp: "Von der Waterfront starten Hubschrauber zu Rundflügen über den Tafelberg und das Kap." });
}

/* =====================================================================
   2 — DIE INNENSTADT (City Bowl) am Fuß der Berge: Hochhäuser links (im
       Dunst), Wohnviertel unter dem Tafelberg, das bunte Bo-Kaap
   ===================================================================== */
{
  let k = "";
  /* Hang mit Gärten (gemeinsame Fläche) */
  k += `<path d="M-2 ${FUSS - 6} Q60 ${FUSS - 5} 100 ${FUSS - 3} Q200 ${FUSS - 2} 300 ${FUSS - 1} Q330 ${FUSS - 7} 360 ${FUSS - 6} Q390 ${FUSS - 8} 402 ${FUSS - 10} L402 ${HOR + 1} L-2 ${HOR + 1} Z" fill="${S.lg("stadthang", [[0, "#7f8a62"], [1, "#9b9c80"]])}"/>`;
  /* Wohnviertel: Häuser in Reihen am Hang (Dächer rot und grau), Bäume dazwischen */
  const viertel = (x0, x1, y0, y1, n, farben, bunt) => {
    let g = "";
    for (let i = 0; i < n; i++) {
      const t = rnd(), y = y0 + t * (y1 - y0), x = x0 + rnd() * (x1 - x0), w = 1.4 + t * 1.6 + rnd() * 0.8, h = w * (bunt ? 0.75 : 0.62);
      g += `<rect x="${r(x)}" y="${r(y - h)}" width="${r(w)}" height="${r(h)}" fill="${farben[i % farben.length]}"/>`;
      if (bunt) g += `<rect x="${r(x - 0.1)}" y="${r(y - h - 0.25)}" width="${r(w + 0.2)}" height=".35" fill="#f7f4ec"/>`;
      else g += `<path d="M${r(x - 0.2)} ${r(y - h)} L${r(x + w / 2)} ${r(y - h - w * 0.28)} L${r(x + w + 0.2)} ${r(y - h)} Z" fill="${rnd() < 0.55 ? "#9a5440" : "#6f7276"}"/>`;
      g += `<rect x="${r(x)}" y="${r(y - h)}" width="${r(w * 0.25)}" height="${r(h)}" fill="#000" opacity=".1"/>`;
    }
    return g;
  };
  const weiss = ["#f3efe6", "#e9e0cc", "#f6f3ec", "#ddd2bd", "#ece6d8"];
  let h = viertel(96, 232, FUSS - 4, HOR - 4, 140, weiss) + viertel(292, 400, FUSS - 6, HOR - 3, 80, weiss);
  for (let i = 0; i < 90; i++) { const x = 80 + rnd() * 320, y = FUSS - 4 + rnd() * (HOR - FUSS); h += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.8 + rnd() * 1.1)}" fill="${rnd() < 0.5 ? "#4f6a3a" : "#3f5a30"}" opacity=".85"/>`; }
  /* Bo-Kaap: knallbunte Flachdachhäuser am Hang zum Signal Hill, Minarett der Auwal-Moschee */
  const bo = ["#e8608e", "#a3cf58", "#4fc0c2", "#f2c43a", "#5a8ad8", "#ef8f3c", "#b88ad6", "#ec6f60", "#f4efe6"];
  let bk = "";
  for (let row = 0; row < 5; row++) {
    let x = 236 + row * 2.2 + rnd() * 2;
    while (x < 288 - row) {
      const y = 131.2 + row * 2 - (x - 236) * 0.07 + (rnd() - 0.5) * 0.6, w = 2 + rnd() * 1.4, hh = 1.6 + rnd() * 0.5;
      const f = rnd() < 0.18 ? bo[8] : bo[Math.floor(rnd() * 8)];
      bk += `<rect x="${r(x)}" y="${r(y - hh)}" width="${r(w)}" height="${r(hh)}" fill="${f}"/><rect x="${r(x - 0.1)}" y="${r(y - hh - 0.25)}" width="${r(w + 0.2)}" height=".3" fill="#fbf8f0" opacity=".9"/><rect x="${r(x + w * 0.3)}" y="${r(y - hh + 0.6)}" width=".5" height=".7" fill="#2f3a44" opacity=".6"/>`;
      x += w + 0.25 + (rnd() < 0.2 ? 1.6 : 0);
    }
  }
  for (let i = 0; i < 10; i++) bk += `<circle cx="${r(238 + rnd() * 48)}" cy="${r(128 + rnd() * 9)}" r="${r(0.8 + rnd() * 0.6)}" fill="#4f6a3a" opacity=".85"/>`;
  bk += `<rect x="262" y="122.6" width="1" height="5.4" fill="#f3efe6"/><path d="M261.8 122.6 L262.5 120.8 L263.2 122.6 Z" fill="#6aa86a"/>`;
  h += bk;
  k += `<g filter="url(#${S.id("dunst")})">${h}</g>`;
  /* Hochhäuser der Innenstadt (links): Luftperspektive – hell, bläulich, kontrastarm */
  const tuerme = [[4, 7, 12], [13, 9, 18], [24, 6, 22], [31, 10, 15], [53, 9, 20], [64, 6, 24], [71, 11, 13], [84, 8, 17], [94, 6, 11], [140, 7, 9], [150, 9, 7]];
  for (const [x, w, hh] of tuerme) {
    const y0 = HOR - 3 - hh;
    k += `<rect x="${x}" y="${r(y0)}" width="${w}" height="${r(hh + 3)}" fill="${S.lg("turmglas", [[0, "#cfd9df"], [1, "#b4c3cc"]], 0, 0, 1, 0)}"/>`;
    k += `<rect x="${x}" y="${r(y0)}" width="${r(w * 0.35)}" height="${r(hh + 3)}" fill="#8a9aa6" opacity=".25"/>`;
    for (let y = y0 + 1.6; y < HOR - 2; y += 1.8) k += `<rect x="${x + 0.5}" y="${r(y)}" width="${w - 1}" height=".3" fill="#7e909c" opacity=".25"/>`;
  }
  /* Portside Tower (139 m, höchstes Haus der Stadt) mit Krone */
  k += `<rect x="43" y="${r(hy(139, 1500))}" width="7" height="${r(HOR - 3 - hy(139, 1500))}" fill="#c3cfd7"/><path d="M43 ${r(hy(139, 1500))} L46.5 ${r(hy(139, 1500) - 3.6)} L50 ${r(hy(139, 1500))} Z" fill="#aebdc7"/>`;
  k += `<rect x="-2" y="${FUSS - 22}" width="160" height="${HOR - FUSS + 22}" fill="${S.lg("stadtdunst", [[0, "#dce8ef", 0], [0.6, "#dce8ef", 0.22], [1, "#e6eef2", 0.3]])}"/>`;
  S.teil({ id: "innenstadt", de: "die Innenstadt", syl: "IN-nen-stadt", it: "il centro", itSyl: "CEN-tro", en: "city centre", x: 0, y: 0, kunst: k,
    tipp: "Die Innenstadt liegt wie in einer Schüssel zwischen den Bergen – man nennt sie „City Bowl“. Die bunten Häuser gehören zum Bo-Kaap." });
}

/* =====================================================================
   3 — DIE HAFENGEBÄUDE (viktorianisch, Satteldach) — das Lagerhaus;
       4 — DER UHRTURM auf seinem eigenen Kai, daneben die Drehbrücke
   ===================================================================== */
const D_HALLE = 260, Y_HALLE = HOR + F * (EYE - 1.5) / D_HALLE;   // Kaioberkante der fernen Hallen
{
  let k = "";
  const Y0 = Y_HALLE, s = F / D_HALLE;   // ≈ 1,33 Einheiten je Meter
  k += `<rect x="0" y="${r(Y0 - 0.6)}" width="400" height="${r(wy(D_HALLE) - Y0 + 0.6)}" fill="#8f8a80"/><rect x="0" y="${r(Y0 - 0.6)}" width="400" height=".6" fill="#c9c4b8"/>`;
  /* links: langes Hafengebäude (Putz, Satteldach) */
  k += `<rect x="0" y="${r(Y0 - 9)}" width="62" height="9" fill="#e2d8c4"/><path d="M-1 ${r(Y0 - 9)} L62 ${r(Y0 - 9)} L58 ${r(Y0 - 12)} L3 ${r(Y0 - 12)} Z" fill="#7a5a4a"/>`;
  for (let x = 2; x < 60; x += 3) k += `<rect x="${x}" y="${r(Y0 - 7.4)}" width="1.3" height="2" fill="#5c6670" opacity=".55"/><rect x="${x}" y="${r(Y0 - 3.8)}" width="1.3" height="2" fill="#5c6670" opacity=".55"/>`;
  /* Nelson Mandela Gateway (Fähre nach Robben Island): flacher Glasbau */
  k += `<rect x="134" y="${r(Y0 - 7)}" width="34" height="6.4" fill="${S.lg("gateway", [[0, "#b3cbd8"], [1, "#7896a6"]])}"/><rect x="133" y="${r(Y0 - 8)}" width="36" height="1.4" fill="#e8e6e0"/>`;
  /* rechts: Reihe viktorianischer Hafenbauten – Backstein mit weißen Bändern, Putzbauten, Giebel, Satteldächer */
  const bau = (x, w, hh, wand, dach, giebel) => {
    let g = `<rect x="${x}" y="${r(Y0 - hh)}" width="${w}" height="${hh}" fill="${wand}"/>`;
    g += giebel ? `<path d="M${x} ${r(Y0 - hh)} L${r(x + w / 2)} ${r(Y0 - hh - w * 0.32)} L${x + w} ${r(Y0 - hh)} Z" fill="${wand}"/><path d="M${x - 0.4} ${r(Y0 - hh)} L${r(x + w / 2)} ${r(Y0 - hh - w * 0.32 - 0.6)} L${x + w + 0.4} ${r(Y0 - hh)}" stroke="#f3eee4" stroke-width=".5" fill="none"/>`
      : `<path d="M${x - 0.6} ${r(Y0 - hh)} L${x + w + 0.6} ${r(Y0 - hh)} L${x + w - 2} ${r(Y0 - hh - 3)} L${x + 2} ${r(Y0 - hh - 3)} Z" fill="${dach}"/>`;
    for (let fx = x + 1.2; fx < x + w - 1.4; fx += 2.4) for (let fy = Y0 - hh + 1.6; fy < Y0 - 1.8; fy += 2.8) g += `<path d="M${r(fx)} ${r(fy + 1.6)} L${r(fx)} ${r(fy + 0.5)} Q${r(fx + 0.55)} ${r(fy - 0.1)} ${r(fx + 1.1)} ${r(fy + 0.5)} L${r(fx + 1.1)} ${r(fy + 1.6)} Z" fill="#3e4a55" opacity=".75"/>`;
    for (let fy = Y0 - hh + 4.4; fy < Y0 - 1; fy += 2.8) g += `<rect x="${x}" y="${r(fy)}" width="${w}" height=".35" fill="#f1ebe0" opacity=".7"/>`;
    g += `<rect x="${x}" y="${r(Y0 - hh)}" width="${r(w * 0.1)}" height="${hh}" fill="#000" opacity=".1"/>`;
    return g;
  };
  k += bau(184, 22, 9, "#e9e1cf", "#6f5a4a", 1) + bau(208, 26, 11, "#d8cbb2", "#5b6670", 0) + bau(236, 18, 10, "#efe9dc", "#7b4a3a", 1);
  k += bau(318, 30, 10, "#f0ebe0", "#6c4a3c", 0) + bau(350, 22, 12, "#c5684c", "#4a3a32", 1) + bau(374, 28, 9, "#e6dfd0", "#5b6670", 0);
  /* Café-Schirme und Spaziergänger auf dem Kai rechts */
  for (const x of [190, 202, 214, 226, 324, 336]) k += `<path d="M${x - 3.2} ${r(Y0 - 3.4)} Q${x} ${r(Y0 - 5)} ${x + 3.2} ${r(Y0 - 3.4)} Z" fill="#f6f4ee"/><line x1="${x}" y1="${r(Y0 - 3.4)}" x2="${x}" y2="${r(Y0 - 0.4)}" stroke="#8a8478" stroke-width=".25"/>`;
  const leute = ["#c0392b", "#2f6fb6", "#f2c62f", "#ffffff", "#2a2a2a", "#3c8f5a", "#e58fa1", "#7b4a9a"];
  for (let i = 0; i < 22; i++) { const x = 182 + rnd() * 200, hh = 1.7 * s; k += `<rect x="${r(x)}" y="${r(Y0 - hh * 0.9)}" width=".55" height="${r(hh * 0.55)}" fill="${leute[i % 8]}"/><circle cx="${r(x + 0.27)}" cy="${r(Y0 - hh * 0.98)}" r=".28" fill="#8a5a3c"/><rect x="${r(x + 0.05)}" y="${r(Y0 - hh * 0.38)}" width=".45" height="${r(hh * 0.38)}" fill="#3a3f48"/>`; }
  S.hinten(k);
}
{
  /* DAS LAGERHAUS: viktorianisches Backstein-Lagerhaus mit Ladetüren und Kranbalken */
  const Y0 = Y_HALLE, x = 262, w = 34, hh = 15;
  let k = `<rect x="${x}" y="${r(Y0 - hh)}" width="${w}" height="${hh}" fill="${S.lg("backstein", [[0, "#9a4a32"], [0.6, "#b4583c"], [1, "#c86a4a"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${x} ${r(Y0 - hh)} L${x + w / 2} ${r(Y0 - hh - 7)} L${x + w} ${r(Y0 - hh)} Z" fill="#a85238"/><path d="M${x - 0.6} ${r(Y0 - hh)} L${x + w / 2} ${r(Y0 - hh - 7.5)} L${x + w + 0.6} ${r(Y0 - hh)}" stroke="#f1ebe0" stroke-width=".6" fill="none"/>`;
  for (let fy = Y0 - hh + 3.6; fy < Y0; fy += 3.6) k += `<rect x="${x}" y="${r(fy)}" width="${w}" height=".45" fill="#efe6d6" opacity=".85"/>`;
  for (const fx of [x + 2, x + 6, x + 24, x + 28]) for (let fy = Y0 - hh + 1; fy < Y0 - 1; fy += 3.6) k += `<path d="M${fx} ${r(fy + 2.2)} L${fx} ${r(fy + 0.8)} Q${fx + 0.8} ${r(fy)} ${fx + 1.6} ${r(fy + 0.8)} L${fx + 1.6} ${r(fy + 2.2)} Z" fill="#2f3a44"/>`;
  /* Ladetüren übereinander in der Mitte, Kranbalken im Giebel */
  for (let fy = Y0 - hh + 0.9; fy < Y0 - 1; fy += 3.6) k += `<rect x="${x + w / 2 - 2}" y="${r(fy)}" width="4" height="2.5" fill="#3f5a3a" stroke="#efe6d6" stroke-width=".25"/>`;
  k += `<path d="M${x + w / 2} ${r(Y0 - hh - 2)} l0 -1.2 l4 0" stroke="#3a3530" stroke-width=".5" fill="none"/><line x1="${x + w / 2 + 3.6}" y1="${r(Y0 - hh - 3.2)}" x2="${x + w / 2 + 3.6}" y2="${r(Y0 - hh + 0.8)}" stroke="#3a3530" stroke-width=".18"/>`;
  k += `<rect x="${x}" y="${r(Y0 - hh)}" width="3" height="${hh}" fill="#000" opacity=".12"/>`;
  S.teil({ id: "lagerhaus", de: "das Lagerhaus", syl: "LA-ger-haus", it: "il magazzino", itSyl: "ma-gaz-ZI-no", en: "warehouse", x: 0, y: 0, kunst: k,
    tipp: "In den alten Lagerhäusern aus Backstein sind heute Läden, Restaurants und Hotels." });
}
const TURM = { x: 118, d: 130 };
TURM.y = HOR + F * (EYE - 1.6) / TURM.d;   // Kaioberkante am Turm (1,6 m über dem Wasser)
const turmUnter = [];
{
  /* eigener Kai mit Kaimauer (Granitquader) bis zur Wasserlinie, Fender; links die Drehbrücke */
  const Wl = wy(TURM.d), s = F / TURM.d;
  let q = `<rect x="70" y="${r(TURM.y)}" width="104" height="${r(Wl - TURM.y)}" fill="${S.lg("kaimauer", [[0, "#b9b4aa"], [1, "#8c877d"]])}"/>`;
  for (let x = 72; x < 174; x += 4.2) q += `<line x1="${x}" y1="${r(TURM.y)}" x2="${x}" y2="${r(Wl)}" stroke="#77726a" stroke-width=".18"/>`;
  q += `<line x1="70" y1="${r((TURM.y + Wl) / 2)}" x2="174" y2="${r((TURM.y + Wl) / 2)}" stroke="#77726a" stroke-width=".18"/><rect x="70" y="${r(TURM.y - 0.5)}" width="104" height=".6" fill="#d9d5cc"/>`;
  for (const x of [84, 150, 166]) q += `<rect x="${x}" y="${r(TURM.y + 0.6)}" width="1.4" height="${r((Wl - TURM.y) * 0.7)}" rx=".6" fill="#22252a"/>`;
  /* Drehbrücke: schlanke weiße Fußgängerbrücke mit Geländer, vom Turmkai nach links zum Pierhead */
  const BR = (x) => TURM.y - 0.6 + (70 - x) * 0.012, BW = (x) => Wl + (70 - x) * 0.07;
  q += `<path d="M0 ${r(BR(0) - 0.4)} L70 ${r(BR(70) - 0.4)} L70 ${r(BR(70) + 1)} L0 ${r(BR(0) + 1.6)} Z" fill="#e9ecee"/>`;
  q += `<path d="M0 ${r(BR(0) - 3)} L70 ${r(BR(70) - 2.2)} M0 ${r(BR(0) - 1.6)} L70 ${r(BR(70) - 1.3)}" stroke="#f4f6f7" stroke-width=".35"/>`;
  for (let x = 2; x < 70; x += 3) q += `<line x1="${x}" y1="${r(BR(x) - 0.4)}" x2="${x}" y2="${r(BR(x) - 2.2 - (70 - x) * 0.012)}" stroke="#d9dde0" stroke-width=".2"/>`;
  q += `<rect x="30" y="${r(BR(30) + 1.2)}" width="2.4" height="${r(BW(30) - BR(30) - 1)}" fill="#a9a59c"/>`;
  S.hinten(q);
}
{
  const s = F / TURM.d;            // ≈ 2,67 Einheiten je Meter
  const g = (n) => r(n * s);
  let k = schlag(Number(g(6)), 9, s * 0.5, 0.22);
  /* Achteck: Vorderseite 2,5 m, Schrägseiten verkürzt (×0,7) und dunkler (−20 %) */
  const a = 2.5, sch = a * 0.707, fl = [-(a / 2 + sch), -a / 2, a / 2, a / 2 + sch];
  const HT = 13.4;
  k += `<path d="M${g(fl[0] - 0.2)} 0 L${g(fl[0] - 0.2)} ${g(-1.2)} L${g(fl[3] + 0.2)} ${g(-1.2)} L${g(fl[3] + 0.2)} 0 Z" fill="#9b968c"/>`;
  const SEITE = ["#7a2a20", "#ad3a2b", "#c4503b"];
  for (let i = 0; i < 3; i++) k += `<path d="M${g(fl[i])} ${g(-1.2)} L${g(fl[i])} ${g(-HT)} L${g(fl[i + 1])} ${g(-HT)} L${g(fl[i + 1])} ${g(-1.2)} Z" fill="${SEITE[i]}"/>`;
  /* Ziegelstruktur angedeutet */
  let zieg = "";
  for (let z = 1.6; z < HT; z += 0.42) zieg += `M${g(fl[0])} ${g(-z)} L${g(fl[3])} ${g(-z)}`;
  k += `<path d="${zieg}" stroke="#6e2219" stroke-width=".12" opacity=".35"/>`;
  /* weiße Ecklisenen und Gesimse */
  for (const x of fl) k += `<rect x="${g(x - 0.16)}" y="${g(-HT)}" width="${g(0.32)}" height="${g(HT - 1.2)}" fill="#efe9de"/>`;
  for (const z of [1.2, 5.4, 9.6]) k += `<rect x="${g(fl[0] - 0.1)}" y="${g(-z - 0.25)}" width="${g(fl[3] - fl[0] + 0.2)}" height="${g(0.4)}" fill="#f3eee4"/>`;
  /* Spitzbogenfenster mit weißem Rahmen; auf den Schrägseiten schmaler */
  const fenster = (cx, cy, w, h) => `<path d="M${g(cx - w / 2)} ${g(cy)} L${g(cx - w / 2)} ${g(cy - h * 0.62)} Q${g(cx - w / 2)} ${g(cy - h)} ${g(cx)} ${g(cy - h - 0.15)} Q${g(cx + w / 2)} ${g(cy - h)} ${g(cx + w / 2)} ${g(cy - h * 0.62)} L${g(cx + w / 2)} ${g(cy)} Z" fill="#f4efe6"/>` +
    `<path d="M${g(cx - w / 2 + 0.15)} ${g(cy - 0.1)} L${g(cx - w / 2 + 0.15)} ${g(cy - h * 0.6)} Q${g(cx - w / 2 + 0.15)} ${g(cy - h + 0.15)} ${g(cx)} ${g(cy - h + 0.05)} Q${g(cx + w / 2 - 0.15)} ${g(cy - h + 0.15)} ${g(cx + w / 2 - 0.15)} ${g(cy - h * 0.6)} L${g(cx + w / 2 - 0.15)} ${g(cy - 0.1)} Z" fill="${S.lg("turmglas2", [[0, "#3a4650"], [1, "#7a90a0"]], 0, 0, 1, 1)}"/>` +
    `<path d="M${g(cx)} ${g(cy - 0.1)} L${g(cx)} ${g(cy - h + 0.1)}" stroke="#f4efe6" stroke-width="${g(0.07)}"/>`;
  const mS = (fl[0] + fl[1]) / 2, mR = (fl[2] + fl[3]) / 2;
  for (const cx of [mS, mR]) k += fenster(cx, -1.9, 0.7, 2.6);
  for (const [cx, w] of [[mS, 0.7], [0, 1.0], [mR, 0.7]]) k += fenster(cx, -6.0, w, 3.1);
  k += `<path d="M${g(-0.6)} ${g(-1.2)} L${g(-0.6)} ${g(-3.4)} Q${g(0)} ${g(-4.2)} ${g(0.6)} ${g(-3.4)} L${g(0.6)} ${g(-1.2)} Z" fill="#4a2a20" stroke="#f4efe6" stroke-width="${g(0.14)}"/>`;
  /* oberstes Geschoss: Uhren – vorn rund, auf den Schrägseiten perspektivisch verkürzt, alle mit Zeigern */
  const UY = -11.5, zeit = (cx, sx) => {
    let z = "";
    const hz = [Math.sin(4.17 * Math.PI / 6) * 0.55 * sx, -Math.cos(4.17 * Math.PI / 6) * 0.55], mz = [Math.sin(2 * Math.PI / 6) * 0.82 * sx, -Math.cos(2 * Math.PI / 6) * 0.82];
    z += `<line x1="${g(cx)}" y1="${g(UY)}" x2="${g(cx + hz[0])}" y2="${g(UY + hz[1])}" stroke="#1b1612" stroke-width="${g(0.12)}" stroke-linecap="round"/>`;
    z += `<line x1="${g(cx)}" y1="${g(UY)}" x2="${g(cx + mz[0])}" y2="${g(UY + mz[1])}" stroke="#1b1612" stroke-width="${g(0.08)}" stroke-linecap="round"/>`;
    return z;
  };
  k += `<circle cx="0" cy="${g(UY)}" r="${g(1.1)}" fill="#fbfaf4" stroke="#2a2420" stroke-width="${g(0.12)}"/>`;
  for (let i = 0; i < 12; i++) { const an = i * Math.PI / 6; k += `<line x1="${r(Math.sin(an) * g(0.88))}" y1="${r(g(UY) - Math.cos(an) * g(0.88))}" x2="${r(Math.sin(an) * g(1.0))}" y2="${r(g(UY) - Math.cos(an) * g(1.0))}" stroke="#2a2420" stroke-width="${g(0.07)}"/>`; }
  k += zeit(0, 1);
  for (const [cx, sx] of [[mS, 0.7], [mR, 0.7]]) k += `<ellipse cx="${g(cx)}" cy="${g(UY)}" rx="${g(1.1 * 0.7)}" ry="${g(1.1)}" fill="#eae5da" stroke="#2a2420" stroke-width="${g(0.1)}"/>` + zeit(cx, sx);
  /* Gesims mit Konsolen; achteckiges Dach mit drei passenden Facetten; Spitze mit Kugel (Knauf) */
  k += `<rect x="${g(fl[0] - 0.4)}" y="${g(-HT - 0.5)}" width="${g(fl[3] - fl[0] + 0.8)}" height="${g(0.6)}" fill="#f3eee4"/>`;
  for (let x = fl[0]; x <= fl[3]; x += 0.53) k += `<rect x="${g(x)}" y="${g(-HT)}" width="${g(0.2)}" height="${g(0.35)}" fill="#d9d1c2"/>`;
  const DT = -HT - 0.5, SP = -HT - 6.4;
  k += `<path d="M${g(fl[0] - 0.3)} ${g(DT)} L0 ${g(SP)} L${g(fl[1])} ${g(DT)} Z" fill="#3a3e43"/><path d="M${g(fl[1])} ${g(DT)} L0 ${g(SP)} L${g(fl[2])} ${g(DT)} Z" fill="#555b61"/><path d="M${g(fl[2])} ${g(DT)} L0 ${g(SP)} L${g(fl[3] + 0.3)} ${g(DT)} Z" fill="#717880"/>`;
  for (const f of [0.28, 0.52, 0.74]) k += `<path d="M${g((fl[0] - 0.3) * (1 - f))} ${g(DT + (SP - DT) * f)} L${g((fl[3] + 0.3) * (1 - f))} ${g(DT + (SP - DT) * f)}" stroke="#2c3034" stroke-width="${g(0.07)}"/>`;
  k += `<line x1="0" y1="${g(SP)}" x2="0" y2="${g(SP - 1.6)}" stroke="#4a4e52" stroke-width="${g(0.12)}"/><circle cx="0" cy="${g(SP - 0.9)}" r="${g(0.22)}" fill="#c9a23a"/>`;
  k += `<path d="M0 ${g(SP - 1.6)} l${g(0.9)} ${g(0.15)} l${g(-0.9)} ${g(0.25)} M${g(-0.5)} ${g(SP - 1.2)} l${g(1)} 0" stroke="#4a4e52" stroke-width="${g(0.08)}" fill="none"/>`;
  turmUnter.push(
    { id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: TURM.x, y: TURM.y + Number(g(UY)) + Number(g(1.5)),
      kunst: flaeche(-Number(g(2.4)), -Number(g(3)), Number(g(4.8)), Number(g(3)), 0.6), tipp: "Die Uhr kam aus Edinburgh in Schottland." },
    { id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: TURM.x, y: TURM.y + Number(g(-5.6)),
      kunst: flaeche(-Number(g(1.4)), -Number(g(3.8)), Number(g(2.8)), Number(g(3.9)), 0.4), tipp: "Die spitzen Bogenfenster sind typisch für die Neugotik." },
    { id: "dach", de: "das Dach", syl: "DACH", it: "il tetto", itSyl: "TET-to", en: "roof", x: TURM.x, y: TURM.y + Number(g(DT)),
      kunst: flaeche(-Number(g(2.8)), -Number(g(7.8)), Number(g(5.6)), Number(g(7.8)), 0.4) });
  S.teil({ id: "uhrturm", de: "der Uhrturm", syl: "UHR-turm", it: "la torre dell'orologio", itSyl: "TOR-re del-lo-ro-LO-gio", en: "clock tower", x: TURM.x, y: TURM.y, steht: true, kunst: k,
    tipp: "Der rote Uhrturm von 1882 war das Büro des Hafenkapitäns. Von oben sah er alle Schiffe kommen.",
    zoom: { x: TURM.x - 34, y: TURM.y - 60, w: 68, h: 66 }, unter: turmUnter });
}

/* =====================================================================
   5 — DER HAFEN (Victoria Basin): Spiegelungen, Kräusel durch den Wind
   ===================================================================== */
const KAI = 214;   // Vorderkante des Kais, auf dem der Betrachter steht
{
  /* Wasserfläche; der Turmkai liegt näher im Becken: dort beginnt das Wasser erst unter seiner Kaimauer */
  const W0 = r(wy(D_HALLE) - 0.2), WT = r(wy(TURM.d));
  let k = `<path d="M0 ${W0} L400 ${W0} L400 ${KAI} L0 ${KAI} Z M70 ${W0} L70 ${WT} L174 ${WT} L174 ${W0} Z" fill-rule="evenodd" fill="${S.lg("wasser", [[0, "#7aa0ab"], [0.18, "#3f7480"], [1, "#1c4752"]])}"/>`;
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".5">`;
  for (let i = 0; i < 12; i++) k += `<rect x="${r(TURM.x - 6 + (i % 2) * 1.2)}" y="${r(wy(TURM.d) + 0.6 + i * 2.4)}" width="${r(12 - i * 0.5)}" height="1.6" fill="#b23a2b" opacity="${r(0.6 - i * 0.04)}"/>`;
  k += `<rect x="262" y="${r(wy(D_HALLE) + 0.4)}" width="34" height="5" fill="#b4583c" opacity=".4"/><rect x="184" y="${r(wy(D_HALLE) + 0.4)}" width="76" height="4" fill="#e6dfd0" opacity=".25"/>`;
  k += `</g>`;
  /* Kräusel und Schaumköpfchen vom Südostwind */
  let wl = "";
  for (let i = 0; i < 230; i++) {
    const y = wy(D_HALLE) + 1 + Math.pow(rnd(), 0.85) * (KAI - wy(D_HALLE) - 3), w = 1 + (y - HOR) * 0.25 * (0.5 + rnd());
    wl += `<path d="M${r(rnd() * (398 - w))} ${r(y)} q${r(w / 2)} -.6 ${r(w)} 0" stroke="${rnd() < 0.5 ? "#cfe6e8" : "#123a44"}" stroke-width="${r(0.15 + (y - HOR) * 0.011)}" fill="none" opacity="${r(0.3 + rnd() * 0.45)}"/>`;
  }
  for (let i = 0; i < 16; i++) { const y = 160 + rnd() * 48, x = rnd() * 380, w = 1 + (y - HOR) * 0.08; wl += `<path d="M${r(x)} ${r(y)} q${r(w)} ${r(-w * 0.5)} ${r(w * 2)} 0" stroke="#ffffff" stroke-width="${r(0.3 + (y - HOR) * 0.008)}" fill="none" opacity=".8"/>`; }
  k += wl;
  S.teil({ id: "hafen", de: "der Hafen", syl: "HA-fen", it: "il porto", itSyl: "POR-to", en: "harbour", x: 0, y: 0, kunst: k,
    tipp: "Die Hafenbecken heißen Victoria und Alfred – nach Königin Victoria und ihrem Sohn Prinz Alfred." });
}

/* =====================================================================
   6 — DAS SEGELBOOT (fährt mit Motor, Segel eingerollt), 7 — DAS
       FISCHERBOOT (Kutter am Kai rechts)
   ===================================================================== */
{
  const X = 196, d = 190, Y = wy(d), s = F / d;
  const g = (n) => r(n * s);
  let k = schatten(0, 0.2, g(6), 0.6, 0.2);
  k += `<path d="M${g(-11)} ${g(0.2)} q${g(-3)} ${g(0.3)} ${g(-6)} ${g(-0.1)} M${g(-11)} ${g(-0.2)} q${g(-2)} ${g(-0.6)} ${g(-4)} ${g(-0.4)}" stroke="#f0f6f7" stroke-width=".5" fill="none" opacity=".8"/>`;
  k += `<path d="M${g(-6)} ${g(-1.4)} L${g(6.5)} ${g(-1.4)} Q${g(5.4)} 0 ${g(3)} 0 L${g(-5)} 0 Z" fill="#fbfbfa"/><rect x="${g(-6)}" y="${g(-0.7)}" width="${g(12)}" height="${g(0.3)}" fill="#1f4f8f"/>`;
  k += `<path d="M${g(-2.6)} ${g(-1.4)} L${g(-2.2)} ${g(-2.6)} L${g(1.6)} ${g(-2.6)} L${g(2)} ${g(-1.4)} Z" fill="#eef1f3"/><rect x="${g(-1.6)}" y="${g(-2.4)}" width="${g(2.8)}" height="${g(0.6)}" fill="#2f4250"/>`;
  k += `<line x1="0" y1="${g(-2.6)}" x2="0" y2="${g(-14)}" stroke="#d6d9db" stroke-width="${g(0.18)}"/>`;
  /* Großsegel eingerollt auf dem Baum (blaue Persenning), Vorsegel aufgerollt am Vorstag */
  k += `<rect x="${g(-5)}" y="${g(-3.6)}" width="${g(5)}" height="${g(0.8)}" rx="${g(0.4)}" fill="#2f5f95"/><line x1="0" y1="${g(-14)}" x2="${g(6.2)}" y2="${g(-1.4)}" stroke="#d6d9db" stroke-width="${g(0.12)}"/><path d="M${g(0.4)} ${g(-12.6)} L${g(5.6)} ${g(-2.2)}" stroke="#f4f4f2" stroke-width="${g(0.35)}"/>`;
  S.teil({ id: "segelboot", de: "das Segelboot", syl: "SE-gel-boot", it: "la barca a vela", itSyl: "BAR-ca a VE-la", en: "sailing boat", x: X, y: Y, kunst: k + flaeche(-Number(g(7)), -Number(g(14)), Number(g(14)), Number(g(14.4))),
    tipp: "Bei Südostwind bleiben die Segel eingerollt: Im Hafenbecken fährt man mit Motor." });
}
{
  /* Fischkutter: blauer Stahlrumpf mit Roststreifen, weißes Ruderhaus, Mast mit Ausleger, orange Bojen */
  const X = 322, d = 120, Y = wy(d), s = F / d;
  const g = (n) => r(n * s);
  let k = schatten(0, 0.2, g(11), 0.8, 0.25);
  k += `<path d="M${g(-11)} ${g(-3.4)} L${g(10)} ${g(-4.2)} L${g(11.6)} ${g(-5.2)} Q${g(10.6)} 0 ${g(8)} 0 L${g(-9)} 0 Q${g(-10.6)} ${g(-0.6)} ${g(-11)} ${g(-3.4)} Z" fill="${S.lg("kutter", [[0, "#2f5f9a"], [0.7, "#1f4370"], [0.71, "#8c2a22"], [1, "#6a1f19"]])}"/>`;
  k += `<path d="M${g(-11)} ${g(-3.4)} L${g(11.6)} ${g(-5.2)}" stroke="#f1efe8" stroke-width="${g(0.3)}"/>`;
  for (const x of [-7, -2, 4, 8]) k += `<path d="M${g(x)} ${g(-3.6)} l${g(0.2)} ${g(2.4)}" stroke="#a8582e" stroke-width="${g(0.25)}" opacity=".6"/>`;
  k += `<text x="${g(-6)}" y="${g(-1.5)}" font-size="${g(0.9)}" fill="#f1efe8" font-family="Arial,sans-serif" font-weight="bold">SEA SPRAY  CTA 214</text>`;
  k += `<path d="M${g(2)} ${g(-4.5)} L${g(2.4)} ${g(-8.6)} L${g(7.6)} ${g(-8.6)} L${g(8.4)} ${g(-4.8)} Z" fill="#f3f1ea"/>`;
  for (const x of [3, 4.6, 6.2]) k += `<rect x="${g(x)}" y="${g(-8)}" width="${g(1.1)}" height="${g(1.2)}" fill="#2f3f4c"/>`;
  k += `<rect x="${g(2.2)}" y="${g(-9.2)}" width="${g(5.6)}" height="${g(0.6)}" fill="#c23a2b"/>`;
  k += `<line x1="${g(-1)}" y1="${g(-4)}" x2="${g(-1)}" y2="${g(-15)}" stroke="#d9d9d4" stroke-width="${g(0.28)}"/><line x1="${g(-1)}" y1="${g(-13)}" x2="${g(-9)}" y2="${g(-5)}" stroke="#d9d9d4" stroke-width="${g(0.2)}"/>`;
  k += `<line x1="${g(-1)}" y1="${g(-15)}" x2="${g(10)}" y2="${g(-5)}" stroke="#555" stroke-width="${g(0.08)}"/><line x1="${g(-1)}" y1="${g(-15)}" x2="${g(-10.6)}" y2="${g(-3.8)}" stroke="#555" stroke-width="${g(0.08)}"/>`;
  k += `<ellipse cx="${g(-4.6)}" cy="${g(-4.6)}" rx="${g(1.6)}" ry="${g(1)}" fill="#3d6b4a"/>`;
  for (const [x, y] of [[-8.6, -4.4], [-7.4, -4.6], [9.4, -6]]) k += `<circle cx="${g(x)}" cy="${g(y)}" r="${g(0.5)}" fill="#f07a1e"/>`;
  k += `<path d="M${g(-11)} ${g(0.3)} q${g(11)} ${g(0.6)} ${g(22)} 0" stroke="#e8f0f0" stroke-width="${g(0.2)}" fill="none" opacity=".6"/>`;
  S.teil({ id: "fischerboot", de: "das Fischerboot", syl: "FI-scher-boot", it: "il peschereccio", itSyl: "pe-sche-REC-cio", en: "fishing boat", x: X, y: Y, kunst: k,
    tipp: "Am Kai laden die Fischer ihren Fang aus – oft Seehecht und Snoek." });
}

/* =====================================================================
   8 — DIE ROBBEN (Kap-Pelzrobben) auf der schwimmenden Plattform
   ===================================================================== */
{
  const d = 30, X = 196, Y = wy(d), s = F / d;   // ≈ 11,6 Einheiten je Meter
  const g = (n) => r(n * s);
  let k = schatten(0, 0.4, g(3), 1.4, 0.35);
  k += `<path d="M${g(-3)} 0 L${g(-2.7)} ${g(-0.4)} L${g(2.7)} ${g(-0.4)} L${g(3)} 0 Z" fill="${S.lg("ponton", [[0, "#c9cdcf"], [1, "#7f8486"]])}"/>`;
  k += `<path d="M${g(-2.7)} ${g(-0.4)} L${g(-2.3)} ${g(-0.75)} L${g(2.3)} ${g(-0.75)} L${g(2.7)} ${g(-0.4)} Z" fill="#9a8a72"/>`;
  for (let x = -2.2; x < 2.2; x += 0.35) k += `<line x1="${g(x)}" y1="${g(-0.74)}" x2="${g(x * 1.18)}" y2="${g(-0.42)}" stroke="#8a7458" stroke-width=".25"/>`;
  k += `<path d="M${g(-3.2)} ${g(0.15)} q${g(3.2)} ${g(0.25)} ${g(6.4)} 0" stroke="#d8eaea" stroke-width=".5" fill="none" opacity=".6"/>`;
  /* Kap-Pelzrobbe in Seitenansicht (Blick nach rechts, dir = −1 spiegelt) */
  const robbe = (x, y, l, kopfHoch, dir, nass) => {
    const q = (n) => r(n * s * l);
    const fell = nass ? S.rg("robbenass", [[0, "#5a4636"], [0.5, "#3a2c22"], [1, "#1e1610"]], 0.45, 0.25, 0.85) : S.rg("robbetrocken", [[0, "#b08a62"], [0.55, "#8a6848"], [1, "#4a3828"]], 0.45, 0.25, 0.85);
    let g2 = `<g transform="translate(${g(x)} ${g(y)}) scale(${dir} 1)">`;
    /* Hinterflossen: nach vorn unter den Körper gedreht, gespreizt */
    g2 += `<path d="M${q(-0.7)} ${q(-0.06)} Q${q(-0.5)} ${q(0.02)} ${q(-0.28)} ${q(0.02)} L${q(-0.22)} ${q(-0.05)} Q${q(-0.45)} ${q(-0.08)} ${q(-0.6)} ${q(-0.14)} Z" fill="#2a2018"/>`;
    g2 += `<path d="M${q(-0.7)} ${q(-0.08)} Q${q(-0.62)} ${q(0.03)} ${q(-0.44)} ${q(0.04)}" stroke="#1a130d" stroke-width="${q(0.02)}" fill="none"/>`;
    /* Körper: Rücken, Brust aufgerichtet */
    g2 += `<path d="M${q(-0.78)} ${q(-0.05)} Q${q(-0.7)} ${q(-0.3)} ${q(-0.25)} ${q(-0.38)} Q${q(0.15)} ${q(-0.45)} ${q(0.34)} ${q(kopfHoch ? -0.62 : -0.38)} L${q(0.48)} ${q(kopfHoch ? -0.5 : -0.2)} Q${q(0.42)} ${q(-0.12)} ${q(0.3)} 0 L${q(-0.6)} 0 Z" fill="${fell}"/>`;
    /* Kopf: spitze Schnauze, kleines Außenohr, Schnurrhaare */
    const kx = kopfHoch ? 0.46 : 0.6, ky = kopfHoch ? -0.72 : -0.3;
    g2 += `<path d="M${q(kx - 0.16)} ${q(ky + 0.08)} Q${q(kx - 0.12)} ${q(ky - 0.12)} ${q(kx + 0.06)} ${q(ky - 0.1)} Q${q(kx + 0.2)} ${q(ky - 0.06)} ${q(kx + 0.3)} ${q(ky + 0.02)} Q${q(kx + 0.22)} ${q(ky + 0.09)} ${q(kx + 0.06)} ${q(ky + 0.1)} Q${q(kx - 0.04)} ${q(ky + 0.16)} ${q(kx - 0.16)} ${q(ky + 0.08)} Z" fill="${fell}"/>`;
    g2 += `<circle cx="${q(kx + 0.27)}" cy="${q(ky + 0.01)}" r="${q(0.022)}" fill="#0b0806"/>`;
    g2 += `<circle cx="${q(kx + 0.05)}" cy="${q(ky - 0.03)}" r="${q(0.028)}" fill="#0b0806"/><circle cx="${q(kx + 0.058)}" cy="${q(ky - 0.038)}" r="${q(0.008)}" fill="#fff"/>`;
    g2 += `<path d="M${q(kx - 0.08)} ${q(ky - 0.08)} l${q(-0.03)} ${q(-0.06)} l${q(0.04)} ${q(0.02)}" stroke="#2b2119" stroke-width="${q(0.03)}" fill="none"/>`;
    g2 += `<path d="M${q(kx + 0.22)} ${q(ky + 0.04)} l${q(0.2)} ${q(0.01)} M${q(kx + 0.22)} ${q(ky + 0.05)} l${q(0.18)} ${q(0.07)} M${q(kx + 0.21)} ${q(ky + 0.06)} l${q(0.14)} ${q(0.12)}" stroke="#efe6d4" stroke-width="${q(0.01)}" opacity=".9"/>`;
    /* Vorderflosse aufgestützt */
    g2 += `<path d="M${q(0.18)} ${q(-0.28)} Q${q(0.28)} ${q(-0.12)} ${q(0.4)} ${q(0.01)} L${q(0.18)} ${q(0.02)} Q${q(0.14)} ${q(-0.12)} ${q(0.1)} ${q(-0.22)} Z" fill="#2a2018"/>`;
    /* Glanz */
    g2 += `<path d="M${q(-0.6)} ${q(-0.26)} Q${q(-0.2)} ${q(-0.4)} ${q(0.2)} ${q(-0.4)}" stroke="${nass ? "#c9b49a" : "#e8d2b0"}" stroke-width="${q(0.035)}" fill="none" opacity=".6"/>`;
    return g2 + `</g>`;
  };
  k += robbe(-1.5, -0.74, 1.1, false, 1, false) + robbe(1.4, -0.74, 1.15, true, -1, true) + robbe(0.1, -0.76, 1, true, 1, false);
  /* eine Robbe schwimmt daneben: Kopf mit Schnauze, Ohr, Schnurrhaaren, Wellenring */
  const SW = [4.8, 0.05];
  k += `<g transform="translate(${g(SW[0])} ${g(SW[1])})">`;
  k += `<ellipse cx="0" cy="${g(0.08)}" rx="${g(0.9)}" ry="${g(0.16)}" fill="none" stroke="#e2f0f0" stroke-width=".45" opacity=".8"/><ellipse cx="0" cy="${g(0.08)}" rx="${g(1.4)}" ry="${g(0.24)}" fill="none" stroke="#e2f0f0" stroke-width=".3" opacity=".45"/>`;
  k += `<path d="M${g(-0.3)} ${g(0.05)} Q${g(-0.32)} ${g(-0.3)} ${g(-0.05)} ${g(-0.38)} Q${g(0.25)} ${g(-0.38)} ${g(0.45)} ${g(-0.25)} Q${g(0.3)} ${g(-0.15)} ${g(0.2)} ${g(-0.12)} Q${g(0.25)} ${g(0.02)} ${g(0.25)} ${g(0.06)} Z" fill="#2c2119"/>`;
  k += `<circle cx="${g(0.1)}" cy="${g(-0.26)}" r="${g(0.03)}" fill="#000"/><circle cx="${g(0.43)}" cy="${g(-0.24)}" r="${g(0.02)}" fill="#000"/><path d="M${g(-0.16)} ${g(-0.34)} l${g(-0.04)} ${g(-0.07)}" stroke="#2c2119" stroke-width="${g(0.03)}"/>`;
  k += `<path d="M${g(0.36)} ${g(-0.2)} l${g(0.22)} ${g(0.03)} M${g(0.36)} ${g(-0.19)} l${g(0.2)} ${g(0.09)}" stroke="#efe6d4" stroke-width="${g(0.012)}"/>`;
  k += `</g>` + flaeche(Number(g(SW[0])) - 9, -10, 18, 13);
  S.teil({ id: "robbe", de: "die Robbe", syl: "ROB-be", it: "la foca", itSyl: "FO-ca", en: "seal", x: X, y: Y, kunst: k,
    tipp: "Die Kap-Pelzrobben ruhen im Hafen auf einer schwimmenden Plattform – nur für sie gebaut. Nass ist ihr Fell fast schwarz, trocken hellbraun." });
}

/* =====================================================================
   VORN — der Kai (Pierhead): Granitkante mit Pollerreihe, Fender, Leiter
   ===================================================================== */
{
  let k = `<rect x="0" y="${KAI}" width="400" height="${260 - KAI}" fill="${S.lg("kai", [[0, "#b9b2a6"], [1, "#9b9488"]])}"/>`;
  k += `<rect x="0" y="${KAI - 0.6}" width="400" height="5" fill="${S.lg("kante", [[0, "#e2ddd3"], [1, "#a39d92"]])}"/>`;
  for (let x = 0; x < 400; x += 18) k += `<line x1="${x}" y1="${KAI}" x2="${x}" y2="${KAI + 4.4}" stroke="#7d776d" stroke-width=".4"/>`;
  let p = "";
  for (let i = -22; i <= 22; i++) p += `M${r(200 + i * 9.6)} ${KAI + 4.4} L${r(200 + i * 9.6 * (260 - HOR) / (KAI + 4.4 - HOR))} 260`;
  for (const y of [222, 231, 242, 255]) p += `M0 ${y} L400 ${y}`;
  k += `<path d="${p}" stroke="#8a8478" stroke-width=".35" opacity=".7"/>`;
  for (let i = 0; i < 90; i++) k += `<circle cx="${r(rnd() * 400)}" cy="${r(KAI + 6 + rnd() * 54)}" r="${r(0.3 + rnd() * 0.6)}" fill="${rnd() < 0.5 ? "#857e72" : "#d2ccc0"}" opacity=".5"/>`;
  k += `<rect x="0" y="${KAI + 4.4}" width="400" height="${260 - KAI - 4.4}" fill="${S.lg("kailicht", [[0, "#000", 0.12], [0.3, "#000", 0], [1, "#000", 0.1]])}"/>`;
  /* Fender (schwarze Gummirollen an Ketten) und Leiter über der Kante */
  for (const x of [96, 286, 372]) k += `<line x1="${x}" y1="${KAI + 1}" x2="${x}" y2="${KAI - 2}" stroke="#555" stroke-width=".35"/><rect x="${x - 2.6}" y="${KAI - 2.6}" width="5.2" height="3.4" rx="1.6" fill="#1d1f22"/><rect x="${x - 2.2}" y="${KAI - 2.4}" width="4.4" height=".7" rx=".35" fill="#4a4e54"/>`;
  k += `<path d="M232 ${KAI + 3} Q232 ${KAI - 4} 236 ${KAI - 4} Q240 ${KAI - 4} 240 ${KAI + 0.4} M244 ${KAI + 3} Q244 ${KAI - 4} 248 ${KAI - 4} Q252 ${KAI - 4} 252 ${KAI + 0.4}" stroke="#9aa1a6" stroke-width="1.1" fill="none"/>`;
  /* kleine Poller der Pollerreihe entlang der Kante */
  for (const x of [20, 330]) k += `<path d="M${x - 2} ${KAI + 1} L${x - 1.6} ${KAI - 4} Q${x - 2.6} ${KAI - 4.6} ${x - 2.6} ${KAI - 5.4} L${x + 2.6} ${KAI - 5.4} Q${x + 2.6} ${KAI - 4.6} ${x + 1.6} ${KAI - 4} L${x + 2} ${KAI + 1} Z" fill="#2a2d31"/>`;
  S.hinten(k);
}
{
  /* DER POLLER aus Gusseisen mit Festmacherleine, darauf die Dominikanermöwe */
  const X = 150, Y = 226, s = vorn(Y);
  const g = (n) => r(n * s);
  let k = schlag(Number(g(0.5)), 0.6, s, 0.35);
  const PG = S.lg("poller", [[0, "#1f2226"], [0.45, "#5a6066"], [1, "#16181b"]], 0, 0, 1, 0);
  k += `<path d="M${g(-0.26)} 0 L${g(-0.24)} ${g(-0.05)} L${g(0.24)} ${g(-0.05)} L${g(0.26)} 0 Z" fill="#2a2d31"/>`;
  k += `<path d="M${g(-0.17)} ${g(-0.05)} Q${g(-0.16)} ${g(-0.3)} ${g(-0.12)} ${g(-0.4)} Q${g(-0.2)} ${g(-0.44)} ${g(-0.22)} ${g(-0.5)} Q${g(-0.2)} ${g(-0.58)} 0 ${g(-0.59)} Q${g(0.2)} ${g(-0.58)} ${g(0.22)} ${g(-0.5)} Q${g(0.2)} ${g(-0.44)} ${g(0.12)} ${g(-0.4)} Q${g(0.16)} ${g(-0.3)} ${g(0.17)} ${g(-0.05)} Z" fill="${PG}"/>`;
  k += `<path d="M${g(-0.1)} ${g(-0.56)} Q0 ${g(-0.6)} ${g(0.12)} ${g(-0.55)}" stroke="#8a9096" stroke-width="${g(0.02)}" fill="none" opacity=".7"/>`;
  k += `<path d="M${g(-0.14)} ${g(-0.36)} Q0 ${g(-0.28)} ${g(0.14)} ${g(-0.36)}" stroke="#e6d6a8" stroke-width="${g(0.05)}" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${g(0.14)} ${g(-0.36)} Q${g(0.32)} ${g(-0.2)} ${g(0.32)} 0 M${g(0.3)} ${g(0.02)} Q${g(0.62)} ${g(0.06)} ${g(0.66)} ${g(0.0)} Q${g(0.68)} ${g(-0.06)} ${g(0.42)} ${g(-0.05)} Q${g(0.3)} ${g(-0.04)} ${g(0.38)} ${g(0.05)} Q${g(0.58)} ${g(0.1)} ${g(0.72)} ${g(0.04)}" stroke="#e6d6a8" stroke-width="${g(0.045)}" fill="none" stroke-linecap="round"/>`;
  S.teil({ id: "poller", de: "der Poller", syl: "POL-ler", it: "la bitta", itSyl: "BIT-ta", en: "bollard", x: X, y: Y, steht: true, kunst: k,
    tipp: "Am Poller wird das Schiff mit einer dicken Leine festgemacht." });
  /* Dominikanermöwe, ≈ 60 cm: weißer Kopf und Bauch, Rücken und Flügel schieferschwarz mit weißem Hinterrand */
  const m = (n) => r(n * s / 100);
  let w = `<path d="M${m(-3)} 0 L${m(-2)} ${m(-10)} M${m(4)} 0 L${m(3.4)} ${m(-10)}" stroke="#d6c06a" stroke-width="${m(1.6)}" stroke-linecap="round"/>`;
  w += `<path d="M${m(-28)} ${m(-22)} L${m(-14)} ${m(-25)} L${m(-16)} ${m(-18)} Z" fill="#141518"/>`;
  w += `<path d="M${m(-24)} ${m(-22)} Q${m(-10)} ${m(-38)} ${m(10)} ${m(-35)} Q${m(19)} ${m(-32)} ${m(17)} ${m(-22)} Q${m(12)} ${m(-11)} ${m(-3)} ${m(-12)} Q${m(-17)} ${m(-14)} ${m(-24)} ${m(-22)} Z" fill="${S.rg("moewe", [[0, "#ffffff"], [1, "#e2e4e6"]], 0.6, 0.45, 0.7)}"/>`;
  w += `<path d="M${m(-26)} ${m(-22.5)} Q${m(-10)} ${m(-34)} ${m(9)} ${m(-29)} Q${m(10)} ${m(-23)} ${m(2)} ${m(-19)} Q${m(-12)} ${m(-17)} ${m(-26)} ${m(-22.5)} Z" fill="#26282d"/>`;
  w += `<path d="M${m(-25)} ${m(-21.6)} Q${m(-10)} ${m(-17.4)} ${m(2)} ${m(-18.4)}" stroke="#f2f2f2" stroke-width="${m(1.3)}" fill="none"/>`;
  w += `<path d="M${m(-21)} ${m(-25)} l${m(-2)} ${m(1.6)} m${m(4)} ${m(-2.4)} l${m(-2)} ${m(1.6)}" stroke="#f4f4f4" stroke-width="${m(0.9)}"/>`;
  w += `<circle cx="${m(14)}" cy="${m(-40)}" r="${m(6.4)}" fill="#ffffff"/><circle cx="${m(16.4)}" cy="${m(-41.6)}" r="${m(1.1)}" fill="#e8d36a"/><circle cx="${m(16.4)}" cy="${m(-41.6)}" r="${m(0.55)}" fill="#111"/>`;
  w += `<path d="M${m(19.4)} ${m(-40.6)} L${m(29)} ${m(-38.8)} Q${m(29.6)} ${m(-37)} ${m(27.6)} ${m(-36.4)} L${m(19.4)} ${m(-37)} Z" fill="#f2c62f"/><circle cx="${m(26.4)}" cy="${m(-37.1)}" r="${m(1)}" fill="#d8321e"/>`;
  S.teil({ oben: true, id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: X, y: Y - Number(g(0.59)), kunst: w,
    tipp: "Die Dominikanermöwe ist groß, hat einen schwarzen Rücken und einen gelben Schnabel mit rotem Fleck." });
}

/* =====================================================================
   9 — DER MUSIKER mit der MARIMBA (Straßenmusik an der Waterfront)
   ===================================================================== */
const MUS = { x: 40, y: 224 };
{
  const m = B.mensch({ id: "kap_musiker", geschlecht: "m", pose: "halten", blick: 12, frisur: "kurz", haarfarbe: "schwarz", haut: "dunkel", laecheln: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "#e2722d" }, unterteil: { stueck: "hose", farbe: "#2f3035" }, schuhe: { stueck: "turnschuh" }, kopf: { stueck: "kappe", farbe: "#2f8a4a" } } }, 1.76 * vorn(MUS.y));
  /* Schlägel in beiden Händen, zur Marimba geneigt */
  let svg = m.svg;
  for (const h of [m.z.handL, m.z.handR]) { const hx = h.x * m.k, hy2 = h.y * m.k; svg += `<line x1="${r(hx)}" y1="${r(hy2)}" x2="${r(hx + 1.5)}" y2="${r(hy2 + 10)}" stroke="#7a5a3a" stroke-width=".7" stroke-linecap="round"/><circle cx="${r(hx + 1.6)}" cy="${r(hy2 + 10.6)}" r="1.4" fill="#c23a2b"/>`; }
  S.teil({ id: "musiker", de: "der Musiker", syl: "MU-si-ker", it: "il musicista", itSyl: "mu-si-CI-sta", en: "musician", x: MUS.x, y: MUS.y, kunst: schlag(26, 1.8, vorn(MUS.y) * 0.25, 0.22) + svg,
    tipp: "Der Musiker spielt Marimba – die Musik kommt aus dem südlichen Afrika." });
}

{
  /* die Marimba: Holzklangstäbe (Kiaat) in zwei Reihen auf einem Rahmen, darunter Resonanzrohre */
  const X = MUS.x + 14, Y = MUS.y + 8, s = vorn(Y);
  const g = (n) => r(n * s);
  let k = `<g transform="translate(${g(0.3)} 0)">${schlag(Number(g(1.1)), 0.5, s, 0.28)}</g>`;
  const L = 0.7, R = 0.55, H0 = 0.78;
  k += `<path d="M${g(-L)} 0 L${g(-L + 0.06)} ${g(-H0 + 0.1)} M${g(R)} 0 L${g(R - 0.06)} ${g(-H0 + 0.2)} M${g(-L + 0.03)} ${g(-0.3)} L${g(R - 0.03)} ${g(-0.3)}" stroke="#5a3a22" stroke-width="${g(0.04)}"/>`;
  /* Resonanzrohre (dunkel), nach rechts kürzer */
  for (let i = 0; i < 12; i++) { const x = -L + 0.06 + i * 0.1, l = 0.42 - i * 0.022; k += `<rect x="${g(x)}" y="${g(-H0 + 0.08 + i * 0.008)}" width="${g(0.07)}" height="${g(l)}" rx="${g(0.03)}" fill="${i % 2 ? "#3a3d42" : "#4a4e54"}"/>`; }
  /* Rahmen und Klangstäbe, nach rechts kürzer (hohe Töne) */
  k += `<path d="M${g(-L - 0.04)} ${g(-H0 + 0.06)} L${g(R + 0.04)} ${g(-H0 + 0.16)} L${g(R + 0.04)} ${g(-H0 + 0.2)} L${g(-L - 0.04)} ${g(-H0 + 0.1)} Z" fill="#6b4426"/>`;
  for (let i = 0; i < 12; i++) { const x = -L + 0.03 + i * 0.1, l = 0.34 - i * 0.012, y = -H0 + 0.06 + i * 0.008; k += `<path d="M${g(x)} ${g(y)} L${g(x + 0.085)} ${g(y)} L${g(x + 0.08)} ${g(y - l * 0.32)} L${g(x + 0.005)} ${g(y - l * 0.32)} Z" fill="${S.lg("kiaat", [[0, "#d08a4a"], [1, "#9a5a2a"]])}" stroke="#6b3c1c" stroke-width=".2"/>`; }
  S.teil({ id: "marimba", de: "die Marimba", syl: "ma-RIM-ba", it: "la marimba", itSyl: "ma-RIM-ba", en: "marimba", x: X, y: Y, steht: true, kunst: k,
    tipp: "An der Waterfront spielen oft Marimba-Bands: Holzstäbe, die man mit Schlägeln anschlägt." });
}
/* =====================================================================
   10 — DER CAFÉTISCH am Kai (Lupe: Rooibostee, Protea, Koeksister,
        Pinguin), 11 — DER STUHL
   ===================================================================== */
const TISCH = { x: 312, y: 247 };
const tischUnter = [];
{
  /* Bistrostuhl neben dem Tisch (Bugholz, Rattangeflecht) */
  const s = vorn(TISCH.y - 6);
  const g = (n) => r(n * s);
  let k = schlag(Number(g(0.4)), 0.9, s, 0.3);
  const HOLZ = "#4a2e1c";
  k += `<path d="M${g(-0.2)} 0 Q${g(-0.19)} ${g(-0.25)} ${g(-0.17)} ${g(-0.45)} M${g(0.18)} 0 Q${g(0.17)} ${g(-0.25)} ${g(0.15)} ${g(-0.45)} M${g(-0.05)} ${g(0.02)} L${g(-0.04)} ${g(-0.44)}" stroke="${HOLZ}" stroke-width="${g(0.035)}" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${g(-0.23)} ${g(-0.44)} L${g(0.21)} ${g(-0.44)} L${g(0.18)} ${g(-0.5)} L${g(-0.2)} ${g(-0.5)} Z" fill="${S.lg("rattan", [[0, "#d9b77a"], [1, "#b48a4e"]])}"/><rect x="${g(-0.23)}" y="${g(-0.44)}" width="${g(0.44)}" height="${g(0.035)}" fill="${HOLZ}"/>`;
  k += `<path d="M${g(0.17)} ${g(-0.47)} Q${g(0.24)} ${g(-0.75)} ${g(0.2)} ${g(-0.92)} Q${g(0.12)} ${g(-0.98)} ${g(0.08)} ${g(-0.9)} Q${g(0.12)} ${g(-0.72)} ${g(0.09)} ${g(-0.5)}" fill="${S.lg("rattan2", [[0, "#d4b072"], [1, "#a97f45"]])}" stroke="${HOLZ}" stroke-width="${g(0.02)}"/>`;
  for (let i = 1; i < 6; i++) k += `<line x1="${g(0.1)}" y1="${g(-0.5 - i * 0.075)}" x2="${g(0.21)}" y2="${g(-0.5 - i * 0.075)}" stroke="#8a6436" stroke-width=".3"/>`;
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: TISCH.x + 32, y: TISCH.y - 6, steht: true, kunst: k });
}
{
  const s = vorn(TISCH.y);    // ≈ 66 Einheiten je Meter
  const g = (n) => r(n * s);
  const TOP = -0.74;
  let k = schlag(Number(g(0.5)), 0.74, s, 0.3);
  k += `<path d="M${g(-0.24)} 0 L${g(0.24)} 0 L${g(0.03)} ${g(-0.05)} L${g(-0.03)} ${g(-0.05)} Z" fill="#3a3d40"/><rect x="${g(-0.025)}" y="${g(TOP)}" width="${g(0.05)}" height="${g(-TOP)}" fill="#55595d"/>`;
  k += `<ellipse cx="0" cy="${g(TOP + 0.02)}" rx="${g(0.38)}" ry="${g(0.075)}" fill="#8f8a82"/>`;
  k += `<ellipse cx="0" cy="${g(TOP)}" rx="${g(0.38)}" ry="${g(0.075)}" fill="${S.rg("marmor", [[0, "#fbfaf6"], [1, "#dcd8cf"]], 0.4, 0.4, 0.7)}"/>`;
  /* Rooibostee im Glas mit Untertasse */
  const TX = -0.25;
  k += `<ellipse cx="${g(TX)}" cy="${g(TOP - 0.005)}" rx="${g(0.07)}" ry="${g(0.016)}" fill="#e9e6df" stroke="#c9c4ba" stroke-width=".2"/>`;
  k += `<path d="M${g(TX - 0.04)} ${g(TOP - 0.01)} L${g(TX - 0.045)} ${g(TOP - 0.1)} L${g(TX + 0.045)} ${g(TOP - 0.1)} L${g(TX + 0.04)} ${g(TOP - 0.01)} Z" fill="${S.lg("rooibos", [[0, "#c8552c"], [1, "#8a2a14"]])}" opacity=".95"/>`;
  k += `<path d="M${g(TX - 0.045)} ${g(TOP - 0.1)} L${g(TX - 0.048)} ${g(TOP - 0.125)} L${g(TX + 0.048)} ${g(TOP - 0.125)} L${g(TX + 0.045)} ${g(TOP - 0.1)}" fill="#e8f1f2" opacity=".5"/>`;
  k += `<path d="M${g(TX - 0.03)} ${g(TOP - 0.09)} L${g(TX - 0.03)} ${g(TOP - 0.03)}" stroke="#fff" stroke-width=".35" opacity=".6"/>`;
  k += `<path d="M${g(TX + 0.045)} ${g(TOP - 0.09)} q${g(0.03)} ${g(0.02)} 0 ${g(0.06)}" stroke="#d9e4e6" stroke-width=".4" fill="none"/>`;
  k += `<path d="M${g(TX + 0.02)} ${g(TOP - 0.135)} q${g(-0.02)} ${g(-0.03)} 0 ${g(-0.06)} q${g(0.02)} ${g(-0.03)} 0 ${g(-0.06)}" stroke="#fff" stroke-width=".3" opacity=".5" fill="none"/>`;
  tischUnter.push({ id: "rooibostee", de: "der Rooibostee", syl: "ROI-bos-tee", it: "il tè rooibos", itSyl: "TÈ ROI-bos", en: "rooibos tea", x: TISCH.x + Number(g(TX)), y: TISCH.y + Number(g(TOP)),
    kunst: flaeche(-Number(g(0.08)), -Number(g(0.2)), Number(g(0.16)), Number(g(0.22)), 0.6), tipp: "Rooibos (Rotbusch) wächst nur in Südafrika. Der Tee ist rot und hat kein Koffein." });
  /* Koeksister: zwei geflochtene, goldbraune Gebäckstücke, glänzend vom Sirup, auf einem Teller */
  const KX = -0.08;
  k += `<ellipse cx="${g(KX)}" cy="${g(TOP + 0.01)}" rx="${g(0.1)}" ry="${g(0.022)}" fill="#f6f4ef" stroke="#cfc9bd" stroke-width=".2"/>`;
  for (const [dx, rot] of [[-0.035, -12], [0.035, 10]]) {
    const cx = Number(g(KX + dx)), cy = Number(g(TOP - 0.012));
    k += `<g transform="translate(${r(cx)} ${r(cy)}) rotate(${rot})">`;
    for (let j = 0; j < 3; j++) k += `<path d="M${r(-0.015 * s + j * 0.008 * s)} ${r(-0.07 * s)} q${r(0.03 * s)} ${r(0.035 * s)} 0 ${r(0.07 * s)} q${r(-0.03 * s)} ${r(0.035 * s)} 0 ${r(0.07 * s)}" stroke="${j % 2 ? "#a8601c" : "#c47a2a"}" stroke-width="${r(0.022 * s)}" fill="none" stroke-linecap="round" transform="translate(0 ${r(-0.035 * s)}) scale(1 .55)"/>`;
    k += `<ellipse cx="${r(-0.005 * s)}" cy="${r(-0.02 * s)}" rx="${r(0.012 * s)}" ry="${r(0.006 * s)}" fill="#fff4d0" opacity=".7"/></g>`;
  }
  tischUnter.push({ id: "koeksister", de: "der Koeksister", syl: "KOOK-sis-ter", it: "il koeksister", itSyl: "KUK-sis-ter", en: "koeksister", x: TISCH.x + Number(g(KX)), y: TISCH.y + Number(g(TOP)),
    kunst: flaeche(-Number(g(0.1)), -Number(g(0.12)), Number(g(0.2)), Number(g(0.14)), 0.6), tipp: "Koeksisters sind geflochtenes, frittiertes Gebäck, das in kaltem Sirup getränkt wird – sehr süß!" });
  /* Königsprotea in einer Vase: Blüte ≈ 22 cm, Hochblätter als offener Kelch um die silbrig-rosa Mitte,
     ledrige, sattgrüne Blätter mit rötlichem Rand am dicken Stiel */
  const PX = 0.1, BY = TOP - 0.34;
  k += `<path d="M${g(PX - 0.045)} ${g(TOP)} L${g(PX - 0.055)} ${g(TOP - 0.11)} Q${g(PX)} ${g(TOP - 0.14)} ${g(PX + 0.055)} ${g(TOP - 0.11)} L${g(PX + 0.045)} ${g(TOP)} Z" fill="${S.lg("vase", [[0, "#3a6f8f"], [1, "#24506b"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${g(PX)} ${g(TOP - 0.12)} Q${g(PX - 0.005)} ${g(TOP - 0.2)} ${g(PX)} ${g(BY + 0.06)}" stroke="#4a6a2a" stroke-width="${g(0.016)}" fill="none"/>`;
  for (const [dy, sx, a] of [[-0.17, -1, 1], [-0.22, 1, 1], [-0.27, -1, 0.85]]) {
    const y0 = TOP + dy + 0.05;
    k += `<path d="M${g(PX)} ${g(y0)} Q${g(PX + sx * 0.04)} ${g(y0 - 0.06 * a)} ${g(PX + sx * 0.085 * a)} ${g(y0 - 0.075 * a)} Q${g(PX + sx * 0.06)} ${g(y0 - 0.01)} ${g(PX)} ${g(y0)} Z" fill="#4f8a3a" stroke="#b04a3a" stroke-width=".35"/>`;
    k += `<path d="M${g(PX)} ${g(y0)} Q${g(PX + sx * 0.04)} ${g(y0 - 0.045 * a)} ${g(PX + sx * 0.08 * a)} ${g(y0 - 0.07 * a)}" stroke="#7ab05a" stroke-width=".25" fill="none"/>`;
  }
  /* Kelch aus Hochblättern: hinten (dunkler), Mitte, vorne (heller), spitz, nach außen gebogen */
  const blatt = (ang, len, wid, farbe) => {
    const a = ang * Math.PI / 180, ex = PX + Math.cos(a) * len, ey = BY + Math.sin(a) * len * 0.9;
    const nx = -Math.sin(a) * wid, ny = Math.cos(a) * wid * 0.9;
    return `<path d="M${g(PX + nx)} ${g(BY + 0.04 + ny)} Q${g(PX + (ex - PX) * 0.55 + nx * 1.6)} ${g(BY + (ey - BY) * 0.55 + ny * 1.6)} ${g(ex)} ${g(ey)} Q${g(PX + (ex - PX) * 0.55 - nx * 1.6)} ${g(BY + (ey - BY) * 0.55 - ny * 1.6)} ${g(PX - nx)} ${g(BY + 0.04 - ny)} Z" fill="${farbe}"/>`;
  };
  for (const an of [-160, -130, -50, -20]) k += blatt(an, 0.12, 0.02, "#c9566e");
  for (const an of [-150, -115, -65, -30]) k += blatt(an, 0.11, 0.022, "#e27a90");
  k += `<ellipse cx="${g(PX)}" cy="${g(BY - 0.01)}" rx="${g(0.05)}" ry="${g(0.055)}" fill="${S.rg("protea", [[0, "#fbf3ea"], [0.6, "#ead6c8"], [1, "#c9a4a4"]], 0.5, 0.35, 0.6)}"/>`;
  for (let i = 0; i < 14; i++) k += `<circle cx="${g(PX - 0.035 + rnd() * 0.07)}" cy="${g(BY - 0.05 + rnd() * 0.08)}" r=".3" fill="#b98c90" opacity=".7"/>`;
  for (const an of [-170, -140, -40, -10, -100, -80]) k += blatt(an, 0.085, 0.024, an > -120 && an < -60 ? "#f2a3b2" : "#ec8ca0");
  tischUnter.push({ id: "protea", de: "die Protea", syl: "PRO-te-a", it: "la protea", itSyl: "pro-TE-a", en: "protea", x: TISCH.x + Number(g(PX)), y: TISCH.y + Number(g(TOP)),
    kunst: flaeche(-Number(g(0.13)), -Number(g(0.48)), Number(g(0.26)), Number(g(0.5)), 0.6), tipp: "Die Königsprotea ist die Nationalblume Südafrikas. Ihre Blüte kann so groß wie ein Teller werden." });
  /* Pinguin aus Draht und Glasperlen: sichtbares Drahtgitter, bunte Perlen in Reihen */
  const QX = 0.27;
  const pg = (n) => r(n * s);
  const umr = `M${pg(QX - 0.04)} ${pg(TOP - 0.005)} Q${pg(QX - 0.055)} ${pg(TOP - 0.1)} ${pg(QX - 0.022)} ${pg(TOP - 0.155)} Q${pg(QX)} ${pg(TOP - 0.178)} ${pg(QX + 0.022)} ${pg(TOP - 0.155)} Q${pg(QX + 0.055)} ${pg(TOP - 0.1)} ${pg(QX + 0.04)} ${pg(TOP - 0.005)} Z`;
  S.def(`<clipPath id="${S.id("pinguin")}"><path d="${umr}"/></clipPath>`);
  let pin = `<path d="${umr}" fill="#202227"/>`;
  pin += `<g clip-path="url(#${S.id("pinguin")})">`;
  const perl = ["#202227", "#202227", "#3b5bd6", "#202227"], bauch = ["#f6f6f2", "#f6f6f2", "#e94a6a", "#f6f6f2", "#f2c62f"];
  for (let row = 0; row < 15; row++) for (let col = 0; col < 9; col++) {
    const px = QX - 0.04 + col * 0.01 + (row % 2) * 0.005, py = TOP - 0.008 - row * 0.0115;
    const inBauch = Math.abs(px - QX) < 0.022 - Math.max(0, (row - 9) * 0.004) && row < 12;
    const f = inBauch ? bauch[(row + col) % 5] : perl[(row * 3 + col) % 4];
    pin += `<circle cx="${pg(px)}" cy="${pg(py)}" r="${pg(0.0048)}" fill="${f}"/>`;
  }
  let draht = "";
  for (let row = 0; row < 15; row += 2) draht += `M${pg(QX - 0.05)} ${pg(TOP - 0.008 - row * 0.0115)} L${pg(QX + 0.05)} ${pg(TOP - 0.008 - row * 0.0115)}`;
  pin += `<path d="${draht}" stroke="#b9bcc0" stroke-width=".18" opacity=".8"/></g>`;
  pin += `<path d="${umr}" fill="none" stroke="#9aa0a6" stroke-width=".3"/>`;
  pin += `<path d="M${pg(QX + 0.02)} ${pg(TOP - 0.158)} l${pg(0.032)} ${pg(0.008)} l${pg(-0.032)} ${pg(0.009)} Z" fill="#f08a1e"/>`;
  pin += `<path d="M${pg(QX - 0.03)} ${pg(TOP)} l${pg(-0.012)} ${pg(0.004)} l${pg(0.03)} 0 Z M${pg(QX + 0.012)} ${pg(TOP)} l${pg(0.03)} ${pg(0.004)} l${pg(-0.012)} ${pg(-0.004)} Z" fill="#f08a1e"/>`;
  k += pin;
  tischUnter.push({ id: "pinguin", de: "der Pinguin", syl: "PIN-gu-in", it: "il pinguino", itSyl: "pin-GUI-no", en: "penguin", x: TISCH.x + Number(g(QX)), y: TISCH.y + Number(g(TOP)),
    kunst: flaeche(-Number(g(0.065)), -Number(g(0.2)), Number(g(0.13)), Number(g(0.21)), 0.6), tipp: "Ein Pinguin aus Draht und Glasperlen – Kunsthandwerk aus Kapstadt. Echte Brillenpinguine leben am Boulders Beach." });
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolino", itSyl: "ta-vo-LI-no", en: "table", x: TISCH.x, y: TISCH.y, steht: true, kunst: k,
    tipp: "Im Café am Kai trinkt man Rooibostee mit Blick auf den Tafelberg.",
    zoom: { x: TISCH.x - 38, y: TISCH.y - 80, w: 76, h: 50 }, unter: tischUnter });
}

/* Kleinere Ausgabe (gleiches Bild): Pfaddaten werden je Segment absolut oder relativ geschrieben – was
   kürzer ist –, ohne überflüssige Trennzeichen; SVG-Attribute mit einfachen Anführungszeichen (spart im
   JSON die Rückstriche). */
const kurzPfad = (d) => {
  const tok = d.match(/[MmLlHhVvCcSsQqTtAaZz]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g) || [];
  const N = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
  const zahl = (v) => { let t = String(Math.round(v * 1000) / 1000); if (t === "-0") t = "0"; return t.replace(/^(-?)0\./, "$1."); };
  let out = "", letzter = "", cx = 0, cy = 0, sx = 0, sy = 0, i = 0, cmd = "";
  const schreibe = (c, zahlen) => {
    let t = c === letzter && c !== "M" && c !== "m" ? "" : c;
    for (const z of zahlen) { const v = zahl(z); if (t && !/[A-Za-z]$/.test(t) && !(v[0] === "-" || (v[0] === "." && /\.\d*$/.test(t.split(/[^\d.]/).pop())))) t += " "; t += v; }
    if (t && t[0] !== c && out && /[\d.]$/.test(out) && !(t[0] === "-" || (t[0] === "." && /\.\d*$/.test(out.split(/[^\d.]/).pop())))) t = " " + t;
    out += t; letzter = c === "M" ? "L" : c === "m" ? "l" : c;
  };
  while (i < tok.length) {
    if (/[A-Za-z]/.test(tok[i])) cmd = tok[i++];
    const C = cmd.toUpperCase(), rel = cmd !== C, n = N[C];
    if (C === "Z") { out += "z"; letzter = "z"; cx = sx; cy = sy; continue; }
    const a = tok.slice(i, i + n).map(Number); i += n;
    if (a.length < n || a.some(isNaN)) break;
    /* absolute Zielwerte */
    const abs = a.slice();
    if (C === "H") { if (rel) abs[0] += cx; } else if (C === "V") { if (rel) abs[0] += cy; }
    else if (C === "A") { if (rel) { abs[5] += cx; abs[6] += cy; } }
    else if (rel) for (let j = 0; j < n; j += 2) { abs[j] += cx; abs[j + 1] += cy; }
    let ex, ey;
    if (C === "H") { ex = abs[0]; ey = cy; } else if (C === "V") { ex = cx; ey = abs[0]; } else { ex = abs[n - 2]; ey = abs[n - 1]; }
    const R = (v, b) => Math.round((v - b) * 1000) / 1000;
    let A1, A2;
    if (C === "M") { A1 = ["M", [ex, ey]]; A2 = ["m", [R(ex, cx), R(ey, cy)]]; if (!out) A2 = A1; }
    else if (C === "A") { A1 = ["A", abs]; A2 = ["a", [...abs.slice(0, 5), R(ex, cx), R(ey, cy)]]; }
    else if (C === "H" || C === "V" || C === "L") {
      if (Math.abs(ey - cy) < 1e-9) { A1 = ["H", [ex]]; A2 = ["h", [R(ex, cx)]]; }
      else if (Math.abs(ex - cx) < 1e-9) { A1 = ["V", [ey]]; A2 = ["v", [R(ey, cy)]]; }
      else { A1 = ["L", [ex, ey]]; A2 = ["l", [R(ex, cx), R(ey, cy)]]; }
    } else { A1 = [C, abs]; A2 = [C.toLowerCase(), abs.map((v, j) => R(v, j % 2 ? cy : cx))]; }
    const len = (x) => x[1].map(zahl).join(" ").length + (x[0] === letzter ? 0 : 1);
    const w = len(A2) < len(A1) ? A2 : A1;
    schreibe(w[0], w[1]);
    /* gerenderte Position nachführen (keine Rundungsdrift) */
    if (w[0] === w[0].toLowerCase()) { if (w[0] === "h") cx += w[1][0]; else if (w[0] === "v") cy += w[1][0]; else { cx += w[1][w[1].length - 2]; cy += w[1][w[1].length - 1]; } }
    else { if (w[0] === "H") cx = w[1][0]; else if (w[0] === "V") cy = w[1][0]; else { cx = w[1][w[1].length - 2]; cy = w[1][w[1].length - 1]; } }
    if (C === "M") { sx = cx; sy = cy; }
    if (C === "M") cmd = rel ? "l" : "L";
  }
  return out;
};
{
  const q = (t) => {
    if (t.includes("'")) throw new Error("Apostroph im SVG: " + t.slice(t.indexOf("'") - 40, t.indexOf("'") + 10));
    return (process.env.ROH ? t : t.replace(/ d="([^"]*)"/g, (m, d) => ` d="${kurzPfad(d)}"`)).replace(/"/g, "'");
  };
  S.defs = S.defs.map(q); S.kulisse = S.kulisse.map(q);
  for (const t of S.teile) { t.kunst = q(t.kunst); for (const u of t.unter || []) u.kunst = q(u.kunst); }
}
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/kapstadt.js"));
console.log(aus);
