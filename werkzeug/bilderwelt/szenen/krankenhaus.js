#!/usr/bin/env node
/* =====================================================================
   IM KRANKENHAUS (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Hersteller von Klinikbetten und Wandversorgungen, z. B.
   Stiegelmeyer/Völker, Dräger „Linea“; Lexikon Krankenbett; Pflegebett-
   Ratgeber; Schwesternruf-Systeme):
   - Ein deutsches PATIENTENZIMMER (Normalstation): elektrisch verstell-
     bares Klinikbett auf vier Lenkrollen mit Bremse, Kopf- und Fußteil
     in Holzoptik, das Rückenteil hochgestellt, geteilte SEITENGITTER
     (eins oben, eins heruntergeklappt), weißes Laken, Kissen, Bettdecke.
   - Über dem Bett an der Wand die WANDVERSORGUNG: Leselicht, Steckdosen,
     Sauerstoff-Anschluss mit Durchflussmesser, Schwesternruf. Der
     NOTRUFKNOPF (Birnentaster) hängt am Spiralkabel beim Kissen.
   - Am Kopfende der INFUSIONSSTÄNDER mit Beutel und Tropfkammer, der
     Schlauch führt zum Handrücken; der PATIENTENMONITOR am Wandarm
     (EKG, Puls, Sauerstoffsättigung), dazu ein Blutdruckmessgerät an
     der Wandschiene.
   - Daneben der NACHTTISCH auf Rollen (Wasser, Glas, Karte „Gute
     Besserung“, Taschentücher, unten im Fach die Bettpfanne).
   - Der Trennvorhang an der Deckenschiene, ein Fernseher am Schwenkarm,
     Fenster mit Blumen, Besucherstuhl, ein Rollstuhl am Eingang.
   - Der Patient trägt ein Klinikhemd (Patientenhemd) und liegt unter der
     Decke; die Ärztin/der Arzt liest bei der Visite die Krankenakte
     (Kurve) am Fußende, die Pflegekraft steht auf der anderen Bettseite.
   Maßstab: Rückwand ≈ 46 Einheiten je Meter (Fuß bei y = 128), Bett
   ≈ 57 je Meter (Rollen bei y = 180), Arzt vorn 1,82 m ≈ 58/m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "krankenhaus", titel: "Im Krankenhaus", emoji: "🏥", thema: "Gesundheit", kuerzel: "b03b", fassung: 852 });
const rnd = zufall(1112);
const r = B.r;
/* Teil mit Zeichnung in Szenen-Koordinaten an einen Ankerpunkt hängen */
const anker = (kunst, ax, ay) => `<g transform="translate(${r(-ax)} ${r(-ay)})">${kunst}</g>`;

/* ---------- eigene Haltungen --------------------------------------- */
B.mensch({}, 10);
const MP = globalThis.DMA_MENSCH.POSEN;
MP.b03b_halbsitz = { kipp: -56, lende: -2, brust: 0, nacken: 14, kopf: 6,
  schulterL: { vor: 4, seit: 12 }, ellbogenL: 30, unterarmL: -75, handL: 4, fingerL: 0.35,
  schulterR: { vor: 6, seit: 14 }, ellbogenR: 36, unterarmR: -75, handR: 4, fingerR: 0.35,
  huefteL: { vor: 36, seit: 4, dreh: -8 }, knieL: 8, fussL: 12,
  huefteR: { vor: 38, seit: 4, dreh: -8 }, knieR: 14, fussR: 12 };
MP.b03b_akte = Object.assign({}, MP.stehen, { nacken: 14, kopf: 12,
  schulterL: { vor: 24, seit: 12 }, ellbogenL: 96, unterarmL: 70, handL: 18, fingerL: 0.45,
  schulterR: { vor: 22, seit: 13 }, ellbogenR: 100, unterarmR: 70, handR: 18, fingerR: 0.45 });

/* ---------- Grundfarben -------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WAND = S.lg("wand", [[0, "#f3efe6"], [0.6, "#ece6da"], [1, "#e2dacb"]]);
const WEISS = S.lg("weiss", [[0, "#ffffff"], [0.6, "#f1f3f3"], [1, "#d9dedf"]]);
const WEISS_H = S.lg("weissh", [[0, "#e3e7e8"], [0.35, "#ffffff"], [1, "#d3d9db"]], 0, 0, 1, 0);
const HOLZ = S.lg("holz", [[0, "#d9b98c"], [0.5, "#c9a473"], [1, "#b48c5b"]], 0, 0, 1, 0);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const GRAU = S.lg("grau", [[0, "#a9b0b5"], [1, "#7d868c"]]);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.3], [0.5, "#e8f4f7", 0.06], [1, "#ffffff", 0.16]], 0, 0, 1, 1);

/* =====================================================================
   KULISSE — Rasterdecke, Wand mit Rammschutzleiste, Vinylboden
   ===================================================================== */
const WAND_UNTEN = 128;
{
  let k = `<rect x="0" y="0" width="320" height="15" fill="${S.lg("decke", [[0, "#f1f0ec"], [1, "#e2e0da"]])}"/>`;
  for (let x = 0; x <= 320; x += 40) k += `<line x1="${x}" y1="0" x2="${r(160 + (x - 160) * 1.04)}" y2="15" stroke="#cbc8c0" stroke-width=".4"/>`;
  k += `<line x1="0" y1="7" x2="320" y2="7" stroke="#cbc8c0" stroke-width=".35"/>`;
  for (const x of [120, 240]) k += `<rect x="${x + 3}" y="7.8" width="34" height="5.6" rx=".4" fill="${S.lg("panel", [[0, "#ffffff"], [1, "#e9eef1"]])}"/>`;
  k += `<rect x="0" y="14.4" width="320" height="1.6" fill="#d3cfc6"/>`;
  k += `<rect x="0" y="16" width="320" height="${WAND_UNTEN - 16}" fill="${WAND}"/>`;
  k += `<rect x="0" y="16" width="320" height="${WAND_UNTEN - 16}" fill="${S.rg("wandlicht", [[0, "#fffdf6", 0.65], [1, "#fffdf6", 0]], 0.82, 0.3, 0.6)}"/>`;
  /* Rammschutz-/Handlauf aus Holz und Sockel */
  k += `<rect x="0" y="104" width="320" height="4.2" rx="1" fill="${S.lg("ramm", [[0, "#d7b98f"], [1, "#a98458"]])}"/><rect x="0" y="104.4" width="320" height=".8" fill="#fff" opacity=".35"/>`;
  k += `<rect x="0" y="${WAND_UNTEN - 3}" width="320" height="3" fill="#a9a49a"/>`;
  /* Boden: hellgrünlich-grauer Vinylboden, Fugen in Fluchtperspektive */
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#c3c8bd"], [1, "#a7ad9f"]])}"/>`;
  for (let i = -8; i <= 8; i++) k += `<line x1="${160 + i * 24}" y1="${WAND_UNTEN}" x2="${160 + i * 62}" y2="200" stroke="#959b8e" stroke-width=".3" opacity=".7"/>`;
  for (const y of [WAND_UNTEN + 9, WAND_UNTEN + 22, WAND_UNTEN + 40, WAND_UNTEN + 63]) k += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#959b8e" stroke-width=".3" opacity=".5"/>`;
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.14], [0.35, "#000", 0], [1, "#fff", 0.08]])}"/>`;
  /* Wandversorgung über dem Bett: Leiste mit Leselicht, Steckdosen, O2 */
  const W0 = 82, W1 = 202, WY = 58;
  k += `<rect x="${W0}" y="${WY}" width="${W1 - W0}" height="13" rx="1.4" fill="${WEISS}" stroke="#c6cbcc" stroke-width=".3"/>`;
  k += `<rect x="${W0 + 2}" y="${WY + 1.4}" width="${W1 - W0 - 4}" height="2.2" rx="1" fill="#fff8de"/>`;
  k += `<rect x="${W0}" y="${WY + 13}" width="${W1 - W0}" height="10" fill="${S.lg("leselicht", [[0, "#fff4cf", 0.45], [1, "#fff4cf", 0]])}"/>`;
  for (const x of [W0 + 30, W0 + 38, W0 + 70, W0 + 78]) k += `<rect x="${x}" y="${WY + 5.6}" width="5.4" height="5.4" rx=".8" fill="#f4f5f4" stroke="#b9c0c2" stroke-width=".3"/><circle cx="${x + 1.8}" cy="${WY + 8.3}" r=".45" fill="#555"/><circle cx="${x + 3.6}" cy="${WY + 8.3}" r=".45" fill="#555"/>`;
  /* Sauerstoff-Anschluss (weiß/blau), Durchflussmesser mit Befeuchter */
  k += `<rect x="${W0 + 50}" y="${WY + 5.4}" width="6" height="5.8" rx=".8" fill="#f2f4f4" stroke="#2f6db5" stroke-width=".5"/><text x="${W0 + 53}" y="${WY + 9.4}" font-size="2" text-anchor="middle" fill="#2f6db5" font-family="Arial" font-weight="bold">O₂</text>`;
  k += `<rect x="${W0 + 58}" y="${WY + 4}" width="3" height="10" rx="1.2" fill="#e9f2ee" stroke="#6aa58a" stroke-width=".3"/><circle cx="${W0 + 59.5}" cy="${WY + 8}" r=".7" fill="#3a9a6a"/>`;
  k += `<rect x="${W0 + 57.4}" y="${WY + 14.4}" width="4.2" height="7" rx="1" fill="#dceff7" opacity=".85" stroke="#9fc4d3" stroke-width=".25"/>`;
  /* roter Ruf-Taster und Licht-Taster an der Leiste */
  k += `<rect x="${W0 + 96}" y="${WY + 5}" width="7" height="6.4" rx="1" fill="#f4f5f4" stroke="#b9c0c2" stroke-width=".3"/><circle cx="${W0 + 99.5}" cy="${WY + 8.2}" r="1.9" fill="#d6332b"/>`;
  k += `<rect x="${W0 + 106}" y="${WY + 5}" width="7" height="6.4" rx="1" fill="#f4f5f4" stroke="#b9c0c2" stroke-width=".3"/><circle cx="${W0 + 109.5}" cy="${WY + 8.2}" r="1.6" fill="#f2c94c"/>`;
  /* Deckenschiene für den Trennvorhang (links) */
  k += `<rect x="0" y="16" width="44" height="1.6" fill="#b7bcbd"/><path d="M44 16.8 Q48 16.8 48 21" stroke="#b7bcbd" stroke-width="1.6" fill="none"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DAS FENSTER (rechts) mit Blumenstrauß auf der Fensterbank
   ===================================================================== */
{
  let k = `<rect x="-30" y="-36" width="60" height="72" rx="1" fill="#e9ecea"/>`;
  k += `<rect x="-27" y="-33" width="54" height="66" fill="${S.lg("himmel", [[0, "#9ccbec"], [0.6, "#d3e9f5"], [1, "#eef5ec"]])}"/>`;
  /* Blick auf den Klinik-Park und ein Gebäudeflügel */
  k += `<rect x="-27" y="-6" width="26" height="30" fill="#e6dcc9"/><rect x="-27" y="-8" width="26" height="2.4" fill="#c9bea8"/>`;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) k += `<rect x="${-25 + i * 6}" y="${-3 + j * 6.4}" width="3.6" height="3.8" fill="#86a3b6"/>`;
  k += `<path d="M-2 24 Q2 2 10 8 Q14 -4 22 6 Q27 4 27 10 L27 33 L-2 33 Z" fill="#78a864"/><path d="M-27 33 L-27 24 Q-6 18 27 26 L27 33 Z" fill="#5f9150"/>`;
  k += `<rect x="-27" y="-33" width="54" height="66" fill="${GLAS}"/>`;
  k += `<rect x="-27" y="-33" width="54" height="66" fill="none" stroke="#f6f7f6" stroke-width="2.2"/><rect x="-1" y="-33" width="2" height="66" fill="#f6f7f6"/>`;
  k += `<rect x="-5" y="-1" width="1.1" height="5" rx=".4" fill="#b8bfc2"/>`;
  k += `<path d="M-25 -31 L-15 -31 L-25 -12 Z" fill="#fff" opacity=".35"/>`;
  k += `<rect x="-32" y="34" width="64" height="2.6" rx=".5" fill="#f1f0ec"/><rect x="-32" y="36.4" width="64" height=".8" fill="#c4c1b8"/>`;
  S.teil({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: 284, y: 60, kunst: k });
}
{
  /* DER BLUMENSTRAUSS in einer Vase auf der Fensterbank */
  let k = schatten(0, 0, 4, .6, .25);
  k += `<path d="M-2.6 0 L-3.2 -6 Q-3.2 -8 -1.6 -8.6 L1.6 -8.6 Q3.2 -8 3.2 -6 L2.6 0 Z" fill="${S.lg("vase", [[0, "#cde8ef"], [1, "#8fbccb"]], 0, 0, 1, 0)}" opacity=".9"/>`;
  for (const [a, l] of [[-28, 9], [-10, 11], [8, 10.5], [26, 9], [0, 13]]) { const x = Math.sin(a * Math.PI / 180) * l, y = -8 - Math.cos(a * Math.PI / 180) * l; k += `<path d="M0 -8 L${r(x)} ${r(y)}" stroke="#4f8a46" stroke-width=".5"/>`; }
  const bl = [[-4.4, -16, "#e2574c"], [-1.8, -18.6, "#f2c94c"], [1.6, -18.2, "#e2574c"], [4.2, -15.6, "#d98aa6"], [0, -21, "#f6f2e8"], [-3, -13, "#d98aa6"], [3, -13, "#f2c94c"]];
  for (const [x, y, f] of bl) { for (let i = 0; i < 5; i++) { const a = i * 1.2566; k += `<circle cx="${r(x + Math.cos(a) * 1)}" cy="${r(y + Math.sin(a) * 1)}" r=".9" fill="${f}"/>`; } k += `<circle cx="${x}" cy="${y}" r=".6" fill="#8a5a1e"/>`; }
  for (const [x, y] of [[-5, -10], [5, -10], [-2, -11], [2.4, -11.4]]) k += `<ellipse cx="${x}" cy="${y}" rx="1.6" ry=".7" fill="#5f9150" transform="rotate(${x * 6} ${x} ${y})"/>`;
  S.teil({ oben: true, id: "blumenstrauss", de: "der Blumenstrauß", syl: "BLU-men-strauß", it: "il mazzo di fiori", itSyl: "MAZ-zo di FIO-ri", en: "bunch of flowers", x: 300, y: 94, kunst: k,
    tipp: "Besuch bringt oft Blumen mit — und wünscht „Gute Besserung!“" });
}

/* =====================================================================
   2 — DER FERNSEHER (Schwenkarm an der Wand)
   ===================================================================== */
{
  let k = `<rect x="22" y="-6" width="5" height="10" rx=".8" fill="#d7dcdd"/><path d="M24 -1 L6 -1" stroke="#c9cfd4" stroke-width="1.8"/><circle cx="14" cy="-1" r="1.3" fill="#c9cfd4"/><circle cx="6" cy="-1" r="1.4" fill="#c9cfd4"/>`;
  k += `<rect x="-17" y="-11" width="24" height="15" rx="1" fill="#1c2024"/><rect x="-16" y="-10" width="22" height="12.4" fill="${S.lg("tv", [[0, "#3c6e91"], [1, "#1d3a52"]])}"/>`;
  /* Programm: Wetterkarte */
  k += `<path d="M-12 -6 Q-8 -9 -4 -6 Q-1 -8 2 -5 L2 0 L-12 0 Z" fill="#6aa86a" opacity=".9"/><circle cx="-7" cy="-5" r="1.4" fill="#f2c94c"/><text x="1" y="-6.6" font-size="1.8" fill="#fff" font-family="Arial">18°</text>`;
  k += `<path d="M-16 -10 L-10 -10 L-16 -3 Z" fill="#fff" opacity=".1"/>`;
  S.teil({ id: "fernseher", de: "der Fernseher", syl: "FERN-se-her", it: "il televisore", itSyl: "te-le-vi-SO-re", en: "television", x: 222, y: 36, kunst: k });
}

/* =====================================================================
   3 — DAS BLUTDRUCKMESSGERÄT (an der Wandschiene, mit Manschette)
   ===================================================================== */
{
  let k = `<rect x="-8" y="-1" width="16" height="2" rx=".5" fill="#b7bcbd"/>`;
  k += `<circle cx="0" cy="-8" r="6.4" fill="${S.lg("bdm", [[0, "#f7f8f8"], [1, "#c9cfd2"]])}" stroke="#8a9398" stroke-width=".5"/>`;
  k += `<circle cx="0" cy="-8" r="5.2" fill="#fbfcfb"/>`;
  for (let i = 0; i < 16; i++) { const a = -2.4 + i * 0.32; k += `<line x1="${r(Math.cos(a) * 4.8)}" y1="${r(-8 + Math.sin(a) * 4.8)}" x2="${r(Math.cos(a) * 4.1)}" y2="${r(-8 + Math.sin(a) * 4.1)}" stroke="#333" stroke-width=".18"/>`; }
  k += `<text x="0" y="-5" font-size="1.3" text-anchor="middle" fill="#333" font-family="Arial">mmHg</text>`;
  k += `<line x1="0" y1="-8" x2="${r(Math.cos(-0.6) * 4)}" y2="${r(-8 + Math.sin(-0.6) * 4)}" stroke="#c0392b" stroke-width=".4"/>`;
  /* Korb mit grauer Manschette und Schlauch, Pumpball */
  k += `<path d="M-6 1 L6 1 L5 9 L-5 9 Z" fill="#c9cfd2" stroke="#8a9398" stroke-width=".3"/>`;
  k += `<path d="M-4.6 2 Q0 6 4.6 2 L4 7.6 L-4 7.6 Z" fill="#5e6a74"/><path d="M-3 3 L3 3" stroke="#a7b3bc" stroke-width=".3"/>`;
  k += `<path d="M-5 5 Q-9 9 -6 14" stroke="#2f353b" stroke-width=".55" fill="none"/><ellipse cx="-6" cy="15.4" rx="1.5" ry="2" fill="#2f353b"/>`;
  S.teil({ id: "kh_blutdruckmesser", de: "das Blutdruckmessgerät", syl: "BLUT-druck-mess-ge-rät", it: "il misuratore di pressione", itSyl: "mi-su-ra-TO-re di pres-SIO-ne", en: "blood pressure monitor", x: 214, y: 70, kunst: k,
    tipp: "Die Manschette kommt um den Oberarm." });
}

/* =====================================================================
   4 — DER VORHANG (Trennvorhang an der Deckenschiene, links)
   ===================================================================== */
{
  let k = "";
  const falten = [0, 6, 12, 18, 24, 30, 36, 42];
  let d = `M0 0`;
  falten.forEach((x, i) => { d += ` Q${x + 3} ${i % 2 ? 2 : -1} ${x + 6} 0`; });
  k += `<path d="M-1 0 L48 0 L46 98 Q40 101 34 98 Q28 101 22 98 Q16 101 10 98 Q4 101 -1 98 Z" fill="${S.lg("vorhang", [[0, "#cfe2d6"], [0.5, "#b9d4c4"], [1, "#a7c7b4"]], 0, 0, 1, 0)}"/>`;
  for (const x of falten) k += `<path d="M${x + 3} 1 L${x + 2.4} 98" stroke="#8fb39d" stroke-width="1.6" opacity=".45"/><path d="M${x + 5.4} 1 L${x + 5} 98" stroke="#eef6f0" stroke-width=".8" opacity=".55"/>`;
  /* Netzband oben (Luftdurchlass) */
  k += `<rect x="-1" y="0" width="48" height="6" fill="#e9f0eb" opacity=".8"/>`;
  for (let x = 0; x < 47; x += 1.6) k += `<line x1="${r(x)}" y1="0" x2="${r(x + 1.6)}" y2="6" stroke="#b5c4ba" stroke-width=".15"/>`;
  for (const x of falten) k += `<circle cx="${x + 2}" cy="-.4" r=".7" fill="#9aa3aa"/>`;
  k += `<path d="M-1 98 Q4 101 10 98 Q16 101 22 98 Q28 101 34 98 Q40 101 46 98" stroke="#8fb39d" stroke-width=".6" fill="none"/>`;
  S.teil({ id: "vorhang", de: "der Vorhang", syl: "VOR-hang", it: "la tenda", itSyl: "TEN-da", en: "curtain", x: 24, y: 116, kunst: anker(k, 24, 98),
    tipp: "Der Vorhang schützt im Zweibettzimmer die Privatsphäre." });
}

/* =====================================================================
   5 — DER MONITOR (Patientenmonitor am Wandarm)
   ===================================================================== */
{
  let k = `<rect x="18" y="-4" width="4" height="10" rx=".8" fill="#d7dcdd"/><path d="M20 1 L12 1" stroke="${STAHL}" stroke-width="2"/>`;
  k += `<rect x="-14" y="-11" width="27" height="21" rx="1.6" fill="${S.lg("monrahmen", [[0, "#e9edee"], [1, "#c3cacc"]])}" stroke="#9aa3aa" stroke-width=".3"/>`;
  k += `<rect x="-12.4" y="-9.4" width="20" height="16.6" fill="#0b0f12"/>`;
  /* EKG (grün), Pleth (blau), Werte */
  let ekg = "M-12 -5";
  for (let i = 0; i < 3; i++) { const x = -12 + i * 6.4; ekg += ` L${r(x + 2)} -5 L${r(x + 2.6)} -6 L${r(x + 3.1)} -5 L${r(x + 3.6)} -9 L${r(x + 4.1)} -3.6 L${r(x + 4.6)} -5 L${r(x + 6.4)} -5`; }
  k += `<path d="${ekg}" stroke="#5cf07a" stroke-width=".35" fill="none"/>`;
  let ple = "M-12 1"; for (let i = 0; i < 6; i++) ple += ` q1.6 -2.6 3.2 0`;
  k += `<path d="${ple}" stroke="#54c6f0" stroke-width=".35" fill="none"/>`;
  k += `<text x="7" y="-5.2" font-size="3" text-anchor="end" fill="#5cf07a" font-family="Arial" font-weight="bold">72</text><text x="7" y="1.6" font-size="2.6" text-anchor="end" fill="#54c6f0" font-family="Arial" font-weight="bold">97</text>`;
  k += `<text x="-12" y="6.2" font-size="1.9" fill="#f0f0f0" font-family="Arial">125/80</text><text x="7" y="6.2" font-size="1.4" text-anchor="end" fill="#ff8f6b" font-family="Arial">36,8°</text>`;
  k += `<rect x="9" y="-9" width="3" height="16" rx=".4" fill="#c9cfd2"/><circle cx="10.5" cy="-6.6" r=".7" fill="#5cd68a"/><circle cx="10.5" cy="-3.6" r=".7" fill="#f2b233"/>`;
  k += `<path d="M-12 -9 L-5 -9 L-12 -1 Z" fill="#fff" opacity=".06"/>`;
  S.teil({ id: "kh_monitor", de: "der Monitor", syl: "MO-ni-tor", it: "il monitor", itSyl: "MO-ni-tor", en: "monitor", x: 52, y: 68, kunst: k,
    tipp: "Der Monitor zeigt Puls, Blutdruck und Sauerstoff im Blut." });
}

/* =====================================================================
   6 — DER NACHTTISCH (auf Rollen) — Lupe: Flasche, Glas, Karte,
       Taschentücher, im offenen Fach die Bettpfanne
   ===================================================================== */
const NT = { x: 60, y: 166, b: 26, h: 42 };
const ntUnter = [];
{
  const W = NT.b, H = NT.h;
  let k = schatten(0, 0, 15, 1.4, .3);
  /* Rollen */
  for (const x of [-W / 2 + 2, W / 2 - 2]) k += `<rect x="${x - 0.6}" y="-3" width="1.2" height="1.6" fill="#555"/><circle cx="${x}" cy="-1.2" r="1.3" fill="#2f353b"/>`;
  /* Korpus in Holzoptik mit weißer Front */
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H - 3}" rx="1" fill="${HOLZ}"/>`;
  k += `<rect x="${-W / 2 + 1.4}" y="${-H + 6}" width="${W - 2.8}" height="9" rx=".6" fill="${WEISS}" stroke="#c6cbcc" stroke-width=".3"/><rect x="-4" y="${-H + 9.8}" width="8" height="1.2" rx=".6" fill="#8a9398"/>`;
  /* offenes Fach unten */
  k += `<rect x="${-W / 2 + 1.4}" y="${-H + 17}" width="${W - 2.8}" height="${H - 22}" rx=".6" fill="${S.lg("fach", [[0, "#6d5638"], [1, "#9c7d55"]])}"/>`;
  /* Platte mit Kante */
  k += `<rect x="${-W / 2 - 1}" y="${-H - 1.6}" width="${W + 2}" height="2.6" rx=".8" fill="${S.lg("ntplatte", [[0, "#f6f3ec"], [1, "#d9d2c3"]])}"/>`;
  k += `<rect x="${-W / 2 + 1}" y="${-H + 2}" width="${W - 2}" height="2.4" rx=".6" fill="${WEISS}"/><rect x="-3" y="${-H + 2.6}" width="6" height="1" rx=".5" fill="#8a9398"/>`;
  const P = -H - 1.6;
  const unter = (id, de, syl, it, itSyl, en, x, y, kunst, fl, tipp) => {
    k += `<g transform="translate(${x} ${y})">${kunst}</g>`;
    ntUnter.push({ id, de, syl, it, itSyl, en, x: NT.x + x, y: NT.y + y, kunst: fl, tipp });
  };
  /* DIE FLASCHE — Mineralwasser */
  unter("flasche", "die Flasche", "FLA-sche", "la bottiglia", "bot-TI-glia", "bottle", -8, P,
    `<path d="M-2 0 L-2 -8 Q-2 -9.6 -1 -10.4 L-1 -12 L1 -12 L1 -10.4 Q2 -9.6 2 -8 L2 0 Z" fill="${S.lg("flasche", [[0, "#cfe8f0"], [0.5, "#f2fafc"], [1, "#a9cdd9"]], 0, 0, 1, 0)}" opacity=".9"/><rect x="-1.1" y="-13.2" width="2.2" height="1.4" rx=".3" fill="#2f86c7"/><rect x="-2" y="-6.4" width="4" height="2.6" fill="#2f86c7"/><path d="M-1.4 -8 L-1.4 -.6" stroke="#fff" stroke-width=".4"/>`,
    flaeche(-2.6, -13.6, 5.2, 14));
  /* DAS GLAS */
  unter("glas", "das Glas", "GLAS", "il bicchiere", "bic-CHIE-re", "glass", -3, P,
    `<path d="M-1.8 -5.4 L1.8 -5.4 L1.5 0 L-1.5 0 Z" fill="#e3f2f7" opacity=".7" stroke="#a9c8d2" stroke-width=".2"/><path d="M-1.65 -3 L1.65 -3 L1.5 0 L-1.5 0 Z" fill="#bfe1ee" opacity=".8"/><path d="M-1.2 -4.8 L-1 -.6" stroke="#fff" stroke-width=".3"/>`,
    flaeche(-2.4, -6.4, 4.8, 6.8));
  /* DIE KARTE — „Gute Besserung!“, aufgestellt */
  unter("karte", "die Karte", "KAR-te", "il biglietto", "bi-GLIET-to", "card", 3, P,
    `<path d="M-3.4 0 L-2.4 -7 L1.2 -7.4 L.6 0 Z" fill="#f4e7c9"/><path d="M.6 0 L1.2 -7.4 L4 -6.6 L3.4 0 Z" fill="#fff8e6" stroke="#e0cfa5" stroke-width=".15"/><circle cx="2.3" cy="-4.8" r="1" fill="#e2574c"/><circle cx="2.9" cy="-3.6" r=".7" fill="#f2c94c"/><text x="2.3" y="-1.4" font-size=".8" text-anchor="middle" fill="#7a3b3b" font-family="Georgia" font-style="italic">Gute Besserung!</text>`,
    flaeche(-3.6, -8, 7.8, 8.4), "Auf der Karte steht: „Gute Besserung!“");
  /* DAS TASCHENTUCH — Box mit Papiertaschentüchern */
  unter("taschentuch", "das Taschentuch", "TA-schen-tuch", "il fazzoletto", "faz-zo-LET-to", "tissue", 9, P,
    `<rect x="-2.6" y="-3.2" width="5.2" height="3.2" rx=".3" fill="${S.lg("tbox", [[0, "#9fd0e0"], [1, "#6aaec6"]])}"/><path d="M-1 -3.2 Q-.6 -5.4 .4 -5 Q.8 -6 1.4 -4.4 L1.2 -3.2 Z" fill="#ffffff" stroke="#dde3e5" stroke-width=".12"/>`,
    flaeche(-3, -6.2, 6, 6.6));
  S.teil({ id: "kh_nachttisch", de: "der Nachttisch", syl: "NACHT-tisch", it: "il comodino", itSyl: "co-mo-DI-no", en: "bedside table", x: NT.x, y: NT.y, steht: true, kunst: k,
    zoom: { x: NT.x - 17, y: NT.y - H - 17, w: 34, h: 23 },
    unter: ntUnter,
    tipp: "Der Nachttisch hat Rollen — man schiebt ihn ans Bett." });
}

{
  /* DIE BETTPFANNE — liegt im offenen Fach des Nachttischs */
  const k = `<path d="M-9 0 L-8 -4 Q-6 -5.2 0 -5.2 Q5 -5.2 6.4 -4 L9 -3.6 L9.4 -1.6 L7 -1 L6 0 Z" fill="${S.lg("pfanne", [[0, "#f5f7f8"], [0.5, "#d3d9dc"], [1, "#a9b1b5"]])}" stroke="#8a9398" stroke-width=".25"/><ellipse cx="-1" cy="-4.4" rx="5" ry=".7" fill="#bfc6ca"/><path d="M-7 -3.4 L5 -3.6" stroke="#fff" stroke-width=".4" opacity=".7"/>`;
  S.teil({ oben: true, id: "kh_bettpfanne", de: "die Bettpfanne", syl: "BETT-pfan-ne", it: "la padella", itSyl: "pa-DEL-la", en: "bedpan", x: NT.x, y: NT.y - 7.6, kunst: k + flaeche(-9.6, -6.4, 19.4, 7),
    tipp: "Wer nicht aufstehen darf, benutzt im Bett die Bettpfanne." });
}

/* =====================================================================
   7 — DIE KRANKENSCHWESTER (auf der anderen Bettseite, steht)
   ===================================================================== */
{
  const m = B.mensch({ id: "b03b_schw", geschlecht: "w", pose: "halten", blick: -38, frisur: "zopf", haarfarbe: "braun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#f4f6f6" }, unterteil: { stueck: "hose", farbe: "weiss" }, schuhe: { stueck: "turnschuh" } } }, 84);
  /* Kasack: farbige Paspel am Ausschnitt; Namensschild; Medikamentenbecher */
  const P = m.z.punkte, k2 = m.k, hl = [P.hals[0] * k2, P.hals[1] * k2], br = [P.brust[0] * k2, P.brust[1] * k2];
  let ex = `<rect x="${r(br[0] + 1.2)}" y="${r(br[1] - 1.6)}" width="2.6" height="1.2" rx=".2" fill="#2f86c7"/>`;
  const h = m.z.handL.y < m.z.handR.y ? m.z.handL : m.z.handR;
  ex += `<g transform="translate(${r(h.x * k2)} ${r(h.y * k2 - 1)})"><path d="M-1.2 -2.6 L1.2 -2.6 L.9 0 L-.9 0 Z" fill="#fff" stroke="#c9d0d2" stroke-width=".15"/><circle cx="-.3" cy="-2.4" r=".45" fill="#e2574c"/><circle cx=".4" cy="-2.4" r=".45" fill="#f2f2f2" stroke="#ccc" stroke-width=".1"/></g>`;
  void hl;
  S.teil({ id: "kh_krankenschwester", de: "die Krankenschwester", syl: "KRAN-ken-schwes-ter", it: "l'infermiera", itSyl: "in-fer-MIE-ra", en: "nurse", x: 160, y: 148, kunst: m.svg + ex,
    tipp: "Heute sagt man meist „Pflegefachfrau“ oder „Pflegefachmann“." });
}

/* =====================================================================
   8 — DAS KRANKENBETT (Klinikbett, Seitenansicht, Kopf links)
   ===================================================================== */
const BETT = { x: 150, y: 180, x0: 86, x1: 214 };
/* Erst den Patienten bauen, damit die Matratze unter ihm liegt */
const pat = B.mensch({ id: "b03b_pat", geschlecht: "m", pose: "b03b_halbsitz", blick: 90, frisur: "kurz", haarfarbe: "braun", haut: "hell",
  kleidung: { oberteil: { stueck: "tshirt", farbe: "#bcd3e3" }, unterteil: { stueck: "hose", farbe: "#bcd3e3" } } }, 100);
const SITZ = { x: 128, y: 140 };   // Gesäß auf der Matratze
const PAT = { x: SITZ.x - pat.z.sitz.x * pat.k, y: SITZ.y - pat.z.sitz.y * pat.k };
const PP = (n) => [r(PAT.x + pat.z.punkte[n][0] * pat.k), r(PAT.y + pat.z.punkte[n][1] * pat.k)];
{
  const L = (x) => r(x - BETT.x), T = (y) => r(y - BETT.y);
  const hk = PP("hinterkopf"), sb = PP("schulterblatt"), le = PP("lende"), ge = PP("gesaess"), kk = PP("kniekehleL"), fe = PP("ferseL");
  /* Matratzen-Oberkante: flach von den Füßen bis zum Gesäß, dann das hochgestellte Rückenteil */
  const KNICK = { x: ge[0] - 6, y: ge[1] + 0.6 };
  const steig = (sb[1] - KNICK.y) / (sb[0] - KNICK.x);
  const oben = { x: BETT.x0 + 6, y: KNICK.y + (BETT.x0 + 6 - KNICK.x) * steig };
  void hk; void le; void kk; void fe;
  let k = schatten(0, 0, 70, 2.6, .32);
  /* Fahrgestell: Rollen mit Bremspedal, Rahmen, Hubsäulen */
  for (const x of [BETT.x0 + 10, BETT.x1 - 10]) {
    k += `<rect x="${L(x - 1)}" y="-9" width="2" height="5" fill="#6d757b"/><circle cx="${L(x)}" cy="-3" r="3" fill="#2f353b"/><circle cx="${L(x)}" cy="-3" r="1.2" fill="#9aa3aa"/>`;
    k += `<rect x="${L(x + 2.4)}" y="-6" width="4" height="1.4" rx=".5" fill="#d6332b"/>`;
  }
  k += `<rect x="${L(BETT.x0 + 6)}" y="-12" width="${BETT.x1 - BETT.x0 - 12}" height="3.4" rx="1" fill="${GRAU}"/>`;
  for (const x of [BETT.x0 + 34, BETT.x1 - 34]) k += `<rect x="${L(x - 3)}" y="-30" width="6" height="19" rx="1" fill="${WEISS_H}" stroke="#c3cacc" stroke-width=".3"/>`;
  k += `<rect x="${L(BETT.x0 + 30)}" y="-22" width="${BETT.x1 - BETT.x0 - 60}" height="3" rx="1" fill="#9aa3aa"/>`;
  /* Liegeflächen-Rahmen (unter der Matratze) */
  k += `<path d="M${L(BETT.x0 + 3)} ${T(SITZ.y + 6)} L${L(BETT.x1 - 3)} ${T(SITZ.y + 6)} L${L(BETT.x1 - 3)} ${T(SITZ.y + 10)} L${L(BETT.x0 + 3)} ${T(SITZ.y + 10)} Z" fill="${S.lg("rahmen", [[0, "#d9dfe2"], [1, "#a9b2b7"]])}"/>`;
  /* Matratze mit weißem Laken: flacher Teil + hochgestelltes Rückenteil */
  const my = SITZ.y + 0.6;
  k += `<path d="M${L(BETT.x1 - 4)} ${T(my)} L${L(KNICK.x)} ${T(my)} L${L(oben.x + 2)} ${T(oben.y)} Q${L(oben.x - 1)} ${T(oben.y + 1)} ${L(oben.x + 1)} ${T(oben.y + 5)} L${L(KNICK.x - 6)} ${T(my + 6)} L${L(BETT.x1 - 4)} ${T(my + 6)} Z" fill="${S.lg("laken", [[0, "#ffffff"], [1, "#dfe5e8"]])}" stroke="#c9d0d3" stroke-width=".3"/>`;
  k += `<path d="M${L(KNICK.x)} ${T(my + 0.4)} L${L(oben.x + 2)} ${T(oben.y + 0.4)}" stroke="#fff" stroke-width=".8"/>`;
  /* Kopfteil und Fußteil in Holzoptik (Buche), weiße Rahmen */
  const brett = (x, h, w) => `<rect x="${L(x - w / 2)}" y="${T(my - h)}" width="${w}" height="${h + 14}" rx="2" fill="${HOLZ}" stroke="#9c774b" stroke-width=".3"/><rect x="${L(x - w / 2 + 0.6)}" y="${T(my - h + 0.6)}" width="${w - 1.2}" height="1.4" rx=".6" fill="#fff" opacity=".35"/>`;
  k += brett(BETT.x0, 38, 4.6) + brett(BETT.x1, 22, 4.6);
  /* das untere Seitengitter (heruntergeklappt, am Kopfende) */
  k += `<rect x="${L(BETT.x0 + 8)}" y="${T(my + 8)}" width="40" height="5" rx="1.6" fill="none" stroke="#b9c1c5" stroke-width="1.1"/>`;
  k += `<line x1="${L(BETT.x0 + 20)}" y1="${T(my + 8)}" x2="${L(BETT.x0 + 20)}" y2="${T(my + 13)}" stroke="#b9c1c5" stroke-width=".7"/><line x1="${L(BETT.x0 + 36)}" y1="${T(my + 8)}" x2="${L(BETT.x0 + 36)}" y2="${T(my + 13)}" stroke="#b9c1c5" stroke-width=".7"/>`;
  /* Aufrichter (Galgen) mit Triangel über dem Kopfende */
  k += `<path d="M${L(BETT.x0 - 2)} ${T(my + 2)} L${L(BETT.x0 - 2)} ${T(78)} Q${L(BETT.x0 - 2)} ${T(74)} ${L(BETT.x0 + 3)} ${T(74)} L${L(BETT.x0 + 44)} ${T(74)}" stroke="${STAHL}" stroke-width="1.8" fill="none"/>`;
  k += `<path d="M${L(BETT.x0 + 40)} ${T(74)} L${L(BETT.x0 + 40)} ${T(84)}" stroke="#7d868c" stroke-width=".4"/><path d="M${L(BETT.x0 + 37)} ${T(90)} L${L(BETT.x0 + 40)} ${T(84)} L${L(BETT.x0 + 43)} ${T(90)} Z" fill="none" stroke="#2f6db5" stroke-width="1"/>`;
  S.teil({ id: "kh_krankenbett", de: "das Krankenbett", syl: "KRAN-ken-bett", it: "il letto d'ospedale", itSyl: "LET-to d'o-spe-DA-le", en: "hospital bed", x: BETT.x, y: BETT.y, steht: true, kunst: k,
    tipp: "Das Bett fährt elektrisch hoch und runter. Am Griff oben zieht man sich hoch." });
  BETT.my = my; BETT.oben = oben; BETT.knick = KNICK;
}

/* =====================================================================
   9 — DAS KISSEN (hinter Kopf und Schultern)
   ===================================================================== */
{
  const hk = PP("hinterkopf"), sb = PP("schulterblatt");
  const ux = hk[0] - BETT.oben.x, uy = hk[1];
  void ux;
  /* liegt auf dem Rückenteil, vom Kopfende bis unter die Schultern */
  const x0 = BETT.oben.x + 2, x1 = sb[0] + 4;
  const y0 = BETT.oben.y + (x0 - BETT.oben.x) * 0, s = (BETT.knick.y - BETT.oben.y) / (BETT.knick.x - BETT.oben.x);
  const yb = (x) => BETT.oben.y + (x - BETT.oben.x) * s;
  let k = `<path d="M${r(x0 - 1)} ${r(yb(x0) - 1)} Q${r(x0 - 3)} ${r(uy - 8)} ${r(x0 + 4)} ${r(uy - 10)} Q${r((x0 + x1) / 2)} ${r(uy - 9)} ${r(x1)} ${r(yb(x1) - 3)} Q${r(x1 + 1.6)} ${r(yb(x1))} ${r(x1 - 1)} ${r(yb(x1) + 0.6)} L${r(x0)} ${r(yb(x0) + 0.4)} Z" fill="${S.lg("kissen", [[0, "#ffffff"], [0.7, "#eef2f4"], [1, "#d3dbe0"]])}" stroke="#c9d0d3" stroke-width=".3"/>`;
  k += `<path d="M${r(x0 + 2)} ${r(uy - 7)} Q${r(x0 + 6)} ${r(uy - 4)} ${r(x0 + 4)} ${r(uy + 2)}" stroke="#d9e0e4" stroke-width=".5" fill="none"/>`;
  void y0;
  S.teil({ id: "kissen", de: "das Kissen", syl: "KIS-sen", it: "il cuscino", itSyl: "cu-SCI-no", en: "pillow", x: r(x0 + 4), y: r(yb(x0 + 4)), kunst: anker(k, r(x0 + 4), r(yb(x0 + 4))) });
}

/* =====================================================================
   10 — DER PATIENT (Klinikhemd, halb aufgerichtet, unter der Decke)
   ===================================================================== */
{
  /* Bändel des Klinikhemds im Nacken, Pflaster mit Zugang am Handrücken */
  const P = pat.z.punkte, k = pat.k;
  const hs = [P.hals[0] * k, P.hals[1] * k];
  let ex = `<path d="M${r(hs[0] - 1.6)} ${r(hs[1] - 0.4)} q-1.2 1 -.6 2.4 M${r(hs[0] - 1.6)} ${r(hs[1] - 0.4)} q-2 .4 -2.2 1.8" stroke="#8fb0c6" stroke-width=".35" fill="none"/>`;
  /* kleines Muster (Rauten) auf dem Hemd an der Brust */
  const br = [P.brust[0] * k, P.brust[1] * k];
  for (const [dx, dy] of [[-3, -1], [0, 1], [2, -2], [-1, 3], [3, 2]]) ex += `<path d="M${r(br[0] + dx)} ${r(br[1] + dy - 0.5)} l.5 .5 l-.5 .5 l-.5 -.5 Z" fill="#7fa3bf" opacity=".7"/>`;
  S.teil({ id: "kh_patient", de: "der Patient", syl: "Pa-ti-ENT", it: "il paziente", itSyl: "pa-ZIEN-te", en: "patient", x: PAT.x, y: PAT.y, kunst: pat.svg + ex,
    tipp: "Im Krankenhaus trägt man oft ein Klinikhemd." });
}

/* =====================================================================
   11 — DIE BETTDECKE (bis zur Hüfte, über die Matratzenkante hängend)
   ===================================================================== */
{
  const ge = PP("gesaess"), na = PP("nabel"), kn = PP("knieL"), ze = PP("zehL");
  const xe = BETT.x1 - 3, yk = BETT.my;
  /* Saum: schräg am Bauch entlang (Umschlag), dann über Knie und Zehen, an der Kante hängend */
  const s0 = [na[0] - 1.5, na[1] - 1.2];               // oben am Bauch
  const s1 = [ge[0] + 2, yk + 1];                       // unten an der Hüfte (Matratze)
  const kb = [kn[0], kn[1] - 2.6], zb = [ze[0] + 1, ze[1] - 2.2];
  let k = `<path d="M${r(s1[0] - 1)} ${r(yk + 9)} L${r(s1[0])} ${r(s1[1])} Q${r(s0[0] - 3)} ${r(s0[1] + 4)} ${r(s0[0])} ${r(s0[1])}`;
  k += ` Q${r((s0[0] + kb[0]) / 2)} ${r(Math.min(s0[1], kb[1]) - 1.2)} ${r(kb[0])} ${r(kb[1])} Q${r((kb[0] + zb[0]) / 2)} ${r(kb[1] + 2.2)} ${r(zb[0])} ${r(zb[1])}`;
  k += ` Q${r(zb[0] + 4)} ${r(zb[1] - 0.6)} ${r(xe)} ${r(yk - 1.4)} Q${r(xe + 1.6)} ${r(yk + 4)} ${r(xe + 0.4)} ${r(yk + 10)}`;
  k += ` Q${r((s1[0] + xe) / 2)} ${r(yk + 12.4)} ${r(s1[0] - 1)} ${r(yk + 9)} Z" fill="${S.lg("decke", [[0, "#f7f9fb"], [0.5, "#e6edf2"], [1, "#c9d5de"]])}" stroke="#b9c6cf" stroke-width=".3"/>`;
  /* Umschlag am Saum (Bettbezug) und weiche Falten */
  k += `<path d="M${r(s1[0] + 1.6)} ${r(s1[1] - 0.6)} Q${r(s0[0] - 0.6)} ${r(s0[1] + 4.6)} ${r(s0[0] + 2.6)} ${r(s0[1] + 1)} L${r(s0[0])} ${r(s0[1])} Q${r(s0[0] - 3)} ${r(s0[1] + 4)} ${r(s1[0])} ${r(s1[1])} Z" fill="#ffffff" stroke="#c4d0d8" stroke-width=".25"/>`;
  for (let i = 1; i < 5; i++) { const x = s1[0] + 6 + (xe - s1[0] - 6) * i / 5; k += `<path d="M${r(x)} ${r(yk + 10.6)} q1.4 -5 -.4 -9" stroke="#cdd8df" stroke-width=".5" fill="none"/>`; }
  k += `<path d="M${r(kb[0] - 8)} ${r(kb[1] + 3)} q6 -2.4 12 .4" stroke="#d3dde4" stroke-width=".5" fill="none"/>`;
  S.teil({ id: "bettdecke", de: "die Bettdecke", syl: "BETT-de-cke", it: "la coperta", itSyl: "co-PER-ta", en: "blanket", x: r(kb[0]), y: r(yk + 10), kunst: anker(k, r(kb[0]), r(yk + 10)) });
}

/* =====================================================================
   12 — DAS SEITENGITTER (oben, an der Fußhälfte)
   ===================================================================== */
{
  const x0 = BETT.x1 - 62, x1 = BETT.x1 - 6, yo = BETT.my - 10, yu = BETT.my + 6;
  let k = `<rect x="${x0}" y="${r(yo)}" width="${x1 - x0}" height="${r(yu - yo)}" rx="2.4" fill="none" stroke="${S.lg("gitter", [[0, "#e9edef"], [1, "#a9b2b7"]])}" stroke-width="1.6"/>`;
  for (let i = 1; i < 4; i++) { const x = x0 + (x1 - x0) * i / 4; k += `<line x1="${r(x)}" y1="${r(yo + 1)}" x2="${r(x)}" y2="${r(yu - 1)}" stroke="#c3cacd" stroke-width="1"/>`; }
  k += `<line x1="${x0 + 2}" y1="${r((yo + yu) / 2)}" x2="${x1 - 2}" y2="${r((yo + yu) / 2)}" stroke="#c3cacd" stroke-width=".9"/>`;
  k += `<rect x="${x0 + 3}" y="${r(yo - 0.4)}" width="${x1 - x0 - 6}" height=".5" fill="#fff" opacity=".8"/>`;
  k += `<rect x="${x1 - 10}" y="${r(yu - 3.6)}" width="6" height="2" rx=".6" fill="#2f6db5"/>`;
  S.teil({ oben: true, id: "seitengitter", de: "das Seitengitter", syl: "SEI-ten-git-ter", it: "la sponda del letto", itSyl: "SPON-da del LET-to", en: "bed rail", x: r((x0 + x1) / 2), y: r(yu), kunst: anker(k, r((x0 + x1) / 2), r(yu)),
    tipp: "Das Seitengitter schützt davor, aus dem Bett zu fallen." });
}

/* =====================================================================
   13 — DER NOTRUFKNOPF (Birnentaster am Spiralkabel, beim Kissen)
   ===================================================================== */
{
  const hk = PP("hinterkopf");
  const x = hk[0] + 14, y = BETT.my - 2;
  /* Spiralkabel von der Wandleiste: liegt vorn, fängt keinen Tipp */
  S.davor(`<path d="M126 71 Q122 100 ${r(x - 3)} ${r(y - 8)} L${r(x - 1.4)} ${r(y - 5.6)}" stroke="#e8ebec" stroke-width=".7" fill="none" stroke-dasharray="1 .35"/>`);
  let k = `<path d="M-3.2 -3.4 Q-3.6 -6 -1.6 -6 L1.6 -6 Q3.6 -6 3.2 -3.4 L2.4 0 L-2.4 0 Z" fill="${S.lg("taster", [[0, "#ffffff"], [1, "#d3d9db"]], 0, 0, 1, 0)}" stroke="#a9b2b7" stroke-width=".2"/>`;
  k += `<circle cx="0" cy="-3" r="1.4" fill="#d6332b"/><circle cx="-.4" cy="-3.4" r=".4" fill="#fff" opacity=".6"/>`;
  S.teil({ oben: true, id: "kh_notrufknopf", de: "der Notrufknopf", syl: "NOT-ruf-knopf", it: "il pulsante di chiamata", itSyl: "pul-SAN-te di chia-MA-ta", en: "call button", x, y, kunst: k + flaeche(-4, -7, 8, 7.6),
    tipp: "Drückt man den roten Knopf, kommt die Pflege ins Zimmer." });
}

/* =====================================================================
   14 — DER TROPF (Infusionsständer am Kopfende, Schlauch zur Hand)
   ===================================================================== */
{
  const X = 80, Y = 184;
  const hand = pat.z.handR.y > pat.z.handL.y ? pat.z.handR : pat.z.handL;
  const hx = PAT.x + hand.x * pat.k - X, hy = PAT.y + hand.y * pat.k - Y;
  let k = schatten(0, 0, 11, 1.2, .3);
  for (const [dx, dy] of [[-10, -.6], [10, -.6], [-6, 1], [6, 1], [0, -1.6]]) k += `<path d="M0 -3 L${dx} ${dy - 1.4}" stroke="#9aa3aa" stroke-width="1.2" stroke-linecap="round"/><circle cx="${dx}" cy="${dy - 0.6}" r="1.1" fill="#2f353b"/>`;
  k += `<rect x="-.7" y="-118" width="1.4" height="115" fill="${STAHL}"/>`;
  k += `<path d="M-6 -114 L6 -114 M-6 -114 l0 2 M6 -114 l0 2" stroke="#9aa3aa" stroke-width=".8" fill="none"/>`;
  /* Infusionsbeutel mit Etikett und Tropfkammer */
  k += `<path d="M-9.4 -111 L-2.6 -111 L-2.4 -96 Q-6 -93 -9.6 -96 Z" fill="#eef7fb" opacity=".9" stroke="#a9c8d2" stroke-width=".25"/>`;
  k += `<path d="M-9.4 -104 L-2.5 -104 L-2.4 -96 Q-6 -93 -9.6 -96 Z" fill="#d7eef7" opacity=".9"/>`;
  k += `<rect x="-8.6" y="-109" width="5.4" height="3.6" fill="#fff" stroke="#c9d0d2" stroke-width=".15"/><text x="-5.9" y="-106.6" font-size="1.1" text-anchor="middle" fill="#2f6db5" font-family="Arial">NaCl 0,9%</text>`;
  k += `<path d="M-6 -94 L-6 -91" stroke="#cfd6d9" stroke-width=".6"/><rect x="-7" y="-91" width="2" height="4.6" rx=".6" fill="#e9f2f5" stroke="#a9b2b7" stroke-width=".2"/><circle cx="-6" cy="-88.6" r=".35" fill="#7fc1df"/>`;
  k += `<path d="M-6 -86.4 Q-14 -50 ${r(hx - 4)} ${r(hy - 6)} L${r(hx)} ${r(hy)}" stroke="#e1ecef" stroke-width=".55" fill="none"/>`;
  k += `<rect x="-7.2" y="-74" width="2.4" height="1.6" rx=".4" fill="#5aa0d6"/>`;
  k += `<rect x="${r(hx - 1.6)}" y="${r(hy - 1.2)}" width="3.2" height="2" rx=".4" fill="#f4ede0" stroke="#d9cbb0" stroke-width=".15"/>`;
  S.teil({ id: "kh_tropf", de: "der Tropf", syl: "TROPF", it: "la flebo", itSyl: "FLE-bo", en: "drip", x: X, y: Y, kunst: k,
    tipp: "Am Tropf hängt eine Infusion — Flüssigkeit läuft langsam in die Vene." });
}

/* =====================================================================
   15 — DER ROLLSTUHL (vorne links, zusammengeklappte Fußstützen)
   ===================================================================== */
{
  let k = schatten(0, 0, 24, 1.8, .32);
  /* großes Hinterrad mit Greifreifen (Seitenansicht schräg) */
  k += `<ellipse cx="-8" cy="-17" rx="15" ry="17" fill="none" stroke="#2f353b" stroke-width="2.4"/>`;
  k += `<ellipse cx="-8" cy="-17" rx="12.6" ry="14.6" fill="none" stroke="${STAHL}" stroke-width=".9"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="-8" y1="-17" x2="${r(-8 + Math.cos(a) * 14)}" y2="${r(-17 + Math.sin(a) * 16)}" stroke="#c9cfd4" stroke-width=".25"/>`; }
  k += `<circle cx="-8" cy="-17" r="2" fill="#9aa3aa"/>`;
  /* Rahmen, Sitz, Rückenlehne, Armlehne */
  k += `<path d="M-14 -46 L-12 -18 L14 -18 L18 -4" stroke="${STAHL}" stroke-width="2" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="M-14 -46 Q-16 -48 -18 -46" stroke="#2f353b" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M-13.4 -44 L-11.8 -22 L-6 -22 L-7.4 -44 Z" fill="${S.lg("rlehne", [[0, "#3a4250"], [1, "#232831"]])}"/>`;
  k += `<path d="M-12 -22 L14 -22 L13 -18 L-12 -18 Z" fill="#2c323b"/>`;
  k += `<path d="M-10 -32 L10 -32 L12 -22" stroke="#9aa3aa" stroke-width="1.6" fill="none"/><rect x="-10" y="-33.6" width="18" height="2.4" rx="1.1" fill="#2f353b"/>`;
  /* Fußstütze und Lenkrad vorn */
  k += `<path d="M14 -18 L19 -6 L24 -6" stroke="${STAHL}" stroke-width="1.4" fill="none"/><rect x="19" y="-7" width="7" height="1.6" rx=".6" fill="#2f353b"/>`;
  k += `<path d="M16 -14 L16 -5" stroke="#9aa3aa" stroke-width="1"/><circle cx="16" cy="-3" r="3" fill="#2f353b"/><circle cx="16" cy="-3" r="1" fill="#9aa3aa"/>`;
  k += `<path d="M-20 -14 q4 -6 6 -2" stroke="#fff" stroke-width=".5" opacity=".4" fill="none"/>`;
  S.teil({ id: "kh_rollstuhl", de: "der Rollstuhl", syl: "ROLL-stuhl", it: "la sedia a rotelle", itSyl: "SE-dia a ro-TEL-le", en: "wheelchair", x: 26, y: 196, kunst: k });
}

/* =====================================================================
   16 — DER BESUCHERSTUHL (rechts, vor dem Fenster)
   ===================================================================== */
{
  let k = schatten(0, 0, 13, 1.4, .3);
  /* Freischwinger-Gestell aus Stahlrohr, Holz-Sitzschale gepolstert */
  k += `<path d="M-10 0 L12 0 Q14 0 13 -3 L10 -25" stroke="${STAHL}" stroke-width="1.6" fill="none"/>`;
  k += `<path d="M-10 0 L-7 -24 L-8 -46" stroke="${STAHL}" stroke-width="1.6" fill="none"/>`;
  k += `<path d="M-9 -27 L12 -26 Q14 -26 13.4 -23.6 L-9 -23 Z" fill="${S.lg("sitzp", [[0, "#5b8fa8"], [1, "#3e6d84"]])}"/>`;
  k += `<path d="M-10 -46 Q-9 -48 -6 -47.6 L-5 -30 Q-6 -27 -9 -27.4 Z" fill="${S.lg("lehne", [[0, "#5b8fa8"], [1, "#3e6d84"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-6 -36 L10 -36 L11 -26" stroke="#c9cfd4" stroke-width="1.2" fill="none"/><rect x="-6" y="-37.4" width="14" height="2" rx=".8" fill="${HOLZ}"/>`;
  /* Jacke des Besuchs über der Lehne */
  k += `<path d="M-11 -45 Q-7 -48 -4 -45 L-3 -34 Q-6 -31 -8 -33 L-10 -30 Q-13 -33 -12 -38 Z" fill="#a0583e"/><path d="M-7 -46 L-6 -36" stroke="#7d3f29" stroke-width=".4"/>`;
  S.teil({ id: "kh_besuchsstuhl", de: "der Besucherstuhl", syl: "Be-SU-cher-stuhl", it: "la sedia per i visitatori", itSyl: "SE-dia per i vi-si-ta-TO-ri", en: "visitor's chair", x: 296, y: 182, kunst: k });
}

/* =====================================================================
   17 — DER ARZT (Visite: liest am Fußende die Krankenakte)
   ===================================================================== */
const ARZT = { x: 250, y: 190 };
const arzt = B.mensch({ id: "b03b_arzt", geschlecht: "m", pose: "b03b_akte", blick: -44, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel",
  kleidung: { oberteil: { stueck: "arztkittel" }, unterteil: { stueck: "hose", farbe: "weiss" }, schuhe: { stueck: "turnschuh" } } }, 106);
{
  /* Stethoskop um den Hals, Namensschild, Kuli in der Brusttasche */
  const P = arzt.z.punkte, k = arzt.k, hl = [P.hals[0] * k, P.hals[1] * k], br = [P.brust[0] * k, P.brust[1] * k];
  let ex = `<path d="M${r(hl[0] - 3)} ${r(hl[1] + 1)} Q${r(hl[0] - 3.6)} ${r(br[1] + 4)} ${r(br[0] - 2)} ${r(br[1] + 6)} M${r(hl[0] + 3)} ${r(hl[1] + 1)} Q${r(hl[0] + 3.2)} ${r(br[1] + 2)} ${r(br[0] + 1)} ${r(br[1] + 3)}" stroke="#2f353b" stroke-width=".55" fill="none"/>`;
  ex += `<circle cx="${r(br[0] - 2)}" cy="${r(br[1] + 6.6)}" r="1.1" fill="${STAHL}" stroke="#7d868c" stroke-width=".2"/>`;
  ex += `<rect x="${r(br[0] + 2)}" y="${r(br[1] - 1)}" width="3" height="1.3" rx=".2" fill="#fff" stroke="#2f6db5" stroke-width=".15"/>`;
  S.teil({ id: "kh_arzt", de: "der Arzt", syl: "ARZT", it: "il medico", itSyl: "ME-di-co", en: "doctor", x: ARZT.x, y: ARZT.y, kunst: arzt.svg + ex,
    tipp: "Morgens ist Visite: Der Arzt geht von Bett zu Bett." });
}
{
  /* DIE KRANKENAKTE — Klemmbrett in seinen Händen (die „Kurve“) */
  const hL = arzt.z.handL, hR = arzt.z.handR, k = arzt.k;
  const h = hL.x < hR.x ? hL : hR;
  const cx = h.x * k + 2.4, cy = h.y * k;
  let a = `<g transform="rotate(-8)"><rect x="-5" y="-8" width="10" height="13" rx=".8" fill="#3d6f9a"/><rect x="-4.2" y="-6.6" width="8.4" height="11" fill="#fbfbf8"/>`;
  a += `<rect x="-2" y="-8.8" width="4" height="2" rx=".5" fill="${STAHL}"/>`;
  a += `<path d="M-3.4 -3 L-1.6 -4 L0 -2 L1.6 -5 L3.4 -3.6" stroke="#d6332b" stroke-width=".35" fill="none"/>`;
  for (let i = 0; i < 4; i++) a += `<line x1="-3.4" y1="${r(-0.6 + i * 1.3)}" x2="3.4" y2="${r(-0.6 + i * 1.3)}" stroke="#9aa3aa" stroke-width=".18"/>`;
  a += `</g>`;
  S.teil({ oben: true, id: "kh_krankenakte", de: "die Krankenakte", syl: "KRAN-ken-ak-te", it: "la cartella clinica", itSyl: "car-TEL-la CLI-ni-ca", en: "medical record", x: r(ARZT.x + cx - 1), y: r(ARZT.y + cy - 3), kunst: a,
    tipp: "In der Krankenakte stehen Fieber, Blutdruck und Medikamente." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/krankenhaus.js"));
console.log(aus);
