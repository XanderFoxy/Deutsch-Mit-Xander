#!/usr/bin/env node
/* =====================================================================
   WIEN (FASSUNG 854) — Bilderwelt neu: Städte der Welt
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … zu den bekanntesten
   Städten in anderen Ländern … als Profi-Grafikdesigner auf Hollywood-
   Niveau“ — und (Funk 291) „mit größter Sorgfalt und Präzision“.

   RECHERCHE (wien.info, austria.info „Stephansdom“, austria-forum
   „Stephansdom“, ganz-wien.at „Michaelertrakt“, schoenbrunn.at
   „Gloriette“, Wiener Riesenrad, austria-forum „Fiaker“, Kaffeehauskultur
   (UNESCO 2011)):
   - Die vier großen Wahrzeichen stehen nicht in EINEM Blick (Schönbrunn
     liegt 5 km im Südwesten, das Riesenrad 2,7 km im Nordosten). Darum
     eine gemalte VEDUTE nach den echten Himmelsrichtungen: Man sitzt im
     Schanigarten eines Kaffeehauses an der Ringstraße im Süden der
     Altstadt und schaut nach NORDEN — links (Westen) Schloss SCHÖNBRUNN
     (Schönbrunner Gelb, 175 m lang) vor dem Hügel mit der GLORIETTE
     (1775, Hohenberg: Mitte als Triumphbogen, verglast — heute Café —,
     Arkadenflügel mit Doppelsäulen, oben der Reichsadler auf der
     Weltkugel zwischen Trophäen); halblinks (Nordwesten) die HOFBURG mit
     der grünen Michaelerkuppel (54 m, Kirschner 1889–93); in der Mitte
     (Norden) der STEPHANSDOM von SÜDEN: links die zwei Heidentürme
     (65 m), das Langhaus mit Ziergiebeln, davor der SÜDTURM „Steffl“
     (136,4 m, vergoldetes Kreuz), dahinter lugt der Nordturm (68 m) mit
     der Renaissance-Haube über den First; das DACH (111 m lang, 230.000
     glasierte Ziegel im Zickzack, über dem Chor auf der Südseite der
     DOPPELADLER der Habsburger); rechts (Nordosten) das RIESENRAD im
     Prater (1897, Walter Basset, 64,75 m hoch, 61 m Durchmesser, 15 rote
     Waggons). Am Horizont im Norden der Wienerwald mit dem Kahlenberg.
   - Auf der Ringstraße: die STRASSENBAHN (rot-weiß, Linie D), ein
     FIAKER (zwei Pferde, schwarze Kutsche, der Kutscher mit MELONE —
     im Dienst Pflicht). Vorn der Tisch im Kaffeehaus: Marmorplatte,
     MELANGE und GLAS WASSER auf dem Silbertablett, SACHERTORTE
     (Marillenmarmelade, Schokoglasur) mit SCHLAGOBERS, WIENER SCHNITZEL
     mit ZITRONE, die ZEITUNG im Holzhalter.
   - LICHT: Sommernachmittag, die Sonne im Südwesten (links hinter uns):
     Südseiten hell, rechte Seiten im Schatten.
   Maßstab: Horizont y = 140, Auge 1,55 m über der Straße (sitzend auf dem
   Podest). Brennweite 160: in 12 m (Fiaker) 13,3 je Meter, in 22 m
   (Straßenbahn) 7,3 je Meter, der Tisch in 1,2 m. Die Wahrzeichen sind
   wie auf einer Vedute näher gerückt: Dom ≈ 0,97 je Meter, Riesenrad
   0,85, Hofburg 0,9, Schönbrunn 0,5.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "wien", titel: "Wien", emoji: "🎡", thema: "Länder", kuerzel: "wie", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1897);
const r = B.r;
const HOR = 140, AUGE = 1.55, F = 160;
const strasse = (d) => r(HOR + AUGE * F / d);   /* Fußpunkt auf der Straße in d Metern */

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2"/></filter>`);
S.def(`<filter id="${S.id("baum")}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".7"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".3"/></filter>`);
const SAND = S.lg("sand", [[0, "#d6c8a8"], [0.5, "#c4b391"], [1, "#a39274"]], 0, 0, 1, 0);
const SAND_S = S.lg("sands", [[0, "#8f826a"], [1, "#6f6553"]], 0, 0, 1, 0);
const KUPFER = S.lg("kupfer", [[0, "#93c8ad"], [0.5, "#6fae92"], [1, "#4a8670"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff3b0"], [0.45, "#f0c64a"], [1, "#a8760f"]], 0, 0, 1, 1);
const GELB = S.lg("gelb", [[0, "#f3cf72"], [1, "#e0b04c"]]);
/* Zickzack-Muster des Domdachs: gelb, grün, weiß, dunkel */
S.def(`<pattern id="${S.id("zickzack")}" patternUnits="userSpaceOnUse" width="6" height="5.2"><rect width="6" height="5.2" fill="#d9b54c"/>` +
  `<path d="M0 1.3 L1.5 0 L3 1.3 L4.5 0 L6 1.3" stroke="#3d6e4a" stroke-width="1" fill="none"/>` +
  `<path d="M0 2.6 L1.5 1.3 L3 2.6 L4.5 1.3 L6 2.6" stroke="#f3ead2" stroke-width=".55" fill="none"/>` +
  `<path d="M0 3.9 L1.5 2.6 L3 3.9 L4.5 2.6 L6 3.9" stroke="#2f2a26" stroke-width=".8" fill="none"/>` +
  `<path d="M0 5.2 L1.5 3.9 L3 5.2 L4.5 3.9 L6 5.2" stroke="#3d6e4a" stroke-width=".55" fill="none"/></pattern>`);

/* =====================================================================
   KULISSE — Sommerhimmel, Dächer der Stadt
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 14}" fill="${S.lg("himmel", [[0, "#4f8cc9"], [0.5, "#93bfe3"], [0.85, "#dbe9ef"], [1, "#eef1e6"]])}"/>`);
S.hinten(`<rect width="400" height="${HOR + 14}" fill="${S.rg("sonne", [[0, "#fff6d8", 0.45], [0.4, "#fff6d8", 0.1], [1, "#fff6d8", 0]], 0, 0.05, 0.6)}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[70, 30, 1.2], [180, 16, 0.8], [300, 26, 1.1], [255, 60, 0.6], [30, 70, 0.7]]) {
    w += `<g filter="url(#${S.id("wolke")})">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 5], [-11, 2, 9, 3.6], [11, 1.6, 10, 4], [-3, -4, 8, 5], [5, -3, 7, 4.4]]) w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#ffffff"/>`;
    w += `<ellipse cx="${r(x + 2 * s)}" cy="${r(y + 3.6 * s)}" rx="${r(17 * s)}" ry="${r(2 * s)}" fill="#c9d6e2"/></g>`;
  }
  S.hinten(w);
}
/* Dächer der Stadt zwischen den Wahrzeichen (Ziegelrot, helle Fassaden, Kupferdächer) */
{
  let c = `<rect x="0" y="${HOR - 8}" width="400" height="16" fill="#e3e8e6" opacity=".5"/>`;
  let x = 0;
  while (x < 400) {
    const w = 7 + rnd() * 9, h = 5 + rnd() * 7, y0 = 151;
    const fas = ["#e9dfc8", "#e2d2b0", "#efe7d6", "#d9c7a2", "#e8d9c0"][Math.floor(rnd() * 5)];
    c += `<rect x="${r(x)}" y="${r(y0 - h)}" width="${r(w)}" height="${r(h)}" fill="${fas}"/>`;
    for (let i = 0; i < Math.floor(w / 2.6); i++) c += `<rect x="${r(x + 1 + i * 2.6)}" y="${r(y0 - h + 1.6)}" width=".9" height="1.4" fill="#8a8274"/>`;
    const dach = rnd() < 0.15 ? "#6fa58c" : (rnd() < 0.5 ? "#a8553e" : "#94503f");
    c += `<path d="M${r(x - 0.4)} ${r(y0 - h)} L${r(x + 1.8)} ${r(y0 - h - 3)} L${r(x + w - 1.8)} ${r(y0 - h - 3)} L${r(x + w + 0.4)} ${r(y0 - h)} Z" fill="${dach}"/>`;
    if (rnd() < 0.5) c += `<rect x="${r(x + w * 0.6)}" y="${r(y0 - h - 4.4)}" width=".9" height="2" fill="#8a4a3a"/>`;
    x += w;
  }
  /* Peterskirche: kleine grüne Kuppel links vom Dom */
  c += `<path d="M152 139 Q152 131 158 129.6 Q164 131 164 139 Z" fill="${KUPFER}"/><rect x="157.2" y="126" width="1.6" height="3.8" fill="#6fae92"/><circle cx="158" cy="125.6" r=".6" fill="${GOLD}"/>`;
  S.hinten(`<g opacity=".95">${c}</g>`);
}

/* =====================================================================
   1 — DER WIENERWALD mit dem Kahlenberg (Horizont im Norden)
   ===================================================================== */
{
  let k = `<path d="M0 141 L0 124 Q30 116 62 118 Q96 112 128 115 Q140 104 156 107 Q188 104 200 110 Q230 114 262 124 Q285 132 310 138 L310 141 Z" fill="${S.lg("wald", [[0, "#8fa7a8"], [1, "#a9bcb6"]])}"/>`;
  k += `<path d="M0 141 L0 130 Q40 124 80 127 Q120 122 160 126 Q200 122 240 130 L270 141 Z" fill="#9db3ae" opacity=".8"/>`;
  /* Sendemast auf dem Kahlenberg, Kirche auf dem Leopoldsberg */
  k += `<line x1="152" y1="108" x2="152" y2="93" stroke="#7c8f92" stroke-width=".5"/><path d="M150.8 108 L152 97 L153.2 108" stroke="#7c8f92" stroke-width=".25" fill="none"/><rect x="151.6" y="93" width=".8" height=".6" fill="#c0504a"/>`;
  S.teil({ id: "wienerwald", de: "der Wienerwald", syl: "WIE-ner-wald", it: "il Bosco Viennese", itSyl: "BO-sco vien-NE-se", en: "Vienna Woods", x: 0, y: 0,
    kunst: `<g filter="url(#${S.id("dunst")})">${k}</g>`, tipp: "Im Norden liegen die Hügel des Wienerwalds mit dem Kahlenberg." });
}

/* =====================================================================
   2 — DIE GLORIETTE auf dem Hügel und 3 — SCHLOSS SCHÖNBRUNN (Westen)
   ===================================================================== */
{
  /* der Hügel im Schlosspark mit Bäumen */
  let k = `<path d="M-2 146 L-2 112 Q14 100 34 99.4 L70 99.4 Q92 101 108 124 L112 146 Z" fill="${S.lg("huegel", [[0, "#8aa676"], [0.5, "#6f8f5e"], [1, "#58774c"]])}"/>`;
  /* Rasen der Hangwiese (Mittelachse zur Gloriette), Baumgruppen des Schlossparks */
  k += `<path d="M44 99.6 L60 99.6 Q64 120 70 146 L34 146 Q40 120 44 99.6 Z" fill="#9db886" opacity=".7"/>`;
  let baum = "";
  for (let i = 0; i < 70; i++) {
    const x = rnd() * 108, top = x < 34 ? 112 - x * 0.37 : (x > 70 ? 99.4 + (x - 70) * 0.62 : 99.4), y = top + 2 + rnd() * (144 - top);
    if (x > 40 && x < 64 && y < 128) continue;
    baum += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(2.2 + rnd() * 2.4)}" ry="${r(1.6 + rnd() * 1.6)}" fill="${["#5d7f4c", "#4f7042", "#6a8c56"][Math.floor(rnd() * 3)]}"/>`;
  }
  k += `<g filter="url(#${S.id("baum")})" opacity=".9">${baum}</g>`;
  /* Mitte (Triumphbogen, verglast), Arkadenflügel, Adler auf der Weltkugel */
  const GX = 52, GY = 99.6;
  k += `<rect x="${GX - 26}" y="${GY - 6.4}" width="52" height="6.4" fill="${S.lg("glor", [[0, "#f4e6b8"], [1, "#dcc78e"]])}"/>`;
  for (let i = 0; i < 8; i++) for (const sx of [-1, 1]) {
    const x = GX + sx * (8.6 + i * 2.2);
    k += `<path d="M${r(x - 0.7)} ${GY} L${r(x - 0.7)} ${r(GY - 4)} Q${r(x)} ${r(GY - 5)} ${r(x + 0.7)} ${r(GY - 4)} L${r(x + 0.7)} ${GY} Z" fill="#6f7a6a"/>`;
  }
  k += `<rect x="${GX - 7.4}" y="${GY - 11}" width="14.8" height="11" fill="#f2e3b2"/>`;
  for (const dx of [-4.4, 0, 4.4]) k += `<path d="M${r(GX + dx - 1.5)} ${GY} L${r(GX + dx - 1.5)} ${r(GY - 6.6)} Q${r(GX + dx)} ${r(GY - 8.6)} ${r(GX + dx + 1.5)} ${r(GY - 6.6)} L${r(GX + dx + 1.5)} ${GY} Z" fill="${S.lg("glas", [[0, "#7f97a4"], [1, "#4f6672"]])}"/>`;
  for (const dx of [-6.6, -2.2, 2.2, 6.6]) k += `<rect x="${r(GX + dx - 0.35)}" y="${GY - 10}" width=".7" height="10" fill="#fbf4dc"/>`;
  k += `<rect x="${GX - 27}" y="${GY - 7.2}" width="54" height=".9" fill="#faf2d8"/><rect x="${GX - 8}" y="${GY - 12}" width="16" height="1.2" fill="#faf2d8"/>`;
  k += `<path d="M${GX - 3} ${GY - 12} L${GX - 2.6} ${GY - 13.6} L${GX + 2.6} ${GY - 13.6} L${GX + 3} ${GY - 12} Z" fill="#efe1b2"/>`;
  k += `<circle cx="${GX}" cy="${GY - 14.8}" r="1.3" fill="#3f4a46"/><path d="M${GX - 3.6} ${GY - 16.6} Q${GX - 2} ${GY - 15} ${GX} ${GY - 16} Q${GX + 2} ${GY - 15} ${GX + 3.6} ${GY - 16.6} Q${GX + 2} ${GY - 18.6} ${GX} ${GY - 17.4} Q${GX - 2} ${GY - 18.6} ${GX - 3.6} ${GY - 16.6} Z" fill="#2f3532"/>`;
  for (const sx of [-1, 1]) k += `<path d="M${GX + sx * 6.4} ${GY - 12} l${sx * 0.6} -2.4 l${sx * 0.6} 2.4 Z" fill="#d8c79a"/>`;
  S.teil({ id: "gloriette", de: "die Gloriette", syl: "glo-ri-ET-te", it: "la Gloriette", itSyl: "glo-ri-ET-te", en: "Gloriette", x: 0, y: 0,
    kunst: `<g filter="url(#${S.id("dunst")})">${k}</g>`, tipp: "Die Gloriette steht auf dem Hügel über dem Schlossgarten. Drinnen ist heute ein Café." });
}
{
  /* Schloss Schönbrunn: lange gelbe Fassade, Mittelrisalit, Freitreppe */
  const x0 = 6, x1 = 100, F0 = 146, T = 130;
  let k = `<rect x="${x0}" y="${T}" width="${x1 - x0}" height="${F0 - T}" fill="${GELB}"/>`;
  k += `<path d="M${x0 - 0.6} ${T} L${x0 + 2} ${T - 3} L${x1 - 2} ${T - 3} L${x1 + 0.6} ${T} Z" fill="#7d8790"/>`;
  for (let x = x0 + 4; x < x1 - 2; x += 9) k += `<rect x="${x}" y="${T - 5}" width="1" height="2.4" fill="#8a7d70"/>`;
  /* Mittelrisalit höher, mit Attika und Figuren */
  const M = (x0 + x1) / 2;
  k += `<rect x="${M - 11}" y="${T - 4}" width="22" height="${F0 - T + 4}" fill="#f0c662"/><rect x="${M - 11.6}" y="${T - 5}" width="23.2" height="1.2" fill="#fbf2dc"/>`;
  for (let x = M - 10; x <= M + 10; x += 4) k += `<path d="M${x - 0.4} ${T - 5} l.1 -1.8 q.3 -.6 .6 0 l.1 1.8 Z" fill="#f4ecd8"/>`;
  /* Fensterreihen (weiß gerahmt) */
  for (let row = 0; row < 3; row++) for (let x = x0 + 1.6; x < x1 - 1; x += 2.8) {
    const y = T + 1.6 + row * 4.6 - (Math.abs(x - M) < 11 ? 3.4 : 0);
    k += `<rect x="${r(x)}" y="${r(y)}" width="1.3" height="${row === 1 ? 2.8 : 2}" fill="#5d6870" stroke="#fbf4e0" stroke-width=".3"/>`;
  }
  for (const x of [M - 11, M + 11, x0 + 14, x1 - 14]) k += `<rect x="${x - 0.5}" y="${T}" width="1" height="${F0 - T}" fill="#f8e7b4"/>`;
  /* Freitreppe in der Mitte (zwei Läufe) */
  k += `<path d="M${M - 7} ${F0} L${M - 3} ${F0 - 4} L${M + 3} ${F0 - 4} L${M + 7} ${F0} Z" fill="#e9e2d2"/><path d="M${M - 3} ${F0 - 4} L${M + 3} ${F0 - 4}" stroke="#bfb5a3" stroke-width=".4"/>`;
  k += `<rect x="${x0}" y="${T}" width="${x1 - x0}" height="${F0 - T}" fill="${S.lg("schlosslicht", [[0, "#fff4d0", 0.25], [1, "#7a5a20", 0.12]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "schloss", de: "das Schloss Schönbrunn", syl: "SCHLOSS SCHÖN-brunn", it: "la Reggia di Schönbrunn", itSyl: "REG-gia di SCHÖN-brunn", en: "Schönbrunn Palace", x: 0, y: 0,
    kunst: `<g filter="url(#${S.id("dunst")})">${k}</g>`, tipp: "Im Schloss Schönbrunn wohnte die Kaiserfamilie im Sommer. Das Gelb heißt „Schönbrunner Gelb“." });
}

/* =====================================================================
   4 — DIE HOFBURG mit der Michaelerkuppel (Nordwesten) — Lupe: Kuppel
   ===================================================================== */
{
  const M = 136, F0 = 151, s = 0.9;
  const y = (m) => r(F0 - m * s);
  let k = "";
  /* Michaelertrakt: Flügel, Mitte mit Tor, Herkulesgruppen, Attika mit Figuren */
  k += `<rect x="104" y="${y(21)}" width="64" height="${r(21 * s)}" fill="${S.lg("hofburg", [[0, "#f1ebde"], [1, "#d8cfbd"]])}"/>`;
  for (let row = 0; row < 3; row++) for (let x = 106; x < 166; x += 3.4) {
    if (Math.abs(x + 0.7 - M) < 7) continue;
    k += `<rect x="${r(x)}" y="${r(y(18) + row * 5.4)}" width="1.4" height="${row === 1 ? 3 : 2.4}" fill="#6a6f74"/>`;
  }
  k += `<rect x="103.4" y="${y(21.6)}" width="65.2" height="1.1" fill="#fbf8f0"/>`;
  for (let x = 106; x < 167; x += 6) k += `<path d="M${x - 0.4} ${y(21.6)} l.1 -1.7 q.3 -.6 .6 0 l.1 1.7 Z" fill="#ebe5d8"/>`;
  k += `<path d="M${M - 7} ${F0} L${M - 7} ${y(24)} L${M + 7} ${y(24)} L${M + 7} ${F0} Z" fill="#f6f1e6"/>`;
  k += `<path d="M${M - 3.2} ${F0} L${M - 3.2} ${y(9)} Q${M} ${y(13)} ${M + 3.2} ${y(9)} L${M + 3.2} ${F0} Z" fill="#4b4a4c"/>`;
  for (const dx of [-5.6, -4.4, 4.4, 5.6]) k += `<rect x="${M + dx - 0.35}" y="${y(17)}" width=".7" height="${r(17 * s)}" fill="#e9e1d1"/>`;
  for (const dx of [-11, -8.4, 8.4, 11]) k += `<path d="M${M + dx - 1} ${y(4.4)} l.3 -3 q.7 -1 1.4 0 l.3 3 Z" fill="#f4efe4"/><circle cx="${M + dx}" cy="${y(8.6)}" r=".55" fill="#f4efe4"/>`;
  /* Tambour mit Fenstern, grüne Rippenkuppel mit goldenen Girlanden, Laterne, Krone */
  k += `<rect x="${M - 9}" y="${y(32)}" width="18" height="${r(8 * s)}" fill="#efe8da"/>`;
  for (let i = 0; i < 5; i++) k += `<path d="M${r(M - 7.2 + i * 3.4)} ${y(25.6)} L${r(M - 7.2 + i * 3.4)} ${y(29.4)} Q${r(M - 6.4 + i * 3.4)} ${y(30.4)} ${r(M - 5.6 + i * 3.4)} ${y(29.4)} L${r(M - 5.6 + i * 3.4)} ${y(25.6)} Z" fill="#5e6266"/>`;
  k += `<rect x="${M - 9.6}" y="${y(32.6)}" width="19.2" height="1" fill="#fbf8f0"/>`;
  k += `<path d="M${M - 9} ${y(32.6)} C${M - 9} ${y(41)} ${M - 5} ${y(46.4)} ${M} ${y(47)} C${M + 5} ${y(46.4)} ${M + 9} ${y(41)} ${M + 9} ${y(32.6)} Z" fill="${KUPFER}"/>`;
  for (const t of [-0.66, -0.33, 0, 0.33, 0.66]) k += `<path d="M${r(M + t * 9)} ${y(32.6)} Q${r(M + t * 7.6)} ${y(42)} ${M} ${y(47)}" stroke="#d9b54a" stroke-width=".3" fill="none"/>`;
  k += `<path d="M${M - 8.4} ${y(35)} Q${M - 6} ${y(33.6)} ${M - 4.2} ${y(35.6)} Q${M - 2} ${y(34)} ${M} ${y(36)} Q${M + 2} ${y(34)} ${M + 4.2} ${y(35.6)} Q${M + 6} ${y(33.6)} ${M + 8.4} ${y(35)}" stroke="#e8c14a" stroke-width=".4" fill="none"/>`;
  k += `<path d="M${M - 6.4} ${y(39)} C${M - 6} ${y(43.6)} ${M - 3.6} ${y(45.8)} ${M - 1} ${y(46.4)}" stroke="#c8ecd8" stroke-width=".6" opacity=".6" fill="none"/>`;
  k += `<rect x="${M - 1.6}" y="${y(51)}" width="3.2" height="${r(4 * s)}" fill="#7fbea0"/><path d="M${M - 2} ${y(51)} Q${M} ${y(52.6)} ${M + 2} ${y(51)} Z" fill="${KUPFER}"/>`;
  k += `<path d="M${M - 1.2} ${y(52.4)} L${M - 1.4} ${y(53.8)} L${M - 0.6} ${y(53.2)} L${M} ${y(54.2)} L${M + 0.6} ${y(53.2)} L${M + 1.4} ${y(53.8)} L${M + 1.2} ${y(52.4)} Z" fill="${GOLD}"/>`;
  S.teil({ id: "hofburg", de: "die Hofburg", syl: "HOF-burg", it: "il Palazzo imperiale", itSyl: "pa-LAZ-zo im-pe-RIA-le", en: "Hofburg Palace", x: 0, y: 0, kunst: k,
    tipp: "In der Hofburg wohnte die Kaiserfamilie im Winter. Heute arbeitet hier der Bundespräsident.",
    zoom: { x: 104, y: 98, w: 64, h: 42 },
    unter: [
      { id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: M, y: y(32), kunst: flaeche(-9.4, -21, 18.8, 21),
        tipp: "Unter der grünen Michaelerkuppel geht man in die Hofburg hinein." },
    ] });
}

/* =====================================================================
   5 — DER STEPHANSDOM von Süden (Mitte) — Lupe: Turm, Dach, Doppeladler
   ===================================================================== */
const DOM = { w: 168, o: 284, fuss: 151, s: 0.97 };
{
  const { w: W0, o: O0, fuss: F0, s } = DOM;
  const y = (m) => r(F0 - m * s);
  const TRAUFE = y(27), FIRST = y(62);
  let k = "";
  /* Nordturm (68 m) mit Renaissance-Haube — lugt links vom Südturm über den First */
  const NX = 211;
  k += `<rect x="${NX - 4}" y="${y(60)}" width="8" height="${r(8 * s)}" fill="${SAND_S}"/>`;
  k += `<path d="M${NX - 4.6} ${y(60)} Q${NX - 4.8} ${y(64)} ${NX - 1.6} ${y(65)} Q${NX - 2.4} ${y(66.6)} ${NX} ${y(68)} Q${NX + 2.4} ${y(66.6)} ${NX + 1.6} ${y(65)} Q${NX + 4.8} ${y(64)} ${NX + 4.6} ${y(60)} Z" fill="${KUPFER}"/>`;
  k += `<rect x="${NX - 0.5}" y="${y(70.4)}" width="1" height="${r(2.4 * s)}" fill="#5e9a80"/><circle cx="${NX}" cy="${y(70.8)}" r=".6" fill="${GOLD}"/>`;
  /* Dach: das Langhaus links, der Chor rechts, der Osten abgewalmt */
  k += `<path d="M${W0 + 14} ${TRAUFE} L${W0 + 14} ${FIRST} L${O0 - 14} ${FIRST} L${O0} ${TRAUFE} Z" fill="url(#${S.id("zickzack")})"/>`;
  k += `<path d="M${W0 + 14} ${TRAUFE} L${W0 + 14} ${FIRST} L${O0 - 14} ${FIRST} L${O0} ${TRAUFE} Z" fill="${S.lg("dachlicht", [[0, "#fff6d6", 0.25], [0.5, "#fff6d6", 0], [1, "#1a1408", 0.25]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${W0 + 14} ${FIRST} L${O0 - 14} ${FIRST}" stroke="#4a4036" stroke-width=".6"/>`;
  /* über dem Chor (rechts vom Südturm) das Ziegelbild des Doppeladlers: schwarz,
     mit Kronen, Schwert und Zepter, auf goldgelbem Grund */
  const AX = 257, AY = r((TRAUFE + FIRST) / 2 + 0.6), AS = 1.1;
  const FX0 = AX - 16, FX1 = AX + 16, FY0 = r(FIRST + 2.2), FY1 = r(TRAUFE - 2.2);
  /* goldgelbes Feld im Ziegelmuster, oben und unten mit Zickzack-Rand */
  let zz = `M${FX0} ${FY0}`;
  for (let x = FX0, j = 0; x < FX1; x += 1.5, j++) zz += ` L${r(x + 1.5)} ${r(FY0 + (j % 2 ? 0 : 1.3))}`;
  zz += ` L${FX1} ${FY1}`;
  for (let x = FX1, j = 0; x > FX0; x -= 1.5, j++) zz += ` L${r(x - 1.5)} ${r(FY1 - (j % 2 ? 0 : 1.3))}`;
  let adler = `<path d="${zz} Z" fill="${S.lg("chorgrund", [[0, "#f1d46e"], [1, "#d9ae42"]])}"/>`;
  for (let yy = FY0 + 2.4; yy < FY1 - 1; yy += 1.6) adler += `<line x1="${FX0}" y1="${r(yy)}" x2="${FX1}" y2="${r(yy)}" stroke="#bf9534" stroke-width=".15" opacity=".6"/>`;
  const halb = [[0, -4], [-1.1, -5.8], [-1.5, -8.2], [-2, -9.1], [-2.9, -9.3], [-3.9, -8.9], [-3.1, -8.5], [-2.4, -8.3], [-2.1, -7.1], [-2.4, -5.6], [-3, -4.8], [-4.8, -7.4], [-6.2, -10.4], [-6.7, -8], [-8.3, -9.9], [-8.6, -7.2], [-10.3, -8.5], [-10.2, -5.8], [-11.8, -6.3], [-11.2, -3.8], [-12.2, -3.4], [-10.6, -1.8], [-7, -1.3], [-4.6, -.5], [-3.2, .4], [-3, 2.6], [-4.3, 3.7], [-2.6, 3.4], [-2.2, 4.2], [-3.1, 7.6], [-1.4, 6.2], [-.8, 8.4], [0, 6.8]];
  const pt = ([x, y]) => `${r(AX + x * AS)} ${r(AY + y * AS)}`;
  adler += `<path d="M${halb.map(pt).join(" L")} L${halb.slice().reverse().map(([x, y]) => pt([-x, y])).join(" L")} Z" fill="#1b1816"/>`;
  for (const sx of [-1, 1]) {
    adler += `<path d="M${pt([sx * 3.6, -8.9])} L${pt([sx * 4.4, -8.4])}" stroke="#c8302a" stroke-width=".35"/>`;
    adler += `<path d="M${pt([sx * 1.8, -9.6])} L${pt([sx * 1.9, -10.9])} L${pt([sx * 2.3, -10.2])} L${pt([sx * 2.6, -11.1])} L${pt([sx * 2.9, -10.2])} L${pt([sx * 3.3, -10.9])} L${pt([sx * 3.4, -9.6])} Z" fill="${GOLD}"/>`;
    for (let f = 0; f < 4; f++) adler += `<path d="M${pt([sx * (4 + f * 1.7), -2.6 - f * 0.3])} L${pt([sx * (5.4 + f * 1.7), -6.4 - f * 0.6])}" stroke="#4a4038" stroke-width=".22"/>`;
  }
  adler += `<path d="M${pt([-1.6, -11.4])} L${pt([-1.7, -13.2])} L${pt([-.8, -12.4])} L${pt([0, -13.8])} L${pt([.8, -12.4])} L${pt([1.7, -13.2])} L${pt([1.6, -11.4])} Z" fill="${GOLD}"/>`;
  adler += `<path d="M${pt([-1.7, -3.2])} L${pt([1.7, -3.2])} L${pt([1.7, .2])} Q${pt([0, 1.8])} ${pt([-1.7, .2])} Z" fill="#c8302a" stroke="#e8c35a" stroke-width=".25"/><rect x="${r(AX - 1.7 * AS)}" y="${r(AY - 1.9 * AS)}" width="${r(3.4 * AS)}" height="${r(0.9 * AS)}" fill="#f6f2ea"/>`;
  adler += `<path d="M${pt([4.2, 3.4])} L${pt([7.6, -1])}" stroke="#d9dde0" stroke-width=".45"/><path d="M${pt([-4.2, 3.4])} L${pt([-7, 0])}" stroke="${GOLD}" stroke-width=".45"/><circle cx="${r(AX - 7.2 * AS)}" cy="${r(AY - 0.3 * AS)}" r=".5" fill="${GOLD}"/>`;
  k += adler;
  /* Westende: zwei Heidentürme (achteckig, Steinhelme) */
  for (const [hx, f] of [[W0 + 2, SAND_S], [W0 + 9, SAND]]) {
    k += `<rect x="${hx - 3.4}" y="${y(52)}" width="6.8" height="${r(52 * s)}" fill="${f}"/>`;
    for (const m of [32, 42]) k += `<path d="M${hx - 1.6} ${y(m)} L${hx - 1.6} ${y(m + 4)} Q${hx - 0.8} ${y(m + 5)} ${hx} ${y(m + 4)} L${hx} ${y(m)} Z M${hx + 0.2} ${y(m)} L${hx + 0.2} ${y(m + 4)} Q${hx + 1} ${y(m + 5)} ${hx + 1.8} ${y(m + 4)} L${hx + 1.8} ${y(m)} Z" fill="#3e3a36"/>`;
    k += `<rect x="${hx - 3.8}" y="${y(52.6)}" width="7.6" height="1" fill="#e6dcc4"/>`;
    k += `<path d="M${hx - 3.6} ${y(52.6)} L${hx} ${y(65)} L${hx + 3.6} ${y(52.6)} Z" fill="${f}"/><path d="M${hx} ${y(52.6)} L${hx} ${y(65)} L${hx + 3.6} ${y(52.6)} Z" fill="#000" opacity=".15"/>`;
    k += `<circle cx="${hx}" cy="${y(65.4)}" r=".55" fill="${GOLD}"/>`;
  }
  /* Langhaus und Chor: Sandsteinwand, Strebepfeiler, hohe Fenster, Ziergiebel */
  k += `<rect x="${W0 + 12}" y="${TRAUFE}" width="${O0 - W0 - 12}" height="${r(F0 - TRAUFE)}" fill="${SAND}"/>`;
  for (let x = W0 + 16; x < O0 - 2; x += 7.4) {
    if (x > 214 && x < 242) continue;
    k += `<path d="M${r(x + 1.4)} ${F0} L${r(x + 1.4)} ${y(19)} Q${r(x + 3.1)} ${y(22.4)} ${r(x + 4.8)} ${y(19)} L${r(x + 4.8)} ${F0} Z" fill="#4c4743"/>`;
    k += `<line x1="${r(x + 3.1)}" y1="${y(20.6)}" x2="${r(x + 3.1)}" y2="${F0}" stroke="#a69a82" stroke-width=".3"/>`;
    k += `<rect x="${r(x - 0.8)}" y="${y(25)}" width="1.6" height="${r(25 * s)}" fill="${SAND_S}"/><path d="M${r(x - 0.8)} ${y(25)} L${r(x)} ${y(31)} L${r(x + 0.8)} ${y(25)} Z" fill="#a59577"/>`;
    k += `<path d="M${r(x + 1)} ${TRAUFE} L${r(x + 3.1)} ${y(34)} L${r(x + 5.2)} ${TRAUFE} Z" fill="${SAND}" stroke="#8f826a" stroke-width=".25"/><circle cx="${r(x + 3.1)}" cy="${y(29.6)}" r=".7" fill="none" stroke="#6f6553" stroke-width=".25"/>`;
  }
  k += `<rect x="${W0 + 12}" y="${TRAUFE}" width="${O0 - W0 - 12}" height="1" fill="#e6dcc4"/>`;
  /* Ostende (Chor) etwas im Schatten */
  k += `<path d="M${O0 - 4} ${TRAUFE} L${O0} ${TRAUFE} L${O0} ${F0} L${O0 - 4} ${F0} Z" fill="${SAND_S}"/>`;
  /* Rußpatina: dunkle Streifen auf dem Stein */
  for (let i = 0; i < 24; i++) { const x = W0 + 12 + rnd() * (O0 - W0 - 16); k += `<rect x="${r(x)}" y="${r(TRAUFE + 2 + rnd() * 10)}" width="${r(0.4 + rnd() * 0.8)}" height="${r(3 + rnd() * 8)}" fill="#5e5547" opacity=".25"/>`; }
  /* der Südturm „Steffl“: vier Geschosse, Wimperge und Fialen, Turmhelm, vergoldetes Kreuz */
  const TX = 228;
  const stufe = (m0, m1, b0, b1, fenster) => {
    let g = `<path d="M${r(TX - b0 / 2)} ${y(m0)} L${r(TX - b1 / 2)} ${y(m1)} L${r(TX + b1 / 2)} ${y(m1)} L${r(TX + b0 / 2)} ${y(m0)} Z" fill="${SAND}"/>`;
    g += `<path d="M${r(TX + b0 * 0.12)} ${y(m0)} L${r(TX + b1 * 0.12)} ${y(m1)} L${r(TX + b1 / 2)} ${y(m1)} L${r(TX + b0 / 2)} ${y(m0)} Z" fill="#6b604e" opacity=".55"/>`;
    if (fenster) {
      const hm = (m1 - m0) * 0.7, mb = m0 + (m1 - m0) * 0.12, bw = b1 * 0.16;
      for (const dx of [-b1 * 0.2, b1 * 0.2]) g += `<path d="M${r(TX + dx - bw / 2)} ${y(mb)} L${r(TX + dx - bw / 2)} ${y(mb + hm * 0.8)} Q${r(TX + dx)} ${y(mb + hm)} ${r(TX + dx + bw / 2)} ${y(mb + hm * 0.8)} L${r(TX + dx + bw / 2)} ${y(mb)} Z" fill="#3c3834"/>`;
      for (const dx of [-b1 * 0.2, b1 * 0.2]) g += `<path d="M${r(TX + dx - bw * 0.8)} ${y(m1 - (m1 - m0) * 0.12)} L${r(TX + dx)} ${y(m1 + (m1 - m0) * 0.12)} L${r(TX + dx + bw * 0.8)} ${y(m1 - (m1 - m0) * 0.12)}" stroke="${SAND}" stroke-width=".7" fill="none"/>`;
    }
    for (const sx of [-1, 1]) g += `<path d="M${r(TX + sx * b1 / 2 - 0.5)} ${y(m1)} L${r(TX + sx * b1 / 2)} ${y(m1 + 5)} L${r(TX + sx * b1 / 2 + 0.5)} ${y(m1)} Z" fill="#a59577"/>`;
    g += `<rect x="${r(TX - b1 / 2 - 0.3)}" y="${y(m1 + 0.3)}" width="${r(b1 + 0.6)}" height=".6" fill="#e6dcc4"/>`;
    return g;
  };
  k += stufe(0, 30, 21, 19.4, true) + stufe(30, 58, 19.4, 15, true) + stufe(58, 82, 15, 10.6, true) + stufe(82, 100, 10.6, 7.6, true);
  /* Turmhelm mit Krabben */
  k += `<path d="M${TX - 3.8} ${y(100)} L${TX - 0.35} ${y(133)} L${TX + 0.35} ${y(133)} L${TX + 3.8} ${y(100)} Z" fill="${SAND}"/><path d="M${TX + 0.6} ${y(100)} L${TX + 0.2} ${y(133)} L${TX + 3.8} ${y(100)} Z" fill="#6b604e" opacity=".5"/>`;
  for (let m = 103; m < 131; m += 3.2) { const b = 3.8 * (133 - m) / 33; k += `<path d="M${r(TX - b)} ${y(m)} l-.7 .5 M${r(TX + b)} ${y(m)} l.7 .5" stroke="#a59577" stroke-width=".45"/>`; }
  k += `<circle cx="${TX}" cy="${y(133.6)}" r=".7" fill="${GOLD}"/><path d="M${TX} ${y(134)} L${TX} ${y(137.4)} M${TX - 1} ${y(136.2)} L${TX + 1} ${y(136.2)}" stroke="#e0b030" stroke-width=".45"/>`;
  /* Portal unten am Turm */
  k += `<path d="M${TX - 3} ${F0} L${TX - 3} ${y(6)} L${TX} ${y(10)} L${TX + 3} ${y(6)} L${TX + 3} ${F0} Z" fill="#3a3632"/>`;
  S.teil({ id: "stephansdom", de: "der Stephansdom", syl: "STE-fans-dom", it: "il Duomo di Santo Stefano", itSyl: "DUO-mo di SAN-to STE-fa-no", en: "St. Stephen's Cathedral", x: 0, y: 0, kunst: k,
    tipp: "Der Stephansdom ist das Herz von Wien. Die Wiener sagen „Steffl“ zu seinem Südturm.",
    zoom: { x: 168, y: 52, w: 120, h: 84 },
    unter: [
      { id: "turm", de: "der Turm", syl: "TURM", it: "la torre", itSyl: "TOR-re", en: "tower", x: TX, y: y(58), kunst: flaeche(-8, -42, 16, 42, 0.6),
        tipp: "Der Südturm ist 136 Meter hoch. Wer 343 Stufen steigt, schaut über ganz Wien." },
      { id: "dach", de: "das Dach", syl: "DACH", it: "il tetto", itSyl: "TET-to", en: "roof", x: 196, y: TRAUFE, kunst: flaeche(-14, -(TRAUFE - FIRST), 28, TRAUFE - FIRST, 0.6),
        tipp: "Das Dach hat 230.000 bunte, glasierte Ziegel im Zickzack-Muster." },
      { id: "doppeladler", de: "der Doppeladler", syl: "DOP-pel-ad-ler", it: "l'aquila bicipite", itSyl: "A-qui-la bi-CI-pi-te", en: "double-headed eagle", x: AX, y: r(AY + 9.4), kunst: flaeche(-13.6, -24.8, 27.2, 24.8, 0.6),
        tipp: "Der Doppeladler war das Wappen der Habsburger, der Kaiserfamilie." },
    ] });
}

/* =====================================================================
   6 — DAS RIESENRAD im Prater (Nordosten) — Lupe: Waggon
   ===================================================================== */
{
  const CX = 349, CY = 96, R = 26.4, s = 0.85;
  let k = "";
  /* Bäume des Praters am Fuß */
  for (let i = 0; i < 26; i++) { const x = 300 + rnd() * 100, yy = 142 + rnd() * 9; k += `<circle cx="${r(x)}" cy="${r(yy)}" r="${r(3 + rnd() * 3)}" fill="${rnd() < 0.5 ? "#6f8f55" : "#5a7a48"}"/>`; }
  /* hintere Stütze (heller), dann das Rad, dann die vordere Stütze */
  const ST = "#4a3f3a";
  k += `<path d="M${CX} ${CY} L${CX - 21} 150 M${CX} ${CY} L${CX + 21} 150" stroke="#8a7f78" stroke-width="1.2"/>`;
  /* Felge: zwei Ringe mit Fachwerk */
  k += `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${ST}" stroke-width=".9"/><circle cx="${CX}" cy="${CY}" r="${R - 2.4}" fill="none" stroke="${ST}" stroke-width=".6"/>`;
  let fach = "";
  for (let i = 0; i < 60; i++) {
    const a = i / 60 * Math.PI * 2, b = (i + 0.5) / 60 * Math.PI * 2;
    fach += `M${r(CX + Math.cos(a) * R)} ${r(CY + Math.sin(a) * R)} L${r(CX + Math.cos(b) * (R - 2.4))} ${r(CY + Math.sin(b) * (R - 2.4))} `;
  }
  k += `<path d="${fach}" stroke="${ST}" stroke-width=".25" fill="none"/>`;
  /* Speichen: Seile paarweise, tangential an der Nabe */
  let sp = "";
  for (let i = 0; i < 30; i++) {
    const a = i / 30 * Math.PI * 2, t = (i % 2 ? 1 : -1) * 0.12;
    sp += `M${r(CX + Math.cos(a + t + Math.PI / 2) * 2)} ${r(CY + Math.sin(a + t + Math.PI / 2) * 2)} L${r(CX + Math.cos(a) * (R - 2.4))} ${r(CY + Math.sin(a) * (R - 2.4))} `;
  }
  k += `<path d="${sp}" stroke="${ST}" stroke-width=".18" fill="none" opacity=".85"/>`;
  k += `<circle cx="${CX}" cy="${CY}" r="2.4" fill="${ST}"/><circle cx="${CX}" cy="${CY}" r="1" fill="#8a7f78"/>`;
  /* 15 rote Waggons, hängen außen an der Felge */
  const wag = [];
  for (let i = 0; i < 15; i++) {
    const a = -Math.PI / 2 + i / 15 * Math.PI * 2, ax = CX + Math.cos(a) * R, ay = CY + Math.sin(a) * R;
    k += `<line x1="${r(ax)}" y1="${r(ay)}" x2="${r(ax)}" y2="${r(ay + 1)}" stroke="${ST}" stroke-width=".3"/>`;
    k += `<rect x="${r(ax - 2.6)}" y="${r(ay + 1)}" width="5.2" height="2.6" rx=".3" fill="${S.lg("waggon", [[0, "#c8352e"], [1, "#8e1f1c"]])}"/>`;
    k += `<path d="M${r(ax - 2.9)} ${r(ay + 1.1)} L${r(ax - 2.4)} ${r(ay + 0.5)} L${r(ax + 2.4)} ${r(ay + 0.5)} L${r(ax + 2.9)} ${r(ay + 1.1)} Z" fill="#efe9dd"/>`;
    k += `<rect x="${r(ax - 2.1)}" y="${r(ay + 1.5)}" width="4.2" height="1" fill="#f3efe4"/><path d="M${r(ax - 0.7)} ${r(ay + 1.5)} v1 M${r(ax + 0.7)} ${r(ay + 1.5)} v1" stroke="#8e1f1c" stroke-width=".25"/>`;
    wag.push([ax, ay]);
  }
  /* vordere Stütze: Fachwerkbeine von der Nabe zum Boden */
  for (const sx of [-1, 1]) {
    k += `<path d="M${CX} ${CY} L${CX + sx * 24} 151" stroke="${ST}" stroke-width="1.4"/><path d="M${CX + sx * 1.4} ${CY + 2} L${CX + sx * 18} 151" stroke="${ST}" stroke-width=".6"/>`;
    let z = "";
    for (let t = 0.12; t < 1; t += 0.11) z += `M${r(CX + sx * 24 * t)} ${r(CY + 55 * t)} L${r(CX + sx * (1.4 + 16.6 * (t + 0.055)))} ${r(CY + 2 + 53 * (t + 0.055))} `;
    k += `<path d="${z}" stroke="${ST}" stroke-width=".3" fill="none"/>`;
  }
  const [wx, wy] = wag[3];
  S.teil({ id: "riesenrad", de: "das Riesenrad", syl: "RIE-sen-rad", it: "la ruota panoramica", itSyl: "RUO-ta pa-no-RA-mi-ca", en: "Ferris wheel", x: 0, y: 0, kunst: k,
    tipp: "Das Riesenrad im Prater dreht sich seit 1897. Es ist fast 65 Meter hoch.",
    zoom: { x: 318, y: 66, w: 64, h: 44 },
    unter: [
      { id: "waggon", de: "der Waggon", syl: "wag-GON", it: "la cabina", itSyl: "ca-BI-na", en: "cabin", x: r(wx), y: r(wy + 3.6), kunst: flaeche(-3.2, -3.4, 6.4, 3.6, 0.4),
        tipp: "In einem Waggon haben bis zu 15 Menschen Platz." },
    ] });
}

/* =====================================================================
   7 — DIE STRASSE (Ringstraße): Gehsteig mit Hecke, Asphalt, Schienen
   ===================================================================== */
{
  let k = `<rect x="0" y="143.4" width="400" height="8" fill="${S.lg("hecke", [[0, "#6d8f56"], [1, "#4e6e40"]])}"/>`;
  for (let i = 0; i < 70; i++) k += `<circle cx="${r(rnd() * 400)}" cy="${r(144 + rnd() * 3)}" r="${r(1 + rnd())}" fill="${rnd() < 0.5 ? "#7da062" : "#5d7f4a"}"/>`;
  for (let x = 4; x < 400; x += 9) k += `<rect x="${x}" y="147" width=".5" height="4.4" fill="#2f3532"/>`;
  k += `<rect x="0" y="148.4" width="400" height=".5" fill="#2f3532"/>`;
  k += `<rect x="0" y="151.2" width="400" height="1.8" fill="#bdb6aa"/>`;
  k += `<rect x="0" y="153" width="400" height="${r(198 - 153)}" fill="${S.lg("asphalt", [[0, "#8e8c88"], [1, "#6f6d69"]])}"/>`;
  /* Gleiskörper der Straßenbahn: Granitpflaster zwischen den Schienen */
  const ga = strasse(24), gb = strasse(15.6);
  k += `<rect x="0" y="${ga}" width="400" height="${r(gb - ga)}" fill="${S.lg("pflaster", [[0, "#9a958d"], [1, "#86817a"]])}"/>`;
  for (let yy = ga + 0.8, j = 0; yy < gb; yy += 0.6 + (yy - ga) * 0.09, j++) for (let x = (j % 2) * 1.4; x < 400; x += 2.8 + (yy - ga) * 0.25) k += `<rect x="${r(x)}" y="${r(yy)}" width="${r(2.2 + (yy - ga) * 0.2)}" height="${r(0.35 + (yy - ga) * 0.06)}" rx=".2" fill="#a8a39a" opacity=".55"/>`;
  k += `<rect x="0" y="${r(gb)}" width="400" height=".5" fill="#c9c4bb"/>`;
  /* Schienen: ferne Spur (22 m) und nahe Spur (17 m) */
  for (const d of [22.6, 21.4, 17.8, 16.6]) k += `<rect x="0" y="${r(strasse(d) - 0.2)}" width="400" height="${r(0.25 + 4 / d)}" fill="#c9c6bf"/><rect x="0" y="${r(strasse(d) + 0.1)}" width="400" height=".3" fill="#4b4945"/>`;
  /* Mittellinie und Asphaltflecken */
  for (let x = 6; x < 400; x += 22) k += `<rect x="${x}" y="${strasse(10.5)}" width="11" height=".7" fill="#ecebe6" opacity=".85"/>`;
  for (let i = 0; i < 50; i++) k += `<rect x="${r(rnd() * 396)}" y="${r(154 + rnd() * 42)}" width="${r(1 + rnd() * 3)}" height=".35" fill="#5f5d59" opacity=".45"/>`;
  S.teil({ id: "strasse", de: "die Straße", syl: "STRA-ße", it: "la strada", itSyl: "STRA-da", en: "street", x: 0, y: 0, kunst: k,
    tipp: "Das ist die Ringstraße. Sie führt rund um die Altstadt – an Oper, Parlament und Rathaus vorbei." });
}

/* =====================================================================
   8 — DIE STRASSENBAHN (Linie D, rot-weiß) auf der fernen Spur, fährt nach links
   ===================================================================== */
{
  const d = 22, s = F / d, Y = strasse(d), X0 = 258;
  const m = (v) => r(v * s);
  let k = `<ellipse cx="${(400 - X0) / 2}" cy=".4" rx="${(400 - X0) / 2}" ry="1.2" fill="#1b1a18" opacity=".3"/>`;
  const L = 400 - X0;
  /* Wagenkasten: rot unten, Fensterband, weißer Streifen, graues Dach */
  k += `<path d="M${m(0.5)} ${m(-0.25)} L${m(0.15)} ${m(-1.1)} Q${m(0.05)} ${m(-2.6)} ${m(0.9)} ${m(-3.1)} L${L} ${m(-3.1)} L${L} ${m(-0.25)} Z" fill="${S.lg("bim", [[0, "#d8312b"], [1, "#a51f1c"]])}"/>`;
  k += `<path d="M${m(0.4)} ${m(-1.95)} Q${m(0.32)} ${m(-2.7)} ${m(0.95)} ${m(-2.95)} L${L} ${m(-2.95)} L${L} ${m(-1.6)} L${m(0.9)} ${m(-1.6)} Z" fill="#2e3a40"/>`;
  k += `<rect x="${m(0.9)}" y="${m(-1.6)}" width="${L - m(0.9)}" height="${m(0.14)}" fill="#f2efe8"/>`;
  k += `<path d="M${m(0.9)} ${m(-3.1)} Q${m(0.6)} ${m(-3.3)} ${m(1.4)} ${m(-3.4)} L${L} ${m(-3.4)} L${L} ${m(-3.1)} Z" fill="#cfd2d2"/>`;
  /* Fenstersprossen und Türen */
  for (let x = m(2.4); x < L; x += m(1.6)) k += `<rect x="${r(x)}" y="${m(-2.95)}" width="${m(0.12)}" height="${m(1.35)}" fill="#a51f1c"/>`;
  for (const x of [m(3.4), m(11.2)]) if (x < L - 4) k += `<rect x="${r(x)}" y="${m(-2.9)}" width="${m(1.3)}" height="${m(2.6)}" fill="#3a464c" stroke="#e9e6df" stroke-width=".35"/><line x1="${r(x + m(0.65))}" y1="${m(-2.9)}" x2="${r(x + m(0.65))}" y2="${m(-0.3)}" stroke="#e9e6df" stroke-width=".3"/>`;
  /* Front: Scheibe, Zielanzeige „D Nußdorf“, Scheinwerfer */
  k += `<rect x="${m(0.35)}" y="${m(-3.08)}" width="${m(2.3)}" height="${m(0.36)}" fill="#151515"/>`;
  k += `<text x="${m(0.45)}" y="${m(-2.79)}" font-size="${m(0.28)}" fill="#ffb428" font-family="Arial,sans-serif" font-weight="bold">D  Nußdorf</text>`;
  k += `<path d="M${m(0.5)} ${m(-0.25)} L${m(0.3)} ${m(-0.7)} L${m(1.6)} ${m(-0.7)} L${m(1.6)} ${m(-0.25)} Z" fill="#7a1512"/>`;
  k += `<circle cx="${m(0.4)}" cy="${m(-0.95)}" r="${m(0.1)}" fill="#fffbe8"/><rect x="${m(0.28)}" y="${m(-1.25)}" width="${m(0.16)}" height="${m(0.08)}" fill="#ffd27a"/>`;
  k += `<path d="M${m(0.42)} ${m(-1.95)} L${m(0.62)} ${m(-2.7)} L${m(0.9)} ${m(-2.7)} L${m(0.7)} ${m(-1.95)} Z" fill="#fff" opacity=".18"/>`;
  k += `<path d="M${m(0.5)} ${m(-2.7)} Q${m(0.45)} ${m(-2.2)} ${m(0.6)} ${m(-1.95)}" stroke="#fff" stroke-width=".5" opacity=".35" fill="none"/>`;
  /* Stromabnehmer und Fahrleitung */
  k += `<rect x="${m(3.6)}" y="${m(-3.6)}" width="${m(1.2)}" height="${m(0.2)}" fill="#8d9296"/><path d="M${m(3.8)} ${m(-3.6)} L${m(5.0)} ${m(-4.35)} L${m(4.3)} ${m(-5.06)}" stroke="#3a3a3a" stroke-width=".5" fill="none" stroke-linejoin="round"/><rect x="${m(3.8)}" y="${m(-5.16)}" width="${m(1)}" height="${m(0.08)}" fill="#3a3a3a"/>`;
  k += `<line x1="${m(-0.6)}" y1="${m(-5.12)}" x2="${L}" y2="${m(-5.12)}" stroke="#2b2b2b" stroke-width=".25" opacity=".7"/>`;
  S.teil({ id: "strassenbahn", de: "die Straßenbahn", syl: "STRA-ßen-bahn", it: "il tram", itSyl: "TRAM", en: "tram", x: X0, y: Y, kunst: k,
    tipp: "Die Wiener sagen zur Straßenbahn „Bim“ – wegen der Klingel." });
}

/* =====================================================================
   9 — DER FIAKER (zwei Pferde, schwarze Kutsche) in 12 m, fährt nach links
       Lupe: Pferd, Kutscher, Melone
   ===================================================================== */
{
  const d = 12, s = F / d, Y = strasse(d), X0 = 214;   /* X0: Mitte zwischen Pferden und Kutsche */
  const m = (v) => r(v * s);
  const P = (x, y) => `${m(x)} ${m(y)}`;
  let k = schatten(m(-0.3), 0.3, m(3.4), m(0.18), 0.35);
  /* ein Pferd im Profil nach links: Fuß bei (bx, 0) */
  const pferd = (bx, dy, fell, dunkel, maehne) => {
    const q = (x, y) => P(bx + x, y + dy);
    let g = "";
    /* Beine: vorn eines gehoben (Schritt), hinten mit Sprunggelenk */
    g += `<path d="M${q(-0.62, -1.05)} L${q(-0.66, -0.12)} L${q(-0.56, -0.12)} L${q(-0.52, -1.05)} Z" fill="${dunkel}"/>`;
    g += `<path d="M${q(-0.42, -1.05)} Q${q(-0.5, -0.6)} ${q(-0.62, -0.46)} L${q(-0.7, -0.3)} L${q(-0.6, -0.26)} L${q(-0.5, -0.44)} Q${q(-0.38, -0.6)} ${q(-0.32, -1.05)} Z" fill="${fell}"/>`;
    g += `<path d="M${q(0.5, -1.1)} Q${q(0.66, -0.6)} ${q(0.58, -0.48)} L${q(0.56, -0.12)} L${q(0.66, -0.12)} L${q(0.7, -0.5)} Q${q(0.78, -0.7)} ${q(0.68, -1.1)} Z" fill="${dunkel}"/>`;
    g += `<path d="M${q(0.7, -1.15)} Q${q(0.92, -0.62)} ${q(0.8, -0.5)} L${q(0.78, -0.12)} L${q(0.9, -0.12)} L${q(0.92, -0.52)} Q${q(1.02, -0.72)} ${q(0.9, -1.2)} Z" fill="${fell}"/>`;
    for (const [x, c] of [[-0.61, "#1d1a18"], [0.61, "#1d1a18"], [0.84, "#1d1a18"]]) g += `<rect x="${m(bx + x - 0.06)}" y="${m(dy - 0.12)}" width="${m(0.13)}" height="${m(0.1)}" fill="${c}"/>`;
    g += `<path d="M${q(-0.7, -0.32)} l${m(-0.05)} ${m(0.08)} l${m(0.11)} ${m(0.04)} Z" fill="#1d1a18"/>`;
    /* Rumpf, Brust, Kruppe */
    g += `<path d="M${q(-0.78, -1.32)} Q${q(-0.82, -1.66)} ${q(-0.48, -1.62)} Q${q(0.2, -1.52)} ${q(0.66, -1.6)} Q${q(1.04, -1.58)} ${q(1.02, -1.26)} Q${q(1, -1.02)} ${q(0.72, -1.02)} Q${q(0.1, -0.98)} ${q(-0.5, -1.02)} Q${q(-0.76, -1.06)} ${q(-0.78, -1.32)} Z" fill="${fell}"/>`;
    /* Hals und Kopf */
    g += `<path d="M${q(-0.46, -1.6)} Q${q(-0.86, -2.02)} ${q(-1.06, -2.24)} L${q(-1.24, -2.06)} Q${q(-1, -1.62)} ${q(-0.86, -1.22)} Z" fill="${fell}"/>`;
    g += `<path d="M${q(-1.02, -2.28)} Q${q(-1.2, -2.32)} ${q(-1.3, -2.18)} L${q(-1.58, -1.86)} Q${q(-1.64, -1.74)} ${q(-1.54, -1.7)} L${q(-1.42, -1.72)} Q${q(-1.3, -1.92)} ${q(-1.18, -2)} Z" fill="${fell}"/>`;
    g += `<path d="M${q(-1.06, -2.28)} l${m(0.02)} ${m(-0.16)} l${m(0.08)} ${m(0.14)} Z" fill="${dunkel}"/>`;
    g += `<path d="M${q(-0.44, -1.62)} Q${q(-0.82, -2.06)} ${q(-1.04, -2.3)} Q${q(-0.78, -2.12)} ${q(-0.38, -1.7)} Z" fill="${maehne}"/>`;
    g += `<path d="M${q(1, -1.46)} Q${q(1.18, -1.1)} ${q(1.06, -0.62)} Q${q(0.98, -0.98)} ${q(0.94, -1.36)} Z" fill="${maehne}"/>`;
    g += `<circle cx="${m(bx - 1.3)}" cy="${m(dy - 2.08)}" r="${m(0.03)}" fill="#111"/>`;
    /* Geschirr: Kummet, Rückengurt, Scheuklappe, Zaum */
    g += `<path d="M${q(-0.62, -1.66)} Q${q(-0.86, -1.5)} ${q(-0.82, -1.18)}" stroke="#151313" stroke-width="${m(0.12)}" fill="none"/>`;
    g += `<path d="M${q(-0.1, -1.6)} L${q(-0.1, -1.0)}" stroke="#151313" stroke-width="${m(0.1)}"/><path d="M${q(-0.82, -1.3)} L${q(0.9, -1.3)}" stroke="#151313" stroke-width="${m(0.05)}"/>`;
    g += `<path d="M${q(-1.22, -2.12)} l${m(-0.14)} ${m(0.08)}" stroke="#151313" stroke-width="${m(0.07)}"/><path d="M${q(-1.2, -2.02)} L${q(-1.5, -1.76)}" stroke="#151313" stroke-width="${m(0.03)}"/>`;
    g += `<circle cx="${m(bx - 0.1)}" cy="${m(dy - 1.6)}" r="${m(0.05)}" fill="${GOLD}"/>`;
    return g;
  };
  const PB = -2.1;   /* Pferde-Mitte */
  k += pferd(PB - 0.18, -0.06, "#6b4228", "#4a2c1a", "#2a1a10");          /* fernes Pferd (braun) */
  k += pferd(PB, 0, S.lg("schimmel", [[0, "#f2f0ea"], [1, "#c9c6be"]]), "#b8b4aa", "#e9e6de");  /* nahes Pferd (Schimmel) */
  /* Deichsel und Zugstränge */
  k += `<path d="M${P(-0.4, -0.95)} L${P(PB - 0.7, -1.25)}" stroke="#1b1b1b" stroke-width="${m(0.06)}"/>`;
  /* die Kutsche: Räder mit roten Speichen, schwarzer Kasten, Verdeck, Bock */
  const rad = (cx, cy, rr) => {
    let g = `<circle cx="${m(cx)}" cy="${m(cy)}" r="${m(rr)}" fill="none" stroke="#151515" stroke-width="${m(0.07)}"/>`;
    let sp = "";
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; sp += `M${m(cx)} ${m(cy)} L${r(m(cx) + Math.cos(a) * m(rr))} ${r(m(cy) + Math.sin(a) * m(rr))} `; }
    g += `<path d="${sp}" stroke="#a3262a" stroke-width="${m(0.035)}"/><circle cx="${m(cx)}" cy="${m(cy)}" r="${m(0.08)}" fill="#151515"/>`;
    return g;
  };
  k += rad(0.35, -0.45, 0.45) + rad(2.35, -0.6, 0.6);
  k += `<path d="M${P(-0.1, -0.9)} Q${P(0.6, -0.72)} ${P(1.1, -0.86)} L${P(2.9, -0.86)} Q${P(3.05, -1.3)} ${P(2.8, -1.42)} L${P(1.1, -1.42)} Q${P(0.7, -1.2)} ${P(0.5, -1.0)} L${P(-0.1, -1.0)} Z" fill="${S.lg("lack", [[0, "#3c3c42"], [0.4, "#141416"], [1, "#050506"]])}"/>`;
  k += `<path d="M${P(1.2, -1.42)} L${P(2.5, -1.42)} L${P(2.5, -1.62)} Q${P(1.8, -1.7)} ${P(1.2, -1.58)} Z" fill="#7a1a26"/>`;
  k += `<path d="M${P(2.3, -1.42)} Q${P(2.4, -2.1)} ${P(3.0, -2.06)} Q${P(3.2, -1.7)} ${P(3.02, -1.42)} Z" fill="#1b1b1d"/><path d="M${P(2.45, -1.6)} Q${P(2.6, -1.98)} ${P(2.95, -1.98)} M${P(2.55, -1.5)} Q${P(2.7, -1.86)} ${P(3.02, -1.84)}" stroke="#3c3c42" stroke-width=".3" fill="none"/>`;
  k += `<path d="M${P(0.0, -1.0)} L${P(0.15, -1.55)} L${P(0.75, -1.55)} L${P(0.6, -1.0)}" fill="none" stroke="#141416" stroke-width="${m(0.06)}"/><rect x="${m(0.12)}" y="${m(-1.66)}" width="${m(0.66)}" height="${m(0.12)}" rx=".4" fill="#7a1a26"/>`;
  k += `<path d="M${P(-0.12, -1.0)} L${P(-0.2, -1.3)}" stroke="#141416" stroke-width="${m(0.05)}"/>`;
  k += `<rect x="${m(0.9)}" y="${m(-1.62)}" width="${m(0.1)}" height="${m(0.2)}" fill="${GOLD}"/><circle cx="${m(0.95)}" cy="${m(-1.66)}" r="${m(0.05)}" fill="#fff6c8"/>`;
  k += `<path d="M${P(1.2, -1.36)} L${P(2.8, -1.36)}" stroke="#d9a92e" stroke-width=".25"/>`;
  /* Peitsche im Halter */
  k += `<path d="M${P(0.72, -1.55)} L${P(0.9, -2.7)} Q${P(1.2, -2.9)} ${P(1.5, -2.6)}" stroke="#2a2a2a" stroke-width=".3" fill="none"/>`;
  /* der Kutscher auf dem Bock, Zügel zu den Pferdeköpfen */
  const M0 = globalThis.DMA_MENSCH || (B.mensch({ geschlecht: "m" }, 1), globalThis.DMA_MENSCH);
  const pose = Object.assign({}, M0.POSEN.sitzen, { schulterL: { vor: 40, seit: 10, dreh: -10 }, ellbogenL: 60, unterarmL: 30, handL: 0, fingerL: 0.75,
    schulterR: { vor: 35, seit: 14, dreh: -10 }, ellbogenR: 70, unterarmR: 30, handR: 0, fingerR: 0.75 });
  const kut = B.mensch({ id: "wie_kut", geschlecht: "m", pose, blick: -80, frisur: "kurz", haarfarbe: "grau", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "jacke", farbe: "#26262c" }, unterteil: { stueck: "anzughose" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, kopf: { stueck: "hut", farbe: "#1c1c20" } } }, m(1.76));
  const sitz = { x: m(0.45), y: m(-1.66) };
  const kx = r(sitz.x - kut.z.sitz.x * kut.k), ky = r(sitz.y - kut.z.sitz.y * kut.k);
  /* Melone: runder Kopf statt Krempenhut (Hutband in Schwarz) */
  k += `<g transform="translate(${kx} ${ky})">${kut.svg.replace(/stroke="#2a211c"/g, `stroke="#111"`)}</g>`;
  const hand = { x: kx + kut.z.handL.x * kut.k, y: ky + kut.z.handL.y * kut.k };
  k += `<path d="M${r(hand.x)} ${r(hand.y)} Q${m(-1)} ${m(-1.9)} ${m(PB - 1.42)} ${m(-1.84)} M${r(hand.x)} ${r(hand.y + 0.3)} Q${m(-1)} ${m(-1.8)} ${m(PB - 1.6)} ${m(-1.8)}" stroke="#2b1d12" stroke-width=".22" fill="none"/>`;
  const kopf = { x: kx + kut.z.kopf.x * kut.k, y: ky + kut.z.kopf.y * kut.k };
  S.teil({ id: "fiaker", de: "der Fiaker", syl: "fi-A-ker", it: "la carrozza", itSyl: "car-ROZ-za", en: "horse-drawn carriage", x: X0, y: Y, kunst: k,
    tipp: "Ein Fiaker ist eine Kutsche mit zwei Pferden. Er fährt Gäste durch die Altstadt.",
    zoom: { x: X0 - 50, y: Y - 44, w: 94, h: 48 },
    unter: [
      { id: "pferd", de: "das Pferd", syl: "PFERD", it: "il cavallo", itSyl: "ca-VAL-lo", en: "horse", x: X0 + m(PB), y: Y - m(1.0), kunst: flaeche(-m(1.7), -m(1.4), m(2.8), m(1.3), 0.6),
        tipp: "Fiaker-Pferde arbeiten nur an bestimmten Tagen und machen oft Pause." },
      { id: "kutscher", de: "der Kutscher", syl: "KUT-scher", it: "il cocchiere", itSyl: "coc-CHIE-re", en: "coachman", x: r(X0 + sitz.x), y: r(Y + sitz.y), kunst: flaeche(-m(0.5), -m(0.75), m(1), m(0.85), 0.6),
        tipp: "Der Kutscher erzählt den Gästen viel über Wien." },
      { id: "melone", de: "die Melone", syl: "me-LO-ne", it: "la bombetta", itSyl: "bom-BET-ta", en: "bowler hat", x: r(X0 + kopf.x), y: r(Y + kopf.y - 1.4), kunst: flaeche(-2.4, -2, 4.8, 2.6, 0.4),
        tipp: "Im Dienst trägt der Fiaker-Kutscher eine Melone – einen runden, schwarzen Hut." },
    ] });
}

/* =====================================================================
   10 — DER SCHANIGARTEN (Holzpodest vor dem Kaffeehaus)
   11 — DER BLUMENKASTEN   12 — DIE SPEISEKARTE (Kreidetafel)
   ===================================================================== */
const PODEST = 195.6;
{
  let k = `<rect x="0" y="${PODEST}" width="400" height="${r(260 - PODEST)}" fill="${S.lg("podest", [[0, "#a77a4c"], [1, "#7d5634"]])}"/>`;
  for (let i = -14; i <= 14; i++) {
    const xa = 200 + i * 14.4, xb = 200 + i * 28, xe = Math.max(0, Math.min(400, xb)), ye = i === 0 ? 260 : r(PODEST + (260 - PODEST) * (xe - xa) / (xb - xa));
    if (xa > 0 && xa < 400) k += `<line x1="${r(xa)}" y1="${PODEST}" x2="${r(xe)}" y2="${ye}" stroke="#5f3f22" stroke-width=".4" opacity=".7"/>`;
  }
  for (const y of [199.4, 205, 213.6, 227, 248]) k += `<line x1="0" y1="${y}" x2="400" y2="${y}" stroke="#6a4728" stroke-width=".25" opacity=".5"/>`;
  k += `<rect x="0" y="${PODEST - 0.6}" width="400" height="1.6" fill="#c49a68"/>`;
  k += `<path d="M0 238 Q100 233 200 236 Q300 239 400 234 L400 260 L0 260 Z" fill="#2a1a0c" opacity=".22"/>`;
  k += `<rect x="0" y="${PODEST}" width="400" height="${r(260 - PODEST)}" fill="${S.lg("podestlicht", [[0, "#000", 0.12], [0.3, "#000", 0], [1, "#fff2d0", 0.08]])}"/>`;
  S.teil({ id: "schanigarten", de: "der Schanigarten", syl: "SCHA-ni-gar-ten", it: "il dehors", itSyl: "de-HORS", en: "pavement café", x: 0, y: 0, kunst: k,
    tipp: "In Wien heißen die Tische vor dem Kaffeehaus „Schanigarten“." });
}
{
  /* Blumenkasten mit roten Geranien an der Kante des Podests (3,6 m vor uns) */
  const s = F / 3.6, x0 = 64, x1 = 174, top = r(PODEST - 0.42 * s);
  let k = schatten((x0 + x1) / 2, PODEST + 0.6, (x1 - x0) / 2 + 2, 1.2, 0.3);
  k += `<path d="M${x0} ${PODEST} L${x0 + 1} ${top} L${x1 - 1} ${top} L${x1} ${PODEST} Z" fill="${S.lg("kasten", [[0, "#3f5a3a"], [1, "#2c4128"]])}"/>`;
  for (let x = x0 + 4; x < x1 - 2; x += 6) k += `<line x1="${x}" y1="${top + 1}" x2="${x}" y2="${PODEST - 0.6}" stroke="#233620" stroke-width=".4"/>`;
  k += `<rect x="${x0 + 0.6}" y="${top - 0.6}" width="${x1 - x0 - 1.2}" height="1.4" fill="#4d6b47"/>`;
  let laub = "";
  for (let i = 0; i < 120; i++) {
    const x = x0 + 2 + rnd() * (x1 - x0 - 4), y = top - rnd() * 7;
    laub += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(1.1 + rnd() * 1.1)}" fill="${["#2f6a2c", "#3f7a34", "#4f8a3e", "#5a9444"][Math.floor(rnd() * 4)]}"/>`;
  }
  k += laub;
  for (let i = 0; i < 30; i++) {
    const x = x0 + 4 + rnd() * (x1 - x0 - 8), y = top - 5 - rnd() * 6;
    k += `<line x1="${r(x)}" y1="${r(y + 1)}" x2="${r(x + rnd() - 0.5)}" y2="${r(y + 4)}" stroke="#3f6a2c" stroke-width=".3"/>`;
    for (let j = 0; j < 7; j++) k += `<circle cx="${r(x + Math.cos(j * 0.9) * (0.4 + (j % 3) * 0.35))}" cy="${r(y + Math.sin(j * 0.9) * (0.3 + (j % 3) * 0.25))}" r=".55" fill="${j % 3 ? "#d8323a" : "#f0646c"}"/>`;
  }
  S.teil({ id: "blumenkasten", de: "der Blumenkasten", syl: "BLU-men-kas-ten", it: "la fioriera", itSyl: "fio-RIE-ra", en: "flower box", x: 0, y: 0, kunst: k });
}
{
  /* Kreidetafel (Kundenstopper) mit dem Angebot */
  const s = F / 3, X = 34, Y = r(HOR + 1.25 * s);
  let k = schatten(0, 0.5, 18, 1.4, 0.3);
  k += `<path d="M-15 0 L-12 -50 L12 -50 L15 0" stroke="#5a3a20" stroke-width="2.4" fill="none"/>`;
  k += `<rect x="-12" y="-49" width="24" height="40" rx="1" fill="${S.lg("tafel", [[0, "#2e3833"], [1, "#212925"]])}" stroke="#6b4626" stroke-width="1.4"/>`;
  const t = (y, sz, txt, f = "#f4f0e6", w = "normal") => `<text x="0" y="${y}" font-size="${sz}" text-anchor="middle" fill="${f}" font-family="'Comic Sans MS','Segoe Print',cursive" font-weight="${w}">${txt}</text>`;
  k += t(-43, 3.4, "Café Ringstraße", "#f6e7a1", "bold");
  k += `<line x1="-9" y1="-41" x2="9" y2="-41" stroke="#f6e7a1" stroke-width=".3" stroke-dasharray="1 .8"/>`;
  k += t(-36, 2.6, "Melange … 4,90") + t(-31.4, 2.6, "Einspänner … 5,20") + t(-26.8, 2.6, "Sachertorte … 6,50") + t(-22.2, 2.6, "Apfelstrudel … 6,20") + t(-17.6, 2.6, "Wiener Schnitzel … 19,80");
  k += t(-12, 2.4, "Herzlich willkommen!", "#ffc9b8");
  S.teil({ id: "speisekarte", de: "die Speisekarte", syl: "SPEI-se-kar-te", it: "il menù", itSyl: "me-NÙ", en: "menu", x: X, y: Y, steht: true, kunst: k,
    tipp: "Auf der Tafel steht, was es heute im Kaffeehaus gibt." });
}

/* =====================================================================
   13 — DER TISCH (Marmor, gusseiserner Fuß) und was darauf steht:
        14 Tablett, 15 Melange, 16 Glas Wasser, 17 Sachertorte,
        18 Schlagobers, 19 Wiener Schnitzel, 20 Zitrone, 21 Zeitung
   ===================================================================== */
/* =====================================================================
   12b — DER STUHL: Wiener Kaffeehausstuhl aus Bugholz (Thonet Nr. 14)
   ===================================================================== */
{
  const sc = F / 1.75, X = 262, Y = r(HOR + 1.25 * sc);
  const m = (v) => r(v * sc);
  const HOLZ = S.lg("bugholz", [[0, "#6b4228"], [0.5, "#4a2c18"], [1, "#2f1b0e"]], 0, 0, 1, 0);
  let k = schatten(0, 0, m(0.26), m(0.05), 0.3);
  /* Hinterbeine, die oben zur Lehne werden; äußerer Bogen und innere Schlaufe */
  k += `<path d="M${m(-0.15)} ${m(-0.05)} L${m(-0.17)} ${m(-0.48)} Q${m(-0.2)} ${m(-0.86)} 0 ${m(-0.9)} Q${m(0.2)} ${m(-0.86)} ${m(0.17)} ${m(-0.48)} L${m(0.15)} ${m(-0.05)}" stroke="${HOLZ}" stroke-width="${m(0.026)}" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${m(-0.1)} ${m(-0.5)} Q${m(-0.13)} ${m(-0.76)} 0 ${m(-0.79)} Q${m(0.13)} ${m(-0.76)} ${m(0.1)} ${m(-0.5)}" stroke="${HOLZ}" stroke-width="${m(0.018)}" fill="none"/>`;
  k += `<path d="M${m(-0.18)} ${m(-0.62)} L${m(0.18)} ${m(-0.62)}" stroke="${HOLZ}" stroke-width="${m(0.014)}"/>`;
  /* Fußring und Vorderbeine */
  k += `<ellipse cx="0" cy="${m(-0.18)}" rx="${m(0.17)}" ry="${m(0.05)}" fill="none" stroke="${HOLZ}" stroke-width="${m(0.014)}"/>`;
  for (const sx of [-1, 1]) k += `<path d="M${m(sx * 0.17)} ${m(-0.43)} L${m(sx * 0.2)} ${m(0.03)}" stroke="${HOLZ}" stroke-width="${m(0.024)}" stroke-linecap="round"/>`;
  /* Sitz: Holzreif mit Wiener Geflecht */
  k += `<ellipse cx="0" cy="${m(-0.46)}" rx="${m(0.22)}" ry="${m(0.085)}" fill="${HOLZ}"/>`;
  k += `<ellipse cx="0" cy="${m(-0.465)}" rx="${m(0.19)}" ry="${m(0.068)}" fill="#d9b97e"/>`;
  let g = "";
  for (let i = -6; i <= 6; i++) g += `M${m(i * 0.03 - 0.06)} ${m(-0.525)} L${m(i * 0.03 + 0.06)} ${m(-0.405)} M${m(i * 0.03 + 0.06)} ${m(-0.525)} L${m(i * 0.03 - 0.06)} ${m(-0.405)} `;
  S.def(`<clipPath id="${S.id("geflecht")}"><ellipse cx="0" cy="${m(-0.465)}" rx="${m(0.19)}" ry="${m(0.068)}"/></clipPath>`);
  k += `<path d="${g}" stroke="#a8803f" stroke-width=".35" clip-path="url(#${S.id("geflecht")})"/>`;
  k += `<path d="M${m(-0.14)} ${m(-0.5)} Q0 ${m(-0.53)} ${m(0.12)} ${m(-0.5)}" stroke="#fff3d8" stroke-width=".6" opacity=".5" fill="none"/>`;
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: X, y: Y, steht: true, kunst: k,
    tipp: "Der Wiener Kaffeehausstuhl aus gebogenem Holz ist auf der ganzen Welt bekannt." });
}

const TISCH = { x: 336, y: 214, rx: 52, ry: 17 };
{
  const { x, y, rx, ry } = TISCH;
  let k = `<path d="M-4 ${ry} L-3 46 L3 46 L4 ${ry} Z" fill="${S.lg("fuss", [[0, "#3a3a3c"], [0.5, "#5a5a5c"], [1, "#222224"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${-rx} 0 A${rx} ${ry} 0 0 0 ${rx} 0 L${rx} 2.2 A${rx} ${ry} 0 0 1 ${-rx} 2.2 Z" fill="${S.lg("kante", [[0, "#cfc8bc"], [1, "#8f877b"]])}"/>`;
  k += `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${S.rg("marmor", [[0, "#ffffff"], [0.6, "#f1eee8"], [1, "#d9d4cb"]], 0.4, 0.35, 0.8)}"/>`;
  S.def(`<clipPath id="${S.id("platte")}"><ellipse cx="0" cy="0" rx="${rx - 0.6}" ry="${ry - 0.4}"/></clipPath>`);
  let adern = "";
  for (let i = 0; i < 9; i++) { const a = rnd() * 6.28; adern += `<path d="M${r(Math.cos(a) * rx * 0.8)} ${r(Math.sin(a) * ry * 0.8)} q${r(8 + rnd() * 10)} ${r(-2 + rnd() * 4)} ${r(16 + rnd() * 10)} ${r(-1 + rnd() * 3)}" stroke="#b9b2a8" stroke-width=".3" fill="none" opacity=".6"/>`; }
  k += `<g clip-path="url(#${S.id("platte")})">${adern}</g>`;
  k += `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="none" stroke="#a9a196" stroke-width=".6"/>`;
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolino", itSyl: "ta-vo-LI-no", en: "table", x, y, kunst: k,
    tipp: "Kaffeehaustische haben eine runde Platte aus Marmor." });
}
{
  /* die Zeitung im Holzhalter (hinten links auf dem Tisch) */
  let k = `<path d="M-18 1 L14 -2 L16 4 L-16 7 Z" fill="#f2efe6" stroke="#c9c3b6" stroke-width=".3"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${-14 + i * 0.4} ${r(2.4 + i * 0.7)} L${r(-2 + i * 0.4)} ${r(1.3 + i * 0.7)}" stroke="#9a958c" stroke-width=".35"/>`;
  k += `<path d="M1 0 L12 -1 L13 2.4 L2 3.4 Z" fill="#b9b3a6"/>`;
  k += `<path d="M-19 1.2 L17 -2.2" stroke="#6b4626" stroke-width="1.3" stroke-linecap="round"/><circle cx="-19.4" cy="1.3" r="1" fill="#5a3a20"/>`;
  k += `<text x="-14.6" y="3.4" font-size="2.2" fill="#2a2a2a" font-family="Georgia,serif" font-weight="bold" transform="rotate(-5.4 -14.6 3.4)">Wiener Zeitung</text>`;
  S.teil({ oben: true, id: "zeitung", de: "die Zeitung", syl: "ZEI-tung", it: "il giornale", itSyl: "gior-NA-le", en: "newspaper", x: 312, y: 202, kunst: k,
    tipp: "Im Kaffeehaus liest man lange Zeitung – sie steckt in einem Halter aus Holz." });
}
{
  /* das Silbertablett */
  let k = `<ellipse cx="0" cy=".8" rx="17" ry="5.6" fill="#8d9296"/><ellipse cx="0" cy="0" rx="17" ry="5.6" fill="${S.lg("silber", [[0, "#f7f8f8"], [0.5, "#c3c9ce"], [1, "#e9ecee"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="0" rx="15" ry="4.6" fill="none" stroke="#a7aeb4" stroke-width=".4"/><path d="M-12 -2.4 Q-4 -4.4 6 -3.6" stroke="#fff" stroke-width=".7" opacity=".7" fill="none"/>`;
  S.teil({ oben: true, id: "tablett", de: "das Tablett", syl: "tab-LETT", it: "il vassoio", itSyl: "vas-SO-io", en: "tray", x: 356, y: 205, kunst: k,
    tipp: "Im Kaffeehaus kommt der Kaffee auf einem kleinen Silbertablett – immer mit einem Glas Wasser." });
}
{
  /* die Melange: Tasse auf Untertasse, Milchschaum mit Kakao, Löffel */
  let k = `<ellipse cx="0" cy="0" rx="9.4" ry="3" fill="#fbfaf6" stroke="#d6d1c6" stroke-width=".3"/>`;
  k += `<path d="M-6.4 -1 L-5.6 -9 L5.6 -9 L6.4 -1 Q0 1.6 -6.4 -1 Z" fill="${S.lg("tasse", [[0, "#ffffff"], [0.7, "#f1efea"], [1, "#cfcac0"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M6 -7.4 q3.4 .2 3 3 q-.4 2.2 -3.6 1.6" stroke="#ece9e2" stroke-width="1.1" fill="none"/>`;
  k += `<ellipse cx="0" cy="-9" rx="5.6" ry="1.8" fill="#f5ead6"/><path d="M-5 -9 Q0 -11.6 5 -9" fill="#f9f1e0"/>`;
  for (let i = 0; i < 14; i++) k += `<circle cx="${r(-3.6 + rnd() * 7.2)}" cy="${r(-9.6 + rnd() * 1.4)}" r=".22" fill="#7a4a2a"/>`;
  k += `<path d="M-8 1 L-2 -.6" stroke="#c3c9ce" stroke-width=".7" stroke-linecap="round"/><ellipse cx="-8.4" cy="1.1" rx="1" ry=".5" fill="#c3c9ce"/>`;
  S.teil({ oben: true, id: "melange", de: "die Melange", syl: "me-LAN-ge", it: "il cappuccino viennese", itSyl: "cap-puc-CI-no vien-NE-se", en: "Viennese melange", x: 351, y: 205, kunst: k,
    tipp: "Die Melange ist Kaffee mit heißer Milch und Milchschaum." });
}
{
  /* das Glas Wasser */
  let k = `<ellipse cx="0" cy="0" rx="4" ry="1.2" fill="#c6d6da" opacity=".7"/>`;
  k += `<path d="M-4.2 -16 L-3.8 0 Q0 1.2 3.8 0 L4.2 -16 Z" fill="${S.lg("wglas", [[0, "#e9f3f6", 0.55], [0.5, "#ffffff", 0.2], [1, "#cfe2e8", 0.6]], 0, 0, 1, 0)}" stroke="#b9cfd6" stroke-width=".3"/>`;
  k += `<ellipse cx="0" cy="-16" rx="4.2" ry="1.2" fill="none" stroke="#c9dbe0" stroke-width=".35"/><ellipse cx="0" cy="-11" rx="3.95" ry="1.05" fill="#dbeef3" opacity=".8"/>`;
  k += `<path d="M-2.8 -14.6 L-2.6 -1.6" stroke="#fff" stroke-width=".7" opacity=".8"/>`;
  S.teil({ oben: true, id: "glas", de: "das Glas Wasser", syl: "GLAS WAS-ser", it: "il bicchiere d'acqua", itSyl: "bic-CHIE-re DAC-qua", en: "glass of water", x: 366, y: 204, kunst: k });
}
{
  /* das Wiener Schnitzel auf dem Teller (vorn links) */
  let k = `<ellipse cx="0" cy=".6" rx="20" ry="6.4" fill="#d9d4ca"/><ellipse cx="0" cy="0" rx="20" ry="6.4" fill="#fbfaf6"/><ellipse cx="0" cy="0" rx="14.6" ry="4.4" fill="none" stroke="#e6e1d6" stroke-width=".5"/>`;
  k += `<path d="M-15 -.6 Q-14 -4.4 -6 -4.8 Q2 -5.6 8 -4 Q14.6 -3 14 .4 Q12 3 4 3.2 Q-6 3.6 -12 2.4 Q-15.6 1.4 -15 -.6 Z" fill="${S.rg("panade", [[0, "#f0c063"], [0.7, "#d99a3a"], [1, "#b8742a"]], 0.45, 0.4, 0.7)}"/>`;
  for (let i = 0; i < 40; i++) k += `<circle cx="${r(-13 + rnd() * 26)}" cy="${r(-3.8 + rnd() * 6)}" r="${r(0.25 + rnd() * 0.3)}" fill="${rnd() < 0.5 ? "#f6d58a" : "#b8742a"}" opacity=".8"/>`;
  k += `<path d="M-12 -3 Q-4 -5 6 -3.6" stroke="#fff3cf" stroke-width=".7" opacity=".5" fill="none"/>`;
  k += `<path d="M-17 2.4 q1 -2 2.6 -1.2 q1 -1.6 2.2 0 q.4 1.4 -1.2 1.8 Z" fill="#4f8a3a"/>`;
  S.teil({ oben: true, id: "schnitzel", de: "das Wiener Schnitzel", syl: "WIE-ner SCHNIT-zel", it: "la cotoletta alla viennese", itSyl: "co-to-LET-ta AL-la vien-NE-se", en: "Wiener schnitzel", x: 309, y: 221, kunst: k,
    tipp: "Das echte Wiener Schnitzel ist aus Kalbfleisch, dünn geklopft und paniert." });
}
{
  /* die Zitrone: Scheibe auf dem Schnitzel */
  let k = `<ellipse cx="0" cy="0" rx="4" ry="1.7" fill="#f2d64a"/><ellipse cx="0" cy="-.1" rx="3.3" ry="1.3" fill="#fbef9a"/>`;
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; k += `<line x1="0" y1="-.1" x2="${r(Math.cos(a) * 3.1)}" y2="${r(Math.sin(a) * 1.2 - 0.1)}" stroke="#f2d64a" stroke-width=".25"/>`; }
  S.teil({ oben: true, id: "zitrone", de: "die Zitrone", syl: "zi-TRO-ne", it: "il limone", itSyl: "li-MO-ne", en: "lemon", x: 316, y: 217.4, kunst: k });
}
{
  /* die Sachertorte: Stück auf dem Teller, Schnittfläche mit Marillenschicht */
  let k = `<ellipse cx="0" cy=".5" rx="14" ry="4.6" fill="#d9d4ca"/><ellipse cx="0" cy="0" rx="14" ry="4.6" fill="#fbfaf6"/>`;
  /* Keil: die Spitze zeigt nach links vorn; vorn die Schnittfläche (Biskuit, zwei Lagen
     Marillenmarmelade), oben die glänzende Schokoladeglasur, hinten der runde Rand */
  k += `<path d="M-9 -1 L8 .6 L8 -4.8 L-9 -6.4 Z" fill="${S.lg("biskuit", [[0, "#6a3d22"], [1, "#4a2712"]])}"/>`;
  k += `<path d="M-9 -2.8 L8 -1.2 M-9 -4.6 L8 -3" stroke="#e08a2a" stroke-width=".55"/>`;
  k += `<path d="M-9 -6.4 L8 -4.8 L8 -5.6 L-9 -7.1 Z" fill="#2a140c"/>`;
  k += `<path d="M-9 -7.1 L8 -5.6 Q10.4 -7.4 9.4 -9.4 L3 -11 Z" fill="${S.lg("glasur", [[0, "#2c150b"], [0.5, "#5a2f1e"], [1, "#2a140c"]], 0, 0, 1, 1)}"/>`;
  k += `<path d="M8 .6 L8 -5.6 Q10.4 -7.4 9.4 -9.4 L9.6 -3 Q9.4 -.6 8 .6 Z" fill="#24110a"/>`;
  k += `<path d="M-5 -7.4 L5.6 -8.6" stroke="#fff" stroke-width=".6" opacity=".35" stroke-linecap="round"/>`;
  k += `<ellipse cx="5.4" cy="-8.4" rx="1.9" ry=".8" fill="#3d1f12" stroke="#7a4a30" stroke-width=".25"/><ellipse cx="5.2" cy="-8.6" rx=".9" ry=".3" fill="#7a4a30" opacity=".6"/>`;
  k += `<path d="M-6 3.4 L4 1.6" stroke="#c3c9ce" stroke-width=".7" stroke-linecap="round"/>`;
  S.teil({ oben: true, id: "sachertorte", de: "die Sachertorte", syl: "SA-cher-tor-te", it: "la torta Sacher", itSyl: "TOR-ta SA-cher", en: "Sachertorte", x: 344, y: 226, kunst: k,
    tipp: "Schokoladentorte mit Marillenmarmelade – „Marille“ sagt man in Österreich zur Aprikose." });
}
{
  /* das Schlagobers neben der Torte */
  let k = `<path d="M-4.6 0 Q-5.2 -2.6 -3 -3.2 Q-2.6 -5.6 0 -5.4 Q2.6 -5.8 3 -3.2 Q5.2 -2.6 4.6 0 Q0 1.4 -4.6 0 Z" fill="${S.rg("obers", [[0, "#ffffff"], [1, "#ebe6dc"]], 0.4, 0.3, 0.7)}"/>`;
  k += `<path d="M-3.4 -1 Q0 -3 3.2 -1.2 M-2.4 -2.8 Q0 -4.4 2.2 -3 M-1.2 -4.4 Q0 -5.4 1 -4.6" stroke="#ddd6c9" stroke-width=".35" fill="none"/><path d="M-.8 -5.2 Q0 -7.4 .9 -5.2 Z" fill="#fbfaf6"/>`;
  S.teil({ oben: true, id: "schlagobers", de: "das Schlagobers", syl: "SCHLAG-o-bers", it: "la panna montata", itSyl: "PAN-na mon-TA-ta", en: "whipped cream", x: 358, y: 226.4, kunst: k,
    tipp: "„Schlagobers“ ist österreichisch und heißt in Deutschland „Schlagsahne“." });
}

/* Licht: warmer Nachmittag von links (fängt keinen Tipp ab) */
S.davor(`<rect width="400" height="260" fill="${S.rg("licht", [[0, "#fff1c8", 0.12], [0.6, "#fff1c8", 0], [1, "#000", 0.05]], 0.05, 0.25, 1.1)}" pointer-events="none"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/wien.js"));
console.log(aus);
