#!/usr/bin/env node
/* =====================================================================
   NÜRNBERG (FASSUNG 854, Runde 2) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (nuernberg.de „Frauenkirche“, „Schöner Brunnen“, Hochbauamt
   „Männleinlaufen/Uhrentechnik“, Bayerische Schlösserverwaltung
   „Kaiserburg“, tourismus.nuernberg.de „Christkindlesmarkt“):
   - STANDORT: Blick aus einem Café-Fenster im 3. Obergeschoss (Auge rund
     12 m über dem Pflaster) an der SÜDWESTECKE des Hauptmarkts, Blick
     nach NORDNORDOST über den Christkindlesmarkt — das klassische Bild
     über das Meer der rot-weißen Budendächer. Advent, gegen 15:30 Uhr:
     Die Sonne steht nur noch knapp über den Dächern im Südwesten (hinter
     uns, links) — der Platz liegt schon im kühlen Schatten, oben glühen
     Burg, Kirchtürme, Giebel und die Spitze des Brunnens im letzten
     Sonnenlicht; im Nordosten färbt sich der Himmel rosa.
   - Echte Richtungen von hier (Peilung): St. Sebald (Westtürme) NNW,
     die Kaiserburg N (Palas links, Sinwellturm Mitte, Luginsland rechts),
     der Schöne Brunnen an der NORDWESTECKE des Platzes etwa NNO vor dem
     Ostteil der Burg, die Frauenkirche an der OSTSEITE des Platzes (ONO):
     man sieht ihre Westfassade schräg von links, das Langhaus läuft
     nach rechts in die Tiefe. Verdichtung: Die Burg ist wie mit einem
     Teleobjektiv gezeigt (≈ 1,5× größer) — vom Platz aus verdecken sie
     sonst die Häuser der Nordseite; die Abstände sind seitlich gestaucht.
   - KAISERBURG, von West nach Ost: Palas (hohes Dach) mit Kaiserkapelle
     und HEIDENTURM (oben Backstein), im äußeren Burghof der runde
     SINWELLTURM (Buckelquader, 1560er aufgestockt: auskragendes Geschoss,
     Zeltdach mit Renaissance-Haube), der FÜNFECKTURM, die lange
     KAISERSTALLUNG (riesiges Dach mit Gaubenreihen) und der LUGINSLAND
     (Viereckturm, Helm mit vier Ecktürmchen). Der rote Burgsandstein
     liegt nur im Westen unter Palas und Burggarten frei; der Südhang ist
     mit Häusern und Gärten bedeckt.
   - ST. SEBALD: zwei Westtürme (unten viereckig, oben achteckig, 1481–83,
     spitze Helme), ≈ 78 m; dahinter Langhausdach und hoher Ostchor.
     (Unsicher: genaue Helmfarbe — dunkel/schiefergrau gezeichnet.)
   - FRAUENKIRCHE (1352–62): Treppengiebel mit Fialen und Blendmaßwerk,
     Vorhalle mit Figurenportal, darüber der Michaelschor mit der Empore
     (dort spricht das Christkind den Prolog), zwei Treppentürmchen, die
     Kunstuhr (blau-goldenes Zifferblatt 2,5 m, darüber die Mondkugel,
     halb blau, halb golden), darunter das MÄNNLEINLAUFEN von 1509 — nur um
     12 Uhr ziehen die sieben Kurfürsten um Kaiser Karl IV.; jetzt (15:30)
     sind die Türchen zu, nur der Kaiser thront in der Mitte; oben das
     Maßwerktürmchen. Die Uhr zeigt halb vier.
   - SCHÖNER BRUNNEN (1385–96, Kopie): rund 19 m, gotische Turmspitze aus
     hellem Sandstein, 40 farbig gefasste Figuren, vergoldete
     Fialenspitzen; achteckiges Becken; ringsum das Renaissance-Gitter
     (1587) mit dem nahtlosen goldenen Messing-RING (Wunschring).
   - CHRISTKINDLESMARKT: rund 160–180 Holzbuden mit rot-weiß gestreiften
     Stoffdächern, Lichterketten, viele Besucher; eine Bratwurstbude
     raucht (Rostbratwürste über Buchenholz).
   - VORNE auf der Fensterbank: Adventskranz (zwei Kerzen brennen),
     Glühwein in der Markttasse, „Drei im Weggla“ (drei Rostbratwürste im
     Brötchen), Elisenlebkuchen in der Dose, Zwetschgenmännchen,
     Rauschgoldengel; am Fensterrahmen hängt ein Lebkuchenherz.
   Maßstab: Augenhöhe y = 92, Auge 12 m über dem Platz, Brennweite 270:
   ein Punkt am Boden in d Metern liegt bei y = 92 + 3240 / d, dort gilt
   270 / d Einheiten je Meter (Brunnen 75 m: 3,6 E/m; Frauenkirche
   100–110 m: 2,5–2,7 E/m; Nordseite 95 m: 2,84 E/m).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "nuernberg", titel: "Nürnberg", emoji: "🏰", thema: "Deutschland", kuerzel: "nbg", fassung: 854 });
const rnd = zufall(1050);
const r = B.r;
const HOR = 92, F = 270, AUGE = 12;
const bodenY = (d) => HOR + F * AUGE / d;           /* y des Bodens in d Metern */
const em = (d) => F / d;                            /* Einheiten je Meter in d Metern */
/* Ein Teil, dessen Zeichnung in Bildkoordinaten vorliegt, bekommt einen Anker in seiner Mitte */
const anker = (ax, ay, svg) => `<g transform="translate(${-ax} ${-ay})">${svg}</g>`;
/* Vieleck auf den Bildstreifen 0 ≤ x ≤ 320 zuschneiden (Sutherland–Hodgman) — so bleibt die Fläche im Bild */
const kappen = (pts) => {
  const schnitt = (poly, innen, x0) => { const aus = []; for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length], ia = innen(a), ib = innen(b); if (ia) aus.push(a); if (ia !== ib) { const t = (x0 - a[0]) / (b[0] - a[0]); aus.push([x0, a[1] + t * (b[1] - a[1])]); } } return aus; };
  return schnitt(schnitt(pts, (p) => p[0] >= 0, 0), (p) => p[0] <= 320, 320);
};
const vieleck = (pts, attr) => { const q = kappen(pts); return q.length > 2 ? `<path d="M${q.map(([x, y]) => `${r(x)} ${r(y)}`).join(" L")} Z" ${attr}/>` : ""; };
const mische = (a, b, t) => "#" + [0, 2, 4].map((i) => Math.round(parseInt(a.slice(1 + i, 3 + i), 16) * (1 - t) + parseInt(b.slice(1 + i, 3 + i), 16) * t).toString(16).padStart(2, "0")).join("");

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("weich")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".35"/></filter>`);
S.def(`<filter id="${S.id("glimm")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.2"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
/* Sandstein: im letzten Sonnenlicht (warm) und im Schatten (kühl) */
const FERN = S.lg("fern", [[0, "#f0be92"], [0.5, "#d89a70"], [1, "#b07a5e"]], 0, 0, 1, 0);
const FERN_D = S.lg("fernd", [[0, "#b07c66"], [1, "#8e6456"]], 0, 0, 1, 0);
const ZIEGEL = S.lg("ziegel", [[0, "#cc6a4a"], [0.5, "#ae5038"], [1, "#883c2c"]], 0, 0, 1, 0);
const ZIEGEL_D = S.lg("ziegeld", [[0, "#94452f"], [1, "#6a2c20"]], 0, 0, 1, 0);
const ZIEGEL_F = S.lg("ziegelf", [[0, "#d08262"], [0.5, "#b4644c"], [1, "#905040"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff1a8"], [0.4, "#f1c74a"], [1, "#a8770f"]], 0, 0, 1, 1);
const DUNKEL = "#3a2a2c";
const LICHT = "#ffd98a";
const SCHATTEN = "#2c3a6a";      /* kühler Schatten im Advent */

/* =====================================================================
   KULISSE — Adventshimmel: im Nordosten rosa (Gegendämmerung), links
   (Südwesten) warm; dahinter nur Himmel
   ===================================================================== */
S.hinten(`<rect width="320" height="140" fill="${S.lg("himmel", [[0, "#365a94"], [0.35, "#6a8cc0"], [0.62, "#b8a8c4"], [0.8, "#e4b4aa"], [1, "#f0c8a4"]])}"/>`);
S.hinten(`<circle cx="-50" cy="70" r="150" fill="${S.rg("sonne", [[0, "#ffd9a0", 0.5], [1, "#ffd9a0", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[96, 18, 1.1], [214, 10, 0.9], [300, 40, 0.8], [176, 46, 0.6]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".85">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 19, 3.4], [-12, 1.2, 11, 2.6], [12, 1, 13, 2.8], [-2, -2, 9, 3]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#e8d4dc"/>`;
    w += `<ellipse cx="${r(x - 4 * s)}" cy="${r(y + 1.8 * s)}" rx="${r(15 * s)}" ry="${r(1.6 * s)}" fill="#ffc8a0" opacity=".85"/></g>`;
  }
  S.hinten(w);
}
/* der Platz: Pflaster im Schatten, Fugen fluchten zum Augpunkt (160, 92) */
{
  const y0 = bodenY(96);
  let f = `<rect x="0" y="${r(y0)}" width="320" height="${r(200 - y0)}" fill="${S.lg("pflaster", [[0, "#7a7488"], [1, "#5e5a70"]])}"/>`;
  for (let i = -16; i <= 16; i++) f += `<line x1="${r(160 + i * 3 * (y0 - HOR) / 3)}" y1="${r(y0)}" x2="${r(160 + i * 3 * (200 - HOR) / 3)}" y2="200" stroke="#4a4660" stroke-width=".25" opacity=".5"/>`;
  for (const d of [90, 80, 70, 62, 55, 49, 44, 40, 36, 33]) f += `<line x1="0" y1="${r(bodenY(d))}" x2="320" y2="${r(bodenY(d))}" stroke="#4a4660" stroke-width=".25" opacity=".45"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DIE SEBALDUSKIRCHE (zwei Westtürme, Langhaus- und Chordach)
   ===================================================================== */
{
  const D = 210, s = em(D), basis = bodenY(D);      /* ≈ 1,29 E/m */
  const turm = (cx, sk, hinten) => {
    const k1 = s * sk, Y = (v) => basis - (v - 0) * k1, X = (u) => cx + u * k1;
    const ST = hinten ? S.lg("sebaldh", [[0, "#c88a6a"], [1, "#9a6450"]], 0, 0, 1, 0) : S.lg("sebald", [[0, "#e6a47c"], [0.55, "#c4805e"], [1, "#94604a"]], 0, 0, 1, 0);
    let g = `<rect x="${r(X(-4.5))}" y="${r(Y(45))}" width="${r(9 * k1)}" height="${r(45 * k1)}" fill="${ST}"/>`;
    for (const v of [18, 27, 36]) g += `<rect x="${r(X(-4.6))}" y="${r(Y(v))}" width="${r(9.2 * k1)}" height="${r(0.5 * k1)}" fill="#f2c8a4" opacity=".6"/>`;
    for (const v of [30, 39]) for (const u of [-2, 1]) g += `<path d="M${r(X(u))} ${r(Y(v))} l0 ${r(-3 * k1)} q${r(0.5 * k1)} ${r(-0.8 * k1)} ${r(1 * k1)} 0 l0 ${r(3 * k1)} Z" fill="${DUNKEL}"/>`;
    if (!hinten) g += `<circle cx="${r(X(0))}" cy="${r(Y(23))}" r="${r(1.5 * k1)}" fill="#2a3a6a" stroke="${GOLD}" stroke-width=".3"/><path d="M${r(X(0))} ${r(Y(23))} l0 ${r(-1.1 * k1)} M${r(X(0))} ${r(Y(23))} l${r(0.8 * k1)} ${r(0.5 * k1)}" stroke="#f1c74a" stroke-width=".25"/>`;
    /* Achteckgeschoss mit Galerie und spitzen Fenstern */
    g += `<rect x="${r(X(-4.8))}" y="${r(Y(46))}" width="${r(9.6 * k1)}" height="${r(1 * k1)}" fill="#f0c49c"/>`;
    g += `<path d="M${r(X(-4))} ${r(Y(46))} L${r(X(-4))} ${r(Y(56))} L${r(X(4))} ${r(Y(56))} L${r(X(4))} ${r(Y(46))} Z" fill="${ST}"/>`;
    g += `<rect x="${r(X(-1.6))}" y="${r(Y(56))}" width="${r(3.2 * k1)}" height="${r(10 * k1)}" fill="#000" opacity=".08"/>`;
    for (const u of [-2.6, 0, 2.6]) g += `<path d="M${r(X(u - 0.6))} ${r(Y(48))} L${r(X(u - 0.6))} ${r(Y(53))} L${r(X(u))} ${r(Y(54.6))} L${r(X(u + 0.6))} ${r(Y(53))} L${r(X(u + 0.6))} ${r(Y(48))} Z" fill="${DUNKEL}"/>`;
    /* spitzer Achteckhelm (zwei Flächen sichtbar), kleine Gauben, Kugel und Kreuz */
    g += `<path d="M${r(X(-4.2))} ${r(Y(56))} L${r(X(0))} ${r(Y(78))} L${r(X(0.6))} ${r(Y(56))} Z" fill="${S.lg("helm", [[0, "#7a8c88"], [1, "#56645f"]])}"/>`;
    g += `<path d="M${r(X(0.6))} ${r(Y(56))} L${r(X(0))} ${r(Y(78))} L${r(X(4.2))} ${r(Y(56))} Z" fill="#3e4a48"/>`;
    g += `<path d="M${r(X(-4.2))} ${r(Y(56))} L${r(X(0))} ${r(Y(78))}" stroke="#ffcf9a" stroke-width=".35" opacity=".8"/>`;
    for (const v of [60, 66]) g += `<path d="M${r(X(-1.6))} ${r(Y(v))} l${r(0.6 * k1)} ${r(-1.4 * k1)} l${r(0.6 * k1)} ${r(1.4 * k1)} Z" fill="#5a6662"/>`;
    g += `<circle cx="${r(X(0))}" cy="${r(Y(78.6))}" r=".5" fill="${GOLD}"/><path d="M${r(X(0))} ${r(Y(79))} l0 -1.6 M${r(X(0) - 0.6)} ${r(Y(79) - 1.1)} l1.2 0" stroke="#e8b83a" stroke-width=".3"/>`;
    /* Abendsonne von links auf der Kante */
    g += `<rect x="${r(X(-4.5))}" y="${r(Y(56))}" width=".6" height="${r(56 * k1)}" fill="#ffd8a8" opacity=".55"/>`;
    return g;
  };
  let k = "";
  /* Langhaus- und Chordach (hinter der Nordseite des Platzes) */
  k += `<path d="M44 ${r(basis - 36 * s)} L50 ${r(basis - 47 * s)} L76 ${r(basis - 47 * s)} L80 ${r(basis - 36 * s)} Z" fill="${ZIEGEL_F}"/>`;
  k += `<path d="M78 ${r(basis - 36 * s)} L84 ${r(basis - 52 * s)} L98 ${r(basis - 52 * s)} L104 ${r(basis - 36 * s)} Z" fill="${ZIEGEL}"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${r(56 + i * 5.4)} ${r(basis - 40 * s)} l.9 -1.6 l.9 1.6 Z" fill="#7a3424"/>`;
  k += turm(36, 0.95, true) + turm(27, 1, false);
  const AX = 34, AY = 50;
  S.teil({ id: "sebalduskirche", de: "die Sebalduskirche", syl: "se-BAL-dus-kir-che", it: "la chiesa di San Sebaldo", itSyl: "KIE-sa di san se-BAL-do", en: "St. Sebald's Church",
    x: AX, y: AY, kunst: anker(AX, AY, k), tipp: "St. Sebald ist die älteste Pfarrkirche Nürnbergs. Hier liegt der heilige Sebald begraben, der Schutzpatron der Stadt." });
}

/* =====================================================================
   2 — DIE KAISERBURG auf dem Burgfelsen (Teleblick; Lupe: Sinwellturm,
       Felsen)
   ===================================================================== */
const BURG = { x: 118, y: 76, s: 0.72 };
{
  let k = "";
  /* Burgberg: Hang mit Häusern des Burgviertels und kahlen Gartenbäumen */
  const hangPfad = "M-90 14 L-86 -4 Q-80 -18 -74 -30 L-68 -40 L-60 -44 L-30 -44 L-6 -42 L14 -38 L60 -36 L76 -30 Q84 -16 90 14 Z";
  S.def(`<clipPath id="${S.id("hangclip")}"><path d="${hangPfad}"/></clipPath>`);
  k += `<path d="${hangPfad}" fill="${S.lg("hang", [[0, "#9a7a6a"], [1, "#6e5a52"]])}"/>`;
  let bm = "";
  for (let i = 0; i < 160; i++) {
    const x = -28 + rnd() * 118, y = -36 + rnd() * 48, s2 = 0.6 + rnd() * 1;
    bm += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(s2 * 1.4)}" ry="${r(s2)}" fill="${["#a68474", "#8a6c62", "#b8947e", "#7a6058"][i % 4]}" opacity=".75"/>`;
  }
  /* Dächer des Burgviertels, die den Hang hinaufsteigen */
  for (let i = 0; i < 26; i++) {
    const x = -24 + rnd() * 112, y = -26 + rnd() * 38, w = 5 + rnd() * 5, h = 3 + rnd() * 3;
    bm += `<path d="M${r(x)} ${r(y)} L${r(x + w * 0.2)} ${r(y - h)} L${r(x + w * 0.8)} ${r(y - h)} L${r(x + w)} ${r(y)} Z" fill="${rnd() < 0.5 ? "#b8644a" : "#a45a44"}"/><rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="2.4" fill="${rnd() < 0.5 ? "#e8cfb0" : "#d8b496"}"/>`;
  }
  k += `<g clip-path="url(#${S.id("hangclip")})"><g filter="url(#${S.id("weich")})">${bm}</g></g>`;
  /* der nackte Burgfelsen unter Palas und Burggarten: Bänke, Kanten, Klüfte, Schlagschatten */
  const felsRand = [[-90, 14], [-86, -4], [-80, -18], [-74, -30], [-68, -40], [-60, -44], [-46, -44.4], [-32, -44], [-30, -38], [-33, -30], [-36, -20], [-40, -10], [-44, 2], [-46, 14]];
  const felsPfad = `M${felsRand.map(([x, y]) => x + " " + y).join(" L")} Z`;
  S.def(`<clipPath id="${S.id("felsclip")}"><path d="${felsPfad}"/></clipPath>`);
  k += `<path d="${felsPfad}" fill="${S.lg("felsv", [[0, "#eeb084"], [0.5, "#d08a60"], [1, "#9a5e44"]])}"/>`;
  let fz = `<path d="${felsPfad}" fill="${S.lg("felsh", [[0, "#fff0d8", 0.25], [0.55, "#000", 0], [1, "#3a1a10", 0.35]], 0, 0, 1, 0)}"/>`;
  for (let y = -40; y < 14; y += 4 + rnd() * 2) {
    fz += `<path d="M-92 ${r(y)} l70 ${r(-0.6 + rnd() * 1.2)}" stroke="#6e3a26" stroke-width=".6" opacity=".55"/>`;
    fz += `<path d="M-92 ${r(y - 0.7)} l70 ${r(-0.6 + rnd() * 1.2)}" stroke="#ffe0bc" stroke-width=".45" opacity=".5"/>`;
  }
  for (let i = 0; i < 12; i++) { const x = -84 + rnd() * 52, y = -40 + rnd() * 40, h = 4 + rnd() * 7; fz += `<path d="M${r(x)} ${r(y)} l${r(-0.5 + rnd())} ${r(h * 0.5)} l${r(-0.5 + rnd())} ${r(h * 0.5)} l.9 0 l${r(-0.3 + rnd() * 0.6)} ${r(-h)} Z" fill="#5a2c1e" opacity=".5"/>`; }
  fz += `<path d="M-92 -44 L-28 -44 L-28 -39 Q-60 -37 -92 -40 Z" fill="#3a1a10" opacity=".3"/>`;
  k += `<g clip-path="url(#${S.id("felsclip")})">${fz}</g>`;
  k += `<path d="M-86 -4 L-80 -18 L-74 -30 L-68 -40" stroke="#ffe0bc" stroke-width="1" fill="none" opacity=".8"/>`;
  /* hohe Burgmauer mit Strebepfeilern auf der Felskante */
  const wo = (x) => -44 + (x + 68) * 0.0645, wu = (x) => wo(x) + 9;
  k += `<path d="M-68 ${r(wo(-68))} L72 ${r(wo(72))} L72 ${r(wu(72))} L-68 ${r(wu(-68))} Z" fill="${FERN}"/>`;
  for (let x = -66; x < 72; x += 2.4) k += `<line x1="${r(x)}" y1="${r(wo(x) + 0.4)}" x2="${r(x)}" y2="${r(wu(x))}" stroke="#a87a62" stroke-width=".12" opacity=".6"/>`;
  for (let y = 2; y < 9; y += 2.2) k += `<path d="M-68 ${r(wo(-68) + y)} L72 ${r(wo(72) + y)}" stroke="#a87a62" stroke-width=".15" opacity=".6"/>`;
  for (let x = -62; x < 70; x += 11) k += `<path d="M${x - 1.6} ${r(wu(x))} L${x - 1} ${r(wo(x) + 1.2)} L${x + 1} ${r(wo(x) + 1.2)} L${x + 1.6} ${r(wu(x))} Z" fill="${FERN}"/><path d="M${x} ${r(wo(x) + 1.2)} L${x + 1} ${r(wo(x) + 1.2)} L${x + 1.6} ${r(wu(x))} L${x} ${r(wu(x))} Z" fill="#8e6456" opacity=".7"/>`;
  k += `<path d="M-68 ${r(wo(-68))} L72 ${r(wo(72))}" stroke="#ffe2c0" stroke-width=".6"/>`;
  /* die Gebäude der Burg (Palas … Luginsland), 6 Einheiten höher gesetzt */
  let g = "";
  /* PALAS mit hohem Dach und Gauben */
  g += `<rect x="-62" y="-52" width="32" height="15" fill="${FERN}"/>`;
  for (let i = 0; i < 7; i++) { const x = -59.4 + i * 4.3; g += `<path d="M${r(x)} -46 L${r(x)} -48.6 Q${r(x + 0.7)} -49.6 ${r(x + 1.4)} -48.6 L${r(x + 1.4)} -46 Z" fill="${DUNKEL}"/><rect x="${r(x)}" y="-42.4" width="1.4" height="2.2" fill="${DUNKEL}"/>`; }
  g += `<rect x="-62" y="-52" width="32" height="1" fill="#f6dcc0"/>`;
  g += `<path d="M-63.4 -52 L-58.6 -66 L-34.2 -66 L-28.6 -52 Z" fill="${ZIEGEL_F}"/>`;
  for (let y = -53.4; y > -66; y -= 1.4) { const t = (-52 - y) / 14; g += `<line x1="${r(-63.4 + t * 4.8)}" y1="${r(y)}" x2="${r(-28.6 - t * 5.6)}" y2="${r(y)}" stroke="#7a3c2c" stroke-width=".12" opacity=".6"/>`; }
  for (let i = 0; i < 6; i++) g += `<path d="M${-57 + i * 4.4} -57 l1 -2.2 l1 2.2 Z" fill="#8a4a38"/><rect x="${-56.6 + i * 4.4}" y="-57" width="1.2" height=".9" fill="${DUNKEL}"/>`;
  g += `<path d="M-63.4 -52 L-58.6 -66" stroke="#ffb08a" stroke-width=".6"/>`;
  /* KAISERKAPELLE mit dem HEIDENTURM (oben Backstein) */
  g += `<rect x="-30" y="-46" width="10" height="10" fill="${FERN}"/><path d="M-30.6 -46 L-25 -50 L-19.4 -46 Z" fill="${ZIEGEL_D}"/>`;
  g += `<rect x="-26" y="-68" width="7.4" height="31" fill="${FERN}"/><rect x="-21.6" y="-68" width="3" height="31" fill="${FERN_D}" opacity=".5"/>`;
  g += `<rect x="-26" y="-68" width="7.4" height="10" fill="${S.lg("backstein", [[0, "#c8704e"], [1, "#8a4632"]], 0, 0, 1, 0)}"/>`;
  for (let y = -67; y < -58; y += 1.3) g += `<line x1="-26" y1="${r(y)}" x2="-18.6" y2="${r(y)}" stroke="#6e3022" stroke-width=".12"/>`;
  g += `<rect x="-24" y="-64" width="1.2" height="2.6" fill="${DUNKEL}"/><rect x="-21.2" y="-64" width="1.2" height="2.6" fill="${DUNKEL}"/><path d="M-23 -50 L-23 -53 Q-22.3 -54 -21.6 -53 L-21.6 -50 Z" fill="${DUNKEL}"/>`;
  g += `<path d="M-26.8 -68 L-22.3 -78 L-17.8 -68 Z" fill="${ZIEGEL_F}"/><path d="M-22.3 -78 L-17.8 -68 L-21 -68 Z" fill="#000" opacity=".15"/><line x1="-22.3" y1="-78" x2="-22.3" y2="-80.4" stroke="${DUNKEL}" stroke-width=".3"/>`;
  /* SINWELLTURM: runder Schaft aus Buckelquadern, auskragendes Geschoss, Zeltdach, Haube */
  const SW = -4;
  g += `<path d="M${SW - 4.8} -34 L${SW - 4.6} -57 L${SW + 4.6} -57 L${SW + 4.8} -34 Z" fill="${S.lg("rund", [[0, "#cc9a7a"], [0.22, "#f6caa4"], [0.55, "#d49a74"], [1, "#94664e"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 10; i++) {
    const y = -34.2 - i * 2.28, R = 4.7, off = (i % 2) * 0.32;
    for (let j = -3; j < 3; j++) {
      const a0 = Math.max(-1.45, (j + off) * 0.48), a1 = Math.min(1.45, (j + 1 + off) * 0.48);
      if (a1 <= a0) continue;
      const x0 = SW + Math.sin(a0) * R + 0.12, x1 = SW + Math.sin(a1) * R - 0.12, hell = Math.cos((a0 + a1) / 2 + 0.6);
      g += `<path d="M${r(x0)} ${r(y - 0.15)} L${r(x1)} ${r(y - 0.15)}" stroke="#7a4c38" stroke-width=".22" opacity=".55"/>`;
      g += `<path d="M${r(x0 + 0.25)} ${r(y - 1.9)} L${r(x1 - 0.25)} ${r(y - 1.9)}" stroke="#fff0d8" stroke-width=".3" opacity="${r(Math.max(0, hell) * 0.55)}"/>`;
      g += `<line x1="${r(x1 + 0.06)}" y1="${r(y - 0.2)}" x2="${r(x1 + 0.06)}" y2="${r(y - 2.1)}" stroke="#7a4c38" stroke-width=".18" opacity=".5"/>`;
    }
  }
  g += `<path d="M${SW - 0.6} -46.6 L${SW - 0.6} -48.8 Q${SW} -49.6 ${SW + 0.6} -48.8 L${SW + 0.6} -46.6 Z" fill="${DUNKEL}"/><rect x="${SW + 1.8}" y="-41" width=".9" height="2" rx=".4" fill="${DUNKEL}"/>`;
  g += `<path d="M${SW - 4.6} -57 L${SW - 6} -58.8 L${SW + 6} -58.8 L${SW + 4.6} -57 Z" fill="${FERN_D}"/>`;
  for (let j = -5; j <= 5; j += 1.25) g += `<rect x="${r(SW + j - 0.22)}" y="-58.6" width=".44" height="1.3" fill="#6e4532"/>`;
  g += `<rect x="${SW - 6}" y="-64.6" width="12" height="5.8" fill="${S.lg("geschoss", [[0, "#f2ceaa"], [0.45, "#d8aa86"], [1, "#98684e"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-4.2, -1.6, 1, 3.6]) g += `<rect x="${r(SW + x - 0.5)}" y="-63.2" width="1" height="2.4" fill="${DUNKEL}"/>`;
  g += `<rect x="${SW - 6.2}" y="-64.8" width="12.4" height=".7" fill="#f6dcc0"/>`;
  g += `<path d="M${SW - 6.8} -64.6 L${SW - 1.1} -73.6 L${SW + 1.1} -73.6 L${SW + 6.8} -64.6 Z" fill="${ZIEGEL_F}"/>`;
  g += `<path d="M${SW + 1.1} -73.6 L${SW + 6.8} -64.6 L${SW + 2.4} -64.6 Z" fill="#000" opacity=".14"/>`;
  g += `<path d="M${SW - 6.8} -64.6 L${SW - 1.1} -73.6" stroke="#ffb08a" stroke-width=".5"/>`;
  g += `<rect x="${SW - 1.3}" y="-76.2" width="2.6" height="2.6" fill="#e2d6c4"/><rect x="${SW - 0.55}" y="-75.8" width="1.1" height="1.8" rx=".5" fill="${DUNKEL}"/>`;
  g += `<path d="M${SW - 1.7} -76.2 Q${SW - 1.8} -78.2 ${SW} -79 Q${SW + 1.8} -78.2 ${SW + 1.7} -76.2 Z" fill="${S.lg("haube", [[0, "#7a8c82"], [0.35, "#b8ccc0"], [1, "#4e5e56"]], 0, 0, 1, 0)}"/>`;
  g += `<line x1="${SW}" y1="-79" x2="${SW}" y2="-82" stroke="#3a3a36" stroke-width=".35"/><circle cx="${SW}" cy="-80.2" r=".45" fill="${GOLD}"/>`;
  /* FÜNFECKTURM: zwei Mauerflächen sichtbar (die Spitze des Fünfecks zeigt zu uns), Walmhelm */
  g += `<path d="M8 -31 L8 -49 L11.4 -50.2 L11.4 -31 Z" fill="${FERN}"/><path d="M11.4 -31 L11.4 -50.2 L16.4 -49 L16.4 -31 Z" fill="${FERN_D}"/>`;
  g += `<path d="M7.4 -49 L11.4 -50.6 L17 -49 L12.4 -57.4 Z" fill="${ZIEGEL_F}"/><path d="M11.4 -50.6 L17 -49 L12.4 -57.4 Z" fill="#000" opacity=".16"/><path d="M11.4 -50.6 L12.4 -57.4" stroke="#6a2c20" stroke-width=".25"/>`;
  g += `<rect x="9.4" y="-45" width=".9" height="2" fill="${DUNKEL}"/><rect x="13.4" y="-45" width=".9" height="2" fill="${DUNKEL}"/>`;
  /* KAISERSTALLUNG: langes Haus, riesiges Dach mit Gaubenreihen */
  g += `<rect x="17" y="-38" width="41" height="9" fill="${FERN}"/>`;
  for (let i = 0; i < 9; i++) g += `<rect x="${19 + i * 4.4}" y="-35.6" width="1.4" height="2.2" fill="${DUNKEL}"/>`;
  g += `<path d="M16 -38 L22 -58 L52 -58 L59 -38 Z" fill="${ZIEGEL_F}"/>`;
  for (let y = -39.4; y > -58; y -= 1.5) { const t = (-38 - y) / 20; g += `<line x1="${r(16 + t * 6)}" y1="${r(y)}" x2="${r(59 - t * 7)}" y2="${r(y)}" stroke="#7a3c2c" stroke-width=".12" opacity=".55"/>`; }
  g += `<path d="M16 -38 L22 -58" stroke="#ffb08a" stroke-width=".5"/>`;
  [[-41.5, 9, 3.6], [-47, 7, 4.2], [-52.4, 5, 5]].forEach(([y, n, d]) => {
    const x0 = 37.5 - (n - 1) * d / 2;
    for (let i = 0; i < n; i++) g += `<path d="M${r(x0 + i * d - 0.9)} ${y} l.9 -1.6 l.9 1.6 Z" fill="#8a4a38"/><rect x="${r(x0 + i * d - 0.6)}" y="${y}" width="1.2" height=".8" fill="#2e2420"/>`;
  });
  /* LUGINSLAND: Viereckturm, Helm mit vier Ecktürmchen */
  g += `<rect x="58" y="-60" width="10" height="31" fill="${FERN_D}"/><rect x="58" y="-60" width="5" height="31" fill="${FERN}" opacity=".9"/>`;
  for (const y of [-56, -49, -42]) g += `<rect x="61.2" y="${y}" width="1.2" height="2.4" fill="${DUNKEL}"/><rect x="64.6" y="${y}" width="1.2" height="2.4" fill="${DUNKEL}"/>`;
  g += `<path d="M57.4 -60 L63 -73 L68.6 -60 Z" fill="${ZIEGEL_F}"/><path d="M63 -73 L68.6 -60 L64.6 -60 Z" fill="#000" opacity=".14"/>`;
  for (const x of [57.6, 68.4]) g += `<rect x="${x - 1.1}" y="-63.4" width="2.2" height="3.6" fill="${FERN}"/><path d="M${x - 1.4} -63.4 L${x} -67.6 L${x + 1.4} -63.4 Z" fill="${ZIEGEL_D}"/>`;
  g += `<line x1="63" y1="-73" x2="63" y2="-75" stroke="${DUNKEL}" stroke-width=".3"/>`;
  /* Fahne über dem Palas: Rot über Weiß (Stadtfarben) */
  g += `<line x1="-46" y1="-66" x2="-46" y2="-72" stroke="#3a3a36" stroke-width=".3"/><path d="M-46 -72 q1.6 .4 3.2 0 l0 1.2 q-1.6 .4 -3.2 0 Z" fill="#c8232c"/><path d="M-46 -70.8 q1.6 .4 3.2 0 l0 1.2 q-1.6 .4 -3.2 0 Z" fill="#f4f1ea"/>`;
  k += `<g transform="translate(0 -6)">${g}</g>`;
  const s = BURG.s;
  S.teil({ id: "kaiserburg", de: "die Kaiserburg", syl: "KAI-ser-burg", it: "il castello imperiale", itSyl: "ca-STEL-lo im-pe-RIA-le", en: "Imperial Castle",
    x: BURG.x, y: BURG.y, kunst: `<g transform="scale(${s})">${k}</g>`, tipp: "Auf der Kaiserburg wohnten im Mittelalter die Kaiser, wenn sie nach Nürnberg kamen.",
    zoom: { x: 50, y: 12, w: 108, h: 66 },
    unter: [
      { id: "sinwellturm", de: "der Sinwellturm", syl: "SIN-well-turm", it: "la torre Sinwell", itSyl: "TOR-re SIN-well", en: "Sinwell Tower",
        x: BURG.x + SW * s, y: BURG.y - 40 * s, kunst: flaeche(-7 * s, -43 * s, 14 * s, 43 * s), tipp: "„Sinwell“ heißt im alten Deutsch „rund“. Von oben sieht man über die ganze Stadt." },
      { id: "felsen", de: "der Felsen", syl: "FEL-sen", it: "la roccia", itSyl: "ROC-cia", en: "rock",
        x: BURG.x - 60 * s, y: BURG.y - 6 * s, kunst: flaeche(-22 * s, -36 * s, 26 * s, 34 * s), tipp: "Die Burg steht auf einem Felsen aus rotem Sandstein." },
    ] });
}

/* =====================================================================
   3 — DIE ALTSTADT: Häuser der Nord- und Westseite des Platzes
       (Lupe: das Chörlein)
   ===================================================================== */
let choerleinPunkt = null;
{
  let k = "";
  const PUTZ = ["#e8d2b0", "#dcc09a", "#e6c8a8", "#d8b49a", "#ecdcc0", "#d6bea4", "#e2cbb8"];
  const DACH = ["#b4553c", "#9a4632", "#a84e36", "#8c3e2c"];
  /* Nordseite: d ≈ 95 m, Fuß bei y ≈ 126, 2,84 E/m; Schattengrenze bei ≈ 11,7 m */
  const D = 95, s = em(D), fuss = bodenY(D), grenze = fuss - 11.7 * s;
  const haus = (x, wm, hm, dm, opt) => {
    const w = wm * s, h = hm * s, dch = dm * s, top = fuss - h;
    const f = PUTZ[Math.floor(rnd() * PUTZ.length)];
    let g = `<rect x="${r(x)}" y="${r(top)}" width="${r(w)}" height="${r(h)}" fill="${f}"/>`;
    /* Erdgeschoss aus Sandstein mit beleuchteten Läden (Arkaden) */
    g += `<rect x="${r(x)}" y="${r(fuss - 4.2 * s)}" width="${r(w)}" height="${r(4.2 * s)}" fill="${S.lg("eg", [[0, "#c88c68"], [1, "#a06a50"]])}"/>`;
    const n = Math.max(2, Math.round(wm / 3.4));
    for (let i = 0; i < n; i++) { const fx = x + (i + 0.18) * w / n, fw = w / n * 0.64; g += `<path d="M${r(fx)} ${r(fuss)} L${r(fx)} ${r(fuss - 2.4 * s)} Q${r(fx + fw / 2)} ${r(fuss - 3.6 * s)} ${r(fx + fw)} ${r(fuss - 2.4 * s)} L${r(fx + fw)} ${r(fuss)} Z" fill="${S.lg("laden", [[0, "#ffe2a0"], [1, "#e8a050"]])}"/>`; }
    if (opt.fach) {
      const fy0 = top, fy1 = fuss - 4.4 * s;
      g += `<rect x="${r(x)}" y="${r(fy0)}" width="${r(w)}" height="${r(fy1 - fy0)}" fill="#f0e2c8"/>`;
      for (let i = 0; i <= 4; i++) g += `<rect x="${r(x + i * (w - 0.6) / 4)}" y="${r(fy0)}" width=".6" height="${r(fy1 - fy0)}" fill="#5a3424"/>`;
      for (let j = 0; j <= 3; j++) g += `<rect x="${r(x)}" y="${r(fy0 + j * (fy1 - fy0) / 3 - 0.3)}" width="${r(w)}" height=".6" fill="#5a3424"/>`;
      for (let j = 0; j < 3; j++) for (const i of [0, 3]) { const xa = x + i * (w - 0.6) / 4, ya = fy0 + (j + 1) * (fy1 - fy0) / 3; g += `<path d="M${r(xa + 0.3)} ${r(ya)} L${r(xa + (w - 0.6) / 8)} ${r(ya - (fy1 - fy0) / 6)} L${r(xa + (w - 0.6) / 4)} ${r(ya)}" stroke="#5a3424" stroke-width=".45" fill="none"/>`; }
    }
    /* Fenster der Obergeschosse */
    const sp = Math.max(2, Math.round(wm / 2.6));
    for (let j = 0; j < Math.floor((hm - 4.4) / 3.2); j++) for (let i = 0; i < sp; i++) {
      const fx = x + (i + 0.3) * w / sp, fy = fuss - (5.6 + j * 3.2) * s - 1.6 * s;
      g += `<rect x="${r(fx)}" y="${r(fy)}" width="${r(0.9 * s)}" height="${r(1.5 * s)}" fill="${rnd() < 0.3 ? LICHT : "#4a4250"}"/>`;
    }
    if (opt.choerlein) {
      const cx = x + w * (opt.cl || 0.5), cy = fuss - 5.2 * s;
      g += `<path d="M${r(cx - 1 * s)} ${r(cy)} L${r(cx + 1 * s)} ${r(cy)} L${r(cx + 0.7 * s)} ${r(cy + 0.9 * s)} L${r(cx - 0.7 * s)} ${r(cy + 0.9 * s)} Z" fill="#b07a5e"/>`;
      g += `<rect x="${r(cx - 1 * s)}" y="${r(cy - 2.6 * s)}" width="${r(2 * s)}" height="${r(2.6 * s)}" fill="${S.lg("choer", [[0, "#e0a47c"], [1, "#a8705a"]], 0, 0, 1, 0)}"/>`;
      g += `<rect x="${r(cx - 0.7 * s)}" y="${r(cy - 2.2 * s)}" width="${r(0.55 * s)}" height="${r(1.5 * s)}" fill="${LICHT}"/><rect x="${r(cx + 0.15 * s)}" y="${r(cy - 2.2 * s)}" width="${r(0.55 * s)}" height="${r(1.5 * s)}" fill="${LICHT}"/>`;
      g += `<path d="M${r(cx - 1.15 * s)} ${r(cy - 2.6 * s)} L${r(cx)} ${r(cy - 4.6 * s)} L${r(cx + 1.15 * s)} ${r(cy - 2.6 * s)} Z" fill="${ZIEGEL_D}"/>`;
      if (!choerleinPunkt) choerleinPunkt = [cx, cy];
    }
    /* Dach: giebelständig mit Aufzugsgaube oder traufständig mit Zwerchhaus */
    if (opt.giebel) {
      g += `<path d="M${r(x)} ${r(top)} L${r(x + w / 2)} ${r(top - dch)} L${r(x + w)} ${r(top)} Z" fill="${f}"/>`;
      g += `<path d="M${r(x - 0.4)} ${r(top + 0.2)} L${r(x + w / 2)} ${r(top - dch)} L${r(x + w + 0.4)} ${r(top + 0.2)}" stroke="#843a2a" stroke-width="1.1" fill="none"/>`;
      g += `<rect x="${r(x + w / 2 - 0.6 * s)}" y="${r(top - dch * 0.55)}" width="${r(1.2 * s)}" height="${r(1.6 * s)}" fill="#4a4250"/><rect x="${r(x + w / 2 - 0.15 * s)}" y="${r(top - dch * 0.82)}" width="${r(0.3 * s)}" height="${r(1 * s)}" fill="#6a4a3a"/>`;
    } else {
      g += `<path d="M${r(x - 0.5)} ${r(top)} L${r(x + w * 0.16)} ${r(top - dch)} L${r(x + w * 0.84)} ${r(top - dch)} L${r(x + w + 0.5)} ${r(top)} Z" fill="${DACH[Math.floor(rnd() * DACH.length)]}"/>`;
      const zx = x + w / 2, zw = Math.min(w * 0.36, 4.4 * s);
      g += `<path d="M${r(zx - zw / 2)} ${r(top + 0.2)} L${r(zx - zw / 2)} ${r(top - dch * 0.5)} L${r(zx)} ${r(top - dch * 0.86)} L${r(zx + zw / 2)} ${r(top - dch * 0.5)} L${r(zx + zw / 2)} ${r(top + 0.2)} Z" fill="${f}"/>`;
      g += `<rect x="${r(zx - 0.6 * s)}" y="${r(top - dch * 0.45)}" width="${r(1.2 * s)}" height="${r(1.5 * s)}" fill="#4a4250"/>`;
      for (let i = 0; i < 3; i++) g += `<path d="M${r(x + w * (0.16 + i * 0.3))} ${r(top - dch * 0.3)} l1 -1.4 l1 1.4 Z" fill="#7a3424"/>`;
    }
    /* Gesimse zwischen den Geschossen und eine Tannengirlande mit Lichtern über den Läden */
    for (let j = 0; j < Math.floor((hm - 4.4) / 3.2); j++) g += `<rect x="${r(x)}" y="${r(fuss - (4.4 + j * 3.2) * s - 0.4)}" width="${r(w)}" height=".7" fill="#000" opacity=".1"/><rect x="${r(x)}" y="${r(fuss - (4.4 + j * 3.2) * s - 1)}" width="${r(w)}" height=".5" fill="#fff" opacity=".25"/>`;
    let gir = `M${r(x + 0.5)} ${r(fuss - 4.3 * s)}`;
    for (let i = 0; i < 4; i++) gir += ` q${r(w / 8)} ${r(0.8 * s)} ${r(w / 4 - 0.25)} 0`;
    g += `<path d="${gir}" stroke="#2e5a32" stroke-width="${r(0.45 * s)}" fill="none"/>`;
    for (let i = 0; i <= 8; i++) g += `<circle cx="${r(x + 0.5 + i * (w - 1) / 8)}" cy="${r(fuss - 4.3 * s + Math.abs(Math.sin(i / 2 * Math.PI)) * 0.55 * s)}" r=".35" fill="#fff0b0"/>`;
    g += `<rect x="${r(x + w - 1)}" y="${r(top)}" width="1" height="${r(h)}" fill="#000" opacity=".12"/>`;
    return g;
  };
  let nord = "";
  const plan = [[68, 13, 15, 8, { giebel: true, choerlein: true }], [0, 11, 14, 9, { giebel: false, fach: true }], [0, 12, 16, 8, { giebel: true, choerlein: true, cl: 0.3 }], [0, 14, 15, 7, { giebel: false, choerlein: true }],
    [0, 10, 14, 9, { giebel: true, fach: true }], [0, 13, 16, 8, { giebel: false, choerlein: true, cl: 0.7 }], [0, 12, 15, 9, { giebel: true, choerlein: true }], [0, 11, 14, 8, { giebel: false }]];
  let x = 68;
  for (const [, wm, hm, dm, opt] of plan) { if (x > 318) break; nord += haus(x, Math.min(wm, (320 - x) / s), hm, dm, opt); x = Math.min(320, x + wm * s + 0.2); }
  /* der Schatten der Häuser hinter uns (Sonne knapp über den Dächern) */
  /* Schattengrenze: gezackt wie die Dächer der Häuser hinter uns */
  let zack = `M68 ${r(fuss)} L68 ${r(grenze + 3)}`;
  for (let xx = 68; xx < x; xx += 9 + rnd() * 8) { const hgt = grenze + (rnd() - 0.5) * 8; zack += ` L${r(xx + 2)} ${r(hgt)} L${r(xx + 5)} ${r(hgt - 3 - rnd() * 3)} L${r(xx + 8)} ${r(hgt)}`; }
  zack += ` L${r(x)} ${r(grenze)} L${r(x)} ${r(fuss)} Z`;
  nord += `<path d="${zack}" fill="${SCHATTEN}" opacity=".26"/>`;
  /* Westseite: traufständige Häuser, Fassaden schauen nach Osten (ganz im Schatten), sie fluchten zum Augpunkt */
  let west = "";
  const Lw = -30;
  const P = (dd, v, lat = Lw) => [160 + F * lat / dd, HOR - F * (v - AUGE) / dd];
  const WPUTZ = ["#8a8498", "#7e7a90", "#948a9a", "#86808e", "#7a7488"];
  const seg = [[46, 55, 14], [55, 63, 15], [63, 72, 13], [72, 82, 15], [82, 95, 14]];
  seg.forEach(([d0, d1, hm], i) => {
    const [xa, ya0] = P(d0, 0), [, ya1] = P(d0, hm), [xb, yb0] = P(d1, 0), [, yb1] = P(d1, hm);
    const [xaR, yaR] = P(d0, hm + 5, Lw - 5), [xbR, ybR] = P(d1, hm + 5, Lw - 5);
    west += vieleck([[xa, ya0], [xa, ya1], [xb, yb1], [xb, yb0]], `fill="${WPUTZ[i % WPUTZ.length]}"`);
    west += vieleck([[xa, ya0], [xa, P(d0, 3.8)[1]], [xb, P(d1, 3.8)[1]], [xb, yb0]], `fill="#6e5a5a"`);
    west += vieleck([[xa - 0.3, ya1], [xaR, yaR], [xbR, ybR], [xb, yb1]], `fill="${["#7a3a2e", "#6a3428", "#843e30"][i % 3]}"`);
    if (xa >= 0) west += `<path d="M${r(xa - 0.3)} ${r(ya1)} L${r(xb)} ${r(yb1)}" stroke="#4a2a24" stroke-width=".6"/>`;
    /* Gauben im Dach */
    for (let t = 0.25; t < 0.9; t += 0.3) { const dd = d0 + (d1 - d0) * t, [gx, gy] = P(dd, hm + 1.4, Lw - 1.4), ss = em(dd); if (gx < 1) continue; west += `<path d="M${r(gx)} ${r(gy)} l0 ${r(-1.2 * ss)} l${r(0.5 * ss)} ${r(-0.5 * ss)} l${r(0.5 * ss)} ${r(0.5 * ss)} l0 ${r(1.2 * ss)} Z" fill="#8a8498"/><rect x="${r(gx + 0.2 * ss)}" y="${r(gy - 1 * ss)}" width="${r(0.5 * ss)}" height="${r(0.7 * ss)}" fill="${rnd() < 0.4 ? LICHT : "#3a3848"}"/>`; }
    /* Fenster (in der Flucht schmaler werdend) und beleuchtete Läden */
    for (let v = 5.2; v < hm - 1.5; v += 3.1) for (let t = 0.12; t < 0.95; t += 0.2) {
      const dd = d0 + (d1 - d0) * t, [fx, fy] = P(dd, v + 1.5), ss = em(dd);
      if (fx < 0.5) continue;
      west += `<rect x="${r(fx)}" y="${r(fy)}" width="${r(0.45 * ss)}" height="${r(1.4 * ss)}" fill="${rnd() < 0.4 ? LICHT : "#3a3848"}"/>`;
    }
    for (let t = 0.1; t < 0.95; t += 0.28) { const dd = d0 + (d1 - d0) * t, [fx, fy] = P(dd, 2.8), ss = em(dd); if (fx < 0.5) continue; west += `<rect x="${r(fx)}" y="${r(fy)}" width="${r(0.8 * ss)}" height="${r(2.5 * ss)}" fill="#ffd28a" opacity=".9"/>`; }
    if (xb >= 0) west += `<path d="M${r(xb)} ${r(yb0)} L${r(xb)} ${r(yb1)}" stroke="#5a5468" stroke-width=".5"/>`;
  });
  k += west + nord;
  const AX = 196, AY = 84;
  S.teil({ id: "altstadt", de: "die Altstadt", syl: "ALT-stadt", it: "il centro storico", itSyl: "CEN-tro STO-ri-co", en: "old town",
    x: AX, y: AY, kunst: anker(AX, AY, k), tipp: "Viele Nürnberger Häuser haben unten Sandstein, oben Putz oder Fachwerk und kleine Erker – die Chörlein.",
    zoom: { x: 60, y: 62, w: 120, h: 66 },
    unter: [
      { id: "choerlein", de: "das Chörlein", syl: "CHÖR-lein", it: "il bovindo (l'erker)", itSyl: "bo-VIN-do", en: "oriel window", x: choerleinPunkt[0], y: choerleinPunkt[1] + 1 * em(95), kunst: flaeche(-2.2 * em(95), -5.8 * em(95), 4.4 * em(95), 6 * em(95)),
        tipp: "Ein Chörlein ist ein kleiner Erker. Von dort sah man früher auf die Straße, ohne gesehen zu werden." },
    ] });
}

/* =====================================================================
   4 — DIE FRAUENKIRCHE in echter Zweipunkt-Perspektive
       (Lupe: Uhr, Männleinlaufen, Christkind, Giebel, Portal)
   u: Meter nach Norden entlang der Westfassade (0 = Südwestecke),
   v: Höhe, p: Meter nach Westen vor die Fassade (negativ = Langhaus)
   ===================================================================== */
const TH = 35 * Math.PI / 180, DC = 100, LATC = (278 - 160) * DC / F;
const P3 = (u, v, p = 0) => { const lat = LATC - u * Math.cos(TH) - p * Math.sin(TH), dep = DC + u * Math.sin(TH) - p * Math.cos(TH); return [160 + F * lat / dep, HOR - F * (v - AUGE) / dep]; };
const pfad = (pts, zu = true) => "M" + pts.map(([u, v, p]) => P3(u, v, p).map(r).join(" ")).join(" L") + (zu ? " Z" : "");
const spitz = (u0, u1, vs, vt, p = 0, n = 5) => {
  const pts = [[u0, vs, p]], w = u1 - u0, h = vt - vs;
  for (let i = 1; i <= n; i++) { const t = i / n, a = t * Math.PI / 3; pts.push([u0 + w * (1 - Math.cos(a)), vs + h * Math.sin(a) / Math.sin(Math.PI / 3), p]); }
  pts.pop(); pts.push([u0 + w / 2, vt, p]);
  for (let i = n - 1; i >= 1; i--) { const t = i / n, a = t * Math.PI / 3; pts.push([u1 - w * (1 - Math.cos(a)), vs + h * Math.sin(a) / Math.sin(Math.PI / 3), p]); }
  pts.push([u1, vs, p]);
  return pts;
};
const kreis = (uc, vc, rr, p = 0, n = 20) => Array.from({ length: n }, (_, i) => [uc + Math.cos(i / n * 2 * Math.PI) * rr, vc + Math.sin(i / n * 2 * Math.PI) * rr, p]);
let FK_TEILE = {};
{
  const ST = S.lg("kirche", [[0, "#f4d2aa"], [0.5, "#e2b890"], [1, "#c09a7a"]], 0, 0, 1, 0);
  const ST_S = "#d8aa86", ST_D = "#a88268", MASS = "#9a7258", GLAS = "#2e2c40";
  let k = "";
  /* Langhausdach (Südseite) und Südwand mit Strebepfeilern, schräg nach rechts in die Tiefe */
  k += `<path d="${pfad([[0, 15, 0], [11, 30, 0], [11, 30, -44], [0, 15, -44]])}" fill="${S.lg("fkdach", [[0, "#c86e4c"], [1, "#9a4e36"]])}"/>`;
  for (let i = 1; i < 10; i++) { const t = i / 10; k += `<path d="${pfad([[11 * t, 15 + 15 * t, 0], [11 * t, 15 + 15 * t, -44]], false)}" stroke="#7a3424" stroke-width=".18" fill="none" opacity=".6"/>`; }
  for (const p of [-12, -24, -36]) k += `<path d="${pfad([[2, 17.6, p], [2.8, 20.2, p - 0.8], [3.6, 17.6, p - 1.6]])}" fill="#8a4430"/>`;
  k += `<path d="${pfad([[0, 0, 0], [0, 15, 0], [0, 15, -44], [0, 0, -44]])}" fill="${ST_S}"/>`;
  for (const p of [-4, -14, -24, -34]) k += `<path d="${pfad(spitz(-0.01, -0.01, 3, 12, p, 1).map(() => [0, 0, 0]).slice(0, 0).concat([[0, 3, p], [0, 11, p], [0, 12.6, p - 2.4], [0, 11, p - 4.8], [0, 3, p - 4.8]]))}" fill="${GLAS}"/>`;
  for (const p of [-1, -10.5, -20.5, -30.5, -40.5]) k += `<path d="${pfad([[0, 0, p], [0, 13, p], [-1.2, 14, p - 0.3], [-1.2, 0, p - 0.3]])}" fill="${ST}"/><path d="${pfad([[0, 13, p], [0, 15.5, p - 0.4], [-1.2, 14, p - 0.3]])}" fill="${ST_D}"/>`;
  k += `<path d="${pfad([[0, 15, 0], [0, 15, -44]], false)}" stroke="#ffd8a8" stroke-width=".6" fill="none"/>`;
  /* Westfassade mit Treppengiebel */
  const stufen = 6, su = 11 / stufen, sv = 15 / stufen;
  const giebel = [[0, 0], [0, 15]];
  for (let i = 0; i < stufen; i++) giebel.push([i * su, 15 + (i + 1) * sv], [(i + 1) * su, 15 + (i + 1) * sv]);
  for (let i = stufen - 1; i >= 0; i--) giebel.push([22 - (i + 1) * su, 15 + (i + 1) * sv], [22 - i * su, 15 + (i + 1) * sv]);
  giebel.push([22, 15], [22, 0]);
  k += `<path d="${pfad(giebel.map(([u, v]) => [u, v, 0]))}" fill="${ST}"/>`;
  /* Steinlagen */
  for (let v = 2; v < 30; v += 1.6) { const hw = v <= 15 ? 11 : 11 * (1 - (v - 15) / 15); k += `<path d="${pfad([[11 - hw, v, 0], [11 + hw, v, 0]], false)}" stroke="#a88466" stroke-width=".12" fill="none" opacity=".55"/>`; }
  /* Blendmaßwerk: Bänder schlanker Spitzbögen im Giebel und neben dem Mittelteil */
  for (const [v0, v1] of [[16, 19.6], [20.4, 23.6], [24.4, 27.2]]) {
    const hw = 11 * (1 - (v1 - 15) / 15) - 0.5;
    for (let u = 11 - hw; u < 11 + hw - 0.8; u += 1.15) if (Math.abs(u + 0.4 - 11) > 2.3) k += `<path d="${pfad(spitz(u, u + 0.8, v0, v1))}" fill="${MASS}" opacity=".55"/><path d="${pfad([[u + 0.4, v0, 0], [u + 0.4, v1 - 0.4, 0]], false)}" stroke="#f0d2b0" stroke-width=".15" fill="none" opacity=".6"/>`;
    k += `<path d="${pfad([[11 - hw - 0.3, v0 - 0.3, 0], [11 + hw + 0.3, v0 - 0.3, 0]], false)}" stroke="#f6dcbc" stroke-width=".35" fill="none"/>`;
  }
  for (const [u0, u1] of [[1, 6], [16, 21]]) for (let u = u0; u < u1 - 0.9; u += 1.3) k += `<path d="${pfad(spitz(u, u + 0.9, 13, 14.8))}" fill="${MASS}" opacity=".5"/>`;
  /* große Fenster seitlich */
  for (const u of [2, 17]) k += `<path d="${pfad(spitz(u, u + 3, 3.2, 12.2))}" fill="${GLAS}"/><path d="${pfad([[u + 1.5, 3.2, 0], [u + 1.5, 11.8, 0]], false)}" stroke="#b49478" stroke-width=".3" fill="none"/><path d="${pfad([[u, 8, 0], [u + 3, 8, 0]], false)}" stroke="#b49478" stroke-width=".25" fill="none"/>`;
  /* Fialen mit Krabben auf jeder Stufe */
  for (let i = 0; i < stufen; i++) for (const side of [0, 1]) {
    const u = side ? 22 - i * su : i * su, v = 15 + (i + 1) * sv, uo = side ? -0.25 : 0.25;
    k += `<path d="${pfad([[u - 0.3 + uo, v, 0], [u + uo, v + 2.4, 0], [u + 0.3 + uo, v, 0]])}" fill="${ST}"/>`;
    for (const t of [0.35, 0.65]) k += `<path d="${pfad([[u + uo - 0.3 * (1 - t), v + 2.4 * t, 0], [u + uo - 0.55 * (1 - t), v + 2.4 * t + 0.25, 0]], false)}" stroke="#c09a7a" stroke-width=".2" fill="none"/>`;
    k += `<path d="${pfad([[side ? u - su : u, v, 0], [side ? u : u + su, v, 0]], false)}" stroke="#ffe0bc" stroke-width=".4" fill="none"/>`;
  }
  /* zwei Treppentürmchen */
  for (const uc of [6.4, 15.6]) {
    k += `<path d="${pfad([[uc - 0.7, 0, 0.8], [uc - 0.7, 26.5, 0.8], [uc + 0.7, 26.5, 0.8], [uc + 0.7, 0, 0.8]])}" fill="${ST}"/>`;
    k += `<path d="${pfad([[uc + 0.15, 0, 0.8], [uc + 0.15, 26.5, 0.8], [uc + 0.7, 26.5, 0.8], [uc + 0.7, 0, 0.8]])}" fill="${ST_D}" opacity=".5"/>`;
    for (let v = 3; v < 25; v += 4) k += `<path d="${pfad([[uc - 0.2, v, 0.8], [uc - 0.2, v + 1.2, 0.8], [uc + 0.2, v + 1.2, 0.8], [uc + 0.2, v, 0.8]])}" fill="${GLAS}"/>`;
    k += `<path d="${pfad([[uc - 0.85, 26.5, 0.8], [uc, 29.6, 0.8], [uc + 0.85, 26.5, 0.8]])}" fill="${ST}"/><path d="${pfad([[uc, 29.6, 0.8], [uc, 30.3, 0.8]], false)}" stroke="#e8c070" stroke-width=".35" fill="none"/>`;
  }
  /* VORHALLE (springt 4 m vor) mit Figurenportal; Südseite der Vorhalle sichtbar */
  k += `<path d="${pfad([[7.5, 0, 0], [7.5, 9, 0], [7.5, 9, 4], [7.5, 0, 4]])}" fill="${ST_S}"/>`;
  k += `<path d="${pfad(spitz(7.5, 7.5, 0, 0).slice(0, 0).concat([[7.5, 0.8, 0.8], [7.5, 6.2, 0.8], [7.5, 7.4, 2], [7.5, 6.2, 3.2], [7.5, 0.8, 3.2]]))}" fill="${GLAS}"/>`;
  k += `<path d="${pfad([[7.5, 0, 4], [7.5, 9, 4], [14.5, 9, 4], [14.5, 0, 4]])}" fill="${S.lg("vorhalle", [[0, "#f4dcbc"], [1, "#d0ae8e"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="${pfad(spitz(9.1, 12.9, 0, 7.4, 4, 6))}" fill="#4a3a30"/>`;
  k += `<path d="${pfad(spitz(9.6, 12.4, 0, 6.6, 4, 6))}" fill="#2a221e"/>`;
  k += `<path d="${pfad(spitz(9.6, 12.4, 4.2, 6.6, 4, 6))}" fill="#c8a882"/>`;
  k += `<path d="${pfad([[11, 4.4, 4], [11, 6, 4]], false)}" stroke="${GOLD}" stroke-width=".5" fill="none"/>`;
  k += `<path d="${pfad([[9.6, 4.2, 4], [12.4, 4.2, 4]], false)}" stroke="#e8d0b0" stroke-width=".3" fill="none"/>`;
  for (const u of [9.35, 12.65]) for (const v of [1.4, 3.4]) k += `<path d="${pfad([[u - 0.18, v, 4], [u - 0.18, v + 1.5, 4], [u + 0.18, v + 1.5, 4], [u + 0.18, v, 4]])}" fill="#c8a080"/>`;
  for (const u of [8.2, 13.8]) k += `<path d="${pfad([[u - 0.25, 4, 4], [u - 0.25, 6, 4], [u + 0.25, 6, 4], [u + 0.25, 4, 4]])}" fill="#b89070"/><path d="${pfad([[u - 0.35, 6, 4], [u, 6.8, 4], [u + 0.35, 6, 4]])}" fill="${ST}"/>`;
  k += `<path d="${pfad([[11, 0, 4], [11, 5.8, 4]], false)}" stroke="#1a1612" stroke-width=".3" fill="none"/>`;
  /* Empore mit Maßwerkbrüstung */
  k += `<path d="${pfad([[7.3, 9, 4.1], [14.7, 9, 4.1], [14.7, 10.2, 4.1], [7.3, 10.2, 4.1]])}" fill="#f0d8b8"/>`;
  for (let u = 7.8; u < 14.4; u += 0.8) k += `<path d="${pfad(kreis(u + 0.3, 9.6, 0.28, 4.1, 8))}" fill="none" stroke="#a8826a" stroke-width=".15"/>`;
  /* Michaelschor (vieleckiger Erker) mit hohen Fenstern */
  k += `<path d="${pfad([[8.5, 10.2, 0], [8.5, 16.5, 0], [9.6, 17, 1.6], [12.4, 17, 1.6], [13.5, 16.5, 0], [13.5, 10.2, 0], [12.4, 10.2, 1.6], [9.6, 10.2, 1.6]])}" fill="${ST}"/>`;
  for (const [ua, ub, pp] of [[8.7, 9.3, 0.8], [9.9, 10.7, 1.6], [11.3, 12.1, 1.6], [12.7, 13.3, 0.8]]) k += `<path d="${pfad(spitz(ua, ub, 10.8, 16, pp, 3))}" fill="${GLAS}"/>`;
  /* CHRISTKIND auf der Empore: goldenes Gewand, Krone, Locken */
  {
    const [cx, cy] = P3(11, 10.2, 3.2), s = em(DC);
    const kk = s / 2.6;
    k += `<g transform="translate(${r(cx)} ${r(cy)}) scale(${r(kk * 100) / 100})"><path d="M-1.4 0 L-.6 -3.3 L.6 -3.3 L1.4 0 Z" fill="${GOLD}"/><path d="M-.7 -3.2 L-1.7 -1.2 M.7 -3.2 L1.7 -1.2" stroke="#f1c74a" stroke-width=".45"/><circle cx="0" cy="-3.9" r=".62" fill="#f1d3b8"/><path d="M-.68 -3.8 Q-1.05 -2.6 -.95 -2.1 M.68 -3.8 Q1.05 -2.6 .95 -2.1" stroke="#e8c870" stroke-width=".38" fill="none"/><path d="M-.7 -4.4 L-.6 -5.2 L-.3 -4.7 L0 -5.4 L.3 -4.7 L.6 -5.2 L.7 -4.4 Z" fill="#ffe27a"/><circle cx="0" cy="-2.8" r="3.2" fill="#ffe8a0" opacity=".25"/></g>`;
    FK_TEILE.christkind = [cx, cy];
  }
  /* MÄNNLEINLAUFEN: Kaiser Karl IV. thront in der Mitte, die Türchen der Kurfürsten sind zu */
  k += `<path d="${pfad([[8.6, 17.4, 0.3], [13.4, 17.4, 0.3], [13.4, 19.8, 0.3], [8.6, 19.8, 0.3]])}" fill="#e0c4a2"/>`;
  k += `<path d="${pfad([[10.3, 17.6, 0.3], [11.7, 17.6, 0.3], [11.7, 19.5, 0.3], [10.3, 19.5, 0.3]])}" fill="#2a2420"/>`;
  {
    const [kx, ky] = P3(11, 17.7, 0.3), s = em(104);
    k += `<rect x="${r(kx - 0.5 * s)}" y="${r(ky - 1.2 * s)}" width="${r(1 * s)}" height="${r(1.2 * s)}" fill="${GOLD}"/><circle cx="${r(kx)}" cy="${r(ky - 1.5 * s)}" r="${r(0.32 * s)}" fill="#f1c74a"/><path d="M${r(kx - 0.3 * s)} ${r(ky - 1.8 * s)} l${r(0.15 * s)} ${r(-0.4 * s)} l${r(0.15 * s)} ${r(0.25 * s)} l${r(0.15 * s)} ${r(-0.3 * s)} l${r(0.15 * s)} ${r(0.3 * s)} l${r(0.15 * s)} ${r(-0.25 * s)} l0 ${r(0.4 * s)} Z" fill="#ffe27a"/>`;
  }
  for (const [ua, ub] of [[8.9, 10], [12, 13.1]]) k += `<path d="${pfad([[ua, 17.6, 0.3], [ub, 17.6, 0.3], [ub, 19.4, 0.3], [ua, 19.4, 0.3]])}" fill="#6a4a30"/><path d="${pfad([[(ua + ub) / 2, 17.6, 0.3], [(ua + ub) / 2, 19.4, 0.3]], false)}" stroke="#3a2a1e" stroke-width=".2" fill="none"/>`;
  /* KUNSTUHR: blau-goldenes Zifferblatt (2,5 m), Mondkugel; Zeiger auf halb vier */
  k += `<path d="${pfad([[9.3, 20, 0.2], [12.7, 20, 0.2], [12.7, 23.2, 0.2], [9.3, 23.2, 0.2]])}" fill="#e6caa8"/>`;
  k += `<path d="${pfad(kreis(11, 21.6, 1.35, 0.25))}" fill="${GOLD}"/><path d="${pfad(kreis(11, 21.6, 1.12, 0.25))}" fill="${S.rg("ziffer", [[0, "#4a6cbc"], [1, "#1c2f66"]])}"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<path d="${pfad([[11 + Math.sin(a) * 0.82, 21.6 + Math.cos(a) * 0.82, 0.25], [11 + Math.sin(a) * 1.05, 21.6 + Math.cos(a) * 1.05, 0.25]], false)}" stroke="#f1c74a" stroke-width="${i % 3 ? 0.2 : 0.35}" fill="none"/>`; }
  const zeiger = (a, l, w) => `<path d="${pfad([[11, 21.6, 0.25], [11 + Math.sin(a) * l, 21.6 + Math.cos(a) * l, 0.25]], false)}" stroke="#f6d35a" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
  k += zeiger(3.5 / 12 * 2 * Math.PI, 0.6, 0.4) + zeiger(Math.PI, 0.9, 0.28);
  k += `<path d="${pfad(kreis(11, 23.9, 0.42, 0.25, 12))}" fill="#1c2f66"/><path d="${pfad([[11, 24.32, 0.25], [11.42, 23.9, 0.25], [11, 23.48, 0.25]])}" fill="#f1c74a"/>`;
  /* Maßwerktürmchen mit Spitze, Krabben und goldener Kreuzblume */
  k += `<path d="${pfad([[10, 24.6, 0], [10, 31, 0], [12, 31, 0], [12, 24.6, 0]])}" fill="${ST}"/>`;
  for (const v of [25.2, 27.6]) k += `<path d="${pfad(spitz(10.35, 11.65, v, v + 2))}" fill="${GLAS}"/>`;
  k += `<path d="${pfad([[9.8, 31, 0], [11, 37.4, 0], [12.2, 31, 0]])}" fill="${ST}"/><path d="${pfad([[11, 37.4, 0], [12.2, 31, 0], [11.3, 31, 0]])}" fill="${ST_D}" opacity=".5"/>`;
  for (let i = 1; i < 5; i++) { const t = i / 5; k += `<path d="${pfad([[9.8 + 1.2 * t, 31 + 6.4 * t, 0], [9.5 + 1.2 * t, 31.3 + 6.4 * t, 0]], false)}" stroke="#d8b48e" stroke-width=".25" fill="none"/><path d="${pfad([[12.2 - 1.2 * t, 31 + 6.4 * t, 0], [12.5 - 1.2 * t, 31.3 + 6.4 * t, 0]], false)}" stroke="#d8b48e" stroke-width=".25" fill="none"/>`; }
  k += `<path d="${pfad(kreis(11, 37.8, 0.35, 0, 10))}" fill="${GOLD}"/><path d="${pfad([[11, 38.1, 0], [11, 39.2, 0]], false)}" stroke="#e8b83a" stroke-width=".3" fill="none"/>`;
  /* Schatten: unterhalb von ≈ 11 m liegt alles im Schatten der Häuser im Südwesten */
  k += `<path d="${pfad([[0, 0, 0], [0, 11, 0], [22, 11, 0], [22, 0, 0]])}" fill="${SCHATTEN}" opacity=".32"/>`;
  k += `<path d="${pfad([[7.5, 0, 4], [7.5, 9, 4], [14.5, 9, 4], [14.5, 0, 4]])}" fill="${SCHATTEN}" opacity=".26"/>`;
  k += `<path d="${pfad([[7.5, 0, 0], [7.5, 9, 0], [7.5, 9, 4], [7.5, 0, 4]])}" fill="${SCHATTEN}" opacity=".3"/>`;
  k += `<path d="${pfad([[0, 0, 0], [0, 11, 0], [0, 11.6, -44], [0, 0, -44]])}" fill="${SCHATTEN}" opacity=".32"/>`;
  k += `<path d="${pfad([[0, 11, 0], [22, 11, 0]], false)}" stroke="#ffd8a8" stroke-width=".5" fill="none" opacity=".5"/>`;
  const [ax, ay] = P3(3, 24, 0);
  const pt = (u, v, p) => P3(u, v, p);
  const uhr = pt(11, 21.6, 0.25), mann = pt(11, 17.4, 0.3), giebelP = pt(18, 15, 0), portal = pt(11, 0, 4);
  S.teil({ id: "frauenkirche", de: "die Frauenkirche", syl: "FRAU-en-kir-che", it: "la Frauenkirche (chiesa di Nostra Signora)", itSyl: "FRAU-en-kir-che", en: "Church of Our Lady",
    x: ax, y: ay, kunst: anker(ax, ay, k), tipp: "Die Frauenkirche steht am Hauptmarkt. Kaiser Karl IV. ließ sie im 14. Jahrhundert bauen.",
    zoom: { x: 224, y: 56, w: 34, h: 70 },
    unter: [
      { id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: uhr[0], y: uhr[1] + 4, kunst: flaeche(-4.2, -9.4, 8.4, 9.4),
        tipp: "Das Zifferblatt ist 2,5 Meter groß. Die Kugel darüber zeigt den Mond. Jetzt ist es halb vier." },
      { id: "maennleinlaufen", de: "das Männleinlaufen", syl: "MÄNN-lein-lau-fen", it: "la sfilata delle statuine", itSyl: "sfi-LA-ta del-le sta-tu-I-ne", en: "Männleinlaufen (clock figures)",
        x: mann[0], y: mann[1] + 0.4, kunst: flaeche(-7, -6.4, 14, 6.4), tipp: "Um zwölf Uhr gehen die Türchen auf: Sieben Kurfürsten ziehen um Kaiser Karl IV. herum." },
      { id: "christkind", de: "das Christkind", syl: "CHRIST-kind", it: "il Christkind (l'angelo di Natale)", itSyl: "CHRIST-kind", en: "Christkind (Christmas angel)",
        x: FK_TEILE.christkind[0], y: FK_TEILE.christkind[1] + 2, kunst: flaeche(-4.5, -10.6, 9, 10.6), tipp: "Das Nürnberger Christkind eröffnet den Christkindlesmarkt – mit einem Gedicht von der Empore der Frauenkirche." },
      { id: "giebel", de: "der Giebel", syl: "GIE-bel", it: "il frontone", itSyl: "fron-TO-ne", en: "gable", x: giebelP[0], y: giebelP[1], kunst: flaeche(-6, -26, 12, 24),
        tipp: "Der Giebel steigt in Stufen an – ein Treppengiebel mit kleinen Türmchen (Fialen)." },
      { id: "portal", de: "das Portal", syl: "por-TAL", it: "il portale", itSyl: "por-TA-le", en: "portal", x: portal[0], y: portal[1], kunst: flaeche(-5.6, -19, 11.2, 19),
        tipp: "Am Portal stehen steinerne Figuren von Heiligen und Propheten." },
    ] });
}

/* =====================================================================
   5 — DER SCHÖNE BRUNNEN (Lupe: Ring, Gitter, Figur, Becken)
       in Metern gezeichnet, Maßstab 3,6 E/m (75 m entfernt)
   ===================================================================== */
const SB = { x: 150, d: 75 };
{
  const s = em(SB.d), fuss = bodenY(SB.d);
  /* von oben gesehen (Blick 9° abwärts): Ellipsen haben ≈ 0,16 ihrer Breite */
  const flach = 0.16;
  const STEIN = S.lg("brunnenstein", [[0, "#efe0c0"], [0.45, "#ddc8a0"], [1, "#a89070"]], 0, 0, 1, 0);
  const STEIN_D = S.lg("brunnensteind", [[0, "#b8a282"], [1, "#8a7660"]], 0, 0, 1, 0);
  const achteck = (rm, y, n = 8) => Array.from({ length: n }, (_, i) => { const a = (i + 0.5) / n * 2 * Math.PI; return [Math.cos(a) * rm, y + Math.sin(a) * rm * flach]; });
  const zug = (pts) => "M" + pts.map(([x, y]) => `${r(x)} ${r(y)}`).join(" L") + " Z";
  let k = "";
  /* Gitter hinten (die Hälfte hinter dem Becken) */
  const RG = 3.9, HG = 2.6, gitter = (vorn) => {
    let g = "";
    const pts = achteck(RG, 0);
    for (let i = 0; i < 8; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % 8], mitteY = (y0 + y1) / 2;
      if ((mitteY > 0) !== vorn) continue;
      const n = Math.round(Math.hypot(x1 - x0, y1 - y0) / 0.22);
      for (let j = 0; j <= n; j++) { const t = j / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; g += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x)}" y2="${r(y - HG)}" stroke="#1e1c1a" stroke-width=".05"/>`; if (j % 3 === 1) g += `<path d="M${r(x)} ${r(y - HG)} q-.12 -.22 0 -.42 q.12 .2 0 .42" fill="${GOLD}"/>`; }
      for (const hh of [0.15, 1.2, HG]) g += `<line x1="${r(x0)}" y1="${r(y0 - hh)}" x2="${r(x1)}" y2="${r(y1 - hh)}" stroke="#1e1c1a" stroke-width="${hh === HG ? 0.1 : 0.08}"/>`;
      for (let j = 1; j < 4; j++) { const t = j / 4, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; g += `<path d="M${r(x - 0.22)} ${r(y - 1.75)} q.22 -.36 .44 0 q-.22 .36 -.44 0" fill="none" stroke="${GOLD}" stroke-width=".05"/>`; }
    }
    return g;
  };
  k += gitter(false);
  /* achteckiges Becken: Stufe und Brüstung (oben sieht man den Wasserspiegel) */
  const RB = 3.1, HB = 1.25;
  const sb = achteck(RB + 0.3, 0), sbo = achteck(RB + 0.3, -0.3);
  k += `<path d="${zug([...sb.filter((_, i) => i < 4 || true)])}" fill="#8a7a66"/>`;
  const becken = achteck(RB, -0.3), beckenO = achteck(RB, -0.3 - HB);
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8, a = becken[i], b = becken[j], ao = beckenO[i], bo = beckenO[j];
    if ((a[1] + b[1]) / 2 < -0.3) continue;
    const hell = (a[0] + b[0]) / 2 < 0;
    k += `<path d="${zug([a, b, bo, ao])}" fill="${hell ? STEIN : STEIN_D}"/>`;
    k += `<path d="M${r((a[0] * 2 + b[0]) / 3)} ${r((a[1] * 2 + b[1]) / 3 - 0.3)} L${r((a[0] * 2 + b[0]) / 3)} ${r((ao[1] * 2 + bo[1]) / 3 + 0.25)} M${r((a[0] + b[0] * 2) / 3)} ${r((a[1] + b[1] * 2) / 3 - 0.3)} L${r((a[0] + b[0] * 2) / 3)} ${r((ao[1] + bo[1] * 2) / 3 + 0.25)}" stroke="#8a7660" stroke-width=".05"/>`;
  }
  k += `<path d="${zug(beckenO)}" fill="#e8d8b8"/><path d="${zug(achteck(RB - 0.25, -0.3 - HB))}" fill="${S.lg("brunnenwasser", [[0, "#5a7a8a"], [1, "#8aa6b0"]])}"/>`;
  void sbo;
  /* die Turmspitze: helle Steinstufen, durchbrochen, farbige Figuren, goldene Fialenspitzen */
  const figur = (x, y, h, farbe) => `<path d="M${r(x - h * 0.2)} ${r(y)} L${r(x - h * 0.13)} ${r(y - h * 0.78)} L${r(x + h * 0.13)} ${r(y - h * 0.78)} L${r(x + h * 0.2)} ${r(y)} Z" fill="${farbe}"/><path d="M${r(x - h * 0.13)} ${r(y - h * 0.5)} L${r(x + h * 0.13)} ${r(y - h * 0.5)}" stroke="#f1c74a" stroke-width="${r(h * 0.05 * 100) / 100}"/><circle cx="${r(x)}" cy="${r(y - h * 0.88)}" r="${r(h * 0.12 * 100) / 100}" fill="#ecc8a0"/><path d="M${r(x - h * 0.13)} ${r(y - h * 0.96)} L${r(x - h * 0.1)} ${r(y - h * 1.08)} L${r(x)} ${r(y - h)} L${r(x + h * 0.1)} ${r(y - h * 1.08)} L${r(x + h * 0.13)} ${r(y - h * 0.96)} Z" fill="${GOLD}"/>`;
  const FARBEN = ["#b8232a", "#2f5a9a", "#2f7a4a", "#7a3a8a", "#c8701a"];
  const KERN_SONNE = S.lg("brunnenkern", [[0, "#e8c8a0"], [0.5, "#c8a47e"], [1, "#9a7c62"]], 0, 0, 1, 0);
  const STEIN_SONNE = S.lg("brunnensonne", [[0, "#ffe8c4"], [0.45, "#f2d2a6"], [1, "#c09a74"]], 0, 0, 1, 0);
  const KERN_S = S.lg("brunnenkerns", [[0, "#a49480"], [0.5, "#86786a"], [1, "#665a50"]], 0, 0, 1, 0);
  const STEIN_S = S.lg("brunnensteins", [[0, "#cfc2aa"], [0.5, "#b4a48c"], [1, "#857664"]], 0, 0, 1, 0);
  const etage = (y0, y1, hw, n, fh, sonne) => {
    const STEIN = sonne ? STEIN_SONNE : STEIN_S, KERN = sonne ? KERN_SONNE : KERN_S;
    let g = `<path d="M${r(-hw * 0.7)} ${r(y0)} L${r(-hw * 0.6)} ${r(y1)} L${r(hw * 0.6)} ${r(y1)} L${r(hw * 0.7)} ${r(y0)} Z" fill="${KERN}"/>`;
    const d = 2 * hw / n;
    for (let i = 0; i <= n; i++) {
      const x = -hw + i * d, w = i === 0 || i === n ? 0.28 : 0.2;
      g += `<rect x="${r(x - w / 2)}" y="${r(y1)}" width="${w}" height="${r(y0 - y1)}" fill="${STEIN}"/>`;
      g += `<path d="M${r(x - 0.12)} ${r(y1)} L${r(x)} ${r(y1 - (y0 - y1) * 0.4)} L${r(x + 0.12)} ${r(y1)} Z" fill="${STEIN}"/><circle cx="${r(x)}" cy="${r(y1 - (y0 - y1) * 0.4)}" r=".07" fill="${GOLD}"/>`;
    }
    for (let i = 0; i < n; i++) {
      const xa = -hw + i * d, xb = xa + d, xm = (xa + xb) / 2, ya = y1 + (y0 - y1) * 0.3;
      g += `<path d="M${r(xa + 0.1)} ${r(ya)} Q${r(xm)} ${r(y1 + 0.1)} ${r(xb - 0.1)} ${r(ya)}" stroke="${STEIN}" stroke-width=".16" fill="none"/>`;
      g += `<path d="M${r(xa + 0.06)} ${r(y1 + 0.15)} L${r(xm)} ${r(y1 - (y0 - y1) * 0.28)} L${r(xb - 0.06)} ${r(y1 + 0.15)}" stroke="${STEIN}" stroke-width=".12" fill="none"/>`;
      g += figur(xm, y0 - (y0 - y1) * 0.16, fh, FARBEN[(i + Math.round(-y0 * 3)) % FARBEN.length]);
      g += `<rect x="${r(xm - fh * 0.24)}" y="${r(y0 - (y0 - y1) * 0.16)}" width="${r(fh * 0.48)}" height=".14" fill="#c8a860"/>`;
    }
    g += `<rect x="${r(-hw - 0.18)}" y="${r(y0 - 0.25)}" width="${r(2 * hw + 0.36)}" height=".25" fill="${STEIN}"/>`;
    return g;
  };
  k += `<rect x="-1.2" y="${r(-0.3 - HB - 1.2)}" width="2.4" height="1.2" fill="${STEIN_D}"/>`;
  k += etage(-2.6, -8.2, 2.3, 4, 2.2, false) + etage(-8.3, -12.3, 1.6, 3, 1.6, false) + etage(-12.4, -15, 1, 2, 1.1, true);
  k += `<path d="M-.7 -15.1 L0 -18.4 L.7 -15.1 Z" fill="${STEIN_SONNE}"/><path d="M0 -15.1 L0 -18.4 L.7 -15.1 Z" fill="#000" opacity=".12"/>`;
  for (let i = 1; i < 5; i++) k += `<path d="M${r(-0.7 + i * 0.14)} ${r(-15.1 - i * 0.66)} l-.22 -.1 M${r(0.7 - i * 0.14)} ${r(-15.1 - i * 0.66)} l.22 -.1" stroke="#c8a860" stroke-width=".1"/>`;
  k += `<circle cx="0" cy="-18.6" r=".24" fill="${GOLD}"/><path d="M0 -18.8 L0 -19.5" stroke="#e8b83a" stroke-width=".08"/>`;
  /* Schatten: unterhalb von ≈ 13 m im Schatten, oben warmes Abendlicht */
  k += `<path d="${zug([...achteck(RB, -0.3).slice(0, 4), ...achteck(RB, -0.3 - HB).slice(0, 4).reverse()])}" fill="${SCHATTEN}" opacity=".22"/>`;
  k += `<rect x="-1.1" y="-12.45" width="2.2" height=".1" fill="#ffd8a8" opacity=".7"/>`;
  /* Gitter vorn mit dem goldenen RING auf Brusthöhe */
  k += gitter(true);
  const ringX = -1.6, ringY = 0.42 - 1.4;
  k += `<circle cx="${ringX}" cy="${r(ringY)}" r=".26" fill="none" stroke="#f6d35a" stroke-width=".11"/><path d="M${ringX - 0.2} ${r(ringY - 0.12)} a.24 .24 0 0 1 .34 -.14" stroke="#fff6c8" stroke-width=".05" fill="none"/>`;
  const fx = SB.x, fy = fuss;
  S.teil({ id: "brunnen", de: "der Schöne Brunnen", syl: "SCHÖ-ne BRUN-nen", it: "la Bella Fontana", itSyl: "BEL-la fon-TA-na", en: "Beautiful Fountain",
    x: fx, y: fy - 9 * s, kunst: `<g transform="translate(0 ${r(9 * s)}) scale(${r(s * 100) / 100})">${k}</g>`, tipp: "Der Schöne Brunnen ist 19 Meter hoch und sieht aus wie eine gotische Kirchturmspitze.",
    zoom: { x: fx - 24, y: fy - 72, w: 48, h: 76 },
    unter: [
      { id: "ring", de: "der Ring", syl: "RING", it: "l'anello", itSyl: "a-NEL-lo", en: "ring", x: fx + ringX * s, y: fy + (ringY + 0.5) * s, kunst: flaeche(-4.2, -7.6, 8.4, 8.4, 1.5),
        tipp: "Wer den goldenen Ring im Gitter dreht, hat einen Wunsch frei – sagt man in Nürnberg." },
      { id: "gitter", de: "das Gitter", syl: "GIT-ter", it: "la cancellata", itSyl: "can-cel-LA-ta", en: "railing", x: fx + 2.2 * s, y: fy + 0.65 * s, kunst: flaeche(-1.6 * s, -2.8 * s, 3.4 * s, 2.8 * s),
        tipp: "Das schmiedeeiserne Gitter um den Brunnen ist über 400 Jahre alt." },
      { id: "becken", de: "das Becken", syl: "BE-cken", it: "la vasca", itSyl: "VA-sca", en: "basin", x: fx - 2.2 * s, y: fy - 1.5 * s, kunst: flaeche(-1.3 * s, -1.6 * s, 2.6 * s, 1.6 * s),
        tipp: "Das Becken ist achteckig. Aus dem Brunnen floss früher Trinkwasser." },
      { id: "figur", de: "die Figur", syl: "fi-GUR", it: "la statua", itSyl: "STA-tu-a", en: "statue", x: fx, y: fy - 8.3 * s, kunst: flaeche(-1.6 * s, -4 * s, 3.2 * s, 4 * s),
        tipp: "Am Brunnen stehen 40 bunte Figuren: Kurfürsten, Helden und Propheten." },
    ] });
}

/* =====================================================================
   6 — DER CHRISTKINDLESMARKT: Reihen von Buden mit rot-weiß gestreiften
       Dächern, Lichterketten, viele Besucher (Lupe: Bude, Lichterkette,
       die Leute)
   ===================================================================== */
const MARKT = { bude: null, lichter: null, leute: null };
{
  let k = "";
  const reihen = [88, 74, 62, 52, 44, 38];
  const freiBrunnen = [SB.x - 20, SB.x + 20];
  const portalX = P3(11, 0, 4)[0];
  const freiPortal = [portalX - 12, portalX + 12];
  const FARBE = ["#b8232a", "#2f5a9a", "#3a6a3a", "#5a3a6a", "#8a4a2a", "#2a2a34", "#c87a2a", "#6a6a74", "#a8364a", "#3a5a7a"];
  const person = (x0, fuss, s, i) => {
    const x = Math.max(2, Math.min(316, x0));
    const h = 1.72 * s * (i % 7 === 0 ? 0.62 : 1), c = FARBE[i % FARBE.length], m = FARBE[(i * 3 + 1) % FARBE.length];
    let g = `<ellipse cx="${r(x + 0.25 * s)}" cy="${r(fuss)}" rx="${r(0.35 * s)}" ry="${r(0.08 * s)}" fill="#1e1a2a" opacity=".35"/>`;
    g += `<path d="M${r(x - 0.12 * s)} ${r(fuss)} L${r(x - 0.1 * s)} ${r(fuss - 0.45 * h)} M${r(x + 0.12 * s)} ${r(fuss)} L${r(x + 0.1 * s)} ${r(fuss - 0.45 * h)}" stroke="#24222e" stroke-width="${r(0.12 * s)}"/>`;
    g += `<path d="M${r(x - 0.24 * s)} ${r(fuss - 0.4 * h)} L${r(x - 0.2 * s)} ${r(fuss - 0.82 * h)} Q${r(x)} ${r(fuss - 0.88 * h)} ${r(x + 0.2 * s)} ${r(fuss - 0.82 * h)} L${r(x + 0.24 * s)} ${r(fuss - 0.4 * h)} Z" fill="${c}"/>`;
    g += `<rect x="${r(x - 0.14 * s)}" y="${r(fuss - 0.85 * h)}" width="${r(0.28 * s)}" height="${r(0.05 * h)}" fill="${m}"/>`;
    g += `<circle cx="${r(x)}" cy="${r(fuss - 0.92 * h)}" r="${r(0.11 * s)}" fill="${i % 3 ? "#e8c0a0" : "#3a2a22"}"/>`;
    if (i % 2) g += `<path d="M${r(x - 0.12 * s)} ${r(fuss - 0.93 * h)} Q${r(x)} ${r(fuss - 1.06 * h)} ${r(x + 0.12 * s)} ${r(fuss - 0.93 * h)} Z" fill="${m}"/>`;
    return g;
  };
  let nr = 0;
  reihen.forEach((d, ri) => {
    const s = em(d), fuss = bodenY(d), xl = Math.max(-2, 160 + F * -27 / d), bw = 3 * s, h = 2.4 * s;
    S.def(`<pattern id="${S.id("streifen" + ri)}" patternUnits="userSpaceOnUse" width="${r(0.6 * s)}" height="40"><rect width="${r(0.3 * s)}" height="40" fill="#c41f2a"/><rect x="${r(0.3 * s)}" width="${r(0.3 * s)}" height="40" fill="#f2ece4"/></pattern>`);
    /* Besucher hinter dieser Reihe (in der Gasse) */
    const gd = d + 6, gs = em(gd), gf = bodenY(gd);
    for (let x = Math.max(1, xl) + rnd() * 6; x < 318; x += (1.4 + rnd() * 2.2) * gs) {
      if (gd < 100 && x > freiPortal[0] + 26 && x < 222) continue;
      k += person(x, gf, gs, nr++);
    }
    let x = xl;
    while (x + bw < 321) {
      const inBrunnen = x + bw > freiBrunnen[0] && x < freiBrunnen[1], inPortal = d < 100 && x + bw > freiPortal[0] && x < freiPortal[1];
      if (inBrunnen || inPortal) { x += 1.5 * s; continue; }
      if (d > 80 && x > 214) break;
      const art = Math.floor(rnd() * 4);
      let g = `<rect x="${r(x)}" y="${r(fuss - h)}" width="${r(bw)}" height="${r(h)}" fill="#6a4a30"/>`;
      g += `<rect x="${r(x + 0.15 * s)}" y="${r(fuss - h + 0.35 * s)}" width="${r(bw - 0.3 * s)}" height="${r(1.15 * s)}" fill="${S.lg("budenlicht", [[0, "#ffe2a0"], [1, "#f0a050"]])}"/>`;
      for (let i = 0; i < 6; i++) g += `<circle cx="${r(x + (0.35 + i * 0.45) * s)}" cy="${r(fuss - h + (0.9 + (i % 2) * 0.25) * s)}" r="${r(0.13 * s)}" fill="${["#b8232a", "#8a5a2a", "#e8c040", "#2f5a9a", "#f4f0e8", "#3a7a3a"][(i + art) % 6]}"/>`;
      g += `<rect x="${r(x - 0.08 * s)}" y="${r(fuss - h + 1.5 * s)}" width="${r(bw + 0.16 * s)}" height="${r(0.18 * s)}" fill="#4a3220"/>`;
      g += `<rect x="${r(x)}" y="${r(fuss - h + 1.68 * s)}" width="${r(bw)}" height="${r(h - 1.68 * s)}" fill="#5a3a24"/>`;
      /* Dach von oben: vordere Schräge bis zum First */
      const yE = fuss - h, yF = HOR + F * (AUGE - 3.2) / (d + 1.3), xs = (d + 1.3) / d;
      const xF0 = 160 + (x - 0.2 * s - 160) / xs, xF1 = 160 + (x + bw + 0.2 * s - 160) / xs;
      g += `<path d="M${r(x - 0.3 * s)} ${r(yE + 0.1 * s)} L${r(xF0)} ${r(yF)} L${r(xF1)} ${r(yF)} L${r(x + bw + 0.3 * s)} ${r(yE + 0.1 * s)} Z" fill="url(#${S.id("streifen" + ri)})"/>`;
      g += `<path d="M${r(x - 0.3 * s)} ${r(yE + 0.1 * s)} L${r(xF0)} ${r(yF)} L${r(xF1)} ${r(yF)} L${r(x + bw + 0.3 * s)} ${r(yE + 0.1 * s)} Z" fill="${SCHATTEN}" opacity=".18"/>`;
      g += `<path d="M${r(x - 0.3 * s)} ${r(yE + 0.1 * s)} L${r(x + bw + 0.3 * s)} ${r(yE + 0.1 * s)}" stroke="#a81a24" stroke-width="${r(0.12 * s)}"/>`;
      /* Lichterkette an der Dachkante */
      for (let i = 0; i <= 7; i++) g += `<circle cx="${r(x + i * bw / 7)}" cy="${r(yE + 0.28 * s + Math.sin(i / 7 * Math.PI) * 0.12 * s)}" r="${r(0.08 * s)}" fill="#fff4c0"/>`;
      g += `<rect x="${r(x - 0.3 * s)}" y="${r(yE)}" width="${r(bw + 0.6 * s)}" height="${r(0.5 * s)}" fill="#ffe08a" opacity=".18" filter="url(#${S.id("glimm")})"/>`;
      /* Bratwurststand: Rauch vom Buchenholzrost */
      if (ri === 2 && !MARKT.rauch && x > 60 && x < 110) {
        MARKT.rauch = true;
        g += `<g filter="url(#${S.id("glimm")})" opacity=".55"><path d="M${r(x + bw / 2)} ${r(yF)} q${r(-1 * s)} ${r(-2 * s)} ${r(0.4 * s)} ${r(-4 * s)} q${r(1.4 * s)} ${r(-2 * s)} ${r(0.2 * s)} ${r(-4.4 * s)}" stroke="#e8e4f0" stroke-width="${r(0.9 * s)}" fill="none" stroke-linecap="round"/></g>`;
      }
      if (ri === 3 && !MARKT.bude && x > 186 && x < 230) MARKT.bude = [x + bw / 2, fuss, s];
      if (ri === 2 && !MARKT.lichter && x > 100 && x < 130) MARKT.lichter = [x + bw / 2, yE + 0.3 * s, s];
      k += g;
      x += bw + (rnd() < 0.25 ? 1.6 * s : 0.05 * s);
    }
    /* Besucher vor dieser Reihe in den freien Gassen (am Brunnen und vor dem Portal) */
    const vd = d - 4.5, vs = em(vd), vf = bodenY(vd);
    for (let x2 = freiBrunnen[0] + 2; x2 < freiBrunnen[1] - 2; x2 += (1.6 + rnd() * 1.8) * vs) if (vd > 40) k += person(x2, vf, vs, nr++);
    if (d < 100) for (let x2 = freiPortal[0] + 2; x2 < freiPortal[1] - 2; x2 += (1.8 + rnd() * 1.6) * vs) if (vd > 40) k += person(x2, vf, vs, nr++);
    if (ri === 3) MARKT.leute = [freiBrunnen[0] + 18, vf, vs];
  });
  const AX = 268, AY = 146;
  S.teil({ id: "christkindlesmarkt", de: "der Christkindlesmarkt", syl: "CHRIST-kind-les-markt", it: "il mercatino di Natale", itSyl: "mer-ca-TI-no di na-TA-le", en: "Christmas market",
    x: AX, y: AY, kunst: anker(AX, AY, k), tipp: "Auf dem Christkindlesmarkt stehen rund 160 Holzbuden mit rot-weiß gestreiften Dächern.",
    zoom: { x: 96, y: 118, w: 116, h: 62 },
    unter: [
      { id: "bude", de: "die Bude", syl: "BU-de", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "market stall", x: MARKT.bude[0], y: MARKT.bude[1], kunst: flaeche(-1.7 * MARKT.bude[2], -3.4 * MARKT.bude[2], 3.4 * MARKT.bude[2], 3.4 * MARKT.bude[2]),
        tipp: "In der Bude gibt es Lebkuchen, Spielzeug und Christbaumschmuck." },
      { id: "lichterkette", de: "die Lichterkette", syl: "LICH-ter-ket-te", it: "la catena di luci", itSyl: "ca-TE-na di LU-ci", en: "string of lights", x: MARKT.lichter[0], y: MARKT.lichter[1], kunst: flaeche(-1.8 * MARKT.lichter[2], -0.6 * MARKT.lichter[2], 3.6 * MARKT.lichter[2], 1 * MARKT.lichter[2]),
        tipp: "Am Abend leuchten an allen Buden Lichterketten." },
      { id: "leute", de: "die Leute", syl: "LEU-te", it: "la gente", itSyl: "GEN-te", en: "people", x: MARKT.leute[0], y: MARKT.leute[1], kunst: flaeche(-14, -2.2 * MARKT.leute[2], 28, 2.4 * MARKT.leute[2]),
        tipp: "Jedes Jahr kommen rund zwei Millionen Leute auf den Christkindlesmarkt." },
    ] });
}

/* =====================================================================
   7 — DAS FENSTER (Rahmen) und 8 — DIE FENSTERBANK mit den Dingen darauf
       (alles rund 1,4 m vom Auge: ≈ 190 E/m)
   ===================================================================== */
{
  const HOLZ = S.lg("rahmen", [[0, "#f4ece0"], [0.6, "#e0d4c4"], [1, "#b8ab9a"]], 0, 0, 1, 0);
  let k = `<path d="M0 0 L7 0 L7 182 L0 186 Z" fill="${HOLZ}"/><path d="M5.4 0 L7 0 L7 182 L5.4 182.8 Z" fill="#8a7e70" opacity=".6"/>`;
  k += `<rect x="1.6" y="110" width="3.6" height="1.6" rx=".6" fill="#b8a888"/><circle cx="3.4" cy="110.8" r="1" fill="#d8c8a0"/>`;
  k += `<path d="M7 0 L7 182" stroke="#ffffff" stroke-width=".4" opacity=".5"/>`;
  /* rechter Rahmen: liegt vorne (fängt keinen Tipp ab) */
  S.davor(`<path d="M314 0 L320 0 L320 186 L314 182 Z" fill="${HOLZ}"/><path d="M314 0 L315.4 0 L315.4 182.8 L314 182 Z" fill="#8a7e70" opacity=".6"/><path d="M314 0 L314 182" stroke="#ffffff" stroke-width=".4" opacity=".5"/>`);
  S.teil({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: 4, y: 70, kunst: anker(4, 70, k),
    tipp: "Aus dem Fenster des Cafés sieht man über den ganzen Markt." });
}
{
  const OBEN = 183;
  let k = `<path d="M0 ${OBEN + 3} L7 ${OBEN - 1} L314 ${OBEN - 1} L320 ${OBEN + 3} L320 200 L0 200 Z" fill="${S.lg("bank", [[0, "#c89a6a"], [0.25, "#b0804e"], [1, "#7a5432"]])}"/>`;
  for (let i = 0; i < 8; i++) k += `<path d="M${r(6 + i * 40)} 200 Q${r(24 + i * 38)} ${r(191 + (i % 3))} ${r(20 + i * 38)} ${OBEN}" stroke="#8a5e38" stroke-width=".4" fill="none" opacity=".45"/>`;
  k += `<path d="M7 ${OBEN - 1} L314 ${OBEN - 1}" stroke="#ffe6c0" stroke-width=".6" opacity=".7"/>`;
  k += `<ellipse cx="44" cy="190" rx="44" ry="7" fill="${S.rg("kerzenschein", [[0, "#ffd88a", 0.35], [1, "#ffd88a", 0]])}"/>`;
  S.teil({ id: "fensterbank", de: "die Fensterbank", syl: "FENS-ter-bank", it: "il davanzale", itSyl: "da-van-ZA-le", en: "windowsill", x: 178, y: 197, kunst: anker(178, 197, k),
    tipp: "Auf der Fensterbank steht im Advent viel Leckeres." });
}
const BANK = 189;      /* Standlinie der Dinge auf der Fensterbank */
const DS = 190;        /* Einheiten je Meter für die Dinge */
{
  /* DER ADVENTSKRANZ: Tannenzweige, rote Bänder, vier Kerzen, zwei brennen */
  const X = 44, Y = BANK;
  let k = schatten(0, 0.5, 30, 3, 0.35);
  const rx = 0.15 * DS, ry = 0.15 * DS * 0.3;
  let kranz = "";
  for (let i = 0; i < 70; i++) { const a = rnd() * 2 * Math.PI, rr = 0.8 + rnd() * 0.35, x = Math.cos(a) * rx * rr, y = -4 + Math.sin(a) * ry * rr; kranz += `<path d="M${r(x)} ${r(y)} l${r(-3 + rnd() * 6)} ${r(-1.5 + rnd() * 2)}" stroke="${rnd() < 0.5 ? "#2e5a32" : "#3e7040"}" stroke-width="${r(1.6 + rnd())}" stroke-linecap="round"/>`; }
  k += `<ellipse cx="0" cy="-4" rx="${r(rx * 1.05)}" ry="${r(ry * 1.25)}" fill="#24482a"/>` + kranz;
  for (const a of [0.3, 1.9, 3.6, 5]) k += `<circle cx="${r(Math.cos(a) * rx * 0.95)}" cy="${r(-4 + Math.sin(a) * ry)}" r="2.2" fill="${S.rg("kugel", [[0, "#ff8a7a"], [0.5, "#c8232c"], [1, "#7a0e16"]], 0.35, 0.3, 0.7)}"/>`;
  for (const a of [1.2, 4.3]) k += `<path d="M${r(Math.cos(a) * rx)} ${r(-4 + Math.sin(a) * ry)} l-3 -2 l0 4 Z M${r(Math.cos(a) * rx)} ${r(-4 + Math.sin(a) * ry)} l3 -2 l0 4 Z" fill="#c8232c"/>`;
  const kerzen = [[-15, -6.6, true], [13, -6.2, true], [-5, -9.6, false], [7, -2.4, false]].sort((a, b) => a[1] - b[1]);
  for (const [x, y, an] of kerzen) {
    const h = an ? 0.075 * DS : 0.095 * DS;
    k += `<rect x="${x - 3}" y="${r(y - h)}" width="6" height="${r(h)}" fill="${S.lg("kerze", [[0, "#e84a4a"], [0.5, "#c8232c"], [1, "#8a1218"]], 0, 0, 1, 0)}"/><ellipse cx="${x}" cy="${r(y - h)}" rx="3" ry=".9" fill="#d83a3a"/>`;
    k += `<line x1="${x}" y1="${r(y - h)}" x2="${x}" y2="${r(y - h - 1.4)}" stroke="#2a1a14" stroke-width=".35"/>`;
    if (an) k += `<path d="M${x} ${r(y - h - 1)} q-1.4 -2.2 0 -5 q1.4 2.8 0 5 Z" fill="#ffd060"/><path d="M${x} ${r(y - h - 1.2)} q-.6 -1.2 0 -2.6 q.6 1.4 0 2.6 Z" fill="#fff8e0"/><circle cx="${x}" cy="${r(y - h - 3.4)}" r="7" fill="${S.rg("flamme", [[0, "#ffe8a0", 0.55], [1, "#ffe8a0", 0]])}"/>`;
    else k += `<path d="M${x - 0.6} ${r(y - h - 1.4)} q.6 -.6 1.2 0" stroke="#2a1a14" stroke-width=".2" fill="none"/>`;
  }
  S.teil({ oben: true, id: "adventskranz", de: "der Adventskranz", syl: "AD-vents-kranz", it: "la corona dell'Avvento", itSyl: "co-RO-na del-l'av-VEN-to", en: "Advent wreath", x: X, y: Y, steht: true, kunst: k,
    tipp: "Jeden Adventssonntag zündet man eine Kerze mehr an. Zwei Kerzen brennen: Es ist der zweite Advent." });
}
{
  /* DER GLÜHWEIN in der Christkindlesmarkt-Tasse, dampfend */
  const X = 96, h = 0.105 * DS, w = 0.08 * DS;
  let k = schatten(0, 0.5, w * 0.7, 1.6, 0.35);
  k += `<path d="M${r(-w / 2)} ${r(-h)} L${r(w / 2)} ${r(-h)} L${r(w * 0.44)} 0 L${r(-w * 0.44)} 0 Z" fill="${S.lg("tasse", [[0, "#7a1a28"], [0.4, "#b8323e"], [1, "#6a1420"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="${r(-h)}" rx="${r(w / 2)}" ry="1.8" fill="#4a0e14"/><ellipse cx="0" cy="${r(-h + 0.3)}" rx="${r(w / 2 - 0.8)}" ry="1.2" fill="#6a1a20"/>`;
  k += `<path d="M${r(w / 2 - 0.4)} ${r(-h * 0.75)} q6 .4 5.4 6 q-.6 4.6 -5.6 4.2" stroke="#9a2430" stroke-width="2.2" fill="none"/>`;
  k += `<rect x="${r(-w * 0.32)}" y="${r(-h * 0.62)}" width="${r(w * 0.64)}" height="${r(h * 0.36)}" rx="1" fill="#f4e8c8"/><text x="0" y="${r(-h * 0.36)}" font-size="2.6" text-anchor="middle" fill="#7a1a28" font-family="Georgia,serif" font-weight="bold">2026</text>`;
  k += `<path d="M${r(-w * 0.4)} ${r(-h + 1)} L${r(-w * 0.36)} -1" stroke="#fff" stroke-width=".9" opacity=".25"/>`;
  k += `<g filter="url(#${S.id("glimm")})" opacity=".55"><path d="M-2 ${r(-h - 2)} q-3 -5 1 -9 q4 -4 0 -9 M3 ${r(-h - 2)} q3 -4 -1 -8" stroke="#ffffff" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`;
  S.teil({ oben: true, id: "gluehwein", de: "der Glühwein", syl: "GLÜH-wein", it: "il vin brulé", itSyl: "vin bru-LÈ", en: "mulled wine", x: X, y: BANK, steht: true, kunst: k,
    tipp: "Glühwein ist heißer Rotwein mit Zimt und Nelken. Auf dem Markt gibt es jedes Jahr eine neue Tasse." });
}
{
  /* DIE BRATWURST: „Drei im Weggla“ — drei kleine Rostbratwürste im aufgeschnittenen Brötchen, Senf darauf */
  const X = 138;
  let k = schatten(0, 0.6, 26, 2.4, 0.3);
  k += `<ellipse cx="0" cy="-2" rx="25" ry="5.6" fill="#f6f2ea"/><ellipse cx="0" cy="-2.6" rx="21" ry="4.4" fill="#ece6da"/>`;
  /* das Weggla aufgeklappt: links die untere Hälfte mit den drei Würstchen und Senf, rechts der Deckel mit der Schnittfläche nach oben */
  const BR = S.lg("weggla", [[0, "#f2c882"], [0.5, "#dc9e4e"], [1, "#a86a2a"]]);
  k += `<path d="M-21 -4 Q-22 -9 -9 -9.6 Q4 -9 3 -4 Q-9 -.6 -21 -4 Z" fill="${BR}"/>`;
  k += `<ellipse cx="-9" cy="-8.8" rx="11.6" ry="2.6" fill="#f8e4bc"/>`;
  const W1 = S.lg("wurst", [[0, "#d08e4e"], [0.5, "#a05a28"], [1, "#6a3412"]]);
  for (const [y, dx] of [[-11.6, -0.4], [-10.4, 0.5], [-9.2, -0.2]]) {
    k += `<rect x="${-19.4 + dx}" y="${y}" width="21" height="2.7" rx="1.35" fill="${W1}"/>`;
    for (let j = 0; j < 3; j++) k += `<path d="M${-15 + dx + j * 5} ${r(y + 0.4)} l1.6 1.5" stroke="#4a2008" stroke-width=".45" opacity=".7"/>`;
    k += `<path d="M${-18 + dx} ${r(y + 0.5)} l18 0" stroke="#f0b880" stroke-width=".45" opacity=".55"/>`;
  }
  k += `<path d="M-18 -11.2 q2.2 1 4.4 0 q2.2 -1 4.4 0 q2.2 1 4.4 0 q2.2 -1 4.4 0" stroke="#e8b830" stroke-width="1.1" fill="none"/>`;
  k += `<path d="M5 -3.2 Q4 -7.4 13 -8 Q22 -7.4 21 -3.2 Q13 -1 5 -3.2 Z" fill="${BR}"/><ellipse cx="13" cy="-7.4" rx="7.6" ry="2" fill="#f8e6c4"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(8 + rnd() * 10)}" cy="${r(-8 + rnd() * 1.4)}" r=".35" fill="#e8c890"/>`;
  S.teil({ oben: true, id: "bratwurst", de: "die Bratwurst", syl: "BRAT-wurst", it: "la salsiccia arrosto", itSyl: "sal-SIC-cia ar-RO-sto", en: "bratwurst", x: X, y: BANK, steht: true, kunst: k,
    tipp: "„Drei im Weggla“: drei kleine Nürnberger Rostbratwürste im Brötchen, über Buchenholz gegrillt." });
}
{
  /* DER LEBKUCHEN: offene Dose mit Elisenlebkuchen (Mandeln, heller Oblatenrand) */
  const X = 214, w = 0.2 * DS;
  let k = schatten(0, 0.6, w * 0.6, 2.4, 0.35);
  k += `<path d="M${r(-w / 2)} -12 L${r(w / 2)} -12 L${r(w / 2)} 0 Q0 3 ${r(-w / 2)} 0 Z" fill="${S.lg("dose", [[0, "#7a1418"], [0.4, "#c8303a"], [1, "#6a1014"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-w / 2)} -4 Q0 -1 ${r(w / 2)} -4 L${r(w / 2)} -2.6 Q0 .4 ${r(-w / 2)} -2.6 Z" fill="${GOLD}"/>`;
  k += `<text x="0" y="-5.4" font-size="3.4" text-anchor="middle" fill="#f6dc8a" font-family="Georgia,serif" font-style="italic" font-weight="bold">Elisen</text>`;
  k += `<ellipse cx="0" cy="-12" rx="${r(w / 2)}" ry="5" fill="#4a0a0e"/>`;
  for (const [dx, dy] of [[-9, -12.4], [8, -12.6], [-1, -14.6], [0, -10.6]]) {
    k += `<ellipse cx="${dx}" cy="${dy + 0.6}" rx="7.6" ry="2.6" fill="#f6eedc"/><ellipse cx="${dx}" cy="${dy}" rx="6.6" ry="2.2" fill="${S.rg("lebk", [[0, "#a8642e"], [1, "#5e3214"]], 0.4, 0.35, 0.7)}"/>`;
    for (const [ax, ay, rot] of [[-3, -0.4, 20], [0, -1, -10], [3, -0.2, 30], [-1, 0.8, 0], [2, 0.8, -20]]) k += `<ellipse cx="${dx + ax}" cy="${dy + ay}" rx="1.1" ry=".5" fill="#f2dcb0" transform="rotate(${rot} ${dx + ax} ${dy + ay})"/>`;
  }
  /* der Deckel lehnt hinten an der Dose */
  k = `<g transform="translate(-6 -19) rotate(-12)"><ellipse cx="0" cy="0" rx="${r(w / 2 + 1)}" ry="11" fill="${S.lg("deckel", [[0, "#d23a44"], [1, "#7a1418"]])}"/><ellipse cx="0" cy="0" rx="${r(w / 2 - 1.5)}" ry="9" fill="none" stroke="${GOLD}" stroke-width="1.2"/><ellipse cx="0" cy="0" rx="${r(w / 2 - 5)}" ry="6" fill="none" stroke="#f6dc8a" stroke-width=".5" stroke-dasharray="1.4 1"/><text x="0" y="1.6" font-size="4.4" text-anchor="middle" fill="#f6dc8a" font-family="Georgia,serif" font-style="italic" font-weight="bold">Nürnberg</text></g>` + k;
  S.teil({ oben: true, id: "lebkuchen", de: "der Lebkuchen", syl: "LEB-ku-chen", it: "il pan di zenzero", itSyl: "pan di ZEN-ze-ro", en: "gingerbread", x: X, y: BANK, steht: true, kunst: k,
    tipp: "Nürnberger Elisenlebkuchen: mit Nüssen, Honig und Gewürzen, auf einer dünnen Oblate." });
}
{
  /* DAS ZWETSCHGENMÄNNCHEN: Körper aus Dörrpflaumen, Kopf aus Walnuss, Hut und Schal */
  const X = 262, sk = 2.9;
  const y = 0;
  let k = schatten(0, 0.5, 8, 1.6, 0.35);
  let z = `<line x1="-.7" y1="${y}" x2="-.5" y2="${r(y - 2)}" stroke="#2a1a14" stroke-width=".55"/><line x1=".7" y1="${y}" x2=".5" y2="${r(y - 2)}" stroke="#2a1a14" stroke-width=".55"/>`;
  for (const [dy, rx] of [[-2.6, 1.3], [-4.2, 1.4], [-5.8, 1.2]]) z += `<ellipse cx="0" cy="${r(y + dy)}" rx="${rx}" ry=".95" fill="${S.rg("zwetschge", [[0, "#6a3a5a"], [1, "#2a0e22"]], 0.4, 0.35, 0.7)}"/>`;
  z += `<path d="M-1.2 ${r(y - 5)} q-1.2 1.2 -1 2.6 M1.2 ${r(y - 5)} q1.2 1.2 1 2.6" stroke="#2a1a14" stroke-width=".5" fill="none"/>`;
  z += `<rect x="-1.3" y="${r(y - 6.8)}" width="2.6" height=".8" rx=".3" fill="#c8232c"/><path d="M.8 ${r(y - 6.4)} l.6 1.6" stroke="#c8232c" stroke-width=".5"/>`;
  z += `<circle cx="0" cy="${r(y - 8)}" r="1.15" fill="${S.rg("walnuss", [[0, "#d8a66a"], [1, "#8a5a2a"]], 0.4, 0.35, 0.7)}"/><path d="M-.6 ${r(y - 8.6)} q.6 .5 1.2 0 M-.7 ${r(y - 7.6)} q.7 .4 1.4 0" stroke="#6a3e1a" stroke-width=".18" fill="none"/><circle cx="-.4" cy="${r(y - 8.1)}" r=".12" fill="#1a1a1a"/><circle cx=".4" cy="${r(y - 8.1)}" r=".12" fill="#1a1a1a"/>`;
  z += `<path d="M-1.6 ${r(y - 8.8)} L1.6 ${r(y - 8.8)} L.9 ${r(y - 9.3)} L.7 ${r(y - 10.8)} L-.7 ${r(y - 10.8)} L-.9 ${r(y - 9.3)} Z" fill="#2a2a2a"/>`;
  z += `<line x1="1.7" y1="${r(y - 4.6)}" x2="2.4" y2="${r(y)}" stroke="#7a5a3a" stroke-width=".25"/>`;
  k += `<g transform="scale(${sk})">${z}</g>`;
  S.teil({ oben: true, id: "zwetschgenmaennchen", de: "das Zwetschgenmännchen", syl: "ZWETSCH-gen-männ-chen", it: "l'omino di prugne", itSyl: "o-MI-no di PRU-gne", en: "prune man", x: X, y: BANK, steht: true, kunst: k,
    tipp: "Ein Männchen aus getrockneten Zwetschgen und Nüssen – auf Fränkisch „Zwetschgermännla“." });
}
{
  /* DER RAUSCHGOLDENGEL: steht auf der Fensterbank, Rock aus gefältelter Goldfolie */
  const X = 294, sk = 4.2;
  let g = `<path d="M-2.6 4.6 L-.8 -1.4 L.8 -1.4 L2.6 4.6 Z" fill="${GOLD}"/>`;
  for (let i = -3; i <= 3; i++) g += `<line x1="${r(i * 0.22)}" y1="-1.2" x2="${r(i * 0.85)}" y2="4.5" stroke="#a8770f" stroke-width=".14"/>`;
  g += `<path d="M-2.6 4.6 Q0 5.3 2.6 4.6" stroke="#fff4b0" stroke-width=".2" fill="none"/>`;
  g += `<path d="M-.6 -.8 Q-4 -4 -3.4 1.4 Z M.6 -.8 Q4 -4 3.4 1.4 Z" fill="#ffeaa8" stroke="#d8a830" stroke-width=".15"/>`;
  for (const sx of [-1, 1]) g += `<path d="M${sx * 0.8} -.6 Q${sx * 2.8} -2.6 ${sx * 2.8} .8" stroke="#d8a830" stroke-width=".1" fill="none"/>`;
  g += `<circle cx="0" cy="-2.2" r="1" fill="#f6dcc4"/><path d="M-1 -2.6 Q-1.2 -1.4 -1 -1 M1 -2.6 Q1.2 -1.4 1 -1" stroke="#f0d070" stroke-width=".35" fill="none"/>`;
  g += `<path d="M-1.1 -3 L-1 -4 L-.4 -3.4 L0 -4.2 L.4 -3.4 L1 -4 L1.1 -3 Z" fill="${GOLD}"/>`;
  g += `<path d="M-.5 -.4 L-1.4 1.6 M.5 -.4 L1.4 1.6" stroke="#f1c74a" stroke-width=".3"/>`;
  let k = schatten(0, 0.6, 10, 1.8, 0.35) + `<g transform="translate(0 ${r(-4.6 * sk)}) scale(${sk})">${g}</g>`;
  k += `<circle cx="0" cy="${r(-6 * sk)}" r="${r(4 * sk)}" fill="#ffe8a0" opacity=".12"/>`;
  S.teil({ oben: true, id: "rauschgoldengel", de: "der Rauschgoldengel", syl: "RAUSCH-gold-en-gel", it: "l'angelo d'oro", itSyl: "AN-ge-lo D'O-ro", en: "gold-foil angel", x: X, y: BANK, steht: true, kunst: k,
    tipp: "Der Rauschgoldengel aus goldener Folie ist ein typischer Nürnberger Weihnachtsschmuck." });
}
{
  /* DAS LEBKUCHENHERZ hängt an einem Band am Fenstergriff (links) */
  const X = 22, Y = 140;
  let k = `<path d="M-18.6 -29.2 Q-10 -24 -6 -16 M-18.6 -29.2 Q-2 -26 6 -16" stroke="#2f6a3a" stroke-width=".8" fill="none"/>`;
  k += `<path d="M0 14 C-22 -2 -18 -20 -6 -16 Q0 -14 0 -10 Q0 -14 6 -16 C18 -20 22 -2 0 14 Z" fill="${S.lg("herz", [[0, "#b06a32"], [0.5, "#8a4a1e"], [1, "#5e3010"]], 0, 0, 1, 1)}"/>`;
  k += `<path d="M0 10.6 C-17 -1 -14.4 -15.6 -5.4 -12.6 Q0 -11 0 -7 Q0 -11 5.4 -12.6 C14.4 -15.6 17 -1 0 10.6 Z" fill="none" stroke="#f6f0e6" stroke-width="1" stroke-dasharray="1.6 1"/>`;
  k += `<text x="0" y="-1.6" font-size="4.6" text-anchor="middle" fill="#f6f0e6" font-family="'Comic Sans MS','Segoe Print',cursive" font-weight="bold">Nürnberg</text>`;
  k += `<text x="0" y="4.2" font-size="3.4" text-anchor="middle" fill="#f6c0c8" font-family="'Comic Sans MS','Segoe Print',cursive">♥ 2026 ♥</text>`;
  for (const [x, y, c] of [[-9, -9, "#e8c040"], [9, -9, "#3a9a4a"], [0, 8, "#e85a6a"]]) k += `<circle cx="${x}" cy="${y}" r="1.3" fill="${c}"/>`;
  k += `<path d="M-12 -12 Q-8 -15 -4 -13" stroke="#fff" stroke-width=".9" opacity=".25" fill="none"/>`;
  S.teil({ oben: true, id: "lebkuchenherz", de: "das Lebkuchenherz", syl: "LEB-ku-chen-herz", it: "il cuore di pan di zenzero", itSyl: "CUO-re di pan di ZEN-ze-ro", en: "gingerbread heart", x: X, y: Y, kunst: k,
    tipp: "Ein Lebkuchenherz mit Zuckerschrift kann man sich um den Hals hängen – oder verschenken." });
}

/* Licht: kühler Schatten unten, warmer Kerzenschein vorne links, leichter Rand */
S.davor(`<rect width="320" height="200" fill="${S.lg("daemmerung", [[0, "#ffd0a0", 0.06], [0.5, "#2c3a6a", 0], [1, "#1a2040", 0.12]])}"/><rect width="320" height="200" fill="${S.rg("vignette", [[0, "#000", 0], [0.72, "#000", 0], [1, "#140c10", 0.24]], 0.5, 0.48, 0.78)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/nuernberg.js"));
console.log(aus);
