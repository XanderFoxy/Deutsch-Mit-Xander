#!/usr/bin/env node
/* =====================================================================
   WETTER & JAHRESZEITEN (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (DWD-Wetterlexikon „Regenbogen“, „Schauer und Gewitter“,
   „Talnebel“; Alpen-Wetter im Sommer):
   - Ein REGENBOGEN steht immer GEGENÜBER der Sonne: Die Sonne scheint
     von hinten auf eine Regenwand, der Bogen hat 42° Halbmesser um den
     Gegenpunkt der Sonne. Darum: Sonne im Westfenster, Regenbogen im
     Ostfenster — rot außen, violett innen.
   - Sommerliche Schauer- und GEWITTERZELLEN ziehen mit dem Westwind
     nach Osten; hinter der Regenwand reißt es auf.
   - Nach dem Schauer steigen über dem nassen Wald NEBELschwaden auf.
   - In den Alpen liegt auch im Sommer SCHNEE auf den Gipfeln, darunter
     das EIS der Gletscher.
   - Im Haus: das FENSTERTHERMOMETER außen am Rahmen, eine
     Funk-WETTERSTATION auf der Fensterbank, das BAROMETER mit den
     Feldern „Regen – Veränderlich – Schön“, an der Garderobe
     Regenjacke, Regenschirm im Schirmständer, Gummistiefel.
   - Die vier JAHRESZEITEN als Bild: derselbe Apfelbaum im Frühling
     (Blüte), Sommer (grün, Korn), Herbst (bunt, Äpfel), Winter (Schnee).
   ORT: Eckzimmer eines Hauses am Hang im Allgäu, Blick nach Osten über
   das Tal, links ein Westfenster. Augenhöhe y = 67 (Fluchtpunkt 162/67).
   Maßstab: Rückwand ≈ 44 Einheiten je Meter (Fensterbank 0,9 m).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "wetter", titel: "Wetter & Jahreszeiten", emoji: "🌦️", thema: "Natur", kuerzel: "b20c", fassung: 852 });
const rnd = zufall(4242);
const r = B.r;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const VP = [162, 67];
const WX = 70, DECKE = 12, BODEN = 160;            // Rückwand: x ab 70, Decke y 12, Boden y 160
/* Linke Wand: Punkt bei x und Anteil f (0 = Decke, 1 = Boden) */
const lw = (x, f) => { const t = -29.8 + 0.598 * x, b = 230.7 - 1.01 * x; return [r(x), r(t + f * (b - t))]; };
const FE = { x0: 92, x1: 232, y0: 30, y1: 118 };   // Ostfenster (Lichtmaß)
const LF = [lw(14, 0.2), lw(54, 0.2), lw(54, 0.56), lw(14, 0.56)];   // Westfenster
const poly = (pts) => "M" + pts.map((p) => p.join(" ")).join(" L") + " Z";

/* ---------- Stoffe ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("w1")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.2"/></filter>`);
S.def(`<filter id="${S.id("w2")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
S.def(`<clipPath id="${S.id("ost")}"><rect x="${FE.x0}" y="${FE.y0}" width="${FE.x1 - FE.x0}" height="${FE.y1 - FE.y0}"/></clipPath>`);
S.def(`<clipPath id="${S.id("west")}"><path d="${poly(LF)}"/></clipPath>`);
const OST = (svg) => `<g clip-path="url(#${S.id("ost")})">${svg}</g>`;
const WEST = (svg) => `<g clip-path="url(#${S.id("west")})">${svg}</g>`;
const ZIRBE = S.lg("zirbe", [[0, "#d9b98c"], [0.5, "#cfaa78"], [1, "#c19a68"]], 0, 0, 1, 0);
const ZIRBE_D = S.lg("zirbed", [[0, "#b98c5a"], [1, "#9a7046"]]);
const WEISS = S.lg("rahmen", [[0, "#ffffff"], [1, "#e4e2dc"]]);

/* =====================================================================
   KULISSE — Zimmer: Decke, Zirbenholzwände, Dielenboden, Heizkörper
   ===================================================================== */
{
  let k = `<rect width="320" height="200" fill="#e9dcc6"/>`;
  /* Decke (Holz) */
  k += `<path d="M0 0 L320 0 L320 ${DECKE} L${WX} ${DECKE} L0 -30 Z" fill="${S.lg("decke", [[0, "#b48a5c"], [1, "#c9a274"]])}"/>`;
  for (let i = 0; i < 9; i++) { const x = WX + 6 + i * 30; k += `<line x1="${r(x)}" y1="${DECKE}" x2="${r(VP[0] + (x - VP[0]) * 2.6)}" y2="0" stroke="#9c744a" stroke-width=".5"/>`; }
  /* Rückwand: senkrechte Zirbenbretter */
  k += `<rect x="${WX}" y="${DECKE}" width="${320 - WX}" height="${BODEN - DECKE}" fill="${ZIRBE}"/>`;
  for (let x = WX + 9; x < 320; x += 9) k += `<rect x="${x}" y="${DECKE}" width=".6" height="${BODEN - DECKE}" fill="#a77d50" opacity=".6"/>`;
  for (let i = 0; i < 46; i++) { const x = WX + rnd() * 250, y = DECKE + rnd() * 140; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.6 + rnd() * 0.8)}" ry="${r(0.4 + rnd() * 0.5)}" fill="#8f6236" opacity=".45"/>`; }
  k += `<rect x="${WX}" y="${DECKE}" width="${320 - WX}" height="2.4" fill="#a57a4c"/><rect x="${WX}" y="${BODEN - 5}" width="${320 - WX}" height="5" fill="${ZIRBE_D}"/>`;
  /* linke Wand in der Flucht, etwas dunkler */
  k += `<path d="M0 -30 L${WX} ${DECKE} L${WX} ${BODEN} L0 231 Z" fill="${S.lg("lwand", [[0, "#b8915f"], [1, "#caa676"]], 0, 0, 1, 0)}"/>`;
  for (let x = 6; x < WX; x += 7) { const a = lw(x, 0), b = lw(x, 1); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#9c744a" stroke-width=".5" opacity=".6"/>`; }
  k += `<path d="M${lw(0, 0.965).join(" ")} L${WX} ${BODEN - 5} L${WX} ${BODEN} L${lw(0, 1).join(" ")} Z" fill="${ZIRBE_D}"/>`;
  /* Dielenboden in der Flucht */
  k += `<path d="M0 231 L${WX} ${BODEN} L320 ${BODEN} L320 200 L0 200 Z" fill="${S.lg("boden", [[0, "#8c5e36"], [1, "#a8743f"]])}"/>`;
  for (let i = -8; i <= 14; i++) { const x0 = WX + i * 18; const x1 = VP[0] + (x0 - VP[0]) * (200 - VP[1]) / (BODEN - VP[1]); k += `<line x1="${r(x0)}" y1="${BODEN}" x2="${r(x1)}" y2="200" stroke="#6e4524" stroke-width=".45"/>`; }
  k += `<path d="M0 231 L${WX} ${BODEN} L320 ${BODEN} L320 200 L0 200 Z" fill="${S.lg("bodenlicht", [[0, "#000", 0.12], [1, "#fff", 0.06]])}"/>`;
  /* Fensterlaibungen (Mauerdicke): Ostfenster */
  const d = 6;
  k += `<path d="M${FE.x0 - d} ${FE.y0 - d} L${FE.x1 + d} ${FE.y0 - d} L${FE.x1} ${FE.y0} L${FE.x0} ${FE.y0} Z" fill="#f2ede4"/>`;
  k += `<path d="M${FE.x0 - d} ${FE.y0 - d} L${FE.x0} ${FE.y0} L${FE.x0} ${FE.y1} L${FE.x0 - d} ${FE.y1 + 4} Z" fill="#e6dfd2"/>`;
  k += `<path d="M${FE.x1 + d} ${FE.y0 - d} L${FE.x1} ${FE.y0} L${FE.x1} ${FE.y1} L${FE.x1 + d} ${FE.y1 + 4} Z" fill="#ddd5c6"/>`;
  /* Heizkörper unter dem Fenster */
  k += `<rect x="${FE.x0 + 10}" y="134" width="${FE.x1 - FE.x0 - 20}" height="18" rx="1.2" fill="${S.lg("heiz", [[0, "#ffffff"], [1, "#dcdad4"]])}"/>`;
  for (let x = FE.x0 + 13; x < FE.x1 - 12; x += 3.2) k += `<rect x="${r(x)}" y="135.4" width="1.6" height="15.2" rx=".7" fill="#ecebe6" stroke="#cfccc4" stroke-width=".2"/>`;
  k += `<rect x="${FE.x1 - 14}" y="131" width="3" height="4" rx=".6" fill="#f4f4f2" stroke="#bbb" stroke-width=".2"/>`;
  k += `<ellipse cx="${(FE.x0 + FE.x1) / 2}" cy="${BODEN + 1}" rx="64" ry="2" fill="#000" opacity=".15" filter="url(#bw_weich)"/>`;
  /* Westfenster: Laibung in der Flucht */
  k += `<path d="M${LF[0].join(" ")} L${LF[1].join(" ")} L${LF[2].join(" ")} L${LF[3].join(" ")} Z" fill="#eee8dd"/>`;
  /* Lichtfleck der Abendsonne auf dem Boden (durch das Westfenster) */
  k += `<path d="M150 178 L218 170 L246 196 L170 200 Z" fill="#ffd98a" opacity=".22"/>`;
  S.hinten(k);
}

/* =====================================================================
   DRAUSSEN IM OSTFENSTER: Himmel und Tal (Kulisse innerhalb des Fensters)
   ===================================================================== */
{
  let k = `<rect x="${FE.x0}" y="${FE.y0}" width="${FE.x1 - FE.x0}" height="${FE.y1 - FE.y0}" fill="${S.lg("osthimmel", [[0, "#8fb8de"], [0.45, "#7b8fa3"], [1, "#4b5563"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${FE.x0}" y="${FE.y0}" width="${FE.x1 - FE.x0}" height="40" fill="${S.lg("himmelh", [[0, "#fff", 0], [1, "#d9e6f2", 0.4]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE WOLKE (Schönwetterwolke, links im Ostfenster)
   ===================================================================== */
{
  const x = 118, y = 46;
  let k = `<g filter="url(#${S.id("w1")})">`;
  k += `<ellipse cx="${x}" cy="${y}" rx="20" ry="3" fill="#dfe6ee"/>`;
  for (const [dx, dy, rr] of [[-12, -3, 6], [-4, -7, 8], [6, -6, 7], [14, -2, 5], [0, -2, 7]]) k += `<circle cx="${x + dx}" cy="${y + dy}" r="${rr}" fill="#ffffff"/>`;
  k += `<ellipse cx="${x + 2}" cy="${y + 0.5}" rx="18" ry="2" fill="#c9d3de" opacity=".8"/></g>`;
  S.teil({ id: "wolke", de: "die Wolke", syl: "WOL-ke", it: "la nuvola", itSyl: "NU-vo-la", en: "cloud", x, y: y + 3, kunst: um(x, y + 3, OST(k)),
    tipp: "Eine Schönwetterwolke: weiß, rund und flach unten." });
}

/* =====================================================================
   2 — DER BERG, 3 — DAS EIS (Gletscher), 4 — DER SCHNEE (Gipfel)
   ===================================================================== */
const GRAT = [[92, 70], [104, 60], [116, 64], [130, 52], [140, 57], [152, 46], [162, 54], [176, 49], [190, 58], [204, 50], [218, 59], [232, 55]];
{
  let k = `<path d="M${GRAT.map((p) => p.join(" ")).join(" L")} L232 84 L92 84 Z" fill="${S.lg("fels", [[0, "#7e8794"], [0.6, "#68707c"], [1, "#56606a"]])}"/>`;
  /* Felsrippen und Licht von Westen */
  for (let i = 1; i < GRAT.length - 1; i++) { const [px, py] = GRAT[i]; k += `<path d="M${px} ${py} L${px - 5} ${py + 14} L${px - 2} ${py + 22}" stroke="#9aa3ae" stroke-width=".6" fill="none" opacity=".8"/><path d="M${px} ${py} L${px + 4} ${py + 12}" stroke="#4a525c" stroke-width=".6" fill="none" opacity=".7"/>`; }
  /* bewaldete Hänge unten */
  k += `<path d="M92 78 Q130 70 160 76 T232 74 L232 86 L92 86 Z" fill="#3f5a3a"/>`;
  S.teil({ id: "berg", de: "der Berg", syl: "BERG", it: "la montagna", itSyl: "mon-TA-gna", en: "mountain", x: 162, y: 84, kunst: um(162, 84, OST(k)) });
}
{
  /* Gletscherzunge zwischen den Gipfeln */
  const x = 141, y = 70;
  let k = `<path d="M131 57.4 Q136 60 140 58.6 Q145 56 150.6 50.4 L151.6 54 Q148 59 146 63 Q143.6 67.6 141.4 70.6 Q140 72 139 70 Q137.6 66 134.6 62 Q132.4 59.6 131 57.4 Z" fill="${S.lg("gletscher", [[0, "#f6fbff"], [0.55, "#d6ebf6"], [1, "#a9d0e6"]])}"/>`;
  for (let i = 0; i < 5; i++) k += `<path d="M${136 + i * 1.4} ${60 + i * 2} q1.6 .8 3.2 0" stroke="#86b6d2" stroke-width=".35" fill="none"/>`;
  k += `<path d="M140 71 q1 3 .4 6" stroke="#cfe7f4" stroke-width=".5" fill="none" opacity=".8"/>`;
  S.teil({ id: "eis", de: "das Eis", syl: "EIS", it: "il ghiaccio", itSyl: "GHIAC-cio", en: "ice", x, y: y + 2, kunst: um(x, y + 2, OST(k)),
    tipp: "Ein Gletscher ist ein Strom aus Eis. Er bleibt auch im Sommer." });
}
{
  /* Schneekappen auf den Gipfeln */
  let k = "";
  for (const i of [1, 3, 5, 7, 9, 11]) {
    const [px, py] = GRAT[i], [ax, ay] = GRAT[i - 1], [bx, by] = GRAT[Math.min(i + 1, GRAT.length - 1)];
    const t = 0.42;
    k += `<path d="M${px} ${py} L${r(px + (bx - px) * t)} ${r(py + (by - py) * t)} L${r(px + (bx - px) * t * 0.6)} ${r(py + (by - py) * t + 2.6)} L${r(px + 0.4)} ${r(py + 4.6)} L${r(px + (ax - px) * t * 0.5)} ${r(py + (ay - py) * t + 3.4)} L${r(px + (ax - px) * t)} ${r(py + (ay - py) * t)} Z" fill="${S.lg("schnee", [[0, "#ffffff"], [1, "#dde7f0"]])}"/>`;
  }
  S.teil({ id: "schnee", de: "der Schnee", syl: "SCHNEE", it: "la neve", itSyl: "NE-ve", en: "snow", x: 162, y: 60, kunst: um(162, 60, OST(k)),
    tipp: "Ganz oben auf den Bergen liegt auch im Sommer Schnee." });
}

/* =====================================================================
   5 — DER REGEN (Schauerwolke mit Regenwand) und 6 — DER BLITZ
   ===================================================================== */
{
  const x = 190, y = 50;
  let k = `<g filter="url(#${S.id("w1")})">`;
  k += `<path d="M138 46 Q140 34 152 34 Q158 24 172 28 Q182 20 196 26 Q210 22 222 30 Q234 30 236 40 L236 52 Q200 56 170 52 Q150 54 138 46 Z" fill="${S.lg("schauer", [[0, "#6f7c8b"], [0.6, "#4f5a68"], [1, "#3a434f"]])}"/>`;
  k += `<path d="M150 40 Q170 36 190 42" stroke="#8d99a7" stroke-width="2" fill="none" opacity=".6"/></g>`;
  /* Regenwand: schräge Schleier bis ins Tal */
  k += `<path d="M168 50 L238 52 L238 100 L160 100 Z" fill="${S.lg("regenwand", [[0, "#56616e", 0.5], [1, "#6e7a86", 0.12]])}"/>`;
  let st = "";
  for (let i = 0; i < 90; i++) { const sx = 166 + rnd() * 72, sy = 52 + rnd() * 40; st += `<line x1="${r(sx)}" y1="${r(sy)}" x2="${r(sx - 1.2)}" y2="${r(sy + 4.4)}" stroke="#c9d4de" stroke-width=".25" opacity=".7"/>`; }
  k += st;
  S.teil({ id: "regen", de: "der Regen", syl: "RE-gen", it: "la pioggia", itSyl: "PIOG-gia", en: "rain", x, y, kunst: um(x, y, OST(k)),
    tipp: "Unter der dunklen Wolke regnet es — der Schauer zieht nach Osten." });
}
{
  const x = 204, y = 78;
  const bahn = "M208 50 L204 58 L207 59 L201 68 L204 69 L198 78";
  let k = `<path d="${bahn}" stroke="#dbe9ff" stroke-width="3.4" fill="none" opacity=".35" filter="url(#${S.id("w1")})"/>`;
  k += `<path d="${bahn}" stroke="#ffffff" stroke-width=".9" fill="none" stroke-linejoin="bevel"/>`;
  k += `<path d="M204 58 L208 62 M201 68 L197 71" stroke="#f2f7ff" stroke-width=".45" fill="none"/>`;
  S.teil({ oben: true, id: "blitz", de: "der Blitz", syl: "BLITZ", it: "il fulmine", itSyl: "FUL-mi-ne", en: "lightning", x, y, kunst: um(x, y, OST(k)),
    tipp: "Zähl nach dem Blitz die Sekunden bis zum Donner: drei Sekunden sind etwa ein Kilometer." });
}

/* =====================================================================
   7 — DER REGENBOGEN (gegenüber der Sonne)
   ===================================================================== */
{
  const cx = 172, cy = 136, R0 = 92;
  const farben = ["#e8463a", "#f39a2b", "#f5e14a", "#5cbf4a", "#3a7fd0", "#5a4bb0", "#8a4fb6"];
  let k = "";
  farben.forEach((f, i) => {
    const R = R0 - i * 1.35;
    k += `<path d="M${r(cx - R)} ${cy} A${R} ${R} 0 0 1 ${r(cx + R)} ${cy}" stroke="${f}" stroke-width="1.45" fill="none"/>`;
  });
  /* links verblasst er, weil dort kein Regen fällt */
  S.def(`<linearGradient id="${S.id("bogenmaske")}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".25"/><stop offset=".45" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity=".8"/></linearGradient>`);
  S.def(`<mask id="${S.id("bogen")}"><rect x="${FE.x0}" y="${FE.y0}" width="${FE.x1 - FE.x0}" height="${92 - FE.y0}" fill="url(#${S.id("bogenmaske")})"/></mask>`);
  S.teil({ id: "regenbogen", de: "der Regenbogen", syl: "RE-gen-bo-gen", it: "l'arcobaleno", itSyl: "ar-co-ba-LE-no", en: "rainbow", x: 200, y: 92,
    kunst: um(200, 92, OST(`<g mask="url(#${S.id("bogen")})" opacity=".75">${k}</g>`)) + flaeche(-36, -46, 34, 8) + flaeche(-18, -50, 52, 8),
    tipp: "Einen Regenbogen sieht man nur mit der Sonne im Rücken: Sie scheint auf den Regen." });
}

/* =====================================================================
   TAL: Wiesen, Wald, Dorf — 8 — DER NEBEL, 9 — DER WETTERHAHN (auf der Kirche)
   ===================================================================== */
{
  let k = `<path d="M92 84 Q140 80 180 86 T232 84 L232 118 L92 118 Z" fill="${S.lg("tal", [[0, "#6f9a4e"], [1, "#8fb35a"]])}"/>`;
  k += `<path d="M180 86 Q206 82 232 84 L232 104 Q200 98 176 100 Z" fill="#5c7d43" opacity=".55"/>`;
  /* Waldstück links, Hecken, Feldwege */
  for (let i = 0; i < 26; i++) { const x = 94 + rnd() * 46, y = 88 + rnd() * 10; k += `<path d="M${r(x - 2)} ${r(y)} L${r(x)} ${r(y - 5)} L${r(x + 2)} ${r(y)} Z" fill="${rnd() < 0.5 ? "#2f4b2f" : "#3b5a36"}"/>`; }
  k += `<path d="M150 118 Q160 104 196 96" stroke="#c9b98a" stroke-width="1.2" fill="none"/><path d="M100 110 Q140 104 232 108" stroke="#5f8a40" stroke-width=".6" fill="none"/>`;
  /* Bauernhöfe */
  for (const [x, y, w] of [[176, 104, 8], [202, 100, 6], [214, 108, 9]]) k += `<rect x="${x}" y="${y - 3}" width="${w}" height="3" fill="#efe8da"/><path d="M${x - 0.6} ${y - 3} L${x + w / 2} ${y - 5.4} L${x + w + 0.6} ${y - 3} Z" fill="#8a4a32"/>`;
  /* Kirche mit Zwiebelturm (Allgäu) */
  k += `<rect x="122" y="100" width="14" height="6" fill="#f3efe6"/><path d="M121 100 L129 96 L137 100 Z" fill="#8a4a32"/>`;
  k += `<rect x="118" y="88" width="4.4" height="18" fill="#f3efe6"/><path d="M117.6 88 Q117 84.6 120.2 83.4 Q123.4 84.6 122.8 88 Z" fill="#5f7d64"/><rect x="119.9" y="80.6" width=".6" height="3" fill="#5f7d64"/>`;
  S.hinten(OST(k));
}
{
  /* Nebelschwaden über dem nassen Wald */
  const x = 114, y = 96;
  let k = `<g filter="url(#${S.id("w2")})" opacity=".85">`;
  k += `<ellipse cx="108" cy="93" rx="16" ry="2.6" fill="#f2f5f7"/><ellipse cx="122" cy="90" rx="12" ry="2" fill="#eef2f5"/><ellipse cx="102" cy="88" rx="8" ry="1.8" fill="#f4f6f8"/><ellipse cx="132" cy="95" rx="9" ry="2" fill="#e8edf0"/>`;
  k += `</g>`;
  S.teil({ id: "nebel", de: "der Nebel", syl: "NE-bel", it: "la nebbia", itSyl: "NEB-bia", en: "fog", x, y, kunst: um(x, y, OST(k)) + flaeche(-20, -10, 40, 12),
    tipp: "Nach dem Regen dampft der Wald: Es steigen Nebelschwaden auf." });
}
{
  /* Wetterhahn auf der Turmspitze: dreht sich mit dem Wind */
  /* auf dem First des Nachbarstadels direkt unter dem Fenster; der Hahn
     dreht den Kopf in den Wind: Westwind, also schaut er nach links */
  const x = 134, y = 101;
  let st = `<path d="M92 118 L92 105 L176 105 L190 118 Z" fill="${S.lg("stadel", [[0, "#9a4e34"], [1, "#7a3a24"]])}"/>`;
  for (let i = 0; i < 6; i++) { const yy = 106.6 + i * 2.2; let d = `M92 ${r(yy)}`; for (let xx = 92; xx < 176 + (yy - 105) * 1.07; xx += 2.2) d += ` q1.1 .9 2.2 0`; st += `<path d="${d}" stroke="#5e2a18" stroke-width=".35" fill="none"/>`; }
  st += `<line x1="92" y1="104.8" x2="176.4" y2="104.8" stroke="#4a2414" stroke-width="1.2"/><path d="M176 105 L190 118" stroke="#4a2414" stroke-width=".8"/>`;
  S.hinten(OST(st));
  let k = ""; 
  k += `<line x1="${x}" y1="${y + 3}" x2="${x}" y2="${y - 8}" stroke="#2b2b2b" stroke-width=".5"/>`;
  k += `<line x1="${x - 3.6}" y1="${y - 1}" x2="${x + 3.6}" y2="${y - 1}" stroke="#2b2b2b" stroke-width=".35"/><line x1="${x - 1.2}" y1="${y - 2}" x2="${x + 1.2}" y2="${y}" stroke="#2b2b2b" stroke-width=".35"/>`;
  k += `<text x="${x - 4.6}" y="${y - 0.4}" font-size="1.6" fill="#2b2b2b" font-family="Arial">W</text><text x="${x + 3.8}" y="${y - 0.4}" font-size="1.6" fill="#2b2b2b" font-family="Arial">O</text>`;
  /* Hahn als Blechsilhouette: Kopf mit Kamm links, Schwanzfedern rechts */
  const hy = y - 8;
  k += `<path d="M${x - 3.2} ${hy - 4.6} Q${x - 3.8} ${hy - 6.4} ${x - 2.4} ${hy - 6.8} L${x - 2} ${hy - 7.8} L${x - 1.4} ${hy - 6.8} L${x - 0.8} ${hy - 7.6} L${x - 0.6} ${hy - 6.2} Q${x - 0.4} ${hy - 4.2} ${x + 0.4} ${hy - 3.4} Q${x + 2} ${hy - 4.2} ${x + 2.8} ${hy - 7.6} Q${x + 4.8} ${hy - 6} ${x + 4.6} ${hy - 2.6} Q${x + 3.6} ${hy - 0.4} ${x + 0.6} ${hy - 0.2} L${x - 1.4} ${hy - 0.4} Q${x - 2.8} ${hy - 1.6} ${x - 2.6} ${hy - 3.6} L${x - 4.2} ${hy - 4.2} Z" fill="${S.lg("hahn", [[0, "#3b3f44"], [1, "#1d2024"]])}"/>`;
  k += `<line x1="${x}" y1="${hy - 0.2}" x2="${x}" y2="${hy + 1}" stroke="#2b2b2b" stroke-width=".5"/><path d="M${x + 3.4} ${hy - 5.6} q.6 1.6 .2 3" stroke="#6b7076" stroke-width=".3" fill="none"/>`;
  S.teil({ oben: true, id: "wetterhahn", de: "der Wetterhahn", syl: "WET-ter-hahn", it: "il gallo segnavento", itSyl: "GAL-lo se-gna-VEN-to", en: "weathercock", x, y: y + 3, kunst: um(x, y + 3, OST(k)),
    tipp: "Der Wetterhahn dreht den Kopf in den Wind: Der Wind kommt von Westen." });
}

/* =====================================================================
   IM WESTFENSTER: 10 — DIE SONNE, 11 — DER WIND (Birke im Sturm)
   ===================================================================== */
{
  let k = `<path d="${poly(LF)}" fill="${S.lg("westhimmel", [[0, "#8ab7e0"], [0.55, "#e6d3a2"], [1, "#f2b766"]], 0, 0, 0, 1)}"/>`;
  k += `<path d="M14 92 Q30 86 54 88 L54 120 L14 120 Z" fill="#6f8a4a"/><path d="M14 98 Q34 92 54 96 L54 120 L14 120 Z" fill="#5e7a3e"/>`;
  S.hinten(WEST(k));
}
{
  const x = 30, y = 48;
  let k = `<circle cx="${x}" cy="${y}" r="16" fill="${S.rg("sonnenhof", [[0, "#fff6d0", 0.95], [0.35, "#ffe8a0", 0.45], [1, "#ffe8a0", 0]])}"/>`;
  k += `<circle cx="${x}" cy="${y}" r="5" fill="${S.rg("sonne", [[0, "#ffffff"], [0.6, "#fff8d8"], [1, "#ffe9a0"]])}"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(x + Math.cos(a) * 7)}" y1="${r(y + Math.sin(a) * 7)}" x2="${r(x + Math.cos(a) * (i % 2 ? 11 : 14))}" y2="${r(y + Math.sin(a) * (i % 2 ? 11 : 14))}" stroke="#fff4c8" stroke-width=".6" opacity=".7"/>`; }
  S.teil({ id: "sonne", de: "die Sonne", syl: "SON-ne", it: "il sole", itSyl: "SO-le", en: "sun", x, y: y + 7, kunst: um(x, y + 7, WEST(k)) + flaeche(-8, -15, 16, 16),
    tipp: "Die Sonne steht im Westen — am Nachmittag scheint sie hier herein." });
}
{
  /* Birke vor dem Fenster, vom Westwind gebogen; Blätter fliegen */
  const x = 42, y = 112;
  let k = `<path d="M${x} ${y} Q${x + 1} ${y - 22} ${x + 8} ${y - 46} L${x + 9.4} ${y - 45} Q${x + 3} ${y - 22} ${x + 2.4} ${y}" fill="#f1efe8"/>`;
  for (let i = 0; i < 8; i++) k += `<rect x="${r(x + 0.4 + i * 0.6)}" y="${r(y - 6 - i * 5)}" width="1.6" height=".6" fill="#3a3a36"/>`;
  /* Zweige und Laub zur Seite geweht */
  for (let i = 0; i < 7; i++) {
    const bx = x + 2 + i * 1, by = y - 14 - i * 4.6, l = 10 + i * 1.4;
    k += `<path d="M${r(bx)} ${r(by)} Q${r(bx + l * 0.5)} ${r(by - 1)} ${r(bx + l)} ${r(by + 3)}" stroke="#6b5a48" stroke-width=".35" fill="none"/>`;
    for (let j = 0; j < 7; j++) k += `<ellipse cx="${r(bx + l * (0.3 + j * 0.11))}" cy="${r(by + 0.4 + j * 0.5)}" rx="1.3" ry=".6" fill="${j % 2 ? "#7ea64a" : "#93b85a"}" transform="rotate(25 ${r(bx + l * (0.3 + j * 0.11))} ${r(by + 0.4 + j * 0.5)})"/>`;
  }
  for (let i = 0; i < 8; i++) { const lx = 20 + rnd() * 34, ly = 40 + rnd() * 50; k += `<ellipse cx="${r(lx)}" cy="${r(ly)}" rx=".9" ry=".45" fill="#a6c060" transform="rotate(${Math.round(rnd() * 180)} ${r(lx)} ${r(ly)})"/>`; }
  for (let i = 0; i < 5; i++) { const wy = 60 + i * 8; k += `<path d="M${16 + i * 2} ${wy} q8 -2 16 0 t14 1" stroke="#ffffff" stroke-width=".4" fill="none" opacity=".55"/>`; }
  S.teil({ id: "wind", de: "der Wind", syl: "WIND", it: "il vento", itSyl: "VEN-to", en: "wind", x: x + 4, y, kunst: um(x + 4, y, WEST(k)),
    tipp: "Den Wind sieht man nicht — aber man sieht, wie er die Birke biegt." });
}

/* =====================================================================
   12 — DAS FENSTER (Ostfenster, Holzrahmen mit Kreuz) — Westfenster als Kulisse davor
   ===================================================================== */
{
  const { x0, x1, y0, y1 } = FE, xm = (x0 + x1) / 2;
  let k = "";
  const RW = 3.2;
  k += `<path d="M${x0 - 1} ${y0 - 1} H${x1 + 1} V${y1 + 1} H${x0 - 1} Z M${x0 + RW} ${y0 + RW} V${y1 - RW} H${x1 - RW} V${y0 + RW} Z" fill="${WEISS}" fill-rule="evenodd"/>`;
  k += `<rect x="${xm - 1.8}" y="${y0}" width="3.6" height="${y1 - y0}" fill="${WEISS}"/><rect x="${x0}" y="${y0 + 26}" width="${x1 - x0}" height="2.4" fill="${WEISS}"/>`;
  k += `<rect x="${xm - 3}" y="${y0 + 52}" width="1" height="5" rx=".4" fill="#c9c6bd"/><rect x="${xm + 2}" y="${y0 + 52}" width="1" height="5" rx=".4" fill="#c9c6bd"/>`;
  /* Fensterbank (Holz), von oben gesehen */
  k += `<path d="M${x0 - 8} ${y1 + 1} L${x1 + 8} ${y1 + 1} L${x1 + 12} ${y1 + 9} L${x0 - 12} ${y1 + 9} Z" fill="${S.lg("bank", [[0, "#c79b66"], [1, "#a77a48"]])}"/>`;
  k += `<rect x="${x0 - 12}" y="${y1 + 9}" width="${x1 - x0 + 24}" height="2.4" fill="#8a6038"/>`;
  S.teil({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: xm, y: y1 + 11, kunst: um(xm, y1 + 11, k) });
  /* Glas: Spiegelungen über der Aussicht (fangen keinen Tipp ab) */
  S.davor(`<path d="M${x0 + 8} ${y1 - 4} L${x0 + 30} ${y0 + 4} L${x0 + 38} ${y0 + 4} L${x0 + 16} ${y1 - 4} Z" fill="#fff" opacity=".07"/><path d="M${x1 - 30} ${y1 - 4} L${x1 - 14} ${y0 + 4} L${x1 - 10} ${y0 + 4} L${x1 - 26} ${y1 - 4} Z" fill="#fff" opacity=".06"/>`);
  /* Westfenster: Rahmen in der Flucht */
  const m = (a, b) => [r((a[0] + b[0]) / 2), r((a[1] + b[1]) / 2)];
  const top = m(LF[0], LF[1]), bot = m(LF[3], LF[2]);
  let w = `<path d="${poly(LF)}" fill="none" stroke="#f4f2ec" stroke-width="2.6"/>`;
  w += `<line x1="${top[0]}" y1="${top[1]}" x2="${bot[0]}" y2="${bot[1]}" stroke="#f4f2ec" stroke-width="2"/>`;
  const lb = [lw(10, 0.565), lw(58, 0.565), lw(58, 0.6), lw(10, 0.6)];
  w += `<path d="${poly(lb)}" fill="#b98c5a"/>`;
  w += `<path d="M${LF[0][0] + 4} ${LF[0][1] + 40} L${LF[0][0] + 16} ${LF[0][1] + 8} L${LF[0][0] + 20} ${LF[0][1] + 9} L${LF[0][0] + 8} ${LF[0][1] + 42} Z" fill="#fff" opacity=".08"/>`;
  S.davor(w);
}

/* =====================================================================
   13 — DAS THERMOMETER (außen am Fensterrahmen), 14 — DIE TEMPERATUR (Wetterstation)
   ===================================================================== */
{
  const x = 226, y = 92;
  let k = `<rect x="${x - 2.4}" y="${y - 30}" width="4.8" height="30" rx="1.2" fill="${S.lg("thermo", [[0, "#ffffff"], [1, "#dcdcd8"]], 0, 0, 1, 0)}" stroke="#b5b2aa" stroke-width=".2"/>`;
  k += `<rect x="${x - 0.45}" y="${y - 27}" width=".9" height="22" rx=".45" fill="#eef3f6"/><rect x="${x - 0.45}" y="${y - 17.6}" width=".9" height="12.6" fill="#d7262b"/><circle cx="${x}" cy="${y - 3.6}" r="1.3" fill="#d7262b"/>`;
  for (let i = 0; i <= 10; i++) k += `<line x1="${x - 1.9}" y1="${r(y - 6.6 - i * 2)}" x2="${x - (i % 5 ? 1.2 : 0.8)}" y2="${r(y - 6.6 - i * 2)}" stroke="#333" stroke-width=".15"/>`;
  k += `<text x="${x + 1.6}" y="${r(y - 6)}" font-size="1.2" fill="#333" font-family="Arial" text-anchor="middle">0</text><text x="${x + 1.6}" y="${r(y - 15.6)}" font-size="1.2" fill="#333" font-family="Arial" text-anchor="middle">20</text><text x="${x + 1.6}" y="${r(y - 25.6)}" font-size="1.2" fill="#333" font-family="Arial" text-anchor="middle">40</text>`;
  k += `<text x="${x}" y="${y - 28.2}" font-size="1.3" fill="#333" font-family="Arial" text-anchor="middle">°C</text>`;
  S.teil({ id: "thermometer", de: "das Thermometer", syl: "ther-mo-ME-ter", it: "il termometro", itSyl: "ter-MO-me-tro", en: "thermometer", x, y, kunst: um(x, y, k),
    tipp: "Das Fensterthermometer hängt draußen am Rahmen. Man liest es von innen ab." });
}
{
  /* Funk-Wetterstation auf der Fensterbank: außen 18,4 °C */
  const x = 198, y = FE.y1 + 5;
  let k = schatten(x, y, 10, 1, 0.3);
  k += `<path d="M${x - 9} ${y} L${x - 8} ${y - 15} L${x + 8} ${y - 15} L${x + 9} ${y} Z" fill="${S.lg("station", [[0, "#3b4148"], [1, "#22262b"]])}"/>`;
  k += `<rect x="${x - 7}" y="${y - 13.6}" width="14" height="11" rx=".6" fill="${S.lg("lcd", [[0, "#d6e4d2"], [1, "#b9ccb4"]])}"/>`;
  k += `<text x="${x - 6.2}" y="${y - 11.4}" font-size="1.4" fill="#2b3a2b" font-family="Arial">AUSSEN</text>`;
  k += `<text x="${x + 6}" y="${y - 6.4}" font-size="5" fill="#1d2a1d" font-family="Arial" font-weight="bold" text-anchor="end">18,4°</text>`;
  k += `<circle cx="${x - 4.4}" cy="${y - 4.6}" r="1.2" fill="#2b3a2b"/><path d="M${x - 4.6} ${y - 3.6} q1.6 -1.6 3.4 -.4 q1.4 0 1.4 1.2 h-4.6 Z" fill="#2b3a2b"/>`;
  k += `<text x="${x + 6}" y="${y - 3.4}" font-size="1.6" fill="#2b3a2b" font-family="Arial" text-anchor="end">innen 21,5°</text>`;
  S.teil({ oben: true, id: "temperatur", de: "die Temperatur", syl: "Tem-pe-ra-TUR", it: "la temperatura", itSyl: "tem-pe-ra-TU-ra", en: "temperature", x, y, steht: true, kunst: um(x, y, k),
    tipp: "Die Wetterstation zeigt die Temperatur: draußen 18,4 Grad Celsius." });
}

/* =====================================================================
   RECHTE WANDHÄLFTE: 15 — DAS BILD (Lupe: vier Jahreszeiten), 16 — DAS BAROMETER,
   17 — DIE REGENJACKE, 18 — DER SCHIRMSTÄNDER, 19 — DER REGENSCHIRM, 20 — DIE GUMMISTIEFEL
   ===================================================================== */
{
  const x0 = 250, y0 = 22, pw = 30, ph = 22, gap = 3;
  const unter = [];
  let k = schatten(x0 + 33, y0 + 54, 34, 2, 0.15);
  k += `<rect x="${x0 - 3}" y="${y0 - 3}" width="${2 * pw + gap + 6}" height="${2 * ph + gap + 12}" fill="${S.lg("bildrahmen", [[0, "#4a3220"], [1, "#2e1f14"]])}"/>`;
  k += `<rect x="${x0 - 1}" y="${y0 - 1}" width="${2 * pw + gap + 2}" height="${2 * ph + gap + 8}" fill="#f6f2e8"/>`;
  const baum = (bx, by, kr, art) => {
    let g = `<path d="M${bx - 0.9} ${by} L${bx - 0.6} ${by - 7} L${bx + 0.6} ${by - 7} L${bx + 0.9} ${by} Z" fill="#5a4030"/><path d="M${bx} ${by - 6} l-3 -3 M${bx} ${by - 7} l3 -3.4 M${bx} ${by - 8} v-3" stroke="#5a4030" stroke-width=".6"/>`;
    if (art === "winter") { g += `<path d="M${bx - 3.2} ${by - 9.2} q1 -.6 1.6 .2 M${bx + 1.6} ${by - 10.6} q1 -.6 1.8 0" stroke="#fff" stroke-width=".8" fill="none"/>`; return g; }
    for (let i = 0; i < 14; i++) { const a = rnd() * Math.PI * 2, d = rnd() * 5.6; g += `<circle cx="${r(bx + Math.cos(a) * d)}" cy="${r(by - 11 + Math.sin(a) * d * 0.75)}" r="${r(1.8 + rnd() * 1.2)}" fill="${kr[i % kr.length]}"/>`; }
    return g;
  };
  const felder = [
    { id: "fruehling", de: "der Frühling", syl: "FRÜH-ling", it: "la primavera", itSyl: "pri-ma-VE-ra", en: "spring", himmel: "#bfe0f4", boden: "#8cc65a", kr: ["#fbe7ee", "#f6c6d6", "#ffffff", "#b7d98a"], tipp: "Im Frühling blüht der Apfelbaum." },
    { id: "sommer", de: "der Sommer", syl: "SOM-mer", it: "l'estate", itSyl: "e-STA-te", en: "summer", himmel: "#7fbce8", boden: "#e2c25a", kr: ["#3f8a3a", "#4e9c3f", "#5aab48"], tipp: "Im Sommer ist es warm und das Korn wird reif." },
    { id: "herbst", de: "der Herbst", syl: "HERBST", it: "l'autunno", itSyl: "au-TUN-no", en: "autumn", himmel: "#c9d3dc", boden: "#a3874e", kr: ["#d9822b", "#c4502a", "#e8b33a", "#a8402a"], tipp: "Im Herbst werden die Blätter bunt und fallen ab." },
    { id: "winter", de: "der Winter", syl: "WIN-ter", it: "l'inverno", itSyl: "in-VER-no", en: "winter", himmel: "#d7dde4", boden: "#f6f8fb", kr: [], tipp: "Im Winter liegt Schnee und es ist kalt." },
  ];
  felder.forEach((f, i) => {
    const px = x0 + (i % 2) * (pw + gap), py = y0 + Math.floor(i / 2) * (ph + gap + 4);
    k += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="${f.himmel}"/>`;
    k += `<path d="M${px} ${py + ph * 0.7} Q${px + pw / 2} ${py + ph * 0.62} ${px + pw} ${py + ph * 0.7} V${py + ph} H${px} Z" fill="${f.boden}"/>`;
    if (f.id === "fruehling") for (let j = 0; j < 8; j++) k += `<circle cx="${r(px + 2 + rnd() * (pw - 4))}" cy="${r(py + ph * 0.75 + rnd() * ph * 0.2)}" r=".5" fill="#f5d327"/>`;
    if (f.id === "sommer") { k += `<circle cx="${px + pw - 5}" cy="${py + 5}" r="2.4" fill="#ffe36a"/>`; for (let j = 0; j < 12; j++) k += `<line x1="${r(px + 1 + j * 2.4)}" y1="${r(py + ph * 0.72)}" x2="${r(px + 1.4 + j * 2.4)}" y2="${r(py + ph * 0.66)}" stroke="#c9a23a" stroke-width=".4"/>`; }
    if (f.id === "herbst") for (let j = 0; j < 7; j++) k += `<ellipse cx="${r(px + 3 + rnd() * (pw - 6))}" cy="${r(py + 6 + rnd() * (ph - 8))}" rx=".7" ry=".4" fill="${j % 2 ? "#d9822b" : "#c4502a"}"/>`;
    if (f.id === "winter") for (let j = 0; j < 14; j++) k += `<circle cx="${r(px + rnd() * pw)}" cy="${r(py + rnd() * ph * 0.7)}" r=".35" fill="#fff"/>`;
    k += baum(px + pw / 2, py + ph * 0.72, f.kr, f.id);
    if (f.id === "sommer" || f.id === "herbst") for (let j = 0; j < 4; j++) k += `<circle cx="${r(px + pw / 2 - 4 + rnd() * 8)}" cy="${r(py + ph * 0.72 - 13 + rnd() * 6)}" r=".6" fill="#d23b30"/>`;
    k += `<text x="${px + pw / 2}" y="${py + ph + 3}" font-size="2.4" text-anchor="middle" fill="#3a2a1a" font-family="Georgia,serif">${f.de.split(" ")[1]}</text>`;
    unter.push({ id: f.id, de: f.de, syl: f.syl, it: f.it, itSyl: f.itSyl, en: f.en, tipp: f.tipp, x: px + pw / 2, y: py + ph + 4, kunst: flaeche(-pw / 2, -ph - 0.5, pw, ph + 4.5) });
  });
  S.teil({ id: "bild", de: "das Bild", syl: "BILD", it: "il quadro", itSyl: "QUA-dro", en: "picture", x: x0 + pw + 1.5, y: y0 + 2 * ph + gap + 9, kunst: um(x0 + pw + 1.5, y0 + 2 * ph + gap + 9, k),
    zoom: { x: x0 - 8, y: y0 - 6, w: 2 * pw + gap + 16, h: 52 }, unter,
    tipp: "Derselbe Apfelbaum in den vier Jahreszeiten." });
}
{
  /* Barometer: Holzgehäuse, Messingring, Zifferblatt mit Wetterfeldern */
  const x = 262, y = 95, R = 9;
  let k = `<circle cx="${x + 0.6}" cy="${y + 0.8}" r="${R + 2.6}" fill="#000" opacity=".18" filter="url(#bw_weich)"/>`;
  k += `<circle cx="${x}" cy="${y}" r="${R + 2.4}" fill="${S.rg("barholz", [[0, "#7a4a28"], [1, "#4a2a14"]])}"/><circle cx="${x}" cy="${y}" r="${R + 0.6}" fill="${S.lg("messing", [[0, "#f3d98a"], [1, "#a8822e"]])}"/>`;
  k += `<circle cx="${x}" cy="${y}" r="${R}" fill="#fbf7ec"/>`;
  const woerter = [["Sturm", -130], ["Regen", -75], ["Veränderlich", 0], ["Schön", 60], ["Sehr trocken", 115]];
  for (const [w, a] of woerter) { const rad = (a - 90) * Math.PI / 180; k += `<text x="${r(x + Math.cos(rad) * 5.6)}" y="${r(y + Math.sin(rad) * 5.6 + 0.5)}" font-size="1.25" text-anchor="middle" fill="#2b2b2b" font-family="Georgia,serif" transform="rotate(${a} ${r(x + Math.cos(rad) * 5.6)} ${r(y + Math.sin(rad) * 5.6)})">${w}</text>`; }
  for (let i = 0; i <= 40; i++) { const a = (-140 + i * 7 - 90) * Math.PI / 180; k += `<line x1="${r(x + Math.cos(a) * 7.6)}" y1="${r(y + Math.sin(a) * 7.6)}" x2="${r(x + Math.cos(a) * (i % 5 ? 8.2 : 8.6))}" y2="${r(y + Math.sin(a) * (i % 5 ? 8.2 : 8.6))}" stroke="#2b2b2b" stroke-width=".15"/>`; }
  const zg = (-40 - 90) * Math.PI / 180;
  k += `<line x1="${x}" y1="${y}" x2="${r(x + Math.cos(zg) * 7.4)}" y2="${r(y + Math.sin(zg) * 7.4)}" stroke="#1d1d1d" stroke-width=".5"/>`;
  const zs = (10 - 90) * Math.PI / 180;
  k += `<line x1="${x}" y1="${y}" x2="${r(x + Math.cos(zs) * 7)}" y2="${r(y + Math.sin(zs) * 7)}" stroke="#b8862a" stroke-width=".45"/><circle cx="${x}" cy="${y}" r=".8" fill="#b8862a"/>`;
  k += `<path d="M${x - 6} ${y - 6} A8.5 8.5 0 0 1 ${x + 4} ${y - 7.6}" stroke="#fff" stroke-width="1" opacity=".5" fill="none"/>`;
  S.teil({ id: "barometer", de: "das Barometer", syl: "ba-ro-ME-ter", it: "il barometro", itSyl: "ba-RO-me-tro", en: "barometer", x, y: y + R + 2.4, kunst: um(x, y + R + 2.4, k),
    tipp: "Das Barometer misst den Luftdruck. Fällt er, kommt oft Regen." });
}
{
  /* Garderobe: Hakenleiste mit gelber Regenjacke (Friesennerz) */
  const x = 302, y = 140;
  let k = `<rect x="284" y="78" width="36" height="4" rx="1" fill="${ZIRBE_D}"/><path d="M296 80 q0 4 2.6 4.6 M312 80 q0 4 2.6 4.6" stroke="#3a3a3a" stroke-width=".8" fill="none"/>`;
  k += `<path d="M298.4 84 Q292 86 290 96 L288 138 Q300 141 314 138 L316 96 Q312 86 306 84 Q302 88 298.4 84 Z" fill="${S.lg("jacke", [[0, "#ffd53a"], [0.5, "#f2c21c"], [1, "#d29c0c"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M298.4 84 Q302 92 306 84 Q304 80 302 80 Q300 80 298.4 84 Z" fill="#e0ae14"/>`;
  k += `<path d="M291 98 Q288 118 289 132 L293 132 Q292 114 294 100 Z M315 98 Q318 118 317 132 L313 132 Q314 114 312 100 Z" fill="#e3b012"/>`;
  k += `<line x1="302.2" y1="90" x2="302.2" y2="139" stroke="#b78a0a" stroke-width=".6"/>`;
  for (let i = 0; i < 5; i++) k += `<circle cx="303.6" cy="${96 + i * 8}" r=".7" fill="#7a5a10"/>`;
  k += `<path d="M294 112 h5 M305 112 h5" stroke="#b78a0a" stroke-width=".5"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${291 + i * 4.6} 139 q.3 .9 0 1.6" stroke="#9ec9e6" stroke-width=".5" fill="none"/>`;
  S.teil({ id: "regenjacke", de: "die Regenjacke", syl: "RE-gen-ja-cke", it: "l'impermeabile", itSyl: "im-per-me-A-bi-le", en: "rain jacket", x, y, kunst: um(x, y, k) });
}
{
  const x = 262, y = 182;
  let k = schatten(x, y + 0.4, 8, 1.4, 0.3);
  k += `<path d="M${x - 6} ${y - 26} L${x + 6} ${y - 26} L${x + 5.4} ${y} L${x - 5.4} ${y} Z" fill="${S.lg("staender", [[0, "#3b4a5c"], [0.4, "#6b7f96"], [1, "#2b3746"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="${x}" cy="${y - 26}" rx="6" ry="1.5" fill="#1d2630"/><rect x="${x - 6}" y="${y - 22}" width="12" height=".8" fill="#8fa2b8"/>`;
  S.teil({ id: "schirmstaender", de: "der Schirmständer", syl: "SCHIRM-stän-der", it: "il portaombrelli", itSyl: "por-ta-om-BREL-li", en: "umbrella stand", x, y, steht: true, kunst: um(x, y, k) });
}
{
  /* nasser Stockschirm im Ständer: Griff oben, Stoff gerollt, Tropfen */
  const x = 262, y = 156;
  let k = `<path d="M${x + 0.6} ${y - 40} q0 -4 -3.4 -4 q-2.6 0 -2.6 2.4" stroke="#6b3e1e" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  k += `<rect x="${x - 0.2}" y="${y - 40}" width="1.4" height="6" fill="#bfc4c8"/>`;
  k += `<path d="M${x + 0.5} ${y - 34} Q${x - 4} ${y - 18} ${x - 2.6} ${y} L${x + 3.6} ${y} Q${x + 5} ${y - 18} ${x + 0.5} ${y - 34} Z" fill="${S.lg("schirm", [[0, "#1f3f7a"], [0.5, "#2f5aa8"], [1, "#16305e"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${x - 1.4} ${y - 22} q2.4 -2 4 0 M${x - 2} ${y - 12} q3 -2 5 0" stroke="#5a7ec4" stroke-width=".4" fill="none"/>`;
  for (const [dx, dy] of [[-1.6, -16], [2.6, -8], [0, -26]]) k += `<path d="M${x + dx} ${y + dy} q.5 .8 0 1.4 q-.5 -.6 0 -1.4 Z" fill="#cfe6f7"/>`;
  S.teil({ oben: true, id: "regenschirm", de: "der Regenschirm", syl: "RE-gen-schirm", it: "l'ombrello", itSyl: "om-BREL-lo", en: "umbrella", x, y, kunst: um(x, y, k) + flaeche(-4.6, -45, 9.2, 45),
    tipp: "Der Schirm ist noch nass vom letzten Schauer." });
}
{
  /* Gummistiefel auf der Abtropfschale */
  const x = 300, y = 186;
  let k = `<rect x="${x - 14}" y="${y - 1.6}" width="28" height="2.6" rx="1" fill="#2b2f33"/>`;
  const stiefel = (sx, f, d) => `<path d="M${sx - 4} ${y - 26} L${sx + 2.6} ${y - 26} L${sx + 2.8} ${y - 6} Q${sx + 9} ${y - 5.4} ${sx + 9.6} ${y - 2} L${sx + 9.6} ${y - 1.4} L${sx - 4.4} ${y - 1.4} Z" fill="${f}"/><path d="M${sx - 4.4} ${y - 2.8} H${sx + 9.6}" stroke="${d}" stroke-width="1.4"/><ellipse cx="${sx - 0.7}" cy="${y - 26}" rx="3.3" ry="1" fill="${d}"/><path d="M${sx - 3} ${y - 24} L${sx - 2.6} ${y - 8}" stroke="#fff" stroke-width=".7" opacity=".3"/>`;
  k += stiefel(x - 7, S.lg("gummi", [[0, "#3f8a4a"], [1, "#25603a"]], 0, 0, 1, 0), "#1c4529") + stiefel(x + 2, S.lg("gummi2", [[0, "#4a9a56"], [1, "#2c6b40"]], 0, 0, 1, 0), "#1c4529");
  k += `<ellipse cx="${x - 9}" cy="${y + 0.2}" rx="2" ry=".4" fill="#9ec9e6" opacity=".7"/>`;
  S.teil({ id: "gummistiefel", de: "die Gummistiefel", syl: "GUM-mi-stie-fel", it: "gli stivali di gomma", itSyl: "sti-VA-li di GOM-ma", en: "rubber boots", x, y, steht: true, kunst: um(x, y, k) });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/wetter.js"));
console.log(aus);
