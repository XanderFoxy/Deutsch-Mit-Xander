#!/usr/bin/env node
/* =====================================================================
   SÜSSIGKEITEN & SNACKS (FASSUNG 852) — Bilderwelt neu: der
   Süßwarengang im Supermarkt.
   ---------------------------------------------------------------------
   RECHERCHE (Lebensmittelpraxis „Candy Station – modulares System“,
   Lebensmittel Zeitung „So macht Edeka Süßwaren zum Erlebnis“, Artikel
   zur Kassenzone):
   - Die Süßwaren stehen in langen REGALEN, nach Warengruppen geordnet:
     Schokolade, Pralinen, Riegel, Kekse und Waffeln; daneben
     „Knabbern“ (Chips, Flips, Salzstangen) und oft das Backregal
     (Mehl, Zucker). Oben hängen Schilder mit den Warengruppen, an den
     Regalkanten Preisschienen.
   - Lose Süßigkeiten zum SELBSTABFÜLLEN: große Gläser bzw. Schütten mit
     Fruchtgummi, Lakritz, Bonbons, Lutschern; man füllt mit der
     Schaufel eine Tüte, wiegt sie auf der WAAGE (z. B. 0,99 € je 100 g).
   - Im Gang stehen AUFSTELLER aus Pappe mit Aktionsware (Nüsse,
     Trockenfrüchte, Riegel).
   - Vorne die TIEFKÜHLTRUHE mit Glasschiebedeckeln für Eis.
   Maßstab: Rückwand ≈ 40 Einheiten je Meter (Regal 2,0 m hoch),
   Aufsteller (y 152) ≈ 49 je Meter, vorne (y 194) ≈ 57 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "suessigkeiten", titel: "Süßigkeiten & Snacks", emoji: "🍬", thema: "Einkaufen", kuerzel: "sw", fassung: 852 });
const rnd = zufall(1922);
const r = B.r;
{ const lg = S.lg, rg = S.rg, c = {}; S.lg = (n, ...a) => c[n] || (c[n] = lg(n, ...a)); S.rg = (n, ...a) => c["r" + n] || (c["r" + n] = rg(n, ...a)); }

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.3], [0.45, "#e8f4f7", 0.06], [1, "#ffffff", 0.16]], 0, 0, 1, 1);
const HOLZ = S.lg("holz", [[0, "#c79a64"], [1, "#a0723f"]]);
const HOLZ_V = S.lg("holzv", [[0, "#9a6a3a"], [0.5, "#b58250"], [1, "#94653a"]], 0, 0, 1, 0);
const SCHOKO = S.lg("schoko", [[0, "#6a3a1c"], [1, "#3e200d"]]);
const VPY = -60, WAND_UNTEN = 118;
const mass = (y) => 40 * (y - VPY) / (WAND_UNTEN - VPY);

/* =====================================================================
   KULISSE — Rasterdecke mit Lichtbändern, Wand, Fliesenboden, Gangschilder
   ===================================================================== */
{
  let k = `<rect x="0" y="0" width="320" height="16" fill="${S.lg("decke", [[0, "#e9ebec"], [1, "#dadddf"]])}"/>`;
  for (let x = 0; x <= 320; x += 20) k += `<line x1="${x}" y1="0" x2="${x}" y2="16" stroke="#c4c8cb" stroke-width=".4"/>`;
  k += `<line x1="0" y1="8" x2="320" y2="8" stroke="#c4c8cb" stroke-width=".4"/>`;
  for (const x of [40, 160, 280]) k += `<rect x="${x - 30}" y="3" width="60" height="3" rx="1" fill="#fffef6"/><rect x="${x - 30}" y="2" width="60" height="5" rx="1.5" fill="#fff" opacity=".35"/>`;
  k += `<rect x="0" y="16" width="320" height="${WAND_UNTEN - 16}" fill="${S.lg("wand", [[0, "#f5efe6"], [1, "#e8dfd2"]])}"/>`;
  k += `<rect x="0" y="16" width="320" height="2" fill="#d2c8b8"/>`;
  /* Gangschilder an Seilen */
  const schild = (x, w, t, f) => `<line x1="${x - w / 2 + 4}" y1="16" x2="${x - w / 2 + 4}" y2="19" stroke="#777" stroke-width=".3"/><line x1="${x + w / 2 - 4}" y1="16" x2="${x + w / 2 - 4}" y2="19" stroke="#777" stroke-width=".3"/><rect x="${x - w / 2}" y="19" width="${w}" height="7" rx="1" fill="${f}"/><text x="${x}" y="24.2" font-size="4" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">${t}</text>`;
  k += schild(35, 56, "Knabbern &amp; Backen", "#2f6fb0") + schild(111, 74, "Süßwaren", "#b5263a") + schild(260, 100, "Naschen zum Selbstabfüllen", "#d9822b");
  /* Boden */
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#cfcac1"], [1, "#e2ddd4"]])}"/>`;
  for (let i = -16; i <= 16; i++) k += `<line x1="${160 + i * 12}" y1="${WAND_UNTEN}" x2="${r(160 + i * 12 * 260 / 178)}" y2="200" stroke="#a9a397" stroke-width=".3" opacity=".7"/>`;
  for (let d = 0.3; d < 4; d += 0.3) { const y = VPY + (WAND_UNTEN - VPY) * (1 + d * 0.33); if (y > 200) break; k += `<line x1="0" y1="${r(y)}" x2="320" y2="${r(y)}" stroke="#a9a397" stroke-width=".3" opacity=".6"/>`; }
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.12], [0.4, "#000", 0], [1, "#fff", 0.1]])}"/>`;
  k += `<rect x="0" y="${WAND_UNTEN - 1}" width="320" height="1.4" fill="#8b857a"/>`;
  S.hinten(k);
}

/* ---------- Hilfen: Motive (Inhalt auf der Packung) ----------------- */
const MOTIV = {
  chip: (x, y, s) => `<path d="M${r(x - 2.2 * s)} ${r(y)} q${r(1.1 * s)} ${r(-1.4 * s)} ${r(2.2 * s)} ${r(-0.4 * s)} q${r(1.1 * s)} ${r(1 * s)} ${r(2.2 * s)} ${r(-0.2 * s)} q${r(-0.6 * s)} ${r(1.8 * s)} ${r(-2.2 * s)} ${r(1.6 * s)} q${r(-1.6 * s)} ${r(0.2 * s)} ${r(-2.2 * s)} ${r(-1 * s)} Z" fill="#f2c94c" stroke="#c9952a" stroke-width=".2"/>`,
  flip: (x, y, s) => `<path d="M${r(x - 2 * s)} ${r(y)} q${r(0.6 * s)} ${r(-1.4 * s)} ${r(1.4 * s)} ${r(-0.4 * s)} q${r(0.6 * s)} ${r(-1.4 * s)} ${r(1.4 * s)} ${r(-0.2 * s)} q${r(0.8 * s)} ${r(-0.6 * s)} ${r(1.2 * s)} ${r(0.6 * s)} q${r(-1 * s)} ${r(1.2 * s)} ${r(-4 * s)} 0 Z" fill="#f0b23a" stroke="#c07a1a" stroke-width=".2"/>`,
  brezel: (x, y, s) => `<path d="M${r(x - 1.6 * s)} ${r(y + 1 * s)} C${r(x - 2.8 * s)} ${r(y)} ${r(x - 2 * s)} ${r(y - 1.8 * s)} ${r(x - 0.4 * s)} ${r(y - 1.6 * s)} C${r(x + 0.8 * s)} ${r(y - 1.4 * s)} ${r(x + 1 * s)} ${r(y)} ${r(x)} ${r(y + 0.8 * s)} M${r(x + 1.6 * s)} ${r(y + 1 * s)} C${r(x + 2.8 * s)} ${r(y)} ${r(x + 2 * s)} ${r(y - 1.8 * s)} ${r(x + 0.4 * s)} ${r(y - 1.6 * s)} C${r(x - 0.8 * s)} ${r(y - 1.4 * s)} ${r(x - 1 * s)} ${r(y)} ${r(x)} ${r(y + 0.8 * s)}" stroke="#8a4614" stroke-width="${r(0.7 * s)}" fill="none" stroke-linecap="round"/>`,
  popcorn: (x, y, s) => [[-1.2, 0], [0.2, -0.6], [1.4, 0.1], [-0.5, -1.6], [0.9, -1.5]].map(([a, b]) => `<circle cx="${r(x + a * s)}" cy="${r(y + b * s)}" r="${r(0.85 * s)}" fill="#fff8e6" stroke="#e2c47a" stroke-width=".15"/>`).join(""),
  stange: (x, y, s) => [-1.2, -0.4, 0.4, 1.2].map((a) => `<rect x="${r(x + a * s - 0.2 * s)}" y="${r(y - 2.6 * s)}" width="${r(0.4 * s)}" height="${r(3.4 * s)}" rx=".2" fill="#b8742a"/>`).join(""),
  reiswaffel: (x, y, s) => `<ellipse cx="${x}" cy="${y}" rx="${r(2.2 * s)}" ry="${r(1.4 * s)}" fill="#f4e7c8" stroke="#d6c294" stroke-width=".2"/>` + [[-0.8, -0.3], [0.5, 0.2], [0.9, -0.6], [-0.2, 0.6]].map(([a, b]) => `<circle cx="${r(x + a * s)}" cy="${r(y + b * s)}" r="${r(0.2 * s)}" fill="#e1cc98"/>`).join(""),
  aehre: (x, y, s) => `<line x1="${x}" y1="${r(y + 1.6 * s)}" x2="${x}" y2="${r(y - 1.8 * s)}" stroke="#b8862a" stroke-width="${r(0.25 * s)}"/>` + [-1.2, -0.4, 0.4].map((b) => `<ellipse cx="${r(x - 0.5 * s)}" cy="${r(y + b * s)}" rx="${r(0.35 * s)}" ry="${r(0.6 * s)}" fill="#d9a83a"/><ellipse cx="${r(x + 0.5 * s)}" cy="${r(y + b * s)}" rx="${r(0.35 * s)}" ry="${r(0.6 * s)}" fill="#d9a83a"/>`).join(""),
  zucker: (x, y, s) => [[-0.9, 0], [0.9, 0], [0, -1.6]].map(([a, b]) => `<rect x="${r(x + a * s - 0.8 * s)}" y="${r(y + b * s - 0.8 * s)}" width="${r(1.6 * s)}" height="${r(1.6 * s)}" fill="#fff" stroke="#c9d3dc" stroke-width=".2"/>`).join(""),
  schoko: (x, y, s) => `<rect x="${r(x - 2.2 * s)}" y="${r(y - 1.4 * s)}" width="${r(4.4 * s)}" height="${r(2.8 * s)}" fill="#5a2e14"/>` + [-1.1, 0, 1.1].map((a) => `<line x1="${r(x + a * s)}" y1="${r(y - 1.4 * s)}" x2="${r(x + a * s)}" y2="${r(y + 1.4 * s)}" stroke="#3a1c0a" stroke-width=".2"/>`).join("") + `<line x1="${r(x - 2.2 * s)}" y1="${y}" x2="${r(x + 2.2 * s)}" y2="${y}" stroke="#3a1c0a" stroke-width=".2"/>`,
  praline: (x, y, s) => [[-1.2, 0.4], [1.2, 0.4], [0, -0.9]].map(([a, b], i) => `<circle cx="${r(x + a * s)}" cy="${r(y + b * s)}" r="${r(1 * s)}" fill="${i === 2 ? "#e9d6b0" : "#4a230e"}"/>`).join(""),
  riegel: (x, y, s) => `<rect x="${r(x - 2.4 * s)}" y="${r(y - 0.8 * s)}" width="${r(4.4 * s)}" height="${r(1.6 * s)}" rx="${r(0.4 * s)}" fill="#5a2e14"/><rect x="${r(x + 2 * s)}" y="${r(y - 0.8 * s)}" width="${r(0.6 * s)}" height="${r(1.6 * s)}" fill="#e9b25a"/><rect x="${r(x + 2 * s)}" y="${r(y - 0.2 * s)}" width="${r(0.6 * s)}" height="${r(0.4 * s)}" fill="#f5e6c8"/>`,
  puffreis: (x, y, s) => `<rect x="${r(x - 2.2 * s)}" y="${r(y - 1.4 * s)}" width="${r(4.4 * s)}" height="${r(2.8 * s)}" fill="#6a3a1c"/>` + Array.from({ length: 9 }, (_, i) => `<ellipse cx="${r(x + (-1.7 + (i % 3) * 1.7) * s)}" cy="${r(y + (-0.8 + Math.floor(i / 3) * 0.8) * s)}" rx="${r(0.35 * s)}" ry="${r(0.22 * s)}" fill="#f3e2b8"/>`).join(""),
  knusper: (x, y, s) => [[-1.2, 0.3], [0.6, 0.5], [-0.2, -0.9], [1.4, -0.6]].map(([a, b]) => `<path d="M${r(x + a * s - 0.9 * s)} ${r(y + b * s)} q${r(0.9 * s)} ${r(-1.2 * s)} ${r(1.8 * s)} 0 q${r(-0.9 * s)} ${r(0.7 * s)} ${r(-1.8 * s)} 0 Z" fill="#4a230e"/>`).join(""),
  kugel: (x, y, s) => [[-1.1, 0], [1.1, 0], [0, -1]].map(([a, b]) => `<path d="M${r(x + a * s - 1 * s)} ${r(y + b * s + 0.5 * s)} a${r(1 * s)} ${r(1 * s)} 0 0 1 ${r(2 * s)} 0 Z" fill="#4a230e"/><path d="M${r(x + a * s - 0.4 * s)} ${r(y + b * s - 0.1 * s)} q${r(0.4 * s)} ${r(-0.3 * s)} ${r(0.7 * s)} 0" stroke="#9a6a4a" stroke-width=".15" fill="none"/>`).join(""),
  schokokeks: (x, y, s) => `<circle cx="${x}" cy="${y}" r="${r(1.9 * s)}" fill="#d9a560"/><circle cx="${x}" cy="${y}" r="${r(1.6 * s)}" fill="#4a230e"/>` + [-0.6, 0, 0.6].map((b) => `<path d="M${r(x - 1.3 * s)} ${r(y + b * s)} q${r(0.65 * s)} ${r(-0.4 * s)} ${r(1.3 * s)} 0 t${r(1.3 * s)} 0" stroke="#6a3a1c" stroke-width=".2" fill="none"/>`).join(""),
  butterkeks: (x, y, s) => `<rect x="${r(x - 2.2 * s)}" y="${r(y - 1.5 * s)}" width="${r(4.4 * s)}" height="${r(3 * s)}" fill="#e9c27a" stroke="#c99a4a" stroke-width="${r(0.3 * s)}" stroke-dasharray="${r(0.4 * s)} ${r(0.25 * s)}"/><rect x="${r(x - 1.5 * s)}" y="${r(y - 0.9 * s)}" width="${r(3 * s)}" height="${r(1.8 * s)}" fill="none" stroke="#c99a4a" stroke-width=".15"/>`,
  waffel: (x, y, s) => `<rect x="${r(x - 2.2 * s)}" y="${r(y - 1.2 * s)}" width="${r(4.4 * s)}" height="${r(2.4 * s)}" fill="#e2b46a"/>` + [-1.4, -0.5, 0.4, 1.3].map((a) => `<line x1="${r(x + a * s)}" y1="${r(y - 1.2 * s)}" x2="${r(x + a * s)}" y2="${r(y + 1.2 * s)}" stroke="#b07c34" stroke-width=".2"/>`).join("") + `<line x1="${r(x - 2.2 * s)}" y1="${y}" x2="${r(x + 2.2 * s)}" y2="${y}" stroke="#b07c34" stroke-width=".2"/>`,
  roellchen: (x, y, s) => [-0.8, 0.8].map((b) => `<rect x="${r(x - 2.2 * s)}" y="${r(y + b * s - 0.6 * s)}" width="${r(4.2 * s)}" height="${r(1.2 * s)}" rx="${r(0.6 * s)}" fill="#e2b46a"/><circle cx="${r(x + 2 * s)}" cy="${r(y + b * s)}" r="${r(0.5 * s)}" fill="#6a3a1c" stroke="#e2b46a" stroke-width=".15"/>`).join(""),
  nuss: (x, y, s) => `<ellipse cx="${r(x - 1.2 * s)}" cy="${r(y)}" rx="${r(1 * s)}" ry="${r(0.6 * s)}" fill="#c98f52"/><path d="M${r(x)} ${r(y + 0.6 * s)} q${r(1 * s)} ${r(-2.2 * s)} ${r(2 * s)} 0" stroke="#e9cf9a" stroke-width="${r(0.6 * s)}" fill="none"/><circle cx="${r(x + 0.2 * s)}" cy="${r(y - 1 * s)}" r="${r(0.7 * s)}" fill="#9a6a3a"/>`,
  studenten: (x, y, s) => `<ellipse cx="${r(x - 1 * s)}" cy="${r(y)}" rx="${r(0.9 * s)}" ry="${r(0.55 * s)}" fill="#c98f52"/><ellipse cx="${r(x + 1 * s)}" cy="${r(y + 0.2 * s)}" rx="${r(0.6 * s)}" ry="${r(0.45 * s)}" fill="#3a1c2a"/><ellipse cx="${r(x + 0.2 * s)}" cy="${r(y - 0.9 * s)}" rx="${r(0.6 * s)}" ry="${r(0.45 * s)}" fill="#4a2030"/>`,
  dattel: (x, y, s) => [[-0.9, 0], [0.9, 0.2]].map(([a, b]) => `<ellipse cx="${r(x + a * s)}" cy="${r(y + b * s)}" rx="${r(1.4 * s)}" ry="${r(0.6 * s)}" fill="#6a3418" transform="rotate(-20 ${r(x + a * s)} ${r(y + b * s)})"/>`).join(""),
  trocken: (x, y, s) => `<circle cx="${r(x - 1 * s)}" cy="${r(y)}" r="${r(0.9 * s)}" fill="#f0a03a"/><circle cx="${r(x + 1 * s)}" cy="${r(y + 0.2 * s)}" r="${r(0.9 * s)}" fill="none" stroke="#e8c88a" stroke-width="${r(0.5 * s)}"/><ellipse cx="${r(x)}" cy="${r(y - 1 * s)}" rx="${r(0.8 * s)}" ry="${r(0.6 * s)}" fill="#5a2a3a"/>`,
  sesam: (x, y, s) => `<rect x="${r(x - 2.2 * s)}" y="${r(y - 0.8 * s)}" width="${r(4.4 * s)}" height="${r(1.6 * s)}" rx=".3" fill="#d9a85a"/>` + Array.from({ length: 10 }, (_, i) => `<ellipse cx="${r(x + (-1.8 + (i % 5) * 0.9) * s)}" cy="${r(y + (-0.35 + Math.floor(i / 5) * 0.7) * s)}" rx="${r(0.28 * s)}" ry="${r(0.16 * s)}" fill="#f7e7c0"/>`).join(""),
  kaugummi: (x, y, s) => [[-1.2, 0.3], [0.2, 0.4], [1.4, 0.2], [-0.5, -0.9], [0.9, -0.9]].map(([a, b], i) => `<ellipse cx="${r(x + a * s)}" cy="${r(y + b * s)}" rx="${r(0.7 * s)}" ry="${r(0.55 * s)}" fill="${["#f3f3f3", "#7fd1c0", "#f3f3f3", "#7fd1c0", "#f3f3f3"][i]}"/>`).join(""),
};
/* Eine Ware mit n Packungen nebeneinander in einem Fach (Fuß bei y). */
function ware(x0, x1, y, art, f) {
  const n = f.n || 3, w = (x1 - x0) / n;
  let g = "";
  for (let i = 0; i < n; i++) {
    const x = x0 + w * i + w / 2, pw = w * (f.breit || 0.86), ph = f.h || 12;
    const farbe = f.farben ? f.farben[i % f.farben.length] : f.farbe;
    if (art === "beutel") {
      /* Tüte mit gefalzter Siegelnaht oben, prall */
      g += `<path d="M${r(x - pw / 2)} ${r(y)} Q${r(x - pw / 2 - 0.6)} ${r(y - ph * 0.5)} ${r(x - pw / 2 + 0.3)} ${r(y - ph + 1.2)} L${r(x + pw / 2 - 0.3)} ${r(y - ph + 1.2)} Q${r(x + pw / 2 + 0.6)} ${r(y - ph * 0.5)} ${r(x + pw / 2)} ${r(y)} Z" fill="${farbe}"/>`;
      g += `<rect x="${r(x - pw / 2 + 0.3)}" y="${r(y - ph)}" width="${r(pw - 0.6)}" height="1.4" fill="${f.akzent || "#fff"}" opacity=".85"/>`;
      for (let j = 0; j < 6; j++) g += `<line x1="${r(x - pw / 2 + 0.8 + j * (pw - 1.6) / 5)}" y1="${r(y - ph)}" x2="${r(x - pw / 2 + 0.8 + j * (pw - 1.6) / 5)}" y2="${r(y - ph + 1.4)}" stroke="#000" stroke-width=".12" opacity=".3"/>`;
    } else if (art === "sack") {
      /* Papiertüte (Mehl): oben gefaltet */
      g += `<path d="M${r(x - pw / 2)} ${r(y)} L${r(x - pw / 2)} ${r(y - ph + 1.6)} L${r(x - pw / 2 + 1)} ${r(y - ph)} L${r(x + pw / 2 - 1)} ${r(y - ph)} L${r(x + pw / 2)} ${r(y - ph + 1.6)} L${r(x + pw / 2)} ${r(y)} Z" fill="${farbe}" stroke="#c9c0ae" stroke-width=".2"/>`;
      g += `<line x1="${r(x - pw / 2)}" y1="${r(y - ph + 2.2)}" x2="${r(x + pw / 2)}" y2="${r(y - ph + 2.2)}" stroke="#bdb4a2" stroke-width=".25"/>`;
    } else if (art === "dose") {
      g += `<rect x="${r(x - pw / 2)}" y="${r(y - ph)}" width="${r(pw)}" height="${r(ph)}" rx="${r(pw / 2.6)}" fill="${farbe}"/><rect x="${r(x - pw / 2)}" y="${r(y - ph)}" width="${r(pw)}" height="1.4" rx=".6" fill="#c9cfd4"/>`;
    } else {
      /* Karton / Schachtel */
      g += `<rect x="${r(x - pw / 2)}" y="${r(y - ph)}" width="${r(pw)}" height="${r(ph)}" rx=".5" fill="${farbe}"/>`;
      g += `<rect x="${r(x - pw / 2)}" y="${r(y - ph)}" width="${r(pw)}" height="${r(Math.min(2.4, ph * 0.22))}" fill="${f.akzent || "#fff"}" opacity=".8"/>`;
    }
    /* Sichtfenster bzw. Bild des Inhalts */
    const s = f.s || 1.1, my = y - ph * (f.my || 0.45);
    if (f.fenster) g += `<ellipse cx="${r(x)}" cy="${r(my)}" rx="${r(pw * 0.36)}" ry="${r(ph * 0.24)}" fill="#fffaf0" opacity=".9"/>`;
    g += MOTIV[f.motiv](x, my, s);
    if (f.text) g += `<text x="${r(x)}" y="${r(y - ph + (art === "beutel" ? 3.6 : 2.0))}" font-size="${f.fs || 1.6}" text-anchor="middle" fill="${f.tf || "#fff"}" font-family="Arial,sans-serif" font-weight="bold">${f.text}</text>`;
    g += `<rect x="${r(x - pw / 2 + 0.6)}" y="${r(y - ph + 1.6)}" width=".7" height="${r(ph - 2.6)}" fill="#fff" opacity=".22"/>`;
  }
  return g;
}

/* Regalgestell: Rückwand, Böden mit Preisschienen, Seitenwangen */
function regal(W, boeden, kopf) {
  const H = WAND_UNTEN - 34;
  let k = `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${S.lg("rueck", [[0, "#e4e6e8"], [1, "#cdd1d4"]])}"/>`;
  for (let y = -H + 2; y < 0; y += 2.4) k += `<line x1="${-W / 2}" y1="${y}" x2="${W / 2}" y2="${y}" stroke="#b9bec2" stroke-width=".2"/>`;
  k += `<rect x="${-W / 2}" y="${-H - 3}" width="${W}" height="4" fill="${kopf}"/>`;
  k += `<rect x="${-W / 2}" y="-6" width="${W}" height="6" fill="#9aa1a6"/>`;
  return { k, H, boden: (b) => `<rect x="${-W / 2}" y="${b}" width="${W}" height="1.4" fill="#d5d9dc"/><rect x="${-W / 2}" y="${b + 1.4}" width="${W}" height="2.2" fill="#f4f6f7"/><rect x="${-W / 2}" y="${b + 3.4}" width="${W}" height=".4" fill="#9aa1a6"/>`,
    wangen: `<rect x="${-W / 2 - 1.4}" y="${-H - 3}" width="2" height="${H + 3}" fill="${STAHL}"/><rect x="${W / 2 - 0.6}" y="${-H - 3}" width="2" height="${H + 3}" fill="${STAHL}"/>` };
}
function preis(x, y, t) { return `<rect x="${r(x - 3.4)}" y="${r(y + 1.6)}" width="6.8" height="1.9" fill="#fffde8"/><text x="${r(x)}" y="${r(y + 3.1)}" font-size="1.5" text-anchor="middle" fill="#222" font-family="Arial" font-weight="bold">${t}</text>`; }

/* =====================================================================
   1 — DAS REGAL „Knabbern & Backen“ (links) — Lupe
   ===================================================================== */
const BOEDEN = [-66, -50, -34, -18, -2];   // Standflächen relativ zum Wandfuß (y 52 … 116)
{
  const W = 62, cx = 35, R = regal(W, BOEDEN, "#2f6fb0");
  let k = R.k;
  const L = -W / 2 + 1, M = 0, Rr = W / 2 - 1;
  const fach = [
    ["popcorn", L, M, 0, "beutel", { farbe: "#d23b30", akzent: "#f6d24a", motiv: "popcorn", text: "POPCORN", fenster: true, h: 13 }],
    ["erdnussflips", M, Rr, 0, "beutel", { farbe: "#1f6fb5", akzent: "#f6d24a", motiv: "flip", text: "FLIPS", h: 14, s: 1.3 }],
    ["chips", L, M, 1, "beutel", { farbe: "#e8b21a", akzent: "#c8102e", motiv: "chip", text: "CHIPS", tf: "#c8102e", h: 14, s: 1.3 }],
    ["brezel", M, Rr, 1, "beutel", { farbe: "#2a5a9a", akzent: "#fff", motiv: "brezel", text: "BREZELN", h: 12, s: 1.1, fenster: true }],
    ["salzstange", L, M, 2, "karton", { farbe: "#1f4f8a", akzent: "#f6d24a", motiv: "stange", text: "SALZSTANGEN", fs: 1.1, h: 13, breit: 0.7 }],
    ["reiswaffel", M, Rr, 2, "beutel", { farbe: "#e9f1e4", akzent: "#5a9a3a", motiv: "reiswaffel", text: "REISWAFFELN", fs: 1.1, tf: "#3a7a2a", h: 9, s: 1.2 }],
    ["mehl", L, M, 3, "sack", { farbe: "#f4eddb", motiv: "aehre", text: "MEHL 405", tf: "#6b4a22", fs: 1.4, h: 13, s: 1.2, my: 0.55 }],
    ["zucker", M, Rr, 3, "karton", { farbe: "#f4f6f8", akzent: "#2f6fb0", motiv: "zucker", text: "ZUCKER", tf: "#2f6fb0", fs: 1.4, h: 11, s: 1 }],
  ];
  const W2 = { popcorn: "1,49", erdnussflips: "1,29", chips: "1,79", brezel: "1,19", salzstange: "0,89", reiswaffel: "1,39", mehl: "0,79", zucker: "1,09" };
  for (const b of BOEDEN) k += R.boden(b);
  for (const [, a, e, bi, art, f] of fach) k += ware(a, e, BOEDEN[bi], art, f);
  for (const [id, a, e, bi] of fach) k += preis((a + e) / 2, BOEDEN[bi], W2[id] + " €");
  /* unterster Boden: Großpackungen Chips als Vorrat */
  k += ware(L, Rr, BOEDEN[4], "beutel", { n: 5, farben: ["#e8b21a", "#2a8a3a", "#e8b21a", "#c8102e", "#e8b21a"], motiv: "chip", h: 13, s: 1.1 });
  k += R.wangen;
  const unter = [
    ["popcorn", "das Popcorn", "POP-corn", "i popcorn", "POP-corn", "popcorn", "Maiskörner platzen bei etwa 180 Grad auf, weil der Dampf im Korn den Druck sprengt. Der harte Rest der Schale sitzt oft noch am fertigen Popcorn."],
    ["erdnussflips", "die Erdnussflips", "ERD-nuss-flips", "i soffietti di arachidi", "sof-FIET-ti di a-RA-chi-di", "peanut puffs", "Aufgeschäumter Maisgrieß mit Erdnussmehl. Er ist innen löchrig wie ein Schwamm — darum ist die große Tüte so leicht."],
    ["chips", "die Chips", "CHIPS", "le patatine", "pa-ta-TI-ne", "crisps", "Gewellt geschnitten, in Fett ausgebacken und gesalzen. Die Tüte ist mit Stickstoff gefüllt, damit die Chips nicht zerbrechen — darum ist sie so prall."],
    ["brezel", "die Brezeln", "BRE-zeln", "i salatini", "sa-la-TI-ni", "pretzels", "Laugengebäck in klein. Vor dem Backen kommt das Teigstück kurz in Natronlauge — davon wird die Haut braun und glänzend."],
    ["salzstange", "die Salzstangen", "SALZ-stan-gen", "i grissini salati", "gris-SI-ni sa-LA-ti", "salt sticks", "Dünn, gesalzen, in der Schachtel. Im Osten wie im Westen stand sie auf jedem Geburtstagstisch."],
    ["reiswaffel", "die Reiswaffel", "REIS-waf-fel", "la galletta di riso", "gal-LET-ta di RI-so", "rice cake", "Reis- und Maiskörner werden unter Druck aufgepoppt und zu einem Fladen gepresst."],
    ["mehl", "das Mehl", "MEHL", "la farina", "fa-RI-na", "flour", "Gemahlenes Getreide. Die Typenzahl sagt, wie viele Mineralstoffe übrig sind: 405 ist hell, 1050 dunkler.", "backen_detail"],
    ["zucker", "der Zucker", "ZU-cker", "lo zucchero", "ZUC-che-ro", "sugar", "Kristallzucker aus der Zuckerrübe. Er rieselt und glitzert — Mehl dagegen staubt und klumpt."],
  ].map(([id, de, syl, it, itSyl, en, tipp, lupe]) => {
    const [, a, e, bi] = fach.find((f) => f[0] === id), w = e - a;
    const u = { id, de, syl, it, itSyl, en, tipp, x: cx + (a + e) / 2, y: WAND_UNTEN + BOEDEN[bi] + 3.6, kunst: flaeche(-w / 2 + 0.6, -18.6, w - 1.2, 18.4) };
    if (lupe) u.lupe = lupe;
    return u;
  });
  S.teil({ id: "regal", de: "das Regal", syl: "re-GAL", it: "lo scaffale", itSyl: "scaf-FA-le", en: "shelf", x: cx, y: WAND_UNTEN, steht: true, kunst: k,
    zoom: { x: 0, y: 28, w: 132, h: 88 }, unter });
}

/* =====================================================================
   2 — DAS SÜSSWARENREGAL (Schokolade, Pralinen, Riegel, Kekse) — Lupe
   ===================================================================== */
{
  const W = 82, cx = 111, R = regal(W, BOEDEN, "#b5263a");
  let k = R.k;
  const L = -W / 2 + 1, M = 0, Rr = W / 2 - 1;
  const fach = [
    ["praline", L, M, 0, "karton", { n: 2, farbe: "#7a1c2a", akzent: "#d8b44a", motiv: "praline", text: "PRALINEN", h: 9, s: 1.5, breit: 0.9, fenster: true }],
    ["halloren", M, Rr, 0, "karton", { n: 3, farbe: "#f2ead8", akzent: "#2a4a8a", motiv: "kugel", text: "Kugeln", tf: "#2a4a8a", h: 8, s: 1.3, fenster: false }],
    ["schokolade", L, M, 1, "karton", { n: 5, farben: ["#7b5fb0", "#2a7a3a", "#c8102e", "#7b5fb0", "#e08a1a"], akzent: "#fff", motiv: "schoko", text: "Schoko", fs: 1.2, h: 13, s: 0.8, breit: 0.8 }],
    ["puffreis", M, Rr, 1, "karton", { n: 5, farbe: "#3a4a8a", akzent: "#d82a2a", motiv: "puffreis", text: "Puffreis", fs: 1.1, h: 13, s: 0.8, breit: 0.8 }],
    ["schokoriegel", L, M, 2, "karton", { n: 2, farbe: "#2a1810", akzent: "#d82a2a", motiv: "riegel", text: "RIEGEL", h: 10, s: 1.5, breit: 0.92 }],
    ["knusperflocken", M, Rr, 2, "beutel", { n: 3, farbe: "#f4f0e2", akzent: "#c8102e", motiv: "knusper", text: "Knusper", tf: "#c8102e", fs: 1.3, h: 12, s: 1.2 }],
    ["schokokeks", L, M, 3, "dose", { n: 4, farbe: "#2f4f9a", motiv: "schokokeks", text: "", h: 12, s: 1, breit: 0.8, my: 0.5 }],
    ["keks", M, Rr, 3, "karton", { n: 3, farbe: "#f2c230", akzent: "#c8102e", motiv: "butterkeks", text: "BUTTERKEKS", tf: "#c8102e", fs: 1.1, h: 10, s: 1.15 }],
    ["waffel", L, M, 4, "karton", { n: 3, farbe: "#e9e2d0", akzent: "#2a7a3a", motiv: "waffel", text: "Waffeln", tf: "#2a7a3a", fs: 1.3, h: 11, s: 1.2 }],
    ["waffelroellchen", M, Rr, 4, "dose", { n: 4, farbe: "#8a2a4a", motiv: "roellchen", text: "", h: 13, s: 0.85, breit: 0.8, my: 0.5 }],
  ];
  const P = { praline: "4,99", halloren: "2,29", schokolade: "1,19", puffreis: "0,99", schokoriegel: "0,79", knusperflocken: "1,99", schokokeks: "1,69", keks: "1,29", waffel: "1,49", waffelroellchen: "2,49" };
  for (const b of BOEDEN) k += R.boden(b);
  for (const [, a, e, bi, art, f] of fach) k += ware(a, e, BOEDEN[bi], art, f);
  for (const [id, a, e, bi] of fach) k += preis((a + e) / 2, BOEDEN[bi], P[id] + " €");
  k += R.wangen;
  const T = {
    praline: ["die Pralinen", "Pra-LI-nen", "i cioccolatini", "cioc-co-la-TI-ni", "pralines", "Gefüllte Schokoladenstücke in der Schachtel, jedes in seiner eigenen Papiermanschette."],
    halloren: ["die Halloren-Kugeln", "Hal-LO-ren-Ku-geln", "le palline di cioccolato di Halle", "pal-LI-ne di cioc-co-LA-to di HAL-le", "Halloren chocolate balls", "Halbkugeln mit Sahne-Kakao-Füllung aus Halle an der Saale — aus der ältesten Schokoladenfabrik Deutschlands. Die Form geht auf die silbernen Knöpfe der Halloren-Tracht zurück."],
    schokolade: ["die Tafel Schokolade", "TA-fel Scho-ko-LA-de", "la tavoletta di cioccolato", "ta-vo-LET-ta di cioc-co-LA-to", "bar of chocolate", "Eine Tafel wird in Rippen geteilt, damit man sie brechen kann. Die Prozentzahl auf der Banderole sagt, wie viel Kakao darin ist."],
    puffreis: ["die Puffreisschokolade", "PUFF-reis-scho-ko-la-de", "il cioccolato al riso soffiato", "cioc-co-LA-to al RI-so sof-FIA-to", "puffed rice chocolate", "Schokolade mit ganzen Puffreiskörnern. In der DDR war sie eine der wenigen Tafeln, die es fast immer gab."],
    schokoriegel: ["der Schokoriegel", "SCHO-ko-rie-gel", "la barretta di cioccolato", "bar-RET-ta di cioc-co-LA-to", "chocolate bar", "Nougat und Karamell mit Nüssen, außen Schokolade. Im Anschnitt sieht man die Schichten."],
    knusperflocken: ["die Knusperflocken", "KNUS-per-flo-cken", "i fiocchi croccanti al cioccolato", "FIOC-chi croc-CAN-ti al cioc-co-LA-to", "chocolate cornflake clusters", "Cornflakes in Schokolade, aus Sachsen-Anhalt. Sie kamen 1959 auf den Markt und sind bis heute eine der bekanntesten Süßigkeiten aus dem Osten."],
    schokokeks: ["der Schokokeks", "SCHO-ko-keks", "il biscotto al cioccolato", "bi-SCOT-to al cioc-co-LA-to", "chocolate biscuit", "Ein Keks mit Schokoladendecke. Der Kamm zieht die Wellen hinein, solange die Schokolade noch weich ist."],
    keks: ["der Butterkeks", "BUT-ter-keks", "il biscotto al burro", "bi-SCOT-to al BUR-ro", "butter biscuit", "Der Butterkeks: ein Rechteck mit gezacktem Rand, geprägtem Innenrahmen und Einstichlöchern. Seit 1891 wird er in Hannover gebacken."],
    waffel: ["die Waffel", "WAF-fel", "la cialda", "CIAL-da", "waffle", "Teig zwischen zwei heißen Eisen gebacken. Die tiefen Mulden des Eisens prägen das Muster — dafür ist die Waffel bekannt."],
    waffelroellchen: ["die Waffelröllchen", "WAF-fel-röll-chen", "i cannoli di cialda", "can-NO-li di CIAL-da", "wafer rolls", "Ein dünnes Waffelblatt, um Nusscreme gerollt. Am Bruch sieht man die Spirale."],
  };
  const unter = fach.map(([id, a, e, bi]) => {
    const [de, syl, it, itSyl, en, tipp] = T[id], w = e - a;
    return { id, de, syl, it, itSyl, en, tipp, x: cx + (a + e) / 2, y: WAND_UNTEN + BOEDEN[bi] + 3.6, kunst: flaeche(-w / 2 + 0.6, -18.6, w - 1.2, 18.4) };
  });
  S.teil({ id: "suesswarenregal", de: "das Süßwarenregal", syl: "SÜSS-wa-ren-re-gal", it: "lo scaffale dei dolciumi", itSyl: "scaf-FA-le dei dol-CIU-mi", en: "sweets shelf", x: cx, y: WAND_UNTEN, steht: true, kunst: k,
    zoom: { x: 46, y: 28, w: 132, h: 88 }, unter, tipp: "Im Süßwarenregal ist alles nach Sorten geordnet: Schokolade, Riegel, Kekse." });
}

/* =====================================================================
   3 — DER SÜSSIGKEITENSTAND: Gläser zum Selbstabfüllen — Lupe
   ===================================================================== */
const ST = { x0: 206, x1: 316 };
{
  const W = ST.x1 - ST.x0, cx = (ST.x0 + ST.x1) / 2;
  let k = schatten(0, 0, W / 2 + 2, 1.4, 0.3);
  /* Holzregal: Rückwand, zwei Böden, Unterschrank mit Platte (0,9 m) */
  k += `<rect x="${-W / 2}" y="-84" width="${W}" height="84" fill="${S.lg("standrueck", [[0, "#f6e3c4"], [1, "#e9cfa6"]])}"/>`;
  k += `<rect x="${-W / 2 - 2}" y="-86" width="${W + 4}" height="3" rx="1" fill="${HOLZ_V}"/>`;
  const RB = [-60, -38];                 // Gläserböden
  for (const b of RB) k += `<rect x="${-W / 2}" y="${b}" width="${W}" height="2.2" fill="${HOLZ}"/><rect x="${-W / 2}" y="${b + 2.2}" width="${W}" height=".6" fill="#7a5530"/>`;
  k += `<rect x="${-W / 2}" y="-36" width="${W}" height="36" fill="${HOLZ_V}"/>`;
  k += `<rect x="${-W / 2 - 1.5}" y="-37" width="${W + 3}" height="2.6" rx=".8" fill="#e9dcc4"/>`;
  for (let x = -W / 2 + 3; x < W / 2 - 3; x += 26.5) k += `<rect x="${r(x)}" y="-31" width="24" height="26" rx="1" fill="none" stroke="#6e4426" stroke-width=".6"/>`;
  k += `<rect x="${-W / 2}" y="-4" width="${W}" height="4" fill="#5a3820"/>`;
  k += `<rect x="${-W / 2 - 2}" y="-86" width="2" height="86" fill="${HOLZ_V}"/><rect x="${W / 2}" y="-86" width="2" height="86" fill="${HOLZ_V}"/>`;
  /* Preisschild */
  k += `<rect x="-16" y="-83.4" width="32" height="5.6" rx=".8" fill="#fff"/><text x="0" y="-79.6" font-size="3" text-anchor="middle" fill="#c8102e" font-family="Arial" font-weight="bold">100 g = 0,99 €</text>`;
  /* Bonbonglas: Fuß bei (x, y), Füllung über füll(x, y) */
  const glas = (x, y, fuell) => {
    let g = `<rect x="${x - 6.4}" y="${y - 15.2}" width="12.8" height="2.4" rx=".8" fill="${STAHL}"/><rect x="${x - 1.6}" y="${y - 16.6}" width="3.2" height="1.6" rx=".6" fill="#9aa3aa"/>`;
    g += `<path d="M${x - 6} ${y - 12.8} L${x + 6} ${y - 12.8} Q${x + 7} ${y - 12} ${x + 7} ${y - 10} L${x + 7} ${y - 1} Q${x + 7} ${y} ${x + 6} ${y} L${x - 6} ${y} Q${x - 7} ${y} ${x - 7} ${y - 1} L${x - 7} ${y - 10} Q${x - 7} ${y - 12} ${x - 6} ${y - 12.8} Z" fill="#eef6f8" opacity=".55"/>`;
    g += fuell;
    g += `<path d="M${x - 6} ${y - 12.6} L${x + 6} ${y - 12.6} Q${x + 7} ${y - 12} ${x + 7} ${y - 10} L${x + 7} ${y - 1} Q${x + 7} ${y} ${x + 6} ${y} L${x - 6} ${y} Q${x - 7} ${y} ${x - 7} ${y - 1} L${x - 7} ${y - 10} Q${x - 7} ${y - 12} ${x - 6} ${y - 12.6} Z" fill="none" stroke="#b9cfd6" stroke-width=".4"/>`;
    g += `<rect x="${x - 5.6}" y="${y - 11}" width="1.1" height="9.6" rx=".5" fill="#fff" opacity=".6"/>`;
    return g;
  };
  const haufen = (x, y, n, fn) => { let g = ""; for (let i = 0; i < n; i++) { const t = i / n; g += fn(x - 4.6 + rnd() * 9.2, y - 1.6 - t * 8.4 - rnd() * 1, i); } return g; };
  const gummi = (x, y, i) => { const f = ["#e8262a", "#f6c21a", "#2ea44a", "#f08a1a", "#f2f2ec", "#d02a7a"][i % 6]; return `<g transform="translate(${r(x)} ${r(y)})"><circle cx="0" cy="-1.3" r=".75" fill="${f}" opacity=".95"/><ellipse cx="0" cy="0" rx="1" ry="1.05" fill="${f}" opacity=".95"/><circle cx="-.55" cy="-1.9" r=".32" fill="${f}"/><circle cx=".55" cy="-1.9" r=".32" fill="${f}"/></g>`; };
  const lakritz = (x, y) => `<circle cx="${r(x)}" cy="${r(y)}" r="1.5" fill="#151312"/><path d="M${r(x - 0.9)} ${r(y)} a.9 .9 0 1 1 .9 .9 a.5 .5 0 1 1 -.4 -.6" stroke="#3a3533" stroke-width=".3" fill="none"/>`;
  const bonbon = (x, y, i) => { const f = ["#e8262a", "#2f6fd0", "#f6c21a", "#2ea44a"][i % 4]; return `<g transform="translate(${r(x)} ${r(y)}) rotate(${Math.round(rnd() * 60 - 30)})"><ellipse rx="1.3" ry=".9" fill="${f}"/><path d="M-1.2 0 l-1 -.8 l0 1.6 Z M1.2 0 l1 -.8 l0 1.6 Z" fill="${f}" opacity=".8"/><path d="M-.6 -.4 l1 0" stroke="#fff" stroke-width=".25"/></g>`; };
  const kugel = (x, y, i) => `<circle cx="${r(x)}" cy="${r(y)}" r="1.1" fill="${["#f2f2ec", "#7fd1c0", "#f6a6c8", "#f6e27a"][i % 4]}"/><circle cx="${r(x - 0.35)}" cy="${r(y - 0.4)}" r=".3" fill="#fff" opacity=".8"/>`;
  const schaum = (x, y, i) => `<ellipse cx="${r(x)}" cy="${r(y)}" rx="1.4" ry=".9" fill="${i % 2 ? "#f6b6c8" : "#f4f1ea"}"/>`;
  const wein = (x, y, i) => `<rect x="${r(x - 0.9)}" y="${r(y - 0.7)}" width="1.8" height="1.4" rx=".4" fill="${["#9a1a3a", "#e8862a", "#4a1a5a", "#e8c21a"][i % 4]}" opacity=".9"/>`;
  const G = [   // [id, Bodenindex, x, Füllung]
    ["gummibaerchen", 0, -42, ""],
    ["lakritz", 0, -14, ""],
    ["bonbon", 0, 14, ""],
    ["kaugummi", 0, 42, ""],
    ["schaumzucker", 1, -42, ""],
    ["lutscher", 1, -14, ""],
    ["weingummi", 1, 14, ""],
  ];
  const fuellung = {
    gummibaerchen: (x, y) => haufen(x, y, 34, gummi), lakritz: (x, y) => haufen(x, y, 18, lakritz), bonbon: (x, y) => haufen(x, y, 22, bonbon),
    kaugummi: (x, y) => haufen(x, y, 40, kugel), schaumzucker: (x, y) => haufen(x, y, 26, schaum), weingummi: (x, y) => haufen(x, y, 34, wein),
    saure: (x, y) => haufen(x, y, 24, (a, b, i) => `<path d="M${r(a - 1.6)} ${r(b)} q1.6 -1 3.2 0" stroke="${["#e8262a", "#2ea44a", "#f6c21a"][i % 3]}" stroke-width=".7" fill="none"/>`),
  };
  for (const [id, bi, x] of G) {
    const y = RB[bi];
    if (id === "lutscher") {
      /* Lutscherständer: Lutscher mit Spirale stecken im Glas */
      let g = "";
      for (let i = 0; i < 7; i++) {
        const lx = x - 6 + i * 2, ly = y - 16 - (i % 2) * 2.4 - (i === 3 ? 1.6 : 0), f = ["#e8262a", "#2f6fd0", "#f6c21a", "#d02a7a", "#2ea44a", "#f08a1a", "#7b5fb0"][i];
        g += `<line x1="${r(lx)}" y1="${r(ly)}" x2="${r(x - 2 + i * 0.6)}" y2="${y - 6}" stroke="#f4f2ec" stroke-width=".45"/>`;
        g += `<circle cx="${r(lx)}" cy="${r(ly)}" r="2.2" fill="${f}"/><path d="M${r(lx - 1.4)} ${r(ly)} a1.4 1.4 0 0 1 2.8 0 a1 1 0 0 1 -2 0 a.6 .6 0 0 1 1.2 0" stroke="#fff" stroke-width=".45" fill="none"/>`;
      }
      k += g + glas(x, y, `<rect x="${x - 6.6}" y="${y - 6}" width="13.2" height="5.8" rx="1" fill="#f6e7c8" opacity=".8"/>`).replace(/<rect x="[^"]*" y="[^"]*" width="12.8"[^>]*\/><rect x="[^"]*" y="[^"]*" width="3.2"[^>]*\/>/, "");
    } else k += glas(x, y, fuellung[id](x, y));
    /* Schaufel steckt am Glas */
    if (id !== "lutscher") k += `<path d="M${x + 3.6} ${y - 13.4} L${x + 6.2} ${y - 16}" stroke="#d9dde0" stroke-width=".7"/><path d="M${x + 5.8} ${y - 17} l2 .8 l-.8 2 Z" fill="#e3e7ea"/>`;
  }
  /* Auf der Platte: Tütenspender (Waage folgt als eigenes Teil) */
  k += `<rect x="23" y="-46" width="11" height="9" rx=".6" fill="${STAHL}"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${24 + i * 0.4} ${-45 - i * 0.6} l9 0 l-.4 -3.4 l-8.2 0 Z" fill="#f2f6f8" opacity=".85" stroke="#b9c6cc" stroke-width=".2"/>`;
  k += `<text x="28.5" y="-38.6" font-size="1.7" text-anchor="middle" fill="#555" font-family="Arial">Tüten</text>`;
  const T = {
    gummibaerchen: ["die Gummibärchen", "GUM-mi-bär-chen", "gli orsetti gommosi", "or-SET-ti gom-MO-si", "gummy bears", "Weiche Bärchen aus Fruchtsaft, Zucker und Gelatine. Erfunden wurden sie 1922 in Bonn."],
    lakritz: ["das Lakritz", "La-KRITZ", "la liquirizia", "li-qui-RI-zia", "liquorice", "Aus dem Saft der Süßholzwurzel. Es gibt ihn als aufgerollte Schnecke, als geprägten Taler und als Stange."],
    bonbon: ["das Bonbon", "Bon-BON", "la caramella", "ca-ra-MEL-la", "sweet", "Gekochter Zucker, hart geworden. Das Papier ist an beiden Enden eingedreht — daran erkennt man ein Bonbon von weitem."],
    kaugummi: ["der Kaugummi", "KAU-gum-mi", "la gomma da masticare", "GOM-ma da ma-sti-CA-re", "chewing gum", "Kaumasse mit Zucker und Minzöl. Es gibt ihn als Streifen im Silberpapier und als Dragee mit harter Hülle — hier als bunte Kugeln."],
    lutscher: ["der Lutscher", "LUT-scher", "il lecca-lecca", "lec-ca-LEC-ca", "lollipop", "Ein Bonbon am Stiel. Die Farbspirale entsteht, weil man verschieden gefärbte Zuckerstränge zusammen aufrollt."],
  };
  const unter = Object.keys(T).map((id) => {
    const [, bi, x] = G.find((g) => g[0] === id), [de, syl, it, itSyl, en, tipp] = T[id];
    return { id, de, syl, it, itSyl, en, tipp, x: cx + x, y: WAND_UNTEN + RB[bi], kunst: flaeche(-8.5, id === "lutscher" ? -20 : -17.4, 17, id === "lutscher" ? 20.2 : 17.6) };
  });
  S.teil({ id: "suessigkeitenstand", de: "der Süßigkeitenstand", syl: "SÜ-ßig-kei-ten-stand", it: "il banco dei dolciumi", itSyl: "BAN-co dei dol-CIU-mi", en: "pick-and-mix stand", x: cx, y: WAND_UNTEN, steht: true, kunst: k,
    zoom: { x: ST.x0 - 6, y: 30, w: 118, h: 79 }, unter, tipp: "Hier füllt man sich die Süßigkeiten selbst in eine Tüte und bezahlt nach Gewicht." });
}
{
  /* DIE WAAGE auf der Platte des Standes */
  let k = schatten(0, 0.2, 7, 0.8, 0.3);
  k += `<rect x="-7" y="-3" width="14" height="3" rx=".8" fill="#e9ecee"/><rect x="-6" y="-4.2" width="12" height="1.4" rx=".5" fill="${STAHL}"/>`;
  k += `<rect x="1.4" y="-11" width="5.4" height="7" rx=".6" fill="#2a2e33"/><rect x="2" y="-10.3" width="4.2" height="2.6" fill="#9cd3e8"/><text x="4.1" y="-8.4" font-size="1.5" text-anchor="middle" fill="#0b3b52" font-family="monospace">210 g</text>`;
  k += `<rect x="2.2" y="-7" width="3.8" height="2.4" fill="#555"/>`;
  /* eine gefüllte Tüte liegt auf der Waage */
  k += `<path d="M-5.6 -4.2 L-1 -4.2 L-.6 -9 L-6 -9 Z" fill="#f2f6f8" opacity=".75" stroke="#b9c6cc" stroke-width=".2"/>`;
  for (let i = 0; i < 8; i++) k += `<circle cx="${r(-5 + rnd() * 3.8)}" cy="${r(-5 + -rnd() * 3)}" r=".55" fill="${["#e8262a", "#f6c21a", "#2ea44a", "#f08a1a"][i % 4]}"/>`;
  S.teil({ oben: true, id: "waage", de: "die Waage", syl: "WAA-ge", it: "la bilancia", itSyl: "bi-LAN-cia", en: "scale", x: ST.x1 - 9, y: WAND_UNTEN - 37, kunst: k,
    tipp: "Die Waage druckt einen Aufkleber mit Gewicht und Preis für die Tüte." });
}

/* =====================================================================
   4 — DER AUFSTELLER aus Pappe (Nüsse, Trockenfrüchte, Riegel) — Lupe
   ===================================================================== */
const AU = { x: 179, y: 152 };
{
  const M = mass(AU.y), W = 0.6 * M, H = 1.55 * M;   // ≈ 29 × 76
  let k = schatten(0, 0, W / 2 + 3, 1.6, 0.35);
  /* Kopfschild */
  k += `<path d="M${-W / 2 - 1} ${r(-H)} L${W / 2 + 1} ${r(-H)} L${W / 2 + 1} ${r(-H + 13)} L${-W / 2 - 1} ${r(-H + 13)} Z" fill="${S.lg("aufkopf", [[0, "#3a8a3a"], [1, "#256a28"]])}"/>`;
  k += `<text x="0" y="${r(-H + 6)}" font-size="4.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Nuss-Zeit!</text><text x="0" y="${r(-H + 10.6)}" font-size="2.6" text-anchor="middle" fill="#f6e27a" font-family="Arial">Nüsse · Früchte · Riegel</text>`;
  /* Korpus mit vier Fächern */
  k += `<rect x="${r(-W / 2)}" y="${r(-H + 13)}" width="${r(W)}" height="${r(H - 13)}" fill="${S.lg("aufkorp", [[0, "#f4ead2"], [1, "#e2d2ae"]], 0, 0, 1, 0)}"/>`;
  const fy = [-H + 30, -H + 46, -H + 62, -6].map(r);
  for (const y of fy) k += `<rect x="${r(-W / 2)}" y="${y}" width="${r(W)}" height="3" fill="#3a8a3a"/><rect x="${r(-W / 2)}" y="${y}" width="${r(W)}" height=".8" fill="#6ab06a"/>`;
  const L = -W / 2 + 1, Mi = 0, R = W / 2 - 1;
  const fach = [
    ["nussmischung", L, Mi, 0, { n: 2, farbe: "#8a5a2a", akzent: "#f6e27a", motiv: "nuss", text: "Nüsse", fs: 1.3, h: 13, s: 1.2, fenster: true }],
    ["studentenfutter", Mi, R, 0, { n: 2, farbe: "#c8501a", akzent: "#fff", motiv: "studenten", text: "Studentenfutter", fs: 0.95, h: 13, s: 1.3, fenster: true }],
    ["datteln", L, Mi, 1, { n: 2, farbe: "#f2e6c8", akzent: "#6a3418", motiv: "dattel", text: "Datteln", tf: "#6a3418", fs: 1.3, h: 12, s: 1.3, fenster: false }],
    ["trockenfruechte", Mi, R, 1, { n: 2, farbe: "#f08a1a", akzent: "#fff", motiv: "trocken", text: "Früchte", fs: 1.3, h: 13, s: 1.3, fenster: true }],
    ["sesamriegel", L, R, 2, { n: 4, farbe: "#d9a85a", akzent: "#7a4a1a", motiv: "sesam", text: "Sesam", fs: 1.1, h: 10, s: 0.75, breit: 0.88 }],
  ];
  for (const [, a, e, bi, f] of fach) k += ware(a, e, fy[bi], "beutel", f);
  /* unten: Nussbeutel als Vorrat */
  k += ware(L, R, fy[3], "beutel", { n: 3, farbe: "#8a5a2a", akzent: "#f6e27a", motiv: "nuss", h: 12, s: 1 });
  k += `<rect x="${r(-W / 2)}" y="${r(-H + 13)}" width="1.2" height="${r(H - 13)}" fill="#c9b78e"/><rect x="${r(W / 2 - 1.2)}" y="${r(-H + 13)}" width="1.2" height="${r(H - 13)}" fill="#c9b78e"/>`;
  const T = {
    nussmischung: ["die Nussmischung", "NUSS-mi-schung", "la frutta secca", "FRUT-ta SEC-ca", "mixed nuts", "Mandeln, Haselnüsse, Cashews, Walnüsse und Erdnüsse — jede Nuss hat ihre eigene Form."],
    studentenfutter: ["das Studentenfutter", "Stu-DEN-ten-fut-ter", "il mix di frutta secca e uvetta", "MIX di FRUT-ta SEC-ca e u-VET-ta", "trail mix", "Nüsse und Rosinen zusammen. Der Name ist alt: Studenten konnten sich früher wenig anderes leisten."],
    datteln: ["die Datteln", "DAT-teln", "i datteri", "DAT-te-ri", "dates", "Die getrocknete Frucht der Dattelpalme. Aufgeschnitten sieht man den länglichen Kern."],
    trockenfruechte: ["die Trockenfrüchte", "TRO-cken-früch-te", "la frutta essiccata", "FRUT-ta es-sic-CA-ta", "dried fruit", "Aprikose, Feige, Apfelring und Backpflaume — an der Form unterscheidet man sie, nicht an der Farbe."],
    sesamriegel: ["der Sesamriegel", "SE-sam-rie-gel", "la barretta di sesamo", "bar-RET-ta di SE-sa-mo", "sesame bar", "Sesamkörner, in Honig zusammengebacken. Man erkennt jedes einzelne Korn."],
  };
  const unter = fach.map(([id, a, e, bi]) => {
    const [de, syl, it, itSyl, en, tipp] = T[id], w = e - a, top = bi === 0 ? -H + 13 : fy[bi - 1] + 3;
    return { id, de, syl, it, itSyl, en, tipp, x: AU.x + (a + e) / 2, y: AU.y + fy[bi], kunst: flaeche(-w / 2 + 0.4, top - fy[bi] + 0.2, w - 0.8, fy[bi] - top - 0.2) };
  });
  S.teil({ id: "aufsteller", de: "der Aufsteller", syl: "AUF-stel-ler", it: "l'espositore", itSyl: "e-spo-si-TO-re", en: "display stand", x: AU.x, y: AU.y, steht: true, kunst: k,
    zoom: { x: AU.x - 42, y: r(AU.y - H + 10), w: 84, h: 56 }, unter, tipp: "Auf dem Aufsteller aus Pappe steht die Ware der Woche." });
}

/* =====================================================================
   5 — DIE TIEFKÜHLTRUHE (vorne Mitte) mit EIS AM STIEL und EISWAFFEL
   ===================================================================== */
const TR = { x: 128, y: 193 };
const TM = mass(TR.y), TW = 2.0 * TM, TH = 0.85 * TM, TT = 9;   // Breite, Höhe, sichtbare Tiefe der Öffnung
const tSh = (x, t) => x + (160 - (TR.x + x)) * (t * TT / (TR.y - TH + 60)) * 1.4;   // Rückkante rückt zum Fluchtpunkt
{
  let k = schatten(0, 0, TW / 2 + 3, 2, 0.35);
  /* Korpus */
  k += `<rect x="${r(-TW / 2)}" y="${r(-TH)}" width="${r(TW)}" height="${r(TH)}" rx="2" fill="${S.lg("truhe", [[0, "#ffffff"], [0.6, "#eef2f4"], [1, "#cfd6da"]])}"/>`;
  k += `<rect x="${r(-TW / 2)}" y="-6" width="${r(TW)}" height="6" fill="#4a5056"/>`;
  for (let x = -TW / 2 + 6; x < TW / 2 - 6; x += 2.4) k += `<rect x="${r(x)}" y="-5" width="1.2" height="3.6" rx=".4" fill="#2a2f33"/>`;
  k += `<rect x="${r(-TW / 2 + 8)}" y="${r(-TH + 10)}" width="${r(TW - 16)}" height="14" rx="2" fill="${S.lg("truhenband", [[0, "#2f6fd0"], [1, "#1f4f9a"]])}"/>`;
  k += `<text x="0" y="${r(-TH + 19.6)}" font-size="7" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" letter-spacing=".8">EISZEIT</text>`;
  for (const x of [-TW / 2 + 14, TW / 2 - 14]) k += `<text x="${r(x)}" y="${r(-TH + 20)}" font-size="7" text-anchor="middle" fill="#bfe3ff" font-family="Arial">❄</text>`;
  /* Öffnung von oben: Innenraum, darin das Eis, Glasdeckel als Rahmen */
  const y0 = -TH, y1 = -TH - TT;
  k += `<path d="M${r(-TW / 2 + 1)} ${r(y0)} L${r(TW / 2 - 1)} ${r(y0)} L${r(tSh(TW / 2 - 1, 1))} ${r(y1)} L${r(tSh(-TW / 2 + 1, 1))} ${r(y1)} Z" fill="${S.lg("truheninnen", [[0, "#a9c4d4"], [1, "#e4f0f6"]])}"/>`;
  /* Füllware (Packungen) im Innenraum — ohne die beiden Wörter */
  for (let i = 0; i < 7; i++) {
    const t = 0.5, x = tSh(-TW / 2 + 18 + i * 13, t) + (i % 2) * 1.6;
    if (i === 1 || i === 4) continue;
    k += `<path d="M${r(x - 5)} ${r(y0 - 1)} L${r(x + 5)} ${r(y0 - 1)} L${r(x + 4.4)} ${r(y0 - 6.4)} L${r(x - 4.4)} ${r(y0 - 6.4)} Z" fill="${["#e8262a", "#f6c21a", "#2f6fd0", "#2ea44a", "#7b5fb0", "#f08a1a", "#e8262a"][i]}"/><rect x="${r(x - 3.6)}" y="${r(y0 - 5.4)}" width="7.2" height="1.2" fill="#fff" opacity=".7"/>`;
  }
  k += `<path d="M${r(-TW / 2)} ${r(y0)} L${r(TW / 2)} ${r(y0)} L${r(tSh(TW / 2, 1))} ${r(y1)} L${r(tSh(-TW / 2, 1))} ${r(y1)} Z" fill="none" stroke="#9aa3aa" stroke-width="1.2" stroke-linejoin="round"/>`;
  k += `<line x1="${r(tSh(0, 0) - 0)}" y1="${r(y0)}" x2="${r(tSh(0, 1))}" y2="${r(y1)}" stroke="#9aa3aa" stroke-width=".8"/>`;
  k += `<rect x="${r(-TW / 2)}" y="${r(y0 - 0.4)}" width="${r(TW)}" height="1.6" rx=".6" fill="#dfe5e8"/>`;
  S.teil({ id: "tiefkuehltruhe", de: "die Tiefkühltruhe", syl: "TIEF-kühl-tru-he", it: "il congelatore a pozzetto", itSyl: "con-ge-la-TO-re a poz-ZET-to", en: "chest freezer", x: TR.x, y: TR.y, steht: true, kunst: k,
    tipp: "In der Tiefkühltruhe ist es minus 18 Grad kalt." });
  S.davor(`<path d="M${r(TR.x - TW / 2 + 1)} ${r(TR.y - TH)} L${r(TR.x + TW / 2 - 1)} ${r(TR.y - TH)} L${r(TR.x + tSh(TW / 2 - 1, 1))} ${r(TR.y - TH - TT)} L${r(TR.x + tSh(-TW / 2 + 1, 1))} ${r(TR.y - TH - TT)} Z" fill="${GLAS}"/><path d="M${r(TR.x - 20)} ${r(TR.y - TH)} L${r(TR.x - 10)} ${r(TR.y - TH - TT)} L${r(TR.x - 4)} ${r(TR.y - TH - TT)} L${r(TR.x - 14)} ${r(TR.y - TH)} Z" fill="#fff" opacity=".22"/>`);
}
{
  /* DAS EIS AM STIEL: Großpackung mit Bild und zwei einzeln verpackte */
  const x = tSh(-TW / 2 + 31, 0.5);
  let k = `<path d="M-6 0 L6 0 L5.4 -6.6 L-5.4 -6.6 Z" fill="#5a2e14"/><rect x="-4.6" y="-5.8" width="9.2" height="1.4" fill="#f6e27a"/>`;
  k += `<g transform="translate(-1.4 -1) rotate(-20)"><rect x="-1.1" y="-3.6" width="2.2" height="3.6" rx="1" fill="#4a230e"/><rect x="-.3" y="0" width=".6" height="1.6" fill="#e8d2a6"/><path d="M-1.1 -3.6 a1.1 1.1 0 0 1 2.2 0 l0 .9 l-2.2 .4 Z" fill="#f4ead2"/></g>`;
  k += `<g transform="translate(2.6 -1) rotate(15)"><rect x="-1.1" y="-3.6" width="2.2" height="3.6" rx="1" fill="#4a230e"/><rect x="-.3" y="0" width=".6" height="1.6" fill="#e8d2a6"/></g>`;
  S.teil({ oben: true, id: "eis", de: "das Eis am Stiel", syl: "EIS am STIEL", it: "il ghiacciolo", itSyl: "ghiac-CIO-lo", en: "ice lolly", x: TR.x + x, y: TR.y - TH - 1, kunst: k,
    tipp: "Eis am Stiel mit Schokoladenhülle — im Supermarkt gibt es es einzeln oder im Sechserpack." });
}
{
  /* DIE EISWAFFEL: Waffeltüten mit Papierhütchen im Karton */
  const x = tSh(-TW / 2 + 70, 0.5);
  let k = `<path d="M-6.4 0 L6.4 0 L5.8 -4 L-5.8 -4 Z" fill="#f2f6f8" stroke="#b9c6cc" stroke-width=".2"/>`;
  for (let i = 0; i < 4; i++) {
    const cx = -4.5 + i * 3;
    k += `<path d="M${cx - 1.3} -6.6 L${cx + 1.3} -6.6 L${cx} -1.4 Z" fill="${S.lg("waffeltuete", [[0, "#e2b46a"], [1, "#b07c34"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${cx - 1} -5.6 l2 0 M${cx - 0.7} -4.4 l1.4 0" stroke="#9a6a2a" stroke-width=".18"/>`;
    k += `<path d="M${cx - 1.4} -6.6 Q${cx} -9 ${cx + 1.4} -6.6 Z" fill="${["#f6a6c8", "#f4ead2", "#4a230e", "#f6e27a"][i]}" stroke="#fff" stroke-width=".2"/>`;
  }
  S.teil({ oben: true, id: "eiswaffel", de: "die Eiswaffel", syl: "EIS-waf-fel", it: "il cono gelato", itSyl: "CO-no ge-LA-to", en: "ice cream cone", x: TR.x + x, y: TR.y - TH - 1, kunst: k,
    tipp: "Das Eis in der Waffeltüte ist mit einem Papierhütchen zugedeckt. Das Rautenmuster kommt vom Waffeleisen." });
}

/* =====================================================================
   6 — DAS KIND (vorne rechts), es zeigt auf die Gläser
   ===================================================================== */
{
  const m = B.mensch({ id: "sw_kind", alter: "kind", geschlecht: "m", pose: "zeigen", blick: -35, frisur: "kurz", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "gelb" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 1.32 * mass(196));
  S.teil({ id: "kind", de: "das Kind", syl: "KIND", it: "il bambino", itSyl: "bam-BI-no", en: "child", x: 278, y: 196, kunst: m.svg,
    tipp: "Das Kind fragt: „Darf ich mir eine Tüte Gummibärchen abfüllen?“" });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/suessigkeiten.js"));
console.log(aus);
