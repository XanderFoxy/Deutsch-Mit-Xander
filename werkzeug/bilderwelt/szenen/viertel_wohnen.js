#!/usr/bin/env node
/* =====================================================================
   DAS WOHNVIERTEL (FASSUNG 852) — Bilderwelt neu, Navigations-Szene
   ---------------------------------------------------------------------
   Jedes Teil hat „lupe“: Antippen führt in die passende Szene (Wohnzimmer,
   Arztpraxis, Spielplatz …). Die Wörter und lupe-Verweise sind die der
   alten Szene (szenen/viertel_wohnen.js), unverändert.

   RECHERCHE (BauNetz Wissen „Baualtersstufe Gründerzeit“, sanier.de
   „Häuser Jahrhundertwende“, physioaustria „Schilderempfehlung“):
   - ALTBAU der Gründerzeit (1850–1918): Ziegelbau, Holzbalkendecken,
     hohe Räume (3–4,5 m), Dielen- und Parkettböden, Stuckdecken,
     Kastenfenster, Satteldach mit Giebel. Hier als PUPPENHAUS-SCHNITT:
     die Vorderwand ist aufgeschnitten, man sieht in jedes Zimmer —
     Dach: Kinderzimmer mit Dachschräge und Dachfenster; 2. OG:
     Schlafzimmer und Bad (Wanne, Duschkabine, Waschtisch mit
     Spiegelschrank); 1. OG: Küche und Wohnzimmer; EG: Flur mit Garderobe
     und der gemeinsame Waschraum (Waschküche) mit Maschinen und Leine.
   - ÄRZTEHAUS: in Wohnvierteln liegen die Praxen oft übereinander in
     einem Haus; jede Praxis hat ihr eigenes Schild am Eingang und eine
     Folienschrift im Fenster — EG Physiotherapie (große Fenster,
     barrierefrei), darüber Hausarzt, Kinderarzt, Zahnarzt.
   - NEUBAU mit Balkonen: im Erdgeschoss ein Waschsalon (SB, Münz- oder
     Kartenautomat), oben ein Balkon mit Luftballons (Geburtstag) und eine
     leere Wohnung mit Banner „Zu vermieten“ (Besichtigung).
   - KITA: bunte Fassade, Zaun, Name mit Regenbogen, Kinderbilder im Fenster.
   - STRASSE: Gehwegplatten, Bordstein, Asphalt; ein Umzugswagen (7,5 t,
     Kofferaufbau, Ladebordwand), Umzugskartons; die neuen Küchengeräte
     in Stretchfolie auf der Sackkarre.
   - UNSERE STRASSENSEITE (von oben gesehen): Spielplatz (Spielturm mit
     Rutsche, Schaukel, Sandkasten, Schild), Müllplatz mit den vier
     Tonnen (grau Restmüll, gelb Verpackungen, blau Papier, braun Bio),
     Vorgarten mit Jägerzaun, Beeten, Apfelbäumchen und Gartenzwerg,
     Werbevitrine (City-Light) „Gesundheitstag — dein Körper“, Straßenuhr.
   Maßstab: Augenhöhe y = 95 (≈ 9 m, man schaut aus dem 3. Stock gegenüber).
   An der Hausfront (y 186) 10 Einheiten je Meter; vorne gilt
   Einheiten je Meter ≈ (y − 95) / 9,1.
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, schatten, zufall } = B;

const S = neueSzene({ id: "viertel_wohnen", titel: "Das Wohnviertel", emoji: "🏠", thema: "Stadt", kuerzel: "b29a", fassung: 852, breite: 400, hoehe: 300 });
const rnd = zufall(2911);
const r = B.r;
const HOR = 95, VPX = 200, TS = 0.92;

const WORT = {
  vw_wohnzimmer: ["das Wohnzimmer","WOHN-zim-mer","il soggiorno","sog-GIOR-no","living room","wohnzimmer"],
  vw_kueche: ["die Küche","KÜ-che","la cucina","cu-CI-na","kitchen","kueche"],
  vw_schlafzimmer: ["das Schlafzimmer","SCHLAF-zim-mer","la camera da letto","CA-me-ra da LET-to","bedroom","schlafzimmer"],
  vw_kinderzimmer: ["das Kinderzimmer","KIN-der-zim-mer","la cameretta","ca-me-RET-ta","child's room","kinderzimmer"],
  vw_badezimmer: ["das Badezimmer","BA-de-zim-mer","il bagno","BA-gno","bathroom","badezimmer"],
  vw_flur: ["der Flur","FLUR","il corridoio","cor-ri-DO-io","hallway","flur"],
  vw_waschkueche: ["die Waschküche","WASCH-kü-che","la lavanderia","la-van-de-RI-a","laundry room","waschkueche"],
  vw_dusche: ["die Dusche","DU-sche","la doccia","DOC-cia","shower","dusche"],
  vw_kuechengeraete: ["die Küchengeräte","KÜ-chen-ge-rä-te","gli elettrodomestici","e-let-tro-do-ME-sti-ci","kitchen appliances","kuechengeraete"],
  vw_pflege: ["die Pflege","PFLE-ge","la cura","CU-ra","personal care","pflege"],
  vw_tagesablauf: ["der Tagesablauf","TA-ges-ab-lauf","la giornata","gior-NA-ta","daily routine","tagesablauf"],
  vw_koerper: ["der Körper","KÖR-per","il corpo","COR-po","the body","koerper"],
  vw_arztpraxis: ["die Arztpraxis","ARZT-pra-xis","l'ambulatorio","am-bu-la-TO-rio","doctor's surgery","arztpraxis"],
  vw_zahnarzt: ["der Zahnarzt","ZAHN-arzt","il dentista","den-TI-sta","dentist","zahnarzt"],
  /* itSyl korrigiert: „pediatra“ wird pe-DIA-tra betont (alt: pe-dia-TRA) */
  vw_kinderarzt: ["der Kinderarzt","KIN-der-arzt","il pediatra","pe-DIA-tra","paediatrician","kinderarzt"],
  vw_physio: ["die Physiotherapie","Phy-sio-the-ra-PIE","la fisioterapia","fi-sio-te-ra-PI-a","physiotherapy","physiotherapie"],
  vw_waschsalon: ["der Waschsalon","WASCH-sa-lon","la lavanderia a gettoni","la-van-de-RI-a a get-TO-ni","launderette","waschsalon"],
  vw_besichtigung: ["die Wohnungsbesichtigung","WOH-nungs-be-sich-ti-gung","la visita dell'appartamento","VI-si-ta dell'ap-par-ta-MEN-to","flat viewing","wohnungsbesichtigung"],
  vw_umzug: ["der Umzug","UM-zug","il trasloco","tra-SLO-co","moving house","umzug"],
  vw_muell: ["die Mülltrennung","MÜLL-tren-nung","la raccolta differenziata","rac-COL-ta dif-fe-ren-ZIA-ta","waste separation","muelltrennung"],
  vw_spielplatz: ["der Spielplatz","SPIEL-platz","il parco giochi","PAR-co GIO-chi","playground","spielplatz"],
  vw_garten: ["der Garten","GAR-ten","il giardino","giar-DI-no","garden","garten"],
  vw_kindergarten: ["der Kindergarten","KIN-der-gar-ten","l'asilo","a-SI-lo","nursery school","kindergarten"],
  vw_geburtstag: ["der Geburtstag","Ge-BURTS-tag","il compleanno","com-ple-AN-no","birthday","geburtstag"],
};

/* ---------- kleine Zeichenhelfer (absolute Koordinaten) ------------- */
const memo = {};
const LG = (n, st, x1 = 0, y1 = 0, x2 = 0, y2 = 1) => memo[n] || (memo[n] = S.lg(n, st, x1, y1, x2, y2));
const RG = (n, st, cx = 0.5, cy = 0.5, rr = 0.5) => memo[n] || (memo[n] = S.rg(n, st, cx, cy, rr));
const re = (x, y, w, h, f, ex = "") => `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${f}"${ex}/>`;
const pl = (pts, f, ex = "") => `<path d="M${pts.map((p) => r(p[0]) + " " + r(p[1])).join("L")}Z" fill="${f}"${ex}/>`;
const li = (x1, y1, x2, y2, c, w, ex = "") => `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${c}" stroke-width="${w}"${ex}/>`;
const ci = (x, y, rr, f, ex = "") => `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rr)}" fill="${f}"${ex}/>`;
const el = (x, y, rx, ry, f, ex = "") => `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rx)}" ry="${r(ry)}" fill="${f}"${ex}/>`;
const tx = (x, y, s, t, f, ex = "") => `<text x="${r(x)}" y="${r(y)}" font-size="${s}" text-anchor="middle" fill="${f}" font-family="Arial,Helvetica,sans-serif"${ex}>${t}</text>`;
const tief = (x, y) => [VPX + (x - VPX) * TS, HOR + (y - HOR) * TS];
/* Teil mit Lupenmarke an (mx, my): die App malt die Marke bei (x+16, y−16) */
function teil(id, mx, my, kunst, extra = {}) {
  const w = WORT[id];
  const x = mx - 16, y = my + 16;
  S.teil(Object.assign({ id, de: w[0], syl: w[1], it: w[2], itSyl: w[3], en: w[4], lupe: w[5], x, y, steht: true,
    kunst: `<g transform="translate(${r(-x)} ${r(-y)})">${kunst}</g>` }, extra));
}
let clipN = 0;
const clip = (d) => { const id = S.id("c" + (clipN++)); S.def(`<clipPath id="${id}"><path d="${d}"/></clipPath>`); return `url(#${id})`; };
/* Fenster mit Rahmen, Glas mit Himmelsspiegelung und Fensterbank */
function fenster(x, y, w, h, o = {}) {
  const rahmen = o.rahmen || "#f4f2ec";
  let s = re(x - 0.8, y - 0.8, w + 1.6, h + 1.6, rahmen);
  s += re(x, y, w, h, o.glas || LG("glas", [[0, "#9fc3dc"], [0.55, "#5f86a6"], [1, "#3d5d78"]]));
  if (o.innen) s += o.innen;
  s += pl([[x, y + h * 0.75], [x + w * 0.55, y], [x + w * 0.85, y], [x, y + h]], "#fff", ' opacity=".14"');
  if (o.kreuz !== false) s += li(x + w / 2, y, x + w / 2, y + h, rahmen, 0.7) + li(x, y + h * 0.36, x + w, y + h * 0.36, rahmen, 0.6);
  if (o.bank !== false) s += re(x - 1.4, y + h + 0.6, w + 2.8, 1.3, o.bankFarbe || "#d9d4ca");
  return s;
}

/* ---------- Grundfarben -------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
S.def(`<pattern id="${S.id("fliese")}" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#f1f5f6"/><path d="M0 0H3M0 0V3" stroke="#c9d3d7" stroke-width=".3"/></pattern>`);
S.def(`<pattern id="${S.id("dielen")}" width="40" height="2.2" patternUnits="userSpaceOnUse"><rect width="40" height="2.2" fill="#b07a45"/><path d="M0 2.1H40M13 0V2.2M31 0V2.2" stroke="#7e5228" stroke-width=".3"/></pattern>`);
S.def(`<pattern id="${S.id("ziegel")}" width="6" height="3" patternUnits="userSpaceOnUse"><rect width="6" height="3" fill="#b5654a"/><path d="M0 2.9H6M3 0V1.5M0 1.5H6M0 1.5V3" stroke="#8a4636" stroke-width=".35"/></pattern>`);
const FLIESE = `url(#${S.id("fliese")})`, DIELEN = `url(#${S.id("dielen")})`, ZIEGEL = `url(#${S.id("ziegel")})`;
const STAHL = LG("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const HOLZ = LG("holz", [[0, "#b98552"], [1, "#8a5a31"]]);
const WEISS = LG("weiss", [[0, "#ffffff"], [1, "#dfe2e4"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Himmel, Ferne, Gehweg, Straße, Bordsteine
   ===================================================================== */
S.hinten(re(0, 0, 400, 200, LG("himmel", [[0, "#6b9ed3"], [0.6, "#a8c9e6"], [1, "#e3eef4"]])));
S.hinten(ci(360, 20, 70, RG("sonne", [[0, "#fff8dc", 0.6], [1, "#fff8dc", 0]])));
{
  let w = "";
  for (const [x, y, s] of [[60, 22, 1], [190, 14, 0.8], [300, 30, 1.1], [250, 56, 0.6], [120, 48, 0.55]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".92">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 5], [-10, 1.5, 10, 4], [11, 1, 12, 4.5], [-3, -3.5, 9, 5], [6, -4, 7, 4.5]]) w += el(x + dx * s, y + dy * s, rx * s, ry * s, "#fff");
    w += `</g>`;
  }
  S.hinten(w);
}
/* Ferne: Dächer und Bäume der Nachbarstraße hinter der Kita */
{
  let f = "";
  f += pl([[290, 132], [312, 112], [334, 132]], "#a9b6c2") + re(292, 132, 40, 20, "#bcc6cf");
  f += re(338, 104, 30, 50, "#b3bfca") + re(338, 102, 30, 2.5, "#9aa7b3");
  for (let y = 108; y < 130; y += 5) for (let x = 341; x < 366; x += 5) f += re(x, y, 2.6, 2.8, "#8d9fb0");
  for (const [x, y, rr] of [[300, 128, 12], [318, 122, 14], [372, 120, 15], [392, 126, 12], [356, 128, 10]]) f += ci(x, y, rr, RG("baum", [[0, "#8fb36a"], [0.7, "#5e8a45"], [1, "#46703a"]], 0.4, 0.35, 0.7));
  S.hinten(f);
}
/* Gehweg gegenüber, Straße, Gehweg vorne */
{
  let g = re(0, 185, 400, 11, LG("gehweg", [[0, "#cfcac0"], [1, "#bdb7ab"]]));
  for (let x = -40; x <= 440; x += 12) g += li(x, 185, VPX + (x - VPX) * 1.12, 196, "#a29c90", 0.25);
  g += li(0, 189, 400, 189, "#a29c90", 0.25) + li(0, 192.5, 400, 192.5, "#a29c90", 0.25);
  g += re(0, 195, 400, 2.4, LG("bord", [[0, "#e2ded6"], [1, "#9d978c"]]));
  g += re(0, 197.4, 400, 26.6, LG("asphalt", [[0, "#6f7377"], [1, "#5a5e62"]]));
  for (let i = 0; i < 260; i++) g += ci(rnd() * 400, 198 + rnd() * 25, 0.15 + rnd() * 0.25, rnd() < 0.5 ? "#888c90" : "#4c5054", ' opacity=".6"');
  for (let x = 4; x < 400; x += 22) g += re(x, 210, 11, 0.9, "#e9e7df", ' opacity=".9"');
  g += re(0, 224, 400, 3, LG("bord2", [[0, "#e6e2da"], [1, "#a39d92"]]));
  g += re(0, 227, 400, 73, LG("gehweg2", [[0, "#d3cec4"], [1, "#bab4a8"]]));
  for (let x = -200; x <= 600; x += 14) g += li(VPX + (x - VPX) * 1.0, 227, VPX + (x - VPX) * 1.55, 300, "#a29c90", 0.28);
  for (const y of [232, 238, 245, 253, 262, 273, 286]) g += li(0, y, 400, y, "#a29c90", 0.28);
  S.hinten(g);
}

/* =====================================================================
   ALTBAU — Schnitt (Puppenhaus). Hülle in der Kulisse, Zimmer als Teile.
   ===================================================================== */
const AX0 = 4, AX1 = 158;
const EG = { yB: 186, yD: 155.5 }, OG1 = { yB: 152, yD: 121.5 }, OG2 = { yB: 118, yD: 87.5 }, DACHB = 84, FIRST = 38;
{
  let h = "";
  /* Giebeldach: Dachhaut aus Biberschwanz, Sparren im Schnitt */
  const mx = (AX0 + AX1) / 2;
  h += pl([[AX0 - 6, DACHB + 2], [mx, FIRST - 5], [AX1 + 6, DACHB + 2], [AX1 + 2, DACHB + 2], [mx, FIRST - 0.5], [AX0 - 2, DACHB + 2]], LG("ziegeldach", [[0, "#b8513a"], [1, "#8c3a29"]]));
  h += pl([[AX0 - 2, DACHB + 2], [mx, FIRST - 0.5], [AX1 + 2, DACHB + 2], [AX1 - 1, DACHB + 2], [mx, FIRST + 3], [AX0 + 1, DACHB + 2]], "#6e4a2c");
  /* Schornstein */
  h += re(118, 46, 9, 20, ZIEGEL) + re(117, 44.5, 11, 2.5, "#7e3c2c");
  /* Außenwände, Decken im Schnitt (Mauerwerk hell, Holzbalkendecke) */
  const wand = LG("schnitt", [[0, "#e7dcc6"], [1, "#d3c4a8"]], 0, 0, 1, 0);
  h += re(AX0, DACHB, 3.2, 186 - DACHB, wand) + re(AX1 - 3.2, DACHB, 3.2, 186 - DACHB, wand);
  for (const y of [152, 118, 84]) {
    h += re(AX0, y, AX1 - AX0, 3.5, "#d9ccb2") + re(AX0, y + 1.1, AX1 - AX0, 1.3, "#8b6440");
    for (let x = AX0 + 4; x < AX1 - 3; x += 6) h += re(x, y + 1.1, 2.2, 1.3, "#6d4c2f");
  }
  /* Innenwände */
  h += re(62, EG.yD, 3, EG.yB - EG.yD, wand) + re(72, OG1.yD, 3, OG1.yB - OG1.yD, wand) + re(62, OG2.yD, 3, OG2.yB - OG2.yD, wand);
  /* Sockel und Kellerfenster */
  h += re(AX0 - 1, 183.5, AX1 - AX0 + 2, 3, "#9a8f7e");
  /* Schnittkante: feine dunkle Linie um alles */
  h += `<path d="M${AX0} 186V${DACHB}M${AX1} 186V${DACHB}" stroke="#7a6a52" stroke-width=".35"/>`;
  /* Stuckgesims an der Traufe (sichtbar außen) */
  h += re(AX0 - 3, DACHB - 0.2, 4, 3.8, "#efe6d3") + re(AX1 - 1, DACHB - 0.2, 4, 3.8, "#efe6d3");
  S.hinten(h);
}
/* Zimmer-Hilfe: Rückwand, Boden, Decke, linke Wand — perspektivisch zum Fluchtpunkt */
function zimmer(x0, x1, yB, yD, wand, boden, decke) {
  const [bx0, by0] = tief(x0, yD), [bx1, by1] = tief(x1, yB);
  let s = re(x0, yD, x1 - x0, yB - yD, LG("seite", [[0, "#000", 0.32], [1, "#000", 0.12]], 0, 0, 1, 0));
  s += pl([[x0, yD], [bx0, by0], [bx0, by1], [x0, yB]], wand) + pl([[x0, yD], [bx0, by0], [bx0, by1], [x0, yB]], "#000", ' opacity=".14"');
  s += re(bx0, by0, bx1 - bx0, by1 - by0, wand);
  if (yB > HOR) s += pl([[x0, yB], [x1, yB], [bx1, by1], [bx0, by1]], boden);
  if (yD < HOR) s += pl([[x0, yD], [x1, yD], [bx1, by0], [bx0, by0]], decke || "#eee8dc");
  /* Sockelleiste */
  s += li(bx0, by1 - 0.4, bx1, by1 - 0.4, "#f6f2ea", 0.8);
  return { s, bx0, by0, bx1, by1 };
}
const ZA = (d) => `<g clip-path="${clip(d)}">`;

/* ---------- DACH: das KINDERZIMMER -------------------------------- */
{
  const x0 = AX0 + 3.2, x1 = AX1 - 3.2, mx = (AX0 + AX1) / 2, yB = DACHB, top = FIRST + 3.5;
  const kante = (x) => yB - (yB - top) * (1 - Math.abs(x - mx) / (mx - x0 + 3));
  let k = ZA(`M${x0} ${yB}L${mx} ${top}L${x1} ${yB}Z`);
  k += pl([[x0, yB], [mx, top], [x1, yB]], LG("schraege", [[0, "#e9d9a8"], [1, "#d8c48c"]]));
  const t = (x, y) => tief(x, y);
  const A = t(x0, yB), Bq = t(mx, top), C = t(x1, yB);
  k += pl([A, Bq, C], LG("kiwand", [[0, "#fbefc2"], [1, "#f3e1a0"]]));
  /* Sterne an der Wand */
  for (let i = 0; i < 9; i++) { const x = 40 + rnd() * 100, y = 62 + rnd() * 18; if (y > kante(x) + 3) k += tx(x, y, 2.6, "★", i % 2 ? "#f2a33a" : "#7cb3e0"); }
  /* Dachfenster (schräg) */
  k += pl([[48, 64], [60, 57], [64, 64], [52, 71]], "#f4f2ec") + pl([[49.5, 64], [60, 58.2], [62.6, 63.6], [52.2, 69.6]], LG("dachglas", [[0, "#cfe6f7"], [1, "#7fb0d6"]]));
  /* Bett mit bunter Decke, Kissen, Teddy */
  k += re(90, 76, 32, 7.5, HOLZ) + re(90, 73.5, 2, 9.5, "#8a5a31") + re(120, 74.5, 2, 8.5, "#8a5a31");
  k += `<path d="M92 76.5 h28 v3 q-14 2 -28 0 Z" fill="#4f9fd8"/>` + re(92, 76.5, 28, 1.2, "#7fc0ec");
  for (let i = 0; i < 6; i++) k += ci(96 + i * 4.4, 78.2, 0.7, "#ffd34d");
  k += el(95, 75.2, 3.6, 1.6, "#fff");
  k += ci(116.5, 74.6, 1.9, "#b07a45") + ci(115.2, 73, 0.8, "#b07a45") + ci(117.8, 73, 0.8, "#b07a45") + el(116.5, 77.4, 2.2, 2.4, "#b07a45");
  /* Teppich, Spielzeug: Bauklötze, Ball, Kiste */
  k += el(70, 83, 14, 1.6, "#e46b5f", ' opacity=".85"');
  k += re(60, 79.5, 3, 3, "#e5463b") + re(63.4, 80, 3, 2.5, "#3a8fd8") + re(61.6, 77, 3, 2.5, "#f2c230");
  k += ci(76, 81.5, 2, "#5cb85c") + `<path d="M74 81.5 h4" stroke="#fff" stroke-width=".5"/>`;
  k += re(132, 76, 10, 7, "#3fa66a") + re(132, 76, 10, 1.4, "#56c07f") + tx(137, 81.4, 2.2, "TOYS", "#fff");
  /* Regal mit Büchern unter der Schräge */
  k += re(24, 78, 12, 5.5, HOLZ);
  for (let i = 0; i < 5; i++) k += re(25 + i * 2.1, 78.6, 1.6, 4, ["#d9534f", "#5bc0de", "#f0ad4e", "#5cb85c", "#9b59b6"][i]);
  k += `</g>`;
  teil("vw_kinderzimmer", 116, 66, k, { tipp: "Unter dem Dach ist das Kinderzimmer – mit Dachschräge und Dachfenster." });
}

/* ---------- 2. OG: SCHLAFZIMMER ------------------------------------ */
{
  const x0 = AX0 + 3.2, x1 = 62, Z = zimmer(x0, x1, OG2.yB, OG2.yD, LG("schlafwand", [[0, "#d6e0ec"], [1, "#bfcddd"]]), DIELEN);
  let k = ZA(`M${x0} ${OG2.yD}H${x1}V${OG2.yB}H${x0}Z`) + Z.s;
  const F = Z.by1;
  /* Kleiderschrank links an der Wand */
  k += re(24, F - 19, 10, 19, LG("schrank", [[0, "#efe9df"], [1, "#d6cdbf"]], 0, 0, 1, 0)) + li(29, F - 18.5, 29, F - 0.5, "#b9ae9c", 0.3) + re(28, F - 11, 0.5, 2, "#8c8273") + re(29.6, F - 11, 0.5, 2, "#8c8273");
  /* Bild über dem Bett */
  k += re(43, F - 23.5, 10, 6.5, "#f7f4ee") + re(43.8, F - 22.7, 8.4, 4.9, LG("bild1", [[0, "#9cc6e8"], [0.6, "#f3d38a"], [1, "#7fa36a"]]));
  /* Doppelbett mit zwei Kissen und Decke, Nachttische mit Lampen */
  k += re(37.5, F - 10, 21, 5, "#8a5a31");
  k += re(38, F - 6.5, 20, 4.5, "#f3efe7") + re(38, F - 3, 20, 3, "#7a5233");
  k += el(43, F - 7.3, 4, 1.6, "#fff") + el(53, F - 7.3, 4, 1.6, "#fff");
  k += `<path d="M38 ${r(F - 5.6)} h20 v3.4 h-20 Z" fill="#5d7fa8"/>` + re(38, F - 5.6, 20, 0.8, "#86a3c7");
  k += re(35, F - 4.4, 2.4, 4.4, HOLZ) + `<path d="M34.6 ${r(F - 6.8)} h3.2 l-.6 -2 h-2 Z" fill="#f7e3a3"/>`;
  k += `</g>`;
  teil("vw_schlafzimmer", 18, 98, k, { tipp: "Im Schlafzimmer stehen das Doppelbett und der Kleiderschrank." });
}

/* ---------- 2. OG: BADEZIMMER (mit Dusche und Waschtisch als eigene Teile) */
const BAD = { x0: 65, x1: AX1 - 3.2 };
{
  const Z = zimmer(BAD.x0, BAD.x1, OG2.yB, OG2.yD, FLIESE, "#c8ced2");
  let k = ZA(`M${BAD.x0} ${OG2.yD}H${BAD.x1}V${OG2.yB}H${BAD.x0}Z`) + Z.s;
  const F = Z.by1;
  /* Fliesenspiegel mit blauer Bordüre, Fenster */
  k += re(Z.bx0, F - 14.5, BAD.x1 - Z.bx0, 1, "#4f8fc0");
  k += fenster(118, F - 25, 9, 8, { bankFarbe: "#e5e9ec" });
  /* Badewanne, Armatur, Badeente, Handtuch */
  k += `<path d="M98 ${r(F - 7)} h26 v5 q0 2 -2 2 h-22 q-2 0 -2 -2 Z" fill="${WEISS}"/>` + re(98, F - 7.6, 26, 1.4, "#fff");
  k += re(113, F - 11, 0.8, 3.6, "#b5bcc2") + re(111.5, F - 11, 3.8, 0.8, "#c9cfd4");
  k += el(104, F - 8.2, 1.4, 1, "#ffd23f") + ci(105, F - 9.2, 0.8, "#ffd23f");
  k += re(126, F - 12, 6, 0.6, "#c9cfd4") + re(126.5, F - 11.6, 5, 7, "#f08b6c");
  /* Badvorleger */
  k += el(110, 117, 9, 0.8, "#7fb7a8");
  k += `</g>`;
  teil("vw_badezimmer", 101, 95, k, { tipp: "Im Badezimmer gibt es eine Badewanne, eine Dusche und ein Waschbecken." });
}

/* ---------- 1. OG: KÜCHE ------------------------------------------- */
{
  const x0 = AX0 + 3.2, x1 = 72, Z = zimmer(x0, x1, OG1.yB, OG1.yD, LG("kuewand", [[0, "#dcebd5"], [1, "#c8dcbf"]]), "url(#" + S.id("kbod") + ")");
  S.def(`<pattern id="${S.id("kbod")}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#d9d2c4"/><rect width="2" height="2" fill="#bfb5a4"/><rect x="2" y="2" width="2" height="2" fill="#bfb5a4"/></pattern>`);
  let k = ZA(`M${x0} ${OG1.yD}H${x1}V${OG1.yB}H${x0}Z`) + Z.s;
  const F = Z.by1;
  /* Küchenzeile: Unterschränke, Arbeitsplatte, Herd, Spüle, Hängeschränke, Dunstabzug, Kühlschrank */
  k += re(24, F - 8.6, 34, 8.6, LG("front", [[0, "#ffffff"], [1, "#e4e1da"]]));
  for (let x = 24; x < 58; x += 6.8) k += li(x, F - 8.2, x, F - 0.4, "#c2bdb3", 0.3) + re(x + 2.6, F - 7, 1.6, 0.4, "#9c968c");
  k += re(23.5, F - 9.4, 35, 1.1, "#7b6a58");
  k += re(24, F - 15, 34, 5.6, FLIESE);
  k += re(40, F - 10.4, 8, 1, "#2c2c2c") + ci(42, F - 9.9, 0.9, "#555") + ci(46, F - 9.9, 0.9, "#555");
  k += re(29, F - 9.6, 6, 0.6, "#b5bcc2") + `<path d="M32 ${r(F - 9.6)} v-2.6 h1.6" stroke="#9aa3aa" stroke-width=".5" fill="none"/>`;
  k += re(24, F - 24, 14, 7.4, "#fbfaf6") + re(50, F - 24, 8, 7.4, "#fbfaf6") + li(31, F - 24, 31, F - 16.6, "#cfc9bf", 0.3);
  k += pl([[39, F - 17], [49, F - 17], [47, F - 21], [41, F - 21]], STAHL) + re(42.6, F - 26, 2.8, 5, STAHL);
  k += re(59.5, F - 24.5, 9, 24.5, LG("kuehl", [[0, "#f0f2f3"], [0.5, "#d5dadd"], [1, "#b8bec2"]], 0, 0, 1, 0)) + li(59.5, F - 15, 68.5, F - 15, "#9aa3aa", 0.3) + re(60.6, F - 22, 0.6, 5, "#8c949a") + re(60.6, F - 13, 0.6, 6, "#8c949a");
  /* Esstisch mit zwei Stühlen vorne */
  k += re(14, OG1.yB - 6.6, 16, 1.2, HOLZ) + re(15, OG1.yB - 5.4, 1, 5.4, "#7d4f2a") + re(28, OG1.yB - 5.4, 1, 5.4, "#7d4f2a");
  k += el(22, OG1.yB - 7.4, 2.4, 0.8, "#e65c3a") + ci(19, OG1.yB - 7.6, 0.9, "#fff");
  k += re(10, OG1.yB - 9, 1, 9, "#5f3d22") + re(10, OG1.yB - 4, 4, 0.9, "#5f3d22");
  k += `</g>`;
  teil("vw_kueche", 18, 132, k, { tipp: "In der Küche wird gekocht und gegessen." });
}

/* ---------- 1. OG: WOHNZIMMER ------------------------------------- */
{
  const x0 = 75, x1 = AX1 - 3.2, Z = zimmer(x0, x1, OG1.yB, OG1.yD, LG("wowand", [[0, "#f1e1c6"], [1, "#e3cda9"]]), DIELEN);
  let k = ZA(`M${x0} ${OG1.yD}H${x1}V${OG1.yB}H${x0}Z`) + Z.s;
  const F = Z.by1;
  /* Stuckrosette und Deckenlampe */
  k += li(112, OG1.yD, 112, OG1.yD + 5, "#555", 0.3) + `<path d="M109 ${OG1.yD + 7} q3 -3 6 0 Z" fill="#e8b04a"/>`;
  /* hohes Kastenfenster mit Vorhängen */
  k += fenster(132, F - 23, 11, 17, { bankFarbe: "#efe6d3" });
  k += `<path d="M130 ${r(F - 24)} q2 9 0 18 h2.4 q-1 -9 0 -18 Z" fill="#c0504d"/><path d="M145.5 ${r(F - 24)} q-2 9 0 18 h-2.4 q1 -9 0 -18 Z" fill="#c0504d"/>`;
  /* Bücherregal */
  k += re(88, F - 22, 12, 22, HOLZ);
  for (let j = 0; j < 4; j++) { k += re(88.8, F - 21 + j * 5.4, 10.4, 4.6, "#6d4425"); for (let i = 0; i < 5; i++) k += re(89.2 + i * 2, F - 20.4 + j * 5.4, 1.6, 4 - (i % 2) * 0.6, ["#c0392b", "#2980b9", "#f1c40f", "#27ae60", "#ecf0f1"][(i + j) % 5]); }
  /* Sofa mit Kissen, Couchtisch, Stehlampe, Pflanze, Fernseher */
  k += `<path d="M103 ${r(F - 2)} v-8 q0 -1.5 1.5 -1.5 h22 q1.5 0 1.5 1.5 v8 Z" fill="${LG("sofa", [[0, "#4f7b8c"], [1, "#3a5d6b"]])}"/>` + re(102, F - 5.4, 27, 4.4, "#45707f") + re(101.5, F - 7, 2.6, 6, "#3a5d6b") + re(127, F - 7, 2.6, 6, "#3a5d6b");
  k += re(106, F - 9.6, 5, 4, "#e9c46a") + re(119.5, F - 9.6, 5, 4, "#e76f51");
  k += re(109, OG1.yB - 4.6, 16, 1, HOLZ) + re(110, OG1.yB - 3.6, 0.8, 3.6, "#7d4f2a") + re(123.2, OG1.yB - 3.6, 0.8, 3.6, "#7d4f2a");
  k += re(80.6, F - 21, 0.6, 21, "#444") + `<path d="M78.4 ${r(F - 21)} h5 l-1 -3.4 h-3 Z" fill="#f4e2b0"/>`;
  k += re(148, F - 4, 4, 4, "#b5653d") + ci(150, F - 7, 3.2, "#4f8a3c") + ci(148.6, F - 9.4, 2.2, "#5d9c47");
  k += `</g>`;
  teil("vw_wohnzimmer", 121, 128, k, { tipp: "Im Wohnzimmer sitzt die Familie auf dem Sofa und liest oder sieht fern." });
}

/* ---------- EG: FLUR ----------------------------------------------- */
{
  const x0 = AX0 + 3.2, x1 = 62, Z = zimmer(x0, x1, EG.yB, EG.yD, LG("flurwand", [[0, "#efd9c6"], [1, "#e0c3a9"]]), DIELEN);
  let k = ZA(`M${x0} ${EG.yD}H${x1}V${EG.yB}H${x0}Z`) + Z.s;
  const F = Z.by1;
  /* Wohnungstür (Altbau, Kassetten, Oberlicht) */
  k += re(44, F - 21.6, 10, 21.6, "#f3eee4") + re(45, F - 20.6, 8, 20.6, LG("tuer", [[0, "#8b5e3c"], [1, "#6e4528"]]));
  k += re(46, F - 19, 5.6, 7, "none", ' stroke="#5a3820" stroke-width=".4"') + re(46, F - 10, 5.6, 8, "none", ' stroke="#5a3820" stroke-width=".4"') + ci(51.8, F - 10.6, 0.6, "#d8b46a");
  /* Garderobe mit Jacken, Spiegel, Schuhregal, Läufer */
  k += re(25, F - 20, 14, 1.2, HOLZ);
  k += `<path d="M27 ${r(F - 19)} q-2 6 -1 11 h5 q1 -6 -1 -11 Z" fill="#c0504d"/><path d="M32 ${r(F - 19)} q-2 7 -1 12 h5 q1 -6 -1.4 -12 Z" fill="#3c5a80"/>`;
  k += el(37, F - 17, 1.8, 1.1, "#e9c46a");
  k += re(25, F - 4.5, 14, 4.5, HOLZ) + re(26, F - 6, 3.4, 1.6, "#333") + re(30.4, F - 6, 3.4, 1.6, "#a0522d") + re(35, F - 6, 3, 1.6, "#d14b4b");
  k += el(40, 183.5, 11, 1.4, "#a23b3b", ' opacity=".85"');
  k += `</g>`;
  teil("vw_flur", 18, 165, k, { tipp: "Im Flur hängen die Jacken an der Garderobe." });
}

/* ---------- EG: WASCHKÜCHE ---------------------------------------- */
{
  const x0 = 65, x1 = AX1 - 3.2, Z = zimmer(x0, x1, EG.yB, EG.yD, LG("beton", [[0, "#d4d3cd"], [1, "#bdbcb5"]]), "#a9aaa4");
  let k = ZA(`M${x0} ${EG.yD}H${x1}V${EG.yB}H${x0}Z`) + Z.s;
  const F = Z.by1;
  /* Rohre an der Decke, Neonröhre, Kellerfenster */
  k += re(x0, EG.yD + 1.4, x1 - x0, 1, "#9aa3aa") + re(x0, EG.yD + 3, x1 - x0, 0.7, "#b0763c");
  k += re(118, EG.yD + 5, 14, 1.2, "#f8fbff") + fenster(84, EG.yD + 5, 12, 5, { kreuz: false, bankFarbe: "#bdbcb5" });
  /* zwei Waschmaschinen, ein Trockner, Waschbecken */
  const wm = (x, t) => {
    let g = re(x, F - 11, 10, 11, WEISS) + re(x, F - 11, 10, 2.2, "#e7eaec") + re(x + 1, F - 10.4, 3, 1, "#9fb3c2");
    g += ci(x + 5, F - 4.6, 3.3, "#9aa3aa") + ci(x + 5, F - 4.6, 2.5, t ? "#cfd8de" : LG("trommel", [[0, "#7fb0d6"], [1, "#3c6e95"]]));
    if (!t) g += `<path d="M${x + 3} ${r(F - 4)} q2 -1.6 4 0" stroke="#fff" stroke-width=".5" fill="none" opacity=".7"/>`;
    return g;
  };
  k += wm(86, false) + wm(97.5, false) + wm(109, true) + re(109, F - 22, 10, 10.5, WEISS) + ci(114, F - 16.6, 3, "#cfd8de");
  k += re(124, F - 10, 9, 6, "#e7eaec") + re(126, F - 4, 1, 4, "#9aa3aa") + re(130, F - 4, 1, 4, "#9aa3aa");
  /* Wäscheleine mit Wäsche */
  k += li(78, EG.yD + 9, x1, EG.yD + 9, "#666", 0.25);
  for (const [x, w, c] of [[80, 5, "#e76f51"], [87, 4, "#fff"], [136, 6, "#2a9d8f"], [144, 4, "#f4a261"], [149.5, 3.6, "#e9e9e9"]]) k += re(x, EG.yD + 9, w, 6 + (w % 2), c);
  /* Wäschekorb */
  k += `<path d="M137 ${r(EG.yB - 1)} l1 -5 h8 l1 5 Z" fill="#d9b26e"/>` + el(142, EG.yB - 6.4, 4.6, 1, "#fff");
  k += `</g>`;
  teil("vw_waschkueche", 78, 171, k, { tipp: "In der Waschküche im Erdgeschoss stehen die Waschmaschinen aller Mieter." });
}

/* ---------- im Bad: DUSCHE und WASCHTISCH (Pflege) ----------------- */
{
  const F = tief(0, OG2.yB)[1];
  let k = re(70, F - 22, 15, 22, LG("duschglas", [[0, "#e6f3f8", 0.55], [1, "#bcdbe8", 0.35]], 0, 0, 1, 0)) + re(70, F - 22, 15, 22, "none", ' stroke="#b5bcc2" stroke-width=".6"');
  k += re(69.6, F - 1.4, 15.8, 1.6, "#f3f5f6");
  k += li(80, F - 21, 80, F - 13, "#9aa3aa", 0.5) + `<path d="M80 ${r(F - 21)} h-3.6" stroke="#9aa3aa" stroke-width=".5"/>` + el(76.4, F - 20.4, 2, 0.6, "#c9cfd4");
  for (let i = 0; i < 6; i++) k += li(75.4 + i * 0.4, F - 19.6, 74 + i * 0.7, F - 4, "#8fc3e0", 0.25, ' opacity=".7"');
  k += li(73, F - 21, 75.4, F - 3, "#fff", 0.6, ' opacity=".55"');
  k += re(82, F - 12, 2.4, 0.5, "#c9cfd4") + re(82.4, F - 13.6, 0.8, 1.6, "#e76f51") + re(83.4, F - 13, 0.8, 1, "#2a9d8f");
  teil("vw_dusche", 76, 100, k, { oben: true, tipp: "Die Duschkabine hat eine Glastür." });
}
{
  const F = tief(0, OG2.yB)[1];
  let k = re(136.5, F - 10, 13, 2, WEISS) + `<path d="M137.5 ${r(F - 8)} h11 q-1 5 -5.5 5 q-4.5 0 -5.5 -5 Z" fill="#f3f5f6"/>` + re(142.5, F - 3.4, 1.6, 3.4, "#e3e7e9");
  k += re(142.6, F - 12.4, 0.8, 2.4, "#b5bcc2") + re(141.6, F - 12.6, 3, 0.7, "#c9cfd4");
  k += re(136, F - 25, 14, 11, "#f7f7f5") + re(137, F - 24, 5.6, 9, LG("spiegel", [[0, "#e8f4fa"], [1, "#a9c9da"]], 0, 0, 1, 1)) + re(143.4, F - 24, 5.6, 9, LG("spiegel", [[0, "#e8f4fa"], [1, "#a9c9da"]], 0, 0, 1, 1));
  k += re(136, F - 26.2, 14, 1, "#fffbe6");
  k += re(137.6, F - 13.6, 1.8, 3.6, "#7fc4b8", ' opacity=".85"') + li(138.2, F - 15.6, 138.6, F - 13, "#e63946", 0.4) + li(138.9, F - 15.4, 138.9, F - 13, "#457b9d", 0.4);
  k += re(147, F - 13.6, 1.4, 3.6, "#f4a261") + re(147.1, F - 14.4, 1.2, 0.8, "#fff");
  teil("vw_pflege", 135, 89, k, { oben: true, tipp: "Am Waschbecken putzt man sich die Zähne und wäscht sich das Gesicht." });
}

/* =====================================================================
   ÄRZTEHAUS — vier Praxen übereinander, jede ein eigenes Teil
   ===================================================================== */
const ZX0 = 162, ZX1 = 230;
const PUTZ = LG("putz", [[0, "#f4f3ef"], [1, "#dedbd3"]], 0, 0, 1, 0);
S.hinten(re(ZX0 - 1, 66.5, ZX1 - ZX0 + 2, 3.5, "#9ea3a6") + re(ZX0, 70, ZX1 - ZX0, 2, "#c6c8c6"));
function praxisStock(y0, h, schrift, unter, deko) {
  let k = re(ZX0, y0, ZX1 - ZX0, h, PUTZ);
  for (let i = 0; i < 4; i++) {
    const x = ZX0 + 4 + i * 16;
    k += re(x - 0.6, y0 + 2.4, 13.2, 15.2, "#5b636a") + re(x, y0 + 3, 12, 14, LG("praxglas", [[0, "#b9d4e6"], [0.6, "#7ea2bd"], [1, "#59778f"]]));
    k += pl([[x, y0 + 13], [x + 7, y0 + 3], [x + 10, y0 + 3], [x, y0 + 17]], "#fff", ' opacity=".16"');
    k += li(x + 6, y0 + 3, x + 6, y0 + 17, "#5b636a", 0.5);
    if (deko) k += deko(x, y0 + 3, i);
  }
  k += re(ZX0, y0 + h - 7.6, ZX1 - ZX0, 7.6, "#ffffff") + li(ZX0, y0 + h - 7.6, ZX1, y0 + h - 7.6, "#c9c6be", 0.3);
  k += tx((ZX0 + ZX1) / 2 + 4, y0 + h - 3.6, 3.3, schrift, "#2c5d7c", ' font-weight="bold"');
  if (unter) k += tx((ZX0 + ZX1) / 2 + 4, y0 + h - 0.9, 1.9, unter, "#5f7486");
  return k;
}
/* Zahnarzt (3. OG) */
{
  const zahn = (x, y) => `<path d="M${x - 2.2} ${y - 2} q2.2 -1.6 4.4 0 q.6 2.6 -.6 5 l-.9 -2 l-.9 2 q-1.2 -2.4 -.6 -5 Z" fill="#fff"/>`;
  let k = praxisStock(72, 28, "Zahnarztpraxis Dr. Berg", "Zahnmedizin · Prophylaxe");
  k += `<g transform="translate(${ZX0 + 5.2} 96)">${zahn(0, 0).replace('fill="#fff"', 'fill="#5aa9d6"')}</g>`;
  k += `<g opacity=".95">${zahn(ZX0 + 26, 81)}${zahn(ZX0 + 58, 81)}</g>`;
  teil("vw_zahnarzt", ZX0 + 10, 82, k, { tipp: "Zum Zahnarzt geht man zweimal im Jahr zur Kontrolle." });
}
/* Kinderarzt (2. OG): bunte Fensterbilder */
{
  const deko = (x, y, i) => i === 0 ? ci(x + 3, y + 3, 1.8, "#ffd23f") : i === 1 ? `<path d="M${x + 2} ${y + 11} v-6 l1.4 -2.4 h1.2 v8.4 Z" fill="#f4a261"/>` + ci(x + 3.2, y + 5, 0.4, "#6b3b1a") : i === 2 ? el(x + 9, y + 4, 1.5, 2, "#e63946") + li(x + 9, y + 6, x + 9, y + 10, "#fff", 0.2) : `<path d="M${x + 2} ${y + 10} q4 -6 8 0" stroke="#e63946" stroke-width=".6" fill="none"/><path d="M${x + 3} ${y + 10} q3 -4.5 6 0" stroke="#ffd23f" stroke-width=".6" fill="none"/><path d="M${x + 4} ${y + 10} q2 -3 4 0" stroke="#2a9d8f" stroke-width=".6" fill="none"/>`;
  let k = praxisStock(100, 28, "Kinder- und Jugendarzt", "Dr. med. S. Kaya · Vorsorge · Impfungen", deko);
  teil("vw_kinderarzt", ZX0 + 10, 110, k, { tipp: "Beim Kinderarzt gibt es die Vorsorge-Untersuchungen U1 bis U9." });
}
/* Hausarzt (1. OG): Lamellen halb unten, Äskulapstab */
{
  const deko = (x, y) => { let g = ""; for (let j = 0; j < 6; j++) g += re(x, y + j * 1, 12, 0.6, "#e9ecee", ' opacity=".9"'); return g; };
  let k = praxisStock(128, 28, "Hausarztpraxis · Allgemeinmedizin", "Dr. med. A. Yilmaz · Sprechzeiten Mo–Fr 8–12 Uhr", deko);
  k += li(ZX0 + 5.4, 150.4, ZX0 + 5.4, 155.4, "#2c5d7c", 0.5) + `<path d="M${ZX0 + 4.4} 151.4 q2 .8 0 1.6 q-2 .8 0 1.6" stroke="#2c5d7c" stroke-width=".45" fill="none"/>`;
  teil("vw_arztpraxis", ZX0 + 10, 138, k, { tipp: "In der Arztpraxis meldet man sich zuerst an der Anmeldung an." });
}
/* Physiotherapie (EG): Glasfront, Tür, Praxisschilder */
{
  const y0 = 156;
  let k = re(ZX0, y0, ZX1 - ZX0, 30, PUTZ) + re(ZX0, 183.6, ZX1 - ZX0, 2.4, "#8e9396");
  /* Eingangstür mit Vordach */
  k += re(ZX0 + 2, 160, 12, 26, "#4a5258") + re(ZX0 + 3, 161, 10, 25, LG("tuerglas", [[0, "#cfe1ec"], [1, "#7c9db4"]])) + re(ZX0 + 4.5, 172, 0.7, 4, "#c9cfd4");
  k += re(ZX0 + 1, 158, 14, 1.6, "#6c757b");
  /* Praxisschilder am Pfeiler */
  const sch = [["#e3e7ea", "Physio"], ["#e3e7ea", "Hausarzt"], ["#e3e7ea", "Kinderarzt"], ["#e3e7ea", "Zahnarzt"]];
  sch.forEach(([c, t], i) => { k += re(ZX0 + 15.4, 163 + i * 4.2, 6.4, 3.6, LG("schild", [[0, "#f6f7f8"], [1, "#b9c0c6"]], 0, 0, 1, 1)) + tx(ZX0 + 18.6, 165.6 + i * 4.2, 1.5, t, "#24435a"); });
  /* große Fensterfront mit Folienband */
  k += re(ZX0 + 23, 159, 44, 23.6, "#4a5258") + re(ZX0 + 24, 160, 42, 21.6, LG("physglas", [[0, "#c6dceb"], [0.5, "#9bbbd2"], [1, "#6f8fa8"]]));
  /* drinnen: Behandlungsliege, Gymnastikball, Sprossenwand */
  k += re(ZX0 + 28, 176, 14, 2, "#3f7f8c") + re(ZX0 + 29, 178, 1, 3.6, "#555") + re(ZX0 + 40, 178, 1, 3.6, "#555");
  k += ci(ZX0 + 50, 177.5, 3.8, "#e76f51");
  for (let i = 0; i < 6; i++) k += li(ZX0 + 56, 163 + i * 3, ZX0 + 64, 163 + i * 3, "#c79a5a", 0.6);
  k += li(ZX0 + 56, 162, ZX0 + 56, 181, "#c79a5a", 0.8) + li(ZX0 + 64, 162, ZX0 + 64, 181, "#c79a5a", 0.8);
  k += re(ZX0 + 24, 166, 42, 6.2, "#ffffff", ' opacity=".86"') + tx(ZX0 + 45, 170.5, 3.5, "PHYSIOTHERAPIE", "#1f7a8c", ' font-weight="bold"');
  k += li(ZX0 + 45, 160, ZX0 + 45, 181.6, "#4a5258", 0.6);
  k += pl([[ZX0 + 24, 176], [ZX0 + 34, 160], [ZX0 + 38, 160], [ZX0 + 24, 181.6]], "#fff", ' opacity=".14"');
  teil("vw_physio", ZX0 + 8, 171, k, { tipp: "In der Physiotherapie macht man Übungen, damit der Körper wieder gesund wird." });
}

/* =====================================================================
   NEUBAU mit Balkonen: Waschsalon (EG), Geburtstag (1. OG),
   Wohnung zu vermieten (2. OG), 3. OG Kulisse
   ===================================================================== */
const NX0 = 234, NX1 = 296;
const NPUTZ = LG("nputz", [[0, "#ece6da"], [1, "#d8d0c0"]], 0, 0, 1, 0);
function balkon(y, inhalt = "") {
  let s = re(NX0 + 30, y - 0.5, 33, 2.2, "#c9c3b6") + inhalt;
  s += re(NX0 + 30.5, y - 8.5, 32, 8, LG("bglas", [[0, "#dfeef5", 0.65], [1, "#a8c7d6", 0.55]])) + re(NX0 + 30, y - 9, 33, 1, "#7f878c");
  return s;
}
function nStock(y0, opt = {}) {
  let k = re(NX0, y0, NX1 - NX0, 28, NPUTZ) + re(NX0, y0, 28, 28, "#6f777d", ' opacity=".9"');
  k += fenster(NX0 + 6, y0 + 5, 15, 15, { rahmen: "#3d4449", bankFarbe: "#555c61", innen: opt.innenL });
  k += re(NX0 + 34, y0 + 3, 24, 22.5, "#3d4449") + re(NX0 + 35, y0 + 4, 22, 21.5, opt.glas || LG("nglas", [[0, "#a9c6d8"], [1, "#4f6f87"]]));
  if (opt.vorhang) k += re(NX0 + 35, y0 + 4, 4, 21.5, opt.vorhang) + re(NX0 + 53, y0 + 4, 4, 21.5, opt.vorhang);
  if (opt.innenR) k += opt.innenR;
  k += li(NX0 + 46, y0 + 4, NX0 + 46, y0 + 25.5, "#3d4449", 0.6);
  k += pl([[NX0 + 35, y0 + 18], [NX0 + 45, y0 + 4], [NX0 + 49, y0 + 4], [NX0 + 35, y0 + 25]], "#fff", ' opacity=".12"');
  k += balkon(y0 + 28, opt.balkon || "");
  return k;
}
S.hinten(re(NX0 - 1, 66, NX1 - NX0 + 2, 4, "#5d646a") + nStock(70, { vorhang: "#e9e1cf", balkon: `<rect x="${NX0 + 54}" y="${88}" width="5" height="5" fill="#b5653d"/>` + ci(NX0 + 56.5, 86, 3.4, "#5d9c47") }));
/* 2. OG: leere Wohnung, Banner „Zu vermieten“ */
{
  let k = nStock(98, { glas: LG("leer", [[0, "#cdd6dc"], [1, "#a0adb6"]]), innenL: `<rect x="${NX0 + 6}" y="114" width="15" height="6" fill="#e8e3d8" opacity=".6"/>`, innenR: re(NX0 + 35, 119, 22, 6.5, "#e5ded0", ' opacity=".7"') + re(NX0 + 40, 109, 9, 6, "#f7f4ee", ' opacity=".8"') });
  k += re(NX0 + 31, 118.3, 31, 7.4, "#ffd23f") + re(NX0 + 31, 118.3, 31, 7.4, "none", ' stroke="#c99a00" stroke-width=".4"');
  k += tx(NX0 + 46.5, 121.9, 3.1, "ZU VERMIETEN", "#c0262d", ' font-weight="bold"') + tx(NX0 + 46.5, 124.8, 1.9, "3 Zi. · 78 m² · Balkon", "#333");
  k += re(NX0 + 9, 107, 9, 4, "#fff") + tx(NX0 + 13.5, 109.8, 1.6, "frei ab 1.11.", "#c0262d");
  teil("vw_besichtigung", NX0 + 18, 104, k, { tipp: "Die Wohnung ist leer. Heute kommen Leute zur Besichtigung." });
}
/* 1. OG: Balkon mit Luftballons und Girlande */
{
  let k = nStock(126, { vorhang: "#f2c6a0" });
  /* Girlande mit Wimpeln am Fenster */
  k += `<path d="M${NX0 + 35} 131 q11 5 22 0" stroke="#666" stroke-width=".25" fill="none"/>`;
  for (let i = 0; i < 7; i++) { const x = NX0 + 36.5 + i * 3.1, y = 131.6 + Math.sin((i + 0.5) / 7 * Math.PI) * 2.2; k += pl([[x - 1.1, y], [x + 1.1, y], [x, y + 2.4]], ["#e63946", "#ffd23f", "#2a9d8f", "#4f8fd8", "#f4a261", "#9b5de5", "#e63946"][i]); }
  /* Ballons am Geländer */
  for (const [x, y, c] of [[NX0 + 33, 135, "#e63946"], [NX0 + 37, 132.6, "#ffd23f"], [NX0 + 59, 134, "#4f8fd8"], [NX0 + 62, 137, "#2a9d8f"], [NX0 + 55.5, 131.8, "#f06292"]]) {
    k += `<path d="M${x} ${y + 3} q1 4 ${x < NX0 + 46 ? 1.5 : -1.5} ${r(146 - y - 3)}" stroke="#777" stroke-width=".2" fill="none"/>`;
    k += el(x, y, 2.4, 3, c) + el(x - 0.8, y - 1.2, 0.6, 0.9, "#fff", ' opacity=".55"') + pl([[x - 0.5, y + 3.2], [x + 0.5, y + 3.2], [x, y + 2.6]], c);
  }
  k += re(NX0 + 34, 147.6, 25, 4.4, "#fff") + tx(NX0 + 46.5, 150.9, 3, "ALLES GUTE!", "#e63946", ' font-weight="bold"');
  teil("vw_geburtstag", NX0 + 18, 132, k, { tipp: "Hier feiert jemand Geburtstag – mit Luftballons und Girlande." });
}
/* EG: Waschsalon */
{
  let k = re(NX0, 154, NX1 - NX0, 32, "#3d4449") + re(NX0, 154, NX1 - NX0, 7, LG("wsschild", [[0, "#1f6fb2"], [1, "#16558a"]]));
  k += tx((NX0 + NX1) / 2, 159.4, 4.4, "WASCHSALON", "#fff", ' font-weight="bold" letter-spacing=".3"');
  k += re(NX0 + 2, 162, NX1 - NX0 - 4, 22, LG("wsinnen", [[0, "#eef3f6"], [1, "#cfd9df"]]));
  /* Reihe Waschmaschinen mit runden Bullaugen, Klapptisch */
  for (let i = 0; i < 4; i++) { const x = NX0 + 4 + i * 10.4; k += re(x, 170, 9.4, 13, WEISS) + re(x, 170, 9.4, 2, "#d9dee1") + ci(x + 4.7, 177.4, 3.2, "#8f979e") + ci(x + 4.7, 177.4, 2.4, i === 1 ? "#f4a261" : LG("trommel", [[0, "#7fb0d6"], [1, "#3c6e95"]])); k += re(x + 6.4, 170.5, 2.2, 1, "#2a9d8f"); }
  k += re(NX0 + 46, 166, 12, 4, "#f7f7f5") + tx(NX0 + 52, 168.8, 1.8, "SB 6–22 Uhr", "#1f6fb2");
  k += re(NX0 + 47, 176, 13, 1.2, "#b98552") + re(NX0 + 48, 177.2, 0.8, 5.8, "#777") + re(NX0 + 58, 177.2, 0.8, 5.8, "#777");
  /* Schaufenster-Spiegelung und Pfosten */
  k += pl([[NX0 + 2, 178], [NX0 + 14, 162], [NX0 + 19, 162], [NX0 + 2, 184]], "#fff", ' opacity=".18"');
  k += li(NX0 + 31, 162, NX0 + 31, 184, "#3d4449", 0.8) + re(NX0, 184, NX1 - NX0, 2, "#2d3337");
  teil("vw_waschsalon", NX0 + 12, 175, k, { tipp: "Im Waschsalon wäscht man Wäsche gegen Geld, wenn man zu Hause keine Maschine hat." });
}

/* =====================================================================
   KITA — bunte Fassade, Regenbogen-Schild, Zaun
   ===================================================================== */
{
  const X0 = 300, X1 = 398;
  let k = re(X0 - 1, 128, X1 - X0 + 2, 3, "#7d8a5e") + re(X0, 130, X1 - X0, 56, LG("kitaputz", [[0, "#fbf7ee"], [1, "#e9e1d0"]], 0, 0, 1, 0));
  /* Farbfelder zwischen den Fenstern */
  const farben = ["#f4a261", "#2a9d8f", "#e9c46a", "#e76f51", "#4f8fd8"];
  for (let i = 0; i < 5; i++) { k += re(X0 + 2 + i * 19.4, 133, 5, 24, farben[i]); k += re(X0 + 2 + i * 19.4, 160, 5, 23, farben[(i + 2) % 5]); }
  for (let i = 0; i < 4; i++) {
    const x = X0 + 8.4 + i * 19.4;
    k += fenster(x, 135, 12, 14, { rahmen: "#fff", bankFarbe: "#ddd" });
    /* Kinderbilder: Sonne, Handabdruck, Blume */
    k += i % 2 ? ci(x + 3, 138.5, 1.6, "#ffd23f") + `<path d="M${x + 7} 146 l1 -3 l1 3 l1 -3 l1 3" stroke="#e63946" stroke-width=".5" fill="none"/>` : ci(x + 8.6, 139, 1.2, "#e63946") + li(x + 8.6, 140, x + 8.6, 144, "#2a9d8f", 0.5) + re(x + 1.6, 144, 3, 3, "#4f8fd8");
    if (i !== 1) k += fenster(x, 163, 12, 16, { rahmen: "#fff", bankFarbe: "#ddd" });
  }
  /* Eingang mit Vordach */
  k += re(X0 + 27, 161, 12.5, 25, "#f4a261") + re(X0 + 28.5, 163, 9.5, 23, LG("kitatuer", [[0, "#d4e8f2"], [1, "#8db3c9"]])) + re(X0 + 25, 159.5, 16.5, 2, "#e76f51");
  /* Schild mit Regenbogen */
  k += re(X0 + 50, 150.5, 46, 9.5, "#fff") + re(X0 + 50, 150.5, 46, 9.5, "none", ' stroke="#ccc" stroke-width=".3"');
  ["#e63946", "#f4a261", "#ffd23f", "#2a9d8f", "#4f8fd8"].forEach((c, i) => { k += `<path d="M${X0 + 52 + i * 0.7} 158.6 a${5.6 - i * 0.7} ${5.6 - i * 0.7} 0 0 1 ${11.2 - i * 1.4} 0" stroke="${c}" stroke-width=".7" fill="none"/>`; });
  k += tx(X0 + 80, 155.4, 3.6, "Kita Regenbogen", "#2a6f97", ' font-weight="bold" font-family="Comic Sans MS,Arial,sans-serif"') + tx(X0 + 80, 158.7, 1.8, "Kindergarten · Krippe", "#666");
  /* Sockel */
  k += re(X0, 184, X1 - X0, 2, "#a9a091");
  /* Zaun aus bunten Latten vor dem Haus, mit Tor */
  for (let x = X0 + 1; x < X1 - 1; x += 3) { if (x > X0 + 25 && x < X0 + 42) continue; k += `<path d="M${x} 193.6 v-6.4 l.9 -1 l.9 1 v6.4 Z" fill="${farben[Math.floor(x / 3) % 5]}"/>`; }
  k += re(X0, 188.6, X1 - X0, 0.7, "#8a7a62") + re(X0, 191.6, X1 - X0, 0.7, "#8a7a62");
  /* Laufrad am Zaun */
  k += ci(X0 + 44, 191.5, 2.2, "none", ' stroke="#333" stroke-width=".6"') + ci(X0 + 51, 191.5, 2.2, "none", ' stroke="#333" stroke-width=".6"') + `<path d="M${X0 + 44} 191.5 l3 -3.6 l4 3.6 M${X0 + 47} 187.9 l2.6 -.4 M${X0 + 50} 188 v3.5" stroke="#e63946" stroke-width=".7" fill="none"/>`;
  teil("vw_kindergarten", X0 + 14, 141, k, { tipp: "In der Kita spielen die Kinder, bis sie mit sechs Jahren in die Schule kommen." });
}

/* =====================================================================
   STRASSE — Umzugswagen mit Kartons, Straßenuhr, Küchengeräte
   ===================================================================== */
{
  let k = schatten(296, 224, 50, 2.4, 0.35);
  /* Kofferaufbau mit Dach von oben */
  k += pl([[271, 179], [341, 179], [333, 175.5], [267, 175.5]], "#d9dde0");
  k += re(271, 179, 70, 38, LG("koffer", [[0, "#ffffff"], [1, "#dde2e5"]]));
  k += re(271, 179, 70, 38, "none", ' stroke="#b8bfc4" stroke-width=".4"');
  k += re(271, 186, 70, 10, "#1f6fb2") + tx(306, 193.4, 6.4, "UMZÜGE", "#fff", ' font-weight="bold" letter-spacing=".6"');
  k += tx(306, 202.6, 3.2, "Schneider · Möbeltransporte", "#1f6fb2", ' font-weight="bold"') + tx(306, 207, 2.4, "Tel. 0341 / 55 66 77", "#456");
  /* Fahrerhaus links */
  k += `<path d="M251 217 v-17 q0 -4 4 -6 l6 -9 q2 -2.4 5 -2.4 h5 v34.4 Z" fill="${LG("kabine", [[0, "#2f80c4"], [1, "#1c5a91"]])}"/>`;
  k += `<path d="M255.6 195.5 l5.6 -9 q1.4 -1.8 3.6 -1.8 h4 v10.8 Z" fill="${LG("scheibe", [[0, "#cfe6f5"], [1, "#6f9ab8"]])}"/>`;
  k += re(262, 199, 8, 0.6, "#123c62") + re(266.6, 201, 2.4, 0.7, "#ccc") + re(251, 208, 3, 3, "#ffe9a8") + re(251, 213, 20, 4, "#2c3439");
  /* Fahrgestell und Räder */
  k += re(268, 216, 74, 3.4, "#2c3439");
  for (const x of [262, 312, 330]) k += ci(x, 220, 4.6, "#1c1f22") + ci(x, 220, 2.2, "#9aa3aa") + ci(x, 220, 0.8, "#555");
  /* Ladebordwand unten, Kartons auf dem Gehweg */
  k += pl([[341, 222.5], [356, 222.5], [357, 225], [341, 225]], "#9aa3aa");
  const karton = (x, y, w, h) => re(x, y - h, w, h, LG("karton", [[0, "#d8a868"], [1, "#b88748"]])) + re(x, y - h, w, 1, "#e6bd84") + li(x + w / 2, y - h, x + w / 2, y - h + 2.4, "#c99a00", 0.6) + tx(x + w / 2, y - h / 2 + 1, 1.8, "UMZUG", "#6b4a22");
  k += schatten(357, 238.6, 13, 1.2, 0.3) + karton(345, 238.5, 12, 8) + karton(357.5, 238.5, 11, 7) + karton(347, 230.5, 10, 7) + karton(358, 231.5, 9, 6);
  teil("vw_umzug", 261, 205, k, { tipp: "Beim Umzug tragen die Möbelpacker die Kartons in den Umzugswagen." });
}
{
  /* Straßenuhr (Normaluhr) am Gehweg */
  let k = schatten(146, 240.5, 3.2, 0.8, 0.35) + re(144.8, 186, 2.4, 54, LG("mast", [[0, "#3a4f45"], [0.5, "#5f7a6b"], [1, "#2b3b34"]], 0, 0, 1, 0)) + re(144, 236, 4, 4.5, "#2b3b34");
  k += ci(146, 180, 7.2, "#2b3b34") + ci(146, 180, 6.2, RG("ziffer", [[0, "#fffdf6"], [1, "#e9e3d2"]]));
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += li(146 + Math.sin(a) * 5.4, 180 - Math.cos(a) * 5.4, 146 + Math.sin(a) * 4.6, 180 - Math.cos(a) * 4.6, "#222", i % 3 ? 0.3 : 0.6); }
  k += li(146, 180, 146 + Math.sin(7.5 * Math.PI / 6) * 3, 180 - Math.cos(7.5 * Math.PI / 6) * 3, "#111", 0.8) + li(146, 180, 146, 184.6, "#111", 0.5) + ci(146, 180, 0.5, "#b3261e");
  teil("vw_tagesablauf", 157, 193, k, { tipp: "Die Uhr zeigt halb acht: Die Kinder gehen zur Schule, die Eltern zur Arbeit." });
}
{
  /* neue Küchengeräte in Stretchfolie: Kühlschrank auf der Sackkarre, Herd, Spülmaschine */
  let k = schatten(220, 246, 24, 1.4, 0.3);
  const folie = (x, y, w, h) => re(x, y, w, h, "#fff", ' opacity=".28"') + li(x, y + h * 0.3, x + w, y + h * 0.1, "#fff", 0.4, ' opacity=".7"') + li(x, y + h * 0.7, x + w, y + h * 0.5, "#fff", 0.4, ' opacity=".7"');
  /* Sackkarre + Kühlschrank */
  k += re(197.6, 213, 1.2, 33, "#333") + ci(199.4, 244, 2.4, "#222") + re(198, 244.6, 14, 1.2, "#555");
  k += pl([[199.5, 214], [211.5, 214], [210.6, 212], [198.4, 212]], "#e8ebed") + re(199.5, 214, 12, 30.5, LG("kuehl", [[0, "#f0f2f3"], [0.5, "#d5dadd"], [1, "#b8bec2"]], 0, 0, 1, 0)) + li(199.5, 225, 211.5, 225, "#9aa3aa", 0.3) + re(200.6, 217, 0.6, 5, "#8c949a") + re(200.6, 227, 0.6, 7, "#8c949a") + folie(199.5, 214, 12, 30.5);
  /* Herd mit Kochfeld oben */
  k += pl([[214, 231], [228, 231], [226.8, 229], [212.8, 229]], "#222") + ci(218, 230, 1, "#444") + ci(223.5, 230, 1.1, "#444");
  k += re(214, 231, 14, 15, WEISS) + re(215.5, 235, 11, 7.5, "#2b2f33") + re(216.4, 235.8, 9.2, 5.8, "#45505a") + re(215.5, 232, 11, 1.6, "#c9cfd4") + folie(214, 231, 14, 15);
  /* Spülmaschine */
  k += pl([[229.5, 231], [241, 231], [239.6, 229], [228.1, 229]], "#e8ebed") + re(229.5, 231, 11.5, 15, WEISS) + re(229.5, 231, 11.5, 2, "#c9cfd4") + re(233, 234.6, 4.6, 0.8, "#8c949a") + folie(229.5, 231, 11.5, 15);
  k += re(229.6, 237, 8, 4, "#ffd23f") + tx(233.6, 239.6, 1.6, "NEU", "#c0262d", ' font-weight="bold"');
  teil("vw_kuechengeraete", 220, 214, k, { tipp: "Die neuen Küchengeräte sind noch in Folie verpackt." });
}
{
  /* City-Light-Vitrine „Gesundheitstag – dein Körper“ */
  let k = schatten(258, 273, 12, 1.2, 0.35);
  k += re(247, 221, 22, 49, LG("vitr", [[0, "#55605f"], [1, "#2f3534"]], 0, 0, 1, 0)) + re(249, 223, 18, 41, LG("plakat", [[0, "#e8f6f3"], [1, "#bfe3dc"]]));
  k += re(249, 223, 18, 7, "#2a9d8f") + tx(258, 227.4, 2.6, "DEIN KÖRPER", "#fff", ' font-weight="bold"') + tx(258, 229.4, 1.4, "Gesundheitstag im Ärztehaus", "#e8f6f3");
  /* Körperumriss mit Beschriftungslinien */
  const b = "#e98f6f";
  k += ci(258, 234, 2.2, b) + re(257.3, 236, 1.4, 1.2, b) + `<path d="M254.4 237.4 h7.2 l1.6 9 l-1.2 .3 l-1.6 -6 l-.2 6.6 l.8 11 h-2 l-1 -9 l-1 9 h-2 l.8 -11 l-.2 -6.6 l-1.6 6 l-1.2 -.3 Z" fill="${b}"/>`;
  for (const [y, t, s] of [[234, "Kopf", -1], [240, "Arm", 1], [246, "Bauch", -1], [253, "Bein", 1], [259, "Fuß", -1]]) k += li(258 + s * 2.4, y, 258 + s * 5.6, y, "#1f6f68", 0.25) + `<text x="${r(258 + s * 6)}" y="${r(y + 0.6)}" font-size="1.6" text-anchor="${s > 0 ? "start" : "end"}" fill="#1f6f68" font-family="Arial">${t}</text>`;
  k += re(247, 264.5, 22, 5.5, "#2f3534") + re(250, 270, 1.6, 3, "#2f3534") + re(264.4, 270, 1.6, 3, "#2f3534");
  k += pl([[249, 245], [259, 223], [263, 223], [249, 252]], "#fff", ' opacity=".12"');
  teil("vw_koerper", 244, 255, k, { tipp: "Auf dem Plakat sieht man den Körper: Kopf, Arme, Bauch und Beine." });
}

/* =====================================================================
   UNSERE STRASSENSEITE — Müllplatz, Spielplatz, Vorgarten (von oben)
   ===================================================================== */
{
  let k = pl([[148, 262], [238, 262], [240, 292], [146, 292]], "#c4bfb4");
  /* Sichtschutz aus Holzlatten hinter den Tonnen */
  for (let x = 149; x < 238; x += 3.2) k += re(x, 252, 2.6, 14, LG("latte", [[0, "#a4774a"], [1, "#7c5530"]]));
  k += re(148, 254, 90, 1.2, "#6d4a2a");
  const tonne = (x, f, d, t) => {
    let g = schatten(x + 8, 289.5, 9, 1.2, 0.35);
    g += `<path d="M${x} 266.5 h16 l-1.2 22 h-13.6 Z" fill="${f}"/>` + `<path d="M${x} 266.5 h16 l-1.2 22 h-13.6 Z" fill="${LG("tschatt", [[0, "#000", 0.15], [0.35, "#fff", 0.1], [1, "#000", 0.25]], 0, 0, 1, 0)}"/>`;
    g += pl([[x - 0.8, 266.6], [x + 16.8, 266.6], [x + 15.4, 262.4], [x + 0.6, 262.4]], d) + re(x - 0.8, 266, 17.6, 1.6, d);
    g += re(x + 4, 263.4, 8, 0.8, "#000", ' opacity=".25"');
    g += re(x + 3, 272, 10, 4.4, "#fff", ' opacity=".9"') + tx(x + 8, 275.2, 2.1, t, "#222", ' font-weight="bold"');
    g += ci(x + 2.4, 289, 1.6, "#222") + ci(x + 13.6, 289, 1.6, "#222");
    return g;
  };
  k += tonne(152, "#4b5257", "#3a4045", "Restmüll") + tonne(174, "#e9c21b", "#d4ac00", "Verpackung") + tonne(196, "#2f6fb4", "#25598f", "Papier") + tonne(218, "#7a5236", "#5f3f29", "Bio");
  teil("vw_muell", 160, 256, k, { tipp: "Grau: Restmüll. Gelb: Verpackungen. Blau: Papier. Braun: Bioabfall." });
}
{
  /* Spielplatz: Rasen, Sand, Spielturm mit Rutsche, Schaukel, Sandkasten, Wipptier, Schild */
  let k = pl([[0, 246], [142, 246], [144, 300], [0, 300]], LG("rasen", [[0, "#7fae55"], [1, "#5f9140"]]));
  for (let i = 0; i < 120; i++) { const x = rnd() * 142, y = 248 + rnd() * 52; k += li(x, y, x + 0.4, y - 1.4, "#4f7f36", 0.3); }
  k += pl([[8, 256], [132, 256], [136, 298], [4, 298]], LG("sand", [[0, "#ead9ad"], [1, "#d9c18b"]]));
  /* Zaun (Stabgitter, grün) */
  k += re(0, 246, 143, 0.7, "#3f6b4a");
  for (let x = 1; x < 143; x += 2.4) k += li(x, 246, x, 252, "#3f6b4a", 0.45);
  k += re(0, 251.5, 143, 0.7, "#3f6b4a");
  /* Schild am Zaun */
  k += re(6, 236, 0.9, 16, "#555") + re(2, 236, 16, 8, "#fff") + re(2, 236, 16, 8, "none", ' stroke="#2a6f97" stroke-width=".5"') + tx(10, 239.6, 2.4, "Spielplatz", "#2a6f97", ' font-weight="bold"') + tx(10, 242.4, 1.3, "für Kinder bis 14 Jahre", "#333");
  /* Schaukel (Metallgestell, zwei Sitze) */
  k += schatten(36, 293, 18, 1.6, 0.25);
  k += `<path d="M18 294 L24 262 L30 294 M42 294 L48 262 L54 294" stroke="${LG("rohr", [[0, "#e04f3f"], [1, "#b8382a"]], 0, 0, 1, 0)}" stroke-width="1.6" fill="none"/>` + re(22, 261, 28, 2, "#b8382a");
  k += li(30, 263, 30, 285, "#555", 0.4) + li(35, 263, 35, 285, "#555", 0.4) + re(28.6, 285, 8, 1.6, "#2a2a2a");
  k += li(40, 263, 42, 283, "#555", 0.4) + li(45, 263, 46, 283, "#555", 0.4) + re(40.6, 283, 7, 1.6, "#2a2a2a");
  /* Spielturm aus Holz mit Dach und Rutsche */
  k += schatten(92, 296, 22, 1.8, 0.28);
  for (const x of [72, 94]) k += re(x, 246, 2.4, 50, LG("pfosten", [[0, "#c0905a"], [1, "#8d5f33"]], 0, 0, 1, 0));
  k += pl([[69, 248], [83.5, 236], [99, 248]], "#c0392b") + pl([[69, 248], [83.5, 236], [76, 248]], "#a93226");
  k += re(72, 270, 24.4, 3, "#9b6a3c") + pl([[72, 270], [96.4, 270], [93, 266.6], [75.4, 266.6]], "#b98552");
  for (let x = 74; x < 95; x += 2.6) k += re(x, 260, 1, 10, "#a7764a");
  k += re(72, 259.4, 24.4, 1.2, "#8d5f33");
  /* Leiter links */
  k += li(64, 296, 72, 270, "#8d5f33", 1) + li(68, 296, 75, 272, "#8d5f33", 1);
  for (let i = 1; i < 6; i++) k += li(64 + i * 1.33 * 1.2, 296 - i * 4.4, 68 + i * 1.17 * 1.2, 296 - i * 4.2, "#8d5f33", 0.7);
  /* Rutsche nach rechts */
  k += `<path d="M96 270 L114 291 q1.6 1.6 4.6 1.6 h3 v-3 h-3 q-2 0 -3.2 -1.4 L99 266.6 Z" fill="${LG("rutsche", [[0, "#3fbf6a"], [1, "#2a8f4c"]])}"/>` + `<path d="M97 268 L115 289.6" stroke="#8fe0aa" stroke-width=".6"/>`;
  /* Sandkasten mit Eimer und Schaufel */
  k += pl([[113, 259], [137, 259], [140, 271], [110, 271]], "#c79a5a") + pl([[115, 260.6], [135, 260.6], [137.6, 269.4], [112.4, 269.4]], "#f1e1b4");
  k += `<path d="M118 267.6 l.6 -3 h4 l.6 3 Z" fill="#e63946"/>` + li(128, 268, 131, 264, "#2a6f97", 0.7) + el(131.6, 263.6, 1.2, 0.7, "#2a6f97");
  /* Wipptier (Feder-Pferd) */
  k += `<path d="M58 297 q-1 -2 1 -4 q-1 -2 0 -4" stroke="#888" stroke-width=".9" fill="none"/>` + `<path d="M52 289 q6 -3 12 0 l1.6 -5 q-1 -2 -3 -1 l-1 3 h-8 Z" fill="#f2b632"/>` + ci(63.6, 283.4, 0.4, "#333");
  teil("vw_spielplatz", 54, 256, k, { tipp: "Auf dem Spielplatz gibt es eine Rutsche, eine Schaukel und einen Sandkasten." });
}
{
  /* Vorgarten mit Jägerzaun, Tor, Beeten, Bäumchen, Gartenzwerg, Bank */
  let k = pl([[272, 249], [400, 249], [400, 300], [270, 300]], LG("rasen", [[0, "#7fae55"], [1, "#5f9140"]]));
  for (let i = 0; i < 90; i++) { const x = 272 + rnd() * 128, y = 252 + rnd() * 48; k += li(x, y, x + 0.4, y - 1.4, "#4f7f36", 0.3); }
  /* Weg zum Tor */
  k += pl([[300, 249], [312, 249], [318, 300], [296, 300]], "#d8cdb8");
  for (let y = 254; y < 300; y += 6) k += li(299 - (y - 249) * 0.08, y, 313 + (y - 249) * 0.1, y, "#b8ab93", 0.3);
  /* Beete mit Blumen */
  const beet = (x0, x1, y) => { let g = el((x0 + x1) / 2, y, (x1 - x0) / 2, 4.5, "#6b4a2e"); for (let i = 0; i < 14; i++) { const x = x0 + 2 + rnd() * (x1 - x0 - 4), yy = y - 2 + rnd() * 4; g += li(x, yy, x, yy - 2.4, "#3f7a33", 0.4) + ci(x, yy - 2.6, 0.9, ["#e63946", "#ffd23f", "#f06292", "#ffffff", "#9b5de5"][i % 5]); } return g; };
  k += beet(278, 296, 268) + beet(320, 350, 262) + beet(322, 352, 288);
  /* Bäumchen (Apfel) */
  k += schatten(384, 294, 9, 1.6, 0.3) + re(382.6, 264, 2.8, 30, LG("stamm", [[0, "#7a5233"], [1, "#4e3420"]], 0, 0, 1, 0));
  k += ci(384, 256, 13, RG("krone", [[0, "#9cc56b"], [0.7, "#5f9140"], [1, "#467334"]], 0.4, 0.35, 0.7)) + ci(375, 262, 7, "#5f9140") + ci(392, 261, 7.5, "#5a8a3c");
  for (const [x, y] of [[378, 252], [389, 255], [383, 262], [374, 262], [393, 263], [386, 249]]) k += ci(x, y, 1.2, "#d62828");
  /* Gartenbank */
  k += schatten(343, 278, 10, 1, 0.25) + re(334, 270, 18, 1.4, "#9b6a3c") + re(334, 272.6, 18, 1.4, "#9b6a3c") + re(334, 275, 18, 1.6, "#b98552") + re(335, 276.6, 1, 2.4, "#555") + re(350, 276.6, 1, 2.4, "#555");
  /* Gartenzwerg und Gießkanne */
  k += `<path d="M362 291 l1 -6 h4 l1 6 Z" fill="#2a6f97"/>` + ci(365, 283.6, 1.8, "#f1c27d") + pl([[362.8, 283], [367.2, 283], [365, 277.6]], "#d62828") + el(365, 285, 1.4, 1, "#fff");
  k += `<path d="M388 293 h6 l-.6 5 h-4.8 Z" fill="#2a9d8f"/>` + li(394, 294, 398, 291.4, "#2a9d8f", 0.8);
  /* Jägerzaun mit Tor */
  const zaun = (x0, x1) => { let g = ""; for (let x = x0; x < x1; x += 5) g += li(x, 256, x + 5, 249.6, "#b98552", 0.8) + li(x, 249.6, x + 5, 256, "#a7764a", 0.8); g += re(x0, 251.6, x1 - x0, 0.8, "#8d5f33"); for (let x = x0; x <= x1; x += 15) g += re(x - 0.6, 248, 1.2, 9, "#8d5f33"); return g; };
  k += zaun(272, 299) + zaun(313, 400);
  k += re(299.4, 249, 13, 7, "none", ' stroke="#8d5f33" stroke-width=".7"') + li(299.4, 256, 312.4, 249, "#8d5f33", 0.6) + re(298.6, 247, 1.4, 10, "#6d4a2a") + re(312, 247, 1.4, 10, "#6d4a2a");
  teil("vw_garten", 283, 284, k, { tipp: "Im Garten wachsen Blumen und ein Apfelbaum. Der Gartenzwerg passt auf." });
}

/* =====================================================================
   VORNE (fängt keinen Tipp): Straßenlaternen
   ===================================================================== */
{
  let v = "";
  for (const x of [160, 232]) {
    v += re(x - 0.6, 150, 1.2, 45, LG("mast", [[0, "#3a4f45"], [0.5, "#5f7a6b"], [1, "#2b3b34"]], 0, 0, 1, 0)) + re(x - 1.2, 192, 2.4, 3, "#2b3b34");
    v += `<path d="M${x} 151 q0 -3 4 -3.6 h3" stroke="#2b3b34" stroke-width=".9" fill="none"/>` + `<path d="M${x + 4.4} 146.6 h6 l-1 2.2 h-4 Z" fill="#2b3b34"/>` + re(x + 5.6, 148.8, 3.6, 0.6, "#fff6d6");
  }
  S.davor(v);
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/viertel_wohnen.js"));
console.log(aus);
