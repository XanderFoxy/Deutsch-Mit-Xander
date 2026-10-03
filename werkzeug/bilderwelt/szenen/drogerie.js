#!/usr/bin/env node
/* =====================================================================
   DIE DROGERIE (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar.

   RECHERCHE (Lebensmittel Zeitung „Store-Konzept dm“, „Drogeriemarkt in
   XL“, Horizont „neues Konzept von Rossmann“) — so sieht ein deutscher
   Drogeriemarkt (dm, Rossmann, Müller) aus:
   - Lange GÄNGE zwischen deckenhohen Regalen (Gondeln), über jedem Gang
     ein Schild mit dem Bereich (Haare & Körper, Haushalt …), helle
     Wände, LED-Lichtbänder, glatter heller Boden, breite Gänge.
   - Die KOSMETIK hat eigene beleuchtete Module mit Testern, Spiegel,
     Lippenstiften, Nagellack, Wimperntusche.
   - Die BABYWELT: Windelpakete unten, darüber Feuchttücher, Gläschen
     mit Babybrei, Schnuller an Haken.
   - Vorne die KASSE mit Kassenband, Scanner, Kundendisplay und
     Kartenterminal; daneben Taschentücher und Kleinkram.
   - Im Gang Aktionsware auf einer Palette (Waschmittel) mit großem
     gelben Preisschild; rote Einkaufskörbe.
   Maßstab: Regale ≈ 46 Einheiten je Meter (1,9 m hoch), Kassentisch
   ≈ 54 je Meter (0,9 m), Kundin vorne 1,68 m ≈ 100.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "drogerie", titel: "Die Drogerie", emoji: "🧴", thema: "Einkaufen", kuerzel: "b02b", fassung: 852 });
const rnd = zufall(4711);
const r = B.r;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WAND = S.lg("wand", [[0, "#f6f3ee"], [1, "#e7e1d8"]]);
const DECKE = S.lg("decke", [[0, "#fbfaf8"], [1, "#e9e6e0"]]);
const REGAL = S.lg("regal", [[0, "#fdfdfc"], [1, "#e6e6e3"]]);
const HOLZ = S.lg("holz", [[0, "#e2c9a4"], [1, "#cfae84"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const RUND = (n, c1, c2) => S.lg(n, [[0, c2], [0.35, c1], [0.7, c1], [1, c2]], 0, 0, 1, 0);
const KOPF = "#2f4f7a";   /* Bereichsschilder dunkelblau, neutral (keine Marke) */
const BUNT = ["#e64b3c", "#2f86c9", "#3aa76d", "#f2b630", "#9b59b6", "#ef7fa8", "#16a3a3", "#ffffff", "#f39237", "#5c6bc0"];

/* Flasche mit Klappdeckel (Shampoo, Duschgel, Lotion) */
function flasche(x, yb, w, h, farbe, deckel = "#ffffff") {
  let g = `<path d="M${r(x)} ${r(yb)} L${r(x)} ${r(yb - h + w * 0.45)} Q${r(x)} ${r(yb - h + 0.6)} ${r(x + w * 0.3)} ${r(yb - h + 0.6)} L${r(x + w * 0.7)} ${r(yb - h + 0.6)} Q${r(x + w)} ${r(yb - h + 0.6)} ${r(x + w)} ${r(yb - h + w * 0.45)} L${r(x + w)} ${r(yb)} Z" fill="${farbe}" stroke="#00000022" stroke-width=".15"/>`;
  g += `<rect x="${r(x + w * 0.22)}" y="${r(yb - h - 0.6)}" width="${r(w * 0.56)}" height="1.4" rx=".4" fill="${deckel}" stroke="#0000001f" stroke-width=".12"/>`;
  g += `<rect x="${r(x + w * 0.18)}" y="${r(yb - h * 0.62)}" width="${r(w * 0.64)}" height="${r(h * 0.3)}" rx=".3" fill="#fff" opacity=".55"/>`;
  g += `<rect x="${r(x + w * 0.12)}" y="${r(yb - h + 1.5)}" width="${r(w * 0.14)}" height="${r(h - 2.5)}" fill="#fff" opacity=".28"/>`;
  return g;
}
function schachtel(x, yb, w, h, farbe) {
  return `<rect x="${r(x)}" y="${r(yb - h)}" width="${r(w)}" height="${r(h)}" rx=".25" fill="${farbe}" stroke="#0000001f" stroke-width=".12"/><rect x="${r(x + w * 0.15)}" y="${r(yb - h * 0.6)}" width="${r(w * 0.7)}" height="${r(h * 0.25)}" fill="#fff" opacity=".6"/><rect x="${r(x + w - 0.5)}" y="${r(yb - h)}" width=".5" height="${r(h)}" fill="#000" opacity=".1"/>`;
}
/* Regalboden mit Preisleiste */
function boden(x0, x1, y) {
  let g = `<rect x="${r(x0)}" y="${r(y)}" width="${r(x1 - x0)}" height="2.2" fill="#f4f4f2" stroke="#c9c9c4" stroke-width=".15"/><rect x="${r(x0)}" y="${r(y + 0.4)}" width="${r(x1 - x0)}" height="1.3" fill="#ffffff"/>`;
  for (let x = x0 + 2; x < x1 - 5; x += 9.5) g += `<rect x="${r(x)}" y="${r(y + 0.45)}" width="4.6" height="1.25" fill="#fff" stroke="#9aa0a6" stroke-width=".1"/><rect x="${r(x)}" y="${r(y + 0.45)}" width="1" height="1.25" fill="${KOPF}"/>`;
  return g;
}

/* =====================================================================
   KULISSE — Decke mit Lichtbändern, Wand, Gang in die Tiefe, Boden
   ===================================================================== */
const WU = 118;     /* Fuß der Regalfront */
S.hinten(`<rect x="0" y="0" width="320" height="14" fill="${DECKE}"/><rect x="0" y="13" width="320" height="1.5" fill="#d9d4cb"/>`);
for (const x of [20, 110, 200, 290]) S.hinten(`<rect x="${x - 26}" y="4.5" width="52" height="2.4" rx="1.2" fill="#fffdf2"/><rect x="${x - 30}" y="3" width="60" height="6" rx="3" fill="#fff8dc" opacity=".25"/>`);
S.hinten(`<rect x="0" y="14.5" width="320" height="${WU - 14.5}" fill="${WAND}"/>`);
/* Holzband oberhalb der Regale */
S.hinten(`<rect x="0" y="20" width="320" height="8" fill="${HOLZ}" opacity=".85"/>`);
/* Der Gang zwischen Kosmetik und Baby — in die Tiefe */
{
  const L = 158, R = 228, fl = 186, fr = 200, ft = 50, fb = 88;
  let g = `<rect x="${L}" y="14.5" width="${R - L}" height="${WU - 14.5}" fill="#efebe4"/>`;
  g += `<path d="M${L} 14.5 L${R} 14.5 L${fr} ${ft - 10} L${fl} ${ft - 10} Z" fill="#f6f4f0"/>`;
  g += `<rect x="${fl - 6}" y="${ft - 8}" width="${fr - fl + 12}" height="3" rx=".6" fill="#fffdf2"/>`;
  /* Rückwand hinten mit Schild */
  g += `<rect x="${fl}" y="${ft - 10}" width="${fr - fl}" height="${fb - ft + 10}" fill="#e3ddd2"/>`;
  g += `<rect x="${fl - 1}" y="${ft - 4}" width="${fr - fl + 2}" height="5" fill="${KOPF}"/><text x="${(fl + fr) / 2}" y="${ft - 0.4}" font-size="2.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Haushalt</text>`;
  /* Gondelseiten links und rechts, voller Ware */
  const seite = (x0, x1, links) => {
    let s = `<path d="M${x0} 34 L${x1} ${ft + 2} L${x1} ${fb} L${x0} ${WU} Z" fill="${links ? "#e9e6e1" : "#dedad3"}"/>`;
    for (let i = 0; i < 5; i++) {
      const t0 = i / 5, t1 = (i + 0.82) / 5;
      const y0a = 34 + (WU - 34) * t0, y0b = 34 + (WU - 34) * t1, y1a = ft + 2 + (fb - ft - 2) * t0, y1b = ft + 2 + (fb - ft - 2) * t1;
      /* Warenband (farbig) */
      for (let j = 0; j < 7; j++) {
        const u0 = j / 7, u1 = (j + 0.9) / 7;
        const xa = x0 + (x1 - x0) * u0, xb = x0 + (x1 - x0) * u1;
        const ya0 = y0a + (y1a - y0a) * u0, yb0 = y0a + (y1a - y0a) * u1, ya1 = y0b + (y1b - y0b) * u0, yb1 = y0b + (y1b - y0b) * u1;
        s += `<path d="M${r(xa)} ${r(ya0 + 1)} L${r(xb)} ${r(yb0 + 1)} L${r(xb)} ${r(yb1)} L${r(xa)} ${r(ya1)} Z" fill="${BUNT[(i * 3 + j + (links ? 0 : 5)) % BUNT.length]}" opacity=".75"/>`;
      }
      s += `<path d="M${x0} ${r(y0b)} L${x1} ${r(y1b)}" stroke="#ffffff" stroke-width=".9"/>`;
    }
    return s;
  };
  g += seite(L, fl, true) + seite(R, fr, false);
  g += `<path d="M${L} ${WU} L${fl} ${fb} L${fr} ${fb} L${R} ${WU} Z" fill="#cfccc6"/>`;
  g += `<path d="M${L} ${WU} L${fl} ${fb} L${fr} ${fb} L${R} ${WU} Z" fill="${S.lg("gangboden", [[0, "#fff", 0.25], [1, "#fff", 0]])}"/>`;
  /* Schild über dem Gang */
  g += `<line x1="${(L + R) / 2 - 12}" y1="14.5" x2="${(L + R) / 2 - 12}" y2="24" stroke="#888" stroke-width=".3"/><line x1="${(L + R) / 2 + 12}" y1="14.5" x2="${(L + R) / 2 + 12}" y2="24" stroke="#888" stroke-width=".3"/>`;
  g += `<rect x="${(L + R) / 2 - 18}" y="24" width="36" height="7" rx="1" fill="${KOPF}"/><text x="${(L + R) / 2}" y="29" font-size="3.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Gang 4 · Haushalt</text>`;
  S.hinten(g);
}
{
  let f = `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("boden", [[0, "#d6d2cb"], [1, "#c3beb5"]])}"/>`;
  for (let i = -8; i <= 8; i++) f += `<line x1="${193 + i * 22}" y1="${WU}" x2="${193 + i * 60}" y2="200" stroke="#a9a397" stroke-width=".3" opacity=".7"/>`;
  for (const y of [WU + 8, WU + 18, WU + 31, WU + 48, WU + 70]) f += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#a9a397" stroke-width=".3" opacity=".6"/>`;
  f += `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("bodenlicht", [[0, "#000", 0.12], [0.35, "#000", 0], [1, "#fff", 0.1]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DAS REGAL „Haare & Körper“ (links) — Lupe
   ===================================================================== */
const RG = { x0: 4, x1: 104, y0: 31, y1: WU };
{
  const W = RG.x1 - RG.x0, H = RG.y1 - RG.y0, cx = (RG.x0 + RG.x1) / 2;
  let k = `<g transform="translate(${-cx} ${-RG.y1})">`;
  k += `<rect x="${RG.x0}" y="${RG.y0}" width="${W}" height="${H}" fill="${REGAL}"/>`;
  k += `<rect x="${RG.x0 + 1.5}" y="${RG.y0 + 8}" width="${W - 3}" height="${H - 13}" fill="${S.lg("rueck", [[0, "#ece9e3"], [1, "#dcd7cf"]])}"/>`;
  k += `<rect x="${RG.x0}" y="${RG.y0}" width="${W}" height="7" fill="${KOPF}"/><text x="${cx}" y="${RG.y0 + 5}" font-size="4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Haare &amp; Körper</text>`;
  const boeden = [56, 76, 96, 113];
  const sp = 3, fw = (W - 3) / sp;
  const zelle = (si) => [RG.x0 + 1.5 + si * fw + 1, RG.x0 + 1.5 + (si + 1) * fw - 1];
  const besonders = {
    "0,0": ["dg_shampoo", "das Shampoo", "Sham-POO", "lo shampoo", "SHAM-poo", "shampoo", null, (a, b, y) => { let g = ""; for (let i = 0; i < 5; i++) g += flasche(a + 0.5 + i * 6, y, 5.2, 15 - (i % 2) * 1.5, ["#2f86c9", "#7cc4e8", "#2f86c9", "#f2b630", "#f2b630"][i]); return g; }],
    "0,1": ["dg_duschgel", "das Duschgel", "DUSCH-gel", "il bagnoschiuma", "ba-gno-SCHIU-ma", "shower gel", null, (a, b, y) => { let g = ""; for (let i = 0; i < 5; i++) { const x = a + 0.5 + i * 6; g += `<path d="M${x} ${y - 1.6} L${x} ${y - 13} Q${x + 2.6} ${y - 14.4} ${x + 5.2} ${y - 13} L${x + 5.2} ${y - 1.6} Z" fill="${["#3aa76d", "#ef7fa8", "#3aa76d", "#9b59b6", "#16a3a3"][i]}" stroke="#0000001f" stroke-width=".12"/><rect x="${x + 0.8}" y="${y - 1.8}" width="3.6" height="1.8" rx=".4" fill="#fff"/><ellipse cx="${x + 2.6}" cy="${y - 8}" rx="1.6" ry="2.4" fill="#fff" opacity=".55"/>`; } return g; }],
    "0,2": ["dg_deo", "das Deo", "DE-o", "il deodorante", "de-o-do-RAN-te", "deodorant", "Deo gibt es als Spray oder als Roller.", (a, b, y) => { let g = ""; for (let i = 0; i < 7; i++) { const x = a + 0.6 + i * 4.3; g += `<rect x="${x}" y="${y - 12}" width="3.6" height="12" rx="1" fill="${RUND("dose" + (i % 3), ["#d9dde1", "#2c3e50", "#e7a9c4"][i % 3], ["#9aa3aa", "#18232e", "#c27a9b"][i % 3])}"/><rect x="${x + 0.3}" y="${y - 14}" width="3" height="2.2" rx=".8" fill="${["#2f86c9", "#e64b3c", "#ffffff"][i % 3]}"/>`; } return g; }],
    "1,0": ["dg_zahnpasta", "die Zahnpasta", "ZAHN-pas-ta", "il dentifricio", "den-ti-FRI-cio", "toothpaste", "Morgens und abends: Zähne putzen mit Zahnpasta!", (a, b, y) => { let g = ""; for (let i = 0; i < 6; i++) { const x = a + 0.5 + i * 5; g += schachtel(x, y, 4.6, 11, ["#e64b3c", "#ffffff", "#2f86c9", "#e64b3c", "#3aa76d", "#ffffff"][i]); g += `<path d="M${x + 1} ${y - 9} q1.3 -1 2.6 0" stroke="${i % 2 ? "#2f86c9" : "#fff"}" stroke-width=".5" fill="none"/>`; } return g; }],
    "1,1": ["dg_zahnbuerste", "die Zahnbürste", "ZAHN-bürs-te", "lo spazzolino", "spaz-zo-LI-no", "toothbrush", null, (a, b, y) => { let g = ""; for (let i = 0; i < 6; i++) { const x = a + 0.6 + i * 5; g += `<rect x="${x}" y="${y - 15}" width="4.4" height="15" rx=".4" fill="#e9f3f8" stroke="#a6bccb" stroke-width=".15"/><rect x="${x + 1.6}" y="${y - 13.4}" width="1.2" height="12" rx=".6" fill="${BUNT[i % 6]}"/><rect x="${x + 1.4}" y="${y - 13.6}" width="1.6" height="3" rx=".3" fill="#fff" stroke="#9fb4c0" stroke-width=".1"/>`; for (let j = 0; j < 4; j++) g += `<line x1="${x + 1.5}" y1="${r(y - 13.2 + j * 0.7)}" x2="${x + 2.9}" y2="${r(y - 13.2 + j * 0.7)}" stroke="#7fb6d9" stroke-width=".35"/>`; } return g; }],
    "1,2": ["dg_seife", "die Seife", "SEI-fe", "il sapone", "sa-PO-ne", "soap", null, (a, b, y) => { let g = ""; for (let i = 0; i < 3; i++) { const x = a + 1 + i * 10; g += `<path d="M${x} ${y} L${x} ${y - 9} Q${x} ${y - 10} ${x + 1} ${y - 10} L${x + 3} ${y - 10} L${x + 3} ${y - 12} L${x + 6} ${y - 12} L${x + 6} ${y - 10.6} L${x + 8} ${y - 10.6} L${x + 8} ${y} Z" fill="${["#f6e3b4", "#cfe8d2", "#f3cfe0"][i]}" stroke="#00000022" stroke-width=".12" opacity=".95"/><rect x="${x + 1.2}" y="${y - 7}" width="5.6" height="3.6" fill="#fff" opacity=".7"/>`; } for (let i = 0; i < 2; i++) g += `<rect x="${r(b - 13 + i * 6.4)}" y="${y - 3}" width="5.8" height="3" rx="1.2" fill="${["#f2dfb0", "#e9b9cf"][i]}" stroke="#00000022" stroke-width=".12"/>`; return g; }],
  };
  const unter = [];
  boeden.slice(0, 3).forEach((yb, ri) => {
    for (let si = 0; si < sp; si++) {
      const [a, b] = zelle(si), be = besonders[ri + "," + si];
      if (be) {
        k += be[7](a, b, yb);
        unter.push({ id: be[0], de: be[1], syl: be[2], it: be[3], itSyl: be[4], en: be[5], tipp: be[6] || undefined, x: (a + b) / 2, y: yb, kunst: flaeche(-(b - a) / 2, -17, b - a, 17.6) });
      } else {
        let x = a;
        while (x < b - 4) { const w = 3.6 + rnd() * 2.4, h = 9 + rnd() * 6; if (x + w > b) break; k += rnd() < 0.7 ? flasche(x, yb, w, h, BUNT[Math.floor(rnd() * BUNT.length)]) : schachtel(x, yb, w, h * 0.8, BUNT[Math.floor(rnd() * BUNT.length)]); x += w + 0.5; }
      }
    }
  });
  /* Reihe 3 und unten: große Flaschen (Bodylotion, Familienpackungen) */
  for (const yb of [96, 113]) { let x = RG.x0 + 3; while (x < RG.x1 - 9) { const w = 6 + rnd() * 2.5, h = (yb === 113 ? 10 : 12.5) + rnd() * 2.5; k += flasche(x, yb, w, h, BUNT[Math.floor(rnd() * BUNT.length)]); x += w + 0.8; } }
  for (const yb of boeden.slice(0, 3)) k += boden(RG.x0 + 1, RG.x1 - 1, yb);
  k += boden(RG.x0 + 1, RG.x1 - 1, 113);
  for (let s = 0; s <= sp; s++) k += `<rect x="${r(RG.x0 + 1.5 + s * fw - 0.6)}" y="${RG.y0 + 7}" width="1.2" height="${H - 7}" fill="#d8d8d4"/>`;
  k += `<rect x="${RG.x0}" y="${RG.y1 - 3}" width="${W}" height="3" fill="#bdbab3"/></g>`;
  S.teil({ id: "dg_regal", de: "das Regal", syl: "Re-GAL", it: "lo scaffale", itSyl: "scaf-FA-le", en: "shelf", x: cx, y: RG.y1, steht: true, kunst: k,
    zoom: { x: RG.x0 - 2, y: RG.y0 - 2, w: W + 4, h: 70 }, unter });
}

/* =====================================================================
   2 — DAS KOSMETIKREGAL (beleuchtetes Make-up-Modul) — Lupe
   ===================================================================== */
const KM = { x0: 108, x1: 156, y0: 31, y1: WU };
{
  const W = KM.x1 - KM.x0, H = KM.y1 - KM.y0, cx = (KM.x0 + KM.x1) / 2;
  let k = `<g transform="translate(${-cx} ${-KM.y1})">`;
  k += `<rect x="${KM.x0}" y="${KM.y0}" width="${W}" height="${H}" fill="${S.lg("kosm", [[0, "#2b2b30"], [1, "#1c1c20"]])}"/>`;
  k += `<rect x="${KM.x0}" y="${KM.y0}" width="${W}" height="7" fill="#111"/><text x="${cx}" y="${KM.y0 + 5}" font-size="4" text-anchor="middle" fill="#f3d9e2" font-family="Georgia,serif" font-style="italic">Make-up</text>`;
  /* Leuchtrahmen */
  k += `<rect x="${KM.x0 + 1.5}" y="${KM.y0 + 7.5}" width="${W - 3}" height="1" fill="#fff8e6"/>`;
  const unter = [];
  /* Spiegel oben */
  k += `<rect x="${KM.x0 + 9}" y="${KM.y0 + 10}" width="${W - 18}" height="16" rx="1.4" fill="${S.lg("spiegel", [[0, "#dfe9ee"], [0.5, "#f8fbfc"], [1, "#c7d6de"]], 0, 0, 1, 1)}" stroke="#d9c7a0" stroke-width=".7"/>`;
  k += `<path d="M${KM.x0 + 12} ${KM.y0 + 24} L${KM.x0 + 20} ${KM.y0 + 12} L${KM.x0 + 23} ${KM.y0 + 12} L${KM.x0 + 15} ${KM.y0 + 24} Z" fill="#fff" opacity=".6"/>`;
  unter.push({ id: "dg_spiegel", de: "der Spiegel", syl: "SPIE-gel", it: "lo specchio", itSyl: "SPEC-chio", en: "mirror", x: cx, y: KM.y0 + 26, kunst: flaeche(-(W - 18) / 2, -16, W - 18, 16) });
  /* Lippenstifte (Tester mit offener Kappe) */
  const y1 = KM.y0 + 40;
  for (let i = 0; i < 10; i++) {
    const x = KM.x0 + 3 + i * 4.3, f = ["#b0182c", "#e0436b", "#9c2a4a", "#e86a5a", "#c2185b", "#d0505a", "#8e1b2f", "#f08a9b", "#b0182c", "#e0436b"][i];
    k += `<rect x="${x}" y="${y1 - 6}" width="2.6" height="6" rx=".3" fill="${STAHL}"/><rect x="${x + 0.2}" y="${y1 - 7.6}" width="2.2" height="1.8" fill="#d7b65f"/><path d="M${x + 0.4} ${y1 - 7.6} L${x + 0.4} ${y1 - 9.8} L${x + 2.2} ${y1 - 10.8} L${x + 2.2} ${y1 - 7.6} Z" fill="${f}"/>`;
  }
  k += `<rect x="${KM.x0 + 1.5}" y="${y1}" width="${W - 3}" height="1.6" fill="#3a3a40"/>`;
  unter.push({ id: "dg_lippenstift", de: "der Lippenstift", syl: "LIP-pen-stift", it: "il rossetto", itSyl: "ros-SET-to", en: "lipstick", x: cx, y: y1, kunst: flaeche(-W / 2 + 2, -13, W - 4, 13.4) });
  /* Nagellack in Reihen */
  const y2 = KM.y0 + 56;
  for (let j = 0; j < 2; j++) for (let i = 0; i < 9; i++) {
    const x = KM.x0 + 3.6 + i * 4.8 + j * 2.4, y = y2 - j * 6.6, f = ["#c0392b", "#e84393", "#6c5ce7", "#00a8a8", "#fdcb6e", "#2d3436", "#fab1a0", "#e17055", "#a29bfe"][(i + j * 4) % 9];
    if (x > KM.x1 - 4) continue;
    k += `<rect x="${x}" y="${y - 4}" width="3.4" height="4" rx=".8" fill="${f}"/><rect x="${x + 0.9}" y="${y - 6.6}" width="1.6" height="2.6" rx=".3" fill="#222"/><rect x="${x + 0.4}" y="${y - 3.6}" width=".6" height="3" fill="#fff" opacity=".5"/>`;
  }
  k += `<rect x="${KM.x0 + 1.5}" y="${y2}" width="${W - 3}" height="1.6" fill="#3a3a40"/>`;
  unter.push({ id: "dg_nagellack", de: "der Nagellack", syl: "NA-gel-lack", it: "lo smalto", itSyl: "SMAL-to", en: "nail polish", x: cx, y: y2, kunst: flaeche(-W / 2 + 2, -13.6, W - 4, 14) });
  /* Wimperntusche */
  const y3 = KM.y0 + 72;
  for (let i = 0; i < 9; i++) {
    const x = KM.x0 + 3.4 + i * 4.8;
    k += `<rect x="${x}" y="${y3 - 12}" width="2.4" height="12" rx="1.2" fill="${RUND("masc" + (i % 2), i % 2 ? "#3b2a4d" : "#1f1f22", i % 2 ? "#20142c" : "#000")}"/><rect x="${x}" y="${y3 - 5.6}" width="2.4" height=".6" fill="#c9a24a"/>`;
  }
  k += `<rect x="${KM.x0 + 1.5}" y="${y3}" width="${W - 3}" height="1.6" fill="#3a3a40"/>`;
  unter.push({ id: "dg_wimperntusche", de: "die Wimperntusche", syl: "WIM-pern-tu-sche", it: "il mascara", itSyl: "ma-SCA-ra", en: "mascara", x: cx, y: y3, kunst: flaeche(-W / 2 + 2, -13.6, W - 4, 14) });
  /* unten: Puderdosen und Schubladen */
  for (let i = 0; i < 6; i++) k += `<ellipse cx="${KM.x0 + 6 + i * 7.4}" cy="${KM.y0 + 80}" rx="3.2" ry="1.3" fill="${["#e8c3a8", "#d4a582", "#f1d3bd", "#c38d6b", "#e8c3a8", "#b07a59"][i]}" stroke="#555" stroke-width=".15"/>`;
  k += `<rect x="${KM.x0}" y="${KM.y1 - 4}" width="${W}" height="4" fill="#111"/>`;
  for (const x of [KM.x0 + 0.3, KM.x1 - 1.1]) k += `<rect x="${x}" y="${KM.y0 + 7}" width=".8" height="${H - 11}" fill="#fff6dd" opacity=".9"/>`;
  k += `</g>`;
  S.teil({ id: "dg_kosmetikregal", de: "das Kosmetikregal", syl: "Kos-ME-tik-re-gal", it: "lo scaffale dei cosmetici", itSyl: "scaf-FA-le dei co-SME-ti-ci", en: "make-up stand", x: cx, y: KM.y1, steht: true, kunst: k,
    zoom: { x: KM.x0 - 16, y: KM.y0 - 2, w: W + 32, h: 58 }, unter,
    tipp: "Am Kosmetikregal darf man die Farben mit den Testern ausprobieren." });
}

/* =====================================================================
   3 — DAS BABYREGAL (rechts) — Lupe
   ===================================================================== */
const BR = { x0: 230, x1: 316, y0: 31, y1: WU };
{
  const W = BR.x1 - BR.x0, H = BR.y1 - BR.y0, cx = (BR.x0 + BR.x1) / 2;
  let k = `<g transform="translate(${-cx} ${-BR.y1})">`;
  k += `<rect x="${BR.x0}" y="${BR.y0}" width="${W}" height="${H}" fill="${REGAL}"/>`;
  k += `<rect x="${BR.x0 + 1.5}" y="${BR.y0 + 8}" width="${W - 3}" height="${H - 13}" fill="${S.lg("babyr", [[0, "#eef6fb"], [1, "#dfeaf2"]])}"/>`;
  k += `<rect x="${BR.x0}" y="${BR.y0}" width="${W}" height="7" fill="#7cb9de"/><text x="${cx}" y="${BR.y0 + 5}" font-size="4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Baby &amp; Kind</text>`;
  const unter = [];
  /* Reihe 1: Gläschen mit Babybrei (links), Schnuller an Haken (rechts) */
  const y1 = 54;
  for (let i = 0; i < 9; i++) {
    const x = BR.x0 + 3 + i * 5;
    k += `<rect x="${x}" y="${y1 - 7}" width="4.2" height="7" rx="1" fill="${["#f4a259", "#e9c46a", "#f28482", "#90be6d", "#f4a259", "#e9c46a", "#f28482", "#90be6d", "#f4a259"][i]}" opacity=".9"/><rect x="${x - 0.1}" y="${y1 - 8.6}" width="4.4" height="1.8" rx=".4" fill="${STAHL}"/><rect x="${x + 0.4}" y="${y1 - 5.6}" width="3.4" height="2.6" fill="#fff" opacity=".85"/><rect x="${x + 0.5}" y="${y1 - 6.6}" width=".6" height="5.6" fill="#fff" opacity=".45"/>`;
  }
  unter.push({ id: "dg_babybrei", de: "der Babybrei", syl: "BA-by-brei", it: "la pappa", itSyl: "PAP-pa", en: "baby food", x: BR.x0 + 25, y: y1, kunst: flaeche(-23, -11, 46, 11.6) });
  for (let i = 0; i < 4; i++) {
    const x = BR.x0 + 54 + i * 7.6;
    k += `<line x1="${x + 3}" y1="${y1 - 15}" x2="${x + 3}" y2="${y1 - 12}" stroke="#9aa0a6" stroke-width=".4"/><rect x="${x}" y="${y1 - 13}" width="6.4" height="11" rx=".6" fill="#ffffff" stroke="#b9c7d1" stroke-width=".2"/><circle cx="${x + 3.2}" cy="${y1 - 11.6}" r=".6" fill="#ccc"/>`;
    k += `<ellipse cx="${x + 3.2}" cy="${y1 - 6.6}" rx="2.4" ry="1.7" fill="${["#7cb9de", "#f6a5c0", "#9fd8b0", "#f9d56e"][i]}"/><circle cx="${x + 3.2}" cy="${y1 - 6.6}" r=".9" fill="#fff" opacity=".7"/><circle cx="${x + 3.2}" cy="${y1 - 4}" r="1" fill="none" stroke="${["#7cb9de", "#f6a5c0", "#9fd8b0", "#f9d56e"][i]}" stroke-width=".5"/>`;
  }
  unter.push({ id: "dg_schnuller", de: "der Schnuller", syl: "SCHNUL-ler", it: "il ciuccio", itSyl: "CIUC-cio", en: "dummy", x: BR.x0 + 68, y: y1, kunst: flaeche(-15, -15, 30, 15.6) });
  /* Reihe 2: Feuchttücher */
  const y2 = 74;
  for (let i = 0; i < 6; i++) {
    const x = BR.x0 + 3 + i * 13.4;
    k += `<rect x="${x}" y="${y2 - 9}" width="12.6" height="9" rx="2.4" fill="${S.lg("feucht", [[0, "#ffffff"], [1, "#d8e8f2"]])}" stroke="#a9c3d4" stroke-width=".15"/><rect x="${x + 3}" y="${y2 - 8.6}" width="6.6" height="2.4" rx=".8" fill="${i % 2 ? "#7cb9de" : "#9fd8b0"}"/><text x="${x + 6.3}" y="${y2 - 2.6}" font-size="1.7" text-anchor="middle" fill="#3b6e8f" font-family="Arial">sensitive</text>`;
  }
  unter.push({ id: "dg_feuchttuecher", de: "die Feuchttücher", syl: "FEUCHT-tü-cher", it: "le salviette umidificate", itSyl: "sal-VIET-te u-mi-di-fi-CA-te", en: "baby wipes", x: cx, y: y2, kunst: flaeche(-W / 2 + 3, -12, W - 6, 12.6) });
  /* Reihe 3 und unten: Windelpakete */
  for (const [yb, hh] of [[94, 15], [113, 15]]) {
    for (let i = 0; i < 5; i++) {
      const x = BR.x0 + 2.4 + i * 16.6;
      k += `<rect x="${x}" y="${yb - hh}" width="15.8" height="${hh}" rx="1.6" fill="${S.lg("windel" + (i % 2), i % 2 ? [[0, "#ffd9e6"], [1, "#f4b6cb"]] : [[0, "#d8ecfa"], [1, "#a9d1ee"]], 0, 0, 1, 0)}" stroke="#8fb5cf" stroke-width=".15"/>`;
      k += `<circle cx="${x + 8}" cy="${yb - hh * 0.55}" r="3.4" fill="#fff" opacity=".85"/><circle cx="${x + 7}" cy="${yb - hh * 0.6}" r=".45" fill="#333"/><circle cx="${x + 9}" cy="${yb - hh * 0.6}" r=".45" fill="#333"/><path d="M${x + 6.8} ${yb - hh * 0.45} q1.2 .9 2.4 0" stroke="#333" stroke-width=".3" fill="none"/>`;
      k += `<text x="${x + 8}" y="${yb - 2}" font-size="2.2" text-anchor="middle" fill="#2c5d80" font-family="Arial" font-weight="bold">Gr. ${3 + (i % 3)}</text>`;
    }
  }
  unter.push({ id: "dg_windel", de: "die Windel", syl: "WIN-del", it: "il pannolino", itSyl: "pan-no-LI-no", en: "nappy", x: BR.x0 + 24, y: 94, kunst: flaeche(-22, -15, 44, 15.6),
    tipp: "Windeln gibt es in Größen — je nachdem, wie groß das Baby ist." });
  for (const yb of [54, 74, 94]) k += boden(BR.x0 + 1, BR.x1 - 1, yb);
  k += boden(BR.x0 + 1, BR.x1 - 1, 113);
  k += `<rect x="${BR.x0}" y="${BR.y1 - 3}" width="${W}" height="3" fill="#bdbab3"/></g>`;
  S.teil({ id: "dg_babyregal", de: "das Babyregal", syl: "BA-by-re-gal", it: "lo scaffale per bebè", itSyl: "scaf-FA-le per be-BÈ", en: "baby shelf", x: cx, y: BR.y1, steht: true, kunst: k,
    zoom: { x: BR.x0 - 4, y: BR.y0 - 2, w: W + 8, h: 66 }, unter });
}

/* =====================================================================
   4 — DIE VERKÄUFERIN (hinter der Kasse)
   ===================================================================== */
{
  const m = B.mensch({ id: "dg_verk", geschlecht: "w", pose: "stehen", blick: 40, frisur: "dutt", haarfarbe: "schwarz", haut: "oliv", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#2f4f7a" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "turnschuh" } } }, 84);
  const badge = `<rect x="-7" y="-58" width="5" height="1.8" rx=".3" fill="#fff"/>`;
  S.teil({ id: "dg_verkaeuferin", de: "die Verkäuferin", syl: "Ver-KÄU-fe-rin", it: "la commessa", itSyl: "com-MES-sa", en: "shop assistant", x: 214, y: 170, kunst: m.svg + badge,
    tipp: "Die Verkäuferin fragt: „Möchten Sie den Kassenbon?“" });
}

/* =====================================================================
   5 — DIE KASSE mit Kassenband (vorne)
   ===================================================================== */
const KT = { x0: 148, x1: 270, y0: 132, y1: 180 };
{
  const cx = (KT.x0 + KT.x1) / 2, W = KT.x1 - KT.x0, hT = KT.y1 - KT.y0;
  let k = `<path d="M${-W / 2 - 1.5} ${-hT} L${W / 2 + 1.5} ${-hT} L${W / 2 + 2} ${-hT + 4} L${-W / 2 - 2} ${-hT + 4} Z" fill="${S.lg("kplatte", [[0, "#d9d6d0"], [1, "#bdb8b0"]])}"/>`;
  /* Band (schwarz, mit Glanz) rechts, Packtisch links */
  k += `<path d="M${r(KT.x0 + 64 - cx)} ${-hT + 0.4} L${W / 2 - 1} ${-hT + 0.4} L${W / 2 - 0.6} ${-hT + 3.6} L${r(KT.x0 + 63.4 - cx)} ${-hT + 3.6} Z" fill="${S.lg("band", [[0, "#3a3a3e"], [1, "#1c1c1f"]])}"/>`;
  for (let x = KT.x0 + 68; x < KT.x1 - 2; x += 6) k += `<line x1="${r(x - cx)}" y1="${-hT + 0.6}" x2="${r(x - cx - 0.4)}" y2="${-hT + 3.4}" stroke="#55555b" stroke-width=".25"/>`;
  k += `<rect x="${r(KT.x0 + 62 - cx)}" y="${-hT - 1.6}" width="1.4" height="5.2" rx=".4" fill="#d0d4d8"/>`;
  /* Front: Holz mit weißem Sockel */
  k += `<rect x="${-W / 2}" y="${-hT + 4}" width="${W}" height="${hT - 8}" fill="${HOLZ}"/>`;
  for (let x = -W / 2 + 3; x < W / 2; x += 4) k += `<rect x="${r(x)}" y="${-hT + 5}" width=".4" height="${hT - 10}" fill="#b08a5c" opacity=".4"/>`;
  k += `<rect x="${-W / 2}" y="${-hT + 4}" width="${W}" height="1.5" fill="#fff" opacity=".35"/><rect x="${-W / 2}" y="-4" width="${W}" height="4" fill="#5b5650"/>`;
  /* Kassenregal mit Kleinkram an der Front (Kaugummi, Lippenpflege) */
  k += `<rect x="${r(KT.x0 + 70 - cx)}" y="${-hT + 10}" width="44" height="22" rx="1" fill="#f7f6f3" stroke="#cfcac2" stroke-width=".25"/>`;
  for (let j = 0; j < 3; j++) for (let i = 0; i < 10; i++) k += `<rect x="${r(KT.x0 + 71.6 - cx + i * 4.2)}" y="${-hT + 12 + j * 7}" width="3.4" height="5" rx=".4" fill="${BUNT[(i + j * 3) % BUNT.length]}" stroke="#0000001f" stroke-width=".1"/>`;
  for (let j = 1; j < 4; j++) k += `<rect x="${r(KT.x0 + 70 - cx)}" y="${-hT + 10 + j * 7}" width="44" height=".8" fill="#d9d4cc"/>`;
  S.teil({ id: "dg_kassenband", de: "das Kassenband", syl: "KAS-sen-band", it: "il nastro della cassa", itSyl: "NA-stro del-la CAS-sa", en: "checkout belt", x: cx, y: KT.y1, steht: true, kunst: k,
    tipp: "Auf das Kassenband legt man die Waren, dann fährt das Band zur Kasse." });
}
const PL = KT.y0 + 2.4;
{
  /* DIE KASSE — Kassenbildschirm, Kundendisplay, Scanner, Kartenterminal */
  let k = schatten(0, .3, 14, 1.2, .3);
  k += `<rect x="-13" y="-1.6" width="20" height="1.6" fill="#2b2b2e"/><rect x="-12" y="-1.4" width="12" height="1.2" fill="#6aa5c8" opacity=".55"/>`;
  k += `<rect x="-2" y="-11" width="2" height="9.4" fill="#3a3f44"/><path d="M-12 -21 L5 -19.6 L5 -10 L-12 -10.6 Z" fill="#1d2125"/><path d="M-11 -20 L4 -18.7 L4 -11 L-11 -11.5 Z" fill="${S.lg("ksch", [[0, "#dfeaf3"], [1, "#b9cfe0"]])}"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M-10 ${-17.8 + i * 1.5} L3 ${-16.8 + i * 1.5}" stroke="#4d6a85" stroke-width=".35"/>`;
  k += `<path d="M-11 -20 L-6 -19.6 L-11 -14 Z" fill="#fff" opacity=".2"/>`;
  /* Kundendisplay zur Kundschaft */
  k += `<rect x="6" y="-15" width="1" height="13.4" fill="#3a3f44"/><rect x="4" y="-19.4" width="9" height="5" rx=".4" fill="#111"/><text x="8.5" y="-16" font-size="2.3" text-anchor="middle" fill="#7cff8a" font-family="monospace">12,85</text>`;
  /* Kartenterminal */
  k += `<path d="M10 0 L16 0 L15.6 -3 L10.4 -3 Z" fill="#2a2e33"/><rect x="10.6" y="-8" width="4.8" height="5.2" rx=".5" fill="#33393f"/><rect x="11.2" y="-7.4" width="3.6" height="1.6" fill="#9cd3e8"/>`;
  S.teil({ id: "dg_kasse_dg", de: "die Kasse", syl: "KAS-se", it: "la cassa", itSyl: "CAS-sa", en: "checkout", x: 200, y: PL, steht: true, kunst: k });
}
{
  /* DER KASSENBON — aus dem Bondrucker */
  let k = `<rect x="-4" y="-4.6" width="8" height="4.6" rx=".8" fill="#2f3438"/><path d="M-3 -4.6 L3 -4.6 L3.4 -14 L-2.6 -14.4 Z" fill="#fbfbf8" stroke="#d2d2cc" stroke-width=".15"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M-2 ${-13 + i * 1.4} L${i % 2 ? 1.2 : 2.2} ${-13 + i * 1.4}" stroke="#8a8a8a" stroke-width=".22"/>`;
  k += `<path d="M-2 -5.6 L2.4 -5.6" stroke="#333" stroke-width=".4"/>`;
  S.teil({ oben: true, id: "dg_kassenbon", de: "der Kassenbon", syl: "KAS-sen-bon", it: "lo scontrino", itSyl: "scon-TRI-no", en: "receipt", x: 176, y: PL, steht: true, kunst: k });
}
{
  /* DAS TASCHENTUCH — offene Packung auf dem Band, ein Tuch schaut heraus */
  let k = schatten(0, .2, 5, .7, .25);
  k += `<rect x="-5" y="-4.6" width="10" height="4.6" rx="1.4" fill="${S.lg("tt", [[0, "#ffffff"], [1, "#d9e7f0"]])}" stroke="#9fb9cb" stroke-width=".2"/><rect x="-3.4" y="-3.2" width="6.8" height="1.8" rx=".5" fill="#2f86c9"/>`;
  k += `<path d="M-1.6 -4.4 Q-2.6 -8.6 0 -9 Q2.8 -8.6 1.6 -4.4 Z" fill="#ffffff" stroke="#c9d6df" stroke-width=".15"/>`;
  S.teil({ oben: true, id: "dg_taschentuch", de: "das Taschentuch", syl: "TA-schen-tuch", it: "il fazzoletto", itSyl: "faz-zo-LET-to", en: "tissue", x: 236, y: PL, steht: true, kunst: k });
}
{
  /* DER EINKAUFSKORB — roter Plastikkorb am Ende des Bandes */
  let k = schatten(0, .3, 10, 1, .3);
  k += `<path d="M-9 -9 L9 -9 L7.6 0 L-7.6 0 Z" fill="${S.lg("korb", [[0, "#e23a3a"], [1, "#a81d1d"]])}"/>`;
  for (let i = 0; i < 7; i++) k += `<rect x="${r(-7.4 + i * 2.2)}" y="-7.6" width="1.2" height="5.6" rx=".4" fill="#7d1010" opacity=".75"/>`;
  k += `<rect x="-9.4" y="-9.6" width="18.8" height="1.6" rx=".6" fill="#ef5050"/>`;
  /* Ware im Korb */
  k += flasche(-6, -9, 3.6, 7, "#3aa76d") + schachtel(-1.6, -9, 4, 5, "#f2b630") + flasche(3, -9, 3.4, 6, "#ef7fa8");
  k += `<path d="M-8 -9.6 Q-6 -16 0 -16 Q6 -16 8 -9.6" stroke="#2b2b2e" stroke-width=".9" fill="none"/>`;
  S.teil({ oben: true, id: "dg_einkaufskorb", de: "der Einkaufskorb", syl: "EIN-kaufs-korb", it: "il cestino della spesa", itSyl: "ce-STI-no della SPE-sa", en: "shopping basket", x: 256, y: PL, steht: true, kunst: k });
}

/* =====================================================================
   6 — DAS WASCHMITTEL auf der Aktionspalette, DAS PREISSCHILD
   ===================================================================== */
{
  let k = schatten(0, .4, 34, 1.8, .3);
  /* Europalette */
  k += `<rect x="-30" y="-5" width="60" height="5" fill="${S.lg("palette", [[0, "#d9b98a"], [1, "#b38d5d"]])}"/>`;
  for (const x of [-29, -2, 25]) k += `<rect x="${x}" y="-3.6" width="4" height="3.6" fill="#8a6a42"/>`;
  k += `<rect x="-30" y="-5" width="60" height="1" fill="#e7cfa6"/>`;
  /* Kartontray und Waren: unten Pulverkartons, oben Flaschen mit Griff */
  k += `<rect x="-29" y="-26" width="58" height="21" fill="${S.lg("tray", [[0, "#c9a36e"], [1, "#a8814c"]])}"/>`;
  for (let i = 0; i < 6; i++) {
    const x = -28 + i * 9.6;
    k += `<rect x="${x}" y="-25" width="9" height="19" rx=".4" fill="${i % 2 ? "#f39237" : "#2f86c9"}" stroke="#00000026" stroke-width=".15"/><rect x="${x + 1}" y="-21" width="7" height="6" rx="1" fill="#fff" opacity=".85"/><circle cx="${x + 4.5}" cy="-18" r="2.1" fill="${i % 2 ? "#e64b3c" : "#16a3a3"}"/><text x="${x + 4.5}" y="-9" font-size="2" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">40 WL</text>`;
  }
  k += `<rect x="-29" y="-27.4" width="58" height="1.6" fill="#ddd2bf"/>`;
  for (let i = 0; i < 6; i++) {
    const x = -27.6 + i * 9.6;
    k += `<path d="M${x} -27.4 L${x} -39 Q${x} -41 ${x + 2} -41 L${x + 5} -41 L${x + 5} -43 L${x + 7.6} -43 L${x + 7.6} -40 Q${x + 8.4} -39 ${x + 8.4} -37 L${x + 8.4} -27.4 Z" fill="${S.lg("fl" + (i % 3), [[0, ["#3fa9f5", "#7ac36a", "#b38be0"][i % 3]], [1, ["#1f6fb5", "#3f8f3a", "#7a52b3"][i % 3]]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${x + 5.6} -40 L${x + 5.6} -35.6 Q${x + 7.6} -36 ${x + 7.6} -38" stroke="#ffffff" stroke-width=".5" fill="none" opacity=".6"/><rect x="${x + 1.2}" y="-36" width="5.6" height="5" rx=".6" fill="#fff" opacity=".85"/><rect x="${x + 5.1}" y="-44.2" width="3" height="1.4" rx=".4" fill="#fff"/>`;
  }
  S.teil({ id: "dg_waschmittel", de: "das Waschmittel", syl: "WASCH-mit-tel", it: "il detersivo", itSyl: "de-ter-SI-vo", en: "detergent", x: 38, y: 196, steht: true, kunst: k,
    tipp: "Aktionsware steht oft auf einer Palette mitten im Gang." });
}
{
  let k = `<rect x="-.5" y="0" width="1" height="8" fill="#9aa0a6"/>`;
  k += `<rect x="-11" y="-12" width="22" height="13" rx="1.2" fill="${S.lg("preis", [[0, "#ffe14d"], [1, "#f6c700"]])}" stroke="#c99f00" stroke-width=".3"/>`;
  k += `<text x="0" y="-8" font-size="3" text-anchor="middle" fill="#c2181e" font-family="Arial" font-weight="bold">AKTION</text>`;
  k += `<text x="0" y="-1.8" font-size="6.4" text-anchor="middle" fill="#c2181e" font-family="Arial Black,Arial" font-weight="bold">3,95 €</text>`;
  S.teil({ id: "dg_preisschild_dg", de: "das Preisschild", syl: "PREIS-schild", it: "il cartellino del prezzo", itSyl: "car-tel-LI-no del PREZ-zo", en: "price tag", x: 52, y: 144, kunst: k });
}

/* =====================================================================
   7 — DIE KUNDIN (vorne rechts, am Ende des Kassenbands)
   ===================================================================== */
{
  const m = B.mensch({ id: "dg_kundin", geschlecht: "w", pose: "stehen", blick: -55, frisur: "lang", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "creme" }, jacke: { stueck: "mantel", farbe: "beige" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, 100);
  S.teil({ id: "dg_kundin_dg", de: "die Kundin", syl: "KUN-din", it: "la cliente", itSyl: "cli-EN-te", en: "customer", x: 292, y: 197, kunst: m.svg,
    tipp: "Die Kundin bezahlt mit Karte." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/drogerie.js"));
console.log(aus);
