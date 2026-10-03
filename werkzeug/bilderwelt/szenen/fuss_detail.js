#!/usr/bin/env node
/* =====================================================================
   DER FUSS GANZ NAH (FASSUNG 852) — Bilderwelt neu, Detail-Szene
   (geöffnet über die Lupe aus „koerper“)
   ---------------------------------------------------------------------
   RECHERCHE (Anatomie des Fußes, Lehrbuchansichten „dorsal“/„plantar“):
   - Fußlänge ≈ 26 cm, Breite am Ballen ≈ 10 cm.
   - Von oben (dorsal): fünf Zehen, der große Zeh innen, der zweite oft
     gleich lang oder etwas länger; Zehennägel; Fußrücken mit Sehnen;
     innen und außen am Sprunggelenk die Knöchel (der innere liegt
     höher und weiter vorn).
   - Von unten (plantar): Zehenballen, der breite Fußballen hinter den
     Zehen, das Längsgewölbe innen (berührt beim Stehen den Boden
     nicht), die runde Ferse mit dicker Haut.
   Darstellung wie im Lehrbuch: links der rechte Fuß von oben (die Hose
   reicht bis zum Knöchel), rechts derselbe Fuß von unten.
   Maßstab: ≈ 6,9 Einheiten je Zentimeter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "fuss_detail", titel: "Der Fuß ganz nah", emoji: "🔍", thema: "Körper", kuerzel: "b27c", fassung: 852 });
const r = B.r;
const A = (cx, cy, svg) => `<g transform="translate(${-cx} ${-cy})">${svg}</g>`;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("w1")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".8"/></filter>`);
S.def(`<filter id="${S.id("w4")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>`);
const W1 = `filter="url(#${S.id("w1")})"`;
const OBEN_H = S.lg("obenh", [[0, "#cf9473"], [0.2, "#e8b694"], [0.55, "#f0c4a4"], [0.85, "#e2ac8a"], [1, "#c88d6c"]], 0, 0, 1, 0);
const ZEH = S.lg("zeh", [[0, "#cf9575"], [0.3, "#ecbb9b"], [0.6, "#f2c8aa"], [1, "#d29a79"]], 0, 0, 1, 0);
const NAGEL = S.lg("nagel", [[0, "#f6e2d8"], [0.4, "#efc8bb"], [1, "#e2ab9c"]]);
const SOHLE = S.rg("sohle", [[0, "#f6cfb6"], [0.7, "#ecb99c"], [1, "#d9a083"]], 0.5, 0.5, 0.6);
const ZEH_U = S.rg("zehunten", [[0, "#f9d6c2"], [0.75, "#f0c0a4"], [1, "#dca385"]], 0.5, 0.55, 0.7);
const JEANS = S.lg("jeans", [[0, "#2e4a6e"], [0.5, "#3e5f88"], [1, "#2a4363"]], 0, 0, 1, 0);

/* Zehen des rechten Fußes von oben (großer Zeh links) */
const Z = {
  gross: { bx: 74, by: 50, a: -3, L: 38, w: 23 },
  z2: { bx: 93.4, by: 52, a: 1, L: 37, w: 14.6 },
  z3: { bx: 106.6, by: 56, a: 4, L: 33.5, w: 13.4 },
  z4: { bx: 118.4, by: 61, a: 8, L: 30, w: 12.4 },
  klein: { bx: 128.6, by: 67, a: 14, L: 25, w: 11.2 },
};
const T = (z, svg) => `<g transform="translate(${z.bx} ${z.by}) rotate(${z.a})">${svg}</g>`;
const zehForm = (z) => {
  const w = z.w, w2 = w * 0.92, L = z.L;
  return `M${r(-w / 2)} 4 C${r(-w / 2)} ${r(-L * 0.5)} ${r(-w2 / 2)} ${r(-L * 0.78)} ${r(-w2 / 2)} ${r(-L + w2 * 0.5)} C${r(-w2 / 2)} ${r(-L - w2 * 0.08)} ${r(w2 / 2)} ${r(-L - w2 * 0.08)} ${r(w2 / 2)} ${r(-L + w2 * 0.5)} C${r(w2 / 2)} ${r(-L * 0.78)} ${r(w / 2)} ${r(-L * 0.5)} ${r(w / 2)} 4 Z`;
};
/* Fußrücken: Oberkante wölbt sich über die Zehengrundgelenke */
const RUECKEN = `M62 62 Q63 42.4 74 41.6 Q84 42 86.4 47.4 Q93.4 42.6 100.4 49.6 Q107 46.6 112.6 54 Q118.6 51.6 123.6 59.6 Q129.6 57.4 134 68 C136 80 134.4 102 130 124 C127 140 123 154 121.6 170 L121.6 182 L70.6 182 L70.6 168 C69.6 150 65.4 128 63.4 104 C62.4 90 61.6 78 62 66 Z`;
/* Sohle von unten (großer Zeh rechts); Oberkante = Beugefalten unter den Zehen */
const SOHLE_P = `M189.5 64 Q194.6 57.6 200.2 55 Q204.6 48.8 210.8 49 Q216 42.6 222.8 43.2 Q229 36.6 236 39.8 Q246 34.4 258.4 39.6 C262 47 264.2 58 263.6 72 C263 90 258.4 104 257.4 120 C256.4 136 257 150 252.8 166 C249.2 182 238.4 192.6 225 192.8 C212 193 202.4 184 199.2 170 C196.2 156 192.2 140 190.2 120 C188.8 104 187.6 84 189.5 64 Z`;

/* =====================================================================
   KULISSE — heller Grund, weiche Schatten; Hosenbein hinter der Ferse
   ===================================================================== */
S.def(`<clipPath id="${S.id("sohleclip")}"><path d="${SOHLE_P}"/></clipPath>`);
S.hinten(`<rect width="320" height="200" fill="${S.lg("grund", [[0, "#eef0f1"], [1, "#d3d9dd"]])}"/>`);
S.hinten(`<rect width="320" height="200" fill="${S.rg("grundl", [[0, "#ffffff", 0.7], [1, "#ffffff", 0]], 0.5, 0.35, 0.6)}"/>`);
{
  let sch = `<g opacity=".22" filter="url(#${S.id("w4")})" transform="translate(4 5)"><path d="${RUECKEN}" fill="#3a3f45"/>`;
  for (const z of Object.values(Z)) sch += T(z, `<path d="${zehForm(z)}" fill="#3a3f45"/>`);
  sch += `</g><path d="${SOHLE_P}" fill="#3a3f45" opacity=".22" filter="url(#${S.id("w4")})" transform="translate(4 5)"/>`;
  S.hinten(sch);
  /* hinter der Ferse: das Bein in der Jeans (es zeigt vom Betrachter weg) */
  S.hinten(`<path d="M203 150 C210 146 240 146 247 150 L250 201 L200 201 Z" fill="${JEANS}"/><path d="M201.6 186 C212 183.6 238 183.6 248.6 186" stroke="#c9a15a" stroke-width=".4" stroke-dasharray="1 .7" fill="none"/>`);
}

/* =====================================================================
   LINKS — DER FUSS VON OBEN
   ===================================================================== */
const zehDetail = (z) => {
  let g = `<path d="${zehForm(z)}" fill="${ZEH}"/>`;
  /* Querfalten über dem Gelenk */
  const y = -z.L * 0.42;
  for (let i = 0; i < 3; i++) g += `<path d="M${r(-z.w * 0.26)} ${r(y - 1.4 + i * 1.3)} q${r(z.w * 0.26)} ${r(-1.2 + i * 0.3)} ${r(z.w * 0.52)} 0" stroke="#a96f52" stroke-width=".38" opacity="${r(0.45 - i * 0.1)}" fill="none"/>`;
  g += `<path d="M${r(-z.w * 0.4)} 1.6 q${r(z.w * 0.4)} 1.6 ${r(z.w * 0.8)} 0" stroke="#a96f52" stroke-width=".6" opacity=".35" fill="none" ${W1}/>`;
  g += `<path d="M${r(-z.w * 0.14)} ${r(-z.L * 0.75)} L${r(-z.w * 0.12)} ${r(-z.L * 0.15)}" stroke="#fff3e8" stroke-width="${r(z.w * 0.14)}" opacity=".28" ${W1}/>`;
  return g;
};
{
  S.teil({ id: "zehen", de: "die Zehen", syl: "ZE-hen", it: "le dita del piede", itSyl: "DI-ta del PIE-de", en: "toes", x: 108, y: 40,
    kunst: A(108, 40, [Z.z4, Z.z3, Z.z2].map((z) => T(z, zehDetail(z))).join("") + ZEHEN_UNTEN()),
    tipp: "Ein Fuß hat fünf Zehen. Sie halten uns beim Gehen im Gleichgewicht." });
}
function ZEHEN_UNTEN() {
  /* von unten: die fünf Zehenballen (gespiegelt: großer Zeh rechts) */
  const p = [[247, 28, 11, 14], [229.2, 28, 6.6, 9.4], [216.6, 33, 6.2, 8.6], [205.2, 40.6, 5.8, 8], [195.6, 51.4, 5.2, 6.8]];
  let g = "";
  p.forEach(([x, y, rx, ry], i) => {
    g += `<path d="M${r(x - rx)} ${r(y + ry * 0.5)} C${r(x - rx)} ${r(y - ry * 1.15)} ${r(x + rx)} ${r(y - ry * 1.15)} ${r(x + rx)} ${r(y + ry * 0.5)} L${r(x + rx * 0.9)} ${r(y + ry + 6)} L${r(x - rx * 0.9)} ${r(y + ry + 6)} Z" fill="${ZEH_U}"/>`;
    g += `<path d="M${r(x - rx * 0.8)} ${r(y + ry * 0.75)} q${r(rx * 0.8)} 1.8 ${r(rx * 1.6)} 0" stroke="#b77a5f" stroke-width=".55" opacity=".6" fill="none"/>`;
    g += `<ellipse cx="${r(x - rx * 0.2)}" cy="${r(y - ry * 0.25)}" rx="${r(rx * 0.35)}" ry="${r(ry * 0.3)}" fill="#fff" opacity=".22" ${W1}/>`;
    if (i === 0) g += `<path d="M${r(x - 6)} ${r(y - 6)} q6 -2.6 12 0 M${r(x - 6.6)} ${r(y - 2.6)} q6.6 -2.6 13.2 0 M${r(x - 6.6)} ${r(y + 1)} q6.6 -2.4 13.2 0" stroke="#d29a80" stroke-width=".25" opacity=".55" fill="none"/>`;
  });
  return g;
}
{
  const z = Z.gross;
  S.teil({ id: "grosserzeh", de: "der große Zeh", syl: "GRO-ße ZEH", it: "l'alluce", itSyl: "AL-lu-ce", en: "big toe", x: 73, y: 38, kunst: A(73, 38, T(z, zehDetail(z))),
    tipp: "Der große Zeh trägt beim Abrollen das meiste Gewicht." });
}
{
  const z = Z.klein;
  S.teil({ id: "kleinerzeh", de: "der kleine Zeh", syl: "KLEI-ne ZEH", it: "il mignolo del piede", itSyl: "MI-gno-lo del PIE-de", en: "little toe", x: 135, y: 70, kunst: A(135, 70, T(z, zehDetail(z))) });
}
{
  let k = "";
  for (const z of Object.values(Z)) {
    const w2 = z.w * 0.92, L = z.L, gross = z === Z.gross;
    const nw = w2 * (gross ? 0.64 : 0.56), nl = gross ? 15 : L * 0.24;
    const y0 = -L + (gross ? 1.6 : 1.4), y1 = y0 + nl;
    let g = `<path d="M${r(-nw / 2)} ${r(y1)} L${r(-nw / 2)} ${r(y0 + 2.6)} Q${r(-nw / 2)} ${r(y0)} 0 ${r(y0 - 0.2)} Q${r(nw / 2)} ${r(y0)} ${r(nw / 2)} ${r(y0 + 2.6)} L${r(nw / 2)} ${r(y1)} Q0 ${r(y1 + 1.6)} ${r(-nw / 2)} ${r(y1)} Z" fill="${NAGEL}" stroke="#c48f7c" stroke-width=".3"/>`;
    g += `<path d="M${r(-nw * 0.3)} ${r(y1 - 0.2)} Q0 ${r(y1 - nl * 0.25)} ${r(nw * 0.3)} ${r(y1 - 0.2)}" fill="#fbebe4" opacity=".8"/>`;
    g += `<path d="M${r(-nw / 2 + 0.3)} ${r(y0 + 1.8)} Q0 ${r(y0 + 0.6)} ${r(nw / 2 - 0.3)} ${r(y0 + 1.8)}" stroke="#fbf3ec" stroke-width=".9" fill="none"/>`;
    g += `<path d="M${r(-nw * 0.18)} ${r(y0 + 3)} L${r(-nw * 0.16)} ${r(y1 - 3)}" stroke="#fff" stroke-width=".8" opacity=".5" stroke-linecap="round"/>`;
    k += T(z, g);
  }
  S.teil({ id: "fussnagel", de: "der Fußnagel", syl: "FUß-na-gel", it: "l'unghia del piede", itSyl: "UN-ghia del PIE-de", en: "toenail", x: 74, y: 22, kunst: A(74, 22, k),
    tipp: "Fußnägel schneidet man gerade, nicht rund." });
}
{
  let k = `<path d="${RUECKEN}" fill="${OBEN_H}"/>`;
  /* Sehnen zu den Zehen, Sehne des großen Zehs deutlich */
  k += `<path d="M88 166 C84 130 78 96 75 56" stroke="#f8d4b8" stroke-width="2.4" opacity=".5" fill="none" ${W1}/>`;
  for (const z of [Z.z2, Z.z3, Z.z4, Z.klein]) k += `<path d="M${r(98 + (z.bx - 100) * 0.2)} 150 Q${r((z.bx + 98) / 2)} 110 ${r(z.bx)} ${z.by + 2}" stroke="#f6d0b4" stroke-width="1.2" opacity=".35" fill="none" ${W1}/>`;
  k += `<path d="M110 166 C114 146 108 128 116 108 M92 134 C100 128 108 122 116 108" stroke="#8b96c0" stroke-width="1.2" opacity=".2" fill="none" ${W1}/>`;
  k += `<path d="M64.6 74 C65 100 67 120 69 140" stroke="#fff3e8" stroke-width="3" opacity=".3" fill="none" ${W1}/>`;
  /* Gelenkfalten über den Zehengrundgelenken */
  for (const z of Object.values(Z)) k += `<path d="M${r(z.bx - z.w * 0.3)} ${r(z.by - 2)} q${r(z.w * 0.3)} -1.6 ${r(z.w * 0.6)} 0" stroke="#b07a5c" stroke-width=".4" opacity=".4" fill="none"/>`;
  S.teil({ id: "fussruecken", de: "der Fußrücken", syl: "FUß-rü-cken", it: "il dorso del piede", itSyl: "DOR-so del PIE-de", en: "top of the foot", x: 98, y: 122, kunst: A(98, 122, k) });
}
{
  const bump = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${S.rg("knoechel", [[0, "#f6d2b6"], [0.6, "#e8b594", 0.9], [1, "#d8a080", 0]], 0.45, 0.4, 0.55)}"/>`
    + `<ellipse cx="${r(cx - rx * 0.25)}" cy="${r(cy - ry * 0.3)}" rx="${r(rx * 0.35)}" ry="${r(ry * 0.3)}" fill="#fff6ee" opacity=".4" ${W1}/>`;
  const k = bump(72.6, 158, 5.2, 8.4) + bump(120.4, 165, 4.6, 7.8);
  S.teil({ id: "fussknoechel", de: "der Knöchel", syl: "KNÖ-chel", it: "la caviglia", itSyl: "ca-VI-glia", en: "ankle", x: 64, y: 162, kunst: A(64, 162, k),
    tipp: "Der innere Knöchel liegt höher als der äußere." });
}
{
  let k = `<path d="M58 201 L60.4 180 C74 167 118 167 131.6 180 L134 201 Z" fill="${JEANS}"/>`;
  k += `<path d="M60.4 180 C74 167 118 167 131.6 180 L131.8 184 C118 171 74 171 60.2 184 Z" fill="#4a6c96"/>`;
  k += `<path d="M61.4 186.4 C75 173.4 117 173.4 130.6 186.4" stroke="#c9a15a" stroke-width=".45" stroke-dasharray="1.1 .7" fill="none"/>`;
  for (let i = 0; i < 34; i++) k += `<path d="M${62 + i * 2.1} 186 l2 15" stroke="#22395a" stroke-width=".35" opacity=".3"/>`;
  k += `<path d="M68 201 C70 192 74 187 80 184 M124 201 C123 192 120 187 114 184" stroke="#5b7ca6" stroke-width="2" opacity=".35" fill="none" ${W1}/>`;
  S.teil({ id: "hosenbein", de: "das Hosenbein", syl: "HO-sen-bein", it: "la gamba dei pantaloni", itSyl: "GAM-ba dei pan-ta-LO-ni", en: "trouser leg", x: 97, y: 186, kunst: A(97, 186, k) });
}

/* =====================================================================
   RECHTS — DER FUSS VON UNTEN
   ===================================================================== */
{
  let k = `<path d="${SOHLE_P}" fill="${SOHLE}"/>`;
  /* feine Hautlinien längs der Sohle, Außenrand etwas dunkler */
  k += `<g clip-path="url(#${S.id("sohleclip")})"><path d="M187 80 C187 112 190 140 197 166" stroke="#c98c6c" stroke-width="5" opacity=".3" fill="none" filter="url(#bw_weich)"/>`;
  k += `<path d="M191 52 Q206 40 224 34 Q242 28 262 34" stroke="#f9d6c2" stroke-width="5" opacity=".6" fill="none" filter="url(#bw_weich)"/></g>`;
  S.teil({ id: "fusssohle", de: "die Fußsohle", syl: "FUß-soh-le", it: "la pianta del piede", itSyl: "PIAN-ta del PIE-de", en: "sole of the foot", x: 214, y: 124, kunst: A(214, 124, k) });
}
{
  const k = `<g clip-path="url(#${S.id("sohleclip")})"><ellipse cx="229" cy="68" rx="38" ry="24" fill="${S.rg("ballen", [[0, "#fbdccb"], [0.55, "#f3c3a8", 0.85], [1, "#efbea2", 0]])}"/></g>`
    + `<path d="M198 88 C210 93 236 94 258 86" stroke="#c48a6e" stroke-width="2" opacity=".12" fill="none" filter="url(#bw_weich)"/>`;
  S.teil({ id: "fussballen", de: "der Fußballen", syl: "FUß-bal-len", it: "l'avampiede", itSyl: "a-vam-PIE-de", en: "ball of the foot", x: 226, y: 78, kunst: A(226, 78, k) });
}
{
  const k = `<g clip-path="url(#${S.id("sohleclip")})"><ellipse cx="252" cy="124" rx="15" ry="30" fill="${S.rg("gewoelbe", [[0, "#fdeadf"], [0.55, "#f6d4c0", 0.8], [1, "#f0c6ad", 0]], 0.62, 0.5, 0.5)}"/></g>`
    + `<path d="M244 102 C239 116 238 132 242 148" stroke="#c98c6c" stroke-width="2.4" opacity=".16" fill="none" ${W1}/>`;
  S.teil({ id: "fussgewoelbe", de: "das Fußgewölbe", syl: "FUß-ge-wöl-be", it: "l'arco plantare", itSyl: "AR-co plan-TA-re", en: "arch of the foot", x: 246, y: 130, kunst: A(246, 130, k),
    tipp: "Das Gewölbe federt jeden Schritt ab. Es berührt beim Stehen den Boden nicht." });
}
{
  const k = `<g clip-path="url(#${S.id("sohleclip")})"><ellipse cx="226" cy="172" rx="28" ry="24" fill="${S.rg("ferse", [[0, "#f8dcc0"], [0.5, "#f0caa8", 0.9], [1, "#ecbf9e", 0]], 0.48, 0.55, 0.5)}"/></g>`
    + `<ellipse cx="222" cy="176" rx="10" ry="7" fill="#fff6e8" opacity=".28" ${W1}/>`;
  S.teil({ id: "ferse", de: "die Ferse", syl: "FER-se", it: "il tallone", itSyl: "tal-LO-ne", en: "heel", x: 224, y: 172, kunst: A(224, 172, k) });
}

S.davor(`<rect width="320" height="200" fill="${S.lg("licht", [[0, "#fff8ee", 0.08], [0.6, "#fff8ee", 0], [1, "#10080a", 0.06]], 0, 0, 1, 0.4)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/fuss_detail.js"));
console.log(aus);
