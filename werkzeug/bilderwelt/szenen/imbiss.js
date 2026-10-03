#!/usr/bin/env node
/* =====================================================================
   DIE DÖNERBUDE (FASSUNG 852) — Bilderwelt neu: ein Imbiss in Deutschland
   ---------------------------------------------------------------------
   RECHERCHE (Gründerratgeber „Dönerladen eröffnen“, Imbiss-Berichte,
   Bilder deutscher Döner-Imbisse; rund 16 000 Dönerbuden in Deutschland):
   - Hinter dem Tresen an der gefliesten Wand: der senkrechte DÖNERSPIESS
     vor dem Gasgrill (glühende Brenner), die FRITTEUSE mit zwei Körben
     Pommes, die GRILLPLATTE für Currywurst und Bratwurst.
   - Auf dem Tresen die SALATVITRINE mit Spuckschutz aus Glas: Salat,
     Tomaten, Zwiebeln, Rotkohl, Gurken, Krautsalat, Peperoni, Schafskäse
     in Edelstahlbehältern; daneben Fladenbrot, Soßenflaschen
     (Knoblauch, scharf), die Kasse; für die Gäste Ketchup und Mayo zum
     Selbstpumpen.
   - Darüber die hinterleuchtete PREISTAFEL mit Bildern und Preisen.
   - Für die Gäste: STEHTISCH mit Serviettenspender, GETRÄNKEKÜHLER mit
     Glastür (Ayran, Cola, Wasser).
   Maßstab: Rückwand ≈ 45 Einheiten je Meter (Wandfuß y = 128),
   Tresen ≈ 58 je Meter, vorn ≈ 62 je Meter. Fluchtpunkt (160 | 90).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "imbiss", titel: "Die Dönerbude", emoji: "🥙", thema: "Essen & Trinken", kuerzel: "b11c", fassung: 852 });
const rnd = zufall(1971);
const r = B.r;
const T = (x, y, s, t, f = "#222", a = "middle", w = "normal", fam = "Arial,Helvetica,sans-serif", extra = "") =>
  `<text x="${r(x)}" y="${r(y)}" font-size="${s}" text-anchor="${a}" fill="${f}" font-family="${fam}" font-weight="${w}"${extra}>${t}</text>`;

/* ---------- Stoffe ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const STAHL_H = S.lg("stahlh", [[0, "#f4f6f7"], [1, "#a9b1b8"]]);
const ROT = S.lg("rot", [[0, "#c8202a"], [1, "#9a1820"]]);
const FLEISCH = S.lg("fleisch", [[0, "#8a4a22"], [0.3, "#b8702f"], [0.55, "#a35a26"], [0.8, "#7a3c18"], [1, "#5a2a10"]], 0, 0, 1, 0);
const BROT = S.rg("brot", [[0, "#f2cf8e"], [0.6, "#dba35b"], [1, "#b47838"]], 0.45, 0.35, 0.8);
const POMMES = S.lg("pommes", [[0, "#ffe08a"], [1, "#e9b44a"]]);
const SAUCE = S.lg("sauce", [[0, "#d2452a"], [1, "#a8301c"]]);

/* =====================================================================
   KULISSE — Decke, Wand (oben warmes Orange, hinter dem Tresen weiße
   Fliesen), Rückbuffet aus Edelstahl, Fliesenboden
   ===================================================================== */
const WU = 128, VP = { x: 160, y: 90 };
S.hinten(`<rect x="0" y="0" width="320" height="12" fill="${S.lg("decke", [[0, "#efece6"], [1, "#dcd7cd"]])}"/><rect x="0" y="11" width="320" height="1.4" fill="#c4bdb0"/>`);
for (const x of [40, 120, 200, 280]) S.hinten(`<rect x="${x - 10}" y="4" width="20" height="2.6" rx="1" fill="#fbfbf3"/>`);
S.hinten(`<rect x="0" y="12" width="320" height="${WU - 12}" fill="${S.lg("wand", [[0, "#f3c27a"], [1, "#e8a85a"]])}"/>`);
/* weiße Fliesen hinter dem Rückbuffet (bis 1,6 m) */
{
  let f = `<rect x="0" y="60" width="238" height="${WU - 60}" fill="#f4f3ef"/>`;
  for (let y = 60; y < WU; y += 5) f += `<line x1="0" y1="${y}" x2="238" y2="${y}" stroke="#d7d4cc" stroke-width=".3"/>`;
  for (let x = 0; x < 238; x += 5) f += `<line x1="${x}" y1="60" x2="${x}" y2="${WU}" stroke="#d7d4cc" stroke-width=".3"/>`;
  f += `<rect x="0" y="59" width="238" height="1.2" fill="#c9c4b8"/>`;
  S.hinten(f);
}
/* rechte Wand (Gastraum): Fliesensockel und gerahmtes Bild vom Bosporus */
S.hinten(`<rect x="238" y="100" width="82" height="${WU - 100}" fill="#c9672e"/><rect x="238" y="99" width="82" height="1.4" fill="#a8521f"/>`);
S.hinten(`<rect x="242" y="40" width="22" height="16" fill="#3a2a1a"/><rect x="243.4" y="41.4" width="19.2" height="13.2" fill="${S.lg("bild", [[0, "#f7b955"], [0.55, "#fde3b0"], [0.56, "#2a7aa8"], [1, "#1d5a82"]])}"/>` +
  `<path d="M245 49 L245 45 L247 45 Q248.5 42.6 250 45 L252 45 L252 49 Z M255 49 L255 46 Q256.5 44 258 46 L258 49 Z" fill="#5a4a3a"/><rect x="246.4" y="42" width=".5" height="3" fill="#5a4a3a"/>`);
/* Rückbuffet: Edelstahl, Oberkante y = 100 */
S.hinten(`<rect x="0" y="100" width="238" height="${WU - 100}" fill="${S.lg("buffet", [[0, "#d5dadd"], [1, "#a9b1b8"]])}"/><rect x="0" y="99" width="238" height="2" fill="#eef1f3"/>`);
for (let x = 10; x < 238; x += 30) S.hinten(`<rect x="${x}" y="104" width="26" height="22" rx=".6" fill="none" stroke="#8d969e" stroke-width=".4"/><rect x="${x + 10}" y="106" width="6" height=".9" rx=".4" fill="#7d868d"/>`);
/* Fliesenboden (rotbraun, Fluchtperspektive) */
{
  let f = `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("boden", [[0, "#9a5a3a"], [1, "#b8714a"]])}"/>`;
  for (let i = -12; i <= 12; i++) { const xw = VP.x + i * 16; f += `<line x1="${xw}" y1="${WU}" x2="${r(VP.x + (xw - VP.x) * (200 - VP.y) / (WU - VP.y))}" y2="200" stroke="#7a4028" stroke-width=".45"/>`; }
  for (const y of [131.5, 136, 141.5, 148.5, 157.5, 169.5, 185, 200]) f += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#7a4028" stroke-width=".45"/>`;
  f += `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("bodenlicht", [[0, "#000", 0.2], [0.4, "#000", 0], [1, "#fff", 0.07]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DIE PREISTAFEL (hinterleuchtet, mit Bildern und Preisen)
   ===================================================================== */
{
  const W = 170, H = 42;
  let k = `<rect x="${-W / 2 - 1.2}" y="${-H - 9}" width="${W + 2.4}" height="${H + 10}" rx="1" fill="#1b1b1d"/>`;
  k += `<rect x="${-W / 2}" y="${-H - 8}" width="${W}" height="8" fill="${ROT}"/>` + T(0, -H - 2, 6, "BOSPORUS GRILL", "#ffd34d", "middle", "bold", "'Arial Black',Arial,sans-serif", ' letter-spacing=".8"');
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${S.lg("tafel", [[0, "#2a2a2e"], [1, "#151517"]])}"/>`;
  const bild = {
    doener: (x, y) => `<path d="M${x - 9} ${y + 6} L${x} ${y - 6} L${x + 9} ${y + 6} Z" fill="${BROT}"/><path d="M${x - 6} ${y + 4} L${x} ${y - 3} L${x + 6} ${y + 4} Z" fill="#a35a26"/><path d="M${x - 5} ${y + 2} q2 -2 4 0 q2 -2 4 0" stroke="#5aa83a" stroke-width="1.2" fill="none"/><circle cx="${x + 2}" cy="${y + 3}" r="1" fill="#d8352a"/><path d="M${x - 4} ${y + 4} h8" stroke="#fff" stroke-width=".9"/>`,
    dueruem: (x, y) => `<rect x="${x - 10}" y="${y - 3}" width="20" height="7" rx="3.4" fill="${BROT}" transform="rotate(-12 ${x} ${y})"/><path d="M${x + 6} ${y - 4} l4 -1 l1 4 l-4 1 Z" fill="#a35a26"/><path d="M${x + 7} ${y - 4} l2 -2" stroke="#5aa83a" stroke-width="1.2"/><rect x="${x - 10}" y="${y - 3}" width="9" height="7" rx="1" fill="#f4f4f0" transform="rotate(-12 ${x} ${y})"/>`,
    teller: (x, y) => `<ellipse cx="${x}" cy="${y + 2}" rx="11" ry="4.4" fill="#f4f4f0"/><ellipse cx="${x - 3}" cy="${y + 1}" rx="5" ry="2.4" fill="#a35a26"/><ellipse cx="${x + 4}" cy="${y + 1.4}" rx="4" ry="2" fill="#f2f0e8"/><path d="M${x + 1} ${y - .4} h6" stroke="#5aa83a" stroke-width="1.3"/><circle cx="${x + 6}" cy="${y + 2.4}" r="1" fill="#d8352a"/>`,
    lahmacun: (x, y) => `<ellipse cx="${x}" cy="${y + 1}" rx="10" ry="5" fill="#e3a65a"/><ellipse cx="${x}" cy="${y + 1}" rx="8.4" ry="4" fill="#c2452a"/>${[[-4, 0], [2, -1], [4, 2], [-1, 2.4]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + 1 + b}" r=".8" fill="#5aa83a"/>`).join("")}<path d="M${x - 2} ${y - 2} l3 -3" stroke="#e8e8a0" stroke-width="1"/>`,
    currywurst: (x, y) => `<path d="M${x - 9} ${y - 2} L${x + 9} ${y - 2} L${x + 7} ${y + 5} L${x - 7} ${y + 5} Z" fill="#f4f4f0"/>${[-5, -1.6, 1.8, 5.2].map((a) => `<ellipse cx="${x + a}" cy="${y}" rx="1.8" ry="1.3" fill="#b8642a"/>`).join("")}<path d="M${x - 7} ${y - 1} q7 2 14 0 q-7 3 -14 0 Z" fill="${SAUCE}"/>${[-4, 0, 4].map((a) => `<circle cx="${x + a}" cy="${y - .4}" r=".4" fill="#e8b84a"/>`).join("")}`,
    pommes: (x, y) => `<path d="M${x - 6} ${y - 1} L${x + 6} ${y - 1} L${x + 4} ${y + 6} L${x - 4} ${y + 6} Z" fill="#d8352a"/>${[-4, -2.4, -1, 0.6, 2, 3.6].map((a, i) => `<rect x="${x + a}" y="${y - 6 + (i % 2)}" width="1.2" height="7" fill="${POMMES}" transform="rotate(${-8 + i * 3} ${x} ${y})"/>`).join("")}<path d="M${x - 6} ${y - 1} L${x + 6} ${y - 1} L${x + 5.6} ${y + 1} L${x - 5.6} ${y + 1} Z" fill="#fff" opacity=".85"/>`,
  };
  const karte = [["doener", "Döner", "6,50 €"], ["dueruem", "Dürüm", "7,50 €"], ["teller", "Dönerteller", "9,90 €"], ["lahmacun", "Lahmacun", "5,00 €"], ["currywurst", "Currywurst", "4,50 €"], ["pommes", "Pommes", "3,00 €"]];
  karte.forEach(([b, name, preis], i) => {
    const s = i % 3, z = Math.floor(i / 3), x = -W / 2 + 4 + s * 54.4, y = -H + 2 + z * 20;
    k += `<rect x="${r(x)}" y="${y}" width="51" height="18.4" rx="1" fill="${S.lg("kachel", [[0, "#3a3a3e"], [1, "#2a2a2e"]])}"/>`;
    k += `<rect x="${r(x + 1)}" y="${y + 1}" width="24" height="16.4" rx=".8" fill="${S.rg("licht", [[0, "#fff6dc"], [1, "#e9d4a6"]])}"/>`;
    k += bild[b](r(x + 13), y + 9);
    k += T(x + 38, y + 7.6, 3.6, name, "#fff", "middle", "bold") + T(x + 38, y + 14.2, 4.4, preis, "#ffd34d", "middle", "bold");
  });
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${S.lg("tafelglanz", [[0, "#fff", 0.08], [0.5, "#fff", 0], [1, "#fff", 0.03]])}"/>`;
  S.teil({ id: "im_preisschild_im", de: "die Preistafel", syl: "PREIS-ta-fel", it: "il listino prezzi", itSyl: "li-STI-no PREZ-zi", en: "price board", x: 151, y: 57, kunst: k,
    tipp: "Auf der Preistafel stehen alle Gerichte mit Bild und Preis." });
}

/* =====================================================================
   2 — DER DÖNERSPIESS vor dem senkrechten Gasgrill
   ===================================================================== */
{
  let k = schatten(0, 0, 18, 1.4, .3);
  /* Grillwand mit Brennern */
  k += `<rect x="-16" y="-70" width="32" height="62" rx="1.4" fill="${STAHL}"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="-13" y="${-66 + i * 13.4}" width="26" height="10.6" rx=".8" fill="${S.lg("brenner", [[0, "#ff9a3a"], [0.5, "#ffcf6a"], [1, "#e0561f"]])}"/><rect x="-13" y="${-66 + i * 13.4}" width="26" height="10.6" rx=".8" fill="none" stroke="#7a3a12" stroke-width=".3"/>`;
  k += `<rect x="-16" y="-70" width="32" height="62" fill="${S.rg("glut", [[0, "#ffb347", 0.25], [1, "#ffb347", 0]])}"/>`;
  /* Spieß: Kegel aus Fleisch, oben breit, unten schmal */
  k += `<rect x="-.7" y="-76" width="1.4" height="8" fill="#9aa3aa"/><ellipse cx="0" cy="-76" rx="2.4" ry=".9" fill="#7d868d"/>`;
  k += `<path d="M-12 -66 Q0 -69 12 -66 L8.4 -15 Q0 -13.4 -8.4 -15 Z" fill="${FLEISCH}"/>`;
  for (let i = 0; i < 16; i++) { const y = -64 + i * 3.1, w = 12 - (i / 16) * 3.6; k += `<path d="M${r(-w)} ${r(y)} Q0 ${r(y + 1.2)} ${r(w)} ${r(y)}" stroke="${i % 2 ? "#5a2a10" : "#c8843e"}" stroke-width=".45" fill="none" opacity=".75"/>`; }
  for (let i = 0; i < 22; i++) { const y = -62 + rnd() * 44, w = 11 - ((y + 66) / 52) * 3.4; k += `<ellipse cx="${r(-w * 0.8 + rnd() * w * 1.6)}" cy="${r(y)}" rx="${r(0.8 + rnd() * 1.2)}" ry=".5" fill="${rnd() < 0.5 ? "#4a200a" : "#d89a52"}" opacity=".8"/>`; }
  k += `<path d="M-9 -64 Q-6 -40 -7 -17" stroke="#fff" stroke-width=".8" opacity=".18" fill="none"/>`;
  /* Auffangschale und Unterteil */
  k += `<ellipse cx="0" cy="-14" rx="11" ry="2" fill="#7d868d"/><rect x="-16" y="-12" width="32" height="12" rx="1" fill="${STAHL}"/>`;
  for (const x of [-10, 10]) k += `<circle cx="${x}" cy="-6" r="1.8" fill="#2b2f33"/><rect x="${x - 0.3}" y="-7.6" width=".6" height="1.6" fill="#ddd"/>`;
  k += `<rect x="-3" y="-8" width="6" height="4" rx=".6" fill="#2b2f33"/><circle cx="1.6" cy="-6" r=".6" fill="#ff5a3a"/>`;
  S.teil({ id: "im_doenerspiess", de: "der Dönerspieß", syl: "DÖ-ner-spieß", it: "lo spiedo del kebab", itSyl: "SPIE-do del ke-BAB", en: "kebab spit", x: 30, y: 100, steht: true, kunst: k,
    tipp: "Der Spieß dreht sich vor dem Grill. Das Fleisch wird außen in dünnen Scheiben abgeschnitten." });
}

/* =====================================================================
   3 — DIE FRITTEUSE (zwei Körbe Pommes) und 4 — DIE GRILLPLATTE
   ===================================================================== */
{
  let k = schatten(0, 0, 13, 1.2, .3);
  k += `<rect x="-12" y="-20" width="24" height="20" rx="1" fill="${STAHL}"/><rect x="-12" y="-21" width="24" height="2" fill="#eef1f3"/>`;
  k += `<rect x="-10.6" y="-23" width="21.2" height="3" fill="#c49a2a" opacity=".75"/>`;
  for (const sx of [-5.4, 5.4]) {
    k += `<path d="M${sx - 4.6} -27 L${sx + 4.6} -27 L${sx + 4.2} -21 L${sx - 4.2} -21 Z" fill="#6b7178" opacity=".55"/>`;
    for (let i = 0; i < 7; i++) k += `<rect x="${r(sx - 4 + i * 1.2)}" y="${r(-30 + (i % 3) * 0.8)}" width=".9" height="7" fill="${POMMES}" transform="rotate(${-10 + i * 3} ${sx} -24)"/>`;
    k += `<path d="M${sx - 4.6} -27 L${sx + 4.6} -27 L${sx + 4.2} -21 L${sx - 4.2} -21 Z" fill="none" stroke="#5c646b" stroke-width=".4"/>`;
    for (let i = 1; i < 4; i++) k += `<line x1="${r(sx - 4.6 + i * 2.3)}" y1="-27" x2="${r(sx - 4.2 + i * 2.1)}" y2="-21" stroke="#5c646b" stroke-width=".25"/>`;
    k += `<path d="M${sx} -24 L${sx} -30 L${sx + 0.6} -32" stroke="#2b2f33" stroke-width=".9" fill="none"/>`;
  }
  for (const x of [-6, 6]) k += `<circle cx="${x}" cy="-10" r="2" fill="#2b2f33"/><rect x="${x - 0.3}" y="-11.8" width=".6" height="1.8" fill="#ddd"/>`;
  k += `<rect x="-10" y="-5" width="20" height="2" rx=".5" fill="#8d969e"/>`;
  S.teil({ id: "im_fritteuse", de: "die Fritteuse", syl: "frit-TEU-se", it: "la friggitrice", itSyl: "frig-gi-TRI-ce", en: "deep fryer", x: 172, y: 100, steht: true, kunst: k,
    tipp: "In der Fritteuse werden die Pommes in heißem Öl goldbraun." });
}
{
  let k = schatten(0, 0, 18, 1.2, .3);
  k += `<rect x="-17" y="-17" width="34" height="6" fill="#8d969e"/><rect x="-17" y="-17" width="34" height="1" fill="#c9cfd4"/>`;
  k += `<path d="M-17 -11 L17 -11 L18 -7 L-18 -7 Z" fill="${S.lg("platte", [[0, "#3a3d40"], [1, "#55595d"]])}"/>`;
  /* Bratwürste / Currywurst und zwei Frikadellen */
  for (const [x, y, a] of [[-12, -9.6, -4], [-5, -9.4, 3], [2, -9.8, -2]]) k += `<rect x="${x - 3.6}" y="${y - 1}" width="7.2" height="2" rx="1" fill="${S.lg("wurst", [[0, "#c47a3a"], [1, "#8a4a1e"]])}" transform="rotate(${a} ${x} ${y})"/><path d="M${x - 2} ${y - .6} l1 1 m1 -1 l1 1" stroke="#5a2a10" stroke-width=".3" transform="rotate(${a} ${x} ${y})"/>`;
  for (const x of [9, 14]) k += `<ellipse cx="${x}" cy="-9" rx="2.4" ry="1.2" fill="#6e3a1a"/>`;
  k += `<rect x="-18" y="-7" width="36" height="7" fill="${STAHL}"/>`;
  for (const x of [-11, 0, 11]) k += `<circle cx="${x}" cy="-3.4" r="1.6" fill="#2b2f33"/>`;
  k += `<path d="M-14 -12 q1 -3 0 -5 M8 -12 q1 -3 -.4 -5" stroke="#fff" stroke-width=".5" opacity=".45" fill="none"/>`;
  S.teil({ id: "im_grillplatte", de: "die Grillplatte", syl: "GRILL-plat-te", it: "la piastra", itSyl: "PIA-stra", en: "griddle", x: 210, y: 100, steht: true, kunst: k,
    tipp: "Auf der Grillplatte brät die Wurst für die Currywurst." });
}
{
  /* DIE GRILLZANGE — liegt am Rand der Grillplatte */
  let k = `<path d="M-9 -1 L7 -2.6 L8 -1.8 L-8.6 0 Z" fill="${STAHL}"/><path d="M-9 -1 L7 -.8 L8 0 L-8.6 .4 Z" fill="#9aa3aa"/>`;
  k += `<rect x="-10.4" y="-1.4" width="4" height="2.2" rx=".8" fill="#2b2f33"/><path d="M7 -2.6 q2 .2 2 1.6 M7 -.8 q2 .2 1.6 1" stroke="#7d868d" stroke-width=".5" fill="none"/>`;
  S.teil({ oben: true, id: "im_grillzange", de: "die Grillzange", syl: "GRILL-zan-ge", it: "la pinza da grill", itSyl: "PIN-za da GRILL", en: "tongs", x: 218, y: 92.6, kunst: k + flaeche(-11, -4, 21, 5.6) });
}

/* =====================================================================
   5 — DER GETRÄNKEKÜHLER (Glastür, Gastraum hinten rechts)
   ===================================================================== */
{
  const W = 46, H = 88;
  let k = schatten(0, 0, 26, 2, .3);
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" rx="1.6" fill="${S.lg("kuehl", [[0, "#d23a30"], [1, "#a8261e"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="10" rx="1.6" fill="#b52a22"/>` + T(0, -H + 7, 5.2, "Getränke", "#fff", "middle", "bold", "'Trebuchet MS',Arial,sans-serif");
  k += `<rect x="${-W / 2 + 3}" y="${-H + 12}" width="${W - 6}" height="${H - 20}" rx="1" fill="${S.lg("innen", [[0, "#f4fbff"], [1, "#cfe2ea"]])}"/>`;
  const fach = 5, fh = (H - 22) / fach;
  for (let i = 0; i < fach; i++) {
    const yb = -H + 13 + (i + 1) * fh;
    k += `<rect x="${-W / 2 + 3}" y="${r(yb - 0.6)}" width="${W - 6}" height="1" fill="#9fb2bb"/>`;
    const arten = [["#3a1a10", "#c8202a", 4.2], ["#f08a24", "#f08a24", 4.2], ["#bfe3f3", "#2f7fc4", 3.6], ["#7ac142", "#2f8a3a", 3.6], ["#fbfbf7", "#2f63c4", 3]];
    const [fl, kap, b] = arten[i];
    for (let j = 0; j < 8; j++) {
      const x = -W / 2 + 5 + j * 4.9;
      if (i === 4) k += `<rect x="${r(x)}" y="${r(yb - 7)}" width="4" height="6.4" rx=".6" fill="${fl}" stroke="#cfd6da" stroke-width=".2"/><rect x="${r(x)}" y="${r(yb - 7.4)}" width="4" height="1" fill="${kap}"/>` + (j % 2 ? "" : T(x + 2, yb - 3, 1.1, "Ayran", "#2f63c4", "middle", "bold"));
      else k += `<path d="M${r(x + 0.6)} ${r(yb - 1)} L${r(x + 0.6)} ${r(yb - 7.6)} Q${r(x + 0.6)} ${r(yb - 9.4)} ${r(x + 1.6)} ${r(yb - 10)} L${r(x + 1.6)} ${r(yb - 11.4)} L${r(x + 2.6)} ${r(yb - 11.4)} L${r(x + 2.6)} ${r(yb - 10)} Q${r(x + 3.6)} ${r(yb - 9.4)} ${r(x + 3.6)} ${r(yb - 7.6)} L${r(x + 3.6)} ${r(yb - 1)} Z" fill="${fl}"/><rect x="${r(x + 1.5)}" y="${r(yb - 12)}" width="1.2" height=".8" fill="${kap}"/><rect x="${r(x + 0.6)}" y="${r(yb - 6)}" width="3" height="2" fill="${kap}" opacity=".85"/>`;
    }
  }
  k += `<rect x="${-W / 2 + 3}" y="${-H + 12}" width="${W - 6}" height="${H - 20}" rx="1" fill="${S.lg("tuerglas", [[0, "#fff", 0.28], [0.4, "#fff", 0.04], [1, "#fff", 0.16]], 0, 0, 1, 1)}"/>`;
  k += `<rect x="${W / 2 - 6}" y="${-H + 30}" width="1.6" height="24" rx=".8" fill="#e9ecef"/>`;
  k += `<rect x="${-W / 2}" y="-8" width="${W}" height="8" fill="#7a1a14"/>`;
  for (let x = -W / 2 + 3; x < W / 2 - 2; x += 2.4) k += `<rect x="${r(x)}" y="-6" width="1.2" height="4" fill="#4a0e0a"/>`;
  S.teil({ id: "im_getraenkekuehler", de: "der Getränkekühler", syl: "Ge-TRÄN-ke-küh-ler", it: "il frigo bibite", itSyl: "FRI-go BI-bi-te", en: "drinks fridge", x: 293, y: WU + 1, steht: true, kunst: k,
    tipp: "Im Getränkekühler gibt es Ayran, Cola, Limo und Wasser." });
}

/* =====================================================================
   6 — DER VERKÄUFER (hinter der Salatvitrine)
   ===================================================================== */
{
  const m = B.mensch({ id: "im_verk", geschlecht: "m", pose: "halten", blick: 22, frisur: "kurz", haarfarbe: "schwarz", haut: "oliv", bart: true, laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "schwarz" }, schuerze: { stueck: "schuerze", farbe: "weiss" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, kopf: { stueck: "kappe", farbe: "#c8202a" } } }, 94);
  S.teil({ id: "im_verkaeufer", de: "der Verkäufer", syl: "Ver-KÄU-fer", it: "il venditore", itSyl: "ven-di-TO-re", en: "shop assistant", x: 100, y: 170, kunst: m.svg,
    tipp: "Der Verkäufer fragt: „Mit allem? Scharf?“" });
}

/* =====================================================================
   7 — DER TRESEN (Edelstahlplatte, rote Front mit Schriftzug)
   ===================================================================== */
const TR = { x0: 4, x1: 236, oben: 119, kante: 125, fuss: 180 };
{
  const W = TR.x1 - TR.x0, H = TR.fuss - TR.kante, cx = (TR.x0 + TR.x1) / 2;
  let k = schatten(0, 0, W / 2 + 3, 2, .3);
  k += `<path d="M${-W / 2 + 2} ${TR.oben - TR.fuss} L${W / 2 - 2} ${TR.oben - TR.fuss} L${W / 2 + 1} ${-H} L${-W / 2 - 1} ${-H} Z" fill="${STAHL_H}"/>`;
  k += `<rect x="${-W / 2 - 1}" y="${-H}" width="${W + 2}" height="3" fill="${STAHL}"/>`;
  k += `<rect x="${-W / 2}" y="${-H + 3}" width="${W}" height="${H - 3}" fill="${ROT}"/>`;
  /* Fliesenspiegel in der Front, oben ein Fotoband */
  for (let y = -H + 21; y < -5; y += 6) k += `<line x1="${-W / 2}" y1="${y}" x2="${W / 2}" y2="${y}" stroke="#7a141a" stroke-width=".35"/>`;
  for (let x = -W / 2 + 6; x < W / 2; x += 6) k += `<line x1="${x}" y1="${-H + 21}" x2="${x}" y2="-5" stroke="#7a141a" stroke-width=".35"/>`;
  k += `<rect x="${-W / 2}" y="${-H + 3}" width="${W}" height="16" fill="#1b1b1d"/>`;
  k += T(0, -H + 14.4, 7.6, "DÖNER · DÜRÜM · CURRYWURST · POMMES", "#ffd34d", "middle", "bold", "'Arial Black',Arial,sans-serif", ' letter-spacing=".4"');
  k += `<rect x="${-W / 2}" y="-5" width="${W}" height="5" fill="#2a2a2c"/>`;
  k += `<rect x="${-W / 2}" y="${-H + 3}" width="${W}" height="${H - 8}" fill="${S.lg("frontglanz", [[0, "#fff", 0.1], [0.3, "#fff", 0], [1, "#000", 0.18]])}"/>`;
  S.teil({ id: "im_tresen", de: "der Tresen", syl: "TRE-sen", it: "il bancone", itSyl: "ban-CO-ne", en: "counter", x: cx, y: TR.fuss, steht: true, kunst: k });
}

/* =====================================================================
   8 — DIE SALATVITRINE (Spuckschutz aus Glas) — Lupe: die Zutaten
   ===================================================================== */
{
  const VX = 100, VY = 125, W = 104;
  let k = "";
  /* Edelstahlwanne, Vorderkante, Behälter mit Inhalt (schräg von oben) */
  k += `<path d="M${-W / 2 + 3} -17 L${W / 2 - 3} -17 L${W / 2} -7 L${-W / 2} -7 Z" fill="#8d969e"/>`;
  k += `<rect x="${-W / 2}" y="-7" width="${W}" height="7" fill="${STAHL}"/><rect x="${-W / 2}" y="-7" width="${W}" height=".8" fill="#fff" opacity=".7"/>`;
  const zut = [
    ["im_salat", "der Salat", "SA-lat", "l'insalata", "in-sa-LA-ta", "lettuce", "#9fd36a", "salat"],
    ["im_tomate", "die Tomate", "to-MA-te", "il pomodoro", "po-mo-DO-ro", "tomato", "#d8352a", "tomate"],
    ["im_zwiebel", "die Zwiebel", "ZWIE-bel", "la cipolla", "ci-POL-la", "onion", "#f2eadf", "zwiebel"],
    ["im_rotkohl", "der Rotkohl", "ROT-kohl", "il cavolo rosso", "CA-vo-lo ROS-so", "red cabbage", "#7a2f6e", "kohl"],
    ["im_gurke", "die Gurke", "GUR-ke", "il cetriolo", "ce-tri-O-lo", "cucumber", "#cfe6a0", "gurke"],
    ["im_krautsalat", "der Krautsalat", "KRAUT-sa-lat", "l'insalata di cavolo", "in-sa-LA-ta di CA-vo-lo", "coleslaw", "#efe9c6", "kraut"],
    ["im_peperoni", "die Peperoni", "pe-pe-RO-ni", "i peperoncini", "pe-pe-ron-CI-ni", "chilli peppers", "#b5c23a", "peperoni"],
    ["im_schafskaese", "der Schafskäse", "SCHAFS-kä-se", "la feta", "FE-ta", "feta cheese", "#fbfaf2", "kaese"],
  ];
  const unter = [];
  const cw = (W - 6) / zut.length;
  zut.forEach(([id, de, syl, it, itSyl, en, farbe, art], i) => {
    const xb = -W / 2 + 3 + i * cw, xf = -W / 2 + i * (W / zut.length);
    /* Behälter als Viereck zwischen Hinter- und Vorderkante */
    const p = `M${r(xb + 0.4)} -16.4 L${r(xb + cw - 0.4)} -16.4 L${r(xf + W / zut.length - 0.4)} -7.6 L${r(xf + 0.4)} -7.6 Z`;
    k += `<path d="${p}" fill="${farbe}"/>`;
    const mx = (xb + xf) / 2 + cw / 2, my = -12;
    let g = "";
    for (let j = 0; j < 9; j++) {
      const x = mx - 4 + rnd() * 8, y = my - 3 + rnd() * 6.4;
      if (art === "salat") g += `<path d="M${r(x)} ${r(y)} q1.2 -1 2.4 .2" stroke="${j % 2 ? "#6fb43a" : "#c9ea8a"}" stroke-width=".7" fill="none"/>`;
      else if (art === "tomate") g += `<circle cx="${r(x)}" cy="${r(y)}" r="1.4" fill="#c8202a" stroke="#f26b5a" stroke-width=".3"/><circle cx="${r(x)}" cy="${r(y)}" r=".5" fill="#f2b84a"/>`;
      else if (art === "zwiebel") g += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="1.6" ry="1" fill="none" stroke="${j % 3 ? "#e9dce0" : "#b5527a"}" stroke-width=".4"/>`;
      else if (art === "kohl") g += `<path d="M${r(x)} ${r(y)} q1.4 -.6 2.6 .4" stroke="${j % 2 ? "#5a1f52" : "#a0559a"}" stroke-width=".6" fill="none"/>`;
      else if (art === "gurke") g += `<circle cx="${r(x)}" cy="${r(y)}" r="1.3" fill="#e6f2c4" stroke="#3a7a2a" stroke-width=".4"/>`;
      else if (art === "kraut") g += `<path d="M${r(x)} ${r(y)} q1.2 -.8 2.6 0" stroke="${j % 2 ? "#d9cf8f" : "#fffbe6"}" stroke-width=".6" fill="none"/>`;
      else if (art === "peperoni") g += `<path d="M${r(x)} ${r(y)} q1.6 -.4 3 .8 q-1.6 .6 -3 -.8 Z" fill="${j % 2 ? "#9fb02a" : "#c9d24a"}"/>`;
      else g += `<rect x="${r(x)}" y="${r(y)}" width="1.6" height="1.4" fill="#fffef6" stroke="#d6d2c0" stroke-width=".2"/>`;
    }
    k += g;
    k += `<path d="${p}" fill="none" stroke="#6b7178" stroke-width=".35"/>`;
    unter.push({ id, de, syl, it, itSyl, en, x: VX + mx, y: VY - 6, kunst: flaeche(-cw / 2 - 0.4, -11, cw + 0.8, 11.6) });
  });
  /* Spuckschutz: gebogene Glasscheibe auf zwei Haltern */
  for (const x of [-W / 2 + 1, W / 2 - 1]) k += `<rect x="${x - 0.8}" y="-36" width="1.6" height="29" fill="${STAHL}"/>`;
  k += `<path d="M${-W / 2} -8 Q${-W / 2} -30 ${-W / 2 + 10} -34 L${W / 2 - 10} -34 Q${W / 2} -30 ${W / 2} -8" fill="#e8f3f6" opacity=".18" stroke="#b9cbd1" stroke-width=".6"/>`;
  k += `<rect x="${-W / 2 + 6}" y="-36.4" width="${W - 12}" height="2.4" rx="1" fill="#dfe6ea" opacity=".8"/>`;
  S.teil({ id: "im_salatvitrine", de: "die Salatvitrine", syl: "Sa-LAT-vi-tri-ne", it: "la vetrina delle insalate", itSyl: "ve-TRI-na del-le in-sa-LA-te", en: "salad display", x: VX, y: VY, steht: true, kunst: k,
    zoom: { x: VX - W / 2 - 4, y: VY - 40, w: W + 8, h: 74 }, unter,
    tipp: "Aus der Salatvitrine kommt das Gemüse in den Döner." });
  S.davor(`<path d="M${VX - W / 2 + 6} ${VY - 9} L${VX - W / 2 + 16} ${VY - 33} L${VX - W / 2 + 22} ${VY - 33} L${VX - W / 2 + 12} ${VY - 9} Z" fill="#fff" opacity=".2"/><path d="M${VX + 20} ${VY - 9} L${VX + 28} ${VY - 33} L${VX + 31} ${VY - 33} L${VX + 23} ${VY - 9} Z" fill="#fff" opacity=".14"/>`);
}

/* =====================================================================
   9 — AUF DEM TRESEN: Soße, Fladenbrot, Döner, Kasse, Soßenspender
   ===================================================================== */
const PL = 123;
{
  /* DIE SOSSE — zwei Quetschflaschen: Knoblauch (weiß) und scharf (rot) */
  let k = schatten(0, .2, 7, .7, .3);
  for (const [x, f, t] of [[-3.2, "#f7f4ea", "Knobi"], [3.2, "#c8302a", "scharf"]]) {
    k += `<path d="M${x - 2.6} 0 L${x - 2.6} -9 Q${x - 2.6} -11 ${x} -11.4 Q${x + 2.6} -11 ${x + 2.6} -9 L${x + 2.6} 0 Z" fill="${f}" stroke="#bdb6a6" stroke-width=".2"/>`;
    k += `<path d="M${x - 0.8} -11.4 L${x + 0.8} -11.4 L${x + 0.3} -14.6 L${x - 0.3} -14.6 Z" fill="${f === "#f7f4ea" ? "#e8e2d2" : "#a8241e"}"/>`;
    k += `<rect x="${x - 2.6}" y="-7" width="5.2" height="3" fill="#fff" opacity=".85"/>` + T(x, -4.9, 1.3, t, "#5a2a10", "middle", "bold");
    k += `<path d="M${x - 1.8} -10 L${x - 1.8} -1" stroke="#fff" stroke-width=".5" opacity=".5"/>`;
  }
  S.teil({ oben: true, id: "im_soesse", de: "die Soße", syl: "SO-ße", it: "la salsa", itSyl: "SAL-sa", en: "sauce", x: 162, y: PL, steht: true, kunst: k,
    tipp: "Kräutersoße, Knoblauchsoße oder scharf — „Mit allem?“" });
}
{
  /* DAS FLADENBROT — Stapel runder Fladenbrote mit Sesam */
  let k = schatten(0, .2, 9, .8, .3);
  for (let i = 0; i < 4; i++) {
    const y = -1.6 - i * 2.4;
    k += `<ellipse cx="${r((i % 2) * 0.6)}" cy="${r(y)}" rx="8.6" ry="2.2" fill="${BROT}" stroke="#a8692a" stroke-width=".25"/>`;
  }
  k += `<ellipse cx=".6" cy="-9.6" rx="8" ry="2" fill="#e9b468"/>`;
  for (let i = 0; i < 16; i++) k += `<ellipse cx="${r(-6 + rnd() * 13)}" cy="${r(-10.6 + rnd() * 2)}" rx=".35" ry=".2" fill="#fff6dc"/>`;
  for (let i = 0; i < 3; i++) k += `<path d="M${-4 + i * 4} -10.2 l1.6 .8" stroke="#b8803a" stroke-width=".3"/>`;
  S.teil({ oben: true, id: "im_fladenbrot", de: "das Fladenbrot", syl: "FLA-den-brot", it: "il pane pita", itSyl: "PA-ne PI-ta", en: "flatbread", x: 180, y: PL, steht: true, kunst: k });
}
{
  /* DER DÖNER — fertig, halb in Papier eingewickelt */
  let k = schatten(0, .2, 6, .7, .3);
  k += `<path d="M-6 0 L6 0 L5 -9 L-5 -9 Z" fill="#f6f2e6" stroke="#cfc6b3" stroke-width=".25"/>`;
  k += `<path d="M-5.6 -8 Q-6.6 -17 0 -18 Q6.6 -17 5.6 -8 Z" fill="${BROT}"/>`;
  k += `<path d="M-4.4 -9 Q-4.8 -15 0 -15.8 Q4.8 -15 4.4 -9 Z" fill="#a35a26"/>`;
  k += `<path d="M-4.2 -14 q1.4 -1.6 2.8 0 q1.4 -1.6 2.8 0 q1.2 -1.4 2.4 0" stroke="#7ac142" stroke-width="1.1" fill="none"/>`;
  k += `<circle cx="-2" cy="-11.6" r="1" fill="#d8352a"/><circle cx="2.2" cy="-12" r="1" fill="#d8352a"/><path d="M-3 -10 h6" stroke="#fbfaf2" stroke-width=".9"/><path d="M-1 -12.6 l2 0" stroke="#a0559a" stroke-width=".7"/>`;
  k += `<path d="M-6 -9 L6 -9 L5.4 -7.6 L-5.4 -7.6 Z" fill="#e9e1cc"/>` + T(0, -3.4, 1.5, "Bosporus", "#c8202a", "middle", "bold");
  S.teil({ oben: true, id: "im_doener", de: "der Döner", syl: "DÖ-ner", it: "il kebab", itSyl: "ke-BAB", en: "doner kebab", x: 196, y: PL, steht: true, kunst: k,
    tipp: "Der Döner kommt im Fladenbrot — mit Fleisch, Salat und Soße." });
}
{
  /* DIE KASSE */
  let k = schatten(0, .3, 8, 1, .3) + `<rect x="-7" y="-4" width="14" height="4" rx=".6" fill="#2b2f33"/>`;
  k += `<path d="M-6 -4 L6 -4 L7 -14 L-7 -14 Z" fill="#1d2125"/><path d="M-5.2 -5 L5.2 -5 L6 -13 L-6 -13 Z" fill="${S.lg("kbild", [[0, "#2c4e6b"], [1, "#1b3247"]])}"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${r(-5 + (i % 3) * 3.6)}" y="${r(-12.2 + Math.floor(i / 3) * 3.4)}" width="3" height="2.8" rx=".3" fill="${["#c8202a", "#f08a24", "#e8c547", "#7ac142", "#2f7fc4", "#8e5bb5"][i]}"/>`;
  S.teil({ oben: true, id: "im_kasse", de: "die Kasse", syl: "KAS-se", it: "la cassa", itSyl: "CAS-sa", en: "cash register", x: 213, y: PL, steht: true, kunst: k });
}
{
  /* DER SOSSENSPENDER — Ketchup und Mayo zum Pumpen */
  let k = schatten(0, .2, 7, .7, .3) + `<rect x="-7" y="-1.4" width="14" height="1.4" rx=".4" fill="#8d969e"/>`;
  for (const [x, f, t] of [[-3.4, "#c8202a", "Ketchup"], [3.4, "#f3e7b4", "Mayo"]]) {
    k += `<rect x="${x - 2.8}" y="-11" width="5.6" height="9.6" rx="1" fill="${f}"/><rect x="${x - 2.8}" y="-7.6" width="5.6" height="2.6" fill="#fff" opacity=".9"/>` + T(x, -5.7, 1.1, t, "#3a2a18", "middle", "bold");
    k += `<rect x="${x - 0.4}" y="-14" width=".8" height="3" fill="#2b2f33"/><rect x="${x - 2}" y="-15" width="4.4" height="1.2" rx=".5" fill="#2b2f33"/><path d="M${x + 2} -14.4 l1.4 .4" stroke="#2b2f33" stroke-width=".7"/>`;
  }
  S.teil({ oben: true, id: "im_soessenspender", de: "der Soßenspender", syl: "SO-ßen-spen-der", it: "il dispenser di salse", itSyl: "di-SPEN-ser di SAL-se", en: "sauce dispenser", x: 229, y: PL, steht: true, kunst: k + flaeche(-7, -15.6, 14, 16),
    tipp: "Ketchup und Mayo pumpt man sich selbst auf die Pommes." });
}

/* =====================================================================
   10 — DER STEHTISCH (vorn links) mit Currywurst, Pommes, Servietten
   ===================================================================== */
const ST = { x: 36, y: 197, top: 129 };
{
  let k = schatten(0, 0, 16, 2, .35) + `<ellipse cx="0" cy="-1" rx="12" ry="2.6" fill="${S.lg("fuss", [[0, "#4a4f55"], [1, "#2b2f33"]])}"/>`;
  k += `<rect x="-1.6" y="${ST.top - ST.y + 3}" width="3.2" height="${ST.y - ST.top - 4}" fill="${STAHL}"/>`;
  k += `<ellipse cx="0" cy="${ST.top - ST.y + 1.6}" rx="24" ry="5.2" fill="#3a3d40"/>`;
  k += `<ellipse cx="0" cy="${ST.top - ST.y}" rx="24" ry="5.2" fill="${S.lg("tischplatte", [[0, "#5a5e62"], [1, "#7a7f84"]])}"/>`;
  k += `<path d="M-16 ${ST.top - ST.y - 3} Q0 ${ST.top - ST.y - 5.4} 14 ${ST.top - ST.y - 3.4}" stroke="#fff" stroke-width=".6" opacity=".3" fill="none"/>`;
  S.teil({ id: "im_stehtisch", de: "der Stehtisch", syl: "STEH-tisch", it: "il tavolo alto", itSyl: "TA-vo-lo AL-to", en: "standing table", x: ST.x, y: ST.y, steht: true, kunst: k,
    tipp: "Am Stehtisch isst man schnell im Stehen." });
}
{
  /* DER SERVIETTENSPENDER (hinten auf dem Tisch) */
  let k = schatten(0, .2, 5, .6, .3) + `<rect x="-4.4" y="-8" width="8.8" height="8" rx=".8" fill="${STAHL}"/><rect x="-3" y="-9.4" width="6" height="2" fill="#fbfbf7"/><path d="M-3 -9.4 q3 -1.6 6 0" fill="#fff"/>`;
  S.teil({ oben: true, id: "im_serviettenspender", de: "der Serviettenspender", syl: "ser-vi-ET-ten-spen-der", it: "il portatovaglioli", itSyl: "por-ta-to-va-GLIO-li", en: "napkin dispenser", x: ST.x + 1, y: ST.top - 2, steht: true, kunst: k });
}
{
  /* DIE CURRYWURST — in der Pappschale, mit Currypulver und Holzgabel */
  let k = schatten(0, .2, 8, .7, .3);
  k += `<path d="M-8 -4 L8 -4 L6.6 0 L-6.6 0 Z" fill="#f6f4ee" stroke="#d2ccbd" stroke-width=".2"/>`;
  for (const x of [-5, -2, 1, 4]) k += `<ellipse cx="${x}" cy="-4.4" rx="1.7" ry="1.1" fill="#c47a3a"/>`;
  k += `<path d="M-7 -4.4 Q0 -2.8 7 -4.4 Q0 -6.2 -7 -4.4 Z" fill="${SAUCE}"/>`;
  for (let i = 0; i < 10; i++) k += `<circle cx="${r(-6 + rnd() * 12)}" cy="${r(-5.2 + rnd() * 1.4)}" r=".28" fill="#e8b84a"/>`;
  k += `<path d="M3 -5 L7 -9" stroke="#e3c48f" stroke-width=".7"/>`;
  S.teil({ oben: true, id: "im_currywurst", de: "die Currywurst", syl: "CUR-ry-wurst", it: "il currywurst", itSyl: "CUR-ry-wurst", en: "currywurst", x: ST.x - 10, y: ST.top + 1, steht: true, kunst: k + flaeche(-8.4, -9.6, 16.8, 10),
    tipp: "Die Currywurst kommt aus Berlin: Bratwurst in Scheiben mit Currysoße." });
}
{
  /* DIE POMMES — rot-weiß, in der Spitztüte-Schale */
  let k = schatten(0, .2, 6, .6, .3);
  k += `<path d="M-5.4 -6 L5.4 -6 L4 0 L-4 0 Z" fill="#d8352a"/><path d="M-5.4 -6 L5.4 -6 L5.1 -4.8 L-5.1 -4.8 Z" fill="#fff"/>`;
  for (let i = 0; i < 9; i++) k += `<rect x="${r(-4.4 + i * 1)}" y="${r(-11 + (i % 3) * 0.7)}" width=".9" height="6" fill="${POMMES}" transform="rotate(${-12 + i * 3} 0 -6)"/>`;
  k += `<ellipse cx="1.6" cy="-7.4" rx="2" ry=".9" fill="#fbf6dc"/><path d="M-2 -8 L-3.4 -12" stroke="#e3c48f" stroke-width=".6"/>`;
  S.teil({ oben: true, id: "im_pommes", de: "die Pommes", syl: "POM-mes", it: "le patatine fritte", itSyl: "pa-ta-TI-ne FRIT-te", en: "chips", x: ST.x + 11, y: ST.top + 1, steht: true, kunst: k + flaeche(-5.6, -12, 11.2, 12.2),
    tipp: "„Pommes rot-weiß“ heißt: mit Ketchup und Mayo." });
}

/* =====================================================================
   11 — DER GAST (am Tresenende, wartet auf seinen Döner)
   ===================================================================== */
{
  const m = B.mensch({ id: "im_gast", geschlecht: "m", pose: "stehen", blick: -58, frisur: "kurz", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "grau" }, jacke: { stueck: "jacke", farbe: "#2f5f95" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "schwarz" } } }, 108);
  S.teil({ id: "im_gast_im", de: "der Gast", syl: "GAST", it: "il cliente", itSyl: "cli-EN-te", en: "customer", x: 257, y: 197, kunst: m.svg,
    tipp: "Der Gast sagt: „Einen Döner, bitte — mit allem, ohne Zwiebeln.“" });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/imbiss.js"));
console.log(aus);
