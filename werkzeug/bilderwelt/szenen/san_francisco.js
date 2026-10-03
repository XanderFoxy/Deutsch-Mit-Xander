#!/usr/bin/env node
/* =====================================================================
   SAN FRANCISCO (FASSUNG 854, Runde 2) — Bilderwelt neu
   ---------------------------------------------------------------------
   RECHERCHE (SFMTA „Routes with a View“ Powell-Hyde, Market Street
   Railway „Cable Cars“, Golden Gate Bridge District „Color & Art Deco
   Styling“, NPS Alcatraz „Lighthouse“ / „Water Tower“, SF Travel; Lage
   nach Karte auf etwa 50 m genau, Unsicheres mit „(?)“):
   - STANDORT: Russian Hill, Südostecke Hyde Street / Lombard Street
     (Haltestelle der Powell-Hyde-Linie), auf der Gartentreppe, Augen
     4,6 m über der Kreuzung, ≈ 93 m über der Bucht.
   - ZWEI ECHTE BLICKE, aneinandergesetzt wie ein Panorama:
     links der Blick nach NORDEN die Hyde Street hinunter (Lochkamera,
     Brennweite 300, Fluchtpunkt der Straße 168/131, Gefälle 13 % bis
     Chestnut, dann 17–20 %; hinter der Kuppe bei Chestnut verschwindet
     die Straße, dahinter erscheinen Dächer und die Bucht);
     rechts der Blick nach OSTEN die kurvige Lombard Street hinunter
     (Fluchtpunkt 365/173, Gefälle 27 %), darüber der Coit Tower.
     Dazwischen der Garten an der Nordostecke (?).
     Ferne Wahrzeichen in echter Größe (300 · Höhe / Entfernung), nur
     die Richtungen gestaucht: Golden Gate Bridge −80° bis −66° (5,2–5,8 km,
     links), Alcatraz −8° (2,8 km), Angel Island direkt dahinter (6,6 km),
     Hyde Street Pier am Fuß der Straße (0,75 km), Pier 39 +48° (1,1 km),
     Coit Tower +89° (1,15 km). Ghirardelli (−41°, 0,5 km) liegt hinter
     den Häusern der Westseite, das Schild schaut zur Bucht.
   - GOLDEN GATE BRIDGE (1937): „International Orange“, Hauptfeld 1280 m,
     Türme 227 m (152 m über der Fahrbahn), Fahrbahn 67 m, Seitenfelder
     343 m — lang und flach; von Osten fast von der Seite, im Gegenlicht.
     Nachmittags drückt der Nebel („Karl“) durch das Golden Gate.
   - ALCATRAZ: bis 41 m hoch, man sieht von oben auf das Plateau:
     Steilküste, Zellenhaus, Leuchtturm (1909) am Südende, Wasserturm
     im Norden, Ruine des Warden's House, Schornstein des Power House,
     Gebäude 64 am Anleger mit „UNITED STATES PENITENTIARY“.
   - HYDE STREET: zwei Gleise mit je einem Seilschlitz; Häuser Wand an
     Wand, Fassaden zur Straße: Edwardian/Italianate-Flats mit Flachdach,
     Konsolengesims, schrägen Erkern, Garage unten, Treppe zur Haustür;
     ein Queen-Anne-Giebelhaus. Parkende Autos mit zum Bordstein
     eingeschlagenen Rädern (Pflicht am Hang).
   - CABLE CAR (Powell-Hyde): weinrot/creme/hellblau, Laternendach,
     vorn der offene Teil mit Bänken nach außen, Trittbrettern und
     Haltestangen, der Gripman am Greifhebel, hinten die Kabine;
     Drehgestelle, Glocke; das Seil läuft im Schlitz (15 km/h).
   - LOMBARD STREET: acht Haarnadelkurven aus roten Ziegeln, terrassierte
     Beete mit Buchskanten und Hortensien, Treppen an beiden Seiten,
     Häuser beidseits; die Kehren werden zum Fluchtpunkt hin klein.
   - TYPISCHES: Sauerteigbrot (Boudin, „Clam Chowder“ in der Brotschale),
     Seelöwen am Pier 39, Segelschiff Balclutha (1886) am Hyde Street Pier.
   Licht: Nachmittag (≈ 15 Uhr), Sonne im Südwesten (≈ 230°, 45° hoch):
   Fassaden der Westseite im Schatten, Schatten fallen nach Nordosten
   (im Nordblick nach rechts hinten).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "san_francisco", titel: "San Francisco", emoji: "🌁", thema: "Länder", kuerzel: "sfo", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1937);
const r = B.r;
const pr = (p) => `${r(p[0])} ${r(p[1])}`;

/* ---------- DIE KAMERAS ---------------------------------------------- */
const HOR = 92, F = 300, E = 4.6, EW = 92.6, VN = 168, VO = 365;
/* Nordblick: X quer (+ Osten), d nach Norden, z Höhe über der Kreuzung */
const PN = (X, d, z) => [VN + F * X / d, HOR + F * (E - z) / d];
/* Ostblick: lat quer (+ Süden, rechts), d nach Osten */
const PO = (lat, d, z) => [VO + F * lat / d, HOR + F * (E - z) / d];
/* Gelände: Hyde Street nach Norden (Lombard 0–10 m, Chestnut 135–150 m flach) */
const zH = (d) => d <= 10 ? 0 : d <= 135 ? -0.13 * (d - 10) : d <= 150 ? -16.25 : d <= 400 ? -16.25 - 0.18 * (d - 150) : d <= 560 ? -61.25 - 0.12 * (d - 400) : -80.5 - 0.08 * (d - 560);
const zL = (d) => d <= 2 ? 0 : -0.27 * (d - 2);
/* Ferne: Richtung gestaucht, Größe echt */
const ANK = [[-100, 0], [-72.8, 127], [-8, 198], [47.8, 290], [88.7, 365], [100, 400]];
const XM = (b) => { for (let i = 1; i < ANK.length; i++) if (b <= ANK[i][0] || i === ANK.length - 1) { const [b0, x0] = ANK[i - 1], [b1, x1] = ANK[i]; return x0 + (x1 - x0) * (b - b0) / (b1 - b0); } return 0; };
const FY = (dist, h) => HOR + F * (EW - h) / dist;
const vier = (a, b, c, e, fill, ex = "") => `<path d="M${pr(a)} L${pr(b)} L${pr(c)} L${pr(e)} Z" fill="${fill}"${ex}/>`;
const knapp = (svg) => svg.replace(/ d="([^"]*)"/g, (m0, d) => ` d="${d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("nebel")}" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="1.6"/></filter>`);
S.def(`<filter id="${S.id("nebelw")}" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation=".9"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="1.8"/></filter>`);
S.def(`<radialGradient id="${S.id("wulst")}" cx=".38" cy=".3" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f6f5f1"/><stop offset="1" stop-color="#d4d9dd"/></radialGradient>`);
S.def(`<pattern id="${S.id("ziegel")}" width="1.6" height=".8" patternUnits="userSpaceOnUse"><path d="M0 .78 H1.6 M.8 0 V.4 M0 .4 H1.6 M0 .4 V.8 M1.6 .4 V.8" stroke="#6e2a20" stroke-width=".1" opacity=".5"/></pattern>`);
S.def(`<pattern id="${S.id("fen")}" width="1.6" height="2" patternUnits="userSpaceOnUse"><rect x=".4" y=".35" width=".7" height=".9" fill="#4d5a66" opacity=".6"/></pattern>`);
const f3 = (v) => v.toFixed(3);
[0.5, 0.32, 0.18].forEach((a, i) => S.def(`<filter id="${S.id("fern" + i)}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${f3(1 - a)} 0 0 0 ${f3(a * 0.8)} 0 ${f3(1 - a)} 0 0 ${f3(a * 0.82)} 0 0 ${f3(1 - a)} 0 ${f3(a * 0.85)} 0 0 0 1 0"/></filter>`));
const fern = (i) => `filter="url(#${S.id("fern" + i)})"`;
const ORANGE = S.lg("io", [[0, "#c24a32"], [0.5, "#b03a27"], [1, "#8a2c1d"]], 0, 0, 1, 0);
const WEINROT = S.lg("weinrot", [[0, "#9a2c38"], [1, "#6b1724"]]);
const CREME = "#f1e7d0", HBLAU = "#8bb8de", GOLDS = "#e3c06a";

/* =====================================================================
   KULISSE — Himmel (Sonne links), Wolken, ferne Hügel, Pazifik im Gate
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 8}" fill="${S.lg("himmel", [[0, "#5b8fd0"], [0.55, "#9fc3e4"], [0.88, "#e2e1d6"], [1, "#f1e3c8"]])}"/>`);
S.hinten(`<ellipse cx="-30" cy="20" rx="170" ry="110" fill="${S.rg("sonne", [[0, "#fff1c8", 0.7], [0.5, "#ffe9b8", 0.2], [1, "#ffe9b8", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[230, 22, 1.1], [330, 36, 0.8], [140, 12, 0.7], [380, 12, 0.9], [270, 60, 0.5]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".8">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 18, 3.2], [-12, 1.2, 10, 2.4], [13, 0.8, 12, 2.8], [-3, -2.2, 9, 3]]) w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `</g>`;
  }
  S.hinten(w);
}
{
  let h = "";
  /* Mount Tamalpais (784 m, 20 km) und die Marin Headlands (≈ 300 m, 6–8 km) */
  h += `<path d="M96 96 Q118 86 140 83.4 Q156 80.6 166 81 Q178 82.4 190 86 L214 92 L222 96 Z" fill="#a8b2b4" opacity=".75"/>`;
  h += `<path d="M58 97 Q72 92 90 89.6 Q106 86.6 122 86.8 Q138 85.4 150 87.6 Q162 89 172 92 L180 97 Z" fill="${S.lg("marin", [[0, "#a29a6c"], [1, "#7f7a54"]])}" ${fern(1)}/>`;
  /* Angel Island direkt hinter Alcatraz (Mount Livermore 240 m) */
  h += `<path d="M138 96.4 Q156 92.6 172 89.4 Q188 85.6 198 85.4 Q210 86 222 89.6 Q240 93.4 258 96.4 Z" fill="${S.lg("angel", [[0, "#879672"], [1, "#667652"]])}" ${fern(1)}/>`;
  /* Tiburon/Belvedere und East Bay (Berkeley Hills) blass */
  h += `<path d="M252 96.6 Q270 93.8 290 94.2 L304 96.6 Z" fill="#9aa48a" opacity=".8"/>`;
  h += `<path d="M300 96 Q330 88.6 360 87.4 Q384 86.8 400 88 L400 96 Z" fill="#b6bbb9" opacity=".8"/>`;
  /* Pazifik im Golden Gate bis zum Horizont, links die Hügel des Presidio */
  h += `<rect x="40" y="${HOR}" width="60" height="5.6" fill="${S.lg("pazifik", [[0, "#c2cfd4"], [1, "#a6bcc7"]])}"/>`;
  h += `<path d="M0 97.4 L0 88 Q20 86.6 40 89.4 Q56 92 66 96 L70 97.4 Z" fill="#6f7d58" ${fern(2)}/>`;
  S.hinten(h);
}

/* =====================================================================
   1 — DIE BUCHT: Wasser bis zu den Ufern (Aquatic Park, Fisherman's
   Wharf, Pier 39, North Beach)
   ===================================================================== */
{
  const ufer = `M0 97.2 L400 97.2 L400 104 Q370 104.6 340 108 Q322 110.4 312 114.6 L300 118.4 L282 118.6 L262 121 L240 124 L218 128 L196 132 L176 135 L150 134.2 L126 130 L100 122 L60 112 L0 104 Z`;
  let k = `<path d="${ufer}" fill="${S.lg("bay", [[0, "#aec3cb"], [0.25, "#7899ab"], [1, "#4f7389"]])}"/>`;
  k += `<path d="${ufer}" fill="${S.lg("glanz", [[0, "#fff3d0", 0.5], [0.35, "#fff3d0", 0.08], [0.6, "#fff3d0", 0]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 140; i++) {
    const t = Math.pow(rnd(), 1.3), y = 97.6 + t * 36, x = rnd() * 400;
    const ufery = x < 60 ? 104 + x * 0.13 : x < 126 ? 112 + (x - 60) * 0.27 : x < 196 ? 130 : x < 300 ? 132 - (x - 196) * 0.13 : 104 + (400 - x) * 0.14;
    if (y > ufery - 1) continue;
    const w = 0.8 + t * 4 * (0.5 + rnd());
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} -${r(0.15 + t * 0.3)} ${r(w)} 0" stroke="${x < 160 && rnd() < 0.6 ? "#fff6dc" : rnd() < 0.6 ? "#e2eef2" : "#355c72"}" stroke-width="${r(0.1 + t * 0.25)}" fill="none" opacity="${r(0.35 + rnd() * 0.4)}"/>`;
  }
  /* der geschwungene Municipal Pier im Aquatic Park (links vom Fuß der Hyde Street) */
  k += `<path d="M118 129.6 Q128 125.4 140 125.2 Q152 125.4 158 127.4" stroke="#dcd6c8" stroke-width=".55" fill="none"/>`;
  S.teil({ id: "bucht", de: "die Bucht", syl: "BUCHT", it: "la baia", itSyl: "BA-ia", en: "bay", x: 0, y: 0, kunst: k,
    tipp: "Die Bucht von San Francisco ist einer der größten Naturhäfen der Welt." });
}

/* =====================================================================
   2 — DIE GOLDEN GATE BRIDGE (5,2–5,8 km, echte Größe und Proportion:
   Hauptfeld 70 Einheiten, Türme 13 hoch, Fahrbahn 4 über dem Wasser)
   ===================================================================== */
{
  const XS = 92, XN = 162, WS = FY(5212, 0), WN = FY(5837, 0), TS = FY(5212, 227), TN = FY(5837, 227), DS = FY(5212, 67), DN = FY(5837, 67);
  const XA = XS - 19, XB = XN + 18, DA = FY(5190, 60), DB = FY(5900, 60);
  let k = `<g opacity=".95">`;
  const dy = (x) => x <= XS ? DA + (DS - DA) * (x - XA) / (XS - XA) : x <= XN ? DS + (DN - DS) * (x - XS) / (XN - XS) : DN + (DB - DN) * (x - XN) / (XB - XN);
  let o = "", u = "";
  for (let x = XA; x <= XB; x += 3) { o += `${o ? "L" : "M"}${r(x)} ${r(dy(x))} `; u = `L${r(x)} ${r(dy(x) + 0.75)} ` + u; }
  k += `<path d="${o}${u}Z" fill="#a8432e"/>`;
  let fw = "";
  for (let x = XA + 0.4; x < XB; x += 0.7) fw += `M${r(x)} ${r(dy(x) + 0.05)} L${r(x + 0.35)} ${r(dy(x) + 0.7)} `;
  k += `<path d="${fw}" stroke="#6d2416" stroke-width=".08" fill="none"/>`;
  /* Tragseile: Durchhang 143 m ≈ 8 Einheiten; Seitenfelder zu den Verankerungen */
  const kab = (x0, y0, x1, y1, tief) => `M${x0} ${r(y0)} Q${r((x0 + x1) / 2)} ${r(tief)} ${x1} ${r(y1)}`;
  const ks = `${kab(XS, TS + 0.4, XN, TN + 0.4, (DS + DN) / 2 + 6.6)} M${XS} ${r(TS + 0.4)} Q${XS - 9} ${r(DS - 2)} ${XA} ${r(DA - 0.3)} M${XN} ${r(TN + 0.4)} Q${XN + 9} ${r(DN - 2)} ${XB} ${r(DB - 0.3)}`;
  k += `<path d="${ks}" stroke="#b5452e" stroke-width=".32" fill="none"/>`;
  let h = "";
  for (let i = 1; i < 36; i++) { const t = i / 36, x = XS + (XN - XS) * t, y = (1 - t) * (1 - t) * (TS + 0.4) + 2 * t * (1 - t) * ((DS + DN) / 2 + 6.6) + t * t * (TN + 0.4); if (y < dy(x) - 0.2) h += `M${r(x)} ${r(y)} L${r(x)} ${r(dy(x))} `; }
  k += `<path d="${h}" stroke="#b5452e" stroke-width=".07" fill="none" opacity=".8" pointer-events="none"/>`;
  /* Türme von der Seite: zwei Beine fast hintereinander, nach oben gestuft, Portal-Schlitze */
  const turm = (x, W0, T, D) => {
    const hgt = W0 - T, st = [[W0, 1.15], [D + 0.4, 1.0], [T + hgt * 0.42, 0.88], [T + hgt * 0.2, 0.78], [T + hgt * 0.07, 0.7]];
    let p = `M${r(x - 1.3)} ${r(W0)}`;
    for (let i = 0; i < st.length; i++) { const [y, hw] = st[i], yn = i + 1 < st.length ? st[i + 1][0] : T; p += ` L${r(x - hw)} ${r(y)} L${r(x - hw)} ${r(yn)}`; }
    for (let i = st.length - 1; i >= 0; i--) { const [y, hw] = st[i], yn = i + 1 < st.length ? st[i + 1][0] : T; p += ` L${r(x + hw)} ${r(yn)} L${r(x + hw)} ${r(y)}`; }
    let s = `<path d="${p} Z" fill="${ORANGE}"/>`;
    for (const t of [0.06, 0.18, 0.38]) s += `<rect x="${r(x - 0.7)}" y="${r(T + hgt * t)}" width="1.4" height=".22" fill="#f2c9b0" opacity=".7"/>`;
    s += `<line x1="${r(x + 0.3)}" y1="${r(T)}" x2="${r(x + 0.3)}" y2="${r(W0)}" stroke="#6e2214" stroke-width=".12"/>`;
    s += `<rect x="${r(x - 0.75)}" y="${r(T - 0.5)}" width="1.5" height=".5" fill="#953424"/><circle cx="${r(x)}" cy="${r(T - 0.9)}" r=".18" fill="#ff5040"/>`;
    s += `<path d="M${r(x - 1.15)} ${r(W0)} L${r(x - 0.9)} ${r(T)}" stroke="#ffb27a" stroke-width=".22" opacity=".75"/>`;
    return s;
  };
  k += turm(XS, WS, TS, DS) + turm(XN, WN, TN, DN);
  /* Fort Point unter dem Südende */
  k += `<rect x="${XA - 2}" y="${r(DA + 0.4)}" width="4" height="${r(WS - DA - 0.4)}" fill="#a76a4f"/>`;
  k += `</g>`;
  S.teil({ id: "golden_gate_bridge", de: "die Golden Gate Bridge", syl: "GOL-den GATE BRIDGE", it: "il ponte del Golden Gate", itSyl: "PON-te del GOL-den GATE", en: "Golden Gate Bridge",
    x: 0, y: 0, kunst: k + `<rect class="bw-flaeche" x="${XA}" y="${r(TS - 2)}" width="${XB - XA}" height="${r(WS - TS + 2)}" fill="rgba(255,255,255,0.001)"/>`,
    tipp: "Die Golden Gate Bridge (1937) ist 2,7 Kilometer lang. Ihre Farbe heißt „International Orange“.",
    zoom: { x: XS - 12, y: r(TS - 5), w: 30, h: 20 },
    unter: [
      { id: "turm", de: "der Turm", syl: "TURM", it: "la torre", itSyl: "TOR-re", en: "tower", x: XS, y: WS, kunst: flaeche(-1.6, -(WS - TS) - 1.4, 3.2, WS - TS + 1.4, 0.3),
        tipp: "Die Türme sind 227 Meter hoch — höher als der Kölner Dom (157 m)." },
      { id: "tragseil", de: "das Tragseil", syl: "TRAG-seil", it: "il cavo portante", itSyl: "CA-vo por-TAN-te", en: "main cable", x: XS + 7, y: r(TS + 5), kunst: flaeche(-3.5, -3, 7, 6, 0.3),
        tipp: "Jedes der zwei Tragseile ist fast einen Meter dick und besteht aus 27 572 Drähten." },
    ] });
}

/* =====================================================================
   3 — DER NEBEL („Karl“) drückt durch das Golden Gate und über Marin
   ===================================================================== */
{
  let k = `<g filter="url(#${S.id("nebelw")})">`;
  let w = "";
  for (const [x, y, rx, ry] of [[138, 90.6, 8, 3.4], [150, 88.4, 9, 4], [163, 87, 9.6, 4.4], [176, 87.4, 9, 4.2], [189, 89.2, 8.4, 3.8], [201, 91.6, 7.6, 3.2], [212, 93.8, 7, 2.8], [158, 92.6, 12, 3.6], [186, 93.4, 12, 3.2], [124, 93.4, 9, 3]]) w += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#${S.id("wulst")})"/>`;
  k += w + `<path d="M112 97.4 L114 92.4 Q160 88.6 218 94 L226 97.4 Z" fill="#e8ebec"/>`;
  k += `</g>`;
  k += `<path d="M146 86.6 Q160 82.6 176 82.4 Q190 83 202 87" stroke="#fff6e2" stroke-width=".9" fill="none" opacity=".6" filter="url(#${S.id("nebelw")})"/>`;
  S.teil({ id: "nebel", de: "der Nebel", syl: "NE-bel", it: "la nebbia", itSyl: "NEB-bia", en: "fog", x: 0, y: 0, kunst: k,
    tipp: "Im Sommer kommt nachmittags oft Nebel vom Meer. Die Leute in San Francisco nennen ihn „Karl“." });
}

/* =====================================================================
   4 — DIE INSEL ALCATRAZ (2,8 km; bis 41 m hoch — man sieht von oben
   auf das Plateau; gezeichnet in Metern, 0,109 Einheiten je Meter)
   ===================================================================== */
{
  const D = 2755, s = F / D, X = XM(-8), Y = FY(D, 0);
  let k = "";
  /* Felsen und Steilküste (Südost-Ende zu uns, Länge verkürzt) */
  k += `<path d="M-180 0 L-170 -18 Q-140 -34 -90 -38 L60 -40 Q120 -40 150 -30 L176 -14 L186 0 Z" fill="${S.lg("fels", [[0, "#a59a86"], [0.5, "#8a7f6c"], [1, "#6c6455"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 16; i++) k += `<path d="M${-170 + i * 22} ${r(-2 - rnd() * 3)} l${r(3 + rnd() * 5)} ${r(-8 - rnd() * 14)}" stroke="#5c5548" stroke-width="1.6" opacity=".55"/>`;
  /* Plateau von oben (Grün, Parade Ground), Ruine Warden's House, Power House mit Schornstein */
  k += `<path d="M-160 -22 Q-130 -36 -90 -40 L60 -42 Q118 -42 146 -32 L164 -22 Q60 -30 -20 -28 Q-100 -26 -160 -22 Z" fill="#7f8b5e"/>`;
  k += `<rect x="-120" y="-50" width="24" height="12" fill="#b5a892"/><rect x="-118" y="-48" width="4" height="5" fill="#5a5048"/><rect x="-108" y="-48" width="4" height="5" fill="#5a5048"/>`;
  k += `<rect x="96" y="-56" width="30" height="16" fill="#cfc6b4"/><rect x="118" y="-86" width="5" height="30" fill="#a49884"/>`;
  /* das Zellenhaus: langer Betonbau (verkürzt), Fensterreihen */
  k += `<rect x="-60" y="-66" width="120" height="26" fill="${S.lg("zellen", [[0, "#f3ede0"], [1, "#cfc6b4"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-62" y="-70" width="124" height="5" fill="#e2dccf"/>`;
  for (let i = 0; i < 14; i++) k += `<rect x="${-55 + i * 8}" y="-60" width="3.4" height="14" fill="#4c4e50"/>`;
  k += `<rect x="-14" y="-78" width="28" height="9" fill="#ddd5c6"/>`;
  /* Leuchtturm (1909) am Südende: achteckig, weiß, 26 m */
  k += `<path d="M-84 -44 L-81 -102 L-71 -102 L-68 -44 Z" fill="${S.lg("lturm", [[0, "#ffffff"], [1, "#d4d2cc"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-85" y="-108" width="18" height="6" fill="#3c3d3e"/><rect x="-80" y="-118" width="8" height="10" fill="#f8e7a2"/><path d="M-82 -118 L-76 -125 L-70 -118 Z" fill="#2e2f30"/>`;
  /* Wasserturm im Norden (hinten rechts): Tank auf Stahlbeinen */
  k += `<path d="M40 -48 L46 -84 M66 -48 L60 -84 M40 -48 L60 -84 M66 -48 L46 -84" stroke="#6b6a66" stroke-width="2.2"/>`;
  k += `<rect x="38" y="-104" width="30" height="21" rx="2" fill="${S.lg("wturm", [[0, "#efeae0"], [1, "#bdb6a8"]], 0, 0, 1, 0)}"/><path d="M36 -104 L53 -111 L70 -104 Z" fill="#a8a296"/>`;
  k += `<rect x="40" y="-97" width="26" height="4" fill="#b5463a" opacity=".55"/>`;
  /* Gebäude 64 am Anleger (vorn rechts) mit der alten Schrift */
  k += `<rect x="96" y="-30" width="66" height="26" fill="#d8cfbd"/><rect x="96" y="-30" width="66" height="3" fill="#efe8da"/>`;
  for (let i = 0; i < 7; i++) { k += `<rect x="${100 + i * 9}" y="-22" width="4.4" height="5" fill="#4a4a48"/><rect x="${100 + i * 9}" y="-13" width="4.4" height="5" fill="#4a4a48"/>`; }
  k += `<text x="129" y="-25.6" font-size="4.4" text-anchor="middle" fill="#5a4a3c" font-family="Arial,sans-serif" font-weight="bold">UNITED STATES PENITENTIARY</text>`;
  k += `<rect x="86" y="-5" width="96" height="5" fill="#6d665a"/>`;
  for (const [x, y] of [[-140, -28], [-126, -34], [140, -30], [10, -42], [-30, -41]]) k += `<circle cx="${x}" cy="${y}" r="8" fill="#5d6f45"/>`;
  k += `<rect x="-186" y="-130" width="372" height="130" fill="${S.lg("alicht", [[0, "#ffe9c4", 0.16], [0.5, "#fff", 0], [1, "#000", 0.1]], 0, 0, 1, 0)}"/>`;
  const L = (x, y) => [X + x * s, Y + y * s];
  S.teil({ id: "alcatraz", de: "die Insel Alcatraz", syl: "IN-sel AL-ca-traz", it: "l'isola di Alcatraz", itSyl: "I-so-la di AL-ca-traz", en: "Alcatraz Island", x: X, y: Y,
    kunst: `<g ${fern(1)} transform="scale(${r(s * 1000) / 1000})"><ellipse cx="0" cy="2" rx="200" ry="6" fill="#3b5b6e" opacity=".3"/>${k}</g>`,
    tipp: "Auf Alcatraz war bis 1963 ein berühmtes Gefängnis. Heute fahren Besucher mit dem Schiff hin.",
    zoom: { x: r(X - 25), y: r(Y - 16), w: 48, h: 32 },
    unter: [
      { id: "leuchtturm", de: "der Leuchtturm", syl: "LEUCHT-turm", it: "il faro", itSyl: "FA-ro", en: "lighthouse", x: L(-76, -44)[0], y: L(-76, -44)[1], kunst: flaeche(-1.4, -9, 2.8, 9.2, 0.3),
        tipp: "Hier stand 1854 der erste Leuchtturm der Westküste; der heutige Turm ist von 1909." },
      { id: "gefaengnis", de: "das Gefängnis", syl: "ge-FÄNG-nis", it: "la prigione", itSyl: "pri-GIO-ne", en: "prison", x: L(0, -40)[0], y: L(0, -40)[1], kunst: flaeche(-6.4, -4.2, 12.8, 4.4, 0.3),
        tipp: "Im Zellenhaus lebten die Gefangenen in winzigen Zellen. Von hier konnte fast niemand fliehen." },
      { id: "wasserturm", de: "der Wasserturm", syl: "WAS-ser-turm", it: "la torre idrica", itSyl: "TOR-re I-dri-ca", en: "water tower", x: L(53, -48)[0], y: L(53, -48)[1], kunst: flaeche(-2, -7, 4, 7.2, 0.3),
        tipp: "Das Trinkwasser kam mit dem Schiff auf die Insel." },
    ] });
}

/* =====================================================================
   5 — DAS SEGELBOOT (zwei Boote in der Bucht, ≈ 1–1,5 km)
   ===================================================================== */
{
  let k = "";
  const boot = (x, y, s, links) => {
    const m = links ? -1 : 1;
    let g = `<path d="M${r(x - 3 * s)} ${y} L${r(x + 3.4 * s)} ${y} L${r(x + 2.6 * s)} ${r(y + 0.9 * s)} L${r(x - 2.4 * s)} ${r(y + 0.9 * s)} Z" fill="#f4f4f2"/>`;
    g += `<line x1="${x}" y1="${y}" x2="${x}" y2="${r(y - 9 * s)}" stroke="#666" stroke-width="${r(0.2 * s)}"/>`;
    g += `<path d="M${r(x + 0.2 * m * s)} ${r(y - 8.6 * s)} Q${r(x + 3.6 * m * s)} ${r(y - 4 * s)} ${r(x + 3 * m * s)} ${r(y - 0.6 * s)} L${r(x + 0.2 * m * s)} ${r(y - 0.6 * s)} Z" fill="${S.lg("segel" + (links ? "l" : "r"), [[0, "#ffffff"], [1, "#dfe3e6"]], 0, 0, 1, 0)}"/>`;
    g += `<path d="M${r(x - 0.2 * m * s)} ${r(y - 7.8 * s)} L${r(x - 2.6 * m * s)} ${r(y - 0.8 * s)} L${r(x - 0.2 * m * s)} ${r(y - 0.8 * s)} Z" fill="#eef0f1"/>`;
    g += `<path d="M${r(x - 4 * s)} ${r(y + 1 * s)} q${r(4 * s)} ${r(0.6 * s)} ${r(8 * s)} 0" stroke="#e8f1f4" stroke-width=".15" fill="none" opacity=".8"/>`;
    return g;
  };
  /* Boot 12 m Mast: 1,2 km → 3 Einheiten; 1,6 km → 2,3 */
  k += boot(118, FY(1200, 0), 0.34, false) + boot(246, FY(1600, 0), 0.26, true);
  S.teil({ oben: true, id: "segelboot", de: "das Segelboot", syl: "SE-gel-boot", it: "la barca a vela", itSyl: "BAR-ca a VE-la", en: "sailboat", x: 0, y: 0, kunst: k + flaeche(112, 113, 12, 7, 0.4) + flaeche(240, 106, 12, 6, 0.4),
    tipp: "Am Wochenende segeln viele Boote in der Bucht — der Wind kommt vom Pazifik." });
}

/* =====================================================================
   Mittelgrund rechts (Kulisse): Telegraph Hill, North Beach, Fisherman's
   Wharf — Land bis zur Uferlinie, kein Wasser darunter
   ===================================================================== */
{
  let c = "";
  /* Telegraph Hill: durchgehender Hang von North Beach bis zur Kuppe (y ≈ 93,5) */
  c += `<path d="M296 122 Q312 112 326 104 Q342 96.4 356 94 Q366 93 376 93.6 Q390 95.2 400 98 L400 150 L296 150 Z" fill="${S.lg("telegraph", [[0, "#7a8a5e"], [1, "#5c6c43"]])}"/>`;
  for (let i = 0; i < 26; i++) { const x = 348 + rnd() * 36, y = 92.6 + rnd() * 5; c += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(1 + rnd() * 1.2)}" fill="${rnd() < 0.5 ? "#5e7046" : "#4b5c38"}"/>`; }
  for (let y = 99; y < 148; y += 2.4) {
    let x = Math.max(296, 300 + (122 - y) * 1.7) + rnd() * 2;
    if (y > 120) x = 196 + (148 - y) * 1.3;
    while (x < 400) {
      const w = 1.6 + rnd() * 2.2 + (y - 99) * 0.03, h = 1.2 + (y - 99) * 0.03 + rnd() * 0.6;
      if (y < 104 && x > 340 && x < 392) { x += w + 1; continue; }
      if (rnd() < 0.16) c += `<circle cx="${r(x + w / 2)}" cy="${r(y - h / 2)}" r="${r(h * 0.75)}" fill="#55683f"/>`;
      else c += `<rect x="${r(x)}" y="${r(y - h)}" width="${r(w)}" height="${r(h)}" fill="${["#f1e9da", "#e7d9c1", "#dfe3e0", "#f0dfd3", "#e9e0c8"][Math.floor(rnd() * 5)]}"/><rect x="${r(x + w * 0.65)}" y="${r(y - h)}" width="${r(w * 0.35)}" height="${r(h)}" fill="#000" opacity=".1"/>`;
      x += w + 0.3 + rnd() * 0.8;
    }
  }
  /* Fisherman's Wharf und der Hafen am Fuß (Uferlinie) */
  c += `<path d="M196 132 L218 128 L240 124 L262 121 L282 118.6 L300 118.4 L300 124 L196 136 Z" fill="#b9ad98"/>`;
  S.hinten(c);
}

/* =====================================================================
   6 — DER PIER 39 mit den Seelöwen (1,1 km, echte Größe)
   ===================================================================== */
{
  const D = 1083, s = F / D, X = XM(47.8), Y = FY(D, 0);
  let k = "";
  k += `<rect x="-62" y="-4" width="124" height="4" fill="#6f5a43"/>`;
  for (let x = -60; x < 62; x += 5) k += `<line x1="${x}" y1="0" x2="${x}" y2="2.6" stroke="#4e3d2c" stroke-width=".9"/>`;
  for (const [x0, w, h, c] of [[-56, 26, 12, "#9c8468"], [-26, 30, 14, "#8f775c"], [8, 24, 11, "#a08a6c"], [36, 20, 9, "#93795d"]]) {
    k += `<rect x="${x0}" y="${-4 - h}" width="${w}" height="${h}" fill="${c}"/><path d="M${x0 - 1} ${-4 - h} L${x0 + w / 2} ${-4 - h - 4} L${x0 + w + 1} ${-4 - h} Z" fill="#5d6a6e"/>`;
    for (let i = 0; i < Math.floor(w / 5); i++) k += `<rect x="${x0 + 1.6 + i * 5}" y="${-4 - h + 3}" width="2.6" height="3" fill="#f3e3b5" opacity=".85"/>`;
  }
  k += `<rect x="-11" y="-28" width="22" height="6" fill="#1f4f7a"/><text x="0" y="-23.4" font-size="4.6" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">PIER 39</text>`;
  for (const x of [-46, -16, 18, 44]) k += `<line x1="${x}" y1="-18" x2="${x}" y2="-32" stroke="#ddd" stroke-width=".5"/><rect x="${x}" y="-32" width="4.4" height="2.6" fill="${x < 0 ? "#c0392b" : "#2a6fb3"}"/>`;
  /* die Schwimmstege (K-Dock) an der Westseite, Seelöwen (≈ 2 m) */
  for (const [x0, y0] of [[-96, 1], [-80, 4], [-110, 5]]) k += `<rect x="${x0}" y="${y0}" width="24" height="2.6" rx=".5" fill="#b8b1a2"/>`;
  const LF = S.lg("loewe", [[0, "#9a7756"], [1, "#4f3a26"]]);
  const loewe = (x, y, dir, hoch) => { const X2 = (v) => r(x + v * dir), Y2 = (v) => r(y - v); return `<path d="M${X2(-2)} ${Y2(0)} Q${X2(-2.3)} ${Y2(0.5)} ${X2(-1.5)} ${Y2(0.6)} Q${X2(0)} ${Y2(0.9)} ${X2(0.9)} ${Y2(hoch ? 1.4 : 0.8)} L${X2(1.3)} ${Y2(hoch ? 2 : 0.9)} Q${X2(1.8)} ${Y2(hoch ? 2.2 : 0.9)} ${X2(2)} ${Y2(hoch ? 1.9 : 0.6)} L${X2(1.5)} ${Y2(hoch ? 1.2 : 0.3)} L${X2(1.2)} ${Y2(0)} Z" fill="${LF}"/>`; };
  for (const [x, y, d, h] of [[-91, 1, 1, true], [-86, 1, -1, false], [-81, 1, 1, false], [-75, 4, -1, true], [-70, 4, 1, false], [-104, 5, 1, false], [-99, 5, -1, true]]) k += loewe(x, y, d, h);
  S.teil({ id: "pier_39", de: "der Pier 39", syl: "PIER NEUN-und-DREI-ßig", it: "il Pier 39", itSyl: "PIER TREN-ta-NO-ve", en: "Pier 39", x: X, y: Y,
    kunst: `<g ${fern(2)} transform="scale(${r(s * 1000) / 1000})">${k}</g>` + flaeche(-36 * s * 3.4, -36 * s, 190 * s, 44 * s, 0.4),
    tipp: "Am Pier 39 gibt es Läden und Restaurants — und Hunderte Seelöwen.",
    zoom: { x: r(X - 36 * s * 3.2), y: r(Y - 10), w: 21, h: 14 },
    unter: [
      { id: "seeloewe", de: "der Seelöwe", syl: "SEE-lö-we", it: "il leone marino", itSyl: "le-O-ne ma-RI-no", en: "sea lion", x: X - 90 * s, y: Y + 3 * s, kunst: flaeche(-22 * s, -4 * s, 44 * s, 7 * s, 0.2),
        tipp: "Seit 1990 liegen die Seelöwen auf den Schwimmstegen am Pier 39 in der Sonne." },
    ] });
}

/* =====================================================================
   7 — DER COIT TOWER auf dem Telegraph Hill (1,15 km; 64 m auf 87 m)
   ===================================================================== */
{
  const D = 1152, s = F / D, X = XM(88.7), Y = FY(D, 87);
  let k = `<rect x="-14" y="-4" width="28" height="4" fill="#d8d0bf"/><rect x="-11" y="-8" width="22" height="4" fill="#e8e1d2"/>`;
  k += `<path d="M-6.4 -8 L-6 -55 L6 -55 L6.4 -8 Z" fill="${S.lg("coit", [[0, "#fffaf0"], [0.45, "#ece4d4"], [1, "#b8ae9c"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-4.6, -2.8, -1, 1, 2.8, 4.6]) k += `<line x1="${x}" y1="-8.5" x2="${r(x * 0.97)}" y2="-54" stroke="#b9ae9a" stroke-width=".4"/>`;
  k += `<rect x="-7" y="-61" width="14" height="6.4" fill="#f2ebdd"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${-5.6 + i * 3.2} -55.4 L${-5.6 + i * 3.2} -58.6 Q${-4.6 + i * 3.2} -60.2 ${-3.6 + i * 3.2} -58.6 L${-3.6 + i * 3.2} -55.4 Z" fill="#3e4a55"/>`;
  k += `<path d="M-7.4 -61 L-6.6 -63.4 L6.6 -63.4 L7.4 -61 Z" fill="#e2d9c8"/><rect x="-6.4" y="-64.2" width="12.8" height="1" fill="#cbc1ae"/>`;
  k += `<path d="M-6.4 -8 L-6 -55 L-3 -55 L-3.2 -8 Z" fill="#fff6e0" opacity=".35"/><path d="M6.4 -8 L6 -55 L3 -55 L3.2 -8 Z" fill="#000" opacity=".1"/>`;
  S.teil({ id: "coit_tower", de: "der Coit Tower", syl: "COIT TOW-er", it: "la Coit Tower", itSyl: "COIT TOW-er", en: "Coit Tower", x: X, y: Y,
    kunst: `<g ${fern(2)} transform="scale(${r(s * 1000) / 1000})">${k}</g>` + flaeche(-2.4, -17.6, 4.8, 18, 0.4),
    tipp: "Der Coit Tower (1933) steht auf dem Telegraph Hill. Von oben sieht man die ganze Stadt." });
}

/*NAH*/
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/san_francisco.js"));
console.log(aus);
