#!/usr/bin/env node
/* =====================================================================
   SAN FRANCISCO (FASSUNG 854, Runde 3) — Bilderwelt neu
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
     Brennweite 300, Fluchtpunkt der Straße 168/131, Gefälle 13–19 %,
     dazwischen flache Kreuzungen (Chestnut, Francisco, Bay, North Point)
     als Stufen; hinter der Kuppe bei Chestnut verschwindet die Straße,
     erst am Fuß (Beach Street, Hyde Street Pier) taucht sie wieder auf);
     rechts der Blick nach OSTEN die kurvige Lombard Street hinunter
     (Fluchtpunkt 365/173, Gefälle 27 %), darüber der Coit Tower.
     Dazwischen der Garten an der Nordostecke (?) mit einem Baum auf der
     Nahtstelle. Die Blöcke dahinter (bis Jones bzw. Mason Street) sind
     als Häuserkisten in echter Perspektive gebaut: Ränder bebaut, Höfe
     mit Bäumen, Dachterrassen; Häuser im Blickfeld auf Alcatraz bleiben
     unter der Sichtlinie.
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
   Licht: Nachmittag (≈ 15:15 Uhr, Sommerzeit), Sonne im Westsüdwesten (≈ 245°, 48° hoch):
   die Straßenfassaden der Westseite liegen im Eigenschatten (kühler), ihr
   Schlagschatten fällt über Gehweg und die westliche Spur; alle Schatten
   fallen scharf nach Nordosten (im Bild nach rechts hinten).
   NAHT der zwei Blicke: am Eckmast mit Straßenschild (x ≈ 231), unten
   schräg an der Ostkante der Kreuzung, wo die Ziegel-Einfahrt beginnt.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "san_francisco", titel: "San Francisco", emoji: "🌁", thema: "Länder", kuerzel: "sfo", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1937);
const r = B.r;
const nz = (v) => String(r(v)).replace(/^(-?)0\./, "$1.");
const pr = (p) => `${r(p[0])} ${r(p[1])}`;

/* ---------- DIE KAMERAS ---------------------------------------------- */
const HOR = 92, F = 300, E = 4.6, EW = 92.6, VN = 168, VO = 365;
/* Nordblick: X quer (+ Osten), d nach Norden, z Höhe über der Kreuzung */
const PN = (X, d, z) => [VN + F * X / d, HOR + F * (E - z) / d];
/* Ostblick: lat quer (+ Süden, rechts), d nach Osten */
const PO = (lat, d, z) => [VO + F * lat / d, HOR + F * (E - z) / d];
/* Gelände: Hyde Street nach Norden, steil mit flachen Kreuzungen (Chestnut, Francisco, Bay, North Point), Beach Street ≈ 4 m über dem Meer */
const ZHP = [[0, 0], [10, 0], [135, -17], [150, -17], [272, -40], [287, -40], [410, -60], [425, -60], [550, -76], [565, -76], [690, -86], [2000, -86]];
const zH = (d) => { for (let i = 1; i < ZHP.length; i++) if (d <= ZHP[i][0]) { const [d0, z0] = ZHP[i - 1], [d1, z1] = ZHP[i]; return z0 + (z1 - z0) * (d - d0) / (d1 - d0); } return -86; };
/* Querstraßen der Hyde Street (flache Stufen): Chestnut, Francisco, Bay, North Point */
const QUER = [[135, 150], [272, 287], [410, 425], [550, 565]];
const zL = (d) => d <= 2 ? 0 : -0.27 * (d - 2);
/* Ferne: Richtung gestaucht, Größe echt */
const ANK = [[-100, 0], [-72.8, 127], [-8, 198], [47.8, 290], [88.7, 365], [100, 400]];
const XM = (b) => { for (let i = 1; i < ANK.length; i++) if (b <= ANK[i][0] || i === ANK.length - 1) { const [b0, x0] = ANK[i - 1], [b1, x1] = ANK[i]; return x0 + (x1 - x0) * (b - b0) / (b1 - b0); } return 0; };
const FY = (dist, h) => HOR + F * (EW - h) / dist;
const vier = (a, b, c, e, fill, ex = "") => `<path d="M${pr(a)} L${pr(b)} L${pr(c)} L${pr(e)} Z" fill="${fill}"${ex}/>`;
const knapp = (svg) => svg.replace(/ d="([^"]*)"/g, (m0, d) => ` d="${d.replace(/-?\d*\.\d+/g, (n) => String(Math.round(+n)))}"`)
  .replace(/ (x1|y1|x2|y2|cx|cy|fx|fy|rx|ry|r|x|y|width|height)="(-?\d*\.\d+)"/g, (m0, a, v) => ` ${a}="${Math.abs(+v) >= 4 ? Math.round(+v) : Math.round(+v * 10) / 10}"`)
  .replace(/ (points)="([^"]*)"/g, (m0, a, v) => ` ${a}="${v.replace(/-?\d*\.\d+/g, (n) => String(Math.round(+n)))}"`);

/* Pfade der Figuren verschlanken: gerundete Punktketten ausdünnen (Douglas–Peucker), winzige offene
   Striche (Haarsträhnen unter einer halben Bildeinheit) weglassen. */
const rdp = (P, eps) => { if (P.length < 3) return P; let im = 0, dm = 0; const [a, b] = [P[0], P[P.length - 1]], L2 = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-9;
  for (let i = 1; i < P.length - 1; i++) { const dd = Math.abs((b[0] - a[0]) * (a[1] - P[i][1]) - (a[0] - P[i][0]) * (b[1] - a[1])) / L2; if (dd > dm) { dm = dd; im = i; } }
  return dm > eps ? [...rdp(P.slice(0, im + 1), eps).slice(0, -1), ...rdp(P.slice(im), eps)] : [a, b]; };
const NARG = { M: 2, L: 2, Q: 4, C: 6, S: 4 };
const duenn = (d, eps, klein) => {
  if (/[^MLQCSZ0-9.\-\s,e]/.test(d)) return d;
  const tok = d.match(/[MLQCSZ]|-?\d*\.?\d+(?:e-?\d+)?/g); if (!tok) return d;
  const subs = []; let cur = null, i = 0, cmd = null;
  while (i < tok.length) {
    if (/[MLQCSZ]/.test(tok[i])) { cmd = tok[i++]; if (cmd === "Z") { if (cur) cur.zu = true; cur = null; continue; } }
    const n = NARG[cmd]; if (!n) return d;
    const args = tok.slice(i, i + n).map(Number); i += n; if (args.length < n || args.some(isNaN)) return d;
    if (cmd === "M") { cur = { s: [args[0], args[1]], seg: [], zu: false }; subs.push(cur); cmd = "L"; continue; }
    if (!cur) return d;
    cur.seg.push({ c: cmd, a: args });
  }
  let out = "";
  const zz = (v) => String(Math.round(v * 10) / 10);
  for (const sp of subs) {
    const xs = [sp.s[0]], ys = [sp.s[1]]; sp.seg.forEach((g) => g.a.forEach((v, j) => (j % 2 ? ys : xs).push(v)));
    if (!sp.zu && Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) < klein) continue;
    let o = `M${zz(sp.s[0])} ${zz(sp.s[1])}`, last = sp.s, run = [];
    const flush = () => { if (!run.length) return; const pts = rdp([last, ...run], eps).slice(1); pts.forEach((p) => (o += `L${zz(p[0])} ${zz(p[1])}`)); last = run[run.length - 1]; run = []; };
    for (const g of sp.seg) {
      if (g.c === "L") { const p = [g.a[0], g.a[1]], q = run.length ? run[run.length - 1] : last; if (p[0] !== q[0] || p[1] !== q[1]) run.push(p); continue; }
      flush(); o += g.c + g.a.map(zz).join(" "); last = [g.a[g.a.length - 2], g.a[g.a.length - 1]];
    }
    flush(); if (sp.zu) o += "Z"; out += o;
  }
  return out.replace(/ -/g, "-");
};
/* kleine Figuren: Verläufe durch ihre Mittelfarbe ersetzen (bei 3–4 mm Bildhöhe nicht zu sehen) */
const flach = (svg) => { const farbe = {}; svg = svg.replace(/<(linearGradient|radialGradient) id="([^"]+)"[^>]*>(.*?)<\/\1>/g, (m0, t, id, inner) => { const st = [...inner.matchAll(/stop-color="([^"]+)"/g)].map((m) => m[1]); farbe[id] = st[Math.floor(st.length / 2)] || "#888"; return ""; });
  return svg.replace(/url\(#([^)]+)\)/g, (m0, id) => farbe[id] || m0).replace(/<defs><\/defs>/g, ""); };
/* kleine Figuren: feine Linien (Falten, Nähte) unter 1,6 Figureinheiten weglassen */
const grob = (svg, grenze = 1.6) => svg.replace(/<path [^>]*fill="none"[^>]*>/g, (m0) => { const w = +((m0.match(/stroke-width="([\d.]+)"/) || [0, 9])[1]); return w < grenze ? "" : m0; });
const figur = (svg, eps = 0.7, klein = 2.6) => knapp(svg).replace(/ d="([^"]*)"/g, (m0, d) => ` d="${duenn(d, eps, klein)}"`).replace(/<path d=""[^>]*\/>/g, "");
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("nebel")}" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="1.6"/></filter>`);
S.def(`<filter id="${S.id("nebelw")}" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation=".9"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="1.8"/></filter>`);
S.def(`<radialGradient id="${S.id("wulst")}" cx=".38" cy=".3" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f6f5f1"/><stop offset="1" stop-color="#d4d9dd"/></radialGradient>`);
S.def(`<pattern id="${S.id("ziegel")}" width="1.2" height=".6" patternUnits="userSpaceOnUse"><path d="M0 .58 H1.2 M.6 0 V.3 M0 .3 H1.2 M0 .3 V.6 M1.2 .3 V.6" stroke="#5e2018" stroke-width=".1" opacity=".75"/></pattern>`);
S.def(`<pattern id="${S.id("fen")}" width="1.6" height="2" patternUnits="userSpaceOnUse"><rect x=".4" y=".35" width=".7" height=".9" fill="#4d5a66" opacity=".6"/></pattern>`);
const f3 = (v) => v.toFixed(3);
[0.5, 0.32, 0.18].forEach((a, i) => S.def(`<filter id="${S.id("fern" + i)}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${f3(1 - a)} 0 0 0 ${f3(a * 0.8)} 0 ${f3(1 - a)} 0 0 ${f3(a * 0.82)} 0 0 ${f3(1 - a)} 0 ${f3(a * 0.85)} 0 0 0 1 0"/></filter>`));
const fern = (i) => `filter="url(#${S.id("fern" + i)})"`;
const ORANGE = S.lg("io", [[0, "#c24a32"], [0.5, "#b03a27"], [1, "#8a2c1d"]], 0, 0, 1, 0);
const WEINROT = S.lg("weinrot", [[0, "#9a2c38"], [1, "#6b1724"]]);
const CREME = "#f1e7d0", HBLAU = "#8bb8de", GOLDS = "#e3c06a";

/* =====================================================================
   KULISSE — Himmel (Sonne hinter uns links, kein Sonnenfleck), Wolken, ferne Hügel, Pazifik im Gate
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 8}" fill="${S.lg("himmel", [[0, "#5b8fd0"], [0.55, "#9fc3e4"], [0.88, "#e2e1d6"], [1, "#f1e3c8"]])}"/>`);
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
  const ufer = `M0 97.2 L348 97.2 Q342 99 334 104 Q322 112 312 118.6 L300 118.4 L282 118.6 L262 121 L240 124 L218 128 L196 132 L176 135 L150 134.2 L126 130 L100 122 L60 112 L0 104 Z`;
  let k = `<path d="${ufer}" fill="${S.lg("bay", [[0, "#aec3cb"], [0.25, "#7899ab"], [1, "#4f7389"]])}"/>`;
  k += `<path d="${ufer}" fill="${S.lg("glanz", [[0, "#fff3d0", 0.5], [0.35, "#fff3d0", 0.08], [0.6, "#fff3d0", 0]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 140; i++) {
    const t = Math.pow(rnd(), 1.3), y = 97.6 + t * 36, x = rnd() * 400;
    const ufery = x < 60 ? 104 + x * 0.13 : x < 126 ? 112 + (x - 60) * 0.27 : x < 196 ? 130 : x < 300 ? 132 - (x - 196) * 0.13 : x < 348 ? 118 - (x - 300) * 0.43 : 97;
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
  const ks = `${kab(XS, TS - 0.4, XN, TN - 0.4, (DS + DN) / 2 + 6.6)} M${XS} ${r(TS - 0.4)} Q${XS - 9} ${r(DS - 2)} ${XA} ${r(DA - 0.3)} M${XN} ${r(TN - 0.4)} Q${XN + 9} ${r(DN - 2)} ${XB} ${r(DB - 0.3)}`;
  k += `<path d="${ks}" stroke="#b5452e" stroke-width=".32" fill="none"/>`;
  let h = "";
  for (let i = 1; i < 36; i++) { const t = i / 36, x = XS + (XN - XS) * t, y = (1 - t) * (1 - t) * (TS - 0.4) + 2 * t * (1 - t) * ((DS + DN) / 2 + 6.6) + t * t * (TN - 0.4); if (y < dy(x) - 0.2) h += `M${r(x)} ${r(y)} L${r(x)} ${r(dy(x))} `; }
  k += `<path d="${h}" stroke="#b5452e" stroke-width=".07" fill="none" opacity=".8" pointer-events="none"/>`;
  /* Türme: zwei Beine mit Himmel dazwischen, an jedem Riegel nach innen abgetreppt (Art déco);
     über der Fahrbahn vier Portalriegel (nach oben kürzer und enger), darunter ein großer Riegel;
     oben die gerippten Abschlüsse, das Tragseil liegt auf dem Turmkopf. Licht von links. */
  const turm = (x, W0, T, D) => {
    const hu = D - T, ys = [W0, D + 0.6, D - hu * 0.22, D - hu * 0.48, D - hu * 0.7, D - hu * 0.88, T];
    const bw = [0.38, 0.34, 0.31, 0.28, 0.25, 0.23], gap = 0.34;
    let L = "", R = "";
    for (let i = 0; i < bw.length; i++) { const y0 = ys[i], y1 = ys[i + 1], o = gap + (bw[0] - bw[i]); L += `M${r(x - o - bw[i])} ${r(y0)}H${r(x - o)}V${r(y1)}H${r(x - o - bw[i])}Z`; R += `M${r(x + o)} ${r(y0)}H${r(x + o + bw[i])}V${r(y1)}H${r(x + o)}Z`; }
    let s2 = `<path d="${L}" fill="#c4492f"/><path d="${R}" fill="#93311f"/>`;
    for (const [i, h2] of [[1, 0.5], [2, 0.42], [3, 0.36], [4, 0.3], [5, 0.26]]) { const o = gap + (bw[0] - bw[i]); s2 += `<rect x="${r(x - o - 0.05)}" y="${r(ys[i] - h2)}" width="${r(2 * o + 0.1)}" height="${r(h2)}" fill="#a83a26"/>`; }
    const ot = gap + bw[0] - bw[5];
    s2 += `<rect x="${r(x - ot - 0.26)}" y="${r(T - 0.35)}" width="${r(2 * ot + 0.52)}" height=".35" fill="#b3402b"/><path d="M${r(x - ot - 0.2)} ${r(T - 0.35)}V${r(T - 0.7)}M${r(x - ot)} ${r(T - 0.35)}V${r(T - 0.8)}M${r(x + ot)} ${r(T - 0.35)}V${r(T - 0.8)}M${r(x + ot + 0.2)} ${r(T - 0.35)}V${r(T - 0.7)}" stroke="#a83a26" stroke-width=".14"/><circle cx="${r(x)}" cy="${r(T - 0.95)}" r=".14" fill="#ff5040"/>`;
    return s2;
  };
  k += turm(XS, WS, TS, DS) + turm(XN, WN, TN, DN);
  /* Fort Point unter dem Südende */
  k += `<rect x="${XA - 2}" y="${r(DA + 0.4)}" width="4" height="${r(WS - DA - 0.4)}" fill="#a76a4f"/>`;
  k += `</g>`;
  S.teil({ id: "golden_gate_bridge", de: "die Golden Gate Bridge", syl: "GOL-den GATE BRIDGE", it: "il ponte del Golden Gate", itSyl: "PON-te del GOL-den GATE", en: "Golden Gate Bridge",
    x: 0, y: 0, kunst: k + `<rect class="bw-flaeche" x="${XA}" y="${r(TS - 2)}" width="${XS + 26 - XA}" height="${r(WS - TS + 2)}" fill="rgba(255,255,255,0.001)"/>`,
    tipp: "Die Golden Gate Bridge (1937) ist 2,7 Kilometer lang. Ihre Farbe heißt „International Orange“.",
    zoom: { x: XS - 9, y: r(TS - 4), w: 30, h: 20 },
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
  /* Felsklippen: Facetten mit Schattenfugen (Licht von links) */
  for (let i = 0; i < 15; i++) { const x0 = -172 + i * 23 + rnd() * 4, w = 10 + rnd() * 9, h = 14 + rnd() * 16, sp = 3 + rnd() * 4;
    k += `<path d="M${r(x0)} 0 L${r(x0 + sp)} ${r(-h)} L${r(x0 + w * 0.6)} ${r(-h - 3)} L${r(x0 + w)} 0 Z" fill="${rnd() < 0.5 ? "#9d927d" : "#857a66"}"/><path d="M${r(x0 + w * 0.6)} ${r(-h - 3)} L${r(x0 + w)} 0 L${r(x0 + w * 0.8)} 0 Z" fill="#5a5245" opacity=".75"/>`; }
  /* Plateau von oben (Grün, Parade Ground), Ruine Warden's House, Power House mit Schornstein */
  k += `<path d="M-160 -22 Q-130 -36 -90 -40 L60 -42 Q118 -42 146 -32 L164 -22 Q60 -30 -20 -28 Q-100 -26 -160 -22 Z" fill="#7f8b5e"/>`;
  /* Ruine des Warden's House neben dem Leuchtturm: Mauern ohne Dach, hohle Fensteröffnungen */
  k += `<rect x="-116" y="-56" width="28" height="16" fill="#b8ab94"/><rect x="-113" y="-53" width="22" height="10" fill="#6f7457"/>`;
  for (const x of [-114, -107, -100, -93]) k += `<rect x="${x}" y="-50" width="3.4" height="6" fill="#d9dccf"/>`;
  k += `<path d="M-116 -56 L-114 -60 L-110 -56 M-98 -56 L-95 -61 L-92 -56" stroke="#b8ab94" stroke-width="2.4" fill="none"/>`;
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
  for (const [x, y] of [[-142, -28], [-128, -34], [10, -42], [-30, -41], [78, -40]]) k += `<circle cx="${x}" cy="${y}" r="7" fill="#5d6f45"/>`;
  /* Anleger mit Mole vor Gebäude 64 */
  k += `<path d="M150 -2 L232 -2 L234 2 L150 2 Z" fill="#8d877b"/><path d="M150 2 L234 2" stroke="#4d4a44" stroke-width="1.4"/>`;
  for (let x = 156; x < 232; x += 9) k += `<rect x="${x}" y="2" width="1.8" height="3" fill="#4d4a44"/>`;
  k += `<rect x="-186" y="-130" width="372" height="130" fill="${S.lg("alicht", [[0, "#ffe9c4", 0.16], [0.5, "#fff", 0], [1, "#000", 0.1]], 0, 0, 1, 0)}"/>`;
  const L = (x, y) => [X + x * s, Y + y * s];
  S.teil({ id: "alcatraz", de: "die Insel Alcatraz", syl: "IN-sel AL-ca-traz", it: "l'isola di Alcatraz", itSyl: "I-so-la di AL-ca-traz", en: "Alcatraz Island", x: X, y: Y,
    kunst: `<g ${fern(1)} transform="scale(${r(s * 1000) / 1000})"><ellipse cx="0" cy="2" rx="200" ry="6" fill="#3b5b6e" opacity=".3"/>${k}</g>`,
    tipp: "Auf Alcatraz war bis 1963 ein berühmtes Gefängnis. Heute fahren Besucher mit dem Schiff hin.",
    zoom: { x: r(X - 17), y: r(Y - 19), w: 39, h: 26 },
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
  /* Boot 12 m Mast: 1,2 km → 3 Einheiten; 1,3 km → 2,8 (beide im freien Wasser, nicht hinter Häusern) */
  const B1 = [150, FY(1200, 0)], B2 = [263, FY(1300, 0)];
  k += boot(B1[0], B1[1], 0.34, false) + boot(B2[0], B2[1], 0.3, true);
  S.teil({ oben: true, id: "segelboot", de: "das Segelboot", syl: "SE-gel-boot", it: "la barca a vela", itSyl: "BAR-ca a VE-la", en: "sailboat", x: 0, y: 0, kunst: k + flaeche(r(B1[0] - 6), r(B1[1] - 6), 12, 7.5, 0.4) + flaeche(r(B2[0] - 6), r(B2[1] - 6), 12, 7.5, 0.4),
    tipp: "Am Wochenende segeln viele Boote in der Bucht — der Wind kommt vom Pazifik." });
}

/* =====================================================================
   Mittelgrund rechts (Kulisse): Telegraph Hill, North Beach, Fisherman's
   Wharf — Land bis zur Uferlinie, kein Wasser darunter
   ===================================================================== */
{
  let c = "";
  /* Telegraph Hill: durchgehender Hang von North Beach bis zur Kuppe (y ≈ 93,5) */
  c += `<path d="M310 122 Q322 112 334 104 Q348 96.4 358 94 Q366 93 376 93.6 Q390 95.2 400 98 L400 150 L310 150 Z" fill="${S.lg("telegraph", [[0, "#7a8a5e"], [1, "#5c6c43"]])}"/>`;
  for (let i = 0; i < 26; i++) { const x = 348 + rnd() * 36, y = 92.6 + rnd() * 5; c += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(1 + rnd() * 1.2)}" fill="${rnd() < 0.5 ? "#5e7046" : "#4b5c38"}"/>`; }
  /* Häuser am Hang des Telegraph Hill: kleine Kuben, dazwischen viel Grün (Gärten der Filbert Steps) */
  { const proFarbe = new Map(), baeume = [], schatten_ = [];
    const xb = (y) => y >= 104 ? 310 + (122 - y) * 24 / 18 : 334 + (104 - y) * 2.4;
    for (let y = 98.6; y < 125; y += 2.5) {
      let x = xb(y) + 0.6 + rnd() * 1.5;
      while (x < 400) {
        const w = 1.6 + rnd() * 1.8 + (y - 98) * 0.03, h = 1 + rnd() * 0.8 + (y - 98) * 0.025;
        if (y < 101 && x > 349 && x < 382) { x += w + 0.6; continue; }
        if (y < 99.5 && rnd() < 0.6) { baeume.push(`M${r(x)} ${r(y - h * 0.4)}a${r(h * 0.8)} ${r(h * 0.7)} 0 1 0 .1 0z`); x += w + 0.4; continue; }
        if (rnd() < 0.28) baeume.push(`M${r(x)} ${r(y - h * 0.4)}a${r(h * 0.7)} ${r(h * 0.6)} 0 1 0 .1 0z`);
        else { const f = ["#f1e9da", "#e7d9c1", "#dfe3e0", "#f0dfd3", "#e9e0c8", "#d8dfe6", "#f2e4cf"][Math.floor(rnd() * 7)]; proFarbe.set(f, (proFarbe.get(f) || "") + `M${r(x)} ${r(y - h)}h${r(w)}v${r(h)}h${r(-w)}z`); }
        x += w + 0.25 + rnd() * 0.9;
      }
    }
    for (const [f, d] of proFarbe) c += `<path d="${d}" fill="${f}"/>`;
    c += `<path d="${baeume.join("")}" fill="#55683f"/>`;
  }
  /* Fisherman's Wharf und der Hafen am Fuß (Uferlinie) */
  c += `<path d="M196 132 L218 128 L240 124 L262 121 L282 118.6 L300 118.4 L316 118.6 L316 126 L196 136 Z" fill="#b9ad98"/>`;
  S.hinten(c);
}

/* =====================================================================
   6 — DER PIER 39 mit den Seelöwen (1,1 km, echte Größe)
   ===================================================================== */
{
  const D = 1083, s = F / D, X = XM(47.8), Y = FY(D, 0);
  const rp = zufall(39);
  let k = "";
  /* Deck auf Pfählen */
  k += `<rect x="-66" y="-4" width="136" height="4" fill="#6f5a43"/>`;
  { let pf = ""; for (let x = -64; x < 70; x += 4) pf += `M${x} 0 V2.6 `; k += `<path d="${pf}" stroke="#4e3d2c" stroke-width=".9"/>`; }
  /* zweigeschossige, verwitterte Holzbauten mit Satteldächern und Galerie */
  for (const [x0, w, h, c] of [[-58, 20, 13, "#94836d"], [-36, 24, 15, "#8a7962"], [-10, 18, 13, "#9b8a72"], [10, 22, 14, "#867560"]]) {
    k += `<rect x="${x0}" y="${-4 - h}" width="${w}" height="${h}" fill="${c}"/><rect x="${x0}" y="${-4 - h * 0.52}" width="${w}" height="1.2" fill="#6b5c4a"/>`;
    k += `<path d="M${x0 - 1.2} ${-4 - h} L${x0 + w / 2} ${-4 - h - 5} L${x0 + w + 1.2} ${-4 - h} Z" fill="#5f6a6c"/>`;
    for (let i = 0; i < Math.floor(w / 4.5); i++) for (const fy of [-4 - h + 2.5, -4 - h * 0.45]) k += `<rect x="${x0 + 1.4 + i * 4.5}" y="${r(fy)}" width="2.4" height="3" fill="#f1dfae" opacity=".9"/>`;
  }
  /* das Karussell am Ende des Piers: zweistöckig, gestreiftes Dach */
  k += `<rect x="40" y="-14" width="18" height="10" fill="#efe6d2"/><rect x="40" y="-9.5" width="18" height="1" fill="#c9a24a"/>`;
  k += `<path d="M38 -14 L49 -21 L60 -14 Z" fill="#c0392b"/><path d="M41.5 -14 L49 -21 L45 -14 Z M48 -14 L49 -21 L52 -14 Z M55 -14 L49 -21 L58.5 -14 Z" fill="#f6f1e6"/><circle cx="49" cy="-21.6" r="1" fill="#d9b44a"/>`;
  /* Eingangsschild PIER 39 am Landende */
  k += `<rect x="-72" y="-27" width="1.6" height="23" fill="#3c3a36"/><rect x="-64" y="-27" width="1.6" height="23" fill="#3c3a36"/><rect x="-76" y="-33" width="18" height="7" fill="#1f4f7a"/><text x="-67" y="-27.8" font-size="5" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">PIER 39</text>`;
  /* viele Fahnen entlang der Dächer */
  { let st = "", fl = ["#c0392b", "#2a6fb3", "#f2c230", "#2e8b57", "#ffffff"]; for (let x = -56; x <= 56; x += 7) { const top = -4 - 15 - 9 - rp() * 3; st += `M${x} -12 V${r(top)} `; k += `<rect x="${x}" y="${r(top)}" width="3.4" height="2.2" fill="${fl[Math.floor(rp() * 5)]}"/>`; } k += `<path d="${st}" stroke="#ddd" stroke-width=".45"/>`; }
  /* K-Dock vor der Westseite: Schwimmstege, dicht an dicht Seelöwen (≈ 2 m) */
  for (const [x0, y0] of [[-112, 1.5], [-96, 5], [-120, 7.5], [-84, 2]]) k += `<rect x="${x0}" y="${y0}" width="22" height="2.4" rx=".5" fill="#b8b1a2"/>`;
  const LF = S.lg("loewe", [[0, "#9a7756"], [1, "#4f3a26"]]);
  const loewe = (x, y, dir, hoch) => { const X2 = (v) => r(x + v * dir), Y2 = (v) => r(y - v); return `M${X2(-2)} ${Y2(0)} Q${X2(-2.3)} ${Y2(0.5)} ${X2(-1.5)} ${Y2(0.6)} Q${X2(0)} ${Y2(0.9)} ${X2(0.9)} ${Y2(hoch ? 1.4 : 0.8)} L${X2(1.3)} ${Y2(hoch ? 2 : 0.9)} Q${X2(1.8)} ${Y2(hoch ? 2.2 : 0.9)} ${X2(2)} ${Y2(hoch ? 1.9 : 0.6)} L${X2(1.5)} ${Y2(hoch ? 1.2 : 0.3)} L${X2(1.2)} ${Y2(0)} Z`; };
  { let lw = ""; for (const [x0, y0] of [[-112, 1.5], [-96, 5], [-120, 7.5], [-84, 2]]) for (let x = x0 + 2; x < x0 + 21; x += 2.6 + rp() * 1.2) lw += loewe(x, y0 + 0.2, rp() < 0.5 ? 1 : -1, rp() < 0.3); k += `<path d="${lw}" fill="${LF}"/>`; }
  S.teil({ id: "pier_39", de: "der Pier 39", syl: "PIER NEUN-und-DREI-ßig", it: "il Pier 39", itSyl: "PIER TREN-ta-NO-ve", en: "Pier 39", x: X, y: Y,
    kunst: `<g ${fern(2)} transform="scale(${r(s * 1000) / 1000})">${k}</g>` + flaeche(-36 * s * 3.4, -36 * s, 190 * s, 44 * s, 0.4),
    tipp: "Am Pier 39 gibt es Läden und Restaurants — und Hunderte Seelöwen.",
    zoom: { x: r(X - 126 * s), y: r(Y - 21), w: 54, h: 36 },
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
  /* kannelierter Schaft: helle und schattige Riefen (Licht von links) */
  for (const [x, c] of [[-5.2, "#fffaf0"], [-3.4, "#f4ecdd"], [-1.6, "#e6dccb"], [0.2, "#d6cab6"], [2, "#c6b9a3"], [3.8, "#b3a58e"]]) k += `<path d="M${x} -8.5 L${r(x * 0.97)} -55 L${r(x * 0.97 + 1.1)} -55 L${x + 1.1} -8.5 Z" fill="${c}"/>`;
  for (const x of [-4.3, -2.5, -0.7, 1.1, 2.9, 4.7]) k += `<path d="M${x} -8.5 L${r(x * 0.97)} -55" stroke="#8f826d" stroke-width=".55"/>`;
  k += `<rect x="-7" y="-61" width="14" height="6.4" fill="#f2ebdd"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${-5.6 + i * 3.2} -55.4 L${-5.6 + i * 3.2} -58.6 Q${-4.6 + i * 3.2} -60.4 ${-3.6 + i * 3.2} -58.6 L${-3.6 + i * 3.2} -55.4 Z" fill="#26313a"/>`;
  k += `<path d="M-7.4 -61 L-6.6 -63.4 L6.6 -63.4 L7.4 -61 Z" fill="#e2d9c8"/><rect x="-6.4" y="-64.2" width="12.8" height="1" fill="#cbc1ae"/>`;
  k += `<path d="M-6.4 -8 L-6 -55 L-3 -55 L-3.2 -8 Z" fill="#fff6e0" opacity=".35"/><path d="M6.4 -8 L6 -55 L3 -55 L3.2 -8 Z" fill="#000" opacity=".1"/>`;
  S.teil({ id: "coit_tower", de: "der Coit Tower", syl: "COIT TOW-er", it: "la Coit Tower", itSyl: "COIT TOW-er", en: "Coit Tower", x: X, y: Y,
    kunst: `<g ${fern(2)} transform="scale(${r(s * 1000) / 1000})">${k}</g>` + flaeche(-2.4, -17.6, 4.8, 18, 0.4),
    tipp: "Der Coit Tower (1933) steht auf dem Telegraph Hill. Von oben sieht man die ganze Stadt." });
}

/* ---------- Hilfen: Vielecke am Bildrand abschneiden (Sutherland–Hodgman) */
const schnitt = (pts, test, cut) => { const out = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], ia = test(a), ib = test(b); if (ia) out.push(a); if (ia !== ib) out.push(cut(a, b)); } return out; };
const kappY = (pts, ym) => schnitt(pts, (p) => p[1] <= ym, (a, b) => { const t = (ym - a[1]) / (b[1] - a[1]); return [a[0] + (b[0] - a[0]) * t, ym]; });
const kappX = (pts, x0, x1) => { let p = schnitt(pts, (q) => q[0] >= x0, (a, b) => { const t = (x0 - a[0]) / (b[0] - a[0]); return [x0, a[1] + (b[1] - a[1]) * t]; }); return schnitt(p, (q) => q[0] <= x1, (a, b) => { const t = (x1 - a[0]) / (b[0] - a[0]); return [x1, a[1] + (b[1] - a[1]) * t]; }); };
const vl = (pts, fill, ex = "") => pts.length > 2 ? `<path d="M${pts.map(pr).join(" L")} Z" fill="${fill}"${ex}/>` : "";
const kappO = (pts, ym) => schnitt(pts, (p) => p[1] >= ym, (a, b) => { const t = (ym - a[1]) / (b[1] - a[1]); return [a[0] + (b[0] - a[0]) * t, ym]; });
const KLIP = [-2.5, 402.5];
/* die Naht zwischen Nord- und Ostblick: genau am Eckmast mit dem Straßenschild */
const SEAM = 231.3;
/* unten läuft die Naht schräg an der Ostkante der Kreuzung entlang (Beginn der Ziegel-Einfahrt) */
const NAHT_A = [230.6, 221], NAHT_B = [249.5, 262];
const ostKlip = (pts, yMax = 260.5) => { let q = kappX(kappY(pts, yMax), SEAM, 400.5); const dx = NAHT_B[0] - NAHT_A[0], dy = NAHT_B[1] - NAHT_A[1], seite = (p) => (p[0] - NAHT_A[0]) * dy - (p[1] - NAHT_A[1]) * dx;
  return schnitt(q, (p) => seite(p) >= 0, (a, b) => { const sa = seite(a), sb = seite(b), t = sa / (sa - sb); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }); };
const rahmen = (pts) => pts.length > 2 ? kappO(kappY(kappX(pts, KLIP[0], KLIP[1]), 262.5), -2.5) : [];
const vr = (pts, fill, ex = "") => vl(rahmen(pts), fill, ex);
/* Strecke am Rahmen beschneiden (Liang–Barsky); "" wenn ganz draußen */
const seg = (a, b) => { let t0 = 0, t1 = 1; const dx = b[0] - a[0], dy = b[1] - a[1];
  for (const [p, q] of [[-dx, a[0] - KLIP[0]], [dx, KLIP[1] - a[0]], [-dy, a[1] + 2.5], [dy, 262.5 - a[1]]]) { if (p === 0) { if (q < 0) return ""; continue; } const t = q / p; if (p < 0) { if (t > t1) return ""; if (t > t0) t0 = t; } else { if (t < t0) return ""; if (t < t1) t1 = t; } }
  return `M${pr([a[0] + dx * t0, a[1] + dy * t0])} L${pr([a[0] + dx * t1, a[1] + dy * t1])}`; };
const strich = (a, b, st, w) => { const d = seg(a, b); return d ? `<path d="${d}" stroke="${st}" stroke-width="${w}"/>` : ""; };
const hex3 = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const misch = (h, ziel, t) => { const a = hex3(h), b = hex3(ziel); return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
const dunst = (h, d) => misch(h, "#c9d3da", Math.min(0.42, d / 2200));
/* Kiste (Haus als Quader) für eine Kamera P(quer, tief, z): sichtbar sind die Vorderseite (tief = d0),
   die Seite zur Blickachse und — unter Augenhöhe — das Dach. gz(quer, tief) = Gelände.
   Liefert Vielecke {p, f} (schon am Rahmen beschnitten). */
const kiste = (P, gz, a0, a1, d0, d1, H, c) => {
  const g00 = gz(a0, d0), g10 = gz(a1, d0), g01 = gz(a0, d1), g11 = gz(a1, d1), zt = Math.max(g00, g10, g01, g11) + H;
  const V = [], add = (pts, f, o) => { const q = rahmen(pts); if (q.length < 3) return; let A = 0; for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length]; A += a[0] * b[1] - b[0] * a[1]; } if (Math.abs(A) / 2 > 0.3) V.push({ p: q, f, o }); };
  if (zt < E) {
    add([P(a0, d0, zt), P(a1, d0, zt), P(a1, d1, zt), P(a0, d1, zt)], c.dach);
    if (c.aufbau) { const u0 = a0 + (a1 - a0) * 0.2, u1 = a0 + (a1 - a0) * 0.55, e0 = d0 + (d1 - d0) * 0.3, e1 = d0 + (d1 - d0) * 0.6; add([P(u0, e0, zt), P(u0, e0, zt + 2.4), P(u1, e0, zt + 2.4), P(u1, e0, zt)], c.vorn); add([P(u0, e0, zt + 2.4), P(u1, e0, zt + 2.4), P(u1, e1, zt + 2.4), P(u0, e1, zt + 2.4)], c.dach2); }
    if (c.terrasse) add([P(a0 + (a1 - a0) * 0.5, d0 + 0.6, zt), P(a1 - 0.5, d0 + 0.6, zt), P(a1 - 0.5, d1 - 0.6, zt), P(a0 + (a1 - a0) * 0.5, d1 - 0.6, zt)], "#7f9160");
  }
  const seitL = a0 > 0 ? a0 : a1 < 0 ? a1 : null;
  if (seitL !== null) {
    add([P(seitL, d0, a0 > 0 ? g00 : g10), P(seitL, d0, zt), P(seitL, d1, zt), P(seitL, d1, a0 > 0 ? g01 : g11)], c.seite);
    if (c.fenS) { const n = Math.max(1, Math.round(H / 3.1)), b = d1 - d0, m = Math.max(1, Math.round(b / 2.8)); for (let j = 0; j < n; j++) { const z0 = zt - H + 1.1 + j * (H - 1.4) / n; if (z0 + 1.3 > zt - 0.3) continue; for (let i = 0; i < m; i++) add([P(seitL, d0 + (i + 0.25) * b / m, z0), P(seitL, d0 + (i + 0.25) * b / m, z0 + 1.4), P(seitL, d0 + (i + 0.75) * b / m, z0 + 1.4), P(seitL, d0 + (i + 0.75) * b / m, z0)], c.fenS, 1); } }
  }
  add([P(a0, d0, g00), P(a0, d0, zt), P(a1, d0, zt), P(a1, d0, g10)], c.vorn);
  if (c.fen) {
    /* einzelne Fenster auf der Vorderseite (je Geschoss), bei kleinen Häusern ein Band */
    const n = Math.max(1, Math.round(H / 3.1)), b = a1 - a0, m = Math.max(1, Math.round(b / 2.6));
    for (let j = 0; j < n; j++) { const z0 = zt - H + 1.1 + j * (H - 1.4) / n; if (z0 + 1.3 > zt - 0.3) continue;
      if (F * b / d0 < 9) add([P(a0 + 0.8, d0, z0), P(a0 + 0.8, d0, z0 + 1.3), P(a1 - 0.8, d0, z0 + 1.3), P(a1 - 0.8, d0, z0)], c.fen, 1);
      else for (let i = 0; i < m; i++) { const u0 = a0 + (i + 0.25) * b / m, u1 = a0 + (i + 0.75) * b / m; add([P(u0, d0, z0), P(u0, d0, z0 + 1.4), P(u1, d0, z0 + 1.4), P(u1, d0, z0)], c.fen, 1); } }
  }
  return { V, L: c.kante ? [P(a0, d0, zt), P(a1, d0, zt), c.kante, Math.max(0.12, 5 / d0)] : null };
};
const FASS = ["#efe6d2", "#e8d6c0", "#dfe3df", "#f1ddd0", "#e6dcc0", "#d9e1e6", "#f2eadf", "#e9d8d8", "#d8d2c4", "#e4e9dc", "#f3e2bf"];
const DACH = ["#b8b0a2", "#a59d90", "#c2baac", "#9a9389", "#b3a99a", "#8f8a82"];
/* Häuserblöcke als Kisten (Ränder bebaut, Höfe mit Bäumen); liefert Einträge {t: Tiefe, V, L, baum} */
const bloecke = (P, gz, spalten, reihen, frei, fenster, haz, rnd2, maxH, kurz = (a0, a1) => a1) => {
  const L = [];
  const haus = (a0, a1, d0, d1) => {
    a1 = kurz(a0, a1, d0, d1);
    if (frei(a0, a1, d0, d1)) return;
    let H = 7.5 + rnd2() * 4.6; if (rnd2() < 0.08) H += 6;
    H = Math.min(H, maxH(a0, a1, d0, d1, H));
    if (H < 3.5) return;
    const f = FASS[Math.floor(rnd2() * FASS.length)], dk = DACH[Math.floor(rnd2() * DACH.length)], dd = d0;
    const c = { vorn: dunst(haz.vorn(f), dd), seite: dunst(haz.seite(f), dd), dach: dunst(dk, dd), dach2: dunst(misch(dk, "#ffffff", 0.2), dd),
      aufbau: rnd2() < 0.18, terrasse: rnd2() < 0.14, fen: d0 < fenster ? dunst("#56636e", dd) : "", fenS: d0 < fenster * 0.6 ? dunst("#4a5560", dd) : "", kante: d0 < 160 ? dunst("#fbf8f0", dd) : "" };
    L.push({ t: d0 + 0.001 * Math.abs(a0), k0: KLIP[0], ...kiste(P, gz, a0, a1, d0, d1, H, c) });
  };
  for (const [A0, A1] of spalten) for (const [D0, D1] of reihen) {
    const T = 24;
    for (let d = D0; d < D1 - 0.5;) { const w0 = 7.5 + rnd2() * 4 + Math.max(0, d - 150) * 0.025, w = D1 - d - w0 < 4 ? D1 - d : w0; haus(A0, A0 + T, d, d + w); haus(A1 - T, A1, d, d + w); d += w; }
    for (let a = A0 + T; a < A1 - T - 0.5;) { const w0 = 7.5 + rnd2() * 4 + Math.max(0, D0 - 150) * 0.025, w = A1 - T - a - w0 < 4 ? A1 - T - a : w0; haus(a, a + w, D0, D0 + T); haus(a, a + w, D1 - T, D1); a += w; }
    for (let i = 0; i < 2; i++) { const a = A0 + T + rnd2() * (A1 - A0 - 2 * T), d = D0 + T + rnd2() * Math.max(1, D1 - D0 - 2 * T); if (frei(a, a, d, d)) continue; const q = P(a, d, gz(a, d) + 5 + rnd2() * 3), rr = F * (2.4 + rnd2() * 1.6) / d; if (q[0] > -5 && q[0] < 405) L.push({ t: d + 0.0005, baum: [q[0], q[1], rr, dunst(rnd2() < 0.5 ? "#4f6a3a" : "#5f7b45", d)] }); }
  }
  return L;
};
/* Verdeckung: ein grobes Raster (0,5 Einheiten) merkt sich, was schon deckend gemalt ist; Häuser,
   die ganz dahinter liegen, werden gar nicht erst geschrieben (spart Bytes). */
const RAST = { w: 820, h: 550, z: new Uint8Array(820 * 550) };
const rasterVieleck = (pts, fn) => {
  let y0 = Infinity, y1 = -Infinity; for (const p of pts) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
  for (let j = Math.max(0, Math.ceil((y0 + 5) * 2 - 0.5)); j < RAST.h && (j + 0.5) / 2 - 5 <= y1; j++) {
    const y = (j + 0.5) / 2 - 5, xs = [];
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[1] <= y) !== (b[1] <= y)) xs.push(a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1])); }
    xs.sort((u, v) => u - v);
    for (let k2 = 0; k2 + 1 < xs.length; k2 += 2) for (let i = Math.max(0, Math.ceil((xs[k2] + 5) * 2 - 0.5)); i < RAST.w && (i + 0.5) / 2 - 5 <= xs[k2 + 1]; i++) if (fn(j * RAST.w + i)) return true;
  }
  return false;
};
const decke = (pts) => rasterVieleck(pts, (n) => { RAST.z[n] = 1; return false; });
const offen = (pts) => rasterVieleck(pts, (n) => RAST.z[n] === 0);
const zahl = (v, g) => { const q = Math.round(v * g) / g; return String(q).replace(/^(-?)0\./, "$1."); };
const pfad = (pts, g) => `M${pts.map((p) => zahl(p[0], g) + " " + zahl(p[1], g)).join(" ")}Z`;
/* zeichnet eine Liste von nah nach fern mit Verdeckungstest, gibt sie von fern nach nah aus */
const zeichneListe = (L) => {
  const raus = [];
  for (const e of L.slice().sort((a, b) => a.t - b.t)) {
    if (e.baum) { const [x, y, rr] = e.baum; if (offen([[x - rr, y - rr], [x + rr, y - rr], [x + rr, y + rr], [x - rr, y + rr]])) raus.push(e); continue; }
    if (!e.V.length || !e.V.some((v) => !v.o && offen(v.p))) continue;
    e.V.forEach((v) => { if (!v.o) decke(v.p); });
    raus.push(e);
  }
  let s = "";
  for (const e of raus.reverse()) {
    const g = e.t > 250 ? 1 : 2;
    if (e.baum) { const [x, y, rr, f] = e.baum; s += `<circle cx="${zahl(x, g)}" cy="${zahl(y, g)}" r="${zahl(rr, 10)}" fill="${f}"/>`; continue; }
    /* gleiche Farben einer Kiste in einem Pfad zusammenfassen */
    const nachF = new Map(); for (const v of e.V) { const key = v.f + (v.o ? "o" : ""); nachF.set(key, (nachF.get(key) || "") + pfad(v.p, g)); }
    for (const [key, d] of nachF) s += `<path d="${d}" fill="${key.replace(/o$/, "")}"${key.endsWith("o") ? ` opacity=".6"` : ""}/>`;
    if (e.L) { const [a, b, st, w] = e.L, alt = KLIP[0]; KLIP[0] = e.k0; s += strich(a, b, st, zahl(w, 100)); KLIP[0] = alt; }
  }
  return s;
};
const SONNE = { az: 245, el: 48 };
const huelle = (P0) => { const P = P0.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]), x = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], hi = [];
  for (const p of P) { while (lo.length > 1 && x(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of P.reverse()) { while (hi.length > 1 && x(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
  return lo.slice(0, -1).concat(hi.slice(0, -1)); };
const SL = 1 / Math.tan(SONNE.el * Math.PI / 180), SE_ = Math.sin(SONNE.az * Math.PI / 180 + Math.PI), SN_ = Math.cos(SONNE.az * Math.PI / 180 + Math.PI);

/* =====================================================================
   KULISSE vorn: Hyde Street (Fahrbahn bis zur Kuppe bei Chestnut, Geh-
   wege, Kreuzung mit der Lombard Street, zwei Gleise mit Seilschlitz)
   ===================================================================== */
{
  let s = "";
  const kante = (X, d0, d1, n) => { const p = []; for (let i = 0; i <= n; i++) { const d = d0 + (d1 - d0) * i / n; p.push(PN(X, d, zH(d))); } return p; };
  const band = (Xa, Xb, d0, d1, n) => kappY([...kante(Xa, d0, d1, n), ...kante(Xb, d0, d1, n).reverse()], 262);
  /* Kreuzung (Lombard Street), Asphalt bis zum unteren Rand */
  s += vl(kappY([PN(-60, 8.1, 0), PN(-60, 10.7, 0), PN(90, 10.7, 0), PN(90, 8.1, 0)], 262), "#7c7975");
  s += vl(band(-13.5, -1.5, 10, 150, 40), S.lg("asphalt", [[0, "#5f5c59"], [1, "#8a8784"]]));
  s += vl(band(-17, -13.5, 10.6, 150, 30), "#c9c2b6") + vl(band(-1.5, 2.3, 10.6, 150, 30), "#cfc9be");
  /* Schatten der Westhäuser auf Gehweg und Rand der Fahrbahn (Sonne SSW) */
  { /* Schlagschatten der Westhäuser (Sonne 245°, 48°): fällt über Gehweg und die westliche Spur */
    const sp = [], fu = [];
    for (let d = 15; d <= 135; d += 2.5) { const d0 = 15 + Math.floor((d - 15) / 7.6) * 7.6, zr = Math.max(zH(d0), zH(Math.min(d0 + 7.6, 135))) + 10.8, L = (zr - zH(d)) * SL; fu.push(PN(-17, d, zH(d))); sp.push(PN(-17 + L * SE_, d + L * SN_, zH(d + L * SN_))); }
    s += vl(kappY([...fu, ...sp.reverse()], 262), "#1d2433", ` opacity=".3"`); }
  /* Querrillen im steilen Gehweg, Bordsteine */
  let rl = "";
  for (let d = 12; d < 120; d += d < 40 ? 1.1 : 2.6) { rl += `M${pr(PN(-1.4, d, zH(d)))} L${pr(PN(2, d, zH(d)))} `; if (PN(-13.6, d, 0)[0] > 0) rl += `M${pr(PN(-16.9, d, zH(d)))} L${pr(PN(-13.6, d, zH(d)))} `; }
  s += `<path d="${rl}" stroke="#a49e92" stroke-width=".14" opacity=".4" fill="none"/>`;
  for (const X of [-13.5, -1.5]) s += `<path d="M${kante(X, 10.6, 150, 30).map(pr).join(" L")}" stroke="#e6e1d6" stroke-width=".7" fill="none"/>`;
  /* Zebrastreifen über die Hyde Street an der Nordseite der Kreuzung; Kreuzung Chestnut (flach) als hellere Stufe */
  for (let i = 0; i < 6; i++) { const X0 = -13 + i * 2; s += vl([PN(X0, 10.4, 0), PN(X0, 12.8, zH(12.8)), PN(X0 + 1.1, 12.8, zH(12.8)), PN(X0 + 1.1, 10.4, 0)], "#eeeae2", ` opacity=".85"`); }
  s += vl(band(-13.5, -1.5, 135, 150, 2), "#97938e");
  /* zwei Gleise: Schienen und Seilschlitz */
  let gl = "", sl = "";
  for (const Xc of [-9.4, -5.6]) { for (const u of [-0.53, 0.53]) gl += `M${kante(Xc + u, 8.3, 140, 30).map(pr).join(" L")} `; sl += `M${kante(Xc, 8.3, 140, 30).map(pr).join(" L")} `; }
  s += `<path d="${gl}" stroke="#bcb9b2" stroke-width=".55" fill="none"/><path d="${sl}" stroke="#2b2926" stroke-width=".6" fill="none"/>`;
  /* Kanaldeckel und Haltelinie in der Kreuzung */
  for (const [X, d] of [[-7.5, 9.2], [-28, 9.6]]) { const [x, y] = PN(X, d, 0), q = F / d; s += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.4 * q)}" ry="${r(0.4 * q * 4.6 / d)}" fill="#55524e"/><ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.3 * q)}" ry="${r(0.3 * q * 4.6 / d)}" fill="none" stroke="#7a7671" stroke-width=".4"/>`; }
  for (let i = 0; i < 16; i++) { const d = 14 + rnd() * 40, X = -13 + rnd() * 11; s += `<circle cx="${r(PN(X, d, 0)[0])}" cy="${r(PN(X, d, zH(d))[1])}" r="${r(14 / d)}" fill="${rnd() < 0.5 ? "#6d6a66" : "#9a9692"}" opacity=".4"/>`; }
  S.hinten(s);
}

/* =====================================================================
   8 — DAS SEGELSCHIFF am Hyde Street Pier (Fuß der Hyde Street, 0,7 km):
   Balclutha (1886, drei Masten), daneben die Fähre Eureka
   ===================================================================== */
{
  const D = 700, s = F / D, X = 166, Y = FY(D, 0);
  let k = `<rect x="-60" y="-3" width="120" height="3" fill="#7a6a56"/>`;
  /* Eureka: weiße Raddampfer-Fähre */
  k += `<path d="M-52 -2 L-26 -2 L-27 -8 L-51 -8 Z" fill="#f2efe8"/><rect x="-49" y="-14" width="20" height="6" fill="#e8e4da"/><rect x="-40" y="-20" width="2" height="6" fill="#3a3a3a"/>`;
  /* Balclutha: schwarzer Rumpf, drei Masten mit Rahen (Ansicht schräg von vorn) */
  k += `<path d="M-8 -2 L22 -2 L24 -9 L-11 -9 Z" fill="#232528"/><rect x="-10" y="-9.5" width="34" height="1" fill="#e8e2d2"/>`;
  for (const [x, h] of [[-2, 44], [7, 47], [16, 40]]) {
    k += `<line x1="${x}" y1="-9" x2="${x}" y2="${-h}" stroke="#3a2e22" stroke-width=".8"/>`;
    for (const t of [0.45, 0.62, 0.78, 0.92]) k += `<line x1="${r(x - 7 * (1.05 - t))}" y1="${r(-h * t)}" x2="${r(x + 7 * (1.05 - t))}" y2="${r(-h * t)}" stroke="#3a2e22" stroke-width=".5"/>`;
  }
  k += `<path d="M-11 -9 L-2 -44 L7 -47 L16 -40 L26 -9" stroke="#5a4c3c" stroke-width=".3" fill="none"/><line x1="-11" y1="-8" x2="-22" y2="-14" stroke="#3a2e22" stroke-width=".7"/>`;
  /* C. A. Thayer: Schoner, zwei Masten */
  k += `<path d="M30 -2 L52 -2 L53 -6 L29 -6 Z" fill="#e7e1d1"/>`;
  for (const x of [36, 46]) k += `<line x1="${x}" y1="-6" x2="${x}" y2="-30" stroke="#3a2e22" stroke-width=".6"/>`;
  S.teil({ id: "segelschiff", de: "das Segelschiff", syl: "SE-gel-schiff", it: "il veliero", itSyl: "ve-LIE-ro", en: "sailing ship", x: X, y: Y,
    kunst: `<g ${fern(2)} transform="scale(${r(s * 1000) / 1000})">${k}</g>` + flaeche(-4, -20, 13, 20, 0.4),
    tipp: "Die „Balclutha“ ist ein Segelschiff von 1886. Heute liegt sie als Museum am Hyde Street Pier." });
}

/* =====================================================================
   9 — DAS HOLZHAUS: die Häuser Wand an Wand, Fassaden zur Straße.
   Westseite der Hyde Street (Fassaden bei X = −17, nach Osten, im
   Schatten), Ostseite (nur Dächer und schmale Fassaden), Nordseite der
   Lombard Street (Fassaden nach Süden, in der Sonne)
   ===================================================================== */
const GARTEN = kappY(kappX([PN(2.2, 10.6, 0), PN(2.2, 60, zH(60)), PN(26, 60, zH(60) - 5), PN(26, 10.6, -1)], -6, SEAM), 221.5);
const BEET = ostKlip([PO(-14.8, 9, zL(9)), PO(-14.8, 132, zL(132)), PO(4.5, 132, zL(132)), PO(4.5, 9, zL(9))]);
const HAUS = {};
{
  let k = "";
  const farben = [
    { w: "#e9e4d6", t: "#ffffff", a: "#3d5b78" }, { w: "#c9d9de", t: "#ffffff", a: "#2f4f6a" }, { w: "#efdca8", t: "#fffaf0", a: "#3f6a4a" },
    { w: "#cfdcc4", t: "#ffffff", a: "#7a2f3c" }, { w: "#f2d3c4", t: "#ffffff", a: "#5a3a5e" }, { w: "#dcd6ea", t: "#ffffff", a: "#4e3b78" }, { w: "#f3ead8", t: "#ffffff", a: "#8b3a2c" },
  ];
  const schatt = (hex, a) => { const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)); return "#" + c.map((v) => Math.round(v * a).toString(16).padStart(2, "0")).join(""); };
  /* Die Blöcke hinter der Ostseite der Hyde Street (Nordblick) und entlang der Lombard Street bis
     North Beach (Ostblick): Häuser als Kisten in echter Perspektive, Höfe mit Bäumen, Dachterrassen */
  const rnd2 = zufall(4711);
  const LPP = [[0, 0], [2, 0], [126, -33.5], [147, -36], [273, -50], [294, -51], [420, -62], [441, -63], [567, -72], [588, -73], [714, -80], [1500, -82]];
  const zLP = (d) => { for (let i = 1; i < LPP.length; i++) if (d <= LPP[i][0]) { const [d0, z0] = LPP[i - 1], [d1, z1] = LPP[i]; return z0 + (z1 - z0) * (d - d0) / (d1 - d0); } return -82; };
  const gzN = (X, d) => Math.max(-86, zH(d) + 0.85 * zLP(Math.max(0, X - 2)));
  const gzE = (lat, d) => Math.max(-86, zLP(d) - 0.13 * Math.max(0, -lat - 15) + 0.08 * Math.max(0, lat - 5));
  /* Nordblick: Spalten Hyde–Leavenworth, Leavenworth–Jones; Reihen zwischen den Querstraßen.
     Häuser im Blickfeld auf Alcatraz bleiben unter der Sichtlinie (sonst wäre die Insel verdeckt). */
  const freiN = (a0, a1, d0, d1) => (a0 < 30 && d0 < 60) || d0 < 40 || VN + F * a0 / d1 > 262;
  const maxN = (a0, a1, d0, d1) => { const x0 = VN + F * a0 / d1, x1 = VN + F * a1 / d0; if (x1 < 170 || x0 > 228) return 99; return E - 13 * d0 / F - Math.max(gzN(a0, d0), gzN(a1, d0), gzN(a0, d1), gzN(a1, d1)); };
  const LN = bloecke(PN, gzN, [[2, 126], [147, 273]], [[15, 135], [150, 272], [287, 410], [425, 550], [565, 690]], freiN, 95,
    { vorn: (f) => misch(f, "#3e5070", 0.1), seite: (f) => misch(f, "#fff4e0", 0.1) }, rnd2, maxN, (a0, a1, d0) => a0 === 2 && d0 < 135 ? 18 : a1);
  for (let d = 45; d < 690; d += d < 150 ? 10 : 20) { const d1 = Math.min(690, d + (d < 150 ? 10 : 20)), xs = [2, 60, 126, 210, 330]; LN.push({ t: d1 - 0.01, V: [{ p: rahmen([...xs.map((X) => PN(X, d, gzN(X, d))), ...xs.slice().reverse().map((X) => PN(X, d1, gzN(X, d1)))]), f: dunst("#8b897f", d) }] }); }
  /* Ostblick: nördlich und südlich der Lombard Street, Blöcke bis zur Mason Street (≈ 0,7 km) */
  const freiE = (a0, a1, d0, d1) => (a1 <= 0 ? VO + F * a1 / d1 < 230 : VO + F * a0 / d1 > 405) || d1 > 715 || (a0 >= -39.2 && a1 <= -14.9 && d1 <= 126.1) || (a1 <= 0 && d0 < 30);
  const reihenE = [[2, 126], [147, 273], [294, 420], [441, 567], [588, 714]];
  KLIP[0] = SEAM;
  const LE = [
    ...bloecke(PO, gzE, [[-272, -150], [-135, -15]], reihenE, freiE, 75, { vorn: (f) => misch(f, "#fff4e0", 0.1), seite: (f) => misch(f, "#3e5070", 0.08) }, rnd2, () => 99),
    ...bloecke(PO, gzE, [[5, 125]], reihenE, freiE, 110, { vorn: (f) => misch(f, "#fff4e0", 0.1), seite: (f) => misch(f, "#3e5070", 0.36) }, rnd2, (a0, a1, d0) => d0 < 130 ? 10.5 : 99),
  ];
  for (let d = 20; d < 714; d += d < 126 ? 12 : 22) { const d1 = Math.min(714, d + (d < 126 ? 12 : 22)), ls = [-330, -135, -15, 5, 60]; LE.push({ t: d1 - 0.01, V: [{ p: rahmen([...ls.map((l) => PO(l, d, gzE(l, d))), ...ls.slice().reverse().map((l) => PO(l, d1, gzE(l, d1)))]), f: dunst("#8b897f", d) }] }); }
  KLIP[0] = -2.5;
  /* Westseite der Hyde Street: fern vereinfacht, nah mit Erker, Gesims, Garage, Treppe */
  const WL = [];
  for (let d0 = 15; d0 < 134; d0 += 7.6) WL.push([d0, Math.min(d0 + 7.6, 135)]);
  for (const [A, Bq] of [[150, 272], [287, 410], [425, 550], [565, 690]]) { const n = Math.ceil((Bq - A) / 15); for (let j = 0; j < n; j++) WL.push([A + (Bq - A) * j / n, A + (Bq - A) * (j + 1) / n]); }
  const ersteImBlock = new Set([15, 150, 287, 425, 565]);
  for (const [d0, d1] of WL.reverse()) {
    if (PN(-17, d1, 0)[0] < -5) continue;
    const fern_ = d0 > 130, i = Math.round(d0 / 7.6), f = farben[i % 7];
    const zb0 = zH(d0), zb1 = zH(d1), zr = Math.max(zb0, zb1) + (fern_ ? 10 : 10.8), giebel = d0 < 60 && i % 7 === 6, nah = d0 < 62;
    /* Straßenfassaden zeigen nach Osten: am Nachmittag im Eigenschatten, kühler */
    const W = misch(schatt(f.w, 0.76), "#3e5070", 0.18), WT = misch(schatt(f.t, 0.8), "#3e5070", 0.12);
    if (zr < E - 0.3) k += vr([PN(-17, d0, zr), PN(-28, d0, zr), PN(-28, d1, zr), PN(-17, d1, zr)], "#9c9488");
    if (ersteImBlock.has(d0)) k += vr([PN(-28, d0, zb0), PN(-28, d0, zr), PN(-17, d0, zr), PN(-17, d0, zb0)], schatt(f.w, 0.93));
    k += vr([PN(-17, d0, zb0), PN(-17, d0, zr), PN(-17, d1, zr), PN(-17, d1, zb1)], W);
    if (fern_) { k += strich(PN(-17, d0, zr), PN(-17, d1, zr), WT, ".3"); continue; }
    /* Gesims mit Konsolen (von unten gesehen) */
    k += vr([PN(-17, d0, zr - 0.7), PN(-16.4, d0, zr - 0.7), PN(-16.4, d1, zr - 0.7), PN(-17, d1, zr - 0.7)], schatt(f.t, 0.55));
    k += vr([PN(-16.4, d0, zr - 0.7), PN(-16.4, d0, zr), PN(-16.4, d1, zr), PN(-16.4, d1, zr - 0.7)], WT);
    let kon = "";
    for (let t = 0.05; t < 1 && d0 < 75; t += 0.09) { const d = d0 + t * 7.6; kon += seg(PN(-16.6, d, zr - 0.7), PN(-16.6, d, zr - 1.3)) + " "; }
    k += `<path d="${kon}" stroke="${schatt(WT, 0.55)}" stroke-width="${r(Math.max(0.2, 12 / d0))}"/>`;
    if (nah) { const zz = seg(PN(-16.5, d0, zr - 1.45), PN(-16.5, d1, zr - 1.45)); if (zz) k += `<path d="${zz}" stroke="${schatt(WT, 0.6)}" stroke-width="${r(9 / d0)}" stroke-dasharray=".22 .2"/>`; }
    if (giebel) { const gm = (d0 + d1) / 2; k += vr([PN(-16.4, d0, zr), PN(-16.4, gm, zr + 3.6), PN(-16.4, d1, zr)], W) + strich(PN(-16.3, d0, zr), PN(-16.3, gm, zr + 3.6), WT, r(10 / d0)) + strich(PN(-16.3, gm, zr + 3.6), PN(-16.3, d1, zr), WT, r(10 / d0)); }
    /* Garage (talseitig): Tor waagerecht auf Gehweghöhe am oberen Ende, darunter der Sockel zum Gefälle */
    { const ga = d0 + 4.4, gb = d1 - 0.4, zg = zH(ga);
      k += vr([PN(-16.95, ga, zg), PN(-16.95, gb, zg), PN(-16.95, gb, zH(gb))], "#b8b2a6");
      k += vr([PN(-16.95, ga, zg), PN(-16.95, ga, zg + 2.3), PN(-16.95, gb, zg + 2.3), PN(-16.95, gb, zg)], misch(WT, "#c8c0b0", 0.3));
      for (let j = 1; j < 4; j += nah ? 1 : 2) k += strich(PN(-16.94, ga + 0.1, zg + j * 0.575), PN(-16.94, gb - 0.1, zg + j * 0.575), "#8a8478", r(Math.max(0.08, 3.5 / d0)));
      if (nah) for (const t of [0.33, 0.66]) k += strich(PN(-16.94, ga + (gb - ga) * t, zg + 0.05), PN(-16.94, ga + (gb - ga) * t, zg + 2.25), "#8a8478", r(3 / d0)); }
    /* Eingangstreppe mit Wange und Geländer hinauf zur Haustür mit Vordach (bergseitig) */
    if (nah) {
      const t0 = d0 + 0.4, t1 = d0 + 1.8, n = 5;
      const wange = [PN(-15.5, t0, zb0)]; for (let j = 0; j < n; j++) { const xx = -15.5 - j * 0.29; wange.push(PN(xx, t0, zb0 + 0.2 * (j + 1)), PN(xx - 0.29, t0, zb0 + 0.2 * (j + 1))); } wange.push(PN(-16.95, t0, zb0));
      for (let j = n - 1; j >= 0; j--) { const xx = -15.5 - j * 0.29, zz = zb0 + 0.2 * (j + 1); k += vr([PN(xx, t0, zz), PN(xx, t1, zz), PN(xx - 0.29, t1, zz), PN(xx - 0.29, t0, zz)], "#ddd7cb") + vr([PN(xx, t0, zz - 0.2), PN(xx, t1, zz - 0.2), PN(xx, t1, zz), PN(xx, t0, zz)], "#a9a397"); }
      k += vr(wange, "#c4bdb0");
      k += strich(PN(-15.5, t0, zb0 + 0.9), PN(-16.95, t0, zb0 + 1.95), "#2f2c28", r(Math.max(0.1, 5 / d0))) + strich(PN(-15.5, t0, zb0), PN(-15.5, t0, zb0 + 0.9), "#2f2c28", r(Math.max(0.1, 5 / d0)));
    }
    k += vr([PN(-16.95, d0 + 0.6, zb0 + 1), PN(-16.95, d0 + 0.6, zb0 + 3.3), PN(-16.95, d0 + 1.6, zb0 + 3.3), PN(-16.95, d0 + 1.6, zb0 + 1)], f.a);
    if (nah) k += vr([PN(-16.95, d0 + 0.4, zb0 + 3.55), PN(-16.35, d0 + 0.4, zb0 + 3.4), PN(-16.35, d0 + 1.8, zb0 + 3.4), PN(-16.95, d0 + 1.8, zb0 + 3.55)], WT);
    /* der schräge Erker (Bay Window) über zwei Geschosse; die Südseite schaut zu uns */
    const e0 = d0 + 2, e1 = d0 + 5.6, ez0 = zb0 + 3.4, ez1 = zr - 1.4;
    k += vr([PN(-17, e0, ez0), PN(-16, e0 + 0.8, ez0), PN(-16, e0 + 0.8, ez1), PN(-17, e0, ez1)], schatt(f.w, 0.9));
    k += vr([PN(-16, e0 + 0.8, ez0), PN(-16, e1 - 0.8, ez0), PN(-16, e1 - 0.8, ez1), PN(-16, e0 + 0.8, ez1)], W);
    for (const zf of [ez0 + 0.6, ez0 + 3.3]) {
      k += vr([PN(-16.85, e0 + 0.12, zf), PN(-16.12, e0 + 0.7, zf), PN(-16.12, e0 + 0.7, zf + 1.9), PN(-16.85, e0 + 0.12, zf + 1.9)], "#5a6f82", ` stroke="${WT}" stroke-width="${r(Math.max(0.1, 6 / d0))}"`);
      k += vr([PN(-15.98, e0 + 1, zf), PN(-15.98, e1 - 1, zf), PN(-15.98, e1 - 1, zf + 1.9), PN(-15.98, e0 + 1, zf + 1.9)], "#3e4c5a", ` stroke="${WT}" stroke-width="${r(Math.max(0.1, 6 / d0))}"`);
      k += strich(PN(-16.5, e0 + 0.4, zf + 0.95), PN(-16.1, e0 + 0.7, zf + 0.95), WT, r(Math.max(0.08, 4 / d0)));
      k += strich(PN(-15.97, e0 + 1, zf + 0.95), PN(-15.97, e1 - 1, zf + 0.95), WT, r(Math.max(0.08, 4 / d0)));
    }
    k += vr([PN(-16, e0 + 0.8, ez1), PN(-16, e1 - 0.8, ez1), PN(-16, e1 - 0.8, ez1 + 0.4), PN(-16, e0 + 0.8, ez1 + 0.4)], f.a);
    /* Schiebefenster neben dem Erker (Rahmen, Kämpfer in der Mitte) */
    for (const zf of [ez0 + 0.6, ez0 + 3.3]) { k += vr([PN(-16.97, e1 + 0.2, zf), PN(-16.97, e1 + 1.3, zf), PN(-16.97, e1 + 1.3, zf + 1.9), PN(-16.97, e1 + 0.2, zf + 1.9)], "#46566a", ` stroke="${WT}" stroke-width="${r(Math.max(0.1, 6 / d0))}"`) + strich(PN(-16.96, e1 + 0.2, zf + 0.95), PN(-16.96, e1 + 1.3, zf + 0.95), WT, r(Math.max(0.08, 5 / d0))); }
    if (d0 >= 70 && d0 < 80) HAUS.erker = { p: PN(-16.5, e0 + 0.4, ez0), q: PN(-16.5, e0 + 0.4, ez1), g: PN(-16.95, d0 + 5.5, zb1), g2: PN(-16.95, d0 + 5.5, zb1 + 2.4), d: d0 };
  }
  const DECK = [], vd = (pts, f, ex = "") => { const q = rahmen(pts); if (!ex) DECK.push(q); return vl(q, f, ex); };
  /* Nordseite der Lombard Street (Ostblick): Fassaden nach Süden (Nachmittagssonne von Südwesten),
     Erker, Haustür mit Eingangstreppe, Garage mit Paneelen */
  KLIP[0] = SEAM;
  for (let d0 = 118; d0 >= 34; d0 -= 7.6) {
    const d1 = d0 + 7.6, i = Math.round(d0 / 7.6) + 3, f = farben[i % 7], zb0 = zL(d0), zb1 = zL(d1), zr = zb0 + 10, nah = d0 < 75;
    if (zr < E - 0.3) k += vd([PO(-15, d0, zr), PO(-26, d0, zr), PO(-26, d1, zr), PO(-15, d1, zr)], "#a89f92");
    k += vd([PO(-15, d0, zb0), PO(-15, d0, zr), PO(-15, d1, zr), PO(-15, d1, zb1)], schatt(f.w, 0.94));
    k += vd([PO(-15, d0, zr - 0.6), PO(-14.5, d0, zr - 0.6), PO(-14.5, d1, zr - 0.6), PO(-15, d1, zr - 0.6)], f.t);
    const e0 = d0 + 2.2, e1 = d0 + 5.2, ez0 = zb0 + 2.8, ez1 = zr - 1.2;
    k += vd([PO(-15, e0, ez0), PO(-14, e0 + 0.8, ez0), PO(-14, e0 + 0.8, ez1), PO(-15, e0, ez1)], misch(f.w, "#ffffff", 0.25));
    k += vd([PO(-14, e0 + 0.8, ez0), PO(-14, e1 - 0.8, ez0), PO(-14, e1 - 0.8, ez1), PO(-14, e0 + 0.8, ez1)], schatt(f.w, 0.9));
    for (const zf of [ez0 + 0.5, ez0 + 3.2]) {
      k += vd([PO(-14.85, e0 + 0.12, zf), PO(-14.12, e0 + 0.7, zf), PO(-14.12, e0 + 0.7, zf + 1.8), PO(-14.85, e0 + 0.12, zf + 1.8)], "#4f6274", ` stroke="${f.t}" stroke-width=".15"`);
      k += vd([PO(-13.98, e0 + 1, zf), PO(-13.98, e1 - 1, zf), PO(-13.98, e1 - 1, zf + 1.8), PO(-13.98, e0 + 1, zf + 1.8)], "#46586a", ` stroke="${f.t}" stroke-width=".15"`);
    }
    /* Haustür oben am Hang mit Vordach und Treppe, Garage unten (Gehweghöhe) */
    k += vd([PO(-14.97, d0 + 0.5, zb0 + 0.9), PO(-14.97, d0 + 0.5, zb0 + 3), PO(-14.97, d0 + 1.6, zb0 + 3), PO(-14.97, d0 + 1.6, zb0 + 0.9)], f.a);
    k += vd([PO(-14.6, d0 + 0.35, zb0 + 3.1), PO(-14.6, d0 + 1.75, zb0 + 3.1), PO(-15, d0 + 1.75, zb0 + 3.22), PO(-15, d0 + 0.35, zb0 + 3.22)], schatt(f.t, 0.82));
    if (nah) for (let j = 0; j < 4; j++) { const zz = zb0 + 0.22 * (j + 1); k += vd([PO(-14.2 + j * 0.2, d0 + 0.4, zz), PO(-14.2 + j * 0.2, d0 + 1.7, zz), PO(-14.2 + j * 0.2, d0 + 1.7, zz - 0.22), PO(-14.2 + j * 0.2, d0 + 0.4, zz - 0.22)], j % 2 ? "#cfc9bd" : "#e0dace"); }
    const g0 = d0 + 5.6, g1 = d1 - 0.3, gz0 = zL(g1);
    k += vd([PO(-14.95, g0, gz0), PO(-14.95, g0, gz0 + 2.3), PO(-14.95, g1, gz0 + 2.3), PO(-14.95, g1, gz0)], misch(f.t, "#c9c2b4", 0.4));
    if (nah) { let gp = ""; for (let j = 1; j < 4; j++) gp += seg(PO(-14.94, g0 + 0.1, gz0 + j * 0.58), PO(-14.94, g1 - 0.1, gz0 + j * 0.58)) + " "; k += `<path d="${gp}" stroke="#9c958a" stroke-width=".18"/>`; }
  }
  KLIP[0] = -2.5;
  DECK.forEach((q) => q.length > 2 && decke(q));
  decke(GARTEN); decke(BEET);
  const sE = zeichneListe(LE), sN = zeichneListe(LN);
  k = sN + sE + k;
  const er = HAUS.erker;
  S.teil({ id: "holzhaus", de: "das Holzhaus", syl: "HOLZ-haus", it: "la casa di legno", itSyl: "CA-sa di LE-gno", en: "wooden house", x: 0, y: 0, kunst: k,
    tipp: "Die bunten Holzhäuser stammen aus der Zeit um 1900–1915. Die berühmtesten, die „Painted Ladies“, stehen am Alamo Square.",
    zoom: { x: r(er.p[0] - (er.g[1] - er.q[1] + 14) * 0.75), y: r(er.q[1] - 8), w: r((er.g[1] - er.q[1] + 14) * 1.5), h: r(er.g[1] - er.q[1] + 14) },
    unter: [
      { id: "erker", de: "der Erker", syl: "ER-ker", it: "il bovindo", itSyl: "bo-VIN-do", en: "bay window", x: er.p[0], y: er.p[1], kunst: flaeche(-4, -(er.p[1] - er.q[1]), 10, er.p[1] - er.q[1], 0.5),
        tipp: "Durch die schrägen Erker kommt mehr Licht ins Haus — typisch für San Francisco." },
      { id: "garage", de: "die Garage", syl: "ga-RA-ge", it: "il garage", itSyl: "ga-RA-ge", en: "garage", x: er.g[0], y: er.g[1], kunst: flaeche(-6, -(er.g[1] - er.g2[1]), 12, er.g[1] - er.g2[1], 0.5),
        tipp: "Am steilen Hang liegt die Garage unten an der Straße, die Wohnung darüber." },
    ] });
}

/* =====================================================================
   10 — DIE LOMBARD STREET (Ostblick): acht Haarnadelkehren aus roten
   Ziegeln mit Ziegel-Bordmauern und Buchskanten, Hortensienbüsche in den
   Beeten, Treppen mit Geländer an beiden Seiten; Einfahrt an der
   Kreuzung (das Pflaster unten läuft über die Naht). Links vorn der
   Eckgarten an der Nordostecke (?) mit Gartenmauer.
   ===================================================================== */
const LOMB = {};
{
  let k = "";
  const KL = (pts) => ostKlip(pts);
  const vk = (pts, f, ex = "") => vl(KL(pts), f, ex);
  /* Eckgarten (Nordblick, links der Naht) mit Gartenmauer und Hecke */
  k += vl(GARTEN, S.lg("garten", [[0, "#5c7d43"], [1, "#46663a"]]));
  {
    const he = []; for (let d = 10.9; d <= 60; d += 1.6) he.push(d);
    const band = (z0, z1) => kappX([...he.map((d) => PN(2.25, d, zH(d) + z0)), ...he.slice().reverse().map((d) => PN(2.25, d, zH(d) + z1))], -6, SEAM);
    k += vl(band(0, 0.62), "#b9ae9c") + vl(kappX([...he.map((d) => PN(2.25, d, zH(d) + 0.62)), ...he.slice().reverse().map((d) => PN(2.75, d, zH(d) + 0.62))], -6, SEAM), "#d6cdbd");
    k += vl(kappX([...he.map((d) => PN(2.8, d, zH(d) + 0.62)), ...he.slice().reverse().map((d) => PN(2.8, d, zH(d) + 1.7))], -6, SEAM), "#3f5f30");
    k += vl(kappX([...he.map((d) => PN(2.8, d, zH(d) + 1.7)), ...he.slice().reverse().map((d) => PN(3.6, d, zH(d) + 1.7))], -6, SEAM), "#567a44");
  }
  for (let i = 0; i < 10; i++) { const d = 16 + rnd() * 38, X = 5 + rnd() * 18, p = PN(X, d, zH(d) - 0.03 * X + 0.6); if (p[0] < SEAM - 2 && p[1] < 215) k += `<circle cx="${r(p[0])}" cy="${r(p[1])}" r="${r(F * (0.6 + rnd() * 0.5) / d)}" fill="${rnd() < 0.5 ? "#3e5a2e" : "#56794a"}"/>`; }
  /* Bäume mit scharfem Schatten nach rechts hinten (Sonne 245°, 48°) */
  const baum = (X, d, h, rk) => { const g = zH(d) - 0.05 * X, [x, y] = PN(X, d, g), s2 = F / d, top = PN(X, d, g + h)[1], R = rk * s2;
    const L = h * SL, T = PN(X + L * SE_, d + L * SN_, g); let b = `<path d="M${pr([x - 0.25 * s2, y])} L${pr([T[0] - 0.1 * s2, T[1]])} L${pr([T[0] + 0.1 * s2, T[1]])} L${pr([x + 0.25 * s2, y])} Z" fill="#1d2a14" opacity=".35"/>`;
    b += `<path d="M${r(x - 0.18 * s2)} ${r(y)} L${r(x - 0.1 * s2)} ${r(top + R)} L${r(x + 0.1 * s2)} ${r(top + R)} L${r(x + 0.18 * s2)} ${r(y)} Z" fill="#4a3a2a"/>`;
    for (const [dx, dy, rr, c] of [[0, 0.9, 1, "#2f4a25"], [-0.55, 0.45, 0.72, "#3d5b2e"], [0.5, 0.35, 0.75, "#3a5a2c"], [-0.15, 0.1, 0.62, "#4f7340"], [-0.35, -0.1, 0.42, "#6b9150"]]) b += `<circle cx="${r(x + dx * R)}" cy="${r(top + R * (dy + 0.1))}" r="${r(rr * R)}" fill="${c}"/>`;
    return b; };
  k += baum(4.5, 31, 5.4, 1.6) + baum(11.2, 52, 11, 2.5);
  /* Beete des Blocks */
  k += vl(BEET, S.lg("beet", [[0, "#3d5a2a"], [1, "#5a7a40"]]));
  /* Gehweg-Treppen an beiden Seiten: Stufen, Wange, Geländer */
  for (const [l0, l1, gl] of [[-14.8, -12.9, -12.9], [2.7, 4.5, 2.7]]) {
    k += vk([PO(l0, 12, zL(12)), PO(l0, 132, zL(132)), PO(l1, 132, zL(132)), PO(l1, 12, zL(12))], "#d3ccbf");
    let st = ""; for (let d = 14; d < 120; d += d < 50 ? 0.8 : 2) { const q = KL([PO(l0, d, zL(d)), PO(l1, d, zL(d)), PO(l1, d, zL(d))]); if (q.length > 1) st += `M${pr(q[0])} L${pr(q[1])}`; }
    k += `<path d="${st}" stroke="#a49d90" stroke-width=".3"/>`;
    const gel = []; for (let d = 14; d <= 130; d += 4) gel.push(PO(gl, d, zL(d) + 0.95));
    let g = ""; for (let i = 0; i + 1 < gel.length; i++) g += seg(gel[i], gel[i + 1]) + " ";
    for (let d = 16; d < 128; d += 6) g += seg(PO(gl, d, zL(d)), PO(gl, d, zL(d) + 0.95)) + " ";
    const gk = g.replace(/M(-?[\d.]+) (-?[\d.]+) L(-?[\d.]+) (-?[\d.]+)/g, (m0, a, b2, c, e) => { const q = KL([[+a, +b2], [+c, +e], [+c, +e]]); return q.length > 1 ? `M${pr(q[0])} L${pr(q[1])}` : ""; });
    k += `<path d="${gk}" stroke="#3c3a36" stroke-width=".22" fill="none"/>`;
  }
  /* Mittellinie: Haarnadeln um Mittelpunkte links (−8,2) und rechts (−2,4), Radius 2,6 m */
  const RHO = 2.6, DT = (i) => 14 + 14.4 * i, LA = (i) => (i % 2 ? -2.4 : -8.2);
  const stuecke = [];
  let vor = [8.5, -5];
  for (let i = 0; i < 8; i++) {
    const dc = DT(i), lc = LA(i), links = i % 2 === 0, bog = [];
    for (let j = 0; j <= 6; j++) { const t = Math.PI + (links ? 1 : -1) * Math.PI * j / 6; bog.push([dc + RHO * Math.cos(t), lc + RHO * Math.sin(t)]); }
    stuecke.push({ p: [vor, bog[0]], t: (vor[0] + bog[0][0]) / 2 });
    stuecke.push({ p: bog, t: dc, mitte: [dc, lc], links });
    vor = bog[bog.length - 1];
  }
  stuecke.push({ p: [vor, [126, -5]], t: (vor[0] + 126) / 2 });
  const proj = (q, z = 0) => PO(q[1], q[0], zL(q[0]) + z);
  const versatz = (p, o) => p.map((q, i) => { const a = p[Math.max(0, i - 1)], b = p[Math.min(p.length - 1, i + 1)], dd = b[0] - a[0], dl = b[1] - a[1], l = Math.hypot(dd, dl) || 1; return [q[0] - dl / l * o, q[1] + dd / l * o]; });
  const ZIEGEL = S.lg("brick", [[0, "#a64a35"], [1, "#c25c42"]]);
  const farbenH = ["#ec8fb8", "#c28be0", "#8fb0ea", "#f4f0f6", "#e46f9d", "#b58be6"];
  const busch = (d, lat, gr = 1) => { const [x, y] = PO(lat, d, zL(d) + 0.2), s = F * 0.62 * gr / d; if (y > 257 || x - 1.9 * s < SEAM || x + 1.9 * s > 399.5) return "";
    let g = `<path d="M${r(x - 1.9 * s)} ${r(y)} Q${r(x - 1.9 * s)} ${r(y - 1.3 * s)} ${r(x - 0.6 * s)} ${r(y - 1.5 * s)} Q${r(x)} ${r(y - 2 * s)} ${r(x + 0.7 * s)} ${r(y - 1.5 * s)} Q${r(x + 1.9 * s)} ${r(y - 1.3 * s)} ${r(x + 1.9 * s)} ${r(y)} Z" fill="#2f4d24"/>`;
    const fb = farbenH[Math.floor(rnd() * 6)];
    for (let i = 0; i < (d < 40 ? 9 : d < 70 ? 6 : 4); i++) { const a = rnd() * Math.PI, rr = 1.45 * s * Math.sqrt(rnd()), c = rnd() < 0.7 ? fb : farbenH[Math.floor(rnd() * 6)]; g += `<circle cx="${r(x + Math.cos(a) * rr)}" cy="${r(y - 0.45 * s - Math.sin(a) * rr * 0.75)}" r="${r(s * (0.2 + rnd() * 0.1))}" fill="${c}"/>`; }
    return g; };
  /* Büsche außen an den Schenkeln (an den Treppen) — vor den Kehren gezeichnet, je nach Tiefe */
  const aussen = [{ t: 15.5, s: busch(15.5, -0.6, 0.8) + busch(17, 1.6, 0.75) + busch(19, -0.2, 0.8) }]; for (let d = 20; d < 122; d += 7.2) { aussen.push({ t: d + 0.5, s: busch(d, -11.9, 0.9) }); aussen.push({ t: d + 0.5, s: busch(d + 3.6, 1.6, 0.9) }); }
  const teile = [...stuecke.map((st) => ({ t: st.t, st })), ...aussen].sort((a, b) => b.t - a.t);
  for (const e of teile) {
    if (!e.st) { k += e.s; continue; }
    const p = e.st.p, Lr = versatz(p, 2.1), Rr = versatz(p, -2.1), Lh = versatz(p, 2.45), Rh = versatz(p, -2.45);
    /* Ziegel-Bordmauer (0,3 m), darauf die Buchskante (0,35 m, oben heller), dann die Fahrbahn */
    for (const [a, h] of [[Lr, Lh], [Rr, Rh]]) {
      k += vk([...a.map((q) => proj(q)), ...a.slice().reverse().map((q) => proj(q, 0.3))], "#8a3a2a");
      k += vk([...a.map((q) => proj(q, 0.3)), ...a.slice().reverse().map((q) => proj(q, 0.65))], "#2d4a22");
      k += vk([...a.map((q) => proj(q, 0.65)), ...h.slice().reverse().map((q) => proj(q, 0.65))], "#5d8449");
    }
    const weg = [...Lr.map((q) => proj(q)), ...Rr.slice().reverse().map((q) => proj(q))];
    k += vk(weg, ZIEGEL) + vk(weg, `url(#${S.id("ziegel")})`);
    if (e.st.mitte) { const [dc, lc] = e.st.mitte; k += busch(dc, lc, 1.1); if (!LOMB.kurve && dc > 30) LOMB.kurve = proj([dc, lc + (e.st.links ? -RHO : RHO)]); if (!LOMB.hort && dc > 40) LOMB.hort = PO(lc, dc, zL(dc) + 0.2); }
  }
  const kv = LOMB.kurve, hv = LOMB.hort;
  S.teil({ id: "lombard_street", de: "die Lombard Street", syl: "LOM-bard STREET", it: "la Lombard Street", itSyl: "LOM-bard STREET", en: "Lombard Street", x: 0, y: 0, kunst: k,
    tipp: "Die Lombard Street hat hier acht enge Kurven. Man darf nur bergab fahren — ganz langsam.",
    zoom: { x: 246, y: 152, w: 120, h: 80 },
    unter: [
      { id: "kurve", de: "die Kurve", syl: "KUR-ve", it: "la curva", itSyl: "CUR-va", en: "bend", x: kv[0], y: kv[1], kunst: flaeche(-6, -4, 12, 7, 0.6),
        tipp: "Die Kurven wurden 1922 gebaut, weil die Straße für Autos zu steil war." },
      { id: "hortensie", de: "die Hortensie", syl: "hor-TEN-si-e", it: "l'ortensia", itSyl: "or-TEN-sia", en: "hydrangea", x: hv[0], y: hv[1], kunst: flaeche(-5, -5, 10, 7, 0.5),
        tipp: "In den Beeten blühen im Sommer Hortensien in Rosa, Lila und Blau." },
    ] });
}

/* =====================================================================
   11 — DAS AUTO (parkt bergab an der Ostseite, Vorderräder zum Bordstein)
   ===================================================================== */
{
  /* parkt mit der Nase bergab (nach Norden) am Ostbordstein; wir sehen Heck und rechte Seite.
     Das rechte Vorderrad ist zum Bordstein eingeschlagen (Pflicht am Hang). */
  const C = { X: -2.5, d: 24 };
  const W3 = (u, v, h) => PN(C.X + v, C.d + u, zH(C.d + u) + h);
  const [ox, oy] = W3(0, 0, 0);
  const P = (u, v, h) => { const [x, y] = W3(u, v, h); return [x - ox, y - oy]; };
  const Q = (pts, f, ex = "") => `<path d="M${pts.map((q) => pr(P(...q))).join(" L")} Z" fill="${f}"${ex}/>`;
  /* scharfer Schatten unter dem Wagen, nach rechts hinten verlängert */
  { const L = 1.45 * SL, pts = []; for (const [u, v] of [[-2.3, -0.9], [2.3, -0.9], [2.3, 0.9], [-2.3, 0.9]]) { pts.push(P(u, v, 0)); pts.push(P(u + L * SN_, v + L * SE_, 0)); }
    var k = `<path d="M${huelle(pts).map(pr).join(" L")} Z" fill="#1d2433" opacity=".34"/>`; }
  /* Räder links (nur unten sichtbar) */
  k += Q([[-1.75, -0.85, 0], [-1.15, -0.85, 0], [-1.15, -0.85, 0.3], [-1.75, -0.85, 0.3]], "#151515");
  /* Karosserie: rechte Seite, Heck, Dach, Scheiben */
  const BLAU = S.lg("autoseite", [[0, "#7895b3"], [1, "#4a6684"]]);
  k += Q([[-2.3, 0.9, 0.3], [2.3, 0.9, 0.3], [2.25, 0.9, 0.95], [-2.3, 0.9, 0.95]], BLAU);
  k += Q([[-2.3, -0.9, 0.3], [-2.3, 0.9, 0.3], [-2.3, 0.9, 0.95], [-2.3, -0.9, 0.95]], "#55728f");
  k += Q([[-2.3, -0.9, 0.95], [-2.3, 0.9, 0.95], [2.25, 0.9, 0.95], [2.25, -0.9, 0.95]], "#86a3bf");
  k += Q([[-1.55, -0.8, 0.95], [-1.55, 0.8, 0.95], [-1.1, 0.72, 1.42], [-1.1, -0.72, 1.42]], "#2f3c47");
  k += Q([[-1.1, -0.72, 1.42], [-1.1, 0.72, 1.42], [0.6, 0.72, 1.42], [0.6, -0.72, 1.42]], "#8fabc5");
  k += Q([[-1.55, 0.8, 0.95], [1.25, 0.8, 0.95], [0.6, 0.72, 1.42], [-1.1, 0.72, 1.42]], "#34424f");
  k += Q([[-0.3, 0.81, 0.97], [-0.22, 0.79, 1.4], [-0.15, 0.79, 1.4], [-0.23, 0.81, 0.97]], "#55728f");
  for (const v of [-0.62, 0.62]) k += Q([[-2.31, v - 0.2, 0.7], [-2.31, v + 0.2, 0.7], [-2.31, v + 0.2, 0.82], [-2.31, v - 0.2, 0.82]], "#c8232c");
  k += Q([[-2.31, -0.25, 0.42], [-2.31, 0.25, 0.42], [-2.31, 0.25, 0.55], [-2.31, -0.25, 0.55]], "#f2f0e8");
  /* Außenspiegel rechts */
  k += Q([[1.05, 0.9, 0.98], [1.05, 1.08, 1.0], [1.15, 1.08, 1.12], [1.15, 0.9, 1.1]], "#4a6684");
  /* Räder rechts: hinten gerade, vorn zum Bordstein (nach rechts) eingeschlagen — Reifen mit Felge */
  const rad = (uc, dreh) => { const pts = [], fe = []; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, du = Math.cos(a), dz = Math.sin(a); pts.push([uc + du * 0.33 * Math.cos(dreh), 0.92 + du * 0.33 * Math.sin(dreh), 0.33 + dz * 0.33]); fe.push([uc + du * 0.19 * Math.cos(dreh), 0.93 + du * 0.19 * Math.sin(dreh), 0.33 + dz * 0.19]); } return Q(pts, "#1a1b1c") + Q(fe, "#8d9196"); };
  k += rad(-1.45, 0) + rad(1.45, 0.5);
  S.teil({ id: "auto", de: "das Auto", syl: "AU-to", it: "l'automobile", itSyl: "au-to-MO-bi-le", en: "car", x: ox, y: oy, kunst: k,
    tipp: "Wer in San Francisco am Hang parkt, muss die Räder zum Bordstein drehen — sonst gibt es einen Strafzettel." });
}

/* =====================================================================
   12 — DIE HALTESTELLE (Mast am Bordstein neben dem Gleis) und
   13 — DAS STRASSENSCHILD (Eckmast an der Nordostecke)
   ===================================================================== */
{
  const d = 18, X = -1.1, [px, py] = PN(X, d, zH(d)), s = F / d, h = 3.2 * s;
  const T = PN(X + 3.2 * SL * SE_, d + 3.2 * SL * SN_, zH(d + 3.2 * SL * SN_));
  let k = `<path d="M-.45 0 L${r(T[0] - px - 0.25)} ${r(T[1] - py)} L${r(T[0] - px + 0.25)} ${r(T[1] - py)} L.45 0 Z" fill="#1d2433" opacity=".3"/><rect x="-.45" y="${r(-h)}" width=".9" height="${r(h)}" fill="${S.lg("mast", [[0, "#9aa1a5"], [0.5, "#d9dee0"], [1, "#7d858a"]], 0, 0, 1, 0)}"/>`;
  const y0 = -h + 0.3 * s, w = 0.45 * s, hh = 0.6 * s;
  k += `<rect x="${r(-w / 2)}" y="${r(y0)}" width="${r(w)}" height="${r(hh)}" rx=".4" fill="#fbfaf6" stroke="#6b2a22" stroke-width=".4"/>`;
  const cy = y0 + hh * 0.36, u = w / 10;
  k += `<path d="M${r(-3.4 * u)} ${r(cy + 1.4 * u)} L${r(3.4 * u)} ${r(cy + 1.4 * u)} L${r(3.4 * u)} ${r(cy - 1.2 * u)} L${r(-3.4 * u)} ${r(cy - 1.2 * u)} Z" fill="#7d1f2c"/><path d="M${r(-3.8 * u)} ${r(cy - 1.2 * u)} L${r(3.8 * u)} ${r(cy - 1.2 * u)} L${r(3.2 * u)} ${r(cy - 2 * u)} L${r(-3.2 * u)} ${r(cy - 2 * u)} Z" fill="#6b2a22"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${r(-2.8 * u + i * 1.5 * u)}" y="${r(cy - 0.8 * u)}" width="${r(u)}" height="${r(1.1 * u)}" fill="#f1e7d0"/>`;
  k += `<text x="${r(-w * 0.42)}" y="${r(y0 + hh * 0.74)}" font-size="${r(0.085 * s)}" textLength="${r(w * 0.84)}" lengthAdjust="spacingAndGlyphs" fill="#6b2a22" font-family="Arial,sans-serif" font-weight="bold">CABLE CAR</text>`;
  k += `<text x="0" y="${r(y0 + hh * 0.92)}" font-size="${r(0.085 * s)}" text-anchor="middle" fill="#6b2a22" font-family="Arial,sans-serif" font-weight="bold">STOP</text>`;
  S.teil({ id: "haltestelle", de: "die Haltestelle", syl: "HAL-te-stel-le", it: "la fermata", itSyl: "fer-MA-ta", en: "stop", x: px, y: py, kunst: k,
    tipp: "An der Haltestelle winkt man, dann hält die Cable Car. Man darf sogar außen auf dem Trittbrett stehen." });
}
{
  const d = 10.9, X = 2.3, [px, py] = PN(X, d, 0), s = F / d, h = 3.4 * s;
  const T = PN(X + 3.4 * SL * SE_, d + 3.4 * SL * SN_, 0);
  let k = `<path d="M-.6 0 L${r(T[0] - px - 0.3)} ${r(T[1] - py)} L${r(T[0] - px + 0.3)} ${r(T[1] - py)} L.6 0 Z" fill="#1b1712" opacity=".3"/><rect x="-.6" y="${r(-h)}" width="1.2" height="${r(h)}" fill="${S.lg("mast2", [[0, "#8a9095"], [0.5, "#cfd4d6"], [1, "#6d757a"]], 0, 0, 1, 0)}"/>`;
  const bl = 0.8 * s;
  k += `<rect x="${r(-bl)}" y="${r(-h + 0.3)}" width="${r(bl * 2)}" height="${r(0.2 * s)}" rx=".4" fill="#f5f5f2" stroke="#2a2a2a" stroke-width=".25"/>`;
  k += `<text x="0" y="${r(-h + 0.3 + 0.15 * s)}" font-size="${r(0.13 * s)}" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-weight="bold">1000 LOMBARD ST</text>`;
  k += `<path d="M${r(-0.5 * s)} ${r(-h + 0.3 + 0.25 * s)} L${r(0.45 * s)} ${r(-h + 0.3 + 0.29 * s)} L${r(0.45 * s)} ${r(-h + 0.3 + 0.44 * s)} L${r(-0.5 * s)} ${r(-h + 0.3 + 0.4 * s)} Z" fill="#e8e8e4" stroke="#2a2a2a" stroke-width=".22"/>`;
  k += `<text transform="translate(${r(-0.02 * s)} ${r(-h + 0.3 + 0.385 * s)}) rotate(2.5)" font-size="${r(0.1 * s)}" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-weight="bold">HYDE ST</text>`;
  /* darunter das Einbahn-Schild in die Kehren: ONE WAY → */
  { const y0 = -h + 0.3 + 0.62 * s, w = 0.75 * s, hh = 0.25 * s; k += `<rect x="${r(-0.05 * s)}" y="${r(y0)}" width="${r(w)}" height="${r(hh)}" fill="#111"/><path d="M${r(0.02 * s)} ${r(y0 + hh * 0.5)} L${r(0.55 * s)} ${r(y0 + hh * 0.5)} M${r(0.5 * s)} ${r(y0 + hh * 0.3)} L${r(0.64 * s)} ${r(y0 + hh * 0.5)} L${r(0.5 * s)} ${r(y0 + hh * 0.7)} Z" stroke="#fff" stroke-width="${r(0.03 * s)}" fill="#fff"/><text x="${r(0.27 * s)}" y="${r(y0 + hh * 0.42)}" font-size="${r(0.075 * s)}" text-anchor="middle" fill="#111" stroke="#fff" stroke-width=".25" paint-order="stroke" font-family="Arial,sans-serif" font-weight="bold">ONE WAY</text>`; }
  S.teil({ id: "strassenschild", de: "das Straßenschild", syl: "STRA-ßen-schild", it: "il cartello stradale", itSyl: "car-TEL-lo stra-DA-le", en: "street sign", x: px, y: py, kunst: k,
    tipp: "Das Straßenschild zeigt die Kreuzung: Lombard Street und Hyde Street. Darunter: Einbahnstraße — nur bergab." });
}

/* =====================================================================
   14 — DIE CABLE CAR (Powell-Hyde), kommt auf dem Westgleis herauf;
   Wagen 8,3 × 2,4 × 3,2 m, um das Gefälle geneigt
   ===================================================================== */
{
  const CC = { X: -9.4, d: 21.4 }, g = 0.13, ca = 1 / Math.hypot(1, g), sa = g / Math.hypot(1, g);
  const W3 = (u, v, w) => { const d = CC.d + u * ca - w * sa, z = zH(CC.d) - u * sa + w * ca; return PN(CC.X + v, d, z); };
  const [ox, oy] = W3(0, 0, 0);
  const P = (u, v, w) => { const [x, y] = W3(u, v, w); return [x - ox, y - oy]; };
  const Q = (a, b, c, e, fill, ex = "") => `<path d="M${pr(P(...a))} L${pr(P(...b))} L${pr(P(...c))} L${pr(P(...e))} Z" fill="${fill}"${ex}/>`;
  const L2 = (a, b, st, w) => `<path d="M${pr(P(...a))} L${pr(P(...b))}" stroke="${st}" stroke-width="${w}" fill="none"/>`;
  const HB = 1.2, LEN = 8.3, OFF = 2.9, RF = 3.0, s = F / CC.d;
  let k = "";
  /* Schatten (Sonne SSW): nach rechts hinten */
  { const L = 3.2 * SL, du = L * SN_, dv = L * SE_, pts = [];
    for (const [u, v] of [[0, -HB], [LEN, -HB], [LEN, HB], [0, HB]]) { pts.push(P(u, v, 0)); pts.push(P(u + du, v + dv, 0)); }
    k += `<path d="M${huelle(pts).map(pr).join(" L")} Z" fill="#1d2433" opacity=".32"/>`; }
  /* Drehgestelle mit Rädern */
  /* Drehgestelle: Rahmen zwischen den Rädern, Räder genau auf der östlichen Schiene (v = 0,53) */
  for (const u of [1.4, 6.8]) { k += Q([u - 0.75, 0.62, 0.12], [u + 0.75, 0.62, 0.12], [u + 0.75, 0.62, 0.4], [u - 0.75, 0.62, 0.4], "#34302c"); for (const du of [-0.5, 0.5]) { const c = P(u + du, 0.66, 0.3); k += `<ellipse cx="${r(c[0])}" cy="${r(c[1])}" rx="${r(0.1 * s)}" ry="${r(0.3 * s)}" fill="#151515"/><ellipse cx="${r(c[0])}" cy="${r(c[1])}" rx="${r(0.04 * s)}" ry="${r(0.12 * s)}" fill="#6a645c"/>`; } }
  /* offener Teil: Boden, Bänke nach außen (beide Seiten), Pfosten */
  k += Q([-0.05, -HB, 0.42], [LEN, -HB, 0.42], [LEN, -HB, 0.95], [-0.05, -HB, 0.95], "#5e1622");
  k += Q([0.1, -HB + 0.1, 0.95], [0.1, HB - 0.1, 0.95], [OFF, HB - 0.1, 0.95], [OFF, -HB + 0.1, 0.95], "#8a6a48");
  k += Q([0.2, -0.3, 0.95], [0.2, 0.3, 0.95], [OFF - 0.1, 0.3, 0.95], [OFF - 0.1, -0.3, 0.95], "#6a4428");
  k += Q([0.2, -0.25, 1.4], [0.2, 0.25, 1.4], [OFF - 0.1, 0.25, 1.4], [OFF - 0.1, -0.25, 1.4], "#7a5032");
  for (const v of [-HB, HB]) for (const u of [0.05, 1, 1.95, OFF - 0.05]) k += L2([u, v, 0.95], [u, v, RF], "#d8ccb0", 0.4);
  /* Stirnwand der Kabine im offenen Teil, mit Fenster */
  k += Q([OFF - 0.05, -0.95, 0.95], [OFF - 0.05, 0.95, 0.95], [OFF - 0.05, 0.95, 2.6], [OFF - 0.05, -0.95, 2.6], "#7a3a34");
  k += Q([OFF - 0.06, -0.75, 1.5], [OFF - 0.06, 0.75, 1.5], [OFF - 0.06, 0.75, 2.4], [OFF - 0.06, -0.75, 2.4], "#3a4652");
  /* der Gripman (Fahrer) am Greifhebel, Mitte des offenen Teils */
  {
    const [gx, gy] = P(1.3, 0, 0.95);
    const m = B.mensch({ id: "sfo_grip", geschlecht: "m", pose: "halten", blick: 12, frisur: "kurz", haarfarbe: "grau", haut: "hell",
      kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "weste", farbe: "#2b3a55" }, unterteil: { stueck: "anzughose", farbe: "#2b3a55" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, kopf: { stueck: "kappe", farbe: "#2b3a55" } } }, 1.76 * s);
    k += `<g transform="translate(${r(gx)} ${r(gy)})">${figur(grob(flach(m.svg)), 2, 8)}</g>`;
    k += L2([0.7, -0.1, 0.95], [0.85, -0.15, 1.95], "#2c2c2c", 0.45);
  }
  /* rechte (östliche, uns zugewandte) Seite: Schürze, Trittbrett, Kabine */
  k += Q([-0.05, HB, 0.42], [LEN, HB, 0.42], [LEN, HB, 0.95], [-0.05, HB, 0.95], WEINROT);
  k += L2([-0.05, HB, 0.62], [LEN, HB, 0.62], GOLDS, 0.22);
  k += Q([0.1, HB, 0.42], [OFF, HB, 0.42], [OFF, HB + 0.35, 0.42], [0.1, HB + 0.35, 0.42], "#4a3a2a");
  k += Q([0.2, HB, 0.95], [OFF - 0.1, HB, 0.95], [OFF - 0.1, HB, 1.35], [0.2, HB, 1.35], "#7a5032");
  k += Q([OFF, HB, 0.95], [LEN - 0.6, HB, 0.95], [LEN - 0.6, HB, 1.6], [OFF, HB, 1.6], WEINROT);
  k += Q([OFF, HB, 1.6], [LEN - 0.6, HB, 1.6], [LEN - 0.6, HB, 2.55], [OFF, HB, 2.55], CREME);
  for (let i = 0; i < 5; i++) { const v0 = OFF + 0.15 + i * 0.97; k += Q([v0, HB + 0.01, 1.7], [v0 + 0.78, HB + 0.01, 1.7], [v0 + 0.78, HB + 0.01, 2.45], [v0, HB + 0.01, 2.45], "#3e4d5c"); if (i % 2 === 0 || i === 3) { const hd = P(v0 + 0.4, HB - 0.25, 2.12), sch2 = P(v0 + 0.4, HB - 0.25, 1.72); k += `<path d="M${r(sch2[0] - 0.24 * s)} ${r(sch2[1] + 0.1 * s)} Q${r(sch2[0] - 0.22 * s)} ${r(sch2[1] - 0.16 * s)} ${r(sch2[0])} ${r(sch2[1] - 0.16 * s)} Q${r(sch2[0] + 0.22 * s)} ${r(sch2[1] - 0.16 * s)} ${r(sch2[0] + 0.24 * s)} ${r(sch2[1] + 0.1 * s)} Z" fill="#232b33" opacity=".75"/><ellipse cx="${r(hd[0])}" cy="${r(hd[1])}" rx="${r(0.1 * s)}" ry="${r(0.13 * s)}" fill="#232b33" opacity=".8"/>`; } }
  k += Q([OFF - 0.2, HB, 2.55], [LEN, HB, 2.55], [LEN, HB, RF], [OFF - 0.2, HB, RF], HBLAU);
  {
    const a1 = P(3.4, HB + 0.02, 2.62), a2 = P(7.4, HB + 0.02, 2.62), win = Math.atan2(a2[1] - a1[1], a2[0] - a1[0]) * 180 / Math.PI, len = Math.hypot(a2[0] - a1[0], a2[1] - a1[1]);
    k += `<text transform="translate(${r(a1[0])} ${r(a1[1] + 0.3)}) rotate(${r(win)})" font-size="${r(0.32 * s)}" textLength="${r(len)}" lengthAdjust="spacingAndGlyphs" fill="#7d1f2c" font-family="Georgia,serif" font-weight="bold">POWELL &amp; HYDE STS.</text>`;
  }
  /* Front (uns zugewandt): Stirnblech, Laterne, Nummer */
  k += Q([0, -HB, 0.42], [0, HB, 0.42], [0, HB, 1.75], [0, -HB, 1.75], S.lg("front", [[0, "#b23a46"], [1, "#7d1f2c"]]));
  k += L2([0, -HB, 1.67], [0, HB, 1.67], GOLDS, 0.28) + L2([0, -HB, 0.6], [0, HB, 0.6], GOLDS, 0.2);
  { const n = P(0, 0.55, 0.85); k += `<text x="${r(n[0])}" y="${r(n[1])}" font-size="${r(0.42 * s)}" text-anchor="middle" fill="${GOLDS}" font-family="Georgia,serif" font-weight="bold">12</text>`; const l = P(0, -0.45, 1.05); k += `<circle cx="${r(l[0])}" cy="${r(l[1])}" r="${r(0.2 * s)}" fill="${S.rg("lampe", [[0, "#fffbe6"], [0.6, "#ffe9a6"], [1, "#c99a3a"]])}" stroke="#2c2c2c" stroke-width=".25"/>`; }
  for (const v of [-HB + 0.05, HB - 0.05]) k += L2([0, v, 1.75], [0, v, RF], CREME, 0.55);
  /* senkrechte Haltestange am Trittbrett, an der sich die Fahrgästin festhält */
  k += L2([1.42, HB + 0.04, 0.95], [1.42, HB + 0.04, RF], "#e9dfc4", 0.32);
  /* der Fahrgast auf dem Trittbrett, hält sich an der Stange */
  let fg;
  {
    const [fx, fy] = P(1.0, HB + 0.25, 0.42);
    const m = B.mensch({ id: "sfo_fahrgast", geschlecht: "w", pose: "halten", blick: 70, frisur: "lang", haarfarbe: "dunkelbraun", haut: "mittel",
      kleidung: { oberteil: { stueck: "pullover", farbe: "#e2b13c" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh", farbe: "weiss" } } }, 1.66 * s);
    k += `<g transform="translate(${r(fx)} ${r(fy)})">${figur(grob(flach(m.svg)), 2, 8)}</g>`;
    fg = [fx + ox, fy + oy, 1.66 * s];
  }
  /* Dach mit Laternendach (Oberlicht) — nicht breiter als der Wagenkasten */
  k += Q([-0.1, -HB, RF], [-0.1, HB, RF], [LEN, HB, RF], [LEN, -HB, RF], S.lg("dach", [[0, "#efe9dc"], [1, "#cfc6b4"]], 0, 0, 1, 0));
  k += Q([0.4, -0.55, RF + 0.28], [0.4, 0.55, RF + 0.28], [LEN - 0.3, 0.55, RF + 0.28], [LEN - 0.3, -0.55, RF + 0.28], "#ddd5c4");
  k += Q([0.4, 0.55, RF], [LEN - 0.3, 0.55, RF], [LEN - 0.3, 0.55, RF + 0.28], [0.4, 0.55, RF + 0.28], "#b9b0a0");
  for (let u = 1; u < LEN - 0.5; u += 0.7) k += Q([u, 0.56, RF + 0.06], [u + 0.4, 0.56, RF + 0.06], [u + 0.4, 0.56, RF + 0.22], [u, 0.56, RF + 0.22], "#4e5d6a");
  k += L2([-0.1, -HB, RF], [-0.1, HB, RF], "#7d1f2c", 0.45);
  k += Q([-0.05, -0.75, RF + 0.05], [-0.05, 0.75, RF + 0.05], [-0.05, 0.75, RF + 0.45], [-0.05, -0.75, RF + 0.45], "#22344f");
  { const a = P(-0.06, -0.68, RF + 0.13), b = P(-0.06, 0.68, RF + 0.13); k += `<text x="${r(a[0])}" y="${r(a[1])}" font-size="${r(0.28 * s)}" textLength="${r(b[0] - a[0])}" lengthAdjust="spacingAndGlyphs" fill="#f6efd8" font-family="Arial,sans-serif" font-weight="bold">POWELL &amp; HYDE</text>`; }
  /* die Glocke auf dem Dach (Messing) */
  const gl = P(1.6, 0.3, RF + 0.28);
  { const [x0, y0] = gl, q = 0.1 * s; /* Messingglocke: Krone, Flanke, ausgestellter Rand, Klöppel */
    k += `<rect x="${r(x0 - 0.25 * q)}" y="${r(y0 - 3.3 * q)}" width="${r(0.5 * q)}" height="${r(0.5 * q)}" fill="#7a5a1a"/>`;
    k += `<path d="M${r(x0 - 1.6 * q)} ${r(y0)} Q${r(x0 - 1.15 * q)} ${r(y0 - 0.5 * q)} ${r(x0 - 1 * q)} ${r(y0 - 1.6 * q)} Q${r(x0 - 0.95 * q)} ${r(y0 - 2.9 * q)} ${r(x0)} ${r(y0 - 2.9 * q)} Q${r(x0 + 0.95 * q)} ${r(y0 - 2.9 * q)} ${r(x0 + 1 * q)} ${r(y0 - 1.6 * q)} Q${r(x0 + 1.15 * q)} ${r(y0 - 0.5 * q)} ${r(x0 + 1.6 * q)} ${r(y0)} Z" fill="${S.lg("glocke", [[0, "#fff1a6"], [0.45, "#d9a93a"], [1, "#7a5410"]], 0, 0, 1, 0)}"/>`;
    k += `<ellipse cx="${r(x0)}" cy="${r(y0)}" rx="${r(1.6 * q)}" ry="${r(0.35 * q)}" fill="#6a4a10"/><circle cx="${r(x0)}" cy="${r(y0 + 0.15 * q)}" r="${r(0.3 * q)}" fill="#4a3410"/>`; }
  const tb = P(2.3, HB + 0.18, 0.42);
  S.teil({ id: "cable_car", de: "die Cable Car", syl: "CA-ble CAR", it: "il cable car", itSyl: "CA-ble CAR", en: "cable car", x: ox, y: oy, kunst: k,
    tipp: "Die Cable Car fährt seit 1873. Ein Stahlseil unter der Straße zieht sie mit 15 km/h den Berg hinauf.",
    zoom: { x: r(ox - 22), y: r(oy - 54), w: 87, h: 58 },
    unter: [
      { id: "glocke", de: "die Glocke", syl: "GLO-cke", it: "la campana", itSyl: "cam-PA-na", en: "bell", x: ox + gl[0], y: oy + gl[1], kunst: flaeche(-2.2, -3.4, 4.4, 3.8, 0.4),
        tipp: "Mit der Glocke warnt der Fahrer (der Gripman). Jedes Jahr gibt es einen Wettbewerb im Glockenläuten." },
      { id: "trittbrett", de: "das Trittbrett", syl: "TRITT-brett", it: "il predellino", itSyl: "pre-del-LI-no", en: "running board", x: ox + tb[0], y: oy + tb[1], kunst: flaeche(-5, -1.2, 10, 2.6, 0.4),
        tipp: "Auf dem Trittbrett darf man außen mitfahren und sich an der Stange festhalten." },
      { id: "fahrgast", de: "der Fahrgast", syl: "FAHR-gast", it: "il passeggero", itSyl: "pas-seg-GE-ro", en: "passenger", x: fg[0], y: fg[1], kunst: flaeche(-3, -fg[2] * 0.95, 6, fg[2] * 0.55, 0.4),
        tipp: "Die Fahrgäste lieben den Blick von außen — besonders bergab zur Bucht." },
      { id: "schiene", de: "die Schiene", syl: "SCHIE-ne", it: "la rotaia", itSyl: "ro-TA-ia", en: "rail", x: PN(-8.87, 20.4, zH(20.4))[0], y: PN(-8.87, 20.4, zH(20.4))[1], kunst: flaeche(-7, -1.2, 14, 2.4, 0.4),
        tipp: "Zwischen den Schienen ist ein Schlitz. Darunter läuft das Seil, das die Cable Car zieht." },
    ] });
}

/* =====================================================================
   15 — DIE TOURISTIN fotografiert den Blick die Hyde Street hinunter auf
   Alcatraz; 16 — DAS SAUERTEIGBROT: Brotschale mit Clam Chowder (Boudin)
   auf der Gartenmauer neben ihr, daneben eine Ghirardelli-Tüte
   ===================================================================== */
{
  const d = 10.9, X = 0.5, [tx, ty] = PN(X, d, 0), s = F / d;
  const foto = {
    lende: 1, brust: -3, nacken: 2, kopf: -2,
    schulterL: { vor: 62, seit: 18 }, ellbogenL: 112, unterarmL: 40, handL: 10, fingerL: 0.5,
    schulterR: { vor: 60, seit: 20 }, ellbogenR: 114, unterarmR: 40, handR: 10, fingerR: 0.5,
    huefteL: { vor: 4, seit: 3, dreh: -6 }, knieL: 4, fussL: 0, huefteR: { vor: -4, seit: 3, dreh: -6 }, knieR: 2, fussR: 0,
  };
  const m = B.mensch({ id: "sfo_tour", geschlecht: "w", pose: foto, blick: 192, frisur: "zopf", haarfarbe: "braun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "creme" }, jacke: { stueck: "jacke", farbe: "#c0392b" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh", farbe: "weiss" } } }, 1.66 * s);
  const hs = [m.z.handL, m.z.handR].filter(Boolean), hx = hs.reduce((a, h) => a + h.x, 0) / hs.length * m.k, hy = Math.min(...hs.map((h) => h.y)) * m.k;
  const pw = 0.075 * s, ph = 0.15 * s;
  let handy = `<rect x="${r(hx - pw / 2)}" y="${r(hy - ph * 0.8)}" width="${r(pw)}" height="${r(ph)}" rx=".2" fill="#1c1e22"/>`;
  /* scharfer Schatten nach rechts hinten (Länge 0,9 × Körpergröße) */
  const L = 1.66 * SL, T = PN(X + L * SE_, d + L * SN_, 0), A = PN(X - 0.2, d, 0), Bp = PN(X + 0.2, d, 0);
  const sch = `<path d="M${pr([A[0] - tx, A[1] - ty])} L${pr([T[0] - tx - 1.2, T[1] - ty])} L${pr([T[0] - tx + 1.2, T[1] - ty])} L${pr([Bp[0] - tx, Bp[1] - ty])} Z" fill="#1d2433" opacity=".3"/>`;
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x: tx, y: ty, kunst: sch + figur(grob(m.svg, 0.8), 1.0, 3.5) + handy,
    tipp: "Die Touristin fotografiert den Blick die Hyde Street hinunter auf die Bucht und Alcatraz." });
  /* Brotschale mit Clam Chowder auf der Gartenmauer (Mauerkrone bei X 2,25–2,75, 0,62 m hoch) */
  const db = 13, [bx, by] = PN(2.5, db, zH(db) + 0.62), sb = F / db, bw = 0.24 * sb;
  let k = `<ellipse cx="0" cy="0" rx="${r(bw * 0.62)}" ry="${r(bw * 0.14)}" fill="#1b120a" opacity=".3"/>`;
  k += `<path d="M${r(-bw / 2)} ${r(-bw * 0.05)} Q${r(-bw / 2)} ${r(-bw * 0.62)} 0 ${r(-bw * 0.62)} Q${r(bw / 2)} ${r(-bw * 0.62)} ${r(bw / 2)} ${r(-bw * 0.05)} Q0 ${r(bw * 0.08)} ${r(-bw / 2)} ${r(-bw * 0.05)} Z" fill="${S.rg("brot", [[0, "#f0cf98"], [0.7, "#c9934e"], [1, "#9a6630"]], 0.35, 0.3, 0.8)}"/>`;
  k += `<ellipse cx="0" cy="${r(-bw * 0.5)}" rx="${r(bw * 0.38)}" ry="${r(bw * 0.12)}" fill="#f3ecd9"/><ellipse cx="${r(-bw * 0.08)}" cy="${r(-bw * 0.52)}" rx="${r(bw * 0.12)}" ry="${r(bw * 0.04)}" fill="#e8d9a8"/>`;
  k += `<path d="M${r(bw * 0.1)} ${r(-bw * 0.52)} L${r(bw * 0.42)} ${r(-bw * 0.95)}" stroke="#b9bcc0" stroke-width="${r(bw * 0.05)}" stroke-linecap="round"/>`;
  k += `<path d="M${r(-bw * 0.2)} ${r(-bw * 0.7)} q${r(bw * 0.1)} ${r(-bw * 0.2)} 0 ${r(-bw * 0.4)} M${r(bw * 0.05)} ${r(-bw * 0.72)} q${r(bw * 0.1)} ${r(-bw * 0.2)} 0 ${r(-bw * 0.4)}" stroke="#fff" stroke-width="${r(bw * 0.04)}" fill="none" opacity=".7"/>`;
  /* daneben die braune Ghirardelli-Tüte (Schokolade vom Ghirardelli Square) */
  const [gx, gy] = PN(2.5, 14.6, zH(14.6) + 0.62), sg = F / 14.6, gw = 0.22 * sg, gh = 0.28 * sg;
  k += `<g transform="translate(${r(gx - bx)} ${r(gy - by)})"><path d="M${r(-gw / 2)} 0 L${r(gw / 2)} 0 L${r(gw * 0.47)} ${r(-gh)} L${r(-gw * 0.47)} ${r(-gh)} Z" fill="#5b3a26"/><rect x="${r(-gw * 0.42)}" y="${r(-gh * 0.62)}" width="${r(gw * 0.84)}" height="${r(gh * 0.22)}" fill="#e9dcc0"/><text x="0" y="${r(-gh * 0.46)}" font-size="${r(gw * 0.13)}" text-anchor="middle" fill="#5b3a26" font-family="Georgia,serif" font-weight="bold">GHIRARDELLI</text></g>`;
  S.teil({ oben: true, id: "sauerteigbrot", de: "das Sauerteigbrot", syl: "SAU-er-teig-brot", it: "il pane a lievitazione naturale", itSyl: "PA-ne a lie-vi-ta-ZIO-ne na-tu-RA-le", en: "sourdough bread", x: bx, y: by,
    kunst: k + flaeche(-bw * 0.7, -bw * 1.1, bw * 1.4, bw * 1.25, 0.4),
    tipp: "Das Sauerteigbrot ist eine Spezialität von San Francisco. Ausgehöhlt isst man daraus Muschelsuppe (Clam Chowder)." });
}
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/san_francisco.js"));
console.log(aus);
