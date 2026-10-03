#!/usr/bin/env node
/* =====================================================================
   FRANKFURT AM MAIN (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (visitfrankfurt.travel, frankfurt.de „Römer“ und „Eiserner
   Steg“, Commerzbank „Hochhaus“, maintower.de, Kaiserdom-Führer,
   Wikipedia Römer/Eiserner Steg/Paulskirche, Structurae):
   - STANDORT: das Postkartenmotiv „Skyline über dem Main“ — man steht
     am Sachsenhäuser Ufer gleich westlich der Alten Brücke (dort beginnt
     Alt-Sachsenhausen, das Apfelweinviertel) auf der oberen Promenade
     (Auge ≈ 5 m über dem Wasser) und blickt flussabwärts nach Westen.
     Zylinder-Panorama: der Fluss läuft in der Mitte links in die Tiefe
     (Fluchtpunkt x 58), nach rechts dreht der Blick bis fast Norden.
     Echte Peilungen von hier (0° = Fluss nach Westen, + = nach Norden):
     Silberturm 3°, Tower 185 6°, Messeturm 14°, Westend Tower 15°,
     Trianon 16°, Commerzbank-Tower 22°, Eiserner Steg 6°–28° (quer über
     den Fluss, 450 m), Main Tower 29°, Opernturm 40°, Rententurm/Saalhof
     29°, Römer 42°, Paulskirche 45°, Dom 67° (460 m). 3,34 Bildeinheiten
     je Grad; Höhen 340 Einheiten je Bogenmaß (leichtes Tele). Die EZB
     steht im Osten hinter uns und ist von hier nicht zu sehen.
   - SKYLINE („Mainhattan“): COMMERZBANK-TOWER (Foster 1997) 259 m, mit
     Antenne 300 m — Grundriss gleichseitiges Dreieck mit gerundeten
     Ecken, neun viergeschossige Himmelsgärten spiralförmig an den drei
     Seiten, gestufte Krone und Mast. MAIN TOWER 200 m (Antenne 240 m):
     runder Glasturm vor einem eckigen dunklen Steinturm, oben die
     Aussichtsplattform (198 m). MESSETURM 257 m (Jahn 1991): roter
     Granit, Glasbänder, oben Zylinder und Pyramide — „Bleistift“.
     WESTEND TOWER 208 m mit der weißen Strahlen-„Krone“, TRIANON 186 m
     mit dreieckigem Kopf, DEUTSCHE BANK „Soll und Haben“ (zwei
     Spiegelglastürme), OMNITURM 190 m mit dem „Hüftschwung“ in der Mitte,
     Opernturm, Silberturm, Tower 185. Dahinter am Horizont der TAUNUS mit
     Großem Feldberg (881 m) und Altkönig.
   - EISERNER STEG (1869, heutiges Tragwerk 1911/12, wieder aufgebaut
     1946): genietete Stahlfachwerkträger, 170 m lang, zwei Pfeiler im
     Fluss, Felder 49,3 – 82,5 – 41,8 m; über den Pfeilern ist das
     Fachwerk am höchsten, dazwischen hängt der Obergurt durch;
     Fußgänger gehen zwischen den Trägern; Aufzüge an beiden Enden
     (1993); Liebesschlösser am Geländer.
   - RÖMER: Rathaus seit 1405, die Schauseite mit den drei TREPPENGIEBELN
     — links Alt-Limpurg, Mitte Haus zum Römer (oben die Uhr zwischen
     zwei Stadtwappen: weißer Adler auf Rot), rechts Löwenstein; daneben
     Frauenstein und Salzhaus. Er steht 250 m hinter dem Mainkai; seine
     Schauseite blickt nach Osten auf den Römerberg — hier ist sie, wie
     die Schauseiten in Berlin und Dresden, zum Betrachter gedreht und
     leicht vergrößert über die Dächer des Mainkais gehoben.
   - PAULSKIRCHE: ovaler Saalbau aus rotem Sandstein (1789–1833), Turm an
     der Südseite; 1848/49 Sitz der Nationalversammlung.
   - KAISERDOM ST. BARTHOLOMÄUS: roter Mainsandstein, Westturm 95 m (Madern
     Gerthener, vollendet 1867–77): quadratischer Unterbau, Oktogon mit
     Maßwerkfenstern und Wimpergen, steinerne Kuppel mit Krabben, Laterne.
     Daneben Querhaus mit großem Maßwerkfenster und Schieferdächern.
   - MAINKAI: Saalhof mit RENTENTURM (1456, Zeltdach, vier Ecktürmchen),
     Historisches Museum (Neubau 2017 mit zwei steilen Giebeln),
     Leonhardskirche, Platanen am Ufer, Kaimauer aus rotem Sandstein; die
     neue Altstadt (Dom-Römer-Quartier, 2018) zwischen Dom und Römer.
   - TYPISCH: Apfelwein („Äppler“) aus dem BEMBEL (graues Steinzeug,
     blau bemalt) im GERIPPTEN (Glas mit Rautenschliff), GRÜNE SOSSE aus
     sieben Kräutern mit Eiern und Kartoffeln, FRANKFURTER WÜRSTCHEN
     (reines Schweinefleisch, im heißen Wasser nur erhitzt) mit Senf und
     Brot. Ausflugsschiffe (Mainrundfahrt), Schwäne auf dem Main.
   Licht: Nachmittag, die Sonne steht links vorn im Südwesten.
   Maßstab vorne: Tisch 3–5 m vor dem Auge (Bembel 28 cm ≈ 23 Einheiten),
   Promenade: y = 110 + 544 / Abstand.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "frankfurt", titel: "Frankfurt am Main", emoji: "🏙️", thema: "Deutschland", kuerzel: "ffm", fassung: 854 });
const rnd = zufall(1405);
const r = B.r;
const HOR = 110, VPX = 58, KX = 3.34;
const X = (grad) => VPX + KX * grad;              /* Peilung → Bild-x */
const BODEN = (abst) => HOR + 544 / abst;          /* Promenade (Auge 1,6 m) */
const WASSER = (abst) => HOR + 1700 / abst;        /* Wasser (5 m unter dem Auge) */

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-20%" y="-10%" width="140%" height="120%"><feGaussianBlur stdDeviation=".7 2.2"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation=".5"/></filter>`);
/* Werkstoffe */
const SANDST = S.lg("sandst", [[0, "#c3796a"], [0.45, "#a95c4e"], [1, "#874538"]], 0, 0, 1, 0);
const SANDST_H = S.lg("sandsth", [[0, "#cf8a78"], [1, "#a65c4e"]]);
const SCHIEFER = S.lg("schiefer", [[0, "#5d6874"], [0.6, "#47515c"], [1, "#363e47"]], 0, 0, 1, 0);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const GLAS_L = S.lg("glasl", [[0, "#cfe0ea"], [0.5, "#9fbccf"], [1, "#7d9cb2"]]);          /* Glas, Sonnenseite */
const GLAS_R = S.lg("glasr", [[0, "#8fa9bd"], [0.5, "#6d8aa1"], [1, "#56718a"]]);          /* Glas, Schattenseite */
const LICHT = S.lg("licht", [[0, "#fff4dc", 0.28], [0.45, "#fff4dc", 0], [0.55, "#1d2a3a", 0], [1, "#1d2a3a", 0.22]], 0, 0, 1, 0);
const LAUB1 = S.rg("laub1", [[0, "#9dbb6a"], [0.55, "#6f9447"], [1, "#46682f"]], 0.35, 0.3, 0.75);
const LAUB2 = S.rg("laub2", [[0, "#8bac5d"], [0.6, "#5f8540"], [1, "#3c5b29"]], 0.35, 0.3, 0.75);
const LAUB_F = S.rg("laubf", [[0, "#8ea36c"], [1, "#5f7650"]], 0.4, 0.3, 0.8);

/* Hilfen: Fensterraster und Licht über einer Fläche */
const lichtUeber = (x, y, w, h) => `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${LICHT}"/>`;
const geschosse = (x, y0, y1, w, schritt, farbe, dicke = 0.14, op = 0.55) => {
  let g = "";
  for (let y = y0; y > y1; y -= schritt) g += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x + w)}" y2="${r(y)}" stroke="${farbe}" stroke-width="${dicke}" opacity="${op}"/>`;
  return g;
};

/* =====================================================================
   KULISSE — Himmel, Taunus am Horizont, ferne Stadt im Dunst
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 3}" fill="${S.lg("himmel", [[0, "#4d83bf"], [0.5, "#8fb6dc"], [0.85, "#cfe0ec"], [1, "#e9eef0"]])}"/>`);
S.hinten(`<circle cx="6" cy="18" r="95" fill="${S.rg("sonne", [[0, "#fff6d8", 0.75], [0.35, "#fff1cc", 0.3], [1, "#fff1cc", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[112, 20, 1], [208, 34, 1.15], [292, 16, 0.9], [168, 54, 0.55], [258, 60, 0.6]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".9">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 4.6], [-11, 1.4, 10, 3.6], [11, 1, 12, 4.2], [-3, -3.2, 9, 4.6], [6, -3.6, 7, 4]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `<ellipse cx="${x}" cy="${r(y + 3 * s)}" rx="${r(18 * s)}" ry="${r(2 * s)}" fill="#d8e3ee"/></g>`;
  }
  S.hinten(w);
}
/* Der Taunus: Altkönig (x 185) und Großer Feldberg (x 193, mit Fernmeldeturm) in blauem Dunst */
{
  let t = `<path d="M88 109 Q110 104.6 132 104 Q150 103 166 100.6 Q176 98.4 182 97.6 Q185 97 188 97.8 Q190 98.6 191.6 98 Q193 97.4 195 97.8 Q204 99 214 100.2 Q240 101.4 262 100.4 Q290 99.4 320 101.6 L320 110 L88 110 Z" fill="${S.lg("taunus", [[0, "#93a8bd"], [1, "#b9c8d4"]])}" opacity=".85"/>`;
  t += `<line x1="193.2" y1="97.6" x2="193.2" y2="95.6" stroke="#8597a9" stroke-width=".35"/><line x1="192.4" y1="97.8" x2="192.4" y2="96.6" stroke="#8597a9" stroke-width=".25"/>`;
  S.hinten(t);
}
/* ferne Stadt (Gallus, Westhafen) flach im Dunst, beiderseits des Flusses */
{
  let c = "";
  let x = 54;
  while (x < 230) {
    const w = 4 + rnd() * 7, h = 2 + rnd() * 6;
    c += `<rect x="${r(x)}" y="${r(HOR - h)}" width="${r(w + 0.3)}" height="${r(h + 0.5)}" fill="${rnd() < 0.5 ? "#a9b7c3" : "#b5c1cb"}"/>`;
    x += w;
  }
  c += `<rect x="54" y="${HOR - 8}" width="180" height="8.5" fill="#d6e0e6" opacity=".45"/>`;
  S.hinten(`<g filter="url(#${S.id("dunst")})">${c}</g>`);
}

/* Schaumainkai unter den Platanen (Straße, Hecken im Schatten) */
S.hinten(`<path d="M0 99 L${VPX} 108.6 L${VPX} 111 L0 126 Z" fill="${S.lg("hecke", [[0, "#55663f"], [0.6, "#6e7a5a"], [1, "#8d8c80"]])}"/>`);

/* =====================================================================
   1 — DER MAIN (das Wasser mit Spiegelungen)
   ===================================================================== */
const NORDKAI = (x) => {          /* Wasserlinie am Nordufer, 150 m seitlich */
  const th = Math.max(0.5, (x - VPX) / KX) * Math.PI / 180;
  return WASSER(150 / Math.sin(th));
};
const SUEDKAI = [];               /* Kante unserer Promenade (2 m rechts von uns) */
for (const d of [400, 200, 100, 60, 40, 28, 20, 14, 10, 8, 6.6, 5.8]) {
  const th = Math.atan2(2, d), rr = Math.hypot(d, 2);
  SUEDKAI.push([r(X(th * 180 / Math.PI)), r(BODEN(rr))]);
}
{
  let top = "";
  for (let x = VPX; x < 320; x += 8) top += `L${r(x)} ${r(NORDKAI(x))} `;
  const poly = `M${VPX} ${HOR} ${top}L320 ${r(NORDKAI(320))} L320 200 L${SUEDKAI[SUEDKAI.length - 1][0]} 200 ${SUEDKAI.slice().reverse().map(([x, y]) => `L${x} ${y}`).join(" ")} Z`;
  let k = `<path d="${poly}" fill="${S.lg("wasser", [[0, "#b9cbd3"], [0.12, "#93aeb8"], [0.45, "#62818a"], [1, "#3b5a60"]], 0, 0, 0, 1)}"/>`;
  /* Himmelsglanz in der Ferne, Sonnenglitzern links */
  k += `<path d="M${VPX} ${HOR} L160 113.4 L120 118 L66 121 Z" fill="#e9f1f3" opacity=".35"/>`;
  for (let i = 0; i < 55; i++) {
    const y = 111.5 + Math.pow(rnd(), 1.4) * 22, x = VPX + 6 + rnd() * (y - 108) * 3.2;
    k += `<path d="M${r(x)} ${r(y)} h${r(0.8 + rnd() * 2.2)}" stroke="#fffbe8" stroke-width="${r(0.2 + (y - HOR) * 0.012)}" opacity="${r(0.45 + rnd() * 0.45)}"/>`;
  }
  /* Spiegelbilder: Skyline, Eiserner Steg, Dom — weich und senkrecht verwischt */
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".42">`;
  k += `<rect x="123" y="114" width="17" height="44" fill="#8ea3b4"/><rect x="146" y="114" width="12" height="26" fill="#6f90ad"/><rect x="179" y="114" width="10" height="24" fill="#9db0bf"/>`;
  k += `<rect x="96" y="114" width="7" height="16" fill="#a8726a"/><rect x="164" y="114" width="12" height="14" fill="#7d9bb5"/>`;
  k += `<rect x="268" y="122" width="15" height="42" fill="#a5594b"/><rect x="282" y="122" width="34" height="14" fill="#8a5a4e"/><rect x="190" y="118" width="32" height="10" fill="#c98a7a"/>`;
  k += `<rect x="186" y="118" width="134" height="7" fill="#d7c9b4"/><rect x="152" y="115" width="34" height="9" fill="#c9b6a0"/>`;
  k += `</g>`;
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".35"><rect x="80" y="114.4" width="72" height="1.6" fill="#2b3a44"/><rect x="98" y="114" width="2" height="7" fill="#8d5a4e"/><rect x="133" y="114" width="2" height="7" fill="#8d5a4e"/></g>`;
  /* Wellen: kurze Lichtstriche, nach vorn größer */
  for (let i = 0; i < 170; i++) {
    const t = Math.pow(rnd(), 0.75), y = 114 + t * 86;
    const xmin = SUEDKAI.find(([, sy]) => sy >= y) ? SUEDKAI.find(([, sy]) => sy >= y)[0] : VPX;
    const w = 1 + t * 7 * (0.5 + rnd()), x = xmin + rnd() * Math.max(1, 320 - xmin - w);
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} ${r(-0.3 - t * 0.6)} ${r(w)} 0" stroke="${rnd() < 0.55 ? "#e4eef1" : "#2c4a52"}" stroke-width="${r(0.15 + t * 0.5)}" fill="none" opacity="${r(0.25 + rnd() * 0.35)}"/>`;
  }
  /* Schatten der Kaimauer gegenüber */
  k += `<path d="M150 ${r(NORDKAI(150))} L320 ${r(NORDKAI(320))} L320 ${r(NORDKAI(320) + 2.4)} L150 ${r(NORDKAI(150) + 1)} Z" fill="#1f343a" opacity=".3"/>`;
  S.teil({ id: "main", de: "der Main", syl: "MAIN", it: "il Meno", itSyl: "ME-no", en: "River Main", x: 0, y: 0, kunst: k,
    tipp: "Der Main fließt mitten durch Frankfurt und mündet bei Mainz in den Rhein." });
}

/* =====================================================================
   2 — DAS MAINUFER (unsere Promenade mit den Platanen am Sachsenhäuser Ufer)
   ===================================================================== */
const platane = (x, fuss, hoch, R, dunkel) => {
  let g = "";
  const stamm = Math.max(0.8, R * 0.09);
  /* Platanenrinde: hell gefleckt */
  g += `<path d="M${r(x - stamm)} ${r(fuss)} L${r(x - stamm * 0.7)} ${r(fuss - hoch * 0.55)} L${r(x + stamm * 0.7)} ${r(fuss - hoch * 0.55)} L${r(x + stamm)} ${r(fuss)} Z" fill="${S.lg("rinde", [[0, "#cfc6b0"], [0.5, "#a9a08a"], [1, "#7f7766"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 4; i++) g += `<ellipse cx="${r(x - stamm * 0.4 + rnd() * stamm * 0.8)}" cy="${r(fuss - rnd() * hoch * 0.5)}" rx="${r(stamm * 0.35)}" ry="${r(stamm * 0.6)}" fill="${rnd() < 0.5 ? "#e7e1cf" : "#8d8a6e"}" opacity=".7"/>`;
  const top = fuss - hoch;
  const blobs = [[0, 0.45, 1], [-0.55, 0.62, 0.62], [0.55, 0.6, 0.66], [-0.3, 0.2, 0.62], [0.32, 0.22, 0.6], [0, 0.05, 0.5], [-0.75, 0.82, 0.42], [0.75, 0.8, 0.44]];
  for (const [dx, dy, s] of blobs) g += `<circle cx="${r(x + dx * R)}" cy="${r(top + R * 0.15 + dy * R)}" r="${r(R * 0.5 * s)}" fill="${dunkel ? LAUB2 : (rnd() < 0.5 ? LAUB1 : LAUB2)}"/>`;
  /* Sonnenseite (links) heller */
  g += `<circle cx="${r(x - R * 0.35)}" cy="${r(top + R * 0.35)}" r="${r(R * 0.28)}" fill="#c7d98f" opacity=".35"/>`;
  return g;
};
{
  /* Boden der Promenade (Pflaster), bis zur Kante am Wasser */
  const fern = [[0, 123], [33, 115.4], [49.7, 111.8], [VPX, HOR]];
  const poly = `M0 200 L0 123 ${fern.slice(1).map(([x, y]) => `L${x} ${y}`).join(" ")} ${SUEDKAI.map(([x, y]) => `L${x} ${y}`).join(" ")} L${SUEDKAI[SUEDKAI.length - 1][0]} 200 Z`;
  let k = `<path d="${poly}" fill="${S.lg("pflaster", [[0, "#c9c0b0"], [0.4, "#b4aa98"], [1, "#9a8f7d"]], 0, 0, 0, 1)}"/>`;
  /* Fugen: Linien zum Fluchtpunkt und Querfugen */
  for (let i = -16; i <= 1; i++) {
    const lat = i * 1.2;
    const p = [];
    for (const d of [300, Math.max(6, Math.abs(lat) * 3.25)]) { const th = Math.atan2(lat, d); p.push([r(X(th * 180 / Math.PI)), r(BODEN(Math.hypot(d, lat)))]); }
    k += `<line x1="${p[0][0]}" y1="${p[0][1]}" x2="${p[1][0]}" y2="${p[1][1]}" stroke="#857a69" stroke-width=".25" opacity=".55"/>`;
  }
  for (const d of [8, 10, 12.5, 16, 21, 28, 40, 60, 100]) {
    const y = BODEN(d);
    k += `<line x1="0" y1="${r(y)}" x2="${r(X(Math.atan2(2, d) * 180 / Math.PI))}" y2="${r(y)}" stroke="#857a69" stroke-width=".25" opacity=".5"/>`;
  }
  /* Kante am Wasser: heller Sandsteinbord */
  k += `<path d="${SUEDKAI.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ")}" stroke="#d8c6b0" stroke-width="1.3" fill="none"/>`;
  /* Villen am Schaumainkai (Museumsufer) zwischen den Bäumen */
  for (const [x, y, w, h] of [[6, 121, 16, 15], [27, 115.5, 10, 9], [40, 113, 6, 5.6]]) {
    k += `<rect x="${x}" y="${r(y - h)}" width="${w}" height="${h}" fill="${S.lg("villa", [[0, "#f3efe6"], [1, "#d6cfc1"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${x - 0.6} ${r(y - h)} L${r(x + w / 2)} ${r(y - h - h * 0.3)} L${x + w + 0.6} ${r(y - h)} Z" fill="#7c6f68"/>`;
    for (let i = 0; i < Math.floor(w / 3); i++) k += `<rect x="${r(x + 1 + i * 3)}" y="${r(y - h * 0.8)}" width="${r(1.2 * w / 16 + 0.4)}" height="${r(h * 0.25)}" fill="#6d7b86"/><rect x="${r(x + 1 + i * 3)}" y="${r(y - h * 0.42)}" width="${r(1.2 * w / 16 + 0.4)}" height="${r(h * 0.25)}" fill="#6d7b86"/>`;
  }
  /* Platanenreihe, nach hinten kleiner */
  for (const [d, dunkel] of [[350, 1], [260, 1], [190, 0], [140, 1], [105, 0], [80, 1]]) {
    const th = -Math.atan2(10, d) * 180 / Math.PI, rr = Math.hypot(d, 10);
    k += platane(X(th), BODEN(rr), 4896 / rr - 544 / rr + 0.01, 340 * 6.5 / rr, dunkel);
  }
  /* Bank am Wasser */
  {
    const d = 22, th = Math.atan2(-1.5, d) * 180 / Math.PI, x = X(th), y = BODEN(d), s = 340 / d;
    k += `<ellipse cx="${r(x + 2)}" cy="${r(y + 0.3)}" rx="${r(1.1 * s)}" ry="1.2" fill="#3a3326" opacity=".28" filter="url(#bw_weich)"/>`;
    for (const sx of [-0.78, 0.78]) k += `<path d="M${r(x + sx * s - 0.4)} ${r(y)} L${r(x + sx * s - 0.2)} ${r(y - 0.45 * s)} L${r(x + sx * s + 0.2)} ${r(y - 0.85 * s)} L${r(x + sx * s + 0.7)} ${r(y - 0.85 * s)} L${r(x + sx * s + 0.5)} ${r(y - 0.45 * s)} L${r(x + sx * s + 0.6)} ${r(y)} Z" fill="#2f3532"/>`;
    for (let i = 0; i < 3; i++) k += `<rect x="${r(x - 0.95 * s)}" y="${r(y - 0.47 * s + i * 0.9)}" width="${r(1.9 * s)}" height=".7" rx=".2" fill="${i ? "#7a5532" : "#9a6d42"}"/>`;
    for (let i = 0; i < 2; i++) k += `<rect x="${r(x - 0.92 * s)}" y="${r(y - 0.86 * s + i * 1.6)}" width="${r(1.84 * s)}" height="1.1" rx=".3" fill="#8a6038"/>`;
  }
  S.teil({ id: "mainufer", de: "das Mainufer", syl: "MAIN-u-fer", it: "la riva del Meno", itSyl: "RI-va del ME-no", en: "Main riverbank", x: 0, y: 0, kunst: k,
    tipp: "Am Mainufer gehen die Frankfurter spazieren, joggen und fahren Rad." });
}

/* =====================================================================
   3 — DER MESSETURM („Bleistift“, ganz hinten)
   ===================================================================== */
{
  let k = "";
  const GRANIT = S.lg("granit", [[0, "#c98a7c"], [0.5, "#b06e62"], [1, "#8e5349"]], 0, 0, 1, 0);
  k += `<rect x="-4.6" y="-6" width="9.2" height="6" fill="${GRANIT}"/>`;
  k += `<rect x="-3.4" y="-31" width="6.8" height="25.2" fill="${GRANIT}"/>`;
  for (const x of [-2.2, -0.7, 0.8, 2.3]) k += `<rect x="${x - 0.35}" y="-30.4" width=".7" height="24.4" fill="#4b4a55" opacity=".8"/>`;
  k += geschosse(-3.4, -6.6, -30.6, 6.8, 1.1, "#7a4b44", 0.12, 0.5);
  /* Übergang in den Zylinder, darauf die Pyramide */
  k += `<path d="M-3.4 -31 L-2.9 -33 L2.9 -33 L3.4 -31 Z" fill="#a8665a"/>`;
  k += `<rect x="-2.9" y="-37.6" width="5.8" height="4.6" fill="${S.lg("zyl", [[0, "#d9998b"], [0.45, "#b6766a"], [1, "#7d4740"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-1.9, -0.6, 0.7, 2]) k += `<rect x="${x - 0.25}" y="-37.2" width=".5" height="4" fill="#3e3f49" opacity=".75"/>`;
  k += `<path d="M-3.1 -37.6 L0 -46 L3.1 -37.6 Z" fill="${S.lg("pyramide", [[0, "#e6e9ec"], [0.5, "#aeb6bd"], [1, "#7d868e"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-3.1 -37.6 L0 -46 L-.5 -37.6 Z" fill="#fff" opacity=".25"/><line x1="0" y1="-46" x2="0" y2="-47.2" stroke="#8d969d" stroke-width=".25"/>`;
  k += lichtUeber(-3.4, -31, 6.8, 25);
  S.teil({ id: "messeturm", de: "der Messeturm", syl: "MES-se-turm", it: "la Torre della Fiera", itSyl: "TOR-re del-la FIE-ra", en: "Trade Fair Tower",
    x: 92, y: HOR, kunst: k, tipp: "Wegen seiner spitzen Pyramide nennen ihn die Frankfurter „Bleistift“." });
}

/* =====================================================================
   4 — DIE SKYLINE (die übrigen Hochhäuser des Bankenviertels)
   ===================================================================== */
{
  let k = "";
  const turm = (x, w, h, l, rr, fenster, extra = "") => {
    let g = `<rect x="${r(x - w / 2)}" y="${r(HOR - h)}" width="${r(w)}" height="${r(h)}" rx="${rr}" fill="${l}"/>`;
    if (fenster) g += geschosse(x - w / 2, HOR - 1, HOR - h + 1, w, fenster, "#3d4b58", 0.12, 0.45);
    g += lichtUeber(x - w / 2, HOR - h, w, h);
    return g + extra;
  };
  /* Silberturm (Aluminiumbänder, abgeschrägte Ecken) */
  k += turm(67, 7.4, 36, S.lg("silber", [[0, "#e2e6ea"], [0.5, "#b6bec6"], [1, "#8d96a0"]], 0, 0, 1, 0), 0.9, 0.9);
  /* Tower 185: heller Stein, breiter Sockelbau */
  k += turm(77, 6.8, 37, S.lg("t185", [[0, "#e9e2d4"], [0.5, "#cfc6b4"], [1, "#a79f90"]], 0, 0, 1, 0), 0.3, 1.0);
  k += `<rect x="72" y="${HOR - 10}" width="13" height="10" fill="#c9c1b0"/>`;
  /* Westend Tower (DZ Bank) mit der weißen „Krone“ */
  {
    const x = 103, h = 41;
    k += turm(x, 8, h, S.lg("westend", [[0, "#ddd8cc"], [0.5, "#b9b7ae"], [1, "#8f8f8a"]], 0, 0, 1, 0), 1.2, 1.0);
    k += `<rect x="${x - 4.6}" y="${HOR - h - 0.6}" width="9.2" height="1.6" rx=".5" fill="#f6f6f2"/>`;
    for (let i = 0; i < 9; i++) { const t = -4.4 + i * 1.1; k += `<path d="M${r(x + t - 0.25)} ${HOR - h - 0.6} L${r(x + t * 1.25)} ${HOR - h - 4.6} L${r(x + t + 0.25)} ${HOR - h - 0.6} Z" fill="#fbfbf8"/>`; }
  }
  /* Trianon mit dreieckigem Kopf */
  {
    const x = 114, h = 40;
    k += turm(x, 7.4, h, S.lg("trianon", [[0, "#e7c9b8"], [0.5, "#c9a79a"], [1, "#9a7f78"]], 0, 0, 1, 0), 0.4, 1.0);
    k += `<path d="M${x - 5} ${HOR - h - 3.6} L${x + 5} ${HOR - h - 3.6} L${x + 3.7} ${HOR - h + 0.6} L${x - 3.7} ${HOR - h + 0.6} Z" fill="#5d6c79"/>`;
    k += `<rect x="${x - 5}" y="${HOR - h - 4.2}" width="10" height=".8" fill="#e8e3da"/>`;
  }
  /* Deutsche Bank „Soll und Haben“: zwei Spiegelglastürme, schräg gekappt */
  for (const [x, h] of [[165, 33], [172.5, 33]]) {
    k += `<path d="M${x - 3} ${HOR} L${x - 3} ${HOR - h + 1.6} L${x + 3} ${HOR - h - 1.4} L${x + 3} ${HOR} Z" fill="${S.lg("dbank", [[0, "#b9d0e2"], [0.4, "#7fa2c2"], [1, "#4f7397"]], 0, 0, 1, 0)}"/>`;
    k += geschosse(x - 3, HOR - 1, HOR - h + 2, 6, 0.9, "#2d4560", 0.1, 0.5);
    k += `<line x1="${x}" y1="${HOR}" x2="${x}" y2="${HOR - h + 0.2}" stroke="#d9e6f0" stroke-width=".25" opacity=".6"/>`;
  }
  /* niedrigere Bürotürme dazwischen (Japan Center mit Laternendach, Taunusturm, Marienturm …) */
  for (const [x, w, h, f] of [[84.5, 5, 22, "#c3c7c9"], [139.5, 4.8, 30, "#b8c4cc"], [158.5, 5, 26, "#d4cdbf"], [205, 7, 18, "#d1c8b8"], [214, 5, 14, "#bfc8cf"]]) {
    k += turm(x, w, h, f, 0.3, 1.0);
  }
  k += `<path d="M156 ${HOR - 26} L158.5 ${HOR - 28.4} L161 ${HOR - 26} Z" fill="#5f6a72"/>`;
  /* Opernturm: heller Naturstein, regelmäßige Fenster */
  k += turm(197, 8.6, 38, S.lg("oper", [[0, "#efe8d9"], [0.5, "#d8cfbd"], [1, "#a99f8d"]], 0, 0, 1, 0), 0.4, 1.0);
  for (let i = 0; i < 4; i++) k += `<line x1="${r(193.6 + i * 2.2)}" y1="${HOR - 37}" x2="${r(193.6 + i * 2.2)}" y2="${HOR - 1}" stroke="#9a907e" stroke-width=".18" opacity=".6"/>`;
  /* Omniturm mit dem „Hüftschwung“ */
  {
    const x = 185, h = 55;
    k += turm(x, 9.4, h, S.lg("omni", [[0, "#c6dbe8"], [0.5, "#8fb0c6"], [1, "#5f7f98"]], 0, 0, 1, 0), 0.4, 0);
    for (let y = HOR - 1.4; y > HOR - h; y -= 1.4) k += `<rect x="${x - 4.7}" y="${r(y)}" width="9.4" height=".35" fill="#f2f5f7" opacity=".85"/>`;
    k += `<rect x="${x - 3.6}" y="${HOR - 32}" width="10.4" height="9" fill="${S.lg("omnim", [[0, "#b7cfdf"], [1, "#6d8ca4"]], 0, 0, 1, 0)}"/>`;
    for (let y = HOR - 23.6; y > HOR - 32; y -= 1.4) k += `<rect x="${x - 3.6}" y="${r(y)}" width="10.4" height=".45" fill="#fafbfc"/>`;
    k += lichtUeber(x - 3.6, HOR - 32, 10.4, 9);
  }
  S.teil({ id: "skyline", de: "die Skyline", syl: "SKY-line", it: "lo skyline", itSyl: "SKY-line", en: "skyline", x: 0, y: 0, kunst: k,
    tipp: "Wegen der vielen Hochhäuser am Main nennt man Frankfurt auch „Mainhattan“." });
}

/* =====================================================================
   5 — DER MAIN TOWER (runder Glasturm, eckiger Steinturm, Plattform)
   ===================================================================== */
const MT = { x: 151, y: HOR };
{
  let k = "";
  /* eckiger Steinturm hinten rechts */
  k += `<rect x="0" y="-45.6" width="7.4" height="45.6" fill="${S.lg("mtstein", [[0, "#6b6f74"], [0.5, "#4f5459"], [1, "#3a3e43"]], 0, 0, 1, 0)}"/>`;
  for (let y = -2; y > -45; y -= 1.5) for (let x = 0.8; x < 7; x += 1.6) k += `<rect x="${r(x)}" y="${r(y - 0.8)}" width=".8" height=".7" fill="#9fb3c2" opacity=".55"/>`;
  k += `<rect x="-.4" y="-47" width="8.2" height="1.4" fill="#5d6267"/><rect x="1.4" y="-49" width="5" height="2" fill="#4b5055"/>`;
  /* runder Glasturm vorne links: Zylinder mit Glanz */
  k += `<rect x="-6.6" y="-52" width="9.6" height="52" fill="${S.lg("mtglas", [[0, "#d7e7f1"], [0.3, "#9fc0d8"], [0.65, "#5f86a8"], [1, "#3f5f7f"]], 0, 0, 1, 0)}"/>`;
  for (let y = -1.6; y > -51; y -= 1.55) k += `<path d="M-6.6 ${r(y)} Q-1.8 ${r(y + 0.5)} 3 ${r(y)}" stroke="#2f4a63" stroke-width=".13" fill="none" opacity=".55"/>`;
  k += `<rect x="-5" y="-51.6" width="1.3" height="51.6" fill="#fff" opacity=".35"/>`;
  /* Plattform mit Brüstung, Technikaufbau, Antenne (rot-weiß) */
  k += `<rect x="-7.2" y="-53.4" width="10.8" height="1.4" rx=".4" fill="#dfe4e8"/>`;
  k += `<path d="M-7 -53.4 L-7 -54.6 M-4.6 -53.4 L-4.6 -54.6 M-2.2 -53.4 L-2.2 -54.6 M.2 -53.4 L.2 -54.6 M2.6 -53.4 L2.6 -54.6 M-7 -54.6 L3.4 -54.6" stroke="#9aa3aa" stroke-width=".2"/>`;
  k += `<rect x="-3.8" y="-56.6" width="4.4" height="2" fill="#c4cbd1"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="-2.1" y="${r(-58.4 - i * 1.6)}" width=".9" height="1.6" fill="${i % 2 ? "#f2f2f0" : "#c9302c"}"/>`;
  k += `<line x1="-1.65" y1="-66" x2="-1.65" y2="-67.4" stroke="#c9302c" stroke-width=".3"/>`;
  k += `<rect x="4.4" y="-44.2" width="2.2" height="1.2" fill="#c9302c" opacity=".9"/>`;
  S.teil({ id: "maintower", de: "der Main Tower", syl: "MAIN TOW-er", it: "il Main Tower", itSyl: "MAIN TOW-er", en: "Main Tower",
    x: MT.x, y: MT.y, kunst: k, tipp: "Auf den Main Tower kann man mit dem Aufzug hinauffahren.",
    zoom: { x: MT.x - 17, y: MT.y - 70, w: 30, h: 20 },
    unter: [
      { id: "aussichtsplattform", de: "die Aussichtsplattform", syl: "AUS-sichts-platt-form", it: "la piattaforma panoramica", itSyl: "piat-ta-FOR-ma pa-no-RA-mi-ca", en: "observation deck",
        x: MT.x - 1.8, y: MT.y - 52, kunst: flaeche(-5.8, -3.4, 11.6, 4.2, 0.4), tipp: "Die Aussichtsplattform liegt fast 200 Meter hoch." },
    ] });
}

/* =====================================================================
   6 — DAS HOCHHAUS (Commerzbank-Tower: dreieckig, Himmelsgärten, Mast)
   ===================================================================== */
const CB = { x: 131.5, y: HOR };
{
  let k = "";
  const H = 85, L = -9, M = -2.2, R = 9.2;    /* linke Seite (Sonne) | Ecke | rechte Seite */
  k += `<path d="M${L} 0 L${L} ${-H} L${M} ${-H} L${M} 0 Z" fill="${S.lg("cbl", [[0, "#dfe9ef"], [0.6, "#b9cdd9"], [1, "#9cb3c3"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${M} 0 L${M} ${-H} L${R} ${-H} L${R} 0 Z" fill="${S.lg("cbr", [[0, "#9fb4c3"], [0.5, "#8299ab"], [1, "#6c8396"]], 0, 0, 1, 0)}"/>`;
  /* gerundete Ecke: Lichtkante */
  k += `<rect x="${M - 0.7}" y="${-H}" width="1.4" height="${H}" fill="${S.lg("cbecke", [[0, "#c9d8e2"], [0.5, "#f4f8fa"], [1, "#a3b8c7"]], 0, 0, 1, 0)}"/>`;
  /* Geschosse */
  for (let y = -1.5; y > -H; y -= 1.52) k += `<line x1="${L}" y1="${r(y)}" x2="${R}" y2="${r(y)}" stroke="#4a5e70" stroke-width=".11" opacity=".55"/>`;
  /* senkrechte Stützen der Doppelfassade */
  for (const x of [-7, -4.6, 0.4, 3.2, 6]) k += `<line x1="${x}" y1="0" x2="${x}" y2="${-H}" stroke="#5c7184" stroke-width=".14" opacity=".45"/>`;
  /* die Himmelsgärten: je vier Geschosse, an den Seiten versetzt */
  const garten = (x0, x1, f0) => {
    const y0 = -f0 * 1.52, y1 = -(f0 + 4) * 1.52;
    let g = `<rect x="${x0}" y="${r(y1)}" width="${r(x1 - x0)}" height="${r(y0 - y1)}" fill="${S.lg("gartenglas", [[0, "#5d7a6a"], [1, "#3f5a4c"]])}"/>`;
    for (let i = 0; i < Math.floor((x1 - x0) / 1.6); i++) g += `<circle cx="${r(x0 + 0.9 + i * 1.6)}" cy="${r(y0 - 1.6 - rnd() * 1.5)}" r="${r(0.7 + rnd() * 0.4)}" fill="${rnd() < 0.5 ? "#7fa060" : "#5f8a48"}"/>`;
    g += `<rect x="${x0}" y="${r(y1)}" width="${r(x1 - x0)}" height=".5" fill="#e6eef2" opacity=".6"/>`;
    return g;
  };
  for (const f of [7, 19, 31]) k += garten(L, M - 0.7, f);
  for (const f of [11, 23, 35]) k += garten(M + 0.7, R, f);
  /* gestufte Krone und Mast */
  k += `<path d="M${L} ${-H} L${L + 1.4} ${-H - 3.2} L${R - 1.2} ${-H - 3.2} L${R} ${-H} Z" fill="#c9d6df"/>`;
  k += `<path d="M${L + 2.6} ${-H - 3.2} L${L + 3.6} ${-H - 6} L${R - 3} ${-H - 6} L${R - 2.2} ${-H - 3.2} Z" fill="#aebfcc"/>`;
  k += `<rect x="-1.6" y="${-H - 8}" width="3.2" height="2" fill="#9eb0be"/>`;
  k += `<path d="M-.5 ${-H - 8} L-.25 ${-H - 18} L.25 ${-H - 18} L.5 ${-H - 8} Z" fill="#e9eef1"/>`;
  k += `<circle cx="0" cy="${-H - 18.2}" r=".4" fill="#e0312c"/>`;
  /* gelbes Firmenband oben an der Sonnenseite */
  k += `<path d="M${L + 1} ${-H + 4.6} q2.6 -1.6 5 0 l-.6 1.4 q-2 -1.2 -3.8 0 Z" fill="#f2c200"/>`;
  S.teil({ id: "hochhaus", de: "das Hochhaus", syl: "HOCH-haus", it: "il grattacielo", itSyl: "grat-ta-CIE-lo", en: "high-rise",
    x: CB.x, y: CB.y, kunst: k, tipp: "Der Commerzbank-Tower ist 259 Meter hoch, mit Antenne 300 Meter – das höchste Hochhaus Deutschlands.",
    zoom: { x: CB.x - 18, y: CB.y - 66, w: 36, h: 24 },
    unter: [
      { id: "garten", de: "der Garten", syl: "GAR-ten", it: "il giardino", itSyl: "giar-DI-no", en: "garden",
        x: CB.x + 4, y: CB.y - 23 * 1.52, kunst: flaeche(-5.6, -6.6, 11.2, 6.8, 0.4), tipp: "Im Hochhaus gibt es neun Gärten, hoch über der Stadt." },
    ] });
}

/* =====================================================================
   7 — DIE PAULSKIRCHE (ovaler Saalbau, Turm an der Südseite)
   ===================================================================== */
{
  let k = "";
  /* ovaler Bau: Wand mit Rundbogenfenstern, flache Kuppel */
  k += `<path d="M-15 0 L-15 -15 Q0 -17.4 15 -15 L15 0 Z" fill="${SANDST}"/>`;
  for (const x of [-12.4, -8.6, 8.6, 12.4]) k += `<path d="M${x - 1} -3 L${x - 1} -11 Q${x} -12.6 ${x + 1} -11 L${x + 1} -3 Z" fill="#3f2e2a"/><rect x="${x - 1.5}" y="-14" width="3" height=".5" fill="#d49a88"/>`;
  for (const x of [-14.6, -10.6, -6.6, 6.6, 10.6, 14.6]) k += `<rect x="${x - 0.4}" y="-14.6" width=".8" height="14.6" fill="#b86c5d" opacity=".7"/>`;
  k += `<path d="M-15.6 -15 Q0 -17.6 15.6 -15 L15.6 -16.4 Q0 -19 -15.6 -16.4 Z" fill="#d49a88"/>`;
  k += `<path d="M-15 -16.4 Q-14 -23 0 -24 Q14 -23 15 -16.4 Q0 -18.8 -15 -16.4 Z" fill="${S.lg("pkdach", [[0, "#7a888c"], [0.5, "#5b6970"], [1, "#424d53"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-1.4" y="-26" width="2.8" height="2.2" fill="#c9cfd0"/><path d="M-1.6 -26 Q0 -27.6 1.6 -26 Z" fill="#55636a"/>`;
  /* Turm vor dem Oval: Unterbau, Uhrgeschoss, offene Glockenstube, Haube */
  const T = SANDST_H;
  k += `<rect x="-3.4" y="-27" width="6.8" height="27" fill="${SANDST}"/>`;
  k += `<path d="M-1.1 -4 L-1.1 -10 Q0 -11.6 1.1 -10 L1.1 -4 Z" fill="#3f2e2a"/>`;
  k += `<rect x="-3.8" y="-27.6" width="7.6" height="1" fill="#e2b4a2"/>`;
  k += `<circle cx="0" cy="-22.8" r="1.9" fill="#f4efe6" stroke="#5a3a2c" stroke-width=".3"/><line x1="0" y1="-22.8" x2="0" y2="-24.2" stroke="#2a2a2a" stroke-width=".25"/><line x1="0" y1="-22.8" x2="1" y2="-22.4" stroke="#2a2a2a" stroke-width=".25"/>`;
  k += `<rect x="-2.8" y="-33" width="5.6" height="5.4" fill="${T}"/>`;
  for (const x of [-2.2, 0, 2.2]) k += `<rect x="${x - 0.35}" y="-32.6" width=".7" height="4.8" fill="#efd8cc"/>`;
  k += `<path d="M-1.6 -28 L-1.6 -31.4 Q-1.1 -32.2 -.6 -31.4 L-.6 -28 Z M.6 -28 L.6 -31.4 Q1.1 -32.2 1.6 -31.4 L1.6 -28 Z" fill="#3f2e2a"/>`;
  k += `<rect x="-3.2" y="-33.8" width="6.4" height=".9" fill="#e2b4a2"/>`;
  k += `<path d="M-2.6 -33.8 Q-2.4 -37 0 -37.6 Q2.4 -37 2.6 -33.8 Z" fill="#55636a"/>`;
  k += `<rect x="-.4" y="-39.2" width=".8" height="1.7" fill="#55636a"/><circle cx="0" cy="-39.6" r=".5" fill="#c7a640"/>`;
  k += lichtUeber(-3.4, -27, 6.8, 27);
  S.teil({ id: "paulskirche", de: "die Paulskirche", syl: "PAULS-kir-che", it: "la chiesa di San Paolo", itSyl: "CHIE-sa di san PA-o-lo", en: "St Paul's Church",
    x: 236, y: HOR, kunst: k, tipp: "1848 tagte in der Paulskirche das erste frei gewählte Parlament für ganz Deutschland." });
}

/* =====================================================================
   8 — DER RÖMER (Rathaus mit den drei Treppengiebeln)
   ===================================================================== */
const RO = { x: 205.5, y: HOR };
{
  let k = "";
  const giebel = (x0, w, traufe, spitze, wand, stufen) => {
    /* Treppengiebel: links und rechts Stufen, oben eine Spitze */
    let p = `M${x0} 0 L${x0} ${traufe}`;
    const sw = w / 2 / (stufen + 0.5), sh = (spitze - traufe) / (stufen + 1);
    for (let i = 0; i < stufen; i++) p += ` L${r(x0 + i * sw)} ${r(traufe + (i + 1) * sh)} L${r(x0 + (i + 1) * sw)} ${r(traufe + (i + 1) * sh)}`;
    p += ` L${r(x0 + w / 2 - sw * 0.5)} ${r(spitze)} L${r(x0 + w / 2 + sw * 0.5)} ${r(spitze)}`;
    for (let i = stufen - 1; i >= 0; i--) p += ` L${r(x0 + w - (i + 1) * sw)} ${r(traufe + (i + 1) * sh)} L${r(x0 + w - i * sw)} ${r(traufe + (i + 1) * sh)}`;
    p += ` L${x0 + w} ${traufe} L${x0 + w} 0 Z`;
    let g = `<path d="${p}" fill="${wand}"/>`;
    /* Steinkante und kleine Fialen auf den Stufen */
    g += `<path d="${p}" fill="none" stroke="#9a5446" stroke-width=".35"/>`;
    for (let i = 0; i < stufen; i++) {
      for (const xs of [x0 + (i + 1) * sw - 0.2, x0 + w - (i + 1) * sw + 0.2]) g += `<path d="M${r(xs - 0.3)} ${r(traufe + (i + 1) * sh)} L${r(xs)} ${r(traufe + (i + 1) * sh - 1.3)} L${r(xs + 0.3)} ${r(traufe + (i + 1) * sh)} Z" fill="#8f4c40"/>`;
    }
    g += `<path d="M${r(x0 + w / 2 - 0.35)} ${r(spitze)} L${r(x0 + w / 2)} ${r(spitze - 1.8)} L${r(x0 + w / 2 + 0.35)} ${r(spitze)} Z" fill="#8f4c40"/>`;
    return g;
  };
  const fenster = (x, y, w, h, spitz) => `<path d="M${r(x)} ${r(y)} L${r(x)} ${r(y - h + (spitz ? w * 0.6 : 0))} ${spitz ? `L${r(x + w / 2)} ${r(y - h)} L${r(x + w)} ${r(y - h + w * 0.6)}` : `L${r(x + w)} ${r(y - h)}`} L${r(x + w)} ${r(y)} Z" fill="${S.lg("rofen", [[0, "#53606b"], [1, "#2c343c"]])}"/><line x1="${r(x)}" y1="${r(y - h * 0.45)}" x2="${r(x + w)}" y2="${r(y - h * 0.45)}" stroke="#d9c5b8" stroke-width=".15"/>`;
  const WAND_L = S.lg("rowandl", [[0, "#e7b2a1"], [1, "#d19584"]]);
  const WAND_M = S.lg("rowandm", [[0, "#dc9c89"], [1, "#c27e6b"]]);
  const WAND_R = S.lg("rowandr", [[0, "#e2aa98"], [1, "#c98d7c"]]);
  /* Dächer dahinter (Schiefer), dann die drei Häuser */
  k += `<path d="M-16.5 -18 L-14.6 -26.4 L25.2 -26.4 L27 -18 Z" fill="${S.lg("rodach", [[0, "#5a6470"], [1, "#6f7a85"]])}"/><path d="M-14.6 -26.4 L25.2 -26.4" stroke="#8a949d" stroke-width=".4"/>`;
  /* Frauenstein und Salzhaus rechts daneben (ohne Giebelschmuck) */
  k += `<rect x="16.5" y="-19" width="10.5" height="19" fill="${S.lg("salz", [[0, "#efe3cf"], [1, "#d6c6ad"]])}"/>`;
  k += `<path d="M16 -19 L21.8 -25.4 L27.4 -19 Z" fill="${SCHIEFER}"/>`;
  for (const x of [18, 21, 24]) { k += fenster(x, -12.4, 1.6, 3, false) + fenster(x, -6.4, 1.6, 3, false); }
  k += giebel(-16.5, 11, -18, -30.4, WAND_L, 4);
  k += giebel(-5.5, 11, -18.6, -32.2, WAND_M, 4);
  k += giebel(5.5, 11, -18, -30.4, WAND_R, 4);
  /* Geschosse: Fenster (oben spitzbogig wie am Römer), Gesimse */
  for (const [x0, wand] of [[-16.5, 0], [-5.5, 1], [5.5, 0]]) {
    for (let i = 0; i < 3; i++) {
      k += fenster(x0 + 1.4 + i * 3.1, -13, 1.9, 3.8, wand === 1);
      k += fenster(x0 + 1.4 + i * 3.1, -6.2, 1.9, 3.4, false);
    }
    k += `<rect x="${x0}" y="-16.4" width="11" height=".6" fill="#b46a5a"/><rect x="${x0}" y="-9.4" width="11" height=".5" fill="#b46a5a"/>`;
    /* Giebelfenster */
    k += fenster(x0 + 3.6, -21.6, 1.5, 2.6, true) + fenster(x0 + 6, -21.6, 1.5, 2.6, true);
  }
  /* Haus zum Römer: Uhr zwischen zwei Stadtwappen, darüber ein Fensterchen */
  k += `<circle cx="0" cy="-24.6" r="1.9" fill="#f6f1e4" stroke="#6b3b2c" stroke-width=".3"/>`;
  k += `<line x1="0" y1="-24.6" x2="0" y2="-25.9" stroke="#222" stroke-width=".25"/><line x1="0" y1="-24.6" x2=".9" y2="-24.1" stroke="#222" stroke-width=".25"/>`;
  for (const sx of [-3.4, 3.4]) {
    k += `<path d="M${sx - 1} -25.9 L${sx + 1} -25.9 L${sx + 1} -24.4 Q${sx + 1} -23 ${sx} -22.6 Q${sx - 1} -23 ${sx - 1} -24.4 Z" fill="#c62d2a" stroke="#e6c25a" stroke-width=".18"/>`;
    k += `<path d="M${sx} -25.4 L${sx - 0.6} -24.6 L${sx - 0.2} -24.7 L${sx - 0.4} -23.6 L${sx} -24 L${sx + 0.4} -23.6 L${sx + 0.2} -24.7 L${sx + 0.6} -24.6 Z" fill="#fff"/>`;
  }
  k += fenster(-0.6, -28.2, 1.2, 1.8, true);
  S.teil({ id: "roemer", de: "der Römer", syl: "RÖ-mer", it: "il Römer (il municipio)", itSyl: "RÖ-mer", en: "Römer (city hall)",
    x: RO.x, y: RO.y, kunst: k, tipp: "Der Römer ist seit über 600 Jahren das Rathaus von Frankfurt.",
    zoom: { x: RO.x - 19, y: RO.y - 35, w: 39, h: 26 },
    unter: [
      { id: "treppengiebel", de: "der Treppengiebel", syl: "TREP-pen-gie-bel", it: "il frontone a gradoni", itSyl: "fron-TO-ne a gra-DO-ni", en: "stepped gable",
        x: RO.x - 11, y: RO.y - 18, kunst: flaeche(-5.2, -12.6, 10.4, 12.4, 0.4), tipp: "Die Giebel haben Stufen wie eine Treppe: Treppengiebel." },
      { id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock",
        x: RO.x, y: RO.y - 24.6, kunst: flaecheEllipse(0, 0, 2.2, 2.2) },
      { id: "wappen", de: "das Wappen", syl: "WAP-pen", it: "lo stemma", itSyl: "STEM-ma", en: "coat of arms",
        x: RO.x + 3.4, y: RO.y - 22.6, kunst: flaeche(-1.3, -3.6, 2.6, 3.8, 0.4), tipp: "Das Wappen von Frankfurt: ein weißer Adler auf Rot." },
    ] });
}

/* =====================================================================
   9 — DER KAISERDOM (Westturm aus rotem Sandstein, Querhaus)
   ===================================================================== */
const DOM = { x: 274, y: 108 };
{
  let k = "";
  const K = 1.06;   /* Einheiten je Meter (leicht hervorgehoben) */
  /* Querhaus und Chor rechts (näher bei uns), Schieferdächer */
  k += `<path d="M6 0 L6 -27 L44 -27 L44 0 Z" fill="${SANDST}"/>`;
  k += `<path d="M5 -27 L25 -42 L45 -27 Z" fill="${SCHIEFER}"/>`;
  k += `<path d="M5 -27 L25 -42 L13 -27 Z" fill="#6c7782" opacity=".55"/>`;
  /* Südgiebel des Querhauses mit großem Maßwerkfenster */
  k += `<path d="M14 0 L14 -28 L22 -38 L30 -28 L30 0 Z" fill="${SANDST_H}"/>`;
  k += `<path d="M17.2 -6 L17.2 -24 Q22 -31 26.8 -24 L26.8 -6 Z" fill="#34404a"/>`;
  for (const x of [19.6, 22, 24.4]) k += `<line x1="${x}" y1="-6" x2="${x}" y2="-25.4" stroke="#c99a88" stroke-width=".35"/>`;
  k += `<circle cx="22" cy="-26.4" r="1.6" fill="none" stroke="#c99a88" stroke-width=".35"/>`;
  k += `<path d="M22 -38 L22 -40.6" stroke="#8f4c40" stroke-width=".6"/>`;
  for (const x of [14, 30]) k += `<path d="M${x - 0.8} -28 L${x} -32.6 L${x + 0.8} -28 Z" fill="#8f4c40"/>`;
  /* Strebepfeiler */
  for (const x of [8, 36, 42]) k += `<path d="M${x - 0.9} 0 L${x - 0.9} -20 L${x} -23 L${x + 0.9} -20 L${x + 0.9} 0 Z" fill="#8a4538"/>`;
  for (const x of [33, 39]) k += `<path d="M${x - 1} -6 L${x - 1} -19 Q${x} -21.6 ${x + 1} -19 L${x + 1} -6 Z" fill="#34404a"/>`;
  /* Westturm: quadratischer Unterbau mit Strebepfeilern und Fenstern */
  const w0 = 7.4;
  k += `<path d="M${-w0} 0 L${-w0} -36 L${w0} -36 L${w0} 0 Z" fill="${SANDST}"/>`;
  for (const s of [-1, 1]) {
    const a = s * w0, f = s < 0 ? "#c98272" : "#7e4034";
    k += `<path d="M${r(a - s * 0.9)} 0 L${r(a + s * 1.1)} 0 L${r(a + s * 1.1)} -12 L${r(a + s * 0.7)} -13.6 L${r(a + s * 0.7)} -26 L${r(a + s * 0.35)} -27.4 L${r(a + s * 0.35)} -34.4 L${r(a)} -37.4 L${r(a - s * 0.9)} -34.4 Z" fill="${f}"/>`;
    k += `<path d="M${r(a + s * 1.1)} -12 L${r(a + s * 0.7)} -13.6 M${r(a + s * 0.7)} -26 L${r(a + s * 0.35)} -27.4" stroke="#e0a594" stroke-width=".3"/>`;
  }
  for (const [y, h] of [[-4, 12], [-19, 13]]) for (const x of [-3.2, 1.4]) k += `<path d="M${x} ${y} L${x} ${y - h + 1.6} Q${x + 0.9} ${y - h} ${x + 1.8} ${y - h + 1.6} L${x + 1.8} ${y} Z" fill="#34404a"/>`;
  k += `<rect x="${-w0 + 0.2}" y="-17.4" width="${2 * w0 - 0.4}" height=".8" fill="#d29483"/>`;
  /* Galerie und Ecktürmchen, darüber das Oktogon */
  k += `<rect x="${-w0 - 0.8}" y="-37.6" width="${2 * w0 + 1.6}" height="1.6" fill="#d29483"/>`;
  for (let x = -w0; x <= w0; x += 1.2) k += `<rect x="${r(x)}" y="-39" width=".45" height="1.4" fill="#b8695a"/>`;
  for (const s of [-1, 1]) k += `<path d="M${r(s * w0 - 0.9)} -37.6 L${r(s * w0 - 0.9)} -44 L${r(s * w0)} -48 L${r(s * w0 + 0.9)} -44 L${r(s * w0 + 0.9)} -37.6 Z" fill="#a95c4e"/>`;
  const w1 = 5.6;
  k += `<path d="M${-w1} -37.6 L${-w1} -58 L${w1} -58 L${w1} -37.6 Z" fill="${S.lg("okto", [[0, "#cf8878"], [0.35, "#b36656"], [0.65, "#9b5244"], [1, "#7a3e33"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-w1 * 0.5, w1 * 0.5]) k += `<line x1="${r(x)}" y1="-37.6" x2="${r(x)}" y2="-58" stroke="#7a3e33" stroke-width=".3"/>`;
  for (const x of [-3.9, -0.7, 2.5]) {
    k += `<path d="M${x} -40 L${x} -53 Q${x + 0.7} -55 ${x + 1.4} -53 L${x + 1.4} -40 Z" fill="#34404a"/>`;
    k += `<line x1="${x + 0.7}" y1="-40" x2="${x + 0.7}" y2="-53.6" stroke="#c99a88" stroke-width=".18"/>`;
    /* Wimperge über den Fenstern */
    k += `<path d="M${x - 0.5} -56 L${x + 0.7} -60.6 L${x + 1.9} -56 Z" fill="#b8695a" stroke="#7a3e33" stroke-width=".15"/>`;
  }
  for (const s of [-1, 1]) k += `<path d="M${r(s * w1 - 0.6)} -56 L${r(s * w1)} -62 L${r(s * w1 + 0.6)} -56 Z" fill="#8f4c40"/>`;
  /* die steinerne Kuppel mit Rippen und Krabben, darauf die Laterne */
  k += `<path d="M${-w1} -58 C${-w1 - 0.6} -62.6 -4.2 -66 -2.4 -70.4 C-1.8 -72 -1.2 -73.6 -1.1 -74.6 L1.1 -74.6 C1.2 -73.6 1.8 -72 2.4 -70.4 C4.2 -66 ${w1 + 0.6} -62.6 ${w1} -58 Z" fill="${S.lg("kuppel", [[0, "#d69584"], [0.4, "#b06554"], [1, "#7b3f34"]], 0, 0, 1, 0)}"/>`;
  for (const t of [-0.6, 0, 0.6]) {
    k += `<path d="M${r(t * w1)} -58 C${r(t * w1 * 1.04)} -64 ${r(t * 2.6)} -68 ${r(t * 1.2)} -74.4" stroke="#7a3e33" stroke-width=".3" fill="none"/>`;
    for (let i = 0; i < 5; i++) { const yy = -59.5 - i * 3; const xx = t * (w1 - (i * 0.85)); k += `<circle cx="${r(xx + 0.3)}" cy="${r(yy)}" r=".32" fill="#c27a69"/>`; }
  }
  k += `<rect x="-1.4" y="-78" width="2.8" height="3.4" fill="#b8695a"/><rect x="-.5" y="-77.4" width="1" height="2.2" fill="#34404a"/>`;
  k += `<path d="M-1.7 -78 L0 -81 L1.7 -78 Z" fill="#9b5244"/><line x1="0" y1="-81" x2="0" y2="-83.4" stroke="#7a3e33" stroke-width=".35"/><circle cx="0" cy="-81.8" r=".45" fill="#c7a640"/>`;
  k += lichtUeber(-w0, -36, 2 * w0, 36);
  S.teil({ id: "kaiserdom", de: "der Kaiserdom", syl: "KAI-ser-dom", it: "il Duomo imperiale", itSyl: "DUO-mo im-pe-RIA-le", en: "Imperial Cathedral",
    x: DOM.x, y: DOM.y, kunst: k, tipp: "Im Kaiserdom wurden die deutschen Kaiser gewählt und gekrönt. Sein Turm ist 95 Meter hoch.",
    zoom: { x: DOM.x - 15, y: DOM.y - 86, w: 30, h: 20 },
    unter: [
      { id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome",
        x: DOM.x, y: DOM.y - 58, kunst: flaeche(-6.4, -17, 12.8, 17.4, 0.6), tipp: "Die Kuppel oben auf dem Domturm ist aus Stein." },
    ] });
}

/* =====================================================================
   10 — DIE ALTSTADT (Häuser am Mainkai, Leonhardskirche, Platanen, Kaimauer)
   ===================================================================== */
{
  let k = "";
  const KAI = 111;   /* Straßenhöhe am Mainkai */
  const haus = (x, w, h, wand, dach, giebel) => {
    let g = `<rect x="${r(x)}" y="${r(KAI - h)}" width="${r(w)}" height="${r(h)}" fill="${wand}"/>`;
    if (giebel) g += `<path d="M${r(x - 0.2)} ${r(KAI - h)} L${r(x + w / 2)} ${r(KAI - h - w * 0.62)} L${r(x + w + 0.2)} ${r(KAI - h)} Z" fill="${wand}"/><path d="M${r(x - 0.4)} ${r(KAI - h)} L${r(x + w / 2)} ${r(KAI - h - w * 0.66)} L${r(x + w + 0.4)} ${r(KAI - h)}" stroke="${dach}" stroke-width=".7" fill="none"/>`;
    else g += `<path d="M${r(x - 0.3)} ${r(KAI - h)} L${r(x + 0.8)} ${r(KAI - h - 2.4)} L${r(x + w - 0.8)} ${r(KAI - h - 2.4)} L${r(x + w + 0.3)} ${r(KAI - h)} Z" fill="${dach}"/>`;
    const sp = Math.max(1, Math.floor(w / 2.2));
    for (let j = 0; j < Math.floor(h / 2.6); j++) for (let i = 0; i < sp; i++) g += `<rect x="${r(x + 0.7 + i * (w - 1.2) / sp)}" y="${r(KAI - 1.8 - j * 2.6)}" width="${r(Math.min(0.9, (w - 1.2) / sp - 0.4))}" height="1.2" fill="#4f5b66" opacity=".85"/>`;
    return g + lichtUeber(x, KAI - h, w, h);
  };
  const farben = ["#efe6d6", "#e8d2bf", "#f2ead9", "#d9c7b3", "#e6dccb", "#dcc0aa", "#f0e2cc", "#e2d6c6"];
  /* Untermainkai westlich des Stegs (hinter der Brücke), Leonhardskirche */
  let x = 64;
  while (x < 150) {
    const w = 4 + rnd() * 4, h = 4 + rnd() * 4.5;
    k += haus(x, w, h, farben[Math.floor(rnd() * farben.length)], "#6b6863", rnd() < 0.3);
    x += w;
  }
  for (const tx of [104, 108.6]) {
    k += `<rect x="${tx - 1.2}" y="${KAI - 18}" width="2.4" height="18" fill="${SANDST}"/>`;
    k += `<path d="M${tx - 1.3} ${KAI - 18} L${tx} ${KAI - 23.6} L${tx + 1.3} ${KAI - 18} Z" fill="${SCHIEFER}"/>`;
    k += `<rect x="${tx - 0.4}" y="${KAI - 16}" width=".8" height="2" fill="#3a2e2a"/>`;
  }
  k += `<path d="M101 ${KAI - 10} L112 ${KAI - 10} L112 ${KAI} L101 ${KAI} Z" fill="${SANDST}"/><path d="M100.6 ${KAI - 10} L106.4 ${KAI - 14.6} L112.4 ${KAI - 10} Z" fill="${SCHIEFER}"/>`;
  /* Ostteil: Häuser vor Römer, Paulskirche und Dom (neue Altstadt, Weckmarkt) */
  x = 186;
  const hoehen = [[186, 7, 11, 1], [193, 6, 10, 0], [199, 7, 12, 1], [206, 6, 10.5, 0], [212, 7, 11.8, 1], [219, 6.4, 11, 0], [225.4, 7, 12, 0], [232.4, 6.6, 11.4, 1], [239, 7.4, 12.4, 0], [246.4, 6.6, 11, 1], [253, 7, 12.6, 0], [260, 6.4, 11, 0], [266.4, 7.6, 12, 1], [274, 7, 11, 0], [281, 6.6, 12.6, 1], [287.6, 7.4, 11.6, 0], [295, 7, 12.8, 0], [302, 6.4, 11.4, 1], [308.4, 7.4, 12.2, 0], [315.8, 4.2, 11.6, 0]];
  for (const [hx, w, h, g] of hoehen) k += haus(hx, w, h, farben[Math.floor(rnd() * farben.length)], "#5f6670", g);
  /* Platanen am Mainkai */
  for (let tx = 189; tx < 314; tx += 8 + rnd() * 6) {
    const R = Math.min(4.2 + rnd() * 2.6, (320 - tx) / 0.95);
    k += `<rect x="${r(tx - 0.4)}" y="${KAI - 5}" width=".8" height="5" fill="#a9a08a"/>`;
    const cy = KAI - R * 1.45;
    for (const [dx, dy, s] of [[0, R * 0.25, 0.9], [-R * 0.62, R * 0.32, 0.62], [R * 0.6, R * 0.3, 0.66], [-R * 0.3, -R * 0.28, 0.66], [R * 0.32, -R * 0.36, 0.6], [R * 0.05, -R * 0.62, 0.48], [-R * 0.75, -R * 0.02, 0.42], [R * 0.78, -R * 0.04, 0.4]]) k += `<circle cx="${r(tx + dx)}" cy="${r(cy + dy)}" r="${r(R * 0.62 * s)}" fill="${[LAUB1, LAUB2, LAUB_F][Math.floor(rnd() * 3)]}"/>`;
    k += `<ellipse cx="${r(tx + R * 0.15)}" cy="${r(cy + R * 0.55)}" rx="${r(R * 0.7)}" ry="${r(R * 0.22)}" fill="#2f4a26" opacity=".35"/><circle cx="${r(tx - R * 0.35)}" cy="${r(cy - R * 0.3)}" r="${r(R * 0.22)}" fill="#cfe09a" opacity=".35"/>`;
  }
  /* Kaimauer aus rotem Sandstein bis zur Wasserlinie */
  let kai = `M150 ${KAI}`;
  for (let xx = 150; xx <= 320; xx += 10) kai += ` L${xx} ${KAI}`;
  for (let xx = 320; xx >= 150; xx -= 10) kai += ` L${xx} ${r(NORDKAI(xx) + 0.2)}`;
  k += `<path d="${kai} Z" fill="${S.lg("kaimauer", [[0, "#b98574"], [1, "#8a5e52"]])}"/>`;
  for (let xx = 152; xx < 320; xx += 3.2) k += `<line x1="${r(xx)}" y1="${KAI + 0.4}" x2="${r(xx)}" y2="${r(NORDKAI(xx) - 0.2)}" stroke="#7a4c42" stroke-width=".15" opacity=".6"/>`;
  k += `<rect x="150" y="${KAI - 0.6}" width="170" height=".8" fill="#d6b3a2"/>`;
  /* Uferweg unten und Mauer westlich des Stegs */
  k += `<path d="M${VPX + 2} ${HOR + 0.6} L150 ${r(NORDKAI(150) - 1.6)} L150 ${r(NORDKAI(150))} L${VPX + 2} ${HOR + 1.4} Z" fill="#9c7a6c"/>`;
  S.teil({ id: "altstadt", de: "die Altstadt", syl: "ALT-stadt", it: "il centro storico", itSyl: "CEN-tro STO-ri-co", en: "old town", x: 0, y: 0, kunst: k,
    tipp: "Zwischen Dom und Römer wurde die Altstadt neu aufgebaut – 2018 war sie fertig." });
}

/* =====================================================================
   11 — DER EISERNE STEG (genietetes Stahlfachwerk, zwei Pfeiler)
   ===================================================================== */
const STEG = { x0: 78, x1: 152, deck: 106.8, wasser: 114.2 };
{
  let k = "";
  const L = STEG.x1 - STEG.x0, p1 = STEG.x0 + L * 49.3 / 173.6, p2 = STEG.x0 + L * 131.8 / 173.6;
  const mitte = (p1 + p2) / 2;
  const deckY = (x) => STEG.deck - 0.7 * Math.sin(Math.PI * (x - STEG.x0) / L);
  /* Obergurt: an den Enden und in der Mitte niedrig, über den Pfeilern hoch */
  const obenY = (x) => {
    const hoch = 9.6, nied = 1.6;
    let t;
    if (x <= p1) t = Math.pow((x - STEG.x0) / (p1 - STEG.x0), 1.8);
    else if (x <= mitte) t = Math.pow((mitte - x) / (mitte - p1), 1.7);
    else if (x <= p2) t = Math.pow((x - mitte) / (p2 - mitte), 1.7);
    else t = Math.pow((STEG.x1 - x) / (STEG.x1 - p2), 1.8);
    return deckY(x) - (nied + (hoch - nied) * t);
  };
  const EIS = "#33414c";
  /* Pfeiler aus Sandstein mit Wellenbrecher */
  for (const px of [p1, p2]) {
    k += `<path d="M${r(px - 1.7)} ${STEG.wasser} L${r(px - 1.5)} ${r(deckY(px) + 0.6)} L${r(px + 1.5)} ${r(deckY(px) + 0.6)} L${r(px + 1.7)} ${STEG.wasser} Z" fill="${S.lg("pfeiler", [[0, "#c58f7f"], [0.6, "#9d6457"], [1, "#7a4a40"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${r(px - 1.7)} ${STEG.wasser} L${r(px)} ${STEG.wasser + 0.8} L${r(px + 1.7)} ${STEG.wasser} Z" fill="#6f4a42"/>`;
  }
  /* Widerlager mit Aufzugtürmen an beiden Enden */
  for (const [ax, s] of [[STEG.x0, -1], [STEG.x1, 1]]) {
    k += `<rect x="${r(ax + (s < 0 ? -3.6 : -0.4))}" y="${r(STEG.deck - 0.4)}" width="4" height="${r(STEG.wasser - STEG.deck + 0.4)}" fill="#a87566"/>`;
    k += `<rect x="${r(ax + (s < 0 ? -3.2 : 0.2))}" y="${r(STEG.deck - 7.4)}" width="2.8" height="7" fill="${S.lg("aufzug", [[0, "#d6e3ea"], [1, "#8ea6b6"]], 0, 0, 1, 0)}" stroke="${EIS}" stroke-width=".25"/>`;
    k += `<rect x="${r(ax + (s < 0 ? -3.4 : 0))}" y="${r(STEG.deck - 7.9)}" width="3.2" height=".6" fill="${EIS}"/>`;
  }
  /* Fachwerk: Untergurt (Gehweg), Obergurt, Pfosten und Diagonalen */
  let ober = "", unter = "";
  const pts = [];
  for (let x = STEG.x0; x <= STEG.x1 + 0.01; x += 1.2) pts.push(x);
  pts.forEach((x, i) => { ober += `${i ? "L" : "M"}${r(x)} ${r(obenY(x))} `; unter += `${i ? "L" : "M"}${r(x)} ${r(deckY(x))} `; });
  const fach = S.lg("fachwerk", [[0, "#4b5a66"], [1, "#2b363f"]]);
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    k += `<line x1="${r(a)}" y1="${r(deckY(a))}" x2="${r(a)}" y2="${r(obenY(a))}" stroke="${fach}" stroke-width=".22"/>`;
    k += `<line x1="${r(a)}" y1="${r(deckY(a))}" x2="${r(b)}" y2="${r(obenY(b))}" stroke="${fach}" stroke-width=".17"/>`;
    k += `<line x1="${r(a)}" y1="${r(obenY(a))}" x2="${r(b)}" y2="${r(deckY(b))}" stroke="${fach}" stroke-width=".17"/>`;
  }
  k += `<path d="${ober}" stroke="${EIS}" stroke-width=".7" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="${ober}" stroke="#8fa3b2" stroke-width=".22" fill="none" transform="translate(0 -.25)" opacity=".7"/>`;
  k += `<path d="${unter}" stroke="${EIS}" stroke-width="1" fill="none"/>`;
  k += `<path d="${unter}" stroke="#56636d" stroke-width=".35" fill="none" transform="translate(0 .6)"/>`;
  /* Querrahmen über den Pfeilern */
  for (const px of [p1, p2]) k += `<line x1="${r(px)}" y1="${r(deckY(px))}" x2="${r(px)}" y2="${r(obenY(px) - 0.3)}" stroke="${EIS}" stroke-width=".55"/>`;
  /* Geländer mit Liebesschlössern am Nordende */
  k += `<path d="${unter}" stroke="#56636d" stroke-width=".2" fill="none" transform="translate(0 -1.2)"/>`;
  for (let x = p2 + 1.5; x < STEG.x1 - 1; x += 0.55) k += `<circle cx="${r(x)}" cy="${r(deckY(x) - 1)}" r=".2" fill="${["#d9443a", "#e8c13a", "#c9ccd0", "#3f7fd0", "#e47fb0"][Math.floor(rnd() * 5)]}"/>`;
  /* zwei kleine Fußgänger auf dem Steg */
  for (const [x, c] of [[110, "#b8473a"], [121, "#2f5f95"]]) k += `<rect x="${x - 0.35}" y="${r(deckY(x) - 2.6)}" width=".7" height="1.6" rx=".3" fill="${c}"/><circle cx="${x}" cy="${r(deckY(x) - 3)}" r=".35" fill="#d9a07a"/>`;
  S.teil({ id: "eisernersteg", de: "der Eiserne Steg", syl: "EI-ser-ne STEG", it: "il Ponte di Ferro", itSyl: "PON-te di FER-ro", en: "Iron Footbridge",
    x: 0, y: 0, kunst: k, tipp: "Der Eiserne Steg ist eine Brücke nur für Fußgänger – es gibt ihn seit 1869.",
    zoom: { x: 106, y: 92, w: 48, h: 32 },
    unter: [
      { id: "pfeiler", de: "der Pfeiler", syl: "PFEI-ler", it: "il pilone", itSyl: "pi-LO-ne", en: "pier",
        x: p2, y: STEG.wasser, kunst: flaeche(-2, -7.6, 4, 8, 0.4) },
      { id: "liebesschloss", de: "das Liebesschloss", syl: "LIE-bes-schloss", it: "il lucchetto dell'amore", itSyl: "luc-CHET-to del-la-MO-re", en: "love lock",
        x: (p2 + STEG.x1) / 2 + 0.6, y: STEG.deck - 0.4, kunst: flaeche(-7, -2.2, 14, 2.4, 0.4),
        tipp: "Verliebte hängen ein Schloss an das Geländer und werfen den Schlüssel in den Main." },
    ] });
}

/* =====================================================================
   12 — DAS MUSEUM (Saalhof mit dem Rententurm, Historisches Museum)
   ===================================================================== */
{
  let k = "";
  const KAI = 111;
  /* Neubau des Historischen Museums: zwei steile Giebelhäuser */
  for (const [x0, w, h] of [[172, 7.6, 12], [180, 7.6, 13.4]]) {
    k += `<path d="M${x0} ${KAI} L${x0} ${KAI - h} L${x0 + w / 2} ${KAI - h - 6.6} L${x0 + w} ${KAI - h} L${x0 + w} ${KAI} Z" fill="${S.lg("hmf", [[0, "#e6cbbd"], [0.5, "#d2b1a2"], [1, "#b39181"]], 0, 0, 1, 0)}"/>`;
    for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) k += `<rect x="${r(x0 + 1.1 + i * 2.2)}" y="${r(KAI - 3.4 - j * 3.4)}" width=".6" height="2.4" fill="#4b4a4f"/>`;
    k += `<rect x="${r(x0 + w / 2 - 0.3)}" y="${r(KAI - h - 3.4)}" width=".6" height="2.4" fill="#4b4a4f"/>`;
  }
  /* Bernus-/Burnitzbau: klassizistisch, hell */
  k += `<rect x="161" y="${KAI - 11}" width="11.4" height="11" fill="${S.lg("burnitz", [[0, "#f3efe8"], [1, "#d7d0c4"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M160.6 ${KAI - 11} L162 ${KAI - 13.2} L171.6 ${KAI - 13.2} L172.8 ${KAI - 11} Z" fill="${SCHIEFER}"/>`;
  for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) k += `<rect x="${r(162.2 + i * 2.6)}" y="${r(KAI - 3.2 - j * 2.8)}" width="1" height="1.8" fill="#55606a"/>`;
  /* Rententurm (1456): Sandstein, steiles Zeltdach mit vier Ecktürmchen */
  const tx = 157.6, tw = 3.2;
  k += `<rect x="${tx - tw}" y="${KAI - 19}" width="${2 * tw}" height="19" fill="${SANDST}"/>`;
  for (const y of [-5, -10.4, -15.4]) k += `<path d="M${tx - 0.6} ${KAI + y} L${tx - 0.6} ${KAI + y - 2.2} Q${tx} ${KAI + y - 3} ${tx + 0.6} ${KAI + y - 2.2} L${tx + 0.6} ${KAI + y} Z" fill="#3a2e2a"/>`;
  k += `<rect x="${tx - tw - 0.4}" y="${KAI - 19.6}" width="${2 * tw + 0.8}" height=".8" fill="#d39a88"/>`;
  k += `<path d="M${tx - tw} ${KAI - 19.6} L${tx} ${KAI - 31} L${tx + tw} ${KAI - 19.6} Z" fill="${SCHIEFER}"/>`;
  k += `<path d="M${tx - tw} ${KAI - 19.6} L${tx} ${KAI - 31} L${tx - 0.8} ${KAI - 19.6} Z" fill="#76828c" opacity=".5"/>`;
  for (const s of [-1, 1]) {
    const ex = tx + s * (tw - 0.2);
    k += `<rect x="${r(ex - 0.8)}" y="${KAI - 22.4}" width="1.6" height="3.2" fill="#b36a5a"/>`;
    k += `<path d="M${r(ex - 0.95)} ${KAI - 22.4} L${r(ex)} ${KAI - 26.6} L${r(ex + 0.95)} ${KAI - 22.4} Z" fill="${SCHIEFER}"/>`;
  }
  k += `<line x1="${tx}" y1="${KAI - 31}" x2="${tx}" y2="${KAI - 32.6}" stroke="#3d454c" stroke-width=".3"/><circle cx="${tx}" cy="${KAI - 32.8}" r=".35" fill="#c7a640"/>`;
  k += lichtUeber(161, KAI - 11, 11.4, 11) + lichtUeber(tx - tw, KAI - 19, 2 * tw, 19);
  S.teil({ id: "museum", de: "das Museum", syl: "mu-SE-um", it: "il museo", itSyl: "mu-SE-o", en: "museum", x: 0, y: 0, kunst: k,
    tipp: "Im Historischen Museum am Main lernt man die Geschichte Frankfurts kennen." });
}

/* =====================================================================
   13 — DAS SCHIFF (Mainrundfahrt, fährt flussabwärts nach links)
   ===================================================================== */
{
  let k = schatten(0, 0.2, 26, 1, 0.22);
  k += `<path d="M-27 -.2 q-3 .8 -6 .2 M24 .4 q5 .8 11 .2 M25 1.1 q6 .5 12 0" stroke="#eef5f7" stroke-width=".45" fill="none" opacity=".8"/>`;
  k += `<path d="M-27 -4.4 L25 -4.4 L26 -1 Q25.2 .3 23.6 .3 L-21 .3 Q-24.6 0 -27 -4.4 Z" fill="${S.lg("rumpf", [[0, "#ffffff"], [0.5, "#eef1f3"], [0.52, "#24477d"], [1, "#183462"]])}"/>`;
  k += `<rect x="-24.6" y="-3" width="49" height=".45" fill="#c9302c"/>`;
  k += `<path d="M-21 -4.4 L-19 -9.2 L23 -9.2 L24 -4.4 Z" fill="#f4f6f7"/>`;
  for (let x = -18; x < 22; x += 3.2) k += `<rect x="${x}" y="-8.4" width="2.6" height="3.2" rx=".3" fill="${S.lg("salon", [[0, "#86a3b8"], [1, "#344d61"]])}"/>`;
  k += `<rect x="-19.4" y="-10" width="43" height=".8" fill="#dfe3e6"/>`;
  k += `<path d="M-18 -10 L-18 -12 L22.6 -12 L22.6 -10" stroke="#9aa3aa" stroke-width=".28" fill="none"/>`;
  for (const [x, c] of [[-6, "#b8473a"], [-1, "#2f5f95"], [5, "#d8ad3a"], [11, "#4f8a46"], [16, "#eeefec"]]) k += `<circle cx="${x}" cy="-11.6" r=".75" fill="#d9a07a"/><rect x="${x - 0.85}" y="-10.9" width="1.7" height="1.1" rx=".5" fill="${c}"/>`;
  k += `<path d="M-16.4 -10 L-15.6 -13.8 L-8.4 -13.8 L-7.8 -10 Z" fill="#fbfcfc"/><rect x="-15.2" y="-13.2" width="6.6" height="1.8" fill="#2e4658"/><rect x="-16.4" y="-14.4" width="8.8" height=".6" fill="#24477d"/>`;
  k += `<text x="3" y="-1.2" font-size="2" text-anchor="middle" fill="#f2f4f6" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".2">MAINRUNDFAHRT</text>`;
  /* Frankfurter Flagge am Heck: rot-weiß */
  k += `<line x1="24" y1="-4.4" x2="24" y2="-10.6" stroke="#8a8f94" stroke-width=".28"/><rect x="24" y="-10.6" width="3.4" height="1.1" fill="#d7262b"/><rect x="24" y="-9.5" width="3.4" height="1.1" fill="#fbfbf8"/>`;
  S.teil({ id: "schiff", de: "das Schiff", syl: "SCHIFF", it: "il battello", itSyl: "bat-TEL-lo", en: "boat",
    x: 246, y: 124.6, kunst: k, tipp: "Mit dem Schiff macht man eine Rundfahrt auf dem Main." });
}

/* =====================================================================
   13b — DAS RUDERBOOT (ein Vierer, fährt flussabwärts nach links)
   ===================================================================== */
{
  let k = `<ellipse cx="0" cy=".5" rx="17" ry=".8" fill="#1f343a" opacity=".3"/>`;
  /* Kielwasser und Ruderschläge */
  k += `<path d="M14 .3 q6 .5 12 0 M14 1 q7 .4 14 0" stroke="#e9f2f4" stroke-width=".35" fill="none" opacity=".75"/>`;
  k += `<path d="M-15 0 Q-16 -.9 -14 -1.2 L13 -1.2 Q15.4 -.8 14.6 0 Z" fill="${S.lg("ruder", [[0, "#f4f1e6"], [1, "#c9c2ad"]])}"/>`;
  k += `<rect x="-14" y="-1.5" width="27" height=".35" fill="#2f5f95"/>`;
  for (let i = 0; i < 4; i++) {
    const x = -9 + i * 5.2, sx = i % 2 ? -1 : 1;
    k += `<line x1="${x}" y1="-2" x2="${r(x - 4.6)}" y2="${r(0.6 + sx * 0.2)}" stroke="#d8d2c0" stroke-width=".3"/>`;
    k += `<ellipse cx="${r(x - 4.7)}" cy=".7" rx=".7" ry=".2" fill="#e9f2f4" opacity=".8"/>`;
    k += `<path d="M${x - 0.7} -1.3 L${x - 0.4} -3.4 L${x + 0.6} -3.4 L${x + 0.8} -1.3 Z" fill="${["#c9302c", "#f2f2ee", "#c9302c", "#f2f2ee"][i]}"/><circle cx="${x + 0.1}" cy="-4" r=".55" fill="#d9a07a"/>`;
  }
  S.teil({ id: "ruderboot", de: "das Ruderboot", syl: "RU-der-boot", it: "la barca a remi", itSyl: "BAR-ca a RE-mi", en: "rowing boat",
    x: 214, y: 139, kunst: k, tipp: "Auf dem Main trainieren viele Rudervereine." });
}

/* =====================================================================
   14 — DER SCHWAN (zwei Höckerschwäne nahe am Ufer)
   ===================================================================== */
{
  const schwan = (x, y, s, sp) => {
    let g = `<ellipse cx="${x}" cy="${r(y + 0.6 * s)}" rx="${r(5 * s)}" ry="${r(0.7 * s)}" fill="#2a4248" opacity=".35"/>`;
    g += `<path d="M${r(x - 4.4 * s * sp)} ${y} Q${r(x - 5 * s * sp)} ${r(y - 2.8 * s)} ${r(x - 2 * s * sp)} ${r(y - 2.8 * s)} L${r(x + 2 * s * sp)} ${r(y - 2.4 * s)} Q${r(x + 4 * s * sp)} ${r(y - 1.6 * s)} ${r(x + 3.4 * s * sp)} ${y} Z" fill="${S.lg("feder", [[0, "#ffffff"], [1, "#d9dfe2"]])}"/>`;
    g += `<path d="M${r(x - 3.6 * s * sp)} ${r(y - 2.2 * s)} Q${r(x - 4.8 * s * sp)} ${r(y - 4.2 * s)} ${r(x - 5.4 * s * sp)} ${r(y - 2.6 * s)}" stroke="#f4f6f6" stroke-width="${r(0.6 * s)}" fill="none"/>`;
    g += `<path d="M${r(x + 1.8 * s * sp)} ${r(y - 2.4 * s)} Q${r(x + 2.6 * s * sp)} ${r(y - 7.4 * s)} ${r(x + 3.6 * s * sp)} ${r(y - 7.4 * s)}" stroke="#fbfcfc" stroke-width="${r(0.9 * s)}" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M${r(x + 3.6 * s * sp)} ${r(y - 7.9 * s)} l${r(1.6 * s * sp)} ${r(0.6 * s)} l${r(-1.6 * s * sp)} ${r(0.4 * s)} Z" fill="#e0782e"/>`;
    g += `<circle cx="${r(x + 3.7 * s * sp)}" cy="${r(y - 7.8 * s)}" r="${r(0.32 * s)}" fill="#1d1d1d"/>`;
    return g;
  };
  const k = schwan(-5, 0, 1.15, 1) + schwan(7, -6, 0.8, 1);
  S.teil({ oben: true, id: "schwan", de: "der Schwan", syl: "SCHWAN", it: "il cigno", itSyl: "CI-gno", en: "swan", x: 168, y: 178, kunst: k,
    tipp: "Auf dem Main schwimmen viele Schwäne." });
}

/* =====================================================================
   15 — DIE PLATANE (der nächste Baum am Ufer, links)
   ===================================================================== */
{
  const d = 60, th = -Math.atan2(9, d) * 180 / Math.PI, rr = Math.hypot(d, 9);
  const x = X(th), fuss = BODEN(rr);
  const k = platane(0, 0, 4896 / rr - 544 / rr, 340 * 6.5 / rr, false);
  S.teil({ id: "platane", de: "die Platane", syl: "pla-TA-ne", it: "il platano", itSyl: "PLA-ta-no", en: "plane tree", x, y: fuss, steht: true, kunst: k,
    tipp: "Platanen erkennt man an ihrer hellen, fleckigen Rinde." });
}

/* =====================================================================
   16 — DER KELLNER (bringt einen Bembel an den Tisch)
   ===================================================================== */
{
  const d = 14, th = -Math.atan2(2, d) * 180 / Math.PI;
  const x = X(th), y = BODEN(d), H = 340 * 1.78 / d;
  const m = B.mensch({ id: "ffm_kellner", geschlecht: "m", pose: "servieren", blick: 30, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "kellnerhemd" }, schuerze: { stueck: "schuerze", farbe: "#2c4a7a" }, unterteil: { stueck: "anzughose" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, H);
  const hand = [m.z.handL, m.z.handR].filter(Boolean).sort((a, b) => (a.y != null ? a.y : a[1]) - (b.y != null ? b.y : b[1]))[0];
  const hx = (hand.x != null ? hand.x : hand[0]) * m.k, hy = (hand.y != null ? hand.y : hand[1]) * m.k;
  /* kleiner Bembel in der Hand */
  const bem = `<g transform="translate(${r(hx)} ${r(hy - 3.2)})"><path d="M-1.6 3 Q-2.4 1 -1.4 -.6 L-.8 -2.2 L.8 -2.2 L1.4 -.6 Q2.4 1 1.6 3 Z" fill="#a9adb0"/><path d="M-1.5 .9 h3" stroke="#2f4f9a" stroke-width=".35"/><path d="M1.6 -.4 q1.2 .6 .4 2" stroke="#8d9194" stroke-width=".35" fill="none"/></g>`;
  S.teil({ id: "kellner", de: "der Kellner", syl: "KELL-ner", it: "il cameriere", itSyl: "ca-me-RIE-re", en: "waiter", x, y, kunst: schatten(1, 0.2, 6, 1.1, 0.3) + m.svg + bem,
    tipp: "Der Kellner bringt den Apfelwein im Bembel an den Tisch." });
}

/* =====================================================================
   17 — DER TISCH (Apfelweintisch vorne) mit Bembel, Geripptem und Essen
   ===================================================================== */
const TISCH = { y: 170 };
{
  let k = "";
  /* Tischplatte in Perspektive, die Kanten laufen zum Fluchtpunkt */
  const lx = (y) => Math.max(0, -6 + (y - TISCH.y) * (-64 / 60)), rx = (y) => 83 + (y - TISCH.y) * (25 / 60);
  k += `<path d="M0 ${TISCH.y} L83 ${TISCH.y} L${r(rx(200))} 200 L0 200 Z" fill="${S.lg("tischholz", [[0, "#b98a57"], [0.5, "#a67745"], [1, "#8c6036"]])}"/>`;
  for (const t of [0.12, 0.27, 0.45, 0.66, 0.9]) { const y = TISCH.y + 30 * t; k += `<line x1="${r(lx(y))}" y1="${r(y)}" x2="${r(rx(y))}" y2="${r(y)}" stroke="#6e4826" stroke-width="${r(0.25 + t * 0.35)}" opacity=".55"/>`; }
  for (let i = 0; i < 26; i++) { const y = TISCH.y + 1 + rnd() * 28, x = lx(y) + rnd() * (rx(y) - lx(y)); k += `<path d="M${r(x)} ${r(y)} q${r(3 + rnd() * 4)} -.3 ${r(7 + rnd() * 6)} 0" stroke="#c99a66" stroke-width=".25" fill="none" opacity=".5"/>`; }
  k += `<path d="M0 ${TISCH.y} L83 ${TISCH.y}" stroke="#d6a873" stroke-width=".8"/><path d="M83 ${TISCH.y} L${r(rx(200))} 200" stroke="#7a5230" stroke-width=".6"/>`;
  k += `<path d="M0 ${TISCH.y} L83 ${TISCH.y} L${r(rx(200))} 200 L0 200 Z" fill="${S.lg("tischlicht", [[0, "#fff3d6", 0.18], [0.5, "#fff3d6", 0], [1, "#000", 0.12]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: 0, y: 0, kunst: k });
}
{
  /* DER BEMBEL: graues Steinzeug, blaue Bemalung, Henkel, Ausguss */
  let k = schatten(2, 0.3, 9, 1.5, 0.3);
  const STEIN = S.lg("steinzeug", [[0, "#d8dcdf"], [0.35, "#bfc4c8"], [0.75, "#9a9fa4"], [1, "#7c8186"]], 0, 0, 1, 0);
  k += `<path d="M-5.4 0 Q-8.6 -6 -7.4 -12 Q-6.4 -16 -3.4 -17.4 L-3 -20.6 Q-3.2 -22.4 -4 -23 L4 -23 Q3.2 -22.4 3 -20.6 L3.4 -17.4 Q6.4 -16 7.4 -12 Q8.6 -6 5.4 0 Z" fill="${STEIN}"/>`;
  /* Henkel rechts, Ausguss links */
  k += `<path d="M5.8 -16.6 Q11.4 -16.4 10.6 -10.4 Q10 -6.4 6.8 -5.2" stroke="${S.lg("henkel", [[0, "#c5cacd"], [1, "#8d9297"]])}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M-4 -23 L-6.6 -24 L-4.4 -21.6 Z" fill="#b6bbbf"/>`;
  /* blaue Kobaltmalerei: Ranken, Bänder, Herzblatt */
  k += `<path d="M-6.9 -6 Q0 -4.6 6.9 -6 M-7.4 -13.4 Q0 -12 7.4 -13.4" stroke="#2c4fa0" stroke-width=".55" fill="none"/>`;
  k += `<path d="M-5 -9.6 q1.4 -2.4 2.8 0 q1.4 2.4 2.8 0 q1.4 -2.4 2.8 0 q1.2 2 2.4 0" stroke="#2c4fa0" stroke-width=".5" fill="none"/>`;
  k += `<path d="M0 -10.6 q-1.6 -1.6 0 -2.6 q1.6 1 0 2.6 Z" fill="#2c4fa0"/>`;
  k += `<path d="M-3 -19.6 L3 -19.6" stroke="#2c4fa0" stroke-width=".45"/>`;
  k += `<path d="M-6 -12 Q-6.6 -6 -4.4 -1.4" stroke="#fff" stroke-width=".8" opacity=".45" fill="none"/>`;
  k += `<rect x="-4" y="-23.4" width="8" height=".8" rx=".4" fill="#c9cdd0"/>`;
  S.teil({ oben: true, id: "bembel", de: "der Bembel", syl: "BEM-bel", it: "la brocca del sidro", itSyl: "BROC-ca del SI-dro", en: "cider jug",
    x: 30, y: 184, steht: true, kunst: k, tipp: "Aus dem Bembel, einem grau-blauen Steinkrug, schenkt man Apfelwein aus." });
}
{
  /* DAS GERIPPTE: Apfelweinglas mit Rautenschliff, zwei Gläser */
  const glas = (x, y, s, voll) => {
    const w = 3.6 * s, h = 12.4 * s;
    let g = schatten(x + 1, y + 0.2, w + 1.4, 0.9 * s, 0.25);
    g += `<path d="M${r(x - w)} ${y} L${r(x - w * 1.08)} ${r(y - h)} L${r(x + w * 1.08)} ${r(y - h)} L${r(x + w)} ${y} Z" fill="#e8f0ee" opacity=".5"/>`;
    g += `<path d="M${r(x - w * 0.98)} ${r(y - 0.6)} L${r(x - w * 1.05)} ${r(y - h * voll)} L${r(x + w * 1.05)} ${r(y - h * voll)} L${r(x + w * 0.98)} ${r(y - 0.6)} Z" fill="${S.lg("aeppler", [[0, "#f2d77e"], [1, "#d8b24a"]])}" opacity=".9"/>`;
    g += `<ellipse cx="${x}" cy="${r(y - h * voll)}" rx="${r(w * 1.05)}" ry="${r(0.6 * s)}" fill="#f7e7a8"/>`;
    /* Rautenmuster */
    for (let j = 0; j < 5; j++) for (let i = 0; i < 4; i++) {
      const cx = x - w * 0.75 + i * w * 0.5, cy = y - h * 0.12 - j * h * 0.18;
      g += `<path d="M${r(cx)} ${r(cy - 0.9 * s)} L${r(cx + 0.7 * s)} ${r(cy)} L${r(cx)} ${r(cy + 0.9 * s)} L${r(cx - 0.7 * s)} ${r(cy)} Z" fill="none" stroke="#ffffff" stroke-width="${r(0.18 * s)}" opacity=".7"/>`;
    }
    g += `<ellipse cx="${x}" cy="${r(y - h)}" rx="${r(w * 1.08)}" ry="${r(0.7 * s)}" fill="none" stroke="#f4f8f7" stroke-width="${r(0.25 * s)}"/>`;
    g += `<path d="M${r(x - w * 0.8)} ${r(y - h * 0.9)} L${r(x - w * 0.72)} ${r(y - 1)}" stroke="#fff" stroke-width="${r(0.4 * s)}" opacity=".6"/>`;
    return g;
  };
  const k = glas(0, 0, 1, 0.82) + glas(-44, 5.6, 1.12, 0.7);
  S.teil({ oben: true, id: "geripptes", de: "das Gerippte", syl: "ge-RIPP-te", it: "il bicchiere a rombi", itSyl: "bic-CHIE-re a ROM-bi", en: "ribbed cider glass",
    x: 52, y: 188.5, steht: true, kunst: k, tipp: "Das Apfelweinglas heißt „Geripptes“ – wegen seines Rautenmusters." });
}
{
  /* DIE FRANKFURTER WÜRSTCHEN: ein Paar, Senf, Brot */
  let k = schatten(0, 0.3, 10, 1.4, 0.25);
  k += `<ellipse cx="0" cy="0" rx="10" ry="3" fill="${S.lg("teller2", [[0, "#ffffff"], [1, "#dcdcd6"]])}"/>`;
  for (const dy of [-1.6, -0.2]) k += `<path d="M-7 ${dy} Q0 ${dy - 1.6} 7 ${dy} Q7.6 ${dy + 0.6} 7 ${dy + 0.9} Q0 ${dy - 0.6} -7 ${dy + 0.9} Q-7.6 ${dy + 0.5} -7 ${dy} Z" fill="${S.lg("wurst", [[0, "#e7a77a"], [0.6, "#cf8457"], [1, "#a85f3c"]])}"/>`;
  k += `<path d="M-5 -2.4 Q0 -3.6 5 -2.4" stroke="#f3c9a8" stroke-width=".3" fill="none" opacity=".8"/>`;
  k += `<ellipse cx="6.4" cy="1.3" rx="1.8" ry=".7" fill="#e3b52e"/>`;
  k += `<path d="M-9.4 .4 Q-9 -2 -6.6 -2.2 L-5 1.6 Q-8 2 -9.4 .4 Z" fill="#c99a5c"/><path d="M-9 0 Q-8.4 -1.4 -6.8 -1.6" stroke="#f2deb8" stroke-width=".5" fill="none"/>`;
  S.teil({ oben: true, id: "wuerstchen", de: "das Frankfurter Würstchen", syl: "FRANK-fur-ter WÜRST-chen", it: "il würstel di Francoforte", itSyl: "WÜR-stel di fran-co-FOR-te", en: "frankfurter sausage",
    x: 69, y: 177.6, steht: true, kunst: k, tipp: "Frankfurter Würstchen sind aus Schweinefleisch. Man erwärmt sie nur im heißen Wasser." });
}

{
  /* DIE GRÜNE SOSSE: tiefer Teller, sieben Kräuter, halbe Eier, Kartoffeln */
  let k = schatten(1, 0.4, 15, 2, 0.28);
  k += `<ellipse cx="0" cy="0" rx="14" ry="4.4" fill="${S.lg("teller", [[0, "#ffffff"], [1, "#dcdcd6"]])}"/>`;
  k += `<ellipse cx="0" cy="-.6" rx="11" ry="3.2" fill="${S.rg("gruen", [[0, "#cfe08f"], [0.6, "#a9c464"], [1, "#86a64a"]], 0.45, 0.4, 0.7)}"/>`;
  for (let i = 0; i < 26; i++) k += `<circle cx="${r(-9.6 + rnd() * 19.2)}" cy="${r(-2.6 + rnd() * 3.6)}" r=".25" fill="${rnd() < 0.5 ? "#5f8a3a" : "#3f6a2a"}"/>`;
  for (const [x, y] of [[-5.4, -1.6], [-1.6, -0.6], [2.4, -1.8]]) {
    k += `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="1.3" fill="#fbfbf6"/><ellipse cx="${r(x + 0.2)}" cy="${r(y - 0.1)}" rx="1.1" ry=".7" fill="#f2b43a"/>`;
  }
  for (const [x, y] of [[6.4, -1.2], [8.6, -.2], [5.6, .6]]) k += `<ellipse cx="${x}" cy="${y}" rx="1.9" ry="1.3" fill="${S.rg("kartoffel", [[0, "#f6dc92"], [1, "#d9b158"]], 0.4, 0.35, 0.7)}"/>`;
  k += `<ellipse cx="0" cy="0" rx="14" ry="4.4" fill="none" stroke="#c9c9c2" stroke-width=".25"/>`;
  S.teil({ oben: true, id: "gruenesosse", de: "die Grüne Soße", syl: "GRÜ-ne SO-ße", it: "la salsa verde", itSyl: "SAL-sa VER-de", en: "green sauce",
    x: 73, y: 193.4, steht: true, kunst: k, tipp: "Grüne Soße macht man aus sieben Kräutern. Dazu gibt es Eier und Kartoffeln." });
}
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/frankfurt.js"));
console.log(aus);
