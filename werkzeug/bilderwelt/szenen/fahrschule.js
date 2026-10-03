#!/usr/bin/env node
/* =====================================================================
   DIE FAHRSCHULE (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Raumanforderungen für Lehrräume der Fahrschulen,
   Lehrmittel-Sammlungen, Fahrschul-Ladenlokale) — so sieht eine
   Fahrschule in Deutschland aus:
   - Sie liegt meist in einem Ladenlokal: ein großes SCHAUFENSTER mit
     der Aufschrift „FAHRSCHULE“ (von innen spiegelverkehrt), draußen
     parkt das FAHRSCHULAUTO mit dem DACHSCHILD. Im Auto hat der
     Fahrlehrer auf der Beifahrerseite ein ZWEITES PEDAL (Bremse und
     Kupplung).
   - Der THEORIERAUM: Tische in Reihen, Stühle mit Lehne für jeden
     Fahrschüler, vorne die LEINWAND, der BEAMER steht mit dem LAPTOP
     auf dem Pult des Fahrlehrers.
   - An der Wand eine Tafel mit allen VERKEHRSZEICHEN, eine MAGNETTAFEL
     mit einer Kreuzung („Rechts vor links“), oft eine echte AMPEL als
     Lehrmittel.
   - Die Fahrschüler lernen mit TABLET und Lern-App; vor der Prüfung
     gibt es Übungsbögen.
   Maßstab (eine Augenhöhe, Fluchtpunkt 160/−10):
   Rückwand ≈ 33 Einheiten je Meter, vordere Reihe ≈ 49, draußen ≈ 23.
   Fahrlehrer 1,80 m, Tische 0,75 m, Stuhlsitz 0,45 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "fahrschule", titel: "Die Fahrschule", emoji: "🚗", thema: "Bildung", kuerzel: "b07e", fassung: 852 });
const rnd = zufall(3105);
const r = B.r;

const VP = { x: 160, y: -10 };
const M = (y) => 0.25 * (y - VP.y);
const fx = (X, y) => VP.x + X * M(y);
const WAND_UNTEN = 122;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b2b9bf"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const ANTH = S.lg("anth", [[0, "#4a4f55"], [1, "#2c3035"]]);
const PLATTE = S.lg("tischplatte", [[0, "#e9e2d4"], [1, "#d8cfbd"]]);
const BLAU = "#1f5fa8";

/* =====================================================================
   KULISSE — Wand, Schaufenster mit Blick auf die Straße, Vinylboden
   ===================================================================== */
const FEN = { x0: 6, x1: 114, y0: 30, y1: 112 };
{
  let k = `<rect x="0" y="0" width="320" height="${WAND_UNTEN}" fill="${S.lg("wand", [[0, "#f3f1ec"], [1, "#e5e1d8"]])}"/>`;
  /* blauer Wandstreifen in der Fahrschulfarbe */
  k += `<rect x="0" y="${WAND_UNTEN - 34}" width="320" height="3" fill="${BLAU}" opacity=".85"/>`;
  /* Blick nach draußen: Häuser gegenüber, Straße, Bordstein, Gehweg */
  const X0 = FEN.x0, X1 = FEN.x1, Wf = X1 - X0;
  k += `<rect x="${X0}" y="${FEN.y0}" width="${Wf}" height="${FEN.y1 - FEN.y0}" fill="#cfd6da"/>`;
  const haeuser = [[0, 30, "#e7d3b0"], [30, 34, "#c98f6e"], [64, 44, "#e9e3d6"]];
  for (const [dx, w, f] of haeuser) {
    k += `<rect x="${X0 + dx}" y="${FEN.y0}" width="${w}" height="34" fill="${f}"/>`;
    for (let i = 0; i < Math.floor(w / 9); i++) k += `<rect x="${X0 + dx + 3 + i * 9}" y="${FEN.y0 + 4}" width="5" height="7" fill="#7c98ad"/><rect x="${X0 + dx + 3 + i * 9}" y="${FEN.y0 + 18}" width="5" height="7" fill="#7c98ad"/>`;
  }
  k += `<rect x="${X0 + 34}" y="${FEN.y0 + 24}" width="10" height="10" fill="#5a3f2a"/>`;
  for (let i = 0; i < 5; i++) k += `<circle cx="${X0 + 8 + i * 24}" cy="${FEN.y0 + 30}" r="${4 + (i % 2)}" fill="#6f9a55"/>`;
  k += `<rect x="${X0}" y="${FEN.y0 + 34}" width="${Wf}" height="3" fill="#b9b4aa"/>`;
  k += `<rect x="${X0}" y="${FEN.y0 + 37}" width="${Wf}" height="20" fill="${S.lg("strasse", [[0, "#6d7378"], [1, "#7d8388"]])}"/>`;
  for (let x = X0 + 2; x < X1; x += 14) k += `<rect x="${x}" y="${FEN.y0 + 44}" width="7" height=".9" fill="#f4f4f0"/>`;
  k += `<rect x="${X0}" y="${FEN.y0 + 57}" width="${Wf}" height="2" fill="#c9c4b8"/><rect x="${X0}" y="${FEN.y0 + 59}" width="${Wf}" height="${FEN.y1 - FEN.y0 - 59}" fill="${S.lg("gehweg", [[0, "#bdb7aa"], [1, "#cfc9bc"]])}"/>`;
  for (let x = X0; x < X1; x += 8) k += `<line x1="${x}" y1="${FEN.y0 + 59}" x2="${x - 4}" y2="${FEN.y1}" stroke="#a9a397" stroke-width=".25"/>`;
  /* Fensterrahmen, Sprosse, Fensterbank */
  k += `<rect x="${X0}" y="${FEN.y0}" width="${Wf}" height="${FEN.y1 - FEN.y0}" fill="none" stroke="#5a6067" stroke-width="2.4"/>`;
  k += `<rect x="${X0 + Wf / 2 - 1}" y="${FEN.y0}" width="2" height="${FEN.y1 - FEN.y0}" fill="#5a6067"/>`;
  k += `<rect x="${X0 - 3}" y="${FEN.y1}" width="${Wf + 6}" height="2.4" fill="#d9d4ca"/>`;
  /* Heizkörper rechts neben dem Fenster, Steckdosen */
  k += `<rect x="236" y="${WAND_UNTEN - 16}" width="18" height="12" rx="1" fill="#f6f6f4" stroke="#d6d9dc" stroke-width=".3"/>`;
  S.hinten(k);
}
{
  /* Vinyl-Dielen (Eiche hell, gekalkt) in Fluchtperspektive */
  let f = `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#c4b59c"], [1, "#d6c8af"]])}"/>`;
  for (let X = -8; X <= 8.01; X += 0.22) f += `<line x1="${r(fx(X, WAND_UNTEN))}" y1="${WAND_UNTEN}" x2="${r(fx(X, 200))}" y2="200" stroke="#9c8c72" stroke-width=".2" opacity=".55"/>`;
  for (let i = 0; i < 60; i++) { const X = -8 + Math.floor(rnd() * 72) * 0.22, y = WAND_UNTEN + 2 + rnd() * 74; f += `<line x1="${r(fx(X, y))}" y1="${r(y)}" x2="${r(fx(X + 0.22, y))}" y2="${r(y)}" stroke="#9c8c72" stroke-width=".25" opacity=".5"/>`; }
  /* Tageslicht vom Schaufenster auf dem Boden */
  f += `<path d="M${FEN.x0} ${WAND_UNTEN} L${FEN.x1} ${WAND_UNTEN} L${FEN.x1 + 40} 170 L${FEN.x0 - 10} 170 Z" fill="#fff8e0" opacity=".16"/>`;
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="1" fill="#8a7c64"/>`;
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.12], [0.4, "#000", 0], [1, "#fff", 0.05]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DAS FAHRSCHULAUTO draußen (Beifahrertür offen) — Lupe
   ===================================================================== */
{
  const s = 23.4, gx = 60, gy = 86.6;
  let k = schatten(0, 0, 46, 1.6, .35);
  const P = (x, y) => `${r(x * s)} ${r(y * s)}`;
  /* Radkästen dunkel, Räder */
  for (const x of [-1.32, 1.24]) k += `<circle cx="${r(x * s)}" cy="${r(-0.31 * s)}" r="${r(0.36 * s)}" fill="#1d1f22"/>`;
  /* Karosserie (Kompaktwagen, weiß), Front rechts */
  const body = `M${P(-2.02, -0.22)} L${P(-2.06, -0.62)} Q${P(-2.04, -0.86)} ${P(-1.84, -0.94)} L${P(-1.0, -1.02)} L${P(-0.62, -1.42)} Q${P(-0.5, -1.5)} ${P(-0.3, -1.5)} L${P(0.42, -1.5)} Q${P(0.6, -1.48)} ${P(0.7, -1.4)} L${P(1.12, -0.98)} L${P(1.86, -0.86)} Q${P(2.06, -0.8)} ${P(2.08, -0.6)} L${P(2.06, -0.3)} Q${P(2.04, -0.2)} ${P(1.92, -0.2)} L${P(1.6, -0.2)} A${r(0.4 * s)} ${r(0.4 * s)} 0 1 0 ${P(0.88, -0.2)} L${P(-0.96, -0.2)} A${r(0.4 * s)} ${r(0.4 * s)} 0 1 0 ${P(-1.68, -0.2)} Z`;
  k += `<path d="${body}" fill="${S.lg("lackweiss", [[0, "#ffffff"], [0.55, "#e9eced"], [0.6, "#ffffff"], [1, "#b9c0c4"]])}"/>`;
  /* Fenster */
  k += `<path d="M${P(-0.92, -1.0)} L${P(-0.58, -1.38)} Q${P(-0.48, -1.44)} ${P(-0.34, -1.44)} L${P(0.4, -1.44)} Q${P(0.56, -1.42)} ${P(0.64, -1.36)} L${P(1.02, -0.98)} Z" fill="${S.lg("scheibe", [[0, "#6e8496"], [1, "#2a3a47"]])}"/>`;
  k += `<rect x="${r(0.0 * s)}" y="${r(-1.44 * s)}" width="${r(0.06 * s)}" height="${r(0.46 * s)}" fill="#2c3035"/>`;
  /* Lenkrad (durch die Scheibe zu sehen, auf der Fahrerseite) */
  k += `<ellipse cx="${r(0.62 * s)}" cy="${r(-1.08 * s)}" rx="${r(0.05 * s)}" ry="${r(0.17 * s)}" fill="none" stroke="#1d1f22" stroke-width="${r(0.022 * s)}" opacity=".6"/>`;
  /* Kopfstützen */
  k += `<rect x="${r(-0.34 * s)}" y="${r(-1.32 * s)}" width="${r(0.14 * s)}" height="${r(0.14 * s)}" rx="1" fill="#2c3035"/>`;
  /* offene Beifahrertür: der Fußraum mit dem zweiten Pedal ist zu sehen */
  k += `<path d="M${P(0.04, -0.98)} L${P(1.04, -0.98)} L${P(1.0, -0.26)} L${P(0.08, -0.26)} Z" fill="#2c3035"/>`;
  k += `<path d="M${P(0.12, -0.96)} L${P(0.98, -0.96)} L${P(0.96, -0.72)} L${P(0.14, -0.7)} Z" fill="#3e444a"/>`;
  k += `<path d="M${P(0.18, -0.7)} L${P(0.5, -0.74)} L${P(0.56, -0.5)} L${P(0.22, -0.46)} Z" fill="#4a4f55"/>`;
  k += `<rect x="${r(0.7 * s)}" y="${r(-0.56 * s)}" width="${r(0.09 * s)}" height="${r(0.05 * s)}" fill="#9aa3aa"/><line x1="${r(0.745 * s)}" y1="${r(-0.6 * s)}" x2="${r(0.76 * s)}" y2="${r(-0.82 * s)}" stroke="#9aa3aa" stroke-width=".5"/>`;
  k += `<rect x="${r(0.84 * s)}" y="${r(-0.5 * s)}" width="${r(0.09 * s)}" height="${r(0.05 * s)}" fill="#9aa3aa"/><line x1="${r(0.885 * s)}" y1="${r(-0.54 * s)}" x2="${r(0.9 * s)}" y2="${r(-0.78 * s)}" stroke="#9aa3aa" stroke-width=".5"/>`;
  k += `<path d="M${P(1.04, -0.98)} L${P(1.36, -1.12)} L${P(1.32, -0.18)} L${P(1.0, -0.26)} Z" fill="${S.lg("tuer", [[0, "#f4f6f6"], [1, "#c9cfd4"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${P(1.06, -0.96)} L${P(1.34, -1.08)} L${P(1.34, -0.74)} L${P(1.06, -0.66)} Z" fill="#8aa0b0" opacity=".7"/>`;
  /* Linien, Griffe, Lichter, Spiegel */
  k += `<path d="M${P(-1.0, -1.0)} L${P(0.04, -0.98)} M${P(-0.98, -0.98)} L${P(-0.98, -0.3)} M${P(0.04, -0.98)} L${P(0.08, -0.26)}" stroke="#9aa3aa" stroke-width=".35" fill="none"/>`;
  k += `<rect x="${r(-0.5 * s)}" y="${r(-0.86 * s)}" width="${r(0.16 * s)}" height="${r(0.04 * s)}" fill="#9aa3aa"/>`;
  k += `<path d="M${P(1.94, -0.84)} L${P(2.07, -0.7)} L${P(1.86, -0.7)} Z" fill="#fff6c8" stroke="#9aa3aa" stroke-width=".2"/><path d="M${P(-2.04, -0.8)} L${P(-1.9, -0.86)} L${P(-1.9, -0.66)} L${P(-2.05, -0.66)} Z" fill="#d0281f"/>`;
  k += `<path d="M${P(1.08, -1.0)} L${P(1.22, -1.08)} L${P(1.24, -0.96)} L${P(1.1, -0.94)} Z" fill="#2c3035"/>`;
  /* Aufschrift auf der Seite */
  k += `<text x="${r(-0.22 * s)}" y="${r(-0.48 * s)}" font-size="${r(0.16 * s)}" text-anchor="middle" fill="${BLAU}" font-family="Arial" font-weight="bold">Fahrschule Müller</text>`;
  k += `<rect x="${r(-1.9 * s)}" y="${r(-0.36 * s)}" width="${r(3.9 * s)}" height="${r(0.05 * s)}" fill="${BLAU}"/>`;
  /* Räder mit Felgen */
  for (const x of [-1.32, 1.24]) {
    k += `<circle cx="${r(x * s)}" cy="${r(-0.31 * s)}" r="${r(0.31 * s)}" fill="#1d1f22"/><circle cx="${r(x * s)}" cy="${r(-0.31 * s)}" r="${r(0.19 * s)}" fill="${S.rg("felge", [[0, "#f4f6f7"], [1, "#9aa3aa"]])}"/><circle cx="${r(x * s)}" cy="${r(-0.31 * s)}" r="${r(0.05 * s)}" fill="#59616a"/>`;
  }
  /* DACHSCHILD: gelbes Dreieck-Schild „FAHRSCHULE“ */
  k += `<rect x="${r(-0.24 * s)}" y="${r(-1.56 * s)}" width="${r(0.48 * s)}" height="${r(0.06 * s)}" fill="#2c3035"/>`;
  k += `<path d="M${P(-0.42, -1.56)} L${P(0.42, -1.56)} L${P(0.32, -1.84)} L${P(-0.32, -1.84)} Z" fill="${S.lg("dachschild", [[0, "#ffe36a"], [1, "#e5b912"]])}" stroke="#a07f0c" stroke-width=".25"/>`;
  k += `<text x="0" y="${r(-1.64 * s)}" font-size="${r(0.12 * s)}" text-anchor="middle" fill="#1d1f22" font-family="Arial" font-weight="bold">FAHRSCHULE</text>`;
  const U = (id, de, syl, it, itSyl, en, x, y, w, h, tipp) => ({ id, de, syl, it, itSyl, en, x: gx + x * s, y: gy + y * s, kunst: flaeche(-w / 2, -h, w, h), tipp });
  S.teil({ id: "fs_auto", de: "das Fahrschulauto", syl: "FAHR-schul-au-to", it: "l'auto scuola", itSyl: "AU-to SCUO-la", en: "driving school car", x: gx, y: gy, steht: true, kunst: k,
    zoom: { x: gx - 20, y: gy - 47, w: 60, h: 40 },
    unter: [
      U("fs_dachschild", "das Dachschild", "DACH-schild", "il cartello sul tetto", "car-TEL-lo sul TET-to", "roof sign", 0, -1.54, 22, 8, "Das Schild auf dem Dach zeigt allen: Hier lernt jemand fahren."),
      U("fs_pedale", "das zweite Pedal", "ZWEI-te PE-dal", "il doppio pedale", "DOP-pio pe-DA-le", "dual controls", 0.81, -0.46, 7, 8, "Damit kann der Fahrlehrer bremsen und kuppeln — auch wenn man selbst gerade nichts tut."),
      U("fs_lenkrad", "das Lenkrad", "LENK-rad", "il volante", "vo-LAN-te", "steering wheel", 0.62, -0.9, 5, 8, null),
      U("fs_spiegel", "der Außenspiegel", "AU-ßen-spie-gel", "lo specchietto", "spec-CHIET-to", "wing mirror", 1.16, -0.92, 5, 5, null),
      U("fs_sitz", "der Beifahrersitz", "BEI-fah-rer-sitz", "il sedile del passeggero", "se-DI-le del pas-seg-GE-ro", "passenger seat", 0.36, -0.46, 8, 7, "Hier sitzt der Fahrlehrer — rechts neben dem Fahrschüler."),
    ],
    tipp: "Man erkennt es am Schild auf dem Dach — und daran, dass es ganz langsam fährt." });
}

/* =====================================================================
   2 — DAS SCHAUFENSTER (Glas mit spiegelverkehrter Aufschrift)
   ===================================================================== */
{
  const Wf = FEN.x1 - FEN.x0, cx = (FEN.x0 + FEN.x1) / 2;
  let k = `<path d="M${-Wf / 2} ${FEN.y0 - FEN.y1} L${-Wf / 2 + 30} ${FEN.y0 - FEN.y1} L${-Wf / 2} -30 Z" fill="#fff" opacity=".16"/>`;
  k += `<path d="M${Wf / 2 - 34} 0 L${Wf / 2 - 10} ${FEN.y0 - FEN.y1} L${Wf / 2 - 2} ${FEN.y0 - FEN.y1} L${Wf / 2 - 26} 0 Z" fill="#fff" opacity=".12"/>`;
  /* Folienschrift von innen: spiegelverkehrt */
  k += `<g transform="translate(0 -14) scale(-1 1)"><text x="0" y="0" font-size="7.4" text-anchor="middle" fill="${BLAU}" font-family="Arial" font-weight="bold" letter-spacing=".8">FAHRSCHULE</text><text x="0" y="5" font-size="3.2" text-anchor="middle" fill="${BLAU}" font-family="Arial" letter-spacing=".4">Klasse B · BE · A · AM</text></g>`;
  k += `<rect x="${-Wf / 2}" y="-6" width="${Wf}" height="1.2" fill="${BLAU}" opacity=".8"/>`;
  k += flaeche(-Wf / 2, FEN.y0 - FEN.y1, Wf, FEN.y1 - FEN.y0);
  S.teil({ id: "fs_schaufenster", de: "das Schaufenster", syl: "SCHAU-fens-ter", it: "la vetrina", itSyl: "ve-TRI-na", en: "shop window", x: cx, y: FEN.y1, kunst: k,
    tipp: "Von innen liest man die Schrift im Schaufenster spiegelverkehrt." });
}

/* =====================================================================
   3 — DIE AMPEL (echte Verkehrsampel als Lehrmittel)
   ===================================================================== */
{
  let k = `<rect x="-1" y="-30" width="2" height="4" fill="#59616a"/>`;
  k += `<rect x="-5" y="-27" width="10" height="27" rx="2" fill="${ANTH}"/>`;
  for (const [y, an, aus] of [[-21.6, "#ff4b3a", "#5a1e18"], [-13.5, "#ffb12a", "#5a4114"], [-5.4, "#3fd06a", "#174a26"]]) {
    k += `<path d="M-4.6 ${y - 4.6} L4.6 ${y - 4.6} L4.6 ${y - 3}" stroke="#2c3035" stroke-width="1" fill="none"/>`;
    k += `<circle cx="0" cy="${y}" r="3.2" fill="${y === -21.6 ? S.rg("rotlicht", [[0, "#ffd0c4"], [0.4, an], [1, "#a3150c"]]) : aus}"/>`;
  }
  k += `<circle cx="0" cy="-21.6" r="7" fill="#ff4b3a" opacity=".12"/>`;
  S.teil({ id: "fs_ampel", de: "die Ampel", syl: "AM-pel", it: "il semaforo", itSyl: "se-MA-fo-ro", en: "traffic light", x: 125, y: 62, kunst: k,
    tipp: "Rot heißt: Stehen bleiben! Gelb heißt: Auf das nächste Zeichen warten." });
}

/* =====================================================================
   4 — DIE LEINWAND mit einer Kreuzung („Wer fährt zuerst?“)
   ===================================================================== */
const LW = { x0: 136, x1: 234, y0: 22, y1: 82 };
{
  const W = LW.x1 - LW.x0, H = LW.y1 - LW.y0, cx = (LW.x0 + LW.x1) / 2;
  let k = `<rect x="${-W / 2 - 3}" y="${-H - 4}" width="${W + 6}" height="4" rx="1.6" fill="#e9eaea" stroke="#c9cdd0" stroke-width=".3"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="#fbfbfa"/>`;
  k += `<rect x="${-W / 2}" y="-1.6" width="${W}" height="1.6" fill="#2c3035"/>`;
  /* Projektion: Kreuzung von oben */
  const pr = { x: -W / 2 + 4, y: -H + 4, w: W - 8, h: H - 10 };
  k += `<rect x="${pr.x}" y="${pr.y}" width="${pr.w}" height="${pr.h}" fill="${S.lg("projgras", [[0, "#9cc97a"], [1, "#86b866"]])}"/>`;
  const mx = pr.x + pr.w * 0.42, my = pr.y + pr.h * 0.55;
  k += `<rect x="${pr.x}" y="${r(my - 7)}" width="${pr.w}" height="14" fill="#7d8388"/><rect x="${r(mx - 7)}" y="${pr.y}" width="14" height="${pr.h}" fill="#7d8388"/>`;
  k += `<line x1="${pr.x}" y1="${my}" x2="${r(mx - 7)}" y2="${my}" stroke="#fff" stroke-width=".5" stroke-dasharray="2 1.6"/><line x1="${r(mx + 7)}" y1="${my}" x2="${pr.x + pr.w}" y2="${my}" stroke="#fff" stroke-width=".5" stroke-dasharray="2 1.6"/>`;
  k += `<line x1="${mx}" y1="${pr.y}" x2="${mx}" y2="${r(my - 7)}" stroke="#fff" stroke-width=".5" stroke-dasharray="2 1.6"/><line x1="${mx}" y1="${r(my + 7)}" x2="${mx}" y2="${pr.y + pr.h}" stroke="#fff" stroke-width=".5" stroke-dasharray="2 1.6"/>`;
  /* Autos: Rot von unten, Blau von rechts, ein Radfahrer */
  k += `<rect x="${r(mx + 1.4)}" y="${r(my + 10)}" width="4.6" height="8" rx="1.2" fill="#c0392b"/><rect x="${r(mx + 2)}" y="${r(my + 11.4)}" width="3.4" height="2" fill="#2c3035" opacity=".6"/>`;
  k += `<rect x="${r(mx + 11)}" y="${r(my - 5.8)}" width="8" height="4.6" rx="1.2" fill="#2a6db3"/><rect x="${r(mx + 12.2)}" y="${r(my - 5.2)}" width="2" height="3.4" fill="#2c3035" opacity=".6"/>`;
  k += `<path d="M${r(mx - 13)} ${r(my + 3)} l4 0" stroke="#2c3035" stroke-width="1.4" stroke-linecap="round"/><circle cx="${r(mx - 11)}" cy="${r(my + 3)}" r="1" fill="#e5b912"/>`;
  k += `<path d="M${r(mx + 3.7)} ${r(my + 9)} l0 -6 M${r(mx + 3.7)} ${r(my + 3)} l-1.4 1.6 M${r(mx + 3.7)} ${r(my + 3)} l1.4 1.6" stroke="#fff" stroke-width=".7" fill="none"/>`;
  /* Frage und Antwortkästchen */
  k += `<rect x="${pr.x + pr.w - 34}" y="${pr.y + 2}" width="32" height="18" rx="1" fill="#fff" opacity=".93"/>`;
  k += `<text x="${pr.x + pr.w - 18}" y="${pr.y + 7}" font-size="3" text-anchor="middle" fill="#1d1f22" font-family="Arial" font-weight="bold">Wer fährt zuerst?</text>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${pr.x + pr.w - 32}" y="${pr.y + 9 + i * 3.6}" width="2.4" height="2.4" fill="none" stroke="#1d1f22" stroke-width=".3"/><text x="${pr.x + pr.w - 28.6}" y="${pr.y + 11 + i * 3.6}" font-size="2.2" fill="#1d1f22" font-family="Arial">${["das rote Auto", "das blaue Auto", "das Fahrrad"][i]}</text>`;
  k += `<path d="M${pr.x + pr.w - 31.6} ${pr.y + 14.2} l.8 .9 l1.4 -1.8" stroke="#2f8f5b" stroke-width=".5" fill="none"/>`;
  k += `<rect x="${pr.x}" y="${pr.y + pr.h - 3}" width="${pr.w}" height="3" fill="${BLAU}"/><text x="${pr.x + 2}" y="${pr.y + pr.h - 0.8}" font-size="2" fill="#fff" font-family="Arial">Lektion 3 · Vorfahrt — Frage 7 von 30</text>`;
  /* Lichtschein des Beamers */
  k += `<rect x="${pr.x}" y="${pr.y}" width="${pr.w}" height="${pr.h}" fill="${S.rg("beamlicht", [[0, "#fff", 0.18], [1, "#fff", 0]])}"/>`;
  S.teil({ id: "fs_leinwand", de: "die Leinwand", syl: "LEIN-wand", it: "lo schermo", itSyl: "SCHER-mo", en: "projection screen", x: cx, y: LW.y1, kunst: k,
    tipp: "Auf der Leinwand: Das blaue Auto kommt von rechts. Es darf zuerst fahren — rechts vor links!" });
}

/* =====================================================================
   5 — DAS SCHILD „Theorieraum“, DIE VERKEHRSZEICHEN (Lupe), DIE TAFEL
   ===================================================================== */
{
  let k = `<rect x="-20" y="-5" width="40" height="10" rx="1" fill="${BLAU}"/><text x="0" y="1.1" font-size="4.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Theorieraum</text>`;
  k += `<text x="0" y="3.9" font-size="1.9" text-anchor="middle" fill="#cfe0f5" font-family="Arial">Unterricht Mo + Mi 18.30 Uhr</text>`;
  S.teil({ id: "fs_theorieraum", de: "der Theorieraum", syl: "Theo-RIE-raum", it: "l'aula di teoria", itSyl: "AU-la di teo-RI-a", en: "theory room", x: 283, y: 11, kunst: k,
    tipp: "Vierzehn Doppelstunden Theorie muss man belegen — mehr, wenn man noch keinen Führerschein hat." });
}
const VZ = { x0: 252, x1: 314, y0: 20, y1: 70 };
{
  const W = VZ.x1 - VZ.x0, H = VZ.y1 - VZ.y0, cx = (VZ.x0 + VZ.x1) / 2;
  let k = `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" rx=".6" fill="#ffffff" stroke="#c9cdd0" stroke-width=".4"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="5" fill="${BLAU}"/><text x="0" y="${-H + 3.6}" font-size="3" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">VERKEHRSZEICHEN</text>`;
  const zelle = (i) => ({ x: -W / 2 + 10.5 + (i % 3) * 20.5, y: -H + 13 + Math.floor(i / 3) * 15.5 });
  const unter = [];
  const zeichen = [
    ["fs_stopp", "das Stoppschild", "STOPP-schild", "il segnale di stop", "se-GNA-le di STOP", "stop sign", (x, y) => { let g = ""; const p = []; for (let i = 0; i < 8; i++) { const a = (i + 0.5) * Math.PI / 4; p.push(`${r(x + Math.cos(a) * 5.4)} ${r(y + Math.sin(a) * 5.4)}`); } g += `<path d="M${p.join(" L")} Z" fill="#c62f25" stroke="#fff" stroke-width=".5"/><text x="${x}" y="${y + 1.3}" font-size="3.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">STOP</text>`; return g; }, "Am Stoppschild muss man immer ganz anhalten — auch wenn niemand kommt."],
    ["fs_vorfahrtsstrasse", "die Vorfahrtsstraße", "VOR-fahrts-stra-ße", "la strada con diritto di precedenza", "STRA-da con di-RIT-to di pre-ce-DEN-za", "priority road", (x, y) => `<path d="M${x} ${y - 5.6} L${x + 5.6} ${y} L${x} ${y + 5.6} L${x - 5.6} ${y} Z" fill="#fff" stroke="#9aa3aa" stroke-width=".3"/><path d="M${x} ${y - 3.6} L${x + 3.6} ${y} L${x} ${y + 3.6} L${x - 3.6} ${y} Z" fill="#f2c200"/>`, "Auf der Vorfahrtsstraße darf man zuerst fahren."],
    ["fs_vorfahrtgewaehren", "Vorfahrt gewähren", "VOR-fahrt ge-WÄH-ren", "dare la precedenza", "DA-re la pre-ce-DEN-za", "give way", (x, y) => `<path d="M${x - 6} ${y - 4.6} L${x + 6} ${y - 4.6} L${x} ${y + 5.6} Z" fill="#c62f25"/><path d="M${x - 3.6} ${y - 3.2} L${x + 3.6} ${y - 3.2} L${x} ${y + 3} Z" fill="#fff"/>`, "Das Dreieck mit der Spitze nach unten: Hier muss man warten."],
    ["fs_tempo", "das Tempolimit", "TEM-po-li-mit", "il limite di velocità", "LI-mi-te di ve-lo-ci-TÀ", "speed limit", (x, y) => `<circle cx="${x}" cy="${y}" r="5.6" fill="#fff" stroke="#c62f25" stroke-width="1.3"/><text x="${x}" y="${y + 1.6}" font-size="4.6" text-anchor="middle" fill="#1d1f22" font-family="Arial" font-weight="bold">30</text>`, "In der Stadt fährt man höchstens 50, in vielen Straßen nur 30."],
    ["fs_zebrastreifen", "der Fußgängerüberweg", "FUSS-gän-ger-ü-ber-weg", "le strisce pedonali", "STRI-sce pe-do-NA-li", "pedestrian crossing", (x, y) => `<rect x="${x - 5.4}" y="${y - 5.4}" width="10.8" height="10.8" rx=".6" fill="#2a6db3"/><path d="M${x} ${y - 4.2} L${x + 4.4} ${y + 3.6} L${x - 4.4} ${y + 3.6} Z" fill="#fff"/><circle cx="${x - 0.3}" cy="${y - 1}" r=".6" fill="#1d1f22"/><path d="M${x - 0.3} ${y - 0.4} l-.8 2 l1.4 .2 M${x - 0.2} ${y + 0.4} l1 1.6" stroke="#1d1f22" stroke-width=".5" fill="none"/><path d="M${x - 3} ${y + 3} h6" stroke="#1d1f22" stroke-width=".4" stroke-dasharray=".7 .5"/>`, "Am Zebrastreifen haben Fußgänger Vorrang."],
    ["fs_einbahn", "die Einbahnstraße", "EIN-bahn-stra-ße", "il senso unico", "SEN-so U-ni-co", "one-way street", (x, y) => `<rect x="${x - 7}" y="${y - 2.8}" width="14" height="5.6" rx=".5" fill="#2a6db3"/><path d="M${x - 5.4} ${y - 0.6} L${x + 2} ${y - 0.6} L${x + 2} ${y - 2} L${x + 5.4} ${y} L${x + 2} ${y + 2} L${x + 2} ${y + 0.6} L${x - 5.4} ${y + 0.6} Z" fill="#fff"/>`, "In die Einbahnstraße darf man nur in eine Richtung fahren."],
    ["fs_halteverbot", "das Halteverbot", "HAL-te-ver-bot", "il divieto di fermata", "di-VIE-to di fer-MA-ta", "no stopping", (x, y) => `<circle cx="${x}" cy="${y}" r="5.6" fill="#2a6db3" stroke="#c62f25" stroke-width="1.3"/><path d="M${x - 3.6} ${y - 3.6} L${x + 3.6} ${y + 3.6} M${x + 3.6} ${y - 3.6} L${x - 3.6} ${y + 3.6}" stroke="#c62f25" stroke-width="1.2"/>`, null],
    [null, null, null, null, null, null, (x, y) => `<path d="M${x - 6} ${y + 4.6} L${x + 6} ${y + 4.6} L${x} ${y - 5.6} Z" fill="#fff" stroke="#c62f25" stroke-width="1.1" stroke-linejoin="round"/><circle cx="${x - 1}" cy="${y - 0.6}" r=".7" fill="#1d1f22"/><circle cx="${x + 1.4}" cy="${y}" r=".6" fill="#1d1f22"/><path d="M${x - 1} ${y} l-.6 2.6 M${x + 1.4} ${y + 0.6} l.4 2" stroke="#1d1f22" stroke-width=".6"/>`],
    [null, null, null, null, null, null, (x, y) => `<rect x="${x - 5.4}" y="${y - 5.4}" width="10.8" height="10.8" rx=".6" fill="#2a6db3"/><text x="${x}" y="${y + 3}" font-size="8" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">P</text>`],
  ];
  zeichen.forEach(([id, de, syl, it, itSyl, en, mal, tipp], i) => {
    const z = zelle(i);
    k += mal(z.x, z.y);
    if (id) unter.push({ id, de, syl, it, itSyl, en, x: cx + z.x, y: VZ.y1 + z.y + 7, kunst: flaeche(-8, -14, 16, 14.6), tipp: tipp || undefined });
  });
  S.teil({ id: "fs_zeichen", de: "das Verkehrszeichen", syl: "Ver-KEHRS-zei-chen", it: "il segnale stradale", itSyl: "se-GNA-le stra-DA-le", en: "road sign", x: cx, y: VZ.y1, kunst: k,
    zoom: { x: VZ.x0 - 2, y: VZ.y0 - 1, w: W + 4, h: 44 },
    unter,
    tipp: "Die Zeichen muss man im Schlaf können — in der Prüfung sind sie die Hälfte der Fragen." });
}
{
  /* Magnettafel mit einer Kreuzung und Magnet-Autos */
  let k = `<rect x="-27" y="-36" width="54" height="36" rx="1" fill="#9aa0a6"/><rect x="-26" y="-35" width="52" height="34" fill="#f8f9f8"/>`;
  k += `<rect x="-26" y="-22" width="52" height="9" fill="#bfc4c8"/><rect x="-5" y="-35" width="10" height="34" fill="#bfc4c8"/>`;
  k += `<line x1="-26" y1="-17.5" x2="-5" y2="-17.5" stroke="#fff" stroke-width=".5" stroke-dasharray="1.6 1.2"/><line x1="5" y1="-17.5" x2="26" y2="-17.5" stroke="#fff" stroke-width=".5" stroke-dasharray="1.6 1.2"/>`;
  k += `<rect x="-14" y="-21" width="6" height="3.2" rx=".8" fill="#2f8f5b"/><rect x="1" y="-8" width="3.2" height="5.6" rx=".8" fill="#e5b912"/><rect x="12" y="-16.8" width="6" height="3.2" rx=".8" fill="#c0392b"/>`;
  k += `<path d="M-8 -19.4 Q-2 -19.6 -1.6 -26" stroke="${BLAU}" stroke-width=".7" fill="none"/><path d="M-1.6 -26 l-1 1.6 M-1.6 -26 l1 1.6" stroke="${BLAU}" stroke-width=".7"/>`;
  k += `<text x="-24" y="-29" font-size="3.2" fill="#c0392b" font-family="'Comic Sans MS','Segoe Print',cursive" font-weight="bold">Rechts vor links!</text>`;
  k += `<rect x="-26" y="-1.4" width="52" height="1.4" fill="#9aa0a6"/>`;
  S.teil({ id: "fs_tafel", de: "die Tafel", syl: "TA-fel", it: "la lavagna", itSyl: "la-VA-gna", en: "board", x: 288, y: 110, kunst: k,
    tipp: "„Rechts vor links“ — der Satz, den jeder zuerst lernt." });
}

/* =====================================================================
   6 — DAS PULT mit LAPTOP und BEAMER; DER FAHRLEHRER
   ===================================================================== */
const PU = { x: 286, y: 146 };
{
  const s = M(PU.y), h = 0.75 * s, W = 0.9 * s;
  let k = schatten(0, 0, W / 2 + 3, 1.6, .3);
  k += `<path d="M${r(-W / 2 - 1)} ${r(-h - 4)} L${r(W / 2 + 1)} ${r(-h - 4)} L${r(W / 2 + 1)} ${r(-h)} L${r(-W / 2 - 1)} ${r(-h)} Z" fill="${PLATTE}"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-h)}" width="${r(W)}" height="${r(h - 1)}" fill="${S.lg("pult", [[0, "#2f6fb3"], [1, BLAU]])}"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-h)}" width="${r(W)}" height="1.6" fill="#fff" opacity=".25"/>`;
  k += `<text x="0" y="${r(-h / 2 + 2)}" font-size="3.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">FAHRSCHULE</text>`;
  k += `<rect x="${r(-W / 2)}" y="-1.4" width="${r(W)}" height="1.4" fill="#173d70"/>`;
  S.teil({ id: "fs_pult", de: "das Pult", syl: "PULT", it: "la cattedra", itSyl: "CAT-te-dra", en: "lectern desk", x: PU.x, y: PU.y, steht: true, kunst: k });
}
{
  const s = M(PU.y), top = PU.y - 0.75 * s - 2;
  /* Laptop (aufgeklappt, zeigt dieselbe Folie) */
  let k = `<path d="M-8 0 L8 0 L7 -1.4 L-7 -1.4 Z" fill="#9aa0a6"/><path d="M-7 -1.4 L-7.6 -11 L7.6 -11 L7 -1.4 Z" fill="#2c3035"/><path d="M-6.2 -2.4 L-6.7 -10 L6.7 -10 L6.2 -2.4 Z" fill="#86b866"/><rect x="-1.2" y="-10" width="2.4" height="7.6" fill="#7d8388"/><rect x="-6.6" y="-7" width="13" height="2.2" fill="#7d8388"/>`;
  S.teil({ oben: true, id: "fs_laptop", de: "der Laptop", syl: "LEP-top", it: "il portatile", itSyl: "por-TA-ti-le", en: "laptop", x: PU.x - 6, y: top, steht: true, kunst: k });
}
{
  const s = M(PU.y), top = PU.y - 0.75 * s - 2;
  let k = schatten(0, 0, 5, .5, .25);
  k += `<rect x="-5" y="-4.2" width="10" height="4.2" rx="1" fill="${S.lg("beamer", [[0, "#ffffff"], [1, "#c9cdd0"]])}"/><circle cx="-2.6" cy="-2.1" r="1.6" fill="#2c3035"/><circle cx="-2.6" cy="-2.1" r=".8" fill="#6fa8dc"/><rect x="1" y="-3.2" width="3" height=".6" fill="#9aa0a6"/>`;
  S.teil({ oben: true, id: "fs_beamer", de: "der Beamer", syl: "BIE-mer", it: "il proiettore", itSyl: "pro-iet-TO-re", en: "projector", x: PU.x + 9, y: top, steht: true, kunst: k,
    tipp: "„Beamer“ sagt man nur im Deutschen — auf Englisch heißt er „projector“." });
  /* Lichtstrahl zum Bild (nur Bild, fängt nichts) */
  S.davor(`<path d="M${PU.x + 6.4} ${r(top - 2.1)} L${LW.x0 + 4} ${LW.y0 + 4} L${LW.x1 - 4} ${LW.y1 - 6} Z" fill="#fff" opacity=".05"/>`);
}
{
  const y = 140, s = M(y);
  const m = B.mensch({ id: "fs_lehrer", geschlecht: "m", pose: "zeigen", blick: -66, frisur: "kurz", haarfarbe: "grau", haut: "hell", bart: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "weste", farbe: BLAU }, unterteil: { stueck: "jeans", farbe: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.8 * s);
  S.teil({ id: "fs_fahrlehrer", de: "der Fahrlehrer", syl: "FAHR-leh-rer", it: "l'istruttore", itSyl: "i-strut-TO-re", en: "driving instructor", x: 247, y, kunst: m.svg,
    tipp: "Er sitzt bei der Fahrstunde rechts — und hat ein zweites Pedal." });
}

/* =====================================================================
   7 — DIE TISCHE in zwei Reihen
   ===================================================================== */
const T2 = { x0: 14, x1: 108, y: 148 };   /* hintere Reihe (leer) */
const T1 = { x0: 92, x1: 238, y: 172 };   /* vordere Reihe */
function tisch(T) {
  const s = M(T.y), h = 0.75 * s, W = T.x1 - T.x0, tiefe = 0.6 * s * 0.3;
  let k = schatten(0, 0, W / 2 + 3, 1.6, .25);
  for (const x of [-W / 2 + 3, W / 2 - 3]) k += `<rect x="${r(x - 1)}" y="${r(-h + 2)}" width="2" height="${r(h - 2)}" fill="${ANTH}"/><rect x="${r(x - 1.4)}" y="${r(-h - tiefe + 2)}" width="2.8" height="1.2" fill="#3a3f44"/>`;
  k += `<rect x="${r(-W / 2 + 3)}" y="${r(-h + 3)}" width="${r(W - 6)}" height="5" fill="#d6d9dc"/>`;
  k += `<path d="M${r(-W / 2)} ${r(-h)} L${r(W / 2)} ${r(-h)} L${r(W / 2 - 1.6)} ${r(-h - tiefe)} L${r(-W / 2 + 1.6)} ${r(-h - tiefe)} Z" fill="${PLATTE}"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-h)}" width="${r(W)}" height="1.8" fill="#bfb49f"/>`;
  return k;
}
S.teil({ id: "fs_tisch2", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: (T2.x0 + T2.x1) / 2, y: T2.y, steht: true, kunst: tisch(T2) });
{
  /* auf dem hinteren Tisch: das Lehrbuch (nur Bild) */
  const s = M(T2.y), top = T2.y - 0.75 * s - 1.4;
  S.teil({ oben: true, id: "fs_lehrbuch", de: "das Lehrbuch", syl: "LEHR-buch", it: "il libro di testo", itSyl: "LI-bro di TE-sto", en: "textbook", x: 52, y: top, steht: true,
    kunst: `<path d="M-6 0 L6 0 L5.4 -2.6 L-5.4 -2.6 Z" fill="${BLAU}"/><path d="M-5.4 -2.6 L5.4 -2.6 L5.2 -3.2 L-5.2 -3.2 Z" fill="#fff"/><text x="0" y="-.7" font-size="1.5" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Klasse B</text>` + flaeche(-6.4, -5, 12.8, 5.4),
    tipp: "Im Lehrbuch stehen alle Regeln — und viele Übungsfragen." });
}
S.teil({ id: "fs_tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: (T1.x0 + T1.x1) / 2, y: T1.y, steht: true, kunst: tisch(T1) });
{
  const s = M(T1.y), top = T1.y - 0.75 * s - 1.2;
  /* DAS TABLET mit der Lern-App */
  let k = `<path d="M-6 0 L6 0 L5.2 -3.4 L-5.2 -3.4 Z" fill="#2c3035"/><path d="M-5.3 -.4 L5.3 -.4 L4.7 -3 L-4.7 -3 Z" fill="${S.lg("app", [[0, "#e9f3fa"], [1, "#cfe2ef"]])}"/>`;
  k += `<rect x="-4.4" y="-2.8" width="8.8" height=".7" fill="${BLAU}"/><circle cx="-2.6" cy="-1.3" r=".6" fill="#c62f25"/><rect x="-1.4" y="-1.6" width="4.6" height=".5" fill="#9aa0a6"/><rect x="-1.4" y="-1" width="3.4" height=".4" fill="#9aa0a6"/>`;
  S.teil({ oben: true, id: "fs_tablet", de: "das Tablet", syl: "TEB-let", it: "il tablet", itSyl: "TAB-let", en: "tablet", x: 165, y: top, steht: true, kunst: k + flaeche(-6.4, -4.4, 12.8, 4.8),
    tipp: "Mit der Lern-App übt man die Theoriefragen — auch zu Hause." });
  /* DIE PRÜFUNG — Übungsbogen „Vorprüfung“ mit Kreuzen */
  k = `<path d="M-5 0 L5 0 L4.4 -3.6 L-4.4 -3.6 Z" fill="#ffffff" stroke="#c9cdd0" stroke-width=".15"/><text x="0" y="-2.6" font-size=".9" text-anchor="middle" fill="${BLAU}" font-family="Arial" font-weight="bold">VORPRÜFUNG</text>`;
  for (let i = 0; i < 3; i++) k += `<rect x="-4" y="${r(-2.2 + i * 0.7)}" width=".5" height=".45" fill="none" stroke="#59616a" stroke-width=".1"/><path d="M-4 ${r(-2.2 + i * 0.7)} l.5 .45 M-3.5 ${r(-2.2 + i * 0.7)} l-.5 .45" stroke="#c0392b" stroke-width=".12"/><rect x="-3.2" y="${r(-2.05 + i * 0.7)}" width="${5 - i}" height=".2" fill="#9aa0a6"/>`;
  k += `<path d="M2.4 -.4 L5.6 -2.4" stroke="#1d1f22" stroke-width=".4" stroke-linecap="round"/>`;
  S.teil({ oben: true, id: "fs_pruefung", de: "die Prüfung", syl: "PRÜ-fung", it: "l'esame", itSyl: "e-SA-me", en: "test", x: 226, y: top, steht: true, kunst: k + flaeche(-5.4, -4.6, 11, 5),
    tipp: "Zuerst die Theorieprüfung am Computer, dann die praktische Prüfung im Auto." });
  /* DER FÜHRERSCHEIN — Karte im Scheckkartenformat */
  k = `<path d="M-3.2 0 L3.2 0 L2.9 -1.9 L-2.9 -1.9 Z" fill="${S.lg("karte", [[0, "#f7c9d6"], [1, "#c9d8f0"]], 0, 0, 1, 0)}" stroke="#9aa0a6" stroke-width=".1"/><rect x="-2.7" y="-1.7" width=".9" height="1.2" fill="#9aa0a6"/><rect x="-1.5" y="-1.6" width="3.6" height=".3" fill="${BLAU}"/><rect x="-1.5" y="-1.1" width="2.6" height=".2" fill="#59616a"/><rect x="-1.5" y="-.7" width="2" height=".2" fill="#59616a"/>`;
  S.teil({ oben: true, id: "fs_fuehrerschein", de: "der Führerschein", syl: "FÜH-rer-schein", it: "la patente", itSyl: "pa-TEN-te", en: "driving licence", x: 104, y: top, steht: true, kunst: k + flaeche(-3.6, -3, 7.2, 3.4),
    tipp: "Er gilt fünfzehn Jahre und muss dann umgetauscht werden." });
}

/* =====================================================================
   8 — DIE FAHRSCHÜLER (von hinten, sie schauen zur Leinwand) und DIE STÜHLE
   ===================================================================== */
const SITZE = [{ x: 132, y: 190 }, { x: 196, y: 190 }];
const sitz = [];
{
  const y = SITZE[0].y, s = M(y);
  const m = B.mensch({ id: "fs_sw", geschlecht: "w", pose: "sitzen", blick: 158, frisur: "zopf", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "rosa" }, unterteil: { stueck: "jeans", farbe: "jeans" }, schuhe: { stueck: "turnschuh", farbe: "weiss" } } }, 1.66 * s);
  sitz.push({ x: SITZE[0].x + m.z.sitz.x * m.k, y: y + m.z.sitz.y * m.k });
  S.teil({ id: "fs_fahrschuelerin", de: "die Fahrschülerin", syl: "FAHR-schü-le-rin", it: "l'allieva conducente", itSyl: "al-LIE-va", en: "learner driver", x: SITZE[0].x, y, kunst: m.svg,
    tipp: "Sie macht den Führerschein Klasse B — den für das Auto." });
}
{
  const y = SITZE[1].y, s = M(y);
  const m = B.mensch({ id: "fs_sm", geschlecht: "m", pose: "sitzen", blick: 204, frisur: "locken", haarfarbe: "schwarz", haut: "oliv",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "gruen_d" }, jacke: { stueck: "jacke", farbe: "schwarz" }, unterteil: { stueck: "hose", farbe: "beige" }, schuhe: { stueck: "turnschuh", farbe: "schwarz" } } }, 1.8 * s);
  sitz.push({ x: SITZE[1].x + m.z.sitz.x * m.k, y: y + m.z.sitz.y * m.k });
  S.teil({ id: "fs_fahrschueler", de: "der Fahrschüler", syl: "FAHR-schü-ler", it: "l'allievo conducente", itSyl: "al-LIE-vo", en: "learner driver", x: SITZE[1].x, y, kunst: m.svg,
    tipp: "Zwölf Sonderfahrten kommen zur Theorie dazu: Autobahn, Landstraße, Nacht." });
}
{
  /* Stühle (Vierfuß, blaue Schale): hintere Reihe leer, vorne unter den Schülern */
  const stuhl = (cx, fy, sy, voll) => {
    const s = M(fy);
    const ys = sy != null ? sy : fy - 0.45 * s, w = 0.44 * s;
    let g = schatten(cx, fy, w / 2 + 2, 1.2, .25);
    for (const dx of [-w / 2 + 1, w / 2 - 1]) g += `<line x1="${r(cx + dx)}" y1="${r(ys + 1)}" x2="${r(cx + dx * 1.06)}" y2="${r(fy)}" stroke="#59616a" stroke-width="1"/>`;
    for (const dx of [-w / 2 + 3, w / 2 - 3]) g += `<line x1="${r(cx + dx)}" y1="${r(ys)}" x2="${r(cx + dx)}" y2="${r(fy - 0.12 * s)}" stroke="#7d868d" stroke-width=".8"/>`;
    g += `<path d="M${r(cx - w / 2)} ${r(ys + 1.4)} L${r(cx + w / 2)} ${r(ys + 1.4)} L${r(cx + w / 2 - 1.4)} ${r(ys - 1.8)} L${r(cx - w / 2 + 1.4)} ${r(ys - 1.8)} Z" fill="${S.lg("schale", [[0, "#3f7fc8"], [1, "#1f5294"]])}"/>`;
    /* Lehne: hinten (bei den Schülern zwischen uns und dem Rücken) */
    const lh = 0.38 * s;
    g += `<path d="M${r(cx - w / 2 + 1)} ${r(ys + (voll ? 1.6 : -1.6))} L${r(cx - w / 2 + 0.4)} ${r(ys - lh)} Q${r(cx)} ${r(ys - lh - 2)} ${r(cx + w / 2 - 0.4)} ${r(ys - lh)} L${r(cx + w / 2 - 1)} ${r(ys + (voll ? 1.6 : -1.6))}" fill="none" stroke="#59616a" stroke-width=".9"/>`;
    g += `<path d="M${r(cx - w / 2 + 0.8)} ${r(ys - lh * 0.45)} Q${r(cx)} ${r(ys - lh * 0.45 - 1.6)} ${r(cx + w / 2 - 0.8)} ${r(ys - lh * 0.45)} L${r(cx + w / 2 - 0.4)} ${r(ys - lh)} Q${r(cx)} ${r(ys - lh - 2)} ${r(cx - w / 2 + 0.4)} ${r(ys - lh)} Z" fill="${S.lg("lehne", [[0, "#4f8fd8"], [1, "#2a63a8"]])}"/>`;
    return g;
  };
  let k = "";
  k += stuhl(36, 160, null, false) + stuhl(80, 160, null, false);
  k += stuhl(sitz[0].x, SITZE[0].y, sitz[0].y, true) + stuhl(sitz[1].x, SITZE[1].y, sitz[1].y, true);
  S.teil({ id: "fs_stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: 0, y: 0, kunst: k,
    tipp: "Im Theorieraum hat jeder Fahrschüler einen Stuhl mit Lehne." });
}

S.davor(`<rect x="0" y="0" width="320" height="200" fill="${S.rg("tageslicht", [[0, "#fffdf2", 0.08], [1, "#fffdf2", 0]], 0.2, 0.3, 0.7)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/fahrschule.js"));
console.log(aus);
