#!/usr/bin/env node
/* =====================================================================
   WIEN (FASSUNG 854, Runde 2) — Bilderwelt neu: Städte der Welt
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … zu den bekanntesten
   Städten in anderen Ländern … als Profi-Grafikdesigner auf Hollywood-
   Niveau“ — und (Funk 291) „mit größter Sorgfalt und Präzision“.

   RECHERCHE (wien.info, austria.info „Stephansdom“, austria-forum
   „Stephansdom“, ganz-wien.at „Michaelertrakt“, schoenbrunn.at
   „Gloriette“, Wiener Riesenrad, austria-forum „Fiaker“, Kaffeehauskultur
   (UNESCO 2011)):
   - EINE VEDUTE (gemaltes Stadtbild), KEIN echter Blick — das sagt das Bild
     auch selbst (Tipp an der Altstadt). Man sitzt im Schanigarten eines
     Kaffeehauses an der Ringstraße. Hofburg, Stephansdom und Riesenrad
     stehen so geordnet wie vom südlichen Ring aus (Hofburg im Nordwesten,
     Dom im Norden, Riesenrad im Nordosten), aber näher zusammengerückt.
     SCHÖNBRUNN liegt in Wirklichkeit 5 km im Südwesten: Es ist links als
     eigenes, fernes Bild im Dunst eingefügt (Ehrenhof-Seite, dahinter auf
     dem Hügel die GLORIETTE), durch Allee und Mast deutlich abgesetzt.
   - STEPHANSDOM von Süden: links die zwei romanischen HEIDENTÜRME (65 m,
     oben achteckig mit Zwillingsfenstern, Steinhelme), dazwischen der
     Westgiebel; das Langhaus mit Strebepfeilern, Fialen und Ziergiebeln;
     der SÜDTURM „Steffl“ (136,4 m, vergoldetes Kreuz); hinter dem First
     die Renaissance-Haube des Nordturms (68 m); das DACH (111 m lang,
     230.000 glasierte Ziegel im Zickzack), über dem Chor auf der Südseite
     als Ziegelbild der DOPPELADLER (Kronen, Bindenschild, Schwert, Zepter;
     die genaue Form des Grundes ist vereinfacht).
   - HOFBURG: Michaelertrakt (Kirschner 1889–93) mit konkaver Front, dem
     Michaelertor, vier Herkulesgruppen, zwei Monumentalbrunnen („Macht
     zur See“, „Macht zu Lande“) und der grünen Michaelerkuppel (54 m;
     goldene Girlanden; die Krone auf der Laterne ist nicht gesichert).
   - RIESENRAD (1897, Walter Basset): 64,75 m hoch, Ø 61 m, Nabe ≈ 34 m
     über dem Boden, 15 rote Waggons; das Rad hängt an zwei genieteten
     Gitterpyramiden, unten das Stationsgebäude.
   - RINGSTRASSE: Allee, Kandelaber, Radweg, zwei Gleise mit Fahrleitung
     (Masten ≈ 32 m auseinander: in 28 m Entfernung ≈ 190 Einheiten),
     STRASSENBAHN Linie D „Nußdorf“, Haltestelle (rot-weißes Schild; die
     genaue Gestalt der Wiener Haltestellentafel ist vereinfacht). FIAKER
     mit zwei Fahrgästen, der Kutscher trägt im Dienst die MELONE.
   - KAFFEEHAUS: Marmortisch, Thonet-Stuhl Nr. 14, Silbertablett mit
     MELANGE und GLAS WASSER, SACHERTORTE mit SCHLAGOBERS fürs Gegenüber,
     vorn das WIENER SCHNITZEL (dünn, wellig souffliert) mit ZITRONEN-
     spalte, Besteck und Erdäpfelsalat, die Zeitung im Holzhalter; der
     OBER mit Weste und Fliege bringt ein Tablett.
   - LICHT: Sommernachmittag, die Sonne steht hinter uns links (SW): alles
     ist von vorn-links beleuchtet, Schlagschatten fallen nach hinten-rechts.
   Maßstab: Horizont y = 140; Auge 1,55 m über der Straße, 1,25 m über dem
   Podest (man sitzt); Brennweite 160 Einheiten. Straße: Fiaker in 12 m,
   Gleise in 26/30 m, Allee in 80 m. Die Wahrzeichen stehen wie auf einer
   Vedute in ≈ 170 m (Fußlinie y ≈ 141,5): Dom 0,97 E/m, Hofburg 0,9,
   Riesenrad 0,85, das ferne Schönbrunn 0,43.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "wien", titel: "Wien", emoji: "🎡", thema: "Länder", kuerzel: "wie", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1897);
const r = B.r;
const HOR = 158, F = 160;
const ys = (d) => r(HOR + 1.55 * F / d);   /* Straße in d Metern */
const yp = (d) => r(HOR + 1.25 * F / d);   /* Podest in d Metern */
/* Die Wahrzeichen sind auf einer Fußlinie y = 141,5 gezeichnet; VED() stellt
   sie auf die Bild-Fußlinie y = 159,5 (≈ 170 m) und vergrößert sie wie auf
   einer Vedute um k um die Achse cx. */
const FUSS = 141.5, FUSS_B = 159.5, HOR0 = 140;
const ys0 = (d) => r(HOR0 + 1.55 * F / d);   /* Straße in den Zeichen-Koordinaten der Wahrzeichen */
const VED = (svg, cx, k, dx = 0) => `<g transform="translate(${r(cx + dx)} ${FUSS_B}) scale(${k}) translate(${-cx} ${-FUSS})">${svg}</g>`;
const VX = (x, cx, k, dx = 0) => r(cx + dx + (x - cx) * k), VY = (y, k) => r(FUSS_B + (y - FUSS) * k);
const VU = (u, cx, k, dx = 0) => Object.assign({}, u, { x: VX(u.x, cx, k, dx), y: VY(u.y, k), kunst: `<g transform="scale(${k})">${u.kunst}</g>` });
const VZ = (z, cx, k, dx = 0) => ({ x: VX(z.x, cx, k, dx), y: VY(z.y, k), w: r(z.w * k), h: r(z.h * k) });

/* Figuren klein halten: Koordinaten ganzzahlig (1 cm), das sieht man bei
   dieser Größe nicht, die Datei wird aber fast halb so groß. */
const rund = (n) => { const v = Math.round(+n); return String(v === 0 ? 0 : v); };
const kompakt = (svg) => svg.replace(/ d="([^"]+)"/g, (a, p) => ` d="${p.replace(/-?\d*\.?\d+/g, rund)}"`)
  .replace(/ (x|y|x1|y1|x2|y2|cx|cy|fx|fy)="(-?\d*\.?\d+)"/g, (a, k, n) => ` ${k}="${rund(n)}"`);
B.mensch({ geschlecht: "m" }, 1);
const M0 = globalThis.DMA_MENSCH;
/* die Melone: runder, niedriger Kopf, schmale Krempe */
M0.KOPF.melone = { krempe: 8.6, hoehe: -6.4, hoch: 2.6, bis: -5.6, farbe: "#1c1c20", band: "#0e0e10" };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
/* Luftperspektive statt Weichzeichner: aufhellen, entsättigen, ins Bläuliche */
const dunst = (name, a, [hr, hg, hb]) => {
  const k = 1 - a, s = 0.18 * a;   /* etwas entsättigen */
  const m = (i) => [0, 1, 2].map((j) => r((i === j ? k - 2 * s : s) * 1000) / 1000);
  S.def(`<filter id="${S.id(name)}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${m(0).join(" ")} 0 ${r(a * hr * 1000) / 1000} ${m(1).join(" ")} 0 ${r(a * hg * 1000) / 1000} ${m(2).join(" ")} 0 ${r(a * hb * 1000) / 1000} 0 0 0 1 0"/></filter>`);
  return `filter="url(#${S.id(name)})"`;
};
const FERN = dunst("fern", 0.3, [0.8, 0.86, 0.93]);
const MITTEL = dunst("mittel", 0.13, [0.82, 0.88, 0.95]);
const SAND = S.lg("sand", [[0, "#ddcfae"], [0.5, "#cbb995"], [1, "#a89676"]], 0, 0, 1, 0);
const SAND_S = S.lg("sands", [[0, "#9a8c72"], [1, "#776b58"]], 0, 0, 1, 0);
const KUPFER = S.lg("kupfer", [[0, "#9bd0b4"], [0.5, "#73b396"], [1, "#4a8670"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff3b0"], [0.45, "#f0c64a"], [1, "#a8760f"]], 0, 0, 1, 1);
const GELB = S.lg("gelb", [[0, "#f6d47a"], [1, "#e2b24e"]]);
/* Zickzack-Ziegel des Domdachs: gelb, grün, weiß, dunkel */
S.def(`<pattern id="${S.id("zickzack")}" patternUnits="userSpaceOnUse" width="6" height="5.2"><rect width="6" height="5.2" fill="#d9b54c"/>` +
  `<path d="M0 1.3 L1.5 0 L3 1.3 L4.5 0 L6 1.3" stroke="#3d6e4a" stroke-width="1" fill="none"/>` +
  `<path d="M0 2.6 L1.5 1.3 L3 2.6 L4.5 1.3 L6 2.6" stroke="#f3ead2" stroke-width=".55" fill="none"/>` +
  `<path d="M0 3.9 L1.5 2.6 L3 3.9 L4.5 2.6 L6 3.9" stroke="#2f2a26" stroke-width=".8" fill="none"/>` +
  `<path d="M0 5.2 L1.5 3.9 L3 5.2 L4.5 3.9 L6 5.2" stroke="#3d6e4a" stroke-width=".55" fill="none"/></pattern>`);
/* Schlagschatten: weich, nach hinten-rechts (die Sonne steht hinter uns links) */
const schlag = (x, y, w, lang, a = 0.3) => `<path d="M${r(x - w / 2)} ${r(y)} L${r(x + w / 2)} ${r(y)} L${r(x + w / 2 + lang * 0.9)} ${r(y - lang * 0.35)} L${r(x - w / 2 + lang * 0.9)} ${r(y - lang * 0.35)} Z" fill="#1b120a" opacity="${a}" filter="url(#bw_weich)"/>`;

/* =====================================================================
   KULISSE — Sommerhimmel mit Haufenwolken, die Ringstraße
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 12}" fill="${S.lg("himmel", [[0, "#4a86c5"], [0.55, "#8fbde2"], [0.88, "#d3e4ee"], [1, "#e6ece6"]])}"/>`);
{
  /* Cumulus: Licht von links vorn, Schattenseite unten rechts, weicher Boden */
  S.def(`<filter id="${S.id("wolke")}" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation=".55"/></filter>`);
  let w = "";
  const wolke = (x, y, s, buckel) => {
    let g = `<g filter="url(#${S.id("wolke")})">`;
    for (const [dx, dy, rr] of buckel) g += `<circle cx="${r(x + (dx + 1.4) * s)}" cy="${r(y + (dy + 1.6) * s)}" r="${r(rr * s)}" fill="#b4c4d6"/>`;
    for (const [dx, dy, rr] of buckel) g += `<circle cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" r="${r(rr * s)}" fill="${S.rg("wolkelicht", [[0, "#ffffff"], [0.6, "#f7f9fb"], [1, "#d9e2ec"]], 0.32, 0.28, 0.8)}"/>`;
    g += `<ellipse cx="${r(x + 2 * s)}" cy="${r(y + 6.4 * s)}" rx="${r(23 * s)}" ry="${r(2.6 * s)}" fill="${S.lg("wolkeboden", [[0, "#d3dde8"], [1, "#b8c7d7"]])}"/>`;
    return g + `</g>`;
  };
  const b1 = [[-17, 3, 5], [-10, -1, 7.5], [-1, -6, 9.5], [8, -3, 8], [16, 0, 6.5], [22, 3.6, 4], [-4, 2.4, 7.5], [10, 3, 6.4]];
  const b2 = [[-12, 2.4, 4.6], [-5, -2.4, 6.6], [4, -4, 6], [11, 0, 5], [16, 3, 3.4], [1, 2.4, 5.6]];
  w += wolke(56, 40, 1, b1) + wolke(176, 22, 0.7, b2) + wolke(318, 30, 0.85, b1) + wolke(118, 72, 0.5, b2) + wolke(388, 64, 0.45, b2);
  S.hinten(w);
}
/* Ringstraße (nicht antippbar): ferner Gehsteig mit Radweg, Gleiskörper,
   Fahrbahn, Bordstein, naher Gehsteig */
{
  let k = `<rect x="0" y="${r(ys(50) - 0.2)}" width="400" height="${r(ys(36) - ys(50) + 0.4)}" fill="#c9c4bb"/>`;
  k += `<rect x="0" y="${ys(40)}" width="400" height=".6" fill="#a6574a"/>`;
  const ga = ys(33), gb = ys(24);
  S.def(`<pattern id="${S.id("granit")}" patternUnits="userSpaceOnUse" width="2.6" height=".9"><rect width="2.6" height=".9" fill="#8f8a82"/><rect x=".1" y=".08" width="1.1" height=".7" rx=".15" fill="#a9a49b"/><rect x="1.4" y=".08" width="1.1" height=".7" rx=".15" fill="#a29d94"/></pattern>`);
  k += `<rect x="0" y="${r(ga - 0.2)}" width="400" height="${r(gb - ga + 0.4)}" fill="url(#${S.id("granit")})"/>`;
  k += `<rect x="0" y="${gb}" width="400" height="${r(ys(6.3) - gb)}" fill="${S.lg("asphalt", [[0, "#8e8c88"], [1, "#6f6d69"]])}"/>`;
  for (const d of [30.6, 29.4, 26.6, 25.4]) k += `<rect x="0" y="${r(ys(d) - 0.15)}" width="400" height="${r(0.2 + 3 / d)}" fill="#d4d0c8"/>`;
  for (let x = 4; x < 400; x += 24) k += `<path d="M${x} ${ys(9.5)} l12 0 l.4 .8 l-12.8 0 Z" fill="#ecebe6" opacity=".85"/>`;
  for (let i = 0; i < 40; i++) k += `<rect x="${r(rnd() * 396)}" y="${r(152 + rnd() * 26)}" width="${r(1 + rnd() * 3)}" height=".35" fill="#5f5d59" opacity=".45"/>`;
  /* Bordstein aus Granit und naher Gehsteig */
  const yb = ys(6.3);
  k += `<rect x="0" y="${yb}" width="400" height="2.4" fill="${S.lg("bord", [[0, "#d8d4cc"], [1, "#9e9a92"]])}"/>`;
  k += `<rect x="0" y="${r(yb + 2.4)}" width="400" height="${r(yp(3.6) - yb - 2.4)}" fill="#b8b3aa"/>`;
  for (let i = -10; i <= 10; i++) k += `<line x1="${r(200 + i * 22)}" y1="${r(yb + 2.4)}" x2="${r(200 + i * 26)}" y2="${yp(3.6)}" stroke="#9a958c" stroke-width=".3"/>`;
  k += `<line x1="0" y1="${r(yb + 8)}" x2="400" y2="${r(yb + 8)}" stroke="#9a958c" stroke-width=".3"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DER WIENERWALD mit Kahlenberg (Sendemast) und Leopoldsberg
   ===================================================================== */
{
  let k = `<path d="M0 141 L0 121 Q40 114 84 117 Q130 110 168 110 Q188 106 204 105.4 Q218 106 232 108.4 Q246 110 258 120 Q272 132 292 139 L292 141 Z" fill="${S.lg("wald", [[0, "#7e9a8e"], [1, "#94ab9f"]])}"/>`;
  k += `<path d="M0 141 L0 130 Q50 124 100 128 Q150 122 200 126 Q240 128 262 141 Z" fill="#8aa496"/>`;
  k += `<line x1="204" y1="105.6" x2="204" y2="90" stroke="#7d8c8e" stroke-width=".55"/><path d="M202.6 105.6 L204 95 L205.4 105.6" stroke="#7d8c8e" stroke-width=".25" fill="none"/><rect x="203.6" y="90" width=".8" height=".6" fill="#c0504a"/>`;
  k += `<rect x="229.4" y="105.8" width="4" height="2.6" fill="#a8b4b0"/><path d="M230.6 105.8 L231.4 103 L232.2 105.8 Z" fill="#a8b4b0"/>`;
  S.teil({ id: "wienerwald", de: "der Wienerwald", syl: "WIE-ner-wald", it: "il Bosco Viennese", itSyl: "BO-sco vien-NE-se", en: "Vienna Woods", x: 0, y: 0,
    kunst: VED(`<g ${FERN}>${k}</g>`, 200, 1), tipp: "Im Norden liegen die Hügel des Wienerwalds. Auf dem Kahlenberg steht ein hoher Sendemast." });
}

/* =====================================================================
   2 — DIE GLORIETTE auf dem Hügel, 3 — SCHLOSS SCHÖNBRUNN
       (fernes Bild im Dunst, links abgesetzt)
   ===================================================================== */
{
  let k = `<path d="M44 142 Q52 124 70 116 Q88 112.6 106 114.4 Q120 117 128 128 L132 142 Z" fill="${S.lg("huegel", [[0, "#8fab78"], [1, "#6f8f5e"]])}"/>`;
  k += `<path d="M84 114.2 L96 114.2 Q100 126 104 142 L76 142 Q80 126 84 114.2 Z" fill="#a3bd8c"/>`;
  for (let i = 0; i < 36; i++) {
    const x = 50 + rnd() * 76, top = x < 70 ? 142 - (x - 44) * 1.0 : (x > 106 ? 114.4 + (x - 106) * 0.6 : 114.6), y = top + 1.5 + rnd() * (141 - top);
    if (x > 80 && x < 100 && y < 132) continue;
    k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(1.8 + rnd() * 1.8)}" ry="${r(1.4 + rnd() * 1.2)}" fill="${["#5d7f4c", "#4f7042", "#6a8c56"][Math.floor(rnd() * 3)]}"/>`;
  }
  /* Gloriette: Mitte als verglaster Triumphbogen, Arkadenflügel mit Doppelsäulen,
     oben der Reichsadler auf der Weltkugel zwischen Trophäen */
  const GX = 90, GY = 114.2;
  k += `<rect x="${GX - 18}" y="${GY - 4.2}" width="36" height="4.2" fill="#efe1b2"/>`;
  for (let i = 0; i < 5; i++) for (const sx of [-1, 1]) {
    const x = GX + sx * (6.2 + i * 2.4);
    k += `<path d="M${r(x - 0.75)} ${GY} L${r(x - 0.75)} ${r(GY - 2.8)} Q${r(x)} ${r(GY - 3.6)} ${r(x + 0.75)} ${r(GY - 2.8)} L${r(x + 0.75)} ${GY} Z" fill="#7d8a86"/>`;
  }
  k += `<rect x="${GX - 5.4}" y="${GY - 7.6}" width="10.8" height="7.6" fill="#f3e4b3"/>`;
  for (const dx of [-3.2, 0, 3.2]) k += `<path d="M${r(GX + dx - 1.1)} ${GY} L${r(GX + dx - 1.1)} ${r(GY - 4.6)} Q${r(GX + dx)} ${r(GY - 6)} ${r(GX + dx + 1.1)} ${r(GY - 4.6)} L${r(GX + dx + 1.1)} ${GY} Z" fill="#6f8796"/>`;
  k += `<rect x="${GX - 18.6}" y="${GY - 4.8}" width="37.2" height=".7" fill="#fbf3da"/><rect x="${GX - 5.8}" y="${GY - 8.4}" width="11.6" height=".9" fill="#fbf3da"/>`;
  k += `<circle cx="${GX}" cy="${GY - 9.6}" r=".9" fill="#55605a"/><path d="M${GX - 2.6} ${GY - 10.8} Q${GX - 1.4} ${GY - 9.8} ${GX} ${GY - 10.5} Q${GX + 1.4} ${GY - 9.8} ${GX + 2.6} ${GY - 10.8} Q${GX + 1.4} ${GY - 12.2} ${GX} ${GY - 11.4} Q${GX - 1.4} ${GY - 12.2} ${GX - 2.6} ${GY - 10.8} Z" fill="#3a403c"/>`;
  for (const sx of [-1, 1]) k += `<path d="M${GX + sx * 4.6} ${GY - 8.4} l${sx * 0.5} -1.8 l${sx * 0.5} 1.8 Z" fill="#e2d2a2"/>`;
  S.teil({ id: "gloriette", de: "die Gloriette", syl: "glo-ri-ET-te", it: "la Gloriette", itSyl: "glo-ri-ET-te", en: "Gloriette", x: 0, y: 0,
    kunst: VED(`<g ${FERN}>${k}</g>`, 92, 1, 4), tipp: "Die Gloriette steht auf dem Hügel hinter Schloss Schönbrunn. Drinnen ist heute ein Café." });
}
{
  /* Schloss Schönbrunn, Ehrenhof-Seite: lange gelbe Fassade, Mittelrisalit, Freitreppe */
  const x0 = 54, x1 = 126, F0 = 142, T = 132;
  let k = `<rect x="${x0}" y="${T}" width="${x1 - x0}" height="${F0 - T}" fill="${GELB}"/>`;
  k += `<path d="M${x0 - 0.5} ${T} L${x0 + 1.4} ${T - 2} L${x1 - 1.4} ${T - 2} L${x1 + 0.5} ${T} Z" fill="#8a929a"/>`;
  const MX = (x0 + x1) / 2;
  k += `<rect x="${MX - 8}" y="${T - 2.8}" width="16" height="${F0 - T + 2.8}" fill="#f4cd6a"/><rect x="${MX - 8.5}" y="${T - 3.6}" width="17" height=".9" fill="#fcf3dc"/>`;
  for (let x = MX - 7; x <= MX + 7; x += 3.5) k += `<path d="M${x - 0.3} ${T - 3.6} l.1 -1.3 q.2 -.5 .4 0 l.1 1.3 Z" fill="#f6eedb"/>`;
  for (let row = 0; row < 3; row++) for (let x = x0 + 1.2; x < x1 - 1; x += 2.2) {
    const y = T + 1.2 + row * 3 - (Math.abs(x - MX) < 8 ? 2.4 : 0);
    k += `<rect x="${r(x)}" y="${r(y)}" width="1" height="${row === 1 ? 1.9 : 1.4}" fill="#66717a" stroke="#fdf6e2" stroke-width=".25"/>`;
  }
  for (const x of [MX - 8, MX + 8, x0 + 10, x1 - 10]) k += `<rect x="${x - 0.4}" y="${T}" width=".8" height="${F0 - T}" fill="#fae9b8"/>`;
  k += `<path d="M${MX - 5} ${F0} L${MX - 2} ${F0 - 3} L${MX + 2} ${F0 - 3} L${MX + 5} ${F0} Z" fill="#ebe4d4"/>`;
  k += `<rect x="${x0}" y="${T}" width="${x1 - x0}" height="${F0 - T}" fill="${S.lg("schlosslicht", [[0, "#fff4d0", 0.22], [1, "#7a5a20", 0.1]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "schloss", de: "das Schloss Schönbrunn", syl: "SCHLOSS SCHÖN-brunn", it: "la Reggia di Schönbrunn", itSyl: "REG-gia di SCHÖN-brunn", en: "Schönbrunn Palace", x: 0, y: 0,
    kunst: VED(`<g ${FERN}>${k}</g>`, 92, 1, 4), tipp: "Im Schloss Schönbrunn wohnte die Kaiserfamilie im Sommer. Das Gelb heißt „Schönbrunner Gelb“." });
}

/* =====================================================================
   4 — DIE HOFBURG: Michaelertrakt mit konkaver Front, Brunnen,
       Herkulesgruppen und Michaelerkuppel — Lupe: Kuppel
   ===================================================================== */
{
  const M = 180, s = 0.9, X0 = 153, X1 = 207;
  const y = (m) => r(FUSS - m * s);
  /* konkave Front: die Enden stehen näher, darum oben höher und unten tiefer */
  const kurve = (m, t) => r(FUSS - m * s * (1 + 0.07 * t * t) + 0.9 * t * t);
  const xs = (t) => r(M + t * (X1 - X0) / 2);
  let k = "";
  let ober = "", unter = "";
  for (let i = 0; i <= 20; i++) { const t = -1 + i / 10; ober += `${i ? " L" : "M"}${xs(t)} ${kurve(21, t)}`; unter = ` L${xs(t)} ${kurve(0, t)}` + unter; }
  k += `<path d="${ober}${unter} Z" fill="${S.lg("hofburg", [[0, "#f3ede0"], [0.5, "#e6ddcc"], [1, "#d3c8b4"]], 0, 0, 1, 0)}"/>`;
  /* Fensterreihen folgen der Krümmung */
  for (let row = 0; row < 3; row++) for (let i = 0; i < 15; i++) {
    const t = -0.94 + i * 0.134;
    if (Math.abs(t) < 0.26) continue;
    const m = 17.6 - row * 5.8, xx = xs(t), yy = kurve(m, t);
    k += `<rect x="${r(xx - 0.65)}" y="${yy}" width="1.3" height="${row === 1 ? 3 : 2.4}" fill="#6a6f74"/><rect x="${r(xx - 0.9)}" y="${r(yy - 0.5)}" width="1.8" height=".45" fill="#fbf8f0"/>`;
  }
  let gesims = "";
  for (let i = 0; i <= 20; i++) { const t = -1 + i / 10; gesims += `${i ? " L" : "M"}${xs(t)} ${r(kurve(21, t) - 0.2)}`; }
  k += `<path d="${gesims}" stroke="#fbf8f0" stroke-width="1.1" fill="none"/>`;
  for (let i = 0; i <= 10; i++) { const t = -1 + i / 5; k += `<path d="M${r(xs(t) - 0.4)} ${r(kurve(21, t) - 0.6)} l.1 -1.7 q.3 -.6 .6 0 l.1 1.7 Z" fill="#ebe5d8"/>`; }
  /* Mittelbau mit dem Michaelertor */
  k += `<path d="M${M - 7} ${FUSS} L${M - 7} ${y(24)} L${M + 7} ${y(24)} L${M + 7} ${FUSS} Z" fill="#f7f2e7"/>`;
  k += `<path d="M${M - 3} ${FUSS} L${M - 3} ${y(9)} Q${M} ${y(13)} ${M + 3} ${y(9)} L${M + 3} ${FUSS} Z" fill="#45444a"/>`;
  for (const dx of [-5.6, -4.4, 4.4, 5.6]) k += `<rect x="${M + dx - 0.35}" y="${y(17)}" width=".7" height="${r(17 * s)}" fill="#e9e1d1"/>`;
  k += `<rect x="${M - 7.4}" y="${y(24.6)}" width="14.8" height="1" fill="#fbf8f0"/>`;
  for (const dx of [-5, -1.6, 1.6, 5]) k += `<path d="M${M + dx - 0.35} ${y(24.6)} l.1 -1.5 q.25 -.5 .5 0 l.1 1.5 Z" fill="#efe9dc"/>`;
  /* vier Herkulesgruppen am Tor */
  for (const dx of [-11, -8.4, 8.4, 11]) k += `<rect x="${M + dx - 1.2}" y="${y(2.4)}" width="2.4" height="${r(2.4 * s)}" fill="#ddd5c6"/><path d="M${M + dx - 1} ${y(2.4)} l.4 -3.2 q.6 -1.2 1.2 0 l.4 3.2 Z M${M + dx - 0.2} ${y(5.6)} l-.9 -1 .5 -.4 .8 .8 Z" fill="#f2ede3"/><circle cx="${M + dx}" cy="${y(6.6)}" r=".55" fill="#f2ede3"/>`;
  /* zwei Monumentalbrunnen in den Enden der Front */
  for (const t of [-0.8, 0.8]) {
    const bx = xs(t), by = kurve(0, t);
    k += `<path d="M${r(bx - 4.6)} ${by} L${r(bx - 4.6)} ${r(by - 9)} Q${bx} ${r(by - 13)} ${r(bx + 4.6)} ${r(by - 9)} L${r(bx + 4.6)} ${by} Z" fill="#cfc6b6"/>`;
    k += `<path d="M${r(bx - 3)} ${r(by - 1.6)} l1 -4 l1.2 -1.6 l.6 1 l1 -2.2 l.8 2 l1.2 -.6 l.2 3 l1 2.4 Z" fill="#a9a091"/><rect x="${r(bx - 4.2)}" y="${r(by - 1.6)}" width="8.4" height="1.6" fill="#bcb4a5"/>`;
    k += `<path d="M${r(bx - 3.6)} ${r(by - 1.8)} q3.6 -.8 7.2 0" stroke="#d9ecf2" stroke-width=".5" fill="none"/>`;
  }
  /* Tambour, grüne Rippenkuppel mit goldenen Girlanden, Laterne, Krone */
  k += `<rect x="${M - 9}" y="${y(32)}" width="18" height="${r(8 * s)}" fill="#efe8da"/>`;
  for (let i = 0; i < 5; i++) k += `<path d="M${r(M - 7.2 + i * 3.4)} ${y(25.6)} L${r(M - 7.2 + i * 3.4)} ${y(29.4)} Q${r(M - 6.4 + i * 3.4)} ${y(30.4)} ${r(M - 5.6 + i * 3.4)} ${y(29.4)} L${r(M - 5.6 + i * 3.4)} ${y(25.6)} Z" fill="#5e6266"/>`;
  k += `<rect x="${M - 9.6}" y="${y(32.6)}" width="19.2" height="1" fill="#fbf8f0"/>`;
  k += `<path d="M${M - 9} ${y(32.6)} C${M - 9} ${y(41)} ${M - 5} ${y(46.4)} ${M} ${y(47)} C${M + 5} ${y(46.4)} ${M + 9} ${y(41)} ${M + 9} ${y(32.6)} Z" fill="${KUPFER}"/>`;
  for (const t of [-0.66, -0.33, 0, 0.33, 0.66]) k += `<path d="M${r(M + t * 9)} ${y(32.6)} Q${r(M + t * 7.6)} ${y(42)} ${M} ${y(47)}" stroke="#d9b54a" stroke-width=".3" fill="none"/>`;
  k += `<path d="M${M - 8.4} ${y(35)} Q${M - 6} ${y(33.6)} ${M - 4.2} ${y(35.6)} Q${M - 2} ${y(34)} ${M} ${y(36)} Q${M + 2} ${y(34)} ${M + 4.2} ${y(35.6)} Q${M + 6} ${y(33.6)} ${M + 8.4} ${y(35)}" stroke="#e8c14a" stroke-width=".4" fill="none"/>`;
  k += `<path d="M${M - 6.4} ${y(39)} C${M - 6} ${y(43.6)} ${M - 3.6} ${y(45.8)} ${M - 1} ${y(46.4)}" stroke="#c8ecd8" stroke-width=".6" opacity=".6" fill="none"/>`;
  k += `<rect x="${M - 1.6}" y="${y(51)}" width="3.2" height="${r(4 * s)}" fill="#7fbea0"/><path d="M${M - 2} ${y(51)} Q${M} ${y(52.6)} ${M + 2} ${y(51)} Z" fill="${KUPFER}"/>`;
  k += `<path d="M${M - 1.2} ${y(52.4)} L${M - 1.4} ${y(53.8)} L${M - 0.6} ${y(53.2)} L${M} ${y(54.2)} L${M + 0.6} ${y(53.2)} L${M + 1.4} ${y(53.8)} L${M + 1.2} ${y(52.4)} Z" fill="${GOLD}"/>`;
  S.teil({ id: "hofburg", de: "die Hofburg", syl: "HOF-burg", it: "il Palazzo imperiale", itSyl: "pa-LAZ-zo im-pe-RIA-le", en: "Hofburg Palace", x: 0, y: 0, kunst: VED(`<g ${MITTEL}>${k}</g>`, 180, 1.04),
    tipp: "In der Hofburg wohnte die Kaiserfamilie im Winter. Heute arbeitet hier der Bundespräsident.",
    zoom: VZ({ x: 146, y: 90, w: 68, h: 54 }, 180, 1.04),
    unter: [
      { id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: M, y: y(32), kunst: flaeche(-9.4, -21, 18.8, 21),
        tipp: "Unter der grünen Michaelerkuppel geht man durch das Tor in die Hofburg." },
    ].map((u) => VU(u, 180, 1.04)) });
}

/* =====================================================================
   5 — DER STEPHANSDOM von Süden — Lupe: Turm, Dach, Doppeladler
   ===================================================================== */
{
  const W0 = 214, O0 = 330, s = 0.97;
  const y = (m) => r(FUSS - m * s);
  const TRAUFE = y(27), FIRST = y(62);
  let k = "";
  /* Nordturm (68 m): breite grüne Renaissance-Haube mit Laterne über dem First */
  const NX = 257;
  k += `<rect x="${NX - 6}" y="${y(62.4)}" width="12" height="${r(2.6 * s)}" fill="${SAND_S}"/>`;
  k += `<path d="M${NX - 7} ${y(62.4)} Q${NX - 7.2} ${y(65.4)} ${NX - 3.6} ${y(66.4)} Q${NX - 1.8} ${y(66.8)} ${NX - 1.4} ${y(67.6)} L${NX + 1.4} ${y(67.6)} Q${NX + 1.8} ${y(66.8)} ${NX + 3.6} ${y(66.4)} Q${NX + 7.2} ${y(65.4)} ${NX + 7} ${y(62.4)} Z" fill="${KUPFER}"/>`;
  k += `<rect x="${NX - 1.2}" y="${y(70)}" width="2.4" height="${r(2.4 * s)}" fill="#7fbea0"/><path d="M${NX - 1.6} ${y(70)} Q${NX} ${y(71.6)} ${NX + 1.6} ${y(70)} Z" fill="${KUPFER}"/><circle cx="${NX}" cy="${y(72.2)}" r=".55" fill="${GOLD}"/>`;
  /* Dach (Zickzack) über Langhaus und Chor, der Osten abgewalmt */
  k += `<path d="M${W0 + 14} ${TRAUFE} L${W0 + 14} ${FIRST} L${O0 - 14} ${FIRST} L${O0} ${TRAUFE} Z" fill="url(#${S.id("zickzack")})"/>`;
  /* Doppeladler über dem Chor: der goldgelbe Grund ist in Ziegelzeilen gelegt,
     links und rechts stufig an die Zickzack-Bahnen angesetzt */
  const AX = 303, AY = r((TRAUFE + FIRST) / 2 + 0.6), AS = 1.1;
  {
    const FY0 = r(FIRST + 3.6), FY1 = r(TRAUFE - 3.4), zeilen = Math.round((FY1 - FY0) / 2.6);
    let grund = "";
    for (let z = 0; z < zeilen; z++) {
      const yy = FY0 + z * (FY1 - FY0) / zeilen, h = (FY1 - FY0) / zeilen, mid = Math.abs(z - (zeilen - 1) / 2) / ((zeilen - 1) / 2);
      const halb = 14.5 - 3 * mid * mid + (z % 2 ? 0.75 : 0);
      grund += `<rect x="${r(AX - halb)}" y="${r(yy)}" width="${r(2 * halb)}" height="${r(h + 0.05)}" fill="${z % 2 ? "#e6c04f" : "#edcb5c"}"/>`;
      for (let x = AX - halb + 1.5; x < AX + halb; x += 3) grund += `<line x1="${r(x + (z % 2) * 1.5)}" y1="${r(yy)}" x2="${r(x + (z % 2) * 1.5)}" y2="${r(yy + h)}" stroke="#c99f38" stroke-width=".12"/>`;
    }
    k += grund;
  }
  const halbe = [[0, -4], [-1.1, -5.8], [-1.5, -8.2], [-2, -9.1], [-2.9, -9.3], [-3.9, -8.9], [-3.1, -8.5], [-2.4, -8.3], [-2.1, -7.1], [-2.4, -5.6], [-3, -4.8], [-4.8, -7.4], [-6.2, -10.4], [-6.7, -8], [-8.3, -9.9], [-8.6, -7.2], [-10.3, -8.5], [-10.2, -5.8], [-11.8, -6.3], [-11.2, -3.8], [-12.2, -3.4], [-10.6, -1.8], [-7, -1.3], [-4.6, -.5], [-3.2, .4], [-3, 2.6], [-4.3, 3.7], [-2.6, 3.4], [-2.2, 4.2], [-3.1, 7.6], [-1.4, 6.2], [-.8, 8.4], [0, 6.8]];
  const pt = ([x, yy]) => `${r(AX + x * AS)} ${r(AY + yy * AS)}`;
  let adler = `<path d="M${halbe.map(pt).join(" L")} L${halbe.slice().reverse().map(([x, yy]) => pt([-x, yy])).join(" L")} Z" fill="#1b1816"/>`;
  for (const sx of [-1, 1]) {
    adler += `<path d="M${pt([sx * 3.6, -8.9])} L${pt([sx * 4.4, -8.4])}" stroke="#c8302a" stroke-width=".35"/>`;
    adler += `<path d="M${pt([sx * 1.8, -9.6])} L${pt([sx * 1.9, -10.9])} L${pt([sx * 2.3, -10.2])} L${pt([sx * 2.6, -11.1])} L${pt([sx * 2.9, -10.2])} L${pt([sx * 3.3, -10.9])} L${pt([sx * 3.4, -9.6])} Z" fill="${GOLD}"/>`;
    for (let f = 0; f < 4; f++) adler += `<path d="M${pt([sx * (4 + f * 1.7), -2.6 - f * 0.3])} L${pt([sx * (5.4 + f * 1.7), -6.4 - f * 0.6])}" stroke="#4a4038" stroke-width=".22"/>`;
  }
  adler += `<path d="M${pt([-1.6, -11.4])} L${pt([-1.7, -13.2])} L${pt([-.8, -12.4])} L${pt([0, -13.8])} L${pt([.8, -12.4])} L${pt([1.7, -13.2])} L${pt([1.6, -11.4])} Z" fill="${GOLD}"/>`;
  adler += `<path d="M${pt([-1.7, -3.2])} L${pt([1.7, -3.2])} L${pt([1.7, .2])} Q${pt([0, 1.8])} ${pt([-1.7, .2])} Z" fill="#c8302a" stroke="#e8c35a" stroke-width=".25"/><rect x="${r(AX - 1.7 * AS)}" y="${r(AY - 1.9 * AS)}" width="${r(3.4 * AS)}" height="${r(0.9 * AS)}" fill="#f6f2ea"/>`;
  adler += `<path d="M${pt([4.2, 3.4])} L${pt([7.6, -1])}" stroke="#d9dde0" stroke-width=".45"/><path d="M${pt([-4.2, 3.4])} L${pt([-7, 0])}" stroke="${GOLD}" stroke-width=".45"/><circle cx="${r(AX - 7.2 * AS)}" cy="${r(AY - 0.3 * AS)}" r=".5" fill="${GOLD}"/>`;
  k += adler;
  /* Licht auf dem Dach: links heller, zum Walm hin dunkler */
  k += `<path d="M${W0 + 14} ${TRAUFE} L${W0 + 14} ${FIRST} L${O0 - 14} ${FIRST} L${O0} ${TRAUFE} Z" fill="${S.lg("dachlicht", [[0, "#fff6d6", 0.2], [0.55, "#fff6d6", 0], [1, "#1a1408", 0.22]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${W0 + 14} ${FIRST} L${O0 - 14} ${FIRST}" stroke="#4a4036" stroke-width=".6"/>`;
  /* Westgiebel zwischen den Heidentürmen */
  k += `<path d="M${W0 + 4.4} ${y(40)} L${W0 + 8} ${y(57)} L${W0 + 11.6} ${y(40)} Z" fill="${SAND}"/><circle cx="${W0 + 8}" cy="${y(46)}" r="1.4" fill="#4c4743"/><path d="M${W0 + 8} ${y(57)} L${W0 + 8} ${y(59.4)}" stroke="#a59577" stroke-width=".5"/>`;
  /* zwei romanische Heidentürme: unten vierkantig, oben achteckig mit
     rundbogigen Zwillingsfenstern, steinerne Helme */
  for (const [hx, licht] of [[W0 + 2.2, false], [W0 + 13.6, true]]) {
    const f = licht ? SAND : SAND_S;
    k += `<rect x="${r(hx - 3.6)}" y="${y(40)}" width="7.2" height="${r(40 * s)}" fill="${f}"/>`;
    k += `<path d="M${r(hx - 3.2)} ${y(40)} L${r(hx - 3.2)} ${y(56)} L${r(hx - 1.4)} ${y(57)} L${r(hx + 1.4)} ${y(57)} L${r(hx + 3.2)} ${y(56)} L${r(hx + 3.2)} ${y(40)} Z" fill="${f}"/>`;
    k += `<path d="M${r(hx - 1.4)} ${y(40)} L${r(hx - 1.4)} ${y(57)} M${r(hx + 1.4)} ${y(40)} L${r(hx + 1.4)} ${y(57)}" stroke="#8a7d64" stroke-width=".25"/>`;
    for (const m of [43, 50]) for (const dx of [-0.75, 0.75]) k += `<path d="M${r(hx + dx - 0.55)} ${y(m)} L${r(hx + dx - 0.55)} ${y(m + 3.4)} Q${r(hx + dx)} ${y(m + 4.2)} ${r(hx + dx + 0.55)} ${y(m + 3.4)} L${r(hx + dx + 0.55)} ${y(m)} Z" fill="#3a3632"/>`;
    k += `<path d="M${r(hx - 2.2)} ${y(30)} L${r(hx - 2.2)} ${y(33)} Q${r(hx - 1.4)} ${y(34)} ${r(hx - 0.6)} ${y(33)} L${r(hx - 0.6)} ${y(30)} Z" fill="#3a3632"/>`;
    k += `<rect x="${r(hx - 3.8)}" y="${y(40.4)}" width="7.6" height=".8" fill="#e6dcc4"/><rect x="${r(hx - 3.4)}" y="${y(57.4)}" width="6.8" height=".7" fill="#e6dcc4"/>`;
    k += `<path d="M${r(hx - 3.2)} ${y(57.4)} L${hx} ${y(65)} L${r(hx + 3.2)} ${y(57.4)} Z" fill="${f}"/><path d="M${hx} ${y(57.4)} L${hx} ${y(65)} L${r(hx + 3.2)} ${y(57.4)} Z" fill="#000" opacity=".14"/>`;
    k += `<circle cx="${hx}" cy="${y(65.4)}" r=".5" fill="${GOLD}"/>`;
  }
  /* Langhaus und Chor: Sandsteinwand, Strebepfeiler mit Fialen über der Traufe,
     hohe Fenster, Ziergiebel (Wimperge) */
  k += `<rect x="${W0 + 17}" y="${TRAUFE}" width="${O0 - W0 - 17}" height="${r(FUSS - TRAUFE)}" fill="${SAND}"/>`;
  for (let x = W0 + 19; x < O0 - 2; x += 7.4) {
    if (x > 262 && x < 288) continue;
    k += `<path d="M${r(x + 1.4)} ${FUSS} L${r(x + 1.4)} ${y(19)} Q${r(x + 3.1)} ${y(22.4)} ${r(x + 4.8)} ${y(19)} L${r(x + 4.8)} ${FUSS} Z" fill="#4c4743"/>`;
    k += `<line x1="${r(x + 3.1)}" y1="${y(20.6)}" x2="${r(x + 3.1)}" y2="${FUSS}" stroke="#a69a82" stroke-width=".3"/>`;
    k += `<path d="M${r(x + 1)} ${TRAUFE} L${r(x + 3.1)} ${y(34)} L${r(x + 5.2)} ${TRAUFE} Z" fill="${SAND}" stroke="#8f826a" stroke-width=".25"/><circle cx="${r(x + 3.1)}" cy="${y(29.6)}" r=".7" fill="none" stroke="#6f6553" stroke-width=".25"/>`;
    k += `<rect x="${r(x - 0.8)}" y="${y(30)}" width="1.6" height="${r(30 * s)}" fill="${SAND_S}"/><path d="M${r(x - 0.8)} ${y(30)} L${r(x)} ${y(37)} L${r(x + 0.8)} ${y(30)} Z" fill="#a59577"/>`;
    k += `<path d="M${r(x - 0.5)} ${y(33.4)} l-.4 .5 M${r(x + 0.5)} ${y(33.4)} l.4 .5" stroke="#a59577" stroke-width=".3"/>`;
  }
  k += `<rect x="${W0 + 17}" y="${TRAUFE}" width="${O0 - W0 - 17}" height="1" fill="#e6dcc4"/>`;
  k += `<path d="M${O0 - 4} ${TRAUFE} L${O0} ${TRAUFE} L${O0} ${FUSS} L${O0 - 4} ${FUSS} Z" fill="${SAND_S}"/>`;
  for (let i = 0; i < 24; i++) { const x = W0 + 17 + rnd() * (O0 - W0 - 21); k += `<rect x="${r(x)}" y="${r(TRAUFE + 2 + rnd() * 10)}" width="${r(0.4 + rnd() * 0.8)}" height="${r(3 + rnd() * 8)}" fill="#5e5547" opacity=".22"/>`; }
  /* der Südturm „Steffl“ */
  const TX = 274;
  const stufe = (m0, m1, b0, b1) => {
    let g = `<path d="M${r(TX - b0 / 2)} ${y(m0)} L${r(TX - b1 / 2)} ${y(m1)} L${r(TX + b1 / 2)} ${y(m1)} L${r(TX + b0 / 2)} ${y(m0)} Z" fill="${SAND}"/>`;
    g += `<path d="M${r(TX + b0 * 0.12)} ${y(m0)} L${r(TX + b1 * 0.12)} ${y(m1)} L${r(TX + b1 / 2)} ${y(m1)} L${r(TX + b0 / 2)} ${y(m0)} Z" fill="#6b604e" opacity=".5"/>`;
    const hm = (m1 - m0) * 0.7, mb = m0 + (m1 - m0) * 0.12, bw = b1 * 0.16;
    for (const dx of [-b1 * 0.2, b1 * 0.2]) g += `<path d="M${r(TX + dx - bw / 2)} ${y(mb)} L${r(TX + dx - bw / 2)} ${y(mb + hm * 0.8)} Q${r(TX + dx)} ${y(mb + hm)} ${r(TX + dx + bw / 2)} ${y(mb + hm * 0.8)} L${r(TX + dx + bw / 2)} ${y(mb)} Z" fill="#3c3834"/>`;
    for (const dx of [-b1 * 0.2, b1 * 0.2]) g += `<path d="M${r(TX + dx - bw * 0.8)} ${y(m1 - (m1 - m0) * 0.12)} L${r(TX + dx)} ${y(m1 + (m1 - m0) * 0.12)} L${r(TX + dx + bw * 0.8)} ${y(m1 - (m1 - m0) * 0.12)}" stroke="${SAND}" stroke-width=".7" fill="none"/>`;
    for (const sx of [-1, 1]) g += `<path d="M${r(TX + sx * b1 / 2 - 0.5)} ${y(m1)} L${r(TX + sx * b1 / 2)} ${y(m1 + 5)} L${r(TX + sx * b1 / 2 + 0.5)} ${y(m1)} Z" fill="#a59577"/>`;
    g += `<rect x="${r(TX - b1 / 2 - 0.3)}" y="${y(m1 + 0.3)}" width="${r(b1 + 0.6)}" height=".6" fill="#e6dcc4"/>`;
    return g;
  };
  k += stufe(0, 30, 21, 19.4) + stufe(30, 58, 19.4, 15) + stufe(58, 82, 15, 10.6) + stufe(82, 100, 10.6, 7.6);
  k += `<path d="M${TX - 3.8} ${y(100)} L${TX - 0.35} ${y(133)} L${TX + 0.35} ${y(133)} L${TX + 3.8} ${y(100)} Z" fill="${SAND}"/><path d="M${TX + 0.6} ${y(100)} L${TX + 0.2} ${y(133)} L${TX + 3.8} ${y(100)} Z" fill="#6b604e" opacity=".5"/>`;
  for (let m = 103; m < 131; m += 3.2) { const b = 3.8 * (133 - m) / 33; k += `<path d="M${r(TX - b)} ${y(m)} l-.7 .5 M${r(TX + b)} ${y(m)} l.7 .5" stroke="#a59577" stroke-width=".45"/>`; }
  k += `<circle cx="${TX}" cy="${y(133.6)}" r=".7" fill="${GOLD}"/><path d="M${TX} ${y(134)} L${TX} ${y(137.4)} M${TX - 1} ${y(136.2)} L${TX + 1} ${y(136.2)}" stroke="#e0b030" stroke-width=".45"/>`;
  k += `<path d="M${TX - 3} ${FUSS} L${TX - 3} ${y(6)} L${TX} ${y(10)} L${TX + 3} ${y(6)} L${TX + 3} ${FUSS} Z" fill="#3a3632"/>`;
  S.teil({ id: "stephansdom", de: "der Stephansdom", syl: "STE-phans-dom", it: "il Duomo di Santo Stefano", itSyl: "DUO-mo di SAN-to STE-fa-no", en: "St. Stephen's Cathedral", x: 0, y: 0, kunst: VED(`<g ${MITTEL}>${k}</g>`, 274, 1.1, -1),
    tipp: "Der Stephansdom ist das Herz von Wien. Die Wiener sagen „Steffl“ zu seinem Südturm.",
    zoom: VZ({ x: 206, y: 4, w: 132, h: 141 }, 274, 1.1, -1),
    unter: [
      { id: "turm", de: "der Turm", syl: "TURM", it: "la torre", itSyl: "TOR-re", en: "tower", x: TX, y: FUSS, kunst: flaeche(-10.6, -134, 21.2, 134, 0.6),
        tipp: "Der Südturm ist 136 Meter hoch. Wer 343 Stufen steigt, schaut über ganz Wien." },
      { id: "dach", de: "das Dach", syl: "DACH", it: "il tetto", itSyl: "TET-to", en: "roof", x: 248, y: TRAUFE, kunst: flaeche(-16, -(TRAUFE - FIRST), 30, TRAUFE - FIRST, 0.6),
        tipp: "Das Dach hat 230.000 bunte, glasierte Ziegel im Zickzack-Muster." },
      { id: "doppeladler", de: "der Doppeladler", syl: "DOP-pel-ad-ler", it: "l'aquila bicipite", itSyl: "A-qui-la bi-CI-pi-te", en: "double-headed eagle", x: AX, y: r(TRAUFE - 3), kunst: flaeche(-14.6, -(TRAUFE - FIRST - 6.6), 29.2, TRAUFE - FIRST - 6.6, 0.6),
        tipp: "Der Doppeladler aus bunten Ziegeln war das Wappen der Habsburger, der Kaiserfamilie." },
    ].map((u) => VU(u, 274, 1.1, -1)) });
}

/* =====================================================================
   6 — DAS RIESENRAD im Prater — Lupe: Waggon
   Nabe 34 m über dem Boden, Ø 61 m: bei 0,85 E/m Radius 26, Nabe Fuß − 29
   ===================================================================== */
{
  const CX = 371, FU = 142, s = 0.85, R = 26, CY = r(FU - 34 * s);
  const ST = "#4a3f3a";
  let k = "";
  /* hintere Gitterpyramide (heller, etwas versetzt) */
  k += `<path d="M${CX + 1} ${CY} L${CX - 18} ${FU} M${CX + 1} ${CY} L${CX + 20} ${FU}" stroke="#8d847d" stroke-width="1"/>`;
  /* Felge: zwei Ringe mit Fachwerk, Speichenseile tangential an der Nabe */
  k += `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${ST}" stroke-width=".9"/><circle cx="${CX}" cy="${CY}" r="${R - 2.4}" fill="none" stroke="${ST}" stroke-width=".6"/>`;
  let fach = "", sp = "";
  for (let i = 0; i < 60; i++) {
    const a = i / 60 * Math.PI * 2, b = (i + 0.5) / 60 * Math.PI * 2;
    fach += `M${r(CX + Math.cos(a) * R)} ${r(CY + Math.sin(a) * R)} L${r(CX + Math.cos(b) * (R - 2.4))} ${r(CY + Math.sin(b) * (R - 2.4))} `;
  }
  for (let i = 0; i < 40; i++) {
    const a = i / 40 * Math.PI * 2, t = (i % 2 ? 1 : -1) * 0.1;
    sp += `M${r(CX + Math.cos(a + t + Math.PI / 2) * 2)} ${r(CY + Math.sin(a + t + Math.PI / 2) * 2)} L${r(CX + Math.cos(a) * (R - 2.4))} ${r(CY + Math.sin(a) * (R - 2.4))} `;
  }
  k += `<path d="${fach}" stroke="${ST}" stroke-width=".25" fill="none"/><path d="${sp}" stroke="${ST}" stroke-width=".16" fill="none" opacity=".85"/>`;
  k += `<circle cx="${CX}" cy="${CY}" r="2.4" fill="${ST}"/><circle cx="${CX}" cy="${CY}" r="1" fill="#8a7f78"/>`;
  /* 15 rote Waggons, außen an der Felge aufgehängt */
  const wag = [];
  for (let i = 0; i < 15; i++) {
    const a = -Math.PI / 2 + i / 15 * Math.PI * 2, ax = CX + Math.cos(a) * R, ay = CY + Math.sin(a) * R;
    k += `<line x1="${r(ax)}" y1="${r(ay)}" x2="${r(ax)}" y2="${r(ay + 0.9)}" stroke="${ST}" stroke-width=".3"/>`;
    k += `<rect x="${r(ax - 2.5)}" y="${r(ay + 0.9)}" width="5" height="2.5" rx=".3" fill="${S.lg("waggon", [[0, "#cc372f"], [1, "#901f1c"]])}"/>`;
    k += `<path d="M${r(ax - 2.8)} ${r(ay + 1)} L${r(ax - 2.3)} ${r(ay + 0.4)} L${r(ax + 2.3)} ${r(ay + 0.4)} L${r(ax + 2.8)} ${r(ay + 1)} Z" fill="#efe9dd"/>`;
    k += `<rect x="${r(ax - 2)}" y="${r(ay + 1.4)}" width="4" height="1" fill="#f3efe4"/><path d="M${r(ax - 0.7)} ${r(ay + 1.4)} v1 M${r(ax + 0.7)} ${r(ay + 1.4)} v1" stroke="#901f1c" stroke-width=".25"/>`;
    wag.push([ax, ay]);
  }
  /* vordere Gitterpyramide: genietete Fachwerkbeine von der Nabe zum Boden */
  for (const sx of [-1, 1]) {
    const fx = CX + sx * 20;
    k += `<path d="M${CX} ${CY} L${fx} ${FU} M${r(CX + sx * 1.2)} ${r(CY + 1.6)} L${r(fx - sx * 5)} ${FU}" stroke="${ST}" stroke-width=".8"/>`;
    let z = "";
    for (let t = 0.1; t < 0.98; t += 0.1) {
      const xa = CX + (fx - CX) * t, ya = CY + (FU - CY) * t, xb = CX + sx * 1.2 + (fx - sx * 5 - CX - sx * 1.2) * (t + 0.05), yb = CY + 1.6 + (FU - CY - 1.6) * (t + 0.05);
      z += `M${r(xa)} ${r(ya)} L${r(xb)} ${r(yb)} `;
    }
    k += `<path d="${z}" stroke="${ST}" stroke-width=".28" fill="none"/>`;
  }
  /* Stationsgebäude am Fuß */
  k += `<rect x="${CX - 9}" y="${FU - 4.2}" width="18" height="4.2" fill="#d9cdb8"/><path d="M${CX - 10} ${FU - 4.2} L${CX} ${FU - 6.6} L${CX + 10} ${FU - 4.2} Z" fill="#8a4a3a"/>`;
  for (let i = 0; i < 5; i++) k += `<rect x="${CX - 7.6 + i * 3.4}" y="${FU - 3.2}" width="1.8" height="2" fill="#4f5a62"/>`;
  /* Prater-Bäume verdecken das untere Viertel */
  for (let i = 0; i < 22; i++) { const x = 338 + rnd() * 62, yy = 134 + rnd() * 8; k += `<circle cx="${r(x)}" cy="${r(yy)}" r="${r(2.6 + rnd() * 2.6)}" fill="${rnd() < 0.5 ? "#6f8f55" : "#5a7a48"}"/>`; }
  const [wx, wy] = wag[3];
  S.teil({ id: "riesenrad", de: "das Riesenrad", syl: "RIE-sen-rad", it: "la ruota panoramica", itSyl: "RUO-ta pa-no-RA-mi-ca", en: "Ferris wheel", x: 0, y: 0, kunst: VED(`<g ${MITTEL}>${k}</g>`, 371, 1.12, -1),
    tipp: "Das Riesenrad im Prater dreht sich seit 1897. Es ist fast 65 Meter hoch.",
    zoom: VZ({ x: 336, y: 84, w: 62, h: 42 }, 371, 1.12, -1),
    unter: [
      { id: "waggon", de: "der Waggon", syl: "wag-GON", it: "la cabina", itSyl: "ca-BI-na", en: "cabin", x: r(wx), y: r(wy + 3.4), kunst: flaeche(-3.2, -3.4, 6.4, 3.6, 0.4),
        tipp: "Ein Waggon ist wie ein kleines rotes Zugabteil. Darin haben viele Menschen Platz." },
    ].map((u) => VU(u, 371, 1.12, -1)) });
}

/* =====================================================================
   7 — DIE ALTSTADT: Dächerband vor den Sockeln der Wahrzeichen
   ===================================================================== */
{
  let k = "";
  const hausreihe = (xa, xb, hoch, tief) => {
    let g = "", xx = xa;
    while (xx < xb) {
      const w = 6 + rnd() * 8, h = hoch + rnd() * (tief - hoch), y0 = 143.6;
      const top = y0 - h;
      const fas = ["#eadfc8", "#e3d3b2", "#efe7d6", "#dccba8", "#e9dac2", "#e6d6cf"][Math.floor(rnd() * 6)];
      g += `<rect x="${r(xx)}" y="${r(top)}" width="${r(w + 0.2)}" height="${r(h)}" fill="${fas}"/>`;
      for (let fy = top + 1.4; fy < y0 - 1; fy += 2.6) for (let fx = xx + 0.9; fx < xx + w - 0.6; fx += 1.9) g += `<rect x="${r(fx)}" y="${r(fy)}" width=".8" height="1.2" fill="#857d70"/>`;
      const dach = rnd() < 0.12 ? KUPFER : (rnd() < 0.5 ? "#a8553e" : "#93503f");
      const dh = 2 + rnd() * 1.4;
      g += `<path d="M${r(xx - 0.3)} ${r(top)} L${r(xx + 1.6)} ${r(top - dh)} L${r(xx + w - 1.6)} ${r(top - dh)} L${r(xx + w + 0.3)} ${r(top)} Z" fill="${dach}"/>`;
      if (rnd() < 0.5) g += `<path d="M${r(xx + w * 0.3)} ${r(top - 0.4)} l.7 -1.2 l.7 1.2 Z" fill="#e9e1d2"/>`;
      if (rnd() < 0.6) g += `<rect x="${r(xx + w * 0.7)}" y="${r(top - dh - 1.6)}" width=".9" height="2" fill="#8a4a3a"/>`;
      xx += w;
    }
    return g;
  };
  /* vor dem fernen Schönbrunn keine Häuser (eigenes Bild), vor der Hofburg
     der offene Michaelerplatz */
  k += hausreihe(151, 166, 5, 8) + hausreihe(194, 210, 6, 10) + hausreihe(210, 262, 7, 11) + hausreihe(262, 336, 6, 10) + hausreihe(336, 400, 3, 6);
  k += `<rect x="166" y="141" width="28" height="2.6" fill="#d8d0c2"/>`;
  /* Ecktürmchen mit grüner Haube */
  for (const [tx, th] of [[236, 15], [322, 14]]) k += `<rect x="${tx - 1.6}" y="${143.6 - th}" width="3.2" height="${th}" fill="#e7dcc6"/><path d="M${tx - 2} ${143.6 - th} Q${tx - 2} ${139.6 - th} ${tx} ${138.6 - th} Q${tx + 2} ${139.6 - th} ${tx + 2} ${143.6 - th} Z" fill="${KUPFER}"/><line x1="${tx}" y1="${138.6 - th}" x2="${tx}" y2="${136.8 - th}" stroke="#4a8670" stroke-width=".3"/>`;
  S.teil({ id: "altstadt", de: "die Altstadt", syl: "ALT-stadt", it: "il centro storico", itSyl: "CEN-tro STO-ri-co", en: "old town", x: 0, y: 0, kunst: VED(`<g ${MITTEL}>${k}</g>`, 200, 1),
    tipp: "Wiens Altstadt ist Welterbe. Dieses Bild ist eine Vedute – ein gemaltes Stadtbild: In Wirklichkeit liegen die Wahrzeichen weiter auseinander." });
}

/* =====================================================================
   8 — DIE ALLEE der Ringstraße: Parkrand, Bäume, Kandelaber, Fahrleitung
   ===================================================================== */
const OBER = { x: 34, d: 3.0 };
{
  let k = "";
  /* Parkrasen, Hecke und Eisenzaun am Ring */
  k += `<rect x="0" y="141.6" width="400" height="3.2" fill="${S.lg("rasen", [[0, "#7f9e60"], [1, "#6a8a4e"]])}"/>`;
  for (let i = 0; i < 80; i++) k += `<ellipse cx="${r(rnd() * 400)}" cy="${r(142.4 + rnd() * 1.6)}" rx="${r(1.4 + rnd() * 1.6)}" ry="1" fill="${rnd() < 0.5 ? "#6f9055" : "#5a7a46"}"/>`;
  k += `<rect x="0" y="143.9" width="400" height=".35" fill="#2f3532"/>`;
  for (let x = 2; x < 400; x += 3) k += `<rect x="${x}" y="143" width=".3" height="1.6" fill="#2f3532"/>`;
  /* Platanen der Allee (in ≈ 80 m: 2 E/m), nur zwischen den Wahrzeichen */
  const baum = (bx, h, b) => {
    let g = `<path d="M${r(bx - 0.6)} 144 L${r(bx - 0.4)} ${r(144 - h * 0.45)} L${r(bx + 0.4)} ${r(144 - h * 0.45)} L${r(bx + 0.6)} 144 Z" fill="#7a7266"/>`;
    for (let i = 0; i < 14; i++) {
      const a = rnd() * Math.PI * 2, rr = rnd() * 0.42;
      g += `<circle cx="${r(bx + Math.cos(a) * b * rr)}" cy="${r(144 - h * 0.68 + Math.sin(a) * h * 0.22 * rr * 2)}" r="${r(b * (0.22 + rnd() * 0.12))}" fill="${["#5f8146", "#6f9152", "#4f7040"][i % 3]}"/>`;
    }
    for (let i = 0; i < 5; i++) g += `<circle cx="${r(bx - b * 0.25 + rnd() * b * 0.3)}" cy="${r(144 - h * 0.8 + rnd() * h * 0.2)}" r="${r(b * 0.14)}" fill="#86a865" opacity=".8"/>`;
    return g;
  };
  k += baum(144, 34, 14) + baum(28, 30, 16) + baum(339, 28, 9);
  /* kleine Spaziergänger im Park (in ≈ 100 m) */
  for (const [px, c] of [[156, "#b33a3a"], [161, "#2f4f7a"], [200, "#e8dcc0"], [232, "#3c5a2f"], [300, "#7a3b6b"], [306, "#2d2f3a"]]) k += `<rect x="${px}" y="139.8" width=".7" height="2.6" rx=".3" fill="${c}"/><circle cx="${px + 0.35}" cy="139.3" r=".42" fill="#d9b49a"/>`;
  /* Kandelaber am fernen Gehsteig (in 36 m) */
  for (const lx of [150, 209]) k += `<rect x="${lx - 0.3}" y="122.4" width=".6" height="24" fill="#3a3d3e"/><path d="M${lx - 3} 123.4 Q${lx} 120.8 ${lx + 3} 123.4" stroke="#3a3d3e" stroke-width=".4" fill="none"/>` +
    `<path d="M${lx - 3.6} 123.4 l1.2 0 l.3 1.8 l-1.8 0 Z M${lx + 2.4} 123.4 l1.2 0 l.3 1.8 l-1.8 0 Z" fill="#f4ecd0" stroke="#3a3d3e" stroke-width=".2"/><rect x="${lx - 0.8}" y="145.6" width="1.6" height=".8" fill="#3a3d3e"/>`;
  /* Fahrleitung über beiden Gleisen (6 m hoch) und der linke Mittelmast (in 28 m) */
  const draht = (yy, sag) => `<path d="M0 ${r(yy + sag * 0.3)} Q72 ${r(yy + sag)} 144 ${yy} Q236 ${r(yy + sag)} 328 ${yy} Q364 ${r(yy + sag * 0.4)} 400 ${r(yy + sag * 0.3)}" stroke="#2b2b2b" stroke-width=".28" fill="none" opacity=".75"/>`;
  k += draht(r(HOR0 - 4.45 * F / 26), 0.8) + draht(r(HOR0 - 4.45 * F / 30), 0.7);
  const mast = (mx) => `<path d="M${mx - 0.7} ${ys0(28)} L${mx - 0.45} ${r(HOR0 - 6.45 * F / 28)} L${mx + 0.45} ${r(HOR0 - 6.45 * F / 28)} L${mx + 0.7} ${ys0(28)} Z" fill="${S.lg("mast", [[0, "#9aa0a3"], [1, "#6b7174"]], 0, 0, 1, 0)}"/>` +
    `<path d="M${mx} ${r(HOR0 - 5.45 * F / 28)} L${mx} ${r(HOR0 - 4.45 * F / 26)} M${mx} ${r(HOR0 - 5.45 * F / 28)} L${mx} ${r(HOR0 - 4.45 * F / 30)} M${mx - 1.6} ${r(HOR0 - 5.45 * F / 28)} L${mx + 1.6} ${r(HOR0 - 5.45 * F / 28)}" stroke="#4b4f52" stroke-width=".35"/>`;
  k += mast(144) + mast(328);
  S.teil({ id: "allee", de: "die Allee", syl: "al-LEE", it: "il viale alberato", itSyl: "vi-A-le al-be-RA-to", en: "avenue", x: 0, y: 0, kunst: VED(k, 200, 1),
    tipp: "Die Ringstraße ist eine breite Allee rund um die Altstadt – mit Bäumen, Parks und Straßenbahnen." });
}

/* =====================================================================
   9 — DIE STRASSENBAHN (Linie D) auf dem fernen Gleis (30 m), Haltestelle
   ===================================================================== */
{
  const d = 30, s = F / d, Y = ys(d), X0 = 330;
  const m = (v) => r(v * s);
  const L = 400 - X0;
  let k = schlag(L / 2, 0.2, L, 6, 0.25);
  k += `<path d="M${m(0.5)} ${m(-0.25)} L${m(0.15)} ${m(-1.1)} Q${m(0.05)} ${m(-2.6)} ${m(0.9)} ${m(-3.1)} L${L} ${m(-3.1)} L${L} ${m(-0.25)} Z" fill="${S.lg("bim", [[0, "#da342d"], [1, "#a51f1c"]])}"/>`;
  k += `<path d="M${m(0.4)} ${m(-1.95)} Q${m(0.32)} ${m(-2.7)} ${m(0.95)} ${m(-2.95)} L${L} ${m(-2.95)} L${L} ${m(-1.6)} L${m(0.9)} ${m(-1.6)} Z" fill="#33424a"/>`;
  /* Fahrgäste hinter den Fenstern */
  for (let x = m(2.6), i = 0; x < L - 2; x += m(1.25), i++) if (i % 3 !== 2) k += `<path d="M${r(x - 1.2)} ${m(-1.6)} Q${r(x - 1.2)} ${m(-2.15)} ${r(x)} ${m(-2.2)} Q${r(x + 1.2)} ${m(-2.15)} ${r(x + 1.2)} ${m(-1.6)} Z" fill="#1f2a30"/><circle cx="${r(x)}" cy="${m(-2.45)}" r="${m(0.13)}" fill="#1f2a30"/>`;
  k += `<path d="M${m(1)} ${m(-2.9)} L${m(1.6)} ${m(-2.9)} L${m(1.1)} ${m(-1.7)} L${m(0.6)} ${m(-1.7)} Z" fill="#fff" opacity=".12"/>`;
  k += `<rect x="${m(0.9)}" y="${m(-1.6)}" width="${L - m(0.9)}" height="${m(0.14)}" fill="#f2efe8"/>`;
  k += `<path d="M${m(0.9)} ${m(-3.1)} Q${m(0.6)} ${m(-3.3)} ${m(1.4)} ${m(-3.4)} L${L} ${m(-3.4)} L${L} ${m(-3.1)} Z" fill="#cfd2d2"/>`;
  for (let x = m(2.4); x < L; x += m(1.6)) k += `<rect x="${r(x)}" y="${m(-2.95)}" width="${m(0.12)}" height="${m(1.35)}" fill="#a51f1c"/>`;
  for (const x of [m(3.4), m(11.2)]) if (x < L - 4) k += `<rect x="${r(x)}" y="${m(-2.9)}" width="${m(1.3)}" height="${m(2.6)}" fill="#3a464c" stroke="#e9e6df" stroke-width=".35"/><line x1="${r(x + m(0.65))}" y1="${m(-2.9)}" x2="${r(x + m(0.65))}" y2="${m(-0.3)}" stroke="#e9e6df" stroke-width=".3"/>`;
  k += `<rect x="${m(0.35)}" y="${m(-3.08)}" width="${m(2.3)}" height="${m(0.36)}" fill="#151515"/>`;
  k += `<text x="${m(0.45)}" y="${m(-2.79)}" font-size="${m(0.28)}" fill="#ffb428" font-family="Arial,sans-serif" font-weight="bold">D  Nußdorf</text>`;
  k += `<path d="M${m(0.5)} ${m(-0.25)} L${m(0.3)} ${m(-0.7)} L${m(1.6)} ${m(-0.7)} L${m(1.6)} ${m(-0.25)} Z" fill="#7a1512"/>`;
  k += `<circle cx="${m(0.4)}" cy="${m(-0.95)}" r="${m(0.1)}" fill="#fffbe8"/>`;
  /* Einholm-Stromabnehmer bis an den Fahrdraht */
  k += `<rect x="${m(3.6)}" y="${m(-3.6)}" width="${m(1.2)}" height="${m(0.2)}" fill="#8d9296"/><path d="M${m(3.8)} ${m(-3.6)} L${m(5.0)} ${m(-4.8)} L${m(4.3)} ${m(-6.0)}" stroke="#3a3a3a" stroke-width=".5" fill="none" stroke-linejoin="round"/><rect x="${m(3.8)}" y="${m(-6.08)}" width="${m(1)}" height="${m(0.08)}" fill="#3a3a3a"/>`;
  /* Haltestelle: Mast mit rot-weißem Schild, zwei Wartende */
  k += `<rect x="-7.4" y="${m(-2.6)}" width=".5" height="${m(2.6)}" fill="#55595c"/><rect x="-8.8" y="${m(-2.9)}" width="3.3" height="2.4" rx=".3" fill="#c8302a"/><rect x="-8.3" y="${r(m(-2.9) + 0.4)}" width="2.3" height="1.6" fill="#fff"/><text x="-7.15" y="${r(m(-2.9) + 1.75)}" font-size="1.6" text-anchor="middle" fill="#c8302a" font-family="Arial,sans-serif" font-weight="bold">H</text>`;
  S.teil({ id: "strassenbahn", de: "die Straßenbahn", syl: "STRA-ßen-bahn", it: "il tram", itSyl: "TRAM", en: "tram", x: X0, y: Y, kunst: k,
    tipp: "Die Wiener sagen zur Straßenbahn „Bim“ – wegen der Klingel. Die Linie D fährt über die Ringstraße nach Nußdorf." });
}

/* =====================================================================
   10 — DER FIAKER (zwei Pferde, schwarze Kutsche) in 12 m
        Lupe: Pferd, Kutscher, Melone
   ===================================================================== */
{
  const d = 14, s = F / d, Y = ys(d), X0 = 272;
  const m = (v) => r(v * s);
  const P = (x, yy) => `${m(x)} ${m(yy)}`;
  let k = schlag(m(0.2), 0.3, m(7), m(2.2), 0.3);
  const pferd = (bx, dy, fell, dunkel, maehne) => {
    const q = (x, yy) => P(bx + x, yy + dy);
    let g = "";
    g += `<path d="M${q(-0.62, -1.05)} L${q(-0.66, -0.12)} L${q(-0.56, -0.12)} L${q(-0.52, -1.05)} Z" fill="${dunkel}"/>`;
    g += `<path d="M${q(-0.42, -1.05)} Q${q(-0.5, -0.6)} ${q(-0.62, -0.46)} L${q(-0.7, -0.3)} L${q(-0.6, -0.26)} L${q(-0.5, -0.44)} Q${q(-0.38, -0.6)} ${q(-0.32, -1.05)} Z" fill="${fell}"/>`;
    g += `<path d="M${q(0.5, -1.1)} Q${q(0.66, -0.6)} ${q(0.58, -0.48)} L${q(0.56, -0.12)} L${q(0.66, -0.12)} L${q(0.7, -0.5)} Q${q(0.78, -0.7)} ${q(0.68, -1.1)} Z" fill="${dunkel}"/>`;
    g += `<path d="M${q(0.7, -1.15)} Q${q(0.92, -0.62)} ${q(0.8, -0.5)} L${q(0.78, -0.12)} L${q(0.9, -0.12)} L${q(0.92, -0.52)} Q${q(1.02, -0.72)} ${q(0.9, -1.2)} Z" fill="${fell}"/>`;
    for (const x of [-0.61, 0.61, 0.84]) g += `<rect x="${m(bx + x - 0.06)}" y="${m(dy - 0.12)}" width="${m(0.13)}" height="${m(0.1)}" fill="#1d1a18"/>`;
    g += `<path d="M${q(-0.7, -0.32)} l${m(-0.05)} ${m(0.08)} l${m(0.11)} ${m(0.04)} Z" fill="#1d1a18"/>`;
    g += `<path d="M${q(-0.78, -1.32)} Q${q(-0.82, -1.66)} ${q(-0.48, -1.62)} Q${q(0.2, -1.52)} ${q(0.66, -1.6)} Q${q(1.04, -1.58)} ${q(1.02, -1.26)} Q${q(1, -1.02)} ${q(0.72, -1.02)} Q${q(0.1, -0.98)} ${q(-0.5, -1.02)} Q${q(-0.76, -1.06)} ${q(-0.78, -1.32)} Z" fill="${fell}"/>`;
    g += `<path d="M${q(-0.46, -1.6)} Q${q(-0.86, -2.02)} ${q(-1.06, -2.24)} L${q(-1.24, -2.06)} Q${q(-1, -1.62)} ${q(-0.86, -1.22)} Z" fill="${fell}"/>`;
    g += `<path d="M${q(-1.02, -2.28)} Q${q(-1.2, -2.32)} ${q(-1.3, -2.18)} L${q(-1.58, -1.86)} Q${q(-1.64, -1.74)} ${q(-1.54, -1.7)} L${q(-1.42, -1.72)} Q${q(-1.3, -1.92)} ${q(-1.18, -2)} Z" fill="${fell}"/>`;
    g += `<path d="M${q(-1.06, -2.28)} l${m(0.02)} ${m(-0.16)} l${m(0.08)} ${m(0.14)} Z" fill="${dunkel}"/>`;
    g += `<path d="M${q(-0.44, -1.62)} Q${q(-0.82, -2.06)} ${q(-1.04, -2.3)} Q${q(-0.78, -2.12)} ${q(-0.38, -1.7)} Z" fill="${maehne}"/>`;
    g += `<path d="M${q(1, -1.46)} Q${q(1.18, -1.1)} ${q(1.06, -0.62)} Q${q(0.98, -0.98)} ${q(0.94, -1.36)} Z" fill="${maehne}"/>`;
    g += `<circle cx="${m(bx - 1.3)}" cy="${m(dy - 2.08)}" r="${m(0.03)}" fill="#111"/>`;
    g += `<path d="M${q(-0.62, -1.66)} Q${q(-0.86, -1.5)} ${q(-0.82, -1.18)}" stroke="#151313" stroke-width="${m(0.12)}" fill="none"/>`;
    g += `<path d="M${q(-0.1, -1.6)} L${q(-0.1, -1.0)}" stroke="#151313" stroke-width="${m(0.1)}"/><path d="M${q(-0.82, -1.3)} L${q(0.9, -1.3)}" stroke="#151313" stroke-width="${m(0.05)}"/>`;
    g += `<path d="M${q(-1.22, -2.12)} l${m(-0.14)} ${m(0.08)}" stroke="#151313" stroke-width="${m(0.07)}"/><path d="M${q(-1.2, -2.02)} L${q(-1.5, -1.76)}" stroke="#151313" stroke-width="${m(0.03)}"/>`;
    g += `<circle cx="${m(bx - 0.1)}" cy="${m(dy - 1.6)}" r="${m(0.05)}" fill="${GOLD}"/>`;
    return g;
  };
  const PB = -2.1;
  k += pferd(PB - 0.18, -0.06, "#6b4228", "#4a2c1a", "#2a1a10");
  k += pferd(PB, 0, S.lg("schimmel", [[0, "#f2f0ea"], [1, "#c9c6be"]]), "#b8b4aa", "#e9e6de");
  k += `<path d="M${P(-0.4, -0.95)} L${P(PB - 0.7, -1.25)}" stroke="#1b1b1b" stroke-width="${m(0.06)}"/>`;
  const rad = (cx, cy, rr) => {
    let g = `<circle cx="${m(cx)}" cy="${m(cy)}" r="${m(rr)}" fill="none" stroke="#151515" stroke-width="${m(0.07)}"/>`;
    let sp = "";
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; sp += `M${m(cx)} ${m(cy)} L${r(m(cx) + Math.cos(a) * m(rr))} ${r(m(cy) + Math.sin(a) * m(rr))} `; }
    return g + `<path d="${sp}" stroke="#a3262a" stroke-width="${m(0.035)}"/><circle cx="${m(cx)}" cy="${m(cy)}" r="${m(0.08)}" fill="#151515"/>`;
  };
  k += rad(0.35, -0.45, 0.45) + rad(2.35, -0.6, 0.6);
  /* zurückgeklapptes Verdeck hinter den Fahrgästen */
  k += `<path d="M${P(2.35, -1.42)} Q${P(2.45, -2.14)} ${P(3.02, -2.1)} Q${P(3.22, -1.72)} ${P(3.04, -1.42)} Z" fill="#1b1b1d"/><path d="M${P(2.5, -1.6)} Q${P(2.65, -1.98)} ${P(2.97, -2)} M${P(2.6, -1.5)} Q${P(2.75, -1.86)} ${P(3.04, -1.86)}" stroke="#3c3c42" stroke-width=".3" fill="none"/>`;
  /* zwei Fahrgäste auf der Rückbank (Beine verdeckt der Wagenkasten) */
  const sitzen = Object.assign({}, M0.POSEN.sitzen, { schulterL: { vor: 20, seit: 8 }, ellbogenL: 70, unterarmL: -40, schulterR: { vor: 18, seit: 8 }, ellbogenR: 70, unterarmR: -40 });
  const gast = (spec, h, sx) => {
    const g = B.mensch(Object.assign({ pose: sitzen, blick: -70, haut: "hell" }, spec), h);
    const ox = r(m(sx) - g.z.sitz.x * g.k), oy = r(m(-1.46) - g.z.sitz.y * g.k);
    return `<g transform="translate(${ox} ${oy})">${kompakt(g.svg)}</g>`;
  };
  k += gast({ id: "wie_gm", geschlecht: "m", frisur: "kurz", haarfarbe: "dunkelbraun", kleidung: { oberteil: { stueck: "hemd", farbe: "hellblau" }, unterteil: { stueck: "hose", farbe: "beige" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, m(1.78), 2.3);
  k += gast({ id: "wie_gw", geschlecht: "w", frisur: "lang", haarfarbe: "blond", kleidung: { oberteil: { stueck: "bluse", farbe: "rosa" }, unterteil: { stueck: "rock", farbe: "beige" }, schuhe: { stueck: "halbschuh", farbe: "braun" }, kopf: { stueck: "hut", farbe: "#e8dcc0" } } }, m(1.66), 2.12);
  /* Wagenkasten (schwarz lackiert), rotes Polster, Bock, Laterne, Peitsche */
  k += `<path d="M${P(-0.1, -0.9)} Q${P(0.6, -0.72)} ${P(1.1, -0.86)} L${P(2.9, -0.86)} Q${P(3.05, -1.3)} ${P(2.8, -1.42)} L${P(1.1, -1.42)} Q${P(0.7, -1.2)} ${P(0.5, -1.0)} L${P(-0.1, -1.0)} Z" fill="${S.lg("lack", [[0, "#3c3c42"], [0.4, "#141416"], [1, "#050506"]])}"/>`;
  k += `<path d="M${P(1.2, -1.36)} L${P(2.8, -1.36)}" stroke="#d9a92e" stroke-width=".25"/>`;
  k += `<path d="M${P(0.0, -1.0)} L${P(0.15, -1.55)} L${P(0.75, -1.55)} L${P(0.6, -1.0)}" fill="none" stroke="#141416" stroke-width="${m(0.06)}"/><rect x="${m(0.12)}" y="${m(-1.66)}" width="${m(0.66)}" height="${m(0.12)}" rx=".4" fill="#7a1a26"/>`;
  k += `<path d="M${P(-0.12, -1.0)} L${P(-0.2, -1.3)}" stroke="#141416" stroke-width="${m(0.05)}"/>`;
  k += `<rect x="${m(0.9)}" y="${m(-1.62)}" width="${m(0.1)}" height="${m(0.2)}" fill="${GOLD}"/><circle cx="${m(0.95)}" cy="${m(-1.66)}" r="${m(0.05)}" fill="#fff6c8"/>`;
  k += `<path d="M${P(0.72, -1.55)} L${P(0.9, -2.7)} Q${P(1.2, -2.9)} ${P(1.5, -2.6)}" stroke="#2a2a2a" stroke-width=".3" fill="none"/>`;
  /* der Kutscher mit Melone auf dem Bock */
  const pose = Object.assign({}, M0.POSEN.sitzen, { schulterL: { vor: 40, seit: 10, dreh: -10 }, ellbogenL: 60, unterarmL: 30, handL: 0, fingerL: 0.75,
    schulterR: { vor: 35, seit: 14, dreh: -10 }, ellbogenR: 70, unterarmR: 30, handR: 0, fingerR: 0.75 });
  const kut = B.mensch({ id: "wie_kut", geschlecht: "m", pose, blick: -80, frisur: "kurz", haarfarbe: "grau", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "jacke", farbe: "#26262c" }, unterteil: { stueck: "anzughose" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, kopf: { stueck: "melone" } } }, m(1.76));
  const sitz = { x: m(0.45), y: m(-1.66) };
  const kx = r(sitz.x - kut.z.sitz.x * kut.k), ky = r(sitz.y - kut.z.sitz.y * kut.k);
  k += `<g transform="translate(${kx} ${ky})">${kompakt(kut.svg)}</g>`;
  const hand = { x: kx + kut.z.handL.x * kut.k, y: ky + kut.z.handL.y * kut.k };
  k += `<path d="M${r(hand.x)} ${r(hand.y)} Q${m(-1)} ${m(-1.9)} ${m(PB - 1.42)} ${m(-1.84)} M${r(hand.x)} ${r(hand.y + 0.3)} Q${m(-1)} ${m(-1.8)} ${m(PB - 1.6)} ${m(-1.8)}" stroke="#2b1d12" stroke-width=".22" fill="none"/>`;
  const kopf = { x: kx + kut.z.kopf.x * kut.k, y: ky + kut.z.kopf.y * kut.k };
  S.teil({ id: "fiaker", de: "der Fiaker", syl: "fi-A-ker", it: "la carrozza", itSyl: "car-ROZ-za", en: "horse-drawn carriage", x: X0, y: Y, kunst: k,
    tipp: "Ein Fiaker ist eine Kutsche mit zwei Pferden. Gäste fahren damit gemütlich durch die Altstadt.",
    zoom: { x: X0 - 52, y: Y - 44, w: 96, h: 48 },
    unter: [
      { id: "pferd", de: "das Pferd", syl: "PFERD", it: "il cavallo", itSyl: "ca-VAL-lo", en: "horse", x: X0 + m(PB), y: Y - m(1.0), kunst: flaeche(-m(1.7), -m(1.4), m(2.8), m(1.3), 0.6),
        tipp: "Fiaker-Pferde dürfen nur an bestimmten Tagen arbeiten und machen oft Pause." },
      { id: "kutscher", de: "der Kutscher", syl: "KUT-scher", it: "il cocchiere", itSyl: "coc-CHIE-re", en: "coachman", x: r(X0 + sitz.x), y: r(Y + sitz.y), kunst: flaeche(-m(0.5), -m(0.75), m(1), m(0.85), 0.6),
        tipp: "Der Kutscher erzählt seinen Fahrgästen viel über Wien." },
      { id: "melone", de: "die Melone", syl: "me-LO-ne", it: "la bombetta", itSyl: "bom-BET-ta", en: "bowler hat", x: r(X0 + kopf.x), y: r(Y + kopf.y - 1.2), kunst: flaeche(-3.2, -3, 6.4, 4.2, 0.4),
        tipp: "Im Dienst trägt der Fiaker-Kutscher eine Melone – einen runden, schwarzen Hut." },
    ] });
}

/* =====================================================================
   11 — DER SCHANIGARTEN: Holzpodest mit Geranienkästen
   ===================================================================== */
const PODEST = yp(3.6);
{
  let k = `<rect x="0" y="${PODEST}" width="400" height="${r(260 - PODEST)}" fill="${S.lg("podest", [[0, "#a77a4c"], [1, "#7d5634"]])}"/>`;
  for (let i = -14; i <= 14; i++) {
    const xa = 200 + i * 14.4, xb = 200 + i * 28, xe = Math.max(0, Math.min(400, xb)), ye = i === 0 ? 260 : r(PODEST + (260 - PODEST) * (xe - xa) / (xb - xa));
    if (xa > 0 && xa < 400) k += `<line x1="${r(xa)}" y1="${PODEST}" x2="${r(xe)}" y2="${ye}" stroke="#5f3f22" stroke-width=".4" opacity=".7"/>`;
  }
  for (const yy of [PODEST + 3, PODEST + 7.4, PODEST + 13.6, PODEST + 23, PODEST + 38]) k += `<line x1="0" y1="${yy}" x2="400" y2="${yy}" stroke="#6a4728" stroke-width=".25" opacity=".5"/>`;
  k += `<rect x="0" y="${PODEST - 0.6}" width="400" height="1.6" fill="#c49a68"/>`;
  k += `<path d="M0 250 Q100 246 200 248.4 Q300 251 400 247 L400 260 L0 260 Z" fill="#2a1a0c" opacity=".2"/>`;
  /* Geranienkasten an der Kante: Kastenprofil mit Lippe und Füßchen; darin
     Geranien (eine Pflanze, mehrmals gesetzt): gelappte Blätter mit dunkler
     Zone, kugelige Dolden aus vielen Einzelblüten */
  {
    let pf = "";
    for (const [x, y, rr, f] of [[-4.4, -1.4, 2.6, "#3f7a34"], [3.8, -1.2, 2.4, "#4f8a3e"], [-1, -2.8, 2.8, "#5a9444"], [5.6, -3.4, 2, "#3f7a34"], [-5.8, -3.6, 2, "#4f8a3e"], [1.6, -.2, 2.2, "#467f38"]]) {
      pf += `<path d="M${r(x - rr)} ${r(y)} Q${r(x - rr)} ${r(y - rr)} ${r(x - rr * 0.3)} ${r(y - rr * 0.9)} Q${x} ${r(y - rr * 1.2)} ${r(x + rr * 0.3)} ${r(y - rr * 0.9)} Q${r(x + rr)} ${r(y - rr)} ${r(x + rr)} ${r(y)} Q${x} ${r(y + rr * 0.8)} ${r(x - rr)} ${r(y)} Z" fill="${f}"/>`;
      pf += `<path d="M${r(x - rr * 0.55)} ${r(y - rr * 0.35)} Q${x} ${r(y - rr * 0.75)} ${r(x + rr * 0.55)} ${r(y - rr * 0.35)}" stroke="#2c5a26" stroke-width=".45" fill="none" opacity=".6"/>`;
    }
    for (const [x, y] of [[-2.6, -7], [3.2, -6.2]]) {
      pf += `<path d="M${x} ${y + 1.4} L${r(x + 0.2)} ${y + 4.4}" stroke="#3f6a2c" stroke-width=".35"/>`;
      for (let j = 0; j < 11; j++) { const a = j * 2.4, rr = 0.4 + (j % 4) * 0.42; pf += `<circle cx="${r(x + Math.cos(a) * rr)}" cy="${r(y + Math.sin(a) * rr * 0.85)}" r=".62" fill="${["#d8323a", "#e84a52", "#c2272f", "#f0646c"][j % 4]}"/>`; }
    }
    S.def(`<g id="${S.id("geranie")}">${pf}</g>`);
  }
  const kasten = (x0, x1) => {
    const top = r(PODEST - 0.42 * F / 3.6);
    let g = schlag((x0 + x1) / 2, PODEST + 0.4, x1 - x0, 5, 0.25);
    g += `<path d="M${x0 + 1} ${PODEST} L${x0} ${top + 1.6} L${x1} ${top + 1.6} L${x1 - 1} ${PODEST} Z" fill="${S.lg("kasten", [[0, "#4a6a44"], [1, "#2c4128"]])}"/>`;
    g += `<rect x="${x0 - 0.8}" y="${top}" width="${x1 - x0 + 1.6}" height="2" rx=".5" fill="#5e8257"/><rect x="${x0 - 0.8}" y="${top}" width="${x1 - x0 + 1.6}" height=".6" fill="#7aa070"/>`;
    for (let x = x0 + 5; x < x1 - 3; x += 9) g += `<rect x="${x}" y="${top + 4}" width="6" height="${r(PODEST - top - 7)}" rx=".6" fill="none" stroke="#2c4128" stroke-width=".4"/>`;
    for (const x of [x0 + 2, x1 - 4]) g += `<rect x="${x}" y="${PODEST - 0.6}" width="2" height="1" fill="#2c4128"/>`;
    for (let x = x0 + 5, i = 0; x < x1 - 3; x += 7.4, i++) g += `<use href="#${S.id("geranie")}" transform="translate(${r(x + (i % 2) * 1.2)} ${r(top + 0.6 - (i % 3) * 0.5)}) scale(${[1, 1.12, 0.94][i % 3]})"/>`;
    return g;
  };
  k += kasten(96, 196) + kasten(206, 252);
  /* ein zweiter Tisch (2,5 m) mit Thonet-Stuhl; darauf ein Einspänner im Glas */
  {
    const X = 150, sc = F / 2.5, m = (v) => r(v * sc), ty = r(HOR + 0.5 * sc), fuss = yp(2.5);
    const HOLZ = S.lg("bugholz2", [[0, "#6b4228"], [1, "#2f1b0e"]], 0, 0, 1, 0);
    const cs = F / 3.1, c = (v) => r(v * cs), cy = yp(3.1), cx = X + 14;
    k += `<path d="M${r(cx - c(0.16))} ${cy} L${r(cx - c(0.17))} ${r(cy - c(0.48))} Q${r(cx - c(0.2))} ${r(cy - c(0.86))} ${cx} ${r(cy - c(0.9))} Q${r(cx + c(0.2))} ${r(cy - c(0.86))} ${r(cx + c(0.17))} ${r(cy - c(0.48))} L${r(cx + c(0.16))} ${cy}" stroke="${HOLZ}" stroke-width="${c(0.026)}" fill="none"/>`;
    k += `<path d="M${r(cx - c(0.1))} ${r(cy - c(0.5))} Q${r(cx - c(0.13))} ${r(cy - c(0.76))} ${cx} ${r(cy - c(0.79))} Q${r(cx + c(0.13))} ${r(cy - c(0.76))} ${r(cx + c(0.1))} ${r(cy - c(0.5))}" stroke="${HOLZ}" stroke-width="${c(0.018)}" fill="none"/>`;
    k += `<ellipse cx="${cx}" cy="${r(cy - c(0.46))}" rx="${c(0.22)}" ry="${c(0.05)}" fill="${HOLZ}"/><ellipse cx="${cx}" cy="${r(cy - c(0.465))}" rx="${c(0.19)}" ry="${c(0.04)}" fill="#d9b97e"/>`;
    k += schlag(X, fuss, m(0.5), 10, 0.22);
    k += `<path d="M${X - 2} ${r(ty + 2)} L${X - 1.6} ${fuss} L${X + 1.6} ${fuss} L${X + 2} ${r(ty + 2)} Z" fill="#3a3a3c"/><ellipse cx="${X}" cy="${fuss}" rx="${m(0.18)}" ry="1.4" fill="#2a2a2c"/>`;
    k += `<path d="M${r(X - m(0.3))} ${ty} A${m(0.3)} ${m(0.06)} 0 0 0 ${r(X + m(0.3))} ${ty} L${r(X + m(0.3))} ${r(ty + 1.4)} A${m(0.3)} ${m(0.06)} 0 0 1 ${r(X - m(0.3))} ${r(ty + 1.4)} Z" fill="#b5ada0"/>`;
    k += `<ellipse cx="${X}" cy="${ty}" rx="${m(0.3)}" ry="${m(0.06)}" fill="${S.rg("marmor2", [[0, "#ffffff"], [1, "#ddd8cf"]], 0.4, 0.35, 0.8)}" stroke="#a9a196" stroke-width=".4"/>`;
    /* Einspänner: Mokka im Glas mit Henkel, Schlagobers-Haube; Zuckerstreuer */
    const gx = X - 4, gy = r(ty + 0.6);
    k += `<path d="M${gx - 2.6} ${gy} L${gx - 3} ${gy - 8} L${gx + 3} ${gy - 8} L${gx + 2.6} ${gy} Z" fill="#4a2a18" stroke="#d9e6ea" stroke-width=".35"/><path d="M${gx - 3} ${gy - 8} Q${gx - 3.2} ${gy - 11} ${gx} ${gy - 11.6} Q${gx + 3.2} ${gy - 11} ${gx + 3} ${gy - 8} Z" fill="#fbfaf6"/><path d="M${gx + 2.9} ${gy - 6.4} q2.2 .4 1.6 2.8" stroke="#d9e6ea" stroke-width=".6" fill="none"/>`;
    k += `<path d="M${X + 5} ${gy} L${X + 5.4} ${gy - 5} L${X + 8.6} ${gy - 5} L${X + 9} ${gy} Z" fill="#e8eef0" opacity=".9"/><path d="M${X + 5.4} ${gy - 5} Q${X + 7} ${gy - 7.4} ${X + 8.6} ${gy - 5} Z" fill="#c3c9ce"/>`;
  }
  S.teil({ id: "schanigarten", de: "der Schanigarten", syl: "SCHA-ni-gar-ten", it: "il dehors", itSyl: "de-HORS", en: "pavement café", x: 0, y: 0, kunst: k,
    tipp: "In Wien heißen die Tische vor dem Kaffeehaus „Schanigarten“. Rote Geranien blühen in den Kästen." });
}

/* =====================================================================
   12 — DER OBER (Weste, Fliege, Silbertablett) bringt die Bestellung
   ===================================================================== */
{
  const s = F / OBER.d, Y = yp(OBER.d);
  const o = B.mensch({ id: "wie_ober", geschlecht: "m", pose: "servieren", blick: 60, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "kellnerhemd" }, jacke: { stueck: "weste", farbe: "schwarz" }, unterteil: { stueck: "anzughose" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "tablett" } } }, r(1.78 * s));
  /* im Glas auf seinem Tablett ist Wasser */
  const svg = kompakt(o.svg).replace(/fill="#e8b84a" opacity=".85"/g, `fill="#d6e9ef" opacity=".7"`);
  S.teil({ id: "ober", de: "der Ober", syl: "O-ber", it: "il cameriere", itSyl: "ca-me-RIE-re", en: "waiter", x: OBER.x, y: Y, kunst: schlag(4, 0.4, 16, 14, 0.28) + svg,
    tipp: "In Wien ruft man im Kaffeehaus: „Herr Ober, bitte zahlen!“" });
}

/* =====================================================================
   13 — DER STUHL (Thonet Nr. 14) hinter dem Tisch, fürs Gegenüber
   14 — DER TISCH mit Lupe: Tablett, Melange, Glas Wasser, Sachertorte,
        Schlagobers, Wiener Schnitzel, Zitrone, Zeitung
   ===================================================================== */
{
  const d = 1.75, sc = F / d, X = 340, Y = yp(d);
  const m = (v) => r(v * sc);
  const HOLZ = S.lg("bugholz", [[0, "#6b4228"], [0.5, "#4a2c18"], [1, "#2f1b0e"]], 0, 0, 1, 0);
  const unten = r(259.5 - Y);   /* die Beine enden am Bildrand */
  let k = `<path d="M${m(-0.155)} ${unten} L${m(-0.17)} ${m(-0.48)} Q${m(-0.2)} ${m(-0.86)} 0 ${m(-0.9)} Q${m(0.2)} ${m(-0.86)} ${m(0.17)} ${m(-0.48)} L${m(0.155)} ${unten}" stroke="${HOLZ}" stroke-width="${m(0.026)}" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${m(-0.1)} ${m(-0.5)} Q${m(-0.13)} ${m(-0.76)} 0 ${m(-0.79)} Q${m(0.13)} ${m(-0.76)} ${m(0.1)} ${m(-0.5)}" stroke="${HOLZ}" stroke-width="${m(0.018)}" fill="none"/>`;
  k += `<path d="M${m(-0.18)} ${m(-0.62)} L${m(0.18)} ${m(-0.62)}" stroke="${HOLZ}" stroke-width="${m(0.014)}"/>`;
  k += `<ellipse cx="0" cy="${m(-0.18)}" rx="${m(0.17)}" ry="${m(0.05)}" fill="none" stroke="${HOLZ}" stroke-width="${m(0.014)}"/>`;
  for (const sx of [-1, 1]) k += `<path d="M${m(sx * 0.17)} ${m(-0.43)} L${m(sx * 0.19)} ${unten}" stroke="${HOLZ}" stroke-width="${m(0.024)}" stroke-linecap="round"/>`;
  k += `<ellipse cx="0" cy="${m(-0.46)}" rx="${m(0.22)}" ry="${m(0.085)}" fill="${HOLZ}"/><ellipse cx="0" cy="${m(-0.465)}" rx="${m(0.19)}" ry="${m(0.068)}" fill="#d9b97e"/>`;
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: X, y: Y, kunst: k,
    tipp: "Der Wiener Kaffeehausstuhl aus gebogenem Holz ist auf der ganzen Welt bekannt." });
}
{
  const TX = 336, TY = r(HOR + 0.5 * F / 1.1), rx = 52, ry = 17;
  let k = `<path d="M-4 ${ry} L-3 ${r(259.5 - TY)} L3 ${r(259.5 - TY)} L4 ${ry} Z" fill="${S.lg("fuss", [[0, "#3a3a3c"], [0.5, "#5a5a5c"], [1, "#222224"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${-rx} 0 A${rx} ${ry} 0 0 0 ${rx} 0 L${rx} 2.2 A${rx} ${ry} 0 0 1 ${-rx} 2.2 Z" fill="${S.lg("kante", [[0, "#cfc8bc"], [1, "#8f877b"]])}"/>`;
  k += `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${S.rg("marmor", [[0, "#ffffff"], [0.6, "#f1eee8"], [1, "#d9d4cb"]], 0.4, 0.35, 0.8)}"/>`;
  S.def(`<clipPath id="${S.id("platte")}"><ellipse cx="0" cy="0" rx="${rx - 0.6}" ry="${ry - 0.4}"/></clipPath>`);
  let adern = "";
  for (let i = 0; i < 9; i++) { const a = rnd() * 6.28; adern += `<path d="M${r(Math.cos(a) * rx * 0.8)} ${r(Math.sin(a) * ry * 0.8)} q${r(8 + rnd() * 10)} ${r(-2 + rnd() * 4)} ${r(16 + rnd() * 10)} ${r(-1 + rnd() * 3)}" stroke="#b9b2a8" stroke-width=".3" fill="none" opacity=".6"/>`; }
  k += `<g clip-path="url(#${S.id("platte")})">${adern}</g><ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="none" stroke="#a9a196" stroke-width=".6"/>`;
  /* Dinge auf dem Tisch (in Tisch-Koordinaten) */
  const ding = [];
  const lege = (id, x, y, g, fl, wort) => { k += `<g transform="translate(${x} ${y})">${g}</g>`; ding.push(Object.assign({ id, x: TX + x, y: TY + y, kunst: fl }, wort)); };
  /* die Zeitung im Holzhalter (hinten links) */
  {
    let g = `<path d="M-18 1 L14 -2 L16 4 L-16 7 Z" fill="#f2efe6" stroke="#c9c3b6" stroke-width=".3"/>`;
    for (let i = 0; i < 6; i++) g += `<path d="M${-13 + i * 0.4} ${r(3.6 + i * 0.6)} L${r(-1 + i * 0.4)} ${r(2.5 + i * 0.6)}" stroke="#9a958c" stroke-width=".35"/>`;
    g += `<path d="M2 1 L12 0 L13 3 L3 4 Z" fill="#b9b3a6"/>`;
    g += `<path d="M-19 1.2 L17 -2.2" stroke="#6b4626" stroke-width="1.3" stroke-linecap="round"/><circle cx="-19.4" cy="1.3" r="1" fill="#5a3a20"/>`;
    g += `<text x="-14.6" y="3.2" font-size="2.2" fill="#2a2a2a" font-family="Georgia,serif" font-weight="bold" transform="rotate(-5.4 -14.6 3.2)">Tagesblatt</text>`;
    lege("zeitung", -38, -15, g, flaeche(-20, -3.4, 37, 11, 0.6), { de: "die Zeitung", syl: "ZEI-tung", it: "il giornale", itSyl: "gior-NA-le", en: "newspaper",
      tipp: "Im Kaffeehaus liest man lange Zeitung – sie steckt in einem Halter aus Holz." });
  }
  /* das Silbertablett (hinten Mitte), darauf hinten Melange und Glas Wasser */
  {
    let g = `<ellipse cx="0" cy=".8" rx="17" ry="5.6" fill="#8d9296"/><ellipse cx="0" cy="0" rx="17" ry="5.6" fill="${S.lg("silber", [[0, "#f7f8f8"], [0.5, "#c3c9ce"], [1, "#e9ecee"]], 0, 0, 1, 0)}"/>`;
    g += `<ellipse cx="0" cy="0" rx="15" ry="4.6" fill="none" stroke="#a7aeb4" stroke-width=".4"/><path d="M-12 2.6 Q-2 4.6 10 3.4" stroke="#fff" stroke-width=".7" opacity=".7" fill="none"/>`;
    lege("tablett", -2, -8, g, flaeche(-17, 0.6, 34, 5.2, 0.6), { de: "das Tablett", syl: "tab-LETT", it: "il vassoio", itSyl: "vas-SO-io", en: "tray",
      tipp: "Im Kaffeehaus kommt der Kaffee auf einem kleinen Silbertablett." });
  }
  {
    let g = `<ellipse cx="0" cy="0" rx="7.4" ry="2.4" fill="#fbfaf6" stroke="#d6d1c6" stroke-width=".3"/>`;
    g += `<path d="M-5.2 -.8 L-4.6 -7.6 L4.6 -7.6 L5.2 -.8 Q0 1.3 -5.2 -.8 Z" fill="${S.lg("tasse", [[0, "#ffffff"], [0.7, "#f1efea"], [1, "#cfcac0"]], 0, 0, 1, 0)}"/>`;
    g += `<path d="M4.9 -6.2 q2.8 .2 2.5 2.5 q-.4 1.8 -3 1.3" stroke="#ece9e2" stroke-width=".9" fill="none"/>`;
    g += `<ellipse cx="0" cy="-7.6" rx="4.6" ry="1.5" fill="#f5ead6"/><path d="M-4.1 -7.6 Q0 -9.8 4.1 -7.6" fill="#f9f1e0"/>`;
    for (let i = 0; i < 12; i++) g += `<circle cx="${r(-3 + rnd() * 6)}" cy="${r(-8.1 + rnd() * 1.2)}" r=".2" fill="#7a4a2a"/>`;
    g += `<path d="M-6.4 .8 L-1.6 -.5" stroke="#c3c9ce" stroke-width=".6" stroke-linecap="round"/>`;
    lege("melange", -7, -11, g, flaeche(-7.4, -10, 14.8, 12, 0.6), { de: "die Melange", syl: "me-LAN-ge", it: "il cappuccino viennese", itSyl: "cap-puc-CI-no vien-NE-se", en: "Viennese melange",
      tipp: "Die Melange ist Kaffee mit heißer Milch und Milchschaum." });
  }
  {
    let g = `<ellipse cx="0" cy="0" rx="3.4" ry="1" fill="#c6d6da" opacity=".7"/>`;
    g += `<path d="M-3.6 -14 L-3.2 0 Q0 1 3.2 0 L3.6 -14 Z" fill="${S.lg("wglas", [[0, "#e9f3f6", 0.55], [0.5, "#ffffff", 0.2], [1, "#cfe2e8", 0.6]], 0, 0, 1, 0)}" stroke="#b9cfd6" stroke-width=".3"/>`;
    g += `<ellipse cx="0" cy="-14" rx="3.6" ry="1" fill="none" stroke="#c9dbe0" stroke-width=".35"/><ellipse cx="0" cy="-9.6" rx="3.4" ry=".9" fill="#dbeef3" opacity=".8"/>`;
    g += `<path d="M-2.4 -12.8 L-2.2 -1.4" stroke="#fff" stroke-width=".6" opacity=".8"/>`;
    lege("glas", 7, -12, g, flaeche(-3.8, -14.8, 7.6, 15.6, 0.6), { de: "das Glas Wasser", syl: "GLAS WAS-ser", it: "il bicchiere d'acqua", itSyl: "bic-CHIE-re DAC-qua", en: "glass of water",
      tipp: "Zum Kaffee bekommt man in Wien immer ein Glas Wasser." });
  }
  /* fürs Gegenüber (hinten rechts): Sachertorte, daneben Schlagobers */
  {
    let g = `<ellipse cx="0" cy=".5" rx="15" ry="4.8" fill="#d9d4ca"/><ellipse cx="0" cy="0" rx="15" ry="4.8" fill="#fbfaf6"/><ellipse cx="0" cy="0" rx="11" ry="3.4" fill="none" stroke="#e6e1d6" stroke-width=".4"/>`;
    g += `<g transform="translate(-4.6 .4) scale(.86)">`;
    g += `<path d="M-9 -1 L8 .6 L8 -4.8 L-9 -6.4 Z" fill="${S.lg("biskuit", [[0, "#6a3d22"], [1, "#4a2712"]])}"/>`;
    g += `<path d="M-9 -2.8 L8 -1.2 M-9 -4.6 L8 -3" stroke="#e08a2a" stroke-width=".55"/>`;
    g += `<path d="M-9 -6.4 L8 -4.8 L8 -5.6 L-9 -7.1 Z" fill="#2a140c"/>`;
    g += `<path d="M-9 -7.1 L8 -5.6 Q10.4 -7.4 9.4 -9.4 L3 -11 Z" fill="${S.lg("glasur", [[0, "#2c150b"], [0.5, "#5a2f1e"], [1, "#2a140c"]], 0, 0, 1, 1)}"/>`;
    g += `<path d="M8 .6 L8 -5.6 Q10.4 -7.4 9.4 -9.4 L9.6 -3 Q9.4 -.6 8 .6 Z" fill="#24110a"/>`;
    g += `<path d="M-5 -7.4 L5.6 -8.6" stroke="#fff" stroke-width=".6" opacity=".35" stroke-linecap="round"/>`;
    g += `<ellipse cx="5.4" cy="-8.4" rx="1.9" ry=".8" fill="#3d1f12" stroke="#7a4a30" stroke-width=".25"/></g>`;
    g += `<path d="M-14 3.6 L-4 2.4" stroke="#c3c9ce" stroke-width=".6" stroke-linecap="round"/>`;
    lege("sachertorte", 24, -6, g, flaeche(-10, -10, 15, 13, 0.6), { de: "die Sachertorte", syl: "SA-cher-tor-te", it: "la torta Sacher", itSyl: "TOR-ta SA-cher", en: "Sachertorte",
      tipp: "Schokoladentorte mit Marillenmarmelade – „Marille“ sagt man in Österreich zur Aprikose." });
    let o = `<path d="M-3.6 0 Q-4.2 -2 -2.4 -2.6 Q-2 -4.6 0 -4.4 Q2 -4.8 2.4 -2.6 Q4.2 -2 3.6 0 Q0 1.1 -3.6 0 Z" fill="${S.rg("obers", [[0, "#ffffff"], [1, "#ebe6dc"]], 0.4, 0.3, 0.7)}"/>`;
    o += `<path d="M-2.6 -.8 Q0 -2.4 2.4 -1 M-1.8 -2.4 Q0 -3.6 1.6 -2.6" stroke="#ddd6c9" stroke-width=".3" fill="none"/><path d="M-.6 -4.2 Q0 -6 .7 -4.2 Z" fill="#fbfaf6"/>`;
    lege("schlagobers", 36, -5.6, o, flaeche(-4, -6, 8, 7, 0.6), { de: "das Schlagobers", syl: "SCHLAG-o-bers", it: "la panna montata", itSyl: "PAN-na mon-TA-ta", en: "whipped cream",
      tipp: "„Schlagobers“ ist österreichisch und heißt in Deutschland „Schlagsahne“." });
  }
  /* vorn unser Gedeck: Wiener Schnitzel (groß, dünn, wellig souffliert,
     über den Tellerrand), Gabel, Messer, Erdäpfelsalat; die Zitronenspalte
     liegt am Tellerrand */
  {
    let g = `<path d="M-30 1 L-27 -2.6 M-29 1.2 L-26.2 -2.4 M-28 1.4 L-25.4 -2.2" stroke="#c3c9ce" stroke-width=".4"/><path d="M-30.4 1.6 L-25 -3.2" stroke="#b9c0c6" stroke-width=".9" stroke-linecap="round" transform="translate(1.6 3.4)"/>`;
    g += `<ellipse cx="1" cy="1" rx="23" ry="7.6" fill="#d9d4ca"/><ellipse cx="1" cy=".2" rx="23" ry="7.6" fill="#fbfaf6"/><ellipse cx="1" cy=".2" rx="17.6" ry="5.6" fill="none" stroke="#e6e1d6" stroke-width=".5"/>`;
    /* großer, flacher Lappen mit sanft gewelltem Rand, golden gebacken,
       die Panier wirft Blasen (souffliert) und hängt über den Tellerrand */
    const pkt = [[-25, 0.4], [-22, -2.8], [-16, -4.4], [-9, -4.8], [-2, -5.4], [5, -5], [11, -4.4], [15.6, -2.8], [17.6, -0.4], [16, 2], [10, 3], [3, 3.6], [-4, 3.2], [-11, 3.6], [-18, 3], [-23.4, 2.2]];
    const rand = "M" + pkt.map(([x, yy], i) => { const n = pkt[(i + 1) % pkt.length]; return `${x} ${yy} Q${r((x + n[0]) / 2 + (i % 2 ? 0.5 : -0.5))} ${r((yy + n[1]) / 2 + (i % 2 ? -0.6 : 0.6))}`; }).join(" ") + ` ${pkt[0][0]} ${pkt[0][1]} Z`;
    g += `<path d="${rand}" fill="#9a5a1e" transform="translate(.4 1)" opacity=".5"/>`;
    g += `<path d="${rand}" fill="${S.rg("panade", [[0, "#f0b95a"], [0.65, "#d6913a"], [1, "#a8611f"]], 0.42, 0.38, 0.72)}"/>`;
    for (let i = 0; i < 20; i++) { const x = -20 + rnd() * 34, yy = -3.8 + rnd() * 6.4, w2 = 1 + rnd() * 2; g += `<path d="M${r(x - w2)} ${r(yy)} Q${r(x)} ${r(yy - w2 * 0.7)} ${r(x + w2)} ${r(yy)} Q${r(x)} ${r(yy + w2 * 0.35)} ${r(x - w2)} ${r(yy)} Z" fill="#f6cf7e" opacity=".75"/><path d="M${r(x - w2)} ${r(yy)} Q${r(x)} ${r(yy + w2 * 0.35)} ${r(x + w2)} ${r(yy)}" stroke="#9e5a1c" stroke-width=".2" fill="none" opacity=".7"/>`; }
    for (let i = 0; i < 30; i++) g += `<circle cx="${r(-21 + rnd() * 36)}" cy="${r(-4 + rnd() * 6.8)}" r="${r(0.2 + rnd() * 0.25)}" fill="#8a4a14" opacity=".55"/>`;
    g += `<path d="M-17 -2 Q-8 -4.6 4 -3.6 Q12 -3.8 16 -2" stroke="#fff3cf" stroke-width=".7" opacity=".5" fill="none"/>`;
    g += `<path d="M22 4 L32 -1.4 M21.6 5.2 L23 4.4" stroke="#b9c0c6" stroke-width=".9" stroke-linecap="round"/>`;
    g += `<ellipse cx="38" cy=".2" rx="6.6" ry="2.4" fill="#e6eef0" stroke="#b9cfd6" stroke-width=".3"/>`;
    for (let i = 0; i < 9; i++) g += `<ellipse cx="${r(34.4 + rnd() * 7)}" cy="${r(-1.4 + rnd() * 2.4)}" rx="1.1" ry=".7" fill="#f2df9a" stroke="#d9c070" stroke-width=".15"/>`;
    g += `<path d="M33 -.6 q1 -1 2 0 M39 -1 q1 -1 2 0" stroke="#4f8a3a" stroke-width=".4" fill="none"/>`;
    lege("schnitzel", -22, 7, g, flaeche(-24, -7, 46, 12, 0.6), { de: "das Wiener Schnitzel", syl: "WIE-ner SCHNIT-zel", it: "la cotoletta alla viennese", itSyl: "co-to-LET-ta AL-la vien-NE-se", en: "Wiener schnitzel",
      tipp: "Das echte Wiener Schnitzel ist aus Kalbfleisch: dünn geklopft, paniert und in Butterschmalz goldgelb gebacken." });
    let z = `<path d="M-4.6 0 Q0 -3.6 4.6 0 Z" fill="#f3d94e" stroke="#d2b030" stroke-width=".3"/><path d="M-3.8 -.4 Q0 -2.8 3.8 -.4 Z" fill="#fbef9a"/>`;
    for (const a of [-0.9, -0.45, 0, 0.45, 0.9]) z += `<line x1="0" y1="-.3" x2="${r(Math.sin(a) * 3.4)}" y2="${r(-0.3 - Math.cos(a) * 2)}" stroke="#f3d94e" stroke-width=".25"/>`;
    lege("zitrone", -7, 13.6, z, flaeche(-5, -4, 10, 4.6, 0.6), { de: "die Zitrone", syl: "zi-TRO-ne", it: "il limone", itSyl: "li-MO-ne", en: "lemon",
      tipp: "Über das Schnitzel träufelt man frischen Zitronensaft." });
  }
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolino", itSyl: "ta-vo-LI-no", en: "table", x: TX, y: TY, kunst: k,
    tipp: "Kaffeehaustische haben eine runde Platte aus Marmor.",
    zoom: { x: 280, y: TY - 26, w: 112, h: 46 },
    unter: ding.map((u) => Object.assign(u, { x: r(u.x), y: r(u.y) })) });
}

/* Licht: warmer Nachmittag, die Sonne hinter uns links (fängt keinen Tipp ab) */
S.davor(`<rect width="400" height="260" fill="${S.lg("licht", [[0, "#fff1c8", 0.08], [0.6, "#fff1c8", 0], [1, "#000", 0.05]], 0, 0, 1, 0)}" pointer-events="none"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/wien.js"));
console.log(aus);
