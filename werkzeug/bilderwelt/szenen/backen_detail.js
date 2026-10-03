#!/usr/bin/env node
/* =====================================================================
   BACKEN — ALLES BEREIT (FASSUNG 852) — Bilderwelt neu, Detail-Szene
   (geöffnet über die Lupe aus „suessigkeiten“)
   ---------------------------------------------------------------------
   RECHERCHE (Butterplätzchen/Mürbeteig: Küchengötter, REWE-Rezepte,
   Heidelberg24 „Omas Butterplätzchen“):
   - Zutaten: 300 g Mehl, 200 g kalte Butter, 100 g Zucker, 1 Ei, eine
     Prise Salz (manche Rezepte: 1 TL Backpulver). Ein Butterpäckchen
     wiegt in Deutschland 250 g — darum steht es auf der Küchenwaage.
   - Ablauf: Teig rühren bzw. kneten (Rührgerät, Schüssel), kühlen,
     auf der bemehlten Arbeitsplatte 2–3 mm dünn ausrollen
     (Nudelholz), mit Ausstechformen ausstechen, auf das Backblech mit
     Backpapier legen, bei 180 °C Ober-/Unterhitze backen.
   Szene: Arbeitsplatte (Eiche) vor weißen Wandfliesen, schräg von oben.
   Hinten an der Wand die Zutaten und Geräte, in der Mitte die Schüssel,
   vorn das Backblech mit fertig ausgestochenen Plätzchen und der
   ausgerollte Teig mit Nudelholz. Überall etwas Mehlstaub.
   Maßstab vorn ≈ 2,9 Einheiten je Zentimeter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "backen_detail", titel: "Backen — alles bereit", emoji: "🔍", thema: "Essen & Trinken", kuerzel: "b27e", fassung: 852 });
const rnd = zufall(2705);
const r = B.r;
const A = (cx, cy, svg) => `<g transform="translate(${-cx} ${-cy})">${svg}</g>`;
const F = 0.6;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("w1")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".7"/></filter>`);
const W1 = `filter="url(#${S.id("w1")})"`;
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.3, "#b9c0c6"], [0.55, "#f4f6f7"], [0.8, "#9aa3aa"], [1, "#d5dade"]], 0, 0, 1, 0);
const HOLZ_H = S.lg("holzh", [[0, "#e2b981"], [0.5, "#c9965a"], [1, "#a8743e"]], 0, 0, 1, 0);
const KEKS = S.rg("keks", [[0, "#f2cf86"], [0.7, "#e2ab58"], [1, "#b97a30"]], 0.45, 0.4, 0.65);
const TEIG = S.rg("teig", [[0, "#fbecc4"], [0.7, "#f2dca6"], [1, "#e0c487"]], 0.45, 0.4, 0.65);
const mehlStaub = (cx, cy, rx, ry, n, op = 0.7) => {
  let g = "";
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd());
    g += `<circle cx="${r(cx + Math.cos(a) * rx * d)}" cy="${r(cy + Math.sin(a) * ry * d)}" r="${r(0.25 + rnd() * 0.5)}" fill="#fbfaf6" opacity="${r(op * (0.4 + rnd() * 0.6))}"/>`;
  }
  return g;
};

/* =====================================================================
   KULISSE — Wandfliesen
   ===================================================================== */
{
  let k = `<rect width="320" height="52" fill="#f3f2ee"/>`;
  for (let y = 0; y < 52; y += 7.5) {
    const off = Math.round(y / 7.5) % 2 ? 7.5 : 0;
    for (let x = -off; x < 320; x += 15) k += `<rect x="${r(x + 0.35)}" y="${r(y + 0.35)}" width="14.3" height="6.8" rx=".8" fill="${S.lg("fliese", [[0, "#ffffff"], [1, "#e9e8e3"]])}"/>`;
  }
  k += `<rect width="320" height="52" fill="${S.lg("wandlicht", [[0, "#fff8ea", 0.35], [0.6, "#fff8ea", 0], [1, "#2a2014", 0.12]], 0, 0, 1, 0)}"/>`;
  /* Steckdose an der Wand, Kabel des Rührgeräts */
  k += `<rect x="248" y="18" width="13" height="13" rx="2" fill="#fafaf8" stroke="#cfcfca" stroke-width=".4"/><circle cx="254.5" cy="24.5" r="3.6" fill="#e9e9e5"/><circle cx="253.2" cy="24.5" r=".6" fill="#555"/><circle cx="255.8" cy="24.5" r=".6" fill="#555"/>`;
  S.hinten(k);
}

/* =====================================================================
   0 — DIE ARBEITSPLATTE (Eiche, verleimte Stäbe) mit Mehlstaub
   ===================================================================== */
{
  let k = `<path d="M0 50 L320 50 L320 201 L0 201 Z" fill="${S.lg("platte", [[0, "#b98a55"], [0.4, "#cfa06a"], [1, "#b88653"]])}"/>`;
  for (let i = -13; i <= 13; i++) {
    /* Stäbe laufen auf den Betrachter zu; am Bildrand abschneiden */
    const xa = 160 + i * 12, xb = 160 + i * 17.4, rand = xb < 0 ? 0 : xb > 320 ? 320 : null;
    const yb = rand == null ? 196 : 50 + (rand - xa) / (xb - xa) * 146;
    k += `<line x1="${r(xa)}" y1="50" x2="${r(rand == null ? xb : rand)}" y2="${r(yb)}" stroke="#9a6a3a" stroke-width=".35" opacity=".45"/>`;
  }
  for (let i = 0; i < 46; i++) { const x = 14 + rnd() * 280, y = 60 + rnd() * 124; k += `<path d="M${r(x)} ${r(y)} q${r(4 + rnd() * 8)} ${r(-0.6 + rnd() * 1.2)} ${r(10 + rnd() * 14)} ${r(-0.4 + rnd() * 0.8)}" stroke="#a87542" stroke-width=".3" opacity=".35" fill="none" transform="rotate(${r(70 + rnd() * 30)} ${r(x)} ${r(y)})"/>`; }
  k += `<rect x="0" y="50" width="320" height="3" fill="#000" opacity=".1"/>`;
  k += `<rect x="0" y="195" width="320" height="6" fill="${S.lg("kante", [[0, "#d9ab74"], [1, "#8a5a2c"]])}"/>`;
  /* Mehlstaub, vor allem rund um Teig und Schüssel */
  k += mehlStaub(196, 168, 62, 30, 180, 0.8) + mehlStaub(150, 118, 70, 22, 60, 0.6) + mehlStaub(86, 92, 30, 8, 40, 0.7);
  S.teil({ id: "arbeitsplatte", de: "die Arbeitsplatte", syl: "AR-beits-plat-te", it: "il piano di lavoro", itSyl: "PIA-no di la-VO-ro", en: "worktop", x: 300, y: 198, kunst: A(300, 198, k) });
}

/* =====================================================================
   1 — HINTEN AN DER WAND: Rezept, Mehl, Zucker, Backpulver, Waage mit
       Butter, Rührgerät, Messbecher, Eier
   ===================================================================== */
{
  /* Kochbuch auf einem Buchständer, aufgeschlagen beim Rezept */
  let k = schatten(40, 80, 26, 3, 0.35);
  k += `<path d="M14 82 L18 30 L62 30 L66 82 Z" fill="#7a5230"/><rect x="14" y="80" width="52" height="3" rx="1" fill="#5e3e22"/>`;
  k += `<path d="M18 34 Q28 31 39.4 34 L39.6 79 Q28 76 17 79 Z" fill="${S.lg("seitel", [[0, "#f3eee2"], [1, "#fffdf7"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M40.6 34 Q52 31 62 34 L63 79 Q52 76 40.4 79 Z" fill="${S.lg("seiter", [[0, "#fffdf7"], [1, "#ece6d8"]], 0, 0, 1, 0)}"/>`;
  k += `<line x1="40" y1="33.4" x2="40" y2="79" stroke="#c9bfa9" stroke-width=".5"/>`;
  const t = (x, y, s, txt, f = "#3a2e22", w = "normal") => `<text x="${x}" y="${y}" font-size="${s}" fill="${f}" font-family="Georgia,serif" font-weight="${w}">${txt}</text>`;
  k += t(20.6, 40, 3, "Butterplätzchen", "#8a2f1e", "bold");
  [["300 g Mehl", 45], ["200 g Butter", 49], ["100 g Zucker", 53], ["1 Ei", 57], ["1 Prise Salz", 61], ["1 TL Backpulver", 65]].forEach(([s, y]) => { k += t(21, y, 2.3, s); });
  k += `<rect x="43" y="37" width="17" height="13" rx=".6" fill="${S.lg("foto", [[0, "#d7a35a"], [1, "#8a5a26"]])}"/>`;
  for (const [x, y] of [[47, 41], [52, 44], [56, 40], [48.6, 46.4], [56, 46]]) k += `<path d="M${x} ${y - 1.6} l.5 1.1 1.2 .1 -.9 .8 .3 1.2 -1.1 -.6 -1.1 .6 .3 -1.2 -.9 -.8 1.2 -.1 Z" fill="#f4d48a"/>`;
  for (let i = 0; i < 7; i++) k += `<rect x="43" y="${53 + i * 3.2}" width="${i === 6 ? 9 : 17}" height=".7" fill="#b9ae98"/>`;
  S.teil({ id: "rezept", de: "das Rezept", syl: "re-ZEPT", it: "la ricetta", itSyl: "ri-CET-ta", en: "recipe", x: 40, y: 56, kunst: A(40, 56, k),
    tipp: "Im Rezept stehen die Zutaten und die Arbeitsschritte." });
}
{
  /* Mehl: Papiertüte, oben gefaltet */
  const cx = 84, by = 88;
  let k = schatten(cx + 1, by, 14, 2.6, 0.35);
  k += `<path d="M${cx - 11} ${by} L${cx - 11} ${by - 34} L${cx + 11} ${by - 34} L${cx + 11} ${by} Z" fill="${S.lg("tuete", [[0, "#f2f0ea"], [0.6, "#ffffff"], [1, "#d9d5cb"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${cx - 11} ${by - 34} L${cx - 9} ${by - 40} L${cx + 9} ${by - 40} L${cx + 11} ${by - 34} Z" fill="#e6e3da"/><path d="M${cx - 9} ${by - 40} L${cx + 9} ${by - 40}" stroke="#c9c4b8" stroke-width=".6"/>`;
  k += `<rect x="${cx - 11}" y="${by - 28}" width="22" height="13" fill="#2f5d9a"/>`;
  k += `<text x="${cx}" y="${by - 22}" font-size="3.4" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">Weizen-</text><text x="${cx}" y="${by - 18}" font-size="3.4" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">mehl</text>`;
  k += `<text x="${cx}" y="${by - 10}" font-size="2.4" text-anchor="middle" fill="#2f5d9a" font-family="Arial">Type 405 · 1 kg</text>`;
  k += mehlStaub(cx, by - 37, 8, 2, 14, 0.9);
  S.teil({ id: "mehl_d", de: "das Mehl", syl: "MEHL", it: "la farina", itSyl: "fa-RI-na", en: "flour", x: cx, y: by - 18, kunst: A(cx, by - 18, k),
    tipp: "Für Plätzchen nimmt man meist Weizenmehl Type 405." });
}
{
  /* Zucker: Papierpackung 1 kg */
  const cx = 110, by = 88;
  let k = schatten(cx + 1, by, 12, 2.4, 0.35);
  k += `<path d="M${cx - 9} ${by} L${cx - 9} ${by - 28} L${cx + 9} ${by - 28} L${cx + 9} ${by} Z" fill="${S.lg("zpack", [[0, "#e4ecf4"], [0.6, "#ffffff"], [1, "#cdd6df"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${cx - 9} ${by - 28} L${cx - 7} ${by - 31} L${cx + 7} ${by - 31} L${cx + 9} ${by - 28} Z" fill="#f4f7fa"/>`;
  k += `<rect x="${cx - 9}" y="${by - 22}" width="18" height="8" fill="#d23b30"/><text x="${cx}" y="${by - 16.6}" font-size="3.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Zucker</text>`;
  k += `<text x="${cx}" y="${by - 8}" font-size="2.2" text-anchor="middle" fill="#7a2a22" font-family="Arial">fein · 1 kg</text>`;
  S.teil({ id: "zucker_d", de: "der Zucker", syl: "ZU-cker", it: "lo zucchero", itSyl: "ZUC-che-ro", en: "sugar", x: cx, y: by - 14, kunst: A(cx, by - 14, k) });
}
{
  /* Backpulver: zwei Tütchen, eins liegt, eins lehnt */
  const cx = 134, by = 90;
  let k = schatten(cx, by, 10, 2, 0.3);
  k += `<path d="M${cx - 9} ${by} L${cx - 1} ${by} L${cx} ${by - 4} L${cx - 8} ${by - 4} Z" fill="#f0f0ea" stroke="#c9c5b8" stroke-width=".2"/>`;
  k += `<g transform="rotate(-10 ${cx + 4} ${by})"><rect x="${cx}" y="${by - 15}" width="10" height="15" rx=".4" fill="#fafaf6" stroke="#c9c5b8" stroke-width=".25"/><rect x="${cx}" y="${by - 11}" width="10" height="5" fill="#e07a1f"/><text x="${cx + 5}" y="${by - 7.6}" font-size="1.7" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Backpulver</text><path d="M${cx} ${by - 15} l1 1 l1 -1 l1 1 l1 -1 l1 1 l1 -1 l1 1 l1 -1 l1 1 l1 -1" stroke="#d9d5cb" stroke-width=".3" fill="none"/></g>`;
  k += `<text x="${cx - 5}" y="${by - 1.2}" font-size="1.6" text-anchor="middle" fill="#e07a1f" font-family="Arial" font-weight="bold">Backpulver</text>`;
  S.teil({ id: "backpulver", de: "das Backpulver", syl: "BACK-pul-ver", it: "il lievito in polvere", itSyl: "LIE-vi-to in POL-ve-re", en: "baking powder", x: cx, y: by - 6, kunst: A(cx, by - 6, k),
    tipp: "Backpulver macht den Teig locker." });
}
{
  /* Küchenwaage: flache Glasplatte, Display vorn */
  const cx = 180, by = 94;
  let k = schatten(cx, by + 1, 24, 3, 0.35);
  k += `<path d="M${cx - 22} ${by - 4} L${cx - 18} ${by - 16} L${cx + 18} ${by - 16} L${cx + 22} ${by - 4} Z" fill="${S.lg("waageglas", [[0, "#3a4046"], [1, "#22262a"]])}"/>`;
  k += `<path d="M${cx - 18} ${by - 16} L${cx - 6} ${by - 16} L${cx - 16} ${by - 6} Z" fill="#fff" opacity=".12"/>`;
  k += `<path d="M${cx - 22} ${by - 4} L${cx + 22} ${by - 4} L${cx + 22} ${by - 0.6} Q${cx + 22} ${by} ${cx + 21} ${by} L${cx - 21} ${by} Q${cx - 22} ${by} ${cx - 22} ${by - 0.6} Z" fill="#1a1d20"/>`;
  k += `<rect x="${cx - 6}" y="${by - 3.4}" width="12" height="2.8" rx=".3" fill="#9fd8e8"/><text x="${cx}" y="${by - 1.2}" font-size="2.3" text-anchor="middle" fill="#0b2a36" font-family="monospace" font-weight="bold">250 g</text>`;
  k += `<circle cx="${cx + 12}" cy="${by - 2}" r=".8" fill="#6f777e"/><circle cx="${cx + 15}" cy="${by - 2}" r=".8" fill="#6f777e"/>`;
  S.teil({ id: "kuechenwaage", de: "die Küchenwaage", syl: "KÜ-chen-waa-ge", it: "la bilancia da cucina", itSyl: "bi-LAN-cia da cu-CI-na", en: "kitchen scale", x: cx, y: by - 6, kunst: A(cx, by - 6, k),
    tipp: "Ein Päckchen Butter wiegt 250 Gramm." });
}
{
  /* Butter im Goldpapier auf der Waage */
  const cx = 180, by = 88;
  let k = schatten(cx, by, 10, 1.6, 0.35);
  k += `<path d="M${cx - 10} ${by} L${cx - 10} ${by - 5} L${cx + 10} ${by - 5} L${cx + 10} ${by} Z" fill="${S.lg("goldfront", [[0, "#c9a246"], [0.5, "#f1d98a"], [1, "#b48a2e"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${cx - 10} ${by - 5} L${cx - 7} ${by - 10} L${cx + 7} ${by - 10} L${cx + 10} ${by - 5} Z" fill="${S.lg("goldtop", [[0, "#f6e3a0"], [1, "#d9b75a"]])}"/>`;
  k += `<path d="M${cx - 8} ${by - 7.4} L${cx + 8} ${by - 7.4}" stroke="#b48a2e" stroke-width=".3"/>`;
  k += `<text x="${cx}" y="${by - 1.4}" font-size="2.8" text-anchor="middle" fill="#2f5d2a" font-family="Georgia,serif" font-weight="bold">Butter</text>`;
  S.teil({ oben: true, id: "butter", de: "die Butter", syl: "BUT-ter", it: "il burro", itSyl: "BUR-ro", en: "butter", x: cx, y: by - 5, kunst: A(cx, by - 5, k) });
}
{
  /* Handrührgerät, auf der Ferse abgestellt, mit zwei Rührbesen */
  const cx = 226, by = 94;
  let k = schatten(cx, by, 16, 2.4, 0.35);
  /* Kabel zur Steckdose */
  k += `<path d="M${cx + 12} ${by - 30} C${cx + 30} ${by - 30} ${cx + 22} ${by - 60} 254.5 ${by - 62}" stroke="#e9e9e5" stroke-width="1.2" fill="none"/><path d="M${cx + 12} ${by - 30} C${cx + 30} ${by - 30} ${cx + 22} ${by - 60} 254.5 ${by - 62}" stroke="#bdbdb8" stroke-width=".3" fill="none" transform="translate(.4 .4)"/>`;
  /* Rührbesen: zwei Drahtschlaufen nach vorn unten */
  for (const dx of [-5, 4]) {
    k += `<line x1="${cx + dx}" y1="${by - 22}" x2="${cx + dx}" y2="${by - 12}" stroke="#aeb6bd" stroke-width="1"/>`;
    k += `<path d="M${cx + dx - 3.6} ${by - 12} Q${cx + dx - 4} ${by - 1} ${cx + dx} ${by - 0.6} Q${cx + dx + 4} ${by - 1} ${cx + dx + 3.6} ${by - 12} Z" fill="#fff" fill-opacity=".15" stroke="#c3c9ce" stroke-width=".55"/>`;
    k += `<path d="M${cx + dx - 1.6} ${by - 12} Q${cx + dx - 1.8} ${by - 2} ${cx + dx} ${by - 1} Q${cx + dx + 1.8} ${by - 2} ${cx + dx + 1.6} ${by - 12}" fill="none" stroke="#9aa3aa" stroke-width=".45"/>`;
  }
  /* Gehäuse mit Griff */
  k += `<path d="M${cx - 13} ${by - 20} C${cx - 14} ${by - 30} ${cx - 8} ${by - 36} ${cx + 4} ${by - 36} C${cx + 13} ${by - 36} ${cx + 15} ${by - 28} ${cx + 13} ${by - 20} Q${cx} ${by - 17} ${cx - 13} ${by - 20} Z" fill="${S.lg("mixer", [[0, "#ffffff"], [0.6, "#eef0f1"], [1, "#c9cfd4"]])}"/>`;
  k += `<path d="M${cx - 8} ${by - 35} C${cx - 8} ${by - 46} ${cx + 10} ${by - 46} ${cx + 11} ${by - 35} L${cx + 7} ${by - 35} C${cx + 6} ${by - 42} ${cx - 4} ${by - 42} ${cx - 4} ${by - 35} Z" fill="#f4f6f7" stroke="#c9cfd4" stroke-width=".35"/>`;
  k += `<rect x="${cx - 3}" y="${by - 43.4}" width="5" height="2" rx=".6" fill="#3a6fb3"/><circle cx="${cx + 7}" cy="${by - 25}" r="1.4" fill="#8a929a"/>`;
  k += `<path d="M${cx - 10} ${by - 30} Q${cx - 6} ${by - 34} ${cx} ${by - 34}" stroke="#fff" stroke-width="1" fill="none"/>`;
  S.teil({ id: "ruehrgeraet", de: "das Rührgerät", syl: "RÜHR-ge-rät", it: "lo sbattitore elettrico", itSyl: "sbat-ti-TO-re e-LET-tri-co", en: "hand mixer", x: cx, y: by - 20, kunst: A(cx, by - 20, k) });
}
{
  /* Messbecher (Kunststoff, durchsichtig) mit Milch */
  const cx = 264, by = 94;
  let k = schatten(cx, by, 9, 2, 0.3);
  k += `<path d="M${cx - 7} ${by - 26} L${cx - 6} ${by - 0.6} Q${cx} ${by + 0.8} ${cx + 6} ${by - 0.6} L${cx + 7} ${by - 26} Z" fill="#f7f5ee" opacity=".35"/>`;
  k += `<path d="M${cx - 6.7} ${by - 14} L${cx - 6} ${by - 0.6} Q${cx} ${by + 0.8} ${cx + 6} ${by - 0.6} L${cx + 6.7} ${by - 14} Z" fill="#fbfaf6"/><ellipse cx="${cx}" cy="${by - 14}" rx="6.7" ry="1.8" fill="#ffffff"/>`;
  k += `<path d="M${cx - 7} ${by - 26} L${cx - 6} ${by - 0.6} Q${cx} ${by + 0.8} ${cx + 6} ${by - 0.6} L${cx + 7} ${by - 26} Z" fill="none" stroke="#c9d6dc" stroke-width=".4"/>`;
  k += `<ellipse cx="${cx}" cy="${by - 26}" rx="7" ry="2" fill="none" stroke="#dfe8ec" stroke-width=".4"/><path d="M${cx - 7} ${by - 26} l-2 -1 l2.4 2.4" stroke="#c9d6dc" stroke-width=".4" fill="none"/>`;
  k += `<path d="M${cx + 6.8} ${by - 22} q5 0 4.4 6 q-.4 4 -4.8 4.4" stroke="#d9e4e8" stroke-width="1.6" fill="none" opacity=".8"/>`;
  for (let i = 0; i < 5; i++) k += `<line x1="${cx - 4}" y1="${by - 5 - i * 4.4}" x2="${cx - 1.4}" y2="${by - 5 - i * 4.4}" stroke="#c0392b" stroke-width=".4"/>`;
  k += `<text x="${cx - 1}" y="${by - 13.6}" font-size="1.6" fill="#c0392b" font-family="Arial">250</text>`;
  S.teil({ id: "messbecher", de: "der Messbecher", syl: "MESS-be-cher", it: "il misurino", itSyl: "mi-su-RI-no", en: "measuring jug", x: cx, y: by - 13, kunst: A(cx, by - 13, k) });
}
{
  /* Eier: drei braune in einer kleinen Schale, eins daneben */
  const cx = 296, by = 94;
  let k = schatten(cx, by, 15, 2.6, 0.35);
  const EI = S.rg("ei", [[0, "#f3d9b8"], [0.6, "#d9ab78"], [1, "#a8743e"]], 0.4, 0.35, 0.7);
  for (const [dx, dy, rot] of [[-5, -10, -20], [4, -11, 15], [-0.4, -13.4, 0]]) k += `<ellipse cx="${cx + dx}" cy="${by + dy}" rx="4.2" ry="5.4" fill="${EI}" transform="rotate(${rot} ${cx + dx} ${by + dy})"/>`;
  k += `<path d="M${cx - 12} ${by - 9} C${cx - 11} ${by - 1} ${cx + 11} ${by - 1} ${cx + 12} ${by - 9} Q${cx} ${by - 6} ${cx - 12} ${by - 9} Z" fill="${S.lg("schale", [[0, "#7aa6b5"], [1, "#4f7f8f"]])}"/>`;
  k += `<path d="M${cx - 12} ${by - 9} Q${cx} ${by - 6} ${cx + 12} ${by - 9}" stroke="#a9cbd6" stroke-width=".6" fill="none"/>`;
  k += `<ellipse cx="${cx - 18}" cy="${by - 3}" rx="5.4" ry="3.8" fill="${EI}" transform="rotate(-8 ${cx - 18} ${by - 3})"/><ellipse cx="${cx - 19.4}" cy="${by - 4.4}" rx="1.6" ry=".8" fill="#fff" opacity=".35"/>`;
  S.teil({ id: "ei_d", de: "das Ei", syl: "EI", it: "l'uovo", itSyl: "UO-vo", en: "egg", x: cx - 4, y: by - 8, kunst: A(cx - 4, by - 8, k) });
}

/* =====================================================================
   2 — MITTE: Teigschaber, Kochlöffel, Rührschüssel, Schneebesen,
       Backform (Springform)
   ===================================================================== */
{
  const k = schatten(84, 113, 26, 2, 0.25)
    + `<g transform="rotate(-10 84 110)"><rect x="66" y="108.6" width="28" height="2.6" rx="1.2" fill="#f4f4f1" stroke="#cfcfca" stroke-width=".3"/><path d="M94 107.4 L106 106.6 Q109.6 107 109.6 110 Q109.6 113 106 113.4 L94 112.6 Z" fill="${S.lg("silikon", [[0, "#e2574c"], [1, "#b8352c"]])}"/><path d="M96 108.4 L105 108" stroke="#f08a80" stroke-width=".5"/></g>`;
  S.teil({ id: "teigschaber", de: "der Teigschaber", syl: "TEIG-scha-ber", it: "la spatola", itSyl: "SPA-to-la", en: "spatula", x: 88, y: 109, kunst: A(88, 109, k) });
}
{
  const k = schatten(84, 128, 28, 2, 0.25)
    + `<g transform="rotate(6 84 124)"><rect x="60" y="122.8" width="34" height="2.6" rx="1.2" fill="${S.lg("loeffelholz", [[0, "#e2b97e"], [1, "#b8854a"]])}"/><ellipse cx="100" cy="124.1" rx="7" ry="3.8" fill="${S.rg("loeffelkopf", [[0, "#ebc68e"], [1, "#b8854a"]])}"/><ellipse cx="100.6" cy="124.1" rx="5" ry="2.4" fill="#c9965a" opacity=".5"/></g>`;
  S.teil({ id: "kochloeffel", de: "der Kochlöffel", syl: "KOCH-löf-fel", it: "il cucchiaio di legno", itSyl: "cuc-CHIA-io di LE-gno", en: "wooden spoon", x: 82, y: 125, kunst: A(82, 125, k) });
}
{
  /* Rührschüssel aus Edelstahl mit dem fertigen Mürbeteig */
  const cx = 158, cy = 112;
  let k = schatten(cx, cy + 27, 30, 4, 0.4);
  k += `<path d="M${cx - 34} ${cy} C${cx - 32} ${cy + 18} ${cx - 18} ${cy + 27} ${cx} ${cy + 27} C${cx + 18} ${cy + 27} ${cx + 32} ${cy + 18} ${cx + 34} ${cy} Z" fill="${STAHL}"/>`;
  k += `<ellipse cx="${cx}" cy="${cy}" rx="34" ry="${r(34 * F * 0.55)}" fill="${S.lg("innen", [[0, "#7e878e"], [1, "#d7dde1"]])}"/>`;
  k += `<ellipse cx="${cx}" cy="${cy}" rx="34" ry="${r(34 * F * 0.55)}" fill="none" stroke="#f4f6f7" stroke-width="1.2"/>`;
  /* Teigkugel in der Schüssel */
  k += `<path d="M${cx - 15} ${cy + 4} C${cx - 16} ${cy - 6} ${cx - 6} ${cy - 10} ${cx + 2} ${cy - 9} C${cx + 12} ${cy - 8} ${cx + 17} ${cy - 3} ${cx + 15} ${cy + 4} Q${cx} ${cy + 8} ${cx - 15} ${cy + 4} Z" fill="${TEIG}"/>`;
  k += `<path d="M${cx - 8} ${cy - 6} Q${cx} ${cy - 9} ${cx + 8} ${cy - 6}" stroke="#fff" stroke-width="1" opacity=".5" fill="none"/>`;
  k += mehlStaub(cx, cy - 2, 12, 4, 20, 0.9);
  k += `<path d="M${cx - 30} ${cy + 6} C${cx - 26} ${cy + 18} ${cx - 16} ${cy + 23} ${cx - 6} ${cy + 24}" stroke="#fff" stroke-width="1.6" opacity=".7" fill="none"/>`;
  S.teil({ id: "ruehrschuessel", de: "die Rührschüssel", syl: "RÜHR-schüs-sel", it: "la ciotola", itSyl: "CIO-to-la", en: "mixing bowl", x: cx, y: cy + 10, kunst: A(cx, cy + 10, k) });
}
{
  /* Schneebesen, liegt rechts neben der Schüssel */
  const k = schatten(224, 132, 26, 2.4, 0.25)
    + `<g transform="rotate(-14 224 126)"><rect x="232" y="124.6" width="22" height="3" rx="1.4" fill="${STAHL}"/><rect x="230" y="124.2" width="3" height="3.8" rx=".6" fill="#aeb6bd"/>`
    + `<path d="M230 126.1 C222 118 204 118 198 126.1 C204 134.2 222 134.2 230 126.1 Z" fill="#fff" fill-opacity=".14" stroke="#c3c9ce" stroke-width=".6"/>`
    + `<path d="M230 126.1 C222 121 206 121 200 126.1 C206 131.2 222 131.2 230 126.1" fill="none" stroke="#aeb6bd" stroke-width=".5"/><path d="M230 126.1 L199 126.1" stroke="#9aa3aa" stroke-width=".5"/></g>`;
  S.teil({ id: "schneebesen", de: "der Schneebesen", syl: "SCHNEE-be-sen", it: "la frusta", itSyl: "FRU-sta", en: "whisk", x: 224, y: 126, kunst: A(224, 126, k),
    tipp: "Mit dem Schneebesen schlägt man Eiweiß zu Eischnee." });
}
{
  /* Springform (Backform) mit Verschlusshebel */
  const cx = 288, cy = 120;
  let k = schatten(cx, cy + 9, 28, 5, 0.35);
  k += `<path d="M${cx - 26} ${cy} L${cx - 26} ${cy + 7} A26 ${r(26 * F)} 0 0 0 ${cx + 26} ${cy + 7} L${cx + 26} ${cy} Z" fill="${S.lg("formaussen", [[0, "#2a2d31"], [0.4, "#55595f"], [1, "#1c1e21"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="${cx}" cy="${cy}" rx="26" ry="${r(26 * F)}" fill="#3a3e43"/><ellipse cx="${cx}" cy="${cy + 1.4}" rx="24.4" ry="${r(24.4 * F)}" fill="${S.rg("formboden", [[0, "#4b5056"], [1, "#2a2d31"]])}"/>`;
  k += `<ellipse cx="${cx}" cy="${cy}" rx="26" ry="${r(26 * F)}" fill="none" stroke="#8a9198" stroke-width=".5"/>`;
  k += `<path d="M${cx + 16} ${cy + 13} L${cx + 22} ${cy + 10} L${cx + 23} ${cy + 15} Z" fill="#9aa3aa"/>`;
  S.teil({ id: "backform", de: "die Backform", syl: "BACK-form", it: "lo stampo", itSyl: "STAM-po", en: "cake tin", x: cx, y: cy + 4, kunst: A(cx, cy + 4, k),
    tipp: "Das ist eine Springform: Man kann den Rand öffnen." });
}

/* =====================================================================
   3 — VORN: Backblech mit Backpapier und Plätzchen, ausgerollter Teig
       mit Nudelholz und Ausstechformen, Topflappen
   ===================================================================== */
const BLECH = { tl: [16, 140], tr: [128, 140], br: [138, 197], bl: [4, 197] };
{
  const { tl, tr, br, bl } = BLECH;
  let k = schatten(72, 196, 66, 4, 0.4);
  k += `<path d="M${tl[0]} ${tl[1]} L${tr[0]} ${tr[1]} L${br[0]} ${br[1]} L${bl[0]} ${bl[1]} Z" fill="${S.lg("blech", [[0, "#2f3236"], [1, "#1b1d20"]])}"/>`;
  k += `<path d="M${tl[0]} ${tl[1]} L${tr[0]} ${tr[1]} L${br[0]} ${br[1]} L${bl[0]} ${bl[1]} Z" fill="none" stroke="#5e636a" stroke-width="1.4"/>`;
  k += `<path d="M${bl[0]} ${bl[1]} L${br[0]} ${br[1]} L${br[0] - 0.4} ${br[1] + 2.6} L${bl[0] + 0.4} ${bl[1] + 2.6} Z" fill="#111"/>`;
  k += `<path d="M${tl[0] + 2} ${tl[1] + 1} L${tr[0] - 2} ${tr[1] + 1}" stroke="#8a9198" stroke-width=".5"/>`;
  S.teil({ id: "backblech", de: "das Backblech", syl: "BACK-blech", it: "la teglia", itSyl: "TE-glia", en: "baking tray", x: 71, y: 168, kunst: A(71, 168, k) });
}
{
  let k = `<path d="M20 144 L124 143.4 L133 193.6 L9 194 Z" fill="${S.lg("papier", [[0, "#f1e6cf"], [1, "#e4d5b6"]])}"/>`;
  for (let i = 0; i < 8; i++) { const y = 148 + i * 6; k += `<path d="M${r(16 + rnd() * 20)} ${r(y)} q${r(20 + rnd() * 30)} ${r(-1 + rnd() * 2)} ${r(50 + rnd() * 40)} ${r(-0.6 + rnd() * 1.2)}" stroke="#d6c4a0" stroke-width=".35" opacity=".7" fill="none"/>`; }
  S.teil({ id: "backpapier", de: "das Backpapier", syl: "BACK-pa-pier", it: "la carta da forno", itSyl: "CAR-ta da FOR-no", en: "baking paper", x: 70, y: 168, kunst: A(70, 168, k),
    tipp: "Auf dem Backpapier kleben die Plätzchen nicht fest." });
}
{
  /* Plätzchen: Sterne, Herzen, Kreise — goldgelb gebacken */
  const stern = (x, y, s) => { let d = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? s * 0.45 : s; d += (i ? "L" : "M") + r(x + Math.cos(a) * rr) + " " + r(y + Math.sin(a) * rr * F * 1.3); } return d + "Z"; };
  const herz = (x, y, s) => `M${x} ${r(y + s * 0.7)} C${r(x - s * 1.4)} ${r(y - s * 0.1)} ${r(x - s * 0.7)} ${r(y - s * 0.9)} ${x} ${r(y - s * 0.35)} C${r(x + s * 0.7)} ${r(y - s * 0.9)} ${r(x + s * 1.4)} ${r(y - s * 0.1)} ${x} ${r(y + s * 0.7)} Z`;
  const reihen = [[150, 30, 112, 4], [166, 26, 116, 4], [183, 22, 122, 4]];
  let k = "", n = 0;
  for (const [y, x0, x1, anz] of reihen) {
    for (let i = 0; i < anz; i++) {
      const x = x0 + (x1 - x0) * (i + 0.5) / anz, art = (n++) % 3, s = 6.4 + (y - 150) * 0.05;
      const d = art === 0 ? stern(x, y, s) : art === 1 ? herz(x, y, s * 0.95) : null;
      k += schatten(x + 0.6, y + 2.6, s * 0.9, 1.4, 0.25);
      if (d) k += `<path d="${d}" fill="${KEKS}" stroke="#b97a30" stroke-width=".35"/>`;
      else k += `<ellipse cx="${x}" cy="${y}" rx="${r(s)}" ry="${r(s * F * 1.2)}" fill="${KEKS}" stroke="#b97a30" stroke-width=".35"/><ellipse cx="${x}" cy="${y}" rx="${r(s * 0.6)}" ry="${r(s * 0.42)}" fill="none" stroke="#c98a3e" stroke-width=".3" stroke-dasharray=".6 .6"/>`;
      k += `<ellipse cx="${r(x - s * 0.25)}" cy="${r(y - s * 0.3)}" rx="${r(s * 0.3)}" ry="${r(s * 0.15)}" fill="#fff6dc" opacity=".45"/>`;
    }
  }
  S.teil({ id: "plaetzchen", de: "das Plätzchen", syl: "PLÄTZ-chen", it: "il biscotto", itSyl: "bi-SCOT-to", en: "cookie", x: 70, y: 166, kunst: A(70, 166, k),
    tipp: "Plätzchen backt man in Deutschland vor allem in der Adventszeit." });
}
{
  /* ausgerollter Teig mit ausgestochenen Löchern, bemehlt */
  let k = `<path d="M150 158 C146 148 160 142 182 141.4 C206 141 232 143 242 150 C250 156 248 176 240 186 C230 194 196 196 172 194 C154 192 146 182 148 172 C149 166 151 162 150 158 Z" fill="${TEIG}"/>`;
  k += `<path d="M150 158 C146 148 160 142 182 141.4 C206 141 232 143 242 150" stroke="#fff6dc" stroke-width="1" opacity=".6" fill="none"/>`;
  /* Löcher, wo schon ausgestochen wurde (man sieht die Platte) */
  const LOCH = "#c4955f";
  k += `<path d="M168 152 l1.6 3.4 3.8 .3 -2.9 2.3 1 3.6 -3.5 -2 -3.5 2 1 -3.6 -2.9 -2.3 3.8 -.3 Z" fill="${LOCH}"/>`;
  k += `<path d="M190 162 C181 156 183 149 190 153 C197 149 199 156 190 162 Z" fill="${LOCH}"/>`;
  k += `<ellipse cx="210" cy="152" rx="6" ry="3.8" fill="${LOCH}"/>`;
  k += `<path d="M168 152 l1.6 3.4 3.8 .3 -2.9 2.3 1 3.6 -3.5 -2 -3.5 2 1 -3.6 -2.9 -2.3 3.8 -.3 Z" fill="none" stroke="#e7cf9a" stroke-width=".5" transform="translate(-.4 -.5)"/>`;
  k += mehlStaub(198, 168, 44, 22, 120, 0.85);
  S.teil({ id: "teig", de: "der Teig", syl: "TEIG", it: "l'impasto", itSyl: "im-PA-sto", en: "dough", x: 198, y: 170, kunst: A(198, 170, k),
    tipp: "Den Teig rollt man auf der bemehlten Arbeitsplatte dünn aus." });
}
{
  /* Nudelholz aus Buche, schräg auf dem Teig */
  const cx = 210, cy = 176, rot = -12;
  let k = schatten(cx + 2, cy + 6, 40, 3, 0.35);
  k += `<g transform="rotate(${rot} ${cx} ${cy})">`;
  k += `<rect x="${cx - 46}" y="${cy - 1.8}" width="12" height="3.6" rx="1.8" fill="${HOLZ_H}"/><rect x="${cx + 34}" y="${cy - 1.8}" width="12" height="3.6" rx="1.8" fill="${HOLZ_H}"/>`;
  k += `<rect x="${cx - 34}" y="${cy - 5}" width="68" height="10" rx="1.6" fill="${S.lg("rolle", [[0, "#f0d2a2"], [0.35, "#e2b97e"], [0.75, "#c48e52"], [1, "#9a6a34"]])}"/>`;
  k += `<rect x="${cx - 34}" y="${cy - 3.6}" width="68" height="1.4" fill="#fff" opacity=".35"/>`;
  k += mehlStaub(cx, cy + 1, 30, 3, 26, 0.9) + `</g>`;
  S.teil({ id: "teigrolle", de: "das Nudelholz", syl: "NU-del-holz", it: "il matterello", itSyl: "mat-te-REL-lo", en: "rolling pin", x: cx, y: cy, kunst: A(cx, cy, k),
    tipp: "Das Nudelholz heißt auch Teigrolle oder Wellholz." });
}
{
  /* Ausstechformen aus Blech: Stern und Herz */
  const st = (x, y, s) => { let d = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? s * 0.45 : s; d += (i ? "L" : "M") + r(x + Math.cos(a) * rr) + " " + r(y + Math.sin(a) * rr * F * 1.3); } return d + "Z"; };
  let k = schatten(262, 190, 10, 2, 0.3) + schatten(276, 168, 8, 2, 0.3);
  k += `<path d="${st(262, 186, 9)}" fill="#fff" fill-opacity=".12" stroke="#7d868d" stroke-width="2.2" transform="translate(0 1.6)"/><path d="${st(262, 186, 9)}" fill="#fff" fill-opacity=".1" stroke="#dfe4e8" stroke-width="1.2"/>`;
  const hz = "M276 172 C266 165 268 158 276 162.4 C284 158 286 165 276 172 Z";
  k += `<path d="${hz}" fill="#fff" fill-opacity=".12" stroke="#7d868d" stroke-width="2.2" transform="translate(0 1.6)"/><path d="${hz}" fill="#fff" fill-opacity=".1" stroke="#dfe4e8" stroke-width="1.2"/>`;
  S.teil({ id: "ausstechform", de: "die Ausstechform", syl: "AUS-stech-form", it: "la formina", itSyl: "for-MI-na", en: "cookie cutter", x: 268, y: 178, kunst: A(268, 178, k) });
}
{
  /* Topflappen, gesteppt, rot-weiß kariert, mit Aufhänger */
  S.def(`<pattern id="${S.id("karo")}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#f6f1ea"/><rect width="2" height="4" fill="#c0392b" opacity=".75"/><rect width="4" height="2" fill="#c0392b" opacity=".75"/></pattern>`);
  let k = schatten(302, 196, 18, 2.4, 0.3);
  k += `<path d="M288 160 L316 158 L319 194 L290 196 Z" fill="url(#${S.id("karo")})"/>`;
  k += `<path d="M288 160 L316 158 L319 194 L290 196 Z" fill="none" stroke="#8a231a" stroke-width="1.2"/>`;
  k += `<path d="M289 172 L317 170 M289.6 184 L318 182" stroke="#8a231a" stroke-width=".4" stroke-dasharray="1 .7" opacity=".6"/>`;
  k += `<path d="M314 158.4 q4 -5 6 -1" stroke="#8a231a" stroke-width="1" fill="none"/>`;
  S.teil({ id: "topflappen", de: "der Topflappen", syl: "TOPF-lap-pen", it: "la presina", itSyl: "pre-SI-na", en: "pot holder", x: 303, y: 177, kunst: A(303, 177, k) });
}

/* Licht vom Fenster links (fängt keinen Tipp ab) */
S.davor(`<rect width="320" height="200" fill="${S.lg("licht", [[0, "#fff6e6", 0.12], [0.5, "#fff6e6", 0], [1, "#1a1008", 0.06]], 0, 0, 1, 0.3)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/backen_detail.js"));
console.log(aus);
