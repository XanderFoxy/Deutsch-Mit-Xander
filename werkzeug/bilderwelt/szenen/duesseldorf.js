#!/usr/bin/env node
/* =====================================================================
   DÜSSELDORF (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … mit Recherche zu
   den einzelnen Städten in Deutschland … auf Hollywood-Niveau“.

   RECHERCHE (visitduesseldorf.de, Structurae „Rheinturm“/„Schlossturm“/
   „Rheinkniebrücke“, Lichtzeitpegel-Beschreibung, Kunstpalast „Markt am
   Rhein (Burgplatz mit Schlossturm und St. Lambertus)“, Rheinkirmes-
   Seiten, Uerige/Zum Schlüssel „Brauhaus-Etikette“):
   - STANDORT: Rheinuferpromenade am Nordrand der Altstadt (an der Rampe
     zur Oberkasseler Brücke), Blick nach Süden rheinaufwärts. Echte
     Richtungen von hier: links (SSO) St. Lambertus, rechts davor am
     Burgplatz direkt am Ufer der Schlossturm; geradeaus hinter der
     Rheinbiegung („Rheinknie“) der Rheinturm am Landtag, rechts daneben
     die Gehry-Bauten im Medienhafen; rechts quer über den Strom die
     Rheinkniebrücke (Pylone am linken, Oberkasseler Ufer); ganz rechts
     gegenüber auf den Oberkasseler Rheinwiesen die Rheinkirmes mit dem
     Riesenrad (jedes Jahr im Juli). Weitwinkel-Panorama wie bei Berlin:
     die Abstände sind gestaucht, die fernen Bauten wie mit Teleobjektiv.
   - ST. LAMBERTUS: älteste Kirche der Stadt, gotische Hallenkirche aus
     Backstein (1288–1394, niederrheinische Backsteingotik), Westturm zum
     Rhein, schlanker achteckiger Schieferhelm (Turm ≈ 72 m), seit dem
     Brand 1815 VERDREHT (nasses Holz) — Legende: der Teufel hat ihn
     verdreht.
   - SCHLOSSTURM: 33 m, einziger Rest des Schlosses (Brand 1872); drei
     runde Geschosse (13. Jh.), darüber ein vieleckiges Geschoss mit
     toskanischen Säulen (Pasqualini 1552), ein Geschoss mit Rundbogen-
     fenstern (Stüler 1845), Zeltdach (1950), Wetterfahne mit einem
     Feuerspucker aus Kupfer (1957). Heute SchifffahrtMuseum.
   - RHEINTURM: 240,5 m, Betonschaft, Turmkorb mit Drehrestaurant
     (172 m) und Aussichtsebene; am Schaft der LICHTZEITPEGEL (Horst H.
     Baumann), die größte Dezimaluhr der Welt: 62 Bullaugen, von oben nach
     unten Stunden (Zehner, Einer), Minuten, Sekunden; Trennlichter
     gelb, zwei mit roter Flugwarnleuchte. Im Bild: 15:42:37 Uhr.
   - NEUER ZOLLHOF (Frank O. Gehry, 1998): drei schiefe, „tanzende“ Bauten
     — Osten weißer Putz (der höchste, knapp 50 m), Mitte Edelstahl,
     Westen roter Klinker; vorspringende Kastenfenster.
   - RHEINKNIEBRÜCKE (1969): Schrägseilbrücke in Harfenform, zwei
     114 m hohe Pylone auf der linken Rheinseite, 319 m Hauptöffnung,
     14 Seile (je Pylon 4 zum Strom, 3 nach hinten).
   - TYPISCH: Altbier im 0,25-l-„Becher“; der Köbes (Kellner im Brauhaus)
     in Blau mit langer blauer Schürze und Ledertasche bringt es auf dem
     Tablett und macht Striche auf den Bierdeckel; vor den Brauhäusern
     stehen alte Bierfässer als Stehtische. Halve Hahn = Röggelchen mit
     Käse und Senf; Düsseldorfer Löwensenf. Die Altstadt mit rund 260
     Kneipen heißt „längste Theke der Welt“. Der Radschläger ist das
     Stadtsymbol — sogar auf den Kanaldeckeln. Die Königsallee („Kö“)
     liegt östlich der Altstadt (nur der Wegweiser zeigt hin).
   Maßstab: Augenhöhe y = 116 (≈ 3,5 m über der Promenade, man steht auf
   der Rampe). Auf der Promenade gilt: Einheiten je Meter = (y − 116)/3,5.
   Licht: Sommernachmittag, Sonne im Westen (rechts).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "duesseldorf", titel: "Düsseldorf", emoji: "🍺", thema: "Deutschland", kuerzel: "dus", fassung: 854 });
const rnd = zufall(1288);
const r = B.r;
const HOR = 116, AUGE = 3.5, F = 373;          /* Brennweite der nahen Promenade (Einheiten) */
const km = (y) => (y - HOR) / AUGE;            /* Einheiten je Meter am Boden in Zeile y */
/* Punkt der nahen Welt: Tiefe d (m), seitlich lat (m, rechts +), Höhe h (m über der Promenade) */
const P = (d, lat, h = 0) => [r(112 + lat * F / d), r(HOR + (AUGE - h) * F / d)];
/* Vieleck auf das Bild (0…320 × 0…200) zuschneiden — nichts ragt aus dem Rahmen (Sutherland–Hodgman) */
function zuschnitt(pts, x0 = 0, y0 = 0, x1 = 320, y1 = 200) {
  const kanten = [[(p) => p[0] >= x0, (a, b) => [x0, a[1] + (b[1] - a[1]) * (x0 - a[0]) / (b[0] - a[0])]],
    [(p) => p[0] <= x1, (a, b) => [x1, a[1] + (b[1] - a[1]) * (x1 - a[0]) / (b[0] - a[0])]],
    [(p) => p[1] >= y0, (a, b) => [a[0] + (b[0] - a[0]) * (y0 - a[1]) / (b[1] - a[1]), y0]],
    [(p) => p[1] <= y1, (a, b) => [a[0] + (b[0] - a[0]) * (y1 - a[1]) / (b[1] - a[1]), y1]]];
  let aus = pts;
  for (const [drin, schnitt] of kanten) {
    const ein = aus; aus = [];
    for (let i = 0; i < ein.length; i++) {
      const a = ein[i], b = ein[(i + 1) % ein.length];
      if (drin(b)) { if (!drin(a)) aus.push(schnitt(a, b)); aus.push(b); } else if (drin(a)) aus.push(schnitt(a, b));
    }
    if (!aus.length) return [];
  }
  return aus.map((q) => [r(q[0]), r(q[1])]);
}
const vieleck = (pts, fill, extra = "") => { const q = zuschnitt(pts); return q.length > 2 ? `<path d="M${q.map((p) => p.join(" ")).join(" L")} Z" fill="${fill}"${extra}/>` : ""; };
/* Kreis als zugeschnittenes Vieleck (für Laub am Bildrand) */
const kreisVieleck = (cx, cy, rr, fill, extra = "") => vieleck([...Array(28)].map((_, i) => [cx + Math.cos(i * Math.PI / 14) * rr, cy + Math.sin(i * Math.PI / 14) * rr]), fill, extra);
/* Strahl vom Fluchtpunkt (seitlich lat, Höhe h) bis zum Bildrand */
const strahl = (lat, h = 0) => { const dx = lat, dy = AUGE - h; let t = 84 / dy; if (112 + dx * t < 0) t = -112 / dx; if (112 + dx * t > 320) t = 208 / dx; return [r(112 + dx * t), r(116 + dy * t)]; };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.1 .45"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".35"/></filter>`);
const BETON = S.lg("beton", [[0, "#8f9291"], [0.35, "#c9cbc7"], [0.75, "#eceee9"], [1, "#b5b8b4"]], 0, 0, 1, 0);
const BACKSTEIN = S.lg("backstein", [[0, "#7e3f2a"], [0.5, "#a65a3d"], [0.85, "#c27454"], [1, "#9a5038"]], 0, 0, 1, 0);
const SCHIEFER = S.lg("schiefer", [[0, "#2c3238"], [0.55, "#48515a"], [1, "#6c7680"]], 0, 0, 1, 0);
const PUTZ = S.lg("putz", [[0, "#b9b1a2"], [0.45, "#e6dfd0"], [0.8, "#f6f1e6"], [1, "#d6cebd"]], 0, 0, 1, 0);
const STAHL = S.lg("stahl", [[0, "#9aa3aa"], [0.45, "#e6eaed"], [0.6, "#c4cbd1"], [1, "#f4f6f7"]], 0, 0, 1, 0);
const KUPFER = S.lg("kupfer", [[0, "#5f9c86"], [1, "#3f7564"]]);
const GOLD = S.lg("gold", [[0, "#fff1a8"], [0.4, "#f1c74a"], [1, "#a8781a"]], 0, 0, 1, 1);
const HOLZ = S.lg("holz", [[0, "#5e3b1f"], [0.35, "#8f5f34"], [0.7, "#a87342"], [1, "#6b4426"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Himmel, ferne Stadt, Ufer gegenüber, Kirmes, Promenadenrand
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 2}" fill="${S.lg("himmel", [[0, "#5f95cf"], [0.55, "#a7c7e6"], [1, "#efe7d4"]])}"/>`);
S.hinten(`<circle cx="306" cy="30" r="78" fill="${S.rg("sonne", [[0, "#fff6d8", 0.75], [0.35, "#fff1c8", 0.3], [1, "#fff1c8", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[150, 20, 0.85], [236, 14, 1.05], [96, 46, 0.6], [270, 58, 0.7], [208, 72, 0.5]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".93">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 5], [-10, 1.5, 10, 4], [11, 1, 12, 4.5], [-3, -3.5, 9, 5], [6, -4.4, 7, 4.5]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `<ellipse cx="${x}" cy="${r(y + 3 * s)}" rx="${r(18 * s)}" ry="${r(2.2 * s)}" fill="#dfe5ec"/></g>`;
  }
  S.hinten(w);
}
/* ferne Stadt hinter dem Rheinknie (Unterbilk, Hafen) im Dunst */
{
  let c = "";
  const dunst = S.lg("fern", [[0, "#b9c6d2"], [1, "#a5b3c0"]]);
  let x = 116;
  while (x < 250) {
    const w = 3 + rnd() * 6, h = 2 + rnd() * 5;
    c += `<rect x="${r(x)}" y="${r(116.4 - h)}" width="${r(w + 0.3)}" height="${r(h)}" fill="${dunst}"/>`;
    x += w;
  }
  /* Stadttor (Glas, schräg) und Mannesmann-Hochhaus am Rheinknie */
  c += `<path d="M131 116 L131 96 L139 94.6 L139 116 Z" fill="${S.lg("stadttor", [[0, "#b3c3d0"], [1, "#9cafbf"]], 0, 0, 1, 0)}"/>`;
  c += `<path d="M131 96 L139 94.6" stroke="#dfe9f2" stroke-width=".5"/>`;
  for (let y = 98; y < 115; y += 1.6) c += `<line x1="131.3" y1="${r(y)}" x2="138.7" y2="${r(y - 1.2)}" stroke="#6d8396" stroke-width=".18"/>`;
  c += `<rect x="147" y="90" width="7.6" height="26" fill="${S.lg("mannesmann", [[0, "#a3b2bf"], [0.6, "#c5d0da"], [1, "#a9b7c4"]], 0, 0, 1, 0)}"/>`;
  for (let y = 91.5; y < 115; y += 1.3) c += `<line x1="147" y1="${r(y)}" x2="154.6" y2="${r(y)}" stroke="#6f8091" stroke-width=".2"/>`;
  c += `<rect x="146.6" y="89.4" width="8.4" height=".8" fill="#d7dee5"/>`;
  /* Landtag (runde, helle Bauten) am Fuß des Rheinturms */
  c += `<path d="M160 116 L160 112.4 Q166 110.6 172 112.4 L172 116 Z" fill="#e2e5e2"/><path d="M178 116 L178 112.8 Q184 111.2 190 112.8 L190 116 Z" fill="#dfe2df"/>`;
  c += `<rect x="160" y="113.4" width="12" height=".7" fill="#8fa3b3" opacity=".7"/><rect x="178" y="113.8" width="12" height=".7" fill="#8fa3b3" opacity=".7"/>`;
  S.hinten(`<g filter="url(#${S.id("dunst")})">${c}</g>`);
}
/* das Ufer gegenüber der Altstadt bis zum Rheinknie: Platanen, untere Promenade, Kasematten */
{
  let c = "";
  for (let x = 110; x < 168; x += 2.2 + rnd() * 1.6) {
    const s = 1 - (x - 110) / 110;
    c += `<circle cx="${r(x)}" cy="${r(114.4 - rnd() * 1.2)}" r="${r(1.6 + s * 1.4 + rnd() * 0.6)}" fill="${S.rg("baumfern", [[0, "#8fa86a"], [1, "#56703f"]], 0.6, 0.35, 0.7)}"/>`;
  }
  c += `<rect x="108" y="116" width="62" height="1.4" fill="#cdbfa8"/>`;
  for (let x = 112; x < 168; x += 2.1) c += `<path d="M${r(x)} 117.4 L${r(x)} 116.6 Q${r(x + 0.7)} 116 ${r(x + 1.4)} 116.6 L${r(x + 1.4)} 117.4 Z" fill="#8a7d6b" opacity=".7"/>`;
  S.hinten(c);
}
/* Oberkasseler Ufer rechts: Rheinwiesen, Häuser am Horizont, Kirmeszelte */
{
  let c = `<path d="M246 116.4 L320 115.8 L320 121.8 L246 117.2 Z" fill="${S.lg("wiese", [[0, "#9db66d"], [1, "#7f9a52"]])}"/>`;
  let x = 246;
  while (x < 320) { const w = 3 + rnd() * 5, h = 1.4 + rnd() * 2.4; c += `<rect x="${r(x)}" y="${r(116.2 - h)}" width="${r(w)}" height="${r(h)}" fill="#b4c0c8"/>`; x += w; }
  /* Kirmeszelte und Buden (rot-weiß, gelb-blau) */
  const zelt = (x, y, w, h, f1, f2) => {
    let g = `<rect x="${r(x)}" y="${r(y - h)}" width="${r(w)}" height="${r(h)}" fill="#f1ece0"/>`;
    const n = Math.max(3, Math.round(w / 1.6));
    for (let i = 0; i < n; i++) g += `<path d="M${r(x + i * w / n)} ${r(y - h)} L${r(x + (i + 0.5) * w / n)} ${r(y - h - h * 0.7)} L${r(x + (i + 1) * w / n)} ${r(y - h)} Z" fill="${i % 2 ? f2 : f1}"/>`;
    return g;
  };
  c += zelt(262, 118.4, 9, 1.8, "#d23b30", "#f6f1e6") + zelt(306, 120.6, 12, 2.2, "#2d6fb3", "#f2c62f") + zelt(254, 117.6, 6, 1.4, "#3c8f5a", "#f6f1e6");
  /* Freifallturm und Kettenkarussell der Kirmes */
  c += `<rect x="314" y="96" width="1.6" height="22" fill="#cfd4d8"/><rect x="313.4" y="104" width="2.8" height="1.4" fill="#e0a82e"/><rect x="313.6" y="95" width="2.4" height="1.4" fill="#d23b30"/>`;
  c += `<path d="M270 117.6 L270 108 M266 110.4 Q270 106.6 274 110.4" stroke="#bfc6cc" stroke-width=".5" fill="none"/>`;
  for (let i = 0; i < 6; i++) c += `<line x1="${r(266.6 + i * 1.4)}" y1="${r(110 + (i % 2) * 0.3)}" x2="${r(265.4 + i * 1.8)}" y2="113" stroke="#9aa3aa" stroke-width=".15"/><circle cx="${r(265.4 + i * 1.8)}" cy="113.2" r=".35" fill="${["#d23b30", "#f2c62f", "#2d6fb3"][i % 3]}"/>`;
  S.hinten(c);
}

/* =====================================================================
   1 — DIE MÖWE
   ===================================================================== */
{
  let k = `<path d="M-6 -1 Q-3 -3.4 0 0 Q3 -3.4 6 -1.2 Q3 -2 0 1 Q-3 -2 -6 -1 Z" fill="#fbfbf8" stroke="#8a9096" stroke-width=".25"/>`;
  k += `<path d="M-6 -1 l1.2 -.5 M6 -1.2 l-1.2 -.3" stroke="#2b2b2b" stroke-width=".5"/><ellipse cx="0" cy=".4" rx="1.2" ry=".7" fill="#fff"/><path d="M1 .3 l1 .2" stroke="#e8b83a" stroke-width=".35"/>`;
  S.teil({ oben: true, id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: 226, y: 46, kunst: `<g transform="scale(1.3)">${k}</g>` });
}

/* =====================================================================
   2 — DER RHEINTURM mit dem Lichtzeitpegel (Lupe: Uhr, Restaurant, Antenne)
   ===================================================================== */
const RT = { x: 176, y: 114.6, u: 0.45 };
{
  const u = RT.u, H = (m) => r(-m * u);
  let k = "";
  /* Schaft: unten breit, nach oben schlank; Licht von rechts */
  k += `<path d="M-3.9 0 L-1.55 ${H(157)} L1.55 ${H(157)} L3.9 0 Z" fill="${BETON}"/>`;
  for (let m = 20; m < 156; m += 14) { const w = 3.9 - (m / 157) * 2.35; k += `<line x1="${r(-w)}" y1="${H(m)}" x2="${r(w)}" y2="${H(m)}" stroke="#9a9d99" stroke-width=".12" opacity=".55"/>`; }
  /* Lichtzeitpegel: 62 Bullaugen, Nr. 1 unten. Uhrzeit 15:42:37 */
  const gruppen = [[1, 11, "gelb"], [12, 20, "s1", 7], [21, 21, "gelb"], [22, 26, "s10", 3], [27, 28, "rot"], [29, 37, "m1", 2], [38, 38, "gelb"], [39, 43, "m10", 4], [44, 45, "rot"], [46, 54, "h1", 5], [55, 55, "gelb"], [56, 57, "h10", 1], [58, 62, "gelb"]];
  const M0 = 36, M1 = 154;
  for (const [a, b, art, an] of gruppen) for (let n = a; n <= b; n++) {
    const m = M0 + (n - 1) * (M1 - M0) / 61, y = -m * u;
    let f = "#59616a", glow = "";
    if (art === "gelb") f = "#d9b84e";
    else if (art === "rot") f = (n === 28 || n === 45) ? "#e2312a" : "#d9b84e";
    else if (n - a < an) { f = "#fffdf2"; glow = `<circle cx="0" cy="${r(y)}" r=".75" fill="#fff8d0" opacity=".35"/>`; }
    k += glow + `<circle cx="0" cy="${r(y)}" r=".31" fill="${f}"/>`;
  }
  /* Turmkorb: Trichter, zwei Glasringe (Aussicht und Drehrestaurant), Dach */
  k += `<path d="M-1.55 ${H(157)} L-7.6 ${H(165)} L7.6 ${H(165)} L1.55 ${H(157)} Z" fill="${S.lg("trichter", [[0, "#8a8d8b"], [0.6, "#d6d8d4"], [1, "#a9aca9"]], 0, 0, 1, 0)}"/>`;
  for (let i = -3; i <= 3; i++) k += `<line x1="${r(i * 0.45)}" y1="${H(157.3)}" x2="${r(i * 2.15)}" y2="${H(164.8)}" stroke="#7d807e" stroke-width=".14"/>`;
  k += `<path d="M-7.6 ${H(165)} L-8.4 ${H(170)} L8.4 ${H(170)} L7.6 ${H(165)} Z" fill="${S.lg("korbglas", [[0, "#2a3a48"], [0.55, "#5d7a92"], [0.8, "#9fbad0"], [1, "#3c5163"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-8.6" y="${H(171)}" width="17.2" height="${r(1 * u + 0.15)}" fill="#e9ebe7"/>`;
  k += `<path d="M-8.4 ${H(171)} L-7.4 ${H(175.5)} L7.4 ${H(175.5)} L8.4 ${H(171)} Z" fill="${S.lg("korbglas2", [[0, "#33475a"], [0.55, "#6e8ca5"], [0.8, "#b6cde0"], [1, "#465c70"]], 0, 0, 1, 0)}"/>`;
  for (let i = -7; i <= 7; i++) k += `<line x1="${r(i * 1.07)}" y1="${H(165.2)}" x2="${r(i * 1.17)}" y2="${H(169.8)}" stroke="#c9d2d8" stroke-width=".12"/><line x1="${r(i * 1.17)}" y1="${H(171.2)}" x2="${r(i * 1.03)}" y2="${H(175.3)}" stroke="#c9d2d8" stroke-width=".12"/>`;
  k += `<path d="M-7.6 ${H(175.5)} L-2.2 ${H(180)} L2.2 ${H(180)} L7.6 ${H(175.5)} Z" fill="${S.lg("korbdach", [[0, "#9c9f9c"], [0.6, "#e3e5e1"], [1, "#b3b6b2"]], 0, 0, 1, 0)}"/>`;
  /* oberer Schaft mit Antennenplattformen und die rot-weiße Antenne */
  k += `<rect x="-1.25" y="${H(197)}" width="2.5" height="${r(17 * u)}" fill="${BETON}"/>`;
  for (const m of [185, 191]) k += `<rect x="-2.3" y="${H(m + 1)}" width="4.6" height="${r(1.2 * u)}" fill="#d4d6d2"/>`;
  k += `<rect x="-.6" y="${H(214)}" width="1.2" height="${r(17 * u)}" fill="#e7e9e6"/>`;
  for (let i = 0; i < 6; i++) { const m0 = 214 + i * 4.4, w = 0.55 - i * 0.05; k += `<rect x="${r(-w)}" y="${H(m0 + 4.4)}" width="${r(2 * w)}" height="${r(4.4 * u)}" fill="${i % 2 ? "#f2f2ef" : "#d2282e"}"/>`; }
  k += `<circle cx="0" cy="${H(240.6)}" r=".35" fill="#ff3b30"/>`;
  /* Schatten der linken Seite */
  k += `<path d="M-3.9 0 L-1.55 ${H(157)} L-.6 ${H(157)} L-2.2 0 Z" fill="#000" opacity=".1"/>`;
  S.teil({ id: "rheinturm", de: "der Rheinturm", syl: "RHEIN-turm", it: "la torre sul Reno", itSyl: "TOR-re sul RE-no", en: "Rhine Tower",
    x: RT.x, y: RT.y, kunst: k, tipp: "Der Rheinturm ist 240 Meter hoch. Oben dreht sich ein Restaurant.",
    zoom: { x: RT.x - 54, y: 12, w: 108, h: 72 },
    unter: [
      { id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: RT.x, y: RT.y - 36 * RT.u, kunst: flaeche(-2.2, -(118 * RT.u), 4.4, 118 * RT.u, 0.6),
        tipp: "Die Lichter am Schaft sind eine Uhr: oben die Stunden, dann die Minuten, unten die Sekunden." },
      { id: "restaurant", de: "das Restaurant", syl: "res-tau-RANT", it: "il ristorante", itSyl: "ri-sto-RAN-te", en: "restaurant", x: RT.x, y: RT.y - 165 * RT.u, kunst: flaeche(-8.6, -(10.6 * RT.u), 17.2, 10.6 * RT.u, 0.6),
        tipp: "Vom Restaurant oben im Rheinturm sieht man über die ganze Stadt." },
      { id: "antenne", de: "die Antenne", syl: "an-TEN-ne", it: "l'antenna", itSyl: "an-TEN-na", en: "antenna", x: RT.x, y: RT.y - 197 * RT.u, kunst: flaeche(-1.6, -(44 * RT.u), 3.2, 44 * RT.u, 0.5) },
    ] });
}

/* =====================================================================
   3 — DER MEDIENHAFEN: die drei Gehry-Bauten (Neuer Zollhof)
   ===================================================================== */
{
  let k = "";
  const kasten = (x0, x1, y0, y1, sp, ze, f, rahmen) => {
    let g = "";
    for (let y = y0; y < y1 - 0.6; y += ze) for (let x = x0; x < x1 - 0.5; x += sp) g += `<rect x="${r(x)}" y="${r(y)}" width=".7" height=".8" fill="${f}" stroke="${rahmen}" stroke-width=".12"/>`;
    return g;
  };
  /* Osten (links): weißer Putz, der höchste, geschwungene Türme */
  k += `<path d="M-15 0 L-15 -13 Q-15.4 -17.6 -12.6 -19 Q-10.4 -19.6 -9.8 -16.4 L-9.4 -18.4 Q-7.4 -20.6 -5.6 -18 L-5.4 0 Z" fill="${S.lg("gehryweiss", [[0, "#cfd2d0"], [0.6, "#f7f8f5"], [1, "#e3e6e3"]], 0, 0, 1, 0)}"/>`;
  k += kasten(-14.2, -10.2, -16, -0.4, 1.3, 1.5, "#4b5a66", "#fafafa") + kasten(-9, -5.8, -16.4, -0.4, 1.3, 1.5, "#4b5a66", "#fafafa");
  /* Mitte: Edelstahl, gewellt, spiegelt den Himmel */
  k += `<path d="M-5.4 0 L-5.6 -12 Q-4.2 -15.4 -1.6 -13.2 Q.6 -11.6 1.8 -14.4 Q3.2 -15.2 4 -12 L4.2 0 Z" fill="${S.lg("gehrystahl", [[0, "#7c8a96"], [0.3, "#e8eef3"], [0.55, "#a6b4c0"], [0.8, "#f3f6f8"], [1, "#8d9ba7"]], 0, 0, 1, 0)}"/>`;
  k += kasten(-4.6, 3.6, -11.2, -0.4, 1.4, 1.5, "#33414d", "#c8d0d6");
  /* Westen (rechts): roter Klinker mit weißen Kastenfenstern */
  k += `<path d="M4.2 0 L4 -13.4 Q5.6 -16.6 8 -15.6 L8.4 -12.8 Q10.8 -15.4 13.4 -13 L13.6 0 Z" fill="${S.lg("gehryrot", [[0, "#7f3326"], [0.6, "#b4553d"], [1, "#933f2e"]], 0, 0, 1, 0)}"/>`;
  k += kasten(4.8, 13, -12.2, -0.4, 1.4, 1.5, "#3a3330", "#f2efe8");
  S.teil({ id: "medienhafen", de: "der Medienhafen", syl: "ME-di-en-ha-fen", it: "il porto dei media", itSyl: "POR-to dei ME-dia", en: "Media Harbour",
    x: 202, y: 115.4, kunst: k, tipp: "Die drei schiefen Häuser im Medienhafen hat der Architekt Frank Gehry gebaut: weiß, silbern und rot." });
}

/* =====================================================================
   4 — DIE RHEINKNIEBRÜCKE (Schrägseilbrücke, Harfe) — Lupe: Pylon, Seil
   ===================================================================== */
const deckY = (x) => 104.2 + 0.00022 * Math.pow(x - 236, 2);
const PY = { x: 252, top: 62 };
{
  let k = "";
  const steig = 0.55;
  const seile = (px, farbe, w) => {
    let g = "";
    for (const yp of [66, 73.5, 81, 88.5]) { const x2 = px - (deckY(px) - yp) / steig; g += `<line x1="${px}" y1="${yp}" x2="${r(x2)}" y2="${r(deckY(x2))}" stroke="${farbe}" stroke-width="${w}"/>`; }
    for (const yp of [69, 79, 89]) { const x2 = px + (deckY(px) - yp) / steig; g += `<line x1="${px}" y1="${yp}" x2="${r(x2)}" y2="${r(deckY(x2))}" stroke="${farbe}" stroke-width="${w}"/>`; }
    return g;
  };
  /* hinterer Pylon und seine Seile (etwas heller, Dunst) */
  k += seile(PY.x + 1.6, "#aab4bb", 0.3);
  k += `<path d="M${PY.x + 0.9} 117 L${PY.x + 1.1} ${PY.top - 0.6} L${PY.x + 2.1} ${PY.top - 0.6} L${PY.x + 2.4} 117 Z" fill="#b9c2c8"/>`;
  /* Fahrbahn (Stahlkasten) mit Geländer und Verkehr */
  const o = [], u = [];
  for (let x = 156; x <= 320; x += 8) { o.push(`${x} ${r(deckY(x))}`); u.push(`${x} ${r(deckY(x) + 1.9)}`); }
  k += `<path d="M${o.join(" L")} L${u.reverse().join(" L")} Z" fill="${S.lg("deck", [[0, "#e4e8ea"], [0.45, "#c3cbd0"], [1, "#8e989f"]])}"/>`;
  k += `<path d="M${o.join(" L")}" stroke="#f6f8f9" stroke-width=".35" fill="none"/>`;
  for (let x = 160; x < 318; x += 1.6) k += `<line x1="${x}" y1="${r(deckY(x) - 0.7)}" x2="${x}" y2="${r(deckY(x))}" stroke="#8e989f" stroke-width=".1"/>`;
  k += `<path d="M156 ${r(deckY(156) - 0.7)} ${[...Array(21)].map((_, i) => `L${156 + i * 8} ${r(deckY(156 + i * 8) - 0.7)}`).join(" ")}" stroke="#8e989f" stroke-width=".18" fill="none"/>`;
  for (const [x, f] of [[172, "#d23b30"], [188, "#f2f2f2"], [203, "#2d6fb3"], [219, "#3a3a3a"], [236, "#e0a82e"], [268, "#f2f2f2"], [289, "#2d6fb3"], [304, "#d23b30"]])
    k += `<rect x="${x}" y="${r(deckY(x) - 1)}" width="2.2" height=".9" rx=".3" fill="${f}"/>`;
  /* Rampe am rechten Ufer (links im Bild): die Fahrbahn senkt sich zum Mannesmannufer, Stütze und Widerlager */
  k += `<path d="M156 ${r(deckY(156))} L146 111.6 L146 113.2 L156 ${r(deckY(156) + 1.9)} Z" fill="${S.lg("rampe", [[0, "#dfe3e5"], [1, "#a9b1b6"]])}"/>`;
  k += `<rect x="151" y="${r(deckY(151) + 1.2)}" width="1.6" height="${r(116.4 - deckY(151) - 1.2)}" fill="#bfc6ca"/><rect x="144.6" y="111.2" width="3" height="5.4" fill="#c9c4b8"/>`;
  /* vorderer Pylon: schlank, nach oben schmaler */
  k += `<path d="M${PY.x - 1.4} 117.2 L${PY.x - 0.9} ${PY.top} L${PY.x + 0.9} ${PY.top} L${PY.x + 1.2} 117.2 Z" fill="${S.lg("pylon", [[0, "#9aa4ab"], [0.5, "#e9edef"], [1, "#c3cad0"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${PY.x - 1.2}" y="${PY.top - 1}" width="2.4" height="1.1" rx=".3" fill="#cfd6db"/><circle cx="${PY.x}" cy="${PY.top - 1.5}" r=".35" fill="#ff3b30"/>`;
  k += seile(PY.x, "#e9eef1", 0.42);
  /* Pfeiler im Vorland */
  for (const x of [276, 300]) k += `<rect x="${x - 1}" y="${r(deckY(x) + 1.9)}" width="2" height="${r(119 - deckY(x) - 1.9)}" fill="#c3c9cd"/>`;
  S.teil({ id: "rheinkniebruecke", de: "die Rheinkniebrücke", syl: "RHEIN-knie-brü-cke", it: "il ponte Rheinknie", itSyl: "PON-te RHEIN-knie", en: "Rheinknie Bridge",
    x: 0, y: 0, kunst: k, tipp: "Die Brücke hängt an Stahlseilen. Als sie 1969 fertig war, hatte keine Schrägseilbrücke der Welt eine größere Spannweite.",
    zoom: { x: 214, y: 58, w: 76, h: 51 },
    unter: [
      { id: "pylon", de: "der Pylon", syl: "py-LON", it: "il pilone", itSyl: "pi-LO-ne", en: "pylon", x: PY.x, y: 117, kunst: flaeche(-1.8, -(117 - PY.top + 1.6), 4.6, 117 - PY.top + 1.6, 0.6),
        tipp: "Die zwei Pylone sind 114 Meter hoch." },
      { id: "seil", de: "das Seil", syl: "SEIL", it: "il cavo", itSyl: "CA-vo", en: "cable", x: PY.x - 20, y: 86, kunst: flaeche(-12, -6, 16, 10, 0.6),
        tipp: "Die Seile laufen parallel wie die Saiten einer Harfe." },
    ] });
}

/* =====================================================================
   5 — DAS RIESENRAD der Rheinkirmes (Oberkasseler Ufer)
   ===================================================================== */
{
  const R = 15, cy = -19.5;
  let k = "";
  /* Stützen (A-Bock) */
  k += `<path d="M-7.5 0 L-.6 ${cy} M7.5 0 L.6 ${cy} M-8.6 0 L-1.4 ${cy + 1} M8.6 0 L1.4 ${cy + 1}" stroke="#e8ecee" stroke-width=".7"/>`;
  k += `<path d="M-6 -6 L6 -6" stroke="#d4dadd" stroke-width=".35"/>`;
  /* Kranz und Speichen */
  k += `<circle cx="0" cy="${cy}" r="${R}" fill="none" stroke="#f4f6f7" stroke-width=".55"/><circle cx="0" cy="${cy}" r="${R - 1.1}" fill="none" stroke="#e3e8eb" stroke-width=".3"/>`;
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; k += `<line x1="0" y1="${cy}" x2="${r(Math.cos(a) * (R - 0.6))}" y2="${r(cy + Math.sin(a) * (R - 0.6))}" stroke="#e8ecee" stroke-width=".22"/>`; }
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8 + Math.PI / 16; k += `<line x1="${r(Math.cos(a) * (R - 0.6))}" y1="${r(cy + Math.sin(a) * (R - 0.6))}" x2="${r(Math.cos(a + Math.PI / 8) * (R - 0.6))}" y2="${r(cy + Math.sin(a + Math.PI / 8) * (R - 0.6))}" stroke="#dfe4e7" stroke-width=".15"/>`; }
  k += `<circle cx="0" cy="${cy}" r="1.3" fill="#c9cfd3"/><circle cx="0" cy="${cy}" r=".5" fill="#8e989f"/>`;
  /* Gondeln hängen immer senkrecht */
  const farben = ["#d23b30", "#f2c62f", "#2d6fb3", "#3c8f5a", "#e46aa0", "#f08a3c"];
  for (let i = 0; i < 16; i++) {
    const a = i * Math.PI / 8, gx = Math.cos(a) * R, gy = cy + Math.sin(a) * R;
    k += `<line x1="${r(gx)}" y1="${r(gy)}" x2="${r(gx)}" y2="${r(gy + 1)}" stroke="#bbb" stroke-width=".15"/><path d="M${r(gx - 1.1)} ${r(gy + 1)} h2.2 v1.5 q0 .6 -.6 .6 h-1 q-.6 0 -.6 -.6 Z" fill="${farben[i % 6]}"/><rect x="${r(gx - 0.8)}" y="${r(gy + 1.3)}" width="1.6" height=".5" fill="#cfe3ee" opacity=".8"/>`;
  }
  k += `<rect x="-9" y="-1.6" width="18" height="1.6" fill="#f1ece0"/><rect x="-9" y="-2.2" width="18" height=".7" fill="#d23b30"/>`;
  S.teil({ id: "riesenrad", de: "das Riesenrad", syl: "RIE-sen-rad", it: "la ruota panoramica", itSyl: "RUO-ta pa-no-RA-mi-ca", en: "Ferris wheel",
    x: 292, y: 119.4, kunst: k, tipp: "Im Juli ist auf den Rheinwiesen die Rheinkirmes — eine der größten Kirmessen in Deutschland." });
}

/* =====================================================================
   6 — DER SCHLOSSTURM am Burgplatz (Lupe: Wetterfahne, Fenster)
   ===================================================================== */
const ST = { x: 106, y: 117.6, u: 1.1 };
{
  const u = ST.u, H = (m) => r(-m * u);
  let k = "";
  /* Burgplatz-Freitreppe zum Rhein (rechts unterhalb) */
  k += `<path d="M5 0 L19 0 L21 1.6 L6.4 1.6 Z" fill="#cdc3b1"/>`;
  for (let i = 1; i < 5; i++) k += `<line x1="${r(5.3 + i * 0.3)}" y1="${r(i * 0.32)}" x2="${r(19.4 + i * 0.32)}" y2="${r(i * 0.32)}" stroke="#a69a85" stroke-width=".14"/>`;
  /* drei runde Geschosse (Zylinder) */
  const RD = 5.4;
  k += `<rect x="${-RD}" y="${H(15)}" width="${2 * RD}" height="${r(15 * u)}" fill="${PUTZ}"/>`;
  k += `<path d="M${-RD} 0 A${RD} 1.1 0 0 0 ${RD} 0 L${RD} -.6 A${RD} 1.1 0 0 1 ${-RD} -.6 Z" fill="#b2a894"/>`;
  for (const m of [5, 10]) k += `<path d="M${-RD} ${H(m)} A${RD} 1.1 0 0 0 ${RD} ${H(m)}" stroke="#b9ae98" stroke-width=".35" fill="none"/>`;
  for (const [m, xs] of [[2.2, [-2.6, 1.6]], [7, [-3.4, -0.4, 2.6]], [11.8, [-3.4, -0.4, 2.6]]]) for (const x of xs) k += `<rect x="${x}" y="${H(m + 2)}" width="1.1" height="${r(2 * u)}" fill="#3c4650"/><rect x="${x - 0.2}" y="${H(m + 2.15)}" width="1.5" height=".3" fill="#cfc5b3"/>`;
  k += `<rect x="-.9" y="${H(2.6)}" width="1.8" height="${r(2.6 * u)}" rx=".6" fill="#4a3a2a"/>`;
  /* Gesims, vieleckiges Geschoss mit toskanischen Pilastern (1552) */
  k += `<rect x="${-RD - 0.5}" y="${H(15.6)}" width="${2 * RD + 1}" height="${r(0.6 * u)}" fill="#d8cfbd"/>`;
  k += `<path d="M-4.9 ${H(15.6)} L-4.9 ${H(20.8)} L4.9 ${H(20.8)} L4.9 ${H(15.6)} Z" fill="${PUTZ}"/>`;
  k += `<rect x="-2.3" y="${H(20.8)}" width="4.6" height="${r(5.2 * u)}" fill="#fff" opacity=".18"/>`;
  for (const x of [-4.7, -2.4, 2.4, 4.7]) k += `<rect x="${r(x - 0.35)}" y="${H(20.6)}" width=".7" height="${r(4.8 * u)}" fill="#c9bfa9"/><rect x="${r(x - 0.55)}" y="${H(20.8)}" width="1.1" height=".4" fill="#b8ad96"/>`;
  for (const x of [-3.6, 0, 3.6]) k += `<rect x="${r(x - 0.5)}" y="${H(19.4)}" width="1" height="${r(2.2 * u)}" fill="#3c4650"/>`;
  /* Rundbogengeschoss (Stüler 1845) */
  k += `<rect x="-5.3" y="${H(21.6)}" width="10.6" height="${r(0.8 * u)}" fill="#d8cfbd"/>`;
  k += `<rect x="-4.6" y="${H(26.6)}" width="9.2" height="${r(5 * u)}" fill="${PUTZ}"/>`;
  for (const x of [-3, 0, 3]) k += `<path d="M${r(x - 0.75)} ${H(22.4)} L${r(x - 0.75)} ${H(25)} A.75 .75 0 0 1 ${r(x + 0.75)} ${H(25)} L${r(x + 0.75)} ${H(22.4)} Z" fill="#344049"/>`;
  k += `<rect x="-5.1" y="${H(27.2)}" width="10.2" height="${r(0.7 * u)}" fill="#e2d9c6"/>`;
  /* Zeltdach aus Schiefer, Wetterfahne mit dem Feuerspucker */
  k += `<path d="M-5.1 ${H(27.2)} L0 ${H(33)} L5.1 ${H(27.2)} Z" fill="${SCHIEFER}"/>`;
  k += `<path d="M0 ${H(33)} L1.9 ${H(27.2)}" stroke="#7b8590" stroke-width=".2"/><path d="M0 ${H(33)} L-1.9 ${H(27.2)}" stroke="#262b30" stroke-width=".2"/>`;
  k += `<line x1="0" y1="${H(33)}" x2="0" y2="${H(36.2)}" stroke="#3f4a47" stroke-width=".3"/><circle cx="0" cy="${H(33.4)}" r=".4" fill="${GOLD}"/>`;
  k += `<path d="M0 ${H(35.6)} l2.6 -.3 l.3 .9 l-2.9 .2 Z" fill="${KUPFER}"/><path d="M2.4 ${H(36)} q.6 -1 .2 -1.8 q.7 .5 .5 1.4" fill="${KUPFER}"/><path d="M2.9 ${H(36.6)} q1.4 -.4 2 .4" stroke="#f2b04a" stroke-width=".35" fill="none"/>`;
  /* Licht von rechts, Schatten links */
  k += `<rect x="${-RD}" y="${H(27)}" width="3.2" height="${r(27 * u)}" fill="#000" opacity=".08"/>`;
  S.teil({ id: "schlossturm", de: "der Schlossturm", syl: "SCHLOSS-turm", it: "la torre del castello", itSyl: "TOR-re del ca-STEL-lo", en: "castle tower",
    x: ST.x, y: ST.y, kunst: k, tipp: "Der Schlossturm ist alles, was vom Düsseldorfer Schloss übrig ist. Heute ist darin ein Schifffahrtsmuseum.",
    zoom: { x: ST.x - 18, y: ST.y - 42, w: 42, h: 28 },
    unter: [
      { id: "wetterfahne", de: "die Wetterfahne", syl: "WET-ter-fah-ne", it: "la banderuola", itSyl: "ban-de-RUO-la", en: "weather vane", x: ST.x, y: ST.y - 33 * ST.u, kunst: flaeche(-1.2, -4.2, 7, 4.6, 0.4),
        tipp: "Auf der Wetterfahne spuckt eine Figur Feuer — zur Erinnerung an den Schlossbrand von 1872." },
      { id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: ST.x, y: ST.y - 22.4 * ST.u, kunst: flaeche(-4.2, -3.2, 8.4, 3.4, 0.4) },
    ] });
}

/* =====================================================================
   7 — ST. LAMBERTUS mit dem verdrehten Turmhelm (Lupe: Turmhelm, Uhr)
   ===================================================================== */
const LB = { x: 76, y: 118, u: 1.24 };
{
  const u = LB.u, H = (m) => r(-m * u);
  let k = "";
  /* Langhaus (nach Osten = links) mit Chor; steiles Schieferdach */
  k += `<path d="M-46 0 L-46 ${H(16)} L-5 ${H(16)} L-5 0 Z" fill="${BACKSTEIN}"/>`;
  k += `<path d="M-49 ${H(16)} L-43 ${H(30)} L-6 ${H(30)} L-4.6 ${H(16)} Z" fill="${S.lg("lbdach", [[0, "#3a434b"], [1, "#5d6872"]])}"/>`;
  k += `<path d="M-43 ${H(30)} L-6 ${H(30)}" stroke="#7d8892" stroke-width=".3"/>`;
  for (let i = 0; i < 6; i++) { const y = H(18 + i * 2); k += `<line x1="${r(-48 + i * 1.3)}" y1="${y}" x2="-5.5" y2="${y}" stroke="#2a3138" stroke-width=".15" opacity=".6"/>`; }
  for (let x = -43; x < -8; x += 5.4) k += `<path d="M${r(x)} ${H(2)} L${r(x)} ${H(11.5)} Q${r(x + 1.3)} ${H(13.6)} ${r(x + 2.6)} ${H(11.5)} L${r(x + 2.6)} ${H(2)} Z" fill="#3b4048"/><line x1="${r(x + 1.3)}" y1="${H(2)}" x2="${r(x + 1.3)}" y2="${H(12.6)}" stroke="#cdbfa9" stroke-width=".2"/><rect x="${r(x + 3.4)}" y="${H(16)}" width="1" height="${r(16 * u)}" fill="#8a432e"/>`;
  /* Dachreiter auf dem First */
  k += `<rect x="-27" y="${H(32.6)}" width="1.6" height="${r(2.6 * u)}" fill="#3a434b"/><path d="M-27.4 ${H(32.6)} L-26.2 ${H(37.4)} L-25 ${H(32.6)} Z" fill="#3a434b"/><circle cx="-26.2" cy="${H(37.8)}" r=".35" fill="${GOLD}"/>`;
  /* Westturm aus Backstein: Blendbögen, Schallarkaden, Turmuhr */
  const TW = 5.6;
  k += `<rect x="${-TW}" y="${H(36)}" width="${2 * TW}" height="${r(36 * u)}" fill="${BACKSTEIN}"/>`;
  for (const m of [11, 21, 30.5]) k += `<rect x="${-TW}" y="${H(m)}" width="${2 * TW}" height=".55" fill="#d4b39a" opacity=".75"/>`;
  for (const m of [12.4, 22]) for (const x of [-3.6, -0.6, 2.4]) k += `<path d="M${x} ${H(m)} L${x} ${H(m + 5.6)} Q${r(x + 0.6)} ${H(m + 6.9)} ${r(x + 1.2)} ${H(m + 5.6)} L${r(x + 1.2)} ${H(m)} Z" fill="${m < 20 ? "#7b3b27" : "#34383f"}"/>`;
  for (const x of [-4.4, -1.6, 1.2]) k += `<path d="M${x} ${H(31)} L${x} ${H(34.2)} Q${r(x + 0.8)} ${H(35.3)} ${r(x + 1.6)} ${H(34.2)} L${r(x + 1.6)} ${H(31)} Z" fill="#2b2f35"/>`;
  /* Turmuhr: Zifferblatt mit Stunden- und Minutenzeiger (15:42) */
  const UY = 27.6 * u;
  k += `<circle cx="0" cy="${r(-UY)}" r="2.3" fill="#f4efe1" stroke="#c8a24a" stroke-width=".45"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(Math.sin(a) * 1.8)}" y1="${r(-UY - Math.cos(a) * 1.8)}" x2="${r(Math.sin(a) * 2.1)}" y2="${r(-UY - Math.cos(a) * 2.1)}" stroke="#3a2c1c" stroke-width=".18"/>`; }
  const ah = (3 + 42 / 60) * Math.PI / 6, am = 42 * Math.PI / 30;
  k += `<line x1="0" y1="${r(-UY)}" x2="${r(Math.sin(ah) * 1.2)}" y2="${r(-UY - Math.cos(ah) * 1.2)}" stroke="#222" stroke-width=".3"/><line x1="0" y1="${r(-UY)}" x2="${r(Math.sin(am) * 1.8)}" y2="${r(-UY - Math.cos(am) * 1.8)}" stroke="#222" stroke-width=".2"/>`;
  k += `<rect x="${-TW - 0.4}" y="${H(36.4)}" width="${2 * TW + 0.8}" height="1" fill="#d9c7ad"/>`;
  k += `<rect x="${TW - 2.4}" y="${H(36)}" width="2.4" height="${r(36 * u)}" fill="#fff" opacity=".12"/><rect x="${-TW}" y="${H(36)}" width="1.6" height="${r(36 * u)}" fill="#000" opacity=".12"/>`;
  /* der VERDREHTE Turmhelm: achteckig, die Flächen winden sich als Bänder
     nach oben, die Spitze steht schief */
  const H0 = 36.4, H1 = 72, W0 = 5.3;
  const helm = (t) => ({ y: -(H0 + (H1 - H0) * t) * u, w: W0 * Math.pow(1 - t, 1.05), dx: Math.sin(t * Math.PI * 0.85) * 1.7 + t * 1.4 });
  const grat = (g, t) => { const h = helm(t), a = g * Math.PI / 4 + t * Math.PI * 0.9; return [h.dx + Math.sin(a) * h.w, h.y, Math.cos(a)]; };
  let lpfad = "", rpfad = "";
  for (let i = 0; i <= 24; i++) { const t = i / 24, h = helm(t); lpfad += `${i ? "L" : "M"}${r(h.dx - h.w)} ${r(h.y)} `; rpfad = `L${r(h.dx + h.w)} ${r(h.y)} ` + rpfad; }
  k += `<path d="${lpfad}${rpfad}Z" fill="#2d343b"/>`;
  /* sichtbare Flächen zwischen zwei Graten: heller, wenn sie nach rechts (zur Sonne) zeigen */
  for (let g = 0; g < 8; g++) {
    const a = [], b = [];
    for (let i = 0; i <= 24; i++) { const t = i / 24; const p = grat(g, t), q = grat(g + 1, t); if (p[2] + q[2] > -0.2) { a.push(p); b.push(q); } else { a.push(null); b.push(null); } }
    let seg = [];
    const flush = () => { if (seg.length > 1) { const hin = seg.map((s) => `${r(s[0][0])} ${r(s[0][1])}`), zur = seg.map((s) => `${r(s[1][0])} ${r(s[1][1])}`).reverse(); const licht = (seg[0][0][0] + seg[0][1][0]) / 2 - helm(0).dx; k += `<path d="M${hin.join(" L")} L${zur.join(" L")} Z" fill="${licht > 1.2 ? "#6d7883" : licht > -1.2 ? "#4b545e" : "#323940"}"/>`; } seg = []; };
    for (let i = 0; i <= 24; i++) { if (a[i]) seg.push([a[i], b[i]]); else flush(); }
    flush();
  }
  for (let g = 0; g < 8; g++) {
    let d = "", an = false;
    for (let i = 0; i <= 24; i++) { const p = grat(g, i / 24); if (p[2] > -0.05) { d += `${an ? "L" : "M"}${r(p[0])} ${r(p[1])} `; an = true; } else an = false; }
    if (d) k += `<path d="${d}" stroke="#9aa5ae" stroke-width=".22" fill="none" opacity=".9"/>`;
  }
  /* kleine Gauben am Helmfuß */
  for (const x of [-3.2, 0.4, 3.6]) k += `<path d="M${r(x - 0.9)} ${H(H0 + 0.2)} L${r(x - 0.9)} ${H(H0 + 2.4)} L${r(x)} ${H(H0 + 4)} L${r(x + 0.9)} ${H(H0 + 2.4)} L${r(x + 0.9)} ${H(H0 + 0.2)} Z" fill="#3c454e"/><rect x="${r(x - 0.4)}" y="${H(H0 + 2.2)}" width=".8" height="1.3" fill="#e8e1cf"/>`;
  /* Kugel, Kreuz und Wetterhahn */
  const top = helm(1);
  k += `<circle cx="${r(top.dx)}" cy="${r(top.y - 0.5)}" r=".6" fill="${GOLD}"/><path d="M${r(top.dx)} ${r(top.y - 1)} L${r(top.dx)} ${r(top.y - 4.4)} M${r(top.dx - 1)} ${r(top.y - 3.3)} L${r(top.dx + 1)} ${r(top.y - 3.3)}" stroke="#c8a24a" stroke-width=".4"/>`;
  k += `<path d="M${r(top.dx - 0.9)} ${r(top.y - 5)} q.9 -1.1 1.8 -.2 q-.7 0 -.6 .7 Z" fill="#c8a24a"/>`;
  S.teil({ id: "lambertus", de: "die Kirche St. Lambertus", syl: "KIR-che sankt LAM-ber-tus", it: "la chiesa di San Lamberto", itSyl: "CHIE-sa di san lam-BER-to", en: "St. Lambertus Church",
    x: LB.x, y: LB.y, kunst: k, tipp: "St. Lambertus ist die älteste Kirche von Düsseldorf. Ihr Turmhelm ist verdreht.",
    zoom: { x: LB.x - 52, y: 20, w: 104, h: 70 },
    unter: [
      { id: "turmhelm", de: "der Turmhelm", syl: "TURM-helm", it: "la guglia", itSyl: "GU-glia", en: "spire", x: LB.x, y: LB.y - 36.4 * LB.u, kunst: flaeche(-5.6, -(36.6 * LB.u), 12, 36.6 * LB.u, 0.5),
        tipp: "Nach einem Brand 1815 wurde der Helm aus nassem Holz gebaut. Beim Trocknen hat er sich verdreht. Die Legende sagt: Das war der Teufel!" },
      { id: "kirchturmuhr", de: "die Kirchturmuhr", syl: "KIRCH-turm-uhr", it: "l'orologio del campanile", itSyl: "o-ro-LO-gio del cam-pa-NI-le", en: "church clock", x: LB.x, y: LB.y - 27.6 * LB.u, kunst: flaeche(-2.6, -2.6, 5.2, 5.2, 2.6) },
    ] });
}

/* =====================================================================
   8 — DIE ALTSTADT (Häuserzeile am Rheinufer, „längste Theke der Welt“)
   ===================================================================== */
{
  let k = "";
  const LAT = -30;
  const farben = ["#efe6d2", "#e7d3b6", "#f3efe6", "#d9c7a6", "#e9dccb", "#cfd8d6", "#efe1c4", "#e6d6c9", "#f1ece1", "#dccdb2", "#ece4d4", "#d9cbb8", "#efe6d2"];
  const lad = ["#2d5f8f", "#9c2b25", "#2f6b3e", "#c98a2a", "#5b3a6e"];
  let d = 84, i = 0;
  const haeuser = [];
  while (d < 700 && i < 44) {
    const breite = 9 + (i * 7 % 5) * 1.6, hoehe = 13 + (i * 5 % 4) * 1.7;
    haeuser.push({ d0: d, d1: d + breite, h: hoehe, f: farben[i % farben.length], giebel: i % 3 === 1 && d < 190, i });
    d += breite; i++;
  }
  /* von hinten nach vorn zeichnen */
  for (const hs of haeuser.slice().reverse()) {
    const a0 = P(hs.d0, LAT, 0), a1 = P(hs.d1, LAT, 0), b0 = P(hs.d0, LAT, hs.h), b1 = P(hs.d1, LAT, hs.h);
    if (a1[0] > 102) continue;
    const fern = hs.d0 > 260;
    k += vieleck([a0, a1, b1, b0], hs.f);
    /* Licht: die Westfassaden bekommen die Nachmittagssonne */
    k += vieleck([a0, a1, b1, b0], "#fff3d6", ` opacity="${hs.i % 2 ? 0.12 : 0.04}"`);
    /* Fenster: drei Obergeschosse, drei Achsen */
    if (!fern || hs.i % 2) for (let g = 0; g < 3; g++) for (let a = 0; a < 3; a++) {
      const t0 = (a + 0.3) / 3, t1 = (a + 0.66) / 3, dd0 = hs.d0 + (hs.d1 - hs.d0) * t0, dd1 = hs.d0 + (hs.d1 - hs.d0) * t1, h0 = 4.6 + g * 3.1, h1 = h0 + 1.9;
      const p = [P(dd0, LAT, h0), P(dd1, LAT, h0), P(dd1, LAT, h1), P(dd0, LAT, h1)];
      if (p[1][0] - p[0][0] < 0.4) continue;
      k += vieleck(p, "#46525c");
      if (!fern) k += vieleck([p[0], p[1], P(dd1, LAT, h0 + 0.3), P(dd0, LAT, h0 + 0.3)], "#f6f1e6");
    }
    /* Erdgeschoss: Kneipe mit Markise und Tür */
    k += vieleck([P(hs.d0 + 0.6, LAT, 3.4), P(hs.d1 - 0.6, LAT, 3.4), P(hs.d1 - 0.6, LAT + 1.6, 2.6), P(hs.d0 + 0.6, LAT + 1.6, 2.6)], lad[hs.i % 5]);
    k += vieleck([P(hs.d0 + 1.4, LAT, 0), P(hs.d0 + 3, LAT, 0), P(hs.d0 + 3, LAT, 2.4), P(hs.d0 + 1.4, LAT, 2.4)], "#3a2c22");
    k += vieleck([P(hs.d0 + 3.6, LAT, 0.8), P(hs.d1 - 1.2, LAT, 0.8), P(hs.d1 - 1.2, LAT, 2.3), P(hs.d0 + 3.6, LAT, 2.3)], "#6d5a3c", ` opacity=".8"`);
    /* Dach: Schiefer, mal Traufe mit Gaube, mal ein flacher Giebel */
    if (hs.giebel) {
      const g = P((hs.d0 + hs.d1) / 2, LAT, hs.h + 2.6);
      k += vieleck([b0, g, b1], hs.f) + vieleck([b0, g, P((hs.d0 + hs.d1) / 2, LAT, hs.h + 2.7), P(hs.d0 + 0.3, LAT, hs.h)], "#5a636c");
    } else {
      const c0 = P(hs.d0, LAT - 4, hs.h + 3.6), c1 = P(hs.d1, LAT - 4, hs.h + 3.6);
      k += vieleck([b0, b1, c1, c0], "#56606a");
      const g0 = P(hs.d0 + (hs.d1 - hs.d0) * 0.35, LAT - 0.6, hs.h + 0.4), g1 = P(hs.d0 + (hs.d1 - hs.d0) * 0.6, LAT - 0.6, hs.h + 2);
      if (g1[0] - g0[0] > 0.8) k += vieleck([[g0[0], g0[1]], [g1[0], g0[1]], [g1[0], g1[1]], [g0[0], g1[1]]], "#e9e4d8") + vieleck([[g0[0] + 0.3, g0[1] - 0.3], [g1[0] - 0.3, g0[1] - 0.3], [g1[0] - 0.3, g1[1] + 0.5], [g0[0] + 0.3, g1[1] + 0.5]], "#46525c");
    }
    k += vieleck([a0, P(hs.d0 + 0.5, LAT, 0), P(hs.d0 + 0.5, LAT, hs.h), b0], "#000", ` opacity=".1"`);
  }
  /* Sonnenschirme und Gäste vor den Kneipen */
  for (const [dd, f] of [[112, "#f3efe6"], [150, "#9c2b25"], [205, "#f3efe6"], [280, "#2d5f8f"], [380, "#f3efe6"]]) {
    const s = P(dd, LAT + 4.5, 0), o = P(dd, LAT + 4.5, 2.6), w = 1.6 * F / dd;
    if (o[0] - w < 0) continue;
    k += `<line x1="${s[0]}" y1="${s[1]}" x2="${o[0]}" y2="${o[1]}" stroke="#6b6257" stroke-width="${r(0.05 * F / dd + 0.1)}"/><path d="M${r(o[0] - w)} ${r(o[1] + w * 0.3)} Q${o[0]} ${r(o[1] - w * 0.45)} ${r(o[0] + w)} ${r(o[1] + w * 0.3)} Z" fill="${f}"/>`;
    for (const dl of [-1.2, 1.1]) { const p = P(dd + dl, LAT + 4.5 + dl, 0), hh = 1.2 * F / dd; k += `<rect x="${r(p[0] - hh * 0.18)}" y="${r(p[1] - hh)}" width="${r(hh * 0.36)}" height="${r(hh)}" rx="${r(hh * 0.12)}" fill="${dl < 0 ? "#3d5a80" : "#b8473a"}"/><circle cx="${p[0]}" cy="${r(p[1] - hh - hh * 0.12)}" r="${r(hh * 0.13)}" fill="#e3b796"/>`; }
  }
  S.teil({ id: "altstadt", de: "die Altstadt", syl: "ALT-stadt", it: "il centro storico", itSyl: "CEN-tro STO-ri-co", en: "old town",
    x: 0, y: 0, kunst: k, tipp: "In der Altstadt gibt es rund 260 Kneipen. Man nennt sie „die längste Theke der Welt“." });
}

/* =====================================================================
   9 — DER RHEIN (mit Spiegelungen)
   ===================================================================== */
const UFER = strahl(9.5, -4);      /* Wasserlinie an der Böschung, unten im Bild */
{
  const wasser = [[114, 117.6], [248, 117.3], [320, 122], [320, 200], UFER];
  let k = vieleck(wasser, S.lg("wasser", [[0, "#a3b7b9"], [0.3, "#7f9696"], [1, "#4e6662"]]));
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".3">`;
  k += `<rect x="172.5" y="117.8" width="7" height="30" fill="#dfe2de"/><rect x="168" y="118" width="16" height="5" fill="#5d7a92"/><rect x="249" y="117.8" width="6" height="22" fill="#e9eef1"/><rect x="156" y="117.8" width="160" height="3.4" fill="#c3cbd0"/>`;
  k += `<rect x="279" y="119" width="26" height="9" rx="4" fill="#f4f6f7" opacity=".6"/><rect x="190" y="117.8" width="22" height="7" fill="#d9c9c0"/>`;
  k += `</g>`;
  for (let i = 0; i < 170; i++) {
    const y = 118 + Math.pow(rnd(), 0.8) * 82, x = 110 + rnd() * 212, w = 1.2 + (y - 116) * 0.22 * rnd() + 0.6;
    if (x < 112 + 9.5 / 7.5 * (y - 116) + 1) continue;
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} -.5 ${r(Math.min(w, 320 - x))} 0" stroke="${rnd() < 0.55 ? "#eef4f3" : "#3d524e"}" stroke-width="${r(0.12 + (y - 116) * 0.009)}" fill="none" opacity="${r(0.3 + rnd() * 0.4)}"/>`;
  }
  /* Glitzern der Sonne rechts */
  for (let i = 0; i < 46; i++) { const y = 120 + rnd() * 44, x = 236 + rnd() * 80; k += `<rect x="${r(x)}" y="${r(y)}" width="${r(0.6 + rnd() * 1.4)}" height=".25" fill="#fff8de" opacity="${r(0.4 + rnd() * 0.5)}"/>`; }
  /* Strömung: Wirbel an der Böschung */
  k += `<path d="${[...Array(9)].map((_, i) => { const t = 1.6 + i * 1.15; return `M${r(112 + 9.5 * t + 1.5)} ${r(116 + 7.5 * t)} q2 -.4 4 .2`; }).join(" ")}" stroke="#e7efee" stroke-width=".3" fill="none" opacity=".6"/>`;
  S.teil({ id: "rhein", de: "der Rhein", syl: "RHEIN", it: "il Reno", itSyl: "RE-no", en: "the Rhine", x: 0, y: 0, kunst: k,
    tipp: "Der Rhein macht in Düsseldorf einen großen Bogen — das „Rheinknie“." });
}

/* =====================================================================
   10 — DAS AUSFLUGSSCHIFF (legt am Burgplatz ab und fährt rheinaufwärts)
   ===================================================================== */
{
  const D0 = 104, D1 = 160, L0 = 31, L1 = 39, LM = (L0 + L1) / 2, W = -4, OB = -1.6, SD = 0.9;
  const q = (pts, f, extra = "") => `<path d="M${pts.map((p) => p.join(" ")).join(" L")} Z" fill="${f}"${extra}/>`;
  /* Kasten: sichtbar sind Heck (vorn, zu uns), linke Seite und Deck */
  const box = (d0, d1, l0, l1, h0, h1, heck, seite, oben) => q([P(d0, l0, h1), P(d1, l0, h1), P(d1, l1, h1), P(d0, l1, h1)], oben) + q([P(d0, l0, h0), P(d1, l0, h0), P(d1, l0, h1), P(d0, l0, h1)], seite) + q([P(d0, l0, h0), P(d0, l1, h0), P(d0, l1, h1), P(d0, l0, h1)], heck);
  let k = "";
  /* Kielwasser hinter dem Heck (zu uns hin) und Schatten */
  k += q([P(D0, L0 - 0.4, W), P(D1 + 4, L0 - 0.4, W), P(D1 + 4, L1, W), P(D0, L1 + 0.4, W)], "#2f4642", ` opacity=".35"`);
  /* Schraubenwasser: heller Keil mit Schaumstreifen */
  k += q([P(D0, L0 + 0.6, W), P(D0, L1 - 0.6, W), P(D0 - 20, L1 + 5, W), P(D0 - 20, L0 - 4, W)], S.lg("kiel", [[0, "#f4f8f8", 0.55], [1, "#f4f8f8", 0]], 0, 0, 0, 1));
  for (let i = 0; i < 26; i++) { const dd = D0 - 1 - rnd() * 18, l = LM + (rnd() - 0.5) * (8 + (D0 - dd) * 0.5), p = P(dd, l, W), w = 0.6 + rnd() * 1.6; k += `<path d="M${p[0]} ${p[1]} q${r(w / 2)} -.3 ${r(w)} 0" stroke="#f7fbfb" stroke-width=".35" fill="none" opacity="${r(0.4 + rnd() * 0.5)}"/>`; }
  /* Rumpf mit Heckspiegel, rote Zierlinie */
  k += box(D0, D1, L0, L1, W, OB, S.lg("heck", [[0, "#ffffff"], [0.45, "#eef2f4"], [0.5, "#1f3f78"], [1, "#16305e"]]), S.lg("rumpf", [[0, "#ffffff"], [0.42, "#eef2f4"], [0.46, "#1f3f78"], [1, "#16305e"]]), "#c9a46a");
  const st = [P(D0, L0, W + 1.1), P(D1, L0, W + 1.1), P(D0, L1, W + 1.1)];
  k += `<path d="M${st[2].join(" ")} L${st[0].join(" ")} L${st[1].join(" ")}" stroke="#c9302c" stroke-width=".35" fill="none"/>`;
  const tx = P(D0, LM, W + 1.7);
  k += `<text x="${tx[0]}" y="${tx[1]}" font-size="1.7" text-anchor="middle" fill="#1f3f78" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".1">DÜSSELDORF</text>`;
  /* Salondeck mit Panoramafenstern rundum */
  k += box(D0 + 2, D1 - 4, L0 + 0.4, L1 - 0.4, OB, SD, "#f4f6f7", "#f7f8f9", "#dde3e7");
  for (let dd = D0 + 4; dd < D1 - 6; dd += 3.3) k += q([P(dd, L0 + 0.4, OB + 0.5), P(dd + 2.5, L0 + 0.4, OB + 0.5), P(dd + 2.5, L0 + 0.4, SD - 0.4), P(dd, L0 + 0.4, SD - 0.4)], S.lg("salon", [[0, "#9db8cc"], [1, "#2f4b62"]]));
  for (let l = L0 + 1; l < L1 - 1.2; l += 1.6) k += q([P(D0 + 2, l, OB + 0.5), P(D0 + 2, l + 1.3, OB + 0.5), P(D0 + 2, l + 1.3, SD - 0.4), P(D0 + 2, l, SD - 0.4)], "#3d5a73");
  /* Sonnendeck: Reling, Gäste, Steuerhaus vorn (weit weg) */
  for (const h of [SD + 0.55, SD + 1.05]) { const a = P(D0 + 2, L1 - 0.4, h), b = P(D0 + 2, L0 + 0.4, h), c = P(D1 - 4, L0 + 0.4, h); k += `<path d="M${a.join(" ")} L${b.join(" ")} L${c.join(" ")}" stroke="#8a949b" stroke-width=".2" fill="none"/>`; }
  k += box(D1 - 12, D1 - 6, L0 + 2, L1 - 2, SD, SD + 2.3, "#fbfcfc", "#f1f4f6", "#cfd6db");
  k += q([P(D1 - 11.4, L0 + 2, SD + 1.1), P(D1 - 6.6, L0 + 2, SD + 1.1), P(D1 - 6.6, L0 + 2, SD + 2), P(D1 - 11.4, L0 + 2, SD + 2)], "#2e4658");
  for (const [dd, f, l] of [[D0 + 8, "#c9302c", 34], [D0 + 13, "#2d6fb3", 36.5], [D0 + 18, "#f2c62f", 33], [D0 + 24, "#3ca35a", 35.5], [D0 + 30, "#e6e6e6", 33.5], [D0 + 36, "#e46aa0", 36]]) {
    const p = P(dd, l, SD), s = F / dd;
    k += `<rect x="${r(p[0] - 0.24 * s)}" y="${r(p[1] - 1.25 * s)}" width="${r(0.48 * s)}" height="${r(0.9 * s)}" rx=".2" fill="${f}"/><circle cx="${p[0]}" cy="${r(p[1] - 1.42 * s)}" r="${r(0.16 * s)}" fill="#e3b796"/>`;
  }
  /* Flagge am Heck */
  const fl = P(D0 + 2.4, LM, SD), fl2 = P(D0 + 2.4, LM, SD + 3.6);
  k += `<line x1="${fl[0]}" y1="${fl[1]}" x2="${fl2[0]}" y2="${fl2[1]}" stroke="#8a8f94" stroke-width=".25"/><path d="M${fl2[0]} ${fl2[1]} q1.4 -.4 2.8 .1 l0 1.8 q-1.4 -.4 -2.8 .1 Z" fill="#dd2a24"/><path d="M${fl2[0]} ${fl2[1]} q1.4 -.4 2.8 .1 l0 .6 q-1.4 -.4 -2.8 .1 Z" fill="#1d1d1d"/><path d="M${fl2[0]} ${r(fl2[1] + 1.2)} q1.4 -.4 2.8 .1 l0 .6 q-1.4 -.4 -2.8 .1 Z" fill="#f2c62f"/>`;
  S.teil({ id: "ausflugsschiff", de: "das Ausflugsschiff", syl: "AUS-flugs-schiff", it: "il battello turistico", itSyl: "bat-TEL-lo tu-RI-sti-co", en: "sightseeing boat",
    x: 0, y: 0, kunst: k, tipp: "Am Burgplatz legen die Ausflugsschiffe ab. Dann geht es auf dem Rhein zum Rheinturm und zum Medienhafen." });
}

/* =====================================================================
   11 — DIE PROMENADE (Rheinuferpromenade, Granitplatten, Uferkante)
   ===================================================================== */
{
  const KANTE = strahl(4.4, 0), BORD = strahl(3.4, 0);
  let k = vieleck([[0, 116], [112, 116], KANTE, [0, 200]], S.lg("platten", [[0, "#cfc8ba"], [0.5, "#bdb5a6"], [1, "#a9a193"]]));
  /* breiter Granitbord an der Kante, hell in der Sonne */
  k += vieleck([[112, 116], KANTE, BORD], S.lg("bord", [[0, "#e7e2d7"], [1, "#d3ccbe"]]));
  k += `<path d="M112 116 L${KANTE.join(" ")}" stroke="#6d675c" stroke-width=".6"/>`;
  for (let t = 1.5; t < 24; t *= 1.18) { const a = [112 + 3.4 * t, 116 + 3.5 * t], b = [112 + 4.4 * t, 116 + 3.5 * t]; k += `<line x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}" stroke="#a69f91" stroke-width=".2"/>`; }
  /* Plattenfugen: längs zum Fluchtpunkt, quer in Abständen */
  for (let lat = 2; lat > -60; lat -= 2.5) { const b = strahl(lat); k += `<line x1="112" y1="116" x2="${b[0]}" y2="${b[1]}" stroke="#958d7f" stroke-width=".28" opacity="${lat > -10 ? 0.55 : 0.4}"/>`; }
  for (let d = 16; d < 420; d *= 1.085) { const lmin = Math.max(-60, -112 * d / F + 0.01), a = P(d, lmin), b = P(d, 3.4); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#958d7f" stroke-width=".22" opacity=".45"/>`; }
  for (let i = 0; i < 220; i++) { const y = 118 + Math.pow(rnd(), 0.7) * 82, x = rnd() * 220; if (x > 112 + 3.4 * km(y) - 0.5) continue; k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.12 + rnd() * 0.28)}" fill="${rnd() < 0.5 ? "#e6e1d6" : "#8c8476"}" opacity=".5"/>`; }
  /* Sonnenlicht von rechts, Schatten der Platane links */
  k += vieleck([[0, 116], [112, 116], KANTE, [0, 200]], S.lg("promlicht", [[0, "#000", 0.1], [0.5, "#000", 0], [1, "#fff4d8", 0.12]], 0, 0, 1, 0));
  k += `<ellipse cx="34" cy="187" rx="34" ry="8" fill="#2e3b2a" opacity=".16" filter="url(#bw_weich)"/>`;
  S.teil({ id: "promenade", de: "die Promenade", syl: "pro-me-NA-de", it: "il lungofiume", itSyl: "lun-go-FIU-me", en: "promenade", x: 0, y: 0, kunst: k,
    tipp: "Auf der Rheinuferpromenade spazieren die Leute direkt am Wasser entlang." });
}

/* =====================================================================
   12 — DER RADSCHLÄGER auf dem Kanaldeckel (Stadtsymbol)
   ===================================================================== */
{
  const rx = 9.4, ry = 2.9;
  let k = `<ellipse cx="0" cy=".2" rx="${rx + 0.7}" ry="${ry + 0.35}" fill="#857e72"/>`;
  k += `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${S.rg("guss", [[0, "#74777a"], [0.7, "#55595d"], [1, "#3c3f43"]])}"/>`;
  k += `<ellipse cx="0" cy="0" rx="${rx - 1.2}" ry="${ry - 0.4}" fill="none" stroke="#9a9ea2" stroke-width=".3"/>`;
  /* Relief: der Junge schlägt ein Rad (Arme und Beine wie ein X, Kopf unten), flach auf dem Boden */
  k += `<g transform="scale(1 .3)"><g transform="rotate(-24)" stroke="#c3c6c9" stroke-linecap="round" fill="#c3c6c9">`;
  k += `<circle cx="0" cy="3.9" r="1.35" stroke="none"/><path d="M0 2.6 L0 -1.6" stroke-width="1.5"/><path d="M0 1.8 L-3.4 4.2 M0 1.8 L3.4 4.2" stroke-width=".8"/><path d="M0 -1.4 L-3.2 -5.4 M0 -1.4 L3.2 -5.4" stroke-width="1"/>`;
  k += `</g></g>`;
  k += `<text x="0" y="${r(ry - 0.75)}" font-size="1.05" text-anchor="middle" fill="#a9adb1" font-family="Arial,sans-serif" letter-spacing=".2" transform="scale(1 .8)" transform-origin="0 ${r(ry - 0.75)}">DÜSSELDORF</text>`;
  for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; k += `<rect x="${r(Math.cos(a) * (rx - 0.6) - 0.2)}" y="${r(Math.sin(a) * (ry - 0.2) - 0.08)}" width=".4" height=".16" fill="#9a9ea2"/>`; }
  k += `<ellipse cx="-2" cy="-.9" rx="4.4" ry=".5" fill="#fff" opacity=".12"/>`;
  S.teil({ oben: true, id: "radschlaeger", de: "der Radschläger", syl: "RAD-schlä-ger", it: "il ragazzo che fa la ruota", itSyl: "ra-GAZ-zo che fa la RUO-ta", en: "cartwheeler",
    x: 152, y: 193, kunst: k, tipp: "Der Radschläger ist das Symbol von Düsseldorf — man findet ihn sogar auf den Kanaldeckeln." });
}

/* =====================================================================
   13 — DIE PLATANE (vorne links) und 14 — DIE LATERNE
   ===================================================================== */
{
  const X = 11, Y = 186;
  let k = schatten(X + 2, Y + 0.6, 11, 2, 0.35);
  /* Stamm mit der typischen fleckigen Platanenrinde, oben zwei Äste */
  const stamm = [[-10, 0.4], [-7, -3], [-5.8, -14], [-5.6, -40], [-5, -90], [-6.6, -122], [-13, -146], [-6, -150], [-0.6, -128], [3, -150], [10, -146], [4.6, -118], [4.8, -80], [5.6, -40], [6, -12], [8, -3], [11, 0.4]];
  k += vieleck(stamm.map(([x, y]) => [X + x, Y + y]), S.lg("rinde", [[0, "#6f6a58"], [0.4, "#a59c80"], [0.8, "#c8c1a6"], [1, "#8a8470"]], 0, 0, 1, 0));
  for (let i = 0; i < 30; i++) {
    const y = Y - 4 - rnd() * 118, x = X - 4.6 + rnd() * 8.6, w = 1.2 + rnd() * 2.6, h = 1 + rnd() * 2.6;
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} ${r(-h * 0.6)} ${r(w)} 0 q${r(-w * 0.2)} ${r(h)} ${r(-w)} ${r(h * 0.4)} Z" fill="${["#e2dcc4", "#8e8a6c", "#b7b394", "#d6cfa9"][i % 4]}" opacity=".8"/>`;
  }
  k += `<path d="M${X + 4.2} ${Y} Q${X + 3.6} ${Y - 40} ${X + 3.8} ${Y - 80}" stroke="#fff" stroke-width="1.1" opacity=".16" fill="none"/>`;
  /* Krone: nur oben links, sie lässt St. Lambertus frei */
  const LAUB = S.rg("laub", [[0, "#a6c774"], [0.6, "#6d9445"], [1, "#4a6d30"]], 0.62, 0.32, 0.75);
  for (const [cx, cy, rr] of [[6, 14, 22], [30, 6, 20], [48, 2, 14], [-2, 36, 16], [20, 28, 14], [40, 20, 12], [54, 14, 8]])
    k += kreisVieleck(cx, cy, rr, LAUB);
  for (let i = 0; i < 70; i++) { const x = 2 + rnd() * 54, y = 2 + rnd() * 40; if (y > 48 - x * 0.6) continue; k += `<path d="M${r(x)} ${r(y)} l1.4 -1 l.6 1.6 Z" fill="${rnd() < 0.5 ? "#c2dc8e" : "#4e7234"}" opacity=".75"/>`; }
  S.teil({ id: "platane", de: "die Platane", syl: "pla-TA-ne", it: "il platano", itSyl: "PLA-ta-no", en: "plane tree", x: 0, y: 0, kunst: k,
    tipp: "Die Platane erkennt man an ihrer fleckigen Rinde." });
}
{
  const Y = 172, s = km(Y), H = 4.6 * s;
  let k = schatten(0, 0.3, 4.4, 1, 0.3);
  k += `<path d="M-2.2 0 L-1.6 -4 L1.6 -4 L2.2 0 Z" fill="#2f3a3e"/><rect x="-.65" y="${r(-H + 6)}" width="1.3" height="${r(H - 10)}" fill="${S.lg("mast", [[0, "#2b3437"], [0.5, "#5f6c71"], [1, "#2b3437"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-.65 ${r(-H + 6)} Q-.6 ${r(-H + 2)} 3.6 ${r(-H + 1.4)}" stroke="#2f3a3e" stroke-width="1" fill="none"/>`;
  k += `<path d="M1.2 ${r(-H + 1)} L6.2 ${r(-H + 1)} L5.4 ${r(-H + 3.2)} L2 ${r(-H + 3.2)} Z" fill="#2f3a3e"/><ellipse cx="3.7" cy="${r(-H + 3.3)}" rx="1.8" ry=".45" fill="#fff6d6"/>`;
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: 34, y: Y, steht: true, kunst: k });
}

/* =====================================================================
   15 — DER WEGWEISER (zur Kö, in die Altstadt, zum Rheinturm)
   ===================================================================== */
{
  const Y = 174, s = km(Y), H = 2.9 * s;
  let k = schatten(0, 0.3, 3.6, 0.9, 0.3);
  k += `<rect x="-.7" y="${r(-H)}" width="1.4" height="${r(H)}" fill="${S.lg("pfosten", [[0, "#3b4a55"], [0.5, "#7a8b97"], [1, "#2f3c45"]], 0, 0, 1, 0)}"/>`;
  k += `<circle cx="0" cy="${r(-H - 0.4)}" r=".9" fill="#3b4a55"/>`;
  const schild = (y, links, text, unter) => {
    const w = 23, h = 4.4, x0 = links ? -w + 0.4 : -0.4, spitze = links ? `M${r(x0)} ${r(y + h / 2)} L${r(x0 + 2.6)} ${r(y)} L${r(x0 + w)} ${r(y)} L${r(x0 + w)} ${r(y + h)} L${r(x0 + 2.6)} ${r(y + h)} Z` : `M${r(x0)} ${r(y)} L${r(x0 + w - 2.6)} ${r(y)} L${r(x0 + w)} ${r(y + h / 2)} L${r(x0 + w - 2.6)} ${r(y + h)} L${r(x0)} ${r(y + h)} Z`;
    let g = `<path d="${spitze}" fill="#17406e" stroke="#e8edf2" stroke-width=".35"/>`;
    g += `<text x="${r(x0 + w / 2 + (links ? 1.2 : -1.2))}" y="${r(y + 2.5)}" font-size="2.3" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">${text}</text>`;
    g += `<text x="${r(x0 + w / 2 + (links ? 1.2 : -1.2))}" y="${r(y + 3.9)}" font-size="1.25" text-anchor="middle" fill="#cfe0f0" font-family="Arial,sans-serif">${unter}</text>`;
    return g;
  };
  k += schild(-H + 1, true, "Königsallee", "Kö · 800 m");
  k += schild(-H + 6.2, true, "Altstadt", "Burgplatz · Lambertus");
  k += schild(-H + 11.4, false, "Rheinturm", "Medienhafen · 1,8 km");
  S.teil({ id: "wegweiser", de: "der Wegweiser", syl: "WEG-wei-ser", it: "il cartello indicatore", itSyl: "car-TEL-lo in-di-ca-TO-re", en: "signpost",
    x: 116, y: Y, steht: true, kunst: k, tipp: "Der Wegweiser zeigt zur Königsallee. Die „Kö“ ist eine berühmte Straße zum Einkaufen — mit einem Wassergraben in der Mitte." });
}

/* =====================================================================
   16 — DER KÖBES (Kellner im Brauhaus, mit Tablett voller Altbier)
   ===================================================================== */
const FASS = { x: 84, y: 191 };
{
  const Y = 188.5;
  const m = B.mensch({ id: "dus_koebes", geschlecht: "m", pose: "servieren", blick: 24, frisur: "kurz", haarfarbe: "grau", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "#3f6aa6" }, schuerze: { stueck: "schuerze", farbe: "#1f3d73" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 1.78 * km(Y));
  const hand = m.z.handR, hx = hand.x * m.k, hy = hand.y * m.k;
  /* rundes Tablett mit Altbiergläsern auf der erhobenen Hand */
  let t = `<g transform="translate(${r(hx + 0.4)} ${r(hy - 0.6)})">`;
  t += `<ellipse cx="0" cy="0" rx="5.2" ry="1.3" fill="#8f979e"/><ellipse cx="0" cy="-.2" rx="4.9" ry="1.1" fill="#cfd5da"/>`;
  for (const [gx, gy] of [[-3.4, -0.3], [-1.2, -0.6], [1.1, -0.5], [3.3, -0.2], [-2.3, 0.3], [0, 0.4], [2.3, 0.3]]) {
    t += `<rect x="${r(gx - 0.55)}" y="${r(gy - 2.6)}" width="1.1" height="2.6" fill="#6d3a17"/><rect x="${r(gx - 0.55)}" y="${r(gy - 2.9)}" width="1.1" height=".5" rx=".2" fill="#f4ead6"/><rect x="${r(gx - 0.4)}" y="${r(gy - 2.3)}" width=".25" height="1.9" fill="#fff" opacity=".35"/>`;
  }
  t += `</g>`;
  /* Ledertasche (Portemonnaie) an der Schürze */
  /* die lange blaue Köbes-Schürze reicht fast bis zu den Knöcheln */
  const sy = -0.53 * 1.78 * km(Y), sb = -0.12 * 1.78 * km(Y);
  let schuerze = `<path d="M-3.1 ${r(sy)} L3.6 ${r(sy)} Q4.4 ${r((sy + sb) / 2)} 4.6 ${r(sb)} L-3.8 ${r(sb)} Q-3.6 ${r((sy + sb) / 2)} -3.1 ${r(sy)} Z" fill="${S.lg("schuerze", [[0, "#1a3465"], [0.5, "#2a4c88"], [1, "#1c386b"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-1.6, 0.4, 2.4]) schuerze += `<path d="M${x} ${r(sy + 2)} Q${r(x + 0.3)} ${r((sy + sb) / 2)} ${r(x + 0.4)} ${r(sb)}" stroke="#132a52" stroke-width=".3" fill="none" opacity=".7"/>`;
  schuerze += `<rect x="-3.3" y="${r(sy - 0.5)}" width="7.1" height=".7" rx=".3" fill="#132a52"/>`;
  const tasche = `<rect x="-2.6" y="${r(sy - 0.3)}" width="2.8" height="2.4" rx=".4" fill="#5a3a1f" stroke="#3a2412" stroke-width=".2"/><line x1="-1.2" y1="${r(sy - 0.3)}" x2="-1.2" y2="${r(sy - 1.6)}" stroke="#3a2412" stroke-width=".25"/>`;
  S.teil({ id: "koebes", de: "der Köbes", syl: "KÖ-bes", it: "il cameriere della birreria", itSyl: "ca-me-RIE-re del-la bir-re-RI-a", en: "brewery waiter",
    x: 56, y: Y, kunst: schatten(0, 0.3, 6.5, 1.2, 0.3) + m.svg + schuerze + tasche + t,
    tipp: "Im Brauhaus heißt der Kellner „Köbes“. Er trägt Blau und bringt das Altbier, ohne dass man fragt." });
}

/* =====================================================================
   17 — DAS FASS (Stehtisch) — Lupe: Altbier, Bierdeckel, Senf, Halve Hahn
   ===================================================================== */
{
  const s = km(FASS.y), H = 1.05 * s, R = 0.33 * s, ry = R * 0.16;
  let k = schatten(0, 0.4, R + 3, 1.4, 0.35);
  /* Fass mit gebogenen Dauben und Eisenreifen */
  k += `<path d="M${r(-R * 0.9)} 0 Q${r(-R * 1.12)} ${r(-H / 2)} ${r(-R * 0.9)} ${r(-H)} L${r(R * 0.9)} ${r(-H)} Q${r(R * 1.12)} ${r(-H / 2)} ${r(R * 0.9)} 0 Z" fill="${HOLZ}"/>`;
  for (let i = 1; i < 7; i++) { const t = -1 + i / 3.5; k += `<path d="M${r(t * R * 0.9)} 0 Q${r(t * R * 1.12)} ${r(-H / 2)} ${r(t * R * 0.9)} ${r(-H)}" stroke="#4a2e16" stroke-width=".22" fill="none" opacity=".7"/>`; }
  for (const f of [0.12, 0.3, 0.7, 0.88]) { const w = R * (0.9 + 0.22 * Math.sin(f * Math.PI)); k += `<rect x="${r(-w)}" y="${r(-H * f - 0.6)}" width="${r(2 * w)}" height="1.2" rx=".3" fill="${S.lg("reif", [[0, "#2c2c2c"], [0.6, "#6b6b6b"], [1, "#3a3a3a"]], 0, 0, 1, 0)}"/>`; }
  /* Tischplatte (rundes Brett) */
  k += `<ellipse cx="0" cy="${r(-H)}" rx="${r(R * 1.2)}" ry="${r(ry * 1.4 + 0.6)}" fill="#5a3a1f"/><ellipse cx="0" cy="${r(-H - 0.5)}" rx="${r(R * 1.2)}" ry="${r(ry * 1.4 + 0.5)}" fill="${S.lg("platte", [[0, "#b7834f"], [1, "#8c5d33"]])}"/>`;
  const top = -H - 0.5;
  /* Bierdeckel mit Strichen, darauf ein Altbier */
  const bd = { x: -3.6, y: top + 0.1 };
  k += `<ellipse cx="${bd.x}" cy="${r(bd.y)}" rx="1.9" ry=".55" fill="#f6f1e4" stroke="#c9bfa8" stroke-width=".12"/>`;
  for (let i = 0; i < 4; i++) k += `<line x1="${r(bd.x - 1.2 + i * 0.4)}" y1="${r(bd.y + 0.25)}" x2="${r(bd.x - 1.1 + i * 0.4)}" y2="${r(bd.y - 0.2)}" stroke="#333" stroke-width=".08"/>`;
  const glas = (x, y, voll) => {
    let g = `<path d="M${r(x - 0.75)} ${r(y)} L${r(x - 0.8)} ${r(y - 3.4)} L${r(x + 0.8)} ${r(y - 3.4)} L${r(x + 0.75)} ${r(y)} Z" fill="#e7f0f2" opacity=".55" stroke="#b8c8cc" stroke-width=".08"/>`;
    g += `<path d="M${r(x - 0.7)} ${r(y - 0.1)} L${r(x - 0.74)} ${r(y - 3.4 * voll)} L${r(x + 0.74)} ${r(y - 3.4 * voll)} L${r(x + 0.7)} ${r(y - 0.1)} Z" fill="${S.lg("alt", [[0, "#8a4a1c"], [0.5, "#5a2c10"], [1, "#7a3e17"]], 0, 0, 1, 0)}"/>`;
    g += `<rect x="${r(x - 0.76)}" y="${r(y - 3.4 * voll - 0.55)}" width="1.52" height=".6" rx=".25" fill="#f4ead6"/><rect x="${r(x - 0.55)}" y="${r(y - 3.1)}" width=".22" height="2.6" fill="#fff" opacity=".45"/>`;
    return g;
  };
  k += glas(bd.x + 0.2, bd.y, 0.86);
  k += glas(1.4, top - 0.2, 0.55);
  /* Senfglas (Düsseldorfer Löwensenf) */
  const sx = 4.6, sy = top + 0.15;
  k += `<path d="M${sx - 0.9} ${r(sy)} L${sx - 0.9} ${r(sy - 2)} L${sx + 0.9} ${r(sy - 2)} L${sx + 0.9} ${r(sy)} Z" fill="#d9a62e"/><rect x="${sx - 0.95}" y="${r(sy - 1.75)}" width="1.9" height="1.35" fill="#f5d33f"/><text x="${sx}" y="${r(sy - 1.15)}" font-size=".42" text-anchor="middle" fill="#7a1a12" font-family="Arial,sans-serif" font-weight="bold">Düsseldorfer</text><text x="${sx}" y="${r(sy - 0.6)}" font-size=".5" text-anchor="middle" fill="#1d1d1d" font-family="Arial,sans-serif" font-weight="bold">SENF</text><rect x="${sx - 0.75}" y="${r(sy - 1.9)}" width=".25" height="1.7" fill="#fff" opacity=".35"/>`;
  k += `<rect x="${sx - 1}" y="${r(sy - 2.6)}" width="2" height=".7" rx=".2" fill="#2b2b2b"/>`;
  /* Halve Hahn: Röggelchen mit dicker Scheibe Gouda auf dem Brettchen */
  const hx2 = -0.6, hy2 = top + 0.9;
  k += `<ellipse cx="${hx2}" cy="${r(hy2)}" rx="2.6" ry=".55" fill="#d9b886"/>`;
  k += `<path d="M${r(hx2 - 2)} ${r(hy2 - 0.2)} Q${r(hx2 - 1.9)} ${r(hy2 - 1.5)} ${r(hx2 - 0.4)} ${r(hy2 - 1.4)} L${r(hx2 - 0.4)} ${r(hy2 - 0.2)} Z" fill="#6e3f1c"/>`;
  k += `<rect x="${r(hx2 - 0.3)}" y="${r(hy2 - 1.3)}" width="1.9" height="1" fill="#f3cf5b"/><rect x="${r(hx2 - 0.3)}" y="${r(hy2 - 1.45)}" width="1.9" height=".25" fill="#c99a2e"/>`;
  k += `<path d="M${r(hx2 + 1.7)} ${r(hy2 - 0.2)} Q${r(hx2 + 2)} ${r(hy2 - 1.2)} ${r(hx2 + 1.4)} ${r(hy2 - 1.5)}" fill="#7a4520"/>`;
  k += `<ellipse cx="${r(hx2 + 0.7)}" cy="${r(hy2 - 1.5)}" rx=".5" ry=".14" fill="#c9a227"/><circle cx="${r(hx2 + 0.2)}" cy="${r(hy2 - 1.55)}" r=".28" fill="none" stroke="#f3eee6" stroke-width=".1"/><circle cx="${r(hx2 + 1.1)}" cy="${r(hy2 - 1.58)}" r=".24" fill="none" stroke="#f3eee6" stroke-width=".1"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(hx2 - 1.7 + rnd() * 1.2)}" cy="${r(hy2 - 0.6 - rnd() * 0.7)}" r=".07" fill="#e9dcc4"/>`;
  const zy = FASS.y + top;
  S.teil({ id: "fass", de: "das Fass", syl: "FASS", it: "la botte", itSyl: "BOT-te", en: "barrel", x: FASS.x, y: FASS.y, steht: true, kunst: k,
    tipp: "Vor den Brauhäusern stehen alte Bierfässer als Stehtische.",
    zoom: { x: FASS.x - 13, y: zy - 7, w: 26, h: 17 },
    unter: [
      { id: "altbier", de: "das Altbier", syl: "ALT-bier", it: "la birra Altbier", itSyl: "BIR-ra ALT-bier", en: "altbier", x: FASS.x + bd.x + 0.2, y: zy + 0.1, kunst: flaeche(-1.1, -4.3, 2.2, 4.5, 0.3),
        tipp: "Altbier ist dunkel und kommt aus Düsseldorf. Man trinkt es aus kleinen Gläsern mit 0,25 Litern." },
      { id: "bierdeckel", de: "der Bierdeckel", syl: "BIER-de-ckel", it: "il sottobicchiere", itSyl: "sot-to-bic-CHIE-re", en: "beer mat", x: FASS.x + bd.x - 1.6, y: zy + 0.6, kunst: flaeche(-1, -1, 1.7, 1.6, 0.3),
        tipp: "Für jedes Altbier macht der Köbes einen Strich auf den Bierdeckel." },
      { id: "senf", de: "der Senf", syl: "SENF", it: "la senape", itSyl: "SE-na-pe", en: "mustard", x: FASS.x + sx, y: zy + 0.15, kunst: flaeche(-1.1, -2.8, 2.2, 2.9, 0.3),
        tipp: "Der Löwensenf kommt aus Düsseldorf — scharf und berühmt." },
      { id: "halvehahn", de: "der Halve Hahn", syl: "HAL-ve HAHN", it: "il panino con formaggio", itSyl: "pa-NI-no con for-MAG-gio", en: "rye roll with cheese", x: FASS.x + hx2, y: zy + 0.9, kunst: flaeche(-2.4, -1.7, 4.4, 2.3, 0.3),
        tipp: "Ein „Halve Hahn“ ist kein halbes Hähnchen: Es ist ein Roggenbrötchen mit Käse, Senf und Zwiebeln." },
    ] });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/duesseldorf.js"));
console.log(aus);
