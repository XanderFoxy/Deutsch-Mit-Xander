#!/usr/bin/env node
/* =====================================================================
   OBST & GEMÜSE (FASSUNG 852) — Bilderwelt neu: die Obst- und
   Gemüseabteilung eines Supermarkts.
   ---------------------------------------------------------------------
   RECHERCHE (Lebensmittelpraxis-Markttest Frischeabteilung, Mettler
   Toledo „Retail Obst & Gemüse“, Red Dot: Selbstbedienungswaage mit
   Standsäule; Verbraucherartikel zum Wiegen):
   - Am Eingang die Obst- und Gemüseabteilung: WANDREGALE mit schräg
     gestellten Holzsteigen, damit die Ware nach vorne zeigt; an jeder
     Steige ein Preisschild mit Sorte, Herkunft und Klasse.
   - Salat, Kohl, Lauch, Spargel, Radieschen liegen im gekühlten
     GEMÜSEREGAL mit Sprühnebel (hält sie frisch).
   - In der Mitte ein AUSLAGETISCH mit Kisten in zwei Stufen
     (Kartoffeln, Zwiebeln, Möhren, Knoblauch …).
   - Bananen hängen am BANANENSTÄNDER (sie bekommen sonst Druckstellen).
   - Großware vorne in Kisten bzw. Großkartons: Kürbis, Ananas,
     Wassermelone (eine halbe unter Folie).
   - Die SELBSTBEDIENUNGSWAAGE auf einer Standsäule: Ware in den
     Knotenbeutel, auflegen, Bild der Sorte antippen, Etikett aufkleben.
   Maßstab: Rückwand ≈ 40 Einheiten je Meter (Regale 1,8 m),
   Bananenständer (y 146) ≈ 46 je Meter, vorne (y 194) ≈ 57 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "obstgemuese", titel: "Obst & Gemüse", emoji: "🥕", thema: "Essen & Trinken", kuerzel: "og", fassung: 852 });
const rnd = zufall(2024);
const r = B.r;
{ const lg = S.lg, rg = S.rg, c = {}; S.lg = (n, ...a) => c[n] || (c[n] = lg(n, ...a)); S.rg = (n, ...a) => c["r" + n] || (c["r" + n] = rg(n, ...a)); }

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const HOLZ = S.lg("holz", [[0, "#d7b07a"], [1, "#b48654"]]);
const HOLZ_D = S.lg("holzd", [[0, "#8a5a30"], [1, "#6a4220"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const VPY = -60, WAND_UNTEN = 118;
const mass = (y) => 40 * (y - VPY) / (WAND_UNTEN - VPY);

/* ---------- Früchte und Gemüse: je eine Zeichenfunktion (Mitte x, Fuß y, Maßstab s) */
const RG = (n, a, b, c) => S.rg(n, [[0, a], [0.6, b], [1, c]], 0.38, 0.32, 0.75);
const F = {
  apfel: (x, y, s, i) => `<circle cx="${r(x)}" cy="${r(y - 1.6 * s)}" r="${r(1.7 * s)}" fill="${i % 3 ? RG("apfel", "#f0583a", "#c81e1e", "#7e0f12") : RG("apfel2", "#f6c24a", "#d8452a", "#8e2a12")}"/><path d="M${r(x)} ${r(y - 3 * s)} l${r(0.2 * s)} ${r(-0.7 * s)}" stroke="#4a2a12" stroke-width="${r(0.25 * s)}"/><ellipse cx="${r(x - 0.6 * s)}" cy="${r(y - 2.3 * s)}" rx="${r(0.5 * s)}" ry="${r(0.3 * s)}" fill="#fff" opacity=".45"/>`,
  birne: (x, y, s) => `<path d="M${r(x)} ${r(y - 4 * s)} C${r(x - 0.9 * s)} ${r(y - 4 * s)} ${r(x - 0.8 * s)} ${r(y - 2.6 * s)} ${r(x - 1.5 * s)} ${r(y - 1.6 * s)} C${r(x - 2.2 * s)} ${r(y - 0.4 * s)} ${r(x - 1 * s)} ${r(y)} ${r(x)} ${r(y)} C${r(x + 1 * s)} ${r(y)} ${r(x + 2.2 * s)} ${r(y - 0.4 * s)} ${r(x + 1.5 * s)} ${r(y - 1.6 * s)} C${r(x + 0.8 * s)} ${r(y - 2.6 * s)} ${r(x + 0.9 * s)} ${r(y - 4 * s)} ${r(x)} ${r(y - 4 * s)} Z" fill="${RG("birne", "#e9e27a", "#b9c24a", "#7a8a2a")}"/><path d="M${r(x)} ${r(y - 4 * s)} l${r(0.3 * s)} ${r(-0.7 * s)}" stroke="#4a2a12" stroke-width="${r(0.25 * s)}"/>`,
  orange: (x, y, s) => `<circle cx="${r(x)}" cy="${r(y - 1.6 * s)}" r="${r(1.7 * s)}" fill="${RG("orange", "#ffc35a", "#f58a12", "#b85a08")}"/><circle cx="${r(x + 0.3 * s)}" cy="${r(y - 1.2 * s)}" r="${r(0.18 * s)}" fill="#c96a10"/><ellipse cx="${r(x - 0.6 * s)}" cy="${r(y - 2.3 * s)}" rx="${r(0.5 * s)}" ry="${r(0.3 * s)}" fill="#fff" opacity=".35"/>`,
  zitrone: (x, y, s) => `<path d="M${r(x - 2.1 * s)} ${r(y - 1.3 * s)} Q${r(x - 1.6 * s)} ${r(y - 2.8 * s)} ${r(x)} ${r(y - 2.8 * s)} Q${r(x + 1.6 * s)} ${r(y - 2.8 * s)} ${r(x + 2.1 * s)} ${r(y - 1.3 * s)} Q${r(x + 1.6 * s)} ${r(y + 0.1 * s)} ${r(x)} ${r(y)} Q${r(x - 1.6 * s)} ${r(y + 0.1 * s)} ${r(x - 2.1 * s)} ${r(y - 1.3 * s)} Z" fill="${RG("zitrone", "#fff38a", "#f2d21a", "#b89a0a")}"/>`,
  pfirsich: (x, y, s) => `<circle cx="${r(x)}" cy="${r(y - 1.6 * s)}" r="${r(1.7 * s)}" fill="${RG("pfirsich", "#ffd08a", "#f28a4a", "#c03a2a")}"/><path d="M${r(x - 0.2 * s)} ${r(y - 3.2 * s)} q${r(-0.6 * s)} ${r(1.4 * s)} 0 ${r(2.8 * s)}" stroke="#c0503a" stroke-width="${r(0.2 * s)}" fill="none"/>`,
  pflaume: (x, y, s) => `<ellipse cx="${r(x)}" cy="${r(y - 1.4 * s)}" rx="${r(1.3 * s)}" ry="${r(1.5 * s)}" fill="${RG("pflaume", "#8a6ab8", "#4a2a6a", "#22102e")}"/><path d="M${r(x + 0.1 * s)} ${r(y - 2.8 * s)} q${r(0.4 * s)} ${r(1.4 * s)} 0 ${r(2.6 * s)}" stroke="#2a1440" stroke-width="${r(0.18 * s)}" fill="none"/><ellipse cx="${r(x - 0.4 * s)}" cy="${r(y - 2 * s)}" rx="${r(0.4 * s)}" ry="${r(0.6 * s)}" fill="#c9b8e0" opacity=".35"/>`,
  erdbeere: (x, y, s) => `<path d="M${r(x - 1.3 * s)} ${r(y - 2 * s)} Q${r(x - 1.3 * s)} ${r(y - 0.6 * s)} ${r(x)} ${r(y)} Q${r(x + 1.3 * s)} ${r(y - 0.6 * s)} ${r(x + 1.3 * s)} ${r(y - 2 * s)} Q${r(x)} ${r(y - 2.6 * s)} ${r(x - 1.3 * s)} ${r(y - 2 * s)} Z" fill="${RG("erdbeere", "#ff6a5a", "#e01e2a", "#9a0a14")}"/><path d="M${r(x - 0.9 * s)} ${r(y - 2.1 * s)} l${r(0.5 * s)} ${r(-0.5 * s)} l${r(0.4 * s)} ${r(0.4 * s)} l${r(0.4 * s)} ${r(-0.5 * s)} l${r(0.5 * s)} ${r(0.6 * s)}" fill="#3a9a3a"/>` + [[-0.6, -1.5], [0.4, -1.4], [-0.2, -0.9], [0.6, -0.8]].map(([a, b]) => `<circle cx="${r(x + a * s)}" cy="${r(y + b * s)}" r="${r(0.1 * s)}" fill="#ffe27a"/>`).join(""),
  kirsche: (x, y, s) => `<path d="M${r(x - 0.8 * s)} ${r(y - 1.2 * s)} Q${r(x)} ${r(y - 3.4 * s)} ${r(x + 0.6 * s)} ${r(y - 3.6 * s)} M${r(x + 0.9 * s)} ${r(y - 1.1 * s)} Q${r(x + 0.8 * s)} ${r(y - 3 * s)} ${r(x + 0.6 * s)} ${r(y - 3.6 * s)}" stroke="#5a7a2a" stroke-width="${r(0.18 * s)}" fill="none"/><circle cx="${r(x - 0.8 * s)}" cy="${r(y - 0.8 * s)}" r="${r(0.8 * s)}" fill="${RG("kirsche", "#e0303a", "#9a0a1e", "#4a0410")}"/><circle cx="${r(x + 0.9 * s)}" cy="${r(y - 0.7 * s)}" r="${r(0.8 * s)}" fill="${RG("kirsche", "#e0303a", "#9a0a1e", "#4a0410")}"/>`,
  traube: (x, y, s, i) => { const f = i % 2 ? RG("traubeg", "#e6f2a0", "#a8c24a", "#6a8a1a") : RG("traubeb", "#a07ac8", "#5a2a7a", "#2a1040"); let g = `<path d="M${r(x)} ${r(y - 4.2 * s)} l${r(0.3 * s)} ${r(-0.6 * s)}" stroke="#6a5a2a" stroke-width="${r(0.25 * s)}"/>`; for (const [a, b] of [[-1, -3.4], [0, -3.6], [1, -3.4], [-1.4, -2.5], [-0.5, -2.6], [0.5, -2.6], [1.4, -2.5], [-0.9, -1.6], [0, -1.7], [0.9, -1.6], [-0.4, -0.8], [0.4, -0.8], [0, -0.1]]) g += `<circle cx="${r(x + a * s)}" cy="${r(y + b * s)}" r="${r(0.55 * s)}" fill="${f}"/>`; return g; },
  kartoffel: (x, y, s) => `<ellipse cx="${r(x)}" cy="${r(y - 1.1 * s)}" rx="${r(1.6 * s)}" ry="${r(1.1 * s)}" fill="${RG("kartoffel", "#e9cf9a", "#c9a066", "#8a6a3a")}" transform="rotate(${Math.round(rnd() * 40 - 20)} ${r(x)} ${r(y - 1.1 * s)})"/><circle cx="${r(x + 0.5 * s)}" cy="${r(y - 1.3 * s)}" r="${r(0.12 * s)}" fill="#7a5a2a"/>`,
  zwiebel: (x, y, s) => `<path d="M${r(x)} ${r(y - 3.4 * s)} Q${r(x + 0.5 * s)} ${r(y - 2.4 * s)} ${r(x + 1.6 * s)} ${r(y - 1.4 * s)} Q${r(x + 1.6 * s)} ${r(y)} ${r(x)} ${r(y)} Q${r(x - 1.6 * s)} ${r(y)} ${r(x - 1.6 * s)} ${r(y - 1.4 * s)} Q${r(x - 0.5 * s)} ${r(y - 2.4 * s)} ${r(x)} ${r(y - 3.4 * s)} Z" fill="${RG("zwiebel", "#f2c27a", "#c9822a", "#7a4a12")}"/><path d="M${r(x - 0.6 * s)} ${r(y - 2.2 * s)} Q${r(x)} ${r(y - 0.8 * s)} ${r(x - 0.2 * s)} ${r(y - 0.2 * s)}" stroke="#9a5a1a" stroke-width="${r(0.12 * s)}" fill="none"/>`,
  knoblauch: (x, y, s) => `<path d="M${r(x)} ${r(y - 3 * s)} Q${r(x + 0.4 * s)} ${r(y - 2.2 * s)} ${r(x + 1.4 * s)} ${r(y - 1.4 * s)} Q${r(x + 1.6 * s)} ${r(y)} ${r(x)} ${r(y)} Q${r(x - 1.6 * s)} ${r(y)} ${r(x - 1.4 * s)} ${r(y - 1.4 * s)} Q${r(x - 0.4 * s)} ${r(y - 2.2 * s)} ${r(x)} ${r(y - 3 * s)} Z" fill="${RG("knobl", "#ffffff", "#ece6dc", "#b9ad9c")}"/><path d="M${r(x - 0.6 * s)} ${r(y - 1.8 * s)} q${r(0.2 * s)} ${r(1 * s)} 0 ${r(1.7 * s)} M${r(x + 0.6 * s)} ${r(y - 1.8 * s)} q${r(-0.2 * s)} ${r(1 * s)} 0 ${r(1.7 * s)}" stroke="#c9b8c8" stroke-width="${r(0.12 * s)}" fill="none"/>`,
  rotebete: (x, y, s) => `<path d="M${r(x - 0.4 * s)} ${r(y - 2.8 * s)} l${r(-0.6 * s)} ${r(-1.8 * s)} M${r(x + 0.3 * s)} ${r(y - 2.8 * s)} l${r(0.5 * s)} ${r(-1.9 * s)}" stroke="#b01e4a" stroke-width="${r(0.3 * s)}"/><circle cx="${r(x)}" cy="${r(y - 1.4 * s)}" r="${r(1.5 * s)}" fill="${RG("bete", "#a0306a", "#6a0a32", "#30041a")}"/><path d="M${r(x)} ${r(y + 0.1 * s)} l${r(0.2 * s)} ${r(0.9 * s)}" stroke="#6a0a32" stroke-width="${r(0.18 * s)}"/>`,
  kohl: (x, y, s) => `<circle cx="${r(x)}" cy="${r(y - 2.6 * s)}" r="${r(2.7 * s)}" fill="${RG("kohl", "#eaf4c8", "#b9d48a", "#7a9a4a")}"/><path d="M${r(x - 2 * s)} ${r(y - 3.6 * s)} Q${r(x)} ${r(y - 1.2 * s)} ${r(x + 2.2 * s)} ${r(y - 3 * s)} M${r(x)} ${r(y - 5 * s)} Q${r(x - 0.6 * s)} ${r(y - 2.6 * s)} ${r(x + 0.4 * s)} ${r(y - 0.4 * s)}" stroke="#e9f4d4" stroke-width="${r(0.18 * s)}" fill="none"/>`,
  moehre: (x, y, s) => `<path d="M${r(x - 0.6 * s)} ${r(y - 4.6 * s)} q${r(-1.2 * s)} ${r(-1.6 * s)} ${r(-0.6 * s)} ${r(-2.6 * s)} M${r(x)} ${r(y - 4.6 * s)} q${r(0.2 * s)} ${r(-1.8 * s)} ${r(1 * s)} ${r(-2.6 * s)}" stroke="#4a9a2a" stroke-width="${r(0.45 * s)}" fill="none"/><path d="M${r(x - 0.8 * s)} ${r(y - 4.6 * s)} L${r(x + 0.8 * s)} ${r(y - 4.6 * s)} L${r(x + 0.1 * s)} ${r(y)} Z" fill="${S.lg("moehre", [[0, "#ffa04a"], [0.5, "#f27a12"], [1, "#c05a08"]], 0, 0, 1, 0)}"/>`,
  erbse: (x, y, s) => `<path d="M${r(x - 2.4 * s)} ${r(y - 1.4 * s)} Q${r(x)} ${r(y - 2.8 * s)} ${r(x + 2.4 * s)} ${r(y - 1.6 * s)} Q${r(x)} ${r(y - 0.2 * s)} ${r(x - 2.4 * s)} ${r(y - 1.4 * s)} Z" fill="${S.lg("schote", [[0, "#9ad25a"], [1, "#4a8a2a"]])}"/>` + [-1.2, -0.2, 0.8].map((a) => `<circle cx="${r(x + a * s)}" cy="${r(y - 1.6 * s)}" r="${r(0.42 * s)}" fill="#b8e27a" opacity=".85"/>`).join(""),
  bohne: (x, y, s) => `<path d="M${r(x - 2.6 * s)} ${r(y - 1 * s)} q${r(1.3 * s)} ${r(-1 * s)} ${r(2.6 * s)} ${r(-0.6 * s)} t${r(2.6 * s)} ${r(-0.4 * s)}" stroke="#4a9a2a" stroke-width="${r(0.6 * s)}" fill="none" stroke-linecap="round"/>`,
  tomate: (x, y, s) => `<circle cx="${r(x)}" cy="${r(y - 1.5 * s)}" r="${r(1.6 * s)}" fill="${RG("tomate", "#ff6a4a", "#e0201a", "#8a0a08")}"/><path d="M${r(x - 0.8 * s)} ${r(y - 3 * s)} l${r(0.8 * s)} ${r(0.3 * s)} l${r(0.8 * s)} ${r(-0.3 * s)} M${r(x)} ${r(y - 3 * s)} l0 ${r(-0.6 * s)}" stroke="#2a7a2a" stroke-width="${r(0.3 * s)}"/><ellipse cx="${r(x - 0.6 * s)}" cy="${r(y - 2.2 * s)}" rx="${r(0.45 * s)}" ry="${r(0.28 * s)}" fill="#fff" opacity=".5"/>`,
  gurke: (x, y, s) => `<rect x="${r(x - 3.6 * s)}" y="${r(y - 1.2 * s)}" width="${r(7.2 * s)}" height="${r(1.2 * s)}" rx="${r(0.6 * s)}" fill="${S.lg("gurke", [[0, "#5aa04a"], [1, "#1f5a1f"]])}"/>` + [-2.4, -0.8, 0.8, 2.4].map((a) => `<circle cx="${r(x + a * s)}" cy="${r(y - 0.8 * s)}" r="${r(0.12 * s)}" fill="#a8d88a"/>`).join(""),
  paprika: (x, y, s, i) => { const f = [RG("pr", "#ff6a4a", "#d8180e", "#7a0806"), RG("pg", "#fff07a", "#f2c40a", "#a87a0a"), RG("pgr", "#8ad25a", "#3a8a1a", "#1a4a0a")][i % 3]; return `<path d="M${r(x - 1.8 * s)} ${r(y - 2.6 * s)} Q${r(x - 2 * s)} ${r(y)} ${r(x - 0.6 * s)} ${r(y)} Q${r(x)} ${r(y - 0.6 * s)} ${r(x + 0.6 * s)} ${r(y)} Q${r(x + 2 * s)} ${r(y)} ${r(x + 1.8 * s)} ${r(y - 2.6 * s)} Q${r(x)} ${r(y - 3.4 * s)} ${r(x - 1.8 * s)} ${r(y - 2.6 * s)} Z" fill="${f}"/><path d="M${r(x)} ${r(y - 3 * s)} l${r(0.2 * s)} ${r(-0.8 * s)}" stroke="#2a6a1a" stroke-width="${r(0.4 * s)}"/>`; },
  brokkoli: (x, y, s) => `<rect x="${r(x - 0.5 * s)}" y="${r(y - 2 * s)}" width="${r(1 * s)}" height="${r(2 * s)}" fill="#8ab85a"/>` + [[-1.4, -2.6], [0, -3.2], [1.4, -2.6], [-0.7, -3.8], [0.7, -3.8]].map(([a, b]) => `<circle cx="${r(x + a * s)}" cy="${r(y + b * s)}" r="${r(1.1 * s)}" fill="${RG("brok", "#6ab04a", "#2f7a2a", "#1a4a1a")}"/>`).join(""),
  blumenkohl: (x, y, s) => `<path d="M${r(x - 3 * s)} ${r(y - 1 * s)} Q${r(x)} ${r(y + 0.6 * s)} ${r(x + 3 * s)} ${r(y - 1 * s)} L${r(x + 2.4 * s)} ${r(y - 3 * s)} L${r(x - 2.4 * s)} ${r(y - 3 * s)} Z" fill="#5a9a3a"/>` + [[-1.2, -2.6], [0, -3], [1.2, -2.6], [-0.6, -3.6], [0.6, -3.6]].map(([a, b]) => `<circle cx="${r(x + a * s)}" cy="${r(y + b * s)}" r="${r(1 * s)}" fill="${RG("bkohl", "#fffbea", "#efe4c4", "#c9b98e")}"/>`).join(""),
  salat: (x, y, s) => `<circle cx="${r(x)}" cy="${r(y - 2.2 * s)}" r="${r(2.4 * s)}" fill="${RG("salat", "#dff7a0", "#8ac84a", "#3a7a2a")}"/><path d="M${r(x - 2.2 * s)} ${r(y - 2 * s)} Q${r(x - 1 * s)} ${r(y - 3.4 * s)} ${r(x)} ${r(y - 2.2 * s)} Q${r(x + 1 * s)} ${r(y - 3.6 * s)} ${r(x + 2.2 * s)} ${r(y - 2 * s)}" stroke="#c9ea8a" stroke-width="${r(0.25 * s)}" fill="none"/><circle cx="${r(x)}" cy="${r(y - 2.4 * s)}" r="${r(0.9 * s)}" fill="#e9f8b8"/>`,
  radieschen: (x, y, s) => `<path d="M${r(x)} ${r(y - 1.6 * s)} q${r(-1 * s)} ${r(-2 * s)} ${r(-1.6 * s)} ${r(-2.8 * s)} M${r(x)} ${r(y - 1.6 * s)} q${r(0.6 * s)} ${r(-2 * s)} ${r(1.4 * s)} ${r(-2.8 * s)}" stroke="#4a9a2a" stroke-width="${r(0.5 * s)}" fill="none"/><circle cx="${r(x)}" cy="${r(y - 0.9 * s)}" r="${r(0.9 * s)}" fill="${RG("radies", "#ff6a8a", "#d81a4a", "#8a0a2a")}"/><path d="M${r(x)} ${r(y)} l0 ${r(0.6 * s)}" stroke="#f2e2e2" stroke-width="${r(0.12 * s)}"/>`,
  pilz: (x, y, s) => `<rect x="${r(x - 0.5 * s)}" y="${r(y - 1.2 * s)}" width="${r(1 * s)}" height="${r(1.2 * s)}" fill="#f2ead8"/><path d="M${r(x - 1.5 * s)} ${r(y - 1.1 * s)} Q${r(x - 1.5 * s)} ${r(y - 2.8 * s)} ${r(x)} ${r(y - 2.8 * s)} Q${r(x + 1.5 * s)} ${r(y - 2.8 * s)} ${r(x + 1.5 * s)} ${r(y - 1.1 * s)} Z" fill="${RG("pilz", "#ffffff", "#ece4d4", "#b9ab90")}"/>`,
  lauch: (x, y, s) => `<rect x="${r(x - 4 * s)}" y="${r(y - 1.1 * s)}" width="${r(4 * s)}" height="${r(1.1 * s)}" rx="${r(0.5 * s)}" fill="#f4f6ea"/><path d="M${r(x)} ${r(y - 1.1 * s)} L${r(x + 4.2 * s)} ${r(y - 1.6 * s)} L${r(x + 4.4 * s)} ${r(y + 0.2 * s)} L${r(x)} ${r(y)} Z" fill="${S.lg("lauch", [[0, "#9ad25a"], [1, "#2a6a2a"]], 0, 0, 1, 0)}"/>`,
  spargel: (x, y, s, i) => { let g = ""; for (let j = -2; j <= 2; j++) g += `<rect x="${r(x + j * 0.55 * s - 0.25 * s)}" y="${r(y - 5 * s)}" width="${r(0.5 * s)}" height="${r(5 * s)}" rx="${r(0.25 * s)}" fill="${i % 2 ? "#f4f0dc" : "#7ab04a"}"/>`; return g + `<rect x="${r(x - 1.5 * s)}" y="${r(y - 2.2 * s)}" width="${r(3 * s)}" height="${r(0.5 * s)}" fill="#3a6ac8"/>`; },
};
/* Ein Haufen in einer schrägen Steige: Reihen von hinten (oben, kleiner) nach vorn */
function haufen(x0, x1, yVorn, yHinten, art, s, abst, reihen) {
  let g = "";
  for (let j = 0; j < reihen; j++) {
    const t = j / Math.max(1, reihen - 1), y = yHinten + (yVorn - yHinten) * t, sk = s * (0.86 + 0.14 * t);
    const n = Math.max(1, Math.floor((x1 - x0) / (abst * sk)));
    const off = (j % 2) * abst * sk / 2;
    for (let i = 0; i < n; i++) {
      const x = x0 + abst * sk * (i + 0.5) + off - abst * sk / 4 + (rnd() - 0.5) * 0.4;
      if (x > x1 - abst * sk * 0.3) continue;
      g += F[art](x, y + (rnd() - 0.5) * 0.4, sk, i + j);
    }
  }
  return g;
}
/* Schräge Holzsteige: hintere Kante hoch, vorne die Steigenwand mit Preisschild */
function steige(x0, x1, yVorn, yHinten, sorte, preis) {
  let g = `<path d="M${r(x0)} ${r(yVorn)} L${r(x0)} ${r(yHinten)} L${r(x1)} ${r(yHinten)} L${r(x1)} ${r(yVorn)} Z" fill="${S.lg("steigeinnen", [[0, "#6a4a2a"], [1, "#9a7448"]])}"/>`;
  return g;
}
function steigeVorn(x0, x1, y, h, sorte, preis, herkunft) {
  let g = `<rect x="${r(x0)}" y="${r(y - h)}" width="${r(x1 - x0)}" height="${r(h)}" fill="${HOLZ}"/>`;
  g += `<line x1="${r(x0)}" y1="${r(y - h / 2)}" x2="${r(x1)}" y2="${r(y - h / 2)}" stroke="#9a7448" stroke-width=".35"/>`;
  g += `<rect x="${r(x0)}" y="${r(y - h)}" width="${r(x1 - x0)}" height=".5" fill="#f2d8a8"/>`;
  g += `<rect x="${r(x0)}" y="${r(y - h)}" width="1.2" height="${r(h)}" fill="#a07a4a"/><rect x="${r(x1 - 1.2)}" y="${r(y - h)}" width="1.2" height="${r(h)}" fill="#a07a4a"/>`;
  if (sorte) {
    const cx = (x0 + x1) / 2;
    g += `<rect x="${r(cx - 7.5)}" y="${r(y - h + 0.4)}" width="15" height="${r(h - 0.8)}" rx=".4" fill="#1f2a24"/>`;
    g += `<text x="${r(cx - 6.6)}" y="${r(y - h + 2.4)}" font-size="1.6" fill="#fff" font-family="Arial" font-weight="bold">${sorte}</text>`;
    g += `<text x="${r(cx + 6.8)}" y="${r(y - 0.8)}" font-size="2.3" text-anchor="end" fill="#f6e27a" font-family="Arial" font-weight="bold">${preis}</text>`;
    if (herkunft) g += `<text x="${r(cx - 6.6)}" y="${r(y - 0.9)}" font-size="1.1" fill="#b9d4c4" font-family="Arial">${herkunft}</text>`;
  }
  return g;
}

/* =====================================================================
   KULISSE — Decke, Wand mit Holzlatten, Schieferboden
   ===================================================================== */
{
  let k = `<rect x="0" y="0" width="320" height="16" fill="${S.lg("decke", [[0, "#2e332f"], [1, "#3c423d"]])}"/>`;
  k += `<rect x="0" y="16" width="320" height="${WAND_UNTEN - 16}" fill="${S.lg("wand", [[0, "#f1ead8"], [1, "#e2d6bc"]])}"/>`;
  /* senkrechte Holzlatten hinter den Regalen */
  for (let x = 0; x < 320; x += 4) k += `<rect x="${x}" y="30" width="3.6" height="${WAND_UNTEN - 30}" fill="${x % 8 ? "#c9a878" : "#c09c6a"}" opacity=".55"/>`;
  k += `<rect x="0" y="16" width="320" height="14" fill="${S.lg("fries", [[0, "#2f5a35"], [1, "#24482a"]])}"/>`;
  k += `<text x="160" y="26" font-size="7" text-anchor="middle" fill="#f6efd8" font-family="Georgia,serif" font-style="italic" letter-spacing=".8">Frisch vom Feld · Obst &amp; Gemüse</text>`;
  /* Boden */
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#5d625e"], [1, "#7a7f7a"]])}"/>`;
  for (let i = -14; i <= 14; i++) k += `<line x1="${160 + i * 14}" y1="${WAND_UNTEN}" x2="${r(160 + i * 14 * 260 / 178)}" y2="200" stroke="#3e423f" stroke-width=".35" opacity=".7"/>`;
  for (let d = 0.4; d < 4; d += 0.4) { const y = VPY + (WAND_UNTEN - VPY) * (1 + d * 0.33); if (y > 200) break; k += `<line x1="0" y1="${r(y)}" x2="320" y2="${r(y)}" stroke="#3e423f" stroke-width=".35" opacity=".6"/>`; }
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.2], [0.5, "#000", 0], [1, "#fff", 0.08]])}"/>`;
  /* Strahler an einer Schiene */
  k += `<rect x="0" y="9" width="320" height="1.4" fill="#1a1d1b"/>`;
  for (const x of [30, 90, 150, 210, 270]) k += `<path d="M${x - 3} 10 L${x + 3} 10 L${x + 4} 15 L${x - 4} 15 Z" fill="#1a1d1b"/><ellipse cx="${x}" cy="15" rx="4" ry="1" fill="#fff4cf"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DAS OBSTREGAL (links, drei Stufen schräger Steigen) — Lupe
   ===================================================================== */
const OR = { x0: 4, x1: 132 };
{
  const W = OR.x1 - OR.x0, cx = (OR.x0 + OR.x1) / 2;
  let k = "";
  /* Gestell: Seitenwangen, Kopf */
  k += `<rect x="${-W / 2}" y="-76" width="${W}" height="8" rx="1" fill="${HOLZ_D}"/>`;
  k += `<text x="0" y="-70.2" font-size="5" text-anchor="middle" fill="#f6efd8" font-family="Georgia,serif" font-weight="bold" letter-spacing="1">OBST</text>`;
  const stufen = [[-50, -64], [-28, -44], [-6, -22]];   // [Vorderkante, Hinterkante] je Stufe
  const spalten = 3, sw = (W - 4) / spalten;
  const belegt = [
    ["zitrone", "orange", "pfirsich"],
    ["apfel", "birne", "pflaume"],
    ["erdbeere", "kirsche", "traube"],
  ];
  const daten = {
    zitrone: ["Zitronen", "1,29 €/St.", "Spanien", 1.5, 3.8, 4], orange: ["Orangen", "2,49 €/kg", "Spanien", 1.5, 3.8, 4], pfirsich: ["Pfirsiche", "2,99 €/kg", "Italien", 1.5, 3.8, 4],
    apfel: ["Äpfel Elstar", "2,29 €/kg", "Deutschland", 1.5, 3.8, 4], birne: ["Birnen", "2,79 €/kg", "Deutschland", 1.4, 3.6, 4], pflaume: ["Pflaumen", "2,49 €/kg", "Deutschland", 1.5, 3, 4],
    erdbeere: ["Erdbeeren", "2,99 €/500 g", "Deutschland", 1.4, 3, 0], kirsche: ["Kirschen", "4,99 €/500 g", "Deutschland", 1.4, 2.8, 0], traube: ["Trauben", "2,99 €/500 g", "Italien", 1.2, 4.4, 0],
  };
  const unter = [];
  stufen.forEach(([vorn, hinten], si) => {
    for (let sp = 0; sp < spalten; sp++) {
      const x0 = -W / 2 + 2 + sp * sw + 0.6, x1 = x0 + sw - 1.2, id = belegt[si][sp], d = daten[id];
      k += steige(x0, x1, vorn - 5, hinten);
      if (d[5]) k += haufen(x0 + 1, x1 - 1, vorn - 4.4, hinten + 3, id, d[3], d[4], d[5]);
      else {
        /* Beeren in Schalen (grüne Kunststoffschalen) */
        for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) {
          const bx = x0 + 2 + i * ((x1 - x0 - 4) / 3) + (j ? 2.4 : 0), by = hinten + 6 + j * 6.6, bw = (x1 - x0 - 4) / 3 - 1;
          k += `<path d="M${r(bx)} ${r(by)} L${r(bx + bw)} ${r(by)} L${r(bx + bw - 0.6)} ${r(by + 3)} L${r(bx + 0.6)} ${r(by + 3)} Z" fill="${id === "traube" ? "#e9eef0" : "#2a8a3a"}"/>`;
          for (let q = 0; q < 3; q++) k += F[id](bx + bw * (q + 0.5) / 3, by + 0.6, id === "traube" ? 0.8 : 1.15, q);
        }
      }
      k += steigeVorn(x0, x1, vorn, 5.4, d[0], d[1], d[2]);
      unter.push({ id, x: cx + (x0 + x1) / 2, y: WAND_UNTEN + vorn, w: x1 - x0, h: vorn - hinten + 2 });
    }
  });
  /* Sockel */
  k += `<rect x="${-W / 2}" y="-6" width="${W}" height="6" fill="${HOLZ_D}"/>`;
  k += `<rect x="${-W / 2 - 1}" y="-76" width="2.4" height="76" fill="${HOLZ_D}"/><rect x="${W / 2 - 1.4}" y="-76" width="2.4" height="76" fill="${HOLZ_D}"/>`;
  const W8 = {
    zitrone: ["die Zitrone", "Zi-TRO-ne", "il limone", "li-MO-ne", "lemon"], orange: ["die Orange", "O-ran-ge", "l'arancia", "a-RAN-cia", "orange"], pfirsich: ["der Pfirsich", "PFIR-sich", "la pesca", "PE-sca", "peach"],
    apfel: ["der Apfel", "AP-fel", "la mela", "ME-la", "apple"], birne: ["die Birne", "BIR-ne", "la pera", "PE-ra", "pear"], pflaume: ["die Pflaume", "PFLAU-me", "la prugna", "PRU-gna", "plum"],
    erdbeere: ["die Erdbeere", "ERD-bee-re", "la fragola", "FRA-go-la", "strawberry"], kirsche: ["die Kirsche", "KIR-sche", "la ciliegia", "ci-LIE-gia", "cherry"], traube: ["die Traube", "TRAU-be", "l'uva", "U-va", "grape"],
  };
  const TIPP = { apfel: "Äpfel aus Deutschland gibt es fast das ganze Jahr — sie lagern kühl bis zum Frühling.", erdbeere: "Erdbeeren werden in kleinen Schalen verkauft, weil sie leicht Druckstellen bekommen." };
  S.teil({ id: "obstregal", de: "das Obstregal", syl: "OBST-re-gal", it: "lo scaffale della frutta", itSyl: "scaf-FA-le del-la FRUT-ta", en: "fruit display", x: cx, y: WAND_UNTEN, steht: true, kunst: k,
    zoom: { x: 0, y: 40, w: 136, h: 80 },
    unter: unter.map((u) => { const [de, syl, it, itSyl, en] = W8[u.id]; return { id: u.id, de, syl, it, itSyl, en, tipp: TIPP[u.id], x: u.x, y: u.y, kunst: flaeche(-u.w / 2, -u.h, u.w, u.h) }; }),
    tipp: "Die Steigen stehen schräg, damit man das Obst von vorne gut sieht." });
}

/* =====================================================================
   2 — DAS GEMÜSEREGAL (rechts, gekühlt, mit Sprühnebel) — Lupe
   ===================================================================== */
const GR = { x0: 196, x1: 316 };
{
  const W = GR.x1 - GR.x0, cx = (GR.x0 + GR.x1) / 2;
  let k = `<rect x="${-W / 2}" y="-80" width="${W}" height="80" fill="${S.lg("kuehlrueck", [[0, "#2f4a3a"], [1, "#22382b"]])}"/>`;
  /* Dach mit Licht und Sprühdüsen */
  k += `<rect x="${-W / 2 - 1}" y="-84" width="${W + 2}" height="8" rx="1" fill="${S.lg("kuehldach", [[0, "#3a6a48"], [1, "#2a4f36"]])}"/>`;
  k += `<text x="0" y="-78.2" font-size="5" text-anchor="middle" fill="#f6efd8" font-family="Georgia,serif" font-weight="bold" letter-spacing="1">GEMÜSE</text>`;
  k += `<rect x="${-W / 2}" y="-76" width="${W}" height="1.4" fill="#fffbe6"/>`;
  for (let x = -W / 2 + 8; x < W / 2; x += 16) k += `<circle cx="${x}" cy="-74.2" r=".7" fill="#cfd6da"/><path d="M${x - 5} -66 L${x} -73.6 L${x + 5} -66 Z" fill="#ffffff" opacity=".1"/>`;
  const stufen = [[-42, -72], [-6, -36]];
  const spalten = 5, sw = (W - 4) / spalten;
  const belegt = [["salat", "lauch", "spargel", "radieschen", "pilz"], ["brokkoli", "blumenkohl", "gurke", "paprika", "tomate"]];
  const daten = {
    salat: ["Kopfsalat", "0,99 €/St.", 2.1, 5, 3], lauch: ["Lauch", "1,49 €/kg", 1.3, 1.6, 9], spargel: ["Spargel", "6,99 €/500 g", 1.4, 4.4, 4], radieschen: ["Radieschen", "0,79 €/Bd.", 1.6, 3, 5], pilz: ["Champignons", "1,99 €/400 g", 1.4, 3.6, 4],
    brokkoli: ["Brokkoli", "1,49 €/St.", 1.6, 4.6, 4], blumenkohl: ["Blumenkohl", "1,99 €/St.", 1.7, 6, 3], gurke: ["Gurken", "0,69 €/St.", 1.15, 8, 9], paprika: ["Paprika", "3,99 €/kg", 1.45, 4, 4], tomate: ["Rispentomaten", "2,99 €/kg", 1.35, 3.6, 5],
  };
  const unter = [];
  stufen.forEach(([vorn, hinten], si) => {
    for (let sp = 0; sp < spalten; sp++) {
      const x0 = -W / 2 + 2 + sp * sw + 0.5, x1 = x0 + sw - 1, id = belegt[si][sp], d = daten[id];
      k += steige(x0, x1, vorn - 5, hinten);
      k += haufen(x0 + 1, x1 - 1, vorn - 4.6, hinten + (id === "spargel" ? 8 : 4), id, d[2], d[3], d[4]);
      k += steigeVorn(x0, x1, vorn, 5.4, d[0], d[1], "");
      unter.push({ id, x: cx + (x0 + x1) / 2, y: WAND_UNTEN + vorn, w: x1 - x0, h: vorn - hinten + 2 });
    }
  });
  k += `<rect x="${-W / 2}" y="-6" width="${W}" height="6" fill="#1a2a20"/>`;
  k += `<rect x="${-W / 2 - 1}" y="-84" width="2.2" height="84" fill="#1a2a20"/><rect x="${W / 2 - 1.2}" y="-84" width="2.2" height="84" fill="#1a2a20"/>`;
  const W8 = {
    salat: ["kopfsalat", "der Kopfsalat", "KOPF-sa-lat", "la lattuga", "lat-TU-ga", "lettuce"], lauch: ["lauch", "der Lauch", "LAUCH", "il porro", "POR-ro", "leek"], spargel: ["spargel", "der Spargel", "SPAR-gel", "gli asparagi", "a-SPA-ra-gi", "asparagus"],
    radieschen: ["radieschen", "das Radieschen", "Ra-DIES-chen", "il ravanello", "ra-va-NEL-lo", "radish"], pilz: ["pilz", "der Pilz", "PILZ", "il fungo", "FUN-go", "mushroom"],
    brokkoli: ["brokkoli", "der Brokkoli", "BROK-ko-li", "i broccoli", "BROC-co-li", "broccoli"], blumenkohl: ["blumenkohl", "der Blumenkohl", "BLU-men-kohl", "il cavolfiore", "ca-vol-FIO-re", "cauliflower"],
    gurke: ["gurke", "die Gurke", "GUR-ke", "il cetriolo", "ce-tri-O-lo", "cucumber"], paprika: ["paprika", "die Paprika", "PA-pri-ka", "il peperone", "pe-pe-RO-ne", "pepper"], tomate: ["tomate", "die Tomate", "To-MA-te", "il pomodoro", "po-mo-DO-ro", "tomato"],
  };
  const TIPP = { spargel: "Spargel gibt es in Deutschland von April bis zum 24. Juni — weiß und grün.", salat: "Der feine Sprühnebel hält Salat und Kräuter frisch." };
  S.teil({ id: "gemueseregal", de: "das Gemüseregal", syl: "ge-MÜ-se-re-gal", it: "lo scaffale della verdura", itSyl: "scaf-FA-le del-la ver-DU-ra", en: "vegetable display", x: cx, y: WAND_UNTEN, steht: true, kunst: k,
    zoom: { x: 190, y: 34, w: 130, h: 87 },
    unter: unter.map((u) => { const [id, de, syl, it, itSyl, en] = W8[u.id]; return { id, de, syl, it, itSyl, en, tipp: TIPP[u.id], x: u.x, y: u.y, kunst: flaeche(-u.w / 2, -u.h, u.w, u.h) }; }),
    tipp: "Im gekühlten Gemüseregal sprüht von oben ein feiner Wassernebel." });
}

/* =====================================================================
   3 — DIE BANANE am Bananenständer (vor der Wand, zwischen den Regalen)
   ===================================================================== */
{
  const M = mass(146);
  let k = schatten(0, 0, 14, 1.4, 0.3);
  /* Ständer: Fuß, Säule, Querarme mit Haken */
  k += `<ellipse cx="0" cy="-1" rx="12" ry="2" fill="#2a2a2a"/><rect x="-1" y="${r(-1.45 * M)}" width="2" height="${r(1.45 * M)}" fill="${STAHL}"/>`;
  k += `<rect x="-14" y="${r(-1.45 * M)}" width="28" height="1.6" rx=".6" fill="${STAHL}"/><rect x="-14" y="${r(-1.05 * M)}" width="28" height="1.6" rx=".6" fill="${STAHL}"/>`;
  const staude = (x, y, n, sk) => {
    let g = `<path d="M${x} ${y} q.4 2.6 0 4" stroke="#6a5a2a" stroke-width="1.2" fill="none"/>`;
    for (let i = 0; i < n; i++) {
      const a = -50 + i * (100 / (n - 1));
      g += `<g transform="translate(${x} ${y + 3.6}) rotate(${r(a)})"><path d="M-.9 0 Q-2.2 ${r(6 * sk)} ${r(2.4 * sk)} ${r(12 * sk)} Q${r(3.4 * sk)} ${r(12.4 * sk)} ${r(3.2 * sk)} ${r(11.2 * sk)} Q.6 ${r(6 * sk)} .9 0 Z" fill="${S.lg("banane", [[0, "#ffe25a"], [0.6, "#f2c41a"], [1, "#c99a0a"]], 0, 0, 1, 0)}"/><path d="M${r(2.4 * sk)} ${r(12 * sk)} l${r(0.8 * sk)} ${r(0.2 * sk)}" stroke="#3a2a12" stroke-width=".7"/></g>`;
    }
    return g;
  };
  k += `<line x1="-9" y1="${r(-1.45 * M + 1.6)}" x2="-9" y2="${r(-1.45 * M + 3)}" stroke="#888" stroke-width=".5"/><line x1="9" y1="${r(-1.45 * M + 1.6)}" x2="9" y2="${r(-1.45 * M + 3)}" stroke="#888" stroke-width=".5"/>`;
  k += staude(-9, -1.45 * M + 3, 5, 0.85) + staude(9, -1.45 * M + 3, 5, 0.85);
  k += `<line x1="-8" y1="${r(-1.05 * M + 1.6)}" x2="-8" y2="${r(-1.05 * M + 3)}" stroke="#888" stroke-width=".5"/><line x1="8" y1="${r(-1.05 * M + 1.6)}" x2="8" y2="${r(-1.05 * M + 3)}" stroke="#888" stroke-width=".5"/>`;
  k += staude(-8, -1.05 * M + 3, 4, 0.8) + staude(8, -1.05 * M + 3, 4, 0.8);
  /* Preisschild */
  k += `<rect x="-8" y="${r(-1.45 * M - 8)}" width="16" height="7" rx=".6" fill="#1f2a24"/><text x="0" y="${r(-1.45 * M - 4.6)}" font-size="2" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Bananen</text><text x="0" y="${r(-1.45 * M - 1.8)}" font-size="2.2" text-anchor="middle" fill="#f6e27a" font-family="Arial" font-weight="bold">1,69 €/kg</text>`;
  S.teil({ id: "banane", de: "die Banane", syl: "Ba-NA-ne", it: "la banana", itSyl: "ba-NA-na", en: "banana", x: 164, y: 146, steht: true, kunst: k,
    tipp: "Bananen hängen am Ständer, damit sie keine braunen Druckstellen bekommen." });
}

/* =====================================================================
   4 — DER AUSLAGETISCH (vorne Mitte, zwei Stufen Kisten) — Lupe
   ===================================================================== */
const TI = { x0: 66, x1: 222, y: 194 };
{
  const W = TI.x1 - TI.x0, cx = (TI.x0 + TI.x1) / 2, M = mass(TI.y);
  const hT = 0.72 * M;     // Tischplatte
  let k = schatten(0, 0, W / 2 + 4, 2, 0.35);
  /* Tisch: Beine, Zarge, Holzverkleidung */
  k += `<rect x="${-W / 2}" y="${r(-hT)}" width="${W}" height="${r(hT)}" fill="${S.lg("tischfront", [[0, "#7a5230"], [1, "#5a3a1e"]])}"/>`;
  for (let x = -W / 2 + 4; x < W / 2; x += 6) k += `<rect x="${x}" y="${r(-hT + 3)}" width="5.4" height="${r(hT - 7)}" fill="#8a6038" opacity=".55"/>`;
  k += `<rect x="${-W / 2}" y="-4" width="${W}" height="4" fill="#3a2614"/>`;
  k += `<rect x="${-W / 2 - 1}" y="${r(-hT - 1.6)}" width="${W + 2}" height="2.4" fill="${HOLZ}"/>`;
  /* Tafel an der Tischfront */
  k += `<rect x="-26" y="${r(-hT + 9)}" width="52" height="18" rx="1" fill="${HOLZ}"/><rect x="-24.4" y="${r(-hT + 10.6)}" width="48.8" height="14.8" fill="#26302a"/>`;
  k += `<text x="0" y="${r(-hT + 17.4)}" font-size="5" text-anchor="middle" fill="#f4f0e6" font-family="'Segoe Print','Comic Sans MS',cursive">Aus der Region</text><text x="0" y="${r(-hT + 22.6)}" font-size="2.8" text-anchor="middle" fill="#f6e27a" font-family="'Segoe Print','Comic Sans MS',cursive">frisch vom Hof Lindner</text>`;
  /* zwei Stufen: hinten erhöht */
  const stufen = [[-hT - 14, -hT - 34], [-hT - 1, -hT - 15]];
  k += `<rect x="${-W / 2 + 2}" y="${r(-hT - 18)}" width="${W - 4}" height="17" fill="#5a3a1e"/>`;
  const spalten = 4, sw = (W - 4) / spalten;
  const belegt = [["kohl", "rotebete", "kartoffel", "zwiebel"], ["moehre", "knoblauch", "erbse", "bohne"]];
  const daten = {
    kohl: ["Weißkohl", "0,99 €/kg", "Deutschland", 1.7, 5.4, 3], rotebete: ["Rote Bete", "1,49 €/kg", "Deutschland", 1.6, 3.8, 4], kartoffel: ["Kartoffeln", "1,29 €/kg", "Deutschland", 1.8, 3.6, 5], zwiebel: ["Zwiebeln", "1,19 €/kg", "Deutschland", 1.7, 3.8, 4],
    moehre: ["Möhren", "0,99 €/Bd.", "Deutschland", 1.5, 2.2, 3], knoblauch: ["Knoblauch", "0,59 €/St.", "Spanien", 1.6, 3.8, 4], erbse: ["Zuckerschoten", "2,49 €/250 g", "Kenia", 1.5, 5.4, 6], bohne: ["Bohnen", "3,99 €/kg", "Deutschland", 1.4, 6.4, 9],
  };
  const unter = [];
  stufen.forEach(([vorn, hinten], si) => {
    for (let sp = 0; sp < spalten; sp++) {
      const x0 = -W / 2 + 2 + sp * sw + 0.6, x1 = x0 + sw - 1.2, id = belegt[si][sp], d = daten[id];
      k += steige(x0, x1, vorn - 6, hinten);
      k += haufen(x0 + 1.2, x1 - 1.2, vorn - 5.6, hinten + (id === "moehre" ? 9 : 4), id, d[3], d[4], d[5]);
      k += steigeVorn(x0, x1, vorn, 6.4, d[0], d[1], d[2]);
      unter.push({ id, x: cx + (x0 + x1) / 2, y: TI.y + vorn, w: x1 - x0, h: vorn - hinten + 2 });
    }
  });
  const W8 = {
    kohl: ["der Kohl", "KOHL", "il cavolo", "CA-vo-lo", "cabbage"], rotebete: ["die Rote Bete", "RO-te BE-te", "la barbabietola", "bar-ba-BIE-to-la", "beetroot"], kartoffel: ["die Kartoffel", "Kar-TOF-fel", "la patata", "pa-TA-ta", "potato"],
    zwiebel: ["die Zwiebel", "ZWIE-bel", "la cipolla", "ci-POL-la", "onion"], moehre: ["die Möhre", "MÖH-re", "la carota", "ca-RO-ta", "carrot"], knoblauch: ["der Knoblauch", "KNOB-lauch", "l'aglio", "A-glio", "garlic"],
    erbse: ["die Erbse", "ERB-se", "il pisello", "pi-SEL-lo", "pea"], bohne: ["die Bohne", "BOH-ne", "il fagiolo", "fa-GIO-lo", "bean"],
  };
  const TIPP = { kartoffel: "Kartoffeln liegen kühl und dunkel — im Licht werden sie grün.", moehre: "Möhren mit Grün werden im Bund verkauft. In Süddeutschland sagt man auch „Gelbe Rübe“.", erbse: "In der Schote sitzen die Erbsen in einer Reihe." };
  S.teil({ id: "auslagetisch", de: "der Auslagetisch", syl: "AUS-la-ge-tisch", it: "il banco espositivo", itSyl: "BAN-co e-spo-si-TI-vo", en: "display table", x: cx, y: TI.y, steht: true, kunst: k,
    zoom: { x: TI.x0 - 6, y: r(TI.y - hT - 40), w: W + 12, h: r((W + 12) / 1.7) },
    unter: unter.map((u) => { const [de, syl, it, itSyl, en] = W8[u.id]; const id = u.id === "rotebete" ? "rote_bete" : u.id; return { id, de, syl, it, itSyl, en, tipp: TIPP[u.id], x: u.x, y: u.y, kunst: flaeche(-u.w / 2, -u.h, u.w, u.h) }; }),
    tipp: "Auf dem Auslagetisch liegt Gemüse aus der Region." });
}

/* =====================================================================
   5 — DIE WAAGE (Selbstbedienungswaage auf Standsäule, vorne links)
   ===================================================================== */
{
  const M = mass(194);
  let k = schatten(0, 0, 10, 1.6, 0.35);
  k += `<rect x="-8" y="-2" width="16" height="2" rx=".8" fill="#2a2e33"/><rect x="-1.6" y="${r(-0.85 * M)}" width="3.2" height="${r(0.85 * M - 2)}" fill="${STAHL}"/>`;
  /* Wiegefläche */
  k += `<path d="M-12 ${r(-0.85 * M)} L12 ${r(-0.85 * M)} L10 ${r(-0.85 * M - 4)} L-10 ${r(-0.85 * M - 4)} Z" fill="${STAHL}"/><rect x="-12" y="${r(-0.85 * M)}" width="24" height="2.2" fill="#9aa3aa"/>`;
  /* ein Knotenbeutel mit Tomaten liegt darauf */
  k += `<path d="M-8 ${r(-0.85 * M - 1)} Q-9 ${r(-0.85 * M - 8)} -4 ${r(-0.85 * M - 9)} L-2 ${r(-0.85 * M - 11)} L-.6 ${r(-0.85 * M - 9)} Q3 ${r(-0.85 * M - 8)} 2 ${r(-0.85 * M - 1)} Z" fill="#eef4f6" opacity=".6" stroke="#b9c6cc" stroke-width=".25"/>`;
  for (const [a, b] of [[-5.6, -2], [-2.4, -2.2], [-4, -5]]) k += F.tomate(a, -0.85 * M + b + 1.6, 1.15, 0);
  /* Bildschirm mit Sortenbildern, Etikettendrucker */
  const yP = -0.85 * M;      /* Bildschirm auf kurzem Arm rechts über der Wiegefläche */
  k += `<rect x="11" y="${r(yP - 8)}" width="2" height="8" fill="${STAHL}"/>`;
  k += `<rect x="1" y="${r(yP - 24)}" width="21" height="16" rx="1.2" fill="#1d2125"/>`;
  k += `<rect x="2" y="${r(yP - 23)}" width="19" height="14" rx=".6" fill="#f2f6f2"/>`;
  const kach = [["#e0201a", "Tomate"], ["#f2c41a", "Banane"], ["#c81e1e", "Apfel"], ["#c9a066", "Kartoffel"], ["#f27a12", "Möhre"], ["#3a8a1a", "Gurke"]];
  kach.forEach(([f, t], i) => {
    const x = 2.6 + (i % 3) * 6.1, y = yP - 22.4 + Math.floor(i / 3) * 5.8;
    k += `<rect x="${r(x)}" y="${r(y)}" width="5.5" height="5.2" rx=".4" fill="#fff" stroke="#c9d3cc" stroke-width=".2"/><circle cx="${r(x + 2.75)}" cy="${r(y + 2.1)}" r="1.4" fill="${f}"/><text x="${r(x + 2.75)}" y="${r(y + 4.7)}" font-size=".9" text-anchor="middle" fill="#333" font-family="Arial">${t}</text>`;
  });
  k += `<rect x="2" y="${r(yP - 10.6)}" width="19" height="1.5" fill="#2f5a35"/><text x="11.5" y="${r(yP - 9.5)}" font-size="1.1" text-anchor="middle" fill="#fff" font-family="Arial">0,412 kg · 1,23 €</text>`;
  k += `<rect x="-14" y="${r(yP - 9)}" width="6" height="5" rx=".6" fill="#e9ecee"/><rect x="-13" y="${r(yP - 5)}" width="4" height="2.6" fill="#fff" stroke="#ccc" stroke-width=".2"/><rect x="-12" y="${r(yP - 4)}" width="2" height="4" fill="${STAHL}"/>`;
  /* Rolle mit Knotenbeuteln an der Säule */
  k += `<rect x="-6.4" y="${r(-0.55 * M)}" width="5" height="6" rx="2.2" fill="#e8f0f2" stroke="#b9c6cc" stroke-width=".3"/><rect x="-1.6" y="${r(-0.55 * M + 2)}" width="1.6" height="1.6" fill="#9aa3aa"/>`;
  S.teil({ id: "waage", de: "die Waage", syl: "WAA-ge", it: "la bilancia", itSyl: "bi-LAN-cia", en: "scale", x: 34, y: 194, steht: true, kunst: k,
    tipp: "Auf die Waage legen, das Bild antippen — die Waage druckt einen Aufkleber mit dem Preis." });
}

/* =====================================================================
   6 — VORNE RECHTS: DIE ANANAS, DER KÜRBIS, DIE WASSERMELONE
   ===================================================================== */
function kiste(w, h, farbe) {
  let g = schatten(0, 0, w / 2 + 2, 1.4, 0.35);
  g += `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="${farbe || HOLZ}"/>`;
  for (let i = 1; i < 3; i++) g += `<line x1="${-w / 2}" y1="${r(-h * i / 3)}" x2="${w / 2}" y2="${r(-h * i / 3)}" stroke="#9a7448" stroke-width=".5"/>`;
  g += `<rect x="${-w / 2}" y="${-h}" width="${w}" height=".7" fill="#f2d8a8"/><rect x="${-w / 2}" y="${-h}" width="1.6" height="${h}" fill="#a07a4a"/><rect x="${w / 2 - 1.6}" y="${-h}" width="1.6" height="${h}" fill="#a07a4a"/>`;
  return g;
}
function schild(x, y, t, p) { return `<rect x="${x - 8}" y="${y}" width="16" height="6.6" rx=".5" fill="#1f2a24"/><text x="${x}" y="${y + 2.8}" font-size="1.8" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">${t}</text><text x="${x}" y="${y + 5.6}" font-size="2.2" text-anchor="middle" fill="#f6e27a" font-family="Arial" font-weight="bold">${p}</text>`; }
{
  const M = mass(192);
  let k = kiste(30, 0.28 * M);
  const yb = -0.28 * M;
  for (const [x, dy, sk] of [[-9, 2, 0.9], [0, 0, 1], [9, 2, 0.9]]) {
    const y = yb + dy;
    k += `<path d="M${x - 4 * sk} ${r(y - 6 * sk)} L${x - 6 * sk} ${r(y - 13 * sk)} L${x - 1.6 * sk} ${r(y - 10 * sk)} L${x} ${r(y - 16 * sk)} L${x + 1.6 * sk} ${r(y - 10 * sk)} L${x + 6 * sk} ${r(y - 13 * sk)} L${x + 4 * sk} ${r(y - 6 * sk)} Z" fill="${S.lg("krone", [[0, "#4a8a3a"], [1, "#2a5a2a"]])}"/>`;
    k += `<ellipse cx="${x}" cy="${r(y - 3.4 * sk)}" rx="${r(4.2 * sk)}" ry="${r(5 * sk)}" fill="${RG("ananas", "#f2c24a", "#c98a1a", "#7a5a12")}"/>`;
    for (let i = -2; i <= 2; i++) k += `<path d="M${r(x - 4 * sk)} ${r(y - 3.4 * sk + i * 1.8 * sk)} l${r(8 * sk)} ${r(-2.4 * sk)} M${r(x - 4 * sk)} ${r(y - 5.8 * sk + i * 1.8 * sk)} l${r(8 * sk)} ${r(2.4 * sk)}" stroke="#8a5a12" stroke-width=".25" opacity=".7"/>`;
  }
  k += schild(0, r(-0.14 * M - 3.3), "Ananas", "1,99 €/St.");
  S.teil({ id: "ananas", de: "die Ananas", syl: "A-na-nas", it: "l'ananas", itSyl: "A-na-nas", en: "pineapple", x: 240, y: 192, steht: true, kunst: k,
    tipp: "Die Ananas kommt mit dem Schiff aus Costa Rica. Oben trägt sie eine Krone aus harten Blättern." });
}
{
  const M = mass(192);
  let k = kiste(30, 0.3 * M);
  const yb = -0.3 * M;
  for (const [x, dy, sk] of [[-8, 1.6, 0.95], [7.6, 1.2, 1], [0, -1, 1.05]]) {
    const y = yb + dy;
    k += `<ellipse cx="${x}" cy="${r(y - 4 * sk)}" rx="${r(6.2 * sk)}" ry="${r(4.4 * sk)}" fill="${RG("kuerbis", "#ffa04a", "#e0640e", "#9a3a06")}"/>`;
    for (const a of [-3.4, 0, 3.4]) k += `<path d="M${r(x + a * sk)} ${r(y - 8.2 * sk)} Q${r(x + a * 1.5 * sk)} ${r(y - 4 * sk)} ${r(x + a * sk)} ${r(y + 0.2 * sk)}" stroke="#b8500a" stroke-width=".4" fill="none"/>`;
    k += `<path d="M${x} ${r(y - 8.2 * sk)} l${r(0.6 * sk)} ${r(-1.6 * sk)}" stroke="#5a4a2a" stroke-width="1.1" stroke-linecap="round"/>`;
  }
  k += schild(0, r(-0.15 * M - 3.3), "Hokkaido", "1,79 €/kg");
  S.teil({ id: "kuerbis", de: "der Kürbis", syl: "KÜR-bis", it: "la zucca", itSyl: "ZUC-ca", en: "pumpkin", x: 272, y: 194, steht: true, kunst: k,
    tipp: "Den Hokkaido-Kürbis kann man mit Schale kochen." });
}
{
  const M = mass(196);
  /* Großkarton mit Wassermelonen, vorne eine halbe unter Folie */
  let k = schatten(0, 0, 18, 1.6, 0.35);
  const h = 0.5 * M;
  k += `<path d="M-16 0 L-16 ${r(-h)} L16 ${r(-h)} L16 0 Z" fill="${S.lg("karton", [[0, "#d9b582"], [1, "#b8925e"]])}"/>`;
  k += `<rect x="-16" y="${r(-h)}" width="32" height="1.4" fill="#a8824e"/><text x="0" y="${r(-h + 6)}" font-size="3.4" text-anchor="middle" fill="#3a6a2a" font-family="Arial" font-weight="bold">MELONEN</text>`;
  for (const [x, dy, sk] of [[-7, 0, 1], [7, 0.6, 0.95]]) {
    k += `<ellipse cx="${x}" cy="${r(-h - 4.4 * sk + dy)}" rx="${r(8 * sk)}" ry="${r(5.6 * sk)}" fill="${S.lg("melone", [[0, "#4a9a3a"], [1, "#1f5a1f"]])}"/>`;
    for (const a of [-5, -2, 1, 4]) k += `<path d="M${r(x + a * sk)} ${r(-h - 9.6 * sk + dy)} Q${r(x + a * 1.4 * sk)} ${r(-h - 4.4 * sk + dy)} ${r(x + a * sk)} ${r(-h + 0.8 + dy)}" stroke="#163f16" stroke-width=".8" fill="none"/>`;
  }
  /* dritte Melone vorne */
  k += `<ellipse cx="0" cy="${r(-h - 2.6)}" rx="7.6" ry="5.2" fill="${S.lg("melone", [[0, "#4a9a3a"], [1, "#1f5a1f"]])}"/>`;
  for (const a of [-4.6, -1.6, 1.4, 4.4]) k += `<path d="M${a} ${r(-h - 7.6)} Q${r(a * 1.4)} ${r(-h - 2.6)} ${a} ${r(-h + 2.4)}" stroke="#163f16" stroke-width=".8" fill="none"/>`;
  k += `<ellipse cx="-3" cy="${r(-h - 5.2)}" rx="2.4" ry="1" fill="#fff" opacity=".18"/>`;
  k += schild(0, r(-h / 2 + 2), "Wassermelone", "0,99 €/kg");
  S.teil({ id: "wassermelone", de: "die Wassermelone", syl: "WAS-ser-me-lo-ne", it: "l'anguria", itSyl: "an-GU-ria", en: "watermelon", x: 304, y: 196, steht: true, kunst: k,
    tipp: "Eine Wassermelone wiegt oft mehr als fünf Kilo. Innen ist sie rot und voller schwarzer Kerne." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/obstgemuese.js"));
console.log(aus);
