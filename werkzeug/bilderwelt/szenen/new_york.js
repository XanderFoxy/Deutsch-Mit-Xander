#!/usr/bin/env node
/* =====================================================================
   NEW YORK (FASSUNG 854, Runde 2) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (NPS „Statue of Liberty – Statistics“, Brooklyn Bridge Park,
   NYC DOT „Brooklyn Bridge“ / „Manhattan Bridge“, SOM „One World Trade
   Center“, ESB- und Chrysler-Baudaten, NYC TLC; Koordinaten nach Karte,
   auf etwa 50 m genau — unsicher markiert mit „(?)“):
   - STANDORT: Brooklyn Bridge Park, Pier 1, oben auf den Granitstufen
     („Granite Prospect“), 40,7020° N / 73,9963° W; Augenhöhe 7,5 m über
     dem Wasser (5 m über der Promenade). ECHTE KAMERA: jedes Wahrzeichen
     steht in seiner echten Richtung (Peilung) und Entfernung, Höhen und
     Breiten im echten Maßstab (330 Einheiten je Bogenmaß, also
     Höhe[px] = 330 · Höhe[m] / Entfernung[m]). Nur die Richtungen sind
     gestaucht (≈ 200° Rundblick auf 400 Einheiten, im Hochhausviertel
     am wenigsten), damit Freiheitsstatue und Midtown ins Bild passen.
     Peilungen/Entfernungen: Governors Island 231–244° (2,0–2,9 km),
     Freiheitsstatue 251° (4,3 km), Heliport Pier 6 265°, 1 New York
     Plaza 269°, 40 Wall 297° (1,2 km), 70 Pine 297° (1,07 km), One WTC
     310° (1,87 km), Pier 17 313° (0,62 km), Woolworth 319°, 8 Spruce
     321°, Municipal Building 332°, Manhattan-Pfeiler der Brooklyn Bridge
     333° (0,58 km), Empire State Building 10° (5,2 km), Chrysler Building
     18° (5,8 km), Manhattan-Pfeiler der Manhattan Bridge ≈ 20° (1,0 km)(?),
     Brooklyn-Pfeiler der Brooklyn Bridge 30° (0,28 km).
   - FREIHEITSSTATUE: 93 m, also nur ≈ 7 Einheiten hoch (Details in der
     Lupe). Figur 46 m : Sockel 27 m : Fundament im Sternfort 20 m; das
     Fort Wood hat 11 Zacken. Rechter Arm mit vergoldeter Flamme, links die
     Tafel „JULY IV MDCCLXXVI“, Krone mit 7 Strahlen und 25 Fenstern; sie
     blickt nach Südosten. Im Dunst blasser als alles Nähere.
   - BROOKLYN BRIDGE (1883): Achse 304° (Brooklyn → Manhattan), Hauptfeld
     486 m, Seitenfelder je 286 m; Pfeiler 84 m, Breitseite 43 m (quer zur
     Brücke, mit zwei Spitzbögen für die Fahrbahn), Schmalseite 18 m;
     Fahrbahn 36 m (an den Pfeilern) bis 41 m (Mitte); vier Tragkabel über
     Sättel auf den Pfeilern, Durchhang 39 m; senkrechte Hänger und die
     typischen Schrägseile. Vom Pier 1 sieht man den Manhattan-Pfeiler
     schräg mit den Bögen, den nahen Brooklyn-Pfeiler fast genau von der
     Schmalseite (Bögen nicht zu sehen), rechts der helle Rand der
     sonnigen Breitseite.
   - MANHATTAN BRIDGE (1909): stählerne Pfeiler 102 m, blaugrau, oben mit
     Zierbogen; steht von hier „hinter“ der Brooklyn Bridge.
   - ONE WTC 541 m (Dach 417 m, Antenne 124 m); 3 und 4 WTC, 28 Liberty,
     130 William, 60 Wall, 20 Exchange Place, 40 Wall (grüne Pyramide),
     70 Pine (Art déco, Spitze), Woolworth (Neugotik), 8 Spruce (gewellt),
     Municipal Building (goldene „Civic Fame“), 1 New York Plaza (dunkel).
     Am Ufer: FDR Drive (aufgeständert), Pier 17 (Glasbau mit Dach-
     terrasse), der Großsegler Wavertree am Seaport, Heliport an Pier 6.
   - EMPIRE STATE BUILDING 443 m (≈ 28 Einheiten), CHRYSLER BUILDING 319 m
     (≈ 18 Einheiten): weit hinten im Dunst; die unteren 200 m verdecken
     die Häuser der Lower East Side.
   - VORNE: Promenade mit Geländer (Holzhandlauf), Imbisswagen mit blau-
     gelbem Schirm (Hotdog, Brezeln, Getränkedosen), Bank aus Holzbohlen
     mit Bagel und dem blau-weißen Anthora-Becher, Jogger, Touristin mit
     Handy, Yellow Cab (Toyota Camry, 4,9 m, Lizenznummer am Dach) auf
     dem Kopfsteinpflaster der Uferstraße. Rechts hinten die Backstein-
     häuser von Fulton Ferry/DUMBO mit Feuertreppe und hölzernem Wasser-
     tank (etwas ins Bild gerückt; die echten stehen ≈ 65–72°).
   Licht: Vormittag im Oktober, Sonne im Südosten (≈ 135°, 35° hoch), fast
   genau hinter uns: Schatten fallen nach vorn (Nordwesten), leicht links.
   Vorne gilt: Einheiten je Meter = (y − 150) / 5.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "new_york", titel: "New York", emoji: "🗽", thema: "Länder", kuerzel: "nyc", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1886);
const r = B.r;
const pr = (p) => `${r(p[0])} ${r(p[1])}`;

/* ---------- DIE KAMERA ------------------------------------------------ */
const HOR = 150, K = 330, EYE = 7.5;
const GP = [40.7020, -73.9963];
const COSL = Math.cos(GP[0] * Math.PI / 180);
const enu = (lat, lon) => [(lon - GP[1]) * 111320 * COSL, (lat - GP[0]) * 111132];
const peil = (e, n) => { let b = Math.atan2(e, n) * 180 / Math.PI; if (b < 180) b += 360; return b; };
const ANKER = [[228, 0], [250.8, 36], [266, 62], [296, 128], [333.4, 226], [390.4, 334], [425, 400]];
const XM = (b) => { for (let i = 1; i < ANKER.length; i++) if (b <= ANKER[i][0] || i === ANKER.length - 1) { const [b0, x0] = ANKER[i - 1], [b1, x1] = ANKER[i]; return x0 + (x1 - x0) * (b - b0) / (b1 - b0); } return 0; };
/* weit: Richtung gestaucht, Höhe echt */
const PJ = (e, n, z) => { const d = Math.hypot(e, n); return [XM(peil(e, n)), HOR + K * (EYE - z) / d]; };
/* nah um einen Ankerpunkt: echter Maßstab in alle Richtungen */
const lokal = (e0, n0) => {
  const d0 = Math.hypot(e0, n0), b0 = peil(e0, n0), x0 = XM(b0), a = b0 * Math.PI / 180;
  const vor = [Math.sin(a), Math.cos(a)], re = [Math.cos(a), -Math.sin(a)];
  return { d: d0, x: x0, b: b0, vor, re, p: (de, dn, z) => { const lat = de * re[0] + dn * re[1], dep = d0 + de * vor[0] + dn * vor[1]; return [x0 + K * lat / dep, HOR + K * (EYE - z) / dep]; } };
};
const polar = (b, d) => [d * Math.sin(b * Math.PI / 180), d * Math.cos(b * Math.PI / 180)];
/* Vordergrund (Promenade): eigene Lochkamera, Fluchtpunkt 200/150, Auge 5 m */
const VX = 200, EF = 5;
const NP = (X, Z, Y = 0) => [VX + K * X / Z, HOR + K * (EF - Y) / Z];
const um = (y) => (y - HOR) / EF;
/* Schlagschatten am Boden: Sonne 135°, 35° hoch → Schatten nach vorn, etwas links */
const SCH = { dx: -Math.sin(8 * Math.PI / 180) / Math.tan(35 * Math.PI / 180), dz: Math.cos(8 * Math.PI / 180) / Math.tan(35 * Math.PI / 180) };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1 0.35"/></filter>`);
S.def(`<filter id="${S.id("weich3")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".5"/></filter>`);
/* Luftperspektive: Farben zum Dunst hin (#bfcdd8) ziehen — je ferner, desto stärker */
const DUNST = [0.55, 0.38, 0.22];
const f3 = (v) => v.toFixed(3);
DUNST.forEach((a, i) => S.def(`<filter id="${S.id("fern" + i)}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${f3(1 - a)} 0 0 0 ${f3(a * 0.76)} 0 ${f3(1 - a)} 0 0 ${f3(a * 0.8)} 0 0 ${f3(1 - a)} 0 ${f3(a * 0.84)} 0 0 0 1 0"/></filter>`));
/* Menschen: Pfadkoordinaten (in cm) auf ganze Zahlen — bei 30 Einheiten Größe unsichtbar, spart ein Drittel der Datei */
const knapp = (svg) => svg.replace(/ d="([^"]*)"/g, (m0, d) => ` d="${d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);
const fern = (i) => `filter="url(#${S.id("fern" + i)})"`;
/* Fenster-Raster: eine Zeile ≈ ein Stockwerk bei 1–1,5 km */
S.def(`<pattern id="${S.id("glasr")}" width="1" height="1.05" patternUnits="userSpaceOnUse"><rect y=".8" width="1" height=".25" fill="#1d2a36" opacity=".32"/><rect x=".82" width=".18" height="1.05" fill="#fff" opacity=".14"/></pattern>`);
S.def(`<pattern id="${S.id("steinr")}" width="1.1" height="1.05" patternUnits="userSpaceOnUse"><rect x=".3" y=".25" width=".5" height=".55" fill="#2c3540" opacity=".5"/></pattern>`);
S.def(`<pattern id="${S.id("steinv")}" width=".9" height="1.4" patternUnits="userSpaceOnUse"><rect x=".25" width=".42" height="1.4" fill="#2c3540" opacity=".42"/></pattern>`);
S.def(`<pattern id="${S.id("ziegel")}" width="2" height="1" patternUnits="userSpaceOnUse"><path d="M0 .95 H2 M1 0 V.5 M0 .5 H2 M0 .5 V1" stroke="#5e2a1c" stroke-width=".1" opacity=".5"/></pattern>`);
S.def(`<pattern id="${S.id("pflaster")}" width="3.2" height="1.6" patternUnits="userSpaceOnUse"><path d="M0 1.55 H3.2 M1.6 0 V.8 M0 .78 H3.2 M0 .8 V1.6 M3.2 .8 V1.6" stroke="#3e3a36" stroke-width=".22" opacity=".65"/></pattern>`);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#aab2b9"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff4b0"], [0.4, "#f2c443"], [1, "#b77f12"]], 0, 0, 1, 1);
const EISEN = S.lg("eisen", [[0, "#3a3f3c"], [0.45, "#5a605c"], [1, "#222624"]], 0, 0, 1, 0);
const TAXIGELB = S.lg("taxigelb", [[0, "#ffe27a"], [0.35, "#f9c623"], [1, "#d39a07"]]);
const LICHT = S.lg("hlicht", [[0, "#fff", 0.14], [0.55, "#fff", 0], [1, "#000", 0.2]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Himmel, Wolken, New Jersey, Jersey City, Governors Island,
   die Promenade und rechts vorn das Kopfsteinpflaster
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 3}" fill="${S.lg("himmel", [[0, "#3f78bd"], [0.5, "#7fabd8"], [0.86, "#c5d9e8"], [1, "#e4ebee"]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[64, 34, 1.1], [176, 16, 0.8], [262, 44, 0.9], [352, 22, 1.2], [118, 70, 0.55], [380, 76, 0.6], [222, 84, 0.45]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".93">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 17, 5.4], [-11, 1.6, 11, 4.2], [12, 1.2, 13, 4.6], [-3, -4, 10, 5.4], [7, -4.4, 8, 4.8]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `<ellipse cx="${x}" cy="${r(y + 3.4 * s)}" rx="${r(19 * s)}" ry="${r(2.3 * s)}" fill="#d0dbe7"/></g>`;
  }
  S.hinten(w);
}
/* New Jersey (Bayonne, 6–9 km) flach im Dunst; Jersey City hinter Lower Manhattan (3,5–4 km) */
{
  let c = `<path d="M0 150.4 L0 148.8 Q30 148.2 60 148.7 L118 148.9 L118 150.5 Z" fill="#aebcc3"/>`;
  for (const [b, d, h, w] of [[285, 3700, 150, 40], [288, 3800, 200, 35], [291, 3760, 181, 40], [294.9, 3777, 270, 45], [296.5, 3720, 238, 40], [299, 3900, 160, 50], [301, 4000, 140, 40], [304, 4100, 120, 60]]) {
    const x = XM(b), hp = K * h / d, wp = K * w / d, yb = HOR + K * EYE / d;
    c += `<rect x="${r(x - wp / 2)}" y="${r(yb - hp)}" width="${r(wp)}" height="${r(hp)}" fill="${S.lg("jc", [[0, "#c2ced7"], [1, "#adbcc8"]])}"/>`;
  }
  S.hinten(c);
}
/* Governors Island: flach, grün, Castle Williams (rund, Sandstein) an der Nordwestspitze */
{
  let c = "";
  const pts = [];
  for (let b = 229; b <= 243.4; b += 0.8) { const d = 2905 - (b - 229) / 14.4 * 880, [e, n] = polar(b, d); pts.push(PJ(e, n, b < 242.4 ? 9 : 4)); }
  const base = (b, d) => { const [e, n] = polar(b, d); return PJ(e, n, 1); };
  c += `<path d="M${pr(base(229, 2905))} ${pts.map((p) => `L${pr(p)}`).join(" ")} L${pr(base(243.4, 2025))} Z" fill="${S.lg("gov", [[0, "#7f9a64"], [1, "#5c7448"]])}" ${fern(1)}/>`;
  /* Bäume (Nolan Park, Fort Jay) und gelbe Backsteinhäuser */
  { let t = ""; for (let b = 229.6; b < 242.6; b += 0.55) { const d = 2905 - (b - 229) / 14.4 * 880, [e, n] = polar(b, d), q = PJ(e, n, 9 + 6 + rnd() * 5), rr = K * (6 + rnd() * 4) / d; t += `<circle cx="${r(q[0])}" cy="${r(q[1] + rr * 0.6)}" r="${r(rr)}" fill="${rnd() < 0.5 ? "#5c7a48" : "#6d8a55"}"/>`; if (rnd() < 0.25) { const h = PJ(e, n, 9 + 12); t += `<rect x="${r(h[0] - 0.8)}" y="${r(h[1])}" width="1.6" height="${r(K * 12 / d)}" fill="#d9c08a"/>`; } } c += `<g ${fern(1)}>${t}</g>`; }
  /* Castle Williams: runde Sandsteinfestung (Durchmesser 64 m, 12 m hoch) an der Nordwestspitze */
  const [ce, cn] = polar(244.2, 2174), cw = PJ(ce, cn, 12 + 3), cb = PJ(ce, cn, 3), hw = K * 32 / 2174;
  c += `<g ${fern(1)}><path d="M${r(cw[0] - hw)} ${r(cb[1])} L${r(cw[0] - hw)} ${r(cw[1])} Q${r(cw[0])} ${r(cw[1] - 0.9)} ${r(cw[0] + hw)} ${r(cw[1])} L${r(cw[0] + hw)} ${r(cb[1])} Q${r(cw[0])} ${r(cb[1] + 0.8)} ${r(cw[0] - hw)} ${r(cb[1])} Z" fill="#c09474"/>`;
  for (let i = -3; i <= 3; i++) c += `<rect x="${r(cw[0] + i * hw / 3.6 - 0.2)}" y="${r((cw[1] + cb[1]) / 2 - 0.3)}" width=".4" height=".6" fill="#5a3f30"/>`;
  c += `</g>`;
  S.hinten(c);
}
/* Die Promenade (Granitplatten in Flucht) und rechts vorn das Kopfsteinpflaster */
{
  const Y0 = 200;
  let f = `<rect x="0" y="${Y0}" width="400" height="${260 - Y0}" fill="${S.lg("promenade", [[0, "#bbb4a8"], [1, "#9e978c"]])}"/>`;
  for (let i = -22; i <= 22; i++) f += `<line x1="${r(VX + i * 11)}" y1="${Y0}" x2="${r(VX + i * 26.4)}" y2="260" stroke="#7f786d" stroke-width=".35" opacity=".55"/>`;
  for (const y of [203, 207, 212, 218, 226, 235, 246, 259]) f += `<line x1="0" y1="${y}" x2="400" y2="${y}" stroke="#7f786d" stroke-width=".35" opacity=".5"/>`;
  for (let i = 0; i < 150; i++) f += `<circle cx="${r(rnd() * 400)}" cy="${r(Y0 + 2 + rnd() * 58)}" r="${r(0.15 + rnd() * 0.3)}" fill="${rnd() < 0.5 ? "#ddd7cc" : "#7a7368"}" opacity=".5"/>`;
  /* Uferstraße rechts vorn (Belgian Blocks) mit Bordstein */
  f += `<path d="M268 260 Q290 232 352 226 L400 225 L400 260 Z" fill="${S.lg("pfl", [[0, "#7c756d"], [1, "#5d5751"]])}"/>`;
  f += `<path d="M268 260 Q290 232 352 226 L400 225 L400 260 Z" fill="url(#${S.id("pflaster")})"/>`;
  f += `<path d="M264 260 Q287 229.6 352 223.6 L400 222.6" stroke="${S.lg("bord", [[0, "#dcd6cb"], [1, "#a39c90"]])}" stroke-width="2.4" fill="none"/>`;
  f += `<rect x="0" y="${Y0}" width="400" height="60" fill="${S.lg("prolicht", [[0, "#fff", 0.08], [0.6, "#fff", 0], [1, "#000", 0.08]], 0, 0, 1, 0)}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DER EAST RIVER (vorn der Fluss, links der Hafen) mit Spiegelungen
   ===================================================================== */
const BBB = enu(40.70420, -73.99460), BBM = enu(40.70663, -73.99935);
{
  const Y0 = 150.3, Y1 = 201;
  let k = `<rect x="0" y="${Y0}" width="400" height="${r(Y1 - Y0)}" fill="${S.lg("wasser", [[0, "#bccfd8"], [0.22, "#86a5b5"], [0.7, "#527283"], [1, "#3c5967"]])}"/>`;
  S.def(`<linearGradient id="${S.id("sfade")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="${S.id("smask")}" maskUnits="userSpaceOnUse" x="0" y="150" width="400" height="52"><rect x="0" y="151" width="400" height="40" fill="url(#${S.id("sfade")})"/></mask>`);
  k += `<g mask="url(#${S.id("smask")})"><g filter="url(#${S.id("spiegel")})" opacity=".34">`;
  for (const [x, w, h, c] of [[126, 10, 26, "#d4d2c8"], [149, 14, 22, "#cfd8de"], [163, 8, 30, "#c8dbe9"], [172, 22, 10, "#e5eaec"], [188, 10, 18, "#e2e0d6"], [214, 26, 14, "#d9cfba"], [62, 10, 12, "#7a6a5c"]]) k += `<rect x="${x}" y="${Y0 + 2}" width="${w}" height="${h}" fill="${c}"/>`;
  k += `</g></g>`;
  /* die dunkle Spiegelung des nahen Brooklyn-Pfeilers */
  {
    const L = lokal(BBB[0], BBB[1]), [x0, yw] = L.p(0, 0, 0), wp = K * 18 / L.d;
    k += `<path d="M${r(x0 - wp / 2)} ${r(yw)} L${r(x0 + wp / 2 + 2)} ${r(yw)} L${r(x0 + wp / 2 + 3)} ${r(yw + 24)} L${r(x0 - wp / 2 - 1)} ${r(yw + 24)} Z" fill="${S.lg("bbspiegel", [[0, "#3d4a4e", 0.55], [1, "#3d4a4e", 0]])}" filter="url(#${S.id("spiegel")})"/>`;
  }
  for (let i = 0; i < 170; i++) {
    const t = Math.pow(rnd(), 1.4), y = Y0 + 1 + t * (Y1 - Y0 - 2), w = 1.2 + t * 7 * (0.5 + rnd());
    const x = rnd() * 400;
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} -${r(0.3 + t * 0.5)} ${r(w)} 0" stroke="${rnd() < 0.62 ? "#e9f2f5" : "#27404c"}" stroke-width="${r(0.15 + t * 0.4)}" fill="none" opacity="${r(0.3 + rnd() * 0.35)}"/>`;
  }
  S.teil({ id: "east_river", de: "der East River", syl: "EAST RI-ver", it: "l'East River", itSyl: "EAST RI-ver", en: "East River", x: 0, y: 0, kunst: k,
    tipp: "Der East River ist eigentlich kein Fluss, sondern ein Meeresarm zwischen Manhattan und Brooklyn." });
}

/* =====================================================================
   2 — DIE FREIHEITSSTATUE auf Liberty Island (4,3 km, echte Größe ≈ 7)
   gezeichnet in 0,62 Einheiten je Meter, dann auf 0,0766 verkleinert
   ===================================================================== */
{
  const [se, sn] = enu(40.68925, -74.0445), SD = Math.hypot(se, sn);
  const SX = XM(peil(se, sn)), SY = HOR + K * EYE / SD, SK = (K / SD) / 0.62;
  let k = "";
  /* Insel mit Bäumen */
  k += `<path d="M-130 1 Q-118 -14 -80 -16 L74 -17 Q118 -14 132 1 Z" fill="${S.lg("insel", [[0, "#6f8a5a"], [1, "#4b6340"]])}"/>`;
  for (const [x, y] of [[-108, -13], [-100, -15], [-92, -16], [-84, -16.5], [-76, -16.5], [-116, -9], [62, -16.5], [70, -16.5], [78, -16.5], [86, -16], [94, -15], [102, -13], [112, -10], [120, -7]])
    k += `<circle cx="${x}" cy="${y}" r="3.8" fill="${S.rg("baumi", [[0, "#7c9a62"], [1, "#405a36"]], 0.4, 0.35, 0.7)}"/>`;
  /* Fort Wood: Elf-Zack-Stern aus Granit, sichtbare Mauerhöhe (≈ 7 m); vorne die Zacken, hinten die Mauerkrone */
  {
    const zack = [];
    for (let i = 0; i <= 22; i++) { const a = Math.PI + i / 22 * Math.PI, rad = i % 2 ? 27 : 38; zack.push([Math.cos(a) * rad, Math.sin(a) * rad * 0.16]); }
    const kr = zack.map(([x, y]) => `${r(x)} ${r(y - 6)}`).join(" L");
    let mauer = "";
    for (let i = 0; i < 22; i++) {
      const [x0, y0] = zack[i], [x1, y1] = zack[i + 1];
      const hell = (x1 - x0) * (y1 - y0) > 0;
      mauer += `<path d="M${r(x0)} ${r(y0 - 6)} L${r(x1)} ${r(y1 - 6)} L${r(x1)} ${r(y1 - 1.6)} L${r(x0)} ${r(y0 - 1.6)} Z" fill="${hell ? "#e6dccb" : "#b9aa94"}"/>`;
    }
    k += `<ellipse cx="0" cy="-8" rx="34" ry="4.6" fill="#8fa476"/>`;
    /* geschlossene Mauerkrone des ganzen Sterns (auch die hinteren Zacken) */
    { const st = []; for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2, rad = i % 2 ? 27 : 38; st.push(`${r(Math.cos(a) * rad)} ${r(Math.sin(a) * rad * 0.16 - 6)}`); } k += `<path d="M${st.join(" L")} Z" fill="#d6ccba"/><ellipse cx="0" cy="-6.3" rx="24" ry="3.3" fill="#8fa476"/>`; }
    k += mauer + `<path d="M${kr}" stroke="#f4ede1" stroke-width="1.2" fill="none"/>`;
  }
  /* Fundament: gestufter Pyramidenstumpf (20 m) */
  k += `<path d="M-15 -6 L-10.6 -14 L10.6 -14 L15 -6 Z" fill="${S.lg("fund", [[0, "#ece5d8"], [0.55, "#d7cdbd"], [0.56, "#bcae99"], [1, "#a8998a"]], 0, 0, 1, 0)}"/>`;
  for (const y of [-8, -10, -12, -13.6]) k += `<line x1="${r(-14 + (-y - 6) * 0.55)}" y1="${y}" x2="${r(14 - (-y - 6) * 0.55)}" y2="${y}" stroke="#9c8f7d" stroke-width=".3"/>`;
  /* Sockel und Figur stehen auf dem 20 m hohen Fundament (Verhältnis Figur : Sockel : Fundament = 46 : 27 : 20) */
  k += `<g transform="translate(0 -1.6)">`;
  /* Sockel (27 m): Bossenquader, Loggia mit vier Säulen je Seite, Schildband, Galerie */
  const P = (x0, x1, y0, y1, a, b) => `<path d="M${x0} ${y0} L${x0 + a} ${y1} L${x1 - b} ${y1} L${x1} ${y0} Z"`;
  k += `${P(-4.6, 0.6, -12.4, -29.2, 0.6, 0)} fill="${S.lg("sockl", [[0, "#efe3d3"], [1, "#d9c8b3"]], 0, 0, 1, 0)}"/>`;
  k += `${P(0.6, 4.6, -12.4, -29.2, 0, 0.6)} fill="${S.lg("sockr", [[0, "#c9b7a1"], [1, "#a9978a"]], 0, 0, 1, 0)}"/>`;
  for (const y of [-13.6, -14.8, -16, -17.2]) k += `<path d="M-4.5 ${y} L4.5 ${y}" stroke="#8f7f6c" stroke-width=".14"/>`;
  k += `<rect x="-4.8" y="-18.4" width="9.6" height=".9" fill="#f5ecdf"/><rect x=".6" y="-18.4" width="4.2" height=".9" fill="#c9b8a2"/>`;
  /* Loggia: tiefer Schatten, davor vier helle dorische Säulen, Balkonbrüstung */
  k += `<rect x="-3.6" y="-23.4" width="3.8" height="5" fill="#5a4f43"/><rect x="1" y="-23.4" width="3" height="5" fill="#4a4137"/>`;
  for (const x of [-3.3, -2.15, -1, 0.05]) k += `<rect x="${r(x - 0.2)}" y="-23.4" width=".4" height="5" fill="#f4eadb"/><rect x="${r(x - 0.3)}" y="-23.6" width=".6" height=".3" fill="#f4eadb"/>`;
  for (const x of [1.35, 2.25, 3.15, 3.85]) k += `<rect x="${r(x - 0.16)}" y="-23.4" width=".32" height="5" fill="#cfbea8"/>`;
  k += `<rect x="-3.7" y="-19.5" width="8" height=".55" fill="#ece1d0"/>`;
  k += `<rect x="-4.6" y="-24.6" width="9.2" height="1.2" fill="#e8dccb"/><rect x=".6" y="-24.6" width="4" height="1.2" fill="#bba993"/>`;
  for (let i = 0; i < 7; i++) k += `<circle cx="${r(-4 + i * 0.75)}" cy="-25.7" r=".28" fill="#b1a08a"/>`;
  k += `<rect x="-4.4" y="-27.6" width="8.8" height="1.4" fill="#f2e8da"/><rect x=".6" y="-27.6" width="3.8" height="1.4" fill="#c4b29c"/>`;
  k += `<rect x="-4.1" y="-29.2" width="8.2" height="1.6" fill="#e4d6c4"/>`;
  for (let i = 0; i < 9; i++) k += `<rect x="${r(-3.9 + i * 0.9)}" y="-29" width=".3" height="1.2" fill="#8e7f6b"/>`;
  k += `<rect x="-4.6" y="-29.2" width="9.2" height="16.8" fill="${S.lg("sockmorgen", [[0, "#ffe9c8", 0.18], [1, "#fff", 0]], 0, 0, 1, 0)}"/>`;
  /* DIE FIGUR (Grünspan-Kupfer), Fuß bei y −29,2. Maße (NPS): Ferse bis
     Scheitel 34 m, Taille 10,7 m, Kopf 5,3 m, rechter Arm 12,8 m,
     Tafel 7,2 × 4,1 m. Sie blickt nach Südosten in die Morgensonne: ihre
     Vorderseite (im Bild links) ist hell, die linke Flanke im Schatten. */
  const F0 = -29.2;
  const f = (x, y) => `${r(x)} ${r(F0 + y)}`;
  let g = "";
  const KUPFER = S.lg("kupferf", [[0, "#a9dccb"], [0.35, "#7cbba7"], [0.7, "#4f8f7c"], [1, "#336b5c"]], 0, 0, 1, 0);
  /* Gewand: weit, fällt in schweren Falten bis auf den Sockel */
  g += `<path d="M${f(-4, 0)} C${f(-3.9, -4)} ${f(-3.3, -9)} ${f(-2.9, -12.6)} C${f(-2.7, -15)} ${f(-2.7, -16.6)} ${f(-2.4, -17.6)} Q${f(0, -18.8)} ${f(2.6, -17.6)} C${f(3, -16)} ${f(3.2, -14)} ${f(3.3, -12.2)} C${f(3.6, -8)} ${f(4, -4)} ${f(4.2, 0)} Q${f(2.2, 0.5)} ${f(0, 0.2)} Q${f(-2, 0.5)} ${f(-4, 0)} Z" fill="${KUPFER}"/>`;
  /* Saum mit Zickzack */
  g += `<path d="M${f(-4, 0)} L${f(-3.2, -0.6)} L${f(-2.4, 0.1)} L${f(-1.4, -0.7)} L${f(-0.4, 0.2)} L${f(0.8, -0.6)} L${f(1.9, 0.2)} L${f(3, -0.5)} L${f(4.2, 0)}" stroke="#2f5f52" stroke-width=".22" fill="none"/>`;
  /* tiefe Falten (dunkel) und Faltenkämme (hell) */
  for (const [x0, x1, c] of [[-2.5, -3.2, 0], [-1.5, -2.1, 0], [-0.5, -0.9, 0], [0.6, 0.6, 0], [1.6, 2.1, 0], [2.6, 3.3, 0]]) g += `<path d="M${f(x0, -12)} Q${f((x0 + x1) / 2 - 0.4, -6)} ${f(x1, -0.3)}" stroke="#2c5d50" stroke-width=".34" fill="none" opacity=".8"/>`;
  for (const [x0, x1] of [[-2, -2.7], [-1, -1.5], [0.1, -0.1], [1.1, 1.3]]) g += `<path d="M${f(x0, -12)} Q${f((x0 + x1) / 2 + 0.25, -6)} ${f(x1, -0.4)}" stroke="#c4ece0" stroke-width=".26" fill="none" opacity=".75"/>`;
  /* Mantel (Stola): von der linken Schulter (im Bild rechts) quer über die Brust zur rechten Hüfte */
  g += `<path d="M${f(2.6, -17.5)} Q${f(0.6, -15.4)} ${f(-2.8, -12.4)} L${f(-3.2, -9.6)} Q${f(0.4, -11.6)} ${f(3.2, -13.4)} Z" fill="${S.lg("stola", [[0, "#8ccab6"], [1, "#4a8a77"]], 0, 0, 1, 0)}"/>`;
  g += `<path d="M${f(2.4, -17.2)} Q${f(0.4, -15)} ${f(-2.8, -12.2)} M${f(2.8, -15.6)} Q${f(0, -13.4)} ${f(-3, -10.8)}" stroke="#cdeee3" stroke-width=".2" fill="none" opacity=".8"/>`;
  g += `<path d="M${f(-3.2, -9.6)} Q${f(0.4, -11.6)} ${f(3.2, -13.4)}" stroke="#2c5d50" stroke-width=".3" fill="none"/>`;
  /* der rechte Fuß tritt vor, daneben die zerbrochene Kette */
  g += `<path d="M${f(-1.4, 0.1)} q.9 -1.2 2.2 -.4 l.4 .5 Z" fill="#5c9e8a"/><path d="M${f(1.4, -0.1)} q.6 -.5 1.2 0 q.6 -.5 1.2 0" stroke="#2f5d51" stroke-width=".28" fill="none"/>`;
  /* linker Arm (im Bild rechts) hält die Tafel an die Hüfte */
  g += `<path d="M${f(2.5, -17.4)} Q${f(3.6, -16)} ${f(3.5, -13.4)} L${f(2.6, -12.2)} Q${f(2.4, -14.8)} ${f(1.8, -16.4)} Z" fill="#477f6e"/>`;
  g += `<path d="M${f(1.9, -10.2)} L${f(4.1, -10.8)} L${f(3.8, -15.6)} L${f(1.7, -15.1)} Z" fill="${S.lg("tafel", [[0, "#9cd2c0"], [1, "#5b9784"]], 0, 0, 1, 0)}"/>`;
  g += `<path d="M${f(1.9, -10.2)} L${f(1.7, -15.1)} L${f(1.2, -14.9)} L${f(1.45, -10.1)} Z" fill="#336657"/>`;
  g += `<path d="M${f(1.7, -15.1)} L${f(3.8, -15.6)} L${f(3.5, -15.9)} L${f(1.3, -15.4)} Z" fill="#b5e3d4"/>`;
  g += `<text transform="translate(${f(2.9, -13.6)}) rotate(-6)" font-size=".5" text-anchor="middle" fill="#245046" font-family="Georgia,serif" font-weight="bold">JULY</text>`;
  g += `<text transform="translate(${f(2.95, -12.8)}) rotate(-6)" font-size=".5" text-anchor="middle" fill="#245046" font-family="Georgia,serif" font-weight="bold">IV</text>`;
  g += `<text transform="translate(${f(3.0, -11.9)}) rotate(-6) scale(.7 1)" font-size=".5" text-anchor="middle" fill="#245046" font-family="Georgia,serif" font-weight="bold">MDCCLXXVI</text>`;
  g += `<path d="M${f(2.3, -10.5)} q.8 .5 1.6 .1" stroke="#4a8a77" stroke-width=".55" stroke-linecap="round" fill="none"/>`;
  /* Hals und Kopf (Gesicht nach vorn links), Haar im Nacken geknotet */
  g += `<path d="M${f(-0.7, -17.9)} L${f(-0.6, -19.1)} L${f(0.6, -19.1)} L${f(0.8, -17.9)} Z" fill="#5f9f8b"/>`;
  g += `<ellipse cx="${r(0.6)}" cy="${r(F0 - 19.9)}" rx=".8" ry="1" fill="#3f7a6b"/>`;
  g += `<ellipse cx="${r(-0.15)}" cy="${r(F0 - 20.3)}" rx="1.25" ry="1.6" fill="${S.rg("kopf", [[0, "#bfe8da"], [0.55, "#7fbaa7"], [1, "#3f7a6b"]], 0.32, 0.4, 0.75)}"/>`;
  /* strenges, klassisches Gesicht: gerade Brauen, offene Augen (Lider), gerade Nase, geschlossener Mund */
  g += `<path d="M${f(-1.1, -20.95)} l.62 -.06 M${f(-0.1, -21)} l.6 .02" stroke="#2f5d51" stroke-width=".14" fill="none"/>`;
  g += `<path d="M${f(-1.02, -20.6)} q.28 -.2 .52 0 q-.26 .14 -.52 0 Z M${f(-0.02, -20.62)} q.28 -.2 .5 0 q-.25 .14 -.5 0 Z" fill="#e7f6f0" stroke="#2f5d51" stroke-width=".07"/>`;
  g += `<circle cx="${r(-0.74)}" cy="${r(F0 - 20.62)}" r=".09" fill="#2f5d51"/><circle cx="${r(0.25)}" cy="${r(F0 - 20.64)}" r=".09" fill="#2f5d51"/>`;
  g += `<path d="M${f(-0.42, -20.95)} L${f(-0.5, -19.95)} L${f(-0.28, -19.9)}" stroke="#3c7262" stroke-width=".12" fill="none"/><path d="M${f(-0.7, -19.45)} l.55 0" stroke="#2f5d51" stroke-width=".11"/>`;
  /* Krone: Reif mit 25 Fenstern und sieben Strahlen (je 2,7 m) */
  g += `<path d="M${f(-1.4, -21.2)} Q${f(0, -22)} ${f(1.3, -21.2)} L${f(1.25, -22.1)} Q${f(0, -22.9)} ${f(-1.35, -22.1)} Z" fill="#5f9f8b"/>`;
  for (let i = 0; i < 9; i++) g += `<rect x="${r(-1.2 + i * 0.27)}" y="${r(F0 - 22.15 + Math.abs(i - 4) * 0.05)}" width=".14" height=".38" fill="#163a32"/>`;
  for (let i = 0; i < 7; i++) {
    const a = (-80 + i * 26.7) * Math.PI / 180, bx = -0.05 + Math.sin(a) * 1.25, by = -22.3 - Math.cos(a) * 0.3, L = 1.9 - Math.abs(i - 3) * 0.08;
    const tx = bx + Math.sin(a) * L, ty = by - Math.cos(a) * L * 0.95, nx = Math.cos(a) * 0.22, ny = Math.sin(a) * 0.22;
    g += `<path d="M${f(bx - nx, by - ny)} L${f(tx, ty)} L${f(bx + nx, by + ny)} Z" fill="${i < 4 ? "#a6d8c7" : "#5f9e8b"}" stroke="#3f7a6b" stroke-width=".06"/>`;
  }
  /* rechter Arm hoch, der Ärmel hängt in Falten herab; die Fackel */
  g += `<path d="M${f(-2.4, -17.4)} Q${f(-3.5, -18.4)} ${f(-3.7, -21)} Q${f(-3.8, -23.4)} ${f(-3.5, -25)} L${f(-2.5, -25.1)} Q${f(-2.4, -22.4)} ${f(-1.9, -20.6)} Q${f(-1.5, -18.8)} ${f(-0.9, -18.2)} Z" fill="${S.lg("arm", [[0, "#a9dccb"], [1, "#4f8d7b"]], 0, 0, 1, 0)}"/>`;
  g += `<path d="M${f(-3.6, -18.2)} Q${f(-4.1, -19.4)} ${f(-3.7, -21.2)} Q${f(-3.2, -19.6)} ${f(-2.4, -17.6)} Z" fill="#4f8d7b"/>`;
  g += `<path d="M${f(-3.1, -19.6)} Q${f(-3.3, -22)} ${f(-3, -24.4)}" stroke="#d0f0e5" stroke-width=".2" fill="none" opacity=".7"/>`;
  g += `<ellipse cx="${r(-3)}" cy="${r(F0 - 25.4)}" rx=".7" ry=".55" fill="#5f9f8b"/>`;
  g += `<path d="M${f(-3.35, -25.6)} L${f(-3.2, -26.9)} L${f(-2.75, -26.9)} L${f(-2.6, -25.6)} Z" fill="#4f8d7b"/>`;
  g += `<path d="M${f(-3.9, -26.9)} L${f(-2.05, -26.9)} L${f(-2.25, -27.35)} L${f(-3.7, -27.35)} Z" fill="#7cbba7"/>`;
  for (let i = 0; i < 6; i++) g += `<line x1="${r(-3.75 + i * 0.3)}" y1="${r(F0 - 26.9)}" x2="${r(-3.75 + i * 0.3)}" y2="${r(F0 - 27.35)}" stroke="#2f5d51" stroke-width=".07"/>`;
  g += `<path d="M${f(-2.95, -27.35)} C${f(-3.85, -28)} ${f(-3.3, -28.9)} ${f(-2.9, -29.8)} C${f(-2.55, -28.9)} ${f(-1.95, -28.1)} ${f(-2.95, -27.35)} Z" fill="${GOLD}"/>`;
  g += `<path d="M${f(-2.95, -27.6)} C${f(-3.35, -28.1)} ${f(-3.15, -28.8)} ${f(-2.9, -29.3)}" stroke="#fffbe0" stroke-width=".18" fill="none"/>`;
  /* Schatten auf der linken Flanke (im Bild rechts) */
  g += `<path d="M${f(1.4, 0.3)} C${f(1.2, -6)} ${f(1.6, -12)} ${f(2.2, -17.6)} L${f(2.6, -17.6)} C${f(3, -16)} ${f(3.2, -14)} ${f(3.3, -12.2)} C${f(3.6, -8)} ${f(4, -4)} ${f(4.2, 0)} Z" fill="#123a31" opacity=".2"/>`;
  k += `<g transform="scale(.9 1)">${g}</g></g>`;
  const sk = SK;
  S.teil({ id: "freiheitsstatue", de: "die Freiheitsstatue", syl: "FREI-heits-sta-tu-e", it: "la Statua della Libertà", itSyl: "STA-tua del-la li-ber-TÀ", en: "Statue of Liberty",
    x: SX, y: SY, kunst: `<g ${fern(0)} transform="scale(${r(SK * 1000) / 1000})">${k}</g>` + flaeche(-7, -20, 14, 22, 1),
    tipp: "Die Freiheitsstatue war ein Geschenk Frankreichs an die USA (1886). Mit dem Sockel ist sie 93 Meter hoch — von hier, 4 Kilometer weit, ist sie klein.",
    zoom: { x: r(SX - 6.9), y: r(SY - 8.8), w: 13.8, h: 9.2 },
    unter: [
      { id: "fackel", de: "die Fackel", syl: "FA-ckel", it: "la fiaccola", itSyl: "FIAC-co-la", en: "torch", x: SX - 2.65 * sk, y: SY - 58 * sk, kunst: flaeche(-1.7 * sk, -3.6 * sk, 3.4 * sk, 4.2 * sk, 0.1),
        tipp: "Die Flamme der Fackel ist mit echtem Gold überzogen." },
      { id: "krone", de: "die Krone", syl: "KRO-ne", it: "la corona", itSyl: "co-RO-na", en: "crown", x: SX - 0.1 * sk, y: SY - 53 * sk, kunst: flaeche(-2.8 * sk, -3 * sk, 5.6 * sk, 3.4 * sk, 0.1),
        tipp: "Die Krone hat sieben Strahlen — für die sieben Meere und Kontinente." },
      { id: "tafel", de: "die Tafel", syl: "TA-fel", it: "la tavoletta", itSyl: "ta-vo-LET-ta", en: "tablet", x: SX + 2.6 * sk, y: SY - 40.9 * sk, kunst: flaeche(-1.7 * sk, -6.6 * sk, 3.4 * sk, 6.8 * sk, 0.1),
        tipp: "Auf der Tafel steht „JULY IV MDCCLXXVI“ — der 4. Juli 1776, der Tag der Unabhängigkeit." },
      { id: "sockel", de: "der Sockel", syl: "SO-ckel", it: "il piedistallo", itSyl: "pie-di-STAL-lo", en: "pedestal", x: SX, y: SY - 14 * sk, kunst: flaeche(-4.6 * sk, -16.8 * sk, 9.2 * sk, 16.6 * sk, 0.1),
        tipp: "Der Sockel aus Granit wurde mit Spenden aus ganz Amerika bezahlt." },
    ] });
}

/* =====================================================================
   3 — DAS EMPIRE STATE BUILDING und 4 — DAS CHRYSLER BUILDING
   (Midtown, 5,2 und 5,8 km — echte Größe; gezeichnet in Metern)
   ===================================================================== */
{
  const s = K / 5239, X = XM(369.9), Y = HOR + K * EYE / 5239;
  const KALK = S.lg("kalk", [[0, "#d8d3c8"], [0.45, "#c3bdb1"], [0.55, "#9d978c"], [1, "#857f75"]], 0, 0, 1, 0);
  let k = "";
  k += `<rect x="-65" y="-125" width="130" height="125" fill="${KALK}"/><rect x="-65" y="-125" width="130" height="125" fill="url(#${S.id("steinv")})" transform="scale(1 1)"/>`;
  k += `<rect x="-29" y="-300" width="58" height="176" fill="${KALK}"/>`;
  for (let x = -26; x < 28; x += 6) k += `<rect x="${x}" y="-298" width="3" height="172" fill="#6a7078" opacity=".4"/>`;
  k += `<rect x="-23" y="-322" width="46" height="23" fill="${KALK}"/><rect x="-18" y="-338" width="36" height="17" fill="${KALK}"/><rect x="-14" y="-350" width="28" height="13" fill="${KALK}"/>`;
  /* Schultern der Rücksprünge hell abgesetzt, darüber der zylindrische Mast (Fenster-Ringe) und die Antenne */
  for (const [y, w] of [[-125, 65], [-300, 29], [-322, 23], [-338, 18]]) k += `<rect x="${-w}" y="${y}" width="${2 * w}" height="3" fill="#ece8de"/>`;
  k += `<path d="M-9 -350 L-9 -372 Q0 -377 9 -372 L9 -350 Z" fill="${S.lg("mast", [[0, "#e9edef"], [0.5, "#bfc7cc"], [1, "#8f989e"]], 0, 0, 1, 0)}"/>`;
  for (const y of [-356, -362, -368]) k += `<rect x="-9" y="${y}" width="18" height="2" fill="#5d666d" opacity=".6"/>`;
  k += `<rect x="-3.5" y="-392" width="7" height="14" fill="#c4cbcf"/><rect x="-1.8" y="-443" width="3.6" height="52" fill="#9aa3a9"/>`;
  S.teil({ id: "empire_state_building", de: "das Empire State Building", syl: "EM-pire STATE BUIL-ding", it: "l'Empire State Building", itSyl: "EM-pire STATE BUIL-ding", en: "Empire State Building",
    x: X, y: Y, kunst: `<g ${fern(0)} transform="scale(${r(s * 10000) / 10000})">${k}</g>` + flaeche(-3, -29, 6, 29, 0.5),
    tipp: "Das Empire State Building (1931) ist 443 Meter hoch. Oben im 86. und 102. Stock sind Aussichtsplattformen.",
    /* Lupe „Midtown“: Empire State und Chrysler Building nebeneinander */
    zoom: { x: r(X - 8), y: r(Y - 31), w: 30, h: 20 } });
}
{
  const s = K / 5788, X = XM(377.7), Y = HOR + K * EYE / 5788;
  let k = `<rect x="-25" y="-235" width="50" height="235" fill="${S.lg("chrys", [[0, "#efece6"], [0.5, "#d8d4cc"], [0.55, "#b3afa7"], [1, "#9a968e"]], 0, 0, 1, 0)}"/>`;
  for (let x = -21; x < 22; x += 6) k += `<rect x="${x}" y="-232" width="2.6" height="230" fill="#4c5560" opacity=".5"/>`;
  const ST = S.lg("chrstahl", [[0, "#ffffff"], [0.35, "#d8dde1"], [0.6, "#9ea7ae"], [1, "#e6eaec"]], 0, 0, 1, 0);
  for (let i = 0; i < 7; i++) {
    const y = -236 - i * 7.2, w = 23 - i * 2.9;
    k += `<path d="M${r(-w)} ${r(y)} Q${r(-w)} ${r(y - 9)} 0 ${r(y - 9.6)} Q${r(w)} ${r(y - 9)} ${r(w)} ${r(y)} Z" fill="${ST}"/><path d="M${r(-w)} ${r(y)} Q${r(-w)} ${r(y - 9)} 0 ${r(y - 9.6)}" stroke="#ffffff" stroke-width="1.2" fill="none"/>`;
    for (const t of [-0.6, -0.2, 0.2, 0.6]) if (w > 6) k += `<path d="M${r(t * w - 1.4)} ${r(y - 0.8)} L${r(t * w)} ${r(y - 6.4)} L${r(t * w + 1.4)} ${r(y - 0.8)} Z" fill="#1f2830"/>`;
  }
  k += `<path d="M-2.4 -284 L0 -319 L2.4 -284 Z" fill="${ST}"/>`;
  S.teil({ id: "chrysler_building", de: "das Chrysler Building", syl: "CHRYS-ler BUIL-ding", it: "il Chrysler Building", itSyl: "CHRYS-ler BUIL-ding", en: "Chrysler Building",
    x: X, y: Y, kunst: `<g ${fern(0)} transform="scale(${r(s * 10000) / 10000})">${k}</g>` + flaeche(-2.6, -19, 5.2, 19, 0.5),
    tipp: "Die glänzende Spitze des Chrysler Buildings ist aus Edelstahl — ein Meisterwerk des Art déco." });
}

/* =====================================================================
   Hochhäuser: echte Breite und Höhe, gezeichnet am Ort (Peilung)
   ===================================================================== */
const VERL = {
  glas: S.lg("vglas", [[0, "#a7c3da"], [0.5, "#86a7c4"], [1, "#62839f"]]),
  glas2: S.lg("vglas2", [[0, "#bfd0dc"], [1, "#8ba1b1"]]),
  dunkel: S.lg("vdunkel", [[0, "#5f6974"], [1, "#3b444e"]]),
  schwarz: S.lg("vschwarz", [[0, "#3e454d"], [1, "#262b31"]]),
  stein: S.lg("vstein", [[0, "#e3dccd"], [1, "#bdb29f"]]),
  stein2: S.lg("vstein2", [[0, "#d3cab9"], [1, "#a99e8b"]]),
  braun: S.lg("vbraun", [[0, "#b8836a"], [1, "#8c5e48"]]),
  ziegel: S.lg("vziegel", [[0, "#a9644c"], [1, "#7d4634"]]),
  hell: S.lg("vhell", [[0, "#f2f3f1"], [1, "#cdd1d1"]]),
};
const haus = (lat, lon, H, W, art, muster, extra) => {
  const [e, n] = enu(lat, lon), d = Math.hypot(e, n), x = XM(peil(e, n)), yb = HOR + K * (EYE - 3) / d, h = K * H / d, w = K * W / d;
  let s = `<rect x="${r(x - w / 2)}" y="${r(yb - h)}" width="${r(w)}" height="${r(h)}" fill="${VERL[art]}"/>`;
  if (muster) s += `<rect x="${r(x - w / 2)}" y="${r(yb - h)}" width="${r(w)}" height="${r(h)}" fill="url(#${S.id(muster)})"/>`;
  s += `<rect x="${r(x - w / 2)}" y="${r(yb - h)}" width="${r(w)}" height="${r(h)}" fill="${LICHT}"/>`;
  if (extra) s += extra(x, yb, w, h, K / d);
  return { d, s };
};

/* =====================================================================
   5 — DAS ONE WORLD TRADE CENTER (1,87 km; Dach 73, Antenne bis 95)
   ===================================================================== */
{
  const [e, n] = enu(40.71274, -74.01338), d = Math.hypot(e, n), X = XM(peil(e, n)), BASE = HOR + K * (EYE - 3) / d, s = K / d;
  const Hr = 417 * s, Hs = 124 * s, wB = 40 * s, wT = 24 * s;
  let k = "";
  const top = -Hr, P = (x, y) => `${r(x)} ${r(y)}`;
  k += `<path d="M${P(-wB, 0)} L${P(-wT, top)} L${P(wT, top)} L${P(wB, 0)} Z" fill="${S.lg("owglas", [[0, "#d3e5f2"], [0.5, "#a3c2da"], [1, "#7393ae"]], 0, 0, 0, 1)}"/>`;
  k += `<path d="M${P(-wB, 0)} L${P(0, top)} L${P(-wT, top)} Z" fill="#eaf3f9" opacity=".55"/>`;
  k += `<path d="M${P(wB, 0)} L${P(0, top)} L${P(wT, top)} Z" fill="#46627a" opacity=".45"/>`;
  k += `<path d="M${P(-wB, 0)} L${P(0, top)} L${P(0, 0)} Z" fill="#b9d3e6" opacity=".35"/><path d="M${P(0, 0)} L${P(0, top)} L${P(wB, 0)} Z" fill="#5b7a94" opacity=".35"/>`;
  k += `<line x1="0" y1="0" x2="0" y2="${r(top)}" stroke="#eaf3f9" stroke-width=".25"/>`;
  for (let y = -2.4; y > top; y -= 0.73) { const t = -y / Hr, hw = wB + (wT - wB) * t; k += `<line x1="${r(-hw)}" y1="${r(y)}" x2="${r(hw)}" y2="${r(y)}" stroke="#36506a" stroke-width=".08" opacity=".45"/>`; }
  k += `<path d="M${P(-4.6, -18)} L${P(-2.4, -52)} L${P(-1.6, -52)} L${P(-3.8, -18)} Z" fill="#fffbe8" opacity=".65"/>`;
  k += `<rect x="${r(-wB)}" y="${r(-57 * s)}" width="${r(2 * wB)}" height="${r(57 * s)}" fill="${S.lg("owsock", [[0, "#dfe8ee"], [1, "#a9b9c4"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${P(-wT - 0.3, top + 0.5)} L${P(-wT, top - 0.5)} L${P(wT, top - 0.5)} L${P(wT + 0.3, top + 0.5)} Z" fill="#dfe8ee"/>`;
  k += `<path d="M-.42 ${r(top - 0.5)} L-.22 ${r(top - Hs)} L.22 ${r(top - Hs)} L.42 ${r(top - 0.5)} Z" fill="${S.lg("spire", [[0, "#f7f9fa"], [1, "#b7c1c8"]], 0, 0, 1, 0)}"/>`;
  for (const t of [0.14, 0.32, 0.5, 0.68]) k += `<rect x="-.75" y="${r(top - 0.5 - t * (Hs - 0.5))}" width="1.5" height=".34" rx=".15" fill="#eef2f4"/>`;
  S.teil({ id: "one_wtc", de: "das One World Trade Center", syl: "ONE WORLD TRADE CEN-ter", it: "il One World Trade Center", itSyl: "ONE WORLD TRADE CEN-ter", en: "One World Trade Center",
    x: X, y: BASE, kunst: `<g ${fern(2)}>${k}</g>`, tipp: "Das One World Trade Center ist mit der Antenne 541 Meter hoch — 1776 Fuß, wie das Jahr der Unabhängigkeit." });
}

/* =====================================================================
   6 — DIE SKYLINE von Lower Manhattan (Hochhäuser in echter Lage und
   Größe, fern zuerst), am Ufer FDR Drive, Pier 17, Wavertree, Heliport
   ===================================================================== */
{
  const liste = [];
  const add = (o) => liste.push(o);
  /* schlanke Spitze, Pyramide, Stufen … als Zusatz */
  const spitze = (hm) => (x, yb, w, h, s) => `<line x1="${r(x)}" y1="${r(yb - h)}" x2="${r(x)}" y2="${r(yb - h - hm * s)}" stroke="#9aa3a9" stroke-width=".3"/>`;
  const dachtech = (x, yb, w, h) => `<rect x="${r(x - w * 0.3)}" y="${r(yb - h - 1)}" width="${r(w * 0.6)}" height="1.05" fill="#7d858c"/>`;
  add(haus(40.7066, -74.0153, 238, 34, "glas2", "glasr", dachtech));                        /* 50 West St */
  add(haus(40.7099, -74.0117, 298, 46, "glas", "glasr", (x, yb, w, h) => `<path d="M${r(x - w / 2)} ${r(yb - h)} L${r(x + w / 2)} ${r(yb - h)} L${r(x + w / 2)} ${r(yb - h - 1.6)} L${r(x - w / 4)} ${r(yb - h - 1.6)} Z" fill="#c9d8e3"/>`)); /* 4 WTC */
  add(haus(40.7110, -74.0119, 329, 52, "dunkel", "glasr", (x, yb, w, h) => { let s = ""; for (let y = yb - h + 2; y < yb - 4; y += 7) s += `<path d="M${r(x - w / 2)} ${r(y)} L${r(x)} ${r(y + 3.5)} L${r(x + w / 2)} ${r(y)} M${r(x - w / 2)} ${r(y + 7)} L${r(x)} ${r(y + 3.5)} L${r(x + w / 2)} ${r(y + 7)}" stroke="#8a96a2" stroke-width=".25" fill="none"/>`; return s + `<rect x="${r(x - w / 2)}" y="${r(yb - h - 2)}" width="${r(w)}" height="2" fill="#4b5560"/>`; })); /* 3 WTC mit Diagonalen */
  add(haus(40.7096, -74.0107, 226, 58, "schwarz", "glasr", dachtech));                      /* One Liberty Plaza */
  add(haus(40.7085, -74.0090, 248, 52, "dunkel", "steinv", dachtech));                      /* 28 Liberty */
  add(haus(40.7061, -74.0091, 226, 34, "stein2", "steinr", (x, yb, w, h) => `<rect x="${r(x - w * 0.36)}" y="${r(yb - h - 3)}" width="${r(w * 0.72)}" height="3" fill="${VERL.stein2}"/><rect x="${r(x - w * 0.2)}" y="${r(yb - h - 6)}" width="${r(w * 0.4)}" height="3" fill="${VERL.stein2}"/>`)); /* 20 Exchange Place */
  add(haus(40.7059, -74.0079, 227, 40, "hell", "steinr", (x, yb, w, h) => `<path d="M${r(x - w * 0.3)} ${r(yb - h)} L${r(x)} ${r(yb - h - 4)} L${r(x + w * 0.3)} ${r(yb - h)} Z" fill="#e7e4dc"/>`)); /* 60 Wall */
  add(haus(40.7063, -74.00918, 260, 34, "stein", "steinr", (x, yb, w, h, s) => `<path d="M${r(x - w / 2 + 0.6)} ${r(yb - h)} L${r(x)} ${r(yb - h - 17 * s * 1.6)} L${r(x + w / 2 - 0.6)} ${r(yb - h)} Z" fill="${S.lg("kupfer", [[0, "#8fc4ae"], [1, "#4f8a74"]], 0, 0, 1, 0)}"/>` + `<line x1="${r(x)}" y1="${r(yb - h - 27 * s)}" x2="${r(x)}" y2="${r(yb - h - 23 * s - 6)}" stroke="#9aa3a9" stroke-width=".3"/>`)); /* 40 Wall */
  add(haus(40.70637, -74.00754, 236, 38, "stein2", "steinv", (x, yb, w, h, s) => `<rect x="${r(x - w * 0.38)}" y="${r(yb - h - 14 * s)}" width="${r(w * 0.76)}" height="${r(14 * s)}" fill="${VERL.stein2}"/><rect x="${r(x - w * 0.24)}" y="${r(yb - h - 26 * s)}" width="${r(w * 0.48)}" height="${r(12 * s)}" fill="${VERL.stein2}"/><path d="M${r(x - w * 0.14)} ${r(yb - h - 26 * s)} L${r(x)} ${r(yb - h - 40 * s)} L${r(x + w * 0.14)} ${r(yb - h - 26 * s)} Z" fill="#d9e4ea"/>` + spitze(14)(x, yb - 40 * s, w, h, s))); /* 70 Pine */
  add(haus(40.70185, -74.01207, 195, 56, "braun", "steinr", dachtech));                     /* 1 New York Plaza */
  add(haus(40.7025, -74.0122, 165, 40, "hell", "glasr", null));                             /* 17 State St */
  add(haus(40.7035, -74.0090, 210, 70, "schwarz", "glasr", dachtech));                      /* 55 Water St */
  add(haus(40.7120, -74.0086, 241, 28, "hell", "steinv", (x, yb, w, h, s) => `<rect x="${r(x - w * 0.4)}" y="${r(yb - h - 20 * s)}" width="${r(w * 0.8)}" height="${r(20 * s)}" fill="${VERL.hell}"/><path d="M${r(x - w * 0.3)} ${r(yb - h - 20 * s)} L${r(x)} ${r(yb - h - 36 * s)} L${r(x + w * 0.3)} ${r(yb - h - 20 * s)} Z" fill="${S.lg("kupfer2", [[0, "#9ccdb6"], [1, "#5a957c"]], 0, 0, 1, 0)}"/>` + spitze(8)(x, yb - 36 * s, w, h, s))); /* Woolworth */
  add(haus(40.7107, -74.0055, 265, 40, "hell", null, (x, yb, w, h) => { let s = ""; for (let xx = x - w / 2 + 0.6; xx < x + w / 2; xx += 1.1) s += `<path d="M${r(xx)} ${r(yb - h + 1)} q.4 5 0 10 t0 10 t0 10 t0 10 t0 10 t0 10 t0 10" stroke="#8a959c" stroke-width=".18" fill="none" opacity=".75"/>`; return s; })); /* 8 Spruce */
  /* Municipal Building: breit, Kolonnade unten, Mittelturm gestuft, goldene Civic Fame */
  {
    const [e, n] = polar(328.5, 1395), d = 1395, x = XM(328.5), yb = HOR + K * (EYE - 3) / d, s = K / d;
    let m = `<rect x="${r(x - 50 * s)}" y="${r(yb - 128 * s)}" width="${r(100 * s)}" height="${r(128 * s)}" fill="${VERL.stein}"/><rect x="${r(x - 50 * s)}" y="${r(yb - 128 * s)}" width="${r(100 * s)}" height="${r(128 * s)}" fill="url(#${S.id("steinr")})"/>`;
    m += `<rect x="${r(x - 18 * s)}" y="${r(yb - 150 * s)}" width="${r(36 * s)}" height="${r(22 * s)}" fill="${VERL.stein}"/><rect x="${r(x - 12 * s)}" y="${r(yb - 164 * s)}" width="${r(24 * s)}" height="${r(14 * s)}" fill="${VERL.stein}"/>`;
    for (const dx of [-14, 14]) m += `<rect x="${r(x + dx * s - 3 * s)}" y="${r(yb - 158 * s)}" width="${r(6 * s)}" height="${r(8 * s)}" fill="${VERL.stein}"/>`;
    m += `<path d="M${r(x - 0.5)} ${r(yb - 164 * s)} L${r(x)} ${r(yb - 177 * s)} L${r(x + 0.5)} ${r(yb - 164 * s)} Z" fill="${GOLD}"/>`;
    m += `<rect x="${r(x - 50 * s)}" y="${r(yb - 128 * s)}" width="${r(100 * s)}" height="${r(128 * s)}" fill="${LICHT}"/>`;
    liste.push({ d, s: m });
  }
  /* Lower East Side und Two Bridges hinter den Brücken: Backstein-Wohnblocks (NYCHA) */
  for (const [b, d, h, w, art] of [[342, 1250, 62, 36, "ziegel"], [346, 1180, 50, 30, "ziegel"], [350, 1230, 50, 36, "ziegel"], [355, 1150, 45, 30, "braun"], [359, 1210, 50, 34, "ziegel"], [3, 1300, 40, 40, "stein2"], [6, 1150, 55, 30, "ziegel"], [13, 1400, 28, 50, "braun"], [16, 1300, 26, 30, "ziegel"], [24, 1450, 50, 40, "stein2"], [28, 1200, 45, 40, "ziegel"]]) {
    const bb = b < 180 ? b + 360 : b, x = XM(bb), yb = HOR + K * (EYE - 3) / d, s = K / d;
    liste.push({ d, s: `<rect x="${r(x - w * s / 2)}" y="${r(yb - h * s)}" width="${r(w * s)}" height="${r(h * s)}" fill="${VERL[art]}"/><rect x="${r(x - w * s / 2)}" y="${r(yb - h * s)}" width="${r(w * s)}" height="${r(h * s)}" fill="url(#${S.id("steinr")})"/><rect x="${r(x - w * s / 2)}" y="${r(yb - h * s)}" width="${r(w * s)}" height="${r(h * s)}" fill="${LICHT}"/>` });
  }
  /* niedrige Häuser am Ufer (Seaport, Financial District, Lower East Side) */
  for (let b = 268; b < 392; b += 1.3 + rnd() * 1.6) {
    const d = (b > 333 ? 880 : b > 310 ? 760 : 900) + rnd() * 260, h = 18 + rnd() * (b > 333 ? 34 : 28), w = 18 + rnd() * 30;
    const art = ["ziegel", "stein", "stein2", "braun", "glas2", "ziegel"][Math.floor(rnd() * 6)], x = XM(b), yb = HOR + K * (EYE - 3) / d, s = K / d;
    let m = `<rect x="${r(x - w * s / 2)}" y="${r(yb - h * s)}" width="${r(w * s)}" height="${r(h * s)}" fill="${VERL[art]}"/><rect x="${r(x - w * s / 2)}" y="${r(yb - h * s)}" width="${r(w * s)}" height="${r(h * s)}" fill="url(#${S.id("steinr")})"/>`;
    if (art === "ziegel" && rnd() < 0.5) m += `<rect x="${r(x - 1.3 * s * 2)}" y="${r(yb - h * s - 3 * s)}" width="${r(4 * s)}" height="${r(3 * s)}" fill="#7a5a3a"/><path d="M${r(x - 2.8 * s)} ${r(yb - h * s - 3 * s)} L${r(x)} ${r(yb - h * s - 4.6 * s)} L${r(x + 2.8 * s)} ${r(yb - h * s - 3 * s)} Z" fill="#4e3b28"/>`;
    liste.push({ d, s: m });
  }
  liste.sort((a, b) => b.d - a.d);
  let k = `<g ${fern(2)}>` + liste.map((o) => o.s).join("") + `</g>`;
  /* Battery Park (Bäume) an der Südspitze */
  for (let b = 264; b < 270; b += 0.5) { const d = 1650, x = XM(b), y = HOR + K * (EYE - 14) / d; k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(1 + rnd() * 0.7)}" fill="${rnd() < 0.5 ? "#5f7d4c" : "#4d6a3f"}" ${fern(1)}/>`; }
  /* Heliport an Pier 6: Plattform, ein Hubschrauber */
  {
    const [he, hn] = polar(265.3, 1075), p = PJ(he, hn, 6), s = K / 1075;
    k += `<rect x="${r(p[0] - 30 * s)}" y="${r(p[1])}" width="${r(60 * s)}" height="${r(4 * s)}" fill="#8d8c86"/>`;
    k += `<ellipse cx="${r(p[0] + 6 * s)}" cy="${r(p[1] - 1.5 * s)}" rx="${r(6 * s)}" ry="${r(1.6 * s)}" fill="#c43b2e"/><line x1="${r(p[0] - 2 * s)}" y1="${r(p[1] - 3.6 * s)}" x2="${r(p[0] + 14 * s)}" y2="${r(p[1] - 3.6 * s)}" stroke="#333" stroke-width=".18"/>`;
  }
  /* FDR Drive: aufgeständerte Uferstraße von der Battery bis hinter die Brücken */
  {
    let top = "", unten = "", st = "";
    for (let b = 268; b <= 392; b += 2) {
      const d = b < 300 ? 1150 - (b - 268) * 13 : b < 333 ? 735 - (b - 300) * 2 : 660 + (b - 333) * 4.6;
      const x = XM(b), y1 = HOR + K * (EYE - 13) / d, y2 = HOR + K * (EYE - 11) / d, y0 = HOR + K * (EYE - 1) / d;
      top += `${top ? "L" : "M"}${r(x)} ${r(y1)} `; unten = `L${r(x)} ${r(y2)} ` + unten;
      if (Math.round(b) % 4 === 0) st += `M${r(x)} ${r(y2)} L${r(x)} ${r(y0)} `;
    }
    k += `<path d="${st}" stroke="#7b7b76" stroke-width=".35"/><path d="${top}${unten}Z" fill="#8e8d87"/>`;
  }
  /* Pier 17: Glasbau mit weißem Rahmen und Dachterrasse; davor der Großsegler Wavertree (Pier 16) */
  {
    const d = 621, s = K / d, x = XM(312.8), yb = HOR + K * (EYE - 3) / d;
    k += `<rect x="${r(x - 50 * s)}" y="${r(yb - 22 * s)}" width="${r(100 * s)}" height="${r(22 * s)}" fill="${S.lg("p17", [[0, "#cfe0ea"], [1, "#8fa9b9"]])}"/>`;
    for (let i = 0; i <= 10; i++) k += `<rect x="${r(x - 50 * s + i * 10 * s - 0.2)}" y="${r(yb - 22 * s)}" width=".4" height="${r(22 * s)}" fill="#f4f4f1"/>`;
    k += `<rect x="${r(x - 51 * s)}" y="${r(yb - 23 * s)}" width="${r(102 * s)}" height="${r(1.6 * s)}" fill="#f4f4f1"/><rect x="${r(x - 51 * s)}" y="${r(yb - 11 * s)}" width="${r(102 * s)}" height="${r(1 * s)}" fill="#f4f4f1"/>`;
    for (let i = 0; i < 9; i++) k += `<path d="M${r(x - 40 * s + i * 10 * s)} ${r(yb - 23 * s)} l${r(2 * s)} ${r(-3 * s)} l${r(2 * s)} ${r(3 * s)}" stroke="#e9e9e4" stroke-width=".2" fill="none"/>`;
    k += `<rect x="${r(x - 54 * s)}" y="${r(yb)}" width="${r(108 * s)}" height="${r(3 * s)}" fill="#6a5f52"/>`;
    const wx = XM(307.4), wd = 727, ws = K / wd, wy = HOR + K * EYE / wd;
    k += `<path d="M${r(wx - 40 * ws)} ${r(wy - 4 * ws)} L${r(wx + 42 * ws)} ${r(wy - 4 * ws)} L${r(wx + 38 * ws)} ${r(wy)} L${r(wx - 37 * ws)} ${r(wy)} Z" fill="#2c2a28"/>`;
    for (const [dx, h] of [[-24, 40], [0, 44], [22, 38]]) {
      k += `<line x1="${r(wx + dx * ws)}" y1="${r(wy - 4 * ws)}" x2="${r(wx + dx * ws)}" y2="${r(wy - h * ws)}" stroke="#3b2f22" stroke-width=".28"/>`;
      for (const t of [0.4, 0.6, 0.78, 0.92]) k += `<line x1="${r(wx + dx * ws - 9 * ws * (1.1 - t))}" y1="${r(wy - h * t * ws)}" x2="${r(wx + dx * ws + 9 * ws * (1.1 - t))}" y2="${r(wy - h * t * ws)}" stroke="#3b2f22" stroke-width=".18"/>`;
    }
    k += `<path d="M${r(wx - 40 * ws)} ${r(wy - 4 * ws)} L${r(wx - 24 * ws)} ${r(wy - 40 * ws)} L${r(wx)} ${r(wy - 44 * ws)} L${r(wx + 22 * ws)} ${r(wy - 38 * ws)} L${r(wx + 42 * ws)} ${r(wy - 4 * ws)}" stroke="#5a4c3c" stroke-width=".1" fill="none"/>`;
  }
  const [px, py] = [XM(297.1), HOR + K * (EYE - 3) / 1066];
  S.teil({ id: "skyline", de: "die Skyline", syl: "SKY-line", it: "lo skyline", itSyl: "SKY-line", en: "skyline", x: 0, y: 0, kunst: k,
    tipp: "Die Skyline von Lower Manhattan: Hochhäuser dicht an dicht — hinten das Woolworth Building (1913), vorn am Wasser Pier 17 und der FDR Drive.",
    zoom: { x: r(px - 21), y: r(py - 96), w: 42, h: 28 },
    unter: [
      { id: "wolkenkratzer", de: "der Wolkenkratzer", syl: "WOL-ken-krat-zer", it: "il grattacielo", itSyl: "grat-ta-CIE-lo", en: "skyscraper", x: px, y: py, kunst: flaeche(-6, -103, 12, 103, 0.6),
        tipp: "70 Pine Street ist ein Wolkenkratzer im Art-déco-Stil von 1932 — 290 Meter hoch." },
    ] });
}

/* =====================================================================
   7 — DIE FÄHRE (Staten-Island-Fähre verlässt Whitehall, 1,4 km)
   ===================================================================== */
{
  const d = 1400, s = K / d, X = XM(262), Y = HOR + K * EYE / d;
  const OR = S.lg("orange", [[0, "#ff9a3c"], [1, "#d8600f"]]);
  let k = `<path d="M${r(-40 * s)} 0 q${r(30 * s)} ${r(2 * s)} ${r(80 * s)} 0" stroke="#eef5f7" stroke-width=".3" fill="none" opacity=".8"/>`;
  k += `<path d="M${r(-36 * s)} ${r(-5 * s)} L${r(36 * s)} ${r(-5 * s)} L${r(33 * s)} 0 L${r(-33 * s)} 0 Z" fill="${OR}"/>`;
  k += `<rect x="${r(-34 * s)}" y="${r(-3.4 * s)}" width="${r(68 * s)}" height="${r(0.8 * s)}" fill="#1d2228" opacity=".8"/>`;
  k += `<path d="M${r(-30 * s)} ${r(-5 * s)} L${r(-29 * s)} ${r(-11 * s)} L${r(29 * s)} ${r(-11 * s)} L${r(30 * s)} ${r(-5 * s)} Z" fill="#f08a2c"/>`;
  for (let i = 0; i < 12; i++) k += `<rect x="${r(-27 * s + i * 4.6 * s)}" y="${r(-9.6 * s)}" width="${r(3 * s)}" height="${r(2.4 * s)}" fill="#2b3640"/>`;
  k += `<path d="M${r(-22 * s)} ${r(-11 * s)} L${r(-21 * s)} ${r(-15 * s)} L${r(21 * s)} ${r(-15 * s)} L${r(22 * s)} ${r(-11 * s)} Z" fill="#f5913a"/>`;
  for (const sx of [-1, 1]) k += `<rect x="${r(sx < 0 ? -20 * s : 11 * s)}" y="${r(-18 * s)}" width="${r(9 * s)}" height="${r(3 * s)}" fill="#f7a04c"/>`;
  k += `<rect x="${r(-0.4)}" y="${r(-24 * s)}" width=".8" height="${r(9 * s)}" fill="#e9e9e6"/>`;
  S.teil({ id: "faehre", de: "die Fähre", syl: "FÄH-re", it: "il traghetto", itSyl: "tra-GHET-to", en: "ferry", x: X, y: Y, kunst: `<g ${fern(1)}>${k}</g>` + flaeche(-12, -8, 24, 9, 0.6),
    tipp: "Die orange Fähre nach Staten Island ist kostenlos und fährt an der Freiheitsstatue vorbei." });
}

/* =====================================================================
   8 — DIE MANHATTAN BRIDGE (1909): blaugraue Stahlpfeiler, hinter der
   Brooklyn Bridge; Manhattan-Pfeiler ≈ 20°/1,0 km (?), Brooklyn-Pfeiler
   ≈ 63°/0,64 km (?) — rechts hinter den Häusern
   ===================================================================== */
{
  const MM = polar(381.8, 1000), MB = polar(423.1, 639);
  const ax = [MM[0] - MB[0], MM[1] - MB[1]], La = Math.hypot(ax[0], ax[1]), u = [ax[0] / La, ax[1] / La], p = [u[1], -u[0]];
  const BL = S.lg("mbblau", [[0, "#9db2c2"], [0.5, "#7f97a9"], [1, "#5f7486"]], 0, 0, 1, 0);
  let k = "";
  const pt = (t, q, z) => PJ(MB[0] + u[0] * La * t + p[0] * q, MB[1] + u[1] * La * t + p[1] * q, z);
  /* Fahrbahn (zwei Ebenen, tiefes Fachwerk) */
  let o = "", un = "";
  for (let i = 0; i <= 20; i++) { const t = i / 20; o += `${o ? "L" : "M"}${pr(pt(t, -18, 43))} `; un = `L${pr(pt(t, -18, 33))} ` + un; }
  k += `<path d="${o}${un}Z" fill="#5f7080"/>`;
  let fw = "";
  for (let i = 0; i <= 40; i++) { const t = i / 40, a = pt(t, -18, 43), b = pt(t + (i % 2 ? 0.025 : -0.025), -18, 33); fw += `M${pr(a)} L${pr(b)} `; }
  k += `<path d="${fw}" stroke="#3e4a55" stroke-width=".18" fill="none"/>`;
  /* Seitenfeld nach Manhattan (links) und die Tragkabel */
  const kab = (q, w, c) => { let s = ""; for (let i = 0; i <= 30; i++) { const t = i / 30, z = 52 + 46 * Math.pow(2 * t - 1, 2); s += `${s ? "L" : "M"}${pr(pt(t, q, z))} `; } for (let i = 1; i <= 12; i++) { const t = 1 + i / 12 * 0.55, z = 98 - (98 - 24) * (i / 12) - 4 * Math.sin(Math.PI * i / 12); s += `L${pr(pt(t, q, z))} `; } return `<path d="${s}" stroke="${c}" stroke-width="${w}" fill="none"/>`; };
  k += kab(16, 0.35, "#6c7c88") + kab(-16, 0.45, "#56636d");
  let sd = "", su = "";
  for (let i = 0; i <= 16; i++) { const t = 1 + i / 16 * 0.95; sd += `${sd ? "L" : "M"}${pr(pt(t, -18, 43 - 33 * i / 16))} `; su = `L${pr(pt(t, -18, 35 - 33 * i / 16))} ` + su; }
  k += `<path d="${sd}${su}Z" fill="#5f7080"/>`;
  let h = "";
  for (let i = 1; i < 30; i++) { const t = i / 30, z = 52 + 46 * Math.pow(2 * t - 1, 2); if (z > 46) h += `M${pr(pt(t, -16, z))} L${pr(pt(t, -16, 43))} `; }
  k += `<path d="${h}" stroke="#6c7c88" stroke-width=".12" fill="none" pointer-events="none"/>`;
  /* die Stahlpfeiler: zwei Beine, Kreuzverbände, oben der Zierbogen mit Kugeln */
  const pfeiler = (P0) => {
    const L = lokal(P0[0], P0[1]);
    let s = "";
    const bein = (q) => { const a = L.p(p[0] * q, p[1] * q, 0), b = L.p(p[0] * q, p[1] * q, 98), w = K * 6 / L.d; return `<path d="M${r(a[0] - w * 0.6)} ${r(a[1])} L${r(b[0] - w / 2)} ${r(b[1])} L${r(b[0] + w / 2)} ${r(b[1])} L${r(a[0] + w * 0.6)} ${r(a[1])} Z" fill="${BL}"/>`; };
    s += bein(-15) + bein(15);
    const A = (q, z) => L.p(p[0] * q, p[1] * q, z);
    for (const [z0, z1] of [[46, 62], [62, 78], [78, 92]]) s += `<path d="M${pr(A(-15, z0))} L${pr(A(15, z1))} M${pr(A(15, z0))} L${pr(A(-15, z1))}" stroke="#6e8597" stroke-width="${r(K * 1.2 / L.d)}"/>`;
    s += `<path d="M${pr(A(-17, 92))} Q${pr(A(0, 106))} ${pr(A(17, 92))} L${pr(A(17, 96))} Q${pr(A(0, 110))} ${pr(A(-17, 96))} Z" fill="${BL}"/>`;
    for (const q of [-15, 15]) { const c = A(q, 101); s += `<circle cx="${r(c[0])}" cy="${r(c[1])}" r="${r(K * 1.8 / L.d)}" fill="#8aa0b0"/>`; }
    return s;
  };
  k += pfeiler(MM);   /* der Brooklyn-Pfeiler der Manhattan Bridge steht rechts außerhalb des Bildes */
  /* die Verankerung in Manhattan (Steinblock) — dorthin laufen die zwei Kabelpaare */
  { const a = pt(1.55, -20, 0), b = pt(1.62, 20, 30), c = pt(1.55, -20, 30); k += `<path d="M${pr(a)} L${pr([b[0], a[1]])} L${pr(b)} L${pr(c)} Z" fill="#a49a88"/>`; }
  /* davor Wohnblocks der Lower East Side (Two Bridges): dahinter verschwindet die Rampe */
  for (const [t, w, h] of [[1.62, 34, 52], [1.78, 30, 44], [1.92, 36, 58]]) { const f = pt(t, 30, 0), d0 = Math.hypot(MB[0] + u[0] * La * t, MB[1] + u[1] * La * t), sc = K / d0, yb = HOR + K * (EYE - 3) / d0;
    k += `<rect x="${r(f[0] - w * sc / 2)}" y="${r(yb - h * sc)}" width="${r(w * sc)}" height="${r(h * sc)}" fill="${VERL.ziegel}"/><rect x="${r(f[0] - w * sc / 2)}" y="${r(yb - h * sc)}" width="${r(w * sc)}" height="${r(h * sc)}" fill="url(#${S.id("steinr")})"/>`; }
  S.teil({ id: "manhattan_bridge", de: "die Manhattan Bridge", syl: "man-HAT-tan BRIDGE", it: "il ponte di Manhattan", itSyl: "PON-te di man-HAT-tan", en: "Manhattan Bridge", x: 0, y: 0, kunst: `<g ${fern(1)}>${k}</g>`,
    tipp: "Über die Manhattan Bridge fahren Autos und auch U-Bahnen über den East River." });
}

/* =====================================================================
   10 — DAS BACKSTEINHAUS an der Fulton Ferry (310 m) mit Feuertreppe und
   hölzernem Wassertank; links dahinter die Empire Stores (1870er, 430 m,
   fünf Geschosse à 4,5 m, Rundbogenfenster mit Eisenläden). Beide stehen
   an Land HINTER dem Brooklyn-Pfeiler (der sie verdeckt) über einer
   Kaimauer mit Geländer und dem hölzernen Fulton-Ferry-Anleger.
   ===================================================================== */
{
  const ZIEGEL = S.lg("ziegelf", [[0, "#c0603f"], [0.5, "#a94f33"], [1, "#8a3f27"]], 0, 0, 1, 0);
  let k = "";
  /* Empire Stores */
  {
    const d = 430, s = K / d, x0 = XM(397), x1 = XM(407.5), yb = HOR + K * (EYE - 3) / d, h = 22.5 * s;
    k += `<rect x="${r(x0)}" y="${r(yb - h)}" width="${r(x1 - x0)}" height="${r(h)}" fill="${S.lg("lager", [[0, "#b1694b"], [1, "#8c4a33"]], 0, 0, 1, 0)}"/><rect x="${r(x0)}" y="${r(yb - h)}" width="${r(x1 - x0)}" height="${r(h)}" fill="url(#${S.id("ziegel")})"/>`;
    k += `<rect x="${r(x0)}" y="${r(yb - h + 0.6)}" width="${r(x1 - x0)}" height="${r(2.2 * s)}" fill="#e9dcc0" opacity=".85"/><text x="${r((x0 + x1) / 2)}" y="${r(yb - h + 0.6 + 1.75 * s)}" font-size="${r(1.9 * s)}" text-anchor="middle" fill="#3b2a20" font-family="Georgia,serif" font-weight="bold" textLength="${r((x1 - x0) * 0.8)}" lengthAdjust="spacingAndGlyphs">EMPIRE STORES</text>`;
    let fe = "", la = "";
    for (let i = 0; i < 4; i++) for (let x = x0 + 1.6 * s; x < x1 - 2 * s; x += 4.6 * s) { const fy = yb - h + 4.6 * s + i * 4.5 * s, fw = 1.6 * s, fh = 2.6 * s;
      fe += `M${r(x)} ${r(fy + fh)} V${r(fy + fw / 2)} Q${r(x + fw / 2)} ${r(fy - fw * 0.15)} ${r(x + fw)} ${r(fy + fw / 2)} V${r(fy + fh)} Z`;
      la += `M${r(x - 0.75 * s)} ${r(fy + 0.4 * s)} h${r(0.65 * s)} v${r(fh - 0.4 * s)} h${r(-0.65 * s)} Z M${r(x + fw + 0.1 * s)} ${r(fy + 0.4 * s)} h${r(0.65 * s)} v${r(fh - 0.4 * s)} h${r(-0.65 * s)} Z`; }
    k += `<path d="${fe}" fill="#2f2c2a"/><path d="${la}" fill="#2f4a3c"/>`;
    k += `<rect x="${r(x0)}" y="${r(yb - h)}" width="${r(x1 - x0)}" height="${r(h)}" fill="${S.lg("lagerlicht", [[0, "#fff4dc", 0.14], [1, "#000", 0.1]], 0, 0, 1, 0)}"/>`;
  }
  /* das Backsteinhaus (fünf Geschosse, 20 m breit) */
  const d = 310, s = K / d, X = XM(412), YB = HOR + K * (EYE - 3) / d, W = 20 * s, H = 18.5 * s;
  k += `<rect x="${r(X - W / 2)}" y="${r(YB - H)}" width="${r(W)}" height="${r(H)}" fill="${ZIEGEL}"/>`;
  k += `<rect x="${r(X - W / 2)}" y="${r(YB - H)}" width="${r(W)}" height="${r(H)}" fill="url(#${S.id("ziegel")})"/>`;
  k += `<rect x="${r(X - W / 2 - 0.5)}" y="${r(YB - H - 1.4)}" width="${r(W + 1)}" height="1.8" fill="${S.lg("gesims", [[0, "#5a6b62"], [1, "#2e3a34"]])}"/>`;
  for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) {
    const fx = X - W / 2 + 1.6 * s + j * 4.8 * s, fy = YB - H + 1.4 * s + i * 3.4 * s;
    k += `<rect x="${r(fx)}" y="${r(fy)}" width="${r(1.6 * s)}" height="${r(2.2 * s)}" fill="#34414b"/><rect x="${r(fx - 0.2)}" y="${r(fy - 0.5)}" width="${r(1.6 * s + 0.4)}" height=".5" fill="#e3d6bd"/>`;
  }
  k += `<rect x="${r(X - W / 2)}" y="${r(YB - 4 * s)}" width="${r(W)}" height="${r(4 * s)}" fill="#3a2a22"/><rect x="${r(X - W / 2 + 1)}" y="${r(YB - 3.4 * s)}" width="${r(9 * s)}" height="${r(2.8 * s)}" fill="#e3cf96" opacity=".8"/>`;
  k += `<rect x="${r(X - W / 2)}" y="${r(YB - H)}" width="${r(W)}" height="${r(H)}" fill="${S.lg("hauslicht", [[0, "#fff4dc", 0.16], [1, "#000", 0.12]], 0, 0, 1, 0)}"/>`;
  /* Feuertreppe: Balkone mit Gitter, schräge Leitern dazwischen */
  let ft = "";
  const fx0 = X + 0.6 * s, fx1 = fx0 + 8.6 * s;
  for (let i = 1; i < 5; i++) {
    const y = YB - H + 1.4 * s + i * 3.4 * s + 2.4 * s;
    ft += `<rect x="${r(fx0)}" y="${r(y)}" width="${r(fx1 - fx0)}" height=".35" fill="#1d1f1e"/><path d="M${r(fx0)} ${r(y)} V${r(y - 1.6)} H${r(fx1)} V${r(y)}" stroke="#1d1f1e" stroke-width=".18" fill="none"/>`;
    for (let xx = fx0 + 0.5; xx < fx1; xx += 0.55) ft += `<line x1="${r(xx)}" y1="${r(y - 1.6)}" x2="${r(xx)}" y2="${r(y)}" stroke="#1d1f1e" stroke-width=".07"/>`;
    if (i < 4) ft += `<path d="M${r(fx1 - 1)} ${r(y + 0.3)} L${r(fx0 + 3)} ${r(y + 3.4 * s)}" stroke="#1d1f1e" stroke-width=".22"/>`;
  }
  k += ft;
  /* Wassertank auf dem Dach */
  const TX = X - 2.6 * s, TY = YB - H - 1.4;
  let wt = "";
  for (const dx of [-2, -0.7, 0.7, 2]) wt += `<rect x="${r(TX + dx * s - 0.15)}" y="${r(TY - 3 * s)}" width=".3" height="${r(3 * s)}" fill="#2e3230"/>`;
  wt += `<path d="M${r(TX - 2.2 * s)} ${r(TY - 3 * s)} L${r(TX - 2.2 * s)} ${r(TY - 8 * s)} Q${r(TX)} ${r(TY - 8.3 * s)} ${r(TX + 2.2 * s)} ${r(TY - 8 * s)} L${r(TX + 2.2 * s)} ${r(TY - 3 * s)} Q${r(TX)} ${r(TY - 2.8 * s)} ${r(TX - 2.2 * s)} ${r(TY - 3 * s)} Z" fill="${S.lg("fass", [[0, "#b49470"], [0.35, "#8a6a45"], [1, "#4f3a25"]], 0, 0, 1, 0)}"/>`;
  for (let i = 1; i < 5; i++) wt += `<path d="M${r(TX - 2.2 * s)} ${r(TY - 3 * s - i * s)} Q${r(TX)} ${r(TY - 2.8 * s - i * s)} ${r(TX + 2.2 * s)} ${r(TY - 3 * s - i * s)}" stroke="#2c2c2a" stroke-width=".14" fill="none"/>`;
  wt += `<path d="M${r(TX - 2.5 * s)} ${r(TY - 8 * s)} L${r(TX)} ${r(TY - 9.6 * s)} L${r(TX + 2.5 * s)} ${r(TY - 8 * s)} Z" fill="#5a4836"/>`;
  k += wt;
  /* Kaimauer mit Geländer und der hölzerne Fulton-Ferry-Anleger */
  {
    const yo = HOR + K * (EYE - 1.6) / 300, yw = HOR + K * EYE / 300, yg = HOR + K * (EYE - 2.7) / 300;
    k += `<rect x="336" y="${r(yo)}" width="64" height="${r(yw - yo)}" fill="${S.lg("kai", [[0, "#b9b2a5"], [1, "#8e877b"]])}"/><rect x="336" y="${r(yo - 1.6)}" width="64" height="1.6" fill="#7d8a6a"/>`;
    k += `<path d="M336 ${r(yg)} H400" stroke="#2a2e2c" stroke-width=".25"/>`;
    let gp = ""; for (let x = 337; x < 400; x += 1.5) gp += `M${x} ${r(yg)} V${r(yo - 1.6)} `; k += `<path d="${gp}" stroke="#2a2e2c" stroke-width=".12"/>`;
    const ya = HOR + K * (EYE - 1.4) / 262, ywa = HOR + K * EYE / 262;
    k += `<path d="M379 ${r(yo)} L400 ${r(yo)} L400 ${r(ya)} L376 ${r(ya)} Z" fill="#8a6a48"/><path d="M376 ${r(ya)} H400" stroke="#5a4430" stroke-width=".4"/>`;
    let pf = ""; for (let x = 378; x < 400; x += 2.2) pf += `M${x} ${r(ya)} V${r(ywa)} `; k += `<path d="${pf}" stroke="#4a3828" stroke-width=".35"/>`;
  }
  S.teil({ id: "backsteinhaus", de: "das Backsteinhaus", syl: "BACK-stein-haus", it: "la casa di mattoni", itSyl: "CA-sa di mat-TO-ni", en: "brick building", x: 0, y: 0, kunst: k,
    tipp: "In Brooklyn stehen viele alte Lagerhäuser aus rotem Backstein, wie die Empire Stores. Heute gibt es dort Läden und Büros.",
    zoom: { x: 344, y: r(TY - 14), w: 54, h: 36 },
    unter: [
      { id: "wassertank", de: "der Wassertank", syl: "WAS-ser-tank", it: "il serbatoio d'acqua", itSyl: "ser-ba-TO-io d'AC-qua", en: "water tower", x: TX, y: TY, kunst: flaeche(-2.6 * s, -9.8 * s, 5.2 * s, 9.8 * s, 0.4),
        tipp: "Auf vielen Dächern in New York steht ein Wassertank aus Holz. Er gibt den oberen Stockwerken Wasserdruck." },
      { id: "feuertreppe", de: "die Feuertreppe", syl: "FEU-er-trep-pe", it: "la scala antincendio", itSyl: "SCA-la an-tin-CEN-dio", en: "fire escape", x: (fx0 + fx1) / 2, y: YB - 4 * s, kunst: flaeche(-(fx1 - fx0) / 2, -12.6 * s, fx1 - fx0, 11.8 * s, 0.4),
        tipp: "Bei Feuer klettert man über die Feuertreppe außen am Haus hinunter." },
    ] });
}

/* =====================================================================
   9 — DIE BROOKLYN BRIDGE als 3-D-Modell (Achse 304°, Pfeiler 84 m)
   ===================================================================== */
{
  const ax = [BBM[0] - BBB[0], BBM[1] - BBB[1]], La = Math.hypot(ax[0], ax[1]), u = [ax[0] / La, ax[1] / La], p = [u[1], -u[0]];
  const LB = lokal(BBB[0], BBB[1]), LM = lokal(BBM[0], BBM[1]);
  /* Punkte: t = 0 Brooklyn-Pfeiler, 1 Manhattan-Pfeiler, <0 / >1 Seitenfelder; q quer (− = Südwest, zu uns) */
  const W3 = (t, q) => [BBB[0] + u[0] * La * t + p[0] * q, BBB[1] + u[1] * La * t + p[1] * q];
  /* an den Pfeilern echter Maßstab, dazwischen gestauchte Richtung — weich überblendet */
  /* Korrektur = (lokaler Pfeiler-Maßstab − gestauchte Richtung) an beiden Pfeilern, dazwischen linear überblendet */
  const korr = (tt, q, z) => { const [e, n] = W3(tt, q), a = PJ(e, n, z), Lx = tt === 0 ? LB : LM, P0 = tt === 0 ? BBB : BBM, b = Lx.p(e - P0[0], n - P0[1], z); return [b[0] - a[0], b[1] - a[1]]; };
  const pt = (t, q, z) => {
    const [e, n] = W3(t, q), a = PJ(e, n, z);
    const c0 = korr(0, q, z), c1 = korr(1, q, z);
    const w0 = t <= 0 ? Math.max(0, 1 + t / 0.6) : t >= 1 ? 0 : 1 - t, w1 = t >= 1 ? Math.max(0, 1 - (t - 1) / 0.6) : t <= 0 ? 0 : t;
    return [a[0] + c0[0] * w0 + c1[0] * w1, a[1] + c0[1] * w0 + c1[1] * w1];
  };
  const deckZ = (t) => (t >= 0 && t <= 1) ? 36 + 5 * Math.sin(Math.PI * t) : 36 - 6 * Math.min(1, (t < 0 ? -t : t - 1) / 0.6);
  const kabZ = (t) => (t >= 0 && t <= 1) ? 44 + 38 * Math.pow(2 * t - 1, 2) : 82 - 56 * Math.min(1, (t < 0 ? -t : t - 1) / 0.592) - 5 * Math.sin(Math.PI * Math.min(1, (t < 0 ? -t : t - 1) / 0.592));
  let k = "";
  const linie = (t0, t1, n, f) => { let s = ""; for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; s += `${s ? "L" : "M"}${pr(f(t))} `; } return s; };
  /* Fahrbahn mit Versteifungsträger (vordere Kante q = −13), von der Manhattan-Rampe bis zum Brooklyn-Seitenfeld */
  const deck = (t0, t1, n) => { const o = linie(t0, t1, n, (t) => pt(t, -13, deckZ(t))); let un = ""; for (let i = n; i >= 0; i--) { const t = t0 + (t1 - t0) * i / n; un += `L${pr(pt(t, -13, deckZ(t) - 5.5))} `; } return `<path d="${o}${un}Z" fill="${S.lg("deck", [[0, "#6a6156"], [1, "#3d362e"]])}"/>`; };
  let tR = 0; while (tR > -0.6 && pt(tR - 0.01, -13, deckZ(tR - 0.01))[0] < 401) tR -= 0.01;
  let tK = 0; while (tK > -0.6 && pt(tK - 0.01, -12, kabZ(tK - 0.01))[0] < 401) tK -= 0.01;
  /* Zeichenfolge nach Tiefe: Seitenfeld Manhattan (hinter dem fernen Pfeiler) → ferner Pfeiler →
     Hauptfeld (kommt auf uns zu, liegt VOR der Brooklyn-Seite des fernen Pfeilers; die Fahrbahn
     läuft in die Spitzbögen, die Kabel über die Sättel oben) → Seitenfeld Brooklyn → naher Pfeiler */
  const tKq = (q) => { let t = 0; while (t > -0.6 && pt(t - 0.01, q, kabZ(t - 0.01))[0] < 401) t -= 0.01; return t; };
  const fachwerk = (t0, t1, n) => { let f = ""; for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; f += `M${pr(pt(t, -13, deckZ(t) - 0.3))} L${pr(pt(Math.min(t1, t + 0.01), -13, deckZ(t) - 5.3))} `; } return `<path d="${f}" stroke="#2c2620" stroke-width=".14" fill="none"/>`; };
  const kante = (t0, t1, n) => `<path d="${linie(t0, t1, n, (t) => pt(t, -13, deckZ(t) + 0.2))}" stroke="#9a8f80" stroke-width=".3" fill="none"/>`;
  const KAB = [[12, 0.3, "#7a7a73"], [4, 0.3, "#706f69"], [-4, 0.4, "#55544e"], [-12, 0.55, "#45443e"]];
  const kabel = (t0f, t1, n) => KAB.map(([q, w, c]) => `<path d="${linie(typeof t0f === "function" ? t0f(q) : t0f, t1, n, (t) => pt(t, q, kabZ(t)))}" stroke="${c}" stroke-width="${w}" fill="none"/>`).join("");
  /* Hänger: im Hauptfeld alle 7,6 m (in der Projektion zum fernen Pfeiler hin dichter), Schrägseile von den Pfeilerköpfen */
  let hgM = "", hgB = "", hgS = "";
  for (let m = 7.6; m < La - 4; m += 7.6) { const t = m / La; if (kabZ(t) > deckZ(t) + 1.2) hgM += `M${pr(pt(t, -12, kabZ(t)))} L${pr(pt(t, -12, deckZ(t)))} `; }
  for (let m = 7.6; m < 280; m += 15.2) { const t = -m / La; if (t > tR && kabZ(t) > deckZ(t) + 1) hgB += `M${pr(pt(t, -12, kabZ(t)))} L${pr(pt(t, -12, deckZ(t)))} `; }
  for (let i = 1; i <= 9; i++) {
    const m = i * 14;
    hgM += `M${pr(pt(0, -12, 80))} L${pr(pt(m / La, -12, deckZ(m / La)))} M${pr(pt(1, -12, 80))} L${pr(pt(1 - m / La, -12, deckZ(1 - m / La)))} `;
    if (-m / La > tR + 0.02) hgB += `M${pr(pt(0, -12, 80))} L${pr(pt(-m / La, -12, deckZ(-m / La)))} `;
    hgS += `M${pr(pt(1, -12, 80))} L${pr(pt(1 + m / La, -12, deckZ(1 + m / La)))} `;
  }
  const seile = (h) => `<path d="${h}" stroke="#5c5a54" stroke-width=".13" fill="none" opacity=".9" pointer-events="none"/>`;
  const SM = deck(1, 1.45, 10) + fachwerk(1, 1.3, 12) + kante(1, 1.45, 10) + kabel(1, 1.6, 24) + seile(hgS);
  const SH = deck(0, 0.981, 40) + fachwerk(0, 0.98, 36) + kante(0, 0.981, 36) + kabel(0, 1, 50) + seile(hgM);
  const SB = deck(tR, 0, 12) + fachwerk(tR, 0, 14) + kante(tR, 0, 12) + kabel(tKq, 0, 24) + seile(hgB);
  /* die Pfeiler als Steinblöcke: 43 m quer (q), 18 m längs (t), 84 m hoch */
  const STEIN = S.lg("bstein", [[0, "#f1e6d2"], [0.5, "#dccbb0"], [1, "#bba788"]], 0, 0, 1, 0);
  const STEIN_S = S.lg("bsteins", [[0, "#c7b496"], [1, "#a4917a"]], 0, 0, 1, 0);
  const DURCH = S.lg("durch", [[0, "#a9c3d6"], [1, "#d3e0e8"]]);
  const pfeiler = (L, P0, istM) => {
    const A = (dl, dq, z) => L.p(u[0] * dl + p[0] * dq, u[1] * dl + p[1] * dq, z);
    const poly = (pts) => `M${pts.map(pr).join(" L")} Z`;
    let s = "";
    /* sichtbare Flächen: Schmalseite Südwest (q = −21,5) und Breitseite Südost (Brooklyn-Seite, l = −9) */
    const sw = [A(-9, -21.5, 0), A(9, -21.5, 0), A(9, -21.5, 84), A(-9, -21.5, 84)];
    const se = [A(-9, -21.5, 0), A(-9, 21.5, 0), A(-9, 21.5, 84), A(-9, -21.5, 84)];
    s += `<path d="${poly(se)}" fill="${STEIN}"/>`;
    s += `<path d="${poly(sw)}" fill="${STEIN_S}"/>`;
    /* Steinlagen */
    let lg = "";
    for (let z = 6; z < 80; z += 4.2) { lg += `M${pr(A(-9, -21.5, z))} L${pr(A(9, -21.5, z))} M${pr(A(-9, -21.5, z))} L${pr(A(-9, 21.5, z))} `; }
    s += `<path d="${lg}" stroke="#9c8869" stroke-width=".1" opacity=".55" fill="none"/>`;
    /* Spitzbögen in der Breitseite (q = ±10,5, 10,4 m breit, Scheitel 72 m): Leibung, Durchblick, Fahrbahn */
    for (const qc of istM ? [-10.5, 10.5] : []) {
      const umriss = (l) => { const pts = []; for (let i = 0; i <= 8; i++) { const a = i / 8; pts.push(A(l, qc - 5.2, 36 + a * 28)); } for (let i = 0; i <= 10; i++) { const a = i / 10 * Math.PI / 2; pts.push(A(l, qc - 5.2 + 10.4 * (1 - Math.cos(a)) / 2 * 1, 64 + 8 * Math.sin(a))); } for (let i = 10; i >= 0; i--) { const a = i / 10 * Math.PI / 2; pts.push(A(l, qc + 5.2 - 10.4 * (1 - Math.cos(a)) / 2, 64 + 8 * Math.sin(a))); } for (let i = 8; i >= 0; i--) { const a = i / 8; pts.push(A(l, qc + 5.2, 36 + a * 28)); } return pts; };
      const nah = umriss(-9), weit = umriss(9);
      const cid = S.id("bogen" + (istM ? "m" : "b") + (qc < 0 ? "l" : "r"));
      S.def(`<clipPath id="${cid}"><path d="${poly(nah)}"/></clipPath>`);
      s += `<path d="${poly(nah)}" fill="#8c7a60"/>`;
      s += `<g clip-path="url(#${cid})"><path d="${poly(weit)}" fill="${DURCH}"/><path d="${poly([A(-9, qc - 6, 31), A(9, qc - 6, 31), A(9, qc - 6, 36.5), A(-9, qc - 6, 36.5)])}" fill="#3f382f"/><path d="${poly([A(-9, qc + 6, 31), A(9, qc + 6, 31), A(9, qc + 6, 36.5), A(-9, qc + 6, 36.5)])}" fill="#4a4238"/><path d="${poly([A(-9, qc - 5.2, 36), A(-9, qc + 5.2, 36), A(-9, qc + 5.2, 38.2), A(-9, qc - 5.2, 38.2)])}" fill="#5a5148"/><path d="${poly([A(-9, qc - 5.2, 38.2), A(-9, qc + 5.2, 38.2), A(-9, qc + 5.2, 38.6), A(-9, qc - 5.2, 38.6)])}" fill="#d9cfbf"/></g>`;
      s += `<path d="M${umriss(-9).slice(8, 31).map(pr).join(" L")}" stroke="#a48f6f" stroke-width="${r(K * 0.5 / L.d)}" fill="none"/>`;
    }
    /* Gliederung der Schmalseite: Band in Fahrbahnhöhe, zwei vertiefte Felder, Pilaster */
    s += `<path d="${poly([A(-9.3, -21.8, 34), A(9.3, -21.8, 34), A(9.3, -21.8, 37), A(-9.3, -21.8, 37)])}" fill="#e3d4ba"/>`;
    for (const [z0, z1] of [[40, 74], [8, 30]]) s += `<path d="${poly([A(-5, -21.6, z0), A(5, -21.6, z0), A(5, -21.6, z1), A(-5, -21.6, z1)])}" fill="#8e7c62" opacity=".35"/><path d="${poly([A(-5, -21.6, z1), A(5, -21.6, z1), A(5, -21.6, z1 - 0.8), A(-5, -21.6, z1 - 0.8)])}" fill="#5e5140" opacity=".35"/>`;
    s += `<path d="${poly([A(-9, -21.5, 0), A(-9, -21.5, 84), A(-7.6, -21.5, 84), A(-7.6, -21.5, 0)])}" fill="#fff" opacity=".12"/>`;
    /* Gesims oben, Sockel im Wasser */
    s += `<path d="${poly([A(-9.6, -22, 78), A(-9.6, 22, 78), A(-9.6, 22, 81), A(-9.6, -22, 81)])}" fill="#f6ecdb"/><path d="${poly([A(-9.6, -22, 78), A(9.6, -22, 78), A(9.6, -22, 81), A(-9.6, -22, 81)])}" fill="#e2d4bd"/>`;
    s += `<path d="${poly([A(-9, -21.5, 81), A(9, -21.5, 81), A(9, -21.5, 84), A(-9, -21.5, 84)])}" fill="#cdb999"/><path d="${poly([A(-9, -21.5, 81), A(-9, 21.5, 81), A(-9, 21.5, 84), A(-9, -21.5, 84)])}" fill="#dccbab"/>`;
    s += `<path d="${poly([A(-11, -24, 0), A(11, -24, 0), A(11, -24, 5), A(-11, -24, 5)])}" fill="#b9a888"/><path d="${poly([A(-11, -24, 0), A(-11, 24, 0), A(-11, 24, 5), A(-11, -24, 5)])}" fill="#cbbb9c"/>`;
    /* Fahnenmast mit US-Flagge (die Kabelsättel liegen im Mauerwerk, man sieht sie nicht) */
    const f0 = A(0, 0, 84), f1 = A(0, 0, 96), fh = K * 3.6 / L.d, fw2 = K * 6 / L.d;
    let fl = `<rect x="${r(f1[0])}" y="${r(f1[1])}" width="${r(fw2)}" height="${r(fh)}" fill="#b22234"/>`;
    for (let i = 1; i < 7; i += 2) fl += `<rect x="${r(f1[0])}" y="${r(f1[1] + i * fh / 7)}" width="${r(fw2)}" height="${r(fh / 7)}" fill="#fff"/>`;
    fl += `<rect x="${r(f1[0])}" y="${r(f1[1])}" width="${r(fw2 * 0.42)}" height="${r(fh * 4 / 7)}" fill="#3c3b6e"/>`;
    s += `<line x1="${r(f0[0])}" y1="${r(f0[1])}" x2="${r(f1[0])}" y2="${r(f1[1] - 0.3)}" stroke="#9aa1a6" stroke-width="${r(Math.max(0.18, K * 0.35 / L.d))}"/>${fl}`;
    /* Morgensonne von Südosten: Breitseite hell, Schmalseite im Streiflicht */
    s += `<path d="${poly(sw)}" fill="#3a2f22" opacity=".12"/>`;
    return { s, A };
  };
  const PM = pfeiler(LM, BBM, true), PB = pfeiler(LB, BBB, false);
  k += SM + PM.s + SH + SB + PB.s;
  const bogen = LM.p(-9 * u[0] - 10.5 * p[0], -9 * u[1] - 10.5 * p[1], 50), fahne = LM.p(0, 0, 94), seil = pt(0.86, -12, kabZ(0.86));
  const [mx0, my0] = LM.p(0, 0, 60);
  S.teil({ id: "brooklyn_bridge", de: "die Brooklyn Bridge", syl: "BROOK-lyn BRIDGE", it: "il ponte di Brooklyn", itSyl: "PON-te di BROOK-lyn", en: "Brooklyn Bridge",
    x: 0, y: 0, kunst: k, tipp: "Die Brooklyn Bridge (1883) war die erste Hängebrücke mit Stahlseilen. Oben in der Mitte gibt es einen Fußweg.",
    zoom: { x: r(mx0 - 24), y: r(my0 - 22), w: 48, h: 32 },
    unter: [
      { id: "spitzbogen", de: "der Spitzbogen", syl: "SPITZ-bo-gen", it: "l'arco a sesto acuto", itSyl: "AR-co a SES-to a-CU-to", en: "pointed arch", x: bogen[0], y: bogen[1], kunst: flaeche(-2.4, -10, 4.8, 18, 0.4),
        tipp: "Die Spitzbögen der Pfeiler sehen aus wie die Fenster einer gotischen Kirche. Die Fahrbahn führt hindurch." },
      { id: "stahlseil", de: "das Stahlseil", syl: "STAHL-seil", it: "il cavo d'acciaio", itSyl: "CA-vo d'AC-cia-io", en: "steel cable", x: seil[0], y: seil[1], kunst: flaeche(-4, -3, 8, 6, 0.4),
        tipp: "Jedes der vier Stahlseile besteht aus 5434 Drähten." },
      { id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: fahne[0], y: fahne[1], kunst: flaeche(-1, -2.6, 5, 4, 0.3),
        tipp: "Die Flagge der USA hat 50 Sterne und 13 Streifen." },
    ] });
}

/* =====================================================================
   11 — DAS GELÄNDER an der Kaikante (33 m vor uns, 1,1 m hoch)
   ===================================================================== */
{
  const Y = 200, s = um(Y);
  let k = `<rect x="0" y="-1.2" width="400" height="1.6" fill="${S.lg("kante", [[0, "#e6e0d4"], [1, "#a8a094"]])}"/>`;
  const oben = -1.1 * s;
  k += `<rect x="0" y="${r(oben - 0.6)}" width="400" height="1.4" rx=".6" fill="${S.lg("handlauf", [[0, "#c39b6c"], [0.5, "#9a7148"], [1, "#6f4f30"]])}"/>`;
  k += `<rect x="0" y="${r(oben * 0.55)}" width="400" height=".4" fill="#2a2e2c"/><rect x="0" y="${r(oben * 0.18)}" width="400" height=".4" fill="#2a2e2c"/>`;
  for (let x = 6; x < 400; x += 2 * s) k += `<rect x="${r(x - 0.55)}" y="${r(oben)}" width="1.1" height="${r(-oben)}" fill="${EISEN}"/>`;
  k += `<rect x="0" y="${r(oben - 0.6)}" width="400" height=".35" fill="#f2d7ac" opacity=".7"/>`;
  S.teil({ id: "gelaender", de: "das Geländer", syl: "ge-LÄN-der", it: "la ringhiera", itSyl: "rin-GHIE-ra", en: "railing", x: 0, y: Y, kunst: k,
    tipp: "Am Geländer bleiben die Leute stehen und fotografieren die Skyline." });
}

/* Schlagschatten eines Körpers (Breite b, Höhe h in m) auf der Promenade */
const wurf = (X, Z, b, h, op = 0.2) => {
  const a = NP(X - b / 2, Z), c = NP(X + b / 2, Z), e = NP(X + b / 2 + SCH.dx * h, Z + SCH.dz * h), f = NP(X - b / 2 + SCH.dx * h, Z + SCH.dz * h);
  return `<path d="M${pr(a)} L${pr(c)} L${pr(e)} L${pr(f)} Z" fill="#1b120a" opacity="${op}" filter="url(#bw_weich)"/>`;
};

/* =====================================================================
   12 — DER VERKÄUFER und 13 — DER IMBISSWAGEN (Hotdogs, blau-gelber Schirm)
   Wagen 1,8 m lang, Arbeitsfläche 0,95 m, Schirm oben 2,4 m
   ===================================================================== */
const WAGEN = { X: -4.8, Z: 18.75 };
{
  const Zv = WAGEN.Z + 0.7, [vx, vy] = NP(WAGEN.X + 0.5, Zv);
  const m = B.mensch({ id: "nyc_verk", geschlecht: "m", pose: "servieren", blick: 25, frisur: "kurz", haarfarbe: "schwarz", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "weiss" }, schuerze: { stueck: "schuerze", farbe: "weiss" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh", farbe: "schwarz" }, kopf: { stueck: "kappe", farbe: "blau" } } }, 1.76 * K / Zv);
  S.teil({ id: "verkaeufer", de: "der Verkäufer", syl: "ver-KÄU-fer", it: "il venditore", itSyl: "ven-di-TO-re", en: "vendor", x: vx, y: vy, kunst: knapp(m.svg),
    tipp: "Der Verkäufer fragt: „With everything?“ — also mit Senf, Zwiebeln und Sauerkraut?" });
}
{
  const [WX, WY] = NP(WAGEN.X, WAGEN.Z), s = K / WAGEN.Z;
  const L2 = 0.9 * s, OB = 0.95 * s;
  let k = `<g transform="translate(${r(-WX)} ${r(-WY)})">${wurf(WAGEN.X, WAGEN.Z, 1.8, 1.0, 0.18)}</g>` + schatten(0, 0.4, L2 + 4, 1.6, 0.32);
  for (const x of [-L2 + 4, L2 - 4]) k += `<circle cx="${r(x)}" cy="-2.8" r="2.8" fill="#202224"/><circle cx="${r(x)}" cy="-2.8" r="1.4" fill="${STAHL}"/><circle cx="${r(x)}" cy="-2.8" r=".45" fill="#555"/>`;
  k += `<path d="M${r(-L2)} -6 L${r(-L2 - 4)} -3.2 L${r(-L2 - 4.6)} -3.2" stroke="#8d969d" stroke-width=".6" fill="none"/><rect x="${r(-L2 - 5.4)}" y="-3.4" width="1.6" height="3.4" fill="#5b6268"/>`;
  k += `<rect x="${r(-L2)}" y="${r(-OB + 1.2)}" width="${r(2 * L2)}" height="${r(OB - 6.2)}" fill="${STAHL}"/>`;
  for (const x of [-L2 + 2, -4.4, L2 - 10.8]) k += `<rect x="${r(x)}" y="${r(-OB + 6.2)}" width="8.8" height="${r(OB - 13)}" rx=".6" fill="none" stroke="#9aa3aa" stroke-width=".35"/><rect x="${r(x + 3.1)}" y="${r(-OB / 2 + 2)}" width="2.6" height=".7" rx=".3" fill="#7d868d"/>`;
  k += `<rect x="${r(-L2)}" y="${r(-OB + 1.6)}" width="${r(2 * L2)}" height="3.2" fill="#1d5fae"/><text x="${r(-L2 + 1.2)}" y="${r(-OB + 4)}" font-size="2.1" textLength="${r(2 * L2 - 2.4)}" lengthAdjust="spacingAndGlyphs" fill="#ffe14d" font-family="Arial,sans-serif" font-weight="bold">HOT DOGS · PRETZELS · SODA</text>`;
  k += `<rect x="${r(-L2)}" y="-6.4" width="${r(2 * L2)}" height="1.2" fill="#8d969d"/>`;
  k += `<rect x="${r(-L2 - 0.6)}" y="${r(-OB)}" width="${r(2 * L2 + 1.2)}" height="1.4" rx=".4" fill="#c9cfd4"/>`;
  const T = -OB, cm = s / 100;   /* Einheiten je Zentimeter */
  /* Glaskasten mit Brezeln (je ≈ 18 cm) */
  k += `<rect x="-14.6" y="${r(T - 6)}" width="11" height="6" rx=".6" fill="#e6f1f4" opacity=".5" stroke="#9fb2bb" stroke-width=".3"/>`;
  for (const [x, y] of [[-12.4, T - 1.8], [-8.8, T - 2], [-5.8, T - 1.8], [-10.6, T - 4.2], [-7.2, T - 4.2]]) k += `<path d="M${r(x - 1.5)} ${r(y + 0.8)} C${r(x - 2.1)} ${r(y - 0.6)} ${r(x - 0.6)} ${r(y - 1.5)} ${r(x)} ${r(y - 0.6)} C${r(x + 0.6)} ${r(y - 1.5)} ${r(x + 2.1)} ${r(y - 0.6)} ${r(x + 1.5)} ${r(y + 0.8)}" stroke="#8a4614" stroke-width=".75" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M-14.4 ${r(T - 5.6)} L-12 ${r(T - 5.6)} L-14.4 ${r(T - 1)} Z" fill="#fff" opacity=".3"/>`;
  /* Wasserbad mit Klappdeckel (Würstchen dampfen) */
  k += `<rect x="-1.6" y="${r(T - 1.6)}" width="7.4" height="1.6" rx=".4" fill="#aeb6bd"/><path d="M-1.6 ${r(T - 1.6)} L5.8 ${r(T - 1.6)} L5.2 ${r(T - 4.4)} L-1 ${r(T - 4.4)} Z" fill="${STAHL}"/><rect x="1.4" y="${r(T - 4.9)}" width="1.6" height=".5" rx=".2" fill="#2b2f33"/>`;
  k += `<path d="M.4 ${r(T - 5)} q-.6 -1 0 -2 q.6 -1 0 -2 M3.6 ${r(T - 5)} q-.6 -1 0 -2" stroke="#fff" stroke-width=".35" opacity=".5" fill="none"/>`;
  /* ein fertiger Hotdog (20 cm) auf Papier */
  const hl = 20 * cm;
  k += `<rect x="${r(7.6)}" y="${r(T - 0.6)}" width="${r(hl + 1)}" height=".6" rx=".2" fill="#ece3cf"/>`;
  k += `<path d="M8 ${r(T - 0.6)} Q${r(8 + hl / 2)} ${r(T + 0.3)} ${r(8 + hl)} ${r(T - 0.6)} Q${r(8 + hl)} ${r(T - 1.5)} ${r(8 + hl / 2)} ${r(T - 1.5)} Q8 ${r(T - 1.5)} 8 ${r(T - 0.6)} Z" fill="#e3b26a"/><rect x="7.8" y="${r(T - 1.45)}" width="${r(hl + 0.4)}" height=".7" rx=".35" fill="#b5532c"/><path d="M8.1 ${r(T - 1.35)} q.45 -.4 .9 0 t.9 0 t.9 0" stroke="#f5c400" stroke-width=".3" fill="none"/>`;
  /* Senf, Ketchup, Getränkedosen (12 cm) */
  k += `<path d="M12 ${r(T)} L12 ${r(T - 3.4)} Q12.7 ${r(T - 4)} 13.4 ${r(T - 3.4)} L13.4 ${r(T)} Z" fill="#f2c200"/><path d="M12.6 ${r(T - 3.9)} L12.7 ${r(T - 4.9)} L12.8 ${r(T - 3.9)} Z" fill="#c89d00"/>`;
  k += `<path d="M13.8 ${r(T)} L13.8 ${r(T - 3)} Q14.5 ${r(T - 3.6)} 15.2 ${r(T - 3)} L15.2 ${r(T)} Z" fill="#c8211f"/>`;
  for (const [x, c] of [[-3.4, "#c8102e"], [-2.5, "#1f4fa0"]]) k += `<rect x="${x}" y="${r(T - 12 * cm)}" width="${r(6.6 * cm)}" height="${r(12 * cm)}" rx=".2" fill="${c}"/><rect x="${x}" y="${r(T - 12 * cm)}" width="${r(6.6 * cm)}" height=".25" fill="#e8ecef"/>`;
  /* Schirm (blau-gelb) auf der Stange */
  const pole = 2.25 * s;
  k += `<rect x="-.45" y="${r(-pole)}" width=".9" height="${r(pole - OB)}" fill="#c9cfd4"/>`;
  const R = 1.0 * s, top = -pole - 1.2;
  for (let i = 0; i < 8; i++) {
    const x0 = -R + (i / 8) * 2 * R, x1 = -R + ((i + 1) / 8) * 2 * R, dy = (x) => (Math.abs(x) / R) * 1.4;
    k += `<path d="M0 ${r(top)} L${r(x0)} ${r(top + 6 + dy(x0))} Q${r((x0 + x1) / 2)} ${r(top + 7.6 + dy((x0 + x1) / 2))} ${r(x1)} ${r(top + 6 + dy(x1))} Z" fill="${i % 2 ? "#f7d43a" : "#1f62b8"}"/>`;
  }
  k += `<path d="M0 ${r(top)} L${r(-R)} ${r(top + 7.4)} L${r(R)} ${r(top + 7.4)} Z" fill="${S.lg("schirml", [[0, "#000", 0.12], [0.5, "#fff", 0], [1, "#fff", 0.2]], 0, 0, 1, 0)}"/>`;
  k += `<circle cx="0" cy="${r(top - 0.4)}" r=".7" fill="#e9eef0"/>`;
  S.teil({ id: "imbisswagen", de: "der Imbisswagen", syl: "IM-biss-wa-gen", it: "il carretto ambulante", itSyl: "car-RET-to am-bu-LAN-te", en: "food cart", x: WX, y: WY, kunst: k,
    tipp: "An den Imbisswagen kauft man in New York schnell einen Hotdog oder eine Brezel — die kamen mit deutschen Einwanderern nach Amerika.",
    zoom: { x: r(WX - 18), y: r(WY - OB - 10), w: 36, h: 24 },
    unter: [
      { id: "hotdog", de: "der Hotdog", syl: "HOT-dog", it: "l'hot dog", itSyl: "hot DOG", en: "hot dog", x: WX + 8 + hl / 2, y: WY + T, kunst: flaeche(-hl / 2 - 0.6, -2, hl + 1.2, 2.4, 0.3),
        tipp: "Ein Hotdog ist ein Würstchen in einem weichen Brötchen — oft mit Senf." },
    ] });
}

/* =====================================================================
   14 — DER JOGGER (läuft auf der Promenade nach links)
   ===================================================================== */
{
  const X = -1.6, Z = 20.5, [jx, jy] = NP(X, Z);
  const m = B.mensch({ id: "nyc_jog", geschlecht: "m", pose: "laufen", blick: 268, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "dunkel",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#e05a2a" }, unterteil: { stueck: "shorts", farbe: "schwarz" }, schuhe: { stueck: "turnschuh", farbe: "weiss" }, kopf: { stueck: "kappe", farbe: "schwarz" } } }, 1.78 * K / Z);
  S.teil({ id: "jogger", de: "der Jogger", syl: "JOG-ger", it: "il corridore", itSyl: "cor-ri-DO-re", en: "jogger", x: jx, y: jy,
    kunst: `<g transform="translate(${r(-jx)} ${r(-jy)})">${wurf(X, Z, 0.5, 1.78, 0.18)}</g>` + schatten(0, 0.3, 4, 0.8, 0.25) + knapp(m.svg),
    tipp: "Morgens joggen viele New Yorker am Wasser entlang." });
}

/* =====================================================================
   15 — DIE BANK (lange Holzbohle, ohne Lehne) mit Bagel und Kaffeebecher
   ===================================================================== */
{
  const X = 1.4, Z = 17, [bx, by] = NP(X, Z), s = K / Z;
  const Q = (pts, f, ex = "") => `<path d="M${pts.map((p) => pr([p[0] - bx, p[1] - by])).join(" L")} Z" fill="${f}"${ex}/>`;
  const P3 = (dx, dz, y) => NP(X + dx, Z + dz, y);
  let k = `<g transform="translate(${r(-bx)} ${r(-by)})">${wurf(X, Z, 1.9, 0.45, 0.18)}</g>` + schatten(0, 0.4, 0.95 * s + 2, 1.4, 0.28);
  /* zwei Betonfüße */
  for (const dx of [-0.7, 0.7]) { k += Q([P3(dx - 0.12, -0.22, 0), P3(dx + 0.12, -0.22, 0), P3(dx + 0.12, -0.22, 0.38), P3(dx - 0.12, -0.22, 0.38)], "#9b958b"); }
  /* die Bohle: Stirnseite und Sitzfläche (von oben verkürzt) */
  k += Q([P3(-0.95, -0.25, 0.38), P3(0.95, -0.25, 0.38), P3(0.95, -0.25, 0.46), P3(-0.95, -0.25, 0.46)], S.lg("bohle", [[0, "#9a6b3c"], [1, "#6f4823"]]));
  k += Q([P3(-0.95, -0.25, 0.46), P3(0.95, -0.25, 0.46), P3(0.95, 0.25, 0.46), P3(-0.95, 0.25, 0.46)], S.lg("sitz", [[0, "#d6a76b"], [1, "#b98a52"]]));
  for (const dz of [-0.08, 0.09]) k += `<path d="M${pr([P3(-0.95, dz, 0.46)[0] - bx, P3(-0.95, dz, 0.46)[1] - by])} L${pr([P3(0.95, dz, 0.46)[0] - bx, P3(0.95, dz, 0.46)[1] - by])}" stroke="#8f6538" stroke-width=".18"/>`;
  /* der Kaffeebecher „Anthora“ (blau, griechisches Muster, 12 cm) */
  const [cx, cy] = P3(-0.45, 0, 0.46), ch = 0.12 * s, cw = 0.08 * s;
  k += `<path d="M${r(cx - bx - cw / 2)} ${r(cy - by - ch)} L${r(cx - bx + cw / 2)} ${r(cy - by - ch)} L${r(cx - bx + cw * 0.4)} ${r(cy - by)} L${r(cx - bx - cw * 0.4)} ${r(cy - by)} Z" fill="#f4f6f8"/>`;
  k += `<rect x="${r(cx - bx - cw * 0.48)}" y="${r(cy - by - ch * 0.82)}" width="${r(cw * 0.96)}" height="${r(ch * 0.55)}" fill="#2556a8"/><path d="M${r(cx - bx - cw * 0.4)} ${r(cy - by - ch * 0.45)} h.25 v-.25 h.25 v.25 h.25 v-.25 h.25 v.25" stroke="#f4f6f8" stroke-width=".07" fill="none"/>`;
  k += `<rect x="${r(cx - bx - cw * 0.55)}" y="${r(cy - by - ch - 0.25)}" width="${r(cw * 1.1)}" height=".28" rx=".1" fill="#e8ecef"/>`;
  /* der Bagel (11 cm) mit Frischkäse auf Wachspapier */
  const [gx, gy] = P3(0.2, 0.02, 0.46), gw = 0.11 * s;
  k += `<path d="M${r(gx - bx - gw * 0.8)} ${r(gy - by + 0.2)} L${r(gx - bx + gw * 0.85)} ${r(gy - by + 0.2)} L${r(gx - bx + gw * 0.6)} ${r(gy - by - 0.4)} L${r(gx - bx - gw * 0.55)} ${r(gy - by - 0.4)} Z" fill="#f3efe4"/>`;
  k += `<ellipse cx="${r(gx - bx)}" cy="${r(gy - by - 0.5)}" rx="${r(gw / 2)}" ry="${r(gw * 0.2)}" fill="${S.rg("bagel", [[0, "#f0be70"], [0.7, "#c98238"], [1, "#9a5a22"]], 0.45, 0.35, 0.7)}"/>`;
  k += `<ellipse cx="${r(gx - bx)}" cy="${r(gy - by - 0.58)}" rx="${r(gw * 0.14)}" ry="${r(gw * 0.06)}" fill="#5e3a18"/><path d="M${r(gx - bx - gw * 0.48)} ${r(gy - by - 0.45)} Q${r(gx - bx)} ${r(gy - by - 0.2)} ${r(gx - bx + gw * 0.48)} ${r(gy - by - 0.45)}" stroke="#fbf6ea" stroke-width=".2" fill="none"/>`;
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: bx, y: by, kunst: k,
    tipp: "Auf der langen Holzbank sitzt man mit Blick aufs Wasser.",
    zoom: { x: r(bx - 18), y: r(by - 16), w: 36, h: 24 },
    unter: [
      { id: "bagel", de: "der Bagel", syl: "BA-gel", it: "il bagel", itSyl: "BA-gel", en: "bagel", x: gx, y: gy, kunst: flaeche(-gw * 0.85, -1.2, gw * 1.7, 1.6, 0.3),
        tipp: "Der Bagel wird erst gekocht und dann gebacken. Mit Frischkäse ist er das typische Frühstück in New York." },
      { id: "kaffeebecher", de: "der Kaffeebecher", syl: "KAF-fee-be-cher", it: "il bicchiere da caffè", itSyl: "bic-CHIE-re da caf-FÈ", en: "coffee cup", x: cx, y: cy, kunst: flaeche(-cw * 0.7, -ch - 0.4, cw * 1.4, ch + 0.5, 0.3),
        tipp: "Der blau-weiße Pappbecher mit dem griechischen Muster ist ein Symbol von New York." },
    ] });
}

/* =====================================================================
   16 — DIE TOURISTIN fotografiert die Skyline mit dem Handy (von hinten)
   ===================================================================== */
{
  const X = 3.6, Z = 22, [tx, ty] = NP(X, Z);
  const foto = {
    lende: 1, brust: -3, nacken: 2, kopf: -4,
    schulterL: { vor: 64, seit: 16 }, ellbogenL: 104, unterarmL: 40, handL: 10, fingerL: 0.5,
    schulterR: { vor: 62, seit: 18 }, ellbogenR: 106, unterarmR: 40, handR: 10, fingerR: 0.5,
    huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -3, seit: 3, dreh: -6 }, knieR: 2, fussR: 0,
  };
  const m = B.mensch({ id: "nyc_tour", geschlecht: "w", pose: foto, blick: 190, frisur: "zopf", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#2f6f8f" }, jacke: { stueck: "jacke", farbe: "beige" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh", farbe: "weiss" }, zubehoer: { stueck: "rucksack", farbe: "#8a3a2a" } } }, 1.66 * K / Z);
  const hs = [m.z.handL, m.z.handR].filter(Boolean);
  const hx = hs.reduce((a, h) => a + h.x, 0) / hs.length * m.k, hy = Math.min(...hs.map((h) => h.y)) * m.k;
  /* das Handy (7 × 15 cm) mit der Skyline auf dem Bildschirm */
  const s = K / Z, pw = 0.075 * s, ph = 0.15 * s;
  let handy = `<rect x="${r(hx - pw / 2)}" y="${r(hy - ph * 0.8)}" width="${r(pw)}" height="${r(ph)}" rx=".15" fill="#1c1e22"/>`;
  handy += `<rect x="${r(hx - pw / 2 + 0.12)}" y="${r(hy - ph * 0.8 + 0.12)}" width="${r(pw - 0.24)}" height="${r(ph - 0.24)}" fill="${S.lg("screen", [[0, "#8fb8de"], [1, "#d7e6f0"]])}"/>`;
  handy += `<path d="M${r(hx - pw / 2 + 0.15)} ${r(hy + ph * 0.1)} l.15 -.6 l.15 .2 l.15 -1 l.12 .6 l.15 -.4 l.15 .4 V${r(hy + ph * 0.18)} Z" fill="#5d7086"/>`;
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x: tx, y: ty,
    kunst: `<g transform="translate(${r(-tx)} ${r(-ty)})">${wurf(X, Z, 0.45, 1.66, 0.16)}</g>` + schatten(0, 0.3, 3.4, 0.7, 0.25) + knapp(m.svg) + handy,
    tipp: "Die Touristin fotografiert die Skyline von Manhattan mit dem Handy." });
}

/* =====================================================================
   17 — DAS TAXI (Yellow Cab, Toyota Camry 4,9 × 1,84 × 1,47 m) als
   3-D-Körper, schräg von vorn links und von oben gesehen
   ===================================================================== */
{
  const C = { X: 7.6, Z: 17.2 }, yaw = 22 * Math.PI / 180;
  const fw = [-Math.cos(yaw), -Math.sin(yaw)];             /* vorwärts: nach links, leicht zu uns */
  const li = [-fw[1], fw[0]];                                 /* linke Wagenseite (Fahrer), uns zugewandt */
  const W = (u, v, h) => NP(C.X + u * fw[0] + v * li[0], C.Z + u * fw[1] + v * li[1], h);
  const [ox, oy] = NP(C.X, C.Z);
  const P = (u, v, h) => { const [x, y] = W(u, v, h); return `${r(x - ox)} ${r(y - oy)}`; };
  const poly = (pts, f, ex = "") => `<path d="M${pts.map((q) => P(...q)).join(" L")} Z" fill="${f}"${ex}/>`;
  const sicht = (n) => { const wx = n[0] * fw[0] + n[1] * li[0], wz = n[0] * fw[1] + n[1] * li[1]; return -(wx * C.X + wz * C.Z) > 0; };
  let k = "";
  /* Schatten am Boden (Sonne von hinten): Grundriss nach vorn verschoben */
  {
    const sh = (u, v) => { const [x, y] = NP(C.X + u * fw[0] + v * li[0] + SCH.dx * 0.9, C.Z + u * fw[1] + v * li[1] + SCH.dz * 0.9, 0); return `${r(x - ox)} ${r(y - oy)}`; };
    k += `<path d="M${P(2.45, 0.92, 0)} L${P(2.45, -0.92, 0)} L${P(-2.45, -0.92, 0)} L${sh(-2.45, -0.92)} L${sh(-2.45, 0.92)} L${sh(2.45, 0.92)} Z" fill="#1b120a" opacity=".3" filter="url(#bw_weich)"/>`;
    k += poly([[2.5, 0.95, 0], [-2.5, 0.95, 0], [-2.5, -0.95, 0], [2.5, -0.95, 0]], "#1b120a", ` opacity=".35" filter="url(#${S.id("weich3")})"`);
  }
  /* rechte Räder (hinter dem Wagen, unten sichtbar) */
  const rad = (uc, v, dunkel) => { let pts = []; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; pts.push([uc + Math.cos(a) * 0.33, v, 0.33 + Math.sin(a) * 0.33]); } let s = poly(pts, "#18191a"); if (!dunkel) { const n = []; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; n.push([uc + Math.cos(a) * 0.19, v + 0.01, 0.33 + Math.sin(a) * 0.19]); } s += poly(n, S.lg("radkappe", [[0, "#e9edf0"], [1, "#9aa3aa"]])); const c = []; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; c.push([uc + Math.cos(a) * 0.06, v + 0.02, 0.33 + Math.sin(a) * 0.06]); } s += poly(c, "#7d868d"); } return s; };
  k += rad(1.42, -0.86, true) + rad(-1.42, -0.86, true);
  /* Karosserie: Front, linke Seite, Motorhaube, Kofferraumdeckel, Kabine */
  if (sicht([1, 0])) {
    k += poly([[2.45, -0.9, 0.3], [2.45, 0.9, 0.3], [2.45, 0.9, 0.82], [2.42, -0.9, 0.82]], S.lg("taxifront", [[0, "#f4bd17"], [1, "#c98f05"]]));
    k += poly([[2.46, -0.62, 0.48], [2.46, 0.62, 0.48], [2.46, 0.62, 0.62], [2.46, -0.62, 0.62]], "#26292c");
    for (const v of [-0.72, 0.72]) k += poly([[2.46, v - 0.16, 0.66], [2.46, v + 0.16, 0.66], [2.46, v + 0.16, 0.76], [2.46, v - 0.16, 0.76]], "#fdfbe8");
    k += poly([[2.5, -0.92, 0.26], [2.5, 0.92, 0.26], [2.5, 0.92, 0.4], [2.5, -0.92, 0.4]], "#2a2b2c");
  }
  const seite = [[2.45, 0.92, 0.3], [2.45, 0.92, 0.84], [2.2, 0.92, 0.95], [1.02, 0.92, 0.99], [-1.6, 0.92, 0.99], [-2.38, 0.92, 0.98], [-2.45, 0.92, 0.9], [-2.45, 0.92, 0.3]];
  k += poly(seite, TAXIGELB);
  k += poly([[2.5, 0.94, 0.26], [-2.5, 0.94, 0.26], [-2.5, 0.94, 0.4], [2.5, 0.94, 0.4]], "#2a2b2c");
  /* Radläufe und linke Räder */
  for (const uc of [1.42, -1.42]) { const pts = []; for (let i = 0; i <= 10; i++) { const a = i / 10 * Math.PI; pts.push([uc + Math.cos(a) * 0.42, 0.93, 0.3 + Math.sin(a) * 0.42]); } k += poly(pts, "#2a2621"); k += rad(uc, 0.95, false); }
  k += poly([[2.42, -0.9, 0.84], [2.42, 0.92, 0.84], [1.02, 0.86, 0.99], [1.02, -0.86, 0.99]], S.lg("haube", [[0, "#ffe37c"], [1, "#f2b812"]]));
  k += poly([[-1.6, -0.86, 1.0], [-1.6, 0.86, 1.0], [-2.38, 0.9, 0.98], [-2.38, -0.9, 0.98]], "#f2bd1e");
  /* Kabine: linke Seitenfläche (Fenster), Windschutzscheibe, Dach */
  k += poly([[1.02, 0.86, 0.99], [-1.6, 0.86, 0.99], [-1.05, 0.72, 1.47], [0.25, 0.72, 1.47]], "#e7ad0d");
  k += poly([[0.95, 0.85, 1.02], [-0.25, 0.83, 1.02], [-0.22, 0.735, 1.42], [0.28, 0.735, 1.42]], S.lg("tfenster", [[0, "#7b8f9e"], [0.5, "#2f3c47"], [1, "#1c252c"]]));
  k += poly([[-0.33, 0.83, 1.02], [-1.52, 0.85, 1.02], [-1.02, 0.735, 1.42], [-0.3, 0.735, 1.42]], S.lg("tfenster", [[0, "#7b8f9e"], [0.5, "#2f3c47"], [1, "#1c252c"]]));
  /* der Fahrer (Kopf und Schulter hinter der getönten Scheibe) */
  const [dx, dy] = W(0.35, 0.5, 1.22);
  k += `<ellipse cx="${r(dx - ox)}" cy="${r(dy - oy)}" rx="${r(0.1 * K / C.Z)}" ry="${r(0.12 * K / C.Z)}" fill="#15191d" opacity=".75"/><path d="M${P(0.6, 0.5, 1.05)} Q${P(0.35, 0.5, 1.16)} ${P(0.1, 0.5, 1.05)}" stroke="#15191d" stroke-width="${r(0.12 * K / C.Z)}" opacity=".7" fill="none"/>`;
  k += poly([[1.02, 0.86, 0.99], [1.02, -0.86, 0.99], [0.25, -0.72, 1.47], [0.25, 0.72, 1.47]], S.lg("tscheibe", [[0, "#9db4c4"], [0.6, "#3c4c58"], [1, "#25313a"]]));
  k += poly([[0.9, 0.6, 1.06], [0.65, 0.5, 1.2], [0.5, 0.3, 1.28], [0.75, 0.42, 1.12]], "#fff", ` opacity=".25"`);
  k += poly([[0.25, -0.72, 1.47], [0.25, 0.72, 1.47], [-1.05, 0.72, 1.47], [-1.05, -0.72, 1.47]], "#f7c62a");
  /* Dachschild mit Lizenznummer */
  k += poly([[-0.15, -0.36, 1.48], [-0.15, 0.36, 1.48], [-0.15, 0.36, 1.66], [-0.15, -0.36, 1.66]], "#f4f2ea");
  k += poly([[-0.15, 0.36, 1.48], [-0.5, 0.36, 1.48], [-0.5, 0.36, 1.66], [-0.15, 0.36, 1.66]], "#e2dfd5");
  k += poly([[-0.15, -0.36, 1.66], [-0.15, 0.36, 1.66], [-0.5, 0.36, 1.66], [-0.5, -0.36, 1.66]], "#fbfaf6");
  /* Schrift auf der Seite: affine Abbildung der Seitenebene (u nach vorn, h nach oben) */
  const aff = (u0, h0, v = 0.93) => { const a = W(u0, v, h0), b = W(u0 - 1, v, h0), c = W(u0, v, h0 - 1); return `matrix(${r((b[0] - a[0]) * 100) / 100} ${r((b[1] - a[1]) * 100) / 100} ${r((c[0] - a[0]) * 100) / 100} ${r((c[1] - a[1]) * 100) / 100} ${r(a[0] - ox)} ${r(a[1] - oy)})`; };
  k += `<g transform="${aff(1.0, 0.62)}"><text x="0" y="0" font-size=".2" fill="#111" font-family="Arial,sans-serif" font-weight="bold">NYC</text><rect x=".45" y="-.19" width=".22" height=".22" rx=".02" fill="#111"/><text x=".56" y="-.01" font-size=".19" text-anchor="middle" fill="#f9c623" font-family="Arial,sans-serif" font-weight="bold">T</text><text x=".69" y="0" font-size=".2" fill="#111" font-family="Arial,sans-serif" font-weight="bold">AXI</text></g>`;
  k += `<g transform="${aff(-0.4, 0.66)}"><text x="0" y="0" font-size=".085" fill="#222" font-family="Arial,sans-serif">$3.00 INITIAL CHARGE</text><text x="0" y=".11" font-size=".08" fill="#222" font-family="Arial,sans-serif">70¢ PER 1/5 MILE</text></g>`;
  k += `<g transform="${aff(-1.7, 0.66)}"><text x="0" y="0" font-size=".16" fill="#111" font-family="Arial,sans-serif" font-weight="bold">7K42</text></g>`;
  k += `<g transform="${aff(0.05, 1.53, 0.37)}"><text x="0" y="0" font-size=".12" fill="#111" font-family="Arial,sans-serif" font-weight="bold">7K42</text></g>`;
  /* Türfugen, Griffe, Spiegel, Glanzlinie */
  for (const u of [1.0, -0.3, -1.55]) k += `<path d="M${P(u, 0.93, 0.38)} L${P(u, 0.93, 0.98)}" stroke="#9b7506" stroke-width=".25"/>`;
  for (const u of [0.15, -1.1]) k += poly([[u, 0.935, 0.83], [u - 0.18, 0.935, 0.83], [u - 0.18, 0.935, 0.87], [u, 0.935, 0.87]], "#6b5206");
  k += poly([[1.0, 0.86, 1.0], [0.85, 1.06, 1.0], [0.85, 1.06, 1.1], [1.0, 0.86, 1.1]], "#d8a20c");
  k += `<path d="M${P(2.3, 0.935, 0.9)} L${P(-2.35, 0.935, 0.92)}" stroke="#fff6c8" stroke-width=".45" opacity=".7"/>`;
  S.teil({ id: "taxi", de: "das Taxi", syl: "TA-xi", it: "il taxi", itSyl: "TA-xi", en: "taxi", x: ox, y: oy, kunst: k,
    tipp: "Die gelben Taxis (Yellow Cabs) sind ein Wahrzeichen von New York. Man winkt sie am Straßenrand heran." });
}
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/new_york.js"));
console.log(aus);
