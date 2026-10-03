#!/usr/bin/env node
/* =====================================================================
   ÄGYPTEN — GIZEH (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Lagepläne des Gizeh-Plateaus, Fotos vom Sphinx-Terrassen-
   blick, Feluken bei Kairo und Assuan, Basar Khan el-Khalili):
   - Die drei Pyramiden stehen auf dem Wüstenplateau westlich des Nils,
     genau nach Norden ausgerichtet. Von Osten (vom Nil her) gesehen ist
     NORDEN RECHTS: rechts die CHEOPS-Pyramide (die größte, 139 m, die
     Spitze fehlt, oben flach), in der Mitte die CHEPHREN-Pyramide (steht
     höher und wirkt darum größer; oben noch ein Rest der glatten
     Kalkstein-Verkleidung), links die kleine MYKERINOS-Pyramide (65 m,
     unten rötlicher Granit) mit ihren drei kleinen Königinnen-
     pyramiden an der Südseite (also links davon).
   - Die SPHINX liegt östlich vor der Chephren-Pyramide in einer
     ausgehauenen Grube, schaut nach Osten (zum Betrachter), Löwenkörper
     mit langen Vorderpranken, Königskopftuch (Nemes), die Nase fehlt.
   - Die FELUKE: Holzboot mit einem schräg nach vorn geneigten kurzen
     Mast und einer sehr langen Rah, die vorn tief und hinten hoch hängt;
     das dreieckige Segel hat unten einen Baum. Rumpf weiß, bunt gestreift.
   - Im BASAR (Khan el-Khalili): Stände mit Zeltstoff „Khayamiya“ (bunte
     Applikationen), Messinglaternen „Fanous“ mit farbigem Glas,
     Papyrus mit Hieroglyphen, Pharaonen-Büsten (Tutanchamun-Maske),
     Bastet-Katzen, Skarabäen aus blauer Fayence, Alabaster-Vasen,
     Parfümflaschen aus buntem Glas, Galabijas am Bügel, Gewürze in
     offenen Säcken (Kurkuma, Paprika, Hibiskus „Karkadeh“).
   - Tee wird schwarz und süß in kleinen GLÄSERN getrunken; dazu
     „Aish Baladi“, das runde Fladenbrot aus Vollkorn.
   BLICK: vom Ostufer (Kairo) über den Nil auf das Plateau. Augenhöhe
   1,6 m, Horizont y = 122. Einheiten je Meter am Boden: s(y) = (y − 122)
   / 1,6 (Händler y 184: 39 → 1,72 m = 66; Tisch y 190: 42).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "aegypten", titel: "Ägypten — Gizeh", emoji: "🐫", thema: "Länder", kuerzel: "b24a", fassung: 852 });
const rnd = zufall(2560);
const r = B.r;
const HY = 122;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const knapp = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);

/* ---------- Stoffe ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter>`);
S.def(`<pattern id="${S.id("kh")}" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#b2322a"/><path d="M4 .6 L7.4 4 L4 7.4 L.6 4 Z" fill="#1f5a8a"/><path d="M4 2 L6 4 L4 6 L2 4 Z" fill="#e8b93c"/><circle cx="4" cy="4" r=".7" fill="#f4ecd8"/><path d="M0 0 L1.2 0 L0 1.2 Z M8 0 L6.8 0 L8 1.2 Z M0 8 L1.2 8 L0 6.8 Z M8 8 L6.8 8 L8 6.8 Z" fill="#2f7a4a"/></pattern>`);
S.def(`<pattern id="${S.id("pflaster")}" width="10" height="5" patternUnits="userSpaceOnUse"><rect width="10" height="5" fill="#d8c29a"/><rect x=".2" y=".2" width="4.6" height="2.1" rx=".3" fill="#e2cda6"/><rect x="5.2" y=".2" width="4.6" height="2.1" rx=".3" fill="#dcc59d"/><rect x="2.7" y="2.7" width="4.6" height="2.1" rx=".3" fill="#e0caa2"/><rect x="-2.3" y="2.7" width="4.6" height="2.1" rx=".3" fill="#d9c398"/><rect x="7.7" y="2.7" width="4.6" height="2.1" rx=".3" fill="#d9c398"/></pattern>`);
const KH = `url(#${S.id("kh")})`;
const HOLZ = S.lg("holz", [[0, "#8a5a32"], [0.5, "#a06d40"], [1, "#7a4c28"]], 0, 0, 1, 0);
const HOLZ_D = S.lg("holzd", [[0, "#5a3a20"], [1, "#3e2714"]]);
const GOLD = S.lg("gold", [[0, "#fbe08a"], [0.45, "#d9a93a"], [1, "#9c6b17"]], 0, 0, 1, 1);
const MESSING = S.lg("messing", [[0, "#f2d58a"], [0.5, "#c9973e"], [1, "#8e6420"]], 0, 0, 1, 0);
const LICHT = S.lg("kalklicht", [[0, "#ecd7a8"], [1, "#d2b47e"]]);
const SCHATTENSEITE = S.lg("kalkschatten", [[0, "#b8996a"], [1, "#9a7c52"]]);

/* =====================================================================
   KULISSE — Himmel (Dunst über Kairo), fernes Ufer, Ufermauer, Pflaster
   ===================================================================== */
{
  let k = `<rect width="320" height="130" fill="${S.lg("himmel", [[0, "#7fa9cf"], [0.5, "#a9c6dc"], [0.82, "#dfdccb"], [1, "#efdcb6"]])}"/>`;
  /* Sonne steht hinten links tief im Dunst nicht — Morgenlicht von Osten (hinter uns) */
  k += `<ellipse cx="160" cy="92" rx="200" ry="20" fill="#f6e3bd" opacity=".55" filter="url(#${S.id("dunst")})"/>`;
  for (const [x, y, w] of [[60, 22, 40], [200, 14, 30], [282, 34, 22]]) {
    k += `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="2.2" fill="#fff" opacity=".45" filter="url(#${S.id("dunst")})"/><ellipse cx="${x + 8}" cy="${y - 1.6}" rx="${w * 0.5}" ry="1.6" fill="#fff" opacity=".35" filter="url(#${S.id("dunst")})"/>`;
  }
  /* Vögel (Milane über dem Fluss) */
  k += `<path d="M118 30 q2 -1.4 3.6 0 q1.6 -1.4 3.6 0" stroke="#4d4a44" stroke-width=".45" fill="none"/><path d="M178 48 q1.4 -1 2.6 0 q1.2 -1 2.6 0" stroke="#5d5952" stroke-width=".4" fill="none"/>`;
  /* fernes Westufer: Palmenhain und Felder vor dem Plateau */
  k += `<path d="M0 118 L320 117 L320 127 L0 127 Z" fill="${S.lg("ufer", [[0, "#7f8f5a"], [1, "#5c7044"]])}"/>`;
  for (let i = 0; i < 46; i++) {
    const x = 2 + i * 7 + rnd() * 4, h = 8 + rnd() * 7, y = 124;
    const c = rnd() < 0.5 ? "#4e6440" : "#5d7349";
    k += `<path d="M${r(x)} ${y} q${r(-0.6 + rnd())} ${r(-h * 0.6)} ${r(rnd() * 1.2 - 0.6)} ${r(-h)}" stroke="#6d5f48" stroke-width=".5" fill="none" opacity=".8"/>`;
    for (let j = 0; j < 6; j++) { const a = -150 + j * 24 + rnd() * 10, l = 2.4 + rnd() * 1.4, ax = x + Math.cos(a * Math.PI / 180) * l, ay = y - h + Math.sin(a * Math.PI / 180) * l * 0.6 + 1.2; k += `<path d="M${r(x)} ${r(y - h)} Q${r((x + ax) / 2)} ${r(y - h - 1.2)} ${r(ax)} ${r(ay)}" stroke="${c}" stroke-width=".8" fill="none" opacity=".85"/>`; }
  }
  k += `<rect x="0" y="112" width="320" height="16" fill="#e9dcc0" opacity=".25"/>`;
  /* Ufermauer (Corniche) aus Granitquadern mit Pollern */
  k += `<rect x="0" y="149" width="320" height="8" fill="${S.lg("mauer", [[0, "#9b8f7e"], [1, "#6f6455"]])}"/>`;
  for (let x = -6; x < 320; x += 12) k += `<rect x="${x + (x % 24 ? 0 : 6)}" y="149.4" width="11.4" height="3.4" fill="none" stroke="#5f5548" stroke-width=".3"/><rect x="${x + 6}" y="153" width="11.4" height="3.6" fill="none" stroke="#5f5548" stroke-width=".3"/>`;
  k += `<rect x="0" y="148.4" width="320" height="1.6" fill="#c9bca3"/>`;
  /* Pflaster der Uferpromenade in Fluchtperspektive */
  k += `<rect x="0" y="156" width="320" height="44" fill="url(#${S.id("pflaster")})"/>`;
  for (let i = -16; i <= 16; i++) k += `<line x1="${r(160 + i * 12 * 34 / 34)}" y1="156" x2="${r(160 + i * 12 * 78 / 34)}" y2="200" stroke="#b49c74" stroke-width=".35" opacity=".7"/>`;
  for (const y of [159, 163, 168, 174, 181, 190]) k += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#b49c74" stroke-width=".35" opacity=".6"/>`;
  k += `<rect x="0" y="156" width="320" height="44" fill="${S.lg("pflasterlicht", [[0, "#6b5434", 0.22], [0.3, "#000", 0], [1, "#fff4dc", 0.18]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE WÜSTE (das Plateau mit Dünen links)
   ===================================================================== */
{
  let k = `<path d="M0 86 Q14 82 30 88 Q46 92 70 93 L320 95 L320 118 L0 118 Z" fill="${S.lg("wueste", [[0, "#ecd3a0"], [0.6, "#dfc08a"], [1, "#c9a56e"]])}"/>`;
  /* Dünenkämme und Windrippel */
  k += `<path d="M0 86 Q14 82 30 88 Q20 90 0 92 Z" fill="#f4e0b4" opacity=".7"/>`;
  for (let i = 0; i < 12; i++) { const y = 96 + i * 1.6, x = rnd() * 280; k += `<path d="M${r(x)} ${r(y)} q8 -1 16 0 q8 1 16 0" stroke="#c4a06a" stroke-width=".3" fill="none" opacity=".55"/>`; }
  /* Abbruchkante des Plateaus zum Fruchtland (Kalkstein, Schichten) */
  k += `<path d="M0 108 Q60 106 120 109 Q200 111 320 108 L320 118 L0 118 Z" fill="${S.lg("kante", [[0, "#c7a571"], [1, "#a8875a"]])}"/>`;
  for (const y of [111, 114]) k += `<path d="M0 ${y} Q80 ${y - 1.4} 160 ${y + 0.6} T320 ${y}" stroke="#94754c" stroke-width=".35" fill="none" opacity=".6"/>`;
  k += `<rect x="0" y="86" width="320" height="32" fill="#f5e7c8" opacity=".14"/>`;
  S.teil({ id: "wueste", de: "die Wüste", syl: "WÜ-ste", it: "il deserto", itSyl: "de-SER-to", en: "desert", x: 160, y: 118, kunst: um(160, 118, k),
    tipp: "Westlich vom Nil beginnt die Wüste. Dort regnet es fast nie." });
}

/* ---------- Pyramide zeichnen: Südseite (links, Schatten) und Ostseite (rechts, Licht) */
function pyramide(cx, basis, hw, h, opt = {}) {
  const L = [cx - hw, basis], R = [cx + hw, basis], C = [cx - hw * 0.34, basis + hw * 0.05], A = [cx, basis - h];
  const top = opt.flach ? 0.035 : 0;
  const At = top ? [[A[0] - hw * top, A[1] + h * top * 1.3], [A[0] + hw * top, A[1] + h * top * 1.3]] : [A, A];
  const cid = S.id("p" + Math.round(cx));
  let g = `<clipPath id="${cid}"><path d="M${r(L[0])} ${r(L[1])} L${r(At[0][0])} ${r(At[0][1])} L${r(At[1][0])} ${r(At[1][1])} L${r(R[0])} ${r(R[1])} L${r(C[0])} ${r(C[1])} Z"/></clipPath>`;
  g += `<path d="M${r(L[0])} ${r(L[1])} L${r(At[0][0])} ${r(At[0][1])} L${r(C[0])} ${r(C[1])} Z" fill="${SCHATTENSEITE}"/>`;
  g += `<path d="M${r(C[0])} ${r(C[1])} L${r(At[0][0])} ${r(At[0][1])} L${r(At[1][0])} ${r(At[1][1])} L${r(R[0])} ${r(R[1])} Z" fill="${LICHT}"/>`;
  /* Steinlagen: waagrechte Fugen, unten breiter */
  let lagen = "";
  const n = Math.round(h / (opt.lage || 2.2));
  for (let i = 1; i < n; i++) { const y = basis - h * (i / n); lagen += `<line x1="${r(cx - hw - 2)}" y1="${r(y)}" x2="${r(cx + hw + 2)}" y2="${r(y + 0.4)}" stroke="#7a5e3a" stroke-width="${i < n * 0.5 ? 0.3 : 0.22}" opacity="${opt.glatt && i > n * (1 - opt.glatt) ? 0 : 0.45}"/>`; }
  /* Verwitterung: hellere und dunklere Flecken */
  for (let i = 0; i < hw * 0.9; i++) { const t = rnd(), u = rnd(); const y = basis - h * t * 0.9, x = cx + (u * 2 - 1) * hw * (1 - t); lagen += `<rect x="${r(x)}" y="${r(y)}" width="${r(1 + rnd() * 2.4)}" height=".6" fill="${rnd() < 0.5 ? "#f3e2bb" : "#8b6c45"}" opacity=".35"/>`; }
  if (opt.glatt) {
    /* Rest der glatten Verkleidung oben (Chephren) — unregelmäßige Unterkante */
    const yg = basis - h * (1 - opt.glatt);
    let d = `M${r(cx - hw * opt.glatt - 1)} ${r(yg + 1)}`;
    for (let i = 1; i <= 8; i++) { const x = cx - hw * opt.glatt + (2 * hw * opt.glatt) * i / 8; d += ` L${r(x)} ${r(yg + (i % 2 ? -1.2 : 0.8) + rnd())}`; }
    d += ` L${r(cx + hw * opt.glatt + 2)} ${r(yg + 1)} L${r(cx)} ${r(basis - h - 2)} Z`;
    lagen += `<path d="${d}" fill="#f1e2c0" opacity=".55"/>`;
  }
  if (opt.granit) lagen += `<rect x="${r(cx - hw - 1)}" y="${r(basis - h * 0.13)}" width="${r(hw * 2 + 2)}" height="${r(h * 0.13 + 2)}" fill="#a0634a" opacity=".45"/>`;
  g += `<g clip-path="url(#${cid})">${lagen}</g>`;
  /* Grat und Lichtkante */
  g += `<path d="M${r(C[0])} ${r(C[1])} L${r(At[0][0])} ${r(At[0][1])}" stroke="#f6e8c8" stroke-width=".5" opacity=".8"/>`;
  /* gestufte Kanten (der Kernmauerwerk-Umriss ist rau) */
  let st = "";
  for (let i = 0; i < n; i += 2) { const t = i / n, y = basis - h * t; st += `<rect x="${r(cx - hw * (1 - t) - 0.4)}" y="${r(y - 1)}" width=".8" height="1" fill="#e4ce9e" opacity=".6"/>`; }
  g += st;
  /* Dunst der Entfernung */
  g += `<path d="M${r(L[0])} ${r(L[1])} L${r(A[0])} ${r(A[1])} L${r(R[0])} ${r(R[1])} Z" fill="#e8dcc4" opacity="${opt.dunst || 0.12}"/>`;
  return g;
}

/* =====================================================================
   2 — DIE DRITTE PYRAMIDE (Mykerinos) mit drei Königinnenpyramiden
   ===================================================================== */
{
  let k = "";
  k += pyramide(135, 104, 5.4, 6.6, { lage: 1.6, dunst: 0.2 });
  k += pyramide(141.6, 103.4, 4.2, 5.2, { lage: 1.6, dunst: 0.22 });
  k += pyramide(147, 102.8, 3.2, 4, { lage: 1.6, dunst: 0.24 });
  k += pyramide(165, 101.5, 16, 21, { lage: 1.6, granit: true, dunst: 0.18 });
  S.teil({ id: "pyramide3", de: "die dritte Pyramide", syl: "DRIT-te Py-ra-MI-de", it: "la terza piramide", itSyl: "TER-za pi-RA-mi-de", en: "third pyramid", x: 152, y: 104, kunst: um(152, 104, k),
    tipp: "Die Mykerinos-Pyramide ist die kleinste der drei. Daneben stehen drei kleine Pyramiden für Königinnen." });
}
/* =====================================================================
   3 — DIE ZWEITE PYRAMIDE (Chephren) — oben noch glatt
   ===================================================================== */
{
  const k = pyramide(216, 100.5, 42, 56, { glatt: 0.2, lage: 2, dunst: 0.12 });
  S.teil({ id: "pyramide2", de: "die zweite Pyramide", syl: "ZWEI-te Py-ra-MI-de", it: "la seconda piramide", itSyl: "se-CON-da pi-RA-mi-de", en: "second pyramid", x: 216, y: 101, kunst: um(216, 101, k),
    tipp: "Die Chephren-Pyramide steht höher als die Cheops-Pyramide. Oben sieht man noch die glatten Steine." });
}
/* =====================================================================
   4 — DIE PYRAMIDE (Cheops, die Große Pyramide) — rechts, Spitze flach
   ===================================================================== */
{
  let k = pyramide(279, 104.5, 41, 52, { flach: true, lage: 2, dunst: 0.08 });
  /* Messmast auf der Spitze (zeigt die alte Höhe) */
  k += `<line x1="279" y1="54.4" x2="279" y2="49.6" stroke="#6b5a40" stroke-width=".45"/>`;
  S.teil({ id: "pyramide", de: "die Pyramide", syl: "Py-ra-MI-de", it: "la piramide", itSyl: "pi-RA-mi-de", en: "pyramid", x: 279, y: 105, kunst: um(279, 105, k),
    tipp: "Die Cheops-Pyramide ist über 4500 Jahre alt und 139 Meter hoch." });
}

/* =====================================================================
   5 — DIE SPHINX (vor der Chephren-Pyramide, schaut nach Osten)
   ===================================================================== */
{
  /* Maße wie das Vorbild: 73 m lang, 20 m hoch, der Kopf klein zum Körper */
  const X = 196, Y = 116;
  let k = "";
  /* die Grube, aus dem Fels gehauen (Rückwand mit Gesteinsschichten) */
  k += `<path d="M${X - 44} ${Y - 9} L${X + 28} ${Y - 10} L${X + 31} ${Y} L${X - 47} ${Y} Z" fill="${S.lg("grube", [[0, "#a8865a"], [1, "#8a6c45"]])}"/>`;
  for (const y of [Y - 7.4, Y - 5, Y - 2.6]) k += `<line x1="${X - 45}" y1="${y}" x2="${X + 29}" y2="${y - 0.4}" stroke="#7a5d3a" stroke-width=".3" opacity=".6"/>`;
  const KOERPER = S.lg("sphinx", [[0, "#dcbf8a"], [0.6, "#c39f68"], [1, "#a8844f"]]);
  /* Löwenkörper: Hinterteil links hinten, Rücken fast waagrecht */
  k += `<path d="M${X - 40} ${Y} Q${X - 42} ${Y - 6} ${X - 37} ${Y - 7.6} Q${X - 20} ${Y - 9} ${X - 2} ${Y - 9.4} L${X + 3} ${Y - 8} L${X + 4} ${Y} Z" fill="${KOERPER}"/>`;
  for (const [y, a] of [[Y - 7, 0.5], [Y - 5, 0.45], [Y - 3, 0.5]]) k += `<path d="M${X - 39} ${y} Q${X - 20} ${y - 0.8} ${X + 3} ${y}" stroke="#94713f" stroke-width=".35" fill="none" opacity="${a}"/>`;
  /* Hinterschenkel und Schwanz, der um die Flanke liegt */
  k += `<path d="M${X - 39} ${Y} Q${X - 38} ${Y - 5.6} ${X - 31} ${Y - 5} Q${X - 27} ${Y - 3} ${X - 28} ${Y} Z" fill="#b8955f"/>`;
  k += `<path d="M${X - 30} ${Y - 0.6} Q${X - 24} ${Y - 1.4} ${X - 20} ${Y - 0.4}" stroke="#94713f" stroke-width=".5" fill="none"/>`;
  /* Vorderpranken: lang nach vorn rechts zum Betrachter */
  k += `<path d="M${X + 1} ${Y} L${X + 2} ${Y - 3.6} L${X + 24} ${Y - 2.8} Q${X + 26.4} ${Y - 2} ${X + 25.6} ${Y - 0.2} L${X + 1} ${Y + 0.2} Z" fill="${S.lg("pranke", [[0, "#dcc08e"], [1, "#b18b56"]])}"/>`;
  k += `<path d="M${X + 3} ${Y - 2} L${X + 25} ${Y - 1.4}" stroke="#94713f" stroke-width=".3"/>`;
  /* Brust */
  k += `<path d="M${X - 3} ${Y} Q${X - 4} ${Y - 7} ${X - 1.6} ${Y - 10.4} L${X + 5.6} ${Y - 10.4} Q${X + 7} ${Y - 5} ${X + 5.4} ${Y} Z" fill="${KOERPER}"/>`;
  /* Kopf mit Nemes-Kopftuch: Schultertücher fallen seitlich auf die Brust */
  k += `<path d="M${X - 2} ${Y - 7.4} L${X - 1.2} ${Y - 14.4} Q${X + 2} ${Y - 18.6} ${X + 5.4} ${Y - 14.4} L${X + 6.6} ${Y - 7.4} L${X + 4.8} ${Y - 8.4} L${X + 4.2} ${Y - 11.4} L${X} ${Y - 11.4} L${X - 0.4} ${Y - 8.4} Z" fill="${S.lg("nemes", [[0, "#cfae76"], [1, "#a8834e"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${r(X - 1.6 + i * 0.15)} ${r(Y - 9 - i * 1.3)} L${r(X - 0.2)} ${r(Y - 9 - i * 1.3)} M${r(X + 4.6)} ${r(Y - 9 - i * 1.3)} L${r(X + 6.2 - i * 0.15)} ${r(Y - 9 - i * 1.3)}" stroke="#8f6c3c" stroke-width=".3"/>`;
  /* Gesicht: ernst, verwittert, die Nase fehlt */
  k += `<path d="M${X - 0.2} ${Y - 15} Q${X + 2.1} ${Y - 15.9} ${X + 4.4} ${Y - 15} L${X + 4.2} ${Y - 11.2} Q${X + 2.1} ${Y - 9.8} ${X} ${Y - 11.2} Z" fill="${S.lg("gesicht", [[0, "#dcc190"], [1, "#b99460"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${X + 0.5} ${Y - 13.6} h1.2 M${X + 2.7} ${Y - 13.6} h1.2" stroke="#6b4f2c" stroke-width=".4"/>`;
  k += `<path d="M${X + 1.7} ${Y - 13.2} L${X + 2.6} ${Y - 13.2} L${X + 2.5} ${Y - 12.2} L${X + 1.7} ${Y - 12.3} Z" fill="#8f6c3c" opacity=".8"/>`;
  k += `<path d="M${X + 1.3} ${Y - 11.4} h1.6" stroke="#6b4f2c" stroke-width=".3"/>`;
  k += `<path d="M${X - 1} ${Y - 14.6} Q${X + 2} ${Y - 18} ${X + 5.2} ${Y - 14.6}" stroke="#ead4a6" stroke-width=".45" fill="none" opacity=".8"/>`;
  /* Taltempel davor (Mauerblöcke) */
  k += `<path d="M${X + 12} ${Y + 0.4} L${X + 12} ${Y - 4.6} L${X + 32} ${Y - 5} L${X + 32} ${Y + 0.4} Z" fill="#b39364"/><path d="M${X + 12} ${Y - 4.6} L${X + 32} ${Y - 5}" stroke="#e2c794" stroke-width=".5"/>`;
  k += `<rect x="${X + 16}" y="${Y - 3.6}" width="3" height="4" fill="#7c6040"/>`;
  S.teil({ id: "sphinx", de: "die Sphinx", syl: "SPHINX", it: "la sfinge", itSyl: "SFIN-ge", en: "sphinx", x: X, y: Y, kunst: um(X, Y, k),
    tipp: "Die Sphinx hat den Körper eines Löwen und den Kopf eines Königs. Ihre Nase fehlt." });
}

/* =====================================================================
   6 — DER NIL
   ===================================================================== */
{
  let k = `<rect x="0" y="126" width="320" height="23" fill="${S.lg("nil", [[0, "#8fb0b4"], [0.35, "#5f8f9e"], [1, "#3c6c7d"]])}"/>`;
  k += `<rect x="0" y="126" width="320" height="2.2" fill="#a7c2bf" opacity=".8"/>`;
  /* Spiegelung des Palmenufers und Wellen */
  k += `<rect x="0" y="127.5" width="320" height="3" fill="#4f6b4b" opacity=".25"/>`;
  for (let i = 0; i < 46; i++) {
    const y = 130 + rnd() * 18, x = rnd() * 310, w = 4 + (y - 126) * 0.5 * rnd() + 3;
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} -.6 ${r(w)} 0" stroke="${rnd() < 0.6 ? "#d6e7e6" : "#2f5967"}" stroke-width="${r(0.25 + (y - 126) * 0.012)}" fill="none" opacity=".6"/>`;
  }
  S.teil({ id: "nil", de: "der Nil", syl: "NIL", it: "il Nilo", itSyl: "NI-lo", en: "the Nile", x: 160, y: 149, kunst: um(160, 149, k),
    tipp: "Der Nil ist über 6600 Kilometer lang. Er fließt nach Norden ins Mittelmeer." });
}

/* =====================================================================
   7 — DAS SEGELBOOT (die Feluke)
   ===================================================================== */
{
  const X = 250, Y = 143;
  let k = "";
  /* Spiegelung im Wasser */
  k += `<path d="M-22 1 L18 1 L17 5.5 L-14 5.5 Z" fill="#f2ede0" opacity=".14"/>`;
  /* Rumpf: weiß mit blauem und rotem Streifen, Bug links hochgezogen */
  k += `<path d="M-25 -7 Q-20 -3.6 -12 -3.4 L18 -3.6 Q22 -4 23 -6.4 L21 1.6 Q8 3.2 -10 2.6 Q-19 1.6 -25 -7 Z" fill="${S.lg("rumpf", [[0, "#ffffff"], [1, "#d7d9d6"]])}"/>`;
  k += `<path d="M-22 -3.6 Q-16 -1 -10 -1 L20 -1.2" stroke="#2f6fb0" stroke-width="1.1" fill="none"/><path d="M-19 -1 Q-14 .7 -10 .8 L20.6 .6" stroke="#c9392e" stroke-width=".7" fill="none"/>`;
  k += `<path d="M-12 -3.4 L18 -3.6" stroke="#8b6a44" stroke-width=".6"/>`;
  /* Mast, nach vorn geneigt; lange Rah vorn tief, hinten hoch; Baum unten */
  k += `<line x1="-6" y1="-3.4" x2="-9" y2="-31" stroke="#6b4a2c" stroke-width=".9"/>`;
  k += `<path d="M-23 -9 Q-9 -36 26 -66" stroke="#5a3d22" stroke-width=".8" fill="none"/>`;
  k += `<path d="M-22.6 -9.4 Q-9 -35.4 25.6 -65.4 Q21 -40 20 -8.2 Q0 -6.6 -22.6 -9.4 Z" fill="${S.lg("segel", [[0, "#fbf8ef"], [0.6, "#efe8d6"], [1, "#d8cfba"]], 0, 0, 1, 0)}"/>`;
  /* Bahnen und Flicken des Segels */
  for (let i = 1; i < 6; i++) k += `<path d="M${r(-22 + i * 7)} ${r(-9.4 + i * 0.4)} Q${r(-14 + i * 7.4)} ${r(-28 - i * 5)} ${r(-4 + i * 5.8)} ${r(-37 - i * 5.4)}" stroke="#cbc1aa" stroke-width=".3" fill="none"/>`;
  k += `<rect x="6" y="-28" width="4" height="5" fill="#e6dcc4" transform="rotate(-20 8 -25)"/>`;
  k += `<path d="M-22 -8.6 L20 -7.6" stroke="#6b4a2c" stroke-width=".7"/>`;
  /* Schot zum Heck und Steuermann-Pinne */
  k += `<line x1="20" y1="-7.6" x2="18" y2="-3.6" stroke="#4a3a2a" stroke-width=".25"/><path d="M21 -4 L25 -8" stroke="#6b4a2c" stroke-width=".6"/>`;
  k += `<path d="M-20 -11 Q-6 -34 24 -62" stroke="#fff" stroke-width=".5" opacity=".7" fill="none"/>`;
  S.teil({ id: "felucke", de: "das Segelboot", syl: "SE-gel-boot", it: "la feluca", itSyl: "fe-LU-ca", en: "felucca", x: X, y: Y, kunst: k,
    tipp: "Das Segelboot auf dem Nil heißt Feluke. Es hat ein großes, schräges Dreieckssegel." });
}

/* =====================================================================
   8 — DIE DATTELPALME (rechts am Ufer)
   ===================================================================== */
{
  const X = 300, Y = 162;
  let k = schatten(0, 0.2, 8, 1.4, 0.3);
  k += `<ellipse cx="0" cy="0" rx="7" ry="1.8" fill="#8f7c5e"/><path d="M-7 0 L-7 -2 Q0 -4 7 -2 L7 0 Q0 2 -7 0 Z" fill="#b5a281"/>`;
  /* Stamm mit Blattnarben (Rautenmuster) */
  k += `<path d="M-3 -2 Q-5 -60 -1 -130 L3 -130 Q0 -60 3.6 -2 Z" fill="${S.lg("stamm", [[0, "#7a6145"], [0.5, "#9b7d58"], [1, "#6a5238"]], 0, 0, 1, 0)}"/>`;
  for (let y = -6; y > -128; y -= 3.2) { const x = -3.6 + (-(y) / 130) * 2.4 - Math.sin(-y / 60) * 1.3; k += `<path d="M${r(x)} ${r(y)} l3 -1.6 l3 1.6" stroke="#5a4530" stroke-width=".45" fill="none"/>`; }
  /* Krone: gefiederte Wedel */
  const kx = 1, ky = -130;
  const wedel = (a, l, c) => {
    const ex = kx + Math.cos(a) * l, ey = ky + Math.sin(a) * l * 0.7 + l * 0.3, mx = kx + Math.cos(a) * l * 0.5, my = ky + Math.sin(a) * l * 0.5 - 4;
    let g = `<path d="M${kx} ${ky} Q${r(mx)} ${r(my)} ${r(ex)} ${r(ey)}" stroke="#5f7a34" stroke-width=".8" fill="none"/>`;
    for (let i = 1; i < 12; i++) {
      const t = i / 12, px = (1 - t) * (1 - t) * kx + 2 * (1 - t) * t * mx + t * t * ex, py = (1 - t) * (1 - t) * ky + 2 * (1 - t) * t * my + t * t * ey;
      const fl = 5.5 * (1 - t * 0.6);
      g += `<path d="M${r(px)} ${r(py)} l${r(-fl * 0.5)} ${r(fl)} M${r(px)} ${r(py)} l${r(fl * 0.5)} ${r(fl)}" stroke="${c}" stroke-width=".7"/>`;
    }
    return g;
  };
  const winkel = [-3.0, -2.6, -2.2, -1.7, -1.2, -0.7, -0.3, 0.2, 0.5, 2.6, 2.9, -1.95];
  winkel.forEach((a, i) => { k += wedel(a, (Math.cos(a) > 0 ? 13 : 22) + (i % 3) * 4, i % 2 ? "#5c8a3a" : "#4b7530"); });
  /* Datteltrauben unter der Krone */
  for (const [dx, n] of [[-4, 14], [5, 12]]) {
    k += `<path d="M${kx} ${ky + 2} q${dx * 0.4} 3 ${dx} 7" stroke="#c79a3a" stroke-width=".6" fill="none"/>`;
    for (let i = 0; i < n; i++) k += `<ellipse cx="${r(kx + dx + (rnd() - 0.5) * 5)}" cy="${r(ky + 9 + rnd() * 6)}" rx=".9" ry="1.2" fill="${rnd() < 0.5 ? "#d4802a" : "#b8541f"}"/>`;
  }
  S.teil({ id: "dattelpalme", de: "die Dattelpalme", syl: "DAT-tel-pal-me", it: "la palma da datteri", itSyl: "PAL-ma da DAT-te-ri", en: "date palm", x: X, y: Y, steht: true, kunst: k,
    tipp: "Datteln wachsen in großen Trauben direkt unter den Palmwedeln." });
}

/* =====================================================================
   9 — DER STAND im Basar (mit Lupe: Souvenirs)
   ===================================================================== */
const ST = { x0: 4, x1: 118, dach: 62, saum: 78, theke: 152, boden: 185 };
const standUnter = [];
{
  let k = "";
  const W = ST.x1 - ST.x0;
  /* Rückwand im Schatten unter dem Dach */
  k += `<rect x="${ST.x0 + 2}" y="${ST.saum - 2}" width="${W - 4}" height="${ST.boden - ST.saum + 2}" fill="${S.lg("rueck", [[0, "#3e2a1c"], [1, "#5a3e28"]])}"/>`;
  k += `<rect x="${ST.x0 + 2}" y="${ST.saum - 2}" width="${W - 4}" height="${ST.boden - ST.saum + 2}" fill="${KH}" opacity=".22"/>`;
  /* Pfosten */
  k += `<rect x="${ST.x0}" y="${ST.dach}" width="3" height="${ST.boden - ST.dach}" fill="${HOLZ}"/><rect x="${ST.x1 - 3}" y="${ST.dach}" width="3" height="${ST.boden - ST.dach}" fill="${HOLZ}"/>`;
  /* Dach aus Khayamiya-Zeltstoff mit gezacktem Saum und Quasten */
  k += `<path d="M${ST.x0 - 3} ${ST.saum} L${ST.x0 + 4} ${ST.dach} L${ST.x1 - 4} ${ST.dach} L${ST.x1 + 3} ${ST.saum} Z" fill="${KH}"/>`;
  k += `<path d="M${ST.x0 - 3} ${ST.saum} L${ST.x0 + 4} ${ST.dach} L${ST.x1 - 4} ${ST.dach} L${ST.x1 + 3} ${ST.saum} Z" fill="${S.lg("dachlicht", [[0, "#fff", 0.18], [1, "#000", 0.12]])}"/>`;
  let saum = `M${ST.x0 - 3} ${ST.saum}`;
  for (let x = ST.x0 - 3; x < ST.x1 + 3; x += 6) saum += ` Q${x + 3} ${ST.saum + 5} ${x + 6} ${ST.saum}`;
  k += `<path d="${saum} Z" fill="#e8b93c"/><path d="${saum}" stroke="#7a1e18" stroke-width=".5" fill="none"/>`;
  for (let x = ST.x0; x < ST.x1 + 3; x += 6) k += `<line x1="${x}" y1="${ST.saum + 2.6}" x2="${x}" y2="${ST.saum + 5.4}" stroke="#b2322a" stroke-width=".7"/><circle cx="${x}" cy="${ST.saum + 5.8}" r=".7" fill="#1f5a8a"/>`;
  /* Papyrus mit Hieroglyphen (Rahmen an der Rückwand) */
  const P = { x: 10, y: 84, w: 28, h: 20 };
  k += `<rect x="${P.x - 1}" y="${P.y - 1}" width="${P.w + 2}" height="${P.h + 2}" fill="#2a1a0e"/>`;
  k += `<rect x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}" fill="${S.lg("papyrus", [[0, "#e9d6a6"], [1, "#d3b980"]], 0, 0, 1, 1)}"/>`;
  for (let i = 0; i < 9; i++) k += `<line x1="${P.x}" y1="${r(P.y + 1 + i * 2.2)}" x2="${P.x + P.w}" y2="${r(P.y + 1 + i * 2.2)}" stroke="#bfa16a" stroke-width=".25" opacity=".7"/>`;
  /* Kartusche und drei Zeilen Zeichen: Auge, Vogel, Anch, Wasser, Schilf */
  k += `<rect x="${P.x + 2}" y="${P.y + 2}" width="5" height="16" rx="2.4" fill="none" stroke="#7a1e18" stroke-width=".45"/>`;
  k += `<circle cx="${P.x + 4.5}" cy="${P.y + 5}" r="1.1" fill="#c9392e"/><path d="M${P.x + 3.4} ${P.y + 8.6} h2.2 M${P.x + 4.5} ${P.y + 7.4} v2.4" stroke="#1d1712" stroke-width=".4"/><path d="M${P.x + 3.3} ${P.y + 12} l.6 -.8 l.6 .8 l.6 -.8 l.6 .8" stroke="#1f5a8a" stroke-width=".35" fill="none"/><ellipse cx="${P.x + 4.5}" cy="${P.y + 15.4}" rx="1" ry=".6" fill="#1d1712"/>`;
  const zeichen = [
    (x, y) => `<ellipse cx="${x}" cy="${y}" rx="1.3" ry=".6" fill="none" stroke="#1d1712" stroke-width=".35"/><circle cx="${x}" cy="${y}" r=".35" fill="#1d1712"/><path d="M${x - 0.2} ${y + 0.6} l-.4 1.2" stroke="#1d1712" stroke-width=".3"/>`,
    (x, y) => `<path d="M${x - 1} ${y + 1} q.2 -1.6 1 -1.6 q.6 0 .8 -.6 l.4 .2 l-.4 .5 q.2 1 -.4 1.5 l.4 .6 M${x - 0.2} ${y + 1} v.6" stroke="#1d1712" stroke-width=".3" fill="#2a6b4a"/>`,
    (x, y) => `<ellipse cx="${x}" cy="${y - 0.8}" rx=".5" ry=".6" fill="none" stroke="#b2322a" stroke-width=".35"/><path d="M${x - 0.9} ${y} h1.8 M${x} ${y - 0.2} v1.6" stroke="#b2322a" stroke-width=".35"/>`,
    (x, y) => `<path d="M${x - 1.2} ${y} l.4 -.5 l.4 .5 l.4 -.5 l.4 .5 l.4 -.5" stroke="#1f5a8a" stroke-width=".35" fill="none"/>`,
    (x, y) => `<path d="M${x} ${y + 1} v-2 q.6 .2 .6 -.6" stroke="#1d1712" stroke-width=".35" fill="none"/>`,
    (x, y) => `<path d="M${x - 1} ${y + 0.6} h2 v-1.2 a1 1 0 0 0 -2 0 Z" fill="#c79a3a"/>`,
  ];
  for (let row = 0; row < 3; row++) for (let c = 0; c < 6; c++) k += zeichen[(row * 2 + c) % 6](r(P.x + 10 + c * 3.2), r(P.y + 4.4 + row * 5.8));
  standUnter.push({ id: "hieroglyphen", de: "die Hieroglyphen", syl: "Hie-ro-GLY-phen", it: "i geroglifici", itSyl: "ge-ro-GLI-fi-ci", en: "hieroglyphs", x: P.x + P.w / 2, y: P.y + P.h, kunst: flaeche(-P.w / 2 - 1, -P.h - 1, P.w + 2, P.h + 2),
    tipp: "Mit Hieroglyphen schrieben die alten Ägypter – auf Stein und auf Papyrus." });

  /* Regalbretter */
  const B1 = 112, B2 = 134;
  k += `<rect x="42" y="${B1}" width="36" height="2" fill="${HOLZ}"/><rect x="42" y="${B1 + 2}" width="36" height=".8" fill="#2a1a0e" opacity=".6"/>`;
  k += `<rect x="8" y="${B2}" width="70" height="2" fill="${HOLZ}"/><rect x="8" y="${B2 + 2}" width="70" height=".8" fill="#2a1a0e" opacity=".6"/>`;
  /* DER PHARAO — goldene Maske des Tutanchamun als Büste */
  {
    const x = 54, y = B1;
    let g = `<path d="M${x - 7} ${y} L${x - 7.4} ${y - 9} Q${x - 7} ${y - 17} ${x} ${y - 18} Q${x + 7} ${y - 17} ${x + 7.4} ${y - 9} L${x + 7} ${y} Z" fill="${GOLD}"/>`;
    for (let i = 0; i < 6; i++) g += `<path d="M${x - 7.2} ${r(y - 10 + i * 1.7)} h3 M${x + 4.2} ${r(y - 10 + i * 1.7)} h3" stroke="#1f3f8a" stroke-width=".8"/>`;
    for (let i = 0; i < 4; i++) g += `<path d="M${x - 4.6 + i * 0.2} ${r(y - 16 + i * 1.6)} Q${x} ${r(y - 17.2 + i * 1.6)} ${x + 4.6 - i * 0.2} ${r(y - 16 + i * 1.6)}" stroke="#1f3f8a" stroke-width=".6" fill="none"/>`;
    g += `<path d="M${x - 3.6} ${y - 12} Q${x} ${y - 13.4} ${x + 3.6} ${y - 12} L${x + 3.2} ${y - 6.6} Q${x} ${y - 4.6} ${x - 3.2} ${y - 6.6} Z" fill="${S.lg("maske", [[0, "#ffe9a6"], [1, "#d9a93a"]])}"/>`;
    g += `<path d="M${x - 2.4} ${y - 10} h1.6 M${x + 0.8} ${y - 10} h1.6" stroke="#111" stroke-width=".55"/><path d="M${x - 0.6} ${y - 7.4} h1.2" stroke="#9c6b17" stroke-width=".4"/>`;
    g += `<rect x="${x - 0.7}" y="${y - 5.2}" width="1.4" height="3.4" rx=".5" fill="#1f3f8a"/>`;
    g += `<path d="M${x - 5} ${y - 2.4} Q${x} ${y - 0.6} ${x + 5} ${y - 2.4}" stroke="#2a6b8a" stroke-width="1" fill="none"/>`;
    g += `<circle cx="${x}" cy="${y - 16.8}" r=".7" fill="#d9a93a" stroke="#1f3f8a" stroke-width=".25"/>`;
    k += g;
    standUnter.push({ id: "pharao", de: "der Pharao", syl: "PHA-ra-o", it: "il faraone", itSyl: "fa-ra-O-ne", en: "pharaoh", x, y, kunst: flaeche(-8, -19, 16, 19),
      tipp: "Das ist Tutanchamun. Er wurde schon mit neun Jahren Pharao, also König von Ägypten." });
  }
  /* DIE KATZE — Bastet-Figur, schwarz mit Goldschmuck */
  {
    const x = 70, y = B1;
    let g = `<rect x="${x - 4}" y="${y - 1.4}" width="8" height="1.4" fill="#1d1a18"/>`;
    g += `<path d="M${x - 3} ${y - 1.4} Q${x - 3.6} ${y - 7} ${x - 1.6} ${y - 10} L${x - 1.4} ${y - 12} L${x - 2} ${y - 15} L${x - 0.6} ${y - 13.6} L${x + 0.6} ${y - 13.6} L${x + 2} ${y - 15} L${x + 1.4} ${y - 12} L${x + 1.6} ${y - 10} Q${x + 3.6} ${y - 7} ${x + 3} ${y - 1.4} Z" fill="${S.lg("bastet", [[0, "#3a3a3e"], [0.5, "#16161a"], [1, "#2a2a2e"]], 0, 0, 1, 0)}"/>`;
    g += `<path d="M${x - 1.4} ${y - 9.6} Q${x} ${y - 8.6} ${x + 1.4} ${y - 9.6}" stroke="#d9a93a" stroke-width=".5" fill="none"/><circle cx="${x}" cy="${y - 8.6}" r=".45" fill="#d9a93a"/>`;
    g += `<circle cx="${x - 0.6}" cy="${y - 12.2}" r=".25" fill="#d9a93a"/><circle cx="${x + 0.6}" cy="${y - 12.2}" r=".25" fill="#d9a93a"/>`;
    g += `<path d="M${x - 2.4} ${y - 8} Q${x - 2.6} ${y - 4} ${x - 1.8} ${y - 2}" stroke="#fff" stroke-width=".35" opacity=".35" fill="none"/>`;
    k += g;
    standUnter.push({ id: "katze", de: "die Katze", syl: "KAT-ze", it: "il gatto", itSyl: "GAT-to", en: "cat", x, y, kunst: flaeche(-4.5, -16, 9, 16),
      tipp: "Die Katze war den alten Ägyptern heilig. Die Göttin Bastet hat einen Katzenkopf." });
  }
  /* DIE VASE — Alabaster, durchscheinend */
  {
    let g = "";
    for (const [x, s] of [[16, 1], [26, 0.8]]) {
      const y = B2;
      g += `<path d="M${r(x - 2 * s)} ${y} Q${r(x - 4.6 * s)} ${r(y - 5 * s)} ${r(x - 3.4 * s)} ${r(y - 9 * s)} Q${r(x - 1.6 * s)} ${r(y - 11 * s)} ${r(x - 1.6 * s)} ${r(y - 12.6 * s)} L${r(x + 1.6 * s)} ${r(y - 12.6 * s)} Q${r(x + 1.6 * s)} ${r(y - 11 * s)} ${r(x + 3.4 * s)} ${r(y - 9 * s)} Q${r(x + 4.6 * s)} ${r(y - 5 * s)} ${r(x + 2 * s)} ${y} Z" fill="${S.lg("alabaster", [[0, "#fbf3e2"], [0.5, "#efe0c2"], [1, "#d8c39b"]], 0, 0, 1, 0)}"/>`;
      g += `<ellipse cx="${x}" cy="${r(y - 12.6 * s)}" rx="${r(1.8 * s)}" ry=".5" fill="#cdb68c"/>`;
      g += `<path d="M${r(x - 3.4 * s)} ${r(y - 6 * s)} Q${x} ${r(y - 5 * s)} ${r(x + 3.4 * s)} ${r(y - 6.6 * s)}" stroke="#c8ae82" stroke-width=".3" fill="none"/><path d="M${r(x - 2.6 * s)} ${r(y - 8 * s)} q-.6 3 .2 6" stroke="#fff" stroke-width=".5" opacity=".6" fill="none"/>`;
    }
    k += g;
    standUnter.push({ id: "vase", de: "die Vase", syl: "VA-se", it: "il vaso", itSyl: "VA-so", en: "vase", x: 20, y: B2, kunst: flaeche(-8, -13.4, 14, 13.4),
      tipp: "Die Vasen sind aus Alabaster, einem weichen, hellen Stein." });
  }
  /* DIE PARFÜMFLASCHE — mundgeblasenes buntes Glas mit Goldrand */
  {
    let g = "";
    [["#2b7fc9", 38], ["#c9392e", 45], ["#2f9a5a", 52], ["#8a3fb0", 59]].forEach(([c, x], i) => {
      const y = B2, h = 9 + (i % 2) * 2.4;
      g += `<path d="M${x - 2.4} ${y} Q${x - 3.4} ${y - 3} ${x} ${r(y - h * 0.55)} Q${x + 3.4} ${y - 3} ${x + 2.4} ${y} Z" fill="${c}" opacity=".85"/>`;
      g += `<path d="M${x - 0.4} ${r(y - h * 0.55)} L${x - 0.5} ${r(y - h + 1.6)} L${x + 0.5} ${r(y - h + 1.6)} L${x + 0.4} ${r(y - h * 0.55)}" fill="${c}" stroke="#d9a93a" stroke-width=".2"/>`;
      g += `<path d="M${x} ${r(y - h + 1.6)} q-1 -1.6 0 -2.4 q1 .8 0 2.4" fill="#d9a93a"/>`;
      g += `<path d="M${x - 2.4} ${y - 1.6} Q${x} ${y - 0.8} ${x + 2.4} ${y - 1.6}" stroke="#e8c45a" stroke-width=".35" fill="none"/><ellipse cx="${x - 1}" cy="${y - 2.8}" rx=".5" ry="1" fill="#fff" opacity=".55"/>`;
    });
    k += g;
    standUnter.push({ id: "parfuemflasche", de: "die Parfümflasche", syl: "par-FÜM-fla-sche", it: "la boccetta di profumo", itSyl: "boc-CET-ta di pro-FU-mo", en: "perfume bottle", x: 48.5, y: B2, kunst: flaeche(-13, -12, 26, 12) });
  }
  /* Ladentisch vorne links, mit Stoff behangen */
  k += `<rect x="6" y="${ST.theke}" width="74" height="${ST.boden - ST.theke}" fill="${HOLZ_D}"/>`;
  k += `<path d="M6 ${ST.theke + 2} L80 ${ST.theke + 2} L80 ${ST.boden - 6} Q43 ${ST.boden - 3} 6 ${ST.boden - 6} Z" fill="${KH}"/>`;
  k += `<path d="M6 ${ST.theke + 2} L80 ${ST.theke + 2} L80 ${ST.boden - 6} Q43 ${ST.boden - 3} 6 ${ST.boden - 6} Z" fill="${S.lg("tuchschatten", [[0, "#000", 0.05], [1, "#000", 0.3]])}"/>`;
  k += `<rect x="4" y="${ST.theke - 1.6}" width="78" height="2.4" rx=".6" fill="${HOLZ}"/>`;
  /* DER SKARABÄUS — Schale mit blauen Fayence-Käfern auf dem Ladentisch */
  {
    const x = 34, y = ST.theke - 1.6;
    let g = `<path d="M${x - 9} ${y - 2} Q${x} ${y + 1.2} ${x + 9} ${y - 2} Z" fill="${MESSING}"/><ellipse cx="${x}" cy="${y - 2}" rx="9" ry="1.2" fill="#e9c66e"/>`;
    for (const [dx, dy, s] of [[-5.4, -2.6, 0.8], [-1.6, -3.2, 1], [2.6, -2.8, 0.9], [6, -2.4, 0.75], [0.6, -4.6, 1.15]]) {
      const cx = x + dx, cy = y + dy;
      g += `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(1.9 * s)}" ry="${r(1.3 * s)}" fill="${S.rg("fayence", [[0, "#7fd0d8"], [0.6, "#2a8fa0"], [1, "#145b6a"]], 0.35, 0.3, 0.8)}"/>`;
      g += `<path d="M${r(cx)} ${r(cy - 1.3 * s)} v${r(2.6 * s)} M${r(cx - 1.8 * s)} ${r(cy - 0.3 * s)} h${r(3.6 * s)}" stroke="#0e3e48" stroke-width=".22"/>`;
      g += `<ellipse cx="${r(cx)}" cy="${r(cy - 1.5 * s)}" rx="${r(0.9 * s)}" ry="${r(0.5 * s)}" fill="#1f6f7f"/>`;
    }
    k += g;
    standUnter.push({ id: "skarabaeus", de: "der Skarabäus", syl: "Ska-ra-BÄ-us", it: "lo scarabeo", itSyl: "sca-ra-BE-o", en: "scarab", x, y, kunst: flaeche(-10, -7, 20, 8),
      tipp: "Der Skarabäus ist ein Käfer. Für die alten Ägypter brachte er Glück." });
  }
  /* Messingteller an der Rückwand rechts (Schmuck des Standes) */
  k += `<circle cx="100" cy="98" r="6" fill="${MESSING}"/><circle cx="100" cy="98" r="4.4" fill="none" stroke="#8e6420" stroke-width=".35"/><circle cx="100" cy="98" r="2" fill="none" stroke="#8e6420" stroke-width=".3"/>`;
  S.teil({ id: "stand", de: "der Stand", syl: "STAND", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "stall", x: (ST.x0 + ST.x1) / 2, y: ST.boden, steht: true, kunst: um((ST.x0 + ST.x1) / 2, ST.boden, k),
    zoom: { x: 4, y: 76, w: 114, h: 76 },
    unter: standUnter,
    tipp: "Im Basar gibt es viele Stände mit Andenken, Stoffen und Gewürzen." });
}

/* =====================================================================
   10 — DIE FLAGGE (auf dem Dach des Standes)
   ===================================================================== */
{
  const X = 10, Y = 62;
  let k = `<rect x="-.6" y="-36" width="1.2" height="36" fill="#cfcfcf"/><circle cx="0" cy="-36.6" r="1" fill="#d9a93a"/>`;
  const welle = (y0, y1, c) => `<path d="M1 ${y0} Q8 ${y0 - 2} 14 ${y0} T27 ${y0 - 0.4} L27 ${y1 - 0.4} Q20 ${y1 - 2} 14 ${y1} T1 ${y1} Z" fill="${c}"/>`;
  k += welle(-35, -30, "#c8102e") + welle(-30, -25, "#f7f7f2") + welle(-25, -20, "#18181a");
  /* Adler des Saladin (golden) in der Mitte */
  k += `<path d="M12.4 -26.2 l1.6 -2 l1.6 2 l-.5 1 h-2.2 Z M11.4 -27.6 l2.6 .9 M17.6 -27.6 l-2.6 .9" stroke="#c09020" stroke-width=".4" fill="#c09020"/>`;
  k += `<path d="M1 -35 Q8 -37 14 -35 L14 -20 Q8 -22 1 -20 Z" fill="#fff" opacity=".12"/>`;
  S.teil({ id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: X, y: Y, kunst: k,
    tipp: "Die Flagge Ägyptens ist rot, weiß und schwarz – mit einem goldenen Adler." });
}

/* =====================================================================
   11 — DIE LATERNE (Fanous) unter dem Dach
   ===================================================================== */
{
  let k = "";
  for (const [x, top, s, glas] of [[-23, 0, 1, ["#c9392e", "#2f9a5a", "#e8b93c"]], [23, 0, 0.9, ["#2b7fc9", "#e8b93c", "#c9392e"]]]) {
    const y = top;
    k += `<line x1="${x}" y1="${y - 2}" x2="${x}" y2="${y + 2}" stroke="#3a2a18" stroke-width=".4"/>`;
    k += `<circle cx="${x}" cy="${y + 2.4}" r=".6" fill="none" stroke="#8e6420" stroke-width=".4"/>`;
    k += `<path d="M${x} ${y + 3} L${r(x + 3.4 * s)} ${r(y + 6.4 * s)} L${r(x - 3.4 * s)} ${r(y + 6.4 * s)} Z" fill="${MESSING}"/>`;
    k += `<rect x="${r(x - 4 * s)}" y="${r(y + 6.4 * s)}" width="${r(8 * s)}" height="${r(1 * s)}" fill="#8e6420"/>`;
    /* Glasfenster mit Licht */
    glas.forEach((c, i) => { k += `<rect x="${r(x - 3.6 * s + i * 2.4 * s)}" y="${r(y + 7.4 * s)}" width="${r(2.4 * s)}" height="${r(6 * s)}" fill="${c}" opacity=".9"/>`; });
    k += `<rect x="${r(x - 3.6 * s)}" y="${r(y + 7.4 * s)}" width="${r(7.2 * s)}" height="${r(6 * s)}" fill="${S.rg("glut", [[0, "#fff6c8", 0.85], [1, "#fff6c8", 0]])}"/>`;
    for (let i = 0; i <= 3; i++) k += `<rect x="${r(x - 3.8 * s + i * 2.4 * s)}" y="${r(y + 7.4 * s)}" width=".4" height="${r(6 * s)}" fill="#8e6420"/>`;
    k += `<path d="M${r(x - 4 * s)} ${r(y + 13.4 * s)} L${r(x + 4 * s)} ${r(y + 13.4 * s)} L${x} ${r(y + 18 * s)} Z" fill="${MESSING}"/>`;
    k += `<circle cx="${x}" cy="${r(y + 18.6 * s)}" r=".6" fill="#d9a93a"/>`;
    k += `<ellipse cx="${x}" cy="${r(y + 10 * s)}" rx="${r(9 * s)}" ry="${r(7 * s)}" fill="#ffe7a0" opacity=".12"/>`;
  }
  S.teil({ oben: true, id: "laterne", de: "die Laterne", syl: "La-TER-ne", it: "la lanterna", itSyl: "lan-TER-na", en: "lantern", x: 67, y: ST.saum + 2, kunst: k,
    tipp: "Die bunten Laternen heißen „Fanous“. Im Ramadan hängen sie überall." });
}

/* =====================================================================
   12 — DER HÄNDLER (im Stand, in Galabija und Käppchen)
   ===================================================================== */
{
  B.mensch({}, 10);
  const m = B.mensch({ id: "b24a_haendler", geschlecht: "m", alter: "erwachsen", pose: "stehen", blick: -12, frisur: "kurz", haarfarbe: "schwarz", haut: "oliv", laecheln: true, bart: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "#e9e4d6" }, kleid: { stueck: "abendkleid", farbe: "#e9e4d6" }, kopf: { stueck: "muetze", farbe: "#f4f1e8" }, schuhe: { stueck: "sandale", farbe: "braun" } } }, 66);
  S.teil({ id: "haendler", de: "der Händler", syl: "HÄND-ler", it: "il commerciante", itSyl: "com-mer-CIAN-te", en: "trader", x: 95, y: ST.boden - 1, kunst: knapp(m.svg),
    tipp: "Der Händler sagt: „Ahlan wa sahlan!“ – das heißt „Herzlich willkommen!“" });
}

/* =====================================================================
   13 — DIE GALABIJA (am Bügel am rechten Pfosten)
   ===================================================================== */
{
  let k = `<path d="M0 -55 q-1.6 0 -1.6 -1.6 q0 -1.6 1.6 -1.6" stroke="#9aa3aa" stroke-width=".5" fill="none"/><path d="M-7 -52 L0 -55 L7 -52" stroke="#6b4a2c" stroke-width=".9" fill="none"/>`;
  const STOFF = S.lg("galabija", [[0, "#2f6a9a"], [0.5, "#3f80b4"], [1, "#285a84"]], 0, 0, 1, 0);
  k += `<path d="M-7 -52 L-11 -40 L-9 -39 L-6.4 -45 L-7 0 L7 0 L6.4 -45 L9 -39 L11 -40 L7 -52 L2.4 -53 Q0 -50 -2.4 -53 Z" fill="${STOFF}"/>`;
  /* Streifen im Stoff und Stickerei am Halsschlitz */
  for (let x = -5; x <= 5; x += 2.5) k += `<line x1="${x}" y1="-50" x2="${x * 1.08}" y2="-.4" stroke="#bcd3e6" stroke-width=".25" opacity=".6"/>`;
  k += `<path d="M-2.4 -53 Q0 -50 2.4 -53 M0 -50.4 L0 -42" stroke="#e8b93c" stroke-width=".7" fill="none"/>`;
  for (let i = 0; i < 4; i++) k += `<circle cx="${i % 2 ? 0.8 : -0.8}" cy="${-49 + i * 2}" r=".35" fill="#e8b93c"/>`;
  k += `<path d="M-7 -1 Q0 1 7 -1" stroke="#1d4060" stroke-width=".6" fill="none"/>`;
  k += `<path d="M-5.6 -46 L-5.8 -4" stroke="#fff" stroke-width=".8" opacity=".18"/>`;
  S.teil({ id: "galabija", de: "die Galabija", syl: "Ga-la-BI-ja", it: "la galabia", itSyl: "ga-LA-bia", en: "galabeya", x: 118, y: 140, kunst: k,
    tipp: "Die Galabija ist ein langes, weites Gewand. Im heißen Sommer ist sie schön luftig." });
}

/* =====================================================================
   14 — DIE GEWÜRZE (offene Säcke vor dem Stand)
   ===================================================================== */
{
  let k = schatten(0, 0.4, 20, 1.6, 0.3);
  const sack = (x, w, h, farbe, art) => {
    let g = `<path d="M${x - w} 0 Q${x - w - 1} ${-h * 0.5} ${x - w + 0.4} ${-h} Q${x} ${-h - 1.6} ${x + w - 0.4} ${-h} Q${x + w + 1} ${-h * 0.5} ${x + w} 0 Z" fill="${S.lg("jute", [[0, "#c9ad7c"], [0.5, "#b8986a"], [1, "#9a7c50"]], 0, 0, 1, 0)}"/>`;
    for (let i = 0; i < 5; i++) g += `<line x1="${r(x - w + 1 + i * w * 0.45)}" y1="${r(-h + 0.6)}" x2="${r(x - w + 1 + i * w * 0.45)}" y2="-.4" stroke="#8d7048" stroke-width=".25" opacity=".6"/>`;
    /* umgeschlagener Rand */
    g += `<path d="M${x - w + 0.4} ${-h} Q${x} ${-h + 2} ${x + w - 0.4} ${-h} L${x + w} ${-h + 2.4} Q${x} ${-h + 4.4} ${x - w} ${-h + 2.4} Z" fill="#d8bf90"/>`;
    /* Kegel aus Gewürz */
    g += `<path d="M${x - w + 0.8} ${-h + 0.4} Q${x - 1} ${-h - w * 0.9} ${x} ${-h - w * 0.95} Q${x + 1} ${-h - w * 0.9} ${x + w - 0.8} ${-h + 0.4} Z" fill="${farbe}"/>`;
    if (art === "blueten") for (let i = 0; i < 16; i++) g += `<circle cx="${r(x - w * 0.7 + rnd() * w * 1.4)}" cy="${r(-h - rnd() * w * 0.7)}" r=".55" fill="${rnd() < 0.5 ? "#5e0f1e" : "#8a1a2c"}"/>`;
    else for (let i = 0; i < 12; i++) g += `<circle cx="${r(x - w * 0.6 + rnd() * w * 1.2)}" cy="${r(-h - rnd() * w * 0.6)}" r=".22" fill="#fff" opacity=".35"/>`;
    g += `<path d="M${x - 1.6} ${r(-h - w * 0.7)} Q${x} ${r(-h - w * 0.95)} ${x + 1} ${r(-h - w * 0.8)}" stroke="#fff" stroke-width=".5" opacity=".35" fill="none"/>`;
    return g;
  };
  k += sack(-12, 7, 9, S.lg("kurkuma", [[0, "#f2c02a"], [1, "#c98d10"]]), "pulver");
  k += sack(1, 7, 10, S.lg("paprika", [[0, "#e0502a"], [1, "#a82a14"]]), "pulver");
  k += sack(14, 6.6, 8.6, "#6e1424", "blueten");
  /* Holzschaufel im Paprika */
  k += `<path d="M3 -18 L8 -22" stroke="#8a5a32" stroke-width=".8"/><ellipse cx="2.2" cy="-17.4" rx="1.6" ry="1" fill="#a06d40"/>`;
  S.teil({ id: "gewuerze", de: "die Gewürze", syl: "ge-WÜR-ze", it: "le spezie", itSyl: "SPE-zie", en: "spices", x: 136, y: 190, steht: true, kunst: k,
    tipp: "Gelb ist Kurkuma, rot ist Paprika. Die dunklen Blüten sind Hibiskus für den Tee „Karkadeh“." });
}

/* =====================================================================
   15 — DER STUHL und 16 — DER TISCH (Teehaus-Tisch mit Messingplatte)
   ===================================================================== */
const TISCH = { x: 186, boden: 192, platte: 162 };
{
  /* Kaffeehausstuhl aus Holz mit geflochtener Sitzfläche (Blick schräg) */
  const sitz = -19;
  let k = schatten(0, 0.4, 9, 1.2, 0.3);
  k += `<rect x="-7" y="${sitz}" width="1.4" height="${-sitz}" fill="#6b4422"/><rect x="5.6" y="${sitz}" width="1.4" height="${-sitz}" fill="#6b4422"/>`;
  k += `<rect x="-5" y="${sitz - 2}" width="1.1" height="${-sitz + 0.6}" fill="#5a381c"/><rect x="4.4" y="${sitz - 2}" width="1.1" height="${-sitz + 0.6}" fill="#5a381c"/>`;
  k += `<rect x="-7" y="-7" width="14" height=".9" fill="#6b4422"/>`;
  /* Lehne */
  k += `<rect x="-5" y="${sitz - 22}" width="1.3" height="22" fill="#6b4422"/><rect x="4.2" y="${sitz - 22}" width="1.3" height="22" fill="#6b4422"/>`;
  for (const y of [sitz - 21, sitz - 15, sitz - 9]) k += `<rect x="-5" y="${y}" width="10.5" height="1.6" rx=".4" fill="${HOLZ}"/>`;
  /* Sitzfläche (Geflecht) */
  k += `<path d="M-7.6 ${sitz} L7.6 ${sitz} L6 ${sitz - 3} L-6 ${sitz - 3} Z" fill="${S.lg("geflecht", [[0, "#d9b875"], [1, "#b88f48"]])}"/>`;
  for (let i = 0; i < 7; i++) k += `<line x1="${r(-6.6 + i * 2.1)}" y1="${sitz - 2.8}" x2="${r(-7.2 + i * 2.4)}" y2="${sitz - 0.2}" stroke="#9a7434" stroke-width=".25"/>`;
  k += `<rect x="-7.8" y="${sitz}" width="15.6" height="1.2" fill="#5a381c"/>`;
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: 164, y: TISCH.boden - 1, steht: true, kunst: k });
}
{
  /* Messingplatte „Sinia“ auf Holzgestell */
  const h = TISCH.platte - TISCH.boden;
  let k = schatten(0, 0.4, 14, 1.6, 0.3);
  k += `<path d="M-2 ${h + 2} L-9 -1 M2 ${h + 2} L9 -1 M0 ${h + 2} L0 -.5" stroke="#5a381c" stroke-width="1.4"/>`;
  k += `<path d="M-6 ${h * 0.45} L6 ${h * 0.45}" stroke="#5a381c" stroke-width=".9"/>`;
  k += `<ellipse cx="0" cy="${h + 1.4}" rx="15" ry="3.6" fill="#8e6420"/>`;
  k += `<ellipse cx="0" cy="${h}" rx="15" ry="3.6" fill="${S.rg("sinia", [[0, "#f6dc92"], [0.7, "#d1a347"], [1, "#a07526"]], 0.4, 0.4, 0.7)}"/>`;
  k += `<ellipse cx="0" cy="${h}" rx="11.4" ry="2.6" fill="none" stroke="#9c7428" stroke-width=".35"/><ellipse cx="0" cy="${h}" rx="7" ry="1.6" fill="none" stroke="#9c7428" stroke-width=".3" stroke-dasharray=".8 .6"/>`;
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: TISCH.x, y: TISCH.boden, steht: true, kunst: k });
}
{
  /* DIE TEEKANNE — Emaille-Kanne */
  let k = `<path d="M-3 0 Q-4.2 -3 -2.6 -5.6 L2.6 -5.6 Q4.2 -3 3 0 Z" fill="${S.lg("kanne", [[0, "#e9eef0"], [0.6, "#b9c6cc"], [1, "#8e9ca3"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-2 -5.6 Q0 -7.4 2 -5.6" fill="#a7b4ba"/><circle cx="0" cy="-7.1" r=".6" fill="#7d8a90"/>`;
  k += `<path d="M3 -2 Q6 -3.4 6.6 -6" stroke="#a7b4ba" stroke-width=".9" fill="none"/><path d="M-3.2 -4.6 Q-5.6 -3.4 -3.4 -1.2" stroke="#7d8a90" stroke-width=".7" fill="none"/>`;
  k += `<path d="M-2.4 -2.6 Q0 -1.6 2.4 -2.6" stroke="#2f6fb0" stroke-width=".6" fill="none"/><ellipse cx="-1.4" cy="-3.6" rx=".5" ry="1" fill="#fff" opacity=".6"/>`;
  S.teil({ oben: true, id: "teekanne", de: "die Teekanne", syl: "TEE-kan-ne", it: "la teiera", itSyl: "te-IE-ra", en: "teapot", x: TISCH.x - 8, y: TISCH.platte + 0.4, steht: true, kunst: k + flaeche(-4.6, -8, 11.6, 8.4) });
}
{
  /* DER TEE — zwei kleine Gläser mit dunkelrotem Tee, Minze */
  let k = "";
  for (const [x, s] of [[0, 1], [4.2, 0.85]]) {
    k += `<ellipse cx="${x}" cy="0" rx="${r(2.4 * s)}" ry=".6" fill="#e6e3dc"/>`;
    k += `<path d="M${r(x - 1.5 * s)} ${r(-5.6 * s)} L${r(x + 1.5 * s)} ${r(-5.6 * s)} L${r(x + 1.1 * s)} -.4 L${r(x - 1.1 * s)} -.4 Z" fill="#e9f3f5" opacity=".55"/>`;
    k += `<path d="M${r(x - 1.4 * s)} ${r(-4.4 * s)} L${r(x + 1.4 * s)} ${r(-4.4 * s)} L${r(x + 1.1 * s)} -.5 L${r(x - 1.1 * s)} -.5 Z" fill="${S.lg("tee", [[0, "#b8461c"], [1, "#6a1e0a"]])}"/>`;
    k += `<path d="M${r(x - 1.2 * s)} ${r(-5.2 * s)} L${r(x - 1)} -.8" stroke="#fff" stroke-width=".3" opacity=".7"/>`;
  }
  k += `<path d="M-.6 -6.6 l1.6 -1.6 M.4 -6.6 l-1 -1.2" stroke="#3f8a3a" stroke-width=".6"/>`;
  k += `<path d="M-.2 -7 q-1 -1.6 0 -3 q1 -1.4 0 -2.6" stroke="#fff" stroke-width=".4" opacity=".5" fill="none"/>`;
  S.teil({ oben: true, id: "tee", de: "der Tee", syl: "TEE", it: "il tè", itSyl: "TÈ", en: "tea", x: TISCH.x + 1, y: TISCH.platte + 0.6, steht: true, kunst: k + flaeche(-3, -7.5, 9, 8),
    tipp: "In Ägypten trinkt man schwarzen Tee mit viel Zucker aus kleinen Gläsern." });
}
{
  /* DAS FLADENBROT — Aish Baladi, rund und aufgegangen, auf dem Teller */
  let k = `<ellipse cx="0" cy="-.2" rx="5.4" ry="1.2" fill="#f1ede4"/>`;
  for (let i = 0; i < 3; i++) {
    const y = -0.8 - i * 1.3;
    k += `<ellipse cx="${r(i * 0.3)}" cy="${r(y)}" rx="4.6" ry="1.5" fill="${S.rg("aish", [[0, "#d9a462"], [0.7, "#b77a3c"], [1, "#8a5526"]], 0.4, 0.3, 0.8)}"/>`;
    for (let j = 0; j < 5; j++) k += `<circle cx="${r(-3 + rnd() * 6)}" cy="${r(y - 0.4 + rnd() * 0.8)}" r=".22" fill="#f1dfb8" opacity=".8"/>`;
  }
  k += `<path d="M-2.6 -4.4 q2.4 -.8 4.6 0" stroke="#f3dcaa" stroke-width=".4" fill="none" opacity=".7"/>`;
  S.teil({ oben: true, id: "fladenbrot", de: "das Fladenbrot", syl: "FLA-den-brot", it: "il pane arabo", itSyl: "PA-ne A-ra-bo", en: "flatbread", x: TISCH.x + 10, y: TISCH.platte + 1, steht: true, kunst: k + flaeche(-5.4, -6, 10.8, 6.6),
    tipp: "Das runde Fladenbrot heißt „Aish“ – das bedeutet auch „Leben“." });
}

/* =====================================================================
   17 — DAS KAMEL (liegend, mit Sattel, wartet auf Gäste)
   ===================================================================== */
{
  const X = 254, Y = 189;
  let k = schatten(2, 0.4, 38, 2.6, 0.32);
  const FELL = S.lg("fell", [[0, "#d8b07a"], [0.55, "#c19460"], [1, "#9a7040"]]);
  /* gefaltete Hinterbeine links, Vorderbeine rechts (Knie vorn) */
  k += `<path d="M-30 0 Q-34 -6 -28 -9 L-18 -8 Q-14 -4 -16 0 Z" fill="#b08550"/>`;
  k += `<path d="M10 0 Q8 -5 13 -7 L24 -6 Q28 -3 26 0 Z" fill="#b08550"/><ellipse cx="25" cy="-2" rx="2.4" ry="1.8" fill="#8f6838"/>`;
  /* Rumpf mit Höcker */
  k += `<path d="M-32 -6 Q-34 -18 -24 -24 Q-14 -40 -2 -38 Q10 -36 16 -24 Q22 -16 20 -6 Q0 -1 -32 -6 Z" fill="${FELL}"/>`;
  /* Hals: steigt von der Brust in einem Bogen nach vorn oben */
  k += `<path d="M14 -22 Q22 -23 27 -32 Q31 -40 37 -43 L42 -42 Q41 -38 38 -36 Q34 -32 32 -26 Q28 -15 20 -8 Z" fill="${FELL}"/>`;
  k += `<path d="M16 -21 Q23 -23 28 -32" stroke="#e2c08e" stroke-width=".6" opacity=".6" fill="none"/>`;
  /* Kopf: lang, Stirn gewölbt, Oberlippe hängt über */
  k += `<path d="M35.4 -44 Q37 -48.4 42 -48 Q47 -47.4 51.4 -44.6 Q53.6 -43 53 -41 Q52.2 -39.4 50 -39.6 L47.6 -38.6 Q44 -37.6 41 -38.4 Q37 -39.4 35.4 -44 Z" fill="${S.lg("kopf", [[0, "#d6ad78"], [1, "#a67b48"]])}"/>`;
  k += `<path d="M49 -39.4 Q50.6 -38.2 52.4 -39.6" stroke="#7a5432" stroke-width=".4" fill="none"/><path d="M51.6 -42.6 l.9 -.2" stroke="#3a2a18" stroke-width=".45"/>`;
  /* Auge mit schwerem Lid und langen Wimpern, kleines rundes Ohr */
  k += `<ellipse cx="41.2" cy="-45" rx=".9" ry=".55" fill="#1d140c"/><path d="M40 -45.6 q1.2 -.9 2.4 0" stroke="#7a5432" stroke-width=".45" fill="none"/>`;
  k += `<ellipse cx="37.4" cy="-46.6" rx="1" ry="1.4" fill="#a67b48" transform="rotate(-30 37.4 -46.6)"/>`;
  /* Zaumzeug mit bunten Bommeln */
  k += `<path d="M38.6 -47.4 Q40 -42 41.6 -38.6 M39.6 -42.8 Q45 -41.6 51 -42.6" stroke="#b2322a" stroke-width=".7" fill="none"/>`;
  for (const [x, y, c] of [[40.6, -40.6, "#e8b93c"], [44.6, -41.6, "#2f7a4a"], [48.4, -41.8, "#1f5a8a"]]) k += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 1.6}" stroke="${c}" stroke-width=".35"/><circle cx="${x}" cy="${y + 2.2}" r=".9" fill="${c}"/>`;
  /* Satteldecke (Khayamiya) und Holzsattel mit Knauf */
  k += `<path d="M-20 -30 Q-6 -36 10 -30 L12 -16 Q-4 -12 -22 -16 Z" fill="${KH}"/>`;
  k += `<path d="M-20 -30 Q-6 -36 10 -30 L12 -16 Q-4 -12 -22 -16 Z" fill="${S.lg("deckeschatten", [[0, "#fff", 0.1], [1, "#000", 0.25]])}"/>`;
  for (let x = -21; x < 12; x += 3) k += `<line x1="${x}" y1="${r(-16 + (x + 21) * 0.02)}" x2="${x}" y2="${r(-12.6)}" stroke="#e8b93c" stroke-width=".6"/>`;
  k += `<path d="M-14 -34 Q-5 -40 6 -34 L4 -31 Q-5 -35 -12 -31 Z" fill="${HOLZ_D}"/>`;
  k += `<rect x="-16" y="-41" width="2.2" height="8" rx="1" fill="${MESSING}"/><rect x="5" y="-40" width="2.2" height="7" rx="1" fill="${MESSING}"/>`;
  k += `<path d="M-30 -14 Q-28 -24 -18 -28" stroke="#e9c48c" stroke-width=".8" opacity=".55" fill="none"/>`;
  S.teil({ id: "kamel", de: "das Kamel", syl: "Ka-MEL", it: "il cammello", itSyl: "cam-MEL-lo", en: "camel", x: X, y: Y, steht: true, kunst: k,
    tipp: "Kamele können viele Tage ohne Wasser laufen. Im Höcker speichern sie Fett." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/aegypten.js"));
console.log(aus);
