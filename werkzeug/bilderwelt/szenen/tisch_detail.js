#!/usr/bin/env node
/* =====================================================================
   DER GEDECKTE TISCH (FASSUNG 852) — Bilderwelt neu, Detail-Szene
   (geöffnet über die Lupe aus „restaurant“)
   ---------------------------------------------------------------------
   RECHERCHE (Knigge-Ratgeber „Tisch richtig decken“: lecker.de, REWE,
   g-wie-gastro „Eindecken einer Tafel“):
   - Die Gabel liegt links, Messer und Suppenlöffel rechts vom Teller;
     die Schneide des Messers zeigt zum Teller.
   - Die Gläser stehen oberhalb des Messers.
   - Brotteller mit Buttermesser oben links über der Gabel.
   - Beim Frühstück/Brunch steht das Kaffeegedeck rechts: Tasse auf der
     Untertasse, Henkel nach rechts, Teelöffel rechts auf der
     Untertasse; Milchkännchen und Zuckerdose daneben.
   - Platzteller (Unterteller) unter dem Speiseteller, darunter das
     Platzdeckchen; Serviette links neben der Gabel.
   - In der Tischmitte: Salz und Pfeffer, Kerze, kleine Vase, Brotkorb.
   Ansicht: am Platz sitzend, schräg von oben (Draufsicht ≈ 50°;
   Kreise erscheinen als Ellipsen mit ≈ 0,74 Höhe).
   Maßstab vorn ≈ 3,5 Einheiten je Zentimeter (Teller Ø 27 cm).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "tisch_detail", titel: "Der gedeckte Tisch", emoji: "🔍", thema: "Essen & Trinken", kuerzel: "b27d", fassung: 852 });
const rnd = zufall(2704);
const r = B.r;
const F = 0.74;   /* Verkürzung der Kreise */

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("unscharf")}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
const SILBER = S.lg("silber", [[0, "#f4f6f7"], [0.35, "#c3c9ce"], [0.55, "#e9edf0"], [0.8, "#9ea6ad"], [1, "#d8dde1"]], 0, 0, 1, 0);
const SILBER_V = S.lg("silberv", [[0, "#eef1f3"], [0.5, "#b5bcc2"], [1, "#e3e7ea"]]);
const PORZ = S.rg("porz", [[0, "#ffffff"], [0.75, "#f6f4ef"], [1, "#dcd7cd"]], 0.45, 0.4, 0.62);
const PORZ_S = S.lg("porzs", [[0, "#e6e1d6"], [0.35, "#ffffff"], [0.7, "#f1eee7"], [1, "#cfc8bb"]], 0, 0, 1, 0);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.55], [0.2, "#e6f1f4", 0.15], [0.7, "#d5e6ec", 0.12], [0.9, "#ffffff", 0.45], [1, "#b9ccd3", 0.5]], 0, 0, 1, 0);
const HOLZ = S.lg("holz", [[0, "#8a5a34"], [0.5, "#a06c40"], [1, "#7a4c2a"]]);

/* =====================================================================
   KULISSE — Restaurant unscharf im Hintergrund
   ===================================================================== */
S.hinten(`<rect width="320" height="34" fill="${S.lg("raum", [[0, "#3b2a20"], [1, "#5a4030"]])}"/>`);
{
  let b = `<g filter="url(#${S.id("unscharf")})">`;
  b += `<rect x="0" y="12" width="320" height="22" fill="#6e5038" opacity=".6"/>`;
  b += `<rect x="20" y="2" width="44" height="22" rx="2" fill="#8fa9b8" opacity=".55"/><rect x="250" y="0" width="52" height="26" rx="2" fill="#8fa9b8" opacity=".5"/>`;
  for (let i = 0; i < 14; i++) b += `<circle cx="${r(10 + rnd() * 300)}" cy="${r(4 + rnd() * 18)}" r="${r(2 + rnd() * 3)}" fill="#ffd38a" opacity="${r(0.35 + rnd() * 0.4)}"/>`;
  b += `<path d="M120 34 L124 14 L150 14 L154 34 Z" fill="#4a3426" opacity=".8"/>`;
  b += `</g>`;
  S.hinten(b);
}

/* =====================================================================
   1 — DER TISCH (Eiche, Dielen quer, Kante hinten)
   ===================================================================== */
{
  let k = `<rect x="0" y="30" width="320" height="171" fill="${HOLZ}"/>`;
  k += `<rect x="0" y="30" width="320" height="171" fill="${S.lg("tischlicht", [[0, "#000", 0.25], [0.3, "#000", 0], [0.7, "#fff", 0.05], [1, "#000", 0.1]])}"/>`;
  k += `<rect x="0" y="29" width="320" height="2.2" fill="#c08a58"/><rect x="0" y="31.2" width="320" height=".8" fill="#4a2c16" opacity=".5"/>`;
  const fugen = [52, 80, 114, 156];
  for (const y of fugen) k += `<rect x="0" y="${y}" width="320" height=".7" fill="#4a2c16" opacity=".55"/><rect x="0" y="${y + 0.7}" width="320" height=".5" fill="#d29a64" opacity=".35"/>`;
  /* Maserung */
  const zonen = [32, ...fugen, 200];
  for (let z = 0; z < zonen.length - 1; z++) {
    const y0 = zonen[z], y1 = zonen[z + 1];
    for (let i = 0; i < 7; i++) {
      const y = y0 + 2 + rnd() * (y1 - y0 - 4), x = rnd() * 260, w = Math.min(50 + rnd() * 120, 320 - x), a = (rnd() - 0.5) * (y1 - y0) * 0.12;
      k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} ${r(a)} ${r(w)} 0" stroke="${rnd() < 0.5 ? "#6b4224" : "#b98252"}" stroke-width="${r(0.3 + rnd() * 0.5)}" opacity=".45" fill="none"/>`;
    }
  }
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: 300, y: 190, kunst: `<g transform="translate(-300 -190)">${k}</g>` });
}
const A = (cx, cy, svg) => `<g transform="translate(${-cx} ${-cy})">${svg}</g>`;

/* =====================================================================
   2 — HINTEN IN DER TISCHMITTE: Brotkorb, Vase mit Tulpen, Kerze,
       Salz und Pfeffer, Zuckerdose, Milchkännchen
   ===================================================================== */
{
  /* Brotkorb (oval, geflochten) mit Leinentuch, Brötchen und Brotscheiben */
  const cx = 44, cy = 70;
  let k = schatten(cx + 2, cy + 4, 30, 8, 0.35);
  k += `<ellipse cx="${cx}" cy="${cy}" rx="30" ry="15" fill="${S.lg("korb", [[0, "#c99552"], [1, "#8a5a24"]])}"/>`;
  for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2; k += `<path d="M${r(cx + Math.cos(a) * 30)} ${r(cy + Math.sin(a) * 15)} L${r(cx + Math.cos(a) * 25)} ${r(cy + Math.sin(a) * 11)}" stroke="#7a4c1c" stroke-width=".5"/>`; }
  k += `<ellipse cx="${cx}" cy="${cy - 1.6}" rx="25.4" ry="11.4" fill="#5a3814"/>`;
  k += `<path d="M${cx - 26} ${cy - 2} Q${cx - 20} ${cy - 14} ${cx - 6} ${cy - 10} L${cx + 4} ${cy + 8} Q${cx - 14} ${cy + 12} ${cx - 26} ${cy - 2} Z" fill="#eae3d3"/>`;
  k += `<path d="M${cx + 24} ${cy - 4} Q${cx + 26} ${cy + 6} ${cx + 14} ${cy + 10} L${cx + 6} ${cy - 4} Z" fill="#e2dac8"/>`;
  /* Brotscheiben (Mischbrot) und zwei Brötchen */
  for (const [dx, dy, rot] of [[-8, -3, -12], [-3, -4, -4], [2, -3.4, 6]]) k += `<g transform="rotate(${rot} ${cx + dx} ${cy + dy})"><ellipse cx="${cx + dx}" cy="${cy + dy}" rx="6" ry="7" fill="#7a4a24"/><ellipse cx="${cx + dx}" cy="${cy + dy + 0.3}" rx="5" ry="6" fill="${S.rg("krume", [[0, "#ead2a6"], [1, "#d1b07c"]])}"/></g>`;
  for (const [dx, dy] of [[12, -2], [17, 3]]) k += `<ellipse cx="${cx + dx}" cy="${cy + dy}" rx="6.4" ry="4.6" fill="${S.rg("broetchen", [[0, "#efc27a"], [0.6, "#cf8f3e"], [1, "#9a5a1e"]], 0.4, 0.35, 0.7)}"/><path d="M${cx + dx - 3.6} ${cy + dy - 0.6} q3.6 -1.8 7.2 0" stroke="#8a4f18" stroke-width=".6" fill="none"/>`;
  S.teil({ id: "brotkorb", de: "der Brotkorb", syl: "BROT-korb", it: "il cestino del pane", itSyl: "ce-STI-no del PA-ne", en: "bread basket", x: cx, y: cy, kunst: A(cx, cy, k) });
}
{
  /* Vase (Glas, mit Wasser) */
  const cx = 94, by = 66;
  let k = schatten(cx, by, 8, 2.4, 0.35);
  k += `<path d="M${cx - 5} ${by} C${cx - 7} ${by - 8} ${cx - 6.4} ${by - 14} ${cx - 3.4} ${by - 20} L${cx + 3.4} ${by - 20} C${cx + 6.4} ${by - 14} ${cx + 7} ${by - 8} ${cx + 5} ${by} Z" fill="${S.lg("vasewasser", [[0, "#9cc4c9", 0.5], [1, "#6c9aa2", 0.45]])}"/>`;
  k += `<path d="M${cx - 5} ${by} C${cx - 7} ${by - 8} ${cx - 6.4} ${by - 14} ${cx - 3.4} ${by - 20} L${cx + 3.4} ${by - 20} C${cx + 6.4} ${by - 14} ${cx + 7} ${by - 8} ${cx + 5} ${by} Z" fill="${GLAS}" stroke="#d9e7ec" stroke-width=".35"/>`;
  k += `<ellipse cx="${cx}" cy="${by - 20}" rx="3.4" ry="1.2" fill="none" stroke="#e8f2f5" stroke-width=".4"/>`;
  k += `<path d="M${cx - 4.4} ${by - 4} C${cx - 5.6} ${by - 9} ${cx - 5} ${by - 14} ${cx - 3} ${by - 18}" stroke="#fff" stroke-width=".7" opacity=".7" fill="none"/>`;
  S.teil({ id: "vase", de: "die Vase", syl: "VA-se", it: "il vaso", itSyl: "VA-so", en: "vase", x: cx, y: by - 10, kunst: A(cx, by - 10, k) });
}
{
  /* drei Tulpen in der Vase */
  const cx = 94, by = 46;
  let k = "";
  for (const [dx, top, rot, f] of [[-7, 18, -14, "#d8344a"], [1, 12, 2, "#e8495a"], [8, 20, 16, "#c92a3e"]]) {
    k += `<path d="M${cx} ${by} Q${cx + dx * 0.4} ${(by + top) / 2} ${cx + dx} ${top + 6}" stroke="#4f8a3a" stroke-width="1" fill="none"/>`;
    k += `<g transform="rotate(${rot} ${cx + dx} ${top + 4})"><path d="M${cx + dx - 4} ${top + 2} C${cx + dx - 4.4} ${top + 8} ${cx + dx + 4.4} ${top + 8} ${cx + dx + 4} ${top + 2} L${cx + dx + 2.6} ${top - 3} L${cx + dx + 1} ${top} L${cx + dx} ${top - 3.6} L${cx + dx - 1} ${top} L${cx + dx - 2.6} ${top - 3} Z" fill="${f}"/><path d="M${cx + dx - 1.6} ${top + 1} q.4 4 2 5.4" stroke="#fff" stroke-width=".5" opacity=".35" fill="none"/></g>`;
  }
  k += `<path d="M${cx - 2} ${by - 2} q-9 -6 -10 -16 q6 4 9 14 Z" fill="#5f9c46"/><path d="M${cx + 2} ${by - 2} q8 -5 11 -14 q-7 3 -10 12 Z" fill="#4f8a3a"/>`;
  S.teil({ id: "tulpe", de: "die Tulpe", syl: "TUL-pe", it: "il tulipano", itSyl: "tu-li-PA-no", en: "tulip", x: cx, y: 28, kunst: A(cx, 28, k) });
}
{
  /* Kerze im Messinghalter */
  const cx = 124, by = 64;
  let k = schatten(cx, by, 9, 2.6, 0.35);
  k += `<ellipse cx="${cx}" cy="${by - 1}" rx="8" ry="3" fill="${S.lg("messing", [[0, "#7a5a1c"], [0.4, "#e7c871"], [0.6, "#fff0b0"], [1, "#9a7424"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${cx - 2} ${by - 3} L${cx - 1.4} ${by - 9} L${cx + 1.4} ${by - 9} L${cx + 2} ${by - 3} Z" fill="#c9a446"/><ellipse cx="${cx}" cy="${by - 9.4}" rx="4.4" ry="1.6" fill="#d9b85a"/>`;
  k += `<rect x="${cx - 2.8}" y="${by - 37}" width="5.6" height="28" rx=".6" fill="${S.lg("kerze", [[0, "#e9e2d2"], [0.4, "#fffdf6"], [1, "#d8cfbd"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="${cx}" cy="${by - 37}" rx="2.8" ry="1" fill="#f3eee2"/><path d="M${cx + 1.6} ${by - 36.6} q.8 3 .3 6" stroke="#f8f4ea" stroke-width=".8" fill="none"/>`;
  k += `<line x1="${cx}" y1="${by - 37}" x2="${cx}" y2="${by - 39.4}" stroke="#2a2018" stroke-width=".4"/>`;
  k += `<path d="M${cx} ${by - 46} C${cx - 2.2} ${by - 42} ${cx - 1.8} ${by - 39} ${cx} ${by - 38.6} C${cx + 1.8} ${by - 39} ${cx + 2.2} ${by - 42} ${cx} ${by - 46} Z" fill="${S.rg("flamme", [[0, "#ffffff"], [0.4, "#ffe9a0"], [1, "#ff9a2a"]], 0.5, 0.75, 0.7)}"/>`;
  S.teil({ id: "kerze", de: "die Kerze", syl: "KER-ze", it: "la candela", itSyl: "can-DE-la", en: "candle", x: cx, y: by - 20, kunst: A(cx, by - 20, k) });
  S.davor(`<circle cx="${cx}" cy="${by - 42}" r="16" fill="${S.rg("schein", [[0, "#ffd88a", 0.35], [1, "#ffd88a", 0]])}"/>`);
}
{
  /* Salzstreuer (Glas, Edelstahlkappe) */
  const cx = 148, by = 68;
  let k = schatten(cx, by, 5.4, 1.8, 0.35);
  k += `<path d="M${cx - 4.4} ${by} L${cx - 4} ${by - 13} L${cx + 4} ${by - 13} L${cx + 4.4} ${by} Z" fill="#f8f8f6"/>`;
  k += `<path d="M${cx - 4.4} ${by} L${cx - 4} ${by - 13} L${cx + 4} ${by - 13} L${cx + 4.4} ${by} Z" fill="${GLAS}" stroke="#cfdde2" stroke-width=".3"/>`;
  for (let i = 0; i < 12; i++) k += `<circle cx="${r(cx - 3 + rnd() * 6)}" cy="${r(by - 1 - rnd() * 9)}" r=".35" fill="#e1e4e6"/>`;
  k += `<path d="M${cx - 4.2} ${by - 13} Q${cx - 4.2} ${by - 18} ${cx} ${by - 18} Q${cx + 4.2} ${by - 18} ${cx + 4.2} ${by - 13} Z" fill="${SILBER}"/>`;
  for (const [dx, dy] of [[-1.4, -15.6], [0, -16.2], [1.4, -15.6], [0, -14.6]]) k += `<circle cx="${cx + dx}" cy="${by + dy}" r=".35" fill="#555"/>`;
  k += `<rect x="${cx - 3.4}" y="${by - 12}" width=".8" height="10" fill="#fff" opacity=".7"/>`;
  S.teil({ id: "salzstreuer", de: "der Salzstreuer", syl: "SALZ-streu-er", it: "la saliera", itSyl: "sa-LIE-ra", en: "salt shaker", x: cx, y: by - 8, kunst: A(cx, by - 8, k) });
}
{
  /* Pfeffermühle (Holz) */
  const cx = 162, by = 70;
  let k = schatten(cx, by, 6, 2, 0.35);
  const PF = S.lg("pfeffer", [[0, "#3a2414"], [0.35, "#7a4e2c"], [0.55, "#9a6a40"], [1, "#2e1c10"]], 0, 0, 1, 0);
  k += `<path d="M${cx - 5.4} ${by} L${cx - 5.4} ${by - 4} Q${cx - 3.4} ${by - 8} ${cx - 3.6} ${by - 16} Q${cx - 3.6} ${by - 22} ${cx - 5} ${by - 25} L${cx + 5} ${by - 25} Q${cx + 3.6} ${by - 22} ${cx + 3.6} ${by - 16} Q${cx + 3.4} ${by - 8} ${cx + 5.4} ${by - 4} L${cx + 5.4} ${by} Z" fill="${PF}"/>`;
  k += `<path d="M${cx - 5} ${by - 25} Q${cx - 4.6} ${by - 31} ${cx} ${by - 32} Q${cx + 4.6} ${by - 31} ${cx + 5} ${by - 25} Z" fill="${PF}"/><rect x="${cx - 5.2}" y="${by - 25.8}" width="10.4" height="1.4" fill="#22140a"/>`;
  k += `<circle cx="${cx}" cy="${by - 33}" r="1.4" fill="${SILBER}"/><path d="M${cx - 2.6} ${by - 22} L${cx - 2.6} ${by - 6}" stroke="#d9a878" stroke-width=".7" opacity=".55"/>`;
  S.teil({ id: "pfeffermuehle", de: "die Pfeffermühle", syl: "PFEF-fer-müh-le", it: "il macinapepe", itSyl: "ma-ci-na-PE-pe", en: "pepper mill", x: cx, y: by - 16, kunst: A(cx, by - 16, k),
    tipp: "In der Pfeffermühle werden die Pfefferkörner frisch gemahlen." });
}
{
  /* Zuckerdose (Porzellan, Deckel mit Knauf) */
  const cx = 246, by = 74;
  let k = schatten(cx, by, 10, 2.8, 0.35);
  k += `<path d="M${cx - 8} ${by - 10} C${cx - 9} ${by - 4} ${cx - 6} ${by} ${cx} ${by} C${cx + 6} ${by} ${cx + 9} ${by - 4} ${cx + 8} ${by - 10} Z" fill="${PORZ_S}"/>`;
  k += `<ellipse cx="${cx}" cy="${by - 10}" rx="8.4" ry="3" fill="${PORZ}" stroke="#d7d1c4" stroke-width=".3"/>`;
  k += `<path d="M${cx - 2} ${by - 11.4} Q${cx} ${by - 15} ${cx + 2} ${by - 11.4} Z" fill="#f2efe8" stroke="#d7d1c4" stroke-width=".3"/>`;
  k += `<path d="M${cx - 8.4} ${by - 6} C${cx - 4} ${by - 4.6} ${cx + 4} ${by - 4.6} ${cx + 8.4} ${by - 6}" stroke="#2f5d9a" stroke-width=".5" fill="none"/>`;
  S.teil({ id: "zuckerdose", de: "die Zuckerdose", syl: "ZU-cker-do-se", it: "la zuccheriera", itSyl: "zuc-che-RIE-ra", en: "sugar bowl", x: cx, y: by - 6, kunst: A(cx, by - 6, k) });
}
{
  /* Milchkännchen */
  const cx = 280, by = 80;
  let k = schatten(cx, by, 8, 2.4, 0.35);
  k += `<path d="M${cx - 6} ${by - 15} C${cx - 7.4} ${by - 8} ${cx - 7} ${by - 2} ${cx - 5} ${by} L${cx + 5} ${by} C${cx + 7} ${by - 2} ${cx + 7.4} ${by - 8} ${cx + 6} ${by - 15} Z" fill="${PORZ_S}"/>`;
  k += `<path d="M${cx - 6.4} ${by - 15} L${cx - 9.6} ${by - 16.4} L${cx - 5.6} ${by - 13}" fill="#f3f0ea" stroke="#d4cec2" stroke-width=".3"/>`;
  k += `<ellipse cx="${cx}" cy="${by - 15}" rx="6" ry="2" fill="#f4f1ea" stroke="#d4cec2" stroke-width=".3"/><ellipse cx="${cx}" cy="${by - 14.6}" rx="4.8" ry="1.4" fill="#fbfaf6"/>`;
  k += `<path d="M${cx + 6.4} ${by - 12.6} q5 .4 4 5 q-1 3 -4.6 3.2" stroke="#e9e5dc" stroke-width="1.4" fill="none"/>`;
  k += `<path d="M${cx - 6.6} ${by - 7} C${cx - 3} ${by - 5.8} ${cx + 3} ${by - 5.8} ${cx + 6.6} ${by - 7}" stroke="#2f5d9a" stroke-width=".5" fill="none"/>`;
  S.teil({ id: "milchkaennchen", de: "das Milchkännchen", syl: "MILCH-känn-chen", it: "il bricco del latte", itSyl: "BRIC-co del LAT-te", en: "milk jug", x: cx, y: by - 8, kunst: A(cx, by - 8, k) });
}

/* =====================================================================
   3 — DAS GEDECK: Platzdeckchen, Unterteller, Teller, Besteck, Gläser,
       Brotteller mit Buttermesser, Serviette, Kaffeegedeck
   ===================================================================== */
{
  S.def(`<pattern id="${S.id("leinen")}" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="#d9d0bf"/><path d="M0 .5 H2 M.5 0 V2" stroke="#c9bea9" stroke-width=".35"/></pattern>`);
  let k = `<path d="M66 92 L214 92 Q218 92 218.6 95 L224.8 182 Q225 186 221 186 L59 186 Q55 186 55.2 182 L61.4 95 Q62 92 66 92 Z" fill="url(#${S.id("leinen")})"/>`;
  k += `<path d="M66 92 L214 92 Q218 92 218.6 95 L224.8 182 Q225 186 221 186 L59 186 Q55 186 55.2 182 L61.4 95 Q62 92 66 92 Z" fill="${S.lg("deckchenlicht", [[0, "#fff", 0.12], [1, "#000", 0.08]])}"/>`;
  k += `<path d="M66.6 95 L213.4 95 L220.8 182.6 L59.2 182.6 Z" fill="none" stroke="#b8ab92" stroke-width=".45" stroke-dasharray="1.2 .7"/>`;
  S.teil({ id: "platzdeckchen", de: "das Platzdeckchen", syl: "PLATZ-deck-chen", it: "la tovaglietta", itSyl: "to-va-GLIET-ta", en: "placemat", x: 140, y: 182, kunst: A(140, 182, k) });
}
{
  const cx = 70, cy = 104;
  let k = schatten(cx + 1, cy + 3, 19, 6, 0.3);
  k += `<ellipse cx="${cx}" cy="${cy}" rx="19" ry="${r(19 * F)}" fill="${PORZ}" stroke="#cfc8bb" stroke-width=".3"/>`;
  k += `<ellipse cx="${cx}" cy="${cy + 0.6}" rx="12.6" ry="${r(12.6 * F)}" fill="#f9f8f4" stroke="#e2ddd2" stroke-width=".4"/>`;
  k += `<ellipse cx="${cx}" cy="${cy}" rx="17.6" ry="${r(17.6 * F)}" fill="none" stroke="#2f5d9a" stroke-width=".35"/>`;
  S.teil({ id: "brotteller", de: "der Brotteller", syl: "BROT-tel-ler", it: "il piattino del pane", itSyl: "piat-TI-no del PA-ne", en: "bread plate", x: cx, y: cy, kunst: A(cx, cy, k) });
}
{
  /* Buttermesser quer auf dem Brotteller, Griff nach rechts */
  const cx = 70, cy = 101;
  let k = `<g transform="rotate(-8 ${cx} ${cy})"><path d="M${cx - 15} ${cy} Q${cx - 14} ${cy - 2.4} ${cx - 10} ${cy - 2.6} L${cx - 1} ${cy - 2} L${cx - 1} ${cy + 0.6} L${cx - 13} ${cy + 1} Z" fill="${SILBER_V}" stroke="#8c949b" stroke-width=".2"/>`;
  k += `<rect x="${cx - 1}" y="${cy - 2}" width="16" height="2.8" rx="1.3" fill="${SILBER_V}" stroke="#8c949b" stroke-width=".2"/><rect x="${cx + 1}" y="${cy - 1.6}" width="12" height=".6" rx=".3" fill="#fff" opacity=".8"/></g>`;
  S.teil({ oben: true, id: "buttermesser", de: "das Buttermesser", syl: "BUT-ter-mes-ser", it: "il coltello da burro", itSyl: "col-TEL-lo da BUR-ro", en: "butter knife", x: cx, y: cy, kunst: A(cx, cy, k) });
}
{
  /* Serviette: Leinen, zum Rechteck gefaltet, links neben der Gabel */
  const k = schatten(45, 162, 13, 3, 0.3)
    + `<path d="M33 122 L57 121 L58.6 164 L34 165.4 Z" fill="${S.lg("serv", [[0, "#cfdcc9"], [1, "#b1c3aa"]], 0, 0, 1, 1)}"/>`
    + `<path d="M33 122 L57 121 L57.6 135 L33.4 136.6 Z" fill="#dbe6d6"/><path d="M33.4 136.6 L57.6 135" stroke="#9aae92" stroke-width=".5"/>`
    + `<path d="M36 124 L54 123.4 M36 160 L55.6 159" stroke="#a3b79b" stroke-width=".35" stroke-dasharray="1 .6"/>`;
  S.teil({ id: "serviette_d", de: "die Serviette", syl: "Ser-vi-ET-te", it: "il tovagliolo", itSyl: "to-va-GLIO-lo", en: "napkin", x: 46, y: 143, kunst: A(46, 143, k) });
}
{
  const cx = 140, cy = 140;
  let k = schatten(cx, cy + 4, 54, 15, 0.3);
  k += `<ellipse cx="${cx}" cy="${cy}" rx="54" ry="${r(54 * F)}" fill="${S.rg("platz", [[0, "#f3f1ec"], [0.8, "#cfccc4"], [1, "#9d9a92"]], 0.45, 0.4, 0.6)}"/>`;
  k += `<ellipse cx="${cx}" cy="${cy}" rx="52" ry="${r(52 * F)}" fill="none" stroke="#fff" stroke-width=".6" opacity=".7"/>`;
  S.teil({ id: "unterteller", de: "der Unterteller", syl: "UN-ter-tel-ler", it: "il sottopiatto", itSyl: "sot-to-PIAT-to", en: "charger plate", x: cx, y: cy, kunst: A(cx, cy, k),
    tipp: "Auf dem Unterteller (Platzteller) stehen die Teller der einzelnen Gänge." });
}
{
  const cx = 140, cy = 139;
  let k = schatten(cx, cy + 3, 46, 12, 0.25);
  k += `<ellipse cx="${cx}" cy="${cy}" rx="46" ry="${r(46 * F)}" fill="${PORZ}" stroke="#d2ccbf" stroke-width=".35"/>`;
  k += `<ellipse cx="${cx}" cy="${cy}" rx="44.4" ry="${r(44.4 * F)}" fill="none" stroke="#2f5d9a" stroke-width=".45"/>`;
  k += `<ellipse cx="${cx}" cy="${cy + 1.2}" rx="31" ry="${r(31 * F)}" fill="${S.rg("spiegel", [[0, "#fdfcf9"], [0.85, "#f4f2ec"], [1, "#e3ded3"]])}"/>`;
  k += `<path d="M${cx - 28} ${cy - 8} A31 ${r(31 * F)} 0 0 1 ${cx + 6} ${cy - 21.6}" stroke="#d9d3c6" stroke-width=".8" fill="none"/>`;
  k += `<path d="M${cx - 38} ${cy - 12} A42 ${r(42 * F)} 0 0 1 ${cx - 16} ${cy - 29}" stroke="#fff" stroke-width="1.6" opacity=".9" fill="none"/>`;
  S.teil({ id: "teller_d", de: "der Teller", syl: "TEL-ler", it: "il piatto", itSyl: "PIAT-to", en: "plate", x: cx, y: cy, kunst: A(cx, cy, k) });
}
{
  /* Gabel links, Zinken nach oben */
  const cx = 77, top = 113;
  let k = schatten(cx + 1.4, top + 30, 4, 26, 0.22);
  k += `<path d="M${cx - 4.2} ${top} L${cx - 4.2} ${top + 9} Q${cx - 4.2} ${top + 14} ${cx - 1.2} ${top + 16} L${cx - 1.4} ${top + 32} Q${cx - 3} ${top + 46} ${cx - 2.6} ${top + 52} Q${cx} ${top + 55} ${cx + 2.6} ${top + 52} Q${cx + 3} ${top + 46} ${cx + 1.4} ${top + 32} L${cx + 1.2} ${top + 16} Q${cx + 4.2} ${top + 14} ${cx + 4.2} ${top + 9} L${cx + 4.2} ${top} L${cx + 3.2} ${top} L${cx + 3.2} ${top + 8} L${cx + 1.9} ${top + 8} L${cx + 1.9} ${top} L${cx + 0.65} ${top} L${cx + 0.65} ${top + 8} L${cx - 0.65} ${top + 8} L${cx - 0.65} ${top} L${cx - 1.9} ${top} L${cx - 1.9} ${top + 8} L${cx - 3.2} ${top + 8} L${cx - 3.2} ${top} Z" fill="${SILBER}" stroke="#8c949b" stroke-width=".2"/>`;
  k += `<path d="M${cx - 0.6} ${top + 18} L${cx - 1} ${top + 48}" stroke="#fff" stroke-width=".7" opacity=".8"/>`;
  S.teil({ id: "gabel_d", de: "die Gabel", syl: "GA-bel", it: "la forchetta", itSyl: "for-CHET-ta", en: "fork", x: cx, y: top + 27, kunst: A(cx, top + 27, k),
    tipp: "Die Gabel liegt links vom Teller." });
}
{
  /* Messer rechts, Schneide zum Teller */
  const cx = 203, top = 111;
  let k = schatten(cx + 1.4, top + 30, 4, 27, 0.22);
  k += `<path d="M${cx - 2.6} ${top + 26} L${cx - 2.6} ${top + 5} Q${cx - 2} ${top} ${cx + 1} ${top} Q${cx + 2.6} ${top + 1} ${cx + 2.4} ${top + 6} L${cx + 2} ${top + 26} Z" fill="${SILBER}" stroke="#8c949b" stroke-width=".2"/>`;
  k += `<path d="M${cx - 2.6} ${top + 5} L${cx - 2.6} ${top + 26}" stroke="#eef2f4" stroke-width=".5"/>`;
  k += `<rect x="${cx - 2.8}" y="${top + 26}" width="5.4" height="31" rx="2.6" fill="${SILBER}" stroke="#8c949b" stroke-width=".2"/>`;
  k += `<rect x="${cx - 1.4}" y="${top + 29}" width=".9" height="25" rx=".4" fill="#fff" opacity=".8"/>`;
  S.teil({ id: "messer_d", de: "das Messer", syl: "MES-ser", it: "il coltello", itSyl: "col-TEL-lo", en: "knife", x: cx, y: top + 28, kunst: A(cx, top + 28, k),
    tipp: "Die Schneide des Messers zeigt zum Teller." });
}
{
  /* Esslöffel (Suppenlöffel) rechts neben dem Messer */
  const cx = 215, top = 112;
  let k = schatten(cx + 1.4, top + 30, 4, 27, 0.22);
  k += `<ellipse cx="${cx}" cy="${top + 7}" rx="4.6" ry="7" fill="${S.rg("loeffel", [[0, "#ffffff"], [0.5, "#c8ced3"], [1, "#9aa3aa"]], 0.4, 0.6, 0.6)}" stroke="#8c949b" stroke-width=".2"/>`;
  k += `<path d="M${cx - 1.1} ${top + 13.4} L${cx - 1.6} ${top + 44} Q${cx - 3} ${top + 52} ${cx} ${top + 56} Q${cx + 3} ${top + 52} ${cx + 1.6} ${top + 44} L${cx + 1.1} ${top + 13.4} Z" fill="${SILBER}" stroke="#8c949b" stroke-width=".2"/>`;
  k += `<ellipse cx="${cx - 1.4}" cy="${top + 5}" rx="1.2" ry="2.4" fill="#fff" opacity=".85"/>`;
  S.teil({ id: "esslöffel", de: "der Esslöffel", syl: "ESS-löf-fel", it: "il cucchiaio", itSyl: "cuc-CHIA-io", en: "tablespoon", x: cx, y: top + 28, kunst: A(cx, top + 28, k) });
}
{
  /* Weinglas oberhalb der Messerspitze */
  const cx = 196, by = 100;
  let k = schatten(cx, by, 9, 2.6, 0.3);
  k += `<ellipse cx="${cx}" cy="${by - 1}" rx="8" ry="${r(8 * F * 0.6)}" fill="${GLAS}" stroke="#d0e0e6" stroke-width=".35"/>`;
  k += `<rect x="${cx - 0.7}" y="${by - 20}" width="1.4" height="19" fill="${S.lg("stiel", [[0, "#ffffff", 0.9], [1, "#bcd0d7", 0.6]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${cx - 9.6} ${by - 42} C${cx - 10.4} ${by - 30} ${cx - 6} ${by - 21} ${cx} ${by - 20} C${cx + 6} ${by - 21} ${cx + 10.4} ${by - 30} ${cx + 9.6} ${by - 42} Z" fill="${GLAS}" stroke="#cfe0e6" stroke-width=".35"/>`;
  k += `<path d="M${cx - 9.4} ${by - 30} C${cx - 8.4} ${by - 24} ${cx - 5} ${by - 21.2} ${cx} ${by - 20.8} C${cx + 5} ${by - 21.2} ${cx + 8.4} ${by - 24} ${cx + 9.4} ${by - 30} Z" fill="${S.lg("wein", [[0, "#8a1b2c", 0.85], [1, "#4e0a16", 0.9]])}"/>`;
  k += `<ellipse cx="${cx}" cy="${by - 30}" rx="9.4" ry="2.6" fill="#a3283a" opacity=".85"/>`;
  k += `<ellipse cx="${cx}" cy="${by - 42}" rx="9.6" ry="${r(9.6 * F * 0.5)}" fill="none" stroke="#e3eef2" stroke-width=".45"/>`;
  k += `<path d="M${cx - 7.6} ${by - 39} C${cx - 8} ${by - 32} ${cx - 6} ${by - 26} ${cx - 3.4} ${by - 23}" stroke="#fff" stroke-width=".9" opacity=".8" fill="none"/>`;
  S.teil({ id: "weinglas", de: "das Weinglas", syl: "WEIN-glas", it: "il bicchiere da vino", itSyl: "bic-CHIE-re da VI-no", en: "wine glass", x: cx, y: by - 22, kunst: A(cx, by - 22, k) });
}
{
  /* Wasserglas rechts daneben */
  const cx = 219, by = 104;
  let k = schatten(cx, by, 8, 2.4, 0.3);
  k += `<path d="M${cx - 7} ${by - 24} L${cx - 6} ${by - 1} Q${cx} ${by + 1.4} ${cx + 6} ${by - 1} L${cx + 7} ${by - 24} Z" fill="${S.lg("wasser", [[0, "#cfe6ee", 0.35], [1, "#a8cbd8", 0.45]])}"/>`;
  k += `<path d="M${cx - 6.6} ${by - 15} L${cx - 6} ${by - 1} Q${cx} ${by + 1.4} ${cx + 6} ${by - 1} L${cx + 6.6} ${by - 15} Z" fill="#b8dbe6" opacity=".45"/><ellipse cx="${cx}" cy="${by - 15}" rx="6.6" ry="2.2" fill="#d7eef4" opacity=".8"/>`;
  k += `<path d="M${cx - 7} ${by - 24} L${cx - 6} ${by - 1} Q${cx} ${by + 1.4} ${cx + 6} ${by - 1} L${cx + 7} ${by - 24} Z" fill="${GLAS}" stroke="#cfe0e6" stroke-width=".35"/>`;
  k += `<ellipse cx="${cx}" cy="${by - 24}" rx="7" ry="2.4" fill="none" stroke="#e6f1f4" stroke-width=".45"/>`;
  k += `<path d="M${cx - 5.4} ${by - 21} L${cx - 4.8} ${by - 4}" stroke="#fff" stroke-width=".9" opacity=".75"/>`;
  S.teil({ id: "glas_d", de: "das Glas", syl: "GLAS", it: "il bicchiere", itSyl: "bic-CHIE-re", en: "glass", x: cx, y: by - 12, kunst: A(cx, by - 12, k),
    tipp: "Die Gläser stehen oberhalb des Messers." });
}
{
  const cx = 262, cy = 132;
  let k = schatten(cx, cy + 3, 22, 6, 0.3);
  k += `<ellipse cx="${cx}" cy="${cy}" rx="21" ry="${r(21 * F)}" fill="${PORZ}" stroke="#d2ccbf" stroke-width=".35"/>`;
  k += `<ellipse cx="${cx}" cy="${cy}" rx="19.6" ry="${r(19.6 * F)}" fill="none" stroke="#2f5d9a" stroke-width=".4"/>`;
  k += `<ellipse cx="${cx}" cy="${cy + 0.6}" rx="9" ry="${r(9 * F)}" fill="#efece5"/>`;
  S.teil({ id: "untertasse", de: "die Untertasse", syl: "UN-ter-tas-se", it: "il piattino", itSyl: "piat-TI-no", en: "saucer", x: cx, y: cy, kunst: A(cx, cy, k) });
}
{
  const cx = 260, by = 134;
  let k = schatten(cx, by, 10, 2.6, 0.3);
  k += `<path d="M${cx - 10} ${by - 17} C${cx - 10.4} ${by - 6} ${cx - 6} ${by} ${cx} ${by} C${cx + 6} ${by} ${cx + 10.4} ${by - 6} ${cx + 10} ${by - 17} Z" fill="${PORZ_S}"/>`;
  k += `<path d="M${cx + 9.6} ${by - 14} q6.4 -.4 5.6 5 q-.8 4 -7.4 3.4" stroke="#ece8df" stroke-width="2" fill="none"/><path d="M${cx + 9.6} ${by - 14} q6.4 -.4 5.6 5 q-.8 4 -7.4 3.4" stroke="#cfc8bb" stroke-width=".3" fill="none"/>`;
  k += `<ellipse cx="${cx}" cy="${by - 17}" rx="10" ry="${r(10 * F * 0.75)}" fill="#f4f1ea" stroke="#d2ccbf" stroke-width=".35"/>`;
  k += `<path d="M${cx - 10} ${by - 13.4} C${cx - 4} ${by - 11.6} ${cx + 4} ${by - 11.6} ${cx + 10} ${by - 13.4}" stroke="#2f5d9a" stroke-width=".5" fill="none"/>`;
  k += `<path d="M${cx - 8} ${by - 14} C${cx - 7.4} ${by - 6} ${cx - 5} ${by - 2.4} ${cx - 2} ${by - 1.6}" stroke="#fff" stroke-width="1" opacity=".7" fill="none"/>`;
  S.teil({ id: "tasse_d", de: "die Tasse", syl: "TAS-se", it: "la tazza", itSyl: "TAZ-za", en: "cup", x: cx, y: by - 9, kunst: A(cx, by - 9, k) });
}
{
  const cx = 260, cy = 117.4;
  let k = `<ellipse cx="${cx}" cy="${cy}" rx="8.8" ry="${r(8.8 * F * 0.72)}" fill="${S.rg("kaffee", [[0, "#7a4a2a"], [0.6, "#4a2a16"], [1, "#2e180a"]], 0.45, 0.4, 0.6)}"/>`;
  k += `<ellipse cx="${cx - 2}" cy="${cy - 1}" rx="3.6" ry="1.2" fill="#c8915e" opacity=".55"/><ellipse cx="${cx + 3.4}" cy="${cy + 1.2}" rx="1.6" ry=".6" fill="#fff" opacity=".35"/>`;
  k += `<path d="M${cx - 2} ${cy - 3} q-1.6 -3 0 -5.6 q1.6 -2.6 0 -5.4 M${cx + 2} ${cy - 3} q1.4 -2.6 0 -5 q-1.4 -2.4 0 -4.8" stroke="#fff" stroke-width=".6" opacity=".45" fill="none"/>`;
  S.teil({ id: "kaffee", de: "der Kaffee", syl: "KAF-fee", it: "il caffè", itSyl: "caf-FÈ", en: "coffee", x: cx, y: cy, kunst: A(cx, cy, k) });
}
{
  /* Teelöffel rechts auf der Untertasse */
  const cx = 276, cy = 138;
  let k = `<g transform="rotate(-38 ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy - 6}" rx="2.4" ry="3.6" fill="${S.rg("tl", [[0, "#ffffff"], [0.6, "#c3c9ce"], [1, "#9aa3aa"]], 0.4, 0.6, 0.6)}" stroke="#8c949b" stroke-width=".2"/>`;
  k += `<path d="M${cx - 0.6} ${cy - 2.6} L${cx - 0.9} ${cy + 12} Q${cx} ${cy + 14} ${cx + 0.9} ${cy + 12} L${cx + 0.6} ${cy - 2.6} Z" fill="${SILBER}" stroke="#8c949b" stroke-width=".2"/></g>`;
  S.teil({ oben: true, id: "teeloeffel", de: "der Teelöffel", syl: "TEE-löf-fel", it: "il cucchiaino", itSyl: "cuc-chia-I-no", en: "teaspoon", x: cx, y: cy, kunst: A(cx, cy, k) });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/tisch_detail.js"));
console.log(aus);
