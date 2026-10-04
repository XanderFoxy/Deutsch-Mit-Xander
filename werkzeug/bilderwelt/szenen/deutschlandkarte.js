#!/usr/bin/env node
/* =====================================================================
   DIE DEUTSCHLANDKARTE (FASSUNG 854) — Bilderwelt neu: Übersichtskarte
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … komprimiert in
   einer Übersicht, die ihresgleichen sucht“ – und (Funk 291): „mit
   größter Sorgfalt und Präzision auf höchstem Niveau“.

   Eine illustrierte Reiseführer-Karte: Wo liegen die Städte, deren
   Bilder es in der Bilderwelt gibt? Jede Stadt trägt ihr Wahrzeichen als
   kleines Bild; Antippen führt (lupe) in die Szene der Stadt.

   KARTOGRAFIE (Fachwissen, Koordinaten in Grad, ehrlich vereinfacht):
   - Abbildung: sinusoidal um 10,45° O (der Mittelmeridian Deutschlands),
     0,28 Einheiten je km. Die Meridiane laufen nach Norden leicht
     zusammen, wie auf einer Atlas-Kegelkarte. Ausschnitt ≈ 0,3–21,7° O,
     47,0–55,4° N; Deutschland 5,87–15,04° O, 47,27–55,06° N.
   - Umriss: Landgrenzen nach den Grenzorten (Selfkant 5,87° O westlichster
     Punkt, Haldenwanger Eck 47,27° N südlichster, Neiße bei Zentendorf
     15,04° O östlichster, List auf Sylt 55,06° N nördlichster). Die
     Küsten zeichnen die Meere selbst (Nordsee und Ostsee sind Teile mit
     eigener Küstenlinie): Dollart, Jadebusen, Weser- und Elbmündung,
     Eiderstedt, Nordfriesische und Ostfriesische Inseln, Helgoland,
     Flensburger Förde, Kieler Förde, Fehmarn, Wismarbucht mit Poel,
     Fischland-Darß-Zingst, Hiddensee, Rügen (Wittow mit Kap Arkona,
     Jasmund mit Königsstuhl, Mönchgut), Usedom, Stettiner Haff.
   - 16 Bundesländer als dünne gestrichelte Grenzen (vereinfacht nach den
     Grenzstädten, z. B. Rothenburg BY / Creglingen BW, Gronau NRW /
     Bad Bentheim NI); Berlin, Hamburg und Bremen (mit Bremerhaven) als
     Stadtstaaten.
   - Flüsse: Rhein (Bodensee – Basel – Mainz – Köln – Emmerich), Elbe
     (Bad Schandau – Dresden – Magdeburg – Hamburg – Cuxhaven), Donau
     (Donaueschingen – Ulm – Regensburg als nördlichster Punkt – Passau –
     Wien), Main (Maindreieck und Mainviereck), Weser, Mosel (Trier,
     Cochem), Neckar (Stuttgart, Heidelberg), dazu Oder/Neiße, Ems, Saale,
     Havel/Spree, Isar, Inn, Lech blass.
   - Gebirge als weiche Reliefflecken: Harz mit Brocken, Schwarzwald,
     Schwäbische Alb, Thüringer Wald, Erzgebirge, Bayerischer Wald,
     Eifel, Hunsrück, Taunus, Sauerland, Rhön … und am Südrand die Alpen
     mit der Zugspitze (2962 m, höchster Berg Deutschlands).
   - Nachbarländer blass mit Hauptstädten (Amsterdam, Brüssel, Luxemburg,
     Paris, Prag, Wien).
   Wahrzeichen (je ein Bild): Hamburg Elbphilharmonie, Lübeck Holstentor,
   Bremen Stadtmusikanten, Hannover Neues Rathaus, Berlin Brandenburger
   Tor und Fernsehturm, Potsdam Sanssouci, Magdeburg Dom, Leipzig
   Völkerschlachtdenkmal, Dresden Frauenkirche, Weimar Goethe-Schiller-
   Denkmal, Düsseldorf Rheinturm, Köln Dom, Aachen Dom (Oktogon), Trier
   Porta Nigra, Frankfurt Skyline (Messeturm), Heidelberg Schloss,
   Stuttgart Fernsehturm, Freiburg Münster, Nürnberg Kaiserburg,
   Rothenburg Plönlein, Regensburg Steinerne Brücke und Dom, München
   Frauenkirche, Neuschwanstein.
   Lupen: Nordrhein-Westfalen (Düsseldorf, Köln, Aachen liegen dicht) und
   Bayern (fünf Städte).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, zufall } = require("../bau");
const B = require("../bau");

const BR = 400, HO = 260;
const S = neueSzene({ id: "deutschlandkarte", titel: "Deutschlandkarte", emoji: "🗺️", thema: "Deutschland", kuerzel: "dkt", fassung: 854, breite: BR, hoehe: HO });
const r = B.r;
const rnd = zufall(4910);

/* ---------- Abbildung ---------------------------------------------- */
const MASS = 0.28, LON0 = 10.45, LAT0 = 55.25, Y0 = 4;
const P = (lo, la) => [200 + (lo - LON0) * Math.cos(la * Math.PI / 180) * 111.32 * MASS, Y0 + (LAT0 - la) * 111.2 * MASS];
/* "7.2,53.4 8,54" → Punkte; "@x,y" sind Bildkoordinaten; "!" am Ende macht eine Ecke */
const pkt = (txt) => txt.trim().split(/\s+/).map((t) => {
  const hart = t.endsWith("!"); if (hart) t = t.slice(0, -1);
  const roh = t.startsWith("@"); if (roh) t = t.slice(1);
  const [a, b] = t.split(",").map(Number);
  const [x, y] = roh ? [a, b] : P(a, b);
  return { x, y, hart };
});
/* Weicher Linienzug (Catmull-Rom → Bézier); zu = geschlossen */
function weg(pts, zu = true, k = 1) {
  if (typeof pts === "string") pts = pkt(pts);
  const n = pts.length, at = (i) => zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = `M${r(pts[0].x)} ${r(pts[0].y)}`;
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1 = p1.hart ? p1 : { x: p1.x + (p2.x - p0.x) / 6 * k, y: p1.y + (p2.y - p0.y) / 6 * k };
    const c2 = p2.hart ? p2 : { x: p2.x - (p3.x - p1.x) / 6 * k, y: p2.y - (p3.y - p1.y) / 6 * k };
    d += `C${r(c1.x)} ${r(c1.y)} ${r(c2.x)} ${r(c2.y)} ${r(p2.x)} ${r(p2.y)}`;
  }
  return d + (zu ? "Z" : "");
}
const PT = (lo, la) => P(lo, la).map(r);

/* ---------- Filter und Farben (alle Filter in sRGB) ------------------ */
const F = (id, inhalt, x = "-20%", y = "-20%", w = "140%", h = "140%") => S.def(`<filter id="${S.id(id)}" x="${x}" y="${y}" width="${w}" height="${h}" color-interpolation-filters="sRGB">${inhalt}</filter>`);
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.4"/></filter>`);
F("weich1", `<feGaussianBlur stdDeviation=".9"/>`, "-30%", "-30%", "160%", "160%");
F("weich3", `<feGaussianBlur stdDeviation="2.6"/>`, "-30%", "-30%", "160%", "160%");
const fl = (id) => `url(#${S.id(id)})`;

const MEER = S.lg("meer", [[0, "#a7d0dc"], [0.55, "#98c6d6"], [1, "#8bbccf"]], 0, 0, 0.4, 1);
const NACHBAR = S.lg("nachbar", [[0, "#f1e9d6"], [1, "#e8dec7"]], 0, 0, 1, 1);
const LAND = S.lg("land", [[0, "#e4e7bd"], [0.45, "#dfe3b2"], [0.8, "#e6dfae"], [1, "#e9d9a8"]]);
const SEEFARBE = "#9dcbdb";
const GRENZE = "#9a7f55";
const FLUSS = "#4a90bf";

/* =====================================================================
   GEODATEN (Länge, Breite)
   ===================================================================== */
/* Nordsee: Küste von Jütland über Deutschland, die Niederlande, Belgien und
   Frankreich, dann die Ostküste Englands. */
const NORDSEE = `@-6,-6 8.58,55.6 8.62,55.35 8.66,55.2 8.68,55.05 8.66,54.95 8.66,54.91 8.68,54.82 8.68,54.75 8.75,54.68 8.82,54.6 8.9,54.55 8.98,54.51
  9.03,54.47 8.92,54.43 8.78,54.42 8.65,54.38 8.6,54.32 8.68,54.27 8.82,54.27 8.95,54.3 8.88,54.22 8.85,54.13 8.98,54.1 9.02,54.06 8.9,54.02
  8.86,53.97 8.98,53.92 9.12,53.89 9.2,53.86 9.2,53.83 9.05,53.81 8.9,53.82 8.78,53.86 8.7,53.88 8.62,53.86 8.55,53.78 8.5,53.7 8.52,53.62
  8.57,53.56 8.54,53.48 8.5,53.45 8.47,53.48 8.48,53.55 8.38,53.61 8.3,53.62 8.25,53.55 8.3,53.48 8.28,53.42 8.2,53.4 8.12,53.42 8.1,53.47
  8.15,53.52 8.12,53.6 8.06,53.67 8,53.71 7.9,53.7 7.8,53.7 7.55,53.68 7.35,53.66 7.2,53.63 7.12,53.56 7.06,53.5 7.03,53.43 7.04,53.36 7.15,53.35
  7.2,53.36 7.27,53.31 7.25,53.24 7.18,53.21 7.1,53.24 7.02,53.3 6.93,53.33 6.88,53.42 6.83,53.45 6.7,53.46 6.55,53.43 6.35,53.41 6.2,53.4
  6.05,53.4 5.88,53.38 5.7,53.33 5.55,53.26 5.43,53.18 5.38,53.1 5.33,53.07! 5.05,52.94! 4.88,52.92 4.76,52.96 4.7,52.88 4.65,52.77 4.62,52.62
  4.58,52.46 4.5,52.33 4.43,52.24 4.27,52.11 4.12,51.99 4.03,51.96 4.05,51.88 3.95,51.84 3.85,51.82 3.95,51.75 3.75,51.73 3.7,51.68 3.68,51.62
  3.62,51.58 3.5,51.58 3.44,51.53 3.5,51.47 3.58,51.44 3.75,51.42 3.95,51.43 4.05,51.38 3.85,51.36 3.6,51.38 3.4,51.37 3.3,51.35 3.2,51.33
  2.92,51.23 2.55,51.09 2.37,51.05 1.85,50.96 1.58,50.87 1.6,50.73 1.58,50.52 1.56,50.4 1.62,50.25 1.55,50.2 1.37,50.06 1.08,49.93 0.7,49.86
  0.37,49.76 0.05,49.68 @-6,207 @-6,186 -0.3,50.8 0.24,50.74 0.58,50.85 0.98,50.91 1.18,51.08 1.32,51.12 1.4,51.22 1.42,51.33 1.45,51.38 1.1,51.37
  0.85,51.4 0.6,51.47 0.8,51.53 0.95,51.6 1.15,51.78 1.27,51.85 1.35,51.96 1.58,52.08 1.68,52.33 1.76,52.48 1.73,52.61 1.53,52.83 1.3,52.93
  0.85,52.96 0.49,52.94 0.38,52.8 0.15,52.85 0.33,53.1 0.34,53.14 0.26,53.34 0.1,53.5 0.12,53.58 -0.05,53.62 -0.16,53.91 -0.19,54.08 -0.08,54.12
  -0.4,54.28 -0.61,54.49 -0.97,54.58 @-6,18`;
/* Inseln in der Nordsee (Löcher im Meer) */
const INSELN_NORD = {
  sylt: "8.29,54.75 8.28,54.85 8.3,54.92 8.33,54.98 8.38,55.04 8.45,55.05 8.42,55.02 8.38,54.99 8.36,54.93 8.39,54.905 8.48,54.9 8.41,54.88 8.33,54.86 8.31,54.78",
  foehr: "8.4,54.73 8.47,54.765 8.58,54.755 8.6,54.69 8.52,54.67 8.42,54.69",
  amrum: "8.33,54.62 8.35,54.7 8.39,54.69 8.38,54.63 8.35,54.61",
  pellworm: "8.58,54.5 8.65,54.54 8.7,54.51 8.64,54.48",
  helgoland: "7.85,54.172 7.865,54.2 7.9,54.19 7.895,54.168",
  borkum: "6.65,53.58 6.72,53.62 6.8,53.6 6.75,53.56",
  juist: "6.9,53.675 7.0,53.69 7.1,53.695 7.08,53.68 6.95,53.67",
  norderney: "7.1,53.7 7.2,53.725 7.3,53.715 7.28,53.7 7.15,53.695",
  baltrum: "7.35,53.725 7.42,53.735 7.42,53.725 7.36,53.72",
  langeoog: "7.45,53.745 7.55,53.76 7.62,53.755 7.6,53.745 7.48,53.74",
  spiekeroog: "7.66,53.765 7.75,53.78 7.8,53.775 7.75,53.765",
  wangerooge: "7.86,53.785 7.92,53.795 7.97,53.79 7.92,53.782",
  romo: "8.5,55.08 8.53,55.18 8.6,55.15 8.56,55.06",
  texel: "4.72,52.99 4.73,53.08 4.88,53.18 4.9,53.1 4.8,52.99",
  vlieland: "4.92,53.24 5.1,53.3 5.08,53.31 4.93,53.27",
  terschelling: "5.15,53.37 5.55,53.455 5.55,53.42 5.2,53.36",
  ameland: "5.62,53.44 5.92,53.475 5.9,53.45 5.65,53.43",
  schiermonnikoog: "6.12,53.47 6.33,53.5 6.32,53.48 6.15,53.46",
};
/* Ostsee: von Jütland über Als, Schleswig-Holstein, Mecklenburg-Vorpommern,
   Usedom, die polnische Küste mit Hela bis zur Kurischen Nehrung; zurück über
   die Südküsten von Seeland und Fünen. */
const OSTSEE = `9.62,55.6 9.6,55.25 9.68,55.12 9.75,55.06 9.95,55.05 10.05,54.95 9.97,54.86 9.79,54.9 9.68,54.86 9.6,54.9 9.43,54.84 9.43,54.79
  9.55,54.83 9.59,54.87 9.65,54.82 9.9,54.75 10.0,54.75 10.03,54.67 9.98,54.55 9.87,54.48 10.0,54.47 10.18,54.47 10.2,54.45 10.19,54.39 10.14,54.32
  10.18,54.35 10.22,54.41 10.35,54.43 10.42,54.42 10.67,54.32 10.8,54.32 10.98,54.38 11.08,54.37 11.1,54.3 11.08,54.22 10.96,54.15 10.82,54.1
  10.78,54.02 10.88,53.96 10.95,53.97 11.05,54.0 11.2,54.0 11.3,53.95 11.46,53.9 11.5,53.96 11.55,54.03 11.62,54.11 11.75,54.15 11.92,54.16
  12.08,54.18 12.25,54.25 12.4,54.36 12.43,54.39 12.5,54.47 12.57,54.45 12.7,54.44 12.95,54.44 13.03,54.43 13.09,54.31 13.25,54.22 13.45,54.1
  13.62,54.14 13.73,54.14 13.78,54.15 13.9,54.08 14.05,54.01 14.15,53.96 14.23,53.93 14.27,53.92 14.45,53.96 14.78,54.03 14.93,54.06 15.58,54.18
  16.05,54.27 16.4,54.43 16.85,54.59 17.05,54.67 17.55,54.77 17.98,54.83 18.34,54.83 18.42,54.78 18.6,54.72 18.8,54.6 18.78,54.59 18.6,54.69
  18.45,54.74 18.41,54.72 18.55,54.52 18.57,54.44 18.66,54.4 18.95,54.36 19.3,54.38 19.6,54.45 19.9,54.62 19.95,54.88 20.5,54.95 20.55,54.97
  21.0,55.25 21.15,55.6 @406,-6 12.4,55.6 12.45,55.28 12.2,55.2 12.05,55.12 11.9,55.0 11.65,55.18 11.3,55.25 11.14,55.33 11.12,55.6 10.8,55.6
  10.8,55.31 10.72,55.08 10.61,55.06 10.4,55.05 10.24,55.1 10.05,55.12 10.02,55.15 9.89,55.27 9.83,55.6`;
const INSELN_OST = {
  langeland: "10.72,55.12 10.79,55.06 10.82,54.98 10.8,54.9 10.75,54.8 10.72,54.73 10.68,54.76 10.7,54.85 10.67,54.95 10.69,55.05",
  aeroe: "10.22,54.93 10.32,54.89 10.42,54.86 10.52,54.82 10.48,54.81 10.38,54.84 10.27,54.87 10.2,54.9",
  lolland: "11.08,54.84 11.15,54.88 11.2,54.92 11.32,54.9 11.45,54.88 11.55,54.84 11.62,54.82 11.66,54.76 11.62,54.68 11.5,54.66 11.4,54.64 11.3,54.66 11.15,54.69 11.05,54.73 11.1,54.79 11.0,54.81",
  falster: "11.86,54.95 11.95,54.94 12.08,54.88 12.05,54.78 11.98,54.68 11.95,54.57 11.9,54.6 11.86,54.7 11.8,54.8 11.85,54.88",
  moen: "12.18,54.98 12.25,55.02 12.38,55.05 12.52,55.0 12.55,54.95 12.42,54.94 12.3,54.95",
  bornholm: "14.7,55.3 14.77,55.29 15.15,55.13 15.08,55.0 14.7,55.07",
  fehmarn: "11.0,54.47 11.05,54.52 11.15,54.53 11.25,54.5 11.3,54.42 11.22,54.4 11.12,54.4 11.03,54.42",
  poel: "11.38,54.0 11.45,54.04 11.5,54.0 11.48,53.96 11.4,53.97",
  ruegen: `13.12,54.33 13.15,54.4 13.18,54.47 13.25,54.55 13.25,54.6 13.23,54.63 13.3,54.67 13.43,54.68 13.48,54.63 13.53,54.58 13.6,54.59
    13.67,54.57 13.64,54.52 13.57,54.47 13.61,54.4 13.7,54.38 13.74,54.34 13.71,54.28 13.65,54.3 13.5,54.33 13.4,54.3 13.25,54.27`,
  hiddensee: "13.08,54.48 13.1,54.55 13.12,54.6 13.15,54.59 13.12,54.52 13.1,54.48",
};
/* Haff, Bodden, Seen (Wasser auf dem Land) */
const GEWAESSER = {
  haff: "13.82,53.85 13.95,53.88 14.05,53.86 14.2,53.87 14.27,53.88 14.45,53.8 14.62,53.82 14.62,53.7 14.55,53.6 14.4,53.68 14.28,53.73 14.05,53.74 13.92,53.78",
  bodden: "12.45,54.29 12.55,54.36 12.7,54.39 12.9,54.39 12.95,54.36 12.75,54.34 12.55,54.31",
  jasmund: "13.4,54.47 13.5,54.52 13.56,54.5 13.52,54.46 13.44,54.45",
  achterwasser: "13.85,53.98 13.95,54.02 14.0,53.97 13.92,53.94",
  bodensee: "9.73,47.5 9.68,47.545 9.6,47.565 9.54,47.595 9.47,47.65 9.37,47.665 9.32,47.675 9.27,47.69 9.16,47.765 9.06,47.81 9.02,47.805 9.12,47.755 9.16,47.72 9.19,47.705 9.18,47.665 9.18,47.65 9.24,47.63 9.38,47.565 9.43,47.515 9.49,47.48 9.55,47.49 9.62,47.5",
  untersee: "9.17,47.67 9.13,47.665 9.08,47.67 8.98,47.67 8.92,47.67 8.86,47.66 8.88,47.668 8.98,47.685 8.97,47.735 9.0,47.745 9.07,47.715 9.07,47.695 9.1,47.705 9.15,47.675",
  mueritz: "12.62,53.55 12.72,53.52 12.78,53.42 12.72,53.35 12.65,53.38 12.66,53.47",
  chiemsee: "12.35,47.88 12.42,47.92 12.52,47.9 12.55,47.85 12.45,47.83 12.37,47.84",
  steinhude: "9.29,52.47 9.33,52.49 9.37,52.47 9.33,52.45",
  ammersee: "11.1,48.07 11.14,48.06 11.15,47.95 11.11,47.92 11.09,47.98",
  starnberg: "11.3,48.0 11.34,47.99 11.36,47.85 11.32,47.84 11.3,47.92",
  ijsselmeer: "5.05,52.94 5.33,53.07 5.42,52.95 5.7,52.84 5.6,52.66 5.4,52.6 5.25,52.5 5.1,52.38 5.02,52.42 5.1,52.65 5.05,52.8 4.98,52.9",
  zuerichsee: "8.55,47.36 8.62,47.3 8.8,47.22 8.85,47.21 8.68,47.27 8.58,47.33",
  neusiedl: "16.7,47.95 16.82,47.92 16.85,47.75 16.78,47.68 16.68,47.75 16.67,47.85",
  balaton: "17.25,46.95 17.5,46.88 17.95,47.05 18.18,47.1 17.95,47.0 17.6,46.85 17.3,46.8",
  attersee: "13.52,47.92 13.56,47.91 13.58,47.8 13.54,47.79",
};

/* Deutschland: Landgrenze genau, an der Küste ein Saum über das Meer
   (das Meer liegt darüber und zeichnet die echte Küste). */
const DE = {
  kueste1: "7.21,53.24 7.15,53.32 7.05,53.42 6.6,53.6 6.55,53.7 6.7,53.85 7.7,54.32 8.2,54.4 8.1,54.6 8.12,54.8 8.2,55.07 8.5,55.075 8.64,54.95",
  dk: "8.66,54.91 8.8,54.905 9.0,54.88 9.2,54.855 9.3,54.81 9.42,54.83",
  kueste2: "9.45,54.84 9.6,54.865 9.8,54.84 10.05,54.8 10.3,54.65 10.8,54.53 11.05,54.57 11.35,54.56 11.7,54.46 12.0,54.48 12.4,54.56 13.0,54.64 13.12,54.64 13.43,54.71 13.48,54.75 13.82,54.6 13.86,54.35 14.0,54.15 14.21,53.97",
  pl1: "14.23,53.93 14.25,53.87 14.27,53.76 14.3,53.62 14.4,53.45 14.44,53.33 14.41,53.3",
  pl2: "14.41,53.3 14.42,53.26 14.38,53.2 14.3,53.08 14.2,52.97 14.14,52.86 14.3,52.76 14.45,52.66 14.62,52.58 14.56,52.47 14.55,52.36 14.6,52.25 14.7,52.12 14.76,52.07 14.72,51.96 14.62,51.82 14.66,51.72 14.73,51.58",
  pl3: "14.73,51.58 14.9,51.47 15.03,51.28 15.0,51.16 14.93,51.02 14.82,50.87",
  cz1: "14.82,50.87 14.62,50.93 14.55,51.01 14.4,51.05 14.28,51.0 14.27,50.92 14.23,50.89 14.05,50.82 13.9,50.79 13.75,50.73 13.55,50.7 13.45,50.6 13.3,50.58 13.2,50.5 13.03,50.45 12.95,50.41 12.75,50.43 12.55,50.4 12.33,50.24 12.2,50.31 12.1,50.32",
  cz2: "12.1,50.32 12.1,50.22 12.22,50.12 12.26,50.08 12.45,49.99 12.55,49.92 12.5,49.75 12.65,49.53 12.8,49.35 13.0,49.3 13.2,49.13 13.4,49.03 13.55,48.97 13.7,48.88 13.84,48.77",
  at: `13.84,48.77 13.73,48.62 13.7,48.52 13.47,48.57 13.43,48.55 13.3,48.4 13.15,48.3 13.03,48.26 12.86,48.2 12.83,48.16 12.77,48.06 12.93,47.94 12.98,47.82
    12.95,47.73 13.05,47.7 13.08,47.6 13.02,47.5 12.92,47.48 12.8,47.55 12.78,47.67 12.5,47.67 12.25,47.68 12.19,47.61 12.1,47.6 11.85,47.58 11.62,47.59
    11.4,47.47 11.27,47.42 11.1,47.4 10.98,47.4 10.88,47.47 10.75,47.52 10.65,47.57 10.48,47.55 10.45,47.48 10.32,47.43 10.22,47.38 10.18,47.27
    10.1,47.37 10.08,47.47 9.97,47.54 9.76,47.57 9.7,47.545`,
  by_see: "9.7,47.545 9.62,47.57",
  see: "9.62,47.57 9.55,47.55 9.4,47.6 9.2,47.66 9.17,47.655",
  ch: "9.17,47.655 9.1,47.67 8.95,47.68 8.87,47.66 8.8,47.72 8.7,47.76 8.61,47.81 8.5,47.77 8.45,47.65 8.4,47.58 8.21,47.61 8.05,47.56 7.8,47.56 7.62,47.59",
  fr1: "7.59,47.59 7.58,47.7 7.53,47.82 7.58,48.03 7.62,48.2 7.7,48.35 7.8,48.58 7.95,48.75 8.1,48.88 8.23,48.97",
  fr2: "8.23,48.97 8.08,48.99 7.95,49.05 7.75,49.05 7.6,49.08 7.45,49.17 7.37,49.17 7.32,49.13",
  fr3: "7.32,49.13 7.12,49.13 7.05,49.12 6.92,49.2 6.83,49.15 6.73,49.17 6.6,49.3 6.55,49.4 6.43,49.47 6.37,49.47",
  lu1: "6.37,49.47 6.38,49.53",
  lu2: "6.38,49.53 6.45,49.65 6.51,49.72 6.47,49.8 6.32,49.85 6.2,49.92 6.13,50.0 6.13,50.13",
  be1: "6.13,50.13 6.18,50.24 6.33,50.33 6.4,50.32",
  be2: "6.4,50.32 6.27,50.5 6.2,50.55 6.15,50.63 6.07,50.7 6.02,50.75",
  nl1: "6.02,50.75 6.06,50.88 6.0,50.97 5.87,51.05 5.97,51.07 6.1,51.12 6.17,51.18 6.22,51.36 6.24,51.5 6.16,51.68 5.98,51.78 6.05,51.86 6.16,51.87 6.4,51.86 6.65,51.9 6.83,51.97 6.75,52.03 6.72,52.08 6.88,52.14 7.03,52.23 7.04,52.25",
  nl2: "7.04,52.25 7.05,52.38 6.98,52.45 7.08,52.6 7.05,52.65 7.1,52.85 7.2,53.0 7.21,53.12 7.22,53.18 7.21,53.24",
};
const DE_RING = ["kueste1", "dk", "kueste2", "pl1", "pl2", "pl3", "cz1", "cz2", "at", "by_see", "see", "ch", "fr1", "fr2", "fr3", "lu1", "lu2", "be1", "be2", "nl1", "nl2"];
/* Grenzen der Bundesländer (Linienzüge) */
const LAENDER = {
  sh_ni: "9.15,53.87 9.4,53.8 9.6,53.6 9.8,53.55",
  hh: "9.73,53.56 9.78,53.5 9.85,53.45 10.0,53.4 10.15,53.42 10.33,53.43 10.25,53.5 10.2,53.53 10.18,53.6 10.17,53.65 10.07,53.73 9.97,53.69 9.92,53.66 9.8,53.62",
  sh_ni2: "10.33,53.43 10.45,53.4 10.57,53.37",
  sh_mv: "10.92,53.96 10.88,53.88 10.8,53.75 10.85,53.65 10.95,53.58 10.75,53.48 10.62,53.4 10.57,53.37",
  ni_mv: "10.57,53.37 10.75,53.36 11.0,53.25 11.25,53.14 11.4,53.1 11.57,53.04",
  ni_st: "11.57,53.04 11.4,52.98 11.2,52.93 11.0,52.88 10.8,52.8 10.78,52.65 10.85,52.55 10.95,52.45 11.05,52.3 11.05,52.15 10.9,52.05 10.7,51.95 10.55,51.85 10.58,51.7 10.6,51.58",
  ni_th: "10.6,51.58 10.45,51.55 10.3,51.47 10.15,51.42 9.95,51.38",
  ni_he: "9.95,51.38 9.78,51.45 9.62,51.48 9.55,51.58 9.45,51.62",
  ni_nw: "7.04,52.25 7.2,52.25 7.4,52.25 7.55,52.38 7.8,52.42 7.95,52.3 7.9,52.2 8.05,52.12 8.2,52.08 8.35,52.13 8.42,52.25 8.4,52.45 8.7,52.53 9.0,52.45 9.12,52.32 9.1,52.2 9.1,52.05 9.3,51.92 9.45,51.85 9.45,51.62",
  nw_he: "9.45,51.62 9.3,51.47 9.05,51.42 8.85,51.4 8.6,51.28 8.55,51.1 8.4,50.95 8.15,50.8 8.12,50.7",
  nw_rp: "8.12,50.7 7.95,50.72 7.75,50.8 7.55,50.75 7.35,50.65 7.25,50.6 7.05,50.52 6.85,50.45 6.6,50.36 6.4,50.32",
  he_rp: "8.12,50.7 8.05,50.55 8.0,50.4 7.95,50.28 7.82,50.15 7.8,50.05 7.92,49.97 8.1,49.99 8.27,50.0 8.35,49.85 8.4,49.7 8.42,49.6 8.45,49.56",
  he_bw: "8.45,49.56 8.6,49.53 8.75,49.52 8.9,49.45 9.0,49.5 9.1,49.55",
  he_by: "9.1,49.55 9.1,49.7 9.03,49.8 9.05,49.95 9.15,50.1 9.35,50.13 9.5,50.25 9.75,50.38 9.95,50.45 10.05,50.55",
  he_th: "9.95,51.38 10.05,51.25 10.2,51.12 10.05,51.0 9.95,50.92 10.05,50.8 10.0,50.65 10.05,50.55",
  rp_bw: "8.45,49.56 8.44,49.4 8.38,49.2 8.3,49.05 8.23,48.97",
  rp_sl: "6.38,49.53 6.6,49.58 6.85,49.62 7.1,49.65 7.28,49.57 7.38,49.42 7.38,49.25 7.32,49.13",
  bw_by: "9.62,47.57 9.75,47.65 9.95,47.72 10.1,47.82 10.12,47.95 10.08,48.15 10.03,48.3 10.0,48.4 10.15,48.52 10.3,48.65 10.42,48.8 10.4,48.95 10.3,49.08 10.2,49.2 10.1,49.33 10.05,49.45 10.1,49.55 9.92,49.62 9.8,49.68 9.65,49.72 9.52,49.77 9.4,49.7 9.3,49.62 9.1,49.55",
  by_th: "10.05,50.55 10.2,50.48 10.4,50.4 10.6,50.33 10.75,50.25 10.85,50.38 11.05,50.38 11.15,50.33 11.27,50.28 11.4,50.4 11.45,50.52 11.62,50.4 11.8,50.42 11.93,50.42",
  by_sn: "11.93,50.42 12.05,50.33 12.1,50.32",
  th_sn: "11.93,50.42 12.1,50.55 12.25,50.65 12.32,50.8 12.48,50.9 12.62,50.98 12.48,51.06 12.28,51.08",
  th_st: "12.28,51.08 12.18,50.98 12.0,51.0 11.8,51.08 11.6,51.12 11.45,51.22 11.35,51.35 11.2,51.4 11.0,51.45 10.85,51.55 10.72,51.62 10.6,51.58",
  sn_st: "12.28,51.08 12.15,51.25 12.18,51.4 12.3,51.55 12.55,51.62 12.8,51.68 13.0,51.68 13.15,51.6",
  sn_bb: "13.15,51.6 13.3,51.42 13.55,51.42 13.85,51.38 14.05,51.5 14.3,51.55 14.55,51.57 14.73,51.58",
  st_bb: "13.15,51.6 13.12,51.82 12.85,51.97 12.55,52.02 12.35,52.1 12.25,52.25 12.28,52.45 12.3,52.62 12.22,52.82 12.0,52.92 11.8,52.97 11.57,53.04",
  bb_mv: "11.4,53.1 11.65,53.25 11.95,53.27 12.25,53.32 12.55,53.28 12.85,53.22 13.15,53.24 13.45,53.3 13.75,53.45 14.0,53.43 14.25,53.38 14.41,53.3",
  berlin: "13.09,52.45 13.12,52.58 13.3,52.66 13.45,52.68 13.55,52.62 13.66,52.55 13.76,52.45 13.7,52.38 13.5,52.36 13.3,52.4 13.15,52.4",
  bremen: "8.48,53.12 8.6,53.2 8.75,53.17 8.9,53.1 8.99,53.05 8.85,53.0 8.73,53.04 8.62,53.06",
  bremerhaven: "8.52,53.5 8.62,53.5 8.65,53.58 8.53,53.6",
};
/* Grenzen der Nachbarländer untereinander */
const NACHBARGRENZEN = [
  "3.37,51.37 3.8,51.21 4.25,51.37 4.8,51.47 5.1,51.45 5.5,51.3 5.83,51.15 5.75,50.95 5.7,50.75 6.02,50.75",
  "2.55,51.09 2.95,50.75 3.3,50.5 3.7,50.32 4.2,50.3 4.85,50.15 4.8,49.95 5.2,49.8 5.47,49.5 5.82,49.55",
  "5.82,49.55 5.75,49.8 5.95,50.13 6.13,50.13", "5.82,49.55 6.1,49.46 6.37,49.47",
  "7.59,47.59 7.4,47.43 7.0,47.38 6.95,47.25 6.7,47.0",
  "9.62,47.5 9.55,47.3 9.5,47.1 9.5,46.9",
  "13.84,48.77 14.05,48.6 14.7,48.58 15.0,49.0 15.3,48.98 16.0,48.75 16.55,48.8 16.94,48.62",
  "16.94,48.62 17.2,48.88 17.6,49.0 18.0,49.1 18.55,49.5",
  "14.82,50.87 15.0,50.98 15.25,50.98 15.8,50.75 16.2,50.65 16.4,50.55 16.3,50.4 16.55,50.15 16.95,50.25 17.2,50.35 17.7,50.3 17.95,50.05 18.55,49.92 18.85,49.5",
  "18.85,49.5 19.3,49.4 19.8,49.2 20.3,49.38 21.0,49.4",
  "16.94,48.62 17.0,48.1 17.15,48.0", "17.15,48.0 16.95,47.7 16.7,47.7 16.45,47.4 16.5,46.9",
  "17.15,48.0 17.8,47.75 18.75,47.8 18.9,48.05 19.6,48.2 20.3,48.3 21.0,48.4",
  "19.6,54.45 21.0,54.35 22.0,54.35",
];
/* Flüsse */
const FLUESSE = {
  rhein: "8.86,47.66 8.63,47.69 8.4,47.59 8.21,47.6 7.8,47.56 7.6,47.57 7.56,47.75 7.58,48.03 7.65,48.25 7.8,48.58 7.98,48.78 8.23,48.97 8.33,49.05 8.44,49.32 8.46,49.49 8.37,49.63 8.4,49.82 8.28,50.0 8.05,50.0 7.9,49.97 7.77,50.06 7.71,50.15 7.59,50.23 7.6,50.36 7.4,50.44 7.23,50.58 7.1,50.73 6.97,50.94 6.98,51.03 6.85,51.15 6.77,51.23 6.73,51.43 6.62,51.66 6.4,51.8 6.25,51.83 6.05,51.86 5.85,51.86 5.4,51.85 4.9,51.87 4.5,51.9 4.12,51.98",
  alpenrhein: "9.53,46.85 9.5,47.1 9.55,47.3 9.62,47.49",
  elbe: "15.83,50.21 15.2,50.03 14.75,50.15 14.47,50.35 14.25,50.5 14.04,50.66 14.21,50.78 14.15,50.92 13.94,50.96 13.74,51.05 13.47,51.16 13.29,51.31 13.0,51.56 12.85,51.8 12.65,51.86 12.24,51.86 12.04,51.86 11.88,51.98 11.65,52.13 11.75,52.35 11.97,52.54 12.07,52.83 11.75,53.0 11.45,53.08 11.25,53.14 10.95,53.27 10.57,53.37 10.3,53.45 9.99,53.54 9.75,53.56 9.48,53.62 9.42,53.79 9.2,53.86",
  donau: "8.5,47.95 8.82,47.98 9.22,48.09 9.72,48.28 9.99,48.4 10.27,48.45 10.78,48.72 11.18,48.73 11.43,48.76 11.89,48.92 12.1,49.02 12.57,48.88 12.96,48.83 13.47,48.57 13.9,48.45 14.29,48.31 14.9,48.2 15.33,48.23 15.6,48.41 16.0,48.33 16.37,48.21 17.11,48.14 17.63,47.75 18.2,47.75 18.74,47.8 18.97,47.79 19.05,47.5 19.0,47.2",
  main: "11.58,49.95 11.3,50.08 11.06,50.14 10.89,49.89 10.6,49.98 10.23,50.05 10.16,49.74 10.07,49.66 9.93,49.79 9.77,49.96 9.7,50.05 9.58,50.0 9.6,49.85 9.52,49.76 9.26,49.7 9.15,49.97 8.92,50.13 8.77,50.1 8.68,50.11 8.5,50.05 8.3,50.0",
  weser: "9.65,51.42 9.45,51.64 9.38,51.77 9.45,51.83 9.36,52.1 9.08,52.19 8.92,52.29 9.0,52.45 9.21,52.64 9.23,52.92 9.0,53.02 8.8,53.08 8.62,53.2 8.48,53.33 8.5,53.45",
  mosel: "6.18,49.12 6.17,49.36 6.37,49.47 6.37,49.55 6.5,49.71 6.64,49.75 6.75,49.82 6.9,49.85 7.07,49.92 7.12,49.95 7.18,50.03 7.17,50.15 7.35,50.25 7.6,50.36",
  neckar: "8.53,48.06 8.63,48.17 8.85,48.4 9.06,48.52 9.33,48.62 9.42,48.71 9.31,48.74 9.21,48.8 9.22,48.9 9.2,49.05 9.22,49.14 9.16,49.23 9.11,49.34 8.98,49.47 8.8,49.39 8.69,49.41 8.46,49.5",
};
const NEBENFLUESSE = {
  oder: "17.92,50.67 17.03,51.11 16.5,51.35 16.08,51.66 15.72,51.8 15.4,51.95 15.1,52.05 14.75,52.07 14.65,52.18 14.55,52.34 14.56,52.47 14.63,52.57 14.45,52.66 14.3,52.76 14.15,52.86 14.2,52.97 14.3,53.08 14.38,53.2 14.48,53.32 14.58,53.43 14.6,53.6",
  neisse: "14.82,50.87 14.99,51.15 15.03,51.28 14.9,51.45 14.72,51.55 14.65,51.73 14.72,51.95 14.75,52.07",
  weichsel: "19.07,52.65 18.6,53.01 18.43,53.35 18.75,53.48 18.78,54.09 18.95,54.36",
  saale: "11.92,50.31 11.55,50.5 11.37,50.65 11.59,50.93 11.81,51.15 11.97,51.48 11.74,51.8 11.88,51.98",
  havel: "13.14,53.18 13.24,52.75 13.2,52.54 13.06,52.4 12.56,52.41 12.34,52.61 12.07,52.83",
  spree: "14.6,51.2 14.33,51.76 13.9,51.94 13.65,52.3 13.4,52.52 13.2,52.54",
  isar: "11.26,47.44 11.56,47.76 11.58,48.14 11.75,48.4 12.15,48.54 12.95,48.78",
  inn: "11.4,47.27 12.17,47.58 12.12,47.86 12.23,48.06 12.52,48.25 13.04,48.26 13.47,48.57",
  lech: "10.7,47.57 10.88,48.05 10.9,48.37 10.85,48.7",
  ems: "8.7,51.85 8.3,51.85 7.99,51.95 7.61,52.09 7.44,52.28 7.32,52.52 7.29,52.69 7.4,53.08 7.45,53.23 7.27,53.31",
  werra: "10.42,50.57 10.23,50.81 10.05,51.19 9.65,51.42",
  fulda: "9.68,50.55 9.71,50.87 9.5,51.31 9.65,51.42",
  aller: "10.79,52.42 10.08,52.62 9.45,52.78 9.23,52.92",
  maas: "4.95,49.7 4.72,49.77 4.82,50.14 4.87,50.47 5.57,50.63 5.69,50.85 5.99,51.19 6.17,51.37 5.9,51.75 5.3,51.75 4.6,51.75",
  seine: "4.1,48.3 3.4,48.5 2.8,48.8 2.35,48.86 2.0,49.0 1.5,49.15 0.9,49.4 0.3,49.45",
  vltava: "14.47,48.97 14.3,49.4 14.4,49.8 14.42,50.08 14.47,50.35",
  aare: "7.45,46.95 7.53,47.21 8.05,47.39 8.23,47.6",
};

/* Projizierte Hilfen */
const ring = (namen) => pkt(namen.map((n) => DE[n]).join(" ")).filter((q, i, a) => !i || Math.hypot(q.x - a[i - 1].x, q.y - a[i - 1].y) > 0.05);

/* =====================================================================
   KULISSE — Papier, Nachbarländer, Deutschland mit Relief, Grenzen
   Wiederkehrende Formen stehen einmal in <defs> und werden mit <use>
   gezeichnet (die Datei bleibt klein, die Seite lädt schnell).
   ===================================================================== */
const USE = (id, extra = "") => `<use href="#${S.id(id)}" ${extra}/>`;
const tr = (x, y, s, sx) => `translate(${+x.toFixed(2)} ${+y.toFixed(2)}) scale(${+(sx == null ? s : sx).toFixed(3)} ${+s.toFixed(3)})`;
/* Zeichen: Hügel (Licht von links), Tanne, Laubbaum */
S.def(`<g id="${S.id("huegel")}"><path d="M-2 0 C-1.5 -1.5 -.5 -1.9 0 -1.9 C.6 -1.9 1.5 -1.4 2 0 Z" fill="#d9c08b"/><path d="M0 -1.9 C.6 -1.9 1.5 -1.4 2 0 L.3 0 C.5 -.7 .35 -1.4 0 -1.9 Z" fill="#b2925f"/><path d="M-1.6 -.6 C-1.2 -1.3 -.6 -1.6 -.2 -1.7" fill="none" stroke="#f3e5bd" stroke-width=".22"/></g>`);
S.def(`<g id="${S.id("tanne")}"><path d="M0 -2.7 L1 -.45 H-1 Z" fill="#567f48"/><path d="M0 -2.7 L1 -.45 H.15 Z" fill="#3a5f35"/><rect x="-.13" y="-.5" width=".26" height=".5" fill="#6b4a2a"/></g>`);
S.def(`<g id="${S.id("laub")}"><circle cx="0" cy="-1.35" r="1" fill="#82a95f"/><path d="M0 -2.35 A1 1 0 0 1 0 -.35 Z" fill="#5f8a47"/><rect x="-.13" y="-.45" width=".26" height=".45" fill="#6b4a2a"/></g>`);
{
  let g = `<rect x="-2" y="-2" width="${BR + 4}" height="${HO + 4}" fill="${NACHBAR}"/>`;
  /* Nachbarländer: leichte Geländetönung (Ardennen, Vogesen, Jura, Sudeten, Karpaten) */
  const NAEBEL = [[5.6, 50.1, 0.9, 0.35, -20, 0.45], [7.1, 48.3, 0.25, 0.75, -10, 0.45], [6.6, 47.15, 0.9, 0.2, -35, 0.4], [16.0, 50.6, 1.0, 0.25, -25, 0.4],
    [19.8, 49.25, 1.2, 0.3, 0, 0.45], [13.8, 48.95, 1.0, 0.25, -25, 0.3], [15.6, 49.5, 1.0, 0.35, 0, 0.2]];
  const BERG_N = S.rg("bergn", [[0, "#cdb98d", 0.85], [0.6, "#d8c9a0", 0.4], [1, "#e8dec7", 0]]);
  for (const [lo, la, rx, ry, w, a] of NAEBEL) { const [x, y] = P(lo, la); g += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rx * 20)}" ry="${r(ry * 31)}" transform="rotate(${w} ${r(x)} ${r(y)})" fill="${BERG_N}" opacity="${a}"/>`; }
  /* Grenzen der Nachbarn: gestrichelt */
  g += `<path d="${NACHBARGRENZEN.map((t) => weg(t, false)).join("")}" fill="none" stroke="#b39f7c" stroke-width=".45" stroke-dasharray="1.4 .9" stroke-linecap="round"/>`;
  S.hinten(g);
}
/* Deutschland: Fläche, goldener Grenzsaum innen, Relief */
const DE_D = weg(ring(DE_RING));
S.def(`<path id="${S.id("de")}" d="${DE_D}"/>`);
S.def(`<clipPath id="${S.id("declip")}">${USE("de")}</clipPath>`);
/* Gebirge: [Länge, Breite, rx°, ry°, Winkel, Fleck (berg/wald), Stärke, Zeichen, Anzahl, Größe] */
const GEBIRGE = [
  [10.62, 51.76, 0.42, 0.11, -14, "berg", 1, "huegel+tanne", 16, 0.95],        // Harz
  [8.15, 48.3, 0.22, 0.62, 4, "wald", 1, "tanne", 34, 0.95],                   // Schwarzwald
  [9.45, 48.45, 0.95, 0.13, -22, "berg", 0.7, "huegel", 14, 0.85],             // Schwäbische Alb
  [10.75, 50.72, 0.6, 0.12, -32, "wald", 0.9, "tanne", 18, 0.85],              // Thüringer Wald
  [13.1, 50.6, 0.95, 0.1, -12, "berg", 0.8, "huegel+tanne", 18, 0.85],         // Erzgebirge
  [13.1, 49.05, 0.75, 0.16, -27, "wald", 0.9, "tanne", 22, 0.85],              // Bayerischer Wald
  [6.75, 50.3, 0.45, 0.22, 0, "berg", 0.6, "huegel+laub", 10, 0.8],            // Eifel
  [7.15, 49.85, 0.5, 0.13, -20, "berg", 0.55, "huegel", 6, 0.75],              // Hunsrück
  [8.25, 50.22, 0.4, 0.09, -15, "berg", 0.55, "huegel", 5, 0.75],              // Taunus
  [8.25, 51.2, 0.5, 0.17, 0, "wald", 0.65, "laub+tanne", 12, 0.8],             // Sauerland
  [9.98, 50.45, 0.18, 0.13, 0, "berg", 0.55, "huegel", 3, 0.75],               // Rhön
  [9.4, 50.0, 0.25, 0.14, 0, "wald", 0.5, "laub", 6, 0.75],                    // Spessart
  [8.95, 49.65, 0.2, 0.15, 0, "wald", 0.5, "laub", 4, 0.75],                   // Odenwald
  [7.85, 49.3, 0.2, 0.2, 0, "wald", 0.55, "laub+tanne", 6, 0.75],              // Pfälzerwald
  [11.85, 50.05, 0.15, 0.1, 0, "berg", 0.55, "tanne", 3, 0.75],                // Fichtelgebirge
  [12.35, 49.6, 0.15, 0.35, 10, "wald", 0.5, "tanne", 6, 0.75],                // Oberpfälzer Wald
  [8.4, 52.05, 0.55, 0.05, -35, "wald", 0.55, "laub", 5, 0.7],                 // Teutoburger Wald
  [9.5, 51.95, 0.25, 0.15, 0, "berg", 0.4, "huegel", 3, 0.7],                  // Weserbergland
  [13.95, 50.9, 0.25, 0.08, 0, "berg", 0.5, "huegel", 3, 0.75],                // Elbsandstein
  [7.1, 48.3, 0.2, 0.6, -10, "-", 0, "tanne", 12, 0.7, 0.45],                  // Vogesen (blass)
  [5.6, 50.1, 0.8, 0.3, -20, "-", 0, "huegel+laub", 10, 0.7, 0.45],            // Ardennen
  [16.0, 50.6, 0.9, 0.18, -25, "-", 0, "huegel+tanne", 10, 0.75, 0.45],        // Sudeten
  [13.8, 48.95, 0.8, 0.18, -25, "-", 0, "tanne", 8, 0.7, 0.45],                // Böhmerwald
  [19.6, 49.3, 1.0, 0.22, 0, "-", 0, "huegel+tanne", 10, 0.8, 0.45],           // Karpaten
  [6.6, 47.2, 0.8, 0.12, -35, "-", 0, "huegel", 6, 0.75, 0.45],                // Jura
];
{
  let g = `<use href="#${S.id("de")}" fill="#b89a62" opacity=".35" transform="translate(.5 .7)" filter="${fl("weich1")}"/>` + USE("de", `fill="${LAND}"`);
  const BERG = S.rg("berg", [[0, "#cbb07a", 0.75], [0.55, "#d8c28d", 0.35], [1, "#dfe3b2", 0]]);
  const WALD = S.rg("wald", [[0, "#9db878", 0.7], [0.6, "#b2c98e", 0.3], [1, "#dfe3b2", 0]]);
  let zeichen = [];
  for (const [lo, la, rx, ry, w, f, a, art, n, gr, blass] of GEBIRGE) {
    const [x, y] = P(lo, la), wr = w * Math.PI / 180;
    if (f !== "-") g += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rx * 20.3)}" ry="${r(ry * 31.1)}" transform="rotate(${w} ${r(x)} ${r(y)})" fill="${f === "berg" ? BERG : WALD}" opacity="${a}"/>`;
    const arten = art.split("+");
    for (let i = 0; i < n; i++) {
      let u, v; do { u = rnd() * 2 - 1; v = rnd() * 2 - 1; } while (u * u + v * v > 0.85);
      const dx = u * rx * 20.3, dy = v * ry * 31.1;
      zeichen.push({ x: x + dx * Math.cos(wr) - dy * Math.sin(wr), y: y + dx * Math.sin(wr) + dy * Math.cos(wr) + 1, art: arten[i % arten.length], s: gr * (0.8 + rnd() * 0.4), o: blass || 1 });
    }
  }
  zeichen.sort((a, b) => a.y - b.y);
  /* blasse Zeichen der Nachbarn liegen unter Deutschland; deshalb zwei Durchgänge */
  S.hinten(zeichen.filter((z) => z.o < 1).map((z) => `<use href="#${S.id(z.art)}" transform="${tr(z.x, z.y, z.s, rnd() < 0.5 ? -z.s : z.s)}" opacity=".45"/>`).join(""));
  g += zeichen.filter((z) => z.o === 1).map((z) => `<use href="#${S.id(z.art)}" transform="${tr(z.x, z.y, z.s, rnd() < 0.5 && z.art !== "huegel" ? -z.s : z.s)}"/>`).join("");
  /* goldener Saum innen an der Grenze */
  g += USE("de", `fill="none" stroke="#e1b552" stroke-width="2.6" opacity=".35" clip-path="url(#${S.id("declip")})"`);
  S.hinten(g);
}
/* Seen, Haff und Bodden auf dem Land */
{
  let g = "";
  for (const t of Object.values(GEWAESSER)) g += `<path d="${weg(t)}" fill="${SEEFARBE}" stroke="#6ea9c4" stroke-width=".25"/>`;
  /* Peenestrom als schmaler Wasserlauf, Hindenburgdamm nach Sylt */
  g += `<path d="${weg("13.78,54.13 13.77,54.05 13.82,53.97 13.84,53.88", false)}" fill="none" stroke="${SEEFARBE}" stroke-width=".7"/>`;
  g += `<path d="${weg("8.48,54.9 8.56,54.895 8.63,54.89", false)}" fill="none" stroke="#b9a37a" stroke-width=".35"/>`;
  S.hinten(g);
}
/* Grenzen der Bundesländer */
{
  const d = Object.entries(LAENDER).map(([k, t]) => weg(t, ["hh", "berlin", "bremen", "bremerhaven"].includes(k))).join("");
  S.def(`<path id="${S.id("laender")}" d="${d}"/>`);
  S.hinten(USE("laender", `fill="none" stroke="#fffaf0" stroke-width=".9" opacity=".55"`) + USE("laender", `fill="none" stroke="${GRENZE}" stroke-width=".38" stroke-dasharray="1.6 .7 .3 .7" stroke-linecap="round" opacity=".9"`));
  /* Stadtstaaten leicht getönt */
  S.hinten(`<path d="${["hh", "berlin", "bremen", "bremerhaven"].map((k) => weg(LAENDER[k])).join("")}" fill="#d9b98a" opacity=".35"/>`);
}
/* Nebenflüsse (blass) und die Flüsse, die keine eigenen Teile sind */
{
  let g = `<path d="${Object.values(NEBENFLUESSE).map((t) => weg(t, false)).join("")}" fill="none" stroke="${FLUSS}" stroke-width=".42" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>`;
  for (const k of ["donau", "main", "weser", "mosel", "neckar"]) {
    const breit = k === "donau" ? 0.95 : k === "main" || k === "weser" ? 0.72 : 0.62;
    S.def(`<path id="${S.id("f_" + k)}" d="${weg(FLUESSE[k], false)}"/>`);
    g += USE("f_" + k, `fill="none" stroke="#e9f4f8" stroke-width="${r(breit + 0.7)}" stroke-linecap="round" stroke-linejoin="round" opacity=".6"`);
    g += USE("f_" + k, `fill="none" stroke="${FLUSS}" stroke-width="${breit}" stroke-linecap="round" stroke-linejoin="round"`);
  }
  S.hinten(g);
}
/* Deutschlands Außengrenze kräftig */
{
  const land = ["dk", "pl1+pl2+pl3+cz1+cz2+at+by_see", "ch+fr1+fr2+fr3+lu1+lu2+be1+be2+nl1+nl2"].map((z) => weg(pkt(z.split("+").map((n) => DE[n]).join(" ")), false)).join("");
  S.def(`<path id="${S.id("grenze")}" d="${land}"/>`);
  S.hinten(USE("grenze", `fill="none" stroke="#fff6e0" stroke-width="1.5" opacity=".7"`) + USE("grenze", `fill="none" stroke="#7d5f35" stroke-width=".62" stroke-linejoin="round"`));
}


/* =====================================================================
   TEILE — 1: die Meere (eigene Küstenlinie, Inseln als Löcher)
   ===================================================================== */
const text = (x, y, t, gr, farbe, extra = "") => `<text x="${r(x)}" y="${r(y)}" font-size="${gr}" text-anchor="middle" fill="${farbe}" font-family="Georgia,'Times New Roman',serif" ${extra}>${t}</text>`;
const halo = (x, y, t, gr, farbe, hf = "#fbf6e8", extra = "", hb = 0.9) => `<text x="${r(x)}" y="${r(y)}" font-size="${gr}" text-anchor="middle" fill="${farbe}" stroke="${hf}" stroke-width="${hb}" stroke-linejoin="round" paint-order="stroke" font-family="Georgia,'Times New Roman',serif" ${extra}>${t}</text>`;
S.def(`<pattern id="${S.id("wellen")}" width="9" height="5" patternUnits="userSpaceOnUse"><path d="M.5 3 q1.1 -1.1 2.2 0 t2.2 0" fill="none" stroke="#fff" stroke-width=".28" opacity=".55"/></pattern>`);
/* Punkte außerhalb des Bildes an den Rand legen (als Ecke), damit das Meer nicht übersteht */
const imBild = (pts) => pts.map((q) => { const x = Math.max(-0.4, Math.min(BR + 0.4, q.x)), y = Math.max(-0.4, Math.min(HO + 0.4, q.y)); return x !== q.x || y !== q.y ? { x, y, hart: true } : q; })
  .filter((q, i, a) => !i || Math.hypot(q.x - a[i - 1].x, q.y - a[i - 1].y) > 0.05);
/* Ausschnitt eines Linienzugs zwischen zwei Stützpunkten (einschließlich) */
const teilzug = (txt, von, bis) => { const t = txt.trim().split(/\s+/).map((q) => q.replace("!", "")); const i = t.indexOf(von), j = t.indexOf(bis, i); if (i < 0 || j < 0) throw new Error("teilzug " + von + " " + bis); return t.slice(i, j + 1).join(" "); };
const umkehr = (txt) => txt.trim().split(/\s+/).reverse().join(" ");
function meerBild(id, aussen, inseln) {
  const dA = weg(imBild(pkt(aussen))), dI = Object.values(inseln).map((t) => weg(t)).join("");
  S.def(`<path id="${S.id(id)}" d="${dA + dI}" fill-rule="evenodd" clip-rule="evenodd"/>`);
  S.def(`<path id="${S.id(id + "k")}" d="${dA}"/>`);
  S.def(`<clipPath id="${S.id(id + "clip")}">${USE(id)}</clipPath>`);
  let k = USE(id, `fill="${MEER}"`);
  /* Wasserlinien an der Küste (wie auf alten Karten), nur im Meer; um die Inseln nur ein schmaler Saum */
  k += `<g clip-path="url(#${S.id(id + "clip")})" fill="none" stroke-linejoin="round">${USE(id + "k", `stroke="#c8e6ee" stroke-width="4.2" opacity=".45"`)}${USE(id + "k", `stroke="#d9eff4" stroke-width="2.2" opacity=".55"`)}${USE(id, `stroke="#eef9fb" stroke-width="1" opacity=".75"`)}</g>`;
  k += USE(id, `fill="url(#${S.id("wellen")})" opacity=".55"`);
  k += USE(id, `fill="none" stroke="#5b8fa8" stroke-width=".38" stroke-linejoin="round"`);
  S.hinten(k);
}
meerBild("nordsee", NORDSEE, INSELN_NORD);
meerBild("ostsee", OSTSEE, INSELN_OST);
/* Die Teile „Nordsee“ und „Ostsee“ fangen nur die deutschen Gewässer (Deutsche Bucht, westliche
   Ostsee): ein Tipp auf Paris, Brüssel oder Kopenhagen antwortet nie mit einem Meer. */
const N_TEIL = "5.5,55.6 " + teilzug(NORDSEE, "8.58,55.6", "5.55,53.26") + " 5.5,53.3";
const O_TEIL = teilzug(OSTSEE, "9.43,54.84", "14.23,53.93") + " 14.35,54.1 14.4,54.45 13.9,54.85 13.2,54.85 12.6,54.62 12.1,54.53 11.5,54.57 10.95,54.63 10.4,54.75 9.9,54.88";
const ohne = (o, weg_) => Object.fromEntries(Object.entries(o).filter(([k]) => !weg_.includes(k)));
function meerTeil(id, aussen, inseln, label, tipp, worte) {
  const d = weg(imBild(pkt(aussen))) + Object.values(inseln).map((t) => weg(t)).join("");
  S.teil(Object.assign({ x: 0, y: 0, kunst: `<path d="${d}" fill-rule="evenodd" fill="#fff" fill-opacity=".003"/>` + label, tipp }, worte));
}
meerTeil("nordsee", N_TEIL, ohne(INSELN_NORD, ["texel", "vlieland", "terschelling", "romo"]),
  (() => { const [x, y] = P(5.9, 54.6); return halo(x, y, "N o r d s e e", 6.2, "#2f6f93", "#cfe6ee", `font-style="italic" letter-spacing=".6"`, 0.6); })(),
  "Die Nordsee hat Ebbe und Flut. Vor der Küste liegt das Wattenmeer.",
  { id: "nordsee", de: "die Nordsee", syl: "NORD-see", it: "il Mare del Nord", itSyl: "MA-re del NORD", en: "North Sea" });
meerTeil("ostsee", O_TEIL, { fehmarn: INSELN_OST.fehmarn, poel: INSELN_OST.poel, ruegen: INSELN_OST.ruegen, hiddensee: INSELN_OST.hiddensee },
  (() => { const [x, y] = P(13.4, 54.93); return halo(x, y, "O s t s e e", 5.6, "#2f6f93", "#cfe6ee", `font-style="italic" letter-spacing=".6"`, 0.6); })(),
  "Die Ostsee ist ein Binnenmeer. Ihr Wasser ist wenig salzig.",
  { id: "ostsee", de: "die Ostsee", syl: "OST-see", it: "il Mar Baltico", itSyl: "MAR BAL-ti-co", en: "Baltic Sea" });

/* =====================================================================
   WAHRZEICHEN — kleine Bilder, Fußpunkt (0,0), nach oben negativ
   ===================================================================== */
const G = {
  sand: S.lg("sand", [[0, "#f6e8c6"], [0.55, "#e3cb9b"], [1, "#b89766"]], 0, 0, 1, 0),
  ziegel: S.lg("ziegel", [[0, "#bd6446"], [0.55, "#9a4630"], [1, "#6c2d1f"]], 0, 0, 1, 0),
  dunkel: S.lg("dunkel", [[0, "#8a847b"], [0.5, "#615b54"], [1, "#3c3833"]], 0, 0, 1, 0),
  porta: S.lg("porta", [[0, "#7a6d60"], [0.55, "#564b41"], [1, "#352d27"]], 0, 0, 1, 0),
  kupfer: S.lg("kupfer", [[0, "#b5e0c9"], [0.45, "#79b79c"], [1, "#3f7562"]], 0, 0, 1, 0),
  schiefer: S.lg("schiefer", [[0, "#7b8791"], [0.5, "#4c5761"], [1, "#2a3138"]], 0, 0, 1, 0),
  glas: S.lg("glas", [[0, "#f2fafd"], [0.5, "#bcd9e8"], [1, "#7fa9c4"]]),
  glas2: S.lg("glas2", [[0, "#d7e9f3"], [0.5, "#9fc0d6"], [1, "#6b8fab"]], 0, 0, 1, 0),
  bronze: S.lg("bronze", [[0, "#d2aa62"], [0.5, "#94703a"], [1, "#5c4220"]], 0, 0, 1, 0),
  patina: S.lg("patina", [[0, "#9bb59c"], [0.5, "#5f7e66"], [1, "#3c5544"]], 0, 0, 1, 0),
  weiss: S.lg("weiss", [[0, "#ffffff"], [0.6, "#eeeae2"], [1, "#c8c1b4"]], 0, 0, 1, 0),
  rotsand: S.lg("rotsand", [[0, "#e08f74"], [0.55, "#bb604a"], [1, "#874131"]], 0, 0, 1, 0),
  beton: S.lg("beton", [[0, "#fbfbf8"], [0.5, "#dcdcd5"], [1, "#a3a39b"]], 0, 0, 1, 0),
  gelb: S.lg("gelb", [[0, "#ffe9a0"], [0.6, "#f0c95c"], [1, "#c69733"]], 0, 0, 1, 0),
  dachrot: S.lg("dachrot", [[0, "#e07a52"], [0.6, "#b74b2c"], [1, "#82321d"]], 0, 0, 1, 0),
  gruen: S.lg("gruen", [[0, "#b9d58a"], [1, "#7c9f55"]]),
  wald: S.lg("waldg", [[0, "#6f9a55"], [1, "#3f6a35"]]),
  wasser: S.lg("wasser", [[0, "#b3dcec"], [1, "#5f9fbe"]]),
  silber: S.rg("silber", [[0, "#ffffff"], [0.45, "#d5dbe0"], [1, "#7d8891"]], 0.35, 0.35, 0.7),
  fels: S.lg("fels", [[0, "#cf9a72"], [0.6, "#a8714f"], [1, "#7a4e35"]], 0, 0, 1, 0),
  granit: S.lg("granit", [[0, "#a4988a"], [0.55, "#7d7266"], [1, "#544a40"]], 0, 0, 1, 0),
};
const GLOW = S.rg("glow", [[0, "#fffbec", 0.85], [0.6, "#fffbec", 0.45], [1, "#fffbec", 0]]);
const SCHATTEN = S.rg("schatten", [[0, "#3b2a10", 0.4], [1, "#3b2a10", 0]]);
const fen = (x, y, w, h, f = "#3a2a20", o = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${o < 1 ? ` opacity="${o}"` : ""}/>`;
const reihe = (x0, y, n, dx, w, h, f, rr = 0) => { let s = ""; for (let i = 0; i < n; i++) s += `<rect x="${r(x0 + i * dx)}" y="${y}" width="${w}" height="${h}" rx="${rr}" fill="${f}"/>`; return s; };
const kegel = (cx, y, w, h, f) => `<path d="M${r(cx - w / 2)} ${y} L${cx} ${r(y - h)} L${r(cx + w / 2)} ${y} Z" fill="${f}"/>`;

const ICON = {
  /* Elbphilharmonie: Backsteinsockel (Kaispeicher A), Glasaufbau mit Wellendach */
  hamburg: [12, 10.4, () => {
    const dach = "Q-5.2 -8.7 -4.1 -7.6 Q-2.9 -9.8 -1.4 -8.3 Q0.2 -10.4 1.9 -8.6 Q3.4 -10 4.6 -8.1 Q5.3 -7.3 6 -7.2";
    let k = `<rect x="-6" y="-4.3" width="12" height="4.3" fill="${G.ziegel}"/>`;
    for (let i = 1; i < 4; i++) k += `<path d="M-5.7 ${r(-i * 1.05)} H5.7" stroke="#5e2618" stroke-width=".16" opacity=".75"/>`;
    k += `<path d="M-6 -4.3 V-7.1 ${dach} V-4.3 Z" fill="${G.glas}"/>`;
    for (let x = -5; x <= 5; x += 1.25) k += `<path d="M${x} -4.4 V-7.3" stroke="#fff" stroke-width=".2" opacity=".7"/>`;
    for (let x = -4.4; x <= 4.4; x += 2.2) k += `<path d="M${r(x)} -6.4 a.45 .45 0 0 1 .9 0" fill="none" stroke="#6d8fa6" stroke-width=".22"/>`;
    k += `<path d="M-6 -7.1 ${dach}" fill="none" stroke="#fff" stroke-width=".5" stroke-linecap="round"/>`;
    k += `<path d="M-6 -4.3 H6" stroke="#f3f7f8" stroke-width=".4"/>`;
    return k;
  }],
  /* Holstentor: zwei Rundtürme mit Kegeldächern, Mittelbau mit Tor und Inschriftband */
  luebeck: [10.4, 11.8, () => {
    let k = `<rect x="-2.3" y="-6.7" width="4.6" height="6.7" fill="${G.ziegel}"/><path d="M-2.5 -6.7 L0 -9.3 L2.5 -6.7 Z" fill="${G.schiefer}"/>`;
    for (const s of [-1, 1]) {
      const cx = s * 3.3;
      k += `<rect x="${r(cx - 1.9)}" y="-7.3" width="3.8" height="7.3" rx=".4" fill="${G.ziegel}"/>`;
      k += `<path d="M${r(cx - 2.15)} -7.3 Q${cx} -6.8 ${r(cx + 2.15)} -7.3 L${cx} -11.8 Z" fill="${G.schiefer}"/>`;
      for (const y of [-2.3, -4.6]) k += `<path d="M${r(cx - 1.9)} ${y} H${r(cx + 1.9)}" stroke="#2d2622" stroke-width=".32" opacity=".6"/>`;
      k += `<rect x="${r(cx - 0.35)}" y="-6.4" width=".7" height="1.1" rx=".3" fill="#2e1d14"/><rect x="${r(cx - 0.35)}" y="-3.9" width=".7" height="1" rx=".3" fill="#2e1d14"/>`;
    }
    k += `<rect x="-2.3" y="-4.4" width="4.6" height=".6" fill="#e3c98f"/><path d="M-1 0 V-1.9 Q0 -3.1 1 -1.9 V0 Z" fill="#26170f"/>`;
    return k;
  }],
  /* Bremer Stadtmusikanten: Esel, Hund, Katze, Hahn übereinander (Bronze) */
  bremen: [7, 10.6, () => {
    const B = G.bronze;
    let k = `<rect x="-2.6" y="-1.1" width="5.2" height="1.1" rx=".2" fill="#bdb09a"/><rect x="-2.6" y="-1.1" width="5.2" height=".3" fill="#d9cfbd"/>`;
    k += `<path d="M-2.2 -1.1 V-2.9 M-1.4 -1.1 V-2.8 M1.3 -1.1 V-2.8 M2.1 -1.1 V-2.9" stroke="#6b4c25" stroke-width=".5" stroke-linecap="round"/>`;
    k += `<path d="M-2.6 -3.2 Q-2.6 -4.5 0 -4.5 Q2.6 -4.5 2.8 -3.4 Q3.3 -3.0 3.2 -2.4 Q2.6 -2.5 2.4 -2.7 Q0 -2.4 -2.2 -2.7 Z" fill="${B}"/>`;
    k += `<path d="M-2.2 -4.1 L-3.2 -5.5 L-4.2 -5.3 L-4.1 -4.6 L-3.1 -4.4 L-2.4 -3.1 Z" fill="${B}"/>`;
    k += `<path d="M-3.25 -5.45 L-3.05 -6.9 L-2.75 -5.45 Z M-3.65 -5.4 L-3.75 -6.75 L-3.35 -5.4 Z" fill="${B}"/>`;
    k += `<path d="M-1.4 -4.5 V-5.2 M-0.7 -4.5 V-5.2 M0.9 -4.5 V-5.2 M1.5 -4.5 V-5.2" stroke="#6b4c25" stroke-width=".38"/>`;
    k += `<path d="M-1.7 -5.2 Q-1.7 -6.1 0 -6.1 Q1.8 -6.1 1.9 -5.4 L2.6 -5.9 L2.3 -5.1 Q0 -4.9 -1.7 -5.2 Z" fill="${B}"/>`;
    k += `<path d="M-1.5 -5.9 L-2.4 -6.6 L-3.1 -6.4 L-2.8 -5.9 L-2.0 -5.6 Z" fill="${B}"/><path d="M-2.2 -6.5 L-2.0 -7.1 L-1.8 -6.5 Z" fill="${B}"/>`;
    k += `<path d="M-1.1 -6.1 Q-0.6 -7.6 0.4 -7.6 Q1.2 -7.5 1.1 -6.1 Z" fill="${B}"/><circle cx="-1.1" cy="-7.4" r=".55" fill="${B}"/>`;
    k += `<path d="M-1.55 -7.75 L-1.45 -8.3 L-1.2 -7.85 M-0.95 -7.85 L-0.75 -8.3 L-0.65 -7.7" fill="${B}"/><path d="M1.1 -6.5 Q1.9 -7.0 1.7 -7.8" fill="none" stroke="#6b4c25" stroke-width=".3"/>`;
    k += `<path d="M-0.2 -7.6 V-8.2 M0.3 -7.6 V-8.2" stroke="#6b4c25" stroke-width=".25"/>`;
    k += `<path d="M-0.8 -8.2 Q-0.9 -9.4 0.2 -9.3 Q1.3 -9.0 1.2 -8.2 Z" fill="${B}"/><path d="M0.9 -8.6 Q2.3 -9.7 1.9 -10.6 Q1.5 -9.5 0.9 -9.1 Z" fill="${B}"/>`;
    k += `<circle cx="-0.6" cy="-9.6" r=".42" fill="${B}"/><path d="M-0.95 -10 L-0.75 -10.6 L-0.5 -10.1 L-0.35 -10.5 L-0.2 -9.9 Z" fill="#b2442c"/><path d="M-1 -9.55 L-1.45 -9.45 L-1 -9.35 Z" fill="#c9a033"/>`;
    k += `<path d="M-2.4 -3.6 Q0 -4.3 2.6 -3.7" fill="none" stroke="#f1d79b" stroke-width=".25" opacity=".7"/>`;
    return k;
  }],
  /* Neues Rathaus Hannover: breiter Bau, Mittelturm mit grüner Kuppel */
  hannover: [13.4, 11.2, () => {
    let k = `<rect x="-6.6" y="-3.6" width="13.2" height="3.6" fill="${G.sand}"/><path d="M-6.8 -3.6 L-6.2 -4.5 H6.2 L6.8 -3.6 Z" fill="${G.schiefer}"/>`;
    for (const s of [-1, 1]) { const cx = s * 5.4; k += `<rect x="${r(cx - 1.2)}" y="-4.8" width="2.4" height="4.8" fill="${G.sand}"/>` + kegel(cx, -4.8, 2.6, 1.8, G.kupfer); }
    k += `<rect x="-1.7" y="-5.6" width="3.4" height="5.6" fill="${G.sand}"/><rect x="-1.25" y="-7.3" width="2.5" height="1.7" fill="${G.sand}"/>`;
    k += `<path d="M-1.6 -7.3 Q-1.7 -10 0 -10.4 Q1.7 -10 1.6 -7.3 Z" fill="${G.kupfer}"/><rect x="-.35" y="-11.2" width=".7" height=".9" fill="${G.kupfer}"/><path d="M-.12 -11.2 L0 -12 L.12 -11.2 Z" fill="#c9a033"/>`;
    k += reihe(-5.9, -2.6, 13, 0.92, 0.4, 0.9, "#6b5a46") + reihe(-1, -4.8, 3, 0.8, 0.4, 0.9, "#6b5a46") + `<path d="M-0.6 0 V-1.3 Q0 -2 0.6 -1.3 V0 Z" fill="#4a3a2a"/>`;
    k += `<path d="M-1.6 -7.3 Q-1.5 -9.6 0 -10.2" fill="none" stroke="#e6fff2" stroke-width=".25" opacity=".7"/>`;
    return k;
  }],
  /* Brandenburger Tor (sechs Säulen, Quadriga) vor dem Fernsehturm */
  berlin: [11, 14.6, () => {
    const tx = 3.9;
    let k = `<path d="M${tx - 0.48} -4 L${tx - 0.26} -9.7 L${tx + 0.26} -9.7 L${tx + 0.48} -4 Z" fill="${G.beton}" stroke="#77776f" stroke-width=".16"/>`;
    k += `<circle cx="${tx}" cy="-10.6" r="1.3" fill="${G.silber}"/><path d="M${tx - 1.28} -10.5 H${tx + 1.28}" stroke="#7c8790" stroke-width=".18"/>`;
    k += `<rect x="${tx - 0.18}" y="-12.6" width=".36" height="0.75" fill="${G.beton}"/><path d="M${tx} -14.6 V-11.9" stroke="#c43a2c" stroke-width=".22" stroke-dasharray=".45 .35"/>`;
    const x0 = -1.3;
    k += `<rect x="${x0 - 5.2}" y="-2.7" width="1.6" height="2.7" fill="${G.sand}"/><rect x="${x0 + 3.6}" y="-2.7" width="1.6" height="2.7" fill="${G.sand}"/>`;
    k += `<rect x="${x0 - 4.3}" y="-0.5" width="8.6" height=".5" fill="${G.sand}"/>`;
    k += `<rect x="${x0 - 4.1}" y="-4.2" width="8.2" height="3.7" fill="#5d5145" opacity=".55"/>`;
    for (let i = 0; i < 6; i++) k += `<rect x="${r(x0 - 3.95 + i * 1.5)}" y="-4.2" width=".62" height="3.7" fill="${G.sand}"/>`;
    k += `<rect x="${x0 - 4.4}" y="-5.1" width="8.8" height=".9" fill="${G.sand}"/><path d="M${x0 - 4.4} -4.4 H${x0 + 4.4}" stroke="#a88f68" stroke-width=".15"/>`;
    k += `<rect x="${x0 - 2.3}" y="-5.9" width="4.6" height=".8" fill="${G.sand}"/>`;
    k += `<path d="M${x0 - 1.5} -5.9 L${x0 - 1.3} -6.6 L${x0 - 0.9} -6.4 L${x0 - 0.7} -7.0 L${x0 - 0.3} -6.6 L${x0} -7.6 L${x0 + 0.3} -6.6 L${x0 + 0.7} -7.0 L${x0 + 0.9} -6.4 L${x0 + 1.3} -6.6 L${x0 + 1.5} -5.9 Z" fill="${G.patina}"/>`;
    return k;
  }],
  /* Schloss Sanssouci auf den Weinbergterrassen */
  potsdam: [12.6, 7.8, () => {
    let k = "";
    for (let i = 0; i < 3; i++) {
      const w = 12.4 - i * 1.6, y = -(i + 1) * 1.15;
      k += `<rect x="${r(-w / 2)}" y="${r(y)}" width="${r(w)}" height="1.15" fill="${G.gruen}"/>`;
      for (let x = -w / 2 + 0.5; x < w / 2 - 0.5; x += 0.85) k += `<path d="M${r(x)} ${r(y + 1.1)} v-.55 a.25 .25 0 0 1 .5 0 v.55 Z" fill="#46705a" opacity=".85"/>`;
    }
    k += `<rect x="-.6" y="-3.45" width="1.2" height="3.45" fill="#efe4c8"/>`;
    k += `<rect x="-4.6" y="-5.3" width="9.2" height="1.85" fill="${G.gelb}"/><rect x="-4.7" y="-5.55" width="9.4" height=".3" fill="#7d8d82"/>`;
    k += reihe(-4.2, -5.0, 11, 0.8, 0.35, 1.2, "#8a6a3a", 0.15);
    k += `<rect x="-1.15" y="-5.7" width="2.3" height="2.25" rx=".3" fill="${G.gelb}"/><path d="M-1.35 -5.7 Q-1.35 -7.3 0 -7.6 Q1.35 -7.3 1.35 -5.7 Z" fill="${G.kupfer}"/><path d="M-.15 -7.6 h.3 v-.4 h-.3 Z" fill="#c9a033"/>`;
    return k;
  }],
  /* Magdeburger Dom: zwei Westtürme mit achteckigem Aufsatz und Spitzhelm */
  magdeburg: [8, 13, () => {
    let k = `<rect x="1" y="-5.2" width="3.4" height="5.2" fill="${G.granit}"/><path d="M0.8 -5.2 L2.7 -6.6 L4.6 -5.2 Z" fill="${G.schiefer}"/>`;
    k += `<rect x="-1" y="-6.4" width="2" height="6.4" fill="${G.granit}"/><circle cx="0" cy="-4.4" r=".6" fill="#3d3530"/>`;
    for (const s of [-1, 1]) {
      const cx = s * 1.75;
      k += `<rect x="${r(cx - 1.1)}" y="-8.6" width="2.2" height="8.6" fill="${G.granit}"/><rect x="${r(cx - 0.85)}" y="-9.9" width="1.7" height="1.3" fill="${G.granit}"/>`;
      k += kegel(cx, -9.9, 1.9, 3.1, G.schiefer) + `<path d="M${cx} -13 v-.4" stroke="#c9a033" stroke-width=".22"/>`;
      k += reihe(cx - 0.55, -7.6, 2, 0.75, 0.35, 1.2, "#3d3530", 0.17) + reihe(cx - 0.55, -5.2, 2, 0.75, 0.35, 1.2, "#3d3530", 0.17);
    }
    k += `<path d="M-0.55 0 V-1.6 Q0 -2.4 0.55 -1.6 V0 Z" fill="#2c2420"/>`;
    return k;
  }],
  /* Völkerschlachtdenkmal: wuchtiger Granitbau mit Kuppel und Kriegerkranz, Wasserbecken davor */
  leipzig: [11, 9.6, () => {
    let k = `<rect x="-5.5" y="-0.7" width="11" height=".7" rx=".3" fill="${G.wasser}"/>`;
    k += `<path d="M-5 -0.7 L-4.2 -2.1 H4.2 L5 -0.7 Z" fill="${G.granit}"/>`;
    k += `<path d="M-3.6 -2.1 L-3.0 -6.0 H3.0 L3.6 -2.1 Z" fill="${G.granit}"/>`;
    k += `<path d="M-1 -2.1 V-4.8 Q0 -5.7 1 -4.8 V-2.1 Z" fill="#3e352d"/><path d="M-.45 -4.7 L0 -5.2 L.45 -4.7 L.3 -3 H-.3 Z" fill="#8a7d6c"/>`;
    k += `<path d="M-3.1 -6 Q-3.1 -8.2 0 -8.8 Q3.1 -8.2 3.1 -6 Z" fill="${G.granit}"/>`;
    let z = "M-3.1 -6.1"; for (let i = 0; i <= 10; i++) { const x = -3.1 + i * 0.62; z += ` L${r(x)} ${r(-6.6 - (i % 2 ? 0.55 : 0))}`; } k += `<path d="${z} L3.1 -6.1 Z" fill="#6c6156"/>`;
    k += `<path d="M-.15 -8.8 v-.8 h.3 v.8 Z" fill="#6c6156"/>`;
    return k;
  }],
  /* Frauenkirche Dresden: „Steinerne Glocke“ mit Laterne und goldenem Kreuz */
  dresden: [7.4, 12.2, () => {
    let k = `<rect x="-3" y="-4.4" width="6" height="4.4" fill="${G.sand}"/>`;
    for (const s of [-1, 1]) k += `<rect x="${r(s * 3.05 - 0.7)}" y="-5.6" width="1.4" height="5.6" fill="${G.sand}"/><path d="M${r(s * 3.05 - 0.75)} -5.6 Q${r(s * 3.05)} -6.6 ${r(s * 3.05 + 0.75)} -5.6 Z" fill="${G.sand}"/>`;
    k += `<path d="M-2.8 -4.4 C-2.8 -6.3 -1.3 -6.6 -1.15 -8.7 L1.15 -8.7 C1.3 -6.6 2.8 -6.3 2.8 -4.4 Z" fill="${G.sand}"/>`;
    k += `<rect x="-.7" y="-10.2" width="1.4" height="1.5" fill="${G.sand}"/><path d="M-.8 -10.2 Q0 -11.1 .8 -10.2 Z" fill="${G.sand}"/>`;
    k += `<path d="M0 -11 V-12.2 M-.35 -11.8 H.35" stroke="#d9a520" stroke-width=".26"/>`;
    k += reihe(-2.2, -3.6, 4, 1.25, 0.5, 1.4, "#7b6a55", 0.25) + `<path d="M-0.5 0 V-1.2 Q0 -1.8 0.5 -1.2 V0 Z" fill="#5a4a3a"/>`;
    for (const [x, y] of [[-2.4, -1.4], [1.6, -2.8], [-1.6, -5.4], [0.9, -7.6], [2.3, -0.8]]) k += `<rect x="${x}" y="${y}" width=".7" height=".45" fill="#4d4237" opacity=".7"/>`;
    k += `<path d="M-2.2 -4.6 C-2.1 -6.1 -0.9 -6.6 -0.8 -8.4" fill="none" stroke="#fff6e0" stroke-width=".3" opacity=".7"/>`;
    return k;
  }],
  /* Goethe-Schiller-Denkmal vor dem Nationaltheater */
  weimar: [6.2, 9.4, () => {
    let k = `<rect x="-2.7" y="-2.9" width="5.4" height="2.9" fill="${G.granit}"/><rect x="-3" y="-3.3" width="6" height=".45" fill="#9d9183"/><rect x="-3" y="-.4" width="6" height=".4" fill="#9d9183"/>`;
    const fig = (x, gr) => `<path d="M${x - 0.85} -3.3 L${x - 0.6} -6.4 Q${x} -7.0 ${x + 0.6} -6.4 L${x + 0.85} -3.3 Z" fill="${G.patina}"/><circle cx="${x}" cy="${r(-7.1 - gr)}" r=".55" fill="${G.patina}"/><path d="M${x - 0.2} -6.6 v-.5 h.4 v.5 Z" fill="${G.patina}"/>`;
    k += fig(-0.95, 0) + fig(0.95, 0.35);
    k += `<path d="M-0.3 -5.6 Q0.2 -6.1 0.4 -5.4" fill="none" stroke="#3c5544" stroke-width=".4"/><circle cx="0" cy="-4.8" r=".55" fill="none" stroke="#c9a033" stroke-width=".25"/>`;
    k += `<path d="M-1.6 -6.2 L-1.45 -3.5" stroke="#cfe0cf" stroke-width=".2" opacity=".6"/>`;
    return k;
  }],
  /* Rheinturm Düsseldorf: schlanker Schaft, Kanzel mit schrägen Fenstern, Antenne */
  duesseldorf: [3.6, 14.4, () => {
    let k = `<path d="M-0.6 0 L-0.27 -8.8 L0.27 -8.8 L0.6 0 Z" fill="${G.beton}" stroke="#77776f" stroke-width=".18"/>`;
    for (let i = 0; i < 7; i++) k += `<circle cx="0" cy="${r(-1.2 - i * 1.05)}" r=".13" fill="#f2c94c"/>`;
    k += `<path d="M-1.55 -9.0 L1.55 -9.0 L1.2 -10.1 L-1.2 -10.1 Z" fill="${G.beton}" stroke="#77776f" stroke-width=".18"/><path d="M-1.45 -9.25 L1.45 -9.25 L1.25 -9.85 L-1.25 -9.85 Z" fill="#3b4b58"/>`;
    k += `<path d="M-0.22 -10.1 L-0.15 -11.4 L0.15 -11.4 L0.22 -10.1 Z" fill="${G.beton}"/><path d="M0 -14.4 V-11.4" stroke="#c43a2c" stroke-width=".2" stroke-dasharray=".45 .35"/>`;
    return k;
  }],
  /* Kölner Dom: zwei Türme mit Kreuzblumen, Langhaus mit Strebewerk */
  koeln: [9.4, 14.2, () => {
    let k = `<rect x="0.8" y="-6" width="4.6" height="6" fill="${G.dunkel}"/><path d="M0.6 -6 L3.1 -8.2 L5.6 -6 Z" fill="#3a3632"/>`;
    for (let x = 1.4; x < 5.2; x += 0.9) k += `<path d="M${r(x)} 0 V-4.2 L${r(x + 0.35)} -5 L${r(x + 0.7)} -4.2" fill="none" stroke="#2c2926" stroke-width=".22"/>`;
    for (const s of [-1, 1]) {
      const cx = -2.2 + s * 1.65;
      k += `<rect x="${r(cx - 1.25)}" y="-8.4" width="2.5" height="8.4" fill="${G.dunkel}"/>`;
      k += `<path d="M${r(cx - 1.1)} -8.4 L${r(cx)} -13.6 L${r(cx + 1.1)} -8.4 Z" fill="${G.dunkel}"/>`;
      for (let i = 1; i < 6; i++) { const y = -8.4 - i * 0.86, w = 1.1 * (1 - i / 6.05); k += `<path d="M${r(cx - w - 0.25)} ${r(y)} h.25 M${r(cx + w)} ${r(y)} h.25" stroke="#3a3632" stroke-width=".22"/>`; }
      k += `<path d="M${cx} -13.6 v-.6 M${r(cx - 0.3)} -14 h.6" stroke="#3a3632" stroke-width=".22"/>`;
      k += `<path d="M${r(cx - 0.35)} -1 V-6.3 L${cx} -7.0 L${r(cx + 0.35)} -6.3 V-1 Z" fill="#2a2724"/>`;
    }
    k += `<path d="M-2.9 0 V-2.6 L-2.2 -3.6 L-1.5 -2.6 V0 Z" fill="#26231f"/><path d="M-3.4 -4.3 L-2.2 -6.1 L-1.0 -4.3 Z" fill="${G.dunkel}"/>`;
    k += `<path d="M-4.5 -8 L-4.5 -1" stroke="#a49e95" stroke-width=".2" opacity=".6"/>`;
    return k;
  }],
  /* Aachener Dom: karolingisches Oktogon mit Kuppel, gotische Chorhalle, Westturm */
  aachen: [11.4, 10.6, () => {
    let k = `<rect x="-5.4" y="-6.8" width="2" height="6.8" fill="${G.sand}"/>` + kegel(-4.4, -6.8, 2.1, 3.6, G.schiefer);
    k += `<rect x="1.3" y="-6.6" width="4.2" height="6.6" fill="${G.sand}"/><path d="M1.1 -6.6 L3.4 -9.1 L5.7 -6.6 Z" fill="${G.schiefer}"/>`;
    for (let x = 1.7; x < 5.3; x += 0.95) k += `<path d="M${r(x)} -0.8 V-5.4 L${r(x + 0.3)} -5.9 L${r(x + 0.6)} -5.4 V-0.8 Z" fill="${G.glas2}"/>`;
    k += `<rect x="-3.4" y="-4.9" width="4.7" height="4.9" fill="${G.sand}"/><path d="M-3.6 -4.9 Q-3.5 -7.6 -1.05 -8.3 Q1.4 -7.6 1.5 -4.9 Z" fill="${G.schiefer}"/>`;
    for (const x of [-2.3, -1.05, 0.2]) k += `<path d="M-1.05 -8.25 Q${r(x * 0.9 - 0.1)} -6.6 ${r(x)} -4.95" fill="none" stroke="#d9b54a" stroke-width=".18"/>`;
    k += `<rect x="-1.4" y="-9.1" width=".7" height=".9" fill="${G.sand}"/><path d="M-1.05 -9.1 v-.5" stroke="#d9b54a" stroke-width=".2"/>`;
    k += reihe(-2.8, -3.6, 4, 1.05, 0.45, 1.2, "#5a4a3a", 0.2);
    return k;
  }],
  /* Porta Nigra: dunkler Sandstein, zwei Tordurchfahrten, Bogenfenster-Reihen, Westturm höher */
  trier: [11, 7.6, () => {
    let k = `<rect x="-5.2" y="-5.6" width="10.4" height="5.6" fill="${G.porta}"/><rect x="-5.2" y="-7.2" width="3.4" height="1.6" fill="${G.porta}"/>`;
    for (const y of [-1.9, -3.7, -5.5]) k += `<path d="M-5.2 ${y} H5.2" stroke="#8e8173" stroke-width=".22"/>`;
    k += `<path d="M-5.2 -7.1 H-1.8" stroke="#8e8173" stroke-width=".22"/>`;
    for (const x of [-1.6, 1.6]) k += `<path d="M${r(x - 0.9)} 0 V-1.3 Q${x} -2.5 ${r(x + 0.9)} -1.3 V0 Z" fill="#1d1814"/>`;
    for (const y of [-3.75, -5.55]) for (let x = -4.6; x < 4.8; x += 1.15) k += `<path d="M${r(x)} ${r(y + 1.6)} V${r(y + 0.6)} Q${r(x + 0.35)} ${r(y + 0.15)} ${r(x + 0.7)} ${r(y + 0.6)} V${r(y + 1.6)} Z" fill="#251f1a"/>`;
    for (let x = -4.6; x < -1.9; x += 1.15) k += `<path d="M${r(x)} -5.65 V-6.6 Q${r(x + 0.35)} -7.0 ${r(x + 0.7)} -6.6 V-5.65 Z" fill="#251f1a"/>`;
    k += `<path d="M-4.9 -0.2 V-5.4" stroke="#a89a8a" stroke-width=".22" opacity=".6"/>`;
    return k;
  }],
  /* Frankfurter Skyline: Commerzbank Tower, Main Tower, Messeturm mit Pyramidenspitze */
  frankfurt: [12.4, 14.4, () => {
    let k = "";
    const T = [[-5.4, 1.5, 5, G.glas2], [-3.7, 1.6, 7.4, G.beton], [6.0, 1.3, 6.0, G.glas2], [-1.6, 1.9, 10.4, G.glas2], [1.2, 2.0, 12.3, G.glas2]];
    for (const [x, w, h, f] of T) {
      k += `<rect x="${r(x - w / 2)}" y="${-h}" width="${w}" height="${h}" fill="${f}"/>`;
      for (let y = -h + 0.6; y < -0.4; y += 0.7) k += `<path d="M${r(x - w / 2 + 0.15)} ${r(y)} h${r(w - 0.3)}" stroke="#fff" stroke-width=".12" opacity=".55"/>`;
    }
    k += `<path d="M1.2 -12.3 V-14.4" stroke="#7c8790" stroke-width=".22"/><path d="M-1.6 -10.4 V-12.0" stroke="#7c8790" stroke-width=".2"/><rect x="-2.55" y="-10.4" width="1.9" height=".55" fill="#d24a3a" opacity=".85"/>`;
    k += `<rect x="3.15" y="-10.2" width="1.9" height="10.2" fill="#b65a4a"/><rect x="3.35" y="-10.9" width="1.5" height=".7" fill="#a04a3c"/>` + kegel(4.1, -10.9, 1.5, 2.6, "#7d3328") + `<path d="M4.1 -13.5 v-.5" stroke="#5a2a20" stroke-width=".15"/>`;
    for (let y = -9.6; y < -0.4; y += 0.7) k += `<path d="M3.3 ${r(y)} h1.6" stroke="#f0c0a8" stroke-width=".12" opacity=".6"/>`;
    return k;
  }],
  /* Heidelberger Schloss: roter Sandstein über dem grünen Hang, Dicker Turm als Ruine */
  heidelberg: [13, 9, () => {
    let k = `<rect x="-6.5" y="-1" width="13" height="1" fill="${G.wasser}"/>`;
    k += `<path d="M-6.5 -1 L-6.5 -2.4 Q-3.5 -3.2 -.5 -4.6 Q3 -6.4 6.5 -6.2 L6.5 -1 Z" fill="${G.wald}"/>`;
    for (let i = 0; i < 9; i++) k += `<circle cx="${r(-5.6 + i * 1.4)}" cy="${r(-2 - i * 0.48 + (i % 2) * 0.4)}" r=".75" fill="${i % 2 ? "#4f7f40" : "#5f8f4a"}"/>`;
    k += `<path d="M-6.2 -1 H.6 V-1.9 H-6.2 Z" fill="${G.sand}"/>`;
    for (let x = -5.8; x < 0.2; x += 1.3) k += `<path d="M${r(x)} -1 Q${r(x + 0.45)} -1.7 ${r(x + 0.9)} -1 Z" fill="#3d7fa8"/>`;
    k += `<rect x="-6.3" y="-3.3" width="1.1" height="1.5" fill="${G.sand}"/>` + kegel(-5.75, -3.3, 1.3, 1, G.dachrot);
    k += `<rect x="-.4" y="-8.6" width="4.2" height="3.6" fill="${G.rotsand}"/><path d="M-.4 -8.6 L.3 -9.6 L1 -8.6 L1.7 -9.6 L2.4 -8.6 L3.1 -9.6 L3.8 -8.6 Z" fill="${G.rotsand}"/>`;
    k += reihe(-0.1, -8.1, 4, 0.95, 0.45, 0.9, "#4c2219", 0.1) + reihe(-0.1, -6.5, 4, 0.95, 0.45, 0.9, "#4c2219", 0.1);
    k += `<path d="M4 -5.2 V-7.8 L4.4 -8.3 L4.9 -7.9 L5.5 -8.5 L6.1 -7.9 V-5.2 Z" fill="${G.rotsand}"/>`;
    return k;
  }],
  /* Stuttgarter Fernsehturm über Weinbergen (Korb mit zwei Fensterbändern, rot-weiße Antenne) */
  stuttgart: [9, 14.8, () => {
    let k = `<path d="M-4.5 0 Q-2 -2.5 0 -2.6 Q2.2 -2.4 4.5 0 Z" fill="${G.gruen}"/>`;
    for (let i = 0; i < 5; i++) k += `<path d="M${r(-3.6 + i * 0.4)} ${r(-0.3 - i * 0.45)} Q0 ${r(-1.3 - i * 0.5)} ${r(3.6 - i * 0.4)} ${r(-0.3 - i * 0.45)}" fill="none" stroke="#5e8a3e" stroke-width=".2" stroke-dasharray=".3 .25"/>`;
    k += `<path d="M-0.62 -2.4 L-0.3 -10 L0.3 -10 L0.62 -2.4 Z" fill="${G.beton}" stroke="#77776f" stroke-width=".18"/>`;
    k += `<rect x="-1.15" y="-11.9" width="2.3" height="1.9" rx=".2" fill="${G.beton}" stroke="#77776f" stroke-width=".18"/><rect x="-1.15" y="-11.55" width="2.3" height=".45" fill="#3b4b58"/><rect x="-1.15" y="-10.85" width="2.3" height=".45" fill="#3b4b58"/>`;
    k += `<path d="M0 -14.8 V-11.9" stroke="#c43a2c" stroke-width=".26" stroke-dasharray=".5 .4"/>`;
    return k;
  }],
  /* Freiburger Münster: Westturm mit durchbrochenem Maßwerkhelm */
  freiburg: [9.4, 13.6, () => {
    let k = `<rect x="1" y="-5" width="4.2" height="5" fill="${G.rotsand}"/><path d="M0.8 -5 L3.1 -7.4 L5.4 -5 Z" fill="#5b3a30"/>`;
    for (let x = 1.4; x < 5; x += 0.9) k += `<path d="M${r(x)} -0.8 V-3.6 L${r(x + 0.3)} -4.1 L${r(x + 0.6)} -3.6 V-0.8 Z" fill="#4a2a20"/>`;
    k += `<rect x="-1.6" y="-6.9" width="3.2" height="6.9" fill="${G.rotsand}"/><rect x="-1.2" y="-8.8" width="2.4" height="1.9" fill="${G.rotsand}"/>`;
    k += `<path d="M-1.25 -8.8 L0 -13.6 L1.25 -8.8 Z" fill="${G.rotsand}"/>`;
    for (let i = 1; i < 6; i++) { const y = -8.8 - i * 0.8, w = 1.25 * (1 - i / 6); k += `<path d="M${r(-w)} ${r(y)} H${r(w)}" stroke="#f3c3ad" stroke-width=".16"/>`; }
    k += `<path d="M-0.9 -9.4 L0 -12.6 L0.9 -9.4 M-0.5 -9.4 L0 -11.4 L0.5 -9.4" fill="none" stroke="#5a2b1f" stroke-width=".18"/>`;
    k += `<path d="M-0.4 -2.2 V-5.6 L0 -6.2 L0.4 -5.6 V-2.2 Z" fill="#4a2a20"/><path d="M-0.6 0 V-1 Q0 -1.7 0.6 -1 V0 Z" fill="#3a2018"/>`;
    return k;
  }],
  /* Kaiserburg Nürnberg auf dem Sandsteinfelsen, runder Sinwellturm */
  nuernberg: [12.4, 10.2, () => {
    let k = `<path d="M-6.2 0 L-5.3 -2.6 L-2.4 -3.2 L2.6 -3.0 L5.6 -2.2 L6.2 0 Z" fill="${G.fels}"/>`;
    k += `<rect x="-5.2" y="-4.9" width="10.6" height="1.9" fill="${G.sand}"/>`;
    k += `<rect x="-4.7" y="-6.9" width="4.4" height="2.2" fill="${G.sand}"/><path d="M-4.9 -6.9 L-2.5 -8.6 L-0.1 -6.9 Z" fill="${G.dachrot}"/>`;
    k += reihe(-4.2, -6.4, 4, 1, 0.45, 0.8, "#6b5032", 0.1);
    k += `<rect x="1.6" y="-9.6" width="2.8" height="6.6" rx="1.2" fill="${G.sand}"/><path d="M1.6 -6.5 Q3 -6.1 4.4 -6.5" fill="none" stroke="#a88a5c" stroke-width=".25"/><rect x="1.4" y="-10" width="3.2" height=".5" fill="#a88a5c"/>` + kegel(3, -10, 3, 2.2, G.dachrot);
    k += reihe(2.5, -8, 1, 0, 0.6, 1.1, "#6b5032", 0.2) + reihe(-0.6, -4.5, 6, 0.9, 0.35, 0.9, "#6b5032", 0.1);
    return k;
  }],
  /* Rothenburg, das Plönlein: gelbes Fachwerkhaus zwischen Kobolzeller Tor und Siebersturm */
  rothenburg: [10.2, 11.2, () => {
    let k = `<rect x="-4.7" y="-5.8" width="2.2" height="5.8" fill="${G.sand}"/>` + kegel(-3.6, -5.8, 2.6, 2.4, G.dachrot);
    k += `<path d="M-4.0 0 V-1.6 Q-3.6 -2.3 -3.2 -1.6 V0 Z" fill="#3a2a1a"/>`;
    k += `<rect x="2.4" y="-7.8" width="2.3" height="7.8" fill="${G.sand}"/>` + kegel(3.55, -7.8, 2.7, 3.4, G.dachrot) + `<path d="M3.55 -11.2 v-.5" stroke="#3a2a1a" stroke-width=".18"/>`;
    k += `<path d="M3.1 0 V-1.8 Q3.55 -2.6 4 -1.8 V0 Z" fill="#3a2a1a"/><rect x="3.25" y="-6" width=".6" height=".9" fill="#3a2a1a"/>`;
    k += `<rect x="-1.9" y="-5.6" width="3.8" height="5.6" fill="${G.gelb}"/><path d="M-2.2 -5.6 L0 -9.2 L2.2 -5.6 Z" fill="${G.dachrot}"/>`;
    k += `<path d="M-1.9 -1.9 H1.9 M-1.9 -3.8 H1.9 M-1.9 -5.6 V0 M1.9 -5.6 V0 M-0.6 -5.6 V-1.9 M0.6 -5.6 V-1.9 M-1.9 -3.8 L-0.6 -1.9 M1.9 -3.8 L0.6 -1.9" stroke="#6b3d22" stroke-width=".24"/>`;
    k += reihe(-1.5, -3.3, 3, 1.15, 0.6, 0.9, "#4a6a7a") + reihe(-1.5, -5.2, 3, 1.15, 0.6, 0.9, "#4a6a7a") + `<rect x="-.3" y="-7.6" width=".6" height=".7" fill="#4a3020"/>`;
    return k;
  }],
  /* Regensburg: Steinerne Brücke über die Donau, dahinter der Dom mit zwei Maßwerktürmen */
  regensburg: [13.4, 11.6, () => {
    let k = "";
    for (const s of [-1, 1]) { const cx = 1.6 + s * 1.15; k += `<rect x="${r(cx - 0.85)}" y="-7.4" width="1.7" height="5" fill="${G.sand}"/><path d="M${r(cx - 0.85)} -7.4 L${cx} -11.6 L${r(cx + 0.85)} -7.4 Z" fill="${G.sand}"/><path d="M${r(cx - 0.4)} -7.6 L${cx} -10.6 L${r(cx + 0.4)} -7.6" fill="none" stroke="#8a7350" stroke-width=".16"/>`; }
    k += `<rect x="2.8" y="-5.4" width="3.2" height="3" fill="${G.sand}"/><path d="M2.6 -5.4 L4.4 -6.8 L6.2 -5.4 Z" fill="${G.dachrot}"/>`;
    k += `<rect x="-6.7" y="-0.9" width="13.4" height=".9" fill="${G.wasser}"/>`;
    let b = "M-6.7 -2.9 H6.7 V-2.2"; for (let i = 0; i < 6; i++) { const x1 = 6.7 - i * 2.233, x0 = x1 - 2.233; b += ` L${r(x1 - 0.35)} -2.2 L${r(x1 - 0.35)} -0.9 Q${r((x0 + x1) / 2)} -2.5 ${r(x0 + 0.35)} -0.9 L${r(x0 + 0.35)} -2.2`; } k += `<path d="${b} L-6.7 -2.2 Z" fill="${G.sand}"/>`;
    k += `<path d="M-6.7 -2.9 H6.7" stroke="#8a7350" stroke-width=".22"/>`;
    k += `<rect x="-6.4" y="-5.4" width="1.6" height="2.5" fill="${G.sand}"/><path d="M-6.6 -5.4 L-5.6 -6.4 L-4.6 -5.4 Z" fill="${G.dachrot}"/><path d="M-5.9 -2.9 V-3.9 Q-5.6 -4.3 -5.3 -3.9 V-2.9 Z" fill="#3a2a1a"/>`;
    return k;
  }],
  /* Frauenkirche München: zwei Backsteintürme mit grünen „welschen Hauben“ */
  muenchen: [9.6, 11.8, () => {
    let k = `<rect x="0.4" y="-5.4" width="4.6" height="5.4" fill="${G.ziegel}"/><path d="M0.2 -5.4 L2.7 -8.6 L5.2 -5.4 Z" fill="#7a2f1e"/>`;
    k += reihe(0.9, -4.4, 4, 1.05, 0.4, 3.2, "#4a2014", 0.2);
    for (const s of [-1, 1]) {
      const cx = -1.9 + s * 1.3;
      k += `<rect x="${r(cx - 1.08)}" y="-8.7" width="2.16" height="8.7" fill="${G.ziegel}"/>`;
      k += `<path d="M${r(cx - 1.2)} -8.7 C${r(cx - 1.35)} -9.9 ${r(cx - 0.75)} -10.8 ${cx} -11.0 C${r(cx + 0.75)} -10.8 ${r(cx + 1.35)} -9.9 ${r(cx + 1.2)} -8.7 Z" fill="${G.kupfer}"/>`;
      k += `<rect x="${r(cx - 0.18)}" y="-11.5" width=".36" height=".55" fill="${G.kupfer}"/><path d="M${cx} -11.5 v-.35" stroke="#c9a033" stroke-width=".18"/>`;
      k += `<rect x="${r(cx - 0.25)}" y="-7.6" width=".5" height="1.3" rx=".2" fill="#3a170e"/><rect x="${r(cx - 0.25)}" y="-5.0" width=".5" height="1.6" rx=".2" fill="#3a170e"/>`;
    }
    k += `<path d="M-2.5 0 V-1.6 Q-1.9 -2.3 -1.3 -1.6 V0 Z" fill="#2c140c"/>`;
    return k;
  }],
  /* Schloss Neuschwanstein: weißer Kalkstein, graue Spitzdächer, auf dem Felsen über dem Wald */
  neuschwanstein: [12, 12.6, () => {
    let k = `<path d="M-6 0 Q-5.2 -2.6 -2.4 -3.1 L3 -2.8 Q5.2 -2.2 6 0 Z" fill="${G.wald}"/>`;
    for (let i = 0; i < 10; i++) k += kegel(-5.2 + i * 1.15, r(-0.2 - (i % 3) * 0.35), 1.1, 1.9, i % 2 ? "#36602f" : "#2f5429");
    k += `<rect x="3" y="-5.4" width="2.8" height="2.6" fill="#d9a07c"/><path d="M2.8 -5.4 L4.4 -6.6 L6 -5.4 Z" fill="${G.schiefer}"/>`;
    k += `<rect x="-1.4" y="-8.4" width="4.4" height="5.6" fill="${G.weiss}"/><path d="M-1.6 -8.4 L0.8 -10.2 L3.2 -8.4 Z" fill="${G.schiefer}"/>`;
    k += `<rect x="-2.6" y="-10.2" width="1.2" height="7.4" fill="${G.weiss}"/>` + kegel(-2, -10.2, 1.5, 2.4, G.schiefer);
    k += `<rect x="2.6" y="-9.3" width=".9" height="2.2" fill="${G.weiss}"/>` + kegel(3.05, -9.3, 1.1, 1.6, G.schiefer);
    k += `<rect x="-4.4" y="-6" width="1.8" height="3.2" fill="${G.weiss}"/>` + kegel(-3.5, -6, 2.1, 1.6, G.schiefer) + kegel(-0.3, -10.2, 0.6, 1.2, G.schiefer) + `<rect x="-0.55" y="-10.25" width=".5" height=".9" fill="${G.weiss}"/>`;
    k += reihe(-0.9, -7.6, 4, 0.95, 0.4, 0.8, "#4d5866", 0.15) + reihe(-0.9, -5.9, 4, 0.95, 0.4, 0.8, "#4d5866", 0.15) + reihe(-4, -5.0, 2, 0.7, 0.35, 0.7, "#4d5866", 0.15);
    return k;
  }],
};

/* =====================================================================
   STÄDTE — Lage, Bildversatz, Beschriftung, Lupenknopf
   ===================================================================== */
/* [Länge, Breite, Bildversatz dx/dy, Beschriftung (dx, dy, Ausrichtung), Knopf (dx, dy) vom Ortspunkt] */
const STADT = {
  hamburg: { ll: [9.99, 53.55], lab: [0, 6.4, "m"] },
  luebeck: { ll: [10.69, 53.87], bild: [-5.4, -2.6], lab: [2, 4.6, "s"] },
  bremen: { ll: [8.81, 53.08], lab: [0, 6.4, "m"], gross: 1.2 },
  hannover: { ll: [9.74, 52.37], lab: [0, 6.4, "m"] },
  berlin: { ll: [13.40, 52.52], bild: [2.5, 0], lab: [9.5, -1.2, "s"] },
  potsdam: { ll: [13.03, 52.385], bild: [-3, 9.6], lab: [4.2, 10.6, "s"] },
  magdeburg: { ll: [11.63, 52.13], lab: [0, 6.4, "m"] },
  leipzig: { ll: [12.37, 51.34], lab: [0, 6.4, "m"] },
  dresden: { ll: [13.74, 51.05], lab: [0, 6.4, "m"] },
  weimar: { ll: [11.33, 50.98], lab: [0, 6.4, "m"], gross: 1.1 },
  frankfurt: { ll: [8.68, 50.11], lab: [-7, -2.4, "e"], sub: "am Main" },
  trier: { ll: [6.64, 49.75], lab: [0, 6.4, "m"] },
  heidelberg: { ll: [8.69, 49.40], lab: [-7.4, -1, "e"] },
  stuttgart: { ll: [9.18, 48.78], lab: [0, 6.4, "m"] },
  freiburg: { ll: [7.85, 47.99], lab: [0, 6.4, "m"], sub: "im Breisgau" },
  duesseldorf: { ll: [6.78, 51.23], bild: [2.8, -0.2], lab: [-2.4, 1.4, "e"] },
  koeln: { ll: [6.96, 50.94], bild: [8.2, 3.2], lab: [8.2, 7.6, "m"] },
  aachen: { ll: [6.08, 50.78], lab: [0, 6.4, "m"] },
  rothenburg: { ll: [10.18, 49.38], lab: [-9, 6.4, "m"], sub: "ob der Tauber" },
  nuernberg: { ll: [11.08, 49.45], lab: [1.5, 6.4, "m"] },
  regensburg: { ll: [12.10, 49.02], lab: [6.5, -0.6, "s"] },
  muenchen: { ll: [11.58, 48.14], lab: [0, 6.4, "m"] },
  neuschwanstein: { ll: [10.75, 47.56], bild: [-4, 0], lab: [5.6, -1.2, "s"] },
};
const NAME = { hamburg: "Hamburg", luebeck: "Lübeck", bremen: "Bremen", hannover: "Hannover", berlin: "Berlin", potsdam: "Potsdam", magdeburg: "Magdeburg",
  leipzig: "Leipzig", dresden: "Dresden", weimar: "Weimar", frankfurt: "Frankfurt", trier: "Trier", heidelberg: "Heidelberg", stuttgart: "Stuttgart",
  freiburg: "Freiburg", duesseldorf: "Düsseldorf", koeln: "Köln", aachen: "Aachen", rothenburg: "Rothenburg", nuernberg: "Nürnberg",
  regensburg: "Regensburg", muenchen: "München", neuschwanstein: "Neuschwanstein" };
/* Zeichnet eine Stadt in Bildkoordinaten; liefert SVG und den Kasten (für Trefferflächen) */
function stadtBild(id) {
  const c = STADT[id], [dx0, dy0] = P(...c.ll), [bdx, bdy] = c.bild || [0, 0];
  const bx = dx0 + bdx, by = dy0 + bdy - (c.bild ? 0 : 0.9);
  const g0 = c.gross || 1, [W0, H0, f] = ICON[id], W = W0 * g0, H = H0 * g0;
  let k = `<ellipse cx="${r(bx)}" cy="${r(by - H * 0.45)}" rx="${r(W * 0.66)}" ry="${r(H * 0.58)}" fill="${GLOW}"/>`;
  k += `<ellipse cx="${r(bx + 0.6)}" cy="${r(by + 0.1)}" rx="${r(W * 0.55)}" ry="1.1" fill="${SCHATTEN}"/>`;
  if (c.bild) { const seit = Math.abs(bdx) > W / 2, ex = seit ? bx - Math.sign(bdx) * W * 0.42 : bx, ey = seit ? by - 0.6 : bdy > 2 ? by - H - 0.3 : by + 0.2; k += `<path d="M${r(dx0)} ${r(dy0)} L${r(ex)} ${r(ey)}" stroke="#7a5a32" stroke-width=".35" stroke-dasharray=".8 .5"/>`; }
  k += `<g transform="translate(${+bx.toFixed(3)} ${+by.toFixed(3)})${g0 !== 1 ? ` scale(${g0})` : ""}">${f()}</g>`;
  k += id === "berlin"
    ? `<circle cx="${r(dx0)}" cy="${r(dy0)}" r="1.9" fill="#fff8ea" stroke="#c0392b" stroke-width=".55"/><circle cx="${r(dx0)}" cy="${r(dy0)}" r=".95" fill="#c0392b"/>`   /* Hauptstadt: Doppelring */
    : `<circle cx="${r(dx0)}" cy="${r(dy0)}" r="1.15" fill="#c0392b" stroke="#fff8ea" stroke-width=".5"/>`;
  const [lx, ly, al] = c.lab, anchor = { m: "middle", s: "start", e: "end" }[al];
  const name = c.name || NAME[id];
  let n = `<text x="${r(dx0 + lx)}" y="${r(dy0 + ly)}" font-size="5.5" font-weight="bold" text-anchor="${anchor}" fill="#3a2716" stroke="#fbf5e6" stroke-width="1.1" stroke-linejoin="round" paint-order="stroke" font-family="Georgia,'Times New Roman',serif">${name}</text>`;
  if (c.sub) n += `<text x="${r(dx0 + lx)}" y="${r(dy0 + ly + 4.1)}" font-size="3.7" font-style="italic" text-anchor="${anchor}" fill="#5a4026" stroke="#fbf5e6" stroke-width=".8" stroke-linejoin="round" paint-order="stroke" font-family="Georgia,'Times New Roman',serif">${c.sub}</text>`;
  /* ungefährer Kasten: Bild + Beschriftung */
  const lw = name.length * 3.1 + 1, lx0 = al === "m" ? dx0 + lx - lw / 2 : al === "s" ? dx0 + lx - 0.5 : dx0 + lx - lw + 0.5;
  const box = { x0: Math.min(bx - W / 2, lx0, dx0 - 1.5), x1: Math.max(bx + W / 2, lx0 + lw, dx0 + 1.5), y0: Math.min(by - H, dy0 + ly - 5), y1: Math.max(by + 0.6, dy0 + ly + (c.sub ? 5.4 : 1.4), dy0 + 1.5) };
  return { k, n, box, punkt: [dx0, dy0], bild: [bx, by, W, H] };
}


/* =====================================================================
   KULISSE — Beschriftungen der Nachbarn, Flüsse, Gebirge; Kompass, Maßstab
   ===================================================================== */
{
  let g = "";
  const land = (lo, la, t, gr = 4.2, sp = 1.2) => { const [x, y] = P(lo, la); return text(x, y, t, gr, "#a38d6a", `letter-spacing="${sp}" opacity=".9"`); };
  g += land(5.75, 52.55, "NIEDERLANDE") + land(3.6, 50.45, "BELGIEN") + land(4.6, 48.45, "FRANKREICH") + land(0.75, 52.25, "ENGLAND", 3.4, 0.9)
    + land(7.75, 47.3, "SCHWEIZ") + land(15.6, 49.62, "TSCHECHIEN") + land(17.3, 52.6, "POLEN", 4.6, 2) + land(19.3, 48.72, "SLOWAKEI", 3.2, 0.8);
  const haupt = (lo, la, t, dx = 0, dy = 4, al = "middle") => { const [x, y] = P(lo, la); return `<circle cx="${r(x)}" cy="${r(y)}" r=".85" fill="#8c7a5c" stroke="#fbf5e6" stroke-width=".35"/>` + `<text x="${r(x + dx)}" y="${r(y + dy)}" font-size="3.1" font-style="italic" text-anchor="${al}" fill="#7c6a4e" font-family="Georgia,'Times New Roman',serif">${t}</text>`; };
  g += haupt(4.9, 52.37, "Amsterdam") + haupt(4.35, 50.85, "Brüssel") + haupt(6.13, 49.61, "Luxemburg", -1.5, 4.2, "end") + haupt(2.35, 48.86, "Paris") + haupt(14.42, 50.08, "Prag") + haupt(16.37, 48.21, "Wien", 0, -2.2);
  const fl = (lo, la, t, w = 0, gr = 3.3) => { const [x, y] = P(lo, la); return `<text x="${r(x)}" y="${r(y)}" font-size="${gr}" font-style="italic" text-anchor="middle" fill="#2f6f93" stroke="#eef6f4" stroke-width=".7" stroke-linejoin="round" paint-order="stroke" font-family="Georgia,'Times New Roman',serif" transform="rotate(${w} ${r(x)} ${r(y)})" letter-spacing=".3">${t}</text>`; };
  g += fl(14.0, 48.42, "Donau", -6, 3.6) + fl(10.5, 50.13, "Main", 8) + fl(9.0, 52.56, "Weser", 62) + fl(7.02, 49.98, "Mosel", 18) + fl(8.93, 48.36, "Neckar", -48, 3) + fl(14.85, 52.6, "Oder", 80);
  const geb = (lo, la, t, w = 0, gr = 3.1) => { const [x, y] = P(lo, la); return `<text x="${r(x)}" y="${r(y)}" font-size="${gr}" font-style="italic" text-anchor="middle" fill="#6e5330" stroke="#f2ead2" stroke-width=".7" stroke-linejoin="round" paint-order="stroke" font-family="Georgia,'Times New Roman',serif" letter-spacing=".7" transform="rotate(${w} ${r(x)} ${r(y)})">${t}</text>`; };
  g += geb(10.62, 51.67, "Harz") + geb(8.42, 48.42, "Schwarzwald", -82) + geb(13.15, 50.52, "Erzgebirge", -12) + geb(6.5, 50.5, "Eifel");
  const insel = (lo, la, t, al = "middle") => { const [x, y] = P(lo, la); return `<text x="${r(x)}" y="${r(y)}" font-size="2.7" font-style="italic" text-anchor="${al}" fill="#4d6b52" stroke="#f2f0de" stroke-width=".6" paint-order="stroke" font-family="Georgia,'Times New Roman',serif">${t}</text>`; };
  { const [x, y] = P(9.28, 47.86); g += `<text x="${r(x)}" y="${r(y)}" font-size="2.9" font-style="italic" text-anchor="middle" fill="#2f6f93" stroke="#eef3ec" stroke-width=".6" paint-order="stroke" font-family="Georgia,'Times New Roman',serif">Bodensee</text>`; }
  S.hinten(g);
}
/* Windrose und Maßstab in der Nordsee */
{
  const cx = 60, cy = 40;
  let g = `<circle cx="${cx}" cy="${cy}" r="11.5" fill="#f7f0dc" opacity=".55"/><circle cx="${cx}" cy="${cy}" r="11.5" fill="none" stroke="#8a6d43" stroke-width=".35"/><circle cx="${cx}" cy="${cy}" r="10.3" fill="none" stroke="#8a6d43" stroke-width=".2"/>`;
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4, lang = i % 2 ? 6.2 : 9.6, b = i % 2 ? 1.1 : 1.6;
    const sx = Math.sin(a), sy = -Math.cos(a), qx = Math.cos(a), qy = Math.sin(a);
    const tip = [cx + sx * lang, cy + sy * lang], l = [cx + qx * b, cy + qy * b], rr = [cx - qx * b, cy - qy * b];
    g += `<path d="M${r(cx)} ${r(cy)} L${r(l[0])} ${r(l[1])} L${r(tip[0])} ${r(tip[1])} Z" fill="${i % 2 ? "#c9a96a" : "#8a6d43"}"/><path d="M${r(cx)} ${r(cy)} L${r(rr[0])} ${r(rr[1])} L${r(tip[0])} ${r(tip[1])} Z" fill="${i % 2 ? "#efe0b8" : "#d8bd85"}"/>`;
  }
  g += `<circle cx="${cx}" cy="${cy}" r="1" fill="#b23a2a"/>` + text(cx, cy - 12.6, "N", 3.6, "#6b4f2a", `font-weight="bold"`);
  /* Maßstab: 100 km = 28 Einheiten */
  const x0 = 46, y0 = 64;
  g += `<rect x="${x0}" y="${y0}" width="14" height="1.3" fill="#6b4f2a"/><rect x="${x0 + 14}" y="${y0}" width="14" height="1.3" fill="#fbf5e6" stroke="#6b4f2a" stroke-width=".3"/>`;
  g += text(x0, y0 + 4.4, "0", 2.6, "#5a4026") + text(x0 + 14, y0 + 4.4, "50", 2.6, "#5a4026") + text(x0 + 28, y0 + 4.4, "100 km", 2.6, "#5a4026");
  S.davor(g);   /* über dem Meer sichtbar, fängt keinen Tipp ab */
}

/* =====================================================================
   KULISSE — die Alpen (Bergzeichen: Licht von links, Schnee auf den Gipfeln)
   ===================================================================== */
const inPoly = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if ((a.y > pt.y) !== (b.y > pt.y) && pt.x < (b.x - a.x) * (pt.y - a.y) / (b.y - a.y) + a.x) c = !c; } return c; };
S.def(`<g id="${S.id("berg1")}"><path d="M-3.2 0 L-1.5 -2.7 L-.7 -2.3 L0 -3.8 L.9 -2.6 L1.5 -2.9 L3.2 0 Z" fill="#d9d3c3"/><path d="M0 -3.8 L.9 -2.6 L1.5 -2.9 L3.2 0 L.3 0 L.7 -1.6 Z" fill="#8c8576"/><path d="M-.95 -2.5 L0 -3.8 L.9 -2.6 L.5 -2.35 L.1 -2.85 L-.4 -2.25 Z" fill="#fff"/><path d="M-3.2 0 H3.2" stroke="#6f7b55" stroke-width=".4" opacity=".45"/></g>`);
S.def(`<g id="${S.id("berg2")}"><path d="M-3.4 0 L-1.9 -2.9 L-1.2 -2.4 L-.4 -3.1 L.6 -2.2 L1.5 -3.3 L3.4 0 Z" fill="#d3ccbb"/><path d="M1.5 -3.3 L3.4 0 L1 0 L1.2 -1.7 Z M-.4 -3.1 L.6 -2.2 L.2 0 L-.6 0 L-.1 -1.6 Z" fill="#8a8373"/><path d="M1 -2.7 L1.5 -3.3 L2.05 -2.4 L1.6 -2.55 Z M-2.35 -2.2 L-1.9 -2.9 L-1.5 -2.55 Z" fill="#fff"/><path d="M-3.4 0 H3.4" stroke="#6f7b55" stroke-width=".4" opacity=".45"/></g>`);
S.def(`<g id="${S.id("berg3")}"><path d="M-3 0 C-2.2 -1.6 -1 -2.3 0 -2.3 C1.1 -2.3 2.2 -1.5 3 0 Z" fill="#b9c39a"/><path d="M0 -2.3 C1.1 -2.3 2.2 -1.5 3 0 H.4 C.7 -.8 .5 -1.7 0 -2.3 Z" fill="#8c9a6c"/><path d="M-1.6 -.4 L-1.2 -1.3 L-.8 -.4 Z M-.4 -.5 L0 -1.5 L.4 -.5 Z M.9 -.4 L1.3 -1.2 L1.7 -.4 Z" fill="#4f7a45"/></g>`);
{
  const NORD = pkt("8.3,47.05 8.7,47.12 9.2,47.25 9.6,47.38 9.9,47.45 10.3,47.52 10.8,47.56 11.2,47.56 11.6,47.66 12.2,47.71 12.6,47.74 13.0,47.76 13.5,47.88 14.0,47.88 14.6,47.9 15.2,47.98 15.8,48.05 16.15,48.12");
  const RAND = pkt("8.3,46.8").concat(NORD, pkt("16.15,47.8 16.05,47.45 16.2,47.0 16.2,46.8"));
  const poly = RAND.concat(pkt("@330,266 @140,266"));
  const nordY = (x) => { for (let i = 1; i < NORD.length; i++) if (x <= NORD[i].x) { const a = NORD[i - 1], b = NORD[i], t = (x - a.x) / (b.x - a.x); return a.y + t * (b.y - a.y); } return NORD[NORD.length - 1].y; };
  let k = `<path d="${weg(poly)}" fill="${S.lg("alpenband", [[0, "#d3d9bd", 0.8], [0.3, "#c9ccb6", 0.85], [1, "#bdbcaa", 0.9]])}"/>`;
  /* Gebirgsketten (Länge/Breite, Größe): Relief mit Licht von Nordwest, darauf wenige große Gipfel */
  const KETTEN = [
    [[[8.6, 47.1], [9.3, 47.17], [9.6, 47.22]], 1.9],                       // Säntis / Glarner Alpen
    [[[9.7, 47.06], [10.3, 47.1]], 2.2],                                    // Rätikon, Silvretta
    [[[10.0, 47.36], [10.35, 47.36], [10.6, 47.45]], 1.8],                  // Allgäuer Alpen
    [[[10.9, 47.42], [11.15, 47.41], [11.45, 47.44], [11.75, 47.47]], 1.9], // Wetterstein mit Zugspitze, Karwendel
    [[[10.7, 47.09], [11.3, 47.1], [11.9, 47.09], [12.6, 47.1], [13.3, 47.08]], 2.5], // Ötztaler, Stubaier, Zillertaler Alpen, Hohe Tauern
    [[[12.3, 47.57], [12.95, 47.55], [13.6, 47.5], [14.2, 47.55]], 1.8],    // Kaisergebirge, Berchtesgadener Alpen, Dachstein
    [[[13.9, 47.3], [14.6, 47.33], [15.1, 47.38]], 1.9],                    // Niedere Tauern
    [[[14.6, 47.68], [15.2, 47.75], [15.8, 47.8]], 1.6],                    // Ötscher, Rax
  ];
  let schatten = "", licht = "";
  for (const [kette] of KETTEN) { const d = weg(kette.map(([a, b]) => `${a},${b}`).join(" "), false); schatten += d; licht += d; }
  k += `<path d="${schatten}" fill="none" stroke="#7d7462" stroke-width="7" stroke-linecap="round" opacity=".16" transform="translate(1.4 1.8)"/>`;
  k += `<path d="${licht}" fill="none" stroke="#f4f1e6" stroke-width="5" stroke-linecap="round" opacity=".3" transform="translate(-1 -1.2)"/>`;
  /* Inntal als helle Furche */
  k += `<path d="${weg("10.6,47.14 11.0,47.25 11.4,47.27 11.9,47.4 12.17,47.58", false)}" fill="none" stroke="#dfe5c9" stroke-width="3.2" stroke-linecap="round" opacity=".8"/>`;
  const rz = zufall(77), berge = [];
  /* Voralpen: sanfte grüne Kuppen am Nordrand */
  for (let x = 150; x < 322; x += 7.2) { const y = nordY(x) + 3.2 + rz() * 1.2; if (inPoly({ x, y: y - 1 }, poly)) berge.push({ x, y, art: "berg3", s: 1.25 + rz() * 0.25 }); }
  for (const [kette, gr] of KETTEN) {
    const a = pkt(kette.map(([q, w]) => `${q},${w}`).join(" "));
    let lang = 0; for (let i = 1; i < a.length; i++) lang += Math.hypot(a[i].x - a[i - 1].x, a[i].y - a[i - 1].y);
    const n = Math.max(2, Math.round(lang / (3.4 * gr)));
    for (let j = 0; j <= n; j++) {
      let t = j / n * lang, i = 1; while (i < a.length - 1 && t > Math.hypot(a[i].x - a[i - 1].x, a[i].y - a[i - 1].y)) { t -= Math.hypot(a[i].x - a[i - 1].x, a[i].y - a[i - 1].y); i++; }
      const seg = Math.hypot(a[i].x - a[i - 1].x, a[i].y - a[i - 1].y) || 1, u = Math.min(1, t / seg);
      berge.push({ x: a[i - 1].x + (a[i].x - a[i - 1].x) * u + (rz() - 0.5) * 1.4, y: a[i - 1].y + (a[i].y - a[i - 1].y) * u + 2.4 + (rz() - 0.5) * 1.2, art: rz() < 0.55 ? "berg1" : "berg2", s: gr * (0.85 + rz() * 0.3) });
    }
  }
  berge.sort((a, b) => a.y - b.y);
  for (const p of berge) k += `<use href="#${S.id(p.art)}" transform="${tr(p.x, p.y, p.s, rz() < 0.35 ? -p.s : p.s)}"/>`;
  k += `<path d="${weg(NEBENFLUESSE.inn, false)}" fill="none" stroke="${FLUSS}" stroke-width=".55" stroke-linecap="round" opacity=".85"/>`;
  /* Zugspitze */
  const [zx, zy] = P(10.98, 47.42);
  k += `<path d="M${r(zx - 1.4)} ${r(zy + 0.6)} L${r(zx)} ${r(zy - 1.8)} L${r(zx + 1.4)} ${r(zy + 0.6)} Z" fill="#b23a2a" stroke="#fff" stroke-width=".3"/>`;
  k += `<text x="${r(zx - 1.8)}" y="${r(zy + 3)}" text-anchor="end" font-size="2.8" font-weight="bold" fill="#3a2716" stroke="#fbf5e6" stroke-width=".8" paint-order="stroke" font-family="Georgia,'Times New Roman',serif">Zugspitze <tspan font-weight="normal" font-style="italic">2962 m</tspan></text>`;
  { const [x, y] = P(13.7, 47.18); k += halo(x, y, "A L P E N", 5, "#4d3e2a", "#eef0e4", `font-weight="bold" letter-spacing=".9"`, 1); }
  S.hinten(k);
}
/* =====================================================================
   TEILE — 3: Rhein und Elbe
   ===================================================================== */
function fluss(id, linien, breite, label, worte, tipp) {
  const d = linien.map((t) => weg(t, false)).join("");
  let k = `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".002" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  k += `<path d="${d}" fill="none" stroke="#eaf5f9" stroke-width="${r(breite + 0.9)}" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>`;
  k += `<path d="${d}" fill="none" stroke="#3d84b8" stroke-width="${breite}" stroke-linecap="round" stroke-linejoin="round"/>`;
  k += `<path d="${d}" fill="none" stroke="#9fd0ea" stroke-width="${r(breite * 0.3)}" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>`;
  k += label;
  S.teil(Object.assign({ x: 0, y: 0, kunst: k, tipp }, worte));
}
const flussText = (lo, la, t, w) => { const [x, y] = P(lo, la); return `<text x="${r(x)}" y="${r(y)}" font-size="3.9" font-style="italic" font-weight="bold" text-anchor="middle" fill="#245f86" stroke="#eef6f4" stroke-width=".8" stroke-linejoin="round" paint-order="stroke" font-family="Georgia,'Times New Roman',serif" letter-spacing=".4" transform="rotate(${w} ${r(x)} ${r(y)})">${t}</text>`; };
S.def(`<path id="${S.id("f_rhein")}" d="${weg(teilzug(FLUESSE.rhein, "8.86,47.66", "8.28,50.0"), false) + weg(teilzug(FLUESSE.rhein, "6.25,51.83", "4.12,51.98"), false) + weg(FLUESSE.alpenrhein, false)}"/>`);
S.hinten(USE("f_rhein", `fill="none" stroke="#eaf5f9" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round" opacity=".7"`) + USE("f_rhein", `fill="none" stroke="#3d84b8" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"`) + USE("f_rhein", `fill="none" stroke="#9fd0ea" stroke-width=".4" stroke-linecap="round" opacity=".7"`));
S.def(`<path id="${S.id("f_elbe")}" d="${weg(FLUESSE.elbe, false)}"/>`);
S.hinten(USE("f_elbe", `fill="none" stroke="#e9f4f8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".6"`) + USE("f_elbe", `fill="none" stroke="${FLUSS}" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round"`) + flussText(11.3, 53.25, "Elbe", -24));

/* =====================================================================
   TEILE — 4: Städte; Nordrhein-Westfalen und Bayern als Lupen
   ===================================================================== */
const WORT = {
  hamburg: ["Hamburg", "HAM-burg", "Amburgo", "am-BUR-go", "Hamburg", "Am Hafen von Hamburg steht die Elbphilharmonie, ein Konzerthaus."],
  luebeck: ["Lübeck", "LÜ-beck", "Lubecca", "lu-BEC-ca", "Lübeck", "Das Holstentor ist das alte Stadttor von Lübeck."],
  bremen: ["Bremen", "BRE-men", "Brema", "BRE-ma", "Bremen", "Esel, Hund, Katze und Hahn: die Bremer Stadtmusikanten aus dem Märchen."],
  hannover: ["Hannover", "han-NO-ver", "Hannover", "han-NO-ver", "Hanover", "Das Neue Rathaus hat eine grüne Kuppel. Oben ist eine Aussichtsplattform."],
  berlin: ["Berlin", "ber-LIN", "Berlino", "ber-LI-no", "Berlin", "Berlin ist die Hauptstadt. Hier stehen das Brandenburger Tor und der Fernsehturm."],
  potsdam: ["Potsdam", "POTS-dam", "Potsdam", "POTS-dam", "Potsdam", "Schloss Sanssouci steht oben auf Weinbergterrassen."],
  magdeburg: ["Magdeburg", "MAG-de-burg", "Magdeburgo", "mag-de-BUR-go", "Magdeburg", "Magdeburg liegt an der Elbe. Der Dom hat zwei hohe Türme."],
  leipzig: ["Leipzig", "LEIP-zig", "Lipsia", "LI-psia", "Leipzig", "Das Völkerschlachtdenkmal erinnert an eine große Schlacht im Jahr 1813."],
  dresden: ["Dresden", "DRES-den", "Dresda", "DRES-da", "Dresden", "Die Frauenkirche wurde im Krieg zerstört. Seit 2005 steht sie wieder."],
  weimar: ["Weimar", "WEI-mar", "Weimar", "WEI-mar", "Weimar", "Vor dem Theater stehen Goethe und Schiller, zwei berühmte Dichter."],
  frankfurt: ["Frankfurt am Main", "FRANK-furt am MAIN", "Francoforte sul Meno", "fran-co-FOR-te sul ME-no", "Frankfurt am Main", "Frankfurt hat die meisten Hochhäuser in Deutschland."],
  trier: ["Trier", "TRIER", "Treviri", "TRE-vi-ri", "Trier", "Die Porta Nigra ist ein Stadttor aus der Römerzeit."],
  heidelberg: ["Heidelberg", "HEI-del-berg", "Heidelberg", "HEI-del-berg", "Heidelberg", "Über der Altstadt und dem Neckar steht die Ruine des Schlosses."],
  stuttgart: ["Stuttgart", "STUTT-gart", "Stoccarda", "stoc-CAR-da", "Stuttgart", "Der Stuttgarter Fernsehturm war der erste Fernsehturm aus Beton auf der Welt."],
  freiburg: ["Freiburg im Breisgau", "FREI-burg im BREIS-gau", "Friburgo in Brisgovia", "fri-BUR-go in bri-SGO-via", "Freiburg im Breisgau", "Das Münster hat einen Turm aus rotem Sandstein."],
  duesseldorf: ["Düsseldorf", "DÜS-sel-dorf", "Düsseldorf", "DÜS-sel-dorf", "Düsseldorf", "Düsseldorf liegt am Rhein. Der Rheinturm ist 240 Meter hoch."],
  koeln: ["Köln", "KÖLN", "Colonia", "co-LO-nia", "Cologne", "Die Türme des Kölner Doms sind 157 Meter hoch."],
  aachen: ["Aachen", "AA-chen", "Aquisgrana", "a-quis-GRA-na", "Aachen", "Im Aachener Dom liegt Karl der Große begraben."],
  rothenburg: ["Rothenburg ob der Tauber", "RO-then-burg ob der TAU-ber", "Rothenburg ob der Tauber", "RO-then-burg ob der TAU-ber", "Rothenburg ob der Tauber", "Rothenburg hat eine alte Stadtmauer mit vielen Türmen."],
  nuernberg: ["Nürnberg", "NÜRN-berg", "Norimberga", "no-rim-BER-ga", "Nuremberg", "Die Kaiserburg steht auf einem Felsen über der Altstadt."],
  regensburg: ["Regensburg", "RE-gens-burg", "Ratisbona", "ra-ti-SBO-na", "Regensburg", "Die Steinerne Brücke über die Donau ist fast 900 Jahre alt."],
  muenchen: ["München", "MÜN-chen", "Monaco di Baviera", "MO-na-co di ba-VIE-ra", "Munich", "Die Frauenkirche hat zwei Türme mit grünen Hauben."],
  neuschwanstein: ["das Schloss Neuschwanstein", "SCHLOSS neu-SCHWAN-stein", "il castello di Neuschwanstein", "ca-STEL-lo di neu-SCHWAN-stein", "Neuschwanstein Castle", "König Ludwig II. ließ das Schloss bauen. Es sieht aus wie ein Märchenschloss."],
};
const wort = (id) => { const [de, syl, it, itSyl, en, tipp] = WORT[id]; return { id, de, syl, it, itSyl, en, tipp, lupe: id }; };
const verschiebe = (ox, oy, svg) => `<g transform="translate(${+(-ox).toFixed(3)} ${+(-oy).toFixed(3)})">${svg}</g>`;

/* Vier Lupen: die Himmelsrichtungen. Die Städte sind Lupen-Teile mit Verweis
   auf ihre Szene. (Einzelne Teile mit „lupe“ bekämen im ganzen Bild je einen
   großen Lupenknopf – auf einer Karte deckten 23 Knöpfe die Beschriftung zu.) */
/* Der Rhein (Teil: Strecke Mainz – Emmerich; der übrige Rhein ist in der Kulisse gleich gezeichnet).
   Er liegt unter den Regionen, damit die Stadtpunkte am Ufer sichtbar bleiben; der Westen hat
   entlang des Flusses eine Aussparung, so fängt der Fluss seine Tipps selbst. */
const RHEIN_TEIL = teilzug(FLUESSE.rhein, "8.28,50.0", "6.25,51.83");
fluss("rhein", [RHEIN_TEIL], 1.25, flussText(6.42, 51.62, "Rhein", -62),
  { id: "rhein", de: "der Rhein", syl: "RHEIN", it: "il Reno", itSyl: "RE-no", en: "Rhine" },
  "Der Rhein kommt aus den Alpen und fließt durch den Bodensee bis in die Nordsee.");

/* Regionen als echte Flächen (Bundesländer zusammengesetzt): ein Tipp aufs Land sagt die Region.
   Die Städte sind Lupen-Teile; ihre Namen erscheinen erst in der Lupe (in der Gesamtansicht wären
   sie auf dem Telefon nur ≈ 3 px hoch). */
const RING = (...stuecke) => stuecke.join(" ");
const INSELN_DE = ["sylt", "foehr", "amrum", "pellworm", "helgoland", "borkum", "juist", "norderney", "baltrum", "langeoog", "spiekeroog", "wangerooge"].map((k) => INSELN_NORD[k])
  .concat(["fehmarn", "poel", "ruegen", "hiddensee"].map((k) => INSELN_OST[k]));
const REGION_RING = {
  norden: [RING(DE.dk, teilzug(OSTSEE, "9.43,54.84", "14.23,53.93"), DE.pl1, umkehr(LAENDER.bb_mv), "11.57,53.04", LAENDER.ni_st, LAENDER.ni_th, LAENDER.ni_he,
    umkehr(LAENDER.ni_nw), DE.nl2, umkehr(teilzug(NORDSEE, "8.66,54.91", "7.25,53.24")))].concat(INSELN_DE),
  osten: [RING(LAENDER.bb_mv, DE.pl2, DE.pl3, DE.cz1, umkehr(LAENDER.by_sn), umkehr(LAENDER.by_th), umkehr(LAENDER.he_th), umkehr(LAENDER.ni_th), umkehr(LAENDER.ni_st))],
  westen: [RING(DE.nl1, LAENDER.ni_nw, umkehr(LAENDER.ni_he), LAENDER.he_th, umkehr(LAENDER.he_by), umkehr(LAENDER.he_bw), LAENDER.rp_bw, DE.fr2, DE.fr3, DE.lu1, DE.lu2, DE.be1, DE.be2)],
  sueden: [RING(DE.fr1, umkehr(LAENDER.rp_bw), LAENDER.he_bw, LAENDER.he_by, LAENDER.by_th, LAENDER.by_sn, DE.cz2, DE.at, DE.by_see, DE.see, DE.ch)],
};
const flussband = (txt, b) => { const a = pkt(txt), l = [], rr = [];
  a.forEach((q, i) => { const p0 = a[Math.max(0, i - 1)], p1 = a[Math.min(a.length - 1, i + 1)], dx = p1.x - p0.x, dy = p1.y - p0.y, n = Math.hypot(dx, dy) || 1;
    l.push({ x: q.x - dy / n * b, y: q.y + dx / n * b }); rr.push({ x: q.x + dy / n * b, y: q.y - dx / n * b }); });
  return weg(l.concat(rr.reverse())); };
function region(id, staedte, knopf, worte) {
  let k = `<path d="${REGION_RING[id].map((t) => weg(t)).join("")}${id === "westen" ? flussband(RHEIN_TEIL, 1.9) : ""}" fill-rule="evenodd" fill="#fff" fill-opacity=".003"/>`;
  const boxen = staedte.map((sid) => { const b = stadtBild(sid); k += b.k; return b; });
  /* Lupe: Kasten um alle Städte (mit Namen), auf 3:2 gebracht */
  let x0 = Math.min(...boxen.map((b) => b.box.x0)) - 4, x1 = Math.max(...boxen.map((b) => b.box.x1)) + 4;
  let y0 = Math.min(...boxen.map((b) => b.box.y0)) - 5, y1 = Math.max(...boxen.map((b) => b.box.y1)) + 4;
  let w = x1 - x0, h = y1 - y0;
  if (w / h < 1.5) { const nw = h * 1.5; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / 1.5; y0 -= (nh - h) / 2; h = nh; }
  const zoom = { x: r(x0), y: r(y0), w: r(w), h: r(h) }, kz = Math.min(BR / w, HO / h) * 0.76;
  const unter = staedte.map((sid, i) => {
    const b = boxen[i], [bx, by, W, H] = b.bild;
    /* Die App setzt die Lupenmarke eines Lupen-Teils bei Ursprung + (16, −16)/k: an die obere rechte Ecke des Bildes */
    const m = MARKE[sid] || [bx + W / 2 + 4, by - H * 0.55];
    const ox = m[0] - 16 / kz, oy = m[1] + 16 / kz;
    const { x0, x1, y0, y1 } = b.box;
    return Object.assign(wort(sid), { x: ox, y: oy, kunst: verschiebe(ox, oy, b.n + flaeche(x0, y0, x1 - x0, y1 - y0, 1.2)) });
  });
  const ox = knopf[0] - 16, oy = knopf[1] + 16;
  S.teil(Object.assign({ x: ox, y: oy, kunst: verschiebe(ox, oy, k), zoom, unter }, worte));
}
const PK = (lo, la) => P(lo, la);
/* Mitte der Lupenmarke je Stadt (Bildkoordinaten): neben dem Bild, nicht auf Namen oder Nachbarn */
const MARKE = {
  hamburg: [179.3, 50], luebeck: [208.5, 37], bremen: [157.6, 62], hannover: [197, 86],
  berlin: [270, 74.5], potsdam: [236, 98], magdeburg: [214, 93], leipzig: [247, 119], weimar: [209, 130], dresden: [272.5, 127],
  duesseldorf: [137, 120], koeln: [148.5, 133], aachen: [102.3, 137.5], trier: [113.5, 169], frankfurt: [175, 155],
  heidelberg: [176.6, 180], stuttgart: [165, 197], freiburg: [136.5, 222], rothenburg: [194.5, 171], nuernberg: [212.8, 169.5],
  regensburg: [245, 186.5], muenchen: [232.5, 218], neuschwanstein: [198, 226],
};
region("norden", ["hamburg", "luebeck", "bremen", "hannover"], [121, 44],
  { id: "norden", de: "der Norden", syl: "NOR-den", it: "il Nord", itSyl: "NORD", en: "the North",
    tipp: "Im Norden liegen die Nordsee und die Ostsee. Das Land ist flach." });
region("osten", ["berlin", "potsdam", "magdeburg", "leipzig", "weimar", "dresden"], [300, 100],
  { id: "osten", de: "der Osten", syl: "OS-ten", it: "l'Est", itSyl: "EST", en: "the East",
    tipp: "Im Osten liegen Berlin, Leipzig und Dresden." });
region("westen", ["duesseldorf", "koeln", "aachen", "trier", "frankfurt"], PK(5.0, 50.3),
  { id: "westen", de: "der Westen", syl: "WES-ten", it: "l'Ovest", itSyl: "O-vest", en: "the West",
    tipp: "Im Westen fließt der Rhein. Hier liegen Köln, Düsseldorf und Frankfurt." });
region("sueden", ["heidelberg", "stuttgart", "freiburg", "rothenburg", "nuernberg", "regensburg", "muenchen", "neuschwanstein"], [PK(14.0, 49.1)[0] + 5.5, PK(14.0, 49.1)[1]],
  { id: "sueden", de: "der Süden", syl: "SÜ-den", it: "il Sud", itSyl: "SUD", en: "the South",
    tipp: "Im Süden liegen Bayern und Baden-Württemberg. Ganz im Süden sind die Alpen." });



/* =====================================================================
   DAVOR — Papier, Vignette, Kartusche
   ===================================================================== */
{
  let g = `<rect x="0" y="0" width="${BR}" height="${HO}" fill="${S.rg("vignette", [[0, "#fff", 0], [0.7, "#7a5a2a", 0], [1, "#7a5a2a", 0.22]], 0.5, 0.5, 0.75)}"/>`;
  S.def(`<pattern id="${S.id("korn")}" width="23" height="19" patternUnits="userSpaceOnUse">${Array.from({ length: 26 }, () => `<circle cx="${r(rnd() * 23)}" cy="${r(rnd() * 19)}" r="${r(0.12 + rnd() * 0.22)}" fill="${rnd() < 0.5 ? "#6b4f2a" : "#fff"}" opacity=".18"/>`).join("")}</pattern>`);
  g += `<rect x="0" y="0" width="${BR}" height="${HO}" fill="url(#${S.id("korn")})"/>`;
  { const insel = (lo, la, t, al = "middle") => { const [x, y] = P(lo, la); return `<text x="${r(x)}" y="${r(y)}" font-size="2.7" font-style="italic" text-anchor="${al}" fill="#3f6a7e" stroke="#e3f1f5" stroke-width=".6" paint-order="stroke" ${'font-family="Georgia,\'Times New Roman\',serif"'}>${t}</text>`; };
    g += insel(13.9, 54.62, "Rügen", "start") + insel(8.18, 54.93, "Sylt", "end") + insel(7.8, 54.13, "Helgoland", "end"); }
  { const [x, y] = P(9.35, 55.27); g += text(x, y, "DÄNEMARK", 3.4, "#a38d6a", `letter-spacing=".8" stroke="#f1e9d6" stroke-width=".7" paint-order="stroke"`); }
  { const [x, y] = P(15.05, 47.98); g += text(x, y, "ÖSTERREICH", 4.2, "#8f7856", `letter-spacing="1.2" stroke="#eef0e4" stroke-width=".9" paint-order="stroke"`); }
  /* Kartusche unten rechts */
  const x = 324, y = 236, w = 72, h = 20;
  g += `<rect x="${x + 0.6}" y="${y + 0.8}" width="${w}" height="${h}" rx="2" fill="#3b2a10" opacity=".25"/>`;
  g += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${S.lg("kart", [[0, "#fbf3dc"], [1, "#efe1bb"]])}" stroke="#8a6d43" stroke-width=".5"/>`;
  g += `<rect x="${x + 1.2}" y="${y + 1.2}" width="${w - 2.4}" height="${h - 2.4}" rx="1.4" fill="none" stroke="#b8975e" stroke-width=".3"/>`;
  g += `<rect x="${x + 4}" y="${y + 4.4}" width="7" height="1.8" fill="#1d1d1b"/><rect x="${x + 4}" y="${y + 6.2}" width="7" height="1.8" fill="#d52b1e"/><rect x="${x + 4}" y="${y + 8}" width="7" height="1.8" fill="#f2c200"/>`;
  g += `<text x="${x + 14}" y="${y + 9.2}" font-size="5.4" font-weight="bold" fill="#3a2716" font-family="Georgia,'Times New Roman',serif">Deutschland</text>`;
  g += `<text x="${x + 14}" y="${y + 15}" font-size="2.9" font-style="italic" fill="#5a4026" font-family="Georgia,'Times New Roman',serif">16 Bundesländer · Hauptstadt Berlin</text>`;
  S.davor(g);
}



const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/deutschlandkarte.js"));
console.log(aus);
