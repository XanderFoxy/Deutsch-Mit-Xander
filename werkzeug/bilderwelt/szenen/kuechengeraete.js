#!/usr/bin/env node
/* =====================================================================
   KÜCHENGERÄTE (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Küchenzeilen von OBI/toom/Bauhaus, Hausbau-Forum zu
   Arbeitshöhe, Hängeschrank und Dunstabzug) — so sieht eine deutsche
   Einbauküche aus:
   - Unterschränke 60 cm tief, Arbeitsplatte auf 0,85–0,91 m,
     Sockelblende unten; Hängeschränke ab ca. 1,45 m, darüber die Decke.
   - Die SPÜLE liegt meist unter dem FENSTER, gleich daneben der
     GESCHIRRSPÜLER (60 cm), damit die Leitungen kurz sind.
   - Einbauherd: KOCHFELD (Glaskeramik) oben, die Drehknebel in der
     Herdblende, darunter der BACKOFEN mit Glastür; darüber die
     Kamin-DUNSTABZUGSHAUBE (ca. 65 cm über dem Kochfeld).
   - Freistehende KÜHL-GEFRIER-KOMBINATION (Edelstahl) am Ende der Zeile.
   - Auf der Arbeitsplatte die Kleingeräte an den Steckdosen:
     Filterkaffeemaschine, Wasserkocher, Toaster, Standmixer,
     Heißluftfritteuse; die MIKROWELLE in der Ecke; Schneidebrett und
     Küchenwaage neben dem Herd.
   Maßstab (Augenhöhe 1,67 m, Fluchtpunkt 160/74,7):
   Wand ≈ 50 Einheiten je Meter (Wandfuß y 158), Schrankfronten ≈ 56
   (Fuß y 168). Arbeitsplatte 0,9 m, Kühlschrank 1,85 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "kuechengeraete", titel: "Küchengeräte", emoji: "🍳", thema: "Zuhause", kuerzel: "b15c", fassung: 852 });
const rnd = zufall(5512);
const r = B.r;

const WAND_UNTEN = 158, FRONT = 168, DECKE = 28;
const M = (y) => 50 + (y - WAND_UNTEN) * 0.6;
const VP = { x: 160, y: 74.7 };
const SF = M(FRONT);                         /* 56 je Meter an den Fronten */
const AP_V = FRONT - 0.9 * SF, AP_H = WAND_UNTEN - 0.9 * 50 - 2;   /* Arbeitsplatte vorne / an der Wand */

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const EDEL = S.lg("edel", [[0, "#e9ecee"], [0.3, "#c9ced2"], [0.55, "#dfe3e6"], [0.8, "#b9bfc4"], [1, "#d6dadd"]], 0, 0, 1, 0);
const EDEL_V = S.lg("edelv", [[0, "#eef0f2"], [1, "#c3c8cc"]]);
const FRONTF = S.lg("front", [[0, "#fbfaf7"], [1, "#e9e6df"]]);
const EICHE = S.lg("eiche", [[0, "#d9b483"], [1, "#b98f5c"]]);
const SCHWARZ = S.lg("schwarz", [[0, "#3a3e42"], [1, "#16191c"]]);

/* =====================================================================
   KULISSE — Decke, Wand, Fliesenspiegel, Boden, Fenster über der Spüle
   ===================================================================== */
const FEN = { x0: 40, x1: 84, y0: 44, y1: 101 };
{
  let k = `<rect x="0" y="0" width="320" height="${DECKE}" fill="${S.lg("decke", [[0, "#ecebe7"], [1, "#e0ded8"]])}"/>`;
  /* Decke in Flucht: Fugen der Deckenplatten laufen zum Fluchtpunkt */
  for (let i = -5; i <= 5; i++) { const xb = VP.x + i * 36, t = (0 - VP.y) / (DECKE - VP.y); k += `<line x1="${r(xb)}" y1="${DECKE}" x2="${r(VP.x + (xb - VP.x) * t)}" y2="0" stroke="#d6d4ce" stroke-width=".35"/>`; }
  for (const y of [DECKE - 9, DECKE - 20]) k += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#d6d4ce" stroke-width=".3"/>`;
  k += `<rect x="0" y="0" width="320" height="${DECKE}" fill="${S.lg("deckenschatten", [[0, "#000", 0.08], [1, "#000", 0]])}"/>`;
  for (const x of [60, 160, 260]) k += `<ellipse cx="${x}" cy="${DECKE - 9}" rx="4" ry="1.1" fill="#fffbe9"/><ellipse cx="${x}" cy="${DECKE - 9}" rx="9" ry="2.4" fill="#fffbe9" opacity=".3"/>`;
  k += `<rect x="0" y="${DECKE}" width="320" height="${WAND_UNTEN - DECKE}" fill="${S.lg("wand", [[0, "#e5e9e1"], [1, "#d9ded4"]])}"/>`;
  k += `<rect x="0" y="${DECKE - 0.6}" width="320" height="1.4" fill="#cfd2c9"/>`;
  /* Fliesenspiegel (weiße Metrofliesen) zwischen Arbeitsplatte und Hängeschränken */
  S.def(`<pattern id="${S.id("metro")}" width="7.5" height="3.8" patternUnits="userSpaceOnUse"><rect width="7.5" height="3.8" fill="#d8d6cf"/><rect x=".2" y=".2" width="7.1" height="1.5" rx=".3" fill="#fbfaf6"/><rect x="-3.55" y="2.1" width="7.1" height="1.5" rx=".3" fill="#f7f6f1"/><rect x="3.95" y="2.1" width="7.1" height="1.5" rx=".3" fill="#f9f8f4"/></pattern>`);
  k += `<rect x="38" y="84" width="282" height="${AP_H - 84 + 2}" fill="url(#${S.id("metro")})"/>`;
  /* Fenster über der Spüle: Blick in einen Hinterhof mit Baum */
  k += `<rect x="${FEN.x0 - 3}" y="${FEN.y0 - 3}" width="${FEN.x1 - FEN.x0 + 6}" height="${FEN.y1 - FEN.y0 + 6}" fill="#f7f7f5"/>`;
  k += `<rect x="${FEN.x0}" y="${FEN.y0}" width="${FEN.x1 - FEN.x0}" height="${FEN.y1 - FEN.y0}" fill="${S.lg("himmel", [[0, "#a9d2ee"], [1, "#e1f0f7"]])}"/>`;
  k += `<rect x="${FEN.x0}" y="${FEN.y0 + 26}" width="${FEN.x1 - FEN.x0}" height="${FEN.y1 - FEN.y0 - 26}" fill="#d7c7ae"/>`;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) k += `<rect x="${FEN.x0 + 4 + i * 14}" y="${FEN.y0 + 30 + j * 12}" width="6" height="7" fill="#90a9b9"/>`;
  for (let i = 0; i < 8; i++) k += `<circle cx="${r(FEN.x0 + 26 + rnd() * 16)}" cy="${r(FEN.y0 + 10 + rnd() * 14)}" r="${r(4 + rnd() * 3)}" fill="${rnd() < 0.5 ? "#6f9a55" : "#5b8746"}"/>`;
  k += `<rect x="${(FEN.x0 + FEN.x1) / 2 - 1}" y="${FEN.y0}" width="2" height="${FEN.y1 - FEN.y0}" fill="#f7f7f5"/>`;
  k += `<path d="M${FEN.x0 + 3} ${FEN.y1} L${FEN.x0 + 14} ${FEN.y0} L${FEN.x0 + 19} ${FEN.y0} L${FEN.x0 + 8} ${FEN.y1} Z" fill="#fff" opacity=".25"/>`;
  k += `<rect x="${FEN.x0 + 15}" y="${FEN.y0 + 22}" width="1.4" height="4" rx=".6" fill="#ddd"/>`;
  /* Boden: großformatige Fliesen in Fluchtperspektive */
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#c9c1b4"], [1, "#b2aa9c"]])}"/>`;
  for (let i = -6; i <= 6; i++) {
    const xb = VP.x + i * 30, t = (200 - VP.y) / (WAND_UNTEN - VP.y);
    k += `<line x1="${r(xb)}" y1="${WAND_UNTEN}" x2="${r(VP.x + (xb - VP.x) * t)}" y2="200" stroke="#a1998b" stroke-width=".35"/>`;
  }
  for (const y of [FRONT + 9, FRONT + 28]) k += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#a1998b" stroke-width=".35"/>`;
  k += `<rect x="0" y="${FRONT}" width="320" height="${200 - FRONT}" fill="${S.lg("bodenlicht", [[0, "#000", 0.16], [0.3, "#000", 0], [1, "#fff", 0.06]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE HÄNGESCHRÄNKE (rechts, über den Kleingeräten und über dem
       Kühlschrank), 2 — DAS FENSTER
   ===================================================================== */
const HS = { y0: WAND_UNTEN - 2.15 * 50 - 2, y1: WAND_UNTEN - 1.45 * 50 };
{
  let k = "";
  const tuer = (x0, x1) => {
    let g = `<rect x="${x0}" y="${HS.y0}" width="${x1 - x0}" height="${HS.y1 - HS.y0}" fill="${FRONTF}" stroke="#d6d2c8" stroke-width=".4"/>`;
    g += `<rect x="${x0 + 0.8}" y="${HS.y1 - 4}" width="${x1 - x0 - 1.6}" height="1" rx=".4" fill="#9aa1a6"/>`;
    g += `<path d="M${x0 + 1.4} ${HS.y0 + 2} L${x0 + 1.4} ${HS.y1 - 6}" stroke="#fff" stroke-width=".7" opacity=".8"/>`;
    return g;
  };
  /* Unterseite (von unten sichtbar) und Lichtleiste */
  k += `<path d="M186 ${HS.y1} L318 ${HS.y1} L316 ${HS.y1 + 2.4} L188 ${HS.y1 + 2.4} Z" fill="#cfcbc1"/><rect x="190" y="${HS.y1 + 1}" width="124" height=".9" fill="#fff6d6"/>`;
  for (const [a, b] of [[186, 219], [219, 252], [252, 285], [285, 318]]) k += tuer(a, b);
  k += `<rect x="186" y="${HS.y0 - 1.6}" width="132" height="1.8" fill="#e9e6df"/>`;
  /* Unterbauleuchte: warmer Lichtschein auf dem Fliesenspiegel */
  S.hinten(`<rect x="188" y="${HS.y1 + 2}" width="128" height="18" fill="${S.lg("ubl", [[0, "#fff4cf", 0.45], [1, "#fff4cf", 0]])}"/>`);
  S.teil({ id: "haengeschrank", de: "der Hängeschrank", syl: "HÄN-ge-schrank", it: "il pensile", itSyl: "PEN-si-le", en: "wall cabinet",
    x: 252, y: HS.y1, kunst: `<g transform="translate(-252 ${-HS.y1})">${k}</g>` });
}
{
  /* über dem Kühlschrank ein flacher Schrank (Teil der Kulisse) */
  S.hinten(`<rect x="2" y="${DECKE + 2}" width="35" height="${HS.y0 - DECKE + 8}" fill="${FRONTF}" stroke="#d6d2c8" stroke-width=".4"/><rect x="3" y="${HS.y0 + 6}" width="33" height=".9" rx=".4" fill="#9aa1a6"/>`);
}
{
  let k = `<rect x="-24" y="-1.4" width="48" height="2.8" rx=".6" fill="${S.lg("bank", [[0, "#ffffff"], [1, "#dcdad4"]])}"/>`;
  /* Fensterrahmen als Fläche (die Scheibe gehört zum Bild dahinter) */
  k += `<path d="M-25 -60 L25 -60 L25 -1.4 L-25 -1.4 Z M-22 -57 L-1 -57 L-1 -1.4 L-22 -1.4 Z M1 -57 L22 -57 L22 -1.4 L1 -1.4 Z" fill="#f7f7f5" fill-rule="evenodd"/>`;
  /* Kräutertopf auf der Fensterbank */
  k += `<path d="M10 -1.4 L16 -1.4 L16.6 -6 L9.4 -6 Z" fill="#c4683d"/>`;
  for (let i = 0; i < 9; i++) k += `<ellipse cx="${r(10 + rnd() * 6)}" cy="${r(-7 - rnd() * 5)}" rx="1.4" ry=".8" fill="${rnd() < 0.5 ? "#4f8a3c" : "#6aa84f"}"/>`;
  S.teil({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: 62, y: FEN.y1 + 2, kunst: k + flaeche(-22, -56, 44, 54) });
}

/* =====================================================================
   3 — DIE DUNSTABZUGSHAUBE (Kaminhaube über dem Herd)
   ===================================================================== */
const HERD = { x0: 152, x1: 186 };
{
  const cx = (HERD.x0 + HERD.x1) / 2, yU = WAND_UNTEN - 1.58 * 50;
  let k = `<rect x="-7" y="${-(yU - DECKE)}" width="14" height="${yU - DECKE - 6}" fill="${EDEL}"/>`;
  k += `<path d="M-7 -6 L7 -6 L19 0 L-19 0 Z" fill="${EDEL_V}"/>`;
  k += `<rect x="-19" y="0" width="38" height="3.2" fill="${EDEL}"/><rect x="-18" y="3.2" width="36" height="1.4" fill="#7f878d"/>`;
  for (let i = 0; i < 4; i++) k += `<circle cx="${-6 + i * 4}" cy="1.6" r=".7" fill="${i === 1 ? "#5fbf6a" : "#59626a"}"/>`;
  k += `<rect x="-14" y="4.2" width="5" height=".8" fill="#fff6d0"/><rect x="9" y="4.2" width="5" height=".8" fill="#fff6d0"/>`;
  k += `<path d="M-5.6 ${-(yU - DECKE) + 2} L-5.6 -8" stroke="#fff" stroke-width=".9" opacity=".6"/>`;
  S.teil({ id: "dunstabzugshaube", de: "die Dunstabzugshaube", syl: "DUNST-ab-zugs-hau-be", it: "la cappa", itSyl: "CAP-pa", en: "extractor hood",
    x: cx, y: yU, kunst: k, tipp: "Die Dunstabzugshaube saugt Dampf und Fett beim Kochen ab." });
  /* Lichtschein der Haube auf das Kochfeld */
  S.hinten(`<path d="M${cx - 17} ${yU + 5} L${cx - 22} ${AP_V} L${cx + 22} ${AP_V} L${cx + 17} ${yU + 5} Z" fill="${S.lg("haubenlicht", [[0, "#fff6d0", 0.35], [1, "#fff6d0", 0]])}"/>`);
}

/* =====================================================================
   4 — DER KÜHLSCHRANK (Kühl-Gefrier-Kombination, links)
   ===================================================================== */
{
  const W = 34, H = 1.85 * SF;
  let k = schatten(0, 0, 19, 1.5, 0.3);
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H - 2}" rx="1.6" fill="${EDEL}"/>`;
  k += `<rect x="${-W / 2 + 1}" y="-2.6" width="${W - 2}" height="2.6" fill="#2b2f33"/>`;
  /* Fuge zwischen Kühlteil (oben) und Gefrierteil (unten) */
  const fuge = -H + 0.62 * H;
  k += `<rect x="${-W / 2}" y="${r(fuge)}" width="${W}" height=".9" fill="#7f878d"/>`;
  /* Griffe (Stangen) rechts */
  k += `<rect x="${W / 2 - 4}" y="${r(-H + 14)}" width="1.8" height="34" rx=".9" fill="${S.lg("griffk", [[0, "#f5f6f7"], [1, "#9aa3aa"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${W / 2 - 4}" y="${r(fuge + 4)}" width="1.8" height="18" rx=".9" fill="${S.lg("griffg", [[0, "#f5f6f7"], [1, "#9aa3aa"]], 0, 0, 1, 0)}"/>`;
  /* Display an der Tür, Schneeflocke am Gefrierteil */
  k += `<rect x="-6" y="${r(-H + 18)}" width="10" height="6" rx=".8" fill="#14191d"/><text x="-1" y="${r(-H + 22.4)}" font-size="3.4" text-anchor="middle" fill="#7fe0ff" font-family="Arial">5°</text>`;
  k += `<text x="-1" y="${r(fuge + 10)}" font-size="3.4" text-anchor="middle" fill="#8a949b" font-family="Arial">❄ −18°</text>`;
  /* Magnet mit Kinderbild und Einkaufszettel */
  k += `<rect x="-14" y="${r(-H + 34)}" width="11" height="9" fill="#fff" transform="rotate(-4 -8 ${r(-H + 38)})"/><circle cx="-8.6" cy="${r(-H + 34.4)}" r="1" fill="#e04a3f"/>`;
  k += `<circle cx="-11" cy="${r(-H + 39)}" r="2" fill="#f2c94c"/><path d="M-7 ${r(-H + 42)} l3 -4 l2 3" stroke="#3f9a5a" stroke-width=".7" fill="none"/>`;
  k += `<rect x="-12" y="${r(-H + 46)}" width="8" height="10" fill="#fff59a"/><path d="M-11 ${r(-H + 49)} h6 M-11 ${r(-H + 51.4)} h5 M-11 ${r(-H + 53.8)} h6" stroke="#556" stroke-width=".35"/>`;
  k += `<path d="M${-W / 2 + 2} ${r(-H + 3)} L${-W / 2 + 2} -6" stroke="#fff" stroke-width="1.1" opacity=".5"/>`;
  S.teil({ id: "kuehlschrank", de: "der Kühlschrank", syl: "KÜHL-schrank", it: "il frigorifero", itSyl: "fri-go-RI-fe-ro", en: "fridge",
    x: 20, y: FRONT, steht: true, kunst: k, tipp: "Oben kühlt der Kühlschrank auf 5 °C, unten friert das Gefrierfach auf −18 °C." });
}

/* =====================================================================
   5 — UNTERSCHRÄNKE mit ARBEITSPLATTE (rechts: Lupe Kleingeräte)
   ===================================================================== */
const sockel = (x0, x1) => `<rect x="${x0}" y="${FRONT - 5.6}" width="${x1 - x0}" height="5.6" fill="#a8a59e"/>`;
const platte = (x0, x1, dxL = 0) => {
  /* Oberseite (Wandkante → Vorderkante) und Stirnkante */
  const fl = (x) => r(VP.x + (x - VP.x) * (AP_H - VP.y) / (AP_V - VP.y));
  return `<path d="M${fl(x0)} ${AP_H} L${fl(x1)} ${AP_H} L${x1} ${r(AP_V)} L${x0} ${r(AP_V)} Z" fill="${S.lg("eicheoben", [[0, "#c9a271"], [1, "#e0bf90"]])}"/>` +
    `<rect x="${x0}" y="${r(AP_V)}" width="${x1 - x0}" height="2.4" fill="${EICHE}"/><rect x="${x0}" y="${r(AP_V)}" width="${x1 - x0}" height=".5" fill="#f0d6ae"/>`;
};
/* Spülenschrank, Unterschrank links neben dem Herd — als Kulisse (Fronten) */
{
  let k = "";
  const tuer = (x0, x1, griff = "oben") => `<rect x="${x0 + 0.4}" y="${r(AP_V + 3)}" width="${x1 - x0 - 0.8}" height="${r(FRONT - 5.6 - AP_V - 3.4)}" fill="${FRONTF}" stroke="#d6d2c8" stroke-width=".4"/>` +
    `<rect x="${x0 + 3}" y="${r(AP_V + 6)}" width="${x1 - x0 - 6}" height="1" rx=".5" fill="#9aa1a6"/>`;
  k += sockel(38, 84) + tuer(38, 61) + tuer(61, 84);
  /* Unterschrank mit drei Schubladen zwischen Spülmaschine und Herd */
  k += sockel(118, 152);
  for (let i = 0; i < 3; i++) { const y0 = AP_V + 3 + i * 14.6; k += `<rect x="118.4" y="${r(y0)}" width="33.2" height="14" fill="${FRONTF}" stroke="#d6d2c8" stroke-width=".4"/><rect x="128" y="${r(y0 + 3)}" width="14" height="1" rx=".5" fill="#9aa1a6"/>`; }
  k += sockel(186, 318);
  for (const [a, b] of [[186, 219], [219, 252], [252, 285], [285, 318]]) k += tuer(a, b);
  S.hinten(k);
}
/* DIE SPÜLE (Edelstahl, unter dem Fenster) mit Platte links */
{
  let k = platte(38, 84);
  const fl = (x) => r(VP.x + (x - VP.x) * (AP_H - VP.y) / (AP_V - VP.y));
  /* Becken und Abtropffläche eingelassen */
  k += `<path d="M${fl(42)} ${AP_H + 0.8} L${fl(80)} ${AP_H + 0.8} L80 ${r(AP_V - 1)} L42 ${r(AP_V - 1)} Z" fill="${EDEL_V}"/>`;
  k += `<path d="M${fl(46)} ${AP_H + 1.6} L${fl(64)} ${AP_H + 1.6} L64 ${r(AP_V - 1.8)} L46 ${r(AP_V - 1.8)} Z" fill="${S.lg("becken", [[0, "#7d858b"], [1, "#b9c0c5"]])}"/>`;
  for (let i = 0; i < 6; i++) k += `<line x1="${67 + i * 2}" y1="${r(AP_H + 1.4)}" x2="${67.4 + i * 2}" y2="${r(AP_V - 1.6)}" stroke="#a5adb3" stroke-width=".35"/>`;
  /* Abtropfgestell mit Tellern rechts */
  k += `<path d="M66 ${r(AP_V - 2)} L79 ${r(AP_V - 2)} L79 ${r(AP_V - 5)} L66 ${r(AP_V - 5)} Z" fill="none" stroke="#9aa3aa" stroke-width=".5"/>`;
  for (let i = 0; i < 4; i++) k += `<ellipse cx="${69 + i * 2.6}" cy="${r(AP_V - 7)}" rx="1" ry="5.4" fill="#fbfbfa" stroke="#cfd4d8" stroke-width=".3"/>`;
  k += `<path d="M76 ${r(AP_V - 2)} L77.4 ${r(AP_V - 10)} L79.4 ${r(AP_V - 10)} L78.6 ${r(AP_V - 2)} Z" fill="#e7f0f4" opacity=".8" stroke="#b8c4ca" stroke-width=".3"/>`;
  S.teil({ id: "spuele", de: "die Spüle", syl: "SPÜ-le", it: "il lavello", itSyl: "la-VEL-lo", en: "sink",
    x: 0, y: 0, kunst: k + flaeche(41, r(AP_H - 10), 41, r(AP_V - AP_H + 12)), tipp: "Die Spüle steht unter dem Fenster – so hat man beim Abwaschen Licht." });
}
{
  /* DER WASSERHAHN — hohe Einhebelmischer-Armatur */
  let k = `<rect x="-2.4" y="-2" width="4.8" height="2" rx=".6" fill="${S.lg("arm", [[0, "#f7f9fa"], [0.5, "#9aa3aa"], [1, "#e3e7ea"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M0 -2 L0 -16 Q0 -21 5 -21 Q9 -21 9 -16 L9 -13" stroke="${S.lg("arm2", [[0, "#f7f9fa"], [0.5, "#9aa3aa"], [1, "#e3e7ea"]], 0, 0, 1, 0)}" stroke-width="1.9" fill="none"/>`;
  k += `<path d="M-1 -7 L-5.6 -9.6" stroke="#c3cbd1" stroke-width="1.2" stroke-linecap="round"/>`;
  S.teil({ oben: true, id: "wasserhahn", de: "der Wasserhahn", syl: "WAS-ser-hahn", it: "il rubinetto", itSyl: "ru-bi-NET-to", en: "tap",
    x: 52, y: AP_H + 1, kunst: k + flaeche(-6, -22, 17, 22.6) });
}
{
  /* DAS SPÜLMITTEL neben dem Becken */
  let k = `<path d="M-2.2 0 L2.2 0 L2.2 -7 Q2.2 -8.6 1 -9 L-1 -9 Q-2.2 -8.6 -2.2 -7 Z" fill="${S.lg("spm", [[0, "#9be06a"], [1, "#4fa83a"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-.8" y="-11" width="1.6" height="2.2" rx=".4" fill="#f2f2f2"/><path d="M-1.6 -7.6 L-1.6 -1" stroke="#fff" stroke-width=".4" opacity=".6"/>`;
  S.teil({ oben: true, id: "spuelmittel", de: "das Spülmittel", syl: "SPÜL-mit-tel", it: "il detersivo per i piatti", itSyl: "de-ter-SI-vo per i PIAT-ti", en: "washing-up liquid",
    x: 45, y: AP_H + 3, kunst: k + flaeche(-3, -11.4, 6, 11.8) });
}

/* =====================================================================
   6 — DIE SPÜLMASCHINE (Geschirrspüler, Edelstahl, neben der Spüle)
   ===================================================================== */
{
  const x0 = 84, x1 = 118, W = x1 - x0;
  let k = platte(0, W).replace(/M([\d.]+) /, "M$1 ");
  /* Gerät unter der Platte: Bedienleiste oben, glatte Tür */
  const top = AP_V + 2.4;
  k = "";
  k += `<rect x="${-W / 2 + 0.4}" y="${r(top - FRONT)}" width="${W - 0.8}" height="${r(FRONT - top - 0.4)}" fill="${EDEL}"/>`;
  k += `<rect x="${-W / 2 + 0.4}" y="${r(top - FRONT)}" width="${W - 0.8}" height="5" fill="${S.lg("leiste", [[0, "#3a3f44"], [1, "#22262a"]])}"/>`;
  k += `<rect x="-5" y="${r(top - FRONT + 1)}" width="10" height="3" rx=".4" fill="#0e1317"/><text x="0" y="${r(top - FRONT + 3.3)}" font-size="2.4" text-anchor="middle" fill="#7fe0ff" font-family="monospace">0:58</text>`;
  for (let i = 0; i < 3; i++) k += `<circle cx="${-13 + i * 3}" cy="${r(top - FRONT + 2.5)}" r=".8" fill="#7d868d"/>`;
  k += `<circle cx="11" cy="${r(top - FRONT + 2.5)}" r="1" fill="#5fbf6a"/>`;
  k += `<rect x="${-W / 2 + 3}" y="${r(top - FRONT + 7)}" width="${W - 6}" height="1.6" rx=".8" fill="#9aa3aa"/>`;
  k += `<text x="${-W / 2 + 3}" y="-8" font-size="1.7" fill="#7f878d" font-family="Arial">Eco 50°</text>`;
  k += `<path d="M${-W / 2 + 2} ${r(top - FRONT + 10)} L${-W / 2 + 2} -3" stroke="#fff" stroke-width=".9" opacity=".5"/>`;
  k += `<rect x="${-W / 2 + 0.4}" y="-3" width="${W - 0.8}" height="3" fill="#2b2f33"/>`;
  /* Lichtpunkt auf den Boden („TimeLight“) */
  k += `<ellipse cx="0" cy="2.4" rx="4" ry="1" fill="#ff5a3c" opacity=".6"/>`;
  S.teil({ id: "spuelmaschine", de: "die Spülmaschine", syl: "SPÜL-ma-schi-ne", it: "la lavastoviglie", itSyl: "la-va-sto-VI-glie", en: "dishwasher",
    x: (x0 + x1) / 2, y: FRONT, steht: true, kunst: k, tipp: "Die Spülmaschine heißt auch Geschirrspüler. Sie steht gleich neben der Spüle." });
  S.hinten(platte(x0, x1) + platte(118, 152));
}

/* =====================================================================
   7 — SCHNEIDEBRETT und KÜCHENWAAGE (Arbeitsplatte neben dem Herd)
   ===================================================================== */
{
  /* Holzbrett an den Fliesenspiegel gelehnt, Messer davor */
  let k = `<path d="M-9 0 L9 0 L10.4 -20 Q10.4 -22 8.4 -22 L-7.4 -22 Q-9.4 -22 -9.4 -20 Z" fill="${S.lg("brett", [[0, "#e2bf8c"], [1, "#b98c55"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${-7 + i * 4.6} -20 Q${-6 + i * 4.6} -10 ${-7.4 + i * 4.6} -1" stroke="#a87c48" stroke-width=".35" fill="none"/>`;
  k += `<circle cx="7" cy="-18.4" r="1.2" fill="#8a6237"/>`;
  k += `<path d="M-6 -1 L4 -3.4 L6 -3 L-5 -.2 Z" fill="#dfe3e6"/><rect x="-11" y="-1.4" width="6" height="1.6" rx=".6" fill="#2b2f33" transform="rotate(-12 -8 -.6)"/>`;
  S.teil({ oben: true, id: "schneidebrett", de: "das Schneidebrett", syl: "SCHNEI-de-brett", it: "il tagliere", itSyl: "ta-GLIE-re", en: "chopping board",
    x: 128, y: AP_H + 2.4, kunst: k });
}
{
  /* digitale Küchenwaage aus Glas mit Schüssel Mehl */
  let k = `<path d="M-8 0 L8 0 L9 -1.8 L-9 -1.8 Z" fill="#e9eef1" stroke="#b9c3c9" stroke-width=".3"/><rect x="-3.6" y="-1.4" width="7.2" height="1.2" rx=".3" fill="#14191d"/><text x="0" y="-.4" font-size="1.1" text-anchor="middle" fill="#7fe0ff" font-family="monospace">250 g</text>`;
  k += `<path d="M-6 -1.8 Q-6 -7 0 -7 Q6 -7 6 -1.8 Z" fill="${S.lg("schuessel", [[0, "#ffffff"], [1, "#d7dbde"]], 0, 0, 1, 0)}"/><ellipse cx="0" cy="-6.8" rx="5.4" ry="1.1" fill="#f6f0e4"/>`;
  S.teil({ oben: true, id: "kuechenwaage", de: "die Küchenwaage", syl: "KÜ-chen-waa-ge", it: "la bilancia da cucina", itSyl: "bi-LAN-cia da cu-CI-na", en: "kitchen scales",
    x: 143, y: AP_V - 0.6, kunst: k, tipp: "Mit der Küchenwaage wiegt man Mehl und Zucker ab." });
}

/* =====================================================================
   8 — DER BACKOFEN, 9 — DER HERD (Kochfeld mit Knebeln), TOPF, PFANNE
   ===================================================================== */
{
  const W = HERD.x1 - HERD.x0;
  const top = AP_V + 2.4;
  /* Herdblende mit Knebeln zum Herd; der Backofen ist die Tür darunter */
  let k = `<rect x="${-W / 2 + 0.4}" y="${r(top + 8 - FRONT)}" width="${W - 0.8}" height="${r(FRONT - top - 8 - 5.6)}" fill="${SCHWARZ}"/>`;
  /* Tür mit Glas, Innenlicht, Blech mit Kuchen */
  const ty = top + 11 - FRONT;
  k += `<rect x="${-W / 2 + 3}" y="${r(ty + 4)}" width="${W - 6}" height="${r(FRONT - 5.6 - top - 18)}" rx="1" fill="${S.lg("ofenlicht", [[0, "#ffcf80"], [0.6, "#e08a3a"], [1, "#7a3a14"]])}"/>`;
  k += `<rect x="${-W / 2 + 5}" y="${r(ty + 15)}" width="${W - 10}" height="1" fill="#5a5f63"/>`;
  k += `<path d="M${-W / 2 + 7} ${r(ty + 15)} Q${-W / 2 + 9} ${r(ty + 11)} 0 ${r(ty + 11)} Q${W / 2 - 9} ${r(ty + 11)} ${W / 2 - 7} ${r(ty + 15)} Z" fill="#c07a34"/>`;
  k += `<rect x="${-W / 2 + 3}" y="${r(ty + 4)}" width="${W - 6}" height="${r(FRONT - 5.6 - top - 18)}" rx="1" fill="${S.lg("ofenglas", [[0, "#000", 0.35], [0.5, "#000", 0.15], [1, "#000", 0.45]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${-W / 2 + 4} ${r(ty + 6)} L${-W / 2 + 10} ${r(ty + 6)} L${-W / 2 + 5} ${r(ty + 18)} Z" fill="#fff" opacity=".18"/>`;
  k += `<rect x="${-W / 2 + 3}" y="${r(ty + 1)}" width="${W - 6}" height="1.6" rx=".8" fill="${S.lg("ofengriff", [[0, "#f5f6f7"], [1, "#8d979e"]])}"/>`;
  k += `<rect x="${-W / 2 + 0.4}" y="-5.6" width="${W - 0.8}" height="5.6" fill="#a8a59e"/>`;
  S.teil({ id: "backofen", de: "der Backofen", syl: "BACK-o-fen", it: "il forno", itSyl: "FOR-no", en: "oven",
    x: (HERD.x0 + HERD.x1) / 2, y: FRONT, steht: true, kunst: k, tipp: "Im Backofen backt ein Kuchen bei 180 °C. Durch die Glastür sieht man hinein." });
}
{
  const W = HERD.x1 - HERD.x0, cx = (HERD.x0 + HERD.x1) / 2;
  const fl = (x) => r(VP.x + (x - VP.x) * (AP_H - VP.y) / (AP_V - VP.y));
  /* Kochfeld: schwarze Glaskeramik in der Platte, vier Kochzonen */
  let k = `<path d="M${r(fl(HERD.x0) - cx)} ${r(AP_H - AP_V)} L${r(fl(HERD.x1) - cx)} ${r(AP_H - AP_V)} L${W / 2} 0 L${-W / 2} 0 Z" fill="${EICHE}"/>`;
  k += `<path d="M${r(fl(HERD.x0 + 1.4) - cx)} ${r(AP_H - AP_V + 0.6)} L${r(fl(HERD.x1 - 1.4) - cx)} ${r(AP_H - AP_V + 0.6)} L${W / 2 - 1.4} -.6 L${-W / 2 + 1.4} -.6 Z" fill="${SCHWARZ}"/>`;
  k += `<ellipse cx="7" cy="-1.8" rx="5.6" ry="1" fill="none" stroke="#e0502e" stroke-width=".5"/>`;
  k += `<ellipse cx="-7" cy="-3.2" rx="5" ry=".8" fill="none" stroke="#6b7076" stroke-width=".35"/>`;
  k += `<rect x="${-W / 2}" y="0" width="${W}" height="2.4" fill="${EICHE}"/>`;
  /* Herdblende mit fünf Knebeln und Uhr */
  k += `<rect x="${-W / 2 + 0.4}" y="2.4" width="${W - 0.8}" height="8.6" fill="${EDEL}"/>`;
  for (const x of [-13, -8.4, 8.4, 13]) k += `<circle cx="${x}" cy="6.7" r="1.9" fill="${S.rg("knebel", [[0, "#ffffff"], [0.6, "#c9d0d5"], [1, "#59626a"]], 0.4, 0.35, 0.7)}"/><line x1="${x}" y1="5" x2="${x}" y2="6.4" stroke="#333" stroke-width=".45"/>`;
  k += `<rect x="-4" y="5" width="8" height="3.4" rx=".4" fill="#0e1317"/><text x="0" y="7.6" font-size="2.2" text-anchor="middle" fill="#ff9a3c" font-family="monospace">180°</text>`;
  S.teil({ id: "herd", de: "der Herd", syl: "HERD", it: "il fornello", itSyl: "for-NEL-lo", en: "stove",
    x: cx, y: r(AP_V), kunst: k, tipp: "Der Herd hat ein Kochfeld mit vier Kochzonen. Mit den Knebeln stellt man die Hitze ein." });
}
{
  /* DER TOPF hinten links (dampft) */
  let k = schatten(0, 0, 6, .8, .3);
  k += `<path d="M-5.6 0 L5.6 0 L5.6 -7.4 L-5.6 -7.4 Z" fill="${EDEL}"/><ellipse cx="0" cy="-7.4" rx="5.6" ry="1" fill="#cfd5d9"/>`;
  k += `<path d="M-5.8 -8 L5.8 -8 Q5.8 -10.4 0 -10.6 Q-5.8 -10.4 -5.8 -8 Z" fill="#e7f0f4" opacity=".75" stroke="#9aa3aa" stroke-width=".3"/><rect x="-1.2" y="-11.8" width="2.4" height="1.4" rx=".6" fill="#2b2f33"/>`;
  k += `<rect x="-8" y="-6.4" width="2.6" height="1.2" rx=".5" fill="#2b2f33"/><rect x="5.4" y="-6.4" width="2.6" height="1.2" rx=".5" fill="#2b2f33"/>`;
  k += `<path d="M-2 -12 q-1.6 -3 0 -5 q1.6 -2 0 -4.4 M2 -12 q1.4 -3 0 -5" stroke="#fff" stroke-width=".6" opacity=".55" fill="none"/>`;
  S.teil({ oben: true, id: "topf", de: "der Topf", syl: "TOPF", it: "la pentola", itSyl: "PEN-to-la", en: "pot", x: (HERD.x0 + HERD.x1) / 2 - 7, y: AP_V - 3, kunst: k });
}
{
  /* DIE PFANNE vorne rechts, Stiel nach rechts, Spiegeleier */
  let k = schatten(0, 0, 7, .9, .3);
  k += `<path d="M-6.6 -2.4 L6.6 -2.4 L5.6 0 L-5.6 0 Z" fill="${SCHWARZ}"/><ellipse cx="0" cy="-2.4" rx="6.6" ry="1.4" fill="#2e3236"/>`;
  k += `<ellipse cx="-2" cy="-2.6" rx="2.2" ry=".7" fill="#fff"/><circle cx="-2" cy="-2.7" r=".6" fill="#f2b632"/><ellipse cx="2.4" cy="-2.4" rx="2" ry=".6" fill="#fff"/><circle cx="2.4" cy="-2.5" r=".55" fill="#f2b632"/>`;
  k += `<path d="M6.4 -2 L15 -3.6" stroke="#2b2f33" stroke-width="1.5" stroke-linecap="round"/>`;
  S.teil({ oben: true, id: "pfanne", de: "die Pfanne", syl: "PFAN-ne", it: "la padella", itSyl: "pa-DEL-la", en: "pan", x: (HERD.x0 + HERD.x1) / 2 + 7, y: AP_V - 0.6, kunst: k + flaeche(-7, -5, 22, 5.6) });
}
{
  /* DAS GESCHIRRTUCH am Backofengriff */
  const y = AP_V + 2.4 + 11 + 1;
  let k = `<path d="M-4 0 L4 0 L4.4 13 L-4.4 13 Z" fill="${S.lg("tuch", [[0, "#ffffff"], [1, "#e4e6e8"]], 0, 0, 1, 0)}"/>`;
  for (const yy of [3, 4.4, 10, 11.4]) k += `<rect x="-4.2" y="${yy}" width="8.4" height=".7" fill="#d23b30"/>`;
  k += `<path d="M-4 0 Q0 -1.6 4 0" stroke="#e9eaec" stroke-width="1.4" fill="none"/>`;
  S.teil({ oben: true, id: "geschirrtuch", de: "das Geschirrtuch", syl: "ge-SCHIRR-tuch", it: "lo strofinaccio", itSyl: "stro-fi-NAC-cio", en: "tea towel", x: HERD.x0 + 9, y: r(y), kunst: k });
}

/* =====================================================================
   10 — DIE ARBEITSPLATTE rechts mit den KLEINGERÄTEN (Lupe)
   ===================================================================== */
const AP = { x0: 186, x1: 318 };
const kleinUnter = [];
{
  const cx = (AP.x0 + AP.x1) / 2;
  const fl = (x) => r(VP.x + (x - VP.x) * (AP_H - VP.y) / (AP_V - VP.y));
  const yS = AP_H + 3.2 - AP_V;            /* Standfläche der Geräte (relativ zur Vorderkante) */
  let k = `<path d="M${r(fl(AP.x0) - cx)} ${r(AP_H - AP_V)} L${r(fl(AP.x1) - cx)} ${r(AP_H - AP_V)} L${AP.x1 - cx} 0 L${AP.x0 - cx} 0 Z" fill="${S.lg("eicheoben2", [[0, "#c9a271"], [1, "#e0bf90"]])}"/>`;
  k += `<rect x="${AP.x0 - cx}" y="0" width="${AP.x1 - AP.x0}" height="2.4" fill="${EICHE}"/><rect x="${AP.x0 - cx}" y="0" width="${AP.x1 - AP.x0}" height=".5" fill="#f0d6ae"/>`;
  const U = (id, de, syl, it, itSyl, en, x, f, tipp) => kleinUnter.push(Object.assign({ id, de, syl, it, itSyl, en, x: cx + x, y: AP_V + yS, kunst: f }, tipp ? { tipp } : {}));
  /* Steckdosen am Fliesenspiegel */
  for (const sx of [-50, 4]) {
    k += `<rect x="${sx - 5}" y="${r(yS - 16)}" width="10" height="5" rx=".8" fill="#f8f8f6" stroke="#c9c9c4" stroke-width=".3"/>`;
    for (const d of [-2.5, 2.5]) k += `<circle cx="${sx + d}" cy="${r(yS - 13.5)}" r="1.6" fill="#e6e6e2"/><circle cx="${sx + d - 0.5}" cy="${r(yS - 13.5)}" r=".3" fill="#555"/><circle cx="${sx + d + 0.5}" cy="${r(yS - 13.5)}" r=".3" fill="#555"/>`;
  }
  U("steckdose", "die Steckdose", "STECK-do-se", "la presa", "PRE-sa", "socket", -50, flaeche(-5.4, -16.4, 10.8, 5.8));
  /* KAFFEEMASCHINE (Filter) mit Glaskanne */
  {
    const x = -56;
    k += `<path d="M${x - 6} ${yS} L${x + 6} ${yS} L${x + 6} ${yS - 3} L${x + 3} ${yS - 3} L${x + 3} ${yS - 18} L${x + 6.4} ${yS - 18} L${x + 6.4} ${yS - 21} L${x - 6} ${yS - 21} Z" fill="${SCHWARZ}"/>`;
    k += `<rect x="${x - 6}" y="${yS - 21}" width="12.4" height="1" rx=".4" fill="#4a4f55"/>`;
    k += `<path d="M${x - 4} ${yS - 3} L${x + 2.6} ${yS - 3} L${x + 3} ${yS - 9} Q${x - 0.5} ${yS - 11} ${x - 4.4} ${yS - 9} Z" fill="#e7f0f4" opacity=".6" stroke="#a9b6bd" stroke-width=".3"/>`;
    k += `<path d="M${x - 4} ${yS - 3} L${x + 2.6} ${yS - 3} L${x + 2.8} ${yS - 6.4} L${x - 4.2} ${yS - 6.4} Z" fill="#4a2a16"/>`;
    k += `<path d="M${x - 4.4} ${yS - 8.4} q-2 1 -1.6 3.4" stroke="#2b2f33" stroke-width=".9" fill="none"/>`;
    k += `<rect x="${x - 3.6}" y="${yS - 17}" width="5" height="5.6" fill="#22262a"/><circle cx="${x + 4.6}" cy="${yS - 15}" r=".7" fill="#e0502e"/>`;
    U("kaffeemaschine", "die Kaffeemaschine", "KAF-fee-ma-schi-ne", "la macchina del caffè", "MAC-chi-na del caf-FÈ", "coffee machine", x, flaeche(-6.4, -21.4, 13.2, 21.6), "Die Filterkaffeemaschine kocht Kaffee in die Glaskanne.");
  }
  /* WASSERKOCHER */
  {
    const x = -38;
    k += `<ellipse cx="${x}" cy="${yS - 0.6}" rx="5.4" ry="1" fill="#2b2f33"/>`;
    k += `<path d="M${x - 4.6} ${yS - 1.2} L${x + 4.6} ${yS - 1.2} L${x + 3.6} ${yS - 13} L${x - 3.4} ${yS - 13} Z" fill="${EDEL}"/>`;
    k += `<path d="M${x - 3.4} ${yS - 13} L${x - 5.6} ${yS - 15} L${x - 2} ${yS - 13.6}" fill="#c9ced2"/>`;
    k += `<path d="M${x + 3.4} ${yS - 12} Q${x + 8} ${yS - 11} ${x + 7} ${yS - 6} Q${x + 6.4} ${yS - 3} ${x + 4.2} ${yS - 3}" stroke="#2b2f33" stroke-width="1.5" fill="none"/>`;
    k += `<rect x="${x - 1.2}" y="${yS - 11}" width="2.4" height="6" rx=".8" fill="#7fc3e8" opacity=".85"/><ellipse cx="${x}" cy="${yS - 13}" rx="3.4" ry=".6" fill="#2b2f33"/>`;
    U("wasserkocher", "der Wasserkocher", "WAS-ser-ko-cher", "il bollitore", "bol-li-TO-re", "kettle", x, flaeche(-6, -15, 13.6, 15.2), "Im Wasserkocher kocht Wasser für Tee in drei Minuten.");
  }
  /* TOASTER mit zwei Scheiben */
  {
    const x = -20;
    k += `<path d="M${x - 8} ${yS} L${x + 8} ${yS} L${x + 8} ${yS - 8} Q${x + 8} ${yS - 10} ${x + 6} ${yS - 10} L${x - 6} ${yS - 10} Q${x - 8} ${yS - 10} ${x - 8} ${yS - 8} Z" fill="${S.lg("toaster", [[0, "#e45a4c"], [1, "#a8332a"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${x - 5} ${yS - 10} Q${x - 5} ${yS - 13.4} ${x - 2.4} ${yS - 13.4} Q${x} ${yS - 13.4} ${x} ${yS - 10} Z M${x + 0.6} ${yS - 10} Q${x + 0.6} ${yS - 13} ${x + 3} ${yS - 13} Q${x + 5.4} ${yS - 13} ${x + 5.4} ${yS - 10} Z" fill="#e2b06c"/>`;
    k += `<rect x="${x + 6.6}" y="${yS - 7}" width="2.4" height="1.4" rx=".4" fill="#2b2f33"/><circle cx="${x - 5}" cy="${yS - 3}" r=".9" fill="#f4f4f2"/>`;
    k += `<path d="M${x - 7} ${yS - 8} L${x - 7} ${yS - 1}" stroke="#fff" stroke-width=".7" opacity=".4"/>`;
    U("toaster", "der Toaster", "TOAS-ter", "il tostapane", "to-sta-PA-ne", "toaster", x, flaeche(-8.4, -13.8, 17.6, 14));
  }
  /* MIXER (Standmixer) mit Erdbeer-Smoothie */
  {
    const x = -2;
    k += `<path d="M${x - 4.6} ${yS} L${x + 4.6} ${yS} L${x + 4} ${yS - 6} L${x - 4} ${yS - 6} Z" fill="${SCHWARZ}"/><circle cx="${x}" cy="${yS - 3}" r="1.3" fill="#9aa3aa"/>`;
    k += `<path d="M${x - 3.6} ${yS - 6} L${x + 3.6} ${yS - 6} L${x + 4.6} ${yS - 20} L${x - 4.6} ${yS - 20} Z" fill="#e7f0f4" opacity=".55" stroke="#a9b6bd" stroke-width=".35"/>`;
    k += `<path d="M${x - 3.4} ${yS - 6.4} L${x + 3.4} ${yS - 6.4} L${x + 4} ${yS - 13} L${x - 4} ${yS - 13} Z" fill="#e0607e" opacity=".9"/>`;
    k += `<rect x="${x - 5}" y="${yS - 21.6}" width="10" height="2" rx=".8" fill="#2b2f33"/><path d="M${x + 4.2} ${yS - 18} q2.6 1 2 5 q-.4 2 -1.4 2" stroke="#a9b6bd" stroke-width=".8" fill="none"/>`;
    U("mixer", "der Mixer", "MI-xer", "il frullatore", "frul-la-TO-re", "blender", x, flaeche(-5.2, -21.8, 12, 22));
  }
  /* HEISSLUFTFRITTEUSE mit Schublade */
  {
    const x = 16;
    k += `<path d="M${x - 7.6} ${yS} L${x + 7.6} ${yS} L${x + 7} ${yS - 13} Q${x + 6} ${yS - 17} ${x} ${yS - 17} Q${x - 6} ${yS - 17} ${x - 7} ${yS - 13} Z" fill="${SCHWARZ}"/>`;
    k += `<rect x="${x - 4}" y="${yS - 15.4}" width="8" height="3.6" rx=".6" fill="#0e1317"/><text x="${x}" y="${yS - 12.8}" font-size="2" text-anchor="middle" fill="#ff9a3c" font-family="monospace">200°</text>`;
    k += `<path d="M${x - 6.8} ${yS - 9.6} L${x + 6.8} ${yS - 9.6} L${x + 7.4} ${yS - 1} L${x - 7.4} ${yS - 1} Z" fill="#2b2f33" stroke="#474c51" stroke-width=".35"/>`;
    k += `<rect x="${x - 3}" y="${yS - 6.4}" width="6" height="1.8" rx=".8" fill="#5a6066"/>`;
    k += `<path d="M${x - 5.4} ${yS - 15} Q${x - 6} ${yS - 9} ${x - 6} ${yS - 3}" stroke="#fff" stroke-width=".6" opacity=".25" fill="none"/>`;
    U("fritteuse", "die Heißluftfritteuse", "HEISS-luft-frit-teu-se", "la friggitrice ad aria", "frig-gi-TRI-ce ad A-ria", "air fryer", x, flaeche(-7.8, -17.4, 15.6, 17.6),
      "Die Heißluftfritteuse macht Pommes mit heißer Luft statt mit viel Öl.");
  }
  /* Kabel zu den Steckdosen */
  k += `<path d="M-50 ${r(yS - 11)} C-50 ${r(yS - 4)} -46 ${r(yS - 2)} -50 ${r(yS - 0.5)}" stroke="#2b2f33" stroke-width=".4" fill="none"/><path d="M4 ${r(yS - 11)} C4 ${r(yS - 5)} 9 ${r(yS - 3)} 9 ${r(yS - 0.5)}" stroke="#2b2f33" stroke-width=".4" fill="none"/>`;
  S.teil({ id: "arbeitsplatte", de: "die Arbeitsplatte", syl: "AR-beits-plat-te", it: "il piano di lavoro", itSyl: "PIA-no di la-VO-ro", en: "worktop",
    x: cx, y: AP_V, kunst: k,
    zoom: { x: AP.x0 - 2, y: AP_V + yS - 46, w: 84, h: 56 },
    unter: kleinUnter,
    tipp: "Auf der Arbeitsplatte stehen die Kleingeräte – in der Lupe einzeln." });
}
{
  /* DIE MIKROWELLE in der Ecke rechts */
  const yS = AP_H + 3.2;
  let k = schatten(0, 0, 15, 1, .25);
  k += `<rect x="-14" y="-17" width="28" height="17" rx="1.4" fill="${EDEL}"/>`;
  k += `<rect x="-12" y="-15" width="18" height="13" rx=".8" fill="#14191d"/>`;
  k += `<rect x="-11" y="-14" width="16" height="11" rx=".6" fill="${S.lg("mwin", [[0, "#3a2a1a"], [1, "#1a120a"]])}" opacity=".9"/>`;
  k += `<ellipse cx="-3" cy="-4.6" rx="5" ry="1" fill="#6b5a44"/><path d="M-6 -5 L-6 -8 Q-3 -9.6 0 -8 L0 -5 Z" fill="#f4f2ec"/>`;
  k += `<path d="M-11 -14 L-5 -14 L-11 -6 Z" fill="#fff" opacity=".12"/>`;
  k += `<rect x="7.6" y="-15" width="5" height="3" rx=".4" fill="#0e1317"/><text x="10.1" y="-12.8" font-size="2" text-anchor="middle" fill="#7fe0ff" font-family="monospace">2:00</text>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${8 + (i % 2) * 2.4}" y="${-10.6 + Math.floor(i / 2) * 2.2}" width="1.8" height="1.4" rx=".3" fill="#9aa3aa"/>`;
  k += `<rect x="7.6" y="-3.6" width="5" height="2" rx=".5" fill="#6b747b"/>`;
  S.teil({ id: "mikrowelle", de: "die Mikrowelle", syl: "MI-kro-wel-le", it: "il microonde", itSyl: "mi-cro-ON-de", en: "microwave",
    x: 300, y: yS, steht: true, kunst: k, tipp: "In der Mikrowelle wärmt man Essen in zwei Minuten auf. Kein Metall hineinstellen!" });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/kuechengeraete.js"));
console.log(aus);
