#!/usr/bin/env node
/* =====================================================================
   ITALIEN — DIE TOSKANA (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Val d'Orcia/UNESCO, Fotos Monticchiello, Pienza,
   Montepulciano, Podere Belvedere; Bars und Gelaterie auf den Piazze):
   - Die Bergstädtchen der Südtoskana haben eine kleine PIAZZA mit einer
     Brüstung, von der man über das Tal schaut. An der Piazza die „Bar“
     (Café): Markise, offene Tür mit Perlenvorhang, im Fenster die
     Eistheke der Gelateria; oben grüne FENSTERLÄDEN (Persiane),
     Blumenkästen mit Geranien, die Trikolore am Halter.
   - Draußen kleine Tische mit Leinendecke: Pizza, Pasta, ESPRESSO
     (kleine dicke Tasse), Chianti in der strohumflochtenen Flasche
     („Fiasco“), Olivenöl, Zitronen. ZITRONENBÄUMCHEN in Terrakotta-
     Töpfen stehen vor den Häusern.
   - Der Blick: sanfte Hügel, ein PODERE (Landhaus aus Bruchstein mit
     Ziegeldach und Taubenturm) auf der Kuppe, eine weiße Straße, die
     in Kurven von ZYPRESSEN gesäumt hinaufführt (Monticchiello), einzeln
     stehende Zypressen, WEINBERGE in Reihen, silbrige OLIVENBÄUME.
   - Die VESPA (Piaggio): Beinschild vorn, runder Scheinwerfer am Lenker,
     gewölbte Seitenhauben hinten, kleine Räder, Pastellfarbe.
   - Die GONDEL gehört nach Venedig: hier hängt sie als Reiseplakat an
     der Bar („Venezia“).
   BLICK: Augenhöhe 1,6 m, Horizont y = 92. Einheiten je Meter am Boden:
   s(y) = (y − 92) / 1,6 (Hausfront und Brüstung y 152: 37,5; Tisch
   y 188: 60; Kellner y 178: 54 → 1,78 m = 96).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "italien", titel: "Italien — die Toskana", emoji: "🇮🇹", thema: "Länder", kuerzel: "b24b", fassung: 852 });
const rnd = zufall(1492);
const r = B.r;
const HY = 92;
const s = (y) => (y - HY) / 1.6;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const knapp = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);

/* ---------- Stoffe ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<pattern id="${S.id("putz")}" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#e3b77a"/><circle cx="1" cy="1.4" r=".5" fill="#d9a865" opacity=".6"/><circle cx="4.2" cy="3.8" r=".6" fill="#ecc690" opacity=".6"/><circle cx="2.4" cy="5" r=".3" fill="#c99556" opacity=".5"/></pattern>`);
S.def(`<pattern id="${S.id("bruch")}" width="10" height="6" patternUnits="userSpaceOnUse"><rect width="10" height="6" fill="#b9a383"/><rect x=".3" y=".3" width="4.2" height="2.4" rx=".8" fill="#c9b494"/><rect x="5" y=".4" width="4.6" height="2.3" rx=".8" fill="#bfa98a"/><rect x="2" y="3.2" width="5" height="2.4" rx=".8" fill="#ccb898"/><rect x="7.4" y="3.3" width="3" height="2.3" rx=".8" fill="#c2ad8d"/><rect x="-1" y="3.3" width="2.6" height="2.3" rx=".8" fill="#c2ad8d"/></pattern>`);
S.def(`<pattern id="${S.id("markise")}" width="8" height="4" patternUnits="userSpaceOnUse"><rect width="8" height="4" fill="#f3ecd8"/><rect width="4" height="4" fill="#2f6b4a"/></pattern>`);
const PUTZ = `url(#${S.id("putz")})`, BRUCH = `url(#${S.id("bruch")})`;
const TERRA = S.lg("terra", [[0, "#d27a4a"], [0.5, "#bb6136"], [1, "#9c4a26"]], 0, 0, 1, 0);
const GRUEN_L = S.lg("laden", [[0, "#3f7a52"], [1, "#2c5a3b"]], 0, 0, 1, 0);
const ZYP = S.lg("zyp", [[0, "#2e4a2a"], [0.5, "#3d5e33"], [1, "#24391f"]], 0, 0, 1, 0);

/* Zypresse: schlanke Flamme */
const zypresse = (x, y, h, w) => {
  let g = `<path d="M${r(x)} ${r(y - h)} Q${r(x + w * 0.55)} ${r(y - h * 0.62)} ${r(x + w * 0.5)} ${r(y - h * 0.18)} Q${r(x + w * 0.3)} ${r(y)} ${r(x)} ${r(y)} Q${r(x - w * 0.3)} ${r(y)} ${r(x - w * 0.5)} ${r(y - h * 0.18)} Q${r(x - w * 0.55)} ${r(y - h * 0.62)} ${r(x)} ${r(y - h)} Z" fill="${ZYP}"/>`;
  if (h > 9) for (let i = 0; i < 4; i++) g += `<path d="M${r(x - w * 0.3)} ${r(y - h * (0.2 + i * 0.18))} q${r(w * 0.3)} -1 ${r(w * 0.55)} -.3" stroke="#56794a" stroke-width=".35" fill="none" opacity=".7"/>`;
  return g;
};

/* =====================================================================
   KULISSE — Himmel, ferne Hügel (Monte Amiata), Pflaster der Piazza
   ===================================================================== */
const WAND_FUSS = 152, WAND_OBEN = 118;
{
  let k = `<rect width="320" height="${WAND_OBEN + 2}" fill="${S.lg("himmel", [[0, "#5f9ad4"], [0.55, "#9cc4e6"], [1, "#e9e6d6"]])}"/>`;
  for (const [x, y, w] of [[150, 22, 26], [210, 40, 16], [40, 14, 18]]) {
    k += `<g filter="url(#${S.id("dunst")})" opacity=".85"><ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * 0.14}" fill="#fff"/><ellipse cx="${x - w * 0.3}" cy="${y - w * 0.12}" rx="${w * 0.4}" ry="${w * 0.16}" fill="#fff"/><ellipse cx="${x + w * 0.25}" cy="${y - w * 0.1}" rx="${w * 0.35}" ry="${w * 0.14}" fill="#fff"/></g>`;
  }
  /* ferne Hügelketten im Dunst (Monte Amiata hinten) */
  k += `<path d="M110 84 Q150 70 190 76 Q230 62 262 68 Q290 74 320 70 L320 120 L110 120 Z" fill="#a9b9c4"/>`;
  k += `<path d="M110 92 Q140 82 175 88 Q215 80 250 86 Q290 80 320 84 L320 120 L110 120 Z" fill="#9fae8e" opacity=".9"/>`;
  /* Pflaster der Piazza: große Sandsteinplatten in Fluchtperspektive */
  k += `<rect x="0" y="${WAND_FUSS}" width="320" height="${200 - WAND_FUSS}" fill="${S.lg("platten", [[0, "#b8a88f"], [1, "#cdbda2"]])}"/>`;
  for (let i = -18; i <= 18; i++) k += `<line x1="${r(160 + i * 9)}" y1="${WAND_FUSS}" x2="${r(160 + i * 9 * (200 - HY) / (WAND_FUSS - HY))}" y2="200" stroke="#8f816b" stroke-width=".4" opacity=".7"/>`;
  for (const y of [155, 159.5, 165, 172, 181, 193]) k += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#8f816b" stroke-width=".4" opacity=".65"/>`;
  for (let i = 0; i < 60; i++) k += `<rect x="${r(rnd() * 320)}" y="${r(WAND_FUSS + rnd() * 46)}" width="${r(2 + rnd() * 4)}" height=".5" fill="${rnd() < 0.5 ? "#a5947a" : "#ddd0b8"}" opacity=".5"/>`;
  k += `<rect x="0" y="${WAND_FUSS}" width="320" height="${200 - WAND_FUSS}" fill="${S.lg("plattenlicht", [[0, "#000", 0.1], [0.4, "#000", 0], [1, "#fff6e0", 0.12]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE SONNE
   ===================================================================== */
{
  let k = `<circle r="22" fill="${S.rg("sonnenhof", [[0, "#fff6c8", 0.7], [1, "#fff6c8", 0]])}"/>`;
  k += `<circle r="9" fill="${S.rg("sonne", [[0, "#fffbe6"], [0.7, "#ffe680"], [1, "#ffd24a"]])}"/>`;
  S.teil({ id: "sonne", de: "die Sonne", syl: "SON-ne", it: "il sole", itSyl: "SO-le", en: "sun", x: 286, y: 26, kunst: k,
    tipp: "Im Sommer scheint die Sonne in der Toskana fast jeden Tag." });
}

/* =====================================================================
   2 — DER WEINBERG (Hang rechts, Rebzeilen in Reihen)
   ===================================================================== */
{
  let k = `<path d="M196 ${WAND_OBEN} Q210 100 240 94 Q275 88 320 92 L320 ${WAND_OBEN} Z" fill="${S.lg("hang", [[0, "#b7b06a"], [1, "#9a9a52"]])}"/>`;
  for (let i = 0; i < 13; i++) {
    const x0 = 214 + i * 8, y0 = 96 - Math.min(i, 8) * 0.3;
    k += `<path d="M${r(x0)} ${r(y0)} Q${r(x0 - 6 - i * 0.8)} ${r(y0 + 10)} ${r(x0 - 18 - i * 2.4)} ${WAND_OBEN}" stroke="#4f6a2c" stroke-width="${r(0.9 + i * 0.08)}" fill="none" stroke-dasharray="1.6 .5"/>`;
  }
  S.teil({ id: "weinberg", de: "der Weinberg", syl: "WEIN-berg", it: "il vigneto", itSyl: "vi-GNE-to", en: "vineyard", x: 258, y: WAND_OBEN, kunst: um(258, WAND_OBEN, k),
    tipp: "Aus den Trauben der Toskana macht man Chianti-Wein." });
}

/* =====================================================================
   3 — DAS LANDHAUS (Podere auf der Hügelkuppe)
   ===================================================================== */
{
  const X = 166, Y = 88;
  let k = `<path d="M110 ${WAND_OBEN} L110 96 Q138 84 168 86 Q196 86 214 98 L214 ${WAND_OBEN} Z" fill="${S.lg("kuppe", [[0, "#c7b679"], [1, "#a99c5c"]])}"/>`;
  /* Felder in Streifen */
  for (let i = 0; i < 6; i++) k += `<path d="M110 ${98 + i * 3.4} Q160 ${90 + i * 4} 214 ${100 + i * 3}" stroke="${i % 2 ? "#b9a768" : "#d2c38a"}" stroke-width="1.6" fill="none" opacity=".6"/>`;
  /* Haus: Bruchstein, Ziegeldach, Taubenturm */
  const hx = X - 12;
  k += `<rect x="${hx}" y="${Y - 10}" width="22" height="10" fill="${BRUCH}"/><path d="M${hx - 1} ${Y - 10} L${hx + 11} ${Y - 14} L${hx + 23} ${Y - 10} Z" fill="${S.lg("dach", [[0, "#c8693c"], [1, "#9c4a26"]])}"/>`;
  k += `<rect x="${hx + 16}" y="${Y - 18}" width="7" height="18" fill="${BRUCH}"/><path d="M${hx + 15.4} ${Y - 18} L${hx + 19.5} ${Y - 21} L${hx + 23.6} ${Y - 18} Z" fill="#b5592e"/>`;
  k += `<rect x="${hx + 18}" y="${Y - 16}" width="1" height="1" fill="#3a2a1c"/><rect x="${hx + 20}" y="${Y - 16}" width="1" height="1" fill="#3a2a1c"/>`;
  for (const wx of [hx + 3, hx + 8, hx + 13]) k += `<rect x="${wx}" y="${Y - 7.6}" width="1.6" height="2.4" fill="#3a2a1c"/><rect x="${wx - 0.5}" y="${Y - 7.6}" width=".5" height="2.4" fill="#3f7a52"/>`;
  k += `<rect x="${hx + 9}" y="${Y - 3.6}" width="2.4" height="3.6" fill="#4a3220"/>`;
  k += `<rect x="${hx}" y="${Y - 10}" width="23" height="10" fill="#fff" opacity=".1"/>`;
  /* Zypressen am Haus */
  k += zypresse(hx - 4, Y, 11, 3) + zypresse(hx - 8, Y + 1, 9, 2.6);
  S.teil({ id: "landhaus", de: "das Landhaus", syl: "LAND-haus", it: "la casa di campagna", itSyl: "CA-sa di cam-PA-gna", en: "farmhouse", x: X, y: Y, kunst: um(X, Y, k),
    tipp: "Ein Landhaus auf dem Hügel heißt in der Toskana „Podere“." });
}

/* =====================================================================
   4 — DIE ZYPRESSENALLEE (weiße Straße in Kurven zum Landhaus)
   ===================================================================== */
{
  const X = 190, Y = WAND_OBEN;
  /* Straße: Kehren vom Tal hinauf */
  const weg = [[214, 118], [196, 113], [186, 109], [196, 104.5], [190, 100], [178, 96.5], [172, 92], [164, 88.5]];
  let d = `M${weg[0][0]} ${weg[0][1]}`;
  for (let i = 1; i < weg.length; i++) d += ` L${weg[i][0]} ${weg[i][1]}`;
  let k = `<path d="${d}" stroke="#e9dfc6" stroke-width="2.2" fill="none" stroke-linejoin="round"/><path d="${d}" stroke="#d6c9a8" stroke-width=".6" fill="none" stroke-dasharray="1 1.4"/>`;
  /* Zypressen beidseits, hinten kleiner */
  for (let i = 0; i < weg.length - 1; i++) {
    const [ax, ay] = weg[i], [bx, by] = weg[i + 1];
    for (let t = 0.15; t < 1; t += 0.42) {
      const x = ax + (bx - ax) * t, y = ay + (by - ay) * t, h = 4 + (y - 86) * 0.32;
      k += zypresse(r(x + 2.4), r(y + 0.6), h, h * 0.24) + zypresse(r(x - 2.4), r(y - 0.2), h * 0.95, h * 0.23);
    }
  }
  S.teil({ id: "zypresse2", de: "die Zypressenallee", syl: "Zy-PRES-sen-al-lee", it: "il viale dei cipressi", itSyl: "VIA-le dei ci-PRES-si", en: "cypress avenue", x: X, y: Y, kunst: um(X, Y, k),
    tipp: "Die Straße mit den Zypressen schlängelt sich den Hügel hinauf." });
}

/* =====================================================================
   5 — DIE ZYPRESSE (einzeln auf dem Hügel rechts)
   ===================================================================== */
{
  let k = `<ellipse cx="0" cy="0" rx="4" ry=".8" fill="#5a5a30" opacity=".5"/>` + zypresse(0, 0, 28, 6);
  S.teil({ id: "zypresse", de: "die Zypresse", syl: "Zy-PRES-se", it: "il cipresso", itSyl: "ci-PRES-so", en: "cypress", x: 300, y: 91, kunst: k,
    tipp: "Die Zypresse wächst schmal und hoch – wie eine grüne Flamme." });
}

/* =====================================================================
   6 — DER OLIVENBAUM (auf dem Hang vor dem Landhaus)
   ===================================================================== */
{
  let k = schatten(0, 0.2, 9, 1.2, 0.25);
  k += `<path d="M-1.6 0 Q-2.6 -4 -1 -7 Q-3 -9 -4.6 -11 M1.6 0 Q2 -4 .6 -7 Q3 -9.6 4.6 -11 M0 -6 L0 -12" stroke="#6e6250" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 26; i++) {
    const a = rnd() * Math.PI * 2, rr = rnd(), x = Math.cos(a) * 10 * rr, y = -15 + Math.sin(a) * 5.4 * rr;
    k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(2.2 + rnd() * 1.6)}" ry="${r(1.5 + rnd())}" fill="${["#8a9a6a", "#9fae80", "#768a58", "#b3bf98"][i % 4]}" opacity=".95"/>`;
  }
  S.teil({ id: "olivenbaum", de: "der Olivenbaum", syl: "O-LI-ven-baum", it: "l'olivo", itSyl: "o-LI-vo", en: "olive tree", x: 226, y: 113, kunst: k,
    tipp: "Olivenbäume werden Hunderte Jahre alt. Ihre Blätter glänzen silbrig." });
}

/* =====================================================================
   7 — DIE BRÜSTUNG der Piazza (Mauer aus Bruchstein, Abdeckplatten)
   ===================================================================== */
S.hinten("");
{
  let k = `<rect x="118" y="${WAND_OBEN}" width="202" height="${WAND_FUSS - WAND_OBEN}" fill="${BRUCH}"/>`;
  k += `<rect x="118" y="${WAND_OBEN}" width="202" height="${WAND_FUSS - WAND_OBEN}" fill="${S.lg("mauerlicht", [[0, "#fff", 0.12], [1, "#000", 0.18]])}"/>`;
  k += `<rect x="116" y="${WAND_OBEN - 2.4}" width="204" height="3.2" fill="${S.lg("abdeck", [[0, "#e2d6bc"], [1, "#b7a888"]])}"/>`;
  for (let x = 120; x < 320; x += 16) k += `<line x1="${x}" y1="${WAND_OBEN - 2.4}" x2="${x}" y2="${WAND_OBEN + 0.8}" stroke="#9b8c70" stroke-width=".35"/>`;
  k += `<rect x="118" y="${WAND_FUSS - 3}" width="202" height="3" fill="#000" opacity=".12"/>`;
  S.teil({ id: "mauer", de: "die Mauer", syl: "MAU-er", it: "il muro", itSyl: "MU-ro", en: "wall", x: 219, y: WAND_FUSS, kunst: um(219, WAND_FUSS, k),
    tipp: "Von der Mauer der Piazza schaut man weit über das Tal." });
}

/* =====================================================================
   8 — DAS CAFÉ (die Bar an der Piazza): Hausfront, Tür, Fenster
   ===================================================================== */
const HAUS = { x1: 120, boden: WAND_FUSS };
{
  let k = `<rect x="0" y="0" width="${HAUS.x1}" height="${HAUS.boden}" fill="${PUTZ}"/>`;
  k += `<rect x="0" y="0" width="${HAUS.x1}" height="${HAUS.boden}" fill="${S.lg("hauslicht", [[0, "#000", 0.06], [0.6, "#fff", 0.06], [1, "#000", 0.14]], 0, 0, 1, 0)}"/>`;
  /* Eckquader aus Stein rechts */
  for (let y = 0; y < HAUS.boden; y += 9) k += `<rect x="${HAUS.x1 - ((y / 9) % 2 ? 8 : 11)}" y="${y + 0.4}" width="${(y / 9) % 2 ? 8 : 11}" height="8.4" rx=".6" fill="#cbb896" stroke="#a89474" stroke-width=".3"/>`;
  /* Sockel */
  k += `<rect x="0" y="${HAUS.boden - 8}" width="${HAUS.x1}" height="8" fill="#b9a585"/><rect x="0" y="${HAUS.boden - 8}" width="${HAUS.x1}" height="1" fill="#d8c8a8"/>`;
  /* Tür mit Ziegelbogen, Perlenvorhang, dunkles Inneres */
  const T = { x: 70, b: 36, o: 80 };
  k += `<path d="M${T.x - 2} ${HAUS.boden} L${T.x - 2} ${T.o + 6} A${T.b / 2 + 2} ${T.b / 2 + 2} 0 0 1 ${T.x + T.b + 2} ${T.o + 6} L${T.x + T.b + 2} ${HAUS.boden} Z" fill="#a8542f"/>`;
  for (let i = 0; i <= 10; i++) { const a = Math.PI + i * Math.PI / 10, cx = T.x + T.b / 2, cy = T.o + 6; k += `<line x1="${r(cx + Math.cos(a) * (T.b / 2))}" y1="${r(cy + Math.sin(a) * (T.b / 2))}" x2="${r(cx + Math.cos(a) * (T.b / 2 + 2))}" y2="${r(cy + Math.sin(a) * (T.b / 2 + 2))}" stroke="#7d3b1f" stroke-width=".35"/>`; }
  k += `<path d="M${T.x} ${HAUS.boden} L${T.x} ${T.o + 6} A${T.b / 2} ${T.b / 2} 0 0 1 ${T.x + T.b} ${T.o + 6} L${T.x + T.b} ${HAUS.boden} Z" fill="${S.lg("innen", [[0, "#2a1c12"], [1, "#4a3424"]])}"/>`;
  /* Theke und Flaschenregal im Halbdunkel */
  k += `<rect x="${T.x + 4}" y="${HAUS.boden - 30}" width="${T.b - 8}" height="2" fill="#6b4a2c" opacity=".8"/>`;
  for (let i = 0; i < 9; i++) k += `<rect x="${r(T.x + 6 + i * 3.4)}" y="${HAUS.boden - 36}" width="1.6" height="6" rx=".6" fill="${["#2f6b4a", "#7a2a1e", "#c9a23a", "#3a5a8a"][i % 4]}" opacity=".7"/>`;
  k += `<rect x="${T.x + 4}" y="${HAUS.boden - 22}" width="${T.b - 8}" height="20" fill="#5a3e28" opacity=".7"/>`;
  /* Perlenvorhang */
  for (let x = T.x + 1.4; x < T.x + T.b - 1; x += 2) k += `<line x1="${r(x)}" y1="${T.o + 4}" x2="${r(x)}" y2="${HAUS.boden - 2}" stroke="${Math.round(x) % 3 ? "#c9a96e" : "#9a2e24"}" stroke-width=".5" stroke-dasharray="1.2 .5" opacity=".75"/>`;
  /* Fenster der Gelateria (Rahmen) */
  k += `<rect x="6" y="86" width="44" height="56" fill="#3c4a44"/><rect x="8" y="88" width="40" height="52" fill="${S.lg("fensterinnen", [[0, "#46534d"], [1, "#2a3330"]])}"/>`;
  k += `<rect x="4" y="141" width="48" height="2.6" fill="#d8c8a8"/>`;
  /* Fenster oben mit Steinrahmen */
  k += `<rect x="24" y="2" width="30" height="40" fill="#d8c8a8"/><rect x="27" y="5" width="24" height="36" fill="${S.lg("glas", [[0, "#6b8494"], [1, "#3c4e5a"]])}"/>`;
  k += `<line x1="39" y1="5" x2="39" y2="41" stroke="#efe8d8" stroke-width="1"/><line x1="27" y1="20" x2="51" y2="20" stroke="#efe8d8" stroke-width=".8"/><path d="M28 6 L36 6 L28 18 Z" fill="#fff" opacity=".18"/>`;
  k += `<rect x="86" y="2" width="22" height="40" fill="#d8c8a8"/><rect x="88.6" y="5" width="16.8" height="36" fill="${S.lg("glas", [[0, "#6b8494"], [1, "#3c4e5a"]])}"/>`;
  k += `<rect x="86.6" y="5" width="2" height="36" fill="${GRUEN_L}"/><rect x="105.4" y="5" width="2" height="36" fill="${GRUEN_L}"/>`;
  /* Schild „BAR“ über der Tür */
  S.teil({ id: "cafe", de: "das Café", syl: "ca-FÉ", it: "il bar", itSyl: "BAR", en: "café", x: HAUS.x1 / 2, y: HAUS.boden, steht: true, kunst: um(HAUS.x1 / 2, HAUS.boden, k),
    tipp: "Ein Café heißt in Italien „Bar“. Man trinkt den Espresso oft im Stehen an der Theke." });
}

/* =====================================================================
   9 — DER FENSTERLADEN (grüne Persiane oben, mit Geranien)
   ===================================================================== */
{
  let k = "";
  for (const [x0, dir] of [[14, 1], [51, -1]]) {
    k += `<rect x="${x0}" y="4" width="13" height="38" fill="${GRUEN_L}" stroke="#244a31" stroke-width=".4"/>`;
    for (let y = 7; y < 40; y += 2) k += `<line x1="${x0 + 1.4}" y1="${y}" x2="${x0 + 11.6}" y2="${y}" stroke="#244a31" stroke-width=".5"/>`;
    k += `<rect x="${x0 + 1}" y="22" width="11" height="1.4" fill="#244a31"/><circle cx="${dir > 0 ? x0 + 11.4 : x0 + 1.6}" cy="23" r=".6" fill="#2a2a2a"/>`;
  }
  /* Blumenkasten mit roten Geranien */
  k += `<rect x="25" y="42" width="28" height="5" rx="1" fill="${TERRA}"/>`;
  for (let i = 0; i < 14; i++) k += `<circle cx="${r(26 + rnd() * 26)}" cy="${r(39.6 + rnd() * 3)}" r="${r(1 + rnd() * 0.7)}" fill="${rnd() < 0.55 ? "#cf2a2a" : "#4f7d3a"}"/>`;
  S.teil({ id: "fensterladen", de: "der Fensterladen", syl: "FENS-ter-la-den", it: "la persiana", itSyl: "per-SIA-na", en: "shutter", x: 39, y: 47, kunst: um(39, 47, k),
    tipp: "Mittags macht man die Fensterläden zu. So bleibt es drinnen kühl." });
}

/* =====================================================================
   10 — DIE FLAGGE (Trikolore am Halter)
   ===================================================================== */
{
  let k = `<line x1="0" y1="0" x2="16" y2="-14" stroke="#3a3a3a" stroke-width=".9"/><rect x="-1.4" y="-1.4" width="2.8" height="2.8" fill="#3a3a3a"/>`;
  const p = (a) => `M${r(5 + a)} ${r(-4.4 - a * 0.875)} L${r(5 + a + 3.5)} ${r(-4.4 - (a + 3.5) * 0.875)} L${r(5 + a + 4.6)} ${r(-4.4 - (a + 3.5) * 0.875 + 18)} L${r(5 + a + 1)} ${r(-4.4 - a * 0.875 + 18.4)} Z`;
  k += `<path d="${p(0)}" fill="#008c45"/><path d="${p(3.5)}" fill="#f4f5f0"/><path d="${p(7)}" fill="#cd212a"/>`;
  k += `<path d="M5 -4.4 Q10 4 9 14 L6 14.2 Q7 4 5 -4.4 Z" fill="#000" opacity=".1"/>`;
  S.teil({ id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: 112, y: 46, kunst: k,
    tipp: "Die Flagge Italiens ist grün, weiß und rot." });
}

/* =====================================================================
   11 — DIE MARKISE über Tür und Fenster
   ===================================================================== */
{
  let k = `<path d="M2 0 L110 0 L114 9 L-2 9 Z" fill="url(#${S.id("markise")})"/>`;
  k += `<path d="M2 0 L110 0 L114 9 L-2 9 Z" fill="${S.lg("markiselicht", [[0, "#000", 0.2], [1, "#fff", 0.1]])}"/>`;
  k += `<rect x="-2" y="9" width="116" height="4.4" fill="#2f6b4a"/>`;
  let saum = "M-2 13.4";
  for (let x = -2; x < 114; x += 6.44) saum += ` Q${r(x + 3.2)} 16.4 ${r(x + 6.44)} 13.4`;
  k += `<path d="${saum} Z" fill="#2f6b4a"/><path d="${saum}" stroke="#f3ecd8" stroke-width=".3" fill="none"/>`;
  k += `<text x="56" y="12.4" font-size="3.2" text-anchor="middle" fill="#f3ecd8" font-family="Georgia,serif" letter-spacing="1">BAR · GELATERIA</text>`;
  k += `<rect x="-2" y="9" width="116" height="4" fill="#000" opacity=".06"/>`;
  S.teil({ id: "markise", de: "die Markise", syl: "Mar-KI-se", it: "la tenda da sole", itSyl: "TEN-da da SO-le", en: "awning", x: 56, y: 65, kunst: `<g transform="translate(-56 -16)">${k}</g>`,
    tipp: "Die Markise gibt Schatten – mittags ist es in der Toskana sehr heiß." });
}

/* =====================================================================
   12 — DAS EIS (die Eistheke im Fenster der Gelateria)
   ===================================================================== */
{
  let k = "";
  /* Theke: Edelstahl, schräge Glasscheibe, Wannen mit Eis-Bergen */
  k += `<rect x="9" y="116" width="38" height="24" fill="${S.lg("theke", [[0, "#d9dde0"], [1, "#9aa2a8"]])}"/>`;
  const sorten = [["#9ec15a", "Pistacchio"], ["#f2e7a6", "Limone"], ["#f19aa8", "Fragola"], ["#6b3e26", "Cioccolato"], ["#f6efe2", "Stracciatella"], ["#e8a04a", "Albicocca"]];
  sorten.forEach(([c], i) => {
    const x = 11 + (i % 3) * 12, y = i < 3 ? 108 : 116;
    k += `<rect x="${x}" y="${y}" width="11" height="3" fill="#c9cfd4"/>`;
    k += `<path d="M${x + 0.6} ${y} Q${x + 2} ${y - 5} ${x + 5.5} ${y - 6} Q${x + 9} ${y - 5} ${x + 10.4} ${y} Z" fill="${c}"/>`;
    k += `<path d="M${x + 2.4} ${y - 2.6} q2 -2.6 5 -1.6" stroke="#fff" stroke-width=".5" opacity=".5" fill="none"/>`;
    if (i === 4) for (let j = 0; j < 7; j++) k += `<circle cx="${r(x + 2 + rnd() * 7)}" cy="${r(y - 1 - rnd() * 3.6)}" r=".35" fill="#3a2214"/>`;
    if (i === 0) for (let j = 0; j < 4; j++) k += `<circle cx="${r(x + 3 + rnd() * 5)}" cy="${r(y - 1.5 - rnd() * 3)}" r=".4" fill="#5f8a2a"/>`;
    if (i === 1) k += `<ellipse cx="${x + 5.5}" cy="${y - 5.8}" rx="1.8" ry="1" fill="#f2d23a"/>`;
    if (i === 2) k += `<circle cx="${x + 5}" cy="${y - 5.6}" r="1.1" fill="#c9283e"/>`;
  });
  k += `<path d="M9 104 L47 104 L47 107 L9 114 Z" fill="#dfeef2" opacity=".25"/>`;
  k += `<rect x="9" y="128" width="38" height="1" fill="#7d868d"/><text x="28" y="136" font-size="3.4" text-anchor="middle" fill="#2f6b4a" font-family="Georgia,serif" font-style="italic">Gelato artigianale</text>`;
  /* Waffeltüten im Halter */
  for (let i = 0; i < 4; i++) k += `<path d="M${38 + i * 2.2} 102 l1 -6 h1.6 l1 6 Z" fill="#d9a35b" stroke="#a8742f" stroke-width=".2"/>`;
  S.teil({ id: "eis", de: "das Eis", syl: "EIS", it: "il gelato", itSyl: "ge-LA-to", en: "ice cream", x: 28, y: 140, kunst: um(28, 140, k),
    tipp: "Italienisches Eis heißt „Gelato“. Es ist cremig und wird jeden Tag frisch gemacht." });
}

/* =====================================================================
   13 — DIE GONDEL (Reiseplakat „Venezia“ neben der Tür)
   ===================================================================== */
{
  let k = `<rect x="-8" y="-27" width="16" height="25" fill="#f2ead6" stroke="#8a7a5a" stroke-width=".4"/>`;
  k += `<rect x="-7" y="-26" width="14" height="15" fill="${S.lg("plakat", [[0, "#f3b45a"], [1, "#f6dfa0"]])}"/>`;
  /* Kirchenkuppel und Campanile im Hintergrund (Venedig) */
  k += `<path d="M-6 -15 L-6 -18 Q-3 -21 0 -18 L0 -15 Z M2 -15 L2 -23 L3.6 -24.6 L5.2 -23 L5.2 -15 Z" fill="#c87a4a" opacity=".8"/>`;
  k += `<rect x="-7" y="-15" width="14" height="4" fill="#2f6aa0"/><path d="M-7 -13 q2 -.6 4 0 t4 0 t4 0 t2 0" stroke="#8fc0e0" stroke-width=".3" fill="none"/>`;
  /* Gondel: schwarz, lang, hochgezogenes Heck, Bugeisen „Ferro“ */
  k += `<path d="M-6.4 -14.4 Q-1 -12.4 5.4 -14 Q6 -16.4 5.4 -17.6 L6.6 -17.2 L6.2 -14 Q.4 -11.4 -5.6 -13.2 Q-6.8 -13.8 -6.4 -14.4 Z" fill="#141414"/>`;
  k += `<path d="M5.4 -17.6 h1.6 M5.6 -16.6 h1.2 M5.6 -15.6 h1.2" stroke="#e0e0e0" stroke-width=".3"/>`;
  k += `<path d="M-4.4 -14 L-5.6 -19.6" stroke="#2a1c12" stroke-width=".3"/><circle cx="-4.6" cy="-15" r=".6" fill="#2a2a2a"/>`;
  k += `<text x="0" y="-6" font-size="3.4" text-anchor="middle" fill="#1f4a7a" font-family="Georgia,serif" font-weight="bold" letter-spacing=".4">VENEZIA</text>`;
  k += `<text x="0" y="-3.2" font-size="1.6" text-anchor="middle" fill="#6a5a3a" font-family="Arial">in treno da Firenze</text>`;
  S.teil({ id: "gondel", de: "die Gondel", syl: "GON-del", it: "la gondola", itSyl: "GON-do-la", en: "gondola", x: 59, y: 120, kunst: k,
    tipp: "Die Gondel fährt in Venedig über die Kanäle. Das Plakat wirbt für eine Reise mit dem Zug." });
}

/* =====================================================================
   14 — DER ZITRONENBAUM im Terrakotta-Topf neben der Tür
   ===================================================================== */
{
  let k = schatten(0, 0.4, 10, 1.4, 0.3);
  k += `<path d="M-8 -14 L8 -14 L6 0 L-6 0 Z" fill="${TERRA}"/><rect x="-9" y="-16" width="18" height="3" rx="1" fill="#c8693c"/>`;
  k += `<path d="M-5 -10 Q0 -8 5 -10" stroke="#9c4a26" stroke-width=".6" fill="none"/><circle cx="0" cy="-7" r="1.4" fill="none" stroke="#9c4a26" stroke-width=".5"/>`;
  k += `<path d="M0 -16 L0 -30" stroke="#6b5232" stroke-width="1.4"/>`;
  for (let i = 0; i < 90; i++) { const a = rnd() * Math.PI * 2, q = Math.sqrt(rnd()); k += `<ellipse cx="${r(Math.cos(a) * 11 * q)}" cy="${r(-40 + Math.sin(a) * 10 * q)}" rx="2.2" ry="1.2" fill="${["#2f6a2a", "#3f7f34", "#2a5a24"][i % 3]}" transform="rotate(${Math.round(rnd() * 180)} ${r(Math.cos(a) * 11 * q)} ${r(-40 + Math.sin(a) * 10 * q)})"/>`; }
  for (const [x, y] of [[-6, -36], [4, -44], [7, -35], [-2, -32], [-8, -43], [2, -38]]) k += `<ellipse cx="${x}" cy="${y}" rx="1.9" ry="1.5" fill="${S.rg("zitr", [[0, "#fff38a"], [0.7, "#f2d02a"], [1, "#d4a817"]], 0.35, 0.3)}"/>`;
  S.teil({ id: "zitronenbaum", de: "der Zitronenbaum", syl: "zi-TRO-nen-baum", it: "l'albero di limone", itSyl: "AL-be-ro di li-MO-ne", en: "lemon tree", x: 110, y: 158, steht: true, kunst: k,
    tipp: "Im Winter kommen die Zitronenbäume ins Haus – in die „Limonaia“." });
}

/* =====================================================================
   15 — DIE VESPA (an der Mauer geparkt)
   ===================================================================== */
{
  const X = 268, Y = 156;
  const LACK = S.lg("lack", [[0, "#c9eadb"], [0.45, "#9fd6c0"], [1, "#6fae96"]]);
  let k = schatten(0, 0.4, 34, 2, 0.32);
  const rad = (x) => `<circle cx="${x}" cy="-7" r="7" fill="#1e1e20"/><circle cx="${x}" cy="-7" r="4.4" fill="${S.rg("felge", [[0, "#f0f2f3"], [1, "#9aa2a8"]])}"/><circle cx="${x}" cy="-7" r="1.4" fill="#5d666c"/>` +
    [0, 72, 144, 216, 288].map((a) => `<line x1="${x}" y1="-7" x2="${r(x + Math.cos(a * Math.PI / 180) * 4)}" y2="${r(-7 + Math.sin(a * Math.PI / 180) * 4)}" stroke="#7d868d" stroke-width=".6"/>`).join("");
  k += rad(-22) + rad(20);
  /* Seitenhaube hinten (gewölbt), Trittbrett, Beinschild vorn */
  k += `<path d="M6 -10 Q8 -24 22 -25 Q32 -25 33 -15 Q33 -9 28 -9 Q26 -15 20 -15 Q14 -15 13 -9 L6 -9 Z" fill="${LACK}"/>`;
  k += `<path d="M10 -22 Q20 -26 30 -20" stroke="#e8f7f0" stroke-width=".8" opacity=".7" fill="none"/>`;
  k += `<rect x="-16" y="-11" width="24" height="3" rx="1" fill="#3a3a3c"/>`;
  k += `<path d="M-16 -9 L-14 -38 Q-13 -41 -10 -41 L-8 -41 Q-9 -24 -10 -9 Z" fill="${LACK}"/>`;
  k += `<path d="M-14.4 -36 L-12.6 -12" stroke="#fff" stroke-width=".8" opacity=".5"/>`;
  /* Kotflügel vorn mit „Krawatte“ und Chromwappen */
  k += `<path d="M-30 -9 Q-30 -17 -22 -17 Q-15 -17 -14 -11 L-16 -11 Q-17 -14.6 -22 -14.6 Q-27 -14.6 -27.6 -9 Z" fill="${LACK}"/>`;
  k += `<path d="M-15 -36 L-18 -33 L-15 -30 Z" fill="#d6dbde"/><circle cx="-21" cy="-16.4" r=".8" fill="#e6eaec"/>`;
  /* Sitzbank, Lenker, runder Scheinwerfer, Spiegel */
  k += `<path d="M6 -26 Q18 -29 30 -26 L30 -24 Q18 -26.4 6 -24 Z" fill="#6b4a2c"/><path d="M6 -26 Q18 -29 30 -26" stroke="#8a6440" stroke-width=".5" fill="none"/>`;
  k += `<path d="M-10 -41 L-9 -47" stroke="#9aa2a8" stroke-width="1.2"/><path d="M-16 -47 Q-9 -49 -2 -47" stroke="${LACK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  k += `<circle cx="-13" cy="-48" r="2.6" fill="#e6eaec"/><circle cx="-13" cy="-48" r="1.8" fill="${S.rg("lampe", [[0, "#fffbe6"], [1, "#c9d2d8"]])}"/>`;
  k += `<path d="M-2 -47 l1.2 -4 M-1.8 -51.6 l2 -.4" stroke="#7d868d" stroke-width=".5"/><ellipse cx=".9" cy="-52" rx="1.4" ry="1" fill="#c9d2d8"/>`;
  k += `<text x="20" y="-17.6" font-size="3" text-anchor="middle" fill="#e8f7f0" font-family="Georgia,serif" font-style="italic">Vespa</text>`;
  /* Seitenständer */
  k += `<path d="M2 -9 L4 0" stroke="#3a3a3c" stroke-width=".8"/>`;
  S.teil({ id: "vespa", de: "der Motorroller", syl: "MO-tor-rol-ler", it: "la Vespa", itSyl: "VE-spa", en: "scooter", x: X, y: Y, steht: true, kunst: k,
    tipp: "Die Vespa ist ein berühmter Motorroller aus Italien. „Vespa“ heißt „Wespe“." });
}

/* =====================================================================
   16 — DER KELLNER (vor der Bar)
   ===================================================================== */
{
  B.mensch({}, 10);
  const m = B.mensch({ id: "b24b_kellner", geschlecht: "m", alter: "erwachsen", pose: "stehen", blick: 20, frisur: "kurz", haarfarbe: "schwarz", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "kellnerhemd" }, schuerze: { stueck: "schuerze", farbe: "schwarz" }, unterteil: { stueck: "anzughose" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 92);
  /* Geschirrtuch über dem linken Unterarm */
  S.teil({ id: "kellner", de: "der Kellner", syl: "KELL-ner", it: "il cameriere", itSyl: "ca-me-RIE-re", en: "waiter", x: 140, y: 176, kunst: knapp(m.svg),
    tipp: "Der Kellner fragt: „Prego, cosa desidera?“ – „Was möchten Sie?“" });
}

/* =====================================================================
   17 — DIE STÜHLE und 18 — DER TISCH (mit Lupe: das Essen)
   ===================================================================== */
const TI = { x: 206, boden: 190, vorn: 141, hinten: 131, bv: 50, bh: 38 };
const stuhl = () => {
  /* Bistrostuhl: Metallgestell, Sitz und Lehne aus Holzlatten, schräg von vorn */
  const sitz = -27, M = "#2f3a34";
  const HL = S.lg("latte", [[0, "#c08a52"], [1, "#8a5a30"]]);
  let k = schatten(1, 0.4, 12, 1.6, 0.3);
  /* hintere Beine (kürzer, höher stehend) und Lehnenpfosten */
  k += `<path d="M-6 -3 L-5.4 ${sitz - 2} L-6.6 ${sitz - 28} M7 -3 L6.4 ${sitz - 2} L7.6 ${sitz - 28}" stroke="${M}" stroke-width="1.1" fill="none"/>`;
  /* Lehne: drei Latten zwischen den Pfosten */
  for (const y of [sitz - 26, sitz - 20.6, sitz - 15.2]) k += `<path d="M-6.6 ${y} L7.6 ${y - 0.4} L7.5 ${y + 3.2} L-6.5 ${y + 3.6} Z" fill="${HL}"/><path d="M-6.6 ${y} L7.6 ${y - 0.4}" stroke="#d9a868" stroke-width=".4"/>`;
  /* Sitzfläche als Lattenrost von oben-schräg */
  k += `<path d="M-9 ${sitz + 1.6} L9 ${sitz + 1.6} L7.2 ${sitz - 3} L-6.6 ${sitz - 3} Z" fill="${HL}"/>`;
  for (const t of [0.25, 0.5, 0.75]) k += `<line x1="${r(-9 + 2.4 * t)}" y1="${r(sitz + 1.6 - 4.6 * t)}" x2="${r(9 - 1.8 * t)}" y2="${r(sitz + 1.6 - 4.6 * t)}" stroke="#6b4422" stroke-width=".35"/>`;
  k += `<rect x="-9" y="${sitz + 1.6}" width="18" height="1.4" fill="#6b4422"/>`;
  /* vordere Beine */
  k += `<path d="M-8.4 0 L-8.6 ${sitz + 3} M8.4 0 L8.6 ${sitz + 3}" stroke="${M}" stroke-width="1.3"/>`;
  k += `<path d="M-8.5 -9 L8.5 -9 M-8 -9 L-6 -11 M8 -9 L6.6 -11" stroke="${M}" stroke-width=".6" fill="none"/>`;
  return k;
};
S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: 172, y: TI.boden - 6, steht: true, kunst: stuhl() });

const tischUnter = [];
{
  const X = TI.x;
  let k = schatten(0, 0.4, 26, 2, 0.32);
  /* Gestell */
  k += `<path d="M${-TI.bv / 2 + 4} 0 L${-TI.bv / 2 + 5} ${TI.vorn - TI.boden + 6} M${TI.bv / 2 - 4} 0 L${TI.bv / 2 - 5} ${TI.vorn - TI.boden + 6}" stroke="#2f3a34" stroke-width="1.6"/>`;
  /* Leinentischdecke: Platte (Trapez) und herabhängende Front */
  const hv = TI.vorn - TI.boden, hh = TI.hinten - TI.boden;
  k += `<path d="M${-TI.bh / 2} ${hh} L${TI.bh / 2} ${hh} L${TI.bv / 2} ${hv} L${-TI.bv / 2} ${hv} Z" fill="${S.lg("decke", [[0, "#f4f1e8"], [1, "#e6e0d0"]])}"/>`;
  k += `<path d="M${-TI.bv / 2} ${hv} L${TI.bv / 2} ${hv} L${TI.bv / 2 + 1} ${hv + 14} Q${TI.bv / 4} ${hv + 15.4} 0 ${hv + 14.4} Q${-TI.bv / 4} ${hv + 15.4} ${-TI.bv / 2 - 1} ${hv + 14} Z" fill="${S.lg("deckefront", [[0, "#ece7da"], [1, "#d3cbb6"]])}"/>`;
  for (const x of [-16, -6, 4, 14]) k += `<path d="M${x} ${hv + 0.4} q-.6 7 .4 14" stroke="#cfc6b0" stroke-width=".5" fill="none"/>`;
  k += `<path d="M${-TI.bh / 2} ${hh + 4} L${TI.bh / 2} ${hh + 4}" stroke="#2f6aa0" stroke-width=".3" opacity=".4"/>`;
  /* auf dem Tisch — Positionen relativ zum Tisch (y = Höhe auf der Platte) */
  const top = (yy) => hh + (hv - hh) * yy;   // 0 hinten … 1 vorn
  const it = [];
  /* DER WEIN: Chianti-Fiasco mit Strohgeflecht und ein Glas */
  {
    const x = -15, y = top(0.3);
    let g = `<path d="M${x - 4} ${y} Q${x - 5.4} ${y - 5} ${x - 2.6} ${y - 8} L${x - 1} ${y - 9.4} L${x - 1} ${y - 15} L${x + 1} ${y - 15} L${x + 1} ${y - 9.4} L${x + 2.6} ${y - 8} Q${x + 5.4} ${y - 5} ${x + 4} ${y} Z" fill="${S.lg("fiasco", [[0, "#3a5a2a"], [1, "#1f3418"]], 0, 0, 1, 0)}"/>`;
    g += `<path d="M${x - 4.6} ${y - 1} Q${x - 5.4} ${y - 5} ${x - 3.6} ${y - 7} L${x + 3.6} ${y - 7} Q${x + 5.4} ${y - 5} ${x + 4.6} ${y - 1} Q${x} ${y + 0.6} ${x - 4.6} ${y - 1} Z" fill="${S.lg("stroh", [[0, "#e9c97a"], [1, "#b8913e"]], 0, 0, 1, 0)}"/>`;
    for (let i = 0; i < 6; i++) g += `<line x1="${r(x - 4 + i * 1.6)}" y1="${y - 6.8}" x2="${r(x - 4.4 + i * 1.7)}" y2="${y - 0.6}" stroke="#a07a2e" stroke-width=".3"/>`;
    g += `<rect x="${x - 1.2}" y="${y - 16.4}" width="2.4" height="1.6" fill="#b2322a"/>`;
    g += `<path d="M${x + 4} ${y - 0.2} h3.6 M${x + 5.8} ${y - 0.2} v-2.6 M${x + 4.2} ${y - 6.4} q1.6 3.6 3.2 0" stroke="#dfe8ec" stroke-width=".4" fill="none"/><path d="M${x + 4.5} ${y - 5.4} q1.3 2.8 2.6 0 Z" fill="#7a1424"/>`;
    k += g; it.push({ id: "wein", de: "der Wein", syl: "WEIN", it: "il vino", itSyl: "VI-no", en: "wine", x, y, kunst: flaeche(-5.4, -17, 13.6, 17.4),
      tipp: "Chianti-Wein kam früher in der dicken Flasche mit Stroh, dem „Fiasco“." });
  }
  /* DAS OLIVENÖL — Glasflasche, goldgrün */
  {
    const x = -4, y = top(0.15);
    let g = `<path d="M${x - 1.6} ${y} L${x - 1.6} ${y - 6} Q${x - 1.6} ${y - 7.4} ${x - 0.6} ${y - 8} L${x - 0.6} ${y - 10.6} L${x + 0.6} ${y - 10.6} L${x + 0.6} ${y - 8} Q${x + 1.6} ${y - 7.4} ${x + 1.6} ${y - 6} L${x + 1.6} ${y} Z" fill="${S.lg("oel", [[0, "#c9c23a"], [1, "#8a8a1e"]], 0, 0, 1, 0)}" opacity=".9"/>`;
    g += `<rect x="${x - 0.7}" y="${y - 11.8}" width="1.4" height="1.4" fill="#6b6b6b"/><path d="M${x - 1} ${y - 5.4} v4.4" stroke="#fff" stroke-width=".4" opacity=".6"/>`;
    k += g; it.push({ id: "olivenoel", de: "das Olivenöl", syl: "o-LI-ven-öl", it: "l'olio d'oliva", itSyl: "O-lio d'o-LI-va", en: "olive oil", x, y, kunst: flaeche(-2.2, -12, 4.4, 12.4) });
  }
  /* DIE ZITRONE — drei Zitronen in einer Keramikschale */
  {
    const x = 10, y = top(0.2);
    let g = `<path d="M${x - 5} ${y - 2.6} Q${x} ${y + 1.2} ${x + 5} ${y - 2.6} Z" fill="${S.lg("schale", [[0, "#3f6aa8"], [1, "#2a4a80"]])}"/>`;
    for (const [dx, dy] of [[-2.4, -3.4], [2, -3.6], [0, -5]]) g += `<ellipse cx="${x + dx}" cy="${y + dy}" rx="2.2" ry="1.6" fill="${S.rg("zitr", [[0, "#fff38a"], [0.7, "#f2d02a"], [1, "#d4a817"]], 0.35, 0.3)}"/>`;
    g += `<path d="M${x - 4} ${y - 2.4} h8" stroke="#f3e9c8" stroke-width=".3"/><path d="M${x + 0.4} ${y - 6.4} q1 -.8 1.8 -.4" stroke="#3f7f34" stroke-width=".5" fill="none"/>`;
    k += g; it.push({ id: "zitrone", de: "die Zitrone", syl: "Zi-TRO-ne", it: "il limone", itSyl: "li-MO-ne", en: "lemon", x, y, kunst: flaeche(-5.4, -7, 10.8, 7.4),
      tipp: "Aus Zitronen von der Amalfiküste macht man den Likör Limoncello." });
  }
  /* DIE PIZZA — Margherita auf dem Holzbrett */
  {
    const x = -10, y = top(0.86);
    let g = `<ellipse cx="${x}" cy="${y - 0.4}" rx="10.4" ry="3.2" fill="#a8743f"/><rect x="${x + 9}" y="${y - 1.4}" width="4" height="1.4" rx=".6" fill="#a8743f"/>`;
    g += `<ellipse cx="${x}" cy="${y - 1.2}" rx="9" ry="2.8" fill="${S.rg("rand", [[0, "#e9b26a"], [1, "#b8742e"]])}"/>`;
    g += `<ellipse cx="${x}" cy="${y - 1.4}" rx="7.6" ry="2.2" fill="#c9341f"/>`;
    for (const [dx, dy] of [[-4, -0.6], [-1, 0.2], [2.6, -0.8], [4.4, 0.2], [0.6, -1.4], [-3, 0.4]]) g += `<ellipse cx="${x + dx}" cy="${y - 1.4 + dy}" rx="1.4" ry=".6" fill="#f6efdc"/>`;
    for (const [dx, dy] of [[-2, -0.2], [3, -0.2], [0, 0.6]]) g += `<ellipse cx="${x + dx}" cy="${y - 1.6 + dy}" rx=".8" ry=".35" fill="#2f7a2a"/>`;
    for (let i = 0; i < 6; i++) g += `<circle cx="${r(x - 8 + rnd() * 16)}" cy="${r(y - 1.2 + (rnd() - 0.5) * 3.4)}" r=".35" fill="#5a2a10" opacity=".6"/>`;
    k += g; it.push({ id: "pizza", de: "die Pizza", syl: "PIZ-za", it: "la pizza", itSyl: "PIZ-za", en: "pizza", x, y, kunst: flaeche(-10.6, -4.4, 21.2, 5),
      tipp: "Die Pizza Margherita hat die Farben Italiens: Basilikum, Mozzarella und Tomate." });
  }
  /* DIE NUDELN — Spaghetti al pomodoro im tiefen Teller */
  {
    const x = 6, y = top(0.86);
    let g = `<ellipse cx="${x}" cy="${y - 0.6}" rx="7.4" ry="2.4" fill="#f7f6f2" stroke="#d8d4c8" stroke-width=".3"/>`;
    g += `<ellipse cx="${x}" cy="${y - 1.2}" rx="4.8" ry="1.6" fill="#e9c46a"/>`;
    for (let i = 0; i < 9; i++) g += `<path d="M${r(x - 4 + rnd() * 3)} ${r(y - 1 - rnd() * 1.4)} q${r(1 + rnd() * 2)} ${r(-1 - rnd())} ${r(3 + rnd() * 2)} 0" stroke="#f2d58a" stroke-width=".4" fill="none"/>`;
    g += `<ellipse cx="${x}" cy="${y - 2.2}" rx="2.4" ry=".9" fill="#c9341f"/><ellipse cx="${x + 0.6}" cy="${y - 2.6}" rx=".7" ry=".3" fill="#3f8a3a"/>`;
    g += `<path d="M${x + 3} ${y - 2} L${x + 7} ${y - 6.6}" stroke="#c9cfd4" stroke-width=".5"/>`;
    k += g; it.push({ id: "pasta", de: "die Nudeln", syl: "NU-deln", it: "la pasta", itSyl: "PA-sta", en: "pasta", x, y, kunst: flaeche(-7.6, -6.6, 15.2, 7),
      tipp: "In Italien isst man die Nudeln „al dente“ – mit etwas Biss." });
  }
  /* DER ESPRESSO — kleine dicke Tasse auf der Untertasse */
  {
    const x = 18, y = top(0.75);
    let g = `<ellipse cx="${x}" cy="${y - 0.3}" rx="3.4" ry=".9" fill="#f4f3ee" stroke="#d8d4c8" stroke-width=".25"/>`;
    g += `<path d="M${x - 1.8} ${y - 3.4} L${x + 1.8} ${y - 3.4} L${x + 1.4} ${y - 0.6} Q${x} ${y} ${x - 1.4} ${y - 0.6} Z" fill="${S.lg("tasse", [[0, "#ffffff"], [1, "#d8d4cc"]], 0, 0, 1, 0)}"/>`;
    g += `<ellipse cx="${x}" cy="${y - 3.4}" rx="1.8" ry=".5" fill="#6b3e1c"/><ellipse cx="${x}" cy="${y - 3.4}" rx="1.2" ry=".3" fill="#b8763a"/>`;
    g += `<path d="M${x + 1.7} ${y - 2.8} q1.2 .2 .9 1.1 q-.3 .7 -1.1 .5" stroke="#eeeae2" stroke-width=".5" fill="none"/>`;
    g += `<path d="M${x - 0.4} ${y - 4.6} q-.8 -1.2 0 -2.2 q.8 -1 0 -2" stroke="#fff" stroke-width=".35" opacity=".55" fill="none"/>`;
    g += `<rect x="${x + 2.4}" y="${y - 1}" width="2.4" height=".9" rx=".2" fill="#f2ead6"/>`;
    k += g; it.push({ id: "espresso", de: "der Espresso", syl: "Es-PRES-so", it: "il caffè", itSyl: "caf-FÈ", en: "espresso", x, y, kunst: flaeche(-3.6, -7, 8.6, 7.4),
      tipp: "Wer in Italien „un caffè“ bestellt, bekommt einen Espresso." });
  }
  it.forEach((u) => tischUnter.push(Object.assign(u, { x: X + u.x, y: TI.boden + u.y })));
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: X, y: TI.boden, steht: true, kunst: k,
    zoom: { x: X - 30, y: TI.hinten - 18, w: 60, h: 40 },
    unter: tischUnter });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/italien.js"));
console.log(aus);
