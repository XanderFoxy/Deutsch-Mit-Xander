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
   - RUNDE 3: Marimba-Band (Marimba und Bass-Marimba), Hemd im Stil der
     „Madiba-Hemden“, Doek (Kopftuch). Drehbrücke rechts vom Turmkai
     (UNSICHER: genaue Lage und Form). Sonnenschirme bleiben bei Südostwind
     zu. Lion's Head: Felskopf nach Ansichten (UNSICHER: Schulterhöhe).
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
{
  /* Leben am Himmel: drei Möwen im Flug (weiß, schwarze Flügelspitzen), ein Flugzeug im Landeanflug
     (weit und klein, mit Landelicht), ein ferner Hubschrauber */
  let h = "";
  for (const [x, y, w, a] of [[58, 44, 7, -6], [84, 30, 5, 8], [338, 66, 6, -4], [356, 58, 3.6, 10]]) h += `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M${-w} ${r(-w * 0.1)}Q${r(-w * 0.5)} ${r(-w * 0.45)} 0 0Q${r(w * 0.5)} ${r(-w * 0.45)} ${w} ${r(-w * 0.1)}Q${r(w * 0.5)} ${r(-w * 0.25)} 0 ${r(w * 0.12)}Q${r(-w * 0.5)} ${r(-w * 0.25)} ${-w} ${r(-w * 0.1)}Z" fill="#f6f7f8"/><path d="M${-w} ${r(-w * 0.1)}l${r(w * 0.25)} ${r(-w * 0.04)}M${w} ${r(-w * 0.1)}l${r(-w * 0.25)} ${r(-w * 0.04)}" stroke="#1d1f24" stroke-width="${r(w * 0.12)}"/><ellipse cx="0" cy="${r(w * 0.03)}" rx="${r(w * 0.12)}" ry="${r(w * 0.08)}" fill="#e8eaec"/></g>`;
  h += `<g transform="translate(150 24) rotate(6)"><path d="M-6 0h11q1.6 0 2 .6q-.4.5-2 .5h-11z" fill="#eef1f4"/><path d="M-1.6 .4l-2.6 3.2h1.4l3.6-3.2zM-1.6 .4l-1.4-2.4h1l2.4 2.4zM-5.4 .2l-1.2-1.8h.9l1.4 1.8z" fill="#cfd6dc"/><circle cx="6.6" cy=".9" r=".35" fill="#ffeeaa"/></g>`;
  h += `<g transform="translate(332 96)" opacity=".75"><ellipse cx="0" cy="0" rx="1.6" ry=".8" fill="#2f3a44"/><path d="M-1.4 0h-2.2M-2.6 -1.1h5.2" stroke="#2f3a44" stroke-width=".25"/></g>`;
  S.hinten(h);
}

/* =====================================================================
   1 — DIE BERGE: Devil's Peak, Tafelberg, Lion's Head (eine Kammlinie,
       gemeinsamer Hang ohne Naht)
   ===================================================================== */
const KAMM = [
  [-4, 520, 5000], [6, 610, 5100], [14, 700, 5250], [20, 800, 5350], [25, 900, 5420], [28.5, 968, 5460], [31, 1000, 5470], [33, 988, 5490], [37, 945, 5530], [44, 905, 5600], [52, 880, 5700], [62, 850, 5820], [74, 812, 5980], [86, 786, 6100], [96, 778, 6150],
  [100, 830, 6180], [103, 905, 6200], [106, 990, 6230], [109, 1048, 6250], [114, 1058, 6250], [150, 1060, 6250], [175, 1064, 6250], [210, 1066, 6200], [250, 1064, 6150], [280, 1061, 6000], [285, 1040, 5960], [289, 980, 5900], [294, 880, 5800], [300, 700, 5560], [306, 520, 5250], [312, 330, 4950],
  [318, 345, 4880], [326, 400, 4800], [334, 452, 4720], [342, 500, 4660], [347, 545, 4620], [350, 576, 4600], [353, 592, 4588], [355, 597, 4580], [357, 616, 4572], [359, 648, 4566], [360.5, 664, 4562], [362.5, 671, 4560], [365.5, 673, 4560], [368.5, 671, 4560], [370.2, 664, 4560], [370.6, 650, 4560], [371.6, 628, 4555], [373.4, 596, 4540], [377, 540, 4480], [381, 476, 4320], [386, 405, 3950], [391, 362, 3600], [396, 350, 3300], [404, 352, 3000],
].map(([x, z, d]) => [x, r(hy(z, d))]);
const kamm = (x0, x1) => KAMM.filter(([x]) => x >= x0 && x <= x1);
const FUSS = 130, SATTEL = [96, hy(778, 6150)], NEK = [312, hy(330, 4950)];
const TOP = hy(1062, 6250);
/* gemeinsamer Hangverlauf (Weltkoordinaten), damit an den Grenzen keine Kante entsteht */
const HANG = S.lg("hang", [[0, "#9a9474"], [0.35, "#7f8460"], [1, "#56653f"]], 0, 80, 0, FUSS, ' gradientUnits="userSpaceOnUse"');
/* Fynbos und Wald als Musterkacheln (statt vieler Einzelflecken) */
{
  /* Fynbos: unregelmäßige Flecken in drei Größen auf einer großen Kachel (37 × 17), Farben von Oliv bis
     Graugrün und Ocker; die ferne Kachel ist kleiner und blasser (Luftperspektive) */
  let fl = "";
  const fb = ["#4f5a3a", "#99956f", "#6b7350", "#3f4a30", "#8a7a52", "#5d6a44", "#a8a27e"];
  for (let i = 0; i < 46; i++) { const x = rnd() * 37, y = rnd() * 17, g = [0.5, 0.9, 1.7][i % 3] * (0.7 + rnd() * 0.6); fl += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(g * 1.4)}" ry="${r(g * 0.55)}" fill="${fb[i % 7]}"/>`; }
  for (let i = 0; i < 8; i++) { const x = rnd() * 37, y = rnd() * 17; fl += `<path d="M${r(x)} ${r(y)}l.7-.6.9.3.2.7-1 .3z" fill="#9b968a"/>`; }
  S.def(`<pattern id="${S.id("fynbos")}" width="37" height="17" patternUnits="userSpaceOnUse">${fl}</pattern>`);
  S.def(`<pattern id="${S.id("fynbosfern")}" href="#${S.id("fynbos")}" patternTransform="translate(5 0) scale(.55)"/>`);
}
S.def(`<pattern id="${S.id("wald")}" width="7" height="3.6" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.4" r="1.4" fill="#34502c"/><circle cx="3.8" cy="2.4" r="1.6" fill="#47643a"/><circle cx="6" cy="1" r="1.2" fill="#2b4426"/><circle cx="5.4" cy="3.4" r="1" fill="#34502c"/></pattern>`);
/* oben die ferne (kleine, blasse) Kachel, unten die nahe – weich überblendet (Masken mit Verlauf) */
S.def(`<mask id="${S.id("mfern")}" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="${S.lg("mf", [[0, "#fff"], [0.45, "#fff"], [0.75, "#000"]])}"/></mask><mask id="${S.id("mnah")}" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="${S.lg("mn", [[0, "#000"], [0.4, "#000"], [0.8, "#fff"]])}"/></mask>`);
const fynbos = (x0, x1, y0, y1, n, op = 0.5) => `<rect x="${x0}" y="${r(y0)}" width="${x1 - x0}" height="${r(y1 - y0)}" fill="url(#${S.id("fynbosfern")})" opacity="${r(op * 0.75)}" mask="url(#${S.id("mfern")})"/><rect x="${x0}" y="${r(y0)}" width="${x1 - x0}" height="${r(y1 - y0)}" fill="url(#${S.id("fynbos")})" opacity="${op}" mask="url(#${S.id("mnah")})"/>`;
const wald = (x0, x1, y0, y1) => { let d = `M${x0} ${r(y1)}`; for (let x = x0; x <= x1; x += 8) d += `L${x} ${r(y0 + 2 + Math.sin(x * 0.37) * 1.6 + Math.sin(x * 0.13) * 1.2)}`; return `<path d="${d}L${x1} ${r(y1)}Z" fill="url(#${S.id("wald")})" opacity=".9"/>`; };
const rinne = (x0, y0, x1, y1, w) => {
  /* gewundene Kerbe: S-Kurve, oben schmal, unten breit; links Schattenseite, rechts Lichtkante */
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, sw = (x1 - x0) * 0.5 + w * 1.5;
  const li = `M${r(x0 - w * 0.4)} ${r(y0)}C${r(mx - sw)} ${r(my - 4)} ${r(mx + sw * 0.6 - w * 2)} ${r(my + 4)} ${r(x1 - w * 2.4)} ${r(y1)}`;
  const re = `L${r(x1 + w * 2.4)} ${r(y1)}C${r(mx + sw * 0.6 + w * 2)} ${r(my + 4)} ${r(mx - sw + w)} ${r(my - 4)} ${r(x0 + w * 0.4)} ${r(y0)}Z`;
  return `<path d="${li}${re}" fill="#2f3826" opacity=".32"/><path d="M${r(x0 + w * 0.4)} ${r(y0)}C${r(mx - sw + w)} ${r(my - 4)} ${r(mx + sw * 0.6 + w * 2)} ${r(my + 4)} ${r(x1 + w * 2.4)} ${r(y1)}" stroke="#e2d2a2" stroke-width=".45" fill="none" opacity=".45"/>`;
};
const bergUnter = [];
{
  /* DER TAFELBERG — Lupe: Tischtuch, Seilbahn, Schlucht */
  let k = "";
  const um = `M84 ${FUSS} L${r(SATTEL[0])} ${r(SATTEL[1])} ${glatt(kamm(96, 312)).replace(/^M[\d. ]+/, "")} L318 ${FUSS} Z`;
  S.def(`<clipPath id="${S.id("tafel")}"><path d="${um}"/></clipPath>`);
  k += `<path d="${um}" fill="${HANG}"/>`;
  k += `<g clip-path="url(#${S.id("tafel")})">`;
  /* Hang unter der Wand: Fynbos (fern/nah), warmer Glanz auf den Rücken, gewundene Rinnen, Wald am Fuß,
     die Tafelberg-Straße als feine Linie */
  k += fynbos(84, 318, TOP - 2, FUSS, 0, 0.62);
  for (const [x0, x1] of [[98, 92], [128, 120], [152, 147], [176, 168], [222, 228], [236, 243], [258, 266], [290, 300]]) k += rinne(x0, TOP + 18, x1, FUSS - 3, 1.1);
  let ruecken = "";
  for (const x of [112, 140, 164, 190, 216, 248, 280]) ruecken += `M${x} ${r(TOP + 20)}q-2 10 -4 ${r(FUSS - TOP - 26)}`;
  const STR = (x) => hy(363, 5700) + Math.sin(x / 13) * 1.4 + (x - 200) * 0.01;
  let str = "";
  for (let x = 92; x <= 312; x += 4) str += `${x === 92 ? "M" : "L"}${x} ${r(STR(x))}`;
  k += `<path d="${str}" stroke="#e9e2cf" stroke-width=".55" fill="none" opacity=".75"/><path d="${str}" stroke="#5a5a48" stroke-width=".25" fill="none" opacity=".5" transform="translate(0 .5)"/>`;
  k += wald(84, 316, FUSS - 13, FUSS);
  /* Nordwand: senkrechte Pfeiler bestimmen das Bild – breit, kantig, rechts (Nordwest) warm-golden im
     Licht, links (Ost) im Schatten, dazu Mitteltöne und dunkle Klüfte (4 Tonwerte). Die Wandhöhe läuft
     an beiden Enden aus: links knickt die Wand in die Schulter zum Devil's Peak ab. Die Schichtbänke sind
     nur feine, unterbrochene Linien. Keine Weichzeichnung. */
  const H = (x) => 23 * Math.pow(Math.sin(Math.max(0, Math.min(1, (x - 100) / 198)) * Math.PI), 0.55);
  const pfeiler = [];
  for (let x = 100; x < 298;) { const w = 4 + Math.pow(rnd(), 1.4) * 14; pfeiler.push([x, Math.min(w, 298 - x)]); x += w; }
  let wand = `M100 ${r(TOP - 4)} L298 ${r(TOP - 4)}`;
  const unten = [];
  for (let i = pfeiler.length - 1; i >= 0; i--) {
    const [x, w] = pfeiler[i], hm = H(x + w / 2), y0 = TOP + hm * (0.82 + rnd() * 0.3), st = hm * (rnd() - 0.5) * 0.25;
    unten.push([x, w, y0, st]);
    wand += ` L${r(x + w)} ${r(y0 + st)} L${r(x + w * 0.5)} ${r(y0 + st)} L${r(x + w * 0.42)} ${r(y0 - st * 0.5)} L${r(x)} ${r(y0)}`;
  }
  S.def(`<path id="${S.id("wandp")}" d="${wand} Z"/><clipPath id="${S.id("wandclip")}"><use href="#${S.id("wandp")}"/></clipPath>`);
  k += `<use href="#${S.id("wandp")}" fill="${S.lg("wand", [[0, "#f0c98c"], [0.35, "#dcab6c"], [0.75, "#bf8c58"], [1, "#94704c"]], 0, TOP - 4, 0, TOP + 24, ' gradientUnits="userSpaceOnUse"')}"/>`;
  k += `<g clip-path="url(#${S.id("wandclip")})">`;
  let schatten2 = "", mitte = "", licht = "", kluft = "", rost = "";
  for (const [x, w, y0, st] of unten) {
    const yb = r(y0 + Math.abs(st) + 1);
    schatten2 += `M${r(x)} ${r(TOP - 4)}h${r(w * 0.24)}V${yb}h${r(-w * 0.24)}z`;
    mitte += `M${r(x + w * 0.24)} ${r(TOP - 4)}h${r(w * 0.36)}V${yb}h${r(-w * 0.36)}z`;
    licht += `M${r(x + w * 0.6)} ${r(TOP - 4)}h${r(w * 0.4)}V${yb}h${r(-w * 0.4)}z`;
    kluft += `M${r(x - 0.35)} ${r(TOP - 0.4)}h.8L${r(x + 0.25)} ${yb}h-.5z`;
    if (rnd() < 0.35) rost += `M${r(x + w * 0.3)} ${r(TOP + 2)}h${r(w * 0.3)}l-.3 ${r(H(x) * 0.6)}h${r(-w * 0.22)}z`;
  }
  k += `<path d="${schatten2}" fill="#7e5a38" opacity=".55"/><path d="${mitte}" fill="#c99556" opacity=".25"/><path d="${licht}" fill="#ffd28c" opacity=".42"/><path d="${rost}" fill="#a8582e" opacity=".25"/><path d="${kluft}" fill="#32241a" opacity=".85"/>`;
  /* feine, unterbrochene Schichtlinien */
  let li = "", fu = "";
  for (const c of [3.5, 7.6, 12, 16.6]) for (let x = 100 + rnd() * 8; x < 298;) { const l = 6 + rnd() * 18, y = TOP + c + (x - 200) * 0.01; fu += `M${r(x)} ${r(y)}h${r(l)}`; li += `M${r(x)} ${r(y - 0.45)}h${r(l)}`; x += l + 3 + rnd() * 10; }
  k += `<path d="${li}" stroke="#ffe9bf" stroke-width=".35" opacity=".55"/><path d="${fu}" stroke="#4a3624" stroke-width=".4" opacity=".45"/>`;
  /* Rinnen als V-Kerben: links Schattenseite, rechts im Licht; die Platteklip-Schlucht am tiefsten */
  const PX = 205;
  for (const [x, w, t] of [[128, 2, 0.75], [152, 1.6, 0.6], [176, 2.2, 0.8], [PX, 4.2, 1], [236, 1.8, 0.65], [258, 2.4, 0.85], [276, 1.6, 0.55]]) {
    const yb = TOP + H(x) + 3;
    k += `<path d="M${r(x - w)} ${r(TOP - 0.6)}L${x} ${r(TOP - 0.6)}L${r(x + 0.2)} ${r(yb)}Z" fill="#2a2018" opacity="${t}"/><path d="M${x} ${r(TOP - 0.6)}L${r(x + w)} ${r(TOP - 0.6)}L${r(x + 0.2)} ${r(yb)}Z" fill="#9a7a52" opacity="${r(t * 0.8)}"/>`;
  }
  k += `</g>`;
  /* Schutt und Felsbrocken unter der Wand, Schuttfächer unter den Rinnen (Grau und Fynbos-Grün) */
  for (const [x, f] of [[PX, 1], [176, 0.6], [258, 0.7], [128, 0.5]]) {
    const yb = TOP + H(x) + 2;
    k += `<path d="M${r(x - 1)} ${r(yb)}L${r(x - 7 * f)} ${r(yb + 11 * f)}Q${x} ${r(yb + 13 * f)} ${r(x + 7 * f)} ${r(yb + 11 * f)}L${r(x + 1.4)} ${r(yb)}Z" fill="${S.lg("schutt", [[0, "#8d8878", 0.85], [0.6, "#6b7350", 0.5], [1, "#6b7350", 0]])}"/>`;
  }
  let bro = "";
  for (let i = 0; i < 34; i++) { const x = 106 + rnd() * 186, y = TOP + H(x) + 1 + rnd() * 6, w = 0.5 + rnd() * 1.2; bro += `M${r(x - w)} ${r(y)}l${r(w * 0.3)} ${r(-w * 0.8)} ${r(w * 1.1)} ${r(-w * 0.2)} ${r(w * 0.6)} ${r(w * 0.7)}z`; }
  k += `<path d="${bro}" fill="#a39c88"/><path d="${bro}" fill="none" stroke="#5f5848" stroke-width=".18"/>`;
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
  /* DAS TISCHTUCH: Die Wolke liegt als weich gewelltes Polster auf dem Plateau (oben 2–3 sanfte Buckel,
     an den Enden stumpf und ausfransend). Ihre Vorderkante fällt als zusammenhängender, dicker Wulst über
     die Kante: oben deckend, 30–45 % der Wandhöhe tief, in den Rinnen tiefer (Platteklip ≈ 55 %), unten
     wellig und weich auslaufend. Darunter treiben abgerissene Fetzen mit dem Wind schräg nach rechts
     unten. Vorderseite warm-weiß (Sonne), Unterseiten hellgrau-blau. */
  const T0 = 104, T1 = 290;
  const dick = (x) => Math.sin(Math.max(0, Math.min(1, (x - T0) / (T1 - T0))) * Math.PI);
  const decke = [[T0 - 2, TOP + 1], [T0 + 1, TOP - 1.6], [T0 + 6, TOP - 3.2]];
  for (let x = T0 + 14; x < T1 - 8; x += 10) decke.push([x, TOP - 3.6 - 2.2 * Math.pow(Math.sin((x - T0) / (T1 - T0) * Math.PI * 2.6), 2) - 1.2 * dick(x)]);
  decke.push([T1 - 6, TOP - 3], [T1 - 1, TOP - 1.4], [T1 + 2, TOP + 1]);
  let tuch = `<path d="${glatt(decke)}Z" fill="${S.lg("decke", [[0, "#ffffff"], [0.6, "#f4f6f8"], [1, "#d9e1ea"]])}" filter="url(#${S.id("fein")})"/>`;
  /* ausfransende Enden */
  tuch += `<g fill="#ffffff" opacity=".8" filter="url(#${S.id("fein")})"><ellipse cx="${T0 - 1}" cy="${r(TOP - 0.4)}" rx="2.6" ry="1.4"/><ellipse cx="${T0 - 4}" cy="${r(TOP + 1)}" rx="1.6" ry=".9"/><ellipse cx="${T1 + 1}" cy="${r(TOP - 0.2)}" rx="2.4" ry="1.3"/><ellipse cx="${T1 + 4}" cy="${r(TOP + 1.4)}" rx="1.4" ry=".8"/></g>`;
  const HW = (x) => 23 * Math.pow(Math.sin(Math.max(0, Math.min(1, (x - 100) / 198)) * Math.PI), 0.55);
  const rinnen = [[128, 0.1], [152, 0.08], [176, 0.1], [205, 0.18], [236, 0.08], [258, 0.1], [276, 0.07]];
  const tiefe = (x) => HW(x) * (0.36 + rinnen.reduce((a, [g, f]) => a + f * Math.exp(-Math.pow((x - g) / 3.6, 2)), 0) + Math.sin(x * 0.37) * 0.04);
  const saum = [];
  for (let x = T1 - 2; x >= T0 + 2; x -= 2.5) saum.push([x, TOP + tiefe(x) * Math.min(1, dick(x) * 2.5)]);
  const vorhang = (f, id, stops, filt) => {
    const sm = saum.map(([x, y]) => [x, TOP + (y - TOP) * f]);
    return `<path d="M${T0 + 1} ${r(TOP - 1.8)}L${T1 - 1} ${r(TOP - 1.8)}L${r(sm[0][0])} ${r(sm[0][1])}${glatt(sm).replace(/^M[-\d. ]+/, "")}Z" fill="${S.lg(id, stops, 0, TOP - 2, 0, TOP + 12 * f, ' gradientUnits="userSpaceOnUse"')}" filter="url(#${S.id(filt)})"/>`;
  };
  /* äußere, weich auslaufende Lage, dann der dichte Wulst */
  tuch += vorhang(1.18, "schleier", [[0, "#ffffff", 0.9], [0.7, "#eef2f6", 0.55], [1, "#e8eef4", 0]], "wolke");
  tuch += vorhang(1, "wulst", [[0, "#fffaf0", 0.97], [0.65, "#fbf6ee", 0.95], [0.88, "#edf0f3", 0.88], [1, "#e2e8ee", 0.6]], "fein");
  /* Rollkante: helle, sonnige Wölbung, darunter leichter Eigenschatten */
  tuch += `<path d="M${T0 + 6} ${r(TOP + 0.4)}Q197 ${r(TOP + 2.2)} ${T1 - 6} ${r(TOP + 0.4)}" stroke="#fff8ea" stroke-width="1.8" fill="none" filter="url(#${S.id("fein")})"/><path d="M${T0 + 12} ${r(TOP + 3.4)}Q197 ${r(TOP + 6)} ${T1 - 12} ${r(TOP + 3.4)}" stroke="#c6d0dc" stroke-width="1.1" fill="none" opacity=".45" filter="url(#${S.id("fein")})"/>`;
  /* abgerissene Fetzen, schräg nach rechts unten treibend (Wind aus Südost) */
  S.def(`<linearGradient id="${S.id("fetzen")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#eef2f6"/><stop offset="1" stop-color="#bfcadb"/></linearGradient>`);
  let fe = "";
  for (const [x, y, w] of [[146, TOP + 20, 7], [180, TOP + 25, 4.5], [214, TOP + 27, 8.5], [244, TOP + 22, 5.5], [268, TOP + 18, 3.5], [196, TOP + 31, 3]]) fe += `<path d="M${x - w} ${r(y)}q${r(w * 0.3)} ${r(-w * 0.34)} ${r(w * 0.9)} ${r(-w * 0.3)}q${r(w * 0.5)} ${r(-w * 0.25)} ${r(w * 0.9)} ${r(w * 0.05)}q${r(w * 0.3)} ${r(w * 0.3)} ${r(0.2 * w)} ${r(w * 0.42)}q${r(-w)} ${r(w * 0.12)} ${r(-2 * w)} ${r(-w * 0.17)}z" transform="rotate(14 ${x} ${r(y)})"/>`;
  tuch += `<g fill="url(#${S.id("fetzen")})" opacity=".78" filter="url(#${S.id("fein")})">${fe}</g>`;
  /* dünne Fahnen über dem Sattel und am Kloof Nek */
  tuch += `<g filter="url(#${S.id("wolke")})" opacity=".55" fill="#ffffff"><ellipse cx="98" cy="${r(SATTEL[1] - 2)}" rx="6" ry="1.8"/><ellipse cx="296" cy="${r(TOP + 7)}" rx="6" ry="2.2"/></g>`;
  k += tuch;
  bergUnter.push(
    { id: "tischtuch", de: "das Tischtuch", syl: "TISCH-tuch", it: "la tovaglia", itSyl: "to-VA-glia", en: "tablecloth", x: 197, y: TOP + 8,
      kunst: flaeche(-88, -16, 176, 14), tipp: "Bläst der Südostwind, legt sich eine Wolke wie ein Tischtuch auf den Tafelberg und fällt über die Kante." },
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
  /* Ostflanke im Schatten, Nordwestflanke warm: weicher waagerechter Verlauf statt harter Flächen */
  k += `<rect x="-4" y="70" width="104" height="${FUSS - 70}" fill="${S.lg("devillicht", [[0, "#2f3828", 0.3], [0.34, "#2f3828", 0], [0.52, "#ffd89a", 0.1], [0.8, "#ffd89a", 0]], -4, 0, 100, 0, ' gradientUnits="userSpaceOnUse"')}"/>`;
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
  S.teil({ id: "devils_peak", de: "der Devil's Peak", syl: "DE-wils-PIIK", it: "il Devil's Peak", itSyl: "DE-vils PIK", en: "Devil's Peak", x: 0, y: 0, kunst: k,
    tipp: "Devil's Peak heißt „Teufelsspitze“. Die Sage erzählt: Jan van Hunks rauchte hier mit dem Teufel um die Wette – ihr Rauch ist das Tischtuch." });
}
{
  /* LION'S HEAD: steiler Zuckerhut, oben nackter Sandstein mit Bänken und Rissen; rechts der Rücken zum Signal Hill */
  let k = "";
  const um = `M318 ${FUSS} L${r(NEK[0])} ${r(NEK[1])} ${glatt(kamm(312, 404)).replace(/^M[\d. ]+/, "")} L404 ${FUSS} Z`;
  S.def(`<clipPath id="${S.id("loewe")}"><path d="${um}"/></clipPath>`);
  k += `<path d="${um}" fill="${HANG}"/>`;
  k += `<g clip-path="url(#${S.id("loewe")})">`;
  k += `<rect x="312" y="84" width="92" height="${FUSS - 84}" fill="${S.lg("loewelicht", [[0, "#2f3828", 0.22], [0.5, "#2f3828", 0], [0.7, "#ffd89a", 0.05], [1, "#ffd89a", 0.12]], 312, 0, 404, 0, ' gradientUnits="userSpaceOnUse"')}"/>`;
  /* Felskopf: die obersten ≈ 150 m nackter Sandstein, hoch und schmal, stumpfer Zahn mit kleiner Schulter
     links. Unregelmäßige Grenze zum Fynbos mit Felsbrocken; waagerechte, mit dem Hang fallende Bänke,
     einzelne senkrechte Risse; links Schatten, rechts warmes Licht */
  const gy = (x) => 103.2 - Math.sin((x - 343) / 40 * Math.PI) * 2.4;
  const gpts = [[343, 104.6], [347, gy(347) + 0.2], [351, gy(351) - 0.8], [355, gy(355) + 0.3], [359, gy(359) + 1.1], [363, gy(363) + 0.2], [367, gy(367) - 0.6], [371, gy(371) + 0.4], [375, gy(375) + 1.3], [379, gy(379) + 0.6], [383, 105]];
  const kopf = `${glatt(gpts)} L384 84 L342 84 Z`;
  S.def(`<path id="${S.id("kopfp")}" d="${kopf}"/><clipPath id="${S.id("kopfclip")}"><use href="#${S.id("kopfp")}"/></clipPath>`);
  k += `<use href="#${S.id("kopfp")}" fill="${S.lg("loewekopf", [[0, "#6c665a"], [0.4, "#958c78"], [0.75, "#cdbd98"], [1, "#e0cba0"]], 346, 0, 382, 0, ' gradientUnits="userSpaceOnUse"')}"/>`;
  k += `<g clip-path="url(#${S.id("kopfclip")})">`;
  let bae = "", bal = "";
  for (let c = 93; c < 105; c += 2.2) { bae += `M340 ${r(c - 1.6)}L386 ${r(c + 2.2)}`; bal += `M340 ${r(c - 2.2)}L386 ${r(c + 1.6)}`; }
  k += `<path d="${bal}" stroke="#f2e2bc" stroke-width=".4" opacity=".55"/><path d="${bae}" stroke="#4f4a40" stroke-width=".45" opacity=".6"/>`;
  k += `<path d="M361 92l-.4 3.6.4 3.2M366.4 91.6l.3 4-.3 3.4M371.4 96.4l.5 4.2M356.6 98.8l-.3 4M376.6 101.4l.3 3" stroke="#3f3a32" stroke-width=".35" fill="none" opacity=".65"/>`;
  k += `</g>`;
  /* Felsbrocken am Übergang */
  let bro = "";
  /* Brocken in drei Größen, unregelmäßig verstreut; Felszungen reichen in den Fynbos hinab */
  for (let i = 0; i < 16; i++) { const x = 344 + rnd() * 38, y = 102.5 + rnd() * 7, w = [0.4, 0.8, 1.5][i % 3] * (0.7 + rnd() * 0.6); bro += `M${r(x - w)} ${r(y)}l${r(w * 0.3)} ${r(-w * (0.6 + rnd() * 0.5))} ${r(w * 0.9)} ${r(-w * 0.2)} ${r(w * 0.7)} ${r(w * 0.5)} ${r(w * 0.1)} ${r(w * 0.7)}z`; }
  for (const [x, l] of [[352, 4], [364, 6], [376, 3.5]]) bro += `M${x - 1.2} 103.4l.4 ${l}l1.6 -${r(l * 0.4)}l.4 -${r(l * 0.6)}z`;
  k += `<path d="${bro}" fill="#a29a84"/><path d="${bro}" fill="none" stroke="#5f584a" stroke-width=".2"/>`;
  k += fynbos(312, 404, 104, FUSS, 60, 0.5);
  k += `<path d="M326 120 Q344 112 360 110.6 Q374 110 386 106" stroke="#d1c39c" stroke-width=".35" fill="none" stroke-dasharray="1 .9" opacity=".45"/>`;
  for (const [x0, y0, x1, y1] of [[350, 108, 340, 126], [370, 108, 374, 126], [388, 108, 398, 124]]) k += rinne(x0, y0, x1, y1, 1);
  k += wald(312, 404, FUSS - 10, FUSS, 30);
  k += `</g>`;
  k += `<path d="${glatt(kamm(362, 404))}" stroke="#ead9b0" stroke-width=".6" fill="none" opacity=".7"/>`;
  S.teil({ id: "lions_head", de: "der Lion's Head", syl: "LAI-ens-HED", it: "il Lion's Head", itSyl: "LA-ions HED", en: "Lion's Head", x: 0, y: 0, kunst: k,
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
  /* Wohnviertel: Häuserreihen entlang der Hangstraßen als Musterkacheln – kleine, scharfe Flachdächer
     (einige rote Blechdächer), Bäume dazwischen; nach hinten (oben) kleiner und blasser */
  const hausKachel = (id, f) => S.def(`<pattern id="${S.id(id)}" width="12" height="3" patternUnits="userSpaceOnUse"><g opacity="${f}">` +
    `<rect x="0" y=".9" width="2.4" height="2.1" fill="#f3efe6"/><rect x="-.1" y=".7" width="2.6" height=".3" fill="#ffffff"/><rect x="1.4" y="1.6" width=".5" height=".5" fill="#3e4a55"/>` +
    `<rect x="2.9" y="1.3" width="2" height="1.7" fill="#e6dcc6"/><rect x="2.8" y="1.05" width="2.2" height=".35" fill="#9a5440"/>` +
    `<rect x="5.3" y=".6" width="2.6" height="2.4" fill="#f6f3ec"/><rect x="5.2" y=".4" width="2.8" height=".3" fill="#ffffff"/><rect x="6.6" y="1.3" width=".5" height=".5" fill="#3e4a55"/><rect x="5.9" y="2.1" width=".5" height=".5" fill="#3e4a55"/>` +
    `<circle cx="8.9" cy="1.7" r="1.3" fill="#3f5a30"/><circle cx="9.7" cy="2.2" r="1" fill="#4f6a3a"/>` +
    `<rect x="10.4" y="1.2" width="1.6" height="1.8" fill="#ddd2bd"/><rect x="10.3" y="1" width="1.8" height=".3" fill="#6f7276"/>` +
    `<path d="M0 .9h.5v2.1H0zM2.9 1.3h.4V3h-.4zM5.3 .6h.5V3h-.5z" fill="#000" opacity=".12"/></g></pattern>`);
  hausKachel("haus", 1); hausKachel("hausfern", 0.62);
  /* zweite Kachel: Häuser mit roten und grauen Satteldächern */
  S.def(`<pattern id="${S.id("hausdach")}" width="13" height="3.2" patternUnits="userSpaceOnUse"><rect x=".2" y="1.4" width="2.6" height="1.8" fill="#efe8da"/><path d="M0 1.5l1.5-1 1.5 1z" fill="#a24a36"/><rect x="3.4" y="1.2" width="2.2" height="2" fill="#f5f1e8"/><path d="M3.2 1.3l1.3-.9 1.3.9z" fill="#6f7276"/><circle cx="7.4" cy="2" r="1.3" fill="#40592f"/><rect x="9" y="1" width="3" height="2.2" fill="#e9e1cf"/><rect x="8.9" y=".8" width="3.2" height=".3" fill="#fbf9f4"/><rect x="10" y="1.6" width=".5" height=".5" fill="#3e4a55"/><path d="M.2 1.4h.5v1.8h-.5zM3.4 1.2h.4v2h-.4z" fill="#000" opacity=".12"/></pattern>`);
  S.def(`<pattern id="${S.id("hausdachfern")}" href="#${S.id("hausdach")}"/>`);
  let h = "", nr = 0;
  /* Reihen: [x0, x1, y unten, Maßstab, Kachel]; jede Reihe mit eigener Musterkopie (Maßstab, Versatz) */
  /* nach hinten deutlich kleiner und blasser; die Reihen wechseln zwischen Flach- und Satteldächern */
  for (const [x0, x1, yb, sc, id, op] of [[96, 236, 128.6, 0.38, "hausfern", 0.7], [96, 236, 130.8, 0.5, "hausdach", 0.7], [96, 236, 133.6, 0.66, "hausfern", 0.85], [96, 236, 136.4, 0.82, "hausdach", 1], [96, 236, 139.4, 1, "haus", 1], [292, 400, 127.6, 0.42, "hausdach", 0.7], [292, 400, 130.2, 0.56, "hausfern", 0.8], [292, 400, 133.4, 0.72, "hausdach", 0.9], [292, 400, 136.4, 0.86, "haus", 1], [292, 400, 139.4, 1, "hausdach", 1], [236, 292, 139.6, 1, "haus", 1]]) {
    const hh = 3 * sc, pid = S.id("hr" + nr++);
    S.def(`<pattern id="${pid}" href="#${S.id(id)}" patternTransform="translate(${r(rnd() * 12)} ${r(yb - hh)}) scale(${sc})"/>`);
    h += `<path d="M${x0} ${r(yb)}V${r(yb - hh)}H${x1}V${r(yb)}Z" fill="url(#${pid})" opacity="${op}"/>`;
  }
  /* Straßen, die schräg den Hang hinauflaufen */
  let strassen = "";
  for (const x of [108, 134, 160, 188, 214, 304, 330, 356, 384]) strassen += `M${x} 140l${r(9 + (x % 7))} -13`;
  h += `<path d="${strassen}" stroke="#d9d1bd" stroke-width=".7" opacity=".75"/><path d="${strassen}" stroke="#8f8a78" stroke-width=".2" opacity=".5" transform="translate(.4 0)"/>`;
  /* Bo-Kaap: knallbunte Flachdachhäuser in Reihen am Hang zum Signal Hill, Minarett der Auwal-Moschee */
  S.def(`<pattern id="${S.id("bokaap")}" width="16.4" height="2.6" patternUnits="userSpaceOnUse" patternTransform="translate(236 0) skewY(-4)">` +
    [["#e8608e", 0, 2.2], ["#f4efe6", 2.4, 2], ["#4fc0c2", 4.6, 2.4], ["#f2c43a", 7.2, 2], ["#a3cf58", 12, 2], ["#b88ad6", 14.2, 2]].map(([f, x, w]) => `<rect x="${x}" y=".7" width="${w}" height="1.9" fill="${f}"/><rect x="${r(x - 0.1)}" y=".45" width="${r(w + 0.2)}" height=".3" fill="#fbf8f0"/><rect x="${r(x + w * 0.35)}" y="1.3" width=".5" height=".7" fill="#2f3a44" opacity=".6"/>`).join("") + `<circle cx="10.4" cy="1.6" r="1.2" fill="#4f6a3a"/></pattern>`);
  let bk = "";
  for (let row = 0; row < 4; row++) {
    const xa = 236 + row * 2.2, xb = 288 - row, ya = 131.6 + row * 2.4;
    bk += `<path d="M${r(xa)} ${r(ya)}L${r(xa)} ${r(ya - 2.6)}L${r(xb)} ${r(ya - 2.6 - (xb - xa) * 0.07)}L${r(xb)} ${r(ya - (xb - xa) * 0.07)}Z" fill="url(#${S.id("bokaap")})"/>`;
  }
  bk += `<rect x="262" y="122.6" width="1" height="5.4" fill="#f3efe6"/><path d="M261.8 122.6 L262.5 120.8 L263.2 122.6 Z" fill="#6aa86a"/>`;
  k += h + bk;
  /* Hochhäuser der Innenstadt (links): Luftperspektive – hell, bläulich; Fensterbänder mit Spiegelung */
  S.def(`<pattern id="${S.id("fenster")}" width="4" height="1.8" patternUnits="userSpaceOnUse"><rect width="4" height=".7" fill="#6f8796" opacity=".38"/><rect width="4" height=".25" y=".7" fill="#ffffff" opacity=".3"/></pattern>`);
  const tuerme = [[4, 7, 12, "#d3dde3"], [13, 9, 18, "#c9d5dc"], [24, 6, 22, "#d8e1e6"], [31, 10, 15, "#cfd9df"], [53, 9, 20, "#c6d2da"], [64, 6, 24, "#d5dee4"], [71, 11, 13, "#ccd7de"], [84, 8, 17, "#d1dbe1"], [94, 6, 11, "#d8e0e4"], [140, 7, 9, "#d3dde3"], [150, 9, 7, "#cfd9df"]];
  let tk = "", sch = "", fe = "";
  for (const [x, w, hh, f] of tuerme) {
    const y0 = HOR - 3 - hh;
    tk += `<rect x="${x}" y="${r(y0)}" width="${w}" height="${r(hh + 3)}" fill="${f}"/>`;
    sch += `M${x} ${r(y0)}h${r(w * 0.35)}V${HOR}h${r(-w * 0.35)}z`;
    fe += `M${x + 0.5} ${r(y0 + 1.4)}h${w - 1}V${HOR - 2}h${1 - w}z`;
  }
  /* Portside Tower (139 m, höchstes Haus der Stadt) mit abgestufter Krone und Mast */
  const PT = hy(139, 1500);
  const GLASD = S.lg("glasdunkel", [[0, "#5d7891"], [0.5, "#7d98ae"], [1, "#4d6478"]], 0, 0, 1, 0);
  tk += `<path d="M42 ${HOR}V${r(PT + 4)}h1.4V${r(PT + 2)}h1.4V${r(PT)}h4.4V${r(PT + 2)}h1.4V${r(PT + 4)}h1.4V${HOR}Z" fill="${GLASD}"/><path d="M47 ${r(PT)}v-4" stroke="#8fa4b6" stroke-width=".4"/>`;
  tk += `<path d="M42 ${r(PT + 14)}l10 -6v5l-10 6z" fill="#cfe2f2" opacity=".35"/><path d="M45.6 ${r(PT + 2)}h1.6V${HOR}h-1.6z" fill="#a9c4da" opacity=".3"/>`;
  tk += `<rect x="64" y="${r(HOR - 27)}" width="7" height="27" fill="${GLASD}"/><path d="M64 ${r(HOR - 18)}l7 -5v4l-7 5z" fill="#cfe2f2" opacity=".35"/>`;
  sch += `M42 ${r(PT + 4)}h2.6V${HOR}H42z`;
  fe += `M42.6 ${r(PT + 5)}h8.8V${HOR - 2}h-8.8z`;
  k += tk + `<path d="${sch}" fill="#7f909c" opacity=".22"/><path d="${fe}" fill="url(#${S.id("fenster")})"/>`;
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
  /* Drehbrücke: schlanke weiße Fachwerk-Fußgängerbrücke vom Turmkai nach rechts hinüber zum Kai der
     Hafenhallen, Drehpfeiler unter dem linken Ende */
  const BA = [174, TURM.y - 0.4], BB = [206, Y_HALLE - 0.3], bl = (t, dy) => `${r(BA[0] + (BB[0] - BA[0]) * t)} ${r(BA[1] + (BB[1] - BA[1]) * t + dy * (1 - t * 0.5))}`;
  q += `<path d="M${bl(0, 0)}L${bl(1, 0)}L${bl(1, 0.9)}L${bl(0, 0.9)}Z" fill="#e9ecee"/>`;
  let fw = `M${bl(0, -2.6)}L${bl(1, -2.6)}`;
  for (let t = 0; t <= 1.001; t += 0.125) fw += `M${bl(t, 0)}L${bl(t, -2.6)}`;
  for (let t = 0; t < 1; t += 0.25) fw += `M${bl(t, 0)}L${bl(t + 0.125, -2.6)}L${bl(t + 0.25, 0)}`;
  q += `<path d="${fw}" stroke="#f4f6f7" stroke-width=".35" fill="none"/><rect x="176" y="${r(TURM.y + 0.5)}" width="3" height="${r(Wl - TURM.y - 0.5)}" fill="#a9a59c"/>`;
  /* Spaziergänger auf dem Turmkai (≈ 1,7 m), Farben und Schritte verschieden */
  for (const [x, f, schritt] of [[80, "#c0392b", 1], [88, "#2f6fb6", -1], [137, "#f2c62f", 1], [146, "#3c8f5a", 0], [160, "#e58fa1", -1]]) {
    const h = 1.7 * s, y = TURM.y - 0.2;
    q += `<path d="M${x - 0.5} ${r(y)}l${r(0.5 + schritt * 0.4)} ${r(-h * 0.45)}l${r(0.5 - schritt * 0.4)} ${r(h * 0.45)}" stroke="#3a3f48" stroke-width=".5" fill="none"/><rect x="${r(x - 0.65)}" y="${r(y - h * 0.84)}" width="1.3" height="${r(h * 0.42)}" rx=".4" fill="${f}"/><circle cx="${x}" cy="${r(y - h * 0.92)}" r=".55" fill="#8a5a3c"/>`;
  }
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
  S.def(`<path id="${S.id("wasserp")}" d="M0 ${W0} L400 ${W0} L400 ${KAI} L0 ${KAI} Z M70 ${W0} L70 ${WT} L174 ${WT} L174 ${W0} Z" fill-rule="evenodd"/><clipPath id="${S.id("wasserclip")}"><use href="#${S.id("wasserp")}" clip-rule="evenodd"/></clipPath>`);
  let k = `<use href="#${S.id("wasserp")}" fill="${S.lg("wasser", [[0, "#7aa0ab"], [0.18, "#3f7480"], [1, "#1c4752"]])}"/>`;
  /* Spiegelungen als gestauchte, zerrissene Farbflächen: Uhrturm (rot mit weißen Bändern), Lagerhaus,
     Hafenhallen, Kutter, Segelboot; zerlegt durch eine Streifenmaske, nach vorn ausblendend */
  const WT0 = wy(TURM.d), WH = wy(D_HALLE), WK = wy(120);
  let sp = `<rect x="112" y="${r(WT0)}" width="12.4" height="15" fill="#b8402e"/><rect x="112" y="${r(WT0 + 3.6)}" width="12.4" height=".9" fill="#f1e6d8"/><rect x="112" y="${r(WT0 + 7.4)}" width="12.4" height=".9" fill="#f1e6d8"/><path d="M111.4 ${r(WT0 + 15)}h13.6l-6.8 6z" fill="#4a4e54"/>`;
  sp += `<rect x="262" y="${r(WH)}" width="34" height="7" fill="#b4583c"/><rect x="184" y="${r(WH)}" width="76" height="4.4" fill="#e6dfd0"/><rect x="318" y="${r(WH)}" width="82" height="4.4" fill="#e9e0cc"/><rect x="0" y="${r(WH)}" width="62" height="4.4" fill="#e2d8c4"/>`;
  sp += `<rect x="292" y="${r(WK)}" width="62" height="5.6" fill="#2a5a92"/><rect x="292" y="${r(WK + 5.6)}" width="60" height="2.2" fill="#8c2a22"/><rect x="328" y="${r(WK + 7.8)}" width="16" height="6" fill="#f3f1ea"/>`;
  sp += `<rect x="186" y="${r(wy(190))}" width="22" height="3" fill="#fbfbfa"/><rect x="195.6" y="${r(wy(190) + 3)}" width=".7" height="16" fill="#e6e8ea"/>`;
  let mk = "";
  for (let y = WH - 0.2; y < 210;) {
    const h = 0.55 + (y - 146) * 0.03, gap = 0.14 + (y - 146) * 0.04;
    for (let x = rnd() * 4; x < 396;) { const l = Math.min(3 + rnd() * (12 + (y - 146) * 0.3), 399 - x); mk += `M${r(x)} ${r(y)}h${r(l)}v${r(h)}h${r(-l)}z`; x += l + 0.3 + rnd() * (0.6 + (y - 146) * 0.15); }
    y += h + gap;
  }
  S.def(`<mask id="${S.id("spmaske")}" maskUnits="userSpaceOnUse" x="0" y="140" width="400" height="76"><path d="${mk}" fill="${S.lg("spfade", [[0, "#fff"], [0.4, "#ccc"], [1, "#000"]], 0, 146, 0, 196, ' gradientUnits="userSpaceOnUse"')}"/></mask>`);
  k += `<g mask="url(#${S.id("spmaske")})" opacity=".62"><g filter="url(#${S.id("spiegel")})">${sp}</g></g>`;
  /* Böenfelder: der Südost kräuselt das Wasser streifenweise, dunklere Felder laufen schräg übers Becken */
  let boe = "";
  for (const [x, y, w, h] of [[30, 160, 120, 7], [210, 168, 150, 9], [60, 186, 170, 12], [250, 196, 150, 12], [150, 152, 90, 4]]) boe += `M${x} ${y}l${w} ${r(-h * 0.5)}l${r(w * 0.12)} ${h}l${-w} ${r(h * 0.5)}z`;
  k += `<g clip-path="url(#${S.id("wasserclip")})"><path d="${boe}" fill="#0e3440" opacity=".2" filter="url(#bw_weich)"/></g>`;
  /* Wellen: einzelne Bögen, hinten klein, flach und dicht, vorn breiter und locker; Länge und Abstand
     streuen; wenige Schaumköpfchen */
  let wl = "";
  const W1 = WH + 0.6;
  for (const [y0, y1, sw, op1] of [[W1, 154, 0.22, 0.3], [154, 168, 0.32, 0.38], [168, 186, 0.45, 0.45], [186, 214, 0.62, 0.5]]) {
    let dk = "", hl = "";
    for (let y = y0; y < y1;) {
      const L = 0.9 + (y - 144) * 0.17;
      for (let x = rnd() * L * 2; x < 398;) {
        const l = Math.min(L * (0.6 + 0.8 * rnd()), 399.5 - x), hh = l * (0.1 + rnd() * 0.07);
        if (l < 0.8) break;
        if (rnd() < 0.68) dk += `M${r(x)} ${r(y)}q${r(l / 2)} ${r(hh)} ${r(l)} 0`; else hl += `M${r(x)} ${r(y)}q${r(l / 2)} ${r(-hh)} ${r(l)} 0`;
        x += l * (1.1 + 1.7 * rnd());
      }
      y += 0.5 + (y - 144) * 0.06 + rnd() * 0.4;
    }
    wl += `<path d="${dk}" stroke="#123a44" stroke-width="${sw}" fill="none" opacity="${op1 + 0.12}"/><path d="${hl}" stroke="#cfe6e8" stroke-width="${sw}" fill="none" opacity="${op1}"/>`;
  }
  for (let i = 0; i < 14; i++) { const y = 160 + rnd() * 48, x = rnd() * 380, w = 1 + (y - HOR) * 0.08; wl += `<path d="M${r(x)} ${r(y)} q${r(w)} ${r(-w * 0.5)} ${r(w * 2)} 0" stroke="#ffffff" stroke-width="${r(0.3 + (y - HOR) * 0.008)}" fill="none" opacity=".8"/>`; }
  k += `<g clip-path="url(#${S.id("wasserclip")})">${wl}</g>`;
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
  /* Kap-Pelzrobbe (Ohrenrobbe) in Seitenansicht, Blick nach rechts (dir = −1 spiegelt): Torpedokörper,
     Brust auf den Vorderflossen aufgerichtet, langer, biegsamer Hals (hals = 0 … 1), kleiner Kopf mit
     spitzer Schnauze, kleines Ohr, Schnurrhaare; Hinterflossen nach vorn unter den Körper gedreht;
     Glanzkante auf dem Rücken */
  const robbe = (x, y, l, hals, dir, nass) => {
    const q = (n) => r(n * s * l);
    const fell = nass ? S.rg("robbenass", [[0, "#5a4636"], [0.5, "#33261c"], [1, "#1a130d"]], 0.45, 0.25, 0.85) : S.rg("robbetrocken", [[0, "#b8926a"], [0.55, "#8a6848"], [1, "#4a3828"]], 0.45, 0.25, 0.85);
    const hx = 0.5 + 0.06 * hals, hy = -0.46 - 0.3 * hals;   // Kopfmitte
    let g2 = `<g transform="translate(${g(x)} ${g(y)}) scale(${dir} 1)">`;
    /* Hinterflossen nach vorn gedreht */
    g2 += `<path d="M${q(-0.66)} ${q(-0.05)}Q${q(-0.5)} ${q(0.02)} ${q(-0.3)} ${q(0.02)}L${q(-0.28)} ${q(-0.03)}Q${q(-0.44)} ${q(-0.07)} ${q(-0.56)} ${q(-0.13)}ZM${q(-0.6)} ${q(-0.03)}Q${q(-0.46)} ${q(0.03)} ${q(-0.36)} ${q(0.03)}" fill="#2a2018" stroke="#2a2018" stroke-width="${q(0.02)}"/>`;
    /* Körper (Torpedo) mit Hals und Kopf in einem Umriss */
    g2 += `<path d="M${q(-0.78)} ${q(-0.04)}Q${q(-0.76)} ${q(-0.2)} ${q(-0.48)} ${q(-0.25)}Q${q(-0.12)} ${q(-0.3)} ${q(0.12)} ${q(-0.34)}Q${q(0.3)} ${q(-0.38)} ${q(hx - 0.14)} ${q(hy + 0.04)}Q${q(hx - 0.08)} ${q(hy - 0.08)} ${q(hx + 0.04)} ${q(hy - 0.08)}Q${q(hx + 0.14)} ${q(hy - 0.07)} ${q(hx + 0.27)} ${q(hy + 0.02)}Q${q(hx + 0.2)} ${q(hy + 0.07)} ${q(hx + 0.06)} ${q(hy + 0.08)}Q${q(hx - 0.04)} ${q(hy + 0.12)} ${q(hx - 0.06)} ${q(hy + 0.2)}Q${q(0.36)} ${q(-0.2)} ${q(0.28)} ${q(-0.06)}Q${q(0.22)} ${q(0)} ${q(0.12)} 0L${q(-0.6)} 0Z" fill="${fell}"/>`;
    /* Vorderflosse lang und flach, aufgestützt */
    g2 += `<path d="M${q(0.14)} ${q(-0.26)}Q${q(0.24)} ${q(-0.1)} ${q(0.38)} ${q(0.01)}L${q(0.18)} ${q(0.02)}Q${q(0.12)} ${q(-0.1)} ${q(0.06)} ${q(-0.2)}Z" fill="#2a2018"/>`;
    /* Auge, Nase, Ohr, Schnurrhaare */
    g2 += `<circle cx="${q(hx + 0.03)}" cy="${q(hy - 0.02)}" r="${q(0.026)}" fill="#0b0806"/><circle cx="${q(hx + 0.038)}" cy="${q(hy - 0.028)}" r="${q(0.009)}" fill="#fff"/><circle cx="${q(hx + 0.25)}" cy="${q(hy + 0.02)}" r="${q(0.018)}" fill="#0b0806"/>`;
    g2 += `<path d="M${q(hx - 0.08)} ${q(hy - 0.05)}l${q(-0.03)} ${q(-0.06)} ${q(0.045)} ${q(0.025)}" stroke="#2b2119" stroke-width="${q(0.025)}" fill="none"/>`;
    g2 += `<path d="M${q(hx + 0.2)} ${q(hy + 0.04)}l${q(0.2)} ${q(0.01)}M${q(hx + 0.2)} ${q(hy + 0.05)}l${q(0.18)} ${q(0.07)}M${q(hx + 0.19)} ${q(hy + 0.06)}l${q(0.13)} ${q(0.12)}" stroke="#efe6d4" stroke-width="${q(0.01)}" opacity=".9"/>`;
    /* Glanzkante (nasses Fell glänzt stärker) */
    g2 += `<path d="M${q(-0.6)} ${q(-0.24)}Q${q(-0.1)} ${q(-0.33)} ${q(0.2)} ${q(-0.38)}Q${q(hx - 0.2)} ${q(hy + 0.06)} ${q(hx - 0.06)} ${q(hy - 0.06)}" stroke="${nass ? "#d8c4a8" : "#f0dcbc"}" stroke-width="${q(0.03)}" fill="none" opacity="${nass ? 0.75 : 0.55}"/>`;
    return g2 + `</g>`;
  };
  k += robbe(-1.5, -0.74, 1.1, 0.2, 1, false) + robbe(1.4, -0.74, 1.15, 1, -1, true) + robbe(0.1, -0.76, 1, 0.7, 1, false);
  /* eine Robbe schwimmt daneben: Kopf mit spitzer Schnauze, Ohr, Schnurrhaaren, nasser Glanz, Wellenring */
  const SW = [4.8, 0.05];
  k += `<g transform="translate(${g(SW[0])} ${g(SW[1])})">`;
  k += `<ellipse cx="0" cy="${g(0.08)}" rx="${g(0.9)}" ry="${g(0.16)}" fill="none" stroke="#e2f0f0" stroke-width=".45" opacity=".8"/><ellipse cx="0" cy="${g(0.08)}" rx="${g(1.4)}" ry="${g(0.24)}" fill="none" stroke="#e2f0f0" stroke-width=".3" opacity=".45"/>`;
  k += `<path d="M${g(-0.32)} ${g(0.06)}Q${g(-0.34)} ${g(-0.3)} ${g(-0.08)} ${g(-0.4)}Q${g(0.16)} ${g(-0.44)} ${g(0.3)} ${g(-0.33)}L${g(0.58)} ${g(-0.24)}Q${g(0.52)} ${g(-0.18)} ${g(0.3)} ${g(-0.15)}Q${g(0.26)} ${g(0)} ${g(0.26)} ${g(0.06)}Z" fill="#2c2119"/>`;
  k += `<path d="M${g(-0.24)} ${g(-0.2)}Q${g(-0.14)} ${g(-0.38)} ${g(0.12)} ${g(-0.4)}" stroke="#bfa98a" stroke-width="${g(0.03)}" fill="none" opacity=".8"/>`;
  k += `<circle cx="${g(0.14)}" cy="${g(-0.3)}" r="${g(0.032)}" fill="#000"/><circle cx="${g(0.152)}" cy="${g(-0.31)}" r="${g(0.01)}" fill="#fff"/><circle cx="${g(0.55)}" cy="${g(-0.23)}" r="${g(0.02)}" fill="#000"/><path d="M${g(-0.12)} ${g(-0.38)} l${g(-0.05)} ${g(-0.08)}" stroke="#2c2119" stroke-width="${g(0.03)}"/>`;
  k += `<path d="M${g(0.46)} ${g(-0.2)} l${g(0.24)} ${g(0.03)} M${g(0.46)} ${g(-0.19)} l${g(0.22)} ${g(0.1)} M${g(0.45)} ${g(-0.18)} l${g(0.16)} ${g(0.15)}" stroke="#efe6d4" stroke-width="${g(0.012)}"/>`;
  k += `</g>` + flaeche(Number(g(SW[0])) - 9, -10, 18, 13);
  S.teil({ id: "robbe", de: "die Robbe", syl: "ROB-be", it: "la foca", itSyl: "FO-ca", en: "seal", x: X, y: Y, kunst: k,
    tipp: "Die Kap-Pelzrobben ruhen im Hafen auf einer schwimmenden Plattform – nur für sie gebaut. Nass ist ihr Fell fast schwarz, trocken hellbraun." });
}

S.lg("poller", [[0, "#1f2226"], [0.45, "#5a6066"], [1, "#16181b"]], 0, 0, 1, 0);
/* =====================================================================
   VORN — der Kai (Pierhead): Granitkante mit Pollerreihe, Fender, Leiter
   ===================================================================== */
{
  let kante = "";
  let k = `<rect x="0" y="${KAI}" width="400" height="${260 - KAI}" fill="${S.lg("kai", [[0, "#b9b2a6"], [1, "#9b9488"]])}"/>`;
  k += `<rect x="0" y="${KAI - 0.6}" width="400" height="5" fill="${S.lg("kante", [[0, "#e2ddd3"], [1, "#a39d92"]])}"/>`;
  for (let x = 0; x < 400; x += 18) k += `<line x1="${x}" y1="${KAI}" x2="${x}" y2="${KAI + 4.4}" stroke="#7d776d" stroke-width=".4"/>`;
  let p = "";
  for (let i = -22; i <= 22; i++) p += `M${r(200 + i * 9.6)} ${KAI + 4.4} L${r(200 + i * 9.6 * (260 - HOR) / (KAI + 4.4 - HOR))} 260`;
  for (const y of [222, 231, 242, 255]) p += `M0 ${y} L400 ${y}`;
  k += `<path d="${p}" stroke="#8a8478" stroke-width=".35" opacity=".7"/>`;
  /* Pfütze vom letzten Regen: spiegelt den Himmel; Schattenflecken der Schirme */
  k += `<ellipse cx="232" cy="251" rx="26" ry="3.2" fill="${S.lg("pfuetze", [[0, "#7fa9cf"], [1, "#c5d8e6"]])}" opacity=".85"/><path d="M210 251.6q22 2.6 44 0" stroke="#efeae0" stroke-width=".5" fill="none" opacity=".7"/>`;
  k += `<rect x="0" y="${KAI + 4.4}" width="400" height="${260 - KAI - 4.4}" fill="${S.lg("kailicht", [[0, "#000", 0.12], [0.3, "#000", 0], [1, "#000", 0.1]])}"/>`;
  /* Fender (schwarze Gummirollen an Ketten) und Leiter über der Kante */
  for (const x of [286, 372]) kante += `<line x1="${x}" y1="${KAI + 1}" x2="${x}" y2="${KAI - 2}" stroke="#555" stroke-width=".35"/><rect x="${x - 2.6}" y="${KAI - 2.6}" width="5.2" height="3.4" rx="1.6" fill="#1d1f22"/><rect x="${x - 2.2}" y="${KAI - 2.4}" width="4.4" height=".7" rx=".35" fill="#4a4e54"/>`;
  kante += `<path d="M232 ${KAI + 3} Q232 ${KAI - 4} 236 ${KAI - 4} Q240 ${KAI - 4} 240 ${KAI + 0.4} M244 ${KAI + 3} Q244 ${KAI - 4} 248 ${KAI - 4} Q252 ${KAI - 4} 252 ${KAI + 0.4}" stroke="#9aa1a6" stroke-width="1.1" fill="none"/>`;
  /* Pollerreihe entlang der Kante (≈ 0,45 m hoch, Gusseisen) */
  S.def(`<g id="${S.id("pol")}"><path d="M-4.6 1L-3.8 -13Q-6 -14.6 -6 -16.4L6 -16.4Q6 -14.6 3.8 -13L4.6 1Z" fill="url(#${S.id("poller")})"/><path d="M-5.6 -16.2Q0 -18 5.6 -16.2" stroke="#8a9096" stroke-width=".5" fill="none"/><ellipse cx="-6" cy="1" rx="6" ry="1.2" fill="#1d1810" opacity=".25"/></g>`);
  /* Kaikante: Poller, Fender und Leiter ragen über die Kante ins Bild des Wassers – darum liegen sie vor
     allen Teilen (davor); sie überdecken kein Wort-Teil */
  for (const x of [190, 268]) kante += `<use href="#${S.id("pol")}" transform="translate(${x} ${KAI})"/>`;
  /* offener Instrumentenkoffer der Musiker mit Münzen, Gullydeckel */
  k += `<path d="M98 246l26-1.2 3 5.6-28 1.4z" fill="#2a2420"/><path d="M100 246.6l22.6-1 2.2 4.2-24 1.1z" fill="#a8262e"/><path d="M106 248.6h.9M110 248h.9M114 249.2h.9M118 248.4h.9M108.6 249.6h.9" stroke="#e8c45a" stroke-width=".8" stroke-linecap="round"/><path d="M98 246l26-1.2-.6-3.6-24.6 1.1z" fill="#3a322c"/>`;
  k += `<ellipse cx="62" cy="252" rx="13" ry="2.6" fill="#6f6a60"/><ellipse cx="62" cy="251.8" rx="11.6" ry="2.2" fill="none" stroke="#4f4a42" stroke-width=".5" stroke-dasharray="1 .8"/>`;
  S.hinten(k);
  S.davor(kante);
}
{
  /* DER POLLER aus Gusseisen mit Festmacherleine, darauf die Dominikanermöwe */
  const X = 150, Y = 226, s = vorn(Y);
  const g = (n) => r(n * s);
  let k = schlag(Number(g(0.5)), 0.6, s, 0.35);
  const PG = `url(#${S.id("poller")})`;
  k += `<path d="M${g(-0.26)} 0 L${g(-0.24)} ${g(-0.05)} L${g(0.24)} ${g(-0.05)} L${g(0.26)} 0 Z" fill="#2a2d31"/>`;
  k += `<path d="M${g(-0.17)} ${g(-0.05)} Q${g(-0.16)} ${g(-0.3)} ${g(-0.12)} ${g(-0.4)} Q${g(-0.2)} ${g(-0.44)} ${g(-0.22)} ${g(-0.5)} Q${g(-0.2)} ${g(-0.58)} 0 ${g(-0.59)} Q${g(0.2)} ${g(-0.58)} ${g(0.22)} ${g(-0.5)} Q${g(0.2)} ${g(-0.44)} ${g(0.12)} ${g(-0.4)} Q${g(0.16)} ${g(-0.3)} ${g(0.17)} ${g(-0.05)} Z" fill="${PG}"/>`;
  k += `<path d="M${g(-0.1)} ${g(-0.56)} Q0 ${g(-0.6)} ${g(0.12)} ${g(-0.55)}" stroke="#8a9096" stroke-width="${g(0.02)}" fill="none" opacity=".7"/>`;
  k += `<path d="M${g(-0.14)} ${g(-0.36)} Q0 ${g(-0.28)} ${g(0.14)} ${g(-0.36)}" stroke="#e6d6a8" stroke-width="${g(0.05)}" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${g(0.14)} ${g(-0.36)} Q${g(0.32)} ${g(-0.2)} ${g(0.32)} 0 M${g(0.3)} ${g(0.02)} Q${g(0.62)} ${g(0.06)} ${g(0.66)} ${g(0.0)} Q${g(0.68)} ${g(-0.06)} ${g(0.42)} ${g(-0.05)} Q${g(0.3)} ${g(-0.04)} ${g(0.38)} ${g(0.05)} Q${g(0.58)} ${g(0.1)} ${g(0.72)} ${g(0.04)}" stroke="#e6d6a8" stroke-width="${g(0.045)}" fill="none" stroke-linecap="round"/>`;
  S.teil({ id: "poller", de: "der Poller", syl: "POL-ler", it: "la bitta", itSyl: "BIT-ta", en: "bollard", x: X, y: Y, steht: true, kunst: k,
    tipp: "Am Poller wird das Schiff mit einer dicken Leine festgemacht." });
  /* Dominikanermöwe, ≈ 60 cm, auf dem Poller: Rücken und Oberflügel eine zusammenhängende schwarze Decke von
     der Schulter bis zu den Flügelspitzen, weißer Hinterrand und weiße Spitzenflecken; die Spitzen ragen
     über den Schwanz hinaus. Olivgelbe Schwimmfüße. Licht von rechts hinten. */
  const m = (n) => r(n * s / 100);
  let w = `<path d="M${m(-2)} ${m(-11)}L${m(-3)} 0M${m(4)} ${m(-11)}L${m(4.4)} 0" stroke="#c9b452" stroke-width="${m(1.6)}" stroke-linecap="round"/>`;
  w += `<path d="M${m(-7)} ${m(0.4)}l${m(4)} ${m(-1.6)} ${m(3)} ${m(1.6)}zM${m(1.6)} ${m(0.4)}l${m(3)} ${m(-1.6)} ${m(4)} ${m(1.6)}z" fill="#c9b452"/>`;
  w += `<path d="M${m(-22)} ${m(-21)}L${m(-14)} ${m(-25)}L${m(-12)} ${m(-18)}Z" fill="#f4f4f2"/>`;
  w += `<path d="M${m(-17)} ${m(-19)}Q${m(-16)} ${m(-29)} ${m(2)} ${m(-31)}Q${m(14)} ${m(-31)} ${m(15)} ${m(-22)}Q${m(13)} ${m(-11)} ${m(1)} ${m(-10.4)}Q${m(-12)} ${m(-11)} ${m(-17)} ${m(-19)}Z" fill="${S.rg("moewe", [[0, "#ffffff"], [1, "#dfe2e6"]], 0.6, 0.45, 0.7)}"/>`;
  w += `<path d="M${m(9)} ${m(-29)}Q${m(-4)} ${m(-33)} ${m(-18)} ${m(-27.6)}L${m(-33)} ${m(-22.4)}L${m(-30.6)} ${m(-20.6)}Q${m(-16)} ${m(-19.6)} ${m(-2)} ${m(-19.6)}Q${m(7)} ${m(-21)} ${m(9)} ${m(-29)}Z" fill="#1f2125"/>`;
  w += `<path d="M${m(-2)} ${m(-20)}Q${m(-16)} ${m(-19.8)} ${m(-28)} ${m(-21.4)}" stroke="#f4f4f2" stroke-width="${m(1.3)}" fill="none"/><path d="M${m(4)} ${m(-29.4)}Q${m(-6)} ${m(-31.6)} ${m(-16)} ${m(-28)}" stroke="#4a4e56" stroke-width="${m(0.8)}" fill="none"/>`;
  w += `<circle cx="${m(-29.4)}" cy="${m(-22)}" r="${m(0.8)}" fill="#f4f4f2"/><circle cx="${m(-25.6)}" cy="${m(-22.6)}" r="${m(0.7)}" fill="#f4f4f2"/>`;
  w += `<circle cx="${m(14)}" cy="${m(-36)}" r="${m(6.2)}" fill="#ffffff"/><circle cx="${m(16.2)}" cy="${m(-37.4)}" r="${m(1.1)}" fill="#e8d36a"/><circle cx="${m(16.2)}" cy="${m(-37.4)}" r="${m(0.55)}" fill="#111"/>`;
  w += `<path d="M${m(19.4)} ${m(-36.6)}L${m(29)} ${m(-34.8)}Q${m(29.6)} ${m(-33)} ${m(27.6)} ${m(-32.4)}L${m(19.4)} ${m(-33)}Z" fill="#f2c62f"/><circle cx="${m(26.4)}" cy="${m(-33.1)}" r="${m(1)}" fill="#d8321e"/>`;
  w += `<path d="M${m(9)} ${m(-41)}Q${m(16)} ${m(-43.4)} ${m(19)} ${m(-38)}" stroke="#fff6e4" stroke-width="${m(1.2)}" fill="none"/>`;
  S.teil({ oben: true, id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: X, y: Y - Number(g(0.59)), kunst: w,
    tipp: "Die Dominikanermöwe ist groß, hat einen schwarzen Rücken und einen gelben Schnabel mit rotem Fleck." });
}

/* =====================================================================
   9 — DER MUSIKER mit der MARIMBA (Straßenmusik an der Waterfront)
   ===================================================================== */
const MUS = { x: 40, y: 224 };
/* Hemdstoff im Stil der „Madiba-Hemden“: gelbe Rauten mit grünem Kern auf Rotorange (eine Kachel) */
S.def(`<pattern id="${S.id("hemd")}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(8)"><path d="M2.5 .5 4.5 2.5 2.5 4.5 .5 2.5Z" fill="#f2c62f"/><path d="M2.5 1.6 3.4 2.5 2.5 3.4 1.6 2.5Z" fill="#2f8a4a"/><circle cx="0" cy="0" r=".55" fill="#1d1d1d"/><circle cx="5" cy="5" r=".55" fill="#1d1d1d"/><circle cx="5" cy="0" r=".55" fill="#1d1d1d"/><circle cx="0" cy="5" r=".55" fill="#1d1d1d"/></pattern>`);
const HAUT = "#6b4430", HAUTS = "#4a2c1e";
{
  /* DIE MUSIKERIN an der großen Bass-Marimba (rechts hinter dem Musiker): Doek (Kopftuch), blaues Kleid.
     Sie steht auf einem kleinen Podest, dreht Kopf und Schultern zu ihm (Band-Gefühl) und spielt: Ellbogen
     gebeugt, ein Schlägel liegt auf einem Stab, der andere holt aus. Die Bass-Marimba ist größer als die
     erste: sechs breite, tiefe Stäbe und sehr lange Rohre fast bis zum Boden. Ursprung = Fußpunkt. */
  const X = 98, Y = 219, s = vorn(Y) / 51.25;
  let k = `<g transform="scale(${r(s * 100) / 100})">`;
  /* Oberkörper, Schultern zum Musiker (nach links) gedreht */
  k += `<path d="M-7.6 -40Q-10.4 -54 -10.4 -63Q-8 -67.4 -3 -67.8L4 -67.6Q8.6 -66.6 9.4 -62.6Q8.6 -54 7.4 -40Z" fill="${S.lg("kleid2", [[0, "#2f6fb6"], [1, "#1f4f8f"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-6 -60l3 3-3 3M2 -62l3 3-3 3M-2 -50l3 3-3 3M5 -52l3 3-3 3" stroke="#f4efe6" stroke-width=".7" fill="none" opacity=".8"/><path d="M-10 -62Q-8.6 -52 -7.4 -41" stroke="#163a6a" stroke-width="2" opacity=".35" fill="none"/>`;
  /* Arme: Ellbogen gebeugt; links liegt der Schlägel auf dem Stab, rechts holt er aus */
  k += `<path d="M-9.4 -64L-13.6 -53L-10.2 -45.2M8.6 -64L13.4 -56L11.2 -50.4" stroke="${HAUT}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  k += `<path d="M-13.2 -53.6q1.2 .6 2.2 0M13 -56.4q-1 .8-2 .2" stroke="${HAUTS}" stroke-width=".5" fill="none"/>`;
  k += `<path d="M-10.2 -45.2L-14 -34.6M11.2 -50.4L16.6 -42.4" stroke="#7a5a3a" stroke-width="1" stroke-linecap="round"/><ellipse cx="-14.2" cy="-34" rx="2.6" ry="2.1" fill="#26282c"/><ellipse cx="16.9" cy="-41.8" rx="2.6" ry="2.1" fill="#26282c"/>`;
  k += `<ellipse cx="-10.2" cy="-45.4" rx="1.8" ry="1.5" fill="${HAUT}"/><ellipse cx="11.2" cy="-50.6" rx="1.8" ry="1.5" fill="${HAUT}"/>`;
  /* Hals, Kopf zum Musiker gedreht (Gesicht nach links, Ohr rechts sichtbar) */
  k += `<path d="M-2.2 -67.6L-1.8 -70.6L2.6 -70.8L2.8 -67.8Z" fill="${HAUTS}"/><ellipse cx="-.4" cy="-75.4" rx="5" ry="5.8" fill="${HAUT}"/><ellipse cx="4" cy="-75" rx=".8" ry="1.3" fill="${HAUTS}"/>`;
  k += `<path d="M-4 -76.4q.8 .5 1.6 0M-.6 -76.6q.8 .5 1.6 0M-3.2 -72.6q1.4 .9 2.8 0" stroke="#1d120c" stroke-width=".45" fill="none"/><path d="M-2 -76l-.6 1.8.8.2" stroke="${HAUTS}" stroke-width=".4" fill="none"/>`;
  /* Doek */
  k += `<path d="M-6 -77Q-7.2 -84 -2.8 -87.6Q1.8 -90.4 5.6 -86.6Q6.6 -82 4.8 -77Q-.4 -80 -6 -77Z" fill="#f2b51a"/><path d="M-5.4 -81Q-.2 -83.4 5.4 -80.6M-4.2 -85.4Q.2 -87.4 4.8 -85" stroke="#c8352a" stroke-width=".9" fill="none"/><path d="M4.6 -86.4q2.4 -1.6 2 -4q-1.6 1-2.6 2.6z" fill="#e2a012"/>`;
  /* Podest */
  k += `<path d="M-14 -3.4h28V.6h-28z" fill="#7a5434"/><path d="M-14 -3.4h28" stroke="#b48654" stroke-width=".6"/>`;
  k += `</g>`;
  /* Bass-Marimba davor (eigener Fußpunkt 6 Einheiten näher): sechs breite Stäbe, lange Rohre */
  const mb = (n) => r(n * s);
  const MY = 6, BH = 6 - 41, BW = 37, NB = 6, bb = (2 * BW) / NB;
  let m = `<g transform="translate(${mb(8)} ${mb(MY)})">${schlag(Number(mb(80)), 0.4, vorn(Y) * 1.0, 0.28)}</g>`;
  m += `<path d="M${mb(-BW - 2)} ${mb(MY)}L${mb(-BW)} ${mb(BH)}M${mb(-BW + 4)} ${mb(MY)}L${mb(-BW)} ${mb(BH)}M${mb(BW + 2)} ${mb(MY)}L${mb(BW)} ${mb(BH)}M${mb(BW - 4)} ${mb(MY)}L${mb(BW)} ${mb(BH)}M${mb(-BW + 2)} ${mb(MY - 10)}H${mb(BW - 2)}" stroke="#5a3a22" stroke-width="${mb(1.6)}"/>`;
  let ro = "";
  for (let i = 0; i < NB; i++) { const x = -BW + i * bb + bb * 0.2, l = 22 + i * 2.8; ro += `M${mb(x)} ${mb(BH + 1)}h${mb(bb * 0.6)}v${mb(l)}a${mb(bb * 0.3)} ${mb(bb * 0.22)} 0 0 1 ${mb(-bb * 0.6)} 0z`; }
  m += `<path d="${ro}" fill="url(#${S.id("rohr")})"/>`;
  m += `<path d="M${mb(-BW - 1)} ${mb(BH + 1)}H${mb(BW + 1)}v${mb(2)}H${mb(-BW - 1)}Z" fill="#6b4426"/>`;
  let st = "", ka = "";
  for (let i = 0; i < NB; i++) { const x = -BW + i * bb + 0.4, w = bb - 0.8, tief = 5.4 + i * 0.5; st += `M${mb(x)} ${mb(BH + 1)}h${mb(w)}l${mb(-0.6)} ${mb(-tief)}h${mb(-w + 1.2)}z`; ka += `M${mb(x)} ${mb(BH + 1)}h${mb(w)}`; }
  m += `<path d="${st}" fill="url(#${S.id("kiaat")})" stroke="#5e3416" stroke-width=".3"/><path d="${ka}" stroke="#f0c48a" stroke-width=".5"/><path d="M${mb(-BW)} ${mb(BH - 1)}H${mb(BW)}M${mb(-BW + 1)} ${mb(BH - 4)}H${mb(BW - 1)}" stroke="#2a1a10" stroke-width=".35" opacity=".7"/>`;
  S.teil({ id: "musikerin", de: "die Musikerin", syl: "MU-si-ke-rin", it: "la musicista", itSyl: "mu-si-CI-sta", en: "musician", x: X, y: Y, kunst: k + m,
    tipp: "Die Musikerin spielt die große Bass-Marimba. Zusammen sind sie eine Marimba-Band." });
}
{
  /* DER MUSIKER (von Hand gezeichnet): steht hinter der Marimba, beugt sich leicht nach vorn, die
     Unterarme gehen nach vorn-unten zu den Stäben, die Schlägelköpfe berühren die Stäbe; der rechte
     Fuß ist im Takt angehoben. Buntes Hemd, Strickmütze. Licht von rechts hinten (Nordwest).
     Ursprung = zwischen den Füßen. */
  let k = schlag(18, 1.76, vorn(MUS.y), 0.3) + `<ellipse cx="-5.6" cy="-.6" rx="5.4" ry="1" fill="#1d1810" opacity=".4"/><ellipse cx="7.4" cy="-.8" rx="4.4" ry=".9" fill="#1d1810" opacity=".3"/>`;
  /* Beine (Hose), rechtes Knie leicht gebeugt */
  k += `<path d="M-8.6 -46L-.4 -46L-2.4 -3L-8.8 -3Q-9.4 -24 -8.6 -46ZM.4 -46L8.6 -46Q10.6 -26 9.8 -5.4L4 -5Q4.4 -24 .4 -40Z" fill="${S.lg("hose", [[0, "#24252a"], [0.6, "#3a3c42"], [1, "#2a2b30"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-6 -44Q-6.4 -24 -5.6 -4M6.4 -30q1.6 3 1.4 7" stroke="#55585f" stroke-width=".5" fill="none"/>`;
  /* Turnschuhe: links flach, rechts Ferse angehoben */
  k += `<path d="M-10 -3.6h8.2q2.6.4 2.8 2.6L-10.2 -.4Z" fill="#f4f4f2"/><path d="M-10.2 -.6h11" stroke="#9aa0a6" stroke-width=".7"/>`;
  k += `<path d="M3.4 -6.2l6.4-.4q2.8 1.6 2.6 4.2l-1 .6q-4.2.2-7.6-2.8Z" fill="#f4f4f2"/><path d="M4 -3.4q3.4 2.4 7.4 2" stroke="#9aa0a6" stroke-width=".7" fill="none"/>`;
  /* Hemd: Grundfarbe, Muster, Schattenseite links; Kragen */
  S.def(`<path id="${S.id("hemdp")}" d="M-9.6 -43Q-11 -56 -12.8 -66Q-11 -70.4 -5 -71L5.6 -71.4Q11.8 -71 13 -67Q11.6 -56 10 -43Q0 -41.4 -9.6 -43Z"/>`);
  k += `<use href="#${S.id("hemdp")}" fill="#c8401c"/><use href="#${S.id("hemdp")}" fill="url(#${S.id("hemd")})" opacity=".85"/>`;
  k += `<path d="M-9.6 -43Q-11 -56 -12.8 -66Q-11 -70.4 -6 -70.8Q-8.4 -58 -6.4 -42.6Z" fill="#3a1408" opacity=".3"/><path d="M-2.6 -71l2.8 4.4 3.2-4.6" stroke="#f6e7c8" stroke-width=".9" fill="none"/>`;
  /* Arme: Ellbogen nach außen gebeugt, Unterarme nach vorn-unten (verkürzt); Ärmel mit Falten, zum
     Handgelenk schmaler. Links liegt der Schlägelkopf auf einem Stab, rechts holt er gerade aus. */
  const ARM = "M-12.4 -67.4L-17.2 -55.4L-11.4 -48.6M12.8 -67.4L18 -58L14.6 -53.8";
  k += `<path d="${ARM}" stroke="#c8401c" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${ARM}" stroke="url(#${S.id("hemd")})" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>`;
  k += `<path d="M-17.6 -57q1.6 .4 2.8-.8M-16.2 -53.4q1 .9 2.4.4M17.6 -59.6q-1.6.2-2.6-1M17.4 -56q-1 .8-2.4.2" stroke="#7a2410" stroke-width=".45" fill="none"/>`;
  /* Schlägel: Stiel ≈ 35 cm, dicker Gummikopf */
  k += `<path d="M-11.2 -48.4L-8.4 -37.4M14.4 -53.6L18.8 -45.8" stroke="#8a6a44" stroke-width=".85" stroke-linecap="round"/><ellipse cx="-8.2" cy="-36.8" rx="2.2" ry="1.7" fill="#a32a1e"/><ellipse cx="19" cy="-45.2" rx="2.2" ry="1.7" fill="#a32a1e"/><path d="M-9.4 -37.6q1-.6 2.2-.2M17.8 -46q1-.6 2.2-.2" stroke="#e05a44" stroke-width=".5" fill="none"/>`;
  k += `<ellipse cx="-11.4" cy="-48.6" rx="1.9" ry="1.6" fill="${HAUT}"/><ellipse cx="14.6" cy="-53.8" rx="1.9" ry="1.6" fill="${HAUT}"/><path d="M-12.6 -49.2q1.2-.6 2.4 0M13.4 -54.4q1.2-.6 2.4 0" stroke="${HAUTS}" stroke-width=".4" fill="none"/>`;
  /* Hals, Kopf (Dreiviertel nach rechts, Blick nach unten auf die Stäbe), Strickmütze */
  k += `<path d="M-2.6 -70.6L-2.2 -74L3.2 -74.2L3.4 -70.8Z" fill="${HAUTS}"/>`;
  k += `<path d="M-4.2 -79.4Q-4.6 -85.4 1.2 -85.6Q6.8 -85.4 6.8 -79.4Q6.8 -74 3.6 -72.6Q1.2 -71.8 -1.4 -72.8Q-4 -74.6 -4.2 -79.4Z" fill="${HAUT}"/>`;
  k += `<path d="M6.4 -81Q6.6 -76 3.6 -73.2" stroke="#8a5a40" stroke-width=".8" fill="none" opacity=".8"/><ellipse cx="-3.8" cy="-79" rx=".9" ry="1.4" fill="${HAUTS}"/>`;
  k += `<path d="M-.4 -80.2q.9.6 1.8 0M3.4 -80.4q.9.6 1.8 0" stroke="#140c08" stroke-width=".5" fill="none"/><path d="M3 -79.6q.6 1.6-.4 2.2h1" stroke="${HAUTS}" stroke-width=".45" fill="none"/><path d="M.6 -75.6q1.6 1 3.2-.2" stroke="#2a140c" stroke-width=".5" fill="none"/>`;
  k += `<path d="M-4.6 -81.6Q-4.2 -87.6 1.2 -87.8Q6.6 -87.6 7 -81.8Q1.2 -83.4 -4.6 -81.6Z" fill="#2f8a4a"/><path d="M-4.4 -82.6Q1.2 -84.4 6.9 -82.8" stroke="#f2c62f" stroke-width=".9" fill="none"/><path d="M-3 -85.6Q1.2 -86.8 5.6 -85.6" stroke="#c8352a" stroke-width=".7" fill="none"/>`;
  S.teil({ id: "musiker", de: "der Musiker", syl: "MU-si-ker", it: "il musicista", itSyl: "mu-si-CI-sta", en: "musician", x: MUS.x, y: MUS.y, kunst: k,
    tipp: "Der Musiker spielt Marimba – die Musik kommt aus dem südlichen Afrika." });
}
{
  /* die Marimba: flache Klangstäbe (Kiaat) quer zum Spieler, in Aufsicht verkürzt (Höhe ≈ 0,25 × Länge),
     auf zwei Schnurleisten; darunter die Resonanzrohre – sie hängen vor den Beinen des Spielers */
  const X = MUS.x + 14, Y = MUS.y + 8, s = vorn(Y);
  const g = (n) => r(n * s);
  let k = `<g transform="translate(${g(0.3)} 0)">${schlag(Number(g(1.1)), 0.5, s, 0.28)}</g>`;
  const L = 0.7, R = 0.55, H0 = 0.78, N = 12, bw = (L + R) / N;
  /* Gestell: A-Beine an den Enden, Querholz */
  k += `<path d="M${g(-L - 0.02)} 0L${g(-L + 0.04)} ${g(-H0 + 0.02)}M${g(-L + 0.12)} 0L${g(-L + 0.04)} ${g(-H0 + 0.02)}M${g(R + 0.02)} 0L${g(R - 0.04)} ${g(-H0 + 0.04)}M${g(R - 0.12)} 0L${g(R - 0.04)} ${g(-H0 + 0.04)}M${g(-L + 0.06)} ${g(-0.24)}H${g(R - 0.06)}" stroke="#5a3a22" stroke-width="${g(0.035)}"/>`;
  /* Resonanzrohre: unter jedem Stab; die tiefen Töne liegen links vom Spieler – im Bild also rechts lang,
     nach links stetig kürzer */
  let ro = "";
  for (let i = 0; i < N; i++) { const x = -L + i * bw + bw * 0.22, l = 0.17 + i * 0.027; ro += `M${g(x)} ${g(-H0 + 0.02)}h${g(bw * 0.56)}v${g(l)}a${g(bw * 0.28)} ${g(bw * 0.2)} 0 0 1 ${g(-bw * 0.56)} 0z`; }
  k += `<path d="${ro}" fill="${S.lg("rohr", [[0, "#3a3d42"], [0.5, "#6a6f76"], [1, "#2e3135"]], 0, 0, 1, 0)}"/>`;
  /* zwei Leisten (vorn und hinten) */
  k += `<path d="M${g(-L - 0.04)} ${g(-H0 + 0.02)}H${g(R + 0.04)}v${g(0.04)}H${g(-L - 0.04)}Z" fill="#6b4426"/><path d="M${g(-L)} ${g(-H0 - 0.07)}H${g(R)}" stroke="#4a2e1a" stroke-width="${g(0.02)}"/>`;
  /* Stäbe: verkürzte Trapeze (Tiefe nach hinten), links länger; helle Vorderkante, Schnurlöcher */
  let st = "", ka = "";
  for (let i = 0; i < N; i++) {
    const x = -L + i * bw + 0.004, w = bw - 0.012, tief = (0.24 + i * 0.016) * 0.26, y0 = -H0 + 0.01, y1 = y0 - tief, ein = (x + w / 2) * 0.03;
    st += `M${g(x)} ${g(y0)}h${g(w)}l${g(-ein - 0.004)} ${g(-tief)}h${g(-w + 0.008)}z`;
    ka += `M${g(x)} ${g(y0)}h${g(w)}`;
  }
  k += `<path d="${st}" fill="${S.lg("kiaat", [[0, "#9a5a2a"], [1, "#d89a5a"]])}" stroke="#5e3416" stroke-width=".25"/><path d="${ka}" stroke="#f0c48a" stroke-width=".45"/>`;
  k += `<path d="M${g(-L)} ${g(-H0 - 0.025)}H${g(R)}M${g(-L + 0.01)} ${g(-H0 - 0.075)}H${g(R - 0.01)}" stroke="#2a1a10" stroke-width=".3" opacity=".7"/>`;
  S.teil({ id: "marimba", de: "die Marimba", syl: "ma-RIM-ba", it: "la marimba", itSyl: "ma-RIM-ba", en: "marimba", x: X, y: Y, steht: true, kunst: k,
    tipp: "An der Waterfront spielen oft Marimba-Bands: Holzstäbe, die man mit Schlägeln anschlägt." });
}
/* =====================================================================
   10 — DER CAFÉTISCH am Kai (Lupe: Rooibostee, Protea, Koeksister,
        Pinguin), 11 — DER STUHL
   ===================================================================== */
const TISCH = { x: 312, y: 247 };
{
  /* Nachbartisch am rechten Rand (angeschnitten) mit zusammengebundenem Sonnenschirm: Bei Südostwind
     bleiben die Schirme zu. Mast mit Spitze, Stoff in Falten um den Mast gerollt, Halteband */
  const X = 394, Y = 236, s = vorn(Y);
  const g = (n) => r(n * s);
  let k = schlag(Number(g(0.4)), 2.4, s * 0.35, 0.22);
  const TT = -0.74;
  k += `<path d="M${g(-0.2)} 0L${g(0.1)} 0L${g(0.02)} ${g(-0.05)}L${g(-0.04)} ${g(-0.05)}Z" fill="#3a3d40"/><rect x="${g(-0.03)}" y="${g(TT)}" width="${g(0.05)}" height="${g(-TT)}" fill="#55595d"/>`;
  k += `<path d="M${g(-0.38)} ${g(TT + 0.02)}A${g(0.38)} ${g(0.075)} 0 0 0 ${g(0.1)} ${g(TT + 0.09)}V${g(TT - 0.06)}A${g(0.38)} ${g(0.075)} 0 0 0 ${g(-0.38)} ${g(TT + 0.02)}Z" fill="#8f8a82"/>`;
  k += `<path d="M${g(-0.38)} ${g(TT)}A${g(0.38)} ${g(0.075)} 0 0 0 ${g(0.1)} ${g(TT + 0.07)}V${g(TT - 0.075)}A${g(0.38)} ${g(0.075)} 0 0 0 ${g(-0.38)} ${g(TT)}Z" fill="${S.rg("marmor", [[0, "#fbfaf6"], [1, "#dcd8cf"]], 0.4, 0.4, 0.7)}"/>`;
  /* Mast und eingerollter Schirm */
  k += `<rect x="${g(-0.018)}" y="${g(-2.3)}" width="${g(0.036)}" height="${g(2.3 + TT)}" fill="#c9c4b8"/><path d="M${g(0.012)} ${g(-2.3)}V${g(TT)}" stroke="#f4f1ea" stroke-width=".4"/>`;
  k += `<path d="M${g(-0.02)} ${g(-1.45)}Q${g(-0.11)} ${g(-1.6)} ${g(-0.075)} ${g(-1.95)}L${g(-0.01)} ${g(-2.3)}L${g(0.03)} ${g(-2.3)}L${g(0.075)} ${g(-1.95)}Q${g(0.11)} ${g(-1.6)} ${g(0.02)} ${g(-1.45)}Z" fill="${S.lg("schirm", [[0, "#cfc6b4"], [0.55, "#f3efe4"], [1, "#e0d8c6"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${g(-0.06)} ${g(-1.55)}Q${g(-0.03)} ${g(-1.9)} ${g(-0.005)} ${g(-2.25)}M${g(0.04)} ${g(-1.56)}Q${g(0.03)} ${g(-1.9)} ${g(0.012)} ${g(-2.25)}M${g(-0.02)} ${g(-1.5)}Q${g(0.01)} ${g(-1.8)} ${g(0.002)} ${g(-2.2)}" stroke="#b5ab96" stroke-width=".45" fill="none"/>`;
  k += `<path d="M${g(-0.085)} ${g(-1.74)}L${g(0.085)} ${g(-1.72)}" stroke="#2f4a6a" stroke-width="1.1"/><path d="M${g(-0.03)} ${g(-2.3)}L${g(0)} ${g(-2.38)}L${g(0.03)} ${g(-2.3)}Z" fill="#9a9488"/>`;
  /* Wortmarke in der Schirmmitte, damit das Wort ganz im Bild steht */
  const AX = 386, AY = 190;
  S.teil({ id: "sonnenschirm", de: "der Sonnenschirm", syl: "SON-nen-schirm", it: "l'ombrellone", itSyl: "om-brel-LO-ne", en: "parasol", x: AX, y: AY, kunst: `<g transform="translate(${X - AX} ${Y - AY})">${k}</g>`,
    tipp: "Bei starkem Südostwind bleiben die Sonnenschirme zu – sonst fliegen sie weg." });
}
const tischUnter = [];
{
  /* Café-Stuhl (Aluminiumrahmen, geflochtene Sitzfläche und Lehne), zum Tisch gedreht: zwei Lehnenholme
     mit zwei Querstreben, dünne verkürzte Sitzfläche, Seitenstreben; die abgewandten Beine stehen höher */
  const s = vorn(TISCH.y - 6);
  const Fv = [-0.94 * s, 0.1 * s], Rv = [-0.34 * s, -0.28 * s];
  const P = (f, q, h) => `${r(Fv[0] * f + Rv[0] * q)} ${r(Fv[1] * f + Rv[1] * q - h * s)}`;
  let k = schlag(Number(r(0.45 * s)), 0.9, s, 0.3);
  const RAHMEN = "#4a4f55", LICHT = "#a9b0b6";
  const bein = (f, q) => `M${P(f * 1.08, q * 1.08, 0)}L${P(f, q, 0.45)}`;
  /* hintere (abgewandte) Seite: Beine, Seitenstrebe */
  k += `<path d="${bein(0.19, 0.19)}${bein(-0.19, 0.19)}M${P(0.2, 0.2, 0.16)}L${P(-0.2, 0.2, 0.16)}" stroke="${RAHMEN}" stroke-width="1.1" stroke-linecap="round"/>`;
  /* Lehne: Holme, Geflecht zwischen zwei Querstreben */
  k += `<path d="M${P(-0.19, -0.19, 0.6)}L${P(-0.21, -0.18, 0.84)}L${P(-0.21, 0.18, 0.84)}L${P(-0.19, 0.19, 0.6)}Z" fill="#d8c8a2"/>`;
  k += `<path d="M${P(-0.2, -0.17, 0.66)}L${P(-0.2, 0.17, 0.66)}M${P(-0.2, -0.17, 0.72)}L${P(-0.2, 0.17, 0.72)}M${P(-0.205, -0.17, 0.78)}L${P(-0.205, 0.17, 0.78)}" stroke="#a8946a" stroke-width=".35"/>`;
  k += `<path d="M${P(-0.19, 0.19, 0.45)}L${P(-0.215, 0.185, 0.86)}M${P(-0.19, -0.19, 0.45)}L${P(-0.215, -0.185, 0.86)}M${P(-0.2, -0.19, 0.6)}L${P(-0.2, 0.19, 0.6)}M${P(-0.215, -0.19, 0.85)}L${P(-0.215, 0.19, 0.85)}" stroke="${RAHMEN}" stroke-width="1.1" stroke-linecap="round"/>`;
  /* Sitzfläche: dünn, Geflecht, Rahmenkante */
  k += `<path d="M${P(0.2, -0.2, 0.45)}L${P(0.2, 0.2, 0.45)}L${P(-0.2, 0.2, 0.45)}L${P(-0.2, -0.2, 0.45)}Z" fill="${S.lg("sitz", [[0, "#e8dab6"], [1, "#c9b78e"]])}" stroke="${RAHMEN}" stroke-width=".8"/>`;
  k += `<path d="M${P(0.1, -0.2, 0.45)}L${P(0.1, 0.2, 0.45)}M${P(0, -0.2, 0.45)}L${P(0, 0.2, 0.45)}M${P(-0.1, -0.2, 0.45)}L${P(-0.1, 0.2, 0.45)}" stroke="#a8946a" stroke-width=".3"/>`;
  k += `<path d="M${P(0.2, -0.2, 0.44)}L${P(0.2, 0.2, 0.44)}" stroke="${LICHT}" stroke-width=".5"/>`;
  /* vordere (zugewandte) Seite: Beine, Seitenstrebe, Lichtkante */
  k += `<path d="${bein(0.19, -0.19)}${bein(-0.19, -0.19)}M${P(0.2, -0.2, 0.16)}L${P(-0.2, -0.2, 0.16)}" stroke="${RAHMEN}" stroke-width="1.2" stroke-linecap="round"/>`;
  k += `<path d="${bein(0.19, -0.19)}${bein(-0.19, -0.19)}" stroke="${LICHT}" stroke-width=".35" transform="translate(.35 0)"/>`;
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
  /* Dampf: der Südost weht ihn flach nach rechts vorn weg */
  k += `<path d="M${g(TX + 0.01)} ${g(TOP - 0.13)} q${g(0.03)} ${g(-0.025)} ${g(0.08)} ${g(-0.01)} t${g(0.09)} ${g(0.012)} M${g(TX + 0.02)} ${g(TOP - 0.12)} q${g(0.04)} ${g(-0.01)} ${g(0.1)} ${g(0.008)}" stroke="#fff" stroke-width=".35" opacity=".55" fill="none"/>`;
  /* Serviette unter dem Glas, eine Ecke flattert im Wind */
  k += `<path d="M${g(TX + 0.05)} ${g(TOP + 0.02)}l${g(0.1)} ${g(-0.012)}l${g(0.03)} ${g(-0.03)}q${g(0.04)} ${g(-0.03)} ${g(0.07)} ${g(-0.012)}q${g(-0.03)} ${g(0.02)} ${g(-0.05)} ${g(0.05)}l${g(-0.06)} ${g(0.024)}z" fill="#f8f6f0" stroke="#d8d2c4" stroke-width=".2"/>`;
  /* Wortmarken versetzt: Tee und Koeksister unten am Tischrand, Protea oben an der Blüte, Pinguin rechts */
  const AT = [TISCH.x + Number(g(TX)) - 2, TISCH.y + Number(g(TOP + 0.08))];
  tischUnter.push({ id: "rooibostee", de: "der Rooibostee", syl: "ROI-bos-tee", it: "il tè rooibos", itSyl: "TÈ ROI-bos", en: "rooibos tea", x: AT[0], y: AT[1],
    kunst: flaeche(Number(g(TX)) - (AT[0] - TISCH.x) - Number(g(0.08)), Number(g(TOP - 0.2)) - (AT[1] - TISCH.y), Number(g(0.16)), Number(g(0.22)), 0.6), tipp: "Rooibos (Rotbusch) wächst nur in Südafrika. Der Tee ist rot und hat kein Koffein." });
  /* Koeksister: drei flach liegende, zweisträngig geflochtene Zöpfe (≈ 9 cm) auf dem Teller, goldbraun,
     sirupglänzend, Ränder dunkler */
  const KX = -0.08;
  k += `<ellipse cx="${g(KX)}" cy="${g(TOP + 0.008)}" rx="${g(0.11)}" ry="${g(0.026)}" fill="#f6f4ef" stroke="#cfc9bd" stroke-width=".2"/>`;
  const KOEK = S.lg("koek", [[0, "#e0a046"], [0.6, "#b86a22"], [1, "#7a3a10"]], 0, 0, 0, 1);
  /* Zopf: abgerundeter, länglicher Strang (in Aufsicht leicht verkürzt) mit schrägen Flechtfugen */
  let zopf = "", fuge = "", glanz = "";
  for (const [dx, dy, an] of [[-0.03, 0.006, -10], [0.03, 0.01, 12], [0, -0.008, -2]]) {
    const cx = Number(g(KX + dx)), cy = Number(g(TOP + dy)) - 0.4, L = 2.9, W = 0.95;
    const T = (u, v) => { const a = an * Math.PI / 180; return `${r(cx + u * Math.cos(a) - v * Math.sin(a))} ${r(cy + u * Math.sin(a) * 0.4 + v * Math.cos(a))}`; };
    zopf += `M${T(-L, 0)}Q${T(-L, -W)} ${T(-L + W, -W)}L${T(L - W, -W)}Q${T(L, -W)} ${T(L, 0)}Q${T(L, W)} ${T(L - W, W)}L${T(-L + W, W)}Q${T(-L, W)} ${T(-L, 0)}Z`;
    for (let u = -L + 0.9; u < L - 0.4; u += 1.05) fuge += `M${T(u - 0.35, -W * 0.9)}Q${T(u + 0.15, 0)} ${T(u + 0.35, W * 0.9)}`;
    glanz += `M${T(-L + 0.8, -W * 0.45)}L${T(L - 0.9, -W * 0.45)}`;
  }
  k += `<path d="${zopf}" fill="${KOEK}" stroke="#6a2e0c" stroke-width=".25"/><path d="${fuge}" stroke="#6a2e0c" stroke-width=".3" fill="none"/><path d="${glanz}" stroke="#fff3cc" stroke-width=".3" stroke-dasharray=".7 .5" opacity=".9"/>`;
  tischUnter.push({ id: "koeksister", de: "der Koeksister", syl: "KUK-sis-ter", it: "il koeksister", itSyl: "KUK-sis-ter", en: "koeksister", x: TISCH.x + Number(g(KX)) + 2, y: TISCH.y + Number(g(TOP + 0.16)),
    kunst: flaeche(-2 - Number(g(0.11)), Number(g(-0.24)), Number(g(0.22)), Number(g(0.17)), 0.6), tipp: "Koeksisters sind geflochtenes, frittiertes Gebäck, das in kaltem Sirup getränkt wird – sehr süß!" });
  /* Königsprotea in einer Vase: ein tiefer Kelch, schräg von oben: hinten die hellen Innenseiten der steifen
     Hochblätter, in der Mitte die silbrig-weiße, behaarte Kuppel, vorn die kräftig rosa Außenseiten;
     ledrige grüne Blätter mit rötlichem Rand am dicken Stiel */
  const PX = 0.1, BY = TOP - 0.3;
  k += `<path d="M${g(PX - 0.045)} ${g(TOP)} L${g(PX - 0.055)} ${g(TOP - 0.11)} Q${g(PX)} ${g(TOP - 0.14)} ${g(PX + 0.055)} ${g(TOP - 0.11)} L${g(PX + 0.045)} ${g(TOP)} Z" fill="${S.lg("vase", [[0, "#3a6f8f"], [1, "#24506b"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${g(PX)} ${g(TOP - 0.12)} Q${g(PX - 0.005)} ${g(TOP - 0.2)} ${g(PX)} ${g(BY + 0.05)}" stroke="#4a6a2a" stroke-width="${g(0.016)}" fill="none"/>`;
  for (const [dy, sx, a] of [[-0.17, -1, 1], [-0.21, 1, 1]]) {
    const y0 = TOP + dy + 0.05;
    k += `<path d="M${g(PX)} ${g(y0)} Q${g(PX + sx * 0.04)} ${g(y0 - 0.06 * a)} ${g(PX + sx * 0.085 * a)} ${g(y0 - 0.075 * a)} Q${g(PX + sx * 0.06)} ${g(y0 - 0.01)} ${g(PX)} ${g(y0)} Z" fill="#4f8a3a" stroke="#b04a3a" stroke-width=".35"/>`;
  }
  const RX = 0.07, RY = 0.026;
  const hb = (th, l, w, farbe, rand) => {
    const t = th * Math.PI / 180, bx = PX + Math.cos(t) * RX, by = BY + Math.sin(t) * RY, tx = bx + Math.cos(t) * 0.028, ty = by - l + Math.sin(t) * 0.008;
    const nx = -Math.sin(t) * w, ny = Math.cos(t) * w * 0.35;
    return `<path d="M${g(bx - Math.abs(nx) - 0.004)} ${g(by + 0.012)}Q${g(bx - w * 0.9)} ${g(by - l * 0.55)} ${g(tx)} ${g(ty)}Q${g(bx + w * 0.9)} ${g(by - l * 0.55)} ${g(bx + Math.abs(nx) + 0.004)} ${g(by + 0.012)}Z" fill="${farbe}" stroke="${rand}" stroke-width=".25"/>`;
  };
  /* Unterseite des Kelchs (kurze, dunkle Schuppenblätter) */
  k += `<path d="M${g(PX - RX)} ${g(BY)}Q${g(PX - 0.06)} ${g(BY + 0.07)} ${g(PX)} ${g(BY + 0.08)}Q${g(PX + 0.06)} ${g(BY + 0.07)} ${g(PX + RX)} ${g(BY)}Z" fill="${S.lg("kelch", [[0, "#d65a72"], [1, "#9a2f48"]])}"/>`;
  for (const th of [200, 225, 250, 270, 290, 315, 340]) k += hb(th, 0.06, 0.02, "#f8dfe0", "#e58ea0");
  k += `<ellipse cx="${g(PX)}" cy="${g(BY - 0.022)}" rx="${g(0.052)}" ry="${g(0.034)}" fill="${S.rg("protea", [[0, "#ffffff"], [0.6, "#efe2e0"], [1, "#c9a7ac"]], 0.45, 0.35, 0.65)}"/>`;
  let haar = "";
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; haar += `M${g(PX + Math.cos(a) * 0.012)} ${g(BY - 0.03 + Math.sin(a) * 0.008)}L${g(PX + Math.cos(a) * 0.046)} ${g(BY - 0.024 + Math.sin(a) * 0.028)}`; }
  k += `<path d="${haar}" stroke="#b98c90" stroke-width=".22" opacity=".7"/>`;
  for (const th of [0, 180, 20, 160, 45, 135, 70, 110, 90]) k += hb(th, th === 0 || th === 180 ? 0.06 : 0.045, 0.02, th > 60 && th < 120 ? "#ef7c96" : "#e2607e", "#a83a56");
  tischUnter.push({ id: "protea", de: "die Protea", syl: "PRO-te-a", it: "la protea", itSyl: "pro-TE-a", en: "protea", x: TISCH.x + Number(g(PX)), y: TISCH.y + Number(g(BY - 0.1)),
    kunst: flaeche(-Number(g(0.12)), 0, Number(g(0.24)), Number(g(TOP - BY + 0.1)), 0.6), tipp: "Die Königsprotea ist die Nationalblume Südafrikas. Ihre Blüte kann so groß wie ein Teller werden." });
  /* Pinguin aus Draht und Glasperlen: Perlen in Reihen (Muster), Drahtgitter, Bauch hell */
  const QX = 0.27;
  const pg = (n) => r(n * s);
  const umr = `M${pg(QX - 0.04)} ${pg(TOP - 0.005)} Q${pg(QX - 0.055)} ${pg(TOP - 0.1)} ${pg(QX - 0.022)} ${pg(TOP - 0.155)} Q${pg(QX)} ${pg(TOP - 0.178)} ${pg(QX + 0.022)} ${pg(TOP - 0.155)} Q${pg(QX + 0.055)} ${pg(TOP - 0.1)} ${pg(QX + 0.04)} ${pg(TOP - 0.005)} Z`;
  const pw = r(0.01 * s), ph = r(0.023 * s), pr = r(0.0048 * s);
  S.def(`<pattern id="${S.id("perlen")}" width="${pw}" height="${ph}" patternUnits="userSpaceOnUse"><circle cx="${r(pw / 2)}" cy="${r(ph / 4)}" r="${pr}" fill="#202227"/><circle cx="0" cy="${r(ph * 0.75)}" r="${pr}" fill="#3b5bd6"/><circle cx="${pw}" cy="${r(ph * 0.75)}" r="${pr}" fill="#202227"/></pattern>`);
  S.def(`<pattern id="${S.id("perlenb")}" width="${pw}" height="${ph}" patternUnits="userSpaceOnUse"><circle cx="${r(pw / 2)}" cy="${r(ph / 4)}" r="${pr}" fill="#f6f6f2"/><circle cx="0" cy="${r(ph * 0.75)}" r="${pr}" fill="#e94a6a"/><circle cx="${pw}" cy="${r(ph * 0.75)}" r="${pr}" fill="#f2c62f"/></pattern>`);
  let pin = `<path d="${umr}" fill="#202227"/><path d="${umr}" fill="url(#${S.id("perlen")})"/>`;
  pin += `<path d="M${pg(QX - 0.02)} ${pg(TOP - 0.01)}Q${pg(QX - 0.03)} ${pg(TOP - 0.08)} ${pg(QX)} ${pg(TOP - 0.13)}Q${pg(QX + 0.03)} ${pg(TOP - 0.08)} ${pg(QX + 0.02)} ${pg(TOP - 0.01)}Z" fill="url(#${S.id("perlenb")})"/>`;
  let draht = "";
  for (let row = 0; row < 15; row += 2) draht += `M${pg(QX - 0.05)} ${pg(TOP - 0.008 - row * 0.0115)}H${pg(QX + 0.05)}`;
  S.def(`<clipPath id="${S.id("pinguin")}"><path d="${umr}"/></clipPath>`);
  pin += `<path d="${draht}" stroke="#b9bcc0" stroke-width=".18" opacity=".8" clip-path="url(#${S.id("pinguin")})"/>`;
  pin += `<path d="${umr}" fill="none" stroke="#9aa0a6" stroke-width=".3"/>`;
  pin += `<path d="M${pg(QX + 0.02)} ${pg(TOP - 0.158)} l${pg(0.032)} ${pg(0.008)} l${pg(-0.032)} ${pg(0.009)} Z" fill="#f08a1e"/><circle cx="${pg(QX + 0.012)}" cy="${pg(TOP - 0.16)}" r=".4" fill="#f6f6f2"/>`;
  pin += `<path d="M${pg(QX - 0.03)} ${pg(TOP)} l${pg(-0.012)} ${pg(0.004)} l${pg(0.03)} 0 Z M${pg(QX + 0.012)} ${pg(TOP)} l${pg(0.03)} ${pg(0.004)} l${pg(-0.012)} ${pg(-0.004)} Z" fill="#f08a1e"/>`;
  k += pin;
  tischUnter.push({ id: "pinguin", de: "der Pinguin", syl: "PIN-gu-in", it: "il pinguino", itSyl: "pin-GUI-no", en: "penguin", x: TISCH.x + Number(g(QX)) + 5, y: TISCH.y + Number(g(TOP - 0.06)),
    kunst: flaeche(-5 - Number(g(0.085)), -Number(g(0.14)), Number(g(0.17)), Number(g(0.21)), 0.6), tipp: "Ein Pinguin aus Draht und Glasperlen – Kunsthandwerk aus Kapstadt. Echte Brillenpinguine leben am Boulders Beach." });
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
