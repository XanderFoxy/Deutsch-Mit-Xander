#!/usr/bin/env node
/* =====================================================================
   DER ZOO — GROSSE TIERE (FASSUNG 852) — Bilderwelt neu
   ---------------------------------------------------------------------
   Anderer Teil des Zoos als „Der Zoo“: der RUNDBLICK VOM AUSSICHTSTURM
   über drei Reihen von Anlagen (Panorama-Prinzip wie Tierpark Hagenbeck,
   Anlagen-Typen wie Zoo Leipzig, Zoo Frankfurt „Katzendschungel“,
   Tierpark Hellabrunn „Pavianfelsen“).

   RECHERCHE — so sind diese Anlagen in deutschen Zoos gebaut:
   - SAVANNE ganz hinten: Giraffen und Zebras gemeinsam auf großer
     Grasfläche, Akazien, ein versteckter Graben statt eines Zauns.
   - LÖWENANLAGE: Kunstfelsen zum Sonnen (das Männchen liegt oben), die
     Löwin daneben; Trockengraben und Mauer zum Besucherweg.
   - BÄRENANLAGE mit Badebecken, Baumstamm zum Kratzen und Felsen.
   - PAVIANFELSEN (Affenfelsen): Felsinsel, rundherum Wasser — Paviane
     schwimmen nicht, deshalb reicht der Wassergraben.
   - KROKODILHAUS / Tropenhaus: Glashaus mit warmem Becken und Sandbank;
     Krokodile liegen fast regungslos am Ufer.
   - KATZENSCHLUCHT vorne: einzelne Gehege mit großen Glasscheiben —
     Tiger mit Badebecken, Leopard auf einem waagrechten Ast (Leoparden
     ruhen gern in Bäumen), Puma auf Felsen.
   - PELIKANLAGUNE: flacher Teich mit Kiesufer, Rosapelikane und
     Flamingos zusammen (in vielen Zoos so gehalten).
   Blick vom Turm: Horizont y = 34, Maßstab m(y) = 0,15·(y − 34)
   Einheiten je Meter (Savanne ≈ 7, Mittelreihe ≈ 14, vorne ≈ 21).
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, flaeche, schatten, zufall } = B;
const { tierBaukasten } = require("./zoo.js");
const r = B.r;

const S = neueSzene({ id: "zoo2", titel: "Der Zoo — große Tiere", emoji: "🦁", thema: "Natur", kuerzel: "b19b", fassung: 852 });
const rnd = zufall(1863);
const T = tierBaukasten(S);
const HOR = 34, M = (y) => 0.15 * (y - HOR);
/* x eines Punkts, der vorne (y = 200) bei x liegt, in der Tiefe y (Fluchtpunkt 160/34) */
const X = (x, y) => 160 + (x - 160) * (y - HOR) / (200 - HOR);
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);

const FELS = S.lg("fels", [[0, "#c4b39a"], [0.6, "#a08b70"], [1, "#7d6a54"]]);
const FELS_D = S.lg("felsd", [[0, "#9c8a72"], [1, "#6e5d4a"]]);
const WASSER = S.lg("wasser", [[0, "#6f9eaa"], [0.6, "#4f8190"], [1, "#3d6a78"]]);
const GRAS = S.lg("gras", [[0, "#9fae66"], [1, "#7f9150"]]);
const SAND = S.lg("sand", [[0, "#d6c296"], [1, "#b9a274"]]);
const WEG = S.lg("weg", [[0, "#cfc7b8"], [1, "#b4ab9b"]]);
const MAUER = S.lg("mauer", [[0, "#bfb3a0"], [1, "#958a78"]]);

/* Felsblock: gerundete Kuppe mit Licht oben links und Rissen */
const felsen = (x, y, w, h, seed = 1) => {
  const z = zufall(seed);
  let p = `M${r(x - w / 2)} ${r(y)}`;
  const n = 7;
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = Math.PI * (1 - t), hh = h * (0.75 + z() * 0.25);
    p += ` Q${r(x + Math.cos(a + 0.2) * w * 0.55)} ${r(y - Math.sin(a + 0.2) * hh * 1.05)} ${r(x + Math.cos(a) * w / 2)} ${r(y - Math.sin(a) * hh)}`;
  }
  let g = `<path d="${p} Z" fill="${FELS}"/>`;
  g += `<path d="M${r(x - w * 0.36)} ${r(y - h * 0.62)} Q${r(x - w * 0.1)} ${r(y - h * 0.98)} ${r(x + w * 0.16)} ${r(y - h * 0.86)}" stroke="#e6dccb" stroke-width=".7" fill="none" opacity=".55"/>`;
  g += `<path d="M${r(x + w * 0.05)} ${r(y - h * 0.8)} q${r(w * 0.04)} ${r(h * 0.3)} ${r(-w * 0.02)} ${r(h * 0.75)} M${r(x - w * 0.25)} ${r(y - h * 0.4)} l${r(w * 0.08)} ${r(h * 0.38)}" stroke="#6b5a46" stroke-width=".4" fill="none" opacity=".55"/>`;
  g += `<path d="M${r(x - w / 2)} ${r(y)} Q${r(x)} ${r(y - h * 0.18)} ${r(x + w / 2)} ${r(y)} Z" fill="#000" opacity=".12"/>`;
  return g;
};
const grasbuesche = (x0, x1, y0, y1, n, farbe = "#6f8a3a") => {
  let g = "";
  for (let i = 0; i < n; i++) {
    const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0), h = 0.4 + M(y) * 0.08;
    g += `<path d="M${r(x)} ${r(y)} l${r(-0.4 * h)} ${r(-h)} M${r(x)} ${r(y)} l${r(0.1 * h)} ${r(-h * 1.2)} M${r(x)} ${r(y)} l${r(0.5 * h)} ${r(-h * 0.9)}" stroke="${farbe}" stroke-width=".35"/>`;
  }
  return g;
};

/* =====================================================================
   KULISSE
   ===================================================================== */
S.hinten(`<rect width="320" height="40" fill="${S.lg("himmel", [[0, "#93c1e6"], [1, "#e1ecee"]])}"/>`);
S.hinten(`<g fill="#fff" opacity=".7"><ellipse cx="70" cy="10" rx="26" ry="3.6"/><ellipse cx="62" cy="7.6" rx="12" ry="3.4"/><ellipse cx="240" cy="14" rx="30" ry="3.4"/><ellipse cx="250" cy="11" rx="12" ry="3"/></g>`);
{
  /* Stadtrand und Baumreihe am Horizont */
  let g = "";
  for (const [x, w, h] of [[20, 14, 8], [40, 10, 12], [262, 16, 9], [290, 12, 13]]) g += `<rect x="${x}" y="${30 - h}" width="${w}" height="${h + 4}" fill="#b8c2c6"/>`;
  let p = "M0 38 L0 30";
  for (let x = 0; x <= 320; x += 8) p += ` Q${x + 4} ${r(23 + rnd() * 6)} ${x + 8} ${r(29 + rnd() * 3)}`;
  g += `<path d="${p} L320 38 Z" fill="${S.lg("fern", [[0, "#7c9a6c"], [1, "#5d7a4f"]])}"/>`;
  S.hinten(g);
}
/* REIHE 1 — Savanne */
{
  let g = `<rect x="0" y="34" width="320" height="52" fill="${S.lg("savanne", [[0, "#cbbb84"], [1, "#b2a161"]])}"/>`;
  g += grasbuesche(0, 320, 40, 84, 110, "#8f8248");
  for (const [x, y] of [[262, 52], [24, 50]]) {
    g += `<path d="M${x} ${y} Q${x + 1} ${y - 8} ${x - 1} ${y - 14} M${x} ${y - 9} Q${x + 4} ${y - 12} ${x + 7} ${y - 15}" stroke="#5b4630" stroke-width=".9" fill="none"/>`;
    g += `<path d="M${x - 12} ${y - 14} Q${x - 9} ${y - 20} ${x + 2} ${y - 20} Q${x + 14} ${y - 20} ${x + 16} ${y - 15} Q${x + 2} ${y - 12} ${x - 12} ${y - 14} Z" fill="${S.lg("akazie", [[0, "#829d50"], [1, "#58723a"]])}"/>`;
    g += `<ellipse cx="${x + 1}" cy="${y}" rx="8" ry="1" fill="#6b5a35" opacity=".35"/>`;
  }
  g += felsen(232, 74, 30, 10, 3);
  /* versteckter Graben vor der Savanne (von oben als dunkler Streifen) */
  g += `<path d="M0 84 L320 84 L320 87 L0 87 Z" fill="#6c7a52"/><path d="M0 86.6 L320 86.6" stroke="#4f6b62" stroke-width="1.2"/>`;
  S.hinten(g);
}
/* Weg 1 zwischen Savanne und Mittelreihe */
S.hinten(`<rect x="0" y="87" width="320" height="6" fill="${WEG}"/><rect x="0" y="92.4" width="320" height=".8" fill="#8d8579"/>` +
  `<path d="M0 87.4 H320" stroke="#5b5f60" stroke-width=".4"/>` + [...Array(33)].map((_, i) => `<path d="M${i * 10} 87.4 v-2" stroke="#5b5f60" stroke-width=".3"/>`).join(""));

/* REIHE 2 — Böden der vier Anlagen, Trennwände zum Fluchtpunkt */
const R2 = { y0: 93, y1: 132 };
const W2 = [0, 86, 168, 244, 320];  /* Grenzen vorne (y = 132) */
{
  let g = `<rect x="0" y="${R2.y0}" width="320" height="${R2.y1 - R2.y0}" fill="${GRAS}"/>`;
  /* Löwen: Sand und Gras */
  g += `<path d="M0 ${R2.y0} L${r(86 + (160 - 86) * 0.12)} ${R2.y0} L86 ${R2.y1} L0 ${R2.y1} Z" fill="${SAND}" opacity=".7"/>`;
  g += grasbuesche(0, 84, 96, 130, 40, "#8a7a46");
  /* Bär: Waldboden */
  g += `<path d="M${r(86 + (160 - 86) * 0.12)} ${R2.y0} L${r(168 + (160 - 168) * 0.12)} ${R2.y0} L168 ${R2.y1} L86 ${R2.y1} Z" fill="${S.lg("waldboden", [[0, "#8c8a58"], [1, "#6f6c44"]])}"/>`;
  g += `<ellipse cx="146" cy="112" rx="16" ry="4" fill="${WASSER}"/><path d="M132 112 Q146 109 160 112" stroke="#d6e6e6" stroke-width=".4" fill="none" opacity=".7"/>`;
  g += `<path d="M98 106 L122 102" stroke="#6b5136" stroke-width="2.4" stroke-linecap="round"/><path d="M104 104.6 l1.4 -2.4 M114 103 l-1 -2.4" stroke="#6b5136" stroke-width=".8"/>`;
  /* Pavianfelsen: Wasser rundherum */
  g += `<path d="M${r(168 + (160 - 168) * 0.12)} ${R2.y0} L244 ${R2.y0} L244 ${R2.y1} L168 ${R2.y1} Z" fill="${WASSER}"/>`;
  for (let i = 0; i < 8; i++) { const x = 172 + rnd() * 66, y = 96 + rnd() * 32; g += `<path d="M${r(x)} ${r(y)} h${r(4 + rnd() * 6)}" stroke="#e1eef0" stroke-width=".35" opacity=".6"/>`; }
  /* Krokodilhaus: Fliesenboden innen */
  g += `<rect x="244" y="${R2.y0}" width="76" height="${R2.y1 - R2.y0}" fill="${S.lg("tropen", [[0, "#5f7d52"], [1, "#4a6a40"]])}"/>`;
  /* Trennwände (Kunstfelsen-Mauern) */
  for (const x of W2.slice(1, 3)) {
    const xb = x + (160 - x) * 0.12;
    g += `<path d="M${r(xb - 2)} ${R2.y0} Q${r(xb)} ${R2.y0 - 5} ${r(xb + 2)} ${R2.y0} L${x + 3} ${R2.y1} L${x - 3} ${R2.y1} Z" fill="${FELS_D}"/><path d="M${r(xb - 2)} ${R2.y0} Q${r(xb)} ${R2.y0 - 5} ${r(xb + 1)} ${R2.y0 + 2} L${x - 0.5} ${R2.y1} L${x - 3} ${R2.y1} Z" fill="${FELS}"/>`;
  }
  S.hinten(g);
}
/* Krokodilhaus: Glashaus (Rahmen hinten, Becken, Sandbank, Palmen) */
{
  /* Rückwand innen (Felsimitat), Glasdach als Satteldach */
  let g = `<rect x="244" y="86" width="76" height="${R2.y0 - 86 + 8}" fill="${S.lg("hausinnen", [[0, "#8a9a7a"], [1, "#6c7e5e"]])}"/>`;
  g += `<path d="M242 88 L282 72 L322 88 Z" fill="${S.lg("glasdach2", [[0, "#d6e8ee"], [1, "#9fc0cc"]])}"/>`;
  for (let i = 0; i <= 8; i++) g += `<path d="M${242 + i * 10} 88 L282 72" stroke="#5c6c6f" stroke-width=".35"/>`;
  g += `<rect x="242" y="87.4" width="80" height="1.4" fill="#5c6c6f"/>`;
  g += `<path d="M244 112 Q270 104 320 106 L320 132 L244 132 Z" fill="${WASSER}"/>`;
  g += `<path d="M250 132 Q252 122 272 120 Q300 118 320 121 L320 132 Z" fill="${SAND}"/>`;
  for (const [x, y, h] of [[312, 110, 30], [262, 112, 22]]) {
    g += `<path d="M${x} ${y} Q${x + 1} ${y - h / 2} ${x - 1} ${y - h}" stroke="#7a6346" stroke-width="1.4" fill="none"/>`;
    for (let i = 0; i < 6; i++) { const a = -2.8 + i * 0.55; g += `<path d="M${x - 1} ${y - h} q${r(Math.cos(a) * 6)} ${r(Math.sin(a) * 3 - 2)} ${r(Math.cos(a) * 11)} ${r(Math.sin(a) * 5 + 2)}" stroke="#4f7d3a" stroke-width="1.4" fill="none" stroke-linecap="round"/>`; }
  }
  g += `<text x="290" y="${R2.y1 - 1}" font-size="3" text-anchor="middle" fill="#2f4a3a" font-family="Arial" font-weight="bold">KROKODILHAUS</text>`;
  S.hinten(g);
}
/* Mauer und Weg 2 vor der Mittelreihe */
S.hinten(`<rect x="0" y="${R2.y1}" width="320" height="3" fill="${MAUER}"/><rect x="0" y="${R2.y1}" width="320" height=".7" fill="#ddd2bf"/>` +
  `<rect x="0" y="${R2.y1 + 3}" width="320" height="8" fill="${WEG}"/><rect x="0" y="${R2.y1 + 10.4}" width="320" height="1" fill="#8d8579"/>`);
for (const [x, t] of [[40, "LÖWEN"], [128, "BÄREN"], [206, "PAVIANE"]]) S.hinten(`<rect x="${x - 7}" y="${R2.y1 - 0.2}" width="14" height="3.2" rx=".4" fill="#2f5d3a"/><text x="${x}" y="${R2.y1 + 2.2}" font-size="2.2" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">${t}</text>`);

/* REIHE 3 — vorne: Pelikanlagune und drei Katzengehege mit Glasscheiben */
const R3 = { y0: 143, y1: 200 };
const W3 = [0, 112, 196, 258, 320];
{
  let g = `<rect x="0" y="${R3.y0}" width="320" height="${R3.y1 - R3.y0}" fill="${GRAS}"/>`;
  /* Lagune */
  g += `<path d="M0 ${R3.y0} L${r(X(112, R3.y0))} ${R3.y0} L112 200 L0 200 Z" fill="${S.lg("kies", [[0, "#cdbf9f"], [1, "#b3a585"]])}"/>`;
  g += `<path d="M0 150 Q40 146 88 150 Q108 154 106 170 Q104 190 80 194 Q40 198 0 194 Z" fill="${WASSER}"/>`;
  g += `<path d="M0 150 Q40 146 88 150 Q108 154 106 170" stroke="#e8e1cf" stroke-width="1" fill="none" opacity=".7"/>`;
  for (let i = 0; i < 12; i++) { const x = 6 + rnd() * 90, y = 156 + rnd() * 34; g += `<path d="M${r(x)} ${r(y)} h${r(5 + rnd() * 8)}" stroke="#e6f0f2" stroke-width=".4" opacity=".55"/>`; }
  /* Tiger: Gras, Badebecken, Felsen */
  g += `<ellipse cx="176" cy="186" rx="18" ry="5" fill="${WASSER}"/><path d="M160 186 Q176 182 192 186" stroke="#d6e6e6" stroke-width=".4" fill="none"/>`;
  g += felsen(132, 156, 30, 9, 7);
  g += grasbuesche(114, 194, 150, 198, 40);
  /* Leopard: Baum mit waagrechtem Ast */
  g += `<path d="M236 198 Q234 180 236 160 Q237 150 240 142" stroke="${S.lg("stamm", [[0, "#5b4634"], [0.5, "#7a6048"], [1, "#4a382a"]], 0, 0, 1, 0)}" stroke-width="4.4" fill="none" stroke-linecap="round"/>`;
  g += `<path d="M236 170 Q222 168 204 170" stroke="#6a5240" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M238 158 Q246 152 254 148" stroke="#6a5240" stroke-width="1.6" fill="none"/>`;
  for (const [x, y, rx, ry] of [[242, 141, 13, 5], [232, 144, 8, 3.6], [252, 144, 8, 3.4], [244, 137.6, 8, 3.4]]) g += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${S.rg("blaetter", [[0, "#7fa65a"], [0.7, "#5a8240"], [1, "#466a32"]], 0.4, 0.35, 0.7)}"/>`;
  g += grasbuesche(198, 256, 150, 198, 25, "#7a8a3a");
  /* Puma: Felsen */
  g += grasbuesche(260, 318, 150, 198, 25, "#8a8a4a");
  /* Trennwände */
  for (const x of W3.slice(1, 4)) { const xb = x + (160 - x) * 0.18; g += `<path d="M${r(xb - 1.6)} ${R3.y0} L${r(xb + 1.6)} ${R3.y0} L${x + 2.4} 200 L${x - 2.4} 200 Z" fill="${FELS_D}"/><path d="M${r(xb - 1.6)} ${R3.y0} L${r(xb)} ${R3.y0} L${x} 200 L${x - 2.4} 200 Z" fill="${FELS}"/>`; }
  g += `<rect x="0" y="${R3.y0}" width="320" height="2" fill="#7d6a54" opacity=".6"/>`;
  S.hinten(g);
}

{
  /* DIE AKAZIE (Schirmakazie) — Futter- und Schattenbaum der Savanne */
  const x = 0, y = 0;
  let k = `<ellipse cx="1" cy="0" rx="8" ry="1" fill="#6b5a35" opacity=".35"/>`;
  k += `<path d="M0 0 Q1 -8 -1 -14 M0 -9 Q4 -12 7 -15" stroke="#5b4630" stroke-width=".9" fill="none"/>`;
  k += `<path d="M-12 -14 Q-9 -20 2 -20 Q14 -20 16 -15 Q2 -12 -12 -14 Z" fill="${S.lg("akazie", [[0, "#829d50"], [1, "#58723a"]])}"/>`;
  k += `<path d="M-8 -17 Q0 -19.4 10 -17.6" stroke="#9ab865" stroke-width=".6" fill="none" opacity=".6"/>`;
  S.teil({ id: "akazie", de: "die Akazie", syl: "a-KA-zie", it: "l'acacia", itSyl: "a-CA-cia", en: "acacia", x: 190, y: 60, kunst: k,
    tipp: "Die Schirmakazie wächst in der afrikanischen Savanne. Giraffen fressen ihre Blätter trotz der Dornen." });
}

/* =====================================================================
   REIHE 1 — Giraffe und Zebras auf der Savanne
   ===================================================================== */
S.teil({ id: "giraffe", de: "die Giraffe", syl: "Gi-RAF-fe", it: "la giraffa", itSyl: "gi-RAF-fa", en: "giraffe", x: 70, y: 80,
  kunst: schatten(2, 0, 9, 1, 0.25) + T.giraffe(M(80)),
  tipp: "Die Giraffe frisst Blätter ganz oben in den Akazien — ihre Zunge ist fast einen halben Meter lang." });
S.teil({ id: "zebra", de: "das Zebra", syl: "ZE-bra", it: "la zebra", itSyl: "ZE-bra", en: "zebra", x: 146, y: 80,
  kunst: `<g transform="translate(13 -4)">${schatten(0, 0, 6, 0.7, 0.22)}${T.zebra(M(76), -1)}</g>` + `<g transform="translate(-12 -2)">${schatten(0, 0, 6, 0.7, 0.22)}${T.zebra(M(78), 1)}</g>` + schatten(0, 0, 7, 0.8, 0.25) + T.zebra(M(80)),
  tipp: "Zebras leben in Herden — die Streifen verwirren Löwen und Fliegen." });

/* =====================================================================
   REIHE 2 — Löwe und Löwin, Bär, Paviane, Krokodil
   ===================================================================== */
{
  let k = felsen(0, 0, 44, 11, 5);
  k += `<g transform="translate(-1 -9.8)">${T.katze("loewe", M(116), 1, "liegen")}</g>`;
  S.teil({ id: "loewe", de: "der Löwe", syl: "LÖ-we", it: "il leone", itSyl: "le-O-ne", en: "lion", x: 26, y: 116, kunst: k,
    tipp: "Der Löwe liegt oben auf dem Felsen — Löwen schlafen bis zu zwanzig Stunden am Tag." });
}
S.teil({ id: "loewin", de: "die Löwin", syl: "LÖ-win", it: "la leonessa", itSyl: "le-o-NES-sa", en: "lioness", x: 64, y: 129,
  kunst: schatten(0, 0, 13, 1.2, 0.28) + T.katze("loewin", M(129), -1),
  tipp: "Die Löwin hat keine Mähne. Meistens jagen die Löwinnen." });
S.teil({ id: "baer", de: "der Bär", syl: "BÄR", it: "l'orso", itSyl: "OR-so", en: "bear", x: 134, y: 127,
  kunst: schatten(0, 0, 14, 1.2, 0.3) + T.baer(M(127), -1),
  tipp: "Ein Braunbär: der Buckel über den Schultern ist ein starker Muskel zum Graben." });
{
  /* Pavianfelsen: Felsinsel mit drei Pavianen */
  let k = felsen(0, 0, 54, 26, 9) + felsen(-14, 2, 26, 10, 13) + felsen(16, 2, 22, 8, 17);
  const g = (x, y, dir, s = 1) => `<g transform="translate(${x} ${y})">${T.affe(M(124) * s, dir)}</g>`;
  k += g(-3, -24.4, 1) + g(-16, -9.6, -1, 0.9) + g(14, -7.4, 1, 0.85);
  S.teil({ id: "affe", de: "der Affe", syl: "AF-fe", it: "la scimmia", itSyl: "SCIM-mia", en: "monkey", x: 206, y: 124, kunst: k,
    tipp: "Paviane leben in großen Gruppen auf Felsen. Sie können nicht schwimmen — darum reicht das Wasser rundherum." });
}
S.teil({ id: "krokodil", de: "das Krokodil", syl: "Kro-ko-DIL", it: "il coccodrillo", itSyl: "coc-co-DRIL-lo", en: "crocodile", x: 286, y: 127,
  kunst: T.krokodil(M(127)),
  tipp: "Das Krokodil liegt stundenlang still in der Wärme — im Zoo wohnt es im warmen Krokodilhaus." });
/* Glasfront des Krokodilhauses (Spiegelung, fängt nichts) */
S.davor(`<g pointer-events="none"><rect x="244" y="88.8" width="76" height="${R2.y1 - 88.8}" fill="${S.lg("glas2", [[0, "#ffffff", 0.2], [0.5, "#ffffff", 0.04], [1, "#e0f0f4", 0.16]], 0, 0, 1, 1)}"/>` +
  `<path d="M252 ${R2.y1} L264 89 L270 89 L258 ${R2.y1} Z" fill="#fff" opacity=".12"/><path d="M292 ${R2.y1} L302 89 L305 89 L295 ${R2.y1} Z" fill="#fff" opacity=".1"/>` +
  [244, 282, 319.4].map((x) => `<rect x="${x - 0.6}" y="88.8" width="1.2" height="${R2.y1 - 88.8}" fill="#5c6c6f"/>`).join("") + `<rect x="244" y="${R2.y1 - 1}" width="76" height="1.2" fill="#5c6c6f"/></g>`);

/* =====================================================================
   REIHE 3 — Pelikane und Flamingos, Tiger, Leopard, Puma
   ===================================================================== */
{
  let k = "";
  for (const [x, y, dir] of [[-15, 0, 1], [14, 8, -1]]) k += `<g transform="translate(${x} ${y})"><ellipse cx="0" cy=".3" rx="7" ry="1" fill="#2d5566" opacity=".3"/>${T.pelikan(M(172 + y), dir)}</g>`;
  S.teil({ id: "pelikan", de: "der Pelikan", syl: "PE-li-kan", it: "il pellicano", itSyl: "pel-li-CA-no", en: "pelican", x: 30, y: 172, kunst: k,
    tipp: "Mit dem Kehlsack unter dem Schnabel fischt der Pelikan wie mit einem Kescher." });
}
{
  let k = "";
  for (const [x, y, dir, unten] of [[-10, 0, -1, false], [4, -5, 1, true], [16, 4, -1, false]]) k += `<g transform="translate(${x} ${y})"><ellipse cx="0" cy=".3" rx="3" ry=".6" fill="#2d5566" opacity=".3"/>${T.flamingo(M(168 + y), dir, unten)}</g>`;
  S.teil({ id: "flamingo", de: "der Flamingo", syl: "Fla-MIN-go", it: "il fenicottero", itSyl: "fe-ni-COT-te-ro", en: "flamingo", x: 80, y: 168, kunst: k,
    tipp: "Flamingos sind rosa, weil sie kleine Krebse fressen — mit dem Kopf nach unten." });
}
S.teil({ id: "tiger", de: "der Tiger", syl: "TI-ger", it: "la tigre", itSyl: "TI-gre", en: "tiger", x: 150, y: 180,
  kunst: schatten(0, 0, 18, 1.4, 0.3) + T.katze("tiger", M(180), 1, "liegen"),
  tipp: "Tiger baden gern — anders als die meisten Katzen." });
{
  let k = `<g transform="translate(0 0)">${T.katze("leopard", M(172), -1, "liegen")}</g>`;
  S.teil({ id: "leopard", de: "der Leopard", syl: "Leo-PARD", it: "il leopardo", itSyl: "leo-PAR-do", en: "leopard", x: 222, y: 169, kunst: k,
    tipp: "Der Leopard ruht gern auf einem Ast. Seine Flecken sind Ringe — man nennt sie Rosetten." });
}
S.teil({ id: "felsen", de: "der Felsen", syl: "FEL-sen", it: "la roccia", itSyl: "ROC-cia", en: "rock", x: 0, y: 0, kunst: felsen(290, 190, 44, 16, 11),
  tipp: "Auf dem warmen Felsen liegt der Puma gern und schaut über sein Gehege." });
S.teil({ id: "puma", de: "der Puma", syl: "PU-ma", it: "il puma", itSyl: "PU-ma", en: "puma", x: 290, y: 175,
  kunst: schatten(0, 0, 13, 1, 0.25) + T.katze("puma", M(186), -1),
  tipp: "Der Puma ist einfarbig — nur die Schwanzspitze ist dunkel. Er kann so weit springen wie ein Bus lang ist." });

/* Glasscheiben vor den Katzengehegen (Spiegelung, Rahmen) */
S.davor(`<g pointer-events="none"><rect x="112" y="150" width="208" height="50" fill="${S.lg("glas3", [[0, "#ffffff", 0.14], [0.5, "#ffffff", 0.03], [1, "#e0f0f4", 0.12]], 0, 0, 1, 1)}"/>` +
  [[120, 150], [204, 150], [266, 150]].map(([x]) => `<path d="M${x} 200 L${x + 12} 150 L${x + 18} 150 L${x + 6} 200 Z" fill="#fff" opacity=".1"/>`).join("") +
  `<rect x="112" y="198" width="208" height="2" fill="#59636a"/>` + [112, 196, 258].map((x) => `<rect x="${x - 0.8}" y="150" width="1.6" height="50" fill="#59636a"/>`).join("") + `<rect x="112" y="149" width="208" height="1.4" fill="#59636a"/></g>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/zoo2.js"));
console.log(aus);
