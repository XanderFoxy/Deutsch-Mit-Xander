#!/usr/bin/env node
/* =====================================================================
   MATERIALIEN & PFAND (FASSUNG 852) — Bilderwelt neu: der Wertstoffhof
   ---------------------------------------------------------------------
   Früher eine Sammlung von Kacheln, jetzt der Ort, an dem man die
   Materialien wirklich nach Stoff getrennt sieht: ein Wertstoffhof
   (Recyclinghof) einer deutschen Stadt.

   RECHERCHE (Annahmelisten und Preislisten von Wertstoffhöfen, z. B.
   Würzburg, Uelzen; Altreifen kosten Gebühr, Bauschutt je m³):
   - Hinten in einer Reihe die großen Abrollcontainer (6 m lang, die
     Stirnseite zum Hof), jeder mit Schild: Altholz, Metall/Schrott,
     Bauschutt (Beton, Ziegel, Fliesen, Pflastersteine), Papier & Pappe.
   - Rechts die Glascontainer: Weißglas, Grünglas, Braunglas.
   - Vorn auf dem gepflasterten Hof: eine Gitterbox für Hartkunststoff,
     Altreifen (aus Gummi, gegen Gebühr), Sperrmüll (ein alter
     Ledersessel), ein Sack Altkleider, gelbe Säcke und die graue
     Restmülltonne.
   - Pfandflaschen gehören NICHT in den Glascontainer: Sie gehen in den
     Laden zurück (Mehrweg 8–15 Cent, Einweg 25 Cent Pfand).
   Maßstab (Einheiten je Meter): Containerreihe ≈ 24 (Fuß y 106),
   Gitterbox ≈ 51, Sessel ≈ 57, Mülltonne ≈ 61, Reifen ≈ 69, vorne ≈ 77.
   Augenhöhe 1,6 m → Horizont y = 68, Fluchtpunkt (160|68).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "materialien", titel: "Materialien & Pfand", emoji: "♻️", thema: "Materialien", kuerzel: "b26d", fassung: 852 });
const rnd = zufall(9090);
const r = B.r;
{ const lg0 = S.lg, rg0 = S.rg, c = {}; S.lg = (n, ...a) => c[n] || (c[n] = lg0(n, ...a)); S.rg = (n, ...a) => c["r" + n] || (c["r" + n] = rg0(n, ...a)); }
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);

const HORIZONT = 68, VPX = 160, REIHE = 106, SR = 24;      // Containerreihe: Fuß und Maßstab
const sAuf = (y) => (y - HORIZONT) / 1.6;                     // Maßstab auf dem Boden bei y
const HOLZ = S.lg("holz", [[0, "#d9a96a"], [0.5, "#c08a52"], [1, "#9a6a36"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.5, "#b9c0c6"], [1, "#8d959c"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Himmel, Bäume und Halle hinter dem Zaun, Pflasterhof
   ===================================================================== */
S.hinten(`<rect width="320" height="70" fill="${S.lg("himmel", [[0, "#6aa6dc"], [1, "#d8eaf5"]])}"/>`);
{
  let k = "";
  for (const [x, y, s] of [[60, 16, 1], [200, 10, 0.8], [280, 22, 0.9]]) k += `<g opacity=".85"><ellipse cx="${x}" cy="${y}" rx="${16 * s}" ry="${3.6 * s}" fill="#fff"/><ellipse cx="${x - 6 * s}" cy="${y - 2.4 * s}" rx="${7 * s}" ry="${3.6 * s}" fill="#fff"/><ellipse cx="${x + 5 * s}" cy="${y - 3 * s}" rx="${8 * s}" ry="${4.4 * s}" fill="#fff"/></g>`;
  /* Halle (Wertstoffhalle) rechts hinten und Bäume */
  k += `<path d="M170 64 L170 36 L318 36 L318 64 Z" fill="${S.lg("halle", [[0, "#c9cfd4"], [1, "#a9b1b8"]])}"/><path d="M166 37 L244 24 L322 37 Z" fill="#7d858c"/>`;
  for (let x = 172; x < 318; x += 3) k += `<line x1="${x}" y1="37" x2="${x}" y2="64" stroke="#98a1a9" stroke-width=".3"/>`;
  k += `<rect x="196" y="42" width="64" height="7" fill="#2e8b57"/><text x="228" y="47.3" font-size="4.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">WERTSTOFFHOF</text>`;
  for (const [x, y, rr, f] of [[14, 42, 16, "#4f8a3c"], [40, 36, 18, "#5c9a46"], [76, 44, 14, "#4a823a"], [110, 38, 17, "#5c9a46"], [146, 46, 13, "#4f8a3c"]]) k += `<rect x="${x - 1.4}" y="${y + rr * 0.6}" width="2.8" height="16" fill="#6b4a2a"/><circle cx="${x}" cy="${y}" r="${rr}" fill="${f}"/><circle cx="${x - rr * 0.3}" cy="${y - rr * 0.35}" r="${rr * 0.55}" fill="#7fbf5f" opacity=".45"/>`;
  /* Zaun (Stabmatten) vor Bäumen und Halle */
  k += `<rect x="0" y="54" width="320" height="12" fill="#3f6a3a" opacity=".25"/>`;
  for (let x = 0; x < 320; x += 2.2) k += `<line x1="${r(x)}" y1="54" x2="${r(x)}" y2="66" stroke="#2f5c3a" stroke-width=".25"/>`;
  k += `<line x1="0" y1="54.6" x2="320" y2="54.6" stroke="#2f5c3a" stroke-width=".5"/><line x1="0" y1="60" x2="320" y2="60" stroke="#2f5c3a" stroke-width=".35"/>`;
  S.hinten(k);
}
/* Hof: Betonpflaster in Fluchtperspektive */
{
  let f = `<rect x="0" y="66" width="320" height="134" fill="${S.lg("hof", [[0, "#b9b4aa"], [1, "#a29c91"]])}"/>`;
  /* Querfugen: gleiche Tiefenschritte (0,4 m) → wachsende Abstände */
  const yTiefe = (dm) => HORIZONT + 1.6 * 400 / dm;           // f = 400 Einheiten
  for (let dm = 26; dm > 3.2; dm -= (dm > 12 ? 1 : 0.4)) { const y = yTiefe(dm); if (y > 70 && y < 200) f += `<line x1="0" y1="${r(y)}" x2="320" y2="${r(y)}" stroke="#8d877c" stroke-width="${r(0.15 + (y - 68) * 0.003)}" opacity=".7"/>`; }
  for (let i = -40; i <= 40; i++) { const x0 = VPX + i * 3.4; f += `<line x1="${r(VPX + (x0 - VPX) * 0.1)}" y1="${r(HORIZONT + 3.2)}" x2="${r(VPX + (x0 - VPX) * 4)}" y2="200" stroke="#8d877c" stroke-width=".2" opacity=".45"/>`; }
  f += `<rect x="0" y="66" width="320" height="134" fill="${S.lg("hoflicht", [[0, "#000", 0.08], [0.5, "#fff", 0.05], [1, "#000", 0.06]])}"/>`;
  /* Fahrspur (Reifenspuren) und Gully */
  f += `<ellipse cx="200" cy="176" rx="7" ry="1.8" fill="#5b5f64"/><ellipse cx="200" cy="176" rx="6" ry="1.4" fill="none" stroke="#3a3d42" stroke-width=".3"/>`;
  S.hinten(f);
}

/* Container-Zeichnungen sind in Bildkoordinaten gebaut → auf den Fußpunkt des Teils verschieben */
const absolut = (k, x) => `<g transform="translate(${-x} ${-REIHE})">${k}</g>`;
/* ---------- Abrollcontainer (Stirnseite zum Hof) mit Seitenfläche zur Mitte ---------- */
const container = (x0, x1, hoehe, farbe, schild, schildFarbe) => {
  /* x0..x1 Stirnseite am Fuß y = REIHE; Seitenfläche läuft zum Fluchtpunkt (6 m tief) */
  const yTop = REIHE - hoehe * SR, sb = SR * 400 / (400 + 6 * SR);
  const zur = (x, y, s) => [r(VPX + (x - VPX) * s / SR), r(HORIZONT + (y - HORIZONT) * s / SR)];
  let g = "";
  const seite = (x1 + x0) / 2 < VPX ? x1 : x0;
  const [bx, byT] = zur(seite, yTop, sb), [, byB] = zur(seite, REIHE, sb);
  g += `<path d="M${seite} ${r(yTop)} L${bx} ${byT} L${bx} ${byB} L${seite} ${REIHE} Z" fill="${farbe}" opacity=".8"/><path d="M${seite} ${r(yTop)} L${bx} ${byT} L${bx} ${byB} L${seite} ${REIHE} Z" fill="#000" opacity=".2"/>`;
  for (let i = 1; i < 6; i++) { const t = i / 6, xx = seite + (bx - seite) * t; g += `<line x1="${r(xx)}" y1="${r(yTop + (byT - yTop) * t)}" x2="${r(xx)}" y2="${r(REIHE + (byB - REIHE) * t)}" stroke="#000" stroke-width=".3" opacity=".25"/>`; }
  g += `<rect x="${x0}" y="${r(yTop)}" width="${x1 - x0}" height="${r(REIHE - yTop)}" fill="${farbe}"/>`;
  g += `<rect x="${x0}" y="${r(yTop)}" width="${x1 - x0}" height="${r(REIHE - yTop)}" fill="${S.lg("cschatten", [[0, "#fff", 0.18], [0.5, "#fff", 0], [1, "#000", 0.22]])}"/>`;
  /* Rahmen, Türverriegelung, Rollen */
  g += `<rect x="${x0}" y="${r(yTop)}" width="${x1 - x0}" height="1.6" fill="#000" opacity=".25"/>`;
  for (const xx of [x0 + 1, x1 - 2.6]) g += `<rect x="${r(xx)}" y="${r(yTop)}" width="1.6" height="${r(REIHE - yTop)}" fill="#000" opacity=".18"/>`;
  g += `<line x1="${(x0 + x1) / 2}" y1="${r(yTop + 2)}" x2="${(x0 + x1) / 2}" y2="${REIHE - 2}" stroke="#000" stroke-width=".4" opacity=".3"/>`;
  for (const xx of [x0 + 10, x1 - 10]) g += `<rect x="${xx - 0.6}" y="${r(yTop + 4)}" width="1.2" height="${r(REIHE - yTop - 8)}" fill="${STAHL}" opacity=".85"/>`;
  g += `<rect x="${x0 + 2}" y="${REIHE - 2}" width="${x1 - x0 - 4}" height="2" fill="#2a2d31"/>`;
  /* Schild am Pfosten über dem Container */
  const sx = (x0 + x1) / 2;
  g += `<rect x="${sx - 0.6}" y="${r(yTop - 12)}" width="1.2" height="12" fill="#5b636b"/>`;
  g += `<rect x="${sx - 17}" y="${r(yTop - 19)}" width="34" height="8" rx="1" fill="${schildFarbe}" stroke="#fff" stroke-width=".5"/><text x="${sx}" y="${r(yTop - 13.4)}" font-size="4.4" text-anchor="middle" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-weight="bold">${schild}</text>`;
  return { svg: g, yTop };
};

/* =====================================================================
   1 — DAS HOLZ (Altholz-Container, ganz links)
   ===================================================================== */
{
  const c = container(4, 60, 1.75, S.lg("cbraun", [[0, "#8a5a30"], [1, "#6b4322"]]), "Altholz", "#8a5a30");
  let k = c.svg;
  const t = c.yTop;
  /* Bretter, eine Europalette, Latten und ein alter Stuhl ragen heraus */
  k += `<path d="M8 ${t} L12 ${t - 9} L22 ${t - 12} L30 ${t - 8} L42 ${t - 13} L54 ${t - 7} L58 ${t} Z" fill="#8a6a42"/>`;
  k += `<g transform="rotate(-14 22 ${t - 10})"><rect x="10" y="${t - 14}" width="24" height="2" fill="${HOLZ}"/><rect x="10" y="${t - 10}" width="24" height="2" fill="${HOLZ}"/><rect x="11" y="${t - 14}" width="2.4" height="6" fill="#b07c45"/><rect x="21" y="${t - 14}" width="2.4" height="6" fill="#b07c45"/><rect x="31" y="${t - 14}" width="2.4" height="6" fill="#b07c45"/></g>`;
  for (const [x, y, w, a] of [[30, t - 15, 26, 18], [36, t - 9, 22, -8], [14, t - 6, 18, 6]]) k += `<rect x="${x}" y="${y}" width="${w}" height="1.6" fill="${HOLZ}" transform="rotate(${a} ${x} ${y})"/><rect x="${x}" y="${y}" width="${w}" height=".4" fill="#f0c890" transform="rotate(${a} ${x} ${y})"/>`;
  k += `<path d="M44 ${t - 18} L44 ${t - 8} M44 ${t - 12} L51 ${t - 12} L51 ${t - 6} M44 ${t - 18} L48 ${t - 18}" stroke="#7a4a22" stroke-width="1.4" fill="none"/>`;
  S.teil({ id: "holz", de: "das Holz", syl: "HOLZ", it: "il legno", itSyl: "LE-gno", en: "wood", x: 32, y: REIHE, steht: true, kunst: absolut(k, 32),
    tipp: "Altes Holz – Bretter, Paletten, Möbel – kommt in den Altholz-Container." });
}

/* =====================================================================
   2 — DAS METALL (Schrott-Container) mit Lupe: Schraube, Draht, Dose
   ===================================================================== */
{
  const X0 = 64, X1 = 120;
  const c = container(X0, X1, 1.75, S.lg("cgrau", [[0, "#6f7a84"], [1, "#4e5860"]]), "Metall", "#4e5860");
  let k = c.svg;
  const t = c.yTop, cx = (X0 + X1) / 2;
  /* Schrott: Rohre, Fahrradrahmen, Topf, Heizkörper */
  k += `<path d="M${X0 + 3} ${t} L${X0 + 8} ${t - 7} L${X0 + 20} ${t - 10} L${X0 + 32} ${t - 6} L${X0 + 44} ${t - 10} L${X1 - 3} ${t} Z" fill="#7a7f86"/>`;
  k += `<rect x="${X0 + 6}" y="${t - 14}" width="24" height="7" fill="${STAHL}" transform="rotate(-8 ${X0 + 18} ${t - 10})"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${X0 + 7.6 + i * 3.8}" y="${t - 13.6}" width="2" height="6" fill="#d5dade" transform="rotate(-8 ${X0 + 18} ${t - 10})"/>`;
  k += `<g transform="translate(${X0 + 38} ${t - 13}) rotate(12)"><circle cx="-6" cy="3" r="4.4" fill="none" stroke="#3a3d42" stroke-width=".8"/><path d="M-6 3 L-1 -2 L4 3 L-2 3 Z M-1 -2 L-2 -4.4" stroke="#c0392b" stroke-width=".9" fill="none"/></g>`;
  k += `<rect x="${X0 + 34}" y="${t - 6}" width="20" height="1.4" rx=".7" fill="#b87333" transform="rotate(-24 ${X0 + 34} ${t - 6})"/>`;
  k += `<path d="M${X0 + 24} ${t - 4} q3 -4 7 0 Z" fill="#9aa2a9"/><rect x="${X0 + 23}" y="${t - 4.6}" width="9" height="1" fill="#7d858c"/>`;
  /* Draht: Rolle hängt über der Kante */
  const dx = X1 - 13, dy = t - 2;
  k += `<ellipse cx="${dx}" cy="${dy}" rx="5" ry="3.6" fill="none" stroke="#b9c0c6" stroke-width=".55"/><ellipse cx="${dx}" cy="${dy}" rx="4.2" ry="3" fill="none" stroke="#9aa2a9" stroke-width=".45"/><ellipse cx="${dx + 0.4}" cy="${dy}" rx="3.4" ry="2.4" fill="none" stroke="#c9ced3" stroke-width=".45"/>`;
  k += `<path d="M${dx + 4} ${dy + 2} q3 3 1 8 q-1 3 2 6" stroke="#b9c0c6" stroke-width=".5" fill="none"/>`;
  /* Kleinteile-Wanne vor dem Container: Schrauben; daneben Dosen */
  const wx = X0 + 14;
  k += `<path d="M${wx - 8} ${REIHE - 7} L${wx + 8} ${REIHE - 7} L${wx + 7} ${REIHE} L${wx - 7} ${REIHE} Z" fill="#5b636b"/><rect x="${wx - 8.4}" y="${REIHE - 7.6}" width="16.8" height="1.2" rx=".4" fill="#7d858c"/>`;
  k += `<text x="${wx}" y="${REIHE - 2.4}" font-size="2.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Kleinmetall</text>`;
  for (let i = 0; i < 6; i++) { const sx = wx - 6 + i * 2.4, a = -30 + rnd() * 60; k += `<g transform="rotate(${r(a)} ${r(sx)} ${REIHE - 9})"><rect x="${r(sx - 0.35)}" y="${REIHE - 12}" width=".7" height="4.4" fill="#c9ced3"/><rect x="${r(sx - 1)}" y="${REIHE - 12.6}" width="2" height=".8" rx=".3" fill="#e1e5e8"/>${[0, 1, 2, 3].map((j) => `<line x1="${r(sx - 0.4)}" y1="${r(REIHE - 11.2 + j)}" x2="${r(sx + 0.4)}" y2="${r(REIHE - 10.8 + j)}" stroke="#8a929a" stroke-width=".2"/>`).join("")}</g>`; }
  const dsx = X1 - 12;
  for (const [ox, f] of [[0, "#c0392b"], [3.4, "#2f7fd0"], [1.7, "#e1e5e8"]]) k += `<rect x="${dsx + ox - 1.5}" y="${REIHE - (ox === 1.7 ? 9.6 : 5)}" width="3" height="5" rx=".5" fill="${f}"/><rect x="${dsx + ox - 1.5}" y="${REIHE - (ox === 1.7 ? 9.6 : 5)}" width="3" height=".6" fill="${STAHL}"/><rect x="${dsx + ox - 1.5}" y="${REIHE - (ox === 1.7 ? 9.6 : 5) + 4.4}" width="3" height=".6" fill="${STAHL}"/>`;
  const unter = [
    { id: "schraube", de: "die Schraube", syl: "SCHRAU-be", it: "la vite", itSyl: "VI-te", en: "screw", x: wx, y: REIHE, kunst: flaeche(-9, -14, 18, 14) },
    { id: "draht", de: "der Draht", syl: "DRAHT", it: "il filo", itSyl: "FI-lo", en: "wire", x: dx + 1, y: dy + 4, kunst: flaeche(-6.6, -10, 13, 16), tipp: "Draht ist ein langer, dünner Faden aus Metall." },
    { id: "dose", de: "die Dose", syl: "DO-se", it: "la lattina", itSyl: "lat-TI-na", en: "tin can", x: dsx + 1.7, y: REIHE, kunst: flaeche(-4, -10.4, 8.6, 10.4), tipp: "Dosen sind aus Aluminium oder Weißblech." },
  ];
  S.teil({ id: "metall", de: "das Metall", syl: "Me-TALL", it: "il metallo", itSyl: "me-TAL-lo", en: "metal", x: cx, y: REIHE, steht: true, kunst: absolut(k, cx),
    zoom: { x: X0 - 4, y: t - 22, w: 66, h: 44 }, unter,
    tipp: "Metall wird eingeschmolzen und wieder neu verwendet." });
}

/* =====================================================================
   3 — DER BAUSCHUTT (Absetzmulde) mit Lupe: Beton, Ziegel, Fliese, Pflaster
   ===================================================================== */
{
  const X0 = 124, X1 = 174;
  const c = container(X0, X1, 1.4, S.lg("corange", [[0, "#e07a2a"], [1, "#b85a14"]]), "Bauschutt", "#c0601a");
  let k = c.svg;
  const t = c.yTop, cx = (X0 + X1) / 2;
  k += `<path d="M${X0 + 2} ${t} Q${X0 + 8} ${t - 12} ${cx} ${t - 14} Q${X1 - 8} ${t - 12} ${X1 - 2} ${t} Z" fill="#a79f94"/>`;
  for (let i = 0; i < 30; i++) k += `<circle cx="${r(X0 + 4 + rnd() * (X1 - X0 - 8))}" cy="${r(t - 1 - rnd() * 9)}" r="${r(0.3 + rnd() * 0.7)}" fill="${rnd() < 0.5 ? "#8d867c" : "#c4bdb2"}"/>`;
  /* Beton: Brocken mit rostiger Bewehrung */
  const bx = X0 + 12, by = t - 6;
  k += `<path d="M${bx - 7} ${by + 3} L${bx - 6} ${by - 4} L${bx - 1} ${by - 6} L${bx + 6} ${by - 3} L${bx + 7} ${by + 3} Z" fill="${S.lg("beton", [[0, "#c9c5be"], [1, "#9a958d"]])}"/>`;
  for (let i = 0; i < 8; i++) k += `<circle cx="${r(bx - 5 + rnd() * 10)}" cy="${r(by - 3 + rnd() * 5)}" r=".35" fill="#7d786f"/>`;
  k += `<path d="M${bx + 2} ${by - 4} q2 -4 5 -5 M${bx - 3} ${by - 5} q-1 -3 1 -6" stroke="#8a4a22" stroke-width=".55" fill="none"/>`;
  /* Ziegel: rote Mauerziegel, zwei noch mit Mörtel verbunden */
  const zx = cx + 1, zy = t - 9;
  k += `<rect x="${zx - 6}" y="${zy}" width="8" height="3" rx=".3" fill="${S.lg("ziegel", [[0, "#c8573a"], [1, "#9a3a22"]])}"/><rect x="${zx - 6}" y="${zy + 3}" width="8" height=".6" fill="#ddd6c8"/><rect x="${zx - 4}" y="${zy + 3.6}" width="8" height="3" rx=".3" fill="${S.lg("ziegel", [[0, "#c8573a"], [1, "#9a3a22"]])}"/>`;
  k += `<rect x="${zx + 3.2}" y="${zy - 1.4}" width="6" height="2.6" rx=".3" fill="#b44a2e" transform="rotate(-18 ${zx + 6} ${zy})"/>`;
  /* Fliesen: weiße und blaue Bruchstücke */
  const fx = X1 - 12, fy = t - 4;
  k += `<path d="M${fx - 5} ${fy} L${fx - 3} ${fy - 6} L${fx + 3} ${fy - 5} L${fx + 2} ${fy + 1} Z" fill="#f4f6f8" stroke="#c9ced3" stroke-width=".3"/><path d="M${fx - 3} ${fy - 6} L${fx + 3} ${fy - 5}" stroke="#fff" stroke-width=".5"/>`;
  k += `<path d="M${fx + 1} ${fy - 2} L${fx + 4} ${fy - 8} L${fx + 8} ${fy - 6} L${fx + 6} ${fy} Z" fill="#5aa7d8" stroke="#3d82b0" stroke-width=".3"/><path d="M${fx + 4} ${fy - 8} L${fx + 8} ${fy - 6}" stroke="#bfe3ff" stroke-width=".5"/>`;
  /* Pflaster: graue Pflastersteine vorn auf dem Rand */
  const px = cx + 2, py = REIHE - 4;
  for (const [ox, oy] of [[-6, 0], [-1.6, 0], [2.8, 0], [-3.8, -2.6], [0.6, -2.6]]) k += `<rect x="${px + ox}" y="${py + oy - 2.4}" width="4.2" height="2.4" rx=".4" fill="${S.lg("pflstein", [[0, "#9a958d"], [1, "#6f6a62"]])}" stroke="#5b574f" stroke-width=".2"/>`;
  k += `<rect x="${px - 7}" y="${py}" width="15" height="1" fill="#5b574f" opacity=".5"/>`;
  const unter = [
    { id: "beton", de: "der Beton", syl: "Be-TON", it: "il cemento", itSyl: "ce-MEN-to", en: "concrete", x: bx, y: by + 3, kunst: flaeche(-8, -10, 16, 10.6), tipp: "Beton macht man aus Zement, Sand, Kies und Wasser." },
    { id: "ziegel", de: "der Ziegel", syl: "ZIE-gel", it: "il mattone", itSyl: "mat-TO-ne", en: "brick", x: zx, y: zy + 7, kunst: flaeche(-7, -9.6, 17, 10) },
    { id: "fliese", de: "die Fliese", syl: "FLIE-se", it: "la piastrella", itSyl: "pia-STREL-la", en: "tile", x: fx + 1.6, y: fy + 1, kunst: flaeche(-7, -9.6, 16, 10) },
    { id: "pflaster", de: "das Pflaster", syl: "PFLA-ster", it: "il selciato", itSyl: "sel-CIA-to", en: "paving", x: px + 0.6, y: py + 1, kunst: flaeche(-7.6, -6.4, 15.6, 6.4), tipp: "Mit Pflastersteinen macht man Wege und Plätze – wie diesen Hof." },
  ];
  S.teil({ id: "bauschutt", de: "der Bauschutt", syl: "BAU-schutt", it: "le macerie", itSyl: "ma-CE-rie", en: "rubble", x: cx, y: REIHE, steht: true, kunst: absolut(k, cx),
    zoom: { x: X0 - 5, y: t - 24, w: 60, h: 40 }, unter,
    tipp: "Bauschutt kostet auf dem Wertstoffhof eine Gebühr." });
}

/* =====================================================================
   4 — DER CONTAINER „Papier & Pappe“ mit Lupe: Papier, Pappe
   ===================================================================== */
{
  const X0 = 178, X1 = 232;
  const c = container(X0, X1, 1.75, S.lg("cblau", [[0, "#2f6fb8"], [1, "#1d4f8f"]]), "Papier &amp; Pappe", "#1d4f8f");
  let k = c.svg;
  const t = c.yTop, cx = (X0 + X1) / 2;
  k += `<path d="M${X0 + 3} ${t} L${X0 + 6} ${t - 6} L${X1 - 6} ${t - 8} L${X1 - 3} ${t} Z" fill="#d8cdb8"/>`;
  /* Pappe: flach gefaltete Kartons, schräg gestellt */
  for (const [x, y, w, h, a, f] of [[X0 + 4, t - 14, 18, 12, -10, "#c99a5c"], [X0 + 14, t - 12, 16, 11, 6, "#b88a4c"], [X0 + 8, t - 8, 14, 8, -2, "#d8ad70"]]) {
    k += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" transform="rotate(${a} ${x + w / 2} ${y + h / 2})" stroke="#8a6232" stroke-width=".3"/>`;
    k += `<line x1="${x}" y1="${y + h / 2}" x2="${x + w}" y2="${y + h / 2}" stroke="#8a6232" stroke-width=".3" transform="rotate(${a} ${x + w / 2} ${y + h / 2})"/>`;
  }
  k += `<text x="${X0 + 13}" y="${t - 5}" font-size="2.2" text-anchor="middle" fill="#6b4a22" font-family="Arial">↑ ↑ FRAGILE</text>`;
  /* Papier: gebündelte Zeitungen und Prospekte */
  const zx = X1 - 13, zy = t - 1;
  for (let i = 0; i < 4; i++) k += `<rect x="${zx - 8 + i * 0.4}" y="${zy - 3 - i * 2.4}" width="16" height="2.4" fill="${i % 2 ? "#f4f2ec" : "#e8e4d8"}" stroke="#bdb6a6" stroke-width=".2"/>`;
  k += `<line x1="${zx - 3}" y1="${zy - 12.6}" x2="${zx - 3}" y2="${zy - 0.6}" stroke="#c0392b" stroke-width=".4"/><line x1="${zx + 4}" y1="${zy - 12.6}" x2="${zx + 4}" y2="${zy - 0.6}" stroke="#c0392b" stroke-width=".4"/>`;
  k += `<rect x="${zx - 6}" y="${zy - 13}" width="10" height="2.6" fill="#fdfdfb" transform="rotate(-8 ${zx} ${zy - 12})"/><text x="${zx - 1}" y="${zy - 11.1}" font-size="1.6" text-anchor="middle" fill="#222" font-family="Georgia" font-weight="bold" transform="rotate(-8 ${zx} ${zy - 12})">ZEITUNG</text>`;
  const unter = [
    { id: "pappe", de: "die Pappe", syl: "PAP-pe", it: "il cartone", itSyl: "car-TO-ne", en: "cardboard", x: X0 + 14, y: t + 1, kunst: flaeche(-11, -17, 22, 17.6), tipp: "Kartons faltet man flach, bevor man sie wegbringt." },
    { id: "papier", de: "das Papier", syl: "Pa-PIER", it: "la carta", itSyl: "CAR-ta", en: "paper", x: zx, y: zy, kunst: flaeche(-9, -15, 18, 15.4), tipp: "Aus altem Papier macht man neues Papier: Recyclingpapier." },
  ];
  S.teil({ id: "container", de: "der Container", syl: "Con-TAI-ner", it: "il container", itSyl: "con-TAI-ner", en: "skip", x: cx, y: REIHE, steht: true, kunst: absolut(k, cx),
    zoom: { x: X0 - 6, y: t - 22, w: 66, h: 44 }, unter,
    tipp: "In jeden Container kommt nur ein Material." });
}

/* =====================================================================
   5 — DAS GLAS (drei Glascontainer: Weiß-, Grün-, Braunglas)
   ===================================================================== */
{
  let k = "";
  const iglu = (x, f, f2, txt) => {
    const w = 23, h = 1.6 * SR;
    let g = schatten(x, 0, 12, 1, .25);
    g += `<path d="M${x - w / 2} 0 L${x - w / 2} ${-h + 10} Q${x - w / 2} ${-h} ${x} ${-h} Q${x + w / 2} ${-h} ${x + w / 2} ${-h + 10} L${x + w / 2} 0 Z" fill="${f}"/>`;
    g += `<path d="M${x - w / 2 + 2} ${-h + 10} Q${x - w / 2 + 2} ${-h + 2} ${x - 2} ${-h + 1.6}" stroke="#fff" stroke-width="1" opacity=".3" fill="none"/>`;
    g += `<circle cx="${x - 4.4}" cy="${-h + 9}" r="2.6" fill="#1d1f22"/><circle cx="${x + 4.4}" cy="${-h + 9}" r="2.6" fill="#1d1f22"/><circle cx="${x - 4.4}" cy="${-h + 9}" r="2.6" fill="none" stroke="${f2}" stroke-width=".6"/><circle cx="${x + 4.4}" cy="${-h + 9}" r="2.6" fill="none" stroke="${f2}" stroke-width=".6"/>`;
    g += `<rect x="${x - 8}" y="${-h + 15}" width="16" height="5" rx=".4" fill="#fff"/><text x="${x}" y="${-h + 18.6}" font-size="3" text-anchor="middle" fill="${f2}" font-family="Arial" font-weight="bold">${txt}</text>`;
    g += `<rect x="${x - 1}" y="${-h - 3}" width="2" height="3" fill="#7d858c"/><rect x="${x - 2}" y="${-h - 4}" width="4" height="1.2" rx=".5" fill="#7d858c"/>`;
    g += `<rect x="${x - w / 2}" y="-2" width="${w}" height="2" fill="#000" opacity=".15"/>`;
    return g;
  };
  k += iglu(-25, S.lg("igluw", [[0, "#f4f6f8"], [1, "#c9ced3"]]), "#5b636b", "Weißglas");
  k += iglu(0, S.lg("iglug", [[0, "#4fb06a"], [1, "#2a7a40"]]), "#1f6a35", "Grünglas");
  k += iglu(25, S.lg("iglub", [[0, "#a8743f"], [1, "#6b4322"]]), "#6b4322", "Braunglas");
  /* eine leere Flasche wird gerade eingeworfen (liegt auf dem Rand) */
  k += `<g transform="translate(2.6 ${-1.6 * SR + 6.4}) rotate(-60)"><rect x="-.8" y="-5" width="1.6" height="5" rx=".6" fill="#3fa34d" opacity=".9"/><rect x="-.4" y="-6.6" width=".8" height="1.8" fill="#3fa34d"/></g>`;
  S.teil({ id: "glas", de: "das Glas", syl: "GLAS", it: "il vetro", itSyl: "VE-tro", en: "glass", x: 276, y: REIHE, steht: true, kunst: k,
    tipp: "Altglas wird nach Farben getrennt: weiß, grün und braun. Blaues Glas kommt zum Grünglas." });
}

/* =====================================================================
   6 — DER KUNSTSTOFF (Gitterbox für Hartplastik, vorne links-mitte)
   ===================================================================== */
{
  const y = 150, s = sAuf(y);
  const W = 1.2 * s, H = 0.97 * s;
  let k = schatten(0, 0, W / 2 + 3, 1.6, .3);
  /* Inhalt: Gartenstuhl, Eimer, Wäschekorb, Kanister, Spielzeugauto */
  k += `<g transform="translate(-18 ${-H + 4})"><path d="M0 -10 L12 -10 L13 0 L-1 0 Z" fill="#f4f6f8" stroke="#c9ced3" stroke-width=".4"/><path d="M1 -10 L1 -26 Q6 -29 11 -26 L11 -10" fill="#f4f6f8" stroke="#c9ced3" stroke-width=".4"/>${[0, 1, 2].map((i) => `<rect x="${2.2 + i * 3}" y="-24" width="1.6" height="11" rx=".6" fill="#dfe3e7"/>`).join("")}</g>`;
  k += `<path d="M2 ${-H + 2} L16 ${-H + 2} L14.6 ${-H + 16} L3.4 ${-H + 16} Z" fill="${S.lg("eimer", [[0, "#ff5a4a"], [1, "#c0301e"]], 0, 0, 1, 0)}"/><path d="M2 ${-H + 2} Q9 ${-H - 8} 16 ${-H + 2}" stroke="#7d858c" stroke-width=".6" fill="none"/>`;
  k += `<rect x="-6" y="${-H + 4}" width="10" height="13" rx="2" fill="#2f7fd0"/><rect x="-3.6" y="${-H + 1.6}" width="3.4" height="3" rx=".8" fill="#1d4f8f"/>`;
  k += `<path d="M18 ${-H + 6} L28 ${-H + 6} L27 ${-H + 14} L19 ${-H + 14} Z" fill="#ffd23f"/>${[0, 1, 2, 3].map((i) => `<rect x="${19.6 + i * 2}" y="${-H + 8}" width="1" height="4" fill="#e0b000"/>`).join("")}`;
  /* Gitterbox (Stahlrahmen, Drahtgitter) */
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H - 4}" fill="#000" opacity=".06"/>`;
  for (let i = 0; i <= 14; i++) k += `<line x1="${r(-W / 2 + i * W / 14)}" y1="${r(-H)}" x2="${r(-W / 2 + i * W / 14)}" y2="-4" stroke="#8d959c" stroke-width=".35"/>`;
  for (let i = 0; i <= 9; i++) k += `<line x1="${r(-W / 2)}" y1="${r(-H + i * (H - 4) / 9)}" x2="${r(W / 2)}" y2="${r(-H + i * (H - 4) / 9)}" stroke="#8d959c" stroke-width=".35"/>`;
  k += `<rect x="${-W / 2 - 1}" y="${-H - 1}" width="${W + 2}" height="2" fill="${STAHL}"/><rect x="${-W / 2 - 1}" y="-5" width="${W + 2}" height="2" fill="${STAHL}"/>`;
  for (const x of [-W / 2 - 1, W / 2 - 1]) k += `<rect x="${x}" y="${-H - 1}" width="2" height="${H + 1}" fill="${STAHL}"/>`;
  k += `<rect x="${-W / 2 + 1}" y="-3" width="4" height="3" fill="#5b636b"/><rect x="${W / 2 - 5}" y="-3" width="4" height="3" fill="#5b636b"/>`;
  k += `<rect x="-14" y="${-H / 2 - 4}" width="28" height="8" rx="1" fill="#ffd23f" stroke="#c09a00" stroke-width=".4"/><text x="0" y="${-H / 2 + 1.4}" font-size="4.2" text-anchor="middle" fill="#333" font-family="Arial" font-weight="bold">Hartplastik</text>`;
  S.teil({ id: "kunststoff", de: "der Kunststoff", syl: "KUNST-stoff", it: "la plastica", itSyl: "PLA-sti-ca", en: "plastic", x: 82, y, steht: true, kunst: k,
    tipp: "Kunststoff – auch Plastik genannt – wird aus Erdöl gemacht." });
}

/* =====================================================================
   7 — DAS LEDER (alter Ledersessel für den Sperrmüll, Mitte)
   ===================================================================== */
{
  const y = 158, s = sAuf(y);
  let k = schatten(0, 0, 0.5 * s, 1.6, .32);
  const LED = S.lg("leder", [[0, "#9a5a30"], [0.5, "#7a4220"], [1, "#4e2810"]]);
  k += `<rect x="-22" y="-3" width="3" height="3" fill="#2a1a10"/><rect x="19" y="-3" width="3" height="3" fill="#2a1a10"/>`;
  k += `<path d="M-20 -48 Q-20 -54 -12 -54 L12 -54 Q20 -54 20 -48 L20 -24 L-20 -24 Z" fill="${LED}"/>`;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) k += `<circle cx="${-12 + i * 8}" cy="${-48 + j * 7}" r=".7" fill="#3a1e0c"/>`;
  k += `<path d="M-17 -26 Q0 -30 17 -26 L18 -15 L-18 -15 Z" fill="${S.lg("polster", [[0, "#b06a38"], [1, "#7a4220"]])}"/>`;
  k += `<path d="M-26 -34 Q-26 -40 -20 -40 Q-15 -40 -15 -34 L-15 -3 L-26 -3 Z" fill="${LED}"/><path d="M26 -34 Q26 -40 20 -40 Q15 -40 15 -34 L15 -3 L26 -3 Z" fill="${LED}"/>`;
  k += `<rect x="-17" y="-16" width="34" height="13" fill="${S.lg("front", [[0, "#6b3a1c"], [1, "#4e2810"]])}"/>`;
  k += `<path d="M-24 -38 Q-22 -39.6 -18 -38.6 M18 -38.6 Q22 -39.6 24 -38" stroke="#c88a5a" stroke-width=".8" fill="none" opacity=".6"/>`;
  /* Risse im Leder (darum ist er Sperrmüll) */
  k += `<path d="M-6 -24 l2 -2 l1 2 l2 -1.6 M8 -44 l-2 3 l2 1" stroke="#e8c49a" stroke-width=".45" fill="none"/>`;
  k += `<rect x="12" y="-30" width="13" height="6" rx=".5" fill="#fff" transform="rotate(8 18 -27)"/><text x="18.4" y="-26" font-size="2.6" text-anchor="middle" fill="#c0392b" font-family="Arial" font-weight="bold" transform="rotate(8 18 -27)">Sperrmüll</text>`;
  S.teil({ id: "leder", de: "das Leder", syl: "LE-der", it: "la pelle", itSyl: "PEL-le", en: "leather", x: 162, y, steht: true, kunst: k,
    tipp: "Der alte Sessel ist aus Leder. Leder macht man aus Tierhaut." });
}

/* =====================================================================
   8 — DER GUMMI (Stapel Altreifen, vorne links)
   ===================================================================== */
{
  const y = 180, s = sAuf(y);
  const R = 0.31 * s, H = 0.2 * s, ry = R * 0.22;
  let k = schatten(0, 0, R + 4, 2, .35);
  for (let i = 0; i < 4; i++) {
    const yy = -i * H;
    k += `<path d="M${-R} ${r(yy - ry)} L${-R} ${r(yy - ry - H)} A${r(R)} ${r(ry)} 0 0 1 ${r(R)} ${r(yy - ry - H)} L${r(R)} ${r(yy - ry)} A${r(R)} ${r(ry)} 0 0 1 ${-r(R)} ${r(yy - ry)} Z" fill="${S.lg("reifen", [[0, "#3a3c40"], [0.5, "#26282b"], [1, "#151618"]], 0, 0, 1, 0)}"/>`;
    for (let j = -4; j <= 4; j++) k += `<line x1="${r(j * R / 4.6)}" y1="${r(yy - ry - H + 1)}" x2="${r(j * R / 4.6)}" y2="${r(yy - ry + ry * 0.7)}" stroke="#4a4d52" stroke-width=".6" opacity=".7"/>`;
  }
  const top = -4 * H - ry;
  k += `<ellipse cx="0" cy="${r(top)}" rx="${r(R)}" ry="${r(ry)}" fill="#2a2c2f"/><ellipse cx="0" cy="${r(top)}" rx="${r(R * 0.6)}" ry="${r(ry * 0.6)}" fill="#0d0e10"/>`;
  k += `<path d="M${r(-R * 0.9)} ${r(top - ry * 0.2)} A${r(R)} ${r(ry)} 0 0 1 ${r(-R * 0.2)} ${r(top - ry * 0.95)}" stroke="#5b5f64" stroke-width=".8" fill="none"/>`;
  k += `<rect x="${r(R - 6)}" y="${r(-H * 1.6)}" width="12" height="6" rx=".5" fill="#fff" transform="rotate(-6 ${r(R)} ${r(-H)})"/><text x="${r(R)}" y="${r(-H * 1.6 + 4.2)}" font-size="3" text-anchor="middle" fill="#c0392b" font-family="Arial" font-weight="bold" transform="rotate(-6 ${r(R)} ${r(-H)})">3 € / St.</text>`;
  S.teil({ id: "gummi", de: "der Gummi", syl: "GUM-mi", it: "la gomma", itSyl: "GOM-ma", en: "rubber", x: 34, y, steht: true, kunst: k,
    tipp: "Autoreifen sind aus Gummi. Altreifen kosten auf dem Wertstoffhof eine Gebühr." });
}

/* =====================================================================
   9 — DER STOFF (Sack mit Altkleidern) und
   10 — DIE PFANDFLASCHE (Kasten mit Pfandflaschen, vorne)
   ===================================================================== */
{
  const y = 182;
  let k = schatten(0, 0, 20, 1.8, .3);
  k += `<path d="M-15 0 Q-20 -18 -12 -36 L-6 -42 L6 -42 L12 -36 Q20 -18 15 0 Z" fill="#f4f6f8" opacity=".55" stroke="#c9ced3" stroke-width=".4"/>`;
  /* Kleidung im durchsichtigen Sack: Pullover, Jeans, karierter Stoff, Schal */
  k += `<path d="M-13 -3 Q-14 -14 -6 -16 L4 -16 Q13 -14 13 -3 Z" fill="#3d6fb8"/><path d="M-4 -16 L-4 -3 M4 -16 L4 -3" stroke="#2a4f8a" stroke-width=".5"/>`;
  k += `<path d="M-12 -16 Q-12 -27 0 -28 Q12 -27 12 -16 Z" fill="#c0392b"/><path d="M-12 -20 h24 M-12 -24 h24" stroke="#e05a4a" stroke-width=".6"/>`;
  S.def(`<pattern id="${S.id("karo")}" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#e8d6a0"/><rect width="1.5" height="3" fill="#3a7a4a" opacity=".55"/><rect width="3" height="1.5" fill="#3a7a4a" opacity=".55"/></pattern>`);
  k += `<path d="M-9 -28 Q-8 -37 0 -38 Q9 -37 9 -28 Z" fill="url(#${S.id("karo")})"/>`;
  k += `<path d="M-6 -36 Q2 -30 10 -33" stroke="#ffd23f" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M-6 -42 L-8 -46 L-3 -44 L0 -47 L3 -44 L8 -46 L6 -42 Z" fill="#f4f6f8" opacity=".7" stroke="#c9ced3" stroke-width=".3"/>`;
  k += `<path d="M-12 -34 Q-16 -18 -12 -2" stroke="#fff" stroke-width="1.2" opacity=".5" fill="none"/>`;
  k += `<rect x="-9" y="-11" width="18" height="6" rx=".5" fill="#fff"/><text x="0" y="-6.8" font-size="3.2" text-anchor="middle" fill="#2e8b57" font-family="Arial" font-weight="bold">Altkleider</text>`;
  S.teil({ id: "stoff", de: "der Stoff", syl: "STOFF", it: "la stoffa", itSyl: "STOF-fa", en: "fabric", x: 222, y, steht: true, kunst: k,
    tipp: "Kleidung ist aus Stoff. Saubere alte Kleidung kommt in die Altkleidersammlung." });
}
{
  const y = 193, s = sAuf(y);
  const W = 0.4 * s, H = 0.27 * s;
  let k = schatten(0, 0, W / 2 + 3, 1.6, .35);
  /* Flaschen im Kasten (Hälse ragen heraus) */
  for (let i = 0; i < 5; i++) {
    const x = -W / 2 + 3.6 + i * (W - 7.2) / 4;
    k += `<rect x="${r(x - 2)}" y="${r(-H - 8)}" width="4" height="10" rx="1.2" fill="${S.lg("flasche", [[0, "#5a3a18"], [0.5, "#8a5a28"], [1, "#4a2e10"]], 0, 0, 1, 0)}"/>`;
    k += `<rect x="${r(x - 1)}" y="${r(-H - 13)}" width="2" height="5.4" rx=".6" fill="#6b4320"/><rect x="${r(x - 1.2)}" y="${r(-H - 14)}" width="2.4" height="1.4" rx=".4" fill="#d9b44a"/>`;
    k += `<rect x="${r(x - 0.6)}" y="${r(-H - 7)}" width=".8" height="7" rx=".4" fill="#fff" opacity=".35"/>`;
  }
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" rx="1" fill="${S.lg("kasten", [[0, "#3fa34d"], [1, "#257a32"]])}"/>`;
  k += `<rect x="${-W / 2 + 3}" y="${-H + 2.6}" width="${W - 6}" height="3.4" rx="1.6" fill="#1d5a26"/>`;
  k += `<rect x="${-W / 2 + 4}" y="${-H + 8}" width="${W - 8}" height="${H - 11}" rx=".6" fill="#fff"/><text x="0" y="${r(-H + 8 + (H - 11) / 2 + 1.5)}" font-size="4" text-anchor="middle" fill="#257a32" font-family="Arial" font-weight="bold">Pfand</text>`;
  S.teil({ id: "pfandflasche", de: "die Pfandflasche", syl: "PFAND-fla-sche", it: "la bottiglia con cauzione", itSyl: "bot-TI-glia con cau-ZIO-ne", en: "deposit bottle", x: 118, y, steht: true, kunst: k,
    tipp: "Pfandflaschen gehören nicht in den Glascontainer: Bring sie in den Laden zurück und du bekommst Geld." });
}

/* =====================================================================
   11 — DIE MÜLLTONNE (Restmüll, 240 Liter) und 12 — DER MÜLLSACK
   ===================================================================== */
{
  const y = 168, s = sAuf(y);
  const W = 0.58 * s, H = 1.07 * s;
  let k = schatten(0, 0, W / 2 + 3, 1.6, .32);
  k += `<path d="M${-W / 2 + 2} -3 L${-W / 2} ${-H + 8} L${W / 2} ${-H + 8} L${W / 2 - 2} -3 Z" fill="${S.lg("tonne", [[0, "#5b636b"], [0.5, "#3f464d"], [1, "#2a2f34"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${-W / 2 - 1.4} ${-H + 8} L${-W / 2 - 0.6} ${-H + 2} Q0 ${-H - 1} ${W / 2 + 0.6} ${-H + 2} L${W / 2 + 1.4} ${-H + 8} Z" fill="#2a2f34"/>`;
  k += `<rect x="${-W / 2 - 1}" y="${-H + 7}" width="${W + 2}" height="2.4" rx=".8" fill="#4a5158"/>`;
  for (const x of [-W / 4, W / 4]) k += `<rect x="${r(x - 0.6)}" y="${-H + 13}" width="1.2" height="${r(H - 20)}" fill="#2a2f34" opacity=".6"/>`;
  k += `<circle cx="${r(W / 2 - 4)}" cy="-3.6" r="3.6" fill="#1a1c1f"/><circle cx="${r(W / 2 - 4)}" cy="-3.6" r="1.4" fill="#5b636b"/>`;
  k += `<rect x="-6" y="${-H + 16}" width="12" height="5" rx=".4" fill="#fff"/><text x="0" y="${-H + 19.6}" font-size="2.8" text-anchor="middle" fill="#333" font-family="Arial" font-weight="bold">Restmüll</text>`;
  k += `<path d="M${-W / 2 + 2} ${-H + 12} L${-W / 2 + 3.6} -6" stroke="#fff" stroke-width="1" opacity=".18"/>`;
  S.teil({ id: "muelltonne", de: "die Mülltonne", syl: "MÜLL-ton-ne", it: "il bidone", itSyl: "bi-DO-ne", en: "wheelie bin", x: 268, y, steht: true, kunst: k,
    tipp: "In die graue Tonne kommt der Restmüll." });
}
{
  const y = 186;
  let k = schatten(0, 0, 20, 1.6, .3);
  const sack = (x, f, f2, h) => `<path d="M${x - 11} 0 Q${x - 15} ${-h * 0.5} ${x - 8} ${-h} L${x - 3} ${-h - 3} L${x - 1} ${-h - 7} L${x + 1} ${-h - 3} L${x + 8} ${-h} Q${x + 15} ${-h * 0.5} ${x + 11} 0 Z" fill="${f}"/><path d="M${x - 9} ${-h * 0.8} Q${x - 11} ${-h * 0.4} ${x - 8} -4" stroke="#fff" stroke-width="1" opacity=".35" fill="none"/><path d="M${x - 3} ${-h * 0.6} q4 4 2 12 M${x + 5} ${-h * 0.7} q-2 6 2 12" stroke="${f2}" stroke-width=".5" fill="none"/>`;
  k += sack(-8, S.lg("gelb", [[0, "#ffe46a"], [1, "#e0b800"]], 0, 0, 1, 0), "#c09a00", 30);
  k += sack(10, S.lg("gelb", [[0, "#ffe46a"], [1, "#e0b800"]], 0, 0, 1, 0), "#c09a00", 25);
  k += `<text x="-8" y="-12" font-size="3" text-anchor="middle" fill="#8a6a00" font-family="Arial" font-weight="bold">Gelber Sack</text>`;
  S.teil({ id: "muellsack", de: "der Müllsack", syl: "MÜLL-sack", it: "il sacco", itSyl: "SAC-co", en: "rubbish bag", x: 302, y, steht: true, kunst: k,
    tipp: "In den gelben Sack kommen Verpackungen aus Plastik und Metall." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/materialien.js"));
console.log(aus);
