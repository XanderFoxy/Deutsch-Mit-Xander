#!/usr/bin/env node
/* =====================================================================
   SAN FRANCISCO (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (SFMTA „Routes with a View“ Powell-Hyde, Market Street
   Railway „Cable Cars“, Golden Gate Bridge District „Color & Art Deco
   Styling“, NPS Alcatraz „Lighthouse“/„Water Tower“, SF Travel):
   - STANDORT: Russian Hill, oben an der Ecke Hyde Street / Lombard Street
     (Haltestelle der Powell-Hyde-Linie), auf den Stufen am Anfang der
     kurvigen Lombard Street; Augenhöhe ≈ 4,6 m über der Kreuzung,
     ≈ 90 m über der Bucht. Blick nach Norden die steile Hyde Street
     hinunter zur Bucht. Echte Richtungen von hier: Alcatraz fast genau
     im Norden (2,7 km), dahinter Angel Island; die Golden Gate Bridge im
     Westen (links, 5,2 km) vor den Marin Headlands und dem Mount
     Tamalpais; Pier 39 im Nordosten (1,1 km); die kurvige Lombard Street
     und dahinter der Coit Tower auf dem Telegraph Hill im Osten (rechts).
     Panorama ≈ 180° (West → Nord → Ost), gestaucht; die Brücke ist wie mit
     dem Teleobjektiv herangeholt (×2,4), so zeigen es die Postkarten.
   - GOLDEN GATE BRIDGE (1937): Farbe „International Orange“ (Irving
     Morrow), Türme 227 m (152 m über der Fahrbahn), Hauptspannweite
     1280 m, Fahrbahn 67 m über dem Wasser, Art-déco-Türme mit nach oben
     gestuften Beinen und vier Portalriegeln über der Fahrbahn. Von Osten
     sieht man die Brücke von der Seite: die zwei Beine eines Turms stehen
     fast hintereinander, die Portale nur als schmale Schlitze.
     Nachmittags drückt der Nebel („Karl the Fog“) vom Pazifik durch das
     Golden Gate und über die Hügel von Marin.
   - ALCATRAZ: Felseninsel, oben das lange Zellenhaus aus Beton, am
     Südende der Leuchtturm (26 m, achteckig), im Norden der Wasserturm auf
     Stahlbeinen, unten am Anleger das Gebäude 64.
   - CABLE CAR (Powell-Hyde): seit 1984 weinrot mit cremefarbenen und
     hellblauen Leisten, goldene Schrift; vorne der offene Teil mit
     Bänken nach außen und dem Gripman am Greifhebel, hinten die
     geschlossene Kabine; Glocke, Trittbretter, Laternen; unter der
     Straße läuft das Seil im Schlitz zwischen den Schienen (15 km/h).
   - LOMBARD STREET (zwischen Hyde und Leavenworth): acht Haarnadel-
     kurven, rote Ziegelsteine, Beete mit Hortensien und Buchs, Treppen
     an beiden Seiten; von oben sieht man die ersten Kurven, dann fällt
     sie aus dem Blick.
   - VIKTORIANISCHE HÄUSER („Painted Ladies“): Holzhäuser um 1890 in
     drei und mehr Farben, schräge Erker (Bay Windows), Giebel mit
     Schindeln, Zierleisten; auf dem Hang stufen sie sich hinunter, unten
     die Garage, oben die Eingangstreppe.
   - UNTEN AM WASSER: Aquatic Park mit dem Hyde Street Pier und dem
     Segelschiff „Balclutha“ (1886, drei Masten); Pier 39 mit den
     Seelöwen auf den Schwimmstegen (seit 1990); Segelboote in der Bucht.
   Maßstab: Horizont y = 92, Brennweite 300; Straßengefälle 18 %
   (Fluchtpunkt der Hyde Street bei 185/146). Ein Punkt im Abstand d und
   der Höhe Z (über unseren Füßen) liegt bei x = 185 + 300·X/d,
   y = 92 + 300·(4,6 − Z)/d. Licht: später Nachmittag, Sonne im
   Westsüdwesten (links hinten).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "san_francisco", titel: "San Francisco", emoji: "🌁", thema: "Länder", kuerzel: "sfo", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1937);
const r = B.r;
const HOR = 92, F = 300, VPX = 185, E = 4.6, G = 0.18;
const P = (X, d, Z) => [VPX + F * X / d, HOR + F * (E - Z) / d];
const pt = (X, d, Z) => { const [x, y] = P(X, d, Z); return `${r(x)} ${r(y)}`; };
const boden = (d) => -G * d;
const vier = (a, b, c, e, fill, extra = "") => `<path d="M${a} L${b} L${c} L${e} Z" fill="${fill}"${extra}/>`;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("nebel")}" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter id="${S.id("nebelw")}" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="1.1"/></filter>`);
S.def(`<radialGradient id="${S.id("wulst")}" cx=".38" cy=".3" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f6f5f1"/><stop offset="1" stop-color="#d4d9dd"/></radialGradient>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".3"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="1.8"/></filter>`);
S.def(`<pattern id="${S.id("ziegel")}" width="2.4" height="1.2" patternUnits="userSpaceOnUse"><rect width="2.4" height="1.2" fill="none"/><path d="M0 1.15 H2.4 M1.2 0 V.58 M0 .58 H2.4 M0 .58 V1.2 M2.4 .58 V1.2" stroke="#6e2a20" stroke-width=".16" opacity=".55"/></pattern>`);
S.def(`<pattern id="${S.id("schindel")}" width="1.2" height="1" patternUnits="userSpaceOnUse"><path d="M0 0 Q.6 1 1.2 0" stroke="#000" stroke-width=".12" fill="none" opacity=".25"/></pattern>`);
const ORANGE = S.lg("io", [[0, "#d4553a"], [0.5, "#bf3f2a"], [1, "#952f20"]], 0, 0, 1, 0);
const WEINROT = S.lg("weinrot", [[0, "#9a2c38"], [1, "#6b1724"]]);
const CREME = "#f1e7d0", HBLAU = "#8bb8de", GOLDS = "#e3c06a";

/* =====================================================================
   KULISSE — Himmel, Pazifik im Golden Gate, Hügel von Marin, Angel
   Island, East Bay; vorne die Häuser am Hang und die Hyde Street
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 8}" fill="${S.lg("himmel", [[0, "#5b8fd0"], [0.55, "#9fc3e4"], [0.85, "#e3e2d6"], [1, "#f4e2c4"]])}"/>`);
S.hinten(`<rect y="96" width="400" height="164" fill="${S.lg("grund", [[0, "#b9b1a3"], [1, "#8d877d"]])}"/>`);
S.hinten(`<ellipse cx="-10" cy="40" rx="190" ry="110" fill="${S.rg("sonne", [[0, "#fff1c8", 0.75], [0.5, "#ffe9b8", 0.25], [1, "#ffe9b8", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[230, 24, 1.1], [330, 40, 0.8], [140, 12, 0.7], [380, 14, 0.9]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".8">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 18, 3.2], [-12, 1.2, 10, 2.4], [13, 0.8, 12, 2.8], [-3, -2.2, 9, 3]]) w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `</g>`;
  }
  S.hinten(w);
}
/* Mount Tamalpais (fern), Marin Headlands, Angel Island, Tiburon, East Bay */
{
  let h = "";
  h += `<path d="M84 97 L96 90 Q120 80 140 82 L158 76 Q166 73 176 78 Q190 84 206 86 L226 92 L240 97 Z" fill="#a9b3b6" opacity=".8"/>`;
  h += `<path d="M150 97 Q160 88 172 86 Q186 83 198 88 Q212 90 224 95 L230 97 Z" fill="${S.lg("marin", [[0, "#a59a69"], [1, "#7f7a52"]])}"/>`;
  h += `<path d="M150 97 Q156 92 164 90 L170 92 Q178 89 186 91 L180 97 Z" fill="#6f7350" opacity=".7"/>`;
  /* Angel Island und Tiburon */
  h += `<path d="M214 97.4 Q226 91 240 89.4 Q252 88.4 262 91.6 Q276 93.6 290 96.4 L292 97.4 Z" fill="${S.lg("angel", [[0, "#7f8e66"], [1, "#5d6c4c"]])}"/>`;
  h += `<path d="M284 97.4 Q296 93 312 93.4 Q326 94.4 336 97.4 Z" fill="#8b9478" opacity=".85"/>`;
  /* East Bay (Berkeley Hills) blass */
  h += `<path d="M320 97.4 Q350 93 380 92.6 L400 92 L400 97.4 Z" fill="#b4b8b6" opacity=".7"/>`;
  /* Pazifik im Golden Gate bis zum Horizont, die Presidio-Hügel links */
  h += `<rect x="20" y="${HOR}" width="140" height="6" fill="${S.lg("pazifik", [[0, "#b9c8cf"], [1, "#9fb6c2"]])}"/>`;
  h += `<path d="M0 97 L0 86 Q20 84 40 88 Q56 90 70 95 L74 97 Z" fill="#6e7c56"/>`;
  S.hinten(h);
}
/* Mittelgrund rechts: der Telegraph Hill, davor die Dächer von North Beach */
{
  let c = "";
  c += `<path d="M304 122 Q318 104 334 96 Q352 88 368 89 Q386 90 400 96 L400 140 L304 140 Z" fill="${S.lg("telegraph", [[0, "#73845a"], [1, "#56653f"]])}"/>`;
  /* Pioneer Park: Bäume oben um den Coit Tower */
  for (let i = 0; i < 26; i++) { const x = 346 + rnd() * 46, y = 92 + rnd() * 9; c += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(1.6 + rnd() * 1.8)}" fill="${rnd() < 0.5 ? "#5e7046" : "#4b5c38"}"/>`; }
  /* Häuser in Reihen am Hang (Treppen und Gärten dazwischen) */
  for (let y = 101; y < 126; y += 3.4) {
    let x = 304 + (122 - y) * 1.9 + rnd() * 3;
    while (x < 398) {
      const w = 2.6 + rnd() * 3, h = 1.8 + (y - 100) * 0.04 + rnd() * 0.8;
      if (y < 101 + 3.4 * 2 && x > 344) { x += w + 2; continue; }
      if (rnd() < 0.18) c += `<circle cx="${r(x + w / 2)}" cy="${r(y - h / 2)}" r="${r(h * 0.75)}" fill="#55683f"/>`;
      else { c += `<rect x="${r(x)}" y="${r(y - h)}" width="${r(w)}" height="${r(h)}" fill="${["#f1e9da", "#e7d9c1", "#dfe3e0", "#f0dfd3"][Math.floor(rnd() * 4)]}"/><rect x="${r(x + w * 0.65)}" y="${r(y - h)}" width="${r(w * 0.35)}" height="${r(h)}" fill="#000" opacity=".1"/>`; if (w > 3.4) c += `<rect x="${r(x + 0.6)}" y="${r(y - h + 0.5)}" width="${r(w - 1.2)}" height=".5" fill="#56616b" opacity=".6"/>`; }
      x += w + 0.4 + rnd() * 1.2;
    }
  }
  const farben = ["#efe5d2", "#e8d7b9", "#d9c7aa", "#f3efe6", "#e6c9a8", "#cdd6d9", "#efdccb", "#f2d9d0"];
  for (let row = 0; row < 7; row++) {
    const y0 = 125 + row * 8.6, hgt = 4.4 + row * 1.6;
    let x = 206 + row * 1.5 + rnd() * 5;
    while (x < 400) {
      const w = 4.6 + row * 1.5 + rnd() * 5;
      const f = farben[Math.floor(rnd() * farben.length)];
      c += `<rect x="${r(x)}" y="${r(y0 - hgt)}" width="${r(w)}" height="${r(hgt)}" fill="${f}"/>`;
      c += `<rect x="${r(x)}" y="${r(y0 - hgt)}" width="${r(w * 0.3)}" height="${r(hgt)}" fill="#fff6e0" opacity=".18"/><rect x="${r(x + w * 0.7)}" y="${r(y0 - hgt)}" width="${r(w * 0.3)}" height="${r(hgt)}" fill="#000" opacity=".1"/>`;
      for (let j = 0; j < Math.floor(w / 2.1); j++) c += `<rect x="${r(x + 0.7 + j * 2.1)}" y="${r(y0 - hgt + 1)}" width=".9" height="${r(Math.min(1.5, hgt * 0.25))}" fill="#4d5a66" opacity=".65"/>`;
      c += `<rect x="${r(x - 0.2)}" y="${r(y0 - hgt - 0.5)}" width="${r(w + 0.4)}" height=".5" fill="#9a8f80"/>`;
      if (rnd() < 0.22) c += `<circle cx="${r(x + w)}" cy="${r(y0 - hgt * 0.7)}" r="${r(1.6 + row * 0.45)}" fill="#5f7347"/>`;
      x += w + 0.5;
    }
  }
  S.hinten(c);
}
/* Mittelgrund links: Dächer am Nordhang von Russian Hill bis zum Aquatic Park */
{
  let c = "";
  for (let row = 0; row < 4; row++) {
    const y0 = 134 + row * 4.2, hgt = 2.6 + row * 0.8;
    let x = 104 + row * 6;
    while (x < 182 - row * 2) {
      const w = 3 + rnd() * 3.4;
      c += `<rect x="${r(x)}" y="${r(y0 - hgt)}" width="${r(w)}" height="${r(hgt)}" fill="${["#efe5d2", "#e9dcc6", "#dfe6e6", "#f0dccf", "#e6d2b4"][Math.floor(rnd() * 5)]}"/>`;
      c += `<rect x="${r(x)}" y="${r(y0 - hgt - 0.4)}" width="${r(w)}" height=".5" fill="#8f877b"/>`;
      if (rnd() < 0.3) c += `<circle cx="${r(x + w)}" cy="${r(y0 - hgt * 0.6)}" r="${r(1.2 + row * 0.3)}" fill="#5f7347"/>`;
      x += w + 0.4;
    }
  }
  S.hinten(c);
}
/* Die Hyde Street und die Kreuzung mit der Lombard Street */
{
  let s = "";
  const D0 = 11.5, D1 = 900;
  /* Kreuzung (Lombard Street quer, Asphalt), dann die Fahrbahn der Hyde Street */
  s += vier(pt(-60, D0, boden(D0)), pt(-60, 30, boden(30)), pt(3, 30, boden(30)), pt(3, D0, boden(D0)), "#7c7975");
  s += vier(pt(-13.5, 30, boden(30)), pt(-13.5, D1, boden(D1)), pt(-1.5, D1, boden(D1)), pt(-1.5, 30, boden(30)), S.lg("asphalt", [[0, "#8a8784"], [1, "#5f5c59"]]));
  /* Gehweg Ost (ab der Ecke) und West, mit Querrillen gegen Ausrutschen */
  s += vier(pt(-1.5, 30, boden(30)), pt(-1.5, D1, boden(D1)), pt(2.6, D1, boden(D1)), pt(2.6, 30, boden(30)), "#cfc9be");
  s += vier(pt(-17, 26, boden(26)), pt(-17, D1, boden(D1)), pt(-13.5, D1, boden(D1)), pt(-13.5, 26, boden(26)), "#c9c2b6");
  let rillen = "";
  for (let d = 30.6; d < 140; d += d < 60 ? 1 : 2.6) rillen += `M${pt(-1.4, d, boden(d))} L${pt(2.6, d, boden(d))} `;
  for (let d = 26.6; d < 140; d += d < 60 ? 1.2 : 2.8) rillen += `M${pt(-17, d, boden(d))} L${pt(-13.6, d, boden(d))} `;
  s += `<path d="${rillen}" stroke="#9f998d" stroke-width=".2" opacity=".55" fill="none"/>`;
  /* Schatten der Häuser auf der Westhälfte der Straße (Sonne im Südwesten) */
  s += vier(pt(-17, 27.4, boden(27.4)), pt(-17, 600, boden(600)), pt(-10.4, 600, boden(600)), pt(-10.8, 30, boden(30)), "#1a1612", ` opacity=".2"`);
  /* Bordsteine */
  for (const X of [-13.5, -1.5]) s += `<path d="M${pt(X, 30, boden(30))} L${pt(X, D1, boden(D1))}" stroke="#e6e1d6" stroke-width=".8"/>`;
  s += `<path d="M${pt(-60, 26, boden(26))} L${pt(-13.5, 26, boden(26))}" stroke="#e6e1d6" stroke-width=".9"/>`;
  s += `<path d="M${pt(-1.5, 30, boden(30))} L${pt(3, 30, boden(30))}" stroke="#e6e1d6" stroke-width=".9"/>`;
  /* Zebrastreifen über die Hyde Street (vorne) und Haltelinie */
  for (let i = 0; i < 6; i++) { const X0 = -13 + i * 2; s += vier(pt(X0, 12.6, boden(12.6)), pt(X0, 15.6, boden(15.6)), pt(X0 + 1.1, 15.6, boden(15.6)), pt(X0 + 1.1, 12.6, boden(12.6)), "#eeeae2", ` opacity=".85"`); }
  for (let i = 0; i < 6; i++) { const X0 = -13 + i * 2; s += vier(pt(X0, 26.8, boden(26.8)), pt(X0, 29.4, boden(29.4)), pt(X0 + 1.1, 29.4, boden(29.4)), pt(X0 + 1.1, 26.8, boden(26.8)), "#eeeae2", ` opacity=".8"`); }
  /* Flicken im Asphalt */
  for (let i = 0; i < 40; i++) { const d = 14 + rnd() * 80, X = -13 + rnd() * 11; s += `<circle cx="${r(P(X, d, 0)[0])}" cy="${r(P(X, d, boden(d))[1])}" r="${r(14 / d)}" fill="${rnd() < 0.5 ? "#6d6a66" : "#9a9692"}" opacity=".45"/>`; }
  /* Hausfronten Ost weiter unten (ab 60 m), schmal in der Flucht, Dächer von oben */
  for (let d = 380; d >= 62; d -= 9) {
    const top = boden(d + 4.5) + 9 + rnd() * 3;
    s += vier(pt(2.6, d, top), pt(16, d, top), pt(16, d + 9, top), pt(2.6, d + 9, top), "#8c8478");
    s += vier(pt(2.6, d, boden(d)), pt(2.6, d, top), pt(2.6, d + 9, top), pt(2.6, d + 9, boden(d + 9)), ["#e9dcc6", "#dfe6e6", "#efe0cf", "#e6d3c6"][Math.floor(rnd() * 4)]);
  }
  /* unten am Ende der Straße: Aquatic Park, Ufer, das weiße Schifffahrtsmuseum */
  const [ax, ay] = P(-7.5, 520, boden(480));
  s += `<rect x="${r(ax - 30)}" y="${r(ay - 3)}" width="60" height="3.2" fill="#d8c9a4"/>`;
  s += `<rect x="${r(ax - 24)}" y="${r(ay - 6.6)}" width="12" height="3.6" rx="1.4" fill="#f4f1ea"/><rect x="${r(ax - 23)}" y="${r(ay - 5.6)}" width="10" height=".7" fill="#2d6280" opacity=".7"/>`;
  S.hinten(s);
}
/* Häuser an der Nordseite der Lombard Street (rechts), am Hang gestuft;
   ihre Fronten schauen nach Süden zur kurvigen Straße */
{
  let c = "";
  const haeuser = [[204, 198, 34, 50, "#efe3cf"], [238, 192, 30, 40, "#dfe7ea"], [268, 187, 30, 33, "#f0d9c8"], [298, 183, 26, 27, "#efe6d4"], [324, 180, 24, 22, "#e5d8f0"], [348, 177.6, 22, 18, "#f2e3b8"], [370, 176, 30, 15, "#e3ece0"]];
  for (const [x, base, w, h, f] of haeuser) {
    c += `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${f}"/>`;
    c += `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${S.lg("lhaus", [[0, "#fff4d8", 0.25], [0.5, "#fff", 0], [1, "#000", 0.14]], 0, 0, 1, 0)}"/>`;
    c += `<rect x="${x - 0.6}" y="${base - h - 1.6}" width="${w + 1.2}" height="1.8" fill="#f7f3ea"/>`;
    for (let i = 0; i < 4; i++) c += `<rect x="${r(x + 1 + i * (w - 2) / 4)}" y="${base - h - 1.6}" width=".5" height="1.2" fill="#b9b0a0"/>`;
    /* Erker mittig über zwei Geschosse, Fenster, Garage unten */
    const ew = w * 0.36, ex = x + w * 0.5 - ew / 2, fh = h * 0.22;
    c += `<path d="M${r(ex - 1)} ${r(base - h + 3)} L${r(ex + ew + 1)} ${r(base - h + 3)} L${r(ex + ew)} ${r(base - h * 0.42)} L${r(ex)} ${r(base - h * 0.42)} Z" fill="#fff" opacity=".55"/>`;
    for (const yy of [base - h + 4.4, base - h + 4.4 + fh + 1.4]) {
      c += `<rect x="${r(ex)}" y="${r(yy)}" width="${r(ew)}" height="${r(fh)}" fill="#46586a"/>`;
      c += `<rect x="${r(ex + ew * 0.32)}" y="${r(yy)}" width="${r(ew * 0.06)}" height="${r(fh)}" fill="#fff"/><rect x="${r(ex + ew * 0.62)}" y="${r(yy)}" width="${r(ew * 0.06)}" height="${r(fh)}" fill="#fff"/>`;
      c += `<rect x="${r(x + 1.4)}" y="${r(yy + 0.6)}" width="${r(w * 0.14)}" height="${r(fh * 0.8)}" fill="#46586a"/><rect x="${r(x + w - 1.4 - w * 0.14)}" y="${r(yy + 0.6)}" width="${r(w * 0.14)}" height="${r(fh * 0.8)}" fill="#46586a"/>`;
    }
    c += `<rect x="${r(x + w * 0.2)}" y="${r(base - h * 0.28)}" width="${r(w * 0.36)}" height="${r(h * 0.28)}" fill="#d8d2c6"/>`;
    for (let j = 1; j < 4; j++) c += `<line x1="${r(x + w * 0.2)}" y1="${r(base - h * 0.28 + j * h * 0.07)}" x2="${r(x + w * 0.56)}" y2="${r(base - h * 0.28 + j * h * 0.07)}" stroke="#b5ad9f" stroke-width=".2"/>`;
    c += `<rect x="${r(x + w * 0.66)}" y="${r(base - h * 0.3)}" width="${r(w * 0.14)}" height="${r(h * 0.3)}" fill="#5a3a2a"/>`;
  }
  /* Hecken und Bäume vor den Häusern */
  for (let i = 0; i < 26; i++) { const x = 206 + rnd() * 194, y = 199 - (x - 204) * 0.11 + rnd() * 3; c += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(2 + rnd() * 2.4)}" fill="${rnd() < 0.5 ? "#4f6b3a" : "#3e5a2e"}"/>`; }
  S.hinten(c);
}

/* =====================================================================
   1 — DIE BUCHT (San Francisco Bay) mit dem Pazifik-Licht
   ===================================================================== */
{
  const ufer = `M0 97.2 L400 97.2 L400 99 Q372 98.6 348 101 Q328 104 318 113 Q308 121 294 122.4 L252 125.4 Q228 132 212 139.6 L180 142.4 Q150 140 132 133 Q104 121 60 114 L0 110 Z`;
  let k = `<path d="${ufer}" fill="${S.lg("bay", [[0, "#a9bfc6"], [0.3, "#6f93a6"], [1, "#4d7189"]])}"/>`;
  /* Sonnenglitzern links (Sonne im Westen) */
  k += `<path d="${ufer}" fill="${S.lg("glanz", [[0, "#fff3d0", 0.55], [0.35, "#fff3d0", 0.1], [0.6, "#fff3d0", 0]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 150; i++) {
    const t = Math.pow(rnd(), 1.3), y = 97.6 + t * 40, x = rnd() * 400;
    if (y > (x > 300 ? 99 + Math.max(0, 318 - x) * 0.5 : x > 250 ? 120 : x < 100 ? 109 : 132)) continue;
    const w = 1 + t * 5 * (0.5 + rnd());
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} -${r(0.2 + t * 0.4)} ${r(w)} 0" stroke="${x < 160 && rnd() < 0.6 ? "#fff6dc" : rnd() < 0.6 ? "#e2eef2" : "#355c72"}" stroke-width="${r(0.12 + t * 0.3)}" fill="none" opacity="${r(0.35 + rnd() * 0.4)}"/>`;
  }
  /* der geschwungene Municipal Pier im Aquatic Park */
  k += `<path d="M132 133 Q146 128.4 162 128.6 Q176 129 184 131" stroke="#dcd6c8" stroke-width=".5" fill="none"/>`;
  S.teil({ id: "bucht", de: "die Bucht", syl: "BUCHT", it: "la baia", itSyl: "BA-ia", en: "bay", x: 0, y: 0, kunst: k,
    tipp: "Die Bucht von San Francisco ist eine der größten Naturhäfen der Welt." });
}

/* =====================================================================
   2 — DER NEBEL (zieht vom Pazifik durch das Golden Gate und über Marin)
   ===================================================================== */
{
  /* Nebelbank: Quellwolken über den Hügeln von Marin, flache Schicht auf dem Meer */
  let k = `<g filter="url(#${S.id("nebelw")})">`;
  k += `<path d="M58 97.4 Q70 90.6 90 91.4 Q110 88.6 130 90.4 Q150 86.4 168 89 L170 97.4 Z" fill="#eef0f0" opacity=".9"/>`;
  let wulst = "";
  for (const [x, y, rr] of [[150, 89, 5], [160, 85.4, 6.4], [172, 83, 7.4], [185, 81.6, 7.8], [198, 82.6, 7.2], [210, 85, 6.4], [221, 88.4, 5.4], [230, 91.6, 4.4], [178, 88, 6], [204, 89, 6]]) wulst += `<circle cx="${x}" cy="${y}" r="${rr}" fill="url(#${S.id("wulst")})"/>`;
  k += wulst;
  k += `<path d="M146 97.4 L146 90 Q190 84 236 93 L238 97.4 Z" fill="#e4e8ea"/>`;
  k += `</g>`;
  k += `<path d="M156 84 Q170 78 184 76.6 Q198 76 210 80.4" stroke="#fff6e2" stroke-width="1.1" fill="none" opacity=".7" filter="url(#${S.id("nebelw")})"/>`;
  S.teil({ id: "nebel", de: "der Nebel", syl: "NE-bel", it: "la nebbia", itSyl: "NEB-bia", en: "fog", x: 0, y: 0, kunst: k,
    tipp: "Im Sommer kommt nachmittags oft Nebel vom Meer. Die Leute in San Francisco nennen ihn „Karl“." });
}

/* =====================================================================
   3 — DIE GOLDEN GATE BRIDGE (fern, von der Seite; herangeholt ×2,4)
   ===================================================================== */
const GG = { s: 104, n: 158, wasser: 97.4, top: 70, deck: 90.4, sued: 80, nord: 174 };
{
  const { s: XS, n: XN, wasser: W, top: T, deck: D, sued: XA, nord: XB } = GG;
  let k = `<g filter="url(#${S.id("dunst")})">`;
  /* Fahrbahn mit Fachwerk (Gegenlicht: dunkleres Orange) */
  const deck = (x0, y0, x1, y1) => `<path d="M${x0} ${r(y0)} L${x1} ${r(y1)} L${x1} ${r(y1 + 1.4)} L${x0} ${r(y0 + 1.4)} Z" fill="#a8432e"/>`;
  k += deck(XA, D + 1.8, XS, D) + deck(XS, D, XN, D) + deck(XN, D, XB, D + 1.4);
  let fw = "";
  for (let x = XA + 1; x < XB; x += 1.1) fw += `M${r(x)} ${r(D + 0.1)} L${r(x + 0.55)} ${r(D + 1.3)} `;
  k += `<path d="${fw}" stroke="#6d2416" stroke-width=".12" fill="none"/>`;
  k += `<path d="M${XA} ${r(D + 1.6)} L${XB} ${r(D + 1.2)}" stroke="#e98a63" stroke-width=".2" opacity=".6"/>`;
  /* Tragseile: Hauptfeld und Seitenfelder, Hänger */
  const kurve = (x0, y0, x1, y1, tief) => `M${x0} ${y0} Q${r((x0 + x1) / 2)} ${r(tief)} ${x1} ${y1}`;
  k += `<path d="${kurve(XS, T + 1.5, XN, T + 1.5, D + 18)}" stroke="#b5452e" stroke-width=".5" fill="none"/>`;
  k += `<path d="M${XS} ${T + 1.5} Q${XS - 14} ${D - 4} ${XA} ${D + 1}" stroke="#b5452e" stroke-width=".45" fill="none"/>`;
  k += `<path d="M${XN} ${T + 1.5} Q${XN + 10} ${D - 5} ${XB} ${D}" stroke="#b5452e" stroke-width=".45" fill="none"/>`;
  let h = "";
  for (let i = 1; i < 30; i++) { const t = i / 30, x = XS + (XN - XS) * t, y = (1 - t) * (1 - t) * (T + 1.5) + 2 * t * (1 - t) * (D + 18) + t * t * (T + 1.5); if (y < D - 0.3) h += `M${r(x)} ${r(y)} L${r(x)} ${D} `; }
  for (let i = 1; i < 7; i++) { const t = i / 7, x = XS + (XA - XS) * t, y = (1 - t) * (1 - t) * (T + 1.5) + 2 * t * (1 - t) * (D - 4) + t * t * (D + 1); if (y < D) h += `M${r(x)} ${r(y)} L${r(x)} ${r(D + 0.3 * t)} `; }
  for (let i = 1; i < 5; i++) { const t = i / 5, x = XN + (XB - XN) * t, y = (1 - t) * (1 - t) * (T + 1.5) + 2 * t * (1 - t) * (D - 5) + t * t * D; if (y < D) h += `M${r(x)} ${r(y)} L${r(x)} ${D} `; }
  k += `<path d="${h}" stroke="#b5452e" stroke-width=".1" fill="none" opacity=".8"/>`;
  /* die Türme: von der Seite schlank, Beine nach oben gestuft, Portalschlitze */
  const turm = (x) => {
    let s = "";
    const stufen = [[W, 1.9], [D - 4.6, 1.7], [T + 13, 1.55], [T + 7, 1.42], [T + 2.4, 1.3]];
    let p = `M${r(x - 2.5)} ${W}`;
    for (let i = 0; i < stufen.length; i++) { const [y, hw] = stufen[i], yn = i + 1 < stufen.length ? stufen[i + 1][0] : T; p += ` L${r(x - hw)} ${r(y)} L${r(x - hw)} ${r(yn)}`; }
    for (let i = stufen.length - 1; i >= 0; i--) { const [y, hw] = stufen[i], yn = i + 1 < stufen.length ? stufen[i + 1][0] : T; p += ` L${r(x + hw)} ${r(yn)} L${r(x + hw)} ${r(y)}`; }
    s += `<path d="${p} Z" fill="${ORANGE}"/>`;
    /* senkrechte Rippen (Art déco), Portalriegel als helle Schlitze */
    s += `<line x1="${r(x - 0.5)}" y1="${T + 1}" x2="${r(x - 0.5)}" y2="${W}" stroke="#7d2617" stroke-width=".18"/><line x1="${r(x + 0.7)}" y1="${T + 1}" x2="${r(x + 0.7)}" y2="${W}" stroke="#e57a58" stroke-width=".14" opacity=".7"/>`;
    for (const y of [T + 2.8, T + 7.6, T + 13.6, D - 4.2]) s += `<rect x="${r(x - 1.2)}" y="${r(y)}" width="2.4" height=".42" fill="#f2c9b0" opacity=".75"/>`;
    /* Kappe mit Sattel */
    s += `<path d="M${r(x - 1.5)} ${T} L${r(x - 1.1)} ${T - 1.3} L${r(x + 1.1)} ${T - 1.3} L${r(x + 1.5)} ${T} Z" fill="#a53a26"/><rect x="${r(x - 0.7)}" y="${T - 2}" width="1.4" height=".8" fill="#953424"/>`;
    s += `<rect x="${r(x - 2.2)}" y="${W - 1.2}" width="4.4" height="1.2" fill="#9a958c"/>`;
    return s;
  };
  k += turm(XS) + turm(XN);
  /* Licht von links (Gegenlicht am Abend): warmer Saum */
  k += `<path d="M${XS - 1.9} ${W} L${XS - 1.3} ${T}" stroke="#ffb27a" stroke-width=".35" opacity=".7"/><path d="M${XN - 1.9} ${W} L${XN - 1.3} ${T}" stroke="#ffb27a" stroke-width=".35" opacity=".7"/>`;
  /* Fort Point (Ziegelfestung unter dem Südende) */
  k += `<rect x="${XA - 4}" y="${r(D + 2.6)}" width="8" height="4.4" fill="#a76a4f"/><rect x="${XA - 4}" y="${r(D + 2.6)}" width="8" height=".7" fill="#c58a6e"/>`;
  k += `</g>`;
  S.teil({ id: "golden_gate_bridge", de: "die Golden Gate Bridge", syl: "GOL-den GATE BRIDGE", it: "il Golden Gate Bridge", itSyl: "GOL-den GATE BRIDGE", en: "Golden Gate Bridge",
    x: 0, y: 0, kunst: k, tipp: "Die Golden Gate Bridge (1937) ist 2,7 Kilometer lang. Ihre Farbe heißt „International Orange“.",
    zoom: { x: XS - 18, y: T - 5, w: 48, h: 32 },
    unter: [
      { id: "turm", de: "der Turm", syl: "TURM", it: "la torre", itSyl: "TOR-re", en: "tower", x: XS, y: W, kunst: flaeche(-2.6, -(W - T) - 2.4, 5.2, W - T + 2.4, 0.5),
        tipp: "Die Türme sind 227 Meter hoch — höher als der Kölner Dom (157 m)." },
      { id: "tragseil", de: "das Tragseil", syl: "TRAG-seil", it: "il cavo portante", itSyl: "CA-vo por-TAN-te", en: "main cable", x: XS + 10, y: T + 11, kunst: flaeche(-5, -6, 10, 10, 0.5),
        tipp: "Jedes der zwei Tragseile ist fast einen Meter dick und besteht aus 27 572 Drähten." },
    ] });
}
/* der Nebel umspült den Fuß des Nordturms (liegt über allem, fängt nichts) */
S.davor(`<g filter="url(#${S.id("nebel")})" opacity=".75" pointer-events="none"><path d="M140 97.8 Q150 93.6 160 94.6 Q172 92.4 184 95.6 Q190 97 186 98.4 L140 98.4 Z" fill="#fbfaf6"/></g>`);

/* =====================================================================
   4 — DIE INSEL ALCATRAZ (im Norden, mitten in der Bucht)
   ===================================================================== */
{
  const X = 204, Y = 104.4;
  let k = `<ellipse cx="0" cy=".2" rx="27" ry="1" fill="#3b5b6e" opacity=".35"/>`;
  /* Felsen mit Klippen, Grün oben */
  k += `<path d="M-26 0 L-24 -3 Q-20 -6.6 -14 -7.2 L-4 -7.8 L8 -8 Q16 -8 20 -6.2 L24 -3.6 L26.4 0 Z" fill="${S.lg("fels", [[0, "#a59a86"], [0.5, "#8a7f6c"], [1, "#6c6455"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-23.6 -3.2 Q-20 -6.4 -14 -7 L-4 -7.6 L8 -7.8 Q16 -7.8 20 -6 L22 -4.6 Q10 -5.2 0 -5 Q-12 -4.8 -23.6 -3.2 Z" fill="#7c8a5c" opacity=".85"/>`;
  for (let i = 0; i < 14; i++) k += `<path d="M${r(-24 + i * 3.6)} ${r(-1 - rnd())} l${r(0.6 + rnd())} ${r(-1.4 - rnd() * 1.6)}" stroke="#5c5548" stroke-width=".3" opacity=".6"/>`;
  /* Gebäude 64 am Anleger (rechts unten), mit dem alten Schriftzug */
  k += `<rect x="12" y="-5.6" width="10" height="4.8" fill="#d8cfbd"/><rect x="12" y="-5.6" width="10" height=".6" fill="#efe8da"/>`;
  for (let i = 0; i < 5; i++) k += `<rect x="${12.8 + i * 1.9}" y="-4.4" width=".8" height="1" fill="#4a4a48"/><rect x="${12.8 + i * 1.9}" y="-2.6" width=".8" height="1" fill="#4a4a48"/>`;
  k += `<rect x="9" y="-1" width="15" height="1" fill="#6d665a"/>`;
  /* das Zellenhaus: langer Betonbau oben auf der Insel */
  k += `<rect x="-10" y="-12.2" width="20" height="4.6" fill="${S.lg("zellen", [[0, "#f1ebde"], [1, "#cfc6b4"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-10.4" y="-12.8" width="20.8" height=".7" fill="#e2dccf"/>`;
  for (let i = 0; i < 12; i++) k += `<rect x="${r(-9.2 + i * 1.6)}" y="-11.2" width=".55" height="2.4" fill="#4c4e50"/>`;
  k += `<rect x="-2" y="-13.8" width="4" height="1.2" fill="#ddd5c6"/>`;
  /* der Leuchtturm am Südende (links): achteckig, weiß, Laterne */
  k += `<path d="M-13.4 -7.6 L-13 -17.4 L-11.2 -17.4 L-10.8 -7.6 Z" fill="${S.lg("lturm", [[0, "#ffffff"], [1, "#d4d2cc"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-13.6" y="-18.2" width="3" height=".8" fill="#3c3d3e"/><rect x="-12.8" y="-19.8" width="1.4" height="1.6" fill="#f8e7a2"/><path d="M-13 -19.8 L-12.1 -20.8 L-11.2 -19.8 Z" fill="#2e2f30"/>`;
  /* der Wasserturm im Norden (rechts): Tank auf Stahlbeinen */
  k += `<path d="M6 -8 L7 -15 M10 -8 L9 -15 M6 -8 L9 -15 M10 -8 L7 -15" stroke="#6b6a66" stroke-width=".35"/>`;
  k += `<rect x="5.8" y="-18.6" width="4.4" height="3.8" rx=".4" fill="${S.lg("wturm", [[0, "#efeae0"], [1, "#bdb6a8"]], 0, 0, 1, 0)}"/><path d="M5.6 -18.6 L8 -19.8 L10.4 -18.6 Z" fill="#a8a296"/>`;
  k += `<rect x="6.2" y="-17.4" width="3.6" height=".6" fill="#b5463a" opacity=".55"/>`;
  /* Bäume (Eukalyptus) und Licht von links */
  for (const [x, y] of [[-18, -6], [-16, -6.8], [16, -6.6], [3, -8.2]]) k += `<circle cx="${x}" cy="${y}" r="1.4" fill="#5d6f45"/>`;
  S.teil({ id: "alcatraz", de: "die Insel Alcatraz", syl: "IN-sel AL-ca-traz", it: "l'isola di Alcatraz", itSyl: "I-so-la di AL-ca-traz", en: "Alcatraz Island", x: X, y: Y, kunst: k,
    tipp: "Auf Alcatraz war bis 1963 ein berühmtes Gefängnis. Heute fahren Besucher mit dem Schiff hin.",
    zoom: { x: X - 28, y: Y - 23, w: 54, h: 36 },
    unter: [
      { id: "leuchtturm", de: "der Leuchtturm", syl: "LEUCHT-turm", it: "il faro", itSyl: "FA-ro", en: "lighthouse", x: X - 12.1, y: Y - 7.6, kunst: flaeche(-2, -13.4, 4, 13.6, 0.4),
        tipp: "Der Leuchtturm von Alcatraz war der erste an der Westküste der USA (1854)." },
      { id: "gefaengnis", de: "das Gefängnis", syl: "ge-FÄNG-nis", it: "la prigione", itSyl: "pri-GIO-ne", en: "prison", x: X, y: Y - 7.6, kunst: flaeche(-9.6, -6.4, 19.2, 6.4, 0.4),
        tipp: "Im Zellenhaus gab es 336 Zellen. Von hier konnte fast niemand fliehen." },
      { id: "wasserturm", de: "der Wasserturm", syl: "WAS-ser-turm", it: "la torre dell'acqua", itSyl: "TOR-re del-L'AC-qua", en: "water tower", x: X + 8, y: Y - 8, kunst: flaeche(-2.8, -12, 5.6, 12, 0.4),
        tipp: "Das Trinkwasser kam mit dem Schiff auf die Insel." },
    ] });
}

/* =====================================================================
   5 — DAS SEGELBOOT (zwei Segelboote in der Bucht)
   ===================================================================== */
{
  let k = "";
  const boot = (x, y, s, links) => {
    const m = links ? -1 : 1;
    let g = `<path d="M${r(x - 3 * s)} ${y} L${r(x + 3.4 * s)} ${y} L${r(x + 2.6 * s)} ${r(y + 0.9 * s)} L${r(x - 2.4 * s)} ${r(y + 0.9 * s)} Z" fill="#f4f4f2"/>`;
    g += `<line x1="${x}" y1="${y}" x2="${x}" y2="${r(y - 9 * s)}" stroke="#666" stroke-width="${r(0.18 * s)}"/>`;
    g += `<path d="M${r(x + 0.2 * m * s)} ${r(y - 8.6 * s)} Q${r(x + 3.6 * m * s)} ${r(y - 4 * s)} ${r(x + 3 * m * s)} ${r(y - 0.6 * s)} L${r(x + 0.2 * m * s)} ${r(y - 0.6 * s)} Z" fill="${S.lg("segel" + (links ? "l" : "r"), [[0, "#ffffff"], [1, "#dfe3e6"]], 0, 0, 1, 0)}"/>`;
    g += `<path d="M${r(x - 0.2 * m * s)} ${r(y - 7.8 * s)} L${r(x - 2.6 * m * s)} ${r(y - 0.8 * s)} L${r(x - 0.2 * m * s)} ${r(y - 0.8 * s)} Z" fill="#eef0f1"/>`;
    g += `<path d="M${r(x - 4 * s)} ${r(y + 1 * s)} q${r(4 * s)} ${r(0.6 * s)} ${r(8 * s)} 0" stroke="#e8f1f4" stroke-width=".2" fill="none" opacity=".8"/>`;
    return g;
  };
  k += boot(152, 112.6, 0.9, false) + boot(246, 109.4, 0.65, true);
  S.teil({ oben: true, id: "segelboot", de: "das Segelboot", syl: "SE-gel-boot", it: "la barca a vela", itSyl: "BAR-ca a VE-la", en: "sailboat", x: 0, y: 0, kunst: k });
}

/* =====================================================================
   6 — DER PIER 39 mit den Seelöwen (Nordosten, am Ufer)
   ===================================================================== */
{
  const X = 292, Y = 120.2;
  let k = "";
  /* Pier: Holzbohlen auf Pfählen, zweistöckige Holzhäuser, Fahnen */
  k += `<rect x="-22" y="-1.6" width="44" height="1.6" fill="#6f5a43"/>`;
  for (let x = -21; x < 22; x += 2) k += `<line x1="${x}" y1="0" x2="${x}" y2="1.2" stroke="#4e3d2c" stroke-width=".3"/>`;
  for (const [x0, w, h, c] of [[-20, 10, 4.6, "#9c8468"], [-9, 12, 5.4, "#8f775c"], [4, 9, 4.2, "#a08a6c"], [14, 7, 3.6, "#93795d"]]) {
    k += `<rect x="${x0}" y="${-1.6 - h}" width="${w}" height="${h}" fill="${c}"/>`;
    k += `<path d="M${x0 - 0.4} ${-1.6 - h} L${x0 + w / 2} ${-1.6 - h - 1.6} L${x0 + w + 0.4} ${-1.6 - h} Z" fill="#5d6a6e"/>`;
    for (let i = 0; i < Math.floor(w / 2); i++) k += `<rect x="${x0 + 0.6 + i * 2}" y="${-1.6 - h + 1.2}" width="1" height="1.1" fill="#f3e3b5" opacity=".85"/>`;
  }
  k += `<rect x="-3.6" y="-9.4" width="7.2" height="2" fill="#1f4f7a"/><text x="0" y="-7.9" font-size="1.5" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">PIER 39</text>`;
  for (const x of [-18, -6, 8, 18]) k += `<line x1="${x}" y1="${-7 - (x % 3)}" x2="${x}" y2="${-11 - (x % 3)}" stroke="#ddd" stroke-width=".18"/><rect x="${x}" y="${-11 - (x % 3)}" width="1.6" height="1" fill="${x < 0 ? "#c0392b" : "#2a6fb3"}"/>`;
  /* die Schwimmstege (K-Dock) links, mit Seelöwen */
  for (const [x0, y0] of [[-34, 0.6], [-28, 2], [-38, 2.4]]) k += `<rect x="${x0}" y="${y0}" width="8.4" height="1" rx=".2" fill="#b8b1a2"/>`;
  const loewe = (x, y, s, dir) => `<path d="M${r(x - 1.6 * s * dir)} ${y} Q${r(x - 0.4 * s * dir)} ${r(y - 1.3 * s)} ${r(x + 1 * s * dir)} ${r(y - 1.7 * s)} Q${r(x + 1.6 * s * dir)} ${r(y - 1.7 * s)} ${r(x + 1.5 * s * dir)} ${r(y - 1.1 * s)} L${r(x + 1.2 * s * dir)} ${r(y - 0.3 * s)} L${r(x + 1.6 * s * dir)} ${y} Z" fill="${S.lg("loewe", [[0, "#8a6a4a"], [1, "#4f3a26"]])}"/>`;
  for (const [x, y, s, d] of [[-31, 0.6, 0.8, 1], [-28.4, 0.6, 0.7, -1], [-25.8, 2, 0.75, 1], [-23, 2, 0.8, -1], [-35.6, 2.4, 0.7, 1], [-33, 2.4, 0.72, 1]]) k += loewe(x, y, s, d);
  S.teil({ id: "pier_39", de: "der Pier 39", syl: "PIER NEUN-und-DREI-ßig", it: "il Pier 39", itSyl: "PIER TREN-ta-NO-ve", en: "Pier 39", x: X, y: Y, kunst: k,
    tipp: "Am Pier 39 gibt es Läden und Restaurants — und Hunderte Seelöwen.",
    zoom: { x: X - 42, y: Y - 14, w: 42, h: 28 },
    unter: [
      { id: "seeloewe", de: "der Seelöwe", syl: "SEE-lö-we", it: "il leone marino", itSyl: "le-O-ne ma-RI-no", en: "sea lion", x: X - 29, y: Y + 1.5, kunst: flaeche(-9, -2.6, 16, 4.4, 0.4),
        tipp: "Seit 1990 liegen die Seelöwen auf den Schwimmstegen am Pier 39 in der Sonne." },
    ] });
}

/* =====================================================================
   7 — DER COIT TOWER auf dem Telegraph Hill (rechts)
   ===================================================================== */
{
  const X = 370, Y = 92.4;
  let k = "";
  k += `<rect x="-6" y="-1.6" width="12" height="1.6" fill="#d8d0bf"/><rect x="-4.6" y="-3.4" width="9.2" height="1.8" fill="#e8e1d2"/>`;
  k += `<path d="M-2.8 -3.4 L-2.6 -24 L2.6 -24 L2.8 -3.4 Z" fill="${S.lg("coit", [[0, "#fffaf0"], [0.45, "#ece4d4"], [1, "#b8ae9c"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-2, -1.2, -0.4, 0.4, 1.2, 2]) k += `<line x1="${x}" y1="-3.6" x2="${x * 0.97}" y2="-23.4" stroke="#b9ae9a" stroke-width=".16"/>`;
  /* Aussichtsgeschoss mit Bogenfenstern, Krone */
  k += `<rect x="-3" y="-26.6" width="6" height="2.8" fill="#f2ebdd"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${-2.4 + i * 1.4} -24.2 L${-2.4 + i * 1.4} -25.6 Q${-1.95 + i * 1.4} -26.3 ${-1.5 + i * 1.4} -25.6 L${-1.5 + i * 1.4} -24.2 Z" fill="#3e4a55"/>`;
  k += `<path d="M-3.2 -26.6 L-2.8 -27.6 L2.8 -27.6 L3.2 -26.6 Z" fill="#e2d9c8"/>`;
  k += `<rect x="-2.8" y="-28" width="5.6" height=".5" fill="#cbc1ae"/>`;
  k += `<path d="M2.8 -3.4 L2.6 -24 L1.2 -24 L1.4 -3.4 Z" fill="#000" opacity=".1"/>`;
  S.teil({ id: "coit_tower", de: "der Coit Tower", syl: "COIT TOW-er", it: "la Coit Tower", itSyl: "COIT TOW-er", en: "Coit Tower", x: X, y: Y, kunst: k,
    tipp: "Der Coit Tower (1933) steht auf dem Telegraph Hill. Von oben sieht man die ganze Stadt." });
}

/* =====================================================================
   8 — DAS SEGELSCHIFF Balclutha am Hyde Street Pier (unten am Ende der
   Hyde Street)
   ===================================================================== */
{
  const [bx, by] = P(-8, 560, boden(480));
  let k = "";
  k += `<path d="M-10 0 L9 0 L10.6 -2.4 L-11.4 -2.4 Z" fill="#232528"/><rect x="-11" y="-2.6" width="21.4" height=".5" fill="#e8e2d2"/>`;
  for (const [x, h] of [[-6, 20], [0, 22], [5.6, 18]]) {
    k += `<line x1="${x}" y1="-2.6" x2="${x}" y2="${-h}" stroke="#3a2e22" stroke-width=".35"/>`;
    for (const t of [0.35, 0.55, 0.75, 0.9]) k += `<line x1="${r(x - 2.6 * (1.1 - t))}" y1="${r(-h * t)}" x2="${r(x + 2.6 * (1.1 - t))}" y2="${r(-h * t)}" stroke="#3a2e22" stroke-width=".2"/>`;
  }
  k += `<path d="M-11.4 -2.4 L-6 -20 L0 -22 L5.6 -18 L13 -2.4" stroke="#5a4c3c" stroke-width=".1" fill="none"/><line x1="-11" y1="-2.6" x2="-15" y2="-5" stroke="#3a2e22" stroke-width=".3"/>`;
  S.teil({ id: "segelschiff", de: "das Segelschiff", syl: "SE-gel-schiff", it: "il veliero", itSyl: "ve-LIE-ro", en: "sailing ship", x: bx + 8, y: by, kunst: `<g transform="scale(.8)">${k}</g>` + flaeche(-9, -18, 18, 18, 0.5),
    tipp: "Die „Balclutha“ ist ein Segelschiff von 1886. Heute ist sie ein Museum am Hyde Street Pier." });
}

/* =====================================================================
   9 — DIE VIKTORIANISCHEN HÄUSER („Painted Ladies“), Westseite der
   Hyde Street, am Hang gestuft. Fassaden zur Straße (X = −17).
   ===================================================================== */
const HAUS_UNTER = [];
{
  let k = "";
  const farben = [
    { wand: "#9cc3df", wandS: "#7fa6c4", trim: "#ffffff", akz: "#2f4f7a", dach: "#6f6a73" },
    { wand: "#f2d77a", wandS: "#d6ba5e", trim: "#ffffff", akz: "#3f6a4a", dach: "#6c5f55" },
    { wand: "#a9d6b5", wandS: "#8cbb99", trim: "#fff7ea", akz: "#a3345a", dach: "#5d5a60" },
    { wand: "#f1b6c0", wandS: "#d899a4", trim: "#ffffff", akz: "#6a2a45", dach: "#635a5e" },
    { wand: "#c9b6e4", wandS: "#ad9acb", trim: "#ffffff", akz: "#4e3b78", dach: "#5e5865" },
    { wand: "#f5e3c3", wandS: "#dcc8a6", trim: "#ffffff", akz: "#8b3a2c", dach: "#635b52" },
  ];
  const X0 = -17, LOT = 7.6;
  /* vom fernsten zum nächsten Haus zeichnen (das nahe verdeckt das ferne) */
  for (let i = 7; i >= 0; i--) {
    const d0 = 27.4 + i * LOT, d1 = d0 + LOT, f = farben[i % farben.length];
    const zb = boden(d1) - 0.3, ze = boden(d0) + 9.6, zg = ze + 3.4;   /* Fuß (talseitig), Traufe, Giebelspitze */
    const q = (Xa, da, za, Xb, db, zb2, Xc, dc, zc, Xd, dd, zd, fill, ex = "") => vier(pt(Xa, da, za), pt(Xb, db, zb2), pt(Xc, dc, zc), pt(Xd, dd, zd), fill, ex);
    /* Dach (von oben sichtbar, weiter unten am Hang) und Brandwand */
    if (ze < E - 0.4) k += q(X0, d0, ze, X0 - 6, d0, ze + 0.8, X0 - 6, d1, ze + 0.8, X0, d1, ze, f.dach);
    /* Fassade */
    k += `<path d="M${pt(X0, d0, boden(d0))} L${pt(X0, d0, ze)} L${pt(X0, d1, ze)} L${pt(X0, d1, zb)} Z" fill="${f.wandS}"/>`;
    /* Giebel (Dreieck in der Fassadenebene) mit Schindeln */
    const gm = (d0 + d1) / 2;
    k += `<path d="M${pt(X0, d0 - 0.3, ze)} L${pt(X0, gm, zg)} L${pt(X0, d1 + 0.3, ze)} Z" fill="${f.wand}"/>`;
    k += `<path d="M${pt(X0, d0 - 0.3, ze)} L${pt(X0, gm, zg)} L${pt(X0, d1 + 0.3, ze)} Z" fill="url(#${S.id("schindel")})"/>`;
    k += `<path d="M${pt(X0 + 0.1, d0 - 0.5, ze - 0.1)} L${pt(X0 + 0.1, gm, zg + 0.25)} L${pt(X0 + 0.1, d1 + 0.5, ze - 0.1)}" stroke="${f.trim}" stroke-width="${r(Math.max(0.25, 12 / d0))}" fill="none"/>`;
    /* Gesims mit Konsolen */
    k += `<path d="M${pt(X0 + 0.25, d0, ze)} L${pt(X0 + 0.25, d1, ze)} L${pt(X0 + 0.25, d1, ze - 0.5)} L${pt(X0 + 0.25, d0, ze - 0.5)} Z" fill="${f.trim}"/>`;
    for (let t = 0.1; t < 1; t += 0.12) { const d = d0 + t * LOT; k += `<path d="M${pt(X0 + 0.25, d, ze - 0.5)} L${pt(X0 + 0.25, d, ze - 0.9)}" stroke="${f.akz}" stroke-width="${r(Math.max(0.12, 5 / d))}"/>`; }
    /* Garage unten (talseitig) und Eingangstreppe oben (bergseitig) */
    const zEG = boden(d0) + 0.2;
    k += `<path d="M${pt(X0 + 0.05, d0 + 3.6, zb)} L${pt(X0 + 0.05, d0 + 3.6, zb + 2.3)} L${pt(X0 + 0.05, d0 + 6.6, zb + 2.3)} L${pt(X0 + 0.05, d0 + 6.6, zb)} Z" fill="${f.trim}"/>`;
    k += `<path d="M${pt(X0 + 0.06, d0 + 3.9, zb)} L${pt(X0 + 0.06, d0 + 3.9, zb + 2.05)} L${pt(X0 + 0.06, d0 + 6.3, zb + 2.05)} L${pt(X0 + 0.06, d0 + 6.3, zb)} Z" fill="#d9d4ca"/>`;
    for (let j = 1; j < 5; j++) k += `<path d="M${pt(X0 + 0.07, d0 + 3.9, zb + j * 0.42)} L${pt(X0 + 0.07, d0 + 6.3, zb + j * 0.42)}" stroke="#b0a99c" stroke-width="${r(Math.max(0.08, 3 / d0))}"/>`;
    /* Treppe hinauf zur Haustür (bergseitig), Tür mit Oberlicht */
    for (let j = 0; j < 6; j++) { const zz = zEG - 2 + j * 0.36; k += `<path d="M${pt(X0 + 1.4 - j * 0.22, d0 + 0.3, zz)} L${pt(X0 + 1.4 - j * 0.22, d0 + 2.6, zz)}" stroke="#efe9df" stroke-width="${r(Math.max(0.15, 7 / d0))}"/>`; }
    k += `<path d="M${pt(X0 + 0.05, d0 + 0.6, zEG)} L${pt(X0 + 0.05, d0 + 0.6, zEG + 2.6)} L${pt(X0 + 0.05, d0 + 2.2, zEG + 2.6)} L${pt(X0 + 0.05, d0 + 2.2, zEG)} Z" fill="${f.akz}"/>`;
    k += `<path d="M${pt(X0 + 0.06, d0 + 0.6, zEG + 2.7)} L${pt(X0 + 0.06, d0 + 0.6, zEG + 3.2)} L${pt(X0 + 0.06, d0 + 2.2, zEG + 3.2)} L${pt(X0 + 0.06, d0 + 2.2, zEG + 2.7)} Z" fill="#f5e6a8"/>`;
    /* Fenster neben der Tür (obere Geschosse) */
    for (const zf of [zEG + 3.6, zEG + 6.6]) k += `<path d="M${pt(X0 + 0.05, d0 + 0.7, zf)} L${pt(X0 + 0.05, d0 + 0.7, zf + 2)} L${pt(X0 + 0.05, d0 + 2.1, zf + 2)} L${pt(X0 + 0.05, d0 + 2.1, zf)} Z" fill="#3f4c5a" stroke="${f.trim}" stroke-width="${r(Math.max(0.12, 6 / d0))}"/>`;
    /* der schräge Erker (Bay Window) über zwei Geschosse: Vorderseite bei X = −15,9 */
    const e0 = d0 + 3.2, e1 = d0 + 6.6, ez0 = zEG + 2.9, ez1 = ze - 0.4, EX = X0 + 1.1;
    k += `<path d="M${pt(X0, e0, ez0)} L${pt(EX, e0 + 0.7, ez0)} L${pt(EX, e0 + 0.7, ez1)} L${pt(X0, e0, ez1)} Z" fill="${f.wand}"/>`;   /* zugewandte Schrägseite */
    k += `<path d="M${pt(EX, e0 + 0.7, ez0)} L${pt(EX, e1 - 0.7, ez0)} L${pt(EX, e1 - 0.7, ez1)} L${pt(EX, e0 + 0.7, ez1)} Z" fill="${f.wandS}"/>`;
    for (const zf of [ez0 + 0.7, ez0 + 3.7]) {
      k += `<path d="M${pt(X0 + 0.2, e0 + 0.15, zf)} L${pt(EX - 0.1, e0 + 0.6, zf)} L${pt(EX - 0.1, e0 + 0.6, zf + 2)} L${pt(X0 + 0.2, e0 + 0.15, zf + 2)} Z" fill="#5a6f82" stroke="${f.trim}" stroke-width="${r(Math.max(0.12, 6 / d0))}"/>`;
      k += `<path d="M${pt(EX, e0 + 1, zf)} L${pt(EX, e1 - 1, zf)} L${pt(EX, e1 - 1, zf + 2)} L${pt(EX, e0 + 1, zf + 2)} Z" fill="#3e4c5a" stroke="${f.trim}" stroke-width="${r(Math.max(0.12, 6 / d0))}"/>`;
    }
    k += `<path d="M${pt(EX + 0.1, e0 + 0.5, ez1 + 0.3)} L${pt(EX + 0.1, e1 - 0.5, ez1 + 0.3)} L${pt(EX + 0.1, e1 - 0.5, ez1 - 0.2)} L${pt(EX + 0.1, e0 + 0.5, ez1 - 0.2)} Z" fill="${f.trim}"/>`;
    k += `<path d="M${pt(EX + 0.1, e0 + 0.5, ez0 - 0.1)} L${pt(EX + 0.1, e1 - 0.5, ez0 - 0.1)} L${pt(EX + 0.1, e1 - 0.5, ez0 - 0.6)} L${pt(EX + 0.1, e0 + 0.5, ez0 - 0.6)} Z" fill="${f.akz}"/>`;
    /* Schatten: Fassaden liegen am Nachmittag im Schatten der Häuser gegenüber nicht — leicht dunkler unten */
    if (i === 0) HAUS_UNTER.push({ e0, e1, ez0, ez1, EX, d0, gm, ze, zg });
  }
  /* die Lupe: Erker und Giebel des nächsten Hauses */
  const h = HAUS_UNTER[0];
  const [ex, ey] = P(h.EX, (h.e0 + h.e1) / 2, h.ez0);
  const [ex2, ey2] = P(h.EX, (h.e0 + h.e1) / 2, h.ez1);
  const [gx, gy] = P(-17, h.gm, h.ze);
  const [gx2, gy2] = P(-17, h.gm, h.zg);
    S.teil({ id: "viktorianisches_haus", de: "das viktorianische Haus", syl: "vik-to-ri-A-ni-sche HAUS", it: "la casa vittoriana", itSyl: "CA-sa vit-to-RIA-na", en: "Victorian house", x: 0, y: 0, kunst: k,
    tipp: "Die bunten Holzhäuser aus der Zeit um 1890 nennt man in San Francisco „Painted Ladies“ — bemalte Damen.",
    zoom: { x: 0, y: r(gy2 - 6), w: 72, h: 48 },
    unter: [
      { id: "erker", de: "der Erker", syl: "ER-ker", it: "il bovindo", itSyl: "bo-VIN-do", en: "bay window", x: ex, y: ey, kunst: flaeche(-6, -(ey - ey2), 10, ey - ey2, 0.5),
        tipp: "Durch die schrägen Erker kommt mehr Licht ins Haus — typisch für San Francisco." },
      { id: "giebel", de: "der Giebel", syl: "GIE-bel", it: "il frontone", itSyl: "fron-TO-ne", en: "gable", x: gx, y: gy, kunst: flaeche(-9, -(gy - gy2), 18, gy - gy2 + 1, 0.5),
        tipp: "Im Giebel sind Holzschindeln wie Fischschuppen." },
    ] });
}

/* =====================================================================
   10 — DIE CABLE CAR (Powell-Hyde), kommt die Hyde Street herauf;
   von schräg vorn oben gesehen, Wagen um das Gefälle geneigt.
   ===================================================================== */
const CC = { X: -7.5, d: 21.6 };
{
  const ca = Math.cos(Math.atan(G)), sa = Math.sin(Math.atan(G));
  /* Wagenkoordinaten: u quer (+ = Osten), v längs (0 = vorn, bergauf), w hoch (senkrecht zum Boden) */
  const W3 = (u, v, w) => { const d = CC.d + v * ca - w * sa, Z = boden(CC.d) - v * sa + w * ca; return pt(CC.X + u, d, Z); };
  const Q = (a, b, c, e, fill, ex = "") => `<path d="M${W3(...a)} L${W3(...b)} L${W3(...c)} L${W3(...e)} Z" fill="${fill}"${ex}/>`;
  const L2 = (a, b, st, w) => `<path d="M${W3(...a)} L${W3(...b)}" stroke="${st}" stroke-width="${w}" fill="none"/>`;
  const HB = 1.22, LEN = 8.3, OFF = 2.9, RF = 3.05;
  let k = "";
  /* Schatten auf der Straße */
  k += `<path d="M${W3(-HB - 0.2, -0.3, 0)} L${W3(HB + 0.8, -0.2, 0)} L${W3(HB + 1.2, LEN + 0.4, 0)} L${W3(-HB, LEN + 0.4, 0)} Z" fill="#1d1a17" opacity=".3"/>`;
  /* Innenraum hinten (linke Innenwand, Bank) im offenen Teil */
  k += Q([-HB, 0.1, 0.95], [-HB, OFF, 0.95], [-HB, OFF, RF], [-HB, 0.1, RF], "#5a2a2a");
  k += Q([-HB + 0.1, 0.2, 0.95], [HB - 0.1, 0.2, 0.95], [HB - 0.1, OFF, 0.95], [-HB + 0.1, OFF, 0.95], "#8a6a48");
  k += Q([-0.9, OFF - 0.05, 0.95], [0.9, OFF - 0.05, 0.95], [0.9, OFF - 0.05, 2.6], [-0.9, OFF - 0.05, 2.6], "#7a3a34");
  k += Q([-0.75, OFF - 0.06, 1.5], [0.75, OFF - 0.06, 1.5], [0.75, OFF - 0.06, 2.4], [-0.75, OFF - 0.06, 2.4], "#3a4652");
  /* der Gripman (Wagenführer) am Greifhebel */
  {
    const [gx, gy] = P(CC.X - 0.1, CC.d + 1.2 * ca - 0.95 * sa, boden(CC.d) - 1.2 * sa + 0.95 * ca);
    const m = B.mensch({ id: "sfo_grip", geschlecht: "m", pose: "halten", blick: 12, frisur: "kurz", haarfarbe: "grau", haut: "hell",
      kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "weste", farbe: "#2b3a55" }, unterteil: { stueck: "anzughose", farbe: "#2b3a55" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, kopf: { stueck: "kappe", farbe: "#2b3a55" } } }, 1.76 * F / (CC.d + 1.2));
    k += `<g transform="translate(${r(gx)} ${r(gy)})">${m.svg}</g>`;
    k += L2([-0.15, 0.7, 0.95], [-0.25, 0.9, 1.9], "#2c2c2c", 0.5);
  }
  /* rechte Seite (Ostseite, uns zugewandt, im Schatten) */
  k += Q([HB, -0.05, 0.4], [HB, LEN, 0.4], [HB, LEN, 0.95], [HB, -0.05, 0.95], WEINROT);
  k += L2([HB, -0.05, 0.62], [HB, LEN, 0.62], GOLDS, 0.25);
  /* Trittbrett */
  k += Q([HB, 0.1, 0.42], [HB + 0.35, 0.1, 0.42], [HB + 0.35, OFF, 0.42], [HB, OFF, 0.42], "#4a3a2a");
  /* Bank nach außen im offenen Teil (Lehne) */
  k += Q([HB, 0.2, 0.95], [HB, OFF - 0.1, 0.95], [HB, OFF - 0.1, 1.35], [HB, 0.2, 1.35], "#7a5032");
  /* geschlossene Kabine: Wandfeld, Fenster, Schriftbrett */
  k += Q([HB, OFF, 0.95], [HB, LEN - 0.6, 0.95], [HB, LEN - 0.6, 1.6], [HB, OFF, 1.6], WEINROT);
  k += Q([HB, OFF, 1.6], [HB, LEN - 0.6, 1.6], [HB, LEN - 0.6, 2.55], [HB, OFF, 2.55], CREME);
  for (let i = 0; i < 5; i++) { const v0 = OFF + 0.15 + i * 0.97; k += Q([HB + 0.01, v0, 1.7], [HB + 0.01, v0 + 0.78, 1.7], [HB + 0.01, v0 + 0.78, 2.45], [HB + 0.01, v0, 2.45], "#3e4d5c"); k += Q([HB + 0.02, v0, 1.7], [HB + 0.02, v0 + 0.3, 1.7], [HB + 0.02, v0 + 0.3, 2.45], [HB + 0.02, v0, 2.45], "#fff", ` opacity=".14"`); }
  k += Q([HB, OFF - 0.2, 2.55], [HB, LEN, 2.55], [HB, LEN, RF], [HB, OFF - 0.2, RF], HBLAU);
  /* Pfosten im offenen Teil */
  for (const v of [0.05, 1, 1.95, OFF - 0.05]) k += L2([HB, v, 0.95], [HB, v, RF], CREME, 0.55);
  /* Front (uns zugewandt, im Licht): Stirnwand, Laterne, Nummer */
  k += Q([-HB, -0.05, 0.4], [HB, -0.05, 0.4], [HB, -0.05, 1.5], [-HB, -0.05, 1.5], S.lg("front", [[0, "#b23a46"], [1, "#7d1f2c"]]));
  k += L2([-HB, -0.06, 1.42], [HB, -0.06, 1.42], GOLDS, 0.3);
  k += L2([-HB, -0.06, 0.6], [HB, -0.06, 0.6], GOLDS, 0.22);
  {
    const [nx, ny] = P(CC.X + 0.55, CC.d - 0.06, boden(CC.d) + 1.0);
    k += `<text x="${r(nx)}" y="${r(ny)}" font-size="${r(5.2 * 0.62 * F / CC.d / 10)}" text-anchor="middle" fill="${GOLDS}" font-family="Georgia,serif" font-weight="bold">12</text>`;
    const [lx, ly] = P(CC.X - 0.45, CC.d - 0.08, boden(CC.d) + 1.05);
    k += `<circle cx="${r(lx)}" cy="${r(ly)}" r="${r(0.22 * F / CC.d)}" fill="${S.rg("lampe", [[0, "#fffbe6"], [0.6, "#ffe9a6"], [1, "#c99a3a"]])}" stroke="#2c2c2c" stroke-width=".3"/>`;
  }
  /* Eckpfosten vorn */
  for (const u of [-HB + 0.05, HB - 0.05]) k += L2([u, -0.05, 1.5], [u, -0.05, RF], CREME, 0.7);
  /* Dach: hell, mit Laternendach (Oberlicht) in der Mitte; vorn das Linienschild */
  k += Q([-HB - 0.12, -0.25, RF], [HB + 0.12, -0.25, RF], [HB + 0.12, LEN + 0.15, RF], [-HB - 0.12, LEN + 0.15, RF], S.lg("dach", [[0, "#efe9dc"], [1, "#cfc6b4"]], 0, 0, 1, 0));
  k += Q([-0.6, 0.6, RF + 0.25], [0.6, 0.6, RF + 0.25], [0.6, LEN - 0.4, RF + 0.25], [-0.6, LEN - 0.4, RF + 0.25], "#d9d1c0");
  k += L2([-HB - 0.12, -0.25, RF], [HB + 0.12, -0.25, RF], "#7d1f2c", 0.5);
  k += Q([-0.95, -0.15, RF + 0.1], [0.95, -0.15, RF + 0.1], [0.95, -0.15, RF + 0.62], [-0.95, -0.15, RF + 0.62], "#22344f");
  {
    const [sx, sy] = P(CC.X, CC.d - 0.15 * ca - (RF + 0.2) * sa, boden(CC.d) + 0.15 * sa + (RF + 0.2) * ca);
    const bw = 1.7 * F / CC.d;
    k += `<text x="${r(sx - bw / 2)}" y="${r(sy)}" font-size="${r(0.36 * F / CC.d)}" textLength="${r(bw)}" lengthAdjust="spacingAndGlyphs" fill="#f6efd8" font-family="Arial,sans-serif" font-weight="bold">POWELL &amp; HYDE</text>`;
  }
  /* die Glocke auf dem Dach vorn (Messing) */
  {
    const [bx, by] = P(CC.X + 0.3, CC.d + 0.9 * ca - (RF + 0.3) * sa, boden(CC.d) - 0.9 * sa + (RF + 0.3) * ca);
    const s = F / CC.d;
    k += `<path d="M${r(bx - 0.22 * s)} ${r(by)} Q${r(bx - 0.2 * s)} ${r(by - 0.32 * s)} ${r(bx)} ${r(by - 0.34 * s)} Q${r(bx + 0.2 * s)} ${r(by - 0.32 * s)} ${r(bx + 0.22 * s)} ${r(by)} Z" fill="${S.lg("glocke", [[0, "#fff1a6"], [0.5, "#d9a93a"], [1, "#8a6214"]], 0, 0, 1, 0)}"/>`;
  }
  /* Seitenschild an der Dachkante: POWELL & HYDE STS. */
  {
    const [a1, b1] = P(CC.X + HB + 0.02, CC.d + 3.6 * ca - 2.82 * sa, boden(CC.d) - 3.6 * sa + 2.82 * ca);
    const [a2, b2] = P(CC.X + HB + 0.02, CC.d + 7.4 * ca - 2.82 * sa, boden(CC.d) - 7.4 * sa + 2.82 * ca);
    const winkel = Math.atan2(b2 - b1, a2 - a1) * 180 / Math.PI, len = Math.hypot(a2 - a1, b2 - b1);
    k += `<text transform="translate(${r(a1)} ${r(b1 + 0.6)}) rotate(${r(winkel)})" font-size="1.5" textLength="${r(len)}" lengthAdjust="spacingAndGlyphs" fill="#7d1f2c" font-family="Georgia,serif" font-weight="bold">POWELL &amp; HYDE STS.</text>`;
  }
  /* Räder (klein, unter der Schürze) */
  for (const v of [1.2, 6.8]) { const [wx, wy] = P(CC.X + HB - 0.15, CC.d + v * ca, boden(CC.d) - v * sa + 0.32); k += `<ellipse cx="${r(wx)}" cy="${r(wy)}" rx="${r(0.1 * F / (CC.d + v))}" ry="${r(0.32 * F / (CC.d + v))}" fill="#222"/>`; }
  /* Glanzkante im Licht */
  k += L2([-HB, -0.07, 1.48], [-HB, -0.07, 0.42], "#fff", 0.35);
  const [cx0, cy0] = P(CC.X, CC.d, boden(CC.d));
  /* die Schienen und der Seilschlitz (Lupe) liegen vor dem Wagen in der Straße */
  const [rx0, ry0] = P(CC.X, CC.d - 1.6, boden(CC.d - 1.6));
  S.teil({ id: "cable_car", de: "die Cable Car", syl: "CA-ble CAR", it: "il cable car", itSyl: "CA-ble CAR", en: "cable car", x: 0, y: 0, kunst: k,
    tipp: "Die Cable Car fährt seit 1873. Ein Stahlseil unter der Straße zieht sie mit 15 km/h den Berg hinauf.",
    zoom: { x: r(cx0 - 37), y: r(cy0 - 52), w: 81, h: 54 },
    unter: [
      { id: "glocke", de: "die Glocke", syl: "GLO-cke", it: "la campana", itSyl: "cam-PA-na", en: "bell", x: P(CC.X + 0.3, CC.d + 0.9, 0)[0], y: P(0, CC.d + 0.9 * ca - (RF + 0.3) * sa, boden(CC.d) - 0.9 * sa + (RF + 0.3) * ca)[1], kunst: flaeche(-3.2, -4.6, 6.4, 5, 0.5),
        tipp: "Mit der Glocke warnt der Gripman. Jedes Jahr gibt es einen Wettbewerb im Glockenläuten." },
      { id: "schiene", de: "die Schiene", syl: "SCHIE-ne", it: "il binario", itSyl: "bi-NA-rio", en: "rail", x: rx0, y: ry0, kunst: flaeche(-8, -2, 16, 4, 0.5),
        tipp: "Zwischen den Schienen ist ein Schlitz. Darunter läuft das Seil, das die Cable Car zieht." },
    ] });
}
/* Schienen und Seilschlitz auf der Straße (vor dem Wagen, zur Kulisse gehörig) */
{
  let s = "";
  for (const u of [-0.53, 0.53, 0]) {
    let p = "";
    for (const d of [11.5, CC.d - 0.4]) p += (p ? " L" : "M") + pt(CC.X + u, d, boden(d));
    s += `<path d="${p}" stroke="${u === 0 ? "#2b2926" : "#b9b6b0"}" stroke-width="${u === 0 ? 0.9 : 0.7}" fill="none"/>`;
    let q = "";
    for (const d of [CC.d + 8.6, 900]) q += (q ? " L" : "M") + pt(CC.X + u, d, boden(d));
    s += `<path d="${q}" stroke="${u === 0 ? "#2b2926" : "#b9b6b0"}" stroke-width="${u === 0 ? 0.5 : 0.4}" fill="none"/>`;
  }
  S.hinten(s);
}

/* =====================================================================
   11 — DIE LOMBARD STREET: oben die ersten Haarnadelkurven aus roten
   Ziegeln, dazwischen terrassierte Beete mit Buchshecken und Hortensien;
   weiter unten fällt die Straße aus dem Blick (27 % Gefälle).
   ===================================================================== */
{
  let k = "";
  /* Grund: Beete (Erde, Rasen), leicht terrassiert */
  k += `<path d="M258 260 L213 198.6 L400 177.6 L400 260 Z" fill="${S.lg("beet", [[0, "#56763d"], [1, "#3d5a2a"]])}"/>`;
  const abschnitt = (x0, y0, x1, y1, b0, b1) => {
    const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l;
    return { d: `M${r(x0 + nx * b0 / 2)} ${r(y0 + ny * b0 / 2)} L${r(x1 + nx * b1 / 2)} ${r(y1 + ny * b1 / 2)} L${r(x1 - nx * b1 / 2)} ${r(y1 - ny * b1 / 2)} L${r(x0 - nx * b0 / 2)} ${r(y0 - ny * b0 / 2)} Z `,
      oben: [[r(x0 - nx * b0 / 2), r(y0 - ny * b0 / 2)], [r(x1 - nx * b1 / 2), r(y1 - ny * b1 / 2)]], unten: [[r(x0 + nx * b0 / 2), r(y0 + ny * b0 / 2)], [r(x1 + nx * b1 / 2), r(y1 + ny * b1 / 2)]] };
  };
  const kehre = (cx, cy, rx, ry, b, rechts) => {
    const s = rechts ? 1 : 0, rxi = Math.max(0.6, rx - b), ryi = Math.max(0.4, ry - b * ry / rx);
    return `M${r(cx)} ${r(cy - ry)} A${r(rx)} ${r(ry)} 0 0 ${s} ${r(cx)} ${r(cy + ry)} L${r(cx)} ${r(cy + ryi)} A${r(rxi)} ${r(ryi)} 0 0 ${1 - s} ${r(cx)} ${r(cy - ryi)} Z `;
  };
  const A1 = abschnitt(246, 251, 368, 236.2, 18, 15), K1 = kehre(368, 225.6, 15.5, 10.6, 14.6, true);
  const A2 = abschnitt(368, 215, 282, 205.6, 10.6, 9.4), K2 = kehre(282, 199.8, 9.6, 5.8, 9.2, false);
  const A3 = abschnitt(282, 194, 352, 187.4, 6.6, 5.8), K3 = kehre(352, 183.6, 6.2, 3.8, 5.8, true);
  const A4 = abschnitt(352, 179.8, 320, 177.8, 4.2, 3.6);
  const weg = A1.d + K1 + A2.d + K2 + A3.d + K3 + A4.d;
  /* Bordstein (hell), dann Ziegel, Licht, Spurrillen */
  k += `<path d="${weg}" fill="none" stroke="#e2dbcd" stroke-width="1.8" stroke-linejoin="round"/>`;
  k += `<path d="${weg}" fill="${S.lg("brick", [[0, "#c25c42"], [1, "#9a4331"]])}"/>`;
  k += `<path d="${weg}" fill="url(#${S.id("ziegel")})"/>`;
  k += `<path d="${weg}" fill="${S.lg("bricklicht", [[0, "#fff1d6", 0.16], [0.6, "#fff", 0], [1, "#000", 0.14]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M252 249.6 L366 235.4 M366 216 L284 206.4 M284 193.6 L350 187.6" stroke="#7d3326" stroke-width=".5" opacity=".35" fill="none"/>`;
  /* Buchshecken an beiden Rändern jedes Abschnitts (Schatten auf die Straße) */
  const hecke = (a, b, dick, dy) => {
    const [x0, y0] = a, [x1, y1] = b;
    return `<path d="M${x0} ${r(y0 + dy)} L${x1} ${r(y1 + dy)}" stroke="#1f2f1a" stroke-width="${r(dick * 0.8)}" opacity=".35" stroke-linecap="round"/>` +
      `<path d="M${x0} ${y0} L${x1} ${y1}" stroke="#2e4a26" stroke-width="${dick}" stroke-linecap="round"/>` +
      `<path d="M${x0} ${r(y0 - dick * 0.3)} L${x1} ${r(y1 - dick * 0.3)}" stroke="#5f8250" stroke-width="${r(dick * 0.35)}" stroke-linecap="round" opacity=".75"/>`;
  };
  const ab = (P2, dy) => [P2[0], [P2[1][0], P2[1][1]]];
  k += hecke([262, A1.oben[0][1] - 3.6], [354, A1.oben[1][1] - 2.4], 3.2, 2.2);
  k += hecke([300, A2.unten[1][1] + 2.6], [356, A2.unten[0][1] + 1.6], 2.6, 1.6);
  k += hecke([300, A2.oben[1][1] - 1.8], [350, A2.oben[0][1] - 1.4], 2, 1.3);
  k += hecke([300, A3.unten[0][1] + 1.6], [340, A3.unten[1][1] + 1.2], 1.6, 1);
  k += hecke([300, A3.oben[0][1] - 1.3], [338, A3.oben[1][1] - 1], 1.3, 0.8);
  k += hecke([386, 249], [400, 247.4], 3.2, 2);
  /* Hortensien: dichte Büschel in Rosa, Lila, Blau, Weiß */
  const farben = ["#ec8fb8", "#c28be0", "#8fb0ea", "#f4f0f6", "#e46f9d", "#b58be6"];
  const busch = (x, y, s) => {
    let g = `<ellipse cx="${r(x)}" cy="${r(y + s * 0.5)}" rx="${r(s * 2.1)}" ry="${r(s * 1.1)}" fill="#355626"/>`;
    for (let i = 0; i < 7; i++) { const f = farben[Math.floor(rnd() * farben.length)]; g += `<circle cx="${r(x - s * 1.6 + rnd() * s * 3.2)}" cy="${r(y - rnd() * s * 1.2)}" r="${r(s * (0.5 + rnd() * 0.32))}" fill="${f}"/>`; }
    return g + `<circle cx="${r(x - s * 0.4)}" cy="${r(y - s * 0.95)}" r="${r(s * 0.28)}" fill="#fff" opacity=".45"/>`;
  };
  const pflanzen = [];
  for (let x = 266; x < 356; x += 6.2) pflanzen.push([x, 236.6 - (x - 266) * 0.12 - 3.2, 2.3]);
  for (let x = 304; x < 354; x += 4.6) pflanzen.push([x, 206.6 - (x - 304) * 0.11 + 4, 1.6]);
  for (let x = 304; x < 340; x += 3.6) pflanzen.push([x, 192.2 - (x - 304) * 0.09 + 2.6, 1.05]);
  for (const [x, y, s2] of [[224, 210, 2.6], [236, 218, 2.8], [222, 225, 2.4], [248, 229, 2.6], [234, 232, 2.2], [254, 214, 2.2], [262, 204, 1.9], [270, 198.6, 1.6], [246, 203, 2], [386, 212, 2.3], [395, 221, 2.5], [390, 200.4, 1.8], [372, 196.6, 1.5], [360, 194, 1.2], [378, 254, 3], [394, 252.6, 2.8], [263, 222, 2.4]]) pflanzen.push([x, y, s2]);
  for (const [x, y, s2] of pflanzen) k += busch(x, y, s2);
  /* Treppe des Gehwegs rechts unten (Südseite) */
  for (let i = 0; i < 6; i++) k += `<rect x="${r(385 + i * 0.6)}" y="${r(234 + i * 4)}" width="${r(16 - i * 0.6)}" height="2.4" fill="${i % 2 ? "#cfc8bb" : "#ddd6ca"}"/><rect x="${r(385 + i * 0.6)}" y="${r(236.4 + i * 4)}" width="${r(16 - i * 0.6)}" height="1.6" fill="#a7a092"/>`;
  S.teil({ id: "lombard_street", de: "die Lombard Street", syl: "LOM-bard STREET", it: "Lombard Street", itSyl: "LOM-bard STREET", en: "Lombard Street", x: 0, y: 0, kunst: k,
    tipp: "Die Lombard Street hat hier acht enge Kurven. Man darf nur bergab fahren — ganz langsam.",
    zoom: { x: 300, y: 198, w: 96, h: 64 },
    unter: [
      { id: "kurve", de: "die Kurve", syl: "KUR-ve", it: "la curva", itSyl: "CUR-va", en: "bend", x: 377, y: 236, kunst: flaeche(-8, -21, 15.6, 21, 0.6),
        tipp: "Die Kurven wurden 1922 gebaut, weil die Straße für Autos zu steil war." },
      { id: "hortensie", de: "die Hortensie", syl: "hor-TEN-si-e", it: "l'ortensia", itSyl: "or-TEN-sia", en: "hydrangea", x: 315, y: 229.6, kunst: flaeche(-5.2, -4.8, 10.4, 6, 0.5),
        tipp: "In den Beeten blühen im Sommer Hortensien in Rosa, Lila und Blau." },
    ] });
}

/* =====================================================================
   12 — DAS STRASSENSCHILD und 13 — DIE HALTESTELLE (Cable-Car-Stop)
   an unserer Ecke (Südostecke Hyde / Lombard), d ≈ 14,5 m
   ===================================================================== */
const POL = (() => { const d = 14.5, X = 3.6; const [x, y] = P(X, d, boden(d)); return { x, y, s: F / d }; })();
{
  const { s } = POL, h = 3.3 * s;
  let k = schatten(1, 0.2, 3, 0.7, 0.3);
  k += `<rect x="-.55" y="${r(-h)}" width="1.1" height="${r(h)}" fill="${S.lg("mast", [[0, "#9aa1a5"], [0.5, "#d9dee0"], [1, "#7d858a"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-.8" y="${r(-h - 0.6)}" width="1.6" height=".8" rx=".3" fill="#7d858a"/>`;
  /* zwei Straßennamen, über Kreuz (weiß mit schwarzer Schrift) */
  const bl = 0.95 * s;
  k += `<rect x="${r(-bl * 0.9)}" y="${r(-h + 0.6)}" width="${r(bl * 0.9 * 2)}" height="${r(0.2 * s)}" rx=".4" fill="#f5f5f2" stroke="#2a2a2a" stroke-width=".25"/>`;
  k += `<text x="0" y="${r(-h + 0.6 + 0.15 * s)}" font-size="${r(0.13 * s)}" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-weight="bold">1000 LOMBARD ST</text>`;
  k += `<path d="M${r(-0.4 * s)} ${r(-h + 0.6 + 0.25 * s)} L${r(0.5 * s)} ${r(-h + 0.6 + 0.29 * s)} L${r(0.5 * s)} ${r(-h + 0.6 + 0.43 * s)} L${r(-0.4 * s)} ${r(-h + 0.6 + 0.39 * s)} Z" fill="#e8e8e4" stroke="#2a2a2a" stroke-width=".22"/>`;
  k += `<text transform="translate(${r(0.05 * s)} ${r(-h + 0.6 + 0.375 * s)}) rotate(2.5)" font-size="${r(0.1 * s)}" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-weight="bold">HYDE ST</text>`;
  S.teil({ id: "strassenschild", de: "das Straßenschild", syl: "STRA-ßen-schild", it: "il cartello stradale", itSyl: "car-TEL-lo stra-DA-le", en: "street sign", x: POL.x, y: POL.y, kunst: k });
}
{
  const { s } = POL, h = 3.3 * s;
  let k = "";
  const y0 = -h + 0.95 * s, w = 0.48 * s, hh = 0.62 * s;
  k += `<rect x="-.75" y="${r(y0 - 0.4)}" width="1.5" height=".8" fill="#5c6366"/><rect x="-.75" y="${r(y0 + hh - 0.4)}" width="1.5" height=".8" fill="#5c6366"/>`;
  k += `<rect x="${r(-w / 2)}" y="${r(y0)}" width="${r(w)}" height="${r(hh)}" rx=".5" fill="#fbfaf6" stroke="#6b2a22" stroke-width=".5"/>`;
  /* kleines Cable-Car-Bild und Schrift */
  const cx = 0, cy = y0 + hh * 0.36, u = w / 10;
  k += `<path d="M${r(cx - 3.4 * u)} ${r(cy + 1.4 * u)} L${r(cx + 3.4 * u)} ${r(cy + 1.4 * u)} L${r(cx + 3.4 * u)} ${r(cy - 1.2 * u)} L${r(cx - 3.4 * u)} ${r(cy - 1.2 * u)} Z" fill="#7d1f2c"/><path d="M${r(cx - 3.8 * u)} ${r(cy - 1.2 * u)} L${r(cx + 3.8 * u)} ${r(cy - 1.2 * u)} L${r(cx + 3.2 * u)} ${r(cy - 2 * u)} L${r(cx - 3.2 * u)} ${r(cy - 2 * u)} Z" fill="#6b2a22"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${r(cx - 2.8 * u + i * 1.5 * u)}" y="${r(cy - 0.8 * u)}" width="${r(u)}" height="${r(1.1 * u)}" fill="#f1e7d0"/>`;
  k += `<circle cx="${r(cx - 2 * u)}" cy="${r(cy + 1.7 * u)}" r="${r(0.5 * u)}" fill="#222"/><circle cx="${r(cx + 2 * u)}" cy="${r(cy + 1.7 * u)}" r="${r(0.5 * u)}" fill="#222"/>`;
  k += `<text x="${r(-w * 0.42)}" y="${r(y0 + hh * 0.72)}" font-size="${r(0.085 * s)}" textLength="${r(w * 0.84)}" lengthAdjust="spacingAndGlyphs" fill="#6b2a22" font-family="Arial,sans-serif" font-weight="bold">CABLE CAR</text>`;
  k += `<text x="0" y="${r(y0 + hh * 0.9)}" font-size="${r(0.09 * s)}" text-anchor="middle" fill="#6b2a22" font-family="Arial,sans-serif" font-weight="bold">STOP</text>`;
  S.teil({ oben: true, id: "haltestelle", de: "die Haltestelle", syl: "HAL-te-stel-le", it: "la fermata", itSyl: "fer-MA-ta", en: "stop", x: POL.x, y: POL.y, kunst: k,
    tipp: "An der Haltestelle winkt man, dann hält die Cable Car. Man darf sogar außen auf dem Trittbrett stehen." });
}

/* =====================================================================
   14 — DIE TOURISTIN fotografiert die Cable Car (auf der Kreuzung,
   am Zebrastreifen; d ≈ 13 m)
   ===================================================================== */
{
  const d = 13.2, X = -0.4;
  const [fx, fy] = P(X, d, boden(d));
  const foto = {
    lende: 1, brust: -3, nacken: 2, kopf: -2,
    schulterL: { vor: 62, seit: 18 }, ellbogenL: 112, unterarmL: 40, handL: 10, fingerL: 0.5,
    schulterR: { vor: 60, seit: 20 }, ellbogenR: 114, unterarmR: 40, handR: 10, fingerR: 0.5,
    huefteL: { vor: 4, seit: 3, dreh: -6 }, knieL: 4, fussL: 0,
    huefteR: { vor: -4, seit: 3, dreh: -6 }, knieR: 2, fussR: 0,
  };
  const m = B.mensch({ id: "sfo_tour", geschlecht: "w", pose: foto, blick: 215, frisur: "zopf", haarfarbe: "braun", haut: "mittel",
    kleidung: { oberteil: { stueck: "pullover", farbe: "creme" }, jacke: { stueck: "jacke", farbe: "#c0392b" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh", farbe: "weiss" }, zubehoer: { stueck: "rucksack", farbe: "#2f4f6f" } } }, 1.66 * F / d);
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x: fx, y: fy, kunst: schatten(4, 0.3, 9, 1.4, 0.3) + m.svg,
    tipp: "Die Touristin macht ein Foto. Eine Fahrt mit der Cable Car gehört zu jedem Besuch in San Francisco." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/san_francisco.js"));
console.log(aus);
