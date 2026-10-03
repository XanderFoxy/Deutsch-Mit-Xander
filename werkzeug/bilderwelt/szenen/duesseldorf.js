#!/usr/bin/env node
/* =====================================================================
   DÜSSELDORF (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … mit Recherche zu
   den einzelnen Städten in Deutschland … auf Hollywood-Niveau“.

   RECHERCHE (visitduesseldorf.de, Structurae „Rheinturm“/„Schlossturm“/
   „Rheinkniebrücke“, Lichtzeitpegel-Beschreibung, Kunstpalast „Markt am
   Rhein (Burgplatz mit Schlossturm und St. Lambertus)“, Rheinkirmes-
   Seiten, Uerige/Zum Schlüssel „Brauhaus-Etikette“, ABB-Mostert):
   - STANDORT: obere Rheinuferpromenade am Nordrand der Altstadt, etwa
     300 m nördlich vom Burgplatz, Blick nach Süden rheinaufwärts.
     Echte Richtungen von hier: links (SSO) über den Dächern St. Lambertus,
     geradeaus am Ufer der Burgplatz mit dem Schlossturm und der breiten
     Rheintreppe; hinter der Rheinbiegung („Rheinknie“, ≈1,5 km) der
     Rheinturm mit dem Landtag, rechts daneben die Gehry-Bauten; quer über
     den Strom die Rheinkniebrücke (Pylone am linken, Oberkasseler Ufer);
     gegenüber auf den Oberkasseler Rheinwiesen die Rheinkirmes mit dem
     Riesenrad (im Juli). Die Richtungen sind gestaucht (Panorama), die
     HÖHEN folgen einer einzigen Kamera: Einheiten je Meter = 373 / Entfernung
     (Schlossturm 330 m → 1,13; Lambertus 300 m → 1,24; Rheinturm 1,4 km →
     0,27; Brücke 1,6 km → 0,235; Medienhafen 1,8 km → 0,21).
   - UFER: Die obere Promenade liegt 5–6 m über der UNTEREN RHEINWERFT
     (Uferweg mit Pollern, Anleger). Von oben sieht man die Ufermauer nicht,
     aber unten den Uferweg; am Burgplatz verbindet die breite Rheintreppe
     beide Ebenen (dort sitzen die Leute).
   - ST. LAMBERTUS: älteste Kirche der Stadt, gotische Hallenkirche aus
     Backstein (1288–1394), großes Schieferdach über den Altstadtdächern,
     Westturm mit schlankem achteckigem Schieferhelm (≈72 m), seit dem
     Wiederaufbau nach dem Brand 1815 VERDREHT (nasses Holz) — die Grate
     winden sich; Legende: der Teufel hat ihn verdreht.
   - SCHLOSSTURM: 33 m, einziger Rest des Schlosses (Brand 1872); drei
     runde Geschosse (13. Jh.), ein vieleckiges Geschoss mit toskanischen
     Säulen (Pasqualini 1552), ein Geschoss mit Rundbogenfenstern (Stüler
     1845), Zeltdach (1950), Wetterfahne mit einem Feuerspucker (1957).
     Heute SchifffahrtMuseum.
   - RHEINTURM: 240,5 m, Betonschaft, Turmkorb mit Restaurant (172 m) und
     Aussichtsebene; am Schaft der LICHTZEITPEGEL (Horst H. Baumann), die
     größte Dezimaluhr der Welt: 62 Bullaugen, von oben nach unten Stunden
     (Zehner, Einer), Minuten, Sekunden; Trennlichter gelb, zwei mit roter
     Flugwarnleuchte. Im Bild: 15:42:37 Uhr. Am Fuß der Landtag (flacher,
     runder, verglaster Bau).
   - NEUER ZOLLHOF (Frank O. Gehry, 1998): drei schiefe „tanzende“ Bauten —
     Osten weißer Putz (der höchste, knapp 50 m), Mitte Edelstahl, Westen
     roter Klinker; vorspringende Kastenfenster.
   - RHEINKNIEBRÜCKE (1969): Schrägseilbrücke in Harfenform, zwei 114 m
     hohe Pylone links des Rheins, 319 m Hauptöffnung, 14 Seile.
   - TYPISCH: Brauhaus mit Ausleger-Schild und Biergarten; Altbier im
     0,25-l-„Becher“; der Köbes in Blau (Strickjacke, lange blaue Schürze,
     Ledertasche) bringt es auf dem runden Tablett, macht Striche auf den
     Bierdeckel; wer genug hat, legt den Deckel aufs Glas. Alte Bierfässer
     als Stehtische. Halve Hahn = Röggelchen (doppeltes Roggenbrötchen) mit
     dicker Scheibe Gouda, Senf und Zwiebeln. Senf heißt auf Platt
     „Mostert“, man isst ihn aus dem grauen Steinzeug-„Mostertpöttche“.
     Die Altstadt mit rund 260 Kneipen heißt „längste Theke der Welt“.
     Die Radschläger (Kinder, die Rad schlagen) sind das Stadtsymbol —
     auch auf den Kanaldeckeln. Die Königsallee („Kö“) liegt östlich
     der Altstadt (nur der Wegweiser zeigt hin).
   UNSICHER (ohne Foto-Beleg, aus Fachwissen): genaue Farbe des Schloss-
   turmputzes, die Form der Gauben am Lambertushelm, das Ausleger-Schild
   (frei erfunden, ohne echten Brauereinamen).
   Maßstab: Augenhöhe y = 116 (≈ 3,5 m über der Promenade, man steht an der
   Rampe zur Oberkasseler Brücke). Auf der Promenade gilt:
   Einheiten je Meter = (y − 116)/3,5. Licht: Sommernachmittag gegen 16 Uhr,
   Sonne im Südwesten (rechts vorn), Schatten fallen nach links.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "duesseldorf", titel: "Düsseldorf", emoji: "🍺", thema: "Deutschland", kuerzel: "dus", fassung: 854 });
const rnd = zufall(1288);
const r = B.r;
const HOR = 116, AUGE = 3.5, F = 373, VX = 112;
const km = (y) => (y - HOR) / AUGE;            /* Einheiten je Meter am Boden in Zeile y */
/* Punkt der nahen Welt: Tiefe d (m), seitlich lat (m, rechts = Westen +), Höhe h (m über der Promenade) */
const P = (d, lat, h = 0) => [r(VX + lat * F / d), r(HOR + (AUGE - h) * F / d)];
const KANTE = 4.4, WERFT_H = -5.5, WERFT_L = 18, WASSER_H = -6.5, HAUS_L = -14;

/* Vieleck auf das Bild zuschneiden — nichts ragt aus dem Rahmen (Sutherland–Hodgman) */
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
/* Strahl vom Fluchtpunkt (seitlich lat, Höhe h) bis zum Bildrand */
const strahl = (lat, h = 0) => { const dx = lat, dy = AUGE - h; let t = 84 / dy; if (VX + dx * t < 0) t = -VX / dx; if (VX + dx * t > 320) t = 208 / dx; return [r(VX + dx * t), r(HOR + dy * t)]; };
/* gerichteter Schlagschatten: Sonne im Südwesten → Schatten nach links (etwas zu uns), Länge ≈ 1,2 × Höhe */
const schlag = (x, y, w, h, a = 0.45) => {
  const L = 1.2 * h, dx = -0.6 * L, dy = 0.45 * L;
  return `<path d="M${r(x - w / 2)} ${r(y)} L${r(x + w / 2)} ${r(y)} L${r(x + w * 0.25 + dx)} ${r(y + dy)} L${r(x - w * 0.25 + dx)} ${r(y + dy)} Z" fill="#26302c" opacity="${r(Math.max(a, 0.4))}" filter="url(#${S.id("schw")})"/>`;
};
const gegen = (svg) => `<g filter="url(#${S.id("gegen")})">${svg}</g>`;
/* Mensch aus dem Baukasten, ohne seinen runden Bodenschatten, Pfade sparsam gerundet (Ladezeit) */
function figur(spec, hoehe, fein = 1) {
  const m = B.mensch(spec, hoehe);
  const kopfY = -0.83 * (m.z.hoehe || 170);
  let z = m.z.svg.replace(/(<g class="mensch">(?:<defs>.*?<\/defs>)?)<ellipse[^>]*\/>/s, "$1");
  /* feine Linien (Haarsträhnen, Falten unter 0,4 cm) sieht man in dieser Größe nicht: weglassen */
  z = z.replace(/<path [^>]*\/>/g, (t) => (/fill="none"/.test(t) && +((t.match(/stroke-width="([\d.]+)"/) || [])[1] || 9) < 0.4) ? "" : t);
  z = z.replace(/ d="([^"]*)"/g, (a, v) => {
    const zs = (v.match(/-?\d+\.?\d*/g) || []).map(Number), ys = zs.filter((_, i) => i % 2);
    const q = Math.min(...ys) < kopfY ? fein : 1;
    return ` d="${v.replace(/-?\d+\.\d+/g, (x) => String(Math.round(+x / q) * q))}"`;
  }).replace(/ (x1|y1|x2|y2)="(-?\d+\.\d+)"/g, (a, n, v) => ` ${n}="${Math.round(+v)}"`);
  return { svg: `<g transform="scale(${m.k.toFixed(4)})">${z}</g>`, k: m.k, z: m.z };
}
/* kleiner Passant in der Ferne (unter ≈ 14 Einheiten): Kopf mit Haar, Schultern, Arme, Beine im Schritt */
function passant(x, y, h, o = {}) {
  const { hemd = "#3d5a80", hose = "#2f3640", haar = "#4a3426", haut = "#e3b796", schritt = 0.1, rock = false, tasche = null, rueck = false } = o;
  const X = (f) => r(x + f * h), Y = (f) => r(y - f * h);
  let g = `<path d="M${X(-0.05)} ${Y(0.5)} L${X(-0.06 - schritt)} ${Y(0.02)} L${X(-0.01 - schritt)} ${Y(0.02)} L${X(0)} ${Y(0.4)} L${X(0.01 + schritt)} ${Y(0.02)} L${X(0.06 + schritt)} ${Y(0.02)} L${X(0.05)} ${Y(0.5)} Z" fill="${rock ? haut : hose}"/>`;
  g += `<path d="M${X(-0.07 - schritt)} ${Y(0.03)} h${r(0.08 * h)} v${r(0.025 * h)} h${r(-0.08 * h)} Z M${X(0.01 + schritt)} ${Y(0.03)} h${r(0.08 * h)} v${r(0.025 * h)} h${r(-0.08 * h)} Z" fill="#2a2420"/>`;
  if (rock) g += `<path d="M${X(-0.08)} ${Y(0.52)} L${X(0.08)} ${Y(0.52)} L${X(0.12)} ${Y(0.3)} L${X(-0.12)} ${Y(0.3)} Z" fill="${hose}"/>`;
  g += `<path d="M${X(-0.11)} ${Y(0.82)} Q${X(-0.12)} ${Y(0.6)} ${X(-0.09)} ${Y(0.48)} L${X(0.09)} ${Y(0.48)} Q${X(0.12)} ${Y(0.6)} ${X(0.11)} ${Y(0.82)} Q${X(0)} ${Y(0.85)} ${X(-0.11)} ${Y(0.82)} Z" fill="${hemd}"/>`;
  g += `<path d="M${X(0.02)} ${Y(0.82)} Q${X(0.12)} ${Y(0.6)} ${X(0.09)} ${Y(0.48)} L${X(0.05)} ${Y(0.48)} Q${X(0.08)} ${Y(0.64)} ${X(0.02)} ${Y(0.82)} Z" fill="#fff" opacity=".18"/>`;
  g += `<path d="M${X(-0.11)} ${Y(0.8)} L${X(-0.15)} ${Y(0.52)} M${X(0.11)} ${Y(0.8)} L${X(0.15)} ${Y(0.52)}" stroke="${hemd}" stroke-width="${r(0.055 * h)}" stroke-linecap="round"/>`;
  g += `<circle cx="${X(-0.15)}" cy="${Y(0.5)}" r="${r(0.026 * h)}" fill="${haut}"/><circle cx="${X(0.15)}" cy="${Y(0.5)}" r="${r(0.026 * h)}" fill="${haut}"/>`;
  if (tasche) g += `<rect x="${X(0.13)}" y="${Y(0.56)}" width="${r(0.09 * h)}" height="${r(0.1 * h)}" rx="${r(0.015 * h)}" fill="${tasche}"/>`;
  g += `<rect x="${X(-0.025)}" y="${Y(0.88)}" width="${r(0.05 * h)}" height="${r(0.06 * h)}" fill="${haut}"/>`;
  g += `<ellipse cx="${X(0)}" cy="${Y(0.93)}" rx="${r(0.06 * h)}" ry="${r(0.07 * h)}" fill="${haut}"/>`;
  g += rueck ? `<ellipse cx="${X(0)}" cy="${Y(0.94)}" rx="${r(0.064 * h)}" ry="${r(0.072 * h)}" fill="${haar}"/>` : `<path d="M${X(-0.064)} ${Y(0.93)} Q${X(-0.06)} ${Y(1.01)} ${X(0)} ${Y(1.005)} Q${X(0.06)} ${Y(1.01)} ${X(0.064)} ${Y(0.93)} Q${X(0.03)} ${Y(0.975)} ${X(-0.064)} ${Y(0.93)} Z" fill="${haar}"/>`;
  return g;
}
/* Kumuluswolke: jede anders, oben hell, unten bläulich grau */
function wolke(x, y, s, seed) {
  const z = zufall(seed);
  let w = `<g filter="url(#${S.id("wolke")})" opacity=".95">`;
  const n = 5 + Math.floor(z() * 5), puffs = [];
  for (let i = 0; i < n; i++) { const t = i / (n - 1) - 0.5; puffs.push([t * 34 * s * (0.8 + z() * 0.4), -(1 - Math.abs(t) * 1.6) * 7 * s * (0.6 + z() * 0.8), (5 + z() * 6) * s * (1 - Math.abs(t) * 0.8)]); }
  w += `<ellipse cx="${x}" cy="${r(y + 2 * s)}" rx="${r(20 * s)}" ry="${r(3 * s)}" fill="#d5dde7"/>`;
  for (const [dx, dy, rr] of puffs) w += `<circle cx="${r(x + dx)}" cy="${r(y + dy)}" r="${r(rr)}" fill="#f4f7fa"/>`;
  for (const [dx, dy, rr] of puffs) w += `<circle cx="${r(x + dx - rr * 0.15)}" cy="${r(y + dy - rr * 0.25)}" r="${r(rr * 0.7)}" fill="#fff"/>`;
  w += `<ellipse cx="${x}" cy="${r(y + 2.4 * s)}" rx="${r(17 * s)}" ry="${r(1.8 * s)}" fill="#c9d3df" opacity=".8"/></g>`;
  return w;
}

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="1.3"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("spiegel")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.1 .45"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("schw")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation=".7"/></filter>`);
/* Gegenlicht: die Sonne steht vorn rechts — Figuren zu uns hin im Eigenschatten (≈15 % dunkler), rechts eine warme Lichtkante */
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("gegen")}" x="-5%" y="-5%" width="110%" height="110%"><feColorMatrix in="SourceGraphic" type="matrix" values=".84 0 0 0 0  0 .84 0 0 0  0 0 .86 0 0  0 0 0 1 0" result="d"/><feGaussianBlur in="SourceAlpha" stdDeviation=".12" result="b"/><feSpecularLighting in="b" surfaceScale="1.4" specularConstant="1.1" specularExponent="24" lighting-color="#fff0d0" result="sp"><feDistantLight azimuth="-40" elevation="16"/></feSpecularLighting><feComposite in="sp" in2="SourceAlpha" operator="in" result="sp2"/><feComposite in="d" in2="sp2" operator="arithmetic" k1="0" k2="1" k3=".85" k4="0"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".25"/></filter>`);
const BETON = S.lg("beton", [[0, "#9a9d9b"], [0.35, "#cdcfcb"], [0.75, "#f1f2ee"], [1, "#c2c5c1"]], 0, 0, 1, 0);
const BACKSTEIN = S.lg("backstein", [[0, "#7a3d29"], [0.5, "#a65a3d"], [0.85, "#c9795a"], [1, "#a8583e"]], 0, 0, 1, 0);
const SCHIEFER = S.lg("schiefer", [[0, "#2c3238"], [0.55, "#48515a"], [1, "#6c7680"]], 0, 0, 1, 0);
const PUTZ = S.lg("putz", [[0, "#b9b1a2"], [0.45, "#e6dfd0"], [0.8, "#f8f3e8"], [1, "#e3dccb"]], 0, 0, 1, 0);
const KUPFER = S.lg("kupfer", [[0, "#5f9c86"], [1, "#3f7564"]]);
const GOLD = S.lg("gold", [[0, "#fff1a8"], [0.4, "#f1c74a"], [1, "#a8781a"]], 0, 0, 1, 1);
const HOLZ = S.lg("holz", [[0, "#5e3b1f"], [0.35, "#8f5f34"], [0.7, "#b07a46"], [1, "#7a4c28"]], 0, 0, 1, 0);
const DUNST = S.lg("dunstblau", [[0, "#b8c6d3"], [1, "#a3b2c0"]]);

/* =====================================================================
   KULISSE — Himmel, ferne Stadt, Ufer gegenüber, Kirmes
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 3}" fill="${S.lg("himmel", [[0, "#5b92cd"], [0.5, "#9fc2e5"], [0.85, "#e3e6e0"], [1, "#f1e8d6"]])}"/>`);
S.hinten(`<circle cx="300" cy="44" r="80" fill="${S.rg("sonne", [[0, "#fff8e0", 0.85], [0.3, "#fff1c8", 0.35], [1, "#fff1c8", 0]])}"/>`);
S.hinten(wolke(150, 22, 0.85, 11) + wolke(236, 16, 1.05, 23) + wolke(48, 50, 0.55, 37) + wolke(196, 64, 0.5, 41) + wolke(268, 40, 0.42, 53));
/* ferne Stadt hinter dem Rheinknie (Unterbilk, Hafen) im Dunst */
{
  let c = "";
  let x = 118;
  while (x < 252) { const w = 2.5 + rnd() * 5, h = 1.4 + rnd() * 3.6; c += `<rect x="${r(x)}" y="${r(117.2 - h)}" width="${r(w + 0.3)}" height="${r(h)}" fill="${DUNST}"/>`; x += w; }
  /* Stadttor (Glasturm, schräge Kanten) und Mannesmann-Hochhaus am Rheinknie */
  c += `<path d="M131 117 L131 100 L136.4 98.6 L136.4 117 Z" fill="${S.lg("stadttor", [[0, "#c6d1db"], [1, "#b8c6d2"]], 0, 0, 1, 0)}"/>`;
  for (let y = 101.4; y < 116.6; y += 1.2) c += `<line x1="131.2" y1="${r(y)}" x2="136.2" y2="${r(y - 1.1)}" stroke="#b0bfcc" stroke-width=".14"/>`;
  c += `<rect x="146" y="93.6" width="6" height="23.6" fill="${S.lg("mannesmann", [[0, "#c2cdd7"], [0.6, "#d3dbe3"], [1, "#c5d0da"]], 0, 0, 1, 0)}"/>`;
  for (let y = 95; y < 117; y += 1) c += `<line x1="146" y1="${r(y)}" x2="152" y2="${r(y)}" stroke="#b3c0cc" stroke-width=".16"/>`;
  c += `<rect x="145.7" y="93" width="6.6" height=".7" fill="#dfe5ea"/>`;
  S.hinten(`<g filter="url(#${S.id("dunst")})">${c}</g>`);
}
/* Oberkasseler Ufer rechts: Rheinwiesen, Häuser am Horizont, Kirmes */
{
  let c = `<path d="M248 116.6 L320 116 L320 121.6 L248 117.5 Z" fill="${S.lg("wiese", [[0, "#a3bb72"], [1, "#84a056"]])}"/>`;
  let x = 248;
  while (x < 320) { const w = 2.5 + rnd() * 4.5, h = 1.2 + rnd() * 2; c += `<rect x="${r(x)}" y="${r(116.4 - h)}" width="${r(w)}" height="${r(h)}" fill="#b9c4cc"/>`; x += w; }
  /* Festzelte: weiße Zeltwände, Spitzdächer mit Bögen, Wimpel */
  const zelt = (x, y, w, h, dach, wimpel) => {
    const n = Math.max(2, Math.round(w / 2.6));
    let g = `<rect x="${r(x)}" y="${r(y - h)}" width="${r(w)}" height="${r(h)}" fill="#f4efe4"/><rect x="${r(x)}" y="${r(y - h * 0.45)}" width="${r(w)}" height="${r(h * 0.45)}" fill="#e2dccf"/>`;
    for (let i = 0; i < n; i++) {
      const a = x + i * w / n, b = a + w / n, m = (a + b) / 2;
      g += `<path d="M${r(a)} ${r(y - h)} Q${r(m - w / n * 0.15)} ${r(y - h - 0.6)} ${r(m)} ${r(y - h - 1.9)} Q${r(m + w / n * 0.15)} ${r(y - h - 0.6)} ${r(b)} ${r(y - h)} Z" fill="${dach}"/>`;
      g += `<path d="M${r(a)} ${r(y - h)} q${r(w / n / 2)} .6 ${r(w / n)} 0" stroke="${dach}" stroke-width=".35" fill="none"/>`;
      g += `<line x1="${r(m)}" y1="${r(y - h - 1.9)}" x2="${r(m)}" y2="${r(y - h - 3)}" stroke="#8a8f94" stroke-width=".12"/><path d="M${r(m)} ${r(y - h - 3)} l.9 .25 l-.9 .25 Z" fill="${wimpel}"/>`;
    }
    return g;
  };
  c += zelt(258, 118.1, 9, 1.6, "#c9302c", "#f2c62f") + zelt(303, 120.7, 13, 2.1, "#2d6fb3", "#f2c62f") + zelt(270, 118.6, 6, 1.3, "#3c8f5a", "#d23b30");
  /* Freifallturm und Kettenkarussell */
  c += `<rect x="315" y="98" width="1.4" height="21.6" fill="#cfd4d8"/><rect x="314.4" y="106" width="2.6" height="1.2" fill="#e0a82e"/><rect x="314.6" y="97.2" width="2.2" height="1.2" fill="#d23b30"/>`;
  c += `<path d="M280 118.6 L280 110.6 M276.4 112.6 Q280 109.6 283.6 112.6" stroke="#bfc6cc" stroke-width=".45" fill="none"/>`;
  for (let i = 0; i < 6; i++) c += `<line x1="${r(276.8 + i * 1.3)}" y1="${r(112.4 + (i % 2) * 0.3)}" x2="${r(275.8 + i * 1.65)}" y2="115" stroke="#9aa3aa" stroke-width=".13"/><circle cx="${r(275.8 + i * 1.65)}" cy="115.2" r=".32" fill="${["#d23b30", "#f2c62f", "#2d6fb3"][i % 3]}"/>`;
  S.hinten(c);
}

/* =====================================================================
   1 — DIE MÖWE
   ===================================================================== */
{
  let k = `<path d="M-6 -1 Q-3 -3.4 0 0 Q3 -3.4 6 -1.2 Q3 -2 0 1 Q-3 -2 -6 -1 Z" fill="#fbfbf8" stroke="#8a9096" stroke-width=".25"/>`;
  k += `<path d="M-6 -1 l1.2 -.5 M6 -1.2 l-1.2 -.3" stroke="#2b2b2b" stroke-width=".5"/><ellipse cx="0" cy=".4" rx="1.2" ry=".7" fill="#fff"/><path d="M1 .3 l1 .2" stroke="#e8b83a" stroke-width=".35"/>`;
  S.teil({ oben: true, id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: 224, y: 50,
    kunst: `<g transform="scale(1.3)">${k}</g>` + flaecheEllipse(0, 0, 8, 4.5) });
}

/* =====================================================================
   2 — DER RHEINTURM mit dem Lichtzeitpegel (Lupe: Uhr, Restaurant, Antenne)
   ===================================================================== */
const RT = { x: 176, y: 117.2, u: 0.27 };
{
  const u = RT.u, H = (m) => r(-m * u);
  let k = "";
  /* Schaft: unten breit, nach oben schlank; Licht von rechts (Südwesten) */
  k += `<path d="M-2.3 0 L-.95 ${H(157)} L.95 ${H(157)} L2.3 0 Z" fill="${BETON}"/>`;
  k += `<path d="M-2.3 0 L-.95 ${H(157)} L-.35 ${H(157)} L-1.3 0 Z" fill="#000" opacity=".1"/>`;
  /* Lichtzeitpegel: 62 Bullaugen, Nr. 1 unten. Uhrzeit 15:42:37 */
  const gruppen = [[1, 11, "gelb"], [12, 20, "s1", 7], [21, 21, "gelb"], [22, 26, "s10", 3], [27, 28, "rot"], [29, 37, "m1", 2], [38, 38, "gelb"], [39, 43, "m10", 4], [44, 45, "rot"], [46, 54, "h1", 5], [55, 55, "gelb"], [56, 57, "h10", 1], [58, 62, "gelb"]];
  const M0 = 36, M1 = 154;
  for (const [a, b, art, an] of gruppen) for (let n = a; n <= b; n++) {
    const m = M0 + (n - 1) * (M1 - M0) / 61, y = -m * u;
    let f = "#5d656e", glow = "";
    if (art === "gelb") f = "#dcbc52";
    else if (art === "rot") f = (n === 28 || n === 45) ? "#e2312a" : "#dcbc52";
    else if (n - a < an) { f = "#fffdf2"; glow = `<circle cx="0" cy="${r(y)}" r=".45" fill="#fff8d0" opacity=".4"/>`; }
    k += glow + `<circle cx="0" cy="${r(y)}" r=".17" fill="${f}"/>`;
  }
  /* Turmkorb: Trichter, zwei Glasringe (Aussicht und Restaurant), Dach */
  k += `<path d="M-.95 ${H(157)} L-4.4 ${H(165)} L4.4 ${H(165)} L.95 ${H(157)} Z" fill="${S.lg("trichter", [[0, "#8a8d8b"], [0.6, "#d6d8d4"], [1, "#b9bcb8"]], 0, 0, 1, 0)}"/>`;
  for (let i = -3; i <= 3; i++) k += `<line x1="${r(i * 0.27)}" y1="${H(157.4)}" x2="${r(i * 1.25)}" y2="${H(164.8)}" stroke="#7d807e" stroke-width=".1"/>`;
  k += `<path d="M-4.4 ${H(165)} L-4.9 ${H(170)} L4.9 ${H(170)} L4.4 ${H(165)} Z" fill="${S.lg("korbglas", [[0, "#2a3a48"], [0.55, "#5d7a92"], [0.82, "#b7cfe2"], [1, "#4c6378"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-5" y="${H(171.2)}" width="10" height="${r(1.2 * u + 0.12)}" fill="#eceee9"/>`;
  k += `<path d="M-4.9 ${H(171.2)} L-4.3 ${H(175.6)} L4.3 ${H(175.6)} L4.9 ${H(171.2)} Z" fill="${S.lg("korbglas2", [[0, "#33475a"], [0.55, "#6e8ca5"], [0.82, "#c3d8e9"], [1, "#56708a"]], 0, 0, 1, 0)}"/>`;
  for (let i = -6; i <= 6; i++) k += `<line x1="${r(i * 0.72)}" y1="${H(165.3)}" x2="${r(i * 0.8)}" y2="${H(169.8)}" stroke="#c9d2d8" stroke-width=".09"/><line x1="${r(i * 0.8)}" y1="${H(171.4)}" x2="${r(i * 0.7)}" y2="${H(175.4)}" stroke="#c9d2d8" stroke-width=".09"/>`;
  k += `<path d="M-4.4 ${H(175.6)} L-1.3 ${H(180)} L1.3 ${H(180)} L4.4 ${H(175.6)} Z" fill="${S.lg("korbdach", [[0, "#9c9f9c"], [0.6, "#e3e5e1"], [1, "#c3c6c2"]], 0, 0, 1, 0)}"/>`;
  /* oberer Schaft mit Antennenplattformen und die rot-weiße Antenne */
  k += `<rect x="-.75" y="${H(197)}" width="1.5" height="${r(17 * u)}" fill="${BETON}"/>`;
  for (const m of [185, 191]) k += `<rect x="-1.35" y="${H(m + 1)}" width="2.7" height="${r(1.2 * u)}" fill="#d4d6d2"/>`;
  k += `<rect x="-.36" y="${H(214)}" width=".72" height="${r(17 * u)}" fill="#e7e9e6"/>`;
  for (let i = 0; i < 6; i++) { const m0 = 214 + i * 4.4, w = 0.33 - i * 0.03; k += `<rect x="${r(-w)}" y="${H(m0 + 4.4)}" width="${r(2 * w)}" height="${r(4.4 * u)}" fill="${i % 2 ? "#f2f2ef" : "#d2282e"}"/>`; }
  k += `<circle cx="0" cy="${H(240.6)}" r=".25" fill="#ff3b30"/>`;
  S.teil({ id: "rheinturm", de: "der Rheinturm", syl: "RHEIN-turm", it: "la torre sul Reno", itSyl: "TOR-re sul RE-no", en: "Rhine Tower",
    x: RT.x, y: r(RT.y - 205 * RT.u), kunst: `<g transform="translate(0 ${r(205 * RT.u)})">${k}</g>`, tipp: "Der Rheinturm ist 240 Meter hoch — das höchste Bauwerk von Düsseldorf.",
    zoom: { x: RT.x - 27, y: 51, w: 54, h: 36 },
    unter: [
      { id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: RT.x, y: RT.y - 95 * RT.u, kunst: flaeche(-1.7, -(59 * RT.u), 3.4, 59 * RT.u, 0.5),
        tipp: "Die Lichter am Schaft sind eine Uhr: oben die Stunden, dann die Minuten, unten die Sekunden." },
      { id: "restaurant", de: "das Restaurant", syl: "res-tau-RANT", it: "il ristorante", itSyl: "ri-sto-RAN-te", en: "restaurant", x: RT.x, y: RT.y - 165 * RT.u, kunst: flaeche(-5, -(10.6 * RT.u), 10, 10.6 * RT.u, 0.5),
        tipp: "Vom Restaurant oben im Rheinturm sieht man über die ganze Stadt." },
    ] });
}

/* =====================================================================
   3 — DER LANDTAG am Fuß des Rheinturms (flacher, runder Glasbau)
   ===================================================================== */
{
  let k = "";
  const ring = (cx, w, h, dach) => `<path d="M${r(cx - w)} 0 L${r(cx - w)} ${r(-h)} Q${cx} ${r(-h - 1.2)} ${r(cx + w)} ${r(-h)} L${r(cx + w)} 0 Z" fill="${S.lg("landtag", [[0, "#d9dedd"], [0.6, "#f1f3f0"], [1, "#c9cfcd"]], 0, 0, 1, 0)}"/>` +
    `<path d="M${r(cx - w + 0.3)} ${r(-h * 0.35)} Q${cx} ${r(-h * 0.35 - 0.6)} ${r(cx + w - 0.3)} ${r(-h * 0.35)} L${r(cx + w - 0.3)} ${r(-h * 0.75)} Q${cx} ${r(-h * 0.75 - 0.7)} ${r(cx - w + 0.3)} ${r(-h * 0.75)} Z" fill="${S.lg("landglas", [[0, "#7e98ab"], [1, "#a8c0d0"]], 0, 0, 1, 0)}"/>` +
    `<path d="M${r(cx - w - 0.3)} ${r(-h)} Q${cx} ${r(-h - 1.4)} ${r(cx + w + 0.3)} ${r(-h)}" stroke="${dach}" stroke-width=".5" fill="none"/>`;
  k += ring(-6, 5.6, 3.4, "#b9c0c2") + ring(4.4, 4.6, 4.2, "#b9c0c2") + ring(12.6, 3.4, 2.8, "#c3c9cb");
  S.teil({ id: "landtag", de: "der Landtag", syl: "LAND-tag", it: "il parlamento regionale", itSyl: "par-la-MEN-to re-gio-NA-le", en: "state parliament", x: 170, y: 117.4, kunst: k + flaeche(-12, -8.2, 28, 8.2),
    tipp: "Im runden Landtag arbeitet das Parlament von Nordrhein-Westfalen. Düsseldorf ist die Hauptstadt des Landes." });
}

/* =====================================================================
   4 — DER MEDIENHAFEN: die drei Gehry-Bauten (Neuer Zollhof)
   ===================================================================== */
{
  let k = "";
  const kasten = (x0, x1, y0, y1, sp, ze, f, rahmen) => {
    let g = "";
    for (let y = y0; y < y1 - 0.4; y += ze) for (let x = x0; x < x1 - 0.3; x += sp) g += `<rect x="${r(x)}" y="${r(y)}" width=".42" height=".5" fill="${f}" stroke="${rahmen}" stroke-width=".08"/>`;
    return g;
  };
  /* Osten (links): weißer Putz, der höchste, geschwungene Türme */
  k += `<path d="M-10 0 L-10 -7.4 Q-10.3 -10.2 -8.5 -11 Q-7 -11.4 -6.6 -9.4 L-6.3 -10.6 Q-5 -12 -3.8 -10.4 L-3.6 0 Z" fill="${S.lg("gehryweiss", [[0, "#cfd2d0"], [0.6, "#f7f8f5"], [1, "#e9ece9"]], 0, 0, 1, 0)}"/>`;
  k += kasten(-9.5, -6.8, -9.4, -0.3, 0.8, 0.95, "#4b5a66", "#fafafa") + kasten(-6.1, -3.9, -9.6, -0.3, 0.8, 0.95, "#4b5a66", "#fafafa");
  /* Mitte: Edelstahl, gewellt, spiegelt den Himmel */
  k += `<path d="M-3.6 0 L-3.8 -6.8 Q-2.8 -8.8 -1.1 -7.6 Q.4 -6.6 1.2 -8.2 Q2.2 -8.8 2.7 -6.8 L2.8 0 Z" fill="${S.lg("gehrystahl", [[0, "#7c8a96"], [0.3, "#e8eef3"], [0.55, "#a6b4c0"], [0.8, "#f3f6f8"], [1, "#8d9ba7"]], 0, 0, 1, 0)}"/>`;
  k += kasten(-3.1, 2.4, -6.4, -0.3, 0.85, 0.95, "#33414d", "#c8d0d6");
  /* Westen (rechts): roter Klinker mit weißen Kastenfenstern */
  k += `<path d="M2.8 0 L2.7 -7.8 Q3.8 -9.6 5.4 -9 L5.6 -7.4 Q7.2 -9 9 -7.6 L9.1 0 Z" fill="${S.lg("gehryrot", [[0, "#7f3326"], [0.6, "#b4553d"], [1, "#9a4430"]], 0, 0, 1, 0)}"/>`;
  k += kasten(3.2, 8.8, -7.2, -0.3, 0.85, 0.95, "#3a3330", "#f2efe8");
  S.teil({ id: "medienhafen", de: "der Medienhafen", syl: "ME-di-en-ha-fen", it: "il porto dei media", itSyl: "POR-to dei ME-dia", en: "Media Harbour",
    x: 203, y: 117.4, kunst: k + flaeche(-10.5, -12, 20, 12.4, 0.5), tipp: "Die drei schiefen Häuser im Medienhafen hat der Architekt Frank Gehry gebaut: weiß, silbern und rot." });
}

/* =====================================================================
   5 — DIE RHEINKNIEBRÜCKE (Schrägseilbrücke, Harfe) — Lupe: Pylon, Seil
   ===================================================================== */
const deckY = (x) => 112.4 + 0.00006 * Math.pow(x - 240, 2);
const PY = { x: 254, top: 90.6, fuss: 117.4 };
const STEIG = 0.33;
const SEILE_V = [92, 95.6, 99.2, 102.8], SEILE_H = [93.8, 97.4, 101];
{
  let k = "";
  const seile = (px, farbe, w) => {
    let g = "";
    for (const yp of SEILE_V) { const x2 = px - (deckY(px) - yp) / STEIG; g += `<line x1="${px}" y1="${yp}" x2="${r(x2)}" y2="${r(deckY(x2))}" stroke="${farbe}" stroke-width="${w}"/>`; }
    for (const yp of SEILE_H) { const x2 = px + (deckY(px) - yp) / STEIG; g += `<line x1="${px}" y1="${yp}" x2="${r(x2)}" y2="${r(deckY(x2))}" stroke="${farbe}" stroke-width="${w}"/>`; }
    return g;
  };
  /* hinterer Pylon und seine Seile (Dunst) */
  k += seile(PY.x + 0.9, "#b4bdc3", 0.2);
  k += `<path d="M${PY.x + 0.4} ${PY.fuss} L${PY.x + 0.6} ${PY.top - 0.3} L${PY.x + 1.3} ${PY.top - 0.3} L${PY.x + 1.5} ${PY.fuss} Z" fill="#bec6cb"/>`;
  /* Fahrbahn (Stahlkasten) mit Geländer und Verkehr */
  const o = [], u = [];
  for (let x = 158; x <= 320; x += 6) { o.push(`${x} ${r(deckY(x))}`); u.push(`${x} ${r(deckY(x) + 0.95)}`); }
  k += `<path d="M${o.join(" L")} L${u.reverse().join(" L")} Z" fill="${S.lg("deck", [[0, "#e7eaec"], [0.45, "#c3cbd0"], [1, "#8e989f"]])}"/>`;
  k += `<path d="M${o.join(" L")}" stroke="#f6f8f9" stroke-width=".25" fill="none"/>`;
  for (const [x, f] of [[176, "#d23b30"], [191, "#f2f2f2"], [207, "#2d6fb3"], [222, "#3a3a3a"], [238, "#e0a82e"], [272, "#f2f2f2"], [291, "#2d6fb3"], [306, "#d23b30"]])
    k += `<rect x="${x}" y="${r(deckY(x) - 0.55)}" width="1.2" height=".5" rx=".2" fill="${f}"/>`;
  /* Rampe am rechten Ufer (links im Bild) hinunter zum Mannesmannufer */
  k += `<path d="M158 ${r(deckY(158))} L150 115.4 L150 116.2 L158 ${r(deckY(158) + 0.95)} Z" fill="${S.lg("rampe", [[0, "#dfe3e5"], [1, "#a9b1b6"]])}"/>`;
  k += `<rect x="154" y="${r(deckY(154) + 0.8)}" width=".9" height="${r(117 - deckY(154) - 0.8)}" fill="#c3c9cd"/>`;
  /* vorderer Pylon: schlank, nach oben schmaler */
  k += `<path d="M${PY.x - 0.8} ${PY.fuss} L${PY.x - 0.5} ${PY.top} L${PY.x + 0.5} ${PY.top} L${PY.x + 0.7} ${PY.fuss} Z" fill="${S.lg("pylon", [[0, "#a3adb4"], [0.5, "#e9edef"], [1, "#f6f8f9"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${PY.x - 0.7}" y="${PY.top - 0.6}" width="1.4" height=".7" rx=".2" fill="#cfd6db"/><circle cx="${PY.x}" cy="${PY.top - 0.9}" r=".25" fill="#ff3b30"/>`;
  k += seile(PY.x, "#eef2f4", 0.26);
  /* Pfeiler im Vorland */
  for (const x of [276, 298]) k += `<rect x="${x - 0.5}" y="${r(deckY(x) + 0.95)}" width="1" height="${r(118.2 - deckY(x) - 0.95)}" fill="#c3c9cd"/>`;
  /* ein Frachtschiff fährt unter der Brücke durch */
  k += `<path d="M206 117.6 L226 117.6 L226.6 116.4 L205.4 116.4 Z" fill="#2a2d31"/><rect x="208" y="115.2" width="13" height="1.2" fill="#c9302c"/><rect x="222" y="114.4" width="3" height="2" fill="#f4f1ea"/>`;
  /* Trefferfläche des Seils: schmales Band entlang EINES Seils */
  const yp = SEILE_V[0], x2 = 216, y2 = yp + (PY.x - 216) * STEIG;
  S.teil({ id: "rheinkniebruecke", de: "die Rheinkniebrücke", syl: "RHEIN-knie-brü-cke", it: "il ponte Rheinknie", itSyl: "PON-te RHEIN-knie", en: "Rheinknie Bridge",
    x: 0, y: 0, kunst: k, tipp: "Die Brücke hängt an Stahlseilen. Als sie 1969 fertig war, hatte keine Schrägseilbrücke der Welt eine größere Spannweite.",
    zoom: { x: 206, y: 84, w: 60, h: 40 },
    unter: [
      { id: "pylon", de: "der Pylon", syl: "py-LON", it: "il pilone", itSyl: "pi-LO-ne", en: "pylon", x: PY.x, y: (PY.top + PY.fuss) / 2, kunst: flaeche(-1.4, PY.top - 1.4 - (PY.top + PY.fuss) / 2, 3.2, PY.fuss - PY.top + 1.4, 0.4),
        tipp: "Die zwei Pylone sind 114 Meter hoch." },
      { id: "seil", de: "das Seil", syl: "SEIL", it: "il cavo", itSyl: "CA-vo", en: "cable", x: r((PY.x + x2) / 2), y: r((yp + y2) / 2),
        kunst: `<path class="bw-flaeche" d="M${r(PY.x - (PY.x + x2) / 2)} ${r(yp - 1.6 - (yp + y2) / 2)} L${r(PY.x - (PY.x + x2) / 2)} ${r(yp + 1.6 - (yp + y2) / 2)} L${r(x2 - (PY.x + x2) / 2)} ${r(y2 + 1.6 - (yp + y2) / 2)} L${r(x2 - (PY.x + x2) / 2)} ${r(y2 - 1.6 - (yp + y2) / 2)} Z" fill="rgba(255,255,255,0.001)"/>`,
        tipp: "Die Seile laufen parallel wie die Saiten einer Harfe." },
    ] });
}

/* =====================================================================
   6 — DAS RIESENRAD der Rheinkirmes (Oberkasseler Ufer)
   ===================================================================== */
{
  const R = 11.6, cy = -14.6;
  let k = "";
  k += `<path d="M-5.8 0 L-.5 ${cy} M5.8 0 L.5 ${cy} M-6.6 0 L-1.1 ${cy + 0.8} M6.6 0 L1.1 ${cy + 0.8}" stroke="#e8ecee" stroke-width=".55"/>`;
  k += `<path d="M-4.6 -4.6 L4.6 -4.6" stroke="#d4dadd" stroke-width=".3"/>`;
  k += `<circle cx="0" cy="${cy}" r="${R}" fill="#eef2f4" opacity=".28"/><circle cx="0" cy="${cy}" r="${R}" fill="none" stroke="#f6f8f9" stroke-width=".45"/><circle cx="0" cy="${cy}" r="${R - 0.9}" fill="none" stroke="#e3e8eb" stroke-width=".25"/>`;
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; k += `<line x1="0" y1="${cy}" x2="${r(Math.cos(a) * (R - 0.5))}" y2="${r(cy + Math.sin(a) * (R - 0.5))}" stroke="#e8ecee" stroke-width=".18"/>`; }
  k += `<circle cx="0" cy="${cy}" r="1" fill="#c9cfd3"/><circle cx="0" cy="${cy}" r=".4" fill="#8e989f"/>`;
  const farben = ["#d23b30", "#f2c62f", "#2d6fb3", "#3c8f5a", "#e46aa0", "#f08a3c"];
  for (let i = 0; i < 16; i++) {
    const a = i * Math.PI / 8, gx = Math.cos(a) * R, gy = cy + Math.sin(a) * R;
    k += `<line x1="${r(gx)}" y1="${r(gy)}" x2="${r(gx)}" y2="${r(gy + 0.8)}" stroke="#bbb" stroke-width=".12"/><path d="M${r(gx - 0.85)} ${r(gy + 0.8)} h1.7 v1.15 q0 .45 -.45 .45 h-.8 q-.45 0 -.45 -.45 Z" fill="${farben[i % 6]}"/><rect x="${r(gx - 0.6)}" y="${r(gy + 1)}" width="1.2" height=".38" fill="#cfe3ee" opacity=".85"/>`;
  }
  k += `<rect x="-7" y="-1.3" width="14" height="1.3" fill="#f1ece0"/><rect x="-7" y="-1.8" width="14" height=".55" fill="#d23b30"/>`;
  /* Kirmesbuden vor dem Rad (sie stehen zwischen uns und der Brücke) */
  for (const [x0, w, f] of [[-16, 7, "#c9302c"], [8.4, 8, "#2d6fb3"], [-6.4, 4.4, "#3c8f5a"]]) {
    k += `<rect x="${x0}" y="-1.8" width="${w}" height="1.9" fill="#f4efe4"/>`;
    for (let i = 0; i < Math.round(w / 2.2); i++) { const a = x0 + i * 2.2; k += `<path d="M${r(a)} -1.8 L${r(a + 1.1)} -3.3 L${r(a + 2.2)} -1.8 Z" fill="${i % 2 ? "#f4efe4" : f}"/>`; }
  }
  S.teil({ id: "riesenrad", de: "das Riesenrad", syl: "RIE-sen-rad", it: "la ruota panoramica", itSyl: "RUO-ta pa-no-RA-mi-ca", en: "Ferris wheel",
    x: 292, y: 119.2, kunst: k, tipp: "Im Juli ist auf den Rheinwiesen die Rheinkirmes — eine der größten Kirmessen in Deutschland." });
}

/* =====================================================================
   KULISSE NAH: das Ufer jenseits des Burgplatzes (Rathausufer bis Rheinknie)
   mit Ufermauer, Kasematten-Bögen, unterer Werft und Platanen
   ===================================================================== */
{
  let c = "";
  for (let x = 118; x < 166; x += 1.9 + rnd() * 1.3) { const s = 1 - (x - 118) / 90; c += `<circle cx="${r(x)}" cy="${r(MAUER_O(x) - 1.4 - s * 0.6 - rnd() * 0.6)}" r="${r(1.2 + s * 1.2 + rnd() * 0.5)}" fill="${S.rg("baumfern", [[0, "#9bb174"], [1, "#5b7543"]], 0.6, 0.35, 0.7)}"/>`; }
  S.hinten(c);
}

/* =====================================================================
   11 — DER RHEIN (mit Spiegelungen)
   ===================================================================== */
const WERFT_RAND = strahl(WERFT_L, WERFT_H);
/* ferne Ufermauer hinter dem Burgplatz (Rathausufer): Oberkante und Wasserlinie, nach hinten flacher */
function MAUER_O(x) { return r(118.7 - Math.max(0, x - 131) * 0.036); }
function MAUER_U(x) { return r(122.3 - Math.max(0, x - 131) * 0.105); }
{
  const wasser = [[118, 118.2], [250, 117.4], [320, 122], [320, 200], WERFT_RAND];
  let k = vieleck(wasser, S.lg("wasser", [[0, "#a7bbbd"], [0.3, "#829899"], [1, "#4f6763"]]));
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".3">`;
  k += `<rect x="174.6" y="118.2" width="2.8" height="18" fill="#dfe2de"/><rect x="171.4" y="118.4" width="9" height="2.6" fill="#5d7a92"/><rect x="253" y="118" width="2" height="9" fill="#eef1f2"/><rect x="158" y="118.2" width="160" height="1.6" fill="#c3cbd0"/>`;
  k += `<rect x="281" y="119" width="22" height="7" rx="3" fill="#f4f6f7" opacity=".6"/><rect x="193" y="118.2" width="20" height="3.6" fill="#d9c9c0"/><rect x="110" y="118.6" width="11" height="6" fill="#e6dfd0"/>`;
  k += `</g>`;
  for (let i = 0; i < 170; i++) {
    const y = 119 + Math.pow(rnd(), 0.8) * 81, x = 112 + rnd() * 210, w = 1.2 + (y - 116) * 0.22 * rnd() + 0.6;
    if (x < VX + (WERFT_L / (AUGE - WERFT_H)) * (y - HOR) + 1) continue;
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} -.5 ${r(Math.min(w, 320 - x))} 0" stroke="${rnd() < 0.55 ? "#eef4f3" : "#3d524e"}" stroke-width="${r(0.12 + (y - 116) * 0.009)}" fill="none" opacity="${r(0.3 + rnd() * 0.4)}"/>`;
  }
  /* ferne Ufermauer im Sonnenlicht, mit Kasematten-Bögen und hellem Abdeckstein */
  {
    const xa = 131, xb = 162;
    k += `<path d="M${xa} ${MAUER_O(xa)} L${xb} ${MAUER_O(xb)} L${xb} ${MAUER_U(xb)} L${xa} ${MAUER_U(xa)} Z" fill="${S.lg("ufermauer", [[0, "#ecdcbc"], [1, "#cdb894"]])}"/>`;
    k += `<path d="M${xa} ${MAUER_O(xa)} L${xb} ${MAUER_O(xb)}" stroke="#fbf3e0" stroke-width=".45"/>`;
    for (let x = xa + 1; x < xb - 1.5; x += 2.6 - (x - xa) * 0.035) {
      const o = MAUER_O(x), u = MAUER_U(x), hh = u - o, w = 0.55 * hh;
      k += `<path d="M${r(x)} ${r(u - 0.15 * hh)} L${r(x)} ${r(o + 0.42 * hh)} A${r(w / 2)} ${r(w / 2)} 0 0 1 ${r(x + w)} ${r(o + 0.42 * hh)} L${r(x + w)} ${r(u - 0.15 * hh)} Z" fill="#5e4c3a"/>`;
    }
    k += `<path d="M${xa} ${MAUER_U(xa)} L${xb} ${MAUER_U(xb)} L${xb} ${r(MAUER_U(xb) + 0.8)} L${xa} ${r(MAUER_U(xa) + 1.8)} Z" fill="#e8dcc4" opacity=".35"/>`;
  }
  /* Glitzerpfad unter der Sonne: nach vorn breiter, heller und dichter als die übrigen Wellen */
  for (let i = 0; i < 120; i++) {
    const y = 119 + Math.pow(rnd(), 1.25) * 81, b = 1.6 + (y - 119) * 0.2, x = 300 - (y - 119) * 0.08 + (rnd() + rnd() - 1) * b, w = 0.5 + rnd() * (0.8 + (y - 119) * 0.05);
    if (x > 319) continue;
    k += `<rect x="${r(x)}" y="${r(y)}" width="${r(Math.min(w, 320 - x))}" height="${r(0.22 + (y - 119) * 0.006)}" fill="#fffdf0" opacity="${r(0.6 + rnd() * 0.4)}"/>`;
  }
  /* Sonnenglitzern rechts (Gegenlicht) */
  for (let i = 0; i < 40; i++) { const y = 120 + rnd() * 50, x = 226 + rnd() * 92; if (x < VX + 2 * (y - HOR) + 2) continue; k += `<rect x="${r(x)}" y="${r(y)}" width="${r(0.6 + rnd() * 1.6)}" height=".28" fill="#fffbe8" opacity="${r(0.45 + rnd() * 0.5)}"/>`; }
  S.teil({ id: "rhein", de: "der Rhein", syl: "RHEIN", it: "il Reno", itSyl: "RE-no", en: "the Rhine", x: 0, y: 0, kunst: k,
    tipp: "Der Rhein macht in Düsseldorf einen großen Bogen — das „Rheinknie“." });
}

/* =====================================================================
   12 — DAS AUSFLUGSSCHIFF (legt am Burgplatz ab und fährt rheinaufwärts) — von achtern, Dreiviertelansicht
   ===================================================================== */
{
  const D0 = 104, D1 = 156, L0 = 31, L1 = 39, LM = (L0 + L1) / 2, W = WASSER_H, OB = W + 2.3, SD = OB + 2.4;
  const q = (pts, f, extra = "") => `<path d="M${pts.map((p) => p.join(" ")).join(" L")} Z" fill="${f}"${extra}/>`;
  const BUG = D1 + 9;                                      /* Bugspitze */
  const ob = (d) => OB + Math.max(0, (d - D1) / (BUG - D1)) * 1.4;   /* Deckssprung: der Bug steigt an */
  let k = "";
  /* Kielwasser: zwei auseinanderlaufende Schaumlinien und weißes Schraubenwasser */
  for (const s1 of [-1, 1]) for (let i = 0; i <= 9; i++) {
    const dd = D0 - 1 - i * 2, l = LM + s1 * (3.6 + i * 0.75), a = 0.85 - i * 0.07;
    for (let j = 0; j < 3; j++) { const pt = P(dd - rnd() * 1.5, l + (rnd() - 0.5) * 0.8, W), w = (1 + rnd() * 1.6) * F / dd / 3; k += `<path d="M${pt[0]} ${pt[1]} q${r(w / 2)} -.25 ${r(w)} 0" stroke="#fbfdfd" stroke-width="${r(0.25 + 0.04 * F / dd)}" fill="none" opacity="${r(a * (0.6 + rnd() * 0.4))}"/>`; }
  }
  /* Rumpf: Heckspiegel (zu uns), Bordwand an der linken Seite, spitzer Bug hinten */
  /* Spiegelheck: unten gerundet und eingezogen, darunter die dunkle Wasserlinie */
  const pj = (p) => p.join(" ");
  k += `<path d="M${pj(P(D0, L0, OB))} L${pj(P(D0, L0, W + 0.7))} Q${pj(P(D0, L0 + 0.2, W))} ${pj(P(D0, L0 + 1, W))} L${pj(P(D0, L1 - 1, W))} Q${pj(P(D0, L1 - 0.2, W))} ${pj(P(D0, L1, W + 0.7))} L${pj(P(D0, L1, OB))} Z" fill="${S.lg("heck", [[0, "#ffffff"], [0.5, "#eef2f4"], [0.55, "#1f3f78"], [1, "#16305e"]])}"/>`;
  const seite = [P(D0, L0, W), P(D1, L0, W), P(BUG, LM, W + 0.6), P(BUG, LM, ob(BUG)), P(D1, L0, ob(D1)), P(D0, L0, OB)];
  k += q(seite, S.lg("rumpf", [[0, "#ffffff"], [0.42, "#eef2f4"], [0.47, "#1f3f78"], [1, "#16305e"]]));
  k += `<path d="M${P(D0, L0, W + 1.1).join(" ")} L${P(D1, L0, W + 1.1).join(" ")} L${P(BUG, LM, W + 1.6).join(" ")}" stroke="#c9302c" stroke-width=".35" fill="none"/>`;
  k += `<path d="M${pj(P(BUG, LM, W + 0.5))} L${pj(P(D1, L0, W))} L${pj(P(D0, L0 + 0.8, W))} L${pj(P(D0, L1 - 0.8, W))}" stroke="#14242e" stroke-width=".45" fill="none" opacity=".55"/>`;
  /* Name auf der Bordwand */
  const n0 = P(D0 + 28, L0, W + 1.5), n1 = P(D0 + 6, L0, W + 1.5), sk = F / (D0 + 16);
  k += `<g transform="matrix(${r((n1[0] - n0[0]) / 30)} ${r((n1[1] - n0[1]) / 30)} 0 ${r(sk / 4)} ${n0[0]} ${n0[1]})"><text x="0" y="0" font-size="3.4" fill="#f4f6f8" font-family="Arial,sans-serif" font-weight="bold">DÜSSELDORF</text></g>`;
  /* Salondeck mit umlaufendem Fensterband */
  const sal = (h) => [P(D0 + 1.6, L0 + 0.4, h), P(D1 - 1, L0 + 0.4, h)];
  k += q([P(D0 + 1.6, L0 + 0.4, OB), P(D1 - 1, L0 + 0.4, OB), P(D1 - 1, L0 + 0.4, SD), P(D0 + 1.6, L0 + 0.4, SD)], "#f7f8f9");
  k += q([P(D0 + 1.6, L0 + 0.4, OB), P(D0 + 1.6, L1 - 0.4, OB), P(D0 + 1.6, L1 - 0.4, SD), P(D0 + 1.6, L0 + 0.4, SD)], "#eef1f3");
  k += q([P(D0 + 1.6, L0 + 0.4, OB + 0.5), P(D1 - 2, L0 + 0.4, OB + 0.5), P(D1 - 2, L0 + 0.4, SD - 0.4), P(D0 + 1.6, L0 + 0.4, SD - 0.4)], S.lg("salon", [[0, "#a9c2d4"], [1, "#2f4b62"]]));
  k += q([P(D0 + 1.6, L0 + 0.8, OB + 0.5), P(D0 + 1.6, L1 - 0.8, OB + 0.5), P(D0 + 1.6, L1 - 0.8, SD - 0.4), P(D0 + 1.6, L0 + 0.8, SD - 0.4)], S.lg("salon2", [[0, "#9db8cc"], [1, "#2f4b62"]]));
  for (let dd = D0 + 4.5; dd < D1 - 2; dd += 3.2) { const a1 = P(dd, L0 + 0.4, OB + 0.5), a2 = P(dd, L0 + 0.4, SD - 0.4); k += `<line x1="${a1[0]}" y1="${a1[1]}" x2="${a2[0]}" y2="${a2[1]}" stroke="#f7f8f9" stroke-width=".3"/>`; }
  k += q([P(D0 + 1.6, L0 + 0.4, SD), P(D1 - 1, L0 + 0.4, SD), P(D1 - 1, L1 - 0.4, SD), P(D0 + 1.6, L1 - 0.4, SD)], "#cfd8de");
  /* Steuerhaus vorn auf dem Sonnendeck */
  k += q([P(D1 - 10, L0 + 2.2, SD), P(D1 - 4, L0 + 2.2, SD), P(D1 - 4, L0 + 2.2, SD + 2.4), P(D1 - 10, L0 + 2.2, SD + 2.4)], "#f4f6f7");
  k += q([P(D1 - 10, L0 + 2.2, SD), P(D1 - 10, L1 - 2.2, SD), P(D1 - 10, L1 - 2.2, SD + 2.4), P(D1 - 10, L0 + 2.2, SD + 2.4)], "#e6eaed");
  k += q([P(D1 - 10, L0 + 2.6, SD + 1.2), P(D1 - 10, L1 - 2.6, SD + 1.2), P(D1 - 10, L1 - 2.6, SD + 2.1), P(D1 - 10, L0 + 2.6, SD + 2.1)], "#2e4658");
  k += q([P(D1 - 9.6, L0 + 2.2, SD + 1.2), P(D1 - 4.4, L0 + 2.2, SD + 1.2), P(D1 - 4.4, L0 + 2.2, SD + 2.1), P(D1 - 9.6, L0 + 2.2, SD + 2.1)], "#3d5a73");
  k += q([P(D1 - 10.4, L0 + 1.8, SD + 2.4), P(D1 - 3.6, L0 + 1.8, SD + 2.4), P(D1 - 3.6, L1 - 1.8, SD + 2.4), P(D1 - 10.4, L1 - 1.8, SD + 2.4)], "#1f3f78");
  /* Fahrgäste auf dem Sonnendeck (hinter der Reling) */
  for (const [dd, f, l, haar] of [[D0 + 6, "#c9302c", 34, "#3a2a20"], [D0 + 10, "#2d6fb3", 36.6, "#c9a466"], [D0 + 15, "#f2c62f", 33.2, "#2b2b2b"], [D0 + 21, "#3ca35a", 35.6, "#6b4a33"], [D0 + 27, "#e6e6e6", 33.4, "#c9a466"], [D0 + 33, "#e46aa0", 36.2, "#3a2a20"]]) {
    const pt = P(dd, l, SD);
    k += passant(pt[0], pt[1], 1.7 * F / dd, { hemd: f, haar, rueck: true });
  }
  /* Reling: Handlauf mit Pfosten um das Sonnendeck */
  const rel = (h) => [P(D0 + 1.8, L1 - 0.5, h), P(D0 + 1.8, L0 + 0.5, h), P(D1 - 1.2, L0 + 0.5, h)];
  for (const h of [SD + 1, SD + 0.5]) { const [a1, a2, a3] = rel(h); k += `<path d="M${a1.join(" ")} L${a2.join(" ")} L${a3.join(" ")}" stroke="#7d878e" stroke-width="${h > SD + 0.8 ? 0.28 : 0.16}" fill="none"/>`; }
  for (let dd = D0 + 1.8; dd < D1 - 1; dd += 2.6) { const a1 = P(dd, L0 + 0.5, SD), a2 = P(dd, L0 + 0.5, SD + 1); k += `<line x1="${a1[0]}" y1="${a1[1]}" x2="${a2[0]}" y2="${a2[1]}" stroke="#7d878e" stroke-width=".14"/>`; }
  for (let l = L0 + 0.5; l < L1; l += 1.6) { const a1 = P(D0 + 1.8, l, SD), a2 = P(D0 + 1.8, l, SD + 1); k += `<line x1="${a1[0]}" y1="${a1[1]}" x2="${a2[0]}" y2="${a2[1]}" stroke="#7d878e" stroke-width=".16"/>`; }
  /* Flaggenstock am Heck, Flagge weht nach hinten */
  const fl = P(D0 + 0.6, LM, OB), fl2 = P(D0 + 0.6, LM, OB + 3.2);
  k += `<line x1="${fl[0]}" y1="${fl[1]}" x2="${r(fl2[0] - 0.6)}" y2="${fl2[1]}" stroke="#8a8f94" stroke-width=".25"/>`;
  k += `<path d="M${r(fl2[0] - 0.6)} ${fl2[1]} q-1.4 -.3 -2.8 .2 l0 .6 q1.4 -.4 2.8 -.1 Z" fill="#1d1d1d"/><path d="M${r(fl2[0] - 0.6)} ${r(fl2[1] + 0.6)} q-1.4 -.3 -2.8 .2 l0 .6 q1.4 -.4 2.8 -.1 Z" fill="#dd2a24"/><path d="M${r(fl2[0] - 0.6)} ${r(fl2[1] + 1.2)} q-1.4 -.3 -2.8 .2 l0 .6 q1.4 -.4 2.8 -.1 Z" fill="#f2c62f"/>`;
  S.teil({ id: "ausflugsschiff", de: "das Ausflugsschiff", syl: "AUS-flugs-schiff", it: "il battello turistico", itSyl: "bat-TEL-lo tu-RI-sti-co", en: "sightseeing boat",
    x: 0, y: 0, kunst: k, tipp: "Am Burgplatz legen die Ausflugsschiffe ab. Dann geht es auf dem Rhein zum Rheinturm und zum Medienhafen." });
}

/* =====================================================================
   13 — DIE UNTERE WERFT: Uferweg unten am Wasser mit Pollern und Spaziergängern
   ===================================================================== */
{
  const KANTE_STRAHL = strahl(KANTE, 0);
  let k = vieleck([[VX, HOR], KANTE_STRAHL, [320, 200], WERFT_RAND], S.lg("werft", [[0, "#b7ad9c"], [1, "#9a907f"]]));
  /* Basaltpflaster-Fugen, Wasserkante mit hellem Stein */
  for (const l of [12, 14, 16]) { const b = strahl(l, WERFT_H); k += `<line x1="${VX}" y1="${HOR}" x2="${b[0]}" y2="${b[1]}" stroke="#857b6c" stroke-width=".22" opacity=".6"/>`; }
  for (let d = 40; d < 400; d *= 1.1) { const a = P(d, KANTE * (AUGE - WERFT_H) / AUGE, WERFT_H), b = P(d, WERFT_L, WERFT_H); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#857b6c" stroke-width=".2" opacity=".5"/>`; }
  const wr = strahl(WERFT_L - 0.6, WERFT_H);
  k += vieleck([[VX, HOR], wr, WERFT_RAND], "#ddd5c6");
  /* Poller (Gusseisen) an der Wasserkante */
  for (let d = 42; d < 260; d *= 1.32) {
    const p = P(d, WERFT_L - 0.5, WERFT_H), s = F / d;
    if (p[0] > 318) continue;
    k += `<path d="M${r(p[0] - 0.22 * s)} ${p[1]} L${r(p[0] - 0.18 * s)} ${r(p[1] - 0.6 * s)} Q${p[0]} ${r(p[1] - 0.78 * s)} ${r(p[0] + 0.18 * s)} ${r(p[1] - 0.6 * s)} L${r(p[0] + 0.22 * s)} ${p[1]} Z" fill="#2b3135"/><ellipse cx="${p[0]}" cy="${r(p[1] - 0.62 * s)}" rx="${r(0.24 * s)}" ry="${r(0.07 * s)}" fill="#4f575c"/>`;
  }
  /* Spaziergänger unten am Wasser */
  for (const [d, l, f, haar] of [[64, 13.6, "#d9534a", "#3a2a20"], [70, 14.6, "#f2efe6", "#c9a466"], [118, 13, "#2d6fb3", "#2b2b2b"], [150, 15, "#e0a82e", "#6b4a33"]]) {
    const p = P(d, l, WERFT_H);
    k += passant(p[0], p[1], 1.72 * F / d, { hemd: f, haar, schritt: 0.08 });
  }
  /* Anleger: Ponton im Wasser mit Steg vom Uferweg */
  {
    const p0 = P(84, WERFT_L + 3, WASSER_H + 0.6), p1 = P(112, WERFT_L + 3, WASSER_H + 0.6), p2 = P(112, WERFT_L + 8, WASSER_H + 0.6), p3 = P(84, WERFT_L + 8, WASSER_H + 0.6);
    k += vieleck([P(84, WERFT_L + 3, WASSER_H), P(112, WERFT_L + 3, WASSER_H), p1, p0], "#262f35") + vieleck([p0, p1, p2, p3], "#7d858a");
    for (let d = 87; d < 112; d += 6) { const f = P(d, WERFT_L + 3, WASSER_H + 0.3), s1 = F / d; k += `<rect x="${r(f[0] - 0.18 * s1)}" y="${r(f[1] - 0.2 * s1)}" width="${r(0.36 * s1)}" height="${r(0.42 * s1)}" rx="${r(0.12 * s1)}" fill="#141a1e"/>`; }
    k += vieleck([P(98, WERFT_L + 8, WASSER_H + 0.6), P(101, WERFT_L + 8, WASSER_H + 0.6), P(101, 31, WASSER_H + 2.3), P(98, 31, WASSER_H + 2.3)], "#9aa1a5");
    for (const l of [WERFT_L + 8, 28.5, 31]) { const a1 = P(98, l, WASSER_H + 0.6 + (l - WERFT_L - 8) * 0.34), a2 = P(98, l, WASSER_H + 1.6 + (l - WERFT_L - 8) * 0.34); k += `<line x1="${a1[0]}" y1="${a1[1]}" x2="${a2[0]}" y2="${a2[1]}" stroke="#eef1f2" stroke-width=".16"/>`; }
    k += `<path d="M${P(98, WERFT_L + 8, WASSER_H + 1.6).join(" ")} L${P(98, 31, WASSER_H + 3.3).join(" ")}" stroke="#eef1f2" stroke-width=".2"/>`;
    k += `<path d="M${P(84, WERFT_L + 3, WASSER_H + 1.6).join(" ")} L${P(112, WERFT_L + 3, WASSER_H + 1.6).join(" ")}" stroke="#eef1f2" stroke-width=".3"/>`;
    for (let d = 86; d < 112; d += 5) { const a1 = P(d, WERFT_L + 3, WASSER_H + 0.6), a2 = P(d, WERFT_L + 3, WASSER_H + 1.6); k += `<line x1="${a1[0]}" y1="${a1[1]}" x2="${a2[0]}" y2="${a2[1]}" stroke="#eef1f2" stroke-width=".18"/>`; }
    k += vieleck([P(92, WERFT_L - 0.4, WERFT_H), P(95, WERFT_L - 0.4, WERFT_H), P(95, WERFT_L + 3, WASSER_H + 0.6), P(92, WERFT_L + 3, WASSER_H + 0.6)], "#8a8f8c");
    k += `<path d="M${P(92, WERFT_L - 0.4, WERFT_H + 1).join(" ")} L${P(92, WERFT_L + 3, WASSER_H + 1.6).join(" ")}" stroke="#4f585e" stroke-width=".2"/>`;
  }
  /* Laternen auf der unteren Werft: ihre Größe zeigt die Tiefe */
  for (const d of [52, 78, 120]) {
    const b = P(d, WERFT_L - 2.2, WERFT_H), t = P(d, WERFT_L - 2.2, WERFT_H + 4), s1 = F / d;
    k += `<line x1="${b[0]}" y1="${b[1]}" x2="${t[0]}" y2="${t[1]}" stroke="#2f3a3e" stroke-width="${r(0.12 * s1)}"/><path d="M${r(t[0] - 0.3 * s1)} ${r(t[1] - 0.15 * s1)} h${r(0.6 * s1)} l${r(-0.08 * s1)} ${r(-0.6 * s1)} h${r(-0.44 * s1)} Z" fill="#f6e3a8" stroke="#2f3a3e" stroke-width="${r(0.06 * s1)}"/><path d="M${r(t[0] - 0.36 * s1)} ${r(t[1] - 0.75 * s1)} L${t[0]} ${r(t[1] - 1 * s1)} L${r(t[0] + 0.36 * s1)} ${r(t[1] - 0.75 * s1)} Z" fill="#2f3a3e"/>`;
  }
  /* Schattenkante: direkt unter der Promenadenkante liegt der Uferweg im Schatten der Mauer */
  k += vieleck([[VX, HOR], strahl(KANTE, 0), strahl(KANTE + 0.9, WERFT_H)], S.lg("kantenschatten", [[0, "#1f2622", 0.05], [1, "#1f2622", 0.45]], 0, 0, 0, 1));
  S.teil({ id: "werft", de: "der Uferweg", syl: "U-fer-weg", it: "la passeggiata sul fiume", itSyl: "pas-seg-GIA-ta sul FIU-me", en: "riverside path", x: 0, y: 0, kunst: k,
    tipp: "Unten am Wasser liegt die untere Rheinwerft. Hier legen die Schiffe an — die Poller halten die Seile." });
}

/* Dinge auf der Promenade, die zur Promenade gehören: Geländer, Laterne, Spaziergänger, Radfahrer */
const GELAENDER = (() => {
  let k = "";
  const H1 = 1.05;
  for (const h of [H1, 0.55]) { const a = P(15.5, KANTE, h), b = P(900, KANTE, h); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${h === H1 ? "#59646b" : "#7b868d"}" stroke-width="${h === H1 ? 0.75 : 0.4}"/>`; }
  { const a = P(15.5, KANTE, H1), b = P(900, KANTE, H1); k += `<line x1="${a[0]}" y1="${r(a[1] - 0.4)}" x2="${b[0]}" y2="${b[1]}" stroke="#d6dde1" stroke-width=".3"/>`; }
  for (let d = 15.6; d < 260; d *= 1.12) { const a = P(d, KANTE, 0), b = P(d, KANTE, H1); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#4e585e" stroke-width="${r(Math.min(0.9, 0.06 * F / d))}"/>`; }
  return k;
})();
const LATERNE = (() => {
  const d = 58, p = P(d, KANTE - 0.6, 0), s = F / d, H = 4.6 * s;
  let k = schlag(0, 0.2, 1.2, H, 0.45);
  k += `<path d="M-1.2 0 L-.9 -2.4 L.9 -2.4 L1.2 0 Z" fill="#2f3a3e"/><rect x="-.4" y="${r(-H + 3)}" width=".8" height="${r(H - 5)}" fill="${S.lg("mast", [[0, "#2b3437"], [0.5, "#5f6c71"], [1, "#9aa6ab"]], 0, 0, 1, 0)}"/><rect x=".2" y="${r(-H + 3)}" width=".22" height="${r(H - 5)}" fill="#ffe6b8" opacity=".8"/>`;
  k += `<path d="M-.4 ${r(-H + 3)} Q-.4 ${r(-H + 0.6)} -2.6 ${r(-H + 0.3)}" stroke="#2f3a3e" stroke-width=".65" fill="none"/>`;
  k += `<path d="M-1.4 ${r(-H)} L-4.4 ${r(-H)} L-3.9 ${r(-H + 1.5)} L-1.9 ${r(-H + 1.5)} Z" fill="#2f3a3e"/><ellipse cx="-2.9" cy="${r(-H + 1.55)}" rx="1.1" ry=".3" fill="#fff6d6"/>`;
  return `<g transform="translate(${p[0]} ${p[1]})">${k}</g>`;
})();
const PASSANTEN = (() => {
  /* Passanten (klein, im Hintergrund der Promenade) und ein Radfahrer */
  let k = "";
  for (const [d, l, o] of [[84, -6, { hemd: "#c9302c", hose: "#2f3640", haar: "#2b2b2b" }], [108, 1.2, { hemd: "#f2efe6", hose: "#3d5f8c", haar: "#c9a466", tasche: "#7a4a2c" }],
    [132, -3.6, { hemd: "#3c8f5a", rock: true, hose: "#2f5a35", haar: "#6b4a33" }], [170, 0.4, { hemd: "#e0a82e", haar: "#3a2a20" }], [70, 2.6, { hemd: "#5b3a6e", hose: "#2f3640", haar: "#9d9a96", rueck: true }]]) {
    const p = P(d, l, 0), h = 1.72 * F / d;
    k += schlag(p[0], p[1], 0.3 * h, h, 0.2) + passant(p[0], p[1], h, o);
  }
  return k;
})();
const RADFAHRER = (() => {
  /* DER RADFAHRER — fährt auf uns zu */
  const d = 52, p = P(d, 2.2, 0), s = F / d;
  let k = schlag(0, 0, 0.4 * s, 1.7 * s, 0.22);
  const R = 0.34 * s;
  k += `<ellipse cx="0" cy="${r(-R)}" rx="${r(R * 0.18)}" ry="${r(R)}" fill="none" stroke="#22262a" stroke-width=".55"/>`;
  k += `<path d="M0 ${r(-R)} L0 ${r(-0.95 * s)}" stroke="#2f86b8" stroke-width=".6"/><path d="M${r(-0.32 * s)} ${r(-1.02 * s)} L${r(0.32 * s)} ${r(-1.02 * s)}" stroke="#30363a" stroke-width=".5"/>`;
  k += `<g transform="translate(0 ${r(-0.55 * s)})">${passant(0, 0, 1.2 * s, { hemd: "#d9534a", hose: "#2f3640", haar: "#4a3426", schritt: 0 })}</g>`;
  k += `<path d="M${r(-0.32 * s)} ${r(-1.02 * s)} L${r(-0.18 * s)} ${r(-1.28 * s)} M${r(0.32 * s)} ${r(-1.02 * s)} L${r(0.18 * s)} ${r(-1.28 * s)}" stroke="#d9534a" stroke-width="${r(0.07 * s)}" stroke-linecap="round"/>`;
  k += `<ellipse cx="0" cy="${r(-1.83 * s)}" rx="${r(0.1 * s)}" ry="${r(0.07 * s)}" fill="#f2c62f"/>`;
  return `<g transform="translate(${p[0]} ${p[1]})">${k}</g>`;
})();

/* =====================================================================
   14 — DIE PROMENADE (obere Rheinuferpromenade, Granitplatten, Geländer)
   ===================================================================== */
{
  const KS = strahl(KANTE, 0), BORD = strahl(KANTE - 0.9, 0);
  let k = vieleck([[0, HOR], [VX, HOR], KS, [0, 200]], S.lg("platten", [[0, "#cfc8ba"], [0.5, "#bdb5a6"], [1, "#a9a193"]]));
  k += vieleck([[VX, HOR], KS, BORD], S.lg("bord", [[0, "#e9e4d9"], [1, "#d3ccbe"]]));
  for (let t = 1.5; t < 24; t *= 1.18) { const a = [VX + (KANTE - 0.9) * t, HOR + AUGE * t], b = [VX + KANTE * t, HOR + AUGE * t]; k += `<line x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}" stroke="#a69f91" stroke-width=".2"/>`; }
  for (let lat = 2; lat > -60; lat -= 2.5) { const b = strahl(lat); k += `<line x1="${VX}" y1="${HOR}" x2="${b[0]}" y2="${b[1]}" stroke="#958d7f" stroke-width=".26" opacity="${lat > -10 ? 0.5 : 0.36}"/>`; }
  for (let d = 16; d < 420; d *= 1.085) { const lmin = Math.max(HAUS_L, -VX * d / F + 0.01), a = P(d, lmin), b = P(d, KANTE - 0.9); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#958d7f" stroke-width=".22" opacity=".42"/>`; }
  for (let i = 0; i < 220; i++) { const y = 118 + Math.pow(rnd(), 0.7) * 82, x = rnd() * 220; if (x > VX + (KANTE - 0.9) * km(y) - 0.5) continue; k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.12 + rnd() * 0.28)}" fill="${rnd() < 0.5 ? "#e6e1d6" : "#8c8476"}" opacity=".5"/>`; }
  /* Sonnenlicht von rechts */
  k += vieleck([[0, HOR], [VX, HOR], KS, [0, 200]], S.lg("promlicht", [[0, "#000", 0.08], [0.5, "#000", 0], [1, "#fff4d8", 0.12]], 0, 0, 1, 0));
  S.teil({ id: "promenade", de: "die Promenade", syl: "pro-me-NA-de", it: "il lungofiume", itSyl: "lun-go-FIU-me", en: "promenade", x: 0, y: 0, kunst: k + PASSANTEN + RADFAHRER + GELAENDER + LATERNE,
    tipp: "Auf der Rheinuferpromenade spazieren die Leute direkt am Rhein entlang. Hinter dem Geländer geht es fünf Meter hinunter zum Uferweg." });
}

/* =====================================================================
   7 — DER SCHLOSSTURM am Burgplatz (Lupe: Wetterfahne, Fenster)
   ===================================================================== */
const ST = { x: 115.4, y: 120, u: 1.13 };
{
  const u = ST.u, H = (m) => r(-m * u), MITTE = 16 * u;   /* Ankerpunkt auf halber Höhe */
  let k = "";
  /* Burgplatz: helles Pflaster, die breite Rheintreppe zur unteren Werft, Leute sitzen auf den Stufen */
  k += `<path d="M-12 .4 L4.6 .4 L5 1.2 L-12 1.2 Z" fill="#d9cfbd"/>`;
  {
    /* 8 Stufen, je 1,5 E Auftritt und 0,78 E Steigung (≈ 5,5 m bis zur Werft); die Auftritte laufen breit nach hinten (Süden) */
    const N = 8, RUN = 1.5, RISE = 0.78, TX = -3.4, TY = -1.85, x0 = 4.6, y0 = 0.4;
    let wange = `M${x0} ${y0}`;
    for (let i = 0; i < N; i++) wange += ` L${r(x0 + i * RUN)} ${r(y0 + (i + 1) * RISE)} L${r(x0 + (i + 1) * RUN)} ${r(y0 + (i + 1) * RISE)}`;
    wange += ` L${r(x0 + N * RUN)} ${r(y0 + N * RISE + 0.5)} L${x0} ${r(y0 + N * RISE + 0.5)} Z`;
    for (let i = 0; i < N; i++) {
      const xa = x0 + i * RUN, ya = y0 + (i + 1) * RISE;
      k += `<path d="M${r(xa)} ${r(ya)} L${r(xa + RUN + 0.05)} ${r(ya)} L${r(xa + RUN + TX + 0.05)} ${r(ya + TY)} L${r(xa + TX)} ${r(ya + TY)} Z" fill="${i % 2 ? "#ece2cd" : "#f6eedd"}"/>`;
      k += `<path d="M${r(xa + TX)} ${r(ya + TY)} L${r(xa + RUN + TX)} ${r(ya + TY)}" stroke="#8d7f69" stroke-width=".16"/>`;
    }
    k += `<path d="${wange}" fill="${S.lg("wange", [[0, "#bcae96"], [1, "#998b74"]])}"/>`;
    for (let i = 0; i < N; i++) k += `<path d="M${r(x0 + i * RUN)} ${r(y0 + (i + 1) * RISE)} L${r(x0 + (i + 1) * RUN)} ${r(y0 + (i + 1) * RISE)}" stroke="#fbf5e8" stroke-width=".22"/>`;
    /* Leute sitzen auf den Stufen und schauen auf den Rhein */
    for (const [i, t, f, haar] of [[1, 0.3, "#c9302c", "#3a2a20"], [2, 0.75, "#2d6fb3", "#c9a466"], [3, 0.2, "#f2f2f2", "#2b2b2b"], [3, 0.55, "#e46aa0", "#6b4a33"], [4, 0.85, "#3c8f5a", "#3a2a20"], [5, 0.35, "#e0a82e", "#2b2b2b"], [6, 0.6, "#5b3a6e", "#c9a466"]]) {
      const x = x0 + i * RUN + 0.35 + t * TX, y = y0 + (i + 1) * RISE + t * TY;
      k += `<path d="M${r(x + 0.5)} ${r(y - 0.32)} l.55 0 l.05 .7" stroke="#34404a" stroke-width=".26" fill="none" stroke-linecap="round"/>`;
      k += `<path d="M${r(x)} ${r(y - 0.25)} L${r(x + 0.62)} ${r(y - 0.25)} L${r(x + 0.5)} ${r(y - 1.05)} L${r(x + 0.08)} ${r(y - 1.05)} Z" fill="${f}"/>`;
      k += `<circle cx="${r(x + 0.3)}" cy="${r(y - 1.33)}" r=".27" fill="#d9a888"/><path d="M${r(x + 0.03)} ${r(y - 1.38)} a.28 .28 0 0 1 .55 -.05 Z" fill="${haar}"/>`;
    }
    /* eine Frau geht gerade die Treppe hinunter */
    k += passant(r(x0 + 5.5 * RUN + 0.8), r(y0 + 6 * RISE - 0.4), 2, { hemd: "#2fa0a8", haar: "#3a2a20", rock: true, hose: "#2a3d5a" });
  }
  /* drei runde Geschosse (Zylinder) */
  const RD = 5.2;
  k += `<rect x="${-RD}" y="${H(15)}" width="${2 * RD}" height="${r(15 * u)}" fill="${PUTZ}"/>`;
  k += `<path d="M${-RD} 0 A${RD} 1 0 0 0 ${RD} 0 L${RD} -.6 A${RD} 1 0 0 1 ${-RD} -.6 Z" fill="#b2a894"/>`;
  for (const m of [5, 10]) k += `<path d="M${-RD} ${H(m)} A${RD} 1 0 0 0 ${RD} ${H(m)}" stroke="#b9ae98" stroke-width=".35" fill="none"/>`;
  for (const [m, xs] of [[2.2, [-2.6, 1.6]], [7, [-3.3, -0.4, 2.5]], [11.8, [-3.3, -0.4, 2.5]]]) for (const x of xs) k += `<rect x="${x}" y="${H(m + 2)}" width="1.05" height="${r(2 * u)}" fill="#3c4650"/><rect x="${x - 0.2}" y="${H(m + 2.15)}" width="1.45" height=".3" fill="#cfc5b3"/><rect x="${x - 0.15}" y="${H(m)}" width="1.35" height=".25" fill="#efe8da"/>`;
  k += `<rect x="-.9" y="${H(2.6)}" width="1.8" height="${r(2.6 * u)}" rx=".6" fill="#4a3a2a"/>`;
  /* Gesims, vieleckiges Geschoss mit toskanischen Pilastern (1552) */
  k += `<rect x="${-RD - 0.5}" y="${H(15.6)}" width="${2 * RD + 1}" height="${r(0.6 * u)}" fill="#d8cfbd"/>`;
  k += `<path d="M-4.7 ${H(15.6)} L-4.7 ${H(20.8)} L4.7 ${H(20.8)} L4.7 ${H(15.6)} Z" fill="${PUTZ}"/>`;
  for (const x of [-4.5, -2.3, 2.3, 4.5]) k += `<rect x="${r(x - 0.35)}" y="${H(20.6)}" width=".7" height="${r(4.8 * u)}" fill="#c9bfa9"/><rect x="${r(x - 0.55)}" y="${H(20.8)}" width="1.1" height=".4" fill="#b8ad96"/>`;
  for (const x of [-3.5, 0, 3.5]) k += `<rect x="${r(x - 0.5)}" y="${H(19.4)}" width="1" height="${r(2.2 * u)}" fill="#3c4650"/>`;
  /* Rundbogengeschoss (Stüler 1845) */
  k += `<rect x="-5.1" y="${H(21.6)}" width="10.2" height="${r(0.8 * u)}" fill="#d8cfbd"/>`;
  k += `<rect x="-4.4" y="${H(26.6)}" width="8.8" height="${r(5 * u)}" fill="${PUTZ}"/>`;
  for (const x of [-2.9, 0, 2.9]) k += `<path d="M${r(x - 0.72)} ${H(22.4)} L${r(x - 0.72)} ${H(25)} A.72 .72 0 0 1 ${r(x + 0.72)} ${H(25)} L${r(x + 0.72)} ${H(22.4)} Z" fill="#344049"/><path d="M${r(x - 0.95)} ${H(25.3)} A.95 .95 0 0 1 ${r(x + 0.95)} ${H(25.3)}" stroke="#cfc5b0" stroke-width=".25" fill="none"/>`;
  k += `<rect x="-4.9" y="${H(27.2)}" width="9.8" height="${r(0.7 * u)}" fill="#e2d9c6"/>`;
  /* Zeltdach aus Schiefer, Wetterfahne mit dem Feuerspucker */
  k += `<path d="M-4.9 ${H(27.2)} L0 ${H(33)} L4.9 ${H(27.2)} Z" fill="${SCHIEFER}"/>`;
  k += `<path d="M0 ${H(33)} L1.8 ${H(27.2)}" stroke="#7b8590" stroke-width=".2"/><path d="M0 ${H(33)} L-1.8 ${H(27.2)}" stroke="#262b30" stroke-width=".2"/>`;
  k += `<line x1="0" y1="${H(33)}" x2="0" y2="${H(36.6)}" stroke="#3f4a47" stroke-width=".28"/><circle cx="0" cy="${H(33.4)}" r=".38" fill="${GOLD}"/>`;
  /* Feuerspucker: kleine Figur (Kopf, Körper, Arme, Beine) auf der Fahne, eine Flamme aus dem Mund */
  const fy = -36.2 * u;
  k += `<g transform="translate(.2 ${r(fy)})" fill="${KUPFER}"><path d="M0 0 h2.8 v.35 h-2.8 Z"/><circle cx="1.6" cy="-1.9" r=".42"/><path d="M1.35 -1.5 L1.85 -1.5 L2 -.4 L1.2 -.4 Z"/><path d="M1.3 -1.3 L.7 -1.9 M1.9 -1.3 L2.5 -.9" stroke="${KUPFER}" stroke-width=".22"/><path d="M1.4 -.4 L1.1 .1 M1.8 -.4 L2.1 .1" stroke="${KUPFER}" stroke-width=".22"/></g>`;
  k += `<path d="M${r(2.2)} ${r(fy - 2)} q.7 -.3 1.3 .1 q-.3 -.5 .2 -.9 q.2 .6 .6 .6 q-.5 .5 -1.2 .6 Z" fill="#f2a43a"/><path d="M${r(2.3)} ${r(fy - 1.95)} q.5 -.1 .9 .1" stroke="#ffd56a" stroke-width=".18" fill="none"/>`;
  /* Licht von rechts (Südwesten), Schatten links */
  k += `<rect x="${-RD}" y="${H(27)}" width="3" height="${r(27 * u)}" fill="#000" opacity=".1"/><rect x="${RD - 1.6}" y="${H(27)}" width="1.6" height="${r(27 * u)}" fill="#fff5dc" opacity=".25"/>`;
  S.teil({ id: "schlossturm", de: "der Schlossturm", syl: "SCHLOSS-turm", it: "la torre del castello", itSyl: "TOR-re del ca-STEL-lo", en: "castle tower",
    x: ST.x, y: r(ST.y - MITTE), kunst: `<g transform="translate(0 ${r(MITTE)})">${k}</g>`, tipp: "Der Schlossturm ist alles, was vom Düsseldorfer Schloss übrig ist. Heute ist darin ein Schifffahrtsmuseum.",
    zoom: { x: ST.x - 22, y: ST.y - 44, w: 45, h: 30 },
    unter: [
      { id: "wetterfahne", de: "die Wetterfahne", syl: "WET-ter-fah-ne", it: "la banderuola", itSyl: "ban-de-RUO-la", en: "weather vane", x: ST.x, y: ST.y - 33.6 * ST.u, kunst: flaeche(-0.8, -4.8, 6.6, 5, 0.4),
        tipp: "Auf der Wetterfahne spuckt eine Figur Feuer." },
    ] });
}

/* =====================================================================
   8 — ST. LAMBERTUS mit dem verdrehten Turmhelm (Lupe: Turmhelm, Kirchturmuhr)
   ===================================================================== */
const LB = { x: 86, y: 120.3, u: 1.24 };
{
  const u = LB.u, H = (m) => r(-m * u);
  let k = "";
  /* Langhaus und Chor, schräg gesehen: nach Osten (links) kleiner werdend; das riesige Schieferdach */
  const lang = (t) => 1 - t * 0.22;                     /* Verkürzung nach hinten */
  const LX = (t) => r(-5 - t * 30), LH = (t, m) => r(-m * u * lang(t));
  k += `<path d="M${LX(0)} 0 L${LX(1)} 0 L${LX(1)} ${LH(1, 17)} L${LX(0)} ${LH(0, 17)} Z" fill="${BACKSTEIN}"/>`;
  k += `<path d="M${LX(0) + 0.4} ${LH(0, 17)} L${LX(1) - 1.2} ${LH(1, 17)} L${LX(0.94)} ${LH(0.94, 40)} L${LX(0.03)} ${LH(0.03, 40)} Z" fill="${S.lg("lbdach", [[0, "#353e46"], [0.6, "#4f5a64"], [1, "#6c7782"]])}"/>`;
  for (let i = 1; i < 9; i++) { const m = 17 + i * 2.4; k += `<path d="M${r(LX(0.03 * i / 9) + 0.4)} ${LH(0, m)} L${r(LX(1 - 0.06 * i / 9))} ${LH(1, m)}" stroke="#2a3138" stroke-width=".16" opacity=".6"/>`; }
  k += `<path d="M${LX(0.03)} ${LH(0.03, 40)} L${LX(0.94)} ${LH(0.94, 40)}" stroke="#8a95a0" stroke-width=".35"/>`;
  for (let i = 0; i < 6; i++) { const t = 0.05 + i * 0.16; k += `<path d="M${r(LX(t) - 1.2)} ${LH(t, 2)} L${r(LX(t) - 1.2)} ${LH(t, 12)} Q${r(LX(t) - 2.4)} ${LH(t, 14.2)} ${r(LX(t) - 3.6)} ${LH(t, 12)} L${r(LX(t) - 3.6)} ${LH(t, 2)} Z" fill="#3b4048"/>`; }
  /* Dachreiter auf dem First */
  k += `<rect x="${r(LX(0.5) - 0.8)}" y="${LH(0.5, 43)}" width="1.6" height="${r(3 * u)}" fill="#3a434b"/><path d="M${r(LX(0.5) - 1.1)} ${LH(0.5, 43)} L${LX(0.5)} ${LH(0.5, 48)} L${r(LX(0.5) + 1.1)} ${LH(0.5, 43)} Z" fill="#3a434b"/><circle cx="${LX(0.5)}" cy="${LH(0.5, 48.5)}" r=".35" fill="${GOLD}"/>`;
  /* Westturm aus Backstein: Blendbögen, Schallarkaden, Turmuhr */
  const TW = 5.4;
  k += `<rect x="${-TW}" y="${H(36)}" width="${2 * TW}" height="${r(36 * u)}" fill="${BACKSTEIN}"/>`;
  for (const m of [11, 21, 30.5]) k += `<rect x="${-TW}" y="${H(m)}" width="${2 * TW}" height=".55" fill="#d4b39a" opacity=".75"/>`;
  for (const m of [12.4, 22]) for (const x of [-3.5, -0.6, 2.3]) k += `<path d="M${x} ${H(m)} L${x} ${H(m + 5.6)} Q${r(x + 0.6)} ${H(m + 6.9)} ${r(x + 1.2)} ${H(m + 5.6)} L${r(x + 1.2)} ${H(m)} Z" fill="${m < 20 ? "#7b3b27" : "#34383f"}"/>`;
  for (const x of [-4.3, -1.5, 1.3]) k += `<path d="M${x} ${H(31)} L${x} ${H(34.2)} Q${r(x + 0.75)} ${H(35.3)} ${r(x + 1.5)} ${H(34.2)} L${r(x + 1.5)} ${H(31)} Z" fill="#2b2f35"/>`;
  const UY = 27.6 * u;
  k += `<circle cx="0" cy="${r(-UY)}" r="2.2" fill="#f4efe1" stroke="#c8a24a" stroke-width=".45"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(Math.sin(a) * 1.7)}" y1="${r(-UY - Math.cos(a) * 1.7)}" x2="${r(Math.sin(a) * 2)}" y2="${r(-UY - Math.cos(a) * 2)}" stroke="#3a2c1c" stroke-width=".18"/>`; }
  const ah = (3 + 42 / 60) * Math.PI / 6, am = 42 * Math.PI / 30;
  k += `<line x1="0" y1="${r(-UY)}" x2="${r(Math.sin(ah) * 1.15)}" y2="${r(-UY - Math.cos(ah) * 1.15)}" stroke="#222" stroke-width=".3"/><line x1="0" y1="${r(-UY)}" x2="${r(Math.sin(am) * 1.7)}" y2="${r(-UY - Math.cos(am) * 1.7)}" stroke="#222" stroke-width=".2"/>`;
  k += `<rect x="${-TW - 0.4}" y="${H(36.4)}" width="${2 * TW + 0.8}" height="1" fill="#d9c7ad"/>`;
  k += `<rect x="${TW - 2.2}" y="${H(36)}" width="2.2" height="${r(36 * u)}" fill="#ffe9cc" opacity=".16"/><rect x="${-TW}" y="${H(36)}" width="1.6" height="${r(36 * u)}" fill="#000" opacity=".14"/>`;
  /* der VERDREHTE Turmhelm: Umriss fast gerade, die acht Grate winden sich flach spiralig (gut eine Achteldrehung) */
  const H0 = 36.4, H1 = 72, W0 = 5.1, DREH = 1.1;
  const helm = (t) => ({ y: -(H0 + (H1 - H0) * t) * u, w: W0 * (1 - t), dx: t * 0.45 });
  const grat = (g, t) => { const h = helm(t), a = g * Math.PI / 4 + Math.PI / 8 + t * DREH; return [h.dx + Math.sin(a) * h.w, h.y, Math.cos(a)]; };
  k += `<path d="M${r(-W0)} ${H(H0)} L${r(helm(1).dx)} ${H(H1)} L${W0} ${H(H0)} Z" fill="#2f363d"/>`;
  for (let g = 0; g < 8; g++) {
    const a = [], b = [];
    for (let i = 0; i <= 20; i++) { const t = i / 20, p = grat(g, t), q = grat(g + 1, t); a.push(p); b.push(q); }
    const sicht = a.filter((p, i) => p[2] + b[i][2] > 0).length > 10;
    if (!sicht) continue;
    const hell = (a[2][0] + b[2][0]) / 2;
    k += `<path d="M${a.map((p) => `${r(p[0])} ${r(p[1])}`).join(" L")} L${b.slice().reverse().map((p) => `${r(p[0])} ${r(p[1])}`).join(" L")} Z" fill="${hell > 1.6 ? "#76828d" : hell > -1.6 ? "#4f5963" : "#353c43"}"/>`;
  }
  for (let g = 0; g < 8; g++) {
    let d = "", an = false;
    for (let i = 0; i <= 20; i++) { const p = grat(g, i / 20); if (p[2] > -0.1) { d += `${an ? "L" : "M"}${r(p[0])} ${r(p[1])} `; an = true; } else an = false; }
    if (d) k += `<path d="${d}" stroke="#a6b0b9" stroke-width=".2" fill="none"/>`;
  }
  /* kleine Gauben am Helmfuß */
  for (const x of [-3, 0.2, 3.4]) k += `<path d="M${r(x - 0.85)} ${H(H0 + 0.2)} L${r(x - 0.85)} ${H(H0 + 2.3)} L${r(x)} ${H(H0 + 3.9)} L${r(x + 0.85)} ${H(H0 + 2.3)} L${r(x + 0.85)} ${H(H0 + 0.2)} Z" fill="#3c454e"/><rect x="${r(x - 0.38)}" y="${H(H0 + 2.1)}" width=".76" height="1.25" fill="#e8e1cf"/>`;
  /* Kugel, Kreuz und Wetterhahn */
  const top = helm(1);
  k += `<circle cx="${r(top.dx)}" cy="${r(top.y - 0.5)}" r=".55" fill="${GOLD}"/><path d="M${r(top.dx)} ${r(top.y - 1)} L${r(top.dx)} ${r(top.y - 4.2)} M${r(top.dx - 0.9)} ${r(top.y - 3.2)} L${r(top.dx + 0.9)} ${r(top.y - 3.2)}" stroke="#c8a24a" stroke-width=".38"/>`;
  k += `<path d="M${r(top.dx - 0.9)} ${r(top.y - 4.8)} q.9 -1.1 1.8 -.2 q-.7 0 -.6 .7 Z" fill="#c8a24a"/>`;
  S.teil({ id: "lambertus", de: "die Kirche St. Lambertus", syl: "KIR-che sankt LAM-ber-tus", it: "la chiesa di San Lamberto", itSyl: "CHIE-sa di san lam-BER-to", en: "St. Lambertus Church",
    x: LB.x - 14, y: r(LB.y - 34 * LB.u), kunst: `<g transform="translate(14 ${r(34 * LB.u)})">${k}</g>`, tipp: "St. Lambertus ist die älteste Kirche von Düsseldorf. Ihr Turmhelm ist verdreht.",
    zoom: { x: LB.x - 42, y: 31, w: 84, h: 56 },
    unter: [
      { id: "turmhelm", de: "der Turmhelm", syl: "TURM-helm", it: "la guglia", itSyl: "GU-glia", en: "spire", x: LB.x, y: LB.y - 54.6 * LB.u, kunst: flaeche(-5.4, -(18.2 * LB.u), 10.8, 36.4 * LB.u, 0.5),
        tipp: "Nach einem Brand 1815 wurde der Helm aus nassem Holz gebaut. Beim Trocknen hat er sich verdreht. Die Legende sagt: Das war der Teufel!" },
    ] });
}

/* =====================================================================
   9 — DIE ALTSTADT (Häuserzeile am Rhein, „längste Theke der Welt“)
   ===================================================================== */
const haeuser = [];
{
  const farben = ["#f1e9d6", "#e8d6b9", "#f4f0e6", "#dcc9a8", "#ead9c6", "#d3dbd8", "#efe2c6", "#e7d3c8", "#f2ede2", "#dccdb2", "#ece2d0", "#d9c9b4"];
  let d = 66.5, i = 0;
  while (d < 305 && i < 40) {
    const breite = 8 + (i * 7 % 5) * 1.5, hoehe = 12.4 + (i * 5 % 4) * 1.2;
    haeuser.push({ d0: d, d1: d + breite, h: hoehe, f: farben[i % farben.length], giebel: i % 3 === 1 && d > 76, i });
    d += breite + (i % 4 === 3 ? 4 : 0);     /* hin und wieder eine Gasse in die Altstadt */
    i++;
  }
}
const hausZeichnen = (hs, L) => {
  let k = "";
  const fern = hs.d0 > 150, sehrfern = hs.d0 > 230;
  const a0 = P(hs.d0, L, 0), a1 = P(hs.d1, L, 0), b0 = P(hs.d0, L, hs.h), b1 = P(hs.d1, L, hs.h);
  /* Dach zuerst (liegt hinter der Fassadenoberkante) */
  if (hs.giebel) {
    const mid = (hs.d0 + hs.d1) / 2, g = P(mid, L, hs.h + 4.6);
    /* die Nordseite des Satteldachs zeigt zu uns: Fläche vom Giebelrand nach hinten (Osten) */
    k += vieleck([b0, g, P(mid, L - 9, hs.h + 4.6), P(hs.d0, L - 9, hs.h)], S.lg("dachnord", [[0, "#4c5660"], [1, "#5f6a75"]]));
    k += vieleck([b0, g, b1], hs.f) + `<path d="M${b0.join(" ")} L${g.join(" ")} L${b1.join(" ")}" stroke="#596470" stroke-width="${r(Math.min(0.6, 30 / hs.d0))}" fill="none"/>`;
    if (!fern) { const w0 = P(mid - 1, L, hs.h + 1), w1 = P(mid + 1, L, hs.h + 1), w2 = P(mid + 1, L, hs.h + 2.6), w3 = P(mid - 1, L, hs.h + 2.6); k += vieleck([w0, w1, w2, w3], "#46525c"); }
  } else {
    /* Schieferfläche zwischen Traufe und First (wir sehen sie steil von unten, darum als Band) */
    const up0 = 3.1 * F / hs.d0, up1 = 3.1 * F / hs.d1, sl0 = 0.9 * F / hs.d0, sl1 = 0.9 * F / hs.d1;
    const t0 = [r(b0[0] - sl0), r(b0[1] - up0)], t1 = [r(b1[0] - sl1), r(b1[1] - up1)];
    k += vieleck([b0, b1, t1, t0], S.lg("hausdach", [[0, "#4a535d"], [1, "#66717c"]]));
    k += `<path d="M${t0.join(" ")} L${t1.join(" ")}" stroke="#8994a0" stroke-width="${r(Math.min(0.4, 20 / hs.d0))}"/>`;
    if (!sehrfern) for (const t of [0.3, 0.7]) {
      const dm = hs.d0 + (hs.d1 - hs.d0) * t, s1 = F / dm;
      const bx = b0[0] + (b1[0] - b0[0]) * t - 0.25 * s1, by = b0[1] + (b1[1] - b0[1]) * t - 0.35 * s1;
      const w = 0.55 * s1, h = 0.8 * s1;
      k += `<path d="M${r(bx - w)} ${r(by)} L${r(bx - w)} ${r(by - h)} L${r(bx)} ${r(by - h - 0.6 * s1)} L${r(bx + w)} ${r(by - h)} L${r(bx + w)} ${r(by)} Z" fill="#e6dfd0"/>`;
      k += `<path d="M${r(bx - w * 1.25)} ${r(by - h + 0.05 * s1)} L${r(bx)} ${r(by - h - 0.7 * s1)} L${r(bx + w * 1.25)} ${r(by - h + 0.05 * s1)}" stroke="#3e4750" stroke-width="${r(0.18 * s1)}" fill="none"/>`;
      k += `<rect x="${r(bx - w * 0.55)}" y="${r(by - h * 0.85)}" width="${r(w * 1.1)}" height="${r(h * 0.7)}" fill="#55697a"/>`;
    }
  }
  /* Fassade, Licht der Nachmittagssonne */
  k += vieleck([a0, a1, b1, b0], hs.f);
  k += vieleck([a0, a1, b1, b0], "#fff0cf", ` opacity="${hs.i % 2 ? 0.14 : 0.06}"`);
  k += vieleck([b0, b1, P(hs.d1, L, hs.h - 0.5), P(hs.d0, L, hs.h - 0.5)], "#fff", ` opacity=".35"`);
  /* Fenster mit Laibung: dunkle Öffnung, heller Rahmen, Sohlbank */
  const ach = 3, ges = Math.floor((hs.h - 4.4) / 3.1);
  if (!sehrfern || hs.i % 2) for (let g = 0; g < ges; g++) for (let a = 0; a < ach; a++) {
    const t0 = (a + 0.28) / ach, t1 = (a + 0.66) / ach, dd0 = hs.d0 + (hs.d1 - hs.d0) * t0, dd1 = hs.d0 + (hs.d1 - hs.d0) * t1, h0 = 4.6 + g * 3.1, h1 = h0 + 1.9;
    const p = [P(dd0, L, h0), P(dd1, L, h0), P(dd1, L, h1), P(dd0, L, h1)];
    if (p[1][0] - p[0][0] < 0.35) continue;
    if (!fern) k += vieleck([P(dd0 - 0.15, L, h0 - 0.15), P(dd1 + 0.15, L, h0 - 0.15), P(dd1 + 0.15, L, h1 + 0.15), P(dd0 - 0.15, L, h1 + 0.15)], "#faf6ee");
    k += vieleck(p, S.lg("fglas", [[0, "#3f4c58"], [1, "#5d7182"]]));
    if (!fern) { k += vieleck([P(dd0, L, h0), P(dd0 + 0.25, L, h0), P(dd0 + 0.25, L, h1), P(dd0, L, h1)], "#2b343c"); k += vieleck([P(dd0 - 0.2, L + 0.12, h0 - 0.3), P(dd1 + 0.2, L + 0.12, h0 - 0.3), P(dd1 + 0.2, L + 0.12, h0), P(dd0 - 0.2, L + 0.12, h0)], "#d8d0c0"); }
  }
  /* Erdgeschoss: Kneipe mit Schaufenster, Tür und Markise */
  const lad = ["#2d5f8f", "#9c2b25", "#2f6b3e", "#c98a2a", "#5b3a6e"][hs.i % 5];
  k += vieleck([P(hs.d0 + 0.6, L, 0.4), P(hs.d0 + 2.2, L, 0.4), P(hs.d0 + 2.2, L, 2.6), P(hs.d0 + 0.6, L, 2.6)], "#4a3324");
  if (!fern) k += vieleck([P(hs.d0 + 1.4, L, 0.4), P(hs.d0 + 2.2, L, 0.4), P(hs.d0 + 2.2, L, 2.6), P(hs.d0 + 1.4, L, 2.6)], "#f2c879", ` opacity=".75"`);
  k += vieleck([P(hs.d0 + 2.8, L, 0.8), P(hs.d1 - 0.8, L, 0.8), P(hs.d1 - 0.8, L, 2.6), P(hs.d0 + 2.8, L, 2.6)], S.lg("schau", [[0, "#6f5a3c"], [1, "#e7c88a"]]), ` opacity=".9"`);
  k += vieleck([P(hs.d0 + 0.4, L, 3.4), P(hs.d1 - 0.4, L, 3.4), P(hs.d1 - 0.4, L + 1.5, 2.7), P(hs.d0 + 0.4, L + 1.5, 2.7)], lad);
  k += vieleck([a0, P(hs.d0 + 0.35, L, 0), P(hs.d0 + 0.35, L, hs.h), b0], "#000", ` opacity=".1"`);
  return k;
};

/* Häuserzeile (ohne das Brauhaus vorn) */
{
  let k = "";
  for (const hs of haeuser.slice().reverse()) {
    if (P(hs.d1, HAUS_L, 0)[0] > 98) continue;
    k += hausZeichnen(hs, HAUS_L);
  }
  /* Sonnenschirme und Gäste vor den Kneipen weiter hinten */
  for (const [dd, f] of [[78, "#f3efe6"], [104, "#9c2b25"], [140, "#f3efe6"], [190, "#2d5f8f"]]) {
    const s = P(dd, HAUS_L + 3.4, 0), o = P(dd, HAUS_L + 3.4, 2.6), w = 1.5 * F / dd;
    k += `<line x1="${s[0]}" y1="${s[1]}" x2="${o[0]}" y2="${o[1]}" stroke="#6b6257" stroke-width="${r(0.05 * F / dd + 0.1)}"/><path d="M${r(o[0] - w)} ${r(o[1] + w * 0.3)} Q${o[0]} ${r(o[1] - w * 0.45)} ${r(o[0] + w)} ${r(o[1] + w * 0.3)} Z" fill="${f}"/>`;
    for (const [dl, c] of [[-1.1, "#3d5a80"], [1, "#b8473a"]]) { const p = P(dd + dl, HAUS_L + 3.4 + dl, 0); k += passant(p[0], p[1], 1.7 * F / (dd + dl), { hemd: c, haar: dl < 0 ? "#3a2a20" : "#c9a466" }); }
  }
  S.teil({ id: "altstadt", de: "die Altstadt", syl: "ALT-stadt", it: "il centro storico", itSyl: "CEN-tro STO-ri-co", en: "old town",
    x: 0, y: 0, kunst: k, tipp: "In der Altstadt gibt es rund 260 Kneipen. Man nennt sie „die längste Theke der Welt“." });
}

/* =====================================================================
   10 — DAS BRAUHAUS (vorn links) mit Ausleger-Schild, offener Tür, Ausschank
   ===================================================================== */
{
  const L = HAUS_L, d0 = 47.5, d1 = 66, h = 15.4;
  let k = "";
  const a0 = P(d0, L, 0), a1 = P(d1, L, 0), b0 = P(d0, L, h), b1 = P(d1, L, h);
  /* Dach (Schiefer, Traufe zum Rhein); von unten sieht man nur die Traufe */
  k += vieleck([b0, b1, P(d1, L - 5, h + 4.2), P(d0, L - 5, h + 4.2)], S.lg("bdach", [[0, "#57616c"], [1, "#454e57"]]));
  /* Fassade: weiß geschlämmter Backstein, dunkelgrüne Fensterläden */
  k += vieleck([a0, a1, b1, b0], S.lg("bfass", [[0, "#efe8da"], [1, "#f7f2e8"]], 0, 0, 1, 0));
  k += vieleck([a0, a1, b1, b0], "#ffeccc", ` opacity=".12"`);
  k += vieleck([P(d0, L, h - 0.6), P(d1, L, h - 0.6), P(d1, L, h), P(d0, L, h)], "#d9cfbd");
  for (const g of [0, 1, 2]) for (const dm of [50, 54.2, 58.4, 62.6]) {
    const h0 = 5.2 + g * 3.3, h1 = h0 + 2.1;
    k += vieleck([P(dm - 0.75, L, h0), P(dm + 0.75, L, h0), P(dm + 0.75, L, h1), P(dm - 0.75, L, h1)], S.lg("bglas", [[0, "#3b4954"], [1, "#6a8090"]]));
    k += vieleck([P(dm - 0.75, L, h0), P(dm - 0.55, L, h0), P(dm - 0.55, L, h1), P(dm - 0.75, L, h1)], "#2b343c");
    k += vieleck([P(dm - 1.45, L + 0.1, h0), P(dm - 0.8, L + 0.1, h0), P(dm - 0.8, L + 0.1, h1), P(dm - 1.45, L + 0.1, h1)], "#2f5a3e") + vieleck([P(dm + 0.8, L + 0.1, h0), P(dm + 1.45, L + 0.1, h0), P(dm + 1.45, L + 0.1, h1), P(dm + 0.8, L + 0.1, h1)], "#2f5a3e");
    k += vieleck([P(dm - 0.9, L + 0.15, h0 - 0.25), P(dm + 0.9, L + 0.15, h0 - 0.25), P(dm + 0.9, L + 0.15, h0), P(dm - 0.9, L + 0.15, h0)], "#cfc5b2");
  }
  /* Schriftzug über dem Erdgeschoss */
  const s1 = P(d0 + 5.6, L, 4), s2 = P(d1 - 0.6, L, 4);
  const sw = s2[0] - s1[0], sh = (s1[1] - s2[1]);
  k += `<g transform="matrix(${r(sw / 40)} ${r(-sh / 40)} 0 ${r(F / ((d0 + d1) / 2) / 4)} ${s1[0]} ${s1[1]})"><text x="20" y="0" font-size="3.6" text-anchor="middle" fill="#8a6418" font-family="Georgia,serif" font-weight="bold" letter-spacing=".3">BRAUHAUS</text></g>`;
  /* Erdgeschoss: offene Tür mit warmem Licht, Fenster mit Butzenglas */
  k += vieleck([P(50.4, L, 0), P(53, L, 0), P(53, L, 2.8), P(51.7, L, 3.3), P(50.4, L, 2.8)], "#5a3a1f");
  k += vieleck([P(50.8, L, 0), P(52.6, L, 0), P(52.6, L, 2.6), P(50.8, L, 2.6)], S.lg("tuerlicht", [[0, "#ffd88a"], [1, "#c98a3a"]]));
  for (const dm of [56.4, 61.2]) { k += vieleck([P(dm - 1.5, L, 0.9), P(dm + 1.5, L, 0.9), P(dm + 1.5, L, 2.8), P(dm - 1.5, L, 2.8)], S.lg("butzen", [[0, "#e8c27a"], [1, "#9a7038"]])); k += vieleck([P(dm - 0.05, L, 0.9), P(dm + 0.05, L, 0.9), P(dm + 0.05, L, 2.8), P(dm - 0.05, L, 2.8)], "#4a3324"); }
  /* Ausleger-Schild: geschmiedeter Arm mit hängendem Schild (Fass und Hopfen) */
  const ar0 = P(49, L, 4.6), ar1 = P(49, L + 1.9, 4.6), ar2 = P(49, L, 3.6);
  k += `<path d="M${ar0.join(" ")} L${ar1.join(" ")} M${ar2.join(" ")} Q${r((ar0[0] + ar1[0]) / 2)} ${r(ar2[1] - 0.2)} ${ar1.join(" ")}" stroke="#1f1a16" stroke-width=".7" fill="none"/>`;
  const sk = F / 49, sx = (ar0[0] + ar1[0]) / 2, sy = ar1[1] + 0.6;
  k += `<line x1="${r(sx - 0.25 * sk)}" y1="${r(ar1[1])}" x2="${r(sx - 0.25 * sk)}" y2="${r(sy)}" stroke="#1f1a16" stroke-width=".3"/><line x1="${r(sx + 0.25 * sk)}" y1="${r(ar1[1])}" x2="${r(sx + 0.25 * sk)}" y2="${r(sy)}" stroke="#1f1a16" stroke-width=".3"/>`;
  k += `<rect x="${r(sx - 0.45 * sk)}" y="${r(sy)}" width="${r(0.9 * sk)}" height="${r(0.75 * sk)}" rx=".4" fill="#1f3d2c" stroke="#c9a24a" stroke-width=".35"/>`;
  k += `<ellipse cx="${r(sx)}" cy="${r(sy + 0.37 * sk)}" rx="${r(0.2 * sk)}" ry="${r(0.24 * sk)}" fill="${HOLZ}" stroke="#c9a24a" stroke-width=".25"/><path d="M${r(sx - 0.2 * sk)} ${r(sy + 0.3 * sk)} h${r(0.4 * sk)} M${r(sx - 0.2 * sk)} ${r(sy + 0.45 * sk)} h${r(0.4 * sk)}" stroke="#c9a24a" stroke-width=".22"/>`;
  for (const [dx, dy] of [[-0.32, 0.15], [0.32, 0.15], [-0.32, 0.55], [0.32, 0.55]]) k += `<ellipse cx="${r(sx + dx * sk)}" cy="${r(sy + dy * sk)}" rx="${r(0.06 * sk)}" ry="${r(0.09 * sk)}" fill="#8db35a"/>`;
  /* Laterne an der Wand */
  const lw = P(54.6, L + 0.3, 3.7);
  k += `<path d="M${r(lw[0] - 0.6)} ${r(lw[1])} h1.2 l-.2 1.6 h-.8 Z" fill="#f6dc95" stroke="#2b2420" stroke-width=".2"/>`;
  /* Ausschank: Fass auf dem Fassbock neben der Tür */
  const fb = P(54, L + 0.9, 0), fs = F / 54;
  k += `<rect x="${r(fb[0] - 0.4 * fs)}" y="${r(fb[1] - 0.75 * fs)}" width="${r(0.8 * fs)}" height="${r(0.75 * fs)}" fill="#4a3220"/><ellipse cx="${r(fb[0])}" cy="${r(fb[1] - 1.05 * fs)}" rx="${r(0.45 * fs)}" ry="${r(0.36 * fs)}" fill="${HOLZ}"/><ellipse cx="${r(fb[0] - 0.1 * fs)}" cy="${r(fb[1] - 1.05 * fs)}" rx="${r(0.2 * fs)}" ry="${r(0.3 * fs)}" fill="#8f5f34"/><rect x="${r(fb[0] - 0.5 * fs)}" y="${r(fb[1] - 1.1 * fs)}" width="${r(0.15 * fs)}" height="${r(0.18 * fs)}" fill="#c9a24a"/>`;
  k += vieleck([a0, P(d0 + 0.4, L, 0), P(d0 + 0.4, L, h), b0], "#000", ` opacity=".12"`);
  /* zweiter Fass-Tisch im Biergarten vor dem Brauhaus, mit zwei Altbiergläsern */
  {
    const q = P(36, -8.2, 0), t = F / 36, H2 = 1.05 * t, R2 = 0.33 * t;
    k += schlag(q[0], q[1], 2 * R2, H2, 0.28);
    k += `<path d="M${r(q[0] - R2 * 0.9)} ${q[1]} Q${r(q[0] - R2 * 1.12)} ${r(q[1] - H2 / 2)} ${r(q[0] - R2 * 0.9)} ${r(q[1] - H2)} L${r(q[0] + R2 * 0.9)} ${r(q[1] - H2)} Q${r(q[0] + R2 * 1.12)} ${r(q[1] - H2 / 2)} ${r(q[0] + R2 * 0.9)} ${q[1]} Z" fill="${HOLZ}"/>`;
    for (const f of [0.15, 0.85]) k += `<rect x="${r(q[0] - R2 * 1.02)}" y="${r(q[1] - H2 * f - 0.35)}" width="${r(2.04 * R2)}" height=".7" fill="#3a3a3a"/>`;
    k += `<ellipse cx="${q[0]}" cy="${r(q[1] - H2 - 0.3)}" rx="${r(R2 * 1.2)}" ry="${r(R2 * 0.22)}" fill="${S.lg("platte2", [[0, "#b7834f"], [1, "#8c5d33"]])}"/>`;
    for (const dx of [-1.4, 1]) k += `<rect x="${r(q[0] + dx - 0.4)}" y="${r(q[1] - H2 - 2.2)}" width=".8" height="1.9" fill="#6d3a17"/><rect x="${r(q[0] + dx - 0.4)}" y="${r(q[1] - H2 - 2.4)}" width=".8" height=".35" fill="#f4ead6"/>`;
  }
  S.teil({ id: "brauhaus", de: "das Brauhaus", syl: "BRAU-haus", it: "la birreria", itSyl: "bir-re-RI-a", en: "brewpub", x: 0, y: 0, kunst: k,
    tipp: "Im Brauhaus wird das Altbier selbst gebraut und direkt aus dem Holzfass gezapft." });
}

/* =====================================================================
   16 — DER KANALDECKEL mit dem Radschläger
   ===================================================================== */
{
  const rx = 9.4, ry = 3.4;
  let k = `<ellipse cx="0" cy=".2" rx="${rx + 0.7}" ry="${ry + 0.35}" fill="#857e72"/>`;
  k += `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${S.rg("guss", [[0, "#74777a"], [0.7, "#55595d"], [1, "#3c3f43"]])}"/>`;
  k += `<ellipse cx="0" cy="0" rx="${rx - 1.2}" ry="${ry - 0.4}" fill="none" stroke="#9a9ea2" stroke-width=".3"/>`;
  /* Relief wie beim Guss: dunkler Grund, Rad als Ring, darin der Radschläger — Hände unten am Ring, Kopf neben den Händen,
     kurzer Rumpf schräg nach oben, Beine als V nach oben gespreizt; Schrift in einem eigenen Band innerhalb des Rands */
  S.def(`<path id="${S.id("deckelband")}" d="M-5.9 0 A5.9 5.9 0 0 0 5.9 0"/>`);
  const fig = (f, dx) => `<g transform="translate(${dx} ${dx}) rotate(-12)" fill="${f}" stroke="${f}" stroke-linecap="round" stroke-linejoin="round"><circle cx="0" cy="2.55" r=".78" stroke="none"/><path d="M0 .8 L0 -1.3" stroke-width="1.45" fill="none"/><path d="M0 .7 L-1.7 3.3 M0 .7 L1.7 3.3 M0 -1.3 L-1.5 -2.4 L-2.3 -3.1 M0 -1.3 L1.5 -2.4 L2.3 -3.1" stroke-width=".72" fill="none"/></g>`;
  k += `<g transform="scale(1 .5)"><circle cx="0" cy="0" r="4.95" fill="#4a5056"/><circle cx="0" cy="0" r="4.4" fill="none" stroke="#2e3236" stroke-width=".5" transform="translate(.15 .15)"/><circle cx="0" cy="0" r="4.4" fill="none" stroke="#a9aeb3" stroke-width=".45"/>`;
  k += fig("#2e3236", 0.15) + fig("#c9cdd1", 0);
  k += `<text font-size="1.05" fill="#c9cdd1" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".12"><textPath href="#${S.id("deckelband")}" xlink:href="#${S.id("deckelband")}" startOffset="50%" text-anchor="middle">DÜSSELDORF</textPath></text></g>`;
  for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; k += `<rect x="${r(Math.cos(a) * (rx - 0.6) - 0.2)}" y="${r(Math.sin(a) * (ry - 0.2) - 0.08)}" width=".4" height=".16" fill="#9a9ea2"/>`; }
  k += `<ellipse cx="2" cy="-.8" rx="4.4" ry=".45" fill="#fff" opacity=".14"/>`;
  S.teil({ oben: true, id: "kanaldeckel", de: "der Kanaldeckel", syl: "ka-NAL-de-ckel", it: "il tombino", itSyl: "tom-BI-no", en: "manhole cover",
    x: 126, y: 193, kunst: k, tipp: "Auf den Kanaldeckeln von Düsseldorf ist ein Radschläger zu sehen." });
}

/* =====================================================================
   17 — DER WEGWEISER (Kö nach links, Altstadt und Rheinturm geradeaus)
   ===================================================================== */
{
  const Y = 160, s = km(Y), H = 2.9 * s;
  let k = schlag(0, 0.2, 1.6, H, 0.45);
  k += `<rect x="-.65" y="${r(-H)}" width="1.3" height="${r(H)}" fill="${S.lg("pfosten", [[0, "#2f3c45"], [0.5, "#5f707c"], [1, "#a3b2bc"]], 0, 0, 1, 0)}"/>`;
  k += `<circle cx="0" cy="${r(-H - 0.4)}" r=".85" fill="#3b4a55"/><rect x=".38" y="${r(-H)}" width=".27" height="${r(H)}" fill="#ffe6b8" opacity=".85"/>`;
  const schild = (y, art, text) => {
    const w = 28, h = 4.6, x0 = -w / 2;
    let g = art === "links" ? `<path d="M${r(x0 - 2.6)} ${r(y + h / 2)} L${r(x0)} ${r(y)} L${r(x0 + w)} ${r(y)} L${r(x0 + w)} ${r(y + h)} L${r(x0)} ${r(y + h)} Z" fill="#17406e" stroke="#e8edf2" stroke-width=".35"/>`
      : `<rect x="${x0}" y="${r(y)}" width="${w}" height="${h}" rx=".5" fill="#17406e" stroke="#e8edf2" stroke-width=".35"/>`;
    /* Pfeil: nach links bzw. geradeaus (nach oben) */
    if (art === "links") g += `<path d="M${r(x0 + 1)} ${r(y + h / 2)} l1.6 -1.3 v.8 h1.7 v1 h-1.7 v.8 Z" fill="#fff"/>`;
    else g += `<path d="M${r(x0 + 2.2)} ${r(y + 0.6)} l1.4 1.6 h-.85 v1.8 h-1.1 v-1.8 h-.85 Z" fill="#fff"/>`;
    g += `<text x="${r(x0 + 4.6)}" y="${r(y + 3.15)}" font-size="2.35" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">${text}</text>`;
    return g;
  };
  k += schild(-H + 1, "links", "Königsallee");
  k += schild(-H + 6.4, "gerade", "Altstadt · Burgplatz");
  k += schild(-H + 11.8, "gerade", "Rheinturm · Landtag");
  k += `<rect x="-14" y="${r(-H + 16.8)}" width="28" height="2.6" rx=".4" fill="#f2f4f6" stroke="#17406e" stroke-width=".25"/><text x="0" y="${r(-H + 18.65)}" font-size="1.9" text-anchor="middle" fill="#17406e" font-family="Arial,sans-serif" font-weight="bold">Rheinuferpromenade</text>`;
  S.teil({ id: "wegweiser", de: "der Wegweiser", syl: "WEG-wei-ser", it: "il cartello indicatore", itSyl: "car-TEL-lo in-di-ca-TO-re", en: "signpost",
    x: 152, y: Y, steht: true, kunst: k, tipp: "Der Wegweiser zeigt zur Königsallee. Die „Kö“ ist eine berühmte Straße zum Einkaufen — mit einem Wassergraben in der Mitte." });
}

/* =====================================================================
   19 — DER RADSCHLÄGER: ein Junge schlägt ein Rad (Stadtsymbol)
   ===================================================================== */
{
  const d = 18, p = P(d, 3, 0), s = F / d;
  const rad = { lende: 0, brust: 0, nacken: 0, kopf: 0, schulterL: { vor: 0, seit: 150 }, ellbogenL: 4, unterarmL: 0, handL: 0, fingerL: 0.1, schulterR: { vor: 0, seit: 150 }, ellbogenR: 4, unterarmR: 0, handR: 0, fingerR: 0.1,
    huefteL: { vor: 0, seit: 36, dreh: 0 }, knieL: 2, fussL: 10, huefteR: { vor: 0, seit: 40, dreh: 0 }, knieR: 4, fussR: 10 };
  const m = figur({ id: "dus_rad", geschlecht: "m", alter: "kind", pose: rad, blick: 0, frisur: "kurz", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "rot" }, unterteil: { stueck: "shorts", farbe: "blau" }, schuhe: { stueck: "turnschuh" } } }, 1.32 * s);
  const H = m.z.hoehe * m.k;
  /* kopfüber, schräg gedreht: die rechte Hand berührt den Boden */
  const winkel = 168, cy = -H * 0.5, a = winkel * Math.PI / 180;
  const dreh = (pt) => { const x = pt.x * m.k, y = pt.y * m.k; return Math.sin(a) * x + Math.cos(a) * (y - cy) + cy; };
  const unten = Math.max(dreh(m.z.handL), dreh(m.z.handR));         /* die tiefere Hand berührt den Boden */
  const k = schlag(0, 0, 0.5 * s, 1.3 * s, 0.45) + gegen(`<g transform="translate(0 ${r(-unten)}) rotate(${winkel} 0 ${r(cy)})">${m.svg}</g>`);
  S.teil({ id: "radschlaeger", de: "der Radschläger", syl: "RAD-schlä-ger", it: "il ragazzo che fa la ruota", itSyl: "ra-GAZ-zo che fa la RUO-ta", en: "cartwheeler",
    x: p[0], y: p[1], kunst: k, tipp: "Die Radschläger sind das Symbol von Düsseldorf. Früher schlugen Kinder für ein paar Münzen ein Rad." });
}

/* =====================================================================
   20 — DER KÖBES, DER GAST und DAS FASS (Biergarten vor dem Brauhaus)
   ===================================================================== */
const FASS = { d: 21.5, l: -1.9 };
{
  const p = P(19.6, -3.6, 0), s = F / 19.6;
  const m = figur({ id: "dus_koebes", geschlecht: "m", pose: "servieren", blick: 30, frisur: "kurz", haarfarbe: "grau", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "#6d8fc0" }, jacke: { stueck: "jacke", farbe: "#1d3566" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 1.78 * s);
  const H = 1.78 * s;
  /* die lange blaue Köbes-Schürze reicht bis zu den Knöcheln */
  const sy = -0.53 * H, sb = -0.05 * H;
  let schuerze = `<path d="M-3.4 ${r(sy)} L3.9 ${r(sy)} Q4.8 ${r((sy + sb) / 2)} 5 ${r(sb)} L-4.1 ${r(sb)} Q-3.9 ${r((sy + sb) / 2)} -3.4 ${r(sy)} Z" fill="${S.lg("schuerze", [[0, "#16305e"], [0.6, "#284a86"], [1, "#3a5f9f"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-1.8, 0.4, 2.6]) schuerze += `<path d="M${x} ${r(sy + 2)} Q${r(x + 0.3)} ${r((sy + sb) / 2)} ${r(x + 0.45)} ${r(sb)}" stroke="#102449" stroke-width=".3" fill="none" opacity=".7"/>`;
  schuerze += `<rect x="-3.6" y="${r(sy - 0.5)}" width="7.6" height=".7" rx=".3" fill="#102449"/>`;
  const tasche = `<rect x="-2.8" y="${r(sy - 0.3)}" width="3" height="2.6" rx=".4" fill="#5a3a1f" stroke="#3a2412" stroke-width=".2"/><line x1="-1.3" y1="${r(sy - 0.3)}" x2="-1.3" y2="${r(sy - 1.7)}" stroke="#3a2412" stroke-width=".25"/>`;
  /* rundes Tablett mit Altbiergläsern (Becher) auf der erhobenen Hand */
  const hand = m.z.handR, hx = hand.x * m.k, hy = hand.y * m.k;
  let t = `<g transform="translate(${r(hx + 0.4)} ${r(hy - 0.6)})">`;
  t += `<ellipse cx="0" cy="0" rx="5.4" ry="1.35" fill="#8f979e"/><ellipse cx="0" cy="-.2" rx="5.1" ry="1.15" fill="#cfd5da"/>`;
  for (const [gx, gy] of [[-3.5, -0.3], [-1.2, -0.6], [1.1, -0.55], [3.4, -0.2], [-2.3, 0.3], [0, 0.4], [2.3, 0.3]]) {
    t += `<rect x="${r(gx - 0.58)}" y="${r(gy - 2.7)}" width="1.16" height="2.7" fill="${S.lg("altglas", [[0, "#5a2c10"], [0.6, "#8a4a1c"], [1, "#6d3a17"]], 0, 0, 1, 0)}"/><rect x="${r(gx - 0.58)}" y="${r(gy - 3)}" width="1.16" height=".5" rx=".2" fill="#f4ead6"/><rect x="${r(gx + 0.15)}" y="${r(gy - 2.4)}" width=".25" height="2" fill="#fff" opacity=".4"/>`;
  }
  t += `</g>`;
  S.teil({ id: "koebes", de: "der Köbes", syl: "KÖ-bes", it: "il cameriere della birreria", itSyl: "ca-me-RIE-re del-la bir-re-RI-a", en: "brewery waiter",
    x: p[0], y: p[1], kunst: schlag(0, 0.3, 6, H, 0.45) + gegen(m.svg + schuerze + tasche) + t,
    tipp: "Im Brauhaus heißt der Kellner „Köbes“. Er trägt Blau und bringt das Altbier, ohne dass man fragt." });
}
{
  /* DER GAST — eine Frau am Fass, ein Altbier in der Hand */
  const p = P(22.2, -1.15, 0), s = F / 22.2;
  const m = figur({ id: "dus_gast", geschlecht: "w", pose: "halten", blick: -62, frisur: "lang", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#f3efe6" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "#b8473a" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.68 * s);
  const hand = m.z.handL.y < m.z.handR.y ? m.z.handL : m.z.handR, hx = hand.x * m.k, hy = hand.y * m.k;
  const glas = `<g transform="translate(${r(hx)} ${r(hy + 0.4)})"><rect x="-.6" y="-2.6" width="1.2" height="2.6" fill="#7a3e17"/><rect x="-.6" y="-2.9" width="1.2" height=".5" rx=".2" fill="#f4ead6"/><rect x=".15" y="-2.3" width=".25" height="1.9" fill="#fff" opacity=".4"/></g>`;
  S.teil({ id: "gast", de: "der Gast", syl: "GAST", it: "l'ospite", itSyl: "O-spi-te", en: "guest", x: p[0], y: p[1], kunst: schlag(0, 0.3, 5, 1.68 * s, 0.45) + gegen(m.svg) + glas,
    tipp: "Die Gäste stehen am Fass und trinken Altbier. Im Brauhaus sagt man: „Ein Alt, bitte!“" });
}
{
  const p = P(FASS.d, FASS.l, 0), s = F / FASS.d, H = 1.05 * s, R = 0.33 * s, ry = R * 0.16;
  const sk = schlag(0, 0.4, 2 * R, H, 0.45);
  let k = "";
  k += `<path d="M${r(-R * 0.9)} 0 Q${r(-R * 1.12)} ${r(-H / 2)} ${r(-R * 0.9)} ${r(-H)} L${r(R * 0.9)} ${r(-H)} Q${r(R * 1.12)} ${r(-H / 2)} ${r(R * 0.9)} 0 Z" fill="${HOLZ}"/>`;
  for (let i = 1; i < 7; i++) { const t = -1 + i / 3.5; k += `<path d="M${r(t * R * 0.9)} 0 Q${r(t * R * 1.12)} ${r(-H / 2)} ${r(t * R * 0.9)} ${r(-H)}" stroke="#4a2e16" stroke-width=".22" fill="none" opacity=".7"/>`; }
  for (const f of [0.12, 0.3, 0.7, 0.88]) { const w = R * (0.9 + 0.22 * Math.sin(f * Math.PI)); k += `<rect x="${r(-w)}" y="${r(-H * f - 0.6)}" width="${r(2 * w)}" height="1.2" rx=".3" fill="${S.lg("reif", [[0, "#2c2c2c"], [0.6, "#6b6b6b"], [1, "#4a4a4a"]], 0, 0, 1, 0)}"/>`; }
  /* Glanz der Gegenlichtsonne: breite, weiche Fläche zwischen den Reifen, an jedem Reifen unterbrochen */
  const glanz = S.lg("fassglanz", [[0, "#ffd9a0", 0], [0.55, "#ffd9a0", 0.3], [1, "#ffd9a0", 0]], 0, 0, 1, 0);
  for (const [f0, f1] of [[0.12, 0.3], [0.3, 0.7], [0.7, 0.88]]) { const w0 = R * (0.9 + 0.22 * Math.sin(f0 * Math.PI)), w1 = R * (0.9 + 0.22 * Math.sin(f1 * Math.PI)); k += `<path d="M${r(w0 * 0.3)} ${r(-H * f0 - 0.7)} L${r(w0 * 0.97)} ${r(-H * f0 - 0.7)} L${r(w1 * 0.97)} ${r(-H * f1 + 0.7)} L${r(w1 * 0.3)} ${r(-H * f1 + 0.7)} Z" fill="${glanz}"/>`; }
  k += `<path d="M${r(-R * 0.9)} 0 Q${r(-R * 1.12)} ${r(-H / 2)} ${r(-R * 0.9)} ${r(-H)} L${r(R * 0.2)} ${r(-H)} Q${r(R * 0.25)} ${r(-H / 2)} ${r(R * 0.2)} 0 Z" fill="#000" opacity=".14"/>`;
  k = sk + gegen(k);
  /* Tischplatte (rundes Brett) */
  k += `<ellipse cx="0" cy="${r(-H)}" rx="${r(R * 1.2)}" ry="${r(ry * 1.4 + 0.6)}" fill="#5a3a1f"/><ellipse cx="0" cy="${r(-H - 0.5)}" rx="${r(R * 1.2)}" ry="${r(ry * 1.4 + 0.5)}" fill="${S.lg("platte", [[0, "#b7834f"], [1, "#8c5d33"]])}"/>`;
  const top = -H - 0.5;
  /* zwei Altbiergläser: eins voll auf dem Bierdeckel (Deckel vorn sichtbar), eins halb leer daneben */
  const glas = (x, y, voll) => {
    let g = `<path d="M${r(x - 0.75)} ${r(y)} L${r(x - 0.8)} ${r(y - 3.4)} L${r(x + 0.8)} ${r(y - 3.4)} L${r(x + 0.75)} ${r(y)} Z" fill="#e7f0f2" opacity=".55" stroke="#b8c8cc" stroke-width=".08"/>`;
    g += `<path d="M${r(x - 0.74)} ${r(y - 0.05)} L${r(x - 0.79)} ${r(y - 3.4 * voll)} L${r(x + 0.79)} ${r(y - 3.4 * voll)} L${r(x + 0.74)} ${r(y - 0.05)} Z" fill="${S.lg("alt", [[0, "#8a4a1c"], [0.5, "#5a2c10"], [1, "#7a3e17"]], 0, 0, 1, 0)}"/>`;
    g += `<rect x="${r(x - 0.76)}" y="${r(y - 3.4 * voll - 0.55)}" width="1.52" height=".6" rx=".25" fill="#f4ead6"/><rect x="${r(x + 0.15)}" y="${r(y - 3.1)}" width=".22" height="2.6" fill="#fff" opacity=".45"/>`;
    return g;
  };
  const bd = { x: -4.4, y: top + 0.25 };
  k += `<ellipse cx="${bd.x}" cy="${r(bd.y + 0.15)}" rx="1.55" ry=".5" fill="#f6f1e4" stroke="#c9bfa8" stroke-width=".1"/>`;
  for (let i = 0; i < 4; i++) k += `<line x1="${r(bd.x - 1 + i * 0.3)}" y1="${r(bd.y + 0.55)}" x2="${r(bd.x - 0.92 + i * 0.3)}" y2="${r(bd.y + 0.28)}" stroke="#333" stroke-width=".08"/>`;
  k += glas(bd.x + 0.3, bd.y, 0.86) + glas(-1.9, top - 0.25, 0.5);
  /* Halve Hahn: Röggelchen (zwei bemehlte Hälften), dicke Scheibe Gouda, Senfklecks, Zwiebelringe — auf dem Brettchen */
  const hx2 = 1.4, hy2 = top + 0.85;
  k += `<ellipse cx="${hx2}" cy="${r(hy2)}" rx="2.7" ry=".6" fill="#d9b886"/>`;
  /* Röggelchen: zwei aneinandergebackene, bemehlte Hälften, hellbraun */
  for (const dx of [-1.75, -0.62]) k += `<ellipse cx="${r(hx2 + dx)}" cy="${r(hy2 - 0.5)}" rx=".7" ry=".4" fill="${S.rg("roggen", [[0, "#c99560"], [0.7, "#a16a38"], [1, "#7e4e26"]], 0.45, 0.3, 0.75)}"/>`;
  k += `<path d="M${r(hx2 - 1.18)} ${r(hy2 - 0.86)} q.08 .36 0 .7" stroke="#6e4220" stroke-width=".07" fill="none"/>`;
  for (const [dx, dy, a1, b1] of [[-2, -0.72, 0.26, 0.09], [-1.55, -0.78, 0.18, 0.07], [-0.85, -0.74, 0.24, 0.08], [-0.42, -0.66, 0.14, 0.06]]) k += `<ellipse cx="${r(hx2 + dx)}" cy="${r(hy2 + dy)}" rx="${a1}" ry="${b1}" fill="#f1e8da" opacity=".75" transform="rotate(-12 ${r(hx2 + dx)} ${r(hy2 + dy)})"/>`;
  /* junger Gouda: dicke, blassgelbe Scheibe mit Schnittkante und Rinde */
  k += `<path d="M${r(hx2 + 0.2)} ${r(hy2 - 0.1)} L${r(hx2 + 0.3)} ${r(hy2 - 0.95)} L${r(hx2 + 2.4)} ${r(hy2 - 0.85)} L${r(hx2 + 2.3)} ${r(hy2 - 0.05)} Z" fill="#f2d27a"/>`;
  k += `<path d="M${r(hx2 + 0.3)} ${r(hy2 - 0.95)} L${r(hx2 + 0.55)} ${r(hy2 - 1.2)} L${r(hx2 + 2.6)} ${r(hy2 - 1.1)} L${r(hx2 + 2.4)} ${r(hy2 - 0.85)} Z" fill="#f8e29a"/>`;
  k += `<path d="M${r(hx2 + 2.4)} ${r(hy2 - 0.85)} L${r(hx2 + 2.6)} ${r(hy2 - 1.1)} L${r(hx2 + 2.5)} ${r(hy2 - 0.3)} L${r(hx2 + 2.3)} ${r(hy2 - 0.05)} Z" fill="#d9a23a"/>`;
  k += `<ellipse cx="${r(hx2 + 1.3)}" cy="${r(hy2 - 1.12)}" rx=".38" ry=".09" fill="#c99a1e"/>`;
  k += `<ellipse cx="${r(hx2 + 1.9)}" cy="${r(hy2 - 1.1)}" rx=".33" ry=".08" fill="none" stroke="#f6f0e6" stroke-width=".08"/><ellipse cx="${r(hx2 + 0.95)}" cy="${r(hy2 - 1.15)}" rx=".28" ry=".07" fill="none" stroke="#f6f0e6" stroke-width=".08"/>`;
  /* Mostertpöttche: graues Steinzeugtöpfchen mit blauem Dekor und Holzspatel */
  const sx = 5, sy = top + 0.3;
  k += `<path d="M${sx - 0.75} ${r(sy)} Q${sx - 1.05} ${r(sy - 0.9)} ${sx - 0.8} ${r(sy - 1.6)} L${sx + 0.8} ${r(sy - 1.6)} Q${sx + 1.05} ${r(sy - 0.9)} ${sx + 0.75} ${r(sy)} Z" fill="${S.lg("steinzeug", [[0, "#8d9296"], [0.5, "#c9cdd0"], [1, "#9ea3a7"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${sx - 0.85} ${r(sy - 1.15)} Q${sx} ${r(sy - 1.05)} ${sx + 0.85} ${r(sy - 1.15)}" stroke="#2f4f9a" stroke-width=".18" fill="none"/><path d="M${sx - 0.35} ${r(sy - 0.75)} q.35 -.35 .7 0 q-.35 .35 -.7 0 Z" fill="#2f4f9a"/><path d="M${sx - 0.9} ${r(sy - 0.3)} Q${sx} ${r(sy - 0.2)} ${sx + 0.9} ${r(sy - 0.3)}" stroke="#2f4f9a" stroke-width=".12" fill="none"/>`;
  k += `<ellipse cx="${sx}" cy="${r(sy - 1.6)}" rx=".85" ry=".22" fill="#7d8286"/><path d="M${sx + 0.2} ${r(sy - 1.7)} L${sx + 0.55} ${r(sy - 3)} L${sx + 0.8} ${r(sy - 2.95)} L${sx + 0.4} ${r(sy - 1.65)} Z" fill="#d8b47a"/>`;
  const zy = p[1] + top;
  S.teil({ id: "fass", de: "das Fass", syl: "FASS", it: "la botte", itSyl: "BOT-te", en: "barrel", x: p[0], y: p[1], steht: true, kunst: k,
    tipp: "Vor den Brauhäusern stehen alte Bierfässer als Stehtische.",
    zoom: { x: p[0] - 12, y: zy - 7, w: 24, h: 16 },
    unter: [
      { id: "altbier", de: "das Altbier", syl: "ALT-bier", it: "la birra Altbier", itSyl: "BIR-ra ALT-bier", en: "altbier", x: p[0] - 1.6, y: zy, kunst: flaeche(-3.9, -4.1, 5.1, 3.8, 0.3),
        tipp: "Altbier ist dunkel und kommt aus Düsseldorf. Man trinkt es aus kleinen Gläsern mit 0,25 Litern." },
      { id: "bierdeckel", de: "der Bierdeckel", syl: "BIER-de-ckel", it: "il sottobicchiere", itSyl: "sot-to-bic-CHIE-re", en: "beer mat", x: p[0] + bd.x, y: zy + 0.6, kunst: flaeche(-2.3, -0.5, 4.6, 1.3, 0.4),
        tipp: "Für jedes Altbier macht der Köbes einen Strich auf den Bierdeckel. Wer kein Bier mehr will, legt den Deckel auf das Glas." },
      { id: "senf", de: "der Senf", syl: "SENF", it: "la senape", itSyl: "SE-na-pe", en: "mustard", x: p[0] + sx, y: zy + 0.3, kunst: flaeche(-1.1, -3.2, 2.2, 3.3, 0.3),
        tipp: "Auf Düsseldorfer Platt heißt Senf „Mostert“. Man isst ihn aus dem grauen „Mostertpöttche“." },
      { id: "halvehahn", de: "der Halve Hahn", syl: "HAL-ve HAHN", it: "il panino con formaggio", itSyl: "pa-NI-no con for-MAG-gio", en: "rye roll with cheese", x: p[0] + hx2, y: zy + 0.9, kunst: flaeche(-2.4, -1.6, 5, 2.2, 0.3),
        tipp: "Ein „Halve Hahn“ ist kein halbes Hähnchen: Es ist ein Roggenbrötchen mit Käse, Senf und Zwiebeln." },
    ] });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/duesseldorf.js"));
console.log(aus);
