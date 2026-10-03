#!/usr/bin/env node
/* =====================================================================
   DAS REISEBÜRO (FASSUNG 852) — Bilderwelt neu
   ---------------------------------------------------------------------
   RECHERCHE (Berichte zu umgebauten Reisebüro-Filialen in Deutschland,
   z. B. „Beratungsinseln statt Tresen“, Katalogwände, Bildschirme):
   - Statt eines Schalters ein BERATUNGSTISCH: die Reiseberaterin sitzt
     auf dem Bürostuhl, die Kundin seitlich am Tisch; der Bildschirm ist
     so gedreht, dass beide die Angebote sehen. Auf dem Tisch: Kataloge,
     Flugticket bzw. Reiseunterlagen, der Reisepass der Kundin, oft ein
     kleiner Globus.
   - An der Wand die KATALOGWAND mit schräg gestellten Katalogen
     („Deutschland entdecken“: Städtereisen), große WELTKARTE mit
     Stecknadeln, PLAKATE mit Fernzielen (Japan, Ägypten, Weltstädte).
   - Frei im Raum der PROSPEKTSTÄNDER mit Länder-Prospekten (Europa).
   - Teppichfliesen, helle Wände, Akzentfarbe, Pflanze.
   Jedes Ziel (Kataloge, Prospekte, Plakate) ist einzeln antippbar und
   führt mit der Lupe in seine eigene Szene.
   Maßstab: Rückwand ≈ 46 Einheiten je Meter (Wandfuß y = 132),
   Beratungstisch ≈ 52 je Meter, vorn ≈ 60 je Meter. Fluchtpunkt (160 | 94).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "reisebuero", titel: "Das Reisebüro", emoji: "🧳", thema: "Reisen", kuerzel: "b11b", fassung: 852 });
const rnd = zufall(2024);
const r = B.r;
const T = (x, y, s, t, f = "#222", a = "middle", w = "normal", fam = "Arial,Helvetica,sans-serif", extra = "") =>
  `<text x="${r(x)}" y="${r(y)}" font-size="${s}" text-anchor="${a}" fill="${f}" font-family="${fam}" font-weight="${w}"${extra}>${t}</text>`;
const ZIEL_TIPP = "Antippen führt in diese Szene hinein.";

/* ---------- Stoffe ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WAND = S.lg("wand", [[0, "#f7f4ee"], [1, "#e9e3d8"]]);
const PETROL = "#0f6e7a", ORANGE = "#f08a24";
const HIMMEL = S.lg("himmel", [[0, "#5fb4e6"], [1, "#cfeefc"]]);
const ABEND = S.lg("abend", [[0, "#f6a04d"], [1, "#fde3b0"]]);
const NACHT = S.lg("nacht", [[0, "#1d2b55"], [1, "#4a5c9a"]]);
const MEER = S.lg("meer", [[0, "#1f8fc4"], [1, "#0e5f8f"]]);
const HOLZ = S.lg("holz", [[0, "#e4c9a0"], [1, "#c9a678"]]);
const WEISS = S.lg("weiss", [[0, "#ffffff"], [1, "#e6e8ea"]]);

/* =====================================================================
   KULISSE — Decke, Wand mit Akzentstreifen und Firmenname, Teppichboden
   ===================================================================== */
const WU = 132, VP = { x: 160, y: 94 };
S.hinten(`<rect x="0" y="0" width="320" height="12" fill="${S.lg("decke", [[0, "#f4f4f2"], [1, "#e2e2de"]])}"/><rect x="0" y="11.4" width="320" height="1.2" fill="#cfcfca"/>`);
for (const x of [40, 120, 200, 280]) S.hinten(`<rect x="${x - 12}" y="4" width="24" height="3" rx="1" fill="#fbfbf6"/><rect x="${x - 16}" y="7" width="32" height="10" fill="#fff" opacity=".18"/>`);
S.hinten(`<rect x="0" y="12" width="320" height="${WU - 12}" fill="${WAND}"/>`);
S.hinten(`<rect x="0" y="12" width="320" height="${WU - 12}" fill="${S.rg("wandlicht", [[0, "#fffaf0", 0.5], [1, "#fffaf0", 0]], 0.5, 0.2, 0.7)}"/>`);
/* Akzentstreifen in Petrol mit Orange, Firmenname */
S.hinten(`<rect x="0" y="12" width="320" height="9" fill="${PETROL}"/><rect x="0" y="21" width="320" height="1.4" fill="${ORANGE}"/>`);
S.hinten(T(160, 19, 6.2, "Reisebüro Fernweh", "#fff", "middle", "bold", "'Trebuchet MS',Arial,sans-serif", ' letter-spacing=".6"') +
  `<circle cx="112" cy="16.6" r="3" fill="${ORANGE}"/><circle cx="112" cy="16.6" r="1.6" fill="#ffd27a"/>`);
S.hinten(`<rect x="0" y="${WU - 3}" width="320" height="3" fill="#cfc8bb"/>`);
/* Teppichfliesen in Fluchtperspektive */
{
  let f = `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("boden", [[0, "#8d97a1"], [1, "#a7b0b8"]])}"/>`;
  for (let i = -14; i <= 14; i++) { const xw = VP.x + i * 18; f += `<line x1="${xw}" y1="${WU}" x2="${r(VP.x + (xw - VP.x) * (200 - VP.y) / (WU - VP.y))}" y2="200" stroke="#7d8790" stroke-width=".45"/>`; }
  for (const y of [136, 141.5, 148, 156.5, 167.5, 181.5, 199]) f += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#7d8790" stroke-width=".45"/>`;
  /* Fliesen im Wechsel leicht heller (Webrichtung) */
  f += `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("bodenlicht", [[0, "#000", 0.16], [0.4, "#000", 0], [1, "#fff", 0.08]])}"/>`;
  S.hinten(f);
}

/* ---------- Titelbilder der Ziele (Kasten 20 × 18, Himmel oben) ------- */
const MOTIV = {
  berlin: () => `<rect width="20" height="18" fill="${HIMMEL}"/><rect y="16" width="20" height="2" fill="#9fb48a"/><rect x="2.6" y="6.2" width="14.8" height="2.4" fill="#d8c39a"/><rect x="8" y="3.8" width="4" height="2.4" fill="#5d7f5a"/>` +
    [3, 5.4, 7.8, 11.2, 13.6, 16].map((x) => `<rect x="${x}" y="8.6" width="1.1" height="7.4" fill="#e6d4ae"/>`).join("") + `<rect x="2.4" y="15.6" width="15.2" height=".6" fill="#b9a479"/>`,
  hamburg: () => `<rect width="20" height="18" fill="${HIMMEL}"/><rect y="15" width="20" height="3" fill="${MEER}"/><rect x="3" y="10.4" width="14" height="4.8" fill="#8a4a32"/>` +
    `<path d="M3 10.6 L3 6.6 Q5 4.2 7.4 5.8 Q9.6 2.8 12 5 Q14.6 2.6 17 5.4 L17 10.6 Z" fill="#e8f3f8" stroke="#9cc2d6" stroke-width=".25"/><path d="M4 8 h12 M4 9.4 h12" stroke="#9cc2d6" stroke-width=".2"/>`,
  muenchen: () => `<rect width="20" height="18" fill="${HIMMEL}"/><path d="M0 12 L4 7 L8 11 L12 6 L16 10 L20 7 L20 16 L0 16 Z" fill="#c9d9e6"/><path d="M11 7.4 L12 6 L13 7.4 Z" fill="#fff"/>` +
    `<rect x="4.4" y="7" width="3.6" height="10" fill="#9a4b33"/><rect x="12" y="7" width="3.6" height="10" fill="#9a4b33"/><rect x="8" y="10" width="4" height="7" fill="#a85a3f"/>` +
    `<ellipse cx="6.2" cy="6.4" rx="2" ry="1.8" fill="#4f9a6c"/><ellipse cx="13.8" cy="6.4" rx="2" ry="1.8" fill="#4f9a6c"/><rect x="5.9" y="3.4" width=".6" height="1.6" fill="#4f9a6c"/><rect x="13.5" y="3.4" width=".6" height="1.6" fill="#4f9a6c"/>`,
  koeln: () => `<rect width="20" height="18" fill="${ABEND}"/><rect y="16" width="20" height="2" fill="${MEER}"/>` +
    `<path d="M3.6 16 L3.6 8 L5.6 1.6 L7.6 8 L7.6 16 Z M12.4 16 L12.4 8 L14.4 1.6 L16.4 8 L16.4 16 Z" fill="#4a4540"/><rect x="7.6" y="10" width="4.8" height="6" fill="#57514b"/><path d="M8.4 16 L8.4 12 Q10 10.4 11.6 12 L11.6 16 Z" fill="#2e2a26"/>`,
  dresden: () => `<rect width="20" height="18" fill="${ABEND}"/><rect y="16" width="20" height="2" fill="#5d8aa8"/><rect x="5" y="10" width="10" height="6" fill="#d9c7a3"/>` +
    `<path d="M5.6 10 Q5.6 4 10 4 Q14.4 4 14.4 10 Z" fill="#cdb98f"/><rect x="9.2" y="1.6" width="1.6" height="2.6" fill="#cdb98f"/><circle cx="10" cy="1.4" r=".5" fill="#e7c766"/>` +
    `<rect x="3.6" y="9" width="1.6" height="7" fill="#c9b48a"/><rect x="14.8" y="9" width="1.6" height="7" fill="#c9b48a"/>`,
  leipzig: () => `<rect width="20" height="18" fill="${HIMMEL}"/><rect y="15.4" width="20" height="2.6" fill="#7aa36a"/><rect y="13.4" width="20" height="2" fill="#5d8aa8"/>` +
    `<path d="M4 13.4 L4 10 L6 10 L6 7 L8 5 L12 5 L14 7 L14 10 L16 10 L16 13.4 Z" fill="#8e7d6a"/><path d="M8 5 Q10 2.4 12 5 Z" fill="#7a6a58"/><rect x="8.6" y="7.6" width="2.8" height="3.4" fill="#5e5144"/>`,
  magdeburg: () => `<rect width="20" height="18" fill="${HIMMEL}"/><rect y="15" width="20" height="3" fill="${MEER}"/>` +
    `<rect x="5" y="6" width="3" height="9" fill="#9b8f80"/><rect x="12" y="6" width="3" height="9" fill="#9b8f80"/><path d="M5 6 L6.5 1.6 L8 6 Z M12 6 L13.5 1.6 L15 6 Z" fill="#5f8f7a"/><rect x="8" y="9" width="4" height="6" fill="#a99d8d"/><path d="M8 9 L10 7 L12 9 Z" fill="#7d7266"/>`,
  italien: () => `<rect width="20" height="18" fill="${HIMMEL}"/><rect y="15.6" width="20" height="2.4" fill="#a8c97f"/>` +
    `<g transform="rotate(6 10 16)"><rect x="7.6" y="3" width="4.8" height="13" rx=".6" fill="#f4efe2"/>${[5, 7, 9, 11, 13].map((y) => `<rect x="7.4" y="${y}" width="5.2" height=".5" fill="#cfc6b0"/>`).join("")}<rect x="8.2" y="1.8" width="3.6" height="1.4" fill="#eee6d2"/></g>` +
    `<rect x="0" y="0" width="2" height="18" fill="#2a9a4a"/><rect x="2" y="0" width="1.4" height="18" fill="#fff" opacity=".8"/>`,
  rom: () => `<rect width="20" height="18" fill="${ABEND}"/><path d="M1.6 16 L1.6 8 Q10 4.6 18.4 8 L18.4 16 Z" fill="#c9a77a"/><path d="M12 5.8 Q16 6.4 18.4 8 L18.4 12 L12 10 Z" fill="#b08d60"/>` +
    [9.6, 13].map((y) => [3, 5.4, 7.8, 10.2, 12.6, 15].map((x) => `<path d="M${x} ${y + 2.4} L${x} ${y + 0.8} Q${x + 0.8} ${y} ${x + 1.6} ${y + 0.8} L${x + 1.6} ${y + 2.4} Z" fill="#6e5236"/>`).join("")).join(""),
  frankreich: () => `<rect width="20" height="18" fill="${HIMMEL}"/><rect y="16" width="20" height="2" fill="#8fb47a"/>` +
    `<path d="M10 1 L10.6 4 L11.4 9 L13.6 16 L11.6 16 Q10 12.6 8.4 16 L6.4 16 L8.6 9 L9.4 4 Z" fill="#6b5a4a"/><rect x="8.2" y="8.6" width="3.6" height=".8" fill="#4e4136"/><rect x="7.2" y="12.2" width="5.6" height=".8" fill="#4e4136"/>`,
  spanien: () => `<rect width="20" height="18" fill="${HIMMEL}"/><circle cx="15.4" cy="4" r="2.4" fill="#ffd34d"/><rect y="9.6" width="20" height="3.6" fill="${MEER}"/><path d="M0 13.2 Q10 11.6 20 13.2 L20 18 L0 18 Z" fill="#f2d79a"/>` +
    `<path d="M3 9.4 Q7 5.6 11 9.4 Z" fill="#e63b2e"/><path d="M5 9.4 Q7 6.2 9 9.4" fill="#ffd34d"/><line x1="7" y1="9" x2="7.6" y2="15" stroke="#6b5a4a" stroke-width=".4"/>`,
  griechenland: () => `<rect width="20" height="18" fill="${HIMMEL}"/><rect y="12.6" width="20" height="5.4" fill="${MEER}"/>` +
    `<rect x="2" y="8" width="6" height="5" fill="#fff"/><rect x="7" y="9.6" width="6" height="3.4" fill="#f4f4f2"/><rect x="12" y="7" width="6" height="6" fill="#fff"/><path d="M12.6 7 Q15 3.6 17.4 7 Z" fill="#2f63c4"/>` +
    `<rect x="3.6" y="10" width="1.2" height="1.6" fill="#2f63c4"/><rect x="14.4" y="9" width="1.2" height="1.6" fill="#2f63c4"/>`,
  tuerkei: () => `<rect width="20" height="18" fill="${ABEND}"/><rect y="14.4" width="20" height="3.6" fill="#24a3a3"/>` +
    `<rect x="5" y="10" width="10" height="4.4" fill="#d9cdb8"/><path d="M6.4 10 Q10 4.6 13.6 10 Z" fill="#b9ad97"/><rect x="9.7" y="4" width=".6" height="1.6" fill="#b9ad97"/>` +
    `<rect x="2.8" y="3.6" width="1" height="10.8" fill="#e3d8c4"/><path d="M2.8 3.6 L3.3 1.6 L3.8 3.6 Z" fill="#8a7d68"/><rect x="16.2" y="3.6" width="1" height="10.8" fill="#e3d8c4"/><path d="M16.2 3.6 L16.7 1.6 L17.2 3.6 Z" fill="#8a7d68"/>`,
  grossbritannien: () => `<rect width="20" height="18" fill="${S.lg("grau", [[0, "#9fb3c4"], [1, "#dfe7ec"]])}"/><rect y="15.4" width="20" height="2.6" fill="#6f7f8c"/>` +
    `<rect x="7" y="5" width="4.6" height="11" fill="#c9a96a"/><path d="M7 5 L9.3 1 L11.6 5 Z" fill="#5f5a4f"/><circle cx="9.3" cy="7.2" r="1.5" fill="#fbf6e6" stroke="#5f5a4f" stroke-width=".3"/>` +
    `<rect x="12.4" y="11" width="6.6" height="4.2" rx=".6" fill="#c8202a"/><rect x="13" y="11.6" width="5.4" height="1.2" fill="#f3e9c8"/><circle cx="14" cy="15.4" r=".7" fill="#222"/><circle cx="17.6" cy="15.4" r=".7" fill="#222"/>`,
};
/* Ein Katalog/Prospekt: Bild oben, Titelband unten (Kasten w × h) */
const titel = (x, y, w, h, motiv, name, farbe) => {
  const k = w / 20;
  return `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="#fff"/>` +
    `<g transform="translate(${r(x)} ${r(y)}) scale(${k.toFixed(3)})">${MOTIV[motiv]()}</g>` +
    `<rect x="${r(x)}" y="${r(y + 18 * k)}" width="${r(w)}" height="${r(h - 18 * k)}" fill="${farbe}"/>` +
    T(x + w / 2, y + 18 * k + (h - 18 * k) * 0.72, r(Math.min((h - 18 * k) * 0.62, w / (name.length * 0.8))), name, "#fff", "middle", "bold");
};

/* =====================================================================
   1 — DIE WELTKARTE (mit Stecknadeln) über dem Beratungstisch
   ===================================================================== */
{
  const W = 112, H = 56;
  let k = `<rect x="${-W / 2 - 1.4}" y="${-H - 1.4}" width="${W + 2.8}" height="${H + 2.8}" fill="#2b3036"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${S.lg("ozean", [[0, "#bfe0ee"], [1, "#9fcde2"]])}"/>`;
  for (let i = 1; i < 6; i++) k += `<line x1="${-W / 2}" y1="${r(-H + i * H / 6)}" x2="${W / 2}" y2="${r(-H + i * H / 6)}" stroke="#fff" stroke-width=".2" opacity=".6"/>`;
  for (let i = 1; i < 12; i++) k += `<line x1="${r(-W / 2 + i * W / 12)}" y1="${-H}" x2="${r(-W / 2 + i * W / 12)}" y2="0" stroke="#fff" stroke-width=".2" opacity=".6"/>`;
  const sx = W / 100, sy = H / 50, P = (pts) => "M" + pts.map(([a, b]) => `${r(-W / 2 + a * sx)} ${r(-H + b * sy)}`).join(" L") + " Z";
  const land = [
    [[8, 8], [22, 5], [34, 6], [40, 10], [34, 13], [31, 19], [27, 23], [23, 27], [20, 24], [14, 18], [8, 14]],
    [[36, 3], [44, 2], [45, 6], [40, 9]],
    [[27, 27], [33, 28], [38, 32], [36, 39], [32, 45], [30, 46], [29, 39], [26, 31]],
    [[47, 10], [52, 7], [58, 8], [57, 13], [52, 16], [48, 15]],
    [[46, 18], [54, 17], [60, 20], [62, 26], [58, 33], [55, 39], [52, 39], [50, 31], [46, 26], [44, 21]],
    [[57, 7], [72, 5], [88, 7], [93, 12], [87, 16], [83, 22], [77, 26], [73, 22], [70, 27], [67, 21], [62, 21], [59, 17], [57, 13]],
    [[80, 33], [88, 32], [91, 37], [86, 41], [80, 39]],
    [[89, 14], [91, 17], [89, 20], [88, 17]],
    [[45.2, 9.6], [46.6, 9], [46.8, 12], [45.4, 12.4]],
  ];
  const farben = ["#e8d7a6", "#f1f1ec", "#b7d39a", "#f2c49b", "#e9c27a", "#d6dd9a", "#f0b48a", "#d6dd9a", "#f2c49b"];
  land.forEach((p, i) => { k += `<path d="${P(p)}" fill="${farben[i]}" stroke="#8aa0a8" stroke-width=".3" stroke-linejoin="round"/>`; });
  /* Stecknadeln: Deutschland als Start, Fäden zu Fernzielen */
  const nadel = (a, b, f) => `<line x1="${r(-W / 2 + a * sx)}" y1="${r(-H + b * sy)}" x2="${r(-W / 2 + a * sx + 0.8)}" y2="${r(-H + b * sy - 2.4)}" stroke="#555" stroke-width=".3"/><circle cx="${r(-W / 2 + a * sx + 0.8)}" cy="${r(-H + b * sy - 2.6)}" r="1.1" fill="${f}"/>`;
  const de = [51, 11];
  for (const [a, b] of [[89, 16], [55, 21], [27, 13], [54, 13], [84, 36]]) k += `<path d="M${r(-W / 2 + de[0] * sx)} ${r(-H + de[1] * sy)} Q${r(-W / 2 + (de[0] + a) / 2 * sx)} ${r(-H + Math.min(de[1], b) * sy - 8)} ${r(-W / 2 + a * sx)} ${r(-H + b * sy)}" stroke="#d2342c" stroke-width=".35" stroke-dasharray="1 .7" fill="none"/>`;
  for (const [a, b, f] of [[51, 11, "#d2342c"], [89, 16, "#f08a24"], [55, 21, "#f08a24"], [27, 13, "#f08a24"], [54, 13, "#f08a24"], [84, 36, "#f08a24"]]) k += nadel(a, b, f);
  k += `<path d="M${-W / 2} ${-H} L${-W / 2 + 26} ${-H} L${-W / 2} ${-H + 30} Z" fill="#fff" opacity=".12"/>`;
  S.teil({ id: "rb_weltkarte", de: "die Weltkarte", syl: "WELT-kar-te", it: "il planisfero", itSyl: "pla-ni-SFE-ro", en: "world map", x: 167, y: 84, kunst: k,
    tipp: "Auf der Weltkarte zeigen die Nadeln die Reiseziele." });
}

/* =====================================================================
   2 — DIE PLAKATE: Japan, Ägypten, Weltstädte (jedes führt in seine Szene)
   ===================================================================== */
const PLAKAT = { y: 70, w: 26, h: 38 };
const plakat = (id, lupe, de, syl, it, itSyl, en, x, inhalt, name, farbe) => {
  const { w, h } = PLAKAT;
  let k = `<rect x="${-w / 2 - 0.8}" y="${-h - 0.8}" width="${w + 1.6}" height="${h + 1.6}" fill="#c9ced3"/><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="#fff"/>`;
  k += `<g transform="translate(${-w / 2 + 1} ${-h + 1}) scale(${((w - 2) / 24).toFixed(3)})">${inhalt}</g>`;
  k += `<rect x="${-w / 2 + 1}" y="-8" width="${w - 2}" height="7" fill="${farbe}"/>` + T(0, -2.7, r(4.4 * Math.min(1, 6.6 / name.length)), name, "#fff", "middle", "bold", "'Trebuchet MS',Arial,sans-serif", ' letter-spacing=".3"');
  k += `<path d="M${-w / 2} ${-h} L${-w / 2 + 8} ${-h} L${-w / 2} ${-h + 14} Z" fill="#fff" opacity=".18"/>`;
  S.teil({ id, de, syl, it, itSyl, en, lupe, tipp: ZIEL_TIPP, x, y: PLAKAT.y, kunst: k });
};
plakat("rb_ziel_japan", "japan", "Japan", "JA-pan", "Giappone", "Giap-PO-ne", "Japan", 246,
  `<rect width="24" height="29" fill="${S.lg("jhimmel", [[0, "#fde6d6"], [1, "#fff6ec"]])}"/><circle cx="16" cy="8" r="4.4" fill="#d7262e"/>` +
  `<path d="M0 26 L9 12 Q12 9.6 15 12 L24 26 Z" fill="#5b6f9a"/><path d="M9 12 Q12 9.6 15 12 L13.4 14.4 L12 13 L10.6 14.6 Z" fill="#fff"/><rect y="25" width="24" height="4" fill="#3f5a3a"/>` +
  `<rect x="2" y="17" width="9" height="1.2" fill="#c8202a"/><rect x="1.4" y="16" width="10.2" height="1" fill="#2b1d16"/><rect x="3.4" y="18" width="1" height="9" fill="#c8202a"/><rect x="8.6" y="18" width="1" height="9" fill="#c8202a"/><rect x="3" y="20" width="7" height=".8" fill="#c8202a"/>` +
  [[18, 18], [20, 17], [21, 19.4], [19, 20.4]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1.2" fill="#f6b6c8"/>`).join("") + `<path d="M24 16 Q20 18 16 22" stroke="#5a3a2a" stroke-width=".5" fill="none"/>`,
  "JAPAN", "#c8202a");
plakat("rb_ziel_aegypten", "aegypten", "Ägypten", "Ä-GYP-ten", "Egitto", "E-GIT-to", "Ägypten", 275,
  `<rect width="24" height="29" fill="${S.lg("ahimmel", [[0, "#f7b955"], [1, "#fde7b0"]])}"/><circle cx="18" cy="7" r="3.4" fill="#fff4c4"/>` +
  `<path d="M0 22 Q12 19 24 22 L24 29 L0 29 Z" fill="#e3b86c"/><path d="M2 22 L9 10 L16 22 Z" fill="#d49b4f"/><path d="M9 10 L16 22 L12 22 Z" fill="#b97f3a"/><path d="M13 22 L18.4 14 L23.6 22 Z" fill="#cf9550"/><path d="M18.4 14 L23.6 22 L21 22 Z" fill="#a8722f"/>` +
  `<path d="M3 26 q1 -3 3 -2.6 q1 -2 2.4 0 q1.4 -.4 1.6 1 l-.4 2.4 M5 26 v2 M9 26 v2" stroke="#5a3a1a" stroke-width=".7" fill="none"/>`,
  "ÄGYPTEN", "#c98a2a");
plakat("rb_ziel_weltstaedte", "weltstaedte", "die Weltstädte", "WELT-städ-te", "le grandi città", "GRAN-di cit-TÀ", "die Weltstädte", 304,
  `<rect width="24" height="29" fill="${NACHT}"/>` + [[3, 3], [9, 5], [19, 2.6], [14, 7], [22, 9]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".35" fill="#fff"/>`).join("") +
  `<path d="M0 29 L0 18 L2 18 L2 14 L5 14 L5 20 L7 20 L7 9 L8 7 L8.4 3 L8.8 7 L9.8 9 L9.8 20 L11 20 L11 12 L14 12 L14 17 L15.4 17 L16.6 6 L17.8 17 L19 17 L19 13 L22 13 L22 19 L24 19 L24 29 Z" fill="#141b33"/>` +
  Array.from({ length: 26 }, (_, i) => `<rect x="${r(1 + rnd() * 22)}" y="${r(15 + rnd() * 12)}" width=".6" height=".8" fill="#ffd66b" opacity=".85"/>`).join(""),
  "WELTSTÄDTE", "#3a4a8a");

/* =====================================================================
   3 — DAS REGAL (Katalogwand „Deutschland entdecken“) — Lupe:
       Berlin, Hamburg, München, Köln, Dresden, Leipzig, Magdeburg
   ===================================================================== */
{
  const X0 = 6, X1 = 102, Y0 = 28, cx = (X0 + X1) / 2, W = X1 - X0, H = WU - Y0;
  let k = `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${HOLZ}"/>`;
  k += `<rect x="${-W / 2 + 2}" y="${-H + 2}" width="${W - 4}" height="${H - 24}" fill="${S.lg("regalinnen", [[0, "#efe3cf"], [1, "#d9c6a6"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="7" fill="${PETROL}"/>` + T(0, -H + 5.2, 4.2, "Deutschland entdecken", "#fff", "middle", "bold", "'Trebuchet MS',Arial,sans-serif");
  const unter = [];
  const reihen = [
    [["berlin", "rb_ziel_berlin", "Berlin", "BER-lin", "Berlino", "Ber-LI-no", "Berlin", "BERLIN", "#c8202a"],
     ["hamburg", "rb_ziel_hamburg", "Hamburg", "HAM-burg", "Amburgo", "Am-BUR-go", "Hamburg", "HAMBURG", "#1f4f8c"],
     ["muenchen", "rb_ziel_muenchen", "München", "MÜN-chen", "Monaco", "MO-na-co", "München", "MÜNCHEN", "#2f7fc4"],
     ["koeln", "rb_ziel_koeln", "Köln", "KÖLN", "Colonia", "Co-LO-nia", "Köln", "KÖLN", "#4a4540"]],
    [["dresden", "rb_ziel_dresden", "Dresden", "DRES-den", "Dresda", "DRE-sda", "Dresden", "DRESDEN", "#a8742f"],
     ["leipzig", "rb_ziel_leipzig", "Leipzig", "LEIP-zig", "Lipsia", "LI-psia", "Leipzig", "LEIPZIG", "#3a8a5a"],
     ["magdeburg", "rb_ziel_magdeburg", "Magdeburg", "MAG-de-burg", "Magdeburgo", "Mag-de-BUR-go", "Magdeburg", "MAGDEBURG", "#2a7a8a"]],
  ];
  const cw = 19, ch = 25;
  reihen.forEach((reihe, ri) => {
    const boden = -H + 8 + (ri + 1) * 29.5;
    const start = -((reihe.length - 1) * 22.5) / 2;
    k += `<rect x="${-W / 2 + 2}" y="${r(boden)}" width="${W - 4}" height="2" fill="#b58e5c"/><rect x="${-W / 2 + 2}" y="${r(boden + 2)}" width="${W - 4}" height=".6" fill="#8a6a40"/>`;
    reihe.forEach(([motiv, id, de, syl, it, itSyl, en, name, farbe], i) => {
      const x = start + i * 22.5;
      /* Katalog lehnt schräg in der Acrylhalterung */
      k += `<g transform="translate(${r(x)} ${r(boden)}) skewX(-4)">${titel(-cw / 2, -ch, cw, ch, motiv, name, farbe)}<rect x="${-cw / 2}" y="${-ch}" width="${cw}" height="${ch}" fill="none" stroke="#b9b2a2" stroke-width=".25"/></g>`;
      k += `<rect x="${r(x - cw / 2 - 0.6)}" y="${r(boden - 6)}" width="${cw + 1.2}" height="6" fill="#e3f1f6" opacity=".4" stroke="#bcd3dc" stroke-width=".25"/>`;
      unter.push({ id, de, syl, it, itSyl, en, lupe: motiv, tipp: ZIEL_TIPP, x: cx + x, y: WU + boden, kunst: flaeche(-cw / 2 - 0.6, -ch - 0.4, cw + 1.2, ch + 0.8) });
    });
  });
  /* unterstes Fach: weitere Kataloge (Rücken sichtbar) */
  const b3 = -24;
  k += `<rect x="${-W / 2 + 2}" y="${b3 - 14}" width="${W - 4}" height="14" fill="#e6d6ba"/>`;
  for (let i = 0; i < 26; i++) { const f = ["#1f4f8c", "#f08a24", "#0f6e7a", "#c8202a", "#e8c547", "#5a8a3a"][i % 6]; k += `<rect x="${r(-W / 2 + 4 + i * 3.4)}" y="${r(b3 - 11 - (i % 3) * 0.6)}" width="3" height="${r(11 + (i % 3) * 0.6)}" fill="${f}"/><rect x="${r(-W / 2 + 4.6 + i * 3.4)}" y="${r(b3 - 9)}" width="1.8" height=".5" fill="#fff" opacity=".7"/>`; }
  /* Unterschrank */
  k += `<rect x="${-W / 2}" y="${b3}" width="${W}" height="24" fill="${HOLZ}"/><rect x="${-W / 2}" y="${b3}" width="${W}" height="1.4" fill="#f2e2c6"/>`;
  for (const x of [-W / 4, W / 4]) k += `<rect x="${r(x - W / 4 + 1.5)}" y="${b3 + 3}" width="${r(W / 2 - 3)}" height="19" rx=".6" fill="none" stroke="#b08a5a" stroke-width=".5"/><rect x="${r(x - 4)}" y="${b3 + 6}" width="8" height="1" rx=".5" fill="#8d969e"/>`;
  S.teil({ id: "rb_regal", de: "das Regal", syl: "re-GAL", it: "lo scaffale", itSyl: "scaf-FA-le", en: "shelf", x: cx, y: WU, steht: true, kunst: k,
    zoom: { x: X0 - 4, y: Y0 - 2, w: W + 8, h: 69 }, unter,
    tipp: "Im Regal stehen die Kataloge für Städtereisen in Deutschland." });
}

/* =====================================================================
   4 — DER PROSPEKTSTÄNDER (Europa) — Lupe: Italien, Rom, Frankreich,
       Spanien, Griechenland, Türkei, Großbritannien
   ===================================================================== */
const PS = { x: 280, y: 158 };
{
  const W = 54, H = 74;
  let k = schatten(0, 0, 30, 2, .3);
  for (const x of [-W / 2 + 3, W / 2 - 3]) k += `<rect x="${x - 1}" y="${-H}" width="2" height="${H}" fill="#9aa3aa"/><rect x="${x - 4}" y="-1.6" width="8" height="1.6" rx=".6" fill="#5c646b"/>`;
  k += `<rect x="${-W / 2}" y="${-H - 8}" width="${W}" height="8" rx="1" fill="${ORANGE}"/>` + T(0, -H - 2.4, 4.6, "Europa", "#fff", "middle", "bold", "'Trebuchet MS',Arial,sans-serif");
  k += `<rect x="${-W / 2 + 2}" y="${-H}" width="${W - 4}" height="${H - 10}" fill="#f2f4f5"/>`;
  const liste = [
    ["italien", "rb_ziel_italien", "Italien", "I-TA-li-en", "Italia", "I-TA-lia", "Italien", "ITALIEN", "#2a9a4a"],
    ["rom", "rb_ziel_rom", "Rom", "ROM", "Roma", "RO-ma", "Rom", "ROM", "#a8462a"],
    ["frankreich", "rb_ziel_frankreich", "Frankreich", "FRANK-reich", "Francia", "FRAN-cia", "Frankreich", "FRANKREICH", "#2f4fa8"],
    ["spanien", "rb_ziel_spanien", "Spanien", "SPA-ni-en", "Spagna", "SPA-gna", "Spanien", "SPANIEN", "#d8352a"],
    ["griechenland", "rb_ziel_griechenland", "Griechenland", "GRIE-chen-land", "Grecia", "GRE-cia", "Griechenland", "GRIECHENLAND", "#2f63c4"],
    ["tuerkei", "rb_ziel_tuerkei", "die Türkei", "TÜR-kei", "Turchia", "Tur-CHI-a", "die Türkei", "TÜRKEI", "#c8202a"],
    ["grossbritannien", "rb_ziel_grossbritannien", "Großbritannien", "GROSS-bri-tan-ni-en", "Gran Bretagna", "Gran Bre-TA-gna", "Großbritannien", "GROSSBRITANNIEN", "#24356e"],
  ];
  const unter = [];
  const pw = 11.4, ph = 16;
  liste.forEach(([motiv, id, de, syl, it, itSyl, en, name, farbe], i) => {
    const s = i % 4, z = Math.floor(i / 4), x = -W / 2 + 3.4 + s * 12 + pw / 2, boden = -H + 18 + z * 21;
    k += titel(x - pw / 2, boden - ph, pw, ph, motiv, name, farbe) + `<rect x="${r(x - pw / 2)}" y="${r(boden - ph)}" width="${pw}" height="${ph}" fill="none" stroke="#c9c2b4" stroke-width=".2"/>`;
    unter.push({ id, de, syl, it, itSyl, en, lupe: motiv, tipp: ZIEL_TIPP, x: PS.x + x, y: PS.y + boden, kunst: flaeche(-pw / 2 - 0.3, -ph - 0.3, pw + 0.6, ph + 1.2) });
  });
  /* achtes Fach: Prospekt „Österreich“ (nur Bild), unten weitere Stapel */
  { const x = -W / 2 + 3.4 + 3 * 12, b = -H + 39; k += `<rect x="${x}" y="${b - 16}" width="11.4" height="16" fill="#fff"/><rect x="${x}" y="${b - 16}" width="11.4" height="10" fill="${HIMMEL}"/><path d="M${x} ${b - 7} l3 -5 l2.6 3 l2.4 -4.4 l3.4 6.4 Z" fill="#fff"/><rect x="${x}" y="${b - 4}" width="11.4" height="4" fill="#c8202a"/>` + T(x + 5.7, b - 1.2, 2.2, "ÖSTERREICH", "#fff", "middle", "bold").replace('font-size="2.2"', 'font-size="1.7"'); }
  for (let z = 0; z < 2; z++) {
    const boden = -H + 18 + z * 21;
    k += `<rect x="${-W / 2 + 2}" y="${boden - 5}" width="${W - 4}" height="5" fill="#e6f1f5" opacity=".55" stroke="#b9cdd5" stroke-width=".25"/><rect x="${-W / 2 + 2}" y="${boden}" width="${W - 4}" height="1" fill="#9aa3aa"/>`;
  }
  for (let i = 0; i < 4; i++) { const x = -W / 2 + 4 + i * 12; k += `<rect x="${x}" y="-27" width="10.6" height="16" fill="${["#f08a24", "#0f6e7a", "#e8c547", "#5a8a3a"][i]}"/><rect x="${x}" y="-22" width="10.6" height="5" fill="#fff" opacity=".6"/>`; }
  k += `<rect x="${-W / 2 + 2}" y="-15" width="${W - 4}" height="5" fill="#e6f1f5" opacity=".55" stroke="#b9cdd5" stroke-width=".25"/><rect x="${-W / 2 + 2}" y="-10" width="${W - 4}" height="1" fill="#9aa3aa"/>`;
  S.teil({ id: "rb_prospektstaender", de: "der Prospektständer", syl: "Pro-SPEKT-stän-der", it: "l'espositore", itSyl: "e-spo-si-TO-re", en: "brochure rack", x: PS.x, y: PS.y, steht: true, kunst: k,
    zoom: { x: PS.x - W / 2 - 6, y: PS.y - H - 10, w: W + 12, h: 44 }, unter,
    tipp: "Die Prospekte darf man kostenlos mitnehmen." });
}

/* =====================================================================
   5 — DER BÜROSTUHL und DIE REISEBERATERIN (hinter dem Tisch)
   ===================================================================== */
const TI = { x0: 66, x1: 218, oben: 134, kante: 142, fuss: 180 };
const BER = { x: 114, boden: 168, s: 48 };
{
  let k = `<path d="M-12 -62 Q-12 -70 -4 -70 L4 -70 Q12 -70 12 -62 L11 -36 L-11 -36 Z" fill="${S.lg("stuhlbezug", [[0, "#2c3238"], [1, "#1a1e22"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-9 -67 Q-8 -68.4 -3 -68.4 L3 -68.4" stroke="#5a6068" stroke-width=".8" fill="none"/>`;
  k += `<rect x="-15" y="-46" width="3.4" height="10" rx="1" fill="#2a2e33"/><rect x="11.6" y="-46" width="3.4" height="10" rx="1" fill="#2a2e33"/><rect x="-16" y="-47" width="5.4" height="1.6" rx=".7" fill="#3d4248"/><rect x="10.6" y="-47" width="5.4" height="1.6" rx=".7" fill="#3d4248"/>`;
  S.teil({ id: "rb_buerostuhl", de: "der Bürostuhl", syl: "BÜ-ro-stuhl", it: "la sedia da ufficio", itSyl: "SE-dia da uf-FI-cio", en: "office chair", x: BER.x + 3, y: BER.boden, kunst: k });
}
{
  const m = B.mensch({ id: "rb_ber", geschlecht: "w", pose: "sitzen", blick: 40, frisur: "zopf", haarfarbe: "schwarz", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "weiss" }, jacke: { stueck: "jacke", farbe: PETROL }, unterteil: { stueck: "hose", farbe: "#2a2f3a" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "schal", farbe: ORANGE } } }, 1.68 * BER.s);
  const oy = BER.boden - 0.48 * BER.s + m.z.sitz.y * -m.k;
  S.teil({ id: "rb_beraterin", de: "die Reiseberaterin", syl: "REI-se-be-ra-te-rin", it: "la consulente di viaggio", itSyl: "con-su-LEN-te di VIAG-gio", en: "travel agent", x: BER.x, y: r(oy), kunst: m.svg,
    tipp: "Die Reiseberaterin fragt: „Wohin möchten Sie reisen?“" });
}

/* =====================================================================
   6 — DER SCHREIBTISCH (Beratungstisch, weiß mit Holzplatte)
   ===================================================================== */
{
  const W = TI.x1 - TI.x0, H = TI.fuss - TI.kante, cx = (TI.x0 + TI.x1) / 2;
  let k = schatten(0, 0, W / 2 + 4, 2.4, .3);
  k += `<path d="M${-W / 2 + 4} ${TI.oben - TI.fuss} L${W / 2 - 4} ${TI.oben - TI.fuss} L${W / 2 + 1} ${-H} L${-W / 2 - 1} ${-H} Z" fill="${S.lg("platte", [[0, "#d2b386"], [1, "#e9d2ab"]])}"/>`;
  k += `<rect x="${-W / 2 - 1}" y="${-H}" width="${W + 2}" height="2.4" fill="#c49c66"/>`;
  /* Wangen und Sichtblende */
  k += `<rect x="${-W / 2}" y="${-H + 2.4}" width="6" height="${H - 2.4}" fill="${WEISS}"/><rect x="${W / 2 - 6}" y="${-H + 2.4}" width="6" height="${H - 2.4}" fill="${WEISS}"/>`;
  k += `<rect x="${-W / 2 + 6}" y="${-H + 2.4}" width="${W - 12}" height="22" fill="${S.lg("blende", [[0, "#f4f6f7"], [1, "#d9dee2"]])}"/>`;
  k += `<rect x="${-W / 2 + 6}" y="${-H + 18}" width="${W - 12}" height="2.4" fill="${ORANGE}"/>` + T(0, -H + 13, 4, "Reisebüro Fernweh", PETROL, "middle", "bold", "'Trebuchet MS',Arial,sans-serif");
  k += `<rect x="${-W / 2 + 6}" y="${-H + 24.4}" width="${W - 12}" height="${H - 24.4}" fill="${S.lg("unterseite", [[0, "#b9c0c6"], [1, "#d4d9dd"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${-H + 2.4}" width="${W}" height="2" fill="#000" opacity=".12"/>`;
  S.teil({ id: "rb_schreibtisch_rb", de: "der Schreibtisch", syl: "SCHREIB-tisch", it: "la scrivania", itSyl: "scri-va-NI-a", en: "desk", x: cx, y: TI.fuss, steht: true, kunst: k });
}
const PL = 139;
{
  /* DER BILDSCHIRM — zur Kundin gedreht: ein Strandangebot */
  let k = schatten(0, .2, 9, .8, .3) + `<path d="M-6 0 L6 0 L5 -1.4 L-5 -1.4 Z" fill="#2b2f33"/><rect x="-1.2" y="-6" width="2.4" height="4.8" fill="#3a3f44"/>`;
  k += `<path d="M-15 -25 L14 -23 L14 -5.6 L-15 -6.6 Z" fill="#1d2125"/>`;
  k += `<path d="M-13.8 -23.8 L12.8 -22 L12.8 -6.8 L-13.8 -7.8 Z" fill="${HIMMEL}"/><path d="M-13.8 -15 L12.8 -14 L12.8 -11 L-13.8 -11.6 Z" fill="${MEER}"/><path d="M-13.8 -11.6 L12.8 -11 L12.8 -6.8 L-13.8 -7.8 Z" fill="#f2d79a"/>`;
  k += `<circle cx="8" cy="-19.4" r="2" fill="#ffd34d"/><path d="M-9 -11.6 q-1 -5 2 -8 M-7 -19.6 q-3 -1 -5 1 M-7 -19.6 q3 -1.4 5 .6 M-7 -19.6 q-1 -3 -4 -3.6" stroke="#2f7a3a" stroke-width=".9" fill="none"/>`;
  k += `<rect x="0" y="-12.8" width="12" height="4.6" fill="#fff" opacity=".9"/>` + T(6, -10.6, 1.45, "Mallorca 7 Nächte", "#1f4f8c", "middle", "bold") + T(6, -8.8, 1.8, "ab 899 €", ORANGE, "middle", "bold");
  k += `<path d="M-13.8 -23.8 L-6 -23.3 L-13.8 -14 Z" fill="#fff" opacity=".2"/>`;
  S.teil({ oben: true, id: "rb_bildschirm", de: "der Bildschirm", syl: "BILD-schirm", it: "lo schermo", itSyl: "SCHER-mo", en: "screen", x: 152, y: PL - 1, steht: true, kunst: k,
    tipp: "Auf dem Bildschirm zeigt die Beraterin Hotels und Flüge." });
}
{
  /* DER GLOBUS — auf dem Tisch links */
  let k = schatten(0, .2, 6, .7, .3) + `<ellipse cx="0" cy="-.8" rx="5" ry="1.3" fill="#3a3f44"/><rect x="-.7" y="-4" width="1.4" height="3.4" fill="#8d969e"/>`;
  k += `<circle cx="0" cy="-13" r="8.4" fill="${S.rg("kugel", [[0, "#bfe6f7"], [0.6, "#4aa3d6"], [1, "#1f5f8f"]], 0.38, 0.32, 0.8)}"/>`;
  k += `<path d="M-6 -17 q3 -3 6 -1 q2 2 4 0 q1 3 -2 4 q-3 2 -2 5 q-3 0 -4 -3 q-3 -1 -2 -5 Z" fill="#8fbf6a"/><path d="M1 -9 q3 -1 5 1 q-1 3 -4 3 Z" fill="#c9b36a"/>`;
  k += `<path d="M-9 -13 A9 9 0 0 1 9 -13" stroke="#c9a23f" stroke-width=".7" fill="none" transform="rotate(-23 0 -13)"/><path d="M0 -4.6 A8.6 8.6 0 0 1 -6.4 -19" stroke="#c9a23f" stroke-width=".9" fill="none"/>`;
  k += `<ellipse cx="-3" cy="-16.4" rx="2.6" ry="1.6" fill="#fff" opacity=".35"/>`;
  S.teil({ oben: true, id: "rb_globus", de: "der Globus", syl: "GLO-bus", it: "il mappamondo", itSyl: "map-pa-MON-do", en: "globe", x: 80, y: PL, steht: true, kunst: k });
}
{
  /* DER KATALOG — aufgeschlagen vor der Kundin */
  let k = `<path d="M-12 0 L0 .6 L0 -6 L-10.4 -6.4 Z" fill="#fbfaf6" stroke="#cfc8b8" stroke-width=".2"/><path d="M0 .6 L12 0 L10.4 -6.4 L0 -6 Z" fill="#f6f4ee" stroke="#cfc8b8" stroke-width=".2"/>`;
  k += `<path d="M-10.6 -5.6 L-1.2 -5.3 L-1.2 -2.6 L-11.2 -2.9 Z" fill="${MEER}"/><path d="M-11.2 -2.9 L-1.2 -2.6 L-1.2 -1.6 L-11.4 -1.9 Z" fill="#f2d79a"/>`;
  k += `<path d="M1.2 -5.3 L5.6 -5.5 L5.8 -2.6 L1.2 -2.4 Z" fill="#e8b26a"/><path d="M6.6 -5.5 L10 -5.7 L10.4 -2.8 L6.8 -2.7 Z" fill="#9fcde2"/>`;
  k += `<path d="M1.4 -1.6 L10.6 -2 M1.4 -.8 L9 -1.1" stroke="#9a9a9a" stroke-width=".22"/>`;
  k += `<line x1="0" y1="-6" x2="0" y2=".6" stroke="#bdb5a3" stroke-width=".3"/>`;
  S.teil({ oben: true, id: "rb_katalog", de: "der Katalog", syl: "Ka-ta-LOG", it: "il catalogo", itSyl: "ca-TA-lo-go", en: "brochure", x: 180, y: PL + 1.5, steht: true, kunst: k + flaeche(-12.4, -7, 24.8, 8),
    tipp: "Im Katalog stehen Hotels mit Bildern und Preisen." });
}
{
  /* DAS FLUGTICKET — Reiseunterlagen mit Bordkarte */
  let k = `<path d="M-6.4 0 L6 -.4 L5 -4.6 L-6.6 -4.2 Z" fill="#fff" stroke="#c9c2b4" stroke-width=".2"/><path d="M-6.5 -4.2 L5 -4.6 L5.1 -3.6 L-6.5 -3.2 Z" fill="${PETROL}"/>`;
  k += `<path d="M2.4 -4.5 L2.6 -.2" stroke="#9aa3aa" stroke-width=".2" stroke-dasharray=".5 .4"/>`;
  k += T(-2.6, -1.8, 1.3, "FRA ✈ PMI", "#222", "middle", "bold");
  k += `<path d="M3.2 -3 h.3 m.4 0 h.2 m.3 0 h.5 M3.2 -1.6 h.6 m.3 0 h.2 m.3 0 h.4" stroke="#222" stroke-width=".5"/>`;
  S.teil({ oben: true, id: "rb_flugticket", de: "das Flugticket", syl: "FLUG-ti-cket", it: "il biglietto aereo", itSyl: "bi-GLIET-to a-E-re-o", en: "flight ticket", x: 199, y: PL + 1, steht: true, kunst: k + flaeche(-7, -5.4, 14, 6),
    tipp: "Auf dem Flugticket steht: von Frankfurt (FRA) nach Palma (PMI)." });
}
{
  /* DER REISEPASS — liegt an der Tischkante bei der Kundin */
  let k = `<path d="M-3.6 0 L3.8 -.3 L3.2 -4.4 L-3.8 -4.1 Z" fill="${S.lg("pass", [[0, "#7a1f2b"], [1, "#5a1520"]])}"/>`;
  k += `<circle cx="0" cy="-2.6" r=".9" fill="none" stroke="#d9b04a" stroke-width=".25"/>` + T(0, -.7, .8, "REISEPASS", "#d9b04a", "middle", "bold");
  S.teil({ oben: true, id: "rb_reisepass", de: "der Reisepass", syl: "REI-se-pass", it: "il passaporto", itSyl: "pas-sa-POR-to", en: "passport", x: 210, y: PL + 2, steht: true, kunst: k + flaeche(-4.6, -5, 9.2, 5.6),
    tipp: "Für Reisen außerhalb der EU braucht man einen Reisepass." });
}

/* =====================================================================
   7 — DER STUHL und DIE KUNDIN (seitlich am Tisch)
   ===================================================================== */
const KU = { x: 238, boden: 186, s: 58 };
{
  /* Freischwinger, von schräg vorn: Lehne, Sitz, Kufen */
  let k = schatten(0, 0, 14, 1.8, .3);
  k += `<path d="M-10 0 L12 0 Q14 0 13 -3 L10 -25" stroke="#b9c0c6" stroke-width="1.4" fill="none"/><path d="M-10 0 L-8 -1" stroke="#b9c0c6" stroke-width="1.4"/>`;
  k += `<path d="M7 -28 L13 -54 Q14 -57 11 -57 L6 -56 Q4 -56 4 -53 L2 -28 Z" fill="${S.lg("lehne", [[0, "#e07a1f"], [1, "#b85f12"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-12 -26 L10 -26 Q12 -26 12 -28.4 L12 -29 L-10 -29.6 Q-12.4 -29.6 -12 -27.4 Z" fill="#c96a16"/><rect x="-12" y="-26.4" width="23" height="2" rx=".8" fill="#9a4f0e"/>`;
  S.teil({ id: "rb_stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: KU.x + 4, y: KU.boden, steht: true, kunst: k });
}
{
  const m = B.mensch({ id: "rb_kundin", geschlecht: "w", pose: "sitzen", blick: -62, frisur: "lang", haarfarbe: "rot", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "gelb" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, 1.66 * KU.s);
  const oy = KU.boden - 0.46 * KU.s + m.z.sitz.y * -m.k;
  S.teil({ id: "rb_kundin_rb", de: "die Kundin", syl: "KUN-din", it: "la cliente", itSyl: "cli-EN-te", en: "customer", x: KU.x, y: r(oy), kunst: m.svg,
    tipp: "Die Kundin sagt: „Ich möchte im Sommer ans Meer.“" });
}
{
  /* DER KOFFER — kleiner Trolley neben der Kundin */
  let k = schatten(0, 0, 10, 1.4, .35);
  for (const x of [-6, 6]) k += `<circle cx="${x}" cy="-1.6" r="1.6" fill="#1d1d1d"/>`;
  k += `<rect x="-9" y="-36" width="18" height="33" rx="2.6" fill="${S.lg("trolley", [[0, "#0f6e7a"], [0.45, "#1d8f9c"], [1, "#0a4f58"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${-5 + i * 5 - 0.5}" y="-33" width="1" height="27" rx=".4" fill="#0a4f58" opacity=".55"/>`;
  k += `<rect x="-4" y="-48" width="1" height="12" fill="#9aa3aa"/><rect x="3" y="-48" width="1" height="12" fill="#9aa3aa"/><rect x="-5" y="-50" width="10" height="2.6" rx="1.2" fill="#2b2f33"/>`;
  k += `<path d="M-7.4 -34 L-5 -34 L-7.4 -16 Z" fill="#fff" opacity=".2"/>`;
  S.teil({ id: "rb_koffer_rb", de: "der Koffer", syl: "KOF-fer", it: "la valigia", itSyl: "va-LI-gia", en: "suitcase", x: 270, y: 194, steht: true, kunst: k });
}

/* =====================================================================
   8 — DIE PFLANZE (vorn links, Monstera im Topf)
   ===================================================================== */
{
  let k = schatten(0, 0, 12, 1.6, .3);
  k += `<path d="M-9 -18 L9 -18 L7.4 0 L-7.4 0 Z" fill="${S.lg("topf", [[0, "#f4f1ea"], [0.5, "#dcd6cb"], [1, "#b9b2a5"]], 0, 0, 1, 0)}"/><rect x="-9.6" y="-19.4" width="19.2" height="2" rx=".6" fill="#ece7dd"/>`;
  const blatt = (x, y, w, a, f) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0 Q${-w} ${-w * 0.4} ${-w * 0.5} ${-w * 1.3} Q0 ${-w * 1.6} ${w * 0.5} ${-w * 1.3} Q${w} ${-w * 0.4} 0 0 Z" fill="${f}"/>` +
    `<path d="M0 0 L0 ${-w * 1.3}" stroke="#2f5f27" stroke-width=".4"/>${[0.4, 0.7, 1].map((t) => `<path d="M${r(-w * 0.6)} ${r(-w * t)} L${r(-w * 0.2)} ${r(-w * t + 0.4)} M${r(w * 0.6)} ${r(-w * t)} L${r(w * 0.2)} ${r(-w * t + 0.4)}" stroke="#f4f1ea" stroke-width=".7"/>`).join("")}</g>`;
  for (const [x, y, len, a] of [[-6, -18, 22, -38], [5, -18, 24, 30], [0, -18, 30, -6], [-2, -18, 17, -64], [3, -18, 17, 62]]) k += `<path d="M0 -18 Q${r(x * 0.5)} ${r(-18 - len * 0.5)} ${r(Math.sin(a * Math.PI / 180) * len)} ${r(-18 - Math.cos(a * Math.PI / 180) * len)}" stroke="#3f7a2f" stroke-width=".8" fill="none"/>`;
  for (const [len, a, w, f] of [[22, -38, 10, "#3f8a3a"], [24, 30, 10.5, "#4a9a42"], [30, -6, 11.5, "#3a7f33"], [17, -64, 9, "#4a9a42"], [17, 62, 9, "#3f8a3a"]]) k += blatt(r(Math.sin(a * Math.PI / 180) * len), r(-18 - Math.cos(a * Math.PI / 180) * len + w * 0.3), w, a, f);
  S.teil({ id: "rb_pflanze", de: "die Pflanze", syl: "PFLAN-ze", it: "la pianta", itSyl: "PIAN-ta", en: "plant", x: 28, y: 194, steht: true, kunst: k });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/reisebuero.js"));
console.log(aus);
